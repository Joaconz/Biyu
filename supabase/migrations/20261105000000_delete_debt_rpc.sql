-- US-87 (#329), ADR-044 §3: eliminar una deuda es una RPC, porque ADR-037 revocó el DELETE directo
-- sobre debts a authenticated (C4).
--
-- Reglas:
--   * Una deuda saldada no se borra: primero se vuelve a pendiente (US-40). Rechaza con 23514.
--   * La deuda de un gasto compartido se puede borrar sola: el gasto queda como gasto normal (no se toca
--     transactions ni sus imputaciones).
--   * Una deuda inexistente, de otro usuario o vinculada a un gasto con baja lógica (ADR-037 §4, no se ve
--     en el listado) responde PT404 «Deuda no encontrada» (HTTP 404, C7): no revela cuál de los casos es.
--
-- El bloqueo de fila (for update) ordena el borrado contra un settle_debt concurrente: si salda primero,
-- el borrado ve 'settled' y rechaza; si borra primero, settle_debt ya no encuentra la deuda.

create function public.delete_debt(p_debt_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user   uuid := auth.uid();
  v_status public.debt_status;
begin
  if v_user is null then
    raise exception 'delete_debt requiere una sesión' using errcode = '42501';
  end if;
  if p_debt_id is null then
    raise exception 'p_debt_id es obligatorio' using errcode = 'check_violation';
  end if;

  select d.status into v_status
    from public.debts d
    left join public.transactions t on t.id = d.transaction_id
   where d.id = p_debt_id
     and d.user_id = v_user
     and t.deleted_at is null
     for update of d;
  if not found then
    raise exception 'Deuda no encontrada' using errcode = 'PT404';
  end if;
  if v_status = 'settled' then
    raise exception 'Una deuda saldada no se elimina: volvela a pendiente primero' using errcode = 'check_violation';
  end if;

  delete from public.debts d where d.id = p_debt_id and d.user_id = v_user;
end $$;

revoke execute on function public.delete_debt(uuid) from public, anon;
grant execute on function public.delete_debt(uuid) to authenticated;
