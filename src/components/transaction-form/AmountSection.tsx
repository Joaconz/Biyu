import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FieldError } from './FieldError'
import type { SectionProps } from './types'

export function AmountSection({ values, errors, touched, onChange }: SectionProps) {
  const errorId = 'transaction-form-amount-error'
  return (
    <div className="grid gap-2">
      <Label htmlFor="transaction-form-amount">Monto</Label>
      <Input
        id="transaction-form-amount"
        data-testid="transaction-form-amount"
        inputMode="decimal"
        autoComplete="off"
        placeholder="0,00"
        className="h-12 text-2xl md:text-2xl"
        value={values.amount}
        onChange={(e) => onChange({ amount: e.target.value })}
        aria-invalid={(touched.amount && !!errors.amount) || undefined}
        aria-describedby={errors.amount ? errorId : undefined}
      />
      <FieldError id={errorId} message={errors.amount} active={!!touched.amount} />
    </div>
  )
}
