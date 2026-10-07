-- US-52 (#210), ADR-030 y ADR-032: toda escritura sobre subscriptions pasa por RPC.
--
-- 1. subscriptions queda de solo lectura para el cliente, como transactions: sin INSERT, UPDATE ni
--    DELETE directos (CA-9). V2 no tiene "eliminar suscripción"; delete_account (ADR-026) las borra
--    como security definer.
-- 2. ADR-032: nombre de 1 a 60 caracteres y descripción de hasta 200 (char_length: puntos de código),
--    y el nombre único sin distinguir mayúsculas entre las no canceladas.
-- 3. insert_transaction_with_entries: la inserción de una transacción con sus imputaciones (C3, C4),
--    compartida por create_transaction y la puesta al día. No valida categoría ni cuenta activas:
--    eso es de quien la llama (una suscripción sobre una categoría archivada sigue generando).
-- 4. catch_up_subscriptions: la puesta al día (ADR-017, R1–R7), con p_today como parámetro para que
--    pgTAP fije la fecha. Interna: sin execute para anon ni authenticated.
-- 5. create_subscription: valida (ADR-032, I12, I13), inserta y pone al día esa suscripción, todo en
--    la misma transacción. Devuelve { subscription_id, generated }.

-- ---------------------------------------------------------------------------
-- 1. Solo lectura para authenticated (ADR-030)
-- ---------------------------------------------------------------------------
revoke insert, update, delete on public.subscriptions from authenticated;
drop policy insert_own_rows on public.subscriptions;
drop policy update_own_rows on public.subscriptions;
drop policy delete_own_rows on public.subscriptions;

-- ---------------------------------------------------------------------------
-- 2. Largos y nombre único sin distinguir mayúsculas (ADR-032)
-- ---------------------------------------------------------------------------
alter table public.subscriptions
  add constraint subscriptions_name_length check (char_length(name) between 1 and 60),
  add constraint subscriptions_description_length check (description is null or char_length(description) <= 200);

drop index public.subscriptions_user_name_not_cancelled_uq;
-- Se puede reutilizar el nombre de una suscripción cancelada.
create unique index subscriptions_user_lower_name_not_cancelled_uq
  on public.subscriptions (user_id, lower(name)) where status <> 'cancelled';

-- FK sin índice (schema-foreign-key-indexes): delete_account borra por cuenta y borrar una categoría
-- revisa las suscripciones que la usan. La puesta al día filtra por (user_id, status = 'active') y ya
-- la cubre el índice único parcial de arriba.
create index subscriptions_account_idx on public.subscriptions (account_id);
create index subscriptions_category_idx on public.subscriptions (category_id);

-- ---------------------------------------------------------------------------
-- Helpers internos: el hoy del servidor (ADR-021) y el rótulo de un mes para los mensajes.
-- ---------------------------------------------------------------------------
create function public.argentina_today() returns date
language sql
stable
set search_path = ''
as $$
  select (now() at time zone 'America/Argentina/Buenos_Aires')::date
$$;

-- "octubre 2024", como formatPeriodLong del cliente. Nombres fijos: to_char('TMMonth') depende de lc_time.
create function public.period_label(p_period date) returns text
language sql
immutable
set search_path = ''
as $$
  select (array['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto',
                'septiembre', 'octubre', 'noviembre', 'diciembre'])[extract(month from p_period)::int]
         || ' ' || extract(year from p_period)::int
$$;

revoke execute on function public.argentina_today() from public, anon, authenticated;
revoke execute on function public.period_label(date) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. insert_transaction_with_entries (ADR-030 "Inserción")
-- ---------------------------------------------------------------------------
-- first_period sale de occurred_on; cuotas 1..n-1 = total/n truncado y la última absorbe el resto,
-- en la moneda de la transacción y en ARS por separado (C3, ADR-013). Con subscription_id, choca
-- contra el índice único I11 sin error: devuelve null y no inserta nada (otra puesta al día ya la
-- generó, ADR-017). Las demás invariantes (I4, I5, I8, I14) quedan a cargo de los CHECK.
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
  p_subscription_period date default null
) returns uuid
language plpgsql
set search_path = ''
as $$
declare
  v_first_period date := date_trunc('month', p_occurred_on)::date;
  v_tx_id        uuid;
  v_amount_ars   numeric(14,2);
  v_base         numeric(14,2);
  v_base_ars     numeric(14,2);
  i              int;
begin
  insert into public.transactions (
    user_id, type, amount, currency, fx_rate, category_id, account_id,
    installments_count, first_period, description, occurred_on, subscription_id, subscription_period
  ) values (
    p_user_id, p_type, p_amount, p_currency, p_fx_rate, p_category_id, p_account_id,
    p_installments_count, v_first_period, p_description, p_occurred_on, p_subscription_id, p_subscription_period
  )
  on conflict (subscription_id, subscription_period) where subscription_id is not null do nothing
  returning id, amount_ars into v_tx_id, v_amount_ars;

  if v_tx_id is null then
    return null;
  end if;

  v_base     := trunc(p_amount / p_installments_count, 2);
  v_base_ars := trunc(v_amount_ars / p_installments_count, 2);

  if v_base <= 0 or v_base_ars <= 0 then
    raise exception 'I4: cada cuota debe ser al menos 0,01' using errcode = 'check_violation';
  end if;

  for i in 1..p_installments_count loop
    insert into public.ledger_entries (
      user_id, transaction_id, period, installment_number, amount, amount_ars
    ) values (
      p_user_id, v_tx_id,
      (v_first_period + make_interval(months => i - 1))::date,
      i,
      case when i = p_installments_count then p_amount - v_base * (i - 1) else v_base end,
      case when i = p_installments_count then v_amount_ars - v_base_ars * (i - 1) else v_base_ars end
    );
  end loop;

  return v_tx_id;
end $$;

revoke execute on function public.insert_transaction_with_entries(
  uuid, transaction_type, numeric, currency_code, numeric, uuid, uuid, int, date, text, uuid, date
) from public, anon, authenticated;

-- create_transaction pasa a usarla. Misma firma y mismas validaciones que 20261007000000: create or
-- replace conserva los grants. Solo cambia el bloque de inserción de la transacción y sus cuotas.
create or replace function public.create_transaction(
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
  p_shared_amount      numeric default null
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
    p_installments_count, p_occurred_on, p_description
  );

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

-- ---------------------------------------------------------------------------
-- 4. catch_up_subscriptions (ADR-017, ADR-030, ADR-031 §5)
-- ---------------------------------------------------------------------------
-- Por cada suscripción activa del usuario (o solo p_subscription_id), crea las ocurrencias vencidas
-- que no existen:
--   R1  períodos de generate_from_period a min(período de p_today, end_period), inclusive.
--   R2  se saltea un período que ya tiene transacción, aunque esté con baja lógica (I11).
--   R3  solo status = 'active'.
--   R4  occurred_on = día min(billing_day, días del mes) del período.
--   R5  el período corriente solo si p_today >= occurred_on.
--   R6  USD sin fx_rates del período: no se genera y va a "failed".
--   R7  monto, moneda, categoría y cuenta actuales de la suscripción.
-- Un monto en pesos fuera de numeric(14,2) o redondeado a 0,00 tampoco se genera y va a "failed".
-- Cada suscripción corre en su propio bloque (un savepoint): un error inesperado deshace esa
-- suscripción en esta corrida, se informa como 'unexpected_error' con su sqlstate, y las demás
-- siguen (ADR-030). Una ocurrencia que ya generó otra puesta al día concurrente no es error:
-- insert_transaction_with_entries devuelve null. La fila de cada suscripción queda bloqueada hasta
-- el final de la transacción: una pausa o edición concurrente espera y no la ve vieja (R3, R7).
-- Devuelve { generated, failed: [{ subscription_id, period 'YYYY-MM', reason[, sqlstate] }] }.
create function public.catch_up_subscriptions(
  p_user_id         uuid,
  p_today           date,
  p_subscription_id uuid default null
) returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  v_current      date;
  v_sub          public.subscriptions%rowtype;
  v_period       date;
  v_last         date;
  v_occurred_on  date;
  v_fx_rate      numeric(14,4);
  v_amount_ars   numeric;
  v_sub_count    int;
  v_sub_failed   jsonb;
  v_generated    int := 0;
  v_failed       jsonb := '[]'::jsonb;
begin
  if p_user_id is null or p_today is null then
    raise exception 'catch_up_subscriptions requiere usuario y fecha' using errcode = 'check_violation';
  end if;
  v_current := date_trunc('month', p_today)::date;

  for v_sub in
    select * from public.subscriptions s
     where s.user_id = p_user_id
       and s.status = 'active'                                            -- R3
       and (p_subscription_id is null or s.id = p_subscription_id)
     order by s.id
       for no key update of s
  loop
    v_sub_count  := 0;
    v_sub_failed := '[]'::jsonb;
    v_period     := null;
    begin
      v_last := least(v_current, coalesce(v_sub.end_period, v_current));  -- R1
      for v_period in
        select g::date
          from generate_series(v_sub.generate_from_period::timestamp, v_last::timestamp, interval '1 month') g
         where not exists (                                               -- R2
                 select 1 from public.transactions t
                  where t.subscription_id = v_sub.id and t.subscription_period = g::date)
         order by g
      loop
        v_occurred_on := v_period + (least(                               -- R4
          v_sub.billing_day,
          extract(day from (v_period + interval '1 month - 1 day'))::int
        ) - 1);
        continue when v_period = v_current and p_today < v_occurred_on;   -- R5

        v_fx_rate := null;
        if v_sub.currency = 'USD' then
          select f.ars_per_usd into v_fx_rate
            from public.fx_rates f
           where f.user_id = p_user_id and f.period = v_period;
          if v_fx_rate is null then                                       -- R6
            v_sub_failed := v_sub_failed || jsonb_build_object(
              'subscription_id', v_sub.id, 'period', to_char(v_period, 'YYYY-MM'), 'reason', 'missing_fx_rate');
            continue;
          end if;
        end if;

        -- La misma cuenta que la columna generada amount_ars; fuera de numeric(14,2) o en 0,00
        -- el insert fallaría (I4, DEF-012).
        v_amount_ars := case when v_fx_rate is null then v_sub.amount else round(v_sub.amount * v_fx_rate, 2) end;
        if v_amount_ars < 0.01 or v_amount_ars > 999999999999.99 then
          v_sub_failed := v_sub_failed || jsonb_build_object(
            'subscription_id', v_sub.id, 'period', to_char(v_period, 'YYYY-MM'), 'reason', 'amount_ars_out_of_range');
          continue;
        end if;

        if public.insert_transaction_with_entries(                        -- R7
             p_user_id, 'expense', v_sub.amount, v_sub.currency, v_fx_rate,
             v_sub.category_id, v_sub.account_id, 1, v_occurred_on, v_sub.name,
             v_sub.id, v_period
           ) is not null then
          v_sub_count := v_sub_count + 1;
        end if;
      end loop;
    exception
      -- Errores de concurrencia: que los reintente quien llama, no que queden como "failed".
      when serialization_failure or deadlock_detected then
        raise;
      when others then
        -- Lo de esta suscripción se deshizo: no cuenta como generado. El texto crudo va al log, no
        -- al cliente.
        raise log 'catch_up_subscriptions % %: % %', v_sub.id, v_period, sqlstate, sqlerrm;
        v_sub_count  := 0;
        v_sub_failed := v_sub_failed || jsonb_build_object(
          'subscription_id', v_sub.id, 'period', to_char(v_period, 'YYYY-MM'),
          'reason', 'unexpected_error', 'sqlstate', sqlstate);
    end;
    v_generated := v_generated + v_sub_count;
    v_failed    := v_failed || v_sub_failed;
  end loop;

  return jsonb_build_object('generated', v_generated, 'failed', v_failed);
end $$;

revoke execute on function public.catch_up_subscriptions(uuid, date, uuid) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 5. create_subscription (US-52, ADR-030, ADR-032)
-- ---------------------------------------------------------------------------
-- Los mensajes son los de US-52, los mismos que muestra el formulario (C6). p_billing_day es numeric
-- para que 1,5 llegue a la validación y se rechace con su mensaje, no con un error de tipo. El hoy
-- es el del servidor (ADR-021); ningún parámetro lo recibe.
create function public.create_subscription(
  p_name         text,
  p_amount       numeric,
  p_currency     currency_code,
  p_category_id  uuid,
  p_account_id   uuid,
  p_billing_day  numeric,
  p_start_period date,
  p_end_period   date default null,
  p_description  text default null
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user        uuid := auth.uid();
  v_today       date := public.argentina_today();
  v_current     date := date_trunc('month', v_today)::date;
  v_min_start   date := (v_current - interval '24 months')::date;
  v_max_start   date := (v_current + interval '12 months')::date;
  v_name        text := public.trim_js(p_name);
  v_description text := nullif(public.trim_js(p_description), '');
  v_id          uuid;
  v_result      jsonb;
begin
  if v_user is null then
    raise exception 'create_subscription requiere una sesión' using errcode = '42501';
  end if;

  if v_name is null or v_name = '' then
    raise exception 'Escribí un nombre' using errcode = 'check_violation';
  end if;
  if char_length(v_name) > 60 then
    raise exception 'El nombre admite hasta 60 caracteres' using errcode = 'check_violation';
  end if;

  if p_currency is null then
    raise exception 'Elegí una moneda' using errcode = 'check_violation';
  end if;
  if p_amount is null or p_amount = 'NaN'::numeric or p_amount <= 0 then
    raise exception 'El monto debe ser mayor a cero' using errcode = 'check_violation';
  end if;
  if p_amount <> round(p_amount, 2) then
    raise exception 'El monto admite hasta 2 decimales' using errcode = 'check_violation';
  end if;
  if p_amount > 999999999999.99 then
    raise exception '%', case when p_currency = 'USD'
                              then 'El monto máximo es USD 999.999.999.999,99'
                              else 'El monto máximo es $999.999.999.999,99' end
      using errcode = 'check_violation';
  end if;

  -- security definer se salta RLS: la pertenencia al usuario se chequea a mano. Una archivada o de
  -- otro usuario responde lo mismo (C7).
  if p_category_id is null then
    raise exception 'Elegí una categoría' using errcode = 'check_violation';
  end if;
  if not exists (
    select 1 from public.categories
     where id = p_category_id and user_id = v_user and archived_at is null
  ) then
    raise exception 'La categoría no está disponible' using errcode = 'foreign_key_violation';
  end if;
  if p_account_id is null then
    raise exception 'Elegí un medio de pago' using errcode = 'check_violation';
  end if;
  if not exists (
    select 1 from public.accounts
     where id = p_account_id and user_id = v_user and archived_at is null
  ) then
    raise exception 'El medio de pago no está disponible' using errcode = 'foreign_key_violation';
  end if;

  if p_billing_day is null then
    raise exception 'Indicá el día de cobro' using errcode = 'check_violation';
  end if;
  if p_billing_day = 'NaN'::numeric or p_billing_day <> trunc(p_billing_day)
     or p_billing_day < 1 or p_billing_day > 31 then                       -- I13
    raise exception 'El día de cobro va de 1 a 31' using errcode = 'check_violation';
  end if;

  if p_start_period is null then
    raise exception 'Elegí el mes de inicio' using errcode = 'check_violation';
  end if;
  if extract(day from p_start_period) <> 1 then
    raise exception 'El mes de inicio tiene que ser el día 1 del mes' using errcode = 'check_violation';
  end if;
  if p_start_period < v_min_start or p_start_period > v_max_start then
    raise exception 'El mes de inicio va de % a %', public.period_label(v_min_start), public.period_label(v_max_start)
      using errcode = 'check_violation';
  end if;
  if p_end_period is not null then
    if extract(day from p_end_period) <> 1 then
      raise exception 'El mes de fin tiene que ser el día 1 del mes' using errcode = 'check_violation';
    end if;
    if p_end_period < p_start_period then                                  -- I12
      raise exception 'El mes de fin no puede ser anterior al de inicio' using errcode = 'check_violation';
    end if;
    if p_end_period > date '2099-12-01' then
      raise exception 'El mes de fin puede ser como máximo diciembre 2099' using errcode = 'check_violation';
    end if;
  end if;

  if char_length(v_description) > 200 then
    raise exception 'La descripción admite hasta 200 caracteres' using errcode = 'check_violation';
  end if;

  if exists (
    select 1 from public.subscriptions
     where user_id = v_user and status <> 'cancelled' and lower(name) = lower(v_name)
  ) then
    raise exception 'Ya tenés una suscripción con ese nombre' using errcode = 'unique_violation';
  end if;

  begin
    insert into public.subscriptions (
      user_id, name, amount, currency, category_id, account_id, billing_day,
      start_period, end_period, generate_from_period, status, description
    ) values (
      v_user, v_name, p_amount, p_currency, p_category_id, p_account_id, p_billing_day::int,
      p_start_period, p_end_period, p_start_period, 'active', v_description
    ) returning id into v_id;
  exception when unique_violation then
    -- Dos altas simultáneas con el mismo nombre: la segunda pierde contra el índice.
    raise exception 'Ya tenés una suscripción con ese nombre' using errcode = 'unique_violation';
  end;

  v_result := public.catch_up_subscriptions(v_user, v_today, v_id);

  return jsonb_build_object('subscription_id', v_id, 'generated', (v_result ->> 'generated')::int);
end $$;

revoke execute on function public.create_subscription(
  text, numeric, currency_code, uuid, uuid, numeric, date, date, text
) from public, anon;
grant execute on function public.create_subscription(
  text, numeric, currency_code, uuid, uuid, numeric, date, date, text
) to authenticated;
