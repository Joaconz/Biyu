-- US-46 / C5: alta y cambio del TC mensual por RPC sin reescribir transacciones históricas.
begin;
select plan(20);

-- Datos ficticios (C14). El gasto histórico congela 1250 aunque luego cambie la referencia.
insert into auth.users (id, instance_id, aud, role, email) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','00000000-0000-0000-0000-000000000000','authenticated','authenticated','a@test.local'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b@test.local');

insert into categories (id, user_id, name)
values ('c0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Comida');
insert into accounts (id, user_id, name, type, currency)
values ('a0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Billetera','wallet','USD');
insert into transactions (
  id, user_id, type, amount, currency, fx_rate, category_id, account_id,
  installments_count, first_period, occurred_on
) values (
  '70000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'expense',100,'USD',1250,'c0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',1,'2026-09-01','2026-09-15'
);

set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

select lives_ok(
  $$select upsert_fx_rate('2026-09-01', 1250)$$,
  'US-46: el dueño carga el TC de referencia por RPC'
);
select is((select ars_per_usd from fx_rates where period = '2026-09-01'), 1250.0000::numeric, 'US-46: se guarda el TC exacto');

select lives_ok(
  $$select upsert_fx_rate('2026-09-01', 1400)$$,
  'US-46: el dueño cambia el TC del mismo período'
);
select is((select count(*) from fx_rates where period = '2026-09-01'), 1::bigint, 'US-46: cambiar hace UPSERT y no duplica el período');
select is((select ars_per_usd from fx_rates where period = '2026-09-01'), 1400.0000::numeric, 'US-46: el TC queda actualizado');

select lives_ok(
  $$select upsert_fx_rate('2026-10-01', 1425.5000)$$,
  'US-46: se puede cargar otro período con cuatro decimales'
);

select throws_ok($$select upsert_fx_rate('2026-09-15', 1400)$$, '23514', null, 'C6: un período que no empieza el día 1 se rechaza');
select throws_ok($$select upsert_fx_rate('2026-11-01', 0)$$, '23514', null, 'C6: un TC igual a cero se rechaza');
select throws_ok($$select upsert_fx_rate('2026-11-01', 'NaN'::numeric)$$, '23514', null, 'C6: un TC NaN se rechaza');
select throws_ok($$select upsert_fx_rate('2026-11-01', 1400.12345)$$, '23514', null, 'C6: un TC con más de cuatro decimales se rechaza');
select throws_ok($$insert into fx_rates (period, ars_per_usd) values ('2026-11-01', 1500)$$, '42501', null, 'C4: authenticated no escribe fx_rates directo');
select throws_ok($$delete from fx_rates$$, '42501', null, 'C4: authenticated no borra fx_rates directo');

set local request.jwt.claims = '{"sub":"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb","role":"authenticated"}';
select throws_ok(
  $$insert into fx_rates (user_id, period, ars_per_usd) values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2026-12-01', 1700)$$,
  '42501', null, 'C7: otra sesión no inserta una referencia directa a nombre del dueño'
);
select lives_ok(
  $$select upsert_fx_rate('2026-09-01', 1600)$$,
  'C7: otra sesión carga su propia referencia para el mismo período'
);
select is((select ars_per_usd from fx_rates where period = '2026-09-01'), 1600.0000::numeric, 'C7: la otra sesión solo lee su referencia');

reset role;
select throws_ok(
  $$insert into fx_rates (user_id, period, ars_per_usd) values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2026-12-01', 'NaN'::numeric)$$,
  '23514', null, 'C6: el CHECK de tabla rechaza NaN incluso fuera de la RPC'
);
select is((select ars_per_usd from fx_rates where user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' and period = '2026-09-01'), 1400.0000::numeric, 'C7: la RPC de otra sesión no pisa la referencia del dueño');
select is((select amount_ars from transactions where id = '70000000-0000-0000-0000-000000000001'), 125000.00::numeric, 'C5: cambiar la referencia no altera el monto histórico');

set local role anon;
select throws_ok($$insert into fx_rates (period, ars_per_usd) values ('2026-12-01', 1700)$$, '42501', null, 'C7: anon no inserta fx_rates directo');
select throws_ok($$select upsert_fx_rate('2026-09-01', 1500)$$, '42501', null, 'C7: anon no puede ejecutar upsert_fx_rate');

select * from finish();
rollback;
