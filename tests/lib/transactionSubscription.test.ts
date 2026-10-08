import { beforeEach, describe, expect, it, vi } from 'vitest'

// US-61 (#219): la marca de suscripción de Movimientos y del Resumen sale de subscription_id (el join
// por transactions_subscription_fk), no del nombre ni de la descripción.
const rows: unknown[] = []
const selects: string[] = []

vi.mock('@/lib/supabase', () => {
  const query = {
    select: (columns: string) => {
      selects.push(columns)
      return query
    },
    eq: () => query,
    is: () => query,
    not: () => query,
    order: () => query,
    limit: () => query,
    then: (resolve: (value: { data: unknown[]; error: null }) => void) => resolve({ data: rows, error: null }),
  }
  return { supabase: { from: () => query } }
})

import { fetchMonthlyTransactions } from '@/lib/dashboard'

function entry(transaction: Record<string, unknown>) {
  return {
    installment_number: 1,
    amount_text: '5000.00',
    amount_ars_text: '5000.00',
    transaction: {
      id: 't1',
      type: 'expense',
      amount_text: '5000.00',
      currency: 'ARS',
      fx_rate_text: null,
      amount_ars_text: '5000.00',
      installments_count: 1,
      occurred_on: '2026-10-10',
      description: 'Netflix',
      deleted_at: null,
      category: null,
      account: null,
      debts: [],
      subscription_period: null,
      subscription: null,
      ...transaction,
    },
  }
}

describe('fetchMonthlyTransactions: suscripción de origen (US-61)', () => {
  beforeEach(() => {
    rows.length = 0
    selects.length = 0
  })

  it('pide la suscripción por su FK, con el nombre actual', async () => {
    await fetchMonthlyTransactions({ year: 2026, month: 10 })
    expect(selects[0]).toContain('subscription:subscriptions!transactions_subscription_fk (id, name)')
  })

  it('con subscription_id devuelve id, nombre actual y período (CA-1, CA-3)', async () => {
    rows.push(entry({ subscription_period: '2026-10-01', subscription: { id: 's1', name: 'Netflix Premium' } }))
    const [tx] = await fetchMonthlyTransactions({ year: 2026, month: 10 })
    expect(tx.subscription).toEqual({ id: 's1', name: 'Netflix Premium', period: '2026-10-01' })
  })

  it('una cargada a mano no tiene marca, aunque su descripción sea el nombre de una suscripción (CA-1)', async () => {
    rows.push(entry({ description: 'Netflix' }))
    const [tx] = await fetchMonthlyTransactions({ year: 2026, month: 10 })
    expect(tx.subscription).toBeNull()
  })
})
