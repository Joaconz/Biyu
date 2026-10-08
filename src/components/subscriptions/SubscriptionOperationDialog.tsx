import { useEffect, useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { saveFailureReason } from '@/lib/errors'

/**
 * Diálogo de una operación sobre una suscripción (pausar, reanudar, cancelar; US-56 a US-58). `run`
 * llama a la RPC y devuelve el texto del aviso; si falla, el diálogo queda abierto con
 * "<failurePrefix>: <motivo>" (`<testId>-error`) y los botones habilitados.
 */
export function SubscriptionOperationDialog({
  isOpen,
  title,
  confirmLabel,
  busyLabel,
  cancelLabel,
  confirmVariant,
  testId,
  failurePrefix,
  run,
  onDone,
  onClose,
  children,
}: {
  isOpen: boolean
  title: string
  confirmLabel: string
  busyLabel: string
  cancelLabel?: string
  confirmVariant?: 'default' | 'destructive'
  testId: string
  /** "No se pudo pausar", "No se pudo reanudar"… */
  failurePrefix: string
  run: () => Promise<string>
  /** Después de la operación: la pantalla vuelve a leer la suscripción. */
  onDone: () => void
  onClose: () => void
  children: ReactNode
}) {
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    if (!isOpen) setError(null)
  }, [isOpen])

  async function onConfirm() {
    setError(null)
    try {
      toast.success(await run(), { testId: 'subscription-toast' })
      onDone()
      onClose()
    } catch (err) {
      setError(`${failurePrefix}: ${saveFailureReason(err)}`)
    }
  }

  return (
    <ConfirmDialog
      isOpen={isOpen}
      title={title}
      confirmLabel={confirmLabel}
      busyLabel={busyLabel}
      cancelLabel={cancelLabel}
      confirmVariant={confirmVariant}
      testId={testId}
      onConfirm={onConfirm}
      onClose={onClose}
    >
      {children}
      {error && (
        <p role="alert" data-testid={`${testId}-error`} className="text-destructive">
          {error}
        </p>
      )}
    </ConfirmDialog>
  )
}
