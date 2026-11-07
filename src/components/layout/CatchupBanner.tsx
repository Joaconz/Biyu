import { useState } from 'react'
import { Loader2, X } from 'lucide-react'
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

/**
 * Si la persona cerró la franja de error en esta pestaña. Se recuerda por usuario mientras dure la sesión del
 * navegador (sessionStorage): no vuelve en cada recarga, pero una sesión nueva la muestra otra vez, por si el
 * problema sigue. Sin almacenamiento disponible, vale solo hasta recargar.
 */
export function useCatchupBannerDismissal(userId: string | null) {
  const key = `biyu:catchup-banner-dismissed:${userId ?? 'anon'}`
  // El usuario puede llegar después del primer render: se lee la clave del usuario actual en cada render.
  const [dismissedKey, setDismissedKey] = useState<string | null>(null)
  let stored = false
  try {
    stored = sessionStorage.getItem(key) === '1'
  } catch {
    stored = false
  }
  const dismissed = dismissedKey === key || stored
  function dismiss() {
    setDismissedKey(key)
    try {
      sessionStorage.setItem(key, '1')
    } catch {
      // Sin sessionStorage (modo privado, bloqueado): queda cerrada hasta recargar.
    }
  }
  return { dismissed, dismiss }
}

/**
 * Franja de la puesta al día que falló o tardó (US-53 CA-4, CA-11), arriba del contenido. La X la cierra
 * (`app-catchup-dismiss`); reintentar sigue disponible mientras se ve.
 */
export function CatchupBanner({ retrying, onRetry, onDismiss }: { retrying: boolean; onRetry: () => void; onDismiss: () => void }) {
  return (
    <div
      role="alert"
      data-testid="app-catchup-error"
      className="relative mt-3 flex flex-col items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 py-3 pr-12 pl-4 lg:mt-0 lg:mb-6"
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
      <button
        type="button"
        data-testid="app-catchup-dismiss"
        aria-label="Cerrar aviso"
        onClick={onDismiss}
        className="press absolute top-1 right-1 inline-flex size-11 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-foreground"
      >
        <X aria-hidden="true" className="size-4" strokeWidth={2} />
      </button>
    </div>
  )
}
