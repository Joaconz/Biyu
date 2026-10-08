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
      className={cn(
        'press relative ml-auto h-[31px] w-[51px] shrink-0 rounded-full border transition-colors duration-(--dur-fade) disabled:opacity-45',
        checked ? 'border-primary bg-primary' : 'border-input bg-secondary',
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'absolute top-[2px] size-[25px] rounded-full border bg-card transition-[left] duration-(--dur-fade)',
          checked ? 'left-[22px] border-primary' : 'left-[2px] border-input',
        )}
      />
    </button>
  )
}
