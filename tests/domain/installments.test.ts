import { describe, expect, it } from 'vitest'
import { generateLedgerEntries, previewInstallments } from '@/domain/installments'
import { Decimal, parseMoney } from '@/domain/money'
import { validateTransactionDraft, type TransactionDraft } from '@/domain/validation'

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

describe('previewInstallments (US-13)', () => {
  const draft: TransactionDraft = {
    type: 'expense', amount: parseMoney('120000'), currency: 'ARS', fxRate: null, categoryId: 'c1',
    accountId: 'visa', accountType: 'credit_card', installmentsCount: 12, occurredOn: '2026-08-15',
  }
  const preview = (patch: Partial<TransactionDraft>) => {
    const d = { ...draft, ...patch }
    return previewInstallments(d, validateTransactionDraft(d, '2026-09-26'))
  }

  it('120000 en 12 desde 2026-08-15: el texto del happy path, sin aclaración', () =>
    expect(preview({})).toEqual({
      summary: '12 cuotas de $10.000,00 — de 2026-08 a 2027-07',
      installments: '12 cuotas de $10.000,00',
      range: 'de 2026-08 a 2027-07',
      lastInstallment: null,
    }))
  it('100000 en 3: la línea muestra la cuota base y aparte la última, que absorbe el resto', () =>
    expect(preview({ amount: parseMoney('100000'), installmentsCount: 3 })).toMatchObject({
      summary: '3 cuotas de $33.333,33 — de 2026-08 a 2026-10',
      lastInstallment: 'La última es de $33.333,34',
    }))
  it('los montos coinciden con generateLedgerEntries (misma regla que la RPC)', () => {
    const entries = generateLedgerEntries(parseMoney('1.00'), null, 8, P(2026, 8))
    expect(preview({ amount: parseMoney('1.00'), installmentsCount: 8 })).toMatchObject({
      summary: '8 cuotas de $0,12 — de 2026-08 a 2027-03',
      lastInstallment: `La última es de $${entries[7].amount.toFixed(2).replace('.', ',')}`,
    })
  })
  it('el período sale de la fecha y cruza el año', () =>
    expect(preview({ installmentsCount: 3, occurredOn: '2025-11-30' })?.summary).toBe(
      '3 cuotas de $40.000,00 — de 2025-11 a 2026-01'))
  it('en USD muestra la moneda original, con o sin tipo de cambio cargado', () => {
    const usd = { currency: 'USD' as const, amount: parseMoney('100'), installmentsCount: 3 }
    const expected = { summary: '3 cuotas de US$33,33 — de 2026-08 a 2026-10', lastInstallment: 'La última es de US$33,34' }
    expect(preview({ ...usd, fxRate: parseMoney('1250.5555') })).toMatchObject(expected)
    expect(preview({ ...usd, fxRate: null })).toMatchObject(expected)
  })
  it('con 1 cuota no hay nada que previsualizar', () => expect(preview({ installmentsCount: 1 })).toBeNull())
  it.each([
    ['sin monto', { amount: null }],
    ['monto cero', { amount: parseMoney('0') }],
    ['más de 2 decimales', { amount: parseMoney('10.005') }],
    ['cuota menor a 0,01', { amount: parseMoney('0.02'), installmentsCount: 3 }],
    ['13 cuotas', { installmentsCount: 13 }],
    ['cuotas sobre efectivo (I6)', { accountType: 'cash' as const }],
    ['fecha malformada', { occurredOn: '15/08/2026' }],
    ['fecha futura', { occurredOn: '2026-11-30' }],
  ])('%s: no muestra nada', (_, patch) => expect(preview(patch)).toBeNull())
})
