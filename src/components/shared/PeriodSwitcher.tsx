import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatPeriod, formatPeriodLong, parsePeriod, type Period } from '@/domain/period'
import { cn } from '@/lib/utils'

/**
 * Selector de mes: flechas para el mes vecino y el nombre del mes, que abre el selector nativo.
 * El período vive en la URL (C11); acá solo se muestra. Los testids son `<screen>-period-*`, y
 * `data-period` expone el `YYYY-MM` para la automatización aunque el texto sea "septiembre 2026".
 */
export function PeriodSwitcher({
  screen,
  period,
  onShift,
  onSelect,
  className,
}: {
  screen: string
  period: Period
  onShift: (delta: number) => void
  onSelect: (period: Period) => void
  className?: string
}) {
  const inputId = `${screen}-period-select`
  const arrow =
    'press flex size-11 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground'
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <button type="button" onClick={() => onShift(-1)} data-testid={`${screen}-period-prev`} aria-label="Mes anterior" className={arrow}>
        <ChevronLeft aria-hidden="true" className="size-5" strokeWidth={1.8} />
      </button>
      <label
        htmlFor={inputId}
        className="press relative flex h-9 min-w-36 cursor-pointer items-center justify-center rounded-full bg-secondary px-4 text-callout font-semibold text-foreground hover:bg-accent"
      >
        <span data-testid={`${screen}-period`} data-period={formatPeriod(period)} className="first-letter:uppercase">
          {formatPeriodLong(period)}
        </span>
        <input
          id={inputId}
          type="month"
          value={formatPeriod(period)}
          onChange={(e) => {
            const next = parsePeriod(e.target.value)
            if (next) onSelect(next)
          }}
          // En desktop el input transparente solo abre el calendario desde su ícono; showPicker lo abre desde cualquier punto.
          onClick={(e) => {
            try {
              e.currentTarget.showPicker()
            } catch {
              // Navegadores sin showPicker: queda el comportamiento nativo.
            }
          }}
          data-testid={inputId}
          aria-label="Elegir mes"
          className="absolute inset-0 size-full cursor-pointer opacity-0"
        />
      </label>
      <button type="button" onClick={() => onShift(1)} data-testid={`${screen}-period-next`} aria-label="Mes siguiente" className={arrow}>
        <ChevronRight aria-hidden="true" className="size-5" strokeWidth={1.8} />
      </button>
    </div>
  )
}
