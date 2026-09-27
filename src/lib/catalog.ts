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

/**
 * Trae todas las categorías del usuario, incluidas las archivadas.
 * Útil para desgloses históricos como el gráfico de categorías del dashboard (US-27).
 */
export async function fetchAllCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, color')
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
