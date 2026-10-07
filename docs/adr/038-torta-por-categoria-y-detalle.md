# ADR-038 — Torta por categoría en el Resumen y evolución en el detalle de la categoría

**Estado:** aceptada · **Fecha:** 2026-10 · Modifica parcialmente ADR-023 (alternativa "dona")

## Contexto

FR-20 pedía originalmente una torta por categoría y un gráfico de evolución de los últimos meses.
En V1, [#78](https://github.com/Joaconz/Biyu/issues/78) lo ajustó: el desglose por categoría quedó en
barras (US-27, CP-DAS-004) y la evolución salió de FR-20 "para una historia específica posterior".
ADR-023 descartó además la dona porque con seis u ocho categorías los ángulos no se comparan a
simple vista.

Usando V1, la lista de barras responde bien "cuánto en cada una" pero no "qué parte del total", que
es lo que se busca al abrir el Resumen. Las ideas del backlog [#170](https://github.com/Joaconz/Biyu/issues/170)
(torta) y [#171](https://github.com/Joaconz/Biyu/issues/171) (detalle con evolución) vuelven a
abrir la decisión para V2, ahora como US-72 ([#242](https://github.com/Joaconz/Biyu/issues/242)) y US-73 ([#243](https://github.com/Joaconz/Biyu/issues/243)).

## Decisión

1. **Torta además de la lista, no en su lugar.** En "Por categoría" se dibuja una torta (círculo lleno,
   sin hueco) arriba de la lista de barras de US-27. La torta da la proporción de un vistazo, y la
   lista sigue siendo la lectura exacta (monto y porcentaje) y la leyenda. Así se evita el problema que
   ADR-023 le encontraba a la dona: nadie tiene que comparar ángulos para saber un número.
2. **Como mucho 6 porciones.** Con 7 categorías con gasto o más, la torta muestra las 5 mayores y una
   porción "Resto (N categorías)" en el gris del borde de control (`--input`, `#948877` en `src/index.css`, ADR-023). La lista muestra todas.
   Las porciones se separan con un filete de 2 px del color de la superficie: las categorías propias
   pueden repetir color y "Resto" es parecido a "Otros", así que sin filete se fundirían.
3. **Las porciones no son interactivas.** El acceso al detalle es la fila de la lista: es un blanco de
   toque más grande, tiene nombre accesible y su `data-testid` existe desde V1. Una porción
   chica no cumple con nada de eso.
4. **La evolución va en el detalle de la categoría, no en el Resumen.** `/dashboard/categories/:categoryId?period=AAAA-MM`
   muestra el total del período, los últimos 6 meses en barras verticales y la lista de gastos. La
   categoría va en la ruta y el período en la URL (C11).
5. **Sin librería de gráficos.** Torta y barras se dibujan con SVG propio a partir de los montos que
   ya calcula el dominio (`decimal.js`, C2). Los ángulos salen del monto exacto, no del porcentaje
   redondeado, y cada porción los expone en `data-start-angle` y `data-end-angle` para que se puedan
   verificar.
6. **Mismos datos que el Resumen.** Todo sale de `ledger_entries` del período, sin recalcular el
   prorrateo (ADR-001), con gastos no eliminados (I10) en `amount_ars` (I1', C5). A igual monto, las
   categorías se ordenan por nombre (y, si el nombre coincide, la activa primero y después por `id`)
   para que el orden sea determinista.

## Alternativas descartadas

- **Mantener solo las barras (V1).** No cuesta nada y CP-DAS-004 sigue igual, pero no responde la
  pregunta de proporción que motivó #170.
- **Reemplazar las barras por la torta.** Es la torta clásica de las apps de finanzas, pero vuelve el
  problema de ADR-023: con 8 categorías hay que leer los montos en una leyenda aparte y comparar
  ángulos chicos.
- **Dona con el total en el centro.** El total ya está en la tarjeta verde, la única superficie sólida
  del Resumen (ADR-023); repetirlo compite con ella.
- **Detalle como `/transactions?category=…`** (lo que sugería #171). Reusa Movimientos, pero mezcla la
  lista general con un resumen de categoría y Movimientos deja de ser pestaña en V2 (ADR-023). Una
  ruta propia bajo `/dashboard` deja marcado "Resumen" y separa los testids.
- **Recharts u otra librería.** Resuelve tooltips y animaciones, pero suma decenas de kB para una torta y
  seis barras, y trae su propio formato de números, que habría que pisar para no usar `number` en
  los montos (C2).

## Consecuencias

- **FR-20 cambia.** Vuelve a tener torta, ahora junto con las barras, y la evolución por categoría
  vuelve a estar cubierta (US-73). Se actualizaron el texto de FR-20 en `docs/pre-entrega.md`, su
  fila y la de #78 en `docs/08-trazabilidad.md`; la alternativa "dona" de ADR-023 apunta acá, y la fila
  "Gráficos" del stack de `docs/03-architecture-spec.md` deja de planificar Recharts.
- **ADR-023 cambia en un punto.** La alternativa "Gráfico de dona" sigue descartada como reemplazo
  de las barras, pero la torta como complemento queda decidida acá.
- **Regresión.** CP-DAS-004 (US-27) es candidato a la regresión de V2 con el criterio de ADR-027: la
  sección cambia y suma el desempate por nombre.
- **Costo de prueba.** Hay más estados que verificar: la agrupación en "Resto" (6 contra 7 categorías), el
  redondeo que no suma 100, la categoría archivada, la cuota heredada, el período en la URL del
  detalle y la categoría de otro usuario (RLS, C7). Los criterios de US-72 y US-73 los dejan con
  montos exactos.
- **Accesibilidad.** La torta es una imagen con texto alternativo y no recibe foco; la información
  navegable es la lista.
- No toca el schema, la RPC ni RLS: es lectura de tablas que ya tienen sus políticas.
