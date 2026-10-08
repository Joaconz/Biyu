import { useState } from 'react'
import { CalendarCheck, CirclePlus } from 'lucide-react'
import { Link } from 'react-router'
import { AccountExpenseBreakdown } from '@/components/dashboard/AccountExpenseBreakdown'
import { CategoryExpenseBars } from '@/components/dashboard/CategoryExpenseBars'
import { PageHeader } from '@/components/layout/PageHeader'
import { GroupedCard, GroupedSection } from '@/components/shared/GroupedList'
import { PeriodSwitcher } from '@/components/shared/PeriodSwitcher'
import { DeleteTransactionDialog } from '@/components/transactions/DeleteTransactionDialog'
import { TransactionItem } from '@/components/transactions/TransactionItem'
import { buttonVariants } from '@/components/ui/button'
import { formatArs, formatUsd, type Decimal } from '@/domain/money'
import { daysElapsedInPeriod, formatPeriod, formatPeriodLong } from '@/domain/period'
import { useMonthlySummary } from '@/hooks/useMonthlySummary'
import { useMonthlyTransactions } from '@/hooks/useMonthlyTransactions'
import { usePeriodParam } from '@/hooks/usePeriodParam'
import { today } from '@/lib/clock'
import type { DashboardTransaction } from '@/lib/dashboard'
import { cn } from '@/lib/utils'
import { fitAmountFontSize, SIDE_BY_SIDE_AMOUNT_MAX_LENGTH } from '@/lib/visuals'

type BalanceTone = 'surplus' | 'deficit' | 'zero'

function balanceTone(balance: Decimal): BalanceTone {
  if (balance.isZero()) return 'zero'
  return balance.isNegative() ? 'deficit' : 'surplus'
}

const BALANCE_BADGE: Record<BalanceTone, { label: string; className: string }> = {
  surplus: { label: 'Superávit', className: 'bg-[color-mix(in_srgb,var(--income)_12%,var(--card))] text-income' },
  deficit: { label: 'Déficit', className: 'bg-[color-mix(in_srgb,var(--deficit)_10%,var(--card))] text-deficit' },
  zero: { label: 'En cero', className: 'bg-secondary text-muted-foreground' },
}

// Ingresos y Balance: el alto de línea de title-2 (celular) y title-1 (desde sm), y su tamaño
// como tope de fitAmountFontSize (DEF-021).
const AMOUNT_CARD_TEXT =
  'text-title-2 sm:text-title-1 [--amount-max:var(--text-title-2)] sm:[--amount-max:var(--text-title-1)]'

const BALANCE_TEXT: Record<BalanceTone, string> = {
  surplus: 'text-income',
  deficit: 'text-deficit',
  zero: 'text-foreground',
}

export function DashboardPage() {
  const { period, setPeriod, shift } = usePeriodParam()
  const summaryState = useMonthlySummary(period)
  const transactionsState = useMonthlyTransactions(period, 10)
  const [txToDelete, setTxToDelete] = useState<DashboardTransaction | null>(null)
  // US-33: un mes sin imputaciones muestra el acceso al registro en vez de un dashboard de ceros.
  const isEmpty = summaryState.status === 'ready' && !summaryState.summary.hasData
  const monthName = formatPeriodLong(period).split(' ')[0]

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col">
      <PageHeader title="Resumen" testId="dashboard-title" className="flex-wrap items-center">
        <PeriodSwitcher screen="dashboard" period={period} onShift={shift} onSelect={setPeriod} className="-mr-2" />
      </PageHeader>

      {summaryState.status === 'loading' && (
        <p data-testid="dashboard-loading" className="text-callout text-muted-foreground">
          Cargando…
        </p>
      )}

      {summaryState.status === 'error' && (
        <p role="alert" data-testid="dashboard-error" className="text-callout text-destructive">
          No se pudo cargar el resumen: {summaryState.message}
        </p>
      )}

      {isEmpty && (
        <div
          data-testid="dashboard-empty"
          className="flex flex-col items-center rounded-2xl border border-dashed border-input/50 px-6 py-14 text-center"
        >
          <p data-testid="dashboard-empty-message" className="mb-5 max-w-64 text-callout text-muted-foreground">
            No tenés movimientos registrados en {monthName}.
          </p>
          <Link to="/register" data-testid="dashboard-empty-register" className={buttonVariants({ variant: 'default' })}>
            <CirclePlus aria-hidden="true" strokeWidth={1.8} />
            Registrar un gasto
          </Link>
          {/* US-69 · CA-8: Movimientos ya no está en la barra; sin esto un mes vacío no llega a Eliminados (FR-08). */}
          <Link
            to={`/transactions?period=${formatPeriod(period)}`}
            data-testid="dashboard-empty-view-transactions"
            className="press mt-3 inline-flex min-h-11 items-center rounded-md px-2 text-callout font-medium text-primary hover:underline"
          >
            Ver movimientos
          </Link>
        </div>
      )}

      {summaryState.status === 'ready' && !isEmpty && (() => {
        const { summary, daysWithTransactions } = summaryState
        const tone = balanceTone(summary.balance)
        const elapsed = daysElapsedInPeriod(period, today())
        const expensesText = formatArs(summary.expenses)
        const incomeText = formatArs(summary.income)
        const balanceText = formatArs(summary.balance)
        const stackIncomeAndBalance = Math.max(incomeText.length, balanceText.length) > SIDE_BY_SIDE_AMOUNT_MAX_LENGTH
        return (
          <div className="grid grid-cols-[minmax(0,1fr)] gap-3 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
            {/* Lo primero que se lee es cuánto se gastó (US-25): superficie sólida, la única de la pantalla. */}
            <div
              data-testid="dashboard-total"
              className="@container flex flex-col justify-between gap-6 rounded-2xl bg-primary p-5 text-primary-foreground sm:p-6"
            >
              <div className="flex flex-col gap-1.5">
                <span className="text-footnote font-medium text-primary-foreground/75 first-letter:uppercase">
                  Gastado en {monthName}
                </span>
                <span
                  data-testid="dashboard-total-expenses"
                  className="tabular text-display font-bold whitespace-nowrap [--amount-max:var(--text-display)]"
                  // DEF-021: achica según el largo del total para que entre en una línea a cualquier ancho.
                  style={{ fontSize: fitAmountFontSize(expensesText) }}
                >
                  {expensesText}
                </span>
                {summary.expensesUsd.gt(0) && (
                  <span data-testid="dashboard-total-usd" className="tabular text-footnote text-primary-foreground/75">
                    Incluye {formatUsd(summary.expensesUsd)} en dólares
                  </span>
                )}
              </div>
              {/*
                US-30: el neto es un dato secundario; el número grande sigue siendo el bruto (ADR-006). Solo
                aparece si alguna deuda cuenta para el período (ADR-037 §6).
              */}
              {summary.hasReimbursements && (
                <div data-testid="dashboard-net-reimbursements" className="flex flex-col items-start gap-1 text-footnote">
                  <div className="flex w-full flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                    <span className="text-primary-foreground/75">Neto de reembolsos</span>
                    <span data-testid="dashboard-net-reimbursements-amount" className="tabular text-callout font-semibold">
                      {formatArs(summary.netOfReimbursements)}
                    </span>
                  </div>
                  {summary.netOfReimbursements.isNegative() && (
                    <p data-testid="dashboard-net-reimbursements-note" className="text-caption text-primary-foreground/75">
                      Las deudas se descuentan enteras en el mes de la compra, aunque sea en cuotas.
                    </p>
                  )}
                  <Link
                    to="/debts"
                    data-testid="dashboard-net-reimbursements-link"
                    className="press -my-1.5 inline-flex min-h-9 items-center font-medium underline underline-offset-4"
                  >
                    Ver deudas
                  </Link>
                </div>
              )}
              <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-t border-primary-foreground/15 pt-4 text-footnote">
                {/* US-16: parte del total que ya venía comprometida por cuotas de meses anteriores. */}
                <span data-testid="dashboard-inherited-installments" className="text-primary-foreground/75">
                  Cuotas de meses anteriores{' '}
                  <span data-testid="dashboard-inherited-installments-amount" className="tabular font-semibold text-primary-foreground">
                    {formatArs(summary.inheritedInstallments)}
                  </span>
                </span>
                {/* US-32: hábito de carga, por occurred_on. */}
                <span data-testid="dashboard-days-with-transactions" className="inline-flex items-center gap-1.5 text-primary-foreground/75">
                  <CalendarCheck aria-hidden="true" className="size-4" strokeWidth={1.8} />
                  <span>
                    <span data-testid="dashboard-days-count" className="tabular font-semibold text-primary-foreground">
                      {daysWithTransactions}
                    </span>
                    {elapsed > 0 ? ` de ${elapsed} días con registro` : ' días con registro'}
                  </span>
                </span>
              </div>
            </div>

            <div
              className={cn(
                'grid gap-3 lg:grid-cols-[minmax(0,1fr)]',
                stackIncomeAndBalance ? 'grid-cols-[minmax(0,1fr)]' : 'grid-cols-[repeat(2,minmax(0,1fr))]',
              )}
            >
              <div data-testid="dashboard-income" className="@container flex flex-col gap-1.5 rounded-2xl border border-hairline bg-card p-4 sm:p-5">
                <span className="text-footnote font-medium text-muted-foreground">Ingresos</span>
                <span
                  data-testid="dashboard-total-income"
                  className={cn('tabular font-bold whitespace-nowrap text-income', AMOUNT_CARD_TEXT)}
                  style={{ fontSize: fitAmountFontSize(incomeText) }}
                >
                  {incomeText}
                </span>
              </div>
              <div data-testid="dashboard-balance" className="@container flex flex-col gap-1.5 rounded-2xl border border-hairline bg-card p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-footnote font-medium text-muted-foreground">Balance</span>
                  <span
                    data-testid="dashboard-balance-badge"
                    className={cn('rounded-md px-1.5 py-0.5 text-caption font-semibold', BALANCE_BADGE[tone].className)}
                  >
                    {BALANCE_BADGE[tone].label}
                  </span>
                </div>
                <span
                  data-testid="dashboard-total-balance"
                  className={cn('tabular font-bold whitespace-nowrap', AMOUNT_CARD_TEXT, BALANCE_TEXT[tone])}
                  style={{ fontSize: fitAmountFontSize(balanceText) }}
                >
                  {balanceText}
                </span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-7 lg:col-span-2 lg:grid-cols-[repeat(2,minmax(0,1fr))] lg:gap-5">
              <CategoryExpenseBars categories={summary.categoryExpenses} />
              <AccountExpenseBreakdown accounts={summary.accountExpenses} />
            </div>
          </div>
        )
      })()}

      {!isEmpty && (
        <GroupedSection
          title="Últimos movimientos"
          data-testid="dashboard-recent-transactions"
          className="mt-7"
          action={
            <Link
              to={`/transactions?period=${formatPeriod(period)}`}
              data-testid="dashboard-transactions-view-all"
              className="press -my-2 -mr-1 rounded-md px-1 py-2 text-callout font-medium text-primary hover:underline"
            >
              Ver todos
            </Link>
          }
        >
          {transactionsState.status === 'loading' && (
            <p data-testid="dashboard-transactions-loading" className="px-1 text-callout text-muted-foreground">
              Cargando movimientos…
            </p>
          )}

          {transactionsState.status === 'error' && (
            <p role="alert" data-testid="dashboard-transactions-error" className="px-1 text-callout text-destructive">
              No se pudieron cargar los movimientos: {transactionsState.message}
            </p>
          )}

          {transactionsState.status === 'ready' && transactionsState.transactions.length === 0 && (
            <p data-testid="dashboard-transactions-empty" className="px-1 text-callout text-muted-foreground">
              No hay movimientos en este mes.
            </p>
          )}

          {transactionsState.status === 'ready' && transactionsState.transactions.length > 0 && (
            <GroupedCard data-testid="dashboard-transactions-list">
              {transactionsState.transactions.map((tx) => (
                <TransactionItem
                  key={`${tx.id}-${tx.installment_number}`}
                  transaction={tx}
                  testId="dashboard-transaction-item"
                  onDeleteRequest={setTxToDelete}
                />
              ))}
            </GroupedCard>
          )}
        </GroupedSection>
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
  )
}
