-- US-36 (#226), ADR-037 §1 y §2: una deuda suelta (sin gasto) se crea solo con create_debt.
-- La RPC repite en Postgres lo que el formulario valida como UX (C6), con los mensajes exactos del
-- ADR. user_id sale de auth.uid(); transaction_id es null y status 'pending' (los defaults).
-- Persona y nota se recortan con trim_js, la misma clase de caracteres que String.prototype.trim.
--
-- Con esto debts queda como transactions (ADR-020): sin INSERT ni DELETE directos para el cliente.
-- El UPDATE ya se había quitado con settle_debt/reopen_debt (US-39). delete_account (ADR-026) es
-- security definer y sigue borrando las deudas vinculadas a la cuenta.

create function public.create_debt(
  p_direction   public.debt_direction,
  p_person      text,
  p_amount      numeric,
  p_currency    public.currency_code,
  p_fx_rate     numeric,
  p_incurred_on date,
  p_notes       text default null
) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user   uuid := auth.uid();
  v_person text;
  v_notes  text;
  v_ars    numeric;
  v_id     uuid;
begin
  if v_user is null then
    raise exception 'create_debt requiere una sesión' using errcode = '42501';
  end if;

  if p_direction is null or p_currency is null then
    raise exception 'Dirección y moneda son obligatorias' using errcode = 'check_violation';
  end if;

  v_person := public.trim_js(coalesce(p_person, ''));
  if v_person = '' then
    raise exception 'Ingresá el nombre de la persona' using errcode = 'check_violation';
  end if;
  if char_length(v_person) > 60 then
    raise exception 'La persona admite hasta 60 caracteres' using errcode = 'check_violation';
  end if;

  if p_amount is null or p_amount = 'NaN'::numeric or p_amount <= 0 then
    raise exception 'I4: el monto debe ser mayor a cero' using errcode = 'check_violation';
  end if;
  if p_amount <> round(p_amount, 2) then
    raise exception 'I4: el monto admite hasta 2 decimales' using errcode = 'check_violation';
  end if;

  if (p_currency = 'USD') <> (p_fx_rate is not null) then
    raise exception 'I5: fx_rate es obligatorio si y solo si la moneda es USD' using errcode = 'check_violation';
  end if;
  if p_fx_rate is not null and (p_fx_rate = 'NaN'::numeric or round(p_fx_rate, 4) <= 0) then -- la columna es numeric(14,4)
    raise exception 'I5: fx_rate debe ser mayor a cero' using errcode = 'check_violation';
  end if;
  if p_fx_rate > 9999999999.9999 then
    raise exception 'El tipo de cambio es demasiado grande' using errcode = 'check_violation';
  end if;

  -- amount_ars es una columna generada numeric(14,2) con CHECK > 0: sin esto, un overflow o un
  -- redondeo a 0,00 llegarían como errores crudos de Postgres (DEF-012, DEF-013).
  if p_currency = 'USD' then
    v_ars := round(p_amount * round(p_fx_rate, 4), 2);
    if v_ars > 999999999999.99 then
      raise exception 'En pesos daría más que el máximo de $999.999.999.999,99' using errcode = 'check_violation';
    end if;
    if v_ars = 0 then
      raise exception 'I4: en pesos daría menos de $0,01' using errcode = 'check_violation';
    end if;
  end if;

  if p_incurred_on is null then
    raise exception 'La fecha es obligatoria' using errcode = 'check_violation';
  end if;
  -- FR-06, ADR-021: "hoy" es la fecha de Argentina.
  if p_incurred_on > (now() at time zone 'America/Argentina/Buenos_Aires')::date then
    raise exception 'La fecha no puede ser posterior a hoy' using errcode = 'check_violation';
  end if;

  v_notes := nullif(public.trim_js(coalesce(p_notes, '')), '');
  if char_length(v_notes) > 200 then
    raise exception 'La nota admite hasta 200 caracteres' using errcode = 'check_violation';
  end if;

  insert into public.debts (user_id, person, amount, currency, fx_rate, direction, incurred_on, notes)
  values (v_user, v_person, p_amount, p_currency, p_fx_rate, p_direction, p_incurred_on, v_notes)
  returning id into v_id;

  return v_id;
end $$;

revoke execute on function public.create_debt(public.debt_direction, text, numeric, public.currency_code, numeric, date, text)
  from public, anon;
grant execute on function public.create_debt(public.debt_direction, text, numeric, public.currency_code, numeric, date, text)
  to authenticated;

-- ADR-037 §1: el cliente ya no inserta ni borra deudas directo (CA-9).
revoke insert, delete on public.debts from authenticated;
drop policy insert_own_rows on public.debts;
drop policy delete_own_rows on public.debts;

-- ADR-037 §2: red de contención por si algo escribe debts sin pasar por las RPC. NOT VALID: rige para
-- toda fila nueva o modificada, pero no revisa las existentes. Antes de esta migración debts admitía
-- inserts directos sin tope de largo, y una fila vieja fuera de regla haría fallar la migración entera
-- en producción. Se validan aparte (VALIDATE CONSTRAINT) una vez revisados los datos.
alter table public.debts
  add constraint debts_person_length check (char_length(btrim(person)) between 1 and 60) not valid,
  add constraint debts_notes_length check (notes is null or char_length(notes) <= 200) not valid;
