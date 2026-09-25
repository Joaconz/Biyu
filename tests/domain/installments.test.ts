import { describe, expect, it } from 'vitest'
import { generateLedgerEntries } from '@/domain/installments'
import { Decimal, parseMoney } from '@/domain/money'

const sum = (xs: Decimal[]) => xs.reduce((a, b) => a.plus(b), new Decimal(0))
const P = (year: number, month: number) => ({ year, month })

describe('generateLedgerEntries', () => {
  it('120000 en 12 cuotas: exacto, de 2026-08 a 2027-07', () => {
    const r = generateLedgerEntries(parseMoney('120000'), null, 12, P(2026, 8))
    expect(r).toHaveLength(12)
    expect(r.every((e) => e.amount.eq('10000'))).toBe(true)
    expect(r[0].period).toEqual(P(2026, 8))
    expect(r[11].period).toEqual(P(2027, 7))
    expect(sum(r.map((e) => e.amount)).eq('120000')).toBe(true)
  })

  it('100000 en 3: la última absorbe el resto', () => {
    const r = generateLedgerEntries(parseMoney('100000'), null, 3, P(2026, 8))
    expect(r.map((e) => e.amount.toFixed(2))).toEqual(['33333.33', '33333.33', '33333.34'])
  })

  it('1.00 en 8: la última nunca es menor que las demás (ADR-013)', () => {
    const r = generateLedgerEntries(parseMoney('1.00'), null, 8, P(2026, 1))
    expect(r.slice(0, 7).every((e) => e.amount.eq('0.12'))).toBe(true)
    expect(r[7].amount.toFixed(2)).toBe('0.16')
    expect(r[7].amount.gte(r[0].amount)).toBe(true)
  })

  it('1 cuota es el caso general con N=1', () => {
    const r = generateLedgerEntries(parseMoney('500.50'), null, 1, P(2026, 3))
    expect(r).toHaveLength(1)
    expect(r[0]).toMatchObject({ installmentNumber: 1, period: P(2026, 3) })
    expect(r[0].amount.eq('500.5')).toBe(true)
  })

  it('cruza el año', () => {
    const r = generateLedgerEntries(parseMoney('300'), null, 3, P(2026, 11))
    expect(r.map((e) => e.period)).toEqual([P(2026, 11), P(2026, 12), P(2027, 1)])
  })

  it('USD 100 x 1250.5555 en 3: I1 e I1\' exactos (ejemplo de 04-data-model)', () => {
    const fx = parseMoney('1250.5555')
    const r = generateLedgerEntries(parseMoney('100'), fx, 3, P(2026, 8))
    expect(sum(r.map((e) => e.amount)).eq('100')).toBe(true)
    // convertir cuota a cuota daría 125055.54; el prorrateo del total convertido da 125055.55
    expect(sum(r.map((e) => e.amountArs)).eq('125055.55')).toBe(true)
  })

  it('propiedad: la suma siempre es el total, en ambas series', () => {
    let seed = 42
    const rnd = () => (seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31
    for (let i = 0; i < 300; i++) {
      const amount = new Decimal(Math.floor(rnd() * 10_000_000) + 1).div(100)
      const fx = rnd() < 0.5 ? null : new Decimal(Math.floor(rnd() * 20_000_000) + 1).div(10_000)
      const n = Math.floor(rnd() * 12) + 1
      const r = generateLedgerEntries(amount, fx, n, P(2026, 1))
      expect(sum(r.map((e) => e.amount)).eq(amount)).toBe(true)
      const total = (fx ? amount.times(fx) : amount).toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
      expect(sum(r.map((e) => e.amountArs)).eq(total)).toBe(true)
      expect(r.every((e) => e.amount.gt(0))).toBe(true)
    }
  })

  it('rechaza cantidades de cuotas inválidas', () => {
    expect(() => generateLedgerEntries(parseMoney('10'), null, 0, P(2026, 1))).toThrow(RangeError)
  })
})
