import { randomUUID } from 'node:crypto'
import path from 'node:path'
import { expect, test, type APIRequestContext, type Page } from '@playwright/test'
import writeXlsxFile from 'write-excel-file/universal'
import { apiSession, signUpAndSkipSetup } from './support/app.ts'

// Regresión de V3 · Importar Excel (IMP), casos de V2 (entrega-3/03-seleccion-regresion.md). Los negativos de formato
// (F1 a F21) los cubren las pruebas de dominio; acá van los de la pantalla y los de la RPC `import_transactions`.

const SAMPLE = path.resolve('entrega-2/mocks/importar-excel-ejemplo.xlsx')
const HEADERS = ['Fecha', 'Tipo', 'Monto', 'Moneda', 'Tipo de cambio', 'Categoría', 'Cuenta', 'Cuotas', 'Cuotas pendientes', 'Nota']
const XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

async function setup(page: Page, request: APIRequestContext, tag: string) {
  const { email } = await signUpAndSkipSetup(page, tag)
  const api = await apiSession(request, email)
  const id = async (table: 'categories' | 'accounts', name: string) =>
    ((await api.select(table, `select=id&name=eq.${encodeURIComponent(name)}`)).body as { id: string }[])[0].id
  return { api, other: await id('categories', 'Otros'), cash: await id('accounts', 'Efectivo') }
}
type Setup = Awaited<ReturnType<typeof setup>>

async function xlsx(rows: (string | number)[][]) {
  const blob = await writeXlsxFile([{ sheet: 'Movimientos', data: [HEADERS, ...rows] }]).toBlob()
  return Buffer.from(await blob.arrayBuffer())
}
async function pick(page: Page, file: string | Buffer) {
  await page.goto('/import')
  await page.getByTestId('import-file-input').setInputFiles(
    typeof file === 'string' ? file : { name: 'archivo.xlsx', mimeType: XLSX, buffer: file },
  )
}
const count = async (s: Setup, table: string) => ((await s.api.select(table, 'select=id')).body as unknown[]).length

const row = (s: Setup, n: number, over: Record<string, unknown> = {}) => ({
  row: n, type: 'expense', amount: '1000.00', currency: 'ARS', fx_rate: null, category_id: s.other, account_id: s.cash,
  installments_count: 1, occurred_on: '2026-09-01', description: 'Compra ficticia', ...over,
})
const importRows = (s: Setup, rows: unknown[], id = randomUUID()) => s.api.rpc('import_transactions', { p_import_id: id, p_rows: rows })

test('CP-IMP-014 · F8: un monto cero se rechaza en la revisión', async ({ page, request }) => {
  const s = await setup(page, request, 'imp-014')
  await pick(page, await xlsx([['01/09/2026', 'Gasto', 0, 'ARS', '', 'Otros', 'Efectivo', 1, '', 'F8']]))
  await expect(page.getByTestId('import-row-2')).toHaveAttribute('data-status', 'error')
  await expect(page.getByTestId('import-row-2')).toContainText('El monto debe ser mayor a cero')
  await expect(page.getByTestId('import-submit')).toBeDisabled()
  expect(await count(s, 'transactions')).toBe(0)
})

test('CP-IMP-024 · nombres, tipo y moneda aceptan espacios y mayúsculas (DEF-033)', async ({ page, request }) => {
  await setup(page, request, 'imp-024')
  await pick(page, await xlsx([['01/09/2026', ' gasto ', 10, 'usd', 1450, ' educación ', ' efectivo ', 1, '', 'Coincidencia']]))
  const card = page.getByTestId('import-row-2')
  await expect(card).toHaveAttribute('data-status', 'ready')
  for (const text of ['Gasto', 'US$10,00', 'Educación', 'Efectivo', 'TC 1.450,00']) await expect(card).toContainText(text)
})

test('CP-IMP-027 · el resumen del archivo de ejemplo suma solo las siete filas listas', async ({ page, request }) => {
  await setup(page, request, 'imp-027')
  await pick(page, SAMPLE)
  await expect(page.getByTestId('import-summary-amounts')).toContainText(
    'Vas a importar 7 movimientos: $324.915,50 en gastos y $850.000,00 en ingresos (en pesos).',
  )
})

test('CP-IMP-030 · confirmar importa solo las filas listas con todos sus campos', async ({ page, request }) => {
  const s = await setup(page, request, 'imp-030')
  await pick(page, await xlsx([
    ['01/09/2026', 'Gasto', 1000, 'ARS', '', 'Otros', 'Efectivo', 1, '', 'Nota ficticia'],
    ['02/09/2026', 'Ingreso', 2000, 'ARS', '', '', 'Cuenta bancaria', 1, '', ''],
    ['01/09/2026', 'Gasto', 0, 'ARS', '', 'Otros', 'Efectivo', 1, '', 'No importar'],
  ]))
  await expect(page.getByTestId('import-summary')).toContainText('3 filas leídas · 2 listas para importar · 1 con error')
  await page.getByTestId('import-submit').click()
  await expect(page.getByTestId('import-result-title')).toHaveText('Se importaron 2 de 3 filas.')
  await expect(page.getByTestId('import-result-amounts')).toContainText('$1.000,00 en gastos y $2.000,00 en ingresos (en pesos).')
  await expect(page.getByTestId('import-result-row-4')).toContainText('El monto debe ser mayor a cero')
  const txs = (await s.api.select('transactions', 'select=type,amount_text:amount::text,occurred_on,description&order=occurred_on')).body as {
    type: string
    amount_text: string
    occurred_on: string
    description: string | null
  }[]
  expect(txs).toEqual([
    { type: 'expense', amount_text: '1000.00', occurred_on: '2026-09-01', description: 'Nota ficticia' },
    { type: 'income', amount_text: '2000.00', occurred_on: '2026-09-02', description: null },
  ])
})

test('CP-IMP-031 · la compra de 240.000 en seis cuotas crea seis imputaciones exactas', async ({ page, request }) => {
  const s = await setup(page, request, 'imp-031')
  const visa = ((await s.api.select('accounts', 'select=id&name=eq.Tarjeta de crédito')).body as { id: string }[])[0].id
  const res = await importRows(s, [row(s, 2, { amount: '240000.00', account_id: visa, installments_count: 6, occurred_on: '2026-09-03' })])
  expect(res.status).toBe(200)
  const entries = (await s.api.select('ledger_entries', 'select=installment_number,amount_text:amount::text&order=installment_number')).body as {
    installment_number: number
    amount_text: string
  }[]
  expect(entries.map((e) => e.amount_text)).toEqual(Array(6).fill('40000.00'))
})

test('CP-IMP-032 · un rechazo tardío de categoría no impide las otras filas', async ({ page, request }) => {
  const s = await setup(page, request, 'imp-032')
  await pick(page, SAMPLE)
  await expect(page.getByTestId('import-row-6')).toHaveAttribute('data-status', 'ready')
  const transport = ((await s.api.select('categories', 'select=id&name=eq.Transporte')).body as { id: string }[])[0].id
  const archived = await s.api.patch('categories', `id=eq.${transport}`, { archived_at: new Date().toISOString() }) // otra sesión la archiva
  expect(archived.body).toHaveLength(1)
  await page.getByTestId('import-submit').click()
  await expect(page.getByTestId('import-result-title')).toHaveText('Se importaron 6 de 11 filas.')
  await expect(page.getByTestId('import-result-row-6')).toContainText('No existe la categoría «Transporte» o está archivada')
})

test('CP-IMP-033 · quinientas filas de doce cuotas terminan en menos de diez segundos', async ({ page, request }) => {
  const s = await setup(page, request, 'imp-033')
  const visa = ((await s.api.select('accounts', 'select=id&name=eq.Tarjeta de crédito')).body as { id: string }[])[0].id
  const rows = Array.from({ length: 500 }, (_, i) => row(s, i + 2, { amount: '12000.00', account_id: visa, installments_count: 12 }))
  const started = Date.now()
  const res = await importRows(s, rows)
  expect(Date.now() - started).toBeLessThan(10_000)
  expect(res.status).toBe(200)
  expect(await count(s, 'transactions')).toBe(500)
  for (const n of [1, 12]) {
    expect(((await s.api.select('ledger_entries', `select=id&installment_number=eq.${n}`)).body as unknown[]).length).toBe(500)
  }
})

test('CP-IMP-034 y 035 · la RPC procesa una válida y rechaza tres inválidas, y rechaza un lote de 501', async ({ page, request }) => {
  const s = await setup(page, request, 'imp-034')
  const res = await importRows(s, [
    row(s, 2),
    row(s, 3, { amount: '0.00' }),
    row(s, 4, { category_id: randomUUID() }),
    row(s, 5, { occurred_on: '2999-01-01' }),
  ])
  expect(res.status).toBe(200)
  const body = res.body as { sent_rows: number; imported_rows: number; rows: { row: number; status: string }[] }
  expect(body).toMatchObject({ sent_rows: 4, imported_rows: 1 })
  expect(body.rows.map((r) => r.status)).toEqual(['imported', 'rejected', 'rejected', 'rejected'])
  expect(await count(s, 'transactions')).toBe(1)
  const big = await importRows(s, Array.from({ length: 501 }, (_, i) => row(s, i + 2)))
  expect(big.status).toBe(400)
  expect(big.body).toMatchObject({ message: 'una importación lleva de 1 a 500 filas' })
  expect(await count(s, 'transactions')).toBe(1)
})

test('CP-IMP-036 y 037 · anon no puede importar y otro usuario no ve transacciones ni imports ajenos', async ({ page, request, browser }) => {
  const a = await setup(page, request, 'imp-036a')
  expect((await importRows(a, [row(a, 2)])).status).toBe(200)
  const anon = await a.api.rpc('import_transactions', { p_import_id: randomUUID(), p_rows: [row(a, 2)] }, { asAnon: true })
  expect(anon.body).toMatchObject({ code: '42501' })
  const other = await browser.newContext()
  const b = await setup(await other.newPage(), request, 'imp-036b')
  expect(await count(b, 'transactions')).toBe(0)
  expect((await b.api.select('imports', 'select=id')).body).toEqual([])
})

test('CP-IMP-038 y 039 · el reintento con el mismo import_id reconoce lo guardado y es idempotente', async ({ page, request }) => {
  const s = await setup(page, request, 'imp-038')
  const id = randomUUID() // el import_id es único en toda la base: uno fijo choca entre corridas
  const first = await importRows(s, [row(s, 2)], id)
  expect(first.body).toMatchObject({ already_imported: false, sent_rows: 1, imported_rows: 1 })
  const again = await importRows(s, [row(s, 2)], id)
  expect(again.status).toBe(200)
  expect(again.body).toMatchObject({ already_imported: true })
  expect(await count(s, 'transactions')).toBe(1)
  expect(await count(s, 'ledger_entries')).toBe(1)
})

test('CP-IMP-040 · sin respuesta se conserva la revisión y se ofrece reintentar', async ({ page, request }) => {
  test.setTimeout(90_000)
  const s = await setup(page, request, 'imp-040')
  await pick(page, await xlsx([['01/09/2026', 'Gasto', 1000, 'ARS', '', 'Otros', 'Efectivo', 1, '', 'Sin red']]))
  await expect(page.getByTestId('import-row-2')).toHaveAttribute('data-status', 'ready')
  await page.route('**/rest/v1/rpc/import_transactions', (route) => route.abort('connectionfailed'))
  await page.getByTestId('import-submit').click()
  await expect(page.getByTestId('import-batch-error')).toContainText(
    'No pudimos confirmar la importación. Puede que se haya guardado: tocá Reintentar y te decimos qué pasó.',
    { timeout: 45_000 },
  )
  await expect(page.getByRole('button', { name: 'Reintentar' })).toBeVisible()
  await expect(page.getByTestId('import-steps')).toBeVisible()
  expect(await count(s, 'transactions')).toBe(0)
})

test('CP-IMP-041 · una sesión vencida ofrece volver a entrar', async ({ page, request }) => {
  const s = await setup(page, request, 'imp-041')
  await pick(page, await xlsx([['01/09/2026', 'Gasto', 1000, 'ARS', '', 'Otros', 'Efectivo', 1, '', 'Vencida']]))
  await expect(page.getByTestId('import-row-2')).toHaveAttribute('data-status', 'ready')
  await page.route('**/rest/v1/rpc/import_transactions', (route) =>
    route.fulfill({ status: 401, contentType: 'application/json', body: '{"code":"42501","message":"permission denied for function import_transactions"}' }),
  )
  await page.getByTestId('import-submit').click()
  await expect(page.getByTestId('import-batch-error')).toContainText(
    'Tu sesión venció y no se importó ninguna fila. Volvé a entrar y subí el archivo de nuevo.',
  )
  await expect(page.getByRole('button', { name: /Volver a entrar/ }).or(page.getByRole('link', { name: /Volver a entrar/ }))).toBeVisible()
  expect(await count(s, 'transactions')).toBe(0)
})
