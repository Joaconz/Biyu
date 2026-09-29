import { describe, expect, it } from 'vitest'
import { groupByDay } from '@/lib/transactionGroups'

describe('groupByDay', () => {
  it('corta donde cambia el día y conserva el orden de la consulta', () => {
    const rows = [
      { id: 'a', occurred_on: '2026-09-27' },
      { id: 'b', occurred_on: '2026-09-27' },
      { id: 'c', occurred_on: '2026-09-25' },
    ]
    expect(groupByDay(rows)).toEqual([
      { date: '2026-09-27', items: [rows[0], rows[1]] },
      { date: '2026-09-25', items: [rows[2]] },
    ])
  })

  it('lista vacía → sin grupos', () => {
    expect(groupByDay([])).toEqual([])
  })
})
