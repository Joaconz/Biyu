import { expect, test } from '@playwright/test'
import { signUpAndSkipSetup } from './support/app.ts'

// «Nueva deuda» (US-36): DEF-037 (#351). El primer clic en «US$» se perdía porque, al salir del
// foco de «Persona», aparecía su error y corría los botones de moneda entre apretar y soltar.

test('CP-DEU-024 · el primer clic en «US$» selecciona la moneda y muestra el tipo de cambio (DEF-037)', async ({ page }) => {
  await signUpAndSkipSetup(page, 'cp-deu-024')
  await page.goto('/debts/new')
  await expect(page.getByTestId('debt-form-person')).toBeFocused()

  await page.getByTestId('debt-form-currency-usd').click()

  await expect(page.getByTestId('debt-form-currency-usd')).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByTestId('debt-form-fx-rate')).toBeVisible()
  // El error de «Persona» sigue apareciendo al salir del campo (CP-DEU-021), después del clic.
  await expect(page.getByTestId('debt-form-person-error')).toHaveText('Ingresá el nombre de la persona')
})

test('CP-DEU-021 · dejar «Persona» vacía y pasar a «Monto» muestra su error y deshabilita «Guardar deuda»', async ({ page }) => {
  await signUpAndSkipSetup(page, 'cp-deu-021')
  await page.goto('/debts/new')
  await page.getByTestId('debt-form-amount').click()
  await page.getByTestId('debt-form-amount').fill('20000')

  await expect(page.getByTestId('debt-form-person-error')).toHaveText('Ingresá el nombre de la persona')
  await expect(page.getByTestId('debt-form-submit')).toBeDisabled()
})

test('con el teclado, salir de «Persona» vacía muestra el error enseguida', async ({ page }) => {
  await signUpAndSkipSetup(page, 'deu-tab')
  await page.goto('/debts/new')
  await expect(page.getByTestId('debt-form-person')).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByTestId('debt-form-person-error')).toHaveText('Ingresá el nombre de la persona')
})
