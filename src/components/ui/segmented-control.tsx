import type { CSSProperties, ReactNode } from 'react'
import { Toggle } from '@base-ui/react/toggle'
import { ToggleGroup } from '@base-ui/react/toggle-group'
import { cn } from '@/lib/utils'

export interface SegmentedOption<T extends string> {
  value: T
  label: ReactNode
  testId: string
  ariaLabel?: string
}

interface SegmentedControlProps<T extends string> {
  value: T | null
  onValueChange: (value: T) => void
  options: readonly SegmentedOption<T>[]
  testId: string
  'aria-label'?: string
  'aria-labelledby'?: string
  className?: string
  size?: 'md' | 'sm'
}

/**
 * Control segmentado (ADR-023). El indicador de papel se desliza con el resorte críticamente
 * amortiguado (`--ease-spring`, sin rebote): una transición CSS, así que si se toca otra opción a
 * mitad de camino retoma desde donde está (apple-design §3). Semántica de botones con aria-pressed,
 * no de pestañas: son campos de un formulario.
 */
export function SegmentedControl<T extends string>({
  value,
  onValueChange,
  options,
  testId,
  className,
  size = 'md',
  ...aria
}: SegmentedControlProps<T>) {
  const index = options.findIndex((o) => o.value === value)
  return (
    <ToggleGroup
      data-testid={testId}
      {...aria}
      value={value ? [value] : []}
      onValueChange={(next) => {
        const picked = next[0] as T | undefined
        if (picked && picked !== value) onValueChange(picked)
      }}
      style={{ '--count': options.length, '--index': Math.max(index, 0) } as CSSProperties}
      className={cn('relative grid w-full auto-cols-fr grid-flow-col rounded-lg bg-muted p-1', className)}
    >
      <span
        aria-hidden="true"
        className={cn(
          'absolute top-1 bottom-1 left-1 w-[calc((100%-0.5rem)/var(--count))] translate-x-[calc(var(--index)*100%)] rounded-md border border-hairline bg-card transition-[translate,opacity] duration-(--dur-spring) ease-spring',
          index < 0 && 'opacity-0',
        )}
      />
      {options.map((option) => (
        <Toggle
          key={option.value}
          value={option.value}
          aria-label={option.ariaLabel}
          data-testid={option.testId}
          className={cn(
            'press relative z-10 flex items-center justify-center rounded-md px-2 text-center font-medium text-muted-foreground outline-offset-0 transition-colors duration-(--dur-fade) aria-pressed:font-semibold aria-pressed:text-foreground',
            size === 'md' ? 'min-h-10 text-callout' : 'min-h-9 text-footnote',
          )}
        >
          {option.label}
        </Toggle>
      ))}
    </ToggleGroup>
  )
}
