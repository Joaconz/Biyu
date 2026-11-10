import { describe, expect, it } from 'vitest'
import { ONLY_EXPENSES } from '@/domain/balance'
import { formatArs } from '@/domain/money'
import { computeMonthlySummary, hasMonthlyData, looseDebtMovement, type LooseDebt, type SummaryEntry } from '@/domain/summary'

// US-83 (#271), ADR-041, ADR-053: las deudas sueltas mueven el gasto neto del mes por eventos (alta y saldada).
// Con ingresos y deudas incluidos el número es el balance de antes con el signo al revés.
const H = { year: 2026, month: 10 }
const H1 = { year: 2026, month: 9 }
const LOOSE = { ...ONLY_EXPENSES, looseDebts: true }
const INCOME_AND_LOOSE = { ...LOOSE, income: true }

const debt = (patch: Partial<LooseDebt>): LooseDebt => ({
  direction: 'owed_to_me',
  amount_ars: '20000.00',
  incurred_on: '2026-10-05',
  status: 'pending',
  settled_at: null,
  ...patch,
})
const income = (amount: string): SummaryEntry => ({
  period: '2026-10-01',
  installment_number: 1,
  amount_ars: amount,
  transaction: { id: 't1', type: 'income', category_id: null, account_id: 'a', first_period: '2026-10-01', deleted_at: null },
})
const movement = (debts: LooseDebt[], period = H) => looseDebtMovement(debts, period).movement.toFixed(2)

describe('movimiento de deudas sueltas (ADR-041 §2)', () => {
  it('CA-1: «me deben» resta en el alta; con un ingreso de $100.000 el gasto neto es -$80.000', () => {
    const s = computeMonthlySummary([income('100000')], [], H, [debt({})], INCOME_AND_LOOSE)
    expect(formatArs(s.netSpent)).toBe('-$80.000,00')
    expect(formatArs(s.looseDebtMovement)).toBe('-$20.000,00')
    expect(s.hasLooseDebtEvents).toBe(true)
    expect(s.expenses.isZero()).toBe(true)
    expect(formatArs(s.income)).toBe('$100.000,00')
  })

  it('CA-2: «debo» suma en el alta', () => {
    const s = computeMonthlySummary([income('100000')], [], H, [debt({ direction: 'i_owe', amount_ars: '50000.00' })], INCOME_AND_LOOSE)
    expect(formatArs(s.netSpent)).toBe('-$150.000,00')
    expect(formatArs(s.looseDebtMovement)).toBe('$50.000,00')
  })

  it('CA-3: saldar la deuda del mismo mes deja el movimiento en $0,00 y la línea sigue', () => {
    const settled = debt({ status: 'settled', settled_at: '2026-10-07T15:00:00Z' })
    const s = computeMonthlySummary([income('100000')], [], H, [settled], INCOME_AND_LOOSE)
    expect(formatArs(s.netSpent)).toBe('-$100.000,00')
    expect(formatArs(s.looseDebtMovement)).toBe('$0,00')
    expect(s.hasLooseDebtEvents).toBe(true)
  })

  it('CA-4: una deuda de H−1 saldada hoy resta en H−1 y suma en H', () => {
    const d = debt({ incurred_on: '2026-09-10', status: 'settled', settled_at: '2026-10-07T15:00:00Z' })
    expect(movement([d], H1)).toBe('-20000.00')
    expect(movement([d], H)).toBe('20000.00')
  })

  it('CA-5: reabrir saca el evento de H y la línea desaparece; H−1 no cambia', () => {
    const reopened = debt({ incurred_on: '2026-09-10', status: 'pending', settled_at: null })
    expect(looseDebtMovement([reopened], H).hasEvents).toBe(false)
    expect(movement([reopened], H1)).toBe('-20000.00')
  })

  it('CA-6: «debo» de H−1 saldada hoy suma en H−1 y resta en H', () => {
    const d = debt({ direction: 'i_owe', amount_ars: '50000.00', incurred_on: '2026-09-10', status: 'settled', settled_at: '2026-10-07T15:00:00Z' })
    expect(movement([d], H1)).toBe('50000.00')
    expect(movement([d], H)).toBe('-50000.00')
  })

  it('CA-7: usa el amount_ars congelado de la deuda en US$, no el tipo de cambio de hoy (C5)', () => {
    const d = debt({ amount_ars: '50000.00', incurred_on: '2026-09-10', status: 'settled', settled_at: '2026-10-07T15:00:00Z' })
    expect(movement([d], H1)).toBe('-50000.00')
    expect(movement([d], H)).toBe('50000.00')
  })

  it('CA-9: un mes con solo la deuda no es un mes vacío; prestar $20.000 suma $20.000 al gasto neto', () => {
    const s = computeMonthlySummary([], [], H, [debt({})], LOOSE)
    expect(s.hasData).toBe(true)
    expect(hasMonthlyData(s)).toBe(true)
    expect(formatArs(s.netSpent)).toBe('$20.000,00')
  })

  it('sin imputaciones ni eventos sigue siendo un mes vacío (US-33)', () => {
    const s = computeMonthlySummary([], [], H, [debt({ incurred_on: '2026-08-01' })], LOOSE)
    expect(s.hasData).toBe(false)
    expect(s.hasLooseDebtEvents).toBe(false)
    expect(s.netSpent.isZero()).toBe(true)
  })

  it('CA-12: una deuda saldada el 31/10 a las 22:30 de Argentina (01/11 01:30 UTC) cuenta en octubre', () => {
    const d = debt({ incurred_on: '2026-10-01', status: 'settled', settled_at: '2026-11-01T01:30:00Z' })
    const october = looseDebtMovement([d], { year: 2026, month: 10 })
    const november = looseDebtMovement([d], { year: 2026, month: 11 })
    expect(october.movement.toFixed(2)).toBe('0.00') // alta (−) y saldada (+) en octubre
    expect(november.hasEvents).toBe(false)
  })

  it('suma varias deudas y no confunde direcciones', () => {
    const debts = [debt({ amount_ars: '1000.50' }), debt({ direction: 'i_owe', amount_ars: '300.25' })]
    expect(movement(debts)).toBe('-700.25')
  })
})
