import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import type { SubscriptionRecord } from '@/domain/subscriptions'
import { resumedNoticeText, resumeOutcomeText } from '@/domain/subscriptionOperations'
import { saveFailureReason } from '@/lib/errors'
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
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    if (!isOpen) setError(null)
  }, [isOpen])

  async function onConfirm() {
    setError(null)
    try {
      const { generatedAfter } = await resumeSubscription(subscription.id)
      toast.success(resumedNoticeText(generatedAfter, today), { testId: 'subscription-toast' })
      onResumed()
      onClose()
    } catch (err) {
      setError(`No se pudo reanudar: ${saveFailureReason(err)}`)
    }
  }

  return (
    <ConfirmDialog
      isOpen={isOpen}
      title={`¿Reanudar ${subscription.name}?`}
      confirmLabel="Reanudar"
      busyLabel="Reanudando…"
      confirmVariant="default"
      testId="resume-subscription-dialog"
      onConfirm={onConfirm}
      onClose={onClose}
    >
      <p>No se cargan los meses en los que estuvo pausada. {resumeOutcomeText(subscription, generatedPeriods, today)}</p>
      {error && (
        <p role="alert" data-testid="resume-subscription-dialog-error" className="text-destructive">
          {error}
        </p>
      )}
    </ConfirmDialog>
  )
}
