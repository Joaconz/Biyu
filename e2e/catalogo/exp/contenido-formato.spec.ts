/// <reference lib="dom" />
// CP-EXP-017 a 027 · Qué filas salen y cómo se escriben (US-47 · CA-6 a CA-11).
import { expect, test } from '@playwright/test'
import {
  HEADER,
  countDownloads,
  createTransaction,
  createUser,
  deleteTransaction,
  downloadCsv,
  evidence,
  openExport,
  records,
  restoreTransaction,
  submit,
  upsertFx,
  type TestUser,
} from './helpers'

const vacioSep = 'No tenés movimientos con fecha en septiembre 2026.'

/** Datos D9 de varios casos: gasto de $100,00 ARS, Otros/Efectivo, 1 cuota, 2026-09-15, sin descripción. */
const gasto100 = { amount: '100.00', date: '2026-09-15' }

async function conGasto(page: import('@playwright/test').Page, caso: string) {
  const user = await test.step('S1 · PR-01', () => createUser(page, caso))
  const idA = await test.step('S2 · EXP-PREP-01', () => createTransaction(user, gasto100))
  await openExport(page, '2026-09')
  return { user, idA }
}

test('CP-EXP-017 — Una transacción eliminada queda fuera', async ({ page }) => {
  const user = await createUser(page, '017')
  const idA = await createTransaction(user, { amount: '200.00', date: '2026-09-15' })
  await deleteTransaction(user, idA)
  await openExport(page, '2026-09')
  const descargas = await countDownloads(page, async () => {
    await submit(page).click()
    await expect(page.getByTestId('transactions-export-empty')).toHaveText(vacioSep)
  })
  expect(descargas).toBe(0)
})

test('CP-EXP-018 — Una transacción restaurada vuelve a exportarse', async ({ page }) => {
  const user = await createUser(page, '018')
  const idA = await createTransaction(user, { amount: '200.00', date: '2026-09-15' })
  await deleteTransaction(user, idA)
  await restoreTransaction(user, idA)
  await openExport(page, '2026-09')
  const csv = await downloadCsv(page)
  await evidence('csv', csv.bytes, 'text/csv')
  expect(records(csv).map((r) => r.id)).toEqual([idA])
})

test('CP-EXP-019 — El filtro Eliminados no cambia los bytes', async ({ page }) => {
  const user = await createUser(page, '019')
  const idA = await createTransaction(user, gasto100)
  const idB = await createTransaction(user, gasto100)
  await deleteTransaction(user, idB)
  await openExport(page, '2026-09')
  const primero = await test.step('14–15 · Descargar el primer archivo', () => downloadCsv(page))
  await test.step('16 · «Eliminados» muestra B y no A', async () => {
    await page.getByTestId('transactions-filter-deleted').click()
    await expect(page).toHaveURL(/view=deleted/)
    await expect(page.getByTestId('transactions-item')).toHaveCount(1)
    await expect(page.getByTestId('transactions-item-deleted')).toBeVisible()
  })
  await test.step('17 · Abrir otra vez la hoja', async () => {
    await page.getByTestId('transactions-export').click()
    await expect(page.getByTestId('transactions-export-dialog')).toBeVisible()
  })
  const segundo = await test.step('18 · Descargar el segundo archivo', () => downloadCsv(page))
  await evidence('primero', primero.bytes, 'text/csv')
  await evidence('segundo', segundo.bytes, 'text/csv')
  expect(segundo.bytes.equals(primero.bytes)).toBe(true)
  const ids = records(segundo).map((r) => r.id)
  expect(ids).toContain(idA)
  expect(ids).not.toContain(idB)
})

test('CP-EXP-020 — El archivo comienza con BOM UTF-8', async ({ page }) => {
  await conGasto(page, '020')
  const csv = await downloadCsv(page)
  await evidence('primeros-bytes-hex', csv.hex)
  expect(csv.bytes.subarray(0, 3).toString('hex')).toBe('efbbbf')
})

test('CP-EXP-021 — El encabezado tiene doce columnas exactas', async ({ page }) => {
  await conGasto(page, '021')
  const csv = await downloadCsv(page)
  await evidence('csv', csv.bytes, 'text/csv')
  expect(csv.lines[0]).toBe(HEADER)
  expect(csv.rows[0]).toHaveLength(12)
})

test('CP-EXP-022 — Cada fila termina en CRLF incluida la última', async ({ page }) => {
  await conGasto(page, '022')
  const csv = await downloadCsv(page)
  await evidence('csv', csv.bytes, 'text/csv')
  const texto = csv.bytes.toString('utf8')
  // Todas las filas (encabezado y datos) terminan en 0D 0A; ningún LF suelto; nada después de la última.
  expect(texto.endsWith('\r\n')).toBe(true)
  expect(texto.replaceAll('\r\n', '')).not.toMatch(/[\r\n]/)
  expect(csv.lines).toHaveLength(3) // encabezado, 1 fila y el vacío posterior al último CRLF
  expect(csv.lines[2]).toBe('')
  expect(csv.bytes.subarray(-2).toString('hex')).toBe('0d0a')
})

test('CP-EXP-023 — Doce cuotas salen en una sola fila por el total', async ({ page }) => {
  const user = await createUser(page, '023')
  const idA = await createTransaction(user, {
    amount: '120000.00',
    account: 'Tarjeta de crédito',
    installments: 12,
    date: '2026-08-15',
  })
  await openExport(page, '2026-08')
  const csv = await downloadCsv(page)
  await evidence('csv', csv.bytes, 'text/csv')
  const rows = records(csv)
  expect(rows).toHaveLength(1)
  expect(rows[0]).toMatchObject({
    fecha: '2026-08-15',
    monto: '120000.00',
    cuotas: '12',
    primer_periodo: '2026-08',
    id: idA,
  })
})

test('CP-EXP-024 — Un mes con solo cuota heredada produce Vacío', async ({ page }) => {
  const user = await createUser(page, '024')
  await createTransaction(user, {
    amount: '30000.00',
    account: 'Tarjeta de crédito',
    installments: 3,
    date: '2026-08-15',
  })
  await page.goto('/transactions?period=2026-09')
  await test.step('13 · La fila de cuota heredada sigue mostrando 2/3 y $10.000,00', async () => {
    const fila = page.getByTestId('transactions-item')
    await expect(fila).toHaveCount(1)
    await expect(page.getByTestId('transactions-item-installment')).toContainText('2/3')
    await expect(fila).toContainText('$10.000,00')
  })
  await page.getByTestId('transactions-export').click()
  await expect(page.getByTestId('transactions-export-dialog')).toContainText(
    'Las cuotas de compras anteriores no se incluyen.',
  )
  const descargas = await countDownloads(page, async () => {
    await submit(page).click()
    await expect(page.getByTestId('transactions-export-empty')).toHaveText(vacioSep)
  })
  expect(descargas).toBe(0)
})

test('CP-EXP-025 — ARS se escribe con dos decimales exactos', async ({ page }) => {
  const user = await createUser(page, '025')
  const idA = await createTransaction(user, { amount: '1500.00', date: '2026-09-15' })
  await openExport(page, '2026-09')
  const csv = await downloadCsv(page)
  await evidence('csv', csv.bytes, 'text/csv')
  expect(csv.text).toContain('gasto,1500.00,ARS,,1500.00')
  expect(csv.text).not.toContain('1.500,00')
  expect(records(csv)[0]).toMatchObject({ id: idA, monto: '1500.00', monto_ars: '1500.00', tipo_de_cambio: '' })
})

async function conUsd(user: TestUser) {
  return createTransaction(user, { amount: '300.00', currency: 'USD', fx: 1250.5, date: '2026-09-15' })
}

test('CP-EXP-026 — USD conserva cuatro decimales de TC', async ({ page }) => {
  const user = await createUser(page, '026')
  await conUsd(user)
  await openExport(page, '2026-09')
  const csv = await downloadCsv(page)
  await evidence('csv', csv.bytes, 'text/csv')
  expect(csv.text).toContain('300.00,USD,1250.5000,375150.00')
})

test('CP-EXP-027 — Cambiar la referencia no recalcula el histórico', async ({ page }) => {
  const user = await createUser(page, '027')
  await conUsd(user)
  await test.step('S3 · EXP-PREP-04: la referencia de septiembre pasa a 1400.0000', () =>
    upsertFx(user, '2026-09-01', '1400.0000'))
  await openExport(page, '2026-09')
  const csv = await downloadCsv(page)
  await evidence('csv', csv.bytes, 'text/csv')
  const fila = records(csv)[0]
  expect(fila.tipo_de_cambio).toBe('1250.5000')
  expect(fila.monto_ars).toBe('375150.00')
  expect(csv.text).not.toContain('1400.0000')
  expect(csv.text).not.toContain('420000.00')
})
