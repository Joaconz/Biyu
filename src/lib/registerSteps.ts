// Pasos del registro de una transacción (ADR-024). Sin React ni Supabase: se testea en tests/lib/.
import type { DraftErrors, DraftField, TransactionDraft } from '@/domain/validation'

export type RegisterStep = 'amount' | 'category' | 'details'

/** Un ingreso no exige categoría (I8), así que salta ese paso. Con la cuenta y la fecha precargadas son 3 pasos (NFR-07). */
export function stepsFor(type: TransactionDraft['type']): RegisterStep[] {
  return type === 'expense' ? ['amount', 'category', 'details'] : ['amount', 'details']
}

/** Qué campos del borrador valida cada paso, en el orden en que aparecen en pantalla. */
export const STEP_FIELDS: Record<RegisterStep, readonly DraftField[]> = {
  amount: ['amount', 'fxRate'],
  category: ['categoryId'],
  details: ['accountId', 'installmentsCount', 'occurredOn'],
}

/** Errores que bloquean avanzar desde un paso; los de pasos siguientes no cuentan todavía. */
export function stepErrors(step: RegisterStep, errors: DraftErrors): DraftErrors {
  return Object.fromEntries(STEP_FIELDS[step].filter((f) => errors[f]).map((f) => [f, errors[f]]))
}

export function isStepComplete(step: RegisterStep, errors: DraftErrors): boolean {
  return STEP_FIELDS[step].every((f) => !errors[f])
}
