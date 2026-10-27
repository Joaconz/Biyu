import * as L from './lib.mjs'
import { randomUUID } from 'node:crypto'
const { run, expect, prepUser, createTx, openExport, download, noDownload, rows, text, rpc, api, APP } = L
const OUT = new URL('./resultados-b.json', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const b = await L.newBrowser()
async function withUser(id, fn, opts) {
  const { ctx, page } = await L.newCtx(b, opts)
  try { const u = await prepUser(page, id); return await fn(page, u, ctx) } finally { await L.snap(page, id); await ctx.close() }
}
const SEP = (s) => `No tenés movimientos con fecha en ${s}.`
const submit = (p) => p.getByTestId('transactions-export-submit')
const dlg = (p) => p.getByTestId('transactions-export-dialog')
const ERR = 'No pudimos exportar tus movimientos. Probá de nuevo.'
const ok2xx = (r) => r.status === 200 || r.status === 204
const delay = (ms) => (route) => setTimeout(() => route.continue().catch(() => {}), ms)
async function card(u) {
  const a = await api('/rest/v1/accounts', { token: u.token, method: 'POST', headers: { Prefer: 'return=representation' }, body: { name: 'Visa BBVA', type: 'credit_card', currency: 'ARS' } })
  expect(a.status === 201, 'tarjeta ' + a.status + JSON.stringify(a.json)); return a.json[0].id
}
async function seed(u, n, on = '2025-09-15') {
  const ids = []; let i = 0
  async function worker() {
    while (true) {
      const k = i++; if (k >= n) return
      const r = await api('/rest/v1/rpc/create_transaction', { token: u.token, method: 'POST', body: { p_type: 'expense', p_amount: '1.00', p_currency: 'ARS', p_fx_rate: null, p_category_id: u.cat('Otros'), p_account_id: u.acc('Efectivo'), p_installments_count: 1, p_occurred_on: on, p_description: 'EXP-' + String(k + 1).padStart(4, '0'), p_request_id: randomUUID() } })
      if (r.status !== 200) throw new Error('seed ' + r.status + JSON.stringify(r.json)); ids.push(r.json)
    }
  }
  await Promise.all(Array.from({ length: 8 }, worker)); return ids
}

await run('CP-EXP-017', '', () => withUser('cp-exp-017', async (p, u) => {
  const id = await createTx(u, { amount: '200.00' }); expect(ok2xx(await rpc(u, 'delete_transaction', { p_transaction_id: id })), 'delete')
  await openExport(p, '2026-09')
  expect(await noDownload(p, () => submit(p).click()), 'descargó')
  expect((await p.getByTestId('transactions-export-empty').innerText()) === SEP('septiembre 2026'), 'msg')
}))
await run('CP-EXP-023', '', () => withUser('cp-exp-023', async (p, u) => {
  const id = await createTx(u, { amount: '120000.00', n: 12, on: '2026-08-15', accId: await card(u) })
  await openExport(p, '2026-08'); const f = await download(p); const r = rows(f.buf)
  expect(r.length === 2, 'filas ' + r.length)
  const c = r[1].split(','); expect(c[0] === '2026-08-15' && c[2] === '120000.00' && c[8] === '12' && c[9] === '2026-08' && c[11] === id, 'campos: ' + r[1])
}))
await run('CP-EXP-024', '', () => withUser('cp-exp-024', async (p, u) => {
  await createTx(u, { amount: '30000.00', n: 3, on: '2026-08-15', accId: await card(u) })
  await openExport(p, '2026-09'); expect(await noDownload(p, () => submit(p).click()), 'descargó')
  expect((await p.getByTestId('transactions-export-empty').innerText()) === SEP('septiembre 2026'), 'msg')
}))
// 040-042 volumen
for (const [n, N] of [['040', 1000], ['041', 1500], ['042', 2000]]) {
  await run('CP-EXP-' + n, '', () => withUser('cp-exp-' + n, async (p, u) => {
    const ids = await seed(u, N); expect(new Set(ids).size === N, 'ids distintos al sembrar')
    await openExport(p, '2025-09'); await p.getByTestId('transactions-export-scope-year').click()
    const f = await download(p); const got = rows(f.buf).slice(1).map(r => r.split(',').pop())
    expect(got.length === N && new Set(got).size === N, `filas=${got.length} distintas=${new Set(got).size}`)
    const set = new Set(ids); expect(got.every(x => set.has(x)), 'ids ajenos')
    const t = p.getByTestId('transactions-export-success'); await t.waitFor({ timeout: 5000 })
    const msg = (await t.innerText()).trim(); expect(msg === `Exportamos ${N.toLocaleString('es-AR')} movimientos`, 'aviso: ' + msg)
  }))
}
// 043/044 aislamiento
await run('CP-EXP-043', '', async () => {
  const { ctx, page } = await L.newCtx(b)
  try {
    const A = await prepUser(page, 'cp-exp-043', 'A')
    const { ctx: c2, page: p2 } = await L.newCtx(b); const Bu = await prepUser(p2, 'cp-exp-043', 'B'); await c2.close()
    const ia = await createTx(A, { amount: '111.00', desc: 'SOLO-A' }); const ib = await createTx(Bu, { amount: '999.00', desc: 'SOLO-B' })
    await openExport(page, '2026-09'); const f = await download(page); const t = text(f.buf)
    expect(rows(f.buf).length === 2 && t.includes('111.00') && t.includes('SOLO-A') && t.includes(ia), 'falta lo de A')
    expect(!t.includes('999.00') && !t.includes('SOLO-B') && !t.includes(ib), 'aparece lo de B')
  } finally { await L.snap(page, 'cp-exp-043'); await ctx.close() }
})
await run('CP-EXP-044', '', async () => {
  const { ctx, page } = await L.newCtx(b)
  try {
    const A = await prepUser(page, 'cp-exp-044', 'A'); const { ctx: c2, page: p2 } = await L.newCtx(b); const Bu = await prepUser(p2, 'cp-exp-044', 'B'); await c2.close()
    const ib = await createTx(Bu, {})
    const r = await api(`/rest/v1/transactions?select=id&id=eq.${ib}`, { token: A.token }); expect(r.status === 200 && Array.isArray(r.json) && r.json.length === 0, `API ${r.status} ${JSON.stringify(r.json)}`)
    const r2 = await api('/rest/v1/transactions?select=id', { token: A.token }); expect(r2.json.length === 0, 'A ve filas: ' + r2.json.length)
    L.note(`API con token de A: GET transactions?id=eq.<ID-B> → HTTP ${r.status}, ${JSON.stringify(r.json)}; GET transactions (sin filtro) → ${r2.json.length} filas`)
  } finally { await L.snap(page, 'cp-exp-044'); await ctx.close() }
})
await run('CP-EXP-045', '', () => withUser('cp-exp-045', async (p, u) => {
  const c = await api('/rest/v1/categories', { token: u.token, method: 'POST', headers: { Prefer: 'return=representation' }, body: { name: 'Viajes', color: '#336699' } }); const id = c.json[0].id
  await createTx(u, { catId: id })
  expect((await api('/rest/v1/categories?id=eq.' + id, { token: u.token, method: 'PATCH', headers: { Prefer: 'return=representation' }, body: { name: 'Viajes 2026' } })).status === 200, 'renombrar')
  expect((await api('/rest/v1/categories?id=eq.' + id, { token: u.token, method: 'PATCH', headers: { Prefer: 'return=representation' }, body: { archived_at: '2026-10-09T12:00:00-03:00' } })).status === 200, 'archivar')
  await openExport(p, '2026-09'); const f = await download(p); expect(rows(f.buf)[1].split(',')[6] === 'Viajes 2026', 'cat: ' + rows(f.buf)[1])
}))
await run('CP-EXP-046', '', () => withUser('cp-exp-046', async (p, u) => {
  const a = await api('/rest/v1/accounts', { token: u.token, method: 'POST', headers: { Prefer: 'return=representation' }, body: { name: 'Billetera QA', type: 'cash', currency: 'ARS' } }); const id = a.json[0].id
  await createTx(u, { accId: id })
  await api('/rest/v1/accounts?id=eq.' + id, { token: u.token, method: 'PATCH', body: { name: 'Billetera QA 2026' } })
  await api('/rest/v1/accounts?id=eq.' + id, { token: u.token, method: 'PATCH', body: { archived_at: '2026-10-09T12:00:00-03:00' } })
  await openExport(p, '2026-09'); const f = await download(p); expect(rows(f.buf)[1].split(',')[7] === 'Billetera QA 2026', 'cuenta: ' + rows(f.buf)[1])
}))
await run('CP-EXP-047', '', () => withUser('cp-exp-047', async (p, u) => {
  const acc = u.accs.find(a => a.name === 'Caja de ahorro') ?? u.accs.find(a => a.type !== 'cash' && a.type !== 'credit_card'); expect(acc, 'sin cuenta bancaria: ' + u.accs.map(a => a.name))
  await createTx(u, { type: 'income', amount: '850000.00', on: '2026-09-01', accId: acc.id })
  await openExport(p, '2026-09'); const f = await download(p); const c = rows(f.buf)[1].split(',')
  expect(c[1] === 'ingreso' && c[6] === '', 'fila: ' + rows(f.buf)[1])
}))
await run('CP-EXP-048', '', () => withUser('cp-exp-048', async (p, u) => {
  const a = await api('/rest/v1/accounts', { token: u.token, method: 'POST', headers: { Prefer: 'return=representation' }, body: { name: 'Cuenta descartable', type: 'cash', currency: 'ARS' } }); const id = a.json[0].id
  await createTx(u, { amount: '700.00', accId: id })
  const d = await rpc(u, 'delete_account', { p_account_id: id }); expect(d.status === 200, 'delete_account ' + d.status + JSON.stringify(d.json))
  await openExport(p, '2026-09'); expect(await noDownload(p, () => submit(p).click()), 'descargó')
  expect((await p.getByTestId('transactions-export-empty').innerText()) === SEP('septiembre 2026'), 'msg')
}))
// 049-051 estado Exportando
await run('CP-EXP-049', '', () => withUser('cp-exp-049', async (p, u) => {
  await createTx(u); await openExport(p, '2026-09'); await p.route('**/rest/v1/transactions*', delay(4000))
  await submit(p).click()
  expect((await submit(p).innerText()).includes('Exportando…'), 'texto: ' + await submit(p).innerText())
  expect(await submit(p).isDisabled() && (await submit(p).getAttribute('aria-busy')) === 'true', 'disabled/aria-busy')
}))
await run('CP-EXP-050', '', () => withUser('cp-exp-050', async (p, u) => {
  await createTx(u); await openExport(p, '2026-09'); await p.route('**/rest/v1/transactions*', delay(4000))
  await submit(p).click()
  const radios = dlg(p).locator('input[type=radio]'); expect((await radios.count()) === 2, 'radios')
  const dis = [await radios.nth(0).isDisabled(), await radios.nth(1).isDisabled(), await p.getByTestId('transactions-export-cancel').isDisabled(), await submit(p).isDisabled()]
  expect(dis.every(Boolean), 'deshabilitados: ' + dis)
}))
await run('CP-EXP-051', '', () => withUser('cp-exp-051', async (p, u) => {
  await createTx(u); await openExport(p, '2026-09')
  let n = 0; const h = () => n++; p.on('download', h)
  await submit(p).dblclick().catch(() => {}); await p.waitForTimeout(3000)
  expect(n === 1, 'descargas=' + n)
  expect((await p.getByTestId('transactions-export-success').count()) === 1, 'avisos=' + await p.getByTestId('transactions-export-success').count())
}))
await run('CP-EXP-052', '', () => withUser('cp-exp-052', async (p, u) => {
  await createTx(u); await openExport(p, '2026-09'); await download(p)
  const t = p.getByTestId('transactions-export-success'); await t.waitFor(); expect((await t.innerText()).trim() === 'Exportamos 1 movimiento', 'aviso: ' + await t.innerText())
  expect((await dlg(p).count()) === 0, 'hoja abierta'); expect((await t.count()) === 1, 'avisos')
}))
await run('CP-EXP-053', '', () => withUser('cp-exp-053', async (p, u) => {
  await createTx(u, { amount: '100.00' }); await createTx(u, { amount: '200.00' }); await openExport(p, '2026-09'); await download(p)
  const t = p.getByTestId('transactions-export-success'); await t.waitFor(); expect((await t.innerText()).trim() === 'Exportamos 2 movimientos', 'aviso: ' + await t.innerText())
  expect((await t.count()) === 1, 'avisos')
}))
await run('CP-EXP-054', '', () => withUser('cp-exp-054', async (p) => {
  await openExport(p, '2026-09'); expect(await noDownload(p, () => submit(p).click()), 'descargó')
  expect((await p.getByTestId('transactions-export-empty').innerText()) === SEP('septiembre 2026'), 'msg')
  await p.getByTestId('transactions-export-scope-year').click()
  expect((await p.getByTestId('transactions-export-scope-year').locator('input').isChecked()) && (await p.getByTestId('transactions-export-empty').count()) === 0, 'mensaje no desapareció')
}))
await run('CP-EXP-055', '', () => withUser('cp-exp-055', async (p) => {
  await openExport(p, '2025-06'); await p.getByTestId('transactions-export-scope-year').click()
  expect(await noDownload(p, () => submit(p).click()), 'descargó')
  expect((await p.getByTestId('transactions-export-empty').innerText()) === SEP('2025'), 'msg: ' + await p.getByTestId('transactions-export-empty').innerText())
}))
await run('CP-EXP-056', '', () => withUser('cp-exp-056', async (p, u) => {
  const id = await createTx(u); await rpc(u, 'delete_transaction', { p_transaction_id: id })
  await openExport(p, '2026-09'); expect(await noDownload(p, () => submit(p).click()), 'descargó')
  expect((await p.getByTestId('transactions-export-empty').innerText()) === SEP('septiembre 2026'), 'msg')
}))
// 057-059 offline
await run('CP-EXP-057', '', () => withUser('cp-exp-057', async (p, u, ctx) => {
  await createTx(u); await openExport(p, '2026-09'); await ctx.setOffline(true)
  expect(await noDownload(p, () => submit(p).click()), 'descargó')
  const e = p.getByTestId('transactions-export-error'); await e.waitFor({ timeout: 8000 })
  expect((await e.innerText()) === ERR && (await e.getAttribute('role')) === 'alert', 'error: ' + await e.innerText())
  expect(await submit(p).isEnabled() && await p.getByTestId('transactions-export-cancel').isEnabled() && await dlg(p).locator('input[type=radio]').first().isEnabled(), 'controles bloqueados')
}))
await run('CP-EXP-058', '', () => withUser('cp-exp-058', async (p, u, ctx) => {
  const a = await createTx(u, { amount: '100.00' }); const bb = await createTx(u, { amount: '200.00' })
  await openExport(p, '2026-09'); await ctx.setOffline(true); await submit(p).click(); await p.getByTestId('transactions-export-error').waitFor({ timeout: 8000 })
  await ctx.setOffline(false); const f = await download(p); const got = rows(f.buf).slice(1).map(r => r.split(',').pop()).sort()
  expect(JSON.stringify(got) === JSON.stringify([a, bb].sort()), 'ids ' + got)
  expect((await p.getByTestId('transactions-export-error').count()) === 0, 'error persiste')
  const t = p.getByTestId('transactions-export-success'); await t.waitFor(); expect((await t.innerText()).trim() === 'Exportamos 2 movimientos', 'aviso')
}))
await run('CP-EXP-059', '', () => withUser('cp-exp-059', async (p, u, ctx) => {
  await createTx(u); await openExport(p, '2026-09'); await ctx.setOffline(true); await submit(p).click(); await p.getByTestId('transactions-export-error').waitFor({ timeout: 8000 })
  expect(await noDownload(p, () => p.getByTestId('transactions-export-cancel').click(), 800), 'descargó')
  expect((await dlg(p).count()) === 0 && p.url().includes('period=2026-09'), 'hoja/URL')
}))
// 060-062 cierre
await run('CP-EXP-060', '', () => withUser('cp-exp-060', async (p, u) => {
  await createTx(u); await openExport(p, '2026-09'); expect(await noDownload(p, () => p.getByTestId('transactions-export-cancel').click(), 800), 'descargó')
  expect((await dlg(p).count()) === 0 && p.url().includes('period=2026-09'), 'hoja/URL')
}))
await run('CP-EXP-061', '', () => withUser('cp-exp-061', async (p, u) => {
  await createTx(u); await openExport(p, '2026-09'); expect(await noDownload(p, () => p.keyboard.press('Escape'), 800), 'descargó')
  expect((await dlg(p).count()) === 0 && p.url().includes('period=2026-09'), 'hoja/URL')
}))
// 067, 072
await run('CP-EXP-067', '', () => withUser('cp-exp-067', async (p, u) => {
  await createTx(u, { amount: '3000.00' }); await p.goto(`${APP}/transactions?period=2026-09`); await p.getByTestId('transactions-title').waitFor()
  const before = await p.getByTestId('transactions-item').count(); await p.getByTestId('transactions-export').click(); await download(p)
  expect(p.url().includes('period=2026-09') && (await p.getByTestId('transactions-item').count()) === before, 'cambió estado')
  await p.reload(); await p.getByTestId('transactions-title').waitFor(); await p.getByTestId('transactions-item').first().waitFor()
  expect((await p.getByTestId('transactions-item').count()) === 1 && (await p.locator('body').innerText()).includes('$3.000,00'), 'tras recargar')
  const d = await api('/rest/v1/transactions?select=id,deleted_at', { token: u.token }); expect(d.json.length === 1 && d.json[0].deleted_at === null, 'datos en API')
}))
await run('CP-EXP-072', '', () => withUser('cp-exp-072', async (p, u) => {
  await createTx(u, { amount: '3000.00' }); await p.goto(`${APP}/dashboard?period=2026-09`); await p.getByTestId('dashboard-total-expenses').waitFor()
  const before = (await p.getByTestId('dashboard-total-expenses').innerText()).trim(); expect(before === '$3.000,00', 'antes ' + before)
  await p.goto(`${APP}/transactions?period=2026-09`); await p.getByTestId('transactions-export').click(); await download(p)
  await p.goto(`${APP}/dashboard?period=2026-09`); await p.getByTestId('dashboard-total-expenses').waitFor()
  const after = (await p.getByTestId('dashboard-total-expenses').innerText()).trim(); expect(after === before, 'después ' + after)
}))
// 068 alta concurrente
await run('CP-EXP-068', '', () => withUser('cp-exp-068', async (p, u) => {
  await seed(u, 1500); await openExport(p, '2025-09'); await p.getByTestId('transactions-export-scope-year').click()
  let reqs = 0
  await p.route('**/rest/v1/transactions*', async (route) => {
    reqs++
    if (reqs === 2) await createTx(u, { amount: '2.00', on: '2025-12-31' })
    await route.continue()
  })
  expect(await noDownload(p, () => submit(p).click(), 6000), 'se descargó un archivo incompleto')
  const e = p.getByTestId('transactions-export-error'); await e.waitFor({ timeout: 5000 })
  expect((await e.innerText()) === ERR && (await e.getAttribute('role')) === 'alert' && await dlg(p).isVisible(), 'error/hoja; solicitudes=' + reqs)
}))
// 069-070
await run('CP-EXP-069', '', () => withUser('cp-exp-069', async (p, u) => {
  await createTx(u); await openExport(p, '2026-09'); await p.route('**/rest/v1/transactions*', delay(4000)); await submit(p).click(); await p.keyboard.press('Escape')
  expect((await dlg(p).isVisible()) && (await submit(p).innerText()).includes('Exportando…'), 'se cerró o cambió')
}))
await run('CP-EXP-070', '', () => withUser('cp-exp-070', async (p, u) => {
  await createTx(u); await openExport(p, '2026-09'); await p.route('**/rest/v1/transactions*', delay(4000)); await submit(p).click(); await p.mouse.click(5, 5)
  expect((await dlg(p).isVisible()) && (await submit(p).innerText()).includes('Exportando…'), 'se cerró o cambió')
  return 'Sin valor hoy: tocar fuera nunca cierra la hoja (DEF-030); el resultado sería el mismo sin el bloqueo'
}))
await run('CP-EXP-071', '', () => withUser('cp-exp-071', async (p, u) => {
  const id = await createTx(u, { desc: 'Uno, "dos"\nTres' }); await openExport(p, '2026-09'); const f = await download(p)
  const parsed = parseCsv(text(f.buf).replace(/^\uFEFF/, '')); expect(parsed.length === 2 && parsed.every(r => r.length === 12) && parsed[1][10] === 'Uno, "dos"\nTres' && parsed[1][11] === id, 'parse')
  return 'DUDA: Google Sheets no usado; validado con un lector RFC 4180 propio'
}))
// 073-075 errores simulados
await run('CP-EXP-073', '', () => withUser('cp-exp-073', async (p, u) => {
  await createTx(u); await openExport(p, '2026-09')
  await p.route('**/rest/v1/transactions*', (r) => r.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ code: 'XX000', message: 'fallo simulado' }) }))
  expect(await noDownload(p, () => submit(p).click()), 'descargó')
  const e = p.getByTestId('transactions-export-error'); await e.waitFor(); expect((await e.innerText()) === ERR && (await e.getAttribute('role')) === 'alert', 'error')
}))
await run('CP-EXP-074', '', () => withUser('cp-exp-074', async (p, u) => {
  await createTx(u, { amount: '1500.00' }); await openExport(p, '2026-09')
  await p.route('**/rest/v1/transactions*', async (r) => { const res = await r.fetch(); const t = (await res.text()).replace('"amount_text":"1500.00"', '"amount_text":"1500"'); await r.fulfill({ response: res, body: t }) })
  expect(await noDownload(p, () => submit(p).click()), 'descargó')
  const e = p.getByTestId('transactions-export-error'); await e.waitFor(); expect((await e.innerText()) === ERR && (await e.getAttribute('role')) === 'alert', 'error')
}))
await run('CP-EXP-075', '', () => withUser('cp-exp-075', async (p, u) => {
  await createTx(u); await openExport(p, '2026-09')
  await p.route('**/rest/v1/transactions*', (r) => r.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ code: 'XX000', message: 'fallo simulado' }) }))
  await submit(p).click(); await p.getByTestId('transactions-export-error').waitFor()
  await p.getByTestId('transactions-export-scope-year').click()
  expect((await p.getByTestId('transactions-export-scope-year').locator('input').isChecked()) && (await p.getByTestId('transactions-export-error').count()) === 0, 'error persiste')
}))
function parseCsv(s) { const out = []; let row = [], f = '', q = false; for (let i = 0; i < s.length; i++) { const c = s[i]; if (q) { if (c === '"') { if (s[i + 1] === '"') { f += '"'; i++ } else q = false } else f += c } else if (c === '"') q = true; else if (c === ',') { row.push(f); f = '' } else if (c === '\r' && s[i + 1] === '\n') { row.push(f); out.push(row); row = []; f = ''; i++ } else f += c } if (f || row.length) { row.push(f); out.push(row) } return out }
L.save(OUT)
await b.close()
