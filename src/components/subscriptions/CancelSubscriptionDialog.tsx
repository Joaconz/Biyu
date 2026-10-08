import { SubscriptionOperationDialog } from '@/components/subscriptions/SubscriptionOperationDialog'
import type { Decimal } from '@/domain/money'
import type { BlockedOccurrence } from '@/domain/subscriptionBlocked'
import type { SubscriptionRecord } from '@/domain/subscriptions'
import { blockedMonthsWarning, cancelledNoticeText, cancelWarningText, expensesKeptOnCancel } from '@/domain/subscriptionOperations'
import { cancelSubscription } from '@/lib/subscriptionOperations'

/**
 * Diálogo de "Cancelar suscripción" (US-58). El botón de cerrar dice "Volver" para no confundirse con la
 * acción. Cancelar es irreversible (I15): lo que pasa de verdad lo decide `cancel_subscription` (ADR-030).
 */
export function CancelSubscriptionDialog({
  subscription,
  generatedPeriods,
  blocked,
  fxRates,
  transactionCount,
  today,
  isOpen,
  onClose,
  onCancelled,
}: {
  subscription: SubscriptionRecord
  generatedPeriods: ReadonlySet<string>
  /** Los meses que no se pudieron cargar (US-62): el diálogo avisa que cancelar no los rescata. */
  blocked: readonly BlockedOccurrence[]
  fxRates: ReadonlyMap<string, Decimal> | null
  /** Transacciones vigentes de la suscripción; null si no se pudieron contar. */
  transactionCount: number | null
  today: Date
  isOpen: boolean
  onClose: () => void
  /** Después de cancelar: la pantalla vuelve a leer la suscripción. */
  onCancelled: () => void
}) {
  const kept =
    transactionCount === null ? null : expensesKeptOnCancel(transactionCount, subscription, generatedPeriods, fxRates, today)
  const blockedWarning = blockedMonthsWarning(blocked, 'cancelás')

  async function run() {
    const { generatedBefore } = await cancelSubscription(subscription.id)
    return cancelledNoticeText(generatedBefore)
  }

  return (
    <SubscriptionOperationDialog
      isOpen={isOpen}
      title={`¿Cancelar ${subscription.name}?`}
      confirmLabel="Cancelar suscripción"
      busyLabel="Cancelando…"
      cancelLabel="Volver"
      testId="cancel-subscription-dialog"
      failurePrefix="No se pudo cancelar"
      run={run}
      onDone={onCancelled}
      onClose={onClose}
    >
      <p>{cancelWarningText(kept)}</p>
      {blockedWarning && (
        <p data-testid="cancel-subscription-dialog-blocked-warning" className="rounded-lg bg-warning/10 px-3 py-2 text-foreground">
          {blockedWarning}
        </p>
      )}
    </SubscriptionOperationDialog>
  )
}
