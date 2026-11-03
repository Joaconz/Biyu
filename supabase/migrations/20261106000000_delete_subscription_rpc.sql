-- US-88 (#330), ADR-044 §4: borrado definitivo de una suscripción, en cualquier estado.
--
-- Los gastos que ya generó quedan como movimientos sueltos: subscription_id y subscription_period pasan
-- a nulo juntos (el CHECK de la pareja los exige a los dos), también en los que están dados de baja
-- (C10). No se toca ninguna otra columna ni las imputaciones, así que los meses cerrados no cambian (C5).
-- Como el índice único de I11 es parcial sobre subscription_id no nulo, esas filas dejan de ocupar
-- períodos y la puesta al día ya no tiene nada que regenerar: la suscripción no existe.
--
-- Concurrencia: toma for update sobre la fila de la suscripción. catch_up_subscriptions la toma for no key
-- update, y un insert de una ocurrencia toma key share por su FK: los dos conflictan con for update, así que
-- el borrado espera a una puesta al día en curso y una puesta al día que llega después ya no la encuentra.
--
-- Errores: 42501 sin sesión; PT404 «Suscripción no encontrada» si no existe o es de otro usuario (HTTP 404,
-- igual que DEF-034, no distingue una de otra, C7). Devuelve { detached }: cuántos movimientos quedaron sueltos.

create function public.delete_subscription(p_subscription_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user     uuid := auth.uid();
  v_detached int;
begin
  if v_user is null then
    raise exception 'delete_subscription requiere una sesión' using errcode = '42501';
  end if;
  if p_subscription_id is null then
    raise exception 'p_subscription_id es obligatorio' using errcode = 'check_violation';
  end if;

  perform 1 from public.subscriptions s
   where s.id = p_subscription_id and s.user_id = v_user
     for update;
  if not found then
    raise exception 'Suscripción no encontrada' using errcode = 'PT404';
  end if;

  update public.transactions t
     set subscription_id = null,
         subscription_period = null
   where t.subscription_id = p_subscription_id and t.user_id = v_user;
  get diagnostics v_detached = row_count;

  delete from public.subscriptions s where s.id = p_subscription_id and s.user_id = v_user;

  return jsonb_build_object('detached', v_detached);
end $$;

revoke execute on function public.delete_subscription(uuid) from public, anon;
grant execute on function public.delete_subscription(uuid) to authenticated;
