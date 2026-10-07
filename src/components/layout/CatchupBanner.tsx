import { Loader2 } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'

/** Mientras corre la puesta al día al cargar (US-53): en lugar del contenido, hasta 8 s (ADR-031). */
export function CatchupLoading() {
  return (
    <div
      role="status"
      data-testid="app-catchup-loading"
      className="flex min-h-[50dvh] flex-col items-center justify-center gap-3 text-callout text-muted-foreground"
    >
      <Loader2 aria-hidden="true" className="size-6 animate-spin" />
      Poniendo al día tus suscripciones…
    </div>
  )
}

/** Franja de la puesta al día que falló o tardó (US-53 CA-4, CA-11), arriba del contenido. */
export function CatchupBanner({ retrying, onRetry }: { retrying: boolean; onRetry: () => void }) {
  return (
    <div
      role="alert"
      data-testid="app-catchup-error"
      className="mt-3 flex flex-col items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 lg:mt-0 lg:mb-6"
    >
      <p className="text-callout text-foreground">
        {retrying
          ? 'Reintentando…'
          : 'No pudimos cargar tus suscripciones vencidas. Los totales pueden estar incompletos.'}
      </p>
      <button
        type="button"
        data-testid="app-catchup-retry"
        onClick={onRetry}
        disabled={retrying}
        className={buttonVariants({ variant: 'outline', size: 'sm' })}
      >
        Reintentar
      </button>
    </div>
  )
}
