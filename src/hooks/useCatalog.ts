import { useEffect, useState } from 'react'
import {
  fetchActiveAccounts,
  fetchActiveCategories,
  fetchLastUsedAccountId,
  type Account,
  type Category,
} from '@/lib/catalog'
import { ensureUserSeeded } from '@/lib/seed'

export type CatalogState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; categories: Category[]; accounts: Account[]; defaultAccountId: string | null }

/**
 * Categorías y cuentas activas. Si alguna de las dos vuelve vacía, siembra y relee: es la red de
 * contención de ADR-014. Cubre la siembra fallida y la carrera con /signup, que redirige acá en
 * cuanto hay sesión, antes de que termine su propia llamada a ensureUserSeeded.
 */
async function fetchSeededCatalog(): Promise<[Category[], Account[]]> {
  const read = () => Promise.all([fetchActiveCategories(), fetchActiveAccounts()])
  const [categories, accounts] = await read()
  if (categories.length > 0 && accounts.length > 0) return [categories, accounts]
  await ensureUserSeeded().catch(() => {}) // best-effort, igual que en /signup
  return read()
}

/** Carga una vez las categorías, cuentas activas y la última cuenta usada (US-07) para el formulario de registro. */
export function useCatalog(): CatalogState {
  const [state, setState] = useState<CatalogState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchSeededCatalog(), fetchLastUsedAccountId()])
      .then(([[categories, accounts], defaultAccountId]) => {
        if (!cancelled) setState({ status: 'ready', categories, accounts, defaultAccountId })
      })
      .catch((error: { message?: string }) => {
        if (!cancelled) setState({ status: 'error', message: error.message ?? 'Error desconocido' })
      })
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
