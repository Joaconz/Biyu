import { expect, test } from '@playwright/test'
import writeXlsxFile from 'write-excel-file/universal'
import { signUpAndSkipSetup } from './support/app.ts'

// US-80 (#268), ADR-039: compra en cuotas ya empezada. CA-2, CA-3, CA-7, CA-13 y CA-17.
// H es el mes de hoy en Argentina; las fechas son el día 1 de H−n, siempre pasado.

const HEADERS = ['Fecha', 'Tipo', 'Monto', 'Moneda', 'Tipo de cambio', 'Categoría', 'Cuenta', 'Cuotas', 'Cuotas pendientes', 'Nota']

function monthStart(monthsAgo: number) {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }))
  const date = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1)
  return { iso: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`, text: `01/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}` }
}

async function xlsx(rows: (string | number)[][]) {
  const blob = await writeXlsxFile([{ sheet: 'Movimientos', data: [HEADERS, ...rows] }]).toBlob()
  return Buffer.from(await blob.arrayBuffer())
}

test('CA-2, CA-3, CA-13 y CA-17 · una compra de 6 cuotas con 3 pendientes se imputa desde este mes', async ({ page }) => {
  await signUpAndSkipSetup(page, 'us80-import')
  const buffer = await xlsx([[monthStart(4).text, 'Gasto', 120000, 'ARS', '', 'Otros', 'Tarjeta de crédito', 6, 3, 'Heladera']])
  await page.goto('/import')
  await page.getByTestId('import-file-input').setInputFiles({
    name: 'cuotas.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    buffer,
  })
  await expect(page.getByTestId('import-row-2')).toHaveAttribute('data-status', 'ready')
  await expect(page.getByTestId('import-row-2-pending')).toHaveText('Faltan 3 de 6 cuotas ($60.000,00)')
  await expect(page.getByTestId('import-summary-amounts')).toContainText('Vas a importar 1 movimiento: $60.000,00 en gastos y $0,00 en ingresos (en pesos).')

  await page.getByTestId('import-submit').click()
  await expect(page.getByTestId('import-result-title')).toHaveText('Se importó 1 de 1 fila.')
  await expect(page.getByTestId('import-result-amounts')).toContainText('$60.000,00 en gastos y $0,00 en ingresos (en pesos).')
  await page.getByTestId('import-go-transactions').click()
  await expect(page).toHaveURL(new RegExp(`period=${monthStart(0).iso}$`))
  await expect(page.getByText('4/6')).toBeVisible()

  await page.goto(`/transactions?period=${monthStart(1).iso}`)
  await expect(page.getByText('5/6')).toBeHidden()
  await page.goto(`/transactions?period=${monthStart(4).iso}`)
  await expect(page.getByText('/6')).toBeHidden()
})

test('CA-7 · las cuotas pendientes en una compra de una cuota se rechazan', async ({ page }) => {
  await signUpAndSkipSetup(page, 'us80-f19')
  const buffer = await xlsx([[monthStart(1).text, 'Gasto', 1000, 'ARS', '', 'Otros', 'Tarjeta de crédito', 1, 1, '']])
  await page.goto('/import')
  await page.getByTestId('import-file-input').setInputFiles({
    name: 'f19.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    buffer,
  })
  await expect(page.getByTestId('import-row-2')).toHaveAttribute('data-status', 'error')
  await expect(page.getByTestId('import-row-2-errors')).toHaveText('Las cuotas pendientes solo van en una compra en cuotas')
})
