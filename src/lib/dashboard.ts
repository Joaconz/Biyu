import { addMonths, toDbDate, type Period } from '@/domain/period'
import type { ConsistencyTransaction, SummaryEntry } from '@/domain/summary'
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
      amount,
      amount_ars,
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
  // C2: amount y amount_ars pasan como string al dominio (parseMoney).
  return (
    data as unknown as Array<{
      period: string
      installment_number: number
      amount: number | string
      amount_ars: number | string
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
    amount: String(row.amount),
    amount_ars: String(row.amount_ars),
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
  } | null
  account: {
    id: string
    name: string
    type: string
  } | null
  // Imputación del período listado (US-17): qué cuota es y cuánto impacta en el mes.
  installment_number: number
  entry_amount: string // en la moneda de la transacción
  entry_amount_ars: string
}

/**
 * Trae las imputaciones del período con su transacción para el usuario autenticado (C7).
 * Parte de ledger_entries, igual que los KPIs (04-data-model, consultas 1 a 5): una compra en
 * cuotas de un mes anterior aparece con la cuota que cae en este período (US-17).
 * Excluye transacciones con soft delete (I10) y ordena por occurred_on desc.
 */
export async function fetchMonthlyTransactions(
  period: Period,
  limit?: number,
): Promise<DashboardTransaction[]> {
  const dbPeriod = toDbDate(period)
  let query = supabase
    .from('ledger_entries')
    .select(`
      installment_number,
      amount,
      amount_ars,
      transaction:transactions!ledger_entries_transaction_fk!inner (
        id,
        type,
        amount,
        currency,
        fx_rate,
        amount_ars,
        installments_count,
        occurred_on,
        description,
        created_at,
        deleted_at,
        category:categories!transactions_category_fk (id, name, color),
        account:accounts!transactions_account_fk (id, name, type)
      )
    `)
    .eq('period', dbPeriod)
    .is('transaction.deleted_at', null)
    // Orden por columnas de la transacción embebida: PostgREST exige que estén en el select.
    .order('transaction(occurred_on)', { ascending: false })
    .order('transaction(created_at)', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query
  if (error) throw error
  if (!data) return []

  // C2: los montos pasan como string; nunca se parsean a number.
  return (
    data as unknown as Array<{
      installment_number: number
      amount: number | string
      amount_ars: number | string
      transaction: {
        id: string
        type: 'expense' | 'income'
        amount: number | string
        currency: 'ARS' | 'USD'
        fx_rate: number | string | null
        amount_ars: number | string
        installments_count: number
        occurred_on: string
        description: string | null
        category: { id: string; name: string; color: string | null } | null
        account: { id: string; name: string; type: string } | null
      }
    }>
  ).map(({ transaction: tx, ...entry }) => ({
    id: tx.id,
    type: tx.type,
    amount: String(tx.amount),
    currency: tx.currency,
    fx_rate: tx.fx_rate ? String(tx.fx_rate) : null,
    amount_ars: String(tx.amount_ars),
    installments_count: tx.installments_count,
    occurred_on: tx.occurred_on,
    description: tx.description,
    category: tx.category,
    account: tx.account,
    installment_number: entry.installment_number,
    entry_amount: String(entry.amount),
    entry_amount_ars: String(entry.amount_ars),
  }))
}
