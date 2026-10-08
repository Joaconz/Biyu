import { describe, expect, it } from 'vitest'
import { Decimal, formatArs } from '@/domain/money'
import {
  committedCountText,
  committedLabel,
  committedMonthlyTotal,
  committedUsdPendingText,
  type SubscriptionRecord,
} from '@/domain/subscriptions'

// Total mensual comprometido (US-63, ADR-033). Hoy: 2026-10-06, período corriente octubre 2026.
const TODAY = new Date(2026, 9, 6)
const RATE = new Decimal('1250.00')

type Item = Pick<SubscriptionRecord, 'status' | 'amount' | 'currency' | 'generateFromPeriod' | 'endPeriod'>

function item(patch: Partial<Item> = {}): Item {
  return {
    status: 'active',
    amount: '5000.00',
    currency: 'ARS',
    generateFromPeriod: { year: 2026, month: 5 },
    endPeriod: null,
    ...patch,
  }
}

// El tipo de cambio de octubre 2026 (o ninguno); los de otros meses no cuentan.
const total = (items: Item[], rate: Decimal | null = RATE) =>
  committedMonthlyTotal(items, rate ? new Map([['2026-10', rate]]) : new Map(), TODAY)

describe('committedMonthlyTotal (US-63, ADR-033)', () => {
  it('CA-1: $5.000,00 y $2.500,00 ARS activas suman $7.500,00', () => {
    const result = total([item(), item({ amount: '2500.00' })])
    expect(formatArs(result.totalArs)).toBe('$7.500,00')
    expect(result.count).toBe(2)
    expect(result.usdPending).toBeNull()
  })

  it('CA-2: una pausada, una cancelada, una que empieza el mes que viene y una cuyo mes de fin ya pasó no suman', () => {
    const result = total([
      item(),
      item({ status: 'paused', amount: '1000.00' }),
      item({ status: 'cancelled', amount: '2000.00' }),
      item({ generateFromPeriod: { year: 2026, month: 11 }, amount: '3000.00' }),
      item({ endPeriod: { year: 2026, month: 9 }, amount: '4000.00' }),
    ])
    expect(formatArs(result.totalArs)).toBe('$5.000,00')
    expect(result.count).toBe(1)
  })

  it('CA-3: USD 10,00 con tipo de cambio de octubre de 1.250,00 suma $12.500,00', () => {
    const result = total([item({ currency: 'USD', amount: '10.00' })])
    expect(formatArs(result.totalArs)).toBe('$12.500,00')
    expect(result.usdPending).toBeNull()
  })

  it('CA-4: sin tipo de cambio de octubre, la USD no suma en pesos y queda aparte', () => {
    const result = total([item(), item({ currency: 'USD', amount: '10.00' })], null)
    expect(formatArs(result.totalArs)).toBe('$5.000,00')
    expect(result.usdPending?.toFixed()).toBe('10')
    expect(result.count).toBe(2)
  })

  it('solo cuenta el tipo de cambio del período corriente, no el de otros meses (ADR-033)', () => {
    const others = new Map([
      ['2026-09', new Decimal('900')],
      ['2026-11', new Decimal('1500')],
    ])
    const result = committedMonthlyTotal([item({ currency: 'USD', amount: '10.00' })], others, TODAY)
    expect(formatArs(result.totalArs)).toBe('$0,00')
    expect(result.usdPending?.toFixed()).toBe('10')
  })

  it('"+ USD" es la suma de todas las USD sin convertir', () => {
    const result = total([item({ currency: 'USD', amount: '10.00' }), item({ currency: 'USD', amount: '4.50' })], null)
    expect(committedUsdPendingText(result.usdPending as Decimal, result.period)).toBe(
      '+ USD 14,50 sin tipo de cambio de octubre 2026',
    )
  })

  it('CA-5: usa el monto actual de la suscripción (R7), no el de lo ya generado', () => {
    expect(formatArs(total([item({ amount: '6000.00' })]).totalArs)).toBe('$6.000,00')
  })

  it('CA-7: una sola suscripción, USD 10,00, sin tipo de cambio: $0,00, "1 suscripción" y la línea "+ USD"', () => {
    const result = total([item({ currency: 'USD', amount: '10.00' })], null)
    expect(formatArs(result.totalArs)).toBe('$0,00')
    expect(committedCountText(result.count)).toBe('1 suscripción activa este mes')
    expect(committedUsdPendingText(result.usdPending as Decimal, result.period)).toBe(
      '+ USD 10,00 sin tipo de cambio de octubre 2026',
    )
  })

  it('CA-8: una terminada (fin anterior al corriente) no suma; una con fin igual al corriente sí', () => {
    expect(total([item({ endPeriod: { year: 2026, month: 9 } })]).count).toBe(0)
    expect(total([item({ endPeriod: { year: 2026, month: 10 } })]).count).toBe(1)
  })

  it('entra con generate_from_period igual al corriente, y no con uno posterior (R8)', () => {
    expect(total([item({ generateFromPeriod: { year: 2026, month: 10 } })]).count).toBe(1)
    expect(total([item({ generateFromPeriod: { year: 2026, month: 11 } })]).count).toBe(0)
  })

  it('redondea cada USD a 2 decimales (half-up) antes de sumar (ADR-013)', () => {
    // 0,01 USD × 1.254,5 = 12,545 → 12,55; dos así suman 25,10, no 25,09 (la suma de los exactos 25,09 redondeada).
    const result = total([item({ currency: 'USD', amount: '0.01' }), item({ currency: 'USD', amount: '0.01' })], new Decimal('1254.5'))
    expect(result.totalArs.toFixed(2)).toBe('25.10')
  })

  it('montos con centavos suman exactos (C2)', () => {
    const result = total([item({ amount: '0.10' }), item({ amount: '0.20' })])
    expect(result.totalArs.toFixed(2)).toBe('0.30')
  })

  it('sin ninguna que entre: $0,00 y "No tenés suscripciones activas este mes"', () => {
    const result = total([item({ status: 'paused' })])
    expect(formatArs(result.totalArs)).toBe('$0,00')
    expect(result.count).toBe(0)
    expect(result.usdPending).toBeNull()
    expect(committedCountText(result.count)).toBe('No tenés suscripciones activas este mes')
  })

  it('solo entran USD sin tipo de cambio: $0,00, el conteo y la línea "+ USD"', () => {
    const result = total([item({ currency: 'USD', amount: '10.00' }), item({ currency: 'USD', amount: '5.00' })], null)
    expect(formatArs(result.totalArs)).toBe('$0,00')
    expect(committedCountText(result.count)).toBe('2 suscripciones activas este mes')
    expect(result.usdPending?.toFixed()).toBe('15')
  })

  it('el hoy argentino decide el período: el 31 de octubre y el 1 de noviembre cambian el rótulo y lo que entra', () => {
    const lateOctober = committedMonthlyTotal([item({ endPeriod: { year: 2026, month: 10 } })], new Map([['2026-10', RATE]]), new Date(2026, 9, 31))
    expect(lateOctober.count).toBe(1)
    const november = committedMonthlyTotal([item({ endPeriod: { year: 2026, month: 10 } })], new Map([['2026-10', RATE]]), new Date(2026, 10, 1))
    expect(november.count).toBe(0)
    expect(committedLabel(november.period)).toBe('Comprometido en noviembre 2026')
  })

  it('textos: rótulo y conteo en singular y plural', () => {
    expect(committedLabel({ year: 2026, month: 10 })).toBe('Comprometido en octubre 2026')
    expect(committedCountText(1)).toBe('1 suscripción activa este mes')
    expect(committedCountText(4)).toBe('4 suscripciones activas este mes')
  })
})
