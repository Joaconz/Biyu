import { useRef, type CSSProperties, type KeyboardEvent } from 'react'
import type { DebtDirectionFilter, DebtStatusFilter } from '@/domain/debts'
import { cn } from '@/lib/utils'

interface FilterOption<T extends string> {
  value: T
  label: string
  testId: string
}

const STATUS_OPTIONS: readonly FilterOption<DebtStatusFilter>[] = [
  { value: 'pending', label: 'Pendientes', testId: 'debts-filter-pending' },
  { value: 'settled', label: 'Saldadas', testId: 'debts-filter-settled' },
  { value: 'all', label: 'Todas', testId: 'debts-filter-all' },
]

const DIRECTION_OPTIONS: readonly FilterOption<DebtDirectionFilter>[] = [
  { value: 'all', label: 'Todas', testId: 'debts-direction-filter-all' },
  { value: 'owed_to_me', label: 'Te deben', testId: 'debts-direction-filter-owed-to-me' },
  { value: 'i_owe', label: 'Debés', testId: 'debts-direction-filter-i-owe' },
]

/** Filtro por estado de Deudas (US-38): `?status=`. */
export function DebtsFilter({ value, onChange }: { value: DebtStatusFilter; onChange: (value: DebtStatusFilter) => void }) {
  return (
    <RadioFilter
      label="Qué deudas ver"
      testId="debts-filter"
      options={STATUS_OPTIONS}
      value={value}
      onChange={onChange}
      className="mb-3"
    />
  )
}

/** Filtro por dirección de Deudas (US-79): `?direction=`, con el mismo aspecto que el de estado. */
export function DebtsDirectionFilter({
  value,
  onChange,
}: {
  value: DebtDirectionFilter
  onChange: (value: DebtDirectionFilter) => void
}) {
  return (
    <RadioFilter
      label="Ver lo que te deben o lo que debés"
      testId="debts-direction-filter"
      options={DIRECTION_OPTIONS}
      value={value}
      onChange={onChange}
      variant="chips"
      className="mb-5"
    />
  )
}

/**
 * Se ve como el control segmentado (o, el de dirección, como fichas en píldora, ADR-052), pero las
 * historias lo piden como `radiogroup` con `aria-checked`: una sola opción elegida, foco itinerante y
 * flechas para moverse.
 */
function RadioFilter<T extends string>({
  label,
  testId,
  options,
  value,
  onChange,
  className,
  variant = 'segmented',
}: {
  label: string
  testId: string
  options: readonly FilterOption<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
  variant?: 'segmented' | 'chips'
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const index = options.findIndex((o) => o.value === value)

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const delta = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key]
    const target = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : delta === undefined ? null : (index + delta + options.length) % options.length
    if (target === null) return
    event.preventDefault()
    onChange(options[target].value)
    refs.current[target]?.focus()
  }

  const optionButton = (option: FilterOption<T>, i: number, optionClass: string) => (
    <button
      key={option.value}
      ref={(el) => {
        refs.current[i] = el
      }}
      type="button"
      role="radio"
      aria-checked={option.value === value}
      tabIndex={option.value === value ? 0 : -1}
      data-testid={option.testId}
      onClick={() => onChange(option.value)}
      className={optionClass}
    >
      {option.label}
    </button>
  )

  if (variant === 'chips') {
    return (
      <div role="radiogroup" aria-label={label} data-testid={testId} onKeyDown={onKeyDown} className={cn('flex flex-wrap gap-2', className)}>
        {options.map((option, i) =>
          optionButton(
            option,
            i,
            cn(
              'press flex min-h-10 items-center rounded-full px-4 text-footnote font-medium transition-colors duration-(--dur-fade)',
              option.value === value ? 'bg-primary font-semibold text-primary-foreground' : 'bg-card text-muted-foreground hover:text-foreground',
            ),
          ),
        )}
      </div>
    )
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      data-testid={testId}
      onKeyDown={onKeyDown}
      style={{ '--count': options.length, '--index': index } as CSSProperties}
      className={cn('relative grid w-full auto-cols-fr grid-flow-col rounded-full bg-secondary p-1', className)}
    >
      <span
        aria-hidden="true"
        className="absolute top-1 bottom-1 left-1 w-[calc((100%-0.5rem)/var(--count))] translate-x-[calc(var(--index)*100%)] rounded-full bg-card transition-[translate] duration-(--dur-spring) ease-spring"
      />
      {options.map((option, i) =>
        optionButton(
          option,
          i,
          cn(
            'press relative z-10 flex min-h-10 items-center justify-center rounded-full px-2 text-center text-callout font-medium text-muted-foreground outline-offset-0 transition-colors duration-(--dur-fade)',
            option.value === value && 'font-semibold text-foreground',
          ),
        ),
      )}
    </div>
  )
}
