# Casos de prueba V3 — Borrar una categoría (US-89)

**Historia:** [#331](https://github.com/Joaconz/Biyu/issues/331) · ADR-044 §5 · C4, C6, C7, C10.
**Oráculo:** la regla «solo se borra una categoría sin uso» (movimientos, incluidos los dados de baja, y suscripciones); con uso rechaza con un mensaje que dice cuántos tiene y sugiere archivar.
**Convenciones:** PR-01 crea el usuario, PR-02 su token (`docs/12-procedimientos-de-prueba.md`). Montos ficticios (C14). Canal API: `POST <SUPABASE_URL>/rest/v1/rpc/delete_category` con `{"p_category_id": "<uuid>"}`.

| ID | Título | Técnica | Tipo | Canal | Prioridad | Automatizable |
|---|---|---|---|---|---|---|
| CP-CFG-016 | Borrar una categoría activa sin uso y volver a usar el nombre | Casos de uso | Positivo | UI | Alta | Sí |
| CP-CFG-017 | Borrar una categoría archivada sin uso | Particiones | Positivo | UI | Media | Sí |
| CP-CFG-018 | Con un movimiento activo la categoría no se borra y el mensaje dice cuántos | Particiones | Negativo | UI | Alta | Sí |
| CP-CFG-019 | La misma regla directo contra la RPC (`23514`, HTTP 400) | Particiones | Negativo | API | Alta | Sí |
| CP-CFG-020 | Un movimiento dado de baja o una suscripción también cuentan como uso | Adivinación de errores | Negativo | API | Alta | Sí |
| CP-CFG-021 | La categoría de otro usuario responde «no encontrada» (HTTP 404) y no se borra | Adivinación de errores | Negativo | API | Alta | Sí |
| CP-CFG-022 | Cancelar la confirmación no borra | Casos de uso | Negativo | UI | Media | Sí |

## CP-CFG-016 — Borrar una categoría activa sin uso y volver a usar el nombre
**Historia y criterio:** US-89 · CA-1, CA-4. **Invariante:** — · **Caso par:** CP-CFG-019
**Pre-requisitos:** S 1: PR-01 con `borrar-016@biyu.test`, configuración inicial salteada.
**Datos:** categoría «Tecnología».

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ir a Ajustes, escribir `Tecnología` en «Nueva categoría» y tocar «Crear categoría». | La lista activa muestra «Tecnología». |
| 2 | Tocar el ícono «Eliminar Tecnología» (`settings-categories-delete-tecnologia`). | Diálogo «¿Eliminar categoría?» con Categoría: Tecnología y Uso: Sin uso. |
| 3 | Tocar «Eliminar». | Aviso «Categoría eliminada»; «Tecnología» ya no está en la lista. |
| 4 | Abrir Registrar, escribir 100 y tocar «Siguiente». | Los chips de categoría no incluyen «Tecnología». |
| 5 | En Ajustes, crear otra vez `Tecnología`. | Se crea sin error: el nombre quedó libre. |

**Post-condición:** una categoría «Tecnología» activa.

## CP-CFG-017 — Borrar una categoría archivada sin uso
**Historia y criterio:** US-89 · CA-1. **Pre-requisitos:** PR-01 con `borrar-017@biyu.test`; «Salud» archivada.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Ajustes, bajo «Archivadas», tocar «Eliminar Salud». | Diálogo con Categoría: Salud y Uso: Sin uso. |
| 2 | Tocar «Eliminar». | «Salud» desaparece de «Archivadas». |

## CP-CFG-018 — Con un movimiento activo no se borra
**Historia y criterio:** US-89 · CA-2. **Pre-requisitos:** PR-01 con `borrar-018@biyu.test`; un gasto de $500,00 en «Otros» (cuenta Efectivo).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Ajustes, tocar «Eliminar Otros». | El resumen dice «1 movimiento» y el texto «No se puede eliminar una categoría en uso. Archivala si no la querés ver más.». |
| 2 | Tocar «Eliminar». | Se cierra el diálogo; el error dice «La categoría tiene 1 movimiento y 0 suscripciones. Archivala si no la querés ver más.»; «Otros» sigue en la lista. |

## CP-CFG-019 a CP-CFG-021 — Directo contra la RPC
**Pre-requisitos:** PR-01, PR-02 (token de A) y los uuid de las categorías. Datos: «Otros» con un gasto (019); «Reserva» con un gasto dado de baja y «Streaming» con una suscripción (020); una categoría de otro usuario B (021).

| ID | Llamada | Resultado esperado |
|---|---|---|
| 019 | `delete_category` sobre «Otros» | HTTP 400, código `23514`, mensaje «La categoría tiene 1 movimiento y 0 suscripciones. Archivala si no la querés ver más.»; `GET /categories?id=eq.<id>` devuelve 1 fila. |
| 020 | `delete_category` sobre «Reserva» y sobre «Streaming» | HTTP 400 `23514` con «1 movimiento…» y «…1 suscripción…»; ambas siguen existiendo. |
| 021 | Con el token de A, `delete_category` sobre la categoría de B | HTTP 404, código `PT404`, «Categoría no encontrada» (igual que un uuid inexistente); con el token de B la categoría sigue ahí. Sin token (`anon`): HTTP 401/403, `42501`. |

## CP-CFG-022 — Cancelar no borra
| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Tocar «Eliminar» sobre una categoría sin uso y luego «Cancelar». | El diálogo se cierra y la categoría sigue en la lista. |

## Ejecución (2026-11-02, local)
pgTAP `delete_category.test.sql`: 13 de 13 (cubre 016 a 022 por API y el par C7). Playwright `e2e/settings.spec.ts` «US-89»: ver resultado en el PR.
