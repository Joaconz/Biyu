-- US-34 (#224), ADR-036: create_transaction con gasto compartido crea la deuda vinculada en la misma
-- llamada (C4). Cubre CA-3, CA-5, CA-6, CA-8 y la compatibilidad de un llamado sin los parámetros nuevos.
-- El límite I7 (deuda > gasto) es de US-41 y no se prueba acá.
begin;
select plan(32);

insert into auth.users (id, instance_id, aud, role, email) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','00000000-0000-0000-0000-000000000000','authenticated','authenticated','a@test.local');
insert into categories (id, user_id, name) values
  ('c0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Salidas');
insert into accounts (id, user_id, name, type, currency) values
  ('a0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Visa','credit_card','ARS'),
  ('a0000000-0000-0000-0000-000000000002','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Efectivo','cash','ARS');

set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

-- CA-3: 120000 ARS en 12 cuotas, compartido 60000 con Sofía.
select lives_ok($$select set_config('t.ca3', create_transaction(
  p_type => 'expense', p_amount => 120000, p_currency => 'ARS', p_fx_rate => null,
  p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => 'a0000000-0000-0000-0000-000000000001',
  p_installments_count => 12, p_occurred_on => '2026-08-15', p_description => 'CA-3',
  p_shared_person => 'Sofía', p_shared_amount => 60000)::text, true)$$,
  'CA-3: un gasto compartido en 12 cuotas se guarda');
select is((select count(*) from transactions where description = 'CA-3'), 1::bigint, 'CA-3: una sola transacción');
select is((select array_agg(amount order by installment_number) from ledger_entries where transaction_id = current_setting('t.ca3')::uuid),
  array_fill(10000.00::numeric, array[12]), 'CA-3: 12 imputaciones de 10000');
select is((select array_agg(period order by installment_number) from ledger_entries where transaction_id = current_setting('t.ca3')::uuid),
  array(select generate_series('2026-08-01'::date, '2027-07-01', interval '1 month')::date), 'CA-3: períodos 2026-08 a 2027-07');
select is((select count(*) from debts), 1::bigint, 'CA-3: una sola deuda, no una por cuota (ADR-036)');
select results_eq(
  $$select person, amount, currency::text, fx_rate, direction::text, status::text, settled_at, incurred_on, notes from debts$$,
  $$values ('Sofía'::text, 60000.00::numeric, 'ARS'::text, null::numeric, 'owed_to_me'::text, 'pending'::text, null::timestamptz, '2026-08-15'::date, null::text)$$,
  'CA-3: deuda con persona, monto 60000.00, ARS, sin tipo de cambio, owed_to_me, pending, sin liquidar, fecha de la compra y sin notas');
select is((select transaction_id from debts), current_setting('t.ca3')::uuid, 'CA-3 / US-35 CA-1: la deuda queda vinculada al id que devolvió create_transaction');

-- CA-5: USD 100 a 1250, compartido 40.
select lives_ok($$select create_transaction(
  p_type => 'expense', p_amount => 100, p_currency => 'USD', p_fx_rate => 1250,
  p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => 'a0000000-0000-0000-0000-000000000002',
  p_installments_count => 1, p_occurred_on => '2026-08-15', p_description => 'CA-5',
  p_shared_person => 'Marcos', p_shared_amount => 40)$$,
  'CA-5: un gasto en USD compartido se guarda');
select results_eq(
  $$select amount, currency::text, fx_rate, amount_ars from debts where person = 'Marcos'$$,
  $$values (40.00::numeric, 'USD'::text, 1250.0000::numeric, 50000.00::numeric)$$,
  'CA-5: la deuda hereda USD y el tipo de cambio congelado, y amount_ars es 50000.00');

-- CA-6: recorte de la persona con la misma clase de caracteres que String.prototype.trim.
select lives_ok($$select create_transaction(
  p_type => 'expense', p_amount => 100, p_currency => 'ARS', p_fx_rate => null,
  p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => 'a0000000-0000-0000-0000-000000000002',
  p_installments_count => 1, p_occurred_on => '2026-08-15', p_description => 'CA-6a',
  p_shared_person => '  Sofía  ', p_shared_amount => 50)$$, 'CA-6: persona con espacios alrededor se guarda');
select lives_ok($$select create_transaction(
  p_type => 'expense', p_amount => 100, p_currency => 'ARS', p_fx_rate => null,
  p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => 'a0000000-0000-0000-0000-000000000002',
  p_installments_count => 1, p_occurred_on => '2026-08-15', p_description => 'CA-6b',
  p_shared_person => E' \tAna\t ', p_shared_amount => 50)$$, 'CA-6: persona con NBSP y tabulación alrededor se guarda');
select lives_ok($$select create_transaction(
  p_type => 'expense', p_amount => 100, p_currency => 'ARS', p_fx_rate => null,
  p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => 'a0000000-0000-0000-0000-000000000002',
  p_installments_count => 1, p_occurred_on => '2026-08-15', p_description => 'CA-6c',
  p_shared_person => repeat('b', 60), p_shared_amount => 50)$$, 'CA-6: persona de exactamente 60 caracteres se acepta (borde)');
select is((select d.person from debts d join transactions t on t.id = d.transaction_id where t.description = 'CA-6a'), 'Sofía', 'CA-6: ''  Sofía  '' se guarda como ''Sofía''');
select is((select d.person from debts d join transactions t on t.id = d.transaction_id where t.description = 'CA-6b'), 'Ana', 'CA-6: NBSP y tabulación se recortan');
select is((select char_length(d.person) from debts d join transactions t on t.id = d.transaction_id where t.description = 'CA-6c'), 60, 'CA-6: la persona de 60 caracteres se guarda entera');

-- Sin los parámetros nuevos: se comporta como antes.
select lives_ok($$select create_transaction(
  p_type => 'expense', p_amount => 200, p_currency => 'ARS', p_fx_rate => null,
  p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => 'a0000000-0000-0000-0000-000000000002',
  p_installments_count => 1, p_occurred_on => '2026-08-15', p_description => 'solo')$$, 'un llamado sin gasto compartido se guarda');
select is((select count(*) from debts d join transactions t on t.id = d.transaction_id where t.description = 'solo'), 0::bigint, 'un llamado sin gasto compartido no crea deuda');

-- CA-8: rechazos. Ninguno deja filas (C4): se cuenta al final.
select throws_ok($$select create_transaction(
  p_type => 'expense', p_amount => 100, p_currency => 'ARS', p_fx_rate => null,
  p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => 'a0000000-0000-0000-0000-000000000002',
  p_installments_count => 1, p_occurred_on => '2026-08-15', p_shared_person => 'Sofía')$$,
  '23514', 'Un gasto compartido necesita persona y monto', 'CA-8: solo persona, sin monto, se rechaza');
select throws_ok($$select create_transaction(
  p_type => 'expense', p_amount => 100, p_currency => 'ARS', p_fx_rate => null,
  p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => 'a0000000-0000-0000-0000-000000000002',
  p_installments_count => 1, p_occurred_on => '2026-08-15', p_shared_amount => 50)$$,
  '23514', 'Un gasto compartido necesita persona y monto', 'CA-8: solo monto, sin persona, se rechaza');
select throws_ok($$select create_transaction(
  p_type => 'income', p_amount => 100, p_currency => 'ARS', p_fx_rate => null,
  p_category_id => null, p_account_id => 'a0000000-0000-0000-0000-000000000002',
  p_installments_count => 1, p_occurred_on => '2026-08-15', p_shared_person => 'Sofía', p_shared_amount => 50)$$,
  '23514', 'Un ingreso no se puede compartir', 'CA-8: un ingreso con deuda se rechaza');
select throws_ok($$select create_transaction(
  p_type => 'expense', p_amount => 100, p_currency => 'ARS', p_fx_rate => null,
  p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => 'a0000000-0000-0000-0000-000000000002',
  p_installments_count => 1, p_occurred_on => '2026-08-15', p_shared_person => '   ', p_shared_amount => 50)$$,
  '23514', 'Ingresá con quién compartiste el gasto', 'CA-8: persona de solo espacios se rechaza');
select throws_ok($$select create_transaction(
  p_type => 'expense', p_amount => 100, p_currency => 'ARS', p_fx_rate => null,
  p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => 'a0000000-0000-0000-0000-000000000002',
  p_installments_count => 1, p_occurred_on => '2026-08-15', p_shared_person => E'\t', p_shared_amount => 50)$$,
  '23514', 'Ingresá con quién compartiste el gasto', 'CA-8: persona de solo tabulación se rechaza');
select throws_ok($$select create_transaction(
  p_type => 'expense', p_amount => 100, p_currency => 'ARS', p_fx_rate => null,
  p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => 'a0000000-0000-0000-0000-000000000002',
  p_installments_count => 1, p_occurred_on => '2026-08-15', p_shared_person => repeat('b', 61), p_shared_amount => 50)$$,
  '23514', 'La persona admite hasta 60 caracteres', 'CA-8: persona de 61 caracteres se rechaza');
select throws_ok($$select create_transaction(
  p_type => 'expense', p_amount => 100, p_currency => 'ARS', p_fx_rate => null,
  p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => 'a0000000-0000-0000-0000-000000000002',
  p_installments_count => 1, p_occurred_on => '2026-08-15', p_shared_person => 'Sofía', p_shared_amount => 0)$$,
  '23514', 'I4: el monto de la deuda debe ser mayor a cero', 'CA-8 / I4: monto de deuda 0 se rechaza');
select throws_ok($$select create_transaction(
  p_type => 'expense', p_amount => 100, p_currency => 'ARS', p_fx_rate => null,
  p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => 'a0000000-0000-0000-0000-000000000002',
  p_installments_count => 1, p_occurred_on => '2026-08-15', p_shared_person => 'Sofía', p_shared_amount => -1)$$,
  '23514', 'I4: el monto de la deuda debe ser mayor a cero', 'CA-8 / I4: monto de deuda negativo se rechaza');
select throws_ok($$select create_transaction(
  p_type => 'expense', p_amount => 100, p_currency => 'ARS', p_fx_rate => null,
  p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => 'a0000000-0000-0000-0000-000000000002',
  p_installments_count => 1, p_occurred_on => '2026-08-15', p_shared_person => 'Sofía', p_shared_amount => 1.001)$$,
  '23514', 'I4: el monto de la deuda admite hasta 2 decimales', 'CA-8 / I4: monto de deuda con 3 decimales se rechaza');
select throws_ok($$select create_transaction(
  p_type => 'expense', p_amount => 100, p_currency => 'ARS', p_fx_rate => null,
  p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => 'a0000000-0000-0000-0000-000000000002',
  p_installments_count => 1, p_occurred_on => '2026-08-15', p_shared_person => 'Sofía', p_shared_amount => 'NaN')$$,
  '23514', 'I4: el monto de la deuda debe ser mayor a cero', 'CA-8 / I4: monto de deuda NaN se rechaza');
select throws_ok($$select create_transaction(
  p_type => 'expense', p_amount => 100, p_currency => 'USD', p_fx_rate => 0.4,
  p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => 'a0000000-0000-0000-0000-000000000002',
  p_installments_count => 1, p_occurred_on => '2026-08-15', p_shared_person => 'Sofía', p_shared_amount => 0.01)$$,
  '23514', 'I4: la deuda en pesos daría menos de $0,01', 'CA-8 / I4: deuda USD que en pesos redondea a cero se rechaza');

select is((select count(*) from transactions), 6::bigint, 'CA-8: los rechazos no dejaron transacciones (C4)');
select is((select count(*) from ledger_entries), 17::bigint, 'CA-8: los rechazos no dejaron imputaciones (C4)');
select is((select count(*) from debts), 5::bigint, 'CA-8: los rechazos no dejaron deudas (C4)');

-- anon no puede ejecutar la función.
reset role;
set local role anon;
select throws_ok($$select create_transaction(
  p_type => 'expense', p_amount => 100, p_currency => 'ARS', p_fx_rate => null,
  p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => 'a0000000-0000-0000-0000-000000000002',
  p_installments_count => 1, p_occurred_on => '2026-08-15', p_shared_person => 'Sofía', p_shared_amount => 50)$$,
  '42501', null, 'C7: anon no ejecuta create_transaction con gasto compartido');

select * from finish();
rollback;
