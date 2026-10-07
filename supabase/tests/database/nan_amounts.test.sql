-- DEF-004 (Crítica, #145): 'NaN'::numeric > 0 es verdadero en Postgres, así que un check
-- "amount > 0" no lo rechaza. create_transaction() ya se cubre en create_transaction.test.sql;
-- acá se cubren debts (por create_debt, US-36: ya no hay insert directo, ADR-037 §1) y subscriptions
-- (ya sin insert directo, ADR-030: el CHECK se prueba como dueño de la tabla). fx_rates ya tenía su propio test en upsert_fx_rate.test.sql. ledger_entries
-- también quedó protegida por el mismo constraint (ver la migración), pero authenticated no tiene
-- INSERT directo ahí (C4, C10: solo vía RPC) y por eso no hay caso equivalente acá.
begin;
select plan(5);

insert into auth.users (id, instance_id, aud, role, email) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','00000000-0000-0000-0000-000000000000','authenticated','authenticated','a@test.local');
insert into categories (id, user_id, name) values
  ('c0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Comida');
insert into accounts (id, user_id, name, type, currency) values
  ('a0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Visa','credit_card','ARS');
insert into transactions (id, user_id, type, amount, currency, category_id, account_id, first_period, occurred_on)
  values ('70000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','expense',1000,'ARS','c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','2026-08-01','2026-08-15');

set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

select throws_ok(
  $$select create_debt('owed_to_me', 'Sofía', 'NaN', 'ARS', null, '2026-08-15')$$,
  '23514', 'I4: el monto debe ser mayor a cero', 'debts.amount NaN se rechaza (DEF-004, I4)');
select throws_ok(
  $$select create_debt('owed_to_me', 'Sofía', 1, 'USD', 'NaN', '2026-08-15')$$,
  '23514', 'I5: fx_rate debe ser mayor a cero', 'debts.fx_rate NaN se rechaza (DEF-004, I5)');
select is((select count(*) from debts), 0::bigint, 'ningún debt NaN quedó insertado');

-- subscriptions ya no acepta insert directo (ADR-030): el CHECK sigue como red final y se prueba
-- como dueño de la tabla. create_subscription con NaN está en create_subscription.test.sql.
reset role;
select throws_ok(
  $$insert into subscriptions (user_id, name, amount, currency, category_id, account_id, billing_day, start_period, generate_from_period)
    values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Netflix','NaN','ARS','c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',5,'2026-08-01','2026-08-01')$$,
  '23514', null, 'subscriptions.amount NaN se rechaza (DEF-004, I4)');
select is((select count(*) from subscriptions where user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 0::bigint, 'ninguna subscription NaN quedó insertada');

select * from finish();
rollback;
