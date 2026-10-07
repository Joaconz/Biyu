import { describe, expect, it } from 'vitest'
import { Decimal } from '@/domain/money'
import { formatPeriod } from '@/domain/period'
import {
  acceptBillingDayInput,
  catchupGeneratedText,
  computeDueOccurrences,
  codePointLength,
  emptySubscriptionForm,
  fieldOfSaveError,
  groupSubscriptions,
  billingDayText,
  endedText,
  isEnded,
  limitCodePoints,
  nextChargeDate,
  nextChargeText,
  occurrenceDate,
  savedNoticeText,
  startPeriodRange,
  statusText,
  subscriptionAmountText,
  validateSubscriptionForm,
  type SubscriptionFormValues,
  type SubscriptionRecord,
  type SubscriptionState,
} from '@/domain/subscriptions'

// Hoy de los ejemplos de entrega-2/historias/suscripciones.md: 2026-10-06, período corriente octubre 2026.
const TODAY = new Date(2026, 9, 6)

function form(patch: Partial<SubscriptionFormValues> = {}): SubscriptionFormValues {
  return {
    ...emptySubscriptionForm(TODAY),
    name: 'Netflix',
    amount: '5.000,00',
    categoryId: 'cat-1',
    accountId: 'acc-1',
    billingDay: '10',
    ...patch,
  }
}

const errorsOf = (patch: Partial<SubscriptionFormValues>) => validateSubscriptionForm(form(patch), TODAY).errors

describe('alta de suscripción: valores iniciales (US-52)', () => {
  it('ARS, sin categoría ni cuenta y con el período corriente como mes de inicio', () => {
    expect(emptySubscriptionForm(TODAY)).toEqual({
      name: '',
      amount: '',
      currency: 'ARS',
      categoryId: '',
      accountId: '',
      billingDay: '',
      startPeriod: '2026-10',
      endPeriod: '',
      description: '',
    })
  })
})

describe('validateSubscriptionForm (US-52 CA-3 a CA-7)', () => {
  it('un formulario completo arma el borrador limpio', () => {
    const { errors, draft } = validateSubscriptionForm(
      form({ name: '  Netflix  ', billingDay: '01', endPeriod: '2027-03', description: '  Plan estándar ' }),
      TODAY,
    )
    expect(errors).toEqual({})
    expect(draft).toMatchObject({
      name: 'Netflix',
      currency: 'ARS',
      billingDay: 1,
      startPeriod: { year: 2026, month: 10 },
      endPeriod: { year: 2027, month: 3 },
      description: 'Plan estándar',
    })
    expect(draft?.amount.toFixed(2)).toBe('5000.00')
  })

  it('descripción vacía o solo espacios queda sin descripción', () => {
    expect(validateSubscriptionForm(form({ description: '   ' }), TODAY).draft?.description).toBeNull()
  })

  it('nombre: vacío o solo espacios, y más de 60 caracteres contados como en Postgres', () => {
    expect(errorsOf({ name: '' }).name).toBe('Escribí un nombre')
    expect(errorsOf({ name: '   ' }).name).toBe('Escribí un nombre')
    expect(errorsOf({ name: 'a'.repeat(60) }).name).toBeUndefined()
    expect(errorsOf({ name: 'a'.repeat(61) }).name).toBe('El nombre admite hasta 60 caracteres')
    // 60 emojis son 120 unidades UTF-16 pero 60 caracteres para char_length.
    expect(errorsOf({ name: '🎬'.repeat(60) }).name).toBeUndefined()
    expect(errorsOf({ name: '🎬'.repeat(61) }).name).toBe('El nombre admite hasta 60 caracteres')
  })

  it('monto: vacío, 0, negativo, más de 2 decimales y el máximo según la moneda', () => {
    expect(errorsOf({ amount: '' }).amount).toBe('El monto debe ser mayor a cero')
    expect(errorsOf({ amount: '0' }).amount).toBe('El monto debe ser mayor a cero')
    expect(errorsOf({ amount: '-5' }).amount).toBe('El monto debe ser mayor a cero')
    expect(errorsOf({ amount: '10,555' }).amount).toBe('El monto admite hasta 2 decimales')
    expect(errorsOf({ amount: '999.999.999.999,99' }).amount).toBeUndefined()
    expect(errorsOf({ amount: '1.000.000.000.000' }).amount).toBe('El monto máximo es $999.999.999.999,99')
    expect(errorsOf({ amount: '1.000.000.000.000', currency: 'USD' }).amount).toBe(
      'El monto máximo es USD 999.999.999.999,99',
    )
  })

  it('categoría y medio de pago obligatorios', () => {
    expect(errorsOf({ categoryId: '' }).categoryId).toBe('Elegí una categoría')
    expect(errorsOf({ accountId: '' }).accountId).toBe('Elegí un medio de pago')
  })

  it('día de cobro (CA-4): 1 y 31 se aceptan, "01" es 1, 0 y 32 se rechazan, vacío pide el día', () => {
    expect(errorsOf({ billingDay: '1' }).billingDay).toBeUndefined()
    expect(errorsOf({ billingDay: '31' }).billingDay).toBeUndefined()
    expect(validateSubscriptionForm(form({ billingDay: '01' }), TODAY).draft?.billingDay).toBe(1)
    expect(errorsOf({ billingDay: '0' }).billingDay).toBe('El día de cobro va de 1 a 31')
    expect(errorsOf({ billingDay: '32' }).billingDay).toBe('El día de cobro va de 1 a 31')
    expect(errorsOf({ billingDay: '' }).billingDay).toBe('Indicá el día de cobro')
  })

  it('mes de inicio (CA-5): de octubre 2024 a octubre 2027, con los bordes incluidos', () => {
    const message = 'El mes de inicio va de octubre 2024 a octubre 2027'
    expect(errorsOf({ startPeriod: '2024-10' }).startPeriod).toBeUndefined()
    expect(errorsOf({ startPeriod: '2027-10' }).startPeriod).toBeUndefined()
    expect(errorsOf({ startPeriod: '2024-09' }).startPeriod).toBe(message)
    expect(errorsOf({ startPeriod: '2027-11' }).startPeriod).toBe(message)
    expect(errorsOf({ startPeriod: '' }).startPeriod).toBe('Elegí el mes de inicio')
  })

  it('el rango del mes de inicio sale de hoy (C1)', () => {
    expect(startPeriodRange(new Date(2027, 0, 31))).toEqual({
      min: { year: 2025, month: 1 },
      max: { year: 2028, month: 1 },
    })
  })

  it('mes de fin: igual al de inicio se acepta; anterior o después de diciembre 2099, no', () => {
    expect(errorsOf({ endPeriod: '2026-10' }).endPeriod).toBeUndefined()
    expect(errorsOf({ endPeriod: '2026-09' }).endPeriod).toBe('El mes de fin no puede ser anterior al de inicio')
    expect(errorsOf({ endPeriod: '2099-12' }).endPeriod).toBeUndefined()
    expect(errorsOf({ endPeriod: '2026-13' }).endPeriod).toBe('Elegí un mes de fin válido o dejalo sin fin')
    expect(errorsOf({ endPeriod: '2100-01' }).endPeriod).toBe('El mes de fin puede ser como máximo diciembre 2099')
  })

  it('descripción de más de 200 caracteres', () => {
    expect(errorsOf({ description: 'x'.repeat(200) }).description).toBeUndefined()
    expect(errorsOf({ description: 'x'.repeat(201) }).description).toBe('La descripción admite hasta 200 caracteres')
  })

  it('con algún error no hay borrador', () => {
    expect(validateSubscriptionForm(form({ billingDay: '' }), TODAY).draft).toBeNull()
  })
})

describe('entrada de texto del alta', () => {
  it('el nombre y la descripción se cortan en puntos de código, no en unidades UTF-16', () => {
    expect(limitCodePoints('a'.repeat(61), 60)).toHaveLength(60)
    expect(codePointLength(limitCodePoints('🎬'.repeat(61), 60))).toBe(60)
    expect(limitCodePoints('Netflix', 60)).toBe('Netflix')
  })

  it('día de cobro: letras, coma y signo menos no se escriben; hasta 2 dígitos (CA-4)', () => {
    expect(acceptBillingDayInput('1', '')).toBe('1')
    expect(acceptBillingDayInput('31', '3')).toBe('31')
    expect(acceptBillingDayInput('311', '31')).toBe('31')
    expect(acceptBillingDayInput('1a', '1')).toBe('1')
    expect(acceptBillingDayInput('1,', '1')).toBe('1')
    expect(acceptBillingDayInput('-', '')).toBe('')
    expect(acceptBillingDayInput('', '1')).toBe('')
  })
})

describe('errores de create_subscription (CA-8, CA-15, CA-16)', () => {
  it('cada rechazo de la RPC va debajo de su campo', () => {
    expect(fieldOfSaveError('Ya tenés una suscripción con ese nombre')).toBe('name')
    expect(fieldOfSaveError('El nombre admite hasta 60 caracteres')).toBe('name')
    expect(fieldOfSaveError('El monto máximo es USD 999.999.999.999,99')).toBe('amount')
    expect(fieldOfSaveError('La categoría no está disponible')).toBe('categoryId')
    expect(fieldOfSaveError('El medio de pago no está disponible')).toBe('accountId')
    expect(fieldOfSaveError('El día de cobro va de 1 a 31')).toBe('billingDay')
    expect(fieldOfSaveError('El mes de inicio va de octubre 2024 a octubre 2027')).toBe('startPeriod')
    expect(fieldOfSaveError('El mes de fin puede ser como máximo diciembre 2099')).toBe('endPeriod')
    expect(fieldOfSaveError('La descripción admite hasta 200 caracteres')).toBe('description')
    expect(fieldOfSaveError('permission denied for function create_subscription')).toBeNull()
  })

  it('aviso al guardar (CA-1), con 1 gasto en singular', () => {
    expect(savedNoticeText(0)).toBe('Suscripción guardada')
    expect(savedNoticeText(1)).toBe('Suscripción guardada. Se cargó 1 gasto vencido.')
    expect(savedNoticeText(3)).toBe('Suscripción guardada. Se cargaron 3 gastos vencidos.')
  })
})

function record(patch: Partial<SubscriptionRecord>): SubscriptionRecord {
  return {
    id: 'sub',
    name: 'Netflix',
    amount: '5000.00',
    currency: 'ARS',
    categoryName: 'Entretenimiento',
    accountName: 'Visa',
    billingDay: 10,
    startPeriod: { year: 2026, month: 5 },
    endPeriod: null,
    generateFromPeriod: { year: 2026, month: 5 },
    status: 'active',
    pausedAt: null,
    cancelledAt: null,
    description: null,
    ...patch,
  }
}

describe('lista de Suscripciones (US-52)', () => {
  it('grupos Activas, Pausadas y Canceladas, solo con filas, por nombre sin distinguir mayúsculas', () => {
    const groups = groupSubscriptions([
      record({ id: '1', name: 'netflix' }),
      record({ id: '2', name: 'Diario', status: 'cancelled', cancelledAt: '2026-09-02T15:00:00Z' }),
      record({ id: '3', name: 'Gimnasio' }),
      record({ id: '4', name: 'Hosting' }),
    ])
    expect(groups.map((g) => g.label)).toEqual(['Activas', 'Canceladas'])
    expect(groups[0].items.map((s) => s.name)).toEqual(['Gimnasio', 'Hosting', 'netflix'])
  })

  it('montos "$5.000,00" y "USD 10,00"', () => {
    expect(subscriptionAmountText('5000.00', 'ARS')).toBe('$5.000,00')
    expect(subscriptionAmountText('10', 'USD')).toBe('USD 10,00')
    expect(subscriptionAmountText('999999999999.99', 'USD')).toBe('USD 999.999.999.999,99')
  })

  it('"Se cobra el día 10" y "Terminó en mayo 2026"', () => {
    expect(billingDayText(10)).toBe('Se cobra el día 10')
    expect(endedText({ year: 2026, month: 5 })).toBe('Terminó en mayo 2026')
  })

  it('terminada: fin anterior al período corriente; el fin en el período corriente todavía no', () => {
    expect(isEnded(record({ endPeriod: { year: 2026, month: 5 } }), TODAY)).toBe(true)
    expect(isEnded(record({ endPeriod: { year: 2026, month: 10 } }), TODAY)).toBe(false)
    expect(isEnded(record({ endPeriod: null }), TODAY)).toBe(false)
  })
})

describe('estado en el detalle (US-52)', () => {
  it('"Activa", "Pausada desde…" y "Cancelada el…" con la fecha de Argentina', () => {
    expect(statusText(record({}))).toBe('Activa')
    expect(statusText(record({ status: 'paused', pausedAt: '2026-10-01T12:00:00Z' }))).toBe('Pausada desde 01/10/2026')
    // 02:30 UTC del 3 de septiembre son las 23:30 del 2 en Argentina.
    expect(statusText(record({ status: 'cancelled', cancelledAt: '2026-09-03T02:30:00Z' }))).toBe('Cancelada el 02/09/2026')
  })

  it('sin la fecha (no debería pasar, I15) igual dice el estado', () => {
    expect(statusText(record({ status: 'paused', pausedAt: null }))).toBe('Pausada')
    expect(statusText(record({ status: 'cancelled', cancelledAt: null }))).toBe('Cancelada')
  })
})

// ---------------------------------------------------------------------------
// Puesta al día (US-53): la misma regla que catch_up_subscriptions, con `today` fijo (C1).
// ---------------------------------------------------------------------------

function state(patch: Partial<SubscriptionState> = {}): SubscriptionState {
  return {
    status: 'active',
    amount: new Decimal('5000'),
    currency: 'ARS',
    billingDay: 10,
    generateFromPeriod: { year: 2026, month: 5 },
    endPeriod: null,
    ...patch,
  }
}

const NONE = new Set<string>()
const NO_RATES = new Map<string, Decimal>()
const due = (s: SubscriptionState, today: Date, generated = NONE, rates = NO_RATES) =>
  computeDueOccurrences(s, generated, rates, today).map((o) => o.occurredOn)

describe('computeDueOccurrences (US-53)', () => {
  it('CA-1: $5.000,00, día 10, desde mayo 2026, al 2026-08-15 → mayo a agosto, el día 10', () => {
    const drafts = computeDueOccurrences(state(), NONE, NO_RATES, new Date(2026, 7, 15))
    expect(drafts.map((d) => d.occurredOn)).toEqual(['2026-05-10', '2026-06-10', '2026-07-10', '2026-08-10'])
    expect(drafts.map((d) => formatPeriod(d.period))).toEqual(['2026-05', '2026-06', '2026-07', '2026-08'])
    expect(drafts.every((d) => d.amount.equals(5000) && d.currency === 'ARS' && d.fxRate === null)).toBe(true)
  })

  it('CA-2 / R2: lo ya generado no se vuelve a proponer, aunque se haya borrado', () => {
    const generated = new Set(['2026-05', '2026-06', '2026-07', '2026-08'])
    expect(due(state(), new Date(2026, 7, 15), generated)).toEqual([])
    expect(due(state(), new Date(2026, 7, 15), new Set(['2026-06']))).toEqual(['2026-05-10', '2026-07-10', '2026-08-10'])
  })

  it('CA-7 / R3: pausada o cancelada no genera nada', () => {
    expect(due(state({ status: 'paused' }), new Date(2026, 7, 15))).toEqual([])
    expect(due(state({ status: 'cancelled' }), new Date(2026, 7, 15))).toEqual([])
  })

  it('CA-8: con fin mayo 2026, desde marzo, al 2026-09-01 → marzo, abril y mayo', () => {
    const s = state({ amount: new Decimal('4000'), billingDay: 5, generateFromPeriod: { year: 2026, month: 3 }, endPeriod: { year: 2026, month: 5 } })
    expect(due(s, new Date(2026, 8, 1))).toEqual(['2026-03-05', '2026-04-05', '2026-05-05'])
  })

  it('CA-9 / I17: nada antes de generate_from_period, después del corriente ni después del fin', () => {
    const s = state({ generateFromPeriod: { year: 2026, month: 7 }, endPeriod: { year: 2026, month: 12 } })
    const periods = computeDueOccurrences(s, NONE, NO_RATES, new Date(2026, 8, 20)).map((d) => formatPeriod(d.period))
    expect(periods).toEqual(['2026-07', '2026-08', '2026-09'])
  })

  it('CA-12: un monto que en pesos se pasa de numeric(14,2) no se genera', () => {
    const s = state({ currency: 'USD', amount: new Decimal('999999999999.99'), generateFromPeriod: { year: 2026, month: 9 } })
    expect(due(s, new Date(2026, 8, 20), NONE, new Map([['2026-09', new Decimal('1250')]]))).toEqual([])
  })

  it('CA-12: un monto que en pesos redondea a $0,00 tampoco; los demás períodos se generan igual', () => {
    const tiny = state({ currency: 'USD', amount: new Decimal('0.01'), billingDay: 1, generateFromPeriod: { year: 2026, month: 8 } })
    const rates = new Map([['2026-08', new Decimal('0.4')], ['2026-09', new Decimal('1250')]])
    expect(due(tiny, new Date(2026, 8, 20), NONE, rates)).toEqual(['2026-09-01'])
    const huge = state({ currency: 'USD', amount: new Decimal('999999999.99'), billingDay: 1, generateFromPeriod: { year: 2026, month: 8 } })
    const split = new Map([['2026-08', new Decimal('1000')], ['2026-09', new Decimal('1001')]])
    expect(due(huge, new Date(2026, 8, 20), NONE, split)).toEqual(['2026-08-01'])
  })

  it('R6: en USD, el período sin tipo de cambio no se genera; los demás sí, con el de su mes', () => {
    const s = state({ currency: 'USD', amount: new Decimal('10'), billingDay: 1, generateFromPeriod: { year: 2026, month: 6 } })
    const drafts = computeDueOccurrences(s, NONE, new Map([['2026-06', new Decimal('1230')]]), new Date(2026, 6, 20))
    expect(drafts.map((d) => [formatPeriod(d.period), d.fxRate?.toFixed(2)])).toEqual([['2026-06', '1230.00']])
  })

  it('CA-13: inicio en el período corriente con el cobro ya pasado → 1; inicio futuro → nada', () => {
    expect(due(state({ generateFromPeriod: { year: 2026, month: 10 }, billingDay: 3 }), TODAY)).toEqual(['2026-10-03'])
    expect(due(state({ generateFromPeriod: { year: 2026, month: 11 } }), TODAY)).toEqual([])
  })

  it('CA-14: fin igual al inicio, los dos en el pasado → exactamente una', () => {
    const s = state({ generateFromPeriod: { year: 2026, month: 2 }, endPeriod: { year: 2026, month: 2 } })
    expect(due(s, TODAY)).toEqual(['2026-02-10'])
  })
})

describe('aviso de la puesta al día (US-53)', () => {
  it('"Se cargaron N gastos de suscripciones", en singular con 1, y sin aviso con 0', () => {
    expect(catchupGeneratedText(0)).toBeNull()
    expect(catchupGeneratedText(1)).toBe('Se cargó 1 gasto de suscripciones')
    expect(catchupGeneratedText(4)).toBe('Se cargaron 4 gastos de suscripciones')
  })
})

// ---------------------------------------------------------------------------
// US-54: el día de cobro que no existe se cobra el último día del mes (R4).
// ---------------------------------------------------------------------------

describe('occurrenceDate y computeDueOccurrences con días que no existen (US-54)', () => {
  it('CA-1: día 31 desde enero 2027 → 31/01, 28/02, 31/03 y 30/04', () => {
    const s = state({ billingDay: 31, generateFromPeriod: { year: 2027, month: 1 } })
    expect(due(s, new Date(2027, 3, 30))).toEqual(['2027-01-31', '2027-02-28', '2027-03-31', '2027-04-30'])
  })

  it('CA-2: día 29 → 29/02/2028 (bisiesto) y 28/02/2027', () => {
    expect(occurrenceDate({ year: 2028, month: 2 }, 29)).toBe('2028-02-29')
    expect(occurrenceDate({ year: 2027, month: 2 }, 29)).toBe('2027-02-28')
  })

  it('CA-3: día 30 → 29/02/2028 y 28/02/2027', () => {
    expect(occurrenceDate({ year: 2028, month: 2 }, 30)).toBe('2028-02-29')
    expect(occurrenceDate({ year: 2027, month: 2 }, 30)).toBe('2027-02-28')
  })

  it('CA-6: día 31 en febrero 2028 (bisiesto) → 29/02/2028', () => {
    expect(occurrenceDate({ year: 2028, month: 2 }, 31)).toBe('2028-02-29')
  })

  it('CA-4: ningún recorte pasa al mes siguiente; día 1 sigue siendo el 1', () => {
    const s = state({ billingDay: 31, generateFromPeriod: { year: 2027, month: 1 } })
    for (const draft of computeDueOccurrences(s, NONE, NO_RATES, new Date(2028, 11, 31))) {
      expect(draft.occurredOn.slice(0, 7)).toBe(formatPeriod(draft.period))
    }
    expect(occurrenceDate({ year: 2027, month: 2 }, 1)).toBe('2027-02-01')
  })
})

describe('Próximo cobro en el detalle (US-54)', () => {
  const sub = (patch: Partial<SubscriptionRecord>) => record({ billingDay: 31, generateFromPeriod: { year: 2027, month: 1 }, ...patch })

  it('día 31: la fecha real de cada mes, como la transacción que se va a generar (CA-5)', () => {
    expect(nextChargeText(sub({}), NONE, new Date(2027, 1, 10))).toBe('28/02/2027')
    expect(nextChargeText(sub({}), NONE, new Date(2028, 1, 10))).toBe('29/02/2028')
    expect(nextChargeText(sub({}), NONE, new Date(2027, 3, 1))).toBe('30/04/2027')
    // Coincide con la ocurrencia que propone la puesta al día para ese mes.
    const s = state({ billingDay: 31, generateFromPeriod: { year: 2027, month: 2 } })
    expect(due(s, new Date(2027, 1, 28))).toEqual([nextChargeDate(sub({}), NONE, new Date(2027, 1, 10))])
  })

  it('CA-5 en todos los bordes: para cada día de 2027 y 2028, la puesta al día de ese próximo cobro cae justo ahí', () => {
    for (const billingDay of [1, 28, 29, 30, 31]) {
      const s = state({ billingDay, generateFromPeriod: { year: 2026, month: 12 } })
      for (let day = new Date(2027, 0, 1); day.getFullYear() < 2029; day = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1)) {
        const next = nextChargeDate(sub({ billingDay, generateFromPeriod: s.generateFromPeriod }), NONE, day)
        expect(next).not.toBeNull()
        const [y, m, d] = next!.split('-').map(Number)
        const generated = new Set<string>()
        for (let p = s.generateFromPeriod; p.year * 12 + p.month < y * 12 + m; p = { year: p.month === 12 ? p.year + 1 : p.year, month: (p.month % 12) + 1 }) {
          generated.add(formatPeriod(p))
        }
        expect(due(s, new Date(y, m - 1, d), generated)).toEqual([next])
      }
    }
  })

  it('una que todavía no empezó: el primer cobro de su mes de inicio', () => {
    expect(nextChargeText(sub({}), NONE, new Date(2026, 9, 6))).toBe('31/01/2027')
  })

  it('"—" si está pausada, cancelada o ya pasó su mes de fin', () => {
    const today = new Date(2027, 1, 10)
    expect(nextChargeText(sub({ status: 'paused', pausedAt: '2027-02-01T12:00:00Z' }), NONE, today)).toBe('—')
    expect(nextChargeText(sub({ status: 'cancelled', cancelledAt: '2027-02-01T12:00:00Z' }), NONE, today)).toBe('—')
    expect(nextChargeText(sub({ endPeriod: { year: 2027, month: 1 } }), NONE, today)).toBe('—')
  })

  it('R2: si el mes corriente ya tiene su transacción (aunque esté borrada), el próximo es el del mes siguiente', () => {
    const s = sub({ billingDay: 20, generateFromPeriod: { year: 2026, month: 5 } })
    expect(nextChargeText(s, NONE, new Date(2026, 9, 10))).toBe('20/10/2026')
    expect(nextChargeText(s, new Set(['2026-10']), new Date(2026, 9, 10))).toBe('20/11/2026')
  })

  it('reanudada en el mismo mes (R8): el piso quedó en el siguiente y ese es el próximo cobro', () => {
    const s = sub({ billingDay: 28, generateFromPeriod: { year: 2026, month: 11 } })
    expect(nextChargeText(s, NONE, new Date(2026, 9, 6))).toBe('28/11/2026')
  })

  it('inicio futuro con un fin anterior al piso → "—"', () => {
    const s = sub({ generateFromPeriod: { year: 2027, month: 3 }, endPeriod: { year: 2027, month: 2 } })
    expect(nextChargeText(s, NONE, new Date(2026, 9, 6))).toBe('—')
  })

  it('el mes de fin todavía tiene su cobro; el siguiente ya no', () => {
    expect(nextChargeText(sub({ endPeriod: { year: 2027, month: 2 } }), NONE, new Date(2027, 1, 10))).toBe('28/02/2027')
    expect(nextChargeText(sub({ endPeriod: { year: 2027, month: 2 } }), NONE, new Date(2027, 1, 28))).toBe('—')
  })
})
