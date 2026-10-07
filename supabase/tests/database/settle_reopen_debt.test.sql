-- US-39 (#229), ADR-037 §1 y §3: settle_debt y reopen_debt son la única vía para cambiar el estado
-- de una deuda. Fija CA-1 (saldar), CA-4 (reabrir), CA-6 (errores sin efecto) y CA-7 (sin UPDATE
-- directo). Datos ficticios; todo se revierte al final (ADR-015).
begin;
select plan(37);

insert into auth.users (id, instance_id, aud, role, email) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','00000000-0000-0000-0000-000000000000','authenticated','authenticated','a@test.local'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b@test.local');
insert into categories (id, user_id, name) values
  ('c0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Tecnología');
insert into accounts (id, user_id, name, type, currency) values
  ('a0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Visa','credit_card','ARS');

-- Deudas sueltas, insertadas por el dueño de la tabla (create_debt llega con US-36).
--   d1: pendiente de A en USD (para ver que fx_rate sobrevive); d2: ya saldada de A; d3: pendiente de B.
insert into debts (id, user_id, person, amount, currency, fx_rate, direction, status, settled_at, notes, incurred_on) values
  ('d0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Lucas',50.00,'USD',1200.0000,'owed_to_me','pending',null,'Entradas','2026-09-01'),
  ('d0000000-0000-0000-0000-000000000002','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Marta',7500.50,'ARS',null,'i_owe','settled','2026-09-05 12:00:00+00',null,'2026-09-02'),
  ('d0000000-0000-0000-0000-000000000003','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','Pedro',900.00,'ARS',null,'owed_to_me','pending',null,null,'2026-09-03');

set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

-- Dos gastos compartidos de A: tx1 queda vigente (deuda vinculada), tx2 se elimina.
select set_config('t.tx1', create_transaction(
  p_type => 'expense', p_amount => 120000, p_currency => 'ARS', p_fx_rate => null,
  p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => 'a0000000-0000-0000-0000-000000000001',
  p_installments_count => 1, p_occurred_on => '2026-08-15',
  p_shared_person => 'Sofía', p_shared_amount => 60000)::text, true);
select set_config('t.tx2', create_transaction(
  p_type => 'expense', p_amount => 30000, p_currency => 'ARS', p_fx_rate => null,
  p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => 'a0000000-0000-0000-0000-000000000001',
  p_installments_count => 1, p_occurred_on => '2026-08-16',
  p_shared_person => 'Juan', p_shared_amount => 10000)::text, true);
select set_config('t.dl', (select id::text from debts where transaction_id = current_setting('t.tx1')::uuid), true);
select set_config('t.dx', (select id::text from debts where transaction_id = current_setting('t.tx2')::uuid), true);
select delete_transaction(current_setting('t.tx2')::uuid);

-- Foto de las columnas que saldar/reabrir no deben tocar, de la suelta USD (d1) y la vinculada.
reset role;
create temp table orig on commit drop as
  select id, user_id, person, amount, amount_ars, currency, fx_rate, direction, incurred_on, notes, transaction_id, created_at
    from debts where id in ('d0000000-0000-0000-0000-000000000001', current_setting('t.dl')::uuid);
grant select on orig to authenticated;
set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

-- CA-1: saldar
select lives_ok($$select settle_debt('d0000000-0000-0000-0000-000000000001')$$, 'US-39 CA-1: settle_debt sobre una deuda pendiente se acepta');
select is((select status::text from debts where id = 'd0000000-0000-0000-0000-000000000001'), 'settled',
  'US-39 CA-1: la deuda queda con status = settled');
select isnt((select settled_at from debts where id = 'd0000000-0000-0000-0000-000000000001'), null,
  'US-39 CA-1 / I9: la deuda saldada tiene settled_at no nulo');
select is((select settled_at from debts where id = 'd0000000-0000-0000-0000-000000000001'), now(),
  'US-39 CA-1: settled_at es now() de la transacción (reloj del servidor, C1)');

-- CA-4: reabrir
select lives_ok($$select reopen_debt('d0000000-0000-0000-0000-000000000001')$$, 'US-39 CA-4: reopen_debt sobre una deuda saldada se acepta');
select is((select status::text from debts where id = 'd0000000-0000-0000-0000-000000000001'), 'pending',
  'US-39 CA-4: la deuda reabierta queda con status = pending');
select is((select settled_at from debts where id = 'd0000000-0000-0000-0000-000000000001'), null,
  'US-39 CA-4: la deuda reabierta tiene settled_at nulo');

-- Datos que se conservan, en una suelta USD y en una vinculada a un gasto
select lives_ok($$select settle_debt(current_setting('t.dl')::uuid)$$, 'US-39 CA-1: se salda la deuda vinculada a un gasto vigente');
select is((select status::text from debts where id = current_setting('t.dl')::uuid), 'settled',
  'US-39 CA-1: la deuda vinculada queda saldada');
select lives_ok($$select reopen_debt(current_setting('t.dl')::uuid)$$, 'US-39 CA-4: se reabre la deuda vinculada');
select results_eq(
  $$select id, user_id, person, amount, amount_ars, currency, fx_rate, direction, incurred_on, notes, transaction_id, created_at
      from debts where id in ('d0000000-0000-0000-0000-000000000001', current_setting('t.dl')::uuid) order by id$$,
  $$select * from orig order by id$$,
  'US-39: tras saldar y reabrir conserva id, persona, monto, moneda, fx_rate, fecha, nota y transaction_id');
select is((select fx_rate from debts where id = 'd0000000-0000-0000-0000-000000000001'), 1200.0000::numeric,
  'US-39: el tipo de cambio de la deuda USD no cambia al saldar y reabrir (C5)');

-- Saldar y reabrir 3 veces seguidas
select lives_ok($q$do $b$ begin
    for i in 1..3 loop
      perform settle_debt('d0000000-0000-0000-0000-000000000001');
      perform reopen_debt('d0000000-0000-0000-0000-000000000001');
    end loop;
  end $b$$q$, 'US-39: saldar y reabrir 3 veces seguidas se acepta');
select is((select status::text from debts where id = 'd0000000-0000-0000-0000-000000000001'), 'pending',
  'US-39: tras 3 ciclos saldar/reabrir la deuda termina pendiente');
select is((select settled_at from debts where id = 'd0000000-0000-0000-0000-000000000001'), null,
  'US-39 / I9: tras 3 ciclos settled_at es nulo');

-- Foto de todas las deudas antes de los casos de error (d2 saldada, el resto pendientes)
reset role;
create temp table snap on commit drop as select * from debts;
grant select on snap to authenticated;
set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

-- CA-6: settle_debt
select throws_ok($$select settle_debt('d0000000-0000-0000-0000-000000000002')$$, '23514', 'La deuda ya está saldada',
  'US-39 CA-6: settle_debt sobre una deuda ya saldada se rechaza');
select throws_ok($$select settle_debt('d0000000-0000-0000-0000-0000000000ff')$$, '23514', 'La deuda no existe',
  'US-39 CA-6: settle_debt con un id inexistente se rechaza');
select throws_ok($$select settle_debt('d0000000-0000-0000-0000-000000000003')$$, '23514', 'La deuda no existe',
  'US-39 CA-6: settle_debt sobre la deuda de otro usuario responde "no existe"');
select throws_ok($$select settle_debt(current_setting('t.dx')::uuid)$$, '23514', 'La deuda no existe',
  'US-39 CA-6: settle_debt sobre una deuda de un gasto eliminado responde "no existe"');
select throws_ok($$select settle_debt(null::uuid)$$, '23514', 'La deuda no existe',
  'US-39 CA-6: settle_debt con id nulo responde "no existe"');

-- CA-6: reopen_debt
select throws_ok($$select reopen_debt('d0000000-0000-0000-0000-000000000001')$$, '23514', 'La deuda ya está pendiente',
  'US-39 CA-6: reopen_debt sobre una deuda pendiente se rechaza');
select throws_ok($$select reopen_debt('d0000000-0000-0000-0000-0000000000ff')$$, '23514', 'La deuda no existe',
  'US-39 CA-6: reopen_debt con un id inexistente se rechaza');
select throws_ok($$select reopen_debt('d0000000-0000-0000-0000-000000000003')$$, '23514', 'La deuda no existe',
  'US-39 CA-6: reopen_debt sobre la deuda de otro usuario responde "no existe"');
select throws_ok($$select reopen_debt(current_setting('t.dx')::uuid)$$, '23514', 'La deuda no existe',
  'US-39 CA-6: reopen_debt sobre una deuda de un gasto eliminado responde "no existe"');
select throws_ok($$select reopen_debt(null::uuid)$$, '23514', 'La deuda no existe',
  'US-39 CA-6: reopen_debt con id nulo responde "no existe"');

-- Ningún rechazo cambió las filas de A
select results_eq($$select * from debts order by id$$,
  $$select * from snap where user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' order by id$$,
  'US-39 CA-6: ningún error cambió las deudas visibles para A');

-- CA-7: sin UPDATE directo
select throws_ok($$update debts set status = 'settled', settled_at = now() where id = 'd0000000-0000-0000-0000-000000000001'$$,
  '42501', null, 'US-39 CA-7: UPDATE directo de status y settled_at por authenticated es rechazado');
select throws_ok($$update debts set amount = 1 where id = 'd0000000-0000-0000-0000-000000000001'$$,
  '42501', null, 'US-39 CA-7: UPDATE directo de cualquier columna de debts es rechazado');
select results_eq($$select * from debts order by id$$,
  $$select * from snap where user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' order by id$$,
  'US-39 CA-7: el UPDATE rechazado no cambió ninguna fila');

-- Sesión de B: no puede saldar ni reabrir las deudas de A
set local request.jwt.claims = '{"sub":"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb","role":"authenticated"}';
select throws_ok($$select settle_debt('d0000000-0000-0000-0000-000000000001')$$, '23514', 'La deuda no existe',
  'US-39 CA-6 / C7: B no puede saldar una deuda de A');
select throws_ok($$select reopen_debt('d0000000-0000-0000-0000-000000000002')$$, '23514', 'La deuda no existe',
  'US-39 CA-6 / C7: B no puede reabrir una deuda de A');
select lives_ok($$select settle_debt('d0000000-0000-0000-0000-000000000003')$$,
  'US-39 CA-1: B sí salda su propia deuda (evita el falso verde de "todo se rechaza")');
select is((select status::text from debts where id = 'd0000000-0000-0000-0000-000000000003'), 'settled',
  'US-39 CA-1: la deuda de B quedó saldada');
select reopen_debt('d0000000-0000-0000-0000-000000000003');

-- Rol anon
reset role;
set local role anon;
set local request.jwt.claims = '{"role":"anon"}';
select throws_ok($$select settle_debt('d0000000-0000-0000-0000-000000000001')$$, '42501', null,
  'US-39 CA-6 / C7: anon no puede ejecutar settle_debt (42501)');
select throws_ok($$select reopen_debt('d0000000-0000-0000-0000-000000000002')$$, '42501', null,
  'US-39 CA-6 / C7: anon no puede ejecutar reopen_debt (42501)');
select throws_ok($$select settle_debt(null::uuid)$$, '42501', null,
  'US-39 CA-6 / C7: anon con id nulo tampoco ejecuta settle_debt (42501)');

-- Ninguno de los rechazos cambió filas (comparado con el dueño de la tabla, ve todas)
reset role;
select results_eq($$select * from debts order by id$$, $$select * from snap order by id$$,
  'US-39 CA-6: tras todos los rechazos (incluido anon) las deudas son idénticas a la foto previa');

select * from finish();
rollback;
