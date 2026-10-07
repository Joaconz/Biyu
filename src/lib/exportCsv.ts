import {
  getExportDateRange,
  validateExportTransaction,
  type ExportScope,
  type ExportTransactionRow,
} from '@/domain/exportCsv'
import type { Period } from '@/domain/period'
import { supabase } from './supabase'

/**
 * Lee las transacciones activas del período bajo RLS (C7), paginadas de a 1.000 filas
 * con cursor sobre (occurred_on, created_at, id) y verificación de completitud (ADR-029).
 */
export async function fetchTransactionsForExport(
  scope: ExportScope,
  period: Period,
  signal?: AbortSignal,
): Promise<ExportTransactionRow[]> {
  const { startDate, endDate } = getExportDateRange(scope, period)
  const PAGE_SIZE = 1000
  const allRows: ExportTransactionRow[] = []
  let expectedCount: number | null = null
  let lastRow: ExportTransactionRow | null = null

  while (true) {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')

    let query = supabase
      .from('transactions')
      .select(
        `
        id,
        type,
        amount_text:amount::text,
        currency,
        fx_rate_text:fx_rate::text,
        amount_ars_text:amount_ars::text,
        installments_count,
        occurred_on,
        first_period,
        description,
        created_at,
        category:categories!transactions_category_fk (name),
        account:accounts!transactions_account_fk (name)
      `,
        { count: 'exact' as const },
      )
      .gte('occurred_on', startDate)
      .lte('occurred_on', endDate)
      .is('deleted_at', null) // CA-6, C10
      .order('occurred_on', { ascending: true })
      .order('created_at', { ascending: true })
      .order('id', { ascending: true })
      .limit(PAGE_SIZE)

    if (lastRow) {
      query = query.or(
        `occurred_on.gt.${lastRow.occurred_on},and(occurred_on.eq.${lastRow.occurred_on},created_at.gt.${lastRow.created_at}),and(occurred_on.eq.${lastRow.occurred_on},created_at.eq.${lastRow.created_at},id.gt.${lastRow.id})`,
      )
    }

    if (signal) {
      query = query.abortSignal(signal)
    }

    const { data, error, count } = await query
    if (error) throw error

    if (expectedCount === null) {
      if (typeof count !== 'number') {
        throw new Error('No se pudo verificar el conteo total')
      }
      expectedCount = count
      if (expectedCount === 0) {
        return []
      }
    }

    if (!data || data.length === 0) {
      break
    }

    for (const item of data) {
      const cat = item.category as { name: string } | null
      const acc = item.account as { name: string } | null

      const row: ExportTransactionRow = {
        id: item.id,
        type: item.type as 'expense' | 'income',
        amount: String(item.amount_text),
        currency: item.currency as 'ARS' | 'USD',
        fx_rate: item.fx_rate_text ? String(item.fx_rate_text) : null,
        amount_ars: String(item.amount_ars_text),
        installments_count: item.installments_count,
        occurred_on: item.occurred_on,
        first_period: item.first_period,
        description: item.description,
        created_at: item.created_at,
        category_name: cat?.name ?? null,
        account_name: acc?.name ?? '',
      }

      if (!validateExportTransaction(row)) {
        throw new Error(`Transacción con formato inválido: ${row.id}`)
      }

      allRows.push(row)
    }

    if (data.length < PAGE_SIZE || allRows.length >= expectedCount) {
      break
    }

    lastRow = allRows[allRows.length - 1]
  }

  // CA-15, Completitud: la cantidad leída debe ser exactamente igual al conteo inicial
  if (expectedCount !== null && allRows.length !== expectedCount) {
    throw new Error('La cantidad de movimientos exportados no coincide con el total')
  }

  // Verificar unicidad de IDs (sin repetidas)
  const uniqueIds = new Set(allRows.map((r) => r.id))
  if (uniqueIds.size !== allRows.length) {
    throw new Error('Filas duplicadas detectadas en la exportación')
  }

  return allRows
}

/**
 * Dispara la descarga del CSV en el navegador (NFR-04, ADR-029).
 */
export function downloadCsvFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
