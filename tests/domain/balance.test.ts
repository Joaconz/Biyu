import { describe, expect, it } from 'vitest'
import {
  BALANCE_OPTION_KEYS,
  computeNetSpent,
  DEFAULT_BALANCE_OPTIONS,
  isOnlyExpenses,
  ONLY_EXPENSES,
  optionContribution,
  spentBreakdown,
  spentFormulaText,
  spentLabel,
  spentView,
  type BalanceActivity,
  type BalanceOptions,
} from '@/domain/balance'
import { Decimal, formatSignedArs } from '@/domain/money'
import { computeMonthlySummary, type LooseDebt, type SummaryDebt, type SummaryEntry } from '@/domain/summary'

// US-101 (#371), ADR-047, ADR-053: qué entra en el gasto neto del Resumen.
const P = { year: 2026, month: 10 }
const none: BalanceOptions = ONLY_EXPENSES
const all: BalanceOptions = { income: true, looseDebts: true, reimbursements: true, pendingSubscriptions: true }
const parts = {
  income: new Decimal('100000'),
  expenses: new Decimal('120000'),
  looseDebtMovement: new Decimal('-20000'),
  reimbursed: new Decimal('60000'),
  pendingSubscriptions: new Decimal('5000'),
}

describe('computeNetSpent (ADR-053)', () => {
  it('sin nada incluido es lo gastado', () => expect(computeNetSpent(parts, none).toFixed(2)).toBe('120000.00'))

  it('el predeterminado es solo gastos', () => {
    expect(DEFAULT_BALANCE_OPTIONS).toEqual({ income: false, looseDebts: false, reimbursements: false, pendingSubscriptions: false })
    expect(computeNetSpent(parts, DEFAULT_BALANCE_OPTIONS).toFixed(2)).toBe('120000.00')
  })

  it('cada opción suma o resta solo lo suyo: lo que entró resta, lo que salió suma', () => {
    expect(computeNetSpent(parts, { ...none, income: true }).toFixed(2)).toBe('20000.00') // 120.000 − 100.000
    expect(computeNetSpent(parts, { ...none, looseDebts: true }).toFixed(2)).toBe('140000.00') // prestó 20.000
    expect(computeNetSpent(parts, { ...none, reimbursements: true }).toFixed(2)).toBe('60000.00') // 120.000 − 60.000
    expect(computeNetSpent(parts, { ...none, pendingSubscriptions: true }).toFixed(2)).toBe('125000.00')
  })

  it('con todo incluido combina las cuatro partes', () => {
    // 120.000 − 100.000 (ingresos) + 20.000 (prestó) − 60.000 (reembolsos) + 5.000 (suscripciones)
    expect(computeNetSpent(parts, all).toFixed(2)).toBe('-15000.00')
  })

  it('con más ingresos que gastos el número queda negativo', () => {
    const rich = { ...parts, income: new Decimal('500000') }
    const net = computeNetSpent(rich, { ...none, income: true })
    expect(net.toFixed(2)).toBe('-380000.00')
    expect(net.isNegative()).toBe(true)
  })

  it('una deuda «debo» (movimiento positivo) baja el número', () => {
    const borrowed = { ...parts, looseDebtMovement: new Decimal('30000') }
    expect(computeNetSpent(borrowed, { ...none, looseDebts: true }).toFixed(2)).toBe('90000.00')
  })

  it('la fórmula dice lo que el número incluye', () => {
    expect(spentFormulaText(none)).toBe('Solo gastos')
    expect(spentFormulaText({ ...none, income: true })).toBe('Gastos − ingresos')
    expect(spentFormulaText(all)).toBe('Gastos − ingresos + deudas sueltas − reembolsos + suscripciones por cobrar')
  })

  it('el rótulo es «Gastado» solo con gastos y «Gastado neto» con cualquier opción', () => {
    expect(spentLabel(none)).toBe('Gastado')
    expect(spentLabel({ ...none, pendingSubscriptions: true })).toBe('Gastado neto')
    expect(spentLabel(all)).toBe('Gastado neto')
  })
})

describe('«Solo gastos» y lo que mueve cada opción (ADR-053)', () => {
  it('solo gastos es no incluir ninguna opción', () => {
    expect(isOnlyExpenses(none)).toBe(true)
    expect(isOnlyExpenses({ ...none, income: true })).toBe(false)
    expect(isOnlyExpenses({ ...none, pendingSubscriptions: true })).toBe(false)
    expect(computeNetSpent(parts, ONLY_EXPENSES).toFixed(2)).toBe(parts.expenses.toFixed(2))
  })

  it('cada opción aporta al resultado «ingresos − gastos» con su signo: las suscripciones por cobrar restan', () => {
    expect(optionContribution(parts, 'income').toFixed(2)).toBe('100000.00')
    expect(optionContribution(parts, 'looseDebts').toFixed(2)).toBe('-20000.00')
    expect(optionContribution(parts, 'reimbursements').toFixed(2)).toBe('60000.00')
    expect(optionContribution(parts, 'pendingSubscriptions').toFixed(2)).toBe('-5000.00')
  })

  it('el orden de las opciones es ingresos, deudas, reembolsos y suscripciones', () => {
    expect(BALANCE_OPTION_KEYS).toEqual(['income', 'looseDebts', 'reimbursements', 'pendingSubscriptions'])
  })
})

describe('spentBreakdown (ADR-053)', () => {
  const allActivity: BalanceActivity = { income: true, looseDebts: true, reimbursements: true, pendingSubscriptions: true }
  const keys = (lines: { key: string }[]) => lines.map((l) => l.key)
  const sum = (lines: { amount: Decimal }[]) => lines.reduce((acc, l) => acc.plus(l.amount), new Decimal(0))

  it('solo gastos deja una línea adentro y las cuatro opciones afuera, con lo que moverían el número', () => {
    const { included, excluded } = spentBreakdown(parts, none, allActivity)
    expect(keys(included)).toEqual(['expenses'])
    expect(included.map((l) => l.amount.toFixed(2))).toEqual(['120000.00'])
    expect(keys(excluded)).toEqual(['income', 'looseDebts', 'reimbursements', 'pendingSubscriptions'])
    expect(excluded.map((l) => l.amount.toFixed(2))).toEqual(['-100000.00', '20000.00', '-60000.00', '5000.00'])
  })

  it('con todo incluido las cinco líneas están adentro y nada queda afuera', () => {
    const { included, excluded } = spentBreakdown(parts, all, allActivity)
    expect(keys(included)).toEqual(['expenses', 'income', 'looseDebts', 'reimbursements', 'pendingSubscriptions'])
    expect(excluded).toEqual([])
  })

  it('una opción sin actividad en el mes no aparece, esté incluida o no', () => {
    const quiet: BalanceActivity = { income: false, looseDebts: false, reimbursements: true, pendingSubscriptions: false }
    expect(keys(spentBreakdown(parts, all, quiet).included)).toEqual(['expenses', 'reimbursements'])
    expect(keys(spentBreakdown(parts, none, quiet).excluded)).toEqual(['reimbursements'])
  })

  it('las líneas de adentro suman exactamente el gasto neto, para las dieciséis combinaciones de opciones', () => {
    for (let mask = 0; mask < 16; mask++) {
      const options = Object.fromEntries(BALANCE_OPTION_KEYS.map((key, i) => [key, Boolean(mask & (1 << i))])) as unknown as BalanceOptions
      const { included, excluded } = spentBreakdown(parts, options, allActivity)
      expect(sum(included).toFixed(2)).toBe(computeNetSpent(parts, options).toFixed(2))
      // Incluir lo de afuera lleva al número con todo incluido.
      expect(sum(included).plus(sum(excluded)).toFixed(2)).toBe(computeNetSpent(parts, all).toFixed(2))
    }
  })
})

describe('spentView (ADR-053)', () => {
  const inputs = { parts, looseDebtActivity: true, hasReimbursements: true }
  const pending = { totalArs: new Decimal('5000'), count: 2 }

  it('sin la carga de suscripciones esa opción no entra, aunque esté prendida', () => {
    const v = spentView(inputs, null, all)
    expect(v.effective.pendingSubscriptions).toBe(false)
    expect(v.net.toFixed(2)).toBe('-20000.00') // todo menos las suscripciones: 120.000 − 100.000 + 20.000 − 60.000
    expect(v.netWithPending).toBeNull()
    expect(v.amounts.pendingSubscriptions).toBeNull()
    expect(v.included.map((l) => l.key)).not.toContain('pendingSubscriptions')
  })

  it('con la carga, las suscripciones suman y «con ellas» es el número incluyéndolas', () => {
    const v = spentView(inputs, pending, none)
    expect(v.net.toFixed(2)).toBe('120000.00')
    expect(v.netWithPending!.toFixed(2)).toBe('125000.00')
    expect(v.amounts.pendingSubscriptions!.toFixed(2)).toBe('5000.00')
    expect(spentView(inputs, pending, all).net.toFixed(2)).toBe(spentView(inputs, pending, all).netWithPending!.toFixed(2))
  })

  it('cada opción dice cuánto mueve el número: lo que entró resta y lo que salió suma', () => {
    const v = spentView(inputs, pending, none)
    expect([v.amounts.income, v.amounts.looseDebts, v.amounts.reimbursements].map((a) => a!.toFixed(2))).toEqual([
      '-100000.00',
      '20000.00',
      '-60000.00',
    ])
  })

  it('una opción sin actividad en el mes no tiene monto ni línea', () => {
    const quiet = { parts: { ...parts, income: new Decimal(0) }, looseDebtActivity: false, hasReimbursements: false }
    const v = spentView(quiet, null, all)
    expect(v.amounts).toEqual({ income: null, looseDebts: null, reimbursements: null, pendingSubscriptions: null })
    expect(v.included.map((l) => l.key)).toEqual(['expenses'])
    expect(v.excluded).toEqual([])
  })

  it('un mes sin movimientos da cero, no -0', () => {
    const empty = {
      parts: { income: new Decimal(0), expenses: new Decimal(0), looseDebtMovement: new Decimal(0), reimbursed: new Decimal(0), pendingSubscriptions: new Decimal(0) },
      looseDebtActivity: false,
      hasReimbursements: false,
    }
    const v = spentView(empty, null, all)
    expect(v.net.isZero()).toBe(true)
    expect(v.net.lt(0)).toBe(false)
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

  it('sin opciones el número es Gastado: los ingresos no lo tocan', () => {
    const s = computeMonthlySummary(entries, [linked], P, [loose])
    expect(s.netSpent.toFixed(2)).toBe('120000.00')
    expect(s.expenses.toFixed(2)).toBe('120000.00')
  })

  it('el reembolso incluido baja el número y no toca Gastado ni el neto de la tarjeta de reembolsos', () => {
    const without = computeMonthlySummary(entries, [linked], P, [], none)
    const included = computeMonthlySummary(entries, [linked], P, [], { ...none, reimbursements: true })
    expect(without.netSpent.toFixed(2)).toBe('120000.00')
    expect(included.netSpent.toFixed(2)).toBe('60000.00')
    expect(included.expenses.toFixed(2)).toBe('120000.00')
    expect(included.netOfReimbursements.toFixed(2)).toBe(without.netOfReimbursements.toFixed(2))
  })

  it('una deuda suelta y una vinculada no se cuentan dos veces', () => {
    const s = computeMonthlySummary(entries, [linked], P, [loose], { ...none, looseDebts: true, reimbursements: true })
    expect(s.netSpent.toFixed(2)).toBe('80000.00') // 120.000 + 20.000 (prestó) − 60.000 (reembolso)
  })

  it('con las deudas sueltas excluidas no hay línea ni cuentan para saber si el mes tiene datos', () => {
    const s = computeMonthlySummary([], [], P, [loose], none)
    expect(s.hasLooseDebtEvents).toBe(false)
    expect(s.looseDebtActivity).toBe(true)
    expect(s.hasData).toBe(false)
    expect(s.netSpent.isZero()).toBe(true)
    expect(computeMonthlySummary([], [], P, [loose], { ...none, looseDebts: true }).hasData).toBe(true)
  })

  it('expone las partes para sumar después las suscripciones por cobrar', () => {
    const s = computeMonthlySummary(entries, [linked], P, [loose], { ...none, looseDebts: true })
    const withPending = computeNetSpent(
      { ...s.balanceParts, pendingSubscriptions: new Decimal('5000') },
      { ...none, looseDebts: true, pendingSubscriptions: true },
    )
    expect(withPending.toFixed(2)).toBe('145000.00') // 120.000 + 20.000 (prestó) + 5.000
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
