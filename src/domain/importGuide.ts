// Guía "Cómo armar el archivo" (US-81, entrega-2/historias/importar-excel.md): el contenido del
// diálogo, con los textos exactos. Los encabezados de la tabla de ejemplo son los de la plantilla.
import { IMPORT_COLUMNS } from './importFile'

export const GUIDE_TITLE = 'Cómo armar el archivo'
export const GUIDE_INTRO =
  'Podés usar tu propia planilla o empezar desde la plantilla. Lo que importa es la primera fila y que haya un movimiento por fila.'

export const GUIDE_STEPS: readonly string[] = [
  'En la primera fila van los encabezados. Fecha, Tipo, Monto, Moneda y Cuenta son obligatorios; Tipo de cambio, Categoría, Cuotas, Cuotas pendientes y Nota son opcionales.',
  'Escribí la fecha como DD/MM/AAAA o usá una celda de fecha de Excel. No puede ser posterior a hoy.',
  'En Tipo poné Gasto o Ingreso, y en Moneda, ARS o USD. Si es USD, completá el tipo de cambio de esa compra.',
  'La categoría y la cuenta tienen que existir en Biyu con el mismo nombre. Las mayúsculas no importan; las tildes sí. Un gasto necesita categoría.',
  'Para una compra en cuotas con tarjeta de crédito, poné la cantidad en Cuotas. Si ya pagaste algunas, poné en Cuotas pendientes cuántas te faltan, contando la de este mes.',
  'Antes de importar vas a ver qué filas tienen errores y por qué. Las que están bien se importan aunque otras fallen.',
]

export const GUIDE_EXAMPLE_HEADERS: readonly string[] = IMPORT_COLUMNS.map((c) => c.header)

/** Dos filas de ejemplo, en el orden de la plantilla (Fecha … Nota). */
export const GUIDE_EXAMPLE_ROWS: readonly (readonly string[])[] = [
  ['01/09/2026', 'Gasto', '45800', 'ARS', '', 'Comida y supermercado', 'Tarjeta de débito', '', '', 'Compra del mes'],
  ['10/06/2026', 'Gasto', '120000', 'ARS', '', 'Otros', 'Tarjeta de crédito', '6', '3', 'Heladera'],
]

export const GUIDE_FOOTER = 'Hasta 500 filas y 1 MB. Solo se lee la primera hoja.'
