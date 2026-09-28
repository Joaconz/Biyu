-- Consulta 5 del dashboard (04-data-model), US-16, FR-20: cuotas heredadas = imputaciones del
-- período con installment_number > 1, de gastos no borrados (I10), leídas bajo RLS (C7).
begin;
select plan(6);

insert into auth.users (id, instance_id, aud, role, email) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','00000000-0000-0000-0000-000000000000','authenticated','authenticated','a@test.local'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b@test.local');
insert into categories (id, user_id, name) values
  ('c0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Tecnología');
insert into accounts (id, user_id, name, type, currency) values
  ('a0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Visa','credit_card','ARS');

create temporary table _test_context (tx_id uuid);
grant all on _test_context to public;

-- Misma forma que fetchMonthlyLedgerEntries + computeMonthlySummary: suma de amount_ars de
-- imputaciones del período, de gastos no borrados, con installment_number > 1.
create function pg_temp.inherited(p_period date) returns numeric language sql as $$
  select coalesce(sum(le.amount_ars), 0)
  from ledger_entries le
  join transactions t on t.id = le.transaction_id
  where le.period = p_period and t.type = 'expense' and t.deleted_at is null
    and le.installment_number > 1
$$;
create function pg_temp.total(p_period date) returns numeric language sql as $$
  select coalesce(sum(le.amount_ars), 0)
  from ledger_entries le
  join transactions t on t.id = le.transaction_id
  where le.period = p_period and t.type = 'expense' and t.deleted_at is null
$$;
grant execute on all functions in schema pg_temp to public;

set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

-- Escenario BDD "el dashboard separa cuotas heredadas": 120000 en 12 cuotas registrado en 2026-08.
insert into _test_context (tx_id)
select create_transaction('expense',120000,'ARS',null,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',12,'2026-08-15','Notebook');

select is(pg_temp.total('2026-09-01'), 10000.00, '2026-09: el total del período incluye 10000');
select is(pg_temp.inherited('2026-09-01'), 10000.00, '2026-09: el KPI de cuotas de meses anteriores es 10000');
select is(pg_temp.inherited('2026-08-01'), 0::numeric, '2026-08: la cuota 1 no es heredada');

-- C7: otra sesión no ve las imputaciones ajenas.
set local request.jwt.claims = '{"sub":"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb","role":"authenticated"}';
select is(pg_temp.inherited('2026-09-01'), 0::numeric, 'otra sesión ve 0 cuotas heredadas (C7)');

-- I10: la transacción borrada deja de aportar al KPI.
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';
select lives_ok(format('select delete_transaction(%L::uuid)', (select tx_id from _test_context)), 'se borra la compra en cuotas');
select is(pg_temp.inherited('2026-09-01'), 0::numeric, 'borrada, no aporta al KPI (I10)');

select * from finish();
rollback;
