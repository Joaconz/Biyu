/// <reference lib="dom" />
// (page.evaluate corre en el navegador: necesita los tipos del DOM)
import { expect, type Page, test } from '@playwright/test'

// Ajustes: DEF-015 (#156), DEF-010 (#151) y DEF-011 (#152). Corre contra el deploy (SMOKE_URL),
// como smoke.spec.ts: la lógica de siembra también tiene su test en tests/lib/seedPlan.test.ts y el
// borrado de cuentas el suyo en supabase/tests/database/delete_account.test.sql.
const PASSWORD = 'Smoke-Test-2026'

async function signUpAndSkipSetup(page: Page, tag: string) {
  await page.goto('/signup')
  await page.getByTestId('signup-form-email').fill(`settings+${tag}-${Date.now()}-${test.info().workerIndex}@biyu.test`)
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

test('DEF-015: todo elemento interactivo de Ajustes tiene un data-testid propio', async ({ page }) => {
  await signUpAndSkipSetup(page, 'testids')
  await page.goto('/settings')
  await expect(page.getByTestId('settings-categories-list').locator('li').first()).toBeVisible()
  await expect(page.getByTestId('settings-accounts-list').locator('li').first()).toBeVisible()

  const { missing, duplicated } = await page.evaluate(() => {
    const interactive = [...document.querySelectorAll('main button, main a[href], main input:not([type="hidden"]):not([aria-hidden="true"]), main select, main textarea, main [role="radio"]')]
    const ids = interactive.map((el) => el.getAttribute('data-testid'))
    return {
      missing: interactive.filter((el) => !el.getAttribute('data-testid')).map((el) => el.outerHTML.slice(0, 120)),
      duplicated: [...new Set(ids.filter((id, i) => id && ids.indexOf(id) !== i))],
    }
  })
  expect(missing).toEqual([])
  expect(duplicated).toEqual([])
})

test('DEF-010: archivar todas las categorías no hace que se vuelvan a sembrar', async ({ page }) => {
  await signUpAndSkipSetup(page, 'archivar')
  await page.goto('/settings')
  const rows = page.getByTestId('settings-categories-list').locator('li')
  await expect(rows.first()).toBeVisible()
  while ((await rows.count()) > 0) {
    const before = await rows.count()
    await rows.first().getByRole('button', { name: /^Archivar / }).click()
    await expect(rows).toHaveCount(before - 1)
  }

  await page.goto('/register')
  await expect(page.getByTestId('transaction-form')).toBeVisible()
  await page.goto('/settings')
  await expect(page.getByTestId('settings-accounts-list').locator('li').first()).toBeVisible()
  await expect(rows).toHaveCount(0)
})

test('DEF-011: editar, archivar y eliminar cuentas, con confirmación al eliminar', async ({ page }) => {
  await signUpAndSkipSetup(page, 'cuentas')

  // Un gasto en Efectivo, para que eliminar esa cuenta avise que se lleva un movimiento.
  await page.goto('/register')
  await page.getByTestId('transaction-form-amount').fill('1500')
  await page.getByTestId('transaction-form-next').click()
  await page.getByTestId('transaction-form-category-chip-otros').click()
  await expect(page.getByTestId('transaction-form-step')).toHaveAttribute('data-step', 'details')
  await page.getByTestId('transaction-form-account-chip-efectivo').click()
  await page.getByTestId('transaction-form-submit').click()
  await expect(page.getByTestId('transaction-form-step')).toHaveAttribute('data-step', 'amount')

  await page.goto('/settings')

  // Editar: renombrar la billetera.
  await page.getByTestId('settings-accounts-edit-billetera-virtual').click()
  await page.getByTestId('settings-accounts-edit-name').fill('Mercado Pago')
  await page.getByTestId('settings-accounts-save').click()
  await expect(page.getByTestId('settings-accounts-edit-mercado-pago')).toBeVisible()
  await expect(page.getByTestId('settings-accounts-edit-billetera-virtual')).toHaveCount(0)

  // Archivar: sale de la lista.
  await page.getByTestId('settings-accounts-archive-cuenta-bancaria').click()
  await expect(page.getByTestId('settings-accounts-edit-cuenta-bancaria')).toHaveCount(0)

  // Eliminar (desde la edición): primero se cancela y la cuenta sigue; después se confirma.
  await page.getByTestId('settings-accounts-edit-efectivo').click()
  await page.getByTestId('settings-accounts-delete').click()
  await expect(page.getByTestId('settings-accounts-delete-dialog')).toContainText('¿Seguro que querés eliminar «Efectivo»?')
  await expect(page.getByTestId('settings-accounts-delete-impact')).toContainText('su movimiento')
  await page.getByTestId('settings-accounts-delete-dialog-cancel').click()
  await page.getByTestId('settings-accounts-cancel').click()
  await expect(page.getByTestId('settings-accounts-edit-efectivo')).toBeVisible()

  await page.getByTestId('settings-accounts-edit-efectivo').click()
  await page.getByTestId('settings-accounts-delete').click()
  await page.getByTestId('settings-accounts-delete-dialog-confirm').click()
  await expect(page.getByTestId('settings-accounts-delete-dialog')).toBeHidden()
  await expect(page.getByTestId('settings-accounts-edit-efectivo')).toHaveCount(0)

  // El gasto se fue con la cuenta: el mes queda vacío.
  await page.goto('/dashboard')
  await expect(page.getByTestId('dashboard-empty')).toBeVisible()
})
