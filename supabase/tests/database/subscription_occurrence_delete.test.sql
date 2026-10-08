-- US-60 (#218), R2, I10, I11, C10, ADR-017: borrar un mes generado por una suscripción es el soft
-- delete de siempre (delete_transaction) y la puesta al día no lo vuelve a generar. Restaurarlo
-- (restore_transaction, DEF-007) lo vuelve a sumar sin crear una segunda transacción para ese mes.
-- A diferencia de US-53 R2 (subscription_catchup.test.sql), el borrado y la restauración pasan por
-- las RPC públicas con la sesión del usuario, como lo hace la UI. La puesta al día se llama con
-- p_today fijo ("Cómo leer este documento", entrega-2/historias/suscripciones.md).
-- Datos ficticios; todo se revierte (ADR-015).
begin;
select plan(12);

-- ---------------------------------------------------------------------------
-- Fixtures (como dueño de las tablas: authenticated no inserta en subscriptions, ADR-030)
-- ---------------------------------------------------------------------------
insert into auth.users (id, instance_id, aud, role, email) values
  ('60a00000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us60a@test.local');
insert into categories (id, user_id, name) values
  ('c6000000-0000-0000-0000-000000000001','60a00000-0000-0000-0000-000000000001','Streaming');
insert into accounts (id, user_id, name, type, currency) values
  ('a6000000-0000-0000-0000-000000000001','60a00000-0000-0000-0000-000000000001','Visa','credit_card','ARS');

-- $5.000,00 ARS, día 10, desde mayo 2026; la puesta al día del 2026-08-15 genera mayo a agosto.
insert into subscriptions (id, user_id, name, amount, currency, category_id, account_id, billing_day,
                           start_period, generate_from_period, status) values
  ('d6000000-0000-0000-0000-000000000001','60a00000-0000-0000-0000-000000000001','Netflix', 5000.00, 'ARS',
   'c6000000-0000-0000-0000-000000000001','a6000000-0000-0000-0000-000000000001', 10,
   '2026-05-01', '2026-05-01', 'active');

select is((catch_up_subscriptions('60a00000-0000-0000-0000-000000000001', '2026-08-15') ->> 'generated')::int, 4,
  'US-60 fixture: la puesta al día del 2026-08-15 genera mayo a agosto 2026');

select set_config('t.june', (select id::text from transactions
  where subscription_id = 'd6000000-0000-0000-0000-000000000001' and subscription_period = '2026-06-01'), true);

-- ---------------------------------------------------------------------------
-- CA-1: borrar junio con delete_transaction y volver a correr la puesta al día
-- ---------------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claims = '{"sub":"60a00000-0000-0000-0000-000000000001","role":"authenticated"}';

select lives_ok($$ select delete_transaction(current_setting('t.june')::uuid) $$,
  'US-60 CA-1: el usuario borra la ocurrencia de junio 2026 con delete_transaction');

reset role;

select isnt((select deleted_at from transactions where id = current_setting('t.june')::uuid), null,
  'US-60 CA-1 / C10: el borrado es lógico, junio queda con deleted_at');

select is((catch_up_subscriptions('60a00000-0000-0000-0000-000000000001', '2026-08-15') ->> 'generated')::int, 0,
  'US-60 CA-1 / R2: la puesta al día posterior al borrado devuelve generated = 0');
-- Un mes después, la puesta al día genera septiembre y nada más: junio sigue sin volver.
select is((catch_up_subscriptions('60a00000-0000-0000-0000-000000000001', '2026-09-15') ->> 'generated')::int, 1,
  'US-60 CA-1 / R2: la del 2026-09-15 genera solo septiembre 2026');
select is((select count(*) from transactions
            where subscription_id = 'd6000000-0000-0000-0000-000000000001' and subscription_period = '2026-06-01'), 1::bigint,
  'US-60 CA-1 / I11: junio 2026 sigue teniendo una sola transacción, la borrada');
select is((select count(*) from transactions
            where subscription_id = 'd6000000-0000-0000-0000-000000000001' and subscription_period = '2026-06-01'
              and deleted_at is null), 0::bigint,
  'US-60 CA-1: ninguna transacción vigente para junio 2026');

-- ---------------------------------------------------------------------------
-- CA-2: deja de sumar en el Resumen de junio 2026 (la consulta del Resumen filtra deleted_at, I10)
-- ---------------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claims = '{"sub":"60a00000-0000-0000-0000-000000000001","role":"authenticated"}';

select is((select coalesce(sum(le.amount_ars), 0) from ledger_entries le
             join transactions t on t.id = le.transaction_id
            where le.period = '2026-06-01' and t.deleted_at is null), 0.00::numeric,
  'US-60 CA-2 / I10: el gasto de junio 2026 vigente suma $0,00');
select is((select coalesce(sum(le.amount_ars), 0) from ledger_entries le
             join transactions t on t.id = le.transaction_id
            where le.period = '2026-07-01' and t.deleted_at is null), 5000.00::numeric,
  'US-60 CA-2: julio 2026 sigue sumando sus $5.000,00');

-- ---------------------------------------------------------------------------
-- CA-4: restaurarla la vuelve a sumar y no aparece una segunda transacción para junio
-- ---------------------------------------------------------------------------
select lives_ok($$ select restore_transaction(current_setting('t.june')::uuid) $$,
  'US-60 CA-4: el usuario restaura junio 2026 con restore_transaction');
select is((select coalesce(sum(le.amount_ars), 0) from ledger_entries le
             join transactions t on t.id = le.transaction_id
            where le.period = '2026-06-01' and t.deleted_at is null), 5000.00::numeric,
  'US-60 CA-4 / I10: restaurada, junio 2026 vuelve a sumar $5.000,00');

reset role;

select catch_up_subscriptions('60a00000-0000-0000-0000-000000000001', '2026-09-15');
select is((select count(*) from transactions
            where subscription_id = 'd6000000-0000-0000-0000-000000000001' and subscription_period = '2026-06-01'), 1::bigint,
  'US-60 CA-4 / I11: después de restaurar y poner al día, junio 2026 tiene una sola transacción');

select * from finish();
rollback;
