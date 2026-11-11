# Casos de prueba V3 — Barra inferior flotante con Registrar al centro y Ajustes dentro (US-92)

**Historia:** [#353](https://github.com/Joaconz/Biyu/issues/353) · ADR-048, ADR-023 · C11 · US-69.
**Oráculo:** los criterios CA-1 a CA-6 de la historia adaptada. En el celular (menos de 1024 px) la barra es una píldora flotante con Resumen · Deudas · Registrar · Suscripciones · Ajustes; desde 1024 px es una barra lateral con Ajustes al pie. Movimientos no tiene ítem propio: cuelga del Resumen.
**Convenciones:** PR-01 crea el usuario (`docs/12-procedimientos-de-prueba.md`). Viewport de 390 px salvo que el caso diga otra cosa. Montos ficticios (C14).
**Automatización:** `e2e/ux-navegacion.spec.ts` (CP-NAV-026 a 029, 031 y 032), `e2e/nav-shield.spec.ts` (CP-NAV-030) y `tests/lib/navigation.test.ts` (orden y ruta activa).

| ID | Título | Criterio | Técnica | Tipo | Canal | Prioridad | Automatizable |
|---|---|---|---|---|---|---|---|
| CP-NAV-026 | A 390 px la barra tiene cinco destinos en orden y el encabezado no tiene engranaje | CA-1 | Particiones | Positivo | UI | Alta | Sí |
| CP-NAV-027 | El indicador se desliza bajo el ítem activo y una ruta inexistente no muestra la barra | CA-2 | Transición de estados | Positivo | UI | Media | Sí |
| CP-NAV-028 | Movimientos se abre desde el Resumen y la barra sigue marcando Resumen | CA-3 | Casos de uso | Positivo | UI | Alta | Sí |
| CP-NAV-029 | A 1023 px hay píldora y a 1024 px barra lateral con Ajustes al pie, sin `data-testid` repetidos | CA-4 | Valores límite | Límite | UI | Alta | Sí |
| CP-NAV-030 | Un toque en el aire alrededor de la píldora no navega ni activa nada de atrás | CA-5 | Adivinación de errores | Negativo | UI | Media | Sí |
| CP-NAV-031 | En una ruta hija de Ajustes la barra marca Ajustes | CA-1 | Transición de estados | Positivo | UI | Media | Sí |
| CP-NAV-032 | El orden de tabulación de la barra coincide con el orden visual | ADR-048 §3 | Adivinación de errores | Positivo | UI | Media | Sí |

## CP-NAV-026 — Cinco destinos en orden
**Pre-requisitos:** PR-01 con `barra-026@biyu.test`, configuración inicial salteada, ventana de 390 px.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/register` y mirar la barra de abajo. | Cinco ítems, de izquierda a derecha: Resumen, Deudas, Registrar, Suscripciones, Ajustes. Registrar está al centro, con su ícono en un círculo sólido. |
| 2 | Mirar el encabezado. | Solo muestra el wordmark: no hay engranaje de Ajustes. |
| 3 | Tocar «Ajustes» en la barra. | Se abre `/settings`. |

## CP-NAV-027 — El indicador se desliza
**Pre-requisitos:** PR-01 con `barra-027@biyu.test`, configuración inicial salteada.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/dashboard`. | El indicador (`app-nav-indicator`) está bajo «Resumen». |
| 2 | Tocar «Suscripciones». | El indicador se desliza hasta «Suscripciones» y la pantalla cambia. |
| 3 | Tocar «Deudas» a mitad del movimiento. | El indicador se reencauza hacia «Deudas» sin saltos. |
| 4 | Abrir `/transactions`. | El indicador está bajo «Resumen». |
| 5 | Abrir una ruta que no existe (por ejemplo, `/nada`). | Aparece «Esta página no existe» sin barra inferior ni indicador. |

## CP-NAV-028 — Movimientos desde el Resumen
**Pre-requisitos:** PR-01 con `barra-028@biyu.test`; un gasto de $1.000,00 en H.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/dashboard?period=<H>`. | El Resumen ofrece el acceso redondo «Movimientos» y el enlace «Ver todos». |
| 2 | Tocar «Movimientos». | Se abre `/transactions?period=<H>` con el gasto. La barra marca «Resumen». |
| 3 | Cambiar al mes anterior con la flecha y tocar «Resumen» en la barra. | El Resumen abre en el mes que se venía mirando y la URL conserva el período (C11). |

## CP-NAV-029 — 1023 px y 1024 px
**Pre-requisitos:** PR-01 con `barra-029@biyu.test`, configuración inicial salteada.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Con una ventana de 1023 px abrir `/dashboard`. | Píldora flotante abajo con cinco destinos. |
| 2 | Agrandar la ventana a 1024 px. | La barra pasa a ser lateral de 240 px con Registrar, Resumen, Deudas y Suscripciones y «Ajustes» al pie. |
| 3 | En DevTools, `document.querySelectorAll('[data-testid]')` y contar repetidos dentro de `nav`. | No hay dos elementos con el mismo `data-testid`: el `<nav>` se monta una sola vez. |

## CP-NAV-030 — El aire alrededor de la píldora
**Pre-requisitos:** PR-01 con `barra-030@biyu.test`, configuración inicial salteada. Un botón de prueba con `z-index: 30` insertado desde la consola detrás de la franja, en el aire de cada lado de la píldora.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/settings` y comprobar que `app-nav-shield` llega al borde inferior y al ancho completo. | La franja es más alta que la píldora y cubre todo el ancho. |
| 2 | Tocar el aire debajo, encima, a la izquierda y a la derecha de la píldora. | El botón de prueba no recibe ningún toque y la URL no cambia. |

## CP-NAV-031 — Ruta hija de Ajustes
**Pre-requisitos:** PR-01 con `barra-031@biyu.test`, configuración inicial salteada.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/settings` y tocar la fila «Categorías». | Se abre `/settings/categories`. |
| 2 | Mirar la barra. | «Ajustes» sigue marcado y el indicador está bajo «Ajustes». |

## CP-NAV-032 — Orden de tabulación
**Pre-requisitos:** PR-01 con `barra-032@biyu.test`, configuración inicial salteada.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/dashboard` a 390 px y recorrer la barra con la tecla Tab. | El foco pasa por Resumen, Deudas, Registrar, Suscripciones y Ajustes, en ese orden. |
| 2 | Repetir a 1024 px. | El foco recorre los ítems de la barra lateral en su orden visual, con Ajustes al final. |
