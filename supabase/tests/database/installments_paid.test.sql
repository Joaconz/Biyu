-- US-80 (#268), ADR-039: compra en cuotas empezada (create_transaction.p_installments_paid e
-- import_transactions). Cubre US-80 CA-2, CA-4, CA-5, CA-6, CA-11, CA-12 y CA-16, I1, I1', I2 y la
-- vista de integridad. H es el mes de hoy en Argentina: las fechas se arman relativas a hoy.
begin;
select plan(41);

insert into auth.users (id, instance_id, aud, role, email) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','00000000-0000-0000-0000-000000000000','authenticated','authenticated','a@test.local');
insert into categories (id, user_id, name) values
  ('c0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Otros');
insert into accounts (id, user_id, name, type, currency) values
  ('a0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Visa','credit_card','ARS'),
  ('a0000000-0000-0000-0000-000000000002','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Efectivo','cash','ARS');

-- Primer día del mes de hoy en Argentina, y la fecha de compra `m` meses antes (día 1: siempre pasada).
create function public.t_h(m int default 0) returns date language sql stable as
  $$ select (date_trunc('month', (now() at time zone 'America/Argentina/Buenos_Aires')::date) - make_interval(months => m))::date $$;

-- create_transaction de una compra con tarjeta; `paid` null = compra normal.
create function public.t_buy(d text, amt numeric, cur text, fx numeric, n int, paid int, months_ago int, acc text default 'a0000000-0000-0000-0000-000000000001')
returns uuid language sql as $$
  select create_transaction(
    p_type => 'expense', p_amount => amt, p_currency => cur::currency_code, p_fx_rate => fx,
    p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => acc::uuid,
    p_installments_count => n, p_occurred_on => public.t_h(months_ago), p_description => d,
    p_installments_paid => paid) $$;

set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

-- CA-2: 120000 ARS, 6 cuotas, 3 pagadas, fecha de H-4.
select lives_ok($$select t_buy('CA-2', 120000, 'ARS', null, 6, 3, 4)$$, 'CA-2: la compra empezada se guarda');
select results_eq(
  $$select amount, installments_count, installments_paid, occurred_on, first_period from transactions where description = 'CA-2'$$,
  $$values (60000.00::numeric, 6, 3, public.t_h(4), public.t_h(0))$$,
  'CA-2: amount = lo que falta, N = 6, K = 3, occurred_on = la compra, first_period = H');
select results_eq(
  $$select le.installment_number, le.period, le.amount from ledger_entries le join transactions t on t.id = le.transaction_id where t.description = 'CA-2' order by 1$$,
  $$values (4, public.t_h(0), 20000.00::numeric), (5, public.t_h(-1), 20000.00::numeric), (6, public.t_h(-2), 20000.00::numeric)$$,
  'CA-2 / I2: imputaciones 4, 5 y 6 en H, H+1 y H+2');

-- CA-4: resto. 100000 en 3 cuotas, 1 pagada, fecha de H-1.
select lives_ok($$select t_buy('CA-4', 100000, 'ARS', null, 3, 1, 1)$$, 'CA-4: compra con resto se guarda');
select results_eq(
  $$select t.amount, le.installment_number, le.amount from ledger_entries le join transactions t on t.id = le.transaction_id where t.description = 'CA-4' order by 2$$,
  $$values (66666.67::numeric, 2, 33333.33::numeric), (66666.67::numeric, 3, 33333.34::numeric)$$,
  'CA-4 / C3: 2/3 de 33333,33 y 3/3 de 33333,34; el movimiento es 66666,67');

-- CA-5: K = 0, todas pendientes desde H aunque la fecha sea H-1.
select lives_ok($$select t_buy('CA-5', 120000, 'ARS', null, 6, 0, 1)$$, 'CA-5: K = 0 se guarda');
select results_eq(
  $$select amount, installments_paid, first_period from transactions where description = 'CA-5'$$,
  $$values (120000.00::numeric, 0, public.t_h(0))$$, 'CA-5: amount total, K = 0 y first_period = H');
select is((select min(period) from ledger_entries le join transactions t on t.id = le.transaction_id where t.description = 'CA-5'), public.t_h(0), 'CA-5: la primera cuota cae en H');
select is((select max(period) from ledger_entries le join transactions t on t.id = le.transaction_id where t.description = 'CA-5'), public.t_h(-5), 'CA-5: la sexta cae en H+5');

-- CA-6: sin p_installments_paid todo igual que antes (desde el mes de la fecha).
select lives_ok($$select t_buy('CA-6', 240000, 'ARS', null, 6, null, 1)$$, 'CA-6: compra normal con paid null');
select results_eq(
  $$select amount, installments_paid, first_period from transactions where description = 'CA-6'$$,
  $$values (240000.00::numeric, 0, public.t_h(1))$$, 'CA-6: first_period = mes de la fecha, installments_paid = 0');
select is((select count(*) from ledger_entries le join transactions t on t.id = le.transaction_id where t.description = 'CA-6'), 6::bigint, 'CA-6: 6 imputaciones');

-- CA-11: USD sin resto. US$300, TC 1000, 3 cuotas, 2 pagadas.
select lives_ok($$select t_buy('CA-11', 300, 'USD', 1000, 3, 2, 2)$$, 'CA-11: USD empezada se guarda');
select results_eq(
  $$select t.amount, t.amount_ars, le.installment_number, le.amount, le.amount_ars, le.period from ledger_entries le join transactions t on t.id = le.transaction_id where t.description = 'CA-11'$$,
  $$values (100.00::numeric, 100000.00::numeric, 3, 100.00::numeric, 100000.00::numeric, public.t_h(0))$$,
  'CA-11: una imputación 3/3 de US$100 y $100.000 en H');

-- CA-12: USD con resto. US$100, TC 1000, 3 cuotas, 1 pagada.
select lives_ok($$select t_buy('CA-12', 100, 'USD', 1000, 3, 1, 1)$$, 'CA-12: USD con resto se guarda');
select results_eq(
  $$select t.amount, t.amount_ars, le.installment_number, le.amount, le.amount_ars from ledger_entries le join transactions t on t.id = le.transaction_id where t.description = 'CA-12' order by 3$$,
  $$values (66.67::numeric, 66670.00::numeric, 2, 33.33::numeric, 33335.00::numeric), (66.67::numeric, 66670.00::numeric, 3, 33.34::numeric, 33335.00::numeric)$$,
  'CA-12 / I1 / I1'': 2/3 de US$33,33 y 3/3 de US$33,34, $33.335,00 cada una, suman $66.670,00');

-- K = N - 1: una sola imputación, la N/N.
select lives_ok($$select t_buy('K=N-1', 1200, 'ARS', null, 12, 11, 11)$$, 'K = N-1 con fecha de H-11 se guarda');
select results_eq(
  $$select count(*), min(installment_number), max(installment_number) from ledger_entries le join transactions t on t.id = le.transaction_id where t.description = 'K=N-1'$$,
  $$values (1::bigint, 12, 12)$$, 'K = N-1: solo la cuota 12/12');

-- La vista de integridad (I1, I1', I2) no marca ninguna.
select is((select count(*) from ledger_integrity_violations), 0::bigint, 'La vista de integridad no marca ninguna transacción');

-- CA-16: rechazos de create_transaction, sin filas nuevas.
select throws_ok($$select t_buy('R1', 120000, 'ARS', null, 6, 6, 4)$$, '23514', 'Las cuotas ya pagadas tienen que ser menos que el total de cuotas', 'CA-16: K = N');
select throws_ok($$select t_buy('R2', 120000, 'ARS', null, 6, -1, 4)$$, '23514', 'Las cuotas ya pagadas tienen que ser menos que el total de cuotas', 'CA-16: K negativo');
select throws_ok($$select t_buy('R3', 1000, 'ARS', null, 1, 0, 0)$$, '23514', 'Las cuotas ya pagadas solo van en una compra en cuotas', 'CA-16: 1 cuota con K = 0');
select throws_ok($$select t_buy('R4', 120000, 'ARS', null, 6, 1, 0)$$, '23514', 'Con esa fecha todavía no puede haber tantas cuotas pagadas', 'CA-16: compra de este mes con K = 1');
select throws_ok($$select t_buy('R5', 120000, 'ARS', null, 6, 3, 2)$$, '23514', 'Con esa fecha todavía no puede haber tantas cuotas pagadas', 'Valor límite: K = 3 con fecha de H-2');
select lives_ok($$select t_buy('R6', 120000, 'ARS', null, 6, 3, 3)$$, 'Valor límite: K = 3 con fecha de H-3 se guarda');
select throws_ok($$select create_transaction(
  p_type => 'expense', p_amount => 120000, p_currency => 'ARS', p_fx_rate => null,
  p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => 'a0000000-0000-0000-0000-000000000001',
  p_installments_count => 6, p_occurred_on => public.t_h(4), p_description => 'R7',
  p_installments_paid => 3, p_shared_persons => array['Sofía']::text[], p_shared_amounts => array[(100)::numeric])$$,
  '23514', 'Una compra empezada no se puede compartir', 'CA-16: compra empezada con deuda');
select throws_ok($$select t_buy('R8', 120000, 'ARS', null, 6, 3, 4, 'a0000000-0000-0000-0000-000000000002')$$, '23514', null, 'I6: K con una cuenta que no es de crédito');
select is((select count(*) from transactions where description like 'R_' and description <> 'R6'), 0::bigint, 'Los rechazos no dejan transacciones');
select is((select count(*) from debts), 0::bigint, 'Los rechazos no dejan deudas');

-- import_transactions: installments_paid por fila.
select lives_ok($q$select set_config('t.imp', import_transactions('11111111-0000-0000-0000-000000000001', jsonb_build_array(
  jsonb_build_object('row',1,'type','expense','amount','120000','currency','ARS','category_id','c0000000-0000-0000-0000-000000000001','account_id','a0000000-0000-0000-0000-000000000001','installments_count',6,'installments_paid',3,'occurred_on',public.t_h(4),'description','IMP-1'),
  jsonb_build_object('row',2,'type','expense','amount','120000','currency','ARS','category_id','c0000000-0000-0000-0000-000000000001','account_id','a0000000-0000-0000-0000-000000000001','installments_count',6,'installments_paid',6,'occurred_on',public.t_h(4),'description','IMP-2'),
  jsonb_build_object('row',3,'type','expense','amount','120000','currency','ARS','category_id','c0000000-0000-0000-0000-000000000001','account_id','a0000000-0000-0000-0000-000000000001','installments_count',6,'installments_paid',null,'occurred_on',public.t_h(1),'description','IMP-3')
))::text, true)$q$, 'import: el lote con filas empezadas se procesa');
select is((select (e ->> 'status') from jsonb_array_elements(current_setting('t.imp')::jsonb -> 'rows') e where e ->> 'row' = '1'), 'imported', 'import: la fila con K = 3 se importa');
select is((select (e ->> 'status') from jsonb_array_elements(current_setting('t.imp')::jsonb -> 'rows') e where e ->> 'row' = '2'), 'rejected', 'import: la fila con K = 6 y 6 cuotas se rechaza');
select is((select (e ->> 'status') from jsonb_array_elements(current_setting('t.imp')::jsonb -> 'rows') e where e ->> 'row' = '3'), 'imported', 'import: la fila con installments_paid null se importa normal');
select results_eq(
  $$select amount, installments_paid, first_period from transactions where description = 'IMP-1'$$,
  $$values (60000.00::numeric, 3, public.t_h(0))$$, 'import: IMP-1 queda como CA-2');
select results_eq(
  $$select installments_paid, first_period from transactions where description = 'IMP-3'$$,
  $$values (0, public.t_h(1))$$, 'import: IMP-3 queda como compra normal');
select is((select count(*) from transactions where description = 'IMP-2'), 0::bigint, 'import: la fila rechazada no crea transacción');

-- CHECK de la tabla (red de contención de C6), como dueño de la tabla.
reset role;
select throws_ok($$update transactions set installments_paid = installments_count where description = 'CA-2'$$, '23514', null, 'CHECK: installments_paid < installments_count');
select throws_ok($$update transactions set installments_paid = -1 where description = 'CA-2'$$, '23514', null, 'CHECK: installments_paid >= 0');
set local role authenticated;

-- Otra sesión no ve las compras (C7).
set local request.jwt.claims = '{"sub":"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb","role":"authenticated"}';
select is((select count(*) from transactions), 0::bigint, 'C7: otra sesión ve cero transacciones');

-- Rol anon: sin permiso sobre la RPC (CA-16).
set local role anon;
select throws_ok($$select create_transaction(p_type => 'expense', p_amount => 1, p_currency => 'ARS', p_fx_rate => null,
  p_category_id => null, p_account_id => null, p_installments_count => 6, p_occurred_on => '2026-01-01', p_installments_paid => 1)$$,
  '42501', null, 'C7: anon no ejecuta create_transaction con p_installments_paid');
select throws_ok($$select import_transactions('11111111-0000-0000-0000-000000000009', '[]'::jsonb)$$, '42501', null, 'C7: anon no ejecuta import_transactions');

select * from finish();
rollback;
