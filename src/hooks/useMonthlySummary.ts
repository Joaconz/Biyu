import { useEffect, useState } from 'react'
import type { Period } from '@/domain/period'
import { computeMonthlySummary, type MonthlySummary } from '@/domain/summary'
import { fetchAllCategories } from '@/lib/catalog'
import { fetchMonthlyLedgerEntries } from '@/lib/dashboard'

export type MonthlySummaryState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; summary: MonthlySummary }

/**
 * Carga el resumen mensual para un período determinado.
 * Vuelve a cargar si cambia el período.
 */
export function useMonthlySummary(period: Period): MonthlySummaryState {
  const [state, setState] = useState<MonthlySummaryState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })

    Promise.all([fetchMonthlyLedgerEntries(period), fetchAllCategories()])
      .then(([entries, categories]) => {
        if (!cancelled) {
          const summary = computeMonthlySummary(entries, [], period, categories)
          setState({ status: 'ready', summary })
        }
      })
      .catch((error: { message?: string }) => {
        if (!cancelled) {
          setState({ status: 'error', message: error.message ?? 'Error desconocido' })
        }
      })

    return () => {
      cancelled = true
    }
  }, [period.year, period.month])

  return state
}
