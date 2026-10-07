import { describe, expect, it } from 'vitest'
import { applyDraftChange, emptyDraftInput, parseDraftInput, type DraftInput } from '@/domain/draft'
import { parseMoney } from '@/domain/money'
import {
  debtOfDraft,
  sharedDebtPreview,
  sharedDebtSavedMessage,
  sharedDebtSummary,
  toSharedDebt,
  validateSharedDebt,
} from '@/domain/sharedDebt'
import { validateTransactionDraft } from '@/domain/validation'

const TODAY = '2026-08-15'
const ARS = { amount: null, currency: 'ARS' as const, fxRate: null }

describe('validateSharedDebt (US-34, copia UX de create_transaction)', () => {
  it('persona y monto válidos no tienen errores', () =>
    expect(validateSharedDebt({ person: 'Sofía', amount: '60000' }, ARS)).toEqual({}))

  it.each(['', '   ', '\t', ' '])('persona %j vacía o solo espacios', (person) =>
    expect(validateSharedDebt({ person, amount: '1' }, ARS).sharedPerson).toBe('Ingresá con quién compartiste el gasto'))

  it.each([
    ['', 'Ingresá cuánto te debe'],
    ['   ', 'Ingresá cuánto te debe'],
    ['abc', 'Ingresá un número válido'],
    ['1e3', 'Ingresá un número válido'],
    ['0', 'El monto debe ser mayor a cero'],
    ['-5', 'El monto debe ser mayor a cero'],
    ['100,001', 'El monto admite hasta 2 decimales'],
  ])('monto %j → %s (CA-7)', (amount, message) =>
    expect(validateSharedDebt({ person: 'Sofía', amount }, ARS).sharedAmount).toBe(message))

  it.each(['60000', '60.000', '60.000,00', '60000.5', '0,01'])('monto %j aceptado', (amount) =>
    expect(validateSharedDebt({ person: 'Sofía', amount }, ARS)).toEqual({}))

  it('en US$, una deuda que en pesos redondea a $0,00 se rechaza', () => {
    const usd = { amount: null, currency: 'USD' as const, fxRate: parseMoney('0.4') }
    expect(validateSharedDebt({ person: 'Sofía', amount: '0,01' }, usd).sharedAmount).toBe(
      'En pesos daría menos de $0,01. Revisá el monto o el tipo de cambio',
    )
    expect(validateSharedDebt({ person: 'Sofía', amount: '0,01' }, { ...usd, fxRate: parseMoney('0.5') })).toEqual({})
  })
})

describe('la deuda no puede superar el gasto (US-41)', () => {
  const expense = { amount: parseMoney('10000'), currency: 'ARS' as const, fxRate: null }

  it.each(['9999,99', '10000', '10.000,00'])('deuda %j hasta el gasto de $10.000,00 se acepta (CA-1, CA-2)', (amount) =>
    expect(validateSharedDebt({ person: 'Sofía', amount }, expense)).toEqual({}))

  it.each(['10000,01', '15000'])('deuda %j mayor al gasto se rechaza con el monto del gasto (CA-3, CA-4)', (amount) =>
    expect(validateSharedDebt({ person: 'Sofía', amount }, expense).sharedAmount).toBe(
      'No puede superar el monto del gasto ($10.000,00)',
    ))

  it('en US$ se compara en dólares y el mensaje usa US$ (CA-6)', () => {
    const usd = { amount: parseMoney('100.01'), currency: 'USD' as const, fxRate: parseMoney('1250.5555') }
    expect(validateSharedDebt({ person: 'Sofía', amount: '100,01' }, usd)).toEqual({})
    expect(validateSharedDebt({ person: 'Sofía', amount: '100,02' }, usd).sharedAmount).toBe(
      'No puede superar el monto del gasto (US$100,01)',
    )
  })

  it('sin un monto de gasto válido no se compara: ese error es del paso 1', () => {
    expect(validateSharedDebt({ person: 'Sofía', amount: '15000' }, { ...expense, amount: null })).toEqual({})
    expect(validateSharedDebt({ person: 'Sofía', amount: '15000' }, { ...expense, amount: parseMoney('0') })).toEqual({})
  })
})

describe('textos de la deuda', () => {
  it('resumen y aviso en pesos', () => {
    const debt = toSharedDebt({ person: '  Sofía  ', amount: '60000' })!
    expect(debt.person).toBe('Sofía')
    expect(sharedDebtSummary(debt, parseMoney('120000'), 'ARS')).toBe(
      'Sofía te va a deber $60.000,00 · Tu parte: $60.000,00',
    )
    expect(sharedDebtSavedMessage(debt, 'ARS')).toBe('Sofía te debe $60.000,00')
  })
  it('en la moneda del gasto: US$ (CA-13)', () => {
    const debt = toSharedDebt({ person: 'Sofía', amount: '40' })!
    expect(sharedDebtSavedMessage(debt, 'USD')).toBe('Sofía te debe US$40,00')
    expect(sharedDebtSummary(debt, parseMoney('100'), 'USD')).toBe('Sofía te va a deber US$40,00 · Tu parte: US$60,00')
  })
  it('el resumen espera a que persona, monto y gasto sean válidos', () => {
    expect(sharedDebtPreview({ person: 'Sofía', amount: '60000' }, '120.000', 'ARS')).toBe(
      'Sofía te va a deber $60.000,00 · Tu parte: $60.000,00',
    )
    expect(sharedDebtPreview({ person: '', amount: '60000' }, '120000', 'ARS')).toBeNull()
    expect(sharedDebtPreview({ person: 'Sofía', amount: '60000' }, '', 'ARS')).toBeNull()
  })
  it('solo un gasto lleva deuda', () => {
    const shared = { person: 'Sofía', amount: '10' }
    expect(debtOfDraft({ type: 'expense', shared })?.person).toBe('Sofía')
    expect(debtOfDraft({ type: 'income', shared })).toBeNull()
    expect(debtOfDraft({ type: 'expense', shared: null })).toBeNull()
  })
  it('sin persona o monto válido no hay deuda que mandar', () => {
    expect(toSharedDebt({ person: ' ', amount: '10' })).toBeNull()
    expect(toSharedDebt({ person: 'Sofía', amount: 'abc' })).toBeNull()
  })
})

describe('borrador con gasto compartido', () => {
  const base: DraftInput = {
    ...emptyDraftInput(TODAY, { accountId: 'a1', accountType: 'credit_card' }),
    amount: '120000',
    categoryId: 'c1',
  }
  const shared: DraftInput = { ...base, shared: true, sharedPerson: 'Sofía', sharedAmount: '60000' }

  it('arranca apagado y vacío', () => {
    expect(base.shared).toBe(false)
    expect(parseDraftInput(base).shared).toBeNull()
  })
  it('encendido, viaja persona y monto y valida', () => {
    expect(parseDraftInput(shared).shared).toEqual({ person: 'Sofía', amount: '60000' })
    expect(validateTransactionDraft(parseDraftInput(shared), TODAY)).toEqual({})
  })
  it('encendido y vacío no deja guardar', () => {
    const errors = validateTransactionDraft(parseDraftInput({ ...base, shared: true }), TODAY)
    expect(errors.sharedPerson).toBe('Ingresá con quién compartiste el gasto')
    expect(errors.sharedAmount).toBe('Ingresá cuánto te debe')
  })
  it('apagarlo vacía los campos y guarda sin deuda (CA-2)', () => {
    const change = applyDraftChange(shared, { shared: false })
    expect(change.clearedFields).toEqual(['sharedPerson', 'sharedAmount'])
    const off = change.values
    expect(off).toMatchObject({ shared: false, sharedPerson: '', sharedAmount: '' })
    expect(parseDraftInput(off).shared).toBeNull()
    expect(applyDraftChange(off, { shared: true }).values).toMatchObject({ shared: true, sharedPerson: '', sharedAmount: '' })
  })
  it('un ingreso no lleva deuda aunque haya algo escrito (CA-10)', () => {
    expect(parseDraftInput({ ...shared, type: 'income' }).shared).toBeNull()
  })
  it('pasar a ingreso y volver a gasto deja la sección apagada y vacía (CA-10)', () => {
    const income = applyDraftChange(shared, { type: 'income' }).values
    const back = applyDraftChange(income, { type: 'expense' }).values
    expect(back).toMatchObject({ shared: false, sharedPerson: '', sharedAmount: '' })
  })
  it('cambiar la moneda vacía el monto adeudado y conserva la persona (CA-12)', () => {
    const change = applyDraftChange(shared, { currency: 'USD' })
    expect(change.clearedFields).toEqual(['sharedAmount'])
    const usd = change.values
    expect(usd).toMatchObject({ shared: true, sharedPerson: 'Sofía', sharedAmount: '' })
  })
  it('bajar el gasto por debajo de la deuda la deja en error y no la ajusta (US-41 CA-7)', () => {
    const lowered = applyDraftChange(shared, { amount: '50000' }).values
    expect(lowered.sharedAmount).toBe('60000')
    expect(validateTransactionDraft(parseDraftInput(lowered), TODAY)).toEqual({
      sharedAmount: 'No puede superar el monto del gasto ($50.000,00)',
    })
  })
  it('después de guardar, el interruptor vuelve apagado (CA-9)', () => {
    expect(emptyDraftInput(TODAY)).toMatchObject({ shared: false, sharedPerson: '', sharedAmount: '' })
  })
})
