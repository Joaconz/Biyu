-- US-54 (#212), R4 de docs/06-suscripciones.md: el día de cobro que no existe en un mes se cobra el
-- último día de ese mes, sin pasar al mes siguiente. Los CA con fecha fija se verifican llamando a la
-- función interna catch_up_subscriptions con ese p_today ("Cómo leer este documento",
-- entrega-2/historias/suscripciones.md). Cubre CA-1 (con el borde de R5), CA-2, CA-3, CA-4, CA-6 y el
-- extremo día 1. CA-5 (vista previa y "Próximo cobro") es de la UI y no se prueba acá.
-- Las suscripciones se insertan como dueño de la tabla: authenticated no tiene insert directo
-- (ADR-030). Cada escenario usa su propio usuario y su propia suscripción, con
-- start_period = generate_from_period = el primer mes del escenario; todos los conteos filtran por los
-- usuarios de prueba (la base local tiene datos semilla de otro usuario). Datos ficticios; todo se
-- revierte (ADR-015).
begin;
select plan(14);

-- ---------------------------------------------------------------------------
-- Fixtures (como dueño de las tablas)
-- ---------------------------------------------------------------------------
--   A 54a…01  CA-1: día 31 desde enero 2027
--   B 54b…02  CA-2: día 29, febrero 2028     C 54c…03  CA-2: día 29, febrero 2027
--   D 54d…04  CA-3: día 30, febrero 2028     E 54e…05  CA-3: día 30, febrero 2027
--   F 54f…06  CA-6: día 31, febrero 2028     G 5400…07 extremo: día 1, febrero 2027
reset role;

insert into auth.users (id, instance_id, aud, role, email) values
  ('54a00000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us54a@test.local'),
  ('54b00000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us54b@test.local'),
  ('54c00000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us54c@test.local'),
  ('54d00000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us54d@test.local'),
  ('54e00000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us54e@test.local'),
  ('54f00000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us54f@test.local'),
  ('54000000-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us54g@test.local');

insert into categories (id, user_id, name) values
  ('c5400000-0000-0000-0000-000000000001','54a00000-0000-0000-0000-000000000001','Streaming'),
  ('c5400000-0000-0000-0000-000000000002','54b00000-0000-0000-0000-000000000002','Servicios'),
  ('c5400000-0000-0000-0000-000000000003','54c00000-0000-0000-0000-000000000003','Servicios'),
  ('c5400000-0000-0000-0000-000000000004','54d00000-0000-0000-0000-000000000004','Hogar'),
  ('c5400000-0000-0000-0000-000000000005','54e00000-0000-0000-0000-000000000005','Hogar'),
  ('c5400000-0000-0000-0000-000000000006','54f00000-0000-0000-0000-000000000006','Software'),
  ('c5400000-0000-0000-0000-000000000007','54000000-0000-0000-0000-000000000007','Gimnasio');
insert into accounts (id, user_id, name, type, currency) values
  ('a5400000-0000-0000-0000-000000000001','54a00000-0000-0000-0000-000000000001','Visa','credit_card','ARS'),
  ('a5400000-0000-0000-0000-000000000002','54b00000-0000-0000-0000-000000000002','Efectivo','cash','ARS'),
  ('a5400000-0000-0000-0000-000000000003','54c00000-0000-0000-0000-000000000003','Efectivo','cash','ARS'),
  ('a5400000-0000-0000-0000-000000000004','54d00000-0000-0000-0000-000000000004','Débito','debit_card','ARS'),
  ('a5400000-0000-0000-0000-000000000005','54e00000-0000-0000-0000-000000000005','Débito','debit_card','ARS'),
  ('a5400000-0000-0000-0000-000000000006','54f00000-0000-0000-0000-000000000006','Visa','credit_card','ARS'),
  ('a5400000-0000-0000-0000-000000000007','54000000-0000-0000-0000-000000000007','Efectivo','cash','ARS');

insert into subscriptions (id, user_id, name, amount, currency, category_id, account_id, billing_day,
                           start_period, generate_from_period, status) values
  ('d5400000-0000-0000-0000-000000000001','54a00000-0000-0000-0000-000000000001','Día 31', 3100.00, 'ARS',
   'c5400000-0000-0000-0000-000000000001','a5400000-0000-0000-0000-000000000001', 31,
   '2027-01-01', '2027-01-01', 'active'),
  ('d5400000-0000-0000-0000-000000000002','54b00000-0000-0000-0000-000000000002','Día 29 bisiesto', 2900.00, 'ARS',
   'c5400000-0000-0000-0000-000000000002','a5400000-0000-0000-0000-000000000002', 29,
   '2028-02-01', '2028-02-01', 'active'),
  ('d5400000-0000-0000-0000-000000000003','54c00000-0000-0000-0000-000000000003','Día 29 común', 2900.00, 'ARS',
   'c5400000-0000-0000-0000-000000000003','a5400000-0000-0000-0000-000000000003', 29,
   '2027-02-01', '2027-02-01', 'active'),
  ('d5400000-0000-0000-0000-000000000004','54d00000-0000-0000-0000-000000000004','Día 30 bisiesto', 3000.00, 'ARS',
   'c5400000-0000-0000-0000-000000000004','a5400000-0000-0000-0000-000000000004', 30,
   '2028-02-01', '2028-02-01', 'active'),
  ('d5400000-0000-0000-0000-000000000005','54e00000-0000-0000-0000-000000000005','Día 30 común', 3000.00, 'ARS',
   'c5400000-0000-0000-0000-000000000005','a5400000-0000-0000-0000-000000000005', 30,
   '2027-02-01', '2027-02-01', 'active'),
  ('d5400000-0000-0000-0000-000000000006','54f00000-0000-0000-0000-000000000006','Día 31 bisiesto', 3100.00, 'ARS',
   'c5400000-0000-0000-0000-000000000006','a5400000-0000-0000-0000-000000000006', 31,
   '2028-02-01', '2028-02-01', 'active'),
  ('d5400000-0000-0000-0000-000000000007','54000000-0000-0000-0000-000000000007','Día 1', 100.00, 'ARS',
   'c5400000-0000-0000-0000-000000000007','a5400000-0000-0000-0000-000000000007', 1,
   '2027-02-01', '2027-02-01', 'active');

-- ---------------------------------------------------------------------------
-- CA-1: día 31 desde enero 2027. Con hoy 2027-04-29 abril todavía no vence (R5); con 2027-04-30, sí.
-- ---------------------------------------------------------------------------
select set_config('t.a1', catch_up_subscriptions('54a00000-0000-0000-0000-000000000001', '2027-04-29')::text, true);

select is((current_setting('t.a1')::jsonb ->> 'generated')::int, 3,
  'US-54 CA-1 / R5: con hoy 2027-04-29 se generan enero, febrero y marzo (generated = 3)');
select results_eq(
  $$select subscription_period, occurred_on from transactions
     where subscription_id = 'd5400000-0000-0000-0000-000000000001'
     order by subscription_period$$,
  $$values ('2027-01-01'::date, '2027-01-31'::date),
           ('2027-02-01'::date, '2027-02-28'::date),
           ('2027-03-01'::date, '2027-03-31'::date)$$,
  'US-54 CA-1 / R4 / R5: día 31 da 31/01, 28/02 y 31/03; abril (30/04) todavía no sale el 29/04');

select set_config('t.a2', catch_up_subscriptions('54a00000-0000-0000-0000-000000000001', '2027-04-30')::text, true);

select is((current_setting('t.a2')::jsonb ->> 'generated')::int, 1,
  'US-54 CA-1 / R5: con hoy 2027-04-30 vence abril (generated = 1)');
select results_eq(
  $$select subscription_period, occurred_on from transactions
     where subscription_id = 'd5400000-0000-0000-0000-000000000001'
     order by subscription_period$$,
  $$values ('2027-01-01'::date, '2027-01-31'::date),
           ('2027-02-01'::date, '2027-02-28'::date),
           ('2027-03-01'::date, '2027-03-31'::date),
           ('2027-04-01'::date, '2027-04-30'::date)$$,
  'US-54 CA-1 / R4: día 31 desde enero 2027 da 31/01, 28/02, 31/03 y 30/04');

-- ---------------------------------------------------------------------------
-- CA-2: día 29. Febrero 2028 (bisiesto) → 29/02; febrero 2027 → 28/02.
-- ---------------------------------------------------------------------------
select set_config('t.b', catch_up_subscriptions('54b00000-0000-0000-0000-000000000002', '2028-02-29')::text, true);
select set_config('t.c', catch_up_subscriptions('54c00000-0000-0000-0000-000000000003', '2027-02-28')::text, true);

select results_eq(
  $$select subscription_period, occurred_on from transactions
     where subscription_id = 'd5400000-0000-0000-0000-000000000002'
     order by subscription_period$$,
  $$values ('2028-02-01'::date, '2028-02-29'::date)$$,
  'US-54 CA-2 / R4: día 29 en febrero 2028 (bisiesto) da 2028-02-29');
select results_eq(
  $$select subscription_period, occurred_on from transactions
     where subscription_id = 'd5400000-0000-0000-0000-000000000003'
     order by subscription_period$$,
  $$values ('2027-02-01'::date, '2027-02-28'::date)$$,
  'US-54 CA-2 / R4: día 29 en febrero 2027 da 2027-02-28');

-- ---------------------------------------------------------------------------
-- CA-3: día 30. Febrero 2028 → 29/02; febrero 2027 → 28/02.
-- ---------------------------------------------------------------------------
select set_config('t.d', catch_up_subscriptions('54d00000-0000-0000-0000-000000000004', '2028-02-29')::text, true);
select set_config('t.e', catch_up_subscriptions('54e00000-0000-0000-0000-000000000005', '2027-02-28')::text, true);

select results_eq(
  $$select subscription_period, occurred_on from transactions
     where subscription_id = 'd5400000-0000-0000-0000-000000000004'
     order by subscription_period$$,
  $$values ('2028-02-01'::date, '2028-02-29'::date)$$,
  'US-54 CA-3 / R4: día 30 en febrero 2028 (bisiesto) da 2028-02-29');
select results_eq(
  $$select subscription_period, occurred_on from transactions
     where subscription_id = 'd5400000-0000-0000-0000-000000000005'
     order by subscription_period$$,
  $$values ('2027-02-01'::date, '2027-02-28'::date)$$,
  'US-54 CA-3 / R4: día 30 en febrero 2027 da 2027-02-28');

-- ---------------------------------------------------------------------------
-- CA-6: día 31 en febrero 2028 (bisiesto) → 29/02.
-- ---------------------------------------------------------------------------
select set_config('t.f', catch_up_subscriptions('54f00000-0000-0000-0000-000000000006', '2028-02-29')::text, true);

select results_eq(
  $$select subscription_period, occurred_on from transactions
     where subscription_id = 'd5400000-0000-0000-0000-000000000006'
     order by subscription_period$$,
  $$values ('2028-02-01'::date, '2028-02-29'::date)$$,
  'US-54 CA-6 / R4: día 31 en febrero 2028 (bisiesto) da 2028-02-29');

-- ---------------------------------------------------------------------------
-- Extremo: día 1 en febrero → el 1 (min(1, días del mes) = 1).
-- ---------------------------------------------------------------------------
select set_config('t.g', catch_up_subscriptions('54000000-0000-0000-0000-000000000007', '2027-02-01')::text, true);

select results_eq(
  $$select subscription_period, occurred_on from transactions
     where subscription_id = 'd5400000-0000-0000-0000-000000000007'
     order by subscription_period$$,
  $$values ('2027-02-01'::date, '2027-02-01'::date)$$,
  'US-54 R4 / I13: día 1 en febrero 2027 da 2027-02-01');

-- ---------------------------------------------------------------------------
-- CA-4: ningún recorte pasa al mes siguiente, sobre todo lo generado en este archivo
-- ---------------------------------------------------------------------------
-- 4 (CA-1) + 2 (CA-2) + 2 (CA-3) + 1 (CA-6) + 1 (día 1) = 10. El conteo evita el falso verde de "0 violaciones".
select is((select count(*) from transactions
            where user_id in ('54a00000-0000-0000-0000-000000000001','54b00000-0000-0000-0000-000000000002',
                              '54c00000-0000-0000-0000-000000000003','54d00000-0000-0000-0000-000000000004',
                              '54e00000-0000-0000-0000-000000000005','54f00000-0000-0000-0000-000000000006',
                              '54000000-0000-0000-0000-000000000007')), 10::bigint,
  'US-54 CA-4: el archivo genera exactamente 10 ocurrencias');
select is((select count(*) from transactions
            where user_id in ('54a00000-0000-0000-0000-000000000001','54b00000-0000-0000-0000-000000000002',
                              '54c00000-0000-0000-0000-000000000003','54d00000-0000-0000-0000-000000000004',
                              '54e00000-0000-0000-0000-000000000005','54f00000-0000-0000-0000-000000000006',
                              '54000000-0000-0000-0000-000000000007')
              and (subscription_period is distinct from date_trunc('month', occurred_on)::date
                   or first_period is distinct from subscription_period)), 0::bigint,
  'US-54 CA-4: en todas, subscription_period = date_trunc(''month'', occurred_on) = first_period');
select is((select count(*) from ledger_entries
            where user_id in ('54a00000-0000-0000-0000-000000000001','54b00000-0000-0000-0000-000000000002',
                              '54c00000-0000-0000-0000-000000000003','54d00000-0000-0000-0000-000000000004',
                              '54e00000-0000-0000-0000-000000000005','54f00000-0000-0000-0000-000000000006',
                              '54000000-0000-0000-0000-000000000007')), 10::bigint,
  'US-54 CA-4 / C3: una sola imputación por ocurrencia (10 en total)');
select is((select count(*) from ledger_entries le join transactions t on t.id = le.transaction_id
            where t.user_id in ('54a00000-0000-0000-0000-000000000001','54b00000-0000-0000-0000-000000000002',
                                '54c00000-0000-0000-0000-000000000003','54d00000-0000-0000-0000-000000000004',
                                '54e00000-0000-0000-0000-000000000005','54f00000-0000-0000-0000-000000000006',
                                '54000000-0000-0000-0000-000000000007')
              and le.installment_number = 1
              and le.period = t.subscription_period
              and le.period = date_trunc('month', t.occurred_on)::date), 10::bigint,
  'US-54 CA-4: la imputación cae en el mismo período que la ocurrencia, no en el mes siguiente');

select * from finish();
rollback;
