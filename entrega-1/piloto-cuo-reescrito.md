# Piloto · Módulo CUO (Cuotas) reescrito con el estándar de ADR-028

_Documento para revisar antes de reescribir los otros cinco módulos. Muestra cómo queda un módulo
completo con el estándar de `docs/07-plan-de-testing.md` §4 y los procedimientos de
`docs/12-procedimientos-de-prueba.md`. Cuando se apruebe el formato, esto se carga en
`fuentes/casos.mjs` (con los campos nuevos) y `generar.py` produce el `.md` y el `.xlsx` definitivos._

**Convenciones de este documento**

- `<APP>`, `<SUPABASE_URL>`, `<ANON_KEY>`: los del deploy bajo prueba. `<EMAIL>`: el del usuario del caso
  (patrón `qa+<ID del caso>-001@example.com`, contraseña `Clave123!`, `PR-01`).
- Toda compra lleva fecha pasada explícita (15/08/2026): el resultado no depende del día de ejecución (C1).
  Todo monto es ficticio (C14).
- Cada caso arranca con **su propio usuario**. Ninguno usa datos de otro.
- La lectura "por la API" es el oráculo de verificación (`PR-08`); el **canal** del caso es el que ejecuta la acción.

## 1. Criterios de aceptación de las historias de cuotas

Numerados en `01-historias-de-usuario.md` (ya aplicado a las 46 historias).

| Criterio | Texto |
|---|---|
| US-12 · CA-1 | Se pueden elegir de 1 a 12 cuotas |
| US-12 · CA-2 | N cuotas generan N imputaciones numeradas de 1 a N, en períodos consecutivos desde el de la fecha (I2, I3) |
| US-12 · CA-3 | Transacción e imputaciones se crean en una sola llamada a `create_transaction` (C4) |
| US-13 · CA-1 | La UI muestra "N cuotas de $X — de AAAA-MM a AAAA-MM" antes de guardar |
| US-14 · CA-1 | El selector aparece solo si la cuenta es `credit_card` y el tipo es gasto |
| US-14 · CA-2 | Si había cuotas elegidas y se cambia a otra cuenta, vuelve a 1 con un aviso |
| US-14 · CA-3 | La RPC rechaza `installments_count > 1` sobre cuenta no crediticia o sobre un ingreso (I6) |
| US-15 · CA-1 | $100.000 en 3 cuotas = 33.333,33 + 33.333,33 + 33.333,34 |
| US-15 · CA-2 | La suma de `amount` y de `amount_ars` de las imputaciones es exactamente el total (I1, I1') |
| US-15 · CA-3 | La última cuota absorbe el resto, en las dos series por separado |
| US-16 · CA-1 | El dashboard de un período muestra cuánto del total viene de cuotas iniciadas antes |
| US-17 · CA-1 | Cada imputación en cuotas se muestra como "n/N" en el listado del mes |
| US-18 · CA-1 | Al borrar la transacción, ninguna de sus imputaciones cuenta en ningún período, pasadas ni futuras (I10) |

El rango 1–12 de US-12 · CA-1 y la regla de la RPC `las cuotas van de 1 a 12` salen del ajuste de FR-09 registrado en `docs/08-trazabilidad.md` y `roadmap.md` §V1 (FR-09 original decía 2 a 24, "a confirmar"). El `code` y el mensaje
de cada rechazo son los del contrato de `create_transaction` (`supabase/migrations/`, C15).

## 2. De 13 casos a 21: mapeo con el catálogo anterior

| Caso anterior | Qué pasaba | Casos ahora |
|---|---|---|
| CP-CUO-001 | Bien acotado; la verificación pasa de "la base" a la API | CP-CUO-001 |
| CP-CUO-002 | Bien acotado | CP-CUO-002 |
| CP-CUO-003 | UI y API en el mismo caso | CP-CUO-003 (UI) + **CP-CUO-014** (API) |
| CP-CUO-004 | Bien acotado | CP-CUO-004 |
| CP-CUO-005 | Dos veredictos: vista previa y filas guardadas | CP-CUO-005 (vista previa) + **CP-CUO-015** (filas) |
| CP-CUO-006 | Cinco valores (0, 1, 2, 12, 13), un veredicto | CP-CUO-006 (1) · **016** (2) · **017** (0, API) · **018** (13, API) · **019** (la UI ofrece 1 a 12) · el 12 ya lo cubre CP-CUO-001 |
| CP-CUO-007 | Bien acotado | CP-CUO-007 |
| CP-CUO-008 | Bien acotado | CP-CUO-008 |
| CP-CUO-009 | Tres veredictos | CP-CUO-009 (borrar desde la 1.ª cuota) + **CP-CUO-020** (desde una cuota intermedia) |
| CP-CUO-010 | Bien acotado, con datos exactos nuevos | CP-CUO-010 |
| CP-CUO-011 | Solo API, sin pre-requisitos completos | CP-CUO-011 |
| CP-CUO-012 | UI y API en el mismo caso | CP-CUO-012 (UI) + **CP-CUO-021** (API) |
| CP-CUO-013 | Solo API, sin datos exactos | CP-CUO-013 |

## 3. Índice

| ID | Prioridad | Canal | Título | Historia · criterio | Tipo | Caso par |
|---|---|---|---|---|---|---|
| CP-CUO-001 | Alta | UI | 12 cuotas generan 12 imputaciones mensuales consecutivas | US-12 · CA-2 | Positivo | — |
| CP-CUO-002 | Alta | UI | La vista previa muestra el impacto mensual antes de guardar | US-13 · CA-1 | Positivo | — |
| CP-CUO-003 | Alta | UI | Cambiar a una cuenta que no es crédito oculta las cuotas y las vuelve a 1 | US-14 · CA-2 | Negativo | CP-CUO-014 |
| CP-CUO-004 | Alta | UI | 12 cuotas de una compra divisible dan 12 cuotas iguales | US-15 · CA-2 | Positivo | — |
| CP-CUO-005 | Alta | UI | La vista previa informa que la última cuota absorbe el resto | US-13 (Pantallas y campos) | Límite | — |
| CP-CUO-006 | Alta | UI | 1 cuota genera una sola imputación | US-12 · CA-1, CA-2 | Límite | — |
| CP-CUO-007 | Media | UI | El Resumen separa las cuotas de meses anteriores | US-16 · CA-1 | Positivo | — |
| CP-CUO-008 | Baja | UI | El listado muestra el número de cuota ("3/12") | US-17 · CA-1 | Positivo | — |
| CP-CUO-009 | Alta | UI | Borrar la 1.ª cuota elimina la compra entera de los meses siguientes | US-18 · CA-1 | Positivo | — |
| CP-CUO-010 | Media | UI | En USD, la suma en pesos de las cuotas es exacta | US-15 · CA-2 | Límite | — |
| CP-CUO-011 | Alta | API | Otro usuario no ve las cuotas de una compra ajena | US-48 · CA-2 | Negativo | — |
| CP-CUO-012 | Alta | UI | Un ingreso en cuenta de crédito no ofrece cuotas | US-14 · CA-1 | Negativo | CP-CUO-021 |
| CP-CUO-013 | Alta | API | Un fallo a mitad de create_transaction no deja datos parciales | US-12 · CA-3 | Negativo | — |
| CP-CUO-014 | Alta | API | La RPC rechaza 6 cuotas sobre una cuenta que no es de crédito | US-14 · CA-3 | Negativo | CP-CUO-003 |
| CP-CUO-015 | Alta | UI | El resto se guarda en la última cuota | US-15 · CA-1, CA-3 | Límite | — |
| CP-CUO-016 | Alta | UI | 2 cuotas generan dos imputaciones consecutivas | US-12 · CA-1 | Límite | — |
| CP-CUO-017 | Alta | API | La RPC rechaza 0 cuotas | US-12 · CA-1 | Límite | CP-CUO-019 |
| CP-CUO-018 | Alta | API | La RPC rechaza 13 cuotas | US-12 · CA-1 | Límite | CP-CUO-019 |
| CP-CUO-019 | Alta | UI | La pantalla ofrece exactamente las cuotas de 1 a 12 | US-12 · CA-1 | Límite | CP-CUO-017, 018 |
| CP-CUO-020 | Alta | UI | Borrar una cuota intermedia elimina también las cuotas pasadas | US-18 · CA-1 | Positivo | — |
| CP-CUO-021 | Alta | API | La RPC rechaza cuotas sobre un ingreso en cuenta de crédito | US-14 · CA-3 | Negativo | CP-CUO-012 |

---

## 4. Casos

### CP-CUO-001 — 12 cuotas generan 12 imputaciones mensuales consecutivas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-12 · CA-2 · FR-09 |
| Invariante | I2, I3 |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: PR-01 con `qa+cp-cuo-001-001@example.com`. S 2: PR-02 (cuenta "Visa BBVA"). S 3: PR-04 paso 1 (para leer las imputaciones al final). S 4: PR-06 con monto `120000` y cuenta "Visa BBVA".
**Datos de prueba:** D 1: monto `120000`. D 2: cuotas `12`. D 3: fecha `15/08/2026`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En "Cuotas", tocar "12". | "12" queda marcada y debajo aparece la vista previa de las cuotas. |
| 2 | En "Fecha", tocar "Otra" y escribir `15/08/2026`. | El campo muestra 15/08/2026. |
| 3 | Tocar "Guardar gasto". | Aparece el aviso "Gasto guardado" y el botón muestra "Guardado". |
| 4 | Hacer la primera consulta de PR-08 (imputaciones). | HTTP 200 y 12 filas. |
| 5 | Leer `installment_number` de las 12 filas. | Los valores son 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, sin saltos ni repetidos. |
| 6 | Leer `period` de las 12 filas. | `2026-08-01`, `2026-09-01`, … , `2027-07-01`: 12 meses consecutivos desde agosto 2026. |

**Post-condición:** el usuario tiene 1 compra y 12 imputaciones. El usuario queda como dato de prueba (email único, sin limpieza).

### CP-CUO-002 — La vista previa muestra el impacto mensual antes de guardar

| Campo | Contenido |
|---|---|
| Historia · criterio | US-13 · CA-1; el texto exacto del recuadro es el de "Pantallas y campos" de US-13 · FR-09 |
| Invariante | — |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: PR-01 con `qa+cp-cuo-002-001@example.com`. S 2: PR-02. S 3: PR-06 con monto `120000` y cuenta "Visa BBVA".
**Datos de prueba:** D 1: monto `120000`. D 2: cuotas `12`. D 3: fecha `15/08/2026`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En "Cuotas", tocar "12". | "12" queda marcada. |
| 2 | En "Fecha", tocar "Otra" y escribir `15/08/2026`. | El campo muestra 15/08/2026. |
| 3 | Leer el recuadro debajo de "Cuotas", sin tocar "Guardar gasto". | El recuadro dice "12 cuotas de $10.000,00 · de ago 2026 a jul 2027". No dice nada de "La última es de". |
| 4 | Abrir `<APP>/transactions?period=2026-08`, sin haber tocado "Guardar gasto". | Movimientos de agosto 2026 no tiene ninguna fila: la vista previa no guardó nada. |

**Post-condición:** ninguna transacción creada.

### CP-CUO-003 — Cambiar a una cuenta que no es crédito oculta las cuotas y las vuelve a 1

| Campo | Contenido |
|---|---|
| Historia · criterio | US-14 · CA-2 |
| Invariante | I6 |
| Técnica · Tipo | Tabla de decisión · Negativo |
| Canal · Caso par | UI · CP-CUO-014 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: PR-01 con `qa+cp-cuo-003-001@example.com`. S 2: PR-02. S 3: la cuenta "Efectivo" existe (viene en el catálogo inicial). S 4: PR-06 con monto `60000` y cuenta "Visa BBVA".
**Datos de prueba:** D 1: monto `60000`. D 2: cuotas `6`. D 3: cuenta de crédito "Visa BBVA" → cuenta "Efectivo" (tipo efectivo).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En "Cuotas", tocar "6". | "6" queda marcada y debajo aparece la vista previa de 6 cuotas. |
| 2 | En "Cuenta", tocar "Efectivo". | Aparece el aviso "Las cuotas volvieron a 1" y la sección "Cuotas" desaparece. |
| 3 | En "Cuenta", tocar "Visa BBVA" otra vez. | La sección "Cuotas" reaparece y tiene marcada "1", no "6" (US-14 · CA-2: "vuelve a 1"). |

**Post-condición:** nada guardado.

### CP-CUO-004 — 12 cuotas de una compra divisible dan 12 cuotas iguales

| Campo | Contenido |
|---|---|
| Historia · criterio | US-15 · CA-2 |
| Invariante | I1, I1' |
| Técnica · Tipo | Valores límite · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: PR-01 con `qa+cp-cuo-004-001@example.com`. S 2: PR-02. S 3: PR-04 paso 1. S 4: PR-07 con monto `120000`, cuotas `12` y fecha `15/08/2026`.
**Datos de prueba:** D 1: monto `120000`. D 2: cuotas `12`. D 3: fecha `15/08/2026`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Hacer la primera consulta de PR-08 (imputaciones). | HTTP 200 y 12 filas. |
| 2 | Leer `amount` y `amount_ars` de cada fila. | Las 12 filas tienen `"10000.00"` en `amount` y `"10000.00"` en `amount_ars`. |
| 3 | Sumar los 12 `amount`. | La suma es 120000,00 exacta (I1). |
| 4 | Hacer la segunda consulta de PR-08 (transacciones) y leer `amount`. | `"120000.00"`: coincide con la suma del paso 3. |

**Post-condición:** una compra y 12 imputaciones.

### CP-CUO-005 — La vista previa informa que la última cuota absorbe el resto

| Campo | Contenido |
|---|---|
| Historia · criterio | US-13 · "Pantallas y campos" ("La última es de $…") |
| Invariante | — |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: PR-01 con `qa+cp-cuo-005-001@example.com`. S 2: PR-02. S 3: PR-06 con monto `100000` y cuenta "Visa BBVA".
**Datos de prueba:** D 1: monto `100000`. D 2: cuotas `3`. D 3: fecha `15/08/2026`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En "Cuotas", tocar "3". | "3" queda marcada. |
| 2 | En "Fecha", tocar "Otra" y escribir `15/08/2026`. | El campo muestra 15/08/2026. |
| 3 | Leer el recuadro debajo de "Cuotas". | Dice "3 cuotas de $33.333,33 · de ago 2026 a oct 2026". |
| 4 | Leer la línea debajo de esa. | Dice "La última es de $33.333,34". |

**Post-condición:** nada guardado.

### CP-CUO-006 — 1 cuota genera una sola imputación

| Campo | Contenido |
|---|---|
| Historia · criterio | US-12 · CA-1 y CA-2 |
| Invariante | I2 |
| Técnica · Tipo | Valores límite (mínimo) · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: PR-01 con `qa+cp-cuo-006-001@example.com`. S 2: PR-02. S 3: PR-04 paso 1. S 4: PR-06 con monto `1200` y cuenta "Visa BBVA".
**Datos de prueba:** D 1: monto `1200`. D 2: cuotas `1`. D 3: fecha `15/08/2026`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En "Cuotas", verificar que "1" esté marcada y, si no lo está, tocarla. | "1" queda marcada. |
| 2 | En "Fecha", tocar "Otra" y escribir `15/08/2026`. | El campo muestra 15/08/2026. |
| 3 | Tocar "Guardar gasto". | Aparece el aviso "Gasto guardado". |
| 4 | Hacer la primera consulta de PR-08 (imputaciones). | HTTP 200 y exactamente 1 fila. |
| 5 | Leer la fila. | `installment_number` 1, `period` `2026-08-01`, `amount` `"1200.00"`. |

**Post-condición:** una compra y una imputación.

### CP-CUO-007 — El Resumen separa las cuotas de meses anteriores

| Campo | Contenido |
|---|---|
| Historia · criterio | US-16 · CA-1 |
| Invariante | — |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · Sí · Sí |

**Pre-requisitos:** S 1: PR-01 con `qa+cp-cuo-007-001@example.com`. S 2: PR-02. S 3: PR-07 con D 1, D 2 y D 3. Ningún otro gasto.
**Datos de prueba:** D 1: monto `120000`. D 2: cuotas `12`. D 3: fecha `15/08/2026`. D 4: período `2026-09`. Cuota de septiembre de esa compra = $10.000,00.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `<APP>/dashboard?period=2026-09`. | Se abre el Resumen de septiembre 2026. |
| 2 | Leer "Cuotas de meses anteriores". | Muestra $10.000,00. |

**Post-condición:** una compra y 12 imputaciones.

### CP-CUO-008 — El listado muestra el número de cuota ("3/12")

| Campo | Contenido |
|---|---|
| Historia · criterio | US-17 · CA-1 |
| Invariante | — |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Baja · Sí · Sí |

**Pre-requisitos:** S 1: PR-01 con `qa+cp-cuo-008-001@example.com`. S 2: PR-02. S 3: PR-07 con D 1, D 2 y D 3.
**Datos de prueba:** D 1: monto `120000`. D 2: cuotas `12`. D 3: fecha `15/08/2026`. D 4: período `2026-10` (cuota 3: agosto = 1, septiembre = 2, octubre = 3).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `<APP>/transactions?period=2026-10`. | Se abre Movimientos de octubre 2026. |
| 2 | Contar las filas del listado. | Hay una sola fila (la cuota de la compra). |
| 3 | Leer la etiqueta junto al título de la fila. | Dice "3/12". |
| 4 | Abrir `<APP>/transactions?period=2026-08`. | Se abre Movimientos de agosto 2026. |
| 5 | Leer la etiqueta de la fila. | Dice "1/12". |

**Post-condición:** una compra y 12 imputaciones.

### CP-CUO-009 — Borrar la 1.ª cuota elimina la compra entera de los meses siguientes

| Campo | Contenido |
|---|---|
| Historia · criterio | US-18 · CA-1 · FR-08 |
| Invariante | I10 |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: PR-01 con `qa+cp-cuo-009-001@example.com`. S 2: PR-02. S 3: PR-07 con D 1, D 2 y D 3.
**Datos de prueba:** D 1: monto `120000`. D 2: cuotas `12`. D 3: fecha `15/08/2026`. D 4: se borra desde agosto 2026 (cuota 1/12). D 5: se verifican octubre 2026 y julio 2027.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `<APP>/transactions?period=2026-08`. | Se ve la fila de la compra con "1/12". |
| 2 | Tocar el tacho de esa fila. | Se abre el diálogo "¿Eliminar transacción?" con "Cancelar" y "Eliminar". Este caso no evalúa qué meses lista el diálogo (eso lo hace CP-REG-013). |
| 3 | Tocar "Eliminar". | Aparece el aviso "Transacción eliminada". |
| 4 | Abrir `<APP>/dashboard?period=2026-10`. | Se ve "No tenés movimientos registrados en octubre." con el botón "Registrar un gasto". |
| 5 | Abrir `<APP>/dashboard?period=2027-07`. | Se ve "No tenés movimientos registrados en julio." con el botón "Registrar un gasto". |

**Post-condición:** la compra queda eliminada (borrado lógico). El usuario queda como dato de prueba (email único, sin limpieza).

### CP-CUO-010 — En USD, la suma en pesos de las cuotas es exacta

| Campo | Contenido |
|---|---|
| Historia · criterio | US-15 · CA-2 |
| Invariante | I1' |
| Técnica · Tipo | Adivinación de errores · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: PR-01 con `qa+cp-cuo-010-001@example.com`. S 2: PR-02. S 3: PR-04 paso 1.
**Datos de prueba:** D 1: monto USD `100`. D 2: tipo de cambio `1250,5555` (se escribe a mano, no hace falta referencia del mes). D 3: cuotas `3`. D 4: fecha `15/08/2026`. D 5: total en pesos esperado `125055,55`; cuotas en pesos esperadas `41685,18` · `41685,18` · `41685,19`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Registrar". | Se abre Registrar en el paso 1/3 ("¿Cuánto?"). |
| 2 | Tocar "US$". | Aparece el campo "Tipo de cambio (ARS por US$)" debajo del monto, vacío (US-20 · CA-2: sin referencia del mes el campo queda vacío y es obligatorio). |
| 3 | Escribir `100` en el monto. | El monto queda cargado. "Siguiente" sigue deshabilitado: falta el tipo de cambio. |
| 4 | En "Tipo de cambio (ARS por US$)", escribir `1250,5555`. | El campo muestra 1250,5555 y se habilita "Siguiente". |
| 5 | Tocar "Siguiente". | Pasa al paso 2/3 ("¿En qué?") con la grilla de categorías. |
| 6 | Tocar el chip "Otros". | Avanza solo al paso 3/3 ("Revisá y guardá"). |
| 7 | En "Cuenta", tocar "Visa BBVA". | "Visa BBVA" queda marcada. |
| 8 | En "Cuotas", tocar "3". | "3" queda marcada. |
| 9 | En "Fecha", tocar "Otra" y escribir `15/08/2026`. | El campo muestra 15/08/2026. |
| 10 | Tocar "Guardar gasto". | Aparece el aviso "Gasto guardado". |
| 11 | Hacer la primera consulta de PR-08 (imputaciones) y leer `amount_ars` de las 3 filas. | `"41685.18"`, `"41685.18"`, `"41685.19"`. |
| 12 | Leer `amount` de las 3 filas. | `"33.33"`, `"33.33"`, `"33.34"`. |
| 13 | Hacer la segunda consulta de PR-08 (transacciones) y leer `amount_ars`. | `"125055.55"`: igual a la suma de las 3 `amount_ars` (I1'). |

**Post-condición:** una compra en USD y 3 imputaciones.

### CP-CUO-011 — Otro usuario no ve las cuotas de una compra ajena

| Campo | Contenido |
|---|---|
| Historia · criterio | US-48 · CA-2 (otro usuario ve 0 filas) · C7 |
| Invariante | — |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: PR-05 con los emails `qa+cp-cuo-011-A@example.com` y `qa+cp-cuo-011-B@example.com`. S 2: PR-02 hecho por A. S 3: PR-07 hecho por A con D 1, D 2 y D 3. S 4: `<TOKEN-A>` y `<TOKEN-B>` (PR-05 paso 3).
**Datos de prueba:** D 1: monto `120000`. D 2: cuotas `12`. D 3: fecha `15/08/2026`. D 4: A tiene 12 imputaciones. D 5: B no tiene ninguna transacción (PR-05 no carga datos).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Hacer la consulta de imputaciones de PR-08 con `<TOKEN-A>`. | HTTP 200 y 12 filas. |
| 2 | Hacer la misma consulta, con los mismos parámetros, con `<TOKEN-B>`. | HTTP 200 y el cuerpo es `[]` (cero filas). No es un error: la RLS filtra. |

**Post-condición:** ningún dato modificado.

### CP-CUO-012 — Un ingreso en cuenta de crédito no ofrece cuotas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-14 · CA-1 |
| Invariante | I6 |
| Técnica · Tipo | Tabla de decisión · Negativo |
| Canal · Caso par | UI · CP-CUO-021 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: PR-01 con `qa+cp-cuo-012-001@example.com`. S 2: PR-02.
**Datos de prueba:** D 1: tipo "Ingreso". D 2: monto `50000`. D 3: cuenta "Visa BBVA" (de crédito).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo, tocar "Registrar". | Se abre el paso 1/3 ("¿Cuánto?"). |
| 2 | Tocar "Ingreso". | Queda seleccionado "Ingreso". |
| 3 | Escribir `50000` en el monto. | El monto queda cargado y se habilita "Siguiente". |
| 4 | Tocar "Siguiente". | Pasa al paso de detalles, sin pedir categoría (un ingreso no la lleva). |
| 5 | En "Cuenta", tocar "Visa BBVA". | "Visa BBVA" queda marcada. |
| 6 | Buscar la sección "Cuotas" en el paso de detalles. | No hay sección "Cuotas": no aparece ningún selector de cuotas. |

**Post-condición:** nada guardado.

### CP-CUO-013 — Un fallo a mitad de create_transaction no deja datos parciales

| Campo | Contenido |
|---|---|
| Historia · criterio | US-12 · CA-3 · C4 |
| Invariante | I4 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: PR-01 con `qa+cp-cuo-013-001@example.com`. S 2: PR-02. S 3: PR-04 pasos 1 y 2 (`<TOKEN>` y uuid de la categoría "Otros" y de la cuenta "Visa BBVA"; no escriben nada).
**Datos de prueba:** D 1: monto `"0.02"`. D 2: cuotas `3` (la cuota base da 0,00 y la función falla *después* de insertar la transacción). D 3: fecha `2026-08-15`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Hacer las dos consultas de PR-08 (imputaciones y transacciones). | Las dos devuelven `[]`: el usuario no tiene filas. |
| 2 | POST `<SUPABASE_URL>/rest/v1/rpc/create_transaction` con los headers de PR-04 y el body: `{"p_type":"expense","p_amount":"0.02","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Otros>","p_account_id":"<uuid Visa BBVA>","p_installments_count":3,"p_occurred_on":"2026-08-15","p_description":null}`. | HTTP 400, `code` `23514` y `message` "I4: cada cuota debe ser al menos 0,01". |
| 3 | Repetir las dos consultas de PR-08. | Las dos siguen devolviendo `[]`: la transacción que se insertó antes del error se revirtió (C4). |

**Post-condición:** sin filas nuevas.

### CP-CUO-014 — La RPC rechaza 6 cuotas sobre una cuenta que no es de crédito

| Campo | Contenido |
|---|---|
| Historia · criterio | US-14 · CA-3 |
| Invariante | I6 |
| Técnica · Tipo | Tabla de decisión · Negativo |
| Canal · Caso par | API · CP-CUO-003 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: PR-01 con `qa+cp-cuo-014-001@example.com`. S 2: PR-04 pasos 1 y 2 (`<TOKEN>`, uuid de "Otros" y de la cuenta "Efectivo").
**Datos de prueba:** D 1: monto `"60000.00"`. D 2: cuotas `6`. D 3: cuenta "Efectivo" (tipo `cash`). D 4: fecha `2026-08-15`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | POST `<SUPABASE_URL>/rest/v1/rpc/create_transaction` con los headers de PR-04 y el body: `{"p_type":"expense","p_amount":"60000.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Otros>","p_account_id":"<uuid Efectivo>","p_installments_count":6,"p_occurred_on":"2026-08-15","p_description":null}`. | HTTP 400, `code` `23514` y `message` "I6: las cuotas solo aplican a gastos con cuenta credit_card". |
| 2 | Hacer la consulta de transacciones de PR-08. | `[]`: no se creó nada. |

**Post-condición:** sin filas nuevas.

### CP-CUO-015 — El resto se guarda en la última cuota

| Campo | Contenido |
|---|---|
| Historia · criterio | US-15 · CA-1 y CA-3 |
| Invariante | I1, I1' |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: PR-01 con `qa+cp-cuo-015-001@example.com`. S 2: PR-02. S 3: PR-04 paso 1. S 4: PR-07 con monto `100000`, cuotas `3` y fecha `15/08/2026`.
**Datos de prueba:** D 1: monto `100000`. D 2: cuotas `3`. D 3: fecha `15/08/2026`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Hacer la primera consulta de PR-08 (imputaciones). | HTTP 200 y 3 filas. |
| 2 | Leer `amount` de las 3 filas en orden. | `"33333.33"`, `"33333.33"`, `"33333.34"`. |
| 3 | Leer `amount_ars` de las 3 filas en orden. | `"33333.33"`, `"33333.33"`, `"33333.34"`. |
| 4 | Sumar las 3 `amount`. | 100000,00 exacto. |

**Post-condición:** una compra y 3 imputaciones.

### CP-CUO-016 — 2 cuotas generan dos imputaciones consecutivas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-12 · CA-1 |
| Invariante | I2 |
| Técnica · Tipo | Valores límite (mínimo + 1) · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: PR-01 con `qa+cp-cuo-016-001@example.com`. S 2: PR-02. S 3: PR-04 paso 1. S 4: PR-06 con monto `1200` y cuenta "Visa BBVA".
**Datos de prueba:** D 1: monto `1200`. D 2: cuotas `2`. D 3: fecha `15/08/2026`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En "Cuotas", tocar "2". | "2" queda marcada. |
| 2 | En "Fecha", tocar "Otra" y escribir `15/08/2026`. | El campo muestra 15/08/2026. |
| 3 | Tocar "Guardar gasto". | Aparece el aviso "Gasto guardado". |
| 4 | Hacer la primera consulta de PR-08 (imputaciones). | HTTP 200 y exactamente 2 filas. |
| 5 | Leer las filas en orden. | Fila 1: `installment_number` 1, `period` `2026-08-01`, `amount` `"600.00"`. Fila 2: `installment_number` 2, `period` `2026-09-01`, `amount` `"600.00"`. |

**Post-condición:** una compra y 2 imputaciones.

### CP-CUO-017 — La RPC rechaza 0 cuotas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-12 · CA-1 · FR-09 |
| Invariante | — |
| Técnica · Tipo | Valores límite (mínimo − 1) · Límite |
| Canal · Caso par | API · CP-CUO-019 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: PR-01 con `qa+cp-cuo-017-001@example.com`. S 2: PR-02. S 3: PR-04 pasos 1 y 2 (`<TOKEN>`, uuid de "Otros" y de "Visa BBVA").
**Datos de prueba:** D 1: monto `"1200.00"`. D 2: cuotas `0`. D 3: fecha `2026-08-15`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | POST `<SUPABASE_URL>/rest/v1/rpc/create_transaction` con los headers de PR-04 y el body: `{"p_type":"expense","p_amount":"1200.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Otros>","p_account_id":"<uuid Visa BBVA>","p_installments_count":0,"p_occurred_on":"2026-08-15","p_description":null}`. | HTTP 400, `code` `23514` y `message` "las cuotas van de 1 a 12". |
| 2 | Hacer la consulta de transacciones de PR-08. | `[]`: no se creó nada. |

**Post-condición:** sin filas nuevas.

### CP-CUO-018 — La RPC rechaza 13 cuotas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-12 · CA-1 · FR-09 |
| Invariante | — |
| Técnica · Tipo | Valores límite (máximo + 1) · Límite |
| Canal · Caso par | API · CP-CUO-019 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: PR-01 con `qa+cp-cuo-018-001@example.com`. S 2: PR-02. S 3: PR-04 pasos 1 y 2.
**Datos de prueba:** D 1: monto `"1200.00"`. D 2: cuotas `13`. D 3: fecha `2026-08-15`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | POST `<SUPABASE_URL>/rest/v1/rpc/create_transaction` con los headers de PR-04 y el body: `{"p_type":"expense","p_amount":"1200.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Otros>","p_account_id":"<uuid Visa BBVA>","p_installments_count":13,"p_occurred_on":"2026-08-15","p_description":null}`. | HTTP 400, `code` `23514` y `message` "las cuotas van de 1 a 12". |
| 2 | Hacer la consulta de transacciones de PR-08. | `[]`: no se creó nada. |

**Post-condición:** sin filas nuevas.

### CP-CUO-019 — La pantalla ofrece exactamente las cuotas de 1 a 12

| Campo | Contenido |
|---|---|
| Historia · criterio | US-12 · CA-1 |
| Invariante | — |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · CP-CUO-017, CP-CUO-018 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: PR-01 con `qa+cp-cuo-019-001@example.com`. S 2: PR-02. S 3: PR-06 con monto `1200` y cuenta "Visa BBVA".
**Datos de prueba:** D 1: monto `1200`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Contar los botones de la sección "Cuotas". | Hay 12 botones. |
| 2 | Leer las etiquetas de los botones, de izquierda a derecha y de arriba abajo. | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12. No hay un botón "0" ni uno "13". |

**Post-condición:** nada guardado.

### CP-CUO-020 — Borrar una cuota intermedia elimina también las cuotas pasadas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-18 · CA-1 · FR-08 |
| Invariante | I10 |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: PR-01 con `qa+cp-cuo-020-001@example.com`. S 2: PR-02. S 3: PR-07 con D 1, D 2 y D 3.
**Datos de prueba:** D 1: monto `120000`. D 2: cuotas `12`. D 3: fecha `15/08/2026`. D 4: se borra desde octubre 2026 (cuota 3/12). D 5: se verifican agosto y septiembre 2026 (cuotas 1 y 2).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `<APP>/transactions?period=2026-10`. | Se ve la fila de la compra con "3/12". |
| 2 | Tocar el tacho de esa fila. | Se abre el diálogo "¿Eliminar transacción?" con "Cancelar" y "Eliminar" Este caso no evalúa qué meses lista el diálogo (eso lo hace CP-REG-013). |
| 3 | Tocar "Eliminar". | Aparece el aviso "Transacción eliminada". |
| 4 | Abrir `<APP>/dashboard?period=2026-08`. | Se ve "No tenés movimientos registrados en agosto." con el botón "Registrar un gasto". |
| 5 | Abrir `<APP>/dashboard?period=2026-09`. | Se ve "No tenés movimientos registrados en septiembre." con el botón "Registrar un gasto". |

**Post-condición:** la compra queda eliminada (borrado lógico).

### CP-CUO-021 — La RPC rechaza cuotas sobre un ingreso en cuenta de crédito

| Campo | Contenido |
|---|---|
| Historia · criterio | US-14 · CA-3 |
| Invariante | I6 |
| Técnica · Tipo | Tabla de decisión · Negativo |
| Canal · Caso par | API · CP-CUO-012 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: PR-01 con `qa+cp-cuo-021-001@example.com`. S 2: PR-02. S 3: PR-04 pasos 1 y 2 (`<TOKEN>` y uuid de "Visa BBVA").
**Datos de prueba:** D 1: tipo `income`. D 2: monto `"50000.00"`. D 3: cuotas `3`. D 4: categoría `null` (un ingreso no la lleva). D 5: fecha `2026-08-15`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | POST `<SUPABASE_URL>/rest/v1/rpc/create_transaction` con los headers de PR-04 y el body: `{"p_type":"income","p_amount":"50000.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":null,"p_account_id":"<uuid Visa BBVA>","p_installments_count":3,"p_occurred_on":"2026-08-15","p_description":null}`. | HTTP 400, `code` `23514` y `message` "I6: las cuotas solo aplican a gastos con cuenta credit_card". |
| 2 | Hacer la consulta de transacciones de PR-08. | `[]`: no se creó nada. |

**Post-condición:** sin filas nuevas.

---

## 5. Revisión de `spec-critic` y decisiones abiertas

`spec-critic` revisó este piloto el 2026-10-06 y encontró 2 bloqueantes, 3 altos y 19 medios. Ya corregidos acá y en `docs/12`:

- PR-05 ya no carga gastos (hacía que CP-CUO-011 diera 13 filas y 1 fila en vez de 12 y `[]`) y PR-04 separa "obtener token", "obtener uuid" (solo lectura) y la plantilla de llamada, que ya no se cita como pre-requisito.
- CP-CUO-010: pasos con navegación, una acción por paso, y "Siguiente" deshabilitado hasta cargar el tipo de cambio (US-20 · CA-2).
- Los PR dejaron de ser un paso y pasaron a pre-requisitos; los datos de la compra pasaron a "Datos de prueba".
- Los controles positivos de CP-CUO-014 y 021, y los pasos de CP-CUO-007 y 016 que mezclaban veredictos, se sacaron.
- Sacados los oráculos que salían de la app y no del spec (vista previa con N=1, "$0,00" en el mes de la compra, valor por defecto "1").
- CP-CUO-018 con el body completo, citas de criterio corregidas, `Caso par` solo entre negativos UI ↔ API, y limpieza definida ("el usuario queda como dato de prueba").

**Decisiones del PO (Joaquín) antes de seguir con los otros módulos:**

1. **US-48 · CA-2 vs C7.** El criterio dice que el rol `anon` ve "0 filas"; la base responde `permission denied` (42501). Saqué el paso `anon` de CP-CUO-011 y la regla queda para el módulo `ACC`. ¿Se corrige el CA o el contrato?
2. **US-14 · CA-2.** "Si había cuotas elegidas y se cambia a otra cuenta, vuelve a 1": ¿cualquier cambio de cuenta, o solo a una que no es de crédito? El código solo resetea en el segundo caso. Si el criterio es literal, cambiar de una tarjeta de crédito a otra es un defecto. Hoy ningún caso cubre ese cambio crédito → crédito.
3. **Redondeo de `amount_ars`** cuando `monto × tipo de cambio` tiene más de 2 decimales: `04-data-model.md` no dice si redondea o trunca, así que no hay oráculo para ese borde de I1'.

**Huecos que quedan como casos por escribir** (no entraron al piloto): par UI del rechazo de una cuota menor a $0,01 (CP-CUO-013 solo tiene el lado API) y su borde válido ($0,03 en 3 cuotas); el segundo trigger de I6 (una cuenta con compras en cuotas no puede dejar de ser de crédito, DEF-009); la vista previa en USD; "n/N" en "Últimos movimientos"; doble toque en "Guardar gasto". Los criterios que son escenarios BDD (US-13 · CA-2, US-16 · CA-2, US-18 · CA-2) no tienen caso manual: hay que decidir qué test automatizado los cubre.

**Cuando se apruebe el formato:** actualizar la línea "Casos de prueba" de US-12 a US-18 en `01-historias-de-usuario.md` y `docs/08-trazabilidad.md` con los IDs nuevos (CP-CUO-014 a 021).

## 6. Qué le pedimos al revisor del piloto

1. ¿Alcanza este nivel de detalle para ejecutar un caso sin preguntarle a quien lo escribió?
2. ¿Los procedimientos `PR-nn` como pre-requisito (en vez de pasos copiados) se entienden, o conviene repetir algo?
3. ¿Se acepta que la verificación se haga con `curl` (PR-08) en vez de mirar la base? Es lo que permite
   ejecutar contra producción sin acceso a la base.
4. Los textos "Las cuotas volvieron a 1", "Transacción eliminada" y "No tenés movimientos registrados en <mes>."
   salen de la UI vigente y hay que revalidarlos al ejecutar; los montos y los `code` salen del spec y del contrato de la RPC.
