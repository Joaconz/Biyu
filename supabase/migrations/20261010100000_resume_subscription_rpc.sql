-- US-57 (#215), ADR-030 y R8: reanudar una suscripción es una RPC.
--
-- Orden dentro de una sola transacción (ADR-030): bloquea la fila, valida la transición, aplica "Reanudar"
-- de docs/06-suscripciones.md y recién entonces pone al día esa suscripción con el hoy del servidor
-- (ADR-021):
--   status = 'active', paused_at = null y
--   generate_from_period = max(generate_from_period, start_period, período corriente) (R8).
-- El piso nunca retrocede (I12): reanudar no rellena los meses en los que estuvo pausada. Con un
-- start_period futuro el max lo deja en start_period, así que el CHECK start_period <= generate_from_period
-- no falla y la operación tampoco. El piso puede quedar por encima de end_period (una terminada): R1 da un
-- rango vacío y no se genera nada; ningún CHECK lo prohíbe.
--
-- No toca las transacciones ya generadas (C5, C10). La puesta al día posterior puede crear la ocurrencia del
-- período corriente si ya venció su día de cobro (R5); si no se puede generar (R6: sin tipo de cambio; monto
-- en pesos fuera de rango) la reanudación se hace igual (ADR-030 "Las operaciones nunca fallan por la puesta
-- al día").
--
-- Errores: 42501 sin sesión; P0002 "Suscripción no encontrada" si no existe o es de otro usuario (no distingue
-- una de otra, igual que RLS); 23514 con mensaje en español para una transición inexistente.
-- Devuelve { generated_after }: cuántos gastos se cargaron al reanudar.

create function public.resume_subscription(p_subscription_id uuid)
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
    raise exception 'resume_subscription requiere una sesión' using errcode = '42501';
  end if;

  -- security definer se salta RLS: la pertenencia al usuario se chequea a mano. El bloqueo de fila
  -- ordena esta reanudación contra una puesta al día o una edición concurrente.
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
  if v_status = 'active' then
    raise exception 'La suscripción no está pausada' using errcode = 'check_violation';
  end if;

  update public.subscriptions
     set status = 'active',
         paused_at = null,
         generate_from_period = greatest(generate_from_period, start_period, v_current)
   where id = p_subscription_id and user_id = v_user;

  v_caught := public.catch_up_subscriptions(v_user, v_today, p_subscription_id);

  return jsonb_build_object('generated_after', (v_caught ->> 'generated')::int);
end $$;

revoke execute on function public.resume_subscription(uuid) from public, anon;
grant execute on function public.resume_subscription(uuid) to authenticated;
