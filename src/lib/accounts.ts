import { supabase } from './supabase'
import type { Database } from './database.types'

export type Account = Database['public']['Tables']['accounts']['Row']
export type AccountType = Database['public']['Enums']['account_type']
export type AccountCurrency = Database['public']['Enums']['currency_code']

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  credit_card: 'Tarjeta de crédito',
  debit_card: 'Tarjeta de débito',
  cash: 'Efectivo',
  bank_account: 'Cuenta bancaria',
  wallet: 'Billetera virtual',
}

export async function listActiveAccounts(): Promise<Account[]> {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .is('archived_at', null)
    .order('name')
  if (error) throw error
  return data
}

export async function createAccount(input: { name: string; type: AccountType; currency: AccountCurrency }) {
  const { data, error } = await supabase.from('accounts').insert(input).select().single()
  if (error) throw error
  return data
}

// Soft delete (C10): las transacciones históricas conservan account_id sin cambios.
export async function archiveAccount(id: string, archivedAt: string): Promise<void> {
  const { error } = await supabase.from('accounts').update({ archived_at: archivedAt }).eq('id', id)
  if (error) throw error
}

/** DEF-011: nombre y tipo. El trigger de I6 rechaza sacar de credit_card una cuenta con cuotas. */
export async function updateAccount(id: string, changes: { name: string; type: AccountType }): Promise<void> {
  const { error } = await supabase.from('accounts').update(changes).eq('id', id)
  if (error) throw error
}

/** Movimientos que se van con la cuenta si se elimina, para avisarlo en la confirmación. */
export async function countAccountTransactions(id: string): Promise<number> {
  const { count, error } = await supabase
    .from('transactions')
    .select('id', { count: 'exact', head: true })
    .eq('account_id', id)
    .is('deleted_at', null)
  if (error) throw error
  return count ?? 0
}

/**
 * DEF-011, ADR-026: borrado físico de la cuenta con sus transacciones, en una sola RPC (C4).
 * A diferencia de archivar, no deja rastro.
 */
export async function deleteAccount(id: string): Promise<void> {
  const { error } = await supabase.rpc('delete_account', { p_account_id: id })
  if (error) throw error
}

/** El trigger de I6 (DEF-009) avisa en su mensaje; el resto de los errores es genérico. */
export function accountSaveErrorMessage(error: unknown): string {
  const message = (error as { message?: string } | null)?.message ?? ''
  if (message.startsWith('I6:')) return 'Esta cuenta tiene compras en cuotas: tiene que seguir siendo tarjeta de crédito'
  return 'No se pudo guardar la cuenta'
}
