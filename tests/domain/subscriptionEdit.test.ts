import { describe, expect, it } from 'vitest'
import {
  editFormValues,
  editNextChargeText,
  editOptions,
  editSavedNoticeText,
  endedExtensionHint,
  minEndPeriod,
  validateSubscriptionEdit,
} from '@/domain/subscriptionEdit'
import { tryParseMoney } from '@/domain/money'
import type { SubscriptionFormValues, SubscriptionRecord } from '@/domain/subscriptions'

// Hoy de los ejemplos de entrega-2/historias/suscripciones.md: 2026-10-06, período corriente octubre 2026.
const TODAY = new Date(2026, 9, 6)

function record(patch: Partial<SubscriptionRecord> = {}): SubscriptionRecord {
  return {
    id: 'sub-1',
    name: 'Netflix',
    amount: '5000.00',
    currency: 'ARS',
    categoryId: 'cat-1',
    categoryName: 'Entretenimiento',
    accountId: 'acc-1',
    accountName: 'Visa',
    billingDay: 10,
    startPeriod: { year: 2026, month: 5 },
    endPeriod: null,
    generateFromPeriod: { year: 2026, month: 5 },
    status: 'active',
    pausedAt: null,
    cancelledAt: null,
    description: 'Plan estándar',
    ...patch,
  }
}

const valuesOf = (sub: SubscriptionRecord, patch: Partial<SubscriptionFormValues> = {}) => ({ ...editFormValues(sub), ...patch })
const errorsOf = (patch: Partial<SubscriptionFormValues>, sub = record()) =>
  validateSubscriptionEdit(valuesOf(sub, patch), sub, TODAY).errors

describe('editFormValues', () => {
  it('precarga los datos de la suscripción en el formato del formulario', () => {
    const values = editFormValues(record({ amount: '7000.50', endPeriod: { year: 2027, month: 3 } }))
    expect(values).toMatchObject({
      name: 'Netflix',
      amount: '7000,50',
      currency: 'ARS',
      categoryId: 'cat-1',
      accountId: 'acc-1',
      billingDay: '10',
      startPeriod: '2026-05',
      endPeriod: '2027-03',
      description: 'Plan estándar',
    })
    // Lo que se ve es lo que se lee de vuelta, sin pasar por number (C2).
    expect(tryParseMoney(values.amount)?.toFixed()).toBe('7000.5')
  })

  it('sin mes de fin ni descripción, los campos quedan vacíos', () => {
    const values = editFormValues(record({ description: null }))
    expect(values.endPeriod).toBe('')
    expect(values.description).toBe('')
  })
})

describe('validateSubscriptionEdit (US-59 CA-6, CA-7)', () => {
  it('sin cambios es válida y arma el borrador', () => {
    const { errors, draft } = validateSubscriptionEdit(valuesOf(record()), record(), TODAY)
    expect(errors).toEqual({})
    expect(draft).toMatchObject({ name: 'Netflix', billingDay: 10, categoryId: 'cat-1', accountId: 'acc-1', endPeriod: null })
    expect(draft?.amount.toFixed()).toBe('5000')
  })

  it('recorta el nombre y la descripción; descripción vacía pasa a null', () => {
    const { draft } = validateSubscriptionEdit(valuesOf(record(), { name: '  Netflix HD  ', description: '   ' }), record(), TODAY)
    expect(draft?.name).toBe('Netflix HD')
    expect(draft?.description).toBeNull()
  })

  it('mensajes de nombre, monto, categoría, medio de pago, día de cobro y descripción (los de US-52)', () => {
    expect(errorsOf({ name: '   ' }).name).toBe('Escribí un nombre')
    expect(errorsOf({ name: 'a'.repeat(61) }).name).toBe('El nombre admite hasta 60 caracteres')
    expect(errorsOf({ name: 'a'.repeat(60) }).name).toBeUndefined()
    expect(errorsOf({ amount: '0' }).amount).toBe('El monto debe ser mayor a cero')
    expect(errorsOf({ amount: '' }).amount).toBe('El monto debe ser mayor a cero')
    expect(errorsOf({ amount: '10,123' }).amount).toBe('El monto admite hasta 2 decimales')
    expect(errorsOf({ amount: '1000000000000,00' }).amount).toBe('El monto máximo es $999.999.999.999,99')
    expect(errorsOf({ amount: '1000000000000,00' }, record({ currency: 'USD' })).amount).toBe(
      'El monto máximo es USD 999.999.999.999,99',
    )
    expect(errorsOf({ categoryId: '' }).categoryId).toBe('Elegí una categoría')
    expect(errorsOf({ accountId: '' }).accountId).toBe('Elegí un medio de pago')
    expect(errorsOf({ billingDay: '' }).billingDay).toBe('Indicá el día de cobro')
    expect(errorsOf({ billingDay: '0' }).billingDay).toBe('El día de cobro va de 1 a 31')
    expect(errorsOf({ billingDay: '32' }).billingDay).toBe('El día de cobro va de 1 a 31')
    expect(errorsOf({ billingDay: '31' }).billingDay).toBeUndefined()
    expect(errorsOf({ description: 'a'.repeat(201) }).description).toBe('La descripción admite hasta 200 caracteres')
  })

  it('un mes de fin nuevo anterior al corriente se rechaza con el mes mínimo (CA-6)', () => {
    expect(errorsOf({ endPeriod: '2026-09' }).endPeriod).toBe('El mes de fin no puede ser anterior a octubre 2026')
  })

  it('el mínimo es el mayor entre el mes de inicio y el corriente', () => {
    const future = record({ startPeriod: { year: 2027, month: 1 }, generateFromPeriod: { year: 2027, month: 1 } })
    expect(minEndPeriod(future, TODAY)).toEqual({ year: 2027, month: 1 })
    expect(errorsOf({ endPeriod: '2026-12' }, future).endPeriod).toBe('El mes de fin no puede ser anterior a enero 2027')
    expect(errorsOf({ endPeriod: '2027-01' }, future).endPeriod).toBeUndefined()
    expect(minEndPeriod(record(), TODAY)).toEqual({ year: 2026, month: 10 })
  })

  it('el mes de fin igual al corriente se acepta; más allá de diciembre 2099, no', () => {
    expect(errorsOf({ endPeriod: '2026-10' }).endPeriod).toBeUndefined()
    expect(errorsOf({ endPeriod: '2100-01' }).endPeriod).toBe('El mes de fin puede ser como máximo diciembre 2099')
    expect(errorsOf({ endPeriod: '2099-12' }).endPeriod).toBeUndefined()
  })

  it('solo se valida si cambia: una terminada se edita sin tocar el mes de fin (CA-11)', () => {
    const ended = record({ endPeriod: { year: 2026, month: 5 } })
    const { errors, draft } = validateSubscriptionEdit(valuesOf(ended, { description: 'Otro plan' }), ended, TODAY)
    expect(errors).toEqual({})
    expect(draft?.endPeriod).toEqual({ year: 2026, month: 5 })
    // Extenderla a "Sin fin" es un cambio válido; a otro mes pasado, no.
    expect(errorsOf({ endPeriod: '' }, ended).endPeriod).toBeUndefined()
    expect(errorsOf({ endPeriod: '2026-07' }, ended).endPeriod).toBe('El mes de fin no puede ser anterior a octubre 2026')
  })

  it('un mes de fin ilegible pide uno válido o sin fin', () => {
    expect(errorsOf({ endPeriod: 'basura' }).endPeriod).toBe('Elegí un mes de fin válido o dejalo sin fin')
  })
})

describe('endedExtensionHint (ADR-032)', () => {
  it('solo para una terminada', () => {
    expect(endedExtensionHint(record(), TODAY)).toBeNull()
    expect(endedExtensionHint(record({ endPeriod: { year: 2026, month: 10 } }), TODAY)).toBeNull()
    expect(endedExtensionHint(record({ endPeriod: { year: 2026, month: 5 } }), TODAY)).toBe(
      'Terminó en mayo 2026. Si la extendés, los meses entre mayo 2026 y octubre 2026 no se cargan.',
    )
  })
})

describe('editNextChargeText (US-59)', () => {
  const generated = new Set(['2026-05', '2026-06', '2026-07', '2026-08', '2026-09'])
  const text = (sub: SubscriptionRecord, patch: Partial<SubscriptionFormValues> = {}, gen: ReadonlySet<string> = generated) =>
    editNextChargeText(valuesOf(sub, patch), sub, gen, TODAY)

  it('"Próximo cobro" con el monto del formulario', () => {
    const sub = record({ generateFromPeriod: { year: 2026, month: 10 } })
    expect(text(sub, { amount: '7000,00' })).toBe('Próximo cobro: 10/10/2026 por $7.000,00')
  })

  it('con el día de cobro ya vencido y el mes sin generar: "Al guardar se carga…" (CA-12)', () => {
    expect(text(record(), { billingDay: '3', amount: '7000,00' })).toBe(
      'Al guardar se carga octubre 2026 (03/10/2026) por $7.000,00',
    )
  })

  it('el mes corriente ya generado: el próximo cobro es el del mes siguiente', () => {
    expect(text(record({ billingDay: 3 }), {}, new Set([...generated, '2026-10']))).toBe('Próximo cobro: 03/11/2026 por $5.000,00')
  })

  it('en dólares muestra la moneda de la suscripción', () => {
    expect(text(record({ currency: 'USD', amount: '10.00' }), { amount: '12,50' })).toBe('Próximo cobro: 10/10/2026 por USD 12,50')
  })

  it('pausada: no hay próximo cobro', () => {
    expect(text(record({ status: 'paused' }))).toBe('Pausada: no hay próximo cobro')
  })

  it('terminada y sin extender: no hay más cobros', () => {
    const ended = record({ endPeriod: { year: 2026, month: 5 }, generateFromPeriod: { year: 2026, month: 6 } })
    expect(text(ended)).toBe('No hay más cobros: terminó en mayo 2026.')
  })

  it('terminada y extendida a "Sin fin": el piso pasa al corriente y no cuenta los meses del hueco (R8)', () => {
    const ended = record({ endPeriod: { year: 2026, month: 5 }, generateFromPeriod: { year: 2026, month: 6 } })
    expect(text(ended, { endPeriod: '' }, new Set(['2026-05']))).toBe('Próximo cobro: 10/10/2026 por $5.000,00')
  })

  it('terminada y extendida a un mes de fin nuevo: también salta el hueco (R8)', () => {
    const ended = record({ endPeriod: { year: 2026, month: 5 }, generateFromPeriod: { year: 2026, month: 6 } })
    expect(text(ended, { endPeriod: '2027-03' }, new Set(['2026-05']))).toBe('Próximo cobro: 10/10/2026 por $5.000,00')
  })

  it('con el piso ya en el futuro (pausada y reanudada antes del inicio) no lo baja al corriente', () => {
    const future = record({ startPeriod: { year: 2027, month: 1 }, generateFromPeriod: { year: 2027, month: 1 } })
    expect(text(future, {}, new Set())).toBe('Próximo cobro: 10/01/2027 por $5.000,00')
  })

  it('si el día viejo ya había vencido sin generar, esa ocurrencia sale con los datos anteriores y el cambio rige desde el mes siguiente', () => {
    // Día de cobro 5 (vencido el 5, hoy es 6) y el mes sin generar; se pasa a 28: octubre se carga con el día y el monto viejos.
    expect(text(record({ billingDay: 5 }), { billingDay: '28', amount: '7000,00' })).toBe('Próximo cobro: 28/11/2026 por $7.000,00')
  })

  it('el día viejo todavía no venció y el nuevo sí: el mes corriente se carga al guardar con los datos nuevos (CA-12)', () => {
    expect(text(record({ billingDay: 28 }), { billingDay: '3', amount: '7000,00' })).toBe(
      'Al guardar se carga octubre 2026 (03/10/2026) por $7.000,00',
    )
  })

  it('el mes corriente ya tiene transacción: el cambio de día rige desde el mes siguiente', () => {
    expect(text(record({ billingDay: 5 }), { billingDay: '28' }, new Set([...generated, '2026-10']))).toBe(
      'Próximo cobro: 28/11/2026 por $5.000,00',
    )
  })

  it('con el mes de fin en el corriente y el día viejo vencido, se carga hoy y no quedan más cobros', () => {
    const lastMonth = record({ billingDay: 5, endPeriod: { year: 2026, month: 10 } })
    expect(text(lastMonth, { billingDay: '28' })).toBe('No hay más cobros: termina en octubre 2026.')
  })

  it('con el monto o el día de cobro todavía inválidos no hay línea', () => {
    expect(text(record(), { amount: '' })).toBeNull()
    expect(text(record(), { billingDay: '40' })).toBeNull()
  })
})

describe('editOptions (ADR-032)', () => {
  const active = [
    { id: 'a', name: 'Streaming' },
    { id: 'b', name: 'Casa' },
  ]

  it('si la actual está activa, no agrega nada', () => {
    expect(editOptions(active, { id: 'a', name: 'Streaming' }).map((o) => o.label)).toEqual(['Casa', 'Streaming'])
  })

  it('si la actual está archivada, aparece seleccionable con "(archivada)"', () => {
    const options = editOptions(active, { id: 'z', name: 'Vieja' })
    expect(options.map((o) => o.label)).toEqual(['Casa', 'Streaming', 'Vieja (archivada)'])
    expect(options.find((o) => o.id === 'z')?.archived).toBe(true)
    expect(options.filter((o) => o.archived)).toHaveLength(1)
  })
})

describe('editSavedNoticeText (US-59)', () => {
  it('sin gastos generados', () => {
    expect(editSavedNoticeText(0, 0, TODAY)).toBe('Cambios guardados')
  })

  it('con gastos atrasados cargados antes, con los datos anteriores', () => {
    expect(editSavedNoticeText(2, 0, TODAY)).toBe('Cambios guardados. Antes se cargaron 2 gastos vencidos con los datos anteriores.')
    expect(editSavedNoticeText(1, 0, TODAY)).toBe('Cambios guardados. Antes se cargó 1 gasto vencido con los datos anteriores.')
  })

  it('con el gasto del mes cargado después, con los datos nuevos', () => {
    expect(editSavedNoticeText(0, 1, TODAY)).toBe('Cambios guardados. Se cargó el gasto de octubre 2026 con los datos nuevos.')
  })

  it('con las dos', () => {
    expect(editSavedNoticeText(2, 1, TODAY)).toBe(
      'Cambios guardados. Antes se cargaron 2 gastos vencidos con los datos anteriores. Se cargó el gasto de octubre 2026 con los datos nuevos.',
    )
  })
})
