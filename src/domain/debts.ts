import { comparePeople } from './sharedDebt'
import type { Currency } from './fx'
import { Decimal, formatArs, formatUsd, parseMoney } from './money'
import { formatDisplayDate, formatPeriodLong, periodOf } from './period'

export type DebtDirection = 'owed_to_me' | 'i_owe'
export type DebtStatus = 'pending' | 'settled'
/** Filtro de la pantalla Deudas (US-38): vive en `?status=` (C11). */
export type DebtStatusFilter = DebtStatus | 'all'
/** Filtro por dirección (US-79): vive en `?direction=` y se combina con el de estado (C11). */
export type DebtDirectionFilter = DebtDirection | 'all'

/**
 * Una deuda como llega de la base. Los montos son string: `src/lib/debts.ts` los pide con `::text`
 * (sin el cast PostgREST los manda como número JSON) y no se pasan por `number` (C2).
 * `linkedTransactionDeleted` es la baja lógica del gasto de origen, o false si la deuda es suelta.
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

/** Sin parámetro o con uno desconocido, "Todas" (US-79 CA-1, CA-4). */
export function parseDebtDirectionFilter(value: string | null): DebtDirectionFilter {
  return value === 'owed_to_me' || value === 'i_owe' ? value : 'all'
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
 * igual fecha, por `created_at`; "Saldadas" por `settled_at`. Siempre la más reciente primero. La
 * dirección (US-79) solo saca filas: el orden es el del estado.
 */
export function debtsForFilter(
  debts: readonly DebtRecord[],
  filter: DebtStatusFilter,
  direction: DebtDirectionFilter = 'all',
): DebtRecord[] {
  const shown = debts.filter(
    (d) =>
      isVisibleDebt(d) &&
      (filter === 'all' || d.status === filter) &&
      (direction === 'all' || d.direction === direction),
  )
  // A igual fecha y `created_at` (las deudas de un mismo gasto comparten ambos, ADR-040 §5), por persona y
  // después por id: el orden no depende del orden en que la base devuelva las filas.
  const byLoaded = (a: DebtRecord, b: DebtRecord) =>
    instantMs(b.createdAt) - instantMs(a.createdAt) || comparePeople(a.person, b.person) || a.id.localeCompare(b.id)
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

/**
 * US-91: la clave con que dos nombres son la misma persona. Ignora mayúsculas, tildes y espacios de
 * más: " Juán  Pérez" y "juan perez" dan la misma clave. No cambia lo guardado: cada deuda conserva el
 * nombre como se escribió.
 */
export function personKey(person: string): string {
  return person.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/\s+/g, ' ').trim()
}

/** Neto de un grupo en una moneda: lo que te deben menos lo que debés, sin convertir entre monedas. */
export interface DebtGroupNet {
  currency: Currency
  net: Decimal
}

/** Una persona con dos o más deudas visibles en el filtro (US-91). */
export interface DebtGroup {
  /** `personKey` de la persona. */
  key: string
  /** El nombre de la deuda más reciente del grupo, tal como se escribió. */
  name: string
  debts: DebtRecord[]
  /** Del neto cuentan solo las deudas pendientes del grupo. ARS primero; solo las monedas que hay. */
  nets: DebtGroupNet[]
  /** Cuántas de las deudas del grupo están pendientes. */
  pendingCount: number
}

/** Lo que se dibuja en la lista: una fila común (persona con una sola deuda) o un grupo plegable. */
export type DebtListEntry = { kind: 'debt'; debt: DebtRecord } | { kind: 'group'; group: DebtGroup }

/**
 * US-91: agrupa por persona las deudas que ya pasaron por `debtsForFilter` (visibles, del filtro y
 * ordenadas con la más reciente primero). Una persona con una sola deuda queda como fila común, con
 * dos o más forma un grupo. Los grupos y las filas conservan el orden de la lista: cada persona va
 * donde está su deuda más reciente.
 */
export function groupDebtsByPerson(debts: readonly DebtRecord[]): DebtListEntry[] {
  const byKey = new Map<string, DebtRecord[]>()
  for (const d of debts) {
    const key = personKey(d.person)
    byKey.set(key, [...(byKey.get(key) ?? []), d])
  }
  const entries: DebtListEntry[] = []
  const seen = new Set<string>()
  for (const d of debts) {
    const key = personKey(d.person)
    if (seen.has(key)) continue
    seen.add(key)
    const own = byKey.get(key)!
    if (own.length === 1) {
      entries.push({ kind: 'debt', debt: d })
      continue
    }
    const latest = own.reduce((a, b) => (instantMs(b.createdAt) > instantMs(a.createdAt) ? b : a))
    entries.push({ kind: 'group', group: { key, name: latest.person, debts: own, ...groupNets(own) } })
  }
  return entries
}

function groupNets(debts: readonly DebtRecord[]): { nets: DebtGroupNet[]; pendingCount: number } {
  const byCurrency = new Map<Currency, Decimal>()
  let pendingCount = 0
  for (const d of debts) {
    if (d.status !== 'pending') continue
    pendingCount++
    const amount = parseMoney(d.amount)
    const signed = d.direction === 'owed_to_me' ? amount : amount.negated()
    byCurrency.set(d.currency, (byCurrency.get(d.currency) ?? new Decimal(0)).plus(signed))
  }
  const nets = (['ARS', 'USD'] as const).flatMap((currency) => {
    const net = byCurrency.get(currency)
    return net ? [{ currency, net }] : []
  })
  return { nets, pendingCount }
}

/** "Te deben $95.000,00", "Le debés US$20,00" o "En cero" de un neto en su moneda (US-91). */
export function groupNetText({ currency, net }: DebtGroupNet): string {
  if (net.isZero()) return 'En cero'
  const amount = currency === 'USD' ? formatUsd(net.abs()) : formatArs(net.abs())
  return `${net.isPositive() ? 'Te debe' : 'Le debés'} ${amount}`
}

/** Resumen de un grupo plegado: "3 deudas" o "3 deudas, 1 pendiente" cuando se ven saldadas (US-91). */
export function groupCountText(group: DebtGroup): string {
  const total = `${group.debts.length} deudas`
  if (group.pendingCount === group.debts.length) return total
  return `${total}, ${group.pendingCount === 0 ? 'ninguna pendiente' : `${group.pendingCount} ${group.pendingCount === 1 ? 'pendiente' : 'pendientes'}`}`
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

/** Aviso de éxito al volver a pendiente (US-40). */
export function reopenedNoticeText(person: string): string {
  return `La deuda con ${person} volvió a pendiente`
}

/**
 * Rechazos que dicen que la lista quedó vieja (otra pestaña ya hizo el cambio, o se eliminó el gasto):
 * además del aviso se vuelven a pedir la lista y los totales (US-39, US-40).
 */
export function isStaleDebtError(reason: string, action: 'settle' | 'reopen'): boolean {
  const already = action === 'settle' ? 'La deuda ya está saldada' : 'La deuda ya está pendiente'
  return reason === already || reason === 'La deuda no existe'
}

const EMPTY_BY_DIRECTION: Record<DebtDirection, Record<DebtStatusFilter, string>> = {
  owed_to_me: {
    pending: 'Nadie te debe nada por ahora.',
    settled: 'Todavía no te saldaron ninguna deuda.',
    all: 'No cargaste deudas a tu favor.',
  },
  i_owe: {
    pending: 'No debés nada por ahora.',
    settled: 'Todavía no saldaste ninguna deuda tuya.',
    all: 'No cargaste deudas que debas.',
  },
}

/**
 * Mensaje del estado vacío de cada combinación de filtros (US-38, US-79), y si ofrece "Cargar una
 * deuda": solo con "Pendientes" o "Todas" en estado, cualquiera sea la dirección.
 */
export function emptyDebtsMessage(
  filter: DebtStatusFilter,
  direction: DebtDirectionFilter = 'all',
): { message: string; offerNew: boolean } {
  if (direction !== 'all') return { message: EMPTY_BY_DIRECTION[direction][filter], offerNew: filter !== 'settled' }
  switch (filter) {
    case 'pending':
      return { message: 'No tenés deudas pendientes.', offerNew: true }
    case 'settled':
      return { message: 'Todavía no saldaste ninguna deuda.', offerNew: false }
    case 'all':
      return { message: 'No cargaste ninguna deuda todavía.', offerNew: true }
  }
}

/** Una línea de «qué se borra» en la confirmación de eliminar una deuda (US-87, US-94). */
export interface DebtDeletionItem {
  label: string
  value: string
}

/** Qué deuda se va a borrar: persona, dirección, monto, fecha y de dónde viene (US-87, US-94). */
export function debtDeletionSummary(debt: DebtRecord): DebtDeletionItem[] {
  const text = debtRowText(debt)
  return [
    { label: 'Persona', value: text.person },
    { label: 'Dirección', value: text.direction },
    { label: 'Monto', value: text.amountArs ? `${text.amount} (${text.amountArs})` : text.amount },
    { label: 'Fecha', value: text.date },
    { label: 'Origen', value: debt.origin ? 'Gasto compartido' : 'Deuda suelta' },
  ]
}

/** Lo que cambia al borrar una deuda pendiente (US-87): el total de su dirección y, si es suelta, el balance del mes. */
export interface DebtDeletionEffect {
  /** «Me deben» o «Debo». */
  totalLabel: string
  before: Decimal
  after: Decimal
  /** Solo una deuda suelta mueve el balance (ADR-041 §4): «El balance de octubre de 2026 baja $20.000,00». */
  balanceNote: string | null
  /** Una deuda de gasto compartido deja el gasto como gasto normal (ADR-044 §3). */
  keepsExpense: boolean
}

/**
 * Calcula el efecto de borrar `debt` sobre los totales de Deudas (US-37) y el balance del mes (ADR-041).
 * Una pendiente solo tiene el evento «alta»: al borrarla, el balance de ese mes sube si la prestó el usuario
 * (`owed_to_me`: dejó de salir plata) y baja si se la prestaron (`i_owe`: dejó de entrar).
 */
export function debtDeletionEffect(debt: DebtRecord, all: readonly DebtRecord[]): DebtDeletionEffect {
  const before = debtTotals(all)
  const after = debtTotals(all.filter((d) => d.id !== debt.id))
  const owed = debt.direction === 'owed_to_me'
  const ars = parseMoney(debt.amountArs)
  const month = formatPeriodLong(periodOf(debt.incurredOn))
  return {
    totalLabel: owed ? 'Me deben' : 'Debo',
    before: owed ? before.owedToMe : before.iOwe,
    after: owed ? after.owedToMe : after.iOwe,
    balanceNote: debt.transactionId
      ? null
      : `El balance de ${month} ${owed ? 'sube' : 'baja'} ${formatArs(ars)}.`,
    keepsExpense: debt.transactionId !== null,
  }
}

/** Aviso de éxito al eliminar una deuda (US-87 CA-4). */
export function deletedNoticeText(person: string): string {
  return `Deuda con ${person} eliminada`
}
