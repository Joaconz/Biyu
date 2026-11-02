import { useState } from 'react'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import {
  debtDeletionEffect,
  debtDeletionSummary,
  debtUpdateErrorReason,
  deletedNoticeText,
  type DebtRecord,
} from '@/domain/debts'
import { formatArs } from '@/domain/money'
import { deleteDebt } from '@/lib/debts'
import { toast } from 'sonner'

/**
 * Eliminar una deuda pendiente (US-87, ADR-044 §3) con la confirmación común de los borrados (US-94): dice
 * qué deuda es, cómo queda el total de su dirección y, en una suelta, el balance del mes. Si la baja falla
 * el diálogo queda abierto con el motivo, y «Eliminar» sirve para reintentar (CA-4).
 */
export function DeleteDebtDialog({
  debt,
  allDebts,
  onClose,
  onDeleted,
}: {
  debt: DebtRecord | null
  allDebts: readonly DebtRecord[]
  onClose: () => void
  onDeleted: () => Promise<void>
}) {
  const [error, setError] = useState<string | null>(null)
  const effect = debt ? debtDeletionEffect(debt, allDebts) : null

  function close() {
    setError(null)
    onClose()
  }

  async function confirm() {
    if (!debt) return
    setError(null)
    try {
      await deleteDebt(debt.id)
    } catch (err) {
      setError(debtUpdateErrorReason(err))
      return
    }
    toast.success(deletedNoticeText(debt.person), { testId: 'debts-deleted' })
    close()
    await onDeleted()
  }

  return (
    <ConfirmDialog
      isOpen={debt !== null}
      title="¿Eliminar deuda?"
      summary={debt ? debtDeletionSummary(debt) : undefined}
      confirmLabel="Eliminar"
      busyLabel="Eliminando…"
      testId="debts-delete"
      dialogTestId="debts-delete-dialog"
      onConfirm={confirm}
      onClose={close}
    >
      {effect && (
        <>
          <p data-testid="debts-delete-total">
            «{effect.totalLabel}» pasa de {formatArs(effect.before)} a {formatArs(effect.after)}.
          </p>
          {effect.balanceNote && <p data-testid="debts-delete-balance">{effect.balanceNote}</p>}
          {effect.keepsExpense && (
            <p data-testid="debts-delete-expense">El gasto compartido queda como un gasto normal, sin deuda.</p>
          )}
          <p>Se borra para siempre.</p>
        </>
      )}
      {error && (
        <p role="alert" data-testid="debts-delete-error" className="font-medium text-destructive">
          No se pudo eliminar la deuda: {error}. Probá de nuevo.
        </p>
      )}
    </ConfirmDialog>
  )
}
