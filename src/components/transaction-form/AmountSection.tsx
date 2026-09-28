import { SegmentedControl } from '@/components/ui/segmented-control'
import type { Currency } from '@/domain/fx'
import { FieldError } from './FieldError'
import type { SectionProps } from './types'

const CURRENCY_OPTIONS: { value: Currency; label: string; testId: string; ariaLabel: string }[] = [
  { value: 'ARS', label: 'ARS', testId: 'transaction-form-currency-ars', ariaLabel: 'Pesos' },
  { value: 'USD', label: 'US$', testId: 'transaction-form-currency-usd', ariaLabel: 'Dólares' },
]

/**
 * El monto es el protagonista (ADR-023): Playfair grande y centrado, con la moneda debajo (US-05).
 * Toma el foco al montar y pide el teclado numérico con coma (US-02). La fuente supera los 16px,
 * así que iOS no hace zoom al enfocar.
 */
export function AmountSection({ values, errors, touched, onChange }: SectionProps) {
  const errorId = 'transaction-form-amount-error'
  const width = `${Math.max(values.amount.length, 4) + 0.5}ch`
  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <label htmlFor="transaction-form-amount" className="sr-only">
        Monto
      </label>
      <div className="flex max-w-full items-baseline justify-center gap-1.5 font-serif text-foreground">
        <span aria-hidden="true" className="text-title-1 font-medium text-muted-foreground">
          {values.currency === 'USD' ? 'US$' : '$'}
        </span>
        <input
          id="transaction-form-amount"
          data-testid="transaction-form-amount"
          autoFocus
          inputMode="decimal"
          enterKeyHint="done"
          autoComplete="off"
          placeholder="0,00"
          style={{ width }}
          className="serif-numerals min-w-0 max-w-[calc(100vw-6rem)] bg-transparent text-left text-amount font-semibold caret-primary outline-none placeholder:text-muted-foreground/45 focus-visible:outline-none"
          value={values.amount}
          onChange={(e) => onChange({ amount: e.target.value })}
          aria-invalid={(touched.amount && !!errors.amount) || undefined}
          aria-describedby={errors.amount ? errorId : undefined}
        />
      </div>
      <div className="w-40">
        <SegmentedControl
          testId="transaction-form-currency"
          aria-label="Moneda"
          size="sm"
          value={values.currency}
          options={CURRENCY_OPTIONS}
          onValueChange={(next) => onChange(next === 'ARS' ? { currency: 'ARS', fxRate: '' } : { currency: 'USD' })}
        />
      </div>
      <div className="min-h-5 text-center">
        <FieldError id={errorId} message={errors.amount} active={!!touched.amount} />
      </div>
    </div>
  )
}
