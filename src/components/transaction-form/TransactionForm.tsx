import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { emptyDraftInput, parseDraftInput, type DraftInput } from '@/domain/draft'
import { toIsoDate } from '@/domain/period'
import { validateTransactionDraft } from '@/domain/validation'
import type { Account, Category } from '@/lib/catalog'
import { today } from '@/lib/clock'
import { AccountSection } from './AccountSection'
import { AmountSection } from './AmountSection'
import type { SectionProps, Touched } from './types'

interface TransactionFormProps {
  categories: Category[]
  accounts: Account[]
}

/**
 * Formulario de registro (FR-06), armado por secciones. Cada sección recibe `SectionProps` y
 * escribe solo sus campos del borrador; este componente es el único que valida y guarda.
 * Los puntos marcados "Punto de extensión" son donde se enchufan secciones de otras historias.
 */
export function TransactionForm({ accounts }: TransactionFormProps) {
  const [values, setValues] = useState<DraftInput>(() => emptyDraftInput(toIsoDate(today())))
  const [touched, setTouched] = useState<Touched>({})
  const todayIso = toIsoDate(today())
  const draft = parseDraftInput(values)
  // Copia UX de lo que revalida create_transaction (C6): con errores no se emite ninguna escritura.
  const errors = validateTransactionDraft(draft, todayIso)
  const canSave = Object.keys(errors).length === 0

  function change(patch: Partial<DraftInput>) {
    setValues((prev) => ({ ...prev, ...patch }))
    setTouched((prev) => ({ ...prev, ...Object.fromEntries(Object.keys(patch).map((k) => [k, true])) }))
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!canSave) return
  }

  const section: SectionProps = { values, errors, touched, onChange: change }

  return (
    <form data-testid="transaction-form" onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <AmountSection {...section} />

      {/*
        Punto de extensión: moneda y tipo de cambio (US-19 a US-21).
        <CurrencySection {...section} /> va acá, pegada al monto. Escribe `currency` y `fxRate`
        (texto, como `amount`); I5 ya lo valida validateTransactionDraft.
      */}

      <AccountSection {...section} accounts={accounts} />

      {/*
        Punto de extensión: cuotas (US-12 a US-14).
        {values.accountType === 'credit_card' && <InstallmentsSection {...section} />} va acá.
        Escribe `installmentsCount`. Si la cuenta deja de ser tarjeta de crédito hay que volverlo
        a 1 (si no, I6 bloquea el guardado con la sección oculta).
      */}

      <Button type="submit" size="lg" className="h-11" disabled={!canSave} data-testid="transaction-form-submit">
        Guardar
      </Button>
    </form>
  )
}
