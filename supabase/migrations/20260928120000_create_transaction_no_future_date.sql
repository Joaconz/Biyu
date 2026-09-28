-- create_transaction rechaza una fecha posterior a hoy (FR-06, US-09, ADR-021).
-- El cliente ya lo validaba (validateTransactionDraft, C6), pero la RPC aceptaba cualquier fecha.
-- "Hoy" es el día calendario de Argentina, no current_date: la sesión corre en UTC y entre las
-- 21:00 y las 23:59 de Argentina current_date ya es mañana.
-- create or replace conserva el dueño y los grants de 20260925000000 (EXECUTE solo a authenticated)
-- porque la firma es la misma. Si una migración futura cambia los parámetros, es otra función y hay
-- que repetir el revoke a public/anon.
-- Salvo por el chequeo de fecha, el cuerpo es idéntico al de 20260925000000_create_transaction_rpc.sql.

create or replace function public.create_transaction(
  p_type               transaction_type,
  p_amount             numeric,
  p_currency           currency_code,
  p_fx_rate            numeric,
  p_category_id        uuid,
  p_account_id         uuid,
  p_installments_count int,
  p_occurred_on        date,
  p_description        text default null
) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user         uuid := auth.uid();
  v_account_type public.account_type;
  v_first_period date;
  v_tx_id        uuid;
  v_amount_ars   numeric(14,2);
  v_base         numeric(14,2);
  v_base_ars     numeric(14,2);
  i              int;
begin
  if v_user is null then
    raise exception 'create_transaction requiere una sesión' using errcode = '42501';
  end if;

  if p_type is null or p_currency is null then
    raise exception 'type y currency son obligatorios' using errcode = 'check_violation';
  end if;
  if p_amount is null or p_amount <= 0 then
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
  if p_fx_rate is not null and round(p_fx_rate, 4) <= 0 then  -- la columna es numeric(14,4)
    raise exception 'I5: fx_rate debe ser mayor a cero' using errcode = 'check_violation';
  end if;
  if p_installments_count is null or p_installments_count < 1 or p_installments_count > 12 then
    raise exception 'las cuotas van de 1 a 12' using errcode = 'check_violation';
  end if;
  if p_type = 'expense' and p_category_id is null then
    raise exception 'I8: un gasto requiere categoría' using errcode = 'check_violation';
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

  return v_tx_id;
end $$;
