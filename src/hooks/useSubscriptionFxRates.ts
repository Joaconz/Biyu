import { useEffect, useState } from 'react'
import type { Decimal } from '@/domain/money'
import { fetchFxRatesByPeriod } from '@/lib/fxRates'

/**
 * Los tipos de cambio del usuario por `YYYY-MM`, para avisar en el diálogo qué meses de una suscripción
 * en USD no se cargaron (US-56, US-58). Una suscripción en ARS no los necesita. Si no se pueden leer
 * queda en null: es un aviso, no una condición de la operación (ADR-031).
 */
export function useSubscriptionFxRates(needed: boolean): ReadonlyMap<string, Decimal> | null {
  const [rates, setRates] = useState<ReadonlyMap<string, Decimal> | null>(null)

  useEffect(() => {
    if (!needed) return
    let cancelled = false
    fetchFxRatesByPeriod()
      .then((loaded) => {
        if (!cancelled) setRates(loaded)
      })
      .catch(() => {
        if (!cancelled) setRates(null)
      })
    return () => {
      cancelled = true
    }
  }, [needed])

  return rates
}
