-- US-35 (#225), ADR-037 §4: la deuda vinculada sigue la baja lógica de su gasto sin que se toque su
-- fila. Eliminar el gasto no cambia la deuda (CA-5) y restaurarlo la deja como estaba (CA-6). Que
-- no aparezca en Deudas lo resuelve la lectura (src/domain/debts.ts), con el deleted_at del gasto.
begin;
select plan(5);

insert into auth.users (id, instance_id, aud, role, email) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','00000000-0000-0000-0000-000000000000','authenticated','authenticated','a@test.local');
insert into categories (id, user_id, name) values
  ('c0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Tecnología');
insert into accounts (id, user_id, name, type, currency) values
  ('a0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Visa','credit_card','ARS');

set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

select set_config('t.tx', create_transaction(
  p_type => 'expense', p_amount => 120000, p_currency => 'ARS', p_fx_rate => null,
  p_category_id => 'c0000000-0000-0000-0000-000000000001', p_account_id => 'a0000000-0000-0000-0000-000000000001',
  p_installments_count => 12, p_occurred_on => '2026-08-15',
  p_shared_person => 'Sofía', p_shared_amount => 60000)::text, true);

-- Una deuda saldada, para ver que restaurar no la vuelve a pendiente. Se fija como dueño de la tabla
-- para tener un settled_at conocido; settle_debt pondría now() (US-39).
reset role;
update debts set status = 'settled', settled_at = '2026-08-20 15:00:00+00'
 where transaction_id = current_setting('t.tx')::uuid;
create temp table before on commit drop as
  select id, person, amount, amount_ars, currency, fx_rate, direction, status, settled_at, incurred_on, notes, transaction_id
    from debts where transaction_id = current_setting('t.tx')::uuid;
grant select on before to authenticated;
set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

select lives_ok($$select delete_transaction(current_setting('t.tx')::uuid)$$, 'se elimina el gasto compartido');
select results_eq(
  $$select id, person, amount, amount_ars, currency, fx_rate, direction, status, settled_at, incurred_on, notes, transaction_id
      from debts where transaction_id = current_setting('t.tx')::uuid$$,
  $$select * from before$$,
  'CA-5: eliminar el gasto no cambia la fila de su deuda (status, settled_at, amount iguales)');
select isnt((select deleted_at from transactions where id = current_setting('t.tx')::uuid), null,
  'CA-5: la deuda queda vinculada a un gasto con baja lógica, que es lo que la oculta de Deudas');

select lives_ok($$select restore_transaction(current_setting('t.tx')::uuid)$$, 'se restaura el gasto');
select results_eq(
  $$select id, person, amount, amount_ars, currency, fx_rate, direction, status, settled_at, incurred_on, notes, transaction_id
      from debts where transaction_id = current_setting('t.tx')::uuid$$,
  $$select * from before$$,
  'CA-6: al restaurar, la deuda vuelve con el mismo estado y la misma fecha de saldada');

select * from finish();
rollback;
