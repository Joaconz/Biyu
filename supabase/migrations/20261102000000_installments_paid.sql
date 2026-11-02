-- US-80 (#268), ADR-039: una compra en cuotas empezada se carga con las cuotas que faltan.
--
-- 1. transactions.installments_paid: cuotas pagadas antes de cargar la compra (0 en todas las
--    existentes). Modifica I2: hay installments_count - installments_paid imputaciones, numeradas de
--    installments_paid + 1 a installments_count.
-- 2. insert_transaction_with_entries suma p_installments_paid. Con valor (aunque sea 0) calcula el
--    calendario de N cuotas sobre el total (C3, ADR-013), guarda solo las últimas N - K desde el mes de
--    hoy en Argentina (ADR-021) y deja en transactions.amount lo que falta pagar, así I1 e I1' valen.
-- 3. create_transaction suma p_installments_paid con las validaciones de ADR-039 §3 (C6).
-- 4. import_transactions lo pasa desde la clave installments_paid de cada fila (ADR-035).
-- 5. La vista de integridad compara también la cantidad de imputaciones (I2).
-- Agregar un parámetro cambia la firma: se borra la función y se vuelven a dar los permisos.

alter table public.transactions
  add column installments_paid int not null default 0,
  add constraint transactions_installments_paid_range
    check (installments_paid >= 0 and installments_paid < installments_count);

comment on column public.transactions.installments_paid is
  'Cuotas ya pagadas al cargar la compra (ADR-039). Solo se guardan las imputaciones installments_paid + 1 .. installments_count.';

create or replace view public.ledger_integrity_violations with (security_invoker = true) as
select
  t.id                                   as transaction_id,
  t.user_id,
  t.amount                               as transaction_amount,
  coalesce(sum(le.amount), 0)            as entries_amount,
  t.amount_ars                           as transaction_amount_ars,
  coalesce(sum(le.amount_ars), 0)        as entries_amount_ars
from public.transactions t
left join public.ledger_entries le on le.transaction_id = t.id
group by t.id
having coalesce(sum(le.amount), 0) <> t.amount
    or coalesce(sum(le.amount_ars), 0) <> t.amount_ars
    or count(le.id) <> t.installments_count - t.installments_paid
    or coalesce(min(le.installment_number), t.installments_paid + 1) <> t.installments_paid + 1;

drop function public.insert_transaction_with_entries(
  uuid, transaction_type, numeric, currency_code, numeric, uuid, uuid, int, date, text, uuid, date, uuid
);

create function public.insert_transaction_with_entries(
  p_user_id             uuid,
  p_type                transaction_type,
  p_amount              numeric,
  p_currency            currency_code,
  p_fx_rate             numeric,
  p_category_id         uuid,
  p_account_id          uuid,
  p_installments_count  int,
  p_occurred_on         date,
  p_description         text,
  p_subscription_id     uuid default null,
  p_subscription_period date default null,
  p_request_id          uuid default null,
  p_installments_paid   int default null
) returns uuid
language plpgsql
set search_path = ''
as $$
declare
  -- ADR-039: con p_installments_paid (aunque sea 0) la compra es "empezada": sus cuotas se imputan
  -- desde el mes de hoy en Argentina y no desde el de occurred_on. Con null, como siempre.
  v_paid         int := coalesce(p_installments_paid, 0);
  v_pending      int := p_installments_count - coalesce(p_installments_paid, 0);  -- ADR-039: el reparto en pesos es sobre lo que falta (I1')
  v_first_period date := date_trunc('month', case when p_installments_paid is null then p_occurred_on else public.argentina_today() end)::date;
  v_total_base   numeric(14,2) := trunc(p_amount / p_installments_count, 2);
  v_stored       numeric(14,2) := p_amount - trunc(p_amount / p_installments_count, 2) * coalesce(p_installments_paid, 0);
  v_tx_id        uuid;
  v_amount_ars   numeric(14,2);
  v_base         numeric(14,2);
  v_base_ars     numeric(14,2);
  i              int;
begin
  -- on conflict admite un solo índice como árbitro. Una fila con clave nunca es de una suscripción:
  -- solo create_transaction manda p_request_id, y nunca con p_subscription_id (se ignoraría).
  if p_request_id is not null then
    insert into public.transactions (
      user_id, type, amount, currency, fx_rate, category_id, account_id,
      installments_count, installments_paid, first_period, description, occurred_on, request_id
    ) values (
      p_user_id, p_type, v_stored, p_currency, p_fx_rate, p_category_id, p_account_id,
      p_installments_count, v_paid, v_first_period, p_description, p_occurred_on, p_request_id
    )
    on conflict (user_id, request_id) where request_id is not null do nothing
    returning id, amount_ars into v_tx_id, v_amount_ars;
  else
    insert into public.transactions (
      user_id, type, amount, currency, fx_rate, category_id, account_id,
      installments_count, installments_paid, first_period, description, occurred_on, subscription_id, subscription_period
    ) values (
      p_user_id, p_type, v_stored, p_currency, p_fx_rate, p_category_id, p_account_id,
      p_installments_count, v_paid, v_first_period, p_description, p_occurred_on, p_subscription_id, p_subscription_period
    )
    on conflict (subscription_id, subscription_period) where subscription_id is not null do nothing
    returning id, amount_ars into v_tx_id, v_amount_ars;
  end if;

  if v_tx_id is null then
    return null;
  end if;

  v_base     := v_total_base;
  v_base_ars := trunc(v_amount_ars / v_pending, 2);

  if v_base <= 0 or v_base_ars <= 0 then
    raise exception 'I4: cada cuota debe ser al menos 0,01' using errcode = 'check_violation';
  end if;

  for i in v_paid + 1..p_installments_count loop
    insert into public.ledger_entries (
      user_id, transaction_id, period, installment_number, amount, amount_ars
    ) values (
      p_user_id, v_tx_id,
      (v_first_period + make_interval(months => i - v_paid - 1))::date,
      i,
      case when i = p_installments_count then v_stored - v_base * (v_pending - 1) else v_base end,
      case when i = p_installments_count then v_amount_ars - v_base_ars * (v_pending - 1) else v_base_ars end
    );
  end loop;

  return v_tx_id;
end $$;

revoke execute on function public.insert_transaction_with_entries(
  uuid, transaction_type, numeric, currency_code, numeric, uuid, uuid, int, date, text, uuid, date, uuid, int
) from public, anon, authenticated;

drop function public.create_transaction(
  transaction_type, numeric, currency_code, numeric, uuid, uuid, int, date, text, text, numeric, uuid
);

create function public.create_transaction(
  p_type               transaction_type,
  p_amount             numeric,
  p_currency           currency_code,
  p_fx_rate            numeric,
  p_category_id        uuid,
  p_account_id         uuid,
  p_installments_count int,
  p_occurred_on        date,
  p_description        text default null,
  p_shared_person      text default null,
  p_shared_amount      numeric default null,
  p_request_id         uuid default null,
  p_installments_paid  int default null
) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user          uuid := auth.uid();
  v_account_type  public.account_type;
  v_tx_id         uuid;
  v_shared        boolean := p_shared_person is not null or p_shared_amount is not null;
  v_shared_person text;
begin
  if v_user is null then
    raise exception 'create_transaction requiere una sesión' using errcode = '42501';
  end if;

  -- ADR-034: la clave se busca antes de validar. Un reintento de algo ya guardado devuelve su id
  -- aunque, mientras tanto, la categoría se haya archivado o el contenido sea otro (CA-13, CA-14).
  -- Filtra por el usuario de la sesión: la clave de otro nunca devuelve una fila ajena (C7, CA-12).
  if p_request_id is not null then
    select id into v_tx_id
      from public.transactions
     where user_id = v_user and request_id = p_request_id;
    if found then
      return v_tx_id;
    end if;
  end if;

  if p_type is null or p_currency is null then
    raise exception 'type y currency son obligatorios' using errcode = 'check_violation';
  end if;
  if p_amount is null or p_amount = 'NaN'::numeric or p_amount <= 0 then
    raise exception 'I4: el monto debe ser mayor a cero' using errcode = 'check_violation';
  end if;
  if p_amount <> round(p_amount, 2) then
    raise exception 'I4: el monto admite hasta 2 decimales' using errcode = 'check_violation';
  end if;
  if p_occurred_on is null then
    raise exception 'occurred_on es obligatoria' using errcode = 'check_violation';
  end if;
  -- FR-06: una fecha pasada es válida (US-09); una posterior a hoy, no. Las cuotas futuras no
  -- pasan por acá: son imputaciones, y occurred_on sigue siendo el día de la compra.
  if p_occurred_on > public.argentina_today() then
    raise exception 'FR-06: la fecha no puede ser posterior a hoy' using errcode = 'check_violation';
  end if;
  if (p_currency = 'USD') <> (p_fx_rate is not null) then
    raise exception 'I5: fx_rate es obligatorio si y solo si la moneda es USD'
      using errcode = 'check_violation';
  end if;
  if p_fx_rate is not null and (p_fx_rate = 'NaN'::numeric or round(p_fx_rate, 4) <= 0) then  -- la columna es numeric(14,4)
    raise exception 'I5: fx_rate debe ser mayor a cero' using errcode = 'check_violation';
  end if;
  if p_installments_count is null or p_installments_count < 1 or p_installments_count > 12 then
    raise exception 'las cuotas van de 1 a 12' using errcode = 'check_violation';
  end if;
  -- Compra en cuotas empezada (ADR-039 §3), en este orden. El número de cuotas pagadas lo agrega el
  -- cliente a su texto: el mensaje del servidor es fijo.
  if p_installments_paid is not null then
    if p_installments_count = 1 then
      raise exception 'Las cuotas ya pagadas solo van en una compra en cuotas' using errcode = 'check_violation';
    end if;
    if p_installments_paid < 0 or p_installments_paid >= p_installments_count then
      raise exception 'Las cuotas ya pagadas tienen que ser menos que el total de cuotas' using errcode = 'check_violation';
    end if;
    if p_installments_paid > (extract(year from public.argentina_today())::int * 12 + extract(month from public.argentina_today())::int)
                           - (extract(year from p_occurred_on)::int * 12 + extract(month from p_occurred_on)::int) then
      raise exception 'Con esa fecha todavía no puede haber tantas cuotas pagadas' using errcode = 'check_violation';
    end if;
    if v_shared then
      raise exception 'Una compra empezada no se puede compartir' using errcode = 'check_violation';
    end if;
  end if;
  if p_type = 'expense' and p_category_id is null then
    raise exception 'I8: un gasto requiere categoría' using errcode = 'check_violation';
  end if;

  -- Deuda vinculada (ADR-036 §2-§5). Se valida antes del primer insert: un rechazo no deja filas.
  -- Moneda, tipo de cambio, fecha y dirección no se aceptan del cliente: salen de la transacción.
  if v_shared then
    if p_shared_person is null or p_shared_amount is null then
      raise exception 'Un gasto compartido necesita persona y monto' using errcode = 'check_violation';
    end if;
    if p_type <> 'expense' then
      raise exception 'Un ingreso no se puede compartir' using errcode = 'check_violation';
    end if;
    v_shared_person := public.trim_js(p_shared_person);
    if v_shared_person = '' then
      raise exception 'Ingresá con quién compartiste el gasto' using errcode = 'check_violation';
    end if;
    if char_length(v_shared_person) > 60 then
      raise exception 'La persona admite hasta 60 caracteres' using errcode = 'check_violation';
    end if;
    if p_shared_amount = 'NaN'::numeric or p_shared_amount <= 0 then
      raise exception 'I4: el monto de la deuda debe ser mayor a cero' using errcode = 'check_violation';
    end if;
    if p_shared_amount <> round(p_shared_amount, 2) then
      raise exception 'I4: el monto de la deuda admite hasta 2 decimales' using errcode = 'check_violation';
    end if;
    if p_shared_amount > p_amount then
      raise exception 'I7: la deuda no puede superar el monto del gasto' using errcode = 'check_violation';
    end if;
    -- Sin esto, la fila violaría debts_amount_ars_positive con un error crudo (DEF-013).
    if p_currency = 'USD' and round(p_shared_amount * p_fx_rate, 2) = 0 then
      raise exception 'I4: la deuda en pesos daría menos de $0,01' using errcode = 'check_violation';
    end if;
  end if;

  -- security definer se salta RLS: la pertenencia al usuario se chequea a mano.
  select type into v_account_type
    from public.accounts
   where id = p_account_id and user_id = v_user and archived_at is null;
  if not found then
    raise exception 'la cuenta no existe, no es tuya o está archivada' using errcode = 'foreign_key_violation';
  end if;

  if p_category_id is not null and not exists (
    select 1 from public.categories
     where id = p_category_id and user_id = v_user and archived_at is null
  ) then
    raise exception 'la categoría no existe, no es tuya o está archivada' using errcode = 'foreign_key_violation';
  end if;

  if p_installments_count > 1 and not (p_type = 'expense' and v_account_type = 'credit_card') then
    raise exception 'I6: las cuotas solo aplican a gastos con cuenta credit_card'
      using errcode = 'check_violation';
  end if;

  v_tx_id := public.insert_transaction_with_entries(
    v_user, p_type, p_amount, p_currency, p_fx_rate, p_category_id, p_account_id,
    p_installments_count, p_occurred_on, p_description, null, null, p_request_id, p_installments_paid
  );

  -- Solo con clave puede volver null: otra llamada con la misma clave confirmó primero (CA-10).
  -- Su transacción ya trae sus imputaciones y su deuda: no se inserta nada más.
  if v_tx_id is null then
    select id into strict v_tx_id
      from public.transactions
     where user_id = v_user and request_id = p_request_id;
    return v_tx_id;
  end if;

  -- Una deuda por gasto, por el monto que indicó el usuario, no una por cuota (ADR-036 §6).
  -- El tope de US-41 ya se chequeó arriba; check_debt_rule (I7) sigue como red de contención.
  if v_shared then
    insert into public.debts (
      user_id, transaction_id, person, amount, currency, fx_rate, direction, status, incurred_on, notes
    ) values (
      v_user, v_tx_id, v_shared_person, p_shared_amount, p_currency, p_fx_rate,
      'owed_to_me', 'pending', p_occurred_on, null
    );
  end if;

  return v_tx_id;
end $$;

revoke execute on function public.create_transaction(
  transaction_type, numeric, currency_code, numeric, uuid, uuid, int, date, text, text, numeric, uuid, int
) from public, anon;
grant execute on function public.create_transaction(
  transaction_type, numeric, currency_code, numeric, uuid, uuid, int, date, text, text, numeric, uuid, int
) to authenticated;

create or replace function public.import_transactions(p_import_id uuid, p_rows jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user     uuid := auth.uid();
  v_count    int;
  v_inserted uuid;
  v_owner    uuid;
  v_saved    jsonb;
  v_row      jsonb;
  v_tx_id    uuid;
  v_rows     jsonb := '[]'::jsonb;
  v_imported int := 0;
  v_result   jsonb;
begin
  if v_user is null then
    raise exception 'import_transactions requiere una sesión' using errcode = '42501';
  end if;
  if p_import_id is null then
    raise exception 'falta el identificador de la importación' using errcode = 'check_violation';
  end if;
  if p_rows is null or jsonb_typeof(p_rows) <> 'array' then
    raise exception 'las filas tienen que ser una lista' using errcode = 'check_violation';
  end if;
  v_count := jsonb_array_length(p_rows);
  if v_count < 1 or v_count > 500 then
    raise exception 'una importación lleva de 1 a 500 filas' using errcode = 'check_violation';
  end if;

  -- Lo primero: reservar el id. Si otra llamada con el mismo id todavía corre, este insert espera a
  -- que termine (ADR-035): si confirmó, hay conflicto y se devuelve su resultado; si se deshizo, el
  -- insert entra y la importación se hace ahora. Dos llamadas nunca importan dos veces.
  insert into public.imports (id, user_id, sent_rows)
  values (p_import_id, v_user, v_count)
  on conflict (id) do nothing
  returning id into v_inserted;

  if v_inserted is null then
    select user_id, result into v_owner, v_saved from public.imports where id = p_import_id;
    -- El id de otro usuario se rechaza sin revelar nada de esa importación (C7).
    if v_owner is distinct from v_user then
      raise exception 'el identificador de la importación no es válido' using errcode = 'check_violation';
    end if;
    return coalesce(v_saved, '{}'::jsonb) || jsonb_build_object('already_imported', true);
  end if;

  for v_row in select value from jsonb_array_elements(p_rows) loop
    begin
      -- La lectura y el cast de cada campo van dentro del bloque: un elemento mal formado ("abc",
      -- una clave que falta, cuotas "3.5") rechaza su fila, no el lote. Los montos se leen como
      -- texto con ->> aunque lleguen como número JSON (C2).
      v_tx_id := public.create_transaction(
        p_type               => (v_row ->> 'type')::public.transaction_type,
        p_amount             => (v_row ->> 'amount')::numeric,
        p_currency           => (v_row ->> 'currency')::public.currency_code,
        p_fx_rate            => (v_row ->> 'fx_rate')::numeric,
        p_category_id        => (v_row ->> 'category_id')::uuid,
        p_account_id         => (v_row ->> 'account_id')::uuid,
        p_installments_count => (v_row ->> 'installments_count')::int,
        p_occurred_on        => (v_row ->> 'occurred_on')::date,
        p_description        => v_row ->> 'description',
        p_installments_paid  => (v_row ->> 'installments_paid')::int
      );
      v_rows := v_rows || jsonb_build_object('row', v_row -> 'row', 'status', 'imported', 'transaction_id', v_tx_id);
      v_imported := v_imported + 1;
    exception when others then
      -- Un error transitorio o de la base (serialización, deadlock, lock_timeout, recursos) no es de
      -- los datos de la fila: aborta el lote entero, no queda nada escrito y el reintento con el mismo
      -- id la importa (§7). Si se atrapara, la fila quedaría rechazada y el id, consumido.
      if sqlstate in ('40001', '40P01', '55P03') or left(sqlstate, 2) in ('53', '54', '57', '58', 'XX') then
        raise;
      end if;
      v_rows := v_rows || jsonb_build_object(
        'row', v_row -> 'row', 'status', 'rejected', 'error_code', sqlstate, 'error_message', sqlerrm
      );
    end;
  end loop;

  v_result := jsonb_build_object(
    'import_id', p_import_id,
    'sent_rows', v_count,
    'imported_rows', v_imported,
    'rows', v_rows
  );
  update public.imports set imported_rows = v_imported, result = v_result where id = p_import_id;

  return v_result || jsonb_build_object('already_imported', false);
end $$;

revoke execute on function public.import_transactions(uuid, jsonb) from public, anon;
grant execute on function public.import_transactions(uuid, jsonb) to authenticated;
