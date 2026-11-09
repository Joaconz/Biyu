// Presentación de categorías y cuentas (ADR-023). Sin Supabase ni React: se testea en tests/lib/.
import { toTestIdSuffix } from './utils'

/** Paleta apagada de categorías: la del seed y la del selector de color de Ajustes. */
export const CATEGORY_PALETTE = {
  comida: '#b5653a',
  transporte: '#3e5c76',
  servicios: '#4a7a6d',
  entretenimiento: '#6b4e71',
  salud: '#9a3b3b',
  educacion: '#a68a3e',
  indumentaria: '#a1666e',
  otros: '#7d7368',
  musgo: '#6f7d4a',
  pizarra: '#4f5b66',
} as const

/**
 * Colores saturados que guardaba la paleta anterior → su equivalente apagado. Son datos del usuario:
 * no se migran, se traducen al mostrarlos. Al editar una categoría se guarda el color nuevo.
 */
const LEGACY_TO_HERITAGE: Record<string, string> = {
  '#f97316': CATEGORY_PALETTE.comida,
  '#3b82f6': CATEGORY_PALETTE.transporte,
  '#14b8a6': CATEGORY_PALETTE.servicios,
  '#a855f7': CATEGORY_PALETTE.entretenimiento,
  '#ef4444': CATEGORY_PALETTE.salud,
  '#eab308': CATEGORY_PALETTE.educacion,
  '#ec4899': CATEGORY_PALETTE.indumentaria,
  '#64748b': CATEGORY_PALETTE.otros,
  '#22c55e': CATEGORY_PALETTE.musgo,
  '#0ea5e9': CATEGORY_PALETTE.pizarra,
}

/** Categorías sembradas (FR-04), por su nombre normalizado. */
const SEEDED: Record<string, { color: string; icon: CategoryIconKey }> = {
  'comida-y-supermercado': { color: CATEGORY_PALETTE.comida, icon: 'basket' },
  transporte: { color: CATEGORY_PALETTE.transporte, icon: 'bus' },
  servicios: { color: CATEGORY_PALETTE.servicios, icon: 'bolt' },
  entretenimiento: { color: CATEGORY_PALETTE.entretenimiento, icon: 'ticket' },
  salud: { color: CATEGORY_PALETTE.salud, icon: 'health' },
  educacion: { color: CATEGORY_PALETTE.educacion, icon: 'education' },
  indumentaria: { color: CATEGORY_PALETTE.indumentaria, icon: 'shirt' },
  otros: { color: CATEGORY_PALETTE.otros, icon: 'other' },
}

export type CategoryIconKey = 'basket' | 'bus' | 'bolt' | 'ticket' | 'health' | 'education' | 'shirt' | 'other'

/**
 * Color con el que se muestra una categoría: traduce la paleta vieja y cubre el color nulo. En el tema
 * oscuro (ADR-052) lo aclara con `darkCategoryColor`, para que barras y porciones se lean sobre la tarjeta.
 */
export function displayCategoryColor(color: string | null | undefined, name: string, theme: 'light' | 'dark' = 'light'): string {
  let base: string
  if (color) {
    const normalized = color.trim().toLowerCase()
    base = LEGACY_TO_HERITAGE[normalized] ?? normalized
  } else {
    base = SEEDED[toTestIdSuffix(name)]?.color ?? CATEGORY_PALETTE.otros
  }
  return theme === 'dark' ? darkCategoryColor(base) : base
}

/**
 * Variante oscura de un color de categoría (ADR-052): 30 % de blanco. Con la paleta apagada queda en
 * 4,2:1 o más contra la tarjeta oscura (#0b2b26), por encima del 3:1 que piden los gráficos (WCAG 1.4.11).
 * Un color que no es `#rrggbb` vuelve sin cambios.
 */
export function darkCategoryColor(hex: string): string {
  const match = /^#([0-9a-f]{6})$/i.exec(hex.trim())
  if (!match) return hex
  const channels = [0, 2, 4].map((i) => parseInt(match[1].slice(i, i + 2), 16))
  return `#${channels.map((c) => Math.round(c * 0.7 + 255 * 0.3).toString(16).padStart(2, '0')).join('')}`
}

/** Ícono de una categoría sembrada; null para las creadas por el usuario (se muestra un punto de color). */
export function categoryIconKey(name: string): CategoryIconKey | null {
  return SEEDED[toTestIdSuffix(name)]?.icon ?? null
}

/** Orden de la grilla de Registrar: alfabético, con "Otros" siempre al final. */
export function sortCategoriesForGrid<T extends { name: string }>(categories: readonly T[]): T[] {
  return [...categories].sort((a, b) => {
    const aOther = toTestIdSuffix(a.name) === 'otros'
    const bOther = toTestIdSuffix(b.name) === 'otros'
    if (aOther !== bOther) return aOther ? 1 : -1
    return a.name.localeCompare(b.name, 'es')
  })
}

/**
 * Ancho de un carácter de monto en `em` (Inter en negrita, cifras tabulares), con margen. Los
 * signos ($ . , -) son más angostos que las cifras, así que alcanza con medir todo como cifra.
 */
const AMOUNT_CHAR_EM = 0.62

/**
 * `font-size` que hace entrar un monto en una sola línea del ancho de su contenedor (DEF-021).
 * Usa unidades de container query: el contenedor lleva la clase `@container`, y el tamaño
 * máximo sale de `--amount-max`, que cada tarjeta fija con su token de tipografía.
 */
export function fitAmountFontSize(text: string): string {
  return `min(var(--amount-max), calc(100cqi / ${(text.length * AMOUNT_CHAR_EM).toFixed(2)}))`
}

/**
 * Ingresos y Balance van lado a lado en el celular, a media pantalla. Desde este largo
 * ("$999.999.999,99" tiene 15) se apilan para que el monto no quede ilegible (DEF-021).
 */
export const SIDE_BY_SIDE_AMOUNT_MAX_LENGTH = 14

/**
 * Parte un monto ya formateado en la parte entera y los centavos (ADR-052): la protagonista muestra
 * «$436.850» grande y «,50» más chico y apagado. Trabaja sobre el texto de `formatArs`/`formatUsd`,
 * nunca sobre un número (C2). Sin centavos reconocibles, todo queda en `whole`.
 */
export function splitAmountText(text: string): { whole: string; cents: string | null } {
  const match = /^(.*\d)(,\d{2})$/.exec(text)
  return match ? { whole: match[1], cents: match[2] } : { whole: text, cents: null }
}
