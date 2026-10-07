import { useEffect, useState } from 'react'
import type { SubscriptionRecord } from '@/domain/subscriptions'
import { fetchActiveAccounts, fetchActiveCategories, type Account, type Category } from '@/lib/catalog'
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

/** Categorías y cuentas activas para el alta: solo esas se ofrecen (create_subscription rechaza las archivadas). */
export function useSubscriptionCatalog() {
  return useLoad(async () => {
    const [categories, accounts] = await Promise.all([fetchActiveCategories(), fetchActiveAccounts()])
    return { categories, accounts } as { categories: Category[]; accounts: Account[] }
  }, [])
}
