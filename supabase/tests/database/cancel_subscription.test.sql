-- US-58 (#216), ADR-030, ADR-032 y docs/06-suscripciones.md R3 / "Cancelar es irreversible a propósito":
-- cancel_subscription es la única vía para cancelar. Fija CA-1 (estado, cancelled_at y nada más, I15),
-- CA-2 (lo ya generado no cambia y sigue sumando), CA-3 (una cancelada no genera nunca más, R3),
-- CA-4 (los meses vencidos se generan antes de cancelar), CA-6 (una cancelada no vuelve a active ni a
-- paused), CA-7 (el nombre se puede reutilizar después de cancelar, ADR-032), CA-8 (cancelar una cancelada
-- falla y no cambia nada), CA-9 (par de autorización, C7), cancelar una pausada (no genera nada), la
-- cancelación con una ocurrencia bloqueada por R6, R2/C10/I10 (la baja lógica sigue y no se regenera), la
-- forma del jsonb devuelto y que la función es security definer con search_path fijo.
-- cancel_subscription siempre usa el hoy del servidor (ADR-021): las fechas son relativas al hoy argentino y
-- el test pasa cualquier día del mes (todas las suscripciones cobran el día 1, que siempre ya venció). Para
-- fijar otro "hoy" al armar el historial y en la puesta al día de control se llama a la función interna
-- catch_up_subscriptions como dueño de la tabla. Datos ficticios; todo se revierte (ADR-015).
begin;
select plan(97);

-- ---------------------------------------------------------------------------
-- Fixtures (como dueño de las tablas)
-- ---------------------------------------------------------------------------
--   A 58a…01  dueño de todas las suscripciones          B 58b…02  otra sesión
--   d58…01 Gimnasio    activa, 3 meses vencidos sin generar (CA-1, CA-4)
--   d58…02 Historial   3 ocurrencias ya generadas con hoy en el pasado; falta el corriente (CA-2)
--   d58…03 Al día      ya generada hasta hoy; se cancela y se prueban pausar/reanudar/cancelar (CA-6, CA-8)
--   d58…04 Con baja    como 03 pero con una ocurrencia dada de baja (R2, C10, I10)
--   d58…05 Pausada     paused con meses vencidos sin generar (R3)
--   d58…06 Dólares     USD sin fx_rates (R6)
--   d58…07 Control     activa, nunca se cancela
--   d58…08 Ya cancelada  cancelled desde ayer (CA-6, CA-8)
--   d58…09 De A        activa, la intenta cancelar B (CA-9)
--   d58…10 Spotify     activa (CA-7)                     d58…11 Disney  pausada (CA-7)
insert into auth.users (id, instance_id, aud, role, email) values
  ('58a00000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us58a@test.local'),
  ('58b00000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us58b@test.local');
insert into categories (id, user_id, name) values
  ('c5800000-0000-0000-0000-000000000001','58a00000-0000-0000-0000-000000000001','Streaming');
insert into accounts (id, user_id, name, type, currency) values
  ('a5800000-0000-0000-0000-000000000001','58a00000-0000-0000-0000-000000000001','Visa','credit_card','ARS');

-- Fechas relativas al hoy argentino (ADR-021).
select set_config('t.today', (now() at time zone 'America/Argentina/Buenos_Aires')::date::text, true);
select set_config('t.cur', date_trunc('month', current_setting('t.today')::date)::date::text, true);
select set_config('t.next', (current_setting('t.cur')::date + interval '1 month')::date::text, true);
-- Último día de dentro de 6 meses: un "hoy" futuro para el CA-3.
select set_config('t.far', (current_setting('t.cur')::date + interval '7 months - 1 day')::date::text, true);

insert into subscriptions (id, user_id, name, amount, currency, category_id, account_id, billing_day,
                           start_period, generate_from_period, status, paused_at, cancelled_at) values
  ('d5800000-0000-0000-0000-000000000001','58a00000-0000-0000-0000-000000000001','Gimnasio', 1234.50, 'ARS',
   'c5800000-0000-0000-0000-000000000001','a5800000-0000-0000-0000-000000000001', 1,
   (current_setting('t.cur')::date - interval '2 months')::date, (current_setting('t.cur')::date - interval '2 months')::date,
   'active', null, null),
  ('d5800000-0000-0000-0000-000000000002','58a00000-0000-0000-0000-000000000001','Historial', 2000.00, 'ARS',
   'c5800000-0000-0000-0000-000000000001','a5800000-0000-0000-0000-000000000001', 1,
   (current_setting('t.cur')::date - interval '3 months')::date, (current_setting('t.cur')::date - interval '3 months')::date,
   'active', null, null),
  ('d5800000-0000-0000-0000-000000000003','58a00000-0000-0000-0000-000000000001','Al día', 700.00, 'ARS',
   'c5800000-0000-0000-0000-000000000001','a5800000-0000-0000-0000-000000000001', 1,
   (current_setting('t.cur')::date - interval '1 month')::date, (current_setting('t.cur')::date - interval '1 month')::date,
   'active', null, null),
  ('d5800000-0000-0000-0000-000000000004','58a00000-0000-0000-0000-000000000001','Con baja', 800.00, 'ARS',
   'c5800000-0000-0000-0000-000000000001','a5800000-0000-0000-0000-000000000001', 1,
   (current_setting('t.cur')::date - interval '2 months')::date, (current_setting('t.cur')::date - interval '2 months')::date,
   'active', null, null),
  ('d5800000-0000-0000-0000-000000000005','58a00000-0000-0000-0000-000000000001','Pausada', 900.00, 'ARS',
   'c5800000-0000-0000-0000-000000000001','a5800000-0000-0000-0000-000000000001', 1,
   (current_setting('t.cur')::date - interval '2 months')::date, (current_setting('t.cur')::date - interval '2 months')::date,
   'paused', now() - interval '3 days', null),
  ('d5800000-0000-0000-0000-000000000006','58a00000-0000-0000-0000-000000000001','Dólares', 10.00, 'USD',
   'c5800000-0000-0000-0000-000000000001','a5800000-0000-0000-0000-000000000001', 1,
   (current_setting('t.cur')::date - interval '1 month')::date, (current_setting('t.cur')::date - interval '1 month')::date,
   'active', null, null),
  ('d5800000-0000-0000-0000-000000000007','58a00000-0000-0000-0000-000000000001','Control', 300.00, 'ARS',
   'c5800000-0000-0000-0000-000000000001','a5800000-0000-0000-0000-000000000001', 1,
   (current_setting('t.cur')::date - interval '1 month')::date, (current_setting('t.cur')::date - interval '1 month')::date,
   'active', null, null),
  ('d5800000-0000-0000-0000-000000000008','58a00000-0000-0000-0000-000000000001','Ya cancelada', 600.00, 'ARS',
   'c5800000-0000-0000-0000-000000000001','a5800000-0000-0000-0000-000000000001', 1,
   (current_setting('t.cur')::date - interval '1 month')::date, (current_setting('t.cur')::date - interval '1 month')::date,
   'cancelled', null, now() - interval '1 day'),
  ('d5800000-0000-0000-0000-000000000009','58a00000-0000-0000-0000-000000000001','De A', 500.00, 'ARS',
   'c5800000-0000-0000-0000-000000000001','a5800000-0000-0000-0000-000000000001', 1,
   current_setting('t.cur')::date, current_setting('t.cur')::date, 'active', null, null),
  ('d5800000-0000-0000-0000-000000000010','58a00000-0000-0000-0000-000000000001','Spotify', 100.00, 'ARS',
   'c5800000-0000-0000-0000-000000000001','a5800000-0000-0000-0000-000000000001', 5,
   current_setting('t.next')::date, current_setting('t.next')::date, 'active', null, null),
  ('d5800000-0000-0000-0000-000000000011','58a00000-0000-0000-0000-000000000001','Disney', 200.00, 'ARS',
   'c5800000-0000-0000-0000-000000000001','a5800000-0000-0000-0000-000000000001', 1,
   (current_setting('t.cur')::date - interval '1 month')::date, (current_setting('t.cur')::date - interval '1 month')::date,
   'paused', now() - interval '1 day', null);

-- Historial (CA-2): con un "hoy" fijo en el pasado (último día del mes anterior) se generan cur-3, cur-2 y
-- cur-1 a $2.000,00; falta cur. Después sube el monto vigente: lo ya generado conserva el de entonces (C5, R7).
select catch_up_subscriptions('58a00000-0000-0000-0000-000000000001', current_setting('t.cur')::date - 1,
  'd5800000-0000-0000-0000-000000000002');
update subscriptions set amount = 2500.00 where id = 'd5800000-0000-0000-0000-000000000002';
-- Al día y Con baja: puesta al día con el hoy actual; en Con baja se da de baja la ocurrencia del medio (R2).
select catch_up_subscriptions('58a00000-0000-0000-0000-000000000001', current_setting('t.today')::date,
  'd5800000-0000-0000-0000-000000000003');
select catch_up_subscriptions('58a00000-0000-0000-0000-000000000001', current_setting('t.today')::date,
  'd5800000-0000-0000-0000-000000000004');
update transactions set deleted_at = now()
 where subscription_id = 'd5800000-0000-0000-0000-000000000004'
   and subscription_period = (current_setting('t.cur')::date - interval '1 month')::date;

-- Fotos previas para comprobar que "no cambia" es literal.
select set_config('t.snap_02_tx', (select jsonb_agg(to_jsonb(t) order by t.id)
  from transactions t where t.subscription_id = 'd5800000-0000-0000-0000-000000000002')::text, true);
select set_config('t.snap_02_le', (select jsonb_agg(to_jsonb(le) order by le.id)
  from ledger_entries le join transactions t on t.id = le.transaction_id
  where t.subscription_id = 'd5800000-0000-0000-0000-000000000002')::text, true);
select set_config('t.snap_02_sums', (select jsonb_object_agg(q.p::text, q.s::text) from (
  select le.period p, sum(le.amount) s from ledger_entries le join transactions t on t.id = le.transaction_id
   where t.subscription_id = 'd5800000-0000-0000-0000-000000000002' and t.deleted_at is null group by le.period) q)::text, true);
select set_config('t.snap_03_tx', (select jsonb_agg(to_jsonb(t) order by t.id)
  from transactions t where t.subscription_id = 'd5800000-0000-0000-0000-000000000003')::text, true);
select set_config('t.snap_04_tx', (select jsonb_agg(to_jsonb(t) order by t.id)
  from transactions t where t.subscription_id = 'd5800000-0000-0000-0000-000000000004')::text, true);
select set_config('t.snap_04_le', (select jsonb_agg(to_jsonb(le) order by le.id)
  from ledger_entries le join transactions t on t.id = le.transaction_id
  where t.subscription_id = 'd5800000-0000-0000-0000-000000000004')::text, true);
select set_config('t.snap_01_rest', (select (to_jsonb(s) - 'status' - 'cancelled_at')::text
  from subscriptions s where s.id = 'd5800000-0000-0000-0000-000000000001'), true);
select set_config('t.snap_05_rest', (select (to_jsonb(s) - 'status' - 'cancelled_at')::text
  from subscriptions s where s.id = 'd5800000-0000-0000-0000-000000000005'), true);
select set_config('t.paused_at_05', (select paused_at::text from subscriptions where id = 'd5800000-0000-0000-0000-000000000005'), true);
select set_config('t.snap_07', (select to_jsonb(s)::text from subscriptions s where s.id = 'd5800000-0000-0000-0000-000000000007'), true);
select set_config('t.snap_08', (select to_jsonb(s)::text from subscriptions s where s.id = 'd5800000-0000-0000-0000-000000000008'), true);
select set_config('t.snap_09', (select to_jsonb(s)::text from subscriptions s where s.id = 'd5800000-0000-0000-0000-000000000009'), true);
select set_config('t.tx_total_before', (select count(*) from transactions where user_id = '58a00000-0000-0000-0000-000000000001')::text, true);

-- ---------------------------------------------------------------------------
-- Sesión de A: se cancelan las suscripciones
-- ---------------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claims = '{"sub":"58a00000-0000-0000-0000-000000000001","role":"authenticated"}';

select set_config('t.c01', cancel_subscription('d5800000-0000-0000-0000-000000000001')::text, true);
select set_config('t.c02', cancel_subscription('d5800000-0000-0000-0000-000000000002')::text, true);
select set_config('t.c03', cancel_subscription('d5800000-0000-0000-0000-000000000003')::text, true);
select set_config('t.c04', cancel_subscription('d5800000-0000-0000-0000-000000000004')::text, true);
select set_config('t.c05', cancel_subscription('d5800000-0000-0000-0000-000000000005')::text, true);
select set_config('t.c06', cancel_subscription('d5800000-0000-0000-0000-000000000006')::text, true);
reset role;

-- ---------------------------------------------------------------------------
-- La RPC devuelve { generated_before } con un entero
-- ---------------------------------------------------------------------------
select is((select array_agg(k order by k) from jsonb_object_keys(current_setting('t.c01')::jsonb) k), array['generated_before'],
  'US-58: la RPC devuelve un jsonb con la única clave generated_before');
select is(jsonb_typeof(current_setting('t.c01')::jsonb -> 'generated_before'), 'number',
  'US-58: generated_before es un número JSON');
select ok((current_setting('t.c01')::jsonb ->> 'generated_before') ~ '^[0-9]+$',
  'US-58: generated_before es un entero no negativo, sin decimales');

-- ---------------------------------------------------------------------------
-- CA-1: estado y cancelled_at; nada más cambia (I15)
-- ---------------------------------------------------------------------------
select is((select status::text from subscriptions where id = 'd5800000-0000-0000-0000-000000000001'), 'cancelled',
  'US-58 CA-1: tras cancelar, status = cancelled');
select ok((select cancelled_at is not null from subscriptions where id = 'd5800000-0000-0000-0000-000000000001'),
  'US-58 CA-1 / I15: cancelled_at no es null');
select ok((select abs(extract(epoch from (cancelled_at - now()))) < 5 from subscriptions where id = 'd5800000-0000-0000-0000-000000000001'),
  'US-58 CA-1: cancelled_at es ahora (a pocos segundos de now())');
select is((select to_jsonb(s) - 'status' - 'cancelled_at' from subscriptions s
            where s.id = 'd5800000-0000-0000-0000-000000000001'),
  current_setting('t.snap_01_rest')::jsonb,
  'US-58 CA-1: cancelar solo cambia status y cancelled_at (nombre, monto, día de cobro, piso, paused_at… intactos)');
select ok((select paused_at is null and generate_from_period = start_period
             from subscriptions where id = 'd5800000-0000-0000-0000-000000000001'),
  'US-58 CA-1: paused_at sigue null y generate_from_period no se mueve (cancelar no toca el piso)');
select is((select count(*) from subscriptions where user_id = '58a00000-0000-0000-0000-000000000001' and status = 'cancelled'),
  7::bigint,
  'US-58 CA-1: quedan canceladas exactamente las 6 que se cancelaron más la que ya lo estaba');
select is((select to_jsonb(s)::text from subscriptions s where s.id = 'd5800000-0000-0000-0000-000000000007'),
  current_setting('t.snap_07'),
  'US-58 CA-1: cancelar una suscripción no toca a las otras del usuario (la de control sigue idéntica)');
select is((select count(*) from transactions where subscription_id = 'd5800000-0000-0000-0000-000000000007'), 0::bigint,
  'US-58 CA-1: la puesta al día previa es solo de la cancelada: la de control no generó nada');
select is((select to_jsonb(s)::text from subscriptions s where s.id = 'd5800000-0000-0000-0000-000000000008'),
  current_setting('t.snap_08'),
  'US-58 CA-1: la que ya estaba cancelada tampoco cambió (mismo cancelled_at)');

-- ---------------------------------------------------------------------------
-- CA-4: los meses vencidos se generan al cancelar, antes de cambiar el estado
-- ---------------------------------------------------------------------------
select is((current_setting('t.c01')::jsonb ->> 'generated_before')::int, 3,
  'US-58 CA-4: inicio dos meses atrás con día 1 devuelve generated_before = 3');
select is((select count(*) from transactions where subscription_id = 'd5800000-0000-0000-0000-000000000001'), 3::bigint,
  'US-58 CA-4: existen exactamente las 3 transacciones vencidas');
select is((select array_agg(subscription_period order by subscription_period) from transactions
            where subscription_id = 'd5800000-0000-0000-0000-000000000001'),
  array[(current_setting('t.cur')::date - interval '2 months')::date,
        (current_setting('t.cur')::date - interval '1 month')::date,
        current_setting('t.cur')::date],
  'US-58 CA-4 / R1: una transacción por período vencido, del mes de inicio al corriente');
select is((select count(*) from transactions
            where subscription_id = 'd5800000-0000-0000-0000-000000000001'
              and type = 'expense' and installments_count = 1 and amount = 1234.50 and currency = 'ARS'
              and deleted_at is null), 3::bigint,
  'US-58 CA-4 / R7: las 3 son gastos en 1 cuota con el monto vigente $1.234,50');
select is((select sum(le.amount) from ledger_entries le join transactions t on t.id = le.transaction_id
            where t.subscription_id = 'd5800000-0000-0000-0000-000000000001'), 3703.50,
  'US-58 CA-4 / I1: las imputaciones generadas suman 3 x $1.234,50 = $3.703,50 exactos');
select is((select status::text from subscriptions where id = 'd5800000-0000-0000-0000-000000000001'), 'cancelled',
  'US-58 CA-4: tras generar lo vencido, la suscripción queda cancelada');

-- ---------------------------------------------------------------------------
-- CA-2: lo ya generado no cambia y sigue sumando (Historial: 3 previas y 1 vencida)
-- ---------------------------------------------------------------------------
select is((current_setting('t.c02')::jsonb ->> 'generated_before')::int, 1,
  'US-58 CA-2 / CA-4: con 3 ocurrencias previas y solo el mes corriente vencido, generated_before = 1');
select is((select jsonb_agg(to_jsonb(t) order by t.id) from transactions t
            where t.subscription_id = 'd5800000-0000-0000-0000-000000000002'
              and t.subscription_period < current_setting('t.cur')::date),
  current_setting('t.snap_02_tx')::jsonb,
  'US-58 CA-2 / C5: las 3 transacciones previas quedan idénticas fila por fila');
select is((select jsonb_agg(to_jsonb(le) order by le.id) from ledger_entries le join transactions t on t.id = le.transaction_id
            where t.subscription_id = 'd5800000-0000-0000-0000-000000000002'
              and t.subscription_period < current_setting('t.cur')::date),
  current_setting('t.snap_02_le')::jsonb,
  'US-58 CA-2: sus imputaciones quedan idénticas fila por fila (mismo período, importe y cuota)');
select is((select count(*) from transactions
            where subscription_id = 'd5800000-0000-0000-0000-000000000002' and deleted_at is null), 4::bigint,
  'US-58 CA-2 / C10: las 4 transacciones (3 previas y la vencida) siguen existiendo, sin deleted_at');
select is((select array_agg(amount order by subscription_period) from transactions
            where subscription_id = 'd5800000-0000-0000-0000-000000000002'),
  array[2000.00, 2000.00, 2000.00, 2500.00]::numeric[],
  'US-58 CA-2 / C5: las previas conservan $2.000,00; la vencida toma el monto vigente $2.500,00');
select is((select jsonb_object_agg(q.p::text, q.s::text) from (
             select le.period p, sum(le.amount) s from ledger_entries le join transactions t on t.id = le.transaction_id
              where t.subscription_id = 'd5800000-0000-0000-0000-000000000002' and t.deleted_at is null
              group by le.period) q) - current_setting('t.cur'),
  current_setting('t.snap_02_sums')::jsonb,
  'US-58 CA-2: la suma por período de los meses previos es la misma que antes de cancelar');
select is((select sum(le.amount) from ledger_entries le join transactions t on t.id = le.transaction_id
            where t.subscription_id = 'd5800000-0000-0000-0000-000000000002' and t.deleted_at is null), 8500.00,
  'US-58 CA-2 / I1: en total siguen sumando 3 x $2.000,00 + $2.500,00 = $8.500,00 en las imputaciones');

-- Al día: nada vencido, nada que generar; lo existente queda igual.
select is((current_setting('t.c03')::jsonb ->> 'generated_before')::int, 0,
  'US-58 CA-4: ya al día → generated_before = 0');
select is((select jsonb_agg(to_jsonb(t) order by t.id) from transactions t
            where t.subscription_id = 'd5800000-0000-0000-0000-000000000003'),
  current_setting('t.snap_03_tx')::jsonb,
  'US-58 CA-2: las 2 transacciones de la que estaba al día quedan idénticas fila por fila');

-- Con baja (R2, C10, I10)
select is((current_setting('t.c04')::jsonb ->> 'generated_before')::int, 0,
  'US-58 R2: con la ocurrencia del medio dada de baja generated_before = 0 (la borrada cuenta como existente)');
select is((select jsonb_agg(to_jsonb(t) order by t.id) from transactions t
            where t.subscription_id = 'd5800000-0000-0000-0000-000000000004'),
  current_setting('t.snap_04_tx')::jsonb,
  'US-58 R2 / C5: las transacciones (con y sin baja) quedan idénticas fila por fila');
select is((select count(*) from transactions where subscription_id = 'd5800000-0000-0000-0000-000000000004'), 3::bigint,
  'US-58 R2: la borrada no se regenera; siguen 3 filas');
select is((select count(*) from transactions
            where subscription_id = 'd5800000-0000-0000-0000-000000000004' and deleted_at is not null), 1::bigint,
  'US-58 C10: la transacción dada de baja sigue con su deleted_at');
select is((select jsonb_agg(to_jsonb(le) order by le.id) from ledger_entries le join transactions t on t.id = le.transaction_id
            where t.subscription_id = 'd5800000-0000-0000-0000-000000000004'),
  current_setting('t.snap_04_le')::jsonb,
  'US-58 R2: las imputaciones (también las de la dada de baja) quedan idénticas fila por fila');
select is((select sum(le.amount) from ledger_entries le join transactions t on t.id = le.transaction_id
            where t.subscription_id = 'd5800000-0000-0000-0000-000000000004' and t.deleted_at is null), 1600.00,
  'US-58 I10: la baja lógica no suma en los KPIs: 2 x $800,00 = $1.600,00 (la dada de baja queda afuera)');

-- ---------------------------------------------------------------------------
-- Cancelar una pausada (R3): se cancela sin generar nada
-- ---------------------------------------------------------------------------
select is((current_setting('t.c05')::jsonb ->> 'generated_before')::int, 0,
  'US-58 R3: cancelar una pausada con meses vencidos devuelve generated_before = 0');
select is((select status::text from subscriptions where id = 'd5800000-0000-0000-0000-000000000005'), 'cancelled',
  'US-58 R3: la pausada queda cancelada');
select ok((select cancelled_at is not null and abs(extract(epoch from (cancelled_at - now()))) < 5
             from subscriptions where id = 'd5800000-0000-0000-0000-000000000005'),
  'US-58 R3 / I15: la pausada cancelada tiene cancelled_at a pocos segundos de now()');
select is((select count(*) from transactions where subscription_id = 'd5800000-0000-0000-0000-000000000005'), 0::bigint,
  'US-58 R3: cancelar una pausada no genera ninguna transacción');
select is((select paused_at::text from subscriptions where id = 'd5800000-0000-0000-0000-000000000005'),
  current_setting('t.paused_at_05'),
  'US-58 R3: la RPC no toca paused_at: la pausada cancelada conserva el paused_at anterior (docs/06 solo pide status y cancelled_at)');
select is((select to_jsonb(s) - 'status' - 'cancelled_at' from subscriptions s
            where s.id = 'd5800000-0000-0000-0000-000000000005'),
  current_setting('t.snap_05_rest')::jsonb,
  'US-58 R3: en la pausada también solo cambian status y cancelled_at');

-- ---------------------------------------------------------------------------
-- R6 / ADR-030: la cancelación con una ocurrencia bloqueada (USD sin tipo de cambio) se hace igual
-- ---------------------------------------------------------------------------
select is((current_setting('t.c06')::jsonb ->> 'generated_before')::int, 0,
  'US-58 R6: USD sin fx_rates del mes vencido → generated_before = 0 (no genera, no falla)');
select is((select status::text from subscriptions where id = 'd5800000-0000-0000-0000-000000000006'), 'cancelled',
  'US-58 R6: la cancelación se hace igual aunque la puesta al día previa no pueda generar');
select ok((select cancelled_at is not null from subscriptions where id = 'd5800000-0000-0000-0000-000000000006'),
  'US-58 R6 / I15: la cancelada con ocurrencia bloqueada tiene cancelled_at');
select is((select count(*) from transactions where subscription_id = 'd5800000-0000-0000-0000-000000000006'), 0::bigint,
  'US-58 R6: los meses bloqueados quedan sin generar (no hay transacción de esos períodos)');

-- ---------------------------------------------------------------------------
-- CA-3 / R3: ninguna puesta al día posterior genera para una cancelada (hoy actual y hoy +6 meses)
-- ---------------------------------------------------------------------------
-- Con el tipo de cambio ya cargado, que la USD no genere es por estar cancelada y no por R6.
insert into fx_rates (user_id, period, ars_per_usd) values
  ('58a00000-0000-0000-0000-000000000001', (current_setting('t.cur')::date - interval '1 month')::date, 1100.0000),
  ('58a00000-0000-0000-0000-000000000001', current_setting('t.cur')::date, 1100.0000),
  ('58a00000-0000-0000-0000-000000000001', current_setting('t.next')::date, 1100.0000);
select set_config('t.tx_total_cp3', (select count(*) from transactions where user_id = '58a00000-0000-0000-0000-000000000001')::text, true);
select set_config('t.cu_now', catch_up_subscriptions('58a00000-0000-0000-0000-000000000001',
  current_setting('t.today')::date, 'd5800000-0000-0000-0000-000000000001')::text, true);
select set_config('t.cu_far', catch_up_subscriptions('58a00000-0000-0000-0000-000000000001',
  current_setting('t.far')::date, 'd5800000-0000-0000-0000-000000000001')::text, true);

select is((current_setting('t.cu_now')::jsonb ->> 'generated')::int, 0,
  'US-58 CA-3 / R3: con la suscripción cancelada y el hoy actual la puesta al día no genera nada');
select is((current_setting('t.cu_far')::jsonb ->> 'generated')::int, 0,
  'US-58 CA-3 / R3: con la suscripción cancelada y un hoy 6 meses adelante tampoco');
select is(current_setting('t.cu_now')::jsonb -> 'failed', '[]'::jsonb,
  'US-58 CA-3 / R3: la cancelada no figura en failed con el hoy actual');
select is(current_setting('t.cu_far')::jsonb -> 'failed', '[]'::jsonb,
  'US-58 CA-3 / R3: la cancelada no figura en failed con un hoy 6 meses adelante');
select is((select coalesce(sum((catch_up_subscriptions('58a00000-0000-0000-0000-000000000001', d.d, s.id) ->> 'generated')::int), 0)
             from (values ('d5800000-0000-0000-0000-000000000002'::uuid), ('d5800000-0000-0000-0000-000000000003'::uuid),
                          ('d5800000-0000-0000-0000-000000000004'::uuid), ('d5800000-0000-0000-0000-000000000005'::uuid),
                          ('d5800000-0000-0000-0000-000000000006'::uuid), ('d5800000-0000-0000-0000-000000000008'::uuid)) s(id)
             cross join (values (current_setting('t.today')::date), (current_setting('t.far')::date)) d(d)), 0::bigint,
  'US-58 CA-3 / R3: las otras 6 canceladas (historial, al día, con baja, pausada, USD y la previa) tampoco generan, hoy ni +6 meses');
select is((select count(*) from (values ('d5800000-0000-0000-0000-000000000002'::uuid), ('d5800000-0000-0000-0000-000000000003'::uuid),
                          ('d5800000-0000-0000-0000-000000000004'::uuid), ('d5800000-0000-0000-0000-000000000005'::uuid),
                          ('d5800000-0000-0000-0000-000000000006'::uuid), ('d5800000-0000-0000-0000-000000000008'::uuid)) s(id)
             cross join (values (current_setting('t.today')::date), (current_setting('t.far')::date)) d(d)
             cross join lateral jsonb_array_elements(
               catch_up_subscriptions('58a00000-0000-0000-0000-000000000001', d.d, s.id) -> 'failed') f), 0::bigint,
  'US-58 CA-3 / R6: ninguna cancelada aparece en failed, ni siquiera la USD cuyo mes bloqueado nunca se generó');
select is((select count(*) from transactions where user_id = '58a00000-0000-0000-0000-000000000001'),
  current_setting('t.tx_total_cp3')::bigint,
  'US-58 CA-3: las puestas al día posteriores no crearon ninguna transacción');
select is((select count(*) from transactions where subscription_id = 'd5800000-0000-0000-0000-000000000006'), 0::bigint,
  'US-58 R6 / CA-3: el mes bloqueado de la USD no se genera nunca, ni con el tipo de cambio ya cargado');

-- ---------------------------------------------------------------------------
-- CA-6 y CA-8: una cancelada no vuelve a active ni a paused, y cancelar de nuevo falla sin cambiar nada
-- ---------------------------------------------------------------------------
select set_config('t.snap_03', (select to_jsonb(s)::text from subscriptions s where s.id = 'd5800000-0000-0000-0000-000000000003'), true);
select set_config('t.tx_total_cp6', (select count(*) from transactions where user_id = '58a00000-0000-0000-0000-000000000001')::text, true);
set local role authenticated;
set local request.jwt.claims = '{"sub":"58a00000-0000-0000-0000-000000000001","role":"authenticated"}';
select throws_ok($$select pause_subscription('d5800000-0000-0000-0000-000000000003')$$,
  '23514', 'Una suscripción cancelada no se puede modificar',
  'US-58 CA-6: pausar la recién cancelada se rechaza con 23514');
select throws_ok($$select resume_subscription('d5800000-0000-0000-0000-000000000003')$$,
  '23514', 'Una suscripción cancelada no se puede modificar',
  'US-58 CA-6: reanudar la recién cancelada se rechaza con 23514');
select throws_ok($$select cancel_subscription('d5800000-0000-0000-0000-000000000003')$$,
  '23514', 'Una suscripción cancelada no se puede modificar',
  'US-58 CA-8: cancelar la recién cancelada se rechaza con 23514');
select throws_ok($$select pause_subscription('d5800000-0000-0000-0000-000000000008')$$,
  '23514', 'Una suscripción cancelada no se puede modificar',
  'US-58 CA-6: pausar una cancelada de antes se rechaza con 23514');
select throws_ok($$select resume_subscription('d5800000-0000-0000-0000-000000000008')$$,
  '23514', 'Una suscripción cancelada no se puede modificar',
  'US-58 CA-6: reanudar una cancelada de antes se rechaza con 23514');
select throws_ok($$select cancel_subscription('d5800000-0000-0000-0000-000000000008')$$,
  '23514', 'Una suscripción cancelada no se puede modificar',
  'US-58 CA-8: cancelar una cancelada de antes se rechaza con 23514');
select throws_ok($$update subscriptions set status = 'active' where id = 'd5800000-0000-0000-0000-000000000003'$$,
  '42501', null, 'US-58 CA-6: UPDATE directo de status a active se rechaza con 42501');
select throws_ok($$update subscriptions set status = 'paused', paused_at = now() where id = 'd5800000-0000-0000-0000-000000000003'$$,
  '42501', null, 'US-58 CA-6: UPDATE directo de status a paused se rechaza con 42501');
select throws_ok($$update subscriptions set status = 'active', cancelled_at = null where id = 'd5800000-0000-0000-0000-000000000008'$$,
  '42501', null, 'US-58 CA-6: UPDATE directo para "descancelar" sin la RPC se rechaza con 42501');
reset role;
select is((select to_jsonb(s)::text from subscriptions s where s.id = 'd5800000-0000-0000-0000-000000000003'),
  current_setting('t.snap_03'),
  'US-58 CA-8: tras los rechazos la fila no cambia (mismo cancelled_at, mismo status, mismo todo)');
select is((select to_jsonb(s)::text from subscriptions s where s.id = 'd5800000-0000-0000-0000-000000000008'),
  current_setting('t.snap_08'),
  'US-58 CA-8: la cancelada de antes tampoco cambia con los intentos de modificarla');
select is((select count(*) from subscriptions where id in ('d5800000-0000-0000-0000-000000000003',
            'd5800000-0000-0000-0000-000000000008') and status = 'cancelled' and cancelled_at is not null), 2::bigint,
  'US-58 CA-6: las dos siguen canceladas (no hay camino de vuelta a active ni a paused)');
select is((select count(*) from transactions where user_id = '58a00000-0000-0000-0000-000000000001'),
  current_setting('t.tx_total_cp6')::bigint,
  'US-58 CA-6 / CA-8: los rechazos no generaron transacciones');

-- ---------------------------------------------------------------------------
-- CA-7: el nombre se libera al cancelar (ADR-032)
-- ---------------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claims = '{"sub":"58a00000-0000-0000-0000-000000000001","role":"authenticated"}';
select throws_ok($$select create_subscription('Spotify', 100.00, 'ARS', 'c5800000-0000-0000-0000-000000000001',
    'a5800000-0000-0000-0000-000000000001', 5, current_setting('t.next')::date)$$,
  '23505', 'Ya tenés una suscripción con ese nombre',
  'US-58 CA-7: con la primera activa, un alta con el mismo nombre falla');
select throws_ok($$select create_subscription('  sPOTIFY ', 100.00, 'ARS', 'c5800000-0000-0000-0000-000000000001',
    'a5800000-0000-0000-0000-000000000001', 5, current_setting('t.next')::date)$$,
  '23505', 'Ya tenés una suscripción con ese nombre',
  'US-58 CA-7 / ADR-032: con la primera activa, otra capitalización y espacios sobrantes también fallan');
select throws_ok($$select create_subscription('Disney', 200.00, 'ARS', 'c5800000-0000-0000-0000-000000000001',
    'a5800000-0000-0000-0000-000000000001', 5, current_setting('t.next')::date)$$,
  '23505', 'Ya tenés una suscripción con ese nombre',
  'US-58 CA-7: con la primera pausada, un alta con el mismo nombre falla');
select lives_ok($$select cancel_subscription('d5800000-0000-0000-0000-000000000010')$$,
  'US-58 CA-7: se puede cancelar la activa de nombre Spotify');
select lives_ok($$select cancel_subscription('d5800000-0000-0000-0000-000000000011')$$,
  'US-58 CA-7 / R3: se puede cancelar la pausada de nombre Disney');
select lives_ok($$select create_subscription('  sPOTIFY ', 120.00, 'ARS', 'c5800000-0000-0000-0000-000000000001',
    'a5800000-0000-0000-0000-000000000001', 5, current_setting('t.next')::date)$$,
  'US-58 CA-7 / ADR-032: tras cancelar, se da de alta otra con el mismo nombre en otra capitalización y con espacios');
select lives_ok($$select create_subscription('Disney', 220.00, 'ARS', 'c5800000-0000-0000-0000-000000000001',
    'a5800000-0000-0000-0000-000000000001', 5, current_setting('t.next')::date)$$,
  'US-58 CA-7: tras cancelar la pausada, se da de alta otra con exactamente el mismo nombre');
reset role;
select is((select count(*) from subscriptions where user_id = '58a00000-0000-0000-0000-000000000001' and lower(name) = 'spotify'),
  2::bigint,
  'US-58 CA-7: conviven la cancelada vieja y la nueva con el mismo nombre');
select is((select array_agg(status::text order by status::text) from subscriptions
            where user_id = '58a00000-0000-0000-0000-000000000001' and lower(name) = 'spotify'),
  array['active', 'cancelled'],
  'US-58 CA-7: una queda cancelada y la nueva queda activa');
select is((select name from subscriptions where user_id = '58a00000-0000-0000-0000-000000000001'
            and lower(name) = 'spotify' and status = 'active'), 'sPOTIFY',
  'US-58 CA-7: la nueva guarda el nombre sin espacios sobrantes');
select is((select count(*) from subscriptions where user_id = '58a00000-0000-0000-0000-000000000001'
            and name = 'Disney' and status = 'active'), 1::bigint,
  'US-58 CA-7: la nueva Disney está activa');
select is((select status::text from subscriptions where id = 'd5800000-0000-0000-0000-000000000010'), 'cancelled',
  'US-58 CA-7: dar de alta la nueva no revive a la cancelada: sigue cancelada');
select is((select count(*) from transactions where subscription_id in
            ('d5800000-0000-0000-0000-000000000010', 'd5800000-0000-0000-0000-000000000011')), 0::bigint,
  'US-58 CA-7: cancelar la futura y la pausada no generó transacciones');

-- ---------------------------------------------------------------------------
-- CA-9: par de autorización de cancel_subscription (C7)
-- ---------------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claims = '{"sub":"58b00000-0000-0000-0000-000000000002","role":"authenticated"}';
select throws_ok($$select cancel_subscription('d5800000-0000-0000-0000-000000000009')$$,
  'P0002', 'Suscripción no encontrada',
  'US-58 CA-9 / C7: con la sesión de B, cancelar una suscripción de A responde P0002');
select throws_ok($$select cancel_subscription('d5800000-0000-0000-0000-0000000000ff')$$,
  'P0002', 'Suscripción no encontrada',
  'US-58 CA-9 / C7: un uuid inexistente responde el mismo P0002 y mensaje (no revela si existe)');
select throws_ok($$select cancel_subscription(null)$$,
  'P0002', 'Suscripción no encontrada',
  'US-58 CA-9 / C7: un id null también responde P0002');
select throws_ok($$select cancel_subscription('d5800000-0000-0000-0000-000000000008')$$,
  'P0002', 'Suscripción no encontrada',
  'US-58 CA-9 / C7: B tampoco distingue una cancelada ajena (P0002, no 23514)');
select is((select count(*) from subscriptions where id = 'd5800000-0000-0000-0000-000000000009'), 0::bigint,
  'US-58 CA-9 / C7: B no ve la suscripción de A');

reset role;
select is((select to_jsonb(s)::text from subscriptions s where s.id = 'd5800000-0000-0000-0000-000000000009'),
  current_setting('t.snap_09'),
  'US-58 CA-9 / C7: el intento de B no cambió la suscripción de A (sigue active y sin cancelled_at)');
select is((select count(*) from transactions where subscription_id = 'd5800000-0000-0000-0000-000000000009'), 0::bigint,
  'US-58 CA-9 / C7: el intento de B tampoco generó transacciones para A');

set local role anon;
set local request.jwt.claims = '{"role":"anon"}';
select throws_ok($$select cancel_subscription('d5800000-0000-0000-0000-000000000009')$$,
  '42501', null, 'US-58 CA-9 / C7: anon no puede llamar a cancel_subscription (42501)');
reset role;

set local role authenticated;
set local request.jwt.claims = '{"role":"authenticated"}';
select throws_ok($$select cancel_subscription('d5800000-0000-0000-0000-000000000009')$$,
  '42501', null, 'US-58 CA-9 / C7: authenticated sin sub (auth.uid() null) responde 42501');
reset role;

select is(has_function_privilege('anon', 'public.cancel_subscription(uuid)', 'execute'), false,
  'US-58 CA-9: anon no tiene execute sobre cancel_subscription');
select is(has_function_privilege('authenticated', 'public.cancel_subscription(uuid)', 'execute'), true,
  'US-58 CA-9: authenticated sí tiene execute sobre cancel_subscription');
select is((select to_jsonb(s)::text from subscriptions s where s.id = 'd5800000-0000-0000-0000-000000000009'),
  current_setting('t.snap_09'),
  'US-58 CA-9: tras B, anon y la sesión sin claims, la suscripción de A sigue activa y sin cambios');
select is((select count(*) from transactions where user_id = '58a00000-0000-0000-0000-000000000001'),
  current_setting('t.tx_total_before')::bigint + 3 + 1,
  'US-58 CA-9: ningún intento rechazado generó transacciones (solo las 3 de Gimnasio y la de Historial al cancelar)');

-- Con la sesión dueña sigue funcionando (evita el falso verde de "todo se rechaza").
set local role authenticated;
set local request.jwt.claims = '{"sub":"58a00000-0000-0000-0000-000000000001","role":"authenticated"}';
select is((select count(*) from subscriptions where id = 'd5800000-0000-0000-0000-000000000009'), 1::bigint,
  'US-58 CA-9 / C7: la sesión dueña ve su suscripción');
select set_config('t.c09', cancel_subscription('d5800000-0000-0000-0000-000000000009')::text, true);
select is((select status::text from subscriptions where id = 'd5800000-0000-0000-0000-000000000009'), 'cancelled',
  'US-58 CA-9 / C7: la sesión dueña sí puede cancelarla y queda cancelada');
select is((current_setting('t.c09')::jsonb ->> 'generated_before')::int, 1,
  'US-58 CA-9 / CA-4: la dueña la cancela con el mes corriente vencido → generated_before = 1');
select ok((select cancelled_at is not null from subscriptions where id = 'd5800000-0000-0000-0000-000000000009'),
  'US-58 CA-9 / I15: la cancelada por su dueña tiene cancelled_at');
reset role;

-- ---------------------------------------------------------------------------
-- Definición de la función (ADR-030): security definer con search_path fijo
-- ---------------------------------------------------------------------------
select is((select prosecdef from pg_proc where oid = 'public.cancel_subscription(uuid)'::regprocedure), true,
  'US-58 / ADR-030: cancel_subscription es security definer');
select is((select proconfig from pg_proc where oid = 'public.cancel_subscription(uuid)'::regprocedure),
  array['search_path=""'],
  'US-58 / ADR-030: search_path fijo y vacío (sin resolución por esquema)');
select is((select prorettype::regtype::text from pg_proc where oid = 'public.cancel_subscription(uuid)'::regprocedure), 'jsonb',
  'US-58: cancel_subscription devuelve jsonb');

select * from finish();
rollback;
