-- US-52 (#210), ADR-030 y ADR-032: create_subscription es la única vía para dar de alta una suscripción.
-- Fija CA-1 (alta), CA-2 (meses vencidos en la misma operación), CA-3/CA-8 (cada mensaje por API, sin
-- crear nada), CA-4 a CA-7 (bordes), CA-9 (sin escritura directa), CA-13 (par de autorización, C7),
-- CA-15 (categoría y cuenta ajenas o archivadas), la idempotencia de la puesta al día (I11, I16), que
-- las funciones internas no se exponen y que create_transaction sigue repartiendo cuotas (I1).
-- Las fechas son relativas al hoy argentino (ADR-021). Datos ficticios; todo se revierte (ADR-015).
begin;
select plan(86);

insert into auth.users (id, instance_id, aud, role, email) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','00000000-0000-0000-0000-000000000000','authenticated','authenticated','a@test.local'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b@test.local');
insert into categories (id, user_id, name) values
  ('c0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Streaming'),
  ('c0000000-0000-0000-0000-000000000002','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','Ajena'),
  ('c0000000-0000-0000-0000-000000000003','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Vieja');
update categories set archived_at = now() where id = 'c0000000-0000-0000-0000-000000000003';
insert into accounts (id, user_id, name, type, currency) values
  ('a0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Visa','credit_card','ARS'),
  ('a0000000-0000-0000-0000-000000000002','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','Ajena','cash','ARS'),
  ('a0000000-0000-0000-0000-000000000003','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Vieja','cash','ARS');
update accounts set archived_at = now() where id = 'a0000000-0000-0000-0000-000000000003';

-- Fechas relativas al hoy argentino (ADR-021).
select set_config('t.today', (now() at time zone 'America/Argentina/Buenos_Aires')::date::text, true);
select set_config('t.cur', date_trunc('month', current_setting('t.today')::date)::date::text, true);
select set_config('t.min_start', (current_setting('t.cur')::date - interval '24 months')::date::text, true);
select set_config('t.max_start', (current_setting('t.cur')::date + interval '12 months')::date::text, true);
-- "El mes de inicio va de octubre 2024 a octubre 2027", calculado con nombres fijos en español.
select set_config('t.range_msg',
  format('El mes de inicio va de %s %s a %s %s',
    (array['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'])
      [extract(month from current_setting('t.min_start')::date)::int],
    extract(year from current_setting('t.min_start')::date)::int,
    (array['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'])
      [extract(month from current_setting('t.max_start')::date)::int],
    extract(year from current_setting('t.max_start')::date)::int), true);
-- Un alta que no genera nada: período corriente con día de cobro mañana. Si hoy es el último día del
-- mes, cualquier día de cobro ya pasó (R4 recorta al último día), así que se usa el mes que viene.
select set_config('t.ng_start', case
  when current_setting('t.today')::date < (current_setting('t.cur')::date + interval '1 month - 1 day')::date
    then current_setting('t.cur')
  else (current_setting('t.cur')::date + interval '1 month')::date::text end, true);
select set_config('t.ng_day', case
  when current_setting('t.today')::date < (current_setting('t.cur')::date + interval '1 month - 1 day')::date
    then (extract(day from current_setting('t.today')::date)::int + 1)::text
  else '1' end, true);

set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

-- ---------------------------------------------------------------------------
-- CA-1: alta con datos válidos y sin meses vencidos
-- ---------------------------------------------------------------------------
select set_config('t.r1', create_subscription(
  p_name => 'Spotify', p_amount => 4500.50, p_currency => 'ARS',
  p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => 'a0000000-0000-0000-0000-000000000001',
  p_billing_day => current_setting('t.ng_day')::numeric, p_start_period => current_setting('t.ng_start')::date)::text, true);
select set_config('t.s1', current_setting('t.r1')::jsonb ->> 'subscription_id', true);

select is((select count(*) from subscriptions), 1::bigint, 'US-52 CA-1: el alta crea una sola suscripción');
select is((select count(*) from subscriptions where id = current_setting('t.s1')::uuid), 1::bigint,
  'US-52 CA-1: la RPC devuelve el subscription_id de la fila creada');
select is((current_setting('t.r1')::jsonb ->> 'generated')::int, 0,
  'US-52 CA-1: sin períodos vencidos devuelve generated = 0');
select is((select status::text from subscriptions where id = current_setting('t.s1')::uuid), 'active',
  'US-52 CA-1: la suscripción nace con status = active');
select is((select generate_from_period from subscriptions where id = current_setting('t.s1')::uuid),
  current_setting('t.ng_start')::date, 'US-52 CA-1 / R8: generate_from_period = start_period');
select is((select count(*) from transactions where subscription_id = current_setting('t.s1')::uuid), 0::bigint,
  'US-52 CA-1 / R5: con el día de cobro por venir no se crea ninguna transacción');

-- ---------------------------------------------------------------------------
-- CA-2: los meses vencidos se crean en la misma operación
-- ---------------------------------------------------------------------------
select set_config('t.r2', create_subscription(
  p_name => 'Gimnasio', p_amount => 25000.50, p_currency => 'ARS',
  p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => 'a0000000-0000-0000-0000-000000000001',
  p_billing_day => 1, p_start_period => (current_setting('t.cur')::date - interval '2 months')::date)::text, true);
select set_config('t.s2', current_setting('t.r2')::jsonb ->> 'subscription_id', true);

select is((current_setting('t.r2')::jsonb ->> 'generated')::int, 3,
  'US-52 CA-2: inicio dos meses atrás con día 1 devuelve generated = 3 (dos pasados y el corriente)');
select is((select count(*) from transactions where subscription_id = current_setting('t.s2')::uuid), 3::bigint,
  'US-52 CA-2: existen exactamente 3 transacciones de la suscripción');
select is((select array_agg(subscription_period order by subscription_period) from transactions
            where subscription_id = current_setting('t.s2')::uuid),
  array[(current_setting('t.cur')::date - interval '2 months')::date,
        (current_setting('t.cur')::date - interval '1 month')::date,
        current_setting('t.cur')::date],
  'US-52 CA-2 / R1: una transacción por período, del mes de inicio al corriente');
select is((select array_agg(occurred_on order by occurred_on) from transactions
            where subscription_id = current_setting('t.s2')::uuid),
  array[(current_setting('t.cur')::date - interval '2 months')::date,
        (current_setting('t.cur')::date - interval '1 month')::date,
        current_setting('t.cur')::date],
  'US-52 CA-2 / R4: occurred_on es el día de cobro de cada período');
select is((select count(*) from transactions
            where subscription_id = current_setting('t.s2')::uuid
              and type = 'expense' and installments_count = 1 and amount = 25000.50 and currency = 'ARS'
              and category_id = 'c0000000-0000-0000-0000-000000000001'
              and account_id = 'a0000000-0000-0000-0000-000000000001'), 3::bigint,
  'US-52 CA-2 / R7 / I14: cada una es un gasto en 1 cuota con el monto, la moneda, la categoría y la cuenta de la suscripción');
select is((select count(*) from ledger_entries le join transactions t on t.id = le.transaction_id
            where t.subscription_id = current_setting('t.s2')::uuid), 3::bigint,
  'US-52 CA-2: una imputación por transacción');
select is((select count(*) from ledger_entries le join transactions t on t.id = le.transaction_id
            where t.subscription_id = current_setting('t.s2')::uuid
              and le.installment_number = 1 and le.amount = t.amount and le.period = t.subscription_period), 3::bigint,
  'US-52 CA-2 / I1: cada imputación es la cuota 1, por el monto de la transacción y en su período');

-- ---------------------------------------------------------------------------
-- Idempotencia de la puesta al día (I11, I16), como dueño de la tabla
-- ---------------------------------------------------------------------------
reset role;
select set_config('t.tx_before', (select count(*) from transactions where user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')::text, true);
select set_config('t.le_before', (select count(*) from ledger_entries where user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')::text, true);
select set_config('t.cu1', catch_up_subscriptions('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', current_setting('t.today')::date)::text, true);
select set_config('t.cu2', catch_up_subscriptions('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', current_setting('t.today')::date)::text, true);
select is((current_setting('t.cu1')::jsonb ->> 'generated')::int, 0,
  'I16: tras el alta ya no queda nada vencido; la primera puesta al día no genera');
select is((current_setting('t.cu2')::jsonb ->> 'generated')::int, 0,
  'I11 / I16: la segunda puesta al día seguida devuelve generated = 0');
select is((select count(*) from transactions where user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), current_setting('t.tx_before')::bigint,
  'I11 / I16: dos puestas al día seguidas no cambian la cantidad de transacciones');
select is((select count(*) from ledger_entries where user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), current_setting('t.le_before')::bigint,
  'I11 / I16: dos puestas al día seguidas no cambian la cantidad de imputaciones');
select is(current_setting('t.cu2')::jsonb -> 'failed', '[]'::jsonb,
  'I16: la puesta al día repetida no reporta fallos');

set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

-- ---------------------------------------------------------------------------
-- CA-6: recorte de nombre y descripción; 60 caracteres se aceptan
-- ---------------------------------------------------------------------------
select lives_ok($$select create_subscription('  Netflix  ', 5000, 'ARS',
    'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
    10, current_setting('t.cur')::date, null, '   ')$$,
  'US-52 CA-6: "  Netflix  " con descripción de solo espacios se acepta');
select is((select count(*) from subscriptions where name = 'Netflix'), 1::bigint,
  'US-52 CA-6: "  Netflix  " se guarda como "Netflix"');
select is((select description from subscriptions where name = 'Netflix'), null,
  'US-52 CA-6: una descripción de solo espacios se guarda como null');
select lives_ok($$select create_subscription(repeat('😀', 60), 5000, 'ARS',
    'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
    10, current_setting('t.cur')::date, null, '  ' || repeat('d', 200) || '  ')$$,
  'US-52 CA-6: un nombre de 60 emojis (60 puntos de código) y una descripción de 200 caracteres se aceptan');
select is((select char_length(name) from subscriptions where name = repeat('😀', 60)), 60,
  'US-52 CA-6: el nombre de 60 emojis se guarda completo');
select is((select description from subscriptions where name = repeat('😀', 60)), repeat('d', 200),
  'US-52 CA-6: la descripción se guarda sin los espacios de los bordes');

-- ---------------------------------------------------------------------------
-- CA-7: nombre único sin distinguir mayúsculas entre activas y pausadas
-- ---------------------------------------------------------------------------
select throws_ok($$select create_subscription(' netflix ', 5000, 'ARS',
    'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
    10, current_setting('t.cur')::date)$$,
  null, 'Ya tenés una suscripción con ese nombre',
  'US-52 CA-7: " netflix " contra "Netflix" activa se rechaza');
select is((select count(*) from subscriptions where lower(name) = 'netflix'), 1::bigint,
  'US-52 CA-7: el rechazo por nombre repetido no crea ninguna fila');

-- Sin RPC de cancelar todavía: se cancela como dueño de la tabla.
reset role;
update subscriptions set status = 'cancelled', cancelled_at = now()
 where user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' and name = 'Netflix';
set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

select lives_ok($$select create_subscription(' netflix ', 5000, 'ARS',
    'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
    10, current_setting('t.cur')::date)$$,
  'US-52 CA-7: " netflix " contra "Netflix" cancelada se acepta');
select is((select count(*) from subscriptions where lower(name) = 'netflix' and status <> 'cancelled'), 1::bigint,
  'US-52 CA-7: queda una sola "netflix" no cancelada');

-- Sin RPC de pausar todavía: se pausa como dueño de la tabla.
reset role;
update subscriptions set status = 'paused', paused_at = now()
 where user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' and lower(name) = 'netflix' and status = 'active';
set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

select throws_ok($$select create_subscription('NETFLIX', 5000, 'ARS',
    'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
    10, current_setting('t.cur')::date)$$,
  null, 'Ya tenés una suscripción con ese nombre',
  'US-52 CA-7: "NETFLIX" contra "netflix" pausada se rechaza');

-- ---------------------------------------------------------------------------
-- Bordes válidos: CA-4 (día de cobro), CA-5 (mes de inicio), monto máximo y mes de fin
-- ---------------------------------------------------------------------------
select lives_ok($$select create_subscription('Día uno', 1000, 'ARS',
    'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
    1, current_setting('t.cur')::date)$$,
  'US-52 CA-4: día de cobro 1 se acepta');
select lives_ok($$select create_subscription('Día treinta y uno', 1000, 'ARS',
    'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
    31, current_setting('t.cur')::date)$$,
  'US-52 CA-4: día de cobro 31 se acepta');
select is((select billing_day from subscriptions where name = 'Día treinta y uno'), 31,
  'US-52 CA-4: el día de cobro 31 se guarda como 31');

select set_config('t.r5', create_subscription('Inicio mínimo', 1000, 'ARS',
    'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
    1, current_setting('t.min_start')::date)::text, true);
select is((select start_period from subscriptions where name = 'Inicio mínimo'), current_setting('t.min_start')::date,
  'US-52 CA-5: el mes de inicio 24 meses antes del corriente se acepta');
select is((current_setting('t.r5')::jsonb ->> 'generated')::int, 25,
  'US-52 CA-5 / ADR-032: el alta más atrasada genera como máximo 25 ocurrencias');
select lives_ok($$select create_subscription('Inicio máximo', 1000, 'ARS',
    'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
    1, current_setting('t.max_start')::date)$$,
  'US-52 CA-5: el mes de inicio 12 meses después del corriente se acepta');

select lives_ok($$select create_subscription('Monto máximo', 999999999999.99, 'ARS',
    'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
    current_setting('t.ng_day')::numeric, current_setting('t.ng_start')::date)$$,
  'US-52 CA-3: el monto máximo $999.999.999.999,99 se acepta');
select lives_ok($$select create_subscription('Fin máximo', 1000, 'ARS',
    'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
    current_setting('t.ng_day')::numeric, current_setting('t.ng_start')::date, date '2099-12-01')$$,
  'US-52 CA-3: el mes de fin diciembre 2099 se acepta');
select lives_ok($$select create_subscription('Fin igual al inicio', 1000, 'ARS',
    'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
    current_setting('t.ng_day')::numeric, current_setting('t.ng_start')::date, current_setting('t.ng_start')::date)$$,
  'US-52 CA-3 / I12: el mes de fin igual al de inicio se acepta');

-- ---------------------------------------------------------------------------
-- CA-3 / CA-8: cada mensaje por API, sin crear nada
-- ---------------------------------------------------------------------------
reset role;
create temp table snap_subs on commit drop as select * from subscriptions where user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
select set_config('t.tx_snap', (select count(*) from transactions where user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')::text, true);
grant select on snap_subs to authenticated;
set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

select throws_ok($$select create_subscription('', 1000, 'ARS',
    'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 10, current_setting('t.cur')::date)$$,
  null, 'Escribí un nombre', 'US-52 CA-3 / CA-8: nombre vacío se rechaza');
select throws_ok($$select create_subscription('    ', 1000, 'ARS',
    'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 10, current_setting('t.cur')::date)$$,
  null, 'Escribí un nombre', 'US-52 CA-3 / CA-8: nombre de solo espacios se rechaza');
select throws_ok($$select create_subscription(null, 1000, 'ARS',
    'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 10, current_setting('t.cur')::date)$$,
  null, 'Escribí un nombre', 'US-52 CA-3 / CA-8: nombre null se rechaza');
select throws_ok($$select create_subscription(repeat('a', 61), 1000, 'ARS',
    'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 10, current_setting('t.cur')::date)$$,
  null, 'El nombre admite hasta 60 caracteres', 'US-52 CA-6 / CA-8: nombre de 61 caracteres se rechaza');
select throws_ok($$select create_subscription(repeat('😀', 61), 1000, 'ARS',
    'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 10, current_setting('t.cur')::date)$$,
  null, 'El nombre admite hasta 60 caracteres', 'US-52 CA-6 / CA-8: nombre de 61 emojis se rechaza (cuenta puntos de código)');

select throws_ok($$select create_subscription('Rechazo', 0, 'ARS',
    'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 10, current_setting('t.cur')::date)$$,
  null, 'El monto debe ser mayor a cero', 'US-52 CA-3 / CA-8: monto 0 se rechaza');
select throws_ok($$select create_subscription('Rechazo', -100, 'ARS',
    'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 10, current_setting('t.cur')::date)$$,
  null, 'El monto debe ser mayor a cero', 'US-52 CA-3 / CA-8: monto negativo se rechaza');
select throws_ok($$select create_subscription('Rechazo', null, 'ARS',
    'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 10, current_setting('t.cur')::date)$$,
  null, 'El monto debe ser mayor a cero', 'US-52 CA-3 / CA-8: monto vacío (null) se rechaza');
select throws_ok($$select create_subscription('Rechazo', 'NaN'::numeric, 'ARS',
    'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 10, current_setting('t.cur')::date)$$,
  null, 'El monto debe ser mayor a cero', 'US-52 CA-8 / I4: monto NaN se rechaza');
select throws_ok($$select create_subscription('Rechazo', 10.001, 'ARS',
    'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 10, current_setting('t.cur')::date)$$,
  null, 'El monto admite hasta 2 decimales', 'US-52 CA-3 / CA-8: monto con 3 decimales se rechaza');
select throws_ok($$select create_subscription('Rechazo', 1000000000000.00, 'ARS',
    'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 10, current_setting('t.cur')::date)$$,
  null, 'El monto máximo es $999.999.999.999,99', 'US-52 CA-3 / CA-8: monto mayor al máximo en ARS se rechaza');
select throws_ok($$select create_subscription('Rechazo', 1000000000000.00, 'USD',
    'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 10, current_setting('t.cur')::date)$$,
  null, 'El monto máximo es USD 999.999.999.999,99', 'US-52 CA-3 / CA-8: monto mayor al máximo en USD se rechaza');

select throws_ok($$select create_subscription('Rechazo', 1000, 'ARS',
    null, 'a0000000-0000-0000-0000-000000000001', 10, current_setting('t.cur')::date)$$,
  null, 'Elegí una categoría', 'US-52 CA-3 / CA-8: sin categoría se rechaza');
select throws_ok($$select create_subscription('Rechazo', 1000, 'ARS',
    'c0000000-0000-0000-0000-000000000001', null, 10, current_setting('t.cur')::date)$$,
  null, 'Elegí un medio de pago', 'US-52 CA-3 / CA-8: sin medio de pago se rechaza');
select throws_ok($$select create_subscription('Rechazo', 1000, 'ARS',
    'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', null, current_setting('t.cur')::date)$$,
  null, 'Indicá el día de cobro', 'US-52 CA-3 / CA-8: día de cobro vacío se rechaza');
select throws_ok($$select create_subscription('Rechazo', 1000, 'ARS',
    'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 10, null)$$,
  null, 'Elegí el mes de inicio', 'US-52 CA-3 / CA-8: mes de inicio vacío se rechaza');
select throws_ok($$select create_subscription('Rechazo', 1000, 'ARS',
    'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 10,
    current_setting('t.cur')::date, (current_setting('t.cur')::date - interval '1 month')::date)$$,
  null, 'El mes de fin no puede ser anterior al de inicio', 'US-52 CA-3 / CA-8 / I12: mes de fin anterior al de inicio se rechaza');
select throws_ok($$select create_subscription('Rechazo', 1000, 'ARS',
    'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 10,
    current_setting('t.cur')::date, date '2100-01-01')$$,
  null, 'El mes de fin puede ser como máximo diciembre 2099', 'US-52 CA-3 / CA-8: mes de fin enero 2100 se rechaza');
select throws_ok($$select create_subscription('Rechazo', 1000, 'ARS',
    'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 10,
    current_setting('t.cur')::date, null, repeat('d', 201))$$,
  null, 'La descripción admite hasta 200 caracteres', 'US-52 CA-3 / CA-8: descripción de 201 caracteres se rechaza');

-- CA-4: día de cobro fuera de rango o no entero
select throws_ok($$select create_subscription('Rechazo', 1000, 'ARS',
    'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 0, current_setting('t.cur')::date)$$,
  null, 'El día de cobro va de 1 a 31', 'US-52 CA-4 / I13: día de cobro 0 se rechaza');
select throws_ok($$select create_subscription('Rechazo', 1000, 'ARS',
    'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 32, current_setting('t.cur')::date)$$,
  null, 'El día de cobro va de 1 a 31', 'US-52 CA-4 / I13: día de cobro 32 se rechaza');
select throws_ok($$select create_subscription('Rechazo', 1000, 'ARS',
    'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 1.5, current_setting('t.cur')::date)$$,
  null, 'El día de cobro va de 1 a 31', 'US-52 CA-4: día de cobro 1,5 por API se rechaza');

-- CA-5: mes de inicio fuera de rango
select throws_ok($$select create_subscription('Rechazo', 1000, 'ARS',
    'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 10,
    (current_setting('t.min_start')::date - interval '1 month')::date)$$,
  null, current_setting('t.range_msg'), 'US-52 CA-5: el mes de inicio 25 meses antes del corriente se rechaza');
select throws_ok($$select create_subscription('Rechazo', 1000, 'ARS',
    'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 10,
    (current_setting('t.max_start')::date + interval '1 month')::date)$$,
  null, current_setting('t.range_msg'), 'US-52 CA-5: el mes de inicio 13 meses después del corriente se rechaza');

-- CA-15: categoría o cuenta ajena o archivada
select throws_ok($$select create_subscription('Rechazo', 1000, 'ARS',
    'c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 10, current_setting('t.cur')::date)$$,
  null, 'La categoría no está disponible', 'US-52 CA-15: una categoría de otro usuario se rechaza');
select throws_ok($$select create_subscription('Rechazo', 1000, 'ARS',
    'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 10, current_setting('t.cur')::date)$$,
  null, 'El medio de pago no está disponible', 'US-52 CA-15: una cuenta de otro usuario se rechaza');
select throws_ok($$select create_subscription('Rechazo', 1000, 'ARS',
    'c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 10, current_setting('t.cur')::date)$$,
  null, 'La categoría no está disponible', 'US-52 CA-15: una categoría archivada propia se rechaza');
select throws_ok($$select create_subscription('Rechazo', 1000, 'ARS',
    'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 10, current_setting('t.cur')::date)$$,
  null, 'El medio de pago no está disponible', 'US-52 CA-15: una cuenta archivada propia se rechaza');

select results_eq($$select * from subscriptions order by id$$, $$select * from snap_subs order by id$$,
  'US-52 CA-3 / CA-8: ningún rechazo creó ni cambió suscripciones');
select is((select count(*) from transactions), current_setting('t.tx_snap')::bigint,
  'US-52 CA-3 / CA-8: ningún rechazo creó transacciones');

-- ---------------------------------------------------------------------------
-- CA-9: sin escritura directa sobre subscriptions (ADR-030)
-- ---------------------------------------------------------------------------
select throws_ok($$insert into subscriptions (name, amount, currency, category_id, account_id, billing_day, start_period, generate_from_period)
    values ('Directa', 1000, 'ARS', 'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
            10, current_setting('t.cur')::date, current_setting('t.cur')::date)$$,
  '42501', null, 'US-52 CA-9: INSERT directo sobre subscriptions se rechaza con 42501');
select throws_ok($$update subscriptions set amount = 1 where id = current_setting('t.s1')::uuid$$,
  '42501', null, 'US-52 CA-9: UPDATE directo sobre subscriptions se rechaza con 42501');
select throws_ok($$delete from subscriptions where id = current_setting('t.s1')::uuid$$,
  '42501', null, 'US-52 CA-9: DELETE directo sobre subscriptions se rechaza con 42501');
select results_eq($$select * from subscriptions order by id$$, $$select * from snap_subs order by id$$,
  'US-52 CA-9: la escritura directa rechazada no cambió nada');

-- ---------------------------------------------------------------------------
-- CA-13: par de autorización de subscriptions (C7)
-- ---------------------------------------------------------------------------
select is((select count(*) from subscriptions), (select count(*) from snap_subs),
  'US-52 CA-13: el dueño ve sus suscripciones (evita el falso verde de "todo da 0")');

set local request.jwt.claims = '{"sub":"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb","role":"authenticated"}';
select is((select count(*) from subscriptions), 0::bigint,
  'US-52 CA-13 / C7: con la sesión de otro usuario, subscriptions devuelve 0 filas');
select is((select count(*) from subscriptions where id = current_setting('t.s1')::uuid), 0::bigint,
  'US-52 CA-13 / C7: pedir por id una suscripción ajena da vacío, no error');

reset role;
set local role anon;
set local request.jwt.claims = '{"role":"anon"}';
select throws_ok($$select * from subscriptions$$, '42501', null,
  'US-52 CA-13: anon no lee subscriptions (42501)');
select throws_ok($$select create_subscription('Anon', 1000, 'ARS',
    'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 10, current_setting('t.cur')::date)$$,
  '42501', null, 'US-52 CA-13: anon no puede llamar a create_subscription (42501)');

-- ---------------------------------------------------------------------------
-- Funciones internas: ni anon ni authenticated las ejecutan (ADR-030)
-- ---------------------------------------------------------------------------
select throws_ok($$select catch_up_subscriptions('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, current_setting('t.today')::date)$$,
  '42501', null, 'ADR-030: anon no puede ejecutar catch_up_subscriptions');
select throws_ok($$select insert_transaction_with_entries('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'expense', 1000::numeric, 'ARS',
    null::numeric, 'c0000000-0000-0000-0000-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid,
    1, current_setting('t.today')::date, null::text)$$,
  '42501', null, 'ADR-030: anon no puede ejecutar insert_transaction_with_entries');

reset role;
set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';
select throws_ok($$select catch_up_subscriptions('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, current_setting('t.today')::date)$$,
  '42501', null, 'ADR-030: authenticated no puede ejecutar catch_up_subscriptions');
select throws_ok($$select insert_transaction_with_entries('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'expense', 1000::numeric, 'ARS',
    null::numeric, 'c0000000-0000-0000-0000-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid,
    1, current_setting('t.today')::date, null::text)$$,
  '42501', null, 'ADR-030: authenticated no puede ejecutar insert_transaction_with_entries');
select is((select count(*) from transactions), current_setting('t.tx_snap')::bigint,
  'ADR-030: las llamadas rechazadas a funciones internas no crearon transacciones');

-- ---------------------------------------------------------------------------
-- Regresión: create_transaction usa insert_transaction_with_entries y sigue repartiendo cuotas (I1)
-- ---------------------------------------------------------------------------
select set_config('t.txr', create_transaction(
  p_type => 'expense', p_amount => 100000.00, p_currency => 'ARS', p_fx_rate => null,
  p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => 'a0000000-0000-0000-0000-000000000001',
  p_installments_count => 3, p_occurred_on => current_setting('t.today')::date)::text, true);
select is((select array_agg(amount order by installment_number) from ledger_entries
            where transaction_id = current_setting('t.txr')::uuid),
  array[33333.33, 33333.33, 33333.34]::numeric[],
  'I1: create_transaction de 100000.00 en 3 cuotas da 33333.33 + 33333.33 + 33333.34');
select is((select sum(amount) from ledger_entries where transaction_id = current_setting('t.txr')::uuid), 100000.00,
  'I1: las imputaciones de create_transaction suman exactamente el monto');
select is((select array_agg(period order by installment_number) from ledger_entries
            where transaction_id = current_setting('t.txr')::uuid),
  array[current_setting('t.cur')::date,
        (current_setting('t.cur')::date + interval '1 month')::date,
        (current_setting('t.cur')::date + interval '2 months')::date],
  'I3: las cuotas de create_transaction caen en meses consecutivos desde el de la compra');
select is((select subscription_id from transactions where id = current_setting('t.txr')::uuid), null,
  'create_transaction no asocia la transacción a ninguna suscripción');

select * from finish();
rollback;
