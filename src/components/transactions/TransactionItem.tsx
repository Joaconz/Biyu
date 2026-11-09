import { ArrowDownLeft, Repeat, RotateCcw, Trash2 } from 'lucide-react'
import { Link } from 'react-router'
import { CategoryIcon } from '@/components/shared/CategoryIcon'
import { formatInstallmentLabel } from '@/domain/installments'
import { formatArs, formatUsd, parseMoney } from '@/domain/money'
import { formatDayShort } from '@/domain/period'
import { sharedExpenseLabel } from '@/domain/sharedDebt'
import type { DashboardTransaction } from '@/lib/dashboard'
import { cn } from '@/lib/utils'

interface TransactionItemProps {
  transaction: DashboardTransaction
  testId?: string
  /** ADR-052: la fila entera lleva acá (Editar, US-84). Lleva el testid `<testId>-edit`. */
  editHref?: string
  /** Filtro "Eliminados" (DEF-007): en vez de eliminar, se restaura. */
  onRestoreRequest?: (transaction: DashboardTransaction) => void
  /** US-85: en «Eliminados», borrarlo para siempre. No se pasa para el generado por una suscripción (ADR-044 §2). */
  onPurgeRequest?: (transaction: DashboardTransaction) => void
  /** En la lista agrupada por día la fecha ya está en el encabezado. */
  showDate?: boolean
}

/**
 * Fila de movimiento (ADR-052): ícono de la categoría en círculo, título y fecha/cuenta a la izquierda, el
 * monto a la derecha (la cuota que impacta en el mes, US-17). Sin botones: tocar la fila abre Editar, y
 * Eliminar vive ahí. En «Eliminados» la fila no se edita y conserva Restaurar y Eliminar definitivamente.
 */
export function TransactionItem({ transaction, testId, onRestoreRequest, onPurgeRequest, editHref, showDate = true }: TransactionItemProps) {
  const isIncome = transaction.type === 'income'
  const amountArs = formatArs(parseMoney(transaction.entry_amount_ars))
  const installmentLabel = formatInstallmentLabel(transaction.installment_number, transaction.installments_count)
  const categoryName = transaction.category?.name
  const title = transaction.description || categoryName || (isIncome ? 'Ingreso' : 'Gasto')
  const meta = [showDate ? formatDayShort(transaction.occurred_on) : null, transaction.account?.name].filter(Boolean).join(' · ')
  const baseTestId = testId ?? 'transaction-item'

  const body = (
    <>
      {isIncome ? (
        <span
          aria-hidden="true"
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--income)_14%,var(--card))] text-income dark:bg-[color-mix(in_srgb,var(--income)_22%,var(--card))]"
        >
          <ArrowDownLeft className="size-5" strokeWidth={1.8} />
        </span>
      ) : (
        <CategoryIcon name={categoryName ?? 'Otros'} color={transaction.category?.color} />
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {/* Las etiquetas bajan de renglón antes que recortar el título a una letra (US-35 suma una larga). */}
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <span className="max-w-full truncate text-callout font-semibold text-foreground">{title}</span>
          {/* DEF-006 (02-behavior-spec, sad path "categoría archivada"): la misma marca que el Resumen. */}
          {transaction.category?.archived_at && (
            <span
              data-testid={`${baseTestId}-archived`}
              aria-label={`Categoría ${categoryName} archivada`}
              className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-caption font-medium text-muted-foreground"
            >
              archivada
            </span>
          )}
          {/* DEF-007: en el filtro "Eliminados" la fila lo dice, además de estar en otra vista. */}
          {transaction.deleted_at && (
            <span
              data-testid={`${baseTestId}-deleted`}
              className="shrink-0 rounded-full bg-destructive/12 px-2 py-0.5 text-caption font-medium text-destructive"
            >
              eliminada
            </span>
          )}
          {installmentLabel !== null && (
            <span
              data-testid={`${baseTestId}-installment`}
              aria-label={`Cuota ${transaction.installment_number} de ${transaction.installments_count}`}
              className="tabular shrink-0 rounded-full bg-secondary px-2 py-0.5 text-caption font-medium text-muted-foreground"
            >
              {installmentLabel}
            </span>
          )}
          {/* US-35: el gasto compartido lo dice en cada cuota. Va última y sin recortar: en el celular baja de renglón. */}
          {transaction.shared_debts.length > 0 && (
            <span
              data-testid={`${baseTestId}-shared`}
              className="max-w-full rounded-full break-words bg-secondary px-2 py-0.5 text-caption font-medium text-muted-foreground"
            >
              {sharedExpenseLabel(transaction.shared_debts.map((d) => d.person))}
            </span>
          )}
          {/* US-61: sale de subscription_id, con el nombre actual de la suscripción (CA-3), sea cual sea su estado. */}
          {transaction.subscription && (
            <Link
              to={`/subscriptions/${transaction.subscription.id}`}
              data-testid={`${baseTestId}-subscription`}
              aria-label={`Suscripción ${transaction.subscription.name}`}
              className="relative z-10 inline-flex max-w-full items-center gap-1 rounded-full bg-primary/12 px-2 py-0.5 text-caption font-medium break-words text-primary hover:bg-primary/20"
            >
              <Repeat aria-hidden="true" className="size-3 shrink-0" strokeWidth={1.8} />
              {transaction.subscription.name}
            </Link>
          )}
        </div>
        <span className="truncate text-footnote text-muted-foreground">
          {/* La categoría se ve en el ícono; el lector de pantalla la escucha acá. */}
          {categoryName && transaction.description && <span className="sr-only">{categoryName} · </span>}
          {meta}
        </span>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1 text-right">
        <span className={`tabular text-callout font-semibold ${isIncome ? 'text-income' : 'text-foreground'}`}>
          {isIncome ? `+${amountArs}` : `-${amountArs}`}
        </span>
        {transaction.currency === 'USD' && (
          <span className="tabular text-footnote text-muted-foreground">{formatUsd(parseMoney(transaction.entry_amount))}</span>
        )}
      </div>
    </>
  )

  const rowClass = 'flex min-h-[4.5rem] items-center gap-3.5 px-4 py-3'

  if (editHref) {
    return (
      <div data-testid={baseTestId} className={cn(rowClass, 'press relative transition-colors hover:bg-accent/50')}>
        {/* La fila entera es el enlace (ADR-052): una capa que la cubre, con el foco en su borde. La marca de
            suscripción queda por encima (z-10) y sigue llevando a su detalle (US-61). */}
        <Link
          to={editHref}
          data-testid={`${baseTestId}-edit`}
          aria-label={`Editar ${title}`}
          className="absolute inset-0 rounded-[inherit] outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
        />
        {body}
      </div>
    )
  }

  return (
    <div data-testid={baseTestId} className={cn(rowClass, (onRestoreRequest || onPurgeRequest) && 'pr-2')}>
      {body}
      {onRestoreRequest && (
        <button
          type="button"
          onClick={() => onRestoreRequest(transaction)}
          data-testid={`${baseTestId}-restore`}
          aria-label={`Restaurar ${title}`}
          className="press -ml-1 flex size-11 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary"
        >
          <RotateCcw aria-hidden="true" className="size-4" strokeWidth={1.6} />
        </button>
      )}
      {onPurgeRequest && (
        <button
          type="button"
          onClick={() => onPurgeRequest(transaction)}
          data-testid={`${baseTestId}-purge`}
          aria-label={`Eliminar definitivamente ${title}`}
          className="press -ml-1 flex size-11 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 aria-hidden="true" className="size-4" strokeWidth={1.6} />
        </button>
      )}
    </div>
  )
}
