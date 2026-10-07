import { useEffect, useState } from 'react'
import type { DebtRecord } from '@/domain/debts'
import { fetchDebts } from '@/lib/debts'

export type DebtsState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; debts: DebtRecord[] }

/** Carga las deudas; `refresh` las vuelve a pedir sin recargar la página ("Reintentar", US-38 CA-8). */
export function useDebts(): DebtsState & { refresh: () => void } {
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

  return { ...state, refresh: () => setVersion((v) => v + 1) }
}
