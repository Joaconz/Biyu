import { describe, expect, it } from 'vitest'
import { Decimal } from '@/domain/money'
import {
  chargeScheduleTitle,
  defaultScheduleDay,
  committedByCategory,
  committedMonthlyTotal,
  monthChargeSchedule,
  scheduleDayHeading,
  scheduleDayText,
  type ChartSubscription,
} from '@/domain/subscriptions'

// Gráficos de Suscripciones (ADR-053). Hoy: 2026-10-10, período corriente octubre 2026.
const TODAY = new Date(2026, 9, 10)
const OCTOBER = { year: 2026, month: 10 }
const RATE = new Decimal('1250.00')
const octoberRate = new Map([['2026-10', RATE]])

let nextId = 0
function sub(patch: Partial<ChartSubscription> = {}): ChartSubscription {
  nextId += 1
  return {
    id: `sub-${nextId}`,
    name: `Sub ${nextId}`,
    status: 'active',
    amount: '1000.00',
    currency: 'ARS',
    billingDay: 20,
    generateFromPeriod: { year: 2026, month: 5 },
    endPeriod: null,
    categoryId: 'cat-a',
    categoryName: 'Entretenimiento',
    categoryColor: '#6b4e71',
    ...patch,
  }
}

describe('monthChargeSchedule', () => {
  it('arma un día por cada día del mes y ubica cada cobro en su día de cobro', () => {
    const s = monthChargeSchedule([sub({ name: 'Netflix', billingDay: 5 }), sub({ name: 'Spotify', billingDay: 5 })], new Map(), OCTOBER, TODAY)
    expect(s.days).toHaveLength(31)
    expect(s.days[4].charges.map((c) => c.name)).toEqual(['Netflix', 'Spotify'])
    expect(s.days[5].charges).toEqual([])
  })

  it('recorta el día de cobro al último día del mes (R4)', () => {
    const feb = { year: 2027, month: 2 }
    const s = monthChargeSchedule([sub({ billingDay: 31 })], new Map(), feb, new Date(2027, 1, 1))
    expect(s.days).toHaveLength(28)
    expect(s.days[27].charges).toHaveLength(1)
  })

  it('marca como cobrado el día que ya llegó, hoy incluido, y como por cobrar el resto (R5)', () => {
    const s = monthChargeSchedule([sub({ billingDay: 9 }), sub({ billingDay: 10 }), sub({ billingDay: 11 })], new Map(), OCTOBER, TODAY)
    expect(s.days[8].charges[0].charged).toBe(true)
    expect(s.days[9].charges[0].charged).toBe(true)
    expect(s.days[10].charges[0].charged).toBe(false)
    expect(s.todayDay).toBe(10)
    expect(s.days[9].isToday).toBe(true)
    expect(s.days.filter((d) => d.isToday)).toHaveLength(1)
  })

  it('cobrado + por cobrar son el total comprometido del héroe, con USD convertidas', () => {
    const subs = [
      sub({ billingDay: 3, amount: '5000.50' }),
      sub({ billingDay: 25, amount: '10.00', currency: 'USD' }),
      sub({ billingDay: 12, amount: '2500.00' }),
    ]
    const s = monthChargeSchedule(subs, octoberRate, OCTOBER, TODAY)
    const committed = committedMonthlyTotal(subs, octoberRate, TODAY)
    expect(s.charged.totalArs.plus(s.pending.totalArs).toFixed(2)).toBe(committed.totalArs.toFixed(2))
    expect(s.charged.count + s.pending.count).toBe(committed.count)
    expect(s.charged.totalArs.toFixed(2)).toBe('5000.50')
    expect(s.pending.totalArs.toFixed(2)).toBe('15000.00')
  })

  it('una USD sin tipo de cambio del mes no suma pesos y queda aparte', () => {
    const s = monthChargeSchedule([sub({ billingDay: 25, amount: '10.00', currency: 'USD' })], new Map(), OCTOBER, TODAY)
    expect(s.pending.totalArs.toFixed(2)).toBe('0.00')
    expect(s.pending.usdPending?.toFixed(2)).toBe('10.00')
    expect(s.usdPending?.toFixed(2)).toBe('10.00')
    expect(s.pending.count).toBe(1)
    expect(s.days[24].charges[0].amountArs).toBeNull()
  })

  it('deja afuera pausadas, canceladas, las que todavía no empezaron y las que ya terminaron', () => {
    const s = monthChargeSchedule(
      [
        sub({ status: 'paused' }),
        sub({ status: 'cancelled' }),
        sub({ generateFromPeriod: { year: 2026, month: 11 } }),
        sub({ endPeriod: { year: 2026, month: 9 } }),
        sub({ endPeriod: OCTOBER }),
      ],
      new Map(),
      OCTOBER,
      TODAY,
    )
    expect(s.days.flatMap((d) => d.charges)).toHaveLength(1)
  })

  it('el próximo cobro es el primer día por venir del mes; sin ninguno, null', () => {
    const subs = [sub({ billingDay: 4 }), sub({ billingDay: 22 }), sub({ billingDay: 14 })]
    expect(monthChargeSchedule(subs, new Map(), OCTOBER, TODAY).nextChargeDay).toBe(14)
    expect(monthChargeSchedule([sub({ billingDay: 4 })], new Map(), OCTOBER, TODAY).nextChargeDay).toBeNull()
  })

  it('un mes que no es el de hoy no tiene marca de hoy; uno pasado está todo cobrado, uno futuro por cobrar', () => {
    const past = monthChargeSchedule([sub({ billingDay: 28 })], new Map(), { year: 2026, month: 9 }, TODAY)
    expect(past.todayDay).toBeNull()
    expect(past.pending.count).toBe(0)
    expect(past.charged.count).toBe(1)
    const future = monthChargeSchedule([sub({ billingDay: 1 })], new Map(), { year: 2026, month: 11 }, TODAY)
    expect(future.charged.count).toBe(0)
    expect(future.pending.count).toBe(1)
  })

  it('sin suscripciones activas no hay cobros ni totales', () => {
    const s = monthChargeSchedule([], new Map(), OCTOBER, TODAY)
    expect(s.days.every((d) => d.charges.length === 0)).toBe(true)
    expect(s.charged.count + s.pending.count).toBe(0)
    expect(s.nextChargeDay).toBeNull()
  })

  it('no lee el reloj: el mismo `today` da el mismo resultado', () => {
    const subs = [sub({ billingDay: 12 })]
    expect(monthChargeSchedule(subs, new Map(), OCTOBER, TODAY)).toEqual(monthChargeSchedule(subs, new Map(), OCTOBER, new Date(2026, 9, 10)))
  })
})

describe('committedByCategory', () => {
  it('suma por categoría, de mayor a menor, y las filas suman el total del héroe', () => {
    const subs = [
      sub({ categoryId: 'a', categoryName: 'Entretenimiento', amount: '3000.00' }),
      sub({ categoryId: 'a', categoryName: 'Entretenimiento', amount: '1000.00' }),
      sub({ categoryId: 'b', categoryName: 'Servicios', amount: '6000.00', categoryColor: '#4a7a6d' }),
    ]
    const rows = committedByCategory(subs, new Map(), TODAY)
    expect(rows.map((r) => [r.name, r.totalArs.toFixed(2), r.count])).toEqual([
      ['Servicios', '6000.00', 1],
      ['Entretenimiento', '4000.00', 2],
    ])
    expect(rows[0].color).toBe('#4a7a6d')
    expect(rows.map((r) => r.percentage.toFixed(1))).toEqual(['60.0', '40.0'])
    const sum = rows.reduce((acc, r) => acc.plus(r.totalArs), new Decimal(0))
    expect(sum.toFixed(2)).toBe(committedMonthlyTotal(subs, new Map(), TODAY).totalArs.toFixed(2))
  })

  it('convierte las USD con el tipo de cambio del mes y redondea cada una antes de sumar', () => {
    const rows = committedByCategory(
      [sub({ amount: '9.99', currency: 'USD' }), sub({ amount: '1000.00' })],
      octoberRate,
      TODAY,
    )
    expect(rows[0].totalArs.toFixed(2)).toBe('13487.50')
  })

  it('las USD sin tipo de cambio quedan en usdPending y no entran en la barra', () => {
    const rows = committedByCategory(
      [sub({ categoryId: 'a', amount: '10.00', currency: 'USD' }), sub({ categoryId: 'b', categoryName: 'Servicios', amount: '500.00' })],
      new Map(),
      TODAY,
    )
    const a = rows.find((r) => r.categoryId === 'a')!
    expect(a.totalArs.toFixed(2)).toBe('0.00')
    expect(a.usdPending?.toFixed(2)).toBe('10.00')
    expect(a.percentage.toFixed(1)).toBe('0.0')
    expect(rows.find((r) => r.categoryId === 'b')!.percentage.toFixed(1)).toBe('100.0')
  })

  it('ignora las que no entran en el mes y devuelve [] si no queda ninguna', () => {
    expect(committedByCategory([sub({ status: 'paused' }), sub({ status: 'cancelled' })], new Map(), TODAY)).toEqual([])
    expect(committedByCategory([], new Map(), TODAY)).toEqual([])
  })

  it('desempata por nombre y deja el color null si la categoría no lo trae', () => {
    const rows = committedByCategory(
      [
        sub({ categoryId: 'z', categoryName: 'Zeta', categoryColor: undefined }),
        sub({ categoryId: 'a', categoryName: 'Alfa', categoryColor: null }),
      ],
      new Map(),
      TODAY,
    )
    expect(rows.map((r) => r.name)).toEqual(['Alfa', 'Zeta'])
    expect(rows.every((r) => r.color === null)).toBe(true)
  })
})

describe('textos de los gráficos', () => {
  it('el título lleva el mes en minúscula y sin año', () => {
    expect(chargeScheduleTitle(OCTOBER)).toBe('Cobros de octubre')
  })

  it('el texto de un día lista las suscripciones o dice que no hay cobros', () => {
    const s = monthChargeSchedule([sub({ name: 'Netflix', billingDay: 5 })], new Map(), OCTOBER, TODAY)
    expect(scheduleDayText(s.days[4])).toBe('Día 5: Netflix')
    expect(scheduleDayText(s.days[5])).toBe('Día 6: sin cobros')
  })
})

describe('día elegido', () => {
  it('el encabezado dice "Hoy" para hoy y el día de la semana para los demás', () => {
    expect(scheduleDayHeading(OCTOBER, 10, TODAY)).toBe('Hoy')
    expect(scheduleDayHeading(OCTOBER, 28, TODAY)).toBe('miércoles 28 de octubre')
  })

  it('arranca en el próximo cobro o, si ya pasaron todos, en el último; sin cobros, null', () => {
    const ahead = monthChargeSchedule([sub({ billingDay: 4 }), sub({ billingDay: 22 })], new Map(), OCTOBER, TODAY)
    expect(defaultScheduleDay(ahead)).toBe(22)
    const allDone = monthChargeSchedule([sub({ billingDay: 4 }), sub({ billingDay: 8 })], new Map(), OCTOBER, TODAY)
    expect(defaultScheduleDay(allDone)).toBe(8)
    expect(defaultScheduleDay(monthChargeSchedule([], new Map(), OCTOBER, TODAY))).toBeNull()
  })
})
