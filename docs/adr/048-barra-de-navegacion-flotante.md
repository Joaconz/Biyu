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
3. **Registrar destacado.** En el celular su ícono va en un círculo sólido `primary`. **Sigue en la
   primera posición**: la barra tiene 4 destinos, así que no hay un centro real, y reordenar
   `NAV_ITEMS` cambiaría el orden de la sidebar y de `tests/lib/navigation.test.ts`. Centrarlo exigiría
   un quinto destino o reordenar; queda como decisión aparte.
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
- Cada pestaña tiene 1/4 del ancho de la píldora (≈ 85 px a 375 px): «Suscripciones» entra justo; un
  rótulo más largo exigiría abreviar.
