// Qué entra en el balance del Resumen (US-101, ADR-047). Funciones puras: las opciones entran por
// parámetro (C1) y los montos son Decimal (C2). Solo cambia el balance: Gastado, ingresos, el desglose y el
// neto de reembolsos no dependen de estas opciones.
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

/**
 * Ingresos − gastos, más el movimiento de las deudas sueltas y los reembolsos si están incluidos, menos las
 * suscripciones por cobrar si están incluidas (ADR-047 §3). Las tres partes son conjuntos disjuntos: las
 * sueltas no tienen gasto de origen y los reembolsos son las vinculadas (ADR-047 §4).
 */
export function computeBalance(parts: BalanceParts, options: BalanceOptions): Decimal {
  let balance = parts.income.minus(parts.expenses)
  if (options.looseDebts) balance = balance.plus(parts.looseDebtMovement)
  if (options.reimbursements) balance = balance.plus(parts.reimbursed)
  if (options.pendingSubscriptions) balance = balance.minus(parts.pendingSubscriptions)
  return balance
}

/** «Ingresos − gastos + deudas sueltas − suscripciones por cobrar»: lo que el balance incluye, a la vista (ADR-047 §7). */
export function balanceFormulaText(options: BalanceOptions): string {
  const parts = ['Ingresos − gastos']
  if (options.looseDebts) parts.push('+ deudas sueltas')
  if (options.reimbursements) parts.push('+ reembolsos')
  if (options.pendingSubscriptions) parts.push('− suscripciones por cobrar')
  return parts.join(' ')
}
