import { beforeEach, describe, expect, it, vi } from 'vitest'

// fetchGeneratedPeriodsBySubscription pide de a páginas de 1000 filas (PostgREST corta ahí, US-62).
const pages: Array<Array<{ subscription_id: string | null; subscription_period: string | null }>> = []
const ranges: Array<[number, number]> = []

vi.mock('@/lib/supabase', () => {
  const query = {
    select: () => query,
    not: () => query,
    order: () => query,
    range: (from: number, to: number) => {
      ranges.push([from, to])
      return Promise.resolve({ data: pages[ranges.length - 1] ?? [], error: null })
    },
  }
  return { supabase: { from: () => query } }
})

import { fetchGeneratedPeriodsBySubscription } from '@/lib/subscriptions'

const row = (subscription: string, month: number) => ({
  subscription_id: subscription,
  subscription_period: `2026-${String(month).padStart(2, '0')}-01`,
})

describe('fetchGeneratedPeriodsBySubscription', () => {
  beforeEach(() => {
    pages.length = 0
    ranges.length = 0
  })

  it('agrupa por suscripción, con los períodos como YYYY-MM', async () => {
    pages.push([row('a', 6), row('a', 7), row('b', 7)])
    const result = await fetchGeneratedPeriodsBySubscription()
    expect([...(result.get('a') ?? [])]).toEqual(['2026-06', '2026-07'])
    expect([...(result.get('b') ?? [])]).toEqual(['2026-07'])
    expect(ranges).toEqual([[0, 999]])
  })

  it('con una página llena pide la siguiente, y corta en la primera incompleta', async () => {
    pages.push(Array.from({ length: 1000 }, () => row('a', 6)), [row('b', 7)])
    const result = await fetchGeneratedPeriodsBySubscription()
    expect(ranges).toEqual([[0, 999], [1000, 1999]])
    expect(result.has('b')).toBe(true)
  })

  it('con una página justo de 1000 pide otra y termina cuando viene vacía', async () => {
    pages.push(Array.from({ length: 1000 }, () => row('a', 6)), [])
    await fetchGeneratedPeriodsBySubscription()
    expect(ranges).toHaveLength(2)
  })

  it('ignora filas sin suscripción o sin período', async () => {
    pages.push([{ subscription_id: null, subscription_period: null }, row('a', 6)])
    const result = await fetchGeneratedPeriodsBySubscription()
    expect([...result.keys()]).toEqual(['a'])
  })
})
