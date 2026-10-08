import {
  checkFileBeforeReading,
  readImportSheet,
  TEMPLATE_FILE_NAME,
  type FileError,
  type ImportSheet,
  type ReadSheetResult,
} from '@/domain/importFile'
import { reviewRows, type ImportCatalog, type ImportReview } from '@/domain/importRows'
import { toIsoDate } from '@/domain/period'
import { fetchActiveAccounts, fetchActiveCategories } from './catalog'
import { todayInArgentina } from './clock'

// La librería de .xlsx se carga recién acá, al elegir un archivo o bajar la plantilla (ADR-042).
const loadXlsx = () => import('./xlsx')

/** A1 y A2 sin abrir el archivo; A3 si no se puede leer como .xlsx; A4–A7 sobre la primera hoja (§3). */
export async function readImportFile(file: File): Promise<ReadSheetResult> {
  const before = checkFileBeforeReading(file)
  if (before) return { ok: false, error: before }
  const { readFirstSheet } = await loadXlsx().catch(() => {
    throw new ReaderLoadError()
  })
  let grid
  try {
    grid = await readFirstSheet(file)
  } catch {
    return { ok: false, error: { rule: 'A3' } }
  }
  return readImportSheet(grid)
}

/** Categorías y cuentas activas (RLS filtra por usuario, C7): las archivadas dan F14b y F14d. */
export async function fetchImportCatalog(): Promise<ImportCatalog> {
  const [categories, accounts] = await Promise.all([fetchActiveCategories(), fetchActiveAccounts()])
  return { categories, accounts }
}

/** No se pudieron leer las categorías y cuentas para validar las filas. */
export class CatalogError extends Error {}

/** No bajó el lector de .xlsx (sin conexión, o un deploy nuevo cambió el chunk): no es un error del archivo. */
export class ReaderLoadError extends Error {}

export type ReviewFileResult =
  | { ok: true; sheet: ImportSheet; review: ImportReview }
  | { ok: false; error: FileError }

/**
 * Paso 1 → paso 2: lee el archivo y valida cada fila contra el catálogo de ese momento y el hoy de
 * Argentina (ADR-021), el mismo que usa Registrar. No escribe nada. Si el catálogo no se puede leer,
 * la promesa se rechaza con CatalogError; si no baja el lector de .xlsx, con ReaderLoadError.
 */
export async function reviewImportFile(file: File): Promise<ReviewFileResult> {
  // El catálogo se pide mientras se lee el archivo; si el archivo se rechaza, se descarta.
  const catalogRequest = fetchImportCatalog()
  catalogRequest.catch(() => {})
  const read = await readImportFile(file)
  if (!read.ok) return read
  let catalog: ImportCatalog
  try {
    catalog = await catalogRequest
  } catch (error) {
    throw new CatalogError((error as { message?: string }).message ?? 'Error desconocido', { cause: error })
  }
  return { ok: true, sheet: read.sheet, review: reviewRows(read.sheet.rows, catalog, toIsoDate(todayInArgentina())) }
}

/** Genera la plantilla en el navegador y la descarga con su nombre fijo (§1). */
export async function downloadTemplate(): Promise<void> {
  const { buildTemplate } = await loadXlsx()
  const url = URL.createObjectURL(await buildTemplate())
  const link = document.createElement('a')
  link.href = url
  link.download = TEMPLATE_FILE_NAME
  document.body.appendChild(link)
  link.click()
  link.remove()
  // Safari cancela la descarga si la URL se revoca en el mismo tick del click.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
