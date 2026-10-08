import { describe, expect, it } from 'vitest'
import { formatPeriod } from '@/domain/period'
import {
  occurrencesEmptyText,
  sortOccurrences,
  subscriptionDeletionNote,
  type SubscriptionOccurrence,
} from '@/domain/subscriptions'

// US-60 (#218): borrar un mes generado por una suscripción.

describe('subscriptionDeletionNote (US-60 CA-3)', () => {
  it('nombra la suscripción y el mes, con el texto exacto del issue', () => {
    expect(subscriptionDeletionNote('Netflix', { year: 2026, month: 10 })).toBe(
      'Este gasto lo cargó la suscripción Netflix. Si lo eliminás, no se vuelve a cargar para octubre 2026.',
    )
  })

  it('usa el mes de la ocurrencia, no el corriente', () => {
    expect(subscriptionDeletionNote('Spotify', { year: 2026, month: 6 })).toContain('para junio 2026.')
  })
})

describe('sortOccurrences (US-60 CA-5)', () => {
  const occurrence = (year: number, month: number, deleted = false): SubscriptionOccurrence => ({
    period: { year, month },
    occurredOn: `${year}-${String(month).padStart(2, '0')}-10`,
    amount: '5000.00',
    currency: 'ARS',
    deleted,
  })

  it('ordena del período más reciente al más viejo y conserva las borradas con su marca', () => {
    const sorted = sortOccurrences([occurrence(2026, 5), occurrence(2026, 8), occurrence(2026, 6, true), occurrence(2025, 12)])
    expect(sorted.map((o) => formatPeriod(o.period))).toEqual(['2026-08', '2026-06', '2026-05', '2025-12'])
    expect(sorted.find((o) => formatPeriod(o.period) === '2026-06')?.deleted).toBe(true)
  })

  it('no modifica la lista recibida', () => {
    const input = [occurrence(2026, 5), occurrence(2026, 8)]
    sortOccurrences(input)
    expect(input.map((o) => formatPeriod(o.period))).toEqual(['2026-05', '2026-08'])
  })
})

describe('occurrencesEmptyText', () => {
  it('con próximo cobro dice cuándo se carga el primero', () => {
    expect(occurrencesEmptyText('2026-10-10')).toBe(
      'Todavía no se cargó ningún gasto. El primero se carga el 10/10/2026.',
    )
  })

  it('sin próximo cobro, solo la primera oración', () => {
    expect(occurrencesEmptyText(null)).toBe('Todavía no se cargó ningún gasto.')
  })
})
