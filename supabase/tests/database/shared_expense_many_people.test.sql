-- US-82 (#270), ADR-040: create_transaction con p_shared_persons / p_shared_amounts (hasta 10 personas).
-- Cubre US-82 CA-2, CA-5, CA-14 y CA-15: una deuda por persona en la misma llamada (C4), el orden de
-- validación de ADR-040 §2, el tope de la suma (ARS y, en USD, en pesos) y que un rechazo no deja filas.
begin;
select plan(32);

insert into auth.users (id, instance_id, aud, role, email) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','00000000-0000-0000-0000-000000000000','authenticated','authenticated','a@test.local');
insert into categories (id, user_id, name) values
  ('c0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Salidas');
insert into accounts (id, user_id, name, type, currency) values
  ('a0000000-0000-0000-0000-000000000002','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Efectivo','cash','ARS');

-- Gasto en ARS o USD con las deudas dadas (arreglos como literal JSON para poder mandar largos distintos).
create function public.t_share(d text, amt numeric, cur text, fx numeric, persons text[], amounts numeric[], typ text default 'expense')
returns uuid language sql as $$
  select create_transaction(
    p_type => typ::transaction_type, p_amount => amt, p_currency => cur::currency_code, p_fx_rate => fx,
    p_category_id => case when typ = 'expense' then 'c0000000-0000-0000-0000-000000000001'::uuid end,
    p_account_id => 'a0000000-0000-0000-0000-000000000002', p_installments_count => 1,
    p_occurred_on => '2026-08-15', p_description => d,
    p_shared_persons => persons, p_shared_amounts => amounts) $$;

set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

-- CA-2: 120000 con Sofía y Juan por 40000 cada uno: una transacción y dos deudas vinculadas.
select lives_ok($$select set_config('t.ca2', t_share('CA-2', 120000, 'ARS', null, array['Sofía','Juan'], array[40000,40000])::text, true)$$, 'CA-2: dos personas se guardan');
select is((select count(*) from debts where transaction_id = current_setting('t.ca2')::uuid), 2::bigint, 'CA-2: dos deudas vinculadas al gasto');
select results_eq($$select person, amount, direction::text, status::text, incurred_on from debts order by person$$,
  $$values ('Juan'::text, 40000.00::numeric, 'owed_to_me'::text, 'pending'::text, '2026-08-15'::date), ('Sofía', 40000.00, 'owed_to_me', 'pending', '2026-08-15')$$,
  'CA-2: cada deuda owed_to_me, pending, con la fecha del gasto');
select is((select count(distinct created_at) from debts), 1::bigint, 'ADR-040 §5: todas comparten created_at');

-- CA-5: diez personas se guardan.
select lives_ok($$select t_share('diez', 1000, 'ARS', null, (select array_agg('P' || g) from generate_series(1,10) g), (select array_agg(100::numeric) from generate_series(1,10) g))$$, 'CA-5: diez personas se guardan');
select is((select count(*) from debts d join transactions t on t.id = d.transaction_id where t.description = 'diez'), 10::bigint, 'CA-5: diez deudas');

-- Suma igual al gasto: se acepta. Un centavo más: se rechaza (CA-4, CA-14).
select lives_ok($$select t_share('igual', 120000, 'ARS', null, array['A','B'], array[60000,60000])$$, 'CA-4: la suma igual al gasto se acepta');
select throws_ok($$select t_share('mas', 120000, 'ARS', null, array['A','B'], array[60000,60000.01])$$, '23514', 'I7: la suma de las deudas no puede superar el monto del gasto', 'CA-14: un centavo más se rechaza');
-- Una persona: el mensaje de siempre.
select throws_ok($$select t_share('una', 1000, 'ARS', null, array['A'], array[1000.01])$$, '23514', 'I7: la deuda no puede superar el monto del gasto', 'Una persona: mensaje de US-41');

-- Orden de validación de ADR-040 §2.
select throws_ok($$select create_transaction(p_type => 'expense', p_amount => 100, p_currency => 'ARS', p_fx_rate => null,
  p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => 'a0000000-0000-0000-0000-000000000002',
  p_installments_count => 1, p_occurred_on => '2026-08-15', p_shared_persons => array['A']::text[])$$,
  '23514', 'Un gasto compartido necesita una persona y un monto por cada deuda', 'CA-14: solo p_shared_persons');
select throws_ok($$select t_share('x', 100, 'ARS', null, array['A','B'], array[10])$$, '23514', 'Un gasto compartido necesita una persona y un monto por cada deuda', 'CA-14: 2 personas y 1 monto');
select throws_ok($$select t_share('x', 100, 'ARS', null, array[]::text[], array[]::numeric[])$$, '23514', 'Un gasto compartido necesita al menos una persona', 'CA-14: arreglos vacíos');
select throws_ok($$select t_share('x', 100000, 'ARS', null, (select array_agg('P' || g) from generate_series(1,11) g), (select array_agg(1::numeric) from generate_series(1,11) g))$$, '23514', 'Un gasto se comparte con hasta 10 personas', 'CA-14: 11 personas');
select throws_ok($$select t_share('x', 100, 'ARS', null, array['Sofía','SOFÍA'], array[10,10])$$, '23514', 'Cada persona puede aparecer una sola vez', 'CA-14: persona repetida con otra mayúscula');
select throws_ok($$select t_share('x', 100, 'ARS', null, array['Sofía',' sofía '], array[10,10])$$, '23514', 'Cada persona puede aparecer una sola vez', 'La repetida se compara después del recorte');
select throws_ok($$select t_share('x', 100, 'ARS', null, array['A','   '], array[10,10])$$, '23514', 'Ingresá con quién compartiste el gasto', 'CA-14: segunda persona vacía');
select throws_ok($$select t_share('x', 100, 'ARS', null, array['A','B'], array[10,0])$$, '23514', 'I4: el monto de la deuda debe ser mayor a cero', 'Un monto en cero');
select throws_ok($$select t_share('x', 100, 'ARS', null, array['A','B'], array[10,1.001])$$, '23514', 'I4: el monto de la deuda admite hasta 2 decimales', 'Un monto con tres decimales');
select throws_ok($$select t_share('x', 100, 'ARS', null, array[repeat('b', 61),'B'], array[10,10])$$, '23514', 'La persona admite hasta 60 caracteres', 'Una persona de 61 caracteres');
select throws_ok($$select t_share('x', 100, 'ARS', null, array['A','B'], array[10, null])$$, '23514', 'Un gasto compartido necesita una persona y un monto por cada deuda', 'Un monto nulo en el arreglo');

-- Un ingreso con deudas, o con 11 personas: informa el primer error del orden.
select throws_ok($$select t_share('x', 100, 'ARS', null, array['A'], array[10], 'income')$$, '23514', 'Un ingreso no se puede compartir', 'CA-14: ingreso con deudas');
select throws_ok($$select t_share('x', 100000, 'ARS', null, (select array_agg('P' || g) from generate_series(1,11) g), (select array_agg(1::numeric) from generate_series(1,11) g), 'income')$$, '23514', 'Un ingreso no se puede compartir', 'CA-14: ingreso con 11 personas');

-- USD: tope en pesos por redondeo (ADR-040 §2, punto 8). US$3,00 a TC 1000,005 con tres deudas de US$1.
select throws_ok($$select t_share('usd', 3, 'USD', 1000.005, array['A','B','C'], array[1,1,1])$$, '23514', 'I7: en pesos, la suma de las deudas supera el gasto por redondeo', 'CA-14: la suma en pesos supera el gasto');
select lives_ok($$select t_share('usd ok', 100, 'USD', 1250, array['A','B'], array[40,60])$$, 'USD: la suma igual al gasto se acepta');
select results_eq($$select d.person, d.amount, d.currency::text, d.fx_rate, d.amount_ars from debts d join transactions t on t.id = d.transaction_id where t.description = 'usd ok' order by d.person$$,
  $$values ('A'::text, 40.00::numeric, 'USD'::text, 1250.0000::numeric, 50000.00::numeric), ('B', 60.00, 'USD', 1250.0000, 75000.00)$$,
  'USD: cada deuda hereda moneda y tipo de cambio y su amount_ars');

-- C4: un rechazo no deja filas (ni el gasto ni la primera deuda).
select is((select count(*) from transactions where description in ('x','mas','una','usd')), 0::bigint, 'C4: los rechazos no dejan transacciones');
select is((select count(*) from debts where person in ('B','C') and amount in (10, 1)), 0::bigint, 'C4: los rechazos no dejan deudas sueltas');

-- CA-15 / compatibilidad: sin arreglos, un gasto sin deudas.
select lives_ok($$select create_transaction(p_type => 'expense', p_amount => 100, p_currency => 'ARS', p_fx_rate => null,
  p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => 'a0000000-0000-0000-0000-000000000002',
  p_installments_count => 1, p_occurred_on => '2026-08-15', p_description => 'sin deudas')$$, 'Sin arreglos, el gasto se guarda');
select is((select count(*) from debts d join transactions t on t.id = d.transaction_id where t.description = 'sin deudas'), 0::bigint, 'Sin arreglos no hay deudas');

-- Compra empezada con deudas (ADR-039 §3).
select throws_ok($$select create_transaction(p_type => 'expense', p_amount => 120000, p_currency => 'ARS', p_fx_rate => null,
  p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => 'a0000000-0000-0000-0000-000000000002',
  p_installments_count => 6, p_occurred_on => '2026-08-15', p_installments_paid => 1,
  p_shared_persons => array['A','B'], p_shared_amounts => array[1,1])$$, '23514', null, 'Una compra empezada no se comparte (o falla antes por la cuenta)');

-- Otra sesión no ve las deudas (C7) y anon no ejecuta la RPC.
set local request.jwt.claims = '{"sub":"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb","role":"authenticated"}';
select is((select count(*) from debts), 0::bigint, 'C7: otra sesión ve cero deudas');
set local role anon;
select throws_ok($$select create_transaction(p_type => 'expense', p_amount => 100, p_currency => 'ARS', p_fx_rate => null,
  p_category_id => null, p_account_id => null, p_installments_count => 1, p_occurred_on => '2026-08-15',
  p_shared_persons => array['A'], p_shared_amounts => array[1])$$, '42501', null, 'C7: anon no ejecuta create_transaction');

select * from finish();
rollback;
