import { describe, expect, it } from 'vitest'
import {
  debtEditBlock,
  debtEditErrors,
  debtEditInput,
  debtFxText,
  hasDebtChanges,
  type EditableDebt,
} from '@/domain/debtEdit'

// US-86 (#285): lo que decide la pantalla de edición de una deuda.

const TODAY = '2026-10-30'
const loose: EditableDebt = {
  id: 'd', person: 'Juan', direction: 'owed_to_me', amount: '10000.00', currency: 'ARS', fxRate: null,
  incurredOn: '2026-08-15', notes: 'Nafta', status: 'pending', linked: null,
}
const linked: EditableDebt = {
  ...loose,
  linked: { amount: '40000.00', currency: 'ARS', categoryName: 'Comida y supermercado', deleted: false },
}

describe('debtEditBlock', () => {
  it('una deuda pendiente se edita', () => {
    expect(debtEditBlock(loose)).toBeNull()
    expect(debtEditBlock(linked)).toBeNull()
  })

  it('una saldada no: primero se vuelve a pendiente', () => {
    expect(debtEditBlock({ ...loose, status: 'settled' })).toMatchObject({ kind: 'settled' })
  })

  it('la de un gasto eliminado no (ADR-037 §4); va antes que saldada', () => {
    const deleted = { ...linked, status: 'settled' as const, linked: { ...linked.linked!, deleted: true } }
    expect(debtEditBlock(deleted)).toMatchObject({ kind: 'deleted' })
  })
})

describe('debtEditInput y hasDebtChanges', () => {
  const original = debtEditInput(loose)

  it('precarga el monto como se escribe y el tipo de cambio congelado', () => {
    expect(original.amount).toBe('10.000,00')
    expect(original.notes).toBe('Nafta')
    const usd = debtEditInput({ ...loose, currency: 'USD', amount: '20.00', fxRate: '1450.0000' })
    expect(usd).toMatchObject({ amount: '20,00', fxRate: '1450', currency: 'USD' })
    expect(debtFxText({ fxRate: '1450.0000' })).toBe('TC 1.450,00')
    expect(debtFxText({ fxRate: null })).toBeNull()
  })

  it('sin tocar nada no hay cambios; «10000» y «10.000,00» son el mismo monto', () => {
    expect(hasDebtChanges(original, { ...original })).toBe(false)
    expect(hasDebtChanges(original, { ...original, amount: '10000' })).toBe(false)
    expect(hasDebtChanges(original, { ...original, amount: '10.000,01' })).toBe(true)
  })

  it('persona y nota se comparan recortadas', () => {
    expect(hasDebtChanges(original, { ...original, person: ' Juan ', notes: ' Nafta ' })).toBe(false)
    expect(hasDebtChanges(original, { ...original, person: 'Juana' })).toBe(true)
    expect(hasDebtChanges(original, { ...original, notes: '' })).toBe(true)
  })

  it('la fecha y la dirección cuentan', () => {
    expect(hasDebtChanges(original, { ...original, incurredOn: '2026-08-16' })).toBe(true)
    expect(hasDebtChanges(original, { ...original, direction: 'i_owe' })).toBe(true)
  })
})

describe('debtEditErrors', () => {
  it('con los valores originales no hay errores', () => {
    expect(debtEditErrors(debtEditInput(loose), loose, TODAY)).toEqual({})
  })

  it('persona vacía, monto en cero y fecha futura, con los mensajes de «Nueva deuda»', () => {
    const errors = debtEditErrors({ ...debtEditInput(loose), person: ' ', amount: '0', incurredOn: '2026-12-01' }, loose, TODAY)
    expect(errors).toEqual({
      person: 'Ingresá el nombre de la persona',
      amount: 'El monto debe ser mayor a cero',
      incurredOn: 'La fecha no puede ser futura',
    })
  })

  it('la deuda de un gasto no puede superar el monto del gasto (I7), pero sí igualarlo', () => {
    const input = debtEditInput(linked)
    expect(debtEditErrors({ ...input, amount: '40.000,01' }, linked, TODAY).amount).toBe(
      'No puede superar el monto del gasto ($40.000,00)',
    )
    expect(debtEditErrors({ ...input, amount: '40000' }, linked, TODAY)).toEqual({})
  })

  it('una deuda suelta no tiene ese tope', () => {
    expect(debtEditErrors({ ...debtEditInput(loose), amount: '999999' }, loose, TODAY)).toEqual({})
  })

  it('en US$ el tope se dice en dólares', () => {
    const usd: EditableDebt = {
      ...linked, currency: 'USD', amount: '20.00', fxRate: '1000.0000',
      linked: { amount: '100.00', currency: 'USD', categoryName: null, deleted: false },
    }
    expect(debtEditErrors({ ...debtEditInput(usd), amount: '100,01' }, usd, TODAY).amount).toBe(
      'No puede superar el monto del gasto (US$100,00)',
    )
  })
})
