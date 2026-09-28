import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import {
  applyDraftChange,
  draftInputAfterSave,
  emptyDraftInput,
  parseDraftInput,
  resolvePreloadedAccount,
  type DraftInput,
} from '@/domain/draft'
import { tryParseMoney } from '@/domain/money'
import { toIsoDate } from '@/domain/period'
import { validateTransactionDraft } from '@/domain/validation'

const TODAY = '2026-08-15'

describe('emptyDraftInput', () => {
  it('arranca como gasto en ARS, de contado, sin monto ni categoría', () => {
    expect(emptyDraftInput(TODAY)).toEqual({
      type: 'expense', amount: '', currency: 'ARS', fxRate: '', categoryId: null,
      accountId: null, accountType: null, installmentsCount: 1, occurredOn: TODAY,
    })
  })
  it('la fecha es el today que recibe, no la del reloj (C1)', () =>
    expect(emptyDraftInput('2020-02-29').occurredOn).toBe('2020-02-29'))
})

describe('toIsoDate (US-03)', () => {
  it('formatea con ceros a la izquierda', () => expect(toIsoDate(new Date(2026, 0, 5, 12))).toBe('2026-01-05'))

  describe('en la zona horaria del usuario, no en UTC', () => {
    const original = process.env.TZ
    beforeAll(() => { process.env.TZ = 'America/Argentina/Buenos_Aires' })
    afterAll(() => { process.env.TZ = original })

    it('a las 22:30 en Argentina sigue siendo el mismo día, aunque en UTC ya sea mañana', () => {
      const instant = new Date('2026-09-26T01:30:00Z') // 25/09 22:30 en UTC-3
      expect(instant.toISOString().slice(0, 10)).toBe('2026-09-26')
      expect(toIsoDate(instant)).toBe('2026-09-25')
    })
    it('pasada la medianoche local cambia de día', () =>
      expect(toIsoDate(new Date('2026-09-26T03:00:00Z'))).toBe('2026-09-26'))
    it('el 31/12 a la noche no salta de año', () =>
      expect(toIsoDate(new Date('2027-01-01T02:59:00Z'))).toBe('2026-12-31'))
  })
})

describe('tryParseMoney', () => {
  it.each([
    ['1234.56', '1234.56'], ['1234,56', '1234.56'], ['1.234,56', '1234.56'], [' 10 ', '10'],
    ['0', '0'], ['-5', '-5'], ['-1.234,5', '-1234.5'],
    // Puntos de miles sin coma: entero en formato argentino, no decimales.
    ['1.500', '1500'], ['10.000', '10000'], ['1.234.567', '1234567'], ['1.5', '1.5'], ['1.50', '1.5'],
  ])('%j → %s', (raw, expected) => expect(tryParseMoney(raw)?.toFixed()).toBe(expected))
  it.each(['', '   ', 'abc', '-', '1e3', '0x10', 'Infinity', 'NaN', '12,3,4', '1.23.456', '$100'])(
    '%j no es un monto → null', (raw) => expect(tryParseMoney(raw)).toBeNull())
})

describe('parseDraftInput + validateTransactionDraft (US-11)', () => {
  const filled = { ...emptyDraftInput(TODAY), categoryId: 'c1', accountId: 'a1', accountType: 'cash' as const }
  const amountError = (amount: string) => validateTransactionDraft(parseDraftInput({ ...filled, amount }), TODAY).amount
  it.each(['', '0', '0,00', '-5', 'abc'])('monto %j no deja guardar y dice por qué', (amount) =>
    expect(amountError(amount)).toBe('El monto debe ser mayor a cero'))
  it('un monto positivo con coma decimal es válido', () =>
    expect(validateTransactionDraft(parseDraftInput({ ...filled, amount: '1.500,50' }), TODAY)).toEqual({}))
  it('fxRate vacío en ARS queda null, no cuenta como tipo de cambio (I5)', () =>
    expect(parseDraftInput(filled).fxRate).toBeNull())
})

describe('draftInputAfterSave (US-10)', () => {
  const saved: DraftInput = {
    type: 'expense', amount: '1.500,50', currency: 'ARS', fxRate: '', categoryId: 'c1',
    accountId: 'a1', accountType: 'credit_card', installmentsCount: 3, occurredOn: '2026-08-10',
  }
  it('vuelve al estado inicial conservando la última cuenta usada', () =>
    expect(draftInputAfterSave(saved, TODAY)).toEqual({
      ...emptyDraftInput(TODAY), accountId: 'a1', accountType: 'credit_card',
    }))
  it('la fecha vuelve a ser hoy aunque se haya guardado una pasada', () =>
    expect(draftInputAfterSave(saved, '2026-08-16').occurredOn).toBe('2026-08-16'))
  it('el formulario que queda no se puede volver a guardar sin cargar un monto', () =>
    expect(validateTransactionDraft(parseDraftInput(draftInputAfterSave(saved, TODAY)), TODAY)).toHaveProperty('amount'))
})

describe('cuenta precargada con la última usada (US-07)', () => {
  const activeAccounts = [
    { id: 'acc-1', type: 'credit_card' as const },
    { id: 'acc-2', type: 'cash' as const },
  ]

  describe('resolvePreloadedAccount', () => {
    it('si no hay última cuenta usada (null o undefined), no preselecciona ninguna', () => {
      expect(resolvePreloadedAccount(null, activeAccounts)).toEqual({ accountId: null, accountType: null })
      expect(resolvePreloadedAccount(undefined, activeAccounts)).toEqual({ accountId: null, accountType: null })
    })

    it('si la última cuenta usada está entre las activas, la preselecciona con su tipo', () => {
      expect(resolvePreloadedAccount('acc-1', activeAccounts)).toEqual({
        accountId: 'acc-1',
        accountType: 'credit_card',
      })
      expect(resolvePreloadedAccount('acc-2', activeAccounts)).toEqual({
        accountId: 'acc-2',
        accountType: 'cash',
      })
    })

    it('si la última cuenta usada ya no existe, no preselecciona ninguna', () => {
      expect(resolvePreloadedAccount('acc-inexistente', activeAccounts)).toEqual({
        accountId: null,
        accountType: null,
      })
    })

    it('si la última cuenta usada está archivada (no está entre las activas), no preselecciona ninguna', () => {
      // Las cuentas activas solo contienen las no archivadas (archived_at is null)
      expect(resolvePreloadedAccount('acc-archivada', activeAccounts)).toEqual({
        accountId: null,
        accountType: null,
      })
    })

    it('si la lista de cuentas activas está vacía, no preselecciona ninguna', () => {
      expect(resolvePreloadedAccount('acc-1', [])).toEqual({
        accountId: null,
        accountType: null,
      })
    })
  })

  describe('draftInputAfterSave con cuentas activas', () => {
    const saved: DraftInput = {
      type: 'expense',
      amount: '5000',
      currency: 'ARS',
      fxRate: '',
      categoryId: 'c1',
      accountId: 'acc-1',
      accountType: 'credit_card',
      installmentsCount: 1,
      occurredOn: TODAY,
    }

    it('después de guardar, la cuenta queda seleccionada para la próxima carga si sigue activa', () => {
      const next = draftInputAfterSave(saved, TODAY, activeAccounts)
      expect(next.accountId).toBe('acc-1')
      expect(next.accountType).toBe('credit_card')
      expect(next.amount).toBe('')
      expect(next.categoryId).toBeNull()
    })

    it('si la última cuenta usada fue archivada o eliminada tras guardar, no se preselecciona ninguna', () => {
      const withoutAcc1 = [{ id: 'acc-2', type: 'cash' as const }]
      const next = draftInputAfterSave(saved, TODAY, withoutAcc1)
      expect(next.accountId).toBeNull()
      expect(next.accountType).toBeNull()
    })
  })

  describe('emptyDraftInput con cuenta precargada', () => {
    it('crea el borrador inicial con la cuenta resuelta', () => {
      const preloaded = resolvePreloadedAccount('acc-2', activeAccounts)
      const draft = emptyDraftInput(TODAY, preloaded)
      expect(draft.accountId).toBe('acc-2')
      expect(draft.accountType).toBe('cash')
    })
  })
})

describe('moneda precargada en ARS (US-05)', () => {
  it('la moneda por defecto es ARS en un borrador vacío', () => {
    expect(emptyDraftInput(TODAY).currency).toBe('ARS')
  })

  it('el borrador por defecto en ARS no tiene tipo de cambio (fxRate vacío y parsea a null, I5)', () => {
    const draft = emptyDraftInput(TODAY)
    expect(draft.currency).toBe('ARS')
    expect(draft.fxRate).toBe('')
    expect(parseDraftInput(draft).fxRate).toBeNull()
  })

  it('después de guardar vuelve a ARS y sin tipo de cambio aunque se haya guardado en USD', () => {
    const savedUsd: DraftInput = {
      ...emptyDraftInput(TODAY),
      currency: 'USD',
      fxRate: '1350',
      amount: '100',
      accountId: 'acc-1',
    }
    const after = draftInputAfterSave(savedUsd, TODAY)
    expect(after.currency).toBe('ARS')
    expect(after.fxRate).toBe('')
  })
})

describe('tipo precargado en gasto (US-04)', () => {
  it('el tipo por defecto es expense en un borrador vacío', () => {
    expect(emptyDraftInput(TODAY).type).toBe('expense')
  })

  it('después de guardar vuelve a expense aunque se haya guardado un ingreso', () => {
    const savedIncome: DraftInput = {
      ...emptyDraftInput(TODAY),
      type: 'income',
      amount: '50000',
      accountId: 'acc-1',
    }
    expect(draftInputAfterSave(savedIncome, TODAY).type).toBe('expense')
  })
})

describe('applyDraftChange (US-14)', () => {
  const inSixOnCredit: DraftInput = {
    ...emptyDraftInput(TODAY), amount: '600', categoryId: 'c1',
    accountId: 'visa', accountType: 'credit_card', installmentsCount: 6,
  }
  it('un cambio cualquiera se aplica tal cual y no resetea las cuotas', () =>
    expect(applyDraftChange(inSixOnCredit, { amount: '700' })).toEqual({
      values: { ...inSixOnCredit, amount: '700' }, installmentsReset: false,
    }))
  it.each(['cash', 'debit_card', 'bank_account', 'wallet'] as const)(
    'pasar de tarjeta de crédito a %s con 6 cuotas las vuelve a 1 y avisa', (accountType) => {
      const r = applyDraftChange(inSixOnCredit, { accountId: 'otra', accountType })
      expect(r.installmentsReset).toBe(true)
      expect(r.values).toEqual({ ...inSixOnCredit, accountId: 'otra', accountType, installmentsCount: 1 })
    })
  it('pasar a ingreso con cuotas también las vuelve a 1 (I6)', () => {
    const r = applyDraftChange(inSixOnCredit, { type: 'income' })
    expect(r).toMatchObject({ installmentsReset: true, values: { installmentsCount: 1 } })
  })
  it('con 1 cuota cambiar de cuenta no avisa: no había nada que restablecer', () =>
    expect(applyDraftChange({ ...inSixOnCredit, installmentsCount: 1 }, { accountId: 'efectivo', accountType: 'cash' }))
      .toMatchObject({ installmentsReset: false, values: { installmentsCount: 1 } }))
  it('cambiar entre dos tarjetas de crédito conserva las cuotas', () =>
    expect(applyDraftChange(inSixOnCredit, { accountId: 'master', accountType: 'credit_card' }))
      .toMatchObject({ installmentsReset: false, values: { installmentsCount: 6 } }))
  it('el borrador que queda después del reset se puede guardar', () => {
    const { values } = applyDraftChange(inSixOnCredit, { accountId: 'efectivo', accountType: 'cash' })
    expect(validateTransactionDraft(parseDraftInput(values), TODAY)).toEqual({})
  })
})
