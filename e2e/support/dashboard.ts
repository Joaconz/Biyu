import { expect, type Page } from '@playwright/test'

/**
 * Abre la hoja (o el popover, en escritorio) de opciones del héroe del Resumen. Desde ADR-053 el desglose del
 * número (gastos, ingresos, y lo que entra o queda afuera) vive ahí, junto a los interruptores. Si ya está
 * abierta, no hace nada.
 */
export async function openSpentOptions(page: Page) {
  const panel = page.getByTestId('dashboard-spent-options-panel')
  if (await panel.isVisible()) return
  await page.getByTestId('dashboard-spent-options').click()
  await expect(panel).toBeVisible()
}

export type SpentOption = 'income' | 'loose-debts' | 'reimbursements' | 'pending-subscriptions'

/**
 * Incluye opciones en el número del héroe (ADR-053) desde su propia hoja: abre, prende las que falten (cada una
 * espera su guardado en user_preferences) y cierra con Escape. Desde ADR-053 el predeterminado es «solo gastos»,
 * así que los casos que miran ingresos o deudas sueltas en el número las incluyen primero.
 */
export async function includeInSpent(page: Page, options: SpentOption[]) {
  await openSpentOptions(page)
  for (const slug of options) {
    const toggle = page.getByTestId(`dashboard-spent-option-${slug}`)
    if ((await toggle.getAttribute('aria-checked')) === 'true') continue
    const saved = page.waitForResponse(
      (r) => r.url().includes('/rest/v1/user_preferences') && r.request().method() === 'POST' && r.ok(),
    )
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-checked', 'true')
    await saved
  }
  await page.keyboard.press('Escape')
  await expect(page.getByTestId('dashboard-spent-options-panel')).toHaveCount(0)
}
