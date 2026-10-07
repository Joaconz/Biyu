import { useEffect, useState } from 'react'
import type { SubscriptionRecord } from '@/domain/subscriptions'
import type { Decimal } from '@/domain/money'
import { fetchActiveAccounts, fetchActiveCategories, type Account, type Category } from '@/lib/catalog'
import { fetchFxRatesByPeriod } from '@/lib/fxRates'
import { fetchGeneratedPeriods, fetchSubscription, fetchSubscriptions } from '@/lib/subscriptions'

export type Loadable<T> = { status: 'loading' } | { status: 'error' } | ({ status: 'ready' } & T)

/**
 * Carga algo una vez y lo vuelve a pedir con `retry` ("Reintentar"). El estado arranca en
 * "loading" cada vez, así la pantalla muestra su texto de carga (US-52 CA-14).
 */
function useLoad<T>(load: () => Promise<T>, deps: readonly unknown[]): Loadable<T> & { retry: () => void } {
  const [state, setState] = useState<Loadable<T>>({ status: 'loading' })
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })
    load()
      .then((value) => {
        if (!cancelled) setState({ status: 'ready', ...value })
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error' })
      })
    return () => {
      cancelled = true
    }
  }, [version, ...deps])

  return { ...state, retry: () => setVersion((v) => v + 1) }
}

export function useSubscriptions() {
  return useLoad(async () => ({ subscriptions: await fetchSubscriptions() }), [])
}

export function useSubscription(id: string) {
  return useLoad(async () => {
    // Sin los períodos generados solo se pierde el caso R2 de "Próximo cobro": no tira abajo el detalle.
    const [subscription, generatedPeriods] = await Promise.all([
      fetchSubscription(id),
      fetchGeneratedPeriods(id).catch(() => new Set<string>()),
    ])
    return { subscription, generatedPeriods }
  }, [id])
}

/**
 * Categorías y cuentas activas para el alta (solo esas se ofrecen: create_subscription rechaza las
 * archivadas) y los tipos de cambio del usuario, que necesita la vista previa del calendario (US-75).
 */
export function useSubscriptionCatalog() {
  return useLoad(async () => {
    const [categories, accounts, fxRates] = await Promise.all([
      fetchActiveCategories(),
      fetchActiveAccounts(),
      // Solo alimenta la vista previa: si falla, el alta sigue disponible (ADR-031: una feature secundaria no bloquea).
      fetchFxRatesByPeriod().catch(() => null),
    ])
    return { categories, accounts, fxRates } as { categories: Category[]; accounts: Account[]; fxRates: Map<string, Decimal> | null }
  }, [])
}
