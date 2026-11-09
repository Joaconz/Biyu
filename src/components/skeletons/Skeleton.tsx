import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

/** Bloque de carga con la forma del contenido (ADR-049): el mismo pulso que ya usa Registrar. */
export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return <div aria-hidden="true" className={cn('animate-pulse rounded-xl bg-muted', className)} {...props} />
}

/**
 * Una lista agrupada que todavía no llegó: filas con ícono, dos líneas de texto y un monto, dentro
 * de la misma superficie que GroupedCard, así al llegar los datos nada salta.
 */
export function ListSkeleton({ rows = 4, testId, label }: { rows?: number; testId: string; label: string }) {
  return (
    <div data-testid={testId} role="status" aria-busy="true">
      <span className="sr-only">{label}</span>
      <div className="overflow-hidden rounded-xl bg-card [&>*+*]:border-t [&>*+*]:border-hairline">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="flex min-h-16 items-center gap-3 px-4 py-3">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-3.5 w-2/5" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}

/** El Resumen mientras carga: la tarjeta del total, Ingresos y Balance, y el bloque de categorías. */
export function DashboardSkeleton() {
  return (
    <div data-testid="dashboard-loading" role="status" aria-busy="true" className="grid grid-cols-[minmax(0,1fr)] gap-3 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
      <span className="sr-only">Cargando…</span>
      <Skeleton className="h-52 rounded-2xl sm:h-56" />
      {/* La tarjeta de Balance con su desglose (ADR-051), que incluye los ingresos. */}
      <Skeleton className="h-64 rounded-2xl" />
      <div className="mt-5 flex flex-col gap-2 lg:col-span-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-56 rounded-xl" />
      </div>
    </div>
  )
}
