import { expect, test } from '@playwright/test'
import { signUpAndSkipSetup } from './support/app.ts'

// US-53 CA-4: si la puesta al día de suscripciones falla, la franja avisa. La X la cierra y no vuelve al
// recargar en la misma sesión del navegador.

test('la franja de la puesta al día que falló se cierra con la X y no vuelve al recargar', async ({ page }) => {
  // La Edge Function responde con error, como cuando no está desplegada o se cae.
  await page.route('**/functions/v1/run-subscription-catchup', (route) => route.fulfill({ status: 503, body: 'Service Unavailable' }))
  await signUpAndSkipSetup(page, 'catchup-dismiss')
  await page.goto('/dashboard')

  const banner = page.getByTestId('app-catchup-error')
  await expect(banner).toBeVisible()
  await expect(page.getByTestId('app-catchup-retry')).toBeVisible()
  await page.getByTestId('app-catchup-dismiss').click()
  await expect(banner).toHaveCount(0)

  // Sigue cerrada al pasar de pantalla y al recargar (la puesta al día vuelve a correr y a fallar).
  await page.goto('/debts')
  await expect(page.getByTestId('debts-title')).toBeVisible()
  await expect(banner).toHaveCount(0)
  await page.reload()
  await expect(page.getByTestId('debts-title')).toBeVisible()
  await expect(banner).toHaveCount(0)
})
