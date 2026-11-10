# Dirección de diseño: referencias, modo oscuro y features

Ordena lo que se tomó de un tablero de referencias de apps de finanzas (noviembre 2026) para la
siguiente etapa visual de Biyu. Distingue qué se aplica ahora, qué queda para después del MVP y qué
decisiones necesitan ADR antes de tocar código. Al trabajarlo, usar las skills `emil-design-eng`,
`apple-design`, `mobile-native` y `dataviz`.

> Las imágenes de referencia **no entran al repo**: son trabajos de terceros. Acá se describen los
> patrones, no se copian composiciones.

Parte de lo que sigue ya está en marcha: barra flotante con Registrar al centro (ADR-048, #392),
transiciones y skeletons (ADR-049, #394), dona y tarjetas de tendencia en el Resumen (ADR-050, #393)
y el balance configurable desde su propia tarjeta (sesión aparte, en curso).

---

## 1. Qué tomamos de las referencias

Patrones que se repiten en el tablero, y cómo se traducen a Biyu:

| Patrón | Qué se ve en las referencias | En Biyu |
|---|---|---|
| **Número héroe arriba** | Un solo monto grande (saldo o balance) con una línea de variación debajo («+12,5 % vs. el mes pasado») | El «Gastado en {mes}» ya es el héroe. Sumarle la **variación contra el mes anterior** con flecha y color |
| **Tarjetas KPI con sparkline** | Dos tarjetas chicas lado a lado (Ahorrado / Gastado, Gasto / Ingreso) con una línea mínima de tendencia | Ingresos y Balance ya son tarjetas: sumarles un **sparkline de 6 meses** sin ejes |
| **Barras pareadas finas** | Ingreso y gasto como dos barras delgadas por mes, redondeadas, con un acento brillante para una de las dos | Estilo para «Gastado vs. ingresos» de ADR-050: barras finas, la del gasto en el acento, la del ingreso en tono apagado |
| **Selector segmentado** | Día / Semana / Mes o 1S / 1M / 1A sobre cada gráfico | Hoy todo es mensual (C11). Un segmentado **6M / 1A** en los gráficos de tendencia, en la URL |
| **Tooltip al tocar** | Línea vertical y globo con el valor del punto tocado | Gráficos de tendencia «scrubbeables» al tocar. Cuidar que el valor también esté en texto (accesibilidad) |
| **Dona con leyenda en grilla** | Dona con hueco grande, y debajo una grilla de 2–3 columnas con monto y punto de color | Ya está la dona (#393). Probar la leyenda en grilla compacta arriba de la lista larga |
| **Íconos en baldosa** | Cada categoría o acción en un cuadrado redondeado con el ícono adentro | `CategoryIcon` ya lo hace. Unificar tamaño y radio en todas las listas |
| **Movimientos agrupados por día** | «Hoy, 2 de marzo — −$1.620» como encabezado y las filas debajo | Aplicar en Movimientos y en «Últimos movimientos» del Resumen: **encabezado por día con el total del día** |
| **Accesos rápidos** | Fila de 4 botones circulares (Enviar, Recibir, Pagar, Factura) bajo el saldo | Fila corta bajo el héroe: **Gasto · Ingreso · Deuda · Importar**, que abren Registrar con el tipo ya elegido |
| **Categorías frecuentes** | Tarjetas «Quick expense» (Supermercado $650, Auto $450) | Las 2–4 categorías más usadas como atajo: un toque abre Registrar en el paso de monto con la categoría precargada |
| **Barra flotante con + central** | Píldora flotante, ícono activo con color y el + destacado | Hecho en ADR-048 |
| **Sidebar en riel** | En desktop, una columna de íconos con tooltip que se expande a ícono + texto | La sidebar de 240 px podría **colapsarse a riel** de íconos, con la preferencia en `localStorage` |
| **Pantalla de éxito** | Ilustración y mensaje al terminar un alta | Solo para hitos poco frecuentes (primer gasto, terminar el setup). El guardado de todos los días sigue siendo un toast |
| **Anillo de progreso** | «48 % completado» de una meta, con financiado / falta | Base para presupuestos y metas (§4) |
| **Calendario del mes** | Grilla mensual con los días marcados | Base para un calendario de gasto diario (§4) |

Lo que **no** se toma: avatares con foto de stock, saludos tipo «Hola, Rono», tarjetas de crédito
dibujadas con número completo y teclados numéricos que reemplazan al del sistema sin necesidad. En
una app de uso rápido, en el momento del gasto, agregan pasos o ruido.

---

## 2. Modo oscuro «esmeralda»

Es el cambio más visible del tablero, y encaja con la identidad actual: el verde cazador
(`#1b4d3e`) y el ecru (`#f9f6f0`) de ADR-023 son casi los mismos tonos que el verde oliva y el
crema de las paletas de referencia. El modo claro sigue siendo «heritage moderno». El oscuro es su
versión de noche, no otra marca.

### Paleta propuesta

Contrastes medidos con la fórmula de WCAG 2.x.

| Token | Claro (hoy) | Oscuro (propuesto) | Contraste en oscuro |
|---|---|---|---|
| `--background` | `#f9f6f0` ecru | `#051f20` esmeralda profundo | — |
| `--card` | `#fdfbf7` papel | `#0b2b26` | — |
| `--secondary` / `--muted` | `#f1ebe0` lino | `#163832` | — |
| `--foreground` | `#2b1e19` espresso | `#daf1de` menta pálida | 14,4:1 sobre fondo · 12,7:1 sobre card |
| `--muted-foreground` | `#6e625a` | `#9fb8ab` | 7,2:1 sobre card |
| `--primary` (acento, ingresos) | `#1b4d3e` | `#8eb69b` salvia | 6,7:1 sobre card · 5,7:1 sobre secondary |
| `--primary-foreground` | `#f9f6f0` | `#051f20` | 7,6:1 sobre salvia |
| `--deficit` / `--destructive` | `#8b2e2e` bordó | `#e07a6b` terracota | 5,2:1 sobre card |
| `--hairline` (decorativo) | `#e6dfd3` | `#235347` | 1,7:1, solo decorativo |
| `--input` (borde de control) | `#948877` | `#4f7f72` | 3,3:1 sobre card (WCAG 1.4.11) |
| `--gold` | `#d4af37` | `#d4af37` | 7,2:1 sobre card: en oscuro también sirve de anillo de foco |
| Crema de acento | — | `#f3ebd6` | 12,7:1, para el número héroe o el wordmark |

Los colores de los gráficos (`--chart-1…5`) y los colores de categoría necesitan una variante
oscura propia: los de hoy son tierras medias pensadas para ecru. Validarlos con la skill
`dataviz` (separación entre series y contraste contra `#0b2b26`).

### Reglas

- **Respeta el sistema y deja elegir:** la opción por defecto sigue a `prefers-color-scheme`, y en
  Ajustes se puede elegir Claro / Oscuro / Automático. La elección se guarda en `localStorage`: es
  una comodidad del dispositivo, no un dato del usuario. Un script en línea en `index.html` la
  aplica antes del primer pintado, así no hay destello.
- **`color-scheme: dark`** en `:root` oscuro, y `<meta name="theme-color">` con las dos variantes
  para que la barra de estado de iOS acompañe.
- **Elevación por tono, no por sombra:** la regla de ADR-023 sigue en pie. En oscuro, una
  superficie más alta es más clara (`#051f20` → `#0b2b26` → `#163832`).
- **Un solo brillo permitido:** las referencias usan degradados y halos. Se admite **uno**, sutil,
  en la tarjeta héroe del Resumen en modo oscuro (un radial del acento al 8–12 % desde una esquina).
  Ningún otro degradado.
- **El material translúcido** (`chrome`) funciona igual: fondo al 80 % del `--background` oscuro
  con el mismo blur.
- **Probar con capturas:** cada pantalla en los dos modos, a 375 px y 1280 px, antes de mergear.

### Por qué necesita ADR

ADR-023 dice «solo modo claro» y «sin sombras ni degradados». El modo oscuro y el brillo de la
tarjeta héroe lo contradicen, así que va un ADR nuevo que lo reemplace en esos dos puntos (C12). Ese
ADR también tiene que decidir qué hacer con las clases `dark:` de shadcn que hoy compilan pero nunca
se activan.

---

## 3. Qué aplicar ahora (antes de cerrar el MVP)

Ordenado por impacto sobre esfuerzo. Ninguno cambia el modelo de datos.

| # | Cambio | Dónde | Notas |
|---|---|---|---|
| 1 | **Modo oscuro esmeralda** | `src/index.css`, `index.html`, Ajustes | ADR nuevo (§2). Es el más vistoso y casi todo son tokens |
| 2 | **Movimientos agrupados por día** con el total del día | `TransactionsPage`, «Últimos movimientos» | Total del día en `decimal.js` desde `src/domain/`, testid `transactions-day-total` |
| 3 | **Variación contra el mes anterior** en el héroe | `DashboardPage` | Función pura `(actual, anterior) → % o null`; sin datos del mes anterior no se muestra |
| 4 | **Sparklines** en Ingresos y Balance | `src/components/dashboard/` | Reusa la serie de 6 meses de ADR-050; SVG propio (ADR-038 §5) |
| 5 | **Estilo de barras pareadas finas** en «Gastado vs. ingresos» | El componente de #393 | Solo estilo, una vez mergeado #393 |
| 6 | **Accesos rápidos** bajo el héroe | `DashboardPage` → `/register?type=…` | El tipo en la URL (C11). Revisar US-01 y NFR-07: no puede sumar pasos |
| 7 | **Íconos en baldosa** con el mismo tamaño y radio en todas las listas | `CategoryIcon`, `AccountIcon` | Pulido visual |
| 8 | **Sidebar colapsable a riel** en desktop | `AppNav` | Tooltip con el nombre; los testids no cambian |

Cada cambio de UI lleva sus `data-testid` (`<pantalla>-<elemento>`) y actualiza los casos y e2e que
dependan de lo que toca.

---

## 4. Features para después del MVP

Ideas nuevas que salen del tablero. Se suman a la tabla «V3+ — no diseñado» de `docs/roadmap.md`, con
la misma regla: **cada una necesita su spec antes de escribir código**.

| Feature | Qué es | De dónde sale | Qué toca |
|---|---|---|---|
| **Presupuesto por categoría** | Tope mensual por categoría, con anillo de progreso y aviso al 80 % | Anillo «48 % completado» | Tabla nueva con RLS. Cambia el propósito: de informar a controlar (ya anotado en roadmap) |
| **Metas de ahorro** | Monto objetivo y fecha, con financiado / falta | Tarjeta de meta | Tabla nueva. Decidir si el aporte es un movimiento o una marca |
| **«Te alcanza hasta el día…»** | Proyección del balance al cierre del mes con el ritmo de gasto actual y lo comprometido (cuotas y suscripciones) | «Runway: 26 días» | Función pura sobre datos que ya existen. Candidata fuerte: no necesita schema |
| **Calendario de gastos** | Mes en grilla, cada día con intensidad según lo gastado, y al tocarlo los movimientos | Calendario mensual | Solo lectura sobre imputaciones. Sin schema |
| **Comparativa por categoría** | Chip «+18 %» o «−6 %» por categoría contra el mes anterior | Badges de variación | Solo lectura. Sin schema |
| **Búsqueda de movimientos** | Buscar por descripción, monto o categoría en todo el historial | Barra de búsqueda | Índice de texto en Postgres. Filtros en la URL (C11) |
| **Notificaciones** | Aviso de suscripción por cobrar, cuota alta del mes o tope de presupuesto | Campana en el header | Necesita PWA (ADR-022) y push. Grande |
| **Reporte anual** | Año en barras, total por categoría y mes más caro | Pantalla «Reports, This year» | Solo lectura. El segmentado 1A de §1 es el primer paso |
| **Atajos por categoría frecuente** | Las categorías más usadas como botones de un toque para registrar | «Quick expense» | Si no entra en §3, queda acá. Sin schema |
| **Hito con celebración** | Pantalla de éxito al primer gasto o al terminar el setup | Pantalla «Card added» | Pulido. Sin schema |

---

## 5. Dónde queda cada cosa

- Decisiones de diseño ya tomadas: `docs/adr/023`, `048`, `049`, `050`.
- Pendientes visuales sueltos: `docs/design/pendientes-ui.md`.
- Features sin diseñar: `docs/roadmap.md`, tabla «V3+ — no diseñado».
- Este documento: el mapa de la etapa visual. Cuando un punto de §3 tenga su issue o su PR, se
  marca acá con el link. Cuando un punto de §4 tenga su spec, se borra de acá y vive en el roadmap.
