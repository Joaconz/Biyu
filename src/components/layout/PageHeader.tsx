import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Título grande en Inter, como los títulos grandes de iOS (ADR-023), con acciones o controles a la
 * derecha y, si hace falta, un enlace de vuelta arriba (`leading`).
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
  // ADR-052: el enlace de vuelta va arriba del título grande, como en iOS, así el renglón del título
  // tiene lugar para su acción aun a 360 px.
  return (
    <div className={cn('flex flex-col pt-3 pb-6 lg:pt-0 lg:pb-8', className)}>
      {leading && <div className="-mb-1 flex">{leading}</div>}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        {heading}
        {children}
      </div>
    </div>
  )
}
