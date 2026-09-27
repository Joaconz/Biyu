import { Link } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
import { TransactionItem } from '@/components/transactions/TransactionItem'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatPeriod, parsePeriod } from '@/domain/period'
import { useMonthlyTransactions } from '@/hooks/useMonthlyTransactions'
import { usePeriodParam } from '@/hooks/usePeriodParam'

export function TransactionsPage() {
  const { period, setPeriod, shift } = usePeriodParam()
  const transactionsState = useMonthlyTransactions(period)

  return (
    <AppShell
      actions={
        <div className="flex items-center gap-3">
          <Link
            to={`/dashboard?period=${formatPeriod(period)}`}
            data-testid="transactions-nav-dashboard"
            className="text-sm underline"
          >
            Dashboard
          </Link>
          <Link
            to="/register"
            data-testid="transactions-nav-register"
            className="text-sm underline"
          >
            Registrar
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Transacciones</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => shift(-1)}
              data-testid="transactions-period-prev"
              aria-label="Mes anterior"
            >
              ←
            </Button>
            <label
              htmlFor="transactions-period-select"
              className="relative flex items-center justify-center cursor-pointer rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted/50 transition-colors"
            >
              <span data-testid="transactions-period">{formatPeriod(period)}</span>
              <input
                id="transactions-period-select"
                type="month"
                value={formatPeriod(period)}
                onChange={(e) => {
                  const next = parsePeriod(e.target.value)
                  if (next) setPeriod(next)
                }}
                data-testid="transactions-period-select"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                aria-label="Seleccionar mes"
              />
            </label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => shift(1)}
              data-testid="transactions-period-next"
              aria-label="Mes siguiente"
            >
              →
            </Button>
          </div>
        </div>

        {transactionsState.status === 'loading' && (
          <p data-testid="transactions-loading" className="text-muted-foreground">
            Cargando…
          </p>
        )}

        {transactionsState.status === 'error' && (
          <p role="alert" data-testid="transactions-error" className="text-sm text-destructive">
            No se pudieron cargar las transacciones: {transactionsState.message}
          </p>
        )}

        {transactionsState.status === 'ready' && transactionsState.transactions.length === 0 && (
          <div
            data-testid="transactions-empty"
            className="rounded-xl border border-dashed border-border p-8 text-center"
          >
            <p className="text-muted-foreground text-sm">
              No hay transacciones en este período.
            </p>
          </div>
        )}

        {transactionsState.status === 'ready' && transactionsState.transactions.length > 0 && (
          <Card data-testid="transactions-card">
            <CardContent className="pt-4">
              <div data-testid="transactions-list" className="flex flex-col">
                {transactionsState.transactions.map((tx) => (
                  <TransactionItem
                    key={tx.id}
                    transaction={tx}
                    testId="transactions-item"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  )
}
