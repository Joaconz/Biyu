-- US-68 (#159), DEF-017 (#165): una fila por usuario que marca si ya pasó por la configuración
-- inicial. Sin invariante financiera que proteger (a diferencia de transactions/ledger_entries),
-- así que se escribe directo bajo RLS, igual que categories/accounts (C7), sin RPC (ADR-025).

create table public.user_setup (
  user_id      uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  usage_reason text,
  completed_at timestamptz,
  created_at   timestamptz not null default now()
);

alter table public.user_setup enable row level security;

create policy select_own_rows on public.user_setup for select to authenticated using (user_id = auth.uid());
create policy insert_own_rows on public.user_setup for insert to authenticated with check (user_id = auth.uid());
create policy update_own_rows on public.user_setup for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Privilegios mínimos (mismo criterio que 20260925000100_table_grants.sql): sin delete, nadie
-- necesita borrar su propia fila de setup.
revoke all on public.user_setup from anon, authenticated;
grant select on public.user_setup to authenticated, service_role;
grant insert, update on public.user_setup to authenticated;
