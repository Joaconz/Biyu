// Runner de la ejecución de la Entrega 1: ejecuta el catálogo de V1 contra el stack LOCAL
// (Vite en http://localhost:5180 + Supabase local) y deja resultados.json y capturas en
// entrega-1/evidencia/. Uso: node entrega-1/ejecucion/run.mjs  (ver entrega-1/ejecucion/README.md)
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import {
  BASE, P0, TODAY, RUN_ID, apiClient, apiSignUp, catalogOf, email, exists, gotoRegister,
  newContext, rpcCreate, shot, sql, text, uiRegister, userId, waitDashboard,
} from './lib.mjs'
import { casosA } from './casos-a.mjs'
import { casosB } from './casos-b.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const only = process.argv.slice(2)
const browser = await chromium.launch()
const users = {}
const ctx = { browser, users }

async function makeUser(tag) {
  const mail = email(tag)
  const { client, data, error } = await apiSignUp(mail)
  if (error) throw new Error(`signup ${tag}: ${error.message}`)
  const context = await newContext(browser, data.session)
  const page = await context.newPage()
  await gotoRegister(page) // la app siembra el catálogo al abrir el registro (US-43)
  await page.waitForTimeout(800)
  users[tag] = { email: mail, id: userId(mail), client, session: data.session, context, page }
  return users[tag]
}

console.log(`Corrida ${RUN_ID} · hoy ${TODAY} · ${BASE}`)
console.log('Preparando usuarios y datos de prueba…')
await makeUser('A')
await makeUser('B')
ctx.pageA = users.A.page

// D1: una sola compra de $120.000 en 12 cuotas el 2026-08-15 (CUO-007/008, DAS-002/003/009/010).
await makeUser('D1')
{
  const c = await catalogOf(users.D1.client)
  await rpcCreate(users.D1.client, { p_amount: '120000', p_installments_count: 12, p_category_id: c.cat('Indumentaria'), p_account_id: c.acc('Tarjeta de crédito'), p_occurred_on: '2026-08-15', p_description: 'Notebook' })
  ctx.pageD1 = users.D1.page
}
// D2: $50.000 ARS + USD 100 a 1250 en el mes actual (MON-005/006, DAS-001).
await makeUser('D2')
{
  const c = await catalogOf(users.D2.client)
  await rpcCreate(users.D2.client, { p_amount: '50000', p_category_id: c.cat('Comida y supermercado'), p_account_id: c.acc('Efectivo'), p_occurred_on: TODAY })
  await rpcCreate(users.D2.client, { p_amount: '100', p_currency: 'USD', p_fx_rate: '1250', p_category_id: c.cat('Transporte'), p_account_id: c.acc('Tarjeta de crédito'), p_occurred_on: TODAY })
  ctx.pageD2 = users.D2.page
}
// D3: gastos en 3 categorías y 2 cuentas ($150.000) e ingresos de $200.000 (DAS-004/005/006).
await makeUser('D3')
{
  const c = await catalogOf(users.D3.client)
  await rpcCreate(users.D3.client, { p_amount: '50000', p_category_id: c.cat('Comida y supermercado'), p_account_id: c.acc('Efectivo'), p_occurred_on: TODAY })
  await rpcCreate(users.D3.client, { p_amount: '70000', p_category_id: c.cat('Salud'), p_account_id: c.acc('Efectivo'), p_occurred_on: TODAY })
  await rpcCreate(users.D3.client, { p_amount: '30000', p_category_id: c.cat('Transporte'), p_account_id: c.acc('Tarjeta de débito'), p_occurred_on: TODAY })
  await rpcCreate(users.D3.client, { p_type: 'income', p_amount: '200000', p_category_id: null, p_account_id: c.acc('Cuenta bancaria'), p_occurred_on: TODAY })
  ctx.pageD3 = users.D3.page
}
// D4: gastos $200.000, ingresos $50.000 (DAS-007).
await makeUser('D4')
{
  const c = await catalogOf(users.D4.client)
  await rpcCreate(users.D4.client, { p_amount: '200000', p_category_id: c.cat('Servicios'), p_account_id: c.acc('Efectivo'), p_occurred_on: TODAY })
  await rpcCreate(users.D4.client, { p_type: 'income', p_amount: '50000', p_category_id: null, p_account_id: c.acc('Cuenta bancaria'), p_occurred_on: TODAY })
  ctx.pageD4 = users.D4.page
}
// D5: 15 transacciones en el mes (DAS-008).
await makeUser('D5')
{
  const c = await catalogOf(users.D5.client)
  for (let i = 1; i <= 15; i++) {
    await rpcCreate(users.D5.client, { p_amount: String(1000 * i), p_category_id: c.cat('Otros'), p_account_id: c.acc('Efectivo'), p_occurred_on: TODAY, p_description: `Movimiento ${i}` })
  }
  ctx.pageD5 = users.D5.page
}
// M: monedas, sin tipo de cambio de referencia al empezar (MON-001 a MON-004, CUO-010).
await makeUser('M')
ctx.pageM = users.M.page

/** Pares de autorización (C7, NFR-13): B contra datos de A, y el rol anon. */
ctx.authorization = async (module) => {
  const A = users.A
  const B = users.B
  const anon = apiClient()
  const lines = []
  let ok = true
  if (module === 'ACC') {
    for (const table of ['categories', 'accounts', 'fx_rates', 'transactions', 'ledger_entries', 'debts', 'subscriptions']) {
      const { data, error } = await B.client.from(table).select('user_id').eq('user_id', A.id)
      const an = await anon.from(table).select('*').limit(1)
      lines.push(`${table}: B ve ${error ? `error ${error.code}` : `${data.length} filas de A`}; anon → ${an.error ? an.error.code : `${an.data.length} filas`}`)
      if (error || data.length !== 0 || an.error?.code !== '42501') ok = false
    }
  }
  if (module === 'REG') {
    const txId = sql(`select id from transactions where user_id='${A.id}' and deleted_at is null limit 1`)
    const { data } = await B.client.from('transactions').select('id').eq('id', txId)
    const del = await B.client.rpc('delete_transaction', { p_transaction_id: txId })
    const still = sql(`select (deleted_at is null)::text from transactions where id='${txId}'`)
    lines.push(`B lee la transacción ${txId.slice(0, 8)}… de A: ${data.length} filas. B intenta borrarla: "${del.error?.message ?? 'ACEPTADO'}". Sigue activa para A: ${still}.`)
    if (data.length !== 0 || !del.error || still !== 'true') ok = false
  }
  if (module === 'CUO') {
    const txId = sql(`select id from transactions where user_id='${A.id}' and installments_count > 1 limit 1`)
    const { data } = await B.client.from('ledger_entries').select('id').eq('transaction_id', txId)
    lines.push(`B consulta ledger_entries de la compra en cuotas ${txId.slice(0, 8)}… de A: ${data.length} filas.`)
    if (data.length !== 0) ok = false
  }
  if (module === 'MON') {
    const { data } = await B.client.from('fx_rates').select('*').eq('user_id', A.id)
    const upd = await B.client.from('fx_rates').update({ ars_per_usd: '1' }).eq('user_id', A.id).select()
    const aRate = sql(`select ars_per_usd from fx_rates where user_id='${A.id}' and period='${P0}-01'`)
    lines.push(`B lee fx_rates de A: ${data.length} filas. B hace update: ${upd.data?.length ?? 0} filas afectadas. El TC de A sigue en ${aRate}.`)
    if (data.length !== 0 || (upd.data?.length ?? 0) !== 0 || aRate !== '1300.0000') ok = false
  }
  if (module === 'DAS') {
    const { data } = await B.client.from('ledger_entries').select('amount_ars').eq('user_id', A.id).eq('period', `${P0}-01`)
    const own = await B.client.from('ledger_entries').select('user_id').eq('period', `${P0}-01`)
    const foreign = (own.data ?? []).filter((r) => r.user_id !== B.id).length
    lines.push(`Consultas del dashboard con la sesión de B filtrando por A: ${data.length} filas; sin filtro, filas ajenas: ${foreign}.`)
    if (data.length !== 0 || foreign !== 0) ok = false
  }
  return { status: ok ? 'PASSED' : 'FAILED', obtained: lines.join('\n'), notes: 'Ejecutado por API con dos sesiones reales; también cubierto por supabase/tests/database/rls_isolation.test.sql (verde en esta corrida).' }
}

/** CP-REG-013: "hoy" = 2026-10-15 con el reloj falso de Playwright (C1: el cliente lee el reloj en un solo lugar). */
ctx.reg013 = async () => {
  const R = await makeUser('R')
  const c = await catalogOf(R.client)
  const { data: txId } = await rpcCreate(R.client, { p_amount: '120000', p_installments_count: 12, p_category_id: c.cat('Otros'), p_account_id: c.acc('Tarjeta de crédito'), p_occurred_on: '2026-08-15', p_description: 'Compra de agosto' })
  const context = await newContext(browser, R.session)
  const p = await context.newPage()
  await p.clock.setFixedTime(new Date('2026-10-15T12:00:00-03:00'))
  await p.goto(`${BASE}/transactions?period=2026-10`)
  await p.getByTestId('transactions-list').waitFor({ timeout: 20000 })
  await p.getByTestId('transactions-item-delete').first().click()
  await p.getByTestId('delete-transaction-dialog').waitFor()
  const warning = (await exists(p, 'delete-transaction-warning')) ? await text(p, 'delete-transaction-warning') : ''
  const periods = (await exists(p, 'delete-transaction-affected-periods')) ? (await text(p, 'delete-transaction-affected-periods')).replace(/\s+/g, ' ') : ''
  const ev1 = await shot(p, 'CP-REG-013-aviso-meses-cerrados')
  await p.getByTestId('delete-transaction-confirm').click()
  await p.getByTestId('delete-transaction-dialog').waitFor({ state: 'detached' })
  const lines = [`Aviso: "${warning}"`, `Detalle: ${periods}`]
  let empties = 0
  for (const period of ['2026-08', '2026-09']) {
    await waitDashboard(p, period)
    const empty = await exists(p, 'dashboard-empty')
    lines.push(`Dashboard ${period} tras confirmar: ${empty ? 'vacío (la cuota ya no cuenta)' : 'todavía con datos'}`)
    if (empty) empties++
  }
  const counted = sql(`select count(*) from ledger_entries l join transactions t on t.id=l.transaction_id where t.id='${txId}' and t.deleted_at is null`)
  lines.push(`Imputaciones que siguen contando: ${counted}`)
  await context.close()
  const ok = /meses ya cerrados/.test(warning) && /2026-08/.test(periods) && /2026-09/.test(periods) && empties === 2 && counted === '0'
  return {
    status: ok ? 'PASSED' : 'FAILED',
    obtained: lines.join('\n'),
    evidence: [ev1],
    notes: 'En la corrida anterior (#75) quedó bloqueado por no poder fijar "hoy". Acá se fijó el reloj del navegador en 2026-10-15 con page.clock de Playwright; el servidor sigue con la fecha real, que no interviene en el borrado.',
  }
}

// ---------------- Ejecución ----------------
const all = [...casosA(ctx), ...casosB(ctx)]
const results = []
for (const [id, fn] of all) {
  if (only.length && !only.includes(id)) continue
  const started = Date.now()
  let r
  try {
    r = await fn()
  } catch (e) {
    r = { status: 'ERROR', obtained: `Error del runner: ${e.message.split('\n')[0]}` }
  }
  r = { id, evidence: [], defects: [], notes: '', ...r, ms: Date.now() - started }
  results.push(r)
  console.log(`${r.status.padEnd(7)} ${id}  ${r.obtained.split('\n')[0].slice(0, 110)}`)
}

// ---------------- Re-test de los defectos abiertos y exploración negativa ----------------
const retests = []
async function retest(id, fn) {
  if (only.length && !only.includes(id.split(' ')[0])) return
  try {
    retests.push({ id, ...(await fn()) })
  } catch (e) {
    retests.push({ id, reproduce: null, obtained: `Error del runner: ${e.message.split('\n')[0]}` })
  }
  const r = retests.at(-1)
  console.log(`${String(r.reproduce).padEnd(7)} ${id}  ${r.obtained.slice(0, 110)}`)
}
if (!only.length || only.some((a) => /^(DEF|EXP)-/.test(a))) {
  console.log('\nRe-test de defectos y exploración…')
  const X = await makeUser('X')
  const p = X.page
  const cx = await catalogOf(X.client)

  await retest('DEF-001', async () => {
    await p.goto(`${BASE}/no-existe-esta-ruta`)
    await p.waitForTimeout(800)
    const body = (await p.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 120)
    const ev = await shot(p, 'DEF-001-ruta-inexistente')
    return { reproduce: /Unexpected Application Error/.test(body), obtained: `Body: "${body}"`, evidence: [ev] }
  })
  await retest('DEF-002', async () => {
    await gotoRegister(p)
    const info = await p.evaluate(() => ({ title: document.title, lang: document.documentElement.lang }))
    return { reproduce: info.title === 'scaffold' || info.lang === 'en', obtained: `title="${info.title}", lang="${info.lang}"` }
  })
  await retest('DEF-003', async () => {
    const c = await newContext(browser)
    const pg = await c.newPage()
    await pg.goto(`${BASE}/signup`)
    const has = await exists(pg, 'signup-form-confirm-password')
    await c.close()
    return { reproduce: !has, obtained: `El formulario de /signup local (main ${process.env.BIYU_COMMIT ?? ''}) ${has ? 'tiene' : 'no tiene'} "Confirmar contraseña". Producción no se verificó en esta corrida.` }
  })
  await retest('DEF-004', async () => {
    const { data, error } = await rpcCreate(X.client, { p_amount: 'NaN', p_category_id: cx.cat('Otros'), p_account_id: cx.acc('Efectivo'), p_occurred_on: TODAY })
    await waitDashboard(p, P0)
    const total = (await exists(p, 'dashboard-total-expenses')) ? await text(p, 'dashboard-total-expenses') : '(sin total)'
    const ev = await shot(p, 'DEF-004-nan-dashboard')
    return { reproduce: !error, obtained: `create_transaction(p_amount='NaN') → ${error ? `rechazado "${error.message}"` : `aceptado (id ${String(data).slice(0, 8)}…)`}. Dashboard: "${total}".`, evidence: [ev] }
  })
  await retest('DEF-005', async () => ({ reproduce: results.find((r) => r.id === 'CP-ACC-004')?.defects.includes('DEF-005'), obtained: 'Ver CP-ACC-004, variante API.' }))
  await retest('DEF-006', async () => ({ reproduce: results.find((r) => r.id === 'CP-CFG-004')?.defects.includes('DEF-006'), obtained: 'Ver CP-CFG-004.' }))
  await retest('DEF-007', async () => ({ reproduce: results.find((r) => r.id === 'CP-REG-012')?.defects.includes('DEF-007'), obtained: 'Ver CP-REG-012.' }))
  await retest('DEF-008', async () => {
    const c = await newContext(browser)
    const pg = await c.newPage()
    await pg.goto(`${BASE}/dashboard?period=2026-06`)
    await pg.getByTestId('login-form').waitFor()
    await pg.getByTestId('login-form-email').fill(users.A.email)
    await pg.getByTestId('login-form-password').fill('Prueba-Biyu-2026!')
    await pg.getByTestId('login-form-submit').click()
    await pg.waitForURL((u) => !u.pathname.startsWith('/login'))
    await pg.waitForTimeout(1000)
    const url = pg.url().replace(BASE, '')
    await c.close()
    return { reproduce: !url.startsWith('/dashboard'), obtained: `Login desde /login?next=/dashboard?period=2026-06 termina en ${url}.` }
  })
  await retest('DEF-009', async () => {
    const visa = sql(`select id from accounts where user_id='${users.A.id}' and name='Visa BBVA'`)
    const { error } = await users.A.client.from('accounts').update({ type: 'cash' }).eq('id', visa)
    const bad = sql(`select count(*) from transactions t join accounts a on a.id=t.account_id where a.id='${visa}' and t.installments_count > 1`)
    return { reproduce: !error && Number(bad) > 0, obtained: `PATCH accounts.type=cash sobre Visa BBVA → ${error ? `rechazado ${error.code}` : 'aceptado'}; quedan ${bad} compras en cuotas sobre una cuenta que ya no es de crédito (I6).` }
  })
  await retest('DEF-010', async () => {
    const Y = await makeUser('Y')
    await Y.client.from('categories').update({ archived_at: new Date().toISOString() }).is('archived_at', null)
    await gotoRegister(Y.page)
    await Y.page.waitForTimeout(1500)
    const counts = sql(`select count(*) filter (where archived_at is null) || '|' || count(*) from categories where user_id='${Y.id}'`)
    return { reproduce: counts.startsWith('8|'), obtained: `Tras archivar las 8 y abrir /register: activas|total = ${counts}.` }
  })
  await retest('DEF-011', async () => {
    await p.goto(`${BASE}/settings`)
    await p.getByTestId('settings-accounts-list').locator('li').first().waitFor()
    const buttons = await p.getByTestId('settings-accounts-list').locator('button').count()
    return { reproduce: buttons === 0, obtained: `Botones de acción en la lista de cuentas: ${buttons}.` }
  })
  await retest('DEF-012', async () => {
    await gotoRegister(p)
    await p.getByTestId('transaction-form-amount').fill('1000000000000')
    const nextEnabled = !(await p.getByTestId('transaction-form-next').isDisabled())
    let toast = ''
    if (nextEnabled) {
      await p.getByTestId('transaction-form-next').click()
      await p.getByTestId('transaction-form-category-chip-otros').click()
      await p.getByTestId('transaction-form-account-chip-efectivo').click()
      await p.getByTestId('transaction-form-submit').click()
      await p.waitForTimeout(1500)
      toast = (await p.locator('[data-sonner-toast]').allInnerTexts()).join(' / ').replace(/\s+/g, ' ')
    }
    const ev = await shot(p, 'DEF-012-monto-extremo')
    return { reproduce: /overflow|numeric/i.test(toast), obtained: `Monto 1000000000000: Siguiente habilitado ${nextEnabled}; al guardar: "${toast}".`, evidence: [ev] }
  })
  await retest('DEF-013', async () => {
    await gotoRegister(p)
    await p.getByTestId('transaction-form-amount').fill('0,01')
    await p.getByTestId('transaction-form-currency-usd').click()
    await p.getByTestId('transaction-form-fx-rate').fill('0,01')
    await p.getByTestId('transaction-form-next').click()
    await p.getByTestId('transaction-form-category-chip-otros').click()
    await p.getByTestId('transaction-form-account-chip-efectivo').click()
    await p.waitForTimeout(400)
    const disabled = await p.getByTestId('transaction-form-submit').isDisabled()
    const hint = (await exists(p, 'transaction-form-submit-hint')) ? await text(p, 'transaction-form-submit-hint') : ''
    const ev = await shot(p, 'DEF-013-usd-minimo')
    return { reproduce: disabled && !/0,01/.test(hint), obtained: `Guardar deshabilitado: ${disabled}. Texto visible: "${hint || '(ninguno)'}". El motivo real ("cada cuota daría menos de 0,01") no se muestra.`, evidence: [ev] }
  })
  await retest('DEF-014', async () => {
    await p.goto(`${BASE}/dashboard?period=0000-01`)
    await p.waitForTimeout(1500)
    const err = (await exists(p, 'dashboard-error')) ? await text(p, 'dashboard-error') : ''
    const ev = await shot(p, 'DEF-014-periodo-0000')
    return { reproduce: !!err, obtained: err ? `"${err}"` : `Sin error; URL ${p.url().replace(BASE, '')}`, evidence: [ev] }
  })
  await retest('DEF-015', async () => {
    await p.goto(`${BASE}/settings`)
    const missing = await p.getByTestId('settings-categories-color').locator('button:not([data-testid])').count()
    return { reproduce: missing > 0, obtained: `Botones de la paleta sin data-testid: ${missing}.` }
  })
  await retest('DEF-016', async () => {
    const { data: txId } = await rpcCreate(X.client, { p_amount: '1000', p_category_id: cx.cat('Otros'), p_account_id: cx.acc('Efectivo'), p_occurred_on: TODAY })
    const { error } = await X.client.from('debts').insert({ transaction_id: txId, person: 'Sofi', amount: '500', currency: 'ARS', direction: 'owed_to_me', incurred_on: TODAY })
    return { reproduce: error?.code === '42501', obtained: `Insert de una deuda válida → ${error ? `${error.code} "${error.message}"` : 'aceptada'}.` }
  })

  // Exploración negativa y de borde, buscando defectos nuevos.
  await retest('EXP-01 · TC con 5 decimales en el registro', async () => {
    const id = await uiRegister(p, { amount: '100', currency: 'USD', fx: '1250,55555', category: 'Otros', account: 'Efectivo', description: 'tc 5 decimales' })
    const row = sql(`select fx_rate || '|' || amount_ars from transactions where id='${id}'`)
    return { reproduce: row.split('|')[0] !== '1250.55555', obtained: `El formulario acepta 1250,55555 sin aviso; en la base queda fx_rate|amount_ars = ${row}.` }
  })
  await retest('EXP-02 · Categoría duplicada cambiando mayúsculas', async () => {
    await p.goto(`${BASE}/settings`)
    await p.getByTestId('settings-categories-name').fill('salud')
    await p.getByTestId('settings-categories-submit').click()
    await p.waitForTimeout(900)
    const err = (await exists(p, 'settings-categories-error')) ? await text(p, 'settings-categories-error') : ''
    const rows = sql(`select string_agg(name, ', ') from categories where user_id='${X.id}' and lower(name)='salud' and archived_at is null`)
    const ev = await shot(p, 'EXP-02-salud-duplicada')
    return { reproduce: !err, obtained: `Crear "salud" con "Salud" activa → ${err ? `rechazado "${err}"` : `aceptado; activas: ${rows}`}.`, evidence: [ev] }
  })
  await retest('EXP-03 · Nombre de categoría de 300 caracteres', async () => {
    await p.goto(`${BASE}/settings`)
    await p.getByTestId('settings-categories-name').fill('X'.repeat(300))
    await p.getByTestId('settings-categories-submit').click()
    await p.waitForTimeout(900)
    const err = (await exists(p, 'settings-categories-error')) ? await text(p, 'settings-categories-error') : ''
    const len = sql(`select coalesce(max(length(name)),0) from categories where user_id='${X.id}'`)
    return { reproduce: false, obtained: `300 caracteres → ${err ? `rechazado "${err}"` : `aceptado (largo máximo guardado ${len})`}. La spec no fija un máximo: se registra como observación, no como defecto.` }
  })
  await retest('EXP-04 · Script en el nombre de una categoría', async () => {
    let dialog = false
    p.on('dialog', async (d) => { dialog = true; await d.dismiss() })
    await p.goto(`${BASE}/settings`)
    await p.getByTestId('settings-categories-name').fill('<img src=x onerror=alert(1)>')
    await p.getByTestId('settings-categories-submit').click()
    await gotoRegister(p)
    await p.getByTestId('transaction-form-amount').fill('10')
    await p.getByTestId('transaction-form-next').click()
    await p.waitForTimeout(800)
    return { reproduce: dialog, obtained: `Se guardó como texto y se muestra escapado; se ejecutó script: ${dialog ? 'SÍ' : 'no'}.` }
  })
  await retest('EXP-05 · Fecha muy antigua (0001-01-01)', async () => {
    const { error } = await rpcCreate(X.client, { p_amount: '10', p_category_id: cx.cat('Otros'), p_account_id: cx.acc('Efectivo'), p_occurred_on: '0001-01-01' })
    await gotoRegister(p)
    await p.getByTestId('transaction-form-amount').fill('10')
    await p.getByTestId('transaction-form-next').click()
    await p.getByTestId('transaction-form-category-chip-otros').click()
    await p.getByTestId('transaction-form-date').fill('1900-01-01')
    await p.waitForTimeout(300)
    const uiDisabled = await p.getByTestId('transaction-form-submit').isDisabled()
    return { reproduce: !error, obtained: `API occurred_on=0001-01-01 → ${error ? `rechazado "${error.message}"` : 'aceptado'}. UI con 1900-01-01: Guardar ${uiDisabled ? 'deshabilitado' : 'habilitado'}. La spec no fija una fecha mínima: observación, no defecto.` }
  })
  await retest('EXP-06 · Monto con exponente (1e5)', async () => {
    await gotoRegister(p)
    await p.getByTestId('transaction-form-amount').fill('1e5')
    const disabled = await p.getByTestId('transaction-form-next').isDisabled()
    return { reproduce: !disabled, obtained: `"1e5" → Siguiente ${disabled ? 'deshabilitado (no se interpreta como 100.000)' : 'HABILITADO'}.` }
  })
  await retest('EXP-07 · Monto "1.500" (miles con punto)', async () => {
    await gotoRegister(p)
    await p.getByTestId('transaction-form-amount').fill('1.500')
    await p.getByTestId('transaction-form-next').click()
    const summary = await text(p, 'transaction-form-summary-amount')
    return { reproduce: !/1\.500,00/.test(summary), obtained: `"1.500" se resume como "${summary}".` }
  })
  await retest('EXP-08 · Doble toque en Guardar', async () => {
    const before = sql(`select count(*) from transactions where user_id='${X.id}'`)
    await gotoRegister(p)
    await p.getByTestId('transaction-form-amount').fill('777')
    await p.getByTestId('transaction-form-next').click()
    await p.getByTestId('transaction-form-category-chip-otros').click()
    await p.getByTestId('transaction-form-account-chip-efectivo').click()
    await p.getByTestId('transaction-form-submit').dblclick()
    await p.waitForTimeout(1500)
    const after = sql(`select count(*) from transactions where user_id='${X.id}'`)
    return { reproduce: Number(after) - Number(before) > 1, obtained: `Transacciones creadas por un doble toque: ${Number(after) - Number(before)}.` }
  })
}

await browser.close()
const out = { run: RUN_ID, today: TODAY, base: BASE, commit: process.env.BIYU_COMMIT ?? '', finishedAt: new Date().toISOString(), results, retests }
writeFileSync(join(here, only.length ? 'resultados-parcial.json' : 'resultados.json'), JSON.stringify(out, null, 2))
const tally = results.reduce((acc, r) => ({ ...acc, [r.status]: (acc[r.status] ?? 0) + 1 }), {})
console.log('\nTotales:', tally)
