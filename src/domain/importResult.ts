// Importar desde Excel (US-77): lo que se manda a import_transactions (ADR-035) y el paso 3 armado
// con su respuesta (§1 "Paso 3", §5 de entrega-2/historias/importar-excel.md).
import { amountsText, ruleMessage, summarize, type ImportReview, type ReviewedRow } from './importRows'
import { Decimal, serializeMoney } from './money'
import { formatPeriod, periodOf } from './period'

/** Un elemento de `p_rows` (contrato de ADR-035). Montos como texto (C2). */
export interface ImportPayloadRow {
  row: number
  type: 'expense' | 'income'
  amount: string
  currency: 'ARS' | 'USD'
  fx_rate: string | null
  category_id: string | null
  account_id: string
  installments_count: number
  occurred_on: string
  description: string | null
}

/** Solo las filas "Lista" van a la base (§5.1). */
export function importPayload(review: ImportReview): ImportPayloadRow[] {
  return review.rows.flatMap((row) => {
    if (row.status !== 'ready') return []
    const t = row.transaction
    return [
      {
        row: row.rowNumber,
        type: t.type,
        amount: serializeMoney(t.amount),
        currency: t.currency,
        fx_rate: t.fxRate ? serializeMoney(t.fxRate) : null,
        category_id: t.categoryId,
        account_id: t.accountId,
        installments_count: t.installmentsCount,
        occurred_on: t.occurredOn,
        description: t.description,
      },
    ]
  })
}

/** La respuesta de import_transactions, tal como la devuelve la base. */
export interface ImportResponse {
  import_id: string
  already_imported: boolean
  sent_rows: number
  imported_rows: number
  rows: (
    | { row: number; status: 'imported'; transaction_id: string }
    | { row: number; status: 'rejected'; error_code: string; error_message: string }
  )[]
}

/**
 * Mensaje de una fila que rechazó la base (§5.3). El texto de error de create_transaction es
 * contrato: lo fijan sus tests pgTAP.
 */
export function dbRejectionMessage(errorMessage: string, row: ReviewedRow): string {
  if (errorMessage.startsWith('la cuenta no existe, no es tuya o está archivada')) return ruleMessage('F14d', row.card.account)
  if (errorMessage.startsWith('la categoría no existe, no es tuya o está archivada')) return ruleMessage('F14b', row.card.category)
  if (errorMessage.startsWith('FR-06: la fecha no puede ser posterior a hoy')) return ruleMessage('F3')
  return `La base rechazó esta fila: ${errorMessage}`
}

export interface ImportResult {
  total: number
  imported: number
  expensesArs: Decimal
  incomeArs: Decimal
  /** Las filas no importadas, ordenadas por número de fila: las del paso 2 y las que rechazó la base. */
  notImported: { rowNumber: number; messages: string[] }[]
  /** `AAAA-MM` de la fecha más reciente entre las creadas; null si no se creó ninguna (§1). */
  period: string | null
  alreadyImported: boolean
}

/** Cruza la revisión del paso 2 con la respuesta de la base. T es el mismo del paso 2. */
export function buildImportResult(review: ImportReview, response: ImportResponse): ImportResult {
  // `rows` falta solo si la base devolviera un registro sin resultado: cada fila figura sin respuesta.
  const outcome = new Map((response.rows ?? []).map((r) => [r.row, r]))
  const created: ReviewedRow[] = []
  const notImported: ImportResult['notImported'] = []
  for (const row of review.rows) {
    if (row.status === 'error') {
      notImported.push({ rowNumber: row.rowNumber, messages: row.errors })
      continue
    }
    const answer = outcome.get(row.rowNumber)
    if (answer?.status === 'imported') created.push(row)
    else {
      const message = answer ? dbRejectionMessage(answer.error_message, row) : 'La base no devolvió el resultado de esta fila'
      notImported.push({ rowNumber: row.rowNumber, messages: [message] })
    }
  }
  const { expensesArs, incomeArs } = summarize(created)
  const lastDate = created.reduce<string | null>((max, row) => {
    const date = row.status === 'ready' ? row.transaction.occurredOn : null
    return date && (!max || date > max) ? date : max
  }, null)
  return {
    total: review.total,
    imported: created.length,
    expensesArs,
    incomeArs,
    notImported: notImported.sort((a, b) => a.rowNumber - b.rowNumber),
    period: lastDate ? formatPeriod(periodOf(lastDate)) : null,
    alreadyImported: response.already_imported,
  }
}

/** "Se importaron 7 de 11 filas." con los singulares de §1 ("Se importó 1 de…", "de 1 fila"). */
export function resultTitle({ imported, total }: Pick<ImportResult, 'imported' | 'total'>): string {
  const verb = imported === 1 ? 'Se importó' : 'Se importaron'
  return `${verb} ${imported} de ${total} ${total === 1 ? 'fila' : 'filas'}.`
}

export function resultAmountsText(result: Pick<ImportResult, 'expensesArs' | 'incomeArs'>): string {
  return amountsText(result.expensesArs, result.incomeArs)
}

/** "4 filas no se importaron:" / "1 fila no se importó:". */
export function notImportedHeading(count: number): string {
  return count === 1 ? '1 fila no se importó:' : `${count} filas no se importaron:`
}

/** "Fila 7: El monto debe ser mayor a cero"; varios mensajes, separados por " · ". */
export function notImportedLine({ rowNumber, messages }: ImportResult['notImported'][number]): string {
  return `Fila ${rowNumber}: ${messages.join(' · ')}`
}
