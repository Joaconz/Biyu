import { useMemo, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SegmentedControl } from '@/components/ui/segmented-control'
import type { Currency } from '@/domain/fx'
import type { Decimal } from '@/domain/money'
import {
  acceptBillingDayInput,
  buildCalendarPreview,
  codePointLength,
  DUPLICATE_NAME_MESSAGE,
  emptySubscriptionForm,
  fieldOfSaveError,
  limitCodePoints,
  MAX_DESCRIPTION_LENGTH,
  MAX_NAME_LENGTH,
  savedNoticeText,
  validateSubscriptionForm,
  type SubscriptionErrors,
  type SubscriptionField,
  type SubscriptionFormValues,
} from '@/domain/subscriptions'
import type { Account, Category } from '@/lib/catalog'
import { isNetworkError, saveFailureReason } from '@/lib/errors'
import { createSubscription } from '@/lib/subscriptions'
import { cn } from '@/lib/utils'
import { SubscriptionPreview } from '@/components/subscriptions/SubscriptionPreview'
import { EmptyCatalog, Field, SELECT_CLASS } from '@/components/subscriptions/subscriptionFormParts'

const CURRENCY_OPTIONS: { value: Currency; label: string; testId: string; ariaLabel: string }[] = [
  { value: 'ARS', label: 'ARS', testId: 'subscription-form-currency-ars', ariaLabel: 'Pesos' },
  { value: 'USD', label: 'USD', testId: 'subscription-form-currency-usd', ariaLabel: 'Dólares' },
]

/**
 * Alta de una suscripción (US-52). Los errores aparecen al tocar "Guardar suscripción" y desde ahí
 * en vivo. create_subscription repite cada validación (C6); lo que rechaza va debajo de su campo.
 */
export function SubscriptionForm({
  categories,
  accounts,
  fxRates,
  today,
}: {
  categories: Category[]
  accounts: Account[]
  /** Tipos de cambio del usuario por `YYYY-MM` para la vista previa (US-75); null si no se pudieron cargar. */
  fxRates: ReadonlyMap<string, Decimal> | null
  today: Date
}) {
  const navigate = useNavigate()
  const [values, setValues] = useState<SubscriptionFormValues>(() => emptySubscriptionForm(today))
  const [attempted, setAttempted] = useState(false)
  const [saving, setSaving] = useState(false)
  // El ref corta el doble toque antes de que React pinte el botón deshabilitado (CA-10).
  const savingRef = useRef(false)
  const [serverErrors, setServerErrors] = useState<SubscriptionErrors>({})
  const [saveError, setSaveError] = useState<string | null>(null)
  // CA-16: el intento anterior falló por red y este choca con el nombre.
  const lastFailedByNetwork = useRef(false)
  const [maybeSaved, setMaybeSaved] = useState(false)

  // Se recalcula al cambiar cualquier campo, sin tocar la base (US-75).
  const preview = useMemo(() => buildCalendarPreview(values, fxRates, today), [values, fxRates, today])

  const errors: SubscriptionErrors = attempted
    ? { ...validateSubscriptionForm(values, today).errors, ...serverErrors }
    : {}

  function change(patch: Partial<SubscriptionFormValues>) {
    setValues((prev) => ({ ...prev, ...patch }))
    const touched = Object.keys(patch) as SubscriptionField[]
    if (touched.some((field) => serverErrors[field])) {
      setServerErrors((prev) => {
        const next = { ...prev }
        touched.forEach((field) => delete next[field])
        return next
      })
      if (touched.includes('name')) setMaybeSaved(false)
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (savingRef.current) return
    setAttempted(true)
    setServerErrors({})
    setSaveError(null)
    setMaybeSaved(false)
    const { draft } = validateSubscriptionForm(values, today)
    if (!draft) return

    savingRef.current = true
    setSaving(true)
    try {
      const { subscriptionId, generated } = await createSubscription(draft)
      navigate(`/subscriptions/${subscriptionId}`)
      toast.success(savedNoticeText(generated), { testId: 'subscription-toast' })
      return
    } catch (error) {
      const message = isNetworkError(error) ? '' : ((error as { message?: string }).message ?? '')
      const field = message ? fieldOfSaveError(message) : null
      if (field) {
        setServerErrors({ [field]: message })
        setMaybeSaved(message === DUPLICATE_NAME_MESSAGE && lastFailedByNetwork.current)
      } else {
        setSaveError(`No se pudo guardar: ${saveFailureReason(error)}`)
      }
      lastFailedByNetwork.current = isNetworkError(error)
    } finally {
      savingRef.current = false
      setSaving(false)
    }
  }

  const descriptionLength = codePointLength(values.description)

  return (
    <form data-testid="subscription-form" onSubmit={onSubmit} noValidate className="flex flex-col">
      <fieldset disabled={saving} className="flex flex-col gap-5">
        <Field
          id="name"
          label="Nombre"
          error={errors.name}
          footer={
            maybeSaved && (
              <p data-testid="subscription-form-error-list" className="text-footnote text-muted-foreground">
                Puede que se haya guardado en el intento anterior.{' '}
                <Link to="/subscriptions" data-testid="subscription-form-error-list-link" className="font-medium text-primary underline-offset-4 hover:underline">
                  Ver suscripciones
                </Link>
              </p>
            )
          }
        >
          <Input
            id="subscription-form-name"
            data-testid="subscription-form-name"
            autoComplete="off"
            placeholder="Netflix"
            value={values.name}
            onChange={(e) => change({ name: limitCodePoints(e.target.value, MAX_NAME_LENGTH) })}
            aria-invalid={!!errors.name || undefined}
          />
        </Field>

        <div className="grid grid-cols-[minmax(0,1fr)_9rem] items-start gap-3">
          <Field id="amount" label="Monto" error={errors.amount}>
            <Input
              id="subscription-form-amount"
              data-testid="subscription-form-amount"
              inputMode="decimal"
              autoComplete="off"
              placeholder="0,00"
              className="tabular"
              value={values.amount}
              onChange={(e) => change({ amount: e.target.value })}
              aria-invalid={!!errors.amount || undefined}
            />
          </Field>
          <div className="grid gap-2">
            <span id="subscription-form-currency-label" className="text-footnote font-medium text-muted-foreground">
              Moneda
            </span>
            <SegmentedControl
              testId="subscription-form-currency"
              aria-labelledby="subscription-form-currency-label"
              value={values.currency}
              options={CURRENCY_OPTIONS}
              onValueChange={(currency) => change({ currency })}
            />
          </div>
        </div>

        <Field id="category" label="Categoría" error={errors.categoryId}>
          {categories.length === 0 ? (
            <EmptyCatalog testId="subscription-form-category-empty" message="No tenés categorías activas." />
          ) : (
            <select
              id="subscription-form-category"
              data-testid="subscription-form-category"
              className={cn(SELECT_CLASS, !values.categoryId && 'text-muted-foreground')}
              value={values.categoryId}
              onChange={(e) => change({ categoryId: e.target.value })}
              aria-invalid={!!errors.categoryId || undefined}
            >
              <option value="" disabled>
                Elegí…
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field id="account" label="Medio de pago" error={errors.accountId}>
          {accounts.length === 0 ? (
            <EmptyCatalog testId="subscription-form-account-empty" message="No tenés medios de pago activos." />
          ) : (
            <select
              id="subscription-form-account"
              data-testid="subscription-form-account"
              className={cn(SELECT_CLASS, !values.accountId && 'text-muted-foreground')}
              value={values.accountId}
              onChange={(e) => change({ accountId: e.target.value })}
              aria-invalid={!!errors.accountId || undefined}
            >
              <option value="" disabled>
                Elegí…
              </option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field
          id="billing-day"
          label="Día de cobro"
          error={errors.billingDay}
          help="Si el mes tiene menos días, se cobra el último día del mes."
        >
          <Input
            id="subscription-form-billing-day"
            data-testid="subscription-form-billing-day"
            inputMode="numeric"
            autoComplete="off"
            placeholder="10"
            className="tabular w-24"
            value={values.billingDay}
            onChange={(e) => change({ billingDay: acceptBillingDayInput(e.target.value, values.billingDay) })}
            aria-invalid={!!errors.billingDay || undefined}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2 sm:gap-3">
          <Field id="start-period" label="Mes de inicio" error={errors.startPeriod}>
            <Input
              id="subscription-form-start-period"
              data-testid="subscription-form-start-period"
              type="month"
              value={values.startPeriod}
              onChange={(e) => change({ startPeriod: e.target.value })}
              aria-invalid={!!errors.startPeriod || undefined}
            />
          </Field>
          <Field id="end-period" label="Mes de fin (opcional)" error={errors.endPeriod}>
            <div className="flex gap-2">
              <Input
                id="subscription-form-end-period"
                data-testid="subscription-form-end-period"
                type="month"
                value={values.endPeriod}
                onChange={(e) => change({ endPeriod: e.target.value })}
                aria-invalid={!!errors.endPeriod || undefined}
              />
              <Button
                type="button"
                variant="outline"
                data-testid="subscription-form-end-period-clear"
                onClick={() => change({ endPeriod: '' })}
                disabled={!values.endPeriod}
              >
                Sin fin
              </Button>
            </div>
          </Field>
        </div>

        <Field id="description" label="Descripción (opcional)" error={errors.description}>
          <textarea
            id="subscription-form-description"
            data-testid="subscription-form-description"
            rows={3}
            className={cn(SELECT_CLASS, 'h-auto min-h-20 resize-y py-2.5')}
            value={values.description}
            onChange={(e) => change({ description: limitCodePoints(e.target.value, MAX_DESCRIPTION_LENGTH) })}
            aria-invalid={!!errors.description || undefined}
          />
          <p className="tabular text-right text-footnote text-muted-foreground">
            {descriptionLength}/{MAX_DESCRIPTION_LENGTH}
          </p>
        </Field>
      </fieldset>

      <SubscriptionPreview preview={preview} />

      {/* Fijo abajo, por encima de la barra de navegación, como la acción de Registrar. */}
      <div className="sticky bottom-(--app-nav-offset) z-20 -mx-5 mt-8 flex flex-col gap-2 border-t border-hairline bg-background px-5 pt-2.5 pb-3 sm:-mx-6 sm:px-6 lg:mx-0 lg:rounded-xl lg:border lg:px-3">
        {saveError && (
          <p role="alert" data-testid="subscription-form-error" className="text-footnote text-destructive">
            {saveError}
          </p>
        )}
        <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-2">
          <Link
            to="/subscriptions"
            data-testid="subscription-form-cancel"
            className={buttonVariants({ variant: 'outline', size: 'lg' })}
          >
            Cancelar
          </Link>
          <Button type="submit" size="lg" disabled={saving} data-testid="subscription-form-submit">
            {saving ? 'Guardando…' : 'Guardar suscripción'}
          </Button>
        </div>
      </div>
    </form>
  )
}
