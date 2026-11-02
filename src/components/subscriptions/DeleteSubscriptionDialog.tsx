import { useNavigate } from 'react-router'
import { SubscriptionOperationDialog } from '@/components/subscriptions/SubscriptionOperationDialog'
import type { SubscriptionRecord } from '@/domain/subscriptions'
import {
  deletedSubscriptionNoticeText,
  deleteSubscriptionWarning,
  subscriptionDeletionSummary,
} from '@/domain/subscriptionOperations'
import { deleteSubscription } from '@/lib/subscriptionOperations'

/**
 * «Eliminar definitivamente» una suscripción (US-88, ADR-044 §4) con la confirmación común de los borrados
 * (US-94): dice cuántos gastos generó y que quedan como movimientos sueltos. «Volver» y no «Cancelar» para
 * no confundirse con cancelar la suscripción (US-58). Al borrarla, la pantalla vuelve al listado.
 */
export function DeleteSubscriptionDialog({
  subscription,
  generatedCount,
  isOpen,
  onClose,
}: {
  subscription: SubscriptionRecord
  generatedCount: number | null
  isOpen: boolean
  onClose: () => void
}) {
  const navigate = useNavigate()

  async function run() {
    await deleteSubscription(subscription.id)
    return deletedSubscriptionNoticeText(subscription.name)
  }

  return (
    <SubscriptionOperationDialog
      isOpen={isOpen}
      title={`¿Eliminar ${subscription.name}?`}
      summary={subscriptionDeletionSummary(subscription, generatedCount)}
      confirmLabel="Eliminar definitivamente"
      busyLabel="Eliminando…"
      cancelLabel="Volver"
      testId="delete-subscription-dialog"
      failurePrefix="No se pudo eliminar"
      run={run}
      onDone={() => navigate('/subscriptions')}
      onClose={onClose}
    >
      {deleteSubscriptionWarning(subscription.status, generatedCount).map((line) => (
        <p key={line}>{line}</p>
      ))}
    </SubscriptionOperationDialog>
  )
}
