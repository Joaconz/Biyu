-- US-101 (#371), ADR-047: qué entra en el balance del Resumen, por usuario. Tres booleanos del propio
-- usuario, sin invariante financiera que proteger: se escriben directo bajo RLS, como user_setup (ADR-025),
-- y no en user_setup porque su fila significa «pasó por el setup inicial» (DEF-022). Sin fila valen los
-- predeterminados, que son los de antes de esta opción.

create table public.user_preferences (
  user_id                       uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  balance_loose_debts           boolean not null default true,
  balance_reimbursements        boolean not null default false,
  balance_pending_subscriptions boolean not null default false,
  updated_at                    timestamptz not null default now()
);

comment on table public.user_preferences is
  'Preferencias del usuario (ADR-047). Cambiarlas no reescribe ninguna transacción: solo cambia cómo se suma al leer.';

alter table public.user_preferences enable row level security;

create policy select_own_rows on public.user_preferences for select to authenticated using (user_id = auth.uid());
create policy insert_own_rows on public.user_preferences for insert to authenticated with check (user_id = auth.uid());
create policy update_own_rows on public.user_preferences for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Privilegios mínimos: sin delete (se va con la cuenta, on delete cascade) y nada para anon (C7).
revoke all on public.user_preferences from anon, authenticated;
grant select on public.user_preferences to authenticated, service_role;
grant insert, update on public.user_preferences to authenticated;
