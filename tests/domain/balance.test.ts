import { describe, expect, it } from 'vitest'
import {
  BALANCE_OPTION_KEYS,
  balanceBreakdown,
  balanceFormulaText,
  computeBalance,
  DEFAULT_BALANCE_OPTIONS,
  isOnlyMovements,
  ONLY_MOVEMENTS,
  optionContribution,
  type BalanceActivity,
  type BalanceOptions,
} from '@/domain/balance'
import { Decimal, formatSignedArs } from '@/domain/money'
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
    expect(balanceFormulaText(none)).toBe('Solo movimientos: ingresos − gastos')
    expect(balanceFormulaText(DEFAULT_BALANCE_OPTIONS)).toBe('Ingresos − gastos + deudas sueltas')
    expect(balanceFormulaText(all)).toBe('Ingresos − gastos + deudas sueltas + reembolsos − suscripciones por cobrar')
  })
})

describe('«Solo movimientos» y lo que mueve cada opción (ADR-051)', () => {
  it('solo movimientos es no incluir ninguna opción', () => {
    expect(ONLY_MOVEMENTS).toEqual(none)
    expect(isOnlyMovements(none)).toBe(true)
    expect(isOnlyMovements(DEFAULT_BALANCE_OPTIONS)).toBe(false)
    expect(isOnlyMovements({ ...none, pendingSubscriptions: true })).toBe(false)
    expect(computeBalance(parts, ONLY_MOVEMENTS).toFixed(2)).toBe(parts.income.minus(parts.expenses).toFixed(2))
  })

  it('cada opción mueve el balance con su signo: las suscripciones por cobrar restan', () => {
    expect(optionContribution(parts, 'looseDebts').toFixed(2)).toBe('-20000.00')
    expect(optionContribution(parts, 'reimbursements').toFixed(2)).toBe('60000.00')
    expect(optionContribution(parts, 'pendingSubscriptions').toFixed(2)).toBe('-5000.00')
  })
})

describe('balanceBreakdown (ADR-051)', () => {
  const allActivity: BalanceActivity = { looseDebts: true, reimbursements: true, pendingSubscriptions: true }
  const keys = (lines: { key: string }[]) => lines.map((l) => l.key)
  const sum = (lines: { amount: Decimal }[]) => lines.reduce((acc, l) => acc.plus(l.amount), new Decimal(0))

  it('con los predeterminados: ingresos, gastos y deudas sueltas adentro; reembolsos y suscripciones afuera', () => {
    const { included, excluded } = balanceBreakdown(parts, DEFAULT_BALANCE_OPTIONS, allActivity)
    expect(keys(included)).toEqual(['income', 'expenses', 'looseDebts'])
    expect(included.map((l) => l.amount.toFixed(2))).toEqual(['100000.00', '-120000.00', '-20000.00'])
    expect(keys(excluded)).toEqual(['reimbursements', 'pendingSubscriptions'])
    expect(excluded.map((l) => l.amount.toFixed(2))).toEqual(['60000.00', '-5000.00'])
  })

  it('solo movimientos deja dos líneas adentro y las tres opciones afuera', () => {
    const { included, excluded } = balanceBreakdown(parts, ONLY_MOVEMENTS, allActivity)
    expect(keys(included)).toEqual(['income', 'expenses'])
    expect(keys(excluded)).toEqual(['looseDebts', 'reimbursements', 'pendingSubscriptions'])
  })

  it('una opción sin actividad en el mes no aparece, esté incluida o no', () => {
    const quiet: BalanceActivity = { looseDebts: false, reimbursements: true, pendingSubscriptions: false }
    expect(keys(balanceBreakdown(parts, all, quiet).included)).toEqual(['income', 'expenses', 'reimbursements'])
    expect(keys(balanceBreakdown(parts, none, quiet).excluded)).toEqual(['reimbursements'])
  })

  it('las líneas de adentro suman exactamente el balance, para las ocho combinaciones de opciones', () => {
    for (let mask = 0; mask < 8; mask++) {
      const options = Object.fromEntries(BALANCE_OPTION_KEYS.map((key, i) => [key, Boolean(mask & (1 << i))])) as unknown as BalanceOptions
      const { included, excluded } = balanceBreakdown(parts, options, allActivity)
      expect(sum(included).toFixed(2)).toBe(computeBalance(parts, options).toFixed(2))
      // Incluir lo de afuera lleva al balance con todo incluido.
      expect(sum(included).plus(sum(excluded)).toFixed(2)).toBe(computeBalance(parts, all).toFixed(2))
    }
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
    expect(s.looseDebtActivity).toBe(true)
    expect(s.hasData).toBe(false)
    expect(s.balance.isZero()).toBe(true)
    expect(computeMonthlySummary([], [], P, [loose]).hasData).toBe(true)
  })

  it('expone las partes para sumar después las suscripciones por cobrar', () => {
    const s = computeMonthlySummary(entries, [linked], P, [loose], DEFAULT_BALANCE_OPTIONS)
    expect(computeBalance({ ...s.balanceParts, pendingSubscriptions: new Decimal('5000') }, { ...DEFAULT_BALANCE_OPTIONS, pendingSubscriptions: true }).toFixed(2)).toBe('-45000.00')
  })
})

describe('formatSignedArs (ADR-051)', () => {
  it('lo que suma lleva +, lo que resta -, y cero no lleva signo', () => {
    expect(formatSignedArs(new Decimal('60000'))).toBe('+$60.000,00')
    expect(formatSignedArs(new Decimal('-20000'))).toBe('-$20.000,00')
    expect(formatSignedArs(new Decimal('0'))).toBe('$0,00')
    expect(formatSignedArs(new Decimal('-0'))).toBe('$0,00')
  })
})
