import type { DraftInput } from '@/domain/draft'
import type { DraftErrors, DraftField } from '@/domain/validation'

/** Qué campos de una fila de "Gasto compartido" ya tocó el usuario (US-82). */
export interface SharedRowTouched {
  person?: boolean
  amount?: boolean
}

export type Touched = Partial<Record<Exclude<keyof DraftInput, 'sharedRows'> | DraftField, boolean>> & {
  /** Por fila de personas, en el mismo orden que `values.sharedRows`. */
  sharedRows?: SharedRowTouched[]
}

/**
 * Contrato de cada sección del formulario de registro. Una sección muestra sus campos y su
 * error, y propone cambios parciales con `onChange`. No valida ni guarda: eso lo hace
 * TransactionForm con `validateTransactionDraft` (dominio) y `createTransaction` (RPC).
 */
export interface SectionProps {
  values: DraftInput
  errors: DraftErrors
  /** Campos que el usuario ya tocó: su error pasa de aviso gris a rojo. */
  touched: Touched
  onChange: (patch: Partial<DraftInput>) => void
}
