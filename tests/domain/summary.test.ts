import { describe, expect, it } from 'vitest'
import { computeMonthlySummary, type SummaryEntry } from '@/domain/summary'

const entry = (o: Partial<SummaryEntry> & { tx?: Partial<SummaryEntry['transaction']> }): SummaryEntry => ({
  period: '2026-09-01', installment_number: 1, amount: '100.00', amount_ars: '100.00',
  transaction: { id: 't', type: 'expense', currency: 'ARS', category_id: 'c1', account_id: 'a1', first_period: '2026-09-01', deleted_at: null, ...o.tx },
  ...o,
})
const P = { year: 2026, month: 9 }

describe('computeMonthlySummary', () => {
  it('período vacío: todo en cero', () => {
    const s = computeMonthlySummary([], [], P)
    expect(s.expenses.toFixed(2)).toBe('0.00')
    expect(s.expensesUsd.toFixed(2)).toBe('0.00')
    expect(s.balance.toFixed(2)).toBe('0.00')
    expect(s.byCategory.size).toBe(0)
  })
  it('gastos, ingresos y balance; ignora otros períodos', () => {
    const s = computeMonthlySummary([
      entry({ amount_ars: '300.10' }),
      entry({ amount_ars: '0.20', tx: { category_id: 'c2' } }),
      entry({ amount_ars: '1000', tx: { type: 'income', category_id: null } }),
      entry({ period: '2026-08-01', amount_ars: '999' }),
    ], [], P)
    expect(s.expenses.toFixed(2)).toBe('300.30')
    expect(s.income.toFixed(2)).toBe('1000.00')
    expect(s.balance.toFixed(2)).toBe('699.70')
    expect(s.byCategory.get('c2')!.toFixed(2)).toBe('0.20')
  })
  it('las transacciones borradas no cuentan (I10)', () => {
    const s = computeMonthlySummary([entry({ tx: { deleted_at: '2026-09-02T00:00:00Z' } })], [], P)
    expect(s.expenses.toFixed(2)).toBe('0.00')
  })
  it('cuotas heredadas: installment_number > 1', () => {
    const s = computeMonthlySummary([entry({ installment_number: 2, amount_ars: '10000' }), entry({ amount_ars: '50' })], [], P)
    expect(s.inheritedInstallments.toFixed(2)).toBe('10000.00')
    expect(s.expenses.toFixed(2)).toBe('10050.00')
  })
  it('neto de reembolsos: bruto 120000 con deuda de 60000 → 60000', () => {
    const s = computeMonthlySummary(
      [entry({ amount_ars: '120000' })],
      [{ transaction_id: 't', direction: 'owed_to_me', amount_ars: '60000', transaction_first_period: '2026-09-01' }],
      P,
    )
    expect(s.expenses.toFixed(2)).toBe('120000.00')
    expect(s.netOfReimbursements.toFixed(2)).toBe('60000.00')
  })
  it('US-25: total gastado suma imputaciones del período y excluye borradas (I10)', () => {
    const s = computeMonthlySummary(
      [
        entry({ amount_ars: '12500.50', tx: { type: 'expense', deleted_at: null } }),
        entry({ amount_ars: '3200.00', tx: { type: 'expense', deleted_at: '2026-09-10T12:00:00Z' } }),
        entry({ period: '2026-10-01', amount_ars: '5000.00', tx: { type: 'expense', deleted_at: null } }),
      ],
      [],
      P,
    )
    expect(s.expenses.toFixed(2)).toBe('12500.50')
  })
  it('US-26: período futuro muestra cuotas comprometidas y excluye otros períodos (supuesto 9)', () => {
    const futurePeriod = { year: 2026, month: 11 }
    const s = computeMonthlySummary(
      [
        // Gasto del mes actual (no debe contar en el futuro)
        entry({ period: '2026-09-01', amount_ars: '1000.00' }),
        // Cuota 3 de compra previa que impacta en noviembre 2026
        entry({ period: '2026-11-01', installment_number: 3, amount_ars: '15000.00' }),
        // Cuota borrada que impactaba en noviembre 2026 (I10)
        entry({ period: '2026-11-01', installment_number: 2, amount_ars: '5000.00', tx: { deleted_at: '2026-09-20T00:00:00Z' } }),
      ],
      [],
      futurePeriod,
    )
    expect(s.expenses.toFixed(2)).toBe('15000.00')
    expect(s.inheritedInstallments.toFixed(2)).toBe('15000.00')
  })
  it('US-24: subtotal en USD de imputaciones en dólares computa por separado', () => {
    const s = computeMonthlySummary(
      [
        // Gasto en USD (100 USD @ 1250 = 125000 ARS)
        entry({ amount: '100.00', amount_ars: '125000.00', tx: { currency: 'USD' } }),
        // Gasto en USD (50.50 USD @ 1200 = 60600 ARS)
        entry({ amount: '50.50', amount_ars: '60600.00', tx: { currency: 'USD' } }),
        // Gasto en ARS (no debe sumar a USD)
        entry({ amount: '25000.00', amount_ars: '25000.00', tx: { currency: 'ARS' } }),
        // Ingreso en USD (no es gasto, no debe sumar a expensesUsd)
        entry({ amount: '500.00', amount_ars: '625000.00', tx: { type: 'income', currency: 'USD' } }),
        // Gasto en USD con borrado lógico (I10: no debe contar)
        entry({ amount: '200.00', amount_ars: '250000.00', tx: { currency: 'USD', deleted_at: '2026-09-15T00:00:00Z' } }),
        // Gasto en USD de otro período (no debe contar en este mes)
        entry({ period: '2026-10-01', amount: '80.00', amount_ars: '100000.00', tx: { currency: 'USD' } }),
      ],
      [],
      P,
    )
    // expenses suma amount_ars de los gastos no borrados de septiembre: 125000 + 60600 + 25000 = 210600.00
    expect(s.expenses.toFixed(2)).toBe('210600.00')
    // expensesUsd suma solo las imputaciones de gastos activos en USD de septiembre: 100.00 + 50.50 = 150.50
    expect(s.expensesUsd.toFixed(2)).toBe('150.50')
  })
  it('US-24: compra en cuotas en USD suma la imputación correspondiente al período', () => {
    // Compra de 100 USD en 3 cuotas (33.33, 33.33, 33.34): en septiembre entra la cuota 1
    const s = computeMonthlySummary(
      [
        entry({ installment_number: 1, amount: '33.33', amount_ars: '41666.66', tx: { currency: 'USD' } }),
        entry({ period: '2026-10-01', installment_number: 2, amount: '33.33', amount_ars: '41666.66', tx: { currency: 'USD' } }),
      ],
      [],
      P,
    )
    expect(s.expensesUsd.toFixed(2)).toBe('33.33')
  })
})
