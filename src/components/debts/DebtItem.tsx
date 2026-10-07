import { debtRowText, type DebtRecord } from '@/domain/debts'
import { cn } from '@/lib/utils'

/**
 * Fila de la lista de Deudas (US-38): persona y dirección arriba, la nota, la fecha con el estado, y
 * el monto a la derecha (en US$, con su equivalente en pesos congelado, C5). Lo que se debe va en
 * rojo, como en los totales.
 */
export function DebtItem({ debt }: { debt: DebtRecord }) {
  const text = debtRowText(debt)
  const settled = debt.status === 'settled'
  return (
    <div
      data-testid="debts-item"
      data-debt-id={debt.id}
      data-status={debt.status}
      className="flex min-h-16 items-start gap-3 py-3 pr-4 pl-4"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex min-w-0 items-baseline gap-1.5">
          <span data-testid="debts-item-person" className="truncate text-callout font-semibold text-foreground">
            {text.person}
          </span>
          <span aria-hidden="true" className="text-footnote text-muted-foreground">·</span>
          <span data-testid="debts-item-direction" className="shrink-0 text-footnote text-muted-foreground">
            {text.direction}
          </span>
        </div>
        <span data-testid="debts-item-origin" className="text-footnote break-words text-muted-foreground">
          {text.origin}
        </span>
        {text.notes && (
          <span data-testid="debts-item-notes" className="text-footnote break-words text-muted-foreground">
            {text.notes}
          </span>
        )}
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-footnote text-muted-foreground">
          <span data-testid="debts-item-date" className="tabular">
            {text.date}
          </span>
          <span aria-hidden="true">·</span>
          <span
            data-testid="debts-item-status"
            className={cn(
              'rounded-md px-1.5 py-0.5 text-caption font-medium',
              settled ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground',
            )}
          >
            {text.status}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-0.5 text-right">
        <span
          data-testid="debts-item-amount"
          className={cn('tabular text-callout font-semibold', debt.direction === 'i_owe' ? 'text-destructive' : 'text-foreground')}
        >
          {text.amount}
        </span>
        {text.amountArs && (
          <span data-testid="debts-item-amount-ars" className="tabular text-footnote text-muted-foreground">
            {text.amountArs}
          </span>
        )}
      </div>
    </div>
  )
}
