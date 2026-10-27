/// <reference lib="dom" />
// CP-EXP-057 a 059, 068, 073 a 075 · Estado Error y completitud (US-47 · CA-22, Completitud, Estado Error).
// Offline por el contexto; el HTTP 500 y el decimal inválido con los fragmentos EXP-PREP-08 / EXP-PREP-09 tal cual.
import { expect, test, type Page } from '@playwright/test'
import {
  cancel,
  countDownloads,
  createTransaction,
  createUser,
  dialog,
  downloadCsv,
  openExport,
  records,
  scopeMonth,
  scopeYear,
  seed,
  submit,
} from './helpers'

const MENSAJE_ERROR = 'No pudimos exportar tus movimientos. Probá de nuevo.'
const error = (page: Page) => page.getByTestId('transactions-export-error')

/** EXP-PREP-08: el pedido a `/rest/v1/transactions` responde HTTP 500 simulado. */
const PREP_08 = `
  window.__expOriginalFetch = window.fetch;
  window.fetch = (...args) => String(args[0]).includes('/rest/v1/transactions')
    ? Promise.resolve(new Response(JSON.stringify({ code: 'XX000', message: 'fallo simulado' }), {
        status: 500, headers: { 'Content-Type': 'application/json' }
      }))
    : window.__expOriginalFetch(...args);
`

/** EXP-PREP-09: la respuesta trae `amount_text` = "1500" en vez de "1500.00". */
const PREP_09 = `
  window.__expOriginalFetch = window.fetch;
  window.fetch = async (...args) => {
    const response = await window.__expOriginalFetch(...args);
    if (!String(args[0]).includes('/rest/v1/transactions') || !response.ok) return response;
    const text = (await response.text()).replace('"amount_text":"1500.00"', '"amount_text":"1500"');
    return new Response(text, { status: response.status, headers: response.headers });
  };
`

async function errorSinDescarga(page: Page, accion: () => Promise<void>) {
  const descargas = await countDownloads(page, accion)
  expect(descargas).toBe(0)
  await expect(error(page)).toHaveText(MENSAJE_ERROR)
  await expect(error(page)).toHaveAttribute('role', 'alert')
}

test('CP-EXP-057 — Offline muestra el error exacto', async ({ page, context }) => {
  const user = await createUser(page, '057')
  await createTransaction(user, { amount: '100.00', date: '2026-09-15' })
  await openExport(page, '2026-09')
  await test.step('14 · Activar Offline', () => context.setOffline(true))
  await test.step('15 · Descargar CSV: error exacto, sin archivo y controles habilitados', async () => {
    await errorSinDescarga(page, () => submit(page).click())
    await expect(scopeMonth(page).locator('input')).toBeEnabled()
    await expect(scopeYear(page).locator('input')).toBeEnabled()
    await expect(submit(page)).toBeEnabled()
    await expect(cancel(page)).toBeEnabled()
  })
})

test('CP-EXP-058 — El reintento después de Offline descarga completo', async ({ page, context }) => {
  const user = await createUser(page, '058')
  const idA = await createTransaction(user, { amount: '100.00', date: '2026-09-15' })
  const idB = await createTransaction(user, { amount: '200.00', date: '2026-09-15' })
  await openExport(page, '2026-09')
  await context.setOffline(true)
  await test.step('15 · Se muestra el error y no se descarga', () => errorSinDescarga(page, () => submit(page).click()))
  await test.step('16 · Desactivar Offline', () => context.setOffline(false))
  const csv = await test.step('17 · Reintentar: el error desaparece y se descarga completo', () => downloadCsv(page))
  await expect(page.getByTestId('transactions-export-success')).toHaveText('Exportamos 2 movimientos')
  expect(records(csv).map((r) => r.id).sort()).toEqual([idA, idB].sort())
})

test('CP-EXP-059 — Cancelar desde Error cierra sin descargar', async ({ page, context }) => {
  const user = await createUser(page, '059')
  await createTransaction(user, { amount: '100.00', date: '2026-09-15' })
  await openExport(page, '2026-09')
  await context.setOffline(true)
  await errorSinDescarga(page, () => submit(page).click())
  const descargas = await countDownloads(page, async () => {
    await cancel(page).click()
    await expect(dialog(page)).toBeHidden()
  })
  expect(descargas).toBe(0)
  await expect(page).toHaveURL(/\?period=2026-09$/)
})

test('CP-EXP-068 — Una alta concurrente impide descargar un año incompleto', async ({ page }) => {
  // Desvíos: el alta concurrente entra por la API (RPC) en vez de la segunda ventana de Registrar, y la
  // espera entre páginas se controla con una compuerta de red en vez de 1 kbit/s (a 1 kbit/s la
  // primera página de 1.000 filas tardaría más de una hora).
  const user = await createUser(page, '068')
  await test.step('S2 · EXP-PREP-07 con N=1500', () => seed(user, 1500))
  await openExport(page, '2025-09')
  await scopeYear(page).click()
  let lecturas = 0
  let soltar!: () => void
  const compuerta = new Promise<void>((resolve) => (soltar = resolve))
  await page.route('**/rest/v1/transactions*', async (route) => {
    lecturas++
    if (lecturas === 2) await compuerta
    await route.continue()
  })
  const descargas = await countDownloads(page, async () => {
    const primera = page.waitForResponse((r) => r.url().includes('/rest/v1/transactions') && r.ok())
    await submit(page).click()
    await expect(submit(page)).toContainText('Exportando…')
    await primera
    await test.step('16–21 · Alta concurrente de $2,00 con fecha 31/12/2025', () =>
      createTransaction(user, { amount: '2.00', date: '2025-12-31' }))
    soltar()
    await test.step('23 · La exportación termina con el error y sin archivo', async () => {
      await expect(error(page)).toHaveText(MENSAJE_ERROR)
      await expect(error(page)).toHaveAttribute('role', 'alert')
    })
  }, 2500)
  expect(descargas).toBe(0)
  await expect(dialog(page)).toBeVisible()
})

test('CP-EXP-073 — HTTP 500 muestra Error y no descarga', async ({ page }) => {
  const user = await createUser(page, '073')
  await createTransaction(user, { amount: '100.00', date: '2026-09-15' })
  await openExport(page, '2026-09')
  await test.step('S3 · EXP-PREP-08', () => page.evaluate(PREP_08))
  await test.step('14 · Descargar CSV', () => errorSinDescarga(page, () => submit(page).click()))
})

test('CP-EXP-074 — Un monto textual inválido cancela la descarga', async ({ page }) => {
  const user = await createUser(page, '074')
  await createTransaction(user, { amount: '1500.00', date: '2026-09-15' })
  await openExport(page, '2026-09')
  await test.step('S3 · EXP-PREP-09', () => page.evaluate(PREP_09))
  await test.step('14 · Descargar CSV', () => errorSinDescarga(page, () => submit(page).click()))
})

test('CP-EXP-075 — Cambiar el alcance borra el mensaje de Error', async ({ page }) => {
  const user = await createUser(page, '075')
  await createTransaction(user, { amount: '100.00', date: '2026-09-15' })
  await openExport(page, '2026-09')
  await page.evaluate(PREP_08)
  await test.step('14 · Aparece el mensaje de Error', () => errorSinDescarga(page, () => submit(page).click()))
  await test.step('15 · «Todo 2026» queda elegido y el mensaje desaparece', async () => {
    await scopeYear(page).click()
    await expect(scopeYear(page).locator('input')).toBeChecked()
    await expect(error(page)).toHaveCount(0)
  })
})
