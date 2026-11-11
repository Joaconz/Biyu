import { expect, test } from '@playwright/test'
import writeXlsxFile from 'write-excel-file/universal'
import { signUpAndSkipSetup } from './support/app.ts'

// US-81 (#269): guía "Cómo armar el archivo". CA-1 a CA-4, CA-5 (nombre), CA-8, CA-9 y CA-10.

test('CA-1 y CA-2 · cerrada por defecto; se abre con el contenido exacto', async ({ page }) => {
  await signUpAndSkipSetup(page, 'us81-open')
  await page.goto('/import')
  await expect(page.getByTestId('import-guide-open')).toHaveText('¿Cómo armo el archivo?')
  await expect(page.getByTestId('import-guide-dialog')).toHaveCount(0)
  await page.reload()
  await expect(page.getByTestId('import-guide-dialog')).toHaveCount(0)

  await page.getByTestId('import-guide-open').click()
  const dialog = page.getByTestId('import-guide-dialog')
  await expect(dialog).toHaveAttribute('aria-modal', 'true')
  await expect(dialog.getByRole('heading', { name: 'Cómo armar el archivo' })).toBeVisible()
  await expect(page.getByTestId('import-guide-steps').locator('li')).toHaveCount(6)
  await expect(page.getByTestId('import-guide-steps').locator('li').nth(4)).toContainText('Si ya pagaste algunas, poné en Cuotas pendientes')
  await expect(page.getByTestId('import-guide-example').locator('thead th')).toHaveText([
    'Fecha', 'Tipo', 'Monto', 'Moneda', 'Tipo de cambio', 'Categoría', 'Cuenta', 'Cuotas', 'Cuotas pendientes', 'Nota',
  ])
  await expect(page.getByTestId('import-guide-example').locator('tbody tr')).toHaveCount(2)
  await expect(dialog).toContainText('Hasta 500 filas y 1 MB. Solo se lee la primera hoja.')
  await expect(page).toHaveURL(/\/import$/)
})

test('CA-3 y CA-4 · se cierra por cuatro vías, el foco vuelve y Tab no sale', async ({ page }) => {
  await signUpAndSkipSetup(page, 'us81-focus')
  await page.goto('/import')
  const opener = page.getByTestId('import-guide-open')
  const dialog = page.getByTestId('import-guide-dialog')

  await opener.click()
  await expect(page.getByTestId('import-guide-close')).toBeFocused()
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab')
    expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true)
  }
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Shift+Tab')
    expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true)
  }

  for (const close of [
    () => page.getByTestId('import-guide-done').click(),
    () => page.getByTestId('import-guide-close').click(),
    () => page.keyboard.press('Escape'),
    () => dialog.click({ position: { x: 2, y: 2 } }),
  ]) {
    if (!(await dialog.isVisible())) await opener.click()
    await expect(dialog).toBeVisible()
    await close()
    await expect(dialog).toHaveCount(0)
    await expect(opener).toBeFocused()
  }
})

test('CA-5 · la plantilla del diálogo baja el mismo archivo que la del paso 1', async ({ page }) => {
  await signUpAndSkipSetup(page, 'us81-template')
  await page.goto('/import')
  const fromStep = page.waitForEvent('download')
  await page.getByTestId('import-template-download').click()
  const stepName = (await fromStep).suggestedFilename()
  await page.getByTestId('import-guide-open').click()
  const fromGuide = page.waitForEvent('download')
  await page.getByTestId('import-guide-template-download').click()
  expect((await fromGuide).suggestedFilename()).toBe(stepName)
  expect(stepName).toBe('biyu-plantilla-importacion.xlsx')
})

test('CA-9 · a 390 px entra con 16 px de margen y la tabla scrollea por dentro', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await signUpAndSkipSetup(page, 'us81-mobile')
  await page.goto('/import')
  await page.getByTestId('import-guide-open').click()
  const box = await page.getByTestId('import-guide-dialog').locator('> div').boundingBox()
  expect(box!.x).toBeGreaterThanOrEqual(16)
  expect(box!.x + box!.width).toBeLessThanOrEqual(390 - 16 + 0.5)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
  const table = page.getByTestId('import-guide-example')
  expect(await table.evaluate((t) => t.parentElement!.scrollWidth > t.parentElement!.clientWidth)).toBe(true)
})

test('CP-IMP-057 · abrir y cerrar la guía no cambia el archivo, el resumen, el filtro ni la URL', async ({ page }) => {
  await signUpAndSkipSetup(page, 'cp-imp-057')
  const blob = await writeXlsxFile([{ sheet: 'Movimientos', data: [
    ['Fecha', 'Tipo', 'Monto', 'Moneda', 'Tipo de cambio', 'Categoría', 'Cuenta', 'Cuotas', 'Cuotas pendientes', 'Nota'],
    ['01/01/2020', 'Gasto', 1000, 'ARS', '', 'Otros', 'Efectivo', '', '', 'Bien'],
    ['01/01/2020', 'Gasto', 0, 'ARS', '', 'Otros', 'Efectivo', '', '', 'Monto en cero'],
  ] }]).toBlob()
  await page.goto('/import')
  await page.getByTestId('import-file-input').setInputFiles({
    name: 'mixto.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    buffer: Buffer.from(await blob.arrayBuffer()),
  })
  await expect(page.getByTestId('import-summary')).toBeVisible()
  await page.getByTestId('import-filter-errors').click()

  const before = {
    file: await page.getByTestId('import-file-name').innerText(),
    summary: await page.getByTestId('import-summary').innerText(),
    rows: await page.getByTestId('import-rows').locator('li').count(),
    filter: await page.getByTestId('import-filter-errors').getAttribute('aria-checked'),
    url: page.url(),
  }
  expect(before.filter).toBe('true')

  await page.getByTestId('import-guide-open').click()
  await expect(page.getByTestId('import-guide-dialog')).toBeVisible()
  await page.getByTestId('import-guide-done').click()
  await expect(page.getByTestId('import-guide-dialog')).toHaveCount(0)

  expect(await page.getByTestId('import-file-name').innerText()).toBe(before.file)
  expect(await page.getByTestId('import-summary').innerText()).toBe(before.summary)
  expect(await page.getByTestId('import-rows').locator('li').count()).toBe(before.rows)
  expect(await page.getByTestId('import-filter-errors').getAttribute('aria-checked')).toBe(before.filter)
  expect(page.url()).toBe(before.url)
})
