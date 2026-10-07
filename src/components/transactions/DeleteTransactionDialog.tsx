import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useModalFocus } from '@/hooks/useModalFocus'
import { getTransactionDeletionImpact, type DeletionImpactSummary } from '@/domain/deletion'
import { formatArs, parseMoney } from '@/domain/money'
import { deletionDebtWarning } from '@/domain/sharedDebt'
import { formatPeriod } from '@/domain/period'
import { today } from '@/lib/clock'
import type { DashboardTransaction } from '@/lib/dashboard'
import { deleteTransaction } from '@/lib/transactions'

interface DeleteTransactionDialogProps {
  transaction: DashboardTransaction | null
  isOpen: boolean
  onClose: () => void
  onDeleted: () => void
}

export function DeleteTransactionDialog({
  transaction,
  isOpen,
  onClose,
  onDeleted,
}: DeleteTransactionDialogProps) {
  const [deleting, setDeleting] = useState(false)
  const panel = useRef<HTMLDivElement>(null)
  const cancel = useRef<HTMLButtonElement>(null)
  useModalFocus(isOpen && transaction !== null, panel, cancel)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen && !deleting) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, deleting, onClose])

  if (!isOpen || !transaction) return null

  // C1: today como parámetro para la función pura de dominio
  const impact: DeletionImpactSummary = getTransactionDeletionImpact(
    {
      amount: parseMoney(transaction.amount),
      fxRate: transaction.fx_rate ? parseMoney(transaction.fx_rate) : null,
      installmentsCount: transaction.installments_count,
      occurredOn: transaction.occurred_on,
      type: transaction.type,
    },
    today(),
  )

  // US-35: la deuda vinculada deja de contar mientras el gasto esté eliminado (ADR-037 §4).
  const debtWarning = transaction.shared_debt && (
    <p data-testid="delete-transaction-debt-warning" className="text-xs font-medium text-foreground">
      {deletionDebtWarning(
        { person: transaction.shared_debt.person, amount: parseMoney(transaction.shared_debt.amount) },
        transaction.currency,
      )}
    </p>
  )

  async function handleConfirm() {
    if (!transaction || deleting) return
    setDeleting(true)
    try {
      await deleteTransaction(transaction.id)
      toast.success('Transacción eliminada', { testId: 'transaction-deleted' })
      onDeleted()
      onClose()
    } catch (err) {
      toast.error('No se pudo eliminar la transacción', {
        description: (err as { message?: string }).message,
      })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      data-testid="delete-transaction-dialog"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget && !deleting) onClose()
      }}
    >
      <div ref={panel} className="bg-card text-card-foreground border border-border rounded-xl shadow-xl max-w-sm w-full p-5 space-y-4">
        <h2 id="delete-dialog-title" className="text-lg font-semibold tracking-tight">
          ¿Eliminar transacción?
        </h2>

        {impact.hasClosedPeriodImpact ? (
          <div className="space-y-3">
            <p
              data-testid="delete-transaction-warning"
              className="text-sm text-amber-600 dark:text-amber-500 font-medium"
            >
              Aviso: Esta transacción tiene imputaciones en meses ya cerrados. Si la eliminás, van a cambiar los siguientes totales:
            </p>
            <div
              data-testid="delete-transaction-affected-periods"
              className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-xs space-y-1.5"
            >
              {impact.affectedPeriods.map((p) => (
                <div key={formatPeriod(p.period)} className="flex justify-between items-center">
                  <span className="font-medium text-foreground">
                    {formatPeriod(p.period)} {transaction.installments_count > 1 ? `(cuota ${p.installmentNumber})` : ''}
                  </span>
                  <span className="font-semibold tabular-nums text-foreground">
                    -{formatArs(p.amountArs)}
                  </span>
                </div>
              ))}
              <div className="border-t border-amber-500/20 pt-1.5 mt-1.5 flex justify-between font-semibold text-foreground">
                <span>Total meses cerrados:</span>
                <span>-{formatArs(impact.totalClosedAmountArs)}</span>
              </div>
            </div>
            {debtWarning}
            <p className="text-xs text-muted-foreground">
              Si te equivocaste, la podés restaurar desde Movimientos, en Eliminados.
            </p>
          </div>
        ) : (
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>¿Estás seguro de que querés eliminar esta transacción?</p>
            {debtWarning}
            <p className="text-xs">Si te equivocaste, la podés restaurar desde Movimientos, en Eliminados.</p>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            ref={cancel}
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={deleting}
            data-testid="delete-transaction-cancel"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleConfirm}
            disabled={deleting}
            data-testid="delete-transaction-confirm"
          >
            {deleting ? 'Eliminando…' : 'Eliminar'}
          </Button>
        </div>
      </div>
    </div>
  )
}
