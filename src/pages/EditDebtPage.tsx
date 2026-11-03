import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { debtEditBlock, debtEditErrors, debtEditInput, debtFxText, hasDebtChanges, type EditableDebt } from '@/domain/debtEdit'
import { firstDebtDraftError, MAX_NOTES_LENGTH, MAX_PERSON_LENGTH, type DebtDraftField, type DebtDraftInput } from '@/domain/debtDraft'
import type { DebtDirection } from '@/domain/debts'
import { toIsoDate } from '@/domain/period'
import { parseMoney } from '@/domain/money'
import { today } from '@/lib/clock'
import { fetchDebtForEdit, updateDebt } from '@/lib/debts'
import { saveFailureReason } from '@/lib/errors'

const DIRECTION_OPTIONS: { value: DebtDirection; label: string; testId: string }[] = [
  { value: 'owed_to_me', label: 'Me deben', testId: 'edit-debt-direction-owed-to-me' },
  { value: 'i_owe', label: 'Debo', testId: 'edit-debt-direction-i-owe' },
]

type State = { status: 'loading' } | { status: 'error' } | { status: 'not-found' } | { status: 'ready'; debt: EditableDebt }

/**
 * Editar deuda (US-86, `/debts/:id/edit`). Persona, monto y nota; en una deuda suelta también la fecha y la
 * dirección. La moneda y el tipo de cambio se ven como texto (C5) y la deuda de un gasto sigue su fecha y su
 * dirección (ADR-036). Una saldada o la de un gasto eliminado muestra su aviso en vez del formulario. Se vuelve a
 * la lista con los mismos filtros, que viajan en la URL (C11).
 */
export function EditDebtPage() {
  const { id = '' } = useParams()
  const { search } = useLocation()
  const backTo = `/debts${search}`
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })
    fetchDebtForEdit(id)
      .then((debt) => {
        if (!cancelled) setState(debt ? { status: 'ready', debt } : { status: 'not-found' })
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error' })
      })
    return () => {
      cancelled = true
    }
  }, [id, attempt])

  const block = state.status === 'ready' ? debtEditBlock(state.debt) : null

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col">
      <div className="flex items-center gap-1 pt-3 pb-6 lg:pt-0 lg:pb-8">
        <Link
          to={backTo}
          data-testid="edit-debt-back"
          aria-label="Volver a Deudas"
          className="press -ml-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full text-primary hover:bg-primary/8"
        >
          <ChevronLeft aria-hidden="true" className="size-6" strokeWidth={1.8} />
        </Link>
        <h1 data-testid="edit-debt-title" className="text-title-1 font-bold text-foreground">
          Editar deuda
        </h1>
      </div>

      {state.status === 'loading' && (
        <p data-testid="edit-debt-loading" className="text-callout text-muted-foreground">
          Cargando…
        </p>
      )}
      {state.status === 'error' && (
        <div className="flex flex-col items-start gap-3">
          <p role="alert" data-testid="edit-debt-load-error" className="text-callout text-destructive">
            No pudimos cargar la deuda.
          </p>
          <button
            type="button"
            data-testid="edit-debt-load-retry"
            onClick={() => setAttempt((n) => n + 1)}
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            Reintentar
          </button>
        </div>
      )}
      {state.status === 'not-found' && (
        <div className="flex flex-col items-start gap-4">
          <p data-testid="edit-debt-not-found" className="text-callout text-foreground">
            No encontramos esta deuda.
          </p>
          <Link to={backTo} data-testid="edit-debt-not-found-back" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
            Volver
          </Link>
        </div>
      )}
      {state.status === 'ready' && block && (
        <div className="flex flex-col items-start gap-4">
          <p data-testid={`edit-debt-blocked-${block.kind}`} className="text-callout text-foreground">
            {block.message}
          </p>
          <Link to={backTo} data-testid="edit-debt-blocked-back" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
            Volver
          </Link>
        </div>
      )}
      {state.status === 'ready' && !block && <EditDebtForm debt={state.debt} backTo={backTo} />}
    </div>
  )
}

function EditDebtForm({ debt, backTo }: { debt: EditableDebt; backTo: string }) {
  const navigate = useNavigate()
  const todayIso = toIsoDate(today())
  const original = useMemo(() => debtEditInput(debt), [debt])
  const [values, setValues] = useState<DebtDraftInput>(original)
  const [touched, setTouched] = useState<Partial<Record<DebtDraftField, boolean>>>({})
  const [saving, setSaving] = useState(false)
  const savingRef = useRef(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const isLinked = debt.linked !== null
  const errors = debtEditErrors(values, debt, todayIso)
  const firstError = firstDebtDraftError(errors)
  const changed = hasDebtChanges(original, values)
  const canSave = changed && !firstError && !saving
  const shown = (field: DebtDraftField) => (touched[field] ? errors[field] : undefined)
  const fx = debtFxText(debt)

  function change(patch: Partial<DebtDraftInput>, fields: DebtDraftField[] = []) {
    setValues((prev) => ({ ...prev, ...patch }))
    setSaveError(null)
    setTouched((prev) => ({ ...prev, ...Object.fromEntries(fields.map((f) => [f, true])) }))
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!canSave || savingRef.current) return
    savingRef.current = true
    setSaving(true)
    setSaveError(null)
    try {
      await updateDebt(debt.id, {
        person: values.person.trim(),
        amount: parseMoney(values.amount),
        notes: values.notes.trim() || null,
        // Solo una deuda suelta manda fecha y dirección: la de un gasto sigue las del gasto.
        ...(isLinked ? {} : { incurredOn: values.incurredOn, direction: values.direction }),
      })
      toast.success('Cambios guardados', { testId: 'debts-edited' })
      navigate(backTo)
    } catch (error) {
      // El formulario conserva lo escrito: solo se muestra el motivo y se vuelve a habilitar.
      setSaveError(`No pudimos guardar los cambios: ${saveFailureReason(error)}`)
      savingRef.current = false
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col">
      <div data-testid="edit-debt-readonly" className="mb-6 grid gap-1.5 rounded-lg bg-secondary px-3.5 py-3">
        <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-callout text-foreground">
          <span data-testid="edit-debt-currency-readonly" className="font-medium">
            {debt.currency === 'USD' ? 'US$' : 'ARS'}
          </span>
          {fx && (
            <span data-testid="edit-debt-fx-readonly" className="tabular">
              {fx}
            </span>
          )}
        </p>
        <p data-testid="edit-debt-readonly-note" className="text-footnote text-muted-foreground">
          {isLinked
            ? 'La moneda y el tipo de cambio no se pueden cambiar. Esta deuda sale de un gasto compartido: la fecha y la dirección son las del gasto.'
            : 'La moneda y el tipo de cambio no se pueden cambiar. Si están mal, eliminá la deuda y cargala de nuevo.'}
        </p>
      </div>

      <fieldset disabled={saving} className="grid gap-6">
        {!isLinked && (
          <div className="grid gap-2.5">
            <span id="edit-debt-direction-label" className="text-footnote font-medium text-muted-foreground">
              Dirección
            </span>
            <SegmentedControl
              testId="edit-debt-direction"
              aria-labelledby="edit-debt-direction-label"
              value={values.direction}
              options={DIRECTION_OPTIONS}
              onValueChange={(direction) => change({ direction })}
            />
          </div>
        )}

        <Field label="Persona" htmlFor="edit-debt-person" errorId="edit-debt-person-error" error={shown('person')}>
          <Input
            id="edit-debt-person"
            data-testid="edit-debt-person"
            autoComplete="off"
            maxLength={MAX_PERSON_LENGTH}
            value={values.person}
            onChange={(e) => change({ person: e.target.value }, ['person'])}
            aria-invalid={!!shown('person') || undefined}
            aria-describedby={shown('person') ? 'edit-debt-person-error' : undefined}
          />
        </Field>

        <Field label="Monto" htmlFor="edit-debt-amount" errorId="edit-debt-amount-error" error={shown('amount')}>
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="text-title-3 font-semibold text-muted-foreground">
              {debt.currency === 'USD' ? 'US$' : '$'}
            </span>
            <Input
              id="edit-debt-amount"
              data-testid="edit-debt-amount"
              inputMode="decimal"
              autoComplete="off"
              className="tabular flex-1"
              value={values.amount}
              onChange={(e) => change({ amount: e.target.value }, ['amount'])}
              aria-invalid={!!shown('amount') || undefined}
              aria-describedby={shown('amount') ? 'edit-debt-amount-error' : undefined}
            />
          </div>
        </Field>

        {!isLinked && (
          <Field label="Fecha" htmlFor="edit-debt-date" errorId="edit-debt-date-error" error={shown('incurredOn')}>
            <input
              id="edit-debt-date"
              data-testid="edit-debt-date"
              type="date"
              max={todayIso}
              className="tabular h-11 w-full rounded-lg border border-input bg-card px-3 text-base text-foreground outline-none focus-visible:border-primary aria-invalid:border-destructive"
              value={values.incurredOn}
              onChange={(e) => change({ incurredOn: e.target.value }, ['incurredOn'])}
              aria-invalid={!!shown('incurredOn') || undefined}
              aria-describedby={shown('incurredOn') ? 'edit-debt-date-error' : undefined}
            />
          </Field>
        )}

        <Field label="Nota (opcional)" htmlFor="edit-debt-notes">
          <Input
            id="edit-debt-notes"
            data-testid="edit-debt-notes"
            autoComplete="off"
            maxLength={MAX_NOTES_LENGTH}
            value={values.notes}
            onChange={(e) => change({ notes: e.target.value })}
          />
        </Field>
      </fieldset>

      {saveError && (
        <p role="alert" data-testid="edit-debt-error" className="mt-6 rounded-lg bg-destructive/10 px-3.5 py-3 text-callout text-destructive">
          {saveError}
        </p>
      )}

      <div className="mt-8 flex gap-2.5">
        <Link
          to={backTo}
          data-testid="edit-debt-cancel"
          aria-disabled={saving || undefined}
          onClick={(e) => saving && e.preventDefault()}
          className={buttonVariants({ variant: 'outline', size: 'lg', className: 'flex-1' })}
        >
          Cancelar
        </Link>
        <Button type="submit" size="lg" className="flex-1" disabled={!canSave} data-testid="edit-debt-submit">
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </Button>
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
  children,
}: {
  label: string
  htmlFor: string
  errorId?: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {errorId && error && (
        <p id={errorId} data-testid={errorId} role="alert" className="text-footnote text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
