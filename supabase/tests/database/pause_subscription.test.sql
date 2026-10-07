-- US-56 (#214), ADR-030 y docs/06-suscripciones.md R3/R5/R8: pause_subscription es la única vía para pausar.
-- Fija CA-1 (estado, paused_at y piso generate_from_period = max(anterior, mes siguiente), I12, I15),
-- CA-2 (lo ya generado no cambia), CA-3 (el mes corriente sin ocurrencia no se cobra después, R5 + R8),
-- CA-4 (los meses vencidos se generan antes de pausar), CA-5 (una pausada no genera, R3), CA-7 (transiciones
-- inexistentes), CA-8 (sin UPDATE directo), CA-9 (par de autorización, C7), la pausa con una ocurrencia
-- bloqueada por R6, la forma del jsonb devuelto y que la función es security definer con search_path fijo.
-- pause_subscription siempre usa el hoy del servidor (ADR-021): las fechas son relativas al hoy argentino y
-- el test pasa cualquier día del mes. Para fijar otro "hoy" en la puesta al día de control se llama a la
-- función interna catch_up_subscriptions como dueño de la tabla. Datos ficticios; todo se revierte (ADR-015).
begin;
select plan(73);

-- ---------------------------------------------------------------------------
-- Fixtures (como dueño de las tablas)
-- ---------------------------------------------------------------------------
--   A 56a…01  dueño de todas las suscripciones          B 56b…02  otra sesión
--   d56…01 Gimnasio     piso viejo (3 meses vencidos)     d56…06 Control      como 05 pero sin pausar
--   d56…02 Futura       piso ya mayor (cur + 3 meses)     d56…07 Ya pausada   (CA-7)
--   d56…03 Mes que viene piso = mes siguiente             d56…08 Cancelada    (CA-7)
--   d56…04 Historial    ya generadas, una borrada (CA-2)  d56…09 De A         activa, la toca B (CA-9)
--   d56…05 Cobro por venir (CA-3)                         d56…10 Dólares      USD sin fx_rates (R6)
insert into auth.users (id, instance_id, aud, role, email) values
  ('56a00000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us56a@test.local'),
  ('56b00000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000000','authenticated','authenticated','us56b@test.local');
insert into categories (id, user_id, name) values
  ('c5600000-0000-0000-0000-000000000001','56a00000-0000-0000-0000-000000000001','Streaming');
insert into accounts (id, user_id, name, type, currency) values
  ('a5600000-0000-0000-0000-000000000001','56a00000-0000-0000-0000-000000000001','Visa','credit_card','ARS');

-- Fechas relativas al hoy argentino (ADR-021).
select set_config('t.today', (now() at time zone 'America/Argentina/Buenos_Aires')::date::text, true);
select set_config('t.cur', date_trunc('month', current_setting('t.today')::date)::date::text, true);
select set_config('t.next', (current_setting('t.cur')::date + interval '1 month')::date::text, true);
-- Último día del mes corriente: el "día 30 / último día" del CA-3 (nunca antes del día de cobro).
select set_config('t.last', (current_setting('t.cur')::date + interval '1 month - 1 day')::date::text, true);
-- Último día de dentro de 6 meses: un "hoy" futuro para el CA-5.
select set_config('t.far', (current_setting('t.cur')::date + interval '7 months - 1 day')::date::text, true);
-- Una ocurrencia que todavía no venció: período corriente con día de cobro mañana. Si hoy es el último día
-- del mes ningún día de cobro queda por venir (R4 recorta al último día), así que se usa el mes que viene
-- (el CA-3 pasa a ser trivial ese día, y el control de abajo lo sabe).
select set_config('t.ng_start', case
  when current_setting('t.today')::date < current_setting('t.last')::date then current_setting('t.cur')
  else current_setting('t.next') end, true);
select set_config('t.ng_day', case
  when current_setting('t.today')::date < current_setting('t.last')::date
    then (extract(day from current_setting('t.today')::date)::int + 1)::text
  else '1' end, true);

insert into subscriptions (id, user_id, name, amount, currency, category_id, account_id, billing_day,
                           start_period, generate_from_period, status, paused_at, cancelled_at) values
  ('d5600000-0000-0000-0000-000000000001','56a00000-0000-0000-0000-000000000001','Gimnasio', 1234.50, 'ARS',
   'c5600000-0000-0000-0000-000000000001','a5600000-0000-0000-0000-000000000001', 1,
   (current_setting('t.cur')::date - interval '2 months')::date, (current_setting('t.cur')::date - interval '2 months')::date,
   'active', null, null),
  ('d5600000-0000-0000-0000-000000000002','56a00000-0000-0000-0000-000000000001','Futura', 800.00, 'ARS',
   'c5600000-0000-0000-0000-000000000001','a5600000-0000-0000-0000-000000000001', 5,
   (current_setting('t.cur')::date + interval '3 months')::date, (current_setting('t.cur')::date + interval '3 months')::date,
   'active', null, null),
  ('d5600000-0000-0000-0000-000000000003','56a00000-0000-0000-0000-000000000001','Mes que viene', 900.00, 'ARS',
   'c5600000-0000-0000-0000-000000000001','a5600000-0000-0000-0000-000000000001', 5,
   current_setting('t.next')::date, current_setting('t.next')::date, 'active', null, null),
  ('d5600000-0000-0000-0000-000000000004','56a00000-0000-0000-0000-000000000001','Historial', 2000.00, 'ARS',
   'c5600000-0000-0000-0000-000000000001','a5600000-0000-0000-0000-000000000001', 1,
   (current_setting('t.cur')::date - interval '2 months')::date, (current_setting('t.cur')::date - interval '2 months')::date,
   'active', null, null),
  ('d5600000-0000-0000-0000-000000000005','56a00000-0000-0000-0000-000000000001','Cobro por venir', 3000.00, 'ARS',
   'c5600000-0000-0000-0000-000000000001','a5600000-0000-0000-0000-000000000001', current_setting('t.ng_day')::int,
   current_setting('t.ng_start')::date, current_setting('t.ng_start')::date, 'active', null, null),
  ('d5600000-0000-0000-0000-000000000006','56a00000-0000-0000-0000-000000000001','Control', 3000.00, 'ARS',
   'c5600000-0000-0000-0000-000000000001','a5600000-0000-0000-0000-000000000001', current_setting('t.ng_day')::int,
   current_setting('t.ng_start')::date, current_setting('t.ng_start')::date, 'active', null, null),
  ('d5600000-0000-0000-0000-000000000007','56a00000-0000-0000-0000-000000000001','Ya pausada', 700.00, 'ARS',
   'c5600000-0000-0000-0000-000000000001','a5600000-0000-0000-0000-000000000001', 5,
   current_setting('t.cur')::date, current_setting('t.next')::date, 'paused', now() - interval '1 day', null),
  ('d5600000-0000-0000-0000-000000000008','56a00000-0000-0000-0000-000000000001','Cancelada', 600.00, 'ARS',
   'c5600000-0000-0000-0000-000000000001','a5600000-0000-0000-0000-000000000001', 5,
   current_setting('t.cur')::date, current_setting('t.cur')::date, 'cancelled', null, now() - interval '1 day'),
  ('d5600000-0000-0000-0000-000000000009','56a00000-0000-0000-0000-000000000001','De A', 500.00, 'ARS',
   'c5600000-0000-0000-0000-000000000001','a5600000-0000-0000-0000-000000000001', current_setting('t.ng_day')::int,
   current_setting('t.ng_start')::date, current_setting('t.ng_start')::date, 'active', null, null),
  ('d5600000-0000-0000-0000-000000000010','56a00000-0000-0000-0000-000000000001','Dólares', 10.00, 'USD',
   'c5600000-0000-0000-0000-000000000001','a5600000-0000-0000-0000-000000000001', 1,
   (current_setting('t.cur')::date - interval '1 month')::date, (current_setting('t.cur')::date - interval '1 month')::date,
   'active', null, null);

-- Historial (CA-2): tres ocurrencias (cur-2, cur-1, cur) a $2.000,00; la del medio dada de baja, y después
-- sube el monto vigente de la suscripción: lo ya generado conserva el monto de entonces (C5, R7).
select catch_up_subscriptions('56a00000-0000-0000-0000-000000000001', current_setting('t.today')::date,
  'd5600000-0000-0000-0000-000000000004');
update transactions set deleted_at = now()
 where subscription_id = 'd5600000-0000-0000-0000-000000000004'
   and subscription_period = (current_setting('t.cur')::date - interval '1 month')::date;
update subscriptions set amount = 2500.00 where id = 'd5600000-0000-0000-0000-000000000004';

-- Fotos previas para comprobar que "no cambia" es literal.
select set_config('t.snap_hist_tx', (select jsonb_agg(to_jsonb(t) order by t.id)
  from transactions t where t.subscription_id = 'd5600000-0000-0000-0000-000000000004')::text, true);
select set_config('t.snap_hist_le_n', (select count(*) from ledger_entries le join transactions t on t.id = le.transaction_id
  where t.subscription_id = 'd5600000-0000-0000-0000-000000000004')::text, true);
select set_config('t.snap_07', (select to_jsonb(s)::text from subscriptions s where s.id = 'd5600000-0000-0000-0000-000000000007'), true);
select set_config('t.snap_08', (select to_jsonb(s)::text from subscriptions s where s.id = 'd5600000-0000-0000-0000-000000000008'), true);
select set_config('t.snap_09', (select to_jsonb(s)::text from subscriptions s where s.id = 'd5600000-0000-0000-0000-000000000009'), true);
select set_config('t.snap_01_rest', (select (to_jsonb(s) - 'status' - 'paused_at' - 'generate_from_period')::text
  from subscriptions s where s.id = 'd5600000-0000-0000-0000-000000000001'), true);
select set_config('t.tx_total_before', (select count(*) from transactions where user_id = '56a00000-0000-0000-0000-000000000001')::text, true);

-- ---------------------------------------------------------------------------
-- Sesión de A: se pausan las suscripciones activas
-- ---------------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claims = '{"sub":"56a00000-0000-0000-0000-000000000001","role":"authenticated"}';

select set_config('t.p01', pause_subscription('d5600000-0000-0000-0000-000000000001')::text, true);
select set_config('t.p02', pause_subscription('d5600000-0000-0000-0000-000000000002')::text, true);
select set_config('t.p03', pause_subscription('d5600000-0000-0000-0000-000000000003')::text, true);
select set_config('t.p04', pause_subscription('d5600000-0000-0000-0000-000000000004')::text, true);
select set_config('t.p05', pause_subscription('d5600000-0000-0000-0000-000000000005')::text, true);
select set_config('t.p10', pause_subscription('d5600000-0000-0000-0000-000000000010')::text, true);

-- ---------------------------------------------------------------------------
-- La RPC devuelve { generated_before } con un entero
-- ---------------------------------------------------------------------------
select is((select array_agg(k order by k) from jsonb_object_keys(current_setting('t.p01')::jsonb) k), array['generated_before'],
  'US-56: la RPC devuelve un jsonb con la única clave generated_before');
select is(jsonb_typeof(current_setting('t.p01')::jsonb -> 'generated_before'), 'number',
  'US-56: generated_before es un número JSON');
select ok((current_setting('t.p01')::jsonb ->> 'generated_before') ~ '^[0-9]+$',
  'US-56: generated_before es un entero no negativo, sin decimales');

-- ---------------------------------------------------------------------------
-- CA-4: los meses vencidos se generan al pausar, antes de cambiar el estado
-- ---------------------------------------------------------------------------
select is((current_setting('t.p01')::jsonb ->> 'generated_before')::int, 3,
  'US-56 CA-4: inicio dos meses atrás con día 1 devuelve generated_before = 3');
select is((select count(*) from transactions where subscription_id = 'd5600000-0000-0000-0000-000000000001'), 3::bigint,
  'US-56 CA-4: existen exactamente las 3 transacciones vencidas');
select is((select array_agg(subscription_period order by subscription_period) from transactions
            where subscription_id = 'd5600000-0000-0000-0000-000000000001'),
  array[(current_setting('t.cur')::date - interval '2 months')::date,
        (current_setting('t.cur')::date - interval '1 month')::date,
        current_setting('t.cur')::date],
  'US-56 CA-4 / R1: una transacción por período vencido, del mes de inicio al corriente');
select is((select count(*) from transactions
            where subscription_id = 'd5600000-0000-0000-0000-000000000001'
              and type = 'expense' and installments_count = 1 and amount = 1234.50 and currency = 'ARS'
              and deleted_at is null), 3::bigint,
  'US-56 CA-4 / R7: las 3 son gastos en 1 cuota con el monto vigente $1.234,50');
select is((select sum(le.amount) from ledger_entries le join transactions t on t.id = le.transaction_id
            where t.subscription_id = 'd5600000-0000-0000-0000-000000000001'), 3703.50,
  'US-56 CA-4 / I1: las imputaciones generadas suman 3 x $1.234,50 = $3.703,50 exactos');
select is((select status::text from subscriptions where id = 'd5600000-0000-0000-0000-000000000001'), 'paused',
  'US-56 CA-4: tras generar lo vencido, la suscripción queda pausada');

-- ---------------------------------------------------------------------------
-- CA-1: estado, paused_at y el piso max(anterior, mes siguiente)
-- ---------------------------------------------------------------------------
select is((select status::text from subscriptions where id = 'd5600000-0000-0000-0000-000000000004'), 'paused',
  'US-56 CA-1: tras pausar, status = paused');
select ok((select paused_at is not null from subscriptions where id = 'd5600000-0000-0000-0000-000000000001'),
  'US-56 CA-1 / I15: paused_at no es null');
select ok((select abs(extract(epoch from (paused_at - now()))) < 5 from subscriptions where id = 'd5600000-0000-0000-0000-000000000001'),
  'US-56 CA-1: paused_at es ahora (a pocos segundos de now())');
select is((select generate_from_period from subscriptions where id = 'd5600000-0000-0000-0000-000000000001'),
  current_setting('t.next')::date,
  'US-56 CA-1 / R8: piso viejo menor (dos meses atrás) → generate_from_period = mes siguiente al corriente');
select is((select generate_from_period from subscriptions where id = 'd5600000-0000-0000-0000-000000000004'),
  current_setting('t.next')::date,
  'US-56 CA-1 / R8: otra suscripción con piso viejo también queda en el mes siguiente');
select is((select generate_from_period from subscriptions where id = 'd5600000-0000-0000-0000-000000000002'),
  (current_setting('t.cur')::date + interval '3 months')::date,
  'US-56 CA-1 / I12: piso ya mayor (start_period futuro) → no retrocede al mes siguiente');
select is((select status::text from subscriptions where id = 'd5600000-0000-0000-0000-000000000002'), 'paused',
  'US-56 CA-1: la suscripción con inicio futuro también queda pausada');
select ok((select start_period <= generate_from_period from subscriptions where id = 'd5600000-0000-0000-0000-000000000002'),
  'US-56 CA-1 / I12: start_period <= generate_from_period se mantiene');
select is((select generate_from_period from subscriptions where id = 'd5600000-0000-0000-0000-000000000003'),
  current_setting('t.next')::date,
  'US-56 CA-1 / R8: piso igual al mes siguiente → queda igual (max)');
select is((select generate_from_period from subscriptions where id = 'd5600000-0000-0000-0000-000000000005'),
  (select greatest(current_setting('t.ng_start')::date, current_setting('t.next')::date)),
  'US-56 CA-1 / R8: con el cobro por venir el piso sube al mes siguiente (max entre el piso y el mes siguiente)');
select is((select to_jsonb(s) - 'status' - 'paused_at' - 'generate_from_period' from subscriptions s
            where s.id = 'd5600000-0000-0000-0000-000000000001'),
  current_setting('t.snap_01_rest')::jsonb,
  'US-56 CA-1: pausar solo cambia status, paused_at y generate_from_period (nombre, monto, día de cobro… intactos)');
select is((select status::text from subscriptions where id = 'd5600000-0000-0000-0000-000000000009'), 'active',
  'US-56 CA-1: pausar una suscripción no pausa las demás del usuario');
select is((select count(*) from subscriptions where status = 'active' and id = 'd5600000-0000-0000-0000-000000000006'), 1::bigint,
  'US-56 CA-1: la suscripción de control sigue activa');

-- ---------------------------------------------------------------------------
-- CA-2: lo ya generado no cambia (ni monto, ni deleted_at, ni la borrada)
-- ---------------------------------------------------------------------------
select is((current_setting('t.p04')::jsonb ->> 'generated_before')::int, 0,
  'US-56 CA-2: con todos los períodos ya existentes (uno con baja lógica) generated_before = 0');
select is((select jsonb_agg(to_jsonb(t) order by t.id) from transactions t
            where t.subscription_id = 'd5600000-0000-0000-0000-000000000004'),
  current_setting('t.snap_hist_tx')::jsonb,
  'US-56 CA-2 / C5: las transacciones ya generadas quedan idénticas fila por fila');
select is((select array_agg(amount order by subscription_period) from transactions
            where subscription_id = 'd5600000-0000-0000-0000-000000000004'),
  array[2000.00, 2000.00, 2000.00]::numeric[],
  'US-56 CA-2 / C5: conservan el monto de cuando se generaron aunque el vigente sea $2.500,00');
select is((select count(*) from transactions
            where subscription_id = 'd5600000-0000-0000-0000-000000000004' and deleted_at is not null), 1::bigint,
  'US-56 CA-2 / C10: la transacción dada de baja sigue con su deleted_at');
select is((select count(*) from transactions where subscription_id = 'd5600000-0000-0000-0000-000000000004'), 3::bigint,
  'US-56 CA-2 / R2: la borrada no se regenera; siguen 3 filas');
select is((select count(*) from ledger_entries le join transactions t on t.id = le.transaction_id
            where t.subscription_id = 'd5600000-0000-0000-0000-000000000004'),
  current_setting('t.snap_hist_le_n')::bigint,
  'US-56 CA-2: las imputaciones tampoco cambian de cantidad');

-- ---------------------------------------------------------------------------
-- R6 / ADR-030: la pausa con una ocurrencia bloqueada (USD sin tipo de cambio) se hace igual
-- ---------------------------------------------------------------------------
select is((current_setting('t.p10')::jsonb ->> 'generated_before')::int, 0,
  'US-56 R6: USD sin fx_rates del mes vencido → generated_before = 0 (no genera, no falla)');
select is((select status::text from subscriptions where id = 'd5600000-0000-0000-0000-000000000010'), 'paused',
  'US-56 R6: la pausa se hace igual aunque la puesta al día previa no pueda generar');
select is((select count(*) from transactions where subscription_id = 'd5600000-0000-0000-0000-000000000010'), 0::bigint,
  'US-56 R6: el mes bloqueado queda sin generar (no hay transacción de ese período)');
select is((select generate_from_period from subscriptions where id = 'd5600000-0000-0000-0000-000000000010'),
  current_setting('t.next')::date,
  'US-56 R6 / R8: el piso igual se adelantó al mes siguiente');

-- ---------------------------------------------------------------------------
-- CA-7: transiciones inexistentes (23514, mensaje exacto) y la fila no cambia
-- ---------------------------------------------------------------------------
select throws_ok($$select pause_subscription('d5600000-0000-0000-0000-000000000007')$$,
  '23514', 'La suscripción ya está pausada',
  'US-56 CA-7: pausar una ya pausada se rechaza con 23514');
select is((select to_jsonb(s)::text from subscriptions s where s.id = 'd5600000-0000-0000-0000-000000000007'),
  current_setting('t.snap_07'),
  'US-56 CA-7: la pausada rechazada conserva status, paused_at y piso');
select throws_ok($$select pause_subscription('d5600000-0000-0000-0000-000000000008')$$,
  '23514', 'Una suscripción cancelada no se puede modificar',
  'US-56 CA-7: pausar una cancelada se rechaza con 23514');
select is((select to_jsonb(s)::text from subscriptions s where s.id = 'd5600000-0000-0000-0000-000000000008'),
  current_setting('t.snap_08'),
  'US-56 CA-7: la cancelada rechazada no cambia');
select set_config('t.paused_at_01', (select paused_at::text from subscriptions where id = 'd5600000-0000-0000-0000-000000000001'), true);
select throws_ok($$select pause_subscription('d5600000-0000-0000-0000-000000000001')$$,
  '23514', 'La suscripción ya está pausada',
  'US-56 CA-7: pausar dos veces seguidas la misma suscripción se rechaza con 23514');
select is((select paused_at::text from subscriptions where id = 'd5600000-0000-0000-0000-000000000001'),
  current_setting('t.paused_at_01'),
  'US-56 CA-7: la segunda pausa rechazada no vuelve a tocar paused_at');
select is((select count(*) from transactions where user_id = '56a00000-0000-0000-0000-000000000001'),
  (current_setting('t.tx_total_before')::bigint + 3),
  'US-56 CA-7: los rechazos no generaron transacciones (solo las 3 de Gimnasio al pausar)');

-- ---------------------------------------------------------------------------
-- CA-8: sin escritura directa de status ni de amount (ADR-030)
-- ---------------------------------------------------------------------------
select throws_ok($$update subscriptions set status = 'active' where id = 'd5600000-0000-0000-0000-000000000001'$$,
  '42501', null, 'US-56 CA-8: UPDATE directo de status se rechaza con 42501');
select throws_ok($$update subscriptions set status = 'paused', paused_at = now() where id = 'd5600000-0000-0000-0000-000000000009'$$,
  '42501', null, 'US-56 CA-8: UPDATE directo para pausar sin la RPC se rechaza con 42501');
select throws_ok($$update subscriptions set amount = 1 where id = 'd5600000-0000-0000-0000-000000000009'$$,
  '42501', null, 'US-56 CA-8: UPDATE directo de amount se rechaza con 42501');
select is((select to_jsonb(s)::text from subscriptions s where s.id = 'd5600000-0000-0000-0000-000000000009'),
  current_setting('t.snap_09'),
  'US-56 CA-8: los UPDATE directos rechazados no cambiaron la fila');
select is((select status::text from subscriptions where id = 'd5600000-0000-0000-0000-000000000001'), 'paused',
  'US-56 CA-8: la suscripción pausada sigue pausada');

-- ---------------------------------------------------------------------------
-- CA-5 / R3: pausada, la puesta al día no genera nada (hoy actual y hoy futuro)
-- ---------------------------------------------------------------------------
reset role;
select set_config('t.cu_now', catch_up_subscriptions('56a00000-0000-0000-0000-000000000001',
  current_setting('t.today')::date, 'd5600000-0000-0000-0000-000000000001')::text, true);
select set_config('t.cu_far', catch_up_subscriptions('56a00000-0000-0000-0000-000000000001',
  current_setting('t.far')::date, 'd5600000-0000-0000-0000-000000000001')::text, true);

select is((current_setting('t.cu_now')::jsonb ->> 'generated')::int, 0,
  'US-56 CA-5 / R3: con la suscripción pausada y el hoy actual la puesta al día no genera nada');
select is((current_setting('t.cu_far')::jsonb ->> 'generated')::int, 0,
  'US-56 CA-5 / R3: con la suscripción pausada y un hoy 6 meses adelante tampoco');
select is(current_setting('t.cu_far')::jsonb -> 'failed', '[]'::jsonb,
  'US-56 CA-5 / R3: la pausada no se reporta como fallida');
select is((select count(*) from transactions where subscription_id = 'd5600000-0000-0000-0000-000000000001'), 3::bigint,
  'US-56 CA-5 / R3: la pausada sigue con sus 3 transacciones, sin ninguna nueva');

-- ---------------------------------------------------------------------------
-- CA-3: cobro por venir en el mes corriente; pausa, reanudación por SQL y puesta al día a fin de mes
-- ---------------------------------------------------------------------------
select is((current_setting('t.p05')::jsonb ->> 'generated_before')::int, 0,
  'US-56 CA-3: con el día de cobro por venir la pausa no genera nada (R5)');
select is((select count(*) from transactions where subscription_id = 'd5600000-0000-0000-0000-000000000005'), 0::bigint,
  'US-56 CA-3: antes de reanudar no existe ninguna ocurrencia de la suscripción');
update subscriptions set status = 'active', paused_at = null where id = 'd5600000-0000-0000-0000-000000000005';
select set_config('t.cu_ng', catch_up_subscriptions('56a00000-0000-0000-0000-000000000001',
  current_setting('t.last')::date, 'd5600000-0000-0000-0000-000000000005')::text, true);
select is((current_setting('t.cu_ng')::jsonb ->> 'generated')::int, 0,
  'US-56 CA-3 / R8: reanudada y con la puesta al día del último día del mes, no se genera nada');
select is((select count(*) from transactions
            where subscription_id = 'd5600000-0000-0000-0000-000000000005'
              and subscription_period = current_setting('t.cur')::date), 0::bigint,
  'US-56 CA-3 / R5 + R8: NO existe la ocurrencia del mes corriente (el piso ya quedó en el mes siguiente)');
-- Control: la misma suscripción sin pausar sí habría generado el mes corriente (si no, el caso no probaría nada).
-- El último día del mes el alta ya está en el mes siguiente y el control espera 0.
select set_config('t.cu_ctrl', catch_up_subscriptions('56a00000-0000-0000-0000-000000000001',
  current_setting('t.last')::date, 'd5600000-0000-0000-0000-000000000006')::text, true);
select is((current_setting('t.cu_ctrl')::jsonb ->> 'generated')::int,
  (current_setting('t.ng_start') = current_setting('t.cur'))::int,
  'US-56 CA-3 control: sin pausa, el mismo escenario genera el mes corriente a fin de mes (el test no es vacuo)');

-- ---------------------------------------------------------------------------
-- R6: tras reanudar por SQL y poner al día, el mes bloqueado queda fuera para siempre
-- ---------------------------------------------------------------------------
insert into fx_rates (user_id, period, ars_per_usd) values
  ('56a00000-0000-0000-0000-000000000001', (current_setting('t.cur')::date - interval '1 month')::date, 1100.0000),
  ('56a00000-0000-0000-0000-000000000001', current_setting('t.cur')::date, 1100.0000),
  ('56a00000-0000-0000-0000-000000000001', current_setting('t.next')::date, 1100.0000);
update subscriptions set status = 'active', paused_at = null where id = 'd5600000-0000-0000-0000-000000000010';
select set_config('t.cu_usd', catch_up_subscriptions('56a00000-0000-0000-0000-000000000001',
  current_setting('t.today')::date, 'd5600000-0000-0000-0000-000000000010')::text, true);
select is((current_setting('t.cu_usd')::jsonb ->> 'generated')::int, 0,
  'US-56 R6: reanudada y con el tipo de cambio ya cargado, la puesta al día de hoy no genera el mes bloqueado');
select is((select count(*) from transactions where subscription_id = 'd5600000-0000-0000-0000-000000000010'), 0::bigint,
  'US-56 R6 / I17: el período bloqueado (y el corriente) no se generan: el piso los dejó afuera');
select set_config('t.cu_usd2', catch_up_subscriptions('56a00000-0000-0000-0000-000000000001',
  (current_setting('t.next')::date + interval '1 month - 1 day')::date, 'd5600000-0000-0000-0000-000000000010')::text, true);
select is((select array_agg(subscription_period) from transactions where subscription_id = 'd5600000-0000-0000-0000-000000000010'),
  array[current_setting('t.next')::date],
  'US-56 R6 / R8: recién desde el mes siguiente vuelve a generar, con su tipo de cambio congelado');
select is((select amount_ars from transactions where subscription_id = 'd5600000-0000-0000-0000-000000000010'), 11000.00,
  'US-56 R6 / C5: USD 10,00 x 1100,0000 = $11.000,00 en la ocurrencia del mes siguiente');

-- ---------------------------------------------------------------------------
-- CA-9: par de autorización de pause_subscription (C7)
-- ---------------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claims = '{"sub":"56b00000-0000-0000-0000-000000000002","role":"authenticated"}';
select throws_ok($$select pause_subscription('d5600000-0000-0000-0000-000000000009')$$,
  'P0002', 'Suscripción no encontrada',
  'US-56 CA-9 / C7: con la sesión de B, pausar una suscripción de A responde P0002');
select throws_ok($$select pause_subscription('d5600000-0000-0000-0000-0000000000ff')$$,
  'P0002', 'Suscripción no encontrada',
  'US-56 CA-9 / C7: un uuid inexistente responde el mismo P0002 y mensaje (no revela si existe)');
select is((select count(*) from subscriptions where id = 'd5600000-0000-0000-0000-000000000009'), 0::bigint,
  'US-56 CA-9 / C7: B no ve la suscripción de A');

reset role;
select is((select to_jsonb(s)::text from subscriptions s where s.id = 'd5600000-0000-0000-0000-000000000009'),
  current_setting('t.snap_09'),
  'US-56 CA-9 / C7: el intento de B no cambió la suscripción de A (sigue activa y sin paused_at)');
select is((select count(*) from transactions where subscription_id = 'd5600000-0000-0000-0000-000000000009'), 0::bigint,
  'US-56 CA-9 / C7: el intento de B tampoco generó transacciones para A');

set local role anon;
set local request.jwt.claims = '{"role":"anon"}';
select throws_ok($$select pause_subscription('d5600000-0000-0000-0000-000000000009')$$,
  '42501', null, 'US-56 CA-9 / C7: anon no puede llamar a pause_subscription (42501)');
reset role;

set local role authenticated;
set local request.jwt.claims = '{"role":"authenticated"}';
select throws_ok($$select pause_subscription('d5600000-0000-0000-0000-000000000009')$$,
  '42501', null, 'US-56 CA-9 / C7: authenticated sin sub (auth.uid() null) responde 42501');
reset role;

select is(has_function_privilege('anon', 'public.pause_subscription(uuid)', 'execute'), false,
  'US-56 CA-9: anon no tiene execute sobre pause_subscription');
select is(has_function_privilege('authenticated', 'public.pause_subscription(uuid)', 'execute'), true,
  'US-56 CA-9: authenticated sí tiene execute sobre pause_subscription');
select is((select count(*) from subscriptions where id = 'd5600000-0000-0000-0000-000000000009' and status = 'active'), 1::bigint,
  'US-56 CA-9: tras anon y la sesión sin claims, la suscripción de A sigue activa');

-- Con la sesión dueña sigue funcionando (evita el falso verde de "todo se rechaza").
set local role authenticated;
set local request.jwt.claims = '{"sub":"56a00000-0000-0000-0000-000000000001","role":"authenticated"}';
select is((select count(*) from subscriptions where id = 'd5600000-0000-0000-0000-000000000009'), 1::bigint,
  'US-56 CA-9 / C7: la sesión dueña ve su suscripción');
select lives_ok($$select pause_subscription('d5600000-0000-0000-0000-000000000009')$$,
  'US-56 CA-9 / C7: la sesión dueña sí puede pausarla');
select is((select status::text from subscriptions where id = 'd5600000-0000-0000-0000-000000000009'), 'paused',
  'US-56 CA-9: después de pausar, queda pausada');
reset role;

-- ---------------------------------------------------------------------------
-- Definición de la función (ADR-030): security definer con search_path fijo
-- ---------------------------------------------------------------------------
select is((select prosecdef from pg_proc where oid = 'public.pause_subscription(uuid)'::regprocedure), true,
  'US-56 / ADR-030: pause_subscription es security definer');
select is((select proconfig from pg_proc where oid = 'public.pause_subscription(uuid)'::regprocedure),
  array['search_path=""'],
  'US-56 / ADR-030: search_path fijo y vacío (sin resolución por esquema)');
select is((select prorettype::regtype::text from pg_proc where oid = 'public.pause_subscription(uuid)'::regprocedure), 'jsonb',
  'US-56: pause_subscription devuelve jsonb');

select * from finish();
rollback;
