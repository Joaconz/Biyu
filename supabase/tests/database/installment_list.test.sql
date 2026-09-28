-- Listado del mes (US-17, US-31, FR-20): parte de ledger_entries del período con su transacción,
-- como fetchMonthlyTransactions. Cada fila trae installment_number e installments_count ("3/12"),
-- las compras en cuotas de meses anteriores aparecen con la cuota del período, y respeta C7 e I10.
begin;
select plan(7);

insert into auth.users (id, instance_id, aud, role, email) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','00000000-0000-0000-0000-000000000000','authenticated','authenticated','a@test.local'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b@test.local');
insert into categories (id, user_id, name) values
  ('c0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Tecnología');
insert into accounts (id, user_id, name, type, currency) values
  ('a0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Visa','credit_card','ARS');

create temporary table _test_context (tx_id uuid);
grant all on _test_context to public;

create function pg_temp.listing(p_period date)
returns table (description text, installment_number int, installments_count int, amount_ars numeric)
language sql as $$
  select t.description, le.installment_number, t.installments_count, le.amount_ars
  from ledger_entries le
  join transactions t on t.id = le.transaction_id
  where le.period = p_period and t.deleted_at is null
  order by t.occurred_on desc, t.created_at desc
$$;
grant execute on all functions in schema pg_temp to public;

set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

insert into _test_context (tx_id)
select create_transaction('expense',120000,'ARS',null,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',12,'2026-08-15','Notebook');
do $$ begin perform create_transaction('expense',5000,'ARS',null,'c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',1,'2026-10-02','Cable'); end $$;

select results_eq(
  $$select description, installment_number, installments_count, amount_ars from pg_temp.listing('2026-08-01')$$,
  $$values ('Notebook'::text, 1, 12, 10000.00::numeric)$$,
  '2026-08: la compra aparece como cuota 1/12 por 10000'
);
select results_eq(
  $$select description, installment_number, installments_count, amount_ars from pg_temp.listing('2026-10-01')$$,
  $$values ('Cable'::text, 1, 1, 5000.00::numeric), ('Notebook'::text, 3, 12, 10000.00::numeric)$$,
  '2026-10: la compra de agosto aparece como 3/12 junto al pago único del mes'
);
select results_eq(
  $$select installment_number from pg_temp.listing('2027-07-01')$$,
  $$values (12)$$,
  '2027-07: la última imputación es la 12/12'
);
select is_empty(
  $$select 1 from pg_temp.listing('2027-08-01')$$,
  '2027-08: ya no hay cuotas'
);

-- C7: otra sesión no ve el listado ajeno.
set local request.jwt.claims = '{"sub":"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb","role":"authenticated"}';
select is_empty($$select 1 from pg_temp.listing('2026-10-01')$$, 'otra sesión ve el listado vacío (C7)');

-- I10: borrada, la compra desaparece de todos los meses donde tenía cuota.
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';
select lives_ok(format('select delete_transaction(%L::uuid)', (select tx_id from _test_context)), 'se borra la compra en cuotas');
select results_eq(
  $$select description from pg_temp.listing('2026-10-01')$$,
  $$values ('Cable'::text)$$,
  'borrada, la cuota 3/12 sale del listado (I10)'
);

select * from finish();
rollback;
