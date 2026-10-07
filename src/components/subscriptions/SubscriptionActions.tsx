import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { SubscriptionRecord } from '@/domain/subscriptions'
import { useSubscriptionFxRates } from '@/hooks/useSubscriptionFxRates'
import { todayInArgentina } from '@/lib/clock'
import { PauseSubscriptionDialog } from './PauseSubscriptionDialog'

/**
 * Acciones del Detalle según el estado (entrega-2/historias/suscripciones.md, Detalle §3). Una
 * cancelada no muestra ninguna. `onChanged` vuelve a leer la suscripción después de una operación.
 */
export function SubscriptionActions({
  subscription,
  generatedPeriods,
  onChanged,
}: {
  subscription: SubscriptionRecord
  generatedPeriods: ReadonlySet<string>
  onChanged: () => void
}) {
  const [pausing, setPausing] = useState(false)
  const fxRates = useSubscriptionFxRates(subscription.currency === 'USD' && subscription.status === 'active')

  if (subscription.status === 'cancelled') return null

  return (
    <>
      <div data-testid="subscription-detail-actions" className="mt-4 flex flex-wrap gap-2">
        {subscription.status === 'active' && (
          <Button type="button" variant="outline" size="sm" data-testid="subscription-detail-pause" onClick={() => setPausing(true)}>
            Pausar
          </Button>
        )}
      </div>

      <PauseSubscriptionDialog
        subscription={subscription}
        generatedPeriods={generatedPeriods}
        fxRates={fxRates}
        today={todayInArgentina()}
        isOpen={pausing}
        onClose={() => setPausing(false)}
        onPaused={onChanged}
      />
    </>
  )
}
