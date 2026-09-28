import { Banknote, CreditCard, Landmark, Wallet } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatArs } from '@/domain/money'
import type { AccountExpenseSummary } from '@/domain/summary'

const DEFAULT_ACCOUNT_PALETTE = [
  '#0284c7', // sky
  '#0d9488', // teal
  '#6366f1', // indigo
  '#d97706', // amber
  '#e11d48', // rose
  '#475569', // slate
]

export function getAccountTypeLabel(type: string): string {
  switch (type) {
    case 'credit_card':
      return 'Tarjeta de crédito'
    case 'debit_card':
      return 'Tarjeta de débito'
    case 'bank_account':
      return 'Cuenta bancaria'
    case 'wallet':
      return 'Billetera virtual'
    case 'cash':
      return 'Efectivo'
    default:
      return 'Cuenta'
  }
}

function getAccountIcon(type: string) {
  switch (type) {
    case 'credit_card':
    case 'debit_card':
      return CreditCard
    case 'bank_account':
      return Landmark
    case 'wallet':
      return Wallet
    case 'cash':
      return Banknote
    default:
      return CreditCard
  }
}

interface AccountExpenseBreakdownProps {
  accounts: AccountExpenseSummary[]
}

export function AccountExpenseBreakdown({ accounts }: AccountExpenseBreakdownProps) {
  return (
    <Card data-testid="dashboard-account-breakdown">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Gasto por cuenta</CardTitle>
      </CardHeader>
      <CardContent>
        {accounts.length === 0 ? (
          <p
            data-testid="dashboard-accounts-empty"
            className="text-sm text-muted-foreground py-4 text-center"
          >
            No hay gastos por cuenta en este período.
          </p>
        ) : (
          <div
            data-testid="dashboard-accounts-list"
            role="list"
            className="space-y-4 pt-1"
          >
            {accounts.map((acc, index) => {
              const Icon = getAccountIcon(acc.type)
              const barColor = DEFAULT_ACCOUNT_PALETTE[index % DEFAULT_ACCOUNT_PALETTE.length]
              return (
                <div
                  key={acc.id}
                  data-testid={`dashboard-account-item-${acc.id}`}
                  role="listitem"
                  className="space-y-1.5"
                >
                  <div className="flex items-center justify-between text-sm gap-2">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span
                        className="flex items-center justify-center size-7 rounded-md bg-muted shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      >
                        <Icon className="size-4" />
                      </span>
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span
                            data-testid="account-item-name"
                            className="font-medium truncate text-foreground leading-tight"
                          >
                            {acc.name}
                          </span>
                          {acc.isArchived && (
                            <span
                              data-testid="account-item-archived"
                              className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium shrink-0 leading-none"
                            >
                              archivada
                            </span>
                          )}
                        </div>
                        <span
                          data-testid="account-item-type"
                          className="text-xs text-muted-foreground truncate leading-tight mt-0.5"
                        >
                          {getAccountTypeLabel(acc.type)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0 text-right">
                      <span
                        data-testid="account-item-amount"
                        className="font-semibold tabular-nums text-foreground"
                      >
                        {formatArs(acc.amount)}
                      </span>
                      <span
                        data-testid="account-item-percentage"
                        className="text-xs text-muted-foreground tabular-nums min-w-[34px] text-right"
                      >
                        {acc.percentage}%
                      </span>
                    </div>
                  </div>

                  <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden">
                    <div
                      role="progressbar"
                      aria-valuenow={acc.percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${acc.name}: ${acc.percentage}%`}
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${Math.max(2, Math.min(100, acc.percentage))}%`,
                        backgroundColor: barColor,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
