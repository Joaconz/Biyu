-- US-85 (#328), ADR-044 §1-§2: purge_transaction borra para siempre un movimiento ya dado de baja, con sus
-- imputaciones y su deuda vinculada; nunca uno activo ni la ocurrencia de una suscripción (C4, C7, C10).
-- Datos ficticios; todo se revierte (ADR-015).
begin;
select plan(24);

insert into auth.users (id, instance_id, aud, role, email) values
  ('85a00000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us85a@test.local'),
  ('85b00000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us85b@test.local');
insert into categories (id, user_id, name) values
  ('c8500000-0000-0000-0000-000000000001','85a00000-0000-0000-0000-000000000001','Comida'),
  ('c8500000-0000-0000-0000-0000000000b1','85b00000-0000-0000-0000-000000000002','Ajena');
insert into accounts (id, user_id, name, type, currency) values
  ('a8500000-0000-0000-0000-000000000001','85a00000-0000-0000-0000-000000000001','Visa','credit_card','ARS'),
  ('a8500000-0000-0000-0000-0000000000b1','85b00000-0000-0000-0000-000000000002','Efectivo B','cash','ARS');
insert into subscriptions (id, user_id, name, amount, currency, category_id, account_id, billing_day,
                           start_period, generate_from_period, status) values
  ('d8500000-0000-0000-0000-000000000001','85a00000-0000-0000-0000-000000000001','Netflix', 5000.00, 'ARS',
   'c8500000-0000-0000-0000-000000000001','a8500000-0000-0000-0000-000000000001', 10,
   '2026-07-01', '2026-07-01', 'active');
select catch_up_subscriptions('85a00000-0000-0000-0000-000000000001', '2026-08-15');
select set_config('t.occ', (select id::text from transactions where subscription_id = 'd8500000-0000-0000-0000-000000000001'
  and subscription_period = '2026-07-01'), true);

set local role authenticated;
set local request.jwt.claims = '{"sub":"85a00000-0000-0000-0000-000000000001","role":"authenticated"}';

create temp table tx as
select
  public.create_transaction('expense', 30000, 'ARS', null, 'c8500000-0000-0000-0000-000000000001',
    'a8500000-0000-0000-0000-000000000001', 3, '2026-08-15') as cuotas,
  public.create_transaction('expense', 40000, 'ARS', null, 'c8500000-0000-0000-0000-000000000001',
    'a8500000-0000-0000-0000-000000000001', 1, '2026-08-16', null, 'Sofía', 15000) as compartida,
  public.create_transaction('expense', 500, 'ARS', null, 'c8500000-0000-0000-0000-000000000001',
    'a8500000-0000-0000-0000-000000000001', 1, '2026-08-17') as otra,
  public.create_transaction('expense', 700, 'ARS', null, 'c8500000-0000-0000-0000-000000000001',
    'a8500000-0000-0000-0000-000000000001', 1, '2026-08-18') as activa;

-- CA-1: un movimiento activo no se elimina definitivamente
select throws_ok(format('select public.purge_transaction(%L)', (select activa from tx)),
  '23514', 'Un movimiento activo no se puede eliminar definitivamente', 'CA-1: un movimiento activo se rechaza');
select is((select count(*) from transactions where id = (select activa from tx)), 1::bigint, 'CA-1: y sigue ahí');

select public.delete_transaction((select cuotas from tx));
select public.delete_transaction((select compartida from tx));
select public.delete_transaction((select otra from tx));

-- CA-2 y CA-3: se borra con sus imputaciones; no se puede restaurar ni la API lo devuelve
select is((select count(*) from ledger_entries where transaction_id = (select cuotas from tx)), 3::bigint, 'fixture: la compra tiene 3 imputaciones');
select lives_ok(format('select public.purge_transaction(%L)', (select cuotas from tx)), 'CA-2: elimina definitivamente una compra en cuotas ya eliminada');
select is((select count(*) from transactions where id = (select cuotas from tx)), 0::bigint, 'CA-2: la transacción ya no existe');
select is((select count(*) from ledger_entries where transaction_id = (select cuotas from tx)), 0::bigint, 'CA-3: sus 3 imputaciones se borraron');
select throws_ok(format('select public.restore_transaction(%L)', (select cuotas from tx)),
  '23503', 'la transacción no existe, no está eliminada o no te pertenece', 'CA-2: no se puede restaurar');
select throws_ok(format('select public.purge_transaction(%L)', (select cuotas from tx)),
  '23503', 'la transacción no existe o no te pertenece', 'una segunda llamada responde «no existe»');

-- CA-3: la deuda vinculada se borra con el gasto
select is((select count(*) from debts where transaction_id = (select compartida from tx)), 1::bigint, 'fixture: el gasto compartido tiene su deuda');
select lives_ok(format('select public.purge_transaction(%L)', (select compartida from tx)), 'CA-3: elimina definitivamente un gasto compartido');
select is((select count(*) from debts where person = 'Sofía'), 0::bigint, 'CA-3: su deuda vinculada se borró');
select is((select count(*) from transactions where id = (select compartida from tx)), 0::bigint, 'CA-3: y el gasto también');

-- Lo demás no se toca
select is((select count(*) from transactions where id = (select otra from tx)), 1::bigint, 'otra transacción ya eliminada sigue ahí');
select is((select count(*) from ledger_entries where transaction_id = (select activa from tx)), 1::bigint, 'las imputaciones de otra transacción siguen ahí');

-- ADR-044 §2: la ocurrencia de una suscripción no se purga, ni siquiera eliminada
select throws_ok($f$select public.purge_transaction(current_setting('t.occ')::uuid)$f$,
  '23514', 'Un movimiento activo no se puede eliminar definitivamente', 'ADR-044 §2: la ocurrencia activa se rechaza por activa');
select public.delete_transaction(current_setting('t.occ')::uuid);
select throws_ok($f$select public.purge_transaction(current_setting('t.occ')::uuid)$f$,
  '23514', 'Un movimiento de una suscripción no se puede eliminar definitivamente', 'ADR-044 §2: la ocurrencia eliminada tampoco se purga');
select is((select count(*) from transactions where id = current_setting('t.occ')::uuid), 1::bigint, 'ADR-044 §2: sigue en Eliminados');
select lives_ok($f$select public.restore_transaction(current_setting('t.occ')::uuid)$f$, 'ADR-044 §2: se puede restaurar');

-- I11: la puesta al día no la vuelve a crear porque nunca se borró
reset role;
select is((catch_up_subscriptions('85a00000-0000-0000-0000-000000000001', '2026-08-15') ->> 'generated')::int, 0,
  'I11: la puesta al día no genera nada de nuevo');

-- CA-4: autorización (C7)
set local role authenticated;
set local request.jwt.claims = '{"sub":"85b00000-0000-0000-0000-000000000002","role":"authenticated"}';
select throws_ok(format('select public.purge_transaction(%L)', (select otra from tx)),
  '23503', 'la transacción no existe o no te pertenece', 'CA-4: con la sesión de B, purgar el movimiento eliminado de A responde «no existe»');
select throws_ok($f$select public.purge_transaction(null)$f$,
  '23503', 'la transacción no existe o no te pertenece', 'un id nulo responde lo mismo');
select throws_ok($f$delete from public.transactions$f$, '42501', null, 'C4: no hay delete directo sobre transactions');
set local request.jwt.claims = '{"sub":"85a00000-0000-0000-0000-000000000001","role":"authenticated"}';
select is((select count(*) from transactions where id = (select otra from tx)), 1::bigint, 'CA-4: el movimiento de A sigue ahí');

select set_config('t.otra', (select otra::text from tx), true);
set local role anon;
select throws_ok($f$select public.purge_transaction(current_setting('t.otra')::uuid)$f$, '42501', null, 'CA-4: anon no puede ejecutar purge_transaction');

select * from finish();
rollback;
