import { ArrowDownLeft, Trash2 } from 'lucide-react'
import { CategoryIcon } from '@/components/shared/CategoryIcon'
import { formatInstallmentLabel } from '@/domain/installments'
import { formatArs, formatUsd, parseMoney } from '@/domain/money'
import { formatDayShort } from '@/domain/period'
import type { DashboardTransaction } from '@/lib/dashboard'

interface TransactionItemProps {
  transaction: DashboardTransaction
  testId?: string
  onDeleteRequest?: (transaction: DashboardTransaction) => void
  /** En la lista agrupada por día la fecha ya está en el encabezado. */
  showDate?: boolean
}

/**
 * Fila de movimiento: el ícono dice la categoría, así el renglón secundario queda para la fecha y
 * la cuenta y no se trunca en tres pedazos. El monto es la cuota que impacta en el mes (US-17).
 */
export function TransactionItem({ transaction, testId, onDeleteRequest, showDate = true }: TransactionItemProps) {
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
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-callout font-medium text-foreground">{title}</span>
          {installmentLabel !== null && (
            <span
              data-testid={`${baseTestId}-installment`}
              aria-label={`Cuota ${transaction.installment_number} de ${transaction.installments_count}`}
              className="tabular shrink-0 rounded-md bg-secondary px-1.5 py-0.5 text-caption font-medium text-muted-foreground"
            >
              {installmentLabel}
            </span>
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
