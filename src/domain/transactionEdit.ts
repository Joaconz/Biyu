import type { DraftInput } from './draft'
import type { Currency } from './fx'
import { generateLedgerEntries } from './installments'
import { Decimal, formatArs, parseMoney, tryParseMoney } from './money'
import { currentPeriod, formatPeriod, formatPeriodLong, isPeriodBefore, periodOf, type Period } from './period'

// Editar un movimiento (US-84, ADR-043, FR-07). Todo lo que decide la pantalla de edición y no es de
// la base vive acá, como funciones puras: `today` entra por parámetro (C1) y los montos son Decimal (C2).

/** Un movimiento como lo trae `fetchTransactionForEdit`: lo que hace falta para precargar y bloquear. */
export interface EditableTransaction {
  id: string
  type: 'expense' | 'income'
  /** Total de la compra en su moneda, como texto de la base ("30000.00"). */
  amount: string
  currency: Currency
  /** Tipo de cambio congelado (C5) como texto, o null en ARS. */
  fxRate: string | null
  installmentsCount: number
  occurredOn: string // YYYY-MM-DD
  description: string | null
  category: { id: string; name: string; archivedAt: string | null } | null
  account: { id: string; name: string; type: DraftInput['accountType']; archivedAt: string | null }
  deletedAt: string | null
  /** Nombre de la suscripción que lo generó (US-60), o null. */
  subscriptionName: string | null
  /** Personas de sus deudas vinculadas (ADR-036, ADR-040); vacío si no se compartió. */
  sharedPeople: string[]
}

export type EditBlockKind = 'deleted' | 'subscription' | 'shared'

export interface EditBlock {
  kind: EditBlockKind
  message: string
}

/**
 * Por qué un movimiento no se puede editar (ADR-043 §5), en el orden en que lo valida la base: si cumple
 * dos bloqueos sale el primero. Sin bloqueo, null.
 */
export function editBlock(tx: EditableTransaction): EditBlock | null {
  if (tx.deletedAt) {
    return { kind: 'deleted', message: 'Este movimiento está eliminado. Restauralo para poder editarlo.' }
  }
  if (tx.subscriptionName) {
    return {
      kind: 'subscription',
      message: `Este gasto lo generó la suscripción ${tx.subscriptionName}. Editar la suscripción no cambia los meses ya cargados.`,
    }
  }
  if (tx.sharedPeople.length > 0) {
    const who = tx.sharedPeople.length === 1 ? tx.sharedPeople[0] : `${tx.sharedPeople.length} personas`
    return { kind: 'shared', message: `Este gasto está compartido con ${who}. Para cambiarlo, eliminalo y cargalo de nuevo.` }
  }
  return null
}

/** "30000.00" → "30.000,00": el monto como se escribe en el formulario (tryParseMoney lo vuelve a leer igual). */
export function amountInputText(amount: string): string {
  const [int, decimals] = parseMoney(amount).toFixed(2).split('.')
  return `${int.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${decimals}`
}

/**
 * Los valores iniciales del formulario de edición. Reusa `DraftInput` para validar y previsualizar
 * con las mismas funciones que Registrar; tipo, moneda y tipo de cambio van fijos (ADR-043 §2).
 */
export function editInputFromTransaction(tx: EditableTransaction): DraftInput {
  return {
    type: tx.type,
    amount: amountInputText(tx.amount),
    currency: tx.currency,
    fxRate: tx.fxRate ? parseMoney(tx.fxRate).toFixed() : '',
    categoryId: tx.category?.id ?? null,
    accountId: tx.account.id,
    accountType: tx.account.type,
    installmentsCount: tx.installmentsCount,
    occurredOn: tx.occurredOn,
    description: tx.description ?? '',
    shared: false,
    sharedRows: [],
  }
}

function sameAmount(a: string, b: string): boolean {
  const x = tryParseMoney(a)
  const y = tryParseMoney(b)
  return x && y ? x.eq(y) : a.trim() === b.trim()
}

/**
 * Si algún campo difiere del original (CA-22). Compara valores ya interpretados: "12500" y "12.500,00"
 * son lo mismo, y una nota vacía o de solo espacios es igual a ninguna.
 */
export function hasEditChanges(original: DraftInput, current: DraftInput): boolean {
  return (
    !sameAmount(original.amount, current.amount) ||
    original.occurredOn !== current.occurredOn ||
    original.categoryId !== current.categoryId ||
    original.accountId !== current.accountId ||
    original.installmentsCount !== current.installmentsCount ||
    original.description.trim() !== current.description.trim()
  )
}

/** Lo que define el calendario de imputaciones de un movimiento, antes o después de editarlo. */
export interface EditSnapshot {
  amount: Decimal
  fxRate: Decimal | null
  installmentsCount: number
  occurredOn: string
  categoryId: string | null
  accountId: string | null
}

/** El formulario como snapshot, o null si el monto o la fecha todavía no se pueden interpretar. */
export function snapshotOf(input: DraftInput): EditSnapshot | null {
  const amount = tryParseMoney(input.amount)
  if (!amount || !/^\d{4}-\d{2}-\d{2}$/.test(input.occurredOn)) return null
  return {
    amount,
    fxRate: tryParseMoney(input.fxRate),
    installmentsCount: input.installmentsCount,
    occurredOn: input.occurredOn,
    categoryId: input.categoryId,
    accountId: input.accountId,
  }
}

/** Un mes cerrado cuyos totales cambian al guardar (FR-07). */
export interface ClosedMonthChange {
  period: Period
  /** `AAAA-MM`, para el data-testid de la línea. */
  key: string
  /** "septiembre 2026". */
  label: string
  /** "de $10.000,00 a $12.000,00", "categoría: de Comida a Otros", "cuenta: de Efectivo a Visa". */
  parts: string[]
  /** Las partes unidas con " · ". */
  text: string
}

export interface EditNames {
  category: (id: string | null) => string
  account: (id: string | null) => string
}

/**
 * Qué meses ya cerrados (anteriores al mes de `today`) cambian al pasar de `before` a `after` (FR-07,
 * US-84 apartado 3). Por cada uno compara la imputación en pesos, la categoría y la cuenta: los tres
 * totales que muestra el Resumen. Una imputación que aparece o desaparece cuenta como cambio de monto
 * ("$0,00" donde no hay). La descripción no cuenta. El calendario se recalcula con
 * `generateLedgerEntries` y el tipo de cambio congelado (C5, C3); el aviso es UX, la base edita igual (C6).
 */
export function closedMonthChanges(
  before: EditSnapshot,
  after: EditSnapshot,
  names: EditNames,
  today: Date,
): ClosedMonthChange[] {
  const entriesOf = (s: EditSnapshot) =>
    new Map(
      generateLedgerEntries(s.amount, s.fxRate, s.installmentsCount, periodOf(s.occurredOn)).map((e) => [
        formatPeriod(e.period),
        e,
      ]),
    )
  const was = entriesOf(before)
  const will = entriesOf(after)
  const current = currentPeriod(today)
  const keys = [...new Set([...was.keys(), ...will.keys()])].sort()
  const zero = new Decimal(0)

  const changes: ClosedMonthChange[] = []
  for (const key of keys) {
    const [year, month] = key.split('-').map(Number)
    const period: Period = { year, month }
    if (!isPeriodBefore(period, current)) continue
    const a = was.get(key)
    const b = will.get(key)
    const parts: string[] = []
    const amountBefore = a?.amountArs ?? zero
    const amountAfter = b?.amountArs ?? zero
    if (!amountBefore.eq(amountAfter)) parts.push(`de ${formatArs(amountBefore)} a ${formatArs(amountAfter)}`)
    if (a && b && before.categoryId !== after.categoryId) {
      parts.push(`categoría: de ${names.category(before.categoryId)} a ${names.category(after.categoryId)}`)
    }
    if (a && b && before.accountId !== after.accountId) {
      parts.push(`cuenta: de ${names.account(before.accountId)} a ${names.account(after.accountId)}`)
    }
    if (parts.length > 0) changes.push({ period, key, label: formatPeriodLong(period), parts, text: parts.join(' · ') })
  }
  return changes
}
