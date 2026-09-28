# ADR-023 — Sistema de diseño "heritage moderno", solo modo claro y navegación global

**Estado:** aceptada · **Fecha:** 2026-09

## Contexto

La funcionalidad de V1 (registrar, resumen, movimientos, ajustes) estaba completa, pero la UI era
el tema por defecto de shadcn: gris, Geist, sombras genéricas y cada pantalla con su propia barra
de links. La app se usa casi siempre desde el celular, en el momento del gasto, así que la pantalla
de registro tiene que sentirse instalada y no una web embebida. Había que fijar una identidad
visual y una estructura de navegación antes de que las historias de V2 sumen pantallas, porque
después cambiarlas cuesta el doble (testids, casos de prueba, capturas del informe).

## Decisión

**Identidad.** Paleta "heritage moderno" en `src/index.css` como tokens de `:root`:

- Fondo ecru `#f9f6f0`, texto espresso `#2b1e19`, superficies de papel `#fdfbf7` (nunca blanco puro).
- Primario verde cazador `#1b4d3e` (también ingresos); déficit y destructivo en bordó `#8b2e2e`.
- Oro `#d4af37` **solo decorativo** (filetes, el punto del ítem activo, el wordmark), nunca texto.
  El foco usa un oro profundo `#9a7b1f` porque el oro claro no llega a 3:1 (WCAG 1.4.11).
- Contrastes verificados y anotados junto a cada token: texto secundario 5,5:1, borde de control 3,2:1.

**Sin sombras ni degradados.** Los tokens `--shadow-*` se anulan en `@theme`, así ningún primitivo
de shadcn emite sombra. La jerarquía sale del tono de la superficie, los filetes (`--hairline`) y
el material translúcido del cromo (utilidad `chrome`: fondo al 80% con `backdrop-filter`, con caída
a sólido si el usuario pide menos transparencia o el navegador no lo soporta).

**Tipografía.** Inter Variable (con eje óptico) para toda la interfaz, incluidos los títulos de
pantalla, en negrita y con tracking negativo como los títulos grandes de iOS. Playfair Display
queda solo para la marca: el wordmark, el encabezado del login y el monto de la pantalla de
registro. Una primera versión usaba Playfair también en títulos y rótulos de tarjeta, y el
conjunto se leía antiguo, más "cafetería" que app. Escala propia (`text-display` … `text-tab`) en
la que el interlineado y el tracking cambian con el tamaño. Montos con cifras tabulares (`tabular`).

**Composición de las pantallas de lectura.** Listas agrupadas al estilo iOS (`GroupedSection`,
`GroupedCard`): el rótulo sobre el fondo y las filas en una sola superficie de papel con filetes.
En el Resumen, el total gastado va en la única superficie sólida verde de la pantalla, porque es
la pregunta que responde la app (US-25), no el saldo. Las barras de categoría usan el tono de cada
categoría; las de cuenta, todas en verde, para que el color quede reservado a las categorías. El
mes se muestra como "septiembre 2026" y en la URL sigue siendo `YYYY-MM` (C11); `data-period`
expone ese valor a la automatización.

**Movimiento.** Tres duraciones (`--dur-press` 120 ms, `--dur-fade` 180 ms, `--dur-spring` 500 ms)
y un resorte críticamente amortiguado sin rebote (`--ease-spring`). Los controles responden en
pointer-down (`press`, escala 0,97). Con `prefers-reduced-motion` solo se funden colores y opacidad.

**Solo modo claro.** Se quita `next-themes`; la variante `dark:` existe para que compilen las clases
de shadcn, pero nada la activa. `theme-color` y `color-scheme` fijan el ecru en ambos esquemas del
sistema, y los toasts dejan de seguir el tema del teléfono.

**Navegación global.** Un `AppLayout` compartido por las rutas privadas, montado entre pestañas, con
un único `<nav>` que en el celular es una barra inferior translúcida (Registrar · Resumen ·
Movimientos) y desde 1024 px una sidebar con el wordmark y Ajustes. Nunca se montan dos copias,
así ningún `data-testid` se duplica; los testids conservan la forma `<pantalla>-nav-<destino>`.
Cerrar sesión se mueve a Ajustes (US-64). En V2 la barra pasa a Registrar · Resumen · Deudas ·
Suscripciones y Movimientos queda como "Ver todos" dentro del Resumen. La lógica de destinos y del
`?period` que viaja entre Resumen y Movimientos (C11) vive en `src/lib/navigation.ts`, sin React.

**Base "nativa" en el celular.** `viewport-fit=cover` y áreas seguras, sin zoom de iOS en campos
(piso de 16 px con `pointer: coarse`), sin destello de toque, `overscroll-behavior-y: contain`
para frenar el pull-to-refresh de Android (recargar perdería un gasto a medio cargar), y la barra
se esconde con el teclado abierto (`useVisualViewportInset`) para que "Guardar" quede visible.

## Alternativas descartadas

- **Mantener el tema por defecto de shadcn.** Cero costo, pero es la estética de cualquier panel
  genérico y no resuelve la navegación: cada pantalla seguía con su propia barra de links.
- **Sombras sutiles para elevar hojas y la barra.** Es la solución habitual, pero con fondo ecru
  cálido las sombras grises ensucian el tono. El material translúcido más el filete separa el
  cromo del contenido sin eso. Si una hoja modal (V2) no se distingue lo suficiente, se reabre.
- **Modo claro y oscuro desde V1.** Duplica los tokens y la verificación de contraste, y cada
  captura del informe de pruebas se vuelve doble. No hay ninguna historia que lo pida.
- **Gráfico de dona para el gasto por categoría.** Es lo habitual en apps de finanzas, pero con
  seis u ocho categorías los ángulos no se comparan a simple vista y CP-DAS-004 pide barras.
- **Dos navegaciones (barra móvil y sidebar como componentes separados).** Más simple de
  maquetar, pero ambas quedan en el DOM y los `data-testid` se duplican: rompe la automatización
  de V3 (`docs/07-plan-de-testing.md` §2).

## Consecuencias

- Las pantallas y los primitivos citan este ADR; tocar un token de `src/index.css` es cambiar
  esta decisión, no un ajuste cosmético.
- Sin modo oscuro: quien use el teléfono en oscuro ve la app en claro. Agregarlo después implica
  redefinir todos los tokens y volver a verificar contrastes.
- Sin sombras, la separación entre capas depende de disciplina en tonos y filetes; hay que
  revisarla en cada pantalla nueva, sobre todo en hojas y diálogos. El botón Guardar fijo ya lo
  mostró: sobre material translúcido se leían los rótulos a través del botón, y pasó a fondo sólido.
- Dos fuentes variables suman ~110 kB de woff2 (subconjunto latino) a la primera carga.
- Respeta la convención de `data-testid` (`docs/07-plan-de-testing.md` §2) y el período en la
  URL (C11). No toca dominio, montos ni RLS.
