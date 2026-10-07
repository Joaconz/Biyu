-- US-53 (#211), ADR-017, ADR-030 y ADR-031: la puesta al día al entrar.
--
-- La Edge Function run-subscription-catchup llama a esta RPC con el JWT del usuario. No usa la
-- service_role (C8): el usuario sale de auth.uid() y el hoy, del servidor (ADR-021), así que nadie
-- puede poner al día a otro usuario ni elegir la fecha. catch_up_subscriptions sigue siendo
-- interna; esta es su única puerta para el cliente. También se puede llamar directo por PostgREST
-- (supabase.rpc), sin la Edge Function: hace lo mismo con los mismos chequeos.
--
-- Concurrencia (US-53 CA-3): dos llamadas a la vez del mismo usuario se ordenan por el bloqueo de
-- fila de catch_up_subscriptions; la segunda ve lo que generó la primera y devuelve generated = 0.
-- Si igual chocaran contra I11, insert_transaction_with_entries lo toma como "ya generado".
--
-- Devuelve { generated, failed: [{ subscription_id, period, reason[, sqlstate] }] } (ADR-031 §5).

create function public.run_subscription_catchup()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
begin
  if v_user is null then
    raise exception 'run_subscription_catchup requiere una sesión' using errcode = '42501';
  end if;
  return public.catch_up_subscriptions(v_user, public.argentina_today());
end $$;

revoke execute on function public.run_subscription_catchup() from public, anon;
grant execute on function public.run_subscription_catchup() to authenticated;
