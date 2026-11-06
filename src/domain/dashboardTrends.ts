import { Decimal, parseMoney } from './money'
import { addMonths, isSamePeriod, toDbDate, type Period } from './period'

// Series de las tarjetas de tendencia del Resumen (ADR-050). Todo sale de las imputaciones guardadas
// (ADR-001), en ARS congelados (amount_ars, C5), de transacciones no eliminadas (I10). Sin React ni
// Supabase, y sin leer el reloj: `today` entra como parámetro (C1).

/** Meses de "Gastado vs ingresos" (el período visto y los 5 anteriores), como "Últimos 6 meses" de US-73. */
export const FLOW_MONTHS = 6
/** Meses por delante de "Cuotas que vienen". */
export const UPCOMING_MONTHS = 6

/** Una imputación con lo mínimo que piden las tres series; los montos llegan como texto (C2). */
export interface TrendEntry {
  period: string // YYYY-MM-01
  installment_number: number
  amount_ars: string
  transaction: {
    type: 'expense' | 'income'
    /** Día de la compra, YYYY-MM-DD: marca el día del mes en que cae cada imputación del ritmo. */
    occurred_on: string
    deleted_at: string | null
  }
}

/** Primer y último período que hay que leer para las tres series, de más viejo a más nuevo. */
export function trendRange(period: Period): { from: Period; to: Period } {
  return { from: addMonths(period, -(FLOW_MONTHS - 1)), to: addMonths(period, UPCOMING_MONTHS) }
}

const zero = () => new Decimal(0)

function sumBy(entries: readonly TrendEntry[], key: string, type: 'expense' | 'income'): Decimal {
  let total = zero()
  for (const e of entries) {
    if (e.period !== key || e.transaction.deleted_at || e.transaction.type !== type) continue // I10
    total = total.plus(parseMoney(e.amount_ars))
  }
  return total
}

// ---------------------------------------------------------------------------------------------
// Gastado vs ingresos, seis meses

export interface FlowMonth {
  period: Period
  expenses: Decimal
  income: Decimal
  isCurrent: boolean
}

/** Los 6 meses que terminan en `period`, de más viejo a más nuevo; un mes sin imputaciones vale $0,00. */
export function buildMonthlyFlow(entries: readonly TrendEntry[], period: Period): FlowMonth[] {
  return Array.from({ length: FLOW_MONTHS }, (_, i) => {
    const p = addMonths(period, i - (FLOW_MONTHS - 1))
    const key = toDbDate(p)
    return { period: p, expenses: sumBy(entries, key, 'expense'), income: sumBy(entries, key, 'income'), isCurrent: isSamePeriod(p, period) }
  })
}

export function isFlowEmpty(months: readonly FlowMonth[]): boolean {
  return months.every((m) => m.expenses.isZero() && m.income.isZero())
}

/** Mayor monto de la serie: el techo común del eje (una sola escala para gastos e ingresos). */
export function flowMax(months: readonly FlowMonth[]): Decimal {
  return Decimal.max(zero(), ...months.flatMap((m) => [m.expenses, m.income]))
}

/** Alto de una barra en px: proporcional al techo; 2 px si es cero y al menos 4 si no. */
export function barHeightPx(amount: Decimal, max: Decimal, maxHeightPx: number): number {
  if (amount.lte(0) || max.lte(0)) return 2
  const proportional = amount.dividedBy(max).times(maxHeightPx).toDecimalPlaces(0, Decimal.ROUND_HALF_UP)
  return Decimal.max(proportional, 4).toNumber()
}

// ---------------------------------------------------------------------------------------------
// Ritmo del mes

export interface PacePoint {
  /** Día del mes, 1..N. */
  day: number
  /** Gastado acumulado hasta ese día, incluido; null si el día todavía no llegó (mes en curso). */
  current: Decimal | null
  /** Lo del mes anterior a ese mismo día; null pasado el último día de ese mes. */
  previous: Decimal | null
}

export interface MonthPace {
  /** Días de la escala: el mayor de los dos meses, así el mes de 31 días no se corta contra uno de 28. */
  days: number
  points: PacePoint[]
  /** Último día con dato del mes visto: el de hoy si es el mes en curso, o todo el mes si ya terminó. */
  cutoffDay: number
  currentTotal: Decimal
  /** Lo que el mes anterior llevaba al mismo día de corte. */
  previousAtCutoff: Decimal
  previousTotal: Decimal
  /** currentTotal − previousAtCutoff: positivo = se va gastando más que el mes pasado. */
  delta: Decimal
  /** Si el mes anterior no tiene gastos no hay contra qué comparar y la tarjeta lo dice en vez de graficar. */
  hasPrevious: boolean
  hasCurrent: boolean
}

export function daysInPeriod({ year, month }: Period): number {
  // Date.UTC con argumentos es aritmética de calendario, no lee el reloj (C1).
  return new Date(Date.UTC(year, month, 0)).getUTCDate()
}

/** Día del mes (1..31) de un `YYYY-MM-DD`. */
function dayOfMonth(date: string): number {
  return Number(date.slice(8, 10))
}

/**
 * Gasto de cada día del mes (índice 0 = día 1). La primera cuota cae el día de la compra, acotado al
 * mes. Las cuotas siguientes (número > 1) ya estaban comprometidas al abrir el mes: caen el día 1, así
 * el acumulado termina siempre en el mismo total que la tarjeta "Gastado en" (ADR-050).
 */
function dailyExpenses(entries: readonly TrendEntry[], period: Period): Decimal[] {
  const key = toDbDate(period)
  const length = daysInPeriod(period)
  const days = Array.from({ length }, zero)
  for (const e of entries) {
    if (e.period !== key || e.transaction.deleted_at || e.transaction.type !== 'expense') continue // I10
    const day = e.installment_number > 1 ? 1 : Math.min(Math.max(dayOfMonth(e.transaction.occurred_on), 1), length)
    days[day - 1] = days[day - 1].plus(parseMoney(e.amount_ars))
  }
  return days
}

/**
 * Gasto acumulado por día del mes visto contra el mes anterior (ADR-050). `today` es el día de hoy
 * `YYYY-MM-DD`: en el mes en curso la línea se corta ahí y se compara con el mes pasado a ese mismo
 * día; en un mes terminado se compara todo el mes. Un mes futuro no tiene línea.
 */
export function buildMonthPace(entries: readonly TrendEntry[], period: Period, today: string): MonthPace {
  const previousPeriod = addMonths(period, -1)
  const current = dailyExpenses(entries, period)
  const previous = dailyExpenses(entries, previousPeriod)
  const todayKey = today.slice(0, 7)
  const viewKey = toDbDate(period).slice(0, 7)
  const viewLength = current.length

  let cutoffDay: number
  if (viewKey === todayKey) cutoffDay = Math.min(dayOfMonth(today), viewLength)
  else cutoffDay = viewKey < todayKey ? viewLength : 0

  const days = Math.max(viewLength, previous.length)
  let accCurrent = zero()
  let accPrevious = zero()
  let currentAtCutoff = zero()
  let previousAtCutoff = zero()
  const points: PacePoint[] = []
  for (let day = 1; day <= days; day++) {
    if (day <= viewLength) accCurrent = accCurrent.plus(current[day - 1])
    if (day <= previous.length) accPrevious = accPrevious.plus(previous[day - 1])
    if (day === cutoffDay) {
      currentAtCutoff = accCurrent
      previousAtCutoff = accPrevious
    }
    points.push({
      day,
      current: day <= cutoffDay ? accCurrent : null,
      previous: day <= previous.length ? accPrevious : null,
    })
  }

  const previousTotal = previous.reduce((acc, d) => acc.plus(d), zero())
  const currentTotal = currentAtCutoff
  return {
    days,
    points,
    cutoffDay,
    currentTotal,
    previousAtCutoff,
    previousTotal,
    delta: currentTotal.minus(previousAtCutoff),
    hasPrevious: previousTotal.gt(0),
    hasCurrent: cutoffDay > 0 && current.some((d) => d.gt(0)),
  }
}

/** Coordenadas de la línea acumulada: el mayor valor de ambas líneas es el techo del eje. */
export function paceMax(pace: MonthPace): Decimal {
  let max = zero()
  for (const p of pace.points) {
    if (p.current && p.current.gt(max)) max = p.current
    if (p.previous && p.previous.gt(max)) max = p.previous
  }
  return max
}

// ---------------------------------------------------------------------------------------------
// Cuotas que vienen

export interface UpcomingMonth {
  period: Period
  /** Lo que ya está comprometido ese mes: imputaciones de gastos que caen por delante del período visto. */
  amount: Decimal
}

/**
 * Los 6 meses siguientes al período visto con lo que las cuotas ya cargadas van a imputar. Hoy solo
 * las compras en cuotas tienen imputaciones por adelantado (las suscripciones nacen mes a mes, ADR-045),
 * así que lo que no es cuota no aparece. Es un dato de lo ya comprometido, no una proyección.
 */
export function buildUpcomingInstallments(entries: readonly TrendEntry[], period: Period): UpcomingMonth[] {
  return Array.from({ length: UPCOMING_MONTHS }, (_, i) => {
    const p = addMonths(period, i + 1)
    return { period: p, amount: sumBy(entries, toDbDate(p), 'expense') }
  })
}

export function isUpcomingEmpty(months: readonly UpcomingMonth[]): boolean {
  return months.every((m) => m.amount.isZero())
}

export function upcomingTotal(months: readonly UpcomingMonth[]): Decimal {
  return months.reduce((acc, m) => acc.plus(m.amount), zero())
}

/** Hacia dónde va el ritmo contra el mes anterior: más gasto, menos o igual (también si no hay con qué comparar). */
export type PaceDirection = 'more' | 'less' | 'same' | 'none'

export function paceDirection(pace: MonthPace): PaceDirection {
  if (!pace.hasPrevious || !pace.hasCurrent) return 'none'
  if (pace.delta.isZero()) return 'same'
  return pace.delta.isPositive() ? 'more' : 'less'
}

/** El punto de un día de la escala, acotado a 1..days (para el teclado y el puntero). */
export function paceDayPoint(pace: MonthPace, day: number): PacePoint {
  return pace.points[Math.min(Math.max(Math.round(day), 1), pace.days) - 1]
}
