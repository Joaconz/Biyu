import { useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router'
import { CategoryEvolution } from '@/components/dashboard/CategoryEvolution'
import { GroupedCard, GroupedSection } from '@/components/shared/GroupedList'
import { PeriodSwitcher } from '@/components/shared/PeriodSwitcher'
import { TransactionItem } from '@/components/transactions/TransactionItem'
import { buttonVariants } from '@/components/ui/button'
import { formatArs, formatUsd } from '@/domain/money'
import { formatPeriod, formatPeriodLong, type Period } from '@/domain/period'
import { formatPercentage } from '@/domain/summary'
import { useCategoryDetail } from '@/hooks/useCategoryDetail'
import { usePeriodParam } from '@/hooks/usePeriodParam'
import { displayCategoryColor } from '@/lib/visuals'

/**
 * Detalle de una categoría (US-73, ADR-038): total del mes, los últimos 6 meses y sus gastos. Es de
 * solo lectura: borrar y editar se siguen haciendo desde Movimientos. La categoría va en la ruta y
 * el período en `?period=` (C11).
 */
export function CategoryDetailPage() {
  const { categoryId = '' } = useParams()
  const { period, setPeriod, shift } = usePeriodParam()
  const state = useCategoryDetail(categoryId, period)
  const refocus = useRefocusAfterReload(state.status)
  // Elegir el mes que ya se ve no recarga nada: no hay foco que devolver.
  const selectPeriod = (next: Period) => {
    if (formatPeriod(next) !== formatPeriod(period)) refocus(() => setPeriod(next))
  }
  const summaryHref = `/dashboard?period=${formatPeriod(period)}`
  const monthName = formatPeriodLong(period).split(' ')[0]

  if (state.status === 'not-found') {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col pt-3 lg:pt-0">
        <div
          data-testid="category-detail-not-found"
          className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-input/50 px-6 py-12 text-center"
        >
          <p className="text-callout text-muted-foreground">No encontramos esta categoría.</p>
          <Link to={summaryHref} data-testid="category-detail-not-found-back" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
            Volver al Resumen
          </Link>
        </div>
      </div>
    )
  }

  const back = (
    <Link
      to={summaryHref}
      data-testid="category-detail-back"
      className="press -ml-1 inline-flex min-h-11 items-center self-start rounded-md px-1 text-callout font-medium text-primary hover:underline"
    >
      {/* El "‹" es decorativo: el lector anuncia "Resumen" y no el nombre del signo. */}
      <span aria-hidden="true">‹</span>&nbsp;Resumen
    </Link>
  )

  if (state.status === 'loading') {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 pt-1 lg:pt-0">
        {back}
        <p role="status" data-testid="category-detail-loading" className="text-callout text-muted-foreground">
          Cargando…
        </p>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 pt-1 lg:pt-0">
        {back}
        <div className="flex flex-col items-start gap-3">
          <p role="alert" data-testid="category-detail-error" className="text-callout text-destructive">
            No se pudo cargar la categoría.
          </p>
          <button
            type="button"
            data-testid="category-detail-retry"
            onClick={state.retry}
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  const { category, totals, evolution, transactions } = state
  const color = displayCategoryColor(category.color, category.name)
  const periodLong = formatPeriodLong(period)

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col pt-1 lg:pt-0">
      {back}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-1 pb-6 lg:pb-8">
        <div className="flex min-w-0 items-center gap-2">
          <h1 data-testid="category-detail-title" className="min-w-0 truncate text-title-1 font-bold text-foreground">
            {category.name}
          </h1>
          {category.archived_at && (
            <span
              data-testid="category-detail-archived"
              className="shrink-0 rounded-md bg-secondary px-1.5 py-0.5 text-caption font-medium text-muted-foreground"
            >
              archivada
            </span>
          )}
        </div>
        <PeriodSwitcher
          screen="category-detail"
          period={period}
          onShift={(delta) => refocus(() => shift(delta))}
          onSelect={selectPeriod}
          className="-mr-2"
        />
      </div>

      {/* El filete izquierdo en el color de la categoría la identifica sin competir con la tarjeta verde del Resumen. */}
      <div
        data-testid="category-detail-total"
        className="flex flex-col gap-1 rounded-2xl border border-l-4 border-hairline bg-card p-5"
        style={{ borderLeftColor: color }}
      >
        <span className="text-footnote font-medium text-muted-foreground first-letter:uppercase">Gastado en {monthName}</span>
        <span data-testid="category-detail-total-amount" className="tabular text-title-1 font-bold whitespace-nowrap text-foreground">
          {formatArs(totals.amount)}
        </span>
        <span data-testid="category-detail-percentage" className="tabular text-footnote text-muted-foreground">
          {formatPercentage(totals.percentage)} del gasto de {monthName}
        </span>
        {totals.expensesUsd.gt(0) && (
          <span data-testid="category-detail-total-usd" className="tabular text-footnote text-muted-foreground">
            Incluye {formatUsd(totals.expensesUsd)} en dólares
          </span>
        )}
        <div className="mt-3 border-t border-hairline pt-3 text-footnote text-muted-foreground">
          Cuotas de meses anteriores{' '}
          <span data-testid="category-detail-inherited-amount" className="tabular font-semibold text-foreground">
            {formatArs(totals.inheritedInstallments)}
          </span>
        </div>
      </div>

      <CategoryEvolution bars={evolution} period={period} color={color} onSelect={selectPeriod} />

      <GroupedSection title={`Gastos de ${periodLong}`} className="mt-7">
        {transactions.length === 0 ? (
          <p data-testid="category-detail-transactions-empty" className="px-1 text-callout text-muted-foreground">
            No hay gastos de {category.name} en {periodLong}.
          </p>
        ) : (
          <GroupedCard data-testid="category-detail-transactions">
            {transactions.map((tx) => (
              // Sin onDeleteRequest ni onRestoreRequest: el detalle es de solo lectura (CA-22).
              <TransactionItem key={`${tx.id}-${tx.installment_number}`} transaction={tx} testId="category-detail-transaction-item" />
            ))}
          </GroupedCard>
        )}
      </GroupedSection>
    </div>
  )
}

/**
 * Cambiar de mes pasa por "Cargando…", que desmonta el selector y las barras (US-73), y el foco
 * caería al body. `refocus` recuerda el control que se usó y le devuelve el foco cuando el detalle
 * vuelve a estar listo: así "Mes anterior" se puede apretar varias veces con el teclado (WCAG 2.4.3).
 */
function useRefocusAfterReload(status: string) {
  const pending = useRef<string | null>(null)
  useEffect(() => {
    // Si la recarga termina en error o en "no encontrada", ese control ya no existe: se olvida.
    if (status === 'error' || status === 'not-found') pending.current = null
    if (status !== 'ready' || !pending.current) return
    const target = document.querySelector<HTMLElement>(`[data-testid="${pending.current}"]`)
    pending.current = null
    target?.focus()
  }, [status])
  return (change: () => void) => {
    const active = document.activeElement
    pending.current = active instanceof HTMLElement ? (active.dataset.testid ?? null) : null
    change()
  }
}
