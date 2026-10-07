import { describe, expect, it } from 'vitest'
import {
  argentinaDateOf,
  debtRowText,
  debtsForFilter,
  emptyDebtsMessage,
  parseDebtStatusFilter,
  type DebtRecord,
} from '@/domain/debts'

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

describe('estado vacío de cada filtro (US-38 CA-7)', () => {
  it.each([
    ['pending', 'No tenés deudas pendientes.', true],
    ['settled', 'Todavía no saldaste ninguna deuda.', false],
    ['all', 'No cargaste ninguna deuda todavía.', true],
  ] as const)('%s', (filter, message, offerNew) => expect(emptyDebtsMessage(filter)).toEqual({ message, offerNew }))
})
