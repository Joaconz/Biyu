// Importar desde Excel (US-76): interpretar y validar cada fila (§2 y §4 de
// entrega-2/historias/importar-excel.md) y resumir el paso 2. Es validación de experiencia de uso:
// la base revalida cada fila al importar (C6). Las reglas son las del alta manual y se reusan de
// validation.ts, money.ts y fx.ts; los mensajes son propios de la importación porque nombran la
// columna de la planilla.
import { MAX_FX_RATE, type Currency } from './fx'
import { cellAsText, cleanText, isBlankCell, type ImportRow, type SheetCell } from './importFile'
import { convertToArs, Decimal, formatArs, formatRate, formatUsd, tryParseMoney } from './money'
import { formatDisplayDate, isValidIsoDate } from './period'
import { allowsInstallments, hasEmptyInstallment, MAX_AMOUNT, MAX_INSTALLMENTS, type TransactionDraft } from './validation'

/** Categorías y cuentas **activas** del usuario, contra las que se buscan los nombres. */
export interface ImportCatalog {
  categories: { id: string; name: string }[]
  accounts: { id: string; name: string; type: AccountType }[]
}

type AccountType = NonNullable<TransactionDraft['accountType']>

/** Lo que se manda a la base por cada fila "Lista". Montos en Decimal (C2). */
export interface ImportTransaction {
  type: 'expense' | 'income'
  amount: Decimal
  currency: Currency
  fxRate: Decimal | null
  categoryId: string | null
  accountId: string
  installmentsCount: number
  occurredOn: string // YYYY-MM-DD
  description: string | null
}

/** Lo que muestra la tarjeta de la fila (§1). Una celda que no se pudo interpretar, con su texto. */
export interface RowCard {
  date: string
  type: string
  amount: string
  category: string
  account: string
  /** "TC 1.450,00", solo en USD con un tipo de cambio válido. */
  fxRate: string | null
  /** "3 cuotas", solo si hay más de una. */
  installments: string | null
}

export type ReviewedRow =
  | { rowNumber: number; status: 'ready'; card: RowCard; transaction: ImportTransaction; amountArs: Decimal }
  | { rowNumber: number; status: 'error'; card: RowCard; errors: string[] }

type Column = 'date' | 'type' | 'amount' | 'currency' | 'fxRate' | 'category' | 'account' | 'installments'

/** Las reglas de §4 con su columna, en el orden de la tabla: los mensajes salen en este orden (CA-3). */
const RULE_TABLE = [
  ['F1', 'date'], ['F2', 'date'], ['F3', 'date'],
  ['F4', 'type'], ['F5', 'type'],
  ['F6', 'amount'], ['F7', 'amount'], ['F8', 'amount'], ['F9', 'amount'], ['F10', 'amount'],
  ['F11', 'currency'], ['F12', 'currency'],
  ['F13a', 'fxRate'], ['F13b', 'fxRate'], ['F13c', 'fxRate'], ['F13d', 'fxRate'], ['F13e', 'fxRate'],
  ['F14a', 'category'], ['F14b', 'category'],
  ['F14c', 'account'], ['F14d', 'account'],
  ['F14e', 'installments'], ['F15', 'installments'],
  ['F16', 'amount'], ['F17', 'installments'], ['F18', 'amount'],
] as const satisfies readonly (readonly [string, Column])[]
type Rule = (typeof RULE_TABLE)[number][0]
const RULE_COLUMN = Object.fromEntries(RULE_TABLE) as Record<Rule, Column>
const RULE_ORDER = RULE_TABLE.map(([rule]) => rule) as Rule[]

/** Mensajes exactos de §4. `value` es el texto recortado de la celda (F14b, F14d). */
export function ruleMessage(rule: Rule, value = ''): string {
  switch (rule) {
    case 'F1': return 'Falta la fecha'
    case 'F2': return 'Fecha inválida: usá DD/MM/AAAA'
    case 'F3': return 'La fecha no puede ser futura'
    case 'F4': return 'Falta el tipo'
    case 'F5': return 'Tipo inválido: escribí Gasto o Ingreso'
    case 'F6': return 'Falta el monto'
    case 'F7': return 'Monto inválido: usá un número, por ejemplo 1234,56'
    case 'F8': return 'El monto debe ser mayor a cero'
    case 'F9': return 'El monto admite hasta 2 decimales'
    case 'F10': return `El monto máximo es ${formatArs(MAX_AMOUNT)}`
    case 'F11': return 'Falta la moneda'
    case 'F12': return 'Moneda inválida: escribí ARS o USD'
    case 'F13a': return 'Falta el tipo de cambio'
    case 'F13b': return 'Una transacción en ARS no lleva tipo de cambio'
    case 'F13c': return 'Tipo de cambio inválido: usá un número mayor a cero'
    case 'F13d': return 'Usá hasta 4 decimales en el tipo de cambio'
    case 'F13e': return 'El tipo de cambio es demasiado grande'
    case 'F14a': return 'Falta la categoría (es obligatoria en un gasto)'
    case 'F14b': return `No existe la categoría «${value}» o está archivada`
    case 'F14c': return 'Falta la cuenta'
    case 'F14d': return `No existe la cuenta «${value}» o está archivada`
    case 'F14e': return `Las cuotas van de 1 a ${MAX_INSTALLMENTS}`
    case 'F15': return 'Solo los gastos con tarjeta de crédito admiten cuotas'
    case 'F16': return `En pesos daría más que el máximo de ${formatArs(MAX_AMOUNT)}`
    case 'F17': return 'Con ese monto, cada cuota daría menos de 0,01'
    case 'F18': return 'En pesos daría menos de $0,01. Revisá el monto o el tipo de cambio'
  }
}

/**
 * Número de una celda (§2, "Celdas numéricas y C2"). Una celda numérica trae el binario de punto
 * flotante de Excel (`=0,1*3` guarda 0.30000000000000004): se redondea a 15 dígitos significativos,
 * la precisión que muestra Excel, y recién ahí es un Decimal. Un texto sigue el criterio del monto
 * de Registrar (`tryParseMoney`: "1.500" es mil quinientos). Nunca pasa por `number`.
 */
export function cellNumber(cell: SheetCell): Decimal | null {
  if (cell.kind === 'number') {
    try {
      const value = new Decimal(cell.text.trim())
      return value.isFinite() ? value.toSignificantDigits(15, Decimal.ROUND_HALF_UP) : null
    } catch {
      return null
    }
  }
  if (cell.kind === 'text') return tryParseMoney(cleanText(cell.text))
  return null
}

const TEXT_DATE_RE = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/

/** Fecha de la fila: celda de fecha de Excel o texto DD/MM/AAAA. Un número sin formato de fecha no es fecha (F2). */
export function cellDate(cell: SheetCell): string | null {
  if (cell.kind === 'date') return isValidIsoDate(cell.date) ? cell.date : null
  if (cell.kind !== 'text') return null
  const match = TEXT_DATE_RE.exec(cleanText(cell.text))
  if (!match) return null
  const iso = `${match[3]}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}`
  return isValidIsoDate(iso) ? iso : null
}

/** Nombre comparable de categoría o cuenta: sin mayúsculas ni espacios en los bordes, con tildes (§2). */
function nameKey(text: string): string {
  return cleanText(text).toLowerCase()
}

function findByName<T extends { name: string }>(items: readonly T[], text: string): T | undefined {
  const key = nameKey(text)
  return items.find((item) => nameKey(item.name) === key)
}

/**
 * Valida una fila contra el catálogo activo y `today` (YYYY-MM-DD, el día de Argentina: ADR-021).
 * Evalúa las reglas en el orden de la tabla de §4, con a lo sumo un mensaje por columna y las
 * dependencias de su tabla: una regla que mira otra columna solo corre si esa columna no tuvo error.
 */
export function reviewRow(row: ImportRow, catalog: ImportCatalog, today: string): ReviewedRow {
  const { cells } = row
  const failed = new Map<Column, { rule: Rule; value?: string }>()
  const fail = (rule: Rule, value?: string) => {
    if (!failed.has(RULE_COLUMN[rule])) failed.set(RULE_COLUMN[rule], { rule, value })
  }
  const ok = (...columns: Column[]) => columns.every((c) => !failed.has(c))

  // Fecha: F1–F3.
  const occurredOn = cellDate(cells.date)
  if (isBlankCell(cells.date)) fail('F1')
  else if (!occurredOn) fail('F2')
  else if (occurredOn > today) fail('F3')

  // Tipo: F4–F5.
  const typeText = cells.type.kind === 'text' ? nameKey(cells.type.text) : null
  const type = typeText === 'gasto' ? 'expense' : typeText === 'ingreso' ? 'income' : null
  if (isBlankCell(cells.type)) fail('F4')
  else if (!type) fail('F5')

  // Monto: F6–F10.
  const amount = cellNumber(cells.amount)
  if (isBlankCell(cells.amount)) fail('F6')
  else if (!amount) fail('F7')
  else if (amount.lte(0)) fail('F8')
  else if (amount.decimalPlaces() > 2) fail('F9')
  else if (amount.gt(MAX_AMOUNT)) fail('F10')

  // Moneda: F11–F12.
  const currencyText = cells.currency.kind === 'text' ? cleanText(cells.currency.text).toUpperCase() : null
  const currency: Currency | null = currencyText === 'ARS' || currencyText === 'USD' ? currencyText : null
  if (isBlankCell(cells.currency)) fail('F11')
  else if (!currency) fail('F12')

  // Tipo de cambio: F13a–F13e, solo con una moneda válida (I5, DEF-018).
  const fxBlank = isBlankCell(cells.fxRate)
  const fxRate = fxBlank ? null : cellNumber(cells.fxRate)
  if (ok('currency') && currency === 'USD') {
    if (fxBlank) fail('F13a')
    else if (!fxRate || fxRate.lte(0)) fail('F13c')
    else if (fxRate.decimalPlaces() > 4) fail('F13d')
    else if (fxRate.gt(MAX_FX_RATE)) fail('F13e')
  } else if (ok('currency') && currency === 'ARS' && !fxBlank) {
    fail('F13b')
  }

  // Categoría: F14a (con un tipo válido, I8) y F14b.
  const categoryText = cellAsText(cells.category)
  const category = categoryText ? findByName(catalog.categories, categoryText) : undefined
  if (!categoryText) {
    if (ok('type') && type === 'expense') fail('F14a')
  } else if (!category) {
    fail('F14b', categoryText)
  }

  // Cuenta: F14c–F14d.
  const accountText = cellAsText(cells.account)
  const account = accountText ? findByName(catalog.accounts, accountText) : undefined
  if (!accountText) fail('F14c')
  else if (!account) fail('F14d', accountText)

  // Cuotas: F14e y F15 (I6).
  const installments = isBlankCell(cells.installments) ? new Decimal(1) : cellNumber(cells.installments)
  const installmentsCount =
    installments && installments.isInteger() && installments.gte(1) && installments.lte(MAX_INSTALLMENTS)
      ? installments.toNumber()
      : null
  if (installmentsCount === null) fail('F14e')
  else if (
    ok('type', 'account') &&
    installmentsCount > 1 &&
    !allowsInstallments({ type: type!, accountType: account!.type })
  ) {
    fail('F15')
  }

  // Equivalente en pesos y cuota mínima: F16, F17 y F18 (DEF-012, DEF-013, I4, ADR-013).
  if (ok('amount', 'currency', 'fxRate') && amount && currency) {
    const draft = { amount, currency, fxRate: currency === 'USD' ? fxRate : null }
    if (currency === 'USD' && convertToArs(amount, draft.fxRate).gt(MAX_AMOUNT)) fail('F16')
    else if (ok('installments') && installmentsCount && hasEmptyInstallment({ ...draft, installmentsCount })) {
      fail(installmentsCount > 1 ? 'F17' : 'F18')
    }
  }

  // La tarjeta muestra un monto o un TC formateado solo si se pudo interpretar sin error; si no, el
  // texto de la celda (§1): "10,555" no se muestra como "$10,56" al lado de F9.
  const card = buildCard(cells, {
    occurredOn,
    type,
    amount: ok('amount') ? amount : null,
    currency,
    fxRate: ok('fxRate') ? fxRate : null,
    installmentsCount,
  })
  if (failed.size > 0) {
    const errors = RULE_ORDER.filter((rule) => failed.get(RULE_COLUMN[rule])?.rule === rule).map((rule) =>
      ruleMessage(rule, failed.get(RULE_COLUMN[rule])!.value),
    )
    return { rowNumber: row.rowNumber, status: 'error', card, errors }
  }

  const transaction: ImportTransaction = {
    type: type!,
    amount: amount!,
    currency: currency!,
    fxRate: currency === 'USD' ? fxRate : null,
    categoryId: category?.id ?? null,
    accountId: account!.id,
    installmentsCount: installmentsCount!,
    occurredOn: occurredOn!,
    description: cellAsText(cells.note) || null,
  }
  return {
    rowNumber: row.rowNumber,
    status: 'ready',
    card,
    transaction,
    // ADR-013: el monto total en pesos, half-up a 2 decimales (igual que la columna amount_ars).
    amountArs: convertToArs(transaction.amount, transaction.fxRate),
  }
}

function buildCard(
  cells: ImportRow['cells'],
  parsed: {
    occurredOn: string | null
    type: 'expense' | 'income' | null
    amount: Decimal | null
    currency: Currency | null
    fxRate: Decimal | null
    installmentsCount: number | null
  },
): RowCard {
  const { occurredOn, type, amount, currency, fxRate, installmentsCount } = parsed
  return {
    date: occurredOn ? formatDisplayDate(occurredOn) : cellAsText(cells.date),
    type: type === 'expense' ? 'Gasto' : type === 'income' ? 'Ingreso' : cellAsText(cells.type),
    amount: amount && currency ? (currency === 'USD' ? formatUsd(amount) : formatArs(amount)) : cellAsText(cells.amount),
    category: cellAsText(cells.category),
    account: cellAsText(cells.account),
    fxRate: currency === 'USD' && fxRate ? `TC ${formatRate(fxRate)}` : null,
    installments: installmentsCount && installmentsCount > 1 ? `${installmentsCount} cuotas` : null,
  }
}

export interface ImportReview {
  rows: ReviewedRow[]
  /** T, N y M de §1: T = N + M. */
  total: number
  ready: number
  withErrors: number
  /** Suma en pesos de las filas "Lista": el monto total de cada transacción, no lo que imputa a un mes. */
  expensesArs: Decimal
  incomeArs: Decimal
}

export function reviewRows(rows: readonly ImportRow[], catalog: ImportCatalog, today: string): ImportReview {
  const reviewed = rows.map((row) => reviewRow(row, catalog, today))
  return { rows: reviewed, total: reviewed.length, ...summarize(reviewed) }
}

/** N, M y las sumas en pesos de un conjunto de filas (paso 2, y en US-77 las K creadas). */
export function summarize(rows: readonly ReviewedRow[]) {
  let expensesArs = new Decimal(0)
  let incomeArs = new Decimal(0)
  for (const row of rows) {
    if (row.status !== 'ready') continue
    if (row.transaction.type === 'expense') expensesArs = expensesArs.plus(row.amountArs)
    else incomeArs = incomeArs.plus(row.amountArs)
  }
  const ready = rows.filter((r) => r.status === 'ready').length
  return { ready, withErrors: rows.length - ready, expensesArs, incomeArs }
}

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`

/** "11 filas leídas · 7 listas para importar · 4 con error" (§1, con los singulares de "Plurales"). */
export function readSummaryText({ total, ready, withErrors }: Pick<ImportReview, 'total' | 'ready' | 'withErrors'>): string {
  return `${plural(total, 'fila leída', 'filas leídas')} · ${plural(ready, 'lista para importar', 'listas para importar')} · ${withErrors} con error`
}

/** "$G en gastos y $I en ingresos (en pesos)." — el paso 2 y el paso 3 comparten este final. */
export function amountsText(expensesArs: Decimal, incomeArs: Decimal): string {
  return `${formatArs(expensesArs)} en gastos y ${formatArs(incomeArs)} en ingresos (en pesos).`
}

/** "Vas a importar 7 movimientos: $324.915,50 en gastos y $850.000,00 en ingresos (en pesos)." */
export function toImportText(review: Pick<ImportReview, 'ready' | 'expensesArs' | 'incomeArs'>): string {
  return `Vas a importar ${plural(review.ready, 'movimiento', 'movimientos')}: ${amountsText(review.expensesArs, review.incomeArs)}`
}

/** "Importar 7 movimientos" / "Importar 1 movimiento". */
export function submitLabel(ready: number): string {
  return `Importar ${plural(ready, 'movimiento', 'movimientos')}`
}
