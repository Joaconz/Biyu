import { useState } from 'react'
import { Link } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
import { DeleteTransactionDialog } from '@/components/transactions/DeleteTransactionDialog'
import { TransactionItem } from '@/components/transactions/TransactionItem'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatArs } from '@/domain/money'
import { formatPeriod, parsePeriod } from '@/domain/period'
import { useMonthlySummary } from '@/hooks/useMonthlySummary'
import { useMonthlyTransactions } from '@/hooks/useMonthlyTransactions'
import { usePeriodParam } from '@/hooks/usePeriodParam'
import type { DashboardTransaction } from '@/lib/dashboard'

export function DashboardPage() {
  const { period, setPeriod, shift } = usePeriodParam()
  const summaryState = useMonthlySummary(period)
  const transactionsState = useMonthlyTransactions(period, 10)
  const [txToDelete, setTxToDelete] = useState<DashboardTransaction | null>(null)

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
              aria-label="Mes anterior"
            >
              ←
            </Button>
            <label
              htmlFor="dashboard-period-select"
              className="relative flex items-center justify-center cursor-pointer rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted/50 transition-colors"
            >
              <span data-testid="dashboard-period">{formatPeriod(period)}</span>
              <input
                id="dashboard-period-select"
                type="month"
                value={formatPeriod(period)}
                onChange={(e) => {
                  const next = parsePeriod(e.target.value)
                  if (next) setPeriod(next)
                }}
                data-testid="dashboard-period-select"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                aria-label="Seleccionar mes"
              />
            </label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => shift(1)}
              data-testid="dashboard-period-next"
              aria-label="Mes siguiente"
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
        )}

        <Card data-testid="dashboard-recent-transactions">
          <CardHeader>
            <CardTitle>Últimas transacciones</CardTitle>
            <CardAction>
              <Link
                to={`/transactions?period=${formatPeriod(period)}`}
                data-testid="dashboard-transactions-view-all"
                className="text-xs font-medium text-primary hover:underline"
              >
                Ver todas
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            {transactionsState.status === 'loading' && (
              <p data-testid="dashboard-transactions-loading" className="text-sm text-muted-foreground py-2">
                Cargando transacciones…
              </p>
            )}

            {transactionsState.status === 'error' && (
              <p role="alert" data-testid="dashboard-transactions-error" className="text-sm text-destructive py-2">
                No se pudieron cargar las transacciones: {transactionsState.message}
              </p>
            )}

            {transactionsState.status === 'ready' && transactionsState.transactions.length === 0 && (
              <p data-testid="dashboard-transactions-empty" className="text-sm text-muted-foreground py-4 text-center">
                No hay transacciones en este período.
              </p>
            )}

            {transactionsState.status === 'ready' && transactionsState.transactions.length > 0 && (
              <div data-testid="dashboard-transactions-list" className="flex flex-col">
                {transactionsState.transactions.map((tx) => (
                  <TransactionItem
                    key={tx.id}
                    transaction={tx}
                    testId="dashboard-transaction-item"
                    onDeleteRequest={setTxToDelete}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <DeleteTransactionDialog
          transaction={txToDelete}
          isOpen={txToDelete !== null}
          onClose={() => setTxToDelete(null)}
          onDeleted={() => {
            transactionsState.refresh()
            summaryState.refresh()
          }}
        />
      </div>
    </AppShell>
  )
}

