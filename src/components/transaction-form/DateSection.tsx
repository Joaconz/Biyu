import { useRef } from 'react'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { addDays, relativeDay, type RelativeDay } from '@/domain/period'
import { FieldError } from './FieldError'
import { SectionLabel } from './SectionLabel'
import type { SectionProps } from './types'

const DAY_OPTIONS = [
  { value: 'today' as const, label: 'Hoy', testId: 'transaction-form-date-today' },
  { value: 'yesterday' as const, label: 'Ayer', testId: 'transaction-form-date-yesterday' },
  { value: 'other' as const, label: 'Otra', testId: 'transaction-form-date-other' },
]

/**
 * Fecha precargada con hoy (US-03), con atajos Hoy | Ayer | Otra para no abrir el calendario en
 * el caso común. El `<input type="date">` sigue a la vista: muestra el día elegido y se puede
 * completar directo. `today` llega de TransactionForm, que lo lee de lib/clock (C1).
 */
export function DateSection({ values, errors, touched, onChange, today }: SectionProps & { today: string }) {
  const errorId = 'transaction-form-date-error'
  const input = useRef<HTMLInputElement>(null)
  const todayDate = new Date(`${today}T12:00:00`)
  const current: RelativeDay | null = values.occurredOn ? relativeDay(values.occurredOn, todayDate) : null

  function pick(next: RelativeDay) {
    if (next === 'today') onChange({ occurredOn: today })
    else if (next === 'yesterday') onChange({ occurredOn: addDays(today, -1) })
    else {
      input.current?.focus()
      try {
        input.current?.showPicker?.()
      } catch {
        // Algunos navegadores solo abren el calendario con un gesto directo sobre el input.
      }
    }
  }

  return (
    <div className="grid gap-2.5">
      <SectionLabel id="transaction-form-date-label">Fecha</SectionLabel>
      <div className="flex items-center gap-2">
        <SegmentedControl
          testId="transaction-form-date-shortcuts"
          aria-labelledby="transaction-form-date-label"
          className="flex-1"
          value={current}
          options={DAY_OPTIONS}
          onValueChange={pick}
        />
        <label htmlFor="transaction-form-date" className="sr-only">
          Fecha
        </label>
        <input
          ref={input}
          id="transaction-form-date"
          data-testid="transaction-form-date"
          type="date"
          max={today}
          className="tabular h-12 w-[8.75rem] shrink-0 rounded-lg border border-input bg-card px-2.5 text-callout text-foreground outline-none focus-visible:border-primary"
          value={values.occurredOn}
          onChange={(e) => onChange({ occurredOn: e.target.value })}
          aria-invalid={(touched.occurredOn && !!errors.occurredOn) || undefined}
          aria-describedby={errors.occurredOn ? errorId : undefined}
        />
      </div>
      <FieldError id={errorId} message={errors.occurredOn} active={!!touched.occurredOn} />
    </div>
  )
}
