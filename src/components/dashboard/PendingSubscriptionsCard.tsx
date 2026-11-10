import { Link } from 'react-router'
import { formatArs } from '@/domain/money'
import type { Period } from '@/domain/period'
import {
  committedUsdPendingText,
  pendingChargesCountText,
  pendingChargesLabel,
  type PendingSubscriptionCharges,
} from '@/domain/subscriptions'

/**
 * Lo que las suscripciones activas todavía van a cobrar este mes (ADR-045), en una tarjeta suelta. Con el
 * Resumen cargado esto es una línea del héroe del Resumen (ADR-053): la tarjeta suelta queda para el mes
 * sin movimientos (y para cuando el resumen no carga), donde no hay balance que desglosar. Sin cobros
 * pendientes no se dibuja.
 */
export function PendingSubscriptionsCard({ pending, period }: { pending: PendingSubscriptionCharges | null; period: Period }) {
  if (!pending || pending.count === 0) return null
  return (
    <section
      data-testid="dashboard-pending-subscriptions"
      className="mb-3 flex flex-col gap-1.5 rounded-2xl bg-card p-5 sm:p-6"
    >
      <h2 className="text-footnote font-medium text-muted-foreground">{pendingChargesLabel(period)}</h2>
      <p data-testid="dashboard-pending-subscriptions-total" className="tabular text-title-2 font-bold text-foreground">
        {formatArs(pending.totalArs)}
      </p>
      <p data-testid="dashboard-pending-subscriptions-count" className="text-callout text-muted-foreground">
        {pendingChargesCountText(pending.count)}
      </p>
      {pending.usdPending && (
        <p data-testid="dashboard-pending-subscriptions-usd-pending" className="tabular text-callout text-warning">
          {committedUsdPendingText(pending.usdPending, period)}
        </p>
      )}
      <Link
        to="/subscriptions"
        data-testid="dashboard-pending-subscriptions-link"
        className="press -mb-1 inline-flex min-h-11 items-center self-start text-callout font-medium text-primary hover:underline"
      >
        Ver suscripciones
      </Link>
    </section>
  )
}
