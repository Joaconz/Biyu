import { useEffect, useState } from 'react'
import {
  buildMonthlyFlow,
  buildMonthPace,
  buildUpcomingInstallments,
  type FlowMonth,
  type MonthPace,
  type UpcomingMonth,
} from '@/domain/dashboardTrends'
import { toIsoDate, type Period } from '@/domain/period'
import { todayInArgentina } from '@/lib/clock'
import { fetchTrendEntries } from '@/lib/dashboardTrends'

export interface DashboardTrends {
  flow: FlowMonth[]
  pace: MonthPace
  upcoming: UpcomingMonth[]
}

export type DashboardTrendsState = { status: 'loading' } | { status: 'error' } | { status: 'ready'; trends: DashboardTrends }

/**
 * Las series de tendencia del Resumen (ADR-050). Son datos secundarios: si no se pueden leer, el
 * estado es `error` y el Resumen se muestra igual sin esas tarjetas (ADR-031, como ADR-045). Mientras
 * recarga por un cambio de período o un borrado, conserva lo anterior en vez de saltar a un esqueleto.
 */
export function useDashboardTrends(period: Period): DashboardTrendsState & { refresh: () => void } {
  const [state, setState] = useState<DashboardTrendsState>({ status: 'loading' })
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let cancelled = false
    fetchTrendEntries(period)
      .then((entries) => {
        if (cancelled) return
        const trends = {
          flow: buildMonthlyFlow(entries, period),
          pace: buildMonthPace(entries, period, toIsoDate(todayInArgentina())),
          upcoming: buildUpcomingInstallments(entries, period),
        }
        setState({ status: 'ready', trends })
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error' })
      })
    return () => {
      cancelled = true
    }
  }, [period.year, period.month, version])

  return { ...state, refresh: () => setVersion((v) => v + 1) }
}
