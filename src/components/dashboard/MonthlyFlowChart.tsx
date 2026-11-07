import { useState } from 'react'
import { GroupedSection } from '@/components/shared/GroupedList'
import { formatCompactArs } from '@/domain/categoryDetail'
import { barHeightPx, flowMax, type FlowMonth } from '@/domain/dashboardTrends'
import { formatArs, type Decimal } from '@/domain/money'
import { formatMonthShort, formatPeriod, formatPeriodLong } from '@/domain/period'
import { cn } from '@/lib/utils'

const BAR_AREA_PX = 112
const EXPENSE_COLOR = 'var(--primary)'
const INCOME_COLOR = 'var(--chart-5)'

/**
 * "Gastado vs ingresos" de los últimos 6 meses (ADR-050): dos columnas por mes sobre una sola escala.
 * SVG/CSS propio, sin librería (ADR-038 §5). Cada mes es un botón que muestra sus montos exactos
 * arriba (el tocar-para-ver del celular, sin tooltip que tape el gráfico); el mes visto arranca
 * elegido. Los gastos van en el verde de la tarjeta "Gastado en" y los ingresos en ocre: una
 * leyenda los nombra y el monto exacto sale en la lectura y en la tabla para lector de pantalla.
 */
export function MonthlyFlowChart({ months }: { months: readonly FlowMonth[] }) {
  const [picked, setPicked] = useState<string | null>(null)
  const max = flowMax(months)
  const shown = months.find((m) => formatPeriod(m.period) === picked) ?? months.find((m) => m.isCurrent) ?? months[months.length - 1]
  return (
    <GroupedSection title="Gastado vs ingresos" data-testid="dashboard-flow">
      <div className="flex flex-col gap-3 rounded-xl border border-hairline bg-card px-3 pt-4 pb-3 sm:px-4">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <ul data-testid="dashboard-flow-legend" className="flex items-center gap-4 text-footnote text-muted-foreground">
            <LegendKey color={EXPENSE_COLOR} label="Gastos" />
            <LegendKey color={INCOME_COLOR} label="Ingresos" />
          </ul>
          <p
            data-testid="dashboard-flow-readout"
            aria-live="polite"
            className="tabular text-footnote text-muted-foreground"
          >
            <span className="font-medium text-foreground capitalize">{formatPeriodLong(shown.period)}</span>
            {' · '}
            {formatArs(shown.expenses)} gastados · {formatArs(shown.income)} de ingresos
          </p>
        </div>
        <div className="grid grid-cols-6 gap-1 sm:gap-2">
          {months.map((m) => {
            const key = formatPeriod(m.period)
            const selected = m === shown
            return (
              <button
                key={key}
                type="button"
                data-testid={`dashboard-flow-month-${key}`}
                data-expenses={m.expenses.toFixed(2)}
                data-income={m.income.toFixed(2)}
                aria-pressed={selected}
                aria-label={`${formatPeriodLong(m.period)}: ${formatArs(m.expenses)} gastados, ${formatArs(m.income)} de ingresos`}
                onClick={() => setPicked(key)}
                className={cn(
                  'press flex min-w-0 flex-col items-center justify-end gap-1.5 rounded-lg px-0.5 pt-1 pb-1.5',
                  selected ? 'bg-accent' : '[@media(hover:hover)]:hover:bg-accent/60',
                )}
              >
                <span aria-hidden="true" className="flex items-end justify-center gap-0.5" style={{ height: BAR_AREA_PX }}>
                  <Bar amount={m.expenses} max={max} color={EXPENSE_COLOR} />
                  <Bar amount={m.income} max={max} color={INCOME_COLOR} />
                </span>
                <span
                  aria-hidden="true"
                  className={cn('text-footnote', m.isCurrent ? 'font-semibold text-foreground' : 'text-muted-foreground')}
                >
                  {formatMonthShort(m.period)}
                </span>
              </button>
            )
          })}
        </div>
        <p className="tabular text-caption text-muted-foreground">
          Escala común: lo más alto es <span data-testid="dashboard-flow-max">{formatCompactArs(max)}</span>
        </p>
      </div>
      {/* Vista de tabla para lector de pantalla (en un div: una tabla ignora el ancho de sr-only y ensancha la página): los montos exactos de todos los meses. */}
      <div className="sr-only">
        <table data-testid="dashboard-flow-table">
          <caption>Gastado e ingresos de los últimos 6 meses</caption>
          <thead>
            <tr>
              <th scope="col">Mes</th>
              <th scope="col">Gastos</th>
              <th scope="col">Ingresos</th>
            </tr>
          </thead>
          <tbody>
            {months.map((m) => (
              <tr key={formatPeriod(m.period)}>
                <th scope="row">{formatPeriodLong(m.period)}</th>
                <td>{formatArs(m.expenses)}</td>
                <td>{formatArs(m.income)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GroupedSection>
  )
}

function LegendKey({ color, label }: { color: string; label: string }) {
  return (
    <li className="flex items-center gap-1.5">
      <span aria-hidden="true" className="size-2.5 rounded-xs" style={{ backgroundColor: color }} />
      {label}
    </li>
  )
}

/** Columna de un monto: base recta sobre el piso común y esquinas de 4 px solo del lado del dato. */
function Bar({ amount, max, color }: { amount: Decimal; max: Decimal; color: string }) {
  return (
    <span
      className="block w-3 max-w-[40%] rounded-t-sm sm:w-4"
      style={{ height: barHeightPx(amount, max, BAR_AREA_PX), backgroundColor: color }}
    />
  )
}
