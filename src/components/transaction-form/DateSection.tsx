import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FieldError } from './FieldError'
import type { SectionProps } from './types'

/** Fecha precargada con hoy (US-03). `today` llega de TransactionForm, que lo lee de lib/clock. */
export function DateSection({ values, errors, touched, onChange, today }: SectionProps & { today: string }) {
  const errorId = 'transaction-form-date-error'
  return (
    <div className="grid gap-2">
      <Label htmlFor="transaction-form-date">Fecha</Label>
      <Input
        id="transaction-form-date"
        data-testid="transaction-form-date"
        type="date"
        max={today}
        className="h-11"
        value={values.occurredOn}
        onChange={(e) => onChange({ occurredOn: e.target.value })}
        aria-invalid={(touched.occurredOn && !!errors.occurredOn) || undefined}
        aria-describedby={errors.occurredOn ? errorId : undefined}
      />
      <FieldError id={errorId} message={errors.occurredOn} active={!!touched.occurredOn} />
    </div>
  )
}
