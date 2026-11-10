import { categoryPieLabel, type PieSlice } from '@/domain/categoryChart'
import { formatCompactArs } from '@/domain/categoryDetail'
import type { Decimal } from '@/domain/money'
import { formatPeriod, formatPeriodLong, type Period } from '@/domain/period'
import { donutSlicePath } from '@/lib/pie'
import { displayCategoryColor } from '@/lib/visuals'
import { useResolvedTheme } from '@/components/layout/ThemeProvider'

const SIZE = 176
const RADIUS = SIZE / 2
const INNER_RADIUS = 56

/**
 * Dona del gasto por categoría (US-72, ADR-038, ADR-050): SVG propio, sin librería de gráficos. Es una
 * imagen con texto alternativo y no recibe foco; los tramos no son interactivos, al detalle se entra
 * por la lista que hace de leyenda. En el hueco va el total del período, compacto: el monto exacto
 * es el de la tarjeta "Gastado en". Los ángulos y montos van en data-* para verificarlos (CA-1, CA-8).
 */
export function CategoryDonutChart({
  slices,
  period,
  total,
}: {
  slices: readonly PieSlice[]
  period: Period
  total: Decimal
}) {
  const theme = useResolvedTheme()
  // Un solo tramo no lleva filete: no hay nada que separar (CA-13).
  const stroke = slices.length > 1 ? 'var(--card)' : 'none'
  return (
    <div className="relative" style={{ width: SIZE, height: SIZE }}>
      <svg
        role="img"
        data-testid="dashboard-category-chart"
        data-period={formatPeriod(period)}
        aria-label={categoryPieLabel(formatPeriodLong(period), slices)}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width={SIZE}
        height={SIZE}
        className="overflow-visible"
      >
        {slices.map((s) => (
          <path
            key={s.key}
            data-testid={`dashboard-category-chart-slice-${s.key}`}
            data-amount={s.amount.toFixed(2)}
            data-percentage={s.percentage.toFixed(1)}
            data-start-angle={s.startAngle.toFixed(1)}
            data-end-angle={s.endAngle.toFixed(1)}
            data-count={s.isRest ? s.count : undefined}
            // Los ángulos ya vienen redondeados del dominio; toNumber es solo para la trigonometría.
            d={donutSlicePath(s.startAngle.toNumber(), s.endAngle.toNumber(), RADIUS, INNER_RADIUS)}
            fillRule="evenodd"
            fill={s.isRest ? 'var(--input)' : displayCategoryColor(s.color, s.name, theme)}
            stroke={stroke}
            strokeWidth={2}
            strokeLinejoin="round"
          />
        ))}
      </svg>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
      >
        <span className="text-caption text-muted-foreground">Total</span>
        <span
          data-testid="dashboard-category-chart-total"
          data-amount={total.toFixed(2)}
          className="tabular text-headline font-bold text-foreground"
        >
          {formatCompactArs(total)}
        </span>
      </div>
    </div>
  )
}
