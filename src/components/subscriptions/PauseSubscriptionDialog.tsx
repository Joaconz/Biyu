import { SubscriptionOperationDialog } from '@/components/subscriptions/SubscriptionOperationDialog'
import type { BlockedOccurrence } from '@/domain/subscriptionBlocked'
import type { SubscriptionRecord } from '@/domain/subscriptions'
import { blockedMonthsWarning, pauseSkipsCurrentMonthDay, pausedNoticeText } from '@/domain/subscriptionOperations'
import { pauseSubscription } from '@/lib/subscriptionOperations'

/**
 * Diálogo de "Pausar" (US-56). El texto sobre "este mes" y el de los meses bloqueados se calculan con
 * lo que la pantalla ya cargó; lo que pasa de verdad lo decide `pause_subscription` (ADR-030).
 */
export function PauseSubscriptionDialog({
  subscription,
  generatedPeriods,
  blocked,
  today,
  isOpen,
  onClose,
  onPaused,
}: {
  subscription: SubscriptionRecord
  generatedPeriods: ReadonlySet<string>
  /** Los meses que no se pudieron cargar (US-62): el diálogo avisa que pausar no los rescata. */
  blocked: readonly BlockedOccurrence[]
  today: Date
  isOpen: boolean
  onClose: () => void
  /** Después de pausar: la pantalla vuelve a leer la suscripción. */
  onPaused: () => void
}) {
  const skippedDay = pauseSkipsCurrentMonthDay(subscription, generatedPeriods, today)
  const blockedWarning = blockedMonthsWarning(blocked, 'pausás')

  async function run() {
    const { generatedBefore } = await pauseSubscription(subscription.id)
    return pausedNoticeText(generatedBefore)
  }

  return (
    <SubscriptionOperationDialog
      isOpen={isOpen}
      title={`¿Pausar ${subscription.name}?`}
      confirmLabel="Pausar"
      busyLabel="Pausando…"
      confirmVariant="default"
      testId="pause-subscription-dialog"
      failurePrefix="No se pudo pausar"
      run={run}
      onDone={onPaused}
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
    </SubscriptionOperationDialog>
  )
}
