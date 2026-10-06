import { Input } from '@/components/ui/input'
import { MAX_PERSON_LENGTH, sharedDebtPreview } from '@/domain/sharedDebt'
import { cn } from '@/lib/utils'
import { FieldError } from './FieldError'
import type { SectionProps } from './types'

/**
 * "Gasto compartido" (US-34, ADR-036): persona y cuánto te debe, en la moneda del gasto. Solo se
 * monta para un gasto. Escribe `shared`, `sharedPerson` y `sharedAmount`; la deuda viaja en la
 * misma llamada a create_transaction (C4). Un campo vacío muestra su error al perder el foco.
 */
export function SharedSection({ values, errors, touched, onChange, onTouch }: SectionProps & {
  onTouch: (field: 'sharedPerson' | 'sharedAmount') => void
}) {
  const personErrorId = 'transaction-form-shared-person-error'
  const amountErrorId = 'transaction-form-shared-amount-error'
  const summary =
    errors.sharedPerson || errors.sharedAmount
      ? null
      : sharedDebtPreview({ person: values.sharedPerson, amount: values.sharedAmount }, values.amount, values.currency)

  return (
    <div className="overflow-hidden rounded-xl border border-hairline bg-card">
      <div className="flex min-h-12 items-center gap-3 px-4 py-2.5">
        <span id="transaction-form-shared-label" className="text-callout font-semibold">
          Gasto compartido
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={values.shared}
          aria-labelledby="transaction-form-shared-label"
          data-testid="transaction-form-shared-toggle"
          onClick={() => onChange({ shared: !values.shared })}
          className={cn(
            'press relative ml-auto h-[31px] w-[51px] shrink-0 rounded-full border transition-colors duration-(--dur-fade)',
            values.shared ? 'border-primary bg-primary' : 'border-input bg-secondary',
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              'absolute top-[2px] size-[25px] rounded-full border bg-card transition-[left] duration-(--dur-fade)',
              values.shared ? 'left-[22px] border-primary' : 'left-[2px] border-input',
            )}
          />
        </button>
      </div>

      {values.shared && (
        <div className="grid gap-3 border-t border-hairline px-4 py-3">
          <div className="grid gap-1.5">
            <label htmlFor="transaction-form-shared-person" className="text-footnote font-semibold">
              ¿Con quién?
            </label>
            <Input
              id="transaction-form-shared-person"
              data-testid="transaction-form-shared-person"
              type="text"
              autoComplete="off"
              enterKeyHint="next"
              maxLength={MAX_PERSON_LENGTH}
              placeholder="Nombre"
              value={values.sharedPerson}
              onChange={(e) => onChange({ sharedPerson: e.target.value })}
              onBlur={() => onTouch('sharedPerson')}
              aria-invalid={(touched.sharedPerson && !!errors.sharedPerson) || undefined}
              aria-describedby={errors.sharedPerson ? personErrorId : undefined}
            />
            <SharedFieldError id={personErrorId} message={errors.sharedPerson} active={!!touched.sharedPerson} />
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="transaction-form-shared-amount" className="text-footnote font-semibold">
              ¿Cuánto te debe?
            </label>
            <div className="relative">
              <span
                aria-hidden="true"
                data-testid="transaction-form-shared-amount-prefix"
                className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground"
              >
                {values.currency === 'USD' ? 'US$' : '$'}
              </span>
              <Input
                id="transaction-form-shared-amount"
                data-testid="transaction-form-shared-amount"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                enterKeyHint="done"
                className={cn('tabular', values.currency === 'USD' ? 'pl-12' : 'pl-7')}
                value={values.sharedAmount}
                onChange={(e) => onChange({ sharedAmount: e.target.value })}
                onBlur={() => onTouch('sharedAmount')}
                aria-invalid={(touched.sharedAmount && !!errors.sharedAmount) || undefined}
                aria-describedby={errors.sharedAmount ? amountErrorId : undefined}
              />
            </div>
            <SharedFieldError id={amountErrorId} message={errors.sharedAmount} active={!!touched.sharedAmount} />
          </div>

          {summary && (
            <p data-testid="transaction-form-shared-summary" className="tabular text-footnote text-muted-foreground">
              {summary}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

/** Como FieldError, pero con role="alert": la spec de US-34 pide que el motivo se anuncie. */
function SharedFieldError({ id, message, active }: { id: string; message?: string; active: boolean }) {
  if (!message || !active) return null
  return (
    <p id={id} data-testid={id} role="alert" className="text-footnote text-destructive">
      {message}
    </p>
  )
}
