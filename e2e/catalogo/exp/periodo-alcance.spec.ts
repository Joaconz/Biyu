/// <reference lib="dom" />
// CP-EXP-001 a 008 · URL y período, meses habilitados y nombre de archivo (US-47 · CA-1 a CA-4).
import { expect, test } from '@playwright/test'
import {
  cancel,
  createTransaction,
  createUser,
  dialog,
  downloadCsv,
  evidence,
  openExport,
  records,
  scopeMonth,
  scopeYear,
  submit,
} from './helpers'

const FIXED_TEXT =
  'Se exportan los movimientos activos con fecha en ese período. Las cuotas de compras anteriores no se incluyen.'

// Los casos 002 y 004 a 006 dicen «dispositivo en 09/10/2026»: se fija el reloj del navegador.
const HOY = new Date('2026-10-09T12:00:00-03:00')

test('CP-EXP-001 — Una URL válida fija septiembre 2026', async ({ page }) => {
  await test.step('S1 · PR-01', () => createUser(page, '001'))
  await test.step('10–12 · Abrir /transactions?period=2026-09', async () => {
    await page.goto('/transactions?period=2026-09')
    await expect(page).toHaveURL(/\/transactions\?period=2026-09$/)
  })
  await test.step('13 · Exportar abre la hoja con septiembre elegido', async () => {
    await page.getByTestId('transactions-export').click()
    await expect(dialog(page)).toBeVisible()
    await expect(dialog(page)).toContainText('Exportar movimientos')
    await expect(scopeMonth(page)).toContainText('Solo septiembre 2026')
    await expect(scopeMonth(page).locator('input')).toBeChecked()
    await expect(scopeYear(page)).toContainText('Todo 2026')
    await expect(submit(page)).toBeEnabled()
    await expect(cancel(page)).toBeEnabled()
    await expect(dialog(page)).toContainText(FIXED_TEXT)
  })
})

test('CP-EXP-002 — Sin period se usa octubre 2026', async ({ page }) => {
  await page.clock.setFixedTime(HOY)
  await test.step('S1 · PR-01', () => createUser(page, '002'))
  await test.step('10–12 · Abrir /transactions sin query', async () => {
    await page.goto('/transactions')
    await expect(page.getByTestId('transactions-export')).toBeVisible()
  })
  await test.step('13 · La hoja ofrece octubre 2026 y Todo 2026', async () => {
    await page.getByTestId('transactions-export').click()
    await expect(scopeMonth(page)).toContainText('Solo octubre 2026')
    await expect(scopeMonth(page).locator('input')).toBeChecked()
    await expect(scopeYear(page)).toContainText('Todo 2026')
  })
})

test('CP-EXP-003 — Cancelar desde Vacío cierra sin descargar', async ({ page }) => {
  await test.step('S1 · PR-01 (sin transacciones)', () => createUser(page, '003'))
  await openExport(page, '2026-09')
  let downloads = 0
  page.on('download', () => downloads++)
  await test.step('14 · Descargar CSV sin movimientos muestra Vacío', async () => {
    await submit(page).click()
    await expect(page.getByTestId('transactions-export-empty')).toHaveText(
      'No tenés movimientos con fecha en septiembre 2026.',
    )
  })
  await test.step('15 · Cancelar cierra la hoja y conserva el período', async () => {
    await cancel(page).click()
    await expect(dialog(page)).toBeHidden()
    await expect(page).toHaveURL(/\?period=2026-09$/)
    await page.waitForTimeout(1000)
    expect(downloads).toBe(0)
  })
})

test('CP-EXP-004 — El mes actual permite exportar sin aviso', async ({ page }) => {
  await page.clock.setFixedTime(HOY)
  await test.step('S1 · PR-01', () => createUser(page, '004'))
  await test.step('10–12 · Abrir 2026-10 (mes actual)', async () => {
    await page.goto('/transactions?period=2026-10')
    await expect(page.getByTestId('transactions-export')).toBeEnabled()
    await expect(page.getByTestId('transactions-export-future')).toHaveCount(0)
    await expect(page.getByText('Solo podés exportar el mes actual o meses anteriores.')).toHaveCount(0)
  })
})

test('CP-EXP-005 — El mes anterior permite exportar sin aviso', async ({ page }) => {
  await page.clock.setFixedTime(HOY)
  await test.step('S1 · PR-01', () => createUser(page, '005'))
  await test.step('10–12 · Abrir 2026-09 (mes anterior)', async () => {
    await page.goto('/transactions?period=2026-09')
    await expect(page.getByTestId('transactions-export')).toBeEnabled()
    await expect(page.getByTestId('transactions-export-future')).toHaveCount(0)
  })
})

test('CP-EXP-006 — El mes siguiente está bloqueado', async ({ page }) => {
  await page.clock.setFixedTime(HOY)
  await test.step('S1 · PR-01', () => createUser(page, '006'))
  await test.step('10–13 · Abrir 2026-11: Exportar deshabilitado y aviso exacto', async () => {
    await page.goto('/transactions?period=2026-11')
    await expect(page.getByTestId('transactions-export')).toBeDisabled()
    await expect(page.getByTestId('transactions-export-future')).toHaveText(
      'Solo podés exportar el mes actual o meses anteriores.',
    )
  })
  await test.step('14 · Hacer click en Exportar no abre la hoja', async () => {
    await page.getByTestId('transactions-export').click({ force: true })
    await expect(dialog(page)).toHaveCount(0)
    await expect(page).toHaveURL(/\?period=2026-11$/)
  })
})

test('CP-EXP-007 — El alcance mensual propone el nombre 2026-09', async ({ page }) => {
  const user = await test.step('S1 · PR-01', () => createUser(page, '007'))
  const idA = await test.step('S2 · EXP-PREP-01', () =>
    createTransaction(user, { amount: '1500.00', date: '2026-09-15', description: 'Almuerzo' }))
  await openExport(page, '2026-09')
  const csv = await test.step('14 · Descargar CSV', () => downloadCsv(page))
  await evidence('csv', csv.bytes, 'text/csv')
  expect(csv.filename).toBe('biyu-movimientos-2026-09.csv')
  expect(records(csv).map((r) => r.id)).toEqual([idA])
})

test('CP-EXP-008 — El alcance anual propone el nombre 2025', async ({ page }) => {
  const user = await test.step('S1 · PR-01', () => createUser(page, '008'))
  const idA = await test.step('S2 · EXP-PREP-01', () =>
    createTransaction(user, { amount: '2500.00', date: '2025-02-10' }))
  await openExport(page, '2025-09')
  await test.step('14 · Elegir Todo 2025', async () => {
    await scopeYear(page).click()
    await expect(scopeYear(page).locator('input')).toBeChecked()
  })
  const csv = await test.step('15 · Descargar CSV', () => downloadCsv(page))
  await evidence('csv', csv.bytes, 'text/csv')
  expect(csv.filename).toBe('biyu-movimientos-2025.csv')
  const rows = records(csv)
  expect(rows).toHaveLength(1)
  expect(rows[0]).toMatchObject({ fecha: '2025-02-10', id: idA })
})
