import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { SectionProps } from './types'

const TYPE_OPTIONS = [
  { value: 'expense' as const, label: 'Gasto' },
  { value: 'income' as const, label: 'Ingreso' },
]

/**
 * Selector de tipo de transacción: Gasto o Ingreso (US-04).
 * Viene precargado en "Gasto" (expense).
 */
export function TypeSection({ values, onChange }: SectionProps) {
  return (
    <div className="grid gap-2">
      <span id="transaction-form-type-label" className="text-sm font-medium">
        Tipo
      </span>
      <ToggleGroup
        data-testid="transaction-form-type"
        aria-labelledby="transaction-form-type-label"
        variant="outline"
        className="grid w-full grid-cols-2 gap-2"
        value={[values.type]}
        onValueChange={(next) => {
          const nextType = next[0] as 'expense' | 'income' | undefined
          if (!nextType || nextType === values.type) return
          if (nextType === 'income') {
            onChange({ type: 'income', categoryId: null })
          } else {
            onChange({ type: 'expense' })
          }
        }}
      >
        {TYPE_OPTIONS.map((opt) => (
          <ToggleGroupItem
            key={opt.value}
            value={opt.value}
            data-testid={`transaction-form-type-${opt.value}`}
            className="h-auto min-h-11 w-full select-none touch-manipulation px-2 py-2 text-center text-sm font-medium leading-tight transition-[transform,background-color,border-color,color] duration-150 ease-out active:scale-[0.98] aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
          >
            {opt.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
