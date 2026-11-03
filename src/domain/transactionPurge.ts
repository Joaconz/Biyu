
// Eliminar definitivamente un movimiento (US-85, ADR-044 §1-§2): lo que decide la pantalla de Eliminados.
// Funciones puras, sin React ni Supabase.
import { joinNames } from './sharedDebt'

export interface PurgeableTransaction {
  installmentsCount: number
  /** Personas de las deudas vinculadas de un gasto compartido (ADR-036, ADR-040); vacío si no hay. */
  sharedPeople: readonly string[]
  /** Nombre de la suscripción que lo generó (US-60), o null. */
  subscriptionName: string | null
}

/**
 * Un movimiento generado por una suscripción no se borra para siempre (ADR-044 §2): la puesta al día no filtra
 * por `deleted_at` (I11) y volvería a crearlo. Se puede dar de baja y restaurar, pero no purgar.
 */
export function canPurge(tx: Pick<PurgeableTransaction, 'subscriptionName'>): boolean {
  return tx.subscriptionName === null
}

/**
 * Lo que arrastra el borrado definitivo, una línea cada cosa, para la confirmación (US-94): las cuotas
 * se van con el movimiento y la deuda vinculada también.
 */
export function purgeConsequences(tx: PurgeableTransaction): string[] {
  const lines: string[] = []
  if (tx.installmentsCount > 1) lines.push(`Se borran también sus ${tx.installmentsCount} cuotas.`)
  if (tx.sharedPeople.length === 1) lines.push(`Se borra también la deuda con ${tx.sharedPeople[0]}.`)
  else if (tx.sharedPeople.length > 1) lines.push(`Se borran también las deudas con ${joinNames(tx.sharedPeople)}.`)
  return lines
}

/** Aviso de éxito (US-85). */
export const PURGED_NOTICE = 'Movimiento eliminado definitivamente'
