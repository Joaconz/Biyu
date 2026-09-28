import { useState } from 'react'
import { Link } from 'react-router'
import { AccountExpenseBreakdown } from '@/components/dashboard/AccountExpenseBreakdown'
import { CategoryExpenseBars } from '@/components/dashboard/CategoryExpenseBars'
import { DeleteTransactionDialog } from '@/components/transactions/DeleteTransactionDialog'
import { TransactionItem } from '@/components/transactions/TransactionItem'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatArs, formatUsd } from '@/domain/money'
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
  // US-33: un mes sin imputaciones muestra el acceso al registro en vez de un dashboard de ceros.
  const isEmpty = summaryState.status === 'ready' && !summaryState.summary.hasData

  return (
    <>
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

        {isEmpty && (
          <Card data-testid="dashboard-empty" className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <p
                data-testid="dashboard-empty-message"
                className="text-sm text-muted-foreground mb-4"
              >
                No tenés movimientos registrados en este mes.
              </p>
              <Link
                to="/register"
                data-testid="dashboard-empty-register"
                className={buttonVariants({ variant: 'default' })}
              >
                Registrar un gasto
              </Link>
            </CardContent>
          </Card>
        )}

        {summaryState.status === 'ready' && !isEmpty && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Card data-testid="dashboard-total">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total gastado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    data-testid="dashboard-total-expenses"
                    className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
                  >
                    {formatArs(summaryState.summary.expenses)}
                  </div>
                  {summaryState.summary.expensesUsd.gt(0) && (
                    <p
                      data-testid="dashboard-total-usd"
                      className="mt-1 text-sm text-muted-foreground"
                    >
                      Subtotal en USD: {formatUsd(summaryState.summary.expensesUsd)}
                    </p>
                  )}
                  {/* US-16: parte del total que ya venía comprometida por cuotas de meses anteriores. */}
                  <p
                    data-testid="dashboard-inherited-installments"
                    className="mt-1 text-sm text-muted-foreground"
                  >
                    Cuotas de meses anteriores:{' '}
                    <span
                      data-testid="dashboard-inherited-installments-amount"
                      className="font-medium text-foreground tabular-nums"
                    >
                      {formatArs(summaryState.summary.inheritedInstallments)}
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card data-testid="dashboard-income">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total ingresos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    data-testid="dashboard-total-income"
                    className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400"
                  >
                    {formatArs(summaryState.summary.income)}
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="dashboard-balance">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Balance
                    </CardTitle>
                    <span
                      data-testid="dashboard-balance-badge"
                      className={`text-[11px] px-1.5 py-0.5 rounded font-medium ${
                        summaryState.summary.balance.isNegative() && !summaryState.summary.balance.isZero()
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          : summaryState.summary.balance.isPositive() && !summaryState.summary.balance.isZero()
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {summaryState.summary.balance.isNegative() && !summaryState.summary.balance.isZero()
                        ? 'Déficit'
                        : summaryState.summary.balance.isPositive() && !summaryState.summary.balance.isZero()
                          ? 'Superávit'
                          : 'En cero'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    data-testid="dashboard-total-balance"
                    className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                      summaryState.summary.balance.isNegative() && !summaryState.summary.balance.isZero()
                        ? 'text-rose-600 dark:text-rose-400'
                        : summaryState.summary.balance.isPositive() && !summaryState.summary.balance.isZero()
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-foreground'
                    }`}
                  >
                    {formatArs(summaryState.summary.balance)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <CategoryExpenseBars categories={summaryState.summary.categoryExpenses} />

            <AccountExpenseBreakdown accounts={summaryState.summary.accountExpenses} />
          </>
        )}

        {!isEmpty && (
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
        )}

        {summaryState.status === 'ready' && !isEmpty && (
          <Card data-testid="dashboard-days-with-transactions">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Días con registro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                data-testid="dashboard-days-count"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
              >
                {summaryState.daysWithTransactions}
              </div>
            </CardContent>
          </Card>
        )}

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
    </>
  )
}

