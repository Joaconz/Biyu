import { isFlowEmpty, isUpcomingEmpty } from '@/domain/dashboardTrends'
import { currentPeriod, isSamePeriod, type Period } from '@/domain/period'
import type { DashboardTrendsState } from '@/hooks/useDashboardTrends'
import { todayInArgentina } from '@/lib/clock'
import { MonthlyFlowChart } from './MonthlyFlowChart'
import { MonthPaceChart } from './MonthPaceChart'
import { UpcomingInstallmentsChart } from './UpcomingInstallmentsChart'

/**
 * Las tarjetas de tendencia del Resumen (ADR-050): gastado vs ingresos, ritmo del mes y cuotas que
 * vienen. Son datos secundarios (ADR-031): si no cargan, no se dibujan y el resto del Resumen sigue.
 * Mientras cargan ocupan su lugar con un bloque del alto final, así nada salta cuando llegan.
 */
export function DashboardTrends({ state, period }: { state: DashboardTrendsState; period: Period }) {
  if (state.status === 'error') return null
  if (state.status === 'loading') {
    return (
      <div data-testid="dashboard-trends-loading" aria-busy="true" className="grid gap-3 lg:grid-cols-2">
        <div className="h-64 rounded-xl border border-hairline bg-card" />
        <div className="h-64 rounded-xl border border-hairline bg-card" />
      </div>
    )
  }
  const { flow, pace, upcoming } = state.trends
  const showPace = pace.hasCurrent || pace.hasPrevious
  const showUpcoming = !isUpcomingEmpty(upcoming)
  const showFlow = !isFlowEmpty(flow)
  if (!showFlow && !showPace && !showUpcoming) return null
  const ongoing = isSamePeriod(period, currentPeriod(todayInArgentina()))
  return (
    <div data-testid="dashboard-trends" className="grid grid-cols-[minmax(0,1fr)] gap-7 lg:grid-cols-[repeat(2,minmax(0,1fr))] lg:gap-5">
      {showFlow && <MonthlyFlowChart months={flow} />}
      {showPace && <MonthPaceChart pace={pace} period={period} ongoing={ongoing} />}
      {showUpcoming && (
        <div className="lg:col-span-2">
          <UpcomingInstallmentsChart months={upcoming} />
        </div>
      )}
    </div>
  )
}
