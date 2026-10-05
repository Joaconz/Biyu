-- DEF-007 (#148): restore_transaction deshace la baja lógica de delete_transaction.
begin;
select plan(8);

insert into auth.users (id, instance_id, aud, role, email) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','00000000-0000-0000-0000-000000000000','authenticated','authenticated','a@test.local'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b@test.local');
insert into categories (id, user_id, name) values
  ('c0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Comida');
insert into accounts (id, user_id, name, type, currency) values
  ('a0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Visa','credit_card','ARS');

set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

create temp table ids as
  select public.create_transaction('expense', 3000, 'ARS', null, 'c0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001', 3, '2026-08-15') as purchase,
         public.create_transaction('expense', 500, 'ARS', null, 'c0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001', 1, '2026-08-16') as active;
select public.delete_transaction((select purchase from ids));

select throws_ok(format('select public.restore_transaction(%L)', (select active from ids)),
  '23503', 'la transacción no existe, no está eliminada o no te pertenece',
  'una transacción que no está eliminada no se restaura');

set local request.jwt.claims = '{"sub":"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb","role":"authenticated"}';
select throws_ok(format('select public.restore_transaction(%L)', (select purchase from ids)),
  '23503', 'la transacción no existe, no está eliminada o no te pertenece',
  'otro usuario no puede restaurar la transacción de A');
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';
select isnt((select deleted_at from transactions where id = (select purchase from ids)), null,
  'después del intento de B, sigue eliminada');

select lives_ok(format('select public.restore_transaction(%L)', (select purchase from ids)),
  'A restaura su compra en cuotas');
select is((select deleted_at from transactions where id = (select purchase from ids)), null,
  'deleted_at vuelve a null');
select is((select count(*) from ledger_entries le join transactions t on t.id = le.transaction_id
  where t.id = (select purchase from ids) and t.deleted_at is null), 3::bigint,
  'sus 3 cuotas vuelven a contar (I10, US-18)');
select throws_ok(format('select public.restore_transaction(%L)', (select purchase from ids)),
  '23503', null, 'restaurarla de nuevo falla: ya no está eliminada');

set local role anon;
select throws_ok($$select public.restore_transaction('00000000-0000-0000-0000-000000000000')$$,
  '42501', null, 'anon no puede ejecutar restore_transaction');

select * from finish();
rollback;
