import { expect, test, type Page } from '@playwright/test'
import { apiSession, signUpAndSkipSetup } from './support/app.ts'

// US-99 (#360): separador de miles al escribir el monto. CP-REG-053 a 057.
// El formato es-AR se arma mientras se tipea; lo que se guarda no cambia (C2).

const amount = (page: Page) => page.getByTestId('transaction-form-amount')

test('CP-REG-053 · el monto se muestra con separador de miles y coma decimal mientras se escribe', async ({ page }) => {
  await signUpAndSkipSetup(page, 'reg-053')
  await page.goto('/register')
  await amount(page).pressSequentially('12500')
  await expect(amount(page)).toHaveValue('12.500')
  await amount(page).pressSequentially(',5')
  await expect(amount(page)).toHaveValue('12.500,5')
  await amount(page).fill('')
  await amount(page).pressSequentially('1234567')
  await expect(amount(page)).toHaveValue('1.234.567')
})

test('CP-REG-054 · pegar un valor con punto decimal lo muestra en es-AR y una coma sola queda como «0,»', async ({ page }) => {
  await signUpAndSkipSetup(page, 'reg-054')
  await page.goto('/register')
  await amount(page).fill('1234.56')
  await expect(amount(page)).toHaveValue('1.234,56')
  await amount(page).fill('')
  await amount(page).pressSequentially(',')
  await expect(amount(page)).toHaveValue('0,')
  await amount(page).fill('')
  await amount(page).pressSequentially('12a')
  await expect(amount(page)).toHaveValue('12')
})

test('CP-REG-055 · al editar en el medio el cursor no salta al final y borrar un punto borra el dígito vecino', async ({ page }) => {
  await signUpAndSkipSetup(page, 'reg-055')
  await page.goto('/register')
  await amount(page).pressSequentially('1250')
  await expect(amount(page)).toHaveValue('1.250')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft') // «1.|250»
  await page.keyboard.type('9')
  await expect(amount(page)).toHaveValue('19.250')
  await page.keyboard.type('7')
  await expect(amount(page)).toHaveValue('197.250')
  const caret = await amount(page).evaluate((el) => (el as HTMLInputElement).selectionStart)
  expect(caret).toBe(3) // «197|.250»: sigue junto a lo recién escrito
  await page.keyboard.press('ArrowRight') // «197.|250»
  await page.keyboard.press('Backspace')
  await expect(amount(page)).toHaveValue('19.250')
})

test('CP-REG-056 · el gasto se guarda con el mismo valor que se escribió (12.500,5 → 12500.50)', async ({ page, request }) => {
  const { email } = await signUpAndSkipSetup(page, 'reg-056')
  await page.goto('/register')
  await amount(page).pressSequentially('12500,5')
  await expect(amount(page)).toHaveValue('12.500,5')
  await page.getByTestId('transaction-form-next').click()
  await page.getByTestId('transaction-form-category-chip-otros').click()
  await page.getByTestId('transaction-form-account-chip-efectivo').click()
  await page.getByTestId('transaction-form-submit').click()
  await expect(page.getByTestId('transaction-form-saved')).toBeVisible()
  const api = await apiSession(request, email)
  const rows = (await api.select('transactions', 'select=amount_text:amount::text')).body as { amount_text: string }[]
  expect(rows).toEqual([{ amount_text: '12500.50' }])
})

test('CP-REG-057 · Nueva deuda y Nueva suscripción también muestran el monto con separador de miles', async ({ page }) => {
  await signUpAndSkipSetup(page, 'reg-057')
  await page.goto('/debts/new')
  await page.getByTestId('debt-form-amount').pressSequentially('2500000')
  await expect(page.getByTestId('debt-form-amount')).toHaveValue('2.500.000')
  await page.goto('/subscriptions/new')
  await page.getByTestId('subscription-form-amount').pressSequentially('7500,5')
  await expect(page.getByTestId('subscription-form-amount')).toHaveValue('7.500,5')
})
