import { describe, expect, it } from 'vitest'
import { emptyDraftInput, parseDraftInput } from '@/domain/draft'
import { tryParseMoney } from '@/domain/money'
import { toIsoDate } from '@/domain/period'
import { validateTransactionDraft } from '@/domain/validation'

const TODAY = '2026-08-15'

describe('emptyDraftInput', () => {
  it('arranca como gasto en ARS, de contado, sin monto ni categoría', () => {
    expect(emptyDraftInput(TODAY)).toEqual({
      type: 'expense', amount: '', currency: 'ARS', fxRate: '', categoryId: null,
      accountId: null, accountType: null, installmentsCount: 1, occurredOn: TODAY,
    })
  })
  it('la fecha es el today que recibe, no la del reloj (C1)', () =>
    expect(emptyDraftInput('2020-02-29').occurredOn).toBe('2020-02-29'))
})

describe('toIsoDate', () => {
  it('formatea con ceros a la izquierda', () => expect(toIsoDate(new Date(2026, 0, 5, 12))).toBe('2026-01-05'))
})

describe('tryParseMoney', () => {
  it.each([
    ['1234.56', '1234.56'], ['1234,56', '1234.56'], ['1.234,56', '1234.56'], [' 10 ', '10'],
    ['0', '0'], ['-5', '-5'], ['-1.234,5', '-1234.5'],
    // Puntos de miles sin coma: entero en formato argentino, no decimales.
    ['1.500', '1500'], ['10.000', '10000'], ['1.234.567', '1234567'], ['1.5', '1.5'], ['1.50', '1.5'],
  ])('%j → %s', (raw, expected) => expect(tryParseMoney(raw)?.toFixed()).toBe(expected))
  it.each(['', '   ', 'abc', '-', '1e3', '0x10', 'Infinity', 'NaN', '12,3,4', '1.23.456', '$100'])(
    '%j no es un monto → null', (raw) => expect(tryParseMoney(raw)).toBeNull())
})

describe('parseDraftInput + validateTransactionDraft (US-11)', () => {
  const filled = { ...emptyDraftInput(TODAY), categoryId: 'c1', accountId: 'a1', accountType: 'cash' as const }
  const amountError = (amount: string) => validateTransactionDraft(parseDraftInput({ ...filled, amount }), TODAY).amount
  it.each(['', '0', '0,00', '-5', 'abc'])('monto %j no deja guardar y dice por qué', (amount) =>
    expect(amountError(amount)).toBe('El monto debe ser mayor a cero'))
  it('un monto positivo con coma decimal es válido', () =>
    expect(validateTransactionDraft(parseDraftInput({ ...filled, amount: '1.500,50' }), TODAY)).toEqual({}))
  it('fxRate vacío en ARS queda null, no cuenta como tipo de cambio (I5)', () =>
    expect(parseDraftInput(filled).fxRate).toBeNull())
})
