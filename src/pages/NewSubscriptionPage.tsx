import { BackHeader } from '@/components/subscriptions/BackHeader'
import { SubscriptionForm } from '@/components/subscriptions/SubscriptionForm'
import { buttonVariants } from '@/components/ui/button'
import { useSubscriptionCatalog } from '@/hooks/useSubscriptions'
import { todayInArgentina } from '@/lib/clock'

/** Nueva suscripción (US-52). Espera las categorías y cuentas activas antes de mostrar el formulario. */
export function NewSubscriptionPage() {
  const catalog = useSubscriptionCatalog()

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col">
      <BackHeader to="/subscriptions" backTestId="subscription-form-back" title="Nueva suscripción" />

      {catalog.status === 'loading' && (
        <p data-testid="subscription-form-loading" className="text-callout text-muted-foreground">
          Cargando…
        </p>
      )}

      {catalog.status === 'error' && (
        <div className="flex flex-col items-start gap-3">
          <p role="alert" data-testid="subscription-form-load-error" className="text-callout text-destructive">
            No pudimos cargar tus categorías y medios de pago.
          </p>
          <button
            type="button"
            data-testid="subscription-form-load-retry"
            onClick={catalog.retry}
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            Reintentar
          </button>
        </div>
      )}

      {catalog.status === 'ready' && (
        <SubscriptionForm
          categories={catalog.categories}
          accounts={catalog.accounts}
          fxRates={catalog.fxRates}
          today={todayInArgentina()}
        />
      )}
    </div>
  )
}
