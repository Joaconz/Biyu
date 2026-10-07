import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { todayInArgentina } from '@/lib/clock'
import { Decimal } from '@/domain/money'
import { toIsoDate } from '@/domain/period'
import { computeDueOccurrences } from '@/domain/subscriptions'

// La máquina en UTC, adelantada respecto de Argentina: si todayInArgentina volviera a leer la fecha
// local del dispositivo (lo que descarta ADR-031 §7), estos tests fallan en cualquier máquina.
const originalTz = process.env.TZ
beforeAll(() => {
  process.env.TZ = 'UTC'
})
afterAll(() => {
  if (originalTz === undefined) delete process.env.TZ
  else process.env.TZ = originalTz
})

describe('todayInArgentina (ADR-031 §7)', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('entre las 21 y las 24 h de Argentina sigue siendo hoy, aunque en UTC ya sea mañana', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-07T01:30:00Z')) // 22:30 del 6 en Argentina
    expect(toIsoDate(todayInArgentina())).toBe('2026-10-06')
  })

  it('a la medianoche de Argentina ya es el día siguiente', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-07T03:00:00Z'))
    expect(toIsoDate(todayInArgentina())).toBe('2026-10-07')
  })
})

describe('US-55 CA-5: "hoy" es el de Argentina', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  const s = {
    status: 'active' as const,
    amount: new Decimal('5000'),
    currency: 'ARS' as const,
    billingDay: 28,
    generateFromPeriod: { year: 2026, month: 10 },
    endPeriod: null,
  }

  // 21:00, 22:30 y 23:59:59 del 27 en Argentina: en UTC ya es 28.
  it.each(['2026-10-28T00:00:00Z', '2026-10-28T01:30:00Z', '2026-10-28T02:59:59Z'])(
    'a %s (todavía 27 en Argentina) la del día 28 no se genera',
    (instant) => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(instant))
      expect(computeDueOccurrences(s, new Set(), new Map(), todayInArgentina())).toEqual([])
    },
  )

  it('a las 00:00 del 28 en Argentina sí', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-28T03:00:00Z'))
    expect(computeDueOccurrences(s, new Set(), new Map(), todayInArgentina()).map((o) => o.occurredOn)).toEqual(['2026-10-28'])
  })
})
