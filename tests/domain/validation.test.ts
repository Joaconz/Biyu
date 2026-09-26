import { describe, expect, it } from 'vitest'
import { parseMoney } from '@/domain/money'
import { allowsInstallments, validateTransactionDraft, type TransactionDraft } from '@/domain/validation'

const TODAY = '2026-08-15'
const ok: TransactionDraft = {
  type: 'expense', amount: parseMoney('1000'), currency: 'ARS', fxRate: null,
  categoryId: 'c1', accountId: 'a1', accountType: 'credit_card', installmentsCount: 1, occurredOn: TODAY,
}
const v = (patch: Partial<TransactionDraft>) => validateTransactionDraft({ ...ok, ...patch }, TODAY)

describe('validateTransactionDraft', () => {
  it('un borrador válido no tiene errores', () => expect(v({})).toEqual({}))
  it.each([['0'], ['-5'], [null]])('monto %j inválido (I4)', (a) =>
    expect(v({ amount: a === null ? null : parseMoney(a) }).amount).toBeDefined())
  it('más de 2 decimales', () => expect(v({ amount: parseMoney('1.234') }).amount).toBeDefined())
  it('USD sin tipo de cambio (I5)', () => expect(v({ currency: 'USD' }).fxRate).toBeDefined())
  it('ARS con tipo de cambio (I5)', () => expect(v({ fxRate: parseMoney('1250') }).fxRate).toBeDefined())
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
  it('fecha futura o malformada', () => {
    expect(v({ occurredOn: '2026-08-16' }).occurredOn).toBeDefined()
    expect(v({ occurredOn: '15/08/2026' }).occurredOn).toBeDefined()
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
