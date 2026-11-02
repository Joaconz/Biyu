# Casos de prueba V3 — Reactivar una cuenta archivada (US-90)

**Historia:** [#332](https://github.com/Joaconz/Biyu/issues/332) · DEF-026 (categorías) · FR-05 · C7, C10.
**Oráculo:** archivar una cuenta ya no es de ida: Ajustes → Cuentas muestra «Archivadas» con «Reactivar», como las categorías. Reactivar la devuelve a la lista activa y a Registrar; no cambia sus movimientos; si ya hay una cuenta activa con el mismo nombre, no se reactiva y lo avisa.
**Convenciones:** PR-01 crea el usuario y PR-04 su token (`docs/12-procedimientos-de-prueba.md`). Montos ficticios (C14).
**Automatización:** `e2e/accounts-unarchive.spec.ts`.

| ID | Título | Criterio | Técnica | Tipo | Canal | Prioridad | Automatizable |
|---|---|---|---|---|---|---|---|
| CP-CFG-023 | Archivar y reactivar una cuenta: desaparece y vuelve de Registrar | CA-1 | Casos de uso | Positivo | UI | Alta | Sí |
| CP-CFG-024 | Con una cuenta activa del mismo nombre no se reactiva y lo avisa | CA-2 | Particiones | Negativo | UI | Alta | Sí |
| CP-CFG-025 | Los movimientos de la cuenta no cambian al archivarla y reactivarla | CA-3 | Casos de uso | Positivo | UI y API | Media | Sí |
| CP-CFG-026 | Otro usuario y `anon` no pueden reactivar la cuenta ajena | CA-4 | Adivinación de errores | Negativo | API | Alta | Sí |

## CP-CFG-023 — Archivar y reactivar
**Pre-requisitos:** PR-01 con `reactivar-023@biyu.test`, configuración inicial salteada.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Ajustes → Cuentas, tocar «Archivar Efectivo» (`settings-accounts-archive-efectivo`). | «Efectivo» sale de la lista y aparece en «Archivadas» (`settings-accounts-archived-list`). |
| 2 | Abrir Registrar, escribir 500 y elegir una categoría. | Los chips de cuenta no incluyen «Efectivo». |
| 3 | En Ajustes, tocar «Reactivar Efectivo» (`settings-accounts-unarchive-efectivo`). | «Efectivo» vuelve a la lista activa y «Archivadas» desaparece. |
| 4 | Abrir Registrar de nuevo. | «Efectivo» está entre los chips de cuenta. |

## CP-CFG-024 — Nombre repetido
**Pre-requisitos:** PR-01 con `reactivar-024@biyu.test`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Archivar «Efectivo» y crear una cuenta nueva llamada `efectivo`. | Se crea: no hay otra activa con ese nombre. |
| 2 | Tocar «Reactivar Efectivo» en «Archivadas». | El error dice «Ya hay una cuenta activa llamada «Efectivo»» y la cuenta sigue en «Archivadas». |

## CP-CFG-025 — Movimientos intactos
**Pre-requisitos:** PR-01; un gasto de $1.200,00 en «Efectivo» (PR-04).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Archivar «Efectivo» y reactivarla. | Vuelve a la lista. |
| 2 | API: leer el gasto. | Mantiene su cuenta y su monto $1.200,00. |

## CP-CFG-026 — Autorización
**Pre-requisitos:** PR-01 para A y B; PR-04 para sus tokens; una cuenta archivada de A.

| # | Llamada | Resultado esperado |
|---|---|---|
| 1 | Con el token de B, `PATCH /accounts?id=eq.<id de A>` con `{"archived_at": null}`. | Devuelve `[]`: RLS no deja ver ni cambiar filas ajenas (C7). La cuenta de A sigue archivada. |
| 2 | Sin token (`anon`). | HTTP 401/403. |
