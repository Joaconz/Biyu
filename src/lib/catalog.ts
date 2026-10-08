import type { Tables } from './database.types'
import { supabase } from './supabase'

// Categorías y cuentas del usuario para el formulario de registro. RLS (C7) ya filtra por
// user_id; acá solo se sacan las archivadas, que no se ofrecen para registrar (US-06, US-44).

export type Category = Pick<Tables<'categories'>, 'id' | 'name' | 'color'>
export type Account = Pick<Tables<'accounts'>, 'id' | 'name' | 'type' | 'currency'>

export async function fetchActiveCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, color')
    .is('archived_at', null)
    .order('name')
  if (error) throw error
  return data
}

export async function fetchActiveAccounts(): Promise<Account[]> {
  const { data, error } = await supabase
    .from('accounts')
    .select('id, name, type, currency')
    .is('archived_at', null)
    .order('name')
  if (error) throw error
  return data
}

const LAST_ACCOUNT_STORAGE_KEY = 'biyu:last_account_id'

export function getStoredLastAccountId(): string | null {
  try {
    return localStorage.getItem(LAST_ACCOUNT_STORAGE_KEY)
  } catch {
    return null
  }
}

export function setStoredLastAccountId(accountId: string | null): void {
  try {
    if (accountId) {
      localStorage.setItem(LAST_ACCOUNT_STORAGE_KEY, accountId)
    } else {
      localStorage.removeItem(LAST_ACCOUNT_STORAGE_KEY)
    }
  } catch {
    // Si localStorage no está disponible o falla la cuota, no rompemos el flujo
  }
}

/**
 * Trae el ID de la última cuenta usada por el usuario autenticado (US-07).
 * Consulta transactions ordenadas por created_at desc excluyendo borradas (C10). Solo cuentan las
 * guardadas desde Registrar, que son las únicas con request_id (US-70): una importación (US-77 ·
 * CA-5) o una ocurrencia de suscripción no cambian la cuenta precargada.
 * Sin ninguna con request_id (todo lo guardado es anterior a US-70), recurre a localStorage y, si
 * está vacío, a la última transacción de cualquier origen, como antes de US-77.
 */
export async function fetchLastUsedAccountId(): Promise<string | null> {
  try {
    const fromRegister = await lastAccountId(true)
    if (fromRegister) {
      setStoredLastAccountId(fromRegister)
      return fromRegister
    }
    const stored = getStoredLastAccountId()
    if (stored) return stored
    const any = await lastAccountId(false)
    if (any) setStoredLastAccountId(any)
    return any
  } catch {
    // Fallback silencioso al cache local si falla la red
    return getStoredLastAccountId()
  }
}

async function lastAccountId(onlyFromRegister: boolean): Promise<string | null> {
  let query = supabase.from('transactions').select('account_id').is('deleted_at', null)
  if (onlyFromRegister) query = query.not('request_id', 'is', null)
  const { data, error } = await query.order('created_at', { ascending: false }).limit(1).maybeSingle()
  if (error) throw error
  return data?.account_id ?? null
}

