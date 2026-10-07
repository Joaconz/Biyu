-- US-55 (#213), R5 de docs/06-suscripciones.md: el período corriente se genera recién cuando
-- hoy >= occurred_on; los pasados, siempre. "Hoy" es el de Argentina (ADR-021). Los CA con fecha fija
-- se verifican llamando a la función interna catch_up_subscriptions con ese p_today ("Cómo leer este
-- documento", entrega-2/historias/suscripciones.md). La puerta pública run_subscription_catchup se
-- prueba con el hoy real, todo relativo a argentina_today() (sin fechas fijas).
-- Las suscripciones se insertan como dueño de la tabla: authenticated no tiene insert directo
-- (ADR-030). Cada escenario usa su propio usuario y su propia suscripción, con
-- start_period = generate_from_period = el primer mes del escenario; todos los conteos filtran por el
-- usuario o la suscripción de prueba (la base local tiene datos semilla de otro usuario). Datos
-- ficticios; todo se revierte (ADR-015).
begin;
select plan(22);

-- ---------------------------------------------------------------------------
-- Fixtures (como dueño de las tablas)
-- ---------------------------------------------------------------------------
--   A 55a…01  CA-1 / CA-2: día 28 desde agosto 2026
--   B 55b…02  CA-3: día 28 desde octubre 2026
--   C 55c…03  CA-4: día 28 desde julio 2026
--   D 55d…04  CA-6: día 31 desde noviembre 2026
--   E 55e…05  CA-5: día 28 desde octubre 2026
--   F 55f…06  run_subscription_catchup: día de cobro = mañana (hoy argentino + 1)
--   G 5500…07 run_subscription_catchup: día de cobro = hoy argentino
reset role;

insert into auth.users (id, instance_id, aud, role, email) values
  ('55a00000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us55a@test.local'),
  ('55b00000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us55b@test.local'),
  ('55c00000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us55c@test.local'),
  ('55d00000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us55d@test.local'),
  ('55e00000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us55e@test.local'),
  ('55f00000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us55f@test.local'),
  ('55000000-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us55g@test.local');

insert into categories (id, user_id, name) values
  ('c5500000-0000-0000-0000-000000000001','55a00000-0000-0000-0000-000000000001','Streaming'),
  ('c5500000-0000-0000-0000-000000000002','55b00000-0000-0000-0000-000000000002','Servicios'),
  ('c5500000-0000-0000-0000-000000000003','55c00000-0000-0000-0000-000000000003','Hogar'),
  ('c5500000-0000-0000-0000-000000000004','55d00000-0000-0000-0000-000000000004','Software'),
  ('c5500000-0000-0000-0000-000000000005','55e00000-0000-0000-0000-000000000005','Música'),
  ('c5500000-0000-0000-0000-000000000006','55f00000-0000-0000-0000-000000000006','Gimnasio'),
  ('c5500000-0000-0000-0000-000000000007','55000000-0000-0000-0000-000000000007','Diarios');
insert into accounts (id, user_id, name, type, currency) values
  ('a5500000-0000-0000-0000-000000000001','55a00000-0000-0000-0000-000000000001','Visa','credit_card','ARS'),
  ('a5500000-0000-0000-0000-000000000002','55b00000-0000-0000-0000-000000000002','Efectivo','cash','ARS'),
  ('a5500000-0000-0000-0000-000000000003','55c00000-0000-0000-0000-000000000003','Débito','debit_card','ARS'),
  ('a5500000-0000-0000-0000-000000000004','55d00000-0000-0000-0000-000000000004','Visa','credit_card','ARS'),
  ('a5500000-0000-0000-0000-000000000005','55e00000-0000-0000-0000-000000000005','Efectivo','cash','ARS'),
  ('a5500000-0000-0000-0000-000000000006','55f00000-0000-0000-0000-000000000006','Efectivo','cash','ARS'),
  ('a5500000-0000-0000-0000-000000000007','55000000-0000-0000-0000-000000000007','Efectivo','cash','ARS');

insert into subscriptions (id, user_id, name, amount, currency, category_id, account_id, billing_day,
                           start_period, generate_from_period, status) values
  ('d5500000-0000-0000-0000-000000000001','55a00000-0000-0000-0000-000000000001','Día 28 desde agosto', 2800.00, 'ARS',
   'c5500000-0000-0000-0000-000000000001','a5500000-0000-0000-0000-000000000001', 28,
   '2026-08-01', '2026-08-01', 'active'),
  ('d5500000-0000-0000-0000-000000000002','55b00000-0000-0000-0000-000000000002','Día 28 desde octubre', 2800.00, 'ARS',
   'c5500000-0000-0000-0000-000000000002','a5500000-0000-0000-0000-000000000002', 28,
   '2026-10-01', '2026-10-01', 'active'),
  ('d5500000-0000-0000-0000-000000000003','55c00000-0000-0000-0000-000000000003','Día 28 desde julio', 2800.00, 'ARS',
   'c5500000-0000-0000-0000-000000000003','a5500000-0000-0000-0000-000000000003', 28,
   '2026-07-01', '2026-07-01', 'active'),
  ('d5500000-0000-0000-0000-000000000004','55d00000-0000-0000-0000-000000000004','Día 31', 3100.00, 'ARS',
   'c5500000-0000-0000-0000-000000000004','a5500000-0000-0000-0000-000000000004', 31,
   '2026-11-01', '2026-11-01', 'active'),
  ('d5500000-0000-0000-0000-000000000005','55e00000-0000-0000-0000-000000000005','Día 28 hoy argentino', 2800.00, 'ARS',
   'c5500000-0000-0000-0000-000000000005','a5500000-0000-0000-0000-000000000005', 28,
   '2026-10-01', '2026-10-01', 'active');

-- Hoy argentino real (ADR-021), su período y si es el último día del mes. now() es fijo en la
-- transacción, así que coincide con lo que use run_subscription_catchup más abajo.
select set_config('t.today', (now() at time zone 'America/Argentina/Buenos_Aires')::date::text, true);
select set_config('t.cur', date_trunc('month', current_setting('t.today')::date)::date::text, true);
select set_config('t.last_day',
  (extract(day from current_setting('t.today')::date + 1) = 1)::text, true);

-- F: se cobra mañana. Si hoy es el último día del mes no hay "mañana" en este período (un día de
-- cobro mayor se recorta a hoy, R4): no se inserta y sus tests se saltean.
insert into subscriptions (id, user_id, name, amount, currency, category_id, account_id, billing_day,
                           start_period, generate_from_period, status)
select 'd5500000-0000-0000-0000-000000000006','55f00000-0000-0000-0000-000000000006','Se cobra mañana', 1500.00, 'ARS',
       'c5500000-0000-0000-0000-000000000006','a5500000-0000-0000-0000-000000000006',
       extract(day from current_setting('t.today')::date)::int + 1,
       current_setting('t.cur')::date, current_setting('t.cur')::date, 'active'
 where not current_setting('t.last_day')::boolean;

-- G: se cobra hoy.
insert into subscriptions (id, user_id, name, amount, currency, category_id, account_id, billing_day,
                           start_period, generate_from_period, status)
select 'd5500000-0000-0000-0000-000000000007','55000000-0000-0000-0000-000000000007','Se cobra hoy', 1700.00, 'ARS',
       'c5500000-0000-0000-0000-000000000007','a5500000-0000-0000-0000-000000000007',
       extract(day from current_setting('t.today')::date)::int,
       current_setting('t.cur')::date, current_setting('t.cur')::date, 'active';

-- ---------------------------------------------------------------------------
-- CA-1 / CA-4: día 28 desde agosto, puesta al día del 2026-10-27 → agosto y septiembre, octubre no
-- ---------------------------------------------------------------------------
select set_config('t.a1', catch_up_subscriptions('55a00000-0000-0000-0000-000000000001', '2026-10-27')::text, true);

select is((current_setting('t.a1')::jsonb ->> 'generated')::int, 2,
  'US-55 CA-1 / CA-4: con hoy 2026-10-27 se generan agosto y septiembre (generated = 2)');
select results_eq(
  $$select subscription_period, occurred_on from transactions
     where subscription_id = 'd5500000-0000-0000-0000-000000000001'
     order by subscription_period$$,
  $$values ('2026-08-01'::date, '2026-08-28'::date),
           ('2026-09-01'::date, '2026-09-28'::date)$$,
  'US-55 CA-1 / R5: el 27 no se genera la de octubre (vence el 28); los pasados sí');

-- ---------------------------------------------------------------------------
-- CA-2: la misma, puesta al día del 2026-10-28 → genera octubre con occurred_on 2026-10-28
-- ---------------------------------------------------------------------------
select set_config('t.a2', catch_up_subscriptions('55a00000-0000-0000-0000-000000000001', '2026-10-28')::text, true);

select is((current_setting('t.a2')::jsonb ->> 'generated')::int, 1,
  'US-55 CA-2: con hoy 2026-10-28 se genera la del mes corriente (generated = 1)');
select results_eq(
  $$select subscription_period, occurred_on from transactions
     where subscription_id = 'd5500000-0000-0000-0000-000000000001'
     order by subscription_period$$,
  $$values ('2026-08-01'::date, '2026-08-28'::date),
           ('2026-09-01'::date, '2026-09-28'::date),
           ('2026-10-01'::date, '2026-10-28'::date)$$,
  'US-55 CA-2 / R5: el día del cobro aparece octubre con occurred_on 2026-10-28');

-- ---------------------------------------------------------------------------
-- CA-3: otra día 28 sin la de octubre, puesta al día del 2026-10-29 → la genera
-- ---------------------------------------------------------------------------
select set_config('t.b', catch_up_subscriptions('55b00000-0000-0000-0000-000000000002', '2026-10-29')::text, true);

select is((current_setting('t.b')::jsonb ->> 'generated')::int, 1,
  'US-55 CA-3: con hoy 2026-10-29 se genera la del mes corriente que faltaba (generated = 1)');
select results_eq(
  $$select subscription_period, occurred_on from transactions
     where subscription_id = 'd5500000-0000-0000-0000-000000000002'
     order by subscription_period$$,
  $$values ('2026-10-01'::date, '2026-10-28'::date)$$,
  'US-55 CA-3 / R4: un día después del cobro, la ocurrencia sigue fechada el 2026-10-28');

-- ---------------------------------------------------------------------------
-- CA-4: día 28 desde julio, puesta al día del 2026-10-01 → julio, agosto y septiembre; octubre no
-- ---------------------------------------------------------------------------
select set_config('t.c', catch_up_subscriptions('55c00000-0000-0000-0000-000000000003', '2026-10-01')::text, true);

select is((current_setting('t.c')::jsonb ->> 'generated')::int, 3,
  'US-55 CA-4: con hoy 2026-10-01 se generan los 3 períodos pasados (generated = 3)');
select results_eq(
  $$select subscription_period, occurred_on from transactions
     where subscription_id = 'd5500000-0000-0000-0000-000000000003'
     order by subscription_period$$,
  $$values ('2026-07-01'::date, '2026-07-28'::date),
           ('2026-08-01'::date, '2026-08-28'::date),
           ('2026-09-01'::date, '2026-09-28'::date)$$,
  'US-55 CA-4 / R5: los pasados se generan aunque hoy (1) sea menor que el día de cobro; octubre no');

-- ---------------------------------------------------------------------------
-- CA-6: día 31 en noviembre (30 días). El 29 nada; el 30, la de noviembre fechada el 30.
-- ---------------------------------------------------------------------------
select set_config('t.d1', catch_up_subscriptions('55d00000-0000-0000-0000-000000000004', '2026-11-29')::text, true);

select is((current_setting('t.d1')::jsonb ->> 'generated')::int, 0,
  'US-55 CA-6: día 31 con hoy 2026-11-29 no genera nada (generated = 0)');
select is((select count(*) from transactions where subscription_id = 'd5500000-0000-0000-0000-000000000004'),
  0::bigint,
  'US-55 CA-6 / R5: el 29 de noviembre no hay ocurrencia del día 31');

select set_config('t.d2', catch_up_subscriptions('55d00000-0000-0000-0000-000000000004', '2026-11-30')::text, true);

select is((current_setting('t.d2')::jsonb ->> 'generated')::int, 1,
  'US-55 CA-6: día 31 con hoy 2026-11-30 genera la de noviembre (generated = 1)');
select results_eq(
  $$select subscription_period, occurred_on from transactions
     where subscription_id = 'd5500000-0000-0000-0000-000000000004'
     order by subscription_period$$,
  $$values ('2026-11-01'::date, '2026-11-30'::date)$$,
  'US-55 CA-6 / R4 / R5: día 31 en un mes de 30 días se genera el 2026-11-30');

-- ---------------------------------------------------------------------------
-- CA-5: "hoy" es el de Argentina (ADR-021)
-- ---------------------------------------------------------------------------
select is(argentina_today(), (now() at time zone 'America/Argentina/Buenos_Aires')::date,
  'US-55 CA-5 / ADR-021: argentina_today() es la fecha de now() en America/Argentina/Buenos_Aires');
select is(('2026-10-28 01:30:00+00'::timestamptz at time zone 'America/Argentina/Buenos_Aires')::date,
  '2026-10-27'::date,
  'US-55 CA-5: a las 22:30 del 27 en Argentina (01:30 del 28 en UTC) el hoy argentino es el 27');
select is(('2026-10-28 03:00:00+00'::timestamptz at time zone 'America/Argentina/Buenos_Aires')::date,
  '2026-10-28'::date,
  'US-55 CA-5: a las 00:00 del 28 en Argentina (03:00 UTC) el hoy argentino es el 28');

-- Puesta al día con el hoy argentino de las 22:30 del 27 (ya 28 en UTC).
select set_config('t.e1', catch_up_subscriptions('55e00000-0000-0000-0000-000000000005',
  ('2026-10-28 01:30:00+00'::timestamptz at time zone 'America/Argentina/Buenos_Aires')::date)::text, true);

select is((current_setting('t.e1')::jsonb ->> 'generated')::int, 0,
  'US-55 CA-5: a las 22:30 del 27 en Argentina (28 en UTC) la del día 28 no se genera (generated = 0)');
select is((select count(*) from transactions where subscription_id = 'd5500000-0000-0000-0000-000000000005'),
  0::bigint,
  'US-55 CA-5 / R5: no queda ocurrencia de octubre con el hoy argentino del 27');

-- Contraste: a las 00:00 del 28 en Argentina sí se genera.
select set_config('t.e2', catch_up_subscriptions('55e00000-0000-0000-0000-000000000005',
  ('2026-10-28 03:00:00+00'::timestamptz at time zone 'America/Argentina/Buenos_Aires')::date)::text, true);

select results_eq(
  $$select subscription_period, occurred_on from transactions
     where subscription_id = 'd5500000-0000-0000-0000-000000000005'
     order by subscription_period$$,
  $$values ('2026-10-01'::date, '2026-10-28'::date)$$,
  'US-55 CA-5 / R5: a las 00:00 del 28 en Argentina se genera la de octubre con occurred_on 2026-10-28');

-- ---------------------------------------------------------------------------
-- run_subscription_catchup(): la puerta pública usa el hoy argentino (ADR-021)
-- ---------------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claims = '{"sub":"55f00000-0000-0000-0000-000000000006","role":"authenticated"}';
select set_config('t.rf', run_subscription_catchup()::text, true);
set local request.jwt.claims = '{"sub":"55000000-0000-0000-0000-000000000007","role":"authenticated"}';
select set_config('t.rg', run_subscription_catchup()::text, true);
reset role;

select case when current_setting('t.last_day')::boolean
  then skip('Hoy es el último día del mes: no hay día de cobro "mañana" en el período corriente', 2)
  else collect_tap(
    is((current_setting('t.rf')::jsonb ->> 'generated')::int, 0,
      'US-55 CA-1 / ADR-021: run_subscription_catchup no genera la que se cobra mañana (hoy argentino + 1)'),
    is((select count(*) from transactions where subscription_id = 'd5500000-0000-0000-0000-000000000006'),
      0::bigint,
      'US-55 CA-1 / R5: sin ocurrencia del período corriente antes del día de cobro')
  ) end;

select is((current_setting('t.rg')::jsonb ->> 'generated')::int, 1,
  'US-55 CA-2 / ADR-021: run_subscription_catchup genera la que se cobra hoy (generated = 1)');
select results_eq(
  $$select subscription_period, occurred_on from transactions
     where subscription_id = 'd5500000-0000-0000-0000-000000000007'$$,
  $$select current_setting('t.cur')::date, argentina_today()$$,
  'US-55 CA-2 / CA-5: la ocurrencia de hoy cae en el período corriente con occurred_on = argentina_today()');

select * from finish();
rollback;
