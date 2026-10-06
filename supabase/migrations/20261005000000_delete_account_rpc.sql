-- DEF-011 (#152): eliminar una cuenta (medio de pago) es un borrado físico, con todo lo que
-- cuelga de ella: sus transacciones (también las que tienen baja lógica), sus imputaciones, las
-- deudas vinculadas a esas transacciones y las suscripciones que se cobran en esa cuenta.
-- Es una excepción explícita a C10 (ADR-026): archivar sigue siendo la baja que conserva historia.
-- Va en una RPC porque authenticated no puede escribir transactions ni ledger_entries (C4), y
-- así el borrado es atómico: o se va todo o no se va nada.

-- Índices de FK (schema-foreign-key-indexes): el borrado y el trigger de I6 de
-- 20261002000000_fix_db_defects.sql buscan transacciones por cuenta, y el borrado de una
-- transacción revisa las deudas que la referencian.
create index transactions_account_idx on public.transactions (account_id);
create index debts_transaction_idx on public.debts (transaction_id) where transaction_id is not null;

create function public.delete_account(p_account_id uuid)
returns int
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user    uuid := auth.uid();
  v_tx_ids  uuid[];
  v_deleted int;
begin
  if v_user is null then
    raise exception 'delete_account requiere una sesión' using errcode = '42501';
  end if;
  if p_account_id is null then
    raise exception 'p_account_id es obligatorio' using errcode = 'check_violation';
  end if;

  -- Bloquea la cuenta: un create_transaction concurrente sobre ella espera a que esto termine.
  perform 1 from public.accounts where id = p_account_id and user_id = v_user for update;
  if not found then
    raise exception 'la cuenta no existe o no te pertenece' using errcode = 'foreign_key_violation';
  end if;

  v_tx_ids := array(
    select t.id
    from public.transactions t
    where t.user_id = v_user
      and (t.account_id = p_account_id
           or t.subscription_id in (
             select s.id from public.subscriptions s where s.account_id = p_account_id and s.user_id = v_user)));

  delete from public.debts d where d.user_id = v_user and d.transaction_id = any (v_tx_ids);

  -- ledger_entries se va por el on delete cascade de su FK a transactions.
  delete from public.transactions t where t.id = any (v_tx_ids);
  get diagnostics v_deleted = row_count;

  delete from public.subscriptions s where s.account_id = p_account_id and s.user_id = v_user;
  delete from public.accounts a where a.id = p_account_id and a.user_id = v_user;

  return v_deleted;
end $$;

revoke execute on function public.delete_account(uuid) from public, anon;
grant execute on function public.delete_account(uuid) to authenticated;
