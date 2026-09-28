import { expect, test } from '@playwright/test'

// Flujo completo (docs/03-architecture-spec.md §Seams de testing): alta → gasto en cuotas →
// dashboard. Cada corrida crea un usuario nuevo, así el total del mes es solo esta compra.
// $1.000 en 3 cuotas: 333,33 + 333,33 + 333,34 (C3), y en el mes corriente cae la primera.
const AMOUNT = '1000'
const FIRST_INSTALLMENT = '$333,33'
// Ficticia; cumple la política del proyecto hosteado (mayúscula y número), más estricta que la local.
const PASSWORD = 'Smoke-Test-2026'

test('alta, gasto en 3 cuotas con tarjeta de crédito y total del mes en el dashboard', async ({ page }, testInfo) => {
  // workerIndex: dos workers en paralelo pueden arrancar en el mismo milisegundo (--repeat-each).
  const email = `smoke+${Date.now()}-${testInfo.workerIndex}@biyu.test`

  await page.goto('/signup')
  await page.getByTestId('signup-form-email').fill(email)
  await page.getByTestId('signup-form-password').fill(PASSWORD)
  await page.getByTestId('signup-form-submit').click()

  await expect(page).toHaveURL(/\/register$/)
  await expect(page.getByTestId('transaction-form')).toBeVisible()

  await page.getByTestId('transaction-form-amount').fill(AMOUNT)
  await page.getByTestId('transaction-form-category-chip-comida-y-supermercado').click()
  await page.getByTestId('transaction-form-account-chip-tarjeta-de-credito').click()
  await page.getByTestId('transaction-form-installments-chip-3').click()
  await expect(page.getByTestId('transaction-form-installments-preview-summary')).toContainText(
    `3 cuotas de ${FIRST_INSTALLMENT}`,
  )

  await page.getByTestId('transaction-form-submit').click()
  await expect(page.getByTestId('transaction-form-saved')).toBeVisible() // US-10

  await page.getByTestId('register-nav-dashboard').click()
  await expect(page).toHaveURL(/\/dashboard/)
  await expect(page.getByTestId('dashboard-total-expenses')).toHaveText(FIRST_INSTALLMENT)
})
