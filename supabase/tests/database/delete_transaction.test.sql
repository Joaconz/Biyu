-- delete_transaction (C4, C7, C10, I10, FR-08): soft delete, autorización, rechazo a anon y preservación del histórico.
begin;
select plan(11);

insert into auth.users (id, instance_id, aud, role, email) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','00000000-0000-0000-0000-000000000000','authenticated','authenticated','a@test.local'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b@test.local');

insert into categories (id, user_id, name) values
  ('c0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Almacén'),
  ('c0000000-0000-0000-0000-000000000002','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','Servicios');

insert into accounts (id, user_id, name, type, currency) values
  ('a0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Débito','debit_card','ARS'),
  ('a0000000-0000-0000-0000-000000000002','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','Efectivo','cash','ARS');

create temporary table _test_context (tx_id uuid);
grant all on _test_context to public;
grant select on transactions, ledger_entries to service_role;

-- Creamos una transacción para el usuario A
set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

insert into _test_context (tx_id)
select create_transaction('expense', 5000, 'ARS', null, 'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 1, '2026-09-10', 'Compra pan');

select ok(
  (select tx_id is not null from _test_context),
  'transacción inicial de usuario A se crea'
);

-- 1. Rol anon no puede invocar delete_transaction (C8, 42501)
set local role anon;
set local request.jwt.claims = '{}';

select throws_ok(
  $$select delete_transaction('00000000-0000-0000-0000-000000000000'::uuid)$$,
  '42501',
  null,
  'rol anon no tiene permiso de ejecución sobre delete_transaction (C8)'
);

-- 2. Usuario B no puede borrar la transacción de usuario A (C7)
set local role authenticated;
set local request.jwt.claims = '{"sub":"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb","role":"authenticated"}';

select throws_ok(
  format('select delete_transaction(%L::uuid)', (select tx_id from _test_context)),
  '23503',
  'la transacción no existe, ya fue eliminada o no te pertenece',
  'usuario B no puede eliminar transacción de usuario A'
);

-- Verificamos que la transacción sigue intacta (deleted_at is null)
set local role service_role;
select is(
  (select count(*) from transactions where id = (select tx_id from _test_context) and deleted_at is null),
  1::bigint,
  'la transacción sigue activa tras intento ajeno'
);

-- 3. Usuario A elimina su propia transacción (C10, soft delete)
set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

select lives_ok(
  format('select delete_transaction(%L::uuid)', (select tx_id from _test_context)),
  'usuario A puede eliminar su propia transacción'
);

-- 4. El borrado es lógico (C10): la fila en transactions sigue existiendo y deleted_at is not null
set local role service_role;
select is(
  (select count(*) from transactions where id = (select tx_id from _test_context)),
  1::bigint,
  'la transacción no se borra físicamente de transactions (C10)'
);

select ok(
  (select deleted_at is not null from transactions where id = (select tx_id from _test_context)),
  'deleted_at tiene timestamp de borrado'
);

-- 5. Las imputaciones en ledger_entries siguen existiendo físicamente (C10)
select is(
  (select count(*) from ledger_entries where transaction_id = (select tx_id from _test_context)),
  1::bigint,
  'las imputaciones no se borran físicamente de ledger_entries (C10)'
);

-- 6. I10: al filtrar por deleted_at is null no devuelve filas (KPIs)
select is(
  (select count(*) from transactions where id = (select tx_id from _test_context) and deleted_at is null),
  0::bigint,
  'I10: transacciones activas es 0 tras el borrado'
);

-- 7. Intentar borrarla de nuevo falla (ya eliminada)
set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

select throws_ok(
  format('select delete_transaction(%L::uuid)', (select tx_id from _test_context)),
  '23503',
  'la transacción no existe, ya fue eliminada o no te pertenece',
  'reintentar el borrado de una transacción ya eliminada falla'
);

-- 8. Borrar con id nulo falla
select throws_ok(
  $$select delete_transaction(null)$$,
  '23514',
  'p_transaction_id es obligatorio',
  'id nulo es rechazado'
);

select * from finish();
rollback;
