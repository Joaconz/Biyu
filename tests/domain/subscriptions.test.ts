import { describe, expect, it } from 'vitest'
import {
  acceptBillingDayInput,
  codePointLength,
  emptySubscriptionForm,
  fieldOfSaveError,
  groupSubscriptions,
  billingDayText,
  endedText,
  isEnded,
  limitCodePoints,
  savedNoticeText,
  startPeriodRange,
  statusText,
  subscriptionAmountText,
  validateSubscriptionForm,
  type SubscriptionFormValues,
  type SubscriptionRecord,
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
