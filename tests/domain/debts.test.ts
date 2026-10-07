import { describe, expect, it } from 'vitest'
import {
  argentinaDateOf,
  debtNetText,
  debtOriginText,
  debtRowText,
  debtTotals,
  debtUpdateErrorReason,
  isStaleDebtError,
  reopenedNoticeText,
  settledNoticeText,
  debtsForFilter,
  emptyDebtsMessage,
  parseDebtDirectionFilter,
  parseDebtStatusFilter,
  type DebtRecord,
} from '@/domain/debts'
import { Decimal } from '@/domain/money'

const debt = (over: Partial<DebtRecord>): DebtRecord => ({
  id: 'd',
  person: 'Sofía',
  direction: 'owed_to_me',
  amount: '60000.00',
  amountArs: '60000.00',
  currency: 'ARS',
  incurredOn: '2026-08-15',
  notes: null,
  status: 'pending',
  settledAt: null,
  createdAt: '2026-08-15T12:00:00.000000+00:00',
  transactionId: null,
  linkedTransactionDeleted: false,
  origin: null,
  ...over,
})

describe('filtro de Deudas en la URL (US-38, C11)', () => {
  it.each([
    [null, 'pending'],
    ['pending', 'pending'],
    ['settled', 'settled'],
    ['all', 'all'],
    ['xyz', 'pending'],
    ['', 'pending'],
    ['SETTLED', 'pending'],
  ] as const)('?status=%j se lee como %s (CA-1, CA-4)', (param, filter) =>
    expect(parseDebtStatusFilter(param)).toBe(filter))
})

describe('qué se lista y en qué orden (US-38)', () => {
  const pending = debt({ id: 'p', status: 'pending' })
  const settled = debt({ id: 's', status: 'settled', settledAt: '2026-08-20T15:00:00+00:00' })

  it('cada filtro muestra solo su estado; "Todas", los dos (CA-1, CA-2)', () => {
    expect(debtsForFilter([pending, settled], 'pending').map((d) => d.id)).toEqual(['p'])
    expect(debtsForFilter([pending, settled], 'settled').map((d) => d.id)).toEqual(['s'])
    expect(debtsForFilter([pending, settled], 'all').map((d) => d.id).sort()).toEqual(['p', 's'])
  })

  it('una deuda de un gasto con baja lógica no aparece; una suelta o de un gasto activo, sí (ADR-037 §4)', () => {
    const list = [
      debt({ id: 'suelta' }),
      debt({ id: 'activo', transactionId: 't1' }),
      debt({ id: 'borrado', transactionId: 't2', linkedTransactionDeleted: true }),
    ]
    for (const filter of ['pending', 'all'] as const) {
      expect(debtsForFilter(list, filter).map((d) => d.id).sort()).toEqual(['activo', 'suelta'])
    }
  })

  it('pendientes: fecha más reciente primero; a igual fecha, la cargada después (CA-5)', () => {
    const list = [
      debt({ id: 'oct-antes', incurredOn: '2026-10-01', createdAt: '2026-10-01T10:00:00.123456+00:00' }),
      debt({ id: 'ago', incurredOn: '2026-08-15', createdAt: '2026-10-02T10:00:00+00:00' }),
      debt({ id: 'oct-despues', incurredOn: '2026-10-01', createdAt: '2026-10-01T10:00:00.124+00:00' }),
    ]
    expect(debtsForFilter(list, 'pending').map((d) => d.id)).toEqual(['oct-despues', 'oct-antes', 'ago'])
    expect(debtsForFilter(list, 'all').map((d) => d.id)).toEqual(['oct-despues', 'oct-antes', 'ago'])
  })

  it('saldadas: la saldada más recientemente primero, sin importar la fecha de la deuda (CA-5)', () => {
    const list = [
      debt({ id: 'vieja-saldada-hoy', status: 'settled', incurredOn: '2026-01-10', settledAt: '2026-10-06T12:00:00+00:00' }),
      debt({ id: 'nueva-saldada-antes', status: 'settled', incurredOn: '2026-09-02', settledAt: '2026-09-10T12:00:00+00:00' }),
    ]
    expect(debtsForFilter(list, 'settled').map((d) => d.id)).toEqual(['vieja-saldada-hoy', 'nueva-saldada-antes'])
  })

  it('no modifica la lista que recibe', () => {
    const list = [debt({ id: 'a', incurredOn: '2026-01-01' }), debt({ id: 'b', incurredOn: '2026-02-01' })]
    debtsForFilter(list, 'pending')
    expect(list.map((d) => d.id)).toEqual(['a', 'b'])
  })
})

describe('textos de la fila (US-38 CA-6)', () => {
  it('deuda en pesos que te deben, pendiente, sin nota', () => {
    expect(debtRowText(debt({}))).toEqual({
      person: 'Sofía',
      direction: 'Te debe',
      amount: '$60.000,00',
      amountArs: null,
      date: '15/08/2026',
      origin: 'Deuda suelta',
      notes: null,
      status: 'Pendiente',
    })
  })
  it('deuda en US$ que debés, con nota: monto en dólares y su equivalente en pesos', () => {
    const text = debtRowText(
      debt({ direction: 'i_owe', currency: 'USD', amount: '40.00', amountArs: '50000.00', notes: 'Préstamo en efectivo' }),
    )
    expect(text).toMatchObject({ direction: 'Le debés', amount: 'US$40,00', amountArs: '≈ $50.000,00', notes: 'Préstamo en efectivo' })
  })
  it('saldada: la fecha de saldada es la de Argentina, no la de UTC', () => {
    // 01:30 UTC del 21/08 son las 22:30 del 20/08 en Argentina (UTC−3).
    expect(debtRowText(debt({ status: 'settled', settledAt: '2026-08-21T01:30:00+00:00' })).status).toBe('Saldada el 20/08/2026')
    expect(argentinaDateOf('2026-08-21T03:00:00.000001+00:00')).toBe('2026-08-21')
  })
})

describe('origen de la deuda (US-35)', () => {
  it('vinculada: categoría, total de la compra en su moneda y fecha del gasto (CA-2)', () => {
    expect(debtOriginText({ categoryName: 'Tecnología', amount: '120000.00', currency: 'ARS', occurredOn: '2026-08-15' })).toBe(
      'Gasto compartido: Tecnología, $120.000,00 del 15/08/2026',
    )
    expect(debtOriginText({ categoryName: 'Viajes', amount: '100.00', currency: 'USD', occurredOn: '2026-09-01' })).toBe(
      'Gasto compartido: Viajes, US$100,00 del 01/09/2026',
    )
  })
  it('suelta (CA-2)', () => expect(debtOriginText(null)).toBe('Deuda suelta'))
  it('sin nombre de categoría (no debería pasar, I8): solo monto y fecha', () =>
    expect(debtOriginText({ categoryName: null, amount: '500.00', currency: 'ARS', occurredOn: '2026-08-15' })).toBe(
      'Gasto compartido: $500,00 del 15/08/2026',
    ))
  it('la fila la incluye', () => {
    const origin = { categoryName: 'Tecnología', amount: '120000.00', currency: 'ARS' as const, occurredOn: '2026-08-15' }
    expect(debtRowText(debt({ transactionId: 't', origin })).origin).toBe('Gasto compartido: Tecnología, $120.000,00 del 15/08/2026')
  })
})

describe('estado vacío de cada filtro (US-38 CA-7)', () => {
  it.each([
    ['pending', 'No tenés deudas pendientes.', true],
    ['settled', 'Todavía no saldaste ninguna deuda.', false],
    ['all', 'No cargaste ninguna deuda todavía.', true],
  ] as const)('%s', (filter, message, offerNew) => expect(emptyDebtsMessage(filter)).toEqual({ message, offerNew }))
})

describe('totales de Deudas (US-37, ADR-037 §5)', () => {
  const sofia = debt({ id: 'sofia', amount: '60000.00', amountArs: '60000.00' })
  const juan = debt({ id: 'juan', person: 'Juan', currency: 'USD', amount: '40.00', amountArs: '50000.00' })
  const ana = debt({ id: 'ana', person: 'Ana', direction: 'i_owe', amount: '15000.00', amountArs: '15000.00' })
  const pedro = debt({
    id: 'pedro', person: 'Pedro', amount: '8000.00', amountArs: '8000.00',
    status: 'settled', settledAt: '2026-09-10T12:00:00+00:00',
  })
  const text = (debts: DebtRecord[]) => {
    const t = debtTotals(debts)
    return [t.owedToMe.toFixed(2), t.iOwe.toFixed(2), debtNetText(t.net)]
  }

  it('CA-1: suma las pendientes en pesos con el amount_ars de cada una; la saldada no suma', () =>
    expect(text([sofia, juan, ana, pedro])).toEqual(['110000.00', '15000.00', 'A tu favor $95.000,00']))

  it('CA-2: neto negativo, sin signo', () =>
    expect(text([ana, debt({ amount: '10000.00', amountArs: '10000.00' })])).toEqual(['10000.00', '15000.00', 'En contra $5.000,00']))

  it('CA-3: iguales o sin pendientes, "En cero"; sin pendientes, los dos en cero', () => {
    expect(text([ana, debt({ amount: '15000.00', amountArs: '15000.00' })])[2]).toBe('En cero')
    expect(text([])).toEqual(['0.00', '0.00', 'En cero'])
    expect(text([pedro])).toEqual(['0.00', '0.00', 'En cero'])
  })

  it('CA-6: usa el amount_ars congelado de la deuda, no un TC de referencia (C5)', () =>
    expect(debtTotals([juan]).owedToMe.toFixed(2)).toBe('50000.00'))

  it('CA-7: la deuda de un gasto eliminado no suma; la de un gasto activo, sí', () =>
    expect(text([
      debt({ id: 'activo', transactionId: 't1' }),
      debt({ id: 'borrado', transactionId: 't2', direction: 'i_owe', linkedTransactionDeleted: true }),
    ])).toEqual(['60000.00', '0.00', 'A tu favor $60.000,00']))

  it('suma sin pasar por number: centavos que en float darían 0,30000000000000004', () =>
    expect(debtTotals([debt({ amountArs: '0.10' }), debt({ amountArs: '0.20' })]).owedToMe.toFixed()).toBe('0.3'))

  it.each([
    ['0', 'En cero'],
    ['0.01', 'A tu favor $0,01'],
    ['-0.01', 'En contra $0,01'],
    ['-1234567.89', 'En contra $1.234.567,89'],
  ])('neto %s → %s', (net, expected) => expect(debtNetText(new Decimal(net))).toBe(expected))
})

describe('saldar una deuda (US-39)', () => {
  it('aviso de éxito con la persona', () => expect(settledNoticeText('Sofía')).toBe('Deuda con Sofía saldada'))

  it('el motivo es el mensaje de Postgres; un error de red o sin mensaje, uno genérico (CA-5)', () => {
    expect(debtUpdateErrorReason({ code: '23514', message: 'La deuda ya está saldada' })).toBe('La deuda ya está saldada')
    expect(debtUpdateErrorReason({ code: '', message: 'TypeError: Failed to fetch' })).toBe('Probá de nuevo en un momento')
    expect(debtUpdateErrorReason({ code: '23514', message: '' })).toBe('Probá de nuevo en un momento')
    expect(debtUpdateErrorReason(null)).toBe('Probá de nuevo en un momento')
  })

  it.each([
    ['La deuda ya está saldada', true],
    ['La deuda no existe', true],
    ['Probá de nuevo en un momento', false],
    ['La deuda ya está pendiente', false],
  ])('al saldar, "%s" vuelve a pedir la lista: %s', (reason, stale) =>
    expect(isStaleDebtError(reason, 'settle')).toBe(stale))
})

describe('volver a pendiente (US-40)', () => {
  it('aviso de éxito con la persona (CA-1)', () =>
    expect(reopenedNoticeText('Sofía')).toBe('La deuda con Sofía volvió a pendiente'))

  it.each([
    ['La deuda ya está pendiente', true],
    ['La deuda no existe', true],
    ['Probá de nuevo en un momento', false],
    ['La deuda ya está saldada', false],
  ])('al reabrir, "%s" vuelve a pedir la lista: %s', (reason, stale) =>
    expect(isStaleDebtError(reason, 'reopen')).toBe(stale))
})

describe('filtro por dirección (US-79)', () => {
  it.each([
    [null, 'all'],
    ['all', 'all'],
    ['owed_to_me', 'owed_to_me'],
    ['i_owe', 'i_owe'],
    ['xyz', 'all'],
    ['', 'all'],
    ['I_OWE', 'all'],
  ] as const)('?direction=%j se lee como %s (CA-1, CA-4)', (param, direction) =>
    expect(parseDebtDirectionFilter(param)).toBe(direction))

  const list = [
    debt({ id: 'sofia', direction: 'owed_to_me', incurredOn: '2026-08-15' }),
    debt({ id: 'ana', direction: 'i_owe', incurredOn: '2026-09-20' }),
    debt({ id: 'pedro', direction: 'owed_to_me', status: 'settled', settledAt: '2026-09-10T12:00:00+00:00' }),
    debt({ id: 'luis', direction: 'i_owe', status: 'settled', settledAt: '2026-09-12T12:00:00+00:00' }),
    debt({ id: 'borrada', direction: 'i_owe', transactionId: 't', linkedTransactionDeleted: true }),
  ]
  const ids = (filter: 'pending' | 'settled' | 'all', direction: 'all' | 'owed_to_me' | 'i_owe') =>
    debtsForFilter(list, filter, direction).map((d) => d.id)

  it('"Todas" muestra las dos direcciones (CA-1)', () => expect(ids('pending', 'all')).toEqual(['ana', 'sofia']))

  it('"Te deben" y "Debés" solo sacan filas; se combinan con el estado (CA-2, CA-3)', () => {
    expect(ids('pending', 'owed_to_me')).toEqual(['sofia'])
    expect(ids('pending', 'i_owe')).toEqual(['ana'])
    expect(ids('settled', 'i_owe')).toEqual(['luis'])
    expect(ids('settled', 'owed_to_me')).toEqual(['pedro'])
  })

  it('el orden es el del filtro de estado; la de un gasto eliminado tampoco aparece', () => {
    expect(ids('all', 'i_owe')).toEqual(['ana', 'luis'])
    expect(ids('settled', 'all')).toEqual(['luis', 'pedro'])
  })

  it.each([
    ['pending', 'owed_to_me', 'Nadie te debe nada por ahora.', true],
    ['pending', 'i_owe', 'No debés nada por ahora.', true],
    ['settled', 'owed_to_me', 'Todavía no te saldaron ninguna deuda.', false],
    ['settled', 'i_owe', 'Todavía no saldaste ninguna deuda tuya.', false],
    ['all', 'owed_to_me', 'No cargaste deudas a tu favor.', true],
    ['all', 'i_owe', 'No cargaste deudas que debas.', true],
    ['pending', 'all', 'No tenés deudas pendientes.', true],
    ['settled', 'all', 'Todavía no saldaste ninguna deuda.', false],
    ['all', 'all', 'No cargaste ninguna deuda todavía.', true],
  ] as const)('vacío con %s y %s: "%s", "Cargar una deuda": %s (CA-6)', (filter, direction, message, offerNew) =>
    expect(emptyDebtsMessage(filter, direction)).toEqual({ message, offerNew }))

  it('los totales no dependen del filtro de dirección (CA-7)', () => {
    const totals = debtTotals(list)
    expect([totals.owedToMe.toFixed(2), totals.iOwe.toFixed(2)]).toEqual(['60000.00', '60000.00'])
  })
})
