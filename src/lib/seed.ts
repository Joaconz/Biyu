import { supabase } from './supabase'

// FR-04 (pre-entrega.md §3): set inicial de categorías y medios de pago para no arrancar
// con una pantalla vacía (US-43).
export const INITIAL_CATEGORIES: ReadonlyArray<{ name: string; color: string }> = [
  { name: 'Comida y supermercado', color: '#f97316' },
  { name: 'Transporte', color: '#3b82f6' },
  { name: 'Servicios', color: '#14b8a6' },
  { name: 'Entretenimiento', color: '#a855f7' },
  { name: 'Salud', color: '#ef4444' },
  { name: 'Educación', color: '#eab308' },
  { name: 'Indumentaria', color: '#ec4899' },
  { name: 'Otros', color: '#64748b' },
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
// cuando la lectura de categorías activas vuelve vacía.
export async function ensureUserSeeded() {
  await Promise.all([seedCategories(), seedAccounts()])
}

async function seedCategories() {
  const { data: existing, error } = await supabase.from('categories').select('name').is('archived_at', null)
  if (error) throw error
  const existingNames = new Set(existing.map((c) => c.name))
  const missing = INITIAL_CATEGORIES.filter((c) => !existingNames.has(c.name))
  if (missing.length === 0) return
  const { error: insertError } = await supabase.from('categories').insert(missing)
  // 23505: una llamada concurrente (otra pestaña) ya insertó el mismo nombre — no es un error real.
  if (insertError && insertError.code !== '23505') throw insertError
}

async function seedAccounts() {
  const { data: existing, error } = await supabase.from('accounts').select('name').is('archived_at', null)
  if (error) throw error
  const existingNames = new Set(existing.map((a) => a.name))
  const missing = INITIAL_ACCOUNTS.filter((a) => !existingNames.has(a.name))
  if (missing.length === 0) return
  const { error: insertError } = await supabase
    .from('accounts')
    .insert(missing.map((a) => ({ ...a, currency: 'ARS' as const })))
  if (insertError && insertError.code !== '23505') throw insertError
}
