import { Toggle } from '@base-ui/react/toggle'
import { ToggleGroup } from '@base-ui/react/toggle-group'
import { CalendarRange } from 'lucide-react'
import { parseDraftInput } from '@/domain/draft'
import { previewInstallments } from '@/domain/installments'
import { MAX_INSTALLMENTS } from '@/domain/validation'
import { FieldError } from './FieldError'
import { SectionLabel } from './SectionLabel'
import type { SectionProps } from './types'

const OPTIONS = Array.from({ length: MAX_INSTALLMENTS }, (_, i) => String(i + 1))

// Aparece al elegir tarjeta de crédito: un fundido corto evita el salto seco.
const FADE_IN = 'transition-opacity duration-(--dur-fade) ease-out-quick starting:opacity-0'

/**
 * Cantidad de cuotas de 1 a MAX_INSTALLMENTS (US-12), un toque por número. Escribe solo
 * `installmentsCount`; el reparto lo hace create_transaction (C4). Debajo, la previsualización del
 * impacto mensual (US-13), que sale entera del dominio.
 */
export function InstallmentsField({ values, errors, touched, onChange }: SectionProps) {
  const errorId = 'transaction-form-installments-error'
  const preview = previewInstallments(parseDraftInput(values), errors)
  return (
    <div className={`grid gap-2.5 ${FADE_IN}`}>
      <SectionLabel id="transaction-form-installments-label">Cuotas</SectionLabel>
      <ToggleGroup
        data-testid="transaction-form-installments"
        aria-labelledby="transaction-form-installments-label"
        aria-describedby={errors.installmentsCount ? errorId : undefined}
        className="grid grid-cols-6 gap-2"
        value={[String(values.installmentsCount)]}
        onValueChange={(next) => next[0] && onChange({ installmentsCount: Number(next[0]) })}
      >
        {OPTIONS.map((n) => (
          <Toggle
            key={n}
            value={n}
            aria-label={n === '1' ? '1 cuota' : `${n} cuotas`}
            data-testid={`transaction-form-installments-chip-${n}`}
            className="press tabular h-11 rounded-lg border border-hairline bg-card text-callout font-medium text-foreground hover:border-input aria-pressed:border-primary aria-pressed:bg-[color-mix(in_srgb,var(--primary)_7%,var(--card))] aria-pressed:text-primary aria-pressed:ring-1 aria-pressed:ring-primary aria-pressed:ring-inset"
          >
            {n}
          </Toggle>
        ))}
      </ToggleGroup>
      <FieldError id={errorId} message={errors.installmentsCount} active={!!touched.installmentsCount} />
      <div aria-live="polite">
        {preview && (
          <div
            data-testid="transaction-form-installments-preview"
            className={`flex gap-3 rounded-lg bg-muted px-3.5 py-3 ${FADE_IN}`}
          >
            <CalendarRange aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={1.8} />
            <div className="grid gap-0.5">
              <p data-testid="transaction-form-installments-preview-summary" className="tabular text-callout font-medium">
                {preview.installments} · <span className="whitespace-nowrap">{preview.range}</span>
              </p>
              {preview.lastInstallment && (
                <p data-testid="transaction-form-installments-preview-last" className="tabular text-footnote text-muted-foreground">
                  {preview.lastInstallment}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
