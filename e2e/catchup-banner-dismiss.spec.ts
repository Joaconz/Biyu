import { expect, test } from '@playwright/test'
import { signUpAndSkipSetup } from './support/app.ts'

// US-53 CA-4: si la puesta al día de suscripciones falla, la franja avisa. La X la cierra y no vuelve al
// recargar en la misma sesión del navegador.

test('CP-SUS-067 · la franja de la puesta al día que falló se cierra con la X y no vuelve al cambiar de pantalla ni al recargar', async ({ page }) => {
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

test('CP-SUS-068 · «Reintentar» llama de nuevo y, si anda, la franja desaparece', async ({ page }) => {
  let failing = true
  let calls = 0
  const cors = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': 'POST, OPTIONS' }
  await page.route('**/functions/v1/run-subscription-catchup', (route) => {
    if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors })
    calls += 1
    // La función responde bien a partir del segundo intento: no depende de que el Edge Runtime local aguante.
    return failing
      ? route.fulfill({ status: 503, headers: cors, body: 'Service Unavailable' })
      : route.fulfill({ status: 200, headers: cors, contentType: 'application/json', body: JSON.stringify({ generated: 0, failed: [] }) })
  })
  await signUpAndSkipSetup(page, 'catchup-retry')
  await page.goto('/dashboard')

  await expect(page.getByTestId('app-catchup-error')).toBeVisible()
  const before = calls
  failing = false
  await page.getByTestId('app-catchup-retry').click()
  await expect(page.getByTestId('app-catchup-error')).toHaveCount(0, { timeout: 15_000 })
  expect(calls).toBeGreaterThan(before)
})
