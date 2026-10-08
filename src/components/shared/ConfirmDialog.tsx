import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { useModalFocus } from '@/hooks/useModalFocus'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  children: ReactNode
  confirmLabel: string
  busyLabel: string
  /** El botón de cerrar. "Volver" cuando "Cancelar" se confundiría con la acción (US-58). */
  cancelLabel?: string
  /** `destructive` salvo en acciones reversibles como pausar o reanudar (US-56, US-57). */
  confirmVariant?: 'default' | 'destructive'
  /** `<pantalla>-<elemento>`: el diálogo es `testId`, y sus botones `testId-cancel` y `testId-confirm`. */
  testId: string
  onConfirm: () => Promise<void>
  onClose: () => void
}

/**
 * Confirmación de una acción, con el mismo aspecto que DeleteTransactionDialog. Por defecto la acción es
 * destructiva (botón bordó); pasá `confirmVariant="default"` para una reversible, como pausar o reanudar.
 * Mientras `onConfirm` corre, no se puede cerrar ni volver a confirmar.
 */
export function ConfirmDialog({
  isOpen,
  title,
  children,
  confirmLabel,
  busyLabel,
  cancelLabel = 'Cancelar',
  confirmVariant = 'destructive',
  testId,
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
      data-testid={testId}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget && !busy) onClose()
      }}
    >
      <div ref={panel} className="w-full max-w-sm space-y-4 rounded-xl border border-border bg-card p-5 text-card-foreground shadow-xl">
        <h2 id={`${testId}-title`} className="text-lg font-semibold tracking-tight">
          {title}
        </h2>
        <div className="space-y-2 text-sm text-muted-foreground">{children}</div>
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button ref={cancel} type="button" variant="outline" size="sm" onClick={onClose} disabled={busy} data-testid={`${testId}-cancel`}>
            {cancelLabel}
          </Button>
          <Button type="button" variant={confirmVariant} size="sm" onClick={handleConfirm} disabled={busy} data-testid={`${testId}-confirm`}>
            {busy ? busyLabel : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
