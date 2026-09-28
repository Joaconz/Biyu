import type { ReactNode } from 'react'
import { Toggle } from '@base-ui/react/toggle'
import { ToggleGroup } from '@base-ui/react/toggle-group'
import { cn } from '@/lib/utils'
import { toTestIdSuffix } from '@/lib/utils'

interface ChipGroupProps<T extends { id: string; name: string }> {
  /** data-testid del grupo; cada chip es `<testId>-chip-<nombre>`. */
  testId: string
  labelId: string
  describedBy?: string
  options: T[]
  value: string | null
  onChange: (id: string) => void
  /** `tiles`: grilla de 4 con ícono arriba (categorías). `chips`: fila que se envuelve (cuentas). */
  layout: 'tiles' | 'chips'
  renderIcon?: (option: T) => ReactNode
}

/**
 * Selección única sin `select` (US-06). Tocar el elegido no lo deselecciona. La selección se marca
 * con anillo y tinte verde, no con relleno sólido: el único verde lleno de la pantalla es Guardar.
 */
export function ChipGroup<T extends { id: string; name: string }>({
  testId,
  labelId,
  describedBy,
  options,
  value,
  onChange,
  layout,
  renderIcon,
}: ChipGroupProps<T>) {
  return (
    <ToggleGroup
      data-testid={testId}
      aria-labelledby={labelId}
      aria-describedby={describedBy}
      value={value ? [value] : []}
      onValueChange={(next) => next[0] && onChange(next[0])}
      className={cn(layout === 'tiles' ? 'grid grid-cols-4 gap-2' : 'flex flex-wrap gap-2')}
    >
      {options.map((option) => (
        <Toggle
          key={option.id}
          value={option.id}
          data-testid={`${testId}-chip-${toTestIdSuffix(option.name)}`}
          className={cn(
            'press rounded-lg border border-hairline bg-card text-foreground hover:border-input aria-pressed:border-primary aria-pressed:bg-[color-mix(in_srgb,var(--primary)_7%,var(--card))] aria-pressed:ring-1 aria-pressed:ring-primary aria-pressed:ring-inset',
            layout === 'tiles'
              ? 'flex min-h-[5.25rem] flex-col items-center justify-start gap-1.5 px-1 pt-2.5 pb-2'
              : 'inline-flex min-h-11 items-center gap-2 px-3.5 text-callout font-medium aria-pressed:text-primary',
          )}
        >
          {renderIcon?.(option)}
          <span
            className={cn(
              layout === 'tiles' &&
                'line-clamp-2 w-full text-center text-caption font-medium break-words hyphens-auto [overflow-wrap:anywhere]',
            )}
          >
            {option.name}
          </span>
        </Toggle>
      ))}
    </ToggleGroup>
  )
}
