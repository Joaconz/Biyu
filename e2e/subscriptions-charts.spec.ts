import { expect, test, type APIRequestContext, type Page } from '@playwright/test'
import { apiSession, signUpAndSkipSetup } from './support/app.ts'

// Gráficos de Suscripciones (ADR-053): «Cobros de {mes}» y «Por categoría». No son casos CP-*: es la prueba
// de que la pantalla los dibuja con los mismos números que el héroe. Con día de cobro 28 el mes corriente
// todavía no se cobró si hoy es el 27 o antes; con día 1 ya se cobró.

const ymd = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date())
const currentMonthStart = () => `${ymd().slice(0, 7)}-01`

async function setup(page: Page, request: APIRequestContext, tag: string) {
  const { email } = await signUpAndSkipSetup(page, tag)
  const api = await apiSession(request, email)
  const id = async (table: 'categories' | 'accounts', name: string) =>
    ((await api.select(table, `select=id&name=eq.${encodeURIComponent(name)}`)).body as { id: string }[])[0].id
  return { api, cash: await id('accounts', 'Efectivo'), category: (name: string) => id('categories', name) }
}

const create = async (s: Awaited<ReturnType<typeof setup>>, over: { name: string; amount: string; day: number; category: string }) => {
  const res = await s.api.rpc('create_subscription', {
    p_name: over.name, p_amount: over.amount, p_currency: 'ARS', p_category_id: await s.category(over.category), p_account_id: s.cash,
    p_billing_day: over.day, p_start_period: currentMonthStart(), p_end_period: null, p_description: null,
  })
  expect(res.status).toBe(200)
}

test('sin suscripciones activas no se dibuja ningún gráfico', async ({ page, request }) => {
  await setup(page, request, 'chart-empty')
  await page.goto('/subscriptions')
  await expect(page.getByTestId('subscriptions-empty')).toBeVisible()
  await expect(page.getByTestId('subscriptions-schedule')).toHaveCount(0)
  await expect(page.getByTestId('subscriptions-by-category')).toHaveCount(0)
})

test('los gráficos reparten lo comprometido por día de cobro y por categoría con los números del héroe', async ({ page, request }) => {
  test.skip(Number(ymd().slice(8, 10)) > 27, 'Necesita que hoy sea el día 27 o antes (día de cobro 28)')
  const s = await setup(page, request, 'chart-main')
  await create(s, { name: 'Netflix', amount: '5000.00', day: 1, category: 'Entretenimiento' })
  await create(s, { name: 'Spotify', amount: '2500.00', day: 28, category: 'Entretenimiento' })
  await create(s, { name: 'Gimnasio', amount: '2500.00', day: 28, category: 'Salud' })
  await page.goto('/subscriptions')

  await expect(page.getByTestId('subscriptions-committed-total')).toContainText('10.000,00')
  await expect(page.getByTestId('subscriptions-schedule-charged-amount')).toHaveAttribute('data-amount', '5000.00')
  await expect(page.getByTestId('subscriptions-schedule-pending-amount')).toHaveAttribute('data-amount', '5000.00')

  // El día 28 tiene dos cobros por cobrar; al tocarlo se listan sus suscripciones.
  await page.getByTestId('subscriptions-schedule-day-28').click()
  const detail = page.getByTestId('subscriptions-schedule-detail')
  await expect(detail).toContainText('Spotify')
  await expect(detail).toContainText('Gimnasio')
  await expect(detail).not.toContainText('Netflix')
  await page.getByTestId('subscriptions-schedule-day-1').click()
  await expect(detail).toContainText('Netflix')
  await expect(detail).toContainText('Cobrado')

  // Por categoría: Entretenimiento 7.500 (75 %) y Salud 2.500 (25 %), de mayor a menor.
  const rows = page.getByTestId('subscriptions-by-category-list').locator('[data-testid^="subscriptions-by-category-"][role="listitem"]')
  await expect(rows).toHaveCount(2)
  await expect(rows.nth(0)).toContainText('Entretenimiento')
  await expect(rows.nth(0)).toContainText('7.500,00')
  await expect(rows.nth(0)).toContainText('75,0 %')
  await expect(rows.nth(1)).toContainText('Salud')

  // Las tablas para lector de pantalla traen los mismos datos.
  await expect(page.getByTestId('subscriptions-schedule-table').locator('tbody tr')).toHaveCount(3)
  await expect(page.getByTestId('subscriptions-by-category-table').locator('tbody tr')).toHaveCount(2)
})
