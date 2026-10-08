import { describe, expect, it } from 'vitest'
import { pieSlicePath } from '@/lib/pie'

describe('pieSlicePath', () => {
  it('arranca a las 12 y gira en sentido horario', () => {
    // 0° → arriba al centro; 90° → borde derecho.
    expect(pieSlicePath(0, 90, 88)).toBe('M88 88 L88.00 0.00 A88 88 0 0 1 176.00 88.00 Z')
  })
  it('usa el arco largo pasados los 180°', () => {
    expect(pieSlicePath(0, 270, 88)).toContain('A88 88 0 1 1')
  })
  it('una porción de 360° es un círculo completo con dos arcos', () => {
    expect(pieSlicePath(0, 360, 88)).toBe('M88 0 A88 88 0 1 1 88 176 A88 88 0 1 1 88 0 Z')
  })
})
