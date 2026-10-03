import { describe, expect, it } from 'vitest'
import { parseMoney } from '@/domain/money'
import { allowsInstallments, validateTransactionDraft, type TransactionDraft } from '@/domain/validation'

const TODAY = '2026-08-15'
const ok: TransactionDraft = {
  type: 'expense', amount: parseMoney('1000'), currency: 'ARS', fxRate: null,
  categoryId: 'c1', accountId: 'a1', accountType: 'credit_card', installmentsCount: 1, occurredOn: TODAY,
  description: null,
}
const v = (patch: Partial<TransactionDraft>) => validateTransactionDraft({ ...ok, ...patch }, TODAY)

describe('validateTransactionDraft', () => {
  it('un borrador válido no tiene errores', () => expect(v({})).toEqual({}))
  it('la descripción es opcional (US-08)', () => {
    expect(v({ description: null })).toEqual({})
    expect(v({ description: 'Café con medialunas' })).toEqual({})
  })
  it.each([['0'], ['-5'], [null]])('monto %j inválido (I4)', (a) =>
    expect(v({ amount: a === null ? null : parseMoney(a) }).amount).toBeDefined())
  it('más de 2 decimales', () => expect(v({ amount: parseMoney('1.234') }).amount).toBeDefined())
  it.each([
    { currency: 'ARS' as const, fxRate: null, expectedError: undefined, caseName: 'ARS sin TC se acepta' },
    { currency: 'ARS' as const, fxRate: parseMoney('1250'), expectedError: 'Una transacción en ARS no lleva tipo de cambio', caseName: 'ARS con TC se rechaza' },
    { currency: 'USD' as const, fxRate: null, expectedError: 'Falta el tipo de cambio', caseName: 'USD sin TC se rechaza' },
    { currency: 'USD' as const, fxRate: parseMoney('1250'), expectedError: undefined, caseName: 'USD con TC manual se acepta' },
  ])('I5: $caseName', ({ currency, fxRate, expectedError }) => {
    expect(v({ currency, fxRate }).fxRate).toBe(expectedError)
  })
  it('gasto sin categoría (I8), ingreso sí puede', () => {
    expect(v({ categoryId: null }).categoryId).toBeDefined()
    expect(v({ type: 'income', categoryId: null }).categoryId).toBeUndefined()
  })
  it('cuotas sobre una cuenta que no es tarjeta de crédito (I6)', () =>
    expect(v({ installmentsCount: 6, accountType: 'cash' }).installmentsCount).toBeDefined())
  it('cuotas en un ingreso (I6)', () =>
    expect(v({ type: 'income', installmentsCount: 2 }).installmentsCount).toBeDefined())
  it.each([0, 13, 1.5])('cuotas fuera de rango: %s', (n) => expect(v({ installmentsCount: n }).installmentsCount).toBeDefined())
  it('12 cuotas con tarjeta de crédito es válido', () => expect(v({ installmentsCount: 12 })).toEqual({}))
  it('una cuota menor a 0,01 no deja guardar, igual que create_transaction', () => {
    // Sin signo de moneda: en USD la serie que no llega puede ser la de dólares o la de pesos.
    expect(v({ amount: parseMoney('0.02'), installmentsCount: 3 }).installmentsCount).toBe(
      'Con ese monto, cada cuota daría menos de 0,01')
    expect(v({ amount: parseMoney('0.03'), installmentsCount: 3 })).toEqual({})
  })
  it('en USD, la cuota en ARS también tiene que llegar a 0,01', () => {
    // USD 0,02 × 0,5 = $0,01 en ARS: en 2 cuotas la base en ARS sería 0
    const usd = { currency: 'USD' as const, amount: parseMoney('0.02'), fxRate: parseMoney('0.5'), installmentsCount: 2 }
    expect(v(usd).installmentsCount).toBeDefined()
    expect(v({ ...usd, fxRate: parseMoney('1250') })).toEqual({})
  })
  // DEF-012 (#153): numeric(14,2) llega hasta 999.999.999.999,99. Más que eso pasaba la
  // validación y terminaba en "numeric field overflow" en inglés.
  it('DEF-012: el monto máximo es 999.999.999.999,99', () => {
    expect(v({ amount: parseMoney('999999999999.99') })).toEqual({})
    expect(v({ amount: parseMoney('1000000000000') }).amount).toBe('El monto máximo es $999.999.999.999,99')
  })
  it('DEF-012: en USD, el equivalente en pesos tampoco puede pasar el máximo', () => {
    const usd = { currency: 'USD' as const, amount: parseMoney('1000000000'), fxRate: parseMoney('1250') }
    expect(v(usd).amount).toBe('En pesos daría más que el máximo de $999.999.999.999,99')
    expect(v({ ...usd, amount: parseMoney('1000') })).toEqual({})
  })
  // DEF-013 (#154): con una sola cuota (sin selector visible), el error iba a installmentsCount,
  // que no se muestra; el Guardar quedaba deshabilitado sin ningún motivo a la vista.
  it('DEF-013: sin cuotas, un monto que en pesos da menos de 0,01 marca el monto', () => {
    const tiny = { currency: 'USD' as const, amount: parseMoney('0.01'), fxRate: parseMoney('0.01'), accountType: 'cash' as const }
    const errors = v(tiny)
    expect(errors.installmentsCount).toBeUndefined()
    expect(errors.amount).toBe('En pesos daría menos de $0,01. Revisá el monto o el tipo de cambio')
  })
  // DEF-018 (#184): Ajustes rechaza más de 4 decimales y el registro no: la base redondeaba sin avisar.
  it('DEF-018: el tipo de cambio admite hasta 4 decimales', () => {
    const usd = { currency: 'USD' as const, amount: parseMoney('100') }
    expect(v({ ...usd, fxRate: parseMoney('1250.5555') })).toEqual({})
    expect(v({ ...usd, fxRate: parseMoney('1250.55555') }).fxRate).toBe('Usá hasta 4 decimales')
  })
  it('fecha futura o malformada', () => {
    expect(v({ occurredOn: '2026-08-16' }).occurredOn).toBeDefined()
    expect(v({ occurredOn: '15/08/2026' }).occurredOn).toBeDefined()
  })
  it.each([['2026-08-15', 'hoy'], ['2026-08-14', 'ayer'], ['2026-07-31', 'el mes anterior'], ['2025-12-31', 'el año anterior']])(
    'US-09: %s (%s) es una fecha válida', (occurredOn) => expect(v({ occurredOn })).toEqual({}))
  it('US-09: el 1 de enero, el 31 de diciembre anterior vale y el 2 de enero no', () => {
    const newYear = (occurredOn: string) => validateTransactionDraft({ ...ok, occurredOn }, '2027-01-01')
    expect(newYear('2026-12-31')).toEqual({})
    expect(newYear('2027-01-02').occurredOn).toBe('La fecha no puede ser futura')
  })
})

describe('allowsInstallments (I6, US-14)', () => {
  it('solo un gasto con tarjeta de crédito', () => {
    expect(allowsInstallments({ type: 'expense', accountType: 'credit_card' })).toBe(true)
    expect(allowsInstallments({ type: 'income', accountType: 'credit_card' })).toBe(false)
    expect(allowsInstallments({ type: 'expense', accountType: null })).toBe(false)
  })
  it.each(['debit_card', 'cash', 'bank_account', 'wallet'] as const)('%s no admite cuotas', (accountType) =>
    expect(allowsInstallments({ type: 'expense', accountType })).toBe(false))
})
