/// <reference lib="dom" />
// (page.evaluate corre en el navegador: necesita los tipos del DOM)
import { expect, test, type APIRequestContext, type Page } from '@playwright/test'
import { apiSession, signUpAndSkipSetup, TEST_PASSWORD } from './support/app.ts'
import { e2eTarget } from './support/env.ts'

// Casos de las historias de UX de V3 sobre Ajustes: US-93 (CP-CFG-027 a 030), US-102 (CP-CFG-031 a 033),
// US-105 (CP-CFG-035 a 039) y US-94 (CP-REG-047 a 049). CP-CFG-034 es el contraste de los dos temas.

const ymd = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date())

async function setup(page: Page, request: APIRequestContext, tag: string) {
  const { email } = await signUpAndSkipSetup(page, tag)
  const api = await apiSession(request, email)
  const id = async (table: 'categories' | 'accounts', name: string) =>
    ((await api.select(table, `select=id&name=eq.${encodeURIComponent(name)}`)).body as { id: string }[])[0].id
  return { email, api, id }
}
type S = Awaited<ReturnType<typeof setup>>

const expense = async (s: S, over: Record<string, unknown> = {}) =>
  s.api.rpc('create_transaction', {
    p_type: 'expense', p_amount: '12500.00', p_currency: 'ARS', p_fx_rate: null, p_category_id: await s.id('categories', 'Comida y supermercado'),
    p_account_id: await s.id('accounts', 'Efectivo'), p_installments_count: 1, p_occurred_on: ymd(), p_description: null, p_request_id: null, ...over,
  })

const nav = (page: Page) => page.getByRole('navigation', { name: 'Principal' })
const html = (page: Page) => page.locator('html')

// ------------------------------------------------------------------ US-93

test('CP-CFG-027 · las tarjetas de Ajustes están en el orden indicado y «Cerrar sesión» es la última, aparte', async ({ page, request }) => {
  await setup(page, request, 'cfg-027')
  await page.goto('/settings')
  const order = ['settings-theme', 'settings-nav-categories', 'settings-accounts-edit-efectivo', 'settings-fx-form', 'settings-summary', 'settings-nav-setup', 'settings-nav-logout']
  const ys: number[] = []
  for (const id of order) {
    const box = await page.getByTestId(id).first().evaluate((el) => el.getBoundingClientRect().top + window.scrollY)
    ys.push(box)
  }
  expect(ys, 'orden de las tarjetas').toEqual([...ys].sort((a, b) => a - b))
  // «Cerrar sesión» no comparte tarjeta con «Volver a hacer la configuración inicial».
  const sameCard = await page.getByTestId('settings-nav-logout').evaluate((logout) => {
    const setupLink = document.querySelector('[data-testid="settings-nav-setup"]')!
    return logout.parentElement === setupLink.parentElement
  })
  expect(sameCard).toBe(false)
})

test('CP-CFG-028 · «Categorías» abre su pantalla, la barra sigue marcando Ajustes y se vuelve con atrás', async ({ page, request }) => {
  await setup(page, request, 'cfg-028')
  await page.goto('/settings')
  await page.getByTestId('settings-nav-categories').click()
  await expect(page).toHaveURL(/\/settings\/categories/)
  await expect(page.getByTestId('settings-categories-list')).toContainText('Transporte')
  await expect(nav(page).getByRole('link', { name: 'Ajustes' })).toHaveAttribute('aria-current', 'page')
  await page.getByTestId('settings-categories-back').click()
  await expect(page).toHaveURL(/\/settings$/)
})

test('CP-CFG-029 · todo elemento interactivo de Ajustes tiene un data-testid propio y sin repetir', async ({ page, request }) => {
  await setup(page, request, 'cfg-029')
  await page.goto('/settings')
  await expect(page.getByTestId('settings-nav-logout')).toBeVisible()
  const audit = await page.locator('main').evaluate((root) => {
    const interactive = [...root.querySelectorAll('a,button,input,select,textarea,[role=switch],[role=radio]')].filter((el) => {
      const r = el.getBoundingClientRect()
      return r.width > 1 && r.height > 1
    })
    const missing = interactive.filter((el) => !el.closest('[data-testid]') && !el.getAttribute('data-testid')).map((el) => el.outerHTML.slice(0, 80))
    const ids = [...root.querySelectorAll('[data-testid]')].map((el) => el.getAttribute('data-testid'))
    return { missing, duplicated: ids.filter((id, i) => ids.indexOf(id) !== i) }
  })
  expect(audit.missing).toEqual([])
  expect(audit.duplicated).toEqual([])
})

test('CP-CFG-030 · «Volver a hacer la configuración inicial» abre /setup', async ({ page, request }) => {
  await setup(page, request, 'cfg-030')
  await page.goto('/settings')
  await page.getByTestId('settings-nav-setup').click()
  await expect(page).toHaveURL(/\/setup$/)
  await expect(page.getByTestId('setup-reason-skip')).toBeVisible()
  for (const step of ['reason', 'categories', 'accounts', 'expense']) await page.getByTestId(`setup-${step}-skip`).click()
  await expect(page).toHaveURL(/\/register$/)
})

// ------------------------------------------------------------------ US-102

test('CP-CFG-031 · elegir «Oscuro» cambia el tema al instante y queda al recargar', async ({ page, request }) => {
  await setup(page, request, 'cfg-031')
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/settings')
  await expect(html(page)).not.toHaveClass(/dark/)
  await page.getByTestId('settings-theme-dark').click()
  await expect(html(page)).toHaveClass(/dark/)
  await page.reload()
  await expect(html(page)).toHaveClass(/dark/)
  expect(await page.evaluate(() => localStorage.getItem('biyu-theme'))).toBe('dark')
})

test('CP-CFG-032 · «Automático» sigue al tema del sistema', async ({ page, request }) => {
  await setup(page, request, 'cfg-032')
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/settings')
  await page.getByTestId('settings-theme-system').click()
  await expect(html(page)).not.toHaveClass(/dark/)
  await page.emulateMedia({ colorScheme: 'dark' })
  await expect(html(page)).toHaveClass(/dark/)
  await page.getByTestId('settings-theme-light').click()
  await expect(html(page)).not.toHaveClass(/dark/)
  await page.emulateMedia({ colorScheme: 'light' })
  await page.emulateMedia({ colorScheme: 'dark' })
  await expect(html(page)).not.toHaveClass(/dark/)
})

test('CP-CFG-033 · la elección no se guarda en la base y otro dispositivo conserva la suya', async ({ page, request, browser }) => {
  const s = await setup(page, request, 'cfg-033')
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/settings')
  const writes: string[] = []
  page.on('request', (r) => {
    if (r.url().includes('/rest/v1/') && ['POST', 'PATCH', 'PUT', 'DELETE'].includes(r.method())) writes.push(`${r.method()} ${r.url()}`)
  })
  await page.getByTestId('settings-theme-dark').click()
  await expect(html(page)).toHaveClass(/dark/)
  await page.waitForTimeout(500)
  expect(writes).toEqual([])

  const other = await browser.newContext({ colorScheme: 'light' })
  const second = await other.newPage()
  await second.goto('/login')
  await second.getByTestId('login-form-email').fill(s.email)
  await second.getByTestId('login-form-password').fill(TEST_PASSWORD)
  await second.getByTestId('login-form-submit').click()
  await expect(second.getByTestId('transaction-form')).toBeVisible({ timeout: 20_000 })
  await expect(second.locator('html')).not.toHaveClass(/dark/)
  await other.close()

  const prefs = await s.api.select('user_preferences', 'select=*')
  expect(prefs.status).toBe(200)
  for (const row of prefs.body as Record<string, unknown>[]) expect(Object.keys(row).filter((k) => /theme|tema/i.test(k))).toEqual([])
})

// ------------------------------------------------------------------ US-105

async function openCategories(page: Page) {
  await page.goto('/settings')
  await page.getByTestId('settings-nav-categories').click()
  await expect(page).toHaveURL(/\/settings\/categories/)
}

test('CP-CFG-035 · crear una categoría con nombre, ícono y color la muestra en la lista con esa baldosa', async ({ page, request }) => {
  await setup(page, request, 'cfg-035')
  await openCategories(page)
  await page.getByTestId('settings-categories-new').click()
  await expect(page.getByTestId('settings-categories-sheet')).toBeVisible()
  await page.getByTestId('settings-categories-name').fill('Mascotas')
  await page.getByTestId('settings-categories-icon-paw-print').click()
  await page.getByTestId('settings-categories-color').getByRole('radio').nth(2).click()
  await expect(page.getByTestId('settings-categories-preview').locator('[data-icon]')).toHaveAttribute('data-icon', 'paw-print')
  await page.getByTestId('settings-categories-submit').click()
  await expect(page.getByTestId('settings-categories-sheet')).toHaveCount(0)
  await expect(page.getByTestId('settings-categories-edit-mascotas').locator('[data-icon]')).toHaveAttribute('data-icon', 'paw-print')

  await page.goto('/register')
  await page.getByTestId('transaction-form-amount').fill('1000')
  await page.getByTestId('transaction-form-next').click()
  await expect(page.getByTestId('transaction-form-category-chip-mascotas').locator('[data-icon]')).toHaveAttribute('data-icon', 'paw-print')
})

test('CP-CFG-036 · editar una categoría sembrada preselecciona su ícono y al guardar queda escrito', async ({ page, request }) => {
  const s = await setup(page, request, 'cfg-036')
  await openCategories(page)
  await page.getByTestId('settings-categories-edit-transporte').click()
  await expect(page.getByTestId('settings-categories-edit-icon-bus')).toHaveAttribute('aria-checked', 'true')
  await page.getByTestId('settings-categories-edit-name').fill('Movilidad')
  await page.getByTestId('settings-categories-save').click()
  await expect(page.getByTestId('settings-categories-sheet')).toHaveCount(0)
  await expect(page.getByTestId('settings-categories-edit-movilidad').locator('[data-icon]')).toHaveAttribute('data-icon', 'bus')
  const rows = (await s.api.select('categories', 'select=name,icon&name=eq.Movilidad')).body as { name: string; icon: string | null }[]
  expect(rows).toEqual([{ name: 'Movilidad', icon: 'bus' }])
})

test('CP-CFG-037 · archivar, reactivar y eliminar desde la hoja, con confirmación al eliminar', async ({ page, request }) => {
  await setup(page, request, 'cfg-037')
  await openCategories(page)
  await page.getByTestId('settings-categories-new').click()
  await page.getByTestId('settings-categories-name').fill('Mascotas')
  await page.getByTestId('settings-categories-submit').click()
  await expect(page.getByTestId('settings-categories-edit-mascotas')).toBeVisible()

  await page.getByTestId('settings-categories-edit-mascotas').click()
  await page.getByTestId('settings-categories-archive-mascotas').click()
  await expect(page.getByTestId('settings-categories-edit-mascotas')).toHaveCount(0)
  await page.getByTestId('settings-categories-archived-toggle').click()
  await page.getByTestId('settings-categories-unarchive-mascotas').click()
  await expect(page.getByTestId('settings-categories-edit-mascotas')).toBeVisible()

  await page.getByTestId('settings-categories-edit-mascotas').click()
  await page.getByTestId('settings-categories-delete-mascotas').click()
  await expect(page.getByTestId('settings-categories-delete-dialog')).toBeVisible()
  await expect(page.getByTestId('settings-categories-delete-impact').first()).toContainText('nombre queda libre')
  await page.getByTestId('settings-categories-delete-dialog-confirm').click()
  await expect(page.getByTestId('settings-categories-deleted')).toContainText('Categoría eliminada')
  await expect(page.getByTestId('settings-categories-edit-mascotas')).toHaveCount(0)
})

test('CP-CFG-038 · Postgres rechaza una clave de ícono con mayúsculas o de más de 40 caracteres', async ({ page, request }) => {
  const s = await setup(page, request, 'cfg-038')
  const own = await s.id('categories', 'Otros')
  const patch = (icon: string) => s.api.patch('categories', `id=eq.${own}`, { icon })
  const upper = await patch('Paw-Print')
  expect(upper.status).toBe(400)
  expect(upper.body).toMatchObject({ code: '23514' })
  const long = await patch('a'.repeat(41))
  expect(long.status).toBe(400)
  expect(long.body).toMatchObject({ code: '23514' })
  expect((await patch('paw-print')).status).toBe(200)
  expect((await patch('a'.repeat(40))).status).toBe(200)
})

test('CP-CFG-039 · otro usuario no ve ni modifica las categorías ajenas', async ({ page, request, browser }) => {
  const a = await setup(page, request, 'cfg-039-a')
  const other = await browser.newContext()
  const b = await setup(await other.newPage(), request, 'cfg-039-b')
  const crossed = await b.api.select('categories', `select=id&user_id=eq.${a.api.userId}`)
  expect(crossed.body).toEqual([])
  const foreign = await a.id('categories', 'Otros')
  const changed = await b.api.patch('categories', `id=eq.${foreign}`, { icon: 'bus' })
  expect(changed.status).toBe(200)
  expect(changed.body).toEqual([])
  const anon = await a.api.patch('categories', `id=eq.${foreign}`, { icon: 'bus' }, { asAnon: true })
  expect(anon.status).toBe(401)
  expect(anon.body).toMatchObject({ code: '42501' })
  expect(((await a.api.select('categories', `select=icon&id=eq.${foreign}`)).body as { icon: string | null }[])[0].icon).not.toBe('bus')
  await other.close()
})

// ------------------------------------------------------------------ US-94

test('CP-REG-047 · el diálogo de un movimiento dice «¿Eliminar movimiento?» y muestra su detalle', async ({ page, request }) => {
  const s = await setup(page, request, 'reg-047')
  expect((await expense(s)).status).toBe(200)
  await page.goto('/transactions')
  await page.getByTestId('transactions-item-edit').click()
  await page.getByTestId('edit-transaction-delete').click()
  await expect(page.getByTestId('delete-transaction-dialog').getByRole('heading')).toHaveText('¿Eliminar movimiento?')
  await expect(page.getByTestId('delete-transaction-dialog')).not.toContainText(/transacci[óo]n/i)
  const summary = page.getByTestId('delete-transaction-summary')
  await expect(summary).toContainText('$12.500,00')
  await expect(summary).toContainText('Comida y supermercado')
  await expect(summary).toContainText('Fecha')
  await page.getByTestId('delete-transaction-confirm').click()
  await expect(page.getByTestId('transaction-deleted')).toContainText('Movimiento eliminado')
})

test('CP-REG-048 · una compra en cuotas con deuda vinculada muestra las cuotas y la deuda en el detalle', async ({ page, request }) => {
  const s = await setup(page, request, 'reg-048')
  const res = await expense(s, {
    p_amount: '30000.00', p_account_id: await s.id('accounts', 'Tarjeta de crédito'), p_installments_count: 3,
    p_shared_persons: ['Sofía'], p_shared_amounts: ['10000.00'],
  })
  expect(res.status).toBe(200)
  await page.goto('/transactions')
  await page.getByTestId('transactions-item-edit').click()
  await page.getByTestId('edit-transaction-delete').click()
  const summary = page.getByTestId('delete-transaction-summary')
  await expect(summary).toContainText('$30.000,00')
  await expect(summary).toContainText(/3 cuotas/)
  await expect(page.getByTestId('delete-transaction-debt-warning')).toContainText('Sofía')
  await expect(page.getByTestId('delete-transaction-debt-warning')).toContainText('10.000,00')
  await page.getByTestId('delete-transaction-cancel').click()
  await expect(page.getByTestId('delete-transaction-dialog')).toHaveCount(0)
  expect((await s.api.select('transactions', 'select=id&deleted_at=is.null')).body).toHaveLength(1)
  expect((await s.api.select('debts', 'select=id')).body).toHaveLength(1)
})

/** Los dos botones del diálogo son distintos, el de confirmar es de peligro y hay aire entre ellos. */
async function expectDangerSeparated(page: Page, dialogId: string, confirmId: string, cancelId: string) {
  const dialog = page.getByTestId(dialogId)
  await expect(dialog).toBeVisible()
  const confirm = page.getByTestId(confirmId)
  const cancel = page.getByTestId(cancelId)
  expect(await confirm.evaluate((el) => el.className)).toMatch(/bg-destructive/)
  expect(await cancel.evaluate((el) => el.className)).not.toMatch(/bg-destructive/)
  const [c, k] = [await confirm.boundingBox(), await cancel.boundingBox()]
  const gap = Math.max(c!.x - (k!.x + k!.width), k!.x - (c!.x + c!.width), c!.y - (k!.y + k!.height), k!.y - (c!.y + c!.height))
  expect(gap).toBeGreaterThanOrEqual(8)
}

test('CP-REG-049 · el botón de confirmar tiene estilo de peligro, está separado de «Cancelar» y «Cancelar» no borra, en los cuatro diálogos', async ({ page, request }) => {
  const s = await setup(page, request, 'reg-049')
  expect((await expense(s)).status).toBe(200)
  expect((await s.api.rpc('create_debt', {
    p_direction: 'owed_to_me', p_person: 'Juan', p_amount: '500.00', p_currency: 'ARS', p_fx_rate: null, p_incurred_on: ymd(), p_notes: null,
  })).status).toBe(200)
  expect((await s.api.rpc('create_subscription', {
    p_name: 'Netflix', p_amount: '5000.00', p_currency: 'ARS', p_category_id: await s.id('categories', 'Servicios'), p_account_id: await s.id('accounts', 'Efectivo'),
    p_billing_day: 28, p_start_period: `${ymd().slice(0, 7)}-01`, p_end_period: null, p_description: null,
  })).status).toBe(200)
  const target = e2eTarget()
  const category = await request.post(`${target.supabaseUrl}/rest/v1/categories`, {
    headers: { apikey: target.anonKey!, Authorization: `Bearer ${s.api.token}`, 'Content-Type': 'application/json' },
    data: { name: 'Mascotas', color: '#888888' },
  })
  expect(category.status()).toBe(201)

  // Movimiento
  await page.goto('/transactions')
  await page.getByTestId('transactions-item-edit').click()
  await page.getByTestId('edit-transaction-delete').click()
  await expectDangerSeparated(page, 'delete-transaction-dialog', 'delete-transaction-confirm', 'delete-transaction-cancel')
  await page.getByTestId('delete-transaction-cancel').click()
  await expect(page.getByTestId('delete-transaction-dialog')).toHaveCount(0)

  // Deuda
  await page.goto('/debts')
  await page.getByTestId('debts-item-delete').click()
  await expectDangerSeparated(page, 'debts-delete-dialog', 'debts-delete-confirm', 'debts-delete-cancel')
  await page.keyboard.press('Escape')
  await expect(page.getByTestId('debts-delete-dialog')).toHaveCount(0)

  // Suscripción
  await page.goto('/subscriptions')
  await page.getByTestId('subscriptions-item').first().click()
  await page.getByTestId('subscription-detail-delete').click()
  await expectDangerSeparated(page, 'delete-subscription-dialog', 'delete-subscription-dialog-confirm', 'delete-subscription-dialog-cancel')
  await page.getByTestId('delete-subscription-dialog-cancel').click()
  await expect(page.getByTestId('delete-subscription-dialog')).toHaveCount(0)

  // Categoría
  await openCategories(page)
  await page.getByTestId('settings-categories-edit-mascotas').click()
  await page.getByTestId('settings-categories-delete-mascotas').click()
  await expectDangerSeparated(page, 'settings-categories-delete-dialog', 'settings-categories-delete-dialog-confirm', 'settings-categories-delete-dialog-cancel')
  await page.getByTestId('settings-categories-delete-dialog-cancel').click()
  await expect(page.getByTestId('settings-categories-delete-dialog')).toHaveCount(0)

  // Ninguno borró nada.
  expect((await s.api.select('transactions', 'select=id&deleted_at=is.null')).body).toHaveLength(1)
  expect(((await s.api.select('debts', 'select=id')) as { body: unknown[] }).body).toHaveLength(1)
  expect((await s.api.select('subscriptions', 'select=id')).body).toHaveLength(1)
  expect(((await s.api.select('categories', 'select=id&name=eq.Mascotas')) as { body: unknown[] }).body).toHaveLength(1)
})

/** Luminancia relativa y razón de contraste de WCAG 2.2 sobre colores que el navegador ya resolvió a sRGB. */
async function contrastReport(page: Page) {
  return page.evaluate(() => {
    const toRgb = (css: string): [number, number, number, number] => {
      const c = document.createElement('canvas')
      c.width = c.height = 1
      const ctx = c.getContext('2d', { willReadFrequently: true })!
      ctx.clearRect(0, 0, 1, 1)
      ctx.fillStyle = css
      ctx.fillRect(0, 0, 1, 1)
      const d = ctx.getImageData(0, 0, 1, 1).data
      return [d[0], d[1], d[2], d[3] / 255]
    }
    const lum = ([r, g, b]: number[]) => {
      const f = (v: number) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4 }
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
    }
    const ratio = (a: number[], b: number[]) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }
    // Fondo efectivo: se apilan las capas con transparencia desde el elemento hasta la primera opaca.
    const bgOf = (el: Element): number[] => {
      const layers: number[][] = []
      for (let n: Element | null = el; n; n = n.parentElement) {
        const [r, g, b, a] = toRgb(getComputedStyle(n).backgroundColor)
        if (a > 0) layers.push([r, g, b, a])
        if (a > 0.99) break
      }
      let acc = [255, 255, 255]
      for (const [r, g, b, a] of layers.reverse()) acc = [r, g, b].map((v, i) => v * a + acc[i] * (1 - a))
      return acc
    }

    const out: { text: string; ratio: number; large: boolean }[] = []
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = node.textContent?.trim()
      const el = node.parentElement
      if (!text || !el || !/[\p{L}\p{N}]/u.test(text) || !el.checkVisibility()) continue
      const cs = getComputedStyle(el)
      if (cs.opacity === '0' || cs.visibility === 'hidden') continue
      const bg = bgOf(el)
      const [r, g, b, a] = toRgb(cs.color)
      const fg = [0, 1, 2].map((i) => [r, g, b][i] * a + bg[i] * (1 - a))
      const px = parseFloat(cs.fontSize)
      const bold = Number(cs.fontWeight) >= 700
      out.push({ text: text.slice(0, 30), ratio: ratio(fg, bg), large: px >= 24 || (px >= 18.66 && bold) })
    }
    const hero = document.querySelector('.hero')
    return { items: out, hero: hero ? getComputedStyle(hero).backgroundImage : null }
  })
}

test('CP-CFG-034 · en claro y en oscuro el texto cumple el contraste y la tarjeta protagonista conserva su degradado', async ({ page, request }) => {
  const s = await setup(page, request, 'cfg-034')
  expect((await expense(s)).status).toBe(200)
  for (const scheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme: scheme })
    await page.goto('/dashboard')
    await expect(page.getByTestId('dashboard-total-expenses')).toBeVisible()
    expect(await html(page).evaluate((el) => el.classList.contains('dark'))).toBe(scheme === 'dark')
    const { items, hero } = await contrastReport(page)
    expect(items.length).toBeGreaterThan(5)
    const bad = items.filter((i) => i.ratio < (i.large ? 3 : 4.5))
    expect(bad, `${scheme}: ${JSON.stringify(bad.slice(0, 6))}`).toEqual([])
    expect(hero ?? '').toContain('gradient')
  }
})
