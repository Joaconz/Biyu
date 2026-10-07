-- US-41 (#231), ADR-036: la deuda vinculada no puede superar el gasto de origen. create_transaction
-- lo chequea antes del primer insert, con su propio mensaje; el trigger check_debt_rule (I7) sigue
-- como red de contención. Misma firma que 20261006000000: create or replace conserva los grants.
-- Se comparan los montos en la moneda del gasto: la deuda siempre tiene la misma moneda y el mismo
-- tipo de cambio (ADR-036 §4), así que deuda ≤ gasto implica amount_ars de la deuda ≤ el del gasto.

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
  v_first_period  date;
  v_tx_id         uuid;
  v_amount_ars    numeric(14,2);
  v_base          numeric(14,2);
  v_base_ars      numeric(14,2);
  v_shared        boolean := p_shared_person is not null or p_shared_amount is not null;
  v_shared_person text;
  i               int;
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
  if p_occurred_on > (now() at time zone 'America/Argentina/Buenos_Aires')::date then
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

  -- first_period se deriva del servidor (04-data-model §transactions), no lo manda el cliente.
  v_first_period := date_trunc('month', p_occurred_on)::date;

  insert into public.transactions (
    user_id, type, amount, currency, fx_rate, category_id, account_id,
    installments_count, first_period, description, occurred_on
  ) values (
    v_user, p_type, p_amount, p_currency, p_fx_rate, p_category_id, p_account_id,
    p_installments_count, v_first_period, p_description, p_occurred_on
  ) returning id, amount_ars into v_tx_id, v_amount_ars;

  v_base     := trunc(p_amount / p_installments_count, 2);
  v_base_ars := trunc(v_amount_ars / p_installments_count, 2);

  if v_base <= 0 or v_base_ars <= 0 then
    raise exception 'I4: cada cuota debe ser al menos 0,01' using errcode = 'check_violation';
  end if;

  for i in 1..p_installments_count loop
    insert into public.ledger_entries (
      user_id, transaction_id, period, installment_number, amount, amount_ars
    ) values (
      v_user, v_tx_id,
      (v_first_period + make_interval(months => i - 1))::date,
      i,
      case when i = p_installments_count then p_amount - v_base * (i - 1) else v_base end,
      case when i = p_installments_count then v_amount_ars - v_base_ars * (i - 1) else v_base_ars end
    );
  end loop;

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
