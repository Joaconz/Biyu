# Casos de prueba V3 — Ajustes ordenado en tarjetas agrupadas (US-93)

**Historia:** [#354](https://github.com/Joaconz/Biyu/issues/354) · ADR-052, ADR-055 · US-64, US-68, DEF-015.
**Oráculo:** los criterios CA-1 a CA-4 de la historia adaptada. Ajustes son tarjetas agrupadas (Apariencia, Categorías, Cuentas, Tipo de cambio, Resumen, configuración inicial) y «Cerrar sesión» queda última, en su propia tarjeta.
**Convenciones:** PR-01 crea el usuario (`docs/12-procedimientos-de-prueba.md`). Montos ficticios (C14).
**Automatización:** `e2e/settings.spec.ts` (CP-CFG-029, DEF-015). El resto, por escribir.

| ID | Título | Criterio | Técnica | Tipo | Canal | Prioridad | Automatizable |
|---|---|---|---|---|---|---|---|
| CP-CFG-027 | Las tarjetas de Ajustes están en el orden indicado y «Cerrar sesión» es la última, aparte | CA-1 | Particiones | Positivo | UI | Alta | Sí |
| CP-CFG-028 | «Categorías» abre su pantalla, la barra sigue marcando Ajustes y se vuelve con atrás | CA-2 | Casos de uso | Positivo | UI | Alta | Sí |
| CP-CFG-029 | Todo elemento interactivo de Ajustes tiene un `data-testid` propio y sin repetir | CA-3 | Adivinación de errores | Negativo | UI | Media | Sí |
| CP-CFG-030 | «Volver a hacer la configuración inicial» abre `/setup` | CA-4 | Casos de uso | Positivo | UI | Media | Sí |

## CP-CFG-027 — Orden de las tarjetas
**Pre-requisitos:** PR-01 con `ajustes-027@biyu.test`, configuración inicial salteada.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/settings` y recorrer la página de arriba abajo. | Las tarjetas van en este orden: Apariencia, «Categorías · 8 activas», Cuentas, Tipo de cambio, Resumen, «Volver a hacer la configuración inicial» y «Cerrar sesión». |
| 2 | Mirar «Cerrar sesión». | Está en su propia tarjeta, separada del resto, al final. |

## CP-CFG-028 — Categorías en su pantalla
**Pre-requisitos:** PR-01 con `ajustes-028@biyu.test`, configuración inicial salteada.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En `/settings` tocar la fila «Categorías». | Se abre `/settings/categories` con la lista de las ocho categorías sembradas. |
| 2 | Mirar la barra. | «Ajustes» sigue marcado. |
| 3 | Tocar el botón atrás de la pantalla. | Vuelve a `/settings`. |

## CP-CFG-029 — `data-testid` de Ajustes
**Pre-requisitos:** PR-01 con `ajustes-029@biyu.test`, configuración inicial salteada.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En `/settings`, en la consola listar los `a`, `button`, `input`, `select` y `textarea` visibles que no tengan `data-testid`. | Ninguno. |
| 2 | Contar los `data-testid` repetidos dentro de `main`. | Ninguno. |

## CP-CFG-030 — Configuración inicial
**Pre-requisitos:** PR-01 con `ajustes-030@biyu.test`, configuración inicial salteada.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En `/settings` tocar «Volver a hacer la configuración inicial». | Se abre `/setup` en el paso «¿Para qué vas a usar Biyu?». |
| 2 | Saltear los cuatro pasos. | Termina en `/register`. |
