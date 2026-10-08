import { useEffect, useRef, useState } from 'react'
import type { Decimal } from '@/domain/money'
import { blockedBySubscription, blockedOccurrences } from '@/domain/subscriptionBlocked'
import { todayInArgentina } from '@/lib/clock'
import { fetchActiveAccounts, fetchActiveCategories, type Account, type Category } from '@/lib/catalog'
import { fetchFxRatesByPeriod } from '@/lib/fxRates'
import {
  fetchGeneratedPeriods,
  fetchGeneratedPeriodsBySubscription,
  fetchLiveTransactionCount,
  fetchSubscription,
  fetchSubscriptions,
} from '@/lib/subscriptions'

export type Loadable<T> = { status: 'loading' } | { status: 'error' } | ({ status: 'ready' } & T)

/**
 * Carga algo una vez y lo vuelve a pedir con `retry` ("Reintentar"). El estado arranca en
 * "loading" cada vez, así la pantalla muestra su texto de carga (US-52 CA-14).
 */
function useLoad<T>(
  load: () => Promise<T>,
  deps: readonly unknown[],
): Loadable<T> & { retry: () => void; refresh: () => void } {
  const [state, setState] = useState<Loadable<T>>({ status: 'loading' })
  const [version, setVersion] = useState(0)
  // `refresh` vuelve a pedir los datos sin pasar por "Cargando…": la pantalla (y un diálogo abierto)
  // no se desmonta después de pausar, reanudar o cancelar (US-56 a US-58).
  const silent = useRef(false)

  useEffect(() => {
    let cancelled = false
    if (!silent.current) setState({ status: 'loading' })
    silent.current = false
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

  return {
    ...state,
    retry: () => setVersion((v) => v + 1),
    refresh: () => {
      silent.current = true
      setVersion((v) => v + 1)
    },
  }
}

/**
 * La lista y, aparte, lo que hace falta para saber cuáles están bloqueadas (US-62): los tipos de cambio
 * y los períodos ya generados. Son un aviso, no la pantalla: si no se pueden leer, la lista se muestra
 * igual, sin marcas (ADR-031).
 */
export function useSubscriptions() {
  return useLoad(async () => {
    const [subscriptions, fxRates, generated] = await Promise.all([
      fetchSubscriptions(),
      fetchFxRatesByPeriod().catch(() => null),
      fetchGeneratedPeriodsBySubscription().catch(() => null),
    ])
    // Un solo "hoy" para toda la pantalla: las marcas y el total tienen que hablar del mismo mes.
    const today = todayInArgentina()
    const blocked = blockedBySubscription(subscriptions, generated, fxRates, today)
    return { subscriptions, blocked, fxRates, today }
  }, [])
}

export function useSubscription(id: string) {
  return useLoad(async () => {
    // Sin los períodos generados solo se pierde el caso R2 de "Próximo cobro": no tira abajo el detalle.
    const [subscription, generated, fxRates, transactionCount] = await Promise.all([
      fetchSubscription(id),
      fetchGeneratedPeriods(id).catch(() => null),
      fetchFxRatesByPeriod().catch(() => null),
      // Solo lo usa el diálogo de cancelar (US-58): sin el conteo el texto no dice cuántos gastos se mantienen.
      fetchLiveTransactionCount(id).catch(() => null),
    ])
    // El aviso de bloqueada (US-62) necesita los períodos generados; sin los tipos de cambio solo se juzga una ARS.
    const blocked =
      subscription && generated ? blockedOccurrences(subscription, generated, fxRates, todayInArgentina()) : []
    // El N del diálogo de cancelar suma las vigentes y los meses vencidos sin generar: sin los períodos
    // generados esos meses se contarían dos veces, así que sin ellos no se promete un número (US-58 CA-5).
    return {
      subscription,
      generatedPeriods: generated ?? new Set<string>(),
      blocked,
      fxRates,
      transactionCount: generated !== null ? transactionCount : null,
    }
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
