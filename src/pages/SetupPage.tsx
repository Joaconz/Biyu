import { useEffect, useState } from 'react'
import { Check, CircleCheck, CircleDashed } from 'lucide-react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { AccountIcon } from '@/components/shared/AccountIcon'
import { CategoryIcon } from '@/components/shared/CategoryIcon'
import { GroupedCard, GroupedSection } from '@/components/shared/GroupedList'
import { Button } from '@/components/ui/button'
import { TransactionForm } from '@/components/transaction-form/TransactionForm'
import { archiveAccount, listActiveAccounts, type Account } from '@/lib/accounts'
import { archiveCategory, listActiveCategories, type Category } from '@/lib/categories'
import { setStoredLastAccountId } from '@/lib/catalog'
import { today } from '@/lib/clock'
import { useCatalog } from '@/hooks/useCatalog'
import { ensureUserSeeded } from '@/lib/seed'
import { completeSetup, markSetupFinishedThisSession } from '@/lib/setup'
import { cn, toTestIdSuffix } from '@/lib/utils'

type Step = 'reason' | 'categories' | 'accounts' | 'expense'

const REASONS: ReadonlyArray<{ key: string; label: string; detail: string }> = [
  { key: 'entender', label: 'Entender en qué se me va la plata', detail: 'Un resumen claro de tus gastos por mes.' },
  { key: 'cuotas', label: 'Seguir las cuotas de la tarjeta', detail: 'Cada cuota cae sola en el mes que corresponde.' },
  { key: 'compartidos', label: 'Ordenar los gastos compartidos', detail: 'Quién te debe y a quién le debés.' },
]

/**
 * US-68 (ADR-025): setup de una sola vez después de crear la cuenta. Vive fuera de `AppLayout`
 * — el guard que manda para acá vive en `AppLayout`, no acá, así que esta pantalla nunca se
 * redirige a sí misma (reabrirla desde Ajustes, CP-CFG-015, tiene que funcionar siempre).
 */
export function SetupPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('reason')
  const [reason, setReason] = useState<string | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [categories, setCategories] = useState<Category[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [defaultAccountId, setDefaultAccountId] = useState<string | null>(null)
  const [finishing, setFinishing] = useState(false)

  useEffect(() => {
    let cancelled = false
    // ADR-014/ADR-025 §5: reseed solo si las dos listas vuelven vacías (la siembra de /signup no
    // terminó todavía). Si ya hay algo, no se toca — si acá se reseedeara sin ese guard, reabrir
    // el setup desde Ajustes (CP-CFG-015) resucitaría cualquier categoría o cuenta ya archivada,
    // porque vuelve a calificar como "falta sembrar" en cuanto deja de estar activa.
    Promise.all([listActiveCategories(), listActiveAccounts()])
      .then(async ([cats, accs]) => {
        if (cats.length > 0 && accs.length > 0) return [cats, accs] as const
        await ensureUserSeeded().catch(() => {})
        return Promise.all([listActiveCategories(), listActiveAccounts()])
      })
      .then(([cats, accs]) => {
        if (cancelled) return
        setCategories(cats)
        setAccounts(accs)
        setDefaultAccountId(accs[0]?.id ?? null)
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [])

  // DEF-022: terminar siempre lleva a la app. Si guardar falla, antes el botón volvía a quedar
  // habilitado sin ningún mensaje y no había forma de salir de /setup.
  async function finish() {
    if (finishing) return
    setFinishing(true)
    markSetupFinishedThisSession()
    try {
      await completeSetup(reason)
    } catch {
      toast.error('No pudimos guardar tu configuración. Te la vamos a volver a mostrar la próxima vez que entres.', {
        testId: 'setup-save-error',
      })
    }
    navigate('/register', { replace: true })
  }

  function goToExpense(withDefaultAccount: boolean) {
    if (withDefaultAccount && defaultAccountId) setStoredLastAccountId(defaultAccountId)
    setStep('expense')
  }

  // No hay "desarchivar" en la app (C10): destildar es una acción final, sin vuelta atrás acá.
  async function onArchiveCategory(category: Category) {
    setCategories((prev) => prev.filter((c) => c.id !== category.id))
    try {
      await archiveCategory(category.id, today().toISOString())
    } catch {
      setCategories((prev) => [...prev, category])
    }
  }

  async function onArchiveAccount(account: Account) {
    if (accounts.length <= 1) return // siempre queda al menos una cuenta activa
    setAccounts((prev) => prev.filter((a) => a.id !== account.id))
    if (defaultAccountId === account.id) {
      setDefaultAccountId(accounts.find((a) => a.id !== account.id)?.id ?? null)
    }
    try {
      await archiveAccount(account.id, today().toISOString())
    } catch {
      setAccounts((prev) => [...prev, account])
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col justify-center gap-7 px-5 py-10">
      <h1 className="sr-only">Configuración inicial</h1>
      <div data-testid="setup-step" data-step={step} role="progressbar" aria-label="Paso" aria-valuenow={STEP_INDEX[step] + 1} aria-valuemin={1} aria-valuemax={4} className="flex gap-1.5">
        {(['reason', 'categories', 'accounts', 'expense'] as Step[]).map((s) => (
          <span key={s} className={cn('h-1 flex-1 rounded-full', STEP_INDEX[s] <= STEP_INDEX[step] ? 'bg-primary' : 'bg-secondary')} />
        ))}
      </div>

      {status === 'loading' && (
        <p data-testid="setup-loading" className="text-callout text-muted-foreground">
          Cargando…
        </p>
      )}

      {status === 'error' && (
        <p role="alert" data-testid="setup-error" className="text-callout text-destructive">
          No pudimos cargar tus categorías y cuentas. Salteá el setup y probá de nuevo más tarde desde Ajustes.
        </p>
      )}

      {status === 'ready' && step === 'reason' && (
        <>
          <h2 className="text-title-2 font-bold">¿Para qué vas a usar Biyu?</h2>
          <div className="flex flex-col gap-2">
            {REASONS.map((r) => {
              const selected = reason === r.key
              return (
                <button
                  key={r.key}
                  type="button"
                  data-testid={`setup-reason-option-${r.key}`}
                  aria-pressed={selected}
                  onClick={() => setReason(r.key)}
                  className={cn(
                    'press flex flex-col gap-0.5 rounded-xl border border-hairline bg-card px-4 py-3 text-left hover:border-input',
                    selected && 'border-primary bg-[color-mix(in_srgb,var(--primary)_7%,var(--card))] ring-1 ring-primary ring-inset',
                  )}
                >
                  <span className="text-callout font-semibold">{r.label}</span>
                  <span className="text-footnote text-muted-foreground">{r.detail}</span>
                </button>
              )
            })}
          </div>
          <StepActions
            onSkip={() => setStep('categories')}
            onContinue={() => setStep('categories')}
            continueDisabled={false}
            skipTestId="setup-reason-skip"
            continueTestId="setup-reason-continue"
          />
        </>
      )}

      {status === 'ready' && step === 'categories' && (
        <>
          <h2 className="text-title-2 font-bold">Tus categorías</h2>
          {categories.length === 0 ? (
            // DEF-026: reabierto desde Ajustes con todas archivadas, la lista vacía no se explicaba.
            <p data-testid="setup-categories-empty" className="text-callout text-muted-foreground">
              No tenés categorías activas. Cuando termines, podés crearlas o reactivar las archivadas desde Ajustes.
            </p>
          ) : (
            <p className="text-callout text-muted-foreground">Destildá las que no uses: quedan archivadas, no se borran.</p>
          )}
          {categories.length > 0 && (
          <GroupedSection>
            <GroupedCard>
              <ul className="contents [&>*+*]:border-t [&>*+*]:border-hairline">
                {categories.map((category) => (
                  <li key={category.id} className="flex min-h-14 items-center gap-3 py-1.5 pr-1.5 pl-3.5">
                    <CategoryIcon name={category.name} color={category.color} size="sm" />
                    <span className="min-w-0 flex-1 truncate text-callout font-medium">{category.name}</span>
                    <ArchiveToggle
                      testId={`setup-category-${toTestIdSuffix(category.name)}`}
                      label={category.name}
                      onArchive={() => onArchiveCategory(category)}
                    />
                  </li>
                ))}
              </ul>
            </GroupedCard>
          </GroupedSection>
          )}
          <StepActions
            onSkip={() => setStep('accounts')}
            onContinue={() => setStep('accounts')}
            continueDisabled={false}
            skipTestId="setup-categories-skip"
            continueTestId="setup-categories-continue"
          />
        </>
      )}

      {status === 'ready' && step === 'accounts' && (
        <>
          <h2 className="text-title-2 font-bold">Tus cuentas</h2>
          <p className="text-callout text-muted-foreground">Elegí cuál usás más: viene precargada al registrar un gasto.</p>
          <GroupedSection>
            <GroupedCard>
              <ul className="contents [&>*+*]:border-t [&>*+*]:border-hairline">
                {accounts.map((account) => (
                  <li key={account.id} className="flex min-h-14 items-center gap-3 py-1.5 pr-1.5 pl-3.5">
                    <button
                      type="button"
                      role="radio"
                      aria-checked={defaultAccountId === account.id}
                      data-testid={`setup-account-default-${toTestIdSuffix(account.name)}`}
                      aria-label={`Marcar ${account.name} como predeterminada`}
                      onClick={() => setDefaultAccountId(account.id)}
                      className="press flex size-7 shrink-0 items-center justify-center text-muted-foreground aria-checked:text-primary"
                    >
                      {defaultAccountId === account.id ? <CircleCheck strokeWidth={1.7} /> : <CircleDashed strokeWidth={1.7} />}
                    </button>
                    <AccountIcon type={account.type} />
                    <span className="min-w-0 flex-1 truncate text-callout font-medium">{account.name}</span>
                    {accounts.length > 1 && (
                      <ArchiveToggle
                        testId={`setup-account-${toTestIdSuffix(account.name)}`}
                        label={account.name}
                        onArchive={() => onArchiveAccount(account)}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </GroupedCard>
          </GroupedSection>
          <StepActions
            onSkip={() => goToExpense(false)}
            onContinue={() => goToExpense(true)}
            continueDisabled={false}
            skipTestId="setup-accounts-skip"
            continueTestId="setup-accounts-continue"
          />
        </>
      )}

      {status === 'ready' && step === 'expense' && <ExpenseStep onSaved={finish} onSkip={finish} finishing={finishing} />}
    </div>
  )
}

const STEP_INDEX: Record<Step, number> = { reason: 0, categories: 1, accounts: 2, expense: 3 }

function StepActions({
  onSkip,
  onContinue,
  continueDisabled,
  skipTestId,
  continueTestId,
}: {
  onSkip: () => void
  onContinue: () => void
  continueDisabled: boolean
  skipTestId: string
  continueTestId: string
}) {
  return (
    <div className="mt-2 flex flex-col gap-2">
      <Button type="button" size="lg" disabled={continueDisabled} onClick={onContinue} data-testid={continueTestId}>
        Continuar
      </Button>
      <Button type="button" variant="ghost" onClick={onSkip} data-testid={skipTestId}>
        Saltear
      </Button>
    </div>
  )
}

/** Tildada = activa. Destildar archiva y saca la fila de la lista (C10: no hay vuelta atrás acá). */
function ArchiveToggle({ testId, label, onArchive }: { testId: string; label: string; onArchive: () => void }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked="true"
      aria-label={`Destildar ${label}`}
      data-testid={testId}
      onClick={onArchive}
      className="press flex size-9 shrink-0 items-center justify-center rounded-lg text-primary"
    >
      <Check strokeWidth={2} />
    </button>
  )
}

/** Paso 4: el primer gasto guiado reusa el registro en pasos tal cual (ADR-024), sin duplicar su lógica. */
function ExpenseStep({ onSaved, onSkip, finishing }: { onSaved: () => void; onSkip: () => void; finishing: boolean }) {
  const catalog = useCatalog()
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-title-2 font-bold">Registrá tu primer gasto</h2>
      {catalog.status === 'loading' && (
        <p data-testid="setup-expense-loading" className="text-callout text-muted-foreground">
          Cargando…
        </p>
      )}
      {catalog.status === 'error' && (
        <p role="alert" data-testid="setup-expense-error" className="text-callout text-destructive">
          No se pudieron cargar tus categorías y cuentas: {catalog.message}
        </p>
      )}
      {catalog.status === 'ready' && (
        <TransactionForm
          categories={catalog.categories}
          accounts={catalog.accounts}
          defaultAccountId={catalog.defaultAccountId}
          onSaved={onSaved}
        />
      )}
      <Button type="button" variant="ghost" disabled={finishing} onClick={onSkip} data-testid="setup-expense-skip">
        Saltear
      </Button>
    </div>
  )
}
