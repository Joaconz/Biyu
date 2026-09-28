import { describe, expect, it } from 'vitest'
import { generateLedgerEntries } from '@/domain/installments'
import { parseMoney } from '@/domain/money'
import { addMonths, toDbDate, type Period } from '@/domain/period'
import { computeMonthlySummary, type SummaryEntry } from '@/domain/summary'

// US-18 · FR-08 · I10: borrar una compra en cuotas saca todas sus imputaciones de todos los períodos.
const AUGUST: Period = { year: 2026, month: 8 }
const JANUARY: Period = { year: 2027, month: 1 }

function installmentPurchase(deletedAt: string | null): SummaryEntry[] {
  return generateLedgerEntries(parseMoney('120000'), null, 12, AUGUST).map((e) => ({
    period: toDbDate(e.period),
    installment_number: e.installmentNumber,
    amount: e.amount.toFixed(2),
    amount_ars: e.amountArs.toFixed(2),
    transaction: {
      id: 'notebook', type: 'expense', currency: 'ARS', category_id: 'c1', account_id: 'visa',
      first_period: toDbDate(AUGUST), deleted_at: deletedAt,
    },
  }))
}

// Un gasto de contado que sigue vivo, para que el total no dé cero por casualidad.
const lunch: SummaryEntry = {
  period: toDbDate(AUGUST), installment_number: 1, amount: '5000.00', amount_ars: '5000.00',
  transaction: {
    id: 'almuerzo', type: 'expense', currency: 'ARS', category_id: 'c1', account_id: 'visa',
    first_period: toDbDate(AUGUST), deleted_at: null,
  },
}

describe('US-18: borrado lógico saca las imputaciones del cálculo (I10)', () => {
  it('antes de borrar, la compra aporta 10000 en 2026-08 y en 2027-01', () => {
    const entries = [...installmentPurchase(null), lunch]
    expect(computeMonthlySummary(entries, [], AUGUST).expenses.toFixed(2)).toBe('15000.00')
    expect(computeMonthlySummary(entries, [], JANUARY).expenses.toFixed(2)).toBe('10000.00')
  })

  it('después de borrar, el total de 2026-08 ya no incluye su imputación', () => {
    const entries = [...installmentPurchase('2026-10-05T12:00:00Z'), lunch]
    const s = computeMonthlySummary(entries, [], AUGUST)
    expect(s.expenses.toFixed(2)).toBe('5000.00')
    expect(s.byCategory.get('c1')?.toFixed(2)).toBe('5000.00')
    expect(s.byAccount.get('visa')?.toFixed(2)).toBe('5000.00')
  })

  it('después de borrar, el total de 2027-01 ya no incluye su imputación', () => {
    const entries = [...installmentPurchase('2026-10-05T12:00:00Z'), lunch]
    const s = computeMonthlySummary(entries, [], JANUARY)
    expect(s.expenses.toFixed(2)).toBe('0.00')
    expect(s.inheritedInstallments.toFixed(2)).toBe('0.00')
    expect(s.byCategory.size).toBe(0)
    expect(s.byAccount.size).toBe(0)
    expect(s.hasData).toBe(false)
  })

  it('ninguna de las 12 cuotas cuenta, pasadas ni futuras', () => {
    const entries = installmentPurchase('2026-10-05T12:00:00Z')
    for (let i = 0; i < 12; i++) {
      const s = computeMonthlySummary(entries, [], addMonths(AUGUST, i))
      expect(s.expenses.isZero()).toBe(true)
      expect(s.hasData).toBe(false)
    }
  })
})
