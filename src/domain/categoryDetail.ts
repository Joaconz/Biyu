import { Decimal, parseMoney } from './money'
import { addMonths, toDbDate, type Period } from './period'
import { percentageOf, type SummaryEntry } from './summary'

// Detalle de una categoría (US-73, ADR-038). Todo sale de las imputaciones guardadas (ADR-001) en
// ARS (amount_ars, I1'), solo gastos de transacciones no eliminadas (I10).

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Si el `categoryId` de la URL puede ser un UUID; si no, la categoría no existe y no se consulta nada (CA-18). */
export function isUuid(value: string): boolean {
  return UUID_RE.test(value)
}

export interface CategoryPeriodTotals {
  amount: Decimal
  /** Sobre el total gastado del período: el mismo número que la fila del Resumen (CA-3). */
  percentage: Decimal
  /** Cuotas con número mayor a 1 (US-16). */
  inheritedInstallments: Decimal
  /** Subtotal en dólares de sus gastos en USD (US-24); cero si no tiene. */
  expensesUsd: Decimal
}

/** Totales de la tarjeta del detalle a partir de todas las imputaciones del período. */
export function computeCategoryPeriodTotals(
  entries: readonly SummaryEntry[],
  categoryId: string,
  period: Period,
): CategoryPeriodTotals {
  const key = toDbDate(period)
  let total = new Decimal(0)
  let amount = new Decimal(0)
  let inherited = new Decimal(0)
  let usd = new Decimal(0)
  for (const e of entries) {
    if (e.period !== key || e.transaction.deleted_at || e.transaction.type !== 'expense') continue
    const ars = parseMoney(e.amount_ars)
    total = total.plus(ars)
    if (e.transaction.category_id !== categoryId) continue
    amount = amount.plus(ars)
    if (e.installment_number > 1) inherited = inherited.plus(ars)
    // Sin el monto en su moneda no se suma: amount_ars son pesos y no dólares.
    if (e.transaction.currency === 'USD' && e.amount !== undefined) usd = usd.plus(parseMoney(e.amount))
  }
  return { amount, percentage: percentageOf(amount, total), inheritedInstallments: inherited, expensesUsd: usd }
}

/** Cantidad de meses de "Últimos 6 meses". */
export const EVOLUTION_MONTHS = 6

/** Primer período de la evolución: el visto menos 5. */
export function evolutionStart(period: Period): Period {
  return addMonths(period, -(EVOLUTION_MONTHS - 1))
}

/** Imputación de un gasto de la categoría, como la trae la lectura de la evolución. */
export interface EvolutionEntry {
  period: string // YYYY-MM-01
  amount_ars: string
}

export interface EvolutionBar {
  period: Period
  amount: Decimal
  /** Alto de la barra en px: proporcional al mayor de los 6; 2 si es cero y al menos 4 si no. */
  heightPx: number
}

/**
 * Las 6 barras de "Últimos 6 meses", de la más vieja a la vista (`period`). Las entradas ya vienen
 * filtradas a gastos no eliminados de la categoría; un mes sin imputaciones vale $0,00.
 */
export function buildEvolution(entries: readonly EvolutionEntry[], period: Period, maxHeightPx: number): EvolutionBar[] {
  const start = evolutionStart(period)
  const periods = Array.from({ length: EVOLUTION_MONTHS }, (_, i) => addMonths(start, i))
  const amounts = periods.map((p) => {
    const key = toDbDate(p)
    return entries.filter((e) => e.period === key).reduce((acc, e) => acc.plus(parseMoney(e.amount_ars)), new Decimal(0))
  })
  const max = Decimal.max(...amounts)
  return periods.map((p, i) => ({ period: p, amount: amounts[i], heightPx: barHeight(amounts[i], max, maxHeightPx) }))
}

const ZERO_BAR_PX = 2
const MIN_BAR_PX = 4

function barHeight(amount: Decimal, max: Decimal, maxHeightPx: number): number {
  if (amount.lte(0) || max.lte(0)) return ZERO_BAR_PX
  const proportional = amount.dividedBy(max).times(maxHeightPx).toDecimalPlaces(0, Decimal.ROUND_HALF_UP)
  return Decimal.max(proportional, MIN_BAR_PX).toNumber()
}

/** Si los 6 meses están en $0,00 (aparece "Sin gastos en esta categoría en los últimos 6 meses."). */
export function isEvolutionEmpty(bars: readonly EvolutionBar[]): boolean {
  return bars.every((b) => b.amount.isZero())
}

const THOUSAND = new Decimal(1000)
const MILLION_FROM = new Decimal(999950)

/**
 * Monto compacto encima de cada barra (ROUND_HALF_UP): "$950" debajo de mil, "$48,5 mil" hasta
 * $999.950 y "$1,3 M" desde ahí. $999,50 → "$1.000" y $999.949,99 → "$999,9 mil" (CA-23).
 */
export function formatCompactArs(amount: Decimal): string {
  const abs = amount.abs()
  const sign = amount.isNegative() && !amount.isZero() ? '-' : ''
  if (abs.lt(THOUSAND)) return `${sign}$${groupThousands(abs.toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toFixed(0))}`
  if (abs.lt(MILLION_FROM)) return `${sign}$${oneDecimal(abs.dividedBy(THOUSAND))} mil`
  return `${sign}$${oneDecimal(abs.dividedBy(THOUSAND).dividedBy(THOUSAND))} M`
}

function oneDecimal(value: Decimal): string {
  const [int, dec] = value.toDecimalPlaces(1, Decimal.ROUND_HALF_UP).toFixed(1).split('.')
  return `${groupThousands(int)},${dec}`
}

function groupThousands(int: string): string {
  return int.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
