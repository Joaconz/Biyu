import { addMonths, toDbDate, type Period } from '@/domain/period'
import type { ConsistencyTransaction, SummaryEntry } from '@/domain/summary'
import { supabase } from './supabase'

/**
 * Trae las imputaciones del período para el usuario autenticado (C7).
 * Se traen junto a su transacción vinculada para poder evaluar tipo y soft delete (I10).
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
      transaction:transactions!ledger_entries_transaction_fk (
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

  if (error) throw error
  if (!data) return []

  return data as ConsistencyTransaction[]
}

export interface DashboardTransaction {
  id: string
  type: 'expense' | 'income'
  amount: string
  currency: 'ARS' | 'USD'
  fx_rate: string | null
  amount_ars: string
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
}

/**
 * Trae las transacciones del período para el usuario autenticado (C7).
 * Excluye transacciones con soft delete (I10) y ordena por occurred_on desc.
 */
export async function fetchMonthlyTransactions(
  period: Period,
  limit?: number,
): Promise<DashboardTransaction[]> {
  const dbPeriod = toDbDate(period)
  let query = supabase
    .from('transactions')
    .select(`
      id,
      type,
      amount,
      currency,
      fx_rate,
      amount_ars,
      installments_count,
      occurred_on,
      description,
      category:categories!transactions_category_fk (id, name, color),
      account:accounts!transactions_account_fk (id, name, type)
    `)
    .eq('first_period', dbPeriod)
    .is('deleted_at', null)
    .order('occurred_on', { ascending: false })
    .order('created_at', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query
  if (error) throw error
  if (!data) return []

  return (
    data as unknown as Array<{
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
    }>
  ).map((row) => ({
    id: row.id,
    type: row.type,
    amount: String(row.amount),
    currency: row.currency,
    fx_rate: row.fx_rate ? String(row.fx_rate) : null,
    amount_ars: String(row.amount_ars),
    installments_count: row.installments_count,
    occurred_on: row.occurred_on,
    description: row.description,
    category: row.category,
    account: row.account,
  }))
}

