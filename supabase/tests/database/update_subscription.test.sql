-- US-59 (#217), ADR-030, ADR-032 y docs/06-suscripciones.md R3/R5/R7/R8: update_subscription es la única vía
-- para editar una suscripción. Fija CA-1 (un cambio de monto no toca lo ya generado y rige desde la próxima
-- ocurrencia, R7), CA-2 (los meses vencidos se generan con el monto ANTERIOR antes de aplicar el cambio),
-- CA-3 (día de cobro, categoría y medio de pago no tocan lo generado), CA-4 (renombrar no cambia la
-- descripción de lo generado), CA-5 (moneda y mes de inicio no se cambian), CA-6 (mes de fin), CA-7 (las
-- validaciones de US-52 valen al editar, con los mismos mensajes), CA-8 (una cancelada no se edita; una
-- pausada sí, sin generar), CA-9 (sin UPDATE directo), CA-10 (categoría o medio de pago archivados),
-- CA-11 (una terminada se edita y se extiende sin cargar los meses de hueco, R8), CA-12 (el día de cobro
-- nuevo ya vencido genera la ocurrencia del mes corriente), CA-13 (par de autorización, C7), la forma del
-- jsonb devuelto, que el piso generate_from_period no retrocede (I12) y que la función es security definer
-- con search_path fijo.
-- update_subscription siempre usa el hoy del servidor (ADR-021): las fechas son relativas al hoy argentino y
-- el test pasa cualquier día del mes. Para fijar otro "hoy" al armar el historial y para pedir la "próxima
-- ocurrencia" se llama a la función interna catch_up_subscriptions como dueño de la tabla. Datos ficticios;
-- todo se revierte (ADR-015).
begin;
select plan(164);

-- ---------------------------------------------------------------------------
-- Fixtures (como dueño de las tablas)
-- ---------------------------------------------------------------------------
--   A 59a…01  dueño de todas las suscripciones          B 59b…02  otra sesión
--   Categorías de A: c…01 Streaming, c…02 Servicios (activas), c…03 y c…04 (archivadas); de B: c…05
--   Medios de A:     a…01 Visa, a…02 Débito (activos), a…03 y a…04 (archivados); de B: a…05
--   d59…01 Plan Base     $5.000,00, 4 meses generados (CA-1)      d59…11 Terminada     fin = cur-2, generada
--   d59…02 Vencida       3 meses vencidos sin generar (CA-2)      d59…12 Terminada 2   fin = cur-2, generada
--   d59…03 Cobro         generada, cambia día/categoría/medio     d59…13 Con fin       fin = cur+3, generada
--   d59…04 Hulu          generada, se renombra (CA-4)             d59…14 Pausada term. pausada, fin = cur-3
--   d59…05 Netflix       activa (nombre repetido, CA-7)           d59…15 Cambio de día cobro por venir (CA-12)
--   d59…06 HBO           pausada (nombre repetido, CA-7)          d59…16 Dólares       USD sin fx_rates
--   d59…07 Spotify       cancelada (CA-7, CA-8)                   d59…17 De A          la tocan B y anon (CA-13)
--   d59…08 Editable      activa, aceptaciones (CA-7)              d59…18 Futura        inicio = cur+3 (CA-6)
--   d59…09 Pausada       pausada con meses vencidos (CA-8)        d59…19 Atrasada      meses vencidos, rechazos
--   d59…10 Con archivadas categoría y medio archivados (CA-10)
insert into auth.users (id, instance_id, aud, role, email) values
  ('59a00000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us59a@test.local'),
  ('59b00000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us59b@test.local');
insert into categories (id, user_id, name) values
  ('c5900000-0000-0000-0000-000000000001','59a00000-0000-0000-0000-000000000001','Streaming'),
  ('c5900000-0000-0000-0000-000000000002','59a00000-0000-0000-0000-000000000001','Servicios'),
  ('c5900000-0000-0000-0000-000000000003','59a00000-0000-0000-0000-000000000001','Vieja'),
  ('c5900000-0000-0000-0000-000000000004','59a00000-0000-0000-0000-000000000001','Vieja dos'),
  ('c5900000-0000-0000-0000-000000000005','59b00000-0000-0000-0000-000000000002','Ajena');
insert into accounts (id, user_id, name, type, currency) values
  ('a5900000-0000-0000-0000-000000000001','59a00000-0000-0000-0000-000000000001','Visa','credit_card','ARS'),
  ('a5900000-0000-0000-0000-000000000002','59a00000-0000-0000-0000-000000000001','Débito','cash','ARS'),
  ('a5900000-0000-0000-0000-000000000003','59a00000-0000-0000-0000-000000000001','Vieja','cash','ARS'),
  ('a5900000-0000-0000-0000-000000000004','59a00000-0000-0000-0000-000000000001','Vieja dos','cash','ARS'),
  ('a5900000-0000-0000-0000-000000000005','59b00000-0000-0000-0000-000000000002','Ajena','cash','ARS');

-- Fechas relativas al hoy argentino (ADR-021).
select set_config('t.today', (now() at time zone 'America/Argentina/Buenos_Aires')::date::text, true);
select set_config('t.cur', date_trunc('month', current_setting('t.today')::date)::date::text, true);
select set_config('t.m1', (current_setting('t.cur')::date - interval '1 month')::date::text, true);
select set_config('t.m2', (current_setting('t.cur')::date - interval '2 months')::date::text, true);
select set_config('t.m3', (current_setting('t.cur')::date - interval '3 months')::date::text, true);
select set_config('t.m4', (current_setting('t.cur')::date - interval '4 months')::date::text, true);
select set_config('t.m5', (current_setting('t.cur')::date - interval '5 months')::date::text, true);
select set_config('t.next', (current_setting('t.cur')::date + interval '1 month')::date::text, true);
select set_config('t.p2', (current_setting('t.cur')::date + interval '2 months')::date::text, true);
select set_config('t.p3', (current_setting('t.cur')::date + interval '3 months')::date::text, true);
select set_config('t.p5', (current_setting('t.cur')::date + interval '5 months')::date::text, true);
-- Último día del mes anterior (un "hoy" pasado) y del mes que viene (un "hoy" futuro: la próxima ocurrencia).
select set_config('t.prev_end', (current_setting('t.cur')::date - 1)::text, true);
select set_config('t.next_end', (current_setting('t.next')::date + interval '1 month - 1 day')::date::text, true);
select set_config('t.last', (current_setting('t.cur')::date + interval '1 month - 1 day')::date::text, true);
-- Una suscripción que no genera nada: período corriente con día de cobro mañana. Si hoy es el último día
-- del mes ningún día de cobro queda por venir (R4 recorta al último día), así que se usa el mes que viene.
select set_config('t.ng_start', case
  when current_setting('t.today')::date < current_setting('t.last')::date then current_setting('t.cur')
  else current_setting('t.next') end, true);
select set_config('t.ng_day', case
  when current_setting('t.today')::date < current_setting('t.last')::date
    then (extract(day from current_setting('t.today')::date)::int + 1)::text
  else '1' end, true);
-- CA-12: el día de cobro viejo todavía no venció (hoy + 1; el último día del mes no hay ninguno, y el caso
-- se degrada) y el nuevo es el 3. Solo es "real" si hoy es el día 3 o posterior y no es el último del mes.
select set_config('t.ca12_old', case
  when current_setting('t.today')::date < current_setting('t.last')::date
    then (extract(day from current_setting('t.today')::date)::int + 1)::text
  else '31' end, true);
select set_config('t.ca12_real', (extract(day from current_setting('t.today')::date) >= 3
  and current_setting('t.today')::date < current_setting('t.last')::date)::text, true);
-- "El mes de fin no puede ser anterior a octubre 2026", con nombres fijos en español (como create_subscription.test).
select set_config('t.msg_min_cur', 'El mes de fin no puede ser anterior a '
  || (array['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'])
       [extract(month from current_setting('t.cur')::date)::int]
  || ' ' || extract(year from current_setting('t.cur')::date)::int, true);
select set_config('t.msg_min_p3', 'El mes de fin no puede ser anterior a '
  || (array['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'])
       [extract(month from current_setting('t.p3')::date)::int]
  || ' ' || extract(year from current_setting('t.p3')::date)::int, true);

insert into subscriptions (id, user_id, name, amount, currency, category_id, account_id, billing_day,
                           start_period, end_period, generate_from_period, status, paused_at, cancelled_at) values
  ('d5900000-0000-0000-0000-000000000001','59a00000-0000-0000-0000-000000000001','Plan Base', 5000.00, 'ARS',
   'c5900000-0000-0000-0000-000000000001','a5900000-0000-0000-0000-000000000001', 1,
   current_setting('t.m3')::date, null, current_setting('t.m3')::date, 'active', null, null),
  ('d5900000-0000-0000-0000-000000000002','59a00000-0000-0000-0000-000000000001','Vencida', 3000.00, 'ARS',
   'c5900000-0000-0000-0000-000000000001','a5900000-0000-0000-0000-000000000001', 1,
   current_setting('t.m2')::date, null, current_setting('t.m2')::date, 'active', null, null),
  ('d5900000-0000-0000-0000-000000000003','59a00000-0000-0000-0000-000000000001','Cobro', 1000.00, 'ARS',
   'c5900000-0000-0000-0000-000000000001','a5900000-0000-0000-0000-000000000001', 1,
   current_setting('t.m1')::date, null, current_setting('t.m1')::date, 'active', null, null),
  ('d5900000-0000-0000-0000-000000000004','59a00000-0000-0000-0000-000000000001','Hulu', 800.00, 'ARS',
   'c5900000-0000-0000-0000-000000000001','a5900000-0000-0000-0000-000000000001', 1,
   current_setting('t.m1')::date, null, current_setting('t.m1')::date, 'active', null, null),
  ('d5900000-0000-0000-0000-000000000005','59a00000-0000-0000-0000-000000000001','Netflix', 1200.00, 'ARS',
   'c5900000-0000-0000-0000-000000000001','a5900000-0000-0000-0000-000000000001', current_setting('t.ng_day')::int,
   current_setting('t.ng_start')::date, null, current_setting('t.ng_start')::date, 'active', null, null),
  ('d5900000-0000-0000-0000-000000000006','59a00000-0000-0000-0000-000000000001','HBO', 900.00, 'ARS',
   'c5900000-0000-0000-0000-000000000001','a5900000-0000-0000-0000-000000000001', 5,
   current_setting('t.cur')::date, null, current_setting('t.next')::date, 'paused', now() - interval '1 day', null),
  ('d5900000-0000-0000-0000-000000000007','59a00000-0000-0000-0000-000000000001','Spotify', 700.00, 'ARS',
   'c5900000-0000-0000-0000-000000000001','a5900000-0000-0000-0000-000000000001', 5,
   current_setting('t.cur')::date, null, current_setting('t.cur')::date, 'cancelled', null, now() - interval '1 day'),
  ('d5900000-0000-0000-0000-000000000008','59a00000-0000-0000-0000-000000000001','Editable', 500.00, 'ARS',
   'c5900000-0000-0000-0000-000000000001','a5900000-0000-0000-0000-000000000001', current_setting('t.ng_day')::int,
   current_setting('t.ng_start')::date, null, current_setting('t.ng_start')::date, 'active', null, null),
  ('d5900000-0000-0000-0000-000000000009','59a00000-0000-0000-0000-000000000001','Pausada', 400.00, 'ARS',
   'c5900000-0000-0000-0000-000000000001','a5900000-0000-0000-0000-000000000001', 1,
   current_setting('t.m2')::date, null, current_setting('t.m2')::date, 'paused', now() - interval '1 day', null),
  ('d5900000-0000-0000-0000-000000000010','59a00000-0000-0000-0000-000000000001','Con archivadas', 900.00, 'ARS',
   'c5900000-0000-0000-0000-000000000003','a5900000-0000-0000-0000-000000000003', current_setting('t.ng_day')::int,
   current_setting('t.ng_start')::date, null, current_setting('t.ng_start')::date, 'active', null, null),
  ('d5900000-0000-0000-0000-000000000011','59a00000-0000-0000-0000-000000000001','Terminada', 600.00, 'ARS',
   'c5900000-0000-0000-0000-000000000001','a5900000-0000-0000-0000-000000000001', 1,
   current_setting('t.m4')::date, current_setting('t.m2')::date, current_setting('t.m4')::date, 'active', null, null),
  ('d5900000-0000-0000-0000-000000000012','59a00000-0000-0000-0000-000000000001','Terminada dos', 650.00, 'ARS',
   'c5900000-0000-0000-0000-000000000001','a5900000-0000-0000-0000-000000000001', 1,
   current_setting('t.m4')::date, current_setting('t.m2')::date, current_setting('t.m4')::date, 'active', null, null),
  ('d5900000-0000-0000-0000-000000000013','59a00000-0000-0000-0000-000000000001','Con fin', 550.00, 'ARS',
   'c5900000-0000-0000-0000-000000000001','a5900000-0000-0000-0000-000000000001', 1,
   current_setting('t.m2')::date, current_setting('t.p3')::date, current_setting('t.m2')::date, 'active', null, null),
  ('d5900000-0000-0000-0000-000000000014','59a00000-0000-0000-0000-000000000001','Pausada terminada', 450.00, 'ARS',
   'c5900000-0000-0000-0000-000000000001','a5900000-0000-0000-0000-000000000001', 1,
   current_setting('t.m5')::date, current_setting('t.m3')::date, current_setting('t.next')::date, 'paused', now() - interval '1 day', null),
  ('d5900000-0000-0000-0000-000000000015','59a00000-0000-0000-0000-000000000001','Cambio de día', 1000.00, 'ARS',
   'c5900000-0000-0000-0000-000000000001','a5900000-0000-0000-0000-000000000001', current_setting('t.ca12_old')::int,
   current_setting('t.cur')::date, null, current_setting('t.cur')::date, 'active', null, null),
  ('d5900000-0000-0000-0000-000000000016','59a00000-0000-0000-0000-000000000001','Dólares', 10.00, 'USD',
   'c5900000-0000-0000-0000-000000000001','a5900000-0000-0000-0000-000000000001', 1,
   current_setting('t.m1')::date, null, current_setting('t.m1')::date, 'active', null, null),
  ('d5900000-0000-0000-0000-000000000017','59a00000-0000-0000-0000-000000000001','De A', 500.00, 'ARS',
   'c5900000-0000-0000-0000-000000000001','a5900000-0000-0000-0000-000000000001', current_setting('t.ng_day')::int,
   current_setting('t.ng_start')::date, null, current_setting('t.ng_start')::date, 'active', null, null),
  ('d5900000-0000-0000-0000-000000000018','59a00000-0000-0000-0000-000000000001','Futura', 1500.00, 'ARS',
   'c5900000-0000-0000-0000-000000000001','a5900000-0000-0000-0000-000000000001', 5,
   current_setting('t.p3')::date, null, current_setting('t.p3')::date, 'active', null, null),
  ('d5900000-0000-0000-0000-000000000019','59a00000-0000-0000-0000-000000000001','Atrasada', 2000.00, 'ARS',
   'c5900000-0000-0000-0000-000000000001','a5900000-0000-0000-0000-000000000001', 1,
   current_setting('t.m2')::date, null, current_setting('t.m2')::date, 'active', null, null);

-- La categoría y el medio de "Con archivadas" se archivan después de crearla (CA-10), y dos más para elegir.
update categories set archived_at = now()
 where id in ('c5900000-0000-0000-0000-000000000003', 'c5900000-0000-0000-0000-000000000004');
update accounts set archived_at = now()
 where id in ('a5900000-0000-0000-0000-000000000003', 'a5900000-0000-0000-0000-000000000004');

-- Historial armado con puestas al día de control (como dueño de la tabla):
--   Plan Base: tres meses con "hoy" en el pasado (m3, m2, m1) y el corriente con el hoy real: 4 ocurrencias a $5.000,00.
select set_config('t.junk1', catch_up_subscriptions('59a00000-0000-0000-0000-000000000001',
  current_setting('t.prev_end')::date, 'd5900000-0000-0000-0000-000000000001')::text, true);
select set_config('t.junk2', catch_up_subscriptions('59a00000-0000-0000-0000-000000000001',
  current_setting('t.today')::date, 'd5900000-0000-0000-0000-000000000001')::text, true);
--   Cobro, Hulu, las dos terminadas y Con fin: todo lo vencido ya generado.
select set_config('t.junk3', catch_up_subscriptions('59a00000-0000-0000-0000-000000000001',
  current_setting('t.today')::date, 'd5900000-0000-0000-0000-000000000003')::text, true);
select set_config('t.junk4', catch_up_subscriptions('59a00000-0000-0000-0000-000000000001',
  current_setting('t.today')::date, 'd5900000-0000-0000-0000-000000000004')::text, true);
select set_config('t.junk5', catch_up_subscriptions('59a00000-0000-0000-0000-000000000001',
  current_setting('t.today')::date, 'd5900000-0000-0000-0000-000000000011')::text, true);
select set_config('t.junk6', catch_up_subscriptions('59a00000-0000-0000-0000-000000000001',
  current_setting('t.today')::date, 'd5900000-0000-0000-0000-000000000012')::text, true);
select set_config('t.junk7', catch_up_subscriptions('59a00000-0000-0000-0000-000000000001',
  current_setting('t.today')::date, 'd5900000-0000-0000-0000-000000000013')::text, true);

-- Fotos previas para comprobar que "no cambia" es literal (fila por fila).
select set_config('t.snap_tx_01', (select jsonb_agg(to_jsonb(t) order by t.id) from transactions t
  where t.subscription_id = 'd5900000-0000-0000-0000-000000000001')::text, true);
select set_config('t.snap_le_01', (select jsonb_agg(to_jsonb(le) order by le.transaction_id, le.installment_number)
  from ledger_entries le join transactions t on t.id = le.transaction_id
  where t.subscription_id = 'd5900000-0000-0000-0000-000000000001')::text, true);
select set_config('t.snap_rest_01', (select (to_jsonb(s) - 'amount')::text from subscriptions s
  where s.id = 'd5900000-0000-0000-0000-000000000001'), true);
select set_config('t.snap_tx_03', (select jsonb_agg(to_jsonb(t) order by t.id) from transactions t
  where t.subscription_id = 'd5900000-0000-0000-0000-000000000003')::text, true);
select set_config('t.snap_tx_04', (select jsonb_agg(to_jsonb(t) order by t.id) from transactions t
  where t.subscription_id = 'd5900000-0000-0000-0000-000000000004')::text, true);
select set_config('t.snap_17', (select to_jsonb(s)::text from subscriptions s
  where s.id = 'd5900000-0000-0000-0000-000000000017'), true);
select set_config('t.snap_09_rest', (select (to_jsonb(s) - 'amount')::text from subscriptions s
  where s.id = 'd5900000-0000-0000-0000-000000000009'), true);
select set_config('t.fp_14', (select generate_from_period::text from subscriptions
  where id = 'd5900000-0000-0000-0000-000000000014'), true);

-- ---------------------------------------------------------------------------
-- Sesión de A: las ediciones de CA-1 a CA-4
-- ---------------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claims = '{"sub":"59a00000-0000-0000-0000-000000000001","role":"authenticated"}';

select set_config('t.r01', update_subscription('d5900000-0000-0000-0000-000000000001', 'Plan Base', 7000.00,
  'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1, null, null)::text, true);
select set_config('t.r02', update_subscription('d5900000-0000-0000-0000-000000000002', 'Vencida', 4000.00,
  'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1, null, null)::text, true);
select set_config('t.r03', update_subscription('d5900000-0000-0000-0000-000000000003', 'Cobro', 1000.00,
  'c5900000-0000-0000-0000-000000000002', 'a5900000-0000-0000-0000-000000000002', 15, null, null)::text, true);
select set_config('t.r04', update_subscription('d5900000-0000-0000-0000-000000000004', 'Hulu Plus', 800.00,
  'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1, null, null)::text, true);

-- ---------------------------------------------------------------------------
-- Forma del jsonb: { generated_before, generated_after }, enteros
-- ---------------------------------------------------------------------------
select is((select array_agg(k order by k) from jsonb_object_keys(current_setting('t.r01')::jsonb) k),
  array['generated_after', 'generated_before'],
  'US-59: la RPC devuelve un jsonb con las claves generated_before y generated_after');
select is(jsonb_typeof(current_setting('t.r01')::jsonb -> 'generated_before'), 'number',
  'US-59: generated_before es un número JSON');
select is(jsonb_typeof(current_setting('t.r01')::jsonb -> 'generated_after'), 'number',
  'US-59: generated_after es un número JSON');
select ok((current_setting('t.r01')::jsonb ->> 'generated_before') ~ '^[0-9]+$'
      and (current_setting('t.r01')::jsonb ->> 'generated_after') ~ '^[0-9]+$',
  'US-59: ambos contadores son enteros no negativos, sin decimales');

-- ---------------------------------------------------------------------------
-- CA-1 / R7: el monto nuevo rige desde la próxima ocurrencia; lo generado no cambia (C5)
-- ---------------------------------------------------------------------------
select is((current_setting('t.r01')::jsonb ->> 'generated_before')::int, 0,
  'US-59 CA-1: con todo generado al editar, generated_before = 0');
select is((current_setting('t.r01')::jsonb ->> 'generated_after')::int, 0,
  'US-59 CA-1: cambiar solo el monto no genera nada nuevo (generated_after = 0)');
select is((select amount from subscriptions where id = 'd5900000-0000-0000-0000-000000000001'), 7000.00,
  'US-59 CA-1: la suscripción queda con $7.000,00');
select is((select count(*) from transactions
            where subscription_id = 'd5900000-0000-0000-0000-000000000001' and amount = 5000.00 and amount_ars = 5000.00),
  4::bigint,
  'US-59 CA-1 / C5 / R7: las 4 transacciones existentes siguen en $5.000,00');
select is((select jsonb_agg(to_jsonb(t) order by t.id) from transactions t
            where t.subscription_id = 'd5900000-0000-0000-0000-000000000001'),
  current_setting('t.snap_tx_01')::jsonb,
  'US-59 CA-1 / C5: las transacciones ya generadas quedan idénticas fila por fila');
select is((select jsonb_agg(to_jsonb(le) order by le.transaction_id, le.installment_number)
             from ledger_entries le join transactions t on t.id = le.transaction_id
            where t.subscription_id = 'd5900000-0000-0000-0000-000000000001'),
  current_setting('t.snap_le_01')::jsonb,
  'US-59 CA-1 / C5: sus imputaciones también quedan idénticas fila por fila');
select is((select sum(le.amount) from ledger_entries le join transactions t on t.id = le.transaction_id
            where t.subscription_id = 'd5900000-0000-0000-0000-000000000001'), 20000.00,
  'US-59 CA-1 / I1: las imputaciones existentes suman 4 x $5.000,00 = $20.000,00 exactos');
select is((select to_jsonb(s) - 'amount' from subscriptions s where s.id = 'd5900000-0000-0000-0000-000000000001'),
  current_setting('t.snap_rest_01')::jsonb,
  'US-59 CA-1: cambiar el monto no toca moneda, inicio, estado, piso ni ningún otro campo');

-- ---------------------------------------------------------------------------
-- CA-2: los meses vencidos se generan con el monto ANTERIOR antes de aplicar el cambio
-- ---------------------------------------------------------------------------
select is((current_setting('t.r02')::jsonb ->> 'generated_before')::int, 3,
  'US-59 CA-2: con 3 meses vencidos sin generar, generated_before = 3');
select is((current_setting('t.r02')::jsonb ->> 'generated_after')::int, 0,
  'US-59 CA-2: después del cambio no queda nada vencido (generated_after = 0)');
select is((select count(*) from transactions where subscription_id = 'd5900000-0000-0000-0000-000000000002'), 3::bigint,
  'US-59 CA-2: existen exactamente las 3 transacciones vencidas');
select is((select array_agg(subscription_period order by subscription_period) from transactions
            where subscription_id = 'd5900000-0000-0000-0000-000000000002'),
  array[current_setting('t.m2')::date, current_setting('t.m1')::date, current_setting('t.cur')::date],
  'US-59 CA-2 / R1: una transacción por período vencido, del mes de inicio al corriente');
select is((select count(*) from transactions
            where subscription_id = 'd5900000-0000-0000-0000-000000000002' and amount = 3000.00),
  3::bigint,
  'US-59 CA-2 / R7: las 3 se generaron con el monto ANTERIOR $3.000,00, no con el nuevo');
select is((select sum(le.amount) from ledger_entries le join transactions t on t.id = le.transaction_id
            where t.subscription_id = 'd5900000-0000-0000-0000-000000000002'), 9000.00,
  'US-59 CA-2 / I1: sus imputaciones suman 3 x $3.000,00 = $9.000,00 exactos');
select is((select amount from subscriptions where id = 'd5900000-0000-0000-0000-000000000002'), 4000.00,
  'US-59 CA-2: la suscripción queda con el monto nuevo $4.000,00');

-- ---------------------------------------------------------------------------
-- CA-3: día de cobro, categoría y medio de pago no tocan lo generado
-- ---------------------------------------------------------------------------
select is((current_setting('t.r03')::jsonb ->> 'generated_before')::int
        + (current_setting('t.r03')::jsonb ->> 'generated_after')::int, 0,
  'US-59 CA-3: el mes corriente ya estaba generado, así que cambiar el día de cobro no genera nada');
select is((select jsonb_agg(to_jsonb(t) order by t.id) from transactions t
            where t.subscription_id = 'd5900000-0000-0000-0000-000000000003'),
  current_setting('t.snap_tx_03')::jsonb,
  'US-59 CA-3 / C5: cambiar día de cobro, categoría y medio de pago deja las transacciones idénticas fila por fila');
select is((select count(*) from transactions
            where subscription_id = 'd5900000-0000-0000-0000-000000000003'
              and category_id = 'c5900000-0000-0000-0000-000000000001' and account_id = 'a5900000-0000-0000-0000-000000000001'),
  2::bigint,
  'US-59 CA-3: las transacciones generadas conservan la categoría y el medio de pago de entonces');
select ok((select billing_day = 15 and category_id = 'c5900000-0000-0000-0000-000000000002'
                  and account_id = 'a5900000-0000-0000-0000-000000000002'
             from subscriptions where id = 'd5900000-0000-0000-0000-000000000003'),
  'US-59 CA-3: la suscripción queda con el día 15, la categoría y el medio de pago nuevos');

-- ---------------------------------------------------------------------------
-- CA-4: renombrar no cambia la descripción de lo ya generado
-- ---------------------------------------------------------------------------
select is((select name from subscriptions where id = 'd5900000-0000-0000-0000-000000000004'), 'Hulu Plus',
  'US-59 CA-4: la suscripción queda con el nombre nuevo');
select is((select jsonb_agg(to_jsonb(t) order by t.id) from transactions t
            where t.subscription_id = 'd5900000-0000-0000-0000-000000000004'),
  current_setting('t.snap_tx_04')::jsonb,
  'US-59 CA-4 / C5: renombrar deja las transacciones ya generadas idénticas fila por fila');
select is((select count(*) from transactions
            where subscription_id = 'd5900000-0000-0000-0000-000000000004' and description = 'Hulu'),
  2::bigint,
  'US-59 CA-4: las 2 transacciones generadas siguen con la descripción "Hulu"');

-- ---------------------------------------------------------------------------
-- La próxima ocurrencia usa los valores nuevos (R7): puesta al día con un "hoy" del mes que viene
-- ---------------------------------------------------------------------------
reset role;
select set_config('t.nx01', catch_up_subscriptions('59a00000-0000-0000-0000-000000000001',
  current_setting('t.next_end')::date, 'd5900000-0000-0000-0000-000000000001')::text, true);
select set_config('t.nx03', catch_up_subscriptions('59a00000-0000-0000-0000-000000000001',
  current_setting('t.next_end')::date, 'd5900000-0000-0000-0000-000000000003')::text, true);
select set_config('t.nx04', catch_up_subscriptions('59a00000-0000-0000-0000-000000000001',
  current_setting('t.next_end')::date, 'd5900000-0000-0000-0000-000000000004')::text, true);

select is((current_setting('t.nx01')::jsonb ->> 'generated')::int, 1,
  'US-59 CA-1: la puesta al día del mes que viene genera una sola ocurrencia nueva');
select is((select amount from transactions
            where subscription_id = 'd5900000-0000-0000-0000-000000000001'
              and subscription_period = current_setting('t.next')::date), 7000.00,
  'US-59 CA-1 / R7: la próxima ocurrencia es de $7.000,00');
select is((select le.amount from ledger_entries le join transactions t on t.id = le.transaction_id
            where t.subscription_id = 'd5900000-0000-0000-0000-000000000001'
              and t.subscription_period = current_setting('t.next')::date), 7000.00,
  'US-59 CA-1 / I1: su imputación también es de $7.000,00');
select is((select count(*) from transactions
            where subscription_id = 'd5900000-0000-0000-0000-000000000001' and amount = 5000.00),
  4::bigint,
  'US-59 CA-1 / C5: las 4 anteriores siguen en $5.000,00 después de la nueva');
select is((select occurred_on from transactions
            where subscription_id = 'd5900000-0000-0000-0000-000000000003'
              and subscription_period = current_setting('t.next')::date),
  (current_setting('t.next')::date + 14),
  'US-59 CA-3 / R4: la próxima ocurrencia cae el día de cobro nuevo (15)');
select ok((select category_id = 'c5900000-0000-0000-0000-000000000002' and account_id = 'a5900000-0000-0000-0000-000000000002'
             from transactions where subscription_id = 'd5900000-0000-0000-0000-000000000003'
              and subscription_period = current_setting('t.next')::date),
  'US-59 CA-3 / R7: la próxima ocurrencia usa la categoría y el medio de pago nuevos');
select is((select description from transactions
            where subscription_id = 'd5900000-0000-0000-0000-000000000004'
              and subscription_period = current_setting('t.next')::date), 'Hulu Plus',
  'US-59 CA-4 / R7: la próxima ocurrencia usa el nombre nuevo como descripción');
select is((select count(*) from transactions
            where subscription_id = 'd5900000-0000-0000-0000-000000000004' and description = 'Hulu'),
  2::bigint,
  'US-59 CA-4: las viejas conservan "Hulu" después de generar la nueva');

-- ---------------------------------------------------------------------------
-- Rechazos (CA-5, CA-6, CA-7, CA-8, CA-10): ninguno cambia nada ni genera transacciones
-- ---------------------------------------------------------------------------
select set_config('t.bat_subs', (select jsonb_agg(to_jsonb(s) order by s.id) from subscriptions s)::text, true);
select set_config('t.bat_tx', (select jsonb_agg(to_jsonb(t) order by t.id) from transactions t)::text, true);
select set_config('t.bat_le', (select count(*) from ledger_entries)::text, true);
set local role authenticated;
set local request.jwt.claims = '{"sub":"59a00000-0000-0000-0000-000000000001","role":"authenticated"}';

-- CA-5: moneda y mes de inicio no se cambian, ni siquiera mandando el mismo valor
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000019', 'Atrasada', 2000.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1, null, null, 'ARS')$$,
  '23514', 'La moneda y el mes de inicio no se pueden cambiar',
  'US-59 CA-5: p_currency igual a la actual se rechaza con 23514');
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000019', 'Atrasada', 2000.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1, null, null, 'USD')$$,
  '23514', 'La moneda y el mes de inicio no se pueden cambiar',
  'US-59 CA-5: p_currency distinta de la actual se rechaza con 23514');
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000019', 'Atrasada', 2000.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1, null, null, null,
    current_setting('t.m2')::date)$$,
  '23514', 'La moneda y el mes de inicio no se pueden cambiar',
  'US-59 CA-5: p_start_period igual al actual se rechaza con 23514');
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000019', 'Atrasada', 2000.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1, null, null, null,
    current_setting('t.m1')::date)$$,
  '23514', 'La moneda y el mes de inicio no se pueden cambiar',
  'US-59 CA-5: p_start_period distinto del actual se rechaza con 23514');
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000019', 'Atrasada', 2000.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1, null, null, 'ARS',
    current_setting('t.m2')::date)$$,
  '23514', 'La moneda y el mes de inicio no se pueden cambiar',
  'US-59 CA-5: mandar moneda y mes de inicio a la vez también se rechaza con 23514');

-- CA-6: mes de fin. Atrasada empieza en m2: el mínimo es el período corriente.
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000019', 'Atrasada', 2000.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1,
    current_setting('t.m1')::date, null)$$,
  '23514', current_setting('t.msg_min_cur'),
  'US-59 CA-6 / I12: un mes de fin anterior al período corriente se rechaza con el mes mínimo en el mensaje');
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000019', 'Atrasada', 2000.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1,
    current_setting('t.m2')::date, null)$$,
  '23514', current_setting('t.msg_min_cur'),
  'US-59 CA-6 / I12: un mes de fin igual al de inicio (pero anterior al corriente) también se rechaza');
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000011', 'Terminada', 600.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1,
    current_setting('t.m1')::date, null)$$,
  '23514', current_setting('t.msg_min_cur'),
  'US-59 CA-6 / CA-11: a una terminada no se la puede "extender" a otro mes todavía pasado');
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000018', 'Futura', 1500.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 5,
    current_setting('t.p2')::date, null)$$,
  '23514', current_setting('t.msg_min_p3'),
  'US-59 CA-6 / I12: con inicio en el futuro el mínimo es el mes de inicio, no el corriente');
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000019', 'Atrasada', 2000.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1, date '2100-01-01', null)$$,
  '23514', 'El mes de fin puede ser como máximo diciembre 2099',
  'US-59 CA-6: un mes de fin posterior a diciembre 2099 se rechaza');
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000019', 'Atrasada', 2000.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1,
    (current_setting('t.p2')::date + 4), null)$$,
  '23514', 'El mes de fin tiene que ser el día 1 del mes',
  'US-59 CA-6: un mes de fin que no cae en día 1 se rechaza');
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000019', 'Atrasada', 2000.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1, date '2099-12-15', null)$$,
  '23514', 'El mes de fin tiene que ser el día 1 del mes',
  'US-59 CA-6: el día 15 de diciembre 2099 se rechaza por no ser día 1');

-- CA-7: nombre
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000019', '', 2000.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1, null, null)$$,
  '23514', 'Escribí un nombre', 'US-59 CA-7: nombre vacío se rechaza al editar');
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000019', '     ', 2000.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1, null, null)$$,
  '23514', 'Escribí un nombre', 'US-59 CA-7: nombre de solo espacios se rechaza al editar');
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000019', null, 2000.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1, null, null)$$,
  '23514', 'Escribí un nombre', 'US-59 CA-7: nombre null se rechaza al editar');
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000019', repeat('a', 61), 2000.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1, null, null)$$,
  '23514', 'El nombre admite hasta 60 caracteres', 'US-59 CA-7: nombre de 61 caracteres se rechaza al editar');
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000019', repeat('😀', 61), 2000.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1, null, null)$$,
  '23514', 'El nombre admite hasta 60 caracteres', 'US-59 CA-7: nombre de 61 emojis se rechaza (cuenta puntos de código)');
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000019', ' netflix ', 2000.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1, null, null)$$,
  '23505', 'Ya tenés una suscripción con ese nombre',
  'US-59 CA-7: " netflix " contra "Netflix" activa de OTRA suscripción se rechaza (sin mayúsculas ni espacios de borde)');
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000019', 'hbo', 2000.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1, null, null)$$,
  '23505', 'Ya tenés una suscripción con ese nombre',
  'US-59 CA-7: "hbo" contra "HBO" pausada de otra suscripción se rechaza');

-- CA-7: monto
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000019', 'Atrasada', 0,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1, null, null)$$,
  '23514', 'El monto debe ser mayor a cero', 'US-59 CA-7 / I4: monto 0 se rechaza al editar');
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000019', 'Atrasada', -100,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1, null, null)$$,
  '23514', 'El monto debe ser mayor a cero', 'US-59 CA-7 / I4: monto negativo se rechaza al editar');
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000019', 'Atrasada', null,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1, null, null)$$,
  '23514', 'El monto debe ser mayor a cero', 'US-59 CA-7 / I4: monto null se rechaza al editar');
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000019', 'Atrasada', 'NaN'::numeric,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1, null, null)$$,
  '23514', 'El monto debe ser mayor a cero', 'US-59 CA-7 / I4: monto NaN se rechaza al editar');
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000019', 'Atrasada', 10.001,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1, null, null)$$,
  '23514', 'El monto admite hasta 2 decimales', 'US-59 CA-7: monto con 3 decimales se rechaza al editar');
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000019', 'Atrasada', 1000000000000.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1, null, null)$$,
  '23514', 'El monto máximo es $999.999.999.999,99', 'US-59 CA-7: monto mayor al máximo en ARS se rechaza con el símbolo $');
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000016', 'Dólares', 1000000000000.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1, null, null)$$,
  '23514', 'El monto máximo es USD 999.999.999.999,99', 'US-59 CA-7: monto mayor al máximo en una suscripción USD se rechaza con USD');

-- CA-7: categoría, medio de pago, día de cobro y descripción
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000019', 'Atrasada', 2000.00,
    null, 'a5900000-0000-0000-0000-000000000001', 1, null, null)$$,
  '23514', 'Elegí una categoría', 'US-59 CA-7: categoría null se rechaza al editar');
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000019', 'Atrasada', 2000.00,
    'c5900000-0000-0000-0000-000000000001', null, 1, null, null)$$,
  '23514', 'Elegí un medio de pago', 'US-59 CA-7: medio de pago null se rechaza al editar');
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000019', 'Atrasada', 2000.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', null, null, null)$$,
  '23514', 'Indicá el día de cobro', 'US-59 CA-7: día de cobro null se rechaza al editar');
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000019', 'Atrasada', 2000.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 0, null, null)$$,
  '23514', 'El día de cobro va de 1 a 31', 'US-59 CA-7 / I13: día de cobro 0 se rechaza al editar');
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000019', 'Atrasada', 2000.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 32, null, null)$$,
  '23514', 'El día de cobro va de 1 a 31', 'US-59 CA-7 / I13: día de cobro 32 se rechaza al editar');
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000019', 'Atrasada', 2000.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1.5, null, null)$$,
  '23514', 'El día de cobro va de 1 a 31', 'US-59 CA-7 / I13: día de cobro 1,5 por API se rechaza al editar');
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000019', 'Atrasada', 2000.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1, null, repeat('d', 201))$$,
  '23514', 'La descripción admite hasta 200 caracteres', 'US-59 CA-7: descripción de 201 caracteres se rechaza al editar');

-- CA-8: una cancelada no se puede modificar (ni siquiera con datos válidos)
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000007', 'Spotify', 700.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 5, null, null)$$,
  '23514', 'Una suscripción cancelada no se puede modificar',
  'US-59 CA-8: editar una cancelada se rechaza con 23514');

-- CA-10: categoría o medio de pago no disponibles (archivados distintos del actual, o de otro usuario)
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000010', 'Con archivadas', 900.00,
    'c5900000-0000-0000-0000-000000000004', 'a5900000-0000-0000-0000-000000000003', current_setting('t.ng_day')::numeric, null, null)$$,
  '23503', 'La categoría no está disponible',
  'US-59 CA-10: elegir una categoría archivada DISTINTA de la actual se rechaza');
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000010', 'Con archivadas', 900.00,
    'c5900000-0000-0000-0000-000000000003', 'a5900000-0000-0000-0000-000000000004', current_setting('t.ng_day')::numeric, null, null)$$,
  '23503', 'El medio de pago no está disponible',
  'US-59 CA-10: elegir un medio de pago archivado DISTINTO del actual se rechaza');
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000019', 'Atrasada', 2000.00,
    'c5900000-0000-0000-0000-000000000003', 'a5900000-0000-0000-0000-000000000001', 1, null, null)$$,
  '23503', 'La categoría no está disponible',
  'US-59 CA-10: una categoría archivada se rechaza aunque la suscripción activa nunca la haya tenido');
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000019', 'Atrasada', 2000.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000003', 1, null, null)$$,
  '23503', 'El medio de pago no está disponible',
  'US-59 CA-10: un medio de pago archivado se rechaza aunque la suscripción activa nunca lo haya tenido');
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000010', 'Con archivadas', 900.00,
    'c5900000-0000-0000-0000-000000000005', 'a5900000-0000-0000-0000-000000000003', current_setting('t.ng_day')::numeric, null, null)$$,
  '23503', 'La categoría no está disponible',
  'US-59 CA-10 / C7: una categoría de otro usuario se rechaza');
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000010', 'Con archivadas', 900.00,
    'c5900000-0000-0000-0000-000000000003', 'a5900000-0000-0000-0000-000000000005', current_setting('t.ng_day')::numeric, null, null)$$,
  '23503', 'El medio de pago no está disponible',
  'US-59 CA-10 / C7: un medio de pago de otro usuario se rechaza');

-- Ningún rechazo cambió nada
select is((select jsonb_agg(to_jsonb(s) order by s.id) from subscriptions s), current_setting('t.bat_subs')::jsonb,
  'US-59 CA-5 a CA-10: ningún rechazo cambió ninguna suscripción');
select is((select jsonb_agg(to_jsonb(t) order by t.id) from transactions t), current_setting('t.bat_tx')::jsonb,
  'US-59 CA-5 a CA-10: ningún rechazo creó ni cambió transacciones');
select is((select count(*) from ledger_entries), current_setting('t.bat_le')::bigint,
  'US-59 CA-5 a CA-10: ningún rechazo creó imputaciones');
select is((select count(*) from transactions where subscription_id = 'd5900000-0000-0000-0000-000000000019'), 0::bigint,
  'US-59 CA-7 / ADR-030: con 3 meses vencidos pendientes, los rechazos no dejan ninguna puesta al día hecha');

-- ---------------------------------------------------------------------------
-- CA-7: aceptaciones en el borde, sobre una suscripción que no genera (Editable)
-- ---------------------------------------------------------------------------
select lives_ok($$select update_subscription('d5900000-0000-0000-0000-000000000008', 'Editable', 500.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', current_setting('t.ng_day')::numeric, null, null)$$,
  'US-59 CA-7: editar conservando el propio nombre no choca contra sí misma');
select lives_ok($$select update_subscription('d5900000-0000-0000-0000-000000000008', 'EDITABLE', 500.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', current_setting('t.ng_day')::numeric, null, null)$$,
  'US-59 CA-7: cambiar solo las mayúsculas del propio nombre no choca contra sí misma');
select is((select name from subscriptions where id = 'd5900000-0000-0000-0000-000000000008'), 'EDITABLE',
  'US-59 CA-7: el nombre se guarda con las mayúsculas nuevas');
select lives_ok($$select update_subscription('d5900000-0000-0000-0000-000000000008', '  Crunchyroll  ', 500.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', current_setting('t.ng_day')::numeric, null, '   ')$$,
  'US-59 CA-7: "  Crunchyroll  " con descripción de solo espacios se acepta');
select is((select name from subscriptions where id = 'd5900000-0000-0000-0000-000000000008'), 'Crunchyroll',
  'US-59 CA-7: el nombre se guarda recortado');
select is((select description from subscriptions where id = 'd5900000-0000-0000-0000-000000000008'), null,
  'US-59 CA-7: una descripción de solo espacios se guarda como null');
select lives_ok($$select update_subscription('d5900000-0000-0000-0000-000000000008', repeat('a', 60), 500.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', current_setting('t.ng_day')::numeric, null, null)$$,
  'US-59 CA-7: un nombre de 60 caracteres se acepta');
select lives_ok($$select update_subscription('d5900000-0000-0000-0000-000000000008', repeat('😀', 60), 500.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', current_setting('t.ng_day')::numeric, null, null)$$,
  'US-59 CA-7: un nombre de 60 emojis (60 puntos de código) se acepta');
select is((select char_length(name) from subscriptions where id = 'd5900000-0000-0000-0000-000000000008'), 60,
  'US-59 CA-7: el nombre de 60 emojis se guarda completo');
select lives_ok($$select update_subscription('d5900000-0000-0000-0000-000000000008', 'spotify', 500.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', current_setting('t.ng_day')::numeric, null,
    '  ' || repeat('d', 200) || '  ')$$,
  'US-59 CA-7: el nombre de una cancelada ("Spotify") se puede reutilizar, con una descripción de 200 caracteres');
select is((select description from subscriptions where id = 'd5900000-0000-0000-0000-000000000008'), repeat('d', 200),
  'US-59 CA-7: la descripción se guarda sin los espacios de los bordes');
select lives_ok($$select update_subscription('d5900000-0000-0000-0000-000000000008', 'spotify', 500.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', current_setting('t.ng_day')::numeric, null, '')$$,
  'US-59 CA-7: una descripción vacía se acepta');
select is((select description from subscriptions where id = 'd5900000-0000-0000-0000-000000000008'), null,
  'US-59 CA-7: una descripción vacía se guarda como null');
select lives_ok($$select update_subscription('d5900000-0000-0000-0000-000000000008', 'spotify', 999999999999.99,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 31, null, null)$$,
  'US-59 CA-7: el monto máximo $999.999.999.999,99 y el día de cobro 31 se aceptan');
select is((select amount from subscriptions where id = 'd5900000-0000-0000-0000-000000000008'), 999999999999.99,
  'US-59 CA-7: el monto máximo se guarda exacto');
select lives_ok($$select update_subscription('d5900000-0000-0000-0000-000000000008', 'spotify', 0.01,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1, null, null)$$,
  'US-59 CA-7: el monto mínimo $0,01 y el día de cobro 1 se aceptan');
select ok((select amount = 0.01 and billing_day = 1 from subscriptions where id = 'd5900000-0000-0000-0000-000000000008'),
  'US-59 CA-7: el monto mínimo y el día 1 quedan guardados');

-- ---------------------------------------------------------------------------
-- CA-6: aceptaciones y el mes de fin
-- ---------------------------------------------------------------------------
select lives_ok($$select update_subscription('d5900000-0000-0000-0000-000000000018', 'Futura', 1500.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 5, current_setting('t.p3')::date, null)$$,
  'US-59 CA-6 / I12: con inicio en el futuro, un mes de fin igual al de inicio se acepta');
select lives_ok($$select update_subscription('d5900000-0000-0000-0000-000000000018', 'Futura', 1500.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 5, date '2099-12-01', null)$$,
  'US-59 CA-6: el mes de fin diciembre 2099 se acepta');
select is((select end_period from subscriptions where id = 'd5900000-0000-0000-0000-000000000018'), date '2099-12-01',
  'US-59 CA-6: el mes de fin diciembre 2099 queda guardado');
select lives_ok($$select update_subscription('d5900000-0000-0000-0000-000000000018', 'Futura', 1500.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 5, null, null)$$,
  'US-59 CA-6: p_end_period null ("Sin fin") se acepta y quita el mes de fin');
select is((select end_period from subscriptions where id = 'd5900000-0000-0000-0000-000000000018'), null,
  'US-59 CA-6: null es "Sin fin": el mes de fin queda en null, no "no tocar"');

-- "Con fin" no está terminada (fin = cur+3): cambiar el mes de fin NO mueve el piso (CA-11)
select lives_ok($$select update_subscription('d5900000-0000-0000-0000-000000000013', 'Con fin', 550.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1, current_setting('t.p5')::date, null)$$,
  'US-59 CA-6: acortar o alargar el mes de fin de una suscripción vigente se acepta');
select is((select generate_from_period from subscriptions where id = 'd5900000-0000-0000-0000-000000000013'),
  current_setting('t.m2')::date,
  'US-59 CA-11 / R8: cambiar el mes de fin de una NO terminada no mueve el piso generate_from_period');
select lives_ok($$select update_subscription('d5900000-0000-0000-0000-000000000013', 'Con fin', 550.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1, null, null)$$,
  'US-59 CA-11: pasar una vigente a "Sin fin" se acepta');
select is((select generate_from_period from subscriptions where id = 'd5900000-0000-0000-0000-000000000013'),
  current_setting('t.m2')::date,
  'US-59 CA-11 / R8: pasar una vigente a "Sin fin" tampoco mueve el piso');
select lives_ok($$select update_subscription('d5900000-0000-0000-0000-000000000013', 'Con fin', 550.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1, current_setting('t.cur')::date, null)$$,
  'US-59 CA-6: un mes de fin igual al período corriente (el mínimo exacto) se acepta');
select is((select end_period from subscriptions where id = 'd5900000-0000-0000-0000-000000000013'),
  current_setting('t.cur')::date,
  'US-59 CA-6: el mes de fin igual al corriente queda guardado');
select is((select generate_from_period from subscriptions where id = 'd5900000-0000-0000-0000-000000000013'),
  current_setting('t.m2')::date,
  'US-59 CA-11 / R8: acortar el fin hasta el mes corriente tampoco mueve el piso');

-- ---------------------------------------------------------------------------
-- CA-8: una pausada se edita y no genera nada (R3)
-- ---------------------------------------------------------------------------
select set_config('t.r09', update_subscription('d5900000-0000-0000-0000-000000000009', 'Pausada', 450.00,
  'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1, null, null)::text, true);
select is((current_setting('t.r09')::jsonb ->> 'generated_before')::int
        + (current_setting('t.r09')::jsonb ->> 'generated_after')::int, 0,
  'US-59 CA-8 / R3: editar una pausada con 3 meses vencidos no genera nada');
select is((select amount from subscriptions where id = 'd5900000-0000-0000-0000-000000000009'), 450.00,
  'US-59 CA-8: la pausada queda con el monto nuevo');
select is((select to_jsonb(s) - 'amount' from subscriptions s where s.id = 'd5900000-0000-0000-0000-000000000009'),
  current_setting('t.snap_09_rest')::jsonb,
  'US-59 CA-8: editar una pausada conserva su estado, paused_at y piso');
select is((select count(*) from transactions where subscription_id = 'd5900000-0000-0000-0000-000000000009'), 0::bigint,
  'US-59 CA-8 / R3: la pausada sigue sin transacciones');

-- ---------------------------------------------------------------------------
-- CA-10: con la categoría y el medio de pago actuales archivados se puede cambiar lo demás
-- ---------------------------------------------------------------------------
select lives_ok($$select update_subscription('d5900000-0000-0000-0000-000000000010', 'Con archivadas', 950.00,
    'c5900000-0000-0000-0000-000000000003', 'a5900000-0000-0000-0000-000000000003', current_setting('t.ng_day')::numeric, null, null)$$,
  'US-59 CA-10: cambiar solo el monto con la categoría y el medio de pago actuales archivados se guarda');
select ok((select amount = 950.00 and category_id = 'c5900000-0000-0000-0000-000000000003'
                  and account_id = 'a5900000-0000-0000-0000-000000000003'
             from subscriptions where id = 'd5900000-0000-0000-0000-000000000010'),
  'US-59 CA-10: queda el monto nuevo y se conservan la categoría y el medio de pago archivados');
select lives_ok($$select update_subscription('d5900000-0000-0000-0000-000000000010', 'Con archivadas', 950.00,
    'c5900000-0000-0000-0000-000000000002', 'a5900000-0000-0000-0000-000000000002', current_setting('t.ng_day')::numeric, null, null)$$,
  'US-59 CA-10: pasar a una categoría y un medio de pago activos se acepta');
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000010', 'Con archivadas', 950.00,
    'c5900000-0000-0000-0000-000000000003', 'a5900000-0000-0000-0000-000000000002', current_setting('t.ng_day')::numeric, null, null)$$,
  '23503', 'La categoría no está disponible',
  'US-59 CA-10: una vez cambiada, volver a la archivada ya no vale (deja de ser "la actual")');

-- ---------------------------------------------------------------------------
-- CA-11: una terminada (fin anterior al corriente, status active)
-- ---------------------------------------------------------------------------
select set_config('t.fp_11', (select generate_from_period::text from subscriptions
  where id = 'd5900000-0000-0000-0000-000000000011'), true);
select set_config('t.r11a', update_subscription('d5900000-0000-0000-0000-000000000011', 'Terminada', 600.00,
  'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1,
  current_setting('t.m2')::date, 'Se canceló el servicio en el banco')::text, true);
select is((current_setting('t.r11a')::jsonb ->> 'generated_before')::int
        + (current_setting('t.r11a')::jsonb ->> 'generated_after')::int, 0,
  'US-59 CA-11: editar la descripción de una terminada (sin tocar el fin) no genera nada');
select is((select description from subscriptions where id = 'd5900000-0000-0000-0000-000000000011'),
  'Se canceló el servicio en el banco',
  'US-59 CA-11: la descripción de la terminada queda guardada');
select ok((select end_period = current_setting('t.m2')::date and generate_from_period = current_setting('t.fp_11')::date
             from subscriptions where id = 'd5900000-0000-0000-0000-000000000011'),
  'US-59 CA-11: un mes de fin igual al actual no se revalida ni mueve el piso');

-- Extender a "Sin fin": el piso pasa al período corriente y los meses del hueco no se cargan
select set_config('t.r11b', update_subscription('d5900000-0000-0000-0000-000000000011', 'Terminada', 600.00,
  'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1, null, null)::text, true);
select is((current_setting('t.r11b')::jsonb ->> 'generated_before')::int, 0,
  'US-59 CA-11: extender una terminada con todo lo vencido ya generado da generated_before = 0');
select is((current_setting('t.r11b')::jsonb ->> 'generated_after')::int, 1,
  'US-59 CA-11: extendida a "Sin fin" genera solo el período corriente (generated_after = 1)');
select is((select generate_from_period from subscriptions where id = 'd5900000-0000-0000-0000-000000000011'),
  current_setting('t.cur')::date,
  'US-59 CA-11 / R8: extender una terminada lleva generate_from_period al período corriente');
select is((select end_period from subscriptions where id = 'd5900000-0000-0000-0000-000000000011'), null,
  'US-59 CA-11: el mes de fin queda en "Sin fin"');
select is((select count(*) from transactions
            where subscription_id = 'd5900000-0000-0000-0000-000000000011'
              and subscription_period = current_setting('t.m1')::date), 0::bigint,
  'US-59 CA-11 / R8: el mes entre el fin viejo y hoy no se cargó');
select is((select array_agg(subscription_period order by subscription_period) from transactions
            where subscription_id = 'd5900000-0000-0000-0000-000000000011'),
  array[current_setting('t.m4')::date, current_setting('t.m3')::date, current_setting('t.m2')::date,
        current_setting('t.cur')::date],
  'US-59 CA-11: quedan las 3 ocurrencias de antes del fin y la del mes corriente, sin hueco cargado');

-- Extender a un mes de fin >= corriente
select set_config('t.r12', update_subscription('d5900000-0000-0000-0000-000000000012', 'Terminada dos', 650.00,
  'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1, current_setting('t.p2')::date, null)::text, true);
select is((current_setting('t.r12')::jsonb ->> 'generated_after')::int, 1,
  'US-59 CA-11: extendida a un mes de fin futuro genera solo el período corriente');
select is((select generate_from_period from subscriptions where id = 'd5900000-0000-0000-0000-000000000012'),
  current_setting('t.cur')::date,
  'US-59 CA-11 / R8: extender a un fin >= corriente también lleva el piso al período corriente');
select is((select end_period from subscriptions where id = 'd5900000-0000-0000-0000-000000000012'),
  current_setting('t.p2')::date,
  'US-59 CA-11: el mes de fin nuevo queda guardado');
select is((select count(*) from transactions
            where subscription_id = 'd5900000-0000-0000-0000-000000000012'
              and subscription_period = current_setting('t.m1')::date), 0::bigint,
  'US-59 CA-11 / R8: tampoco se cargó el mes del hueco');

-- I12: el piso nunca retrocede. Pausada terminada con el piso en el mes que viene, extendida a "Sin fin".
select lives_ok($$select update_subscription('d5900000-0000-0000-0000-000000000014', 'Pausada terminada', 450.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1, null, null)$$,
  'US-59 CA-11: extender una pausada terminada se acepta');
select is((select generate_from_period from subscriptions where id = 'd5900000-0000-0000-0000-000000000014'),
  current_setting('t.fp_14')::date,
  'US-59 I12 / R8: el piso (mes que viene) no retrocede al período corriente al extender');
select is((select status::text from subscriptions where id = 'd5900000-0000-0000-0000-000000000014'), 'paused',
  'US-59 CA-8: editar no la reanuda: sigue pausada');
select is((select count(*) from transactions where subscription_id = 'd5900000-0000-0000-0000-000000000014'), 0::bigint,
  'US-59 CA-8 / R3: la pausada extendida no genera nada');

-- ---------------------------------------------------------------------------
-- CA-12: el día de cobro nuevo ya venció: se crea la ocurrencia del mes corriente en la misma operación
-- (si hoy es 1, 2 o el último día del mes el caso se degrada a "no pasa nada" y los esperados lo reflejan)
-- ---------------------------------------------------------------------------
select set_config('t.r15', update_subscription('d5900000-0000-0000-0000-000000000015', 'Cambio de día', 1500.00,
  'c5900000-0000-0000-0000-000000000002', 'a5900000-0000-0000-0000-000000000002', 3, null, null)::text, true);
select is((current_setting('t.r15')::jsonb ->> 'generated_before')::int,
  (current_setting('t.today')::date = current_setting('t.last')::date)::int,
  'US-59 CA-12: con el día de cobro viejo todavía por venir, la primera puesta al día no genera');
select is((current_setting('t.r15')::jsonb ->> 'generated_after')::int, current_setting('t.ca12_real')::boolean::int,
  'US-59 CA-12 / R5: pasar el día de cobro de por-venir a 3 crea la ocurrencia del mes corriente (generated_after = 1)');
select is((select count(*) from transactions
            where subscription_id = 'd5900000-0000-0000-0000-000000000015'
              and occurred_on = current_setting('t.cur')::date + 2),
  current_setting('t.ca12_real')::boolean::int::bigint,
  'US-59 CA-12 / R4: la ocurrencia del mes corriente cae el día 3');
select is((select count(*) from transactions
            where subscription_id = 'd5900000-0000-0000-0000-000000000015'
              and occurred_on = current_setting('t.cur')::date + 2
              and amount = 1500.00 and category_id = 'c5900000-0000-0000-0000-000000000002'
              and account_id = 'a5900000-0000-0000-0000-000000000002'
              and description = 'Cambio de día' and subscription_period = current_setting('t.cur')::date),
  current_setting('t.ca12_real')::boolean::int::bigint,
  'US-59 CA-12 / R7: esa ocurrencia usa el monto, la categoría, el medio de pago y el nombre nuevos');
select is((select count(*) from transactions where subscription_id = 'd5900000-0000-0000-0000-000000000015'),
  (current_setting('t.ca12_real')::boolean or current_setting('t.today')::date = current_setting('t.last')::date)::int::bigint,
  'US-59 CA-12: no hay más ocurrencias que la del mes corriente');

-- ---------------------------------------------------------------------------
-- USD: editar sin tipo de cambio del mes vencido funciona; ese mes queda sin generar (R6)
-- ---------------------------------------------------------------------------
select set_config('t.r16', update_subscription('d5900000-0000-0000-0000-000000000016', 'Dólares', 12.00,
  'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1, null, null)::text, true);
select is((current_setting('t.r16')::jsonb ->> 'generated_before')::int, 0,
  'US-59 R6: editar una USD sin fx_rates del mes vencido no genera ni falla (generated_before = 0)');
select is((current_setting('t.r16')::jsonb ->> 'generated_after')::int, 0,
  'US-59 R6: tampoco genera después (generated_after = 0)');
select is((select amount from subscriptions where id = 'd5900000-0000-0000-0000-000000000016'), 12.00,
  'US-59 R6: la edición se guarda aunque no se pueda generar el mes');
select is((select count(*) from transactions where subscription_id = 'd5900000-0000-0000-0000-000000000016'), 0::bigint,
  'US-59 R6: el mes sin tipo de cambio queda sin generar');
select is((select currency::text from subscriptions where id = 'd5900000-0000-0000-0000-000000000016'), 'USD',
  'US-59: la moneda sigue siendo USD');

-- ---------------------------------------------------------------------------
-- CA-9: sin escritura directa sobre subscriptions (ADR-030)
-- ---------------------------------------------------------------------------
select throws_ok($$update subscriptions set amount = 1 where id = 'd5900000-0000-0000-0000-000000000017'$$,
  '42501', null, 'US-59 CA-9: UPDATE directo de amount con la sesión de authenticated se rechaza con 42501');
select throws_ok($$update subscriptions set status = 'paused', paused_at = now() where id = 'd5900000-0000-0000-0000-000000000017'$$,
  '42501', null, 'US-59 CA-9: UPDATE directo de status se rechaza con 42501');
select is((select to_jsonb(s)::text from subscriptions s where s.id = 'd5900000-0000-0000-0000-000000000017'),
  current_setting('t.snap_17'),
  'US-59 CA-9: los UPDATE directos rechazados no cambiaron la fila');

-- ---------------------------------------------------------------------------
-- CA-13: par de autorización de update_subscription (C7)
-- ---------------------------------------------------------------------------
set local request.jwt.claims = '{"sub":"59b00000-0000-0000-0000-000000000002","role":"authenticated"}';
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000017', 'Hackeada', 1.00,
    'c5900000-0000-0000-0000-000000000005', 'a5900000-0000-0000-0000-000000000005', 1, null, null)$$,
  'P0002', 'Suscripción no encontrada',
  'US-59 CA-13 / C7: con la sesión de B, editar una suscripción de A responde P0002');
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-0000000000ff', 'Nada', 1.00,
    'c5900000-0000-0000-0000-000000000005', 'a5900000-0000-0000-0000-000000000005', 1, null, null)$$,
  'P0002', 'Suscripción no encontrada',
  'US-59 CA-13 / C7: un uuid inexistente responde el mismo P0002 y mensaje (no revela si existe)');
select throws_ok($$select update_subscription(null, 'Nada', 1.00,
    'c5900000-0000-0000-0000-000000000005', 'a5900000-0000-0000-0000-000000000005', 1, null, null)$$,
  'P0002', 'Suscripción no encontrada',
  'US-59 CA-13 / C7: un id null también responde P0002');
select is((select count(*) from subscriptions where id = 'd5900000-0000-0000-0000-000000000017'), 0::bigint,
  'US-59 CA-13 / C7: B no ve la suscripción de A');

reset role;
select is((select to_jsonb(s)::text from subscriptions s where s.id = 'd5900000-0000-0000-0000-000000000017'),
  current_setting('t.snap_17'),
  'US-59 CA-13 / C7: los intentos de B no cambiaron la suscripción de A');
select is((select count(*) from transactions where subscription_id = 'd5900000-0000-0000-0000-000000000017'), 0::bigint,
  'US-59 CA-13 / C7: los intentos de B tampoco generaron transacciones para A');

set local role anon;
set local request.jwt.claims = '{"role":"anon"}';
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000017', 'Anon', 1.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1, null, null)$$,
  '42501', null, 'US-59 CA-13 / C7: anon no puede llamar a update_subscription (42501)');
reset role;

set local role authenticated;
set local request.jwt.claims = '{"role":"authenticated"}';
select throws_ok($$select update_subscription('d5900000-0000-0000-0000-000000000017', 'Sin sesión', 1.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', 1, null, null)$$,
  '42501', null, 'US-59 CA-13 / C7: authenticated sin sub (auth.uid() null) responde 42501');
reset role;

select is(has_function_privilege('anon',
    'public.update_subscription(uuid, text, numeric, uuid, uuid, numeric, date, text, currency_code, date)', 'execute'), false,
  'US-59 CA-13: anon no tiene execute sobre update_subscription');
select is(has_function_privilege('authenticated',
    'public.update_subscription(uuid, text, numeric, uuid, uuid, numeric, date, text, currency_code, date)', 'execute'), true,
  'US-59 CA-13: authenticated sí tiene execute sobre update_subscription');
select is((select to_jsonb(s)::text from subscriptions s where s.id = 'd5900000-0000-0000-0000-000000000017'),
  current_setting('t.snap_17'),
  'US-59 CA-13: tras anon y la sesión sin claims, la suscripción de A sigue igual');

-- Con la sesión dueña sigue funcionando (evita el falso verde de "todo se rechaza").
set local role authenticated;
set local request.jwt.claims = '{"sub":"59a00000-0000-0000-0000-000000000001","role":"authenticated"}';
select is((select count(*) from subscriptions where id = 'd5900000-0000-0000-0000-000000000017'), 1::bigint,
  'US-59 CA-13 / C7: la sesión dueña ve su suscripción');
select lives_ok($$select update_subscription('d5900000-0000-0000-0000-000000000017', 'De A', 600.00,
    'c5900000-0000-0000-0000-000000000001', 'a5900000-0000-0000-0000-000000000001', current_setting('t.ng_day')::numeric, null, null)$$,
  'US-59 CA-13 / C7: la sesión dueña sí puede editarla');
select is((select amount from subscriptions where id = 'd5900000-0000-0000-0000-000000000017'), 600.00,
  'US-59 CA-13: después de editar, queda con el monto nuevo');
reset role;

-- ---------------------------------------------------------------------------
-- I12: ninguna edición bajó el piso (generate_from_period solo sube o queda igual)
-- ---------------------------------------------------------------------------
select is((select count(*) from subscriptions
            where user_id = '59a00000-0000-0000-0000-000000000001' and generate_from_period < start_period), 0::bigint,
  'US-59 I12: ninguna suscripción quedó con generate_from_period por debajo de start_period');
select is((select generate_from_period from subscriptions where id = 'd5900000-0000-0000-0000-000000000001'),
  current_setting('t.m3')::date,
  'US-59 I12 / R8: editar una vigente nunca baja ni sube el piso');

-- ---------------------------------------------------------------------------
-- Definición de la función (ADR-030): security definer con search_path fijo
-- ---------------------------------------------------------------------------
select is((select prosecdef from pg_proc
            where oid = 'public.update_subscription(uuid, text, numeric, uuid, uuid, numeric, date, text, currency_code, date)'::regprocedure),
  true, 'US-59 / ADR-030: update_subscription es security definer');
select is((select proconfig from pg_proc
            where oid = 'public.update_subscription(uuid, text, numeric, uuid, uuid, numeric, date, text, currency_code, date)'::regprocedure),
  array['search_path=""'],
  'US-59 / ADR-030: search_path fijo y vacío (sin resolución por esquema)');
select is((select prorettype::regtype::text from pg_proc
            where oid = 'public.update_subscription(uuid, text, numeric, uuid, uuid, numeric, date, text, currency_code, date)'::regprocedure),
  'jsonb', 'US-59: update_subscription devuelve jsonb');

select * from finish();
rollback;
