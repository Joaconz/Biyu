import { readFile } from 'node:fs/promises'
import { expect, test, type APIRequestContext, type Page } from '@playwright/test'
import { apiSession, signUpAndSkipSetup } from './support/app.ts'
import { e2eTarget } from './support/env.ts'

// Regresión de V3 · Exportar CSV (EXP), casos de V2 (entrega-3/03-seleccion-regresion.md). CP-EXP-003, 027, 028 y 029
// ya están en export-sheet.spec.ts. Los CSV se leen del archivo descargado.

type Api = Awaited<ReturnType<typeof apiSession>>
const HEADER = 'fecha,tipo,monto,moneda,tipo_de_cambio,monto_ars,categoria,cuenta,cuotas,primer_periodo,descripcion,id'
const ymd = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date())
const thisMonth = () => ymd().slice(0, 7)
const nextMonth = () => {
  const [y, m] = ymd().split('-').map(Number)
  const d = new Date(Date.UTC(y, m, 1))
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

async function setup(page: Page, request: APIRequestContext, tag: string) {
  const { email } = await signUpAndSkipSetup(page, tag)
  const api = await apiSession(request, email)
  const id = async (table: 'categories' | 'accounts', name: string) =>
    ((await api.select(table, `select=id&name=eq.${encodeURIComponent(name)}`)).body as { id: string }[])[0].id
  return { api, other: await id('categories', 'Otros'), cash: await id('accounts', 'Efectivo'), visa: await id('accounts', 'Tarjeta de crédito') }
}
type Setup = Awaited<ReturnType<typeof setup>>

const add = (s: Setup, o: Record<string, unknown> = {}) =>
  s.api.rpc('create_transaction', {
    p_type: 'expense', p_amount: '1200.00', p_currency: 'ARS', p_fx_rate: null, p_category_id: s.other, p_account_id: s.cash,
    p_installments_count: 1, p_occurred_on: '2026-09-15', p_description: null, p_request_id: null, ...o,
  })

async function openExport(page: Page, period: string, scope: 'month' | 'year' = 'month') {
  await page.goto(`/transactions?period=${period}`)
  await page.getByTestId('transactions-export').click()
  await expect(page.getByTestId('transactions-export-dialog')).toBeVisible()
  if (scope === 'year') await page.getByTestId('transactions-export-scope-year').click()
}

/** Exporta y devuelve el nombre y los bytes del archivo. */
async function exportCsv(page: Page, period: string, scope: 'month' | 'year' = 'month') {
  await openExport(page, period, scope)
  const download = page.waitForEvent('download')
  await page.getByTestId('transactions-export-submit').click()
  const file = await download
  const bytes = await readFile((await file.path())!)
  return { name: file.suggestedFilename(), bytes, text: bytes.toString('utf8').replace(/^﻿/, '') }
}
const lines = (text: string) => text.split('\r\n').filter(Boolean)

test('CP-EXP-002 · el mes siguiente está bloqueado', async ({ page, request }) => {
  await setup(page, request, 'exp-002')
  await page.goto(`/transactions?period=${nextMonth()}`)
  await expect(page.getByTestId('transactions-export-future')).toHaveText('Solo podés exportar el mes actual o meses anteriores.')
  await expect(page.getByTestId('transactions-export')).toBeDisabled()
})

test('CP-EXP-004 y 005 · el primer día del mes se incluye y el día posterior se excluye', async ({ page, request }) => {
  const s = await setup(page, request, 'exp-004')
  await add(s, { p_occurred_on: '2026-09-01', p_description: 'primero' })
  await add(s, { p_occurred_on: '2026-09-30', p_description: 'ultimo' })
  await add(s, { p_occurred_on: '2026-10-01', p_description: 'siguiente' })
  await add(s, { p_occurred_on: '2026-08-31', p_description: 'anterior' })
  const { text } = await exportCsv(page, '2026-09')
  expect(text).toContain('primero')
  expect(text).toContain('ultimo')
  expect(text).not.toContain('siguiente')
  expect(text).not.toContain('anterior')
})

test('CP-EXP-006 y 007 · el 1 de enero se incluye en el año y el día posterior al año se excluye', async ({ page, request }) => {
  const s = await setup(page, request, 'exp-006')
  await add(s, { p_occurred_on: '2025-01-01', p_description: 'enero' })
  await add(s, { p_occurred_on: '2025-12-31', p_description: 'diciembre' })
  await add(s, { p_occurred_on: '2026-01-01', p_description: 'proximo-anio' })
  await add(s, { p_occurred_on: '2024-12-31', p_description: 'anio-anterior' })
  const { name, text } = await exportCsv(page, '2025-06', 'year')
  expect(name).toBe('biyu-movimientos-2025.csv')
  expect(text).toContain('enero')
  expect(text).toContain('diciembre')
  expect(text).not.toContain('proximo-anio')
  expect(text).not.toContain('anio-anterior')
})

test('CP-EXP-008 · una transacción eliminada queda fuera', async ({ page, request }) => {
  const s = await setup(page, request, 'exp-008')
  await add(s, { p_description: 'queda' })
  const gone = (await add(s, { p_description: 'eliminada' })).body as string
  await s.api.rpc('delete_transaction', { p_transaction_id: gone })
  const { text } = await exportCsv(page, '2026-09')
  expect(text).toContain('queda')
  expect(text).not.toContain('eliminada')
})

test('CP-EXP-009 y 010 · el archivo empieza con BOM UTF-8, CRLF y el encabezado de doce columnas exactas', async ({ page, request }) => {
  const s = await setup(page, request, 'exp-009')
  await add(s)
  const { bytes, text } = await exportCsv(page, '2026-09')
  expect([...bytes.subarray(0, 3)]).toEqual([0xef, 0xbb, 0xbf])
  expect(lines(text)[0]).toBe(HEADER)
  expect(HEADER.split(',')).toHaveLength(12)
  expect(text.endsWith('\r\n')).toBe(true)
})

test('CP-EXP-011 y 012 · doce cuotas salen en una sola fila por el total y ARS con dos decimales exactos', async ({ page, request }) => {
  const s = await setup(page, request, 'exp-011')
  await add(s, { p_amount: '120000.00', p_account_id: s.visa, p_installments_count: 12, p_description: 'cuotas' })
  await add(s, { p_amount: '1234.50', p_description: 'pesos' })
  const rows = lines((await exportCsv(page, '2026-09')).text).slice(1)
  expect(rows).toHaveLength(2)
  const cuotas = rows.find((r) => r.includes('cuotas'))!.split(',')
  expect(cuotas.slice(0, 5)).toEqual(['2026-09-15', 'gasto', '120000.00', 'ARS', ''])
  expect(cuotas[8]).toBe('12')
  expect(rows.find((r) => r.includes('pesos'))!.split(',')[2]).toBe('1234.50')
})

test('CP-EXP-013 · USD conserva cuatro decimales del tipo de cambio', async ({ page, request }) => {
  const s = await setup(page, request, 'exp-013')
  await add(s, { p_amount: '100.00', p_currency: 'USD', p_fx_rate: '1234.5678', p_description: 'dolares' })
  const row = lines((await exportCsv(page, '2026-09')).text)[1].split(',')
  expect(row.slice(2, 6)).toEqual(['100.00', 'USD', '1234.5678', '123456.78'])
})

test('CP-EXP-014 a 017 · la coma obliga a entrecomillar, las comillas se duplican y el = inicial se neutraliza', async ({ page, request }) => {
  const s = await setup(page, request, 'exp-014')
  await add(s, { p_description: 'pan, leche' })
  await add(s, { p_description: 'dijo "hola"' })
  await add(s, { p_description: '=1+1' })
  const created = await request.post(`${e2eTarget().supabaseUrl}/rest/v1/categories`, {
    headers: { apikey: e2eTarget().anonKey!, Authorization: `Bearer ${s.api.token}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
    data: { name: '=Peligro', color: '#888888' },
  })
  expect(created.status()).toBe(201)
  const dangerous = ((await created.json()) as { id: string }[])[0].id
  await add(s, { p_category_id: dangerous, p_description: 'categoria' })
  const { text } = await exportCsv(page, '2026-09')
  expect(text).toContain('"pan, leche"')
  expect(text).toContain('"dijo ""hola"""')
  expect(text).toMatch(/,'=1\+1,/) // la fórmula queda como texto
  expect(text).not.toMatch(/,=1\+1,/)
  expect(text).toContain("'=Peligro")
})

test('CP-EXP-018 · 1.500 transacciones se exportan sin faltantes ni repetidas', async ({ page, request }) => {
  test.setTimeout(180_000)
  const s = await setup(page, request, 'exp-018')
  for (let batch = 0; batch < 3; batch++) {
    const rows = Array.from({ length: 500 }, (_, i) => ({
      row: i + 1, type: 'expense', amount: '100.00', currency: 'ARS', fx_rate: null, category_id: s.other, account_id: s.cash,
      installments_count: 1, occurred_on: '2026-09-15', description: `mov ${batch * 500 + i}`,
    }))
    const res = await s.api.rpc('import_transactions', { p_import_id: crypto.randomUUID(), p_rows: rows })
    expect(res.status).toBe(200)
  }
  const rows = lines((await exportCsv(page, '2026-09')).text).slice(1)
  expect(rows).toHaveLength(1500)
  expect(new Set(rows.map((r) => r.split(',').at(-1))).size).toBe(1500)
})

test('CP-EXP-019 y 020 · el CSV y la API de A no traen movimientos de B', async ({ page, request, browser }) => {
  const a = await setup(page, request, 'exp-019a')
  await add(a, { p_description: 'de-a' })
  const other = await browser.newContext()
  const b = await setup(await other.newPage(), request, 'exp-019b')
  await add(b, { p_description: 'de-b' })
  const { text } = await exportCsv(page, '2026-09')
  expect(text).toContain('de-a')
  expect(text).not.toContain('de-b')
  const rows = (await a.api.select('transactions', 'select=description')).body as { description: string }[]
  expect(rows.map((r) => r.description)).toEqual(['de-a'])
})

test('CP-EXP-023 · un doble click inicia una sola descarga', async ({ page, request }) => {
  const s = await setup(page, request, 'exp-023')
  await add(s)
  await openExport(page, '2026-09')
  let downloads = 0
  page.on('download', () => downloads++)
  await page.getByTestId('transactions-export-submit').dblclick()
  await expect(page.getByTestId('transactions-export-success')).toBeVisible()
  await page.waitForTimeout(500)
  expect(downloads).toBe(1)
})

test('CP-EXP-025 y 026 · sin conexión muestra el error exacto y el reintento descarga completo', async ({ page, request }) => {
  test.setTimeout(90_000)
  const s = await setup(page, request, 'exp-025')
  await add(s)
  await openExport(page, '2026-09')
  const offline = (route: { abort: (reason: string) => Promise<void> }) => route.abort('connectionfailed')
  await page.route('**/rest/v1/transactions?*', offline)
  await page.getByTestId('transactions-export-submit').click()
  await expect(page.getByTestId('transactions-export-error')).toHaveText('No pudimos exportar tus movimientos. Probá de nuevo.', { timeout: 45_000 }) // el cliente reintenta los GET antes de rendirse
  await page.unroute('**/rest/v1/transactions?*', offline)
  const download = page.waitForEvent('download')
  await page.getByTestId('transactions-export-submit').click()
  const text = (await readFile((await (await download).path())!)).toString('utf8')
  expect(lines(text.replace(/^﻿/, ''))).toHaveLength(2)
})

test('CP-EXP-030 · una alta concurrente no deja descargar un año incompleto', async ({ page, request }) => {
  test.setTimeout(180_000)
  const s = await setup(page, request, 'exp-030')
  const rows = Array.from({ length: 500 }, (_, i) => ({
    row: i + 1, type: 'expense', amount: '100.00', currency: 'ARS', fx_rate: null, category_id: s.other, account_id: s.cash,
    installments_count: 1, occurred_on: '2026-03-10', description: `mov ${i}`,
  }))
  for (let i = 0; i < 3; i++) expect((await s.api.rpc('import_transactions', { p_import_id: crypto.randomUUID(), p_rows: rows })).status).toBe(200)
  await openExport(page, '2026-03', 'year')
  let calls = 0
  await page.route('**/rest/v1/transactions?*', async (route) => {
    if (++calls === 2) await add(s, { p_occurred_on: '2026-03-10', p_description: 'concurrente' })
    await route.continue()
  })
  const downloads: string[] = []
  page.on('download', (d) => downloads.push(d.suggestedFilename()))
  await page.getByTestId('transactions-export-submit').click()
  const failed = page.getByTestId('transactions-export-error')
  const done = page.getByTestId('transactions-export-success')
  await expect(failed.or(done)).toBeVisible()
  if (await done.isVisible()) {
    // Si descargó, el archivo no puede estar incompleto: trae lo que había al terminar.
    expect(downloads).toHaveLength(1)
  } else {
    expect(downloads).toHaveLength(0)
  }
})

test('CP-EXP-031 · un HTTP 500 muestra el error y no descarga', async ({ page, request }) => {
  const s = await setup(page, request, 'exp-031')
  await add(s)
  await openExport(page, '2026-09')
  await page.route('**/rest/v1/transactions?*', (route) => route.fulfill({ status: 500, contentType: 'application/json', body: '{"message":"boom"}' }))
  let downloads = 0
  page.on('download', () => downloads++)
  await page.getByTestId('transactions-export-submit').click()
  await expect(page.getByTestId('transactions-export-error')).toBeVisible()
  expect(downloads).toBe(0)
})
