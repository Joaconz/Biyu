import { Decimal, formatArs, formatUsd } from './money'
import { generateLedgerEntries, type LedgerEntryDraft } from './installments'
import { currentPeriod, formatDisplayDate, isPeriodBefore, periodOf, type Period } from './period'

export interface DeletionPeriodImpact {
  period: Period
  amountArs: Decimal
  installmentNumber: number
}

export interface DeletionImpactSummary {
  hasClosedPeriodImpact: boolean
  affectedPeriods: DeletionPeriodImpact[]
  totalClosedAmountArs: Decimal
}

/**
 * Calcula el impacto del borrado de una transacción sobre meses ya cerrados (anteriores al mes actual).
 * Regla C10 / FR-08 / US-65: si toca meses anteriores al actual, se debe avisar qué totales cambian.
 */
export function computeDeletionImpact(
  entries: LedgerEntryDraft[],
  current: Period,
): DeletionImpactSummary {
  const affected: DeletionPeriodImpact[] = entries
    .filter((e) => isPeriodBefore(e.period, current))
    .map((e) => ({
      period: e.period,
      amountArs: e.amountArs,
      installmentNumber: e.installmentNumber,
    }))

  const total = affected.reduce(
    (acc, cur) => acc.plus(cur.amountArs),
    new Decimal(0),
  )

  return {
    hasClosedPeriodImpact: affected.length > 0,
    affectedPeriods: affected,
    totalClosedAmountArs: total,
  }
}

export interface TransactionForDeletion {
  amount: Decimal
  fxRate: Decimal | null
  installmentsCount: number
  occurredOn: string
  type: 'expense' | 'income'
}

/**
 * Helper de dominio para evaluar el impacto del borrado a partir de los datos de la transacción
 * y la fecha actual recibida como parámetro (C1: today como parámetro).
 */
export function getTransactionDeletionImpact(
  transaction: TransactionForDeletion,
  todayDate: Date,
): DeletionImpactSummary {
  const current = currentPeriod(todayDate)
  const first = periodOf(transaction.occurredOn)
  const entries = generateLedgerEntries(
    transaction.amount,
    transaction.fxRate,
    transaction.installmentsCount,
    first,
  )
  return computeDeletionImpact(entries, current)
}

/** Una línea de «qué se borra» en la confirmación (US-94). */
export interface DeletionSummaryItem {
  label: string
  value: string
}

export interface TransactionToSummarize {
  type: 'expense' | 'income'
  amount: Decimal
  currency: 'ARS' | 'USD'
  categoryName: string | null
  accountName: string | null
  occurredOn: string // YYYY-MM-DD
  installmentsCount: number
}

/**
 * Qué movimiento se va a borrar, para la confirmación (US-94): tipo y monto total en su moneda,
 * categoría (un ingreso puede no tener), cuenta, fecha y, en una compra en cuotas, cuántas son.
 */
export function transactionDeletionSummary(t: TransactionToSummarize): DeletionSummaryItem[] {
  const items: DeletionSummaryItem[] = [
    { label: t.type === 'expense' ? 'Gasto' : 'Ingreso', value: t.currency === 'USD' ? formatUsd(t.amount) : formatArs(t.amount) },
  ]
  if (t.categoryName) items.push({ label: 'Categoría', value: t.categoryName })
  if (t.accountName) items.push({ label: 'Cuenta', value: t.accountName })
  items.push({ label: 'Fecha', value: formatDisplayDate(t.occurredOn) })
  if (t.installmentsCount > 1) items.push({ label: 'Cuotas', value: `${t.installmentsCount} cuotas` })
  return items
}
