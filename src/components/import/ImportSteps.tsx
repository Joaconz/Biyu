import { cn } from '@/lib/utils'

export type ImportStep = 1 | 2 | 3

const STEPS: { step: ImportStep; label: string }[] = [
  { step: 1, label: 'Archivo' },
  { step: 2, label: 'Revisión' },
  { step: 3, label: 'Resultado' },
]

/** "1 Archivo · 2 Revisión · 3 Resultado" con el paso actual marcado (§1). El paso no va en la URL. */
export function ImportSteps({ current }: { current: ImportStep }) {
  return (
    <ol data-testid="import-steps" data-step={String(current)} className="flex items-center gap-2 text-footnote">
      {STEPS.map(({ step, label }, i) => (
        <li key={step} className="flex items-center gap-2" aria-current={step === current ? 'step' : undefined}>
          {i > 0 && (
            <span aria-hidden="true" className="text-muted-foreground">
              ·
            </span>
          )}
          <span className={cn('flex items-center gap-1.5', step === current ? 'font-semibold text-foreground' : 'text-muted-foreground')}>
            <span
              className={cn(
                'tabular flex size-5 items-center justify-center rounded-full text-caption',
                step === current ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground',
              )}
            >
              {step}
            </span>
            {label}
          </span>
        </li>
      ))}
    </ol>
  )
}
