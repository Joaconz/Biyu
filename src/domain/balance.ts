// Qué entra en el balance del Resumen (US-101, ADR-047) y cómo se desglosa (ADR-051). Funciones puras: las
// opciones entran por parámetro (C1) y los montos son Decimal (C2). Solo cambia el balance: Gastado, ingresos,
// el desglose por categoría y el neto de reembolsos no dependen de estas opciones.
import { Decimal } from './money'

/** Qué suma el balance además de ingresos − gastos. */
export interface BalanceOptions {
  /** Movimiento de las deudas sueltas del mes (ADR-041). */
  looseDebts: boolean
  /** Lo que el neto de reembolsos descuenta del gastado: deudas vinculadas a un gasto compartido (ADR-006). */
  reimbursements: boolean
  /** Resta lo que las suscripciones activas todavía van a cobrar en el mes (ADR-045). */
  pendingSubscriptions: boolean
}

/** Los valores de antes de esta opción: nadie ve cambiar su Resumen sin tocar nada. */
export const DEFAULT_BALANCE_OPTIONS: BalanceOptions = {
  looseDebts: true,
  reimbursements: false,
  pendingSubscriptions: false,
}

/** Las partes del balance de un período, ya calculadas y todas en pesos. */
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

/** Una opción del balance: deudas sueltas, reembolsos o suscripciones por cobrar. */
export type BalanceOptionKey = keyof BalanceOptions

/** El orden en que se muestran y se suman las opciones, en la tarjeta y en Ajustes. */
export const BALANCE_OPTION_KEYS: readonly BalanceOptionKey[] = ['looseDebts', 'reimbursements', 'pendingSubscriptions']

/** «Solo movimientos»: ninguna opción incluida, el balance es ingresos − gastos (ADR-051). */
export const ONLY_MOVEMENTS: BalanceOptions = { looseDebts: false, reimbursements: false, pendingSubscriptions: false }

export function isOnlyMovements(options: BalanceOptions): boolean {
  return BALANCE_OPTION_KEYS.every((key) => !options[key])
}

/**
 * Cuánto mueve el balance una opción si está incluida, con signo: las deudas sueltas suman su movimiento
 * (negativo si salió más plata de la que entró), los reembolsos suman y las suscripciones por cobrar restan.
 */
export function optionContribution(parts: BalanceParts, key: BalanceOptionKey): Decimal {
  if (key === 'looseDebts') return parts.looseDebtMovement
  if (key === 'reimbursements') return parts.reimbursed
  return parts.pendingSubscriptions.negated()
}

/**
 * Ingresos − gastos, más el movimiento de las deudas sueltas y los reembolsos si están incluidos, menos las
 * suscripciones por cobrar si están incluidas (ADR-047 §3). Las tres partes son conjuntos disjuntos: las
 * sueltas no tienen gasto de origen y los reembolsos son las vinculadas (ADR-047 §4).
 */
export function computeBalance(parts: BalanceParts, options: BalanceOptions): Decimal {
  return BALANCE_OPTION_KEYS.reduce(
    (balance, key) => (options[key] ? balance.plus(optionContribution(parts, key)) : balance),
    parts.income.minus(parts.expenses),
  )
}

/** Si el mes tiene algo de cada opción: sin nada, la opción no tiene línea en el desglose aunque esté incluida. */
export type BalanceActivity = Record<BalanceOptionKey, boolean>

/** Una línea del desglose del balance, con lo que suma (positivo) o resta (negativo). */
export interface BalanceLine {
  key: 'income' | 'expenses' | BalanceOptionKey
  amount: Decimal
}

/**
 * El desglose del balance a la vista (ADR-051): `included` son las líneas que suman al número, en orden, y
 * su suma es exactamente el balance; `excluded`, las opciones que el mes tiene pero que el usuario dejó
 * afuera, con lo que moverían si las incluyera. Una opción sin actividad en el mes no aparece en ninguna.
 */
export function balanceBreakdown(
  parts: BalanceParts,
  options: BalanceOptions,
  activity: BalanceActivity,
): { included: BalanceLine[]; excluded: BalanceLine[] } {
  const included: BalanceLine[] = [
    { key: 'income', amount: parts.income },
    { key: 'expenses', amount: parts.expenses.negated() },
  ]
  const excluded: BalanceLine[] = []
  for (const key of BALANCE_OPTION_KEYS) {
    if (!activity[key]) continue
    const line = { key, amount: optionContribution(parts, key) }
    if (options[key]) included.push(line)
    else excluded.push(line)
  }
  return { included, excluded }
}

/**
 * «Ingresos − gastos + deudas sueltas − suscripciones por cobrar»: lo que el balance incluye, a la vista
 * (ADR-047 §7). Sin ninguna opción lo dice con nombre, «Solo movimientos» (ADR-051).
 */
export function balanceFormulaText(options: BalanceOptions): string {
  if (isOnlyMovements(options)) return 'Solo movimientos: ingresos − gastos'
  const parts = ['Ingresos − gastos']
  if (options.looseDebts) parts.push('+ deudas sueltas')
  if (options.reimbursements) parts.push('+ reembolsos')
  if (options.pendingSubscriptions) parts.push('− suscripciones por cobrar')
  return parts.join(' ')
}
