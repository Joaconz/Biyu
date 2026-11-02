import { SubscriptionOperationDialog } from '@/components/subscriptions/SubscriptionOperationDialog'
import type { SubscriptionRecord } from '@/domain/subscriptions'
import {
  DELETE_SUBSCRIPTION_WARNING,
  deletedSubscriptionNotice,
  deleteSubscriptionKeptText,
  subscriptionDeletionSummary,
} from '@/domain/subscriptionDelete'
import { deleteSubscription } from '@/lib/subscriptionOperations'

/**
 * Diálogo de «Eliminar suscripción» (US-88, ADR-044 §4), en cualquier estado. Usa la confirmación común de los
 * borrados (US-94): dice cuál se elimina y qué pasa con los gastos que ya cargó, que quedan como movimientos sueltos.
 * El botón de cerrar dice «Volver», como en Cancelar suscripción.
 */
export function DeleteSubscriptionDialog({
  subscription,
  transactionCount,
  isOpen,
  onClose,
  onDeleted,
}: {
  subscription: SubscriptionRecord
  /** Transacciones vigentes de la suscripción; null si no se pudieron contar. */
  transactionCount: number | null
  isOpen: boolean
  onClose: () => void
  /** Después de eliminar: la pantalla sale del Detalle, que ya no existe. */
  onDeleted: () => void
}) {
  async function run() {
    await deleteSubscription(subscription.id)
    return deletedSubscriptionNotice(subscription.name)
  }

  return (
    <SubscriptionOperationDialog
      isOpen={isOpen}
      title={`¿Eliminar ${subscription.name}?`}
      summary={subscriptionDeletionSummary(subscription)}
      confirmLabel="Eliminar"
      busyLabel="Eliminando…"
      cancelLabel="Volver"
      testId="delete-subscription-dialog"
      failurePrefix="No se pudo eliminar"
      run={run}
      onDone={onDeleted}
      onClose={onClose}
    >
      <p data-testid="delete-subscription-dialog-kept">{deleteSubscriptionKeptText(transactionCount)}</p>
      <p>{DELETE_SUBSCRIPTION_WARNING}</p>
    </SubscriptionOperationDialog>
  )
}
