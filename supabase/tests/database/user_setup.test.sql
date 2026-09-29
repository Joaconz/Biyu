-- user_setup (C7, ADR-025): cada usuario ve y escribe solo su propia fila; anon no ve nada.
begin;
select plan(10);

insert into auth.users (id, instance_id, aud, role, email) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','00000000-0000-0000-0000-000000000000','authenticated','authenticated','a@test.local'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b@test.local');

set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

select is((select count(*) from user_setup), 0::bigint, 'sin fila todavía: no hizo el setup');

select lives_ok(
  $$insert into user_setup (usage_reason) values ('entender en qué se me va la plata')$$,
  'A crea su fila sin mandar user_id (default auth.uid())');
select is((select user_id from user_setup), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'user_id queda el de A');
select is((select completed_at from user_setup), null, 'todavía no está completado');

select lives_ok(
  $$update user_setup set completed_at = now() where user_id = auth.uid()$$,
  'A completa su propio setup');
select isnt((select completed_at from user_setup), null, 'completed_at queda seteado');

select throws_ok(
  $$insert into user_setup (user_id) values ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')$$,
  '42501', null, 'A no puede insertar una fila a nombre de B');

-- B es otra sesión: no ve la fila de A.
reset role;
set local role authenticated;
set local request.jwt.claims = '{"sub":"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb","role":"authenticated"}';
select is((select count(*) from user_setup), 0::bigint, 'B no ve la fila de A');
with u as (update user_setup set completed_at = now() returning 1) select is((select count(*) from u), 0::bigint, 'B no puede actualizar la fila de A');

-- anon no tiene política: cero acceso.
reset role;
set local role anon;
select throws_ok('select * from user_setup', '42501', null, 'anon no lee user_setup');

select * from finish();
rollback;
