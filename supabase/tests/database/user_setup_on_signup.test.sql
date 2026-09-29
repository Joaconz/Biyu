-- DEF-022 (ADR-025): la cuenta nueva nace con el setup pendiente (fila con completed_at null) y
-- la cuenta anterior a US-68 no tiene fila, que la app lee como "setup hecho". Sin esta
-- distinción, a todo el que ya tenía cuenta se le exigía el setup de nuevo.
begin;
select plan(7);

select has_trigger('auth', 'users', 'on_auth_user_created_setup', 'auth.users crea la fila de setup al registrarse');

insert into auth.users (id, instance_id, aud, role, email) values
  ('cccccccc-cccc-cccc-cccc-cccccccccccc','00000000-0000-0000-0000-000000000000','authenticated','authenticated','c@test.local');

select is(
  (select count(*) from user_setup where user_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
  1::bigint, 'la cuenta nueva tiene su fila de setup');
select is(
  (select completed_at from user_setup where user_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
  null, 'y el setup arranca pendiente');

-- El cliente completa con upsert (sirve también para una cuenta vieja que reabre el setup).
set local role authenticated;
set local request.jwt.claims = '{"sub":"cccccccc-cccc-cccc-cccc-cccccccccccc","role":"authenticated"}';
select lives_ok(
  $$insert into user_setup (usage_reason, completed_at) values ('cuotas', now())
    on conflict (user_id) do update set usage_reason = excluded.usage_reason, completed_at = excluded.completed_at$$,
  'C completa su setup con upsert sobre la fila que creó la base');
select isnt((select completed_at from user_setup), null, 'queda completado');

-- Una cuenta anterior a US-68: se simula borrando su fila, como si el trigger no hubiera existido.
reset role;
insert into auth.users (id, instance_id, aud, role, email) values
  ('dddddddd-dddd-dddd-dddd-dddddddddddd','00000000-0000-0000-0000-000000000000','authenticated','authenticated','d@test.local');
delete from user_setup where user_id = 'dddddddd-dddd-dddd-dddd-dddddddddddd';

set local role authenticated;
set local request.jwt.claims = '{"sub":"dddddddd-dddd-dddd-dddd-dddddddddddd","role":"authenticated"}';
select is((select count(*) from user_setup), 0::bigint, 'la cuenta vieja no tiene fila (la app la deja entrar)');
select lives_ok(
  $$insert into user_setup (completed_at) values (now())
    on conflict (user_id) do update set completed_at = excluded.completed_at$$,
  'la cuenta vieja puede completar el setup si lo reabre desde Ajustes');

select * from finish();
rollback;
