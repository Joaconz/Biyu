import { useEffect, useMemo, useState } from 'react'
import type { BalanceOptions } from '@/domain/balance'
import type { Period } from '@/domain/period'
import {
  computeMonthlySummary,
  countDaysWithTransactions,
  type LooseDebt,
  type MonthlySummary,
  type SummaryDebt,
  type SummaryEntry,
} from '@/domain/summary'
import {
  fetchMonthlyConsistencyTransactions,
  fetchLooseDebts,
  fetchMonthlyLedgerEntries,
  fetchMonthlyReimbursementDebts,
} from '@/lib/dashboard'
import { fetchBalanceOptions } from '@/lib/preferences'

export type MonthlySummaryState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; summary: MonthlySummary; daysWithTransactions: number; balanceOptions: BalanceOptions }

/** Lo que llega de la base: el resumen se calcula a partir de esto con las opciones del balance. */
type Loaded = {
  period: Period
  entries: SummaryEntry[]
  debts: SummaryDebt[]
  looseDebts: LooseDebt[]
  storedOptions: BalanceOptions
  daysWithTransactions: number
}

type LoadState = { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready'; loaded: Loaded }

/**
 * Carga el resumen mensual para un período determinado.
 * Vuelve a cargar si cambia el período. Las deudas del neto de reembolsos (US-30) vienen en la
 * misma carga, igual que las deudas sueltas y las preferencias del balance (US-83, US-101): si falla cualquier parte, se ve el error y ningún número a medias.
 *
 * `balanceOptions`, si viene, reemplaza a las guardadas: el héroe del Resumen las cambia y el resumen se
 * recalcula al instante con los datos ya cargados, sin volver a pedirlos (ADR-051, ADR-053).
 */
export function useMonthlySummary(
  period: Period,
  balanceOptions?: BalanceOptions | null,
): MonthlySummaryState & { refresh: () => void } {
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })

    Promise.all([
      fetchMonthlyLedgerEntries(period),
      fetchMonthlyConsistencyTransactions(period),
      fetchMonthlyReimbursementDebts(period),
      fetchLooseDebts(),
      fetchBalanceOptions(),
    ])
      .then(([entries, transactions, debts, looseDebts, storedOptions]) => {
        if (!cancelled) {
          const daysWithTransactions = countDaysWithTransactions(transactions, period)
          setState({ status: 'ready', loaded: { period, entries, debts, looseDebts, storedOptions, daysWithTransactions } })
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

  const result = useMemo((): MonthlySummaryState => {
    if (state.status !== 'ready') return state
    const { period: loadedPeriod, entries, debts, looseDebts, storedOptions, daysWithTransactions } = state.loaded
    const options = balanceOptions ?? storedOptions
    const summary = computeMonthlySummary(entries, debts, loadedPeriod, looseDebts, options)
    return { status: 'ready', summary, daysWithTransactions, balanceOptions: options }
  }, [state, balanceOptions])

  return {
    ...result,
    refresh: () => setVersion((v) => v + 1),
  }
}
