// Geometría SVG de la torta de "Por categoría" (US-72, ADR-038). Los ángulos llegan ya calculados
// en Decimal desde src/domain/categoryChart.ts; acá solo se convierten a coordenadas para dibujar.

/** Punto de la circunferencia a `deg` grados desde las 12, en sentido horario. */
function pointAt(cx: number, cy: number, r: number, deg: number): string {
  const rad = (deg * Math.PI) / 180
  return `${(cx + r * Math.sin(rad)).toFixed(2)} ${(cy - r * Math.cos(rad)).toFixed(2)}`
}

/**
 * `d` de una porción de `startDeg` a `endDeg`. Una porción de 360° no se puede trazar con un solo
 * arco (el inicio y el fin coinciden), así que se dibuja el círculo con dos semicírculos.
 */
export function pieSlicePath(startDeg: number, endDeg: number, r: number): string {
  const c = r
  const sweep = endDeg - startDeg
  if (sweep >= 360) {
    return `M${c} 0 A${r} ${r} 0 1 1 ${c} ${2 * r} A${r} ${r} 0 1 1 ${c} 0 Z`
  }
  const largeArc = sweep > 180 ? 1 : 0
  return `M${c} ${c} L${pointAt(c, c, r, startDeg)} A${r} ${r} 0 ${largeArc} 1 ${pointAt(c, c, r, endDeg)} Z`
}
