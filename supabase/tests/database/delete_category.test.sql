-- US-89 (#331), ADR-044 §5: delete_category borra solo categorías sin uso.
begin;
select plan(13);

insert into auth.users (id, instance_id, aud, role, email) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','00000000-0000-0000-0000-000000000000','authenticated','authenticated','a@test.local'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b@test.local');
insert into categories (id, user_id, name, archived_at) values
  ('c0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Comida', null),
  ('c0000000-0000-0000-0000-000000000002','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Sin uso', null),
  ('c0000000-0000-0000-0000-000000000003','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Vieja', now()),
  ('c0000000-0000-0000-0000-000000000004','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Con baja', null),
  ('c0000000-0000-0000-0000-000000000005','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Con suscripción', null),
  ('c0000000-0000-0000-0000-0000000000b1','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','De B', null);
insert into accounts (id, user_id, name, type, currency) values
  ('a0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Efectivo','cash','ARS');

set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

select public.create_transaction('expense', 100, 'ARS', null, 'c0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001', 1, '2026-08-15');
select public.delete_transaction(public.create_transaction('expense', 200, 'ARS', null,
  'c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 1, '2026-08-16'));
select create_subscription(p_name => 'Spotify', p_amount => 4500, p_currency => 'ARS',
  p_category_id => 'c0000000-0000-0000-0000-000000000005', p_account_id => 'a0000000-0000-0000-0000-000000000001',
  p_billing_day => 1, p_start_period => (date_trunc('month', now()) + interval '2 months')::date);

-- CA-2: con uso rechaza, dice cuántos y no borra
select throws_ok($$select public.delete_category('c0000000-0000-0000-0000-000000000001')$$,
  '23514', 'La categoría tiene 1 movimiento y 0 suscripciones. Archivala si no la querés ver más.',
  'con un movimiento activo no se borra');
select throws_ok($$select public.delete_category('c0000000-0000-0000-0000-000000000004')$$,
  '23514', 'La categoría tiene 1 movimiento y 0 suscripciones. Archivala si no la querés ver más.',
  'un movimiento dado de baja también cuenta como uso');
select throws_ok($$select public.delete_category('c0000000-0000-0000-0000-000000000005')$$,
  '23514', 'La categoría tiene 0 movimientos y 1 suscripción. Archivala si no la querés ver más.',
  'una suscripción también cuenta como uso');
select is((select count(*) from categories where user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 5::bigint,
  'los rechazos no borraron nada');

-- CA-1: sin uso se borra (activa, archivada)
select lives_ok($$select public.delete_category('c0000000-0000-0000-0000-000000000002')$$, 'una activa sin uso se borra');
select lives_ok($$select public.delete_category('c0000000-0000-0000-0000-000000000003')$$, 'una archivada sin uso se borra');
select is((select count(*) from categories where id in
  ('c0000000-0000-0000-0000-000000000002','c0000000-0000-0000-0000-000000000003')), 0::bigint, 'ya no existen');

-- CA-4: el nombre queda libre
select lives_ok($$insert into categories (name) values ('Sin uso')$$, 'el nombre borrado se puede volver a crear');

-- Inexistente: PT404
select throws_ok($$select public.delete_category('c0000000-0000-0000-0000-0000000000ff')$$,
  'PT404', 'Categoría no encontrada', 'una inexistente responde no encontrada');

-- CA-3 (C7): la de otro usuario no se borra y responde igual que una inexistente
select throws_ok($$select public.delete_category('c0000000-0000-0000-0000-0000000000b1')$$,
  'PT404', 'Categoría no encontrada', 'otra sesión: no encontrada');
reset role;
select is((select count(*) from categories where id = 'c0000000-0000-0000-0000-0000000000b1'), 1::bigint,
  'la categoría de B sigue ahí');

-- C7: anon
set local role anon;
select throws_ok($$select public.delete_category('c0000000-0000-0000-0000-000000000001')$$,
  '42501', null, 'anon no puede ejecutar delete_category');
reset role;
set local role authenticated;
set local request.jwt.claims = '{"sub":"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb","role":"authenticated"}';
select is((select count(*) from categories), 1::bigint, 'B ve solo su categoría (cero filas de A)');

select * from finish();
rollback;
