import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { useModalFocus } from '@/hooks/useModalFocus'
import { cn } from '@/lib/utils'

/** Una línea de «qué se borra» (US-94): por ejemplo { label: 'Monto', value: '$12.500,00' }. */
export interface ConfirmSummaryItem {
  label: string
  value: string
}

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  /**
   * Qué se borra (US-94): monto, categoría o persona, fecha y lo que arrastra. Se ve antes del texto,
   * para que no se confirme sobre el elemento equivocado. Testid `testId-summary`.
   */
  summary?: ConfirmSummaryItem[]
  children: ReactNode
  confirmLabel: string
  busyLabel: string
  /** El botón de cerrar. "Volver" cuando "Cancelar" se confundiría con la acción (US-58). */
  cancelLabel?: string
  /** `destructive` salvo en acciones reversibles como pausar o reanudar (US-56, US-57). */
  confirmVariant?: 'default' | 'destructive'
  /** `<pantalla>-<elemento>`: el diálogo es `testId`, y sus botones `testId-cancel` y `testId-confirm`. */
  testId: string
  /** Testid del diálogo si no es `testId`, para conservar uno que ya usan los casos (`delete-transaction-dialog`). */
  dialogTestId?: string
  onConfirm: () => Promise<void>
  onClose: () => void
}

/**
 * Confirmación de una acción, común a todos los borrados (US-94). Por defecto la acción es destructiva
 * (botón bordó, separado de «Cancelar»); pasá `confirmVariant="default"` para una reversible, como pausar
 * o reanudar. Mientras `onConfirm` corre, no se puede cerrar ni volver a confirmar.
 */
export function ConfirmDialog({
  isOpen,
  title,
  summary,
  children,
  confirmLabel,
  busyLabel,
  cancelLabel = 'Cancelar',
  confirmVariant = 'destructive',
  testId,
  dialogTestId = testId,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const [busy, setBusy] = useState(false)
  const panel = useRef<HTMLDivElement>(null)
  const cancel = useRef<HTMLButtonElement>(null)
  useModalFocus(isOpen, panel, cancel)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen && !busy) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, busy, onClose])

  if (!isOpen) return null

  async function handleConfirm() {
    if (busy) return
    setBusy(true)
    try {
      await onConfirm()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${testId}-title`}
      data-testid={dialogTestId}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget && !busy) onClose()
      }}
    >
      <div ref={panel} className="w-full max-w-sm space-y-4 rounded-xl border border-border bg-card p-5 text-card-foreground shadow-xl">
        <h2 id={`${testId}-title`} className="text-lg font-semibold tracking-tight">
          {title}
        </h2>
        {summary && summary.length > 0 && (
          <dl data-testid={`${testId}-summary`} className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-lg bg-secondary px-3 py-2.5 text-sm">
            {summary.map((item) => (
              <div key={item.label} className="contents">
                <dt className="text-muted-foreground">{item.label}</dt>
                <dd className="tabular text-right font-medium text-foreground">{item.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <div className="space-y-2 text-sm text-muted-foreground">{children}</div>
        <div className={cn('flex items-center gap-2 pt-2', confirmVariant === 'destructive' ? 'justify-between' : 'justify-end')}>
          <Button ref={cancel} type="button" variant="outline" size="sm" onClick={onClose} disabled={busy} data-testid={`${testId}-cancel`}>
            {cancelLabel}
          </Button>
          {/* US-94: la acción destructiva lleva fondo de peligro, no solo texto bordó. */}
          <Button
            type="button"
            variant={confirmVariant === 'destructive' ? 'destructive-solid' : confirmVariant}
            size="sm"
            onClick={handleConfirm}
            disabled={busy}
            data-testid={`${testId}-confirm`}
          >
            {busy ? busyLabel : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
