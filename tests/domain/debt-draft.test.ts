import { describe, expect, it } from 'vitest'
import {
  applyDebtReferenceRate,
  debtArsEquivalent,
  emptyDebtDraftInput,
  firstDebtDraftError,
  toNewDebt,
  validateDebtDraft,
  type DebtDraftInput,
} from '@/domain/debtDraft'
import { parsePeriod } from '@/domain/period'

const TODAY = '2026-10-07'
const draft = (over: Partial<DebtDraftInput> = {}): DebtDraftInput => ({
  ...emptyDebtDraftInput(TODAY),
  person: 'Juan',
  amount: '20000',
  ...over,
})
const usd = (amount: string, fxRate: string) => draft({ currency: 'USD', amount, fxRate })

describe('estado inicial de Nueva deuda (US-36 CA-1)', () => {
  it('"Me deben", persona y monto vacíos, ARS, sin TC, fecha de hoy, nota vacía', () =>
    expect(emptyDebtDraftInput(TODAY)).toEqual({
      direction: 'owed_to_me', person: '', amount: '', currency: 'ARS', fxRate: '', incurredOn: TODAY, notes: '',
    }))

  it('vacío no deja guardar y el primer motivo es el de la persona', () => {
    const errors = validateDebtDraft(emptyDebtDraftInput(TODAY), TODAY)
    expect(firstDebtDraftError(errors)).toBe('Ingresá el nombre de la persona')
    expect(errors.amount).toBe('Ingresá el monto')
  })
})

describe('mensajes por campo (US-36 CA-6)', () => {
  it.each([
    [{ person: '' }, 'person', 'Ingresá el nombre de la persona'],
    [{ person: ' \t ' }, 'person', 'Ingresá el nombre de la persona'],
    [{ amount: '' }, 'amount', 'Ingresá el monto'],
    [{ amount: 'abc' }, 'amount', 'Ingresá un número válido'],
    [{ amount: '1e3' }, 'amount', 'Ingresá un número válido'],
    [{ amount: '1,2,3' }, 'amount', 'Ingresá un número válido'],
    [{ amount: '0' }, 'amount', 'El monto debe ser mayor a cero'],
    [{ amount: '-5' }, 'amount', 'El monto debe ser mayor a cero'],
    [{ amount: '0,001' }, 'amount', 'El monto admite hasta 2 decimales'],
    [{ amount: '1.000.000.000.000' }, 'amount', 'El monto máximo es $999.999.999.999,99'],
    [{ currency: 'USD' as const, amount: '1.000.000.000.000', fxRate: '1' }, 'amount', 'El monto máximo es US$999.999.999.999,99'],
    [{ currency: 'USD' as const, amount: '1.000.000.000', fxRate: '1000' }, 'amount', 'En pesos daría más que el máximo de $999.999.999.999,99'],
    [{ currency: 'USD' as const, amount: '0,01', fxRate: '0,4' }, 'amount', 'En pesos daría menos de $0,01. Revisá el monto o el tipo de cambio'],
    [{ currency: 'USD' as const, fxRate: '' }, 'fxRate', 'Falta el tipo de cambio'],
    [{ currency: 'USD' as const, fxRate: 'x' }, 'fxRate', 'Ingresá un número válido'],
    [{ currency: 'USD' as const, fxRate: '0' }, 'fxRate', 'El tipo de cambio debe ser mayor a cero'],
    [{ currency: 'USD' as const, fxRate: '1250,12345' }, 'fxRate', 'Usá hasta 4 decimales'],
    [{ currency: 'USD' as const, fxRate: '10000000000' }, 'fxRate', 'El tipo de cambio es demasiado grande'],
    [{ incurredOn: '' }, 'incurredOn', 'Fecha inválida'],
    [{ incurredOn: '2026-13-01' }, 'incurredOn', 'Fecha inválida'],
    [{ incurredOn: '2026-02-31' }, 'incurredOn', 'Fecha inválida'],
    [{ incurredOn: '2026-10-00' }, 'incurredOn', 'Fecha inválida'],
    [{ incurredOn: '2026-10-08' }, 'incurredOn', 'La fecha no puede ser futura'],
  ] as const)('%j → %s: "%s"', (over, field, message) => {
    const errors = validateDebtDraft(draft(over), TODAY)
    expect(errors[field]).toBe(message)
    expect(toNewDebt(draft(over), TODAY)).toBeNull()
  })

  it.each([
    ['0,01', 'ARS'],
    ['999.999.999.999,99', 'ARS'],
    ['999999999999.99', 'ARS'],
    ['1.500', 'ARS'],
  ])('%s en %s se acepta', (amount) => expect(validateDebtDraft(draft({ amount }), TODAY)).toEqual({}))

  it('US$0,01 a TC 0,5 se acepta: half-up da $0,01', () => {
    expect(validateDebtDraft(usd('0,01', '0,5'), TODAY)).toEqual({})
    expect(debtArsEquivalent(usd('0,01', '0,5'), {})).toBe('≈ $0,01')
  })

  it('el TC con 4 decimales se acepta', () => expect(validateDebtDraft(usd('40', '1250,2575'), TODAY)).toEqual({}))
})

describe('fecha y largos (US-36 CA-7)', () => {
  it('una fecha pasada se acepta; hoy también', () => {
    expect(validateDebtDraft(draft({ incurredOn: '2025-12-31' }), TODAY)).toEqual({})
    expect(validateDebtDraft(draft({ incurredOn: TODAY }), TODAY)).toEqual({})
  })

  it('persona de 60 caracteres se acepta', () => expect(validateDebtDraft(draft({ person: 'a'.repeat(60) }), TODAY)).toEqual({}))
})

describe('lo que viaja a create_debt (US-36 CA-2, CA-3, CA-4)', () => {
  it('ARS: persona recortada, monto en Decimal, sin TC y sin nota si está vacía', () => {
    const debt = toNewDebt(draft({ person: '  Juan\t', notes: '   ' }), TODAY)!
    expect(debt).toMatchObject({ direction: 'owed_to_me', person: 'Juan', currency: 'ARS', fxRate: null, incurredOn: TODAY, notes: null })
    expect(debt.amount.toFixed(2)).toBe('20000.00')
  })

  it('"Debo" viaja como i_owe y la nota recortada', () =>
    expect(toNewDebt(draft({ direction: 'i_owe', notes: ' Préstamo ' }), TODAY)).toMatchObject({ direction: 'i_owe', notes: 'Préstamo' }))

  it('US$40 a TC 1.250,00: el TC viaja y el equivalente dice ≈ $50.000,00', () => {
    const input = usd('40', '1.250,00')
    expect(toNewDebt(input, TODAY)!.fxRate!.toFixed(4)).toBe('1250.0000')
    expect(debtArsEquivalent(input, validateDebtDraft(input, TODAY))).toBe('≈ $50.000,00')
  })

  it('en ARS no viaja el TC que quedó escrito de cuando era US$ (I5)', () =>
    expect(toNewDebt(draft({ fxRate: '1250' }), TODAY)!.fxRate).toBeNull())

  it('sin equivalente si el monto o el TC no son válidos, o en ARS', () => {
    expect(debtArsEquivalent(usd('', '1250'), validateDebtDraft(usd('', '1250'), TODAY))).toBeNull()
    expect(debtArsEquivalent(usd('40', ''), validateDebtDraft(usd('40', ''), TODAY))).toBeNull()
    expect(debtArsEquivalent(draft(), {})).toBeNull()
  })
})

describe('TC de referencia (US-36 CA-4, CA-5; US-20, US-21)', () => {
  const october = parsePeriod('2026-10')!
  const september = parsePeriod('2026-09')!

  it('llena el campo vacío con el formato de la app', () =>
    expect(applyDebtReferenceRate(usd('40', ''), { period: october }, '1250.0000').fxRate).toBe('1.250,00'))

  it('no pisa lo que escribió el usuario, ni aplica la respuesta de otro mes, ni sin referencia', () => {
    expect(applyDebtReferenceRate(usd('40', '1300'), { period: october }, '1250.0000').fxRate).toBe('1300')
    expect(applyDebtReferenceRate(usd('40', ''), { period: september }, '1250.0000').fxRate).toBe('')
    expect(applyDebtReferenceRate(usd('40', ''), { period: october }, null).fxRate).toBe('')
    expect(applyDebtReferenceRate(draft(), { period: october }, '1250.0000').fxRate).toBe('')
    expect(applyDebtReferenceRate({ ...usd('40', ''), incurredOn: '' }, { period: october }, '1250.0000').fxRate).toBe('')
  })
})
