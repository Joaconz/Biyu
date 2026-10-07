import { useEffect, useState } from 'react'
import type { Period } from '@/domain/period'
import {
  computeMonthlySummary,
  countDaysWithTransactions,
  type MonthlySummary,
} from '@/domain/summary'
import {
  fetchMonthlyConsistencyTransactions,
  fetchMonthlyLedgerEntries,
  fetchMonthlyReimbursementDebts,
} from '@/lib/dashboard'

export type MonthlySummaryState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; summary: MonthlySummary; daysWithTransactions: number }

/**
 * Carga el resumen mensual para un período determinado.
 * Vuelve a cargar si cambia el período. Las deudas del neto de reembolsos (US-30) vienen en la
 * misma carga: si falla cualquier parte, se ve el error y ningún número a medias.
 */
export function useMonthlySummary(period: Period): MonthlySummaryState & { refresh: () => void } {
  const [state, setState] = useState<MonthlySummaryState>({ status: 'loading' })
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })

    Promise.all([
      fetchMonthlyLedgerEntries(period),
      fetchMonthlyConsistencyTransactions(period),
      fetchMonthlyReimbursementDebts(period),
    ])
      .then(([entries, transactions, debts]) => {
        if (!cancelled) {
          const summary = computeMonthlySummary(entries, debts, period)
          const daysWithTransactions = countDaysWithTransactions(transactions, period)
          setState({ status: 'ready', summary, daysWithTransactions })
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
  }, [period.year, period.month, version])

  return {
    ...state,
    refresh: () => setVersion((v) => v + 1),
  }
}
