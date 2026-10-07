import type { Currency } from './fx'
import { Decimal, formatArs, formatUsd, parseMoney } from './money'
import { formatDisplayDate } from './period'

export type DebtDirection = 'owed_to_me' | 'i_owe'
export type DebtStatus = 'pending' | 'settled'
/** Filtro de la pantalla Deudas (US-38): vive en `?status=` (C11). */
export type DebtStatusFilter = DebtStatus | 'all'

/**
 * Una deuda como llega de la base. Los montos son string: PostgREST devuelve `numeric` así y no
 * se pasan por `number` (C2). `linkedTransactionDeleted` es la baja lógica del gasto de origen, o
 * false si la deuda es suelta.
 */
export interface DebtRecord {
  id: string
  person: string
  direction: DebtDirection
  amount: string
  amountArs: string
  currency: Currency
  incurredOn: string // YYYY-MM-DD
  notes: string | null
  status: DebtStatus
  settledAt: string | null // timestamptz
  createdAt: string // timestamptz
  transactionId: string | null
  linkedTransactionDeleted: boolean
  /** El gasto de origen (US-35), o null si la deuda es suelta. */
  origin: DebtOrigin | null
}

/** Lo que se muestra del gasto de origen: el total de la compra en su moneda, no la cuota. */
export interface DebtOrigin {
  categoryName: string | null
  amount: string
  currency: Currency
  occurredOn: string // YYYY-MM-DD
}

/** Sin parámetro o con uno desconocido, "Pendientes" (US-38 CA-1, CA-4). */
export function parseDebtStatusFilter(value: string | null): DebtStatusFilter {
  return value === 'settled' || value === 'all' ? value : 'pending'
}

/**
 * ADR-037 §4: una deuda vinculada a un gasto con baja lógica no aparece; al restaurar el gasto
 * vuelve con el estado que tenía. Es I10 extendida a lo que nace de una transacción.
 */
export function isVisibleDebt(debt: DebtRecord): boolean {
  return !debt.linkedTransactionDeleted
}

/**
 * Las deudas visibles del filtro, ordenadas (US-38): "Pendientes" y "Todas" por `incurred_on` y, a
 * igual fecha, por `created_at`; "Saldadas" por `settled_at`. Siempre la más reciente primero.
 */
export function debtsForFilter(debts: readonly DebtRecord[], filter: DebtStatusFilter): DebtRecord[] {
  const shown = debts.filter((d) => isVisibleDebt(d) && (filter === 'all' || d.status === filter))
  const byLoaded = (a: DebtRecord, b: DebtRecord) => instantMs(b.createdAt) - instantMs(a.createdAt)
  if (filter === 'settled') {
    return shown.sort((a, b) => instantMs(b.settledAt) - instantMs(a.settledAt) || byLoaded(a, b))
  }
  // YYYY-MM-DD ordena bien como texto.
  return shown.sort((a, b) => b.incurredOn.localeCompare(a.incurredOn) || byLoaded(a, b))
}

/**
 * Milisegundos de un timestamptz de Postgres. Trae microsegundos ("…:30.123456+00:00"), que Date
 * no garantiza leer en todos los navegadores: se recorta la fracción a milisegundos.
 */
function instantMs(timestamp: string | null): number {
  if (!timestamp) return 0
  return Date.parse(timestamp.replace(' ', 'T').replace(/(\.\d{3})\d+/, '$1'))
}

const ARGENTINA_DATE = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Argentina/Buenos_Aires',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

/** Día calendario en Argentina de un timestamptz (ADR-021), como YYYY-MM-DD. */
export function argentinaDateOf(timestamp: string): string {
  return ARGENTINA_DATE.format(new Date(instantMs(timestamp)))
}

/** Textos de una fila de la lista (US-38), con los formatos de las convenciones de la feature. */
export interface DebtRowText {
  person: string
  direction: string
  amount: string
  /** "≈ $50.000,00", solo si la deuda es en US$. */
  amountArs: string | null
  date: string
  /** "Gasto compartido: Tecnología, $120.000,00 del 15/08/2026" o "Deuda suelta" (US-35). */
  origin: string
  notes: string | null
  status: string
}

export function debtRowText(debt: DebtRecord): DebtRowText {
  const amount = parseMoney(debt.amount)
  return {
    person: debt.person,
    direction: debt.direction === 'owed_to_me' ? 'Te debe' : 'Le debés',
    amount: debt.currency === 'USD' ? formatUsd(amount) : formatArs(amount),
    amountArs: debt.currency === 'USD' ? `≈ ${formatArs(parseMoney(debt.amountArs))}` : null,
    date: formatDisplayDate(debt.incurredOn),
    origin: debtOriginText(debt.origin),
    notes: debt.notes,
    status:
      debt.status === 'settled' && debt.settledAt
        ? `Saldada el ${formatDisplayDate(argentinaDateOf(debt.settledAt))}`
        : 'Pendiente',
  }
}

/**
 * Línea de origen de la fila (US-35). Una categoría archivada se muestra con su nombre igual; un
 * gasto siempre tiene categoría (I8), así que sin nombre solo queda monto y fecha.
 */
export function debtOriginText(origin: DebtOrigin | null): string {
  if (!origin) return 'Deuda suelta'
  const amount = parseMoney(origin.amount)
  const total = origin.currency === 'USD' ? formatUsd(amount) : formatArs(amount)
  const what = origin.categoryName ? `${origin.categoryName}, ${total}` : total
  return `Gasto compartido: ${what} del ${formatDisplayDate(origin.occurredOn)}`
}

/**
 * Totales de Deudas (US-37, ADR-037 §5): solo pendientes y visibles, en pesos con el `amount_ars`
 * congelado de cada deuda (C5). No dependen del filtro de la lista.
 */
export interface DebtTotals {
  owedToMe: Decimal
  iOwe: Decimal
  /** "Te deben" − "Debés". */
  net: Decimal
}

export function debtTotals(debts: readonly DebtRecord[]): DebtTotals {
  let owedToMe = new Decimal(0)
  let iOwe = new Decimal(0)
  for (const d of debts) {
    if (d.status !== 'pending' || !isVisibleDebt(d)) continue
    const ars = parseMoney(d.amountArs)
    if (d.direction === 'owed_to_me') owedToMe = owedToMe.plus(ars)
    else iOwe = iOwe.plus(ars)
  }
  return { owedToMe, iOwe, net: owedToMe.minus(iOwe) }
}

/** "A tu favor $95.000,00", "En contra $5.000,00" (sin signo) o "En cero" (US-37). */
export function debtNetText(net: Decimal): string {
  if (net.isZero()) return 'En cero'
  return `${net.isPositive() ? 'A tu favor' : 'En contra'} ${formatArs(net.abs())}`
}

/** Aviso de éxito al saldar (US-39). */
export function settledNoticeText(person: string): string {
  return `Deuda con ${person} saldada`
}

/**
 * Motivo del aviso "No se pudo actualizar la deuda": el mensaje de Postgres, que ya viene en español.
 * Un error sin código (la red, "TypeError: Failed to fetch") no lo es: se muestra uno genérico.
 */
export function debtUpdateErrorReason(error: unknown): string {
  const { code, message } = (typeof error === 'object' && error !== null ? error : {}) as { code?: string; message?: string }
  return code && message ? message : 'Probá de nuevo en un momento'
}

/**
 * Rechazos que dicen que la lista quedó vieja (otra pestaña la saldó, o se eliminó su gasto): además
 * del aviso se vuelven a pedir la lista y los totales (US-39).
 */
export function isStaleDebtError(reason: string): boolean {
  return reason === 'La deuda ya está saldada' || reason === 'La deuda no existe'
}

/** Mensaje del estado vacío de cada filtro (US-38), y si ofrece "Cargar una deuda". */
export function emptyDebtsMessage(filter: DebtStatusFilter): { message: string; offerNew: boolean } {
  switch (filter) {
    case 'pending':
      return { message: 'No tenés deudas pendientes.', offerNew: true }
    case 'settled':
      return { message: 'Todavía no saldaste ninguna deuda.', offerNew: false }
    case 'all':
      return { message: 'No cargaste ninguna deuda todavía.', offerNew: true }
  }
}
