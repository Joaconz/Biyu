import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import type { Decimal } from '@/domain/money'
import type { SubscriptionRecord } from '@/domain/subscriptions'
import { blockedMonthsWarning, missingFxPeriods, pauseSkipsCurrentMonthDay, pausedNoticeText } from '@/domain/subscriptionOperations'
import { saveFailureReason } from '@/lib/errors'
import { pauseSubscription } from '@/lib/subscriptionOperations'

/**
 * Diálogo de "Pausar" (US-56). El texto sobre "este mes" y el de los meses bloqueados se calculan con
 * lo que la pantalla ya cargó; lo que pasa de verdad lo decide `pause_subscription` (ADR-030).
 */
export function PauseSubscriptionDialog({
  subscription,
  generatedPeriods,
  fxRates,
  today,
  isOpen,
  onClose,
  onPaused,
}: {
  subscription: SubscriptionRecord
  generatedPeriods: ReadonlySet<string>
  fxRates: ReadonlyMap<string, Decimal> | null
  today: Date
  isOpen: boolean
  onClose: () => void
  /** Después de pausar: la pantalla vuelve a leer la suscripción. */
  onPaused: () => void
}) {
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    if (!isOpen) setError(null)
  }, [isOpen])

  const skippedDay = pauseSkipsCurrentMonthDay(subscription, generatedPeriods, today)
  const blockedWarning = blockedMonthsWarning(missingFxPeriods(subscription, generatedPeriods, fxRates, today), 'pausás')

  async function onConfirm() {
    setError(null)
    try {
      const { generatedBefore } = await pauseSubscription(subscription.id)
      toast.success(pausedNoticeText(generatedBefore), { testId: 'subscription-toast' })
      onPaused()
      onClose()
    } catch (err) {
      setError(`No se pudo pausar: ${saveFailureReason(err)}`)
    }
  }

  return (
    <ConfirmDialog
      isOpen={isOpen}
      title={`¿Pausar ${subscription.name}?`}
      confirmLabel="Pausar"
      busyLabel="Pausando…"
      confirmVariant="default"
      testId="pause-subscription-dialog"
      onConfirm={onConfirm}
      onClose={onClose}
    >
      <p>
        Mientras esté pausada no se cargan gastos.
        {skippedDay !== null && ` Este mes tampoco se cobra si todavía no llegó el día ${skippedDay}, aunque la reanudes antes.`}
      </p>
      {blockedWarning && (
        <p data-testid="pause-subscription-dialog-blocked-warning" className="rounded-lg bg-warning/10 px-3 py-2 text-foreground">
          {blockedWarning}
        </p>
      )}
      {error && (
        <p role="alert" data-testid="pause-subscription-dialog-error" className="text-destructive">
          {error}
        </p>
      )}
    </ConfirmDialog>
  )
}
