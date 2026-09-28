import { useEffect, useState } from 'react'
import { fetchActiveAccounts, fetchActiveCategories, type Account, type Category } from '@/lib/catalog'

export type CatalogState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; categories: Category[]; accounts: Account[] }

/** Carga una vez las categorías y cuentas activas que ofrece el formulario de registro. */
export function useCatalog(): CatalogState {
  const [state, setState] = useState<CatalogState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchActiveCategories(), fetchActiveAccounts()])
      .then(([categories, accounts]) => {
        if (!cancelled) setState({ status: 'ready', categories, accounts })
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
