import { checkFileBeforeReading, readImportSheet, TEMPLATE_FILE_NAME, type ReadSheetResult } from '@/domain/importFile'

// La librería de .xlsx se carga recién acá, al elegir un archivo o bajar la plantilla (ADR-042).
const loadXlsx = () => import('./xlsx')

/** A1 y A2 sin abrir el archivo; A3 si no se puede leer como .xlsx; A4–A7 sobre la primera hoja (§3). */
export async function readImportFile(file: File): Promise<ReadSheetResult> {
  const before = checkFileBeforeReading(file)
  if (before) return { ok: false, error: before }
  const { readFirstSheet } = await loadXlsx()
  let grid
  try {
    grid = await readFirstSheet(file)
  } catch {
    return { ok: false, error: { rule: 'A3' } }
  }
  return readImportSheet(grid)
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
