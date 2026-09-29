-- DEF-004 (Crítica, #145): numeric admite NaN y `NaN > 0` resulta verdadero en Postgres, así que
-- los check `amount > 0` / `fx_rate > 0` no lo filtraban. create_transaction() y un insert directo
-- a debts aceptaban NaN, y el dashboard terminaba mostrando "$NaN,undefined". Mismo defecto que ya
-- se había cerrado para fx_rates en 20260927200000_upsert_fx_rate_rpc.sql (C6); acá se cierra en
-- las demás tablas con columnas de monto/tipo de cambio: transactions, ledger_entries, debts,
-- subscriptions.

alter table public.transactions
  drop constraint transactions_amount_positive,
  add constraint transactions_amount_positive check (amount <> 'NaN'::numeric and amount > 0),          -- I4
  drop constraint transactions_fx_rate_positive,
  add constraint transactions_fx_rate_positive
    check (fx_rate is null or (fx_rate <> 'NaN'::numeric and fx_rate > 0));

-- amount_ars es columna generada a partir de amount y fx_rate: al no ser NaN esas dos, tampoco lo es.

alter table public.ledger_entries
  drop constraint ledger_entries_amount_positive,
  add constraint ledger_entries_amount_positive check (amount <> 'NaN'::numeric and amount > 0);        -- I4

alter table public.debts
  drop constraint debts_amount_positive,
  add constraint debts_amount_positive check (amount <> 'NaN'::numeric and amount > 0),                 -- I4
  drop constraint debts_fx_rate_positive,
  add constraint debts_fx_rate_positive
    check (fx_rate is null or (fx_rate <> 'NaN'::numeric and fx_rate > 0));

alter table public.subscriptions
  drop constraint subscriptions_amount_positive,
  add constraint subscriptions_amount_positive check (amount <> 'NaN'::numeric and amount > 0);         -- I4

-- create_transaction: mismo mensaje que ya usa upsert_fx_rate para NaN (id/firma sin cambios,
-- conserva los grants de 20260925000000 y el chequeo de fecha de 20260928120000).
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
