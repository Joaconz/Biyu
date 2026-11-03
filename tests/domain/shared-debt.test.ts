import { describe, expect, it } from 'vitest'
import { applyDraftChange, emptyDraftInput, parseDraftInput, type DraftInput } from '@/domain/draft'
import { parseMoney } from '@/domain/money'
import {
  debtsOfDraft,
  deletionDebtWarning,
  formatFieldAmount,
  joinNames,
  sharedExpenseLabel,
  sharedDebtPreview,
  sharedDebtSavedMessage,
  sharedDebtSummary,
  splitEqually,
  toSharedDebt,
  validateSharedDebt,
  validateSharedRows,
} from '@/domain/sharedDebt'
import { validateTransactionDraft } from '@/domain/validation'

const TODAY = '2026-08-15'
const ARS = { amount: null, currency: 'ARS' as const, fxRate: null }

describe('validateSharedDebt (US-34, copia UX de create_transaction)', () => {
  it('persona y monto válidos no tienen errores', () =>
    expect(validateSharedDebt({ person: 'Sofía', amount: '60000' }, ARS)).toEqual({}))

  it.each(['', '   ', '\t', ' '])('persona %j vacía o solo espacios', (person) =>
    expect(validateSharedDebt({ person, amount: '1' }, ARS).sharedPerson).toBe('Ingresá con quién compartiste el gasto'))

  it.each([
    ['', 'Ingresá cuánto te debe'],
    ['   ', 'Ingresá cuánto te debe'],
    ['abc', 'Ingresá un número válido'],
    ['1e3', 'Ingresá un número válido'],
    ['0', 'El monto debe ser mayor a cero'],
    ['-5', 'El monto debe ser mayor a cero'],
    ['100,001', 'El monto admite hasta 2 decimales'],
  ])('monto %j → %s (CA-7)', (amount, message) =>
    expect(validateSharedDebt({ person: 'Sofía', amount }, ARS).sharedAmount).toBe(message))

  it.each(['60000', '60.000', '60.000,00', '60000.5', '0,01'])('monto %j aceptado', (amount) =>
    expect(validateSharedDebt({ person: 'Sofía', amount }, ARS)).toEqual({}))

  it('en US$, una deuda que en pesos redondea a $0,00 se rechaza', () => {
    const usd = { amount: null, currency: 'USD' as const, fxRate: parseMoney('0.4') }
    expect(validateSharedDebt({ person: 'Sofía', amount: '0,01' }, usd).sharedAmount).toBe(
      'En pesos daría menos de $0,01. Revisá el monto o el tipo de cambio',
    )
    expect(validateSharedDebt({ person: 'Sofía', amount: '0,01' }, { ...usd, fxRate: parseMoney('0.5') })).toEqual({})
  })
})

describe('la deuda no puede superar el gasto (US-41)', () => {
  const expense = { amount: parseMoney('10000'), currency: 'ARS' as const, fxRate: null }

  it.each(['9999,99', '10000', '10.000,00'])('deuda %j hasta el gasto de $10.000,00 se acepta (CA-1, CA-2)', (amount) =>
    expect(validateSharedDebt({ person: 'Sofía', amount }, expense)).toEqual({}))

  it.each(['10000,01', '15000'])('deuda %j mayor al gasto se rechaza con el monto del gasto (CA-3, CA-4)', (amount) =>
    expect(validateSharedDebt({ person: 'Sofía', amount }, expense).sharedAmount).toBe(
      'No puede superar el monto del gasto ($10.000,00)',
    ))

  it('en US$ se compara en dólares y el mensaje usa US$ (CA-6)', () => {
    const usd = { amount: parseMoney('100.01'), currency: 'USD' as const, fxRate: parseMoney('1250.5555') }
    expect(validateSharedDebt({ person: 'Sofía', amount: '100,01' }, usd)).toEqual({})
    expect(validateSharedDebt({ person: 'Sofía', amount: '100,02' }, usd).sharedAmount).toBe(
      'No puede superar el monto del gasto (US$100,01)',
    )
  })

  it('sin un monto de gasto válido no se compara: ese error es del paso 1', () => {
    expect(validateSharedDebt({ person: 'Sofía', amount: '15000' }, { ...expense, amount: null })).toEqual({})
    expect(validateSharedDebt({ person: 'Sofía', amount: '15000' }, { ...expense, amount: parseMoney('0') })).toEqual({})
  })
})

describe('textos de la deuda', () => {
  it('resumen y aviso en pesos', () => {
    const debt = toSharedDebt({ person: '  Sofía  ', amount: '60000' })!
    expect(debt.person).toBe('Sofía')
    expect(sharedDebtSummary(debt, parseMoney('120000'), 'ARS')).toBe(
      'Sofía te va a deber $60.000,00 · Tu parte: $60.000,00',
    )
    expect(sharedDebtSavedMessage([debt], 'ARS')).toBe('Sofía te debe $60.000,00')
  })
  it('en la moneda del gasto: US$ (CA-13)', () => {
    const debt = toSharedDebt({ person: 'Sofía', amount: '40' })!
    expect(sharedDebtSavedMessage([debt], 'USD')).toBe('Sofía te debe US$40,00')
    expect(sharedDebtSummary(debt, parseMoney('100'), 'USD')).toBe('Sofía te va a deber US$40,00 · Tu parte: US$60,00')
  })
  it('el resumen espera a que persona, monto y gasto sean válidos', () => {
    expect(sharedDebtPreview([{ person: 'Sofía', amount: '60000' }], '120.000', 'ARS')).toBe(
      'Sofía te va a deber $60.000,00 · Tu parte: $60.000,00',
    )
    expect(sharedDebtPreview([{ person: '', amount: '60000' }], '120000', 'ARS')).toBeNull()
    expect(sharedDebtPreview([{ person: 'Sofía', amount: '60000' }], '', 'ARS')).toBeNull()
  })
  it('solo un gasto lleva deuda', () => {
    const shared = [{ person: 'Sofía', amount: '10' }]
    expect(debtsOfDraft({ type: 'expense', shared })?.[0].person).toBe('Sofía')
    expect(debtsOfDraft({ type: 'income', shared })).toBeNull()
    expect(debtsOfDraft({ type: 'expense', shared: null })).toBeNull()
  })
  it('sin persona o monto válido no hay deuda que mandar', () => {
    expect(toSharedDebt({ person: ' ', amount: '10' })).toBeNull()
    expect(toSharedDebt({ person: 'Sofía', amount: 'abc' })).toBeNull()
  })
})

describe('el gasto compartido en Movimientos y en el borrado (US-35)', () => {
  it('etiqueta de la fila (CA-3)', () => expect(sharedExpenseLabel(['Sofía'])).toBe('Compartido con Sofía'))
  it('aviso del diálogo de borrado, en la moneda del gasto (CA-4)', () => {
    expect(deletionDebtWarning([{ person: 'Sofía', amount: parseMoney('60000') }], 'ARS')).toBe(
      'También deja de contar la deuda con Sofía por $60.000,00.',
    )
    expect(deletionDebtWarning([{ person: 'Marcos', amount: parseMoney('40') }], 'USD')).toBe(
      'También deja de contar la deuda con Marcos por US$40,00.',
    )
  })
})

describe('borrador con gasto compartido', () => {
  const base: DraftInput = {
    ...emptyDraftInput(TODAY, { accountId: 'a1', accountType: 'credit_card' }),
    amount: '120000',
    categoryId: 'c1',
  }
  const shared: DraftInput = { ...base, shared: true, sharedRows: [{ person: 'Sofía', amount: '60000' }] }

  it('arranca apagado y vacío', () => {
    expect(base.shared).toBe(false)
    expect(parseDraftInput(base).shared).toBeNull()
  })
  it('encendido, viaja persona y monto y valida', () => {
    expect(parseDraftInput(shared).shared).toEqual([{ person: 'Sofía', amount: '60000' }])
    expect(validateTransactionDraft(parseDraftInput(shared), TODAY)).toEqual({})
  })
  it('encendido y vacío no deja guardar', () => {
    const errors = validateTransactionDraft(parseDraftInput({ ...base, shared: true, sharedRows: [{ person: '', amount: '' }] }), TODAY)
    expect(errors.sharedPerson).toBe('Ingresá con quién compartiste el gasto')
    expect(errors.sharedAmount).toBe('Ingresá cuánto te debe')
  })
  it('apagarlo vacía los campos y guarda sin deuda (CA-2)', () => {
    const change = applyDraftChange(shared, { shared: false })
    expect(change.clearedFields).toEqual(['sharedPerson', 'sharedAmount'])
    const off = change.values
    expect(off).toMatchObject({ shared: false, sharedRows: [] })
    expect(parseDraftInput(off).shared).toBeNull()
    expect(applyDraftChange(off, { shared: true }).values).toMatchObject({ shared: true, sharedRows: [{ person: '', amount: '' }] })
  })
  it('un ingreso no lleva deuda aunque haya algo escrito (CA-10)', () => {
    expect(parseDraftInput({ ...shared, type: 'income' }).shared).toBeNull()
  })
  it('pasar a ingreso y volver a gasto deja la sección apagada y vacía (CA-10)', () => {
    const income = applyDraftChange(shared, { type: 'income' }).values
    const back = applyDraftChange(income, { type: 'expense' }).values
    expect(back).toMatchObject({ shared: false, sharedRows: [] })
  })
  it('cambiar la moneda vacía el monto adeudado y conserva la persona (CA-12)', () => {
    const change = applyDraftChange(shared, { currency: 'USD' })
    expect(change.clearedFields).toEqual(['sharedAmount'])
    const usd = change.values
    expect(usd).toMatchObject({ shared: true, sharedRows: [{ person: 'Sofía', amount: '' }] })
  })
  it('bajar el gasto por debajo de la deuda la deja en error y no la ajusta (US-41 CA-7)', () => {
    const lowered = applyDraftChange(shared, { amount: '50000' }).values
    expect(lowered.sharedRows[0].amount).toBe('60000')
    expect(validateTransactionDraft(parseDraftInput(lowered), TODAY)).toEqual({
      sharedAmount: 'No puede superar el monto del gasto ($50.000,00)',
    })
  })
  it('después de guardar, el interruptor vuelve apagado (CA-9)', () => {
    expect(emptyDraftInput(TODAY)).toMatchObject({ shared: false, sharedRows: [] })
  })
})

describe('varias personas (US-82, ADR-040)', () => {
  const gasto = (amount: string, currency: 'ARS' | 'USD' = 'ARS', fx?: string) => ({
    amount: parseMoney(amount),
    currency,
    fxRate: fx ? parseMoney(fx) : null,
  })
  const row = (person: string, amount: string) => ({ person, amount })

  it('CA-6: una persona repetida (recortada, sin distinguir mayúsculas) da "Ya agregaste a <la anterior>"', () => {
    const { rows } = validateSharedRows([row('Sofía', '10'), row('  sofía ', '10')], gasto('100'))
    expect(rows[0]).toEqual({})
    expect(rows[1].sharedPerson).toBe('Ya agregaste a Sofía')
  })

  it('CA-4: la suma igual al gasto se acepta y un centavo más da el error de la suma', () => {
    expect(validateSharedRows([row('A', '60000'), row('B', '60000')], gasto('120000')).total).toBeUndefined()
    expect(validateSharedRows([row('A', '60000'), row('B', '60000,01')], gasto('120000')).total).toBe(
      'Entre todos no pueden deber más que el gasto ($120.000,00)',
    )
  })

  it('CA-19: con un error en una fila no se evalúa la suma', () => {
    const result = validateSharedRows([row('A', '150000'), row('B', '10')], gasto('120000'))
    expect(result.rows[0].sharedAmount).toBe('No puede superar el monto del gasto ($120.000,00)')
    expect(result.total).toBeUndefined()
  })

  it('una sola fila no tiene error de suma (el tope va en la fila)', () => {
    expect(validateSharedRows([row('A', '100')], gasto('100')).total).toBeUndefined()
  })

  it('en US$, la suma en pesos que supera el gasto por redondeo da su error', () => {
    const usd = gasto('3', 'USD', '1000.005')
    expect(validateSharedRows([row('A', '1'), row('B', '1'), row('C', '1')], usd).total).toBe(
      'En pesos, la suma supera el gasto por redondeo. Bajá un centavo alguna deuda.',
    )
    expect(validateSharedRows([row('A', '1'), row('B', '1')], usd).total).toBeUndefined()
  })

  it('CA-3: dividir en partes iguales (n + 1 partes, el usuario absorbe el resto)', () => {
    const two = splitEqually(parseMoney('100000'), 2)
    expect(formatFieldAmount(two.share)).toBe('33333,33')
    expect(two.mine.toFixed(2)).toBe('33333.34')
    expect(formatFieldAmount(splitEqually(parseMoney('120000'), 3).share)).toBe('30000')
    expect(formatFieldAmount(splitEqually(parseMoney('100'), 2).share)).toBe('33,33')
    expect(formatFieldAmount(parseMoney('0.5'))).toBe('0,5')
  })

  it('CA-20: un gasto de $0,02 entre 2 personas deja la parte en 0', () => {
    expect(formatFieldAmount(splitEqually(parseMoney('0.02'), 2).share)).toBe('0')
    expect(validateSharedDebt({ person: 'A', amount: '0' }, gasto('0.02')).sharedAmount).toBe('El monto debe ser mayor a cero')
  })

  it('resumen con dos o más personas (CA-3)', () => {
    expect(sharedDebtPreview([row('A', '33333,33'), row('B', '33333,33')], '100000', 'ARS')).toBe(
      'Te van a deber $66.666,66 entre 2 personas · Tu parte: $33.333,34',
    )
    expect(sharedDebtPreview([row('A', '40000'), row('B', '40000')], '120000', 'ARS')).toBe(
      'Te van a deber $80.000,00 entre 2 personas · Tu parte: $40.000,00',
    )
  })

  it('nombres ordenados sin tildes ni mayúsculas, con coma y «y» (ADR-040 §5)', () => {
    expect(joinNames(['Sofía', 'juan', 'Ana'])).toBe('Ana, juan y Sofía')
    expect(joinNames(['Sofía', 'Juan'])).toBe('Juan y Sofía')
    expect(joinNames(['Sofia', 'Sofía'])).toBe('Sofia y Sofía')
  })

  it('CA-2: el aviso de guardado, la etiqueta (CA-10) y el borrado (CA-11)', () => {
    const debts = [
      { person: 'Sofía', amount: parseMoney('40000') },
      { person: 'Juan', amount: parseMoney('40000') },
    ]
    expect(sharedDebtSavedMessage(debts, 'ARS')).toBe('Juan y Sofía te deben $80.000,00')
    expect(sharedExpenseLabel(['Sofía', 'Juan'])).toBe('Compartido con Juan y Sofía')
    expect(sharedExpenseLabel(['Sofía', 'Juan', 'Ana'])).toBe('Compartido con Ana y 2 más')
    const three = ['Sofía', 'Ana', 'Juan'].map((person) => ({ person, amount: parseMoney('30000') }))
    expect(deletionDebtWarning(three, 'ARS')).toBe('También dejan de contar las deudas con Ana, Juan y Sofía por $90.000,00 en total.')
  })

  it('CA-9 y CA-17: apagar o pasar a ingreso deja una sola fila vacía al volver a encender', () => {
    const base: DraftInput = { ...emptyDraftInput(TODAY), amount: '100', categoryId: 'c' }
    const on = applyDraftChange(base, { shared: true }).values
    const two = { ...on, sharedRows: [row('A', '1'), row('B', '2')] }
    const off = applyDraftChange(two, { shared: false }).values
    expect(applyDraftChange(off, { shared: true }).values.sharedRows).toEqual([row('', '')])
  })

  it('CA-16: cambiar la moneda vacía los montos de todas las filas y conserva las personas', () => {
    const on = { ...emptyDraftInput(TODAY), shared: true, sharedRows: [row('A', '1'), row('B', '2')] }
    expect(applyDraftChange(on, { currency: 'USD' }).values.sharedRows).toEqual([row('A', ''), row('B', '')])
  })

  it('la suma que supera el gasto bloquea guardar (CA-4)', () => {
    const d: DraftInput = { ...emptyDraftInput(TODAY, { accountId: 'a', accountType: 'cash' }), amount: '120000', categoryId: 'c', shared: true, sharedRows: [row('A', '60000'), row('B', '60000,01')] }
    expect(validateTransactionDraft(parseDraftInput(d), TODAY)).toEqual({
      sharedTotal: 'Entre todos no pueden deber más que el gasto ($120.000,00)',
    })
  })
})
