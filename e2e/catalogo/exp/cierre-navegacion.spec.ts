/// <reference lib="dom" />
// CP-EXP-060 a 067 y 072 · Cierre de la hoja, historial del navegador y efectos colaterales
// (US-47 · CA-23, CA-24, CA-25 y el requisito «todo cambio de URL»).
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
  submit,
  throttle,
} from './helpers'

const exito = (page: Page) => page.getByTestId('transactions-export-success')

/** Usuario con el gasto D9 y la hoja de septiembre abierta. */
async function conHoja(page: Page, caso: string) {
  const user = await createUser(page, caso)
  await createTransaction(user, { amount: '100.00', date: '2026-09-15' })
  await openExport(page, '2026-09')
  return user
}

/** La hoja se cierra, no hay descarga y la URL conserva el período. */
async function cierraSinDescargar(page: Page, accion: () => Promise<void>) {
  const descargas = await countDownloads(page, async () => {
    await accion()
    await expect(dialog(page)).toBeHidden()
  })
  expect(descargas).toBe(0)
  await expect(page).toHaveURL(/\?period=2026-09$/)
}

test('CP-EXP-060 — Cancelar cierra sin descargar', async ({ page }) => {
  await conHoja(page, '060')
  await cierraSinDescargar(page, () => cancel(page).click())
})

test('CP-EXP-061 — Escape cierra sin descargar', async ({ page }) => {
  await conHoja(page, '061')
  await cierraSinDescargar(page, () => page.keyboard.press('Escape'))
})

test('CP-EXP-062 — Tocar fuera cierra sin descargar', async ({ page }) => {
  await conHoja(page, '062')
  // Fondo = fuera de la hoja, que está pegada al borde inferior del celular (375 × 812).
  await cierraSinDescargar(page, () => page.mouse.click(187, 40))
})

/** Atrás/Adelante con historial armado en la barra de direcciones: agosto → septiembre. */
async function historialAgostoSeptiembre(page: Page) {
  await page.goto('/transactions?period=2026-08')
  await expect(page.getByTestId('transactions-export')).toBeVisible()
  await page.goto('/transactions?period=2026-09')
  await expect(page.getByTestId('transactions-export')).toBeVisible()
}

test('CP-EXP-063 — Atrás cierra la hoja inicial', async ({ page }) => {
  const user = await createUser(page, '063')
  await createTransaction(user, { amount: '100.00', date: '2026-09-15' })
  await test.step('13–18 · Historial agosto → septiembre', () => historialAgostoSeptiembre(page))
  await test.step('19 · Exportar abre la hoja fijada a septiembre', async () => {
    await page.getByTestId('transactions-export').click()
    await expect(dialog(page)).toContainText('Solo septiembre 2026')
  })
  const descargas = await countDownloads(page, async () => {
    await test.step('20 · Atrás del navegador', async () => {
      await page.goBack()
      await expect(page).toHaveURL(/\?period=2026-08$/)
      await expect(dialog(page)).toHaveCount(0)
    })
  })
  expect(descargas).toBe(0)
})

test('CP-EXP-064 — Atrás durante Exportando cancela la descarga', async ({ page }) => {
  const user = await createUser(page, '064')
  await createTransaction(user, { amount: '100.00', date: '2026-09-15' })
  await historialAgostoSeptiembre(page)
  await page.getByTestId('transactions-export').click()
  await expect(dialog(page)).toBeVisible()
  await test.step('S4 · Network a 1 kbit/s con latencia de 2000 ms', () => throttle(page, 1, 2000))
  const descargas = await countDownloads(page, async () => {
    await test.step('20 · Descargar CSV: «Exportando…»', async () => {
      await submit(page).click()
      await expect(submit(page)).toContainText('Exportando…')
    })
    await test.step('21 · Atrás del navegador: la hoja se cierra y la URL pasa a agosto', async () => {
      // 'commit': con la red a 1 kbit/s la página de agosto no termina de cargar.
      await page.goBack({ waitUntil: 'commit' })
      await expect(page).toHaveURL(/\?period=2026-08$/)
    })
    await test.step('22 · Restablecer la velocidad de red', () => throttle(page, null))
    await expect(page.getByTestId('transactions-export')).toBeVisible()
    await expect(dialog(page)).toHaveCount(0)
  }, 3000)
  expect(descargas).toBe(0)
  await expect(exito(page)).toHaveCount(0)
})

test('CP-EXP-065 — Adelante cierra la hoja inicial', async ({ page }) => {
  await createUser(page, '065')
  await test.step('13–16 · Historial: agosto → septiembre y Atrás a agosto', async () => {
    await historialAgostoSeptiembre(page)
    await page.goBack()
    await expect(page).toHaveURL(/\?period=2026-08$/)
  })
  await test.step('17 · Exportar abre la hoja fijada a agosto', async () => {
    await expect(page.getByTestId('transactions-export')).toBeVisible()
    await page.getByTestId('transactions-export').click()
    await expect(dialog(page)).toContainText('Solo agosto 2026')
  })
  const descargas = await countDownloads(page, async () => {
    await test.step('18 · Adelante del navegador', async () => {
      await page.goForward()
      await expect(page).toHaveURL(/\?period=2026-09$/)
      await expect(dialog(page)).toHaveCount(0)
    })
  })
  expect(descargas).toBe(0)
})

test('CP-EXP-066 — Salir a Resumen cierra la hoja', async ({ page }) => {
  await conHoja(page, '066')
  const descargas = await countDownloads(page, async () => {
    await page.goto('/dashboard?period=2026-09')
    await expect(page).toHaveURL(/\/dashboard\?period=2026-09$/)
    await expect(dialog(page)).toHaveCount(0)
  })
  expect(descargas).toBe(0)
})

test('CP-EXP-067 — Exportar no modifica datos ni período', async ({ page }) => {
  const user = await createUser(page, '067')
  const idA = await createTransaction(user, { amount: '3000.00', date: '2026-09-15' })
  await page.goto('/transactions?period=2026-09')
  await test.step('13 · La fila muestra $3.000,00 antes de exportar', async () => {
    await expect(page.getByTestId('transactions-item')).toHaveCount(1)
    await expect(page.getByTestId('transactions-item')).toContainText('$3.000,00')
  })
  await page.getByTestId('transactions-export').click()
  const csv = await test.step('15 · Descargar CSV', () => downloadCsv(page))
  expect(records(csv).map((r) => r.id)).toEqual([idA])
  await expect(page).toHaveURL(/\/transactions\?period=2026-09$/)
  await test.step('16 · Recargar: sigue una fila por $3.000,00', async () => {
    await page.reload()
    await expect(page.getByTestId('transactions-item')).toHaveCount(1)
    await expect(page.getByTestId('transactions-item')).toContainText('$3.000,00')
  })
})

test('CP-EXP-072 — Exportar no modifica el total de Resumen', async ({ page }) => {
  const user = await createUser(page, '072')
  await createTransaction(user, { amount: '3000.00', date: '2026-09-15' })
  const total = page.getByTestId('dashboard-total-expenses')
  await test.step('13–15 · Resumen de septiembre muestra $3.000,00', async () => {
    await page.goto('/dashboard?period=2026-09')
    await expect(total).toHaveText('$3.000,00')
  })
  await test.step('16–20 · Exportar desde Movimientos', async () => {
    await openExport(page, '2026-09')
    const csv = await downloadCsv(page)
    expect(records(csv)).toHaveLength(1)
  })
  await test.step('21–23 · Resumen vuelve a mostrar exactamente $3.000,00', async () => {
    await page.goto('/dashboard?period=2026-09')
    await expect(total).toHaveText('$3.000,00')
  })
})
