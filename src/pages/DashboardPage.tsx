import type { ReactNode } from 'react'
import { CalendarCheck, CirclePlus, FileSpreadsheet, Plus, ReceiptText, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router'
import { AccountExpenseBreakdown } from '@/components/dashboard/AccountExpenseBreakdown'
import { BalanceCard } from '@/components/dashboard/BalanceCard'
import { CategoryExpenseBars } from '@/components/dashboard/CategoryExpenseBars'
import { DashboardTrends } from '@/components/dashboard/DashboardTrends'
import { PageHeader } from '@/components/layout/PageHeader'
import { Amount } from '@/components/shared/Amount'
import { GroupedCard, GroupedSection } from '@/components/shared/GroupedList'
import { PeriodSwitcher } from '@/components/shared/PeriodSwitcher'
import { TransactionItem } from '@/components/transactions/TransactionItem'
import { PendingSubscriptionsCard } from '@/components/dashboard/PendingSubscriptionsCard'
import { DashboardSkeleton, ListSkeleton } from '@/components/skeletons/Skeleton'
import { buttonVariants } from '@/components/ui/button'
import { formatArs, formatUsd } from '@/domain/money'
import { daysElapsedInPeriod, formatPeriod, formatPeriodLong } from '@/domain/period'
import { useBalanceOptionsSaver } from '@/hooks/useBalanceOptionsSaver'
import { useDashboardTrends } from '@/hooks/useDashboardTrends'
import { useMonthlySummary } from '@/hooks/useMonthlySummary'
import { useMonthlyTransactions } from '@/hooks/useMonthlyTransactions'
import { usePendingSubscriptionCharges } from '@/hooks/usePendingSubscriptionCharges'
import { usePeriodParam } from '@/hooks/usePeriodParam'
import { today } from '@/lib/clock'
import { cn } from '@/lib/utils'
import { fitAmountFontSize } from '@/lib/visuals'

export function DashboardPage() {
  const { period, setPeriod, shift } = usePeriodParam()
  // ADR-051: la tarjeta de Balance cambia qué entra en el balance; el resumen se recalcula con eso al instante.
  const balanceSaver = useBalanceOptionsSaver()
  const summaryState = useMonthlySummary(period, balanceSaver.edited)
  const transactionsState = useMonthlyTransactions(period, 10)
  const trendsState = useDashboardTrends(period)
  const pendingCharges = usePendingSubscriptionCharges(period)
  // US-33: un mes sin imputaciones muestra el acceso al registro en vez de un dashboard de ceros.
  // ADR-051: un mes con deudas sueltas que el usuario dejó afuera tampoco es vacío: la tarjeta de Balance las
  // muestra «fuera del balance» y sacarlas no hace desaparecer la tarjeta que se está tocando.
  const isEmpty =
    summaryState.status === 'ready' && !summaryState.summary.hasData && !summaryState.summary.looseDebtActivity
  const monthName = formatPeriodLong(period).split(' ')[0]

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col">
      <PageHeader title="Resumen" testId="dashboard-title" className="flex-wrap items-center">
        <PeriodSwitcher screen="dashboard" period={period} onShift={shift} onSelect={setPeriod} className="-mr-2" />
      </PageHeader>

      {/*
        ADR-045: lo que las suscripciones todavía van a cobrar. Con el Resumen cargado es una línea de la
        tarjeta de Balance (ADR-051); la tarjeta suelta queda para el mes vacío o si el resumen no cargó.
      */}
      {(isEmpty || summaryState.status === 'error') && <PendingSubscriptionsCard pending={pendingCharges} period={period} />}

      {summaryState.status === 'loading' && <DashboardSkeleton />}

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
        const { summary, daysWithTransactions, balanceOptions } = summaryState
        const elapsed = daysElapsedInPeriod(period, today())
        const expensesText = formatArs(summary.expenses)
        const periodParam = formatPeriod(period)
        return (
          <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-start lg:gap-5">
            {/*
              ADR-052: la protagonista. Un solo número (lo gastado, US-25) sobre la única superficie con brillo,
              esmeralda en los dos temas, y los accesos de todos los días debajo.
            */}
            <section
              data-testid="dashboard-total"
              aria-labelledby="dashboard-total-label"
              className="hero @container flex flex-col items-center gap-7 rounded-3xl px-6 pt-8 pb-6 text-center ring-1 ring-hero-foreground/8 ring-inset lg:row-span-2 lg:px-10 lg:pt-12 lg:pb-8"
            >
              <div className="flex w-full flex-col items-center gap-2">
                <span id="dashboard-total-label" className="text-footnote font-medium text-hero-muted first-letter:uppercase">
                  Gastado en {monthName}
                </span>
                <Amount
                  data-testid="dashboard-total-expenses"
                  text={expensesText}
                  className="block max-w-full font-bold whitespace-nowrap text-amount [--amount-max:var(--text-amount)] lg:[--amount-max:4.5rem]"
                  // DEF-021: achica según el largo del total para que entre en una línea a cualquier ancho.
                  style={{ fontSize: fitAmountFontSize(expensesText) }}
                />
                {summary.expensesUsd.gt(0) && (
                  <span
                    data-testid="dashboard-total-usd"
                    className="tabular mt-1 rounded-full bg-hero-foreground/8 px-3 py-1 text-footnote text-hero-muted"
                  >
                    Incluye {formatUsd(summary.expensesUsd)} en dólares
                  </span>
                )}
              </div>
              <nav aria-label="Accesos rápidos" className="grid w-full max-w-xs grid-cols-3 gap-2">
                <QuickAction to="/register" testId="dashboard-action-register" icon={Plus} label="Registrar" primary />
                <QuickAction to={`/transactions?period=${periodParam}`} testId="dashboard-action-transactions" icon={ReceiptText} label="Movimientos" />
                <QuickAction to="/import" testId="dashboard-action-import" icon={FileSpreadsheet} label="Importar" />
              </nav>
            </section>

            {/* US-29, US-101, ADR-051/052: el balance como un número; su desglose y qué entra se abren desde la fórmula. */}
            <BalanceCard
              summary={summary}
              options={balanceOptions}
              pending={pendingCharges}
              period={period}
              monthName={monthName}
              onOptionsChange={(next) => balanceSaver.save(next, balanceOptions)}
            />

            {/* Lo que antes se apilaba en la protagonista, en datos chicos: un rótulo y un número cada uno. */}
            <div className="grid grid-cols-2 gap-4">
              {/* US-16: parte del total que ya venía comprometida por cuotas de meses anteriores. */}
              <StatTile testId="dashboard-inherited-installments" label="Cuotas de meses anteriores">
                <Amount data-testid="dashboard-inherited-installments-amount" text={formatArs(summary.inheritedInstallments)} />
              </StatTile>
              {/* US-32: hábito de carga, por occurred_on. */}
              <StatTile testId="dashboard-days-with-transactions" label="Días con registro" icon={CalendarCheck}>
                <span>
                  <span data-testid="dashboard-days-count" className="tabular">{daysWithTransactions}</span>
                  {elapsed > 0 && <span className="text-callout font-medium text-muted-foreground"> de {elapsed}</span>}
                </span>
              </StatTile>
              {/*
                US-30: el neto es un dato secundario; el número grande sigue siendo el bruto (ADR-006). Solo
                aparece si alguna deuda cuenta para el período (ADR-037 §6).
              */}
              {summary.hasReimbursements && (
                <StatTile testId="dashboard-net-reimbursements" label="Neto de reembolsos" className="col-span-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <Amount data-testid="dashboard-net-reimbursements-amount" text={formatArs(summary.netOfReimbursements)} />
                    <Link
                      to="/debts"
                      data-testid="dashboard-net-reimbursements-link"
                      className="press -my-2 inline-flex min-h-11 items-center text-callout font-medium text-primary hover:underline"
                    >
                      Ver deudas
                    </Link>
                  </div>
                  {summary.netOfReimbursements.isNegative() && (
                    <p data-testid="dashboard-net-reimbursements-note" className="text-footnote font-normal text-muted-foreground">
                      Las deudas se descuentan enteras en el mes de la compra, aunque sea en cuotas.
                    </p>
                  )}
                </StatTile>
              )}
            </div>

            {/* ADR-050: las tendencias (6 meses, ritmo del mes, cuotas que vienen) son secundarias y no frenan el resto. */}
            <div className="mt-8 flex flex-col gap-10 lg:col-span-2 lg:mt-6">
              <DashboardTrends state={trendsState} period={period} />
              <div className="grid grid-cols-[minmax(0,1fr)] gap-x-5 gap-y-10 lg:grid-cols-[repeat(2,minmax(0,1fr))]">
                <CategoryExpenseBars categories={summary.categoryExpenses} totalExpenses={summary.expenses} period={period} />
                <AccountExpenseBreakdown accounts={summary.accountExpenses} />
              </div>
            </div>
          </div>
        )
      })()}

      {!isEmpty && (
        <GroupedSection
          title="Últimos movimientos"
          data-testid="dashboard-recent-transactions"
          className="mt-10"
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
            <ListSkeleton testId="dashboard-transactions-loading" label="Cargando movimientos…" rows={3} />
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
                  editHref={`/transactions/${tx.id}/edit?period=${formatPeriod(period)}`}
                />
              ))}
            </GroupedCard>
          )}
        </GroupedSection>
      )}

    </div>
  )
}

/** Acceso redondo de la protagonista (ADR-052): ícono en un círculo y el nombre debajo. */
function QuickAction({ to, testId, icon: Icon, label, primary = false }: { to: string; testId: string; icon: LucideIcon; label: string; primary?: boolean }) {
  return (
    <Link to={to} data-testid={testId} className="press group flex flex-col items-center gap-2 rounded-2xl py-1 text-footnote font-medium text-hero-foreground">
      <span
        className={cn(
          'grid size-14 place-items-center rounded-full transition-colors duration-(--dur-fade)',
          primary ? 'bg-hero-accent text-hero group-hover:bg-hero-foreground' : 'bg-hero-foreground/10 group-hover:bg-hero-foreground/16',
        )}
      >
        <Icon aria-hidden="true" className="size-[1.375rem]" strokeWidth={primary ? 2.2 : 1.8} />
      </span>
      {label}
    </Link>
  )
}

/** Dato chico (ADR-052): rótulo apagado arriba y un número debajo. */
function StatTile({ testId, label, icon: Icon, className, children }: { testId: string; label: string; icon?: LucideIcon; className?: string; children: ReactNode }) {
  return (
    <div data-testid={testId} className={cn('flex flex-col gap-2 rounded-xl bg-card p-4', className)}>
      <span className="flex items-center gap-1.5 text-footnote text-muted-foreground">
        {Icon && <Icon aria-hidden="true" className="size-4" strokeWidth={1.8} />}
        {label}
      </span>
      <div className="tabular text-headline font-semibold text-foreground">{children}</div>
    </div>
  )
}
