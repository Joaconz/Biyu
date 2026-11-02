-- US-86 (#285) y US-87 (#329), ADR-037, ADR-044 §3: update_debt y delete_debt.
-- Datos ficticios; todo se revierte (ADR-015).
begin;
select plan(43);

insert into auth.users (id, instance_id, aud, role, email) values
  ('86a00000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us86a@test.local'),
  ('86b00000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us86b@test.local');
insert into categories (id, user_id, name) values
  ('c8600000-0000-0000-0000-000000000001','86a00000-0000-0000-0000-000000000001','Comida');
insert into accounts (id, user_id, name, type, currency) values
  ('a8600000-0000-0000-0000-000000000001','86a00000-0000-0000-0000-000000000001','Efectivo','cash','ARS');

set local role authenticated;
set local request.jwt.claims = '{"sub":"86a00000-0000-0000-0000-000000000001","role":"authenticated"}';

create temp table d as
select
  public.create_debt('owed_to_me', 'Juan', 10000, 'ARS', null, '2026-08-15', 'Nafta') as suelta,
  public.create_debt('i_owe', 'Marcos', 20, 'USD', 1000, '2026-08-16', null) as usd,
  public.create_debt('owed_to_me', 'Ana', 500, 'ARS', null, '2026-08-17', null) as saldada,
  public.create_debt('owed_to_me', 'Borrar', 700, 'ARS', null, '2026-08-18', null) as borrar,
  public.create_transaction('expense', 40000, 'ARS', null, 'c8600000-0000-0000-0000-000000000001',
    'a8600000-0000-0000-0000-000000000001', 1, '2026-08-19', null, 'Sofía', 15000) as gasto;
select set_config('t.linked', (select id::text from debts where transaction_id = (select gasto from d)), true);
select public.settle_debt((select saldada from d));

-- ---------------------------------------------------------------------------
-- update_debt: deuda suelta
-- ---------------------------------------------------------------------------
select lives_ok(format($f$select public.update_debt(%L, '  Juan Pérez  ', 12000.50, '  Combustible  ', '2026-08-10', 'i_owe')$f$, (select suelta from d)),
  'CA-1: se editan persona, monto, nota, fecha y dirección de una deuda suelta');
select is((select array[person, amount::text, notes, incurred_on::text, direction::text] from debts where id = (select suelta from d)),
  array['Juan Pérez', '12000.50', 'Combustible', '2026-08-10', 'i_owe'], 'CA-1: se guardó recortando persona y nota');
select is((select array[status::text, currency::text] from debts where id = (select suelta from d)), array['pending', 'ARS'], 'el estado y la moneda no cambian');
select lives_ok(format($f$select public.update_debt(%L, 'Juan Pérez', 12000.50)$f$, (select suelta from d)),
  'con fecha y dirección en null se conservan');
select is((select array[incurred_on::text, direction::text, notes] from debts where id = (select suelta from d)),
  array['2026-08-10', 'i_owe', null], 'se conservan la fecha y la dirección; la nota vacía queda en null');

-- La moneda y el tipo de cambio quedan congelados (C5)
select lives_ok(format($f$select public.update_debt(%L, 'Marcos', 30)$f$, (select usd from d)), 'CA-2: se edita el monto de una deuda en US$');
select is((select array[amount::text, fx_rate::text, amount_ars::text, currency::text] from debts where id = (select usd from d)),
  array['30.00', '1000.0000', '30000.00', 'USD'], 'CA-2: el tipo de cambio sigue en 1.000,00 y amount_ars se recalcula (C5)');

-- Validaciones (C6), con los mensajes de create_debt
create temp table bad(label text, sql text, msg text);
insert into bad values
  ('persona vacía',   $q$select public.update_debt(%L, '   ', 100)$q$, 'Ingresá el nombre de la persona'),
  ('persona de 61',   $q$select public.update_debt(%L, repeat('a', 61), 100)$q$, 'La persona admite hasta 60 caracteres'),
  ('monto nulo',      $q$select public.update_debt(%L, 'Juan', null)$q$, 'I4: el monto debe ser mayor a cero'),
  ('monto 0',         $q$select public.update_debt(%L, 'Juan', 0)$q$, 'I4: el monto debe ser mayor a cero'),
  ('monto NaN',       $q$select public.update_debt(%L, 'Juan', 'NaN'::numeric)$q$, 'I4: el monto debe ser mayor a cero'),
  ('3 decimales',     $q$select public.update_debt(%L, 'Juan', 1.234)$q$, 'I4: el monto admite hasta 2 decimales'),
  ('nota de 201',     $q$select public.update_debt(%L, 'Juan', 100, repeat('n', 201))$q$, 'La nota admite hasta 200 caracteres'),
  ('fecha futura',    $q$select public.update_debt(%L, 'Juan', 100, null, '2099-01-01')$q$, 'La fecha no puede ser posterior a hoy');
select throws_ok(format(sql, (select suelta from d)), '23514', msg, 'CA-3: ' || label) from bad;
select is((select array[person, amount::text] from debts where id = (select suelta from d)), array['Juan Pérez', '12000.50'],
  'CA-3: ningún rechazo cambió la deuda');
select throws_ok(format($f$select public.update_debt(%L, 'Marcos', 0.00001)$f$, (select usd from d)),
  '23514', 'I4: el monto admite hasta 2 decimales', 'US$: el monto sigue con 2 decimales');

-- ---------------------------------------------------------------------------
-- update_debt: deuda de un gasto
-- ---------------------------------------------------------------------------
select lives_ok($f$select public.update_debt(current_setting('t.linked')::uuid, 'Sofía G.', 20000, 'Cena')$f$,
  'CA-4: la deuda de un gasto cambia persona, monto y nota');
select is((select array[person, amount::text, notes] from debts where id = current_setting('t.linked')::uuid),
  array['Sofía G.', '20000.00', 'Cena'], 'CA-4: se guardó');
select throws_ok($f$select public.update_debt(current_setting('t.linked')::uuid, 'Sofía', 40000.01)$f$,
  '23514', 'I7: la deuda no puede superar el monto del gasto', 'CA-5: el monto no puede superar el del gasto (I7)');
select lives_ok($f$select public.update_debt(current_setting('t.linked')::uuid, 'Sofía', 40000)$f$, 'CA-5: pero sí igualarlo');
select throws_ok($f$select public.update_debt(current_setting('t.linked')::uuid, 'Sofía', 100, null, '2026-08-01')$f$,
  '23514', 'La fecha y la dirección de una deuda de un gasto no se pueden cambiar', 'CA-4: la fecha del gasto no se cambia');
select throws_ok($f$select public.update_debt(current_setting('t.linked')::uuid, 'Sofía', 100, null, null, 'i_owe')$f$,
  '23514', 'La fecha y la dirección de una deuda de un gasto no se pueden cambiar', 'CA-4: la dirección tampoco');
select lives_ok($f$select public.update_debt(current_setting('t.linked')::uuid, 'Sofía', 100, null, '2026-08-19', 'owed_to_me')$f$,
  'CA-4: mandar la misma fecha y dirección es lo mismo que no mandarlas');

-- ---------------------------------------------------------------------------
-- Deuda saldada y gasto eliminado
-- ---------------------------------------------------------------------------
select throws_ok(format($f$select public.update_debt(%L, 'Ana', 600)$f$, (select saldada from d)),
  '23514', 'Una deuda saldada no se puede editar: volvela a pendiente primero', 'CA-6: una deuda saldada no se edita');
select throws_ok(format($f$select public.delete_debt(%L)$f$, (select saldada from d)),
  '23514', 'Una deuda saldada no se puede eliminar: volvela a pendiente primero', 'CA-6: ni se elimina');
select public.reopen_debt((select saldada from d));
select lives_ok(format($f$select public.update_debt(%L, 'Ana', 600)$f$, (select saldada from d)), 'CA-6: vuelta a pendiente, se edita');

select public.delete_transaction((select gasto from d));
select throws_ok($f$select public.update_debt(current_setting('t.linked')::uuid, 'Sofía', 100)$f$,
  '23514', 'La deuda no existe', 'ADR-037 §4: la deuda de un gasto eliminado no se edita');
select throws_ok($f$select public.delete_debt(current_setting('t.linked')::uuid)$f$,
  '23514', 'La deuda no existe', 'ADR-037 §4: ni se elimina');
select public.restore_transaction((select gasto from d));

-- ---------------------------------------------------------------------------
-- delete_debt
-- ---------------------------------------------------------------------------
select lives_ok(format($f$select public.delete_debt(%L)$f$, (select borrar from d)), 'CA-7: se elimina una deuda suelta');
select is((select count(*) from debts where id = (select borrar from d)), 0::bigint, 'CA-7: ya no existe');
select throws_ok(format($f$select public.delete_debt(%L)$f$, (select borrar from d)),
  '23514', 'La deuda no existe', 'CA-7: borrarla de nuevo responde «no existe»');

select lives_ok($f$select public.delete_debt(current_setting('t.linked')::uuid)$f$, 'CA-8: se elimina la deuda de un gasto compartido');
select is((select count(*) from debts where transaction_id = (select gasto from d)), 0::bigint, 'CA-8: la deuda ya no existe');
select is((select array[amount::text, deleted_at::text] from transactions where id = (select gasto from d)), array['40000.00', null],
  'CA-8: el gasto queda como un gasto normal, sin cambios');
select is((select count(*) from ledger_entries where transaction_id = (select gasto from d)), 1::bigint, 'CA-8: con sus imputaciones');

-- ---------------------------------------------------------------------------
-- Autorización (C7) y rol anon
-- ---------------------------------------------------------------------------
set local request.jwt.claims = '{"sub":"86b00000-0000-0000-0000-000000000002","role":"authenticated"}';
select throws_ok(format($f$select public.update_debt(%L, 'Hack', 1)$f$, (select suelta from d)),
  '23514', 'La deuda no existe', 'CA-9: con la sesión de B, editar la deuda de A responde «no existe»');
select throws_ok(format($f$select public.delete_debt(%L)$f$, (select suelta from d)),
  '23514', 'La deuda no existe', 'CA-9: y eliminarla, lo mismo');
select throws_ok($f$delete from public.debts$f$, '42501', null, 'ADR-037: no hay delete directo sobre debts');
select throws_ok($f$update public.debts set amount = 1$f$, '42501', null, 'ADR-037: ni update directo');
set local request.jwt.claims = '{"sub":"86a00000-0000-0000-0000-000000000001","role":"authenticated"}';
select is((select person from debts where id = (select suelta from d)), 'Juan Pérez', 'CA-9: la deuda de A no cambió');

select set_config('t.suelta', (select suelta::text from d), true);
set local role anon;
select throws_ok($f$select public.update_debt(current_setting('t.suelta')::uuid, 'x', 1)$f$, '42501', null, 'CA-9: anon no ejecuta update_debt');
select throws_ok($f$select public.delete_debt(current_setting('t.suelta')::uuid)$f$, '42501', null, 'CA-9: ni delete_debt');

select * from finish();
rollback;
