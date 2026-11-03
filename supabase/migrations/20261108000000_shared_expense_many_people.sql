-- US-82 (#270), ADR-040: un gasto se comparte con hasta 10 personas, cada una con su monto.
--
-- create_transaction reemplaza p_shared_person / p_shared_amount por p_shared_persons text[] y
-- p_shared_amounts numeric[] (la posición i de cada arreglo es una deuda), con la validación de
-- ADR-040 §2 en ese orden y mensajes exactos (C6). Crea el gasto y todas sus deudas en una sola
-- llamada (C4): todas o ninguna. Cambia la firma: se borra la función y se vuelven a dar los permisos.
-- import_transactions llama con parámetros nombrados y no manda deudas: no cambia.

drop function public.create_transaction(
  transaction_type, numeric, currency_code, numeric, uuid, uuid, int, date, text, text, numeric, uuid, int
);

create function public.create_transaction(
  p_type               transaction_type,
  p_amount             numeric,
  p_currency           currency_code,
  p_fx_rate            numeric,
  p_category_id        uuid,
  p_account_id         uuid,
  p_installments_count int,
  p_occurred_on        date,
  p_description        text default null,
  p_shared_persons     text[] default null,
  p_shared_amounts     numeric[] default null,
  p_request_id         uuid default null,
  p_installments_paid  int default null
) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user          uuid := auth.uid();
  v_account_type  public.account_type;
  v_tx_id         uuid;
  v_shared        boolean := p_shared_persons is not null or p_shared_amounts is not null;
  -- fx_rate se guarda como numeric(14,4): los topes en pesos usan el valor ya redondeado, como amount_ars.
  v_fx            numeric := round(p_fx_rate, 4);
  v_persons       text[] := '{}';
  v_count         int;
  v_sum           numeric := 0;
  v_sum_ars       numeric := 0;
  v_person        text;
  v_amount        numeric;
  i               int;
  j               int;
begin
  if v_user is null then
    raise exception 'create_transaction requiere una sesión' using errcode = '42501';
  end if;

  -- ADR-034: la clave se busca antes de validar. Un reintento de algo ya guardado devuelve su id
  -- aunque, mientras tanto, la categoría se haya archivado o el contenido sea otro (CA-13, CA-14).
  -- Filtra por el usuario de la sesión: la clave de otro nunca devuelve una fila ajena (C7, CA-12).
  if p_request_id is not null then
    select id into v_tx_id
      from public.transactions
     where user_id = v_user and request_id = p_request_id;
    if found then
      return v_tx_id;
    end if;
  end if;

  if p_type is null or p_currency is null then
    raise exception 'type y currency son obligatorios' using errcode = 'check_violation';
  end if;
  if p_amount is null or p_amount = 'NaN'::numeric or p_amount <= 0 then
    raise exception 'I4: el monto debe ser mayor a cero' using errcode = 'check_violation';
  end if;
  if p_amount <> round(p_amount, 2) then
    raise exception 'I4: el monto admite hasta 2 decimales' using errcode = 'check_violation';
  end if;
  if p_occurred_on is null then
    raise exception 'occurred_on es obligatoria' using errcode = 'check_violation';
  end if;
  -- FR-06: una fecha pasada es válida (US-09); una posterior a hoy, no. Las cuotas futuras no
  -- pasan por acá: son imputaciones, y occurred_on sigue siendo el día de la compra.
  if p_occurred_on > public.argentina_today() then
    raise exception 'FR-06: la fecha no puede ser posterior a hoy' using errcode = 'check_violation';
  end if;
  if (p_currency = 'USD') <> (p_fx_rate is not null) then
    raise exception 'I5: fx_rate es obligatorio si y solo si la moneda es USD'
      using errcode = 'check_violation';
  end if;
  if p_fx_rate is not null and (p_fx_rate = 'NaN'::numeric or round(p_fx_rate, 4) <= 0) then  -- la columna es numeric(14,4)
    raise exception 'I5: fx_rate debe ser mayor a cero' using errcode = 'check_violation';
  end if;
  if p_installments_count is null or p_installments_count < 1 or p_installments_count > 12 then
    raise exception 'las cuotas van de 1 a 12' using errcode = 'check_violation';
  end if;
  -- Compra en cuotas empezada (ADR-039 §3), en este orden. El número de cuotas pagadas lo agrega el
  -- cliente a su texto: el mensaje del servidor es fijo.
  if p_installments_paid is not null then
    if p_installments_count = 1 then
      raise exception 'Las cuotas ya pagadas solo van en una compra en cuotas' using errcode = 'check_violation';
    end if;
    if p_installments_paid < 0 or p_installments_paid >= p_installments_count then
      raise exception 'Las cuotas ya pagadas tienen que ser menos que el total de cuotas' using errcode = 'check_violation';
    end if;
    if p_installments_paid > (extract(year from public.argentina_today())::int * 12 + extract(month from public.argentina_today())::int)
                           - (extract(year from p_occurred_on)::int * 12 + extract(month from p_occurred_on)::int) then
      raise exception 'Con esa fecha todavía no puede haber tantas cuotas pagadas' using errcode = 'check_violation';
    end if;
    if v_shared then
      raise exception 'Una compra empezada no se puede compartir' using errcode = 'check_violation';
    end if;
  end if;
  if p_type = 'expense' and p_category_id is null then
    raise exception 'I8: un gasto requiere categoría' using errcode = 'check_violation';
  end if;

  -- Deudas vinculadas (ADR-040 §2, que modifica ADR-036): hasta 10 personas, cada una con su monto.
  -- Se valida antes del primer insert y en este orden: el primero que falla es el que se informa.
  -- Moneda, tipo de cambio, fecha y dirección no se aceptan del cliente: salen de la transacción.
  if v_shared then
    if p_type <> 'expense' then
      raise exception 'Un ingreso no se puede compartir' using errcode = 'check_violation';
    end if;
    if p_shared_persons is null or p_shared_amounts is null
       or cardinality(p_shared_persons) <> cardinality(p_shared_amounts) then
      raise exception 'Un gasto compartido necesita una persona y un monto por cada deuda' using errcode = 'check_violation';
    end if;
    v_count := cardinality(p_shared_persons);
    if v_count = 0 then
      raise exception 'Un gasto compartido necesita al menos una persona' using errcode = 'check_violation';
    end if;
    if v_count > 10 then
      raise exception 'Un gasto se comparte con hasta 10 personas' using errcode = 'check_violation';
    end if;
    for i in 1..v_count loop
      v_person := public.trim_js(p_shared_persons[i]);
      v_amount := p_shared_amounts[i];
      if v_person is null or v_amount is null then
        raise exception 'Un gasto compartido necesita una persona y un monto por cada deuda' using errcode = 'check_violation';
      end if;
      if v_person = '' then
        raise exception 'Ingresá con quién compartiste el gasto' using errcode = 'check_violation';
      end if;
      if char_length(v_person) > 60 then
        raise exception 'La persona admite hasta 60 caracteres' using errcode = 'check_violation';
      end if;
      if v_amount = 'NaN'::numeric or v_amount <= 0 then
        raise exception 'I4: el monto de la deuda debe ser mayor a cero' using errcode = 'check_violation';
      end if;
      if v_amount <> round(v_amount, 2) then
        raise exception 'I4: el monto de la deuda admite hasta 2 decimales' using errcode = 'check_violation';
      end if;
      -- Sin esto, la fila violaría debts_amount_ars_positive con un error crudo (DEF-013).
      if p_currency = 'USD' and round(v_amount * v_fx, 2) = 0 then
        raise exception 'I4: la deuda en pesos daría menos de $0,01' using errcode = 'check_violation';
      end if;
      v_persons := v_persons || v_person;
    end loop;
    -- Dos personas iguales después del recorte, sin distinguir mayúsculas.
    for i in 1..v_count loop
      for j in i + 1..v_count loop
        if lower(v_persons[i]) = lower(v_persons[j]) then
          raise exception 'Cada persona puede aparecer una sola vez' using errcode = 'check_violation';
        end if;
      end loop;
    end loop;
    -- Tope en la moneda del gasto. Con una persona, el mensaje de siempre (US-41); igual al gasto se acepta.
    select sum(a) into v_sum from unnest(p_shared_amounts) as a;
    if v_count = 1 and v_sum > p_amount then
      raise exception 'I7: la deuda no puede superar el monto del gasto' using errcode = 'check_violation';
    elsif v_count > 1 and v_sum > p_amount then
      raise exception 'I7: la suma de las deudas no puede superar el monto del gasto' using errcode = 'check_violation';
    end if;
    -- Tope en pesos, solo en USD: cada deuda se redondea por separado y la suma puede pasarse por
    -- centavos; el trigger de I7 la rechazaría con un mensaje crudo.
    if p_currency = 'USD' then
      select sum(round(a * v_fx, 2)) into v_sum_ars from unnest(p_shared_amounts) as a;
      if v_sum_ars > round(p_amount * v_fx, 2) then
        raise exception 'I7: en pesos, la suma de las deudas supera el gasto por redondeo' using errcode = 'check_violation';
      end if;
    end if;
  end if;

  -- security definer se salta RLS: la pertenencia al usuario se chequea a mano.
  select type into v_account_type
    from public.accounts
   where id = p_account_id and user_id = v_user and archived_at is null;
  if not found then
    raise exception 'la cuenta no existe, no es tuya o está archivada' using errcode = 'foreign_key_violation';
  end if;

  if p_category_id is not null and not exists (
    select 1 from public.categories
     where id = p_category_id and user_id = v_user and archived_at is null
  ) then
    raise exception 'la categoría no existe, no es tuya o está archivada' using errcode = 'foreign_key_violation';
  end if;

  if p_installments_count > 1 and not (p_type = 'expense' and v_account_type = 'credit_card') then
    raise exception 'I6: las cuotas solo aplican a gastos con cuenta credit_card'
      using errcode = 'check_violation';
  end if;

  v_tx_id := public.insert_transaction_with_entries(
    v_user, p_type, p_amount, p_currency, p_fx_rate, p_category_id, p_account_id,
    p_installments_count, p_occurred_on, p_description, null, null, p_request_id, p_installments_paid
  );

  -- Solo con clave puede volver null: otra llamada con la misma clave confirmó primero (CA-10).
  -- Su transacción ya trae sus imputaciones y su deuda: no se inserta nada más.
  if v_tx_id is null then
    select id into strict v_tx_id
      from public.transactions
     where user_id = v_user and request_id = p_request_id;
    return v_tx_id;
  end if;

  -- Una deuda por persona, todas en la misma transacción que el gasto (C4, ADR-040 §3). El tope de
  -- US-41 ya se chequeó arriba; check_debt_rule (I7) sigue como red de contención.
  if v_shared then
    for i in 1..v_count loop
      insert into public.debts (
        user_id, transaction_id, person, amount, currency, fx_rate, direction, status, incurred_on, notes
      ) values (
        v_user, v_tx_id, v_persons[i], p_shared_amounts[i], p_currency, p_fx_rate,
        'owed_to_me', 'pending', p_occurred_on, null
      );
    end loop;
  end if;

  return v_tx_id;
end $$;

revoke execute on function public.create_transaction(
  transaction_type, numeric, currency_code, numeric, uuid, uuid, int, date, text, text[], numeric[], uuid, int
) from public, anon;
grant execute on function public.create_transaction(
  transaction_type, numeric, currency_code, numeric, uuid, uuid, int, date, text, text[], numeric[], uuid, int
) to authenticated;
