/// <reference lib="dom" />
// CP-EXP-028 a 038 y 071 · Escape RFC 4180 y neutralización de fórmulas (US-47 · CA-12, CA-13, ADR-029).
// El oráculo son los bytes del archivo (el caso lo exige: una planilla no es el oráculo). El lector
// RFC 4180 es csv-parse, independiente del código de la app.
import { expect, test } from '@playwright/test'
import {
  ARCHIVE,
  createAccount,
  createCategory,
  createTransaction,
  createUser,
  downloadCsv,
  evidence,
  openExport,
  records,
  type Exported,
} from './helpers'

const base = { amount: '100.00', date: '2026-09-15' }

/** Exporta septiembre 2026 con una descripción dada y devuelve el CSV y el id de la transacción. */
async function conDescripcion(page: import('@playwright/test').Page, caso: string, descripcion: string) {
  const user = await test.step('S1 · PR-01', () => createUser(page, caso))
  const idA = await test.step('S2 · EXP-PREP-01', () => createTransaction(user, { ...base, description: descripcion }))
  await openExport(page, '2026-09')
  const csv = await test.step('14 · Descargar CSV', () => downloadCsv(page))
  await evidence('csv', csv.bytes, 'text/csv')
  return { csv, idA, user }
}

/** El campo `descripcion` va entre `primer_periodo` y `id`: se busca la fila completa, byte a byte. */
function esperaCampoDescripcion(csv: Exported, idA: string, campoEsperado: string) {
  expect(csv.text).toContain(`,1,2026-09,${campoEsperado},${idA}\r\n`)
}

test('CP-EXP-028 — Una coma obliga a entrecomillar la descripción', async ({ page }) => {
  const { csv, idA } = await conDescripcion(page, '028', 'Heladera, 3 cuotas')
  esperaCampoDescripcion(csv, idA, '"Heladera, 3 cuotas"')
})

test('CP-EXP-029 — Las comillas internas se duplican', async ({ page }) => {
  const { csv, idA } = await conDescripcion(page, '029', 'Pizza "a la piedra"')
  esperaCampoDescripcion(csv, idA, '"Pizza ""a la piedra"""')
})

test('CP-EXP-030 — Un LF queda dentro de un campo citado', async ({ page }) => {
  const { csv, idA } = await conDescripcion(page, '030', 'Línea uno\nLínea dos')
  const campo = Buffer.from('"Línea uno\nLínea dos"', 'utf8')
  const afuera = csv.bytes.toString('latin1').indexOf(campo.toString('latin1'))
  expect(afuera, 'el campo citado aparece con el 0A interno').toBeGreaterThan(-1)
  expect(csv.bytes.subarray(afuera, afuera + 1).toString('hex')).toBe('22')
  expect(csv.text).toContain(`"Línea uno\nLínea dos",${idA}\r\n`)
  // Lector RFC 4180: 12 columnas, una fila de datos y la descripción conserva dos líneas.
  const filas = records(csv)
  expect(csv.rows[0]).toHaveLength(12)
  expect(filas).toHaveLength(1)
  expect(filas[0].descripcion).toBe('Línea uno\nLínea dos')
})

const neutralizadas = [
  { id: '031', titulo: 'Descripción con igual se neutraliza', entrada: '=1+1', campo: "'=1+1" },
  { id: '032', titulo: 'Descripción con más se neutraliza', entrada: '+SUMA(A1)', campo: "'+SUMA(A1)" },
  { id: '033', titulo: 'Descripción con menos se neutraliza', entrada: '-5, promo', campo: `"'-5, promo"` },
  { id: '034', titulo: 'Descripción con arroba se neutraliza', entrada: '@usuario', campo: "'@usuario" },
  { id: '035', titulo: 'Descripción con tabulación se neutraliza', entrada: '\tcafé', campo: "'\tcafé" },
  { id: '036', titulo: 'Descripción con retorno de carro se neutraliza', entrada: '\rnota', campo: `"'\rnota"` },
] as const

for (const c of neutralizadas) {
  test(`CP-EXP-${c.id} — ${c.titulo}`, async ({ page }) => {
    const { csv, idA } = await conDescripcion(page, c.id, c.entrada)
    // Coincide exactamente con D2: un solo apóstrofo, el resto intacto y comillas solo si corresponde.
    esperaCampoDescripcion(csv, idA, c.campo)
  })
}

test('CP-EXP-037 — Una categoría que empieza con igual se neutraliza', async ({ page }) => {
  const user = await createUser(page, '037')
  await test.step('S2 · EXP-PREP-03: crear la categoría «=Categoria QA»', () => createCategory(user, '=Categoria QA'))
  const idA = await test.step('S3 · EXP-PREP-01', () => createTransaction(user, { ...base, category: '=Categoria QA' }))
  await openExport(page, '2026-09')
  const csv = await downloadCsv(page)
  await evidence('csv', csv.bytes, 'text/csv')
  expect(csv.text).toContain(`,'=Categoria QA,Efectivo,1,2026-09,,${idA}\r\n`)
})

test('CP-EXP-038 — Una cuenta que empieza con arroba se neutraliza', async ({ page }) => {
  const user = await createUser(page, '038')
  await test.step('S2 · EXP-PREP-03: crear la cuenta «@Cuenta QA»', () => createAccount(user, '@Cuenta QA'))
  const idA = await test.step('S3 · EXP-PREP-01', () => createTransaction(user, { ...base, account: '@Cuenta QA' }))
  await openExport(page, '2026-09')
  const csv = await downloadCsv(page)
  await evidence('csv', csv.bytes, 'text/csv')
  expect(csv.text).toContain(`,Otros,'@Cuenta QA,1,2026-09,,${idA}\r\n`)
})

test('CP-EXP-071 — Un lector RFC 4180 obtiene doce columnas', async ({ page }) => {
  // Desvío: el caso importa el archivo en Google Sheets; acá lo lee csv-parse (RFC 4180).
  const { csv, idA } = await conDescripcion(page, '071', 'Uno, "dos"\nTres')
  const filas = records(csv)
  expect(csv.rows[0]).toHaveLength(12)
  expect(csv.rows).toHaveLength(2) // encabezado y una fila de datos
  expect(filas[0].id).toBe(idA)
  expect(filas[0].descripcion).toBe('Uno, "dos"\nTres')
})

export { ARCHIVE }
