import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { transactionDeletionSummary } from '@/domain/deletion'
import { parseMoney } from '@/domain/money'
import { PURGED_NOTICE, purgeConsequences } from '@/domain/transactionPurge'
import type { DashboardTransaction } from '@/lib/dashboard'
import { purgeTransaction } from '@/lib/transactions'

/**
 * Borrado definitivo de un movimiento ya eliminado (US-85, ADR-044 §1), desde la vista «Eliminados». Usa la
 * confirmación común de los borrados (US-94): dice cuál se borra y lo que arrastra, y no se puede deshacer.
 */
export function PurgeTransactionDialog({
  transaction,
  isOpen,
  onClose,
  onPurged,
}: {
  transaction: DashboardTransaction | null
  isOpen: boolean
  onClose: () => void
  onPurged: () => void
}) {
  if (!transaction) return null

  const summary = transactionDeletionSummary({
    type: transaction.type,
    amount: parseMoney(transaction.amount),
    currency: transaction.currency,
    categoryName: transaction.category?.name ?? null,
    accountName: transaction.account?.name ?? null,
    occurredOn: transaction.occurred_on,
    installmentsCount: transaction.installments_count,
  })
  const consequences = purgeConsequences({
    installmentsCount: transaction.installments_count,
    sharedPeople: transaction.shared_debts.map((d) => d.person),
    subscriptionName: transaction.subscription?.name ?? null,
  })

  async function handleConfirm() {
    if (!transaction) return
    try {
      await purgeTransaction(transaction.id)
      toast.success(PURGED_NOTICE, { testId: 'transactions-purged' })
      onPurged()
      onClose()
    } catch (err) {
      toast.error('No se pudo eliminar el movimiento definitivamente', {
        description: (err as { message?: string }).message,
      })
    }
  }

  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="¿Eliminar definitivamente?"
      summary={summary}
      confirmLabel="Eliminar definitivamente"
      busyLabel="Eliminando…"
      testId="purge-transaction"
      dialogTestId="purge-transaction-dialog"
      onConfirm={handleConfirm}
      onClose={onClose}
    >
      <p data-testid="purge-transaction-warning" className="font-medium text-foreground">
        Se borra para siempre. No se puede restaurar.
      </p>
      {consequences.map((line) => (
        <p key={line} data-testid="purge-transaction-consequence">
          {line}
        </p>
      ))}
    </ConfirmDialog>
  )
}
