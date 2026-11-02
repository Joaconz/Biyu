-- US-89 (#331), ADR-044 §5: borrado definitivo de una categoría, solo si no tiene uso.
--
-- «Uso» = algún movimiento (también los dados de baja, C10) o alguna suscripción (en cualquier estado)
-- que la referencie. transactions_category_fk y subscriptions_category_fk no tienen cascada: sin esta
-- regla Postgres rechazaría el borrado con un 23503 que el cliente vería como un 500. Con uso la RPC
-- rechaza con 23514 y un mensaje que dice cuántos tiene y sugiere archivar; no reasigna nada (cambiaría
-- el gráfico por categoría de meses cerrados). Sirve activa o archivada, sembrada o no.
--
-- Bloquea la fila de la categoría (for update): un create_transaction o create_subscription concurrente
-- que la use toma un share lock sobre ella por su FK y espera a que esto termine, así no puede quedar
-- una referencia huérfana entre el conteo y el delete.
--
-- Errores: 42501 sin sesión; PT404 «Categoría no encontrada» si no existe o es de otro usuario (HTTP 404,
-- no distingue una de otra, igual que RLS, C7); 23514 si tiene uso.

-- Índice de FK (schema-foreign-key-indexes): el conteo de uso y el chequeo de la FK al borrar buscan
-- transacciones por categoría; subscriptions ya tiene subscriptions_category_idx.
create index transactions_category_idx on public.transactions (category_id);

create function public.delete_category(p_category_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_tx   bigint;
  v_subs bigint;
begin
  if v_user is null then
    raise exception 'delete_category requiere una sesión' using errcode = '42501';
  end if;
  if p_category_id is null then
    raise exception 'p_category_id es obligatorio' using errcode = 'check_violation';
  end if;

  perform 1 from public.categories c where c.id = p_category_id and c.user_id = v_user for update;
  if not found then
    raise exception 'Categoría no encontrada' using errcode = 'PT404';
  end if;

  select count(*) into v_tx from public.transactions t
   where t.category_id = p_category_id and t.user_id = v_user;
  select count(*) into v_subs from public.subscriptions s
   where s.category_id = p_category_id and s.user_id = v_user;

  if v_tx > 0 or v_subs > 0 then
    raise exception 'La categoría tiene % % y % %. Archivala si no la querés ver más.',
      v_tx, case when v_tx = 1 then 'movimiento' else 'movimientos' end,
      v_subs, case when v_subs = 1 then 'suscripción' else 'suscripciones' end
      using errcode = 'check_violation';
  end if;

  delete from public.categories c where c.id = p_category_id and c.user_id = v_user;
end $$;

revoke execute on function public.delete_category(uuid) from public, anon;
grant execute on function public.delete_category(uuid) to authenticated;
