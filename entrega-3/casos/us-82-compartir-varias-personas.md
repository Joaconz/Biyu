# Casos de prueba V3 — Compartir un gasto con varias personas (US-82)

**Historia:** [#270](https://github.com/Joaconz/Biyu/issues/270) · ADR-040 (modifica ADR-036) · US-34, US-35, US-37, US-41 · C3, C4, C6, I7.
**Oráculo:** con «Gasto compartido» encendido, Registrar muestra una lista de 1 a 10 personas, cada una con su monto; la suma no puede superar el gasto (I7). Se guarda con **una sola** llamada a `create_transaction` (`p_shared_persons`, `p_shared_amounts`) que crea el gasto y una deuda por persona. «Dividir en partes iguales» reparte en n+1 partes (la del usuario absorbe el resto).
**Convenciones:** PR-01 crea el usuario y PR-04 su token (`docs/12-procedimientos-de-prueba.md`). Montos ficticios (C14). H es el mes de hoy en Argentina.
**Automatización:** `e2e/shared-many-people.spec.ts`, `supabase/tests/database/shared_expense_many_people.test.sql`, `shared_expense.test.sql`, `shared_expense_debt_cap.test.sql` y `tests/domain/shared-debt.test.ts`.

| ID | Título | Criterio | Técnica | Tipo | Canal | Prioridad | Automatizable |
|---|---|---|---|---|---|---|---|
| CP-DEU-085 | Agregar y quitar personas: foco, «Quitar» y renumeración | CA-1, CA-7, CA-9 | Casos de uso | Positivo | UI | Alta | Sí |
| CP-DEU-086 | Gasto de $120.000 con Sofía y Juan: una transacción, dos deudas, una sola llamada | CA-2 | Casos de uso | Positivo | UI y API | Alta | Sí |
| CP-DEU-087 | «Dividir en partes iguales»: con resto, sin resto y en US$ | CA-3, CA-20 | Valores límite | Positivo | UI | Alta | Sí |
| CP-DEU-088 | La suma contra el gasto: justo, un centavo de más y tope por fila | CA-4, CA-19 | Valores límite | Negativo | UI | Alta | Sí |
| CP-DEU-089 | Tope de 10 personas | CA-5 | Valores límite | Positivo y negativo | UI | Media | Sí |
| CP-DEU-090 | Persona repetida o vacía deshabilita «Guardar gasto» | CA-6, CA-8 | Particiones | Negativo | UI | Alta | Sí |
| CP-DEU-091 | Etiquetas «Compartido con…», aviso de éxito y diálogo de borrado con varias personas | CA-10, CA-11 | Casos de uso | Positivo | UI | Alta | Sí |
| CP-DEU-092 | Deudas: una fila por persona, orden alfabético, y eliminar/restaurar el gasto | CA-12, CA-13 | Casos de uso | Positivo | UI | Alta | Sí |
| CP-DEU-093 | La RPC rechaza pedidos inválidos y no deja filas | CA-14 | Adivinación de errores | Negativo | API | Alta | Sí |
| CP-DEU-094 | Con una sola persona rige lo de US-34 y US-41, con el pedido nuevo | CA-15 | Casos de uso | Positivo | UI y API | Alta | Sí |
| CP-DEU-095 | Cambiar la moneda, el tipo o el monto en el paso 1 con filas cargadas | CA-16, CA-17, CA-18 | Transición de estados | Positivo | UI | Media | Sí |

## CP-DEU-085 — Agregar y quitar
**Pre-requisitos:** PR-01 con `deuda-085@biyu.test`; Registrar en el paso 3 con un gasto.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Encender «Gasto compartido». | Una fila vacía (`data-index="1"`), sin «Quitar». |
| 2 | Tocar «Agregar persona». | Fila 2 vacía, foco en su «¿Con quién?»; «Quitar» en las dos. |
| 3 | Agregar una tercera, cargar tres personas y quitar la 2. | Quedan las filas 1 y 3 con sus valores y `data-index` 1 y 2. |
| 4 | Apagar el interruptor con 3 filas cargadas y guardar. | Se crea el gasto sin deudas. |
| 5 | Volver a encender. | Una sola fila vacía. |

## CP-DEU-086 — Guardar con dos personas
**Pre-requisitos:** PR-01; gasto de $120.000,00 ARS en 1 cuota; Sofía `40000` y Juan `40000`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Guardar con la red observada. | Una sola llamada a `create_transaction`; ninguna a `/rest/v1/debts` (C4). Aviso «Juan y Sofía te deben $80.000,00». |
| 2 | Revisar la base. | Una transacción y dos deudas `owed_to_me`, `pending`, de `40000.00`, con `transaction_id` de esa transacción. |

## CP-DEU-087 — Dividir en partes iguales
**Pre-requisitos:** PR-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Gasto $100.000,00, 2 filas, «Dividir en partes iguales». | `33333,33` en las dos; resumen «Te van a deber $66.666,66 entre 2 personas · Tu parte: $33.333,34». |
| 2 | Gasto $120.000,00, 3 filas. | `30000` en las tres; «Tu parte: $30.000,00». |
| 3 | Gasto US$100,00, 2 filas. | `33,33` en las dos. |
| 4 | Con montos ya escritos, dividir. | Los reemplaza. |
| 5 | Gasto $0,02 y 2 filas. | `0` en las dos y cada una muestra «El monto debe ser mayor a cero». |

## CP-DEU-088 — La suma contra el gasto
**Pre-requisitos:** PR-01; gasto de $120.000,00 y 2 filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | `60000` + `60000`. | Se guarda («Tu parte: $0,00»). |
| 2 | `60000` + `60000,01`. | `transaction-form-shared-total-error`: «Entre todos no pueden deber más que el gasto ($120.000,00)»; «Guardar gasto» deshabilitado; ninguna escritura. |
| 3 | Sofía `150000`. | En esa fila «No puede superar el monto del gasto ($120.000,00)»; no aparece el error de la suma. |

## CP-DEU-089 a CP-DEU-091 — Tope, repetidas, etiquetas
| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Llegar a 10 filas. | «Agregar persona» deshabilitado y «Podés compartir un gasto con hasta 10 personas»; guardar con 10 válidas crea 10 deudas. |
| 2 | «Sofía» en la fila 1 y «  sofía » en la 2. | En la fila 2 «Ya agregaste a Sofía»; «Guardar gasto» deshabilitado. |
| 3 | Una fila con la persona vacía y las demás bien. | «Guardar gasto» deshabilitado. |
| 4 | Gasto con Ana, Juan y Sofía de $30.000,00 cada una: ver Movimientos y Últimos movimientos. | «Compartido con Ana y 2 más» en cada cuota; con Juan y Sofía, «Compartido con Juan y Sofía». |
| 5 | Tocar la papelera del gasto de Ana, Juan y Sofía. | «También dejan de contar las deudas con Ana, Juan y Sofía por $90.000,00 en total.» |

## CP-DEU-092 — Deudas
| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/debts?status=all`. | Una fila por persona, con su línea de origen, en el orden Ana, Juan, Sofía (mismo `created_at`, desempate por persona). «Te deben» y el neto del Resumen suman las tres. |
| 2 | Eliminar el gasto y volver a Deudas. | Las tres deudas desaparecen de Deudas y de los totales. |
| 3 | Restaurar el gasto. | Vuelven con su estado. |

## CP-DEU-093 — RPC
**Pre-requisitos:** PR-04; `create_transaction` con gasto de `120000` salvo que se indique.

| # | Llamada | Resultado esperado |
|---|---|---|
| 1 | Solo `p_shared_persons`; 2 personas y 1 monto. | HTTP 400, `23514`, «Un gasto compartido necesita una persona y un monto por cada deuda». |
| 2 | `[]` en los dos. | «Un gasto compartido necesita al menos una persona». |
| 3 | 11 personas. | «Un gasto se comparte con hasta 10 personas». |
| 4 | «Sofía» y «SOFÍA». | «Cada persona puede aparecer una sola vez». |
| 5 | Montos `60000` y `60000.01`. | «I7: la suma de las deudas no puede superar el monto del gasto». |
| 6 | US$3,00, TC `1000.005`, tres deudas de `1`. | «I7: en pesos, la suma de las deudas supera el gasto por redondeo». |
| 7 | Segunda persona `"   "`. | «Ingresá con quién compartiste el gasto»; no se crea el gasto ni la primera deuda. |
| 8 | `p_type = 'income'` con deudas, y con 11 personas. | «Un ingreso no se puede compartir» en ambos. |
| 9 | Pedido válido con el rol `anon`. | `42501`. |
| 10 | En todos los rechazos. | Ninguna fila nueva en `transactions`, `ledger_entries` ni `debts`. |

## CP-DEU-094 y CP-DEU-095 — Una persona y cambios en el paso 1
| # | Paso o llamada | Resultado esperado |
|---|---|---|
| 1 | Una sola persona, UI. | Mismos textos, mensajes y `data-testid` de US-34 y US-41. |
| 2 | API con `"p_shared_persons": ["Sofía"], "p_shared_amounts": [60000]`. | Crea gasto y deuda. |
| 3 | Con 2 filas, volver al paso 1 y cambiar la moneda. | Los montos se vacían; las personas se conservan. |
| 4 | Con 2 filas, pasar a Ingreso y volver a Gasto. | El interruptor queda apagado; al encenderlo hay una fila vacía. |
| 5 | Sofía `40000` y Juan `40000`; bajar el gasto a $70.000,00. | «Entre todos no pueden deber más que el gasto ($70.000,00)». |
| 6 | Bajarlo a $30.000,00. | En cada fila «No puede superar el monto del gasto ($30.000,00)» y no el error de la suma; las deudas no se ajustan solas. |
