# Entrega 2 · Historias de V2 · Dashboard por categoría

Feature del nivel 2 de V2 (`entrega-2/README.md`, "Alcance de V2"). Son dos historias nuevas que
reemplazan las ideas del backlog [#170](https://github.com/Joaconz/Biyu/issues/170) y
[#171](https://github.com/Joaconz/Biyu/issues/171). Siguen el formato de
`entrega-1/01-historias-de-usuario.md`: objetivo, pantallas y campos, criterios `CA-k` y trazabilidad.
Todavía no tienen casos `CP-*`; se diseñan en `02-especificacion-casos-v2`.

Las dos historias reabren la decisión de gráficos del dashboard que se tomó en V1 (FR-20,
[#78](https://github.com/Joaconz/Biyu/issues/78)). El detalle está en
[ADR-038](../../docs/adr/038-torta-por-categoria-y-detalle.md), que también actualiza FR-20.

## Reglas comunes a las dos historias

- **De dónde sale cada monto.** De las imputaciones materializadas del período (`ledger_entries`,
  ADR-001), en ARS y con el tipo de cambio congelado (`amount_ars`, I1', C5). El cliente no
  recalcula nada a partir de la transacción.
- **Qué entra.** Solo las imputaciones de **gastos** (`type = 'expense'`) de transacciones **no
  eliminadas** (I10). Los **ingresos** no aparecen en ningún gráfico ni lista de estas historias,
  aunque tengan categoría: la RPC acepta `p_category_id` en un ingreso cargado por API (fila 16 de
  D1). Siguen sumando en la tarjeta "Ingresos" de US-29.
- **Cuotas heredadas.** Una compra en cuotas le suma a su categoría, en cada período, solo la cuota
  que cae en ese período. Por ejemplo, $45.000,00 en 3 cuotas desde agosto le suma $15.000,00 a
  septiembre, no $45.000,00.
- **Categorías archivadas.** Si tienen gasto en el período, aparecen igual que las activas, con la
  marca "archivada" (US-27, US-44). Archivar una categoría no cambia montos ni porcentajes.
- **Porcentaje de una categoría.** Es `monto de la categoría en el período ÷ total gastado del
  período × 100`, redondeado a 1 decimal con `ROUND_HALF_UP` (el medio redondea hacia arriba:
  31,25 → 31,3). Se muestra con coma decimal y un espacio antes del signo: "40,0 %". El total gastado
  del período es el mismo número de la tarjeta "Gastado en <mes>" (US-25), con las cuotas heredadas
  y los gastos en USD convertidos. Si ese total es $0,00, el porcentaje es "0,0 %". Los porcentajes
  no se ajustan para que sumen 100: tres categorías de $100,00 muestran "33,3 %" cada una y suman
  99,9 %.
- **Orden de las categorías.** Primero por monto, de mayor a menor. A igual monto, por nombre en orden
  alfabético español, sin distinguir mayúsculas. Si también coincide el nombre (solo pasa entre una
  activa y una archivada, o entre dos archivadas, porque el nombre es único entre las activas), va
  primero la activa, y entre dos archivadas, la de `id` menor. _El desempate es nuevo: US-27 no lo
  definía._
- **Montos.** Formato argentino, sin espacio después del signo: "$60.000,00", "US$10,00" (C2).
- **Período.** Vive en la URL como `?period=AAAA-MM` (C11). Un valor ausente o inválido
  (`?period=2026-13`, `?period=hola`) se reemplaza por el período actual sin agregar una entrada al
  historial del navegador, igual que hoy en el Resumen. Elegir otro mes con el selector **sí** agrega
  una entrada al historial, así que Atrás vuelve al mes anterior.
- **Cómo simular un error de red.** Bloquear las solicitudes al dominio de Supabase: en DevTools,
  pestaña Network, clic derecho en una solicitud a `*.supabase.co` y "Block request domain". Después
  recargar la página. Cortar toda la red no sirve, porque la app no tiene service worker y el
  navegador no llega a cargarla.
- **Fuera de alcance.** Cambiar la categoría de una transacción ya cargada. ADR-009 define que la
  edición regenera las imputaciones y US-84 (ADR-043) la implementa en V2; se prueba en esa
  historia, no acá.

### Datos de ejemplo

Todos los montos son ficticios (C14). "Hoy" es 2026-10-06. Cada conjunto usa un usuario propio con
la siembra de US-43, y las filas se cargan en el orden de la tabla. Salvo la fila 16, todas se cargan
por la UI.

**D1, usuario `qa-categorias`.** Suma una categoría propia, "Viajes" (color musgo `#6f7d4a`), que se
archiva el 2026-09-30, después de cargar la fila 8.

| # | Fecha | Tipo | Categoría | Cuenta | Monto | Cuotas | Imputa en 2026-09 |
|---|---|---|---|---|---|---|---|
| 1 | 2026-09-05 | Gasto | Comida y supermercado | Billetera virtual | $8.500,00 | 1 | $8.500,00 |
| 2 | 2026-09-14 | Gasto | Comida y supermercado | Tarjeta de crédito | $18.700,00 | 1 | $18.700,00 |
| 3 | 2026-09-14 | Gasto | Comida y supermercado | Efectivo | $8.300,00 | 1 | $8.300,00 |
| 4 | 2026-09-28 | Gasto | Comida y supermercado | Tarjeta de débito | $24.500,00 | 1 | $24.500,00 |
| 5 | 2026-09-10 | Gasto | Transporte | Tarjeta de débito | $37.500,00 | 1 | $37.500,00 |
| 6 | 2026-09-02 | Gasto | Servicios | Cuenta bancaria | $22.500,00 | 1 | $22.500,00 |
| 7 | 2026-08-20 | Gasto | Indumentaria | Tarjeta de crédito | $45.000,00 | 3 | $15.000,00 (cuota 2/3) |
| 8 | 2026-09-12 | Gasto | Viajes | Efectivo | US$10,00 a TC 1.500 | 1 | $15.000,00 |
| 9 | 2026-09-01 | Ingreso | — | Cuenta bancaria | $500.000,00 | 1 | (ingreso) |
| 10 | 2026-09-15 | Gasto, **eliminado** después de cargarlo | Comida y supermercado | Efectivo | $9.999,00 | 1 | — (I10) |
| 11 | 2026-04-10 | Gasto | Comida y supermercado | Efectivo | $52.000,00 | 1 | — (abril) |
| 12 | 2026-05-10 | Gasto | Comida y supermercado | Efectivo | $48.500,00 | 1 | — (mayo) |
| 13 | 2026-06-10 | Gasto | Comida y supermercado | Efectivo | $55.000,00 | 1 | — (junio) |
| 14 | 2026-07-10 | Gasto | Comida y supermercado | Efectivo | $61.200,00 | 1 | — (julio) |
| 15 | 2026-08-10 | Gasto | Comida y supermercado | Efectivo | $57.800,00 | 1 | — (agosto) |
| 16 | 2026-09-20 | Ingreso **con categoría**, por API (`create_transaction` con `p_category_id` de Comida y supermercado) | Comida y supermercado | Cuenta bancaria | $7.000,00 | 1 | (ingreso) |

En septiembre 2026, D1 da **$150.000,00** de gasto: Comida y supermercado $60.000,00 (40,0 %),
Transporte $37.500,00 (25,0 %), Servicios $22.500,00 (15,0 %), Indumentaria $15.000,00 (10,0 %) y
Viajes $15.000,00 (10,0 %). Indumentaria y Viajes empatan, y va primero Indumentaria por orden
alfabético. Ingresos: $507.000,00. Días con registro: 8 de 30.

**D2 a D8.** Un usuario por conjunto, todo en septiembre 2026, gastos en una cuota con "Efectivo".

| Conjunto | Usuario | Contenido de 2026-09 | Total gastado |
|---|---|---|---|
| D2 | `qa-cat-ocho` | Comida y supermercado $40.000,00 · Transporte $30.000,00 · Servicios $20.000,00 · Salud $15.000,00 · Educación $10.000,00 · Entretenimiento $8.000,00 · Indumentaria $5.000,00 · Otros $2.000,00 | $130.000,00 |
| D3 | `qa-cat-siete` | Comida y supermercado $40.000,00 · Transporte $30.000,00 · Servicios $20.000,00 · Salud $15.000,00 · Educación $10.000,00 · Entretenimiento $8.000,00 · Indumentaria $5.000,00 | $128.000,00 |
| D4 | `qa-cat-seis` | Comida y supermercado $30.000,00 · Transporte $25.000,00 · Servicios $20.000,00 · Salud $15.000,00 · Educación $6.000,00 · Entretenimiento $4.000,00 | $100.000,00 |
| D5 | `qa-cat-tercios` | Comida y supermercado $100,00 · Servicios $100,00 · Transporte $100,00 | $300,00 |
| D6 | `qa-cat-una` | Salud $5.000,00 | $5.000,00 |
| D7 | `qa-cat-ingreso` | Solo un ingreso de $1.000,00 | $0,00 |
| D8 | `qa-cat-vacio` | Nada | $0,00 |

---

## Historias de usuario

### Épica: Resumen mensual (dashboard)

#### US-72: Gráfico de torta del gasto por categoría en el Resumen · [#242](https://github.com/Joaconz/Biyu/issues/242) (reemplaza [#170](https://github.com/Joaconz/Biyu/issues/170)) · Pendiente

- **Objetivo:** Como usuario, quiero ver el gasto del mes por categoría en un gráfico de torta arriba
  de la lista de categorías, para darme cuenta de un vistazo qué parte del total se lleva cada una sin
  leer los montos uno por uno.
- **Pantallas y campos:**
  - Pantalla **Resumen** (`/dashboard?period=AAAA-MM`). La estructura es la de hoy y solo cambia la
    sección "Por categoría". De arriba hacia abajo: encabezado con el selector de mes, tarjeta
    "Gastado en <mes>", tarjetas "Ingresos" y "Balance", **"Por categoría"**, "Por cuenta" y
    "Últimos movimientos". Desde 1024 px, "Por categoría" y "Por cuenta" siguen lado a lado.
  - Sección **"Por categoría"**, de arriba hacia abajo:
    1. Rótulo "Por categoría".
    2. **Gráfico de torta.** Círculo lleno, sin hueco central, centrado, de 176 px de diámetro. Tiene
       una porción por categoría con gasto en el período, en el color de la categoría (la paleta de
       ADR-023, la misma de su barra). La primera porción empieza a las 12 y las siguientes siguen en
       sentido horario, en el orden de las reglas comunes. El orden de las porciones en el DOM es ese
       mismo orden. El ángulo de cada porción es proporcional al monto exacto, no al porcentaje
       redondeado. Las porciones se separan con un filete de 2 px del color de la superficie
       (`--card`, `#fdfbf7`), así dos porciones del mismo color o de tonos parecidos no se funden.
       Una sola porción no lleva filete. La torta no tiene texto adentro.
    3. **Lista de categorías**, igual que hoy (US-27): ícono, nombre, marca "archivada" si
       corresponde, monto, porcentaje y barra de proporción. Hace de leyenda y muestra **todas** las
       categorías con gasto, aunque la torta agrupe algunas en "Resto". Ahora cada fila es también el
       acceso al detalle de la categoría (US-73). Es un `<li>` con un enlace `<a>` adentro, con el
       nombre accesible "Ver detalle de <nombre>" y un ícono "›" a la derecha. El `data-testid` de la
       fila pasa al enlace.
  - **Agrupación "Resto".** Con 6 categorías con gasto o menos, hay una porción por categoría. Con 7 o
    más, la torta muestra las 5 primeras del orden y una sexta porción llamada **"Resto (N
    categorías)"**, en el color del borde de control (`--input`, `#948877` en `src/index.css`, ADR-023). Su monto es la suma de las
    categorías agrupadas y su porcentaje sale de la regla común aplicada a esa suma. "Resto" no
    aparece en la lista.
  - **Las porciones no son interactivas** en V2: tocar una no hace nada. Al detalle se entra por la
    fila de la lista (ADR-038).
  - **Accesibilidad.** La torta es una imagen (`role="img"`) con el texto alternativo "Gasto por
    categoría en <mes año>: <nombre> <porcentaje>, …", en el orden de las porciones. Con D1 dice
    "Gasto por categoría en septiembre 2026: Comida y supermercado 40,0 %, Transporte 25,0 %,
    Servicios 15,0 %, Indumentaria 10,0 %, Viajes 10,0 %". Si hay "Resto", el texto termina con
    "Resto (N categorías) <porcentaje>". La torta no recibe foco.
  - **Estados:**
    - Cargando: se ve el "Cargando…" del Resumen (`dashboard-loading`), sin torta ni lista.
    - Error al leer el resumen: se ve el texto del Resumen, que empieza con "No se pudo cargar el
      resumen:" y sigue con el detalle técnico (`dashboard-error`), sin torta ni lista.
    - Mes sin ningún movimiento: se ve el estado vacío de US-33 ("No tenés movimientos registrados en
      <mes>." y "Registrar un gasto") y la sección "Por categoría" no se muestra.
    - Mes con ingresos y sin gastos: la sección muestra "No hay gastos por categoría en este mes."
      (`dashboard-categories-empty`), sin torta.
  - **`data-testid`.** Los de la lista existen desde US-27 y no cambian. Los ángulos se expresan en
    grados, con 1 decimal y punto decimal, y salen de los montos exactos acumulados (redondeo
    `ROUND_HALF_UP`).

    | Elemento | `data-testid` | Atributos para la automatización |
    |---|---|---|
    | Sección | `dashboard-category-bars` | — |
    | Torta | `dashboard-category-chart` | `data-period="AAAA-MM"`, `aria-label` con el texto alternativo |
    | Porción de una categoría | `dashboard-category-chart-slice-<categoryId>` | `data-amount` ("60000.00"), `data-percentage` ("40.0"), `data-start-angle` ("0.0"), `data-end-angle` ("144.0") |
    | Porción "Resto" | `dashboard-category-chart-slice-rest` | los mismos, más `data-count` (categorías agrupadas) |
    | Lista | `dashboard-categories-list` | — |
    | Enlace de la fila | `dashboard-category-bar-<categoryId>` | `href` al detalle, `aria-label="Ver detalle de <nombre>"` |
    | Nombre, monto, porcentaje, marca | `category-bar-name`, `category-bar-amount`, `category-bar-percentage`, `category-bar-archived` | — |
    | Sin gastos | `dashboard-categories-empty` | — |

- **Criterios de aceptación:**
  - CA-1: Con D1, `/dashboard?period=2026-09` muestra la torta con exactamente 5 porciones. En el
    orden del DOM son Comida y supermercado, Transporte, Servicios, Indumentaria y Viajes, con
    `data-start-angle`–`data-end-angle` "0.0"–"144.0", "144.0"–"234.0", "234.0"–"288.0",
    "288.0"–"324.0" y "324.0"–"360.0".
  - CA-2: Con D1, la lista de "Por categoría" de septiembre 2026 muestra 5 filas, en el mismo orden que
    la torta, con estos montos y porcentajes: "$60.000,00" "40,0 %", "$37.500,00" "25,0 %",
    "$22.500,00" "15,0 %", "$15.000,00" "10,0 %", "$15.000,00" "10,0 %".
  - CA-3: Con D1, ni el ingreso de $500.000,00 (fila 9) ni el ingreso con categoría de $7.000,00 (fila
    16) aparecen en la torta o en la lista. Comida y supermercado sigue en $60.000,00 · 40,0 %.
  - CA-4: Con D1, la transacción eliminada de $9.999,00 (fila 10) no le suma a Comida y supermercado:
    su monto sigue siendo $60.000,00.
  - CA-5: Con D1, Indumentaria muestra $15.000,00 en septiembre (la cuota 2/3 de la fila 7), no
    $45.000,00.
  - CA-6: Con D1, Viajes (archivada) aparece en la torta y en la lista. La fila tiene la marca
    "archivada" y muestra $15.000,00 · 10,0 %, el gasto en USD convertido a TC 1.500.
  - CA-7: Con D1, Indumentaria y Viajes empatan en $15.000,00 y aparecen en ese orden (alfabético) en la
    torta y en la lista.
  - CA-8: Con D2 (8 categorías), la torta tiene 6 porciones. Las 5 primeras tienen `data-percentage`
    "30.8", "23.1", "15.4", "11.5" y "7.7", y "Resto" tiene `data-amount` "15000.00",
    `data-percentage` "11.5" y `data-count` "3". La lista muestra las 8 filas, y las últimas tres son
    "$8.000,00" "6,2 %", "$5.000,00" "3,8 %" y "$2.000,00" "1,5 %".
  - CA-9: Con D3 (7 categorías, el límite), la torta tiene 6 porciones. "Resto" tiene `data-amount`
    "13000.00", `data-percentage` "10.2" y `data-count` "2". La primera fila de la lista muestra
    "31,3 %" (31,25 redondeado hacia arriba) y la de Entretenimiento "6,3 %" (6,25).
  - CA-10: Con D3, la porción de Comida y supermercado va de "0.0" a "112.5" y la de Transporte de
    "112.5" a "196.9".
  - CA-11: Con D4 (6 categorías), la torta tiene 6 porciones, no existe
    `dashboard-category-chart-slice-rest` y los `data-percentage` son "30.0", "25.0", "20.0", "15.0",
    "6.0" y "4.0".
  - CA-12: Con D5, las tres filas muestran "33,3 %", en el orden Comida y supermercado, Servicios,
    Transporte. Las porciones van de "0.0" a "120.0", de "120.0" a "240.0" y de "240.0" a "360.0".
  - CA-13: Con D6, la torta tiene una sola porción, de "0.0" a "360.0", con el color de Salud
    (`#9a3b3b`) y sin filete, y la fila muestra "100,0 %".
  - CA-14: Con D7, la sección muestra "No hay gastos por categoría en este mes." y no existe el
    elemento `dashboard-category-chart`.
  - CA-15: Con D8, se ve el estado vacío de US-33 y no existe el elemento `dashboard-category-chart`.
  - CA-16: Con D1, el `aria-label` de la torta es exactamente "Gasto por categoría en septiembre 2026:
    Comida y supermercado 40,0 %, Transporte 25,0 %, Servicios 15,0 %, Indumentaria 10,0 %, Viajes
    10,0 %". Con D2 termina en ", Resto (3 categorías) 11,5 %".
  - CA-17: Tocar una porción no navega ni cambia la URL.
  - CA-18: Con D1, cambiar de mes con el selector a agosto actualiza la torta y la lista, y la URL pasa
    a `?period=2026-08` (C11). Se ven 2 porciones: Comida y supermercado $57.800,00 · 79,4 % e
    Indumentaria $15.000,00 · 20,6 %.
  - CA-19: Con D1 en septiembre, después de eliminar desde "Últimos movimientos" el gasto de $24.500,00
    (fila 4), la torta y la lista se actualizan sin recargar. Transporte pasa al primer lugar con
    $37.500,00 · 29,9 % y Comida y supermercado queda segunda con $35.500,00 · 28,3 %. _Este CA
    modifica D1: se corre al final o sobre una copia._
  - CA-20: Con D1 y las solicitudes a Supabase bloqueadas (ver "Cómo simular un error de red"),
    recargar `/dashboard?period=2026-09` muestra un texto que empieza con "No se pudo cargar el
    resumen:" y no muestra la torta.
  - CA-21: La sección `dependencies` de `package.json` no tiene paquetes nuevos respecto de `main` al
    2026-10-06: la torta se dibuja con SVG propio (ADR-038).
  - CA-22: Con D1, el enlace `dashboard-category-bar-<id de Comida y supermercado>` tiene el nombre
    accesible "Ver detalle de Comida y supermercado".
- **Trazabilidad:** FR-20 (reabre el ajuste de [#78](https://github.com/Joaconz/Biyu/issues/78)) · US-27 ·
  US-33 · US-44 · ADR-001 · ADR-023 · ADR-038 · I1' · I10 · C2 · C11
- **Mock:** `entrega-2/mocks/dashboard-categorias-resumen.html`
- **Casos de prueba:** se diseñan en la Parte A de la Entrega 2. CP-DAS-004 (US-27) es candidato a la
  regresión de V2 (criterio de ADR-027) porque la sección cambia.

#### US-73: Detalle de una categoría desde el Resumen · [#243](https://github.com/Joaconz/Biyu/issues/243) (reemplaza [#171](https://github.com/Joaconz/Biyu/issues/171)) · Pendiente

- **Objetivo:** Como usuario, quiero tocar una categoría en el Resumen y ver su detalle (cuánto gasté
  en el mes, cómo viene en los últimos meses y cada gasto que la compone), para entender por qué esa
  categoría pesa lo que pesa.
- **Pantallas y campos:**
  - **Entrada:** tocar una fila de "Por categoría" en el Resumen abre
    `/dashboard/categories/<categoryId>?period=AAAA-MM`, con el mismo período que tenía el Resumen.
    `categoryId` es el UUID de la categoría. En la barra de navegación sigue marcado "Resumen", y sus
    enlaces llevan los testids `dashboard-nav-*` porque la ruta empieza con `/dashboard`.
  - Pantalla **Detalle de categoría**, de arriba hacia abajo:
    1. **Encabezado:** el enlace "‹ Resumen", que vuelve a `/dashboard?period=` con el período que se
       está viendo en el detalle. Después, el nombre de la categoría como título, con la marca
       "archivada" si corresponde, y el selector de mes (flechas "Mes anterior" y "Mes siguiente" y
       el nombre del mes, que abre el selector nativo, igual que en el Resumen). Cambiar de mes
       cambia solo `?period=`; la categoría no cambia.
    2. **Tarjeta del total:**
       - el rótulo "Gastado en <mes>";
       - el monto de la categoría en el período, en grande;
       - el texto "<porcentaje> del gasto de <mes>", con la regla común (es el mismo número que la
         fila del Resumen);
       - "Cuotas de meses anteriores <monto>": la parte del monto que viene de cuotas con número
         mayor a 1, como en US-16;
       - "Incluye <US$ monto> en dólares", solo si la categoría tiene gastos en USD en ese período,
         como en US-24.
    3. **Sección "Últimos 6 meses":** un gráfico de 6 barras verticales, una por período, desde el
       período visto menos 5 hasta el período visto, de izquierda a derecha.
       - Debajo de cada barra va el mes abreviado ("abr", "may"…), y encima, el monto en formato
         compacto.
       - La altura es proporcional al mayor de los 6 montos. Un mes en $0,00 muestra una línea de base
         de 2 px; un mes con monto mayor que cero mide al menos 4 px, aunque la proporción dé menos.
       - La barra del período visto va en el color de la categoría. Las otras van en ese color al 35 %
         sobre la superficie: `color-mix(in srgb, <color> 35%, #fdfbf7)`.
       - Cada barra es un botón: tocarlo cambia `?period=` a ese mes. Su nombre accesible es "<mes
         año>: <monto completo>", por ejemplo "julio 2026: $61.200,00".
    4. **Sección "Gastos de <mes año>":** las imputaciones de gastos de esa categoría en el período, no
       eliminadas. Se ordenan por fecha de la transacción, de la más nueva a la más vieja, y a igual
       fecha va primero la que se cargó después. No hay límite de cantidad. Cada fila es la misma de
       Movimientos (US-17): el título (la nota o, si no hay, el nombre de la categoría), "<día> <mes
       abreviado> · <cuenta>", la etiqueta "n/N" si es una cuota, el monto de la imputación con
       signo ("-$24.500,00") y, si es en dólares, el monto en USD debajo. La diferencia es que **no
       tiene papelera ni botón de restaurar**: el detalle es de solo lectura.
  - **Formato compacto** de los montos de las barras, con redondeo `ROUND_HALF_UP`:
    - menos de $1.000: el entero redondeado ("$950", "$0");
    - desde $1.000 y menos de $999.950: miles con 1 decimal ("$52,0 mil", "$48,5 mil");
    - desde $999.950: millones con 1 decimal ("$1,3 M" para $1.250.000,00).
  - **Estados.** El encabezado se ve de forma distinta según el estado:
    - Cargando: solo "‹ Resumen" y "Cargando…", sin título, selector de mes, tarjeta, barras ni lista.
    - Error al leer cualquiera de los datos: "‹ Resumen", el texto "No se pudo cargar la categoría." y
      el botón "Reintentar", que vuelve a pedir todo. No hay título, selector de mes, tarjeta, barras
      ni lista.
    - Categoría inexistente, de otro usuario (RLS devuelve 0 filas) o con un `categoryId` que no es un
      UUID: solo "No encontramos esta categoría." y el enlace "Volver al Resumen" a
      `/dashboard?period=` con el período de la URL. No hay "‹ Resumen", título ni selector de mes.
    - Mes sin gastos en la categoría: la tarjeta muestra "$0,00", "0,0 % del gasto de <mes>" y "Cuotas
      de meses anteriores $0,00"; las barras se ven igual; la lista dice "No hay gastos de <categoría>
      en <mes año>.".
    - Los 6 meses en $0,00: debajo de las barras aparece "Sin gastos en esta categoría en los últimos 6
      meses.".
  - **`data-testid`:**

    | Elemento | `data-testid` | Atributos |
    |---|---|---|
    | Enlace "‹ Resumen" | `category-detail-back` | `href` |
    | Título | `category-detail-title` | — |
    | Marca "archivada" | `category-detail-archived` | — |
    | Selector de mes | `category-detail-period-prev`, `category-detail-period`, `category-detail-period-select`, `category-detail-period-next` | `data-period` en `category-detail-period` |
    | Tarjeta del total | `category-detail-total` | — |
    | Monto | `category-detail-total-amount` | — |
    | Porcentaje | `category-detail-percentage` | — |
    | Cuotas de meses anteriores | `category-detail-inherited-amount` | — |
    | Subtotal en dólares | `category-detail-total-usd` | — |
    | Sección de barras | `category-detail-evolution` | — |
    | Barra de un mes (botón) | `category-detail-evolution-bar-AAAA-MM` | `data-amount` ("61200.00"), `aria-current="true"` solo en la del período visto |
    | Monto compacto de la barra | `category-detail-evolution-amount-AAAA-MM` | — |
    | Seis meses en cero | `category-detail-evolution-empty` | — |
    | Lista | `category-detail-transactions` | — |
    | Fila | `category-detail-transaction-item` (y los sufijos de Movimientos: `-installment`, `-archived`) | — |
    | Lista vacía | `category-detail-transactions-empty` | — |
    | Cargando, error, reintentar | `category-detail-loading`, `category-detail-error`, `category-detail-retry` | — |
    | No encontrada, volver | `category-detail-not-found`, `category-detail-not-found-back` | — |
    | Navegación global (sin cambios) | `dashboard-nav-<destino>` | `aria-current="page"` en el de Resumen |

- **Criterios de aceptación:**
  - CA-1: Con D1, tocar la fila "Comida y supermercado" en `/dashboard?period=2026-09` abre
    `/dashboard/categories/<id de Comida y supermercado>?period=2026-09`.
  - CA-2: Con D1, el detalle de Comida y supermercado en septiembre 2026 muestra:
    - el título "Comida y supermercado";
    - el monto "$60.000,00";
    - el texto "40,0 % del gasto de septiembre";
    - "Cuotas de meses anteriores $0,00";
    - y no existe `category-detail-total-usd`.
  - CA-3: Con D1 en septiembre 2026, el porcentaje del detalle de cada una de las 5 categorías es igual
    al de su fila en el Resumen.
  - CA-4: Con D1, la lista de Comida y supermercado en septiembre 2026 tiene 4 filas, en este orden:
    "28 sep · Tarjeta de débito" "-$24.500,00"; "14 sep · Efectivo" "-$8.300,00"; "14 sep · Tarjeta de
    crédito" "-$18.700,00"; "5 sep · Billetera virtual" "-$8.500,00". No aparecen la eliminada de
    $9.999,00 (fila 10) ni el ingreso de $7.000,00 (fila 16).
  - CA-5: Con D1, las barras de Comida y supermercado en septiembre 2026 son, de izquierda a derecha,
    `2026-04` a `2026-09`. Sus `data-amount` son "52000.00", "48500.00", "55000.00", "61200.00",
    "57800.00" y "60000.00", y sus montos compactos, "$52,0 mil", "$48,5 mil", "$55,0 mil", "$61,2
    mil", "$57,8 mil" y "$60,0 mil". La más alta es la de julio, y `aria-current="true"` está solo en
    `2026-09`.
  - CA-6: Con D1, el detalle de Indumentaria en septiembre 2026 muestra "$15.000,00", "10,0 % del gasto
    de septiembre", "Cuotas de meses anteriores $15.000,00" y una fila con la etiqueta "2/3" y
    "-$15.000,00".
  - CA-7: Con D1, las barras de Indumentaria en septiembre 2026 tienen `data-amount` "0.00" de abril a
    julio y "15000.00" en agosto y septiembre. En `?period=2026-10`, la barra de octubre vale
    "15000.00" (la cuota 3/3 comprometida).
  - CA-8: Con D1, el detalle de Viajes en septiembre 2026 muestra la marca "archivada", "$15.000,00",
    "10,0 % del gasto de septiembre" e "Incluye US$10,00 en dólares". Su fila muestra "US$10,00" debajo
    de "-$15.000,00".
  - CA-9: Con D1, el ingreso con categoría de $7.000,00 (fila 16) no suma al monto del detalle de Comida
    y supermercado (sigue en "$60.000,00") ni a su barra de septiembre (sigue en "60000.00").
  - CA-10: Con D1, en el detalle de Comida y supermercado en 2026-09, "Mes anterior" lleva a
    `?period=2026-08` sin cambiar `<categoryId>`. Se ven "$57.800,00", "79,4 % del gasto de agosto" y
    barras de `2026-03` a `2026-08`.
  - CA-11: Con D1, tocar la barra `2026-07` en el detalle de Comida y supermercado lleva a
    `?period=2026-07`, y el monto pasa a "$61.200,00".
  - CA-12: "‹ Resumen" desde el detalle en `?period=2026-08` lleva a `/dashboard?period=2026-08`.
  - CA-13: Después de CA-1, el botón Atrás del navegador vuelve a `/dashboard?period=2026-09` (C11).
    Después de CA-10, Atrás vuelve al detalle en `?period=2026-09`, porque cambiar de mes agrega una
    entrada al historial.
  - CA-14: Abrir la URL del detalle de CA-1 en otra pestaña con la misma sesión muestra la misma
    categoría y el mismo período (enlace compartible, C11).
  - CA-15: Con D1, el detalle de Transporte en `?period=2027-03` muestra "$0,00", "0,0 % del gasto de
    marzo", "Cuotas de meses anteriores $0,00" y "No hay gastos de Transporte en marzo 2027.". Sus 6
    barras (`2026-10` a `2027-03`) valen "0.00" y se ve "Sin gastos en esta categoría en los últimos 6
    meses.".
  - CA-16: Con D6, en el detalle de Salud en `?period=2026-10`, la barra de septiembre mide más de 4 px
    y las de mayo a agosto y la de octubre miden 2 px.
  - CA-17: `/dashboard/categories/00000000-0000-0000-0000-000000000000?period=2026-09` muestra "No
    encontramos esta categoría.", y "Volver al Resumen" lleva a `/dashboard?period=2026-09`.
  - CA-18: `/dashboard/categories/hola?period=2026-09` muestra "No encontramos esta categoría." y no
    hace ninguna solicitud a `ledger_entries` (pestaña Network).
  - CA-19: Con la sesión de `qa-categorias`, abrir el detalle de la categoría Salud de `qa-cat-una` (D6)
    muestra "No encontramos esta categoría.". No se ven ni su nombre ni sus montos (RLS, C7).
  - CA-20: `/dashboard/categories/<id de Comida y supermercado>?period=2026-13` reemplaza el período
    por el actual de la fecha de ejecución (`2026-10` si hoy es 2026-10-06), sin agregar una entrada
    al historial, y muestra ese mes.
  - CA-21: Con D1 y las solicitudes a Supabase bloqueadas, recargar el detalle de Comida y supermercado
    muestra "‹ Resumen", "No se pudo cargar la categoría." y el botón "Reintentar". Si después se
    desbloquea el dominio y se toca "Reintentar", se ve el detalle de CA-2 sin recargar la página.
  - CA-22: Las filas del detalle no tienen botón de eliminar ni de restaurar.
  - CA-23: Formato compacto: $950,00 → "$950"; $999,50 → "$1.000"; $48.500,00 → "$48,5 mil";
    $999.949,99 → "$999,9 mil"; $999.950,00 → "$1,0 M"; $1.250.000,00 → "$1,3 M".
  - CA-24: En el detalle, el enlace `dashboard-nav-dashboard` tiene `aria-current="page"`.
- **Trazabilidad:** FR-20 (la evolución que [#78](https://github.com/Joaconz/Biyu/issues/78) dejó para
  "una historia específica posterior") · FR-21 · US-16 · US-17 · US-24 · US-72 · ADR-001 · ADR-023 ·
  ADR-038 · I1' · I10 · C2 · C7 · C11
- **Mock:** `entrega-2/mocks/dashboard-categorias-detalle.html`
- **Casos de prueba:** se diseñan en la Parte A de la Entrega 2.

---

## Supuestos de este documento

1. Los IDs US-72 y US-73 se asignaron a esta feature. Los issues #170 y #171 eran ideas del backlog
   sin historia; se cerraron al crear #242 y #243.
2. "Pantallas y campos" describe la UI de `main` al 2026-10-06 con estos cambios aplicados. Si la
   navegación inferior de V2 (#172) cambia las pestañas, "Resumen" sigue siendo la que queda marcada.
3. El cálculo de porcentajes es el de V1 en `src/domain/summary.ts` (US-27). Estas historias lo dejan
   por escrito, no lo cambian. Lo único nuevo es el desempate del orden.
4. El detalle de una categoría es de solo lectura: borrar y editar se siguen haciendo desde
   Movimientos.
5. FR-20 (`docs/pre-entrega.md`) y su fila en `docs/08-trazabilidad.md` se actualizaron con ADR-038:
   torta más barras en el Resumen y evolución por categoría en el detalle.
