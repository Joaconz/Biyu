import { describe, expect, it } from 'vitest'
import {
  buildEvolution,
  computeCategoryPeriodTotals,
  evolutionStart,
  formatCompactArs,
  isEvolutionEmpty,
  isUuid,
  type EvolutionEntry,
} from '@/domain/categoryDetail'
import { Decimal, formatArs, formatUsd } from '@/domain/money'
import { formatMonthShort, formatPeriod } from '@/domain/period'
import { formatPercentage, type SummaryEntry } from '@/domain/summary'

// Datos de ejemplo de entrega-2/historias/dashboard-categorias.md (US-73). Montos ficticios (C14).
const SEP = { year: 2026, month: 9 }
const COMIDA = 'id-comida'
const INDUMENTARIA = 'id-indumentaria'
const VIAJES = 'id-viajes'
const TRANSPORTE = 'id-transporte'

let seq = 0
const entry = (
  categoryId: string | null,
  amountArs: string,
  o: { period?: string; installment?: number; type?: 'expense' | 'income'; deleted?: boolean; currency?: 'ARS' | 'USD'; amount?: string } = {},
): SummaryEntry => ({
  period: o.period ?? '2026-09-01',
  installment_number: o.installment ?? 1,
  amount: o.amount ?? amountArs,
  amount_ars: amountArs,
  transaction: {
    id: `t${++seq}`,
    type: o.type ?? 'expense',
    currency: o.currency ?? 'ARS',
    category_id: categoryId,
    account_id: 'a1',
    first_period: o.period ?? '2026-09-01',
    deleted_at: o.deleted ? '2026-09-16T00:00:00Z' : null,
  },
})

/** D1 como imputaciones (filas 1 a 16). */
const D1: SummaryEntry[] = [
  entry(COMIDA, '8500.00'),
  entry(COMIDA, '18700.00'),
  entry(COMIDA, '8300.00'),
  entry(COMIDA, '24500.00'),
  entry(TRANSPORTE, '37500.00'),
  entry('id-servicios', '22500.00'),
  entry(INDUMENTARIA, '15000.00', { period: '2026-08-01', installment: 1 }),
  entry(INDUMENTARIA, '15000.00', { installment: 2 }),
  entry(INDUMENTARIA, '15000.00', { period: '2026-10-01', installment: 3 }),
  entry(VIAJES, '15000.00', { currency: 'USD', amount: '10.00' }),
  entry(null, '500000.00', { type: 'income' }),
  entry(COMIDA, '9999.00', { deleted: true }),
  entry(COMIDA, '52000.00', { period: '2026-04-01' }),
  entry(COMIDA, '48500.00', { period: '2026-05-01' }),
  entry(COMIDA, '55000.00', { period: '2026-06-01' }),
  entry(COMIDA, '61200.00', { period: '2026-07-01' }),
  entry(COMIDA, '57800.00', { period: '2026-08-01' }),
  entry(COMIDA, '7000.00', { type: 'income' }),
]

/** Lo que trae la lectura de la evolución: gastos no eliminados de la categoría. */
const evolutionOf = (categoryId: string): EvolutionEntry[] =>
  D1.filter((e) => e.transaction.category_id === categoryId && e.transaction.type === 'expense' && !e.transaction.deleted_at)

const card = (categoryId: string, period = SEP) => {
  const t = computeCategoryPeriodTotals(D1, categoryId, period)
  return {
    amount: formatArs(t.amount),
    percentage: formatPercentage(t.percentage),
    inherited: formatArs(t.inheritedInstallments),
    usd: t.expensesUsd.isZero() ? null : formatUsd(t.expensesUsd),
  }
}

describe('US-73: computeCategoryPeriodTotals', () => {
  it('CA-2/CA-9: Comida y supermercado en septiembre, sin la eliminada ni el ingreso con categoría', () => {
    expect(card(COMIDA)).toEqual({ amount: '$60.000,00', percentage: '40,0 %', inherited: '$0,00', usd: null })
  })

  it('CA-3: el porcentaje es el de la fila del Resumen para las 5 categorías', () => {
    expect([COMIDA, TRANSPORTE, 'id-servicios', INDUMENTARIA, VIAJES].map((id) => card(id).percentage)).toEqual([
      '40,0 %', '25,0 %', '15,0 %', '10,0 %', '10,0 %',
    ])
  })

  it('CA-6: Indumentaria suma solo la cuota 2/3, que es heredada', () => {
    expect(card(INDUMENTARIA)).toMatchObject({ amount: '$15.000,00', percentage: '10,0 %', inherited: '$15.000,00' })
  })

  it('CA-8: Viajes incluye US$10,00 en dólares', () => {
    expect(card(VIAJES)).toMatchObject({ amount: '$15.000,00', usd: 'US$10,00' })
  })

  it('CA-10: Comida y supermercado en agosto es 79,4 %', () => {
    expect(card(COMIDA, { year: 2026, month: 8 })).toMatchObject({ amount: '$57.800,00', percentage: '79,4 %' })
  })

  it('CA-15: un mes sin gastos da $0,00 y 0,0 %', () => {
    expect(card(TRANSPORTE, { year: 2027, month: 3 })).toEqual({ amount: '$0,00', percentage: '0,0 %', inherited: '$0,00', usd: null })
  })
})

describe('US-73: buildEvolution', () => {
  const MAX = 120

  it('CA-5: Comida y supermercado de 2026-04 a 2026-09, con julio como la más alta', () => {
    const bars = buildEvolution(evolutionOf(COMIDA), SEP, MAX)
    expect(bars.map((b) => formatPeriod(b.period))).toEqual(['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09'])
    expect(bars.map((b) => b.amount.toFixed(2))).toEqual(['52000.00', '48500.00', '55000.00', '61200.00', '57800.00', '60000.00'])
    expect(bars.map((b) => formatCompactArs(b.amount))).toEqual([
      '$52,0 mil', '$48,5 mil', '$55,0 mil', '$61,2 mil', '$57,8 mil', '$60,0 mil',
    ])
    expect(bars[3].heightPx).toBe(MAX)
    expect(Math.max(...bars.map((b) => b.heightPx))).toBe(bars[3].heightPx)
  })

  it('CA-7: Indumentaria vale 0 de abril a julio y 15000 en agosto y septiembre; octubre tiene la cuota 3/3', () => {
    const sep = buildEvolution(evolutionOf(INDUMENTARIA), SEP, MAX).map((b) => b.amount.toFixed(2))
    expect(sep).toEqual(['0.00', '0.00', '0.00', '0.00', '15000.00', '15000.00'])
    const oct = buildEvolution(evolutionOf(INDUMENTARIA), { year: 2026, month: 10 }, MAX)
    expect(oct[5].amount.toFixed(2)).toBe('15000.00')
  })

  it('rótulos de los meses debajo de las barras', () => {
    expect(buildEvolution([], SEP, 120).map((b) => formatMonthShort(b.period))).toEqual(['abr', 'may', 'jun', 'jul', 'ago', 'sep'])
  })

  it('CA-10: en agosto las barras van de 2026-03 a 2026-08', () => {
    expect(formatPeriod(evolutionStart({ year: 2026, month: 8 }))).toBe('2026-03')
  })

  it('CA-15: Transporte de 2026-10 a 2027-03 está todo en cero', () => {
    const bars = buildEvolution(evolutionOf(TRANSPORTE), { year: 2027, month: 3 }, MAX)
    expect(bars.map((b) => formatPeriod(b.period))).toEqual(['2026-10', '2026-11', '2026-12', '2027-01', '2027-02', '2027-03'])
    expect(bars.every((b) => b.heightPx === 2)).toBe(true)
    expect(isEvolutionEmpty(bars)).toBe(true)
  })

  it('CA-16: D6 en 2026-10, septiembre mide más de 4 px y el resto 2 px', () => {
    const bars = buildEvolution([{ period: '2026-09-01', amount_ars: '5000.00' }], { year: 2026, month: 10 }, MAX)
    expect(bars.map((b) => b.heightPx)).toEqual([2, 2, 2, 2, MAX, 2])
    expect(isEvolutionEmpty(bars)).toBe(false)
  })

  it('un monto chico al lado de uno grande mide al menos 4 px', () => {
    const bars = buildEvolution(
      [{ period: '2026-09-01', amount_ars: '1000000.00' }, { period: '2026-08-01', amount_ars: '1.00' }],
      SEP,
      MAX,
    )
    expect(bars[4].heightPx).toBe(4)
  })
})

describe('US-73: formatCompactArs (CA-23)', () => {
  it.each([
    ['950.00', '$950'],
    ['999.50', '$1.000'],
    ['0.00', '$0'],
    ['48500.00', '$48,5 mil'],
    ['52000.00', '$52,0 mil'],
    ['999949.99', '$999,9 mil'],
    ['999950.00', '$1,0 M'],
    ['1250000.00', '$1,3 M'],
    ['1234567890.00', '$1.234,6 M'],
  ])('%s → %s', (amount, expected) => {
    expect(formatCompactArs(new Decimal(amount))).toBe(expected)
  })
})

describe('US-73: isUuid', () => {
  it('CA-17/CA-18: el UUID en cero es válido (se consulta y no existe); "hola" no se consulta', () => {
    expect(isUuid('00000000-0000-0000-0000-000000000000')).toBe(true)
    expect(isUuid('d64fa698-af15-4231-bb9b-3192f17d1d6e')).toBe(true)
    expect(isUuid('hola')).toBe(false)
    expect(isUuid('')).toBe(false)
  })
})
