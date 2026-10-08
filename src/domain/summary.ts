import { formatPeriod, type Period } from './period'
import { Decimal, parseMoney } from './money'

// Filas como las entrega src/lib/dashboard.ts: los montos son string porque se piden con ::text (C2).
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
    category?: {
      id: string
      name: string
      color: string | null
      archived_at: string | null
    } | null
    account?: {
      id: string
      name: string
      type: string
      archived_at: string | null
    } | null
  }
}

/** Una deuda para el neto de reembolsos (US-30), con lo que hace falta de su gasto de origen. */
export interface SummaryDebt {
  transaction_id: string | null
  direction: 'owed_to_me' | 'i_owe'
  amount_ars: string
  transaction_first_period: string | null
  /** Baja lógica del gasto de origen; null si está vigente o si la deuda es suelta. */
  transaction_deleted_at: string | null
}

export interface CategoryExpenseSummary {
  id: string
  name: string
  color: string | null
  isArchived: boolean
  amount: Decimal
  percentage: number // 0..100
}

export interface AccountExpenseSummary {
  id: string
  name: string
  type: string
  isArchived: boolean
  amount: Decimal
  percentage: number // 0..100
}

export interface MonthlySummary {
  expenses: Decimal
  expensesUsd: Decimal // subtotal en USD de las imputaciones en dólares (US-24)
  income: Decimal
  balance: Decimal
  inheritedInstallments: Decimal // cuotas con installment_number > 1
  /** Total gastado menos las deudas que cuentan para el neto (US-30); puede ser negativo. */
  netOfReimbursements: Decimal
  /** Si alguna deuda cuenta para el neto del período: sin ninguna, la fila no se muestra (US-30 CA-7). */
  hasReimbursements: boolean
  byCategory: Map<string | null, Decimal>
  byAccount: Map<string, Decimal>
  categoryExpenses: CategoryExpenseSummary[]
  accountExpenses: AccountExpenseSummary[]
  hasData: boolean
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
  let hasData = false

  const categoryMap = new Map<
    string,
    {
      name: string
      color: string | null
      isArchived: boolean
      amount: Decimal
    }
  >()

  const accountMap = new Map<
    string,
    {
      name: string
      type: string
      isArchived: boolean
      amount: Decimal
    }
  >()

  for (const e of entries) {
    if (e.period !== key || e.transaction.deleted_at) continue // I10
    hasData = true
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

    if (e.transaction.account_id) {
      const accId = e.transaction.account_id
      const existing = accountMap.get(accId)
      if (existing) {
        existing.amount = existing.amount.plus(amount)
      } else {
        accountMap.set(accId, {
          name: e.transaction.account?.name ?? 'Cuenta',
          type: e.transaction.account?.type ?? 'other',
          isArchived: Boolean(e.transaction.account?.archived_at),
          amount,
        })
      }
    }
  }

  // Ordenadas de mayor a menor para identificar dónde se concentra el gasto (US-27), con el
  // desempate de US-72 para que la torta y la lista tengan siempre el mismo orden.
  const categoryExpenses: CategoryExpenseSummary[] = Array.from(categoryMap.entries())
    .map(([id, info]) => ({
      id,
      name: info.name,
      color: info.color,
      isArchived: info.isArchived,
      amount: info.amount,
      percentage: percentageOf(info.amount, expenses).toNumber(),
    }))
    .sort(compareCategoryExpenses)

  // Ordenadas de mayor a menor para identificar el gasto por cuenta (US-28)
  const accountExpenses: AccountExpenseSummary[] = Array.from(accountMap.entries())
    .map(([id, info]) => {
      const percentage = percentageOf(info.amount, expenses).toNumber()
      return {
        id,
        name: info.name,
        type: info.type,
        isArchived: info.isArchived,
        amount: info.amount,
        percentage,
      }
    })
    .sort((a, b) => b.amount.comparedTo(a.amount))

  // La deuda se imputa entera al mes de nacimiento de la compra (04-data-model, consulta 6, ADR-037 §6).
  const counted = debts.filter((d) => countsForNet(d, key))
  const reimbursed = counted.reduce((acc, d) => acc.plus(parseMoney(d.amount_ars)), new Decimal(0))

  return {
    expenses,
    expensesUsd,
    income,
    balance: income.minus(expenses),
    inheritedInstallments: inherited,
    netOfReimbursements: expenses.minus(reimbursed),
    hasReimbursements: counted.length > 0,
    byCategory,
    byAccount,
    categoryExpenses,
    accountExpenses,
    hasData,
  }
}

/**
 * Porcentaje de un monto sobre el total gastado del período: 1 decimal con ROUND_HALF_UP (31,25 →
 * 31,3). Con total en cero da 0. No se ajusta para que la suma dé 100 (reglas comunes de US-72/73).
 */
export function percentageOf(amount: Decimal, total: Decimal): Decimal {
  if (total.isZero()) return new Decimal(0)
  return amount.dividedBy(total).times(100).toDecimalPlaces(1, Decimal.ROUND_HALF_UP)
}

// Orden alfabético español sin distinguir mayúsculas (sí los acentos).
const CATEGORY_NAME_COLLATOR = new Intl.Collator('es', { sensitivity: 'accent' })

/**
 * Orden de las categorías del Resumen (US-27, US-72): monto de mayor a menor; a igual monto, nombre
 * alfabético; a igual nombre, la activa primero y entre archivadas la de id menor.
 */
export function compareCategoryExpenses(
  a: Pick<CategoryExpenseSummary, 'id' | 'name' | 'isArchived' | 'amount'>,
  b: Pick<CategoryExpenseSummary, 'id' | 'name' | 'isArchived' | 'amount'>,
): number {
  return (
    b.amount.comparedTo(a.amount) ||
    CATEGORY_NAME_COLLATOR.compare(a.name, b.name) ||
    Number(a.isArchived) - Number(b.isArchived) ||
    (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)
  )
}

/**
 * Qué deuda resta en el neto de reembolsos del período (US-30, ADR-037 §6): a favor, pendiente o
 * saldada, vinculada a un gasto sin baja lógica (§4) cuya compra nace en el período. Las sueltas y
 * las `i_owe` no cuentan (ADR-006).
 */
function countsForNet(d: SummaryDebt, periodKey: string): boolean {
  return (
    d.direction === 'owed_to_me' &&
    d.transaction_id !== null &&
    d.transaction_deleted_at === null &&
    d.transaction_first_period === periodKey
  )
}

/**
 * Determina si el resumen mensual tiene datos registrados (US-33).
 */
export function hasMonthlyData(summary: MonthlySummary): boolean {
  return summary.hasData
}

export interface ConsistencyTransaction {
  occurred_on: string // YYYY-MM-DD
  deleted_at: string | null
}

/**
 * Cuenta cuántos días distintos del período tienen al menos una transacción no borrada (US-32, FR-20).
 * Parte de transactions (occurred_on), no de ledger_entries (04-data-model, consulta 7).
 */
export function countDaysWithTransactions(
  transactions: ConsistencyTransaction[],
  period: Period,
): number {
  const prefix = formatPeriod(period) // "YYYY-MM"
  const distinctDays = new Set<string>()

  for (const tx of transactions) {
    if (tx.deleted_at !== null) continue // I10: filtra borradas
    const day = tx.occurred_on.slice(0, 10)
    if (!day.startsWith(prefix)) continue // Solo transacciones del período consultado

    distinctDays.add(day)
  }

  return distinctDays.size
}

/** Porcentaje del desglose con coma decimal y siempre un decimal (es-AR): "54,4 %", "10,0 %". */
export function formatPercentage(value: number | Decimal): string {
  return `${value.toFixed(1).replace('.', ',')} %`
}
