-- DEF-016 (#157), DEF-009 (#150) y DEF-019: ver 20261002000000_fix_db_defects.sql.
begin;
select plan(11);

insert into auth.users (id, instance_id, aud, role, email) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','00000000-0000-0000-0000-000000000000','authenticated','authenticated','a@test.local'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b@test.local');
insert into categories (id, user_id, name) values
  ('c0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Salud'),
  ('c0000000-0000-0000-0000-000000000002','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','Salud');
insert into accounts (id, user_id, name, type, currency) values
  ('a0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Visa','credit_card','ARS'),
  ('a0000000-0000-0000-0000-000000000002','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Master','credit_card','ARS'),
  ('a0000000-0000-0000-0000-000000000003','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Amex','credit_card','ARS');
insert into transactions (id, user_id, type, amount, currency, category_id, account_id, installments_count, first_period, occurred_on, deleted_at)
  values
  -- Visa: 3 cuotas activas. Master: solo de 1 cuota. Amex: 3 cuotas, pero con baja lógica.
  ('70000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','expense',3000,'ARS','c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',3,'2026-08-01','2026-08-15',null),
  ('70000000-0000-0000-0000-000000000002','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','expense',1000,'ARS','c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000002',1,'2026-08-01','2026-08-15',null),
  ('70000000-0000-0000-0000-000000000003','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','expense',3000,'ARS','c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000003',3,'2026-08-01','2026-08-15','2026-08-20');

set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

-- DEF-016: una deuda válida se acepta; I7 sigue rechazando las inválidas.
select lives_ok(
  $$insert into debts (user_id, transaction_id, person, amount, currency, direction, incurred_on)
    values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','70000000-0000-0000-0000-000000000002','Sofía',400,'ARS','owed_to_me','2026-08-15')$$,
  'una deuda vinculada válida se crea (DEF-016)');
select throws_ok(
  $$insert into debts (user_id, transaction_id, person, amount, currency, direction, incurred_on)
    values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','70000000-0000-0000-0000-000000000002','Juan',700,'ARS','owed_to_me','2026-08-15')$$,
  '23514', 'I7: la suma de las deudas supera el monto de la transacción',
  'I7 sigue rechazando que la suma de las deudas supere el gasto');
select throws_ok(
  $$insert into debts (user_id, transaction_id, person, amount, currency, fx_rate, direction, incurred_on)
    values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','70000000-0000-0000-0000-000000000002','Juan',1,'USD',1000,'owed_to_me','2026-08-15')$$,
  '23514', 'I7: la deuda debe tener la misma moneda que su transacción',
  'I7 sigue rechazando una moneda distinta a la de la transacción');
select is((select count(*) from debts), 1::bigint, 'solo quedó la deuda válida');
select throws_ok(
  $$select public.check_debt_rule()$$,
  '42501', null, 'authenticated no puede ejecutar check_debt_rule fuera del trigger');

-- DEF-009: no se puede sacar de credit_card una cuenta con compras en cuotas (I6).
select throws_ok(
  $$update accounts set type = 'cash' where id = 'a0000000-0000-0000-0000-000000000001'$$,
  '23514', 'I6: la cuenta tiene compras en cuotas, no puede dejar de ser tarjeta de crédito',
  'una cuenta con cuotas no deja de ser credit_card (DEF-009)');
select throws_ok(
  $$update accounts set type = 'debit_card' where id = 'a0000000-0000-0000-0000-000000000003'$$,
  '23514', null, 'las cuotas con baja lógica también cuentan para I6');
select lives_ok(
  $$update accounts set type = 'debit_card' where id = 'a0000000-0000-0000-0000-000000000002'$$,
  'una cuenta sin cuotas sí puede cambiar de tipo');
select lives_ok(
  $$update accounts set name = 'Visa Gold' where id = 'a0000000-0000-0000-0000-000000000001'$$,
  'renombrar una cuenta con cuotas sigue permitido');

-- DEF-019: el nombre activo es único sin distinguir mayúsculas, por usuario.
select throws_ok(
  $$insert into categories (user_id, name) values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','salud')$$,
  '23505', null, '"salud" choca con "Salud" activa (DEF-019)');
update categories set archived_at = now() where id = 'c0000000-0000-0000-0000-000000000001';
select lives_ok(
  $$insert into categories (user_id, name) values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','SALUD')$$,
  'con "Salud" archivada, el nombre se puede reutilizar en cualquier forma');

select * from finish();
rollback;
