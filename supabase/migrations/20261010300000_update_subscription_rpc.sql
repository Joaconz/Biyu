-- US-59 (#217), ADR-030 y ADR-032: editar una suscripción es una RPC.
--
-- Orden dentro de una sola transacción (ADR-030): bloquea la fila, valida, pone al día esa suscripción
-- con los datos ANTERIORES, aplica los cambios permitidos y vuelve a poner al día con los datos nuevos.
-- La primera puesta al día cierra el hueco de R7: si había meses vencidos sin generar, se generan con el
-- monto de antes y no con el nuevo. La segunda puede crear la ocurrencia del período corriente si, con el
-- día de cobro nuevo, ya venció (R5). Un rechazo (validación o transición) deshace todo, también la
-- primera puesta al día.
--
-- Qué se edita (ADR-032): nombre, monto, categoría, medio de pago, día de cobro, mes de fin y descripción.
-- La moneda y el mes de inicio NO: p_currency y p_start_period existen solo para rechazar con un mensaje
-- claro a quien los mande (CA-5). Los campos van todos juntos (el cliente manda el estado completo): un
-- mes de fin null es "Sin fin", no "no tocar".
--   - Categoría y cuenta: un valor NUEVO tiene que ser activo y del usuario; el valor actual se conserva
--     aunque se haya archivado (CA-10). Una archivada distinta de la actual, o ajena: "no está disponible".
--   - Mes de fin: solo se valida si cambia. Uno nuevo tiene que ser >= max(start_period, período
--     corriente), día 1 y a lo sumo diciembre 2099. El actual se conserva sin revalidar.
--   - Extender una terminada (end_period anterior al corriente) con un fin nuevo o sin fin lleva
--     generate_from_period a max(generate_from_period, período corriente) (R8): los meses entre el fin
--     viejo y hoy no se cargan (CA-11).
--   - El nombre es único entre las demás suscripciones no canceladas, sin distinguir mayúsculas (no contra
--     sí misma).
-- Las transacciones ya generadas no cambian (C5): ni monto ni descripción ni categoría.
--
-- Errores: 42501 sin sesión; P0002 "Suscripción no encontrada" (ajena e inexistente, igual que RLS); 23514
-- "Una suscripción cancelada no se puede modificar". Los mensajes de validación son los de create_subscription.
-- Devuelve { generated_before, generated_after }.

create function public.update_subscription(
  p_subscription_id uuid,
  p_name            text,
  p_amount          numeric,
  p_category_id     uuid,
  p_account_id      uuid,
  p_billing_day     numeric,
  p_end_period      date,
  p_description     text,
  p_currency        currency_code default null,
  p_start_period    date default null
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user        uuid := auth.uid();
  v_today       date := public.argentina_today();
  v_current     date := date_trunc('month', v_today)::date;
  v_sub         public.subscriptions%rowtype;
  v_name        text := public.trim_js(p_name);
  v_description text := nullif(public.trim_js(p_description), '');
  v_min_end     date;
  v_extends     boolean;
  v_before      jsonb;
  v_after       jsonb;
begin
  if v_user is null then
    raise exception 'update_subscription requiere una sesión' using errcode = '42501';
  end if;

  -- security definer se salta RLS: la pertenencia al usuario se chequea a mano. El bloqueo de fila
  -- ordena esta edición contra una puesta al día o una pausa concurrente.
  select * into v_sub
    from public.subscriptions s
   where s.id = p_subscription_id and s.user_id = v_user
     for no key update;
  if not found then
    raise exception 'Suscripción no encontrada' using errcode = 'no_data_found';
  end if;
  if v_sub.status = 'cancelled' then
    raise exception 'Una suscripción cancelada no se puede modificar' using errcode = 'check_violation';
  end if;

  if p_currency is not null or p_start_period is not null then
    raise exception 'La moneda y el mes de inicio no se pueden cambiar' using errcode = 'check_violation';
  end if;

  if v_name is null or v_name = '' then
    raise exception 'Escribí un nombre' using errcode = 'check_violation';
  end if;
  if char_length(v_name) > 60 then
    raise exception 'El nombre admite hasta 60 caracteres' using errcode = 'check_violation';
  end if;
  if exists (
    select 1 from public.subscriptions s
     where s.user_id = v_user and s.id <> p_subscription_id
       and s.status <> 'cancelled' and lower(s.name) = lower(v_name)
  ) then
    raise exception 'Ya tenés una suscripción con ese nombre' using errcode = 'unique_violation';
  end if;

  if p_amount is null or p_amount = 'NaN'::numeric or p_amount <= 0 then
    raise exception 'El monto debe ser mayor a cero' using errcode = 'check_violation';
  end if;
  if p_amount <> round(p_amount, 2) then
    raise exception 'El monto admite hasta 2 decimales' using errcode = 'check_violation';
  end if;
  if p_amount > 999999999999.99 then
    raise exception '%', case when v_sub.currency = 'USD'
                              then 'El monto máximo es USD 999.999.999.999,99'
                              else 'El monto máximo es $999.999.999.999,99' end
      using errcode = 'check_violation';
  end if;

  if p_category_id is null then
    raise exception 'Elegí una categoría' using errcode = 'check_violation';
  end if;
  if p_category_id <> v_sub.category_id and not exists (
    select 1 from public.categories
     where id = p_category_id and user_id = v_user and archived_at is null
  ) then
    raise exception 'La categoría no está disponible' using errcode = 'foreign_key_violation';
  end if;
  if p_account_id is null then
    raise exception 'Elegí un medio de pago' using errcode = 'check_violation';
  end if;
  if p_account_id <> v_sub.account_id and not exists (
    select 1 from public.accounts
     where id = p_account_id and user_id = v_user and archived_at is null
  ) then
    raise exception 'El medio de pago no está disponible' using errcode = 'foreign_key_violation';
  end if;

  if p_billing_day is null then
    raise exception 'Indicá el día de cobro' using errcode = 'check_violation';
  end if;
  if p_billing_day = 'NaN'::numeric or p_billing_day <> trunc(p_billing_day)
     or p_billing_day < 1 or p_billing_day > 31 then                       -- I13
    raise exception 'El día de cobro va de 1 a 31' using errcode = 'check_violation';
  end if;

  if p_end_period is not null and p_end_period is distinct from v_sub.end_period then
    v_min_end := greatest(v_sub.start_period, v_current);
    if extract(day from p_end_period) <> 1 then
      raise exception 'El mes de fin tiene que ser el día 1 del mes' using errcode = 'check_violation';
    end if;
    if p_end_period > date '2099-12-01' then
      raise exception 'El mes de fin puede ser como máximo diciembre 2099' using errcode = 'check_violation';
    end if;
    if p_end_period < v_min_end then                                       -- I12
      raise exception 'El mes de fin no puede ser anterior a %', public.period_label(v_min_end)
        using errcode = 'check_violation';
    end if;
  end if;

  if char_length(v_description) > 200 then
    raise exception 'La descripción admite hasta 200 caracteres' using errcode = 'check_violation';
  end if;

  -- Los meses vencidos que faltan se generan con el monto y los datos de antes (R7, ADR-030).
  v_before := public.catch_up_subscriptions(v_user, v_today, p_subscription_id);

  v_extends := v_sub.end_period is not null and v_sub.end_period < v_current
               and p_end_period is distinct from v_sub.end_period;

  begin
    update public.subscriptions
       set name = v_name,
           amount = p_amount,
           category_id = p_category_id,
           account_id = p_account_id,
           billing_day = p_billing_day::int,
           end_period = p_end_period,
           description = v_description,
           generate_from_period = case when v_extends
                                       then greatest(generate_from_period, v_current)
                                       else generate_from_period end
     where id = p_subscription_id and user_id = v_user;
  exception when unique_violation then
    -- Dos ediciones o altas simultáneas con el mismo nombre: la segunda pierde contra el índice.
    raise exception 'Ya tenés una suscripción con ese nombre' using errcode = 'unique_violation';
  end;

  -- Con los datos nuevos puede vencer ahora el período corriente (por ejemplo, el día de cobro pasó de 28 a 3).
  v_after := public.catch_up_subscriptions(v_user, v_today, p_subscription_id);

  return jsonb_build_object(
    'generated_before', (v_before ->> 'generated')::int,
    'generated_after',  (v_after ->> 'generated')::int
  );
end $$;

revoke execute on function public.update_subscription(
  uuid, text, numeric, uuid, uuid, numeric, date, text, currency_code, date
) from public, anon;
grant execute on function public.update_subscription(
  uuid, text, numeric, uuid, uuid, numeric, date, text, currency_code, date
) to authenticated;
