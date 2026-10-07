import { describe, expect, it } from 'vitest'
import { Decimal } from '@/domain/money'
import {
  blockedMonthsWarning,
  missingFxPeriods,
  pauseSkipsCurrentMonthDay,
  pausedNoticeText,
  periodListText,
} from '@/domain/subscriptionOperations'

// Hoy de los ejemplos de entrega-2/historias/suscripciones.md: 2026-10-06, período corriente octubre 2026.
const TODAY = new Date(2026, 9, 6)
const OCT = { year: 2026, month: 10 }

const schedule = (patch: Partial<Parameters<typeof pauseSkipsCurrentMonthDay>[0]> = {}) => ({
  billingDay: 28,
  generateFromPeriod: { year: 2026, month: 5 },
  endPeriod: null,
  ...patch,
})

describe('pauseSkipsCurrentMonthDay (US-56 CA-11)', () => {
  it('día de cobro 28, hoy 6, sin ocurrencia del mes: dice el día 28', () => {
    expect(pauseSkipsCurrentMonthDay(schedule(), new Set(['2026-09']), TODAY)).toBe(28)
  })

  it('día de cobro 3, hoy 6: ya se cobró (R5), no aparece', () => {
    expect(pauseSkipsCurrentMonthDay(schedule({ billingDay: 3 }), new Set(['2026-09']), TODAY)).toBeNull()
  })

  it('el día de cobro es hoy: ya cuenta como vencido, no aparece', () => {
    expect(pauseSkipsCurrentMonthDay(schedule({ billingDay: 6 }), new Set(), TODAY)).toBeNull()
  })

  it('el mes corriente ya tiene transacción, aunque esté borrada (R2): no aparece', () => {
    expect(pauseSkipsCurrentMonthDay(schedule(), new Set(['2026-10']), TODAY)).toBeNull()
  })

  it('día de cobro 31 en un mes de 30 días: dice 30 (R4)', () => {
    expect(pauseSkipsCurrentMonthDay(schedule({ billingDay: 31 }), new Set(), new Date(2026, 8, 6))).toBe(30)
  })

  it('el período corriente queda fuera de [generate_from_period, end_period] (R1): no aparece', () => {
    expect(pauseSkipsCurrentMonthDay(schedule({ generateFromPeriod: { year: 2026, month: 11 } }), new Set(), TODAY)).toBeNull()
    expect(pauseSkipsCurrentMonthDay(schedule({ endPeriod: { year: 2026, month: 9 } }), new Set(), TODAY)).toBeNull()
  })

  it('el mes de fin es el corriente: todavía entra en el rango', () => {
    expect(pauseSkipsCurrentMonthDay(schedule({ endPeriod: OCT }), new Set(), TODAY)).toBe(28)
  })
})

describe('missingFxPeriods (US-56 CA-10, US-58 CA-10)', () => {
  const usd = {
    status: 'active' as const,
    amount: '10.00',
    currency: 'USD' as const,
    billingDay: 10,
    generateFromPeriod: { year: 2026, month: 6 },
    endPeriod: null,
  }
  const rates = new Map([['2026-06', new Decimal('1200')]])

  it('lista los meses vencidos sin tipo de cambio, del más viejo al más nuevo', () => {
    const periods = missingFxPeriods(usd, new Set(['2026-06']), new Map(), TODAY)
    expect(periods.map((p) => `${p.year}-${p.month}`)).toEqual(['2026-7', '2026-8', '2026-9'])
  })

  it('un mes con tipo de cambio o ya generado no cuenta', () => {
    const periods = missingFxPeriods(usd, new Set(), rates, TODAY)
    expect(periods[0]).toEqual({ year: 2026, month: 7 })
  })

  it('el mes corriente antes del día de cobro no está bloqueado (R5)', () => {
    const periods = missingFxPeriods({ ...usd, billingDay: 20, generateFromPeriod: OCT }, new Set(), new Map(), TODAY)
    expect(periods).toEqual([])
  })

  it('una suscripción en ARS nunca está bloqueada por tipo de cambio', () => {
    expect(missingFxPeriods({ ...usd, currency: 'ARS' }, new Set(), new Map(), TODAY)).toEqual([])
  })

  it('una pausada no está bloqueada (R3)', () => {
    expect(missingFxPeriods({ ...usd, status: 'paused' }, new Set(), new Map(), TODAY)).toEqual([])
  })

  it('USD sin los tipos de cambio leídos: no inventa meses bloqueados', () => {
    expect(missingFxPeriods(usd, new Set(), null, TODAY)).toEqual([])
  })
})

describe('textos de las operaciones', () => {
  it('lista de meses con comas y "y" antes del último', () => {
    expect(periodListText([])).toBe('')
    expect(periodListText([{ year: 2026, month: 7 }])).toBe('julio 2026')
    expect(periodListText([{ year: 2026, month: 7 }, { year: 2026, month: 8 }])).toBe('julio 2026 y agosto 2026')
    expect(periodListText([{ year: 2026, month: 7 }, { year: 2026, month: 8 }, { year: 2026, month: 9 }])).toBe(
      'julio 2026, agosto 2026 y septiembre 2026',
    )
  })

  it('aviso de meses bloqueados al pausar y al cancelar, en singular y plural', () => {
    const july = [{ year: 2026, month: 7 }]
    expect(blockedMonthsWarning(july, 'pausás')).toBe(
      'Julio 2026 no se cargó por falta de tipo de cambio. Si la pausás, ese mes no se va a cargar.',
    )
    expect(blockedMonthsWarning(july, 'cancelás')).toBe(
      'Julio 2026 no se cargó por falta de tipo de cambio. Si la cancelás, ese mes no se va a cargar.',
    )
    expect(blockedMonthsWarning([...july, { year: 2026, month: 8 }], 'pausás')).toBe(
      'Julio 2026 y agosto 2026 no se cargaron por falta de tipo de cambio. Si la pausás, esos meses no se van a cargar.',
    )
    expect(blockedMonthsWarning([], 'pausás')).toBeNull()
  })

  it('aviso de pausa: con y sin gastos atrasados', () => {
    expect(pausedNoticeText(0)).toBe('Suscripción pausada')
    expect(pausedNoticeText(1)).toBe('Suscripción pausada. Antes se cargó 1 gasto vencido.')
    expect(pausedNoticeText(3)).toBe('Suscripción pausada. Antes se cargaron 3 gastos vencidos.')
  })
})
