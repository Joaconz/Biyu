import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { SectionProps } from './types'

/**
 * Descripción opcional de la transacción (US-08, FR-06).
 * El usuario puede guardar sin completar este campo porque la categoría suele alcanzar.
 */
export function DescriptionSection({ values, onChange }: SectionProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="transaction-form-description">
        Descripción <span className="text-xs text-muted-foreground font-normal">(opcional)</span>
      </Label>
      <Input
        id="transaction-form-description"
        data-testid="transaction-form-description"
        type="text"
        autoComplete="off"
        placeholder="Opcional"
        className="h-11"
        value={values.description}
        onChange={(e) => onChange({ description: e.target.value })}
      />
    </div>
  )
}
