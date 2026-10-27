import * as L from './lib.mjs'
const { run, expect, prepUser, createTx, openExport, noDownload, APP } = L
const OUT = new URL('./resultados-c.json', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const b = await L.newBrowser()
async function withUser(id, fn, opts) {
  const { ctx, page } = await L.newCtx(b, opts)
  try { const u = await prepUser(page, id); return await fn(page, u, ctx) } finally { await L.snap(page, id); await ctx.close() }
}
const dlg = (p) => p.getByTestId('transactions-export-dialog')
const closedWithin = async (p, ms = 2000) => { try { await dlg(p).waitFor({ state: 'detached', timeout: ms }); return true } catch { return false } }

await run('CP-EXP-062', '', () => withUser('cp-exp-062', async (p, u) => {
  await createTx(u); await openExport(p, '2026-09')
  expect(await noDownload(p, () => p.mouse.click(5, 5), 500), 'descargó')
  expect(await closedWithin(p), 'tocar fuera NO cierra la hoja (el click cae en el div de fondo aria-hidden, no en el contenedor)')
  expect(p.url().includes('period=2026-09'), 'URL')
}))
await run('CP-EXP-063', '', () => withUser('cp-exp-063', async (p, u) => {
  await createTx(u); await p.goto(`${APP}/transactions?period=2026-08`); await p.getByTestId('transactions-title').waitFor()
  await p.getByTestId('transactions-period-next').click(); await p.waitForURL(/period=2026-09/)
  await p.getByTestId('transactions-export').click(); await dlg(p).waitFor()
  await p.goBack(); await p.waitForURL(/period=2026-08/)
  expect(await closedWithin(p), 'la URL pasó a 2026-08 pero la hoja sigue abierta')
}))
await run('CP-EXP-064', '', () => withUser('cp-exp-064', async (p, u) => {
  await createTx(u); await p.goto(`${APP}/transactions?period=2026-08`); await p.getByTestId('transactions-title').waitFor()
  await p.getByTestId('transactions-period-next').click(); await p.waitForURL(/period=2026-09/)
  await p.getByTestId('transactions-export').click(); await dlg(p).waitFor()
  await p.route('**/rest/v1/transactions*', (r) => setTimeout(() => r.continue().catch(() => {}), 3000))
  let n = 0; p.on('download', () => n++)
  await p.getByTestId('transactions-export-submit').click(); await p.goBack(); await p.waitForTimeout(6000)
  const toast = await p.getByTestId('transactions-export-success').count()
  expect(n === 0 && toast === 0, `Atrás durante Exportando no cancela: descargas=${n}, avisos de éxito=${toast}`)
}))
await run('CP-EXP-065', '', () => withUser('cp-exp-065', async (p) => {
  await p.goto(`${APP}/transactions?period=2026-08`); await p.getByTestId('transactions-title').waitFor()
  await p.getByTestId('transactions-period-next').click(); await p.waitForURL(/period=2026-09/); await p.goBack(); await p.waitForURL(/period=2026-08/)
  await p.getByTestId('transactions-export').click(); await dlg(p).waitFor()
  expect(await noDownload(p, async () => { await p.goForward() }, 500), 'descargó')
  await p.waitForURL(/period=2026-09/)
  expect(await closedWithin(p), 'la URL pasó a 2026-09 pero la hoja sigue abierta')
}))
await run('CP-EXP-066', '', () => withUser('cp-exp-066', async (p, u) => {
  await createTx(u); await openExport(p, '2026-09')
  expect(await noDownload(p, async () => { await p.goto(`${APP}/dashboard?period=2026-09`) }, 500), 'descargó')
  await p.getByTestId('dashboard-total').waitFor(); expect((await dlg(p).count()) === 0, 'hoja visible en Resumen')
}))
L.save(OUT)
await b.close()
