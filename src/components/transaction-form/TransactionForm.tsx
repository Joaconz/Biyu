import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  applyDraftChange,
  draftInputAfterSave,
  emptyDraftInput,
  parseDraftInput,
  resolvePreloadedAccount,
  type DraftInput,
} from '@/domain/draft'
import { toIsoDate } from '@/domain/period'
import { allowsInstallments, validateTransactionDraft } from '@/domain/validation'
import { setStoredLastAccountId, type Account, type Category } from '@/lib/catalog'
import { today } from '@/lib/clock'
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
  const todayIso = toIsoDate(today())
  const draft = parseDraftInput(values)
  // Copia UX de lo que revalida create_transaction (C6): con errores no se emite ninguna escritura.
  const errors = validateTransactionDraft(draft, todayIso)
  const canSave = Object.keys(errors).length === 0

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

  return (
    <form data-testid="transaction-form" onSubmit={onSubmit} noValidate>
      {/* Mientras guarda, el fieldset deshabilitado evita cambios que el reset pisaría. */}
      <fieldset disabled={saving} className="flex flex-col gap-5">
        <TypeSection {...section} />

        <AmountSection {...section} />

        <CurrencySection {...section} />

        {values.type === 'expense' && (
          <CategorySection {...section} categories={categories} />
        )}

        <AccountSection {...section} accounts={accounts} />

        {/* Cuotas (US-12, US-14): solo para un gasto con tarjeta de crédito. Escribe `installmentsCount`. */}
        {allowsInstallments(values) && <InstallmentsField {...section} />}

        <DateSection {...section} today={todayIso} />

        <DescriptionSection {...section} />

        <Button type="submit" size="lg" className="h-11" disabled={!canSave} data-testid="transaction-form-submit">
          {saving ? 'Guardando…' : 'Guardar'}
        </Button>
      </fieldset>
    </form>
  )
}
