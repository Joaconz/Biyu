import { supabase } from './supabase'
import { seedPlan } from './seedPlan'
import { CATEGORY_PALETTE } from './visuals'

// FR-04 (pre-entrega.md §3): set inicial de categorías y medios de pago para no arrancar
// con una pantalla vacía (US-43).
export const INITIAL_CATEGORIES: ReadonlyArray<{ name: string; color: string }> = [
  { name: 'Comida y supermercado', color: CATEGORY_PALETTE.comida },
  { name: 'Transporte', color: CATEGORY_PALETTE.transporte },
  { name: 'Servicios', color: CATEGORY_PALETTE.servicios },
  { name: 'Entretenimiento', color: CATEGORY_PALETTE.entretenimiento },
  { name: 'Salud', color: CATEGORY_PALETTE.salud },
  { name: 'Educación', color: CATEGORY_PALETTE.educacion },
  { name: 'Indumentaria', color: CATEGORY_PALETTE.indumentaria },
  { name: 'Otros', color: CATEGORY_PALETTE.otros },
]

export const INITIAL_ACCOUNTS: ReadonlyArray<{
  name: string
  type: 'credit_card' | 'debit_card' | 'cash' | 'bank_account' | 'wallet'
}> = [
  { name: 'Tarjeta de crédito', type: 'credit_card' },
  { name: 'Tarjeta de débito', type: 'debit_card' },
  { name: 'Efectivo', type: 'cash' },
  { name: 'Cuenta bancaria', type: 'bank_account' },
  { name: 'Billetera virtual', type: 'wallet' },
]

// ADR-014: siembra idempotente del lado del cliente, sin trigger SECURITY DEFINER.
// Best-effort — se llama desde /signup y, como red de contención, desde /register
// cuando la lectura de categorías o cuentas activas vuelve vacía. Qué sembrar lo decide seedPlan:
// solo a quien nunca tuvo categorías (DEF-010).
export async function ensureUserSeeded() {
  const [categories, accounts] = await Promise.all([
    supabase.from('categories').select('name, archived_at'),
    supabase.from('accounts').select('name'),
  ])
  if (categories.error) throw categories.error
  if (accounts.error) throw accounts.error
  const plan = seedPlan(
    { categories: categories.data.map((c) => ({ name: c.name, archived: c.archived_at !== null })), accounts: accounts.data },
    { categories: INITIAL_CATEGORIES, accounts: INITIAL_ACCOUNTS },
  )
  const inserts = await Promise.all([
    plan.categories.length > 0 ? supabase.from('categories').insert(plan.categories) : { error: null },
    plan.accounts.length > 0
      ? supabase.from('accounts').insert(plan.accounts.map((a) => ({ ...a, currency: 'ARS' as const })))
      : { error: null },
  ])
  for (const { error } of inserts) {
    // 23505: una llamada concurrente (otra pestaña, /signup) ya insertó el mismo nombre — no es un error real.
    if (error && error.code !== '23505') throw error
  }
}
