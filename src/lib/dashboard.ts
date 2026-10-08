import { addMonths, toDbDate, type Period } from '@/domain/period'
import type { ConsistencyTransaction, SummaryDebt, SummaryEntry } from '@/domain/summary'
import { supabase } from './supabase'

/**
 * Trae las imputaciones del período para el usuario autenticado (C7).
 * El join `!inner` con filtro en `deleted_at` excluye las de transacciones borradas en la
 * consulta, cualquiera sea la cuota (I10, US-18); el dominio vuelve a filtrar por las dudas.
 */
export async function fetchMonthlyLedgerEntries(period: Period): Promise<SummaryEntry[]> {
  const dbPeriod = toDbDate(period)
  const { data, error } = await supabase
    .from('ledger_entries')
    .select(`
      period,
      installment_number,
      amount_text:amount::text,
      amount_ars_text:amount_ars::text,
      transaction:transactions!ledger_entries_transaction_fk!inner (
        id,
        type,
        currency,
        category_id,
        account_id,
        first_period,
        deleted_at,
        category:categories!transactions_category_fk (
          id,
          name,
          color,
          archived_at
        ),
        account:accounts!transactions_account_fk (
          id,
          name,
          type,
          archived_at
        )
      )
    `)
    .eq('period', dbPeriod)
    .is('transaction.deleted_at', null)

  if (error) throw error
  if (!data) return []

  // PostgREST devuelve los datos con la relación `transaction`.
  // C2: amount y amount_ars se piden con ::text (sin el cast llegarían como número JSON) y pasan
  // como string al dominio (parseMoney).
  return (
    data as unknown as Array<{
      period: string
      installment_number: number
      amount_text: string
      amount_ars_text: string
      transaction: {
        id: string
        type: 'expense' | 'income'
        currency: 'ARS' | 'USD'
        category_id: string | null
        account_id: string
        first_period: string
        deleted_at: string | null
        category: {
          id: string
          name: string
          color: string | null
          archived_at: string | null
        } | null
        account: {
          id: string
          name: string
          type: string
          archived_at: string | null
        } | null
      }
    }>
  ).map((row) => ({
    period: row.period,
    installment_number: row.installment_number,
    amount: row.amount_text,
    amount_ars: row.amount_ars_text,
    transaction: {
      id: row.transaction.id,
      type: row.transaction.type,
      currency: row.transaction.currency,
      category_id: row.transaction.category_id,
      account_id: row.transaction.account_id,
      first_period: row.transaction.first_period,
      deleted_at: row.transaction.deleted_at,
      category: row.transaction.category,
      account: row.transaction.account,
    },
  }))
}

/**
 * Deudas que pueden restar en el neto de reembolsos del período (US-30, consulta 6): a favor y
 * vinculadas a un gasto vigente que nace en el período. El `!inner` deja afuera las sueltas; el
 * dominio (computeMonthlySummary) vuelve a aplicar la regla completa. amount_ars viaja como texto,
 * porque PostgREST manda numeric como número JSON (C2).
 */
export async function fetchMonthlyReimbursementDebts(period: Period): Promise<SummaryDebt[]> {
  const { data, error } = await supabase
    .from('debts')
    .select(`
      transaction_id,
      direction,
      amount_ars_text:amount_ars::text,
      transaction:transactions!debts_transaction_fk!inner (first_period, deleted_at)
    `)
    .eq('direction', 'owed_to_me')
    .eq('transaction.first_period', toDbDate(period))
    .is('transaction.deleted_at', null)

  if (error) throw error
  return (data ?? []).map((row) => ({
    transaction_id: row.transaction_id,
    direction: row.direction,
    amount_ars: requiredText(row.amount_ars_text),
    transaction_first_period: row.transaction?.first_period ?? null,
    transaction_deleted_at: row.transaction?.deleted_at ?? null,
  }))
}

/** amount_ars es generada y nunca nula; si igual faltara, la carga falla en vez de sumar un vacío. */
function requiredText(value: string | null): string {
  if (value === null) throw new Error('Deuda sin amount_ars')
  return value
}

/**
 * Trae las transacciones del período (por occurred_on) para calcular días con registro (US-32, FR-20).
 * Parte de transactions, no de ledger_entries (04-data-model, consulta 7).
 */
export async function fetchMonthlyConsistencyTransactions(
  period: Period,
): Promise<ConsistencyTransaction[]> {
  const start = toDbDate(period)
  const nextStart = toDbDate(addMonths(period, 1))

  const { data, error } = await supabase
    .from('transactions')
    .select('occurred_on, deleted_at')
    .gte('occurred_on', start)
    .lt('occurred_on', nextStart)
    .is('deleted_at', null) // I10

  if (error) throw error
  if (!data) return []

  return data as ConsistencyTransaction[]
}

export interface DashboardTransaction {
  id: string
  type: 'expense' | 'income'
  amount: string // total de la transacción, en su moneda (lo usa el diálogo de borrado)
  currency: 'ARS' | 'USD'
  fx_rate: string | null
  amount_ars: string // total de la transacción en ARS
  installments_count: number
  occurred_on: string
  description: string | null
  category: {
    id: string
    name: string
    color: string | null
    archived_at: string | null // DEF-006: la fila la marca como archivada
  } | null
  account: {
    id: string
    name: string
    type: string
  } | null
  deleted_at: string | null // DEF-007: solo en el filtro "Eliminados" de /transactions
  /** Deuda vinculada de un gasto compartido (US-35, ADR-036): una por gasto, o null. */
  shared_debt: { person: string; amount: string } | null
  /** Suscripción que generó la transacción (US-60), por subscription_id y no por el nombre; o null. */
  subscription: { id: string; name: string; period: string } | null
  // Imputación del período listado (US-17): qué cuota es y cuánto impacta en el mes.
  installment_number: number
  entry_amount: string // en la moneda de la transacción
  entry_amount_ars: string
}

/** Qué movimientos lista /transactions: los activos, o los eliminados para restaurarlos (DEF-007). */
export type TransactionsView = 'active' | 'deleted'

/**
 * Trae las imputaciones del período con su transacción para el usuario autenticado (C7).
 * Parte de ledger_entries, igual que los KPIs (04-data-model, consultas 1 a 5): una compra en
 * cuotas de un mes anterior aparece con la cuota que cae en este período (US-17).
 * Excluye transacciones con soft delete (I10) y ordena por occurred_on desc.
 */
export async function fetchMonthlyTransactions(
  period: Period,
  limit?: number,
  view: TransactionsView = 'active',
  /** Solo los gastos de esta categoría (detalle de categoría, US-73). */
  expensesOfCategory?: string,
): Promise<DashboardTransaction[]> {
  const dbPeriod = toDbDate(period)
  let query = supabase
    .from('ledger_entries')
    .select(`
      installment_number,
      amount_text:amount::text,
      amount_ars_text:amount_ars::text,
      transaction:transactions!ledger_entries_transaction_fk!inner (
        id,
        type,
        amount_text:amount::text,
        currency,
        fx_rate_text:fx_rate::text,
        amount_ars_text:amount_ars::text,
        installments_count,
        occurred_on,
        description,
        created_at,
        deleted_at,
        category:categories!transactions_category_fk (id, name, color, archived_at),
        account:accounts!transactions_account_fk (id, name, type),
        debts:debts!debts_transaction_fk (person, amount_text:amount::text),
        subscription_period,
        subscription:subscriptions!transactions_subscription_fk (id, name)
      )
    `)
    .eq('period', dbPeriod)
  // I10: los KPIs y el listado normal nunca ven las eliminadas; el filtro "Eliminados" ve solo esas (DEF-007).
  query = view === 'deleted' ? query.not('transaction.deleted_at', 'is', null) : query.is('transaction.deleted_at', null)
  if (expensesOfCategory) {
    query = query.eq('transaction.category_id', expensesOfCategory).eq('transaction.type', 'expense')
  }
  query = query
    // Orden por columnas de la transacción embebida: PostgREST exige que estén en el select.
    .order('transaction(occurred_on)', { ascending: false })
    .order('transaction(created_at)', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query
  if (error) throw error
  if (!data) return []

  // C2: los montos se piden con ::text (sin el cast llegarían como número JSON) y pasan como string;
  // nunca se parsean a number.
  return (
    data as unknown as Array<{
      installment_number: number
      amount_text: string
      amount_ars_text: string
      transaction: {
        id: string
        type: 'expense' | 'income'
        amount_text: string
        currency: 'ARS' | 'USD'
        fx_rate_text: string | null
        amount_ars_text: string
        installments_count: number
        occurred_on: string
        description: string | null
        deleted_at: string | null
        category: { id: string; name: string; color: string | null; archived_at: string | null } | null
        account: { id: string; name: string; type: string } | null
        debts: { person: string; amount_text: string }[] | null
        subscription_period: string | null
        subscription: { id: string; name: string } | null
      }
    }>
  ).map(({ transaction: tx, ...entry }) => ({
    id: tx.id,
    type: tx.type,
    amount: tx.amount_text,
    currency: tx.currency,
    fx_rate: tx.fx_rate_text,
    amount_ars: tx.amount_ars_text,
    installments_count: tx.installments_count,
    occurred_on: tx.occurred_on,
    description: tx.description,
    category: tx.category,
    account: tx.account,
    deleted_at: tx.deleted_at,
    // La deuda viene en la misma consulta: el diálogo de borrado nunca se abre sin saber si hay una.
    shared_debt: tx.debts?.[0] ? { person: tx.debts[0].person, amount: tx.debts[0].amount_text } : null,
    subscription:
      tx.subscription && tx.subscription_period
        ? { id: tx.subscription.id, name: tx.subscription.name, period: tx.subscription_period }
        : null,
    installment_number: entry.installment_number,
    entry_amount: entry.amount_text,
    entry_amount_ars: entry.amount_ars_text,
  }))
}
