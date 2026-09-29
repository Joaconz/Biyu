// Utilidades del runner de ejecución de la Entrega 1. Solo apunta al stack LOCAL (Vite en
// localhost + Supabase local): nunca a producción. Los usuarios y montos son ficticios (C14).
import { execFileSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const here = dirname(fileURLToPath(import.meta.url))
export const EVIDENCE_DIR = join(here, '..', 'evidencia')
mkdirSync(EVIDENCE_DIR, { recursive: true })

export const BASE = process.env.BIYU_URL ?? 'http://localhost:5180'
export const SUPABASE_URL = 'http://127.0.0.1:54321'
const status = JSON.parse(execFileSync('supabase', ['status', '-o', 'json'], { encoding: 'utf8' }))
export const ANON_KEY = status.ANON_KEY
export const STORAGE_KEY = 'sb-127-auth-token'

// Contraseña de prueba de las cuentas locales que crea este runner (cumple US-67).
export const TEST_PASSWORD = 'Prueba-Biyu-2026!'
export const RUN_ID = Date.now().toString(36)
export const email = (tag) => `e1-${tag}-${RUN_ID}@biyu.test`.toLowerCase()

// "Hoy" en hora argentina (ADR-021), leído una sola vez al empezar la corrida.
export const TODAY = new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Argentina/Buenos_Aires' })
export const P0 = TODAY.slice(0, 7)
export function addDaysIso(iso, delta) {
  const d = new Date(`${iso}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + delta)
  return d.toISOString().slice(0, 10)
}
export function addMonthsPeriod(period, delta) {
  const [y, m] = period.split('-').map(Number)
  const total = y * 12 + (m - 1) + delta
  return `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, '0')}`
}

// ---------- Oráculo: consultas directas a la base local ----------
const dbContainer = execFileSync('docker', ['ps', '--format', '{{.Names}}'], { encoding: 'utf8' })
  .split('\n')
  .find((n) => n.startsWith('supabase_db_'))
export function sql(query) {
  return execFileSync('docker', ['exec', dbContainer, 'psql', '-U', 'postgres', '-tA', '-F', '|', '-c', query], {
    encoding: 'utf8',
  }).trim()
}
export const userId = (mail) => sql(`select id from auth.users where email = '${mail}'`)

// ---------- API (como lo haría un cliente cualquiera, con la anon key y la sesión del usuario) ----------
export function apiClient() {
  return createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
}

async function withRateLimitRetry(fn) {
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fn()
    const code = res?.error?.code ?? ''
    if (res?.error && (res.error.status === 429 || /rate_limit/.test(code))) {
      console.log('   … límite de sign-in/sign-up de Supabase Auth local, espero 60 s')
      await new Promise((r) => setTimeout(r, 60_000))
      continue
    }
    return res
  }
  throw new Error('rate limit persistente')
}

/** Crea una cuenta por la API de Auth y devuelve cliente + sesión. */
export async function apiSignUp(mail, password = TEST_PASSWORD) {
  const client = apiClient()
  const res = await withRateLimitRetry(() => client.auth.signUp({ email: mail, password }))
  return { client, ...res }
}

export async function rpcCreate(client, args) {
  return client.rpc('create_transaction', {
    p_type: 'expense',
    p_currency: 'ARS',
    p_fx_rate: null,
    p_installments_count: 1,
    p_description: null,
    ...args,
  })
}

export async function catalogOf(client) {
  const { data: cats } = await client.from('categories').select('id,name,archived_at')
  const { data: accs } = await client.from('accounts').select('id,name,type,archived_at')
  const cat = (name) => cats.find((c) => c.name === name && !c.archived_at)?.id
  const acc = (name) => accs.find((a) => a.name === name && !a.archived_at)?.id
  return { cats, accs, cat, acc }
}

// ---------- UI ----------
export async function newContext(browser, session) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    locale: 'es-AR',
    timezoneId: 'America/Argentina/Buenos_Aires',
  })
  if (session) {
    await context.addInitScript(
      ([key, value]) => {
        if (!window.localStorage.getItem(key)) window.localStorage.setItem(key, value)
      },
      [STORAGE_KEY, JSON.stringify(session)],
    )
  }
  return context
}

export async function shot(page, name) {
  const file = `${name}.jpg`
  await page.waitForTimeout(350) // deja terminar las transiciones de 260 ms antes de la captura
  await page.screenshot({ path: join(EVIDENCE_DIR, file), type: 'jpeg', quality: 82 })
  return `evidencia/${file}`
}

export const slug = (name) =>
  name
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export async function gotoRegister(page) {
  await page.goto(`${BASE}/register`)
  await page.getByTestId('transaction-form-amount').waitFor()
}

/**
 * Registra una transacción por la UI, paso a paso (ADR-024). Devuelve el id que respondió
 * create_transaction, o lanza si el guardado falló.
 */
export async function uiRegister(page, o, shots = {}) {
  await gotoRegister(page)
  if (o.type === 'income') await page.getByTestId('transaction-form-type-income').click()
  await page.getByTestId('transaction-form-amount').fill(o.amount)
  if (o.currency === 'USD') {
    await page.getByTestId('transaction-form-currency-usd').click()
    await page.getByTestId('transaction-form-fx-rate').waitFor()
    await page.waitForFunction(() => !document.querySelector('[data-testid="transaction-form-fx-loading"]'))
    if (o.fx !== undefined) await page.getByTestId('transaction-form-fx-rate').fill(o.fx)
  }
  if (shots.amount) await shot(page, shots.amount)
  await page.getByTestId('transaction-form-next').click()
  if (o.type !== 'income') {
    await page.locator('[data-testid="transaction-form-step"][data-step="category"]').waitFor()
    if (shots.category) await shot(page, shots.category)
    await page.getByTestId(`transaction-form-category-chip-${slug(o.category ?? 'Otros')}`).click()
  }
  await page.locator('[data-testid="transaction-form-step"][data-step="details"]').waitFor()
  if (o.account) await page.getByTestId(`transaction-form-account-chip-${slug(o.account)}`).click()
  if (o.installments) await page.getByTestId(`transaction-form-installments-chip-${o.installments}`).click()
  if (o.date) await page.getByTestId('transaction-form-date').fill(o.date)
  if (o.description) await page.getByTestId('transaction-form-description').fill(o.description)
  if (shots.details) await shot(page, shots.details)
  const responsePromise = page.waitForResponse((r) => r.url().includes('/rpc/create_transaction'))
  await page.getByTestId('transaction-form-submit').click()
  const response = await responsePromise
  const body = await response.json()
  if (!response.ok()) throw new Error(`create_transaction ${response.status()}: ${JSON.stringify(body)}`)
  await page.getByTestId('transaction-form-submit').filter({ hasText: 'Guardado' }).waitFor()
  if (shots.saved) await shot(page, shots.saved)
  return body
}

export async function waitDashboard(page, period) {
  await page.goto(`${BASE}/dashboard?period=${period}`)
  await page.waitForFunction(() => !document.querySelector('[data-testid="dashboard-loading"]'))
  await page.waitForTimeout(300)
}

export const text = async (page, testId) => ((await page.getByTestId(testId).first().textContent()) ?? '').trim()
export const exists = async (page, testId) => (await page.getByTestId(testId).count()) > 0
