import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Check, ChevronLeft } from 'lucide-react'
import { CategoryIcon } from '@/components/shared/CategoryIcon'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  applyDraftChange,
  applyReferenceRateSuggestion,
  draftInputAfterSave,
  emptyDraftInput,
  parseDraftInput,
  resolvePreloadedAccount,
  type DraftInput,
} from '@/domain/draft'
import { formatArs, formatRate, formatUsd } from '@/domain/money'
import { formatPeriod, isSamePeriod, parsePeriod, toIsoDate, tryPeriodOf } from '@/domain/period'
import { allowsInstallments, validateTransactionDraft, type DraftErrors } from '@/domain/validation'
import { setStoredLastAccountId, type Account, type Category } from '@/lib/catalog'
import { today } from '@/lib/clock'
import { getReferenceRate } from '@/lib/fxRates'
import { isStepComplete, STEP_FIELDS, stepsFor, type RegisterStep } from '@/lib/registerSteps'
import { createTransaction } from '@/lib/transactions'
import { cn } from '@/lib/utils'
import { AccountSection } from './AccountSection'
import { AmountSection } from './AmountSection'
import { CategorySection } from './CategorySection'
import { CurrencySection } from './CurrencySection'
import { DateSection } from './DateSection'
import { DescriptionSection } from './DescriptionSection'
import { InstallmentsField } from './InstallmentsField'
import { TypeSection } from './TypeSection'
import type { SectionProps, Touched } from './types'

// Cómo se nombra cada campo en el resumen de lo que falta, en el orden en que aparece en pantalla.
const FIELD_NAMES: Partial<Record<keyof DraftErrors, string>> = {
  amount: 'monto',
  fxRate: 'tipo de cambio',
  categoryId: 'categoría',
  accountId: 'cuenta',
  installmentsCount: 'cuotas',
  occurredOn: 'fecha',
}

/** "monto", "monto y categoría", "monto, categoría y cuenta". */
function joinSpanish(items: string[]): string {
  return items.length <= 1 ? (items[0] ?? '') : `${items.slice(0, -1).join(', ')} y ${items.at(-1)}`
}

interface TransactionFormProps {
  categories: Category[]
  accounts: Account[]
  defaultAccountId?: string | null
  /** US-68: el setup inicial necesita saber cuándo se guardó el primer gasto para cerrarse. */
  onSaved?: () => void
}

const STEP_TITLES: Record<RegisterStep, string> = {
  amount: '¿Cuánto?',
  category: '¿En qué?',
  details: 'Revisá y guardá',
}

/**
 * Registro de una transacción (FR-06) en pasos (ADR-024): monto → categoría → detalles. Cada
 * sección recibe `SectionProps` y escribe solo sus campos del borrador; este componente es el único
 * que valida y guarda. La cuenta y la fecha llegan precargadas, así que el caso común son tres
 * toques de avance (NFR-07). El borrador es uno solo: volver a un paso no pierde nada.
 */
export function TransactionForm({ categories, accounts, defaultAccountId, onSaved }: TransactionFormProps) {
  const [values, setValues] = useState<DraftInput>(() =>
    emptyDraftInput(toIsoDate(today()), resolvePreloadedAccount(defaultAccountId, accounts)),
  )
  const [touched, setTouched] = useState<Touched>({})
  const [stepIndex, setStepIndex] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  const advanceTimer = useRef<number | undefined>(undefined)
  const [saving, setSaving] = useState(false)
  const [justSaved, setJustSaved] = useState(false)
  const savedTimer = useRef<number | undefined>(undefined)
  const [referenceRateStatus, setReferenceRateStatus] = useState<
    'idle' | 'loading' | 'found' | 'missing' | 'error'
  >('idle')
  const [referenceRate, setReferenceRate] = useState<string | null>(null)
  const todayIso = toIsoDate(today())
  const draftPeriod = tryPeriodOf(values.occurredOn)
  const ratePeriodKey = draftPeriod ? formatPeriod(draftPeriod) : ''
  const draft = parseDraftInput(values)
  // Copia UX de lo que revalida create_transaction (C6): con errores no se emite ninguna escritura.
  const errors = validateTransactionDraft(draft, todayIso)
  const canSave = Object.keys(errors).length === 0
  const steps = stepsFor(values.type)
  const step = steps[Math.min(stepIndex, steps.length - 1)]
  const isLastStep = step === steps.at(-1)
  const canAdvance = isLastStep ? canSave : isStepComplete(step, errors)
  // US-11: el motivo de lo que no deja avanzar siempre está a la vista. Junto al botón van los
  // campos de este paso que todavía no se tocaron (los tocados muestran su error al lado) y, en el
  // último paso, cualquier error de un paso anterior, que ya no está en pantalla.
  const onScreen = new Set<keyof DraftErrors>(STEP_FIELDS[step])
  const pending = (Object.keys(FIELD_NAMES) as (keyof DraftErrors)[])
    .filter((field) => errors[field] && (onScreen.has(field) ? !touched[field] : isLastStep))
    .map((field) => FIELD_NAMES[field] as string)

  useEffect(() => {
    const requestPeriod = parsePeriod(ratePeriodKey)
    if (values.currency !== 'USD' || !requestPeriod) {
      setReferenceRateStatus('idle')
      setReferenceRate(null)
      if (values.currency === 'USD') {
        setValues((prev) => (prev.fxRate === '' ? prev : { ...prev, fxRate: '' }))
      }
      return
    }

    const request = { currency: values.currency, period: requestPeriod } as const
    let cancelled = false
    setReferenceRateStatus('loading')
    setReferenceRate(null)
    // Al cambiar de mes, no se conserva accidentalmente el TC sugerido del período anterior.
    setValues((prev) => {
      const previousPeriod = tryPeriodOf(prev.occurredOn)
      return prev.currency === 'USD' && previousPeriod && isSamePeriod(previousPeriod, request.period)
        ? { ...prev, fxRate: '' }
        : prev
    })

    getReferenceRate(request.period)
      .then((referenceRate) => {
        if (cancelled) return
        setValues((prev) => applyReferenceRateSuggestion(prev, request, referenceRate))
        setReferenceRate(referenceRate)
        setReferenceRateStatus(referenceRate === null ? 'missing' : 'found')
      })
      .catch(() => {
        if (!cancelled) {
          setReferenceRate(null)
          setReferenceRateStatus('error')
        }
      })

    return () => {
      cancelled = true
    }
  }, [values.currency, ratePeriodKey])

  function change(patch: Partial<DraftInput>) {
    const next = applyDraftChange(values, patch)
    setValues(next.values)
    if (next.installmentsReset) {
      toast.info('Las cuotas volvieron a 1', {
        description: 'Solo los gastos con tarjeta de crédito se pagan en cuotas.',
        testId: 'transaction-form-installments-reset',
      })
    }
    setTouched((prev) => ({ ...prev, ...Object.fromEntries(Object.keys(patch).map((k) => [k, true])) }))
  }

  function goTo(target: RegisterStep) {
    const index = steps.indexOf(target)
    if (index < 0 || index === stepIndex) return
    window.clearTimeout(advanceTimer.current)
    setDirection(index > stepIndex ? 'forward' : 'back')
    setStepIndex(index)
  }

  function advance() {
    if (!isLastStep && isStepComplete(step, errors)) goTo(steps[stepIndex + 1])
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // Enter en el monto avanza de paso; solo el último paso guarda.
    if (!isLastStep) return advance()
    if (!canSave || saving) return
    setSaving(true)
    try {
      await createTransaction(draft) // C4: una sola llamada RPC
      setStoredLastAccountId(draft.accountId)
      toast.success(draft.type === 'expense' ? 'Gasto guardado' : 'Ingreso guardado', {
        testId: 'transaction-form-saved',
      })
      onSaved?.()
      setValues(draftInputAfterSave(values, toIsoDate(today()), accounts))
      setTouched({})
      // Confirmación en el mismo botón (feedback de completado) y vuelta al primer paso para el próximo.
      setJustSaved(true)
      window.clearTimeout(savedTimer.current)
      savedTimer.current = window.setTimeout(() => {
        setJustSaved(false)
        setDirection('back')
        setStepIndex(0)
      }, 900)
    } catch (error) {
      toast.error('No se pudo guardar', {
        description: (error as { message?: string }).message,
        testId: 'transaction-form-save-error',
      })
    } finally {
      setSaving(false)
    }
  }

  const section: SectionProps = { values, errors, touched, onChange: change }

  useEffect(
    () => () => {
      window.clearTimeout(savedTimer.current)
      window.clearTimeout(advanceTimer.current)
    },
    [],
  )

  const category = categories.find((c) => c.id === values.categoryId)
  const submitLabel = saving ? 'Guardando…' : values.type === 'income' ? 'Guardar ingreso' : 'Guardar gasto'
  const hintId = 'transaction-form-submit-hint'
  const showHint = !canAdvance && pending.length > 0

  return (
    <form
      data-testid="transaction-form"
      onSubmit={onSubmit}
      noValidate
      className="mx-auto flex min-h-[calc(100dvh-var(--app-header-h)-env(safe-area-inset-top)-var(--app-nav-offset)-3.5rem)] w-full max-w-xl flex-col lg:min-h-[calc(100dvh-5rem)]"
    >
      <div className="flex items-center gap-2 pb-5">
        <button
          type="button"
          onClick={() => goTo(steps[stepIndex - 1])}
          data-testid="transaction-form-back"
          aria-label="Paso anterior"
          className={cn(
            'press -ml-3 flex size-11 shrink-0 items-center justify-center rounded-full text-foreground hover:bg-accent',
            stepIndex === 0 && 'invisible',
          )}
        >
          <ChevronLeft aria-hidden="true" className="size-6" strokeWidth={1.8} />
        </button>
        <div
          data-testid="transaction-form-step"
          data-step={step}
          role="progressbar"
          aria-label={`Paso ${stepIndex + 1} de ${steps.length}`}
          aria-valuenow={stepIndex + 1}
          aria-valuemin={1}
          aria-valuemax={steps.length}
          className="flex flex-1 gap-1.5"
        >
          {steps.map((s, i) => (
            <span
              key={s}
              className={cn(
                'h-1 flex-1 rounded-full transition-colors duration-(--dur-fade)',
                i <= stepIndex ? 'bg-primary' : 'bg-secondary',
              )}
            />
          ))}
        </div>
        <span aria-hidden="true" className="tabular w-11 shrink-0 text-right text-footnote font-medium text-muted-foreground">
          {stepIndex + 1}/{steps.length}
        </span>
      </div>

      {/*
        El paso entra desde el lado hacia el que se avanza y vuelve por el mismo camino
        (apple-design §7). Transición y no keyframes: si se toca de nuevo a mitad de camino, retoma.
      */}
      <fieldset
        key={step}
        disabled={saving}
        className={cn(
          'flex min-w-0 flex-1 flex-col gap-7 transition-[translate,opacity] duration-[260ms] ease-(--ease-drawer) starting:opacity-0',
          direction === 'forward' ? 'starting:translate-x-8' : 'starting:-translate-x-8',
        )}
      >
        <legend className="sr-only">{STEP_TITLES[step]}</legend>

        {step === 'amount' && (
          <>
            <TypeSection {...section} />
            {/* El monto, centrado en el espacio libre: es lo único que hay que hacer en este paso. */}
            <div className="flex flex-1 flex-col justify-center gap-6">
              <AmountSection {...section} />
              <CurrencySection {...section} referenceRateStatus={referenceRateStatus} referenceRate={referenceRate} />
            </div>
          </>
        )}

        {step === 'category' && (
          <>
            <StepSummary values={values} onEditAmount={() => goTo('amount')} />
            <h2 className="text-title-2 font-bold">{STEP_TITLES.category}</h2>
            <CategorySection
              {...section}
              categories={categories}
              // Elegir es avanzar: la selección se ve un instante y el paso sigue solo (NFR-07).
              onPick={() => {
                window.clearTimeout(advanceTimer.current)
                advanceTimer.current = window.setTimeout(() => goTo('details'), 180)
              }}
            />
          </>
        )}

        {step === 'details' && (
          <>
            <StepSummary
              values={values}
              category={values.type === 'expense' ? category : undefined}
              onEditAmount={() => goTo('amount')}
              onEditCategory={() => goTo('category')}
            />
            <AccountSection {...section} accounts={accounts} />
            {/* Cuotas (US-12, US-14): solo para un gasto con tarjeta de crédito. Escribe `installmentsCount`. */}
            {allowsInstallments(values) && <InstallmentsField {...section} />}
            <DateSection {...section} today={todayIso} />
            <DescriptionSection {...section} />
          </>
        )}
      </fieldset>

      {/*
        Acción del paso, fija abajo por encima de la barra de navegación. Fondo sólido: sobre material
        translúcido se leían los rótulos a través del botón. Con el teclado abierto se apoya sobre el
        teclado (--kb-inset, useVisualViewportInset).
      */}
      {/* En la categoría, elegir ya avanza: el botón solo aparece al volver con una ya elegida. */}
      {!(step === 'category' && !values.categoryId) && (
        <div className="sticky z-20 -mx-5 mt-8 flex flex-col gap-2 border-t border-hairline bg-background px-5 pt-2.5 pb-3 [bottom:calc(var(--app-nav-offset)+var(--kb-inset))] sm:-mx-6 sm:px-6 lg:mx-0 lg:rounded-xl lg:border lg:px-3">
          {showHint && (
            <p id={hintId} data-testid={hintId} className="text-center text-footnote text-muted-foreground">
              Completá {joinSpanish(pending)} para {isLastStep ? 'guardar' : 'seguir'}
            </p>
          )}
          {/*
            Keys distintas: sin ellas React reusa el mismo <button> y, al avanzar al último paso,
            le cambia el type a "submit" durante el clic; la activación nativa lo lee y guarda de golpe.
          */}
          {isLastStep ? (
            <Button
              key="submit"
              aria-describedby={showHint ? hintId : undefined}
              type="submit"
              size="lg"
              className="w-full"
              disabled={!canSave || saving}
              data-testid="transaction-form-submit"
            >
              <span
                key={justSaved ? 'saved' : 'idle'}
                className="inline-flex items-center gap-2 transition-[opacity,filter] duration-200 starting:opacity-0 starting:blur-[2px]"
              >
                {justSaved && !saving ? (
                  <>
                    <Check aria-hidden="true" className="size-5" strokeWidth={2.2} />
                    Guardado
                  </>
                ) : (
                  submitLabel
                )}
              </span>
            </Button>
          ) : (
            <Button
              key="next"
              aria-describedby={showHint ? hintId : undefined}
              type="button"
              size="lg"
              className="w-full"
              disabled={!canAdvance}
              onClick={advance}
              data-testid="transaction-form-next"
            >
              Siguiente
            </Button>
          )}
        </div>
      )}
    </form>
  )
}

/**
 * Lo ya elegido en los pasos anteriores, a la vista y tocable para volver a editarlo (wayfinding).
 * En dólares muestra también el tipo de cambio: si la fecha del último paso cambia de mes, el TC
 * sugerido puede cambiar, y lo que se congela al guardar (C5) tiene que estar a la vista.
 */
function StepSummary({
  values,
  category,
  onEditAmount,
  onEditCategory,
}: {
  values: DraftInput
  category?: Category
  onEditAmount: () => void
  onEditCategory?: () => void
}) {
  const draft = parseDraftInput(values)
  const amount = draft.amount ? (values.currency === 'USD' ? formatUsd(draft.amount) : formatArs(draft.amount)) : '—'
  const chip =
    'press inline-flex min-h-11 items-center gap-2 rounded-full border border-hairline bg-card px-3.5 text-callout font-semibold hover:border-input'
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={onEditAmount} data-testid="transaction-form-summary-amount" className={chip}>
        <span className="tabular">{amount}</span>
        {values.currency === 'USD' && draft.fxRate && (
          <span className="tabular text-footnote font-medium text-muted-foreground">TC {formatRate(draft.fxRate)}</span>
        )}
        <span className="sr-only">, cambiar monto</span>
      </button>
      {category && onEditCategory && (
        <button type="button" onClick={onEditCategory} data-testid="transaction-form-summary-category" className={cn(chip, 'pl-1.5')}>
          <CategoryIcon name={category.name} color={category.color} size="sm" className="rounded-full" />
          {category.name}
          <span className="sr-only">, cambiar categoría</span>
        </button>
      )}
    </div>
  )
}
