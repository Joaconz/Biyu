import { Input } from '@/components/ui/input'
import { SectionLabel } from './SectionLabel'
import type { SectionProps } from './types'

/** Nota opcional (US-08): la categoría suele alcanzar, así que se puede guardar sin completarla. */
export function DescriptionSection({ values, onChange }: SectionProps) {
  return (
    <div className="grid gap-2.5">
      <label htmlFor="transaction-form-description">
        <SectionLabel id="transaction-form-description-label">Nota (opcional)</SectionLabel>
      </label>
      <Input
        id="transaction-form-description"
        data-testid="transaction-form-description"
        type="text"
        autoComplete="off"
        enterKeyHint="done"
        placeholder="Almuerzo con Sofi"
        value={values.description}
        onChange={(e) => onChange({ description: e.target.value })}
      />
    </div>
  )
}
