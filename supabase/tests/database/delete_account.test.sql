-- DEF-011 (#152): delete_account borra la cuenta con todo lo que cuelga de ella (ADR-026).
begin;
select plan(13);

insert into auth.users (id, instance_id, aud, role, email) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','00000000-0000-0000-0000-000000000000','authenticated','authenticated','a@test.local'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b@test.local');
insert into categories (id, user_id, name) values
  ('c0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Comida'),
  ('c0000000-0000-0000-0000-000000000002','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','Comida');
insert into accounts (id, user_id, name, type, currency) values
  ('a0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Visa','credit_card','ARS'),
  ('a0000000-0000-0000-0000-000000000002','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Efectivo','cash','ARS'),
  ('a0000000-0000-0000-0000-000000000003','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','Visa de B','credit_card','ARS');

set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

-- Visa: una compra en 3 cuotas, un gasto con deuda vinculada y uno con baja lógica. Efectivo: un gasto.
select public.create_transaction('expense', 3000, 'ARS', null, 'c0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001', 3, '2026-08-15');
select public.create_transaction('expense', 1000, 'ARS', null, 'c0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001', 1, '2026-08-16', p_shared_person => 'Sofía', p_shared_amount => 400);
select public.delete_transaction(public.create_transaction('expense', 500, 'ARS', null,
  'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 1, '2026-08-17'));
select public.create_transaction('expense', 200, 'ARS', null, 'c0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000002', 1, '2026-08-18');

select is((select count(*) from debts), 1::bigint, 'antes de borrar, la cuenta tiene su deuda vinculada');

-- Otro usuario no puede borrar la cuenta de A, ni A la de B.
set local request.jwt.claims = '{"sub":"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb","role":"authenticated"}';
select throws_ok($$select public.delete_account('a0000000-0000-0000-0000-000000000001')$$,
  '23503', 'la cuenta no existe o no te pertenece', 'B no puede borrar la cuenta de A');
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';
select throws_ok($$select public.delete_account('a0000000-0000-0000-0000-000000000003')$$,
  '23503', 'la cuenta no existe o no te pertenece', 'A no puede borrar la cuenta de B');

select is(public.delete_account('a0000000-0000-0000-0000-000000000001'), 3,
  'devuelve cuántas transacciones borró, contando la que tenía baja lógica');
select is((select count(*) from accounts where id = 'a0000000-0000-0000-0000-000000000001'), 0::bigint,
  'la cuenta ya no existe (borrado físico, no archivada)');
select is((select count(*) from transactions where account_id = 'a0000000-0000-0000-0000-000000000001'), 0::bigint,
  'sus transacciones tampoco, incluida la de baja lógica');
select is((select count(*) from ledger_entries le join transactions t on t.id = le.transaction_id
  where t.account_id = 'a0000000-0000-0000-0000-000000000001'), 0::bigint, 'ni sus imputaciones');
select is((select count(*) from ledger_entries), 1::bigint, 'solo queda la imputación del gasto en Efectivo');
select is((select count(*) from debts), 0::bigint, 'la deuda vinculada también se borró');
select is((select count(*) from transactions where account_id = 'a0000000-0000-0000-0000-000000000002'), 1::bigint,
  'las transacciones de otra cuenta quedan intactas');

reset role;
select is((select count(*) from accounts where id = 'a0000000-0000-0000-0000-000000000003'), 1::bigint,
  'la cuenta de B sigue ahí');

set local role anon;
select throws_ok($$select public.delete_account('a0000000-0000-0000-0000-000000000002')$$,
  '42501', null, 'anon no puede ejecutar delete_account');
reset role;
select is((select count(*) from accounts where id = 'a0000000-0000-0000-0000-000000000002'), 1::bigint,
  'después del intento de anon, Efectivo sigue ahí');

select * from finish();
rollback;
