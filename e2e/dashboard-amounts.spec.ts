/// <reference lib="dom" />
// (page.evaluate corre en el navegador: necesita los tipos del DOM)
import { expect, type Page, test } from '@playwright/test'

// DEF-021 (#167): en el celular, los montos grandes del Resumen se cortaban o desbordaban su
// tarjeta, y el "100,0 %" de "Por categoría" bajaba de línea. Es de layout, así que no hay un
// nivel más bajo que lo vea. Corre contra el deploy (SMOKE_URL), como smoke.spec.ts.
// El gasto es el máximo de una transacción (numeric(14,2)); sin ingresos, el balance es el mismo
// monto en negativo: el texto más largo que entra en una sola transacción.
const PASSWORD = 'Smoke-Test-2026'
const MAX_AMOUNT = '999999999999,99'

test.use({ viewport: { width: 360, height: 780 } })

/** Elementos que se salen de su tarjeta (o de la pantalla) o que ocupan más de una línea. */
async function layoutProblems(page: Page) {
  return page.evaluate(() => {
    const problems: string[] = []
    const viewport = document.documentElement.clientWidth
    const singleLine = (el: Element) => {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || parseFloat(getComputedStyle(el).fontSize) * 1.3
      return el.getBoundingClientRect().height < lineHeight * 1.5
    }
    const amounts = document.querySelectorAll(
      '[data-testid="dashboard-total-expenses"], [data-testid="dashboard-total-income"], [data-testid="dashboard-total-balance"], [data-testid="category-bar-amount"], [data-testid="account-item-amount"]',
    )
    for (const el of amounts) {
      const id = el.getAttribute('data-testid')!
      const card = el.closest('[data-testid="dashboard-total"], [data-testid="dashboard-income"], [data-testid="dashboard-balance"], [role="listitem"]')!
      const box = el.getBoundingClientRect()
      const cardBox = card.getBoundingClientRect()
      if (box.right > cardBox.right + 0.5 || box.left < cardBox.left - 0.5 || box.right > viewport) problems.push(`${id} se sale de su tarjeta`)
      if (el.scrollWidth > el.clientWidth + 1) problems.push(`${id} está cortado`)
      if (!singleLine(el)) problems.push(`${id} ocupa más de una línea`)
    }
    for (const el of document.querySelectorAll('[data-testid="category-bar-percentage"], [data-testid="account-item-percentage"]')) {
      if (!singleLine(el)) problems.push(`${el.getAttribute('data-testid')} baja de línea`)
    }
    // El monto no puede dejar el nombre reducido a una letra ("C" por "Comida y supermercado").
    for (const el of document.querySelectorAll('[data-testid="category-bar-name"], [data-testid="account-item-name"]')) {
      if (el.scrollWidth > el.clientWidth + 1) problems.push(`${el.getAttribute('data-testid')} queda cortado`)
    }
    if (document.documentElement.scrollWidth > viewport) problems.push('la página tiene scroll horizontal')
    return problems
  })
}

test('los montos más grandes entran en sus tarjetas del Resumen a 360 px (DEF-021)', async ({ page }) => {
  const email = `amounts+${Date.now()}-${test.info().workerIndex}@biyu.test`
  await page.goto('/signup')
  await page.getByTestId('signup-form-email').fill(email)
  await page.getByTestId('signup-form-password').fill(PASSWORD)
  await page.getByTestId('signup-form-confirm-password').fill(PASSWORD)
  await page.getByTestId('signup-form-submit').click()
  // US-68: si aparece el setup, se saltea. Lo que se prueba acá es el Resumen, no el setup.
  const form = page.getByTestId('transaction-form')
  await expect(form.or(page.getByTestId('setup-reason-skip'))).toBeVisible({ timeout: 15_000 })
  if (!(await form.isVisible())) {
    await page.getByTestId('setup-reason-skip').click()
    await page.getByTestId('setup-categories-skip').click()
    await page.getByTestId('setup-accounts-skip').click()
    await page.getByTestId('setup-expense-skip').click()
  }
  // Se carga Registrar de cero antes de escribir. Antes de corregir DEF-023 (#193), justo después
  // del alta podía volver a montarse y perder lo tipeado; se deja para no depender de ese momento.
  await expect(page).toHaveURL(/\/register$/)
  await page.goto('/register')
  await page.getByTestId('transaction-form-amount').fill(MAX_AMOUNT)
  await page.getByTestId('transaction-form-next').click()
  await page.getByTestId('transaction-form-category-chip-comida-y-supermercado').click()
  await expect(page.getByTestId('transaction-form-step')).toHaveAttribute('data-step', 'details')
  await page.getByTestId('transaction-form-account-chip-efectivo').click()
  await page.getByTestId('transaction-form-submit').click()
  await expect(page.getByTestId('transaction-form-step')).toHaveAttribute('data-step', 'amount')

  await page.goto('/dashboard')
  await expect(page.getByTestId('dashboard-total-expenses')).toHaveText('$999.999.999.999,99')
  await expect(page.getByTestId('dashboard-total-balance')).toHaveText('-$999.999.999.999,99')
  await expect(page.getByTestId('category-bar-percentage')).toBeVisible()

  expect(await layoutProblems(page)).toEqual([])
})
