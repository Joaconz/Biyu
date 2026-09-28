-- upsert_fx_rate: único camino de escritura del tipo de cambio de referencia mensual (US-46).
-- Cambiar la referencia no modifica transacciones: cada una conserva su propio fx_rate (C5).

-- numeric admite NaN y `NaN > 0` resulta verdadero en Postgres; se endurece la restricción (C6).
alter table public.fx_rates
  drop constraint fx_rates_ars_per_usd_positive,
  add constraint fx_rates_ars_per_usd_positive
    check (ars_per_usd <> 'NaN'::numeric and ars_per_usd > 0);

create function public.upsert_fx_rate(
  p_period date,
  p_ars_per_usd numeric
) returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_rate numeric(14,4);
begin
  if v_user is null then
    raise exception 'upsert_fx_rate requiere una sesión' using errcode = '42501';
  end if;

  if p_period is null or extract(day from p_period) <> 1 then
    raise exception 'el período debe ser el primer día del mes' using errcode = 'check_violation';
  end if;

  if p_ars_per_usd is null or p_ars_per_usd = 'NaN'::numeric or p_ars_per_usd <= 0 then
    raise exception 'el tipo de cambio debe ser mayor a cero' using errcode = 'check_violation';
  end if;

  if p_ars_per_usd <> round(p_ars_per_usd, 4) then
    raise exception 'el tipo de cambio admite hasta 4 decimales' using errcode = 'check_violation';
  end if;

  insert into public.fx_rates (user_id, period, ars_per_usd)
  values (v_user, p_period, p_ars_per_usd)
  on conflict (user_id, period)
  do update set ars_per_usd = excluded.ars_per_usd
  returning ars_per_usd into v_rate;

  return v_rate::text;
end $$;

-- La lectura sigue protegida por RLS. Toda escritura se canaliza por la RPC (C4, C6, C7).
revoke insert, update, delete on public.fx_rates from authenticated;
revoke execute on function public.upsert_fx_rate(date, numeric) from public, anon;
grant execute on function public.upsert_fx_rate(date, numeric) to authenticated;
