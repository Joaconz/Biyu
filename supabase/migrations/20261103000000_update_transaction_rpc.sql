-- US-84 (#284), ADR-043: editar un movimiento ya cargado es una sola RPC que regenera sus imputaciones.
--
-- 1. insert_ledger_entries: la regla de reparto de C3 (cuota base truncada a 2 decimales, la última
--    absorbe el resto) como función interna, revocada a todos los roles. Hoy la usa update_transaction;
--    insert_transaction_with_entries (alta y puesta al día) conserva su propio bucle porque US-80 (#372,
--    ADR-039) la redefine con otra firma: unificarlas queda para después de ese merge.
-- 2. update_transaction: reemplazo completo de monto, categoría, cuenta, cuotas, fecha y descripción.
--    No recibe tipo, moneda ni tipo de cambio: el tipo de cambio queda congelado (C5, ADR-002) y
--    amount_ars se recalcula con el mismo fx_rate. Borra y vuelve a crear todas las imputaciones en la
--    misma transacción de base (ADR-009).
--
-- Errores, en este orden: 42501 sin sesión; foreign_key_violation si no existe o es de otro usuario (no
-- se distinguen, C7); check_violation si está eliminada, es de una suscripción o tiene deuda vinculada
-- (ADR-043 §5), o es una compra empezada (§8); y después los de los campos, con los mismos mensajes que create_transaction.
-- Una categoría o cuenta archivada se acepta solo si es la que el movimiento ya tenía (ADR-043 §4).

-- ---------------------------------------------------------------------------
-- 1. Reparto de las cuotas (C3)
-- ---------------------------------------------------------------------------
create function public.insert_ledger_entries(
  p_user_id            uuid,
  p_transaction_id     uuid,
  p_first_period       date,
  p_amount             numeric,
  p_amount_ars         numeric,
  p_installments_count int
) returns void
language plpgsql
set search_path = ''
as $$
declare
  v_base     numeric(14,2) := trunc(p_amount / p_installments_count, 2);
  v_base_ars numeric(14,2) := trunc(p_amount_ars / p_installments_count, 2);
  i          int;
begin
  if v_base <= 0 or v_base_ars <= 0 then
    raise exception 'I4: cada cuota debe ser al menos 0,01' using errcode = 'check_violation';
  end if;

  for i in 1..p_installments_count loop
    insert into public.ledger_entries (
      user_id, transaction_id, period, installment_number, amount, amount_ars
    ) values (
      p_user_id, p_transaction_id,
      (p_first_period + make_interval(months => i - 1))::date,
      i,
      case when i = p_installments_count then p_amount - v_base * (i - 1) else v_base end,
      case when i = p_installments_count then p_amount_ars - v_base_ars * (i - 1) else v_base_ars end
    );
  end loop;
end $$;

revoke execute on function public.insert_ledger_entries(uuid, uuid, date, numeric, numeric, int)
  from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. update_transaction
-- ---------------------------------------------------------------------------
create function public.update_transaction(
  p_transaction_id     uuid,
  p_amount             numeric,
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
  v_tx           public.transactions%rowtype;
  v_account_type public.account_type;
  v_first_period date;
  v_amount_ars   numeric(14,2);
begin
  if v_user is null then
    raise exception 'update_transaction requiere una sesión' using errcode = '42501';
  end if;

  -- security definer se salta RLS: la pertenencia al usuario se chequea a mano. El bloqueo de fila
  -- ordena esta edición contra otra edición o una baja concurrentes (ADR-043 §6): al soltarse el
  -- bloqueo se vuelve a leer la fila, así que una baja que confirmó antes se ve acá.
  select * into v_tx
    from public.transactions
   where id = p_transaction_id and user_id = v_user
     for update;
  if not found then
    raise exception 'la transacción no existe o no te pertenece' using errcode = 'foreign_key_violation';
  end if;
  if v_tx.deleted_at is not null then
    raise exception 'Un movimiento eliminado no se puede editar' using errcode = 'check_violation';
  end if;
  if v_tx.subscription_id is not null then
    raise exception 'Un movimiento de una suscripción no se puede editar' using errcode = 'check_violation';
  end if;
  if exists (select 1 from public.debts where transaction_id = v_tx.id and user_id = v_user) then
    raise exception 'Un movimiento compartido no se puede editar' using errcode = 'check_violation';
  end if;
  -- ADR-043 §8: una compra en cuotas empezada (US-80, ADR-039) no se edita: sus imputaciones son solo las que
  -- faltan y regenerarlas desde cero las cambiaría. La columna installments_paid la agrega US-80; to_jsonb la
  -- lee sin fallar mientras no exista, y entonces la guarda no tiene efecto.
  if coalesce((to_jsonb(v_tx) ->> 'installments_paid')::int, 0) <> 0 then
    raise exception 'Una compra empezada no se puede editar' using errcode = 'check_violation';
  end if;

  -- Campos: las mismas reglas y mensajes que create_transaction (C6).
  if p_amount is null or p_amount = 'NaN'::numeric or p_amount <= 0 then
    raise exception 'I4: el monto debe ser mayor a cero' using errcode = 'check_violation';
  end if;
  if p_amount <> round(p_amount, 2) then
    raise exception 'I4: el monto admite hasta 2 decimales' using errcode = 'check_violation';
  end if;
  if p_occurred_on is null then
    raise exception 'occurred_on es obligatoria' using errcode = 'check_violation';
  end if;
  if p_occurred_on > public.argentina_today() then
    raise exception 'FR-06: la fecha no puede ser posterior a hoy' using errcode = 'check_violation';
  end if;
  if p_installments_count is null or p_installments_count < 1 or p_installments_count > 12 then
    raise exception 'las cuotas van de 1 a 12' using errcode = 'check_violation';
  end if;
  if v_tx.type = 'expense' and p_category_id is null then
    raise exception 'I8: un gasto requiere categoría' using errcode = 'check_violation';
  end if;

  select type into v_account_type
    from public.accounts
   where id = p_account_id and user_id = v_user
     and (archived_at is null or id = v_tx.account_id);
  if not found then
    raise exception 'la cuenta no existe, no es tuya o está archivada' using errcode = 'foreign_key_violation';
  end if;

  if p_category_id is not null and not exists (
    select 1 from public.categories
     where id = p_category_id and user_id = v_user
       and (archived_at is null or id = v_tx.category_id)
  ) then
    raise exception 'la categoría no existe, no es tuya o está archivada' using errcode = 'foreign_key_violation';
  end if;

  if p_installments_count > 1 and not (v_tx.type = 'expense' and v_account_type = 'credit_card') then
    raise exception 'I6: las cuotas solo aplican a gastos con cuenta credit_card'
      using errcode = 'check_violation';
  end if;

  v_first_period := date_trunc('month', p_occurred_on)::date;

  -- amount_ars es generada: se recalcula con el fx_rate congelado (C5).
  update public.transactions
     set amount = p_amount,
         category_id = p_category_id,
         account_id = p_account_id,
         installments_count = p_installments_count,
         first_period = v_first_period,
         occurred_on = p_occurred_on,
         description = nullif(public.trim_js(p_description), '')
   where id = v_tx.id
  returning amount_ars into v_amount_ars;

  delete from public.ledger_entries where transaction_id = v_tx.id and user_id = v_user;
  perform public.insert_ledger_entries(
    v_user, v_tx.id, v_first_period, p_amount, v_amount_ars, p_installments_count
  );

  return v_tx.id;
end $$;

revoke execute on function public.update_transaction(uuid, numeric, uuid, uuid, int, date, text)
  from public, anon;
grant execute on function public.update_transaction(uuid, numeric, uuid, uuid, int, date, text)
  to authenticated;
