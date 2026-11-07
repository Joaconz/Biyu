import { describe, expect, it } from 'vitest'
import { donutSlicePath } from '@/lib/pie'

describe('donutSlicePath', () => {
  it('arranca a las 12 y gira en sentido horario, entre el radio interior y el exterior', () => {
    // 0° → arriba al centro; 90° → a la derecha. Exterior r=88, interior 56.
    expect(donutSlicePath(0, 90, 88, 56)).toBe('M88.00 0.00 A88 88 0 0 1 176.00 88.00 L144.00 88.00 A56 56 0 0 0 88.00 32.00 Z')
  })
  it('usa el arco largo pasados los 180°, en los dos bordes', () => {
    const d = donutSlicePath(0, 270, 88, 56)
    expect(d).toContain('A88 88 0 1 1')
    expect(d).toContain('A56 56 0 1 0')
  })
  it('un tramo de 360° son dos circunferencias, la interior hace el hueco', () => {
    expect(donutSlicePath(0, 360, 88, 56)).toBe(
      'M88 0 A88 88 0 1 1 88 176 A88 88 0 1 1 88 0 Z M88 32 A56 56 0 1 1 88 144 A56 56 0 1 1 88 32 Z',
    )
  })
})
