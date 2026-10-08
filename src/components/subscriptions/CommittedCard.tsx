import {
  committedCountText,
  committedLabel,
  committedUsdPendingText,
  type CommittedMonthly,
} from '@/domain/subscriptions'
import { formatArs } from '@/domain/money'

/**
 * Primera tarjeta de Suscripciones (US-63): cuánto está comprometido este mes. Sin elementos
 * interactivos; el cálculo es `committedMonthlyTotal` (ADR-033) y acá solo se muestra.
 */
export function CommittedCard({ committed }: { committed: CommittedMonthly }) {
  return (
    <section
      data-testid="subscriptions-committed"
      className="mb-6 flex flex-col gap-1 rounded-xl border border-hairline bg-card px-4 py-4"
    >
      <h2 className="text-footnote font-medium text-muted-foreground">{committedLabel(committed.period)}</h2>
      <p data-testid="subscriptions-committed-total" className="tabular text-title-1 font-bold text-foreground">
        {formatArs(committed.totalArs)}
      </p>
      <p data-testid="subscriptions-committed-count" className="text-callout text-muted-foreground">
        {committedCountText(committed.count)}
      </p>
      {committed.usdPending && (
        <p data-testid="subscriptions-committed-usd-pending" className="tabular text-callout text-warning">
          {committedUsdPendingText(committed.usdPending, committed.period)}
        </p>
      )}
    </section>
  )
}
