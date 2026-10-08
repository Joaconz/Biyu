import { Link, useParams } from 'react-router'
import { BackHeader } from '@/components/subscriptions/BackHeader'
import { EditSubscriptionForm } from '@/components/subscriptions/EditSubscriptionForm'
import { buttonVariants } from '@/components/ui/button'
import { CANCELLED_EDIT_TEXT, NOT_FOUND_TEXT } from '@/domain/subscriptionEdit'
import { useSubscriptionEdit } from '@/hooks/useSubscriptions'
import { todayInArgentina } from '@/lib/clock'

/**
 * Editar suscripción (US-59, `/subscriptions/:id/edit`). Espera la suscripción, sus períodos generados y las
 * categorías y cuentas activas antes de mostrar el formulario. Una cancelada no se edita.
 */
export function EditSubscriptionPage() {
  const { id = '' } = useParams()
  const state = useSubscriptionEdit(id)
  const subscription = state.status === 'ready' ? state.subscription : null

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col">
      <BackHeader
        to={`/subscriptions/${id}`}
        backTestId="subscription-form-back"
        backLabel="Volver a la suscripción"
        title="Editar suscripción"
      />

      {state.status === 'loading' && (
        <p data-testid="subscription-form-loading" className="text-callout text-muted-foreground">
          Cargando…
        </p>
      )}

      {state.status === 'error' && (
        <div className="flex flex-col items-start gap-3">
          <p role="alert" data-testid="subscription-form-load-error" className="text-callout text-destructive">
            No pudimos cargar la suscripción.
          </p>
          <button
            type="button"
            data-testid="subscription-form-load-retry"
            onClick={state.retry}
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            Reintentar
          </button>
        </div>
      )}

      {state.status === 'ready' && !subscription && (
        <p
          data-testid="subscription-form-not-found"
          className="rounded-xl border border-dashed border-input/50 px-6 py-12 text-center text-callout text-muted-foreground"
        >
          {NOT_FOUND_TEXT}
        </p>
      )}

      {subscription?.status === 'cancelled' && (
        <div className="flex flex-col items-start gap-3">
          <p className="text-callout text-muted-foreground">{CANCELLED_EDIT_TEXT}</p>
          <Link
            to={`/subscriptions/${id}`}
            data-testid="subscription-form-cancelled-back"
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            Volver
          </Link>
        </div>
      )}

      {subscription && subscription.status !== 'cancelled' && state.status === 'ready' && (
        <EditSubscriptionForm
          subscription={subscription}
          generatedPeriods={state.generatedPeriods}
          categories={state.categories}
          accounts={state.accounts}
          today={todayInArgentina()}
        />
      )}
    </div>
  )
}
