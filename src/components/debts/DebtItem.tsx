import { Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router'
import { buttonVariants } from '@/components/ui/button'
import { debtRowText, type DebtRecord } from '@/domain/debts'
import { cn } from '@/lib/utils'

/**
 * Fila de la lista de Deudas (US-38): persona y dirección arriba, la nota, y el monto a la derecha (en
 * US$, con su equivalente en pesos congelado, C5). Lo que se debe va en rojo, como en los totales. Al pie,
 * la fecha con el estado y las acciones: una pendiente tiene "Marcar saldada" (US-39) y una saldada,
 * "Volver a pendiente" (US-40).
 */
export function DebtItem({
  debt,
  busy,
  onSettle,
  onReopen,
  onDelete,
  editHref,
}: {
  debt: DebtRecord
  /** Esperando settle_debt o reopen_debt de esta fila. */
  busy: boolean
  onSettle: (debt: DebtRecord) => void
  onReopen: (debt: DebtRecord) => void
  /** US-87: solo en una pendiente; una saldada vuelve a pendiente primero (ADR-044 §3). */
  onDelete: (debt: DebtRecord) => void
  /** US-86: a dónde lleva «Editar». Solo una pendiente se edita (una saldada vuelve a pendiente primero). */
  editHref?: string
}) {
  const text = debtRowText(debt)
  const settled = debt.status === 'settled'
  const iconAction = cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'text-muted-foreground')
  // ADR-052: datos arriba, acciones en un renglón al pie (antes iban apiladas bajo el monto y estiraban la fila).
  return (
    <div
      data-testid="debts-item"
      data-debt-id={debt.id}
      data-status={debt.status}
      className="flex flex-col gap-3 px-4 pt-4 pb-2"
    >
      <div className="flex items-start gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex min-w-0 items-baseline gap-1.5">
            <span data-testid="debts-item-person" className="truncate text-headline font-semibold text-foreground">
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
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span data-testid="debts-item-date" className="tabular text-footnote text-muted-foreground">
              {text.date}
            </span>
            <span
              data-testid="debts-item-status"
              className={cn(
                'rounded-full px-2.5 py-0.5 text-caption font-medium',
                settled ? 'bg-primary/12 text-primary' : 'bg-secondary text-muted-foreground',
              )}
            >
              {text.status}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-0.5 text-right">
          <span
            data-testid="debts-item-amount"
            className={cn('tabular text-headline font-semibold', debt.direction === 'i_owe' ? 'text-destructive' : 'text-foreground')}
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

      <div className="flex items-center gap-1">
        {settled ? (
          <button
            type="button"
            data-testid="debts-item-reopen"
            disabled={busy}
            onClick={() => onReopen(debt)}
            className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'mr-auto')}
          >
            {busy ? 'Actualizando…' : 'Volver a pendiente'}
          </button>
        ) : (
          <button
            type="button"
            data-testid="debts-item-settle"
            disabled={busy}
            onClick={() => onSettle(debt)}
            className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'mr-auto')}
          >
            {busy ? 'Saldando…' : 'Marcar saldada'}
          </button>
        )}
        {!settled && editHref && (
          <Link
            to={editHref}
            data-testid="debts-item-edit"
            aria-label={`Editar deuda de ${debt.person}`}
            className={cn(iconAction, 'hover:text-primary')}
          >
            <Pencil strokeWidth={1.6} aria-hidden="true" />
          </Link>
        )}
        {!settled && (
          <button
            type="button"
            data-testid="debts-item-delete"
            aria-label={`Eliminar deuda de ${debt.person}`}
            disabled={busy}
            onClick={() => onDelete(debt)}
            className={cn(iconAction, '-mr-2 hover:text-destructive')}
          >
            <Trash2 strokeWidth={1.6} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
}
