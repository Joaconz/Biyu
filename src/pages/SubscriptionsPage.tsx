import { Link } from 'react-router'
import { PageHeader } from '@/components/layout/PageHeader'
import { GroupedCard, GroupedSection } from '@/components/shared/GroupedList'
import { SubscriptionItem } from '@/components/subscriptions/SubscriptionItem'
import { buttonVariants } from '@/components/ui/button'
import { groupSubscriptions } from '@/domain/subscriptions'
import { useSubscriptions } from '@/hooks/useSubscriptions'
import { todayInArgentina } from '@/lib/clock'

/** Suscripciones (US-52): Activas, Pausadas y Canceladas, cada grupo solo si tiene filas. */
export function SubscriptionsPage() {
  const state = useSubscriptions()
  // El mismo "hoy" con el que el hook calculó las bloqueadas.
  const today = state.status === 'ready' ? state.today : todayInArgentina()

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col">
      <PageHeader title="Suscripciones" testId="subscriptions-title" className="items-center">
        <Link to="/subscriptions/new" data-testid="subscriptions-new" className={buttonVariants({ size: 'sm' })}>
          Nueva
        </Link>
      </PageHeader>

      {state.status === 'loading' && (
        <p data-testid="subscriptions-loading" className="text-callout text-muted-foreground">
          Cargando suscripciones…
        </p>
      )}

      {state.status === 'error' && (
        <div className="flex flex-col items-start gap-3">
          <p role="alert" data-testid="subscriptions-error" className="text-callout text-destructive">
            No pudimos cargar tus suscripciones.
          </p>
          <button
            type="button"
            data-testid="subscriptions-retry"
            onClick={state.retry}
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            Reintentar
          </button>
        </div>
      )}

      {state.status === 'ready' &&
        (state.subscriptions.length === 0 ? (
          <div
            data-testid="subscriptions-empty"
            className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-input/50 px-6 py-12 text-center"
          >
            <p className="text-callout text-muted-foreground">
              Todavía no tenés suscripciones. Cargá lo que pagás todos los meses y se registra solo.
            </p>
            <Link to="/subscriptions/new" data-testid="subscriptions-empty-new" className={buttonVariants({ size: 'sm' })}>
              Agregar la primera
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {groupSubscriptions(state.subscriptions).map((group) => (
              <GroupedSection key={group.status} title={group.label} data-status-group={group.status}>
                <GroupedCard>
                  {group.items.map((subscription) => (
                    <SubscriptionItem
                      key={subscription.id}
                      subscription={subscription}
                      today={today}
                      blocked={state.blocked.get(subscription.id)}
                    />
                  ))}
                </GroupedCard>
              </GroupedSection>
            ))}
          </div>
        ))}
    </div>
  )
}
