import { describe, expect, it } from 'vitest'
import {
  computeMonthlySummary,
  countDaysWithTransactions,
  hasMonthlyData,
  type SummaryEntry,
} from '@/domain/summary'

const entry = (o: Partial<SummaryEntry> & { tx?: Partial<SummaryEntry['transaction']> }): SummaryEntry => ({
  period: '2026-09-01', installment_number: 1, amount: '100.00', amount_ars: '100.00',
  transaction: { id: 't', type: 'expense', currency: 'ARS', category_id: 'c1', account_id: 'a1', first_period: '2026-09-01', deleted_at: null, ...o.tx },
  ...o,
})
const P = { year: 2026, month: 9 }

describe('computeMonthlySummary', () => {
  it('período vacío: todo en cero y hasData en false', () => {
    const s = computeMonthlySummary([], [], P)
    expect(s.expenses.toFixed(2)).toBe('0.00')
    expect(s.expensesUsd.toFixed(2)).toBe('0.00')
    expect(s.balance.toFixed(2)).toBe('0.00')
    expect(s.byCategory.size).toBe(0)
    expect(s.hasData).toBe(false)
    expect(hasMonthlyData(s)).toBe(false)
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
  it('US-33: período sin datos retorna hasData en false', () => {
    const s = computeMonthlySummary([], [], P)
    expect(s.hasData).toBe(false)
    expect(hasMonthlyData(s)).toBe(false)
  })
  it('US-33: período con solo transacciones borradas retorna hasData en false (I10)', () => {
    const s = computeMonthlySummary(
      [
        entry({ tx: { deleted_at: '2026-09-10T12:00:00Z' } }),
        entry({ installment_number: 2, tx: { deleted_at: '2026-09-15T08:00:00Z' } }),
      ],
      [],
      P,
    )
    expect(s.hasData).toBe(false)
    expect(hasMonthlyData(s)).toBe(false)
  })
  it('US-33: período con movimientos en otros meses retorna hasData en false para el mes consultado', () => {
    const s = computeMonthlySummary(
      [
        entry({ period: '2026-08-01', amount_ars: '5000.00' }),
        entry({ period: '2026-10-01', amount_ars: '8000.00' }),
      ],
      [],
      P,
    )
    expect(s.hasData).toBe(false)
    expect(hasMonthlyData(s)).toBe(false)
  })
  it('US-33: período con gastos o ingresos activos retorna hasData en true', () => {
    const withExpense = computeMonthlySummary(
      [entry({ period: '2026-09-01', amount_ars: '1500.00' })],
      [],
      P,
    )
    expect(withExpense.hasData).toBe(true)
    expect(hasMonthlyData(withExpense)).toBe(true)

    const withIncome = computeMonthlySummary(
      [entry({ period: '2026-09-01', amount_ars: '50000.00', tx: { type: 'income' } })],
      [],
      P,
    )
    expect(withIncome.hasData).toBe(true)
    expect(hasMonthlyData(withIncome)).toBe(true)
  })

  it('US-27: categoryExpenses desagrega gastos en barras, calcula porcentaje y ordena de mayor a menor', () => {
    const s = computeMonthlySummary(
      [
        entry({
          amount_ars: '20000.00',
          tx: {
            category_id: 'c1',
            category: { id: 'c1', name: 'Supermercado', color: '#10b981', archived_at: null },
          },
        }),
        entry({
          amount_ars: '60000.00',
          tx: {
            category_id: 'c2',
            category: { id: 'c2', name: 'Alquiler', color: '#6366f1', archived_at: null },
          },
        }),
        entry({
          amount_ars: '20000.00',
          tx: {
            category_id: 'c1',
            category: { id: 'c1', name: 'Supermercado', color: '#10b981', archived_at: null },
          },
        }),
      ],
      [],
      P,
    )

    // Total expenses: 100.000 (Alquiler: 60.000 = 60%, Supermercado: 40.000 = 40%)
    expect(s.expenses.toFixed(2)).toBe('100000.00')
    expect(s.categoryExpenses).toHaveLength(2)

    // Primero el mayor (Alquiler)
    expect(s.categoryExpenses[0].id).toBe('c2')
    expect(s.categoryExpenses[0].name).toBe('Alquiler')
    expect(s.categoryExpenses[0].amount.toFixed(2)).toBe('60000.00')
    expect(s.categoryExpenses[0].percentage).toBe(60)
    expect(s.categoryExpenses[0].isArchived).toBe(false)

    // Segundo Supermercado
    expect(s.categoryExpenses[1].id).toBe('c1')
    expect(s.categoryExpenses[1].name).toBe('Supermercado')
    expect(s.categoryExpenses[1].amount.toFixed(2)).toBe('40000.00')
    expect(s.categoryExpenses[1].percentage).toBe(40)
    expect(s.categoryExpenses[1].isArchived).toBe(false)
  })

  it('US-27: categoryExpenses incluye categorías archivadas y las marca visualmente (isArchived)', () => {
    const s = computeMonthlySummary(
      [
        entry({
          amount_ars: '30000.00',
          tx: {
            category_id: 'c-archived',
            category: { id: 'c-archived', name: 'Salidas (antigua)', color: null, archived_at: '2026-08-01T00:00:00Z' },
          },
        }),
        entry({
          amount_ars: '10000.00',
          tx: {
            category_id: 'c-active',
            category: { id: 'c-active', name: 'Comida', color: '#22c55e', archived_at: null },
          },
        }),
      ],
      [],
      P,
    )

    expect(s.categoryExpenses).toHaveLength(2)
    const archivedCat = s.categoryExpenses.find((c) => c.id === 'c-archived')
    expect(archivedCat).toBeDefined()
    expect(archivedCat!.isArchived).toBe(true)
    expect(archivedCat!.name).toBe('Salidas (antigua)')
    expect(archivedCat!.amount.toFixed(2)).toBe('30000.00')
    expect(archivedCat!.percentage).toBe(75)

    const activeCat = s.categoryExpenses.find((c) => c.id === 'c-active')
    expect(activeCat).toBeDefined()
    expect(activeCat!.isArchived).toBe(false)
  })

  it('US-28: accountExpenses desagrega gastos por cuenta, calcula porcentaje y ordena de mayor a menor', () => {
    const s = computeMonthlySummary(
      [
        entry({
          amount_ars: '30000.00',
          tx: {
            account_id: 'acc-bbva',
            account: { id: 'acc-bbva', name: 'BBVA Visa', type: 'credit_card', archived_at: null },
          },
        }),
        entry({
          amount_ars: '50000.00',
          tx: {
            account_id: 'acc-mp',
            account: { id: 'acc-mp', name: 'Mercado Pago', type: 'wallet', archived_at: null },
          },
        }),
        entry({
          amount_ars: '20000.00',
          tx: {
            account_id: 'acc-bbva',
            account: { id: 'acc-bbva', name: 'BBVA Visa', type: 'credit_card', archived_at: null },
          },
        }),
      ],
      [],
      P,
    )

    // Total expenses: 100.000 (BBVA Visa: 50.000 = 50%, Mercado Pago: 50.000 = 50%)
    expect(s.expenses.toFixed(2)).toBe('100000.00')
    expect(s.accountExpenses).toHaveLength(2)

    // Ambos tienen 50.000
    const bbva = s.accountExpenses.find((a) => a.id === 'acc-bbva')
    expect(bbva).toBeDefined()
    expect(bbva!.name).toBe('BBVA Visa')
    expect(bbva!.type).toBe('credit_card')
    expect(bbva!.amount.toFixed(2)).toBe('50000.00')
    expect(bbva!.percentage).toBe(50)
    expect(bbva!.isArchived).toBe(false)

    const mp = s.accountExpenses.find((a) => a.id === 'acc-mp')
    expect(mp).toBeDefined()
    expect(mp!.name).toBe('Mercado Pago')
    expect(mp!.type).toBe('wallet')
    expect(mp!.amount.toFixed(2)).toBe('50000.00')
    expect(mp!.percentage).toBe(50)
    expect(mp!.isArchived).toBe(false)
  })

  it('US-28: accountExpenses ordena de mayor a menor, incluye cuentas archivadas y excluye ingresos y borradas', () => {
    const s = computeMonthlySummary(
      [
        // Gasto en tarjeta de crédito activa: 70.000
        entry({
          amount_ars: '70000.00',
          tx: {
            type: 'expense',
            account_id: 'acc-santander',
            account: { id: 'acc-santander', name: 'Santander Crédito', type: 'credit_card', archived_at: null },
          },
        }),
        // Gasto en cuenta archivada: 30.000
        entry({
          amount_ars: '30000.00',
          tx: {
            type: 'expense',
            account_id: 'acc-galicia-old',
            account: { id: 'acc-galicia-old', name: 'Galicia Débito (cerrada)', type: 'debit_card', archived_at: '2026-07-01T00:00:00Z' },
          },
        }),
        // Ingreso en la misma cuenta: 200.000 (no debe contar como gasto por cuenta)
        entry({
          amount_ars: '200000.00',
          tx: {
            type: 'income',
            account_id: 'acc-santander',
            account: { id: 'acc-santander', name: 'Santander Crédito', type: 'credit_card', archived_at: null },
          },
        }),
        // Gasto borrado: 15.000 (I10)
        entry({
          amount_ars: '15000.00',
          tx: {
            type: 'expense',
            deleted_at: '2026-09-15T00:00:00Z',
            account_id: 'acc-santander',
            account: { id: 'acc-santander', name: 'Santander Crédito', type: 'credit_card', archived_at: null },
          },
        }),
      ],
      [],
      P,
    )

    // Total gastos: 100.000 (70.000 + 30.000)
    expect(s.expenses.toFixed(2)).toBe('100000.00')
    expect(s.accountExpenses).toHaveLength(2)

    // 1º lugar: Santander Crédito (70.000 = 70%)
    expect(s.accountExpenses[0].id).toBe('acc-santander')
    expect(s.accountExpenses[0].name).toBe('Santander Crédito')
    expect(s.accountExpenses[0].type).toBe('credit_card')
    expect(s.accountExpenses[0].amount.toFixed(2)).toBe('70000.00')
    expect(s.accountExpenses[0].percentage).toBe(70)
    expect(s.accountExpenses[0].isArchived).toBe(false)

    // 2º lugar: Galicia Débito (30.000 = 30%)
    expect(s.accountExpenses[1].id).toBe('acc-galicia-old')
    expect(s.accountExpenses[1].name).toBe('Galicia Débito (cerrada)')
    expect(s.accountExpenses[1].type).toBe('debit_card')
    expect(s.accountExpenses[1].amount.toFixed(2)).toBe('30000.00')
    expect(s.accountExpenses[1].percentage).toBe(30)
    expect(s.accountExpenses[1].isArchived).toBe(true)
  })

  it('US-29: total de ingresos y balance (ingresos - gastos) positivo cuando ingresos > gastos', () => {
    const s = computeMonthlySummary(
      [
        // Ingreso sueldo: 350.000
        entry({ amount_ars: '350000.00', tx: { type: 'income', category_id: null } }),
        // Ingreso freelance: 50.000
        entry({ amount_ars: '50000.00', tx: { type: 'income', category_id: null } }),
        // Gastos: 120.000
        entry({ amount_ars: '120000.00', tx: { type: 'expense' } }),
      ],
      [],
      P,
    )

    // Ingresos: 400.000, Gastos: 120.000, Balance: 280.000
    expect(s.income.toFixed(2)).toBe('400000.00')
    expect(s.expenses.toFixed(2)).toBe('120000.00')
    expect(s.balance.toFixed(2)).toBe('280000.00')
    expect(s.balance.isPositive()).toBe(true)
  })

  it('US-29: balance negativo cuando gastos > ingresos (déficit)', () => {
    const s = computeMonthlySummary(
      [
        // Ingreso: 100.000
        entry({ amount_ars: '100000.00', tx: { type: 'income', category_id: null } }),
        // Gasto: 150.000
        entry({ amount_ars: '150000.00', tx: { type: 'expense' } }),
      ],
      [],
      P,
    )

    // Ingresos: 100.000, Gastos: 150.000, Balance: -50.000
    expect(s.income.toFixed(2)).toBe('100000.00')
    expect(s.expenses.toFixed(2)).toBe('150000.00')
    expect(s.balance.toFixed(2)).toBe('-50000.00')
    expect(s.balance.isNegative()).toBe(true)
  })

  it('US-29: ingresos ignora transacciones borradas (I10) y de otros períodos', () => {
    const s = computeMonthlySummary(
      [
        // Ingreso válido del mes actual: 200.000
        entry({ amount_ars: '200000.00', tx: { type: 'income', category_id: null } }),
        // Ingreso borrado del mes actual: 80.000 (I10)
        entry({ amount_ars: '80000.00', tx: { type: 'income', category_id: null, deleted_at: '2026-09-10T12:00:00Z' } }),
        // Ingreso de otro mes: 100.000
        entry({ period: '2026-10-01', amount_ars: '100000.00', tx: { type: 'income', category_id: null } }),
      ],
      [],
      P,
    )

    expect(s.income.toFixed(2)).toBe('200000.00')
    expect(s.expenses.toFixed(2)).toBe('0.00')
    expect(s.balance.toFixed(2)).toBe('200000.00')
  })
})

describe('countDaysWithTransactions (US-32: Días del mes con al menos un registro)', () => {
  it('devuelve 0 si la lista de transacciones está vacía', () => {
    expect(countDaysWithTransactions([], P)).toBe(0)
  })

  it('cuenta correctamente días distintos con transacciones activas dentro del período', () => {
    const transactions = [
      { occurred_on: '2026-09-01', deleted_at: null },
      { occurred_on: '2026-09-01', deleted_at: null },
      { occurred_on: '2026-09-15', deleted_at: null },
    ]
    expect(countDaysWithTransactions(transactions, P)).toBe(2)
  })

  it('ignora transacciones borradas (soft delete, I10)', () => {
    const transactions = [
      { occurred_on: '2026-09-01', deleted_at: null },
      { occurred_on: '2026-09-10', deleted_at: '2026-09-10T12:00:00Z' },
      { occurred_on: '2026-09-20', deleted_at: null },
    ]
    expect(countDaysWithTransactions(transactions, P)).toBe(2)
  })

  it('si todas las transacciones de un día están borradas, no suma ese día', () => {
    const transactions = [
      { occurred_on: '2026-09-01', deleted_at: '2026-09-01T15:00:00Z' },
      { occurred_on: '2026-09-15', deleted_at: null },
    ]
    expect(countDaysWithTransactions(transactions, P)).toBe(1)
  })

  it('ignora transacciones que corresponden a otros períodos', () => {
    const transactions = [
      { occurred_on: '2026-08-31', deleted_at: null },
      { occurred_on: '2026-09-05', deleted_at: null },
      { occurred_on: '2026-10-01', deleted_at: null },
    ]
    expect(countDaysWithTransactions(transactions, P)).toBe(1)
  })
})

