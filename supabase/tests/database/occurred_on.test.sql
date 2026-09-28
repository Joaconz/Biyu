-- Fecha del gasto (US-09, FR-06, ADR-021): una fecha pasada imputa a su propio mes, hoy se acepta y
-- una fecha posterior a hoy se rechaza directo por RPC (C6). Las fechas son relativas a hoy en
-- Argentina para que el test no dependa del día en que corre.
begin;
select plan(14);

insert into auth.users (id, instance_id, aud, role, email) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','00000000-0000-0000-0000-000000000000','authenticated','authenticated','a@test.local');
insert into categories (id, user_id, name) values
  ('c0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Comida');
insert into accounts (id, user_id, name, type, currency) values
  ('a0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Visa','credit_card','ARS'),
  ('a0000000-0000-0000-0000-000000000002','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Efectivo','cash','ARS');

-- ayer, el 15 del mes anterior, hoy, mañana y dentro de un año, según el día calendario de Argentina.
create temporary table _d as
select today - 1                                                   as yesterday,
       (date_trunc('month', today) - interval '1 month')::date + 14 as last_month,
       today,
       today + 1                                                   as tomorrow,
       (today + interval '1 year')::date                           as next_year
from (select (now() at time zone 'America/Argentina/Buenos_Aires')::date as today) t;
grant select on _d to public;

set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

-- US-09: el gasto que me olvidé ayer.
select lives_ok(
  format($$select create_transaction('expense',1500,'ARS',null,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000002',1,%L)$$, (select yesterday from _d)),
  'un gasto con fecha de ayer se guarda');
select is((select occurred_on from transactions where amount = 1500), (select yesterday from _d), 'occurred_on queda como la fecha elegida');
select is((select first_period from transactions where amount = 1500), date_trunc('month', (select yesterday from _d))::date, 'first_period es el mes de ayer');
select results_eq(
  $$select le.installment_number, le.period, le.amount from ledger_entries le join transactions t on t.id = le.transaction_id where t.amount = 1500$$,
  $$select 1, date_trunc('month', yesterday)::date, 1500.00::numeric(14,2) from _d$$,
  'una sola imputación, por el total, en el mes de ayer');

-- Fecha del mes anterior, en cuotas: la primera imputa al mes de la fecha, no al de hoy.
select lives_ok(
  format($$select create_transaction('expense',9000,'ARS',null,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',3,%L)$$, (select last_month from _d)),
  'una compra en 3 cuotas con fecha del mes anterior se guarda');
select is((select first_period from transactions where amount = 9000), date_trunc('month', (select last_month from _d))::date, 'first_period es el mes anterior');
select is(
  (select array_agg(le.period order by le.installment_number) from ledger_entries le join transactions t on t.id = le.transaction_id where t.amount = 9000),
  (select array[m, (m + interval '1 month')::date, (m + interval '2 months')::date] from (select date_trunc('month', last_month)::date as m from _d) x),
  'las 3 imputaciones arrancan el mes anterior y siguen consecutivas (I3)');
select is(
  (select array_agg(le.amount order by le.installment_number) from ledger_entries le join transactions t on t.id = le.transaction_id where t.amount = 9000),
  array[3000.00, 3000.00, 3000.00]::numeric[],
  'cada cuota es de 3000 (I1)');

-- Límite: hoy se acepta.
select lives_ok(
  format($$select create_transaction('expense',700,'ARS',null,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000002',1,%L)$$, (select today from _d)),
  'un gasto con fecha de hoy se guarda');
select is((select first_period from transactions where amount = 700), date_trunc('month', (select today from _d))::date, 'first_period es el mes de hoy');

-- FR-06: una fecha posterior a hoy se rechaza por RPC directo, aunque el cliente ya la bloquee.
select throws_ok(
  format($$select create_transaction('expense',800,'ARS',null,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000002',1,%L)$$, (select tomorrow from _d)),
  '23514', 'FR-06: la fecha no puede ser posterior a hoy', 'una fecha de mañana se rechaza');
select throws_ok(
  format($$select create_transaction('expense',800,'ARS',null,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',3,%L)$$, (select next_year from _d)),
  '23514', 'FR-06: la fecha no puede ser posterior a hoy', 'una compra en cuotas con fecha futura también se rechaza');

select is((select count(*) from transactions), 3::bigint, 'los rechazos no dejaron ninguna transacción (C4)');
select is((select count(*) from ledger_integrity_violations), 0::bigint, 'la vista de integridad queda vacía (I1)');

select * from finish();
rollback;
