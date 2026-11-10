import type { ReactNode } from 'react'
import { Drawer } from '@base-ui/react/drawer'
import { Popover } from '@base-ui/react/popover'
import { Check, ChevronDown, ChevronRight, SlidersHorizontal } from 'lucide-react'
import { Link } from 'react-router'
import { BALANCE_OPTION_COPY, BalanceOptionsList } from '@/components/balance/BalanceOptionsList'
import { buttonVariants } from '@/components/ui/button'
import {
  BALANCE_OPTION_KEYS,
  balanceBreakdown,
  balanceFormulaText,
  computeBalance,
  isOnlyMovements,
  ONLY_MOVEMENTS,
  optionContribution,
  type BalanceActivity,
  type BalanceLine,
  type BalanceOptionKey,
  type BalanceOptions,
} from '@/domain/balance'
import { Decimal, formatArs } from '@/domain/money'
import type { Period } from '@/domain/period'
import { committedUsdPendingText, pendingChargesCountText, type PendingSubscriptionCharges } from '@/domain/subscriptions'
import type { MonthlySummary } from '@/domain/summary'
import { SM_QUERY, useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import { fitAmountFontSize } from '@/lib/visuals'
import { Amount } from '@/components/shared/Amount'

type BalanceTone = 'surplus' | 'deficit' | 'zero'

function balanceTone(balance: Decimal): BalanceTone {
  if (balance.isZero()) return 'zero'
  return balance.isNegative() ? 'deficit' : 'surplus'
}

const BALANCE_BADGE: Record<BalanceTone, { label: string; className: string }> = {
  surplus: { label: 'Superávit', className: 'bg-[color-mix(in_srgb,var(--income)_12%,var(--card))] text-income' },
  deficit: { label: 'Déficit', className: 'bg-[color-mix(in_srgb,var(--deficit)_10%,var(--card))] text-deficit' },
  zero: { label: 'En cero', className: 'bg-secondary text-muted-foreground' },
}

const BALANCE_TEXT: Record<BalanceTone, string> = {
  surplus: 'text-income',
  deficit: 'text-deficit',
  zero: 'text-foreground',
}

/** Testid de cada línea del desglose: se conservan los que ya usaban los casos (US-29, US-83, ADR-045). */
const LINE_TEST_ID: Record<BalanceLine['key'], string> = {
  income: 'dashboard-income',
  expenses: 'dashboard-balance-expenses',
  looseDebts: 'dashboard-balance-loose-debts',
  reimbursements: 'dashboard-balance-reimbursements',
  pendingSubscriptions: 'dashboard-pending-subscriptions',
}

const LINE_AMOUNT_TEST_ID: Record<BalanceLine['key'], string> = {
  income: 'dashboard-total-income',
  expenses: 'dashboard-balance-expenses-amount',
  looseDebts: 'dashboard-balance-loose-debts-amount',
  reimbursements: 'dashboard-balance-reimbursements-amount',
  pendingSubscriptions: 'dashboard-pending-subscriptions-total',
}

/** Las líneas de una opción llevan a su pantalla, donde está el detalle. */
const LINE_LINK: Partial<Record<BalanceLine['key'], string>> = {
  looseDebts: '/debts',
  reimbursements: '/debts',
  pendingSubscriptions: '/subscriptions',
}

/**
 * La tarjeta de Balance del Resumen (US-29, US-83, US-101; ADR-047 y ADR-051): el número, un desglose que
 * dice qué suma y qué resta con su monto, y lo que el mes tiene pero queda afuera. Tocar la fórmula abre
 * los interruptores ahí mismo; el número se recalcula al instante y la elección se guarda atrás.
 *
 * Las suscripciones por cobrar (ADR-045) son una línea más. Mientras su carga no llegó (o falló), el balance
 * y la fórmula no las incluyen, así el número y lo que dice incluir coinciden.
 */
export function BalanceCard({
  summary,
  options,
  pending,
  period,
  monthName,
  onOptionsChange,
}: {
  summary: MonthlySummary
  options: BalanceOptions
  pending: PendingSubscriptionCharges | null
  period: Period
  monthName: string
  onOptionsChange: (next: BalanceOptions) => void
}) {
  const effective = pending ? options : { ...options, pendingSubscriptions: false }
  const parts = { ...summary.balanceParts, pendingSubscriptions: pending?.totalArs ?? new Decimal(0) }
  const activity: BalanceActivity = {
    looseDebts: summary.looseDebtActivity,
    reimbursements: summary.hasReimbursements,
    pendingSubscriptions: (pending?.count ?? 0) > 0,
  }
  const balance = computeBalance(parts, effective)
  const { included, excluded } = balanceBreakdown(parts, effective, activity)
  const tone = balanceTone(balance)
  const balanceText = formatArs(balance)
  const formula = balanceFormulaText(effective)
  const amounts = Object.fromEntries(
    BALANCE_OPTION_KEYS.map((key) => [key, activity[key] ? optionContribution(parts, key) : null]),
  ) as Record<BalanceOptionKey, Decimal | null>

  /** Lo que diría cada línea de suscripciones, adentro o afuera del balance. */
  const subscriptionDetail = (isIncluded: boolean) =>
    pending && (
      <>
        <span data-testid="dashboard-pending-subscriptions-count">{pendingChargesCountText(pending.count)}</span>
        {pending.usdPending && (
          <span data-testid="dashboard-pending-subscriptions-usd-pending" className="tabular text-warning">
            {committedUsdPendingText(pending.usdPending, period)}
          </span>
        )}
        {!isIncluded && (
          <span>
            Con ellas quedaría en{' '}
            <span data-testid="dashboard-pending-subscriptions-projected-balance" className="tabular font-semibold text-foreground">
              {formatArs(balance.minus(pending.totalArs))}
            </span>
          </span>
        )}
      </>
    )

  // ADR-052: el desglose ya no ocupa la tarjeta; vive en la hoja (o el popover) que abre la fórmula.
  const breakdown = (
    <>
      <ul data-testid="dashboard-balance-breakdown" aria-label="Qué suma y qué resta" className="flex flex-col px-4">
        {included.map((line) => (
          <BreakdownLine key={line.key} line={line} included>
            {line.key === 'pendingSubscriptions' && subscriptionDetail(true)}
          </BreakdownLine>
        ))}
      </ul>
      {excluded.length > 0 && (
        <div data-testid="dashboard-balance-excluded" className="flex flex-col gap-1 px-4 pt-2">
          <h3 className="text-caption font-medium text-muted-foreground">Fuera del balance</h3>
          <ul className="flex flex-col">
            {excluded.map((line) => (
              <BreakdownLine key={line.key} line={line} included={false}>
                {line.key === 'pendingSubscriptions' && subscriptionDetail(false)}
              </BreakdownLine>
            ))}
          </ul>
        </div>
      )}
    </>
  )

  return (
    <section
      data-testid="dashboard-balance"
      aria-labelledby="dashboard-balance-title"
      className="@container flex flex-col gap-3 rounded-2xl bg-card p-5 sm:p-6"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 id="dashboard-balance-title" className="text-footnote font-medium text-muted-foreground first-letter:uppercase">
          Balance de {monthName}
        </h2>
        <span
          data-testid="dashboard-balance-badge"
          className={cn('rounded-full px-2.5 py-0.5 text-caption font-semibold', BALANCE_BADGE[tone].className)}
        >
          {BALANCE_BADGE[tone].label}
        </span>
      </div>
      <Amount
        data-testid="dashboard-total-balance"
        text={balanceText}
        className={cn('block font-bold whitespace-nowrap text-display [--amount-max:var(--text-display)]', BALANCE_TEXT[tone])}
        style={{ fontSize: fitAmountFontSize(balanceText) }}
      />
      <BalanceOptionsControl
        formula={formula}
        options={options}
        balance={balance}
        tone={tone}
        monthName={monthName}
        amounts={amounts}
        breakdown={breakdown}
        onOptionsChange={onOptionsChange}
      />
    </section>
  )
}

const LINE_LABEL: Record<BalanceLine['key'], string> = {
  income: 'Ingresos',
  expenses: 'Gastos',
  looseDebts: BALANCE_OPTION_COPY.looseDebts.label,
  reimbursements: 'Reembolsos',
  // Corto: el detalle de abajo ya dice que son cobros que faltan.
  pendingSubscriptions: 'Suscripciones',
}

/**
 * Una línea del desglose: el signo adelante, en su columna, y el monto sin signo, para leer la cuenta de
 * arriba abajo como en un papel. Afuera del balance, la misma línea va apagada.
 */
function BreakdownLine({ line, included, children }: { line: BalanceLine; included: boolean; children?: ReactNode }) {
  const subtracts = line.amount.isNegative() && !line.amount.isZero()
  const link = LINE_LINK[line.key]
  const label = (
    <span className="inline-flex items-center gap-0.5 whitespace-nowrap">
      {LINE_LABEL[line.key]}
      {link && <ChevronRight aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={2} />}
    </span>
  )
  return (
    <li
      data-testid={LINE_TEST_ID[line.key]}
      data-included={included}
      className={cn(
        'grid grid-cols-[1rem_minmax(0,1fr)_auto] items-baseline gap-x-2 py-2.5 text-callout',
        !included && 'text-muted-foreground',
      )}
    >
      <span className={cn('tabular text-center font-semibold', included ? 'text-muted-foreground' : 'opacity-70')}>
        <span aria-hidden="true">{subtracts ? '−' : '+'}</span>
        <span className="sr-only">{subtracts ? 'resta' : 'suma'}</span>
      </span>
      <span className="min-w-0">
        {link ? (
          <Link
            to={link}
            data-testid={line.key === 'pendingSubscriptions' ? 'dashboard-pending-subscriptions-link' : `${LINE_TEST_ID[line.key]}-link`}
            className={cn('press -my-2 inline-flex min-h-11 items-center hover:underline', included && 'text-foreground')}
          >
            {label}
          </Link>
        ) : (
          <span className="text-foreground">{label}</span>
        )}
      </span>
      <span
        data-testid={LINE_AMOUNT_TEST_ID[line.key]}
        className={cn(
          'tabular text-right font-semibold whitespace-nowrap',
          included && (line.key === 'income' ? 'text-income' : 'text-foreground'),
        )}
      >
        {formatArs(line.amount.abs())}
      </span>
      {children && (
        <span className="col-start-2 col-end-4 flex flex-col gap-0.5 text-footnote text-muted-foreground">{children}</span>
      )}
    </li>
  )
}

/** Lo que necesitan los interruptores, igual en el popover y en la hoja. */
interface OptionsPanelProps {
  formula: string
  options: BalanceOptions
  balance: Decimal
  tone: BalanceTone
  monthName: string
  amounts: Record<BalanceOptionKey, Decimal | null>
  /** ADR-052: qué suma y qué resta, arriba de los interruptores. */
  breakdown: ReactNode
  onOptionsChange: (next: BalanceOptions) => void
}

const TRIGGER_CLASS =
  'press inline-flex min-h-11 max-w-full items-center gap-2 self-start rounded-full bg-secondary px-4 text-left text-footnote font-medium text-secondary-foreground transition-colors duration-(--dur-fade) hover:bg-accent data-popup-open:bg-accent'

/**
 * La fórmula del balance es el botón que abre los interruptores (ADR-051): desde `sm` un popover que nace del
 * botón; en el celular una hoja desde abajo, que no se sale de la pantalla, queda al alcance del pulgar y se
 * cierra deslizándola. Las dos muestran el balance en vivo y ofrecen «Solo movimientos» de un toque.
 */
function BalanceOptionsControl(props: OptionsPanelProps) {
  const asSheet = !useMediaQuery(SM_QUERY)
  const triggerProps = {
    'data-testid': 'dashboard-balance-options',
    'aria-label': `Elegir qué entra en el balance. Ahora: ${props.formula}`,
    className: TRIGGER_CLASS,
    children: <TriggerContent formula={props.formula} />,
  }

  if (asSheet) {
    return (
      <Drawer.Root>
        <Drawer.Trigger {...triggerProps} />
        <Drawer.Portal>
          <Drawer.Backdrop className="fixed inset-0 z-50 bg-black/40 transition-opacity duration-[400ms] ease-drawer data-ending-style:opacity-0 data-starting-style:opacity-0 data-swiping:duration-0" />
          {/* El viewport habilita deslizar para cerrar y bloquea el scroll de atrás. */}
          <Drawer.Viewport className="fixed inset-0 z-50 flex flex-col justify-end">
            <Drawer.Popup
              data-testid="dashboard-balance-options-panel"
              className="w-full max-h-[85dvh] translate-y-[var(--drawer-swipe-movement-y,0px)] overflow-y-auto overscroll-contain rounded-t-3xl bg-popover pb-[env(safe-area-inset-bottom)] text-popover-foreground outline-none transition-transform duration-[400ms] ease-drawer data-ending-style:translate-y-full data-ending-style:duration-[calc(var(--drawer-swipe-strength,1)*300ms)] data-starting-style:translate-y-full data-swiping:duration-0 motion-reduce:transition-opacity motion-reduce:data-ending-style:translate-y-0 motion-reduce:data-ending-style:opacity-0 motion-reduce:data-starting-style:translate-y-0 motion-reduce:data-starting-style:opacity-0"
            >
              <div aria-hidden="true" className="mx-auto mt-2 h-1 w-9 rounded-full bg-input" />
              <OptionsPanel {...props} title={<Drawer.Title className="text-headline font-semibold">Tu balance</Drawer.Title>} />
              <div className="border-t border-hairline px-4 py-3">
                <Drawer.Close
                  data-testid="dashboard-balance-options-done"
                  className={cn(buttonVariants({ variant: 'default' }), 'w-full')}
                >
                  Listo
                </Drawer.Close>
              </div>
            </Drawer.Popup>
          </Drawer.Viewport>
        </Drawer.Portal>
      </Drawer.Root>
    )
  }

  return (
    <Popover.Root>
      <Popover.Trigger {...triggerProps} />
      <Popover.Portal>
        <Popover.Positioner side="bottom" align="start" sideOffset={6} collisionPadding={16} className="z-50">
          <Popover.Popup
            data-testid="dashboard-balance-options-panel"
            className="max-h-(--available-height) w-[min(24rem,calc(100vw-2rem))] origin-(--transform-origin) overflow-y-auto rounded-2xl bg-popover shadow-xl ring-1 ring-hairline text-popover-foreground outline-none transition-[transform,opacity] duration-(--dur-fade) ease-out-quick data-ending-style:scale-[0.97] data-ending-style:opacity-0 data-ending-style:duration-100 data-starting-style:scale-[0.97] data-starting-style:opacity-0 motion-reduce:data-ending-style:scale-100 motion-reduce:data-starting-style:scale-100"
          >
            <OptionsPanel {...props} title={<Popover.Title className="text-headline font-semibold">Tu balance</Popover.Title>} />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}

function TriggerContent({ formula }: { formula: string }) {
  return (
    <>
      <SlidersHorizontal aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.8} />
      <span data-testid="dashboard-balance-formula">{formula}</span>
      <ChevronDown
        aria-hidden="true"
        className="size-3.5 shrink-0 transition-transform duration-(--dur-fade) in-data-popup-open:rotate-180"
        strokeWidth={2}
      />
    </>
  )
}

/** El contenido: título, balance en vivo, «Solo movimientos» y los tres interruptores con su monto del mes. */
function OptionsPanel({ options, balance, tone, monthName, amounts, breakdown, onOptionsChange, title }: OptionsPanelProps & { title: ReactNode }) {
  const onlyMovements = isOnlyMovements(options)
  return (
    <>
      <div className="flex flex-col gap-0.5 px-4 pt-4 pb-3">
        {title}
        <p className="flex items-baseline justify-between gap-3 text-footnote text-muted-foreground">
          <span className="first-letter:uppercase">Balance de {monthName}</span>
          <span
            data-testid="dashboard-balance-options-preview"
            aria-live="polite"
            className={cn('tabular text-callout font-semibold', BALANCE_TEXT[tone])}
          >
            {formatArs(balance)}
          </span>
        </p>
      </div>
      <div className="border-t border-hairline pt-2 pb-3">{breakdown}</div>
      <div className="border-t border-hairline">
        <button
          type="button"
          data-testid="dashboard-balance-options-only-movements"
          aria-pressed={onlyMovements}
          onClick={() => onOptionsChange(ONLY_MOVEMENTS)}
          className="press flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left hover:bg-secondary/60"
        >
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-callout font-medium text-foreground">Solo movimientos</span>
            <span className="text-footnote text-muted-foreground">Ingresos − gastos, sin nada más</span>
          </span>
          <span
            aria-hidden="true"
            className={cn(
              'flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-(--dur-fade)',
              onlyMovements ? 'border-primary bg-primary text-primary-foreground' : 'border-input',
            )}
          >
            {onlyMovements && <Check className="size-3.5" strokeWidth={2.5} />}
          </span>
        </button>
      </div>
      <p className="border-t border-hairline px-4 pt-3 pb-1 text-caption font-medium text-muted-foreground">También sumar</p>
      <BalanceOptionsList
        options={options}
        onChange={(option, value) => onOptionsChange({ ...options, [option]: value })}
        testIdPrefix="dashboard-balance-option"
        amounts={amounts}
      />
      <p className="border-t border-hairline px-4 py-3 text-caption text-muted-foreground">
        Se guarda al tocar y vale para todos los meses. No cambia ningún movimiento.
      </p>
    </>
  )
}
