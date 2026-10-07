import { useCallback, useEffect, useState } from 'react'
import type { DebtRecord } from '@/domain/debts'
import { fetchDebts } from '@/lib/debts'

export type DebtsState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; debts: DebtRecord[] }

/**
 * Carga las deudas; `refresh` las vuelve a pedir sin recargar la página ("Reintentar", US-38 CA-8).
 * `reload` también, pero sin pasar por "Cargando…": la lista y los totales quedan a la vista hasta que
 * llega la nueva (después de saldar, US-39).
 */
export function useDebts(): DebtsState & { refresh: () => void; reload: () => Promise<void> } {
  const [state, setState] = useState<DebtsState>({ status: 'loading' })
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })
    fetchDebts()
      .then((debts) => {
        if (!cancelled) setState({ status: 'ready', debts })
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error' })
      })
    return () => {
      cancelled = true
    }
  }, [version])

  const reload = useCallback(async () => {
    try {
      setState({ status: 'ready', debts: await fetchDebts() })
    } catch {
      setState({ status: 'error' })
    }
  }, [])

  return { ...state, refresh: () => setVersion((v) => v + 1), reload }
}
