# Casos de prueba V3 — Categorías y cuentas legibles al registrar (US-98)

**Historia:** [#359](https://github.com/Joaconz/Biyu/issues/359) · ADR-052 · US-05, US-06.
**Oráculo:** los criterios CA-1 a CA-3 de la historia adaptada. En el paso 2 de Registrar las categorías son baldosas de cuatro columnas con el ícono arriba y el nombre en hasta dos líneas, sin cortar palabras; las cuentas son chips de dos columnas de al menos 48 px de alto.
**Convenciones:** PR-01 crea el usuario (`docs/12-procedimientos-de-prueba.md`). Viewport de 390 px. Montos ficticios (C14).
**Automatización:** por escribir.

| ID | Título | Criterio | Técnica | Tipo | Canal | Prioridad | Automatizable |
|---|---|---|---|---|---|---|---|
| CP-REG-050 | Las ocho categorías sembradas se leen completas, sin cortar palabras | CA-1 | Casos de uso | Positivo | UI | Media | Sí |
| CP-REG-051 | Un nombre largo ocupa como máximo dos líneas | CA-2 | Valores límite | Límite | UI | Media | Sí |
| CP-REG-052 | Los chips de cuenta miden al menos 48 px de alto | CA-3 | Valores límite | Límite | UI | Media | Sí |

## CP-REG-050 — Ocho categorías legibles
**Pre-requisitos:** PR-01 con `chips-050@biyu.test`, configuración inicial salteada.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En `/register` escribir un monto y tocar «Siguiente». | Paso 2 con ocho baldosas en una grilla de cuatro columnas, cada una con ícono y nombre. |
| 2 | Leer «Comida y supermercado», «Entretenimiento» e «Indumentaria». | Cada nombre se lee completo; ninguna palabra queda cortada al medio. |

## CP-REG-051 — Nombre largo
**Pre-requisitos:** PR-01 con `chips-051@biyu.test`; una categoría nueva llamada «Entretenimiento y espectáculos al aire libre» (creada desde `/settings/categories`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En `/register` llegar al paso 2. | La baldosa de la categoría larga muestra el nombre en dos líneas como máximo, con puntos suspensivos si no entra. |
| 2 | Medir el alto de esa baldosa y el de «Otros». | Tienen la misma altura: la grilla no se desalinea. |

## CP-REG-052 — Alto de los chips de cuenta
**Pre-requisitos:** PR-01 con `chips-052@biyu.test`, configuración inicial salteada.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En `/register` completar monto y categoría y llegar al paso 3. | Las cinco cuentas están en dos columnas. |
| 2 | Medir el alto de cada chip de cuenta con DevTools. | Mide al menos 48 px. |
