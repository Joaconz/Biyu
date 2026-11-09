import { expect, type Page } from '@playwright/test'

/**
 * Abre la hoja (o el popover, en escritorio) de la tarjeta de Balance. Desde ADR-052 el desglose del
 * balance (ingresos, gastos y lo que entra o queda afuera) vive ahí, junto a los interruptores de ADR-051.
 * Si ya está abierta, no hace nada.
 */
export async function openBalanceBreakdown(page: Page) {
  const panel = page.getByTestId('dashboard-balance-options-panel')
  if (await panel.isVisible()) return
  await page.getByTestId('dashboard-balance-options').click()
  await expect(panel).toBeVisible()
}
