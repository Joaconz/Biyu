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
