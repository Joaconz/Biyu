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
  /** `tiles`: grilla de 4 con ícono arriba (categorías). `chips`: grilla de 2 de ancho parejo (cuentas). */
  layout: 'tiles' | 'chips'
  renderIcon?: (option: T) => ReactNode
  /** Cualquier toque en un chip, también el ya elegido (que no dispara onChange): el paso de categoría avanza con él. */
  onPick?: (id: string) => void
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
  onPick,
}: ChipGroupProps<T>) {
  return (
    <ToggleGroup
      data-testid={testId}
      aria-labelledby={labelId}
      aria-describedby={describedBy}
      value={value ? [value] : []}
      onValueChange={(next) => next[0] && onChange(next[0])}
      className={cn('grid gap-2', layout === 'tiles' ? 'grid-cols-4' : 'grid-cols-2')}
    >
      {options.map((option) => (
        <Toggle
          key={option.id}
          value={option.id}
          onClick={() => onPick?.(option.id)}
          data-testid={`${testId}-chip-${toTestIdSuffix(option.name)}`}
          className={cn(
            'press rounded-lg border border-hairline bg-card text-foreground hover:border-input aria-pressed:border-primary aria-pressed:bg-[color-mix(in_srgb,var(--primary)_7%,var(--card))] aria-pressed:ring-1 aria-pressed:ring-primary aria-pressed:ring-inset',
            layout === 'tiles'
              ? 'flex min-h-[5.25rem] flex-col items-center justify-start gap-1.5 px-1 pt-2.5 pb-2'
              : 'flex min-h-12 min-w-0 items-center gap-2.5 px-3.5 py-2 text-left text-callout leading-tight font-medium aria-pressed:text-primary [&>span]:line-clamp-2',
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
