import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SegmentedControl } from '@/components/ui/segmented-control'
import {
  applyDebtReferenceRate,
  debtArsEquivalent,
  emptyDebtDraftInput,
  firstDebtDraftError,
  MAX_NOTES_LENGTH,
  MAX_PERSON_LENGTH,
  toNewDebt,
  validateDebtDraft,
  type DebtDraftField,
  type DebtDraftInput,
} from '@/domain/debtDraft'
import type { DebtDirection } from '@/domain/debts'
import type { Currency } from '@/domain/fx'
import { formatPeriod, parsePeriod, toIsoDate, tryPeriodOf } from '@/domain/period'
import { today } from '@/lib/clock'
import { createDebt } from '@/lib/debts'
import { saveErrorMessage } from '@/lib/errors'
import { getReferenceRate } from '@/lib/fxRates'
import { cn } from '@/lib/utils'

const DIRECTION_OPTIONS: { value: DebtDirection; label: string; testId: string }[] = [
  { value: 'owed_to_me', label: 'Me deben', testId: 'debt-form-direction-owed-to-me' },
  { value: 'i_owe', label: 'Debo', testId: 'debt-form-direction-i-owe' },
]

const CURRENCY_OPTIONS: { value: Currency; label: string; testId: string; ariaLabel: string }[] = [
  { value: 'ARS', label: 'ARS', testId: 'debt-form-currency-ars', ariaLabel: 'Pesos' },
  { value: 'USD', label: 'US$', testId: 'debt-form-currency-usd', ariaLabel: 'Dólares' },
]

type RateStatus = 'idle' | 'loading' | 'found' | 'missing' | 'error'

/**
 * Nueva deuda (US-36): una deuda suelta, sin gasto. Valida como UX con validateDebtDraft y guarda con
 * una sola llamada a create_debt, que revalida todo (C6, ADR-037). Un error de campo aparece cuando el
 * campo se tocó y perdió el foco (ADR-024); el botón se deshabilita con cualquier error, tocado o no,
 * y el motivo del primero se lee junto a él.
 */
export function DebtFormPage() {
  const navigate = useNavigate()
  const todayIso = toIsoDate(today())
  const [values, setValues] = useState<DebtDraftInput>(() => emptyDebtDraftInput(todayIso))
  const [touched, setTouched] = useState<Partial<Record<DebtDraftField, boolean>>>({})
  // Si el usuario escribió su propio TC, cambiar la fecha de mes no lo pisa (US-21).
  const [fxEdited, setFxEdited] = useState(false)
  const [rateStatus, setRateStatus] = useState<RateStatus>('idle')
  const [saving, setSaving] = useState(false)
  // Corta el doble toque antes de que React pinte el botón deshabilitado (CA-10).
  const savingRef = useRef(false)

  const errors = validateDebtDraft(values, todayIso)
  const firstError = firstDebtDraftError(errors)
  const canSave = !firstError && rateStatus !== 'loading'
  const equivalent = debtArsEquivalent(values, errors)
  const period = tryPeriodOf(values.incurredOn)
  const ratePeriodKey = period ? formatPeriod(period) : ''

  // TC de referencia del mes de la fecha (US-20), con las reglas de Registrar.
  useEffect(() => {
    const requestPeriod = parsePeriod(ratePeriodKey)
    if (values.currency !== 'USD' || !requestPeriod || fxEdited) {
      setRateStatus('idle')
      return
    }
    let cancelled = false
    setRateStatus('loading')
    // El sugerido del mes anterior no se arrastra: se vacía y se vuelve a pedir.
    setValues((prev) => (prev.fxRate === '' ? prev : { ...prev, fxRate: '' }))
    getReferenceRate(requestPeriod)
      .then((rate) => {
        if (cancelled) return
        setValues((prev) => applyDebtReferenceRate(prev, { period: requestPeriod }, rate))
        setRateStatus(rate === null ? 'missing' : 'found')
      })
      .catch(() => {
        if (!cancelled) setRateStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [values.currency, ratePeriodKey, fxEdited])

  function change(patch: Partial<DebtDraftInput>) {
    setValues((prev) => ({ ...prev, ...patch }))
  }

  function selectCurrency(currency: Currency) {
    // Cada vez que se pasa a US$ se vuelve a sugerir el de referencia.
    setFxEdited(false)
    change({ currency, fxRate: '' })
  }

  const blur = (field: DebtDraftField) => () => setTouched((t) => (t[field] ? t : { ...t, [field]: true }))
  const shown = (field: DebtDraftField) => (touched[field] ? errors[field] : undefined)

  async function submit(e: FormEvent) {
    e.preventDefault()
    const debt = toNewDebt(values, todayIso)
    if (!debt || !canSave || savingRef.current) return
    savingRef.current = true
    setSaving(true)
    try {
      await createDebt(debt)
      toast.success('Deuda guardada', { testId: 'debt-form-saved' })
      navigate('/debts?status=pending')
    } catch (error) {
      // El formulario conserva lo cargado (CA-13).
      toast.error('No se pudo guardar la deuda', { testId: 'debt-form-save-error', description: saveErrorMessage(error) })
      savingRef.current = false
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} noValidate className="mx-auto flex w-full max-w-2xl flex-col">
      <PageHeader title="Nueva deuda" testId="debt-form-title" />

      <fieldset disabled={saving} className="grid gap-6">
        <div className="grid gap-2.5">
          <span id="debt-form-direction-label" className="text-footnote font-medium text-muted-foreground">
            Dirección
          </span>
          <SegmentedControl
            testId="debt-form-direction"
            aria-labelledby="debt-form-direction-label"
            value={values.direction}
            options={DIRECTION_OPTIONS}
            onValueChange={(direction) => change({ direction })}
          />
        </div>

        <Field label="Persona" htmlFor="debt-form-person" errorId="debt-form-person-error" error={shown('person')}>
          <Input
            id="debt-form-person"
            data-testid="debt-form-person"
            autoFocus
            autoComplete="off"
            enterKeyHint="next"
            maxLength={MAX_PERSON_LENGTH}
            placeholder="Nombre"
            value={values.person}
            onChange={(e) => change({ person: e.target.value })}
            onBlur={blur('person')}
            aria-invalid={!!shown('person') || undefined}
            aria-describedby={shown('person') ? 'debt-form-person-error' : undefined}
          />
        </Field>

        <Field label="Monto" htmlFor="debt-form-amount" errorId="debt-form-amount-error" error={shown('amount')}>
          <div className="flex gap-2">
            <Input
              id="debt-form-amount"
              data-testid="debt-form-amount"
              inputMode="decimal"
              autoComplete="off"
              enterKeyHint="next"
              placeholder="0,00"
              className="tabular flex-1"
              value={values.amount}
              onChange={(e) => change({ amount: e.target.value })}
              onBlur={blur('amount')}
              aria-invalid={!!shown('amount') || undefined}
              aria-describedby={shown('amount') ? 'debt-form-amount-error' : undefined}
            />
            <SegmentedControl
              testId="debt-form-currency"
              aria-label="Moneda"
              className="w-32 shrink-0"
              value={values.currency}
              options={CURRENCY_OPTIONS}
              onValueChange={selectCurrency}
            />
          </div>
        </Field>

        {values.currency === 'USD' && (
          <Field
            label="Tipo de cambio (ARS por US$)"
            htmlFor="debt-form-fx-rate"
            errorId="debt-form-fx-rate-error"
            error={shown('fxRate')}
            aside={
              equivalent && (
                <span data-testid="debt-form-fx-ars-equivalent" className="tabular text-footnote text-muted-foreground">
                  {equivalent}
                </span>
              )
            }
          >
            <Input
              id="debt-form-fx-rate"
              data-testid="debt-form-fx-rate"
              inputMode="decimal"
              autoComplete="off"
              placeholder="0,00"
              className="tabular"
              value={values.fxRate}
              onChange={(e) => {
                setFxEdited(true)
                change({ fxRate: e.target.value })
              }}
              onBlur={blur('fxRate')}
              aria-invalid={!!shown('fxRate') || undefined}
              aria-describedby={shown('fxRate') ? 'debt-form-fx-rate-error' : undefined}
            />
            {rateStatus === 'loading' && (
              <p data-testid="debt-form-fx-loading" aria-live="polite" className="text-footnote text-muted-foreground">
                Buscando el tipo de cambio del mes…
              </p>
            )}
            {rateStatus === 'missing' && (
              <p className="text-footnote text-muted-foreground">
                <span data-testid="debt-form-fx-rate-status">No tenés un tipo de cambio configurado para este mes</span>
                {' · '}
                <Link
                  to="/settings"
                  data-testid="debt-form-fx-settings"
                  className="font-semibold text-foreground underline underline-offset-4"
                >
                  Ir a Ajustes
                </Link>
              </p>
            )}
            {rateStatus === 'error' && (
              <p data-testid="debt-form-fx-rate-status" className="text-footnote text-muted-foreground">
                No pudimos traer el tipo de cambio de referencia
              </p>
            )}
          </Field>
        )}

        <Field label="Fecha" htmlFor="debt-form-date" errorId="debt-form-date-error" error={shown('incurredOn')}>
          <input
            id="debt-form-date"
            data-testid="debt-form-date"
            type="date"
            max={todayIso}
            className="tabular h-11 w-full rounded-lg border border-input bg-card px-3 text-base text-foreground outline-none focus-visible:border-primary disabled:opacity-50 aria-invalid:border-destructive"
            value={values.incurredOn}
            onChange={(e) => change({ incurredOn: e.target.value })}
            onBlur={blur('incurredOn')}
            aria-invalid={!!shown('incurredOn') || undefined}
            aria-describedby={shown('incurredOn') ? 'debt-form-date-error' : undefined}
          />
        </Field>

        <Field label="Nota (opcional)" htmlFor="debt-form-notes">
          <Input
            id="debt-form-notes"
            data-testid="debt-form-notes"
            autoComplete="off"
            enterKeyHint="done"
            maxLength={MAX_NOTES_LENGTH}
            placeholder="Préstamo en efectivo"
            value={values.notes}
            onChange={(e) => change({ notes: e.target.value })}
          />
        </Field>
      </fieldset>

      {/* Fijo abajo, por encima de la barra de navegación y del teclado, como en Registrar. */}
      <div className="sticky z-20 -mx-5 mt-8 flex flex-col gap-2 border-t border-hairline bg-background px-5 pt-2.5 pb-3 [bottom:calc(var(--app-nav-offset)+var(--kb-inset))] sm:-mx-6 sm:px-6 lg:mx-0 lg:rounded-xl lg:border lg:px-3">
        {firstError && (
          <p id="debt-form-hint" data-testid="debt-form-hint" className="text-center text-footnote text-muted-foreground">
            {firstError}
          </p>
        )}
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={!canSave || saving}
          aria-describedby={firstError ? 'debt-form-hint' : undefined}
          data-testid="debt-form-submit"
        >
          {saving ? 'Guardando…' : 'Guardar deuda'}
        </Button>
        <Link
          to="/debts"
          data-testid="debt-form-cancel"
          aria-disabled={saving || undefined}
          onClick={(e) => saving && e.preventDefault()}
          className={cn(buttonVariants({ variant: 'ghost', size: 'lg' }), 'w-full', saving && 'pointer-events-none opacity-50')}
        >
          Cancelar
        </Link>
      </div>
    </form>
  )
}

/** Rótulo, control y error de un campo. El error aparece con role="alert" y su data-testid. */
function Field({
  label,
  htmlFor,
  errorId,
  error,
  aside,
  children,
}: {
  label: string
  htmlFor: string
  errorId?: string
  error?: string
  aside?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={htmlFor}>{label}</Label>
        {aside}
      </div>
      {children}
      {errorId && error && (
        <p id={errorId} data-testid={errorId} role="alert" className="text-footnote text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
