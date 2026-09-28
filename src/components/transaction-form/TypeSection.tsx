import { SegmentedControl } from '@/components/ui/segmented-control'
import type { SectionProps } from './types'

const TYPE_OPTIONS = [
  { value: 'expense' as const, label: 'Gasto', testId: 'transaction-form-type-expense' },
  { value: 'income' as const, label: 'Ingreso', testId: 'transaction-form-type-income' },
]

/** Gasto | Ingreso (US-04), precargado en Gasto. Pasar a ingreso limpia la categoría. */
export function TypeSection({ values, onChange }: SectionProps) {
  return (
    <SegmentedControl
      testId="transaction-form-type"
      aria-label="Tipo"
      value={values.type}
      options={TYPE_OPTIONS}
      onValueChange={(next) => onChange(next === 'income' ? { type: 'income', categoryId: null } : { type: 'expense' })}
    />
  )
}
