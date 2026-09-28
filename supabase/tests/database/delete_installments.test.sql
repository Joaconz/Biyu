-- delete_installments (US-18, FR-08, I10, C10): borrado lógico saca las imputaciones del cálculo.
-- Escenario (docs/02-behavior-spec.md): un gasto de 120000 en 12 cuotas registrado en 2026-08;
-- al eliminarlo, ni el período de nacimiento ni un período heredado (2027-01) lo siguen contando.
begin;
select plan(15);

insert into auth.users (id, instance_id, aud, role, email) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','00000000-0000-0000-0000-000000000000','authenticated','authenticated','a@test.local'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b@test.local');

insert into categories (id, user_id, name) values
  ('c0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Tecnología'),
  ('c0000000-0000-0000-0000-000000000002','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','Ajena');

insert into accounts (id, user_id, name, type, currency) values
  ('a0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Visa','credit_card','ARS'),
  ('a0000000-0000-0000-0000-000000000002','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Efectivo','cash','ARS'),
  ('a0000000-0000-0000-0000-000000000003','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','Ajena','credit_card','ARS');

create temporary table _test_context (compra_id uuid);
grant all on _test_context to public;

-- Usuario A registra la compra en cuotas y un contado vivo (control: el total no da cero por casualidad).
set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

insert into _test_context (compra_id)
select create_transaction('expense', 120000, 'ARS', null, 'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 12, '2026-08-15', 'Notebook en cuotas');

select ok(
  (select compra_id is not null from _test_context),
  'la compra en 12 cuotas de usuario A se registra'
);

select lives_ok(
  $$select create_transaction('expense', 5000, 'ARS', null, 'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 1, '2026-08-20', 'Almacén de contado')$$,
  'el gasto de contado (control) de usuario A se registra'
);

-- Usuario B registra una compra propia en 5 cuotas desde 2026-09, cuya última imputación cae en
-- 2027-01, para confirmar que RLS no la mezcla con A. Fecha pasada: FR-06 no admite fechas futuras.
set local role authenticated;
set local request.jwt.claims = '{"sub":"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb","role":"authenticated"}';

select lives_ok(
  $$select create_transaction('expense', 40000, 'ARS', null, 'c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000003', 5, '2026-09-10', 'Compra ajena en cuotas')$$,
  'la compra de usuario B con cuota en 2027-01 se registra (control de aislamiento)'
);

-- Volvemos a la sesión de A para evaluar los totales tal como los ve el dashboard bajo RLS.
set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

-- 1. Antes de borrar: total del período de nacimiento (2026-08) incluye la primera cuota + el contado.
select is(
  (select coalesce(sum(le.amount_ars), 0.00) from ledger_entries le
     join transactions t on t.id = le.transaction_id
    where t.type = 'expense' and t.deleted_at is null and le.period = '2026-08-01'),
  15000.00::numeric,
  'antes de borrar: total 2026-08 = 15000.00 (10000 de la cuota 1 + 5000 de contado)'
);

-- 2. Antes de borrar: total del período heredado (2027-01) solo tiene la cuota de A, no el gasto de B.
select is(
  (select coalesce(sum(le.amount_ars), 0.00) from ledger_entries le
     join transactions t on t.id = le.transaction_id
    where t.type = 'expense' and t.deleted_at is null and le.period = '2027-01-01'),
  10000.00::numeric,
  'antes de borrar: total 2027-01 = 10000.00 (solo la cuota heredada de A, sin mezclar con B)'
);

-- 3. Usuario A elimina la compra en cuotas.
select lives_ok(
  format('select delete_transaction(%L::uuid)', (select compra_id from _test_context)),
  'usuario A elimina su compra en cuotas'
);

-- 4. Después de borrar: el período de nacimiento ya no incluye esa imputación, solo el contado.
select is(
  (select coalesce(sum(le.amount_ars), 0.00) from ledger_entries le
     join transactions t on t.id = le.transaction_id
    where t.type = 'expense' and t.deleted_at is null and le.period = '2026-08-01'),
  5000.00::numeric,
  'después de borrar: total 2026-08 = 5000.00 (solo queda el contado)'
);

-- 5. Después de borrar: el período heredado (2027-01) queda en cero.
select is(
  (select coalesce(sum(le.amount_ars), 0.00) from ledger_entries le
     join transactions t on t.id = le.transaction_id
    where t.type = 'expense' and t.deleted_at is null and le.period = '2027-01-01'),
  0.00::numeric,
  'después de borrar: total 2027-01 = 0.00 (coalesce a cero, I10)'
);

-- 6. Ninguna de las 12 imputaciones de la compra cuenta en ningún período tras el borrado.
select is(
  (select count(*) from ledger_entries le
     join transactions t on t.id = le.transaction_id
    where le.transaction_id = (select compra_id from _test_context) and t.deleted_at is null),
  0::bigint,
  'I10: ninguna imputación de la compra cuenta como activa tras el borrado'
);

-- 7. La suma de todos los períodos que tocó la compra (2026-08 a 2027-07) da lo mismo que antes
--    de que existiera: solo el contado de 5000.00, sin rastro de las 12 cuotas borradas.
select is(
  (select coalesce(sum(le.amount_ars), 0.00) from ledger_entries le
     join transactions t on t.id = le.transaction_id
    where t.type = 'expense' and t.deleted_at is null
      and le.period between '2026-08-01' and '2027-07-01'),
  5000.00::numeric,
  'I10: la suma de los 12 períodos que tocaba la compra no incluye nada de ella tras el borrado'
);

-- 8. Por categoría (consulta 3): 2026-08 solo suma el contado.
select is(
  (select coalesce(sum(le.amount_ars), 0.00) from ledger_entries le
     join transactions t on t.id = le.transaction_id
    where t.type = 'expense' and t.deleted_at is null and le.period = '2026-08-01'
      and t.category_id = 'c0000000-0000-0000-0000-000000000001'),
  5000.00::numeric,
  'por categoría: 2026-08 solo suma 5000.00 tras el borrado'
);

-- 9. Por cuenta (consulta 4): 2026-08 solo suma el contado, la cuenta de la compra borrada queda en cero.
select is(
  (select coalesce(sum(le.amount_ars), 0.00) from ledger_entries le
     join transactions t on t.id = le.transaction_id
    where t.type = 'expense' and t.deleted_at is null and le.period = '2026-08-01'
      and t.account_id = 'a0000000-0000-0000-0000-000000000002'),
  5000.00::numeric,
  'por cuenta: 2026-08 solo suma 5000.00 (efectivo del contado) tras el borrado'
);

select is(
  (select coalesce(sum(le.amount_ars), 0.00) from ledger_entries le
     join transactions t on t.id = le.transaction_id
    where t.type = 'expense' and t.deleted_at is null and le.period = '2026-08-01'
      and t.account_id = 'a0000000-0000-0000-0000-000000000001'),
  0.00::numeric,
  'por cuenta: la tarjeta de la compra borrada no suma nada en 2026-08'
);

-- 10. C10: el borrado es lógico. Las 12 imputaciones siguen existiendo físicamente...
reset role;
select is(
  (select count(*) from ledger_entries where transaction_id = (select compra_id from _test_context)),
  12::bigint,
  'C10: las 12 imputaciones no se borran físicamente de ledger_entries'
);

-- 11. ...y la transacción también sigue existiendo, marcada con deleted_at.
select ok(
  (select deleted_at is not null from transactions where id = (select compra_id from _test_context)),
  'C10: la transacción borrada conserva su fila con deleted_at no nulo'
);

select * from finish();
rollback;
