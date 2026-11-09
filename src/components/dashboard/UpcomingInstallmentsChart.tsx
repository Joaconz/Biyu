import { useState } from 'react'
import { GroupedSection } from '@/components/shared/GroupedList'
import { formatCompactArs } from '@/domain/categoryDetail'
import { barHeightPx, upcomingTotal, type UpcomingMonth } from '@/domain/dashboardTrends'
import { Decimal, formatArs } from '@/domain/money'
import { formatMonthShort, formatPeriod, formatPeriodLong } from '@/domain/period'
import { cn } from '@/lib/utils'

const BAR_AREA_PX = 96

/**
 * "Cuotas que vienen" (ADR-050): lo que las compras en cuotas ya cargadas van a imputar en los 6
 * meses siguientes al visto. Es lo comprometido, no una proyección: no suma suscripciones ni gastos
 * que todavía no existen. Columnas de una sola serie en el verde del gasto. Cada mes es un botón que
 * muestra su monto exacto arriba (arranca en el primero con cuotas); el monto compacto sobre la
 * columna aparece desde 640 px, donde entra sin pisar al vecino. La tabla para lector de pantalla
 * trae todos los meses.
 */
export function UpcomingInstallmentsChart({ months }: { months: readonly UpcomingMonth[] }) {
  const [picked, setPicked] = useState<string | null>(null)
  const max = Decimal.max(new Decimal(0), ...months.map((m) => m.amount))
  const total = upcomingTotal(months)
  const shown = months.find((m) => formatPeriod(m.period) === picked) ?? months.find((m) => m.amount.gt(0)) ?? months[0]
  return (
    <GroupedSection title="Cuotas que vienen" data-testid="dashboard-upcoming">
      <div className="flex flex-col gap-3 rounded-xl bg-card px-4 pt-5 pb-4 sm:px-6">
        <div className="flex flex-col gap-1">
          <p className="text-callout text-muted-foreground">
            Ya comprometido en los próximos 6 meses:{' '}
            <span data-testid="dashboard-upcoming-total" data-amount={total.toFixed(2)} className="tabular font-semibold text-foreground">
              {formatArs(total)}
            </span>
          </p>
          <p data-testid="dashboard-upcoming-readout" aria-live="polite" className="tabular text-footnote text-muted-foreground">
            <span className="font-medium text-foreground capitalize">{formatPeriodLong(shown.period)}</span>
            {' · '}
            {formatArs(shown.amount)}
          </p>
        </div>
        <ol role="list" data-testid="dashboard-upcoming-list" className="grid grid-cols-6 gap-1 sm:gap-2">
          {months.map((m) => {
            const key = formatPeriod(m.period)
            const selected = m === shown
            return (
              <li key={key}>
                <button
                  type="button"
                  data-testid={`dashboard-upcoming-month-${key}`}
                  data-amount={m.amount.toFixed(2)}
                  aria-pressed={selected}
                  aria-label={`${formatPeriodLong(m.period)}: ${formatArs(m.amount)}`}
                  onClick={() => setPicked(key)}
                  className={cn(
                    'press flex w-full min-w-0 flex-col items-center justify-end gap-1.5 rounded-xl px-0.5 pt-1 pb-1.5',
                    selected ? 'bg-accent' : '[@media(hover:hover)]:hover:bg-accent/60',
                  )}
                >
                  <span aria-hidden="true" className="tabular hidden h-4 text-caption whitespace-nowrap text-muted-foreground sm:block">
                    {m.amount.isZero() ? '' : formatCompactArs(m.amount)}
                  </span>
                  <span aria-hidden="true" className="flex items-end" style={{ height: BAR_AREA_PX }}>
                    <span
                      className="block w-6 max-w-full rounded-t-sm"
                      style={{ height: barHeightPx(m.amount, max, BAR_AREA_PX), backgroundColor: 'var(--primary)' }}
                    />
                  </span>
                  <span aria-hidden="true" className="text-footnote text-muted-foreground">
                    {formatMonthShort(m.period)}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>
      {/* Vista de tabla para lector de pantalla (en un div: una tabla ignora el ancho de sr-only y ensancha la página): el monto exacto de cada mes. */}
      <div className="sr-only">
        <table data-testid="dashboard-upcoming-table">
          <caption>Cuotas ya comprometidas en los próximos 6 meses</caption>
          <thead>
            <tr>
              <th scope="col">Mes</th>
              <th scope="col">Cuotas</th>
            </tr>
          </thead>
          <tbody>
            {months.map((m) => (
              <tr key={formatPeriod(m.period)}>
                <th scope="row">{formatPeriodLong(m.period)}</th>
                <td>{formatArs(m.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GroupedSection>
  )
}
