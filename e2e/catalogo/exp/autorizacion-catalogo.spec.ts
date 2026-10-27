/// <reference lib="dom" />
// CP-EXP-043 a 048 · Autorización (RLS) y datos del catálogo (US-47 · CA-16, CA-17, CA-20).
import { expect, test } from '@playwright/test'
import {
  ARCHIVE,
  countDownloads,
  createAccount,
  createCategory,
  createTransaction,
  createUser,
  deleteAccount,
  downloadCsv,
  evidence,
  openExport,
  patchCatalog,
  records,
  rest,
  submit,
} from './helpers'

test('CP-EXP-043 — El CSV de A no contiene movimientos de B', async ({ page, browser }) => {
  const a = await test.step('S1 · PR-05: usuario A', () => createUser(page, '043', 0))
  const ctxB = await browser.newContext()
  const b = await test.step('S1 · PR-05: usuario B (otra sesión)', async () => createUser(await ctxB.newPage(), '043', 1))
  const idA = await createTransaction(a, { amount: '111.00', date: '2026-09-15', description: 'SOLO-A' })
  const idB = await createTransaction(b, { amount: '999.00', date: '2026-09-15', description: 'SOLO-B' })
  await openExport(page, '2026-09')
  const csv = await test.step('14 · Descargar CSV con la sesión de A', () => downloadCsv(page))
  await evidence('csv', csv.bytes, 'text/csv')
  const filas = records(csv)
  expect(filas).toHaveLength(1)
  expect(filas[0]).toMatchObject({ monto: '111.00', descripcion: 'SOLO-A', id: idA })
  for (const ajeno of ['999.00', 'SOLO-B', idB]) expect(csv.text).not.toContain(ajeno)
  await ctxB.close()
})

test('CP-EXP-044 — La API con token de A devuelve cero filas de B', async ({ page, browser }) => {
  const a = await createUser(page, '044', 0)
  const ctxB = await browser.newContext()
  const b = await createUser(await ctxB.newPage(), '044', 1)
  const idB = await test.step('S2 · EXP-PREP-01 con el token de B', () =>
    createTransaction(b, { amount: '999.00', date: '2026-09-15' }))
  const r = await test.step('1 · GET transactions con el token de A', () =>
    rest(a, 'GET', 'transactions?select=id,amount&occurred_on=gte.2026-09-01&occurred_on=lt.2026-10-01&deleted_at=is.null'))
  expect(r.status).toBe(200)
  expect(r.text).toBe('[]')
  expect(r.text).not.toContain(idB)
  expect(r.text).not.toContain('999')
  await ctxB.close()
})

test('CP-EXP-045 — Categoría archivada sale con el nombre actual', async ({ page }) => {
  const user = await createUser(page, '045')
  const catId = await test.step('S2 · EXP-PREP-03: crear «Viajes»', () => createCategory(user, 'Viajes'))
  const idA = await test.step('S3 · EXP-PREP-01', () =>
    createTransaction(user, { amount: '100.00', date: '2026-09-15', category: 'Viajes' }))
  await test.step('S4 · EXP-PREP-03: renombrar a «Viajes 2026» y archivar', async () => {
    await patchCatalog(user, 'categories', catId, { name: 'Viajes 2026' })
    await patchCatalog(user, 'categories', catId, ARCHIVE)
  })
  await openExport(page, '2026-09')
  const csv = await downloadCsv(page)
  await evidence('csv', csv.bytes, 'text/csv')
  const fila = records(csv)[0]
  expect(fila).toMatchObject({ id: idA, categoria: 'Viajes 2026' })
  expect(csv.text).not.toMatch(/,Viajes,/)
})

test('CP-EXP-046 — Cuenta archivada sale con el nombre actual', async ({ page }) => {
  const user = await createUser(page, '046')
  const accId = await test.step('S2 · EXP-PREP-03: crear «Billetera QA»', () => createAccount(user, 'Billetera QA'))
  const idA = await test.step('S3 · EXP-PREP-01', () =>
    createTransaction(user, { amount: '100.00', date: '2026-09-15', account: 'Billetera QA' }))
  await test.step('S4 · EXP-PREP-03: renombrar a «Billetera QA 2026» y archivar', async () => {
    await patchCatalog(user, 'accounts', accId, { name: 'Billetera QA 2026' })
    await patchCatalog(user, 'accounts', accId, ARCHIVE)
  })
  await openExport(page, '2026-09')
  const csv = await downloadCsv(page)
  await evidence('csv', csv.bytes, 'text/csv')
  expect(records(csv)[0]).toMatchObject({ id: idA, cuenta: 'Billetera QA 2026' })
  expect(csv.text).not.toMatch(/,Billetera QA,/)
})

test('CP-EXP-047 — Un ingreso exporta categoría vacía', async ({ page }) => {
  const user = await createUser(page, '047')
  // Desvío de preparación: el caso usa la cuenta «Caja de ahorro», que no viene en el catálogo inicial.
  await test.step('S2 · EXP-PREP-03: crear la cuenta «Caja de ahorro»', () => createAccount(user, 'Caja de ahorro'))
  const idA = await test.step('S2 · EXP-PREP-01: ingreso de 850000.00 el 2026-09-01', () =>
    createTransaction(user, {
      type: 'income',
      amount: '850000.00',
      category: null,
      account: 'Caja de ahorro',
      date: '2026-09-01',
    }))
  await openExport(page, '2026-09')
  const csv = await downloadCsv(page)
  await evidence('csv', csv.bytes, 'text/csv')
  expect(records(csv)[0]).toMatchObject({ id: idA, tipo: 'ingreso', categoria: '' })
  expect(csv.text).toContain(`,850000.00,ARS,,850000.00,,Caja de ahorro,1,2026-09,,${idA}\r\n`)
})

test('CP-EXP-048 — Eliminar una cuenta quita su transacción', async ({ page }) => {
  const user = await createUser(page, '048')
  const accId = await test.step('S2 · EXP-PREP-03: crear «Cuenta descartable»', () => createAccount(user, 'Cuenta descartable'))
  const idA = await test.step('S3 · EXP-PREP-01', () =>
    createTransaction(user, { amount: '700.00', date: '2026-09-15', account: 'Cuenta descartable' }))
  await test.step('S4 · EXP-PREP-06: eliminar la cuenta', async () => {
    expect(await deleteAccount(user, accId)).toBe(1)
    expect((await rest(user, 'GET', `accounts?id=eq.${accId}`)).text).toBe('[]')
    expect((await rest(user, 'GET', `transactions?id=eq.${idA}`)).text).toBe('[]')
  })
  await openExport(page, '2026-09')
  const descargas = await countDownloads(page, async () => {
    await submit(page).click()
    await expect(page.getByTestId('transactions-export-empty')).toHaveText(
      'No tenés movimientos con fecha en septiembre 2026.',
    )
  })
  expect(descargas).toBe(0)
})
