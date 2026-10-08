import { useId, type ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import { formatPercentage } from '@/domain/summary'

/**
 * Fila de un desglose: ícono, nombre y monto arriba; la barra de proporción debajo, alineada con
 * el nombre. La barra es un `progressbar` para que el lector de pantalla lea el porcentaje.
 * Con `link`, la fila es un `<li>` con un enlace adentro que lleva el testid (US-72): su nombre
 * accesible es `link.label` y el monto y el porcentaje quedan como descripción.
 */
export function BreakdownRow({
  testId,
  icon,
  label,
  sublabel,
  amount,
  amountTestId,
  percentage,
  percentageTestId,
  barColor,
  ariaLabel,
  link,
}: {
  testId: string
  icon: ReactNode
  label: ReactNode
  sublabel?: ReactNode
  amount: string
  amountTestId: string
  percentage: number
  percentageTestId: string
  barColor: string
  ariaLabel: string
  /** `describedBy`: ids de más para la descripción del enlace, como la marca "archivada". */
  link?: { to: string; label: string; describedBy?: string }
}) {
  const valuesId = useId()
  const content = (
    <>
      {icon}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {/* DEF-021: si el monto no deja al menos 7rem para el nombre, baja a su propia línea en vez
            de aplastarlo; y el porcentaje nunca parte "100,0 %" en dos. */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
          <div className="flex min-w-0 flex-[1_1_7rem] flex-col">
            <div className="flex min-w-0 items-center gap-1.5">{label}</div>
            {sublabel}
          </div>
          <div className="ml-auto flex shrink-0 items-baseline gap-2 whitespace-nowrap">
            <span id={`${valuesId}-amount`} data-testid={amountTestId} className="tabular text-callout font-semibold text-foreground">
              {amount}
            </span>
            <span id={`${valuesId}-percentage`} data-testid={percentageTestId} className="tabular min-w-12 text-right text-footnote text-muted-foreground">
              {formatPercentage(percentage)}
            </span>
          </div>
        </div>
        {/* Dentro del enlace, el porcentaje ya está en su descripción: la barra queda decorativa. */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary" aria-hidden={link ? true : undefined}>
          <div
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={ariaLabel}
            className="h-full origin-left rounded-full transition-[width] duration-(--dur-spring) ease-(--ease-spring)"
            style={{ width: `${Math.max(2, Math.min(100, percentage))}%`, backgroundColor: barColor }}
          />
        </div>
      </div>
    </>
  )

  if (link) {
    return (
      <li>
        <Link
          to={link.to}
          data-testid={testId}
          aria-label={link.label}
          // Ids sueltos y no el contenedor: así el lector separa "$60.000,00" de "40,0 %".
          aria-describedby={[link.describedBy, `${valuesId}-amount`, `${valuesId}-percentage`].filter(Boolean).join(' ')}
          className="press flex min-h-14 items-center gap-3 py-3 pr-3 pl-3.5 outline-offset-[-2px] hover:bg-accent/60"
        >
          {content}
          <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-input" strokeWidth={1.8} />
        </Link>
      </li>
    )
  }

  return (
    <div data-testid={testId} role="listitem" className="flex items-center gap-3 py-3 pr-4 pl-3.5">
      {content}
    </div>
  )
}
