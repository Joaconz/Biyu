import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatInstallmentLabel } from '@/domain/installments'
import { formatArs, parseMoney } from '@/domain/money'
import { formatDisplayDate } from '@/domain/period'
import type { DashboardTransaction } from '@/lib/dashboard'

interface TransactionItemProps {
  transaction: DashboardTransaction
  testId?: string
  onDeleteRequest?: (transaction: DashboardTransaction) => void
}

export function TransactionItem({
  transaction,
  testId,
  onDeleteRequest,
}: TransactionItemProps) {
  const isIncome = transaction.type === 'income'
  // Lo que la imputación impacta en el mes listado: la cuota, no el total de la compra.
  const amountArs = formatArs(parseMoney(transaction.entry_amount_ars))
  const installmentLabel = formatInstallmentLabel(
    transaction.installment_number,
    transaction.installments_count,
  )
  const dateFormatted = formatDisplayDate(transaction.occurred_on)
  const title =
    transaction.description ||
    (transaction.category ? transaction.category.name : isIncome ? 'Ingreso' : 'Gasto')

  const baseTestId = testId ?? 'transaction-item'

  return (
    <div
      data-testid={baseTestId}
      className="flex items-center justify-between py-3 border-b border-border/40 last:border-b-0 gap-3"
    >
      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm truncate">{title}</span>
          {installmentLabel !== null && (
            <span
              data-testid={`${baseTestId}-installment`}
              aria-label={`Cuota ${transaction.installment_number} de ${transaction.installments_count}`}
              className="text-[11px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium tabular-nums shrink-0"
            >
              {installmentLabel}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
          <span>{dateFormatted}</span>
          {transaction.category && transaction.description && (
            <>
              <span>•</span>
              <span className="truncate">{transaction.category.name}</span>
            </>
          )}
          {transaction.account && (
            <>
              <span>•</span>
              <span className="truncate">{transaction.account.name}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="flex flex-col items-end text-right">
          <span
            className={`font-semibold text-sm tabular-nums ${
              isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'
            }`}
          >
            {isIncome ? `+${amountArs}` : `-${amountArs}`}
          </span>
          {transaction.currency === 'USD' && (
            <span className="text-xs text-muted-foreground tabular-nums">
              USD {parseMoney(transaction.entry_amount).toFixed(2)}
            </span>
          )}
        </div>

        {onDeleteRequest && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onDeleteRequest(transaction)}
            data-testid={`${baseTestId}-delete`}
            aria-label="Eliminar transacción"
            title="Eliminar"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="size-3.5" />
          </Button>
        )}
      </div>
    </div>
  )
}
