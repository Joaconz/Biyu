-- US-84 (#284), ADR-043, ADR-009: update_transaction edita un movimiento y regenera sus imputaciones.
-- Cubre CA-3 a CA-6, CA-15, CA-17 a CA-21, CA-24, CA-27 y CA-28 de entrega-2/historias/editar-movimiento.md
-- del lado de la base (C6, C7). La concurrencia (CA-25) y los códigos HTTP (CA-2, PGRST202) se prueban
-- por la API en e2e/transactions-edit.spec.ts. Datos ficticios; todo se revierte (ADR-015).
begin;
select plan(62);

-- ---------------------------------------------------------------------------
-- Fixtures (como dueño de las tablas)
-- ---------------------------------------------------------------------------
insert into auth.users (id, instance_id, aud, role, email) values
  ('84a00000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us84a@test.local'),
  ('84b00000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us84b@test.local');
insert into categories (id, user_id, name, archived_at) values
  ('c8400000-0000-0000-0000-000000000001','84a00000-0000-0000-0000-000000000001','Comida', null),
  ('c8400000-0000-0000-0000-000000000002','84a00000-0000-0000-0000-000000000001','Otros', null),
  ('c8400000-0000-0000-0000-000000000003','84a00000-0000-0000-0000-000000000001','Vieja', null),
  ('c8400000-0000-0000-0000-0000000000b1','84b00000-0000-0000-0000-000000000002','Ajena', null);
insert into accounts (id, user_id, name, type, currency, archived_at) values
  ('a8400000-0000-0000-0000-000000000001','84a00000-0000-0000-0000-000000000001','Visa','credit_card','ARS', null),
  ('a8400000-0000-0000-0000-000000000002','84a00000-0000-0000-0000-000000000001','Efectivo','cash','ARS', null),
  ('a8400000-0000-0000-0000-000000000003','84a00000-0000-0000-0000-000000000001','Cuenta vieja','cash','ARS', null),
  ('a8400000-0000-0000-0000-0000000000b1','84b00000-0000-0000-0000-000000000002','Cuenta ajena','cash','ARS', null);

-- argentina_today() no la puede llamar authenticated: se guarda antes, como dueño.
select set_config('t.today', public.argentina_today()::text, true);

set local role authenticated;
set local request.jwt.claims = '{"sub":"84a00000-0000-0000-0000-000000000001","role":"authenticated"}';

create temp table tx as
select
  public.create_transaction('expense', 100000, 'ARS', null, 'c8400000-0000-0000-0000-000000000001',
    'a8400000-0000-0000-0000-000000000001', 3, '2026-08-15') as cuotas3,
  public.create_transaction('expense', 120000, 'ARS', null, 'c8400000-0000-0000-0000-000000000001',
    'a8400000-0000-0000-0000-000000000001', 6, '2026-08-15') as cuotas6,
  public.create_transaction('expense', 30000, 'ARS', null, 'c8400000-0000-0000-0000-000000000001',
    'a8400000-0000-0000-0000-000000000001', 3, '2026-09-15') as fecha,
  public.create_transaction('expense', 100, 'USD', 1000, 'c8400000-0000-0000-0000-000000000001',
    'a8400000-0000-0000-0000-000000000002', 1, '2026-09-10') as usd,
  public.create_transaction('income', 50000, 'ARS', null, null,
    'a8400000-0000-0000-0000-000000000002', 1, '2026-09-05') as ingreso,
  public.create_transaction('expense', 6000, 'ARS', null, 'c8400000-0000-0000-0000-000000000001',
    'a8400000-0000-0000-0000-000000000001', 6, '2026-08-20') as tarjeta,
  public.create_transaction('expense', 10000, 'ARS', null, 'c8400000-0000-0000-0000-000000000001',
    'a8400000-0000-0000-0000-000000000002', 1, '2026-09-01') as simple,
  public.create_transaction('expense', 8000, 'ARS', null, 'c8400000-0000-0000-0000-000000000003',
    'a8400000-0000-0000-0000-000000000003', 1, '2026-09-02') as archivada,
  public.create_transaction('expense', 9000, 'ARS', null, 'c8400000-0000-0000-0000-000000000001',
    'a8400000-0000-0000-0000-000000000002', 1, '2026-09-03') as eliminada,
  public.create_transaction('expense', 40000, 'ARS', null, 'c8400000-0000-0000-0000-000000000001',
    'a8400000-0000-0000-0000-000000000002', 1, '2026-09-04', null, 'Sofía', 15000) as compartida;

-- ---------------------------------------------------------------------------
-- CA-4: el resto de las cuotas se reparte con la regla de C3
-- ---------------------------------------------------------------------------
select is(public.update_transaction((select cuotas3 from tx), 100001, 'c8400000-0000-0000-0000-000000000001',
    'a8400000-0000-0000-0000-000000000001', 3, '2026-08-15'), (select cuotas3 from tx),
  'CA-4: devuelve el id del mismo movimiento (no crea otro)');
select is((select array_agg(amount order by installment_number) from ledger_entries where transaction_id = (select cuotas3 from tx)),
  array[33333.66, 33333.66, 33333.68]::numeric[], 'CA-4: 100001 en 3 cuotas = 33.333,66 + 33.333,66 + 33.333,68');
select is((select sum(amount) from ledger_entries where transaction_id = (select cuotas3 from tx)), 100001.00,
  'CA-4: las imputaciones suman exactamente el monto nuevo (I1)');
select is((select amount from transactions where id = (select cuotas3 from tx)), 100001.00, 'CA-4: la transacción guarda el monto nuevo');
-- La regla de reparto es la misma que la del alta: editar a un valor da lo mismo que crearlo con ese valor (C3).
create temp table fresh as
  select public.create_transaction('expense', 100001, 'ARS', null, 'c8400000-0000-0000-0000-000000000001',
    'a8400000-0000-0000-0000-000000000001', 3, '2026-08-15') as id;
select is((select array_agg(array[installment_number::numeric, extract(month from period)::numeric, amount, amount_ars] order by installment_number)
            from ledger_entries where transaction_id = (select cuotas3 from tx)),
  (select array_agg(array[installment_number::numeric, extract(month from period)::numeric, amount, amount_ars] order by installment_number)
            from ledger_entries where transaction_id = (select id from fresh)),
  'CA-4: editar a 100001 en 3 cuotas reparte igual que crear la compra con ese monto (C3)');

-- ---------------------------------------------------------------------------
-- CA-5: menos cuotas, sin huecos y sin imputaciones de más
-- ---------------------------------------------------------------------------
select lives_ok(format($f$select public.update_transaction(%L, 120000, 'c8400000-0000-0000-0000-000000000001',
    'a8400000-0000-0000-0000-000000000001', 3, '2026-08-15')$f$, (select cuotas6 from tx)),
  'CA-5: 6 cuotas pasan a 3');
select is((select array_agg(installment_number order by installment_number) from ledger_entries where transaction_id = (select cuotas6 from tx)),
  array[1, 2, 3], 'CA-5: exactamente 3 imputaciones numeradas de 1 a 3 (I2, I3)');
select is((select array_agg(period order by installment_number) from ledger_entries where transaction_id = (select cuotas6 from tx)),
  array['2026-08-01', '2026-09-01', '2026-10-01']::date[], 'CA-5: en agosto, septiembre y octubre; ninguna en los meses siguientes');
select is((select array_agg(distinct amount) from ledger_entries where transaction_id = (select cuotas6 from tx)),
  array[40000.00]::numeric[], 'CA-5: de $40.000,00 cada una');
select is((select installments_count from transactions where id = (select cuotas6 from tx)), 3, 'CA-5: installments_count = 3');

-- ---------------------------------------------------------------------------
-- CA-6: cambiar la fecha mueve first_period y las imputaciones
-- ---------------------------------------------------------------------------
select lives_ok(format($f$select public.update_transaction(%L, 30000, 'c8400000-0000-0000-0000-000000000001',
    'a8400000-0000-0000-0000-000000000001', 3, '2026-08-10', '  Heladera  ')$f$, (select fecha from tx)),
  'CA-6: la fecha pasa de septiembre a agosto');
select is((select first_period from transactions where id = (select fecha from tx)), '2026-08-01'::date, 'CA-6: first_period es el mes de la nueva fecha');
select is((select array_agg(period order by installment_number) from ledger_entries where transaction_id = (select fecha from tx)),
  array['2026-08-01', '2026-09-01', '2026-10-01']::date[], 'CA-6: las imputaciones pasan a agosto, septiembre y octubre');
select is((select description from transactions where id = (select fecha from tx)), 'Heladera', 'la descripción se guarda sin espacios sobrantes');
select lives_ok(format($f$select public.update_transaction(%L, 30000, 'c8400000-0000-0000-0000-000000000001',
    'a8400000-0000-0000-0000-000000000001', 3, '2026-08-10', '   ')$f$, (select fecha from tx)),
  'una descripción de solo espacios se acepta');
select is((select description from transactions where id = (select fecha from tx)), null, 'y deja el movimiento sin descripción');

-- ---------------------------------------------------------------------------
-- CA-15: en USD el tipo de cambio sigue congelado y amount_ars se recalcula
-- ---------------------------------------------------------------------------
select lives_ok(format($f$select public.update_transaction(%L, 120, 'c8400000-0000-0000-0000-000000000001',
    'a8400000-0000-0000-0000-000000000002', 1, '2026-09-10')$f$, (select usd from tx)),
  'CA-15: US$100,00 pasan a US$120,00');
select is((select fx_rate from transactions where id = (select usd from tx)), 1000.0000, 'CA-15: el tipo de cambio sigue en 1.000,00 (C5)');
select is((select amount_ars from transactions where id = (select usd from tx)), 120000.00, 'CA-15: amount_ars = $120.000,00');
select is((select array[amount, amount_ars] from ledger_entries where transaction_id = (select usd from tx)),
  array[120.00, 120000.00]::numeric[], 'CA-15: la imputación queda en US$120,00 y $120.000,00');
select is((select currency::text from transactions where id = (select usd from tx)), 'USD', 'la moneda no cambia');

-- ---------------------------------------------------------------------------
-- CA-17 y CA-18: ingreso y I6
-- ---------------------------------------------------------------------------
select lives_ok(format($f$select public.update_transaction(%L, 55000, null,
    'a8400000-0000-0000-0000-000000000002', 1, '2026-09-05')$f$, (select ingreso from tx)),
  'CA-17: un ingreso se edita sin categoría');
select is((select amount from ledger_entries where transaction_id = (select ingreso from tx)), 55000.00, 'CA-17: su imputación queda en $55.000,00');
select throws_ok(format($f$select public.update_transaction(%L, 55000, null,
    'a8400000-0000-0000-0000-000000000002', 3, '2026-09-05')$f$, (select ingreso from tx)),
  '23514', 'I6: las cuotas solo aplican a gastos con cuenta credit_card', 'CA-17: un ingreso con 3 cuotas se rechaza (I6)');
select throws_ok(format($f$select public.update_transaction(%L, 6000, 'c8400000-0000-0000-0000-000000000001',
    'a8400000-0000-0000-0000-000000000002', 6, '2026-08-20')$f$, (select tarjeta from tx)),
  '23514', 'I6: las cuotas solo aplican a gastos con cuenta credit_card', 'CA-18: 6 cuotas con una cuenta de efectivo se rechaza (I6)');
select is((select array[installments_count::numeric, (select count(*) from ledger_entries where transaction_id = t.id)] from transactions t where id = (select tarjeta from tx)),
  array[6, 6]::numeric[], 'CA-18: la transacción y sus 6 imputaciones quedan como estaban');
select lives_ok(format($f$select public.update_transaction(%L, 6000, 'c8400000-0000-0000-0000-000000000001',
    'a8400000-0000-0000-0000-000000000002', 1, '2026-08-20')$f$, (select tarjeta from tx)),
  'CA-18: con 1 cuota sí se puede pasar a efectivo');

-- ---------------------------------------------------------------------------
-- CA-19: validaciones (los mismos mensajes que create_transaction) y atomicidad
-- ---------------------------------------------------------------------------
create temp table bad(label text, sql text, state text, msg text);
insert into bad
select * from (values
  ('monto nulo',        $q$select public.update_transaction(%L, null, 'c8400000-0000-0000-0000-000000000001', 'a8400000-0000-0000-0000-000000000002', 1, '2026-09-01')$q$, '23514', 'I4: el monto debe ser mayor a cero'),
  ('monto 0',           $q$select public.update_transaction(%L, 0, 'c8400000-0000-0000-0000-000000000001', 'a8400000-0000-0000-0000-000000000002', 1, '2026-09-01')$q$, '23514', 'I4: el monto debe ser mayor a cero'),
  ('monto negativo',    $q$select public.update_transaction(%L, -5, 'c8400000-0000-0000-0000-000000000001', 'a8400000-0000-0000-0000-000000000002', 1, '2026-09-01')$q$, '23514', 'I4: el monto debe ser mayor a cero'),
  ('monto NaN',         $q$select public.update_transaction(%L, 'NaN'::numeric, 'c8400000-0000-0000-0000-000000000001', 'a8400000-0000-0000-0000-000000000002', 1, '2026-09-01')$q$, '23514', 'I4: el monto debe ser mayor a cero'),
  ('3 decimales',       $q$select public.update_transaction(%L, 10.123, 'c8400000-0000-0000-0000-000000000001', 'a8400000-0000-0000-0000-000000000002', 1, '2026-09-01')$q$, '23514', 'I4: el monto admite hasta 2 decimales'),
  ('cuotas 0',          $q$select public.update_transaction(%L, 100, 'c8400000-0000-0000-0000-000000000001', 'a8400000-0000-0000-0000-000000000001', 0, '2026-09-01')$q$, '23514', 'las cuotas van de 1 a 12'),
  ('cuotas 13',         $q$select public.update_transaction(%L, 100, 'c8400000-0000-0000-0000-000000000001', 'a8400000-0000-0000-0000-000000000001', 13, '2026-09-01')$q$, '23514', 'las cuotas van de 1 a 12'),
  ('gasto sin categoría', $q$select public.update_transaction(%L, 100, null, 'a8400000-0000-0000-0000-000000000002', 1, '2026-09-01')$q$, '23514', 'I8: un gasto requiere categoría'),
  ('fecha de mañana',   $q$select public.update_transaction(%L, 100, 'c8400000-0000-0000-0000-000000000001', 'a8400000-0000-0000-0000-000000000002', 1, current_setting('t.today')::date + 1)$q$, '23514', 'FR-06: la fecha no puede ser posterior a hoy'),
  ('cuenta ajena',      $q$select public.update_transaction(%L, 100, 'c8400000-0000-0000-0000-000000000001', 'a8400000-0000-0000-0000-0000000000b1', 1, '2026-09-01')$q$, '23503', 'la cuenta no existe, no es tuya o está archivada'),
  ('categoría ajena',   $q$select public.update_transaction(%L, 100, 'c8400000-0000-0000-0000-0000000000b1', 'a8400000-0000-0000-0000-000000000002', 1, '2026-09-01')$q$, '23503', 'la categoría no existe, no es tuya o está archivada'),
  ('$0,11 en 12 cuotas', $q$select public.update_transaction(%L, 0.11, 'c8400000-0000-0000-0000-000000000001', 'a8400000-0000-0000-0000-000000000001', 12, '2026-09-01')$q$, '23514', 'I4: cada cuota debe ser al menos 0,01')
) as v(label, sql, state, msg);

select throws_ok(format(sql, (select simple from tx)), state, msg, 'CA-19: ' || label)
  from bad;

select is((select array[t.amount::text, t.installments_count::text, t.occurred_on::text, (select count(*)::text from ledger_entries where transaction_id = t.id)]
             from transactions t where t.id = (select simple from tx)),
  array['10000.00', '1', '2026-09-01', '1'], 'CA-19: ningún rechazo cambió la transacción ni sus imputaciones (atomicidad)');
select lives_ok(format($f$select public.update_transaction(%L, 10000, 'c8400000-0000-0000-0000-000000000001',
    'a8400000-0000-0000-0000-000000000002', 1, current_setting('t.today')::date)$f$, (select simple from tx)),
  'CA-19: la fecha de hoy en Argentina se acepta');

-- ---------------------------------------------------------------------------
-- CA-20: categoría y cuenta archivadas
-- ---------------------------------------------------------------------------
reset role;
update categories set archived_at = now() where id = 'c8400000-0000-0000-0000-000000000003';
update accounts set archived_at = now() where id = 'a8400000-0000-0000-0000-000000000003';
set local role authenticated;
set local request.jwt.claims = '{"sub":"84a00000-0000-0000-0000-000000000001","role":"authenticated"}';

select lives_ok(format($f$select public.update_transaction(%L, 8500, 'c8400000-0000-0000-0000-000000000003',
    'a8400000-0000-0000-0000-000000000003', 1, '2026-09-02')$f$, (select archivada from tx)),
  'CA-20: se edita el monto sin tocar la categoría ni la cuenta archivadas');
select throws_ok(format($f$select public.update_transaction(%L, 8500, 'c8400000-0000-0000-0000-000000000003',
    'a8400000-0000-0000-0000-000000000002', 1, '2026-09-02')$f$, (select simple from tx)),
  '23503', 'la categoría no existe, no es tuya o está archivada', 'CA-20: otra categoría archivada se rechaza');
select throws_ok(format($f$select public.update_transaction(%L, 8500, 'c8400000-0000-0000-0000-000000000001',
    'a8400000-0000-0000-0000-000000000003', 1, '2026-09-02')$f$, (select simple from tx)),
  '23503', 'la cuenta no existe, no es tuya o está archivada', 'CA-20: otra cuenta archivada se rechaza');
select lives_ok(format($f$select public.update_transaction(%L, 8500, 'c8400000-0000-0000-0000-000000000002',
    'a8400000-0000-0000-0000-000000000002', 1, '2026-09-02')$f$, (select archivada from tx)),
  'CA-20: se puede pasar a una categoría y cuenta activas');
select throws_ok(format($f$select public.update_transaction(%L, 8500, 'c8400000-0000-0000-0000-000000000003',
    'a8400000-0000-0000-0000-000000000002', 1, '2026-09-02')$f$, (select archivada from tx)),
  '23503', 'la categoría no existe, no es tuya o está archivada', 'CA-20: ya cambiada, no se puede volver a elegir la archivada');

-- ---------------------------------------------------------------------------
-- CA-21: movimientos que no se editan, y el orden de los bloqueos
-- ---------------------------------------------------------------------------
select public.delete_transaction((select eliminada from tx));
select throws_ok(format($f$select public.update_transaction(%L, 9500, 'c8400000-0000-0000-0000-000000000001',
    'a8400000-0000-0000-0000-000000000002', 1, '2026-09-03')$f$, (select eliminada from tx)),
  '23514', 'Un movimiento eliminado no se puede editar', 'CA-21: un movimiento eliminado no se edita');

reset role;
insert into subscriptions (id, user_id, name, amount, currency, category_id, account_id, billing_day,
                           start_period, generate_from_period, status) values
  ('d8400000-0000-0000-0000-000000000001','84a00000-0000-0000-0000-000000000001','Netflix', 5000.00, 'ARS',
   'c8400000-0000-0000-0000-000000000001','a8400000-0000-0000-0000-000000000001', 10,
   '2026-07-01', '2026-07-01', 'active');
select catch_up_subscriptions('84a00000-0000-0000-0000-000000000001', '2026-08-15');
select set_config('t.occ', (select id::text from transactions where subscription_id = 'd8400000-0000-0000-0000-000000000001'
  and subscription_period = '2026-07-01'), true);
select set_config('t.occ2', (select id::text from transactions where subscription_id = 'd8400000-0000-0000-0000-000000000001'
  and subscription_period = '2026-08-01'), true);
set local role authenticated;
set local request.jwt.claims = '{"sub":"84a00000-0000-0000-0000-000000000001","role":"authenticated"}';

select throws_ok($f$select public.update_transaction(current_setting('t.occ')::uuid, 5500, 'c8400000-0000-0000-0000-000000000001',
    'a8400000-0000-0000-0000-000000000001', 1, '2026-07-10')$f$,
  '23514', 'Un movimiento de una suscripción no se puede editar', 'CA-21: la ocurrencia de una suscripción no se edita');
select public.delete_transaction(current_setting('t.occ2')::uuid);
select throws_ok($f$select public.update_transaction(current_setting('t.occ2')::uuid, 5500, 'c8400000-0000-0000-0000-000000000001',
    'a8400000-0000-0000-0000-000000000001', 1, '2026-08-10')$f$,
  '23514', 'Un movimiento eliminado no se puede editar', 'CA-21: una ocurrencia eliminada responde el mensaje de eliminado (va primero)');
select throws_ok(format($f$select public.update_transaction(%L, 41000, 'c8400000-0000-0000-0000-000000000001',
    'a8400000-0000-0000-0000-000000000002', 1, '2026-09-04')$f$, (select compartida from tx)),
  '23514', 'Un movimiento compartido no se puede editar', 'CA-21: un movimiento con deuda vinculada no se edita');
select is((select amount from transactions where id = (select compartida from tx)), 40000.00, 'CA-21: el compartido no cambió');

-- ADR-043 §8: una compra en cuotas empezada (US-80) no se edita. La columna installments_paid la agrega US-80:
-- acá se agrega solo si falta (todo se revierte) y se marca una compra como empezada.
reset role;
alter table transactions add column if not exists installments_paid int not null default 0;
update transactions set installments_paid = 1 where id = (select cuotas6 from tx);
set local role authenticated;
set local request.jwt.claims = '{"sub":"84a00000-0000-0000-0000-000000000001","role":"authenticated"}';
select throws_ok(format($f$select public.update_transaction(%L, 120000, 'c8400000-0000-0000-0000-000000000001',
    'a8400000-0000-0000-0000-000000000001', 3, '2026-08-15')$f$, (select cuotas6 from tx)),
  '23514', 'Una compra empezada no se puede editar', 'ADR-043 §8: una compra en cuotas empezada no se edita');
select is((select amount from transactions where id = (select cuotas6 from tx)), 120000.00, 'ADR-043 §8: la compra empezada no cambió');
reset role;
update transactions set installments_paid = 0 where id = (select cuotas6 from tx);
set local role authenticated;
set local request.jwt.claims = '{"sub":"84a00000-0000-0000-0000-000000000001","role":"authenticated"}';

-- ---------------------------------------------------------------------------
-- CA-24: idempotencia (mismas imputaciones por período, cuota y montos)
-- ---------------------------------------------------------------------------
create temp table run1 as
select array_agg(array[extract(month from period)::numeric, installment_number::numeric, amount, amount_ars] order by installment_number) as e
  from ledger_entries where transaction_id = (select cuotas3 from tx);
select public.update_transaction((select cuotas3 from tx), 100001, 'c8400000-0000-0000-0000-000000000001',
    'a8400000-0000-0000-0000-000000000001', 3, '2026-08-15');
select is((select array_agg(array[extract(month from period)::numeric, installment_number::numeric, amount, amount_ars] order by installment_number)
            from ledger_entries where transaction_id = (select cuotas3 from tx)),
  (select e from run1), 'CA-24: editar dos veces con los mismos valores deja las mismas imputaciones');

-- ---------------------------------------------------------------------------
-- CA-27: autorización (C4, C7)
-- ---------------------------------------------------------------------------
set local request.jwt.claims = '{"sub":"84b00000-0000-0000-0000-000000000002","role":"authenticated"}';
select throws_ok(format($f$select public.update_transaction(%L, 1, 'c8400000-0000-0000-0000-0000000000b1',
    'a8400000-0000-0000-0000-0000000000b1', 1, '2026-09-01')$f$, (select simple from tx)),
  '23503', 'la transacción no existe o no te pertenece', 'CA-27: con la sesión de B, editar el movimiento de A responde «no existe o no te pertenece»');
select throws_ok(format($f$select public.update_transaction(%L, 1, 'c8400000-0000-0000-0000-0000000000b1',
    'a8400000-0000-0000-0000-0000000000b1', 1, '2026-09-01')$f$, (select eliminada from tx)),
  '23503', 'la transacción no existe o no te pertenece', 'CA-21: el movimiento eliminado de otro usuario responde lo mismo (no revela que existe)');
select throws_ok($f$update public.transactions set amount = 1$f$, '42501', null, 'CA-27: un update directo sobre transactions se rechaza (C4)');
select throws_ok($f$delete from public.ledger_entries$f$, '42501', null, 'CA-27: un delete directo sobre ledger_entries se rechaza (C4)');
set local request.jwt.claims = '{"sub":"84a00000-0000-0000-0000-000000000001","role":"authenticated"}';
select is((select amount from transactions where id = (select simple from tx)), 10000.00, 'CA-27: el movimiento de A no cambió');

reset role;
-- CA-28: la suma de las imputaciones es el monto, en su moneda y en pesos (I1, I1')
select is((select count(*) from ledger_integrity_violations where user_id = '84a00000-0000-0000-0000-000000000001'), 0::bigint,
  'CA-28: la vista de integridad no marca ninguna violación después de tantas ediciones');
select is((select count(*) from transactions t where t.user_id = '84a00000-0000-0000-0000-000000000001' and t.deleted_at is null
   and (select coalesce(sum(le.amount), 0) from ledger_entries le where le.transaction_id = t.id) <> t.amount), 0::bigint,
  'CA-28: ninguna transacción activa tiene imputaciones que no sumen su monto');

select set_config('t.simple', (select simple::text from tx), true);
set local role anon;
select throws_ok($f$select public.update_transaction(current_setting('t.simple')::uuid, 1, null, null, 1, '2026-09-01')$f$,
  '42501', null, 'CA-27: anon no puede ejecutar update_transaction');

select * from finish();
rollback;
