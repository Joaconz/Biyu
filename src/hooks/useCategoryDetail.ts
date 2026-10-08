import { useEffect, useState } from 'react'
import { buildEvolution, computeCategoryPeriodTotals, isUuid, type CategoryPeriodTotals, type EvolutionBar } from '@/domain/categoryDetail'
import type { Period } from '@/domain/period'
import { fetchCategory, fetchCategoryEvolution, type CategoryRecord } from '@/lib/categoryDetail'
import { fetchMonthlyLedgerEntries, fetchMonthlyTransactions, type DashboardTransaction } from '@/lib/dashboard'

/** Alto en px de la barra del mayor de los 6 meses. */
export const EVOLUTION_MAX_HEIGHT_PX = 120

export type CategoryDetailState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'not-found' }
  | {
      status: 'ready'
      category: CategoryRecord
      totals: CategoryPeriodTotals
      evolution: EvolutionBar[]
      transactions: DashboardTransaction[]
    }

/**
 * Carga el detalle de una categoría en un período (US-73): la categoría, el total del período
 * (sobre las imputaciones de todo el mes, para el porcentaje), los 6 meses y sus gastos. Si falla
 * cualquier parte se ve el error y nada a medias; `retry` vuelve a pedir todo. Un id que no es
 * UUID es una categoría inexistente y no se consulta nada (CA-18).
 */
export function useCategoryDetail(categoryId: string, period: Period): CategoryDetailState & { retry: () => void } {
  const validId = isUuid(categoryId)
  const [state, setState] = useState<CategoryDetailState>(validId ? { status: 'loading' } : { status: 'not-found' })
  const [version, setVersion] = useState(0)

  useEffect(() => {
    if (!validId) {
      setState({ status: 'not-found' })
      return
    }
    let cancelled = false
    setState({ status: 'loading' })

    Promise.all([
      fetchCategory(categoryId),
      fetchMonthlyLedgerEntries(period),
      fetchCategoryEvolution(categoryId, period),
      fetchMonthlyTransactions(period, undefined, 'active', categoryId),
    ])
      .then(([category, entries, evolution, transactions]) => {
        if (cancelled) return
        // RLS: inexistente y de otro usuario se ven igual, 0 filas (CA-19).
        if (!category) {
          setState({ status: 'not-found' })
          return
        }
        setState({
          status: 'ready',
          category,
          totals: computeCategoryPeriodTotals(entries, categoryId, period),
          evolution: buildEvolution(evolution, period, EVOLUTION_MAX_HEIGHT_PX),
          transactions,
        })
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error' })
      })

    return () => {
      cancelled = true
    }
  }, [categoryId, validId, period.year, period.month, version])

  return { ...state, retry: () => setVersion((v) => v + 1) }
}
