import { expect, test, type APIRequestContext, type Page } from '@playwright/test'
import { apiSession, signUpAndSkipSetup } from './support/app.ts'

// Casos de las historias de UX de V3 sobre el Resumen y Suscripciones: US-102 (CP-DAS-021), US-103 (CP-DAS-022 a 026)
// y US-104 (CP-SUS-057 a 061). Los que dependen del día del mes se saltean cuando hoy no lo permite.

const ymd = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date())
const day = () => Number(ymd().slice(8, 10))
const thisMonth = () => ymd().slice(0, 7)
/** Primer día del mes `offset` meses desde hoy, en formato YYYY-MM-01. */
function monthStart(offset: number) {
  const [y, m] = ymd().split('-').map(Number)
  const d = new Date(Date.UTC(y, m - 1 + offset, 1))
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-01`
}
const dateIn = (offset: number, dayOfMonth: number) => monthStart(offset).slice(0, 8) + String(dayOfMonth).padStart(2, '0')

async function setup(page: Page, request: APIRequestContext, tag: string) {
  const { email } = await signUpAndSkipSetup(page, tag)
  const api = await apiSession(request, email)
  const id = async (table: 'categories' | 'accounts', name: string) =>
    ((await api.select(table, `select=id&name=eq.${encodeURIComponent(name)}`)).body as { id: string }[])[0].id
  return { api, id }
}
type S = Awaited<ReturnType<typeof setup>>

const tx = async (s: S, o: { category?: string | null; account?: string; amount: string; on?: string; type?: 'expense' | 'income'; installments?: number }) => {
  const res = await s.api.rpc('create_transaction', {
    p_type: o.type ?? 'expense', p_amount: o.amount, p_currency: 'ARS', p_fx_rate: null,
    p_category_id: o.category === null ? null : await s.id('categories', o.category ?? 'Otros'),
    p_account_id: await s.id('accounts', o.account ?? 'Efectivo'), p_installments_count: o.installments ?? 1,
    p_occurred_on: o.on ?? ymd(), p_description: null, p_request_id: null,
  })
  expect(res.status).toBe(200)
  return res.body as string
}

const sub = async (s: S, o: { name: string; amount: string; day: number; category: string; currency?: 'ARS' | 'USD' }) => {
  const res = await s.api.rpc('create_subscription', {
    p_name: o.name, p_amount: o.amount, p_currency: o.currency ?? 'ARS', p_category_id: await s.id('categories', o.category),
    p_account_id: await s.id('accounts', 'Efectivo'), p_billing_day: o.day, p_start_period: monthStart(0), p_end_period: null, p_description: null,
  })
  expect(res.status).toBe(200)
}

// ------------------------------------------------------------------ US-102

test('CP-DAS-021 · un monto con centavos se lee igual en pantalla, con lector y en los tests', async ({ page, request }) => {
  const s = await setup(page, request, 'das-021')
  await tx(s, { amount: '436850.50' })
  await page.goto(`/dashboard?period=${thisMonth()}`)
  const total = page.getByTestId('dashboard-total-expenses')
  await expect(total).toHaveText('$436.850,50')
  expect(await total.evaluate((el) => el.textContent)).toBe('$436.850,50')
  expect(await total.evaluate((el) => (el as HTMLElement).innerText.replace(/\s+/g, ''))).toBe('$436.850,50')
})

// ------------------------------------------------------------------ US-103

test('CP-DAS-022 · la dona tiene una porción por categoría con monto y porcentaje y el total compacto en el hueco', async ({ page, request }) => {
  const s = await setup(page, request, 'das-022')
  await tx(s, { category: 'Comida y supermercado', amount: '6000.00' })
  await tx(s, { category: 'Transporte', amount: '3000.00' })
  await tx(s, { category: 'Salud', amount: '1000.00' })
  await tx(s, { category: null, type: 'income', amount: '50000.00' })
  const deleted = await tx(s, { category: 'Servicios', amount: '2000.00' })
  expect((await s.api.rpc('delete_transaction', { p_transaction_id: deleted })).status).toBeLessThan(300)
  await page.goto(`/dashboard?period=${thisMonth()}`)
  const slices = page.locator('[data-testid^="dashboard-category-chart-slice-"]')
  await expect(slices).toHaveCount(3)
  expect(await slices.evaluateAll((els) => els.map((el) => `${el.getAttribute('data-amount')}|${el.getAttribute('data-percentage')}`))).toEqual([
    '6000.00|60.0', '3000.00|30.0', '1000.00|10.0',
  ])
  const total = page.getByTestId('dashboard-category-chart-total')
  await expect(total).toHaveAttribute('data-amount', '10000.00')
  await expect(total).toContainText(/10/)
  await expect(page.getByTestId('dashboard-total-expenses')).toContainText('10.000,00')
})

test('CP-DAS-023 · «Gastado vs ingresos» muestra 6 meses con dos columnas por mes en una sola escala', async ({ page, request }) => {
  const s = await setup(page, request, 'das-023')
  for (const offset of [-2, -1, 0]) {
    await tx(s, { amount: `${(3 + offset) * 1000}.00`, on: offset === 0 ? ymd() : dateIn(offset, 5) })
    await tx(s, { category: null, type: 'income', amount: '20000.00', on: offset === 0 ? ymd() : dateIn(offset, 5) })
  }
  await page.goto(`/dashboard?period=${thisMonth()}`)
  const months = page.locator('[data-testid^="dashboard-flow-month-"]')
  await expect(months).toHaveCount(6)
  const read = () => months.evaluateAll((els) => els.map((el) => [el.getAttribute('data-expenses'), el.getAttribute('data-income')]))
  const current = await read()
  expect(current.slice(-3)).toEqual([['1000.00', '20000.00'], ['2000.00', '20000.00'], ['3000.00', '20000.00']])
  await page.getByTestId('dashboard-period-prev').click()
  await expect(page).toHaveURL(new RegExp(`period=${monthStart(-1).slice(0, 7)}`))
  await expect(months).toHaveCount(6)
  await expect.poll(async () => (await read()).slice(-2)).toEqual([['1000.00', '20000.00'], ['2000.00', '20000.00']])
})

test('CP-DAS-024 · «Ritmo del mes» termina en el total de lo gastado y se corta en hoy', async ({ page, request }) => {
  test.skip(day() < 3, 'Necesita que hoy sea el día 3 o después (un gasto de hace dos días en este mes)')
  const s = await setup(page, request, 'das-024')
  await tx(s, { amount: '1000.00', on: dateIn(0, day() - 2) })
  await tx(s, { category: 'Servicios', account: 'Tarjeta de crédito', amount: '9000.00', installments: 3, on: dateIn(-1, 10) })
  await page.goto(`/dashboard?period=${thisMonth()}`)
  await expect(page.getByTestId('dashboard-pace')).toBeVisible()
  await expect(page.getByTestId('dashboard-pace-current')).toHaveAttribute('data-total', '4000.00')
  await expect(page.getByTestId('dashboard-total-expenses')).toContainText('4.000,00')

  await page.goto(`/dashboard?period=${monthStart(1).slice(0, 7)}`)
  await expect(page.getByTestId('dashboard-total')).toBeVisible()
  // En un mes futuro solo queda la línea del mes anterior: la del mes no tiene nada que dibujar.
  await expect(page.getByTestId('dashboard-pace-current')).toHaveAttribute('data-total', '0.00')
})

test('CP-DAS-025 · «Cuotas que vienen» suma solo imputaciones de gastos no eliminados ya existentes', async ({ page, request }) => {
  const s = await setup(page, request, 'das-025')
  await tx(s, { category: 'Servicios', account: 'Tarjeta de crédito', amount: '30000.00', installments: 3 })
  const deleted = await tx(s, { category: 'Salud', account: 'Tarjeta de crédito', amount: '60000.00', installments: 3 })
  expect((await s.api.rpc('delete_transaction', { p_transaction_id: deleted })).status).toBeLessThan(300)
  await sub(s, { name: 'Netflix', amount: '5000.00', day: 28, category: 'Entretenimiento' })
  await page.goto(`/dashboard?period=${thisMonth()}`)
  const upcoming = page.getByTestId('dashboard-upcoming')
  await expect(upcoming).toBeVisible()
  await expect(page.getByTestId('dashboard-upcoming-total')).toHaveAttribute('data-amount', '20000.00')
  const months = page.locator('[data-testid^="dashboard-upcoming-month-"]')
  expect(await months.evaluateAll((els) => els.map((el) => el.getAttribute('data-amount')).filter((a) => Number(a) > 0))).toEqual(['10000.00', '10000.00'])
  await expect(upcoming).not.toContainText('Netflix')
})

test('CP-DAS-026 · si falla la lectura de las tendencias, el resto del Resumen sigue visible', async ({ page, request }) => {
  const s = await setup(page, request, 'das-026')
  await tx(s, { amount: '1000.00' })
  await page.route(
    (url) => url.pathname.endsWith('/ledger_entries') && decodeURIComponent(url.search).includes('inner(type,occurred_on,deleted_at)'),
    (route) => route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ message: 'falla simulada' }) }),
  )
  await page.goto(`/dashboard?period=${thisMonth()}`)
  await expect(page.getByTestId('dashboard-total-expenses')).toContainText('1.000,00')
  await expect(page.getByTestId('dashboard-category-chart')).toBeVisible()
  await expect(page.getByTestId('dashboard-trends-loading')).toHaveCount(0)
  await expect(page.getByTestId('dashboard-flow')).toHaveCount(0)
  await expect(page.getByTestId('dashboard-pace')).toHaveCount(0)
  await expect(page.getByTestId('dashboard-upcoming')).toHaveCount(0)
  await expect(page.getByTestId('dashboard-error')).toHaveCount(0)
})

// ------------------------------------------------------------------ US-104

test('CP-SUS-057 · lo cobrado más lo que falta es el total de la tarjeta', async ({ page, request }) => {
  test.skip(day() > 27, 'Necesita que hoy sea el día 27 o antes (día de cobro 28)')
  const s = await setup(page, request, 'sus-057')
  await sub(s, { name: 'Netflix', amount: '5000.00', day: 1, category: 'Entretenimiento' })
  await sub(s, { name: 'Gimnasio', amount: '8000.00', day: 28, category: 'Salud' })
  await page.goto('/subscriptions')
  await expect(page.getByTestId('subscriptions-committed-total')).toContainText('13.000,00')
  await expect(page.getByTestId('subscriptions-schedule-charged-amount')).toHaveAttribute('data-amount', '5000.00')
  await expect(page.getByTestId('subscriptions-schedule-pending-amount')).toHaveAttribute('data-amount', '8000.00')
})

test('CP-SUS-058 · un día de cobro anterior a hoy figura como cobrado y uno posterior, como falta', async ({ page, request }) => {
  test.skip(day() > 27, 'Necesita hoy y mañana dentro de los días de cobro 1 a 28')
  const s = await setup(page, request, 'sus-058')
  await sub(s, { name: 'Hoy', amount: '2000.00', day: day(), category: 'Servicios' })
  await sub(s, { name: 'Mañana', amount: '3000.00', day: day() + 1, category: 'Salud' })
  await page.goto('/subscriptions')
  await expect(page.getByTestId('subscriptions-schedule-charged-amount')).toHaveAttribute('data-amount', '2000.00')
  await expect(page.getByTestId('subscriptions-schedule-pending-amount')).toHaveAttribute('data-amount', '3000.00')
  const detail = page.getByTestId('subscriptions-schedule-detail')
  await page.getByTestId(`subscriptions-schedule-day-${day() + 1}`).click()
  await expect(detail).toContainText('Mañana')
  await expect(detail).toContainText('3.000,00')
  await expect(detail).not.toContainText('Cobrado')
  await page.getByTestId(`subscriptions-schedule-day-${day()}`).click()
  await expect(detail).toContainText('Cobrado')

  // Un toque en un lugar vacío de la tira elige el día con cobros más cercano.
  const strip = (await page.getByTestId('subscriptions-schedule-strip').boundingBox())!
  await page.mouse.click(strip.x + strip.width - 4, strip.y + strip.height / 2)
  await expect(detail).toContainText(/Hoy|Mañana/)
})

test('CP-SUS-059 · «Por categoría» ordena de mayor a menor y los porcentajes salen del total en pesos', async ({ page, request }) => {
  const s = await setup(page, request, 'sus-059')
  await sub(s, { name: 'Spotify', amount: '6000.00', day: 10, category: 'Entretenimiento' })
  await sub(s, { name: 'Luz', amount: '3000.00', day: 10, category: 'Servicios' })
  await sub(s, { name: 'Curso', amount: '1000.00', day: 10, category: 'Educación' })
  await page.goto('/subscriptions')
  const rows = page.getByTestId('subscriptions-by-category-list').locator('[role="listitem"]')
  await expect(rows).toHaveCount(3)
  const texts = await rows.allInnerTexts()
  expect(texts[0]).toContain('Entretenimiento')
  expect(texts[0]).toContain('60,0 %')
  expect(texts[1]).toContain('Servicios')
  expect(texts[1]).toContain('30,0 %')
  expect(texts[2]).toContain('Educación')
  expect(texts[2]).toContain('10,0 %')
  await expect(page.getByTestId('subscriptions-by-category-table').locator('tbody tr')).toHaveCount(3)
})

test('CP-SUS-060 · una suscripción en US$ sin tipo de cambio del mes se avisa y no entra a la barra', async ({ page, request }) => {
  const s = await setup(page, request, 'sus-060')
  await sub(s, { name: 'ChatGPT', amount: '10.00', day: 10, category: 'Servicios', currency: 'USD' })
  await sub(s, { name: 'Gimnasio', amount: '4000.00', day: 10, category: 'Salud' })
  await page.goto('/subscriptions')
  await expect(page.getByTestId('subscriptions-schedule-usd-pending')).toBeVisible()
  await expect(page.getByTestId('subscriptions-by-category')).toContainText(/sin tipo de cambio/i)
  const rows = page.getByTestId('subscriptions-by-category-list').locator('[role="listitem"]')
  await expect(rows.first()).toContainText('Salud')
  await expect(rows.first()).toContainText('100,0 %')
  await expect(page.getByTestId('subscriptions-committed-total')).toContainText('4.000,00')

  expect((await s.api.rpc('upsert_fx_rate', { p_period: monthStart(0), p_ars_per_usd: '1000.00' })).status).toBeLessThan(300)
  await page.reload()
  await expect(page.getByTestId('subscriptions-schedule-usd-pending')).toHaveCount(0)
  await expect(page.getByTestId('subscriptions-committed-total')).toContainText('14.000,00')
})

test('CP-SUS-061 · sin suscripciones activas en el mes no se dibuja ninguno de los dos gráficos', async ({ page, request }) => {
  const s = await setup(page, request, 'sus-061')
  await page.goto('/subscriptions')
  await expect(page.getByTestId('subscriptions-empty')).toBeVisible()
  await expect(page.getByTestId('subscriptions-schedule')).toHaveCount(0)
  await expect(page.getByTestId('subscriptions-by-category')).toHaveCount(0)
  await sub(s, { name: 'Netflix', amount: '5000.00', day: 10, category: 'Entretenimiento' })
  await page.reload()
  await expect(page.getByTestId('subscriptions-schedule')).toBeVisible()
  await expect(page.getByTestId('subscriptions-by-category')).toBeVisible()
})
