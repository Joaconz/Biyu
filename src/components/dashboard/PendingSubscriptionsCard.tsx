import { Link } from 'react-router'
import { formatArs, type Decimal } from '@/domain/money'
import type { Period } from '@/domain/period'
import {
  committedUsdPendingText,
  pendingChargesCountText,
  pendingChargesLabel,
  PROJECTED_BALANCE_LABEL,
  type PendingSubscriptionCharges,
} from '@/domain/subscriptions'
import { cn } from '@/lib/utils'

/**
 * Lo que las suscripciones activas todavía van a cobrar este mes (ADR-045). Es una proyección que
 * vive aparte: no entra en Gastado ni en Balance, y con `balance` (el del mes, ya cargado) muestra
 * cuánto quedaría después de esos cobros. Sin cobros pendientes no se dibuja.
 */
export function PendingSubscriptionsCard({
  pending,
  period,
  balance,
  includedInBalance = false,
}: {
  pending: PendingSubscriptionCharges | null
  period: Period
  balance: Decimal | null
  /** US-101: el usuario las incluye en el balance, que ya las descuenta: no se proyecta otro balance (ADR-047 §4). */
  includedInBalance?: boolean
}) {
  if (!pending || pending.count === 0) return null
  const projected = includedInBalance ? null : (balance?.minus(pending.totalArs) ?? null)
  return (
    <section
      data-testid="dashboard-pending-subscriptions"
      className="mb-3 flex flex-col gap-1.5 rounded-2xl border border-hairline bg-card p-4 sm:p-5"
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
      {includedInBalance && (
        <p data-testid="dashboard-pending-subscriptions-included" className="border-t border-hairline pt-2 text-footnote text-muted-foreground">
          Ya están descontadas del balance.
        </p>
      )}
      {projected && (
        <p className="flex flex-wrap items-baseline justify-between gap-x-4 border-t border-hairline pt-2 text-footnote">
          <span className="text-muted-foreground">{PROJECTED_BALANCE_LABEL}</span>
          <span
            data-testid="dashboard-pending-subscriptions-projected-balance"
            className={cn('tabular text-callout font-semibold', projected.isNegative() ? 'text-deficit' : 'text-foreground')}
          >
            {formatArs(projected)}
          </span>
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
