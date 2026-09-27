import { formatArs, parseMoney } from '@/domain/money'
import { formatDisplayDate } from '@/domain/period'
import type { DashboardTransaction } from '@/lib/dashboard'

interface TransactionItemProps {
  transaction: DashboardTransaction
  testId?: string
}

export function TransactionItem({ transaction, testId }: TransactionItemProps) {
  const isIncome = transaction.type === 'income'
  const amountArs = formatArs(parseMoney(transaction.amount_ars))
  const dateFormatted = formatDisplayDate(transaction.occurred_on)
  const title =
    transaction.description ||
    (transaction.category ? transaction.category.name : isIncome ? 'Ingreso' : 'Gasto')

  return (
    <div
      data-testid={testId ?? 'transaction-item'}
      className="flex items-center justify-between py-3 border-b border-border/40 last:border-b-0 gap-3"
    >
      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm truncate">{title}</span>
          {transaction.installments_count > 1 && (
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium shrink-0">
              {transaction.installments_count} cuotas
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

      <div className="flex flex-col items-end shrink-0 text-right">
        <span
          className={`font-semibold text-sm tabular-nums ${
            isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'
          }`}
        >
          {isIncome ? `+${amountArs}` : `-${amountArs}`}
        </span>
        {transaction.currency === 'USD' && (
          <span className="text-xs text-muted-foreground tabular-nums">
            USD {parseMoney(transaction.amount).toFixed(2)}
          </span>
        )}
      </div>
    </div>
  )
}
