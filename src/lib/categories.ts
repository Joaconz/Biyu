import { supabase } from './supabase'
import type { Database } from './database.types'

export type Category = Database['public']['Tables']['categories']['Row']

// Paleta fija en vez de un input de color libre: alcanza para distinguir categorías
// a simple vista y evita validar hex arbitrario en el cliente (C6).
export const CATEGORY_COLOR_PALETTE: readonly string[] = [
  '#f97316',
  '#3b82f6',
  '#14b8a6',
  '#a855f7',
  '#ef4444',
  '#eab308',
  '#ec4899',
  '#64748b',
  '#22c55e',
  '#0ea5e9',
]

export async function listActiveCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .is('archived_at', null)
    .order('name')
  if (error) throw error
  return data
}

export async function createCategory(input: { name: string; color: string }): Promise<Category> {
  const { data, error } = await supabase.from('categories').insert(input).select().single()
  if (error) throw error
  return data
}

export async function updateCategory(id: string, changes: { name?: string; color?: string }): Promise<void> {
  const { error } = await supabase.from('categories').update(changes).eq('id', id)
  if (error) throw error
}

// Soft delete (C10): las transacciones históricas conservan category_id sin cambios.
export async function archiveCategory(id: string, archivedAt: string): Promise<void> {
  const { error } = await supabase.from('categories').update({ archived_at: archivedAt }).eq('id', id)
  if (error) throw error
}
