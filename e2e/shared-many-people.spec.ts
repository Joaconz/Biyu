import { expect, type Page, test } from '@playwright/test'
import { signUpAndSkipSetup } from './support/app.ts'

// US-82 (#270), ADR-040: un gasto compartido con varias personas. CA-1 a CA-7, CA-10, CA-11 y CA-12.

async function toDetails(page: Page, amount: string) {
  await page.goto('/register')
  await page.getByTestId('transaction-form-amount').fill(amount)
  await page.getByTestId('transaction-form-next').click()
  await page.getByTestId('transaction-form-category-chip-otros').click()
  await expect(page.getByTestId('transaction-form-step')).toHaveAttribute('data-step', 'details')
  await page.getByTestId('transaction-form-account-chip-efectivo').click()
  await page.getByTestId('transaction-form-shared-toggle').click()
}

async function backToAmount(page: Page) {
  while ((await page.getByTestId('transaction-form-step').getAttribute('data-step')) !== 'amount') await page.getByTestId('transaction-form-back').click()
}

async function forwardToDetails(page: Page) {
  await page.getByTestId('transaction-form-next').click()
  await page.getByTestId('transaction-form-category-chip-otros').click()
  await expect(page.getByTestId('transaction-form-step')).toHaveAttribute('data-step', 'details')
}

const person = (page: Page, i: number) => page.locator(`[data-testid="transaction-form-shared-person"][data-index="${i}"]`)
const amountOf = (page: Page, i: number) => page.locator(`[data-testid="transaction-form-shared-amount"][data-index="${i}"]`)
const rowsOf = (page: Page) => page.getByTestId('transaction-form-shared-row')

test('CA-1, CA-3 y CA-7 · agregar, dividir en partes iguales y quitar filas', async ({ page }) => {
  await signUpAndSkipSetup(page, 'us82-rows')
  await toDetails(page, '100000')
  await expect(rowsOf(page)).toHaveCount(1)
  await expect(page.getByTestId('transaction-form-shared-remove')).toHaveCount(0)

  await page.getByTestId('transaction-form-shared-add').click()
  await expect(rowsOf(page)).toHaveCount(2)
  await expect(person(page, 2)).toBeFocused()
  await expect(page.getByTestId('transaction-form-shared-remove')).toHaveCount(2)

  await person(page, 1).fill('Sofía')
  await person(page, 2).fill('Juan')
  await page.getByTestId('transaction-form-shared-split').click()
  await expect(amountOf(page, 1)).toHaveValue('33333,33')
  await expect(amountOf(page, 2)).toHaveValue('33333,33')
  await expect(page.getByTestId('transaction-form-shared-summary')).toHaveText(
    'Te van a deber $66.666,66 entre 2 personas · Tu parte: $33.333,34',
  )

  // CA-7: con tres filas cargadas, quitar la 2 deja la 1 y la 3 con sus valores.
  await page.getByTestId('transaction-form-shared-add').click()
  await person(page, 3).fill('Ana')
  await amountOf(page, 3).fill('100')
  await page.locator('[data-testid="transaction-form-shared-remove"][data-index="2"]').click()
  await expect(rowsOf(page)).toHaveCount(2)
  await expect(person(page, 1)).toHaveValue('Sofía')
  await expect(person(page, 2)).toHaveValue('Ana')
  await expect(amountOf(page, 2)).toHaveValue('100')
})

test('CA-4, CA-5 y CA-6 · la suma, el tope de 10 y la persona repetida', async ({ page }) => {
  await signUpAndSkipSetup(page, 'us82-limits')
  await toDetails(page, '120000')
  await page.getByTestId('transaction-form-shared-add').click()
  await person(page, 1).fill('Sofía')
  await amountOf(page, 1).fill('60000')
  await person(page, 2).fill('Juan')
  await amountOf(page, 2).fill('60000,01')
  await expect(page.getByTestId('transaction-form-shared-total-error')).toHaveText(
    'Entre todos no pueden deber más que el gasto ($120.000,00)',
  )
  await expect(page.getByTestId('transaction-form-submit')).toBeDisabled()
  await amountOf(page, 2).fill('60000')
  await expect(page.getByTestId('transaction-form-shared-total-error')).toHaveCount(0)
  await expect(page.getByTestId('transaction-form-submit')).toBeEnabled()

  // CA-6: la misma persona con otro recorte y mayúsculas.
  await person(page, 2).fill('  sofía ')
  await person(page, 2).blur()
  await expect(page.getByTestId('transaction-form-shared-person-error')).toHaveText('Ya agregaste a Sofía')
  await expect(page.getByTestId('transaction-form-submit')).toBeDisabled()

  // CA-5: con 10 filas no se puede agregar.
  for (let i = 0; i < 8; i++) {
    await page.getByTestId('transaction-form-shared-add').click()
    await expect(rowsOf(page)).toHaveCount(3 + i)
  }
  await expect(rowsOf(page)).toHaveCount(10)
  await expect(page.getByTestId('transaction-form-shared-add')).toBeDisabled()
  await expect(page.getByTestId('transaction-form-shared-limit')).toHaveText('Podés compartir un gasto con hasta 10 personas')
})

test('CA-2, CA-10, CA-11 y CA-12 · se guarda con una sola llamada y se ve en Movimientos, el borrado y Deudas', async ({ page }) => {
  await signUpAndSkipSetup(page, 'us82-save')
  await toDetails(page, '120000')
  await page.getByTestId('transaction-form-shared-add').click()
  await person(page, 1).fill('Sofía')
  await amountOf(page, 1).fill('40000')
  await person(page, 2).fill('Juan')
  await amountOf(page, 2).fill('40000')

  const rpcCalls: string[] = []
  page.on('request', (request) => {
    if (request.method() !== 'GET' && request.url().includes('/rest/v1/')) rpcCalls.push(new URL(request.url()).pathname)
  })
  await page.getByTestId('transaction-form-submit').click()
  await expect(page.getByTestId('transaction-form-saved')).toContainText('Juan y Sofía te deben $80.000,00')
  expect(rpcCalls.filter((p) => p.endsWith('/rpc/create_transaction'))).toHaveLength(1)
  expect(rpcCalls.filter((p) => p.includes('/debts'))).toHaveLength(0)

  await page.goto('/transactions')
  await expect(page.getByTestId('transactions-item-shared').first()).toHaveText('Compartido con Juan y Sofía')

  await page.goto('/debts?status=all')
  const people = page.getByTestId('debts-item-person')
  await expect(people).toHaveText(['Juan', 'Sofía'])
})

test('CA-11 · el diálogo de borrado lista las deudas de las tres personas', async ({ page }) => {
  await signUpAndSkipSetup(page, 'us82-delete')
  await toDetails(page, '90000')
  await page.getByTestId('transaction-form-shared-add').click()
  await expect(rowsOf(page)).toHaveCount(2)
  await page.getByTestId('transaction-form-shared-add').click()
  await expect(rowsOf(page)).toHaveCount(3)
  for (const [i, name] of [[1, 'Sofía'], [2, 'Juan'], [3, 'Ana']] as const) {
    await person(page, i).fill(name)
    await amountOf(page, i).fill('30000')
  }
  await page.getByTestId('transaction-form-submit').click()
  await expect(page.getByTestId('transaction-form-saved')).toBeVisible()

  await page.goto('/transactions')
  await expect(page.getByTestId('transactions-item-shared').first()).toHaveText('Compartido con Ana y 2 más')
  await page.getByTestId('transactions-item-edit').first().click()
  await page.getByTestId('edit-transaction-delete').click()
  await expect(page.getByTestId('delete-transaction-debt-warning')).toHaveText(
    'También dejan de contar las deudas con Ana, Juan y Sofía por $90.000,00 en total.',
  )
})

test('CP-DEU-095 · cambiar el paso 1 con filas cargadas: otra moneda vacía los montos y pasar a ingreso apaga el interruptor', async ({ page }) => {
  await signUpAndSkipSetup(page, 'cp-deu-095')
  await toDetails(page, '80000')
  await page.getByTestId('transaction-form-shared-add').click()
  await person(page, 1).fill('Sofía')
  await amountOf(page, 1).fill('40000')
  await person(page, 2).fill('Juan')
  await amountOf(page, 2).fill('40000')

  // Pasos 3 y 5: otra moneda en el paso 1 vacía los montos y conserva las personas.
  await backToAmount(page)
  await page.getByTestId('transaction-form-currency-usd').click()
  await page.getByTestId('transaction-form-fx-rate').fill('1000')
  await forwardToDetails(page)
  await expect(person(page, 1)).toHaveValue('Sofía')
  await expect(person(page, 2)).toHaveValue('Juan')
  await expect(amountOf(page, 1)).toHaveValue('')
  await expect(amountOf(page, 2)).toHaveValue('')

  // Paso 4: pasar a Ingreso y volver a Gasto deja el interruptor apagado.
  await backToAmount(page)
  await page.getByTestId('transaction-form-type-income').click()
  await page.getByTestId('transaction-form-type-expense').click()
  await forwardToDetails(page)
  await expect(page.getByTestId('transaction-form-shared-toggle')).toHaveAttribute('aria-checked', 'false')
  await page.getByTestId('transaction-form-shared-toggle').click()
  await expect(rowsOf(page)).toHaveCount(1)
  await expect(person(page, 1)).toHaveValue('')
})

test('CP-DEU-095 · bajar el gasto con filas cargadas marca la suma y después el tope por fila, sin ajustar las deudas', async ({ page }) => {
  await signUpAndSkipSetup(page, 'cp-deu-095-tope')
  await toDetails(page, '80000')
  await page.getByTestId('transaction-form-shared-add').click()
  await person(page, 1).fill('Sofía')
  await amountOf(page, 1).fill('40000')
  await person(page, 2).fill('Juan')
  await amountOf(page, 2).fill('40000')

  await backToAmount(page)
  await page.getByTestId('transaction-form-amount').fill('70000')
  await forwardToDetails(page)
  await expect(page.getByTestId('transaction-form-shared-total-error')).toHaveText(/Entre todos no pueden deber más que el gasto \(\$70\.000,00\)/)

  await backToAmount(page)
  await page.getByTestId('transaction-form-amount').fill('30000')
  await forwardToDetails(page)
  await expect(page.getByTestId('transaction-form-shared-amount-error').first()).toContainText('No puede superar el monto del gasto ($30.000,00)')
  await expect(page.getByTestId('transaction-form-shared-total-error')).toHaveCount(0)
  await expect(amountOf(page, 1)).toHaveValue('40000')
  await expect(amountOf(page, 2)).toHaveValue('40000')
})
