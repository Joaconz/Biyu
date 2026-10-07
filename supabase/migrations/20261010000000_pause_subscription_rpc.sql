-- US-56 (#214), ADR-030 y R8: pausar una suscripción es una RPC.
--
-- Orden dentro de una sola transacción (ADR-030): bloquea la fila, pone al día esa suscripción con el
-- hoy del servidor (ADR-021) y recién entonces aplica "Pausar" de docs/06-suscripciones.md:
--   status = 'paused', paused_at = now() (I15) y
--   generate_from_period = max(generate_from_period, siguiente(período corriente)) (R8, I12).
-- El piso se adelanta al pausar y no solo al reanudar: sin eso, pausar el día 1 y reanudar el 30 de un
-- mes con día de cobro 28 volvería a proponer ese mes (R1 + R5) y lo cobraría.
--
-- No toca las transacciones ya generadas (C5, C10). Si la puesta al día previa no puede generar una
-- ocurrencia (R6: sin tipo de cambio; monto en pesos fuera de rango), la pausa se hace igual y ese mes
-- queda sin generar (ADR-030 "Las operaciones nunca fallan por la puesta al día previa").
--
-- Errores: 42501 sin sesión; P0002 "Suscripción no encontrada" si no existe o es de otro usuario (no
-- distingue una de otra, igual que RLS); 23514 con mensaje en español para una transición inexistente.
-- Devuelve { generated_before }: cuántos gastos vencidos se cargaron antes de pausar.

create function public.pause_subscription(p_subscription_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user    uuid := auth.uid();
  v_today   date := public.argentina_today();
  v_current date := date_trunc('month', v_today)::date;
  v_status  public.subscription_status;
  v_caught  jsonb;
begin
  if v_user is null then
    raise exception 'pause_subscription requiere una sesión' using errcode = '42501';
  end if;

  -- security definer se salta RLS: la pertenencia al usuario se chequea a mano. El bloqueo de fila
  -- ordena esta pausa contra una puesta al día o una edición concurrente.
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
  if v_status = 'paused' then
    raise exception 'La suscripción ya está pausada' using errcode = 'check_violation';
  end if;

  v_caught := public.catch_up_subscriptions(v_user, v_today, p_subscription_id);

  update public.subscriptions
     set status = 'paused',
         paused_at = now(),
         generate_from_period = greatest(generate_from_period, (v_current + interval '1 month')::date)
   where id = p_subscription_id and user_id = v_user;

  return jsonb_build_object('generated_before', (v_caught ->> 'generated')::int);
end $$;

revoke execute on function public.pause_subscription(uuid) from public, anon;
grant execute on function public.pause_subscription(uuid) to authenticated;
