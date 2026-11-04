import { describe, expect, it } from 'vitest'
import { balanceFormulaText, computeBalance, DEFAULT_BALANCE_OPTIONS, type BalanceOptions } from '@/domain/balance'
import { Decimal } from '@/domain/money'
import { computeMonthlySummary, type LooseDebt, type SummaryDebt, type SummaryEntry } from '@/domain/summary'

// US-101 (#371), ADR-047: qué entra en el balance del Resumen.
const P = { year: 2026, month: 10 }
const none: BalanceOptions = { looseDebts: false, reimbursements: false, pendingSubscriptions: false }
const all: BalanceOptions = { looseDebts: true, reimbursements: true, pendingSubscriptions: true }
const parts = {
  income: new Decimal('100000'),
  expenses: new Decimal('120000'),
  looseDebtMovement: new Decimal('-20000'),
  reimbursed: new Decimal('60000'),
  pendingSubscriptions: new Decimal('5000'),
}

describe('computeBalance (ADR-047 §3)', () => {
  it('sin nada incluido es ingresos − gastos', () => expect(computeBalance(parts, none).toFixed(2)).toBe('-20000.00'))

  it('los predeterminados son los de hoy: solo las deudas sueltas', () => {
    expect(DEFAULT_BALANCE_OPTIONS).toEqual({ looseDebts: true, reimbursements: false, pendingSubscriptions: false })
    expect(computeBalance(parts, DEFAULT_BALANCE_OPTIONS).toFixed(2)).toBe('-40000.00')
  })

  it('cada opción suma o resta solo lo suyo', () => {
    expect(computeBalance(parts, { ...none, looseDebts: true }).toFixed(2)).toBe('-40000.00')
    expect(computeBalance(parts, { ...none, reimbursements: true }).toFixed(2)).toBe('40000.00')
    expect(computeBalance(parts, { ...none, pendingSubscriptions: true }).toFixed(2)).toBe('-25000.00')
  })

  it('con todo incluido suma las tres partes', () => expect(computeBalance(parts, all).toFixed(2)).toBe('15000.00'))

  it('la fórmula dice lo que el balance incluye', () => {
    expect(balanceFormulaText(none)).toBe('Ingresos − gastos')
    expect(balanceFormulaText(DEFAULT_BALANCE_OPTIONS)).toBe('Ingresos − gastos + deudas sueltas')
    expect(balanceFormulaText(all)).toBe('Ingresos − gastos + deudas sueltas + reembolsos − suscripciones por cobrar')
  })
})

describe('computeMonthlySummary con opciones', () => {
  const entry = (type: 'income' | 'expense', amount: string): SummaryEntry => ({
    period: '2026-10-01',
    installment_number: 1,
    amount_ars: amount,
    transaction: { id: type, type, category_id: 'c', account_id: 'a', first_period: '2026-10-01', deleted_at: null },
  })
  const linked: SummaryDebt = { transaction_id: 't', direction: 'owed_to_me', amount_ars: '60000.00', transaction_first_period: '2026-10-01', transaction_deleted_at: null }
  const loose: LooseDebt = { direction: 'owed_to_me', amount_ars: '20000.00', incurred_on: '2026-10-05', status: 'pending', settled_at: null }
  const entries = [entry('income', '100000'), entry('expense', '120000')]

  it('el reembolso incluido sube el balance y no toca Gastado ni el neto', () => {
    const without = computeMonthlySummary(entries, [linked], P, [], none)
    const included = computeMonthlySummary(entries, [linked], P, [], { ...none, reimbursements: true })
    expect(without.balance.toFixed(2)).toBe('-20000.00')
    expect(included.balance.toFixed(2)).toBe('40000.00')
    expect(included.expenses.toFixed(2)).toBe('120000.00')
    expect(included.netOfReimbursements.toFixed(2)).toBe(without.netOfReimbursements.toFixed(2))
  })

  it('una deuda suelta y una vinculada no se cuentan dos veces', () => {
    const s = computeMonthlySummary(entries, [linked], P, [loose], { ...DEFAULT_BALANCE_OPTIONS, reimbursements: true })
    expect(s.balance.toFixed(2)).toBe('20000.00') // −20.000 + (−20.000 suelta) + 60.000 reembolso
  })

  it('con las deudas sueltas excluidas no hay línea ni cuentan para saber si el mes tiene datos', () => {
    const s = computeMonthlySummary([], [], P, [loose], none)
    expect(s.hasLooseDebtEvents).toBe(false)
    expect(s.hasData).toBe(false)
    expect(s.balance.isZero()).toBe(true)
    expect(computeMonthlySummary([], [], P, [loose]).hasData).toBe(true)
  })

  it('expone las partes para sumar después las suscripciones por cobrar', () => {
    const s = computeMonthlySummary(entries, [linked], P, [loose], DEFAULT_BALANCE_OPTIONS)
    expect(computeBalance({ ...s.balanceParts, pendingSubscriptions: new Decimal('5000') }, { ...DEFAULT_BALANCE_OPTIONS, pendingSubscriptions: true }).toFixed(2)).toBe('-45000.00')
  })
})
