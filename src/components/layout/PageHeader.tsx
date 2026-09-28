import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Título grande en Playfair (ADR-023), con acciones o controles a la derecha. */
export function PageHeader({
  title,
  testId,
  children,
  className,
}: {
  title: ReactNode
  testId?: string
  children?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex items-end justify-between gap-4 pt-3 pb-6 lg:pt-0 lg:pb-8', className)}>
      <h1 data-testid={testId} className="font-serif text-title-1 font-semibold text-foreground">
        {title}
      </h1>
      {children}
    </div>
  )
}
