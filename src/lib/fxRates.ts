import { serializeMoney, type Decimal } from '@/domain/money'
import { toDbDate, type Period } from '@/domain/period'
import { supabase } from './supabase'

export interface ReferenceRate {
  period: string // YYYY-MM-01
  arsPerUsd: string // numeric(14,4) viaja como string por PostgREST (C2)
}

export async function listReferenceRates(limit = 12): Promise<ReferenceRate[]> {
  const { data, error } = await supabase
    .from('fx_rates')
    .select('period, ars_per_usd')
    .order('period', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data.map((r) => ({ period: r.period, arsPerUsd: r.ars_per_usd as unknown as string }))
}

// La escritura es una sola RPC; el payload numeric viaja como texto exacto (C2, C4, C6).
export async function upsertReferenceRate(period: Period, arsPerUsd: Decimal): Promise<void> {
  const { error } = await supabase.rpc('upsert_fx_rate', {
    p_period: toDbDate(period),
    p_ars_per_usd: serializeMoney(arsPerUsd) as unknown as number,
  })
  if (error) throw error
}
