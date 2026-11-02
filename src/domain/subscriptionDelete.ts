import { Decimal, formatArs, formatUsd, parseMoney } from './money'
import { statusText, type SubscriptionRecord } from './subscriptions'

// Eliminar una suscripción (US-88, ADR-044 §4): lo que decide la confirmación del Detalle. Funciones puras.

/** Qué suscripción se va a eliminar, para la confirmación (US-94): nombre, monto y estado. */
export function subscriptionDeletionSummary(
  subscription: Pick<SubscriptionRecord, 'name' | 'amount' | 'currency' | 'status' | 'pausedAt' | 'cancelledAt'>,
): { label: string; value: string }[] {
  const amount: Decimal = parseMoney(subscription.amount)
  return [
    { label: 'Suscripción', value: subscription.name },
    { label: 'Monto mensual', value: subscription.currency === 'USD' ? formatUsd(amount) : formatArs(amount) },
    { label: 'Estado', value: statusText(subscription) },
  ]
}

/**
 * Lo que pasa con los gastos que ya cargó (ADR-044 §4): quedan como movimientos sueltos, con los mismos montos
 * y meses, así los totales no cambian. `count` son los vigentes; null si no se pudieron contar.
 */
export function deleteSubscriptionKeptText(count: number | null): string {
  if (count === null) return 'Los gastos que ya cargó quedan como movimientos sueltos, con los mismos montos y meses.'
  if (count === 0) return 'No tiene gastos cargados.'
  const kept =
    count === 1
      ? 'El gasto que ya cargó queda como un movimiento suelto'
      : `Los ${count} gastos que ya cargó quedan como movimientos sueltos`
  return `${kept}, con los mismos montos y meses.`
}

/** La advertencia fija: deja de generar gastos y no se puede deshacer. */
export const DELETE_SUBSCRIPTION_WARNING = 'Deja de cargar gastos. Esto no se puede deshacer.'

/** Aviso de éxito (US-88). */
export function deletedSubscriptionNotice(name: string): string {
  return `Suscripción ${name} eliminada`
}
