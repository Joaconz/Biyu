import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { MAX_INSTALLMENTS } from '@/domain/validation'
import { FieldError } from './FieldError'
import type { SectionProps } from './types'

const OPTIONS = Array.from({ length: MAX_INSTALLMENTS }, (_, i) => String(i + 1))

// Aparece al elegir tarjeta de crédito y al cargar el monto: un fundido corto evita el salto seco.
const FADE_IN = 'transition-opacity duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] starting:opacity-0'

/**
 * Cantidad de cuotas de 1 a MAX_INSTALLMENTS (US-12), como chips numéricos: un toque, sin
 * `select`. Escribe solo `installmentsCount`; el reparto lo hace create_transaction (C4).
 */
export function InstallmentsField({ values, errors, touched, onChange }: SectionProps) {
  const errorId = 'transaction-form-installments-error'
  return (
    <div className={`grid gap-2 ${FADE_IN}`}>
      <span id="transaction-form-installments-label" className="text-sm font-medium">Cuotas</span>
      <ToggleGroup
        data-testid="transaction-form-installments"
        aria-labelledby="transaction-form-installments-label"
        aria-describedby={errors.installmentsCount ? errorId : undefined}
        variant="outline"
        className="grid w-full grid-cols-6 gap-2"
        value={[String(values.installmentsCount)]}
        onValueChange={(next) => next[0] && onChange({ installmentsCount: Number(next[0]) })}
      >
        {OPTIONS.map((n) => (
          <ToggleGroupItem
            key={n}
            value={n}
            aria-label={n === '1' ? '1 cuota' : `${n} cuotas`}
            data-testid={`transaction-form-installments-chip-${n}`}
            className="h-11 w-full touch-manipulation px-0 tabular-nums select-none transition-[transform,background-color,border-color,color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
          >
            {n}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <FieldError id={errorId} message={errors.installmentsCount} active={!!touched.installmentsCount} />
    </div>
  )
}
