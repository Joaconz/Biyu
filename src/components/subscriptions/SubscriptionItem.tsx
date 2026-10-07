import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import {
  billingDayText,
  endedText,
  isEnded,
  subscriptionAmountText,
  type SubscriptionRecord,
} from '@/domain/subscriptions'
import { cn } from '@/lib/utils'

/**
 * Fila de Suscripciones (US-52): nombre y día de cobro a la izquierda, monto a la derecha. Una
 * terminada (ADR-032) muestra "Terminó en…" en lugar del día de cobro y sigue en "Activas".
 */
export function SubscriptionItem({ subscription, today }: { subscription: SubscriptionRecord; today: Date }) {
  const ended = isEnded(subscription, today)
  const muted = ended || subscription.status !== 'active'
  return (
    <Link
      to={`/subscriptions/${subscription.id}`}
      data-testid="subscriptions-item"
      data-subscription-id={subscription.id}
      data-status={subscription.status}
      className="press flex min-h-16 items-center gap-3 py-3 pr-3 pl-4 outline-offset-[-2px] hover:bg-accent/60"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span
          data-testid="subscriptions-item-name"
          className={cn('truncate text-callout font-semibold', muted ? 'text-muted-foreground' : 'text-foreground')}
        >
          {subscription.name}
        </span>
        {ended && subscription.endPeriod ? (
          <span data-testid="subscriptions-item-ended" className="text-footnote text-muted-foreground">
            {endedText(subscription.endPeriod)}
          </span>
        ) : (
          <span data-testid="subscriptions-item-billing-day" className="text-footnote text-muted-foreground">
            {billingDayText(subscription.billingDay)}
          </span>
        )}
      </div>
      <span
        data-testid="subscriptions-item-amount"
        className={cn('tabular shrink-0 text-callout font-semibold', muted ? 'text-muted-foreground' : 'text-foreground')}
      >
        {subscriptionAmountText(subscription.amount, subscription.currency)}
      </span>
      <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
    </Link>
  )
}
