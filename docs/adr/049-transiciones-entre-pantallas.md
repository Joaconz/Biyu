# ADR-049 — Transiciones entre pantallas con View Transitions

**Estado:** propuesta · **Fecha:** 2026-11

## Contexto

Las pantallas cambian de golpe: al tocar una pestaña, entrar a un detalle o volver, el contenido
se reemplaza sin ninguna señal de a dónde fue el usuario. En el celular, donde Biyu se usa casi
siempre (ADR-023), eso se siente como una web y no como una app instalada. Hay unas 50 llamadas a
`Link`, `NavLink` y `navigate`, y la barra y el header deben quedar quietos mientras cambia el
contenido. El período y los filtros viven en la URL (C11): cambiarlos también navega, y esa acción
se repite muchas veces por sesión.

## Decisión

1. **View Transitions API, sin librería de animación.** React Router ya expone `viewTransition` en
   `navigate`. Un solo punto, `installViewTransitions` (`src/lib/viewTransitions.ts`), envuelve
   `router.navigate` y lo activa para cada navegación, en lugar de agregar la opción en cada
   `Link`. Sin la API (`document.startViewTransition`) navega como siempre.
2. **Clasificación pura** (`classifyTransition`, probada en `tests/lib/viewTransitions.test.ts`):
   - misma ruta (cambiar de mes, un filtro): `none`, no se anima;
   - otra pestaña: `tab`, fundido de 180 ms;
   - entrar a un detalle (más profundo dentro de la misma pestaña, contando Movimientos bajo
     Resumen e Importar bajo Registrar, como la barra): `forward`;
   - volver: `back`. Ambos desplazan 28 px y funden, 260 ms con `--ease-drawer`; la pantalla que
     sale se va más rápido (120 ms) que la que llega.
3. **Solo `<main>` se anima.** `.app-page` lleva `view-transition-name`; el header y la barra
   también tienen nombre, pero sin animación, para quedar por encima del contenido que se
   desplaza. El resto del documento no se anima, así el cromo no parpadea.
4. **Movimiento reducido:** con `prefers-reduced-motion: reduce` queda solo el fundido.
5. **La dirección** va en `data-nav` del `<html>` y se borra a los 600 ms, así un "atrás" del
   navegador usa el fundido de base y no la dirección de la navegación anterior.
6. **Skeletons** con la forma del contenido (`src/components/skeletons/Skeleton.tsx`) en lugar de
   "Cargando…" en el Resumen, Movimientos, Deudas y Suscripciones. Conservan los `data-testid`
   `*-loading` y un texto solo para lectores de pantalla.

## Alternativas descartadas

- **Framer Motion / `AnimatePresence`:** suma peso y mantiene dos pantallas montadas a la vez, con
  efectos y consultas duplicados. Las View Transitions toman una captura y no tocan el árbol de React.
- **`viewTransition` en cada `Link`:** 50 y pico sitios que olvidar al agregar una pantalla, y la
  dirección habría que calcularla en cada uno.
- **Animar el cambio de mes:** es una acción repetida decenas de veces; sumaría demora sin informar nada.
- **Deslizar la pantalla completa (estilo push de iOS):** taparía la barra y exige una captura
  de la pantalla entera; el desplazamiento corto da la dirección sin esos costos.

## Consecuencias

- Mejora: la navegación comunica jerarquía (pestaña, entrar, volver) con 180–260 ms, interrumpible
  y fuera del hilo principal.
- Cuesta: `router.navigate` queda envuelto (un solo lugar, con prueba); durante ~250 ms el
  documento no recibe clics, y Playwright reintenta hasta que termina.
- El material translúcido de la barra se captura sin desenfoque mientras dura la transición.
- Firefox sin la API navega sin animación. No toca C1–C15 ni los invariantes I*; no cambia
  testids ni rutas.
