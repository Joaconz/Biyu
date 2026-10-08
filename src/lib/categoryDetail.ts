import { evolutionStart, type EvolutionEntry } from '@/domain/categoryDetail'
import { toDbDate, type Period } from '@/domain/period'
import { supabase } from './supabase'

export interface CategoryRecord {
  id: string
  name: string
  color: string | null
  archived_at: string | null
}

/**
 * Una categoría del usuario, o null si no existe o es de otro: RLS devuelve 0 filas en los dos casos
 * y el detalle no los distingue (US-73 · CA-19, C7).
 */
export async function fetchCategory(id: string): Promise<CategoryRecord | null> {
  const { data, error } = await supabase.from('categories').select('id, name, color, archived_at').eq('id', id).maybeSingle()
  if (error) throw error
  return data
}

/**
 * Imputaciones de gastos no eliminados de la categoría en los 6 meses que terminan en `period`
 * (US-73, ADR-001, I10). amount_ars viaja como texto (C2).
 */
export async function fetchCategoryEvolution(categoryId: string, period: Period): Promise<EvolutionEntry[]> {
  const { data, error } = await supabase
    .from('ledger_entries')
    .select('period, amount_ars_text:amount_ars::text, transaction:transactions!ledger_entries_transaction_fk!inner (category_id, type, deleted_at)')
    .gte('period', toDbDate(evolutionStart(period)))
    .lte('period', toDbDate(period))
    .eq('transaction.category_id', categoryId)
    .eq('transaction.type', 'expense')
    .is('transaction.deleted_at', null)
  if (error) throw error
  return (data as unknown as Array<{ period: string; amount_ars_text: string }>).map((row) => ({
    period: row.period,
    amount_ars: row.amount_ars_text,
  }))
}
