import { useEffect, useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  children: ReactNode
  confirmLabel: string
  busyLabel: string
  /** `<pantalla>-<elemento>`: el diálogo es `testId`, y sus botones `testId-cancel` y `testId-confirm`. */
  testId: string
  onConfirm: () => Promise<void>
  onClose: () => void
}

/**
 * Confirmación de una acción destructiva, con el mismo aspecto que DeleteTransactionDialog.
 * Mientras `onConfirm` corre, no se puede cerrar ni volver a confirmar.
 */
export function ConfirmDialog({ isOpen, title, children, confirmLabel, busyLabel, testId, onConfirm, onClose }: ConfirmDialogProps) {
  const [busy, setBusy] = useState(false)

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
      <div className="w-full max-w-sm space-y-4 rounded-xl border border-border bg-card p-5 text-card-foreground shadow-xl">
        <h2 id={`${testId}-title`} className="text-lg font-semibold tracking-tight">
          {title}
        </h2>
        <div className="space-y-2 text-sm text-muted-foreground">{children}</div>
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={busy} data-testid={`${testId}-cancel`}>
            Cancelar
          </Button>
          <Button type="button" variant="destructive" size="sm" onClick={handleConfirm} disabled={busy} data-testid={`${testId}-confirm`}>
            {busy ? busyLabel : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
