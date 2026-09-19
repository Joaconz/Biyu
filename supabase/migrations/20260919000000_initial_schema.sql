-- Schema inicial de Biyu, derivado de docs/04-data-model.md.
-- Sin funciones RPC (create_transaction, generate_ledger_entries) ni Edge Functions:
-- este archivo es solo tablas, constraints, RLS y la vista de integridad.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type currency_code as enum ('ARS', 'USD');
create type account_type as enum ('credit_card', 'debit_card', 'cash', 'bank_account', 'wallet');
create type transaction_type as enum ('expense', 'income');
create type subscription_status as enum ('active', 'paused', 'cancelled');
create type debt_direction as enum ('owed_to_me', 'i_owe');
create type debt_status as enum ('pending', 'settled');

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
create table categories (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null,
  color       text,
  icon        text,
  archived_at timestamptz,
  created_at  timestamptz not null default now()
);

-- Índice único parcial: permite reutilizar el nombre de una categoría archivada.
create unique index categories_user_name_active_uq
  on categories (user_id, name) where archived_at is null;

-- ---------------------------------------------------------------------------
-- accounts
-- ---------------------------------------------------------------------------
create table accounts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null,
  type        account_type not null,
  currency    currency_code not null,
  archived_at timestamptz,
  created_at  timestamptz not null default now()
);

create unique index accounts_user_name_active_uq
  on accounts (user_id, name) where archived_at is null;

-- ---------------------------------------------------------------------------
-- fx_rates
-- ---------------------------------------------------------------------------
create table fx_rates (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  period      date not null,
  ars_per_usd numeric(14,4) not null,
  created_at  timestamptz not null default now(),
  constraint fx_rates_period_first_day check (extract(day from period) = 1),
  constraint fx_rates_ars_per_usd_positive check (ars_per_usd > 0),
  constraint fx_rates_user_period_uq unique (user_id, period)
);

-- ---------------------------------------------------------------------------
-- subscriptions
-- ---------------------------------------------------------------------------
create table subscriptions (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name                 text not null,
  amount               numeric(14,2) not null,
  currency             currency_code not null,
  category_id          uuid not null references categories (id),
  account_id           uuid not null references accounts (id),
  billing_day          int not null,
  start_period         date not null,
  end_period           date,
  generate_from_period date not null,
  status               subscription_status not null default 'active',
  paused_at            timestamptz,
  cancelled_at         timestamptz,
  description          text,
  created_at           timestamptz not null default now(),
  constraint subscriptions_amount_positive check (amount > 0),                       -- I4
  constraint subscriptions_billing_day_range check (billing_day between 1 and 31),   -- I13
  constraint subscriptions_start_first_day check (extract(day from start_period) = 1),
  constraint subscriptions_end_first_day check (end_period is null or extract(day from end_period) = 1),
  constraint subscriptions_generate_from_first_day check (extract(day from generate_from_period) = 1),
  constraint subscriptions_start_le_generate_from check (start_period <= generate_from_period), -- I12
  constraint subscriptions_start_le_end check (end_period is null or start_period <= end_period), -- I12
  constraint subscriptions_paused_at_set check (status <> 'paused' or paused_at is not null),         -- I15
  constraint subscriptions_cancelled_at_set check (status <> 'cancelled' or cancelled_at is not null) -- I15
);

-- Se puede reutilizar el nombre de una suscripción cancelada.
create unique index subscriptions_user_name_not_cancelled_uq
  on subscriptions (user_id, name) where status <> 'cancelled';

-- ---------------------------------------------------------------------------
-- transactions
-- ---------------------------------------------------------------------------
create table transactions (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null default auth.uid() references auth.users (id) on delete cascade,
  type                transaction_type not null,
  amount              numeric(14,2) not null,
  currency            currency_code not null,
  fx_rate             numeric(14,4),
  amount_ars          numeric(14,2) generated always as (
                        case when currency = 'ARS' then amount
                             else round(amount * fx_rate, 2) end
                      ) stored,
  category_id         uuid references categories (id),
  account_id          uuid not null references accounts (id),
  installments_count  int not null default 1,
  first_period        date not null,
  description         text,
  occurred_on         date not null,
  subscription_id     uuid references subscriptions (id),
  subscription_period date,
  deleted_at          timestamptz,
  created_at          timestamptz not null default now(),
  constraint transactions_amount_positive check (amount > 0),                                   -- I4
  constraint transactions_fx_rate_iff_usd check ((currency = 'USD') = (fx_rate is not null)),   -- I5
  constraint transactions_fx_rate_positive check (fx_rate is null or fx_rate > 0),
  constraint transactions_expense_has_category check (type <> 'expense' or category_id is not null), -- I8
  constraint transactions_installments_positive check (installments_count >= 1),
  constraint transactions_first_period_first_day check (extract(day from first_period) = 1),
  constraint transactions_subscription_period_first_day
    check (subscription_period is null or extract(day from subscription_period) = 1),
  constraint transactions_subscription_pair
    check ((subscription_id is null) = (subscription_period is null)),
  constraint transactions_subscription_single_expense                                           -- I14
    check (subscription_id is null or (installments_count = 1 and type = 'expense'))
);

-- I11: idempotencia de la puesta al día. No filtra por deleted_at a propósito.
create unique index transactions_subscription_period_uq
  on transactions (subscription_id, subscription_period) where subscription_id is not null;

-- ---------------------------------------------------------------------------
-- ledger_entries
-- ---------------------------------------------------------------------------
create table ledger_entries (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null default auth.uid() references auth.users (id) on delete cascade,
  transaction_id     uuid not null references transactions (id) on delete cascade,
  period             date not null,
  installment_number int not null,
  amount             numeric(14,2) not null,
  amount_ars         numeric(14,2) not null,  -- no generada: absorbe el resto en el dominio (I1')
  constraint ledger_entries_period_first_day check (extract(day from period) = 1),
  constraint ledger_entries_installment_positive check (installment_number >= 1),
  constraint ledger_entries_amount_positive check (amount > 0),         -- I4
  constraint ledger_entries_amount_ars_positive check (amount_ars > 0), -- I4
  constraint ledger_entries_tx_installment_uq unique (transaction_id, installment_number)
);

-- Acceso principal del dashboard.
create index ledger_entries_user_period_idx on ledger_entries (user_id, period);

-- ---------------------------------------------------------------------------
-- debts
-- ---------------------------------------------------------------------------
create table debts (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null default auth.uid() references auth.users (id) on delete cascade,
  transaction_id uuid references transactions (id),
  person         text not null,
  amount         numeric(14,2) not null,
  currency       currency_code not null,
  fx_rate        numeric(14,4),
  amount_ars     numeric(14,2) generated always as (
                   case when currency = 'ARS' then amount
                        else round(amount * fx_rate, 2) end
                 ) stored,
  direction      debt_direction not null,
  status         debt_status not null default 'pending',
  settled_at     timestamptz,
  notes          text,
  incurred_on    date not null,
  created_at     timestamptz not null default now(),
  constraint debts_amount_positive check (amount > 0),                                 -- I4
  constraint debts_fx_rate_iff_usd check ((currency = 'USD') = (fx_rate is not null)), -- I5
  constraint debts_fx_rate_positive check (fx_rate is null or fx_rate > 0),
  constraint debts_settled_at_set check (status <> 'settled' or settled_at is not null) -- I9
);

-- ---------------------------------------------------------------------------
-- Row Level Security (C7): ninguna política es más laxa que user_id = auth.uid().
-- El rol anon no tiene políticas, así que ve cero filas.
-- ---------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'categories', 'accounts', 'fx_rates', 'subscriptions',
    'transactions', 'ledger_entries', 'debts'
  ]
  loop
    execute format('alter table %I enable row level security', t);
    execute format(
      'create policy %I on %I for select to authenticated using (user_id = auth.uid())',
      'select_own_rows', t);
    execute format(
      'create policy %I on %I for insert to authenticated with check (user_id = auth.uid())',
      'insert_own_rows', t);
    execute format(
      'create policy %I on %I for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid())',
      'update_own_rows', t);
    execute format(
      'create policy %I on %I for delete to authenticated using (user_id = auth.uid())',
      'delete_own_rows', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Vista de integridad: transacciones cuya suma de imputaciones no cuadra (I1, I1').
-- security_invoker para que RLS se aplique con el usuario que consulta.
-- ---------------------------------------------------------------------------
create view ledger_integrity_violations with (security_invoker = true) as
select
  t.id                                   as transaction_id,
  t.user_id,
  t.amount                               as transaction_amount,
  coalesce(sum(le.amount), 0)            as entries_amount,
  t.amount_ars                           as transaction_amount_ars,
  coalesce(sum(le.amount_ars), 0)        as entries_amount_ars
from transactions t
left join ledger_entries le on le.transaction_id = t.id
group by t.id
having coalesce(sum(le.amount), 0) <> t.amount
    or coalesce(sum(le.amount_ars), 0) <> t.amount_ars;
