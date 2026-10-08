import { Link, useParams } from 'react-router'
import { GroupedCard } from '@/components/shared/GroupedList'
import { BackHeader } from '@/components/subscriptions/BackHeader'
import { SubscriptionActions } from '@/components/subscriptions/SubscriptionActions'
import { SubscriptionBlockedNotice } from '@/components/subscriptions/SubscriptionBlockedNotice'
import { buttonVariants } from '@/components/ui/button'
import { formatPeriodLong } from '@/domain/period'
import { blockedNotice, type BlockedOccurrence } from '@/domain/subscriptionBlocked'
import { nextChargeText, statusText, subscriptionAmountText, type SubscriptionRecord } from '@/domain/subscriptions'
import { useSubscription } from '@/hooks/useSubscriptions'
import { todayInArgentina } from '@/lib/clock'
import { cn } from '@/lib/utils'

/** Detalle de suscripción (US-52): estado, datos y acciones. Los gastos cargados llegan con su historia. */
export function SubscriptionDetailPage() {
  const { id = '' } = useParams()
  const state = useSubscription(id)
  const subscription = state.status === 'ready' ? state.subscription : null

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col">
      <BackHeader
        to="/subscriptions"
        backTestId="subscription-detail-back"
        title={subscription?.name}
        titleTestId={subscription ? 'subscription-detail-name' : undefined}
      >
        {subscription && (
          <span
            data-testid="subscription-detail-status"
            data-status={subscription.status}
            className={cn(
              'shrink-0 rounded-md px-2 py-1 text-caption font-medium',
              subscription.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground',
            )}
          >
            {statusText(subscription)}
          </span>
        )}
      </BackHeader>

      {state.status === 'loading' && (
        <p data-testid="subscription-detail-loading" className="text-callout text-muted-foreground">
          Cargando…
        </p>
      )}

      {state.status === 'error' && (
        <div className="flex flex-col items-start gap-3">
          <p role="alert" data-testid="subscription-detail-error" className="text-callout text-destructive">
            No pudimos cargar la suscripción.
          </p>
          <button
            type="button"
            data-testid="subscription-detail-retry"
            onClick={state.retry}
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            Reintentar
          </button>
        </div>
      )}

      {state.status === 'ready' && !subscription && (
        <div
          data-testid="subscription-detail-not-found"
          className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-input/50 px-6 py-12 text-center"
        >
          <p className="text-callout text-muted-foreground">No encontramos esta suscripción.</p>
          <Link
            to="/subscriptions"
            data-testid="subscription-detail-not-found-back"
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            Ver suscripciones
          </Link>
        </div>
      )}

      {subscription && state.status === 'ready' && (
        <>
          <BlockedNotice blocked={state.blocked} />
          <SubscriptionData subscription={subscription} generatedPeriods={state.generatedPeriods} />
          <SubscriptionActions
            subscription={subscription}
            generatedPeriods={state.generatedPeriods}
            blocked={state.blocked}
            fxRates={state.fxRates}
            transactionCount={state.transactionCount}
            onChanged={state.refresh}
          />
        </>
      )}
    </div>
  )
}

function BlockedNotice({ blocked }: { blocked: BlockedOccurrence[] }) {
  const notice = blockedNotice(blocked)
  return notice ? <SubscriptionBlockedNotice notice={notice} /> : null
}

function SubscriptionData({
  subscription,
  generatedPeriods,
}: {
  subscription: SubscriptionRecord
  generatedPeriods: ReadonlySet<string>
}) {
  const rows: Array<[string, string, string?]> = [
    ['Monto', subscriptionAmountText(subscription.amount, subscription.currency)],
    ['Categoría', subscription.categoryName],
    ['Medio de pago', subscription.accountName],
    ['Día de cobro', String(subscription.billingDay)],
    ['Desde', formatPeriodLong(subscription.startPeriod)],
    ['Hasta', subscription.endPeriod ? formatPeriodLong(subscription.endPeriod) : 'Sin fin'],
    // US-54: la fecha real según R4, la misma que va a tener la transacción (CA-5).
    ['Próximo cobro', nextChargeText(subscription, generatedPeriods, todayInArgentina()), 'subscription-detail-next-charge'],
  ]
  if (subscription.description) rows.push(['Descripción', subscription.description])

  return (
    <GroupedCard data-testid="subscription-detail-data">
      <dl>
        {rows.map(([label, value, testId]) => (
          <div key={label} className="flex items-baseline justify-between gap-4 border-hairline px-4 py-3 not-first:border-t">
            <dt className="shrink-0 text-callout text-muted-foreground">{label}</dt>
            <dd data-testid={testId} className="tabular min-w-0 text-right text-callout break-words text-foreground">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </GroupedCard>
  )
}
