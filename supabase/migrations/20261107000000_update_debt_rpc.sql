-- US-86 (#285), ADR-037: editar una deuda, solo por RPC.
--
-- ADR-037 §1 revocó INSERT, UPDATE y DELETE directos sobre debts: toda escritura es una RPC (C4).
--
-- update_debt: persona, monto y nota; en una deuda suelta (sin gasto) también la fecha y la dirección.
-- La moneda y el tipo de cambio quedan congelados (C5): amount_ars se recalcula con el fx_rate que ya tenía.
-- La deuda de un gasto sigue la fecha, la moneda y la dirección del gasto: no se cambian. Su monto no puede
-- superar el del gasto (I7). p_incurred_on y p_direction en null conservan lo que hay; en una deuda de un
-- gasto, mandar un valor distinto se rechaza.
--
-- Rechaza una deuda saldada (primero se vuelve a pendiente, US-40, para no cambiar sin querer el historial de lo
-- cobrado). Una deuda inexistente, de otro usuario o vinculada a un gasto eliminado (ADR-037 §4) responde PT404
-- «Deuda no encontrada» (HTTP 404), igual que delete_debt (US-87): no se distinguen (C7).

create function public.update_debt(
  p_debt_id     uuid,
  p_person      text,
  p_amount      numeric,
  p_notes       text default null,
  p_incurred_on date default null,
  p_direction   public.debt_direction default null
) returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user     uuid := auth.uid();
  v_debt     public.debts%rowtype;
  v_tx       public.transactions%rowtype;
  v_person   text;
  v_notes    text;
  v_ars      numeric;
  v_date     date;
  v_direction public.debt_direction;
begin
  if v_user is null then
    raise exception 'update_debt requiere una sesión' using errcode = '42501';
  end if;

  -- FOR UPDATE: dos ediciones, o una edición y saldar, se ordenan.
  select d.* into v_debt
    from public.debts d
    left join public.transactions t on t.id = d.transaction_id
   where d.id = p_debt_id
     and d.user_id = v_user
     and t.deleted_at is null
     for update of d;
  if not found then
    raise exception 'Deuda no encontrada' using errcode = 'PT404';
  end if;
  if v_debt.status = 'settled' then
    raise exception 'Una deuda saldada no se puede editar: volvela a pendiente primero' using errcode = 'check_violation';
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
  -- amount_ars es una columna generada numeric(14,2) con CHECK > 0: sin esto, un overflow o un redondeo a
  -- 0,00 llegarían como errores crudos de Postgres (DEF-012, DEF-013).
  v_ars := case when v_debt.currency = 'USD' then round(p_amount * v_debt.fx_rate, 2) else p_amount end;
  if v_ars > 999999999999.99 then
    raise exception 'En pesos daría más que el máximo de $999.999.999.999,99' using errcode = 'check_violation';
  end if;
  if v_ars = 0 then
    raise exception 'I4: en pesos daría menos de $0,01' using errcode = 'check_violation';
  end if;

  v_notes := nullif(public.trim_js(coalesce(p_notes, '')), '');
  if char_length(v_notes) > 200 then
    raise exception 'La nota admite hasta 200 caracteres' using errcode = 'check_violation';
  end if;

  if v_debt.transaction_id is not null then
    -- La deuda de un gasto: fecha y dirección son las del gasto (ADR-036).
    if (p_incurred_on is not null and p_incurred_on <> v_debt.incurred_on)
       or (p_direction is not null and p_direction <> v_debt.direction) then
      raise exception 'La fecha y la dirección de una deuda de un gasto no se pueden cambiar' using errcode = 'check_violation';
    end if;
    v_date := v_debt.incurred_on;
    v_direction := v_debt.direction;

    select * into v_tx from public.transactions where id = v_debt.transaction_id;
    if p_amount > v_tx.amount then
      raise exception 'I7: la deuda no puede superar el monto del gasto' using errcode = 'check_violation';
    end if;
    -- Con varias deudas (ADR-040) la suma de todas tampoco puede superarlo, en pesos.
    if v_ars + coalesce((select sum(d.amount_ars) from public.debts d
                          where d.transaction_id = v_debt.transaction_id and d.id <> v_debt.id), 0) > v_tx.amount_ars then
      raise exception 'I7: la suma de las deudas supera el monto de la transacción' using errcode = 'check_violation';
    end if;
  else
    v_date := coalesce(p_incurred_on, v_debt.incurred_on);
    v_direction := coalesce(p_direction, v_debt.direction);
    -- FR-06, ADR-021: "hoy" es la fecha de Argentina.
    if v_date > (now() at time zone 'America/Argentina/Buenos_Aires')::date then
      raise exception 'La fecha no puede ser posterior a hoy' using errcode = 'check_violation';
    end if;
  end if;

  update public.debts
     set person = v_person, amount = p_amount, notes = v_notes, incurred_on = v_date, direction = v_direction
   where id = v_debt.id;
end $$;

revoke execute on function public.update_debt(uuid, text, numeric, text, date, public.debt_direction) from public, anon;
grant execute on function public.update_debt(uuid, text, numeric, text, date, public.debt_direction) to authenticated;
