-- create_transaction: único camino de escritura de transacciones + imputaciones (C4).
-- V1: sin deuda; la deuda (gasto compartido) llega en V2 reemplazando esta función.
-- Revalida todo lo que el cliente ya validó con Zod (C6) y genera las imputaciones con la
-- misma regla que domain/installments.ts: truncar a 2 decimales y que la última cuota
-- absorba el resto, en amount y en amount_ars por separado (C3, I1, I1', ADR-013).

-- Tope de 12 cuotas (el schema solo tenía >= 1).
alter table transactions
  add constraint transactions_installments_max check (installments_count <= 12);

-- Los triggers I6/I7 del schema inicial usaban nombres sin calificar. create_transaction corre con
-- search_path vacío y los triggers heredan ese valor mientras dura la llamada, así que se
-- redefinen calificados (mismo comportamiento).
create or replace function public.check_installments_rule() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.installments_count > 1 and not (
    new.type = 'expense'
    and exists (select 1 from public.accounts a where a.id = new.account_id and a.type = 'credit_card')
  ) then
    raise exception 'I6: installments_count > 1 solo aplica a gastos con cuenta credit_card'
      using errcode = 'check_violation';
  end if;
  return new;
end $$;

create or replace function public.check_debt_rule() returns trigger
language plpgsql set search_path = '' as $$
declare
  tx public.transactions%rowtype;
begin
  if new.transaction_id is null then
    return null;
  end if;
  select * into tx from public.transactions where id = new.transaction_id for update;
  if tx.currency <> new.currency then
    raise exception 'I7: la deuda debe tener la misma moneda que su transacción'
      using errcode = 'check_violation';
  end if;
  if (select coalesce(sum(amount_ars), 0) from public.debts where transaction_id = new.transaction_id)
       > tx.amount_ars then
    raise exception 'I7: la suma de las deudas supera el monto de la transacción'
      using errcode = 'check_violation';
  end if;
  return null;
end $$;

create function public.create_transaction(
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

-- Supabase da EXECUTE a anon/authenticated por defecto en public: se cierra a anon.
revoke execute on function public.create_transaction(
  transaction_type, numeric, currency_code, numeric, uuid, uuid, int, date, text
) from public, anon;
grant execute on function public.create_transaction(
  transaction_type, numeric, currency_code, numeric, uuid, uuid, int, date, text
) to authenticated;
