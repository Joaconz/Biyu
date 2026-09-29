import { describe, expect, it } from 'vitest'
import { formatRate, parseMoney } from '@/domain/money'
import { formatPercentage } from '@/domain/summary'
import { daysElapsedInPeriod, formatDayHeading, formatDayShort } from '@/domain/period'

// Mediodía local: evita que el día cambie según la zona horaria de la máquina que corre los tests.
const today = new Date(2026, 8, 28, 12)

describe('formatDayShort', () => {
  it('día y mes abreviado, sin cero a la izquierda', () => {
    expect(formatDayShort('2026-09-07')).toBe('7 sep')
    expect(formatDayShort('2026-12-31')).toBe('31 dic')
  })
})

describe('formatDayHeading', () => {
  it('Hoy y Ayer relativos a today', () => {
    expect(formatDayHeading('2026-09-28', today)).toBe('Hoy')
    expect(formatDayHeading('2026-09-27', today)).toBe('Ayer')
  })

  it('otro día: día de la semana, número y mes', () => {
    expect(formatDayHeading('2026-09-25', today)).toBe('viernes 25 de septiembre')
    expect(formatDayHeading('2026-03-01', today)).toBe('domingo 1 de marzo')
  })
})

describe('daysElapsedInPeriod', () => {
  it('mes actual: hasta hoy inclusive', () => {
    expect(daysElapsedInPeriod({ year: 2026, month: 9 }, today)).toBe(28)
  })

  it('mes pasado: el mes entero, con febrero bisiesto', () => {
    expect(daysElapsedInPeriod({ year: 2026, month: 8 }, today)).toBe(31)
    expect(daysElapsedInPeriod({ year: 2024, month: 2 }, today)).toBe(29)
  })

  it('mes futuro: 0', () => {
    expect(daysElapsedInPeriod({ year: 2026, month: 10 }, today)).toBe(0)
  })
})

describe('formatRate', () => {
  it('formato argentino con 2 a 4 decimales, sin redondear la columna numeric(14,4)', () => {
    expect(formatRate(parseMoney('1350'))).toBe('1.350,00')
    expect(formatRate(parseMoney('1350.2500'))).toBe('1.350,25')
    expect(formatRate(parseMoney('1350.2575'))).toBe('1.350,2575')
    expect(formatRate(parseMoney('999.5'))).toBe('999,50')
  })
})

describe('formatPercentage', () => {
  it('siempre un decimal, con coma', () => {
    expect(formatPercentage(54.4)).toBe('54,4 %')
    expect(formatPercentage(10)).toBe('10,0 %')
    expect(formatPercentage(100)).toBe('100,0 %')
  })
})
