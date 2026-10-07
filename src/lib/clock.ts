// Único lugar de la app que lee el reloj (C1). El dominio recibe `today` por parámetro.
export function today(): Date {
  return new Date()
}

const ARGENTINA_DAY = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Argentina/Buenos_Aires',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
})

/**
 * Hoy en Argentina (ADR-031 §7), el mismo día que usan las RPC (ADR-021), no el del dispositivo: entre
 * las 21 y las 24 h de Argentina el reloj en UTC ya es mañana. Devuelve la medianoche local de ese día
 * calendario, así `currentPeriod`, `toIsoDate` y el resto de `domain/period.ts` lo leen tal cual.
 */
export function todayInArgentina(): Date {
  const parts = ARGENTINA_DAY.formatToParts(new Date())
  const part = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((p) => p.type === type)?.value)
  return new Date(part('year'), part('month') - 1, part('day'))
}
