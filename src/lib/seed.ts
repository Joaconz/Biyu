import { supabase } from './supabase'
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
// cuando la lectura de categorías activas vuelve vacía.
export async function ensureUserSeeded() {
  await Promise.all([seedCategories(), seedAccounts()])
}

async function seedCategories() {
  const { data: existing, error } = await supabase.from('categories').select('name').is('archived_at', null)
  if (error) throw error
  // Sin distinguir mayúsculas, igual que el índice único (DEF-019): si "salud" ya está activa, no
  // se inserta "Salud", que haría fallar todo el insert con 23505 y dejaría sin sembrar al resto.
  const existingNames = new Set(existing.map((c) => c.name.toLowerCase()))
  const missing = INITIAL_CATEGORIES.filter((c) => !existingNames.has(c.name.toLowerCase()))
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
