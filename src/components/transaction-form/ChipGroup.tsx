import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { toTestIdSuffix } from '@/lib/utils'

interface ChipGroupProps {
  /** Prefijo de data-testid: el grupo lo usa tal cual y cada chip le suma su nombre. */
  testId: string
  labelId: string
  describedBy?: string
  options: { id: string; name: string }[]
  value: string | null
  onChange: (id: string) => void
}

/**
 * Selección única en una grilla de chips, sin `select` (US-06). Tocar el chip ya elegido no lo
 * deselecciona: siempre hay que elegir otro.
 */
export function ChipGroup({ testId, labelId, describedBy, options, value, onChange }: ChipGroupProps) {
  return (
    <ToggleGroup
      data-testid={testId}
      aria-labelledby={labelId}
      aria-describedby={describedBy}
      variant="outline"
      className="grid w-full grid-cols-3 gap-2"
      value={value ? [value] : []}
      onValueChange={(next) => next[0] && onChange(next[0])}
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={option.id}
          value={option.id}
          data-testid={`${testId}-${toTestIdSuffix(option.name)}`}
          className="h-auto min-h-11 w-full whitespace-normal px-2 py-1.5 text-center leading-tight aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
        >
          {option.name}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
