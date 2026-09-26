import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
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
  createAccount,
  listActiveAccounts,
  type Account,
  type AccountCurrency,
  type AccountType,
} from '@/lib/accounts'
import {
  CATEGORY_COLOR_PALETTE,
  createCategory,
  listActiveCategories,
  updateCategory,
  type Category,
} from '@/lib/categories'
import { isUniqueViolation } from '@/lib/errors'

export function SettingsPage() {
  return (
    <AppShell
      actions={
        <Link to="/register" data-testid="settings-nav-register" className="text-sm underline">
          Registrar
        </Link>
      }
    >
      <h1 data-testid="settings-title" className="text-2xl font-semibold">Configuración</h1>
      <CategoriesSection />
      <AccountsSection />
    </AppShell>
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

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-medium">Categorías</h2>
      <ul data-testid="settings-categories-list" className="flex flex-col gap-1">
        {(categories ?? []).map((category) =>
          editingId === category.id ? (
            <CategoryEditRow
              key={category.id}
              category={category}
              onSave={(changes) => onSave(category.id, changes)}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <li key={category.id} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
              <span className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="size-3 rounded-full"
                  style={{ backgroundColor: category.color ?? undefined }}
                />
                {category.name}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                data-testid="settings-categories-edit"
                onClick={() => setEditingId(category.id)}
              >
                Editar
              </Button>
            </li>
          ),
        )}
      </ul>
      <form onSubmit={onCreate} data-testid="settings-categories-form" className="flex flex-col gap-2">
        <div className="grid gap-1.5">
          <Label htmlFor="settings-categories-name">Nombre</Label>
          <Input id="settings-categories-name" name="name" required data-testid="settings-categories-name" placeholder="Tecnología" />
        </div>
        <ColorSwatchPicker name="color" defaultColor={CATEGORY_COLOR_PALETTE[0]} testId="settings-categories-color" />
        {error && <p role="alert" data-testid="settings-categories-error" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={submitting} data-testid="settings-categories-submit">
          Crear categoría
        </Button>
      </form>
    </section>
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
    <li className="flex flex-col gap-2 rounded-lg border px-3 py-2">
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
    <div className="flex flex-wrap gap-1.5" data-testid={testId} role="radiogroup" aria-label="Color">
      {name && <input type="hidden" name={name} value={current} />}
      {CATEGORY_COLOR_PALETTE.map((color) => (
        <button
          key={color}
          type="button"
          role="radio"
          aria-checked={current === color}
          aria-label={color}
          onClick={() => select(color)}
          className="size-6 rounded-full ring-offset-2 outline-none aria-checked:ring-2 aria-checked:ring-ring focus-visible:ring-2 focus-visible:ring-ring"
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

  useEffect(() => {
    listActiveAccounts().then(setAccounts).catch((e: Error) => setError(e.message))
  }, [])

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
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-medium">Cuentas</h2>
      <ul data-testid="settings-accounts-list" className="flex flex-col gap-1">
        {(accounts ?? []).map((account) => (
          <li key={account.id} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
            <span>{account.name}</span>
            <span className="text-muted-foreground">{ACCOUNT_TYPE_LABELS[account.type]}</span>
          </li>
        ))}
      </ul>
      <form onSubmit={onSubmit} data-testid="settings-accounts-form" className="flex flex-col gap-2">
        <div className="grid gap-1.5">
          <Label htmlFor="settings-accounts-name">Nombre</Label>
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
                <SelectItem key={type} value={type}>
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
              <SelectItem value="ARS">ARS</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {error && <p role="alert" data-testid="settings-accounts-error" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={submitting} data-testid="settings-accounts-submit">
          Crear cuenta
        </Button>
      </form>
    </section>
  )
}
