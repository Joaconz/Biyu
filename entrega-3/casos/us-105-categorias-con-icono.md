# Casos de prueba V3 — Categorías en su pantalla, con ícono y color elegidos (US-105)

**Historia:** [#413](https://github.com/Joaconz/Biyu/issues/413) · ADR-055, ADR-044 §4 · C6, C7 · US-89, US-94.
**Oráculo:** los criterios CA-1 a CA-5 de la historia. `/settings/categories` lista las categorías con su baldosa; crear y editar usan una hoja con nombre, 24 íconos más «Sin ícono», diez colores y vista previa; el ícono se guarda en `categories.icon` y Postgres valida `^[a-z0-9-]{1,40}$`.
**Convenciones:** PR-01 crea el usuario y PR-04 su token (`docs/12-procedimientos-de-prueba.md`). Montos ficticios (C14).
**Automatización:** `e2e/ux-ajustes.spec.ts` (CP-CFG-035 a 039), `tests/lib/visuals.test.ts` (catálogo) y `supabase/tests/database/` (check del ícono).

| ID | Título | Criterio | Técnica | Tipo | Canal | Prioridad | Automatizable |
|---|---|---|---|---|---|---|---|
| CP-CFG-035 | Crear una categoría con nombre, ícono y color la muestra en la lista con esa baldosa | CA-1 | Casos de uso | Positivo | UI | Alta | Sí |
| CP-CFG-036 | Editar una categoría sembrada preselecciona su ícono y al guardar queda escrito | CA-2 | Transición de estados | Positivo | UI | Media | Sí |
| CP-CFG-037 | Archivar, reactivar y eliminar desde la hoja, con confirmación al eliminar | CA-3 | Casos de uso | Positivo | UI | Alta | Sí |
| CP-CFG-038 | Postgres rechaza una clave de ícono con mayúsculas o de más de 40 caracteres | CA-4 | Valores límite | Límite | API | Alta | Sí |
| CP-CFG-039 | Otro usuario no ve ni modifica las categorías ajenas | CA-5 | Adivinación de errores | Negativo | API | Alta | Sí |

## CP-CFG-035 — Crear con ícono y color
**Pre-requisitos:** PR-01 con `icono-035@biyu.test`, configuración inicial salteada.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En `/settings/categories` tocar «Nueva categoría». | Se abre la hoja (desde abajo en el celular, popover desde `sm`) con nombre, grilla de íconos, colores y la vista previa (`settings-categories-preview`). |
| 2 | Escribir «Mascotas», elegir el ícono de la huella y el tercer color. | La vista previa muestra la baldosa con esa huella y ese color. |
| 3 | Guardar. | La hoja se cierra y «Mascotas» aparece en la lista con su baldosa. |
| 4 | Abrir `/register`, paso 2. | «Mascotas» está entre las categorías con su ícono. |

## CP-CFG-036 — Editar una sembrada
**Pre-requisitos:** PR-01 con `icono-036@biyu.test`, configuración inicial salteada.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Tocar el renglón «Transporte». | Se abre la hoja con el ícono de Transporte ya seleccionado. |
| 2 | Renombrar a «Movilidad» y guardar. | La lista muestra «Movilidad» con el mismo ícono. |
| 3 | API: `GET /rest/v1/categories?select=name,icon&name=eq.Movilidad`. | `icon` tiene la clave guardada (no es `null`). |

## CP-CFG-037 — Archivar, reactivar y eliminar
**Pre-requisitos:** PR-01 con `icono-037@biyu.test`; una categoría «Mascotas» sin movimientos.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir «Mascotas» y tocar «Archivar» al pie de la hoja. | Pasa al bloque plegado «Archivadas». |
| 2 | Desplegarlo y tocar «Reactivar». | Vuelve a la lista de activas. |
| 3 | Abrir «Mascotas» y tocar «Eliminar». | La hoja se cierra y aparece «¿Eliminar categoría?» con lo que se borra y que el nombre queda libre. |
| 4 | Tocar «Eliminar». | Aviso «Categoría eliminada» y desaparece de la lista. |

## CP-CFG-038 — Check del ícono
**Pre-requisitos:** PR-01 con `icono-038@biyu.test` y PR-04 (token); el id de una categoría propia.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | `PATCH /rest/v1/categories?id=eq.<id>` con `{"icon":"Paw-Print"}`. | HTTP 400 con `23514` (viola el check). |
| 2 | Repetir con una clave de 41 caracteres (`a` repetida). | HTTP 400, `23514`. |
| 3 | Repetir con `{"icon":"paw-print"}` y con 40 caracteres. | HTTP 200 en los dos. |

## CP-CFG-039 — Autorización
**Pre-requisitos:** dos usuarios A y B con PR-01 y PR-04; una categoría propia de A.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Con el token de B, `GET /rest/v1/categories?user_id=eq.<id de A>`. | `[]`. |
| 2 | Con el token de B, `PATCH` del `icon` de la categoría de A. | 200 con `[]`: no cambia ninguna fila; con el rol `anon`, 401 y `42501`. |
