import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { Currency } from '@/domain/fx'
import { FieldError } from './FieldError'
import type { SectionProps } from './types'

const CURRENCY_OPTIONS: { value: Currency; label: string }[] = [
  { value: 'ARS', label: 'ARS' },
  { value: 'USD', label: 'USD' },
]

/**
 * Selector de moneda (US-05) y tipo de cambio (US-19 a US-21).
 * La moneda por defecto es ARS y en ARS no se muestra el campo de tipo de cambio.
 */
export function CurrencySection({ values, errors, touched, onChange }: SectionProps) {
  const errorId = 'transaction-form-fx-rate-error'
  const isUsd = values.currency === 'USD'

  return (
    <div className="grid gap-2">
      <span id="transaction-form-currency-label" className="text-sm font-medium">
        Moneda
      </span>
      <ToggleGroup
        data-testid="transaction-form-currency"
        aria-labelledby="transaction-form-currency-label"
        variant="outline"
        className="grid w-full grid-cols-2 gap-2"
        value={[values.currency]}
        onValueChange={(next) => {
          const nextCurrency = next[0] as Currency | undefined
          if (!nextCurrency || nextCurrency === values.currency) return
          if (nextCurrency === 'ARS') {
            onChange({ currency: 'ARS', fxRate: '' })
          } else {
            onChange({ currency: 'USD' })
          }
        }}
      >
        {CURRENCY_OPTIONS.map((opt) => (
          <ToggleGroupItem
            key={opt.value}
            value={opt.value}
            data-testid={`transaction-form-currency-${opt.value.toLowerCase()}`}
            className="h-auto min-h-11 w-full select-none touch-manipulation px-2 py-2 text-center text-sm font-medium leading-tight transition-[transform,background-color,border-color,color] duration-150 ease-out active:scale-[0.98] aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
          >
            {opt.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {isUsd && (
        <div className="grid gap-2 pt-1">
          <Label htmlFor="transaction-form-fx-rate">Tipo de cambio</Label>
          <Input
            id="transaction-form-fx-rate"
            data-testid="transaction-form-fx-rate"
            inputMode="decimal"
            autoComplete="off"
            placeholder="0,00"
            className="h-11 text-base md:text-base"
            value={values.fxRate}
            onChange={(e) => onChange({ fxRate: e.target.value })}
            aria-invalid={(touched.fxRate && !!errors.fxRate) || undefined}
            aria-describedby={errors.fxRate ? errorId : undefined}
          />
          <FieldError id={errorId} message={errors.fxRate} active={!!touched.fxRate} />
        </div>
      )}
    </div>
  )
}
