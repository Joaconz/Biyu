-- US-53 (#211), ADR-017, ADR-030 y ADR-031: la puesta al día de suscripciones.
-- Los CA con fecha fija se verifican llamando a la función interna catch_up_subscriptions con ese
-- p_today ("Cómo leer este documento", entrega-2/historias/suscripciones.md). Cubre CA-1, CA-2 (I16),
-- R2, CA-6, CA-7 (R3), CA-8, CA-9 (I17), CA-12, R6, CA-13, CA-14, el filtro p_subscription_id, I11 en
-- insert_transaction_with_entries y la puerta pública run_subscription_catchup (auth.uid() y el hoy
-- del servidor, ADR-021), con su par de autorización (C7).
-- Las suscripciones se insertan como dueño de la tabla: authenticated no tiene insert directo
-- (ADR-030). Cada escenario usa su propio usuario para que la corrida completa de un usuario no
-- mezcle escenarios; todos los conteos filtran por los usuarios de prueba (la base local tiene datos
-- semilla de otro usuario). Datos ficticios; todo se revierte (ADR-015).
begin;
select plan(72);

-- ---------------------------------------------------------------------------
-- Fixtures (como dueño de las tablas)
-- ---------------------------------------------------------------------------
--   A 53a…01  CA-1, CA-2, R2, CA-6        E 53e…05  CA-12
--   B 53b…02  otra sesión, sin suscr.     F 53f…06  R6
--   C 53c…03  CA-7                        G 5300…07 p_subscription_id
--   D 53d…04  CA-8, CA-9, CA-13, CA-14    H 5300…08 I11
--   R 5300…09 run_subscription_catchup (hoy real)
insert into auth.users (id, instance_id, aud, role, email) values
  ('53a00000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us53a@test.local'),
  ('53b00000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us53b@test.local'),
  ('53c00000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us53c@test.local'),
  ('53d00000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us53d@test.local'),
  ('53e00000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us53e@test.local'),
  ('53f00000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us53f@test.local'),
  ('53000000-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us53g@test.local'),
  ('53000000-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us53h@test.local'),
  ('53000000-0000-0000-0000-000000000009','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us53r@test.local');

insert into categories (id, user_id, name) values
  ('c5300000-0000-0000-0000-000000000001','53a00000-0000-0000-0000-000000000001','Streaming'),
  ('c5300000-0000-0000-0000-000000000003','53c00000-0000-0000-0000-000000000003','Servicios'),
  ('c5300000-0000-0000-0000-000000000004','53d00000-0000-0000-0000-000000000004','Educación'),
  ('c5300000-0000-0000-0000-000000000005','53e00000-0000-0000-0000-000000000005','Hogar'),
  ('c5300000-0000-0000-0000-000000000006','53f00000-0000-0000-0000-000000000006','Software'),
  ('c5300000-0000-0000-0000-000000000007','53000000-0000-0000-0000-000000000007','Varios'),
  ('c5300000-0000-0000-0000-000000000008','53000000-0000-0000-0000-000000000008','Diarios'),
  ('c5300000-0000-0000-0000-000000000009','53000000-0000-0000-0000-000000000009','Gimnasio');
insert into accounts (id, user_id, name, type, currency) values
  ('a5300000-0000-0000-0000-000000000001','53a00000-0000-0000-0000-000000000001','Visa','credit_card','ARS'),
  ('a5300000-0000-0000-0000-000000000003','53c00000-0000-0000-0000-000000000003','Efectivo','cash','ARS'),
  ('a5300000-0000-0000-0000-000000000004','53d00000-0000-0000-0000-000000000004','Débito','debit_card','ARS'),
  ('a5300000-0000-0000-0000-000000000005','53e00000-0000-0000-0000-000000000005','Efectivo','cash','ARS'),
  ('a5300000-0000-0000-0000-000000000006','53f00000-0000-0000-0000-000000000006','Visa','credit_card','ARS'),
  ('a5300000-0000-0000-0000-000000000007','53000000-0000-0000-0000-000000000007','Efectivo','cash','ARS'),
  ('a5300000-0000-0000-0000-000000000008','53000000-0000-0000-0000-000000000008','Efectivo','cash','ARS'),
  ('a5300000-0000-0000-0000-000000000009','53000000-0000-0000-0000-000000000009','Efectivo','cash','ARS');

-- Período corriente según el hoy argentino (ADR-021), para run_subscription_catchup.
select set_config('t.cur', date_trunc('month', (now() at time zone 'America/Argentina/Buenos_Aires')::date)::date::text, true);

-- ---------------------------------------------------------------------------
-- CA-1: $5.000,00 ARS, día 10, desde mayo 2026, puesta al día del 2026-08-15
-- ---------------------------------------------------------------------------
insert into subscriptions (id, user_id, name, amount, currency, category_id, account_id, billing_day,
                           start_period, generate_from_period, status) values
  ('d5300000-0000-0000-0000-000000000001','53a00000-0000-0000-0000-000000000001','Netflix', 5000.00, 'ARS',
   'c5300000-0000-0000-0000-000000000001','a5300000-0000-0000-0000-000000000001', 10,
   '2026-05-01', '2026-05-01', 'active');

select set_config('t.a1', catch_up_subscriptions('53a00000-0000-0000-0000-000000000001', '2026-08-15')::text, true);

select is((current_setting('t.a1')::jsonb ->> 'generated')::int, 4,
  'US-53 CA-1: la puesta al día del 2026-08-15 devuelve generated = 4');
select is(current_setting('t.a1')::jsonb -> 'failed', '[]'::jsonb,
  'US-53 CA-1: sin fallos, failed = []');
select is((select count(*) from transactions where user_id = '53a00000-0000-0000-0000-000000000001'), 4::bigint,
  'US-53 CA-1: existen exactamente 4 transacciones');
select is((select array_agg(subscription_period order by subscription_period) from transactions
            where subscription_id = 'd5300000-0000-0000-0000-000000000001'),
  array['2026-05-01','2026-06-01','2026-07-01','2026-08-01']::date[],
  'US-53 CA-1 / R1: una por período, de mayo a agosto 2026');
select is((select array_agg(occurred_on order by occurred_on) from transactions
            where subscription_id = 'd5300000-0000-0000-0000-000000000001'),
  array['2026-05-10','2026-06-10','2026-07-10','2026-08-10']::date[],
  'US-53 CA-1 / R4: occurred_on es el día 10 de cada mes');
select is((select count(*) from transactions
            where subscription_id = 'd5300000-0000-0000-0000-000000000001'
              and type = 'expense' and installments_count = 1 and amount = 5000.00::numeric
              and currency = 'ARS' and fx_rate is null and amount_ars = 5000.00::numeric), 4::bigint,
  'US-53 CA-1 / I14: cada una es un gasto en 1 cuota de $5.000,00 ARS');
select is((select count(*) from transactions
            where subscription_id = 'd5300000-0000-0000-0000-000000000001'
              and first_period = subscription_period
              and subscription_period = date_trunc('month', occurred_on)::date), 4::bigint,
  'US-53 CA-1: first_period = subscription_period = el período de la ocurrencia');
select is((select count(*) from transactions
            where subscription_id = 'd5300000-0000-0000-0000-000000000001'
              and description = 'Netflix'
              and category_id = 'c5300000-0000-0000-0000-000000000001'
              and account_id = 'a5300000-0000-0000-0000-000000000001'), 4::bigint,
  'US-53 CA-1 / R7: descripción = nombre, con la categoría y la cuenta de la suscripción');
select is((select count(*) from ledger_entries where user_id = '53a00000-0000-0000-0000-000000000001'), 4::bigint,
  'US-53 CA-1 / C3: una sola imputación por transacción');
select is((select count(*) from ledger_entries le join transactions t on t.id = le.transaction_id
            where t.subscription_id = 'd5300000-0000-0000-0000-000000000001'
              and le.installment_number = 1 and le.period = t.subscription_period
              and le.amount = 5000.00::numeric and le.amount_ars = 5000.00::numeric), 4::bigint,
  'US-53 CA-1 / C3 / I1: la imputación es la cuota 1, por el monto, en el período de la ocurrencia');

-- ---------------------------------------------------------------------------
-- CA-2 / I16: correrla de nuevo el mismo día no crea nada
-- ---------------------------------------------------------------------------
select set_config('t.a2', catch_up_subscriptions('53a00000-0000-0000-0000-000000000001', '2026-08-15')::text, true);

select is((current_setting('t.a2')::jsonb ->> 'generated')::int, 0,
  'US-53 CA-2 / I16: la segunda puesta al día del mismo día devuelve generated = 0');
select is(current_setting('t.a2')::jsonb -> 'failed', '[]'::jsonb,
  'US-53 CA-2 / I16: la segunda puesta al día no reporta fallos');
select is((select count(*) from transactions where user_id = '53a00000-0000-0000-0000-000000000001'), 4::bigint,
  'US-53 CA-2 / I16: siguen exactamente 4 transacciones');
select is((select count(*) from ledger_entries where user_id = '53a00000-0000-0000-0000-000000000001'), 4::bigint,
  'US-53 CA-2 / I16: siguen exactamente 4 imputaciones');

-- ---------------------------------------------------------------------------
-- R2: una ocurrencia con baja lógica no se regenera
-- ---------------------------------------------------------------------------
update transactions set deleted_at = now()
 where subscription_id = 'd5300000-0000-0000-0000-000000000001' and subscription_period = '2026-06-01';

select set_config('t.a3', catch_up_subscriptions('53a00000-0000-0000-0000-000000000001', '2026-08-15')::text, true);

select is((current_setting('t.a3')::jsonb ->> 'generated')::int, 0,
  'US-53 R2: con junio dado de baja, la puesta al día devuelve generated = 0');
select is((select count(*) from transactions
            where subscription_id = 'd5300000-0000-0000-0000-000000000001' and subscription_period = '2026-06-01'), 1::bigint,
  'US-53 R2 / I11: junio sigue teniendo solo la transacción dada de baja');
select is((select count(*) from transactions
            where subscription_id = 'd5300000-0000-0000-0000-000000000001' and deleted_at is null), 3::bigint,
  'US-53 R2: quedan 3 ocurrencias vigentes; la borrada no vuelve');

-- ---------------------------------------------------------------------------
-- CA-6: categoría y cuenta archivadas después del alta, sigue generando
-- ---------------------------------------------------------------------------
update categories set archived_at = now() where id = 'c5300000-0000-0000-0000-000000000001';
update accounts   set archived_at = now() where id = 'a5300000-0000-0000-0000-000000000001';

select set_config('t.a4', catch_up_subscriptions('53a00000-0000-0000-0000-000000000001', '2026-09-15')::text, true);

select is((current_setting('t.a4')::jsonb ->> 'generated')::int, 1,
  'US-53 CA-6: con categoría y cuenta archivadas, la puesta al día del 2026-09-15 genera septiembre');
select is((select count(*) from transactions
            where subscription_id = 'd5300000-0000-0000-0000-000000000001' and subscription_period = '2026-09-01'
              and occurred_on = '2026-09-10'
              and category_id = 'c5300000-0000-0000-0000-000000000001'
              and account_id = 'a5300000-0000-0000-0000-000000000001'), 1::bigint,
  'US-53 CA-6: la ocurrencia de septiembre usa la categoría y la cuenta archivadas');
select is((select count(*) from transactions
            where subscription_id = 'd5300000-0000-0000-0000-000000000001' and subscription_period = '2026-06-01'), 1::bigint,
  'US-53 R2: junio (dado de baja) sigue sin regenerarse en una corrida posterior');

-- ---------------------------------------------------------------------------
-- CA-7 / R3: pausada y cancelada no generan nada
-- ---------------------------------------------------------------------------
insert into subscriptions (id, user_id, name, amount, currency, category_id, account_id, billing_day,
                           start_period, generate_from_period, status, paused_at, cancelled_at) values
  ('d5300000-0000-0000-0000-000000000031','53c00000-0000-0000-0000-000000000003','Pausada', 2000.00, 'ARS',
   'c5300000-0000-0000-0000-000000000003','a5300000-0000-0000-0000-000000000003', 5,
   '2026-03-01', '2026-03-01', 'paused', now(), null),
  ('d5300000-0000-0000-0000-000000000032','53c00000-0000-0000-0000-000000000003','Cancelada', 2000.00, 'ARS',
   'c5300000-0000-0000-0000-000000000003','a5300000-0000-0000-0000-000000000003', 5,
   '2026-03-01', '2026-03-01', 'cancelled', null, now());

select set_config('t.c1', catch_up_subscriptions('53c00000-0000-0000-0000-000000000003', '2026-08-15')::text, true);

select is((current_setting('t.c1')::jsonb ->> 'generated')::int, 0,
  'US-53 CA-7 / R3: un usuario con una pausada y una cancelada obtiene generated = 0');
select is(current_setting('t.c1')::jsonb -> 'failed', '[]'::jsonb,
  'US-53 CA-7 / R3: ni la pausada ni la cancelada se reportan como fallidas');
select is((catch_up_subscriptions('53c00000-0000-0000-0000-000000000003', '2026-08-15',
            'd5300000-0000-0000-0000-000000000031') ->> 'generated')::int, 0,
  'US-53 CA-7 / R3: pedir explícitamente la pausada tampoco genera');
select is((catch_up_subscriptions('53c00000-0000-0000-0000-000000000003', '2026-08-15',
            'd5300000-0000-0000-0000-000000000032') ->> 'generated')::int, 0,
  'US-53 CA-7 / R3: pedir explícitamente la cancelada tampoco genera');
select is((select count(*) from transactions where user_id = '53c00000-0000-0000-0000-000000000003'), 0::bigint,
  'US-53 CA-7 / R3: no existe ninguna transacción de la pausada ni de la cancelada');

-- ---------------------------------------------------------------------------
-- CA-8: end_period mayo 2026, desde marzo 2026, puesta al día del 2026-09-01
-- ---------------------------------------------------------------------------
insert into subscriptions (id, user_id, name, amount, currency, category_id, account_id, billing_day,
                           start_period, end_period, generate_from_period, status) values
  ('d5300000-0000-0000-0000-000000000041','53d00000-0000-0000-0000-000000000004','Curso', 4000.00, 'ARS',
   'c5300000-0000-0000-0000-000000000004','a5300000-0000-0000-0000-000000000004', 15,
   '2026-03-01', '2026-05-01', '2026-03-01', 'active');

select set_config('t.d1', catch_up_subscriptions('53d00000-0000-0000-0000-000000000004', '2026-09-01',
  'd5300000-0000-0000-0000-000000000041')::text, true);

select is((current_setting('t.d1')::jsonb ->> 'generated')::int, 3,
  'US-53 CA-8: con fin en mayo 2026, la puesta al día del 2026-09-01 devuelve generated = 3');
select is((select count(*) from transactions where subscription_id = 'd5300000-0000-0000-0000-000000000041'), 3::bigint,
  'US-53 CA-8: existen exactamente 3 transacciones');
select is((select array_agg(subscription_period order by subscription_period) from transactions
            where subscription_id = 'd5300000-0000-0000-0000-000000000041'),
  array['2026-03-01','2026-04-01','2026-05-01']::date[],
  'US-53 CA-8 / R1: marzo, abril y mayo 2026, nada después de end_period');

-- ---------------------------------------------------------------------------
-- CA-13: start_period = período de p_today con el cobro pasado; start_period en el futuro
-- ---------------------------------------------------------------------------
insert into subscriptions (id, user_id, name, amount, currency, category_id, account_id, billing_day,
                           start_period, generate_from_period, status) values
  ('d5300000-0000-0000-0000-000000000042','53d00000-0000-0000-0000-000000000004','Arranca hoy', 1200.00, 'ARS',
   'c5300000-0000-0000-0000-000000000004','a5300000-0000-0000-0000-000000000004', 5,
   '2026-08-01', '2026-08-01', 'active'),
  ('d5300000-0000-0000-0000-000000000043','53d00000-0000-0000-0000-000000000004','Arranca después', 1200.00, 'ARS',
   'c5300000-0000-0000-0000-000000000004','a5300000-0000-0000-0000-000000000004', 5,
   '2026-11-01', '2026-11-01', 'active');

select set_config('t.d2', catch_up_subscriptions('53d00000-0000-0000-0000-000000000004', '2026-08-15',
  'd5300000-0000-0000-0000-000000000042')::text, true);
select set_config('t.d3', catch_up_subscriptions('53d00000-0000-0000-0000-000000000004', '2026-08-15',
  'd5300000-0000-0000-0000-000000000043')::text, true);

select is((current_setting('t.d2')::jsonb ->> 'generated')::int, 1,
  'US-53 CA-13: start_period = período corriente con el día 5 ya pasado devuelve generated = 1');
select is((select array_agg(subscription_period) from transactions
            where subscription_id = 'd5300000-0000-0000-0000-000000000042'),
  array['2026-08-01']::date[],
  'US-53 CA-13 / R5: existe exactamente la ocurrencia del período corriente');
select is((current_setting('t.d3')::jsonb ->> 'generated')::int, 0,
  'US-53 CA-13: start_period en el futuro devuelve generated = 0');
select is((select count(*) from transactions where subscription_id = 'd5300000-0000-0000-0000-000000000043'), 0::bigint,
  'US-53 CA-13 / R1: con start_period en el futuro no se genera nada');

-- ---------------------------------------------------------------------------
-- CA-14: end_period = start_period, ambos en el pasado
-- ---------------------------------------------------------------------------
insert into subscriptions (id, user_id, name, amount, currency, category_id, account_id, billing_day,
                           start_period, end_period, generate_from_period, status) values
  ('d5300000-0000-0000-0000-000000000044','53d00000-0000-0000-0000-000000000004','Un solo mes', 800.00, 'ARS',
   'c5300000-0000-0000-0000-000000000004','a5300000-0000-0000-0000-000000000004', 20,
   '2026-04-01', '2026-04-01', '2026-04-01', 'active');

select set_config('t.d4', catch_up_subscriptions('53d00000-0000-0000-0000-000000000004', '2026-08-15',
  'd5300000-0000-0000-0000-000000000044')::text, true);

select is((current_setting('t.d4')::jsonb ->> 'generated')::int, 1,
  'US-53 CA-14: end_period = start_period en el pasado devuelve generated = 1');
select is((select array_agg(subscription_period) from transactions
            where subscription_id = 'd5300000-0000-0000-0000-000000000044'),
  array['2026-04-01']::date[],
  'US-53 CA-14: existe exactamente una ocurrencia, la de ese mes');

-- ---------------------------------------------------------------------------
-- CA-9 / I17: nada fuera de [generate_from_period, min(período de p_today, end_period)]
-- ---------------------------------------------------------------------------
-- Como si se hubiera reanudado: generate_from_period (mayo) > start_period (febrero).
insert into subscriptions (id, user_id, name, amount, currency, category_id, account_id, billing_day,
                           start_period, end_period, generate_from_period, status) values
  ('d5300000-0000-0000-0000-000000000045','53d00000-0000-0000-0000-000000000004','Reanudada', 1500.00, 'ARS',
   'c5300000-0000-0000-0000-000000000004','a5300000-0000-0000-0000-000000000004', 1,
   '2026-02-01', '2026-12-01', '2026-05-01', 'active');

select set_config('t.d5', catch_up_subscriptions('53d00000-0000-0000-0000-000000000004', '2026-08-15',
  'd5300000-0000-0000-0000-000000000045')::text, true);

select is((current_setting('t.d5')::jsonb ->> 'generated')::int, 4,
  'US-53 CA-9: reanudada con piso en mayo, la puesta al día del 2026-08-15 devuelve generated = 4');
select is((select array_agg(subscription_period order by subscription_period) from transactions
            where subscription_id = 'd5300000-0000-0000-0000-000000000045'),
  array['2026-05-01','2026-06-01','2026-07-01','2026-08-01']::date[],
  'US-53 CA-9 / R1: de generate_from_period al período de p_today');
select is((select count(*) from transactions
            where subscription_id = 'd5300000-0000-0000-0000-000000000045' and subscription_period < '2026-05-01'), 0::bigint,
  'US-53 CA-9 / I17: ninguna ocurrencia anterior a generate_from_period (febrero a abril no se cargan)');
select is((select count(*) from transactions
            where subscription_id = 'd5300000-0000-0000-0000-000000000045' and subscription_period > '2026-08-01'), 0::bigint,
  'US-53 CA-9 / I17: ninguna ocurrencia posterior al período de p_today aunque end_period sea diciembre');
-- Sobre todo lo generado con fecha fija en este archivo (el mayor p_today usado es 2026-09-15).
select is((select count(*) from transactions t join subscriptions s on s.id = t.subscription_id
            where t.user_id in ('53a00000-0000-0000-0000-000000000001','53c00000-0000-0000-0000-000000000003',
                                '53d00000-0000-0000-0000-000000000004')
              and (t.subscription_period < s.generate_from_period
                   or t.subscription_period > coalesce(s.end_period, 'infinity'::date)
                   or t.subscription_period > '2026-09-01')), 0::bigint,
  'US-53 CA-9 / I17: ninguna transacción generada cae antes de generate_from_period, después de end_period ni después del período de p_today');

-- ---------------------------------------------------------------------------
-- CA-12: USD 999.999.999.999,99 que desborda en pesos; la otra suscripción genera igual
-- ---------------------------------------------------------------------------
insert into fx_rates (user_id, period, ars_per_usd) values
  ('53e00000-0000-0000-0000-000000000005', '2026-08-01', 1250.0000);
insert into subscriptions (id, user_id, name, amount, currency, category_id, account_id, billing_day,
                           start_period, generate_from_period, status) values
  ('d5300000-0000-0000-0000-000000000051','53e00000-0000-0000-0000-000000000005','Carísima', 999999999999.99, 'USD',
   'c5300000-0000-0000-0000-000000000005','a5300000-0000-0000-0000-000000000005', 5,
   '2026-08-01', '2026-08-01', 'active'),
  ('d5300000-0000-0000-0000-000000000052','53e00000-0000-0000-0000-000000000005','Agua', 3000.00, 'ARS',
   'c5300000-0000-0000-0000-000000000005','a5300000-0000-0000-0000-000000000005', 5,
   '2026-08-01', '2026-08-01', 'active');

select set_config('t.e1', catch_up_subscriptions('53e00000-0000-0000-0000-000000000005', '2026-08-15')::text, true);

select is((current_setting('t.e1')::jsonb ->> 'generated')::int, 1,
  'US-53 CA-12: generated cuenta solo la ocurrencia creada (la ARS)');
select is(current_setting('t.e1')::jsonb -> 'failed',
  jsonb_build_array(jsonb_build_object('subscription_id', 'd5300000-0000-0000-0000-000000000051',
                                       'period', '2026-08', 'reason', 'amount_ars_out_of_range')),
  'US-53 CA-12: la USD que desborda en pesos aparece en failed con reason amount_ars_out_of_range');
select is((select count(*) from transactions where subscription_id = 'd5300000-0000-0000-0000-000000000051'), 0::bigint,
  'US-53 CA-12: la ocurrencia que desborda no se genera');
select is((select count(*) from transactions
            where subscription_id = 'd5300000-0000-0000-0000-000000000052' and subscription_period = '2026-08-01'), 1::bigint,
  'US-53 CA-12: la otra suscripción del mismo usuario genera en la misma corrida');

-- ---------------------------------------------------------------------------
-- R6: USD 10.00 desde junio 2026, con tipo de cambio de junio y no de julio, hoy 2026-07-20
-- ---------------------------------------------------------------------------
insert into fx_rates (user_id, period, ars_per_usd) values
  ('53f00000-0000-0000-0000-000000000006', '2026-06-01', 1180.5000);
insert into subscriptions (id, user_id, name, amount, currency, category_id, account_id, billing_day,
                           start_period, generate_from_period, status) values
  ('d5300000-0000-0000-0000-000000000061','53f00000-0000-0000-0000-000000000006','Hosting', 10.00, 'USD',
   'c5300000-0000-0000-0000-000000000006','a5300000-0000-0000-0000-000000000006', 5,
   '2026-06-01', '2026-06-01', 'active');

select set_config('t.f1', catch_up_subscriptions('53f00000-0000-0000-0000-000000000006', '2026-07-20')::text, true);

select is((current_setting('t.f1')::jsonb ->> 'generated')::int, 1,
  'US-53 R6: solo se genera junio, el período con tipo de cambio');
select is(current_setting('t.f1')::jsonb -> 'failed',
  jsonb_build_array(jsonb_build_object('subscription_id', 'd5300000-0000-0000-0000-000000000061',
                                       'period', '2026-07', 'reason', 'missing_fx_rate')),
  'US-53 R6: failed informa julio con reason missing_fx_rate');
select is((select count(*) from transactions
            where subscription_id = 'd5300000-0000-0000-0000-000000000061' and subscription_period = '2026-06-01'
              and currency = 'USD' and amount = 10.00::numeric
              and fx_rate = 1180.5000::numeric and amount_ars = 11805.00::numeric), 1::bigint,
  'US-53 R6 / C5: junio se genera con el fx_rate del período (1180,5) y amount_ars = 11805,00');
select is((select count(*) from ledger_entries le join transactions t on t.id = le.transaction_id
            where t.subscription_id = 'd5300000-0000-0000-0000-000000000061'
              and le.amount = 10.00::numeric and le.amount_ars = 11805.00::numeric), 1::bigint,
  'US-53 R6 / C3: la imputación de junio es USD 10,00 = $11.805,00');
select is((select count(*) from transactions
            where subscription_id = 'd5300000-0000-0000-0000-000000000061' and subscription_period = '2026-07-01'), 0::bigint,
  'US-53 R6: julio, sin tipo de cambio, no se genera');

-- Cambiar después el tipo de cambio de junio no toca la ocurrencia (C5); cargar el de julio la destraba.
update fx_rates set ars_per_usd = 1300.0000
 where user_id = '53f00000-0000-0000-0000-000000000006' and period = '2026-06-01';
insert into fx_rates (user_id, period, ars_per_usd) values
  ('53f00000-0000-0000-0000-000000000006', '2026-07-01', 1200.0000);

select set_config('t.f2', catch_up_subscriptions('53f00000-0000-0000-0000-000000000006', '2026-07-20')::text, true);

select is((select fx_rate from transactions
            where subscription_id = 'd5300000-0000-0000-0000-000000000061' and subscription_period = '2026-06-01'),
  1180.5000::numeric,
  'US-53 R6 / C5: el fx_rate de junio queda congelado aunque cambie fx_rates');
select is((current_setting('t.f2')::jsonb ->> 'generated')::int, 1,
  'US-53 R6 / ADR-031: con el tipo de cambio de julio cargado, la siguiente puesta al día genera julio');
select is(current_setting('t.f2')::jsonb -> 'failed', '[]'::jsonb,
  'US-53 R6: con el tipo de cambio cargado, julio deja de figurar en failed');

-- ---------------------------------------------------------------------------
-- p_subscription_id: con dos pendientes, se pone al día solo la pedida
-- ---------------------------------------------------------------------------
insert into subscriptions (id, user_id, name, amount, currency, category_id, account_id, billing_day,
                           start_period, generate_from_period, status) values
  ('d5300000-0000-0000-0000-000000000071','53000000-0000-0000-0000-000000000007','Música', 900.00, 'ARS',
   'c5300000-0000-0000-0000-000000000007','a5300000-0000-0000-0000-000000000007', 1,
   '2026-07-01', '2026-07-01', 'active'),
  ('d5300000-0000-0000-0000-000000000072','53000000-0000-0000-0000-000000000007','Nube', 700.00, 'ARS',
   'c5300000-0000-0000-0000-000000000007','a5300000-0000-0000-0000-000000000007', 1,
   '2026-07-01', '2026-07-01', 'active');

select set_config('t.g1', catch_up_subscriptions('53000000-0000-0000-0000-000000000007', '2026-08-15',
  'd5300000-0000-0000-0000-000000000071')::text, true);

select is((current_setting('t.g1')::jsonb ->> 'generated')::int, 2,
  'ADR-030: con p_subscription_id se generan solo los 2 meses de esa suscripción');
select is((select count(*) from transactions where subscription_id = 'd5300000-0000-0000-0000-000000000071'), 2::bigint,
  'ADR-030: la suscripción pedida queda al día');
select is((select count(*) from transactions where subscription_id = 'd5300000-0000-0000-0000-000000000072'), 0::bigint,
  'ADR-030: la otra suscripción pendiente no se toca');

select set_config('t.g2', catch_up_subscriptions('53000000-0000-0000-0000-000000000007', '2026-08-15')::text, true);
select is((current_setting('t.g2')::jsonb ->> 'generated')::int, 2,
  'ADR-030: sin p_subscription_id se pone al día la que faltaba (2) y no se repite la otra');

-- ---------------------------------------------------------------------------
-- I11: insert_transaction_with_entries dos veces con el mismo (subscription_id, subscription_period)
-- ---------------------------------------------------------------------------
insert into subscriptions (id, user_id, name, amount, currency, category_id, account_id, billing_day,
                           start_period, generate_from_period, status) values
  ('d5300000-0000-0000-0000-000000000081','53000000-0000-0000-0000-000000000008','Diario', 1500.00, 'ARS',
   'c5300000-0000-0000-0000-000000000008','a5300000-0000-0000-0000-000000000008', 3,
   '2026-07-01', '2026-07-01', 'active');

select set_config('t.h1', coalesce(insert_transaction_with_entries(
  '53000000-0000-0000-0000-000000000008', 'expense', 1500.00, 'ARS', null,
  'c5300000-0000-0000-0000-000000000008', 'a5300000-0000-0000-0000-000000000008', 1, '2026-07-03', 'Diario',
  'd5300000-0000-0000-0000-000000000081', '2026-07-01')::text, ''), true);
select set_config('t.h2', coalesce(insert_transaction_with_entries(
  '53000000-0000-0000-0000-000000000008', 'expense', 1500.00, 'ARS', null,
  'c5300000-0000-0000-0000-000000000008', 'a5300000-0000-0000-0000-000000000008', 1, '2026-07-03', 'Diario',
  'd5300000-0000-0000-0000-000000000081', '2026-07-01')::text, ''), true);

select isnt(current_setting('t.h1'), '',
  'I11: la primera inserción con (subscription_id, subscription_period) devuelve el id de la transacción');
select is(current_setting('t.h2'), '',
  'I11: la segunda inserción con el mismo (subscription_id, subscription_period) devuelve null');
select is((select count(*) from transactions where user_id = '53000000-0000-0000-0000-000000000008'), 1::bigint,
  'I11: la segunda inserción no agrega filas en transactions');
select is((select count(*) from ledger_entries where user_id = '53000000-0000-0000-0000-000000000008'), 1::bigint,
  'I11: la segunda inserción no agrega filas en ledger_entries');
select is((catch_up_subscriptions('53000000-0000-0000-0000-000000000008', '2026-07-10') ->> 'generated')::int, 0,
  'I11 / R2: la puesta al día no vuelve a generar el período ya insertado');

-- ---------------------------------------------------------------------------
-- run_subscription_catchup(): la puerta pública, con auth.uid() y el hoy del servidor
-- ---------------------------------------------------------------------------
-- Desde dos meses antes del período corriente, día 1: con el hoy real vencen 3 períodos.
insert into subscriptions (id, user_id, name, amount, currency, category_id, account_id, billing_day,
                           start_period, generate_from_period, status) values
  ('d5300000-0000-0000-0000-000000000091','53000000-0000-0000-0000-000000000009','Gimnasio', 2000.00, 'ARS',
   'c5300000-0000-0000-0000-000000000009','a5300000-0000-0000-0000-000000000009', 1,
   (current_setting('t.cur')::date - interval '2 months')::date,
   (current_setting('t.cur')::date - interval '2 months')::date, 'active');

-- Sesión de otro usuario (B, sin suscripciones): no pone al día a R.
set local role authenticated;
set local request.jwt.claims = '{"sub":"53b00000-0000-0000-0000-000000000002","role":"authenticated"}';
select set_config('t.rb', run_subscription_catchup()::text, true);
reset role;

select is((current_setting('t.rb')::jsonb ->> 'generated')::int, 0,
  'US-53 C7: con la sesión de B (sin suscripciones) run_subscription_catchup devuelve generated = 0');
select is((select count(*) from transactions where user_id = '53000000-0000-0000-0000-000000000009'), 0::bigint,
  'US-53 C7: la sesión de B no genera nada para R');

-- Sesión de R: genera lo vencido al hoy del servidor.
set local role authenticated;
set local request.jwt.claims = '{"sub":"53000000-0000-0000-0000-000000000009","role":"authenticated"}';
select set_config('t.rr', run_subscription_catchup()::text, true);
select set_config('t.rr2', run_subscription_catchup()::text, true);
reset role;

select ok(current_setting('t.rr')::jsonb ?& array['generated', 'failed'],
  'US-53 / ADR-031: run_subscription_catchup devuelve un jsonb con generated y failed');
select is((current_setting('t.rr')::jsonb ->> 'generated')::int, 3,
  'US-53: con la sesión de R, run_subscription_catchup genera los 3 períodos vencidos al hoy del servidor');
select is(current_setting('t.rr')::jsonb -> 'failed', '[]'::jsonb,
  'US-53: run_subscription_catchup sin fallos devuelve failed = []');
select is((select array_agg(subscription_period order by subscription_period) from transactions
            where user_id = '53000000-0000-0000-0000-000000000009'),
  array[(current_setting('t.cur')::date - interval '2 months')::date,
        (current_setting('t.cur')::date - interval '1 month')::date,
        current_setting('t.cur')::date],
  'US-53 / ADR-021: las ocurrencias van de dos meses atrás al período corriente argentino');
select is((current_setting('t.rr2')::jsonb ->> 'generated')::int, 0,
  'US-53 CA-2 / I16: una segunda llamada a run_subscription_catchup devuelve generated = 0');

-- Authenticated no ejecuta las funciones internas (ADR-030).
set local role authenticated;
set local request.jwt.claims = '{"sub":"53000000-0000-0000-0000-000000000009","role":"authenticated"}';
select throws_ok($$select catch_up_subscriptions('53000000-0000-0000-0000-000000000009'::uuid, '2026-08-15'::date)$$,
  '42501', null, 'ADR-030: authenticated no puede ejecutar catch_up_subscriptions (42501)');
select throws_ok($$select insert_transaction_with_entries('53000000-0000-0000-0000-000000000009'::uuid, 'expense', 1000::numeric, 'ARS',
    null::numeric, 'c5300000-0000-0000-0000-000000000009'::uuid, 'a5300000-0000-0000-0000-000000000009'::uuid,
    1, '2026-08-15'::date, null::text)$$,
  '42501', null, 'ADR-030: authenticated no puede ejecutar insert_transaction_with_entries (42501)');

-- anon no tiene execute sobre la puerta pública.
reset role;
set local role anon;
set local request.jwt.claims = '{"role":"anon"}';
select throws_ok($$select run_subscription_catchup()$$,
  '42501', null, 'US-53 C7: anon no puede llamar a run_subscription_catchup (42501)');
select throws_ok($$select catch_up_subscriptions('53000000-0000-0000-0000-000000000009'::uuid, '2026-08-15'::date)$$,
  '42501', null, 'ADR-030: anon no puede ejecutar catch_up_subscriptions (42501)');
reset role;

select is((select count(*) from transactions where user_id = '53000000-0000-0000-0000-000000000009'), 3::bigint,
  'US-53: los intentos rechazados no agregan transacciones a R');

select * from finish();
rollback;
