import { describe, expect, it } from 'vitest'
import { buildCategoryPie, categoryPieLabel, type PieSlice } from '@/domain/categoryChart'
import { Decimal } from '@/domain/money'
import { compareCategoryExpenses, computeMonthlySummary, formatPercentage, type SummaryEntry } from '@/domain/summary'

// Datos de ejemplo de entrega-2/historias/dashboard-categorias.md (US-72). Montos ficticios (C14).
const SEP = { year: 2026, month: 9 }

let seq = 0
const expense = (
  category: string,
  amountArs: string,
  o: { period?: string; installment?: number; archived?: boolean; type?: 'expense' | 'income'; deleted?: boolean; currency?: 'ARS' | 'USD'; amount?: string } = {},
): SummaryEntry => ({
  period: o.period ?? '2026-09-01',
  installment_number: o.installment ?? 1,
  amount: o.amount ?? amountArs,
  amount_ars: amountArs,
  transaction: {
    id: `t${++seq}`,
    type: o.type ?? 'expense',
    currency: o.currency ?? 'ARS',
    category_id: `id-${category}`,
    account_id: 'a1',
    first_period: o.period ?? '2026-09-01',
    deleted_at: o.deleted ? '2026-09-16T00:00:00Z' : null,
    category: { id: `id-${category}`, name: category, color: null, archived_at: o.archived ? '2026-09-30T00:00:00Z' : null },
  },
})

/** D1 en las imputaciones que cargaría la UI (filas 1 a 16 de la tabla). */
const D1: SummaryEntry[] = [
  expense('Comida y supermercado', '8500.00'),
  expense('Comida y supermercado', '18700.00'),
  expense('Comida y supermercado', '8300.00'),
  expense('Comida y supermercado', '24500.00'),
  expense('Transporte', '37500.00'),
  expense('Servicios', '22500.00'),
  expense('Indumentaria', '15000.00', { period: '2026-08-01', installment: 1 }),
  expense('Indumentaria', '15000.00', { installment: 2 }),
  expense('Indumentaria', '15000.00', { period: '2026-10-01', installment: 3 }),
  expense('Viajes', '15000.00', { archived: true, currency: 'USD', amount: '10.00' }),
  expense('Sueldo', '500000.00', { type: 'income' }),
  expense('Comida y supermercado', '9999.00', { deleted: true }),
  expense('Comida y supermercado', '57800.00', { period: '2026-08-01' }),
  expense('Comida y supermercado', '7000.00', { type: 'income' }),
]

const set = (rows: [string, string][]): SummaryEntry[] => rows.map(([c, a]) => expense(c, a))
const D2 = set([
  ['Comida y supermercado', '40000'], ['Transporte', '30000'], ['Servicios', '20000'], ['Salud', '15000'],
  ['Educación', '10000'], ['Entretenimiento', '8000'], ['Indumentaria', '5000'], ['Otros', '2000'],
])
const D3 = D2.slice(0, 7)
const D4 = set([
  ['Comida y supermercado', '30000'], ['Transporte', '25000'], ['Servicios', '20000'], ['Salud', '15000'],
  ['Educación', '6000'], ['Entretenimiento', '4000'],
])
const D5 = set([['Transporte', '100'], ['Servicios', '100'], ['Comida y supermercado', '100']])
const D6 = set([['Salud', '5000']])

function pieOf(entries: SummaryEntry[], period = SEP): PieSlice[] {
  const s = computeMonthlySummary(entries, [], period)
  return buildCategoryPie(s.categoryExpenses, s.expenses)
}
const angles = (slices: PieSlice[]) => slices.map((s) => [s.startAngle.toFixed(1), s.endAngle.toFixed(1)])

describe('US-72: buildCategoryPie', () => {
  it('CA-1/CA-7: D1 da 5 porciones en orden, con el empate Indumentaria–Viajes por nombre', () => {
    const pie = pieOf(D1)
    expect(pie.map((s) => s.name)).toEqual(['Comida y supermercado', 'Transporte', 'Servicios', 'Indumentaria', 'Viajes'])
    expect(angles(pie)).toEqual([
      ['0.0', '144.0'], ['144.0', '234.0'], ['234.0', '288.0'], ['288.0', '324.0'], ['324.0', '360.0'],
    ])
  })

  it('CA-2 a CA-6: D1 sin ingresos ni borradas, con la cuota del período y el USD convertido', () => {
    const pie = pieOf(D1)
    expect(pie.map((s) => [s.amount.toFixed(2), s.percentage.toFixed(1)])).toEqual([
      ['60000.00', '40.0'], ['37500.00', '25.0'], ['22500.00', '15.0'], ['15000.00', '10.0'], ['15000.00', '10.0'],
    ])
    expect(pie.some((s) => s.isRest)).toBe(false)
  })

  it('CA-18: D1 en agosto da Comida 79,4 % e Indumentaria 20,6 %', () => {
    const pie = pieOf(D1, { year: 2026, month: 8 })
    expect(pie.map((s) => [s.name, s.amount.toFixed(2), formatPercentage(s.percentage)])).toEqual([
      ['Comida y supermercado', '57800.00', '79,4 %'],
      ['Indumentaria', '15000.00', '20,6 %'],
    ])
  })

  it('CA-19: sin el gasto de $24.500, Transporte pasa primero', () => {
    const pie = pieOf(D1.filter((e) => e.amount_ars !== '24500.00'))
    expect(pie.slice(0, 2).map((s) => [s.name, formatPercentage(s.percentage)])).toEqual([
      ['Transporte', '29,9 %'],
      ['Comida y supermercado', '28,3 %'],
    ])
  })

  it('CA-8: D2 (8 categorías) agrupa 3 en "Resto"', () => {
    const pie = pieOf(D2)
    expect(pie).toHaveLength(6)
    expect(pie.slice(0, 5).map((s) => s.percentage.toFixed(1))).toEqual(['30.8', '23.1', '15.4', '11.5', '7.7'])
    const rest = pie[5]
    expect(rest).toMatchObject({ key: 'rest', isRest: true, count: 3, name: 'Resto (3 categorías)', color: null })
    expect(rest.amount.toFixed(2)).toBe('15000.00')
    expect(rest.percentage.toFixed(1)).toBe('11.5')
    expect(rest.endAngle.toFixed(1)).toBe('360.0')
  })

  it('CA-9/CA-10: D3 (7 categorías, el límite) agrupa 2 y los ángulos salen del monto exacto', () => {
    const pie = pieOf(D3)
    expect(pie).toHaveLength(6)
    expect(pie[5].amount.toFixed(2)).toBe('13000.00')
    expect(pie[5].percentage.toFixed(1)).toBe('10.2')
    expect(pie[5].count).toBe(2)
    expect(pie[0].percentage.toFixed(1)).toBe('31.3') // 31,25 → half-up
    expect(angles(pie).slice(0, 2)).toEqual([['0.0', '112.5'], ['112.5', '196.9']])
  })

  it('CA-11: D4 (6 categorías) no agrupa', () => {
    const pie = pieOf(D4)
    expect(pie).toHaveLength(6)
    expect(pie.some((s) => s.isRest)).toBe(false)
    expect(pie.map((s) => s.percentage.toFixed(1))).toEqual(['30.0', '25.0', '20.0', '15.0', '6.0', '4.0'])
  })

  it('CA-12: D5 tres tercios en orden alfabético, sin ajustar a 100', () => {
    const pie = pieOf(D5)
    expect(pie.map((s) => s.name)).toEqual(['Comida y supermercado', 'Servicios', 'Transporte'])
    expect(pie.map((s) => formatPercentage(s.percentage))).toEqual(['33,3 %', '33,3 %', '33,3 %'])
    expect(angles(pie)).toEqual([['0.0', '120.0'], ['120.0', '240.0'], ['240.0', '360.0']])
  })

  it('CA-13: D6 una sola porción de 0 a 360', () => {
    const pie = pieOf(D6)
    expect(angles(pie)).toEqual([['0.0', '360.0']])
    expect(pie[0].percentage.toFixed(1)).toBe('100.0')
  })

  it('CA-14/CA-15: sin gastos no hay porciones', () => {
    expect(pieOf([expense('Sueldo', '1000', { type: 'income' })])).toEqual([])
    expect(pieOf([])).toEqual([])
  })
})

describe('US-72: categoryPieLabel', () => {
  it('CA-16: texto alternativo de D1 y final con "Resto" en D2', () => {
    expect(categoryPieLabel('septiembre 2026', pieOf(D1))).toBe(
      'Gasto por categoría en septiembre 2026: Comida y supermercado 40,0 %, Transporte 25,0 %, Servicios 15,0 %, Indumentaria 10,0 %, Viajes 10,0 %',
    )
    expect(categoryPieLabel('septiembre 2026', pieOf(D2))).toMatch(/, Resto \(3 categorías\) 11,5 %$/)
  })
})

describe('compareCategoryExpenses: desempate del orden', () => {
  const cat = (id: string, name: string, amount: string, isArchived = false) => ({
    id, name, isArchived, amount: new Decimal(amount),
  })
  it('a igual monto, nombre sin distinguir mayúsculas; a igual nombre, la activa y después el id menor', () => {
    const sorted = [
      cat('b', 'viajes', '10', true),
      cat('c', 'Viajes', '10', true),
      cat('z', 'Viajes', '10'),
      cat('y', 'indumentaria', '10'),
      cat('x', 'Alquiler', '20'),
    ].sort(compareCategoryExpenses)
    expect(sorted.map((c) => c.id)).toEqual(['x', 'y', 'z', 'b', 'c'])
  })
})
