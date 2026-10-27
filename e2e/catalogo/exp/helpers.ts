/// <reference lib="dom" />
// Ayudas de los casos CP-EXP (entrega-2/casos/exp.md). Cada función equivale a un procedimiento común
// (PR-nn, docs/12-procedimientos-de-prueba.md) o a una preparación EXP-PREP-nn del anexo del caso.
import { expect, type BrowserContext, type Page, test } from '@playwright/test'
import { parse } from 'csv-parse/sync'

export const SUPABASE_URL = process.env.CATALOG_SUPABASE_URL ?? 'http://127.0.0.1:54321'
export const ANON_KEY = process.env.CATALOG_ANON_KEY ?? ''
export const PASSWORD = 'Clave123!'
const RUN = process.env.CATALOG_RUN ?? '001'

if (!ANON_KEY) throw new Error('Falta CATALOG_ANON_KEY (supabase status -o env)')

export interface TestUser {
  email: string
  token: string
  userId: string
  categories: Record<string, string>
  accounts: Record<string, string>
}

/**
 * Email de un caso: qa+cp-exp-064-001@example.com (docs/12 PR-01). El segundo usuario de un caso (B en
 * PR-05) suma 1 al correlativo: 001 y 002; para repetir la corrida se salta de a 10 (CATALOG_RUN=011).
 */
export function emailFor(caseId: string, offset = 0): string {
  const nnn = String(Number(RUN) + offset).padStart(3, '0')
  return `qa+cp-exp-${caseId}-${nnn}@example.com`
}

export const HEADER =
  'fecha,tipo,monto,moneda,tipo_de_cambio,monto_ars,categoria,cuenta,cuotas,primer_periodo,descripcion,id'

// ---------------------------------------------------------------- PR-01

/** PR-01 por la UI: alta, 4 "Saltear" y llega a Registrar. Devuelve token y uuid de catálogo (PR-04). */
export async function createUser(page: Page, caseId: string, offset = 0): Promise<TestUser> {
  const email = emailFor(caseId, offset)
  await page.goto('/signup')
  await page.getByTestId('signup-form-email').fill(email)
  await page.getByTestId('signup-form-password').fill(PASSWORD)
  await page.getByTestId('signup-form-confirm-password').fill(PASSWORD)
  await page.getByTestId('signup-form-submit').click()
  await page.getByTestId('setup-reason-skip').click()
  await page.getByTestId('setup-categories-skip').click()
  await page.getByTestId('setup-accounts-skip').click()
  await page.getByTestId('setup-expense-skip').click()
  await expect(page).toHaveURL(/\/register$/)
  await expect(page.getByTestId('transaction-form')).toBeVisible()
  // El catálogo inicial se siembra desde el cliente (ADR-014): esperar a que esté.
  const user = await readSession(page, email)
  await expect
    .poll(async () => Object.keys((await catalog(user)).accounts).length, { timeout: 15_000 })
    .toBeGreaterThan(0)
  Object.assign(user, await catalog(user))
  return user
}

/** Inicia sesión por la UI (pasos 1–9 de cada caso) con un usuario ya creado. */
export async function login(page: Page, email: string): Promise<void> {
  await page.goto('/login')
  await page.getByTestId('login-form-email').fill(email)
  await page.getByTestId('login-form-password').fill(PASSWORD)
  await page.getByTestId('login-form-submit').click()
  await expect(page).toHaveURL(/\/register/)
}

async function readSession(page: Page, email: string): Promise<TestUser> {
  const raw = await page.evaluate(() => {
    const key = Object.keys(window.localStorage).find((k) => k.endsWith('-auth-token'))
    return key ? window.localStorage.getItem(key) : null
  })
  if (!raw) throw new Error('No hay sesión en localStorage')
  const session = JSON.parse(raw) as { access_token: string; user: { id: string } }
  return {
    email,
    token: session.access_token,
    userId: session.user.id,
    categories: {},
    accounts: {},
  }
}

async function catalog(user: TestUser) {
  const [cats, accs] = await Promise.all([
    rest<{ id: string; name: string }[]>(user, 'GET', 'categories?select=id,name'),
    rest<{ id: string; name: string }[]>(user, 'GET', 'accounts?select=id,name'),
  ])
  return {
    categories: Object.fromEntries((cats.json ?? []).map((c) => [c.name, c.id])),
    accounts: Object.fromEntries((accs.json ?? []).map((a) => [a.name, a.id])),
  }
}

// ---------------------------------------------------------------- PR-04: API directa

export async function rest<T = unknown>(
  user: Pick<TestUser, 'token'>,
  method: string,
  path: string,
  body?: unknown,
  headers: Record<string, string> = {},
): Promise<{ status: number; json: T; text: string }> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const text = await res.text()
  let json: unknown = null
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    json = text
  }
  return { status: res.status, json: json as T, text }
}

export interface TxInput {
  type?: 'expense' | 'income'
  amount: string
  currency?: 'ARS' | 'USD'
  fx?: number | null
  category?: string | null
  account?: string
  installments?: number
  date: string
  description?: string | null
}

/** EXP-PREP-01 · Crear una transacción por la RPC `create_transaction`. */
export async function createTransaction(user: TestUser, t: TxInput): Promise<string> {
  const category = t.category === undefined ? 'Otros' : t.category
  const r = await rest<string>(user, 'POST', 'rpc/create_transaction', {
    p_type: t.type ?? 'expense',
    p_amount: t.amount,
    p_currency: t.currency ?? 'ARS',
    p_fx_rate: t.fx ?? null,
    p_category_id: category === null ? null : (user.categories[category] ?? category),
    p_account_id: user.accounts[t.account ?? 'Efectivo'] ?? t.account,
    p_installments_count: t.installments ?? 1,
    p_occurred_on: t.date,
    p_description: t.description ?? null,
    p_request_id: crypto.randomUUID(),
  })
  expect(r.status, `create_transaction: ${r.text}`).toBe(200)
  return r.json
}

/**
 * EXP-PREP-02 · Eliminar o restaurar. El anexo espera HTTP 200, pero las dos RPC devuelven void y
 * PostgREST responde 204 sin cuerpo (mismo desvío que DEF-029 / CP-NAV-084): es un error de la
 * preparación del caso, no de la exportación. Se aceptan 200 y 204 y se verifica con deleted_at.
 */
async function setDeleted(user: TestUser, fn: 'delete_transaction' | 'restore_transaction', id: string) {
  const r = await rest(user, 'POST', `rpc/${fn}`, { p_transaction_id: id })
  expect([200, 204], r.text).toContain(r.status)
  const check = await rest<{ deleted_at: string | null }[]>(user, 'GET', `transactions?select=deleted_at&id=eq.${id}`)
  expect(check.json).toHaveLength(1)
  expect(check.json[0].deleted_at === null).toBe(fn === 'restore_transaction')
}
export const deleteTransaction = (user: TestUser, id: string) => setDeleted(user, 'delete_transaction', id)
export const restoreTransaction = (user: TestUser, id: string) => setDeleted(user, 'restore_transaction', id)

/** EXP-PREP-03 · Crear, renombrar y archivar categorías o cuentas. */
export async function createCategory(user: TestUser, name: string): Promise<string> {
  const r = await rest<{ id: string }[]>(user, 'POST', 'categories', { name, color: '#336699' }, {
    Prefer: 'return=representation',
  })
  expect(r.status, r.text).toBe(201)
  user.categories[name] = r.json[0].id
  return r.json[0].id
}
export async function createAccount(user: TestUser, name: string): Promise<string> {
  const r = await rest<{ id: string }[]>(
    user,
    'POST',
    'accounts',
    { name, type: 'cash', currency: 'ARS' },
    { Prefer: 'return=representation' },
  )
  expect(r.status, r.text).toBe(201)
  user.accounts[name] = r.json[0].id
  return r.json[0].id
}
export async function patchCatalog(
  user: TestUser,
  table: 'categories' | 'accounts',
  id: string,
  body: Record<string, unknown>,
) {
  const r = await rest(user, 'PATCH', `${table}?id=eq.${id}`, body, { Prefer: 'return=representation' })
  expect(r.status, r.text).toBe(200)
}
export const ARCHIVE = { archived_at: '2026-10-09T12:00:00-03:00' }

/** EXP-PREP-04 · Tipo de cambio de referencia. */
export async function upsertFx(user: TestUser, period: string, arsPerUsd: string) {
  const r = await rest(user, 'POST', 'rpc/upsert_fx_rate', { p_period: period, p_ars_per_usd: arsPerUsd })
  expect(r.status, r.text).toBe(200)
}

/** EXP-PREP-06 · Eliminar una cuenta (borra sus transacciones). */
export async function deleteAccount(user: TestUser, accountId: string) {
  const r = await rest(user, 'POST', 'rpc/delete_account', { p_account_id: accountId })
  expect(r.status, r.text).toBe(200)
  return r.json
}

/** EXP-PREP-07 · Sembrar N transacciones EXP-0001..EXP-NNNN de $1,00 el 2025-09-15, en tandas. */
export async function seed(user: TestUser, n: number, date = '2025-09-15') {
  const ids: string[] = []
  const BATCH = 25
  for (let from = 1; from <= n; from += BATCH) {
    const chunk = Array.from({ length: Math.min(BATCH, n - from + 1) }, (_, i) => from + i)
    const got = await Promise.all(
      chunk.map((i) =>
        createTransaction(user, { amount: '1.00', date, description: `EXP-${String(i).padStart(4, '0')}` }),
      ),
    )
    ids.push(...got)
  }
  expect(new Set(ids).size).toBe(n)
  return ids
}

// ---------------------------------------------------------------- hoja de exportación

/** Abre Movimientos de un período y, salvo `open:false`, la hoja "Exportar movimientos". */
export async function openExport(page: Page, period: string, open = true) {
  await page.goto(`/transactions?period=${period}`)
  await expect(page.getByTestId('transactions-export')).toBeVisible()
  if (open) {
    await page.getByTestId('transactions-export').click()
    await expect(page.getByTestId('transactions-export-dialog')).toBeVisible()
  }
}

export const dialog = (page: Page) => page.getByTestId('transactions-export-dialog')
export const submit = (page: Page) => page.getByTestId('transactions-export-submit')
export const cancel = (page: Page) => page.getByTestId('transactions-export-cancel')
export const scopeMonth = (page: Page) => page.getByTestId('transactions-export-scope-month')
export const scopeYear = (page: Page) => page.getByTestId('transactions-export-scope-year')

export interface Exported {
  filename: string
  bytes: Buffer
  text: string // sin el BOM
  hex: string
  lines: string[]
  rows: string[][] // lector RFC 4180 independiente (csv-parse)
}

/** Elige el alcance (si se pide) y descarga: devuelve nombre de archivo y bytes del CSV. */
export async function downloadCsv(page: Page, scope?: 'month' | 'year'): Promise<Exported> {
  if (scope === 'year') await scopeYear(page).click()
  if (scope === 'month') await scopeMonth(page).click()
  const [download] = await Promise.all([page.waitForEvent('download'), submit(page).click()])
  const path = await download.path()
  const { readFileSync } = await import('node:fs')
  const bytes = readFileSync(path)
  return describeCsv(download.suggestedFilename(), bytes)
}

export function describeCsv(filename: string, bytes: Buffer): Exported {
  const text = bytes.toString('utf8').replace(/^﻿/, '')
  return {
    filename,
    bytes,
    text,
    hex: bytes.subarray(0, 16).toString('hex'),
    lines: text.split('\r\n'),
    rows: parse(text, { relax_column_count: false, skip_empty_lines: true }) as string[][],
  }
}

/** Las filas de datos (sin encabezado) como objetos por nombre de columna. */
export function records(csv: Exported): Record<string, string>[] {
  const [head, ...rest] = csv.rows
  return rest.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i]])))
}

/** Cuenta las descargas que dispara `fn` y espera `graceMs` por si llega alguna tarde. */
export async function countDownloads(page: Page, fn: () => Promise<void>, graceMs = 1500): Promise<number> {
  let n = 0
  const on = () => n++
  page.on('download', on)
  try {
    await fn()
    await page.waitForTimeout(graceMs)
  } finally {
    page.off('download', on)
  }
  return n
}

const cdpSessions = new WeakMap<Page, Awaited<ReturnType<BrowserContext['newCDPSession']>>>()

/** Network throttling de DevTools por CDP (ej. 1 kbit/s, 2000 ms); `null` lo restablece. Una sola sesión por página. */
export async function throttle(page: Page, kbps: number | null, latencyMs = 0) {
  let cdp = cdpSessions.get(page)
  if (!cdp) {
    cdp = await page.context().newCDPSession(page)
    cdpSessions.set(page, cdp)
    await cdp.send('Network.enable')
  }
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: kbps === null ? 0 : latencyMs,
    downloadThroughput: kbps === null ? -1 : (kbps * 1000) / 8,
    uploadThroughput: kbps === null ? -1 : (kbps * 1000) / 8,
  })
}

/** Adjunta evidencia al reporte del caso. */
export async function evidence(name: string, body: string | Buffer, contentType = 'text/plain') {
  await test.info().attach(name, { body, contentType })
}

export type { BrowserContext }
