# Casos de prueba V3 — Sugerir personas ya cargadas (US-100)

**Historia:** [#361](https://github.com/Joaconz/Biyu/issues/361) · hallazgos 8 y 10 de la auditoría [#352](https://github.com/Joaconz/Biyu/issues/352) · US-36, US-34, US-82, US-91 · C1, C7.
**Oráculo:** al escribir en «Persona» (Nueva deuda) o en «¿Con quién?» (gasto compartido de Registrar) se sugieren las personas de mis deudas que coinciden, con la misma clave de US-91 (sin distinguir mayúsculas, tildes ni espacios de más), por contenido y con las que empiezan igual primero; cada persona sale una vez. Elegir una sugerencia completa el campo con ese nombre. Sin coincidencias o con el campo vacío no hay lista. Es un combobox accesible (`role="combobox"`, `aria-expanded`, lista `role="listbox"`) que se maneja con el teclado. Sugerir no obliga: se puede escribir un nombre nuevo. Nueva deuda tiene «‹ Deudas» en el encabezado. Solo lee (RLS, C7): no cambia datos.
**Convenciones:** PR-01 crea el usuario y PR-04 su token (`docs/12-procedimientos-de-prueba.md`); las deudas se cargan con `create_debt` (PR-04). Montos ficticios (C14).
**Automatización:** `e2e/debt-person-suggestions.spec.ts` y `tests/domain/person-suggestions.test.ts`.

| ID | Título | Criterio | Técnica | Tipo | Canal | Prioridad | Automatizable |
|---|---|---|---|---|---|---|---|
| CP-DEU-096 | Al escribir en «Persona» sugiere las personas que coinciden, sin distinguir mayúsculas ni tildes | CA-1 | Particiones | Positivo | UI | Alta | Sí |
| CP-DEU-097 | Elegir una sugerencia completa el campo, no marca error y guarda en la misma persona | CA-2 | Casos de uso | Positivo | UI | Alta | Sí |
| CP-DEU-098 | Sin coincidencias o con el campo vacío no sugiere nada | CA-3 | Particiones | Negativo | UI | Alta | Sí |
| CP-DEU-099 | Con el teclado: flechas recorren, Enter elige sin enviar y Escape cierra | CA-4 | Transición de estados | Positivo | UI | Media | Sí |
| CP-DEU-100 | En el gasto compartido de Registrar también sugiere | CA-5 | Casos de uso | Positivo | UI | Media | Sí |
| CP-DEU-101 | Nueva deuda tiene «‹ Deudas» en el encabezado y vuelve a la lista | CA-6 | Casos de uso | Positivo | UI | Media | Sí |
| CP-DEU-102 | `suggestPeople`: normaliza, ordena, no repite, limita y no sugiere lo ya escrito | CA-1, CA-3 | Particiones | Positivo | Dominio | Alta | Sí |

## CP-DEU-096 — Sugerencias al escribir
**Pre-requisitos:** PR-01 con `sug-096@biyu.test`; deudas a nombre de `Sofía`, `Juan Pérez` y `Mariana`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/debts/new` y escribir `SOFI` en «Persona». | Una sola sugerencia, «Sofía» (`debt-form-person-suggestion`); el campo tiene `aria-expanded="true"`. |
| 2 | Cambiar el texto por `juan p`. | Una sola sugerencia, «Juan Pérez». |

## CP-DEU-097 — Elegir una sugerencia
**Pre-requisitos:** PR-01; una deuda a nombre de `Sofía`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/debts/new`, escribir `sof` y tocar la sugerencia «Sofía». | «Persona» queda con `Sofía`, la lista se cierra y no aparece el error del campo. |
| 2 | Cargar monto 5000 y tocar «Guardar deuda». | Vuelve a `/debts?status=pending` y las dos deudas están en un solo grupo de Sofía (`debts-group-sofia`). |

## CP-DEU-098 — Sin coincidencias
**Pre-requisitos:** PR-01; una deuda a nombre de `Sofía`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/debts/new`. | Con «Persona» vacía no hay lista. |
| 2 | Escribir `Zulema`. | No hay lista (`aria-expanded="false"`); se puede seguir cargando con un nombre nuevo. |

## CP-DEU-099 — Teclado
**Pre-requisitos:** PR-01; deudas a nombre de `Ana` y `Mariana`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En «Persona» escribir `an`. | Dos sugerencias: «Ana» y «Mariana» (las que empiezan igual primero). |
| 2 | Apretar flecha abajo dos veces. | La segunda queda activa (`aria-selected="true"`). |
| 3 | Apretar Enter. | «Persona» queda con `Mariana` y el formulario no se envía (sigue en `/debts/new`). |
| 4 | Escribir `an` otra vez y apretar Escape. | La lista se cierra. |

## CP-DEU-100 — Gasto compartido de Registrar
**Pre-requisitos:** PR-01; una deuda a nombre de `Sofía`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En `/register` cargar monto 1000, categoría «Otros», cuenta «Efectivo» y encender «Gasto compartido». | Aparece la fila «¿Con quién?». |
| 2 | Escribir `sofi` y tocar la sugerencia. | El campo queda con `Sofía`. |

## CP-DEU-101 — Botón atrás
**Pre-requisitos:** PR-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/debts/new`. | El encabezado muestra «‹ Deudas» (`debt-form-back`). |
| 2 | Tocarlo. | Se abre `/debts`. |

## CP-DEU-102 — `suggestPeople` (dominio)
| Entrada | Resultado esperado |
|---|---|
| Conocidas `Sofía`, `Juan Pérez`, `juan`, `Mariana`, `Ana`; escrito `SOFIA` | `Sofía`. |
| Escrito `  juán  p` | `Juan Pérez`. |
| Escrito `an` | `Ana`, `Juan Pérez`, `juan`, `Mariana` (primero las que empiezan igual). |
| Conocidas `Juan`, `juan`, `Juán`; escrito `ju` | Una sola, `Juan` (la más reciente). |
| Escrito `zzz`, vacío o `Sofía` con `Sofía` ya cargada tal cual | Ninguna. |
| Siete coincidencias | Máximo cinco. |
