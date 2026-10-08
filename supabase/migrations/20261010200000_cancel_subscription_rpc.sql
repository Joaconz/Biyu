-- US-58 (#216), ADR-030, I15: cancelar una suscripción es una RPC.
--
-- Orden dentro de una sola transacción (ADR-030): bloquea la fila, valida la transición, pone al día esa
-- suscripción con el hoy del servidor (ADR-021) y recién entonces aplica "Cancelar" de
-- docs/06-suscripciones.md: status = 'cancelled' y cancelled_at = now() (I15). Los meses vencidos sin generar
-- se cargan antes de cancelar; después R3 impide que se genere nada más.
--
-- Cancelar es irreversible a propósito: no hay RPC que saque una suscripción de 'cancelled' (pausar,
-- reanudar y cancelar la rechazan con 23514). No toca las transacciones ya generadas (C5, C10): siguen sin
-- deleted_at y suman en el Resumen de sus meses. Como el índice único de nombres excluye las canceladas
-- (ADR-032), después de cancelar se puede dar de alta otra con el mismo nombre.
--
-- Si la puesta al día previa no puede generar una ocurrencia (R6: sin tipo de cambio; monto en pesos fuera
-- de rango), la cancelación se hace igual y ese mes queda sin generar para siempre (ADR-030). Una pausada
-- se cancela sin generar nada: R3 la excluye de la puesta al día.
--
-- Errores: 42501 sin sesión; P0002 "Suscripción no encontrada" si no existe o es de otro usuario (no
-- distingue una de otra, igual que RLS); 23514 "Una suscripción cancelada no se puede modificar".
-- Devuelve { generated_before }: cuántos gastos vencidos se cargaron antes de cancelar.

create function public.cancel_subscription(p_subscription_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user   uuid := auth.uid();
  v_today  date := public.argentina_today();
  v_status public.subscription_status;
  v_caught jsonb;
begin
  if v_user is null then
    raise exception 'cancel_subscription requiere una sesión' using errcode = '42501';
  end if;

  -- security definer se salta RLS: la pertenencia al usuario se chequea a mano. El bloqueo de fila
  -- ordena esta cancelación contra una puesta al día o una edición concurrente.
  select s.status into v_status
    from public.subscriptions s
   where s.id = p_subscription_id and s.user_id = v_user
     for no key update;
  if not found then
    raise exception 'Suscripción no encontrada' using errcode = 'no_data_found';
  end if;
  if v_status = 'cancelled' then
    raise exception 'Una suscripción cancelada no se puede modificar' using errcode = 'check_violation';
  end if;

  v_caught := public.catch_up_subscriptions(v_user, v_today, p_subscription_id);

  update public.subscriptions
     set status = 'cancelled',
         cancelled_at = now()
   where id = p_subscription_id and user_id = v_user;

  return jsonb_build_object('generated_before', (v_caught ->> 'generated')::int);
end $$;

revoke execute on function public.cancel_subscription(uuid) from public, anon;
grant execute on function public.cancel_subscription(uuid) to authenticated;
