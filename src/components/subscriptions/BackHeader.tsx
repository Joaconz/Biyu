import type { ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'
import { Link } from 'react-router'

/** Encabezado de las pantallas internas de Suscripciones: botón atrás, título y, opcional, algo a la derecha. */
export function BackHeader({
  to,
  backTestId,
  title,
  titleTestId,
  children,
}: {
  to: string
  backTestId: string
  title?: ReactNode
  titleTestId?: string
  children?: ReactNode
}) {
  return (
    <div className="flex items-center gap-2 pt-3 pb-6 lg:pt-0 lg:pb-8">
      <Link
        to={to}
        data-testid={backTestId}
        aria-label="Volver a Suscripciones"
        className="press -ml-3 flex size-11 shrink-0 items-center justify-center rounded-full text-foreground hover:bg-accent"
      >
        <ChevronLeft aria-hidden="true" className="size-6" strokeWidth={1.8} />
      </Link>
      {title !== undefined && (
        <h1 data-testid={titleTestId} className="min-w-0 flex-1 truncate text-title-2 font-bold text-foreground">
          {title}
        </h1>
      )}
      {children}
    </div>
  )
}
