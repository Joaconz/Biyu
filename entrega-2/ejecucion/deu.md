# Entrega 2 · Ejecución de casos de prueba · Deudas y gastos compartidos (DEU)

> **Nota del 2026-10-27.** Este es un registro histórico de la ejecución original, con los IDs anteriores. El catálogo de V2 se recortó después (de 672 a 206 casos) y se renumeró: varios casos que figuran acá ya no están en `casos/` y los demás tienen otro ID (ver [`equivalencia-ids.md`](../equivalencia-ids.md)). El registro vigente es [`04-ejecucion.md`](../04-ejecucion.md).

Registro de la ejecución manual de **CP-DEU-018 a CP-DEU-029** (más la variante CP-DEU-020B), los casos
negativos de `create_transaction` de la US-34 · CA-8. Los casos están escritos en
[`entrega-2/casos/deu.md`](../casos/deu.md); acá solo va el resultado. Mismo esquema de IDs que la
Entrega 1: historia `US-nn` → criterio `CA-k` → caso `CP-DEU-nnn` → resultado → defecto `DEF-nnn`.

## Condiciones de la ejecución

- **Fecha:** a completar por quien ejecutó.
- **Versión probada:** a completar (commit de `main` o deploy).
- **Entorno:** a completar.
- **Cómo se ejecutó:** manual, siguiendo los pasos de cada caso y los procedimientos `PR-nn` de
  [`docs/12-procedimientos-de-prueba.md`](../../docs/12-procedimientos-de-prueba.md).
- **Datos:** usuarios y montos ficticios (C14); cada caso con su propio usuario de prueba.

## Resultado por caso

| ID | Prioridad | Historia · criterio | Canal | Status | Defectos |
|---|---|---|---|---|---|
| CP-DEU-018 | Alta | US-34 · CA-8 | API | **PASSED** | — |
| CP-DEU-019 | Alta | US-34 · CA-8 | API | **PASSED** | — |
| CP-DEU-020 | Alta | US-34 · CA-8 | API | **PASSED** | — |
| CP-DEU-020B | Alta | US-82 · CA-14 | API | **PASSED** | — |
| CP-DEU-021 | Alta | US-34 · CA-8 | API | **PASSED** | — |
| CP-DEU-022 | Media | US-34 · CA-8 | API | **PASSED** | — |
| CP-DEU-023 | Media | US-34 · CA-8 | API | **PASSED** | — |
| CP-DEU-024 | Alta | US-34 · CA-8 | API | **PASSED** | — |
| CP-DEU-025 | Alta | US-34 · CA-8 | API | **PASSED** | — |
| CP-DEU-026 | Media | US-34 · CA-8 | API | **PASSED** | — |
| CP-DEU-027 | Media | US-34 · CA-8 | API | **PASSED** | — |
| CP-DEU-028 | Alta | US-34 · CA-8 | API | **PASSED** | — |
| CP-DEU-029 | Alta | US-34 · CA-8 | API | **BLOCKED** | — |

## Resumen

| Status | Casos |
|---|---:|
| PASSED | 12 |
| FAILED | 0 |
| BLOCKED | 1 |
| Pendiente (sin ejecutar) | 0 |
| **Total** | **13** |

## Pendientes

- **CP-DEU-029** (`create_transaction` con rol `anon` responde `42501`): **BLOCKED**. Ejecutado el 2026-10-25 en el
  entorno local: como está escrito (con `p_shared_persons` y `p_shared_amounts`) responde `404 PGRST202` («función no
  encontrada») porque la función de varias personas de US-82 todavía no existe (issue #270 abierto). Sin sesión y con la
  función actual de una sola persona sí responde `401` con el código `42501`. Se repite el caso cuando exista la función.
- **Navegación (CP-NAV-001 a 085):** su registro está en `ejecucion/nav.md` y en `04-ejecucion.xlsx`.
- El resto de los casos de Deudas (CP-DEU-001 a 017 y 030 en adelante) queda fuera de este registro.
