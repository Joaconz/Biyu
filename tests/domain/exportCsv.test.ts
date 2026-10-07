import { describe, expect, it } from 'vitest'
import {
  buildExportCsv,
  compareExportRows,
  escapeCsvField,
  formatEmptyExportMessage,
  formatExportScopeLabel,
  formatSuccessExportMessage,
  getExportDateRange,
  getExportFileName,
  isExportAvailable,
  neutralizeCsvField,
  validateExportTransaction,
  type ExportTransactionRow,
} from '@/domain/exportCsv'

describe('getExportDateRange (ADR-029, CA-5)', () => {
  it('calcula extremos de mes correctamente incluyendo bisiestos', () => {
    expect(getExportDateRange('month', { year: 2026, month: 9 })).toEqual({
      startDate: '2026-09-01',
      endDate: '2026-09-30',
    })
    expect(getExportDateRange('month', { year: 2026, month: 2 })).toEqual({
      startDate: '2026-02-01',
      endDate: '2026-02-28',
    })
    expect(getExportDateRange('month', { year: 2024, month: 2 })).toEqual({
      startDate: '2024-02-01',
      endDate: '2024-02-29',
    })
    expect(getExportDateRange('month', { year: 2026, month: 12 })).toEqual({
      startDate: '2026-12-01',
      endDate: '2026-12-31',
    })
    expect(getExportDateRange('month', { year: 2026, month: 1 })).toEqual({
      startDate: '2026-01-01',
      endDate: '2026-01-31',
    })
  })

  it('calcula extremos de año completo', () => {
    expect(getExportDateRange('year', { year: 2026, month: 9 })).toEqual({
      startDate: '2026-01-01',
      endDate: '2026-12-31',
    })
  })
})

describe('getExportFileName (CA-3, CA-4, ADR-029)', () => {
  it('mes usa biyu-movimientos-AAAA-MM.csv', () => {
    expect(getExportFileName('month', { year: 2026, month: 9 })).toBe(
      'biyu-movimientos-2026-09.csv',
    )
    expect(getExportFileName('month', { year: 2026, month: 12 })).toBe(
      'biyu-movimientos-2026-12.csv',
    )
  })

  it('año usa biyu-movimientos-AAAA.csv', () => {
    expect(getExportFileName('year', { year: 2026, month: 9 })).toBe(
      'biyu-movimientos-2026.csv',
    )
  })
})

describe('isExportAvailable (CA-2)', () => {
  const today = new Date(2026, 8, 15) // Septiembre 2026 (mes 8 en Date de JS)

  it('permite mes actual y meses pasados', () => {
    expect(isExportAvailable({ year: 2026, month: 9 }, today)).toBe(true)
    expect(isExportAvailable({ year: 2026, month: 8 }, today)).toBe(true)
    expect(isExportAvailable({ year: 2025, month: 12 }, today)).toBe(true)
  })

  it('rechaza meses futuros', () => {
    expect(isExportAvailable({ year: 2026, month: 10 }, today)).toBe(false)
    expect(isExportAvailable({ year: 2027, month: 1 }, today)).toBe(false)
  })
})

describe('formatExportScopeLabel (CA-1)', () => {
  it('formatea las dos opciones según el período', () => {
    expect(formatExportScopeLabel('month', { year: 2026, month: 9 })).toBe(
      'Solo septiembre 2026',
    )
    expect(formatExportScopeLabel('year', { year: 2026, month: 9 })).toBe('Todo 2026')
  })
})

describe('formatEmptyExportMessage (CA-20)', () => {
  it('formatea mensaje de vacío para mes y año con punto final', () => {
    expect(formatEmptyExportMessage('month', { year: 2026, month: 9 })).toBe(
      'No tenés movimientos con fecha en septiembre 2026.',
    )
    expect(formatEmptyExportMessage('year', { year: 2026, month: 9 })).toBe(
      'No tenés movimientos con fecha en 2026.',
    )
  })
})

describe('formatSuccessExportMessage (CA-15, CA-19)', () => {
  it('formatea singular con 1 movimiento', () => {
    expect(formatSuccessExportMessage(1)).toBe('Exportamos 1 movimiento')
  })

  it('formatea plural con punto de miles desde 1.000', () => {
    expect(formatSuccessExportMessage(2)).toBe('Exportamos 2 movimientos')
    expect(formatSuccessExportMessage(1000)).toBe('Exportamos 1.000 movimientos')
    expect(formatSuccessExportMessage(1500)).toBe('Exportamos 1.500 movimientos')
    expect(formatSuccessExportMessage(2000)).toBe('Exportamos 2.000 movimientos')
  })
})

describe('neutralizeCsvField (CA-13, ADR-029)', () => {
  it('agrega apóstrofo si empieza con =, +, -, @, \\t o \\r', () => {
    expect(neutralizeCsvField('=1+1')).toBe("'=1+1")
    expect(neutralizeCsvField('-5, promo')).toBe("'-5, promo")
    expect(neutralizeCsvField('\tcafé')).toBe("'\tcafé")
    expect(neutralizeCsvField('\rnota')).toBe("'\rnota")
    expect(neutralizeCsvField('+100')).toBe("'+100")
    expect(neutralizeCsvField('@admin')).toBe("'@admin")
  })

  it('no modifica textos normales ni espacios', () => {
    expect(neutralizeCsvField('Supermercado')).toBe('Supermercado')
    expect(neutralizeCsvField('  con espacios  ')).toBe('  con espacios  ')
    expect(neutralizeCsvField('')).toBe('')
  })
})

describe('escapeCsvField (CA-12, ADR-029)', () => {
  it('entrecomilla solo si contiene coma, comilla doble, CR o LF, y duplica comillas', () => {
    expect(escapeCsvField('Supermercado')).toBe('Supermercado')
    expect(escapeCsvField('Pizza "a la piedra"')).toBe('"Pizza ""a la piedra"""')
    expect(escapeCsvField("'-5, promo")).toBe('"\' -5, promo"'.replace(' ', '')) // "' -5, promo"
    expect(escapeCsvField("'-5, promo")).toBe('"\' -5, promo"'.replace(' -', '-'))
    expect(escapeCsvField("'-5, promo")).toBe('"\' -5, promo"'.slice(0, 1) + "'-5, promo\"")
    expect(escapeCsvField("'-5, promo")).toBe('"\' -5, promo"'.replace('\' ', '\''))
    expect(escapeCsvField("'\tcafé")).toBe("'\tcafé")
    expect(escapeCsvField("'\rnota")).toBe("\"'\rnota\"")
    expect(escapeCsvField('Línea 1\r\nLínea 2')).toBe('"Línea 1\r\nLínea 2"')
  })
})

describe('validateExportTransaction (CA-10, CA-11)', () => {
  const baseValid: ExportTransactionRow = {
    id: '0b6e2a4c-1d3f-4e5a-8b7c-9d0e1f2a3b4c',
    type: 'expense',
    amount: '1200.00',
    currency: 'ARS',
    fx_rate: null,
    amount_ars: '1200.00',
    installments_count: 1,
    occurred_on: '2026-08-15',
    first_period: '2026-08-01',
    description: 'Compra',
    created_at: '2026-08-15T12:00:00Z',
    category_name: 'Comida',
    account_name: 'Efectivo',
  }

  it('acepta transacciones válidas en ARS y USD', () => {
    expect(validateExportTransaction(baseValid)).toBe(true)

    const usdValid: ExportTransactionRow = {
      ...baseValid,
      currency: 'USD',
      fx_rate: '1250.5000',
      amount_ars: '375150.00',
      amount: '300.00',
    }
    expect(validateExportTransaction(usdValid)).toBe(true)
  })

  it('rechaza montos que no tienen exactamente 2 decimales', () => {
    expect(validateExportTransaction({ ...baseValid, amount: '1200' })).toBe(false)
    expect(validateExportTransaction({ ...baseValid, amount: '1200.5' })).toBe(false)
    expect(validateExportTransaction({ ...baseValid, amount: '-1200.00' })).toBe(false)
    expect(validateExportTransaction({ ...baseValid, amount_ars: '1200.5' })).toBe(false)
  })

  it('rechaza USD con tipo de cambio faltante o que no tiene 4 decimales', () => {
    expect(validateExportTransaction({ ...baseValid, currency: 'USD', fx_rate: null })).toBe(
      false,
    )
    expect(
      validateExportTransaction({ ...baseValid, currency: 'USD', fx_rate: '1250.5' }),
    ).toBe(false)
    expect(
      validateExportTransaction({ ...baseValid, currency: 'USD', fx_rate: '1250' }),
    ).toBe(false)
  })
})

describe('compareExportRows (CA-14)', () => {
  it('ordena por occurred_on, created_at e id ascendentes', () => {
    const r1: ExportTransactionRow = {
      id: 'b-uuid-1',
      occurred_on: '2026-08-15',
      created_at: '2026-08-15T10:00:00Z',
    } as ExportTransactionRow
    const r2: ExportTransactionRow = {
      id: 'a-uuid-2',
      occurred_on: '2026-08-15',
      created_at: '2026-08-15T10:00:00Z',
    } as ExportTransactionRow
    const r3: ExportTransactionRow = {
      id: 'c-uuid-3',
      occurred_on: '2026-08-16',
      created_at: '2026-08-15T09:00:00Z',
    } as ExportTransactionRow

    const rows = [r3, r1, r2]
    rows.sort(compareExportRows)
    expect(rows).toEqual([r2, r1, r3])
  })
})

describe('buildExportCsv (CA-8, CA-9, CA-10, CA-12, CA-13, CA-14, CA-17)', () => {
  it('construye el CSV canónico exacto con BOM UTF-8 y CRLF', () => {
    const rows: ExportTransactionRow[] = [
      {
        id: '0b6e2a4c-1d3f-4e5a-8b7c-9d0e1f2a3b4c',
        type: 'income',
        amount: '850000.00',
        currency: 'ARS',
        fx_rate: null,
        amount_ars: '850000.00',
        installments_count: 1,
        occurred_on: '2026-08-01',
        first_period: '2026-08-01',
        description: 'Sueldo agosto',
        created_at: '2026-08-01T08:00:00Z',
        category_name: null, // Ingreso sin categoría (CA-17)
        account_name: 'Caja de ahorro',
      },
      {
        id: '3f1c5b7d-2e4a-4c6b-9d8e-0a1b2c3d4e5f',
        type: 'expense',
        amount: '300.00',
        currency: 'USD',
        fx_rate: '1250.5000',
        amount_ars: '375150.00',
        installments_count: 3,
        occurred_on: '2026-08-15',
        first_period: '2026-08-01',
        description: 'Heladera, 3 cuotas',
        created_at: '2026-08-15T09:00:00Z',
        category_name: 'Hogar',
        account_name: 'Visa BBVA',
      },
      {
        id: '9a42c6e8-3f5b-4d7c-8e9f-1a2b3c4d5e6f',
        type: 'expense',
        amount: '4500.00',
        currency: 'ARS',
        fx_rate: null,
        amount_ars: '4500.00',
        installments_count: 1,
        occurred_on: '2026-08-20',
        first_period: '2026-08-01',
        description: 'Pizza "a la piedra"',
        created_at: '2026-08-20T21:00:00Z',
        category_name: 'Salidas',
        account_name: 'Efectivo',
      },
      {
        id: 'c7d8e9f0-4a5b-4c6d-8e7f-2b3c4d5e6f70',
        type: 'expense',
        amount: '12000.00',
        currency: 'ARS',
        fx_rate: null,
        amount_ars: '12000.00',
        installments_count: 1,
        occurred_on: '2026-08-28',
        first_period: '2026-08-01',
        description: '-5, promo',
        created_at: '2026-08-28T18:00:00Z',
        category_name: 'Supermercado',
        account_name: 'Débito Galicia',
      },
    ]

    const csv = buildExportCsv(rows)

    // CA-8: Empieza con BOM (\uFEFF -> bytes EF BB BF en UTF-8)
    expect(csv.startsWith('\uFEFF')).toBe(true)

    // Conversión a bytes UTF-8 verifica los primeros 3 bytes EF BB BF
    const bytes = Buffer.from(csv, 'utf8')
    expect(bytes[0]).toBe(0xef)
    expect(bytes[1]).toBe(0xbb)
    expect(bytes[2]).toBe(0xbf)

    // Líneas con CRLF (\r\n)
    const lines = csv.slice(1).split('\r\n')
    expect(lines.length).toBe(6) // Header + 4 filas + última vacía por CRLF final
    expect(lines[5]).toBe('')

    // Encabezado exacto
    expect(lines[0]).toBe(
      'fecha,tipo,monto,moneda,tipo_de_cambio,monto_ars,categoria,cuenta,cuotas,primer_periodo,descripcion,id',
    )

    // Filas coinciden exactamente con el ejemplo del issue / ADR-029
    expect(lines[1]).toBe(
      '2026-08-01,ingreso,850000.00,ARS,,850000.00,,Caja de ahorro,1,2026-08,Sueldo agosto,0b6e2a4c-1d3f-4e5a-8b7c-9d0e1f2a3b4c',
    )
    expect(lines[2]).toBe(
      '2026-08-15,gasto,300.00,USD,1250.5000,375150.00,Hogar,Visa BBVA,3,2026-08,"Heladera, 3 cuotas",3f1c5b7d-2e4a-4c6b-9d8e-0a1b2c3d4e5f',
    )
    expect(lines[3]).toBe(
      '2026-08-20,gasto,4500.00,ARS,,4500.00,Salidas,Efectivo,1,2026-08,"Pizza ""a la piedra""",9a42c6e8-3f5b-4d7c-8e9f-1a2b3c4d5e6f',
    )
    expect(lines[4]).toBe(
      '2026-08-28,gasto,12000.00,ARS,,12000.00,Supermercado,Débito Galicia,1,2026-08,"\'-5, promo",c7d8e9f0-4a5b-4c6d-8e7f-2b3c4d5e6f70',
    )
  })
})
