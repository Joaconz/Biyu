# ADR-048 — Barra de navegación flotante con indicador deslizante

**Estado:** aceptada · **Fecha:** 2026-11
**Relacionada:** ADR-023 (la extiende, no la reemplaza), US-69

## Contexto

El ADR-023 definió un único `<nav>`: barra inferior translúcida pegada al borde en el celular y sidebar
desde 1024px. La barra pegada marca el ítem activo con un punto dorado que aparece y desaparece, sin
relación espacial entre una pestaña y la siguiente, y comparte el borde con el gesto de inicio de iOS.
Se pidió una barra más cercana a las apps nativas actuales: separada del borde, con una marca de activo
que se mueva de una pestaña a otra, y con Registrar —la acción más frecuente— destacado.

## Decisión

1. **Píldora flotante en el celular.** El mismo `<nav>`, a `--app-nav-gap` (0,5 rem) del borde inferior
   más `safe-area-inset-bottom`, con `rounded-full`, filete `hairline` y el material `chrome` de
   siempre. Sin sombra: la separación sale del filete y de la translucidez (ADR-023, «sin sombras»).
2. **Indicador activo deslizante.** Un solo elemento (`data-testid="app-nav-indicator"`, `aria-hidden`)
   que se mueve con `transform: translateX(índice × 100%)` en 250 ms con `--ease-drawer`
   (`--dur-nav`). Es interrumpible: una transición CSS se reencauza si se toca otra pestaña a mitad de
   camino. En Ajustes o en pantallas sin ítem queda en opacidad 0. Con `prefers-reduced-motion` la regla
   global ya reduce las transiciones a un fundido.
3. **Registrar al centro, destacado.** En el celular la barra tiene cinco destinos y Registrar queda en
   el medio, con su ícono en un círculo sólido `primary`: Resumen · Deudas · **Registrar** ·
   Suscripciones · Ajustes. Con cuatro no había centro, así que **Ajustes pasa a ser el quinto
   destino** y el engranaje sale del header (que queda con el wordmark). El orden del celular vive en
   `MOBILE_NAV_SCREENS` (`src/lib/navigation.ts`, con test); `AppNav` renderiza esa lista en el
   celular y `NAV_ITEMS` + Ajustes al pie en desktop, según `isDesktop`, así el orden de tabulación
   coincide con el visual en ambos y los `data-testid` no se duplican. Esto matiza US-69 · CA-1
   («sin Ajustes» en la barra): vale para la sidebar; en el celular Ajustes ahora está en la barra.
4. **Offset.** `--app-nav-offset` pasa a `nav-h + 2 × gap + safe-area` para que los pies fijos de los
   formularios (`sticky bottom-(--app-nav-offset)`) queden sobre el aire de la píldora. Con teclado
   abierto la barra se oculta como antes, desplazándose además el aire de abajo.
5. **Desktop no cambia**: sidebar de 240 px, filete dorado de activo, sin indicador.
6. **Contrato de pruebas intacto**: todos los `data-testid` `<pantalla>-nav-<destino>` y
   `aria-current="page"` siguen donde estaban; el indicador es un elemento nuevo que no es interactivo.

## Alternativas descartadas

- **Un indicador por ítem con fundido.** Es lo que había (el punto): no comunica de dónde viene el
  usuario ni hacia dónde va.
- **Animar `left`/`width` del indicador.** Fuerza layout en cada cuadro; `transform` y `opacity`
  corren en el compositor.
- **Librería de animación (Framer Motion).** Una transición CSS cubre el caso sin sumar dependencia.
- **Ocultar la barra al hacer scroll hacia abajo.** Queda para una iteración posterior; esconde la
  navegación justo cuando alguien recorre una lista larga.

## Consecuencias

- El contenido pasa por debajo de la píldora y de los 0,5 rem de aire: el relleno inferior de
  `main` ya usa `--app-nav-offset`, así que el último elemento de cada pantalla sigue alcanzable.
- Cada pestaña tiene 1/5 del ancho de la píldora (≈ 70 px a 375 px): «Suscripciones» es el rótulo
  más largo que entra; uno más largo exigiría abreviar.
- Mover Ajustes a la barra cambia el paso 1 de PR de Ajustes en `docs/12-procedimientos-de-prueba.md`
  (ya actualizado) y la redacción de US-69 · CA-1 en el issue, que conviene alinear.
