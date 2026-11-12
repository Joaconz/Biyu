import { ChevronLeft } from 'lucide-react'
import { Link, useParams, useSearchParams } from 'react-router'
import { DeleteFromEdit } from '@/components/transactions/DeleteFromEdit'
import { EditTransactionForm } from '@/components/transactions/EditTransactionForm'
import { buttonVariants } from '@/components/ui/button'
import { parsePeriod } from '@/domain/period'
import { editBlock } from '@/domain/transactionEdit'
import { useTransactionEdit } from '@/hooks/useTransactionEdit'

/**
 * Editar movimiento (US-84, `/transactions/:id/edit`). También es donde se elimina (ADR-052). Se entra desde Movimientos con el período en la
 * URL (C11) y se vuelve a él al guardar o cancelar. Un movimiento eliminado, de una suscripción o
 * compartido muestra su aviso en vez del formulario (ADR-043 §5); uno ajeno o inexistente, «no encontrado».
 */
export function EditTransactionPage() {
  const { id = '' } = useParams()
  const [params] = useSearchParams()
  const period = params.get('period')
  const backTo = parsePeriod(period) ? `/transactions?period=${period}` : '/transactions'
  const state = useTransactionEdit(id)

  if (state.status === 'ready') {
    const block = editBlock(state.transaction)
    if (!block) {
      return (
        <>
          <EditTransactionForm
            key={state.transaction.id}
            transaction={state.transaction}
            categories={state.categories}
            accounts={state.accounts}
            backTo={backTo}
          />
          <DeleteFromEdit transactionId={state.transaction.id} backTo={backTo} />
        </>
      )
    }
    return (
      <Shell backTo={backTo}>
        <div className="flex flex-col items-start gap-4">
          <p data-testid={`edit-transaction-blocked-${block.kind}`} className="text-callout text-foreground">
            {block.message}
          </p>
          <BackLink to={backTo} testId="edit-transaction-blocked-back" />
        </div>
        {/* Compartido, de una suscripción o empezado: no se edita, pero se puede eliminar (ADR-052). */}
        <DeleteFromEdit transactionId={state.transaction.id} backTo={backTo} />
      </Shell>
    )
  }

  return (
    <Shell backTo={backTo}>
      {state.status === 'loading' && (
        <p data-testid="edit-transaction-loading" className="text-callout text-muted-foreground">
          Cargando…
        </p>
      )}
      {state.status === 'error' && (
        <div className="flex flex-col items-start gap-3">
          <p role="alert" data-testid="edit-transaction-load-error" className="text-callout text-destructive">
            No pudimos cargar el movimiento.
          </p>
          <button
            type="button"
            data-testid="edit-transaction-load-retry"
            onClick={state.retry}
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            Reintentar
          </button>
        </div>
      )}
      {state.status === 'not-found' && (
        <div className="flex flex-col items-start gap-4">
          <p data-testid="edit-transaction-not-found" className="text-callout text-foreground">
            No encontramos este movimiento.
          </p>
          <BackLink to={backTo} testId="edit-transaction-not-found-back" />
        </div>
      )}
    </Shell>
  )
}

function Shell({ backTo, children }: { backTo: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col">
      <div className="flex items-center gap-1 pt-3 pb-6 lg:pt-0 lg:pb-8">
        <Link
          to={backTo}
          data-testid="edit-transaction-back"
          aria-label="Volver a Movimientos"
          className="press -ml-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full text-primary hover:bg-primary/8"
        >
          <ChevronLeft aria-hidden="true" className="size-6" strokeWidth={1.8} />
        </Link>
        <h1 data-testid="edit-transaction-title" className="text-title-1 font-bold text-foreground">
          Editar movimiento
        </h1>
      </div>
      {children}
    </div>
  )
}

function BackLink({ to, testId }: { to: string; testId: string }) {
  return (
    <Link to={to} data-testid={testId} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
      Volver
    </Link>
  )
}
