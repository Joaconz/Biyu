import { useRef, type CSSProperties, type KeyboardEvent } from 'react'
import type { DebtStatusFilter } from '@/domain/debts'
import { cn } from '@/lib/utils'

const OPTIONS: readonly { value: DebtStatusFilter; label: string }[] = [
  { value: 'pending', label: 'Pendientes' },
  { value: 'settled', label: 'Saldadas' },
  { value: 'all', label: 'Todas' },
]

/**
 * Filtro de Deudas (US-38). Se ve como el control segmentado, pero la historia lo pide como
 * `radiogroup` con `aria-checked`: una sola opción elegida, foco itinerante y flechas para moverse.
 */
export function DebtsFilter({ value, onChange }: { value: DebtStatusFilter; onChange: (value: DebtStatusFilter) => void }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const index = OPTIONS.findIndex((o) => o.value === value)

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const delta = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key]
    const target = event.key === 'Home' ? 0 : event.key === 'End' ? OPTIONS.length - 1 : delta === undefined ? null : (index + delta + OPTIONS.length) % OPTIONS.length
    if (target === null) return
    event.preventDefault()
    onChange(OPTIONS[target].value)
    refs.current[target]?.focus()
  }

  return (
    <div
      role="radiogroup"
      aria-label="Qué deudas ver"
      data-testid="debts-filter"
      onKeyDown={onKeyDown}
      style={{ '--count': OPTIONS.length, '--index': index } as CSSProperties}
      className="relative mb-5 grid w-full auto-cols-fr grid-flow-col rounded-lg bg-muted p-1"
    >
      <span
        aria-hidden="true"
        className="absolute top-1 bottom-1 left-1 w-[calc((100%-0.5rem)/var(--count))] translate-x-[calc(var(--index)*100%)] rounded-md border border-hairline bg-card transition-[translate] duration-(--dur-spring) ease-spring"
      />
      {OPTIONS.map((option, i) => (
        <button
          key={option.value}
          ref={(el) => {
            refs.current[i] = el
          }}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          tabIndex={option.value === value ? 0 : -1}
          data-testid={`debts-filter-${option.value}`}
          onClick={() => onChange(option.value)}
          className={cn(
            'press relative z-10 flex min-h-10 items-center justify-center rounded-md px-2 text-center text-callout font-medium text-muted-foreground outline-offset-0 transition-colors duration-(--dur-fade)',
            option.value === value && 'font-semibold text-foreground',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
