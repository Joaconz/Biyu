import { supabase } from './supabase'
import type { Database } from './database.types'
import { addMonths, toDbDate, type Period } from '@/domain/period'
import { CATEGORY_PALETTE } from './visuals'

export type Category = Database['public']['Tables']['categories']['Row']

// Paleta fija en vez de un input de color libre: alcanza para distinguir categorías
// a simple vista y evita validar hex arbitrario en el cliente (C6). Tonos apagados (ADR-023).
export const CATEGORY_COLOR_PALETTE: readonly string[] = Object.values(CATEGORY_PALETTE)

export async function listActiveCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .is('archived_at', null)
    .order('name')
  if (error) throw error
  return data
}

export async function createCategory(input: { name: string; color: string; icon: string | null }): Promise<Category> {
  const { data, error } = await supabase.from('categories').insert(input).select().single()
  if (error) throw error
  return data
}

export async function updateCategory(id: string, changes: { name?: string; color?: string; icon?: string | null }): Promise<void> {
  const { error } = await supabase.from('categories').update(changes).eq('id', id)
  if (error) throw error
}

// Soft delete (C10): las transacciones históricas conservan category_id sin cambios.
export async function archiveCategory(id: string, archivedAt: string): Promise<void> {
  const { error } = await supabase.from('categories').update({ archived_at: archivedAt }).eq('id', id)
  if (error) throw error
}

/** DEF-026: las archivadas, para poder reactivarlas desde Ajustes. */
export async function listArchivedCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .not('archived_at', 'is', null)
    .order('name')
  if (error) throw error
  return data
}

/** DEF-026: deshace archiveCategory. El índice único rechaza si ya hay una activa con ese nombre (DEF-019). */
export async function unarchiveCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').update({ archived_at: null }).eq('id', id)
  if (error) throw error
}

/** US-89: cuántos movimientos (también dados de baja) y suscripciones usan la categoría, para la confirmación. */
export async function countCategoryUsage(id: string): Promise<{ transactions: number; subscriptions: number }> {
  const [tx, subs] = await Promise.all([
    supabase.from('transactions').select('id', { count: 'exact', head: true }).eq('category_id', id),
    supabase.from('subscriptions').select('id', { count: 'exact', head: true }).eq('category_id', id),
  ])
  if (tx.error) throw tx.error
  if (subs.error) throw subs.error
  return { transactions: tx.count ?? 0, subscriptions: subs.count ?? 0 }
}

/**
 * US-89, ADR-044 §5: borrado definitivo de una categoría sin uso, por RPC (C4). Con uso, Postgres rechaza
 * con 23514 y un mensaje que dice cuántos tiene (C6); el cliente solo lo muestra.
 */
export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.rpc('delete_category', { p_category_id: id })
  if (error) throw error
}

/**
 * Cuántos movimientos tiene cada categoría en el mes, para la pantalla de Categorías. Cuenta por `occurred_on` y
 * deja afuera los dados de baja (C10, I10). Devuelve `category_id → cantidad`; las que no aparecen tienen cero.
 */
export async function countCategoryMovementsInPeriod(period: Period): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from('transactions')
    .select('category_id')
    .gte('occurred_on', toDbDate(period))
    .lt('occurred_on', toDbDate(addMonths(period, 1)))
    .is('deleted_at', null)
    .not('category_id', 'is', null)
  if (error) throw error
  const counts: Record<string, number> = {}
  for (const row of data) if (row.category_id) counts[row.category_id] = (counts[row.category_id] ?? 0) + 1
  return counts
}

/** Cuántas categorías activas hay, para la fila de Ajustes («8 activas»). */
export async function countActiveCategories(): Promise<number> {
  const { count, error } = await supabase
    .from('categories')
    .select('id', { count: 'exact', head: true })
    .is('archived_at', null)
  if (error) throw error
  return count ?? 0
}
