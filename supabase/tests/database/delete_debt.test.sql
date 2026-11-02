-- US-87 (#329), ADR-044 §3: delete_debt borra una deuda pendiente (suelta o de un gasto compartido).
begin;
select plan(14);

insert into auth.users (id, instance_id, aud, role, email) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','00000000-0000-0000-0000-000000000000','authenticated','authenticated','a@test.local'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b@test.local');
insert into categories (id, user_id, name) values
  ('c0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Comida');
insert into accounts (id, user_id, name, type, currency) values
  ('a0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Efectivo','cash','ARS');
insert into debts (id, user_id, person, amount, currency, direction, status, settled_at, incurred_on) values
  ('d0000000-0000-0000-0000-0000000000b1','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','Pedro',900.00,'ARS','owed_to_me','pending',null,'2026-09-03');

set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

create temp table ids as
  select public.create_debt('owed_to_me', 'Lucas', 5000, 'ARS', null, '2026-10-05', 'Entradas') as loose,
         public.create_debt('i_owe', 'Marta', 700, 'ARS', null, '2026-10-06', null) as settled,
         public.create_transaction('expense', 1000, 'ARS', null, 'c0000000-0000-0000-0000-000000000001',
           'a0000000-0000-0000-0000-000000000001', 1, '2026-10-07',
           p_shared_person => 'Sofía', p_shared_amount => 400) as shared_tx,
         public.create_transaction('expense', 600, 'ARS', null, 'c0000000-0000-0000-0000-000000000001',
           'a0000000-0000-0000-0000-000000000001', 1, '2026-10-08',
           p_shared_person => 'Juan', p_shared_amount => 100) as gone_tx;
select public.settle_debt((select settled from ids));
select public.delete_transaction((select gone_tx from ids));

-- Saldada: no se borra.
select throws_ok(format('select public.delete_debt(%L)', (select settled from ids)),
  '23514', 'Una deuda saldada no se elimina: volvela a pendiente primero', 'una deuda saldada no se borra');
select is((select count(*) from debts where id = (select settled from ids)), 1::bigint, 'la saldada sigue ahí');

-- Vinculada a un gasto con baja lógica: invisible, responde no encontrada.
select throws_ok(format($$select public.delete_debt((select id from debts where transaction_id = %L))$$, (select gone_tx from ids)),
  'PT404', 'Deuda no encontrada', 'la deuda de un gasto dado de baja no se ve ni se borra');

-- Suelta pendiente: se borra.
select lives_ok(format('select public.delete_debt(%L)', (select loose from ids)), 'se borra una suelta pendiente');
select is((select count(*) from debts where id = (select loose from ids)), 0::bigint, 'ya no existe');

-- De un gasto compartido: se borra sola y el gasto queda como gasto normal con sus imputaciones.
select lives_ok(format($$select public.delete_debt((select id from debts where transaction_id = %L))$$, (select shared_tx from ids)),
  'se borra la deuda de un gasto compartido');
select is((select count(*) from debts where transaction_id = (select shared_tx from ids)), 0::bigint, 'la deuda ya no existe');
select is((select count(*) from transactions where id = (select shared_tx from ids) and deleted_at is null), 1::bigint,
  'el gasto sigue activo');
select is((select count(*) from ledger_entries where transaction_id = (select shared_tx from ids)), 1::bigint,
  'sus imputaciones no cambian');

-- Inexistente
select throws_ok($$select public.delete_debt('d0000000-0000-0000-0000-0000000000ff')$$,
  'PT404', 'Deuda no encontrada', 'una inexistente responde no encontrada');

-- C7: la de B responde igual y no se borra
select throws_ok($$select public.delete_debt('d0000000-0000-0000-0000-0000000000b1')$$,
  'PT404', 'Deuda no encontrada', 'otra sesión: no encontrada');
reset role;
select is((select count(*) from debts where id = 'd0000000-0000-0000-0000-0000000000b1'), 1::bigint, 'la deuda de B sigue ahí');

set local role anon;
select throws_ok($$select public.delete_debt('d0000000-0000-0000-0000-0000000000b1')$$, '42501', null, 'anon no puede ejecutar delete_debt');
reset role;
set local role authenticated;
set local request.jwt.claims = '{"sub":"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb","role":"authenticated"}';
select is((select count(*) from debts), 1::bigint, 'B ve solo su deuda (cero filas de A)');

select * from finish();
rollback;
