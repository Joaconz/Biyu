-- C7 / NFR-13: para cada tabla, otra sesión y el rol anon ven cero filas y no pueden escribir
-- sobre filas ajenas. Además las tablas de solo-RPC no aceptan escritura directa (C4, C10).
begin;
select plan(34);

-- Datos ficticios (C14). A es el dueño; B es otra sesión.
insert into auth.users (id, instance_id, aud, role, email) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','00000000-0000-0000-0000-000000000000','authenticated','authenticated','a@test.local'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b@test.local');

insert into categories (id, user_id, name) values ('c0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Comida');
insert into accounts (id, user_id, name, type, currency) values ('a0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Visa','credit_card','ARS');
insert into fx_rates (user_id, period, ars_per_usd) values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','2026-08-01',1250);
insert into subscriptions (id, user_id, name, amount, currency, category_id, account_id, billing_day, start_period, generate_from_period)
  values ('50000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Netflix',5000,'ARS','c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',5,'2026-08-01','2026-08-01');
insert into transactions (id, user_id, type, amount, currency, category_id, account_id, first_period, occurred_on)
  values ('70000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','expense',1000,'ARS','c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','2026-08-01','2026-08-15');
insert into ledger_entries (user_id, transaction_id, period, installment_number, amount, amount_ars)
  values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','70000000-0000-0000-0000-000000000001','2026-08-01',1,1000,1000);
insert into debts (user_id, transaction_id, person, amount, currency, direction, incurred_on)
  values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','70000000-0000-0000-0000-000000000001','Sofía',500,'ARS','owed_to_me','2026-08-15');

-- Sanidad: el dueño sí ve sus filas.
set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';
select is((select count(*) from transactions), 1::bigint, 'el dueño ve su transacción');
select is((select count(*) from ledger_entries), 1::bigint, 'el dueño ve su imputación');

-- Otra sesión (B): cero filas en cada tabla.
set local request.jwt.claims = '{"sub":"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb","role":"authenticated"}';
select is((select count(*) from categories), 0::bigint, 'B no ve categories de A');
select is((select count(*) from accounts), 0::bigint, 'B no ve accounts de A');
select is((select count(*) from fx_rates), 0::bigint, 'B no ve fx_rates de A');
select is((select count(*) from subscriptions), 0::bigint, 'B no ve subscriptions de A');
select is((select count(*) from transactions), 0::bigint, 'B no ve transactions de A');
select is((select count(*) from ledger_entries), 0::bigint, 'B no ve ledger_entries de A');
select is((select count(*) from debts), 0::bigint, 'B no ve debts de A');
select is((select count(*) from transactions where id = '70000000-0000-0000-0000-000000000001'), 0::bigint, 'pedir por id una transacción ajena da vacío, no error');

-- B no puede modificar ni borrar filas de A (0 filas afectadas).
with u as (update categories set name = 'hack' returning 1) select is((select count(*) from u), 0::bigint, 'B no actualiza categories de A');
with u as (update accounts set name = 'hack' returning 1) select is((select count(*) from u), 0::bigint, 'B no actualiza accounts de A');
with u as (update fx_rates set ars_per_usd = 1 returning 1) select is((select count(*) from u), 0::bigint, 'B no actualiza fx_rates de A');
with u as (update subscriptions set name = 'hack' returning 1) select is((select count(*) from u), 0::bigint, 'B no actualiza subscriptions de A');
with u as (update debts set person = 'hack' returning 1) select is((select count(*) from u), 0::bigint, 'B no actualiza debts de A');
with d as (delete from categories returning 1) select is((select count(*) from d), 0::bigint, 'B no borra categories de A');
with d as (delete from debts returning 1) select is((select count(*) from d), 0::bigint, 'B no borra debts de A');

-- B no puede insertar filas a nombre de A.
select throws_ok($$insert into categories (user_id, name) values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','x')$$, '42501', null, 'B no inserta categories con user_id de A (RLS with check)');

-- transactions / ledger_entries: solo se escriben vía create_transaction (C4, C10).
select throws_ok($$insert into transactions (type, amount, currency, category_id, account_id, first_period, occurred_on) values ('expense',1,'ARS',null,'a0000000-0000-0000-0000-000000000001','2026-08-01','2026-08-01')$$, '42501', null, 'authenticated no inserta transactions directo');
select throws_ok($$update transactions set amount = 1$$, '42501', null, 'authenticated no actualiza transactions directo');
select throws_ok($$delete from transactions$$, '42501', null, 'authenticated no borra transactions directo');
select throws_ok($$insert into ledger_entries (transaction_id, period, installment_number, amount, amount_ars) values ('70000000-0000-0000-0000-000000000001','2026-08-01',9,1,1)$$, '42501', null, 'authenticated no inserta ledger_entries directo');
select throws_ok($$truncate transactions$$, '42501', null, 'authenticated no puede TRUNCATE (se salta RLS)');

-- Rol anon (sin sesión): sin privilegios sobre las tablas.
reset role;
set local role anon;
select throws_ok('select * from categories', '42501', null, 'anon no lee categories');
select throws_ok('select * from accounts', '42501', null, 'anon no lee accounts');
select throws_ok('select * from fx_rates', '42501', null, 'anon no lee fx_rates');
select throws_ok('select * from subscriptions', '42501', null, 'anon no lee subscriptions');
select throws_ok('select * from transactions', '42501', null, 'anon no lee transactions');
select throws_ok('select * from ledger_entries', '42501', null, 'anon no lee ledger_entries');
select throws_ok('select * from debts', '42501', null, 'anon no lee debts');
select throws_ok('select * from ledger_integrity_violations', '42501', null, 'anon no lee la vista de integridad');
select throws_ok($$insert into categories (name) values ('x')$$, '42501', null, 'anon no inserta');

-- Ninguna política es más laxa que user_id = auth.uid() (C7).
reset role;
select is((select count(*) from pg_policies where schemaname = 'public' and tablename in ('categories','accounts','fx_rates','subscriptions','transactions','ledger_entries','debts')
             and (qual is distinct from '(user_id = auth.uid())' or with_check is not null and with_check <> '(user_id = auth.uid())')
             and cmd <> 'INSERT'), 0::bigint, 'ninguna política USING es distinta de user_id = auth.uid()');
select is((select count(*) from pg_policies where schemaname = 'public' and cmd = 'INSERT' and with_check is distinct from '(user_id = auth.uid())'), 0::bigint, 'ninguna política INSERT es distinta de user_id = auth.uid()');

select * from finish();
rollback;
