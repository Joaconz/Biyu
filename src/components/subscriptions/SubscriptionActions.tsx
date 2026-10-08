import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Decimal } from '@/domain/money'
import type { BlockedOccurrence } from '@/domain/subscriptionBlocked'
import type { SubscriptionRecord } from '@/domain/subscriptions'
import { todayInArgentina } from '@/lib/clock'
import { CancelSubscriptionDialog } from './CancelSubscriptionDialog'
import { PauseSubscriptionDialog } from './PauseSubscriptionDialog'
import { ResumeSubscriptionDialog } from './ResumeSubscriptionDialog'

/**
 * Acciones del Detalle según el estado (entrega-2/historias/suscripciones.md, Detalle §3). Una
 * cancelada no muestra ninguna. `onChanged` vuelve a leer la suscripción después de una operación.
 */
export function SubscriptionActions({
  subscription,
  generatedPeriods,
  blocked,
  fxRates,
  transactionCount,
  onChanged,
}: {
  subscription: SubscriptionRecord
  generatedPeriods: ReadonlySet<string>
  blocked: readonly BlockedOccurrence[]
  fxRates: ReadonlyMap<string, Decimal> | null
  /** Transacciones vigentes de la suscripción (US-58); null si no se pudieron contar. */
  transactionCount: number | null
  onChanged: () => void
}) {
  const [pausing, setPausing] = useState(false)
  const [resuming, setResuming] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  if (subscription.status === 'cancelled') return null

  return (
    <>
      <div data-testid="subscription-detail-actions" className="mt-4 flex flex-wrap gap-2">
        {subscription.status === 'active' && (
          <Button type="button" variant="outline" size="sm" data-testid="subscription-detail-pause" onClick={() => setPausing(true)}>
            Pausar
          </Button>
        )}
        {subscription.status === 'paused' && (
          <Button type="button" variant="outline" size="sm" data-testid="subscription-detail-resume" onClick={() => setResuming(true)}>
            Reanudar
          </Button>
        )}
        <Button type="button" variant="destructive" size="sm" data-testid="subscription-detail-cancel" onClick={() => setCancelling(true)}>
          Cancelar suscripción
        </Button>
      </div>

      <PauseSubscriptionDialog
        subscription={subscription}
        generatedPeriods={generatedPeriods}
        blocked={blocked}
        today={todayInArgentina()}
        isOpen={pausing}
        onClose={() => setPausing(false)}
        onPaused={onChanged}
      />

      <ResumeSubscriptionDialog
        subscription={subscription}
        generatedPeriods={generatedPeriods}
        today={todayInArgentina()}
        isOpen={resuming}
        onClose={() => setResuming(false)}
        onResumed={onChanged}
      />

      <CancelSubscriptionDialog
        subscription={subscription}
        generatedPeriods={generatedPeriods}
        blocked={blocked}
        fxRates={fxRates}
        transactionCount={transactionCount}
        today={todayInArgentina()}
        isOpen={cancelling}
        onClose={() => setCancelling(false)}
        onCancelled={onChanged}
      />
    </>
  )
}
