import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Lista agrupada al estilo iOS: el rótulo va afuera, sobre el fondo, y las filas en una sola
 * superficie de papel con filetes entre ellas (sin sombra, ADR-023).
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
    <section className={cn('flex flex-col gap-2', className)} {...props}>
      {(title || action) && (
        <div className="flex min-h-7 items-end justify-between gap-3 px-1">
          {title && <h2 className="text-headline font-semibold text-foreground">{title}</h2>}
          {action}
        </div>
      )}
      {children}
      {footer && <p className="px-1 text-footnote text-muted-foreground">{footer}</p>}
    </section>
  )
}

/** Superficie de las filas: papel con filete; cada hijo directo queda separado por un filete. */
export function GroupedCard({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-hairline bg-card [&>*+*]:border-t [&>*+*]:border-hairline',
        className,
      )}
      {...props}
    />
  )
}
