import { TriangleAlert } from 'lucide-react'
import { Link } from 'react-router'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { isReferenceRateOverridden, parseDraftInput } from '@/domain/draft'
import { convertToArs, formatArs } from '@/domain/money'
import { FieldError } from './FieldError'
import type { SectionProps } from './types'

interface CurrencySectionProps extends SectionProps {
  referenceRateStatus: 'idle' | 'loading' | 'found' | 'missing' | 'error'
  referenceRate: string | null
}

/**
 * Tipo de cambio de un gasto en dólares (US-19 a US-21). El selector ARS | US$ vive junto al monto
 * (AmountSection); en ARS esta sección no muestra nada.
 */
export function CurrencySection({ values, errors, touched, onChange, referenceRateStatus, referenceRate }: CurrencySectionProps) {
  if (values.currency !== 'USD') return null
  const errorId = 'transaction-form-fx-rate-error'
  const helpId = 'transaction-form-fx-rate-help'
  const hasOverride = isReferenceRateOverridden(values.fxRate, referenceRate)
  const draft = parseDraftInput(values)
  // Equivalente informativo: el monto que va a sumar al Resumen, con el TC que se congela al guardar (C5).
  const arsEquivalent = draft.amount && draft.fxRate && !errors.amount && !errors.fxRate ? formatArs(convertToArs(draft.amount, draft.fxRate)) : null

  return (
    <div className="grid gap-2 rounded-lg border border-hairline bg-card p-4 starting:opacity-0 transition-opacity duration-(--dur-fade)">
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor="transaction-form-fx-rate">Tipo de cambio (ARS por US$)</Label>
        {arsEquivalent && (
          <span data-testid="transaction-form-fx-ars-equivalent" className="tabular text-footnote text-muted-foreground">
            ≈ {arsEquivalent}
          </span>
        )}
      </div>
      <Input
        id="transaction-form-fx-rate"
        data-testid="transaction-form-fx-rate"
        inputMode="decimal"
        enterKeyHint="done"
        autoComplete="off"
        required
        aria-required="true"
        placeholder="0,00"
        className="tabular"
        value={values.fxRate}
        onChange={(e) => onChange({ fxRate: e.target.value })}
        aria-invalid={(touched.fxRate && !!errors.fxRate) || undefined}
        aria-describedby={errors.fxRate ? `${helpId} ${errorId}` : helpId}
      />
      <p id={helpId} data-testid="transaction-form-fx-rate-status" className="text-footnote text-muted-foreground">
        {hasOverride
          ? 'Estás usando un valor distinto al de referencia. Se aplica solo a esta transacción.'
          : 'Podés cambiarlo: el valor que ingreses se aplica solo a esta transacción.'}
      </p>
      <FieldError id={errorId} message={errors.fxRate} active={!!touched.fxRate} />
      {referenceRateStatus === 'loading' && (
        <p data-testid="transaction-form-fx-loading" className="text-footnote text-muted-foreground" aria-live="polite">
          Buscando el tipo de cambio de este mes…
        </p>
      )}
      {(referenceRateStatus === 'missing' || referenceRateStatus === 'error') && (
        <div className="flex gap-3 rounded-lg bg-warning-surface p-3 text-warning">
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" strokeWidth={1.8} />
          <div className="grid gap-1">
            <p className="text-footnote">
              {referenceRateStatus === 'missing'
                ? 'No tenés un tipo de cambio configurado para este mes.'
                : 'No pudimos consultar el tipo de cambio de este mes.'}
            </p>
            <Link
              to="/settings"
              data-testid="transaction-form-fx-settings"
              className="press inline-flex min-h-11 items-center self-start text-footnote font-semibold underline underline-offset-4"
            >
              Ir a Ajustes
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
