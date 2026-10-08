-- US-77 (#206), ADR-035: importación por lote desde Excel con una sola RPC.
--
-- 1. imports: un registro por importación, con el id que genera el cliente (uuid v4 por archivo
--    confirmado). Hace idempotente el reintento (NFR-10, US-78): la RPC inserta acá primero y, si el
--    id ya existe, devuelve el resultado guardado. Se lee bajo RLS (C7) y se escribe solo desde la RPC.
-- 2. import_transactions(p_import_id, p_rows): recorre las filas y llama a create_transaction por
--    cada una (C4, ADR-005). Cada fila va en su propio bloque begin/exception (una subtransacción):
--    si falla, se deshace solo esa fila y sigue la próxima. Las validaciones, el redondeo (C3,
--    ADR-013) y el hoy de Argentina (ADR-021) son los de create_transaction: acá no se repiten (C6).
--    No escribe transactions ni ledger_entries por su cuenta (ADR-020).
--    El lote entero se rechaza sin escribir nada sin sesión (42501), sin id, o si p_rows no es un
--    array de 1 a 500 elementos (check_violation). Un statement_timeout (57014) aborta todo: el
--    `when others` de plpgsql no atrapa query_canceled. Los demás errores transitorios o de recursos
--    (40001, 40P01, 55P03, clases 53, 54, 57, 58 y XX) también abortan el lote: no son de la fila.

-- ---------------------------------------------------------------------------
-- 1. imports
-- ---------------------------------------------------------------------------
create table public.imports (
  id            uuid primary key,
  user_id       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  sent_rows     int not null,
  imported_rows int,
  result        jsonb,
  created_at    timestamptz not null default now(),
  constraint imports_sent_rows_range check (sent_rows between 1 and 500),
  constraint imports_imported_rows_range check (imported_rows between 0 and sent_rows)
);

comment on table public.imports is
  'Una importación desde Excel (ADR-035). La escribe solo import_transactions; su id hace idempotente el reintento.';

-- RLS filtra por user_id y on delete cascade borra por user_id: los dos usan este índice.
create index imports_user_id_idx on public.imports (user_id);

alter table public.imports enable row level security;

create policy select_own_rows on public.imports
  for select to authenticated using (user_id = (select auth.uid()));

-- Supabase da todos los privilegios a anon/authenticated en tablas nuevas de public: solo lectura,
-- y únicamente para authenticated (anon → permission denied, C7).
revoke all on public.imports from anon, authenticated;
grant select on public.imports to authenticated, service_role;

-- ---------------------------------------------------------------------------
-- 2. import_transactions
-- ---------------------------------------------------------------------------
create function public.import_transactions(p_import_id uuid, p_rows jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user     uuid := auth.uid();
  v_count    int;
  v_inserted uuid;
  v_owner    uuid;
  v_saved    jsonb;
  v_row      jsonb;
  v_tx_id    uuid;
  v_rows     jsonb := '[]'::jsonb;
  v_imported int := 0;
  v_result   jsonb;
begin
  if v_user is null then
    raise exception 'import_transactions requiere una sesión' using errcode = '42501';
  end if;
  if p_import_id is null then
    raise exception 'falta el identificador de la importación' using errcode = 'check_violation';
  end if;
  if p_rows is null or jsonb_typeof(p_rows) <> 'array' then
    raise exception 'las filas tienen que ser una lista' using errcode = 'check_violation';
  end if;
  v_count := jsonb_array_length(p_rows);
  if v_count < 1 or v_count > 500 then
    raise exception 'una importación lleva de 1 a 500 filas' using errcode = 'check_violation';
  end if;

  -- Lo primero: reservar el id. Si otra llamada con el mismo id todavía corre, este insert espera a
  -- que termine (ADR-035): si confirmó, hay conflicto y se devuelve su resultado; si se deshizo, el
  -- insert entra y la importación se hace ahora. Dos llamadas nunca importan dos veces.
  insert into public.imports (id, user_id, sent_rows)
  values (p_import_id, v_user, v_count)
  on conflict (id) do nothing
  returning id into v_inserted;

  if v_inserted is null then
    select user_id, result into v_owner, v_saved from public.imports where id = p_import_id;
    -- El id de otro usuario se rechaza sin revelar nada de esa importación (C7).
    if v_owner is distinct from v_user then
      raise exception 'el identificador de la importación no es válido' using errcode = 'check_violation';
    end if;
    return coalesce(v_saved, '{}'::jsonb) || jsonb_build_object('already_imported', true);
  end if;

  for v_row in select value from jsonb_array_elements(p_rows) loop
    begin
      -- La lectura y el cast de cada campo van dentro del bloque: un elemento mal formado ("abc",
      -- una clave que falta, cuotas "3.5") rechaza su fila, no el lote. Los montos se leen como
      -- texto con ->> aunque lleguen como número JSON (C2).
      v_tx_id := public.create_transaction(
        p_type               => (v_row ->> 'type')::public.transaction_type,
        p_amount             => (v_row ->> 'amount')::numeric,
        p_currency           => (v_row ->> 'currency')::public.currency_code,
        p_fx_rate            => (v_row ->> 'fx_rate')::numeric,
        p_category_id        => (v_row ->> 'category_id')::uuid,
        p_account_id         => (v_row ->> 'account_id')::uuid,
        p_installments_count => (v_row ->> 'installments_count')::int,
        p_occurred_on        => (v_row ->> 'occurred_on')::date,
        p_description        => v_row ->> 'description'
      );
      v_rows := v_rows || jsonb_build_object('row', v_row -> 'row', 'status', 'imported', 'transaction_id', v_tx_id);
      v_imported := v_imported + 1;
    exception when others then
      -- Un error transitorio o de la base (serialización, deadlock, lock_timeout, recursos) no es de
      -- los datos de la fila: aborta el lote entero, no queda nada escrito y el reintento con el mismo
      -- id la importa (§7). Si se atrapara, la fila quedaría rechazada y el id, consumido.
      if sqlstate in ('40001', '40P01', '55P03') or left(sqlstate, 2) in ('53', '54', '57', '58', 'XX') then
        raise;
      end if;
      v_rows := v_rows || jsonb_build_object(
        'row', v_row -> 'row', 'status', 'rejected', 'error_code', sqlstate, 'error_message', sqlerrm
      );
    end;
  end loop;

  v_result := jsonb_build_object(
    'import_id', p_import_id,
    'sent_rows', v_count,
    'imported_rows', v_imported,
    'rows', v_rows
  );
  update public.imports set imported_rows = v_imported, result = v_result where id = p_import_id;

  return v_result || jsonb_build_object('already_imported', false);
end $$;

revoke execute on function public.import_transactions(uuid, jsonb) from public, anon;
grant execute on function public.import_transactions(uuid, jsonb) to authenticated;
