import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Título grande en Inter, como los títulos grandes de iOS (ADR-023), con acciones o controles a la
 * derecha y, si hace falta, un enlace de vuelta a la izquierda (`leading`).
 */
export function PageHeader({
  title,
  testId,
  children,
  className,
  leading,
}: {
  title: ReactNode
  testId?: string
  children?: ReactNode
  className?: string
  leading?: ReactNode
}) {
  const heading = (
    <h1 data-testid={testId} className="text-title-1 font-bold text-foreground">
      {title}
    </h1>
  )
  return (
    <div className={cn('flex items-end justify-between gap-4 pt-3 pb-6 lg:pt-0 lg:pb-8', className)}>
      {leading ? (
        <div className="flex items-center gap-3">
          {leading}
          {heading}
        </div>
      ) : (
        heading
      )}
      {children}
    </div>
  )
}
