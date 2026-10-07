import { describe, expect, it } from 'vitest'
import { Decimal } from '@/domain/money'
import { formatPeriod } from '@/domain/period'
import { blockedBySubscription, blockedMark, blockedNotice, blockedOccurrences } from '@/domain/subscriptionBlocked'
import { computeDueOccurrences, type SubscriptionRecord } from '@/domain/subscriptions'

// Suscripciones bloqueadas (US-62, ADR-031 §6). Los períodos son los de los ejemplos de la historia.

const fx = (entries: Record<string, string>) => new Map(Object.entries(entries).map(([k, v]) => [k, new Decimal(v)]))
const NONE = new Set<string>()

function sub(patch: Partial<SubscriptionRecord> = {}): SubscriptionRecord {
  return {
    id: 'sub-1',
    name: 'Hosting',
    amount: '10.00',
    currency: 'USD',
    categoryName: 'Servicios',
    accountName: 'Tarjeta',
    billingDay: 1,
    startPeriod: { year: 2026, month: 6 },
    endPeriod: null,
    generateFromPeriod: { year: 2026, month: 6 },
    status: 'active',
    pausedAt: null,
    cancelledAt: null,
    description: null,
    ...patch,
  }
}

const periodsOf = (blocked: ReturnType<typeof blockedOccurrences>) => blocked.map((b) => formatPeriod(b.period))

describe('blockedOccurrences (US-62)', () => {
  it('CA-1: USD 10,00 desde junio con TC de junio y sin el de julio, hoy 2026-07-20: junio se genera con su TC y julio queda bloqueado', () => {
    const rates = fx({ '2026-06': '1100' })
    const today = new Date(2026, 6, 20)
    const due = computeDueOccurrences(
      { ...sub(), amount: new Decimal('10'), billingDay: 1 },
      NONE,
      rates,
      today,
    )
    expect(due.map((d) => [formatPeriod(d.period), d.fxRate?.toFixed()])).toEqual([['2026-06', '1100']])
    expect(blockedOccurrences(sub(), new Set(['2026-06']), rates, today)).toEqual([
      { period: { year: 2026, month: 7 }, reason: 'missing_fx_rate' },
    ])
  })

  it('CA-2: ninguna ocurrencia de USD se genera con tipo de cambio null, 0 ni de otro período', () => {
    const today = new Date(2026, 8, 15)
    const scenarios = [fx({}), fx({ '2026-06': '0' }), fx({ '2026-05': '1000', '2026-10': '1000' }), fx({ '2026-07': '1200' })]
    for (const rates of scenarios) {
      for (const draft of computeDueOccurrences({ ...sub(), amount: new Decimal('10') }, NONE, rates, today)) {
        expect(draft.fxRate).not.toBeNull()
        expect(draft.fxRate?.gt(0)).toBe(true)
        expect(draft.fxRate?.eq(rates.get(formatPeriod(draft.period)) as Decimal)).toBe(true)
      }
    }
  })

  it('CA-4: una suscripción en ARS nunca está bloqueada', () => {
    expect(blockedOccurrences(sub({ currency: 'ARS', amount: '5000.00' }), NONE, fx({}), new Date(2026, 9, 6))).toEqual([])
    expect(blockedOccurrences(sub({ currency: 'ARS', amount: '999999999999.99' }), NONE, null, new Date(2026, 9, 6))).toEqual([])
  })

  it('CA-5: una pausada o cancelada no está bloqueada', () => {
    const today = new Date(2026, 9, 6)
    expect(blockedOccurrences(sub({ status: 'paused' }), NONE, fx({}), today)).toEqual([])
    expect(blockedOccurrences(sub({ status: 'cancelled' }), NONE, fx({}), today)).toEqual([])
  })

  it('CA-6: USD sin TC del mes corriente antes del día de cobro (R5) no está bloqueada', () => {
    const rates = fx({ '2026-08': '1000', '2026-09': '1000' })
    const base = sub({ billingDay: 10, generateFromPeriod: { year: 2026, month: 8 } })
    expect(blockedOccurrences(base, NONE, rates, new Date(2026, 9, 6))).toEqual([])
    // El día de cobro la ocurrencia ya venció y, sin TC, se bloquea.
    expect(periodsOf(blockedOccurrences(base, NONE, rates, new Date(2026, 9, 10)))).toEqual(['2026-10'])
  })

  it('un período que ya tiene transacción (aunque se haya borrado) no está bloqueado (R2)', () => {
    expect(blockedOccurrences(sub(), new Set(['2026-06', '2026-07']), fx({}), new Date(2026, 7, 15))).toEqual([
      { period: { year: 2026, month: 8 }, reason: 'missing_fx_rate' },
    ])
  })

  it('un mes posterior al de fin no cuenta, y uno anterior sin TC sí', () => {
    const blocked = blockedOccurrences(sub({ endPeriod: { year: 2026, month: 7 } }), NONE, fx({ '2026-06': '1000' }), new Date(2026, 9, 6))
    expect(periodsOf(blocked)).toEqual(['2026-07'])
  })

  it('antes de generate_from_period no hay nada que bloquear (R8)', () => {
    const resumed = sub({ generateFromPeriod: { year: 2026, month: 10 }, billingDay: 1 })
    expect(blockedOccurrences(resumed, NONE, fx({ '2026-10': '1000' }), new Date(2026, 9, 6))).toEqual([])
  })

  it('el monto en pesos fuera de rango bloquea aunque haya tipo de cambio (ADR-030)', () => {
    const huge = sub({ amount: '999999999999.99', generateFromPeriod: { year: 2026, month: 7 } })
    expect(blockedOccurrences(huge, NONE, fx({ '2026-07': '2' }), new Date(2026, 6, 15))).toEqual([
      { period: { year: 2026, month: 7 }, reason: 'amount_ars_out_of_range' },
    ])
    const tiny = sub({ amount: '0.01', generateFromPeriod: { year: 2026, month: 7 } })
    expect(blockedOccurrences(tiny, NONE, fx({ '2026-07': '0.1' }), new Date(2026, 6, 15))[0]?.reason).toBe('amount_ars_out_of_range')
  })

  it('sin poder leer los tipos de cambio una USD no se puede juzgar: no se marca', () => {
    expect(blockedOccurrences(sub(), NONE, null, new Date(2026, 9, 6))).toEqual([])
  })
})

describe('blockedNotice y blockedMark (US-62)', () => {
  const missing = (...months: number[]) => months.map((month) => ({ period: { year: 2026, month }, reason: 'missing_fx_rate' as const }))

  it('un mes', () => {
    expect(blockedNotice(missing(7))).toEqual({
      paragraphs: ['Falta el tipo de cambio de julio 2026. Ese mes no se cargó; se carga en cuanto lo cargues.'],
      fxPeriod: '2026-07',
    })
  })

  it('dos meses', () => {
    expect(blockedNotice(missing(7, 8))?.paragraphs).toEqual([
      'Falta el tipo de cambio de julio 2026 y agosto 2026. Esos meses no se cargaron; se cargan en cuanto los cargues.',
    ])
  })

  it('CA-8: tres meses, con comas y "y"', () => {
    expect(blockedNotice(missing(7, 8, 9))?.paragraphs).toEqual([
      'Falta el tipo de cambio de julio 2026, agosto 2026 y septiembre 2026. Esos meses no se cargaron; se cargan en cuanto los cargues.',
    ])
  })

  it('CA-7: el botón lleva al mes más viejo que falta', () => {
    expect(blockedNotice(missing(7, 8, 9))?.fxPeriod).toBe('2026-07')
  })

  it('monto fuera de rango: texto exacto y sin botón', () => {
    expect(blockedNotice([{ period: { year: 2026, month: 7 }, reason: 'amount_ars_out_of_range' }])).toEqual({
      paragraphs: [
        'El gasto de julio 2026 no se pudo cargar porque en pesos supera $999.999.999.999,99 (o no llega a $0,01). Revisá el monto o el tipo de cambio de ese mes.',
      ],
      fxPeriod: null,
    })
  })

  it('varios montos fuera de rango van en plural', () => {
    const notice = blockedNotice([
      { period: { year: 2026, month: 7 }, reason: 'amount_ars_out_of_range' },
      { period: { year: 2026, month: 8 }, reason: 'amount_ars_out_of_range' },
    ])
    expect(notice?.paragraphs[0]).toBe(
      'Los gastos de julio 2026 y agosto 2026 no se pudieron cargar porque en pesos superan $999.999.999.999,99 (o no llegan a $0,01). Revisá el monto o el tipo de cambio de esos meses.',
    )
  })

  it('mezcla: un párrafo por motivo y el botón apunta al mes sin tipo de cambio', () => {
    const notice = blockedNotice([
      { period: { year: 2026, month: 7 }, reason: 'amount_ars_out_of_range' },
      { period: { year: 2026, month: 8 }, reason: 'missing_fx_rate' },
    ])
    expect(notice?.paragraphs).toHaveLength(2)
    expect(notice?.fxPeriod).toBe('2026-08')
  })

  it('sin períodos bloqueados no hay aviso ni marca', () => {
    expect(blockedNotice([])).toBeNull()
    expect(blockedMark([])).toBeNull()
  })

  it('la marca: "Falta tipo de cambio", o "No se pudo cargar" si solo hay montos fuera de rango', () => {
    expect(blockedMark(missing(7))).toEqual({ reason: 'missing_fx_rate', text: 'Falta tipo de cambio' })
    expect(blockedMark([{ period: { year: 2026, month: 7 }, reason: 'amount_ars_out_of_range' }])).toEqual({
      reason: 'amount_ars_out_of_range',
      text: 'No se pudo cargar',
    })
    expect(
      blockedMark([{ period: { year: 2026, month: 7 }, reason: 'amount_ars_out_of_range' }, ...missing(8)])?.text,
    ).toBe('Falta tipo de cambio')
  })
})

describe('blockedBySubscription (US-62)', () => {
  const today = new Date(2026, 7, 15)
  const hosting = sub({ id: 'hosting' })
  const netflix = sub({ id: 'netflix', currency: 'ARS', amount: '5000.00' })

  it('arma el mapa por id: la USD sin tipo de cambio bloqueada, la ARS no', () => {
    const blocked = blockedBySubscription([hosting, netflix], new Map(), fx({ '2026-06': '1000' }), today)
    expect(periodsOf(blocked.get('hosting') ?? [])).toEqual(['2026-07', '2026-08'])
    expect(blocked.get('netflix')).toEqual([])
  })

  it('usa los períodos generados de cada suscripción, no los de otra', () => {
    const generated = new Map([['hosting', new Set(['2026-06', '2026-07', '2026-08'])]])
    expect(blockedBySubscription([hosting], generated, fx({}), today).get('hosting')).toEqual([])
    expect(blockedBySubscription([hosting, { ...hosting, id: 'otra' }], generated, fx({}), today).get('otra')).toHaveLength(3)
  })

  it('sin los períodos generados no se juzga ninguna', () => {
    expect(blockedBySubscription([hosting, netflix], null, fx({}), today).size).toBe(0)
  })

  it('sin los tipos de cambio se juzga la ARS pero no la USD', () => {
    const huge = sub({ id: 'huge', currency: 'ARS', amount: '999999999999.99' })
    const blocked = blockedBySubscription([hosting, huge], new Map(), null, today)
    expect(blocked.get('hosting')).toEqual([])
    expect(blocked.get('huge')).toEqual([])
  })
})
