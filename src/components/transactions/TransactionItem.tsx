import { ArrowDownLeft, Repeat, RotateCcw, Trash2 } from 'lucide-react'
import { Link } from 'react-router'
import { CategoryIcon } from '@/components/shared/CategoryIcon'
import { formatInstallmentLabel } from '@/domain/installments'
import { formatArs, formatUsd, parseMoney } from '@/domain/money'
import { formatDayShort } from '@/domain/period'
import { sharedExpenseLabel } from '@/domain/sharedDebt'
import type { DashboardTransaction } from '@/lib/dashboard'

interface TransactionItemProps {
  transaction: DashboardTransaction
  testId?: string
  onDeleteRequest?: (transaction: DashboardTransaction) => void
  /** Filtro "Eliminados" (DEF-007): en vez de eliminar, se restaura. */
  onRestoreRequest?: (transaction: DashboardTransaction) => void
  /** En la lista agrupada por día la fecha ya está en el encabezado. */
  showDate?: boolean
}

/**
 * Fila de movimiento: el ícono dice la categoría, así el renglón secundario queda para la fecha y
 * la cuenta y no se trunca en tres pedazos. El monto es la cuota que impacta en el mes (US-17).
 */
export function TransactionItem({ transaction, testId, onDeleteRequest, onRestoreRequest, showDate = true }: TransactionItemProps) {
  const isIncome = transaction.type === 'income'
  const amountArs = formatArs(parseMoney(transaction.entry_amount_ars))
  const installmentLabel = formatInstallmentLabel(transaction.installment_number, transaction.installments_count)
  const categoryName = transaction.category?.name
  const title = transaction.description || categoryName || (isIncome ? 'Ingreso' : 'Gasto')
  const meta = [showDate ? formatDayShort(transaction.occurred_on) : null, transaction.account?.name].filter(Boolean).join(' · ')
  const baseTestId = testId ?? 'transaction-item'

  return (
    <div data-testid={baseTestId} className="flex min-h-16 items-center gap-3 py-2.5 pr-1 pl-3.5">
      {isIncome ? (
        <span
          aria-hidden="true"
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--income)_12%,var(--card))] text-income"
        >
          <ArrowDownLeft className="size-[1.125rem]" strokeWidth={1.8} />
        </span>
      ) : (
        <CategoryIcon name={categoryName ?? 'Otros'} color={transaction.category?.color} />
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        {/* Las etiquetas bajan de renglón antes que recortar el título a una letra (US-35 suma una larga). */}
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <span className="max-w-full truncate text-callout font-medium text-foreground">{title}</span>
          {/* DEF-006 (02-behavior-spec, sad path "categoría archivada"): la misma marca que el Resumen. */}
          {transaction.category?.archived_at && (
            <span
              data-testid={`${baseTestId}-archived`}
              aria-label={`Categoría ${categoryName} archivada`}
              className="shrink-0 rounded-md bg-secondary px-1.5 py-0.5 text-caption font-medium text-muted-foreground"
            >
              archivada
            </span>
          )}
          {/* DEF-007: en el filtro "Eliminados" la fila lo dice, además de estar en otra vista. */}
          {transaction.deleted_at && (
            <span
              data-testid={`${baseTestId}-deleted`}
              className="shrink-0 rounded-md bg-destructive/10 px-1.5 py-0.5 text-caption font-medium text-destructive"
            >
              eliminada
            </span>
          )}
          {installmentLabel !== null && (
            <span
              data-testid={`${baseTestId}-installment`}
              aria-label={`Cuota ${transaction.installment_number} de ${transaction.installments_count}`}
              className="tabular shrink-0 rounded-md bg-secondary px-1.5 py-0.5 text-caption font-medium text-muted-foreground"
            >
              {installmentLabel}
            </span>
          )}
          {/* US-35: el gasto compartido lo dice en cada cuota, junto a las otras etiquetas. Va última y sin
            recortar: el nombre es lo que importa, y en el celular baja de renglón. */}
          {transaction.shared_debt && (
            <span
              data-testid={`${baseTestId}-shared`}
              className="max-w-full rounded-md break-words bg-secondary px-1.5 py-0.5 text-caption font-medium text-muted-foreground"
            >
              {sharedExpenseLabel(transaction.shared_debt.person)}
            </span>
          )}
          {/* US-61: sale de subscription_id, con el nombre actual de la suscripción (CA-3), sea cual sea su estado. */}
          {transaction.subscription && (
            <Link
              to={`/subscriptions/${transaction.subscription.id}`}
              data-testid={`${baseTestId}-subscription`}
              aria-label={`Suscripción ${transaction.subscription.name}`}
              className="inline-flex max-w-full items-center gap-1 rounded-md bg-primary/10 px-1.5 py-0.5 text-caption font-medium break-words text-primary hover:bg-primary/15"
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

      <div className="flex shrink-0 flex-col items-end gap-0.5 text-right">
        <span className={`tabular text-callout font-semibold ${isIncome ? 'text-income' : 'text-foreground'}`}>
          {isIncome ? `+${amountArs}` : `-${amountArs}`}
        </span>
        {transaction.currency === 'USD' && (
          <span className="tabular text-footnote text-muted-foreground">{formatUsd(parseMoney(transaction.entry_amount))}</span>
        )}
      </div>

      {onRestoreRequest && (
        <button
          type="button"
          onClick={() => onRestoreRequest(transaction)}
          data-testid={`${baseTestId}-restore`}
          aria-label={`Restaurar ${title}`}
          className="press -ml-1 flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-primary/8 hover:text-primary"
        >
          <RotateCcw aria-hidden="true" className="size-4" strokeWidth={1.6} />
        </button>
      )}

      {onDeleteRequest && (
        <button
          type="button"
          onClick={() => onDeleteRequest(transaction)}
          data-testid={`${baseTestId}-delete`}
          aria-label={`Eliminar ${title}`}
          className="press -ml-1 flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/8 hover:text-destructive"
        >
          <Trash2 aria-hidden="true" className="size-4" strokeWidth={1.6} />
        </button>
      )}
    </div>
  )
}
