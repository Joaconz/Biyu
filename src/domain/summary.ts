import { formatPeriod, type Period } from './period'
import { Decimal, parseMoney } from './money'

// Filas tal como las devuelve PostgREST: los montos son string (C2).
export interface SummaryEntry {
  period: string // YYYY-MM-01
  installment_number: number
  amount?: string // en la moneda de la transacción (numeric(14,2))
  amount_ars: string
  transaction: {
    id: string
    type: 'expense' | 'income'
    currency?: 'ARS' | 'USD'
    category_id: string | null
    account_id: string
    first_period: string
    deleted_at: string | null
  }
}

export interface SummaryDebt {
  transaction_id: string | null
  direction: 'owed_to_me' | 'i_owe'
  amount_ars: string
  transaction_first_period: string | null
}

export interface MonthlySummary {
  expenses: Decimal
  expensesUsd: Decimal // subtotal en USD de las imputaciones en dólares (US-24)
  income: Decimal
  balance: Decimal
  inheritedInstallments: Decimal // cuotas con installment_number > 1
  netOfReimbursements: Decimal
  byCategory: Map<string | null, Decimal>
  byAccount: Map<string, Decimal>
}

const add = <K,>(map: Map<K, Decimal>, key: K, value: Decimal) =>
  map.set(key, (map.get(key) ?? new Decimal(0)).plus(value))

export function computeMonthlySummary(
  entries: SummaryEntry[],
  debts: SummaryDebt[],
  period: Period,
): MonthlySummary {
  const key = `${formatPeriod(period)}-01`
  let expenses = new Decimal(0)
  let expensesUsd = new Decimal(0)
  let income = new Decimal(0)
  let inherited = new Decimal(0)
  const byCategory = new Map<string | null, Decimal>()
  const byAccount = new Map<string, Decimal>()

  for (const e of entries) {
    if (e.period !== key || e.transaction.deleted_at) continue // I10
    const amount = parseMoney(e.amount_ars)
    if (e.transaction.type === 'income') {
      income = income.plus(amount)
      continue
    }
    expenses = expenses.plus(amount)
    if (e.transaction.currency === 'USD') {
      expensesUsd = expensesUsd.plus(parseMoney(e.amount ?? e.amount_ars))
    }
    if (e.installment_number > 1) inherited = inherited.plus(amount)
    add(byCategory, e.transaction.category_id, amount)
    add(byAccount, e.transaction.account_id, amount)
  }

  // La deuda se imputa entera al mes de nacimiento de la compra (04-data-model, consulta 6).
  const reimbursed = debts
    .filter((d) => d.direction === 'owed_to_me' && d.transaction_first_period === key)
    .reduce((acc, d) => acc.plus(parseMoney(d.amount_ars)), new Decimal(0))

  return {
    expenses,
    expensesUsd,
    income,
    balance: income.minus(expenses),
    inheritedInstallments: inherited,
    netOfReimbursements: expenses.minus(reimbursed),
    byCategory,
    byAccount,
  }
}
