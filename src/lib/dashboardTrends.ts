import { trendRange, type TrendEntry } from '@/domain/dashboardTrends'
import { toDbDate, type Period } from '@/domain/period'
import { supabase } from './supabase'

/** PostgREST corta cada respuesta en `max_rows` (1000, supabase/config.toml): se lee por páginas de ese tamaño. */
const PAGE_SIZE = 1000

/**
 * Imputaciones de los 5 meses anteriores al período, el período y los 6 siguientes, para las tres
 * series de tendencia del Resumen (ADR-050): gastado vs ingresos, ritmo del mes y cuotas que vienen.
 * Una sola consulta a ledger_entries, igual que los KPIs (ADR-001). El `!inner` con filtro en
 * `deleted_at` deja afuera las de transacciones eliminadas (I10, C10); RLS acota al usuario (C7).
 * El monto va como texto (C2). Se ordena por (period, id) para que las páginas no repitan ni se salteen filas.
 */
export async function fetchTrendEntries(period: Period): Promise<TrendEntry[]> {
  const { from, to } = trendRange(period)
  const rows: TrendEntry[] = []
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const { data, error } = await supabase
      .from('ledger_entries')
      .select(`
        period,
        installment_number,
        amount_ars_text:amount_ars::text,
        transaction:transactions!ledger_entries_transaction_fk!inner (type, occurred_on, deleted_at)
      `)
      .gte('period', toDbDate(from))
      .lte('period', toDbDate(to))
      .is('transaction.deleted_at', null)
      .order('period')
      .order('id')
      .range(offset, offset + PAGE_SIZE - 1)

    if (error) throw error
    const page = (data ?? []) as unknown as Array<{
      period: string
      installment_number: number
      amount_ars_text: string
      transaction: { type: 'expense' | 'income'; occurred_on: string; deleted_at: string | null }
    }>
    for (const row of page) {
      rows.push({
        period: row.period,
        installment_number: row.installment_number,
        amount_ars: row.amount_ars_text,
        transaction: {
          type: row.transaction.type,
          occurred_on: row.transaction.occurred_on,
          deleted_at: row.transaction.deleted_at,
        },
      })
    }
    if (page.length < PAGE_SIZE) return rows
  }
}
