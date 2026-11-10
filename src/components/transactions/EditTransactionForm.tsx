import { useMemo, useRef, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { AccountIcon } from '@/components/shared/AccountIcon'
import { CategoryIcon } from '@/components/shared/CategoryIcon'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { ChipGroup } from '@/components/transaction-form/ChipGroup'
import { FieldError } from '@/components/transaction-form/FieldError'
import { InstallmentsField } from '@/components/transaction-form/InstallmentsField'
import { SectionLabel } from '@/components/transaction-form/SectionLabel'
import type { Touched } from '@/components/transaction-form/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { applyDraftChange, parseDraftInput, type DraftInput } from '@/domain/draft'
import { formatRate, parseMoney } from '@/domain/money'
import { toIsoDate } from '@/domain/period'
import {
  closedMonthChanges,
  editInputFromTransaction,
  hasEditChanges,
  snapshotOf,
  type ClosedMonthChange,
  type EditableTransaction,
} from '@/domain/transactionEdit'
import { allowsInstallments, validateTransactionDraft } from '@/domain/validation'
import type { Account, Category } from '@/lib/catalog'
import { today } from '@/lib/clock'
import { saveFailureReason } from '@/lib/errors'
import { updateTransaction } from '@/lib/transactions'
import { sortCategoriesForGrid } from '@/lib/visuals'

type CategoryOption = Category & { label?: string }
type AccountOption = Account & { label?: string }

/**
 * Editar movimiento (US-84, ADR-043): una sola pantalla con el formulario precargado, no el asistente de
 * Registrar (ADR-024). Tipo, moneda y tipo de cambio se muestran en texto: la base no los cambia (C5).
 * Antes de guardar avisa qué meses ya cerrados cambian (FR-07); la RPC valida de todos modos (C6).
 */
export function EditTransactionForm({
  transaction,
  categories,
  accounts,
  backTo,
}: {
  transaction: EditableTransaction
  /** Las activas; si la del movimiento está archivada se suma sola, con «(archivada)». */
  categories: Category[]
  accounts: Account[]
  /** `/transactions?period=<AAAA-MM>`: a dónde se vuelve al guardar o cancelar (C11). */
  backTo: string
}) {
  const navigate = useNavigate()
  const todayDate = today()
  const todayIso = toIsoDate(todayDate)
  const original = useMemo(() => editInputFromTransaction(transaction), [transaction])
  const [values, setValues] = useState<DraftInput>(original)
  const [touched, setTouched] = useState<Touched>({})
  const [saving, setSaving] = useState(false)
  // Corta el doble toque antes de que React pinte el botón deshabilitado.
  const savingRef = useRef(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [closedChanges, setClosedChanges] = useState<ClosedMonthChange[] | null>(null)
  const [leaveOpen, setLeaveOpen] = useState(false)

  const categoryOptions = useMemo(() => {
    const options: CategoryOption[] = sortCategoriesForGrid(categories)
    const current = transaction.category
    if (current && !options.some((c) => c.id === current.id)) {
      options.push({ id: current.id, name: current.name, color: null, label: `${current.name} (archivada)` })
    }
    return options
  }, [categories, transaction.category])

  const accountOptions = useMemo(() => {
    const options: AccountOption[] = [...accounts]
    const current = transaction.account
    if (!options.some((a) => a.id === current.id)) {
      options.push({
        id: current.id,
        name: current.name,
        type: current.type ?? 'cash',
        currency: transaction.currency,
        label: `${current.name} (archivada)`,
      })
    }
    return options
  }, [accounts, transaction.account, transaction.currency])

  const draft = parseDraftInput(values)
  const errors = validateTransactionDraft(draft, todayIso)
  const changed = hasEditChanges(original, values)
  const canSave = changed && Object.keys(errors).length === 0 && !saving
  const isExpense = transaction.type === 'expense'
  const symbol = transaction.currency === 'USD' ? 'US$' : '$'

  function change(patch: Partial<DraftInput>) {
    const next = applyDraftChange(values, patch)
    setValues(next.values)
    setSaveError(null)
    if (next.installmentsReset) {
      toast.info('Las cuotas volvieron a 1', {
        description: 'Solo los gastos con tarjeta de crédito se pagan en cuotas.',
        testId: 'edit-transaction-installments-reset',
      })
    }
    setTouched((prev) => ({ ...prev, ...Object.fromEntries(Object.keys(patch).map((k) => [k, true])) }))
  }

  // Atrás y «Cancelar» piden confirmar solo si hay algo sin guardar (CA-22).
  function requestLeave() {
    if (changed) setLeaveOpen(true)
    else navigate(backTo)
  }

  const names = {
    category: (id: string | null) => categoryOptions.find((c) => c.id === id)?.name ?? '—',
    account: (id: string | null) => accountOptions.find((a) => a.id === id)?.name ?? '—',
  }

  // FR-07: el aviso se arma antes de llamar a la base. Sin meses cerrados que cambien, guarda directo.
  function requestSave() {
    if (!canSave || savingRef.current) return
    const before = snapshotOf(original)
    const after = snapshotOf(values)
    const changes = before && after ? closedMonthChanges(before, after, names, todayDate) : []
    if (changes.length > 0) setClosedChanges(changes)
    else void save()
  }

  async function save() {
    if (savingRef.current) return
    savingRef.current = true
    setSaving(true)
    setSaveError(null)
    try {
      await updateTransaction(transaction.id, draft)
      toast.success('Cambios guardados', { testId: 'transactions-edited' })
      navigate(backTo)
    } catch (error) {
      // El formulario conserva lo escrito (CA-23): solo se muestra el motivo y se vuelve a habilitar.
      setSaveError(`No pudimos guardar los cambios: ${saveFailureReason(error)}`)
      setClosedChanges(null)
      savingRef.current = false
      setSaving(false)
    }
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        requestSave()
      }}
      className="mx-auto flex w-full max-w-xl flex-col"
    >
      <div className="flex items-center gap-1 pt-3 pb-6 lg:pt-0 lg:pb-8">
        <button
          type="button"
          data-testid="edit-transaction-back"
          aria-label="Volver a Movimientos"
          onClick={requestLeave}
          className="press -ml-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full text-primary hover:bg-primary/8"
        >
          <ChevronLeft aria-hidden="true" className="size-6" strokeWidth={1.8} />
        </button>
        <h1 data-testid="edit-transaction-title" className="text-title-1 font-bold text-foreground">
          Editar movimiento
        </h1>
      </div>

      <div data-testid="edit-transaction-readonly" className="mb-6 grid gap-2 rounded-xl bg-secondary px-3.5 py-3">
        <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-callout text-foreground">
          <span data-testid="edit-transaction-type-readonly" className="font-medium">
            {isExpense ? 'Gasto' : 'Ingreso'}
          </span>
          <span data-testid="edit-transaction-currency-readonly">{transaction.currency === 'USD' ? 'US$' : 'ARS'}</span>
          {transaction.fxRate && (
            <span data-testid="edit-transaction-fx-readonly" className="tabular">
              TC {formatRate(parseMoney(transaction.fxRate))}
            </span>
          )}
        </p>
        <p data-testid="edit-transaction-readonly-note" className="text-footnote text-muted-foreground">
          El tipo, la moneda y el tipo de cambio no se pueden cambiar. Si están mal, eliminá el movimiento y cargalo de
          nuevo.
        </p>
      </div>

      <fieldset disabled={saving} className="grid gap-6">
        <div className="grid gap-2.5">
          <label htmlFor="edit-transaction-amount">
            <SectionLabel id="edit-transaction-amount-label">
              {transaction.installmentsCount > 1 ? 'Monto total de la compra' : 'Monto'}
            </SectionLabel>
          </label>
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="text-title-2 font-semibold text-muted-foreground">
              {symbol}
            </span>
            <Input
              id="edit-transaction-amount"
              data-testid="edit-transaction-amount"
              inputMode="decimal"
              autoComplete="off"
              value={values.amount}
              onChange={(e) => change({ amount: e.target.value })}
              aria-invalid={(touched.amount && !!errors.amount) || undefined}
              aria-describedby={errors.amount ? 'edit-transaction-amount-error' : undefined}
              className="tabular text-title-3 font-semibold"
            />
          </div>
          <FieldError id="edit-transaction-amount-error" message={errors.amount} active={!!touched.amount} />
        </div>

        <div className="grid gap-2.5">
          <label htmlFor="edit-transaction-date">
            <SectionLabel id="edit-transaction-date-label">Fecha</SectionLabel>
          </label>
          <input
            id="edit-transaction-date"
            data-testid="edit-transaction-date"
            type="date"
            max={todayIso}
            value={values.occurredOn}
            onChange={(e) => change({ occurredOn: e.target.value })}
            aria-invalid={(touched.occurredOn && !!errors.occurredOn) || undefined}
            aria-describedby={errors.occurredOn ? 'edit-transaction-date-error' : undefined}
            className="tabular h-12 w-full rounded-xl border border-input bg-card px-4 text-callout text-foreground outline-none focus-visible:border-primary"
          />
          <FieldError id="edit-transaction-date-error" message={errors.occurredOn} active={!!touched.occurredOn} />
        </div>

        {isExpense && (
          <div className="grid gap-2.5">
            <SectionLabel id="edit-transaction-category-label">Categoría</SectionLabel>
            <ChipGroup
              layout="tiles"
              testId="edit-transaction-category"
              labelId="edit-transaction-category-label"
              describedBy={errors.categoryId ? 'edit-transaction-category-error' : undefined}
              options={categoryOptions}
              value={values.categoryId}
              onChange={(id) => change({ categoryId: id })}
              renderIcon={(category) => <CategoryIcon name={category.name} color={category.color} icon={category.icon} />}
            />
            <FieldError id="edit-transaction-category-error" message={errors.categoryId} active={!!touched.categoryId} />
          </div>
        )}

        <div className="grid gap-2.5">
          <SectionLabel id="edit-transaction-account-label">Cuenta</SectionLabel>
          <ChipGroup
            layout="chips"
            testId="edit-transaction-account"
            labelId="edit-transaction-account-label"
            describedBy={errors.accountId ? 'edit-transaction-account-error' : undefined}
            options={accountOptions}
            value={values.accountId}
            onChange={(id) => change({ accountId: id, accountType: accountOptions.find((a) => a.id === id)?.type ?? null })}
            renderIcon={(account) => <AccountIcon type={account.type} className="text-muted-foreground" />}
          />
          <FieldError id="edit-transaction-account-error" message={errors.accountId} active={!!touched.accountId} />
        </div>

        {allowsInstallments(values) && (
          <InstallmentsField
            values={values}
            errors={errors}
            touched={touched}
            onChange={change}
            testIdPrefix="edit-transaction"
          />
        )}

        <div className="grid gap-2.5">
          <label htmlFor="edit-transaction-description">
            <SectionLabel id="edit-transaction-description-label">Nota (opcional)</SectionLabel>
          </label>
          <Input
            id="edit-transaction-description"
            data-testid="edit-transaction-description"
            type="text"
            autoComplete="off"
            placeholder="Almuerzo con Sofi"
            value={values.description}
            onChange={(e) => change({ description: e.target.value })}
          />
        </div>
      </fieldset>

      {saveError && (
        <p role="alert" data-testid="edit-transaction-error" className="mt-6 rounded-xl bg-destructive/10 px-3.5 py-3 text-callout text-destructive">
          {saveError}
        </p>
      )}

      <div className="mt-8 flex gap-2.5">
        <Button
          type="button"
          variant="outline"
          data-testid="edit-transaction-cancel"
          onClick={requestLeave}
          disabled={saving}
          className="h-12 flex-1"
        >
          Cancelar
        </Button>
        <Button type="submit" data-testid="edit-transaction-submit" disabled={!canSave} className="h-12 flex-1">
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </Button>
      </div>

      <ConfirmDialog
        isOpen={closedChanges !== null}
        title="Esto cambia meses que ya pasaron"
        confirmLabel="Guardar igual"
        busyLabel="Guardando…"
        confirmVariant="default"
        testId="edit-transaction-closed"
        dialogTestId="edit-transaction-closed-dialog"
        onConfirm={save}
        onClose={() => setClosedChanges(null)}
      >
        <ul className="space-y-1.5 rounded-xl bg-secondary px-3 py-2.5">
          {(closedChanges ?? []).map((change) => (
            <li key={change.key} data-testid={`edit-transaction-closed-period-${change.key}`} className="tabular text-foreground">
              <span className="font-medium">{change.label}</span>: {change.text}
            </li>
          ))}
        </ul>
        <p>Los totales y el resumen de esos meses se van a recalcular.</p>
      </ConfirmDialog>

      <ConfirmDialog
        isOpen={leaveOpen}
        title="¿Salir sin guardar los cambios?"
        confirmLabel="Salir sin guardar"
        cancelLabel="Seguir editando"
        busyLabel="Saliendo…"
        testId="edit-transaction-leave"
        dialogTestId="edit-transaction-leave-dialog"
        cancelTestId="edit-transaction-leave-stay"
        confirmTestId="edit-transaction-leave-confirm"
        onConfirm={async () => navigate(backTo)}
        onClose={() => setLeaveOpen(false)}
      >
        <p>Lo que cambiaste no se guarda.</p>
      </ConfirmDialog>
    </form>
  )
}
