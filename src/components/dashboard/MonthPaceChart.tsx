import { useState, type KeyboardEvent, type PointerEvent } from 'react'
import { GroupedSection } from '@/components/shared/GroupedList'
import { formatCompactArs } from '@/domain/categoryDetail'
import { paceDayPoint, paceDirection, paceMax, type MonthPace } from '@/domain/dashboardTrends'
import { formatArs, type Decimal } from '@/domain/money'
import { addMonths, formatPeriodLong, type Period } from '@/domain/period'

const W = 320
const H = 150
const PAD = { top: 12, right: 14, bottom: 22, left: 8 }
const CURRENT_COLOR = 'var(--primary)'
const PREVIOUS_COLOR = 'var(--input)'

function monthName(period: Period): string {
  return formatPeriodLong(period).split(' ')[0]
}

/**
 * "Ritmo del mes" (ADR-050): el gasto acumulado día a día del mes visto contra el mes anterior, en
 * una sola escala. Línea de 2 px en el verde del gasto y la del mes pasado en el gris de borde de
 * control; el punto final es la lectura que importa. El gráfico es un deslizador: el puntero o las
 * flechas eligen el día y la lectura de arriba da los dos acumulados a esa fecha. `ongoing` dice si
 * el mes está en curso (la línea se corta hoy) o ya terminó.
 */
export function MonthPaceChart({ pace, period, ongoing }: { pace: MonthPace; period: Period; ongoing: boolean }) {
  const [pickedDay, setPickedDay] = useState<number | null>(null)
  const previousName = monthName(addMonths(period, -1))
  const currentName = monthName(period)
  const day = pickedDay ?? (pace.cutoffDay > 0 ? pace.cutoffDay : pace.days)
  const point = paceDayPoint(pace, day)
  const max = paceMax(pace)

  const x = (d: number) => PAD.left + ((d - 1) / Math.max(pace.days - 1, 1)) * (W - PAD.left - PAD.right)
  const y = (amount: Decimal) => (max.lte(0) ? H - PAD.bottom : H - PAD.bottom - amount.dividedBy(max).times(H - PAD.top - PAD.bottom).toNumber())
  const line = (pick: (p: (typeof pace.points)[number]) => Decimal | null) =>
    pace.points
      .flatMap((p) => {
        const v = pick(p)
        return v ? [`${x(p.day).toFixed(1)} ${y(v).toFixed(1)}`] : []
      })
      .map((c, i) => `${i === 0 ? 'M' : 'L'}${c}`)
      .join(' ')

  const direction = paceDirection(pace)
  const lastCurrent = paceDayPoint(pace, pace.cutoffDay || 1).current
  const sameDay = `al día ${pace.cutoffDay}`

  function dayFromPointer(event: PointerEvent<HTMLDivElement>): number {
    const rect = event.currentTarget.getBoundingClientRect()
    const ratio = (event.clientX - rect.left) / rect.width
    const svgX = ratio * W
    return Math.round(1 + ((svgX - PAD.left) / (W - PAD.left - PAD.right)) * (pace.days - 1))
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = event.key === 'ArrowRight' || event.key === 'ArrowUp' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowDown' ? -1 : 0
    if (step === 0) return
    event.preventDefault()
    setPickedDay(paceDayPoint(pace, day + step).day)
  }

  return (
    <GroupedSection title="Ritmo del mes" data-testid="dashboard-pace">
      <div className="flex flex-col gap-3 rounded-xl border border-hairline bg-card px-4 pt-4 pb-3">
        <p data-testid="dashboard-pace-summary" data-direction={direction} className="text-callout text-foreground">
          {direction === 'none' && (
            <span className="text-muted-foreground">
              {pace.hasCurrent ? `Sin gastos en ${previousName} para comparar.` : `Todavía no hay gastos en ${currentName}.`}
            </span>
          )}
          {direction === 'same' && `${ongoing ? 'Vas igual' : 'Gastaste lo mismo'} que en ${previousName}${ongoing ? ` ${sameDay}` : ''}.`}
          {(direction === 'more' || direction === 'less') && (
            <>
              {ongoing ? 'Llevás' : 'Gastaste'} <strong className="tabular font-semibold">{formatArs(pace.delta.abs())}</strong>{' '}
              {direction === 'more' ? 'más' : 'menos'} que en {previousName}
              {ongoing ? ` ${sameDay}` : ''}.
            </>
          )}
        </p>

        <ul data-testid="dashboard-pace-legend" className="flex items-center gap-4 text-footnote text-muted-foreground">
          <li className="flex items-center gap-1.5">
            <span aria-hidden="true" className="h-0.5 w-4 rounded-full" style={{ backgroundColor: CURRENT_COLOR }} />
            {currentName}
          </li>
          <li className="flex items-center gap-1.5">
            <span aria-hidden="true" className="h-0.5 w-4 rounded-full" style={{ backgroundColor: PREVIOUS_COLOR }} />
            {previousName}
          </li>
        </ul>

        <div
          role="slider"
          tabIndex={0}
          data-testid="dashboard-pace-chart"
          aria-label="Gasto acumulado por día"
          aria-valuemin={1}
          aria-valuemax={pace.days}
          aria-valuenow={point.day}
          aria-valuetext={`Día ${point.day}: ${currentName} ${point.current ? formatArs(point.current) : 'sin dato'}, ${previousName} ${point.previous ? formatArs(point.previous) : 'sin dato'}`}
          onPointerDown={(e) => setPickedDay(dayFromPointer(e))}
          onPointerMove={(e) => e.pointerType === 'mouse' && setPickedDay(dayFromPointer(e))}
          onKeyDown={onKeyDown}
          className="touch-pan-y rounded-md outline-offset-4"
        >
          <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full overflow-visible" aria-hidden="true">
            {/* Escala: piso y techo, un filete recesivo cada uno. */}
            <line x1={PAD.left} x2={W - PAD.right} y1={H - PAD.bottom} y2={H - PAD.bottom} stroke="var(--hairline)" />
            <line x1={PAD.left} x2={W - PAD.right} y1={PAD.top} y2={PAD.top} stroke="var(--hairline)" />
            <text x={PAD.left} y={PAD.top - 3} fontSize="10" fill="var(--muted-foreground)" data-testid="dashboard-pace-max">
              {formatCompactArs(max)}
            </text>
            {[1, Math.round(pace.days / 2), pace.days].map((d) => (
              <text
                key={d}
                x={x(d)}
                y={H - 6}
                fontSize="10"
                textAnchor={d === 1 ? 'start' : d === pace.days ? 'end' : 'middle'}
                fill="var(--muted-foreground)"
              >
                {d}
              </text>
            ))}
            <path
              data-testid="dashboard-pace-previous"
              data-total={pace.previousTotal.toFixed(2)}
              d={line((p) => p.previous)}
              fill="none"
              stroke={PREVIOUS_COLOR}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              data-testid="dashboard-pace-current"
              data-total={pace.currentTotal.toFixed(2)}
              d={line((p) => p.current)}
              fill="none"
              stroke={CURRENT_COLOR}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* El día elegido: un filete vertical y los puntos de cada línea, con anillo del color de la superficie. */}
            <line x1={x(point.day)} x2={x(point.day)} y1={PAD.top} y2={H - PAD.bottom} stroke="var(--hairline)" strokeWidth={1.5} />
            {point.previous && (
              <circle cx={x(point.day)} cy={y(point.previous)} r={4} fill={PREVIOUS_COLOR} stroke="var(--card)" strokeWidth={2} />
            )}
            {point.current && (
              <circle cx={x(point.day)} cy={y(point.current)} r={4} fill={CURRENT_COLOR} stroke="var(--card)" strokeWidth={2} />
            )}
            {lastCurrent && point.day !== pace.cutoffDay && (
              <circle cx={x(pace.cutoffDay)} cy={y(lastCurrent)} r={4} fill={CURRENT_COLOR} stroke="var(--card)" strokeWidth={2} />
            )}
          </svg>
        </div>

        <p data-testid="dashboard-pace-readout" aria-live="polite" className="tabular text-footnote text-muted-foreground">
          <span className="font-medium text-foreground">Día {point.day}</span>
          {' · '}
          {currentName} {point.current ? formatArs(point.current) : 'sin dato'}
          {' · '}
          {previousName} {point.previous ? formatArs(point.previous) : 'sin dato'}
        </p>
      </div>
    </GroupedSection>
  )
}
