import { serializeMoney, type Decimal } from '@/domain/money'
import { toDbDate, type Period } from '@/domain/period'
import { supabase } from './supabase'

export interface ReferenceRate {
  period: string // YYYY-MM-01
  arsPerUsd: string // numeric(14,4) como string, gracias al cast ::text (C2)
}

export async function listReferenceRates(limit = 12): Promise<ReferenceRate[]> {
  const { data, error } = await supabase
    .from('fx_rates')
    // Sin el cast, PostgREST devuelve el numeric como número JSON (C2): mismo criterio que getReferenceRate.
    .select('period, ars_per_usd_text:ars_per_usd::text')
    .order('period', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data.map((r) => ({ period: r.period, arsPerUsd: String(r.ars_per_usd_text) }))
}

/** Devuelve el numeric como string, pedido con ::text (C2); null significa que ese período no tiene TC configurado. */
export async function getReferenceRate(period: Period): Promise<string | null> {
  const { data, error } = await supabase
    .from('fx_rates')
    .select('ars_per_usd_text:ars_per_usd::text')
    .eq('period', toDbDate(period))
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  if (typeof data.ars_per_usd_text !== 'string') {
    throw new TypeError('PostgREST no devolvió el tipo de cambio como texto')
  }
  return data.ars_per_usd_text
}

// La escritura es una sola RPC; el payload numeric viaja como texto exacto (C2, C4, C6).
export async function upsertReferenceRate(period: Period, arsPerUsd: Decimal): Promise<void> {
  const { error } = await supabase.rpc('upsert_fx_rate', {
    p_period: toDbDate(period),
    p_ars_per_usd: serializeMoney(arsPerUsd) as unknown as number,
  })
  if (error) throw error
}
