import { describe, expect, it } from 'vitest'
import { computeDeletionImpact, getTransactionDeletionImpact } from '@/domain/deletion'
import { Decimal, parseMoney } from '@/domain/money'
import { isPeriodBefore } from '@/domain/period'

describe('isPeriodBefore', () => {
  it('compara períodos correctamente', () => {
    expect(isPeriodBefore({ year: 2026, month: 8 }, { year: 2026, month: 9 })).toBe(true)
    expect(isPeriodBefore({ year: 2025, month: 12 }, { year: 2026, month: 1 })).toBe(true)
    expect(isPeriodBefore({ year: 2026, month: 9 }, { year: 2026, month: 9 })).toBe(false)
    expect(isPeriodBefore({ year: 2026, month: 10 }, { year: 2026, month: 9 })).toBe(false)
    expect(isPeriodBefore({ year: 2027, month: 1 }, { year: 2026, month: 12 })).toBe(false)
  })
})

describe('deletion impact (US-65, C10, FR-08)', () => {
  const todaySept2026 = new Date(2026, 8, 27) // 27 sep 2026
  const todayOct2026 = new Date(2026, 9, 5) // 5 oct 2026

  it('gasto en el mes actual no impacta meses cerrados', () => {
    const impact = getTransactionDeletionImpact(
      {
        amount: parseMoney('15000'),
        fxRate: null,
        installmentsCount: 1,
        occurredOn: '2026-09-10',
        type: 'expense',
      },
      todaySept2026,
    )

    expect(impact.hasClosedPeriodImpact).toBe(false)
    expect(impact.affectedPeriods).toHaveLength(0)
    expect(impact.totalClosedAmountArs.toNumber()).toBe(0)
  })

  it('gasto de contado en mes anterior avisa que afecta ese mes cerrado', () => {
    const impact = getTransactionDeletionImpact(
      {
        amount: parseMoney('25000'),
        fxRate: null,
        installmentsCount: 1,
        occurredOn: '2026-08-15',
        type: 'expense',
      },
      todaySept2026,
    )

    expect(impact.hasClosedPeriodImpact).toBe(true)
    expect(impact.affectedPeriods).toHaveLength(1)
    expect(impact.affectedPeriods[0].period).toEqual({ year: 2026, month: 8 })
    expect(impact.affectedPeriods[0].amountArs.eq(parseMoney('25000'))).toBe(true)
    expect(impact.totalClosedAmountArs.eq(parseMoney('25000'))).toBe(true)
  })

  it('sad path del spec: compra de agosto en 12 cuotas borrada en octubre avisa agosto y septiembre', () => {
    // 120.000 ARS en 12 cuotas de 10.000 ARS
    const impact = getTransactionDeletionImpact(
      {
        amount: parseMoney('120000'),
        fxRate: null,
        installmentsCount: 12,
        occurredOn: '2026-08-10',
        type: 'expense',
      },
      todayOct2026,
    )

    expect(impact.hasClosedPeriodImpact).toBe(true)
    expect(impact.affectedPeriods).toHaveLength(2)

    expect(impact.affectedPeriods[0].period).toEqual({ year: 2026, month: 8 })
    expect(impact.affectedPeriods[0].amountArs.eq(parseMoney('10000'))).toBe(true)
    expect(impact.affectedPeriods[0].installmentNumber).toBe(1)

    expect(impact.affectedPeriods[1].period).toEqual({ year: 2026, month: 9 })
    expect(impact.affectedPeriods[1].amountArs.eq(parseMoney('10000'))).toBe(true)
    expect(impact.affectedPeriods[1].installmentNumber).toBe(2)

    expect(impact.totalClosedAmountArs.eq(parseMoney('20000'))).toBe(true)
  })

  it('compra en USD en cuotas calcula el impacto en ARS según la conversión de la transacción', () => {
    // USD 100 con fx_rate 1250 = 125.000 ARS en 2 cuotas de 62.500 ARS
    const impact = getTransactionDeletionImpact(
      {
        amount: parseMoney('100'),
        fxRate: parseMoney('1250'),
        installmentsCount: 2,
        occurredOn: '2026-08-15',
        type: 'expense',
      },
      todaySept2026,
    )

    expect(impact.hasClosedPeriodImpact).toBe(true)
    expect(impact.affectedPeriods).toHaveLength(1)
    expect(impact.affectedPeriods[0].period).toEqual({ year: 2026, month: 8 })
    expect(impact.affectedPeriods[0].amountArs.eq(parseMoney('62500'))).toBe(true)
    expect(impact.totalClosedAmountArs.eq(parseMoney('62500'))).toBe(true)
  })
})
