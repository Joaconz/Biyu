// Runner de la ejecución de CP-EXP-001 a 075 (Entrega 2). Solo apunta al stack local: Vite en :5173 y
// Supabase local en :54321 (ver README.md de esta carpeta).
import { chromium } from '../../../node_modules/playwright-core/index.mjs'
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
export const REPO = path.resolve(HERE, '../../..')
export const EVIDENCIA = path.resolve(HERE, '../../evidencia')
fs.mkdirSync(EVIDENCIA, { recursive: true })

export const APP = 'http://127.0.0.1:5173'
export const SB = 'http://127.0.0.1:54321'
export const PASSWORD = 'Clave123!'
export const ANON = JSON.parse(execSync('npx supabase status -o json', { cwd: REPO, stdio: ['ignore', 'pipe', 'ignore'] }).toString()).ANON_KEY
const RUN = Date.now().toString(36)

export async function api(p, { token, method = 'GET', body, headers = {} } = {}) {
  const res = await fetch(SB + p, { method, headers: { apikey: ANON, 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}), ...headers }, body: body === undefined ? undefined : JSON.stringify(body) })
  const text = await res.text()
  let json; try { json = JSON.parse(text) } catch { json = text }
  return { status: res.status, json }
}
export function emailFor(id, n = '001') { return `qa+${id.toLowerCase()}-${n}-${RUN}@example.com` }
export async function signUp(email) {
  const r = await api('/auth/v1/signup', { method: 'POST', body: { email, password: PASSWORD } })
  if (r.status !== 200) throw new Error('signup ' + r.status + JSON.stringify(r.json))
  return r.json.access_token
}
export async function login(email) {
  const r = await api('/auth/v1/token?grant_type=password', { method: 'POST', body: { email, password: PASSWORD } })
  return r.json.access_token
}
export async function newBrowser() { return chromium.launch() }
export async function newCtx(browser, { now = '2026-10-09T12:00:00-03:00', extra = {} } = {}) {
  const ctx = await browser.newContext({ locale: 'es-AR', timezoneId: 'America/Argentina/Buenos_Aires', acceptDownloads: true, viewport: { width: 420, height: 900 }, ...extra })
  const page = await ctx.newPage()
  if (now) await page.clock.setFixedTime(new Date(now))
  return { ctx, page }
}
/** PR-01: usuario nuevo (alta por API, ingreso por la pantalla y configuración inicial salteada). */
export async function prepUser(page, id, n = '001') {
  const email = emailFor(id, n)
  await signUp(email)
  await uiLogin(page, email)
  return { email, ...(await catalog(email)) }
}
export async function uiLogin(page, email) {
  await page.goto(APP + '/login')
  await page.getByTestId('login-form-email').fill(email)
  await page.getByTestId('login-form-password').fill(PASSWORD)
  await page.getByTestId('login-form-submit').click()
  const form = page.getByTestId('transaction-form')
  await form.or(page.getByTestId('setup-reason-skip')).waitFor({ timeout: 15000 })
  if (!(await form.isVisible())) {
    await page.getByTestId('setup-reason-skip').click()
    await page.getByTestId('setup-categories-skip').click()
    await page.getByTestId('setup-accounts-skip').click()
    await page.getByTestId('setup-expense-skip').click()
  }
  await page.waitForURL(/\/register$/)
}
export async function catalog(email) {
  const token = await login(email)
  const cats = (await api('/rest/v1/categories?select=id,name,archived_at', { token })).json
  const accs = (await api('/rest/v1/accounts?select=id,name,type,currency,archived_at', { token })).json
  return { token, cats, accs, cat: (n) => cats.find(c => c.name === n)?.id, acc: (n) => accs.find(a => a.name === n)?.id }
}
/** EXP-PREP-01: create_transaction con la sesión del usuario. */
export async function createTx(u, { type = 'expense', amount = '100.00', currency = 'ARS', fx = null, cat = 'Otros', acc = 'Efectivo', n = 1, on = '2026-09-15', desc = null, catId, accId, token } = {}) {
  const r = await api('/rest/v1/rpc/create_transaction', { token: token ?? u.token, method: 'POST', body: { p_type: type, p_amount: amount, p_currency: currency, p_fx_rate: fx, p_category_id: catId !== undefined ? catId : (type === 'income' ? null : u.cat(cat)), p_account_id: accId ?? u.acc(acc), p_installments_count: n, p_occurred_on: on, p_description: desc, p_request_id: null } })
  if (r.status !== 200) throw new Error('create_transaction ' + r.status + ' ' + JSON.stringify(r.json))
  return r.json
}
export const rpc = (u, fn, body) => api('/rest/v1/rpc/' + fn, { token: u.token, method: 'POST', body })
export async function openExport(page, period) {
  await page.goto(`${APP}/transactions${period ? '?period=' + period : ''}`)
  await page.getByTestId('transactions-title').waitFor()
  await page.getByTestId('transactions-export').click()
  await page.getByTestId('transactions-export-dialog').waitFor()
}
export async function download(page, action = () => page.getByTestId('transactions-export-submit').click()) {
  const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 20000 }), action()])
  const p = await dl.path()
  const buf = fs.readFileSync(p)
  const lines = buf.toString('utf8').replace(/^﻿/, '').split('\r\n').filter(Boolean)
  note(`Descarga: ${dl.suggestedFilename()} · ${buf.length} bytes · ${Math.max(lines.length - 1, 0)} fila(s) de datos` + (lines[1] ? ` · fila 1: ${lines[1].replace(/\n/g, '\\n').slice(0, 220)}` : ''))
  return { name: dl.suggestedFilename(), buf }
}
export async function noDownload(page, action, ms = 1500) {
  let got = false
  const h = () => { got = true }
  page.on('download', h)
  await action()
  await page.waitForTimeout(ms)
  page.off('download', h)
  note(got ? 'Descarga: se descargó un archivo' : 'Descarga: ninguna')
  return !got
}
export const HEADER = 'fecha,tipo,monto,moneda,tipo_de_cambio,monto_ars,categoria,cuenta,cuotas,primer_periodo,descripcion,id'
export const text = (buf) => buf.toString('utf8')
export const rows = (buf) => text(buf).replace(/^﻿/, '').split('\r\n').filter(Boolean)

// Registro de resultados
export const results = []
let obs = []
export const note = (msg) => { obs.push(msg) }
export async function run(id, title, fn) {
  const t0 = Date.now(); obs = []
  try { const n = await fn(); const duda = typeof n === 'string' && n.startsWith('DUDA:'); results.push({ id, status: duda ? 'DUDA' : 'PASSED', note: duda ? n.slice(5).trim() : (n ?? '') }) }
  catch (e) { results.push({ id, status: e.blocked ? 'BLOCKED' : 'FAILED', note: String(e.message).split('\n')[0].slice(0, 300) }) }
  const r = results.at(-1)
  r.obs = obs
  r.evidence = fs.existsSync(path.join(EVIDENCIA, id + '.jpg')) ? ['evidencia/' + id + '.jpg'] : []
  console.log(`${r.id} ${r.status} (${Date.now() - t0}ms) ${r.note}`)
}
/** Estado final de la pantalla al terminar el caso: lo observado y una captura en evidencia/. */
export async function snap(page, id) {
  try {
    const cid = id.toUpperCase()
    const st = await page.evaluate(() => {
      const t = (q) => document.querySelector(`[data-testid="${q}"]`)?.innerText?.trim()
      return { url: location.pathname + location.search, hoja: !!document.querySelector('[data-testid="transactions-export-dialog"]'), vacio: t('transactions-export-empty'), error: t('transactions-export-error'), exito: t('transactions-export-success'), futuro: t('transactions-export-future'), boton: t('transactions-export-submit') }
    })
    note(`Pantalla final: ${st.url} · hoja ${st.hoja ? 'abierta' : 'cerrada'}` + (st.boton && st.hoja ? ` · botón «${st.boton.replace(/\s+/g, ' ')}»` : '') + (st.vacio ? ` · mensaje: «${st.vacio}»` : '') + (st.error ? ` · error: «${st.error}»` : '') + (st.exito ? ` · aviso: «${st.exito}»` : '') + (st.futuro ? ` · aviso: «${st.futuro}»` : ''))
    await page.screenshot({ path: path.join(EVIDENCIA, cid + '.jpg'), type: 'jpeg', quality: 55 })
  } catch (e) { note('Pantalla final: no se pudo capturar (' + String(e.message).split('\n')[0] + ')') }
}
export const note2 = note
export function expect(cond, msg) { if (!cond) throw new Error(msg) }
export function blocked(msg) { const e = new Error(msg); e.blocked = true; throw e }
export function save(file) { fs.writeFileSync(file, JSON.stringify(results, null, 2)) }
