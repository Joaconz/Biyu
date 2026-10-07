import { describe, expect, it } from 'vitest'
import { Decimal } from '@/domain/money'
import { formatPeriod } from '@/domain/period'
import {
  acceptBillingDayInput,
  buildCalendarPreview,
  catchupGeneratedText,
  computeDueOccurrences,
  evaluateOccurrences,
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
  noMoreChargesText,
  occurrenceDate,
  previewSummaryText,
  upcomingCharges,
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

// ---------------------------------------------------------------------------
// US-55: el mes corriente aparece recién el día del cobro (R5).
// ---------------------------------------------------------------------------

describe('el mes corriente, recién el día del cobro (US-55)', () => {
  const day28 = state({ billingDay: 28, generateFromPeriod: { year: 2026, month: 8 } })
  const pastDone = new Set(['2026-08', '2026-09'])

  it('CA-1: el día 27 no se genera la del mes corriente', () => {
    expect(due(day28, new Date(2026, 9, 27), pastDone)).toEqual([])
  })

  it('CA-2: el día 28 sí', () => {
    expect(due(day28, new Date(2026, 9, 28), pastDone)).toEqual(['2026-10-28'])
  })

  it('CA-3: el día 29 también, si no existía', () => {
    expect(due(day28, new Date(2026, 9, 29), pastDone)).toEqual(['2026-10-28'])
    expect(due(day28, new Date(2026, 9, 29), new Set([...pastDone, '2026-10']))).toEqual([])
  })

  it('CA-4: los períodos anteriores se generan siempre, aunque hoy sea día 1', () => {
    const s = state({ billingDay: 28, generateFromPeriod: { year: 2026, month: 7 } })
    expect(due(s, new Date(2026, 9, 1))).toEqual(['2026-07-28', '2026-08-28', '2026-09-28'])
  })

  it('CA-6: día 31 en un mes de 30 días → se genera el 30, no antes', () => {
    const s = state({ billingDay: 31, generateFromPeriod: { year: 2026, month: 11 } })
    expect(due(s, new Date(2026, 10, 29))).toEqual([])
    expect(due(s, new Date(2026, 10, 30))).toEqual(['2026-11-30'])
    expect(due(s, new Date(2026, 11, 1))).toEqual(['2026-11-30'])
  })

  it('"Próximo cobro": la fecha de este mes mientras no llegue el día, y desde ese día la del siguiente', () => {
    const s = record({ billingDay: 28, generateFromPeriod: { year: 2026, month: 8 } })
    expect(nextChargeText(s, pastDone, new Date(2026, 9, 27))).toBe('28/10/2026')
    expect(nextChargeText(s, pastDone, new Date(2026, 9, 28))).toBe('28/11/2026')
    expect(nextChargeText(s, pastDone, new Date(2026, 9, 29))).toBe('28/11/2026')
    // Lo que se ve después de la puesta al día de ese día: octubre ya generado (R2 + R5).
    expect(nextChargeText(s, new Set([...pastDone, '2026-10']), new Date(2026, 9, 28))).toBe('28/11/2026')
    const s31 = record({ billingDay: 31, generateFromPeriod: { year: 2026, month: 8 } })
    expect(nextChargeText(s31, NONE, new Date(2027, 3, 29))).toBe('30/04/2027')
    expect(nextChargeText(s31, NONE, new Date(2027, 3, 30))).toBe('31/05/2027')
    expect(nextChargeText(s31, NONE, new Date(2027, 4, 1))).toBe('31/05/2027')
  })
})

// ---------------------------------------------------------------------------
// Vista previa del calendario (US-75). Hoy: 2026-10-06.
// ---------------------------------------------------------------------------

const fx = (entries: Record<string, string>) => new Map(Object.entries(entries).map(([k, v]) => [k, new Decimal(v)]))
const NO_FX = new Map<string, Decimal>()
const previewOf = (patch: Partial<SubscriptionFormValues>, rates: ReadonlyMap<string, Decimal> = NO_FX, today = TODAY) => {
  const preview = buildCalendarPreview(form({ startPeriod: '2026-08', ...patch }), rates, today)
  if (preview.kind !== 'ready') throw new Error('se esperaba un calendario')
  return preview
}
const dueOf = (preview: ReturnType<typeof previewOf>) => preview.due.map((r) => `${r.periodKey} ${r.text.split(' · ')[1]}`)
const upcomingOf = (preview: ReturnType<typeof previewOf>) => preview.upcoming.map((r) => `${r.periodKey} ${r.text.split(' · ')[1]}`)

describe('vista previa: qué se carga y qué viene (US-75)', () => {
  it('cada fila dice el mes y la fecha: "agosto 2026 · 10/08/2026"', () => {
    expect(previewOf({}).due[0].text).toBe('agosto 2026 · 10/08/2026')
  })

  it('CA-1: $5.000,00 día 10 desde agosto 2026, sin fin: agosto y septiembre al guardar; octubre a diciembre, próximos', () => {
    const preview = previewOf({})
    expect(dueOf(preview)).toEqual(['2026-08 10/08/2026', '2026-09 10/09/2026'])
    expect(upcomingOf(preview)).toEqual(['2026-10 10/10/2026', '2026-11 10/11/2026', '2026-12 10/12/2026'])
    expect(preview.summary).toBe('Al guardar se cargan 2 gastos de $5.000,00 (total $10.000,00).')
    expect(preview.noMoreText).toBeNull()
  })

  it('CA-2: con día 6 (hoy = día de cobro), octubre pasa a "Se cargan al guardar" (R5)', () => {
    const preview = previewOf({ billingDay: '6' })
    expect(dueOf(preview)).toEqual(['2026-08 06/08/2026', '2026-09 06/09/2026', '2026-10 06/10/2026'])
    expect(upcomingOf(preview)).toEqual(['2026-11 06/11/2026', '2026-12 06/12/2026', '2027-01 06/01/2027'])
    expect(preview.summary).toBe('Al guardar se cargan 3 gastos de $5.000,00 (total $15.000,00).')
  })

  it('el día anterior al de cobro, el período corriente todavía es un próximo cobro', () => {
    const preview = previewOf({ billingDay: '7' })
    expect(dueOf(preview)).toEqual(['2026-08 07/08/2026', '2026-09 07/09/2026'])
    expect(upcomingOf(preview)[0]).toBe('2026-10 07/10/2026')
  })

  it('CA-3: mes de inicio enero 2027: no se carga ningún gasto y los próximos cobros empiezan en enero', () => {
    const preview = previewOf({ startPeriod: '2027-01' })
    expect(preview.due).toEqual([])
    expect(preview.summary).toBe('Al guardar no se carga ningún gasto.')
    expect(upcomingOf(preview)).toEqual(['2027-01 10/01/2027', '2027-02 10/02/2027', '2027-03 10/03/2027'])
  })

  it('CA-4: desde marzo hasta mayo 2026: exactamente marzo, abril y mayo, y "No hay más cobros"', () => {
    const preview = previewOf({ startPeriod: '2026-03', endPeriod: '2026-05' })
    expect(preview.due.map((r) => r.periodKey)).toEqual(['2026-03', '2026-04', '2026-05'])
    expect(preview.upcoming).toEqual([])
    expect(preview.noMoreText).toBe('No hay más cobros: termina en mayo 2026.')
  })

  it('con el fin a la vuelta, los próximos cobros son menos de tres', () => {
    const preview = previewOf({ endPeriod: '2026-11' })
    expect(upcomingOf(preview)).toEqual(['2026-10 10/10/2026', '2026-11 10/11/2026'])
    expect(preview.noMoreText).toBeNull()
  })

  it('un fin igual al período corriente: el cobro de este mes todavía es "próximo" si no llegó el día', () => {
    expect(upcomingOf(previewOf({ endPeriod: '2026-10' }))).toEqual(['2026-10 10/10/2026'])
  })

  it('CA-5: día 31 sigue R4 (30/09/2026 y 28/02/2027)', () => {
    const preview = previewOf({ billingDay: '31', startPeriod: '2026-09' })
    expect(dueOf(preview)).toEqual(['2026-09 30/09/2026'])
    const later = previewOf({ billingDay: '31', startPeriod: '2027-01' })
    expect(upcomingOf(later)).toEqual(['2027-01 31/01/2027', '2027-02 28/02/2027', '2027-03 31/03/2027'])
  })

  it('1 gasto: singular y sin total', () => {
    const preview = previewOf({ startPeriod: '2026-09' })
    expect(preview.summary).toBe('Al guardar se carga 1 gasto de $5.000,00.')
  })

  it('en USD el monto va como "USD 10,00" y el total no se convierte', () => {
    const preview = previewOf({ currency: 'USD', amount: '10,00' }, fx({ '2026-08': '1200', '2026-09': '1250' }))
    expect(preview.summary).toBe('Al guardar se cargan 2 gastos de USD 10,00 (total USD 20,00).')
  })

  it('CA-6: USD sin tipo de cambio de septiembre: esa fila queda bloqueada y no cuenta en el resumen', () => {
    const preview = previewOf({ currency: 'USD', amount: '10,00' }, fx({ '2026-08': '1200' }))
    expect(preview.due.map((r) => [r.periodKey, r.blockedBy])).toEqual([
      ['2026-08', null],
      ['2026-09', 'missing_fx_rate'],
    ])
    expect(preview.summary).toBe('Al guardar se carga 1 gasto de USD 10,00.')
    expect(preview.due[1].blockedText).toBe('Sin tipo de cambio: se carga cuando lo cargues')
    expect(preview.due[0].blockedText).toBeNull()
  })

  it('sin poder leer los tipos de cambio: USD no inventa filas bloqueadas, ARS no los necesita', () => {
    expect(buildCalendarPreview(form({ startPeriod: '2026-08', currency: 'USD', amount: '10,00' }), null, TODAY)).toEqual({ kind: 'fx-unavailable' })
    expect(buildCalendarPreview(form({ startPeriod: '2026-08' }), null, TODAY).kind).toBe('ready')
  })

  it('USD con todos los períodos sin tipo de cambio: ningún gasto, pero las filas se muestran bloqueadas', () => {
    const preview = previewOf({ currency: 'USD', amount: '10,00' })
    expect(preview.summary).toBe('Al guardar no se carga ningún gasto.')
    expect(preview.due.every((r) => r.blockedBy === 'missing_fx_rate')).toBe(true)
  })

  it('un monto en pesos fuera de rango también queda bloqueado, como en el servidor (ADR-030)', () => {
    const preview = previewOf({ currency: 'USD', amount: '999.999.999.999,99' }, fx({ '2026-08': '1200', '2026-09': '1' }))
    expect(preview.due.map((r) => [r.periodKey, r.blockedBy])).toEqual([
      ['2026-08', 'amount_ars_out_of_range'],
      ['2026-09', null],
    ])
  })

  it('un tipo de cambio de otro período no sirve para este (R6)', () => {
    const preview = previewOf({ currency: 'USD', amount: '10,00' }, fx({ '2026-07': '1200', '2026-10': '1300' }))
    expect(preview.due.every((r) => r.blockedBy === 'missing_fx_rate')).toBe(true)
  })

  it.each([
    ['monto vacío', { amount: '' }],
    ['monto en cero', { amount: '0' }],
    ['monto con 3 decimales', { amount: '1,234' }],
    ['día de cobro vacío', { billingDay: '' }],
    ['día de cobro 32', { billingDay: '32' }],
    ['mes de inicio vacío', { startPeriod: '' }],
    ['mes de inicio fuera de rango', { startPeriod: '2024-09' }],
    ['mes de fin anterior al de inicio', { endPeriod: '2026-07' }],
  ])('CA-8: %s: no hay calendario', (_name, patch) => {
    expect(buildCalendarPreview(form({ startPeriod: '2026-08', ...patch }), NO_FX, TODAY)).toEqual({ kind: 'empty' })
  })

  it('el nombre, la categoría y el medio de pago no cambian el calendario', () => {
    const preview = buildCalendarPreview(form({ startPeriod: '2026-08', name: '', categoryId: '', accountId: '' }), NO_FX, TODAY)
    expect(preview.kind).toBe('ready')
  })

  it('CA-9: a las 22:00 de Argentina del día anterior al de cobro, el período corriente es un próximo cobro', () => {
    // 2026-10-09 22:00 en Argentina ya es 10/10 01:00 UTC: el hoy argentino sigue siendo el 9 (ADR-031 §7).
    const preview = previewOf({}, NO_FX, new Date(2026, 9, 9))
    expect(dueOf(preview)).toEqual(['2026-08 10/08/2026', '2026-09 10/09/2026'])
    expect(upcomingOf(preview)[0]).toBe('2026-10 10/10/2026')
    // Y con el hoy argentino del día de cobro, pasa a "Se cargan al guardar".
    expect(dueOf(previewOf({}, NO_FX, new Date(2026, 9, 10)))).toContain('2026-10 10/10/2026')
  })

  it('CA-7: las filas no bloqueadas son exactamente lo que genera la puesta al día', () => {
    const values = form({ startPeriod: '2026-05', currency: 'USD', amount: '10,00', billingDay: '31' })
    const rates = fx({ '2026-05': '1100', '2026-06': '1110', '2026-08': '1130', '2026-09': '1140', '2026-10': '1150' })
    const preview = buildCalendarPreview(values, rates, new Date(2026, 9, 31))
    if (preview.kind !== 'ready') throw new Error('se esperaba un calendario')
    const generated = computeDueOccurrences(
      { status: 'active', amount: new Decimal('10'), currency: 'USD', billingDay: 31, generateFromPeriod: { year: 2026, month: 5 }, endPeriod: null },
      new Set(),
      rates,
      new Date(2026, 9, 31),
    )
    expect(preview.due.filter((r) => !r.blockedBy).map((r) => [r.periodKey, r.text.split(' · ')[1]])).toEqual(
      generated.map((d) => [formatPeriod(d.period), d.occurredOn.split('-').reverse().join('/')]),
    )
    expect(preview.due.filter((r) => r.blockedBy).map((r) => r.periodKey)).toEqual(['2026-07'])
  })
})

describe('evaluateOccurrences: la regla única de la puesta al día (US-75, US-62)', () => {
  const usd = (patch: Partial<SubscriptionState> = {}): SubscriptionState => ({
    status: 'active',
    amount: new Decimal('10'),
    currency: 'USD',
    billingDay: 1,
    generateFromPeriod: { year: 2026, month: 6 },
    endPeriod: null,
    ...patch,
  })

  it('saltea lo ya generado (R2) y marca bloqueado lo que no se puede generar (R6), en orden de período', () => {
    const evaluations = evaluateOccurrences(usd(), new Set(['2026-07']), fx({ '2026-06': '1000' }), new Date(2026, 8, 15))
    expect(evaluations.map((e) => [formatPeriod(e.period), e.blockedBy])).toEqual([
      ['2026-06', null],
      ['2026-08', 'missing_fx_rate'],
      ['2026-09', 'missing_fx_rate'],
    ])
  })

  it('una pausada o cancelada no evalúa nada (R3)', () => {
    expect(evaluateOccurrences(usd({ status: 'paused' }), new Set(), NO_FX, TODAY)).toEqual([])
    expect(evaluateOccurrences(usd({ status: 'cancelled' }), new Set(), NO_FX, TODAY)).toEqual([])
  })

  it('computeDueOccurrences sigue devolviendo solo los generables', () => {
    const due = computeDueOccurrences(usd(), new Set(), fx({ '2026-06': '1000' }), new Date(2026, 8, 15))
    expect(due.map((d) => formatPeriod(d.period))).toEqual(['2026-06'])
    expect(due[0].fxRate?.toFixed()).toBe('1000')
  })
})

describe('upcomingCharges y textos de la vista previa (US-75)', () => {
  it('nunca devuelve más de lo pedido ni pasa del mes de fin', () => {
    const base = { billingDay: 10, generateFromPeriod: { year: 2026, month: 1 } }
    expect(upcomingCharges({ ...base, endPeriod: null }, TODAY, 5)).toHaveLength(5)
    expect(upcomingCharges({ ...base, endPeriod: { year: 2026, month: 3 } }, TODAY)).toEqual([])
  })

  it('previewSummaryText: 0, 1 y N', () => {
    const amount = new Decimal('5000')
    expect(previewSummaryText(0, amount, 'ARS')).toBe('Al guardar no se carga ningún gasto.')
    expect(previewSummaryText(1, amount, 'ARS')).toBe('Al guardar se carga 1 gasto de $5.000,00.')
    expect(previewSummaryText(3, amount, 'ARS')).toBe('Al guardar se cargan 3 gastos de $5.000,00 (total $15.000,00).')
  })

  it('el total de N montos con centavos es exacto (C2)', () => {
    expect(previewSummaryText(3, new Decimal('0.10'), 'ARS')).toBe('Al guardar se cargan 3 gastos de $0,10 (total $0,30).')
  })

  it('noMoreChargesText', () => {
    expect(noMoreChargesText({ year: 2026, month: 5 })).toBe('No hay más cobros: termina en mayo 2026.')
  })
})
