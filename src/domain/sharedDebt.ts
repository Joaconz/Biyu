import type { Currency } from './fx'
import { convertToArs, Decimal, formatArs, formatUsd, tryParseMoney } from './money'

/** Largo máximo de la persona, igual que create_transaction (ADR-036 §5). */
export const MAX_PERSON_LENGTH = 60

/**
 * Lo que tiene cargado la sección "Gasto compartido" (US-34), como lo tipeó el usuario. Solo
 * existe en el borrador si el gasto está marcado como compartido; un ingreso nunca la lleva.
 */
export interface SharedDebtInput {
  person: string
  amount: string
}

/** Un gasto se comparte con hasta 10 personas (ADR-040 §2). */
export const MAX_SHARED_PEOPLE = 10

export interface SharedDebtErrors {
  sharedPerson?: string
  sharedAmount?: string
}

/** La deuda lista para create_transaction: persona recortada y monto en Decimal (C2). */
export interface SharedDebt {
  person: string
  amount: Decimal
}

const formatIn = (currency: Currency, amount: Decimal) =>
  currency === 'USD' ? formatUsd(amount) : formatArs(amount)

/**
 * Copia UX de lo que valida create_transaction para la deuda vinculada (C6, ADR-036): la fuente de
 * verdad es Postgres. Recorta con String.prototype.trim, la misma clase de caracteres que la RPC.
 * El tope "no puede superar el gasto" (US-41) se compara en la moneda del gasto, que es la de la
 * deuda (ADR-036); sin un monto de gasto válido no se chequea: ese error ya lo marca el paso 1.
 */
export function validateSharedDebt(
  input: SharedDebtInput,
  expense: { amount: Decimal | null; currency: Currency; fxRate: Decimal | null },
): SharedDebtErrors {
  const errors: SharedDebtErrors = {}
  if (input.person.trim() === '') errors.sharedPerson = 'Ingresá con quién compartiste el gasto'

  const text = input.amount.trim()
  const amount = tryParseMoney(text)
  if (text === '') {
    errors.sharedAmount = 'Ingresá cuánto te debe'
  } else if (!amount) {
    errors.sharedAmount = 'Ingresá un número válido'
  } else if (amount.lte(0)) {
    errors.sharedAmount = 'El monto debe ser mayor a cero' // I4
  } else if (amount.decimalPlaces() > 2) {
    errors.sharedAmount = 'El monto admite hasta 2 decimales'
  } else if (expense.amount && expense.amount.isFinite() && expense.amount.gt(0) && amount.gt(expense.amount)) {
    errors.sharedAmount = `No puede superar el monto del gasto (${formatIn(expense.currency, expense.amount)})` // I7
  } else if (expense.currency === 'USD' && expense.fxRate && expense.fxRate.gt(0)) {
    // amount_ars de la deuda es numeric(14,2) con CHECK > 0 (DEF-013).
    if (convertToArs(amount, expense.fxRate).lte(0)) {
      errors.sharedAmount = 'En pesos daría menos de $0,01. Revisá el monto o el tipo de cambio'
    }
  }
  return errors
}

/** La deuda a mandar, o null si todavía no es válida (no se guarda nada que el cliente rechace). */
export function toSharedDebt(input: SharedDebtInput): SharedDebt | null {
  const person = input.person.trim()
  const amount = tryParseMoney(input.amount)
  return person && amount && amount.gt(0) ? { person, amount } : null
}

/**
 * Las deudas que viajan con el gasto (ADR-040): solo un gasto se comparte (ADR-036 §3), y solo si
 * todas las filas tienen persona y monto válidos. Si alguna no, null: no se manda nada a medias.
 */
export function debtsOfDraft(draft: { type: 'expense' | 'income'; shared?: readonly SharedDebtInput[] | null }): SharedDebt[] | null {
  if (draft.type !== 'expense' || !draft.shared || draft.shared.length === 0) return null
  const debts = draft.shared.map(toSharedDebt)
  return debts.every((d): d is SharedDebt => d !== null) ? debts : null
}

/** Clave comparable de una persona: sin mayúsculas, tildes ni espacios de más. Solo para comparar. */
const personKey = (person: string) =>
  person
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
    .trim()
    .toLowerCase()

/** Orden de ADR-040 §5: alfabético sin distinguir mayúsculas ni tildes y, a igual clave, por el texto tal cual. */
export function comparePeople(a: string, b: string): number {
  const ka = personKey(a)
  const kb = personKey(b)
  if (ka !== kb) return ka < kb ? -1 : 1
  return a === b ? 0 : a < b ? -1 : 1
}

/** "Juan", "Juan y Sofía", "Ana, Juan y Sofía": ordenados (ADR-040 §5). */
export function joinNames(people: readonly string[]): string {
  const sorted = [...people].sort(comparePeople)
  return sorted.length <= 1 ? (sorted[0] ?? '') : `${sorted.slice(0, -1).join(', ')} y ${sorted.at(-1)}`
}

const sumOf = (debts: readonly SharedDebt[]) => debts.reduce((total, d) => total.plus(d.amount), new Decimal(0))

/**
 * Errores de cada fila y de la suma (US-82). Cada fila sigue las reglas de US-34 y US-41; además, una
 * persona repetida (recortada y sin distinguir mayúsculas) da "Ya agregaste a <la de la fila anterior>".
 * La suma solo se evalúa con dos o más filas y ninguna con error (copia UX de create_transaction, ADR-040 §2).
 */
export function validateSharedRows(
  rows: readonly SharedDebtInput[],
  expense: { amount: Decimal | null; currency: Currency; fxRate: Decimal | null },
): { rows: SharedDebtErrors[]; total?: string } {
  const perRow = rows.map((row, i) => {
    const errors = validateSharedDebt(row, expense)
    if (!errors.sharedPerson && i > 0) {
      const key = personKey(row.person)
      const earlier = rows.slice(0, i).find((r) => personKey(r.person) === key)
      if (earlier) errors.sharedPerson = `Ya agregaste a ${earlier.person.trim()}`
    }
    return errors
  })
  const clean = perRow.every((e) => !e.sharedPerson && !e.sharedAmount)
  const gasto = expense.amount
  if (rows.length < 2 || !clean || !gasto || !gasto.isFinite() || gasto.lte(0)) return { rows: perRow }
  const amounts = rows.map((r) => tryParseMoney(r.amount)!)
  const sum = amounts.reduce((total, a) => total.plus(a), new Decimal(0))
  if (sum.gt(gasto)) {
    return { rows: perRow, total: `Entre todos no pueden deber más que el gasto (${formatIn(expense.currency, gasto)})` }
  }
  if (expense.currency === 'USD' && expense.fxRate && expense.fxRate.gt(0)) {
    const sumArs = amounts.reduce((total, a) => total.plus(convertToArs(a, expense.fxRate)), new Decimal(0))
    if (sumArs.gt(convertToArs(gasto, expense.fxRate))) {
      return { rows: perRow, total: 'En pesos, la suma supera el gasto por redondeo. Bajá un centavo alguna deuda.' }
    }
  }
  return { rows: perRow }
}

/**
 * "Dividir en partes iguales" (ADR-040 §4): el gasto se parte entre las `people` personas y el usuario
 * (people + 1 partes). A cada persona le toca la parte truncada a 2 decimales y el usuario absorbe el resto (C3).
 */
export function splitEqually(total: Decimal, people: number): { share: Decimal; mine: Decimal } {
  const share = total.div(people + 1).toDecimalPlaces(2, Decimal.ROUND_DOWN)
  return { share, mine: total.minus(share.times(people)) }
}

/** El monto como se escribe en el campo: coma decimal, sin separador de miles ni ceros de más ("33333,33", "30000", "0,5"). */
export function formatFieldAmount(amount: Decimal): string {
  return amount.toDecimalPlaces(2, Decimal.ROUND_DOWN).toFixed().replace('.', ',')
}

/** Resumen a mostrar bajo la sección: el de US-34 con una persona; con dos o más, la suma y las personas. */
export function sharedDebtsSummary(debts: readonly SharedDebt[], expenseAmount: Decimal, currency: Currency): string {
  if (debts.length === 1) return sharedDebtSummary(debts[0], expenseAmount, currency)
  const sum = sumOf(debts)
  return `Te van a deber ${formatIn(currency, sum)} entre ${debts.length} personas · Tu parte: ${formatIn(currency, expenseAmount.minus(sum))}`
}

/** El resumen espera a que todas las filas y el gasto sean válidos; sin eso, null. */
export function sharedDebtPreview(rows: readonly SharedDebtInput[], expenseAmount: string, currency: Currency): string | null {
  const debts = debtsOfDraft({ type: 'expense', shared: rows })
  const total = tryParseMoney(expenseAmount)
  return debts && total ? sharedDebtsSummary(debts, total, currency) : null
}

/** "Sofía te va a deber $60.000,00 · Tu parte: $60.000,00", en la moneda del gasto. */
export function sharedDebtSummary(debt: SharedDebt, expenseAmount: Decimal, currency: Currency): string {
  return `${debt.person} te va a deber ${formatIn(currency, debt.amount)} · Tu parte: ${formatIn(
    currency,
    expenseAmount.minus(debt.amount),
  )}`
}

/** Descripción del aviso "Gasto guardado": "Sofía te debe $60.000,00"; con varias, "Juan y Sofía te deben $80.000,00". */
export function sharedDebtSavedMessage(debts: readonly SharedDebt[], currency: Currency): string {
  if (debts.length === 1) return `${debts[0].person} te debe ${formatIn(currency, debts[0].amount)}`
  return `${joinNames(debts.map((d) => d.person))} te deben ${formatIn(currency, sumOf(debts))}`
}

/**
 * Etiqueta de la fila de un gasto compartido en Movimientos y en el Resumen (US-35, US-82):
 * "Compartido con Sofía", "Compartido con Juan y Sofía" y, con tres o más, "Compartido con Ana y 2 más".
 */
export function sharedExpenseLabel(people: readonly string[]): string {
  const sorted = [...people].sort(comparePeople)
  if (sorted.length <= 2) return `Compartido con ${joinNames(sorted)}`
  return `Compartido con ${sorted[0]} y ${sorted.length - 1} más`
}

/**
 * Línea del diálogo de borrado de un gasto con deudas vinculadas (US-35, ADR-037 §4): las deudas dejan
 * de contar mientras el gasto esté eliminado. Los montos van en la moneda del gasto, que es la de las deudas.
 */
export function deletionDebtWarning(debts: readonly SharedDebt[], currency: Currency): string {
  if (debts.length === 1) return `También deja de contar la deuda con ${debts[0].person} por ${formatIn(currency, debts[0].amount)}.`
  return `También dejan de contar las deudas con ${joinNames(debts.map((d) => d.person))} por ${formatIn(currency, sumOf(debts))} en total.`
}
