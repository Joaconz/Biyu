import { expect, type Page, test } from '@playwright/test'
import { apiSession, signUpAndSkipSetup } from './support/app.ts'

// Hoja «Exportar movimientos» (US-47, CA-23 y CA-24): DEF-030 (#344), DEF-031 (#345) y DEF-032 (#346).
// Mismo escenario que CP-EXP-027 a 029: un gasto de septiembre de 2026 y la hoja abierta en ese mes.

async function userWithSeptemberExpense(page: Page, request: Parameters<typeof apiSession>[0], tag: string) {
  const { email } = await signUpAndSkipSetup(page, tag)
  const api = await apiSession(request, email)
  const category = await api.select('categories', 'select=id&name=eq.Otros')
  const account = await api.select('accounts', 'select=id&name=eq.Efectivo')
  const created = await api.rpc('create_transaction', {
    p_type: 'expense', p_amount: '1200.00', p_currency: 'ARS', p_fx_rate: null,
    p_category_id: (category.body as { id: string }[])[0].id,
    p_account_id: (account.body as { id: string }[])[0].id,
    p_installments_count: 1, p_occurred_on: '2026-09-15', p_description: null, p_request_id: null,
  })
  expect(created.status).toBe(200)
}

// Que el arreglo no rompa el camino feliz: abrir, descargar, cerrar y volver a abrir.
test('CP-EXP-003 · el alcance mensual descarga biyu-movimientos-2026-09.csv y la hoja se puede reabrir', async ({ page, request }) => {
  await userWithSeptemberExpense(page, request, 'cp-exp-003')
  await page.goto('/transactions?period=2026-09')
  await page.getByTestId('transactions-export').click()
  const download = page.waitForEvent('download')
  await page.getByTestId('transactions-export-submit').click()
  expect((await download).suggestedFilename()).toBe('biyu-movimientos-2026-09.csv')
  await expect(page.getByTestId('transactions-export-success')).toBeVisible()
  await expect(page.getByTestId('transactions-export-dialog')).toBeHidden()

  await page.getByTestId('transactions-export').click()
  await expect(page.getByTestId('transactions-export-dialog')).toBeVisible()
  await expect(page.getByTestId('transactions-export-submit')).toHaveText(/Descargar CSV/)
})

test('CP-EXP-027 · tocar fuera de la hoja la cierra sin descargar (DEF-030)', async ({ page, request }) => {
  await userWithSeptemberExpense(page, request, 'cp-exp-027')
  await page.goto('/transactions?period=2026-09')
  await page.getByTestId('transactions-export').click()
  await expect(page.getByTestId('transactions-export-dialog')).toBeVisible()

  let downloads = 0
  page.on('download', () => downloads++)
  await page.mouse.click(5, 5) // el fondo oscuro, lejos de la hoja

  await expect(page.getByTestId('transactions-export-dialog')).toBeHidden()
  await expect(page).toHaveURL(/\?period=2026-09$/)
  expect(downloads).toBe(0)
})

test('CP-EXP-028 · «Atrás» y «Adelante» con la hoja abierta la cierran y cambian el período (DEF-031)', async ({ page, request }) => {
  await userWithSeptemberExpense(page, request, 'cp-exp-028')
  await page.goto('/transactions?period=2026-08')
  await page.getByTestId('transactions-period-next').click()
  await expect(page).toHaveURL(/\?period=2026-09$/)

  await page.getByTestId('transactions-export').click()
  await expect(page.getByTestId('transactions-export-dialog')).toBeVisible()
  await page.goBack()
  await expect(page).toHaveURL(/\?period=2026-08$/)
  await expect(page.getByTestId('transactions-export-dialog')).toBeHidden()

  // El caso equivalente con «Adelante», recortado del catálogo el 2026-10-27.
  await page.getByTestId('transactions-export').click()
  await expect(page.getByTestId('transactions-export-dialog')).toBeVisible()
  await page.goForward()
  await expect(page).toHaveURL(/\?period=2026-09$/)
  await expect(page.getByTestId('transactions-export-dialog')).toBeHidden()
})

test('CP-EXP-029 · «Atrás» durante «Exportando…» cancela la descarga (DEF-032)', async ({ page, request }) => {
  await userWithSeptemberExpense(page, request, 'cp-exp-029')
  await page.goto('/transactions?period=2026-08')
  await page.getByTestId('transactions-period-next').click()
  await expect(page).toHaveURL(/\?period=2026-09$/)
  await expect(page.getByTestId('transactions-list')).toBeVisible()

  // Desde acá, la lectura de la exportación tarda 3 s.
  await page.route('**/rest/v1/transactions**', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 3000))
    await route.continue()
  })
  let downloads = 0
  page.on('download', () => downloads++)

  await page.getByTestId('transactions-export').click()
  await page.getByTestId('transactions-export-submit').click()
  await expect(page.getByTestId('transactions-export-submit')).toHaveText(/Exportando/)
  await page.goBack()
  await expect(page).toHaveURL(/\?period=2026-08$/)

  await page.waitForTimeout(4000) // que termine la lectura demorada
  expect(downloads).toBe(0)
  await expect(page.getByTestId('transactions-export-success')).toHaveCount(0)
  await expect(page.getByTestId('transactions-export-dialog')).toBeHidden()
})
