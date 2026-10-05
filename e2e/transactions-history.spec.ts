import { expect, type Page, test } from '@playwright/test'

// Historial de /transactions: DEF-006 (#147) y DEF-007 (#148). Corre contra el deploy (SMOKE_URL),
// como smoke.spec.ts. restore_transaction tiene además su test pgTAP.
const PASSWORD = 'Smoke-Test-2026'

async function signUpAndSkipSetup(page: Page, tag: string) {
  await page.goto('/signup')
  await page.getByTestId('signup-form-email').fill(`history+${tag}-${Date.now()}-${test.info().workerIndex}@biyu.test`)
  await page.getByTestId('signup-form-password').fill(PASSWORD)
  await page.getByTestId('signup-form-confirm-password').fill(PASSWORD)
  await page.getByTestId('signup-form-submit').click()
  const form = page.getByTestId('transaction-form')
  await expect(form.or(page.getByTestId('setup-reason-skip'))).toBeVisible({ timeout: 15_000 })
  if (!(await form.isVisible())) {
    await page.getByTestId('setup-reason-skip').click()
    await page.getByTestId('setup-categories-skip').click()
    await page.getByTestId('setup-accounts-skip').click()
    await page.getByTestId('setup-expense-skip').click()
  }
  await expect(page).toHaveURL(/\/register$/)
}

/** Un gasto en Efectivo. Recarga Registrar antes: justo después del alta puede perder lo tipeado. */
async function registerExpense(page: Page, amount: string, categoryChip: string) {
  await page.goto('/register')
  await page.getByTestId('transaction-form-amount').fill(amount)
  await page.getByTestId('transaction-form-next').click()
  await page.getByTestId(`transaction-form-category-chip-${categoryChip}`).click()
  await expect(page.getByTestId('transaction-form-step')).toHaveAttribute('data-step', 'details')
  await page.getByTestId('transaction-form-account-chip-efectivo').click()
  await page.getByTestId('transaction-form-submit').click()
  await expect(page.getByTestId('transaction-form-step')).toHaveAttribute('data-step', 'amount')
}

test('DEF-007: una transacción eliminada queda en Eliminados, marcada, y se puede restaurar', async ({ page }) => {
  await signUpAndSkipSetup(page, 'restaurar')
  await registerExpense(page, '1500', 'otros')

  await page.goto('/transactions')
  const items = page.getByTestId('transactions-item')
  await expect(items).toHaveCount(1)
  await page.getByTestId('transactions-item-delete').click()
  await expect(page.getByTestId('delete-transaction-dialog')).toContainText('¿Estás seguro de que querés eliminar esta transacción?')
  await page.getByTestId('delete-transaction-confirm').click()
  await expect(page.getByTestId('transactions-empty')).toBeVisible()

  // Sigue en el historial, en su propia vista y con la marca.
  await page.getByTestId('transactions-filter-deleted').click()
  await expect(page).toHaveURL(/view=deleted/)
  await expect(items).toHaveCount(1)
  await expect(page.getByTestId('transactions-item-deleted')).toHaveText('eliminada')
  await expect(page.getByTestId('transactions-item-delete')).toHaveCount(0)

  await page.getByTestId('transactions-item-restore').click()
  await expect(page.getByTestId('transactions-empty')).toBeVisible()
  await page.getByTestId('transactions-filter-active').click()
  await expect(items).toHaveCount(1)
  await expect(page.getByTestId('transactions-item-deleted')).toHaveCount(0)

  // Restaurada, vuelve a sumar.
  await page.goto('/dashboard')
  await expect(page.getByTestId('dashboard-total-expenses')).toHaveText('$1.500,00')
})

test('DEF-006: un movimiento de una categoría archivada lleva la marca de archivada', async ({ page }) => {
  await signUpAndSkipSetup(page, 'archivada')
  await registerExpense(page, '2500', 'salud')

  await page.goto('/settings')
  await page.getByRole('button', { name: 'Archivar Salud' }).click()
  await expect(page.getByRole('button', { name: 'Archivar Salud' })).toHaveCount(0)

  await page.goto('/transactions')
  await expect(page.getByTestId('transactions-item')).toHaveCount(1)
  await expect(page.getByTestId('transactions-item-archived')).toContainText('archivada')
})
