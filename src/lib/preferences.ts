import type { BalanceOptions } from '@/domain/balance'
import { DEFAULT_BALANCE_OPTIONS } from '@/domain/balance'
import { supabase } from './supabase'

// US-101, ADR-047: qué entra en el balance del Resumen, por usuario. Tres booleanos propios, escritos directo
// bajo RLS (C7) como user_setup, sin RPC. Sin fila valen los predeterminados.

export async function fetchBalanceOptions(): Promise<BalanceOptions> {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('balance_loose_debts, balance_reimbursements, balance_pending_subscriptions')
    .maybeSingle()
  if (error) throw error
  if (!data) return DEFAULT_BALANCE_OPTIONS
  return {
    looseDebts: data.balance_loose_debts,
    reimbursements: data.balance_reimbursements,
    pendingSubscriptions: data.balance_pending_subscriptions,
  }
}


/** Guarda una opción. La fila se crea al primer cambio y las demás opciones quedan en su valor actual. */
export async function saveBalanceOption(current: BalanceOptions, option: keyof BalanceOptions, value: boolean): Promise<void> {
  const next = { ...current, [option]: value }
  const { error } = await supabase.from('user_preferences').upsert({
    balance_loose_debts: next.looseDebts,
    balance_reimbursements: next.reimbursements,
    balance_pending_subscriptions: next.pendingSubscriptions,
    updated_at: new Date().toISOString(),
  })
  if (error) throw error
}
