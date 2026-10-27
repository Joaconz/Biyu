/// <reference lib="dom" />
// CP-EXP-009 a 016 · Bordes de fecha del mes y del año (US-47 · CA-5). Un gasto de $100,00 en la fecha
// del borde: dentro del período sale en el CSV; un día afuera, la hoja queda abierta con el aviso de Vacío.
import { expect, test } from '@playwright/test'
import { countDownloads, createTransaction, createUser, downloadCsv, evidence, openExport, records, scopeYear, submit } from './helpers'

const casos = [
  { id: '009', titulo: 'El primer día del mes se incluye', fecha: '2026-09-01', periodo: '2026-09', alcance: 'month', dentro: true },
  { id: '010', titulo: 'El último día del mes se incluye', fecha: '2026-09-30', periodo: '2026-09', alcance: 'month', dentro: true },
  { id: '011', titulo: 'El día anterior al mes se excluye', fecha: '2026-08-31', periodo: '2026-09', alcance: 'month', dentro: false },
  { id: '012', titulo: 'El día posterior al mes se excluye', fecha: '2026-10-01', periodo: '2026-09', alcance: 'month', dentro: false },
  { id: '013', titulo: 'El 1 de enero se incluye en el año', fecha: '2025-01-01', periodo: '2025-09', alcance: 'year', dentro: true },
  { id: '014', titulo: 'El 31 de diciembre se incluye en el año', fecha: '2025-12-31', periodo: '2025-09', alcance: 'year', dentro: true },
  { id: '015', titulo: 'El día anterior al año se excluye', fecha: '2024-12-31', periodo: '2025-09', alcance: 'year', dentro: false },
  { id: '016', titulo: 'El día posterior al año se excluye', fecha: '2026-01-01', periodo: '2025-09', alcance: 'year', dentro: false },
] as const

for (const c of casos) {
  test(`CP-EXP-${c.id} — ${c.titulo}`, async ({ page }) => {
    const user = await test.step('S1 · PR-01', () => createUser(page, c.id))
    const idA = await test.step(`S2 · EXP-PREP-01: gasto 100.00 el ${c.fecha}`, () =>
      createTransaction(user, { amount: '100.00', date: c.fecha }))
    await test.step(`10–13 · Abrir ${c.periodo} y la hoja`, () => openExport(page, c.periodo))
    if (c.alcance === 'year') {
      await test.step('14 · Elegir «Todo 2025»', async () => {
        await scopeYear(page).click()
        await expect(scopeYear(page).locator('input')).toBeChecked()
      })
    }
    if (c.dentro) {
      const csv = await test.step('Descargar CSV', () => downloadCsv(page))
      await evidence('csv', csv.bytes, 'text/csv')
      const rows = records(csv)
      expect(rows).toHaveLength(1)
      expect(rows[0]).toMatchObject({ fecha: c.fecha, id: idA })
    } else {
      const descargas = await countDownloads(page, async () => {
        await submit(page).click()
        const vacio = c.alcance === 'year' ? 'No tenés movimientos con fecha en 2025.' : 'No tenés movimientos con fecha en septiembre 2026.'
        await expect(page.getByTestId('transactions-export-empty')).toHaveText(vacio)
      })
      expect(descargas).toBe(0)
      await expect(page.getByTestId('transactions-export-dialog')).toBeVisible()
    }
  })
}
