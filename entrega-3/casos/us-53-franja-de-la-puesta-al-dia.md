# Casos de prueba V3 — Franja de la puesta al día que falló, con X y Reintentar (US-53 · CA-4)

**Historia:** US-53 ([#211](https://github.com/Joaconz/Biyu/issues/211)) · CA-4 y CA-11 · ajuste de UX del PR [#396](https://github.com/Joaconz/Biyu/pull/396) · ADR-017 · C4.
**Oráculo:** si la puesta al día de suscripciones falla, una franja arriba del contenido avisa «No pudimos cargar tus suscripciones vencidas. Los totales pueden estar incompletos.» con «Reintentar». La X (`app-catchup-dismiss`) la cierra y no vuelve a aparecer mientras dure la sesión del navegador (`sessionStorage`), ni al pasar de pantalla ni al recargar. «Reintentar» vuelve a llamar a la función y, si responde bien, la franja desaparece. Antes de V3 la franja no se podía cerrar.
**Convenciones:** PR-01 crea el usuario (`docs/12-procedimientos-de-prueba.md`). Para hacer fallar la puesta al día: DevTools → Network → bloquear `/functions/v1/run-subscription-catchup` (responde error). Montos ficticios (C14).
**Automatización:** `e2e/catchup-banner-dismiss.spec.ts` (CP-SUS-067 y CP-SUS-068).

| ID | Título | Criterio | Técnica | Tipo | Canal | Prioridad | Automatizable |
|---|---|---|---|---|---|---|---|
| CP-SUS-067 | La X cierra la franja y no vuelve al cambiar de pantalla ni al recargar | CA-4 | Transición de estados | Positivo | UI | Media | Sí |
| CP-SUS-068 | «Reintentar» llama de nuevo y, si anda, la franja desaparece | CA-4, CA-11 | Transición de estados | Positivo | UI | Media | Sí |

## CP-SUS-067 — Cerrar con la X
**Pre-requisitos:** PR-01 con `franja-067@biyu.test`, con la puesta al día bloqueada.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/dashboard`. | Se ve la franja de error con «Reintentar» y la X. |
| 2 | Tocar la X. | La franja se cierra. |
| 3 | Ir a `/debts` y volver; recargar. | La franja no vuelve a aparecer en esta sesión del navegador, aunque la puesta al día vuelva a correr y a fallar. |

## CP-SUS-068 — Reintentar
**Pre-requisitos:** PR-01 con `franja-068@biyu.test`, con la puesta al día bloqueada.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/dashboard`. | Se ve la franja de error. |
| 2 | Quitar el bloqueo y tocar «Reintentar». | La franja dice «Reintentando…» y después desaparece. |
