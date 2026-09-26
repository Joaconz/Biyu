import { Link } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
import { LogoutButton } from '@/components/LogoutButton'
import { Button } from '@/components/ui/button'
import { formatPeriod } from '@/domain/period'
import { usePeriodParam } from '@/hooks/usePeriodParam'

// Esqueleto: el selector de mes real es US-26; esto prueba que el período vive en la URL (C11).
export function DashboardPage() {
  const { period, shift } = usePeriodParam()
  return (
    <AppShell
      actions={
        <div className="flex items-center gap-3">
          <Link to="/settings" data-testid="dashboard-nav-settings" className="text-sm underline">
            Configuración
          </Link>
          <Link to="/register" data-testid="dashboard-nav-register" className="text-sm underline">
            Registrar
          </Link>
          <LogoutButton testId="dashboard-nav-logout" />
        </div>
      }
    >
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => shift(-1)} data-testid="dashboard-period-prev">←</Button>
        <span data-testid="dashboard-period">{formatPeriod(period)}</span>
        <Button variant="outline" onClick={() => shift(1)} data-testid="dashboard-period-next">→</Button>
      </div>
    </AppShell>
  )
}
