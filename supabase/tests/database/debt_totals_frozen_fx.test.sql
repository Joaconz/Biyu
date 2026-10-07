-- US-37 (#227) · CA-6, C5: los totales de Deudas suman el amount_ars de cada deuda, que se calcula
-- con su propio fx_rate. Cambiar el TC de referencia del mes no lo reescribe.
begin;
select plan(3);

insert into auth.users (id, instance_id, aud, role, email) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','00000000-0000-0000-0000-000000000000','authenticated','authenticated','a@test.local');
-- Juan US$40,00 a TC 1250, una deuda suelta pendiente a favor. Hoy solo el dueño de la tabla la
-- inserta así; la carga por la app llega con su propia historia.
insert into debts (id, user_id, person, amount, currency, fx_rate, direction, incurred_on) values
  ('d0000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Juan',40,'USD',1250,'owed_to_me','2026-10-01');

set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';

select lives_ok($$select upsert_fx_rate('2026-10-01', 1250)$$, 'TC de referencia de octubre en 1250');
select lives_ok($$select upsert_fx_rate('2026-10-01', 1400)$$, 'se cambia el TC de referencia de octubre a 1400');
select is((select amount_ars from debts where id = 'd0000000-0000-0000-0000-000000000001'), 50000.00::numeric,
  'CA-6: la deuda de Juan sigue valiendo $50.000,00 (40 × 1250), no 40 × 1400');

select * from finish();
rollback;
