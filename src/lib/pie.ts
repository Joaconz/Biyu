// Geometría SVG de la dona de "Por categoría" (US-72, ADR-038, ADR-050). Los ángulos llegan ya
// calculados en Decimal desde src/domain/categoryChart.ts; acá solo se convierten a coordenadas.

/** Punto de la circunferencia de radio `r` a `deg` grados desde las 12, en sentido horario; el centro es (c, c). */
function pointAt(c: number, r: number, deg: number): string {
  const rad = (deg * Math.PI) / 180
  return `${(c + r * Math.sin(rad)).toFixed(2)} ${(c - r * Math.cos(rad)).toFixed(2)}`
}

/**
 * `d` de un tramo del anillo de `startDeg` a `endDeg`, entre el radio interior `innerR` y el exterior
 * `r`. Un tramo de 360° no se puede trazar con un solo arco (el inicio y el fin coinciden): se dibujan
 * las dos circunferencias con dos semicírculos cada una y el centro queda vacío por la regla evenodd
 * (el elemento lleva `fill-rule="evenodd"`).
 */
export function donutSlicePath(startDeg: number, endDeg: number, r: number, innerR: number): string {
  const c = r
  const sweep = endDeg - startDeg
  if (sweep >= 360) {
    return (
      `M${c} 0 A${r} ${r} 0 1 1 ${c} ${2 * r} A${r} ${r} 0 1 1 ${c} 0 Z ` +
      `M${c} ${c - innerR} A${innerR} ${innerR} 0 1 1 ${c} ${c + innerR} A${innerR} ${innerR} 0 1 1 ${c} ${c - innerR} Z`
    )
  }
  const largeArc = sweep > 180 ? 1 : 0
  return (
    `M${pointAt(c, r, startDeg)} A${r} ${r} 0 ${largeArc} 1 ${pointAt(c, r, endDeg)} ` +
    `L${pointAt(c, innerR, endDeg)} A${innerR} ${innerR} 0 ${largeArc} 0 ${pointAt(c, innerR, startDeg)} Z`
  )
}
