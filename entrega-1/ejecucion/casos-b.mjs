// Casos CUO, MON y DAS del catálogo, y los casos nuevos de US-68 (CP-CFG-011 a CP-CFG-015).
import {
  BASE, TODAY, P0, addMonthsPeriod, apiSignUp, catalogOf, email, exists, gotoRegister,
  newContext, rpcCreate, shot, sql, text, uiRegister, userId, waitDashboard,
} from './lib.mjs'

const PASS = 'PASSED'
const FAIL = 'FAILED'
const BLOCK = 'BLOCKED'
const num = (s) => Number(String(s).replace(/[^\d,-]/g, '').replace(',', '.'))

export function casosB(ctx) {
  const { browser, users } = ctx
  const page = () => ctx.pageA
  const ledger = (txId) =>
    sql(`select installment_number || ':' || to_char(period,'YYYY-MM') || ':' || amount || ':' || amount_ars from ledger_entries where transaction_id='${txId}' order by installment_number`).split('\n')

  return [
    // ---------------- CUO ----------------
    ['CP-CUO-001', async () => {
      const p = page()
      ctx.cuo001 = await uiRegister(p, { amount: '120000', category: 'Indumentaria', account: 'Visa BBVA', installments: 12, description: 'Heladera' }, { details: 'CP-CUO-001-doce-cuotas' })
      const rows = ledger(ctx.cuo001)
      const numbers = rows.map((r) => Number(r.split(':')[0]))
      const periods = rows.map((r) => r.split(':')[1])
      const expected = Array.from({ length: 12 }, (_, i) => addMonthsPeriod(P0, i))
      const ok = rows.length === 12 && numbers.join() === '1,2,3,4,5,6,7,8,9,10,11,12' && periods.join() === expected.join()
      return { status: ok ? PASS : FAIL, obtained: `${rows.length} imputaciones; números ${numbers.join(',')}; períodos ${periods[0]} … ${periods.at(-1)} consecutivos: ${periods.join() === expected.join() ? 'sí' : 'no'}.`, evidence: ['evidencia/CP-CUO-001-doce-cuotas.jpg'] }
    }],

    ['CP-CUO-002', async () => {
      const p = page()
      await gotoRegister(p)
      await p.getByTestId('transaction-form-amount').fill('120000')
      await p.getByTestId('transaction-form-next').click()
      await p.getByTestId('transaction-form-category-chip-otros').click()
      await p.getByTestId('transaction-form-account-chip-visa-bbva').click()
      await p.getByTestId('transaction-form-installments-chip-12').click()
      await p.getByTestId('transaction-form-date').fill('2026-08-15')
      await p.getByTestId('transaction-form-installments-preview').waitFor()
      const summary = await text(p, 'transaction-form-installments-preview-summary')
      const ev = await shot(p, 'CP-CUO-002-previsualizacion')
      const created = sql(`select count(*) from transactions where user_id='${users.A.id}' and occurred_on='2026-08-15'`)
      const ok = /12 cuotas de \$10\.000(,00)?/.test(summary) && /ago 2026/.test(summary) && /jul 2027/.test(summary) && created === '0'
      return {
        status: ok ? PASS : FAIL,
        obtained: `Antes de Guardar se muestra: "${summary}". Transacciones guardadas con esa fecha: ${created}.`,
        evidence: [ev],
        notes: 'Contenido equivalente al esperado; cambia solo el formato ("$10.000,00" y "ago 2026 a jul 2027" en lugar de "$10.000" y "2026-08 a 2027-07") por el rediseño (ADR-023). Oráculo a actualizar en el catálogo, no es defecto.',
      }
    }],

    ['CP-CUO-003', async () => {
      const p = page()
      await gotoRegister(p)
      await p.getByTestId('transaction-form-amount').fill('60000')
      await p.getByTestId('transaction-form-next').click()
      await p.getByTestId('transaction-form-category-chip-otros').click()
      await p.getByTestId('transaction-form-account-chip-visa-bbva').click()
      await p.getByTestId('transaction-form-installments-chip-6').click()
      await p.getByTestId('transaction-form-account-chip-efectivo').click()
      await p.waitForTimeout(400)
      const selector = await exists(p, 'transaction-form-installments')
      const toast = await p.getByText('Las cuotas volvieron a 1').count()
      const ev = await shot(p, 'CP-CUO-003-reset-cuotas')
      await p.getByTestId('transaction-form-account-chip-visa-bbva').click()
      const back = await p.getByTestId('transaction-form-installments-chip-1').getAttribute('aria-pressed')
      const cat = await catalogOf(users.A.client)
      const { error } = await rpcCreate(users.A.client, { p_amount: '60000', p_installments_count: 6, p_category_id: cat.cat('Otros'), p_account_id: cat.acc('Efectivo'), p_occurred_on: TODAY })
      const ok = !selector && toast > 0 && back === 'true' && /I6/.test(error?.message ?? '')
      return { status: ok ? PASS : FAIL, obtained: `Con Efectivo el selector ${selector ? 'sigue visible' : 'desaparece'}; aviso "Las cuotas volvieron a 1": ${toast > 0 ? 'sí' : 'no'}; al volver a Visa queda en 1: ${back}. API 6 cuotas con cuenta cash: "${error?.message ?? 'ACEPTADO'}".`, evidence: [ev] }
    }],

    ['CP-CUO-004', async () => {
      const rows = ledger(ctx.cuo001)
      const amounts = rows.map((r) => r.split(':')[2])
      const sum = sql(`select sum(amount) || '|' || sum(amount_ars) from ledger_entries where transaction_id='${ctx.cuo001}'`)
      const ok = amounts.every((a) => a === '10000.00') && sum === '120000.00|120000.00'
      return { status: ok ? PASS : FAIL, obtained: `12 imputaciones de ${[...new Set(amounts)].join('/')}. Suma amount|amount_ars = ${sum}.` }
    }],

    ['CP-CUO-005', async () => {
      const p = page()
      const id = await uiRegister(p, { amount: '100000', category: 'Educación', account: 'Visa BBVA', installments: 3 }, { details: 'CP-CUO-005-resto-ultima-cuota' })
      const amounts = ledger(id).map((r) => r.split(':')[2])
      const sum = sql(`select sum(amount) from ledger_entries where transaction_id='${id}'`)
      const ok = amounts.join() === '33333.33,33333.33,33333.34' && sum === '100000.00'
      return { status: ok ? PASS : FAIL, obtained: `Cuotas: ${amounts.join(' + ')} = ${sum}.`, evidence: ['evidencia/CP-CUO-005-resto-ultima-cuota.jpg'] }
    }],

    ['CP-CUO-006', async () => {
      const p = page()
      await gotoRegister(p)
      await p.getByTestId('transaction-form-amount').fill('1200')
      await p.getByTestId('transaction-form-next').click()
      await p.getByTestId('transaction-form-category-chip-otros').click()
      await p.getByTestId('transaction-form-account-chip-visa-bbva').click()
      const chips = await p.getByTestId('transaction-form-installments').getByRole('button').allTextContents()
      const cat = await catalogOf(users.A.client)
      const lines = [`UI: la grilla ofrece ${chips.join(',')} (no hay forma de elegir 0 ni 13).`]
      let ok = chips.join() === '1,2,3,4,5,6,7,8,9,10,11,12'
      for (const [n, accept] of [[0, false], [1, true], [2, true], [12, true], [13, false]]) {
        const { error } = await rpcCreate(users.A.client, { p_amount: '1200', p_installments_count: n, p_category_id: cat.cat('Otros'), p_account_id: cat.acc('Visa BBVA'), p_occurred_on: TODAY })
        lines.push(`API ${n} cuotas → ${error ? `rechazado "${error.message}"` : 'aceptado'}`)
        if (accept === !!error) ok = false
      }
      return { status: ok ? PASS : FAIL, obtained: lines.join('\n') }
    }],

    ['CP-CUO-007', async () => {
      const p = ctx.pageD1
      await waitDashboard(p, '2026-09')
      const inherited = await text(p, 'dashboard-inherited-installments-amount')
      const total = await text(p, 'dashboard-total-expenses')
      const ev = await shot(p, 'CP-CUO-007-cuotas-heredadas')
      const ok = num(inherited) === 10000 && num(total) === 10000
      return { status: ok ? PASS : FAIL, obtained: `Dashboard 2026-09 de un usuario con solo la compra de agosto (12 × $10.000): total ${total}, cuotas de meses anteriores ${inherited}.`, evidence: [ev] }
    }],

    ['CP-CUO-008', async () => {
      const p = ctx.pageD1
      await p.goto(`${BASE}/transactions?period=2026-10`)
      await p.getByTestId('transactions-list').waitFor()
      const label = await text(p, 'transactions-item-installment')
      const ev = await shot(p, 'CP-CUO-008-numero-de-cuota')
      return { status: label === '3/12' ? PASS : FAIL, obtained: `En el listado de 2026-10 la imputación muestra "${label}".`, evidence: [ev] }
    }],

    ['CP-CUO-009', async () => {
      const p = page()
      const txId = ctx.cuo001
      const before = sql(`select count(*) from ledger_entries l join transactions t on t.id=l.transaction_id where t.id='${txId}' and t.deleted_at is null`)
      await p.goto(`${BASE}/transactions?period=${P0}`)
      await p.getByTestId('transactions-list').waitFor()
      await p.getByTestId('transactions-item').filter({ hasText: 'Heladera' }).getByTestId('transactions-item-delete').click()
      await p.getByTestId('delete-transaction-confirm').click()
      await p.getByTestId('delete-transaction-dialog').waitFor({ state: 'detached' })
      const future = addMonthsPeriod(P0, 6)
      await p.goto(`${BASE}/transactions?period=${future}`)
      await p.waitForFunction(() => !document.querySelector('[data-testid="transactions-loading"]'))
      const inFuture = await p.getByTestId('transactions-item').filter({ hasText: 'Heladera' }).count()
      const after = sql(`select count(*) from ledger_entries l join transactions t on t.id=l.transaction_id where t.id='${txId}' and t.deleted_at is null`)
      const ok = before === '12' && after === '0' && inFuture === 0
      return { status: ok ? PASS : FAIL, obtained: `Imputaciones que cuentan antes: ${before}; después: ${after}. En ${future} (cuota futura) ya no aparece: ${inFuture === 0 ? 'sí' : 'no'}.`, notes: 'No existe opción de borrar una cuota individual: el único botón elimina la compra entera.' }
    }],

    ['CP-CUO-010', async () => {
      const p = ctx.pageM
      const id = await uiRegister(p, { amount: '100', currency: 'USD', fx: '1250,5555', category: 'Otros', account: 'Tarjeta de crédito', installments: 3 })
      const tx = sql(`select amount_ars from transactions where id='${id}'`)
      const sum = sql(`select sum(amount_ars) || '|' || string_agg(amount_ars::text, ' + ' order by installment_number) from ledger_entries where transaction_id='${id}'`)
      const [s, parts] = sum.split('|')
      const ok = s === tx
      return { status: ok ? PASS : FAIL, obtained: `transactions.amount_ars = ${tx}; imputaciones ${parts} = ${s}.` }
    }],

    ['CP-CUO-011', async () => ctx.authorization('CUO')],

    ['CP-CUO-012', async () => {
      const p = page()
      await gotoRegister(p)
      await p.getByTestId('transaction-form-type-income').click()
      await p.getByTestId('transaction-form-amount').fill('90000')
      await p.getByTestId('transaction-form-next').click()
      await p.locator('[data-testid="transaction-form-step"][data-step="details"]').waitFor()
      await p.getByTestId('transaction-form-account-chip-visa-bbva').click()
      const selector = await exists(p, 'transaction-form-installments')
      const ev = await shot(p, 'CP-CUO-012-ingreso-sin-cuotas')
      const cat = await catalogOf(users.A.client)
      const { error } = await rpcCreate(users.A.client, { p_type: 'income', p_amount: '90000', p_installments_count: 3, p_category_id: null, p_account_id: cat.acc('Visa BBVA'), p_occurred_on: TODAY })
      const ok = !selector && /I6/.test(error?.message ?? '')
      return { status: ok ? PASS : FAIL, obtained: `Ingreso con Visa BBVA: selector de cuotas ${selector ? 'visible' : 'oculto'}. API ingreso en 3 cuotas: "${error?.message ?? 'ACEPTADO'}".`, evidence: [ev] }
    }],

    ['CP-CUO-013', async () => {
      const cat = await catalogOf(users.A.client)
      const count = () => sql(`select (select count(*) from transactions where user_id='${users.A.id}') || '|' || (select count(*) from ledger_entries where user_id='${users.A.id}')`)
      const before = count()
      // Pasa las validaciones iniciales, inserta la transacción y falla después, al calcular la cuota base.
      const { error } = await rpcCreate(users.A.client, { p_amount: '0.02', p_installments_count: 3, p_category_id: cat.cat('Otros'), p_account_id: cat.acc('Visa BBVA'), p_occurred_on: TODAY })
      const after = count()
      const ok = !!error && before === after
      return { status: ok ? PASS : FAIL, obtained: `create_transaction($0,02 en 3 cuotas) inserta la transacción y lanza "${error?.message}" antes de las imputaciones. Filas transactions|ledger_entries antes ${before}, después ${after}.`, notes: 'El fallo a mitad de camino se forzó con datos válidos para las primeras validaciones: la excepción ocurre después del INSERT en transactions y todo se revierte (C4).' }
    }],

    // ---------------- MON ----------------
    ['CP-MON-002', async () => {
      const p = ctx.pageM
      const cat = await catalogOf(ctx.users.M.client)
      const lines = []
      let ok = true
      // Filas 5 y 6: todavía no hay TC de referencia del mes.
      await gotoRegister(p)
      await p.getByTestId('transaction-form-amount').fill('100')
      await p.getByTestId('transaction-form-currency-usd').click()
      await p.getByTestId('transaction-form-fx-settings').waitFor()
      const nextDisabled = await p.getByTestId('transaction-form-next').isDisabled()
      const ev5 = await shot(p, 'CP-MON-002-fila5-sin-tc')
      lines.push(`Fila 5 (USD, sin referencia, sin TC): aviso "No tenés un tipo de cambio configurado", Siguiente deshabilitado: ${nextDisabled}`)
      if (!nextDisabled) ok = false
      const r5 = await rpcCreate(ctx.users.M.client, { p_currency: 'USD', p_fx_rate: null, p_amount: '100', p_category_id: cat.cat('Otros'), p_account_id: cat.acc('Efectivo'), p_occurred_on: TODAY })
      lines.push(`Fila 5 por API: ${r5.error ? `rechazada "${r5.error.message}"` : 'ACEPTADA'}`)
      if (!r5.error) ok = false
      const id6 = await uiRegister(p, { amount: '100', currency: 'USD', fx: '1300', category: 'Otros', account: 'Efectivo', description: 'fila 6' })
      const fx6 = sql(`select fx_rate from transactions where id='${id6}'`)
      lines.push(`Fila 6 (USD, sin referencia, TC 1300): guardada con fx_rate ${fx6}`)
      if (fx6 !== '1300.0000') ok = false
      // Se carga la referencia del mes y siguen las filas 1 a 4.
      await p.goto(`${BASE}/settings?period=${P0}`)
      await p.getByTestId('settings-fx-rate').fill('1250')
      await p.getByTestId('settings-fx-submit').click()
      await p.getByTestId('settings-fx-list').waitFor()
      const id1 = await uiRegister(p, { amount: '50000', category: 'Comida y supermercado', account: 'Efectivo', description: 'fila 1' })
      lines.push(`Fila 1 (ARS, sin TC): guardada, fx_rate ${sql(`select coalesce(fx_rate::text,'NULL') from transactions where id='${id1}'`)}`)
      await gotoRegister(p)
      const fxFieldInArs = await exists(p, 'transaction-form-fx-rate')
      const r2 = await rpcCreate(ctx.users.M.client, { p_currency: 'ARS', p_fx_rate: '1250', p_amount: '100', p_category_id: cat.cat('Otros'), p_account_id: cat.acc('Efectivo'), p_occurred_on: TODAY })
      lines.push(`Fila 2 (ARS con TC): la UI no ofrece el campo en ARS (${fxFieldInArs ? 'lo muestra' : 'no lo muestra'}); por API → ${r2.error ? `rechazada "${r2.error.message}"` : 'ACEPTADA'}`)
      if (fxFieldInArs || !r2.error) ok = false
      ctx.mon001 = await uiRegister(p, { amount: '100', currency: 'USD', category: 'Transporte', account: 'Tarjeta de crédito', description: 'fila 3' }, { amount: 'CP-MON-001-usd-tc-sugerido' })
      const fx3 = sql(`select fx_rate || '|' || amount_ars from transactions where id='${ctx.mon001}'`)
      lines.push(`Fila 3 (USD, referencia 1250, sin override): guardada con fx_rate|amount_ars ${fx3}`)
      if (fx3 !== '1250.0000|125000.00') ok = false
      const id4 = await uiRegister(p, { amount: '100', currency: 'USD', fx: '1300', category: 'Otros', account: 'Efectivo', description: 'fila 4' })
      const fx4 = sql(`select fx_rate from transactions where id='${id4}'`)
      lines.push(`Fila 4 (USD, referencia 1250, override 1300): guardada con fx_rate ${fx4}`)
      if (fx4 !== '1300.0000') ok = false
      ctx.mon002Done = true
      return { status: ok ? PASS : FAIL, obtained: lines.join('\n'), evidence: [ev5] }
    }],

    ['CP-MON-001', async () => {
      if (!ctx.mon001) return { status: BLOCK, obtained: 'Depende de la fila 3 de CP-MON-002, que no llegó a guardarse.' }
      const row = sql(`select fx_rate || '|' || amount_ars from transactions where id='${ctx.mon001}'`)
      return { status: row === '1250.0000|125000.00' ? PASS : FAIL, obtained: `USD 100 guardado sin tocar el TC: fx_rate|amount_ars = ${row}.`, evidence: ['evidencia/CP-MON-001-usd-tc-sugerido.jpg'], notes: 'Ejecutado dentro de la secuencia de CP-MON-002 (fila 3), con la referencia del mes en 1250.' }
    }],

    ['CP-MON-003', async () => {
      const p = ctx.pageM
      await gotoRegister(p)
      await p.getByTestId('transaction-form-amount').fill('100')
      await p.getByTestId('transaction-form-currency-usd').click()
      await p.waitForFunction(() => !document.querySelector('[data-testid="transaction-form-fx-loading"]'))
      const suggested = await p.getByTestId('transaction-form-fx-rate').inputValue()
      const evSug = await shot(p, 'CP-MON-003-tc-sugerido')
      await p.getByTestId('transaction-form-fx-rate').fill('1300')
      const status = await text(p, 'transaction-form-fx-rate-status')
      const ev = await shot(p, 'CP-MON-003-tc-pisado')
      const id = await uiRegister(p, { amount: '100', currency: 'USD', fx: '1300', category: 'Otros', account: 'Efectivo', description: 'override' })
      const fx = sql(`select fx_rate from transactions where id='${id}'`)
      const sugg = suggested.includes(',') ? num(suggested) : Number(suggested)
      const ok = sugg === 1250 && fx === '1300.0000'
      return { status: ok ? PASS : FAIL, obtained: `TC sugerido: "${suggested}". Al pisarlo: "${status}". Guardado con fx_rate ${fx}.`, evidence: [evSug, ev], notes: /\./.test(suggested) && !suggested.includes(',') ? `El valor sugerido se muestra como "${suggested}" (formato de la base, con punto y 4 decimales) en lugar del formato argentino que usa el resto de la app.` : '' }
    }],

    ['CP-MON-004', async () => {
      if (!ctx.mon001) return { status: BLOCK, obtained: 'No existe la transacción USD 100 @1250 de CP-MON-002.' }
      const p = ctx.pageM
      await waitDashboard(p, P0)
      const before = await text(p, 'dashboard-total-expenses')
      await p.goto(`${BASE}/settings?period=${P0}`)
      await p.getByTestId('settings-fx-rate').fill('1400')
      await p.getByTestId('settings-fx-submit').click()
      await p.waitForTimeout(1000)
      const ref = sql(`select ars_per_usd from fx_rates where user_id='${ctx.users.M.id}' and period='${P0}-01'`)
      const tx = sql(`select fx_rate || '|' || amount_ars from transactions where id='${ctx.mon001}'`)
      await waitDashboard(p, P0)
      const after = await text(p, 'dashboard-total-expenses')
      const ev = await shot(p, 'CP-MON-004-tc-congelado')
      const ok = ref === '1400.0000' && tx === '1250.0000|125000.00' && before === after
      return { status: ok ? PASS : FAIL, obtained: `Referencia del mes ahora ${ref}. La transacción sigue en fx_rate|amount_ars ${tx}. Total del dashboard antes ${before}, después ${after}.`, evidence: [ev] }
    }],

    ['CP-MON-005', async () => {
      const p = ctx.pageD2
      await waitDashboard(p, P0)
      const total = await text(p, 'dashboard-total-expenses')
      const ev = await shot(p, 'CP-MON-005-total-ars')
      return { status: num(total) === 175000 ? PASS : FAIL, obtained: `Con $50.000 ARS y USD 100 a 1250 en el mes, el total es ${total}.`, evidence: [ev] }
    }],

    ['CP-MON-006', async () => {
      const p = ctx.pageD2
      await waitDashboard(p, P0)
      const usd = (await exists(p, 'dashboard-total-usd')) ? await text(p, 'dashboard-total-usd') : ''
      return { status: /US\$100,00/.test(usd) ? PASS : FAIL, obtained: `Debajo del total: "${usd}".`, evidence: ['evidencia/CP-MON-005-total-ars.jpg'] }
    }],

    ['CP-MON-007', async () => ctx.authorization('MON')],

    // ---------------- DAS ----------------
    ['CP-DAS-001', async () => {
      const p = ctx.pageD2
      await p.goto(`${BASE}/dashboard`)
      await p.waitForFunction(() => !document.querySelector('[data-testid="dashboard-loading"]'))
      await p.waitForTimeout(500)
      const url = p.url().replace(BASE, '')
      const period = await p.getByTestId('dashboard-period').getAttribute('data-period')
      const total = await text(p, 'dashboard-total-expenses')
      return { status: period === P0 && num(total) === 175000 ? PASS : FAIL, obtained: `Sin tocar el selector: período ${period}, URL ${url}, total ${total}.` }
    }],

    ['CP-DAS-002', async () => {
      const p = ctx.pageD1
      await waitDashboard(p, '2026-09')
      await p.getByTestId('dashboard-period-next').click()
      await p.getByTestId('dashboard-period-next').click()
      await p.waitForTimeout(400)
      const url = p.url().replace(BASE, '')
      return { status: url.includes('period=2026-11') ? PASS : FAIL, obtained: `Tras dos toques en "→": ${url}.` }
    }],

    ['CP-DAS-003', async () => {
      const p = ctx.pageD1
      const lines = []
      let ok = true
      for (const q of ['?period=fecha-invalida', '']) {
        await p.goto(`${BASE}/dashboard${q}`)
        await p.waitForFunction(() => !document.querySelector('[data-testid="dashboard-loading"]'))
        await p.waitForTimeout(400)
        const url = p.url().replace(BASE, '')
        const err = await exists(p, 'dashboard-error')
        lines.push(`/dashboard${q} → ${url}; error visible: ${err ? 'sí' : 'no'}`)
        if (!url.endsWith(`period=${P0}`) || err) ok = false
      }
      return { status: ok ? PASS : FAIL, obtained: lines.join('\n') }
    }],

    ['CP-DAS-004', async () => {
      const p = ctx.pageD3
      await waitDashboard(p, P0)
      const rows = await p.getByTestId('dashboard-categories-list').locator('[role="listitem"]').allTextContents()
      const ev = await shot(p, 'CP-DAS-004-barras-categoria')
      const read = (name) => num(rows.find((r) => r.includes(name))?.match(/\$[\d.]+,\d\d/)?.[0] ?? 'x')
      const order = rows.map((r) => ['Salud', 'Comida', 'Transporte'].find((n) => r.includes(n)))
      const ok = rows.length === 3 && read('Salud') === 70000 && read('Comida') === 50000 && read('Transporte') === 30000 && order.join() === 'Salud,Comida,Transporte'
      return { status: ok ? PASS : FAIL, obtained: `Barras: ${rows.map((r) => r.replace(/\s+/g, ' ')).join(' | ')}. Orden: ${order.join(' > ')}.`, evidence: [ev] }
    }],

    ['CP-DAS-005', async () => {
      const p = ctx.pageD3
      await waitDashboard(p, P0)
      const rows = await p.getByTestId('dashboard-accounts-list').locator('[role="listitem"]').allTextContents()
      const read = (name) => num(rows.find((r) => r.includes(name))?.match(/\$[\d.]+,\d\d/)?.[0] ?? 'x')
      const ok = read('Efectivo') === 120000 && read('Tarjeta de débito') === 30000
      return { status: ok ? PASS : FAIL, obtained: `Por cuenta: ${rows.map((r) => r.replace(/\s+/g, ' ')).join(' | ')} (esperado Efectivo $120.000 = 50.000 + 70.000, Tarjeta de débito $30.000).`, evidence: ['evidencia/CP-DAS-004-barras-categoria.jpg'] }
    }],

    ['CP-DAS-006', async () => {
      const p = ctx.pageD3
      await waitDashboard(p, P0)
      const income = await text(p, 'dashboard-total-income')
      const balance = await text(p, 'dashboard-total-balance')
      const badge = await text(p, 'dashboard-balance-badge')
      const ev = await shot(p, 'CP-DAS-006-ingresos-balance')
      const ok = num(income) === 200000 && num(balance) === 50000
      return { status: ok ? PASS : FAIL, obtained: `Ingresos ${income}; balance ${balance} (${badge}).`, evidence: [ev] }
    }],

    ['CP-DAS-007', async () => {
      const p = ctx.pageD4
      await waitDashboard(p, P0)
      const balance = await text(p, 'dashboard-total-balance')
      const badge = await text(p, 'dashboard-balance-badge')
      const ev = await shot(p, 'CP-DAS-007-balance-negativo')
      const ok = balance.startsWith('-') && num(balance) === -150000
      return { status: ok ? PASS : FAIL, obtained: `Balance ${balance}, con etiqueta "${badge}".`, evidence: [ev] }
    }],

    ['CP-DAS-008', async () => {
      const p = ctx.pageD5
      await waitDashboard(p, P0)
      await p.getByTestId('dashboard-transactions-list').waitFor()
      const shown = await p.getByTestId('dashboard-transaction-item').count()
      const ev = await shot(p, 'CP-DAS-008-ultimas-10')
      await p.getByTestId('dashboard-transactions-view-all').click()
      await p.getByTestId('transactions-list').waitFor()
      const all = await p.getByTestId('transactions-item').count()
      const url = p.url().replace(BASE, '')
      const ok = shown === 10 && all === 15
      return { status: ok ? PASS : FAIL, obtained: `Con 15 transacciones en el mes, el dashboard muestra ${shown}; "Ver todos" lleva a ${url} con ${all}.`, evidence: [ev] }
    }],

    ['CP-DAS-009', async () => {
      const p = ctx.pageD1
      await waitDashboard(p, '2026-12')
      const days = (await exists(p, 'dashboard-days-count')) ? await text(p, 'dashboard-days-count') : '(no se muestra)'
      const total = (await exists(p, 'dashboard-total-expenses')) ? await text(p, 'dashboard-total-expenses') : ''
      const ev = await shot(p, 'CP-DAS-009-dias-con-registro')
      return { status: days === '0' ? PASS : FAIL, obtained: `Diciembre 2026, solo la cuota 5/12 heredada (total ${total}): días con registro = ${days}.`, evidence: [ev] }
    }],

    ['CP-DAS-010', async () => {
      const p = ctx.pageD1
      await waitDashboard(p, '2026-05')
      const empty = await exists(p, 'dashboard-empty')
      const msg = empty ? await text(p, 'dashboard-empty-message') : ''
      const ev = await shot(p, 'CP-DAS-010-estado-vacio')
      let dest = ''
      if (empty) {
        await p.getByTestId('dashboard-empty-register').click()
        await p.waitForURL(/\/register/)
        dest = p.url().replace(BASE, '')
      }
      const kpis = await exists(p, 'dashboard-total')
      return { status: empty && dest.startsWith('/register') && !kpis ? PASS : FAIL, obtained: `Estado vacío: "${msg}"; el botón lleva a ${dest}.`, evidence: [ev] }
    }],

    ['CP-DAS-011', async () => ctx.authorization('DAS')],

    // ---------------- US-68 (casos nuevos) ----------------
    ['CP-CFG-011', async () => {
      const c = await newContext(browser)
      const p = await c.newPage()
      const mail = email('us68')
      await p.goto(`${BASE}/signup`)
      await p.getByTestId('signup-form-email').fill(mail)
      await p.getByTestId('signup-form-password').fill('Clave123!')
      await p.getByTestId('signup-form-confirm-password').fill('Clave123!')
      await p.getByTestId('signup-form-submit').click()
      await p.waitForURL((u) => !u.pathname.startsWith('/signup'), { timeout: 15000 }).catch(() => {})
      await p.waitForTimeout(1000)
      const url = p.url().replace(BASE, '')
      const setup = await p.locator('[data-testid^="setup-"]').count()
      const ev = await shot(p, 'CP-CFG-011-sin-setup')
      await c.close()
      const ok = setup > 0
      return {
        status: ok ? PASS : FAIL,
        obtained: `Después de crear la cuenta la app va directo a ${url}. Elementos con data-testid "setup-": ${setup}. No aparece ninguna configuración inicial.`,
        evidence: [ev],
        defects: ok ? [] : ['DEF-017'],
      }
    }],
    ...['CP-CFG-012', 'CP-CFG-013', 'CP-CFG-014', 'CP-CFG-015'].map((id) => [id, async () => ({
      status: BLOCK,
      obtained: 'No se puede ejecutar: el flujo de configuración inicial no existe (CP-CFG-011 falló). No hay pasos que saltear, destildar ni reabrir desde Ajustes.',
      defects: ['DEF-017'],
    })]),
  ]
}

export { PASS, FAIL, BLOCK }
