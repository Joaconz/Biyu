-- US-88 (#330), ADR-044 §4: delete_subscription borra la suscripción y deja sus gastos como movimientos sueltos.
-- Datos ficticios; todo se revierte (ADR-015).
begin;
select plan(20);

insert into auth.users (id, instance_id, aud, role, email) values
  ('88a00000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us88a@test.local'),
  ('88b00000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us88b@test.local');
insert into categories (id, user_id, name) values
  ('c8800000-0000-0000-0000-000000000001','88a00000-0000-0000-0000-000000000001','Streaming');
insert into accounts (id, user_id, name, type, currency) values
  ('a8800000-0000-0000-0000-000000000001','88a00000-0000-0000-0000-000000000001','Visa','credit_card','ARS');
insert into subscriptions (id, user_id, name, amount, currency, category_id, account_id, billing_day,
                           start_period, generate_from_period, status, paused_at, cancelled_at) values
  ('d8800000-0000-0000-0000-000000000001','88a00000-0000-0000-0000-000000000001','Netflix', 5000.00, 'ARS',
   'c8800000-0000-0000-0000-000000000001','a8800000-0000-0000-0000-000000000001', 10, '2026-05-01', '2026-05-01', 'active', null, null),
  ('d8800000-0000-0000-0000-000000000002','88a00000-0000-0000-0000-000000000001','Vieja', 800.00, 'ARS',
   'c8800000-0000-0000-0000-000000000001','a8800000-0000-0000-0000-000000000001', 5, '2026-06-01', '2026-06-01', 'cancelled', null, now()),
  ('d8800000-0000-0000-0000-000000000003','88a00000-0000-0000-0000-000000000001','Pausada', 300.00, 'ARS',
   'c8800000-0000-0000-0000-000000000001','a8800000-0000-0000-0000-000000000001', 5, '2026-06-01', '2026-06-01', 'paused', now(), null);
select catch_up_subscriptions('88a00000-0000-0000-0000-000000000001', '2026-08-15');

-- Fixture: Netflix generó mayo a agosto (4 gastos)
select is((select count(*) from transactions where subscription_id = 'd8800000-0000-0000-0000-000000000001'), 4::bigint, 'fixture: Netflix generó 4 gastos');
select set_config('t.junio', (select id::text from transactions where subscription_id = 'd8800000-0000-0000-0000-000000000001'
  and subscription_period = '2026-06-01'), true);

set local role authenticated;
set local request.jwt.claims = '{"sub":"88a00000-0000-0000-0000-000000000001","role":"authenticated"}';
select public.delete_transaction(current_setting('t.junio')::uuid); -- uno de los gastos, dado de baja

create temp table ids as select id from transactions where subscription_id = 'd8800000-0000-0000-0000-000000000001';
create temp table before_state as
select coalesce(sum(le.amount), 0) as total from ledger_entries le where le.transaction_id in (select id from ids);

-- CA-1: se elimina una suscripción activa
select lives_ok($$select public.delete_subscription('d8800000-0000-0000-0000-000000000001')$$, 'CA-1: se elimina una suscripción activa');
select is((select count(*) from subscriptions where id = 'd8800000-0000-0000-0000-000000000001'), 0::bigint, 'CA-1: ya no existe');

-- Los gastos que generó quedan como movimientos sueltos
select is((select count(*) from transactions where id in (select id from ids)), 4::bigint, 'los 4 gastos siguen existiendo');
select is((select count(*) from transactions where id in (select id from ids) and subscription_id is null and subscription_period is null),
  4::bigint, 'ADR-044 §4: quedan sueltos (sin subscription_id ni subscription_period)');
select is((select coalesce(sum(le.amount), 0) from ledger_entries le where le.transaction_id in (select id from ids)),
  (select total from before_state), 'sus imputaciones y montos no cambian (los meses cerrados quedan igual)');
select is((select deleted_at is not null from transactions where id = current_setting('t.junio')::uuid), true,
  'el gasto que estaba dado de baja sigue dado de baja');
select lives_ok($$select public.restore_transaction(current_setting('t.junio')::uuid)$$, 'y se puede restaurar como un movimiento común');
select lives_ok($$select public.delete_transaction(current_setting('t.junio')::uuid)$$, 'volver a darlo de baja');

-- I11: la puesta al día no genera nada para una suscripción que ya no existe
reset role;
select is((catch_up_subscriptions('88a00000-0000-0000-0000-000000000001', '2026-08-15') ->> 'generated')::int, 0,
  'I11: la puesta al día no vuelve a generar los gastos de Netflix');

set local role authenticated;
set local request.jwt.claims = '{"sub":"88a00000-0000-0000-0000-000000000001","role":"authenticated"}';

-- CA-2: en cualquier estado
select lives_ok($$select public.delete_subscription('d8800000-0000-0000-0000-000000000002')$$, 'CA-2: se elimina una suscripción cancelada');
select lives_ok($$select public.delete_subscription('d8800000-0000-0000-0000-000000000003')$$, 'CA-2: y una pausada');
select is((select count(*) from subscriptions), 0::bigint, 'ya no queda ninguna');

-- El nombre queda libre
select lives_ok($$select public.create_subscription('Netflix', 5000, 'ARS', 'c8800000-0000-0000-0000-000000000001', 'a8800000-0000-0000-0000-000000000001', 10, '2026-10-01')$$,
  'CA-3: el nombre queda libre para crear otra suscripción igual');

-- CA-4: errores
select throws_ok($$select public.delete_subscription('d8800000-0000-0000-0000-000000000001')$$, 'PT404', 'Suscripción no encontrada',
  'CA-4: una segunda vez responde «no encontrada»');
select throws_ok($$select public.delete_subscription(null)$$, 'PT404', 'Suscripción no encontrada', 'un id nulo, lo mismo');

-- CA-5: autorización (C7)
reset role;
insert into subscriptions (id, user_id, name, amount, currency, category_id, account_id, billing_day, start_period, generate_from_period)
values ('d8800000-0000-0000-0000-0000000000a9','88a00000-0000-0000-0000-000000000001','De A', 100, 'ARS',
        'c8800000-0000-0000-0000-000000000001','a8800000-0000-0000-0000-000000000001', 1, '2026-09-01', '2026-09-01');
set local role authenticated;
set local request.jwt.claims = '{"sub":"88b00000-0000-0000-0000-000000000002","role":"authenticated"}';
select throws_ok($$select public.delete_subscription('d8800000-0000-0000-0000-0000000000a9')$$, 'PT404', 'Suscripción no encontrada',
  'CA-5: con la sesión de B, eliminar la suscripción de A responde «no encontrada»');
select throws_ok($$delete from public.subscriptions$$, '42501', null, 'ADR-030: no hay delete directo sobre subscriptions');
reset role;
select is((select count(*) from subscriptions where id = 'd8800000-0000-0000-0000-0000000000a9'), 1::bigint, 'CA-5: la suscripción de A sigue ahí');
set local role anon;
select throws_ok($$select public.delete_subscription('d8800000-0000-0000-0000-0000000000a9')$$, '42501', null, 'CA-5: anon no ejecuta delete_subscription');

select * from finish();
rollback;
