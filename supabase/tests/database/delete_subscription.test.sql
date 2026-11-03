-- US-88 (#330), ADR-044 §4: delete_subscription borra la suscripción (en cualquier estado) y deja sus
-- gastos como movimientos sueltos. Todas cobran el día 1, que siempre ya venció (cualquier día del mes).
begin;
select plan(18);

insert into auth.users (id, instance_id, aud, role, email) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','00000000-0000-0000-0000-000000000000','authenticated','authenticated','a@test.local'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b@test.local');
insert into categories (id, user_id, name) values
  ('c0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Streaming'),
  ('c0000000-0000-0000-0000-000000000002','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','Streaming');
insert into accounts (id, user_id, name, type, currency) values
  ('a0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Visa','credit_card','ARS'),
  ('a0000000-0000-0000-0000-000000000002','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','Visa de B','credit_card','ARS');

select set_config('t.cur', date_trunc('month', (now() at time zone 'America/Argentina/Buenos_Aires')::date)::date::text, true);

set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

-- Activa con tres meses generados (dos pasados y el corriente), uno dado de baja; una cancelada; una de control.
select set_config('t.s1', (create_subscription(p_name => 'Gimnasio', p_amount => 25000.50, p_currency => 'ARS',
  p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => 'a0000000-0000-0000-0000-000000000001',
  p_billing_day => 1, p_start_period => (current_setting('t.cur')::date - interval '2 months')::date) ->> 'subscription_id'), true);
select set_config('t.s2', (create_subscription(p_name => 'Spotify', p_amount => 4500, p_currency => 'ARS',
  p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => 'a0000000-0000-0000-0000-000000000001',
  p_billing_day => 1, p_start_period => current_setting('t.cur')::date) ->> 'subscription_id'), true);
select set_config('t.s3', (create_subscription(p_name => 'Control', p_amount => 100, p_currency => 'ARS',
  p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => 'a0000000-0000-0000-0000-000000000001',
  p_billing_day => 1, p_start_period => current_setting('t.cur')::date) ->> 'subscription_id'), true);
select cancel_subscription(current_setting('t.s2')::uuid);
select delete_transaction((select id from transactions where subscription_id = current_setting('t.s1')::uuid
  order by subscription_period limit 1));

create temp table before as
  select id, amount, amount_ars, occurred_on, category_id, account_id, deleted_at,
         (select sum(le.amount_ars) from ledger_entries le where le.transaction_id = t.id) as ledger
    from transactions t where subscription_id = current_setting('t.s1')::uuid;
select is((select count(*) from before), 3::bigint, 'la activa generó tres gastos');

-- CA-1/CA-2: se borra la activa; devuelve cuántos quedaron sueltos
select is((select delete_subscription(current_setting('t.s1')::uuid) ->> 'detached')::int, 3,
  'devuelve detached = 3 (incluido el dado de baja)');
select is((select count(*) from subscriptions where id = current_setting('t.s1')::uuid), 0::bigint, 'la suscripción ya no existe');
select is((select count(*) from transactions where id in (select id from before) and subscription_id is null and subscription_period is null),
  3::bigint, 'los tres gastos quedan sueltos (subscription_id y subscription_period en nulo)');
select is((select count(*) from transactions t join before b using (id)
  where t.amount = b.amount and t.amount_ars = b.amount_ars and t.occurred_on = b.occurred_on
    and t.category_id = b.category_id and t.account_id = b.account_id and t.deleted_at is not distinct from b.deleted_at),
  3::bigint, 'el resto de las columnas no cambia (C5)');
select is((select count(*) from transactions t join before b using (id)
  where (select sum(le.amount_ars) from ledger_entries le where le.transaction_id = t.id) is not distinct from b.ledger),
  3::bigint, 'las imputaciones no cambian: los meses cerrados quedan igual');
select isnt((select deleted_at from transactions where id = (select id from before where deleted_at is not null)), null,
  'la baja lógica de uno de ellos sigue');

-- CA-2: la puesta al día no genera nada más
reset role;
select is((catch_up_subscriptions('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', current_setting('t.cur')::date + 5) ->> 'generated')::int,
  0, 'tras borrar, la puesta al día no regenera nada de la borrada (la de control ya estaba al día)');
select is((select count(*) from transactions where subscription_id is null
  and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 3::bigint, 'siguen los tres sueltos y no apareció ninguno nuevo');
set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

-- Cancelada y de control
select lives_ok(format('select delete_subscription(%L)', current_setting('t.s2')), 'también se borra una cancelada');
select is((select count(*) from subscriptions where user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 1::bigint, 'queda solo la de control');
select is((select count(*) from transactions where subscription_id = current_setting('t.s3')::uuid), 1::bigint, 'la de control conserva su gasto');

-- Inexistente y otra sesión (C7): mismo PT404
select throws_ok(format('select delete_subscription(%L)', current_setting('t.s1')), 'PT404', 'Suscripción no encontrada',
  'borrar dos veces responde no encontrada');
reset role;
insert into subscriptions (id, user_id, name, amount, currency, category_id, account_id, billing_day, start_period, generate_from_period)
  values ('5b000000-0000-0000-0000-000000000001','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','De B',100,'ARS',
    'c0000000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000002',1,'2026-10-01','2026-10-01');
set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';
select throws_ok($$select delete_subscription('5b000000-0000-0000-0000-000000000001')$$, 'PT404', 'Suscripción no encontrada',
  'la de otro usuario responde no encontrada');
reset role;
select is((select count(*) from subscriptions where id = '5b000000-0000-0000-0000-000000000001'), 1::bigint, 'la de B sigue ahí');

set local role anon;
select throws_ok($$select delete_subscription('5b000000-0000-0000-0000-000000000001')$$, '42501', null, 'anon no puede ejecutar delete_subscription');
reset role;
set local role authenticated;
set local request.jwt.claims = '{"sub":"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb","role":"authenticated"}';
select is((select count(*) from subscriptions), 1::bigint, 'B ve solo su suscripción (cero filas de A)');
select is((select count(*) from transactions where subscription_id is null), 0::bigint, 'B no ve los movimientos sueltos de A');

select * from finish();
rollback;
