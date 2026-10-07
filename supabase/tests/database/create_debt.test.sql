-- US-36 (#226), ADR-037 §1 y §2: create_debt es la única vía para crear una deuda suelta. Fija
-- CA-2 (alta), CA-3 (i_owe), CA-4 (USD), CA-6 (bordes de monto), CA-7 (fecha, persona, nota),
-- CA-8 (rechazos con mensaje exacto y sin filas), CA-9 (sin INSERT ni DELETE directos) y los CHECK
-- debts_person_length / debts_notes_length. Datos ficticios; todo se revierte al final (ADR-015).
-- La base local puede tener datos de desarrollo: todo conteo filtra por el user_id del test.
begin;
select plan(48);

insert into auth.users (id, instance_id, aud, role, email) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','00000000-0000-0000-0000-000000000000','authenticated','authenticated','a@test.local'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b@test.local');
select set_config('t.today', (now() at time zone 'America/Argentina/Buenos_Aires')::date::text, true);

set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

-- CA-2
select set_config('t.d1', create_debt('owed_to_me','Juan',20000,'ARS',null,current_setting('t.today')::date)::text, true);
select is((select count(*) from debts where id = current_setting('t.d1')::uuid and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 1::bigint, 'US-36 CA-2: create_debt devuelve el id de la fila creada');
select is((select transaction_id from debts where id = current_setting('t.d1')::uuid and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), null::uuid, 'US-36 CA-2: la deuda suelta tiene transaction_id nulo');
select is((select direction::text from debts where id = current_setting('t.d1')::uuid and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 'owed_to_me', 'US-36 CA-2: direction = owed_to_me');
select is((select status::text from debts where id = current_setting('t.d1')::uuid and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 'pending', 'US-36 CA-2: status = pending');
select is((select currency::text from debts where id = current_setting('t.d1')::uuid and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 'ARS', 'US-36 CA-2: currency = ARS');
select is((select fx_rate from debts where id = current_setting('t.d1')::uuid and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), null::numeric, 'US-36 CA-2: fx_rate nulo en ARS');
select is((select amount from debts where id = current_setting('t.d1')::uuid and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 20000.00::numeric, 'US-36 CA-2: amount = 20000.00');
select is((select incurred_on from debts where id = current_setting('t.d1')::uuid and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), current_setting('t.today')::date, 'US-36 CA-2: incurred_on = hoy en Argentina');
select is((select notes from debts where id = current_setting('t.d1')::uuid and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), null::text, 'US-36 CA-2: sin nota queda notes nulo');
select is((select user_id from debts where id = current_setting('t.d1')::uuid), auth.uid(), 'US-36 CA-2: user_id sale de auth.uid()');
-- CA-3
select set_config('t.d2', create_debt('i_owe','Marta',500,'ARS',null,current_setting('t.today')::date)::text, true);
select is((select direction::text from debts where id = current_setting('t.d2')::uuid and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 'i_owe', 'US-36 CA-3: con i_owe se guarda i_owe');
-- CA-4
select set_config('t.d3', create_debt('owed_to_me','Lucas',40,'USD',1250,current_setting('t.today')::date)::text, true);
select is((select fx_rate from debts where id = current_setting('t.d3')::uuid and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 1250.0000::numeric, 'US-36 CA-4: USD guarda fx_rate 1250.0000');
select is((select amount_ars from debts where id = current_setting('t.d3')::uuid and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 50000.00::numeric, 'US-36 CA-4: USD 40 a 1250 da amount_ars 50000.00');
-- CA-6
select set_config('t.d4', create_debt('owed_to_me','Ana',0.01,'USD',0.5,current_setting('t.today')::date)::text, true);
select is((select amount_ars from debts where id = current_setting('t.d4')::uuid and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 0.01::numeric, 'US-36 CA-6: USD 0.01 a 0.5 se acepta con amount_ars 0.01');
select set_config('t.d5', create_debt('owed_to_me','Ana',0.01,'ARS',null,current_setting('t.today')::date)::text, true);
select is((select amount from debts where id = current_setting('t.d5')::uuid and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 0.01::numeric, 'US-36 CA-6: ARS 0.01 se acepta');
select set_config('t.d6', create_debt('owed_to_me','Ana',999999999999.99,'ARS',null,current_setting('t.today')::date)::text, true);
select is((select amount from debts where id = current_setting('t.d6')::uuid and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 999999999999.99::numeric, 'US-36 CA-6: ARS 999999999999.99 se acepta');
-- CA-7
select set_config('t.d7', create_debt('owed_to_me','Ana',100,'ARS',null,'2025-12-31')::text, true);
select is((select incurred_on from debts where id = current_setting('t.d7')::uuid and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), '2025-12-31'::date, 'US-36 CA-7: una fecha pasada se acepta');
select set_config('t.d8', create_debt('owed_to_me',repeat('a',60),100,'ARS',null,current_setting('t.today')::date)::text, true);
select is((select char_length(person) from debts where id = current_setting('t.d8')::uuid and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 60, 'US-36 CA-7: una persona de 60 caracteres se acepta');
select set_config('t.d9', create_debt('owed_to_me',E'  Ana\t',100,'ARS',null,current_setting('t.today')::date)::text, true);
select is((select person from debts where id = current_setting('t.d9')::uuid and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 'Ana', 'US-36 CA-7: la persona se recorta (espacios y tab alrededor de Ana guardan Ana)');
select set_config('t.d10', create_debt('owed_to_me',E'\u00a0Ana\u00a0',100,'ARS',null,current_setting('t.today')::date)::text, true);
select is((select person from debts where id = current_setting('t.d10')::uuid and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 'Ana', 'US-36 CA-7: la persona se recorta también con NBSP');
select set_config('t.d11', create_debt('owed_to_me','Ana',100,'ARS',null,current_setting('t.today')::date,E'  hola\t')::text, true);
select is((select notes from debts where id = current_setting('t.d11')::uuid and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 'hola', 'US-36 CA-7: la nota se recorta');
select set_config('t.d12', create_debt('owed_to_me','Ana',100,'ARS',null,current_setting('t.today')::date,'')::text, true);
select is((select notes from debts where id = current_setting('t.d12')::uuid and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), null::text, 'US-36 CA-7: una nota vacía se guarda como null');
select set_config('t.d13', create_debt('owed_to_me','Ana',100,'ARS',null,current_setting('t.today')::date,'   ')::text, true);
select is((select notes from debts where id = current_setting('t.d13')::uuid and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), null::text, 'US-36 CA-7: una nota de solo espacios se guarda como null');
select set_config('t.d14', create_debt('owed_to_me','Ana',100,'ARS',null,current_setting('t.today')::date,repeat('n',200))::text, true);
select is((select char_length(notes) from debts where id = current_setting('t.d14')::uuid and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 200, 'US-36 CA-7: una nota de 200 caracteres se acepta');

-- C7: B no ve las deudas de A
set local request.jwt.claims = '{"sub":"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb","role":"authenticated"}';
select is((select count(*) from debts where id = current_setting('t.d1')::uuid), 0::bigint,
  'US-36 C7: la deuda creada por A no es visible para B');
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

-- Foto de las deudas de los usuarios de prueba antes de los rechazos
reset role;
create temp table snap on commit drop as
  select * from debts where user_id in ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

-- CA-8

select throws_ok($$select create_debt('owed_to_me','',100,'ARS',null,current_setting('t.today')::date)$$, '23514', 'Ingresá el nombre de la persona',
  'US-36 CA-8: persona vacía es rechazada');
select throws_ok($$select create_debt('owed_to_me','   ',100,'ARS',null,current_setting('t.today')::date)$$, '23514', 'Ingresá el nombre de la persona',
  'US-36 CA-8: persona de solo espacios es rechazada');
select throws_ok($$select create_debt('owed_to_me',E'\t',100,'ARS',null,current_setting('t.today')::date)$$, '23514', 'Ingresá el nombre de la persona',
  'US-36 CA-8: persona de solo tab es rechazada');
select throws_ok($$select create_debt('owed_to_me',repeat('a',61),100,'ARS',null,current_setting('t.today')::date)$$, '23514', 'La persona admite hasta 60 caracteres',
  'US-36 CA-8: persona de 61 caracteres es rechazada');
select throws_ok($$select create_debt('owed_to_me','Ana',0,'ARS',null,current_setting('t.today')::date)$$, '23514', 'I4: el monto debe ser mayor a cero',
  'US-36 CA-8: I4: monto 0 es rechazado');
select throws_ok($$select create_debt('owed_to_me','Ana',1.001,'ARS',null,current_setting('t.today')::date)$$, '23514', 'I4: el monto admite hasta 2 decimales',
  'US-36 CA-8: I4: monto con 3 decimales es rechazado');
select throws_ok($$select create_debt('owed_to_me','Ana','NaN'::numeric,'ARS',null,current_setting('t.today')::date)$$, '23514', 'I4: el monto debe ser mayor a cero',
  'US-36 CA-8: I4: monto NaN es rechazado');
select throws_ok($$select create_debt('owed_to_me','Ana',100,'USD',null,current_setting('t.today')::date)$$, '23514', 'I5: fx_rate es obligatorio si y solo si la moneda es USD',
  'US-36 CA-8: I5: USD sin tipo de cambio es rechazado');
select throws_ok($$select create_debt('owed_to_me','Ana',100,'ARS',1200,current_setting('t.today')::date)$$, '23514', 'I5: fx_rate es obligatorio si y solo si la moneda es USD',
  'US-36 CA-8: I5: ARS con tipo de cambio es rechazado');
select throws_ok($$select create_debt('owed_to_me','Ana',1,'USD',10000000000,current_setting('t.today')::date)$$, '23514', 'El tipo de cambio es demasiado grande',
  'US-36 CA-8: fx_rate 10000000000 es rechazado');
select throws_ok($$select create_debt('owed_to_me','Ana',1000000000,'USD',1000,current_setting('t.today')::date)$$, '23514', 'En pesos daría más que el máximo de $999.999.999.999,99',
  'US-36 CA-8: USD que en pesos supera el máximo es rechazado');
select throws_ok($$select create_debt('owed_to_me','Ana',0.01,'USD',0.4,current_setting('t.today')::date)$$, '23514', 'I4: en pesos daría menos de $0,01',
  'US-36 CA-8: USD que en pesos redondea a 0,00 es rechazado');
select throws_ok($$select create_debt('owed_to_me','Ana',100,'ARS',null,current_setting('t.today')::date + 1)$$, '23514', 'La fecha no puede ser posterior a hoy',
  'US-36 CA-8: fecha de mañana (Argentina) es rechazada');
select throws_ok($$select create_debt('owed_to_me','Ana',100,'ARS',null,null)$$, '23514', 'La fecha es obligatoria',
  'US-36 CA-8: fecha nula es rechazada');
select throws_ok($$select create_debt('owed_to_me','Ana',100,'ARS',null,current_setting('t.today')::date,repeat('n',201))$$, '23514', 'La nota admite hasta 200 caracteres',
  'US-36 CA-8: nota de 201 caracteres es rechazada');
select throws_ok($$select create_debt(null,'Ana',100,'ARS',null,current_setting('t.today')::date)$$, '23514', 'Dirección y moneda son obligatorias',
  'US-36 CA-8: dirección nula es rechazada');

-- CA-9: sin INSERT ni DELETE directos
select throws_ok($$insert into debts (user_id, person, amount, currency, direction, incurred_on)
  values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Directo',100,'ARS','owed_to_me', current_date)$$,
  '42501', null, 'US-36 CA-9: INSERT directo en debts por authenticated es rechazado');
select throws_ok($$delete from debts where id = current_setting('t.d1')::uuid$$,
  '42501', null, 'US-36 CA-9: DELETE directo en debts por authenticated es rechazado');

-- Rol anon
reset role;
set local role anon;
set local request.jwt.claims = '{"role":"anon"}';
select throws_ok($$select create_debt('owed_to_me','Ana',100,'ARS',null,current_setting('t.today')::date)$$, '42501', null,
  'US-36 CA-8 / C7: anon con un pedido válido no ejecuta create_debt (42501)');

-- Ningún rechazo creó ni cambió filas (comparado con el dueño de la tabla)
reset role;
select results_eq(
  $$select * from debts where user_id in ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb') order by id$$,
  $$select * from snap order by id$$,
  'US-36 CA-8 / CA-9: tras todos los rechazos las deudas de los usuarios de prueba son idénticas a la foto previa');

-- CHECK de la tabla (como dueño, sin pasar por la RPC)
select throws_ok($$insert into debts (user_id, person, amount, currency, direction, incurred_on)
  values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','   ',100,'ARS','owed_to_me','2026-01-01')$$,
  '23514', null, 'US-36 ADR-037 §2: debts_person_length rechaza una persona de solo espacios');
select throws_ok($$insert into debts (user_id, person, amount, currency, direction, incurred_on, notes)
  values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Ana',100,'ARS','owed_to_me','2026-01-01', repeat('n',201))$$,
  '23514', null, 'US-36 ADR-037 §2: debts_notes_length rechaza una nota de 201 caracteres');
select lives_ok($$insert into debts (user_id, person, amount, currency, direction, incurred_on, notes)
  values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',repeat('a',60),100,'ARS','owed_to_me','2026-01-01', repeat('n',200))$$,
  'US-36 ADR-037 §2: persona de 60 y nota de 200 caracteres pasan los CHECK (borde válido)');

select * from finish();
rollback;
