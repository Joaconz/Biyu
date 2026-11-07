import { Switch } from '@/components/ui/switch'
import { BALANCE_OPTION_KEYS, type BalanceOptionKey, type BalanceOptions } from '@/domain/balance'
import { formatSignedArs, type Decimal } from '@/domain/money'
import { cn } from '@/lib/utils'

/** El nombre de cada opción del balance y qué es, igual en la tarjeta del Resumen y en Ajustes (US-101, ADR-051). */
export const BALANCE_OPTION_COPY: Record<BalanceOptionKey, { slug: string; label: string; hint: string }> = {
  looseDebts: {
    slug: 'loose-debts',
    label: 'Deudas sueltas',
    hint: 'Lo que prestás o te prestan sin un gasto de por medio, en el mes en que pasó.',
  },
  reimbursements: {
    slug: 'reimbursements',
    label: 'Reembolsos de gastos compartidos',
    hint: 'Lo que te deben por los gastos que compartiste.',
  },
  pendingSubscriptions: {
    slug: 'pending-subscriptions',
    label: 'Suscripciones por cobrar',
    hint: 'Lo que tus suscripciones todavía van a cobrar en el mes.',
  },
}

/**
 * Los tres interruptores de qué entra en el balance. Cada uno es `<testIdPrefix>-<slug>`, por ejemplo
 * `settings-summary-loose-debts` o `dashboard-balance-option-loose-debts`.
 *
 * Con `amounts`, cada fila dice cuánto mueve el balance de este mes (con signo; `null` si el mes no tiene
 * nada de eso) en vez de la explicación: es la vista de la tarjeta, donde lo concreto se entiende más rápido.
 */
export function BalanceOptionsList({
  options,
  onChange,
  disabled,
  testIdPrefix,
  amounts,
  className,
}: {
  options: BalanceOptions
  onChange: (option: BalanceOptionKey, value: boolean) => void
  disabled?: boolean
  testIdPrefix: string
  amounts?: Record<BalanceOptionKey, Decimal | null>
  className?: string
}) {
  return (
    <div className={cn('[&>*+*]:border-t [&>*+*]:border-hairline', className)}>
      {BALANCE_OPTION_KEYS.map((option) => {
        const { slug, label, hint } = BALANCE_OPTION_COPY[option]
        const testId = `${testIdPrefix}-${slug}`
        const amount = amounts?.[option]
        return (
          <div key={option} className="flex items-center gap-3 px-4 py-3">
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span id={`${testId}-label`} className="text-callout font-medium text-foreground">
                {label}
              </span>
              {amounts ? (
                <span data-testid={`${testId}-amount`} className="tabular text-footnote text-muted-foreground">
                  {amount ? `${formatSignedArs(amount)} este mes` : 'Nada este mes'}
                </span>
              ) : (
                <span className="text-footnote text-muted-foreground">{hint}</span>
              )}
            </div>
            <Switch
              checked={options[option]}
              onCheckedChange={(value) => onChange(option, value)}
              disabled={disabled}
              testId={testId}
              labelledBy={`${testId}-label`}
            />
          </div>
        )
      })}
    </div>
  )
}
