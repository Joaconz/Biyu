import { useEffect, useState } from 'react'
import {
  fetchActiveAccounts,
  fetchActiveCategories,
  fetchLastUsedAccountId,
  type Account,
  type Category,
} from '@/lib/catalog'

export type CatalogState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; categories: Category[]; accounts: Account[]; defaultAccountId: string | null }

/** Carga una vez las categorías, cuentas activas y la última cuenta usada (US-07) para el formulario de registro. */
export function useCatalog(): CatalogState {
  const [state, setState] = useState<CatalogState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchActiveCategories(), fetchActiveAccounts(), fetchLastUsedAccountId()])
      .then(([categories, accounts, defaultAccountId]) => {
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
