import { describe, expect, it } from 'vitest'
import { Decimal, formatArs } from '@/domain/money'
import {
  pendingChargesCountText,
  pendingChargesLabel,
  pendingSubscriptionCharges,
  type SubscriptionRecord,
} from '@/domain/subscriptions'

// Suscripciones por cobrar en el Resumen (ADR-045). Hoy: 2026-10-06, período corriente octubre 2026.
const TODAY = new Date(2026, 9, 6)
const OCTOBER = { year: 2026, month: 10 }
const RATE = new Decimal('1250.00')

type Item = Pick<
  SubscriptionRecord,
  'id' | 'status' | 'amount' | 'currency' | 'billingDay' | 'generateFromPeriod' | 'endPeriod'
>

let nextId = 0
function item(patch: Partial<Item> = {}): Item {
  nextId += 1
  return {
    id: `sub-${nextId}`,
    status: 'active',
    amount: '5000.00',
    currency: 'ARS',
    billingDay: 28,
    generateFromPeriod: { year: 2026, month: 5 },
    endPeriod: null,
    ...patch,
  }
}

const none = new Map<string, Set<string>>()
const octoberRate = new Map([['2026-10', RATE]])

describe('pendingSubscriptionCharges (ADR-045)', () => {
  it('suma los cobros del mes corriente cuyo día todavía no llegó', () => {
    const result = pendingSubscriptionCharges([item(), item({ amount: '2500.00', billingDay: 10 })], none, new Map(), OCTOBER, TODAY)
    expect(formatArs(result.totalArs)).toBe('$7.500,00')
    expect(result.count).toBe(2)
    expect(result.usdPending).toBeNull()
  })

  it('el día de cobro es el límite (R5): hoy ya vencido no es pendiente, mañana sí', () => {
    const result = pendingSubscriptionCharges(
      [item({ billingDay: 5 }), item({ billingDay: 6, amount: '100.00' }), item({ billingDay: 7, amount: '200.00' })],
      none,
      new Map(),
      OCTOBER,
      TODAY,
    )
    expect(formatArs(result.totalArs)).toBe('$200,00')
    expect(result.count).toBe(1)
  })

  it('no cuenta el mes que ya tiene su transacción, aunque esté borrada (R2)', () => {
    const generated = item()
    const result = pendingSubscriptionCharges(
      [generated, item({ amount: '1000.00' })],
      new Map([[generated.id, new Set(['2026-10'])]]),
      new Map(),
      OCTOBER,
      TODAY,
    )
    expect(formatArs(result.totalArs)).toBe('$1.000,00')
    expect(result.count).toBe(1)
  })

  it('no cuenta pausadas, canceladas, las que empiezan después ni las que terminaron antes', () => {
    const result = pendingSubscriptionCharges(
      [
        item({ status: 'paused' }),
        item({ status: 'cancelled' }),
        item({ generateFromPeriod: { year: 2026, month: 11 } }),
        item({ endPeriod: { year: 2026, month: 9 } }),
      ],
      none,
      new Map(),
      OCTOBER,
      TODAY,
    )
    expect(result.count).toBe(0)
    expect(formatArs(result.totalArs)).toBe('$0,00')
  })

  it('un mes pasado no tiene nada pendiente', () => {
    const result = pendingSubscriptionCharges([item()], none, new Map(), { year: 2026, month: 9 }, TODAY)
    expect(result.count).toBe(0)
  })

  it('un mes futuro cuenta todas las activas que ya empezaron, cualquiera sea el día', () => {
    const result = pendingSubscriptionCharges([item({ billingDay: 1 }), item({ billingDay: 31 })], none, new Map(), { year: 2026, month: 11 }, TODAY)
    expect(formatArs(result.totalArs)).toBe('$10.000,00')
    expect(result.count).toBe(2)
  })

  it('convierte las USD con el tipo de cambio del período', () => {
    const result = pendingSubscriptionCharges([item({ currency: 'USD', amount: '10.00' })], none, octoberRate, OCTOBER, TODAY)
    expect(formatArs(result.totalArs)).toBe('$12.500,00')
    expect(result.usdPending).toBeNull()
  })

  it('una USD sin tipo de cambio del período se informa aparte y no entra al total', () => {
    const result = pendingSubscriptionCharges(
      [item({ currency: 'USD', amount: '10.00' }), item({ amount: '1000.00' })],
      none,
      new Map([['2026-09', RATE]]),
      OCTOBER,
      TODAY,
    )
    expect(formatArs(result.totalArs)).toBe('$1.000,00')
    expect(result.count).toBe(2)
    expect(result.usdPending?.toFixed(2)).toBe('10.00')
  })

  it('los textos', () => {
    expect(pendingChargesLabel(OCTOBER)).toBe('Suscripciones por cobrar en octubre 2026')
    expect(pendingChargesCountText(1)).toBe('1 cobro que todavía no se cargó')
    expect(pendingChargesCountText(3)).toBe('3 cobros que todavía no se cargaron')
  })
})
