-- US-22 (C5, ADR-002): una transacción conserva la cotización usada al registrarse.
begin;
select plan(3);

insert into auth.users (id, instance_id, aud, role, email) values
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '00000000-0000-0000-0000-000000000000',
   'authenticated', 'authenticated', 'cotizacion@test.local');

set local role authenticated;
set local request.jwt.claims = '{"sub":"cccccccc-cccc-cccc-cccc-cccccccccccc","role":"authenticated"}';

insert into categories (id, name) values
  ('c0000000-0000-0000-0000-000000000022', 'Compras ficticias');
insert into accounts (id, name, type, currency) values
  ('a0000000-0000-0000-0000-000000000022', 'Tarjeta ficticia', 'credit_card', 'USD');
insert into fx_rates (period, ars_per_usd) values
  ('2026-08-01', 1250.0000);

select lives_ok(
  $$select create_transaction(
    'expense', 100, 'USD', 1250,
    'c0000000-0000-0000-0000-000000000022',
    'a0000000-0000-0000-0000-000000000022',
    1, '2026-08-15', 'Compra ficticia en USD'
  )$$,
  'US-22: la transacción USD se registra por RPC con la cotización vigente'
);

update fx_rates
set ars_per_usd = 1400.0000
where period = '2026-08-01';

select is(
  (select ars_per_usd from fx_rates where period = '2026-08-01'),
  1400.0000::numeric,
  'US-22: la cotización mensual cambia a 1400 para el usuario autenticado'
);

select results_eq(
  $$
    select t.fx_rate, t.amount_ars, sum(le.amount_ars)::numeric
    from transactions t
    join ledger_entries le on le.transaction_id = t.id
    where t.description = 'Compra ficticia en USD'
    group by t.id, t.fx_rate, t.amount_ars
  $$,
  $$values (1250.0000::numeric, 125000.00::numeric, 125000.00::numeric)$$,
  'US-22: la transacción conserva fx_rate 1250 y total imputado 125000 aunque cambie fx_rates'
);

select * from finish();
rollback;
