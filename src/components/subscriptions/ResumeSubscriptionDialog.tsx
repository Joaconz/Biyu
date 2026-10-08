import { SubscriptionOperationDialog } from '@/components/subscriptions/SubscriptionOperationDialog'
import type { SubscriptionRecord } from '@/domain/subscriptions'
import { resumedNoticeText, resumeOutcomeText } from '@/domain/subscriptionOperations'
import { resumeSubscription } from '@/lib/subscriptionOperations'

/**
 * Diálogo de "Reanudar" (US-57). Anticipa qué se carga y cuándo es el próximo cobro con el piso nuevo
 * de R8; lo que pasa de verdad lo decide `resume_subscription` (ADR-030).
 */
export function ResumeSubscriptionDialog({
  subscription,
  generatedPeriods,
  today,
  isOpen,
  onClose,
  onResumed,
}: {
  subscription: SubscriptionRecord
  generatedPeriods: ReadonlySet<string>
  today: Date
  isOpen: boolean
  onClose: () => void
  /** Después de reanudar: la pantalla vuelve a leer la suscripción. */
  onResumed: () => void
}) {
  async function run() {
    const { generatedAfter } = await resumeSubscription(subscription.id)
    return resumedNoticeText(generatedAfter, today)
  }

  return (
    <SubscriptionOperationDialog
      isOpen={isOpen}
      title={`¿Reanudar ${subscription.name}?`}
      confirmLabel="Reanudar"
      busyLabel="Reanudando…"
      confirmVariant="default"
      testId="resume-subscription-dialog"
      failurePrefix="No se pudo reanudar"
      run={run}
      onDone={onResumed}
      onClose={onClose}
    >
      <p>No se cargan los meses en los que estuvo pausada. {resumeOutcomeText(subscription, generatedPeriods, today)}</p>
    </SubscriptionOperationDialog>
  )
}
