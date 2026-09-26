import type { Account } from '@/lib/catalog'
import { ChipGroup } from './ChipGroup'
import { FieldError } from './FieldError'
import type { SectionProps } from './types'

export function AccountSection({ values, errors, touched, onChange, accounts }: SectionProps & { accounts: Account[] }) {
  const errorId = 'transaction-form-account-error'
  return (
    <div className="grid gap-2">
      <span id="transaction-form-account-label" className="text-sm font-medium">Cuenta</span>
      {accounts.length === 0 ? (
        <p data-testid="transaction-form-account-empty" className="text-sm text-muted-foreground">
          Todavía no tenés cuentas cargadas.
        </p>
      ) : (
        <ChipGroup
          testId="transaction-form-account"
          labelId="transaction-form-account-label"
          describedBy={errors.accountId ? errorId : undefined}
          options={accounts}
          value={values.accountId}
          onChange={(id) =>
            onChange({ accountId: id, accountType: accounts.find((a) => a.id === id)?.type ?? null })
          }
        />
      )}
      <FieldError id={errorId} message={errors.accountId} active={!!touched.accountId} />
    </div>
  )
}
