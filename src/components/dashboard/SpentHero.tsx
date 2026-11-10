import { useRef, useState, type ReactNode } from 'react'
import { Drawer } from '@base-ui/react/drawer'
import { Popover } from '@base-ui/react/popover'
import { Check, ChevronDown, ChevronRight, SlidersHorizontal } from 'lucide-react'
import { Link } from 'react-router'
import { BALANCE_OPTION_COPY, BalanceOptionsList } from '@/components/balance/BalanceOptionsList'
import { Amount } from '@/components/shared/Amount'
import { buttonVariants } from '@/components/ui/button'
import {
  isOnlyExpenses,
  ONLY_EXPENSES,
  spentFormulaText,
  spentLabel,
  spentView,
  type BalanceLine,
  type BalanceOptionKey,
  type BalanceOptions,
} from '@/domain/balance'
import { type Decimal, formatArs, formatUsd } from '@/domain/money'
import type { Period } from '@/domain/period'
import { committedUsdPendingText, pendingChargesCountText, type PendingSubscriptionCharges } from '@/domain/subscriptions'
import type { MonthlySummary } from '@/domain/summary'
import { SM_QUERY, useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import { fitAmountFontSize } from '@/lib/visuals'

/** Testid de cada línea del desglose: se conservan los que ya usaban los casos (US-29, US-83, ADR-045). */
const LINE_TEST_ID: Record<BalanceLine['key'], string> = {
  expenses: 'dashboard-spent-expenses',
  income: 'dashboard-income',
  looseDebts: 'dashboard-spent-loose-debts',
  reimbursements: 'dashboard-spent-reimbursements',
  pendingSubscriptions: 'dashboard-pending-subscriptions',
}

const LINE_AMOUNT_TEST_ID: Record<BalanceLine['key'], string> = {
  expenses: 'dashboard-spent-expenses-amount',
  income: 'dashboard-total-income',
  looseDebts: 'dashboard-spent-loose-debts-amount',
  reimbursements: 'dashboard-spent-reimbursements-amount',
  pendingSubscriptions: 'dashboard-pending-subscriptions-total',
}

const LINE_LABEL: Record<BalanceLine['key'], string> = {
  expenses: 'Gastos',
  income: 'Ingresos',
  looseDebts: BALANCE_OPTION_COPY.looseDebts.label,
  reimbursements: 'Reembolsos',
  // Corto: el detalle de abajo ya dice que son cobros que faltan.
  pendingSubscriptions: 'Suscripciones',
}

/** Las líneas de una opción llevan a su pantalla, donde está el detalle. */
const LINE_LINK: Partial<Record<BalanceLine['key'], string>> = {
  looseDebts: '/debts',
  reimbursements: '/debts',
  pendingSubscriptions: '/subscriptions',
}

/**
 * La protagonista del Resumen (US-25, US-29, US-101; ADR-052 y ADR-053): un solo número, lo gastado en el mes,
 * sobre la única superficie con brillo. Qué entra en él se elige desde la pill de debajo del monto o desde el
 * ícono de la esquina: ingresos (que se restan y pueden dejarlo negativo), deudas sueltas, reembolsos y
 * suscripciones por cobrar. Sin ninguna opción es lo gastado; el cambio se ve al instante y se guarda atrás.
 *
 * Las suscripciones por cobrar (ADR-045) son una línea más. Mientras su carga no llegó (o falló), el número y
 * la fórmula no las incluyen, así lo que dice incluir y lo que suma coinciden.
 */
export function SpentHero({
  summary,
  options,
  pending,
  period,
  monthName,
  onOptionsChange,
  children,
}: {
  summary: MonthlySummary
  options: BalanceOptions
  pending: PendingSubscriptionCharges | null
  period: Period
  monthName: string
  onOptionsChange: (next: BalanceOptions) => void
  /** Los accesos de todos los días, debajo del número. */
  children?: ReactNode
}) {
  const view = spentView(
    { parts: summary.balanceParts, looseDebtActivity: summary.looseDebtActivity, hasReimbursements: summary.hasReimbursements },
    pending,
    options,
  )
  const { effective, net, included, excluded, amounts } = view
  const netText = formatArs(net)
  const formula = spentFormulaText(effective)

  const [open, setOpen] = useState(false)
  const iconRef = useRef<HTMLButtonElement>(null)
  // El botón que abrió la hoja: a él vuelve el foco al cerrarla (hay dos formas de abrirla).
  const openedFrom = useRef<HTMLButtonElement | null>(null)
  const openFromIcon = () => {
    openedFrom.current = iconRef.current
    setOpen(true)
  }

  /** Lo que diría cada línea de suscripciones, adentro o afuera del número. */
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
            <span data-testid="dashboard-pending-subscriptions-projected-spent" className="tabular font-semibold text-foreground">
              {view.netWithPending && formatArs(view.netWithPending)}
            </span>
          </span>
        )}
      </>
    )

  const breakdown = (
    <>
      <ul data-testid="dashboard-spent-breakdown" aria-label="Qué suma y qué resta" className="flex flex-col px-4">
        {included.map((line) => (
          <BreakdownLine key={line.key} line={line} included>
            {line.key === 'pendingSubscriptions' && subscriptionDetail(true)}
          </BreakdownLine>
        ))}
      </ul>
      {excluded.length > 0 && (
        <div data-testid="dashboard-spent-excluded" className="flex flex-col gap-1 px-4 pt-2">
          <h3 className="text-caption font-medium text-muted-foreground">Fuera del número</h3>
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

  const panel: OptionsPanelProps = { options, net, monthName, amounts, breakdown, onOptionsChange }

  return (
    <section
      data-testid="dashboard-total"
      aria-labelledby="dashboard-total-label"
      className="hero @container relative flex flex-col items-center gap-7 rounded-3xl px-6 pt-8 pb-6 text-center ring-1 ring-hero-foreground/8 ring-inset lg:row-span-2 lg:px-10 lg:pt-12 lg:pb-8"
    >
      <button
        ref={iconRef}
        type="button"
        data-testid="dashboard-spent-options-button"
        aria-label="Opciones del gasto"
        aria-haspopup="dialog"
        onClick={openFromIcon}
        className="press absolute top-2 right-2 grid size-11 place-items-center rounded-full text-hero-muted transition-colors duration-(--dur-fade) hover:bg-hero-foreground/10 hover:text-hero-foreground"
      >
        <SlidersHorizontal aria-hidden="true" className="size-[1.125rem]" strokeWidth={1.8} />
      </button>

      <div className="flex w-full flex-col items-center gap-2">
        <span id="dashboard-total-label" className="text-footnote font-medium text-hero-muted first-letter:uppercase">
          {spentLabel(effective)} en {monthName}
        </span>
        <Amount
          data-testid="dashboard-total-expenses"
          text={netText}
          className={cn(
            'block max-w-full font-bold whitespace-nowrap text-amount [--amount-max:var(--text-amount)] lg:[--amount-max:4.5rem]',
            net.lt(0) && 'text-hero-accent',
          )}
          // DEF-021: achica según el largo del total para que entre en una línea a cualquier ancho.
          style={{ fontSize: fitAmountFontSize(netText) }}
        />
        <SpentOptionsControl
          open={open}
          onOpenChange={setOpen}
          finalFocus={openedFrom}
          formula={formula}
          {...panel}
        />
        {summary.expensesUsd.gt(0) && (
          <span
            data-testid="dashboard-total-usd"
            className="tabular rounded-full bg-hero-foreground/8 px-3 py-1 text-footnote text-hero-muted"
          >
            Incluye {formatUsd(summary.expensesUsd)} en dólares
          </span>
        )}
      </div>

      {children}
    </section>
  )
}

/** Una línea del desglose: el signo adelante, en su columna, y el monto sin signo, para leer la cuenta de arriba abajo. */
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
  options: BalanceOptions
  net: Decimal
  monthName: string
  amounts: Record<BalanceOptionKey, Decimal | null>
  /** Qué suma y qué resta, arriba de los interruptores. */
  breakdown: ReactNode
  onOptionsChange: (next: BalanceOptions) => void
}

const PILL_CLASS =
  'press mt-1 inline-flex min-h-11 max-w-full items-center gap-2 rounded-full bg-hero-foreground/8 px-4 text-footnote font-medium text-hero-muted transition-colors duration-(--dur-fade) hover:bg-hero-foreground/14 hover:text-hero-foreground'

/**
 * La pill con la fórmula y lo que abre (ADR-053): desde `sm` un popover que nace de la pill; en el celular una
 * hoja desde abajo, que no se sale de la pantalla, queda al alcance del pulgar y se cierra deslizándola. Las dos
 * muestran el número en vivo y ofrecen «Solo gastos» de un toque. La pill es el trigger del popover, así lo
 * ancla; el ícono de la esquina abre lo mismo con el estado compartido (`open`).
 */
function SpentOptionsControl({
  open,
  onOpenChange,
  finalFocus,
  formula,
  ...props
}: OptionsPanelProps & {
  open: boolean
  onOpenChange: (open: boolean) => void
  finalFocus: React.RefObject<HTMLElement | null>
  formula: string
}) {
  const asSheet = !useMediaQuery(SM_QUERY)
  const pill = {
    'data-testid': 'dashboard-spent-options',
    'aria-label': `Elegir qué entra en el gasto. Ahora: ${formula}`,
    'aria-haspopup': 'dialog' as const,
    className: PILL_CLASS,
    children: (
      <>
        <span data-testid="dashboard-spent-formula">{formula}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn('size-3.5 shrink-0 transition-transform duration-(--dur-fade)', open && 'rotate-180')}
          strokeWidth={2}
        />
      </>
    ),
  }

  if (asSheet) {
    return (
      <Drawer.Root open={open} onOpenChange={onOpenChange}>
        <button
          type="button"
          {...pill}
          aria-expanded={open}
          onClick={(event) => {
            finalFocus.current = event.currentTarget
            onOpenChange(true)
          }}
        />
        <Drawer.Portal>
          <Drawer.Backdrop className="fixed inset-0 z-50 bg-black/40 transition-opacity duration-[400ms] ease-drawer data-ending-style:opacity-0 data-starting-style:opacity-0 data-swiping:duration-0" />
          {/* El viewport habilita deslizar para cerrar y bloquea el scroll de atrás. */}
          <Drawer.Viewport className="fixed inset-0 z-50 flex flex-col justify-end">
            <Drawer.Popup
              data-testid="dashboard-spent-options-panel"
              finalFocus={finalFocus}
              className="w-full max-h-[85dvh] translate-y-[var(--drawer-swipe-movement-y,0px)] overflow-y-auto overscroll-contain rounded-t-3xl bg-popover pb-[env(safe-area-inset-bottom)] text-popover-foreground outline-none transition-transform duration-[400ms] ease-drawer data-ending-style:translate-y-full data-ending-style:duration-[calc(var(--drawer-swipe-strength,1)*300ms)] data-starting-style:translate-y-full data-swiping:duration-0 motion-reduce:transition-opacity motion-reduce:data-ending-style:translate-y-0 motion-reduce:data-ending-style:opacity-0 motion-reduce:data-starting-style:translate-y-0 motion-reduce:data-starting-style:opacity-0"
            >
              <div aria-hidden="true" className="mx-auto mt-2 h-1 w-9 rounded-full bg-input" />
              <OptionsPanel {...props} title={<Drawer.Title className="text-headline font-semibold">Tu gasto</Drawer.Title>} />
              <div className="border-t border-hairline px-4 py-3">
                <Drawer.Close
                  data-testid="dashboard-spent-options-done"
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
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger {...pill} onClick={(event) => (finalFocus.current = event.currentTarget)} />
      <Popover.Portal>
        {/* Siempre debajo de la pill: la hoja es alta y, sin esto, Floating UI la manda al costado y tapa el héroe. Si no entra, scrollea adentro. */}
        <Popover.Positioner
          side="bottom"
          align="center"
          sideOffset={6}
          collisionPadding={16}
          collisionAvoidance={{ side: 'none', align: 'shift', fallbackAxisSide: 'none' }}
          className="z-50"
        >
          <Popover.Popup
            data-testid="dashboard-spent-options-panel"
            finalFocus={finalFocus}
            className="max-h-(--available-height) w-[min(24rem,calc(100vw-2rem))] origin-(--transform-origin) overflow-y-auto rounded-2xl bg-popover shadow-xl ring-1 ring-hairline text-popover-foreground outline-none transition-[transform,opacity] duration-(--dur-fade) ease-out-quick data-ending-style:scale-[0.97] data-ending-style:opacity-0 data-ending-style:duration-100 data-starting-style:scale-[0.97] data-starting-style:opacity-0 motion-reduce:data-ending-style:scale-100 motion-reduce:data-starting-style:scale-100"
          >
            <OptionsPanel {...props} title={<Popover.Title className="text-headline font-semibold">Tu gasto</Popover.Title>} />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}

/** El contenido: título, número en vivo, «Solo gastos» y los interruptores con su monto del mes. */
function OptionsPanel({
  options,
  net,
  monthName,
  amounts,
  breakdown,
  onOptionsChange,
  title,
}: OptionsPanelProps & { title: ReactNode }) {
  const onlyExpenses = isOnlyExpenses(options)
  return (
    <>
      <div className="flex flex-col gap-0.5 px-4 pt-4 pb-3">
        {title}
        <p className="flex items-baseline justify-between gap-3 text-footnote text-muted-foreground">
          <span className="first-letter:uppercase">{spentLabel(options)} en {monthName}</span>
          <span
            data-testid="dashboard-spent-options-preview"
            aria-live="polite"
            className={cn('tabular text-callout font-semibold', net.lt(0) ? 'text-income' : 'text-foreground')}
          >
            {formatArs(net)}
          </span>
        </p>
      </div>
      <div className="border-t border-hairline pt-2 pb-3">{breakdown}</div>
      <div className="border-t border-hairline">
        <button
          type="button"
          data-testid="dashboard-spent-options-only-expenses"
          aria-pressed={onlyExpenses}
          onClick={() => onOptionsChange(ONLY_EXPENSES)}
          className="press flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left hover:bg-secondary/60"
        >
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-callout font-medium text-foreground">Solo gastos</span>
            <span className="text-footnote text-muted-foreground">Lo gastado en el mes, sin nada más</span>
          </span>
          <span
            aria-hidden="true"
            className={cn(
              'flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-(--dur-fade)',
              onlyExpenses ? 'border-primary bg-primary text-primary-foreground' : 'border-input',
            )}
          >
            {onlyExpenses && <Check className="size-3.5" strokeWidth={2.5} />}
          </span>
        </button>
      </div>
      <p className="border-t border-hairline px-4 pt-3 pb-1 text-caption font-medium text-muted-foreground">También incluir</p>
      <BalanceOptionsList
        options={options}
        onChange={(option, value) => onOptionsChange({ ...options, [option]: value })}
        testIdPrefix="dashboard-spent-option"
        amounts={amounts}
      />
      <p className="border-t border-hairline px-4 py-3 text-caption text-muted-foreground">
        Se guarda al tocar y vale para todos los meses. No cambia ningún movimiento.
      </p>
    </>
  )
}
