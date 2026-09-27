-- delete_transaction: único camino de baja de transacciones (C4, C10, FR-08).
-- El borrado es lógico (deleted_at = now()) y nunca físico (C10).
-- security definer con search_path vacío; RLS garantizado verificando user_id = auth.uid() (C7).

create or replace function public.delete_transaction(
  p_transaction_id uuid
) returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
begin
  if v_user is null then
    raise exception 'delete_transaction requiere una sesión' using errcode = '42501';
  end if;

  if p_transaction_id is null then
    raise exception 'p_transaction_id es obligatorio' using errcode = 'check_violation';
  end if;

  update public.transactions
     set deleted_at = now()
   where id = p_transaction_id
     and user_id = v_user
     and deleted_at is null;

  if not found then
    raise exception 'la transacción no existe, ya fue eliminada o no te pertenece'
      using errcode = 'foreign_key_violation';
  end if;
end $$;

-- Supabase da EXECUTE a anon/authenticated por defecto en public: se cierra a anon (C8).
revoke execute on function public.delete_transaction(uuid) from public, anon;
grant execute on function public.delete_transaction(uuid) to authenticated;
