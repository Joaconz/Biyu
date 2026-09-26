-- create_transaction (C3, C4, C6): reparto de cuotas, rechazos por RPC directo, aislamiento y anon.
begin;
select plan(37);

insert into auth.users (id, instance_id, aud, role, email) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','00000000-0000-0000-0000-000000000000','authenticated','authenticated','a@test.local'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b@test.local');
insert into categories (id, user_id, name) values
  ('c0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Tecnología'),
  ('c0000000-0000-0000-0000-000000000002','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','Ajena'),
  ('c0000000-0000-0000-0000-000000000003','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Vieja');
update categories set archived_at = now() where id = 'c0000000-0000-0000-0000-000000000003';
insert into accounts (id, user_id, name, type, currency) values
  ('a0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Visa','credit_card','ARS'),
  ('a0000000-0000-0000-0000-000000000002','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Efectivo','cash','ARS'),
  ('a0000000-0000-0000-0000-000000000003','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','Ajena','credit_card','ARS');

set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

-- Prorrateo exacto: 120000 en 12 desde 2026-08-15.
select lives_ok($$select create_transaction('expense',120000,'ARS',null,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',12,'2026-08-15','Notebook')$$, '120000 en 12 cuotas se guarda');
select is((select count(*) from ledger_entries where amount = 10000), 12::bigint, '12 imputaciones de 10000');
select is((select min(period) from ledger_entries), '2026-08-01'::date, 'la primera imputación es 2026-08');
select is((select max(period) from ledger_entries), '2027-07-01'::date, 'la última imputación es 2027-07');
select is((select sum(amount) from ledger_entries), 120000.00, 'la suma es exactamente 120000 (I1)');
select is((select first_period from transactions), '2026-08-01'::date, 'first_period lo deriva el servidor');
select is((select array_agg(installment_number order by installment_number) from ledger_entries), array(select generate_series(1, 12)), 'numeradas de 1 a 12 sin huecos (I2)');
select is((select array_agg(period order by installment_number) from ledger_entries), array(select generate_series('2026-08-01'::date, '2027-07-01', interval '1 month')::date), 'un período por mes, consecutivos y cruzando el año (I3)');

-- Resto absorbido por la última cuota: 100000 en 3.
select lives_ok($$select create_transaction('expense',100000,'ARS',null,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',3,'2026-08-15')$$, '100000 en 3 cuotas se guarda');
select is((select array_agg(le.amount order by le.installment_number) from ledger_entries le join transactions t on t.id = le.transaction_id where t.amount = 100000), array[33333.33, 33333.33, 33333.34], 'las primeras dos de 33333.33 y la última de 33333.34');

-- USD: I1' (prorrateo del total convertido) contra la columna generada.
select lives_ok($$select create_transaction('expense',100,'USD',1250.5555,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',3,'2026-08-15')$$, 'USD 100 en 3 cuotas se guarda');
select is((select sum(le.amount_ars) from ledger_entries le join transactions t on t.id = le.transaction_id where t.currency = 'USD'), 125055.55, 'la suma de amount_ars es exactamente la conversión (I1'')');
-- La última cuota absorbe el resto en cada serie por separado (US-15, ADR-013).
select is((select array_agg(le.amount order by le.installment_number) from ledger_entries le join transactions t on t.id = le.transaction_id where t.currency = 'USD'), array[33.33, 33.33, 33.34], 'USD: amount 33.33, 33.33 y la última 33.34');
select is((select array_agg(le.amount_ars order by le.installment_number) from ledger_entries le join transactions t on t.id = le.transaction_id where t.currency = 'USD'), array[41685.18, 41685.18, 41685.19], 'USD: amount_ars 41685.18, 41685.18 y la última 41685.19');
-- Resto solo en ARS: convertir cuota a cuota daría 3000.00 contra un amount_ars de 3000.01.
select lives_ok($$select create_transaction('expense',3,'USD',1000.0034,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',3,'2026-08-15')$$, 'USD 3 x 1000.0034 en 3 cuotas se guarda');
select is((select array_agg(le.amount_ars order by le.installment_number) from ledger_entries le join transactions t on t.id = le.transaction_id where t.amount = 3), array[1000.00, 1000.00, 1000.01], 'resto solo en ARS: la última cuota absorbe el centavo');

-- Contado sin cuenta de crédito.
select lives_ok($$select create_transaction('expense',500.50,'ARS',null,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000002',1,'2026-08-15')$$, 'un gasto de contado en efectivo se guarda');
select results_eq(
  $$select le.installment_number, le.period, le.amount from ledger_entries le join transactions t on t.id = le.transaction_id where t.amount = 500.50$$,
  $$values (1, '2026-08-01'::date, 500.50::numeric(14,2))$$,
  '1 cuota: una sola imputación, la 1, por el total y en el período de la fecha');
select lives_ok($$select create_transaction('income',1000,'ARS',null,null,'a0000000-0000-0000-0000-000000000002',1,'2026-08-15')$$, 'un ingreso sin categoría se guarda');

select is((select count(*) from ledger_integrity_violations), 0::bigint, 'la vista de integridad queda vacía (I1, I1'')');

-- Rechazos directos por RPC (C6). Ninguno deja filas: se cuenta al final.
select throws_ok($$select create_transaction('expense',100,'USD',null,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',1,'2026-08-15')$$, '23514', null, 'USD sin tipo de cambio se rechaza (I5)');
select throws_ok($$select create_transaction('expense',100,'ARS',1250,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',1,'2026-08-15')$$, '23514', null, 'ARS con tipo de cambio se rechaza (I5)');
select throws_ok($$select create_transaction('expense',0,'ARS',null,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',1,'2026-08-15')$$, '23514', null, 'monto cero se rechaza (I4)');
select throws_ok($$select create_transaction('expense',-5,'ARS',null,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',1,'2026-08-15')$$, '23514', null, 'monto negativo se rechaza (I4)');
select throws_ok($$select create_transaction('expense',null,'ARS',null,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',1,'2026-08-15')$$, '23514', null, 'monto vacío (null) se rechaza (I4)');
select throws_ok($$select create_transaction('expense',10.005,'ARS',null,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',1,'2026-08-15')$$, '23514', null, 'más de 2 decimales se rechaza');
select throws_ok($$select create_transaction('expense',100,'ARS',null,null,'a0000000-0000-0000-0000-000000000001',1,'2026-08-15')$$, '23514', null, 'gasto sin categoría se rechaza (I8)');
select throws_ok($$select create_transaction('expense',600,'ARS',null,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000002',6,'2026-08-15')$$, '23514', null, '6 cuotas sobre efectivo se rechazan (I6)');
select throws_ok($$select create_transaction('income',600,'ARS',null,null,'a0000000-0000-0000-0000-000000000001',2,'2026-08-15')$$, '23514', null, 'cuotas en un ingreso se rechazan (I6)');
select throws_ok($$select create_transaction('expense',1300,'ARS',null,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',13,'2026-08-15')$$, '23514', null, '13 cuotas se rechazan (tope de 12)');
select throws_ok($$select create_transaction('expense',100,'ARS',null,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',0,'2026-08-15')$$, '23514', null, '0 cuotas se rechazan');
select throws_ok($$select create_transaction('expense',0.02,'ARS',null,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',3,'2026-08-15')$$, '23514', null, 'una cuota menor a 0,01 se rechaza');
select throws_ok($$select create_transaction('expense',100,'ARS',null,'c0000000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000001',1,'2026-08-15')$$, '23503', null, 'categoría de otro usuario se rechaza');
select throws_ok($$select create_transaction('expense',100,'ARS',null,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000003',1,'2026-08-15')$$, '23503', null, 'cuenta de otro usuario se rechaza');
select throws_ok($$select create_transaction('expense',100,'ARS',null,'c0000000-0000-0000-0000-000000000003','a0000000-0000-0000-0000-000000000001',1,'2026-08-15')$$, '23503', null, 'categoría archivada se rechaza');

select is((select count(*) from transactions), 6::bigint, 'los rechazos no dejaron ninguna transacción (atomicidad, C4)');

-- anon no puede ejecutar la función.
reset role;
set local role anon;
select throws_ok($$select create_transaction('expense',100,'ARS',null,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',1,'2026-08-15')$$, '42501', null, 'anon no ejecuta create_transaction');

select * from finish();
rollback;
