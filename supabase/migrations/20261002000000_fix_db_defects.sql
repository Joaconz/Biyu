-- Tres defectos del schema encontrados en la ejecución adversarial de V1 (#75).

-- ---------------------------------------------------------------------------
-- DEF-016 (#157): check_debt_rule hace "select … for update" sobre transactions, y FOR UPDATE
-- pide privilegio UPDATE. authenticated no lo tiene (C4: transactions solo se escribe vía RPC),
-- así que el trigger rechazaba toda deuda vinculada, válida o no, con 42501. Pasa a security
-- definer como create_transaction. No abre nada: el FK compuesto (transaction_id, user_id) y la
-- política de insert de debts (user_id = auth.uid()) ya garantizan que la transacción es propia,
-- y el filtro por user_id de abajo lo repite por las dudas. Mismo comportamiento I7.
-- ---------------------------------------------------------------------------
create or replace function public.check_debt_rule() returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  tx public.transactions%rowtype;
begin
  if new.transaction_id is null then
    return null;
  end if;
  select * into tx from public.transactions
    where id = new.transaction_id and user_id = new.user_id
    for update;
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

revoke execute on function public.check_debt_rule() from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- DEF-009 (#150): I6 solo se controlaba al escribir transactions. Cambiar una cuenta
-- credit_card con compras en cuotas a otro tipo dejaba esas compras violando I6. Se cuentan
-- también las transacciones con baja lógica: siguen siendo filas de esa cuenta (C10).
-- Corre con los permisos del que edita: RLS ya le deja ver todas sus transacciones.
-- ---------------------------------------------------------------------------
create function public.check_account_type_change() returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.type <> 'credit_card' and exists (
    select 1 from public.transactions t
    where t.account_id = new.id and t.installments_count > 1
  ) then
    raise exception 'I6: la cuenta tiene compras en cuotas, no puede dejar de ser tarjeta de crédito'
      using errcode = 'check_violation';
  end if;
  return new;
end $$;

create trigger accounts_type_change_rule
  before update of type on public.accounts
  for each row
  when (old.type is distinct from new.type)
  execute function public.check_account_type_change();

-- ---------------------------------------------------------------------------
-- DEF-019: "Salud" y "salud" podían quedar activas a la vez. El índice único pasa a comparar sin
-- distinguir mayúsculas. Los duplicados que ya existan se resuelven archivando todos menos el
-- más viejo: archivar no pierde nada (las transacciones siguen apuntando a su categoría, US-44)
-- y el usuario puede renombrarla y reactivarla. Sin esto, el índice no se puede crear.
-- ---------------------------------------------------------------------------
update public.categories c
set archived_at = now()
where c.archived_at is null
  and exists (
    select 1 from public.categories older
    where older.user_id = c.user_id
      and older.archived_at is null
      and lower(older.name) = lower(c.name)
      and (older.created_at, older.id) < (c.created_at, c.id)
  );

drop index public.categories_user_name_active_uq;
create unique index categories_user_name_active_uq
  on public.categories (user_id, lower(name)) where archived_at is null;

-- Mismo mecanismo y mismo arreglo para cuentas (notas de DEF-019, CP-CFG-007).
update public.accounts a
set archived_at = now()
where a.archived_at is null
  and exists (
    select 1 from public.accounts older
    where older.user_id = a.user_id
      and older.archived_at is null
      and lower(older.name) = lower(a.name)
      and (older.created_at, older.id) < (a.created_at, a.id)
  );

drop index public.accounts_user_name_active_uq;
create unique index accounts_user_name_active_uq
  on public.accounts (user_id, lower(name)) where archived_at is null;
