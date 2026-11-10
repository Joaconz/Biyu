import { useState, type MouseEvent } from 'react'
import { GroupedSection } from '@/components/shared/GroupedList'
import { formatArs } from '@/domain/money'
import {
  chargeScheduleTitle,
  committedUsdPendingText,
  defaultScheduleDay,
  scheduleDayHeading,
  scheduleDayText,
  subscriptionAmountText,
  type CommittedMonthly,
  type MonthChargeSchedule,
  type ScheduleDay,
} from '@/domain/subscriptions'
import { cn } from '@/lib/utils'

/** Cuántos puntos se apilan en un día; los demás quedan en el detalle y en la tabla. */
const MAX_STACK = 3
/** Alto de un punto más su aire, en px: marca de 8 px (dataviz) y 2 px de separación. */
const DOT_STEP_PX = 10

/** Cobrado: círculo lleno. Por cobrar: aro vacío. La forma lleva el significado, no solo el color. */
function Dot({ charged, className }: { charged: boolean; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'block size-2 shrink-0 rounded-full',
        charged ? 'bg-primary' : 'border-[1.5px] border-primary bg-card',
        className,
      )}
    />
  )
}

function Stat({ charged, label, committed, testId }: { charged: boolean; label: string; committed: CommittedMonthly; testId: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
      <span className="flex items-center gap-1.5 text-footnote text-muted-foreground">
        <Dot charged={charged} />
        {label}
      </span>
      <span
        data-testid={`${testId}-amount`}
        data-amount={committed.totalArs.toFixed(2)}
        className="tabular text-headline font-semibold text-foreground"
      >
        {formatArs(committed.totalArs)}
      </span>
      <span data-testid={`${testId}-count`} className="text-footnote text-muted-foreground">
        {committed.count === 1 ? '1 cobro' : `${committed.count} cobros`}
      </span>
    </div>
  )
}

/**
 * "Cobros de {mes}" (ADR-053): una tira con los días del mes y un punto por cada cobro, el día de hoy
 * marcado, lo cobrado (círculo lleno) y lo que falta (aro). Al tocar la tira se elige el día con cobros
 * más cercano y abajo se listan sus suscripciones. Es HTML propio, sin librería de gráficos (ADR-038 §5): los
 * días con cobros son botones —para teclado y lector de pantalla—, y como una columna mide ~10 px en el
 * celular, el toque en cualquier parte de la tira cae en el cobro más cercano. La tabla oculta trae todos.
 */
export function ChargeSchedule({ schedule, today }: { schedule: MonthChargeSchedule; today: Date }) {
  const [picked, setPicked] = useState<number | null>(null)
  const { days } = schedule
  const withCharges = days.filter((d) => d.charges.length > 0)
  const selected = days.find((d) => d.day === picked && d.charges.length > 0) ?? days.find((d) => d.day === defaultScheduleDay(schedule)) ?? null
  const stackHeight = MAX_STACK * DOT_STEP_PX

  // Un toque en la tira (columna de ~10 px): se elige el día con cobros más cercano al punto tocado.
  function pickNearest(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const column = Math.floor(((event.clientX - rect.left) / rect.width) * days.length) + 1
    const nearest = withCharges.reduce<ScheduleDay | null>(
      (best, d) => (best === null || Math.abs(d.day - column) < Math.abs(best.day - column) ? d : best),
      null,
    )
    if (nearest) setPicked(nearest.day)
  }

  return (
    <GroupedSection title={chargeScheduleTitle(schedule.period)} data-testid="subscriptions-schedule">
      <div className="flex flex-col gap-5 rounded-xl bg-card px-4 pt-5 pb-4 sm:px-6">
        <div className="flex gap-4">
          <Stat charged label="Cobrado" committed={schedule.charged} testId="subscriptions-schedule-charged" />
          <Stat charged={false} label="Falta" committed={schedule.pending} testId="subscriptions-schedule-pending" />
        </div>
        {schedule.usdPending && (
          <p data-testid="subscriptions-schedule-usd-pending" className="tabular -mt-2 text-footnote text-muted-foreground">
            {committedUsdPendingText(schedule.usdPending, schedule.period)}
          </p>
        )}

        <div>
          {/* La tira: role="presentation" porque el toque en vacío solo es una ayuda; el acceso real son los botones. */}
          <div
            role="presentation"
            data-testid="subscriptions-schedule-strip"
            onClick={pickNearest}
            className="relative grid cursor-pointer"
            style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}
          >
            {/* Una sola línea de base continua: una por columna se ve entrecortada. */}
            <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-input" />
            {days.map((d) => {
              const isSelected = selected?.day === d.day
              const shown = d.charges.slice(0, MAX_STACK)
              const content = (
                <>
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute inset-x-0 inset-y-0 rounded-md transition-colors duration-(--dur-press) ease-(--ease-out-quick)',
                      isSelected ? 'bg-accent' : d.isToday ? 'bg-accent/60' : '',
                    )}
                  />
                  <span aria-hidden="true" className="relative mb-1 flex flex-col-reverse items-center gap-0.5">
                    {shown.map((c) => (
                      <Dot key={c.id} charged={c.charged} />
                    ))}
                  </span>
                  {d.isToday && <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 bg-foreground" />}
                </>
              )
              const cell = 'relative flex items-end justify-center'
              return d.charges.length > 0 ? (
                <button
                  key={d.day}
                  type="button"
                  data-testid={`subscriptions-schedule-day-${d.day}`}
                  data-charges={d.charges.length}
                  data-today={d.isToday || undefined}
                  aria-pressed={isSelected}
                  aria-label={`${scheduleDayText(d)}${d.isToday ? ' (hoy)' : ''}`}
                  onClick={(event) => {
                    event.stopPropagation()
                    setPicked(d.day)
                  }}
                  className={cn(cell, 'press cursor-pointer outline-offset-2')}
                  style={{ height: stackHeight + 8 }}
                >
                  {content}
                </button>
              ) : (
                <div
                  key={d.day}
                  data-testid={`subscriptions-schedule-day-${d.day}`}
                  data-charges={0}
                  data-today={d.isToday || undefined}
                  aria-hidden="true"
                  className={cell}
                  style={{ height: stackHeight + 8 }}
                >
                  {content}
                </div>
              )
            })}
          </div>
          <div aria-hidden="true" className="relative mt-1 grid" style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}>
            {days.map((d) => {
              const label = d.day === 1 || d.day % 5 === 0 ? String(d.day) : ''
              return (
                <span
                  key={d.day}
                  className={cn(
                    'tabular text-center text-caption whitespace-nowrap',
                    d.isToday ? 'font-semibold text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {d.isToday ? 'Hoy' : label}
                </span>
              )
            })}
          </div>
        </div>

        {selected && (
          <div data-testid="subscriptions-schedule-detail" aria-live="polite" className="flex flex-col gap-2">
            <h3 className="text-callout font-medium text-foreground first-letter:uppercase">
              {scheduleDayHeading(schedule.period, selected.day, today)}
            </h3>
            <ul role="list" className="flex flex-col gap-1.5">
              {selected.charges.map((c) => (
                <li
                  key={c.id}
                  data-testid={`subscriptions-schedule-charge-${c.id}`}
                  className="flex items-center gap-2.5 text-callout"
                >
                  <Dot charged={c.charged} />
                  <span className="min-w-0 flex-1 truncate text-foreground">{c.name}</span>
                  <span className="tabular shrink-0 font-medium text-foreground">{subscriptionAmountText(c.amount.toFixed(2), c.currency)}</span>
                  <span className="w-[4.5rem] shrink-0 text-right text-footnote text-muted-foreground">{c.charged ? 'Cobrado' : 'Falta'}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Vista de tabla para lector de pantalla (en un div: una tabla ignora el ancho de sr-only): todos los cobros del mes. */}
      <div className="sr-only">
        <table data-testid="subscriptions-schedule-table">
          <caption>{chargeScheduleTitle(schedule.period)}</caption>
          <thead>
            <tr>
              <th scope="col">Día</th>
              <th scope="col">Suscripción</th>
              <th scope="col">Monto</th>
              <th scope="col">Estado</th>
            </tr>
          </thead>
          <tbody>
            {withCharges.flatMap((d) =>
              d.charges.map((c) => (
                <tr key={c.id}>
                  <th scope="row">{d.day}</th>
                  <td>{c.name}</td>
                  <td>{subscriptionAmountText(c.amount.toFixed(2), c.currency)}</td>
                  <td>{c.charged ? 'Cobrado' : 'Falta'}</td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>
    </GroupedSection>
  )
}
