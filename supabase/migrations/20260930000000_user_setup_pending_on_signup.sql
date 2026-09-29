-- DEF-022 (ADR-025): el setup de US-68 se le pedía a toda cuenta sin fila en user_setup, y las
-- cuentas anteriores a US-68 no tienen fila, así que a todo el que ya usaba la app se le exigía
-- de nuevo. Ahora la fila pendiente (completed_at null) la crea la base al registrarse; "sin
-- fila" pasa a significar "cuenta anterior a US-68, setup no requerido". Sin backfill: no hay
-- que tocar las cuentas existentes.

create function public.create_pending_user_setup()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.user_setup (user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end;
$$;

-- Solo la usa el trigger: nadie la invoca por la API.
revoke all on function public.create_pending_user_setup() from public, anon, authenticated;

create trigger on_auth_user_created_setup
  after insert on auth.users
  for each row execute function public.create_pending_user_setup();
