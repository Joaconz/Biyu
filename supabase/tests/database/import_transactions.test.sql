-- US-77 (#206), US-78, ADR-035: import_transactions(p_import_id, p_rows) y la tabla imports.
-- Cubre US-77 CA-7 (filas inválidas), CA-8 (lote rechazado entero), US-78 CA-2 (idempotencia por id),
-- C3/I1/I1' (suma de imputaciones = monto, la última cuota absorbe el resto), el par RLS de imports (C7)
-- y imported_rows / sent_rows guardados. La validación de cada fila es la de create_transaction (C6).
begin;
select plan(66);

-- Datos ficticios (C14). A es el dueño; B es otra sesión.
insert into auth.users (id, instance_id, aud, role, email) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','00000000-0000-0000-0000-000000000000','authenticated','authenticated','a@test.local'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b@test.local');
insert into categories (id, user_id, name, archived_at) values
  ('c0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Tecnología', null),
  ('c0000000-0000-0000-0000-000000000002','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Vieja', now()),
  ('c0000000-0000-0000-0000-000000000003','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','Hogar', null);
insert into accounts (id, user_id, name, type, currency) values
  ('a0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Visa','credit_card','ARS'),
  ('a0000000-0000-0000-0000-000000000002','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','Visa B','credit_card','ARS'),
  ('a0000000-0000-0000-0000-000000000003','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Efectivo','cash','ARS');
select set_config('t.today', (now() at time zone 'America/Argentina/Buenos_Aires')::date::text, true);
select set_config('t.future', ((now() at time zone 'America/Argentina/Buenos_Aires')::date + 1)::text, true);

-- Ayuda de test: la fila `n` del resultado guardado en el setting `s`.
create function public.t_import_row(s text, n int) returns jsonb language sql stable as
  $$ select e from jsonb_array_elements(current_setting(s)::jsonb -> 'rows') e where e ->> 'row' = n::text $$;

set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

-- ---------------------------------------------------------------------------
-- CA-7: un lote de 7 filas, una válida y seis inválidas.
-- ---------------------------------------------------------------------------
select lives_ok($q$select set_config('t.r1', import_transactions('11111111-0000-0000-0000-000000000001', jsonb_build_array(
  jsonb_build_object('row',1,'type','expense','amount','1000.00','currency','ARS','category_id','c0000000-0000-0000-0000-000000000001','account_id','a0000000-0000-0000-0000-000000000003','installments_count',1,'occurred_on','2026-09-03','description','válida'),
  jsonb_build_object('row',2,'type','expense','amount','0','currency','ARS','category_id','c0000000-0000-0000-0000-000000000001','account_id','a0000000-0000-0000-0000-000000000003','installments_count',1,'occurred_on','2026-09-03'),
  jsonb_build_object('row',3,'type','expense','amount','500.00','currency','ARS','category_id','c0000000-0000-0000-0000-000000000001','installments_count',1,'occurred_on','2026-09-03'),
  jsonb_build_object('row',4,'type','expense','amount','abc','currency','ARS','category_id','c0000000-0000-0000-0000-000000000001','account_id','a0000000-0000-0000-0000-000000000003','installments_count',1,'occurred_on','2026-09-03'),
  jsonb_build_object('row',5,'type','expense','amount','500.00','currency','ARS','category_id','c0000000-0000-0000-0000-000000000002','account_id','a0000000-0000-0000-0000-000000000003','installments_count',1,'occurred_on','2026-09-03'),
  jsonb_build_object('row',6,'type','expense','amount','500.00','currency','ARS','category_id','c0000000-0000-0000-0000-000000000001','account_id','a0000000-0000-0000-0000-000000000003','installments_count',1,'occurred_on', current_setting('t.future')),
  jsonb_build_object('row',7,'type','expense','amount','500.00','currency','ARS','category_id','c0000000-0000-0000-0000-000000000001','account_id','a0000000-0000-0000-0000-000000000002','installments_count',1,'occurred_on','2026-09-03')
))::text, true)$q$, 'CA-7: el lote mixto se procesa sin abortar');
select is(current_setting('t.r1')::jsonb ->> 'already_imported', 'false', 'CA-7: la primera llamada no es una repetición');
select is((current_setting('t.r1')::jsonb ->> 'sent_rows')::int, 7, 'CA-7: sent_rows es 7');
select is((current_setting('t.r1')::jsonb ->> 'imported_rows')::int, 1, 'CA-7: imported_rows es 1');
select is(public.t_import_row('t.r1', 1) ->> 'status', 'imported', 'CA-7: la fila válida se importa');
select isnt(public.t_import_row('t.r1', 1) ->> 'transaction_id', null, 'CA-7: la fila válida devuelve transaction_id');
select is(public.t_import_row('t.r1', 2) ->> 'status', 'rejected', 'CA-7 / I4: monto "0" es rechazado');
select is(public.t_import_row('t.r1', 2) ->> 'error_message', 'I4: el monto debe ser mayor a cero', 'CA-7 / I4: el mensaje de monto 0 viene de create_transaction');
select is(public.t_import_row('t.r1', 2) ->> 'error_code', '23514', 'CA-7: un error de datos (23514) rechaza la fila y el lote sigue');
select is(public.t_import_row('t.r1', 3) ->> 'status', 'rejected', 'CA-7: fila sin account_id es rechazada');
select is(public.t_import_row('t.r1', 4) ->> 'status', 'rejected', 'CA-7: monto "abc" es rechazado');
select is(public.t_import_row('t.r1', 4) ->> 'error_code', '22P02', 'CA-7: monto "abc" falla por texto no numérico (22P02)');
select is(public.t_import_row('t.r1', 5) ->> 'status', 'rejected', 'CA-7: categoría archivada es rechazada');
select ok(public.t_import_row('t.r1', 5) ->> 'error_message' like 'la categoría no existe, no es tuya o está archivada%', 'CA-7 / §5: mensaje de categoría archivada (contrato del cliente)');
select is(public.t_import_row('t.r1', 6) ->> 'status', 'rejected', 'CA-7: fecha futura es rechazada');
select is(public.t_import_row('t.r1', 6) ->> 'error_message', 'FR-06: la fecha no puede ser posterior a hoy', 'CA-7 / FR-06: mensaje de fecha futura');
select is(public.t_import_row('t.r1', 7) ->> 'status', 'rejected', 'CA-7 / C7: cuenta de otro usuario es rechazada');
select is(public.t_import_row('t.r1', 7) ->> 'error_message', 'la cuenta no existe, no es tuya o está archivada', 'CA-7 / C7: mensaje de cuenta ajena, sin revelar datos');
select is((select count(*) from transactions where user_id in ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')), 1::bigint, 'CA-7: las 6 rechazadas no dejan transacción');
select is((select count(*) from ledger_entries where user_id in ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')), 1::bigint, 'CA-7 / C4: las 6 rechazadas no dejan imputaciones');
select results_eq($$select sent_rows, imported_rows from imports where id = '11111111-0000-0000-0000-000000000001'$$,
  $$values (7, 1)$$, 'sent_rows e imported_rows quedan guardados en imports');

-- ---------------------------------------------------------------------------
-- US-78 CA-2: idempotencia por p_import_id.
-- ---------------------------------------------------------------------------
select lives_ok($q$select set_config('t.r1b', import_transactions('11111111-0000-0000-0000-000000000001', jsonb_build_array(
  jsonb_build_object('row',1,'type','expense','amount','1000.00','currency','ARS','category_id','c0000000-0000-0000-0000-000000000001','account_id','a0000000-0000-0000-0000-000000000003','installments_count',1,'occurred_on','2026-09-03','description','válida')
))::text, true)$q$, 'US-78 CA-2: repetir el mismo p_import_id no falla');
select is(current_setting('t.r1b')::jsonb ->> 'already_imported', 'true', 'US-78 CA-2: la repetición devuelve already_imported = true');
select is(public.t_import_row('t.r1b', 1) ->> 'transaction_id', public.t_import_row('t.r1', 1) ->> 'transaction_id', 'US-78 CA-2: devuelve el mismo transaction_id');
select is((current_setting('t.r1b')::jsonb - 'already_imported'), (current_setting('t.r1')::jsonb - 'already_imported'), 'US-78 CA-2: el resultado guardado es idéntico al de la primera llamada');
select is((select count(*) from transactions where user_id in ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')), 1::bigint, 'US-78 CA-2: las filas se crean una sola vez');
select is((select count(*) from imports where user_id in ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')), 1::bigint, 'US-78 CA-2: queda un solo registro en imports');

-- Un id de otro usuario.
set local request.jwt.claims = '{"sub":"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb","role":"authenticated"}';
select throws_ok($q$select import_transactions('11111111-0000-0000-0000-000000000001', jsonb_build_array(
  jsonb_build_object('row',1,'type','expense','amount','10.00','currency','ARS','category_id','c0000000-0000-0000-0000-000000000003','account_id','a0000000-0000-0000-0000-000000000002','installments_count',1,'occurred_on','2026-09-03')))$q$,
  '23514', 'el identificador de la importación no es válido', 'US-78 CA-2 / C7: el id de otro usuario se rechaza sin revelar datos');
select is((select count(*) from transactions where user_id in ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')), 0::bigint, 'US-78 CA-2 / C7: B no tiene transacciones tras el intento');
reset role;
select is((select count(*) from transactions where user_id in ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')), 1::bigint, 'US-78 CA-2 / C7: el intento de B no creó nada (solo la de A)');
select results_eq($$select user_id, sent_rows, imported_rows from imports where id = '11111111-0000-0000-0000-000000000001'$$,
  $$values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 7, 1)$$, 'US-78 CA-2 / C7: la importación de A no cambió');

-- ---------------------------------------------------------------------------
-- CA-8: el lote se rechaza entero.
-- ---------------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';
select throws_ok($$select import_transactions('22222222-0000-0000-0000-000000000001', '[]'::jsonb)$$, '23514', null, 'CA-8: p_rows con 0 elementos es rechazado');
select throws_ok($$select import_transactions('22222222-0000-0000-0000-000000000002', (select jsonb_agg('{}'::jsonb) from generate_series(1, 501)))$$, '23514', null, 'CA-8: p_rows con 501 elementos es rechazado');
select throws_ok($$select import_transactions(null, '[{"row":1}]'::jsonb)$$, '23514', null, 'CA-8: p_import_id null es rechazado');
select throws_ok($$select import_transactions('22222222-0000-0000-0000-000000000003', '{"row":1}'::jsonb)$$, '23514', null, 'CA-8: p_rows que es un objeto (no array) es rechazado');
select throws_ok($$select import_transactions('22222222-0000-0000-0000-000000000004', '"texto"'::jsonb)$$, '23514', null, 'CA-8: p_rows que es un string es rechazado');
select throws_ok($$select import_transactions('22222222-0000-0000-0000-000000000005', null)$$, '23514', null, 'CA-8: p_rows null es rechazado');
select is((select count(*) from imports where user_id in ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')), 1::bigint, 'CA-8: ningún lote rechazado dejó fila en imports');
select is((select count(*) from transactions where user_id in ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')), 1::bigint, 'CA-8: ningún lote rechazado creó transacciones');
select lives_ok($$select import_transactions('22222222-0000-0000-0000-000000000006', (select jsonb_agg(jsonb_build_object('row', g)) from generate_series(1, 500) g))$$, 'CA-8 (borde): 500 filas es el máximo aceptado');
select results_eq($$select sent_rows, imported_rows from imports where id = '22222222-0000-0000-0000-000000000006'$$, $$values (500, 0)$$, 'CA-8 (borde): las 500 filas vacías se rechazan una por una (imported_rows = 0)');

-- ---------------------------------------------------------------------------
-- C3 / I1 / I1': la suma de las imputaciones = el monto; la última cuota absorbe el resto.
-- ---------------------------------------------------------------------------
select lives_ok($q$select set_config('t.r3', import_transactions('33333333-0000-0000-0000-000000000001', jsonb_build_array(
  jsonb_build_object('row',1,'type','expense','amount','240000.00','currency','ARS','category_id','c0000000-0000-0000-0000-000000000001','account_id','a0000000-0000-0000-0000-000000000001','installments_count',6,'occurred_on','2026-09-03'),
  jsonb_build_object('row',2,'type','expense','amount','12.50','currency','USD','fx_rate','1450','category_id','c0000000-0000-0000-0000-000000000001','account_id','a0000000-0000-0000-0000-000000000003','installments_count',1,'occurred_on','2026-09-03'),
  jsonb_build_object('row',3,'type','expense','amount',100.00,'currency','ARS','category_id','c0000000-0000-0000-0000-000000000001','account_id','a0000000-0000-0000-0000-000000000001','installments_count',3,'occurred_on','2026-09-03')
))::text, true)$q$, 'C3: el lote con cuotas, USD y resto se importa');
select is((current_setting('t.r3')::jsonb ->> 'imported_rows')::int, 3, 'C3: las 3 filas se importan');
select results_eq(
  $$select amount, period from ledger_entries where transaction_id = (public.t_import_row('t.r3', 1) ->> 'transaction_id')::uuid order by installment_number$$,
  $$values (40000.00::numeric, '2026-09-01'::date), (40000.00, '2026-10-01'), (40000.00, '2026-11-01'), (40000.00, '2026-12-01'), (40000.00, '2027-01-01'), (40000.00, '2027-02-01')$$,
  'I1: 240000.00 en 6 cuotas son 6 imputaciones de 40000.00, de 2026-09 a 2027-02');
select is((select sum(amount) from ledger_entries where transaction_id = (public.t_import_row('t.r3', 1) ->> 'transaction_id')::uuid), 240000.00::numeric, 'I1: la suma de las 6 imputaciones es 240000.00');
select is((select sum(amount_ars) from ledger_entries where transaction_id = (public.t_import_row('t.r3', 1) ->> 'transaction_id')::uuid), 240000.00::numeric, 'I1'': la suma de amount_ars es 240000.00');
select is((select amount_ars from transactions where id = (public.t_import_row('t.r3', 2) ->> 'transaction_id')::uuid), 18125.00::numeric, 'I1'': USD 12.50 a 1450 deja amount_ars 18125.00');
select is((select sum(amount_ars) from ledger_entries where transaction_id = (public.t_import_row('t.r3', 2) ->> 'transaction_id')::uuid), 18125.00::numeric, 'I1'': la imputación del gasto en USD suma 18125.00');
select is((select fx_rate from transactions where id = (public.t_import_row('t.r3', 2) ->> 'transaction_id')::uuid), 1450.0000::numeric, 'C5: el tipo de cambio queda congelado en la transacción');
select results_eq(
  $$select amount from ledger_entries where transaction_id = (public.t_import_row('t.r3', 3) ->> 'transaction_id')::uuid order by installment_number$$,
  $$values (33.33::numeric), (33.33), (33.34)$$,
  'I1: 100.00 en 3 cuotas son 33.33, 33.33 y 33.34 (la última absorbe el resto)');
select is((select sum(amount) from ledger_entries where transaction_id = (public.t_import_row('t.r3', 3) ->> 'transaction_id')::uuid), 100.00::numeric, 'I1: el monto numérico del JSON se lee exacto y suma 100.00');
select results_eq($$select sent_rows, imported_rows from imports where id = '33333333-0000-0000-0000-000000000001'$$, $$values (3, 3)$$, 'sent_rows e imported_rows de un lote completo quedan guardados');

-- ---------------------------------------------------------------------------
-- C7: par RLS de imports.
-- ---------------------------------------------------------------------------
select is((select count(*) from imports where id = '11111111-0000-0000-0000-000000000001'), 1::bigint, 'C7: el dueño ve su importación');
select is((select count(*) from transactions where id = (public.t_import_row('t.r1', 1) ->> 'transaction_id')::uuid), 1::bigint, 'C7: el dueño ve su transacción importada');
set local request.jwt.claims = '{"sub":"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb","role":"authenticated"}';
select is((select count(*) from imports where user_id in ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')), 0::bigint, 'C7: otra sesión ve 0 filas de imports');
select is((select count(*) from imports where id = '11111111-0000-0000-0000-000000000001'), 0::bigint, 'C7: pedir por id una importación ajena da vacío, no error');
select is((select count(*) from transactions where user_id in ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')), 0::bigint, 'C7: otra sesión ve 0 transacciones importadas');
select throws_ok($$insert into imports (id, user_id, sent_rows) values ('44444444-0000-0000-0000-000000000001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 1)$$, '42501', null, 'C7: authenticated no inserta directo en imports');
select throws_ok($$update imports set sent_rows = 1$$, '42501', null, 'C7: authenticated no actualiza imports');
select throws_ok($$delete from imports$$, '42501', null, 'C7: authenticated no borra de imports');
reset role;
select is((select count(*) from imports where id = '11111111-0000-0000-0000-000000000001'), 1::bigint, 'C7: la importación de A sigue intacta tras los intentos');

set local role anon;
select throws_ok($$select * from imports$$, '42501', null, 'C7: anon no puede hacer select en imports');
select throws_ok($$select import_transactions('55555555-0000-0000-0000-000000000001', '[{"row":1}]'::jsonb)$$, '42501', null, 'C7: anon no ejecuta import_transactions');
reset role;

-- Un registro de imports sin resultado guardado (result null): el reintento no falla y devuelve already_imported.
insert into imports (id, user_id, sent_rows) values ('66666666-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1);
set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';
select is((import_transactions('66666666-0000-0000-0000-000000000001', '[{"row":1}]'::jsonb)) ->> 'already_imported', 'true', 'US-78 CA-2: un id ya reservado sin resultado guardado devuelve already_imported = true, sin error');
reset role;

-- Sin sesión (authenticated sin sub): la RPC rechaza con 42501.
set local role authenticated;
set local request.jwt.claims = '{"role":"authenticated"}';
select throws_ok($$select import_transactions('55555555-0000-0000-0000-000000000002', '[{"row":1}]'::jsonb)$$, '42501', null, 'C7: sin auth.uid() la RPC rechaza con 42501');
reset role;
select is((select count(*) from imports where id = '55555555-0000-0000-0000-000000000002'), 0::bigint, 'C7: el intento sin sesión no dejó registro');

select * from finish();
rollback;
