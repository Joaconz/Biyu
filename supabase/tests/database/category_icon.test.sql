-- ADR-055: categories.icon acepta null o una clave kebab-case de hasta 40 caracteres, y la RLS de
-- categories no cambia (C7): cada usuario escribe solo las suyas, anon no ve nada.
begin;
select plan(15);

insert into auth.users (id, instance_id, aud, role, email) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','00000000-0000-0000-0000-000000000000','authenticated','authenticated','a@test.local'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b@test.local');
insert into categories (id, user_id, name, icon) values
  ('c0000000-0000-0000-0000-0000000000b1','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','De B','paw-print');

set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

-- Claves válidas y null
select lives_ok($$insert into categories (id, name, icon) values ('c0000000-0000-0000-0000-000000000001', 'Mascotas', 'paw-print')$$,
  'una clave kebab-case se guarda');
select lives_ok($$insert into categories (id, name) values ('c0000000-0000-0000-0000-000000000002', 'Sin ícono')$$,
  'sin ícono (null) sigue siendo válido');
select lives_ok($$insert into categories (name, icon) values ('Dígitos', 'a1-b2')$$, 'los dígitos entran');
select lives_ok($$insert into categories (name, icon) values ('Largo', repeat('a', 40))$$, '40 caracteres es el máximo');
select lives_ok($$update categories set icon = 'cat' where id = 'c0000000-0000-0000-0000-000000000001'$$,
  'cambiar el ícono de una categoría propia anda');
select lives_ok($$update categories set icon = null where id = 'c0000000-0000-0000-0000-000000000001'$$,
  'volver a sin ícono anda');

-- Formas rechazadas (23514 = check_violation)
select throws_ok($$insert into categories (name, icon) values ('Mayúsculas', 'Paw')$$, '23514', null, 'las mayúsculas no entran');
select throws_ok($$insert into categories (name, icon) values ('Espacio', 'paw print')$$, '23514', null, 'un espacio no entra');
select throws_ok($$insert into categories (name, icon) values ('Vacío', '')$$, '23514', null, 'la cadena vacía no entra');
select throws_ok($$insert into categories (name, icon) values ('Larga', repeat('a', 41))$$, '23514', null, '41 caracteres no entran');
select throws_ok($$update categories set icon = '<script>' where id = 'c0000000-0000-0000-0000-000000000001'$$, '23514', null,
  'tampoco al editar');

select throws_ok($$insert into categories (name, icon) values ('Salto', 'paw' || E'\n')$$, '23514', null, 'un salto de línea final no entra');

-- C7: la categoría de B ni se ve ni se cambia desde A
select is((select count(*) from categories where id = 'c0000000-0000-0000-0000-0000000000b1'), 0::bigint, 'A no ve la categoría de B');
with u as (update categories set icon = 'cat' where id = 'c0000000-0000-0000-0000-0000000000b1' returning 1)
select is((select count(*) from u), 0::bigint, 'A no cambia el ícono de B');

reset role;
set local role anon;
select throws_ok($$select count(*) from categories$$, '42501', null, 'anon no puede leer categories');

select * from finish();
rollback;
