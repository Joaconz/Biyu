import type { ReactNode } from 'react'
import { formatPercentage } from '@/domain/summary'

/**
 * Fila de un desglose: ícono, nombre y monto arriba; la barra de proporción debajo, alineada con
 * el nombre. La barra es un `progressbar` para que el lector de pantalla lea el porcentaje.
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
}) {
  return (
    <div data-testid={testId} role="listitem" className="flex items-center gap-3 py-3 pr-4 pl-3.5">
      {icon}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-baseline justify-between gap-3">
          <div className="flex min-w-0 flex-col">
            <div className="flex min-w-0 items-center gap-1.5">{label}</div>
            {sublabel}
          </div>
          <div className="flex shrink-0 items-baseline gap-2">
            <span data-testid={amountTestId} className="tabular text-callout font-semibold text-foreground">
              {amount}
            </span>
            <span data-testid={percentageTestId} className="tabular w-12 text-right text-footnote text-muted-foreground">
              {formatPercentage(percentage)}
            </span>
          </div>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
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
    </div>
  )
}
