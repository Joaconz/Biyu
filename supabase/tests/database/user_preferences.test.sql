-- US-101 (#371), ADR-047: user_preferences (C7). Cada usuario ve y escribe solo su fila; anon no ve nada.
begin;
select plan(14);

insert into auth.users (id, instance_id, aud, role, email) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','00000000-0000-0000-0000-000000000000','authenticated','authenticated','a@test.local'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b@test.local');

set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

select is((select count(*) from user_preferences), 0::bigint, 'sin fila al principio: valen los predeterminados');
select lives_ok($$insert into user_preferences (balance_reimbursements) values (true)$$, 'A guarda su fila (user_id sale de auth.uid())');
select results_eq(
  $$select user_id, balance_loose_debts, balance_reimbursements, balance_pending_subscriptions from user_preferences$$,
  $$values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, true, true, false)$$,
  'los predeterminados son: deudas sueltas sí, reembolsos y suscripciones no');
select lives_ok($$update user_preferences set balance_loose_debts = false, balance_pending_subscriptions = true where user_id = auth.uid()$$, 'A cambia sus opciones');
select results_eq(
  $$select balance_loose_debts, balance_reimbursements, balance_pending_subscriptions from user_preferences$$,
  $$values (false, true, true)$$, 'los cambios quedan guardados');
select throws_ok($$insert into user_preferences (user_id) values ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')$$, '42501', null, 'A no puede insertar una fila a nombre de B');
select throws_ok($$insert into user_preferences (balance_loose_debts) values (null)$$, '23502', null, 'una opción no puede ser nula');
select throws_ok($$delete from user_preferences$$, '42501', null, 'nadie borra su fila directo');

-- B es otra sesión: no ve ni cambia la fila de A.
reset role;
set local role authenticated;
set local request.jwt.claims = '{"sub":"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb","role":"authenticated"}';
select is((select count(*) from user_preferences), 0::bigint, 'B no ve la fila de A');
with u as (update user_preferences set balance_loose_debts = true where user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' returning 1)
  select is((select count(*) from u), 0::bigint, 'B no puede actualizar la fila de A');
select lives_ok($$insert into user_preferences default values$$, 'B guarda la suya');
select is((select count(*) from user_preferences), 1::bigint, 'B ve solo la suya');

-- anon no tiene política ni privilegio: cero acceso.
reset role;
set local role anon;
select throws_ok('select * from user_preferences', '42501', null, 'anon no lee user_preferences');
select throws_ok($$insert into user_preferences (user_id) values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')$$, '42501', null, 'anon no escribe en user_preferences');

select * from finish();
rollback;
