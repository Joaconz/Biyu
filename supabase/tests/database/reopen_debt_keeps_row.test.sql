-- US-40 (#230): volver a pendiente corrige el estado sin tocar nada más de la deuda (C10: no se borra
-- el registro). Los rechazos de reopen_debt (CA-4) están en settle_reopen_debt.test.sql.
begin;
select plan(7);

insert into auth.users (id, instance_id, aud, role, email) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','00000000-0000-0000-0000-000000000000','authenticated','authenticated','a@test.local');
insert into categories (id, user_id, name) values
  ('c0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Tecnología');
insert into accounts (id, user_id, name, type, currency) values
  ('a0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Visa','credit_card','ARS');
-- Una suelta en US$ con nota, cargada como dueño de la tabla hasta que exista create_debt (US-36).
insert into debts (id, user_id, person, amount, currency, fx_rate, direction, incurred_on, notes) values
  ('d0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Juan',40,'USD',1250,'owed_to_me','2026-10-01','Préstamo en efectivo');

set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

-- Y una vinculada a un gasto, para ver que el vínculo también se conserva.
select set_config('t.tx', create_transaction(
  p_type => 'expense', p_amount => 120000, p_currency => 'ARS', p_fx_rate => null,
  p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => 'a0000000-0000-0000-0000-000000000001',
  p_installments_count => 1, p_occurred_on => '2026-08-15',
  p_shared_person => 'Sofía', p_shared_amount => 60000)::text, true);

create temp table before on commit drop as
  select id, person, amount, currency, fx_rate, amount_ars, direction, incurred_on, notes, transaction_id, created_at
    from debts order by id;

select lives_ok($$select settle_debt(id) from debts$$, 'se saldan las dos deudas');
select lives_ok($$select reopen_debt(id) from debts$$, 'CA-1: reopen_debt vuelve a pendiente las dos');
select is((select count(*) from debts where status = 'pending' and settled_at is null), 2::bigint,
  'CA-1: quedan pending con settled_at = null');
select results_eq(
  $$select id, person, amount, currency, fx_rate, amount_ars, direction, incurred_on, notes, transaction_id, created_at
      from debts order by id$$,
  $$select * from before$$,
  'CA-2: conservan id, persona, monto, moneda, fx_rate, fecha, nota y vínculo');

select lives_ok($$
  select settle_debt('d0000000-0000-0000-0000-000000000001'), reopen_debt('d0000000-0000-0000-0000-000000000001');
  select settle_debt('d0000000-0000-0000-0000-000000000001'), reopen_debt('d0000000-0000-0000-0000-000000000001');
  select settle_debt('d0000000-0000-0000-0000-000000000001'), reopen_debt('d0000000-0000-0000-0000-000000000001');
$$, 'CA-5: saldar y volver a pendiente tres veces seguidas');
select is((select count(*) from debts), 2::bigint, 'CA-2 / CA-5: no se crea otra fila ni se borra la existente');
select results_eq(
  $$select id, person, amount, currency, fx_rate, amount_ars, direction, incurred_on, notes, transaction_id, created_at
      from debts order by id$$,
  $$select * from before$$,
  'CA-5: después de tres ciclos la deuda sigue siendo la misma fila, con los mismos datos');

select * from finish();
rollback;
