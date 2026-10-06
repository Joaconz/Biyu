import { useEffect, useState } from 'react'
import type { Period } from '@/domain/period'
import { fetchMonthlyTransactions, type DashboardTransaction, type TransactionsView } from '@/lib/dashboard'

export type MonthlyTransactionsState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; transactions: DashboardTransaction[] }

/**
 * Carga las transacciones del período con un límite opcional.
 * Vuelve a cargar si cambia el período o el límite.
 */
export function useMonthlyTransactions(
  period: Period,
  limit?: number,
  view: TransactionsView = 'active',
): MonthlyTransactionsState & { refresh: () => void } {
  const [state, setState] = useState<MonthlyTransactionsState>({ status: 'loading' })
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })

    fetchMonthlyTransactions(period, limit, view)
      .then((transactions) => {
        if (!cancelled) {
          setState({ status: 'ready', transactions })
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
  }, [period.year, period.month, limit, view, version])

  return {
    ...state,
    refresh: () => setVersion((v) => v + 1),
  }
}
