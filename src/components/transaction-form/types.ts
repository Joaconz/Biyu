import type { DraftInput } from '@/domain/draft'
import type { DraftErrors } from '@/domain/validation'

export type Touched = Partial<Record<keyof DraftInput, boolean>>

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
