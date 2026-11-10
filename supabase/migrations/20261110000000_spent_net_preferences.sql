-- ADR-053: el Resumen muestra un solo número, el gasto neto. Qué entra en él es una preferencia del usuario
-- (ADR-047): se suma «restar ingresos» y el predeterminado pasa a «solo gastos». Es una preferencia y no un
-- movimiento: no reescribe ninguna transacción ni imputación (C5), solo cambia cómo se suma al leer.

alter table public.user_preferences
  add column balance_income boolean not null default false;

comment on column public.user_preferences.balance_income is
  'Resta los ingresos del mes al gasto neto del Resumen (ADR-053). Con ingresos mayores al gasto el número queda negativo.';

-- Antes las deudas sueltas entraban por defecto (era el balance); ahora el número arranca en «solo gastos».
alter table public.user_preferences
  alter column balance_loose_debts set default false;

-- Las filas guardadas eran de prueba y respondían a la pregunta de otro número: se vuelve a «solo gastos».
update public.user_preferences
set balance_loose_debts = false,
    balance_reimbursements = false,
    balance_pending_subscriptions = false,
    updated_at = now();
