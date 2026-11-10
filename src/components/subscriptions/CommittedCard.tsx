import {
  committedCountText,
  committedLabel,
  committedUsdPendingText,
  type CommittedMonthly,
} from '@/domain/subscriptions'
import { formatArs } from '@/domain/money'
import { Amount } from '@/components/shared/Amount'

/**
 * Primera tarjeta de Suscripciones (US-63): cuánto está comprometido este mes, como tarjeta protagonista
 * (ADR-052). Sin elementos interactivos; el cálculo es `committedMonthlyTotal` (ADR-033) y acá solo se muestra.
 */
export function CommittedCard({ committed }: { committed: CommittedMonthly }) {
  return (
    <section
      data-testid="subscriptions-committed"
      className="hero mb-8 flex flex-col items-center gap-1.5 rounded-3xl px-6 py-8 text-center ring-1 ring-hero-foreground/8 ring-inset"
    >
      <h2 className="text-footnote font-medium text-hero-muted first-letter:uppercase">{committedLabel(committed.period)}</h2>
      <Amount
        data-testid="subscriptions-committed-total"
        text={formatArs(committed.totalArs)}
        className="text-display font-bold tracking-tight"
      />
      <p data-testid="subscriptions-committed-count" className="text-callout text-hero-muted">
        {committedCountText(committed.count)}
      </p>
      {committed.usdPending && (
        <p data-testid="subscriptions-committed-usd-pending" className="tabular mt-2 rounded-2xl bg-hero-foreground/8 px-4 py-2 text-footnote text-gold">
          {committedUsdPendingText(committed.usdPending, committed.period)}
        </p>
      )}
    </section>
  )
}
