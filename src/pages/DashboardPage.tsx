import { Link } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatArs } from '@/domain/money'
import { formatPeriod } from '@/domain/period'
import { useMonthlySummary } from '@/hooks/useMonthlySummary'
import { usePeriodParam } from '@/hooks/usePeriodParam'

export function DashboardPage() {
  const { period, shift } = usePeriodParam()
  const summaryState = useMonthlySummary(period)

  return (
    <AppShell
      actions={
        <Link to="/register" data-testid="dashboard-nav-register" className="text-sm underline">
          Registrar
        </Link>
      }
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => shift(-1)}
              data-testid="dashboard-period-prev"
            >
              ←
            </Button>
            <span data-testid="dashboard-period" className="min-w-[5.5rem] text-center font-medium">
              {formatPeriod(period)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => shift(1)}
              data-testid="dashboard-period-next"
            >
              →
            </Button>
          </div>
        </div>

        {summaryState.status === 'loading' && (
          <p data-testid="dashboard-loading" className="text-muted-foreground">
            Cargando…
          </p>
        )}

        {summaryState.status === 'error' && (
          <p role="alert" data-testid="dashboard-error" className="text-sm text-destructive">
            No se pudo cargar el resumen: {summaryState.message}
          </p>
        )}

        {summaryState.status === 'ready' && (
          <div className="space-y-4">
            <Card data-testid="dashboard-total">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total gastado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  data-testid="dashboard-total-expenses"
                  className="text-3xl font-bold tracking-tight"
                >
                  {formatArs(summaryState.summary.expenses)}
                </div>
              </CardContent>
            </Card>

            <Card data-testid="dashboard-days-with-transactions">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Días con registro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  data-testid="dashboard-days-count"
                  className="text-3xl font-bold tracking-tight"
                >
                  {summaryState.daysWithTransactions}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  )
}
