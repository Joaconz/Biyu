import { GroupedSection } from '@/components/shared/GroupedList'
import { formatCompactArs, isEvolutionEmpty, type EvolutionBar } from '@/domain/categoryDetail'
import { formatArs } from '@/domain/money'
import { formatMonthShort, formatPeriod, formatPeriodLong, isSamePeriod, type Period } from '@/domain/period'
import { cn } from '@/lib/utils'

/**
 * "Últimos 6 meses" del detalle de categoría (US-73, ADR-038): barras verticales con SVG/CSS
 * propio, sin librería. Cada barra es un botón que lleva su mes a `?period=` (C11).
 */
export function CategoryEvolution({
  bars,
  period,
  color,
  onSelect,
}: {
  bars: readonly EvolutionBar[]
  period: Period
  /** Color de la categoría, ya traducido con displayCategoryColor. */
  color: string
  onSelect: (period: Period) => void
}) {
  return (
    <GroupedSection title="Últimos 6 meses" data-testid="category-detail-evolution" className="mt-7">
      <div className="rounded-xl border border-hairline bg-card px-1.5 pt-4 pb-3 sm:px-3">
        <div className="grid grid-cols-6 gap-1 sm:gap-2">
          {bars.map((bar) => {
            const key = formatPeriod(bar.period)
            const current = isSamePeriod(bar.period, period)
            return (
              <button
                key={key}
                type="button"
                data-testid={`category-detail-evolution-bar-${key}`}
                data-amount={bar.amount.toFixed(2)}
                aria-current={current ? 'true' : undefined}
                aria-label={`${formatPeriodLong(bar.period)}: ${formatArs(bar.amount)}`}
                onClick={() => onSelect(bar.period)}
                className="press flex h-44 min-w-0 flex-col items-center justify-end gap-1 rounded-lg pt-1 hover:bg-accent/60"
              >
                <span
                  data-testid={`category-detail-evolution-amount-${key}`}
                  className={cn(
                    'tabular text-caption tracking-tighter whitespace-nowrap',
                    current ? 'font-semibold text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {formatCompactArs(bar.amount)}
                </span>
                <span
                  aria-hidden="true"
                  className="block w-full max-w-8.5 rounded-t-md rounded-b-xs"
                  style={{
                    height: bar.heightPx,
                    backgroundColor: current ? color : `color-mix(in srgb, ${color} 35%, var(--card))`,
                  }}
                />
                <span
                  aria-hidden="true"
                  className={cn('text-footnote', current ? 'font-semibold text-foreground' : 'text-muted-foreground')}
                >
                  {formatMonthShort(bar.period)}
                </span>
              </button>
            )
          })}
        </div>
      </div>
      {isEvolutionEmpty(bars) && (
        <p data-testid="category-detail-evolution-empty" className="px-1 text-footnote text-muted-foreground">
          Sin gastos en esta categoría en los últimos 6 meses.
        </p>
      )}
    </GroupedSection>
  )
}
