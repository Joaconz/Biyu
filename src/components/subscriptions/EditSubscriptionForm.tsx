import { useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EmptyCatalog, Field, SELECT_CLASS } from '@/components/subscriptions/subscriptionFormParts'
import { formatPeriodLong } from '@/domain/period'
import {
  ARCHIVED_HINT_TEXT,
  editFormValues,
  editNextChargeText,
  editOptions,
  editSavedNoticeText,
  EDIT_NOTICE_TEXT,
  endedExtensionHint,
  validateSubscriptionEdit,
} from '@/domain/subscriptionEdit'
import {
  acceptBillingDayInput,
  codePointLength,
  fieldOfSaveError,
  limitCodePoints,
  MAX_DESCRIPTION_LENGTH,
  MAX_NAME_LENGTH,
  type SubscriptionErrors,
  type SubscriptionField,
  type SubscriptionFormValues,
  type SubscriptionRecord,
} from '@/domain/subscriptions'
import type { Account, Category } from '@/lib/catalog'
import { isNetworkError, saveFailureReason } from '@/lib/errors'
import { updateSubscription } from '@/lib/subscriptions'
import { cn } from '@/lib/utils'

/**
 * Editar una suscripción (US-59, ADR-032). Mismos campos, `data-testid` y mensajes que el alta, salvo la
 * moneda y el mes de inicio, que se muestran como texto y no se pueden cambiar. En vez de la vista previa
 * del calendario muestra el "Próximo cobro" con los valores del formulario. update_subscription repite cada
 * validación (C6): lo que rechaza va debajo de su campo.
 */
export function EditSubscriptionForm({
  subscription,
  generatedPeriods,
  categories,
  accounts,
  today,
}: {
  subscription: SubscriptionRecord
  generatedPeriods: ReadonlySet<string>
  /** Las activas; la actual se agrega sola, con "(archivada)", si ya no lo está. */
  categories: Category[]
  accounts: Account[]
  today: Date
}) {
  const navigate = useNavigate()
  const [values, setValues] = useState<SubscriptionFormValues>(() => editFormValues(subscription))
  const [attempted, setAttempted] = useState(false)
  const [saving, setSaving] = useState(false)
  // El ref corta el doble toque antes de que React pinte el botón deshabilitado.
  const savingRef = useRef(false)
  const [serverErrors, setServerErrors] = useState<SubscriptionErrors>({})
  const [saveError, setSaveError] = useState<string | null>(null)

  const categoryOptions = editOptions(categories, { id: subscription.categoryId, name: subscription.categoryName })
  const accountOptions = editOptions(accounts, { id: subscription.accountId, name: subscription.accountName })
  const categoryArchived = categoryOptions.find((o) => o.id === values.categoryId)?.archived ?? false
  const accountArchived = accountOptions.find((o) => o.id === values.accountId)?.archived ?? false

  const errors: SubscriptionErrors = attempted
    ? { ...validateSubscriptionEdit(values, subscription, today).errors, ...serverErrors }
    : {}
  const nextCharge = editNextChargeText(values, subscription, generatedPeriods, today)
  const endedHint = endedExtensionHint(subscription, today)
  const detailPath = `/subscriptions/${subscription.id}`

  function change(patch: Partial<SubscriptionFormValues>) {
    setValues((prev) => ({ ...prev, ...patch }))
    const touched = Object.keys(patch) as SubscriptionField[]
    if (touched.some((field) => serverErrors[field])) {
      setServerErrors((prev) => {
        const next = { ...prev }
        touched.forEach((field) => delete next[field])
        return next
      })
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (savingRef.current) return
    setAttempted(true)
    setServerErrors({})
    setSaveError(null)
    const { draft } = validateSubscriptionEdit(values, subscription, today)
    if (!draft) return

    savingRef.current = true
    setSaving(true)
    try {
      const { generatedBefore, generatedAfter } = await updateSubscription(subscription.id, draft)
      navigate(detailPath)
      toast.success(editSavedNoticeText(generatedBefore, generatedAfter, today), { testId: 'subscription-toast' })
      return
    } catch (error) {
      const message = isNetworkError(error) ? '' : ((error as { message?: string }).message ?? '')
      const field = message ? fieldOfSaveError(message) : null
      if (field) setServerErrors({ [field]: message })
      else setSaveError(`No se pudo guardar: ${saveFailureReason(error)}`)
    } finally {
      savingRef.current = false
      setSaving(false)
    }
  }

  return (
    <form data-testid="subscription-form" onSubmit={onSubmit} noValidate className="flex flex-col">
      <p
        data-testid="subscription-form-notice"
        className="mb-5 rounded-lg bg-secondary px-3 py-2.5 text-callout text-muted-foreground"
      >
        {EDIT_NOTICE_TEXT}
      </p>

      <fieldset disabled={saving} className="flex flex-col gap-5">
        <Field id="name" label="Nombre" error={errors.name}>
          <Input
            id="subscription-form-name"
            data-testid="subscription-form-name"
            autoComplete="off"
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
            <span className="text-footnote font-medium text-muted-foreground">Moneda</span>
            <p
              data-testid="subscription-form-currency-readonly"
              className="flex h-11 items-center rounded-lg bg-secondary px-3 text-base text-muted-foreground"
            >
              {subscription.currency}
            </p>
          </div>
        </div>

        <Field
          id="category"
          label="Categoría"
          error={errors.categoryId}
          help={categoryArchived ? ARCHIVED_HINT_TEXT : undefined}
          helpTestId="subscription-form-category-archived-hint"
        >
          {categoryOptions.length === 0 ? (
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
              {categoryOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field
          id="account"
          label="Medio de pago"
          error={errors.accountId}
          help={accountArchived ? ARCHIVED_HINT_TEXT : undefined}
          helpTestId="subscription-form-account-archived-hint"
        >
          {accountOptions.length === 0 ? (
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
              {accountOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
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
          <div className="grid content-start gap-2">
            <span className="text-footnote font-medium text-muted-foreground">Mes de inicio</span>
            <p
              data-testid="subscription-form-start-period-readonly"
              className="flex h-11 items-center rounded-lg bg-secondary px-3 text-base text-muted-foreground"
            >
              {formatPeriodLong(subscription.startPeriod)}
            </p>
          </div>
          <Field
            id="end-period"
            label="Mes de fin (opcional)"
            error={errors.endPeriod}
            help={endedHint ?? undefined}
            helpTestId="subscription-form-end-period-hint"
          >
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
            {codePointLength(values.description)}/{MAX_DESCRIPTION_LENGTH}
          </p>
        </Field>
      </fieldset>

      {nextCharge && (
        <p
          aria-live="polite"
          data-testid="subscription-form-next-charge"
          className="mt-6 rounded-lg bg-secondary px-3 py-2.5 text-callout text-foreground"
        >
          {nextCharge}
        </p>
      )}

      {/* Fijo abajo, por encima de la barra de navegación, como en el alta. */}
      <div className="sticky bottom-(--app-nav-offset) z-20 -mx-5 mt-8 flex flex-col gap-2 border-t border-hairline bg-background px-5 pt-2.5 pb-3 sm:-mx-6 sm:px-6 lg:mx-0 lg:rounded-xl lg:border lg:px-3">
        {saveError && (
          <p role="alert" data-testid="subscription-form-error" className="text-footnote text-destructive">
            {saveError}
          </p>
        )}
        <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-2">
          <Link to={detailPath} data-testid="subscription-form-cancel" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
            Cancelar
          </Link>
          <Button type="submit" size="lg" disabled={saving} data-testid="subscription-form-submit">
            {saving ? 'Guardando…' : 'Guardar cambios'}
          </Button>
        </div>
      </div>
    </form>
  )
}
