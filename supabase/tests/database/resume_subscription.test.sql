-- US-57 (#215), ADR-030 y docs/06-suscripciones.md R3/R5/R8: resume_subscription es la única vía para reanudar.
-- Fija CA-1 (estado, paused_at y piso generate_from_period = max(anterior, start_period, período corriente),
-- I12, I15), CA-2 (reanudar no rellena los meses pausados), CA-3 (inicio futuro: no falla y no genera),
-- CA-4 (el piso nunca baja), CA-5 (la ocurrencia del período corriente vencido se genera al reanudar, R5),
-- CA-6 (transiciones inexistentes), CA-7 (par de autorización, C7), la forma del jsonb devuelto, que lo ya
-- generado (también lo dado de baja, R2) no cambia, R6 (USD sin tipo de cambio no bloquea la reanudación),
-- que pausar y reanudar se componen, que una suscripción terminada se reanuda y que no hay UPDATE directo.
-- resume_subscription siempre usa el hoy del servidor (ADR-021): las fechas son relativas al hoy argentino y
-- el test pasa cualquier día del mes. Para fijar otro "hoy" al armar el historial se llama a la función
-- interna catch_up_subscriptions como dueño de la tabla. Datos ficticios; todo se revierte (ADR-015).
begin;
select plan(94);

-- ---------------------------------------------------------------------------
-- Fixtures (como dueño de las tablas)
-- ---------------------------------------------------------------------------
--   A 57a…01  dueño de todas las suscripciones          B 57b…02  otra sesión
--   d57…01 Piso viejo     pausada, piso 2 meses atrás      d57…08 Dadas de baja  R2: cur-1 y cur borradas, piso = cur
--   d57…02 Inicio futuro  start/piso = cur + 3 (pausada    d57…09 Dólares        USD sin fx_rates (R6)
--                         con la RPC)                      d57…10 Terminada      end_period = cur - 2
--   d57…03 Piso mayor     piso = cur + 5 (> start y cur)   d57…11 Componible     activa, pausar/reanudar x2
--   d57…04 Relleno        generada hasta cur-4, pausada    d57…12 Dólares con TC USD con fx_rates del mes
--   d57…05 Cobro por venir  día de cobro mañana (CA-5)     d57…13 De A           pausada, la tocan B y anon
--   d57…06 Activa         (CA-6)                           d57…14 Vence hoy      día de cobro = hoy (borde R5)
--   d57…07 Cancelada      (CA-6)
insert into auth.users (id, instance_id, aud, role, email) values
  ('57a00000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us57a@test.local'),
  ('57b00000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us57b@test.local');
insert into categories (id, user_id, name) values
  ('c5700000-0000-0000-0000-000000000001','57a00000-0000-0000-0000-000000000001','Streaming');
insert into accounts (id, user_id, name, type, currency) values
  ('a5700000-0000-0000-0000-000000000001','57a00000-0000-0000-0000-000000000001','Visa','credit_card','ARS');

-- Fechas relativas al hoy argentino (ADR-021).
select set_config('t.today', (now() at time zone 'America/Argentina/Buenos_Aires')::date::text, true);
select set_config('t.cur', date_trunc('month', current_setting('t.today')::date)::date::text, true);
select set_config('t.next', (current_setting('t.cur')::date + interval '1 month')::date::text, true);
-- Último día del mes corriente: con ng_day/ng_start da el "día de cobro todavía por venir" (patrón de pause_subscription).
select set_config('t.last', (current_setting('t.cur')::date + interval '1 month - 1 day')::date::text, true);
select set_config('t.ng_start', case
  when current_setting('t.today')::date < current_setting('t.last')::date then current_setting('t.cur')
  else current_setting('t.next') end, true);
select set_config('t.ng_day', case
  when current_setting('t.today')::date < current_setting('t.last')::date
    then (extract(day from current_setting('t.today')::date)::int + 1)::text
  else '1' end, true);

insert into subscriptions (id, user_id, name, amount, currency, category_id, account_id, billing_day,
                           start_period, end_period, generate_from_period, status, paused_at, cancelled_at) values
  -- 01: pausada hace tiempo, piso viejo (menor que el corriente)
  ('d5700000-0000-0000-0000-000000000001','57a00000-0000-0000-0000-000000000001','Piso viejo', 1234.50, 'ARS',
   'c5700000-0000-0000-0000-000000000001','a5700000-0000-0000-0000-000000000001', 1,
   (current_setting('t.cur')::date - interval '2 months')::date, null, (current_setting('t.cur')::date - interval '2 months')::date,
   'paused', now() - interval '40 days', null),
  -- 02: inicio futuro, todavía activa: se pausa con la RPC más abajo (sube el piso a max(piso, mes siguiente))
  ('d5700000-0000-0000-0000-000000000002','57a00000-0000-0000-0000-000000000001','Inicio futuro', 800.00, 'ARS',
   'c5700000-0000-0000-0000-000000000001','a5700000-0000-0000-0000-000000000001', 5,
   (current_setting('t.cur')::date + interval '3 months')::date, null, (current_setting('t.cur')::date + interval '3 months')::date,
   'active', null, null),
  -- 03: el piso ya es mayor que start_period y que el período corriente
  ('d5700000-0000-0000-0000-000000000003','57a00000-0000-0000-0000-000000000001','Piso mayor', 900.00, 'ARS',
   'c5700000-0000-0000-0000-000000000001','a5700000-0000-0000-0000-000000000001', 5,
   (current_setting('t.cur')::date - interval '2 months')::date, null, (current_setting('t.cur')::date + interval '5 months')::date,
   'paused', now() - interval '3 days', null),
  -- 04: día de cobro 1, ocurrencias generadas hasta cur-4 (se arma abajo con catch_up_subscriptions)
  ('d5700000-0000-0000-0000-000000000004','57a00000-0000-0000-0000-000000000001','Relleno', 2000.00, 'ARS',
   'c5700000-0000-0000-0000-000000000001','a5700000-0000-0000-0000-000000000001', 1,
   (current_setting('t.cur')::date - interval '6 months')::date, null, (current_setting('t.cur')::date - interval '6 months')::date,
   'active', null, null),
  -- 05: el día de cobro del período corriente todavía no llegó
  ('d5700000-0000-0000-0000-000000000005','57a00000-0000-0000-0000-000000000001','Cobro por venir', 3000.00, 'ARS',
   'c5700000-0000-0000-0000-000000000001','a5700000-0000-0000-0000-000000000001', current_setting('t.ng_day')::int,
   current_setting('t.ng_start')::date, null, current_setting('t.ng_start')::date,
   'paused', now() - interval '2 days', null),
  -- 06 y 07: transiciones inexistentes
  ('d5700000-0000-0000-0000-000000000006','57a00000-0000-0000-0000-000000000001','Activa', 500.00, 'ARS',
   'c5700000-0000-0000-0000-000000000001','a5700000-0000-0000-0000-000000000001', 5,
   current_setting('t.cur')::date, null, current_setting('t.cur')::date, 'active', null, null),
  ('d5700000-0000-0000-0000-000000000007','57a00000-0000-0000-0000-000000000001','Cancelada', 600.00, 'ARS',
   'c5700000-0000-0000-0000-000000000001','a5700000-0000-0000-0000-000000000001', 5,
   current_setting('t.cur')::date, null, current_setting('t.cur')::date, 'cancelled', null, now() - interval '1 day'),
  -- 08: se arma con el historial de abajo
  ('d5700000-0000-0000-0000-000000000008','57a00000-0000-0000-0000-000000000001','Dadas de baja', 700.00, 'ARS',
   'c5700000-0000-0000-0000-000000000001','a5700000-0000-0000-0000-000000000001', 1,
   (current_setting('t.cur')::date - interval '2 months')::date, null, (current_setting('t.cur')::date - interval '2 months')::date,
   'active', null, null),
  -- 09: USD sin fx_rates en ningún período
  ('d5700000-0000-0000-0000-000000000009','57a00000-0000-0000-0000-000000000001','Dólares', 10.00, 'USD',
   'c5700000-0000-0000-0000-000000000001','a5700000-0000-0000-0000-000000000001', 1,
   (current_setting('t.cur')::date - interval '1 month')::date, null, (current_setting('t.cur')::date - interval '1 month')::date,
   'paused', now() - interval '5 days', null),
  -- 10: terminada hace dos meses
  ('d5700000-0000-0000-0000-000000000010','57a00000-0000-0000-0000-000000000001','Terminada', 400.00, 'ARS',
   'c5700000-0000-0000-0000-000000000001','a5700000-0000-0000-0000-000000000001', 1,
   (current_setting('t.cur')::date - interval '5 months')::date, (current_setting('t.cur')::date - interval '2 months')::date,
   (current_setting('t.cur')::date - interval '2 months')::date, 'paused', now() - interval '20 days', null),
  -- 11: activa, para pausar y reanudar dos veces
  ('d5700000-0000-0000-0000-000000000011','57a00000-0000-0000-0000-000000000001','Componible', 300.00, 'ARS',
   'c5700000-0000-0000-0000-000000000001','a5700000-0000-0000-0000-000000000001', 1,
   (current_setting('t.cur')::date - interval '1 month')::date, null, (current_setting('t.cur')::date - interval '1 month')::date,
   'active', null, null),
  -- 12: USD con tipo de cambio del período corriente
  ('d5700000-0000-0000-0000-000000000012','57a00000-0000-0000-0000-000000000001','Dólares con TC', 10.00, 'USD',
   'c5700000-0000-0000-0000-000000000001','a5700000-0000-0000-0000-000000000001', 1,
   current_setting('t.cur')::date, null, current_setting('t.cur')::date, 'paused', now() - interval '1 day', null),
  -- 13: la que intentan reanudar B, anon y la sesión sin claims
  ('d5700000-0000-0000-0000-000000000013','57a00000-0000-0000-0000-000000000001','De A', 500.00, 'ARS',
   'c5700000-0000-0000-0000-000000000001','a5700000-0000-0000-0000-000000000001', 1,
   (current_setting('t.cur')::date - interval '1 month')::date, null, (current_setting('t.cur')::date - interval '1 month')::date,
   'paused', now() - interval '10 days', null),
  -- 14: el día de cobro es hoy: el borde de R5 (p_today >= occurred_on)
  ('d5700000-0000-0000-0000-000000000014','57a00000-0000-0000-0000-000000000001','Vence hoy', 650.00, 'ARS',
   'c5700000-0000-0000-0000-000000000001','a5700000-0000-0000-0000-000000000001',
   extract(day from current_setting('t.today')::date)::int,
   current_setting('t.cur')::date, null, current_setting('t.cur')::date, 'paused', now() - interval '1 day', null);

-- 04 (CA-2): ocurrencias de cur-6, cur-5 y cur-4 (puesta al día con un hoy fijo en el pasado); después se pausa
-- por SQL con el piso en cur-3, como si la pausa hubiera sido hace meses. Los meses cur-3 a cur-1 quedan vacíos.
select catch_up_subscriptions('57a00000-0000-0000-0000-000000000001',
  (current_setting('t.cur')::date - interval '4 months')::date, 'd5700000-0000-0000-0000-000000000004');
update subscriptions
   set status = 'paused', paused_at = now() - interval '100 days',
       generate_from_period = (current_setting('t.cur')::date - interval '3 months')::date
 where id = 'd5700000-0000-0000-0000-000000000004';

-- 08 (R2 + C10): tres ocurrencias (cur-2, cur-1, cur); las dos últimas dadas de baja; pausada con el piso en cur.
select catch_up_subscriptions('57a00000-0000-0000-0000-000000000001', current_setting('t.today')::date,
  'd5700000-0000-0000-0000-000000000008');
update transactions set deleted_at = now()
 where subscription_id = 'd5700000-0000-0000-0000-000000000008'
   and subscription_period >= (current_setting('t.cur')::date - interval '1 month')::date;
update subscriptions
   set status = 'paused', paused_at = now() - interval '1 hour', generate_from_period = current_setting('t.cur')::date
 where id = 'd5700000-0000-0000-0000-000000000008';

-- 02 (CA-3): pausada con la RPC (sube el piso a max(piso, mes siguiente) = start_period futuro).
set local role authenticated;
set local request.jwt.claims = '{"sub":"57a00000-0000-0000-0000-000000000001","role":"authenticated"}';
select pause_subscription('d5700000-0000-0000-0000-000000000002');
reset role;

-- Fotos previas para comprobar que "no cambia" es literal.
select set_config('t.snap_04_tx', (select jsonb_agg(to_jsonb(t) order by t.id)
  from transactions t where t.subscription_id = 'd5700000-0000-0000-0000-000000000004')::text, true);
select set_config('t.snap_08_tx', (select jsonb_agg(to_jsonb(t) order by t.id)
  from transactions t where t.subscription_id = 'd5700000-0000-0000-0000-000000000008')::text, true);
select set_config('t.snap_04_le_n', (select count(*) from ledger_entries le join transactions t on t.id = le.transaction_id
  where t.subscription_id = 'd5700000-0000-0000-0000-000000000004')::text, true);
select set_config('t.snap_06', (select to_jsonb(s)::text from subscriptions s where s.id = 'd5700000-0000-0000-0000-000000000006'), true);
select set_config('t.snap_07', (select to_jsonb(s)::text from subscriptions s where s.id = 'd5700000-0000-0000-0000-000000000007'), true);
select set_config('t.snap_13', (select to_jsonb(s)::text from subscriptions s where s.id = 'd5700000-0000-0000-0000-000000000013'), true);
select set_config('t.snap_01_rest', (select (to_jsonb(s) - 'status' - 'paused_at' - 'generate_from_period')::text
  from subscriptions s where s.id = 'd5700000-0000-0000-0000-000000000001'), true);
select set_config('t.tx_total_before', (select count(*) from transactions where user_id = '57a00000-0000-0000-0000-000000000001')::text, true);
-- Pisos antes de cualquier reanudación (CA-4 / I12).
create temp table floors_before as
  select id, generate_from_period as f, start_period from subscriptions;

-- ---------------------------------------------------------------------------
-- Sesión de A: se reanudan las pausadas
-- ---------------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claims = '{"sub":"57a00000-0000-0000-0000-000000000001","role":"authenticated"}';

select set_config('t.r01', resume_subscription('d5700000-0000-0000-0000-000000000001')::text, true);
select lives_ok($$select resume_subscription('d5700000-0000-0000-0000-000000000002')$$,
  'US-57 CA-3: reanudar con start_period futuro no falla (el CHECK start_period <= piso se respeta)');
select lives_ok($$select resume_subscription('d5700000-0000-0000-0000-000000000003')$$,
  'US-57 CA-1: reanudar con el piso ya mayor que start_period y el período corriente no falla');
select set_config('t.r04', resume_subscription('d5700000-0000-0000-0000-000000000004')::text, true);
select set_config('t.r05', resume_subscription('d5700000-0000-0000-0000-000000000005')::text, true);
select set_config('t.r08', resume_subscription('d5700000-0000-0000-0000-000000000008')::text, true);
select set_config('t.r09', resume_subscription('d5700000-0000-0000-0000-000000000009')::text, true);
select set_config('t.r10', resume_subscription('d5700000-0000-0000-0000-000000000010')::text, true);
-- El tipo de cambio del período corriente se carga recién ahora: 09 (USD sin fx_rates) ya se reanudó sin él.
reset role;
insert into fx_rates (user_id, period, ars_per_usd) values
  ('57a00000-0000-0000-0000-000000000001', current_setting('t.cur')::date, 1100.0000);
set local role authenticated;
set local request.jwt.claims = '{"sub":"57a00000-0000-0000-0000-000000000001","role":"authenticated"}';
select set_config('t.r12', resume_subscription('d5700000-0000-0000-0000-000000000012')::text, true);
select set_config('t.r14', resume_subscription('d5700000-0000-0000-0000-000000000014')::text, true);
reset role;

-- ---------------------------------------------------------------------------
-- La RPC devuelve { generated_after } con un entero
-- ---------------------------------------------------------------------------
select is((select array_agg(k order by k) from jsonb_object_keys(current_setting('t.r01')::jsonb) k), array['generated_after'],
  'US-57: la RPC devuelve un jsonb con la única clave generated_after');
select is(jsonb_typeof(current_setting('t.r01')::jsonb -> 'generated_after'), 'number',
  'US-57: generated_after es un número JSON');
select ok((current_setting('t.r01')::jsonb ->> 'generated_after') ~ '^[0-9]+$',
  'US-57: generated_after es un entero no negativo, sin decimales');

-- ---------------------------------------------------------------------------
-- CA-1: estado, paused_at y el piso max(anterior, start_period, período corriente)
-- ---------------------------------------------------------------------------
select is((select status::text from subscriptions where id = 'd5700000-0000-0000-0000-000000000001'), 'active',
  'US-57 CA-1: tras reanudar, status = active');
select ok((select paused_at is null from subscriptions where id = 'd5700000-0000-0000-0000-000000000001'),
  'US-57 CA-1 / I15: tras reanudar, paused_at es null');
select is((select generate_from_period from subscriptions where id = 'd5700000-0000-0000-0000-000000000001'),
  current_setting('t.cur')::date,
  'US-57 CA-1 / R8: piso viejo menor (dos meses atrás) → generate_from_period = período corriente');
select ok((select start_period <= generate_from_period from subscriptions where id = 'd5700000-0000-0000-0000-000000000001'),
  'US-57 CA-1 / I12: start_period <= generate_from_period se mantiene');
select is((select to_jsonb(s) - 'status' - 'paused_at' - 'generate_from_period' from subscriptions s
            where s.id = 'd5700000-0000-0000-0000-000000000001'),
  current_setting('t.snap_01_rest')::jsonb,
  'US-57 CA-1: reanudar solo cambia status, paused_at y generate_from_period (nombre, monto, día de cobro… intactos)');

select is((select status::text from subscriptions where id = 'd5700000-0000-0000-0000-000000000002'), 'active',
  'US-57 CA-1: la suscripción con inicio futuro también queda activa');
select ok((select paused_at is null from subscriptions where id = 'd5700000-0000-0000-0000-000000000002'),
  'US-57 CA-1 / I15: la de inicio futuro queda sin paused_at');
select is((select generate_from_period from subscriptions where id = 'd5700000-0000-0000-0000-000000000002'),
  (current_setting('t.cur')::date + interval '3 months')::date,
  'US-57 CA-1 / R8: start_period futuro mayor que el período corriente → el piso queda en start_period');
select ok((select start_period = generate_from_period from subscriptions where id = 'd5700000-0000-0000-0000-000000000002'),
  'US-57 CA-1 / I12: el piso es exactamente start_period (no lo supera ni queda por debajo)');

select is((select generate_from_period from subscriptions where id = 'd5700000-0000-0000-0000-000000000003'),
  (current_setting('t.cur')::date + interval '5 months')::date,
  'US-57 CA-1 / I12: piso anterior ya mayor que start_period y que el corriente → no retrocede');
select is((select status::text from subscriptions where id = 'd5700000-0000-0000-0000-000000000003'), 'active',
  'US-57 CA-1: la de piso mayor queda activa');
select ok((select paused_at is null from subscriptions where id = 'd5700000-0000-0000-0000-000000000003'),
  'US-57 CA-1 / I15: la de piso mayor queda sin paused_at');

select is((select generate_from_period from subscriptions where id = 'd5700000-0000-0000-0000-000000000004'),
  current_setting('t.cur')::date,
  'US-57 CA-1 / R8: pausada con el piso en cur-3 → al reanudar el piso salta al período corriente');
select is((select generate_from_period from subscriptions where id = 'd5700000-0000-0000-0000-000000000005'),
  current_setting('t.ng_start')::date,
  'US-57 CA-1 / R8: con el cobro por venir el piso es max(piso, start_period, corriente) = el período de alta');

-- ---------------------------------------------------------------------------
-- CA-2: reanudar no rellena los meses en los que estuvo pausada
-- ---------------------------------------------------------------------------
select is((current_setting('t.r04')::jsonb ->> 'generated_after')::int, 1,
  'US-57 CA-2: con meses pausados sin ocurrencias, generated_after = 1 (solo el período corriente)');
select is((select array_agg(subscription_period order by subscription_period) from transactions
            where subscription_id = 'd5700000-0000-0000-0000-000000000004'),
  array[(current_setting('t.cur')::date - interval '6 months')::date,
        (current_setting('t.cur')::date - interval '5 months')::date,
        (current_setting('t.cur')::date - interval '4 months')::date,
        current_setting('t.cur')::date],
  'US-57 CA-2 / R8: existen las 3 viejas y la del período corriente; los meses pausados no se rellenaron');
select is((select count(*) from transactions
            where subscription_id = 'd5700000-0000-0000-0000-000000000004'
              and subscription_period between (current_setting('t.cur')::date - interval '3 months')::date
                                          and (current_setting('t.cur')::date - interval '1 month')::date),
  0::bigint,
  'US-57 CA-2 / R8: no hay ocurrencias de cur-3, cur-2 ni cur-1 (los meses pausados)');
select is((select min(subscription_period) from transactions
            where subscription_id = 'd5700000-0000-0000-0000-000000000004'
              and subscription_period > (current_setting('t.cur')::date - interval '4 months')::date),
  current_setting('t.cur')::date,
  'US-57 CA-2: la primera ocurrencia nueva es la del período corriente');
select is((select jsonb_agg(to_jsonb(t) order by t.id) from transactions t
            where t.subscription_id = 'd5700000-0000-0000-0000-000000000004'
              and t.subscription_period <= (current_setting('t.cur')::date - interval '4 months')::date),
  current_setting('t.snap_04_tx')::jsonb,
  'US-57 CA-2 / C5: las transacciones previas quedan idénticas fila por fila');
select is((select count(*) from ledger_entries le join transactions t on t.id = le.transaction_id
            where t.subscription_id = 'd5700000-0000-0000-0000-000000000004'
              and t.subscription_period <= (current_setting('t.cur')::date - interval '4 months')::date),
  current_setting('t.snap_04_le_n')::bigint,
  'US-57 CA-2: las imputaciones previas tampoco cambian de cantidad');

-- ---------------------------------------------------------------------------
-- CA-3: inicio futuro: la reanudación no falla y no genera nada
-- ---------------------------------------------------------------------------
select is((select count(*) from transactions where subscription_id = 'd5700000-0000-0000-0000-000000000002'), 0::bigint,
  'US-57 CA-3: con start_period futuro no se genera ninguna ocurrencia');
select is((select count(*) from transactions where subscription_id = 'd5700000-0000-0000-0000-000000000003'), 0::bigint,
  'US-57 CA-3 / I12: con el piso en el futuro tampoco se genera nada');

-- ---------------------------------------------------------------------------
-- CA-5: la ocurrencia del período corriente vencido se genera al reanudar (R5)
-- ---------------------------------------------------------------------------
select is((current_setting('t.r01')::jsonb ->> 'generated_after')::int, 1,
  'US-57 CA-5: día de cobro 1 ya vencido y sin transacción del período corriente → generated_after = 1');
select is((select count(*) from transactions where subscription_id = 'd5700000-0000-0000-0000-000000000001'), 1::bigint,
  'US-57 CA-5: existe una sola transacción de la suscripción (la del corriente, sin rellenar los meses viejos)');
select is((select subscription_period from transactions where subscription_id = 'd5700000-0000-0000-0000-000000000001'),
  current_setting('t.cur')::date,
  'US-57 CA-5: la ocurrencia es del período corriente');
select is((select occurred_on from transactions where subscription_id = 'd5700000-0000-0000-0000-000000000001'),
  current_setting('t.cur')::date,
  'US-57 CA-5 / R4: occurred_on es el día de cobro (el 1) del período corriente');
select is((select count(*) from transactions
            where subscription_id = 'd5700000-0000-0000-0000-000000000001'
              and type = 'expense' and installments_count = 1 and amount = 1234.50 and currency = 'ARS'
              and deleted_at is null and user_id = '57a00000-0000-0000-0000-000000000001'),
  1::bigint,
  'US-57 CA-5 / R7: es un gasto en 1 cuota con el monto vigente $1.234,50');
select is((select sum(le.amount) from ledger_entries le join transactions t on t.id = le.transaction_id
            where t.subscription_id = 'd5700000-0000-0000-0000-000000000001'), 1234.50,
  'US-57 CA-5 / I1: la imputación generada suma $1.234,50 exactos');

select is((current_setting('t.r14')::jsonb ->> 'generated_after')::int, 1,
  'US-57 CA-5 / R5: con el día de cobro igual a hoy (borde p_today >= occurred_on) se genera');
select is((select occurred_on from transactions where subscription_id = 'd5700000-0000-0000-0000-000000000014'),
  current_setting('t.today')::date,
  'US-57 CA-5 / R4: occurred_on es hoy');

select is((current_setting('t.r05')::jsonb ->> 'generated_after')::int, 0,
  'US-57 CA-5 / R5: con el día de cobro por venir generated_after = 0');
select is((select count(*) from transactions
            where subscription_id = 'd5700000-0000-0000-0000-000000000005'
              and subscription_period = current_setting('t.cur')::date),
  0::bigint,
  'US-57 CA-5 / R5: no existe la ocurrencia del mes corriente cuyo día de cobro no llegó');
select is((select status::text from subscriptions where id = 'd5700000-0000-0000-0000-000000000005'), 'active',
  'US-57 CA-5: la reanudación se hizo igual aunque no hubiera nada que generar');

select is((current_setting('t.r12')::jsonb ->> 'generated_after')::int, 1,
  'US-57 CA-5 / R6: USD con fx_rates del período corriente → generated_after = 1');
select is((select fx_rate from transactions where subscription_id = 'd5700000-0000-0000-0000-000000000012'), 1100.0000,
  'US-57 CA-5 / C5: la ocurrencia congela el tipo de cambio del período');
select is((select amount_ars from transactions where subscription_id = 'd5700000-0000-0000-0000-000000000012'), 11000.00,
  'US-57 CA-5 / C5: USD 10,00 x 1100,0000 = $11.000,00');

-- ---------------------------------------------------------------------------
-- R2 / C10: lo dado de baja no se regenera ni cambia
-- ---------------------------------------------------------------------------
select is((current_setting('t.r08')::jsonb ->> 'generated_after')::int, 0,
  'US-57 R2: la ocurrencia borrada del período corriente no se regenera (generated_after = 0)');
select is((select count(*) from transactions where subscription_id = 'd5700000-0000-0000-0000-000000000008'), 3::bigint,
  'US-57 R2: siguen las 3 filas de la suscripción (la borrada cuenta como existente, I11)');
select is((select count(*) from transactions where subscription_id = 'd5700000-0000-0000-0000-000000000008'
            and deleted_at is not null), 2::bigint,
  'US-57 C10: las 2 dadas de baja conservan su deleted_at');
select is((select jsonb_agg(to_jsonb(t) order by t.id) from transactions t
            where t.subscription_id = 'd5700000-0000-0000-0000-000000000008'),
  current_setting('t.snap_08_tx')::jsonb,
  'US-57 C5 / C10: las transacciones (con y sin baja) quedan idénticas fila por fila');
select is((select status::text from subscriptions where id = 'd5700000-0000-0000-0000-000000000008'), 'active',
  'US-57 R2: la reanudación se hizo igual');

-- ---------------------------------------------------------------------------
-- R6 / ADR-030: USD sin tipo de cambio del período corriente vencido no impide reanudar
-- ---------------------------------------------------------------------------
select is((current_setting('t.r09')::jsonb ->> 'generated_after')::int, 0,
  'US-57 R6: USD sin fx_rates del período corriente vencido → generated_after = 0 (no falla)');
select is((select status::text from subscriptions where id = 'd5700000-0000-0000-0000-000000000009'), 'active',
  'US-57 R6: la reanudación se hace igual aunque la puesta al día posterior no pueda generar');
select is((select count(*) from transactions where subscription_id = 'd5700000-0000-0000-0000-000000000009'), 0::bigint,
  'US-57 R6: no hay transacción de ese período');
select is((select generate_from_period from subscriptions where id = 'd5700000-0000-0000-0000-000000000009'),
  current_setting('t.cur')::date,
  'US-57 R6 / R8: el piso igual saltó al período corriente');

-- ---------------------------------------------------------------------------
-- Suscripción terminada (end_period anterior al corriente): se reanuda y no genera
-- ---------------------------------------------------------------------------
select is((current_setting('t.r10')::jsonb ->> 'generated_after')::int, 0,
  'US-57 R1: reanudar una terminada funciona y no genera nada (rango vacío)');
select is((select status::text from subscriptions where id = 'd5700000-0000-0000-0000-000000000010'), 'active',
  'US-57: la terminada queda activa');
select is((select generate_from_period from subscriptions where id = 'd5700000-0000-0000-0000-000000000010'),
  current_setting('t.cur')::date,
  'US-57 R8: el piso queda en el período corriente');
select ok((select generate_from_period > end_period from subscriptions where id = 'd5700000-0000-0000-0000-000000000010'),
  'US-57 R1 / I12: el piso queda por encima de end_period (ningún CHECK lo prohíbe)');
select is((select count(*) from transactions where subscription_id = 'd5700000-0000-0000-0000-000000000010'), 0::bigint,
  'US-57 R1: no existe ninguna transacción de la terminada');

-- ---------------------------------------------------------------------------
-- CA-4: el piso nunca es menor que antes (I12), en todos los escenarios
-- ---------------------------------------------------------------------------
select is((select count(*) from subscriptions s join floors_before b using (id)
            where s.generate_from_period < b.f), 0::bigint,
  'US-57 CA-4 / I12: ninguna suscripción tiene un piso menor que antes de reanudar');
select is((select count(*) from subscriptions s join floors_before b using (id)
            where s.status = 'active'
              and s.generate_from_period = greatest(b.f, b.start_period, current_setting('t.cur')::date)
              and s.id in ('d5700000-0000-0000-0000-000000000001','d5700000-0000-0000-0000-000000000003',
                           'd5700000-0000-0000-0000-000000000004','d5700000-0000-0000-0000-000000000009',
                           'd5700000-0000-0000-0000-000000000010')), 5::bigint,
  'US-57 CA-4 / R8: las 5 reanudadas con piso viejo, mayor o terminadas quedan con piso = max(anterior, start_period, corriente)');
select ok((select bool_and(s.start_period <= s.generate_from_period) from subscriptions s),
  'US-57 CA-4 / I12: start_period <= generate_from_period en todas las filas tras las reanudaciones');

-- ---------------------------------------------------------------------------
-- CA-6: transiciones inexistentes (23514, mensaje exacto) y la fila no cambia
-- ---------------------------------------------------------------------------
select set_config('t.tx_total_cp6', (select count(*) from transactions where user_id = '57a00000-0000-0000-0000-000000000001')::text, true);
set local role authenticated;
set local request.jwt.claims = '{"sub":"57a00000-0000-0000-0000-000000000001","role":"authenticated"}';
select throws_ok($$select resume_subscription('d5700000-0000-0000-0000-000000000006')$$,
  '23514', 'La suscripción no está pausada',
  'US-57 CA-6: reanudar una activa se rechaza con 23514');
select throws_ok($$select resume_subscription('d5700000-0000-0000-0000-000000000007')$$,
  '23514', 'Una suscripción cancelada no se puede modificar',
  'US-57 CA-6: reanudar una cancelada se rechaza con 23514');
select throws_ok($$select resume_subscription('d5700000-0000-0000-0000-000000000001')$$,
  '23514', 'La suscripción no está pausada',
  'US-57 CA-6: reanudar dos veces seguidas la misma suscripción se rechaza con 23514');
reset role;
select is((select to_jsonb(s)::text from subscriptions s where s.id = 'd5700000-0000-0000-0000-000000000006'),
  current_setting('t.snap_06'),
  'US-57 CA-6: la activa rechazada conserva status, paused_at y piso');
select is((select to_jsonb(s)::text from subscriptions s where s.id = 'd5700000-0000-0000-0000-000000000007'),
  current_setting('t.snap_07'),
  'US-57 CA-6: la cancelada rechazada no cambia');
select is((select count(*) from transactions where user_id = '57a00000-0000-0000-0000-000000000001'),
  current_setting('t.tx_total_cp6')::bigint,
  'US-57 CA-6: los rechazos no generaron transacciones');
select is((select count(*) from transactions where subscription_id in
            ('d5700000-0000-0000-0000-000000000006', 'd5700000-0000-0000-0000-000000000007')), 0::bigint,
  'US-57 CA-6: la activa y la cancelada siguen sin transacciones');
select is((select count(*) from transactions where user_id = '57a00000-0000-0000-0000-000000000001'),
  current_setting('t.tx_total_before')::bigint + 1 + 1 + 1 + 1 + 0,
  'US-57 CA-6: de todas las reanudaciones solo se generaron las 4 esperadas (01, 04, 12 y 14)');

-- ---------------------------------------------------------------------------
-- Sin UPDATE directo de status (ADR-030)
-- ---------------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claims = '{"sub":"57a00000-0000-0000-0000-000000000001","role":"authenticated"}';
select throws_ok($$update subscriptions set status = 'active', paused_at = null where id = 'd5700000-0000-0000-0000-000000000013'$$,
  '42501', null, 'US-57: UPDATE directo de status para reanudar sin la RPC se rechaza con 42501');
select throws_ok($$update subscriptions set generate_from_period = generate_from_period + interval '1 month' where id = 'd5700000-0000-0000-0000-000000000013'$$,
  '42501', null, 'US-57 / I12: UPDATE directo del piso se rechaza con 42501');
reset role;
select is((select to_jsonb(s)::text from subscriptions s where s.id = 'd5700000-0000-0000-0000-000000000013'),
  current_setting('t.snap_13'),
  'US-57: los UPDATE directos rechazados no cambiaron la fila (sigue pausada)');

-- ---------------------------------------------------------------------------
-- Pausar y reanudar son componibles: pausar → reanudar → pausar → reanudar
-- ---------------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claims = '{"sub":"57a00000-0000-0000-0000-000000000001","role":"authenticated"}';
select set_config('t.c0', (select generate_from_period::text from subscriptions where id = 'd5700000-0000-0000-0000-000000000011'), true);
select lives_ok($$select pause_subscription('d5700000-0000-0000-0000-000000000011')$$,
  'US-57: componible, paso 1: pausar una activa funciona');
select set_config('t.c1', (select generate_from_period::text from subscriptions where id = 'd5700000-0000-0000-0000-000000000011'), true);
select lives_ok($$select resume_subscription('d5700000-0000-0000-0000-000000000011')$$,
  'US-57: componible, paso 2: reanudar la recién pausada funciona');
select set_config('t.c2', (select generate_from_period::text from subscriptions where id = 'd5700000-0000-0000-0000-000000000011'), true);
select lives_ok($$select pause_subscription('d5700000-0000-0000-0000-000000000011')$$,
  'US-57: componible, paso 3: pausar la recién reanudada funciona');
select set_config('t.c3', (select generate_from_period::text from subscriptions where id = 'd5700000-0000-0000-0000-000000000011'), true);
select lives_ok($$select resume_subscription('d5700000-0000-0000-0000-000000000011')$$,
  'US-57: componible, paso 4: reanudar de nuevo funciona');
select set_config('t.c4', (select generate_from_period::text from subscriptions where id = 'd5700000-0000-0000-0000-000000000011'), true);
reset role;
select ok(current_setting('t.c0')::date <= current_setting('t.c1')::date
      and current_setting('t.c1')::date <= current_setting('t.c2')::date
      and current_setting('t.c2')::date <= current_setting('t.c3')::date
      and current_setting('t.c3')::date <= current_setting('t.c4')::date,
  'US-57 CA-4 / I12: el piso es monótono a lo largo de pausar, reanudar, pausar, reanudar');
select is(current_setting('t.c4')::date, current_setting('t.next')::date,
  'US-57 R8: pausar subió el piso al mes siguiente y reanudar no lo bajó al corriente');
select is((select status::text from subscriptions where id = 'd5700000-0000-0000-0000-000000000011'), 'active',
  'US-57: después del ciclo doble, la suscripción queda activa');
select ok((select paused_at is null from subscriptions where id = 'd5700000-0000-0000-0000-000000000011'),
  'US-57 / I15: después del ciclo doble, paused_at es null');
select is((select count(*) from transactions where subscription_id = 'd5700000-0000-0000-0000-000000000011'), 2::bigint,
  'US-57 / I11: el ciclo doble no duplicó ocurrencias (solo las 2 vencidas generadas al pausar)');

-- ---------------------------------------------------------------------------
-- CA-7: par de autorización de resume_subscription (C7)
-- ---------------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claims = '{"sub":"57b00000-0000-0000-0000-000000000002","role":"authenticated"}';
select throws_ok($$select resume_subscription('d5700000-0000-0000-0000-000000000013')$$,
  'P0002', 'Suscripción no encontrada',
  'US-57 CA-7 / C7: con la sesión de B, reanudar una suscripción de A responde P0002');
select throws_ok($$select resume_subscription('d5700000-0000-0000-0000-0000000000ff')$$,
  'P0002', 'Suscripción no encontrada',
  'US-57 CA-7 / C7: un uuid inexistente responde el mismo P0002 y mensaje (no revela si existe)');
select is((select count(*) from subscriptions where id = 'd5700000-0000-0000-0000-000000000013'), 0::bigint,
  'US-57 CA-7 / C7: B no ve la suscripción de A');

reset role;
select is((select to_jsonb(s)::text from subscriptions s where s.id = 'd5700000-0000-0000-0000-000000000013'),
  current_setting('t.snap_13'),
  'US-57 CA-7 / C7: el intento de B no cambió la suscripción de A (sigue pausada)');
select is((select count(*) from transactions where subscription_id = 'd5700000-0000-0000-0000-000000000013'), 0::bigint,
  'US-57 CA-7 / C7: el intento de B tampoco generó transacciones para A');

set local role anon;
set local request.jwt.claims = '{"role":"anon"}';
select throws_ok($$select resume_subscription('d5700000-0000-0000-0000-000000000013')$$,
  '42501', null, 'US-57 CA-7 / C7: anon no puede llamar a resume_subscription (42501)');
reset role;

set local role authenticated;
set local request.jwt.claims = '{"role":"authenticated"}';
select throws_ok($$select resume_subscription('d5700000-0000-0000-0000-000000000013')$$,
  '42501', null, 'US-57 CA-7 / C7: authenticated sin sub (auth.uid() null) responde 42501');
reset role;

select is(has_function_privilege('anon', 'public.resume_subscription(uuid)', 'execute'), false,
  'US-57 CA-7: anon no tiene execute sobre resume_subscription');
select is(has_function_privilege('authenticated', 'public.resume_subscription(uuid)', 'execute'), true,
  'US-57 CA-7: authenticated sí tiene execute sobre resume_subscription');
select is((select to_jsonb(s)::text from subscriptions s where s.id = 'd5700000-0000-0000-0000-000000000013'),
  current_setting('t.snap_13'),
  'US-57 CA-7: tras anon y la sesión sin claims, la suscripción de A sigue pausada y sin cambios');

-- Con la sesión dueña sigue funcionando (evita el falso verde de "todo se rechaza").
set local role authenticated;
set local request.jwt.claims = '{"sub":"57a00000-0000-0000-0000-000000000001","role":"authenticated"}';
select is((select count(*) from subscriptions where id = 'd5700000-0000-0000-0000-000000000013'), 1::bigint,
  'US-57 CA-7 / C7: la sesión dueña ve su suscripción');
select lives_ok($$select resume_subscription('d5700000-0000-0000-0000-000000000013')$$,
  'US-57 CA-7 / C7: la sesión dueña sí puede reanudarla');
select is((select status::text from subscriptions where id = 'd5700000-0000-0000-0000-000000000013'), 'active',
  'US-57 CA-7: después de reanudar, queda activa');
reset role;

-- ---------------------------------------------------------------------------
-- Definición de la función (ADR-030): security definer con search_path fijo
-- ---------------------------------------------------------------------------
select is((select prosecdef from pg_proc where oid = 'public.resume_subscription(uuid)'::regprocedure), true,
  'US-57 / ADR-030: resume_subscription es security definer');
select is((select proconfig from pg_proc where oid = 'public.resume_subscription(uuid)'::regprocedure),
  array['search_path=""'],
  'US-57 / ADR-030: search_path fijo y vacío (sin resolución por esquema)');
select is((select prorettype::regtype::text from pg_proc where oid = 'public.resume_subscription(uuid)'::regprocedure), 'jsonb',
  'US-57: resume_subscription devuelve jsonb');

select * from finish();
rollback;
