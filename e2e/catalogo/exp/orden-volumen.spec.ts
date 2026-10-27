/// <reference lib="dom" />
// CP-EXP-039 a 042 · Orden de las filas y volumen sin faltantes (US-47 · CA-14, CA-15).
import { expect, test } from '@playwright/test'
import { createTransaction, createUser, downloadCsv, evidence, openExport, records, rest, scopeYear, seed } from './helpers'

test('CP-EXP-039 — Las filas se ordenan por fecha y creación', async ({ page }) => {
  const user = await createUser(page, '039')
  const idA = await createTransaction(user, { amount: '100.00', date: '2026-09-20' })
  const idB = await createTransaction(user, { amount: '200.00', date: '2026-09-10' })
  await test.step('S3 · esperar que el reloj avance un segundo', () => page.waitForTimeout(1100))
  const idC = await createTransaction(user, { amount: '300.00', date: '2026-09-10' })
  await test.step('S5 · EXP-PREP-05: created_at(B) < created_at(C)', async () => {
    const r = await rest<{ id: string; created_at: string }[]>(
      user,
      'GET',
      `transactions?select=id,created_at&id=in.(${idB},${idC})&order=created_at.asc`,
    )
    expect(r.status).toBe(200)
    expect(r.json.map((x) => x.id)).toEqual([idB, idC])
    expect(r.json[0].created_at < r.json[1].created_at).toBe(true)
  })
  await openExport(page, '2026-09')
  const csv = await downloadCsv(page)
  await evidence('csv', csv.bytes, 'text/csv')
  expect(records(csv).map((r) => r.id)).toEqual([idB, idC, idA])
})

for (const n of [1000, 1500, 2000] as const) {
  const caso = n === 1000 ? '040' : n === 1500 ? '041' : '042'
  test(`CP-EXP-${caso} — ${n.toLocaleString('es-AR')} transacciones se exportan sin faltantes`, async ({ page }) => {
    test.slow()
    const user = await createUser(page, caso)
    const ids = await test.step(`S2 · EXP-PREP-07 con N=${n}`, () => seed(user, n))
    await openExport(page, '2025-09')
    await scopeYear(page).click()
    await expect(scopeYear(page).locator('input')).toBeChecked()
    const csv = await test.step('15 · Descargar CSV', () => downloadCsv(page))
    await test.step(`El aviso dice «Exportamos ${n.toLocaleString('es-AR')} movimientos»`, async () => {
      await expect(page.getByTestId('transactions-export-success')).toHaveText(
        `Exportamos ${n.toLocaleString('es-AR')} movimientos`,
      )
    })
    await evidence('csv', csv.bytes, 'text/csv')
    const filas = records(csv)
    expect(csv.filename).toBe('biyu-movimientos-2025.csv')
    expect(filas).toHaveLength(n)
    expect(new Set(filas.map((f) => f.id)).size).toBe(n)
    expect([...filas.map((f) => f.id)].sort()).toEqual([...ids].sort())
    expect(new Set(filas.map((f) => f.descripcion)).size).toBe(n)
  })
}
