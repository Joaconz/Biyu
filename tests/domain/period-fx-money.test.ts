import { describe, expect, it } from 'vitest'
import { resolveFxRate, validateFxRateInput } from '@/domain/fx'
import { convertToArs, formatArs, formatUsd, parseMoney, serializeMoney } from '@/domain/money'
import {
  addDays,
  addMonths,
  currentPeriod,
  formatDisplayDate,
  formatPeriod,
  formatPeriodLong,
  formatPeriodShort,
  fromDbDate,
  parsePeriod,
  relativeDay,
  toDbDate,
} from '@/domain/period'

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
  it('formatDisplayDate formatea YYYY-MM-DD a DD/MM/AAAA', () => {
    expect(formatDisplayDate('2026-09-15')).toBe('15/09/2026')
  })
})

describe('etiquetas de período (ADR-023)', () => {
  it('nombre largo y corto de los 12 meses, sin depender de Intl', () => {
    expect(formatPeriodLong({ year: 2026, month: 9 })).toBe('septiembre 2026')
    expect(formatPeriodLong({ year: 2027, month: 1 })).toBe('enero 2027')
    expect(formatPeriodShort({ year: 2026, month: 9 })).toBe('sep 2026')
    const shorts = Array.from({ length: 12 }, (_, i) => formatPeriodShort({ year: 2026, month: i + 1 }).slice(0, 3))
    expect(shorts).toEqual(['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'])
  })
})

describe('días relativos (Hoy | Ayer | Otra)', () => {
  it('addDays cruza fin de mes, de año y el 29 de febrero', () => {
    expect(addDays('2026-09-01', -1)).toBe('2026-08-31')
    expect(addDays('2027-01-01', -1)).toBe('2026-12-31')
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29')
  })

  it('relativeDay usa el día local de today (C1)', () => {
    const today = new Date(2026, 8, 28, 22, 30) // 22:30 local: en UTC ya sería el 29
    expect(relativeDay('2026-09-28', today)).toBe('today')
    expect(relativeDay('2026-09-27', today)).toBe('yesterday')
    expect(relativeDay('2026-09-20', today)).toBe('other')
    expect(relativeDay('2026-10-01', new Date(2026, 9, 1))).toBe('today')
    expect(relativeDay('2026-09-30', new Date(2026, 9, 1))).toBe('yesterday')
  })
})

describe('money', () => {
  it('convertToArs redondea half-up', () => {
    expect(convertToArs(parseMoney('100'), parseMoney('1250'))).toEqual(parseMoney('125000'))
    expect(convertToArs(parseMoney('100'), parseMoney('1250.5555'))).toEqual(parseMoney('125055.55'))
    expect(convertToArs(parseMoney('0.01'), parseMoney('1.5'))).toEqual(parseMoney('0.02'))
  })
  it('parseMoney acepta formato argentino y PostgREST', () => {
    expect(parseMoney('1.234,56').eq('1234.56')).toBe(true)
    expect(parseMoney('1234.56').eq('1234.56')).toBe(true)
    expect(parseMoney('10,5').eq('10.5')).toBe(true)
  })
  it('formatea en argentino', () => {
    expect(formatArs(parseMoney('1234567.5'))).toBe('$1.234.567,50')
    expect(formatArs(parseMoney('-50000'))).toBe('-$50.000,00')
    expect(formatArs(parseMoney('0'))).toBe('$0,00')
  })
  it('formatea dólares con el mismo formato', () => {
    expect(formatUsd(parseMoney('1234567.5'))).toBe('US$1.234.567,50')
    expect(formatUsd(parseMoney('33.34'))).toBe('US$33,34')
    expect(formatUsd(parseMoney('-50'))).toBe('-US$50,00')
  })
  it('serializa Decimal como texto exacto para RPC', () => {
    expect(serializeMoney(parseMoney('1400.1234'))).toBe('1400.1234')
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

describe('validateFxRateInput', () => {
  it.each(['', 'texto'])('rechaza el TC inválido %j', (value) => {
    expect(validateFxRateInput(value).rate).toBeNull()
  })
  it.each(['0', '-1'])('rechaza el TC no positivo %j', (value) => {
    expect(validateFxRateInput(value).error).toBe('El tipo de cambio debe ser mayor a cero')
  })
  it('rechaza más de cuatro decimales', () => {
    expect(validateFxRateInput('1400.12345').error).toBe('Usá hasta 4 decimales')
  })
  it('rechaza valores fuera de numeric(14,4)', () => {
    expect(validateFxRateInput('10000000000').error).toBe('El tipo de cambio es demasiado grande')
  })
  it.each(['1.400,5', '1400.1234'])('devuelve Decimal para %j', (value) => {
    const result = validateFxRateInput(value)
    expect(result.error).toBeNull()
    expect(result.rate?.eq(value === '1.400,5' ? '1400.5' : '1400.1234')).toBe(true)
  })
})
