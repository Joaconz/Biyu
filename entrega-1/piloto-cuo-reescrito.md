# Piloto · Módulo CUO (Cuotas) reescrito con el estándar de ADR-028

_Documento para revisar antes de reescribir los otros cinco módulos. Muestra cómo queda un módulo
completo con el estándar de `docs/07-plan-de-testing.md` §4 y los procedimientos de
`docs/12-procedimientos-de-prueba.md`. Cuando se apruebe el formato, esto se carga en
`fuentes/casos.mjs` (con los campos nuevos) y `generar.py` produce el `.md` y el `.xlsx` definitivos._

**Convenciones de este documento**

- **Pasos explícitos:** cada click y cada texto escrito es un paso, con el nombre que se ve en pantalla. Cada caso
  empieza abriendo el navegador e iniciando sesión; nadie necesita conocer la app para ejecutarlo.
- **La verificación es por la pantalla** (Movimientos y Resumen) siempre que la app muestra el dato. Solo los
  casos de canal API (negativos directos a Supabase, C6) usan `curl`.
- `<APP>` es la dirección del deploy bajo prueba. Cada caso usa **su propio usuario** (`qa+<ID del caso>-001@example.com`,
  contraseña `Clave123!`), creado antes con PR-01. Las compras usan la cuenta "Tarjeta de crédito", que viene en el
  catálogo inicial.
- Toda compra lleva fecha pasada explícita (15/08/2026): el resultado no depende del día de ejecución (C1).
  Todo monto es ficticio (C14).

## 1. Criterios de aceptación de las historias de cuotas

Numerados en `01-historias-de-usuario.md` (ya aplicado a las 46 historias).

| Criterio | Texto |
|---|---|
| US-12 · CA-1 | Se pueden elegir de 1 a 12 cuotas |
| US-12 · CA-2 | N cuotas generan N imputaciones numeradas de 1 a N, en períodos consecutivos desde el de la fecha (I2, I3) |
| US-12 · CA-3 | Transacción e imputaciones se crean en una sola llamada a `create_transaction` (C4) |
| US-13 · CA-1 | La UI muestra "N cuotas de $X — de AAAA-MM a AAAA-MM" antes de guardar |
| US-14 · CA-1 | El selector aparece solo si la cuenta es `credit_card` y el tipo es gasto |
| US-14 · CA-2 | Si había cuotas elegidas y se cambia a una cuenta que no es de crédito (o a ingreso), vuelve a 1 con un aviso; entre dos tarjetas de crédito se conservan |
| US-14 · CA-3 | La RPC rechaza `installments_count > 1` sobre cuenta no crediticia o sobre un ingreso (I6) |
| US-15 · CA-1 | $100.000 en 3 cuotas = 33.333,33 + 33.333,33 + 33.333,34 |
| US-15 · CA-2 | La suma de `amount` y de `amount_ars` de las imputaciones es exactamente el total (I1, I1') |
| US-15 · CA-3 | La última cuota absorbe el resto, en las dos series por separado |
| US-16 · CA-1 | El dashboard de un período muestra cuánto del total viene de cuotas iniciadas antes |
| US-17 · CA-1 | Cada imputación en cuotas se muestra como "n/N" en el listado del mes |
| US-18 · CA-1 | Al borrar la transacción, ninguna de sus imputaciones cuenta en ningún período, pasadas ni futuras (I10) |

El rango 1–12 de US-12 · CA-1 y la regla de la RPC `las cuotas van de 1 a 12` salen del ajuste de FR-09 registrado en `docs/08-trazabilidad.md` y `roadmap.md` §V1 (FR-09 original decía 2 a 24, "a confirmar"). El `code` y el mensaje
de cada rechazo son los del contrato de `create_transaction` (`supabase/migrations/`, C15).

## 2. De 13 casos a 22: mapeo con el catálogo anterior

| Caso anterior | Qué pasaba | Casos ahora |
|---|---|---|
| CP-CUO-001 | Bien acotado; la verificación pasa de "la base" a la API | CP-CUO-001 |
| CP-CUO-002 | Bien acotado | CP-CUO-002 |
| CP-CUO-003 | UI y API en el mismo caso; no cubría el cambio entre dos tarjetas | CP-CUO-003 (UI) + **CP-CUO-014** (API) + **CP-CUO-022** (crédito → crédito) |
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
| CP-CUO-006 | Alta | UI | 1 cuota genera una sola imputación | US-12 · CA-1, CA-2 | Límite | CP-CUO-017 |
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
| CP-CUO-022 | Media | UI | Cambiar entre dos tarjetas de crédito conserva las cuotas | US-14 · CA-2 | Positivo | — |

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

**Pre-requisitos:** S 1: usuario `qa+cp-cuo-001-001@example.com` con contraseña `Clave123!`, creado con PR-01 (configuración inicial salteada). Trae la cuenta "Tarjeta de crédito" del catálogo inicial.
**Datos de prueba:** D 1: monto `120000`. D 2: cuotas `12`. D 3: fecha `15/08/2026`. D 4: meses esperados: agosto 2026 a julio 2027.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 2 | Hacer click en el campo "Email". | El cursor queda dentro del campo "Email". |
| 3 | Escribir `qa+cp-cuo-001-001@example.com`. | El campo muestra `qa+cp-cuo-001-001@example.com`. |
| 4 | Hacer click en el campo "Contraseña". | El cursor queda dentro del campo "Contraseña". |
| 5 | Escribir `Clave123!`. | El campo muestra 9 puntos: la contraseña queda oculta. |
| 6 | Hacer click en el botón "Entrar". | Se abre la app en la pantalla Registrar. |
| 7 | Hacer click en la pestaña "Registrar" de la barra de abajo (en computadora, en el menú de la izquierda). | Se ve el paso 1 de 3, "¿Cuánto?", con "Gasto" y "$" seleccionados. |
| 8 | Hacer click en el campo del monto (el número grande que dice "0"). | El cursor queda en el campo del monto. |
| 9 | Escribir `120000`. | El campo muestra 120000 y se habilita el botón "Siguiente". |
| 10 | Hacer click en el botón "Siguiente". | Se ve el paso 2 de 3, "¿En qué?", con la grilla de categorías. |
| 11 | Hacer click en la categoría "Otros". | La app pasa sola al paso 3 de 3, "Revisá y guardá". |
| 12 | En la sección "Cuenta", hacer click en "Tarjeta de crédito". | "Tarjeta de crédito" queda marcada. |
| 13 | En la sección "Cuotas", hacer click en el botón "12". | El botón "12" queda marcado. |
| 14 | En la sección "Fecha", hacer click en "Otra". | "Otra" queda marcada y el campo de fecha se puede editar. |
| 15 | Hacer click en el campo de fecha. | El cursor queda en el campo de fecha. |
| 16 | Escribir `15/08/2026`. | El campo muestra 15/08/2026. |
| 17 | Hacer click en el botón "Guardar gasto". | Aparece el aviso "Gasto guardado" y el botón pasa a decir "Guardado". |
| 18 | Hacer click en la barra de direcciones del navegador. | El texto de la barra queda seleccionado. |
| 19 | Escribir `<APP>/transactions?period=2026-08` y presionar Enter. | Se abre Movimientos de agosto 2026. |
| 20 | Leer la fila de la compra. | Hay una sola fila, con la etiqueta "1/12" y el monto $10.000,00. |
| 21 | Hacer click en la flecha "Mes siguiente", junto al título. | El título cambia a septiembre 2026 y hay una sola fila, con la etiqueta "2/12" y el monto $10.000,00. |
| 22 | Hacer click en la flecha "Mes siguiente", junto al título. | El título cambia a octubre 2026 y hay una sola fila, con la etiqueta "3/12" y el monto $10.000,00. |
| 23 | Hacer click en la flecha "Mes siguiente", junto al título. | El título cambia a noviembre 2026 y hay una sola fila, con la etiqueta "4/12" y el monto $10.000,00. |
| 24 | Hacer click en la flecha "Mes siguiente", junto al título. | El título cambia a diciembre 2026 y hay una sola fila, con la etiqueta "5/12" y el monto $10.000,00. |
| 25 | Hacer click en la flecha "Mes siguiente", junto al título. | El título cambia a enero 2027 y hay una sola fila, con la etiqueta "6/12" y el monto $10.000,00. |
| 26 | Hacer click en la flecha "Mes siguiente", junto al título. | El título cambia a febrero 2027 y hay una sola fila, con la etiqueta "7/12" y el monto $10.000,00. |
| 27 | Hacer click en la flecha "Mes siguiente", junto al título. | El título cambia a marzo 2027 y hay una sola fila, con la etiqueta "8/12" y el monto $10.000,00. |
| 28 | Hacer click en la flecha "Mes siguiente", junto al título. | El título cambia a abril 2027 y hay una sola fila, con la etiqueta "9/12" y el monto $10.000,00. |
| 29 | Hacer click en la flecha "Mes siguiente", junto al título. | El título cambia a mayo 2027 y hay una sola fila, con la etiqueta "10/12" y el monto $10.000,00. |
| 30 | Hacer click en la flecha "Mes siguiente", junto al título. | El título cambia a junio 2027 y hay una sola fila, con la etiqueta "11/12" y el monto $10.000,00. |
| 31 | Hacer click en la flecha "Mes siguiente", junto al título. | El título cambia a julio 2027 y hay una sola fila, con la etiqueta "12/12" y el monto $10.000,00. |
| 32 | Hacer click en la flecha "Mes siguiente", junto al título. | El título cambia a agosto 2027 y se ve "No hay movimientos en este mes.": la compra no tiene cuota en ese mes. |

**Post-condición:** una compra y 12 imputaciones. El usuario queda como dato de prueba (email único, sin limpieza).

### CP-CUO-002 — La vista previa muestra el impacto mensual antes de guardar

| Campo | Contenido |
|---|---|
| Historia · criterio | US-13 · CA-1; el texto exacto es el de "Pantallas y campos" de US-13 · FR-09 |
| Invariante | — |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-cuo-002-001@example.com` con contraseña `Clave123!`, creado con PR-01 (configuración inicial salteada). Trae la cuenta "Tarjeta de crédito" del catálogo inicial.
**Datos de prueba:** D 1: monto `120000`. D 2: cuotas `12`. D 3: fecha `15/08/2026`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 2 | Hacer click en el campo "Email". | El cursor queda dentro del campo "Email". |
| 3 | Escribir `qa+cp-cuo-002-001@example.com`. | El campo muestra `qa+cp-cuo-002-001@example.com`. |
| 4 | Hacer click en el campo "Contraseña". | El cursor queda dentro del campo "Contraseña". |
| 5 | Escribir `Clave123!`. | El campo muestra 9 puntos: la contraseña queda oculta. |
| 6 | Hacer click en el botón "Entrar". | Se abre la app en la pantalla Registrar. |
| 7 | Hacer click en la pestaña "Registrar" de la barra de abajo (en computadora, en el menú de la izquierda). | Se ve el paso 1 de 3, "¿Cuánto?", con "Gasto" y "$" seleccionados. |
| 8 | Hacer click en el campo del monto (el número grande que dice "0"). | El cursor queda en el campo del monto. |
| 9 | Escribir `120000`. | El campo muestra 120000 y se habilita el botón "Siguiente". |
| 10 | Hacer click en el botón "Siguiente". | Se ve el paso 2 de 3, "¿En qué?", con la grilla de categorías. |
| 11 | Hacer click en la categoría "Otros". | La app pasa sola al paso 3 de 3, "Revisá y guardá". |
| 12 | En la sección "Cuenta", hacer click en "Tarjeta de crédito". | "Tarjeta de crédito" queda marcada. |
| 13 | En la sección "Cuotas", hacer click en el botón "12". | El botón "12" queda marcado. |
| 14 | En la sección "Fecha", hacer click en "Otra". | "Otra" queda marcada y el campo de fecha se puede editar. |
| 15 | Hacer click en el campo de fecha. | El cursor queda en el campo de fecha. |
| 16 | Escribir `15/08/2026`. | El campo muestra 15/08/2026. |
| 17 | Leer el recuadro que aparece debajo de los botones de "Cuotas", sin hacer click en "Guardar gasto". | Dice "12 cuotas de $10.000,00 · de ago 2026 a jul 2027". |
| 18 | Hacer click en la barra de direcciones del navegador. | El texto de la barra queda seleccionado. |
| 19 | Escribir `<APP>/transactions?period=2026-08` y presionar Enter. | Se abre Movimientos de agosto 2026 y se ve "No hay movimientos en este mes.": la vista previa no guardó nada. |

**Post-condición:** ninguna transacción creada.

### CP-CUO-003 — Cambiar a una cuenta que no es de crédito oculta las cuotas y las vuelve a 1

| Campo | Contenido |
|---|---|
| Historia · criterio | US-14 · CA-2 |
| Invariante | I6 |
| Técnica · Tipo | Tabla de decisión · Negativo |
| Canal · Caso par | UI · CP-CUO-014 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-cuo-003-001@example.com` con contraseña `Clave123!`, creado con PR-01 (configuración inicial salteada). Trae la cuenta "Tarjeta de crédito" del catálogo inicial.
**Datos de prueba:** D 1: monto `60000`. D 2: cuotas `6`. D 3: cuenta de crédito "Tarjeta de crédito" → cuenta "Efectivo" (efectivo).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 2 | Hacer click en el campo "Email". | El cursor queda dentro del campo "Email". |
| 3 | Escribir `qa+cp-cuo-003-001@example.com`. | El campo muestra `qa+cp-cuo-003-001@example.com`. |
| 4 | Hacer click en el campo "Contraseña". | El cursor queda dentro del campo "Contraseña". |
| 5 | Escribir `Clave123!`. | El campo muestra 9 puntos: la contraseña queda oculta. |
| 6 | Hacer click en el botón "Entrar". | Se abre la app en la pantalla Registrar. |
| 7 | Hacer click en la pestaña "Registrar" de la barra de abajo (en computadora, en el menú de la izquierda). | Se ve el paso 1 de 3, "¿Cuánto?", con "Gasto" y "$" seleccionados. |
| 8 | Hacer click en el campo del monto (el número grande que dice "0"). | El cursor queda en el campo del monto. |
| 9 | Escribir `60000`. | El campo muestra 60000 y se habilita el botón "Siguiente". |
| 10 | Hacer click en el botón "Siguiente". | Se ve el paso 2 de 3, "¿En qué?", con la grilla de categorías. |
| 11 | Hacer click en la categoría "Otros". | La app pasa sola al paso 3 de 3, "Revisá y guardá". |
| 12 | En la sección "Cuenta", hacer click en "Tarjeta de crédito". | "Tarjeta de crédito" queda marcada. |
| 13 | En la sección "Cuotas", hacer click en el botón "6". | El botón "6" queda marcado y debajo aparece la vista previa "6 cuotas de $10.000,00 · …". |
| 14 | En la sección "Cuenta", hacer click en "Efectivo". | Aparece el aviso "Las cuotas volvieron a 1" y desaparece la sección "Cuotas". |
| 15 | En la sección "Cuenta", hacer click en "Tarjeta de crédito". | Vuelve a aparecer la sección "Cuotas", con el botón "1" marcado (no el "6"). |

**Post-condición:** nada guardado.

### CP-CUO-004 — 12 cuotas de una compra divisible dan 12 cuotas iguales

| Campo | Contenido |
|---|---|
| Historia · criterio | US-15 · CA-2 |
| Invariante | I1, I1' |
| Técnica · Tipo | Valores límite · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-cuo-004-001@example.com` con contraseña `Clave123!`, creado con PR-01 (configuración inicial salteada). Trae la cuenta "Tarjeta de crédito" del catálogo inicial. S 2: compra cargada con PR-07, con D 1, D 2 y D 3 y la cuenta "Tarjeta de crédito".
**Datos de prueba:** D 1: monto `120000`. D 2: cuotas `12`. D 3: fecha `15/08/2026`. D 4: cada cuota esperada: $10.000,00; suma de las 12: $120.000,00.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 2 | Hacer click en el campo "Email". | El cursor queda dentro del campo "Email". |
| 3 | Escribir `qa+cp-cuo-004-001@example.com`. | El campo muestra `qa+cp-cuo-004-001@example.com`. |
| 4 | Hacer click en el campo "Contraseña". | El cursor queda dentro del campo "Contraseña". |
| 5 | Escribir `Clave123!`. | El campo muestra 9 puntos: la contraseña queda oculta. |
| 6 | Hacer click en el botón "Entrar". | Se abre la app en la pantalla Registrar. |
| 7 | Hacer click en la barra de direcciones del navegador. | El texto de la barra queda seleccionado. |
| 8 | Escribir `<APP>/transactions?period=2026-08` y presionar Enter. | Se abre Movimientos de agosto 2026. |
| 9 | Leer la fila de la compra. | Hay una sola fila, con la etiqueta "1/12" y el monto $10.000,00. |
| 10 | Hacer click en la flecha "Mes siguiente", junto al título. | El título cambia a septiembre 2026 y hay una sola fila, con la etiqueta "2/12" y el monto $10.000,00. |
| 11 | Hacer click en la flecha "Mes siguiente", junto al título. | El título cambia a octubre 2026 y hay una sola fila, con la etiqueta "3/12" y el monto $10.000,00. |
| 12 | Hacer click en la flecha "Mes siguiente", junto al título. | El título cambia a noviembre 2026 y hay una sola fila, con la etiqueta "4/12" y el monto $10.000,00. |
| 13 | Hacer click en la flecha "Mes siguiente", junto al título. | El título cambia a diciembre 2026 y hay una sola fila, con la etiqueta "5/12" y el monto $10.000,00. |
| 14 | Hacer click en la flecha "Mes siguiente", junto al título. | El título cambia a enero 2027 y hay una sola fila, con la etiqueta "6/12" y el monto $10.000,00. |
| 15 | Hacer click en la flecha "Mes siguiente", junto al título. | El título cambia a febrero 2027 y hay una sola fila, con la etiqueta "7/12" y el monto $10.000,00. |
| 16 | Hacer click en la flecha "Mes siguiente", junto al título. | El título cambia a marzo 2027 y hay una sola fila, con la etiqueta "8/12" y el monto $10.000,00. |
| 17 | Hacer click en la flecha "Mes siguiente", junto al título. | El título cambia a abril 2027 y hay una sola fila, con la etiqueta "9/12" y el monto $10.000,00. |
| 18 | Hacer click en la flecha "Mes siguiente", junto al título. | El título cambia a mayo 2027 y hay una sola fila, con la etiqueta "10/12" y el monto $10.000,00. |
| 19 | Hacer click en la flecha "Mes siguiente", junto al título. | El título cambia a junio 2027 y hay una sola fila, con la etiqueta "11/12" y el monto $10.000,00. |
| 20 | Hacer click en la flecha "Mes siguiente", junto al título. | El título cambia a julio 2027 y hay una sola fila, con la etiqueta "12/12" y el monto $10.000,00. |
| 21 | Hacer click en la flecha "Mes siguiente", junto al título. | El título cambia a agosto 2027 y se ve "No hay movimientos en este mes.": la compra no tiene cuota en ese mes. |

**Post-condición:** una compra y 12 imputaciones. Suma leída: 12 × $10.000,00 = $120.000,00 (I1).

### CP-CUO-005 — La vista previa informa que la última cuota absorbe el resto

| Campo | Contenido |
|---|---|
| Historia · criterio | US-13 · "Pantallas y campos" ("La última es de $…") |
| Invariante | — |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-cuo-005-001@example.com` con contraseña `Clave123!`, creado con PR-01 (configuración inicial salteada). Trae la cuenta "Tarjeta de crédito" del catálogo inicial.
**Datos de prueba:** D 1: monto `100000`. D 2: cuotas `3`. D 3: fecha `15/08/2026`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 2 | Hacer click en el campo "Email". | El cursor queda dentro del campo "Email". |
| 3 | Escribir `qa+cp-cuo-005-001@example.com`. | El campo muestra `qa+cp-cuo-005-001@example.com`. |
| 4 | Hacer click en el campo "Contraseña". | El cursor queda dentro del campo "Contraseña". |
| 5 | Escribir `Clave123!`. | El campo muestra 9 puntos: la contraseña queda oculta. |
| 6 | Hacer click en el botón "Entrar". | Se abre la app en la pantalla Registrar. |
| 7 | Hacer click en la pestaña "Registrar" de la barra de abajo (en computadora, en el menú de la izquierda). | Se ve el paso 1 de 3, "¿Cuánto?", con "Gasto" y "$" seleccionados. |
| 8 | Hacer click en el campo del monto (el número grande que dice "0"). | El cursor queda en el campo del monto. |
| 9 | Escribir `100000`. | El campo muestra 100000 y se habilita el botón "Siguiente". |
| 10 | Hacer click en el botón "Siguiente". | Se ve el paso 2 de 3, "¿En qué?", con la grilla de categorías. |
| 11 | Hacer click en la categoría "Otros". | La app pasa sola al paso 3 de 3, "Revisá y guardá". |
| 12 | En la sección "Cuenta", hacer click en "Tarjeta de crédito". | "Tarjeta de crédito" queda marcada. |
| 13 | En la sección "Cuotas", hacer click en el botón "3". | El botón "3" queda marcado. |
| 14 | En la sección "Fecha", hacer click en "Otra". | "Otra" queda marcada y el campo de fecha se puede editar. |
| 15 | Hacer click en el campo de fecha. | El cursor queda en el campo de fecha. |
| 16 | Escribir `15/08/2026`. | El campo muestra 15/08/2026. |
| 17 | Leer el recuadro debajo de los botones de "Cuotas". | Dice "3 cuotas de $33.333,33 · de ago 2026 a oct 2026". |
| 18 | Leer la línea que está debajo de ese recuadro. | Dice "La última es de $33.333,34". |

**Post-condición:** nada guardado.

### CP-CUO-006 — 1 cuota genera una sola imputación

| Campo | Contenido |
|---|---|
| Historia · criterio | US-12 · CA-1 y CA-2 |
| Invariante | I2 |
| Técnica · Tipo | Valores límite (mínimo) · Límite |
| Canal · Caso par | UI · CP-CUO-017 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-cuo-006-001@example.com` con contraseña `Clave123!`, creado con PR-01 (configuración inicial salteada). Trae la cuenta "Tarjeta de crédito" del catálogo inicial.
**Datos de prueba:** D 1: monto `1200`. D 2: cuotas `1`. D 3: fecha `15/08/2026`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 2 | Hacer click en el campo "Email". | El cursor queda dentro del campo "Email". |
| 3 | Escribir `qa+cp-cuo-006-001@example.com`. | El campo muestra `qa+cp-cuo-006-001@example.com`. |
| 4 | Hacer click en el campo "Contraseña". | El cursor queda dentro del campo "Contraseña". |
| 5 | Escribir `Clave123!`. | El campo muestra 9 puntos: la contraseña queda oculta. |
| 6 | Hacer click en el botón "Entrar". | Se abre la app en la pantalla Registrar. |
| 7 | Hacer click en la pestaña "Registrar" de la barra de abajo (en computadora, en el menú de la izquierda). | Se ve el paso 1 de 3, "¿Cuánto?", con "Gasto" y "$" seleccionados. |
| 8 | Hacer click en el campo del monto (el número grande que dice "0"). | El cursor queda en el campo del monto. |
| 9 | Escribir `1200`. | El campo muestra 1200 y se habilita el botón "Siguiente". |
| 10 | Hacer click en el botón "Siguiente". | Se ve el paso 2 de 3, "¿En qué?", con la grilla de categorías. |
| 11 | Hacer click en la categoría "Otros". | La app pasa sola al paso 3 de 3, "Revisá y guardá". |
| 12 | En la sección "Cuenta", hacer click en "Tarjeta de crédito". | "Tarjeta de crédito" queda marcada. |
| 13 | En la sección "Cuotas", hacer click en el botón "1". | El botón "1" queda marcado. |
| 14 | En la sección "Fecha", hacer click en "Otra". | "Otra" queda marcada y el campo de fecha se puede editar. |
| 15 | Hacer click en el campo de fecha. | El cursor queda en el campo de fecha. |
| 16 | Escribir `15/08/2026`. | El campo muestra 15/08/2026. |
| 17 | Hacer click en el botón "Guardar gasto". | Aparece el aviso "Gasto guardado" y el botón pasa a decir "Guardado". |
| 18 | Hacer click en la barra de direcciones del navegador. | El texto de la barra queda seleccionado. |
| 19 | Escribir `<APP>/transactions?period=2026-08` y presionar Enter. | Se abre Movimientos de agosto 2026. |
| 20 | Leer la fila de la compra. | Hay una sola fila, con el monto $1.200,00. |
| 21 | Hacer click en la flecha "Mes siguiente", junto al título. | El título cambia a septiembre 2026 y se ve "No hay movimientos en este mes.". |

**Post-condición:** una compra y una imputación.

### CP-CUO-007 — El Resumen separa las cuotas de meses anteriores

| Campo | Contenido |
|---|---|
| Historia · criterio | US-16 · CA-1 |
| Invariante | — |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-cuo-007-001@example.com` con contraseña `Clave123!`, creado con PR-01 (configuración inicial salteada). Trae la cuenta "Tarjeta de crédito" del catálogo inicial. S 2: compra cargada con PR-07, con D 1, D 2 y D 3 y la cuenta "Tarjeta de crédito". Ningún otro gasto.
**Datos de prueba:** D 1: monto `120000`. D 2: cuotas `12`. D 3: fecha `15/08/2026`. D 4: período `2026-09`; cuota de septiembre = $10.000,00.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 2 | Hacer click en el campo "Email". | El cursor queda dentro del campo "Email". |
| 3 | Escribir `qa+cp-cuo-007-001@example.com`. | El campo muestra `qa+cp-cuo-007-001@example.com`. |
| 4 | Hacer click en el campo "Contraseña". | El cursor queda dentro del campo "Contraseña". |
| 5 | Escribir `Clave123!`. | El campo muestra 9 puntos: la contraseña queda oculta. |
| 6 | Hacer click en el botón "Entrar". | Se abre la app en la pantalla Registrar. |
| 7 | Hacer click en la barra de direcciones del navegador. | El texto de la barra queda seleccionado. |
| 8 | Escribir `<APP>/dashboard?period=2026-09` y presionar Enter. | Se abre el Resumen de septiembre 2026. |
| 9 | En la tarjeta verde de arriba, leer el monto de "Cuotas de meses anteriores". | Dice $10.000,00. |

**Post-condición:** una compra y 12 imputaciones.

### CP-CUO-008 — El listado muestra el número de cuota ("3/12")

| Campo | Contenido |
|---|---|
| Historia · criterio | US-17 · CA-1 |
| Invariante | — |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Baja · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-cuo-008-001@example.com` con contraseña `Clave123!`, creado con PR-01 (configuración inicial salteada). Trae la cuenta "Tarjeta de crédito" del catálogo inicial. S 2: compra cargada con PR-07, con D 1, D 2 y D 3 y la cuenta "Tarjeta de crédito".
**Datos de prueba:** D 1: monto `120000`. D 2: cuotas `12`. D 3: fecha `15/08/2026`. D 4: en octubre 2026 cae la cuota 3 (agosto = 1, septiembre = 2).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 2 | Hacer click en el campo "Email". | El cursor queda dentro del campo "Email". |
| 3 | Escribir `qa+cp-cuo-008-001@example.com`. | El campo muestra `qa+cp-cuo-008-001@example.com`. |
| 4 | Hacer click en el campo "Contraseña". | El cursor queda dentro del campo "Contraseña". |
| 5 | Escribir `Clave123!`. | El campo muestra 9 puntos: la contraseña queda oculta. |
| 6 | Hacer click en el botón "Entrar". | Se abre la app en la pantalla Registrar. |
| 7 | Hacer click en la barra de direcciones del navegador. | El texto de la barra queda seleccionado. |
| 8 | Escribir `<APP>/transactions?period=2026-10` y presionar Enter. | Se abre Movimientos de octubre 2026. |
| 9 | Leer la etiqueta que está junto al título de la fila de la compra. | Dice "3/12". |

**Post-condición:** una compra y 12 imputaciones.

### CP-CUO-009 — Borrar desde la 1.ª cuota elimina la compra entera de los meses siguientes

| Campo | Contenido |
|---|---|
| Historia · criterio | US-18 · CA-1 · FR-08 |
| Invariante | I10 |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-cuo-009-001@example.com` con contraseña `Clave123!`, creado con PR-01 (configuración inicial salteada). Trae la cuenta "Tarjeta de crédito" del catálogo inicial. S 2: compra cargada con PR-07, con D 1, D 2 y D 3 y la cuenta "Tarjeta de crédito".
**Datos de prueba:** D 1: monto `120000`. D 2: cuotas `12`. D 3: fecha `15/08/2026`. D 4: se borra desde agosto 2026 (cuota 1/12). D 5: se verifican octubre 2026 y julio 2027.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 2 | Hacer click en el campo "Email". | El cursor queda dentro del campo "Email". |
| 3 | Escribir `qa+cp-cuo-009-001@example.com`. | El campo muestra `qa+cp-cuo-009-001@example.com`. |
| 4 | Hacer click en el campo "Contraseña". | El cursor queda dentro del campo "Contraseña". |
| 5 | Escribir `Clave123!`. | El campo muestra 9 puntos: la contraseña queda oculta. |
| 6 | Hacer click en el botón "Entrar". | Se abre la app en la pantalla Registrar. |
| 7 | Hacer click en la barra de direcciones del navegador. | El texto de la barra queda seleccionado. |
| 8 | Escribir `<APP>/transactions?period=2026-08` y presionar Enter. | Se abre Movimientos de agosto 2026 y se ve la fila de la compra con "1/12". |
| 9 | Hacer click en el ícono del tacho de basura de esa fila. | Se abre el diálogo "¿Eliminar transacción?" con los botones "Cancelar" y "Eliminar". Este caso no evalúa qué meses lista el diálogo (eso lo hace CP-REG-013). |
| 10 | Hacer click en el botón "Eliminar". | Aparece el aviso "Transacción eliminada". |
| 11 | Hacer click en la barra de direcciones del navegador. | El texto de la barra queda seleccionado. |
| 12 | Escribir `<APP>/dashboard?period=2026-10` y presionar Enter. | Se abre el Resumen de octubre 2026 y se ve "No tenés movimientos registrados en octubre." con el botón "Registrar un gasto". |
| 13 | Hacer click en la barra de direcciones del navegador. | El texto de la barra queda seleccionado. |
| 14 | Escribir `<APP>/dashboard?period=2027-07` y presionar Enter. | Se abre el Resumen de julio 2027 y se ve "No tenés movimientos registrados en julio." con el botón "Registrar un gasto". |

**Post-condición:** la compra queda eliminada (borrado lógico).

### CP-CUO-010 — En USD, la suma en pesos de las cuotas es exacta

| Campo | Contenido |
|---|---|
| Historia · criterio | US-15 · CA-2 |
| Invariante | I1' |
| Técnica · Tipo | Adivinación de errores · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-cuo-010-001@example.com` con contraseña `Clave123!`, creado con PR-01 (configuración inicial salteada). Trae la cuenta "Tarjeta de crédito" del catálogo inicial.
**Datos de prueba:** D 1: monto `100` (USD). D 2: tipo de cambio `1250,5555`, escrito a mano (no hay referencia del mes). D 3: cuotas `3`. D 4: fecha `15/08/2026`. D 5: total en pesos = 100 × 1250,5555 = $125.055,55 (half-up, ADR-013); cuotas en pesos $41.685,18 · $41.685,18 · $41.685,19.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 2 | Hacer click en el campo "Email". | El cursor queda dentro del campo "Email". |
| 3 | Escribir `qa+cp-cuo-010-001@example.com`. | El campo muestra `qa+cp-cuo-010-001@example.com`. |
| 4 | Hacer click en el campo "Contraseña". | El cursor queda dentro del campo "Contraseña". |
| 5 | Escribir `Clave123!`. | El campo muestra 9 puntos: la contraseña queda oculta. |
| 6 | Hacer click en el botón "Entrar". | Se abre la app en la pantalla Registrar. |
| 7 | Hacer click en la pestaña "Registrar" de la barra de abajo (en computadora, en el menú de la izquierda). | Se ve el paso 1 de 3, "¿Cuánto?", con "Gasto" y "$" seleccionados. |
| 8 | Hacer click en "US$", a la derecha del monto. | "US$" queda seleccionado y aparece el campo "Tipo de cambio (ARS por US$)", vacío. |
| 9 | Hacer click en el campo del monto (el número grande que dice "0"). | El cursor queda en el campo del monto. |
| 10 | Escribir `100`. | El campo muestra 100. El botón "Siguiente" sigue deshabilitado porque falta el tipo de cambio (US-20 · CA-2). |
| 11 | Hacer click en el campo "Tipo de cambio (ARS por US$)". | El cursor queda en ese campo. |
| 12 | Escribir `1250,5555`. | El campo muestra 1250,5555 y se habilita el botón "Siguiente". |
| 13 | Hacer click en el botón "Siguiente". | Se ve el paso 2 de 3, "¿En qué?", con la grilla de categorías. |
| 14 | Hacer click en la categoría "Otros". | La app pasa sola al paso 3 de 3, "Revisá y guardá". |
| 15 | En la sección "Cuenta", hacer click en "Tarjeta de crédito". | "Tarjeta de crédito" queda marcada. |
| 16 | En la sección "Cuotas", hacer click en el botón "3". | El botón "3" queda marcado. |
| 17 | En la sección "Fecha", hacer click en "Otra". | "Otra" queda marcada y el campo de fecha se puede editar. |
| 18 | Hacer click en el campo de fecha. | El cursor queda en el campo de fecha. |
| 19 | Escribir `15/08/2026`. | El campo muestra 15/08/2026. |
| 20 | Hacer click en el botón "Guardar gasto". | Aparece el aviso "Gasto guardado" y el botón pasa a decir "Guardado". |
| 21 | Hacer click en la barra de direcciones del navegador. | El texto de la barra queda seleccionado. |
| 22 | Escribir `<APP>/transactions?period=2026-08` y presionar Enter. | Se abre Movimientos de agosto 2026. |
| 23 | Leer la fila de la compra. | Hay una sola fila, con la etiqueta "1/3" y el monto $41.685,18. |
| 24 | Hacer click en la flecha "Mes siguiente", junto al título. | El título cambia a septiembre 2026 y hay una sola fila, con la etiqueta "2/3" y el monto $41.685,18. |
| 25 | Hacer click en la flecha "Mes siguiente", junto al título. | El título cambia a octubre 2026 y hay una sola fila, con la etiqueta "3/3" y el monto $41.685,19. |
| 26 | Hacer click en la flecha "Mes siguiente", junto al título. | El título cambia a noviembre 2026 y se ve "No hay movimientos en este mes.": la compra no tiene cuota en ese mes. |

**Post-condición:** una compra en USD y 3 imputaciones. Suma leída: $41.685,18 + $41.685,18 + $41.685,19 = $125.055,55 (I1').

### CP-CUO-011 — Otro usuario no ve las cuotas de una compra ajena

| Campo | Contenido |
|---|---|
| Historia · criterio | US-48 · CA-2 (otro usuario ve 0 filas) · C7 |
| Invariante | — |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: PR-05 con los emails `qa+cp-cuo-011-A@example.com` y `qa+cp-cuo-011-B@example.com`. S 2: PR-07 hecho por A con D 1, D 2 y D 3 y la cuenta "Tarjeta de crédito". S 3: `<TOKEN-A>` y `<TOKEN-B>` (PR-05 paso 3).
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

**Pre-requisitos:** S 1: usuario `qa+cp-cuo-012-001@example.com` con contraseña `Clave123!`, creado con PR-01 (configuración inicial salteada). Trae la cuenta "Tarjeta de crédito" del catálogo inicial.
**Datos de prueba:** D 1: tipo "Ingreso". D 2: monto `50000`. D 3: cuenta "Tarjeta de crédito".

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 2 | Hacer click en el campo "Email". | El cursor queda dentro del campo "Email". |
| 3 | Escribir `qa+cp-cuo-012-001@example.com`. | El campo muestra `qa+cp-cuo-012-001@example.com`. |
| 4 | Hacer click en el campo "Contraseña". | El cursor queda dentro del campo "Contraseña". |
| 5 | Escribir `Clave123!`. | El campo muestra 9 puntos: la contraseña queda oculta. |
| 6 | Hacer click en el botón "Entrar". | Se abre la app en la pantalla Registrar. |
| 7 | Hacer click en la pestaña "Registrar" de la barra de abajo (en computadora, en el menú de la izquierda). | Se ve el paso 1 de 3, "¿Cuánto?", con "Gasto" y "$" seleccionados. |
| 8 | Hacer click en "Ingreso". | "Ingreso" queda seleccionado. |
| 9 | Hacer click en el campo del monto (el número grande que dice "0"). | El cursor queda en el campo del monto. |
| 10 | Escribir `50000`. | El campo muestra 50000 y se habilita el botón "Siguiente". |
| 11 | Hacer click en el botón "Siguiente". | Pasa al paso de detalles sin pedir categoría (un ingreso no la lleva). |
| 12 | En la sección "Cuenta", hacer click en "Tarjeta de crédito". | "Tarjeta de crédito" queda marcada. |
| 13 | Buscar la sección "Cuotas" en la pantalla, bajando hasta el botón "Guardar ingreso". | No hay sección "Cuotas": no aparece ningún botón de cuotas. |

**Post-condición:** nada guardado.

### CP-CUO-013 — Un fallo a mitad de create_transaction no deja datos parciales

| Campo | Contenido |
|---|---|
| Historia · criterio | US-12 · CA-3 · C4 |
| Invariante | I4 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: PR-01 con `qa+cp-cuo-013-001@example.com`. S 2: PR-04 pasos 1 y 2 (`<TOKEN>` y uuid de la categoría "Otros" y de la cuenta "Tarjeta de crédito"; no escriben nada).
**Datos de prueba:** D 1: monto `"0.02"`. D 2: cuotas `3` (la cuota base da 0,00 y la función falla *después* de insertar la transacción). D 3: fecha `2026-08-15`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Hacer las dos consultas de PR-08 (imputaciones y transacciones). | Las dos devuelven `[]`: el usuario no tiene filas. |
| 2 | POST `<SUPABASE_URL>/rest/v1/rpc/create_transaction` con los headers de PR-04 y el body: `{"p_type":"expense","p_amount":"0.02","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Otros>","p_account_id":"<uuid Tarjeta de crédito>","p_installments_count":3,"p_occurred_on":"2026-08-15","p_description":null}`. | HTTP 400, `code` `23514` y `message` "I4: cada cuota debe ser al menos 0,01". |
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

**Pre-requisitos:** S 1: usuario `qa+cp-cuo-015-001@example.com` con contraseña `Clave123!`, creado con PR-01 (configuración inicial salteada). Trae la cuenta "Tarjeta de crédito" del catálogo inicial.
**Datos de prueba:** D 1: monto `100000`. D 2: cuotas `3`. D 3: fecha `15/08/2026`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 2 | Hacer click en el campo "Email". | El cursor queda dentro del campo "Email". |
| 3 | Escribir `qa+cp-cuo-015-001@example.com`. | El campo muestra `qa+cp-cuo-015-001@example.com`. |
| 4 | Hacer click en el campo "Contraseña". | El cursor queda dentro del campo "Contraseña". |
| 5 | Escribir `Clave123!`. | El campo muestra 9 puntos: la contraseña queda oculta. |
| 6 | Hacer click en el botón "Entrar". | Se abre la app en la pantalla Registrar. |
| 7 | Hacer click en la pestaña "Registrar" de la barra de abajo (en computadora, en el menú de la izquierda). | Se ve el paso 1 de 3, "¿Cuánto?", con "Gasto" y "$" seleccionados. |
| 8 | Hacer click en el campo del monto (el número grande que dice "0"). | El cursor queda en el campo del monto. |
| 9 | Escribir `100000`. | El campo muestra 100000 y se habilita el botón "Siguiente". |
| 10 | Hacer click en el botón "Siguiente". | Se ve el paso 2 de 3, "¿En qué?", con la grilla de categorías. |
| 11 | Hacer click en la categoría "Otros". | La app pasa sola al paso 3 de 3, "Revisá y guardá". |
| 12 | En la sección "Cuenta", hacer click en "Tarjeta de crédito". | "Tarjeta de crédito" queda marcada. |
| 13 | En la sección "Cuotas", hacer click en el botón "3". | El botón "3" queda marcado. |
| 14 | En la sección "Fecha", hacer click en "Otra". | "Otra" queda marcada y el campo de fecha se puede editar. |
| 15 | Hacer click en el campo de fecha. | El cursor queda en el campo de fecha. |
| 16 | Escribir `15/08/2026`. | El campo muestra 15/08/2026. |
| 17 | Hacer click en el botón "Guardar gasto". | Aparece el aviso "Gasto guardado" y el botón pasa a decir "Guardado". |
| 18 | Hacer click en la barra de direcciones del navegador. | El texto de la barra queda seleccionado. |
| 19 | Escribir `<APP>/transactions?period=2026-08` y presionar Enter. | Se abre Movimientos de agosto 2026. |
| 20 | Leer la fila de la compra. | Hay una sola fila, con la etiqueta "1/3" y el monto $33.333,33. |
| 21 | Hacer click en la flecha "Mes siguiente", junto al título. | El título cambia a septiembre 2026 y hay una sola fila, con la etiqueta "2/3" y el monto $33.333,33. |
| 22 | Hacer click en la flecha "Mes siguiente", junto al título. | El título cambia a octubre 2026 y hay una sola fila, con la etiqueta "3/3" y el monto $33.333,34. |
| 23 | Hacer click en la flecha "Mes siguiente", junto al título. | El título cambia a noviembre 2026 y se ve "No hay movimientos en este mes.": la compra no tiene cuota en ese mes. |

**Post-condición:** una compra y 3 imputaciones. Suma leída: $100.000,00.

### CP-CUO-016 — 2 cuotas generan dos imputaciones consecutivas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-12 · CA-1 |
| Invariante | I2 |
| Técnica · Tipo | Valores límite (mínimo + 1) · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-cuo-016-001@example.com` con contraseña `Clave123!`, creado con PR-01 (configuración inicial salteada). Trae la cuenta "Tarjeta de crédito" del catálogo inicial.
**Datos de prueba:** D 1: monto `1200`. D 2: cuotas `2`. D 3: fecha `15/08/2026`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 2 | Hacer click en el campo "Email". | El cursor queda dentro del campo "Email". |
| 3 | Escribir `qa+cp-cuo-016-001@example.com`. | El campo muestra `qa+cp-cuo-016-001@example.com`. |
| 4 | Hacer click en el campo "Contraseña". | El cursor queda dentro del campo "Contraseña". |
| 5 | Escribir `Clave123!`. | El campo muestra 9 puntos: la contraseña queda oculta. |
| 6 | Hacer click en el botón "Entrar". | Se abre la app en la pantalla Registrar. |
| 7 | Hacer click en la pestaña "Registrar" de la barra de abajo (en computadora, en el menú de la izquierda). | Se ve el paso 1 de 3, "¿Cuánto?", con "Gasto" y "$" seleccionados. |
| 8 | Hacer click en el campo del monto (el número grande que dice "0"). | El cursor queda en el campo del monto. |
| 9 | Escribir `1200`. | El campo muestra 1200 y se habilita el botón "Siguiente". |
| 10 | Hacer click en el botón "Siguiente". | Se ve el paso 2 de 3, "¿En qué?", con la grilla de categorías. |
| 11 | Hacer click en la categoría "Otros". | La app pasa sola al paso 3 de 3, "Revisá y guardá". |
| 12 | En la sección "Cuenta", hacer click en "Tarjeta de crédito". | "Tarjeta de crédito" queda marcada. |
| 13 | En la sección "Cuotas", hacer click en el botón "2". | El botón "2" queda marcado. |
| 14 | En la sección "Fecha", hacer click en "Otra". | "Otra" queda marcada y el campo de fecha se puede editar. |
| 15 | Hacer click en el campo de fecha. | El cursor queda en el campo de fecha. |
| 16 | Escribir `15/08/2026`. | El campo muestra 15/08/2026. |
| 17 | Hacer click en el botón "Guardar gasto". | Aparece el aviso "Gasto guardado" y el botón pasa a decir "Guardado". |
| 18 | Hacer click en la barra de direcciones del navegador. | El texto de la barra queda seleccionado. |
| 19 | Escribir `<APP>/transactions?period=2026-08` y presionar Enter. | Se abre Movimientos de agosto 2026. |
| 20 | Leer la fila de la compra. | Hay una sola fila, con la etiqueta "1/2" y el monto $600,00. |
| 21 | Hacer click en la flecha "Mes siguiente", junto al título. | El título cambia a septiembre 2026 y hay una sola fila, con la etiqueta "2/2" y el monto $600,00. |
| 22 | Hacer click en la flecha "Mes siguiente", junto al título. | El título cambia a octubre 2026 y se ve "No hay movimientos en este mes.": la compra no tiene cuota en ese mes. |

**Post-condición:** una compra y 2 imputaciones.

### CP-CUO-017 — La RPC rechaza 0 cuotas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-12 · CA-1 · FR-09 |
| Invariante | — |
| Técnica · Tipo | Valores límite (mínimo − 1) · Límite |
| Canal · Caso par | API · CP-CUO-019 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: PR-01 con `qa+cp-cuo-017-001@example.com`. S 2: PR-04 pasos 1 y 2 (`<TOKEN>`, uuid de "Otros" y de "Tarjeta de crédito").
**Datos de prueba:** D 1: monto `"1200.00"`. D 2: cuotas `0`. D 3: fecha `2026-08-15`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | POST `<SUPABASE_URL>/rest/v1/rpc/create_transaction` con los headers de PR-04 y el body: `{"p_type":"expense","p_amount":"1200.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Otros>","p_account_id":"<uuid Tarjeta de crédito>","p_installments_count":0,"p_occurred_on":"2026-08-15","p_description":null}`. | HTTP 400, `code` `23514` y `message` "las cuotas van de 1 a 12". |
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

**Pre-requisitos:** S 1: PR-01 con `qa+cp-cuo-018-001@example.com`. S 2: PR-04 pasos 1 y 2.
**Datos de prueba:** D 1: monto `"1200.00"`. D 2: cuotas `13`. D 3: fecha `2026-08-15`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | POST `<SUPABASE_URL>/rest/v1/rpc/create_transaction` con los headers de PR-04 y el body: `{"p_type":"expense","p_amount":"1200.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Otros>","p_account_id":"<uuid Tarjeta de crédito>","p_installments_count":13,"p_occurred_on":"2026-08-15","p_description":null}`. | HTTP 400, `code` `23514` y `message` "las cuotas van de 1 a 12". |
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

**Pre-requisitos:** S 1: usuario `qa+cp-cuo-019-001@example.com` con contraseña `Clave123!`, creado con PR-01 (configuración inicial salteada). Trae la cuenta "Tarjeta de crédito" del catálogo inicial.
**Datos de prueba:** D 1: monto `1200`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 2 | Hacer click en el campo "Email". | El cursor queda dentro del campo "Email". |
| 3 | Escribir `qa+cp-cuo-019-001@example.com`. | El campo muestra `qa+cp-cuo-019-001@example.com`. |
| 4 | Hacer click en el campo "Contraseña". | El cursor queda dentro del campo "Contraseña". |
| 5 | Escribir `Clave123!`. | El campo muestra 9 puntos: la contraseña queda oculta. |
| 6 | Hacer click en el botón "Entrar". | Se abre la app en la pantalla Registrar. |
| 7 | Hacer click en la pestaña "Registrar" de la barra de abajo (en computadora, en el menú de la izquierda). | Se ve el paso 1 de 3, "¿Cuánto?", con "Gasto" y "$" seleccionados. |
| 8 | Hacer click en el campo del monto (el número grande que dice "0"). | El cursor queda en el campo del monto. |
| 9 | Escribir `1200`. | El campo muestra 1200 y se habilita el botón "Siguiente". |
| 10 | Hacer click en el botón "Siguiente". | Se ve el paso 2 de 3, "¿En qué?", con la grilla de categorías. |
| 11 | Hacer click en la categoría "Otros". | La app pasa sola al paso 3 de 3, "Revisá y guardá". |
| 12 | En la sección "Cuenta", hacer click en "Tarjeta de crédito". | "Tarjeta de crédito" queda marcada. |
| 13 | Contar los botones de la sección "Cuotas". | Hay 12 botones. |
| 14 | Leer las etiquetas de los botones, de izquierda a derecha y de arriba abajo. | Dicen 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 y 12. No hay botón "0" ni "13". |

**Post-condición:** nada guardado.

### CP-CUO-020 — Borrar desde una cuota intermedia elimina también las cuotas pasadas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-18 · CA-1 · FR-08 |
| Invariante | I10 |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-cuo-020-001@example.com` con contraseña `Clave123!`, creado con PR-01 (configuración inicial salteada). Trae la cuenta "Tarjeta de crédito" del catálogo inicial. S 2: compra cargada con PR-07, con D 1, D 2 y D 3 y la cuenta "Tarjeta de crédito".
**Datos de prueba:** D 1: monto `120000`. D 2: cuotas `12`. D 3: fecha `15/08/2026`. D 4: se borra desde octubre 2026 (cuota 3/12). D 5: se verifican agosto y septiembre 2026.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 2 | Hacer click en el campo "Email". | El cursor queda dentro del campo "Email". |
| 3 | Escribir `qa+cp-cuo-020-001@example.com`. | El campo muestra `qa+cp-cuo-020-001@example.com`. |
| 4 | Hacer click en el campo "Contraseña". | El cursor queda dentro del campo "Contraseña". |
| 5 | Escribir `Clave123!`. | El campo muestra 9 puntos: la contraseña queda oculta. |
| 6 | Hacer click en el botón "Entrar". | Se abre la app en la pantalla Registrar. |
| 7 | Hacer click en la barra de direcciones del navegador. | El texto de la barra queda seleccionado. |
| 8 | Escribir `<APP>/transactions?period=2026-10` y presionar Enter. | Se abre Movimientos de octubre 2026 y se ve la fila de la compra con "3/12". |
| 9 | Hacer click en el ícono del tacho de basura de esa fila. | Se abre el diálogo "¿Eliminar transacción?" con los botones "Cancelar" y "Eliminar". Este caso no evalúa qué meses lista el diálogo (eso lo hace CP-REG-013). |
| 10 | Hacer click en el botón "Eliminar". | Aparece el aviso "Transacción eliminada". |
| 11 | Hacer click en la barra de direcciones del navegador. | El texto de la barra queda seleccionado. |
| 12 | Escribir `<APP>/dashboard?period=2026-08` y presionar Enter. | Se abre el Resumen de agosto 2026 y se ve "No tenés movimientos registrados en agosto." con el botón "Registrar un gasto". |
| 13 | Hacer click en la barra de direcciones del navegador. | El texto de la barra queda seleccionado. |
| 14 | Escribir `<APP>/dashboard?period=2026-09` y presionar Enter. | Se abre el Resumen de septiembre 2026 y se ve "No tenés movimientos registrados en septiembre." con el botón "Registrar un gasto". |

**Post-condición:** la compra queda eliminada (borrado lógico).

### CP-CUO-021 — La RPC rechaza cuotas sobre un ingreso en cuenta de crédito

| Campo | Contenido |
|---|---|
| Historia · criterio | US-14 · CA-3 |
| Invariante | I6 |
| Técnica · Tipo | Tabla de decisión · Negativo |
| Canal · Caso par | API · CP-CUO-012 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: PR-01 con `qa+cp-cuo-021-001@example.com`. S 2: PR-04 pasos 1 y 2 (`<TOKEN>` y uuid de "Tarjeta de crédito").
**Datos de prueba:** D 1: tipo `income`. D 2: monto `"50000.00"`. D 3: cuotas `3`. D 4: categoría `null` (un ingreso no la lleva). D 5: fecha `2026-08-15`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | POST `<SUPABASE_URL>/rest/v1/rpc/create_transaction` con los headers de PR-04 y el body: `{"p_type":"income","p_amount":"50000.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":null,"p_account_id":"<uuid Tarjeta de crédito>","p_installments_count":3,"p_occurred_on":"2026-08-15","p_description":null}`. | HTTP 400, `code` `23514` y `message` "I6: las cuotas solo aplican a gastos con cuenta credit_card". |
| 2 | Hacer la consulta de transacciones de PR-08. | `[]`: no se creó nada. |

**Post-condición:** sin filas nuevas.

### CP-CUO-022 — Cambiar entre dos tarjetas de crédito conserva las cuotas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-14 · CA-2 (aclarado: entre tarjetas de crédito se conservan) |
| Invariante | I6 |
| Técnica · Tipo | Tabla de decisión · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-cuo-022-001@example.com` con contraseña `Clave123!`, creado con PR-01 (configuración inicial salteada). Trae la cuenta "Tarjeta de crédito" del catálogo inicial. S 2: cuenta "Visa BBVA" creada con PR-02 (segunda tarjeta de crédito).
**Datos de prueba:** D 1: monto `60000`. D 2: cuotas `6`. D 3: "Tarjeta de crédito" → "Visa BBVA" (las dos de crédito).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 2 | Hacer click en el campo "Email". | El cursor queda dentro del campo "Email". |
| 3 | Escribir `qa+cp-cuo-022-001@example.com`. | El campo muestra `qa+cp-cuo-022-001@example.com`. |
| 4 | Hacer click en el campo "Contraseña". | El cursor queda dentro del campo "Contraseña". |
| 5 | Escribir `Clave123!`. | El campo muestra 9 puntos: la contraseña queda oculta. |
| 6 | Hacer click en el botón "Entrar". | Se abre la app en la pantalla Registrar. |
| 7 | Hacer click en la pestaña "Registrar" de la barra de abajo (en computadora, en el menú de la izquierda). | Se ve el paso 1 de 3, "¿Cuánto?", con "Gasto" y "$" seleccionados. |
| 8 | Hacer click en el campo del monto (el número grande que dice "0"). | El cursor queda en el campo del monto. |
| 9 | Escribir `60000`. | El campo muestra 60000 y se habilita el botón "Siguiente". |
| 10 | Hacer click en el botón "Siguiente". | Se ve el paso 2 de 3, "¿En qué?", con la grilla de categorías. |
| 11 | Hacer click en la categoría "Otros". | La app pasa sola al paso 3 de 3, "Revisá y guardá". |
| 12 | En la sección "Cuenta", hacer click en "Tarjeta de crédito". | "Tarjeta de crédito" queda marcada. |
| 13 | En la sección "Cuotas", hacer click en el botón "6". | El botón "6" queda marcado. |
| 14 | En la sección "Cuenta", hacer click en "Visa BBVA". | "Visa BBVA" queda marcada, la sección "Cuotas" sigue visible con el "6" marcado y no aparece el aviso "Las cuotas volvieron a 1". |

**Post-condición:** nada guardado.

---

## 5. Revisión de `spec-critic` y decisiones abiertas

`spec-critic` revisó este piloto el 2026-10-06 y encontró 2 bloqueantes, 3 altos y 19 medios. Ya corregidos acá y en `docs/12`:

- PR-05 ya no carga gastos (hacía que CP-CUO-011 diera 13 filas y 1 fila en vez de 12 y `[]`) y PR-04 separa "obtener token", "obtener uuid" (solo lectura) y la plantilla de llamada, que ya no se cita como pre-requisito.
- CP-CUO-010: pasos con navegación, una acción por paso, y "Siguiente" deshabilitado hasta cargar el tipo de cambio (US-20 · CA-2).
- Los PR dejaron de ser un paso y pasaron a pre-requisitos; los datos de la compra pasaron a "Datos de prueba".
- Los controles positivos de CP-CUO-014 y 021, y los pasos de CP-CUO-007 y 016 que mezclaban veredictos, se sacaron.
- Sacados los oráculos que salían de la app y no del spec (vista previa con N=1, "$0,00" en el mes de la compra, valor por defecto "1").
- CP-CUO-018 con el body completo, citas de criterio corregidas, `Caso par` solo entre negativos UI ↔ API, y limpieza definida ("el usuario queda como dato de prueba").

**Decisiones de spec tomadas el 2026-10-06:**

1. **US-48 · CA-2:** sin sesión (`anon`) la base responde `permission denied` (42501), como piden C7 y CLAUDE.md. Se corrigió el texto del criterio.
2. **US-14 · CA-2:** las cuotas vuelven a 1 solo al pasar a una cuenta que no es de crédito (o a ingreso); entre dos tarjetas se conservan. Se corrigió el criterio y se agregó CP-CUO-022.
3. **Redondeo de `amount_ars`:** half-up a 2 decimales, como ya decía ADR-013. Se agregó a `04-data-model.md`.

4. **Casos de canal API:** se mantienen solo para los negativos (C6), con el `curl` listo para copiar. El resto se verifica por la pantalla. Decidido por Joaquín el 2026-10-06.

**Huecos que quedan como casos por escribir** (no entraron al piloto): par UI del rechazo de una cuota menor a $0,01 (CP-CUO-013 solo tiene el lado API) y su borde válido ($0,03 en 3 cuotas); el segundo trigger de I6 (una cuenta con compras en cuotas no puede dejar de ser de crédito, DEF-009); la vista previa en USD; "n/N" en "Últimos movimientos"; doble toque en "Guardar gasto". Los criterios que son escenarios BDD (US-13 · CA-2, US-16 · CA-2, US-18 · CA-2) no tienen caso manual: hay que decidir qué test automatizado los cubre.

**Cuando se apruebe el formato:** actualizar la línea "Casos de prueba" de US-12 a US-18 en `01-historias-de-usuario.md` y `docs/08-trazabilidad.md` con los IDs nuevos (CP-CUO-014 a 021).

## 6. Qué le pedimos al revisor del piloto

1. ¿Alcanza este nivel de detalle para ejecutar un caso sin preguntarle a quien lo escribió?
2. ¿Los procedimientos `PR-nn` como pre-requisito (en vez de pasos copiados) se entienden, o conviene repetir algo?
3. ¿Se entiende la verificación recorriendo los meses en Movimientos?
4. Los textos "Las cuotas volvieron a 1", "Transacción eliminada" y "No tenés movimientos registrados en <mes>."
   salen de la UI vigente y hay que revalidarlos al ejecutar; los montos y los `code` salen del spec y del contrato de la RPC.
