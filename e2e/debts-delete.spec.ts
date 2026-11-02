import { expect, type Page, test } from '@playwright/test'
import { signUpAndSkipSetup } from './support/app.ts'

// US-87 (#329), ADR-044 §3: eliminar una deuda pendiente con confirmación. La RPC y su par de
// autorización están en supabase/tests/database/delete_debt.test.sql.

async function createLooseDebt(page: Page, person: string, amount: string) {
  await page.goto('/debts/new')
  await page.getByTestId('debt-form-person').fill(person)
  await page.getByTestId('debt-form-amount').fill(amount)
  await page.getByTestId('debt-form-submit').click()
  await expect(page).toHaveURL(/\/debts\?status=pending/)
}

test('US-87: eliminar una deuda suelta con confirmación; cancelar no borra', async ({ page }) => {
  await signUpAndSkipSetup(page, 'us-87')
  await createLooseDebt(page, 'Lucas', '20000')
  await expect(page.getByTestId('debts-total-owed-to-me')).toContainText('20.000,00')

  // Cancelar no borra nada (CA-3).
  await page.getByTestId('debts-item-delete').click()
  await expect(page.getByTestId('debts-delete-summary')).toContainText('Lucas')
  await expect(page.getByTestId('debts-delete-balance')).toContainText('sube')
  await expect(page.getByTestId('debts-delete-total')).toContainText('«Me deben» pasa de')
  await page.getByTestId('debts-delete-cancel').click()
  await expect(page.getByTestId('debts-delete-dialog')).toHaveCount(0)
  await expect(page.getByTestId('debts-item')).toHaveCount(1)

  // Confirmar la quita del listado y de los totales, y avisa (CA-1, CA-4).
  await page.getByTestId('debts-item-delete').click()
  await page.getByTestId('debts-delete-confirm').click()
  await expect(page.getByTestId('debts-deleted')).toBeVisible()
  await expect(page.getByTestId('debts-item')).toHaveCount(0)
  await expect(page.getByTestId('debts-total-owed-to-me')).not.toContainText('20.000,00')
})

test('US-87: una deuda saldada no ofrece «Eliminar» hasta volver a pendiente', async ({ page }) => {
  await signUpAndSkipSetup(page, 'us-87-saldada')
  await createLooseDebt(page, 'Marta', '700')
  await page.getByTestId('debts-item-settle').click()
  await page.getByTestId('debts-filter-all').click()
  await expect(page.getByTestId('debts-item')).toHaveCount(1)
  await expect(page.getByTestId('debts-item-delete')).toHaveCount(0)
  await page.getByTestId('debts-item-reopen').click()
  await expect(page.getByTestId('debts-item-delete')).toBeVisible()
})

test('US-87: si la baja falla el diálogo sigue abierto y permite reintentar', async ({ page }) => {
  await signUpAndSkipSetup(page, 'us-87-red')
  await createLooseDebt(page, 'Pedro', '900')
  await page.getByTestId('debts-item-delete').click()

  await page.route('**/rest/v1/rpc/delete_debt', (route) => route.abort('failed'))
  await page.getByTestId('debts-delete-confirm').click()
  await expect(page.getByTestId('debts-delete-error')).toBeVisible()
  await expect(page.getByTestId('debts-delete-dialog')).toBeVisible()
  await expect(page.getByTestId('debts-item')).toHaveCount(1)

  await page.unroute('**/rest/v1/rpc/delete_debt')
  await page.getByTestId('debts-delete-confirm').click()
  await expect(page.getByTestId('debts-item')).toHaveCount(0)
})
