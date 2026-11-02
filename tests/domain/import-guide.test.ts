import { describe, expect, it } from 'vitest'
import { GUIDE_EXAMPLE_HEADERS, GUIDE_EXAMPLE_ROWS, GUIDE_STEPS } from '@/domain/importGuide'
import { templateSheets } from '@/domain/importFile'

// US-81 (#269): la tabla de ejemplo usa los encabezados de la plantilla (US-80 · CA-1).
describe('guía del archivo (US-81)', () => {
  it('tiene seis pasos', () => expect(GUIDE_STEPS).toHaveLength(6))

  it('los encabezados del ejemplo son los de la plantilla', () => {
    expect(GUIDE_EXAMPLE_HEADERS).toEqual(templateSheets()[0].rows[0])
  })

  it('cada fila de ejemplo tiene una celda por encabezado', () => {
    for (const row of GUIDE_EXAMPLE_ROWS) expect(row).toHaveLength(GUIDE_EXAMPLE_HEADERS.length)
  })
})
