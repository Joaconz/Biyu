# Casos de prueba V3 — Botones y controles de al menos 44 px (US-96)

**Historia:** [#357](https://github.com/Joaconz/Biyu/issues/357) · ADR-052 · NFR-08 · hallazgo 3 de la auditoría #352.
**Oráculo:** a 390 px de ancho todo control tocable mide al menos 44 px de alto (medido con `boundingBox`) y hay al menos 8 px entre controles vecinos, sin romper el diseño (sin scroll horizontal). Mediciones previas: «Ver todos» 37 px, «Activos»/«Eliminados» 36 px, filtros de Deudas, «Nueva deuda» y «Marcar saldada» 40 px, selector de tema 40 px, interruptores 31 px.
**Convenciones:** PR-01 crea el usuario (`docs/12-procedimientos-de-prueba.md`). Montos ficticios (C14). Viewport de 390 × 844 px.
**Automatización:** `e2e/ux-controles-tactiles.spec.ts` (CP-NAV-038 a 041).

| ID | Título | Criterio | Técnica | Tipo | Canal | Prioridad | Automatizable |
|---|---|---|---|---|---|---|---|
| CP-NAV-038 | «Ver todos» del Resumen y «Activos»/«Eliminados» miden al menos 44 px | CA-1 | Valores límite | Positivo | UI | Media | Sí |
| CP-NAV-039 | En Deudas, los filtros, «Nueva deuda», «Marcar saldada» y «Editar» miden al menos 44 px | CA-1 | Valores límite | Positivo | UI | Media | Sí |
| CP-NAV-040 | En Ajustes, el selector de tema y los interruptores miden al menos 44 px de alto | CA-1, CA-2 | Valores límite | Positivo | UI | Media | Sí |
| CP-NAV-041 | Los controles contiguos están separados al menos 8 px y no hay scroll horizontal | CA-3 | Valores límite | Negativo | UI | Media | Sí |

## CP-NAV-038 — Resumen y Movimientos
**Pre-requisitos:** PR-01 con `nav-038@biyu.test`, configuración inicial salteada y un gasto del mes.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/` y medir «Ver todos» (`dashboard-transactions-view-all`). | Alto de al menos 44 px. |
| 2 | Abrir `/transactions` y medir «Activos» y «Eliminados». | Alto de al menos 44 px cada uno. |

## CP-NAV-039 — Deudas
**Pre-requisitos:** PR-01 con `nav-039@biyu.test` y una deuda pendiente de «Juan».

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/debts` y medir «Pendientes», «Saldadas», «Todas», «Nueva deuda», «Marcar saldada» y «Editar deuda de Juan». | Todos de al menos 44 px de alto. |

## CP-NAV-040 — Ajustes
**Pre-requisitos:** PR-01 con `nav-040@biyu.test`, configuración inicial salteada.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/settings` y medir las tres opciones del tema. | Alto de al menos 44 px. |
| 2 | Medir cada interruptor de «Resumen». | Alto de al menos 44 px (el óvalo se sigue viendo de 51 × 31 px). |

## CP-NAV-041 — Separación y diseño
**Pre-requisitos:** PR-01 con `nav-041@biyu.test` y una deuda pendiente.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En `/debts`, medir el espacio entre «Marcar saldada» y «Editar». | Al menos 8 px. |
| 2 | Recorrer `/`, `/debts`, `/transactions` y `/settings`. | Ninguna tiene scroll horizontal. |
