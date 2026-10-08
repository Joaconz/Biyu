import { TriangleAlert } from 'lucide-react'
import { Link } from 'react-router'
import { buttonVariants } from '@/components/ui/button'
import type { BlockedNotice } from '@/domain/subscriptionBlocked'

/**
 * Aviso del Detalle de una suscripción bloqueada (US-62): qué meses no se cargaron y por qué. Si falta
 * un tipo de cambio, el botón lleva a Ajustes con el mes más viejo que falta. Los textos los redacta el
 * dominio (`blockedNotice`).
 */
export function SubscriptionBlockedNotice({ notice }: { notice: BlockedNotice }) {
  return (
    <div
      role="alert"
      data-testid="subscription-detail-blocked"
      className="mb-4 flex items-start gap-3 rounded-xl border border-warning/40 bg-warning-surface p-4"
    >
      <TriangleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-warning" />
      <div className="flex min-w-0 flex-col items-start gap-3">
        <div className="flex flex-col gap-2">
          {notice.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-callout text-foreground">
              {paragraph}
            </p>
          ))}
        </div>
        {notice.fxPeriod && (
          <Link
            to={`/settings?period=${notice.fxPeriod}`}
            data-testid="subscription-detail-blocked-fx"
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            Cargar tipo de cambio
          </Link>
        )}
      </div>
    </div>
  )
}
