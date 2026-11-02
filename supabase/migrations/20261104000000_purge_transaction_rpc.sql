-- US-85 (#328), ADR-044 §1-§2: eliminar definitivamente un movimiento, en dos pasos.
--
-- «Eliminar» sigue siendo la baja lógica de C10 (delete_transaction). Desde la vista Eliminados, esta
-- RPC borra físicamente la transacción ya dada de baja, sus imputaciones (ledger_entries, en cascada) y
-- su deuda vinculada (debts_transaction_fk no tiene cascada: se borra acá, ADR-044 §1). Es la única forma
-- de borrar una transacción de un usuario, salvo eliminar su cuenta (ADR-026).
--
-- Una ocurrencia de suscripción nunca se borra definitivamente (ADR-044 §2): la puesta al día no filtra por
-- deleted_at (I11) y volvería a crearla. Se puede dar de baja y restaurar, pero no purgar.
--
-- Errores, en este orden: 42501 sin sesión; foreign_key_violation si no existe o es de otro usuario (no se
-- distinguen, C7); check_violation si está activa o es de una suscripción.

create function public.purge_transaction(p_transaction_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_tx   record;
begin
  if v_user is null then
    raise exception 'purge_transaction requiere una sesión' using errcode = '42501';
  end if;

  -- security definer se salta RLS: la pertenencia al usuario se chequea a mano. El bloqueo de fila ordena
  -- este borrado contra una restauración o una edición concurrentes (al soltarse se vuelve a leer la fila).
  select id, deleted_at, subscription_id into v_tx
    from public.transactions
   where id = p_transaction_id and user_id = v_user
     for update;
  if not found then
    raise exception 'la transacción no existe o no te pertenece' using errcode = 'foreign_key_violation';
  end if;
  if v_tx.deleted_at is null then
    raise exception 'Un movimiento activo no se puede eliminar definitivamente' using errcode = 'check_violation';
  end if;
  if v_tx.subscription_id is not null then
    raise exception 'Un movimiento de una suscripción no se puede eliminar definitivamente'
      using errcode = 'check_violation';
  end if;

  -- La deuda vinculada va primero: debts_transaction_fk no tiene on delete cascade.
  delete from public.debts where transaction_id = v_tx.id and user_id = v_user;
  -- Las imputaciones se borran en cascada (ledger_entries_transaction_fk).
  delete from public.transactions where id = v_tx.id and user_id = v_user;
end $$;

revoke execute on function public.purge_transaction(uuid) from public, anon;
grant execute on function public.purge_transaction(uuid) to authenticated;
