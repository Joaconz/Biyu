import { AccountIcon } from '@/components/shared/AccountIcon'
import { GroupedCard, GroupedSection } from '@/components/shared/GroupedList'
import { formatArs } from '@/domain/money'
import type { AccountExpenseSummary } from '@/domain/summary'
import { ACCOUNT_TYPE_LABELS, type AccountType } from '@/lib/accounts'
import { BreakdownRow } from './BreakdownRow'

export function getAccountTypeLabel(type: string): string {
  return ACCOUNT_TYPE_LABELS[type as AccountType] ?? 'Cuenta'
}

/**
 * Gasto por cuenta (US-28). Las cuentas no tienen color propio: todas las barras van en verde
 * cazador, así el color queda reservado para las categorías. El tipo se muestra solo cuando
 * agrega algo al nombre ("Visa BBVA" → Tarjeta de crédito; "Efectivo" no repite "Efectivo").
 */
export function AccountExpenseBreakdown({ accounts }: { accounts: AccountExpenseSummary[] }) {
  return (
    <GroupedSection title="Por cuenta" data-testid="dashboard-account-breakdown">
      {accounts.length === 0 ? (
        <p data-testid="dashboard-accounts-empty" className="px-1 text-callout text-muted-foreground">
          No hay gastos por cuenta en este mes.
        </p>
      ) : (
        <GroupedCard data-testid="dashboard-accounts-list" role="list">
          {accounts.map((acc) => {
            const typeLabel = getAccountTypeLabel(acc.type)
            return (
              <BreakdownRow
                key={acc.id}
                testId={`dashboard-account-item-${acc.id}`}
                icon={
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                    <AccountIcon type={acc.type} />
                  </span>
                }
                label={
                  <>
                    <span data-testid="account-item-name" className="truncate text-callout font-medium text-foreground">
                      {acc.name}
                    </span>
                    {acc.isArchived && (
                      <span
                        data-testid="account-item-archived"
                        className="shrink-0 rounded-md bg-secondary px-1.5 py-0.5 text-caption font-medium text-muted-foreground"
                      >
                        archivada
                      </span>
                    )}
                  </>
                }
                sublabel={
                  typeLabel !== acc.name && (
                    <span data-testid="account-item-type" className="truncate text-footnote text-muted-foreground">
                      {typeLabel}
                    </span>
                  )
                }
                amount={formatArs(acc.amount)}
                amountTestId="account-item-amount"
                percentage={acc.percentage}
                percentageTestId="account-item-percentage"
                barColor="var(--primary)"
                ariaLabel={`${acc.name}: ${acc.percentage}%`}
              />
            )
          })}
        </GroupedCard>
      )}
    </GroupedSection>
  )
}
