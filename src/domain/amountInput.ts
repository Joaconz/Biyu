// Formato es-AR del monto mientras se tipea (US-99). Puro: no toca decimal.js ni el DOM.
// El texto que devuelve («12.500,5») es el mismo que `tryParseMoney` ya entiende, así que el valor
// que se guarda no cambia: sigue entrando a decimal.js como string (C2).

export type AmountEditOptions = {
  /** Posición del cursor en `raw` después de la edición. Por defecto, al final. */
  caret?: number
  /** Si fue un borrado hacia atrás (Backspace) o hacia adelante (Supr). Por defecto, hacia atrás. */
  backward?: boolean
}

export type AmountEdit = { text: string; caret: number }

const THOUSANDS_ONLY_RE = /^\d{1,3}(?:\.\d{3})+$/

/**
 * Texto pegado o cargado de golpe → sin puntos de miles y con coma decimal.
 * Con coma, la coma es el decimal y los puntos son miles. Sin coma, grupos de exactamente 3
 * dígitos son miles («1.500» = 1500, como tryParseMoney) y cualquier otro punto es el decimal
 * («1234.56» → «1234,56»; «12.5» → «12,5»).
 */
function normalizeBulk(text: string): string {
  const sign = text.trimStart().startsWith('-') ? '-' : ''
  return sign + normalizeUnsigned(text)
}

function normalizeUnsigned(text: string): string {
  const t = text.replace(/[^\d.,]/g, '')
  if (t.includes(',')) return t.replace(/\./g, '')
  if (THOUSANDS_ONLY_RE.test(t)) return t.replace(/\./g, '')
  const i = t.lastIndexOf('.')
  if (i === -1) return t
  return `${t.slice(0, i).replace(/\./g, '')},${t.slice(i + 1).replace(/\./g, '')}`
}

/**
 * Deja un único signo inicial, una única coma, sin ceros a la izquierda y con los miles agrupados.
 * Ignora todo lo que no sea dígito o coma (los puntos de entrada se descartan).
 */
function layout(text: string): string {
  const sign = text.trimStart().startsWith('-') ? '-' : ''
  const body = text.replace(/[^\d,]/g, '')
  const comma = body.indexOf(',')
  const dec = comma === -1 ? null : body.slice(comma + 1).replace(/,/g, '')
  let int = (comma === -1 ? body : body.slice(0, comma)).replace(/^0+(?=\d)/, '')
  if (int === '' && dec !== null) int = '0'
  if (int === '' && dec === null) return sign
  return `${sign}${int.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}${dec === null ? '' : `,${dec}`}`
}

const isSignificant = (c: string) => c !== '.' && /[\d,]/.test(c)

/** Cantidad de dígitos y comas desde `pos` hasta el final. */
function significantAfter(text: string, pos: number): number {
  let n = 0
  for (let i = pos; i < text.length; i++) if (isSignificant(text[i])) n++
  return n
}

/** Posición en `text` que deja `count` dígitos/comas a su derecha. */
function positionWithRight(text: string, count: number): number {
  let n = 0
  for (let i = text.length - 1; i >= 0; i--) {
    if (n === count) {
      let pos = i + 1
      while (pos > 0 && text[pos - 1] === '.') pos-- // antes del punto, no después
      return pos
    }
    if (isSignificant(text[i])) n++
  }
  // Quedan `count` o menos a la derecha: el cursor va después del signo, si hay.
  return text.startsWith('-') ? 1 : 0
}

/**
 * Aplica una edición del input (`raw` es lo que el navegador dejó en el campo; `prev`, lo que se
 * mostraba antes) y devuelve el texto con formato es-AR y dónde dejar el cursor.
 *
 * - Al tipear o borrar, los puntos son siempre miles (el campo solo muestra puntos de miles).
 * - Un «.» recién tipeado vale como coma decimal (teclado numérico), si todavía no hay coma.
 * - Un texto pegado (varios caracteres) se interpreta entero: «1234.56» → «1.234,56».
 * - Borrar un punto de miles borra el dígito vecino; si no, el cursor quedaría trabado.
 * - Sin letras, sin coma repetida, sin ceros a la izquierda; el «-» solo al principio.
 */
export function formatAmountInput(raw: string, prev = '', options: AmountEditOptions = {}): AmountEdit {
  const caret = Math.min(options.caret ?? raw.length, raw.length)
  const backward = options.backward ?? true

  // Qué cambió respecto de lo que se mostraba: prefijo y sufijo comunes.
  const limit = Math.min(prev.length, raw.length)
  let start = 0
  while (start < limit && prev[start] === raw[start]) start++
  let end = 0
  while (end < limit - start && prev[prev.length - 1 - end] === raw[raw.length - 1 - end]) end++
  const inserted = raw.slice(start, raw.length - end)
  const removed = prev.slice(start, prev.length - end)

  let working = raw
  let at = caret
  if (inserted.length > 1 || (prev === '' && inserted.length > 0)) {
    // Pegado (o valor cargado de golpe): se interpreta el texto nuevo completo.
    const head = raw.slice(0, start)
    const bulk = normalizeBulk(inserted)
    working = head + bulk + raw.slice(raw.length - end)
    at = head.length + bulk.length
  } else if (inserted === '.') {
    // Un punto tipeado es la coma decimal; si ya hay una, se ignora.
    const hasComma = prev.includes(',')
    working = raw.slice(0, start) + (hasComma ? '' : ',') + raw.slice(start + 1)
    at = hasComma ? start : start + 1
  } else if (inserted === '' && removed === '.') {
    // Se borró un punto de miles: se borra también el dígito de ese lado.
    const digit = backward ? start - 1 : start
    if (digit >= 0 && /\d/.test(working[digit] ?? '')) {
      working = working.slice(0, digit) + working.slice(digit + 1)
      at = backward ? start - 1 : start
    }
  }

  const text = layout(working)
  return { text, caret: positionWithRight(text, significantAfter(working, at)) }
}

/** Valor que se carga sin edición (inicial, restaurado): «12500.5» → «12.500,5». Idempotente sobre texto ya formateado. */
export function formatAmountText(value: string): string {
  return layout(normalizeBulk(value))
}
