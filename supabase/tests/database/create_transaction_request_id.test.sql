-- US-70 (#234), ADR-034, I18: create_transaction con p_request_id es idempotente por (usuario, clave).
-- Cubre CA-9, CA-11, CA-12, CA-13, CA-14, CA-15, el supuesto 6 (gasto compartido) y la baja lógica (C10).
-- CA-10 (dos llamadas simultáneas con la misma clave) NO se prueba acá: pgTAP corre en una sola sesión
-- y no puede abrir dos transacciones que compitan por el índice único. Se verifica a mano o con una
-- prueba concurrente aparte (la segunda espera en el índice y devuelve el id de la primera, sin 23505).
begin;
select plan(35);

insert into auth.users (id, instance_id, aud, role, email) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','00000000-0000-0000-0000-000000000000','authenticated','authenticated','a@test.local'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b@test.local');
insert into categories (id, user_id, name) values
  ('c0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Tecnología'),
  ('c0000000-0000-0000-0000-000000000002','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Por archivar'),
  ('c0000000-0000-0000-0000-000000000003','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','Hogar');
insert into accounts (id, user_id, name, type, currency) values
  ('a0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Visa','credit_card','ARS'),
  ('a0000000-0000-0000-0000-000000000002','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','Visa B','credit_card','ARS');

set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

-- CA-9: la misma clave dos veces, en 3 cuotas: 1 transacción y 3 imputaciones, no 2 y 6.
select lives_ok($$select set_config('t.ca9a', create_transaction('expense',90000,'ARS',null,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',3,'2026-08-15','CA-9',null,null,'10000000-0000-0000-0000-000000000001')::text, true)$$, 'CA-9: la primera llamada con clave se guarda');
select lives_ok($$select set_config('t.ca9b', create_transaction('expense',90000,'ARS',null,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',3,'2026-08-15','CA-9',null,null,'10000000-0000-0000-0000-000000000001')::text, true)$$, 'CA-9: el reintento con la misma clave no falla');
select is(current_setting('t.ca9b')::uuid, current_setting('t.ca9a')::uuid, 'CA-9 / I18: el reintento devuelve el mismo id');
select is((select count(*) from transactions where request_id = '10000000-0000-0000-0000-000000000001'), 1::bigint, 'CA-9 / I18: queda una sola transacción');
select is((select count(*) from ledger_entries), 3::bigint, 'CA-9: quedan 3 imputaciones, no 6');
select is((select array_agg(amount order by installment_number) from ledger_entries), array[30000.00, 30000.00, 30000.00]::numeric[], 'CA-9: las imputaciones son las de la primera llamada (I1)');

-- CA-13: misma clave con otro monto: devuelve el id de la primera y no cambia nada.
select lives_ok($$select set_config('t.ca13a', create_transaction('expense',500,'ARS',null,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',1,'2026-08-15','CA-13',null,null,'10000000-0000-0000-0000-000000000013')::text, true)$$, 'CA-13: la primera llamada de 500 se guarda');
select is(create_transaction('expense',999,'ARS',null,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',1,'2026-08-15','CA-13 otro',null,null,'10000000-0000-0000-0000-000000000013'), current_setting('t.ca13a')::uuid, 'CA-13: misma clave con otro monto devuelve el id de la primera');
select is((select amount from transactions where id = current_setting('t.ca13a')::uuid), 500.00::numeric, 'CA-13: el monto de la primera no cambia (no se compara ni se reescribe el contenido)');

-- CA-14: la categoría de la primera se archivó después: el reintento devuelve el id, sin error.
select lives_ok($$select set_config('t.ca14a', create_transaction('expense',700,'ARS',null,'c0000000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000001',1,'2026-08-15','CA-14',null,null,'10000000-0000-0000-0000-000000000014')::text, true)$$, 'CA-14: la primera llamada con la categoría activa se guarda');
reset role;
update categories set archived_at = now() where id = 'c0000000-0000-0000-0000-000000000002';
set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';
select lives_ok($$select set_config('t.ca14b', create_transaction('expense',700,'ARS',null,'c0000000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000001',1,'2026-08-15','CA-14',null,null,'10000000-0000-0000-0000-000000000014')::text, true)$$, 'CA-14: el reintento con la categoría ya archivada no da error');
select is(current_setting('t.ca14b')::uuid, current_setting('t.ca14a')::uuid, 'CA-14: el reintento devuelve el id de la primera');
-- Control: sin clave, la misma categoría archivada sí se rechaza (la clave se busca antes de validar).
select throws_ok($$select create_transaction('expense',700,'ARS',null,'c0000000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000001',1,'2026-08-15','CA-14 sin clave')$$, '23503', null, 'CA-14: sin clave, la categoría archivada se sigue rechazando');

-- CA-11: mismo contenido con claves distintas: dos transacciones.
select create_transaction('expense',250,'ARS',null,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',1,'2026-08-15','CA-11',null,null,'10000000-0000-0000-0000-00000000001a');
select create_transaction('expense',250,'ARS',null,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',1,'2026-08-15','CA-11',null,null,'10000000-0000-0000-0000-00000000001b');
select is((select count(*) from transactions where description = 'CA-11'), 2::bigint, 'CA-11: mismo contenido con claves distintas crea dos transacciones');
select is((select count(distinct request_id) from transactions where description = 'CA-11'), 2::bigint, 'CA-11: cada una conserva su clave');

-- CA-15: sin clave, una transacción por llamada y request_id null.
select create_transaction('expense',300,'ARS',null,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',1,'2026-08-15','CA-15');
select create_transaction('expense',300,'ARS',null,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',1,'2026-08-15','CA-15');
select is((select count(*) from transactions where description = 'CA-15'), 2::bigint, 'CA-15: sin clave, cada llamada crea su transacción');
select is((select count(*) from transactions where description = 'CA-15' and request_id is null), 2::bigint, 'CA-15: request_id queda null');

-- CA-12 / C7: el usuario B usa la clave que ya usó A.
set local request.jwt.claims = '{"sub":"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb","role":"authenticated"}';
select lives_ok($$select set_config('t.ca12', create_transaction('expense',1200,'ARS',null,'c0000000-0000-0000-0000-000000000003','a0000000-0000-0000-0000-000000000002',1,'2026-08-15','CA-12',null,null,'10000000-0000-0000-0000-000000000001')::text, true)$$, 'CA-12: B puede usar una clave que ya usó A');
select isnt(current_setting('t.ca12')::uuid, current_setting('t.ca9a')::uuid, 'CA-12 / C7: el id de B es distinto del de A (no devuelve filas ajenas)');
select is((select count(*) from transactions), 1::bigint, 'CA-12 / C7: B ve solo su transacción');
reset role;
select results_eq(
  $$select amount, description, (select count(*) from ledger_entries le where le.transaction_id = t.id) from transactions t where id = current_setting('t.ca9a')::uuid$$,
  $$values (90000.00::numeric, 'CA-9'::text, 3::bigint)$$,
  'CA-12: la transacción de A sigue intacta (monto, descripción y 3 imputaciones)');

-- Supuesto 6: gasto compartido con la misma clave: una transacción y una sola deuda.
set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';
select lives_ok($$select set_config('t.s6a', create_transaction('expense',1000,'ARS',null,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',1,'2026-08-15','S6','Sofía',400,'10000000-0000-0000-0000-000000000006')::text, true)$$, 'Supuesto 6: el gasto compartido con clave se guarda');
select is(create_transaction('expense',1000,'ARS',null,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',1,'2026-08-15','S6','Sofía',400,'10000000-0000-0000-0000-000000000006'), current_setting('t.s6a')::uuid, 'Supuesto 6: el reintento devuelve el mismo id');
select is((select count(*) from transactions where description = 'S6'), 1::bigint, 'Supuesto 6: una sola transacción');
select is((select count(*) from debts where transaction_id = current_setting('t.s6a')::uuid), 1::bigint, 'Supuesto 6: una sola deuda, no se duplica en el reintento');

-- C10: la clave de una transacción eliminada devuelve su id y no la recrea.
select lives_ok($$select set_config('t.c10', create_transaction('expense',400,'ARS',null,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',1,'2026-08-15','C10',null,null,'10000000-0000-0000-0000-000000000010')::text, true)$$, 'C10: la transacción con clave se guarda');
select lives_ok($$select delete_transaction(current_setting('t.c10')::uuid)$$, 'C10: se elimina (soft delete)');
select is(create_transaction('expense',400,'ARS',null,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',1,'2026-08-15','C10',null,null,'10000000-0000-0000-0000-000000000010'), current_setting('t.c10')::uuid, 'C10: la clave de una eliminada devuelve su id');
reset role;
select is((select count(*) from transactions where request_id = '10000000-0000-0000-0000-000000000010' and deleted_at is not null), 1::bigint, 'C10: sigue una sola fila, eliminada, y no se recreó');

-- CA-9 / C7: anon no ejecuta la RPC aunque lleve clave.
set local role anon;
select throws_ok($$select create_transaction('expense',100,'ARS',null,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',1,'2026-08-15',null,null,null,'10000000-0000-0000-0000-0000000000ff')$$, '42501', null, 'C7: anon no ejecuta create_transaction con p_request_id');
reset role;

-- I18 a mano, como postgres: el índice único parcial (user_id, request_id).
insert into transactions (user_id, type, amount, currency, category_id, account_id, installments_count, first_period, occurred_on, request_id) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','expense',10,'ARS','c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',1,'2026-08-01','2026-08-15','10000000-0000-0000-0000-0000000000a1');
select throws_ok($$insert into transactions (user_id, type, amount, currency, category_id, account_id, installments_count, first_period, occurred_on, request_id) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','expense',10,'ARS','c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',1,'2026-08-01','2026-08-15','10000000-0000-0000-0000-0000000000a1')$$,
  '23505', null, 'I18: dos filas del mismo usuario con el mismo request_id violan el índice único');
select lives_ok($$insert into transactions (user_id, type, amount, currency, category_id, account_id, installments_count, first_period, occurred_on, request_id) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','expense',10,'ARS','c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',1,'2026-08-01','2026-08-15',null),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','expense',10,'ARS','c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',1,'2026-08-01','2026-08-15',null)$$,
  'I18: varias filas con request_id null conviven (índice parcial, borde)');
select lives_ok($$insert into transactions (user_id, type, amount, currency, category_id, account_id, installments_count, first_period, occurred_on, request_id) values
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','expense',10,'ARS','c0000000-0000-0000-0000-000000000003','a0000000-0000-0000-0000-000000000002',1,'2026-08-01','2026-08-15','10000000-0000-0000-0000-0000000000a1')$$,
  'I18: la misma clave en otro usuario no choca (el índice es por usuario)');

-- insert_transaction_with_entries es interna: authenticated no la ejecuta.
select is(has_function_privilege('authenticated',
  'public.insert_transaction_with_entries(uuid, transaction_type, numeric, currency_code, numeric, uuid, uuid, int, date, text, uuid, date, uuid)', 'execute'),
  false, 'C7: authenticated no tiene EXECUTE sobre insert_transaction_with_entries');
set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';
select throws_ok($$select insert_transaction_with_entries('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','expense',100,'ARS',null,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',1,'2026-08-15',null,null,null,'10000000-0000-0000-0000-0000000000ee')$$,
  '42501', null, 'C7: authenticated no puede llamar insert_transaction_with_entries');

select * from finish();
rollback;
