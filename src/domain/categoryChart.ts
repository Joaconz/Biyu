import { Decimal } from './money'
import { formatPercentage, percentageOf, type CategoryExpenseSummary } from './summary'

/** Con más categorías que esto, la torta agrupa desde la sexta en "Resto" (US-72, ADR-038). */
export const MAX_PIE_SLICES = 6
const SHOWN_BEFORE_REST = MAX_PIE_SLICES - 1

export interface PieSlice {
  /** id de la categoría, o "rest" para la porción agrupada. */
  key: string
  name: string
  /** Color guardado de la categoría; null en "Resto" (va en el gris del borde de control). */
  color: string | null
  isRest: boolean
  /** Categorías que representa: 1, o las agrupadas en "Resto". */
  count: number
  amount: Decimal
  /** Sobre el total gastado del período, con la regla común (1 decimal, ROUND_HALF_UP). */
  percentage: Decimal
  /** Grados desde las 12 en sentido horario, a 1 decimal, del monto exacto acumulado. */
  startAngle: Decimal
  endAngle: Decimal
}

/**
 * Porciones de la torta de "Por categoría" (US-72). Recibe las categorías ya ordenadas como la
 * lista (compareCategoryExpenses) y el total gastado del período (la tarjeta "Gastado en").
 * Hasta 6 categorías hay una porción por cada una; con 7 o más, las 5 primeras y "Resto".
 * Los ángulos salen de los montos exactos acumulados sobre la suma de las porciones, no del
 * porcentaje redondeado, así la última siempre cierra en 360. Esa suma es igual al total gastado:
 * Postgres exige categoría en todo gasto (04-data-model, transactions.category_id).
 */
export function buildCategoryPie(
  categories: readonly Pick<CategoryExpenseSummary, 'id' | 'name' | 'color' | 'amount'>[],
  totalExpenses: Decimal,
): PieSlice[] {
  const grouped = categories.length > MAX_PIE_SLICES
  const shown = grouped ? categories.slice(0, SHOWN_BEFORE_REST) : categories
  const parts = shown.map((c) => ({ key: c.id, name: c.name, color: c.color, isRest: false, count: 1, amount: c.amount }))
  if (grouped) {
    const rest = categories.slice(SHOWN_BEFORE_REST)
    parts.push({
      key: 'rest',
      name: `Resto (${rest.length} categorías)`,
      color: null,
      isRest: true,
      count: rest.length,
      amount: rest.reduce((acc, c) => acc.plus(c.amount), new Decimal(0)),
    })
  }

  const pieTotal = parts.reduce((acc, p) => acc.plus(p.amount), new Decimal(0))
  if (pieTotal.lte(0)) return []

  let accumulated = new Decimal(0)
  return parts.map((p) => {
    const startAngle = angleOf(accumulated, pieTotal)
    accumulated = accumulated.plus(p.amount)
    return { ...p, percentage: percentageOf(p.amount, totalExpenses), startAngle, endAngle: angleOf(accumulated, pieTotal) }
  })
}

function angleOf(accumulated: Decimal, total: Decimal): Decimal {
  return accumulated.dividedBy(total).times(360).toDecimalPlaces(1, Decimal.ROUND_HALF_UP)
}

/**
 * Texto alternativo de la torta: "Gasto por categoría en septiembre 2026: Comida y supermercado
 * 40,0 %, …", en el orden de las porciones. `periodLabel` es formatPeriodLong del período.
 */
export function categoryPieLabel(periodLabel: string, slices: readonly PieSlice[]): string {
  return `Gasto por categoría en ${periodLabel}: ${slices.map((s) => `${s.name} ${formatPercentage(s.percentage)}`).join(', ')}`
}
