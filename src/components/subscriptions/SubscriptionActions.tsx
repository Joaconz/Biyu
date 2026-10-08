import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { BlockedOccurrence } from '@/domain/subscriptionBlocked'
import type { SubscriptionRecord } from '@/domain/subscriptions'
import { todayInArgentina } from '@/lib/clock'
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
  onChanged,
}: {
  subscription: SubscriptionRecord
  generatedPeriods: ReadonlySet<string>
  blocked: readonly BlockedOccurrence[]
  onChanged: () => void
}) {
  const [pausing, setPausing] = useState(false)
  const [resuming, setResuming] = useState(false)

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
    </>
  )
}
