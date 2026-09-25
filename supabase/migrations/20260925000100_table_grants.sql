-- La migración inicial definió las políticas RLS pero ningún GRANT de tabla: authenticated no
-- podía ni leer y, en cambio, anon/authenticated tenían TRUNCATE/REFERENCES/TRIGGER (TRUNCATE se
-- salta RLS). Se dejan los privilegios mínimos; RLS (C7) filtra por user_id encima de esto.

revoke all on
  categories, accounts, fx_rates, subscriptions, transactions, ledger_entries, debts,
  ledger_integrity_violations
from anon, authenticated;

-- Lectura de todo (la vista es security_invoker: aplica RLS del que consulta).
grant select on
  categories, accounts, fx_rates, subscriptions, transactions, ledger_entries, debts,
  ledger_integrity_violations
to authenticated;

-- Escritura directa solo donde no hay una RPC que la reemplace. transactions y ledger_entries
-- se escriben únicamente vía create_transaction (C4, C10).
grant insert, update, delete on categories, accounts, fx_rates, subscriptions, debts to authenticated;
