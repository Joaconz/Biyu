# Entrega 2 · Casos de prueba · Deudas y gastos compartidos (DEU)

> **Recorte y renumeración del 2026-10-27.** Los IDs son consecutivos desde 001; la tabla de equivalencia con los IDs anteriores está en [`equivalencia-ids.md`](../equivalencia-ids.md). El catálogo de Deudas pasó de 210 a 61 casos: se quitaron las validaciones de formulario que repetían una regla con otro valor, los casos de compartir con varias personas (US-82, sin implementar) salvo CP-DEU-055, 056 y 057, y los de deudas sueltas en el balance (US-83, sin implementar). Los criterios que quedaron sin caso figuran como «sin caso» en la tabla de trazabilidad.

Módulo **DEU** · Épica [#18](https://github.com/Joaconz/Biyu/issues/18) · Issue [#21](https://github.com/Joaconz/Biyu/issues/21).
Especificación fuente: [`entrega-2/historias/deudas.md`](../historias/deudas.md), [`docs/02-behavior-spec.md`](../../docs/02-behavior-spec.md) (FR-18, FR-19), [`docs/04-data-model.md`](../../docs/04-data-model.md) (I4, I5, I7, I9, I10, consulta 6), ADR-002, ADR-006, ADR-021, ADR-023, ADR-024, ADR-034, ADR-036, ADR-037, ADR-040 y ADR-041.
Mocks de referencia: [`deudas-listado.html`](../mocks/deudas-listado.html), [`deudas-movimientos.html`](../mocks/deudas-movimientos.html), [`deudas-nueva.html`](../mocks/deudas-nueva.html), [`deudas-registrar-compartido.html`](../mocks/deudas-registrar-compartido.html), [`deudas-resumen-neto.html`](../mocks/deudas-resumen-neto.html).
Procedimientos reutilizables: [`docs/12-procedimientos-de-prueba.md`](../../docs/12-procedimientos-de-prueba.md) (`PR-01` a `PR-08`).

## Convenciones de fechas y consultas

1. **Fechas fijas pasadas (C1):** todos los casos que no dependen de la validación del servidor contra `argentina_today()` ni del instante de `settle_debt` (`now()`) usan fechas fijas pasadas (`15/08/2026`, período `2026-08`).
2. **Fechas relativas a la fecha de ejecución (ADR-021, hora de Argentina `America/Argentina/Buenos_Aires`):** únicamente en los casos de `US-35 · CA-6`, `US-36 · CA-1, CA-2, CA-7, CA-8`, `US-39 · CA-2` y `US-83 · CA-1` a `CA-11`, donde la RPC o la UI contrastan con el día actual del servidor (`argentina_today()` / `settled_at = now()`), el ejecutante reemplaza estas etiquetas por la fecha calendario del día en que corre el caso:

| Etiqueta | Significado | Formato | Ejemplo (si se ejecuta el `12/10/2026`) |
|---|---|---|---|
| `<HOY>` | Día de ejecución en hora de Argentina | `AAAA-MM-DD` | `2026-10-12` |
| `<HOY_DMY>` | `<HOY>` en formato de pantalla | `dd/mm/aaaa` | `12/10/2026` |
| `<MAÑANA>` | `<HOY> + 1 día` | `AAAA-MM-DD` | `2026-10-13` |
| `<MAÑANA_DMY>` | `<MAÑANA>` en formato de pantalla | `dd/mm/aaaa` | `13/10/2026` |
| `<H>` | Período del mes de `<HOY>` | `AAAA-MM` | `2026-10` |
| `<H_FECHA>` | Día 10 del mes `<H>` (o `<HOY>` si hoy es antes del día 10) | `AAAA-MM-DD` | `2026-10-10` |
| `<H_FECHA_DMY>` | `<H_FECHA>` en formato de pantalla | `dd/mm/aaaa` | `10/10/2026` |
| `<H-1>` | Período del mes calendario anterior a `<H>` | `AAAA-MM` | `2026-09` |
| `<H-1_FECHA>` | Día 15 del mes `<H-1>` | `AAAA-MM-DD` | `2026-09-15` |
| `<H-1_FECHA_DMY>` | `<H-1_FECHA>` en formato de pantalla | `dd/mm/aaaa` | `15/09/2026` |

3. **Lecturas de montos por API (C2, `PR-08`):** para verificar columnas `numeric` en PostgREST sin pérdida de precisión IEEE-754, las consultas de oráculo de `PR-08` piden los montos como texto (`amount_text:amount::text,amount_ars_text:amount_ars::text,fx_rate_text:fx_rate::text`). En los llamados a las RPC (`PR-04`), los montos y tipos de cambio válidos se envían como string decimal (`"120000.00"`), reservando el literal numérico sin comillas solo cuando el criterio exige probar un literal JSON específico (`0`, `-1`, `1.001`).

---

## (a) Tabla de trazabilidad `US-nn · CA-k → CP-DEU-nnn`

| Historia | Criterio | Casos que lo cubren / Hueco justificado |
|---|---|---|
| **US-30** | CA-1 | CP-DEU-058 |
| **US-30** | CA-2 | CP-DEU-059, CP-DEU-046 |
| **US-30** | CA-3 | — (sin caso tras el recorte del 2026-10-27) |
| **US-30** | CA-4 | CP-DEU-060 |
| **US-30** | CA-5 | CP-DEU-015, CP-DEU-016 |
| **US-30** | CA-6 | CP-DEU-061 |
| **US-30** | CA-7 | — (sin caso tras el recorte del 2026-10-27) |
| **US-30** | CA-8 | — (sin caso tras el recorte del 2026-10-27) |
| **US-30** | CA-9 | CP-DEU-058 |
| **US-30** | CA-10 | CP-DEU-058, CP-DEU-059, CP-DEU-061 |
| **US-34** | CA-1 | CP-DEU-001 |
| **US-34** | CA-2 | CP-DEU-001 |
| **US-34** | CA-3 | CP-DEU-002 |
| **US-34** | CA-4 | CP-DEU-002 |
| **US-34** | CA-5 | CP-DEU-003 |
| **US-34** | CA-6 | — (sin caso tras el recorte del 2026-10-27) |
| **US-34** | CA-7 | `CP-DEU-004` (vacío) |
| **US-34** | CA-8 | `CP-DEU-005` (solo persona), `CP-DEU-006` (solo monto), `CP-DEU-007` (`income`), `CP-DEU-008` (`"   "`), `CP-DEU-009` (61 chars), `CP-DEU-010` (`0`) |
| **US-34** | CA-9 | CP-DEU-002 |
| **US-34** | CA-10 | — (sin caso tras el recorte del 2026-10-27) |
| **US-34** | CA-11 | CP-DEU-001, CP-DEU-002, CP-DEU-004 |
| **US-34** | CA-12 | — (sin caso tras el recorte del 2026-10-27) |
| **US-34** | CA-13 | CP-DEU-003 |
| **US-35** | CA-1 | CP-DEU-002 |
| **US-35** | CA-2 | — (sin caso tras el recorte del 2026-10-27) |
| **US-35** | CA-3 | `CP-DEU-014` (`"Compartido con Sofía"` en las 12 cuotas y en Últimos movimientos; gasto sin deuda sin etiqueta) |
| **US-35** | CA-4 | — (sin caso tras el recorte del 2026-10-27) |
| **US-35** | CA-5 | CP-DEU-015 |
| **US-35** | CA-6 | CP-DEU-016 |
| **US-35** | CA-7 | — (sin caso tras el recorte del 2026-10-27) |
| **US-36** | CA-1 | CP-DEU-017 |
| **US-36** | CA-2 | CP-DEU-017 |
| **US-36** | CA-3 | CP-DEU-018 |
| **US-36** | CA-4 | `CP-DEU-019` (TC sugerido) |
| **US-36** | CA-5 | `CP-DEU-020` (sin TC de referencia) |
| **US-36** | CA-6 | `CP-DEU-021` (persona `""`), `CP-DEU-022` (monto `0`), `CP-DEU-023` (monto `0,001`), `CP-DEU-024` (USD `0,01 × 0,5` half-up), `CP-DEU-025` (TC `0`) |
| **US-36** | CA-7 | `CP-DEU-026` (fecha mañana) |
| **US-36** | CA-8 | `CP-DEU-027` (persona `""`), `CP-DEU-028` (61 chars), `CP-DEU-029` (monto `0`), `CP-DEU-030` (monto `1.001`), `CP-DEU-031` (USD sin TC), `CP-DEU-032` (ARS con TC), `CP-DEU-033` (fecha mañana), `CP-DEU-034` (`anon`) |
| **US-36** | CA-9 | CP-DEU-035 |
| **US-36** | CA-10 | `CP-DEU-017` (1 llamada a `create_debt`); doble toque: Hueco `H-DEU-01` |
| **US-36** | CA-11 | — (sin caso tras el recorte del 2026-10-27) |
| **US-36** | CA-12 | Modificado por `US-83` (sin implementar: sus casos se quitaron del catálogo): cubierto por `CP-DEU-060` |
| **US-36** | CA-13 | Hueco `H-DEU-02` |
| **US-36** | CA-14 | CP-DEU-017, CP-DEU-021, CP-DEU-025, CP-DEU-026 |
| **US-36** | CA-15 | Hueco `H-DEU-03` (suite pgTAP automatizada) |
| **US-37** | CA-1 | CP-DEU-036 |
| **US-37** | CA-2 | CP-DEU-037 |
| **US-37** | CA-3 | — (sin caso tras el recorte del 2026-10-27) |
| **US-37** | CA-4 | CP-DEU-036 |
| **US-37** | CA-5 | CP-DEU-046 |
| **US-37** | CA-6 | CP-DEU-038 |
| **US-37** | CA-7 | CP-DEU-015 |
| **US-38** | CA-1 | CP-DEU-039 |
| **US-38** | CA-2 | CP-DEU-039 |
| **US-38** | CA-3 | — (sin caso tras el recorte del 2026-10-27) |
| **US-38** | CA-4 | CP-DEU-040 |
| **US-38** | CA-5 | `CP-DEU-041` (orden pendientes) |
| **US-38** | CA-6 | CP-DEU-036, CP-DEU-039 |
| **US-38** | CA-7 | `CP-DEU-042` (vacío Pendientes) |
| **US-38** | CA-8 | Hueco `H-DEU-04` |
| **US-38** | CA-9 | `CP-DEU-043` (UI usuario B), `CP-DEU-044` (API usuario B), `CP-DEU-045` (API `anon` `42501`) |
| **US-38** | CA-10 | — (sin caso tras el recorte del 2026-10-27) |
| **US-38** | CA-11 | CP-DEU-039, CP-DEU-042 |
| **US-39** | CA-1 | CP-DEU-046 |
| **US-39** | CA-2 | — (sin caso tras el recorte del 2026-10-27) |
| **US-39** | CA-3 | Hueco `H-DEU-01` |
| **US-39** | CA-4 | `CP-DEU-047` (Deshacer dentro de 5 s) |
| **US-39** | CA-5 | `CP-DEU-048` (ya saldada en otra pestaña); fallo de red: Hueco `H-DEU-02` |
| **US-39** | CA-6 | `CP-DEU-049` (ya saldada API), `CP-DEU-050` (id de otro usuario API) |
| **US-39** | CA-7 | `CP-DEU-051` (`PATCH /rest/v1/debts` con `42501`) |
| **US-39** | CA-8 | CP-DEU-046, CP-DEU-059 |
| **US-40** | CA-1 | CP-DEU-052 |
| **US-40** | CA-2 | CP-DEU-052 |
| **US-40** | CA-3 | — (sin caso tras el recorte del 2026-10-27) |
| **US-40** | CA-4 | — (sin caso tras el recorte del 2026-10-27) |
| **US-40** | CA-5 | CP-DEU-053 |
| **US-40** | CA-6 | — (sin caso tras el recorte del 2026-10-27) |
| **US-41** | CA-1 | — (sin caso tras el recorte del 2026-10-27) |
| **US-41** | CA-2 | CP-DEU-011 |
| **US-41** | CA-3 | CP-DEU-012 |
| **US-41** | CA-4 | — (sin caso tras el recorte del 2026-10-27) |
| **US-41** | CA-5 | CP-DEU-013 |
| **US-41** | CA-6 | — (sin caso tras el recorte del 2026-10-27) |
| **US-41** | CA-7 | — (sin caso tras el recorte del 2026-10-27) |
| **US-41** | CA-8 | Hueco `H-DEU-03` (trigger interno `check_debt_rule` en pgTAP) |
| **US-79** | CA-1 | CP-DEU-054 |
| **US-79** | CA-2 | CP-DEU-054 |
| **US-79** | CA-3 | — (sin caso tras el recorte del 2026-10-27) |
| **US-79** | CA-4 | — (sin caso tras el recorte del 2026-10-27) |
| **US-79** | CA-5 | — (sin caso tras el recorte del 2026-10-27) |
| **US-79** | CA-6 | — (sin caso tras el recorte del 2026-10-27) |
| **US-79** | CA-7 | CP-DEU-054 |
| **US-79** | CA-8 | CP-DEU-054 |
| **US-79** | CA-9 | CP-DEU-054 |
| **US-82** | CA-1 | CP-DEU-055 |
| **US-82** | CA-2 | CP-DEU-055 |
| **US-82** | CA-3 | — (sin caso tras el recorte del 2026-10-27) |
| **US-82** | CA-4 | — (sin caso tras el recorte del 2026-10-27) |
| **US-82** | CA-5 | CP-DEU-056 |
| **US-82** | CA-6 | — (sin caso tras el recorte del 2026-10-27) |
| **US-82** | CA-7 | — (sin caso tras el recorte del 2026-10-27) |
| **US-82** | CA-8 | — (sin caso tras el recorte del 2026-10-27) |
| **US-82** | CA-9 | — (sin caso tras el recorte del 2026-10-27) |
| **US-82** | CA-10 | `CP-DEU-055` (2 personas) |
| **US-82** | CA-11 | — (sin caso tras el recorte del 2026-10-27) |
| **US-82** | CA-12 | — (sin caso tras el recorte del 2026-10-27) |
| **US-82** | CA-13 | — (sin caso tras el recorte del 2026-10-27) |
| **US-82** | CA-14 | `CP-DEU-005` (solo personas), `CP-DEU-057` (suma `60000 + 60000.01`), `CP-DEU-007` (`income` con 1 deuda) |
| **US-82** | CA-15 | CP-DEU-002, CP-DEU-005 a CP-DEU-007, CP-DEU-008, CP-DEU-009, CP-DEU-010, CP-DEU-013 |
| **US-82** | CA-16 | — (sin caso tras el recorte del 2026-10-27) |
| **US-82** | CA-17 | — (sin caso tras el recorte del 2026-10-27) |
| **US-82** | CA-18 | — (sin caso tras el recorte del 2026-10-27) |
| **US-82** | CA-19 | — (sin caso tras el recorte del 2026-10-27) |
| **US-82** | CA-20 | — (sin caso tras el recorte del 2026-10-27) |
| **US-82** | CA-21 | Hueco `H-DEU-05` |
| **US-82** | CA-22 | CP-DEU-055, CP-DEU-056 |
| **US-83** | CA-1 | — (sin caso tras el recorte del 2026-10-27) |
| **US-83** | CA-2 | — (sin caso tras el recorte del 2026-10-27) |
| **US-83** | CA-3 | — (sin caso tras el recorte del 2026-10-27) |
| **US-83** | CA-4 | — (sin caso tras el recorte del 2026-10-27) |
| **US-83** | CA-5 | — (sin caso tras el recorte del 2026-10-27) |
| **US-83** | CA-6 | — (sin caso tras el recorte del 2026-10-27) |
| **US-83** | CA-7 | — (sin caso tras el recorte del 2026-10-27) |
| **US-83** | CA-8 | — (sin caso tras el recorte del 2026-10-27) |
| **US-83** | CA-9 | — (sin caso tras el recorte del 2026-10-27) |
| **US-83** | CA-10 | — (sin caso tras el recorte del 2026-10-27) |
| **US-83** | CA-11 | — (sin caso tras el recorte del 2026-10-27) |
| **US-83** | CA-12 | Hueco `H-DEU-06` (prueba unitaria de dominio con reloj fijo) |
| **US-83** | CA-13 | Hueco `H-DEU-04` |
| **US-83** | CA-14 | — (sin caso tras el recorte del 2026-10-27) |

---

## (b) Casos de prueba completos

### Sección 1 — Gasto compartido con una persona y tope de monto (US-34, US-41)

#### CP-DEU-001 — El interruptor "Gasto compartido" aparece apagado en Gasto, despliega los campos al encenderse y al apagarse guarda el gasto sin deuda

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-1, CA-2, CA-11 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-001-001@example.com` con contraseña `Clave123!`, creado con PR-01 (configuración inicial salteada).
**Datos de prueba:** D 1: monto del gasto `50000`. D 2: categoría `"Otros"`. D 3: cuenta `"Efectivo"`. D 4: fecha `15/08/2026`. D 5: persona escrita antes de apagar `"Sofía"`, monto adeudado `25000`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-001-001@example.com`. | El campo "Email" muestra `qa+cp-deu-001-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la pantalla Registrar en el paso 1 de 3, "¿Cuánto?", con "Gasto" y "ARS" seleccionados. |
| 5 | Escribir `50000` en el campo del monto. | El campo del monto muestra `50000` y se habilita el botón "Siguiente". |
| 6 | Hacer click en el botón "Siguiente". | Se abre el paso 2 de 3, "¿En qué?". |
| 7 | Hacer click en la categoría "Otros". | Se abre el paso 3 de 3, "Revisá y guardá". Debajo de "Nota (opcional)" se ve la sección "Gasto compartido" con el interruptor (`data-testid="transaction-form-shared-toggle"`) apagado (`aria-checked="false"`), y los campos "¿Con quién?" y "¿Cuánto te debe?" no están visibles. |
| 8 | Hacer click en el interruptor "Gasto compartido" (`data-testid="transaction-form-shared-toggle"`). | El interruptor pasa a encendido (`aria-checked="true"`) y aparece una fila (`data-testid="transaction-form-shared-row"`, `data-index="1"`) con "¿Con quién?" (`data-testid="transaction-form-shared-person"`) vacío y "¿Cuánto te debe?" (`data-testid="transaction-form-shared-amount"`) vacío con prefijo `$`. |
| 9 | Hacer click en el campo "¿Con quién?" y escribir `Sofía`. | El campo "¿Con quién?" muestra `Sofía`. |
| 10 | Hacer click en el campo "¿Cuánto te debe?" y escribir `25000`. | Se muestra el resumen `data-testid="transaction-form-shared-summary"` con el texto `"Sofía te va a deber $25.000,00 · Tu parte: $25.000,00"`. |
| 11 | En la sección "Fecha", hacer click en el botón "Otra". | "Otra" queda marcada y el campo de fecha (`data-testid="transaction-form-date"`) se habilita. |
| 12 | Escribir `15/08/2026` en el campo de fecha (`data-testid="transaction-form-date"`). | El campo de fecha muestra `15/08/2026`. |
| 13 | Hacer click en el interruptor "Gasto compartido" (`data-testid="transaction-form-shared-toggle"`). | El interruptor queda apagado (`aria-checked="false"`) y los campos "¿Con quién?", "¿Cuánto te debe?" y el resumen desaparecen. |
| 14 | En la sección "Cuenta", hacer click en "Efectivo". | "Efectivo" queda marcada y el botón "Guardar gasto" queda habilitado. |
| 15 | Hacer click en el botón "Guardar gasto" (`data-testid="transaction-form-submit"`). | Aparece el aviso `"Gasto guardado"` (`data-testid="transaction-form-saved"`) sin mención de deuda. |
| 16 | Escribir `<APP>/debts?status=all` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Deudas" con el estado vacío `"No cargaste ninguna deuda todavía."` (`data-testid="debts-empty"`): no se creó ninguna deuda. |

**Post-condición:** 1 transacción de `$50.000,00` y 0 filas en `debts`.

---

#### CP-DEU-002 — Registrar un gasto compartido de $120.000,00 ARS en 12 cuotas con Sofía por $60.000,00 crea la transacción, 12 cuotas y la deuda vinculada en una sola llamada RPC

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-3, CA-4, CA-9, CA-11 · US-35 · CA-1 · US-82 · CA-15 · FR-18 |
| Invariante | I2, I3, I4, I5, I7 |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-002-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` y `<USER_ID>` obtenidos con PR-04 (Paso 1). S 3: categoría D 2 creada con PR-04 (`POST /rest/v1/categories` con `{"user_id": "<USER_ID>", "name": "Tecnología", "color": "#2E7D5B"}`).
**Datos de prueba:** D 1: monto `120000` ARS. D 2: categoría `"Tecnología"`. D 3: cuenta `"Tarjeta de crédito"`. D 4: cuotas `12`. D 5: fecha `15/08/2026`. D 6: persona `"Sofía"`, monto adeudado `60000`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, abrir las herramientas de desarrollador en la pestaña "Network" (Red), escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-002-001@example.com`. | El campo "Email" muestra `qa+cp-deu-002-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1 de 3, "¿Cuánto?". |
| 5 | Escribir `120000` en el campo del monto. | El campo del monto muestra `120000` y se habilita "Siguiente". |
| 6 | Hacer click en el botón "Siguiente". | Se abre el paso 2 de 3, "¿En qué?". |
| 7 | Hacer click en la categoría "Tecnología". | Se abre el paso 3 de 3, "Revisá y guardá". |
| 8 | En la sección "Cuenta", hacer click en "Tarjeta de crédito". | "Tarjeta de crédito" queda marcada y aparece la sección "Cuotas". |
| 9 | En la sección "Cuotas", hacer click en el botón "12". | El botón "12" queda marcado. |
| 10 | En la sección "Fecha", hacer click en el botón "Otra". | "Otra" queda marcada y el campo de fecha se habilita. |
| 11 | Escribir `15/08/2026` en el campo de fecha (`data-testid="transaction-form-date"`). | El campo de fecha muestra `15/08/2026`. |
| 12 | Hacer click en el interruptor "Gasto compartido" (`data-testid="transaction-form-shared-toggle"`). | Aparecen los campos "¿Con quién?" (`data-testid="transaction-form-shared-person"`) y "¿Cuánto te debe?" (`data-testid="transaction-form-shared-amount"`). |
| 13 | Hacer click en "¿Con quién?" y escribir `Sofía`. | El campo "¿Con quién?" muestra `Sofía`. |
| 14 | Hacer click en "¿Cuánto te debe?" y escribir `60000`. | Aparece `data-testid="transaction-form-shared-summary"` con el texto `"Sofía te va a deber $60.000,00 · Tu parte: $60.000,00"`. |
| 15 | Limpiar el registro de la pestaña "Network" y hacer click en "Guardar gasto" (`data-testid="transaction-form-submit"`). | Se emite exactamente 1 llamada `POST /rest/v1/rpc/create_transaction` con `"p_shared_persons": ["Sofía"]` y `"p_shared_amounts": ["60000.00"]` y 0 llamadas a `/rest/v1/debts`. Aparece el aviso `"Gasto guardado"` (`data-testid="transaction-form-saved"`) con la descripción `"Sofía te debe $60.000,00"` y el formulario vuelve al paso 1. |
| 16 | Escribir `1000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2 de 3, "¿En qué?". |
| 17 | Hacer click en la categoría "Otros". | Se abre el paso 3 de 3 con la cuenta `"Tarjeta de crédito"` preseleccionada y el interruptor "Gasto compartido" apagado (`aria-checked="false"`). |
| 18 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=person,amount_text:amount::text,currency,fx_rate,amount_ars_text:amount_ars::text,direction,status,settled_at,incurred_on,transaction_id` y las consultas de transacciones e imputaciones de PR-08. | `transactions` devuelve 1 fila con `amount = "120000.00"` e `installments_count = 12`. `ledger_entries` devuelve 12 filas de `"10000.00"` (`2026-08-01` a `2027-07-01`). `debts` devuelve 1 fila con `person = "Sofía"`, `amount_text = "60000.00"`, `currency = "ARS"`, `fx_rate = null`, `amount_ars_text = "60000.00"`, `direction = "owed_to_me"`, `status = "pending"`, `settled_at = null`, `incurred_on = "2026-08-15"` y `transaction_id` igual al `id` de la transacción. |

**Post-condición:** 1 transacción de `$120.000,00`, 12 filas en `ledger_entries` de `$10.000,00` y 1 deuda vinculada pendiente de `$60.000,00`.

---

#### CP-DEU-003 — Registrar un gasto compartido en US$100,00 a TC 1250 con Sofía por US$40,00 congela fx_rate = 1250.0000 y amount_ars = 50000.00 y avisa en dólares

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-5, CA-13 · FR-18 |
| Invariante | I4, I5, I7 · C5 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-003-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: monto `100` USD. D 2: TC `1250`. D 3: categoría `"Otros"`. D 4: fecha `15/08/2026`. D 5: persona `"Sofía"`, monto adeudado `40`. D 6: cuenta `"Efectivo"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-003-001@example.com`. | El campo "Email" muestra `qa+cp-deu-003-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1 de 3, "¿Cuánto?". |
| 5 | Hacer click en la moneda "US$" (`data-testid="transaction-form-currency-usd"`). | Queda seleccionada "US$" y aparece el campo "Tipo de cambio (ARS por US$)" (`data-testid="transaction-form-fx-rate"`). |
| 6 | Escribir `100` en el campo del monto. | El campo del monto muestra `100`. |
| 7 | Hacer click en "Tipo de cambio (ARS por US$)" y escribir `1250`. | Se muestra el equivalente `≈ $125.000,00` y se habilita "Siguiente". |
| 8 | Hacer click en el botón "Siguiente". | Se abre el paso 2 de 3, "¿En qué?". |
| 9 | Hacer click en la categoría "Otros". | Se abre el paso 3 de 3, "Revisá y guardá". |
| 10 | En la sección "Fecha", hacer click en el botón "Otra". | "Otra" queda marcada y el campo de fecha se habilita. |
| 11 | Escribir `15/08/2026` en el campo de fecha (`data-testid="transaction-form-date"`). | El campo de fecha muestra `15/08/2026`. |
| 12 | Hacer click en el interruptor "Gasto compartido" (`data-testid="transaction-form-shared-toggle"`). | Aparecen "¿Con quién?" y "¿Cuánto te debe?" con el prefijo `US$`. |
| 13 | Hacer click en "¿Con quién?" y escribir `Sofía`. | El campo "¿Con quién?" muestra `Sofía`. |
| 14 | Hacer click en "¿Cuánto te debe?" y escribir `40`. | El resumen `data-testid="transaction-form-shared-summary"` muestra `"Sofía te va a deber US$40,00 · Tu parte: US$60,00"`. |
| 15 | En la sección "Cuenta", hacer click en "Efectivo". | "Efectivo" queda marcada. Debajo aparece el aviso "Completá tipo de cambio para guardar" y "Guardar gasto" queda deshabilitado (al cambiar el mes de la fecha, la app descarta el tipo de cambio escrito). |
| 16 | Hacer click en el monto `US$100,00` ("cambiar monto") de la parte de arriba. | Se abre el paso 1 de 3, "¿Cuánto?", con "US$" marcado, el monto `100` y el campo "Tipo de cambio (ARS por US$)" (`data-testid="transaction-form-fx-rate"`) vacío, con el aviso "Falta el tipo de cambio". |
| 17 | Hacer click en "Tipo de cambio (ARS por US$)" y escribir `1250`. | El campo muestra `1250`. |
| 18 | Hacer click en el botón "Siguiente". | Se abre el paso 2 de 3, "¿En qué?", con el resumen `US$100,00` y `TC 1.250,00`. |
| 19 | Hacer click en la categoría "Otros". | Se abre el paso 3 de 3 con la fecha `15/08/2026`, la cuenta "Efectivo", el interruptor "Gasto compartido" encendido con `Sofía` y `40`, y "Guardar gasto" habilitado. |
| 20 | Hacer click en el botón "Guardar gasto". | Aparece el aviso `"Gasto guardado"` (`data-testid="transaction-form-saved"`) con la descripción `"Sofía te debe US$40,00"`. |
| 21 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=person,currency,amount_text:amount::text,fx_rate_text:fx_rate::text,amount_ars_text:amount_ars::text`. | Devuelve 1 fila con `person = "Sofía"`, `currency = "USD"`, `amount_text = "40.00"`, `fx_rate_text = "1250.0000"` y `amount_ars_text = "50000.00"`. |

**Post-condición:** 1 transacción en USD y 1 deuda vinculada en USD con `fx_rate = 1250.0000` y `amount_ars = 50000.00`.

---

#### CP-DEU-004 — El monto adeudado vacío muestra "Ingresá cuánto te debe" y deshabilita "Guardar gasto"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-7, CA-11 · FR-18 |
| Invariante | I4 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · CP-DEU-005 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-004-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: monto `20000` ARS. D 2: persona `"Sofía"`. D 3: monto adeudado vacío `""`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-004-001@example.com`. | El campo "Email" muestra `qa+cp-deu-004-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1. |
| 5 | Escribir `20000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2, "¿En qué?". |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3, "Revisá y guardá". |
| 7 | Hacer click en el interruptor "Gasto compartido" y escribir `Sofía` en "¿Con quién?". | El botón "Guardar gasto" está deshabilitado (`disabled`). |
| 8 | Hacer click en "¿Cuánto te debe?" (`data-testid="transaction-form-shared-amount"`) y luego hacer click en "¿Con quién?" para quitarle el foco sin escribir nada. | Debajo de "¿Cuánto te debe?" aparece `data-testid="transaction-form-shared-amount-error"` con el texto exacto `"Ingresá cuánto te debe"`, y "Guardar gasto" sigue deshabilitado. |

**Post-condición:** 0 filas en `transactions` y `debts`.

---

#### CP-DEU-005 — Directo contra create_transaction, enviar p_shared_persons = ["Sofía"] con p_shared_amounts = null se rechaza con "Un gasto compartido necesita una persona y un monto por cada deuda"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-8 · US-82 · CA-14, CA-15 · FR-18 |
| Invariante | I4 · C4 · C6 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-DEU-004 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-005-001@example.com` creado con PR-01. S 2: `<TOKEN>`, `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Pasos 1 y 2).
**Datos de prueba:** D 1: `p_amount = "20000.00"`, `p_currency = "ARS"`, `p_occurred_on = "2026-08-15"`. D 2: `p_shared_persons = ["Sofía"]`, `p_shared_amounts = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con cuerpo `{"p_type": "expense", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null, "p_shared_persons": ["Sofía"], "p_shared_amounts": null}`. | Responde HTTP `400` con `code = "23514"` y `message = "Un gasto compartido necesita una persona y un monto por cada deuda"`. |
| 2 | Ejecutar las consultas de PR-08 (`transactions`, `ledger_entries` y `GET <SUPABASE_URL>/rest/v1/debts?select=id`). | Las tres devuelven `[]` (atomicidad C4). |

**Post-condición:** 0 filas en `transactions`, `ledger_entries` y `debts`.

---

#### CP-DEU-006 — Directo contra create_transaction, enviar p_shared_persons = null con p_shared_amounts = ["10000.00"] se rechaza con "Un gasto compartido necesita una persona y un monto por cada deuda"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-8 · US-82 · CA-14, CA-15 · FR-18 |
| Invariante | C4 · C6 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-006-001@example.com` creado con PR-01. S 2: `<TOKEN>`, `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Pasos 1 y 2).
**Datos de prueba:** D 1: `p_amount = "20000.00"`, `p_currency = "ARS"`, `p_occurred_on = "2026-08-15"`. D 2: `p_shared_persons = null`, `p_shared_amounts = ["10000.00"]`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con cuerpo `{"p_type": "expense", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null, "p_shared_persons": null, "p_shared_amounts": ["10000.00"]}`. | Responde HTTP `400` con `code = "23514"` y `message = "Un gasto compartido necesita una persona y un monto por cada deuda"`. |
| 2 | Ejecutar las consultas de PR-08 (`transactions` y `debts`). | Ambas devuelven `[]`. |

**Post-condición:** 0 filas en `transactions`, `ledger_entries` y `debts`.

---

#### CP-DEU-007 — Directo contra create_transaction, p_type = "income" con una deuda compartida se rechaza con "Un ingreso no se puede compartir"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-8 · US-82 · CA-14, CA-15 · FR-18 |
| Invariante | I7 · C4 · C6 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-007-001@example.com` creado con PR-01. S 2: `<TOKEN>` y `<ACCOUNT_ID>` de `"Efectivo"` obtenidos con PR-04 (Pasos 1 y 2).
**Datos de prueba:** D 1: `p_type = "income"`, `p_amount = "20000.00"`, `p_occurred_on = "2026-08-15"`. D 2: `p_shared_persons = ["Sofía"]`, `p_shared_amounts = ["10000.00"]`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con cuerpo `{"p_type": "income", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": null, "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null, "p_shared_persons": ["Sofía"], "p_shared_amounts": ["10000.00"]}`. | Responde HTTP `400` con `code = "23514"` y `message = "Un ingreso no se puede compartir"`. |
| 2 | Ejecutar las consultas de PR-08 (`transactions` y `debts`). | Ambas devuelven `[]`. |

**Post-condición:** 0 filas en `transactions`, `ledger_entries` y `debts`.

---

#### CP-DEU-008 — Directo contra create_transaction, p_shared_persons = ["   "] se rechaza con "Ingresá con quién compartiste el gasto"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-8 · US-82 · CA-14, CA-15 · FR-18 |
| Invariante | C4 · C6 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-008-001@example.com` creado con PR-01. S 2: `<TOKEN>`, `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Pasos 1 y 2).
**Datos de prueba:** D 1: `p_amount = "20000.00"`, `p_occurred_on = "2026-08-15"`. D 2: `p_shared_persons = ["   "]`, `p_shared_amounts = ["10000.00"]`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con cuerpo `{"p_type": "expense", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null, "p_shared_persons": ["   "], "p_shared_amounts": ["10000.00"]}`. | Responde HTTP `400` con `code = "23514"` y `message = "Ingresá con quién compartiste el gasto"`. |
| 2 | Ejecutar las consultas de PR-08 (`transactions` y `debts`). | Ambas devuelven `[]`. |

**Post-condición:** 0 filas en `transactions`, `ledger_entries` y `debts`.

---

#### CP-DEU-009 — Directo contra create_transaction, una persona de 61 caracteres se rechaza con "La persona admite hasta 60 caracteres"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-8 · US-82 · CA-14, CA-15 · FR-18 |
| Invariante | C4 · C6 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-009-001@example.com` creado con PR-01. S 2: `<TOKEN>`, `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Pasos 1 y 2).
**Datos de prueba:** D 1: `p_amount = "20000.00"`, `p_occurred_on = "2026-08-15"`. D 2: `p_shared_persons = ["A123456789B123456789C123456789D123456789E123456789F123456789Z"]` (61 caracteres), `p_shared_amounts = ["10000.00"]`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con cuerpo `{"p_type": "expense", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null, "p_shared_persons": ["A123456789B123456789C123456789D123456789E123456789F123456789Z"], "p_shared_amounts": ["10000.00"]}`. | Responde HTTP `400` con `code = "23514"` y `message = "La persona admite hasta 60 caracteres"`. |
| 2 | Ejecutar las consultas de PR-08 (`transactions` y `debts`). | Ambas devuelven `[]`. |

**Post-condición:** 0 filas en `transactions`, `ledger_entries` y `debts`.

---

#### CP-DEU-010 — Directo contra create_transaction, p_shared_amounts = [0] se rechaza con "I4: el monto de la deuda debe ser mayor a cero"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-8 · US-82 · CA-14, CA-15 · FR-18 |
| Invariante | I4 · C4 · C6 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-010-001@example.com` creado con PR-01. S 2: `<TOKEN>`, `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Pasos 1 y 2).
**Datos de prueba:** D 1: `p_amount = "20000.00"`, `p_occurred_on = "2026-08-15"`. D 2: `p_shared_persons = ["Sofía"]`, `p_shared_amounts = [0]`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con cuerpo `{"p_type": "expense", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null, "p_shared_persons": ["Sofía"], "p_shared_amounts": [0]}`. | Responde HTTP `400` con `code = "23514"` y `message = "I4: el monto de la deuda debe ser mayor a cero"`. |
| 2 | Ejecutar las consultas de PR-08 (`transactions` y `debts`). | Ambas devuelven `[]`. |

**Post-condición:** 0 filas en `transactions`, `ledger_entries` y `debts`.

---

#### CP-DEU-011 — Deuda de $10.000,00 sobre un gasto de $10.000,00 (igual al gasto) muestra "Tu parte: $0,00" y se guarda

| Campo | Contenido |
|---|---|
| Historia · criterio | US-41 · CA-2 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-011-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: monto del gasto `10000` ARS. D 2: persona `"Sofía"`. D 3: monto adeudado `10000`. D 4: fecha `15/08/2026`. D 5: cuenta `"Efectivo"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-011-001@example.com`. | El campo "Email" muestra `qa+cp-deu-011-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1. |
| 5 | Escribir `10000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2, "¿En qué?". |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3, "Revisá y guardá". |
| 7 | En la sección "Fecha", hacer click en "Otra" y escribir `15/08/2026`. | El campo de fecha muestra `15/08/2026`. |
| 8 | En la sección "Cuenta", hacer click en "Efectivo". | "Efectivo" queda marcada. |
| 9 | Hacer click en el interruptor "Gasto compartido", escribir `Sofía` en "¿Con quién?" y `10000` en "¿Cuánto te debe?". | El resumen `data-testid="transaction-form-shared-summary"` muestra `"Sofía te va a deber $10.000,00 · Tu parte: $0,00"` y "Guardar gasto" está habilitado. |
| 10 | Hacer click en "Guardar gasto". | Aparece el aviso `"Gasto guardado"` con `"Sofía te debe $10.000,00"`. |
| 11 | Escribir `<APP>/debts?status=all` en la barra de direcciones y presionar Enter. | Aparece la fila de `"Sofía"` con `data-testid="debts-item-amount"` igual a `"$10.000,00"`. |

**Post-condición:** 1 gasto de `$10.000,00` y 1 deuda de `$10.000,00`.

---

#### CP-DEU-012 — Deuda de $10.000,01 sobre un gasto de $10.000,00 (un centavo más) muestra "No puede superar el monto del gasto ($10.000,00)" y deshabilita "Guardar gasto"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-41 · CA-3 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · CP-DEU-013 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-012-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: monto del gasto `10000` ARS. D 2: persona `"Sofía"`. D 3: monto adeudado `10000,01`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-012-001@example.com`. | El campo "Email" muestra `qa+cp-deu-012-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1. |
| 5 | Escribir `10000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2, "¿En qué?". |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3, "Revisá y guardá". |
| 7 | Hacer click en el interruptor "Gasto compartido" y escribir `Sofía` en "¿Con quién?". | El campo "¿Con quién?" muestra `Sofía`. |
| 8 | Hacer click en "¿Cuánto te debe?", escribir `10000,01` y hacer click en "¿Con quién?" para quitarle el foco. | Aparece `data-testid="transaction-form-shared-amount-error"` con el texto exacto `"No puede superar el monto del gasto ($10.000,00)"`, `data-testid="transaction-form-shared-summary"` no está en el DOM y "Guardar gasto" está deshabilitado (`disabled`). |

**Post-condición:** 0 filas en `transactions` y `debts`.

---

#### CP-DEU-013 — Directo contra create_transaction, una deuda de 10000.01 sobre un gasto de 10000.00 ARS se rechaza con "I7: la deuda no puede superar el monto del gasto" y revierte la transacción

| Campo | Contenido |
|---|---|
| Historia · criterio | US-41 · CA-5 · US-82 · CA-15 · FR-18 |
| Invariante | I7 · C4 · C6 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | API · CP-DEU-012 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-013-001@example.com` creado con PR-01. S 2: `<TOKEN>`, `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Pasos 1 y 2).
**Datos de prueba:** D 1: `p_amount = "10000.00"`, `p_occurred_on = "2026-08-15"`. D 2: `p_shared_persons = ["Sofía"]`, `p_shared_amounts = ["10000.01"]`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con cuerpo `{"p_type": "expense", "p_amount": "10000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null, "p_shared_persons": ["Sofía"], "p_shared_amounts": ["10000.01"]}`. | Responde HTTP `400` con `code = "23514"` y `message = "I7: la deuda no puede superar el monto del gasto"`. |
| 2 | Ejecutar las consultas de PR-08 (`transactions`, `ledger_entries` y `GET <SUPABASE_URL>/rest/v1/debts?select=id`). | Las tres devuelven `[]` (atomicidad C4). |

**Post-condición:** 0 filas en `transactions`, `ledger_entries` y `debts`.

---

### Sección 2 — Vínculo con el gasto original y baja lógica (US-35)

#### CP-DEU-014 — En Movimientos, las 12 cuotas de un gasto compartido y "Últimos movimientos" muestran "Compartido con Sofía", mientras que un gasto sin deuda no tiene transactions-item-shared

| Campo | Contenido |
|---|---|
| Historia · criterio | US-35 · CA-3 · FR-18 |
| Invariante | I2, I7 |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-014-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>`, `<ACCOUNT_ID>` de `"Tarjeta de crédito"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Pasos 1 y 2). S 3: gasto compartido en 12 cuotas creado con PR-04 (`create_transaction`) usando D 1. S 4: gasto simple sin deuda creado con PR-04 (`create_transaction`) usando D 2.
**Datos de prueba:** D 1 (gasto compartido): `p_type = "expense"`, `p_amount = "120000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_category_id = "<CATEGORY_ID>"`, `p_account_id = "<ACCOUNT_ID>"`, `p_installments_count = 12`, `p_occurred_on = "2026-08-15"`, `p_description = "Compra compartida"`, `p_shared_persons = ["Sofía"]`, `p_shared_amounts = ["60000.00"]`. D 2 (gasto sin deuda): `p_type = "expense"`, `p_amount = "15000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_category_id = "<CATEGORY_ID>"`, `p_account_id = "<ACCOUNT_ID>"`, `p_installments_count = 1`, `p_occurred_on = "2026-08-15"`, `p_description = "Compra individual"`, `p_shared_persons = null`, `p_shared_amounts = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-014-001@example.com`. | El campo "Email" muestra `qa+cp-deu-014-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/dashboard?period=2026-08` en la barra de direcciones y presionar Enter. | En "Últimos movimientos" del Resumen, la fila de `"Compra compartida"` tiene `data-testid="dashboard-transaction-item-shared"` con `"Compartido con Sofía"`, y la fila de `"Compra individual"` no tiene `data-testid="dashboard-transaction-item-shared"`. |
| 6 | Escribir `<APP>/transactions?period=2026-08` en la barra de direcciones y presionar Enter. | En Movimientos de agosto 2026 (`1/12`), la fila de `"Compra compartida"` muestra `data-testid="transactions-item-shared"` con `"Compartido con Sofía"`, y la fila de `"Compra individual"` no tiene `data-testid="transactions-item-shared"`. |
| 7 | Hacer click en la flecha "Mes siguiente" (`2026-09`) y repetir hasta julio 2027 (`2027-07`, cuota `12/12`). | En cada uno de los 11 meses siguientes (`2/12` a `12/12`), la fila de `"Compra compartida"` muestra `data-testid="transactions-item-shared"` con el texto `"Compartido con Sofía"`. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-015 — Eliminar el gasto vinculado oculta la deuda de /debts, deja de sumarla en "Te deben" y en el neto del Resumen, y conserva intacta su fila en debts

| Campo | Contenido |
|---|---|
| Historia · criterio | US-35 · CA-5 · US-37 · CA-7 · US-30 · CA-5 · FR-18 |
| Invariante | I7, I10 · C10 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-015-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>`, `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Comida"` obtenidos con PR-04 (Pasos 1 y 2). S 3: gasto compartido `<TX_ID>` creado con PR-04 (`create_transaction`) usando D 1.
**Datos de prueba:** D 1: `p_type = "expense"`, `p_amount = "120000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_category_id = "<CATEGORY_ID>"`, `p_account_id = "<ACCOUNT_ID>"`, `p_installments_count = 1`, `p_occurred_on = "2026-08-15"`, `p_description = "Cena"`, `p_shared_persons = ["Sofía"]`, `p_shared_amounts = ["60000.00"]`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-015-001@example.com`. | El campo "Email" muestra `qa+cp-deu-015-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/transactions?period=2026-08` en la barra de direcciones y presionar Enter. | Se abre Movimientos de agosto 2026 con la fila de `"Cena"`. |
| 6 | Hacer click en el botón de papelera (`data-testid="transactions-item-delete"`) de la fila `"Cena"`. | Se abre el diálogo `"¿Eliminar movimiento?"` con `"También deja de contar la deuda con Sofía por $60.000,00."`. |
| 7 | Hacer click en el botón "Eliminar" (`data-testid="delete-transaction-confirm"`). | Aparece el aviso `"Movimiento eliminado"` y la fila sale de Movimientos. |
| 8 | Escribir `<APP>/debts?status=all` en la barra de direcciones y presionar Enter. | La deuda de `"Sofía"` no aparece en la lista (se ve `data-testid="debts-empty"` con `"No cargaste ninguna deuda todavía."`), `"Te deben"` (`data-testid="debts-total-owed-to-me"`) muestra `"$0,00"` y el neto (`data-testid="debts-net"`) muestra `"En cero"`. |
| 9 | Hacer click en el filtro "Pendientes" (`data-testid="debts-filter-pending"`) y luego en "Saldadas" (`data-testid="debts-filter-settled"`). | En ambos filtros la lista sigue vacía (`data-testid="debts-empty"`). |
| 10 | Escribir `<APP>/dashboard?period=2026-08` en la barra de direcciones y presionar Enter. | El elemento `data-testid="dashboard-net-reimbursements"` no está en el DOM (la deuda del gasto eliminado no cuenta en el neto). |
| 11 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=person,status,settled_at,amount_text:amount::text,transaction_id`. | Devuelve 1 fila intacta con `person = "Sofía"`, `status = "pending"`, `settled_at = null`, `amount_text = "60000.00"` y `transaction_id = "<TX_ID>"`. |

**Post-condición:** 1 transacción con `deleted_at IS NOT NULL` y 1 fila en `debts` intacta (`status = "pending"`).

---

#### CP-DEU-016 — Al restaurar desde Movimientos → Eliminados un gasto cuya deuda vinculada estaba saldada, la deuda vuelve a /debts con estado saldada y la misma fecha settled_at

| Campo | Contenido |
|---|---|
| Historia · criterio | US-35 · CA-6 · FR-18 |
| Invariante | I7, I9, I10 · C10 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-016-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>`, `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Comida"` obtenidos con PR-04 (Pasos 1 y 2). S 3: gasto compartido `<TX_ID>` creado con PR-04 (`create_transaction`) usando D 1 y `<DEBT_ID>` leído con PR-08. S 4: deuda `<DEBT_ID>` saldada con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/settle_debt` con `{"p_debt_id": "<DEBT_ID>"}`) y su `<SETTLED_AT>` leído con PR-08. S 5: gasto `<TX_ID>` eliminado con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/delete_transaction` con `{"p_transaction_id": "<TX_ID>"}`).
**Datos de prueba:** D 1: `p_type = "expense"`, `p_amount = "120000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_category_id = "<CATEGORY_ID>"`, `p_account_id = "<ACCOUNT_ID>"`, `p_installments_count = 1`, `p_occurred_on = "2026-08-15"`, `p_description = "Cena"`, `p_shared_persons = ["Sofía"]`, `p_shared_amounts = ["60000.00"]`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-016-001@example.com`. | El campo "Email" muestra `qa+cp-deu-016-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/transactions?period=2026-08` en la barra de direcciones y presionar Enter. | Se abre Movimientos de agosto 2026. |
| 6 | Hacer click en la pestaña/filtro "Eliminados" de Movimientos. | Se muestra la fila del gasto eliminado `"Cena"`. |
| 7 | Hacer click en el botón "Restaurar" de la fila `"Cena"`. | El gasto se restaura (`deleted_at = null`). |
| 8 | Escribir `<APP>/debts?status=settled` en la barra de direcciones y presionar Enter. | Aparece la fila de `"Sofía"` con `data-status="settled"` y `data-testid="debts-item-status"` igual a `"Saldada el <HOY_DMY>"`. |
| 9 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id,status,settled_at`. | Devuelve 1 fila con `status = "settled"` y `settled_at` exactamente igual a `<SETTLED_AT>`. |

**Post-condición:** gasto activo (`deleted_at = null`) y deuda saldada con su `<SETTLED_AT>` original intacto.

---

### Sección 3 — Carga de deuda suelta en `/debts/new` (US-36)

#### CP-DEU-017 — Estado inicial de /debts/new y guardado de una deuda "Me deben" en ARS por $20.000,00 crea una fila pendiente con transaction_id = null en una sola llamada a create_debt

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-1, CA-2, CA-10, CA-14 · FR-18 |
| Invariante | I4, I5, I7, I9 · C6 |
| Técnica · Tipo | Tabla de decisión · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-017-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: dirección `"Me deben"` (`owed_to_me`). D 2: persona `"Juan"`. D 3: monto `20000` ARS. D 4: fecha `<HOY>`. D 5: nota vacía `""`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, abrir las herramientas de desarrollador en la pestaña "Network" (Red), escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-017-001@example.com`. | El campo "Email" muestra `qa+cp-deu-017-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Deudas" con el botón "Nueva deuda" (`data-testid="debts-new"`). |
| 6 | Hacer click en el botón "Nueva deuda" (`data-testid="debts-new"`). | Se abre `<APP>/debts/new` con: dirección "Me deben" (`data-testid="debt-form-direction-owed-to-me"`) seleccionada, "Persona" (`data-testid="debt-form-person"`) vacío y con el foco activo (`document.activeElement`), "Monto" (`data-testid="debt-form-amount"`) vacío, moneda "ARS" (`data-testid="debt-form-currency-ars"`) seleccionada, sin el campo "Tipo de cambio (ARS por US$)" en el DOM, "Fecha" (`data-testid="debt-form-date"`) igual a `<HOY>`, "Nota (opcional)" (`data-testid="debt-form-notes"`) vacía, y los botones "Guardar deuda" (`data-testid="debt-form-submit"`, deshabilitado) y "Cancelar" (`data-testid="debt-form-cancel"`). |
| 7 | Escribir `Juan` en el campo "Persona". | El campo "Persona" muestra `Juan`. |
| 8 | Hacer click en el campo "Monto" y escribir `20000`. | El campo "Monto" muestra `20000` y se habilita el botón "Guardar deuda". |
| 9 | Limpiar la pestaña "Network" y hacer click en "Guardar deuda" (`data-testid="debt-form-submit"`). | Se emite exactamente 1 llamada `POST /rest/v1/rpc/create_debt` y 0 llamadas `POST /rest/v1/debts`. Aparece el aviso `"Deuda guardada"` (`data-testid="debt-form-saved"`) y la app navega a `/debts?status=pending` mostrando la fila de `"Juan"` por `"$20.000,00"`. |
| 10 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=person,direction,status,currency,fx_rate,amount_text:amount::text,amount_ars_text:amount_ars::text,incurred_on,notes,transaction_id`. | Devuelve 1 fila con `person = "Juan"`, `direction = "owed_to_me"`, `status = "pending"`, `currency = "ARS"`, `fx_rate = null`, `amount_text = "20000.00"`, `amount_ars_text = "20000.00"`, `incurred_on = "<HOY>"`, `notes = null` y `transaction_id = null`. |

**Post-condición:** 1 deuda suelta pendiente en `debts`.

---

#### CP-DEU-018 — Guardar una deuda suelta con dirección "Debo" en ARS crea direction = "i_owe" y en la lista muestra "Le debés"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-3 · FR-18 |
| Invariante | I4, I5, I9 |
| Técnica · Tipo | Tabla de decisión · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-018-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: dirección `"Debo"` (`i_owe`). D 2: persona `"Ana"`. D 3: monto `15000` ARS. D 4: fecha `15/08/2026`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-018-001@example.com`. | El campo "Email" muestra `qa+cp-deu-018-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda". |
| 6 | Hacer click en la opción "Debo" (`data-testid="debt-form-direction-i-owe"`). | La opción "Debo" queda seleccionada. |
| 7 | Hacer click en "Persona" y escribir `Ana`. | El campo "Persona" muestra `Ana`. |
| 8 | Hacer click en "Monto" y escribir `15000`. | El campo "Monto" muestra `15000`. |
| 9 | En "Fecha" (`data-testid="debt-form-date"`), escribir `2026-08-15`. | El campo "Fecha" muestra `2026-08-15`. |
| 10 | Hacer click en "Guardar deuda" (`data-testid="debt-form-submit"`). | Aparece `"Deuda guardada"` y se abre `/debts?status=pending` mostrando la fila de `"Ana"` con `data-testid="debts-item-direction"` igual a `"Le debés"` y `data-testid="debts-item-amount"` igual a `"$15.000,00"`. |

**Post-condición:** 1 deuda suelta `i_owe` de `$15.000,00`.

---

#### CP-DEU-019 — En /debts/new, elegir "US$" con TC de referencia de 1250 precompleta "1.250,00", muestra "≈ $50.000,00" para US$40 y guarda fx_rate = 1250.0000 y amount_ars = 50000.00

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-4 · FR-18 |
| Invariante | I4, I5 · C5 |
| Técnica · Tipo | Tabla de decisión · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-019-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: TC de referencia D 1 cargado con PR-03 / PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/upsert_fx_rate` con `{"p_period": "2026-08-01", "p_ars_per_usd": "1250.0000"}`).
**Datos de prueba:** D 1: período `"2026-08-01"`, TC de referencia `"1250.0000"`. D 2: persona `"Juan"`, monto `40` USD, fecha `15/08/2026`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-019-001@example.com`. | El campo "Email" muestra `qa+cp-deu-019-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda". |
| 6 | En "Fecha" (`data-testid="debt-form-date"`), escribir `2026-08-15`. | El campo "Fecha" muestra `2026-08-15`. |
| 7 | Hacer click en la moneda "US$" (`data-testid="debt-form-currency-usd"`). | Aparece el campo "Tipo de cambio (ARS por US$)" (`data-testid="debt-form-fx-rate"`) precompletado con `1.250,00` (o `1250`). |
| 8 | Hacer click en "Persona" y escribir `Juan`. | El campo "Persona" muestra `Juan`. |
| 9 | Hacer click en "Monto" y escribir `40`. | Aparece `data-testid="debt-form-fx-ars-equivalent"` con el texto exacto `"≈ $50.000,00"`. |
| 10 | Hacer click en "Guardar deuda". | Aparece `"Deuda guardada"` y en `/debts?status=pending` se ve la fila de `"Juan"` con `US$40,00` y `"≈ $50.000,00"`. |
| 11 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=currency,amount_text:amount::text,fx_rate_text:fx_rate::text,amount_ars_text:amount_ars::text`. | Devuelve 1 fila con `currency = "USD"`, `amount_text = "40.00"`, `fx_rate_text = "1250.0000"` y `amount_ars_text = "50000.00"`. |

**Post-condición:** 1 deuda suelta en USD con `fx_rate = 1250.0000` y `amount_ars = 50000.00`.

---

#### CP-DEU-020 — En /debts/new, elegir "US$" sin TC de referencia muestra "No tenés un tipo de cambio configurado para este mes", "Ir a Ajustes" y deshabilita "Guardar deuda" con "Falta el tipo de cambio"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-5 · FR-18 |
| Invariante | I5 |
| Técnica · Tipo | Tabla de decisión · Negativo |
| Canal · Caso par | UI · CP-DEU-031 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-020-001@example.com` con contraseña `Clave123!`, creado con PR-01 (sin TC de referencia cargado).
**Datos de prueba:** D 1: persona `"Juan"`, monto `40` USD, fecha `15/08/2026`, TC vacío `""`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-020-001@example.com`. | El campo "Email" muestra `qa+cp-deu-020-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda". |
| 6 | Escribir `Juan` en "Persona", `40` en "Monto", `2026-08-15` en "Fecha" y hacer click en "US$" (`data-testid="debt-form-currency-usd"`). | El campo `data-testid="debt-form-fx-rate"` aparece vacío (`""`), se muestra `data-testid="debt-form-fx-rate-status"` con `"No tenés un tipo de cambio configurado para este mes"`, el enlace `"Ir a Ajustes"` (`data-testid="debt-form-fx-settings"`), y el botón "Guardar deuda" está deshabilitado con `"Falta el tipo de cambio"` en `data-testid="debt-form-hint"`. |
| 7 | Hacer click en "Tipo de cambio (ARS por US$)" y luego hacer click en "Persona" para quitarle el foco sin escribir nada. | Debajo del campo aparece `data-testid="debt-form-fx-rate-error"` con el texto exacto `"Falta el tipo de cambio"`. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-021 — En /debts/new, dejar "Persona" vacía "" y quitar el foco muestra "Ingresá el nombre de la persona" y deshabilita "Guardar deuda"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-6, CA-14 · FR-18 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · CP-DEU-027 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-021-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: persona vacía `""`. D 2: monto `20000` ARS.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-021-001@example.com`. | El campo "Email" muestra `qa+cp-deu-021-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre "Nueva deuda" con el foco en "Persona" (`data-testid="debt-form-person"`). |
| 6 | Sin escribir nada en "Persona", hacer click en "Monto" (`data-testid="debt-form-amount"`) y escribir `20000`. | Debajo de "Persona" aparece `data-testid="debt-form-person-error"` con el texto exacto `"Ingresá el nombre de la persona"`, y "Guardar deuda" (`data-testid="debt-form-submit"`) permanece deshabilitado (`disabled`). |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-022 — En /debts/new, un "Monto" igual a 0 muestra "El monto debe ser mayor a cero"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-6 · FR-18 |
| Invariante | I4 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · CP-DEU-029 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-022-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: persona `"Juan"`. D 2: monto `"0"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-022-001@example.com`. | El campo "Email" muestra `qa+cp-deu-022-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda". |
| 6 | Escribir `Juan` en "Persona", hacer click en "Monto", escribir `0` y hacer click en "Persona" para quitarle el foco. | Aparece `data-testid="debt-form-amount-error"` con el texto exacto `"El monto debe ser mayor a cero"`, y "Guardar deuda" queda deshabilitado. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-023 — En /debts/new, un "Monto" con más de 2 decimales ("0,001") muestra "El monto admite hasta 2 decimales"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-6 · FR-18 |
| Invariante | I4 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · CP-DEU-030 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-023-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: persona `"Juan"`. D 2: monto `"0,001"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-023-001@example.com`. | El campo "Email" muestra `qa+cp-deu-023-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda". |
| 6 | Escribir `Juan` en "Persona", hacer click en "Monto", escribir `0,001` y hacer click en "Persona" para quitarle el foco. | Aparece `data-testid="debt-form-amount-error"` con el texto exacto `"El monto admite hasta 2 decimales"`, y "Guardar deuda" queda deshabilitado. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-024 — En /debts/new con US$, Monto = 0,01 y TC = 0,5 se acepta (redondeo half-up a $0,01) y guarda amount_ars = "0.01"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-6 · FR-18 |
| Invariante | I4, I5 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-024-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: persona `"Juan"`. D 2: moneda `"US$"`. D 3: monto `"0,01"`, TC `"0,5"`, fecha `15/08/2026`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-024-001@example.com`. | El campo "Email" muestra `qa+cp-deu-024-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda". |
| 6 | Hacer click en "US$", escribir `Juan` en "Persona", `0,01` en "Monto", `0,5` en "Tipo de cambio (ARS por US$)" y `2026-08-15` en "Fecha". | Se muestra `data-testid="debt-form-fx-ars-equivalent"` con `"≈ $0,01"` y se habilita "Guardar deuda". |
| 7 | Hacer click en "Guardar deuda". | Aparece `"Deuda guardada"` y se abre `/debts?status=pending`. |
| 8 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=amount_text:amount::text,fx_rate_text:fx_rate::text,amount_ars_text:amount_ars::text`. | Devuelve 1 fila con `amount_text = "0.01"`, `fx_rate_text = "0.5000"` y `amount_ars_text = "0.01"`. |

**Post-condición:** 1 deuda en USD con `amount_ars = "0.01"`.

---

#### CP-DEU-025 — En /debts/new con US$, un "Tipo de cambio" igual a 0 muestra "El tipo de cambio debe ser mayor a cero"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-6, CA-14 · FR-18 |
| Invariante | I5 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-025-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: persona `"Juan"`, monto `40` USD, TC `"0"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-025-001@example.com`. | El campo "Email" muestra `qa+cp-deu-025-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda". |
| 6 | Hacer click en "US$", escribir `Juan` en "Persona", `40` en "Monto", escribir `0` en "Tipo de cambio (ARS por US$)" y hacer click en "Persona". | Aparece `data-testid="debt-form-fx-rate-error"` con el texto exacto `"El tipo de cambio debe ser mayor a cero"`, y "Guardar deuda" queda deshabilitado. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-026 — En /debts/new, una fecha posterior a hoy (<MAÑANA>) muestra "La fecha no puede ser futura" y deshabilita "Guardar deuda"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-7, CA-14 · FR-18 |
| Invariante | — · ADR-021 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · CP-DEU-033 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-026-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: persona `"Juan"`, monto `20000` ARS, fecha `<MAÑANA>` (`<HOY> + 1 día`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-026-001@example.com`. | El campo "Email" muestra `qa+cp-deu-026-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda". |
| 6 | Escribir `Juan` en "Persona" y `20000` en "Monto". | Se habilita "Guardar deuda". |
| 7 | Hacer click en "Fecha" (`data-testid="debt-form-date"`), escribir `<MAÑANA>` y hacer click en "Persona" para quitarle el foco. | Debajo de "Fecha" aparece `data-testid="debt-form-date-error"` con el texto exacto `"La fecha no puede ser futura"`, y el botón "Guardar deuda" queda deshabilitado (`disabled`). |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-027 — Directo contra create_debt, p_person = "" se rechaza con "Ingresá el nombre de la persona"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-8 · FR-18 |
| Invariante | C6 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-DEU-021 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-027-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: `p_direction = "owed_to_me"`, `p_person = ""`, `p_amount = "20000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con cuerpo `{"p_direction": "owed_to_me", "p_person": "", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": null, "p_incurred_on": "2026-08-15", "p_notes": null}`. | Responde HTTP `400` con `code = "23514"` y `message = "Ingresá el nombre de la persona"`. |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id`. | Devuelve `[]`. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-028 — Directo contra create_debt, p_person de 61 caracteres se rechaza con "La persona admite hasta 60 caracteres"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-8 · FR-18 |
| Invariante | C6 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-028-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: `p_person = "A123456789B123456789C123456789D123456789E123456789F123456789Z"` (61 caracteres), `p_amount = "20000.00"`, `p_currency = "ARS"`, `p_incurred_on = "2026-08-15"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con cuerpo `{"p_direction": "owed_to_me", "p_person": "A123456789B123456789C123456789D123456789E123456789F123456789Z", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": null, "p_incurred_on": "2026-08-15", "p_notes": null}`. | Responde HTTP `400` con `code = "23514"` y `message = "La persona admite hasta 60 caracteres"`. |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id`. | Devuelve `[]`. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-029 — Directo contra create_debt, p_amount = 0 se rechaza con "I4: el monto debe ser mayor a cero"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-8 · FR-18 |
| Invariante | I4 · C6 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | API · CP-DEU-022 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-029-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: `p_person = "Juan"`, `p_amount = 0`, `p_currency = "ARS"`, `p_incurred_on = "2026-08-15"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con cuerpo `{"p_direction": "owed_to_me", "p_person": "Juan", "p_amount": 0, "p_currency": "ARS", "p_fx_rate": null, "p_incurred_on": "2026-08-15", "p_notes": null}`. | Responde HTTP `400` con `code = "23514"` y `message = "I4: el monto debe ser mayor a cero"`. |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id`. | Devuelve `[]`. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-030 — Directo contra create_debt, p_amount = 1.001 (literal JSON) se rechaza con "I4: el monto admite hasta 2 decimales"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-8 · FR-18 |
| Invariante | I4 · C6 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | API · CP-DEU-023 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-030-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: `p_person = "Juan"`, `p_amount = 1.001`, `p_currency = "ARS"`, `p_incurred_on = "2026-08-15"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con cuerpo `{"p_direction": "owed_to_me", "p_person": "Juan", "p_amount": 1.001, "p_currency": "ARS", "p_fx_rate": null, "p_incurred_on": "2026-08-15", "p_notes": null}`. | Responde HTTP `400` con `code = "23514"` y `message = "I4: el monto admite hasta 2 decimales"`. |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id`. | Devuelve `[]`. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-031 — Directo contra create_debt, p_currency = "USD" con p_fx_rate = null se rechaza con "I5: fx_rate es obligatorio si y solo si la moneda es USD"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-8 · FR-18 |
| Invariante | I5 · C6 |
| Técnica · Tipo | Tabla de decisión · Negativo |
| Canal · Caso par | API · CP-DEU-020 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-031-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: `p_person = "Juan"`, `p_amount = "40.00"`, `p_currency = "USD"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con cuerpo `{"p_direction": "owed_to_me", "p_person": "Juan", "p_amount": "40.00", "p_currency": "USD", "p_fx_rate": null, "p_incurred_on": "2026-08-15", "p_notes": null}`. | Responde HTTP `400` con `code = "23514"` y `message = "I5: fx_rate es obligatorio si y solo si la moneda es USD"`. |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id`. | Devuelve `[]`. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-032 — Directo contra create_debt, p_currency = "ARS" con p_fx_rate = "1250.0000" se rechaza con "I5: fx_rate es obligatorio si y solo si la moneda es USD"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-8 · FR-18 |
| Invariante | I5 · C6 |
| Técnica · Tipo | Tabla de decisión · Negativo |
| Canal · Caso par | API · CP-DEU-017 (la UI oculta el campo TC cuando la moneda es ARS) |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-032-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: `p_person = "Juan"`, `p_amount = "20000.00"`, `p_currency = "ARS"`, `p_fx_rate = "1250.0000"`, `p_incurred_on = "2026-08-15"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con cuerpo `{"p_direction": "owed_to_me", "p_person": "Juan", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": "1250.0000", "p_incurred_on": "2026-08-15", "p_notes": null}`. | Responde HTTP `400` con `code = "23514"` y `message = "I5: fx_rate es obligatorio si y solo si la moneda es USD"`. |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id`. | Devuelve `[]`. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-033 — Directo contra create_debt, p_incurred_on = "<MAÑANA>" se rechaza con "La fecha no puede ser posterior a hoy"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-8 · FR-18 |
| Invariante | C6 · ADR-021 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | API · CP-DEU-026 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-033-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: `p_person = "Juan"`, `p_amount = "20000.00"`, `p_currency = "ARS"`, `p_incurred_on = "<MAÑANA>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con cuerpo `{"p_direction": "owed_to_me", "p_person": "Juan", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": null, "p_incurred_on": "<MAÑANA>", "p_notes": null}`. | Responde HTTP `400` con `code = "23514"` y `message = "La fecha no puede ser posterior a hoy"`. |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id`. | Devuelve `[]`. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-034 — Directo contra create_debt con el rol anon (sin Authorization) responde 42501 (permission denied)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-8 · FR-18 |
| Invariante | C7 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: ninguno (llamada sin sesión).
**Datos de prueba:** D 1: cuerpo válido `{"p_direction": "owed_to_me", "p_person": "Juan", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": null, "p_incurred_on": "2026-08-15", "p_notes": null}` enviado solo con `apikey: <ANON_KEY>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar un `POST <SUPABASE_URL>/rest/v1/rpc/create_debt` enviando únicamente `-H "apikey: <ANON_KEY>"` y `-H "Content-Type: application/json"` (sin `Authorization`), con el cuerpo de D 1. | Responde HTTP `401` o `403` con `code = "42501"` (`permission denied for function create_debt`). |

**Post-condición:** 0 filas creadas.

---

#### CP-DEU-035 — Un POST /rest/v1/debts directo con sesión autenticada responde 42501 (permission denied) y no crea filas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-9 · ADR-037 §1 · FR-18 |
| Invariante | C7 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Canal · Caso par | API · CP-DEU-017 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-035-001@example.com` creado con PR-01. S 2: `<TOKEN>` y `<USER_ID>` obtenidos con PR-04 (Paso 1).
**Datos de prueba:** D 1: `{"user_id": "<USER_ID>", "direction": "owed_to_me", "person": "Juan", "amount": "20000.00", "currency": "ARS", "status": "pending", "incurred_on": "2026-08-15"}`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/debts` con el cuerpo de D 1. | Responde HTTP `403` con `code = "42501"` (`permission denied for table debts`). |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id`. | Devuelve `[]`. |

**Post-condición:** 0 filas en `debts`.

---

### Sección 4 — Totales de deudas, listado y filtro por estado (US-37, US-38)

#### CP-DEU-036 — La tarjeta de totales suma las deudas pendientes en pesos (incluyendo USD al TC congelado), excluye las saldadas y no cambia al cambiar el filtro de estado

| Campo | Contenido |
|---|---|
| Historia · criterio | US-37 · CA-1, CA-4 · US-38 · CA-6 · FR-18 |
| Invariante | C5 |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-036-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: 4 deudas creadas con PR-04 (`create_debt`) usando D 1, D 2, D 3 y D 4, y la deuda D 4 saldada con PR-04 (`settle_debt`).
**Datos de prueba:**
- D 1: `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "60000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null` (pendiente).
- D 2: `p_direction = "owed_to_me"`, `p_person = "Juan"`, `p_amount = "40.00"`, `p_currency = "USD"`, `p_fx_rate = "1250.0000"`, `p_incurred_on = "2026-08-16"`, `p_notes = null` (pendiente, `amount_ars = 50000.00`).
- D 3: `p_direction = "i_owe"`, `p_person = "Ana"`, `p_amount = "15000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-17"`, `p_notes = null` (pendiente).
- D 4: `p_direction = "owed_to_me"`, `p_person = "Pedro"`, `p_amount = "8000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-10"`, `p_notes = null` (saldada con `settle_debt`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-036-001@example.com`. | El campo "Email" muestra `qa+cp-deu-036-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts` en la barra de direcciones y presionar Enter. | En `data-testid="debts-totals"`: `"Te deben"` (`data-testid="debts-total-owed-to-me"`) muestra `"$110.000,00"` (`60000 + 50000`, sin los `8000` saldados de Pedro), `"Debés"` (`data-testid="debts-total-i-owe"`) muestra `"$15.000,00"`, el neto (`data-testid="debts-net"`) muestra `"A tu favor $95.000,00"` y `data-testid="debts-totals-note"` muestra `"Solo suman las deudas pendientes."`. En la lista, la fila de `"Juan"` muestra `US$40,00` (`data-testid="debts-item-amount"`) y `"≈ $50.000,00"` (`data-testid="debts-item-amount-ars"`), mientras que las filas en ARS no tienen `data-testid="debts-item-amount-ars"`. |
| 6 | Hacer click en el filtro "Saldadas" (`data-testid="debts-filter-settled"`). | La tarjeta de totales sigue mostrando `"$110.000,00"`, `"$15.000,00"` y `"A tu favor $95.000,00"`. |
| 7 | Hacer click en el filtro "Todas" (`data-testid="debts-filter-all"`). | La tarjeta de totales sigue mostrando `"$110.000,00"`, `"$15.000,00"` y `"A tu favor $95.000,00"`. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-037 — Cuando "Debés" supera a "Te deben", el neto muestra "En contra $5.000,00"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-37 · CA-2 · FR-18 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-037-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: 2 deudas pendientes creadas con PR-04 (`create_debt`) usando D 1 y D 2.
**Datos de prueba:**
- D 1: `p_direction = "i_owe"`, `p_person = "Ana"`, `p_amount = "15000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.
- D 2: `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "10000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-037-001@example.com`. | El campo "Email" muestra `qa+cp-deu-037-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts` en la barra de direcciones y presionar Enter. | `"Te deben"` muestra `"$10.000,00"`, `"Debés"` muestra `"$15.000,00"` y `data-testid="debts-net"` muestra el texto exacto `"En contra $5.000,00"`. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-038 — Cambiar el TC de referencia del mes a 1400 no modifica "Te deben" de una deuda en USD ya creada a TC 1250 (C5)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-37 · CA-6 · FR-18 |
| Invariante | C5 · ADR-002 |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-038-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: TC de referencia D 1 cargado con PR-04 (`upsert_fx_rate`). S 4: deuda en USD D 2 creada con PR-04 (`create_debt`). S 5: TC de referencia de agosto actualizado con PR-04 (`upsert_fx_rate`) usando D 3.
**Datos de prueba:**
- D 1: `p_period = "2026-08-01"`, `p_ars_per_usd = "1250.0000"`.
- D 2: `p_direction = "owed_to_me"`, `p_person = "Juan"`, `p_amount = "40.00"`, `p_currency = "USD"`, `p_fx_rate = "1250.0000"`, `p_incurred_on = "2026-08-16"`, `p_notes = null` (`amount_ars = 50000.00`).
- D 3: `p_period = "2026-08-01"`, `p_ars_per_usd = "1400.0000"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-038-001@example.com`. | El campo "Email" muestra `qa+cp-deu-038-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts` en la barra de direcciones y presionar Enter. | `"Te deben"` (`data-testid="debts-total-owed-to-me"`) muestra `"$50.000,00"` (no `"$56.000,00"`), el neto muestra `"A tu favor $50.000,00"` y la fila de `"Juan"` muestra `"≈ $50.000,00"`. |

**Post-condición:** sin cambios en `debts`.

---

#### CP-DEU-039 — /debts sin parámetros muestra "Pendientes" seleccionado y solo pendientes; tocar "Saldadas" y "Todas" actualiza ?status= y filtra la lista

| Campo | Contenido |
|---|---|
| Historia · criterio | US-38 · CA-1, CA-2, CA-6, CA-11 · FR-18 |
| Invariante | C11 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-039-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: deudas D 1 y D 2 creadas con PR-04 (`create_debt`), y D 2 saldada con PR-04 (`settle_debt`).
**Datos de prueba:**
- D 1 (pendiente): `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "60000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = "Almuerzo"`.
- D 2 (saldada): `p_direction = "i_owe"`, `p_person = "Pedro"`, `p_amount = "8000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-10"`, `p_notes = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-039-001@example.com`. | El campo "Email" muestra `qa+cp-deu-039-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts` en la barra de direcciones y presionar Enter. | Se abre la pantalla con título `"Deudas"` (`data-testid="debts-title"`), botón `"Nueva deuda"` (`data-testid="debts-new"`), el filtro `"Pendientes"` (`data-testid="debts-filter-pending"`) con `aria-checked="true"`, y en `data-testid="debts-list"` únicamente la fila de `"Sofía"` (`data-status="pending"`, `data-testid="debts-item-direction"` = `"Te debe"`, `data-testid="debts-item-notes"` = `"Almuerzo"`, `data-testid="debts-item-status"` = `"Pendiente"`, botón `"Marcar saldada"`). |
| 6 | Hacer click en el filtro "Saldadas" (`data-testid="debts-filter-settled"`). | La URL cambia a `<APP>/debts?status=settled`, `"Saldadas"` tiene `aria-checked="true"` y la lista muestra únicamente la fila de `"Pedro"` (`data-status="settled"`, `data-testid="debts-item-direction"` = `"Le debés"`, botón `"Volver a pendiente"`). |
| 7 | Hacer click en el filtro "Todas" (`data-testid="debts-filter-all"`). | La URL cambia a `<APP>/debts?status=all`, `"Todas"` tiene `aria-checked="true"` y la lista muestra las 2 filas (`"Sofía"` y `"Pedro"`). |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-040 — Abrir /debts?status=xyz se comporta como "Pendientes" y al tocar "Saldadas" reemplaza el parámetro por ?status=settled

| Campo | Contenido |
|---|---|
| Historia · criterio | US-38 · CA-4 · FR-18 |
| Invariante | C11 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · — (parámetro de URL del router cliente) |
| Prioridad · Camino feliz · Automatizable | Baja · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-040-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: deudas D 1 y D 2 creadas con PR-04 (`create_debt`), y D 2 saldada con PR-04 (`settle_debt`).
**Datos de prueba:**
- D 1 (pendiente): `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "60000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.
- D 2 (saldada): `p_direction = "owed_to_me"`, `p_person = "Pedro"`, `p_amount = "8000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-10"`, `p_notes = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-040-001@example.com`. | El campo "Email" muestra `qa+cp-deu-040-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts?status=xyz` en la barra de direcciones y presionar Enter. | `"Pendientes"` (`data-testid="debts-filter-pending"`) tiene `aria-checked="true"` y la lista muestra solo la fila pendiente de `"Sofía"`. |
| 6 | Hacer click en el filtro "Saldadas" (`data-testid="debts-filter-settled"`). | La URL pasa a `<APP>/debts?status=settled` y se muestra solo la fila de `"Pedro"`. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-041 — En /debts con filtro "Pendientes", las deudas se ordenan por fecha incurred_on descendente y, a igual fecha, por created_at descendente

| Campo | Contenido |
|---|---|
| Historia · criterio | US-38 · CA-5 (parte 1) · FR-18 |
| Invariante | — |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-041-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: 3 deudas pendientes creadas secuencialmente (esperando 2 segundos entre cada llamada) con PR-04 (`create_debt`) usando D 1, D 2 y D 3.
**Datos de prueba:**
- D 1 (creada 1.ª): `p_direction = "owed_to_me"`, `p_person = "Ana"`, `p_amount = "10000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-10-01"`, `p_notes = null`.
- D 2 (creada 2.ª): `p_direction = "owed_to_me"`, `p_person = "Beto"`, `p_amount = "20000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.
- D 3 (creada 3.ª, 2 s después de Ana): `p_direction = "owed_to_me"`, `p_person = "Carla"`, `p_amount = "30000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-10-01"`, `p_notes = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-041-001@example.com`. | El campo "Email" muestra `qa+cp-deu-041-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts` en la barra de direcciones y presionar Enter. | En "Pendientes", las 3 filas aparecen de arriba hacia abajo en el orden exacto: 1.º `"Carla"` (`01/10/2026`, creada más reciente), 2.º `"Ana"` (`01/10/2026`, creada antes), 3.º `"Beto"` (`15/08/2026`). |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-042 — Estado vacío en "Pendientes" muestra "No tenés deudas pendientes." y el botón "Cargar una deuda" que navega a /debts/new

| Campo | Contenido |
|---|---|
| Historia · criterio | US-38 · CA-7, CA-11 · FR-18 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-042-001@example.com` con contraseña `Clave123!`, creado con PR-01 (sin deudas).
**Datos de prueba:** D 1: 0 deudas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-042-001@example.com`. | El campo "Email" muestra `qa+cp-deu-042-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts` en la barra de direcciones y presionar Enter. | Se muestra `data-testid="debts-empty"` con el texto exacto `"No tenés deudas pendientes."` y el botón `"Cargar una deuda"` (`data-testid="debts-empty-new"`). |
| 6 | Hacer click en el botón "Cargar una deuda" (`data-testid="debts-empty-new"`). | Navega a `<APP>/debts/new`. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-043 — En la UI, un segundo usuario autenticado no ve las deudas de otro usuario ni en la lista ni en los totales (C7)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-38 · CA-9 · FR-18 |
| Invariante | C7 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Canal · Caso par | UI · CP-DEU-044 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: PR-05 con los usuarios `qa+cp-deu-043-a@example.com` (Usuario A) y `qa+cp-deu-043-b@example.com` (Usuario B), obteniendo `<TOKEN_A>` y `<TOKEN_B>`. S 2: deuda D 1 creada para el Usuario A con PR-04 (`create_debt` usando `<TOKEN_A>`).
**Datos de prueba:** D 1 (deuda del Usuario A): `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "60000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`. D 2: Usuario B sin deudas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la ventana de incógnito donde inició sesión el Usuario B (`qa+cp-deu-043-b@example.com`), escribir `<APP>/debts?status=all` en la barra de direcciones y presionar Enter. | `"Te deben"` muestra `"$0,00"`, `"Debés"` muestra `"$0,00"`, el neto muestra `"En cero"` y se ve el estado vacío `"No cargaste ninguna deuda todavía."` (0 filas del Usuario A visibles). |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-044 — Directo por API, un segundo usuario autenticado recibe [] al consultar GET /rest/v1/debts (C7)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-38 · CA-9 (parte 1) · FR-18 |
| Invariante | C7 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Canal · Caso par | API · CP-DEU-043 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: PR-05 con los usuarios `qa+cp-deu-044-a@example.com` (Usuario A) y `qa+cp-deu-044-b@example.com` (Usuario B), obteniendo `<TOKEN_A>` y `<TOKEN_B>`. S 2: deuda D 1 (`<DEBT_A_ID>`) creada para el Usuario A con PR-04 (`create_debt` usando `<TOKEN_A>`).
**Datos de prueba:** D 1 (deuda del Usuario A): `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "60000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-08 (usando `<TOKEN_B>`) un `GET <SUPABASE_URL>/rest/v1/debts?select=*` y un `GET <SUPABASE_URL>/rest/v1/debts?id=eq.<DEBT_A_ID>&select=*`. | Ambas consultas responden HTTP `200` con arreglo vacío `[]`. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-045 — Directo por API, un GET /rest/v1/debts sin sesión (con el rol anon) responde 42501 (permission denied)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-38 · CA-9 (parte 2) · C7 · FR-18 |
| Invariante | C7 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: ninguno (consulta sin sesión).
**Datos de prueba:** D 1: solicitud `GET <SUPABASE_URL>/rest/v1/debts?select=*` enviada solo con `apikey: <ANON_KEY>` (sin encabezado `Authorization`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar un `GET <SUPABASE_URL>/rest/v1/debts?select=*` enviando únicamente el encabezado `-H "apikey: <ANON_KEY>"` (sin `Authorization`). | Responde HTTP `401` o `403` con `code = "42501"` (`permission denied for table debts`). |

**Post-condición:** sin cambios en base de datos.

---

### Sección 5 — Saldar, volver a pendiente y filtrar por dirección (US-39, US-40, US-79)

#### CP-DEU-046 — En "Pendientes", tocar "Marcar saldada" llama una sola vez a settle_debt, saca la fila de la lista, muestra "Deuda con Sofía saldada" con "Deshacer", actualiza los totales y fija settled_at

| Campo | Contenido |
|---|---|
| Historia · criterio | US-39 · CA-1, CA-8 · US-37 · CA-5 · US-30 · CA-2 · FR-18 |
| Invariante | I9 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-046-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: deuda D 1 creada con PR-04 (`create_debt`).
**Datos de prueba:** D 1: `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "60000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, abrir las herramientas de desarrollador en la pestaña "Network" (Red), escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-046-001@example.com`. | El campo "Email" muestra `qa+cp-deu-046-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts` en la barra de direcciones y presionar Enter. | Se muestra `"Te deben"` = `"$60.000,00"`, `"A tu favor $60.000,00"` y la fila de `"Sofía"` con el botón `"Marcar saldada"` (`data-testid="debts-item-settle"`). |
| 6 | Limpiar la pestaña "Network" y hacer click en el botón "Marcar saldada" (`data-testid="debts-item-settle"`) de la fila de `"Sofía"`. | Se emite exactamente 1 llamada `POST /rest/v1/rpc/settle_debt`. La fila de `"Sofía"` sale de la lista de "Pendientes", aparece el estado vacío `"No tenés deudas pendientes."`, aparece el aviso `data-testid="debts-settled"` con el texto exacto `"Deuda con Sofía saldada"` y el botón `"Deshacer"` (`data-testid="debts-settled-undo"`), y en la tarjeta de totales `"Te deben"` baja en el acto a `"$0,00"` y el neto pasa a `"En cero"`. |
| 7 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=status,settled_at`. | Devuelve 1 fila con `status = "settled"` y `settled_at` no nulo (I9). |

**Post-condición:** 1 deuda con `status = "settled"` y `settled_at IS NOT NULL`.

---

#### CP-DEU-047 — Tocar "Deshacer" dentro de los 5 segundos tras saldar llama a reopen_debt, devuelve la fila a "Pendientes" con settled_at = null y restaura los totales

| Campo | Contenido |
|---|---|
| Historia · criterio | US-39 · CA-4 (parte 1) · FR-18 |
| Invariante | I9 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-047-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: deuda D 1 creada con PR-04 (`create_debt`).
**Datos de prueba:** D 1: `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "60000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-047-001@example.com`. | El campo "Email" muestra `qa+cp-deu-047-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts` en la barra de direcciones y presionar Enter. | Se ve la fila de `"Sofía"` en "Pendientes". |
| 6 | Hacer click en "Marcar saldada" (`data-testid="debts-item-settle"`). | Aparece el aviso `data-testid="debts-settled"` (`"Deuda con Sofía saldada"`) con el botón `"Deshacer"` (`data-testid="debts-settled-undo"`). |
| 7 | Antes de que pasen 5 segundos, hacer click en el botón "Deshacer" (`data-testid="debts-settled-undo"`). | Se llama a `reopen_debt`, el aviso desaparece, la fila de `"Sofía"` vuelve a aparecer en "Pendientes" y `"Te deben"` vuelve a `"$60.000,00"`. |
| 8 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=status,settled_at`. | Devuelve 1 fila con `status = "pending"` y `settled_at = null`. |

**Post-condición:** 1 deuda con `status = "pending"` y `settled_at = null`.

---

#### CP-DEU-048 — Si la deuda ya había sido saldada desde otra pestaña, tocar "Marcar saldada" muestra "No se pudo actualizar la deuda" con "La deuda ya está saldada" y actualiza la lista

| Campo | Contenido |
|---|---|
| Historia · criterio | US-39 · CA-5 · FR-18 |
| Invariante | I9 |
| Técnica · Tipo | Transición de estados · Negativo |
| Canal · Caso par | UI · CP-DEU-049 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-048-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: deuda D 1 creada con PR-04 (`create_debt`).
**Datos de prueba:** D 1: `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "60000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito (Pestaña 1), escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-048-001@example.com`. | El campo "Email" muestra `qa+cp-deu-048-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | En la Pestaña 1, escribir `<APP>/debts?status=all` en la barra de direcciones y presionar Enter. | En la Pestaña 1 se ve la fila de `"Sofía"` pendiente con el botón `"Marcar saldada"`. |
| 6 | Abrir una segunda pestaña (Pestaña 2) en la misma ventana de incógnito, escribir `<APP>/debts?status=all` y presionar Enter. | En la Pestaña 2 también se ve la fila de `"Sofía"` pendiente con el botón `"Marcar saldada"`. |
| 7 | En la Pestaña 2, hacer click en "Marcar saldada" (`data-testid="debts-item-settle"`). | En la Pestaña 2 la deuda de `"Sofía"` pasa a saldada. |
| 8 | Volver a la Pestaña 1 (sin recargarla) y hacer click en el botón "Marcar saldada" (`data-testid="debts-item-settle"`). | En la Pestaña 1 aparece el aviso de error `data-testid="debts-update-error"` con `"No se pudo actualizar la deuda"` y el motivo `"La deuda ya está saldada"`, y la lista se refresca mostrando la fila de `"Sofía"` como saldada (`data-status="settled"`). |

**Post-condición:** 1 deuda en estado `settled`.

---

#### CP-DEU-049 — Directo contra settle_debt, saldar una deuda que ya está settled se rechaza con "La deuda ya está saldada"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-39 · CA-6 (parte 1) · FR-18 |
| Invariante | I9 · C6 |
| Técnica · Tipo | Transición de estados · Negativo |
| Canal · Caso par | API · CP-DEU-048 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-049-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: deuda `<DEBT_ID>` creada con PR-04 (`create_debt`) usando D 1 y saldada con PR-04 (`settle_debt`).
**Datos de prueba:** D 1: `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "60000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`. D 2: `p_debt_id = "<DEBT_ID>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/settle_debt` con cuerpo `{"p_debt_id": "<DEBT_ID>"}`. | Responde HTTP `400` con `code = "23514"` y `message = "La deuda ya está saldada"`. |

**Post-condición:** la deuda sigue `settled` con su `settled_at` original.

---

#### CP-DEU-050 — Directo contra settle_debt, el Usuario B no puede saldar una deuda del Usuario A y recibe "La deuda no existe"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-39 · CA-6 (parte 2) · ADR-037 §3 · FR-18 |
| Invariante | C6 · C7 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Canal · Caso par | API · CP-DEU-043 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: PR-05 con los usuarios `qa+cp-deu-050-a@example.com` (Usuario A) y `qa+cp-deu-050-b@example.com` (Usuario B), obteniendo `<TOKEN_A>` y `<TOKEN_B>`. S 2: deuda `<DEBT_A_ID>` creada para el Usuario A con PR-04 (`create_debt` usando `<TOKEN_A>`) con D 1.
**Datos de prueba:** D 1 (deuda del Usuario A): `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "60000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`. D 2: `p_debt_id = "<DEBT_A_ID>"` invocado con `<TOKEN_B>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 (usando `<TOKEN_B>`) un `POST <SUPABASE_URL>/rest/v1/rpc/settle_debt` con cuerpo `{"p_debt_id": "<DEBT_A_ID>"}`. | Responde HTTP `400` con `code = "23514"` y `message = "La deuda no existe"`. |
| 2 | Ejecutar con PR-08 (usando `<TOKEN_A>`) un `GET <SUPABASE_URL>/rest/v1/debts?id=eq.<DEBT_A_ID>&select=status,settled_at`. | Devuelve `status = "pending"` y `settled_at = null` (sin cambios). |

**Post-condición:** la deuda del Usuario A permanece `pending`.

---

#### CP-DEU-051 — Un PATCH /rest/v1/debts directo con sesión autenticada responde 42501 (permission denied) y no modifica la fila

| Campo | Contenido |
|---|---|
| Historia · criterio | US-39 · CA-7 · ADR-037 §1 · FR-18 |
| Invariante | C7 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Canal · Caso par | API · CP-DEU-046 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-051-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: deuda `<DEBT_ID>` pendiente creada con PR-04 (`create_debt`) usando D 1.
**Datos de prueba:** D 1: `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "60000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`. D 2: `PATCH /rest/v1/debts?id=eq.<DEBT_ID>` con `{"status": "settled"}`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `PATCH <SUPABASE_URL>/rest/v1/debts?id=eq.<DEBT_ID>` con cuerpo `{"status": "settled"}`. | Responde HTTP `403` con `code = "42501"` (`permission denied for table debts`). |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?id=eq.<DEBT_ID>&select=status`. | Devuelve 1 fila con `status = "pending"`. |

**Post-condición:** la fila `<DEBT_ID>` sigue intacta y `pending`.

---

#### CP-DEU-052 — En "Saldadas", tocar "Volver a pendiente" llama una sola vez a reopen_debt, saca la fila de "Saldadas", muestra "La deuda con Sofía volvió a pendiente" y conserva todos sus campos con settled_at = null

| Campo | Contenido |
|---|---|
| Historia · criterio | US-40 · CA-1, CA-2 · FR-18 |
| Invariante | I9 · C10 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-052-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: deuda `<DEBT_ID>` creada con PR-04 (`create_debt`) usando D 1 y saldada con PR-04 (`settle_debt`).
**Datos de prueba:** D 1: `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "40.00"`, `p_currency = "USD"`, `p_fx_rate = "1250.0000"`, `p_incurred_on = "2026-08-15"`, `p_notes = "Viaje"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, abrir la pestaña "Network" (Red), escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-052-001@example.com`. | El campo "Email" muestra `qa+cp-deu-052-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts?status=settled` en la barra de direcciones y presionar Enter. | Se ve la fila de `"Sofía"` con el botón `"Volver a pendiente"` (`data-testid="debts-item-reopen"`). |
| 6 | Limpiar la pestaña "Network" y hacer click en "Volver a pendiente" (`data-testid="debts-item-reopen"`). | Se emite exactamente 1 llamada `POST /rest/v1/rpc/reopen_debt`. La fila sale de "Saldadas", aparece `"Todavía no saldaste ninguna deuda."` y se muestra `data-testid="debts-reopened"` con el texto exacto `"La deuda con Sofía volvió a pendiente"`. |
| 7 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id,person,direction,amount_text:amount::text,currency,fx_rate_text:fx_rate::text,incurred_on,notes,status,settled_at`. | Devuelve exactamente 1 fila con el mismo `id = "<DEBT_ID>"`, `person = "Sofía"`, `direction = "owed_to_me"`, `amount_text = "40.00"`, `currency = "USD"`, `fx_rate_text = "1250.0000"`, `incurred_on = "2026-08-15"`, `notes = "Viaje"`, `status = "pending"` y `settled_at = null`. |

**Post-condición:** la misma fila vuelve a `pending` con `settled_at = null`.

---

#### CP-DEU-053 — Saldar y volver a pendiente la misma deuda tres veces seguidas termina pendiente, con settled_at = null y sin filas nuevas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-40 · CA-5 · FR-18 |
| Invariante | I9 |
| Técnica · Tipo | Transición de estados · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-053-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: deuda `<DEBT_ID>` pendiente creada con PR-04 (`create_debt`) usando D 1.
**Datos de prueba:** D 1: `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "60000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-053-001@example.com`. | El campo "Email" muestra `qa+cp-deu-053-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts?status=all` en la barra de direcciones y presionar Enter. | Se ve 1 sola fila (`"Sofía"`, pendiente). |
| 6 | Hacer click en "Marcar saldada" (`data-testid="debts-item-settle"`). | La fila pasa a `"Saldada el <HOY_DMY>"` con el botón `"Volver a pendiente"`. |
| 7 | Hacer click en "Volver a pendiente" (`data-testid="debts-item-reopen"`). | La fila vuelve a `"Pendiente"` con el botón `"Marcar saldada"`. |
| 8 | Hacer click en "Marcar saldada" (`data-testid="debts-item-settle"`). | La fila pasa a `"Saldada el <HOY_DMY>"` con el botón `"Volver a pendiente"`. |
| 9 | Hacer click en "Volver a pendiente" (`data-testid="debts-item-reopen"`). | La fila vuelve a `"Pendiente"` con el botón `"Marcar saldada"`. |
| 10 | Hacer click en "Marcar saldada" (`data-testid="debts-item-settle"`). | La fila pasa a `"Saldada el <HOY_DMY>"` con el botón `"Volver a pendiente"`. |
| 11 | Hacer click en "Volver a pendiente" (`data-testid="debts-item-reopen"`). | En `/debts?status=all` sigue habiendo exactamente 1 fila (`data-debt-id="<DEBT_ID>"`), con estado `"Pendiente"` y `"Te deben"` = `"$60.000,00"`. |
| 12 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id,status,settled_at`. | Devuelve exactamente 1 fila con `id = "<DEBT_ID>"`, `status = "pending"` y `settled_at = null`. |

**Post-condición:** 1 única fila en `debts` con `status = "pending"` y `settled_at = null`.

---

#### CP-DEU-054 — El filtro por dirección en /debts muestra "Todas" por defecto, filtra por "Te deben" (?direction=owed_to_me) y "Debés" (?direction=i_owe), no altera los totales y no vuelve a pedir datos a la red

| Campo | Contenido |
|---|---|
| Historia · criterio | US-79 · CA-1, CA-2, CA-7, CA-8, CA-9 · FR-18 |
| Invariante | C11 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-054-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: deudas pendientes D 1 y D 2 creadas con PR-04 (`create_debt`).
**Datos de prueba:**
- D 1: `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "60000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.
- D 2: `p_direction = "i_owe"`, `p_person = "Ana"`, `p_amount = "15000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, abrir la pestaña "Network" (Red), escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-054-001@example.com`. | El campo "Email" muestra `qa+cp-deu-054-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts` en la barra de direcciones y presionar Enter. | Debajo del filtro de estado aparece `data-testid="debts-direction-filter"` (`role="radiogroup"`) con `"Todas"` (`data-testid="debts-direction-filter-all"`, `aria-checked="true"`), `"Te deben"` (`data-testid="debts-direction-filter-owed-to-me"`) y `"Debés"` (`data-testid="debts-direction-filter-i-owe"`). Se ven las 2 filas (`"Sofía"` y `"Ana"`). |
| 6 | Limpiar la pestaña "Network" y hacer click en "Te deben" (`data-testid="debts-direction-filter-owed-to-me"`). | La URL cambia a `<APP>/debts?direction=owed_to_me`, `"Te deben"` tiene `aria-checked="true"`, la lista muestra solo a `"Sofía"`, la tarjeta de totales sigue mostrando `"Te deben"` = `"$60.000,00"`, `"Debés"` = `"$15.000,00"` y `"A tu favor $45.000,00"`, y se registran 0 llamadas a `/rest/v1/debts`. |
| 7 | Hacer click en "Debés" (`data-testid="debts-direction-filter-i-owe"`). | La URL cambia a `<APP>/debts?direction=i_owe`, `"Debés"` tiene `aria-checked="true"`, la lista muestra solo a `"Ana"`, la tarjeta de totales no cambia, y se registran 0 llamadas a `/rest/v1/debts`. |

**Post-condición:** sin cambios en base de datos.

---

### Sección 6 — Compartir un gasto con varias personas (US-82)

#### CP-DEU-055 — Encender "Gasto compartido" muestra 1 fila sin "Quitar", "Agregar persona" suma la fila 2 con foco en "¿Con quién?" y "Quitar" en ambas, y guardar un gasto de $120.000,00 con "Sofía" 40000 y "Juan" 40000 crea 2 deudas en 1 llamada a create_transaction con aviso "Juan y Sofía te deben $80.000,00" y etiqueta "Compartido con Juan y Sofía"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-82 · CA-1, CA-2, CA-10, CA-22 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-055-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: gasto `120000` ARS, `"Otros"`, `"Efectivo"`, fecha `15/08/2026`. D 2: fila 1 `"Sofía"` (`40000`), fila 2 `"Juan"` (`40000`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, abrir las herramientas de desarrollador en la pestaña "Network" (Red), escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-055-001@example.com`. | El campo "Email" muestra `qa+cp-deu-055-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1 de 3. |
| 5 | Escribir `120000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2 de 3. |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3 de 3. |
| 7 | En la sección "Fecha", hacer click en "Otra" y escribir `15/08/2026` en `data-testid="transaction-form-date"`. | El campo de fecha muestra `15/08/2026`. |
| 8 | Hacer click en el interruptor "Gasto compartido" (`data-testid="transaction-form-shared-toggle"`). | Aparece 1 sola fila (`data-testid="transaction-form-shared-row"`, `data-index="1"`) vacía, sin botón "Quitar" (`data-testid="transaction-form-shared-remove"` no existe en el DOM), y debajo se ven los botones `"Agregar persona"` (`data-testid="transaction-form-shared-add"`) y `"Dividir en partes iguales"` (`data-testid="transaction-form-shared-split"`). |
| 9 | En la fila 1 (`data-index="1"`), escribir `Sofía` en "¿Con quién?" (`data-testid="transaction-form-shared-person"`) y `40000` en "¿Cuánto te debe?" (`data-testid="transaction-form-shared-amount"`). | La fila 1 muestra `Sofía` y `40000`. |
| 10 | Hacer click en el botón "Agregar persona" (`data-testid="transaction-form-shared-add"`). | Se agrega la fila 2 (`data-testid="transaction-form-shared-row"`, `data-index="2"`) vacía al final, el foco del teclado queda en el campo "¿Con quién?" de la fila 2, y aparece el botón "Quitar" (`data-testid="transaction-form-shared-remove"`) en las dos filas (`aria-label="Quitar a Sofía"` en la fila 1 y `aria-label="Quitar persona 2"` en la fila 2). |
| 11 | En la fila 2 (`data-index="2"`), escribir `Juan` en "¿Con quién?" y `40000` en "¿Cuánto te debe?". | El resumen `data-testid="transaction-form-shared-summary"` muestra el texto exacto `"Te van a deber $80.000,00 entre 2 personas · Tu parte: $40.000,00"`, y el botón "Quitar" de la fila 2 tiene `aria-label="Quitar a Juan"`. |
| 12 | Hacer click en el botón "Guardar gasto" (`data-testid="transaction-form-submit"`). | En la pestaña "Network" se registra exactamente 1 `POST /rest/v1/rpc/create_transaction` con `"p_shared_persons": ["Sofía", "Juan"]` y `"p_shared_amounts": ["40000.00", "40000.00"]` y 0 peticiones a `/rest/v1/debts`. Aparece el aviso `"Gasto guardado"` (`data-testid="transaction-form-saved"`) con la descripción exacta `"Juan y Sofía te deben $80.000,00"`. |
| 13 | Escribir `<APP>/transactions?period=2026-08` en la barra de direcciones y presionar Enter. | La fila del gasto muestra la etiqueta `"Compartido con Juan y Sofía"` (`data-testid="transactions-item-shared"`). |
| 14 | Escribir `<APP>/dashboard?period=2026-08` en la barra de direcciones y presionar Enter. | En "Últimos movimientos", la fila del gasto muestra `"Compartido con Juan y Sofía"` (`data-testid="dashboard-transaction-item-shared"`). |
| 15 | Consultar `GET <SUPABASE_URL>/rest/v1/debts?select=person,direction,status,amount_text:amount::text,transaction_id&order=person.asc` con PR-08 usando `<TOKEN>`. | Devuelve HTTP `200` con 2 filas con el mismo `transaction_id` no nulo: `{"person": "Juan", "direction": "owed_to_me", "status": "pending", "amount_text": "40000.00"}` y `{"person": "Sofía", "direction": "owed_to_me", "status": "pending", "amount_text": "40000.00"}`. |

**Post-condición:** 1 transacción y 2 deudas vinculadas (`Juan` y `Sofía`) en `debts`.

---

#### CP-DEU-056 — Con 10 filas, "Agregar persona" se deshabilita, se ve "Podés compartir un gasto con hasta 10 personas" y al guardar crea 10 deudas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-82 · CA-5, CA-22 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-056-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: gasto `110000` ARS, `"Otros"`, `"Efectivo"`, fecha `15/08/2026`. D 2: 10 filas con nombres `"Persona 01"`, `"Persona 02"`, `"Persona 03"`, `"Persona 04"`, `"Persona 05"`, `"Persona 06"`, `"Persona 07"`, `"Persona 08"`, `"Persona 09"`, `"Persona 10"` y monto `10000` en cada una.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-056-001@example.com`. | El campo "Email" muestra `qa+cp-deu-056-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1 de 3. |
| 5 | Escribir `110000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2 de 3. |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3 de 3. |
| 7 | En la sección "Fecha", hacer click en "Otra" y escribir `15/08/2026` en `data-testid="transaction-form-date"`. | El campo de fecha muestra `15/08/2026`. |
| 8 | Hacer click en el interruptor "Gasto compartido" (`data-testid="transaction-form-shared-toggle"`). | Aparece la fila 1 (`data-index="1"`). |
| 9 | Completar la fila 1 con `Persona 01` y `10000`, y hacer click 9 veces en "Agregar persona" (`data-testid="transaction-form-shared-add"`), completando las filas 2 a 10 con `Persona 02` a `Persona 10` y `10000` en cada una. | Hay 10 filas (`data-index="1"` a `"10"`), el botón "Agregar persona" (`data-testid="transaction-form-shared-add"`) está deshabilitado (`disabled`), y aparece el texto exacto `"Podés compartir un gasto con hasta 10 personas"` (`data-testid="transaction-form-shared-limit"`). |
| 10 | Hacer click en el botón "Guardar gasto" (`data-testid="transaction-form-submit"`). | Aparece el aviso `"Gasto guardado"` (`data-testid="transaction-form-saved"`) con la descripción exacta `"Persona 01, Persona 02, Persona 03, Persona 04, Persona 05, Persona 06, Persona 07, Persona 08, Persona 09 y Persona 10 te deben $100.000,00"`. |
| 11 | Consultar `GET <SUPABASE_URL>/rest/v1/debts?select=person,amount_text:amount::text&order=person.asc` con PR-08 usando `<TOKEN>`. | Devuelve HTTP `200` con 10 filas (`Persona 01` a `Persona 10`), cada una con `"amount_text": "10000.00"`. |

**Post-condición:** 1 transacción y 10 deudas vinculadas en `debts`.

---

#### CP-DEU-057 — create_transaction rechaza gasto de 120000 con montos 60000 y 60000.01 con HTTP 400 (23514) y mensaje "I7: la suma de las deudas no puede superar el monto del gasto"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-82 · CA-14 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-057-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1); `<ACCOUNT_ID>` y `<CATEGORY_ID>` obtenidos con PR-04 (Paso 2).
**Datos de prueba:** D 1: `"p_amount": 120000`, `"p_shared_persons": ["Sofía", "Juan"]`, `"p_shared_amounts": [60000, 60000.01]`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con PR-04 enviando `{"p_type": "expense", "p_amount": 120000, "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null, "p_shared_persons": ["Sofía", "Juan"], "p_shared_amounts": [60000, 60000.01]}`. | Devuelve HTTP `400`, `"code": "23514"` y `"message": "I7: la suma de las deudas no puede superar el monto del gasto"`. |
| 2 | Consultar `GET <SUPABASE_URL>/rest/v1/transactions?select=id`, `GET <SUPABASE_URL>/rest/v1/ledger_entries?select=id` y `GET <SUPABASE_URL>/rest/v1/debts?select=id` con PR-08 usando `<TOKEN>`. | Las tres consultas devuelven `[]`. |

**Post-condición:** 0 filas creadas.

---

### Sección 7 — Gasto neto de reembolsos y deudas sueltas en el balance del Resumen (US-30, US-83)

#### CP-DEU-058 — Gasto de $120.000,00 en 1 cuota con deuda vinculada pendiente de $60.000,00 muestra Gastado $120.000,00 (bruto), Neto de reembolsos $60.000,00 y "Ver deudas" navega a /debts

| Campo | Contenido |
|---|---|
| Historia · criterio | US-30 · CA-1, CA-9, CA-10 · FR-19 · R3 |
| Invariante | I7, I10 |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-058-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` y `<USER_ID>` obtenidos con PR-04 (Paso 1); `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Paso 2). S 3: gasto compartido D 1 creado con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con `{"p_type": "expense", "p_amount": "120000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": "Supermercado", "p_shared_persons": ["Sofía"], "p_shared_amounts": ["60000.00"]}`).
**Datos de prueba:** D 1: gasto `$120.000,00` del `15/08/2026` (`first_period = '2026-08'`) con deuda vinculada pendiente de `$60.000,00` (`owed_to_me`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-058-001@example.com`. | El campo "Email" muestra `qa+cp-deu-058-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/dashboard?period=2026-08` en la barra de direcciones y presionar Enter. | En la tarjeta "Gastado en agosto 2026": el número principal `data-testid="dashboard-total-expenses"` muestra `"$120.000,00"` (bruto); aparece la fila `data-testid="dashboard-net-reimbursements"` con la etiqueta `"Neto de reembolsos"` y el monto `data-testid="dashboard-net-reimbursements-amount"` = `"$60.000,00"`; el elemento `data-testid="dashboard-net-reimbursements-note"` no existe en el DOM; y debajo se ve el enlace `"Ver deudas"` (`data-testid="dashboard-net-reimbursements-link"`). |
| 6 | Hacer click en el enlace `"Ver deudas"` (`data-testid="dashboard-net-reimbursements-link"`). | El navegador navega a `<APP>/debts` y muestra la deuda de Sofía por `$60.000,00`. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-059 — Con la deuda vinculada ya saldada, el Resumen sigue mostrando Gastado $120.000,00 (bruto) y Neto de reembolsos $60.000,00

| Campo | Contenido |
|---|---|
| Historia · criterio | US-30 · CA-2, CA-10 · FR-19 · R3 |
| Invariante | I9, I10 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-059-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` y `<USER_ID>` obtenidos con PR-04 (Paso 1); `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Paso 2). S 3: gasto compartido D 1 creado con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con `{"p_type": "expense", "p_amount": "120000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null, "p_shared_persons": ["Sofía"], "p_shared_amounts": ["60000.00"]}`). S 4: `<DEBT_ID>` obtenido con PR-08 (`GET /rest/v1/debts?select=id`) y saldado con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/settle_debt` con `{"p_debt_id": "<DEBT_ID>"}`).
**Datos de prueba:** D 1: gasto `$120.000,00` del `15/08/2026` con deuda vinculada saldada (`status = 'settled'`) de `$60.000,00`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-059-001@example.com`. | El campo "Email" muestra `qa+cp-deu-059-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/dashboard?period=2026-08` en la barra de direcciones y presionar Enter. | `data-testid="dashboard-total-expenses"` muestra `"$120.000,00"` y `data-testid="dashboard-net-reimbursements-amount"` muestra `"$60.000,00"`. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-060 — Una deuda suelta "Me deben" en el período no hace aparecer la fila "Neto de reembolsos" ni cambia el total gastado

| Campo | Contenido |
|---|---|
| Historia · criterio | US-30 · CA-4 · FR-19 |
| Invariante | I7 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-060-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` y `<USER_ID>` obtenidos con PR-04 (Paso 1); `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Paso 2). S 3: gasto sin deuda D 1 creado con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con `{"p_type": "expense", "p_amount": "80000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null}`). S 4: deuda suelta D 2 creada con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con `{"p_direction": "owed_to_me", "p_person": "Juan", "p_amount": "25000.00", "p_currency": "ARS", "p_fx_rate": null, "p_incurred_on": "2026-08-16", "p_notes": null}`).
**Datos de prueba:** D 1: gasto `$80.000,00` sin deuda (`2026-08-15`). D 2: deuda suelta `owed_to_me` de `$25.000,00` (`2026-08-16`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-060-001@example.com`. | El campo "Email" muestra `qa+cp-deu-060-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/dashboard?period=2026-08` en la barra de direcciones y presionar Enter. | `data-testid="dashboard-total-expenses"` muestra `"$80.000,00"` y el elemento `data-testid="dashboard-net-reimbursements"` no existe en el DOM. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-061 — Gasto de US$100,00 a TC 1250 ($125.000,00) con deuda vinculada de US$40,00 ($50.000,00) muestra Neto $75.000,00 y no cambia aunque se modifique el TC de referencia del mes a 1500 (C5)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-30 · CA-6, CA-10 · FR-19 · R2, R3 |
| Invariante | I4, I7, I10 |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-061-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` y `<USER_ID>` obtenidos con PR-04 (Paso 1); `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Paso 2). S 3: gasto en USD compartido D 1 creado con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con `{"p_type": "expense", "p_amount": "100.00", "p_currency": "USD", "p_fx_rate": "1250.0000", "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null, "p_shared_persons": ["Sofía"], "p_shared_amounts": ["40.00"]}`). S 4: tipo de cambio de referencia del mes actualizado a `1500.0000` con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/upsert_fx_rate` con `{"p_period": "2026-08-01", "p_ars_per_usd": "1500.0000"}`).
**Datos de prueba:** D 1: gasto `US$100,00` a TC `1250` (`amount_ars = $125.000,00`) con deuda vinculada de `US$40,00` (`amount_ars = $50.000,00`). D 2: nuevo TC de referencia `1500`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-061-001@example.com`. | El campo "Email" muestra `qa+cp-deu-061-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/dashboard?period=2026-08` en la barra de direcciones y presionar Enter. | `data-testid="dashboard-total-expenses"` muestra `"$125.000,00"` y `data-testid="dashboard-net-reimbursements-amount"` muestra `"$75.000,00"` (`$125.000,00 − $50.000,00`, usando el `amount_ars` congelado de la deuda y no `$60.000,00`). |

**Post-condición:** sin cambios en base de datos.

---

## (c) Historias o criterios de aceptación sin caso manual (Huecos)

| ID | Historia · criterio | Motivo por el que no tiene caso manual en este archivo | Cobertura prevista |
|---|---|---|---|
| **H-DEU-01** | **US-36 · CA-10 (doble toque)**, **US-39 · CA-3 (estado `"Saldando…"` y doble toque)** y **US-39 · CA-4 (doble toque en `"Deshacer"` y desaparición a los 5 s por reloj)** | En entorno local contra Supabase en `127.0.0.1`, la RPC responde en `< 20 ms`, por lo que un ejecutante manual no puede observar de forma reproducible el texto transitorio `"Saldando…"` ni ejecutar dos clicks antes de la respuesta sin usar demoras artificiales de red (`page.route` / Network Throttling) o reloj simulado. | Se cubren en pruebas automatizadas de componente/E2E (Vitest / Playwright) reteniendo la promesa de `create_debt`, `settle_debt` y `reopen_debt` y avanzando el reloj 5.000 ms. |
| **H-DEU-02** | **US-36 · CA-13**, **US-39 · CA-5 (fallo de red)** y **US-40 · CA-6 (fallo de red)** | Provocar un fallo de red determinista justo al enviar `create_debt`, `settle_debt` o `reopen_debt` después de haber cargado la pantalla requiere interceptar o bloquear selectivamente el endpoint RPC en DevTools o Playwright (`docs/07-plan-de-testing.md` §10). | Se cubren en pruebas E2E automatizadas con Playwright (`page.route` abortando o devolviendo HTTP `500` en `/rest/v1/rpc/create_debt`, `settle_debt` y `reopen_debt`). |
| **H-DEU-03** | **US-36 · CA-15** y **US-41 · CA-8** (suite pgTAP `npm run test:db` y triggers internos `check_debt_rule` / `prevent_hard_delete` como propietario de tabla) | `US-36 · CA-15` exige la ejecución automatizada de `npm run test:db` (pgTAP), y `US-41 · CA-8` prueba el trigger `check_debt_rule` insertando directamente en `public.debts` como propietario de la tabla (por REST con `authenticated` o `anon` actúa antes el `REVOKE INSERT/UPDATE/DELETE`, ya cubierto en `CP-DEU-035` y `CP-DEU-051`). | Se cubren en la suite automatizada pgTAP (`supabase/tests/`). |
| **H-DEU-04** | **US-38 · CA-8** y **US-83 · CA-13** (estados `debts-error` con `"Reintentar"` y `dashboard-error` cuando falla la lectura de deudas) | Forzar que falle la lectura `GET /rest/v1/debts` con la sesión ya iniciada (y luego restablecerla para tocar `"Reintentar"`) requiere interceptación de red o corte del servicio PostgREST entre pasos. | Se cubren en pruebas E2E con Playwright interceptando `GET /rest/v1/debts`. |
| **H-DEU-05** | **US-82 · CA-21** (movimiento pendiente con varias personas y `"Reintentar"` cuando `US-70` está implementada) | El criterio es condicional a la implementación de `US-70` (*"Si US-70 ya está implementada…"*) y requiere simular caída de red al enviar `create_transaction`. | Se cubre junto con `US-70` en pruebas E2E con interceptación de red. |
| **H-DEU-06** | **US-83 · CA-12** (prueba de dominio con `hoy = 15/11/2026` y `settled_at = 2026-10-31T22:30:00-03:00` / `2026-11-01T01:30:00Z`) | El criterio especifica explícitamente *"En la prueba de dominio del cálculo, con hoy = 15/11/2026…"* y `settle_debt` asigna `settled_at = now()` en el servidor sin aceptar fecha por parámetro (ADR-037 §3). | Se cubre con prueba unitaria de Vitest sobre la función pura en `src/domain/`. |

---

## (d) Ambigüedades para el PO

| ID | Historia / Referencia | Descripción de la ambigüedad | Impacto en los casos |
|---|---|---|---|
| **AMB-DEU-01** | **US-35 · CA-2** vs. **US-43 (categorías iniciales)** | `US-35 · CA-2` exige el texto literal `"Gasto compartido: Tecnología, $120.000,00 del 15/08/2026"`, pero `"Tecnología"` no forma parte de las 9 categorías iniciales creadas por `PR-01` (`src/lib/seed.ts`). | En `CP-DEU-002` se crea previamente la categoría personalizada `"Tecnología"` mediante `PR-04` para verificar el texto literal del criterio sin alterar el catálogo semilla. |
| **AMB-DEU-02** | **US-34 · CA-12** vs. **US-36 · CA-4** | Al cambiar la moneda del gasto en Registrar (`US-34 · CA-12`), el campo `"¿Cuánto te debe?"` se vacía y conserva la persona. En cambio, en Nueva deuda (`US-36 · CA-4`), al cambiar entre `ARS` y `US$` la historia especifica que se muestra/oculta el bloque de tipo de cambio, sin indicar si el campo `"Monto"` (`debt-form-amount`) debe conservarse o vaciarse. | En `CP-DEU-019` se verifica que Nueva deuda muestre/oculte el bloque de tipo de cambio sin exigir el vaciado de `"Monto"`, salvo que el PO decida unificar el comportamiento con `US-34 · CA-12`. |

