import { categoryPieLabel, type PieSlice } from '@/domain/categoryChart'
import { formatPeriod, formatPeriodLong, type Period } from '@/domain/period'
import { pieSlicePath } from '@/lib/pie'
import { displayCategoryColor } from '@/lib/visuals'

const SIZE = 176
const RADIUS = SIZE / 2

/**
 * Torta del gasto por categoría (US-72, ADR-038): SVG propio, sin librería de gráficos. Es una
 * imagen con texto alternativo y no recibe foco; las porciones no son interactivas, al detalle se
 * entra por la lista. Los ángulos y montos van en data-* para verificarlos (CA-1, CA-8).
 */
export function CategoryPieChart({ slices, period }: { slices: readonly PieSlice[]; period: Period }) {
  // Una sola porción no lleva filete: no hay nada que separar (CA-13).
  const stroke = slices.length > 1 ? 'var(--card)' : 'none'
  return (
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
          d={pieSlicePath(s.startAngle.toNumber(), s.endAngle.toNumber(), RADIUS)}
          fill={s.isRest ? 'var(--input)' : displayCategoryColor(s.color, s.name)}
          stroke={stroke}
          strokeWidth={2}
          strokeLinejoin="round"
        />
      ))}
    </svg>
  )
}
