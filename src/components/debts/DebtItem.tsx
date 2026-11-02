import { Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router'
import { buttonVariants } from '@/components/ui/button'
import { debtRowText, type DebtRecord } from '@/domain/debts'
import { cn } from '@/lib/utils'

/**
 * Fila de la lista de Deudas (US-38): persona y dirección arriba, la nota, la fecha con el estado, y
 * el monto a la derecha (en US$, con su equivalente en pesos congelado, C5). Lo que se debe va en
 * rojo, como en los totales. Debajo del monto, una pendiente tiene "Marcar saldada" (US-39) y una
 * saldada, "Volver a pendiente" (US-40).
 */
export function DebtItem({
  debt,
  busy,
  onSettle,
  onReopen,
  editHref,
  onDelete,
}: {
  debt: DebtRecord
  /** Esperando settle_debt o reopen_debt de esta fila. */
  busy: boolean
  onSettle: (debt: DebtRecord) => void
  onReopen: (debt: DebtRecord) => void
  /** US-86: a dónde lleva «Editar». Solo una deuda pendiente se edita (primero se vuelve a pendiente). */
  editHref?: string
  /** US-87: abre la confirmación de eliminar. Solo una deuda pendiente se elimina. */
  onDelete?: (debt: DebtRecord) => void
}) {
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
        {settled ? (
          <button
            type="button"
            data-testid="debts-item-reopen"
            disabled={busy}
            onClick={() => onReopen(debt)}
            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'mt-1.5 -mr-2')}
          >
            {busy ? 'Actualizando…' : 'Volver a pendiente'}
          </button>
        ) : (
          <div className="mt-1 -mr-2 flex items-center">
            {editHref && (
              <Link
                to={editHref}
                data-testid="debts-item-edit"
                aria-label={`Editar la deuda de ${debt.person}`}
                className="press flex size-11 items-center justify-center rounded-full text-muted-foreground hover:bg-primary/8 hover:text-primary"
              >
                <Pencil aria-hidden="true" className="size-4" strokeWidth={1.6} />
              </Link>
            )}
            {onDelete && (
              <button
                type="button"
                data-testid="debts-item-delete"
                aria-label={`Eliminar la deuda de ${debt.person}`}
                disabled={busy}
                onClick={() => onDelete(debt)}
                className="press flex size-11 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/8 hover:text-destructive disabled:opacity-50"
              >
                <Trash2 aria-hidden="true" className="size-4" strokeWidth={1.6} />
              </button>
            )}
            <button
              type="button"
              data-testid="debts-item-settle"
              disabled={busy}
              onClick={() => onSettle(debt)}
              className={buttonVariants({ variant: 'ghost', size: 'sm' })}
            >
              {busy ? 'Saldando…' : 'Marcar saldada'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
