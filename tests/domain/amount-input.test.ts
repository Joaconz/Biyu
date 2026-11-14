import { describe, expect, it } from 'vitest'
import { formatAmountInput, formatAmountText } from '../../src/domain/amountInput'
import { tryParseMoney } from '../../src/domain/money'

/** Tipea un carácter al final de lo que ya hay en el campo. */
const type = (prev: string, ch: string) => formatAmountInput(prev + ch, prev).text
const typeAll = (s: string) => [...s].reduce((acc, ch) => type(acc, ch), '')

describe('formatAmountInput: tipeo (US-99)', () => {
  it('agrupa los miles mientras se escribe', () => {
    expect(typeAll('12500')).toBe('12.500')
    expect(typeAll('1234567')).toBe('1.234.567')
    expect(typeAll('999')).toBe('999')
  })
  it('acepta la coma decimal y no agrupa los decimales', () => {
    expect(typeAll('12500,5')).toBe('12.500,5')
    expect(typeAll('1234,5678')).toBe('1.234,5678')
  })
  it('un punto tipeado vale como coma decimal', () => {
    expect(typeAll('12.5')).toBe('12,5')
  })
  it('ignora una segunda coma y las letras', () => {
    expect(typeAll('12,5,3')).toBe('12,53')
    expect(typeAll('1a2b')).toBe('12')
  })
  it('vacío y solo coma', () => {
    expect(formatAmountInput('').text).toBe('')
    expect(type('', ',')).toBe('0,')
    expect(formatAmountInput('').caret).toBe(0)
  })
  it('sin ceros a la izquierda', () => {
    expect(typeAll('007')).toBe('7')
    expect(typeAll('0,5')).toBe('0,5')
    expect(typeAll('00')).toBe('0')
  })
  it('solo deja el signo menos al principio', () => {
    expect(typeAll('-1500')).toBe('-1.500')
    expect(formatAmountInput('1-5', '15', { caret: 2 }).text).toBe('15')
  })
})

describe('formatAmountInput: pegar', () => {
  it('un valor con punto decimal de la base', () => {
    expect(formatAmountInput('1234.56').text).toBe('1.234,56')
    expect(formatAmountInput('12500.50', '').text).toBe('12.500,50')
  })
  it('un valor ya en es-AR', () => {
    expect(formatAmountInput('1.234.567,89').text).toBe('1.234.567,89')
  })
  it('puntos de miles sin coma son un entero, como tryParseMoney', () => {
    expect(formatAmountInput('1.500').text).toBe('1.500')
    expect(formatAmountInput('12.345.678').text).toBe('12.345.678')
  })
  it('descarta símbolos y espacios', () => {
    expect(formatAmountInput('$ 1.250,5').text).toBe('1.250,5')
  })
  it('pegado en medio de lo que ya había', () => {
    expect(formatAmountInput('12345', '12', { caret: 5 }).text).toBe('12.345')
  })
})

describe('formatAmountInput: borrar', () => {
  it('Backspace sobre el último dígito reagrupa', () => {
    expect(formatAmountInput('12.50', '12.500').text).toBe('1.250')
  })
  it('borrar hasta vaciar', () => {
    expect(formatAmountInput('', '1').text).toBe('')
  })
  it('Backspace sobre un punto de miles borra el dígito de la izquierda', () => {
    const r = formatAmountInput('1234', '1.234', { caret: 1 })
    expect(r.text).toBe('234')
  })
  it('Supr sobre un punto de miles borra el dígito de la derecha', () => {
    const r = formatAmountInput('1234', '1.234', { caret: 1, backward: false })
    expect(r.text).toBe('134')
  })
  it('borrar la coma deja los decimales como parte entera', () => {
    expect(formatAmountInput('125005', '12.500,5', { caret: 5 }).text).toBe('125.005')
  })
})

describe('formatAmountInput: cursor', () => {
  it('al tipear al final, queda al final', () => {
    const r = formatAmountInput('12.5000', '12.500')
    expect(r.text).toBe('125.000')
    expect(r.caret).toBe(r.text.length)
  })
  it('al tipear en el medio, queda justo después del dígito', () => {
    const r = formatAmountInput('19.234', '1.234', { caret: 2 })
    expect(r.text).toBe('19.234')
    expect(r.caret).toBe(2)
  })
  it('cuando se agrega un punto de miles, el cursor sigue a su dígito', () => {
    const r = formatAmountInput('1999', '999', { caret: 1 })
    expect(r.text).toBe('1.999')
    expect(r.caret).toBe(1)
  })
  it('con solo coma, el cursor queda después de la coma', () => {
    const r = formatAmountInput(',', '')
    expect(r.text).toBe('0,')
    expect(r.caret).toBe(2)
  })
})

describe('formatAmountText', () => {
  it('formatea un valor cargado sin edición', () => {
    expect(formatAmountText('12500.5')).toBe('12.500,5')
    expect(formatAmountText('')).toBe('')
  })
  it('es idempotente sobre texto ya formateado', () => {
    for (const s of ['12.500', '12.500,5', '0,', '1.234.567,89', '-1.500', '7']) {
      expect(formatAmountText(s)).toBe(s)
    }
  })
})

describe('el valor que se guarda no cambia', () => {
  it.each([
    ['12500', '12500'],
    ['12500,5', '12500.5'],
    ['1234567,89', '1234567.89'],
    ['0,05', '0.05'],
  ])('«%s» tipeado → mismo Decimal que sin formato', (typed, expected) => {
    const shown = typeAll(typed)
    expect(tryParseMoney(shown)?.toFixed()).toBe(expected)
    expect(tryParseMoney(shown)?.eq(tryParseMoney(typed)!)).toBe(true)
  })
})
