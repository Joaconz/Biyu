/// <reference lib="dom" />
// CP-EXP-049 a 056, 069 y 070 · Estados de la hoja: Exportando, mensajes de éxito y Vacío
// (US-47 · CA-18, CA-19, CA-20).
import { expect, test, type Page } from '@playwright/test'
import {
  cancel,
  countDownloads,
  createTransaction,
  createUser,
  deleteTransaction,
  dialog,
  downloadCsv,
  openExport,
  records,
  scopeMonth,
  scopeYear,
  submit,
  throttle,
} from './helpers'

const exito = (page: Page) => page.getByTestId('transactions-export-success')
const vacio = (page: Page) => page.getByTestId('transactions-export-empty')

/** Usuario con el gasto D9 y la hoja de septiembre abierta; la red va a 1 kbit/s con 2000 ms (S3). */
async function exportandoLento(page: Page, caso: string) {
  const user = await createUser(page, caso)
  await createTransaction(user, { amount: '100.00', date: '2026-09-15' })
  await openExport(page, '2026-09')
  await test.step('S3 · DevTools Network a 1 kbit/s con latencia de 2000 ms', () => throttle(page, 1, 2000))
  return user
}

test('CP-EXP-049 — Descargar muestra Exportando y aria-busy', async ({ page }) => {
  await exportandoLento(page, '049')
  await submit(page).click()
  await expect(submit(page)).toContainText('Exportando…')
  await expect(submit(page)).toBeDisabled()
  await expect(submit(page)).toHaveAttribute('aria-busy', 'true')
})

test('CP-EXP-050 — Los controles quedan bloqueados al exportar', async ({ page }) => {
  await exportandoLento(page, '050')
  await submit(page).click()
  await expect(submit(page)).toContainText('Exportando…')
  // El caso habla de «los tres controles»: se verifican los cuatro que tiene la hoja (superconjunto).
  await expect(submit(page)).toBeDisabled()
  await expect(cancel(page)).toBeDisabled()
  await expect(scopeMonth(page).locator('input')).toBeDisabled()
  await expect(scopeYear(page).locator('input')).toBeDisabled()
})

test('CP-EXP-051 — Un doble click inicia una sola descarga', async ({ page }) => {
  const user = await createUser(page, '051')
  await createTransaction(user, { amount: '100.00', date: '2026-09-15' })
  await openExport(page, '2026-09')
  const descargas = await countDownloads(page, async () => {
    await submit(page).dblclick()
    await expect(exito(page)).toHaveText('Exportamos 1 movimiento')
  }, 2500)
  expect(descargas).toBe(1)
  await expect(exito(page)).toHaveCount(1)
})

test('CP-EXP-052 — Una fila usa singular y cierra la hoja', async ({ page }) => {
  const user = await createUser(page, '052')
  await createTransaction(user, { amount: '100.00', date: '2026-09-15' })
  await openExport(page, '2026-09')
  const csv = await downloadCsv(page)
  await expect(dialog(page)).toBeHidden()
  await expect(exito(page)).toHaveText('Exportamos 1 movimiento')
  expect(records(csv)).toHaveLength(1)
})

test('CP-EXP-053 — Dos filas usan plural', async ({ page }) => {
  const user = await createUser(page, '053')
  await createTransaction(user, { amount: '100.00', date: '2026-09-15' })
  await createTransaction(user, { amount: '200.00', date: '2026-09-15' })
  await openExport(page, '2026-09')
  const csv = await downloadCsv(page)
  await expect(exito(page)).toHaveText('Exportamos 2 movimientos')
  expect(records(csv)).toHaveLength(2)
})

test('CP-EXP-054 — Un mes sin transacciones muestra Vacío', async ({ page }) => {
  await createUser(page, '054')
  await openExport(page, '2026-09')
  const descargas = await countDownloads(page, async () => {
    await submit(page).click()
    await expect(vacio(page)).toHaveText('No tenés movimientos con fecha en septiembre 2026.')
  })
  expect(descargas).toBe(0)
  await test.step('16 · «Todo 2026» elegido y desaparece el mensaje mensual', async () => {
    await scopeYear(page).click()
    await expect(scopeYear(page).locator('input')).toBeChecked()
    await expect(vacio(page)).toHaveCount(0)
  })
})

test('CP-EXP-055 — Un año sin transacciones muestra Vacío anual', async ({ page }) => {
  await createUser(page, '055')
  await openExport(page, '2025-09')
  await scopeYear(page).click()
  await expect(scopeYear(page).locator('input')).toBeChecked()
  const descargas = await countDownloads(page, async () => {
    await submit(page).click()
    await expect(vacio(page)).toHaveText('No tenés movimientos con fecha en 2025.')
  })
  expect(descargas).toBe(0)
})

test('CP-EXP-056 — Un período con solo eliminadas muestra Vacío', async ({ page }) => {
  const user = await createUser(page, '056')
  const idA = await createTransaction(user, { amount: '100.00', date: '2026-09-15' })
  await deleteTransaction(user, idA)
  await openExport(page, '2026-09')
  const descargas = await countDownloads(page, async () => {
    await submit(page).click()
    await expect(vacio(page)).toHaveText('No tenés movimientos con fecha en septiembre 2026.')
  })
  expect(descargas).toBe(0)
})

test('CP-EXP-069 — Escape no cierra la hoja durante Exportando', async ({ page }) => {
  await exportandoLento(page, '069')
  await submit(page).click()
  await expect(submit(page)).toContainText('Exportando…')
  await page.keyboard.press('Escape')
  await page.waitForTimeout(500)
  await expect(dialog(page)).toBeVisible()
  await expect(submit(page)).toContainText('Exportando…')
})

test('CP-EXP-070 — Tocar fuera no cierra la hoja durante Exportando', async ({ page }) => {
  // Ojo: este caso no discrimina hoy. Tocar el fondo no cierra la hoja en ningún estado (DEF-030, ver CP-EXP-062).
  test.info().annotations.push({ type: 'observación', description: 'Pasa, pero tocar fuera tampoco cierra la hoja sin Exportando (DEF-030)' })
  await exportandoLento(page, '070')
  await submit(page).click()
  await expect(submit(page)).toContainText('Exportando…')
  // El fondo es el contenedor de la hoja (la hoja está pegada abajo): arriba de ella.
  await page.mouse.click(187, 40)
  await page.waitForTimeout(500)
  await expect(dialog(page)).toBeVisible()
  await expect(submit(page)).toContainText('Exportando…')
})
