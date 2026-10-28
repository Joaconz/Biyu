# Casos de prueba V2 — Resumen por categoría (CAT)

**Módulo:** US-72 (gráfico de torta del gasto por categoría) y US-73 (detalle de una categoría).
**Fuentes:** `entrega-2/historias/dashboard-categorias.md` y ADR-038.
**Fuera de alcance:** US-84 (editar un movimiento) no tiene casos porque la función todavía no existe en la aplicación.

> **Criterio.** Son pocos casos y simples: los caminos principales de cada historia (la torta, el detalle, la navegación y el aviso de categoría inexistente) y un caso de límite (7 categorías). Cada caso usa sus propios datos.

## Convenciones de ejecución

- `<APP>` es la dirección del deploy bajo prueba. Cada caso usa su propio usuario (`qa+cp-cat-<nnn>-001@example.com`, contraseña `Clave123!`), creado con PR-01.
- Los movimientos de cada caso se cargan por la API con la RPC `create_transaction` (plantilla de PR-04), con la cuenta `"Efectivo"` salvo que el caso diga otra, una sola cuota y las fechas indicadas. Así no hay que cargar cada gasto por pantalla.
- Las fechas son de septiembre y agosto de 2026 y se abren con `?period=` en la dirección, por lo que el resultado no depende del día en que se ejecuta. Los montos son ficticios.

## Matriz de cobertura

| Historia · criterio | Casos |
|---|---|
| US-72 · CA-1, CA-2 | CP-CAT-001 |
| US-72 · CA-3, CA-4 | CP-CAT-002 |
| US-72 · CA-9, CA-10 | CP-CAT-003 |
| US-73 · CA-1, CA-2, CA-4 | CP-CAT-004 |
| US-73 · CA-10, CA-12 | CP-CAT-005 |
| US-73 · CA-17 | CP-CAT-006 |

## Casos completos

### CP-CAT-001 — La torta muestra una porción por categoría, con su monto y su porcentaje

| Campo | Contenido |
|---|---|
| Historia · criterio | US-72 · CA-1, CA-2 |
| Invariante | I10 |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-cat-001-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>`, `<CATEGORY_ID>` de cada categoría y `<ACCOUNT_ID>` de `"Efectivo"` obtenidos con PR-04 (Pasos 1 y 2). S 3: los gastos de D 1 a D 3 cargados con `create_transaction`.
**Datos de prueba:** D 1: `"Comida y supermercado"` `$60.000,00` el `2026-09-05`. D 2: `"Transporte"` `$30.000,00` el `2026-09-10`. D 3: `"Servicios"` `$10.000,00` el `2026-09-02`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-cat-001-001@example.com`. | El campo "Email" muestra `qa+cp-cat-001-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar. |
| 5 | Escribir `<APP>/dashboard?period=2026-09` en la barra de direcciones y presionar Enter. | Se abre el Resumen de "Septiembre 2026" y "Gastado en septiembre" muestra `$100.000,00`. |
| 6 | Mirar la sección "Por categoría". | Se ve un gráfico de torta con 3 porciones. |
| 7 | Leer la lista de "Por categoría" de arriba hacia abajo. | Tiene 3 filas, en este orden: `Comida y supermercado` `$60.000,00` `60,0 %`; `Transporte` `$30.000,00` `30,0 %`; `Servicios` `$10.000,00` `10,0 %`. |

**Post-condición:** Sin cambios; 3 gastos de septiembre.

### CP-CAT-002 — Los ingresos y los gastos eliminados no entran en la torta

| Campo | Contenido |
|---|---|
| Historia · criterio | US-72 · CA-3, CA-4 |
| Invariante | I10 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-cat-002-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>`, `<CATEGORY_ID>` y `<ACCOUNT_ID>` obtenidos con PR-04 (Pasos 1 y 2). S 3: los movimientos de D 1 a D 5 cargados con `create_transaction`; el de D 4 eliminado después con `delete_transaction`.
**Datos de prueba:** D 1: `"Comida y supermercado"` `$60.000,00` el `2026-09-05`. D 2: `"Transporte"` `$30.000,00` el `2026-09-10`. D 3: `"Servicios"` `$10.000,00` el `2026-09-02`. D 4: gasto de `"Comida y supermercado"` `$9.999,00` el `2026-09-15`, **eliminado**. D 5: ingreso de `$500.000,00` el `2026-09-01` (con cualquier categoría).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-cat-002-001@example.com`. | El campo "Email" muestra `qa+cp-cat-002-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar. |
| 5 | Escribir `<APP>/dashboard?period=2026-09` en la barra de direcciones y presionar Enter. | Se abre el Resumen de "Septiembre 2026". "Gastado en septiembre" muestra `$100.000,00` e "Ingresos" muestra `$500.000,00`. |
| 6 | Leer la lista de "Por categoría" de arriba hacia abajo. | Tiene 3 filas: `Comida y supermercado` `$60.000,00` `60,0 %`; `Transporte` `$30.000,00` `30,0 %`; `Servicios` `$10.000,00` `10,0 %`. El gasto eliminado no suma a Comida y supermercado y el ingreso no aparece. |
| 7 | Mirar el gráfico de torta. | Tiene 3 porciones (una por categoría), no 4. |

**Post-condición:** Sin cambios.

### CP-CAT-003 — Con 7 categorías, las dos más chicas se agrupan en «Resto» en la torta

| Campo | Contenido |
|---|---|
| Historia · criterio | US-72 · CA-9, CA-10 |
| Invariante | — |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-cat-003-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>`, `<CATEGORY_ID>` y `<ACCOUNT_ID>` obtenidos con PR-04 (Pasos 1 y 2). S 3: los 7 gastos de D 1 cargados con `create_transaction`, todos el `2026-09-10`.
**Datos de prueba:** D 1: `"Comida y supermercado"` `$40.000,00`; `"Transporte"` `$30.000,00`; `"Servicios"` `$20.000,00`; `"Salud"` `$15.000,00`; `"Educación"` `$10.000,00`; `"Entretenimiento"` `$8.000,00`; `"Indumentaria"` `$5.000,00` (total `$128.000,00`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-cat-003-001@example.com`. | El campo "Email" muestra `qa+cp-cat-003-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar. |
| 5 | Escribir `<APP>/dashboard?period=2026-09` en la barra de direcciones y presionar Enter. | Se abre el Resumen de "Septiembre 2026" y "Gastado en septiembre" muestra `$128.000,00`. |
| 6 | Contar las porciones del gráfico de torta y, con las herramientas de desarrollador (F12), mirar la última (`data-testid="dashboard-category-chart-slice-rest"`). | Tiene 6 porciones, no 7. La última, «Resto», junta Entretenimiento e Indumentaria: `data-amount` `13000.00`, `data-percentage` `10.2` y `data-count` `2`. |
| 7 | Leer la lista de "Por categoría". | La lista sigue mostrando las 7 categorías por separado. La primera, `Comida y supermercado`, muestra `31,3 %` y `Entretenimiento` muestra `6,3 %`. |

**Post-condición:** Sin cambios.

### CP-CAT-004 — Tocar una categoría del Resumen abre su detalle del mes

| Campo | Contenido |
|---|---|
| Historia · criterio | US-73 · CA-1, CA-2, CA-4 |
| Invariante | I10 |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-cat-004-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>`, `<CATEGORY_ID>` y `<ACCOUNT_ID>` de `"Efectivo"` y `"Tarjeta de débito"` obtenidos con PR-04 (Pasos 1 y 2). S 3: los gastos de D 1 a D 4 cargados con `create_transaction`.
**Datos de prueba:** D 1: `"Comida y supermercado"` `$25.000,00` el `2026-09-14` con `"Efectivo"`. D 2: `"Comida y supermercado"` `$15.000,00` el `2026-09-28` con `"Tarjeta de débito"`. D 3: `"Comida y supermercado"` `$20.000,00` el `2026-08-10` con `"Efectivo"`. D 4: `"Transporte"` `$10.000,00` el `2026-09-10` con `"Efectivo"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-cat-004-001@example.com`. | El campo "Email" muestra `qa+cp-cat-004-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar. |
| 5 | Escribir `<APP>/dashboard?period=2026-09` en la barra de direcciones y presionar Enter. | Se abre el Resumen de "Septiembre 2026". |
| 6 | En "Por categoría", hacer click en la fila `Comida y supermercado`. | Se abre el detalle de la categoría: la dirección termina en `?period=2026-09` y el título es `Comida y supermercado`. |
| 7 | Leer el monto y el porcentaje del detalle. | Se ve `$40.000,00`, `80,0 % del gasto de septiembre` y `Cuotas de meses anteriores $0,00`. |
| 8 | Leer la lista "Gastos de septiembre 2026". | Tiene 2 filas, en este orden: `28 sep · Tarjeta de débito` `-$15.000,00`; `14 sep · Efectivo` `-$25.000,00`. |
| 9 | Mirar las barras de "Últimos 6 meses". | La de agosto muestra `$20,0 mil` y la de septiembre `$40,0 mil`; las anteriores muestran `$0`. |

**Post-condición:** Sin cambios.

### CP-CAT-005 — En el detalle, «Mes anterior» y «‹ Resumen» conservan la categoría y el mes

| Campo | Contenido |
|---|---|
| Historia · criterio | US-73 · CA-10, CA-12 |
| Invariante | — |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-cat-005-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>`, `<CATEGORY_ID>` y `<ACCOUNT_ID>` obtenidos con PR-04 (Pasos 1 y 2). S 3: los gastos de D 1 a D 3 cargados con `create_transaction`.
**Datos de prueba:** D 1: `"Comida y supermercado"` `$40.000,00` el `2026-09-14`. D 2: `"Comida y supermercado"` `$20.000,00` el `2026-08-10`. D 3: `"Transporte"` `$10.000,00` el `2026-09-10`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-cat-005-001@example.com`. | El campo "Email" muestra `qa+cp-cat-005-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar. |
| 5 | Escribir `<APP>/dashboard?period=2026-09` en la barra de direcciones y presionar Enter. | Se abre el Resumen de "Septiembre 2026". |
| 6 | En "Por categoría", hacer click en la fila `Comida y supermercado`. | Se abre el detalle de `Comida y supermercado` en "Septiembre 2026", con `$40.000,00`. |
| 7 | Hacer click en la flecha de "Mes anterior" (a la izquierda de "Septiembre 2026"). | El mes pasa a "Agosto 2026" y la dirección termina en `?period=2026-08`. La categoría sigue siendo `Comida y supermercado`, con `$20.000,00` y `100,0 % del gasto de agosto`. |
| 8 | Hacer click en "‹ Resumen". | Se abre el Resumen de agosto: la dirección termina en `/dashboard?period=2026-08` y el título del mes es "Agosto 2026". |

**Post-condición:** Sin cambios.

### CP-CAT-006 — Una categoría que no existe muestra un aviso con salida al Resumen

| Campo | Contenido |
|---|---|
| Historia · criterio | US-73 · CA-17 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-cat-006-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: dirección `<APP>/dashboard/categories/00000000-0000-0000-0000-000000000000?period=2026-09`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-cat-006-001@example.com`. | El campo "Email" muestra `qa+cp-cat-006-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar. |
| 5 | Escribir la dirección de D 1 en la barra de direcciones y presionar Enter. | Aparece el aviso `No encontramos esta categoría.` y el enlace "Volver al Resumen". No se ve ningún nombre de categoría ni monto. |
| 6 | Hacer click en "Volver al Resumen". | Se abre el Resumen y la dirección termina en `/dashboard?period=2026-09`. |

**Post-condición:** Sin cambios.

## Resumen cuantitativo

| Dimensión | Cantidad |
|---|---:|
| Total | 6 |
| Positivos | 3 |
| Negativos | 2 |
| Límite | 1 |
| UI | 6 |
| API | 0 |
| Prioridad Alta | 3 |
| Prioridad Media | 3 |
| Prioridad Baja | 0 |
| Automatizable Sí | 6 |
| Automatizable No | 0 |
| Automatizable V3 | 0 |
