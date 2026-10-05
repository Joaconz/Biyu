import { useEffect, useState, type FormEvent } from 'react'
import { Archive, Pencil, Sparkles, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Link } from 'react-router'
import { LogoutButton } from '@/components/LogoutButton'
import { AccountIcon } from '@/components/shared/AccountIcon'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { CategoryIcon } from '@/components/shared/CategoryIcon'
import { GroupedCard, GroupedSection } from '@/components/shared/GroupedList'
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
  updateAccount,
  type Account,
  type AccountCurrency,
  type AccountType,
} from '@/lib/accounts'
import {
  archiveCategory,
  CATEGORY_COLOR_PALETTE,
  createCategory,
  listActiveCategories,
  updateCategory,
  type Category,
} from '@/lib/categories'
import { isUniqueViolation } from '@/lib/errors'
import { today } from '@/lib/clock'
import { toTestIdSuffix } from '@/lib/utils'
import { validateFxRateInput } from '@/domain/fx'
import { formatRate, parseMoney } from '@/domain/money'
import { formatPeriod, formatPeriodLong, fromDbDate, parsePeriod } from '@/domain/period'
import { usePeriodParam } from '@/hooks/usePeriodParam'
import { listReferenceRates, upsertReferenceRate, type ReferenceRate } from '@/lib/fxRates'

export function SettingsPage() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-9">
      <PageHeader title="Ajustes" testId="settings-title" className="pb-0 lg:pb-0" />
      <CategoriesSection />
      <AccountsSection />
      <FxRatesSection />
      {/* CP-CFG-015 (US-68): reabrir el setup inicial, ya completado o no. */}
      <GroupedCard>
        <Link
          to="/setup"
          data-testid="settings-nav-setup"
          className="press flex min-h-12 w-full items-center gap-3 px-4 text-callout font-medium text-foreground hover:bg-accent"
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

function FxRatesSection() {
  const { period, setPeriod } = usePeriodParam()
  const [rates, setRates] = useState<ReferenceRate[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

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
          <ul data-testid="settings-fx-list" className="contents [&>*+*]:border-t [&>*+*]:border-hairline">
            {rates.map((rate) => (
              <li key={rate.period} className="flex min-h-12 items-center justify-between gap-3 px-4 text-callout">
                <span className="first-letter:uppercase">{formatPeriodLong(fromDbDate(rate.period))}</span>
                <span className="tabular font-medium">$ {formatRate(parseMoney(rate.arsPerUsd))}</span>
              </li>
            ))}
          </ul>
        </GroupedCard>
      )}
      <form onSubmit={onSubmit} data-testid="settings-fx-form" className="flex flex-col gap-3 rounded-xl border border-hairline bg-card p-4">
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
            className="h-11"
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
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    listActiveCategories().then(setCategories).catch((e: Error) => setError(e.message))
  }, [])

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
    setError(null)
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
      setError(isUniqueViolation(err) ? 'Ya existe una categoría activa con ese nombre' : 'No se pudo guardar la categoría')
    }
  }

  async function onArchive(id: string) {
    setError(null)
    try {
      await archiveCategory(id, today().toISOString())
      setCategories((prev) => prev?.filter((c) => c.id !== id) ?? null)
    } catch {
      setError('No se pudo archivar la categoría')
    }
  }

  return (
    <GroupedSection title="Categorías">
      <GroupedCard>
        <ul data-testid="settings-categories-list" className="contents [&>*+*]:border-t [&>*+*]:border-hairline">
          {(categories ?? []).map((category) =>
            editingId === category.id ? (
              <CategoryEditRow
                key={category.id}
                category={category}
                onSave={(changes) => onSave(category.id, changes)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <li key={category.id} className="flex min-h-14 items-center gap-3 py-1.5 pr-1.5 pl-3.5">
                <CategoryIcon name={category.name} color={category.color} size="sm" />
                <span className="min-w-0 flex-1 truncate text-callout font-medium">{category.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  data-testid={`settings-categories-edit-${toTestIdSuffix(category.name)}`}
                  aria-label={`Editar ${category.name}`}
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setEditingId(category.id)}
                >
                  <Pencil strokeWidth={1.6} />
                </Button>
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
              </li>
            ),
          )}
        </ul>
      </GroupedCard>
      <form onSubmit={onCreate} data-testid="settings-categories-form" className="mt-2 flex flex-col gap-3 rounded-xl border border-hairline bg-card p-4">
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
    </GroupedSection>
  )
}

function CategoryEditRow({
  category,
  onSave,
  onCancel,
}: {
  category: Category
  onSave: (changes: { name: string; color: string }) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(category.name)
  const [color, setColor] = useState(category.color ?? CATEGORY_COLOR_PALETTE[0])
  return (
    <li className="flex flex-col gap-3 bg-secondary/40 p-4">
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
  onSave,
  onDelete,
  onCancel,
}: {
  account: Account
  onSave: (changes: { name: string; type: AccountType }) => void
  onDelete: () => void
  onCancel: () => void
}) {
  const [name, setName] = useState(account.name)
  const [type, setType] = useState<AccountType>(account.type)
  return (
    <li className="flex flex-col gap-3 bg-secondary/40 p-4">
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
          className="press size-8 rounded-full ring-offset-2 ring-offset-card outline-none aria-checked:ring-2 aria-checked:ring-foreground focus-visible:ring-2 focus-visible:ring-ring"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  )
}

function AccountsSection() {
  const [accounts, setAccounts] = useState<Account[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<{ account: Account; transactions: number } | null>(null)

  useEffect(() => {
    listActiveAccounts().then(setAccounts).catch((e: Error) => setError(e.message))
  }, [])

  async function onSave(id: string, changes: { name: string; type: AccountType }) {
    setError(null)
    try {
      await updateAccount(id, changes)
      setAccounts(
        (prev) =>
          prev?.map((a) => (a.id === id ? { ...a, ...changes } : a)).sort((a, b) => a.name.localeCompare(b.name)) ?? null,
      )
      setEditingId(null)
    } catch (err) {
      setError(isUniqueViolation(err) ? 'Ya existe una cuenta activa con ese nombre' : accountSaveErrorMessage(err))
    }
  }

  async function onArchive(id: string) {
    setError(null)
    try {
      await archiveAccount(id, today().toISOString())
      setAccounts((prev) => prev?.filter((a) => a.id !== id) ?? null)
    } catch {
      setError('No se pudo archivar la cuenta')
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
        <ul data-testid="settings-accounts-list" className="contents [&>*+*]:border-t [&>*+*]:border-hairline">
          {(accounts ?? []).map((account) =>
            editingId === account.id ? (
              <AccountEditRow
                key={account.id}
                account={account}
                onSave={(changes) => onSave(account.id, changes)}
                onDelete={() => askDelete(account)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <li key={account.id} className="flex min-h-14 items-center gap-3 py-1.5 pr-1.5 pl-3.5">
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                  <AccountIcon type={account.type} className="size-4" />
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
                  onClick={() => setEditingId(account.id)}
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
      <form onSubmit={onSubmit} data-testid="settings-accounts-form" className="mt-2 flex flex-col gap-3 rounded-xl border border-hairline bg-card p-4">
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
