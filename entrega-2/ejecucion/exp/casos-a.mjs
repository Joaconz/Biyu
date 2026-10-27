import * as L from './lib.mjs'
const { run, expect, prepUser, createTx, openExport, download, noDownload, rows, text, HEADER, rpc, api, APP } = L
const OUT = new URL('./resultados-a.json', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const b = await L.newBrowser()
async function withUser(id, fn, opts) {
  const { ctx, page } = await L.newCtx(b, opts)
  try { const u = await prepUser(page, id); return await fn(page, u) } finally { await L.snap(page, id); await ctx.close() }
}
const SEP = (s) => `No tenés movimientos con fecha en ${s}.`
const submit = (p) => p.getByTestId('transactions-export-submit')
function parseCsv(s) { const out = []; let row = [], f = '', q = false; for (let i = 0; i < s.length; i++) { const c = s[i]; if (q) { if (c === '"') { if (s[i + 1] === '"') { f += '"'; i++ } else q = false } else f += c } else if (c === '"') q = true; else if (c === ',') { row.push(f); f = '' } else if (c === '\r' && s[i + 1] === '\n') { row.push(f); out.push(row); row = []; f = ''; i++ } else f += c } if (f || row.length) { row.push(f); out.push(row) } return out }

await run('CP-EXP-001', '', () => withUser('cp-exp-001', async (p) => {
  await openExport(p, '2026-09')
  const d = p.getByTestId('transactions-export-dialog')
  expect((await p.getByTestId('transactions-export-scope-month').innerText()).includes('Solo septiembre 2026'), 'falta "Solo septiembre 2026"')
  expect(await p.getByTestId('transactions-export-scope-month').locator('input').isChecked(), 'mes no elegido')
  expect((await d.innerText()).includes('Todo 2026'), 'falta Todo 2026')
  expect((await submit(p).isEnabled()) && (await p.getByTestId('transactions-export-cancel').isEnabled()), 'botones no habilitados')
  expect((await d.innerText()).includes('Las cuotas de compras anteriores no se incluyen'), 'falta texto fijo')
}))
await run('CP-EXP-002', '', () => withUser('cp-exp-002', async (p) => {
  await openExport(p)
  const t = await p.getByTestId('transactions-export-dialog').innerText()
  expect(t.includes('Solo octubre 2026') && t.includes('Todo 2026'), 'alcance: ' + t.slice(0, 120))
}))
await run('CP-EXP-003', '', () => withUser('cp-exp-003', async (p) => {
  await openExport(p, '2026-09')
  expect(await noDownload(p, () => submit(p).click()), 'se descargó')
  expect((await p.getByTestId('transactions-export-empty').innerText()) === SEP('septiembre 2026'), 'mensaje vacío distinto')
  await p.getByTestId('transactions-export-cancel').click()
  expect((await p.getByTestId('transactions-export-dialog').count()) === 0, 'hoja abierta')
  expect(p.url().includes('period=2026-09'), 'URL cambió')
}))
for (const [id, per, fut] of [['004', '2026-10', false], ['005', '2026-09', false], ['006', '2026-11', true]]) {
  await run('CP-EXP-' + id, '', () => withUser('cp-exp-' + id, async (p) => {
    await p.goto(`${APP}/transactions?period=${per}`)
    await p.getByTestId('transactions-title').waitFor()
    const btn = p.getByTestId('transactions-export')
    const aviso = await p.getByTestId('transactions-export-future').count()
    if (fut) {
      expect(await btn.isDisabled(), 'Exportar habilitado en mes futuro')
      expect(aviso === 1, 'sin aviso de futuro')
      await btn.click({ force: true, timeout: 2000 }).catch(() => {})
      expect((await p.getByTestId('transactions-export-dialog').count()) === 0 && p.url().includes('period=' + per), 'abrió hoja o cambió URL')
    } else {
      expect((await btn.isEnabled()) && aviso === 0, 'bloqueado o con aviso')
      await btn.click()
      expect(await p.getByTestId('transactions-export-dialog').isVisible(), 'no abrió')
    }
  }))
}
await run('CP-EXP-007', '', () => withUser('cp-exp-007', async (p, u) => {
  const id = await createTx(u, { amount: '1500.00', on: '2026-09-15', desc: 'Almuerzo' })
  await openExport(p, '2026-09')
  const f = await download(p)
  expect(f.name === 'biyu-movimientos-2026-09.csv', 'nombre ' + f.name)
  expect(rows(f.buf).length === 2 && rows(f.buf)[1].endsWith(id), 'fila/id')
}))
await run('CP-EXP-008', '', () => withUser('cp-exp-008', async (p, u) => {
  const id = await createTx(u, { amount: '2500.00', on: '2025-02-10' })
  await openExport(p, '2025-06')
  await p.getByTestId('transactions-export-scope-year').click()
  const f = await download(p)
  expect(f.name === 'biyu-movimientos-2025.csv', 'nombre ' + f.name)
  const r = rows(f.buf); expect(r.length === 2 && r[1].startsWith('2025-02-10') && r[1].endsWith(id), 'fila: ' + r[1])
}))
const lim = [['009', '2026-09-01', 'month', true], ['010', '2026-09-30', 'month', true], ['011', '2026-08-31', 'month', false], ['012', '2026-10-01', 'month', false], ['013', '2025-01-01', 'year', true], ['014', '2025-12-31', 'year', true], ['015', '2024-12-31', 'year', false], ['016', '2026-01-01', 'year', false]]
for (const [n, date, scope, inc] of lim) {
  await run('CP-EXP-' + n, '', () => withUser('cp-exp-' + n, async (p, u) => {
    const id = await createTx(u, { on: date })
    await openExport(p, scope === 'month' ? '2026-09' : '2025-06')
    if (scope === 'year') await p.getByTestId('transactions-export-scope-year').click()
    if (inc) {
      const f = await download(p); const r = rows(f.buf)
      expect(r.length === 2 && r[1].startsWith(date) && r[1].endsWith(id), 'fila: ' + r[1])
    } else {
      expect(await noDownload(p, () => submit(p).click()), 'se descargó')
      const m = await p.getByTestId('transactions-export-empty').innerText()
      expect(m === SEP(scope === 'month' ? 'septiembre 2026' : '2025'), 'mensaje: ' + m)
      expect(await p.getByTestId('transactions-export-dialog').isVisible(), 'hoja cerrada')
    }
  }))
}
await run('CP-EXP-018', '', () => withUser('cp-exp-018', async (p, u) => {
  const id = await createTx(u, { amount: '200.00' }); await rpc(u, 'delete_transaction', { p_transaction_id: id }); await rpc(u, 'restore_transaction', { p_transaction_id: id })
  await openExport(p, '2026-09'); const f = await download(p); const r = rows(f.buf)
  expect(r.length === 2 && r[1].endsWith(id), 'fila')
}))
await run('CP-EXP-019', '', () => withUser('cp-exp-019', async (p, u) => {
  const a = await createTx(u); const bb = await createTx(u); await rpc(u, 'delete_transaction', { p_transaction_id: bb })
  await openExport(p, '2026-09'); const f1 = await download(p)
  await p.goto(`${APP}/transactions?period=2026-09&view=deleted`); await p.getByTestId('transactions-export').click()
  const f2 = await download(p)
  expect(Buffer.compare(f1.buf, f2.buf) === 0, 'bytes distintos'); expect(text(f1.buf).includes(a) && !text(f1.buf).includes(bb), 'ids')
}))
await run('CP-EXP-020', '', () => withUser('cp-exp-020', async (p, u) => { await createTx(u); await openExport(p, '2026-09'); const f = await download(p); expect(f.buf[0] === 0xEF && f.buf[1] === 0xBB && f.buf[2] === 0xBF, 'BOM: ' + [...f.buf.slice(0, 3)]) }))
await run('CP-EXP-021', '', () => withUser('cp-exp-021', async (p, u) => { await createTx(u); await openExport(p, '2026-09'); const f = await download(p); expect(rows(f.buf)[0] === HEADER, 'header: ' + rows(f.buf)[0]) }))
await run('CP-EXP-022', '', () => withUser('cp-exp-022', async (p, u) => { await createTx(u); await openExport(p, '2026-09'); const f = await download(p); const t = text(f.buf); expect(t.endsWith('\r\n') && !t.endsWith('\r\n\r\n') && (t.match(/\r\n/g) || []).length === 2 && !/[^\r]\n/.test(t), 'CRLF: ' + JSON.stringify(t.slice(-6))) }))
await run('CP-EXP-025', '', () => withUser('cp-exp-025', async (p, u) => { await createTx(u, { amount: '1500.00' }); await openExport(p, '2026-09'); const f = await download(p); const t = text(f.buf); expect(t.includes('gasto,1500.00,ARS,,1500.00') && !t.includes('1.500,00'), 'fila: ' + rows(f.buf)[1]) }))
await run('CP-EXP-026', '', () => withUser('cp-exp-026', async (p, u) => { await createTx(u, { amount: '300.00', currency: 'USD', fx: 1250.5 }); await openExport(p, '2026-09'); const f = await download(p); expect(text(f.buf).includes('300.00,USD,1250.5000,375150.00'), 'fila: ' + rows(f.buf)[1]) }))
await run('CP-EXP-027', '', () => withUser('cp-exp-027', async (p, u) => {
  await createTx(u, { amount: '300.00', currency: 'USD', fx: 1250.5 })
  const r = await rpc(u, 'upsert_fx_rate', { p_period: '2026-09-01', p_ars_per_usd: '1400.0000' }); expect(r.status === 200, 'upsert ' + r.status + JSON.stringify(r.json))
  await openExport(p, '2026-09'); const f = await download(p); const t = text(f.buf)
  expect(t.includes('1250.5000') && t.includes('375150.00') && !t.includes('1400.0000') && !t.includes('420000.00'), 'fila: ' + rows(f.buf)[1])
}))
const esc = [['028', 'Heladera, 3 cuotas', '"Heladera, 3 cuotas"'], ['029', 'Pizza "a la piedra"', '"Pizza ""a la piedra"""'], ['031', '=1+1', "'=1+1"], ['032', '+SUMA(A1)', "'+SUMA(A1)"], ['033', '-5, promo', `"'-5, promo"`], ['034', '@usuario', "'@usuario"], ['035', '\tcafé', "'\tcafé"], ['036', '\rnota', `"'\rnota"`]]
for (const [n, d, out] of esc) {
  await run('CP-EXP-' + n, '', () => withUser('cp-exp-' + n, async (p, u) => {
    const id = await createTx(u, { desc: d }); await openExport(p, '2026-09'); const f = await download(p)
    const t = text(f.buf); const exp = ',' + out + ',' + id
    expect(t.includes(exp), `esperado ${JSON.stringify(exp)}; obtenido ${JSON.stringify(t.split('\r\n')[1] ?? t.slice(-80))}`)
  }))
}
await run('CP-EXP-030', '', () => withUser('cp-exp-030', async (p, u) => {
  const id = await createTx(u, { desc: 'Línea uno\nLínea dos' }); await openExport(p, '2026-09'); const f = await download(p)
  const t = text(f.buf); expect(t.includes('"Línea uno\nLínea dos",' + id), 'campo: ' + JSON.stringify(t.slice(-80)))
  const parsed = parseCsv(t.replace(/^\uFEFF/, ''))
  expect(parsed.length === 2 && parsed.every(r => r.length === 12), 'parse RFC4180: ' + parsed.length)
  return 'DUDA: Google Sheets no usado; validado con un lector RFC 4180 propio'
}))
await run('CP-EXP-037', '', () => withUser('cp-exp-037', async (p, u) => {
  const c = await api('/rest/v1/categories', { token: u.token, method: 'POST', headers: { Prefer: 'return=representation' }, body: { name: '=Categoria QA', color: '#336699' } }); expect(c.status === 201, 'cat ' + c.status + JSON.stringify(c.json))
  await createTx(u, { catId: c.json[0].id }); await openExport(p, '2026-09'); const f = await download(p)
  expect(rows(f.buf)[1].split(',')[6] === "'=Categoria QA", 'cat: ' + rows(f.buf)[1])
}))
await run('CP-EXP-038', '', () => withUser('cp-exp-038', async (p, u) => {
  const a = await api('/rest/v1/accounts', { token: u.token, method: 'POST', headers: { Prefer: 'return=representation' }, body: { name: '@Cuenta QA', type: 'cash', currency: 'ARS' } }); expect(a.status === 201, 'acc ' + a.status + JSON.stringify(a.json))
  await createTx(u, { accId: a.json[0].id }); await openExport(p, '2026-09'); const f = await download(p)
  expect(rows(f.buf)[1].split(',')[7] === "'@Cuenta QA", 'acc: ' + rows(f.buf)[1])
}))
await run('CP-EXP-039', '', () => withUser('cp-exp-039', async (p, u) => {
  const A = await createTx(u, { amount: '100.00', on: '2026-09-20' }); const B = await createTx(u, { amount: '200.00', on: '2026-09-10' })
  await p.waitForTimeout(1200); const C = await createTx(u, { amount: '300.00', on: '2026-09-10' })
  await openExport(p, '2026-09'); const f = await download(p); const ids = rows(f.buf).slice(1).map(r => r.split(',').pop())
  expect(JSON.stringify(ids) === JSON.stringify([B, C, A]), 'orden: ' + ids.join(' '))
}))
L.save(OUT)
await b.close()
