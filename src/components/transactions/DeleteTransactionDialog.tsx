import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { getTransactionDeletionImpact, transactionDeletionSummary, type DeletionImpactSummary } from '@/domain/deletion'
import { formatArs, parseMoney } from '@/domain/money'
import { deletionDebtWarning } from '@/domain/sharedDebt'
import { formatPeriod, fromDbDate } from '@/domain/period'
import { subscriptionDeletionNote } from '@/domain/subscriptions'
import { today } from '@/lib/clock'
import type { DashboardTransaction } from '@/lib/dashboard'
import { deleteTransaction } from '@/lib/transactions'

interface DeleteTransactionDialogProps {
  transaction: DashboardTransaction | null
  isOpen: boolean
  onClose: () => void
  onDeleted: () => void
}

/**
 * Baja lógica de un movimiento (C10) con la confirmación común de los borrados (US-94): dice qué
 * movimiento se borra antes de confirmar, y los meses cerrados que cambian (US-65).
 */
export function DeleteTransactionDialog({
  transaction,
  isOpen,
  onClose,
  onDeleted,
}: DeleteTransactionDialogProps) {
  if (!transaction) return null

  const amount = parseMoney(transaction.amount)
  // C1: today como parámetro para la función pura de dominio
  const impact: DeletionImpactSummary = getTransactionDeletionImpact(
    {
      amount,
      fxRate: transaction.fx_rate ? parseMoney(transaction.fx_rate) : null,
      installmentsCount: transaction.installments_count,
      occurredOn: transaction.occurred_on,
      type: transaction.type,
    },
    today(),
  )

  const summary = transactionDeletionSummary({
    type: transaction.type,
    amount,
    currency: transaction.currency,
    categoryName: transaction.category?.name ?? null,
    accountName: transaction.account?.name ?? null,
    occurredOn: transaction.occurred_on,
    installmentsCount: transaction.installments_count,
  })

  // US-35: la deuda vinculada deja de contar mientras el gasto esté eliminado (ADR-037 §4).
  const debtWarning = transaction.shared_debt && (
    <p data-testid="delete-transaction-debt-warning" className="text-xs font-medium text-foreground">
      {deletionDebtWarning(
        { person: transaction.shared_debt.person, amount: parseMoney(transaction.shared_debt.amount) },
        transaction.currency,
      )}
    </p>
  )

  // US-60 CA-3: solo si la transacción tiene subscription_id.
  const subscriptionNote = transaction.subscription && (
    <p data-testid="delete-transaction-subscription-note" className="text-xs font-medium text-foreground">
      {subscriptionDeletionNote(transaction.subscription.name, fromDbDate(transaction.subscription.period))}
    </p>
  )

  async function handleConfirm() {
    if (!transaction) return
    try {
      await deleteTransaction(transaction.id)
      toast.success('Movimiento eliminado', { testId: 'transaction-deleted' })
      onDeleted()
      onClose()
    } catch (err) {
      toast.error('No se pudo eliminar el movimiento', {
        description: (err as { message?: string }).message,
      })
    }
  }

  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="¿Eliminar movimiento?"
      summary={summary}
      confirmLabel="Eliminar"
      busyLabel="Eliminando…"
      testId="delete-transaction"
      dialogTestId="delete-transaction-dialog"
      onConfirm={handleConfirm}
      onClose={onClose}
    >
      {impact.hasClosedPeriodImpact ? (
        <>
          <p data-testid="delete-transaction-warning" className="font-medium text-amber-600 dark:text-amber-500">
            Aviso: este movimiento tiene imputaciones en meses ya cerrados. Si lo eliminás, van a cambiar los
            siguientes totales:
          </p>
          <div
            data-testid="delete-transaction-affected-periods"
            className="space-y-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs"
          >
            {impact.affectedPeriods.map((p) => (
              <div key={formatPeriod(p.period)} className="flex items-center justify-between">
                <span className="font-medium text-foreground">
                  {formatPeriod(p.period)} {transaction.installments_count > 1 ? `(cuota ${p.installmentNumber})` : ''}
                </span>
                <span className="font-semibold tabular-nums text-foreground">-{formatArs(p.amountArs)}</span>
              </div>
            ))}
            <div className="mt-1.5 flex justify-between border-t border-amber-500/20 pt-1.5 font-semibold text-foreground">
              <span>Total meses cerrados:</span>
              <span>-{formatArs(impact.totalClosedAmountArs)}</span>
            </div>
          </div>
        </>
      ) : (
        <p>¿Estás seguro de que querés eliminar este movimiento?</p>
      )}
      {debtWarning}
      {subscriptionNote}
      <p className="text-xs">Si te equivocaste, lo podés restaurar desde Movimientos, en Eliminados.</p>
    </ConfirmDialog>
  )
}
