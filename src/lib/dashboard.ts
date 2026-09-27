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
      amount_ars,
      transaction:transactions!ledger_entries_transaction_fk (
        id,
        type,
        category_id,
        account_id,
        first_period,
        deleted_at
      )
    `)
    .eq('period', dbPeriod)

  if (error) throw error
  if (!data) return []

  // PostgREST devuelve los datos con la relación `transaction`.
  // C2: amount_ars pasa como string al dominio (parseMoney).
  return (
    data as unknown as Array<{
      period: string
      installment_number: number
      amount_ars: number | string
      transaction: {
        id: string
        type: 'expense' | 'income'
        category_id: string | null
        account_id: string
        first_period: string
        deleted_at: string | null
      }
    }>
  ).map((row) => ({
    period: row.period,
    installment_number: row.installment_number,
    amount_ars: String(row.amount_ars),
    transaction: {
      id: row.transaction.id,
      type: row.transaction.type,
      category_id: row.transaction.category_id,
      account_id: row.transaction.account_id,
      first_period: row.transaction.first_period,
      deleted_at: row.transaction.deleted_at,
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

