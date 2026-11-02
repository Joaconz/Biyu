import { useCallback, useEffect, useState } from 'react'
import type { EditableTransaction } from '@/domain/transactionEdit'
import { fetchActiveAccounts, fetchActiveCategories, type Account, type Category } from '@/lib/catalog'
import { fetchTransactionForEdit } from '@/lib/transactions'

export type TransactionEditState =
  | { status: 'loading' }
  | { status: 'error'; retry: () => void }
  | { status: 'not-found' }
  | { status: 'ready'; transaction: EditableTransaction; categories: Category[]; accounts: Account[] }

/**
 * US-84: el movimiento y las categorías y cuentas activas que hacen falta para editarlo. Espera a las tres
 * lecturas antes de mostrar el formulario; uno ajeno o inexistente es `not-found` (C7), no un error.
 */
export function useTransactionEdit(id: string): TransactionEditState {
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<TransactionEditState>({ status: 'loading' })
  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })
    Promise.all([fetchTransactionForEdit(id), fetchActiveCategories(), fetchActiveAccounts()])
      .then(([transaction, categories, accounts]) => {
        if (cancelled) return
        setState(transaction ? { status: 'ready', transaction, categories, accounts } : { status: 'not-found' })
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error', retry })
      })
    return () => {
      cancelled = true
    }
  }, [id, attempt, retry])

  return state
}
