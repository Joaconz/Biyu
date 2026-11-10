// Qué entra en el gasto neto del Resumen (ADR-053, que reemplaza el balance de ADR-047/ADR-051) y cómo se
// desglosa. Funciones puras: las opciones entran por parámetro (C1) y los montos son Decimal (C2).
// El número parte de lo gastado y cada opción lo mueve: Gastado, ingresos, el desglose por categoría y el
// neto de reembolsos de otras tarjetas no dependen de estas opciones.
import { Decimal } from './money'

/** Qué mueve el gasto neto además de lo gastado. */
export interface BalanceOptions {
  /** Resta los ingresos del mes: con más ingresos que gastos el número queda negativo (ADR-053). */
  income: boolean
  /** Movimiento de las deudas sueltas del mes (ADR-041). */
  looseDebts: boolean
  /** Lo que el neto de reembolsos descuenta del gastado: deudas vinculadas a un gasto compartido (ADR-006). */
  reimbursements: boolean
  /** Suma lo que las suscripciones activas todavía van a cobrar en el mes (ADR-045). */
  pendingSubscriptions: boolean
}

/** «Solo gastos»: ninguna opción incluida, el número es lo gastado y nada más (ADR-053). */
export const ONLY_EXPENSES: BalanceOptions = {
  income: false,
  looseDebts: false,
  reimbursements: false,
  pendingSubscriptions: false,
}

/** Sin preferencia guardada el Resumen muestra lo gastado, como la tarjeta verde de antes. */
export const DEFAULT_BALANCE_OPTIONS: BalanceOptions = ONLY_EXPENSES

/** Las partes del gasto neto de un período, ya calculadas y todas en pesos. */
export interface BalanceParts {
  income: Decimal
  expenses: Decimal
  /** Con signo: negativo si las deudas sueltas sacaron más plata de la que entró. */
  looseDebtMovement: Decimal
  /** Las deudas vinculadas que cuentan para el neto de reembolsos (positivo). */
  reimbursed: Decimal
  /** Lo que las suscripciones activas todavía van a cobrar (positivo). */
  pendingSubscriptions: Decimal
}

/** Una opción del gasto neto: ingresos, deudas sueltas, reembolsos o suscripciones por cobrar. */
export type BalanceOptionKey = keyof BalanceOptions

/** El orden en que se muestran y se suman las opciones, en la hoja del Resumen y en Ajustes. */
export const BALANCE_OPTION_KEYS: readonly BalanceOptionKey[] = [
  'income',
  'looseDebts',
  'reimbursements',
  'pendingSubscriptions',
]

export function isOnlyExpenses(options: BalanceOptions): boolean {
  return BALANCE_OPTION_KEYS.every((key) => !options[key])
}

/**
 * Cuánto movería el resultado «ingresos − gastos» una opción si está incluida, con signo: los ingresos y los
 * reembolsos suman, las deudas sueltas suman su movimiento (negativo si salió más plata de la que entró) y las
 * suscripciones por cobrar restan. El gasto neto es lo gastado menos esta cantidad (ADR-053).
 */
export function optionContribution(parts: BalanceParts, key: BalanceOptionKey): Decimal {
  if (key === 'income') return parts.income
  if (key === 'looseDebts') return parts.looseDebtMovement
  if (key === 'reimbursements') return parts.reimbursed
  return parts.pendingSubscriptions.negated()
}

/**
 * Lo gastado, menos lo que cada opción incluida aporta al resultado: se resta lo que entró (ingresos y
 * reembolsos), se suma lo que salió (deudas prestadas y suscripciones por cobrar). Puede ser negativo
 * (ADR-053). Las cuatro partes son conjuntos disjuntos: las sueltas no tienen gasto de origen y los
 * reembolsos son las vinculadas (ADR-047 §4).
 */
export function computeNetSpent(parts: BalanceParts, options: BalanceOptions): Decimal {
  return BALANCE_OPTION_KEYS.reduce(
    (spent, key) => (options[key] ? spent.minus(optionContribution(parts, key)) : spent),
    parts.expenses,
  )
}

/** Si el mes tiene algo de cada opción: sin nada, la opción no tiene línea en el desglose aunque esté incluida. */
export type BalanceActivity = Record<BalanceOptionKey, boolean>

/** Una línea del desglose del gasto neto, con lo que suma (positivo) o resta (negativo) al número. */
export interface BalanceLine {
  key: 'expenses' | BalanceOptionKey
  amount: Decimal
}

/**
 * El desglose a la vista (ADR-053): `included` son las líneas que suman al número, en orden, y su suma es
 * exactamente el gasto neto; `excluded`, las opciones que el mes tiene pero que el usuario dejó afuera, con lo
 * que moverían el número si las incluyera. Una opción sin actividad en el mes no aparece en ninguna.
 */
export function spentBreakdown(
  parts: BalanceParts,
  options: BalanceOptions,
  activity: BalanceActivity,
): { included: BalanceLine[]; excluded: BalanceLine[] } {
  const included: BalanceLine[] = [{ key: 'expenses', amount: parts.expenses }]
  const excluded: BalanceLine[] = []
  for (const key of BALANCE_OPTION_KEYS) {
    if (!activity[key]) continue
    const line = { key, amount: optionContribution(parts, key).negated() }
    if (options[key]) included.push(line)
    else excluded.push(line)
  }
  return { included, excluded }
}

/**
 * «Gastos − ingresos + deudas sueltas − reembolsos + suscripciones por cobrar»: lo que el número incluye, a la
 * vista. Sin ninguna opción dice «Solo gastos» (ADR-053).
 */
export function spentFormulaText(options: BalanceOptions): string {
  if (isOnlyExpenses(options)) return 'Solo gastos'
  const parts = ['Gastos']
  if (options.income) parts.push('− ingresos')
  if (options.looseDebts) parts.push('+ deudas sueltas')
  if (options.reimbursements) parts.push('− reembolsos')
  if (options.pendingSubscriptions) parts.push('+ suscripciones por cobrar')
  return parts.join(' ')
}

/** El rótulo de la tarjeta: «Gastado» solo con gastos, «Gastado neto» si alguna opción mueve el número. */
export function spentLabel(options: BalanceOptions): string {
  return isOnlyExpenses(options) ? 'Gastado' : 'Gastado neto'
}

/** Las suscripciones por cobrar del período, tal como las necesita el número (ADR-045). */
export interface PendingForSpent {
  totalArs: Decimal
  count: number
}

/** Lo que el Resumen ya calculó del mes y el número necesita, sin las suscripciones por cobrar (viven en otra carga). */
export interface SpentInputs {
  parts: BalanceParts
  looseDebtActivity: boolean
  hasReimbursements: boolean
}

/** Todo lo que el héroe del Resumen muestra del gasto neto, resuelto: la pantalla solo lo formatea (ADR-053). */
export interface SpentView {
  /** Las opciones que de verdad cuentan: sin la carga de suscripciones, esa opción no suma (número y fórmula coinciden). */
  effective: BalanceOptions
  net: Decimal
  included: BalanceLine[]
  excluded: BalanceLine[]
  /** Lo que cada opción mueve el número este mes, con signo; `null` si el mes no tiene nada de eso. */
  amounts: Record<BalanceOptionKey, Decimal | null>
  /** Cómo quedaría el número con las suscripciones por cobrar incluidas; `null` si esa carga no llegó. */
  netWithPending: Decimal | null
}

/**
 * Resuelve el gasto neto del mes con sus líneas: qué opciones tienen actividad (sin actividad no hay línea),
 * cuánto mueve cada una y cómo quedaría con las suscripciones por cobrar. Mientras la carga de suscripciones
 * no llegó (`pending` nulo), esa opción no entra (ADR-045). Función pura: sin reloj (C1), con `Decimal` (C2).
 */
export function spentView(inputs: SpentInputs, pending: PendingForSpent | null, options: BalanceOptions): SpentView {
  const effective = pending ? options : { ...options, pendingSubscriptions: false }
  const parts = { ...inputs.parts, pendingSubscriptions: pending?.totalArs ?? new Decimal(0) }
  const activity: BalanceActivity = {
    income: parts.income.gt(0),
    looseDebts: inputs.looseDebtActivity,
    reimbursements: inputs.hasReimbursements,
    pendingSubscriptions: (pending?.count ?? 0) > 0,
  }
  const { included, excluded } = spentBreakdown(parts, effective, activity)
  const amounts = Object.fromEntries(
    BALANCE_OPTION_KEYS.map((key) => [key, activity[key] ? optionContribution(parts, key).negated() : null]),
  ) as Record<BalanceOptionKey, Decimal | null>
  return {
    effective,
    net: computeNetSpent(parts, effective),
    included,
    excluded,
    amounts,
    netWithPending: pending ? computeNetSpent(parts, { ...effective, pendingSubscriptions: true }) : null,
  }
}
