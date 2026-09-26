import { describe, expect, it } from 'vitest'
import { resolveFxRate } from '@/domain/fx'
import { convertToArs, formatArs, formatUsd, parseMoney } from '@/domain/money'
import { addMonths, currentPeriod, formatPeriod, fromDbDate, parsePeriod, toDbDate } from '@/domain/period'

describe('period', () => {
  it.each(['2026-13', '2026-00', '26-01', '2026-1', '', 'abcd-ef', '2026-01-01'])('parsePeriod rechaza %j', (v) => {
    expect(parsePeriod(v)).toBeNull()
  })
  it('ida y vuelta con la fecha de Postgres', () => {
    const p = parsePeriod('2026-08')!
    expect(toDbDate(p)).toBe('2026-08-01')
    expect(fromDbDate('2026-08-01')).toEqual(p)
    expect(formatPeriod(p)).toBe('2026-08')
  })
  it.each([
    [{ year: 2026, month: 12 }, 1, { year: 2027, month: 1 }],
    [{ year: 2026, month: 1 }, -1, { year: 2025, month: 12 }],
    [{ year: 2026, month: 8 }, 12, { year: 2027, month: 8 }],
    [{ year: 2026, month: 3 }, -15, { year: 2024, month: 12 }],
  ])('addMonths %j %i', (p, d, expected) => expect(addMonths(p, d)).toEqual(expected))
  it('currentPeriod usa el today recibido', () => {
    expect(currentPeriod(new Date(2026, 1, 28))).toEqual({ year: 2026, month: 2 })
  })
})

describe('money', () => {
  it('convertToArs redondea half-up', () => {
    expect(convertToArs(parseMoney('100'), parseMoney('1250'))).toEqual(parseMoney('125000'))
    expect(convertToArs(parseMoney('0.01'), parseMoney('1.5'))).toEqual(parseMoney('0.02'))
  })
  it('parseMoney acepta formato argentino y PostgREST', () => {
    expect(parseMoney('1.234,56').eq('1234.56')).toBe(true)
    expect(parseMoney('1234.56').eq('1234.56')).toBe(true)
    expect(parseMoney('10,5').eq('10.5')).toBe(true)
  })
  it('formatea en argentino', () => expect(formatArs(parseMoney('1234567.5'))).toBe('$1.234.567,50'))
  it('formatea dólares con el mismo formato', () => {
    expect(formatUsd(parseMoney('1234567.5'))).toBe('US$1.234.567,50')
    expect(formatUsd(parseMoney('33.34'))).toBe('US$33,34')
  })
})

describe('resolveFxRate', () => {
  const ref = parseMoney('1250')
  it('ARS no lleva tipo de cambio', () => expect(resolveFxRate({ currency: 'ARS', referenceRate: ref })).toEqual({ kind: 'none' }))
  it('USD usa la referencia', () => expect(resolveFxRate({ currency: 'USD', referenceRate: ref })).toEqual({ kind: 'rate', value: ref }))
  it('el override pisa la referencia', () => {
    const o = parseMoney('1400')
    expect(resolveFxRate({ currency: 'USD', override: o, referenceRate: ref })).toEqual({ kind: 'rate', value: o })
  })
  it('USD sin ninguno queda missing, sin default', () => expect(resolveFxRate({ currency: 'USD' })).toEqual({ kind: 'missing' }))
})
