import { describe, expect, it } from 'vitest'
import {
  barHeightPx,
  buildMonthlyFlow,
  buildMonthPace,
  buildUpcomingInstallments,
  daysInPeriod,
  flowMax,
  isFlowEmpty,
  isUpcomingEmpty,
  paceDayPoint,
  paceDirection,
  trendRange,
  upcomingTotal,
  type TrendEntry,
} from '@/domain/dashboardTrends'
import { Decimal } from '@/domain/money'

// Montos ficticios (C14). Período visto: septiembre 2026.
const SEP = { year: 2026, month: 9 }

const entry = (
  period: string,
  amountArs: string,
  o: { type?: 'expense' | 'income'; on?: string; deleted?: boolean; installment?: number } = {},
): TrendEntry => ({
  period,
  installment_number: o.installment ?? 1,
  amount_ars: amountArs,
  transaction: {
    type: o.type ?? 'expense',
    occurred_on: o.on ?? period,
    deleted_at: o.deleted ? '2026-09-16T00:00:00Z' : null,
  },
})

describe('trendRange', () => {
  it('va de 5 meses atrás a 6 meses adelante, cruzando el año', () => {
    expect(trendRange({ year: 2026, month: 2 })).toEqual({ from: { year: 2025, month: 9 }, to: { year: 2026, month: 8 } })
  })
})

describe('buildMonthlyFlow', () => {
  it('devuelve 6 meses de más viejo al visto, con $0,00 en los vacíos', () => {
    const months = buildMonthlyFlow([], SEP)
    expect(months.map((m) => `${m.period.year}-${m.period.month}`)).toEqual([
      '2026-4', '2026-5', '2026-6', '2026-7', '2026-8', '2026-9',
    ])
    expect(months.every((m) => m.expenses.isZero() && m.income.isZero())).toBe(true)
    expect(months.map((m) => m.isCurrent)).toEqual([false, false, false, false, false, true])
    expect(isFlowEmpty(months)).toBe(true)
  })

  it('separa gastos de ingresos y suma con decimales exactos (C2)', () => {
    const months = buildMonthlyFlow(
      [
        entry('2026-09-01', '0.10'),
        entry('2026-09-01', '0.20'),
        entry('2026-09-01', '1000.50', { type: 'income' }),
        entry('2026-08-01', '300.00'),
      ],
      SEP,
    )
    const sep = months[5]
    expect(sep.expenses.toFixed(2)).toBe('0.30') // 0.1 + 0.2 no da 0.30000000000000004
    expect(sep.income.toFixed(2)).toBe('1000.50')
    expect(months[4].expenses.toFixed(2)).toBe('300.00')
    expect(isFlowEmpty(months)).toBe(false)
  })

  it('ignora las transacciones eliminadas (I10) y los meses fuera de la ventana', () => {
    const months = buildMonthlyFlow(
      [entry('2026-09-01', '500.00', { deleted: true }), entry('2026-03-01', '900.00'), entry('2026-10-01', '900.00')],
      SEP,
    )
    expect(isFlowEmpty(months)).toBe(true)
  })

  it('flowMax es el techo común de gastos e ingresos', () => {
    const months = buildMonthlyFlow([entry('2026-09-01', '100.00'), entry('2026-07-01', '900.00', { type: 'income' })], SEP)
    expect(flowMax(months).toFixed(2)).toBe('900.00')
    expect(flowMax([]).toFixed(2)).toBe('0.00')
  })
})

describe('barHeightPx', () => {
  const max = new Decimal('1000')
  it('es proporcional al techo, con 2 px si es cero y al menos 4 si no', () => {
    expect(barHeightPx(new Decimal('1000'), max, 100)).toBe(100)
    expect(barHeightPx(new Decimal('500'), max, 100)).toBe(50)
    expect(barHeightPx(new Decimal('1'), max, 100)).toBe(4)
    expect(barHeightPx(new Decimal('0'), max, 100)).toBe(2)
    expect(barHeightPx(new Decimal('5'), new Decimal('0'), 100)).toBe(2)
  })
})

describe('daysInPeriod', () => {
  it('cuenta los días del mes, bisiestos incluidos', () => {
    expect(daysInPeriod({ year: 2026, month: 2 })).toBe(28)
    expect(daysInPeriod({ year: 2028, month: 2 })).toBe(29)
    expect(daysInPeriod(SEP)).toBe(30)
    expect(daysInPeriod({ year: 2026, month: 12 })).toBe(31)
  })
})

describe('buildMonthPace', () => {
  const entries = [
    // Agosto (31 días): 100 el día 5, 200 el día 20, 50 el día 31.
    entry('2026-08-01', '100.00', { on: '2026-08-05' }),
    entry('2026-08-01', '200.00', { on: '2026-08-20' }),
    entry('2026-08-01', '50.00', { on: '2026-08-31' }),
    // Septiembre: 120 el día 3, 80 el día 10 y una cuota 2 de una compra del 28 de julio: cae el día 1.
    entry('2026-09-01', '120.00', { on: '2026-09-03' }),
    entry('2026-09-01', '80.00', { on: '2026-09-10' }),
    entry('2026-09-01', '40.00', { on: '2026-07-28', installment: 2 }),
    // Un ingreso y un gasto eliminado no cuentan.
    entry('2026-09-01', '9999.00', { type: 'income', on: '2026-09-02' }),
    entry('2026-09-01', '7777.00', { on: '2026-09-02', deleted: true }),
  ]

  it('en el mes en curso corta en hoy y compara con el mes pasado a ese día', () => {
    const pace = buildMonthPace(entries, SEP, '2026-09-12')
    expect(pace.cutoffDay).toBe(12)
    expect(pace.days).toBe(31) // la escala toma el mes más largo
    expect(pace.currentTotal.toFixed(2)).toBe('240.00') // 120 + 80 + la cuota 2, que cae el día 1
    expect(pace.previousAtCutoff.toFixed(2)).toBe('100.00') // agosto al día 12
    expect(pace.previousTotal.toFixed(2)).toBe('350.00')
    expect(pace.delta.toFixed(2)).toBe('140.00')
    expect(pace.hasPrevious).toBe(true)
    expect(pace.hasCurrent).toBe(true)
    expect(pace.points[0].current?.toFixed(2)).toBe('40.00') // día 1: la cuota ya comprometida
    expect(pace.points[2].current?.toFixed(2)).toBe('160.00') // día 3
    expect(pace.points[11].current?.toFixed(2)).toBe('240.00') // día 12
    expect(pace.points[12].current).toBeNull() // día 13: todavía no llegó
    expect(pace.points[30].previous?.toFixed(2)).toBe('350.00') // día 31 del mes anterior
  })

  it('en un mes terminado compara el mes entero', () => {
    const pace = buildMonthPace(entries, SEP, '2026-10-15')
    expect(pace.cutoffDay).toBe(30)
    expect(pace.currentTotal.toFixed(2)).toBe('240.00') // el mes entero: es el total de la tarjeta "Gastado en"
    expect(pace.previousAtCutoff.toFixed(2)).toBe('300.00') // agosto al día 30: sin los 50 del 31
    expect(pace.delta.toFixed(2)).toBe('-60.00')
    expect(pace.points[30].current).toBeNull() // el día 31 no existe en septiembre
  })

  it('un mes futuro no tiene línea', () => {
    const pace = buildMonthPace(entries, SEP, '2026-08-20')
    expect(pace.cutoffDay).toBe(0)
    expect(pace.hasCurrent).toBe(false)
    expect(pace.points.every((p) => p.current === null)).toBe(true)
  })

  it('sin gastos el mes anterior no hay contra qué comparar', () => {
    const pace = buildMonthPace([entry('2026-09-01', '10.00', { on: '2026-09-02' })], SEP, '2026-09-12')
    expect(pace.hasPrevious).toBe(false)
    expect(pace.hasCurrent).toBe(true)
  })

  it('acota la imputación al último día del mes: una compra del 31 que cae en un mes de 30', () => {
    const pace = buildMonthPace([entry('2026-09-01', '60.00', { on: '2026-07-31' })], SEP, '2026-10-01')
    expect(pace.points[29].current?.toFixed(2)).toBe('60.00') // día 30
    expect(pace.currentTotal.toFixed(2)).toBe('60.00')
  })

  it('el mes corto contra el largo: el acumulado de febrero se queda en su total', () => {
    const feb = buildMonthPace(
      [entry('2026-01-01', '100.00', { on: '2026-01-31' }), entry('2026-02-01', '70.00', { on: '2026-02-10' })],
      { year: 2026, month: 2 },
      '2026-02-28',
    )
    expect(feb.days).toBe(31)
    expect(feb.cutoffDay).toBe(28)
    expect(feb.previousAtCutoff.toFixed(2)).toBe('0.00') // enero llega a 100 recién el día 31
    expect(feb.delta.toFixed(2)).toBe('70.00')
  })
})

describe('buildUpcomingInstallments', () => {
  it('devuelve los 6 meses siguientes al visto con lo ya imputado, solo gastos no eliminados', () => {
    const months = buildUpcomingInstallments(
      [
        entry('2026-10-01', '100.00'),
        entry('2026-10-01', '50.50'),
        entry('2026-11-01', '100.00'),
        entry('2026-11-01', '5000.00', { type: 'income' }),
        entry('2026-12-01', '999.00', { deleted: true }),
        entry('2026-09-01', '700.00'), // el mes visto no es "por venir"
        entry('2027-04-01', '1.00'), // fuera de la ventana
      ],
      SEP,
    )
    expect(months.map((m) => `${m.period.year}-${m.period.month}`)).toEqual([
      '2026-10', '2026-11', '2026-12', '2027-1', '2027-2', '2027-3',
    ])
    expect(months.map((m) => m.amount.toFixed(2))).toEqual(['150.50', '100.00', '0.00', '0.00', '0.00', '0.00'])
    expect(upcomingTotal(months).toFixed(2)).toBe('250.50')
    expect(isUpcomingEmpty(months)).toBe(false)
  })

  it('sin cuotas por delante está vacío', () => {
    expect(isUpcomingEmpty(buildUpcomingInstallments([], SEP))).toBe(true)
  })
})

describe('paceDirection y paceDayPoint', () => {
  const base = [
    entry('2026-08-01', '100.00', { on: '2026-08-05' }),
    entry('2026-09-01', '150.00', { on: '2026-09-03' }),
  ]
  it('más, menos, igual o sin comparación', () => {
    expect(paceDirection(buildMonthPace(base, SEP, '2026-09-12'))).toBe('more')
    expect(paceDirection(buildMonthPace([entry('2026-08-01', '300.00', { on: '2026-08-05' }), base[1]], SEP, '2026-09-12'))).toBe('less')
    expect(paceDirection(buildMonthPace([entry('2026-08-01', '150.00', { on: '2026-08-05' }), base[1]], SEP, '2026-09-12'))).toBe('same')
    expect(paceDirection(buildMonthPace([base[1]], SEP, '2026-09-12'))).toBe('none')
    expect(paceDirection(buildMonthPace([base[0]], SEP, '2026-09-12'))).toBe('none')
  })
  it('acota el día a la escala', () => {
    const pace = buildMonthPace(base, SEP, '2026-09-12')
    expect(paceDayPoint(pace, 0).day).toBe(1)
    expect(paceDayPoint(pace, 99).day).toBe(31)
    expect(paceDayPoint(pace, 2.6).day).toBe(3)
  })
})
