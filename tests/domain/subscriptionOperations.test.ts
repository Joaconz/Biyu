import { describe, expect, it } from 'vitest'
import { Decimal } from '@/domain/money'
import {
  blockedMonthsWarning,
  pauseSkipsCurrentMonthDay,
  pausedNoticeText,
  periodListText,
  resumedNoticeText,
  resumeOutcomeText,
} from '@/domain/subscriptionOperations'

// Hoy de los ejemplos de entrega-2/historias/suscripciones.md: 2026-10-06, período corriente octubre 2026.
const TODAY = new Date(2026, 9, 6)
const OCT = { year: 2026, month: 10 }

const schedule = (patch: Partial<Parameters<typeof pauseSkipsCurrentMonthDay>[0]> = {}) => ({
  billingDay: 28,
  generateFromPeriod: { year: 2026, month: 5 },
  endPeriod: null,
  ...patch,
})

describe('pauseSkipsCurrentMonthDay (US-56 CA-11)', () => {
  it('día de cobro 28, hoy 6, sin ocurrencia del mes: dice el día 28', () => {
    expect(pauseSkipsCurrentMonthDay(schedule(), new Set(['2026-09']), TODAY)).toBe(28)
  })

  it('día de cobro 3, hoy 6: ya se cobró (R5), no aparece', () => {
    expect(pauseSkipsCurrentMonthDay(schedule({ billingDay: 3 }), new Set(['2026-09']), TODAY)).toBeNull()
  })

  it('el día de cobro es hoy: ya cuenta como vencido, no aparece', () => {
    expect(pauseSkipsCurrentMonthDay(schedule({ billingDay: 6 }), new Set(), TODAY)).toBeNull()
  })

  it('el mes corriente ya tiene transacción, aunque esté borrada (R2): no aparece', () => {
    expect(pauseSkipsCurrentMonthDay(schedule(), new Set(['2026-10']), TODAY)).toBeNull()
  })

  it('día de cobro 31 en un mes de 30 días: dice 30 (R4)', () => {
    expect(pauseSkipsCurrentMonthDay(schedule({ billingDay: 31 }), new Set(), new Date(2026, 8, 6))).toBe(30)
  })

  it('el período corriente queda fuera de [generate_from_period, end_period] (R1): no aparece', () => {
    expect(pauseSkipsCurrentMonthDay(schedule({ generateFromPeriod: { year: 2026, month: 11 } }), new Set(), TODAY)).toBeNull()
    expect(pauseSkipsCurrentMonthDay(schedule({ endPeriod: { year: 2026, month: 9 } }), new Set(), TODAY)).toBeNull()
  })

  it('el mes de fin es el corriente: todavía entra en el rango', () => {
    expect(pauseSkipsCurrentMonthDay(schedule({ endPeriod: OCT }), new Set(), TODAY)).toBe(28)
  })
})

describe('textos de las operaciones', () => {
  it('lista de meses con comas y "y" antes del último', () => {
    expect(periodListText([])).toBe('')
    expect(periodListText([{ year: 2026, month: 7 }])).toBe('julio 2026')
    expect(periodListText([{ year: 2026, month: 7 }, { year: 2026, month: 8 }])).toBe('julio 2026 y agosto 2026')
    expect(periodListText([{ year: 2026, month: 7 }, { year: 2026, month: 8 }, { year: 2026, month: 9 }])).toBe(
      'julio 2026, agosto 2026 y septiembre 2026',
    )
  })

  it('aviso de meses bloqueados al pausar y al cancelar, en singular y plural', () => {
    const fx = (month: number) => ({ period: { year: 2026, month }, reason: 'missing_fx_rate' as const })
    const july = [fx(7)]
    expect(blockedMonthsWarning(july, 'pausás')).toBe(
      'Julio 2026 no se cargó por falta de tipo de cambio. Si la pausás, ese mes no se va a cargar.',
    )
    expect(blockedMonthsWarning(july, 'cancelás')).toBe(
      'Julio 2026 no se cargó por falta de tipo de cambio. Si la cancelás, ese mes no se va a cargar.',
    )
    expect(blockedMonthsWarning([...july, fx(8)], 'pausás')).toBe(
      'Julio 2026 y agosto 2026 no se cargaron por falta de tipo de cambio. Si la pausás, esos meses no se van a cargar.',
    )
    expect(blockedMonthsWarning([], 'pausás')).toBeNull()
    // Un mes bloqueado por monto en pesos fuera de rango no es "falta de tipo de cambio": no entra en el aviso.
    const range = { period: { year: 2026, month: 9 }, reason: 'amount_ars_out_of_range' as const }
    expect(blockedMonthsWarning([range], 'pausás')).toBeNull()
    expect(blockedMonthsWarning([...july, range], 'pausás')).toBe(
      'Julio 2026 no se cargó por falta de tipo de cambio. Si la pausás, ese mes no se va a cargar.',
    )
  })

  it('aviso de pausa: con y sin gastos atrasados', () => {
    expect(pausedNoticeText(0)).toBe('Suscripción pausada')
    expect(pausedNoticeText(1)).toBe('Suscripción pausada. Antes se cargó 1 gasto vencido.')
    expect(pausedNoticeText(3)).toBe('Suscripción pausada. Antes se cargaron 3 gastos vencidos.')
  })
})

describe('resumeOutcomeText (US-57)', () => {
  const sub = (patch: Partial<Parameters<typeof resumeOutcomeText>[0]> = {}) => ({
    billingDay: 10,
    startPeriod: { year: 2026, month: 5 },
    generateFromPeriod: { year: 2026, month: 8 }, // pausada hace meses: el piso quedó antes del corriente
    endPeriod: null,
    ...patch,
  })

  it('pausada este mismo mes, el piso quedó en noviembre: octubre no se carga aunque ya haya vencido (R8)', () => {
    expect(resumeOutcomeText(sub({ billingDay: 1, generateFromPeriod: { year: 2026, month: 11 } }), new Set(), TODAY)).toBe(
      'Próximo cobro: 01/11/2026.',
    )
  })

  it('el período corriente ya venció y no tiene transacción: dice que se carga al reanudar', () => {
    expect(resumeOutcomeText(sub({ billingDay: 1 }), new Set(['2026-07']), TODAY)).toBe(
      'Al reanudar se carga octubre 2026 (01/10/2026).',
    )
  })

  it('el día de cobro es hoy: ya venció, también se carga', () => {
    expect(resumeOutcomeText(sub({ billingDay: 6 }), new Set(), TODAY)).toBe('Al reanudar se carga octubre 2026 (06/10/2026).')
  })

  it('el cobro del mes corriente todavía no llegó: próximo cobro de este mes (R5)', () => {
    expect(resumeOutcomeText(sub(), new Set(), TODAY)).toBe('Próximo cobro: 10/10/2026.')
  })

  it('el mes corriente ya tiene transacción (aunque esté borrada): próximo cobro del mes siguiente', () => {
    expect(resumeOutcomeText(sub({ billingDay: 1 }), new Set(['2026-10']), TODAY)).toBe('Próximo cobro: 01/11/2026.')
  })

  it('ignora el piso viejo: usa el corriente aunque la pausa haya dejado uno menor (R8)', () => {
    expect(resumeOutcomeText(sub({ generateFromPeriod: { year: 2026, month: 8 } }), new Set(), TODAY)).toBe(
      'Próximo cobro: 10/10/2026.',
    )
  })

  it('start_period futuro: el piso es start_period y el próximo cobro es de ese mes (CA-3)', () => {
    const future = { year: 2027, month: 1 }
    expect(resumeOutcomeText(sub({ startPeriod: future, generateFromPeriod: future }), new Set(), TODAY)).toBe(
      'Próximo cobro: 10/01/2027.',
    )
  })

  it('el mes de fin ya pasó: no hay más cobros', () => {
    expect(resumeOutcomeText(sub({ endPeriod: { year: 2026, month: 5 } }), new Set(), TODAY)).toBe(
      'No hay más cobros: terminó en mayo 2026.',
    )
  })

  it('el mes de fin es el corriente y ya se cobró: no hay más cobros, pero todavía no "terminó"', () => {
    expect(resumeOutcomeText(sub({ endPeriod: OCT, billingDay: 1 }), new Set(['2026-10']), TODAY)).toBe(
      'No hay más cobros: termina en octubre 2026.',
    )
  })

  it('día de cobro 31 en un mes de 30 días: la fecha es la recortada (R4)', () => {
    expect(resumeOutcomeText(sub({ billingDay: 31 }), new Set(), new Date(2026, 8, 6))).toBe('Próximo cobro: 30/09/2026.')
  })
})

describe('resumedNoticeText (US-57)', () => {
  it('sin gasto nuevo y con el gasto del mes corriente', () => {
    expect(resumedNoticeText(0, TODAY)).toBe('Suscripción reanudada')
    expect(resumedNoticeText(1, TODAY)).toBe('Suscripción reanudada. Se cargó el gasto de octubre 2026.')
  })
})
