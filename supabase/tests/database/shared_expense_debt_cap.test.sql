-- US-41 (#231), ADR-036, I7: la deuda vinculada no puede superar el gasto de origen. Valores límite
-- (gasto − 0,01, igual, + 0,01) contra create_transaction (CA-1, CA-2, CA-5, CA-6) y el trigger
-- check_debt_rule como red de contención ante un insert directo (CA-8).
begin;
select plan(13);

insert into auth.users (id, instance_id, aud, role, email) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','00000000-0000-0000-0000-000000000000','authenticated','authenticated','a@test.local');
insert into categories (id, user_id, name) values
  ('c0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Salidas');
insert into accounts (id, user_id, name, type, currency) values
  ('a0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Efectivo','cash','ARS');

set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

-- CA-1: gasto − 0,01.
select lives_ok($$select create_transaction(
  p_type => 'expense', p_amount => 10000, p_currency => 'ARS', p_fx_rate => null,
  p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => 'a0000000-0000-0000-0000-000000000001',
  p_installments_count => 1, p_occurred_on => '2026-08-15', p_description => 'CA-1',
  p_shared_person => 'Sofía', p_shared_amount => 9999.99)$$,
  'CA-1: gasto de 10000 con deuda de 9999.99 se guarda');

-- CA-2: deuda igual al gasto.
select lives_ok($$select create_transaction(
  p_type => 'expense', p_amount => 10000, p_currency => 'ARS', p_fx_rate => null,
  p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => 'a0000000-0000-0000-0000-000000000001',
  p_installments_count => 1, p_occurred_on => '2026-08-15', p_description => 'CA-2',
  p_shared_person => 'Sofía', p_shared_amount => 10000)$$,
  'CA-2: gasto de 10000 con deuda de 10000 se guarda');
select is((select d.amount from debts d join transactions t on t.id = d.transaction_id where t.description = 'CA-2'),
  10000.00::numeric, 'CA-2: la deuda tiene amount = 10000.00');

-- CA-5: gasto + 0,01, directo contra la RPC. No deja filas nuevas.
select set_config('t.tx', (select count(*) from transactions)::text, true),
       set_config('t.le', (select count(*) from ledger_entries)::text, true),
       set_config('t.debts', (select count(*) from debts)::text, true);
select throws_ok($$select create_transaction(
  p_type => 'expense', p_amount => 10000, p_currency => 'ARS', p_fx_rate => null,
  p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => 'a0000000-0000-0000-0000-000000000001',
  p_installments_count => 1, p_occurred_on => '2026-08-15', p_description => 'CA-5',
  p_shared_person => 'Sofía', p_shared_amount => 10000.01)$$,
  '23514', 'I7: la deuda no puede superar el monto del gasto',
  'CA-5: deuda de 10000.01 sobre un gasto de 10000 se rechaza con el mensaje de US-41');
-- CA-4 por API: el sad path de la spec (15000) recibe el mismo rechazo.
select throws_ok($$select create_transaction(
  p_type => 'expense', p_amount => 10000, p_currency => 'ARS', p_fx_rate => null,
  p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => 'a0000000-0000-0000-0000-000000000001',
  p_installments_count => 1, p_occurred_on => '2026-08-15', p_description => 'CA-4',
  p_shared_person => 'Sofía', p_shared_amount => 15000)$$,
  '23514', 'I7: la deuda no puede superar el monto del gasto',
  'CA-4: deuda de 15000 sobre un gasto de 10000 se rechaza igual');
select is((select count(*) from transactions)::text, current_setting('t.tx'), 'CA-5: no hay transacciones nuevas');
select is((select count(*) from ledger_entries)::text, current_setting('t.le'), 'CA-5: no hay imputaciones nuevas');
select is((select count(*) from debts)::text, current_setting('t.debts'), 'CA-5: no hay deudas nuevas');

-- CA-6: en dólares se compara en la moneda del gasto. US$100,01 a 1250,5555 → amount_ars 125068.06.
select lives_ok($$select create_transaction(
  p_type => 'expense', p_amount => 100.01, p_currency => 'USD', p_fx_rate => 1250.5555,
  p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => 'a0000000-0000-0000-0000-000000000001',
  p_installments_count => 1, p_occurred_on => '2026-08-15', p_description => 'CA-6',
  p_shared_person => 'Marcos', p_shared_amount => 100.01)$$,
  'CA-6: gasto de US$100,01 con deuda de 100,01 se guarda');
select results_eq(
  $$select d.amount_ars, t.amount_ars from debts d join transactions t on t.id = d.transaction_id where t.description = 'CA-6'$$,
  $$values (125068.06::numeric, 125068.06::numeric)$$,
  'CA-6: el amount_ars de la deuda es igual al del gasto (125068.06)');
select throws_ok($$select create_transaction(
  p_type => 'expense', p_amount => 100.01, p_currency => 'USD', p_fx_rate => 1250.5555,
  p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => 'a0000000-0000-0000-0000-000000000001',
  p_installments_count => 1, p_occurred_on => '2026-08-15', p_description => 'CA-6b',
  p_shared_person => 'Marcos', p_shared_amount => 100.02)$$,
  '23514', 'I7: la deuda no puede superar el monto del gasto',
  'CA-6: deuda de 100,02 sobre US$100,01 se rechaza');

-- CA-8: como dueño de la tabla (sin pasar por la RPC), el trigger check_debt_rule frena una deuda
-- que, sumada a las existentes, supera el amount_ars del gasto. CA-1 ya tiene 9999.99 de 10000.
reset role;
select lives_ok($$insert into debts (user_id, transaction_id, person, amount, currency, fx_rate, direction, status, incurred_on)
  select 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', id, 'Ana', 0.01, 'ARS', null, 'owed_to_me', 'pending', '2026-08-15'
    from transactions where description = 'CA-1'$$,
  'CA-8: completar justo hasta el monto del gasto se acepta (9999.99 + 0.01)');
select throws_ok($$insert into debts (user_id, transaction_id, person, amount, currency, fx_rate, direction, status, incurred_on)
  select 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', id, 'Ana', 0.01, 'ARS', null, 'owed_to_me', 'pending', '2026-08-15'
    from transactions where description = 'CA-1'$$,
  '23514', 'I7: la suma de las deudas supera el monto de la transacción',
  'CA-8: una deuda más que haga superar el gasto la frena check_debt_rule');

select * from finish();
rollback;
