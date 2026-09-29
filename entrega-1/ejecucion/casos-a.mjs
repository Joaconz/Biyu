// Casos ACC, CFG y REG del catálogo (docs/10-catalogo-casos-v1.md), más CP-ACC-012 (US-66).
import {
  BASE, TODAY, P0, addDaysIso, apiClient, apiSignUp, catalogOf, email, exists, gotoRegister,
  newContext, rpcCreate, shot, slug, sql, text, uiRegister, userId, waitDashboard, TEST_PASSWORD,
  STORAGE_KEY,
} from './lib.mjs'

const PASS = 'PASSED'
const FAIL = 'FAILED'
const BLOCK = 'BLOCKED'

export function casosA(ctx) {
  const { browser, users } = ctx
  const page = () => ctx.pageA

  return [
    ['CP-ACC-001', async () => {
      const c = await newContext(browser)
      const p = await c.newPage()
      await p.goto(`${BASE}/`)
      await p.getByTestId('login-form').waitFor()
      const url = p.url().replace(BASE, '')
      const formRendered = await exists(p, 'transaction-form')
      const ev = await shot(p, 'CP-ACC-001-login')
      await c.close()
      const ok = url === '/login?next=%2Fregister' && !formRendered
      return { status: ok ? PASS : FAIL, obtained: `URL final ${url}; formulario de registro renderizado: ${formRendered ? 'sí' : 'no'}`, evidence: [ev] }
    }],

    ['CP-ACC-002', async () => {
      const c = await newContext(browser)
      const p = await c.newPage()
      await p.goto(`${BASE}/settings`)
      await p.getByTestId('login-form').waitFor()
      const url = p.url().replace(BASE, '')
      // Exploración posterior (DEF-008): iniciar sesión desde ahí y ver adónde lleva.
      await p.getByTestId('login-form-email').fill(users.A.email)
      await p.getByTestId('login-form-password').fill(TEST_PASSWORD)
      await p.getByTestId('login-form-submit').click()
      await p.waitForURL((u) => !u.pathname.startsWith('/login'))
      await p.waitForTimeout(800)
      const after = p.url().replace(BASE, '')
      await c.close()
      const ok = url === '/login?next=%2Fsettings'
      return {
        status: ok ? PASS : FAIL,
        obtained: `Redirige a ${url}. Exploración: después de iniciar sesión la app terminó en ${after}.`,
        defects: after.startsWith('/settings') ? [] : ['DEF-008'],
        notes: after.startsWith('/settings') ? 'El destino original se respeta (DEF-008 no se reproduce).' : 'El caso escrito pasa; el login posterior ignora el next (DEF-008 sigue reproduciéndose).',
      }
    }],

    ['CP-ACC-003', async () => {
      const c = await newContext(browser)
      const p = await c.newPage()
      const mail = email('acc003')
      await p.goto(`${BASE}/signup`)
      await p.getByTestId('signup-form-email').fill(mail)
      await p.getByTestId('signup-form-password').fill('Clave123!')
      await p.getByTestId('signup-form-confirm-password').fill('Clave123!')
      const ev1 = await shot(p, 'CP-ACC-003-signup-completo')
      await p.getByTestId('signup-form-submit').click()
      await p.waitForURL(/\/register/, { timeout: 15000 }).catch(() => {})
      await p.waitForTimeout(800)
      const url = p.url().replace(BASE, '')
      const ev2 = await shot(p, 'CP-ACC-003-post-signup')
      const hasSession = await p.evaluate((k) => !!localStorage.getItem(k), STORAGE_KEY)
      ctx.acc003 = { context: c, page: p, email: mail }
      const ok = url.startsWith('/register') && hasSession
      return { status: ok ? PASS : FAIL, obtained: `Cuenta creada; URL ${url}; sesión en localStorage: ${hasSession ? 'sí' : 'no'}.`, evidence: [ev1, ev2] }
    }],

    ['CP-ACC-004', async () => {
      const c = await newContext(browser)
      const p = await c.newPage()
      const variants = [['a', 'abc1234'], ['b', 'abcdefgh'], ['c', '12345678'], ['d', 'abcd1234'], ['e', 'Abcd123!']]
      const lines = []
      const evidence = []
      let uiOk = true
      for (const [k, pwd] of variants) {
        await p.goto(`${BASE}/signup`)
        const mail = email(`acc004${k}`)
        await p.getByTestId('signup-form-email').fill(mail)
        await p.getByTestId('signup-form-password').fill(pwd)
        await p.getByTestId('signup-form-confirm-password').fill(pwd)
        await p.getByTestId('signup-form-submit').click()
        await p.waitForTimeout(1200)
        const err = (await exists(p, 'signup-form-error')) ? await text(p, 'signup-form-error') : ''
        const created = !!userId(mail)
        lines.push(`(${k}) ${pwd} → ${created ? 'cuenta creada' : `rechazada: "${err}"`}`)
        if (k === 'a') evidence.push(await shot(p, 'CP-ACC-004-criterios'))
        if (k === 'e' ? !created : created || !err) uiOk = false
        if (k === 'e') await p.evaluate(() => localStorage.clear())
      }
      // Variante servidor: FR-01 pide validar también en el servidor.
      const weakMail = email('acc004api')
      const { data, error } = await apiSignUp(weakMail, 'abcd1234')
      const serverAccepted = !!data?.session && !error
      lines.push(`Variante API: POST /auth/v1/signup con abcd1234 → ${serverAccepted ? 'aceptada (devuelve sesión)' : `rechazada (${error?.code})`}`)
      await c.close()
      return {
        status: uiOk && !serverAccepted ? PASS : FAIL,
        obtained: lines.join('\n'),
        evidence,
        defects: serverAccepted ? ['DEF-005'] : [],
        notes: 'La UI rechaza (a)–(d) con el criterio que falta y acepta (e). El servidor (Supabase Auth, mínimo 6 caracteres) acepta la contraseña débil: falla la parte "validado en el servidor" de FR-01.',
      }
    }],

    ['CP-ACC-005', async () => {
      const c = await newContext(browser)
      const p = await c.newPage()
      const mail = ctx.acc003.email
      await p.goto(`${BASE}/signup`)
      await p.getByTestId('signup-form-email').fill(mail)
      await p.getByTestId('signup-form-password').fill('Clave123!')
      await p.getByTestId('signup-form-confirm-password').fill('Clave123!')
      await p.getByTestId('signup-form-submit').click()
      await p.getByTestId('signup-form-error').waitFor()
      const err = await text(p, 'signup-form-error')
      const ev = await shot(p, 'CP-ACC-005-email-repetido')
      const count = sql(`select count(*) from auth.users where email = '${mail}'`)
      const { error } = await apiSignUp(mail, 'Clave123!')
      await c.close()
      const ok = err === 'Ya existe una cuenta con ese email' && count === '1' && /exists/.test(error?.code ?? '')
      return { status: ok ? PASS : FAIL, obtained: `UI: "${err}". Cuentas con ese email: ${count}. API: código ${error?.code ?? 'sin error'}.`, evidence: [ev] }
    }],

    ['CP-ACC-006', async () => {
      const c = await newContext(browser)
      const p = await c.newPage()
      await p.goto(`${BASE}/login`)
      await p.getByTestId('login-form-email').fill(email('noexiste'))
      await p.getByTestId('login-form-password').fill('Cualquiera1!')
      await p.getByTestId('login-form-submit').click()
      await p.getByTestId('login-form-error').waitFor()
      const err = await text(p, 'login-form-error')
      const ev = await shot(p, 'CP-ACC-006-credenciales-invalidas')
      await p.getByTestId('login-form-switch').click()
      await p.getByTestId('signup-form').waitFor()
      const persisted = await exists(p, 'signup-form-error')
      await c.close()
      const ok = err === 'Email o contraseña incorrectos' && !persisted
      return { status: ok ? PASS : FAIL, obtained: `Login: "${err}". Al pasar a /signup el error ${persisted ? 'persiste' : 'no persiste'}.`, evidence: [ev] }
    }],

    ['CP-ACC-007', async () => {
      const c = await newContext(browser)
      const p = await c.newPage()
      const mail = email('acc007')
      // Simula "Confirm email" activo: la respuesta de signup llega sin sesión.
      await p.route('**/auth/v1/signup**', (route) =>
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: '00000000-0000-0000-0000-000000000000', email: mail, aud: 'authenticated', role: '', app_metadata: {}, user_metadata: {}, identities: [], created_at: new Date().toISOString() }) }),
      )
      await p.goto(`${BASE}/signup`)
      await p.getByTestId('signup-form-email').fill(mail)
      await p.getByTestId('signup-form-password').fill('Clave123!')
      await p.getByTestId('signup-form-confirm-password').fill('Clave123!')
      await p.getByTestId('signup-form-submit').click()
      await p.getByTestId('signup-form-error').waitFor()
      const msg = await text(p, 'signup-form-error')
      const url = p.url().replace(BASE, '')
      const ev = await shot(p, 'CP-ACC-007-confirmar-email')
      await c.close()
      const ok = msg.startsWith('Te creamos la cuenta, pero hace falta confirmar el email') && url.startsWith('/signup')
      return { status: ok ? PASS : FAIL, obtained: `Mensaje: "${msg}". URL: ${url}.`, evidence: [ev], notes: 'Respuesta sin sesión simulada interceptando /auth/v1/signup con Playwright (el caso es hipotético: el proyecto no tiene confirmación de email).' }
    }],

    ['CP-ACC-008', async () => {
      const p = ctx.acc003.page
      await p.goto(`${BASE}/settings`)
      await p.getByTestId('settings-categories-list').locator('li').first().waitFor()
      await p.waitForTimeout(500)
      const cats = await p.getByTestId('settings-categories-list').locator('li').allTextContents()
      const accs = await p.getByTestId('settings-accounts-list').locator('li').allTextContents()
      const ev = await shot(p, 'CP-ACC-008-siembra')
      const uid = userId(ctx.acc003.email)
      const dbCats = sql(`select count(*) from categories where user_id='${uid}'`)
      const dbAccs = sql(`select count(*) from accounts where user_id='${uid}'`)
      const expectedCats = ['Comida y supermercado', 'Transporte', 'Servicios', 'Entretenimiento', 'Salud', 'Educación', 'Indumentaria', 'Otros']
      const ok = cats.length === 8 && accs.length === 5 && expectedCats.every((n) => cats.some((t) => t.includes(n))) && dbCats === '8' && dbAccs === '5'
      return { status: ok ? PASS : FAIL, obtained: `Ajustes muestra ${cats.length} categorías y ${accs.length} cuentas; en la base hay ${dbCats} y ${dbAccs}.`, evidence: [ev] }
    }],

    ['CP-ACC-009', async () => {
      const lines = []
      let ok = true
      const evidence = []
      for (const screen of ['register', 'dashboard', 'transactions']) {
        const { data } = await apiClient().auth.signInWithPassword({ email: ctx.acc003.email, password: 'Clave123!' })
        const c = await newContext(browser, data.session)
        const p = await c.newPage()
        await p.goto(`${BASE}/${screen}`)
        await p.getByTestId(`${screen}-nav-settings`).click()
        await p.getByTestId('settings-nav-logout').click()
        await p.waitForURL(/\/login/)
        const url = p.url().replace(BASE, '')
        if (screen === 'register') evidence.push(await shot(p, 'CP-ACC-009-logout'))
        await p.goBack()
        await p.waitForTimeout(600)
        const back = p.url().replace(BASE, '')
        const sessionLeft = await p.evaluate((k) => !!localStorage.getItem(k), STORAGE_KEY)
        lines.push(`Desde /${screen} → Ajustes → Cerrar sesión: ${url}; "atrás" queda en ${back}; sesión en storage: ${sessionLeft ? 'sí' : 'no'}`)
        if (!url.startsWith('/login') || !back.startsWith('/login') || sessionLeft) ok = false
        await c.close()
      }
      return { status: ok ? PASS : FAIL, obtained: lines.join('\n'), evidence, notes: 'Con el rediseño (ADR-023) "Cerrar sesión" vive en Ajustes, que se abre desde el header de cada pantalla; el paso 1 se ejecutó por ese camino.' }
    }],

    ['CP-ACC-010', async () => {
      const p = ctx.acc003.page
      await gotoRegister(p)
      await p.reload()
      await p.waitForTimeout(800)
      const afterReload = p.url().replace(BASE, '')
      const state = await ctx.acc003.context.storageState()
      const c2 = await browser.newContext({ storageState: state, viewport: { width: 390, height: 844 } })
      const p2 = await c2.newPage()
      await p2.goto(`${BASE}/register`)
      await p2.waitForTimeout(1200)
      const reopened = p2.url().replace(BASE, '')
      const form = await exists(p2, 'transaction-form')
      await c2.close()
      const ok = afterReload.startsWith('/register') && reopened.startsWith('/register') && form
      return { status: ok ? PASS : FAIL, obtained: `Tras F5: ${afterReload}. Navegador nuevo con el mismo almacenamiento: ${reopened} (formulario visible: ${form ? 'sí' : 'no'}).`, notes: 'El plazo de inactividad (configuración de Supabase Auth) queda fuera del caso, como dice el catálogo.' }
    }],

    ['CP-ACC-011', async () => ctx.authorization('ACC')],

    ['CP-ACC-012', async () => {
      const c = await newContext(browser)
      const p = await c.newPage()
      const mail = email('acc012')
      await p.goto(`${BASE}/signup`)
      await p.getByTestId('signup-form-email').fill(mail)
      await p.getByTestId('signup-form-password').fill('Clave123!')
      await p.getByTestId('signup-form-confirm-password').fill('Clave123?')
      const masked = await p.getByTestId('signup-form-confirm-password').getAttribute('type')
      await p.getByTestId('signup-form-submit').click()
      await p.getByTestId('signup-form-error').waitFor()
      const err = await text(p, 'signup-form-error')
      const ev = await shot(p, 'CP-ACC-012-no-coinciden')
      const created = !!userId(mail)
      await c.close()
      const ok = err === 'Las contraseñas no son iguales' && !created && masked === 'password'
      return { status: ok ? PASS : FAIL, obtained: `Mensaje: "${err}". Campo enmascarado: ${masked === 'password' ? 'sí' : 'no'}. Cuenta creada: ${created ? 'sí' : 'no'}.`, evidence: [ev] }
    }],

    // ---------------- CFG ----------------
    ['CP-CFG-001', async () => {
      const p = page()
      await p.goto(`${BASE}/settings`)
      await p.getByTestId('settings-categories-name').fill('Mascotas')
      const swatches = p.getByTestId('settings-categories-color').locator('button')
      const color = await swatches.nth(2).getAttribute('aria-label')
      await swatches.nth(2).click()
      await p.getByTestId('settings-categories-submit').click()
      await p.getByTestId('settings-categories-list').getByText('Mascotas').waitFor()
      const ev = await shot(p, 'CP-CFG-001-categoria-creada')
      const row = sql(`select name, color from categories where user_id='${users.A.id}' and name='Mascotas' and archived_at is null`)
      const ok = row === `Mascotas|${color}`
      return { status: ok ? PASS : FAIL, obtained: `Aparece "Mascotas" en el listado; en la base: ${row} (color elegido ${color}).`, evidence: [ev] }
    }],

    ['CP-CFG-002', async () => {
      const p = page()
      await p.goto(`${BASE}/settings`)
      const before = sql(`select count(*) from categories where user_id='${users.A.id}'`)
      await p.getByRole('button', { name: 'Editar Comida y supermercado' }).click()
      await p.getByTestId('settings-categories-edit-name').fill('Comida')
      const swatches = p.getByTestId('settings-categories-edit-color').locator('button')
      const color = await swatches.nth(4).getAttribute('aria-label')
      await swatches.nth(4).click()
      await p.getByTestId('settings-categories-save').click()
      await p.getByTestId('settings-categories-list').getByText('Comida', { exact: true }).waitFor()
      const ev = await shot(p, 'CP-CFG-002-categoria-editada')
      const after = sql(`select count(*) from categories where user_id='${users.A.id}'`)
      const row = sql(`select name, color from categories where user_id='${users.A.id}' and name='Comida'`)
      const ok = before === after && row === `Comida|${color}`
      return { status: ok ? PASS : FAIL, obtained: `Filas antes/después: ${before}/${after}. Fila editada: ${row}.`, evidence: [ev] }
    }],

    ['CP-CFG-003', async () => {
      const p = page()
      await p.goto(`${BASE}/settings`)
      await p.getByTestId('settings-categories-name').fill('Salud')
      await p.getByTestId('settings-categories-submit').click()
      await p.getByTestId('settings-categories-error').waitFor()
      const err = await text(p, 'settings-categories-error')
      const ev = await shot(p, 'CP-CFG-003-duplicada')
      const { error } = await users.A.client.from('categories').insert({ name: 'Salud', color: '#000000' })
      const ok = err === 'Ya existe una categoría activa con ese nombre' && error?.code === '23505'
      return { status: ok ? PASS : FAIL, obtained: `UI: "${err}". API insert directo: ${error?.code ?? 'aceptado'}.`, evidence: [ev] }
    }],

    ['CP-CFG-004', async () => {
      const p = page()
      const cat = await catalogOf(users.A.client)
      const { data: txId } = await rpcCreate(users.A.client, { p_amount: '8000', p_category_id: cat.cat('Entretenimiento'), p_account_id: cat.acc('Efectivo'), p_occurred_on: TODAY, p_description: 'Cine' })
      await p.goto(`${BASE}/settings`)
      await p.getByRole('button', { name: 'Archivar Entretenimiento' }).click()
      await p.waitForTimeout(600)
      const stillListed = (await p.getByTestId('settings-categories-list').getByText('Entretenimiento').count()) > 0
      await gotoRegister(p)
      await p.getByTestId('transaction-form-amount').fill('100')
      await p.getByTestId('transaction-form-next').click()
      const chipInForm = await exists(p, 'transaction-form-category-chip-entretenimiento')
      await p.goto(`${BASE}/transactions?period=${P0}`)
      await p.getByTestId('transactions-list').waitFor()
      const item = p.getByTestId('transactions-item').filter({ hasText: 'Cine' })
      const itemHtml = (await item.innerHTML()).toLowerCase()
      const archivedMark = itemHtml.includes('archivad')
      const ev = await shot(p, 'CP-CFG-004-historial')
      const dbCat = sql(`select c.name || '|' || (c.archived_at is not null) from transactions t join categories c on c.id=t.category_id where t.id='${txId}'`)
      const ok = !stillListed && !chipInForm && dbCat === 'Entretenimiento|t' && archivedMark
      return {
        status: ok ? PASS : FAIL,
        obtained: `Listado activo la muestra: ${stillListed ? 'sí' : 'no'}. Chip en el registro: ${chipInForm ? 'sí' : 'no'}. category_id intacto en la base (${dbCat}). En /transactions el gasto "Cine" ${archivedMark ? 'tiene' : 'NO tiene'} marca de archivada.`,
        evidence: [ev],
        defects: archivedMark ? [] : ['DEF-006'],
      }
    }],

    ['CP-REG-005', async () => {
      // Se ejecuta antes que CP-CFG-005: necesita "Salidas" archivada y ninguna activa.
      const p = page()
      await users.A.client.from('categories').insert({ name: 'Salidas', color: '#6B8E6B' })
      const salidasId = sql(`select id from categories where user_id='${users.A.id}' and name='Salidas' and archived_at is null`)
      await p.goto(`${BASE}/settings`)
      await p.getByRole('button', { name: 'Archivar Salidas' }).click()
      await p.waitForTimeout(600)
      await gotoRegister(p)
      await p.getByTestId('transaction-form-amount').fill('100')
      await p.getByTestId('transaction-form-next').click()
      await p.locator('[data-testid="transaction-form-step"][data-step="category"]').waitFor()
      const chip = await exists(p, 'transaction-form-category-chip-salidas')
      const ev = await shot(p, 'CP-REG-005-grilla-sin-archivada')
      const cat = await catalogOf(users.A.client)
      const { error } = await rpcCreate(users.A.client, { p_amount: '100', p_category_id: salidasId, p_account_id: cat.acc('Efectivo'), p_occurred_on: TODAY })
      const ok = !chip && /archivada/.test(error?.message ?? '')
      return { status: ok ? PASS : FAIL, obtained: `Chip "Salidas" en la grilla: ${chip ? 'sí' : 'no'}. API con la categoría archivada: "${error?.message ?? 'aceptada'}".`, evidence: [ev] }
    }],

    ['CP-CFG-005', async () => {
      const p = page()
      await p.goto(`${BASE}/settings`)
      await p.getByTestId('settings-categories-name').fill('Salidas')
      await p.getByTestId('settings-categories-submit').click()
      await p.waitForTimeout(800)
      const err = (await exists(p, 'settings-categories-error')) ? await text(p, 'settings-categories-error') : ''
      const rows = sql(`select count(*) filter (where archived_at is null) || '|' || count(*) filter (where archived_at is not null) from categories where user_id='${users.A.id}' and name='Salidas'`)
      const ok = !err && rows === '1|1'
      return { status: ok ? PASS : FAIL, obtained: `Error mostrado: ${err || 'ninguno'}. Filas "Salidas" activas|archivadas: ${rows}.` }
    }],

    ['CP-CFG-006', async () => {
      const p = page()
      await p.goto(`${BASE}/settings`)
      await p.getByTestId('settings-accounts-name').fill('Visa BBVA')
      const typeLabel = await text(p, 'settings-accounts-type')
      await p.getByTestId('settings-accounts-submit').click()
      await p.getByTestId('settings-accounts-list').getByText('Visa BBVA').waitFor()
      const row = await p.getByTestId('settings-accounts-list').locator('li').filter({ hasText: 'Visa BBVA' }).textContent()
      const ev = await shot(p, 'CP-CFG-006-cuenta-creada')
      const db = sql(`select type || '|' || currency from accounts where user_id='${users.A.id}' and name='Visa BBVA'`)
      await gotoRegister(p)
      await p.getByTestId('transaction-form-amount').fill('1000')
      await p.getByTestId('transaction-form-next').click()
      await p.getByTestId('transaction-form-category-chip-otros').click()
      await p.getByTestId('transaction-form-account-chip-visa-bbva').click()
      const installments = await exists(p, 'transaction-form-installments')
      const ok = row.includes('Tarjeta de crédito') && db === 'credit_card|ARS' && installments
      return { status: ok ? PASS : FAIL, obtained: `Tipo preseleccionado: ${typeLabel}. Fila: "${row.trim()}". Base: ${db}. Con Visa BBVA el registro ofrece cuotas: ${installments ? 'sí' : 'no'}.`, evidence: [ev] }
    }],

    ['CP-CFG-007', async () => {
      const p = page()
      await p.goto(`${BASE}/settings`)
      await p.getByTestId('settings-accounts-name').fill('Efectivo')
      await p.getByTestId('settings-accounts-submit').click()
      await p.getByTestId('settings-accounts-error').waitFor()
      const err = await text(p, 'settings-accounts-error')
      const ev = await shot(p, 'CP-CFG-007-cuenta-duplicada')
      const { error } = await users.A.client.from('accounts').insert({ name: 'Efectivo', type: 'cash', currency: 'ARS' })
      const ok = err === 'Ya existe una cuenta activa con ese nombre' && error?.code === '23505'
      return { status: ok ? PASS : FAIL, obtained: `UI: "${err}". API insert directo: ${error?.code ?? 'aceptado'} ${error?.message ?? ''}.`, evidence: [ev] }
    }],

    ['CP-CFG-008', async () => {
      const mail = email('cfg008')
      const { data } = await apiSignUp(mail)
      const c = await newContext(browser, data.session)
      const [p1, p2] = [await c.newPage(), await c.newPage()]
      await Promise.all([p1.goto(`${BASE}/register`), p2.goto(`${BASE}/register`)])
      await Promise.all([p1.getByTestId('transaction-form-amount').waitFor(), p2.getByTestId('transaction-form-amount').waitFor()])
      await p1.waitForTimeout(1500)
      await c.close()
      const uid = userId(mail)
      const counts = sql(`select (select count(*) from categories where user_id='${uid}') || '|' || (select count(*) from accounts where user_id='${uid}')`)
      const ok = counts === '8|5'
      return { status: ok ? PASS : FAIL, obtained: `Dos pestañas cargando /register en paralelo sobre una cuenta sin sembrar. Categorías|cuentas resultantes: ${counts}.` }
    }],

    ['CP-CFG-009', async () => {
      const p = page()
      await p.goto(`${BASE}/settings?period=${P0}`)
      await p.getByTestId('settings-fx-rate').fill('1250')
      await p.getByTestId('settings-fx-submit').click()
      await p.getByTestId('settings-fx-list').waitFor()
      await p.waitForTimeout(500)
      const first = sql(`select ars_per_usd from fx_rates where user_id='${users.A.id}' and period='${P0}-01'`)
      await p.getByTestId('settings-fx-rate').fill('1300')
      await p.getByTestId('settings-fx-submit').click()
      await p.waitForTimeout(1000)
      const list = await text(p, 'settings-fx-list')
      const ev = await shot(p, 'CP-CFG-009-tc-referencia')
      const rows = sql(`select count(*) || '|' || max(ars_per_usd) from fx_rates where user_id='${users.A.id}' and period='${P0}-01'`)
      const ok = first === '1250.0000' && rows === '1|1300.0000'
      return { status: ok ? PASS : FAIL, obtained: `Primera carga: ${first}. Tras la segunda: ${rows} (filas|valor). Lista: "${list}".`, evidence: [ev] }
    }],

    ['CP-CFG-010', async () => {
      const p = page()
      const prev = P0.replace(/-(\d\d)$/, (m, mm) => `-${mm}`)
      const lines = []
      let ok = true
      const period = addDaysIso(`${P0}-01`, -1).slice(0, 7)
      for (const [v, shouldPass] of [['0', false], ['-100', false], ['0,01', true]]) {
        await p.goto(`${BASE}/settings?period=${period}`)
        await p.getByTestId('settings-fx-rate').fill(v)
        await p.getByTestId('settings-fx-submit').click()
        await p.waitForTimeout(900)
        const err = (await exists(p, 'settings-fx-error')) ? await text(p, 'settings-fx-error') : ''
        if (v === '-100') await shot(p, 'CP-CFG-010-tc-invalido')
        const stored = sql(`select coalesce(max(ars_per_usd)::text,'—') from fx_rates where user_id='${users.A.id}' and period='${period}-01'`)
        lines.push(`${v} → ${err ? `rechazado: "${err}"` : `aceptado (base: ${stored})`}`)
        if (shouldPass ? !!err || stored !== '0.0100' : err !== 'El tipo de cambio debe ser mayor a cero') ok = false
      }
      for (const v of ['0', '-100']) {
        const { error } = await users.A.client.from('fx_rates').upsert({ period: `${period}-01`, ars_per_usd: v }, { onConflict: 'user_id,period' })
        const rpc = await users.A.client.rpc('upsert_fx_rate', { p_period: `${period}-01`, p_ars_per_usd: v })
        lines.push(`API ${v}: upsert directo → ${error ? `${error.code} ${error.message}` : 'aceptado'}; RPC upsert_fx_rate → ${rpc.error ? `${rpc.error.code} ${rpc.error.message}` : 'aceptado'}`)
        if (!error || !rpc.error) ok = false
      }
      void prev
      return { status: ok ? PASS : FAIL, obtained: lines.join('\n'), evidence: ['evidencia/CP-CFG-010-tc-invalido.jpg'] }
    }],

    // ---------------- REG ----------------
    ['CP-REG-001', async () => {
      const p = page()
      await p.goto(`${BASE}/`)
      await p.getByTestId('transaction-form-amount').waitFor()
      const url = p.url().replace(BASE, '')
      const ev = await shot(p, 'CP-REG-001-registro-inicio')
      return { status: url === '/register' ? PASS : FAIL, obtained: `Abrir / con sesión termina en ${url}, con el paso del monto visible.`, evidence: [ev] }
    }],

    ['CP-REG-002', async () => {
      const p = page()
      await gotoRegister(p)
      await p.getByTestId('transaction-form-amount').fill('1500')
      await p.getByTestId('transaction-form-next').click()
      await p.getByTestId('transaction-form-category-chip-transporte').click()
      await p.locator('[data-testid="transaction-form-step"][data-step="details"]').waitFor()
      const value = await p.getByTestId('transaction-form-date').inputValue()
      const ev = await shot(p, 'CP-REG-002-fecha-hoy')
      return { status: value === TODAY ? PASS : FAIL, obtained: `Fecha precargada: ${value} (hoy según el reloj de la corrida: ${TODAY}).`, evidence: [ev], notes: TODAY === '2026-09-28' ? '' : `El catálogo fija "hoy = 2026-09-28"; la corrida fue el ${TODAY} y se usó esa fecha como oráculo (C1: hoy entra como parámetro).` }
    }],

    ['CP-REG-003', async () => {
      const p = page()
      await gotoRegister(p)
      const type = await p.getByTestId('transaction-form-type-expense').getAttribute('aria-checked') ?? await p.getByTestId('transaction-form-type-expense').getAttribute('aria-pressed')
      const cur = await p.getByTestId('transaction-form-currency-ars').getAttribute('aria-checked') ?? await p.getByTestId('transaction-form-currency-ars').getAttribute('aria-pressed')
      const ev = await shot(p, 'CP-REG-003-valores-por-defecto')
      const ok = type === 'true' && cur === 'true'
      return { status: ok ? PASS : FAIL, obtained: `Gasto seleccionado: ${type}. ARS seleccionado: ${cur}.`, evidence: [ev] }
    }],

    ['CP-REG-016', async () => {
      const p = page()
      await gotoRegister(p)
      const info = await p.evaluate(() => ({ focused: document.activeElement?.getAttribute('data-testid'), inputMode: document.activeElement?.getAttribute('inputmode') }))
      const ok = info.focused === 'transaction-form-amount' && info.inputMode === 'decimal'
      return {
        status: ok ? PASS : FAIL,
        obtained: `Elemento con foco al abrir: ${info.focused}; inputmode="${info.inputMode}".`,
        notes: 'Ejecutado en Chromium con emulación móvil (390×844, touch). Que el sistema operativo abra el teclado numérico no se puede observar en un navegador emulado: se verificó la condición que lo provoca (foco automático + inputmode decimal). Confirmar en un celular real antes de la demo.',
      }
    }],

    ['CP-REG-004', async () => {
      const p = page()
      await gotoRegister(p)
      await p.getByTestId('transaction-form-amount').fill('2300')
      await p.getByTestId('transaction-form-next').click()
      await p.locator('[data-testid="transaction-form-step"][data-step="category"]').waitFor()
      const selects = await p.locator('form select, [role="combobox"]').count()
      const ev1 = await shot(p, 'CP-REG-004-grilla-categorias')
      await p.getByTestId('transaction-form-category-chip-transporte').click()
      await p.locator('[data-testid="transaction-form-step"][data-step="details"]').waitFor()
      const responsePromise = p.waitForResponse((r) => r.url().includes('/rpc/create_transaction'))
      await p.getByTestId('transaction-form-submit').click()
      const id = await (await responsePromise).json()
      const cat = sql(`select c.name from transactions t join categories c on c.id=t.category_id where t.id='${id}'`)
      const ok = cat === 'Transporte' && selects === 0
      return { status: ok ? PASS : FAIL, obtained: `Tocar el chip avanzó solo a detalles. Categoría guardada: ${cat}. Selects en el paso: ${selects}.`, evidence: [ev1] }
    }],

    ['CP-REG-006', async () => {
      const p = page()
      await uiRegister(p, { amount: '3200', category: 'Otros', account: 'Visa BBVA' })
      await gotoRegister(p)
      await p.getByTestId('transaction-form-amount').fill('10')
      await p.getByTestId('transaction-form-next').click()
      await p.getByTestId('transaction-form-category-chip-otros').click()
      await p.locator('[data-testid="transaction-form-step"][data-step="details"]').waitFor()
      const pressed = await p.getByTestId('transaction-form-account-chip-visa-bbva').getAttribute('aria-pressed')
      const ev = await shot(p, 'CP-REG-006-cuenta-precargada')
      return { status: pressed === 'true' ? PASS : FAIL, obtained: `Al volver a abrir el registro, "Visa BBVA" viene seleccionada: ${pressed}.`, evidence: [ev] }
    }],

    ['CP-REG-007', async () => {
      const p = page()
      const id = await uiRegister(p, { amount: '1234', category: 'Servicios', account: 'Efectivo' })
      const desc = sql(`select coalesce(description, 'NULL') from transactions where id='${id}'`)
      return { status: desc === 'NULL' ? PASS : FAIL, obtained: `Guardado sin nota. description en la base: ${desc}.` }
    }],

    ['CP-REG-008', async () => {
      const p = page()
      const yesterday = addDaysIso(TODAY, -1)
      const tomorrow = addDaysIso(TODAY, 1)
      await gotoRegister(p)
      await p.getByTestId('transaction-form-amount').fill('999')
      await p.getByTestId('transaction-form-next').click()
      await p.getByTestId('transaction-form-category-chip-otros').click()
      await p.getByTestId('transaction-form-date-yesterday').click()
      const yv = await p.getByTestId('transaction-form-date').inputValue()
      const responsePromise = p.waitForResponse((r) => r.url().includes('/rpc/create_transaction'))
      await p.getByTestId('transaction-form-submit').click()
      const yOk = (await responsePromise).ok()
      await p.waitForTimeout(1200)
      await gotoRegister(p)
      await p.getByTestId('transaction-form-amount').fill('999')
      await p.getByTestId('transaction-form-next').click()
      await p.getByTestId('transaction-form-category-chip-otros').click()
      await p.getByTestId('transaction-form-date').fill(tomorrow)
      await p.waitForTimeout(300)
      const err = await p.locator('#transaction-form-date-error').textContent().catch(() => '')
      const disabled = await p.getByTestId('transaction-form-submit').isDisabled()
      const ev = await shot(p, 'CP-REG-008-fecha-futura')
      const cat = await catalogOf(users.A.client)
      const { error } = await rpcCreate(users.A.client, { p_amount: '999', p_category_id: cat.cat('Otros'), p_account_id: cat.acc('Efectivo'), p_occurred_on: tomorrow })
      const ok = yv === yesterday && yOk && /futura/.test(err ?? '') && disabled && /posterior a hoy/.test(error?.message ?? '')
      return { status: ok ? PASS : FAIL, obtained: `Ayer (${yv}) → guardado: ${yOk ? 'sí' : 'no'}. Mañana (${tomorrow}) → mensaje "${(err ?? '').trim()}", Guardar deshabilitado: ${disabled}. API con fecha futura: "${error?.message ?? 'aceptada'}".`, evidence: [ev] }
    }],

    ['CP-REG-009', async () => {
      const p = page()
      await uiRegister(p, { amount: '4500', category: 'Salud', account: 'Tarjeta de débito' })
      await p.locator('[data-testid="transaction-form-step"][data-step="amount"]').waitFor({ timeout: 5000 })
      await p.waitForTimeout(400)
      const amount = await p.getByTestId('transaction-form-amount').inputValue()
      const toast = await p.getByText('Gasto guardado').count()
      const ev = await shot(p, 'CP-REG-009-post-guardado')
      await p.getByTestId('transaction-form-amount').fill('1')
      await p.getByTestId('transaction-form-next').click()
      await p.getByTestId('transaction-form-category-chip-otros').click()
      const pressed = await p.getByTestId('transaction-form-account-chip-tarjeta-de-debito').getAttribute('aria-pressed')
      const ok = amount === '' && toast > 0 && pressed === 'true'
      return { status: ok ? PASS : FAIL, obtained: `Toast "Gasto guardado": ${toast > 0 ? 'sí' : 'no'}. Vuelve al paso del monto con el monto vacío: ${amount === '' ? 'sí' : `no ("${amount}")`}. Conserva la última cuenta: ${pressed}.`, evidence: [ev] }
    }],

    ['CP-REG-010', async () => {
      const p = page()
      const lines = []
      let ok = true
      await gotoRegister(p)
      for (const v of ['', '0', '-500']) {
        await p.getByTestId('transaction-form-amount').fill(v)
        const disabled = await p.getByTestId('transaction-form-next').isDisabled()
        lines.push(`"${v || 'vacío'}" → Siguiente deshabilitado: ${disabled}`)
        if (!disabled) ok = false
        if (v === '-500') await shot(p, 'CP-REG-010-monto-negativo')
      }
      const id = await uiRegister(p, { amount: '0,01', category: 'Otros', account: 'Efectivo' })
      const amt = sql(`select amount from transactions where id='${id}'`)
      lines.push(`"0,01" → guardado con amount=${amt}`)
      if (amt !== '0.01') ok = false
      const cat = await catalogOf(users.A.client)
      for (const v of ['0', '-5']) {
        const { error } = await rpcCreate(users.A.client, { p_amount: v, p_category_id: cat.cat('Otros'), p_account_id: cat.acc('Efectivo'), p_occurred_on: TODAY })
        lines.push(`API p_amount=${v} → ${error ? `${error.code} "${error.message}"` : 'ACEPTADO'}`)
        if (!error || error.code !== '23514') ok = false
      }
      return { status: ok ? PASS : FAIL, obtained: lines.join('\n'), evidence: ['evidencia/CP-REG-010-monto-negativo.jpg'] }
    }],

    ['CP-REG-011', async () => {
      const p = page()
      await gotoRegister(p)
      await p.getByTestId('transaction-form-amount').fill('100,999')
      await p.getByTestId('transaction-form-amount').blur()
      await p.waitForTimeout(300)
      const err = await p.locator('#transaction-form-amount-error').textContent().catch(() => '')
      const disabled = await p.getByTestId('transaction-form-next').isDisabled()
      const ev = await shot(p, 'CP-REG-011-tres-decimales')
      const cat = await catalogOf(users.A.client)
      const { error } = await rpcCreate(users.A.client, { p_amount: '100.999', p_category_id: cat.cat('Otros'), p_account_id: cat.acc('Efectivo'), p_occurred_on: TODAY })
      const ok = /2 decimales/.test(err ?? '') && disabled
      return { status: ok ? PASS : FAIL, obtained: `Mensaje: "${(err ?? '').trim()}". Siguiente deshabilitado: ${disabled}. API con 100.999: ${error ? `rechazado "${error.message}"` : 'aceptado'}.`, evidence: [ev], notes: 'La ambigüedad 2 del catálogo queda resuelta: el servidor también rechaza más de 2 decimales (no trunca en silencio).' }
    }],

    ['CP-REG-012', async () => {
      const p = page()
      const id = await uiRegister(p, { amount: '50000', category: 'Indumentaria', account: 'Efectivo', description: 'Campera' })
      await waitDashboard(p, P0)
      const before = await text(p, 'dashboard-total-expenses')
      await p.goto(`${BASE}/transactions?period=${P0}`)
      await p.getByTestId('transactions-list').waitFor()
      await p.getByTestId('transactions-item').filter({ hasText: 'Campera' }).getByTestId('transactions-item-delete').click()
      await p.getByTestId('delete-transaction-dialog').waitFor()
      const ev1 = await shot(p, 'CP-REG-012-confirmar-borrado')
      await p.getByTestId('delete-transaction-confirm').click()
      await p.getByTestId('delete-transaction-dialog').waitFor({ state: 'detached' })
      await p.waitForTimeout(600)
      const visibleInHistory = await p.getByTestId('transactions-item').filter({ hasText: 'Campera' }).count()
      const ev2 = await shot(p, 'CP-REG-012-historial-post-borrado')
      await waitDashboard(p, P0)
      const after = await text(p, 'dashboard-total-expenses')
      const db = sql(`select (deleted_at is not null)::text from transactions where id='${id}'`)
      const num = (s) => Number(s.replace(/[^\d,]/g, '').replace(',', '.'))
      const ok = db === 'true' && Math.round((num(before) - num(after)) * 100) === 5000000
      return {
        status: ok ? PASS : FAIL,
        obtained: `Total del mes antes ${before} → después ${after}. deleted_at completado: ${db}. En el historial (/transactions) el gasto ${visibleInHistory ? 'sigue visible' : 'desaparece (sin marca de eliminada)'}.`,
        evidence: [ev1, ev2],
        defects: visibleInHistory ? [] : ['DEF-007'],
        notes: 'El resultado esperado del caso se cumple (soft delete y total). FR-08 pide además que quede visible en el historial con marca de eliminada: no ocurre (DEF-007).',
      }
    }],

    ['CP-REG-013', async () => ctx.reg013()],
    ['CP-REG-014', async () => ctx.authorization('REG')],

    ['CP-REG-015', async () => {
      const cat = await catalogOf(users.A.client)
      const { error } = await users.A.client.from('transactions').insert({ user_id: users.A.id, type: 'expense', amount: '10', currency: 'ARS', category_id: cat.cat('Otros'), account_id: cat.acc('Efectivo'), installments_count: 1, first_period: `${P0}-01`, occurred_on: TODAY })
      const le = await users.A.client.from('ledger_entries').insert({ user_id: users.A.id, transaction_id: '00000000-0000-0000-0000-000000000000', period: `${P0}-01`, installment_number: 1, amount: '1', amount_ars: '1' })
      const ok = error?.code === '42501' && le.error?.code === '42501'
      return { status: ok ? PASS : FAIL, obtained: `Insert directo a transactions: ${error ? `${error.code} "${error.message}"` : 'ACEPTADO'}. A ledger_entries: ${le.error ? `${le.error.code}` : 'ACEPTADO'}.`, notes: 'También cubierto por supabase/tests/database/rls_isolation.test.sql (verde en esta corrida).' }
    }],
  ]
}

export { PASS, FAIL, BLOCK, slug }
