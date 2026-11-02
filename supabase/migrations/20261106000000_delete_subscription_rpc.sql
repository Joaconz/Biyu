-- US-88 (#330), ADR-044 §4: eliminar una suscripción, en cualquier estado.
--
-- Los gastos que ya generó quedan como movimientos sueltos: pierden el vínculo (subscription_id y
-- subscription_period en nulo) pero conservan sus montos, meses e imputaciones, así los totales de los meses
-- cerrados no cambian. Los dados de baja quedan como movimientos eliminados comunes (se pueden restaurar o
-- borrar para siempre, US-85). Después borra la suscripción: deja de generar gastos.
--
-- El bloqueo de fila (for update) la ordena contra la puesta al día, que toma for no key update de la misma
-- fila (catch_up_subscriptions): una que ya empezó termina antes; una que espera encuentra la fila borrada
-- y la salta.
--
-- Errores: 42501 sin sesión; PT404 «Suscripción no encontrada» (HTTP 404) si no existe o es de otro usuario,
-- sin distinguir (C7), como las demás RPC de suscripciones desde DEF-034.

create function public.delete_subscription(p_subscription_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
begin
  if v_user is null then
    raise exception 'delete_subscription requiere una sesión' using errcode = '42501';
  end if;

  -- security definer se salta RLS: la pertenencia al usuario se chequea a mano.
  perform 1
    from public.subscriptions s
   where s.id = p_subscription_id and s.user_id = v_user
     for update;
  if not found then
    raise exception 'Suscripción no encontrada' using errcode = 'PT404';
  end if;

  update public.transactions
     set subscription_id = null, subscription_period = null
   where subscription_id = p_subscription_id and user_id = v_user;

  delete from public.subscriptions where id = p_subscription_id and user_id = v_user;
end $$;

revoke execute on function public.delete_subscription(uuid) from public, anon;
grant execute on function public.delete_subscription(uuid) to authenticated;
