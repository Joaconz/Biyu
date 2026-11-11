/// <reference lib="dom" />
// (page.evaluate corre en el navegador: necesita los tipos del DOM)
import { expect, test, type APIRequestContext, type Page } from '@playwright/test'
import { apiSession, signUpAndSkipSetup } from './support/app.ts'
import { e2eTarget } from './support/env.ts'

// Casos de las historias de UX de V3 sobre la navegación y el formulario de Registrar:
// US-92 (CP-NAV-026 a 029, 031, 032; el 030 es e2e/nav-shield.spec.ts), US-97 (CP-NAV-033 a 036) y US-98 (CP-REG-050 a 052).
// El proyecto local corre a 390 px: los casos de escritorio cambian el viewport.

const ymd = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date())
const nav = (page: Page) => page.getByRole('navigation', { name: 'Principal' })

async function seedExpense(page: Page, request: APIRequestContext, tag: string, extra: { amount?: string; on?: string } = {}) {
  const { email } = await signUpAndSkipSetup(page, tag)
  const api = await apiSession(request, email)
  const id = async (table: 'categories' | 'accounts', name: string) =>
    ((await api.select(table, `select=id&name=eq.${encodeURIComponent(name)}`)).body as { id: string }[])[0].id
  const res = await api.rpc('create_transaction', {
    p_type: 'expense', p_amount: extra.amount ?? '1000.00', p_currency: 'ARS', p_fx_rate: null,
    p_category_id: await id('categories', 'Otros'), p_account_id: await id('accounts', 'Efectivo'),
    p_installments_count: 1, p_occurred_on: extra.on ?? ymd(), p_description: null, p_request_id: null,
  })
  expect(res.status).toBe(200)
  return { api, email }
}

/** Posición del indicador activo: translateX(índice × 100%). */
const indicatorIndex = (page: Page) =>
  page.getByTestId('app-nav-indicator').evaluate((el) => {
    const m = /translateX\(([\d.]+)%\)/.exec((el as HTMLElement).style.transform)
    return m ? Number(m[1]) / 100 : null
  })

/** Lleva el foco al primer ítem de la barra y recorre los siguientes con Tab: los nombres en orden de tabulación. */
async function tabOrder(page: Page, count: number) {
  await nav(page).getByRole('link').first().focus()
  const names: string[] = []
  for (let i = 0; i < count; i++) {
    names.push(await page.evaluate(() => (document.activeElement?.textContent ?? '').trim()))
    await page.keyboard.press('Tab')
  }
  return names
}

test('CP-NAV-026 · a 390 px la barra tiene cinco destinos en orden y el encabezado no tiene engranaje', async ({ page, request }) => {
  await seedExpense(page, request, 'nav-026')
  await page.goto('/register')
  const names = await nav(page).getByRole('link').allInnerTexts()
  expect(names.map((n) => n.trim())).toEqual(['Resumen', 'Deudas', 'Registrar', 'Suscripciones', 'Ajustes'])
  await expect(page.locator('header').getByRole('link', { name: /ajustes/i })).toHaveCount(0)
  await nav(page).getByRole('link', { name: 'Ajustes' }).click()
  await expect(page).toHaveURL(/\/settings$/)
})

test('CP-NAV-027 · el indicador se desliza bajo el ítem activo y una ruta inexistente no muestra la barra', async ({ page, request }) => {
  await seedExpense(page, request, 'nav-027')
  await page.goto('/dashboard')
  await expect(page.getByTestId('app-nav-indicator')).toBeAttached()
  expect(await indicatorIndex(page)).toBe(0)
  await nav(page).getByRole('link', { name: 'Suscripciones' }).click()
  await expect(page).toHaveURL(/\/subscriptions/)
  await expect.poll(() => indicatorIndex(page)).toBe(3)
  await nav(page).getByRole('link', { name: 'Deudas' }).click()
  await expect.poll(() => indicatorIndex(page)).toBe(1)

  await page.goto('/transactions')
  await expect.poll(() => indicatorIndex(page)).toBe(0)
  // Una ruta que no existe no muestra la barra: no hay pantalla sin ítem con barra.
  await page.goto('/ruta-que-no-existe')
  await expect(page.getByText('Esta página no existe')).toBeVisible()
  await expect(nav(page)).toHaveCount(0)
  await expect(page.getByTestId('app-nav-indicator')).toHaveCount(0)
})

test('CP-NAV-028 · Movimientos se abre desde el Resumen y la barra sigue marcando Resumen', async ({ page, request }) => {
  const [y, m] = ymd().split('-').map(Number)
  const previous = new Date(Date.UTC(y, m - 2, 1))
  const period = `${previous.getUTCFullYear()}-${String(previous.getUTCMonth() + 1).padStart(2, '0')}`
  await seedExpense(page, request, 'nav-028', { on: `${period}-05` })
  await page.goto(`/dashboard?period=${period}`)
  await page.getByTestId('dashboard-action-transactions').click()
  await expect(page).toHaveURL(new RegExp(`/transactions\\?period=${period}`))
  await expect(nav(page).getByRole('link', { name: 'Resumen' })).toHaveAttribute('aria-current', 'page')
  await nav(page).getByRole('link', { name: 'Resumen' }).click()
  await expect(page).toHaveURL(new RegExp(`/dashboard\\?period=${period}`))
})

test('CP-NAV-029 · a 1023 px hay píldora y a 1024 px barra lateral con Ajustes al pie, sin data-testid repetidos', async ({ page, request }) => {
  await seedExpense(page, request, 'nav-029')
  await page.setViewportSize({ width: 1023, height: 800 })
  await page.goto('/dashboard')
  await expect(page.getByTestId('app-nav-shield')).toBeVisible()
  expect(await nav(page).getByRole('link').allInnerTexts().then((t) => t.map((x) => x.trim()))).toEqual([
    'Resumen', 'Deudas', 'Registrar', 'Suscripciones', 'Ajustes',
  ])

  await page.setViewportSize({ width: 1024, height: 800 })
  await expect(page.getByTestId('app-nav-shield')).toHaveCount(0)
  const links = (await nav(page).getByRole('link').allInnerTexts()).map((t) => t.trim())
  expect(links.at(-1)).toBe('Ajustes')
  expect(links.slice(0, 4)).toEqual(['Registrar', 'Resumen', 'Deudas', 'Suscripciones'])
  const duplicated = await nav(page).evaluate((el) => {
    const seen = new Set<string>()
    const dup: string[] = []
    for (const n of el.querySelectorAll('[data-testid]')) {
      const id = n.getAttribute('data-testid') ?? ''
      if (seen.has(id)) dup.push(id)
      seen.add(id)
    }
    return dup
  })
  expect(duplicated).toEqual([])
})

test('CP-NAV-031 · en una ruta hija de Ajustes la barra marca Ajustes', async ({ page, request }) => {
  await seedExpense(page, request, 'nav-031')
  await page.goto('/settings')
  await page.getByTestId('settings-nav-categories').click()
  await expect(page).toHaveURL(/\/settings\/categories(\?|$)/)
  await expect(nav(page).getByRole('link', { name: 'Ajustes' })).toHaveAttribute('aria-current', 'page')
  await expect.poll(() => indicatorIndex(page)).toBe(4)
})

test('CP-NAV-032 · el orden de tabulación de la barra coincide con el orden visual', async ({ page, request }) => {
  await seedExpense(page, request, 'nav-032')
  await page.goto('/dashboard')
  expect(await tabOrder(page, 5)).toEqual(['Resumen', 'Deudas', 'Registrar', 'Suscripciones', 'Ajustes'])
  await page.setViewportSize({ width: 1024, height: 800 })
  await page.goto('/dashboard')
  expect(await tabOrder(page, 5)).toEqual(['Registrar', 'Resumen', 'Deudas', 'Suscripciones', 'Ajustes'])
})

test('CP-NAV-033 · el Resumen, Movimientos, Deudas y Suscripciones muestran un esqueleto y después el contenido', async ({ page, request }) => {
  await seedExpense(page, request, 'nav-033')
  await page.route('**/rest/v1/**', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1200))
    await route.continue()
  })
  const screens: { path: string; skeleton: string; content: string }[] = [
    { path: '/dashboard', skeleton: 'dashboard-loading', content: 'dashboard-total-expenses' },
    { path: '/transactions', skeleton: 'transactions-loading', content: 'transactions-item' },
    { path: '/debts', skeleton: 'debts-loading', content: 'debts-new' },
    { path: '/subscriptions', skeleton: 'subscriptions-loading', content: 'subscriptions-new' },
  ]
  for (const { path, skeleton, content } of screens) {
    await page.goto(path)
    const loading = page.getByTestId(skeleton)
    await expect(loading, `${path}: esqueleto`).toBeVisible()
    await expect(loading.locator('.sr-only')).not.toHaveText('')
    await expect(page.getByText('Cargando…', { exact: true }).filter({ hasNot: page.locator('.sr-only') })).toHaveCount(0)
    await expect(page.getByTestId(content).first(), `${path}: contenido`).toBeVisible({ timeout: 15_000 })
    await expect(loading).toHaveCount(0)
  }
})

/** Registra cada cambio de `data-nav` del <html> (lo que decide la transición, ADR-049). */
async function watchNavKinds(page: Page) {
  await page.evaluate(() => {
    const w = window as unknown as { __kinds: string[] }
    w.__kinds = []
    new MutationObserver(() => {
      const kind = document.documentElement.dataset.nav
      if (kind) w.__kinds.push(kind)
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-nav'] })
  })
}
const navKinds = (page: Page) => page.evaluate(() => (window as unknown as { __kinds: string[] }).__kinds)

test('CP-NAV-034 · cambiar de mes o de filtro no dispara transición', async ({ page, request }) => {
  await seedExpense(page, request, 'nav-034')
  await page.goto('/dashboard')
  await expect(page.getByTestId('dashboard-total-expenses')).toBeVisible()
  await watchNavKinds(page)
  await page.getByTestId('dashboard-period-prev').click()
  await expect(page).toHaveURL(/period=/)
  await page.goto('/transactions')
  await watchNavKinds(page)
  await page.getByTestId('transactions-filter-deleted').click()
  await page.getByTestId('transactions-filter-active').click()
  expect(await navKinds(page)).toEqual([])
})

test('CP-NAV-035 · cambiar de pestaña funde y entrar a un detalle o volver desplaza y funde', async ({ page, request }) => {
  const s = await seedExpense(page, request, 'nav-035')
  const cat = ((await s.api.select('categories', 'select=id&name=eq.Servicios')).body as { id: string }[])[0].id
  const acc = ((await s.api.select('accounts', 'select=id&name=eq.Efectivo')).body as { id: string }[])[0].id
  const day = Math.min(28, Number(ymd().slice(8, 10)))
  expect((await s.api.rpc('create_subscription', {
    p_name: 'Netflix', p_amount: '5000.00', p_currency: 'ARS', p_category_id: cat, p_account_id: acc,
    p_billing_day: day, p_start_period: `${ymd().slice(0, 7)}-01`, p_end_period: null, p_description: null,
  })).status).toBe(200)

  await page.goto('/subscriptions')
  await expect(page.getByTestId('subscriptions-item').first()).toBeVisible()
  await watchNavKinds(page)
  await page.getByTestId('subscriptions-item').first().click()
  await expect(page).toHaveURL(/\/subscriptions\/[0-9a-f-]+$/)
  await page.getByRole('link', { name: /volver|atrás/i }).first().click().catch(() => page.goBack())
  await nav(page).getByRole('link', { name: 'Deudas' }).click()
  await expect(page).toHaveURL(/\/debts/)
  const kinds = await navKinds(page)
  expect(kinds[0]).toBe('forward')
  expect(kinds).toContain('tab')
})

test('CP-NAV-036 · con movimiento reducido no hay desplazamiento ni pulso, solo fundido', async ({ page, request }) => {
  await seedExpense(page, request, 'nav-036')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/dashboard')
  const indicator = page.getByTestId('app-nav-indicator')
  const transitionProperty = await indicator.evaluate((el) => getComputedStyle(el).transitionProperty)
  expect(transitionProperty).not.toContain('transform')
  expect(transitionProperty).not.toBe('all')

  await page.route('**/rest/v1/**', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    await route.continue()
  })
  await page.goto('/transactions')
  const pulse = page.getByTestId('transactions-loading').locator('.animate-pulse').first()
  await expect(pulse).toBeVisible()
  expect(await pulse.evaluate((el) => getComputedStyle(el).animationDuration)).toBe('0.001s')
})

// ------------------------------------------------------------------ US-98

test('CP-REG-050 · las ocho categorías sembradas se leen completas, sin cortar palabras', async ({ page, request }) => {
  await seedExpense(page, request, 'reg-050')
  await page.goto('/register')
  await page.getByTestId('transaction-form-amount').fill('1000')
  await page.getByTestId('transaction-form-next').click()
  const names = ['Comida y supermercado', 'Transporte', 'Servicios', 'Entretenimiento', 'Salud', 'Educación', 'Indumentaria', 'Otros']
  const group = page.getByTestId('transaction-form-category')
  await expect(group.getByRole('radio').or(group.locator('button'))).toHaveCount(8)
  const report = await group.evaluate((el, expected) => {
    const buttons = [...el.querySelectorAll('button')]
    const columns = new Set(buttons.map((b) => Math.round(b.getBoundingClientRect().left))).size
    const cut = buttons
      .map((b) => b.querySelector('span:last-child') as HTMLElement)
      .map((span) => ({ text: span.innerText.trim(), overflow: span.scrollWidth > span.clientWidth + 1 }))
    const unknown = cut.filter((r) => !expected.includes(r.text) || r.overflow)
    return { columns, unknown, texts: cut.map((r) => r.text).sort() }
  }, names)
  expect(report.columns).toBe(4)
  expect(report.unknown).toEqual([])
  expect(report.texts).toEqual([...names].sort())
})

test('CP-REG-051 · un nombre largo ocupa como máximo dos líneas y la grilla no se desalinea', async ({ page, request }) => {
  const s = await seedExpense(page, request, 'reg-051')
  const long = 'Entretenimiento y espectáculos al aire libre'
  const target = e2eTarget()
  const res = await request.post(`${target.supabaseUrl}/rest/v1/categories`, {
    headers: { apikey: target.anonKey!, Authorization: `Bearer ${s.api.token}`, 'Content-Type': 'application/json' },
    data: { name: long, color: '#888888' },
  })
  expect(res.status()).toBe(201)
  await page.goto('/register')
  await page.getByTestId('transaction-form-amount').fill('1000')
  await page.getByTestId('transaction-form-next').click()
  const tile = page.getByTestId('transaction-form-category-chip-entretenimiento-y-espectaculos-al-aire-libre')
  await expect(tile).toBeVisible()
  const lines = await tile.evaluate((el) => {
    const span = el.querySelector('span:last-child') as HTMLElement
    const style = getComputedStyle(span)
    const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2
    return Math.round(span.getBoundingClientRect().height / lineHeight)
  })
  expect(lines).toBeLessThanOrEqual(2)
  const columns = await page
    .getByTestId('transaction-form-category')
    .locator('button')
    .evaluateAll((els) => new Set(els.map((el) => Math.round(el.getBoundingClientRect().left))).size)
  expect(columns).toBe(4)
})

test('CP-REG-052 · los chips de cuenta miden al menos 48 px de alto', async ({ page, request }) => {
  await seedExpense(page, request, 'reg-052')
  await page.goto('/register')
  await page.getByTestId('transaction-form-amount').fill('1000')
  await page.getByTestId('transaction-form-next').click()
  await page.getByTestId('transaction-form-category-chip-otros').click()
  const chips = page.getByTestId('transaction-form-account').locator('button')
  await expect(chips).toHaveCount(5)
  for (const box of await chips.evaluateAll((els) => els.map((el) => el.getBoundingClientRect().height))) {
    expect(box).toBeGreaterThanOrEqual(47.5)
  }
})
