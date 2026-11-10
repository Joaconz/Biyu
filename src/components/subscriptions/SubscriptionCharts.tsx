import type { Decimal } from '@/domain/money'
import { currentPeriod } from '@/domain/period'
import { committedByCategory, monthChargeSchedule, type SubscriptionRecord } from '@/domain/subscriptions'
import { CategoryCommitments } from './CategoryCommitments'
import { ChargeSchedule } from './ChargeSchedule'

/**
 * Los dos gráficos de Suscripciones, debajo del héroe (ADR-053): «Cobros de {mes}» y «Por categoría».
 * Salen de las mismas reglas que el total comprometido, así que hablan del mismo mes y los mismos montos.
 * Sin suscripciones activas en el mes no dibuja nada.
 */
export function SubscriptionCharts({
  subscriptions,
  fxRates,
  today,
}: {
  subscriptions: readonly SubscriptionRecord[]
  fxRates: ReadonlyMap<string, Decimal>
  today: Date
}) {
  const schedule = monthChargeSchedule(subscriptions, fxRates, currentPeriod(today), today)
  if (schedule.charged.count + schedule.pending.count === 0) return null
  return (
    <div data-testid="subscriptions-charts" className="mb-8 flex flex-col gap-6">
      <ChargeSchedule schedule={schedule} today={today} />
      <CategoryCommitments rows={committedByCategory(subscriptions, fxRates, today)} />
    </div>
  )
}
