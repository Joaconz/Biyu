import { formatPeriod, type Period } from './period'
import { Decimal, parseMoney } from './money'

// Filas tal como las devuelve PostgREST: los montos son string (C2).
export interface SummaryEntry {
  period: string // YYYY-MM-01
  installment_number: number
  amount_ars: string
  transaction: {
    id: string
    type: 'expense' | 'income'
    category_id: string | null
    account_id: string
    first_period: string
    deleted_at: string | null
    category?: {
      id: string
      name: string
      color: string | null
      archived_at: string | null
    } | null
  }
}

export interface SummaryDebt {
  transaction_id: string | null
  direction: 'owed_to_me' | 'i_owe'
  amount_ars: string
  transaction_first_period: string | null
}

export interface CategoryExpenseSummary {
  id: string
  name: string
  color: string | null
  isArchived: boolean
  amount: Decimal
  percentage: number // 0..100
}

export interface MonthlySummary {
  expenses: Decimal
  income: Decimal
  balance: Decimal
  inheritedInstallments: Decimal // cuotas con installment_number > 1
  netOfReimbursements: Decimal
  byCategory: Map<string | null, Decimal>
  byAccount: Map<string, Decimal>
  categoryExpenses: CategoryExpenseSummary[]
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
  let income = new Decimal(0)
  let inherited = new Decimal(0)
  const byCategory = new Map<string | null, Decimal>()
  const byAccount = new Map<string, Decimal>()

  const categoryMap = new Map<
    string,
    {
      name: string
      color: string | null
      isArchived: boolean
      amount: Decimal
    }
  >()

  for (const e of entries) {
    if (e.period !== key || e.transaction.deleted_at) continue // I10
    const amount = parseMoney(e.amount_ars)
    if (e.transaction.type === 'income') {
      income = income.plus(amount)
      continue
    }
    expenses = expenses.plus(amount)
    if (e.installment_number > 1) inherited = inherited.plus(amount)
    add(byCategory, e.transaction.category_id, amount)
    add(byAccount, e.transaction.account_id, amount)

    if (e.transaction.category_id) {
      const catId = e.transaction.category_id
      const existing = categoryMap.get(catId)
      if (existing) {
        existing.amount = existing.amount.plus(amount)
      } else {
        categoryMap.set(catId, {
          name: e.transaction.category?.name ?? 'Sin categoría',
          color: e.transaction.category?.color ?? null,
          isArchived: Boolean(e.transaction.category?.archived_at),
          amount,
        })
      }
    }
  }

  // Ordenadas de mayor a menor para identificar dónde se concentra el gasto (US-27)
  const categoryExpenses: CategoryExpenseSummary[] = Array.from(categoryMap.entries())
    .map(([id, info]) => {
      const percentage = expenses.isZero()
        ? 0
        : info.amount
            .dividedBy(expenses)
            .times(100)
            .toDecimalPlaces(1, Decimal.ROUND_HALF_UP)
            .toNumber()
      return {
        id,
        name: info.name,
        color: info.color,
        isArchived: info.isArchived,
        amount: info.amount,
        percentage,
      }
    })
    .sort((a, b) => b.amount.comparedTo(a.amount))

  // La deuda se imputa entera al mes de nacimiento de la compra (04-data-model, consulta 6).
  const reimbursed = debts
    .filter((d) => d.direction === 'owed_to_me' && d.transaction_first_period === key)
    .reduce((acc, d) => acc.plus(parseMoney(d.amount_ars)), new Decimal(0))

  return {
    expenses,
    income,
    balance: income.minus(expenses),
    inheritedInstallments: inherited,
    netOfReimbursements: expenses.minus(reimbursed),
    byCategory,
    byAccount,
    categoryExpenses,
  }
}
