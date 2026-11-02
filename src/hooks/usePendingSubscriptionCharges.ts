import { useEffect, useState } from 'react'
import type { Period } from '@/domain/period'
import { pendingSubscriptionCharges, type PendingSubscriptionCharges } from '@/domain/subscriptions'
import { todayInArgentina } from '@/lib/clock'
import { fetchFxRatesByPeriod } from '@/lib/fxRates'
import { fetchGeneratedPeriodsBySubscription, fetchSubscriptions } from '@/lib/subscriptions'

/**
 * Lo que las suscripciones activas todavía van a cobrar en el período (ADR-045). Es un dato
 * secundario del Resumen: si no se puede leer, devuelve null y el Resumen se muestra igual, sin la
 * tarjeta (ADR-031: una feature secundaria no tira abajo la pantalla).
 */
export function usePendingSubscriptionCharges(period: Period, version = 0): PendingSubscriptionCharges | null {
  const [pending, setPending] = useState<PendingSubscriptionCharges | null>(null)

  useEffect(() => {
    let cancelled = false
    setPending(null)
    Promise.all([fetchSubscriptions(), fetchGeneratedPeriodsBySubscription(), fetchFxRatesByPeriod()])
      .then(([subscriptions, generated, fxRates]) => {
        if (!cancelled) setPending(pendingSubscriptionCharges(subscriptions, generated, fxRates, period, todayInArgentina()))
      })
      .catch(() => {
        if (!cancelled) setPending(null)
      })
    return () => {
      cancelled = true
    }
  }, [period.year, period.month, version])

  return pending
}
