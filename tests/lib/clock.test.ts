import { afterEach, describe, expect, it, vi } from 'vitest'
import { todayInArgentina } from '@/lib/clock'
import { toIsoDate } from '@/domain/period'

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
