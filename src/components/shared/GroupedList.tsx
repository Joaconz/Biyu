import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Lista agrupada: el rótulo va afuera, sobre el fondo, y las filas en una sola tarjeta (ADR-052).
 */
export function GroupedSection({
  title,
  action,
  footer,
  children,
  className,
  ...props
}: Omit<ComponentProps<'section'>, 'title'> & { title?: ReactNode; action?: ReactNode; footer?: ReactNode }) {
  return (
    <section className={cn('flex flex-col gap-3', className)} {...props}>
      {(title || action) && (
        <div className="flex min-h-8 items-end justify-between gap-3 px-1">
          {title && <h2 className="text-title-2 font-semibold text-foreground">{title}</h2>}
          {action}
        </div>
      )}
      {children}
      {footer && <p className="px-1 text-footnote text-muted-foreground">{footer}</p>}
    </section>
  )
}

/**
 * Superficie de las filas (ADR-052): una tarjeta de 20 px sin borde ni filetes; las filas se separan por
 * su propio aire, como en las listas de las apps de finanzas.
 */
export function GroupedCard({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('overflow-hidden rounded-xl bg-card py-1.5', className)}
      {...props}
    />
  )
}
