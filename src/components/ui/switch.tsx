import { cn } from '@/lib/utils'

/**
 * Interruptor estilo iOS (ADR-023): `role="switch"` con `aria-checked`. El rótulo va afuera y se
 * asocia con `aria-labelledby`.
 */
export function Switch({
  checked,
  onCheckedChange,
  disabled,
  testId,
  labelledBy,
}: {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  testId: string
  labelledBy: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      disabled={disabled}
      data-testid={testId}
      onClick={() => onCheckedChange(!checked)}
      className="press relative ml-auto h-11 w-[51px] shrink-0 rounded-full disabled:opacity-45"
    >
      {/* US-96: el botón mide 44 px de alto (área táctil); el óvalo de 51×31 se dibuja adentro, sin cambiar el diseño. */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-x-0 top-1/2 h-[31px] -translate-y-1/2 rounded-full border transition-colors duration-(--dur-fade)',
          checked ? 'border-primary bg-primary' : 'border-input bg-secondary',
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          'absolute top-1/2 size-[25px] -translate-y-1/2 rounded-full border bg-card transition-[left] duration-(--dur-fade)',
          checked ? 'left-[22px] border-primary' : 'left-[2px] border-input',
        )}
      />
    </button>
  )
}
