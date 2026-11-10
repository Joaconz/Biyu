import { useEffect, useState, type FormEvent } from 'react'
import { Archive, ArchiveRestore, Pencil, Sparkles, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Link } from 'react-router'
import { LogoutButton } from '@/components/LogoutButton'
import { BalanceOptionsList } from '@/components/balance/BalanceOptionsList'
import { AccountIcon } from '@/components/shared/AccountIcon'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { CategoryIcon } from '@/components/shared/CategoryIcon'
import { GroupedCard, GroupedSection } from '@/components/shared/GroupedList'
import { useTheme } from '@/components/layout/ThemeProvider'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { THEME_OPTIONS } from '@/lib/theme'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ACCOUNT_TYPE_LABELS,
  accountSaveErrorMessage,
  archiveAccount,
  countAccountTransactions,
  createAccount,
  deleteAccount,
  listActiveAccounts,
  listArchivedAccounts,
  unarchiveAccount,
  updateAccount,
  type Account,
  type AccountCurrency,
  type AccountType,
} from '@/lib/accounts'
import {
  archiveCategory,
  CATEGORY_COLOR_PALETTE,
  countCategoryUsage,
  createCategory,
  deleteCategory,
  listActiveCategories,
  listArchivedCategories,
  unarchiveCategory,
  updateCategory,
  type Category,
} from '@/lib/categories'
import { isUniqueViolation } from '@/lib/errors'
import { today } from '@/lib/clock'
import { toTestIdSuffix } from '@/lib/utils'
import { categoryDeletionSummary } from '@/domain/deletion'
import { DEFAULT_BALANCE_OPTIONS, type BalanceOptions } from '@/domain/balance'
import { validateFxRateInput } from '@/domain/fx'
import { formatRate, parseMoney } from '@/domain/money'
import { formatPeriod, formatPeriodLong, fromDbDate, parsePeriod } from '@/domain/period'
import { usePeriodParam } from '@/hooks/usePeriodParam'
import { useCatchupInBackground } from '@/hooks/useSubscriptionCatchup'
import { listReferenceRates, upsertReferenceRate, type ReferenceRate } from '@/lib/fxRates'
import { fetchBalanceOptions } from '@/lib/preferences'
import { useBalanceOptionsSaver } from '@/hooks/useBalanceOptionsSaver'

export function SettingsPage() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-10">
      <PageHeader title="Ajustes" testId="settings-title" className="pb-0 lg:pb-0" />
      <AppearanceSection />
      <CategoriesSection />
      <AccountsSection />
      <FxRatesSection />
      <SummarySection />
      {/* CP-CFG-015 (US-68): reabrir el setup inicial, ya completado o no. */}
      <GroupedCard>
        <Link
          to="/setup"
          data-testid="settings-nav-setup"
          className="press flex min-h-14 w-full items-center gap-3 px-4 text-callout font-medium text-foreground hover:bg-accent"
        >
          <Sparkles aria-hidden="true" className="size-[1.125rem]" strokeWidth={1.8} />
          Volver a hacer la configuración inicial
        </Link>
      </GroupedCard>
      {/* US-64: cerrar sesión vive en Ajustes (ADR-023). */}
      <GroupedCard>
        <LogoutButton testId="settings-nav-logout" />
      </GroupedCard>
    </div>
  )
}

/** ADR-052: claro, oscuro o el del sistema. Se guarda en el dispositivo (localStorage), no en la cuenta. */
function AppearanceSection() {
  const { preference, setPreference } = useTheme()
  return (
    <GroupedSection title="Apariencia" data-testid="settings-appearance" footer="«Automático» sigue al modo claro u oscuro del teléfono.">
      <SegmentedControl
        testId="settings-theme"
        aria-label="Tema"
        value={preference}
        onValueChange={setPreference}
        options={THEME_OPTIONS.map((option) => ({ ...option, testId: `settings-theme-${option.value}` }))}
      />
    </GroupedSection>
  )
}

/**
 * US-101: qué entra en el gasto neto del Resumen. Los mismos interruptores y el mismo guardado que la tarjeta
 * verde del Resumen (ADR-053): cada uno guarda al tocarlo y no reescribe ningún movimiento.
 */
function SummarySection() {
  const [stored, setStored] = useState<BalanceOptions | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const saver = useBalanceOptionsSaver()

  useEffect(() => {
    fetchBalanceOptions()
      .then(setStored)
      .catch((e: Error) => setLoadError(e.message))
  }, [])

  const shown = saver.edited ?? stored ?? DEFAULT_BALANCE_OPTIONS
  const error = loadError ?? saver.error
  return (
    <GroupedSection
      title="Resumen"
      data-testid="settings-summary"
      footer="Qué entra en el número de gasto del Resumen. También lo podés cambiar desde la tarjeta verde del Resumen. No modifica ningún movimiento."
    >
      {error && <p role="alert" data-testid="settings-summary-error" className="px-1 text-sm text-destructive">{error}</p>}
      <GroupedCard>
        <BalanceOptionsList
          options={shown}
          onChange={(option, value) => saver.save({ ...shown, [option]: value }, shown)}
          disabled={stored === null}
          testIdPrefix="settings-summary"
        />
      </GroupedCard>
    </GroupedSection>
  )
}

function FxRatesSection() {
  const { period, setPeriod } = usePeriodParam()
  const [rates, setRates] = useState<ReferenceRate[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const runCatchup = useCatchupInBackground()

  useEffect(() => {
    listReferenceRates().then(setRates).catch((e: Error) => setError(e.message))
  }, [])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    // e.currentTarget queda null después del primer await (fin del dispatch nativo);
    // se guarda la referencia acá para poder resetear el form más abajo.
    const formEl = e.currentTarget
    const form = new FormData(formEl)
    const selectedPeriod = parsePeriod(String(form.get('period')))
    const rawRate = String(form.get('ars_per_usd')).trim()
    if (!selectedPeriod) return setError('Elegí un mes válido')
    const validation = validateFxRateInput(rawRate)
    if (!validation.rate) return setError(validation.error)
    setSubmitting(true)
    try {
      await upsertReferenceRate(selectedPeriod, validation.rate)
      // ADR-031 §1: el tipo de cambio nuevo puede destrabar meses de una suscripción en USD (US-53).
      void runCatchup()
      const updated = await listReferenceRates()
      setRates(updated)
      const rateInput = formEl.elements.namedItem('ars_per_usd')
      if (rateInput instanceof HTMLInputElement) rateInput.value = ''
    } catch {
      setError('No se pudo guardar el tipo de cambio')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <GroupedSection
      title="Tipo de cambio de referencia"
      footer="Pesos por dólar de cada mes. Cambiar la referencia no modifica las transacciones que ya guardaste."
    >
      {rates && rates.length > 0 && (
        <GroupedCard>
          <ul data-testid="settings-fx-list" className="contents">
            {rates.map((rate) => (
              <li key={rate.period} className="flex min-h-14 items-center justify-between gap-3 px-4 text-callout">
                <span className="first-letter:uppercase">{formatPeriodLong(fromDbDate(rate.period))}</span>
                <span className="tabular font-medium">$ {formatRate(parseMoney(rate.arsPerUsd))}</span>
              </li>
            ))}
          </ul>
        </GroupedCard>
      )}
      <form onSubmit={onSubmit} data-testid="settings-fx-form" className="flex flex-col gap-4 rounded-2xl bg-card p-5">
        <div className="grid gap-1.5">
          <Label htmlFor="settings-fx-period">Mes</Label>
          <Input
            id="settings-fx-period"
            name="period"
            type="month"
            required
            value={formatPeriod(period)}
            onChange={(event) => {
              const next = parsePeriod(event.target.value)
              if (next) setPeriod(next)
            }}
            data-testid="settings-fx-period"
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="settings-fx-rate">ARS por USD</Label>
          <Input
            id="settings-fx-rate"
            name="ars_per_usd"
            required
            inputMode="decimal"
            enterKeyHint="done"
            placeholder="Ej. 1.400,50"
            data-testid="settings-fx-rate"
            className="h-12 text-base"
          />
        </div>
        {error && <p role="alert" data-testid="settings-fx-error" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={submitting} data-testid="settings-fx-submit">
          {submitting ? 'Guardando…' : 'Guardar tipo de cambio'}
        </Button>
      </form>
    </GroupedSection>
  )
}

function CategoriesSection() {
  const [categories, setCategories] = useState<Category[] | null>(null)
  const [archived, setArchived] = useState<Category[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  // DEF-025: el error de la edición va en la fila que se edita, no en el formulario de alta.
  const [editError, setEditError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  // US-89: la categoría que se quiere borrar y cuánto la usa, para la confirmación.
  const [deleting, setDeleting] = useState<{ category: Category; transactions: number; subscriptions: number } | null>(null)

  useEffect(() => {
    listActiveCategories().then(setCategories).catch((e: Error) => setError(e.message))
    listArchivedCategories().then(setArchived).catch(() => {})
  }, [])

  function startEditing(id: string | null) {
    setEditError(null)
    setEditingId(id)
  }

  // DEF-026: reactivar deshace el archivado; si ya hay una activa con ese nombre, lo dice.
  async function onUnarchive(category: Category) {
    setError(null)
    try {
      await unarchiveCategory(category.id)
      setArchived((prev) => prev.filter((c) => c.id !== category.id))
      setCategories((prev) => [...(prev ?? []), { ...category, archived_at: null }].sort((a, b) => a.name.localeCompare(b.name)))
    } catch (err) {
      setError(isUniqueViolation(err) ? `Ya hay una categoría activa llamada «${category.name}»` : 'No se pudo reactivar la categoría')
    }
  }

  // US-89: cuenta el uso antes de confirmar; la regla real (rechazar con uso) la aplica Postgres (C6).
  async function onAskDelete(category: Category) {
    setError(null)
    try {
      setDeleting({ category, ...(await countCategoryUsage(category.id)) })
    } catch {
      setError('No se pudo consultar el uso de la categoría')
    }
  }

  async function onConfirmDelete() {
    if (!deleting) return
    try {
      await deleteCategory(deleting.category.id)
      const id = deleting.category.id
      setCategories((prev) => prev?.filter((c) => c.id !== id) ?? null)
      setArchived((prev) => prev.filter((c) => c.id !== id))
      setDeleting(null)
      toast.success('Categoría eliminada', { testId: 'settings-categories-deleted' })
    } catch (err) {
      setDeleting(null)
      setError((err as { message?: string }).message || 'No se pudo eliminar la categoría')
    }
  }

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    // e.currentTarget queda null después del primer await (fin del dispatch nativo);
    // se guarda la referencia acá para poder resetear el form más abajo.
    const formEl = e.currentTarget
    const form = new FormData(formEl)
    const name = String(form.get('name')).trim()
    const color = String(form.get('color') || CATEGORY_COLOR_PALETTE[0])
    if (!name) return setError('El nombre es obligatorio')
    setSubmitting(true)
    try {
      const category = await createCategory({ name, color })
      setCategories((prev) => [...(prev ?? []), category].sort((a, b) => a.name.localeCompare(b.name)))
      formEl.reset()
    } catch (err) {
      setError(isUniqueViolation(err) ? 'Ya existe una categoría activa con ese nombre' : 'No se pudo guardar la categoría')
    } finally {
      setSubmitting(false)
    }
  }

  async function onSave(id: string, changes: { name: string; color: string }) {
    setEditError(null)
    try {
      await updateCategory(id, changes)
      setCategories(
        (prev) =>
          prev
            ?.map((c) => (c.id === id ? { ...c, ...changes } : c))
            .sort((a, b) => a.name.localeCompare(b.name)) ?? null,
      )
      setEditingId(null)
    } catch (err) {
      setEditError(isUniqueViolation(err) ? 'Ya existe una categoría activa con ese nombre' : 'No se pudo guardar la categoría')
    }
  }

  async function onArchive(id: string) {
    setError(null)
    try {
      const archivedAt = today().toISOString()
      await archiveCategory(id, archivedAt)
      const category = categories?.find((c) => c.id === id)
      if (category) setArchived((prev) => [...prev, { ...category, archived_at: archivedAt }].sort((a, b) => a.name.localeCompare(b.name)))
      setCategories((prev) => prev?.filter((c) => c.id !== id) ?? null)
    } catch {
      setError('No se pudo archivar la categoría')
    }
  }

  return (
    <GroupedSection title="Categorías">
      <GroupedCard>
        <ul data-testid="settings-categories-list" className="contents">
          {(categories ?? []).map((category) =>
            editingId === category.id ? (
              <CategoryEditRow
                key={category.id}
                category={category}
                error={editError}
                onSave={(changes) => onSave(category.id, changes)}
                onCancel={() => startEditing(null)}
              />
            ) : (
              <li key={category.id} className="flex min-h-16 items-center gap-3 py-2 pr-1.5 pl-4">
                {/* ADR-052: el nombre abre la edición (con el lápiz como pista), así quedan dos íconos y el
                    nombre entra entero a 360 px. */}
                <button
                  type="button"
                  data-testid={`settings-categories-edit-${toTestIdSuffix(category.name)}`}
                  aria-label={`Editar ${category.name}`}
                  className="press -my-2 -ml-2 flex min-h-14 min-w-0 flex-1 items-center gap-3 rounded-xl py-2 pl-2 text-left hover:bg-accent/60"
                  onClick={() => startEditing(category.id)}
                >
                  <CategoryIcon name={category.name} color={category.color} />
                  <span className="min-w-0 flex-1 text-callout font-medium break-words">{category.name}</span>
                  <Pencil aria-hidden="true" strokeWidth={1.6} className="mr-1 size-4 shrink-0 text-muted-foreground" />
                </button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  data-testid={`settings-categories-archive-${toTestIdSuffix(category.name)}`}
                  aria-label={`Archivar ${category.name}`}
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => onArchive(category.id)}
                >
                  <Archive strokeWidth={1.6} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  data-testid={`settings-categories-delete-${toTestIdSuffix(category.name)}`}
                  aria-label={`Eliminar ${category.name}`}
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => onAskDelete(category)}
                >
                  <Trash2 strokeWidth={1.6} />
                </Button>
              </li>
            ),
          )}
        </ul>
      </GroupedCard>
      <form onSubmit={onCreate} data-testid="settings-categories-form" className="mt-2 flex flex-col gap-4 rounded-2xl bg-card p-5">
        <div className="grid gap-1.5">
          <Label htmlFor="settings-categories-name">Nueva categoría</Label>
          <Input id="settings-categories-name" name="name" required data-testid="settings-categories-name" placeholder="Tecnología" />
        </div>
        <ColorSwatchPicker name="color" defaultColor={CATEGORY_COLOR_PALETTE[0]} testId="settings-categories-color" />
        {error && <p role="alert" data-testid="settings-categories-error" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={submitting} data-testid="settings-categories-submit">
          Crear categoría
        </Button>
      </form>
      {/* DEF-026: sin esto, archivar era de ida. */}
      {archived.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          <h3 className="px-1 text-footnote font-semibold text-muted-foreground">Archivadas</h3>
          <GroupedCard>
            <ul data-testid="settings-categories-archived-list" className="contents">
              {archived.map((category, i) => (
                <li key={category.id} className="flex min-h-16 items-center gap-3 py-2 pr-1.5 pl-4">
                  <CategoryIcon name={category.name} color={category.color} />
                  <span className="min-w-0 flex-1 text-callout font-medium break-words text-muted-foreground">{category.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    data-testid={uniqueTestId(`settings-categories-unarchive-${toTestIdSuffix(category.name)}`, archived, i)}
                    aria-label={`Reactivar ${category.name}`}
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => onUnarchive(category)}
                  >
                    <ArchiveRestore strokeWidth={1.6} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    data-testid={uniqueTestId(`settings-categories-delete-archived-${toTestIdSuffix(category.name)}`, archived, i)}
                    aria-label={`Eliminar ${category.name}`}
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => onAskDelete(category)}
                  >
                    <Trash2 strokeWidth={1.6} />
                  </Button>
                </li>
              ))}
            </ul>
          </GroupedCard>
        </div>
      )}
      <ConfirmDialog
        isOpen={deleting !== null}
        title="¿Eliminar categoría?"
        summary={deleting ? categoryDeletionSummary(deleting.category.name, deleting) : undefined}
        confirmLabel="Eliminar"
        busyLabel="Eliminando…"
        testId="settings-categories-delete-dialog"
        onConfirm={onConfirmDelete}
        onClose={() => setDeleting(null)}
      >
        {deleting && (deleting.transactions > 0 || deleting.subscriptions > 0) ? (
          <p data-testid="settings-categories-delete-impact" className="font-medium text-destructive">
            No se puede eliminar una categoría en uso. Archivala si no la querés ver más.
          </p>
        ) : (
          <p data-testid="settings-categories-delete-impact">Se borra para siempre y su nombre queda libre.</p>
        )}
      </ConfirmDialog>
    </GroupedSection>
  )
}

/**
 * Puede haber dos archivadas con el mismo nombre (archivar "Salud", crear otra "Salud" y archivarla):
 * la segunda lleva un sufijo para que su data-testid siga siendo único (DEF-015).
 */
function uniqueTestId(base: string, items: readonly { name: string }[], index: number): string {
  const repeats = items.slice(0, index).filter((item) => toTestIdSuffix(item.name) === toTestIdSuffix(items[index].name)).length
  return repeats === 0 ? base : `${base}-${repeats + 1}`
}

function CategoryEditRow({
  category,
  error,
  onSave,
  onCancel,
}: {
  category: Category
  error: string | null
  onSave: (changes: { name: string; color: string }) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(category.name)
  const [color, setColor] = useState(category.color ?? CATEGORY_COLOR_PALETTE[0])
  return (
    <li className="mx-1.5 my-1 flex flex-col gap-3 rounded-xl bg-secondary/60 p-4">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        data-testid="settings-categories-edit-name"
        aria-label="Nombre de la categoría"
      />
      <ColorSwatchPicker
        value={color}
        onChange={setColor}
        testId="settings-categories-edit-color"
      />
      {error && (
        <p role="alert" data-testid="settings-categories-edit-error" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel} data-testid="settings-categories-cancel">
          Cancelar
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={() => name.trim() && onSave({ name: name.trim(), color })}
          data-testid="settings-categories-save"
        >
          Guardar
        </Button>
      </div>
    </li>
  )
}

/**
 * Edición de una cuenta. Eliminar va acá y no en la fila: es la única acción que no se deshace
 * (ADR-026), así que queda a un paso más que archivar y siempre pasa por la confirmación.
 */
function AccountEditRow({
  account,
  error,
  onSave,
  onDelete,
  onCancel,
}: {
  account: Account
  error: string | null
  onSave: (changes: { name: string; type: AccountType }) => void
  onDelete: () => void
  onCancel: () => void
}) {
  const [name, setName] = useState(account.name)
  const [type, setType] = useState<AccountType>(account.type)
  return (
    <li className="mx-1.5 my-1 flex flex-col gap-3 rounded-xl bg-secondary/60 p-4">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        data-testid="settings-accounts-edit-name"
        aria-label="Nombre de la cuenta"
      />
      <Select value={type} onValueChange={(value) => value && setType(value as AccountType)}>
        <SelectTrigger data-testid="settings-accounts-edit-type" aria-label="Tipo de cuenta" className="w-full">
          <SelectValue>{(value: AccountType) => ACCOUNT_TYPE_LABELS[value]}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(ACCOUNT_TYPE_LABELS) as AccountType[]).map((option) => (
            <SelectItem key={option} value={option} data-testid={`settings-accounts-edit-type-${toTestIdSuffix(option)}`}>
              {ACCOUNT_TYPE_LABELS[option]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p role="alert" data-testid="settings-accounts-edit-error" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onDelete}
          data-testid="settings-accounts-delete"
          className="mr-auto text-destructive hover:text-destructive"
        >
          <Trash2 strokeWidth={1.6} />
          Eliminar
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel} data-testid="settings-accounts-cancel">
          Cancelar
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={() => name.trim() && onSave({ name: name.trim(), type })}
          data-testid="settings-accounts-save"
        >
          Guardar
        </Button>
      </div>
    </li>
  )
}

function ColorSwatchPicker({
  name,
  value,
  defaultColor,
  onChange,
  testId,
}: {
  name?: string
  value?: string
  defaultColor?: string
  onChange?: (color: string) => void
  testId: string
}) {
  const [internal, setInternal] = useState(value ?? defaultColor ?? CATEGORY_COLOR_PALETTE[0])
  const current = value ?? internal
  function select(color: string) {
    setInternal(color)
    onChange?.(color)
  }
  return (
    <div className="flex flex-wrap gap-2.5" data-testid={testId} role="radiogroup" aria-label="Color">
      {name && <input type="hidden" name={name} value={current} />}
      {CATEGORY_COLOR_PALETTE.map((color) => (
        <button
          key={color}
          type="button"
          role="radio"
          aria-checked={current === color}
          aria-label={color}
          data-testid={`${testId}-${color.slice(1).toLowerCase()}`} // DEF-015
          onClick={() => select(color)}
          className="press size-10 rounded-full ring-offset-2 ring-offset-card outline-none aria-checked:ring-2 aria-checked:ring-foreground focus-visible:ring-2 focus-visible:ring-ring"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  )
}

function AccountsSection() {
  const [accounts, setAccounts] = useState<Account[] | null>(null)
  const [archived, setArchived] = useState<Account[]>([])
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editError, setEditError] = useState<string | null>(null) // DEF-025, como en categorías
  const [deleting, setDeleting] = useState<{ account: Account; transactions: number } | null>(null)

  function startEditing(id: string | null) {
    setEditError(null)
    setEditingId(id)
  }

  useEffect(() => {
    listActiveAccounts().then(setAccounts).catch((e: Error) => setError(e.message))
    listArchivedAccounts().then(setArchived).catch(() => {})
  }, [])

  async function onSave(id: string, changes: { name: string; type: AccountType }) {
    setEditError(null)
    try {
      await updateAccount(id, changes)
      setAccounts(
        (prev) =>
          prev?.map((a) => (a.id === id ? { ...a, ...changes } : a)).sort((a, b) => a.name.localeCompare(b.name)) ?? null,
      )
      setEditingId(null)
    } catch (err) {
      setEditError(isUniqueViolation(err) ? 'Ya existe una cuenta activa con ese nombre' : accountSaveErrorMessage(err))
    }
  }

  async function onArchive(id: string) {
    setError(null)
    try {
      const archivedAt = today().toISOString()
      await archiveAccount(id, archivedAt)
      const account = accounts?.find((a) => a.id === id)
      setAccounts((prev) => prev?.filter((a) => a.id !== id) ?? null)
      if (account) setArchived((prev) => [...prev, { ...account, archived_at: archivedAt }].sort((a, b) => a.name.localeCompare(b.name)))
    } catch {
      setError('No se pudo archivar la cuenta')
    }
  }

  // US-90: reactivar deshace el archivado; si ya hay una activa con ese nombre, lo dice (como en categorías).
  async function onUnarchive(account: Account) {
    setError(null)
    try {
      await unarchiveAccount(account.id)
      setArchived((prev) => prev.filter((a) => a.id !== account.id))
      setAccounts((prev) => [...(prev ?? []), { ...account, archived_at: null }].sort((a, b) => a.name.localeCompare(b.name)))
    } catch (err) {
      setError(isUniqueViolation(err) ? `Ya hay una cuenta activa llamada «${account.name}»` : 'No se pudo reactivar la cuenta')
    }
  }

  // La confirmación dice cuántos movimientos se van con la cuenta: se cuentan antes de abrirla.
  async function askDelete(account: Account) {
    setError(null)
    try {
      setDeleting({ account, transactions: await countAccountTransactions(account.id) })
    } catch {
      setError('No se pudo preparar la eliminación de la cuenta')
    }
  }

  async function onConfirmDelete() {
    if (!deleting) return
    try {
      await deleteAccount(deleting.account.id)
      setAccounts((prev) => prev?.filter((a) => a.id !== deleting.account.id) ?? null)
      setEditingId(null)
      toast.success('Cuenta eliminada', { testId: 'settings-accounts-deleted' })
      setDeleting(null)
    } catch {
      toast.error('No se pudo eliminar la cuenta')
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    // e.currentTarget queda null después del primer await (fin del dispatch nativo);
    // se guarda la referencia acá para poder resetear el form más abajo.
    const formEl = e.currentTarget
    const form = new FormData(formEl)
    const name = String(form.get('name')).trim()
    const type = String(form.get('type')) as AccountType
    const currency = String(form.get('currency')) as AccountCurrency
    if (!name) return setError('El nombre es obligatorio')
    setSubmitting(true)
    try {
      const account = await createAccount({ name, type, currency })
      setAccounts((prev) => [...(prev ?? []), account].sort((a, b) => a.name.localeCompare(b.name)))
      formEl.reset()
    } catch (err) {
      setError(isUniqueViolation(err) ? 'Ya existe una cuenta activa con ese nombre' : 'No se pudo guardar la cuenta')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <GroupedSection title="Cuentas">
      <GroupedCard>
        <ul data-testid="settings-accounts-list" className="contents">
          {(accounts ?? []).map((account) =>
            editingId === account.id ? (
              <AccountEditRow
                key={account.id}
                account={account}
                error={editError}
                onSave={(changes) => onSave(account.id, changes)}
                onDelete={() => askDelete(account)}
                onCancel={() => startEditing(null)}
              />
            ) : (
              <li key={account.id} className="flex min-h-16 items-center gap-3 py-2 pr-1.5 pl-4">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                  <AccountIcon type={account.type} className="size-5" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-callout font-medium">{account.name}</span>
                  {/* El tipo solo cuando dice algo que el nombre no dice. */}
                  {ACCOUNT_TYPE_LABELS[account.type] !== account.name && (
                    <span className="truncate text-footnote text-muted-foreground">{ACCOUNT_TYPE_LABELS[account.type]}</span>
                  )}
                </span>
                {account.currency === 'USD' && <span className="text-footnote font-medium text-muted-foreground">US$</span>}
                {/* DEF-011 (FR-05): editar y archivar, como las categorías. Eliminar está dentro de la edición. */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  data-testid={`settings-accounts-edit-${toTestIdSuffix(account.name)}`}
                  aria-label={`Editar ${account.name}`}
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => startEditing(account.id)}
                >
                  <Pencil strokeWidth={1.6} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  data-testid={`settings-accounts-archive-${toTestIdSuffix(account.name)}`}
                  aria-label={`Archivar ${account.name}`}
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => onArchive(account.id)}
                >
                  <Archive strokeWidth={1.6} />
                </Button>
              </li>
            ),
          )}
        </ul>
      </GroupedCard>
      <form onSubmit={onSubmit} data-testid="settings-accounts-form" className="mt-2 flex flex-col gap-4 rounded-2xl bg-card p-5">
        <div className="grid gap-1.5">
          <Label htmlFor="settings-accounts-name">Nueva cuenta</Label>
          <Input id="settings-accounts-name" name="name" required data-testid="settings-accounts-name" placeholder="Visa BBVA" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="settings-accounts-type">Tipo</Label>
          <Select name="type" defaultValue="credit_card">
            <SelectTrigger id="settings-accounts-type" data-testid="settings-accounts-type" className="w-full">
              <SelectValue>{(value: AccountType) => ACCOUNT_TYPE_LABELS[value]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(ACCOUNT_TYPE_LABELS) as AccountType[]).map((type) => (
                <SelectItem key={type} value={type} data-testid={`settings-accounts-type-${toTestIdSuffix(type)}`}>
                  {ACCOUNT_TYPE_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="settings-accounts-currency">Moneda</Label>
          <Select name="currency" defaultValue="ARS">
            <SelectTrigger id="settings-accounts-currency" data-testid="settings-accounts-currency" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ARS" data-testid="settings-accounts-currency-ars">ARS</SelectItem>
              <SelectItem value="USD" data-testid="settings-accounts-currency-usd">USD</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {error && <p role="alert" data-testid="settings-accounts-error" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={submitting} data-testid="settings-accounts-submit">
          Crear cuenta
        </Button>
      </form>
      {/* US-90: sin esto, archivar una cuenta era de ida. */}
      {archived.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          <h3 className="px-1 text-footnote font-semibold text-muted-foreground">Archivadas</h3>
          <GroupedCard>
            <ul data-testid="settings-accounts-archived-list" className="contents">
              {archived.map((account, i) => (
                <li key={account.id} className="flex min-h-16 items-center gap-3 py-2 pr-1.5 pl-4">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                    <AccountIcon type={account.type} className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-callout font-medium text-muted-foreground">{account.name}</span>
                  {account.currency === 'USD' && <span className="text-footnote font-medium text-muted-foreground">US$</span>}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    data-testid={uniqueTestId(`settings-accounts-unarchive-${toTestIdSuffix(account.name)}`, archived, i)}
                    aria-label={`Reactivar ${account.name}`}
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => onUnarchive(account)}
                  >
                    <ArchiveRestore strokeWidth={1.6} />
                  </Button>
                </li>
              ))}
            </ul>
          </GroupedCard>
        </div>
      )}
      <ConfirmDialog
        isOpen={deleting !== null}
        title={`¿Seguro que querés eliminar «${deleting?.account.name ?? ''}»?`}
        confirmLabel="Eliminar"
        busyLabel="Eliminando…"
        testId="settings-accounts-delete-dialog"
        onConfirm={onConfirmDelete}
        onClose={() => setDeleting(null)}
      >
        {deleting && deleting.transactions > 0 ? (
          <p data-testid="settings-accounts-delete-impact" className="font-medium text-destructive">
            También se van a eliminar {deleting.transactions === 1 ? 'su movimiento' : `sus ${deleting.transactions} movimientos`}, que
            dejan de contar en todos los totales.
          </p>
        ) : (
          <p data-testid="settings-accounts-delete-impact">No tiene movimientos.</p>
        )}
        <p>No se puede deshacer. Si querés conservar el historial, archivala en vez de eliminarla.</p>
      </ConfirmDialog>
    </GroupedSection>
  )
}
