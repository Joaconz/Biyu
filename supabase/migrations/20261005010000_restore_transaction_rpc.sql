-- DEF-007 (#148): FR-08 pide que una transacción eliminada siga en el historial con una marca.
-- El historial la muestra en el filtro "Eliminados" de /transactions, y desde ahí se puede
-- restaurar si se borró por error: es lo que hace reversible el soft delete de C10.
-- Igual que delete_transaction: security definer con search_path vacío, y RLS garantizado
-- verificando user_id = auth.uid() (C7). Restaurar vuelve a sumar todas sus cuotas (I10, US-18).

create function public.restore_transaction(p_transaction_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
begin
  if v_user is null then
    raise exception 'restore_transaction requiere una sesión' using errcode = '42501';
  end if;
  if p_transaction_id is null then
    raise exception 'p_transaction_id es obligatorio' using errcode = 'check_violation';
  end if;

  update public.transactions
     set deleted_at = null
   where id = p_transaction_id
     and user_id = v_user
     and deleted_at is not null;

  if not found then
    raise exception 'la transacción no existe, no está eliminada o no te pertenece'
      using errcode = 'foreign_key_violation';
  end if;
end $$;

revoke execute on function public.restore_transaction(uuid) from public, anon;
grant execute on function public.restore_transaction(uuid) to authenticated;
