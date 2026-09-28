import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Check } from 'lucide-react'
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
import { formatPeriod, isSamePeriod, parsePeriod, toIsoDate, tryPeriodOf } from '@/domain/period'
import { allowsInstallments, validateTransactionDraft } from '@/domain/validation'
import { setStoredLastAccountId, type Account, type Category } from '@/lib/catalog'
import { today } from '@/lib/clock'
import { getReferenceRate } from '@/lib/fxRates'
import { createTransaction } from '@/lib/transactions'
import { AccountSection } from './AccountSection'
import { AmountSection } from './AmountSection'
import { CategorySection } from './CategorySection'
import { CurrencySection } from './CurrencySection'
import { DateSection } from './DateSection'
import { DescriptionSection } from './DescriptionSection'
import { InstallmentsField } from './InstallmentsField'
import { TypeSection } from './TypeSection'
import type { SectionProps, Touched } from './types'

interface TransactionFormProps {
  categories: Category[]
  accounts: Account[]
  defaultAccountId?: string | null
}

/**
 * Formulario de registro (FR-06), armado por secciones. Cada sección recibe `SectionProps` y
 * escribe solo sus campos del borrador; este componente es el único que valida y guarda.
 * Los puntos marcados "Punto de extensión" son donde se enchufan secciones de otras historias.
 */
export function TransactionForm({ categories, accounts, defaultAccountId }: TransactionFormProps) {
  const [values, setValues] = useState<DraftInput>(() =>
    emptyDraftInput(toIsoDate(today()), resolvePreloadedAccount(defaultAccountId, accounts)),
  )
  const [touched, setTouched] = useState<Touched>({})
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

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!canSave || saving) return
    setSaving(true)
    try {
      await createTransaction(draft) // C4: una sola llamada RPC
      setStoredLastAccountId(draft.accountId)
      toast.success(draft.type === 'expense' ? 'Gasto guardado' : 'Ingreso guardado', {
        testId: 'transaction-form-saved',
      })
      setValues(draftInputAfterSave(values, toIsoDate(today()), accounts))
      setTouched({})
      // Confirmación en el mismo botón (feedback de completado): vuelve solo después de un momento.
      setJustSaved(true)
      window.clearTimeout(savedTimer.current)
      savedTimer.current = window.setTimeout(() => setJustSaved(false), 1400)
      document.getElementById('transaction-form-amount')?.focus()
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

  useEffect(() => () => window.clearTimeout(savedTimer.current), [])

  const submitLabel = saving ? 'Guardando…' : values.type === 'income' ? 'Guardar ingreso' : 'Guardar gasto'

  return (
    <form data-testid="transaction-form" onSubmit={onSubmit} noValidate className="mx-auto w-full max-w-xl">
      {/* Mientras guarda, el fieldset deshabilitado evita cambios que el reset pisaría. */}
      <fieldset disabled={saving} className="flex min-w-0 flex-col gap-7">
        <TypeSection {...section} />

        <AmountSection {...section} />

        <CurrencySection
          {...section}
          referenceRateStatus={referenceRateStatus}
          referenceRate={referenceRate}
        />

        {values.type === 'expense' && (
          <CategorySection {...section} categories={categories} />
        )}

        <AccountSection {...section} accounts={accounts} />

        {/* Cuotas (US-12, US-14): solo para un gasto con tarjeta de crédito. Escribe `installmentsCount`. */}
        {allowsInstallments(values) && <InstallmentsField {...section} />}

        <DateSection {...section} today={todayIso} />

        <DescriptionSection {...section} />
      </fieldset>

      {/*
        "Guardar" fijo abajo, sobre material translúcido, por encima de la barra de navegación. Con el
        teclado abierto se apoya sobre el teclado (--kb-inset, useVisualViewportInset).
      */}
      <div className="chrome sticky z-20 -mx-5 mt-8 border-t border-hairline px-5 py-3 [bottom:calc(var(--app-nav-offset)+var(--kb-inset))] sm:-mx-6 sm:px-6 lg:mx-0 lg:rounded-lg lg:border lg:px-3">
        <Button
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
      </div>
    </form>
  )
}
