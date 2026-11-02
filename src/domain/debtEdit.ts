import { validateDebtDraft, type DebtDraftErrors, type DebtDraftInput } from './debtDraft'
import type { DebtDirection, DebtRecord, DebtStatus } from './debts'
import type { Currency } from './fx'
import { formatArs, formatRate, formatUsd, parseMoney, tryParseMoney } from './money'
import { formatDisplayDate } from './period'

// Editar y eliminar una deuda (US-86, US-87; ADR-037, ADR-044 §3). Funciones puras: `today` entra por
// parámetro (C1) y los montos son Decimal (C2).

/** Una deuda como la trae `fetchDebtForEdit`: lo que hace falta para precargar y para el tope de I7. */
export interface EditableDebt {
  id: string
  person: string
  direction: DebtDirection
  /** En su moneda, como texto de la base ("10000.00"). */
  amount: string
  currency: Currency
  /** Tipo de cambio congelado (C5) como texto, o null en ARS. */
  fxRate: string | null
  incurredOn: string // YYYY-MM-DD
  notes: string | null
  status: DebtStatus
  /** El gasto de origen (ADR-036), o null si la deuda es suelta. */
  linked: { amount: string; currency: Currency; categoryName: string | null; deleted: boolean } | null
}

export type DebtEditBlockKind = 'settled' | 'deleted'

/**
 * Por qué una deuda no se edita: saldada (primero se vuelve a pendiente, US-40) o vinculada a un gasto
 * eliminado (ADR-037 §4). Sin bloqueo, null.
 */
export function debtEditBlock(debt: EditableDebt): { kind: DebtEditBlockKind; message: string } | null {
  if (debt.linked?.deleted) {
    return { kind: 'deleted', message: 'El gasto de esta deuda está eliminado. Restauralo para poder editarla.' }
  }
  if (debt.status === 'settled') {
    return { kind: 'settled', message: 'Una deuda saldada no se puede editar. Volvela a pendiente desde Deudas.' }
  }
  return null
}

/** Los valores iniciales del formulario de edición, con la forma de "Nueva deuda" para validar igual. */
export function debtEditInput(debt: EditableDebt): DebtDraftInput {
  return {
    direction: debt.direction,
    person: debt.person,
    // "10000.00" → "10.000,00": el monto como se escribe en el formulario (tryParseMoney lo vuelve a leer igual).
    amount: formatArs(parseMoney(debt.amount)).slice(1),
    currency: debt.currency,
    fxRate: debt.fxRate ? parseMoney(debt.fxRate).toFixed() : '',
    incurredOn: debt.incurredOn,
    notes: debt.notes ?? '',
  }
}

/** Si algún campo difiere del original: compara el monto ya interpretado y recorta persona y nota. */
export function hasDebtChanges(original: DebtDraftInput, current: DebtDraftInput): boolean {
  const a = tryParseMoney(original.amount)
  const b = tryParseMoney(current.amount)
  const sameAmount = a && b ? a.eq(b) : original.amount.trim() === current.amount.trim()
  return (
    !sameAmount ||
    original.person.trim() !== current.person.trim() ||
    original.notes.trim() !== current.notes.trim() ||
    original.incurredOn !== current.incurredOn ||
    original.direction !== current.direction
  )
}

/**
 * Los errores de la edición: los de "Nueva deuda" más el tope de I7 en una deuda de un gasto: no puede
 * superar el monto del gasto, que está en la misma moneda (US-41). La base lo valida igual (C6).
 */
export function debtEditErrors(input: DebtDraftInput, debt: EditableDebt, today: string): DebtDraftErrors {
  const errors = validateDebtDraft(input, today)
  if (debt.linked && !errors.amount) {
    const amount = tryParseMoney(input.amount)
    const cap = parseMoney(debt.linked.amount)
    if (amount && amount.gt(cap)) {
      const shown = debt.linked.currency === 'USD' ? formatUsd(cap) : formatArs(cap)
      errors.amount = `No puede superar el monto del gasto (${shown})` // I7
    }
  }
  return errors
}

/** "TC 1.450,00" del tipo de cambio congelado, o null en ARS. */
export function debtFxText(debt: Pick<EditableDebt, 'fxRate'>): string | null {
  return debt.fxRate ? `TC ${formatRate(parseMoney(debt.fxRate))}` : null
}

/** Qué deuda se va a eliminar, para la confirmación (US-94): persona, quién debe, monto y fecha. */
export function debtDeletionSummary(debt: DebtRecord): { label: string; value: string }[] {
  const amount = parseMoney(debt.amount)
  return [
    { label: 'Persona', value: debt.person },
    { label: debt.direction === 'owed_to_me' ? 'Te debe' : 'Le debés', value: debt.currency === 'USD' ? formatUsd(amount) : formatArs(amount) },
    { label: 'Fecha', value: formatDisplayDate(debt.incurredOn) },
  ]
}

/** Lo que pasa con el gasto de origen al eliminar su deuda (ADR-044 §3), o null si la deuda es suelta. */
export function debtDeletionConsequence(debt: Pick<DebtRecord, 'origin'>): string | null {
  if (!debt.origin) return null
  const what = debt.origin.categoryName ? `El gasto de ${debt.origin.categoryName}` : 'El gasto'
  return `${what} sigue como un gasto normal, sin compartir.`
}

/** Aviso de éxito al eliminar (US-87). */
export function deletedDebtNotice(person: string): string {
  return `Deuda con ${person} eliminada`
}
