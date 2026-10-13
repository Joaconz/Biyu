# Entrega 2 · Casos de prueba · Deudas y gastos compartidos (DEU)

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
| **US-30** | CA-1 | `CP-DEU-143` |
| **US-30** | CA-2 | `CP-DEU-144`, `CP-DEU-109` |
| **US-30** | CA-3 | `CP-DEU-145` |
| **US-30** | CA-4 | `CP-DEU-146`, `CP-DEU-147` |
| **US-30** | CA-5 | `CP-DEU-148` (eliminar en vivo), `CP-DEU-148B` (restaurar), `CP-DEU-044`, `CP-DEU-045` |
| **US-30** | CA-6 | `CP-DEU-149` |
| **US-30** | CA-7 | `CP-DEU-150`, `CP-DEU-145` |
| **US-30** | CA-8 | `CP-DEU-145`, `CP-DEU-150` |
| **US-30** | CA-9 | `CP-DEU-143` |
| **US-30** | CA-10 | `CP-DEU-143`, `CP-DEU-144`, `CP-DEU-145`, `CP-DEU-149` |
| **US-34** | CA-1 | `CP-DEU-001`, `CP-DEU-002` |
| **US-34** | CA-2 | `CP-DEU-001` |
| **US-34** | CA-3 | `CP-DEU-003` |
| **US-34** | CA-4 | `CP-DEU-003` |
| **US-34** | CA-5 | `CP-DEU-004` |
| **US-34** | CA-6 | `CP-DEU-005` (recorte), `CP-DEU-006` (solo espacios), `CP-DEU-007` (60 caracteres y tope 61), `CP-DEU-016` (persona vacía) |
| **US-34** | CA-7 | `CP-DEU-008` (vacío), `CP-DEU-009` (`abc`), `CP-DEU-010` (`0`), `CP-DEU-011` (`-5`), `CP-DEU-012` (`100,001`), `CP-DEU-013` (USD redondea a `$0,00`), `CP-DEU-016` (persona vacía con monto válido), `CP-DEU-017` (`0,01` mínimo válido) |
| **US-34** | CA-8 | `CP-DEU-018` (solo persona), `CP-DEU-019` (solo monto), `CP-DEU-020` (`income`), `CP-DEU-021` (`"   "`), `CP-DEU-022` (`"\t"`), `CP-DEU-023` (61 chars), `CP-DEU-024` (`0`), `CP-DEU-025` (`-1`), `CP-DEU-026` (`1.001`), `CP-DEU-027` (`"NaN"`), `CP-DEU-028` (USD `< $0,01`), `CP-DEU-029` (`anon`) |
| **US-34** | CA-9 | `CP-DEU-003` |
| **US-34** | CA-10 | `CP-DEU-014` (volver a Gasto), `CP-DEU-014B` (guardar Ingreso sin deuda) |
| **US-34** | CA-11 | `CP-DEU-001`, `CP-DEU-003`, `CP-DEU-006`, `CP-DEU-008`, `CP-DEU-016` |
| **US-34** | CA-12 | `CP-DEU-015` |
| **US-34** | CA-13 | `CP-DEU-004` |
| **US-35** | CA-1 | `CP-DEU-003`, `CP-DEU-039` |
| **US-35** | CA-2 | `CP-DEU-040` (deuda vinculada en `/debts`), `CP-DEU-043` (deuda suelta en `/debts`), `CP-DEU-043B` (categoría archivada) |
| **US-35** | CA-3 | `CP-DEU-041` (`"Compartido con Sofía"` en las 12 cuotas y en Últimos movimientos; gasto sin deuda sin etiqueta) |
| **US-35** | CA-4 | `CP-DEU-042` (`delete-transaction-debt-warning` en gasto con deuda y ausente en gasto sin deuda) |
| **US-35** | CA-5 | `CP-DEU-044` |
| **US-35** | CA-6 | `CP-DEU-045` |
| **US-35** | CA-7 | `CP-DEU-046` (`settle_debt`), `CP-DEU-047` (`reopen_debt`) |
| **US-36** | CA-1 | `CP-DEU-048` |
| **US-36** | CA-2 | `CP-DEU-048`, `CP-DEU-049C` (nota con solo espacios se guarda como `null`) |
| **US-36** | CA-3 | `CP-DEU-049` |
| **US-36** | CA-4 | `CP-DEU-050` (TC sugerido), `CP-DEU-050B` (TC manual pisa al sugerido), `CP-DEU-050C` (cambio de mes actualiza TC sugerido), `CP-DEU-050D` (cambio de mes respeta TC editado) |
| **US-36** | CA-5 | `CP-DEU-051` (sin TC de referencia), `CP-DEU-051B` (enlace `"Ir a Ajustes"`) |
| **US-36** | CA-6 | `CP-DEU-049B` (recorte `"  Juan  "`), `CP-DEU-052` (persona `""`), `CP-DEU-052B` (persona `"   "`), `CP-DEU-053` (monto vacío), `CP-DEU-054` (monto `abc`), `CP-DEU-055` (monto `0`), `CP-DEU-056` (monto `-10`), `CP-DEU-057` (monto `0,001`), `CP-DEU-058` (monto `0,01`), `CP-DEU-058B` (monto `999.999.999.999,99`), `CP-DEU-059` (ARS `> máx`), `CP-DEU-060` (USD `> máx`), `CP-DEU-061` (USD `× TC > máx`), `CP-DEU-062` (USD `0,01 × 0,4`), `CP-DEU-063` (USD `0,01 × 0,5` half-up), `CP-DEU-064` (TC `abc`), `CP-DEU-065` (TC `0`), `CP-DEU-065B` (TC `-100`), `CP-DEU-066` (TC `1250,12345`), `CP-DEU-067` (TC `> máx`), `CP-DEU-068` (fecha vacía) |
| **US-36** | CA-7 | `CP-DEU-069` (fecha pasada `31/12/2025`), `CP-DEU-069B` (persona 60 chars y tope 61), `CP-DEU-069C` (nota 200 chars y tope 201), `CP-DEU-070` (fecha mañana) |
| **US-36** | CA-8 | `CP-DEU-072` (persona `""`), `CP-DEU-073` (persona `"   "`), `CP-DEU-074` (persona `"\t"`), `CP-DEU-075` (61 chars), `CP-DEU-076` (monto `0`), `CP-DEU-076B` (monto `null`), `CP-DEU-077` (monto `-10`), `CP-DEU-078` (monto `1.001`), `CP-DEU-079` (monto `"NaN"`), `CP-DEU-080` (USD sin TC), `CP-DEU-081` (ARS con TC), `CP-DEU-082` (TC `10000000000`), `CP-DEU-083` (TC `0`), `CP-DEU-083B` (TC `-100`), `CP-DEU-084` (USD `1000000000 × 1000`), `CP-DEU-084B` (ARS `1000000000000` desborde `22003`), `CP-DEU-084C` (USD `1000000000000` desborde `22003`), `CP-DEU-085` (USD `0.01 × 0.4`), `CP-DEU-086` (fecha mañana), `CP-DEU-087` (fecha `null`), `CP-DEU-088` (nota 201 chars), `CP-DEU-089` (dirección `null`), `CP-DEU-089B` (moneda `null`), `CP-DEU-090` (`p_currency = "EUR"`), `CP-DEU-091` (`p_direction = "x"`), `CP-DEU-092` (`anon`) |
| **US-36** | CA-9 | `CP-DEU-093` |
| **US-36** | CA-10 | `CP-DEU-048` (1 llamada a `create_debt`); doble toque: Hueco `H-DEU-01` |
| **US-36** | CA-11 | `CP-DEU-071` |
| **US-36** | CA-12 | Modificado por `US-83`: cubierto por `CP-DEU-146`, `CP-DEU-151` y `CP-DEU-159` |
| **US-36** | CA-13 | Hueco `H-DEU-02` |
| **US-36** | CA-14 | `CP-DEU-048`, `CP-DEU-052`, `CP-DEU-053`, `CP-DEU-065`, `CP-DEU-070` |
| **US-36** | CA-15 | Hueco `H-DEU-03` (suite pgTAP automatizada) |
| **US-37** | CA-1 | `CP-DEU-094` |
| **US-37** | CA-2 | `CP-DEU-095` |
| **US-37** | CA-3 | `CP-DEU-096` (iguales), `CP-DEU-097` (sin pendientes) |
| **US-37** | CA-4 | `CP-DEU-094` |
| **US-37** | CA-5 | `CP-DEU-109`, `CP-DEU-118` |
| **US-37** | CA-6 | `CP-DEU-098` |
| **US-37** | CA-7 | `CP-DEU-044` |
| **US-38** | CA-1 | `CP-DEU-099` |
| **US-38** | CA-2 | `CP-DEU-099` |
| **US-38** | CA-3 | `CP-DEU-100` |
| **US-38** | CA-4 | `CP-DEU-101` |
| **US-38** | CA-5 | `CP-DEU-102` (orden pendientes), `CP-DEU-102B` (orden saldadas), `CP-DEU-128B` y `CP-DEU-136C` (desempate alfabético US-82) |
| **US-38** | CA-6 | `CP-DEU-094`, `CP-DEU-099` |
| **US-38** | CA-7 | `CP-DEU-103` (vacío Pendientes), `CP-DEU-104` (vacío Saldadas), `CP-DEU-105` (vacío Todas) |
| **US-38** | CA-8 | Hueco `H-DEU-04` |
| **US-38** | CA-9 | `CP-DEU-106` (UI usuario B), `CP-DEU-107` (API usuario B), `CP-DEU-108` (API `anon` `42501`) |
| **US-38** | CA-10 | `CP-DEU-108B` (redirección `/debts` sin sesión), `CP-DEU-108C` (redirección `/debts/new` sin sesión) |
| **US-38** | CA-11 | `CP-DEU-099`, `CP-DEU-103` |
| **US-39** | CA-1 | `CP-DEU-109` |
| **US-39** | CA-2 | `CP-DEU-110` |
| **US-39** | CA-3 | Hueco `H-DEU-01` |
| **US-39** | CA-4 | `CP-DEU-111` (Deshacer dentro de 5 s), `CP-DEU-111B` (desaparición al cambiar filtro); doble toque y 5 s por reloj: Hueco `H-DEU-01` |
| **US-39** | CA-5 | `CP-DEU-112` (ya saldada en otra pestaña); fallo de red: Hueco `H-DEU-02` |
| **US-39** | CA-6 | `CP-DEU-113` (ya saldada API), `CP-DEU-114` (id de otro usuario API), `CP-DEU-114B` (id inexistente API), `CP-DEU-115` (`anon` API) |
| **US-39** | CA-7 | `CP-DEU-116` (`PATCH /rest/v1/debts` con `42501`), `CP-DEU-116B` (`DELETE /rest/v1/debts` con `42501`) |
| **US-39** | CA-8 | `CP-DEU-109`, `CP-DEU-144` |
| **US-40** | CA-1 | `CP-DEU-117` |
| **US-40** | CA-2 | `CP-DEU-117` |
| **US-40** | CA-3 | `CP-DEU-118` |
| **US-40** | CA-4 | `CP-DEU-119` (ya pendiente API), `CP-DEU-120` (id de otro usuario API), `CP-DEU-120B` (id inexistente API), `CP-DEU-121` (`anon` API) |
| **US-40** | CA-5 | `CP-DEU-122` |
| **US-40** | CA-6 | `CP-DEU-119B` (par UI en otra pestaña); fallo de red: Hueco `H-DEU-02` |
| **US-41** | CA-1 | `CP-DEU-030` |
| **US-41** | CA-2 | `CP-DEU-031` |
| **US-41** | CA-3 | `CP-DEU-032` |
| **US-41** | CA-4 | `CP-DEU-033` |
| **US-41** | CA-5 | `CP-DEU-035` |
| **US-41** | CA-6 | `CP-DEU-034` (`100,01` válido), `CP-DEU-036` (`100,02` rechazado UI), `CP-DEU-037` (`100.02` rechazado API) |
| **US-41** | CA-7 | `CP-DEU-038` |
| **US-41** | CA-8 | Hueco `H-DEU-03` (trigger interno `check_debt_rule` en pgTAP) |
| **US-79** | CA-1 | `CP-DEU-123` |
| **US-79** | CA-2 | `CP-DEU-123` |
| **US-79** | CA-3 | `CP-DEU-124` |
| **US-79** | CA-4 | `CP-DEU-125` |
| **US-79** | CA-5 | `CP-DEU-124` |
| **US-79** | CA-6 | `CP-DEU-126`, `CP-DEU-126B`, `CP-DEU-126C` (vacíos `"Te deben"`), `CP-DEU-127`, `CP-DEU-127B`, `CP-DEU-127C` (vacíos `"Debés"`) |
| **US-79** | CA-7 | `CP-DEU-123` |
| **US-79** | CA-8 | `CP-DEU-123` |
| **US-79** | CA-9 | `CP-DEU-123` |
| **US-82** | CA-1 | `CP-DEU-128` |
| **US-82** | CA-2 | `CP-DEU-128`, `CP-DEU-128B` (orden alfabético sin distinguir mayúsculas ni tildes) |
| **US-82** | CA-3 | `CP-DEU-129` (2 filas ARS `$100.000` y reemplazo), `CP-DEU-129C` (personas vacías), `CP-DEU-130` (3 filas ARS `$120.000`), `CP-DEU-130C` (2 filas USD `US$100`), `CP-DEU-130D` (USD `< $0,01` en pesos) |
| **US-82** | CA-4 | `CP-DEU-131` (`60000 + 60000` válido), `CP-DEU-132` (`60000 + 60000,01` rechazado UI) |
| **US-82** | CA-5 | `CP-DEU-133` |
| **US-82** | CA-6 | `CP-DEU-134` |
| **US-82** | CA-7 | `CP-DEU-135B` |
| **US-82** | CA-8 | `CP-DEU-135` |
| **US-82** | CA-9 | `CP-DEU-135D` |
| **US-82** | CA-10 | `CP-DEU-128` (2 personas), `CP-DEU-136` (3 personas en Movimientos y Últimos movimientos) |
| **US-82** | CA-11 | `CP-DEU-136B` |
| **US-82** | CA-12 | `CP-DEU-128B`, `CP-DEU-136C` |
| **US-82** | CA-13 | `CP-DEU-136D` (eliminar gasto compartido con 3 personas), `CP-DEU-136E` (restaurar gasto compartido con 3 personas) |
| **US-82** | CA-14 | `CP-DEU-018` (solo personas), `CP-DEU-137` (2 personas y 1 monto), `CP-DEU-138` (`[]`), `CP-DEU-139` (11 personas), `CP-DEU-140` (`"Sofía"` y `"SOFÍA"`), `CP-DEU-141` (suma `60000 + 60000.01`), `CP-DEU-142` (redondeo USD en ARS UI), `CP-DEU-142A` (redondeo USD en ARS API), `CP-DEU-142B` (segunda persona `"   "`), `CP-DEU-020` (`income` con 1 deuda), `CP-DEU-020B` (`income` con 11 personas), `CP-DEU-029` (`anon`) |
| **US-82** | CA-15 | `CP-DEU-003`, `CP-DEU-018` a `CP-DEU-029`, `CP-DEU-035` |
| **US-82** | CA-16 | `CP-DEU-130B` |
| **US-82** | CA-17 | `CP-DEU-135C` |
| **US-82** | CA-18 | `CP-DEU-132B` (bajar gasto a `$70.000`), `CP-DEU-132D` (bajar gasto a `$30.000`) |
| **US-82** | CA-19 | `CP-DEU-132C` |
| **US-82** | CA-20 | `CP-DEU-129B` |
| **US-82** | CA-21 | Hueco `H-DEU-05` |
| **US-82** | CA-22 | `CP-DEU-128`, `CP-DEU-129`, `CP-DEU-132`, `CP-DEU-133` |
| **US-83** | CA-1 | `CP-DEU-151` |
| **US-83** | CA-2 | `CP-DEU-152` |
| **US-83** | CA-3 | `CP-DEU-153`, `CP-DEU-153B` (etiqueta `"En cero"`) |
| **US-83** | CA-4 | `CP-DEU-154` |
| **US-83** | CA-5 | `CP-DEU-155` |
| **US-83** | CA-6 | `CP-DEU-156` |
| **US-83** | CA-7 | `CP-DEU-157` |
| **US-83** | CA-8 | `CP-DEU-158` |
| **US-83** | CA-9 | `CP-DEU-159` |
| **US-83** | CA-10 | `CP-DEU-151`, `CP-DEU-152`, `CP-DEU-153B`, `CP-DEU-154`, `CP-DEU-159` |
| **US-83** | CA-11 | `CP-DEU-154`, `CP-DEU-156` |
| **US-83** | CA-12 | Hueco `H-DEU-06` (prueba unitaria de dominio con reloj fijo) |
| **US-83** | CA-13 | Hueco `H-DEU-04` |
| **US-83** | CA-14 | `CP-DEU-151`, `CP-DEU-155`, `CP-DEU-158` |

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
| 14 | Hacer click en el botón "Guardar gasto" (`data-testid="transaction-form-submit"`). | Aparece el aviso `"Gasto guardado"` (`data-testid="transaction-form-saved"`) sin mención de deuda. |
| 15 | Escribir `<APP>/debts?status=all` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Deudas" con el estado vacío `"No cargaste ninguna deuda todavía."` (`data-testid="debts-empty"`): no se creó ninguna deuda. |

**Post-condición:** 1 transacción de `$50.000,00` y 0 filas en `debts`.

---

#### CP-DEU-002 — En un Ingreso la sección "Gasto compartido" no existe en el DOM

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-1 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · CP-DEU-020, CP-DEU-020B |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-002-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: tipo `"Ingreso"`. D 2: monto `100000`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-002-001@example.com`. | El campo "Email" muestra `qa+cp-deu-002-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1, "¿Cuánto?". |
| 5 | Hacer click en la opción "Ingreso" (`data-testid="transaction-form-type-income"`). | "Ingreso" queda seleccionado y el indicador de progreso pasa a "1/2". |
| 6 | Escribir `100000` en el campo del monto. | El campo del monto muestra `100000` y se habilita "Siguiente". |
| 7 | Hacer click en el botón "Siguiente". | Se abre el paso 2 de 2, "Revisá y guardá", con "Cuenta", "Fecha", "Nota (opcional)" y el botón "Guardar ingreso". |
| 8 | Inspeccionar la pantalla debajo del campo "Nota (opcional)". | La sección "Gasto compartido" y el elemento `data-testid="transaction-form-shared-toggle"` no existen en el DOM. |

**Post-condición:** sin escrituras en base de datos.

---

#### CP-DEU-003 — Registrar un gasto compartido de $120.000,00 ARS en 12 cuotas con Sofía por $60.000,00 crea la transacción, 12 cuotas y la deuda vinculada en una sola llamada RPC

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-3, CA-4, CA-9, CA-11 · US-35 · CA-1 · US-82 · CA-15 · FR-18 |
| Invariante | I2, I3, I4, I5, I7 |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-003-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` y `<USER_ID>` obtenidos con PR-04 (Paso 1). S 3: categoría D 2 creada con PR-04 (`POST /rest/v1/categories` con `{"user_id": "<USER_ID>", "name": "Tecnología", "color": "#2E7D5B"}`).
**Datos de prueba:** D 1: monto `120000` ARS. D 2: categoría `"Tecnología"`. D 3: cuenta `"Tarjeta de crédito"`. D 4: cuotas `12`. D 5: fecha `15/08/2026`. D 6: persona `"Sofía"`, monto adeudado `60000`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, abrir las herramientas de desarrollador en la pestaña "Network" (Red), escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-003-001@example.com`. | El campo "Email" muestra `qa+cp-deu-003-001@example.com`. |
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

#### CP-DEU-004 — Registrar un gasto compartido en US$100,00 a TC 1250 con Sofía por US$40,00 congela fx_rate = 1250.0000 y amount_ars = 50000.00 y avisa en dólares

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-5, CA-13 · FR-18 |
| Invariante | I4, I5, I7 · C5 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-004-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: monto `100` USD. D 2: TC `1250`. D 3: categoría `"Otros"`. D 4: fecha `15/08/2026`. D 5: persona `"Sofía"`, monto adeudado `40`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-004-001@example.com`. | El campo "Email" muestra `qa+cp-deu-004-001@example.com`. |
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
| 15 | Hacer click en el botón "Guardar gasto". | Aparece el aviso `"Gasto guardado"` (`data-testid="transaction-form-saved"`) con la descripción `"Sofía te debe US$40,00"`. |
| 16 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=person,currency,amount_text:amount::text,fx_rate_text:fx_rate::text,amount_ars_text:amount_ars::text`. | Devuelve 1 fila con `person = "Sofía"`, `currency = "USD"`, `amount_text = "40.00"`, `fx_rate_text = "1250.0000"` y `amount_ars_text = "50000.00"`. |

**Post-condición:** 1 transacción en USD y 1 deuda vinculada en USD con `fx_rate = 1250.0000` y `amount_ars = 50000.00`.

---

#### CP-DEU-005 — La persona con espacios en los extremos ("  Sofía  ") se recorta y se guarda como "Sofía"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-6 · FR-18 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-005-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: monto `20000` ARS. D 2: persona `"  Sofía  "`. D 3: monto adeudado `10000`. D 4: fecha `15/08/2026`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-005-001@example.com`. | El campo "Email" muestra `qa+cp-deu-005-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1. |
| 5 | Escribir `20000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2, "¿En qué?". |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3, "Revisá y guardá". |
| 7 | En la sección "Fecha", hacer click en "Otra" y escribir `15/08/2026` en `data-testid="transaction-form-date"`. | El campo de fecha muestra `15/08/2026`. |
| 8 | Hacer click en el interruptor "Gasto compartido" (`data-testid="transaction-form-shared-toggle"`). | Aparecen los campos "¿Con quién?" y "¿Cuánto te debe?". |
| 9 | Hacer click en "¿Con quién?" y escribir `  Sofía  ` (con dos espacios adelante y dos atrás). | El campo muestra `  Sofía  `. |
| 10 | Hacer click en "¿Cuánto te debe?" y escribir `10000`. | El resumen muestra `"Sofía te va a deber $10.000,00 · Tu parte: $10.000,00"`. |
| 11 | Hacer click en el botón "Guardar gasto". | Aparece el aviso `"Gasto guardado"` con `"Sofía te debe $10.000,00"`. |
| 12 | Escribir `<APP>/debts?status=all` en la barra de direcciones y presionar Enter. | En la lista `data-testid="debts-list"` aparece 1 fila cuyo elemento `data-testid="debts-item-person"` tiene el texto exacto `"Sofía"` (sin espacios en los extremos). |

**Post-condición:** 1 deuda con `person = "Sofía"`.

---

#### CP-DEU-006 — La persona con solo espacios muestra "Ingresá con quién compartiste el gasto" y deshabilita "Guardar gasto"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-6, CA-11 · FR-18 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · CP-DEU-021, CP-DEU-022 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-006-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: monto `20000` ARS. D 2: persona `"   "` (tres espacios). D 3: monto adeudado `10000`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-006-001@example.com`. | El campo "Email" muestra `qa+cp-deu-006-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1. |
| 5 | Escribir `20000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2, "¿En qué?". |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3, "Revisá y guardá". |
| 7 | Hacer click en el interruptor "Gasto compartido". | Aparecen los campos "¿Con quién?" y "¿Cuánto te debe?". |
| 8 | Hacer click en "¿Con quién?" (`data-testid="transaction-form-shared-person"`) y escribir tres espacios (`   `). | El campo contiene tres espacios. |
| 9 | Hacer click en "¿Cuánto te debe?" y escribir `10000`. | Debajo de "¿Con quién?" aparece `data-testid="transaction-form-shared-person-error"` con el texto exacto `"Ingresá con quién compartiste el gasto"`, y el botón "Guardar gasto" (`data-testid="transaction-form-submit"`) permanece deshabilitado (`disabled`). |

**Post-condición:** 0 filas en `transactions` y `debts`.

---

#### CP-DEU-007 — Una persona de 60 caracteres se guarda y el campo impide escribir el carácter 61

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-6 · FR-18 |
| Invariante | — |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · CP-DEU-023 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-007-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: cadena de 61 caracteres `"A123456789B123456789C123456789D123456789E123456789F123456789Z"` (los primeros 60 terminan en `9` y el 61 es `Z`). D 2: monto `20000`, deuda `10000`, fecha `15/08/2026`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-007-001@example.com`. | El campo "Email" muestra `qa+cp-deu-007-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1. |
| 5 | Escribir `20000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2, "¿En qué?". |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3, "Revisá y guardá". |
| 7 | En la sección "Fecha", hacer click en "Otra" y escribir `15/08/2026` en `data-testid="transaction-form-date"`. | El campo de fecha muestra `15/08/2026`. |
| 8 | Hacer click en el interruptor "Gasto compartido". | Aparecen los campos "¿Con quién?" y "¿Cuánto te debe?". |
| 9 | Hacer click en "¿Con quién?" y escribir la cadena de 61 caracteres `A123456789B123456789C123456789D123456789E123456789F123456789Z`. | Por `maxlength="60"`, el campo acepta exactamente los primeros 60 caracteres (`A123456789B123456789C123456789D123456789E123456789F123456789`) y no deja escribir la `Z` final. |
| 10 | Hacer click en "¿Cuánto te debe?" y escribir `10000`. | Se habilita el botón "Guardar gasto". |
| 11 | Hacer click en el botón "Guardar gasto". | Aparece el aviso `"Gasto guardado"`. |
| 12 | Escribir `<APP>/debts?status=all` en la barra de direcciones y presionar Enter. | Aparece 1 fila con `data-testid="debts-item-person"` igual a los 60 caracteres exactos `A123456789B123456789C123456789D123456789E123456789F123456789`. |

**Post-condición:** 1 deuda con `person` de 60 caracteres.

---

#### CP-DEU-008 — El monto adeudado vacío muestra "Ingresá cuánto te debe" y deshabilita "Guardar gasto"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-7, CA-11 · FR-18 |
| Invariante | I4 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · CP-DEU-018 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-008-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: monto `20000` ARS. D 2: persona `"Sofía"`. D 3: monto adeudado vacío `""`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-008-001@example.com`. | El campo "Email" muestra `qa+cp-deu-008-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1. |
| 5 | Escribir `20000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2, "¿En qué?". |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3, "Revisá y guardá". |
| 7 | Hacer click en el interruptor "Gasto compartido" y escribir `Sofía` en "¿Con quién?". | El botón "Guardar gasto" está deshabilitado (`disabled`). |
| 8 | Hacer click en "¿Cuánto te debe?" (`data-testid="transaction-form-shared-amount"`) y luego hacer click en "¿Con quién?" para quitarle el foco sin escribir nada. | Debajo de "¿Cuánto te debe?" aparece `data-testid="transaction-form-shared-amount-error"` con el texto exacto `"Ingresá cuánto te debe"`, y "Guardar gasto" sigue deshabilitado. |

**Post-condición:** 0 filas en `transactions` y `debts`.

---

#### CP-DEU-009 — Un monto adeudado no numérico ("abc") muestra "Ingresá un número válido" y deshabilita "Guardar gasto"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-7 · FR-18 |
| Invariante | I4 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · CP-DEU-027 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-009-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: monto `20000` ARS. D 2: persona `"Sofía"`. D 3: monto adeudado `"abc"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-009-001@example.com`. | El campo "Email" muestra `qa+cp-deu-009-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1. |
| 5 | Escribir `20000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2, "¿En qué?". |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3, "Revisá y guardá". |
| 7 | Hacer click en el interruptor "Gasto compartido" y escribir `Sofía` en "¿Con quién?". | El campo "¿Con quién?" muestra `Sofía`. |
| 8 | Hacer click en "¿Cuánto te debe?", escribir `abc` y hacer click en "¿Con quién?" para quitarle el foco. | Aparece `data-testid="transaction-form-shared-amount-error"` con el texto exacto `"Ingresá un número válido"`, y "Guardar gasto" queda deshabilitado. |

**Post-condición:** 0 filas en `transactions` y `debts`.

---

#### CP-DEU-010 — Un monto adeudado igual a 0 muestra "El monto debe ser mayor a cero" y deshabilita "Guardar gasto"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-7 · FR-18 |
| Invariante | I4 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · CP-DEU-024 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-010-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: monto `20000` ARS. D 2: persona `"Sofía"`. D 3: monto adeudado `"0"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-010-001@example.com`. | El campo "Email" muestra `qa+cp-deu-010-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1. |
| 5 | Escribir `20000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2, "¿En qué?". |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3, "Revisá y guardá". |
| 7 | Hacer click en el interruptor "Gasto compartido" y escribir `Sofía` en "¿Con quién?". | El campo "¿Con quién?" muestra `Sofía`. |
| 8 | Hacer click en "¿Cuánto te debe?", escribir `0` y hacer click en "¿Con quién?" para quitarle el foco. | Aparece `data-testid="transaction-form-shared-amount-error"` con el texto exacto `"El monto debe ser mayor a cero"`, y "Guardar gasto" queda deshabilitado. |

**Post-condición:** 0 filas en `transactions` y `debts`.

---

#### CP-DEU-011 — Un monto adeudado negativo ("-5") muestra "El monto debe ser mayor a cero" y deshabilita "Guardar gasto"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-7 · FR-18 |
| Invariante | I4 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · CP-DEU-025 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-011-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: monto `20000` ARS. D 2: persona `"Sofía"`. D 3: monto adeudado `"-5"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-011-001@example.com`. | El campo "Email" muestra `qa+cp-deu-011-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1. |
| 5 | Escribir `20000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2, "¿En qué?". |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3, "Revisá y guardá". |
| 7 | Hacer click en el interruptor "Gasto compartido" y escribir `Sofía` en "¿Con quién?". | El campo "¿Con quién?" muestra `Sofía`. |
| 8 | Hacer click en "¿Cuánto te debe?", escribir `-5` y hacer click en "¿Con quién?" para quitarle el foco. | Aparece `data-testid="transaction-form-shared-amount-error"` con el texto exacto `"El monto debe ser mayor a cero"`, y "Guardar gasto" queda deshabilitado. |

**Post-condición:** 0 filas en `transactions` y `debts`.

---

#### CP-DEU-012 — Un monto adeudado con más de 2 decimales ("100,001") muestra "El monto admite hasta 2 decimales" y deshabilita "Guardar gasto"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-7 · FR-18 |
| Invariante | I4 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · CP-DEU-026 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-012-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: monto `20000` ARS. D 2: persona `"Sofía"`. D 3: monto adeudado `"100,001"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-012-001@example.com`. | El campo "Email" muestra `qa+cp-deu-012-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1. |
| 5 | Escribir `20000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2, "¿En qué?". |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3, "Revisá y guardá". |
| 7 | Hacer click en el interruptor "Gasto compartido" y escribir `Sofía` en "¿Con quién?". | El campo "¿Con quién?" muestra `Sofía`. |
| 8 | Hacer click en "¿Cuánto te debe?", escribir `100,001` y hacer click en "¿Con quién?" para quitarle el foco. | Aparece `data-testid="transaction-form-shared-amount-error"` con el texto exacto `"El monto admite hasta 2 decimales"`, y "Guardar gasto" queda deshabilitado. |

**Post-condición:** 0 filas en `transactions` y `debts`.

---

#### CP-DEU-013 — En un gasto en US$ con TC 0,4, "¿Cuánto te debe?" de 0,01 muestra "En pesos daría menos de $0,01. Revisá el monto o el tipo de cambio"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-7 · FR-18 |
| Invariante | I4 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · CP-DEU-028 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-013-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: monto `100` USD. D 2: TC `0,4`. D 3: persona `"Sofía"`. D 4: monto adeudado `"0,01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-013-001@example.com`. | El campo "Email" muestra `qa+cp-deu-013-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1. |
| 5 | Hacer click en "US$" (`data-testid="transaction-form-currency-usd"`), escribir `100` en el monto y `0,4` en "Tipo de cambio (ARS por US$)" (`data-testid="transaction-form-fx-rate"`). | Se muestra `≈ $40,00` y se habilita "Siguiente". |
| 6 | Hacer click en "Siguiente" y elegir la categoría "Otros". | Se abre el paso 3, "Revisá y guardá". |
| 7 | Hacer click en el interruptor "Gasto compartido" y escribir `Sofía` en "¿Con quién?". | El campo "¿Con quién?" muestra `Sofía`. |
| 8 | Hacer click en "¿Cuánto te debe?", escribir `0,01` y hacer click en "¿Con quién?" para quitarle el foco. | Aparece `data-testid="transaction-form-shared-amount-error"` con el texto exacto `"En pesos daría menos de $0,01. Revisá el monto o el tipo de cambio"`, y "Guardar gasto" queda deshabilitado. |

**Post-condición:** 0 filas en `transactions` y `debts`.

---

#### CP-DEU-014 — Si con "Gasto compartido" encendido se vuelve al paso 1, se cambia a Ingreso y se vuelve a Gasto, el interruptor está apagado y los campos vacíos

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-10 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-014-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: monto `50000` ARS. D 2: persona `"Sofía"`, monto adeudado `25000`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-014-001@example.com`. | El campo "Email" muestra `qa+cp-deu-014-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1. |
| 5 | Escribir `50000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2, "¿En qué?". |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3, "Revisá y guardá". |
| 7 | Hacer click en el interruptor "Gasto compartido", escribir `Sofía` en "¿Con quién?" y `25000` en "¿Cuánto te debe?". | Se ve `"Sofía te va a deber $25.000,00 · Tu parte: $25.000,00"`. |
| 8 | Hacer click en el chip de resumen del monto (`$50.000,00`) arriba del paso 3 para volver al paso 1. | Se abre el paso 1, "¿Cuánto?". |
| 9 | Hacer click en "Ingreso" (`data-testid="transaction-form-type-income"`) y luego volver a hacer click en "Gasto" (`data-testid="transaction-form-type-expense"`). | Queda seleccionado "Gasto". |
| 10 | Hacer click en "Siguiente" y elegir la categoría "Otros". | En el paso 3 el interruptor "Gasto compartido" está apagado (`aria-checked="false"`). |
| 11 | Hacer click en el interruptor "Gasto compartido". | Los campos "¿Con quién?" y "¿Cuánto te debe?" aparecen completamente vacíos (`""`). |

**Post-condición:** sin escrituras en base de datos.

---

#### CP-DEU-014B — Si con "Gasto compartido" encendido se vuelve al paso 1, se cambia a Ingreso y se guarda el ingreso, no se crea ninguna deuda

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-10 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-014b-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: monto `50000` ARS. D 2: persona `"Sofía"`, monto adeudado `25000`. D 3: fecha `15/08/2026`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-014b-001@example.com`. | El campo "Email" muestra `qa+cp-deu-014b-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1. |
| 5 | Escribir `50000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2, "¿En qué?". |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3, "Revisá y guardá". |
| 7 | En la sección "Fecha", hacer click en "Otra" y escribir `15/08/2026`. | El campo de fecha muestra `15/08/2026`. |
| 8 | Hacer click en el interruptor "Gasto compartido", escribir `Sofía` en "¿Con quién?" y `25000` en "¿Cuánto te debe?". | Se ve `"Sofía te va a deber $25.000,00 · Tu parte: $25.000,00"`. |
| 9 | Hacer click en el chip de resumen del monto (`$50.000,00`) para volver al paso 1. | Se abre el paso 1, "¿Cuánto?". |
| 10 | Hacer click en "Ingreso" (`data-testid="transaction-form-type-income"`) y hacer click en "Siguiente". | Se abre el paso 2 de 2 de Ingreso, "Revisá y guardá". |
| 11 | Hacer click en "Guardar ingreso" (`data-testid="transaction-form-submit"`). | Aparece el aviso `"Ingreso guardado"`. |
| 12 | Escribir `<APP>/debts?status=all` en la barra de direcciones y presionar Enter. | Se muestra el estado vacío `"No cargaste ninguna deuda todavía."` (`data-testid="debts-empty"`): no se creó ninguna deuda. |

**Post-condición:** 1 ingreso de `$50.000,00` y 0 filas en `debts`.

---

#### CP-DEU-015 — Cambiar la moneda en el paso 1 vacía "¿Cuánto te debe?", cambia su prefijo a la moneda nueva y conserva la persona

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-12 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-015-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: monto inicial `50000` ARS, persona `"Sofía"`, monto adeudado `25000`. D 2: nuevo monto `100` USD a TC `1250`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-015-001@example.com`. | El campo "Email" muestra `qa+cp-deu-015-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1. |
| 5 | Escribir `50000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2, "¿En qué?". |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3, "Revisá y guardá". |
| 7 | Hacer click en el interruptor "Gasto compartido", escribir `Sofía` en "¿Con quién?" y `25000` en "¿Cuánto te debe?". | Se ve `"Sofía te va a deber $25.000,00 · Tu parte: $25.000,00"` y el prefijo de "¿Cuánto te debe?" es `$`. |
| 8 | Hacer click en el chip de resumen del monto (`$50.000,00`) para volver al paso 1. | Se abre el paso 1, "¿Cuánto?". |
| 9 | Hacer click en "US$" (`data-testid="transaction-form-currency-usd"`), escribir `100` en el monto y `1250` en "Tipo de cambio (ARS por US$)". | Se habilita "Siguiente". |
| 10 | Hacer click en "Siguiente". | Regresa al paso 3: el interruptor "Gasto compartido" sigue encendido, "¿Con quién?" conserva `Sofía`, "¿Cuánto te debe?" está vacío (`""`) y su prefijo es `US$`. |

**Post-condición:** sin escrituras en base de datos.

---

#### CP-DEU-016 — Con "¿Cuánto te debe?" válido y "¿Con quién?" vacío, el botón "Guardar gasto" permanece deshabilitado y al quitar el foco muestra "Ingresá con quién compartiste el gasto"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-6, CA-7, CA-11 · FR-18 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · CP-DEU-019 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-016-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: monto `20000` ARS. D 2: persona vacía `""`. D 3: monto adeudado `10000`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-016-001@example.com`. | El campo "Email" muestra `qa+cp-deu-016-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1. |
| 5 | Escribir `20000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2, "¿En qué?". |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3, "Revisá y guardá". |
| 7 | Hacer click en el interruptor "Gasto compartido" y escribir `10000` en "¿Cuánto te debe?". | El botón "Guardar gasto" (`data-testid="transaction-form-submit"`) está deshabilitado (`disabled`). |
| 8 | Hacer click en "¿Con quién?" (`data-testid="transaction-form-shared-person"`) y luego hacer click en "¿Cuánto te debe?" para quitarle el foco sin escribir nada. | Aparece `data-testid="transaction-form-shared-person-error"` con el texto exacto `"Ingresá con quién compartiste el gasto"`, y "Guardar gasto" sigue deshabilitado. |

**Post-condición:** 0 filas en `transactions` y `debts`.

---

#### CP-DEU-017 — Un monto adeudado de 0,01 ARS (mínimo válido) sobre un gasto de $20.000,00 se acepta y guarda la deuda por $0,01

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-7 · FR-18 |
| Invariante | I4 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · CP-DEU-024 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-017-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: monto `20000` ARS. D 2: persona `"Sofía"`. D 3: monto adeudado `0,01`. D 4: fecha `15/08/2026`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-017-001@example.com`. | El campo "Email" muestra `qa+cp-deu-017-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1. |
| 5 | Escribir `20000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2, "¿En qué?". |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3, "Revisá y guardá". |
| 7 | En la sección "Fecha", hacer click en "Otra" y escribir `15/08/2026`. | El campo de fecha muestra `15/08/2026`. |
| 8 | Hacer click en el interruptor "Gasto compartido", escribir `Sofía` en "¿Con quién?" y `0,01` en "¿Cuánto te debe?". | El resumen muestra `"Sofía te va a deber $0,01 · Tu parte: $19.999,99"` y se habilita "Guardar gasto". |
| 9 | Hacer click en "Guardar gasto". | Aparece el aviso `"Gasto guardado"` con `"Sofía te debe $0,01"`. |

**Post-condición:** 1 transacción de `$20.000,00` y 1 deuda de `$0,01`.

---

#### CP-DEU-018 — Directo contra create_transaction, enviar p_shared_persons = ["Sofía"] con p_shared_amounts = null se rechaza con "Un gasto compartido necesita una persona y un monto por cada deuda"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-8 · US-82 · CA-14, CA-15 · FR-18 |
| Invariante | I4 · C4 · C6 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-DEU-008 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-018-001@example.com` creado con PR-01. S 2: `<TOKEN>`, `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Pasos 1 y 2).
**Datos de prueba:** D 1: `p_amount = "20000.00"`, `p_currency = "ARS"`, `p_occurred_on = "2026-08-15"`. D 2: `p_shared_persons = ["Sofía"]`, `p_shared_amounts = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con cuerpo `{"p_type": "expense", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null, "p_shared_persons": ["Sofía"], "p_shared_amounts": null}`. | Responde HTTP `400` con `code = "23514"` y `message = "Un gasto compartido necesita una persona y un monto por cada deuda"`. |
| 2 | Ejecutar las consultas de PR-08 (`transactions`, `ledger_entries` y `GET <SUPABASE_URL>/rest/v1/debts?select=id`). | Las tres devuelven `[]` (atomicidad C4). |

**Post-condición:** 0 filas en `transactions`, `ledger_entries` y `debts`.

---

#### CP-DEU-019 — Directo contra create_transaction, enviar p_shared_persons = null con p_shared_amounts = ["10000.00"] se rechaza con "Un gasto compartido necesita una persona y un monto por cada deuda"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-8 · US-82 · CA-14, CA-15 · FR-18 |
| Invariante | C4 · C6 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-DEU-016 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-019-001@example.com` creado con PR-01. S 2: `<TOKEN>`, `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Pasos 1 y 2).
**Datos de prueba:** D 1: `p_amount = "20000.00"`, `p_currency = "ARS"`, `p_occurred_on = "2026-08-15"`. D 2: `p_shared_persons = null`, `p_shared_amounts = ["10000.00"]`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con cuerpo `{"p_type": "expense", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null, "p_shared_persons": null, "p_shared_amounts": ["10000.00"]}`. | Responde HTTP `400` con `code = "23514"` y `message = "Un gasto compartido necesita una persona y un monto por cada deuda"`. |
| 2 | Ejecutar las consultas de PR-08 (`transactions` y `debts`). | Ambas devuelven `[]`. |

**Post-condición:** 0 filas en `transactions`, `ledger_entries` y `debts`.

---

#### CP-DEU-020 — Directo contra create_transaction, p_type = "income" con una deuda compartida se rechaza con "Un ingreso no se puede compartir"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-8 · US-82 · CA-14, CA-15 · FR-18 |
| Invariante | I7 · C4 · C6 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-DEU-002 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-020-001@example.com` creado con PR-01. S 2: `<TOKEN>` y `<ACCOUNT_ID>` de `"Efectivo"` obtenidos con PR-04 (Pasos 1 y 2).
**Datos de prueba:** D 1: `p_type = "income"`, `p_amount = "20000.00"`, `p_occurred_on = "2026-08-15"`. D 2: `p_shared_persons = ["Sofía"]`, `p_shared_amounts = ["10000.00"]`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con cuerpo `{"p_type": "income", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": null, "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null, "p_shared_persons": ["Sofía"], "p_shared_amounts": ["10000.00"]}`. | Responde HTTP `400` con `code = "23514"` y `message = "Un ingreso no se puede compartir"`. |
| 2 | Ejecutar las consultas de PR-08 (`transactions` y `debts`). | Ambas devuelven `[]`. |

**Post-condición:** 0 filas en `transactions`, `ledger_entries` y `debts`.

---

#### CP-DEU-020B — Directo contra create_transaction, p_type = "income" con 11 personas se rechaza con "Un ingreso no se puede compartir" (primer error del orden de ADR-040 §2)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-82 · CA-14 · ADR-040 §2 · FR-18 |
| Invariante | I7 · C4 · C6 |
| Técnica · Tipo | Tabla de decisión · Negativo |
| Canal · Caso par | API · CP-DEU-002 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-020b-001@example.com` creado con PR-01. S 2: `<TOKEN>` y `<ACCOUNT_ID>` de `"Efectivo"` obtenidos con PR-04 (Pasos 1 y 2).
**Datos de prueba:** D 1: `p_type = "income"`, `p_amount = "120000.00"`, `p_occurred_on = "2026-08-15"`. D 2: `p_shared_persons = ["P1","P2","P3","P4","P5","P6","P7","P8","P9","P10","P11"]`, `p_shared_amounts = ["1000.00","1000.00","1000.00","1000.00","1000.00","1000.00","1000.00","1000.00","1000.00","1000.00","1000.00"]`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con cuerpo `{"p_type": "income", "p_amount": "120000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": null, "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null, "p_shared_persons": ["P1","P2","P3","P4","P5","P6","P7","P8","P9","P10","P11"], "p_shared_amounts": ["1000.00","1000.00","1000.00","1000.00","1000.00","1000.00","1000.00","1000.00","1000.00","1000.00","1000.00"]}`. | Responde HTTP `400` con `code = "23514"` y `message = "Un ingreso no se puede compartir"`. |
| 2 | Ejecutar las consultas de PR-08 (`transactions` y `debts`). | Ambas devuelven `[]`. |

**Post-condición:** 0 filas en `transactions`, `ledger_entries` y `debts`.

---

#### CP-DEU-021 — Directo contra create_transaction, p_shared_persons = ["   "] se rechaza con "Ingresá con quién compartiste el gasto"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-8 · US-82 · CA-14, CA-15 · FR-18 |
| Invariante | C4 · C6 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-DEU-006 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-021-001@example.com` creado con PR-01. S 2: `<TOKEN>`, `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Pasos 1 y 2).
**Datos de prueba:** D 1: `p_amount = "20000.00"`, `p_occurred_on = "2026-08-15"`. D 2: `p_shared_persons = ["   "]`, `p_shared_amounts = ["10000.00"]`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con cuerpo `{"p_type": "expense", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null, "p_shared_persons": ["   "], "p_shared_amounts": ["10000.00"]}`. | Responde HTTP `400` con `code = "23514"` y `message = "Ingresá con quién compartiste el gasto"`. |
| 2 | Ejecutar las consultas de PR-08 (`transactions` y `debts`). | Ambas devuelven `[]`. |

**Post-condición:** 0 filas en `transactions`, `ledger_entries` y `debts`.

---

#### CP-DEU-022 — Directo contra create_transaction, p_shared_persons = ["\t"] se rechaza con "Ingresá con quién compartiste el gasto"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-8 · US-82 · CA-14, CA-15 · FR-18 |
| Invariante | C4 · C6 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-DEU-006 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-022-001@example.com` creado con PR-01. S 2: `<TOKEN>`, `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Pasos 1 y 2).
**Datos de prueba:** D 1: `p_amount = "20000.00"`, `p_occurred_on = "2026-08-15"`. D 2: `p_shared_persons = ["\t"]`, `p_shared_amounts = ["10000.00"]`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con cuerpo `{"p_type": "expense", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null, "p_shared_persons": ["\t"], "p_shared_amounts": ["10000.00"]}`. | Responde HTTP `400` con `code = "23514"` y `message = "Ingresá con quién compartiste el gasto"`. |
| 2 | Ejecutar las consultas de PR-08 (`transactions` y `debts`). | Ambas devuelven `[]`. |

**Post-condición:** 0 filas en `transactions`, `ledger_entries` y `debts`.

---

#### CP-DEU-023 — Directo contra create_transaction, una persona de 61 caracteres se rechaza con "La persona admite hasta 60 caracteres"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-8 · US-82 · CA-14, CA-15 · FR-18 |
| Invariante | C4 · C6 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | API · CP-DEU-007 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-023-001@example.com` creado con PR-01. S 2: `<TOKEN>`, `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Pasos 1 y 2).
**Datos de prueba:** D 1: `p_amount = "20000.00"`, `p_occurred_on = "2026-08-15"`. D 2: `p_shared_persons = ["A123456789B123456789C123456789D123456789E123456789F123456789Z"]` (61 caracteres), `p_shared_amounts = ["10000.00"]`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con cuerpo `{"p_type": "expense", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null, "p_shared_persons": ["A123456789B123456789C123456789D123456789E123456789F123456789Z"], "p_shared_amounts": ["10000.00"]}`. | Responde HTTP `400` con `code = "23514"` y `message = "La persona admite hasta 60 caracteres"`. |
| 2 | Ejecutar las consultas de PR-08 (`transactions` y `debts`). | Ambas devuelven `[]`. |

**Post-condición:** 0 filas en `transactions`, `ledger_entries` y `debts`.

---

#### CP-DEU-024 — Directo contra create_transaction, p_shared_amounts = [0] se rechaza con "I4: el monto de la deuda debe ser mayor a cero"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-8 · US-82 · CA-14, CA-15 · FR-18 |
| Invariante | I4 · C4 · C6 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | API · CP-DEU-010 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-024-001@example.com` creado con PR-01. S 2: `<TOKEN>`, `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Pasos 1 y 2).
**Datos de prueba:** D 1: `p_amount = "20000.00"`, `p_occurred_on = "2026-08-15"`. D 2: `p_shared_persons = ["Sofía"]`, `p_shared_amounts = [0]`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con cuerpo `{"p_type": "expense", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null, "p_shared_persons": ["Sofía"], "p_shared_amounts": [0]}`. | Responde HTTP `400` con `code = "23514"` y `message = "I4: el monto de la deuda debe ser mayor a cero"`. |
| 2 | Ejecutar las consultas de PR-08 (`transactions` y `debts`). | Ambas devuelven `[]`. |

**Post-condición:** 0 filas en `transactions`, `ledger_entries` y `debts`.

---

#### CP-DEU-025 — Directo contra create_transaction, p_shared_amounts = [-1] se rechaza con "I4: el monto de la deuda debe ser mayor a cero"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-8 · US-82 · CA-14, CA-15 · FR-18 |
| Invariante | I4 · C4 · C6 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-DEU-011 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-025-001@example.com` creado con PR-01. S 2: `<TOKEN>`, `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Pasos 1 y 2).
**Datos de prueba:** D 1: `p_amount = "20000.00"`, `p_occurred_on = "2026-08-15"`. D 2: `p_shared_persons = ["Sofía"]`, `p_shared_amounts = [-1]`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con cuerpo `{"p_type": "expense", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null, "p_shared_persons": ["Sofía"], "p_shared_amounts": [-1]}`. | Responde HTTP `400` con `code = "23514"` y `message = "I4: el monto de la deuda debe ser mayor a cero"`. |
| 2 | Ejecutar las consultas de PR-08 (`transactions` y `debts`). | Ambas devuelven `[]`. |

**Post-condición:** 0 filas en `transactions`, `ledger_entries` y `debts`.

---

#### CP-DEU-026 — Directo contra create_transaction, p_shared_amounts = [1.001] (literal JSON) se rechaza con "I4: el monto de la deuda admite hasta 2 decimales"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-8 · US-82 · CA-14, CA-15 · FR-18 |
| Invariante | I4 · C4 · C6 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | API · CP-DEU-012 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-026-001@example.com` creado con PR-01. S 2: `<TOKEN>`, `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Pasos 1 y 2).
**Datos de prueba:** D 1: `p_amount = "20000.00"`, `p_occurred_on = "2026-08-15"`. D 2: `p_shared_persons = ["Sofía"]`, `p_shared_amounts = [1.001]`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con cuerpo `{"p_type": "expense", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null, "p_shared_persons": ["Sofía"], "p_shared_amounts": [1.001]}`. | Responde HTTP `400` con `code = "23514"` y `message = "I4: el monto de la deuda admite hasta 2 decimales"`. |
| 2 | Ejecutar las consultas de PR-08 (`transactions` y `debts`). | Ambas devuelven `[]`. |

**Post-condición:** 0 filas en `transactions`, `ledger_entries` y `debts`.

---

#### CP-DEU-027 — Directo contra create_transaction, p_shared_amounts = ["NaN"] se rechaza con "I4: el monto de la deuda debe ser mayor a cero"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-8 · US-82 · CA-14, CA-15 · ADR-036 §5 · FR-18 |
| Invariante | I4 · C4 · C6 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-DEU-009 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-027-001@example.com` creado con PR-01. S 2: `<TOKEN>`, `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Pasos 1 y 2).
**Datos de prueba:** D 1: `p_amount = "20000.00"`, `p_occurred_on = "2026-08-15"`. D 2: `p_shared_persons = ["Sofía"]`, `p_shared_amounts = ["NaN"]`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con cuerpo `{"p_type": "expense", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null, "p_shared_persons": ["Sofía"], "p_shared_amounts": ["NaN"]}`. | Responde HTTP `400` con `code = "23514"` y `message = "I4: el monto de la deuda debe ser mayor a cero"`. |
| 2 | Ejecutar las consultas de PR-08 (`transactions` y `debts`). | Ambas devuelven `[]`. |

**Post-condición:** 0 filas en `transactions`, `ledger_entries` y `debts`.

---

#### CP-DEU-028 — Directo contra create_transaction, un gasto de US$100 a TC 0.4 con p_shared_amounts = ["0.01"] se rechaza con "I4: la deuda en pesos daría menos de $0,01"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-8 · US-82 · CA-14, CA-15 · FR-18 |
| Invariante | I4 · C4 · C6 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | API · CP-DEU-013 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-028-001@example.com` creado con PR-01. S 2: `<TOKEN>`, `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Pasos 1 y 2).
**Datos de prueba:** D 1: `p_amount = "100.00"`, `p_currency = "USD"`, `p_fx_rate = "0.4000"`, `p_occurred_on = "2026-08-15"`. D 2: `p_shared_persons = ["Sofía"]`, `p_shared_amounts = ["0.01"]`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con cuerpo `{"p_type": "expense", "p_amount": "100.00", "p_currency": "USD", "p_fx_rate": "0.4000", "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null, "p_shared_persons": ["Sofía"], "p_shared_amounts": ["0.01"]}`. | Responde HTTP `400` con `code = "23514"` y `message = "I4: la deuda en pesos daría menos de $0,01"`. |
| 2 | Ejecutar las consultas de PR-08 (`transactions` y `debts`). | Ambas devuelven `[]`. |

**Post-condición:** 0 filas en `transactions`, `ledger_entries` y `debts`.

---

#### CP-DEU-029 — Directo contra create_transaction con deuda compartida y rol anon (sin Authorization) responde 42501 (permission denied)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-34 · CA-8 · US-82 · CA-14, CA-15 · FR-18 |
| Invariante | C7 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-029-001@example.com` creado con PR-01. S 2: `<TOKEN>`, `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Pasos 1 y 2).
**Datos de prueba:** D 1: pedido válido a `create_transaction` con `p_shared_persons = ["Sofía"]` y `p_shared_amounts = ["10000.00"]` enviado solo con `apikey: <ANON_KEY>` (sin encabezado `Authorization`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar un `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` enviando únicamente `-H "apikey: <ANON_KEY>"` y `-H "Content-Type: application/json"` (sin `Authorization`), con cuerpo `{"p_type": "expense", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null, "p_shared_persons": ["Sofía"], "p_shared_amounts": ["10000.00"]}`. | Responde HTTP `401` o `403` con `code = "42501"` (`permission denied for function create_transaction`). |

**Post-condición:** 0 filas creadas.

---

#### CP-DEU-030 — Deuda de $9.999,99 sobre un gasto de $10.000,00 (un centavo menos) muestra "Tu parte: $0,01" y se guarda

| Campo | Contenido |
|---|---|
| Historia · criterio | US-41 · CA-1 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-030-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: monto del gasto `10000` ARS. D 2: persona `"Sofía"`. D 3: monto adeudado `9999,99`. D 4: fecha `15/08/2026`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-030-001@example.com`. | El campo "Email" muestra `qa+cp-deu-030-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1. |
| 5 | Escribir `10000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2, "¿En qué?". |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3, "Revisá y guardá". |
| 7 | En la sección "Fecha", hacer click en "Otra" y escribir `15/08/2026`. | El campo de fecha muestra `15/08/2026`. |
| 8 | Hacer click en el interruptor "Gasto compartido", escribir `Sofía` en "¿Con quién?" y `9999,99` en "¿Cuánto te debe?". | El resumen `data-testid="transaction-form-shared-summary"` muestra `"Sofía te va a deber $9.999,99 · Tu parte: $0,01"` y "Guardar gasto" está habilitado. |
| 9 | Hacer click en "Guardar gasto". | Aparece el aviso `"Gasto guardado"` con `"Sofía te debe $9.999,99"`. |
| 10 | Escribir `<APP>/debts?status=all` en la barra de direcciones y presionar Enter. | Aparece la fila de `"Sofía"` con `data-testid="debts-item-amount"` igual a `"$9.999,99"`. |

**Post-condición:** 1 gasto de `$10.000,00` y 1 deuda de `$9.999,99`.

---

#### CP-DEU-031 — Deuda de $10.000,00 sobre un gasto de $10.000,00 (igual al gasto) muestra "Tu parte: $0,00" y se guarda

| Campo | Contenido |
|---|---|
| Historia · criterio | US-41 · CA-2 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-031-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: monto del gasto `10000` ARS. D 2: persona `"Sofía"`. D 3: monto adeudado `10000`. D 4: fecha `15/08/2026`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-031-001@example.com`. | El campo "Email" muestra `qa+cp-deu-031-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1. |
| 5 | Escribir `10000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2, "¿En qué?". |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3, "Revisá y guardá". |
| 7 | En la sección "Fecha", hacer click en "Otra" y escribir `15/08/2026`. | El campo de fecha muestra `15/08/2026`. |
| 8 | Hacer click en el interruptor "Gasto compartido", escribir `Sofía` en "¿Con quién?" y `10000` en "¿Cuánto te debe?". | El resumen `data-testid="transaction-form-shared-summary"` muestra `"Sofía te va a deber $10.000,00 · Tu parte: $0,00"` y "Guardar gasto" está habilitado. |
| 9 | Hacer click en "Guardar gasto". | Aparece el aviso `"Gasto guardado"` con `"Sofía te debe $10.000,00"`. |
| 10 | Escribir `<APP>/debts?status=all` en la barra de direcciones y presionar Enter. | Aparece la fila de `"Sofía"` con `data-testid="debts-item-amount"` igual a `"$10.000,00"`. |

**Post-condición:** 1 gasto de `$10.000,00` y 1 deuda de `$10.000,00`.

---

#### CP-DEU-032 — Deuda de $10.000,01 sobre un gasto de $10.000,00 (un centavo más) muestra "No puede superar el monto del gasto ($10.000,00)" y deshabilita "Guardar gasto"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-41 · CA-3 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · CP-DEU-035 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-032-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: monto del gasto `10000` ARS. D 2: persona `"Sofía"`. D 3: monto adeudado `10000,01`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-032-001@example.com`. | El campo "Email" muestra `qa+cp-deu-032-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1. |
| 5 | Escribir `10000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2, "¿En qué?". |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3, "Revisá y guardá". |
| 7 | Hacer click en el interruptor "Gasto compartido" y escribir `Sofía` en "¿Con quién?". | El campo "¿Con quién?" muestra `Sofía`. |
| 8 | Hacer click en "¿Cuánto te debe?", escribir `10000,01` y hacer click en "¿Con quién?" para quitarle el foco. | Aparece `data-testid="transaction-form-shared-amount-error"` con el texto exacto `"No puede superar el monto del gasto ($10.000,00)"`, `data-testid="transaction-form-shared-summary"` no está en el DOM y "Guardar gasto" está deshabilitado (`disabled`). |

**Post-condición:** 0 filas en `transactions` y `debts`.

---

#### CP-DEU-033 — Gasto de $10.000,00 con deuda de $15.000,00 (sad path de la spec) muestra "No puede superar el monto del gasto ($10.000,00)" y deshabilita "Guardar gasto"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-41 · CA-4 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · CP-DEU-035 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-033-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: monto del gasto `10000` ARS. D 2: persona `"Sofía"`. D 3: monto adeudado `15000`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-033-001@example.com`. | El campo "Email" muestra `qa+cp-deu-033-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1. |
| 5 | Escribir `10000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2, "¿En qué?". |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3, "Revisá y guardá". |
| 7 | Hacer click en el interruptor "Gasto compartido" y escribir `Sofía` en "¿Con quién?". | El campo "¿Con quién?" muestra `Sofía`. |
| 8 | Hacer click en "¿Cuánto te debe?", escribir `15000` y hacer click en "¿Con quién?" para quitarle el foco. | Aparece `data-testid="transaction-form-shared-amount-error"` con el texto exacto `"No puede superar el monto del gasto ($10.000,00)"` y el botón "Guardar gasto" permanece deshabilitado (`disabled`). |

**Post-condición:** 0 filas en `transactions` y `debts`.

---

#### CP-DEU-034 — En un gasto de US$100,01 a TC 1250,5555, una deuda de US$100,01 (igual al gasto) se guarda con amount_ars = 125068.06

| Campo | Contenido |
|---|---|
| Historia · criterio | US-41 · CA-6 (parte 1) · FR-18 |
| Invariante | I7 · C5 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-034-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: monto `100,01` USD. D 2: TC `1250,5555`. D 3: persona `"Sofía"`, monto adeudado `100,01`. D 4: fecha `15/08/2026`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-034-001@example.com`. | El campo "Email" muestra `qa+cp-deu-034-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1. |
| 5 | Hacer click en "US$" (`data-testid="transaction-form-currency-usd"`), escribir `100,01` en el monto y `1250,5555` en "Tipo de cambio (ARS por US$)". | Se habilita "Siguiente". |
| 6 | Hacer click en "Siguiente" y elegir la categoría "Otros". | Se abre el paso 3, "Revisá y guardá". |
| 7 | En la sección "Fecha", hacer click en "Otra" y escribir `15/08/2026`. | El campo de fecha muestra `15/08/2026`. |
| 8 | Hacer click en el interruptor "Gasto compartido", escribir `Sofía` en "¿Con quién?" y `100,01` en "¿Cuánto te debe?". | El resumen muestra `"Sofía te va a deber US$100,01 · Tu parte: US$0,00"`. |
| 9 | Hacer click en "Guardar gasto". | Aparece el aviso `"Gasto guardado"` con `"Sofía te debe US$100,01"`. |
| 10 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=amount_text:amount::text,fx_rate_text:fx_rate::text,amount_ars_text:amount_ars::text`. | Devuelve 1 fila con `amount_text = "100.01"`, `fx_rate_text = "1250.5555"` y `amount_ars_text = "125068.06"`. |

**Post-condición:** 1 gasto en USD y 1 deuda de `US$100,01` (`amount_ars = 125068.06`).

---

#### CP-DEU-035 — Directo contra create_transaction, una deuda de 10000.01 sobre un gasto de 10000.00 ARS se rechaza con "I7: la deuda no puede superar el monto del gasto" y revierte la transacción

| Campo | Contenido |
|---|---|
| Historia · criterio | US-41 · CA-5 · US-82 · CA-15 · FR-18 |
| Invariante | I7 · C4 · C6 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | API · CP-DEU-032, CP-DEU-033 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-035-001@example.com` creado con PR-01. S 2: `<TOKEN>`, `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Pasos 1 y 2).
**Datos de prueba:** D 1: `p_amount = "10000.00"`, `p_occurred_on = "2026-08-15"`. D 2: `p_shared_persons = ["Sofía"]`, `p_shared_amounts = ["10000.01"]`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con cuerpo `{"p_type": "expense", "p_amount": "10000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null, "p_shared_persons": ["Sofía"], "p_shared_amounts": ["10000.01"]}`. | Responde HTTP `400` con `code = "23514"` y `message = "I7: la deuda no puede superar el monto del gasto"`. |
| 2 | Ejecutar las consultas de PR-08 (`transactions`, `ledger_entries` y `GET <SUPABASE_URL>/rest/v1/debts?select=id`). | Las tres devuelven `[]` (atomicidad C4). |

**Post-condición:** 0 filas en `transactions`, `ledger_entries` y `debts`.

---

#### CP-DEU-036 — En un gasto de US$100,01 a TC 1250,5555, una deuda de US$100,02 muestra "No puede superar el monto del gasto (US$100,01)" y deshabilita "Guardar gasto"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-41 · CA-6 (parte 2) · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · CP-DEU-037 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-036-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: monto `100,01` USD. D 2: TC `1250,5555`. D 3: persona `"Sofía"`, monto adeudado `100,02`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-036-001@example.com`. | El campo "Email" muestra `qa+cp-deu-036-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1. |
| 5 | Hacer click en "US$" (`data-testid="transaction-form-currency-usd"`), escribir `100,01` en el monto y `1250,5555` en "Tipo de cambio (ARS por US$)". | Se habilita "Siguiente". |
| 6 | Hacer click en "Siguiente" y elegir la categoría "Otros". | Se abre el paso 3, "Revisá y guardá". |
| 7 | Hacer click en el interruptor "Gasto compartido" y escribir `Sofía` en "¿Con quién?". | El campo "¿Con quién?" muestra `Sofía`. |
| 8 | Hacer click en "¿Cuánto te debe?", escribir `100,02` y hacer click en "¿Con quién?" para quitarle el foco. | Aparece `data-testid="transaction-form-shared-amount-error"` con el texto exacto `"No puede superar el monto del gasto (US$100,01)"` y "Guardar gasto" queda deshabilitado. |

**Post-condición:** 0 filas en `transactions` y `debts`.

---

#### CP-DEU-037 — Directo contra create_transaction, una deuda de 100.02 sobre un gasto de 100.01 USD se rechaza con "I7: la deuda no puede superar el monto del gasto"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-41 · CA-6 · FR-18 |
| Invariante | I7 · C4 · C6 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | API · CP-DEU-036 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-037-001@example.com` creado con PR-01. S 2: `<TOKEN>`, `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Pasos 1 y 2).
**Datos de prueba:** D 1: `p_amount = "100.01"`, `p_currency = "USD"`, `p_fx_rate = "1250.5555"`, `p_occurred_on = "2026-08-15"`. D 2: `p_shared_persons = ["Sofía"]`, `p_shared_amounts = ["100.02"]`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con cuerpo `{"p_type": "expense", "p_amount": "100.01", "p_currency": "USD", "p_fx_rate": "1250.5555", "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null, "p_shared_persons": ["Sofía"], "p_shared_amounts": ["100.02"]}`. | Responde HTTP `400` con `code = "23514"` y `message = "I7: la deuda no puede superar el monto del gasto"`. |
| 2 | Ejecutar las consultas de PR-08 (`transactions` y `debts`). | Ambas devuelven `[]`. |

**Post-condición:** 0 filas en `transactions`, `ledger_entries` y `debts`.

---

#### CP-DEU-038 — Bajar el monto del gasto en el paso 1 por debajo de la deuda ya cargada muestra el error en el paso 3 y deshabilita "Guardar gasto"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-41 · CA-7 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Transición de estados · Negativo |
| Canal · Caso par | UI · CP-DEU-035 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-038-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: monto inicial del gasto `20000` ARS. D 2: persona `"Sofía"`, monto adeudado `15000`. D 3: nuevo monto del gasto `10000` ARS.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-038-001@example.com`. | El campo "Email" muestra `qa+cp-deu-038-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1. |
| 5 | Escribir `20000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2, "¿En qué?". |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3, "Revisá y guardá". |
| 7 | Hacer click en el interruptor "Gasto compartido", escribir `Sofía` en "¿Con quién?" y `15000` en "¿Cuánto te debe?". | Se muestra el resumen `"Sofía te va a deber $15.000,00 · Tu parte: $5.000,00"`. |
| 8 | Hacer click en el chip de resumen del monto (`$20.000,00`) arriba del paso 3 para volver al paso 1. | Se abre el paso 1, "¿Cuánto?". |
| 9 | Reemplazar el monto por `10000` y hacer click en "Siguiente". | Regresa al paso 3: "¿Cuánto te debe?" conserva `15000` (no se ajusta solo), debajo aparece `data-testid="transaction-form-shared-amount-error"` con `"No puede superar el monto del gasto ($10.000,00)"` y el botón "Guardar gasto" está deshabilitado (`disabled`). |

**Post-condición:** 0 filas en `transactions` y `debts`.


---

### Sección 2 — Vínculo con el gasto original y baja lógica (US-35)

#### CP-DEU-039 — GET /rest/v1/debts expone transaction_id con el id del gasto vinculado y los datos embebidos de transactions

| Campo | Contenido |
|---|---|
| Historia · criterio | US-35 · CA-1, CA-2 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-039-001@example.com` creado con PR-01. S 2: `<TOKEN>`, `<USER_ID>` y `<ACCOUNT_ID>` de `"Tarjeta de crédito"` obtenidos con PR-04 (Pasos 1 y 2). S 3: categoría D 1 creada con PR-04 (`POST /rest/v1/categories` con `{"user_id": "<USER_ID>", "name": "Tecnología", "color": "#2E7D5B"}` → `<CAT_TEC_ID>`). S 4: gasto compartido `<TX_ID>` creado con PR-04 (`create_transaction`) usando D 2.
**Datos de prueba:** D 1: categoría `"Tecnología"`, color `"#2E7D5B"`. D 2: `p_type = "expense"`, `p_amount = "120000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_category_id = "<CAT_TEC_ID>"`, `p_account_id = "<ACCOUNT_ID>"`, `p_installments_count = 12`, `p_occurred_on = "2026-08-15"`, `p_description = "Notebook"`, `p_shared_persons = ["Sofía"]`, `p_shared_amounts = ["60000.00"]`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id,person,amount_text:amount::text,transaction_id,transactions(id,amount_text:amount::text,currency,occurred_on,deleted_at,categories(name))`. | Responde HTTP `200` con 1 fila donde `person = "Sofía"`, `amount_text = "60000.00"`, `transaction_id = "<TX_ID>"` y el objeto `transactions` contiene `id = "<TX_ID>"`, `amount_text = "120000.00"`, `currency = "ARS"`, `occurred_on = "2026-08-15"`, `deleted_at = null` y `categories.name = "Tecnología"`. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-040 — En /debts?status=all, una deuda vinculada muestra "Gasto compartido: Tecnología, $120.000,00 del 15/08/2026" en debts-item-origin

| Campo | Contenido |
|---|---|
| Historia · criterio | US-35 · CA-2 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-040-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>`, `<USER_ID>` y `<ACCOUNT_ID>` de `"Tarjeta de crédito"` obtenidos con PR-04 (Pasos 1 y 2). S 3: categoría D 1 creada con PR-04 (`<CAT_TEC_ID>`). S 4: gasto compartido creado con PR-04 (`create_transaction`) usando D 2.
**Datos de prueba:** D 1: categoría `"Tecnología"`, color `"#2E7D5B"`. D 2: `p_type = "expense"`, `p_amount = "120000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_category_id = "<CAT_TEC_ID>"`, `p_account_id = "<ACCOUNT_ID>"`, `p_installments_count = 12`, `p_occurred_on = "2026-08-15"`, `p_description = null`, `p_shared_persons = ["Sofía"]`, `p_shared_amounts = ["60000.00"]`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-040-001@example.com`. | El campo "Email" muestra `qa+cp-deu-040-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts?status=all` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Deudas" con la fila de `"Sofía"` (`data-testid="debts-item"`). |
| 6 | Leer el elemento `data-testid="debts-item-origin"` de la fila de `"Sofía"`. | Muestra el texto exacto `"Gasto compartido: Tecnología, $120.000,00 del 15/08/2026"`. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-041 — En Movimientos, las 12 cuotas de un gasto compartido y "Últimos movimientos" muestran "Compartido con Sofía", mientras que un gasto sin deuda no tiene transactions-item-shared

| Campo | Contenido |
|---|---|
| Historia · criterio | US-35 · CA-3 · FR-18 |
| Invariante | I2, I7 |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-041-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>`, `<ACCOUNT_ID>` de `"Tarjeta de crédito"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Pasos 1 y 2). S 3: gasto compartido en 12 cuotas creado con PR-04 (`create_transaction`) usando D 1. S 4: gasto simple sin deuda creado con PR-04 (`create_transaction`) usando D 2.
**Datos de prueba:** D 1 (gasto compartido): `p_type = "expense"`, `p_amount = "120000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_category_id = "<CATEGORY_ID>"`, `p_account_id = "<ACCOUNT_ID>"`, `p_installments_count = 12`, `p_occurred_on = "2026-08-15"`, `p_description = "Compra compartida"`, `p_shared_persons = ["Sofía"]`, `p_shared_amounts = ["60000.00"]`. D 2 (gasto sin deuda): `p_type = "expense"`, `p_amount = "15000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_category_id = "<CATEGORY_ID>"`, `p_account_id = "<ACCOUNT_ID>"`, `p_installments_count = 1`, `p_occurred_on = "2026-08-15"`, `p_description = "Compra individual"`, `p_shared_persons = null`, `p_shared_amounts = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-041-001@example.com`. | El campo "Email" muestra `qa+cp-deu-041-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/dashboard?period=2026-08` en la barra de direcciones y presionar Enter. | En "Últimos movimientos" del Resumen, la fila de `"Compra compartida"` tiene `data-testid="dashboard-transaction-item-shared"` con `"Compartido con Sofía"`, y la fila de `"Compra individual"` no tiene `data-testid="dashboard-transaction-item-shared"`. |
| 6 | Escribir `<APP>/transactions?period=2026-08` en la barra de direcciones y presionar Enter. | En Movimientos de agosto 2026 (`1/12`), la fila de `"Compra compartida"` muestra `data-testid="transactions-item-shared"` con `"Compartido con Sofía"`, y la fila de `"Compra individual"` no tiene `data-testid="transactions-item-shared"`. |
| 7 | Hacer click en la flecha "Mes siguiente" (`2026-09`) y repetir hasta julio 2027 (`2027-07`, cuota `12/12`). | En cada uno de los 11 meses siguientes (`2/12` a `12/12`), la fila de `"Compra compartida"` muestra `data-testid="transactions-item-shared"` con el texto `"Compartido con Sofía"`. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-042 — En Movimientos, el diálogo "¿Eliminar transacción?" muestra "También deja de contar la deuda con Sofía por $60.000,00." si tiene deuda vinculada y omite el aviso si no tiene deuda

| Campo | Contenido |
|---|---|
| Historia · criterio | US-35 · CA-4 · FR-18 |
| Invariante | I7, I10 |
| Técnica · Tipo | Tabla de decisión · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-042-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>`, `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Pasos 1 y 2). S 3: gasto con deuda D 1 y gasto sin deuda D 2 creados con PR-04 (`create_transaction`).
**Datos de prueba:** D 1 (con deuda): `p_type = "expense"`, `p_amount = "120000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_category_id = "<CATEGORY_ID>"`, `p_account_id = "<ACCOUNT_ID>"`, `p_installments_count = 1`, `p_occurred_on = "2026-08-15"`, `p_description = "Con deuda"`, `p_shared_persons = ["Sofía"]`, `p_shared_amounts = ["60000.00"]`. D 2 (sin deuda): `p_type = "expense"`, `p_amount = "30000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_category_id = "<CATEGORY_ID>"`, `p_account_id = "<ACCOUNT_ID>"`, `p_installments_count = 1`, `p_occurred_on = "2026-08-15"`, `p_description = "Sin deuda"`, `p_shared_persons = null`, `p_shared_amounts = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-042-001@example.com`. | El campo "Email" muestra `qa+cp-deu-042-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/transactions?period=2026-08` en la barra de direcciones y presionar Enter. | Se abre Movimientos de agosto 2026 con las filas `"Con deuda"` y `"Sin deuda"`. |
| 6 | Hacer click en el botón de papelera (`data-testid="transactions-item-delete"`) de la fila `"Con deuda"`. | Se abre el diálogo `"¿Eliminar transacción?"` mostrando el elemento `data-testid="delete-transaction-debt-warning"` con el texto exacto `"También deja de contar la deuda con Sofía por $60.000,00."`. |
| 7 | Hacer click en el botón "Cancelar" del diálogo. | Se cierra el diálogo sin eliminar la transacción. |
| 8 | Hacer click en el botón de papelera (`data-testid="transactions-item-delete"`) de la fila `"Sin deuda"`. | Se abre el diálogo `"¿Eliminar transacción?"` y el elemento `data-testid="delete-transaction-debt-warning"` no existe en el DOM. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-043 — En /debts?status=all, una deuda suelta muestra "Deuda suelta" en debts-item-origin

| Campo | Contenido |
|---|---|
| Historia · criterio | US-35 · CA-2 (parte 2) · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-043-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: deuda suelta creada con PR-04 (`create_debt`) usando D 1.
**Datos de prueba:** D 1: `p_direction = "owed_to_me"`, `p_person = "Juan"`, `p_amount = "20000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-043-001@example.com`. | El campo "Email" muestra `qa+cp-deu-043-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts?status=all` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Deudas" con la fila de `"Juan"`. |
| 6 | Leer el elemento `data-testid="debts-item-origin"` de la fila de `"Juan"`. | Muestra el texto exacto `"Deuda suelta"`. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-043B — En /debts?status=all, una deuda vinculada a un gasto cuya categoría fue archivada sigue mostrando el nombre de la categoría en debts-item-origin

| Campo | Contenido |
|---|---|
| Historia · criterio | US-35 · CA-2 ("Una categoría archivada se muestra con su nombre igual") · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Baja · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-043b-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>`, `<USER_ID>` y `<ACCOUNT_ID>` de `"Efectivo"` obtenidos con PR-04 (Pasos 1 y 2). S 3: categoría D 1 creada con PR-04 (`POST /rest/v1/categories` → `<CAT_ID>`). S 4: gasto compartido creado con PR-04 (`create_transaction`) usando D 2. S 5: categoría `<CAT_ID>` archivada con PR-04 (`PATCH /rest/v1/categories?id=eq.<CAT_ID>` con `{"archived_at": "2026-08-20T12:00:00Z"}`).
**Datos de prueba:** D 1: categoría `"Viajes"`, color `"#2E7D5B"`. D 2: `p_type = "expense"`, `p_amount = "80000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_category_id = "<CAT_ID>"`, `p_account_id = "<ACCOUNT_ID>"`, `p_installments_count = 1`, `p_occurred_on = "2026-08-15"`, `p_description = null`, `p_shared_persons = ["Sofía"]`, `p_shared_amounts = ["40000.00"]`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-043b-001@example.com`. | El campo "Email" muestra `qa+cp-deu-043b-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts?status=all` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Deudas" con la fila de `"Sofía"`. |
| 6 | Leer el elemento `data-testid="debts-item-origin"` de la fila de `"Sofía"`. | Muestra el texto exacto `"Gasto compartido: Viajes, $80.000,00 del 15/08/2026"`. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-044 — Eliminar el gasto vinculado oculta la deuda de /debts, deja de sumarla en "Te deben" y en el neto del Resumen, y conserva intacta su fila en debts

| Campo | Contenido |
|---|---|
| Historia · criterio | US-35 · CA-5 · US-37 · CA-7 · US-30 · CA-5 · FR-18 |
| Invariante | I7, I10 · C10 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-044-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>`, `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Comida"` obtenidos con PR-04 (Pasos 1 y 2). S 3: gasto compartido `<TX_ID>` creado con PR-04 (`create_transaction`) usando D 1.
**Datos de prueba:** D 1: `p_type = "expense"`, `p_amount = "120000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_category_id = "<CATEGORY_ID>"`, `p_account_id = "<ACCOUNT_ID>"`, `p_installments_count = 1`, `p_occurred_on = "2026-08-15"`, `p_description = "Cena"`, `p_shared_persons = ["Sofía"]`, `p_shared_amounts = ["60000.00"]`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-044-001@example.com`. | El campo "Email" muestra `qa+cp-deu-044-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/transactions?period=2026-08` en la barra de direcciones y presionar Enter. | Se abre Movimientos de agosto 2026 con la fila de `"Cena"`. |
| 6 | Hacer click en el botón de papelera (`data-testid="transactions-item-delete"`) de la fila `"Cena"`. | Se abre el diálogo `"¿Eliminar transacción?"` con `"También deja de contar la deuda con Sofía por $60.000,00."`. |
| 7 | Hacer click en el botón "Eliminar" (`data-testid="delete-transaction-confirm"`). | Aparece el aviso `"Transacción eliminada"` y la fila sale de Movimientos. |
| 8 | Escribir `<APP>/debts?status=all` en la barra de direcciones y presionar Enter. | La deuda de `"Sofía"` no aparece en la lista (se ve `data-testid="debts-empty"` con `"No cargaste ninguna deuda todavía."`), `"Te deben"` (`data-testid="debts-total-owed-to-me"`) muestra `"$0,00"` y el neto (`data-testid="debts-net"`) muestra `"En cero"`. |
| 9 | Hacer click en el filtro "Pendientes" (`data-testid="debts-filter-pending"`) y luego en "Saldadas" (`data-testid="debts-filter-settled"`). | En ambos filtros la lista sigue vacía (`data-testid="debts-empty"`). |
| 10 | Escribir `<APP>/dashboard?period=2026-08` en la barra de direcciones y presionar Enter. | El elemento `data-testid="dashboard-net-reimbursements"` no está en el DOM (la deuda del gasto eliminado no cuenta en el neto). |
| 11 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=person,status,settled_at,amount_text:amount::text,transaction_id`. | Devuelve 1 fila intacta con `person = "Sofía"`, `status = "pending"`, `settled_at = null`, `amount_text = "60000.00"` y `transaction_id = "<TX_ID>"`. |

**Post-condición:** 1 transacción con `deleted_at IS NOT NULL` y 1 fila en `debts` intacta (`status = "pending"`).

---

#### CP-DEU-045 — Al restaurar desde Movimientos → Eliminados un gasto cuya deuda vinculada estaba saldada, la deuda vuelve a /debts con estado saldada y la misma fecha settled_at

| Campo | Contenido |
|---|---|
| Historia · criterio | US-35 · CA-6 · FR-18 |
| Invariante | I7, I9, I10 · C10 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-045-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>`, `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Comida"` obtenidos con PR-04 (Pasos 1 y 2). S 3: gasto compartido `<TX_ID>` creado con PR-04 (`create_transaction`) usando D 1 y `<DEBT_ID>` leído con PR-08. S 4: deuda `<DEBT_ID>` saldada con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/settle_debt` con `{"p_debt_id": "<DEBT_ID>"}`) y su `<SETTLED_AT>` leído con PR-08. S 5: gasto `<TX_ID>` eliminado con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/delete_transaction` con `{"p_transaction_id": "<TX_ID>"}`).
**Datos de prueba:** D 1: `p_type = "expense"`, `p_amount = "120000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_category_id = "<CATEGORY_ID>"`, `p_account_id = "<ACCOUNT_ID>"`, `p_installments_count = 1`, `p_occurred_on = "2026-08-15"`, `p_description = "Cena"`, `p_shared_persons = ["Sofía"]`, `p_shared_amounts = ["60000.00"]`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-045-001@example.com`. | El campo "Email" muestra `qa+cp-deu-045-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/transactions?period=2026-08` en la barra de direcciones y presionar Enter. | Se abre Movimientos de agosto 2026. |
| 6 | Hacer click en la pestaña/filtro "Eliminados" de Movimientos. | Se muestra la fila del gasto eliminado `"Cena"`. |
| 7 | Hacer click en el botón "Restaurar" de la fila `"Cena"`. | El gasto se restaura (`deleted_at = null`). |
| 8 | Escribir `<APP>/debts?status=settled` en la barra de direcciones y presionar Enter. | Aparece la fila de `"Sofía"` con `data-status="settled"` y `data-testid="debts-item-status"` igual a `"Saldada el <HOY_DMY>"`. |
| 9 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id,status,settled_at`. | Devuelve 1 fila con `status = "settled"` y `settled_at` exactamente igual a `<SETTLED_AT>`. |

**Post-condición:** gasto activo (`deleted_at = null`) y deuda saldada con su `<SETTLED_AT>` original intacto.

---

#### CP-DEU-046 — Directo contra settle_debt, intentar saldar la deuda de un gasto eliminado responde "La deuda no existe"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-35 · CA-7 · ADR-037 §3, §4 · FR-18 |
| Invariante | I7, I9, I10 · C6 · C10 |
| Técnica · Tipo | Transición de estados · Negativo |
| Canal · Caso par | API · CP-DEU-044 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-046-001@example.com` creado con PR-01. S 2: `<TOKEN>`, `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Pasos 1 y 2). S 3: gasto compartido `<TX_ID>` creado con PR-04 (`create_transaction`) usando D 1 y `<DEBT_ID>` leído con PR-08. S 4: gasto `<TX_ID>` dado de baja lógica con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/delete_transaction` con `{"p_transaction_id": "<TX_ID>"}`).
**Datos de prueba:** D 1: `p_type = "expense"`, `p_amount = "50000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_category_id = "<CATEGORY_ID>"`, `p_account_id = "<ACCOUNT_ID>"`, `p_installments_count = 1`, `p_occurred_on = "2026-08-15"`, `p_description = null`, `p_shared_persons = ["Sofía"]`, `p_shared_amounts = ["25000.00"]`. D 2: `p_debt_id = "<DEBT_ID>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/settle_debt` con cuerpo `{"p_debt_id": "<DEBT_ID>"}`. | Responde HTTP `400` con `code = "23514"` y `message = "La deuda no existe"`. |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id,status,settled_at`. | La fila `<DEBT_ID>` sigue con `status = "pending"` y `settled_at = null`. |

**Post-condición:** la deuda permanece `pending` sin cambios.

---

#### CP-DEU-047 — Directo contra reopen_debt, intentar reabrir la deuda saldada de un gasto eliminado responde "La deuda no existe"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-35 · CA-7 · ADR-037 §3, §4 · FR-18 |
| Invariante | I7, I9, I10 · C6 · C10 |
| Técnica · Tipo | Transición de estados · Negativo |
| Canal · Caso par | API · CP-DEU-044 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-047-001@example.com` creado con PR-01. S 2: `<TOKEN>`, `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Pasos 1 y 2). S 3: gasto compartido `<TX_ID>` creado con PR-04 (`create_transaction`) usando D 1 y `<DEBT_ID>` leído con PR-08. S 4: deuda `<DEBT_ID>` saldada con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/settle_debt` con `{"p_debt_id": "<DEBT_ID>"}`). S 5: gasto `<TX_ID>` dado de baja lógica con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/delete_transaction` con `{"p_transaction_id": "<TX_ID>"}`).
**Datos de prueba:** D 1: `p_type = "expense"`, `p_amount = "50000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_category_id = "<CATEGORY_ID>"`, `p_account_id = "<ACCOUNT_ID>"`, `p_installments_count = 1`, `p_occurred_on = "2026-08-15"`, `p_description = null`, `p_shared_persons = ["Sofía"]`, `p_shared_amounts = ["25000.00"]`. D 2: `p_debt_id = "<DEBT_ID>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/reopen_debt` con cuerpo `{"p_debt_id": "<DEBT_ID>"}`. | Responde HTTP `400` con `code = "23514"` y `message = "La deuda no existe"`. |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id,status,settled_at`. | La fila `<DEBT_ID>` sigue con `status = "settled"` y `settled_at IS NOT NULL`. |

**Post-condición:** la deuda permanece `settled` sin cambios.

---

### Sección 3 — Carga de deuda suelta en `/debts/new` (US-36)

#### CP-DEU-048 — Estado inicial de /debts/new y guardado de una deuda "Me deben" en ARS por $20.000,00 crea una fila pendiente con transaction_id = null en una sola llamada a create_debt

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-1, CA-2, CA-10, CA-14 · FR-18 |
| Invariante | I4, I5, I7, I9 · C6 |
| Técnica · Tipo | Tabla de decisión · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-048-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: dirección `"Me deben"` (`owed_to_me`). D 2: persona `"Juan"`. D 3: monto `20000` ARS. D 4: fecha `<HOY>`. D 5: nota vacía `""`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, abrir las herramientas de desarrollador en la pestaña "Network" (Red), escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-048-001@example.com`. | El campo "Email" muestra `qa+cp-deu-048-001@example.com`. |
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

#### CP-DEU-049 — Guardar una deuda suelta con dirección "Debo" en ARS crea direction = "i_owe" y en la lista muestra "Le debés"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-3 · FR-18 |
| Invariante | I4, I5, I9 |
| Técnica · Tipo | Tabla de decisión · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-049-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: dirección `"Debo"` (`i_owe`). D 2: persona `"Ana"`. D 3: monto `15000` ARS. D 4: fecha `15/08/2026`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-049-001@example.com`. | El campo "Email" muestra `qa+cp-deu-049-001@example.com`. |
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

#### CP-DEU-049B — En /debts/new, una "Persona" con espacios en los extremos ("  Juan  ") se recorta y se guarda como "Juan"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-6 ("Campos: se recortan los extremos") · FR-18 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-049b-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: persona `"  Juan  "`. D 2: monto `20000` ARS. D 3: fecha `15/08/2026`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-049b-001@example.com`. | El campo "Email" muestra `qa+cp-deu-049b-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda". |
| 6 | Escribir `  Juan  ` (con dos espacios adelante y dos atrás) en "Persona" (`data-testid="debt-form-person"`). | El campo muestra `  Juan  `. |
| 7 | Hacer click en "Monto" y escribir `20000`. | Se habilita "Guardar deuda". |
| 8 | En "Fecha", escribir `2026-08-15` y hacer click en "Guardar deuda". | Se abre `/debts?status=pending` y la fila muestra `data-testid="debts-item-person"` con el texto exacto `"Juan"` (sin espacios en los extremos). |

**Post-condición:** 1 deuda suelta con `person = "Juan"`.

---

#### CP-DEU-049C — En /debts/new, una "Nota (opcional)" con solo espacios ("   ") se guarda sin nota (notes = null)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-2 ("vacía o solo espacios se guarda sin nota") · ADR-037 §2 · FR-18 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Baja · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-049c-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: persona `"Juan"`. D 2: monto `20000` ARS. D 3: fecha `15/08/2026`. D 4: nota `"   "` (tres espacios).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-049c-001@example.com`. | El campo "Email" muestra `qa+cp-deu-049c-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda". |
| 6 | Escribir `Juan` en "Persona", `20000` en "Monto", `2026-08-15` en "Fecha" y tres espacios (`   `) en "Nota (opcional)" (`data-testid="debt-form-notes"`). | El botón "Guardar deuda" está habilitado. |
| 7 | Hacer click en "Guardar deuda". | Se abre `/debts?status=pending` y en la fila de `"Juan"` no existe el elemento `data-testid="debts-item-notes"`. |
| 8 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=person,notes`. | Devuelve 1 fila con `person = "Juan"` y `notes = null`. |

**Post-condición:** 1 deuda suelta con `notes = null`.

---

#### CP-DEU-050 — En /debts/new, elegir "US$" con TC de referencia de 1250 precompleta "1.250,00", muestra "≈ $50.000,00" para US$40 y guarda fx_rate = 1250.0000 y amount_ars = 50000.00

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-4 · FR-18 |
| Invariante | I4, I5 · C5 |
| Técnica · Tipo | Tabla de decisión · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-050-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: TC de referencia D 1 cargado con PR-03 / PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/upsert_fx_rate` con `{"p_period": "2026-08-01", "p_ars_per_usd": "1250.0000"}`).
**Datos de prueba:** D 1: período `"2026-08-01"`, TC de referencia `"1250.0000"`. D 2: persona `"Juan"`, monto `40` USD, fecha `15/08/2026`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-050-001@example.com`. | El campo "Email" muestra `qa+cp-deu-050-001@example.com`. |
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

#### CP-DEU-050B — En /debts/new, con "US$" y TC de referencia de 1250 cargado, editar a mano el "Tipo de cambio" a 1300 pisa al de referencia y guarda fx_rate = 1300.0000

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-4 · `docs/07-plan-de-testing.md` §3 (Tabla de decisión fila 4) · FR-18 |
| Invariante | I5 · C5 |
| Técnica · Tipo | Tabla de decisión · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-050b-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: TC de referencia D 1 cargado con PR-04 (`upsert_fx_rate`).
**Datos de prueba:** D 1: `p_period = "2026-08-01"`, `p_ars_per_usd = "1250.0000"`. D 2: persona `"Juan"`, monto `100` USD, TC ingresado a mano `1300`, fecha `15/08/2026`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-050b-001@example.com`. | El campo "Email" muestra `qa+cp-deu-050b-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda". |
| 6 | En "Fecha", escribir `2026-08-15` y hacer click en "US$" (`data-testid="debt-form-currency-usd"`). | El campo "Tipo de cambio (ARS por US$)" aparece sugerido con `1.250,00`. |
| 7 | Hacer click en "Persona", escribir `Juan`, hacer click en "Monto" y escribir `100`. | El equivalente muestra `"≈ $125.000,00"`. |
| 8 | Hacer click en "Tipo de cambio (ARS por US$)" (`data-testid="debt-form-fx-rate"`), borrar el valor sugerido y escribir `1300`. | El equivalente `data-testid="debt-form-fx-ars-equivalent"` cambia a `"≈ $130.000,00"`. |
| 9 | Hacer click en "Guardar deuda". | Se abre `/debts?status=pending` mostrando la fila de `"Juan"` con `US$100,00` y `"≈ $130.000,00"`. |
| 10 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=fx_rate_text:fx_rate::text,amount_ars_text:amount_ars::text`. | Devuelve 1 fila con `fx_rate_text = "1300.0000"` y `amount_ars_text = "130000.00"`. |

**Post-condición:** 1 deuda suelta en USD con `fx_rate = 1300.0000` (el TC manual pisó al de referencia).

---

#### CP-DEU-050C — En /debts/new con "US$", si el usuario no editó el "Tipo de cambio", cambiar la "Fecha" a otro mes actualiza el TC sugerido al del nuevo mes

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-4 ("si el usuario no lo editó, al cambiar la fecha de mes se vuelve a sugerir el del mes nuevo") · FR-18 |
| Invariante | I5 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-050c-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: TC de referencia de agosto (D 1) y de julio (D 2) cargados con PR-04 (`upsert_fx_rate`).
**Datos de prueba:** D 1: `p_period = "2026-08-01"`, `p_ars_per_usd = "1250.0000"`. D 2: `p_period = "2026-07-01"`, `p_ars_per_usd = "1200.0000"`. D 3: fecha inicial `15/08/2026`, fecha nueva `15/07/2026`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-050c-001@example.com`. | El campo "Email" muestra `qa+cp-deu-050c-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda". |
| 6 | En "Fecha" (`data-testid="debt-form-date"`), escribir `2026-08-15` y hacer click en "US$" (`data-testid="debt-form-currency-usd"`). | El campo `data-testid="debt-form-fx-rate"` se completa automáticamente con `1.250,00` (o `1250`). |
| 7 | Sin tocar el campo "Tipo de cambio", cambiar el campo "Fecha" (`data-testid="debt-form-date"`) a `2026-07-15`. | El campo `data-testid="debt-form-fx-rate"` se actualiza automáticamente al TC de julio: `1.200,00` (o `1200`). |

**Post-condición:** sin escrituras en `debts`.

---

#### CP-DEU-050D — En /debts/new con "US$", si el usuario editó a mano el "Tipo de cambio", cambiar la "Fecha" a otro mes respeta el valor editado

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-4 ("si lo editó, se respeta") · FR-18 |
| Invariante | I5 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-050d-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: TC de referencia de agosto (D 1) y de julio (D 2) cargados con PR-04 (`upsert_fx_rate`).
**Datos de prueba:** D 1: `p_period = "2026-08-01"`, `p_ars_per_usd = "1250.0000"`. D 2: `p_period = "2026-07-01"`, `p_ars_per_usd = "1200.0000"`. D 3: TC escrito a mano `1350`. D 4: fecha inicial `15/08/2026`, fecha nueva `15/07/2026`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-050d-001@example.com`. | El campo "Email" muestra `qa+cp-deu-050d-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda". |
| 6 | En "Fecha", escribir `2026-08-15` y hacer click en "US$". | El campo `data-testid="debt-form-fx-rate"` sugiere `1.250,00`. |
| 7 | Hacer click en `data-testid="debt-form-fx-rate"`, borrar el valor y escribir `1350`. | El campo muestra `1350`. |
| 8 | Cambiar el campo "Fecha" (`data-testid="debt-form-date"`) a `2026-07-15`. | El campo `data-testid="debt-form-fx-rate"` conserva `1350` (no se pisa con el `1200` de julio). |

**Post-condición:** sin escrituras en `debts`.

---

#### CP-DEU-051 — En /debts/new, elegir "US$" sin TC de referencia muestra "No tenés un tipo de cambio configurado para este mes", "Ir a Ajustes" y deshabilita "Guardar deuda" con "Falta el tipo de cambio"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-5 · FR-18 |
| Invariante | I5 |
| Técnica · Tipo | Tabla de decisión · Negativo |
| Canal · Caso par | UI · CP-DEU-080 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-051-001@example.com` con contraseña `Clave123!`, creado con PR-01 (sin TC de referencia cargado).
**Datos de prueba:** D 1: persona `"Juan"`, monto `40` USD, fecha `15/08/2026`, TC vacío `""`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-051-001@example.com`. | El campo "Email" muestra `qa+cp-deu-051-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda". |
| 6 | Escribir `Juan` en "Persona", `40` en "Monto", `2026-08-15` en "Fecha" y hacer click en "US$" (`data-testid="debt-form-currency-usd"`). | El campo `data-testid="debt-form-fx-rate"` aparece vacío (`""`), se muestra `data-testid="debt-form-fx-rate-status"` con `"No tenés un tipo de cambio configurado para este mes"`, el enlace `"Ir a Ajustes"` (`data-testid="debt-form-fx-settings"`), y el botón "Guardar deuda" está deshabilitado con `"Falta el tipo de cambio"` en `data-testid="debt-form-hint"`. |
| 7 | Hacer click en "Tipo de cambio (ARS por US$)" y luego hacer click en "Persona" para quitarle el foco sin escribir nada. | Debajo del campo aparece `data-testid="debt-form-fx-rate-error"` con el texto exacto `"Falta el tipo de cambio"`. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-051B — En /debts/new con "US$" sin TC de referencia, hacer click en el enlace "Ir a Ajustes" navega a /settings

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-5 (`debt-form-fx-settings` a `/settings`) · FR-18 |
| Invariante | — |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Baja · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-051b-001@example.com` con contraseña `Clave123!`, creado con PR-01 (sin TC de referencia).
**Datos de prueba:** D 1: moneda `"US$"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-051b-001@example.com`. | El campo "Email" muestra `qa+cp-deu-051b-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda". |
| 6 | Hacer click en "US$" (`data-testid="debt-form-currency-usd"`). | Aparece el enlace "Ir a Ajustes" (`data-testid="debt-form-fx-settings"`). |
| 7 | Hacer click en el enlace "Ir a Ajustes" (`data-testid="debt-form-fx-settings"`). | El navegador navega a `<APP>/settings`. |

**Post-condición:** sin escrituras en `debts`.

---

#### CP-DEU-052 — En /debts/new, dejar "Persona" vacía "" y quitar el foco muestra "Ingresá el nombre de la persona" y deshabilita "Guardar deuda"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-6, CA-14 · FR-18 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · CP-DEU-072 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-052-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: persona vacía `""`. D 2: monto `20000` ARS.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-052-001@example.com`. | El campo "Email" muestra `qa+cp-deu-052-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre "Nueva deuda" con el foco en "Persona" (`data-testid="debt-form-person"`). |
| 6 | Sin escribir nada en "Persona", hacer click en "Monto" (`data-testid="debt-form-amount"`) y escribir `20000`. | Debajo de "Persona" aparece `data-testid="debt-form-person-error"` con el texto exacto `"Ingresá el nombre de la persona"`, y "Guardar deuda" (`data-testid="debt-form-submit"`) permanece deshabilitado (`disabled`). |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-052B — En /debts/new, escribir solo espacios ("   ") en "Persona" y quitar el foco muestra "Ingresá el nombre de la persona" y deshabilita "Guardar deuda"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-6, CA-14 · FR-18 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · CP-DEU-073, CP-DEU-074 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-052b-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: persona `"   "` (tres espacios). D 2: monto `20000` ARS.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-052b-001@example.com`. | El campo "Email" muestra `qa+cp-deu-052b-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre "Nueva deuda" con el foco en "Persona". |
| 6 | Escribir tres espacios (`   `) en "Persona" (`data-testid="debt-form-person"`), hacer click en "Monto" y escribir `20000`. | Debajo de "Persona" aparece `data-testid="debt-form-person-error"` con el texto exacto `"Ingresá el nombre de la persona"`, y "Guardar deuda" permanece deshabilitado (`disabled`). |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-053 — En /debts/new, dejar "Monto" vacío muestra "Ingresá el monto" y deshabilita "Guardar deuda"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-6, CA-14 · FR-18 |
| Invariante | I4 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · CP-DEU-076B |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-053-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: persona `"Juan"`. D 2: monto vacío `""`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-053-001@example.com`. | El campo "Email" muestra `qa+cp-deu-053-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda". |
| 6 | Escribir `Juan` en "Persona", hacer click en "Monto" (`data-testid="debt-form-amount"`) y luego hacer click en "Persona" para quitarle el foco sin escribir nada. | Debajo de "Monto" aparece `data-testid="debt-form-amount-error"` con el texto exacto `"Ingresá el monto"`, y "Guardar deuda" sigue deshabilitado. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-054 — En /debts/new, un "Monto" no numérico ("abc") muestra "Ingresá un número válido"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-6 · FR-18 |
| Invariante | I4 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · CP-DEU-079 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-054-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: persona `"Juan"`. D 2: monto `"abc"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-054-001@example.com`. | El campo "Email" muestra `qa+cp-deu-054-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda". |
| 6 | Escribir `Juan` en "Persona", hacer click en "Monto", escribir `abc` y hacer click en "Persona" para quitarle el foco. | Aparece `data-testid="debt-form-amount-error"` con el texto exacto `"Ingresá un número válido"`, y "Guardar deuda" queda deshabilitado. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-055 — En /debts/new, un "Monto" igual a 0 muestra "El monto debe ser mayor a cero"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-6 · FR-18 |
| Invariante | I4 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · CP-DEU-076 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-055-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: persona `"Juan"`. D 2: monto `"0"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-055-001@example.com`. | El campo "Email" muestra `qa+cp-deu-055-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda". |
| 6 | Escribir `Juan` en "Persona", hacer click en "Monto", escribir `0` y hacer click en "Persona" para quitarle el foco. | Aparece `data-testid="debt-form-amount-error"` con el texto exacto `"El monto debe ser mayor a cero"`, y "Guardar deuda" queda deshabilitado. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-056 — En /debts/new, un "Monto" negativo ("-10") muestra "El monto debe ser mayor a cero"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-6 · FR-18 |
| Invariante | I4 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · CP-DEU-077 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-056-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: persona `"Juan"`. D 2: monto `"-10"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-056-001@example.com`. | El campo "Email" muestra `qa+cp-deu-056-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda". |
| 6 | Escribir `Juan` en "Persona", hacer click en "Monto", escribir `-10` y hacer click en "Persona" para quitarle el foco. | Aparece `data-testid="debt-form-amount-error"` con el texto exacto `"El monto debe ser mayor a cero"`, y "Guardar deuda" queda deshabilitado. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-057 — En /debts/new, un "Monto" con más de 2 decimales ("0,001") muestra "El monto admite hasta 2 decimales"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-6 · FR-18 |
| Invariante | I4 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · CP-DEU-078 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-057-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: persona `"Juan"`. D 2: monto `"0,001"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-057-001@example.com`. | El campo "Email" muestra `qa+cp-deu-057-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda". |
| 6 | Escribir `Juan` en "Persona", hacer click en "Monto", escribir `0,001` y hacer click en "Persona" para quitarle el foco. | Aparece `data-testid="debt-form-amount-error"` con el texto exacto `"El monto admite hasta 2 decimales"`, y "Guardar deuda" queda deshabilitado. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-058 — En /debts/new, el "Monto" mínimo válido de 0,01 ARS se acepta y guarda la deuda por $0,01

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-6 · FR-18 |
| Invariante | I4 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · CP-DEU-076 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-058-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: persona `"Juan"`. D 2: monto `0,01` ARS. D 3: fecha `15/08/2026`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-058-001@example.com`. | El campo "Email" muestra `qa+cp-deu-058-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda". |
| 6 | Escribir `Juan` en "Persona", `0,01` en "Monto" y `2026-08-15` en "Fecha". | El botón "Guardar deuda" se habilita sin errores. |
| 7 | Hacer click en "Guardar deuda". | Aparece `"Deuda guardada"` y en `/debts?status=pending` se ve la fila de `"Juan"` con `data-testid="debts-item-amount"` igual a `"$0,01"`. |

**Post-condición:** 1 deuda de `$0,01` ARS.

---

#### CP-DEU-058B — En /debts/new, el "Monto" máximo válido de 999999999999,99 ARS se acepta y guarda la deuda por $999.999.999.999,99

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-6 · FR-18 |
| Invariante | I4 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · CP-DEU-084B |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-058b-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: persona `"Marta"`. D 2: monto `999999999999,99` ARS. D 3: fecha `15/08/2026`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-058b-001@example.com`. | El campo "Email" muestra `qa+cp-deu-058b-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda". |
| 6 | Escribir `Marta` en "Persona", `999999999999,99` en "Monto" y `2026-08-15` en "Fecha". | El botón "Guardar deuda" se habilita sin errores. |
| 7 | Hacer click en "Guardar deuda". | Aparece `"Deuda guardada"` y en `/debts?status=pending` se ve la fila de `"Marta"` con `data-testid="debts-item-amount"` igual a `"$999.999.999.999,99"`. |

**Post-condición:** 1 deuda de `$999.999.999.999,99` ARS.

---

#### CP-DEU-059 — En /debts/new con moneda ARS, un "Monto" de 1000000000000 muestra "El monto máximo es $999.999.999.999,99"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-6 · FR-18 |
| Invariante | I4 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · CP-DEU-084B |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-059-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: persona `"Juan"`. D 2: moneda `"ARS"`. D 3: monto `"1000000000000"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-059-001@example.com`. | El campo "Email" muestra `qa+cp-deu-059-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda" con moneda "ARS". |
| 6 | Escribir `Juan` en "Persona", hacer click en "Monto", escribir `1000000000000` y hacer click en "Persona" para quitarle el foco. | Aparece `data-testid="debt-form-amount-error"` con el texto exacto `"El monto máximo es $999.999.999.999,99"`, y "Guardar deuda" queda deshabilitado. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-060 — En /debts/new con moneda US$, un "Monto" de 1000000000000 muestra "El monto máximo es US$999.999.999.999,99"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-6 · FR-18 |
| Invariante | I4 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · CP-DEU-084C |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-060-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: persona `"Juan"`. D 2: moneda `"US$"`. D 3: monto `"1000000000000"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-060-001@example.com`. | El campo "Email" muestra `qa+cp-deu-060-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda". |
| 6 | Hacer click en "US$" (`data-testid="debt-form-currency-usd"`), escribir `Juan` en "Persona", hacer click en "Monto", escribir `1000000000000` y hacer click en "Persona" para quitarle el foco. | Aparece `data-testid="debt-form-amount-error"` con el texto exacto `"El monto máximo es US$999.999.999.999,99"`, y "Guardar deuda" queda deshabilitado. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-061 — En /debts/new con US$, Monto = 1000000000 y TC = 1000 muestra "En pesos daría más que el máximo de $999.999.999.999,99"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-6 · FR-18 |
| Invariante | I4 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · CP-DEU-084 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-061-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: persona `"Juan"`. D 2: moneda `"US$"`. D 3: monto `"1000000000"`, TC `"1000"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-061-001@example.com`. | El campo "Email" muestra `qa+cp-deu-061-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda". |
| 6 | Hacer click en "US$", escribir `Juan` en "Persona", escribir `1000000000` en "Monto", escribir `1000` en "Tipo de cambio (ARS por US$)" y hacer click en "Persona". | Aparece `data-testid="debt-form-amount-error"` con el texto exacto `"En pesos daría más que el máximo de $999.999.999.999,99"`, y "Guardar deuda" queda deshabilitado. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-062 — En /debts/new con US$, Monto = 0,01 y TC = 0,4 muestra "En pesos daría menos de $0,01. Revisá el monto o el tipo de cambio"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-6 · FR-18 |
| Invariante | I4 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · CP-DEU-085 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-062-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: persona `"Juan"`. D 2: moneda `"US$"`. D 3: monto `"0,01"`, TC `"0,4"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-062-001@example.com`. | El campo "Email" muestra `qa+cp-deu-062-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda". |
| 6 | Hacer click en "US$", escribir `Juan` en "Persona", escribir `0,01` en "Monto", escribir `0,4` en "Tipo de cambio (ARS por US$)" y hacer click en "Persona". | Aparece `data-testid="debt-form-amount-error"` con el texto exacto `"En pesos daría menos de $0,01. Revisá el monto o el tipo de cambio"`, y "Guardar deuda" queda deshabilitado. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-063 — En /debts/new con US$, Monto = 0,01 y TC = 0,5 se acepta (redondeo half-up a $0,01) y guarda amount_ars = "0.01"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-6 · FR-18 |
| Invariante | I4, I5 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-063-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: persona `"Juan"`. D 2: moneda `"US$"`. D 3: monto `"0,01"`, TC `"0,5"`, fecha `15/08/2026`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-063-001@example.com`. | El campo "Email" muestra `qa+cp-deu-063-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda". |
| 6 | Hacer click en "US$", escribir `Juan` en "Persona", `0,01` en "Monto", `0,5` en "Tipo de cambio (ARS por US$)" y `2026-08-15` en "Fecha". | Se muestra `data-testid="debt-form-fx-ars-equivalent"` con `"≈ $0,01"` y se habilita "Guardar deuda". |
| 7 | Hacer click en "Guardar deuda". | Aparece `"Deuda guardada"` y se abre `/debts?status=pending`. |
| 8 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=amount_text:amount::text,fx_rate_text:fx_rate::text,amount_ars_text:amount_ars::text`. | Devuelve 1 fila con `amount_text = "0.01"`, `fx_rate_text = "0.5000"` y `amount_ars_text = "0.01"`. |

**Post-condición:** 1 deuda en USD con `amount_ars = "0.01"`.

---

#### CP-DEU-064 — En /debts/new con US$, un "Tipo de cambio" no numérico ("abc") muestra "Ingresá un número válido"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-6 · FR-18 |
| Invariante | I5 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · CP-DEU-080 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-064-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: persona `"Juan"`, monto `40` USD, TC `"abc"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-064-001@example.com`. | El campo "Email" muestra `qa+cp-deu-064-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda". |
| 6 | Hacer click en "US$", escribir `Juan` en "Persona", `40` en "Monto", escribir `abc` en "Tipo de cambio (ARS por US$)" (`data-testid="debt-form-fx-rate"`) y hacer click en "Persona". | Aparece `data-testid="debt-form-fx-rate-error"` con el texto exacto `"Ingresá un número válido"`, y "Guardar deuda" queda deshabilitado. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-065 — En /debts/new con US$, un "Tipo de cambio" igual a 0 muestra "El tipo de cambio debe ser mayor a cero"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-6, CA-14 · FR-18 |
| Invariante | I5 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · CP-DEU-083 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-065-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: persona `"Juan"`, monto `40` USD, TC `"0"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-065-001@example.com`. | El campo "Email" muestra `qa+cp-deu-065-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda". |
| 6 | Hacer click en "US$", escribir `Juan` en "Persona", `40` en "Monto", escribir `0` en "Tipo de cambio (ARS por US$)" y hacer click en "Persona". | Aparece `data-testid="debt-form-fx-rate-error"` con el texto exacto `"El tipo de cambio debe ser mayor a cero"`, y "Guardar deuda" queda deshabilitado. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-065B — En /debts/new con US$, un "Tipo de cambio" negativo ("-100") muestra "El tipo de cambio debe ser mayor a cero"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-6 · FR-18 |
| Invariante | I5 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · CP-DEU-083B |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-065b-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: persona `"Juan"`, monto `40` USD, TC `"-100"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-065b-001@example.com`. | El campo "Email" muestra `qa+cp-deu-065b-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda". |
| 6 | Hacer click en "US$", escribir `Juan` en "Persona", `40` en "Monto", escribir `-100` en "Tipo de cambio (ARS por US$)" y hacer click en "Persona". | Aparece `data-testid="debt-form-fx-rate-error"` con el texto exacto `"El tipo de cambio debe ser mayor a cero"`, y "Guardar deuda" queda deshabilitado. |

**Post-condición:** 0 filas en `debts`.


---

#### CP-DEU-066 — En /debts/new con US$, un "Tipo de cambio" con más de 4 decimales ("1250,12345") muestra "Usá hasta 4 decimales"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-6 · FR-18 |
| Invariante | I5 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · — (validación de escala de 4 decimales en cliente; en Postgres `numeric(14,4)` redondea el quinto decimal al convertir el parámetro) |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-066-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: persona `"Juan"`, monto `40` USD, TC `"1250,12345"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-066-001@example.com`. | El campo "Email" muestra `qa+cp-deu-066-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda". |
| 6 | Hacer click en "US$", escribir `Juan` en "Persona", `40` en "Monto", escribir `1250,12345` en "Tipo de cambio (ARS por US$)" y hacer click en "Persona". | Aparece `data-testid="debt-form-fx-rate-error"` con el texto exacto `"Usá hasta 4 decimales"`, y "Guardar deuda" queda deshabilitado. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-067 — En /debts/new con US$, un "Tipo de cambio" mayor a 9.999.999.999,9999 ("10000000000") muestra "El tipo de cambio es demasiado grande"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-6 · FR-18 |
| Invariante | I5 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · CP-DEU-082 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-067-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: persona `"Juan"`, monto `1` USD, TC `"10000000000"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-067-001@example.com`. | El campo "Email" muestra `qa+cp-deu-067-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda". |
| 6 | Hacer click en "US$", escribir `Juan` en "Persona", `1` en "Monto", escribir `10000000000` en "Tipo de cambio (ARS por US$)" y hacer click en "Persona". | Aparece `data-testid="debt-form-fx-rate-error"` con el texto exacto `"El tipo de cambio es demasiado grande"`, y "Guardar deuda" queda deshabilitado. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-068 — En /debts/new, vaciar el campo "Fecha" muestra "Fecha inválida" y deshabilita "Guardar deuda"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-6 · FR-18 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · CP-DEU-087 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-068-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: persona `"Juan"`, monto `20000` ARS, fecha vacía `""`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-068-001@example.com`. | El campo "Email" muestra `qa+cp-deu-068-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda". |
| 6 | Escribir `Juan` en "Persona" y `20000` en "Monto". | Se habilita "Guardar deuda". |
| 7 | Hacer click en "Fecha" (`data-testid="debt-form-date"`), borrar su valor (`Delete`/`Backspace`) y hacer click en "Persona" para quitarle el foco. | Aparece `data-testid="debt-form-date-error"` con el texto exacto `"Fecha inválida"` y el botón "Guardar deuda" queda deshabilitado (`disabled`). |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-069 — En /debts/new, una fecha anterior a hoy (31/12/2025) se acepta y guarda la deuda con fecha 31/12/2025

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-7 · FR-18 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-069-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: persona `"Juan"`. D 2: monto `20000` ARS. D 3: fecha pasada `31/12/2025` (`2025-12-31`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-069-001@example.com`. | El campo "Email" muestra `qa+cp-deu-069-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda". |
| 6 | Escribir `Juan` en "Persona", `20000` en "Monto" y `2025-12-31` (`31/12/2025`) en "Fecha" (`data-testid="debt-form-date"`). | No aparece ningún error y "Guardar deuda" queda habilitado. |
| 7 | Hacer click en "Guardar deuda". | Se abre `/debts?status=pending` y la fila de `"Juan"` muestra `data-testid="debts-item-date"` igual a `"31/12/2025"`. |

**Post-condición:** 1 deuda suelta con `incurred_on = "2025-12-31"`.

---

#### CP-DEU-069B — En /debts/new, una "Persona" de 60 caracteres se acepta y el campo impide escribir el carácter 61

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-7 · FR-18 |
| Invariante | — |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · CP-DEU-075 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-069b-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: cadena de 61 caracteres `"A123456789B123456789C123456789D123456789E123456789F123456789Z"` (los primeros 60 terminan en `9` y el 61 es `Z`). D 2: monto `20000` ARS, fecha `15/08/2026`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-069b-001@example.com`. | El campo "Email" muestra `qa+cp-deu-069b-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda". |
| 6 | Escribir la cadena de 61 caracteres `A123456789B123456789C123456789D123456789E123456789F123456789Z` en "Persona" (`data-testid="debt-form-person"`). | Por `maxlength="60"`, el campo acepta exactamente los primeros 60 caracteres (`A123456789B123456789C123456789D123456789E123456789F123456789`) e impide escribir la `Z` final. |
| 7 | Escribir `20000` en "Monto", `2026-08-15` en "Fecha" y hacer click en "Guardar deuda". | Se abre `/debts?status=pending` mostrando la fila con `data-testid="debts-item-person"` de 60 caracteres exactos. |

**Post-condición:** 1 deuda suelta con `person` de 60 caracteres.

---

#### CP-DEU-069C — En /debts/new, una "Nota (opcional)" de 200 caracteres se acepta y el campo impide escribir el carácter 201

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-7 · FR-18 |
| Invariante | — |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · CP-DEU-088 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-069c-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: cadena de 201 caracteres `"01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789X"` (20 bloques de `"0123456789"` = 200 caracteres, seguidos de `"X"` como carácter 201). D 2: persona `"Juan"`, monto `20000` ARS, fecha `15/08/2026`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-069c-001@example.com`. | El campo "Email" muestra `qa+cp-deu-069c-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda". |
| 6 | Escribir `Juan` en "Persona", `20000` en "Monto" y `2026-08-15` en "Fecha". | Se habilita "Guardar deuda". |
| 7 | Hacer click en "Nota (opcional)" (`data-testid="debt-form-notes"`) y escribir la cadena de 201 caracteres de D 1. | Por `maxlength="200"`, el campo acepta exactamente los primeros 200 caracteres e impide escribir la `X` final. |
| 8 | Hacer click en "Guardar deuda". | Se abre `/debts?status=pending` y `data-testid="debts-item-notes"` muestra los 200 caracteres exactos. |

**Post-condición:** 1 deuda suelta con `notes` de 200 caracteres.

---

#### CP-DEU-070 — En /debts/new, una fecha posterior a hoy (<MAÑANA>) muestra "La fecha no puede ser futura" y deshabilita "Guardar deuda"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-7, CA-14 · FR-18 |
| Invariante | — · ADR-021 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · CP-DEU-086 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-070-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: persona `"Juan"`, monto `20000` ARS, fecha `<MAÑANA>` (`<HOY> + 1 día`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-070-001@example.com`. | El campo "Email" muestra `qa+cp-deu-070-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda". |
| 6 | Escribir `Juan` en "Persona" y `20000` en "Monto". | Se habilita "Guardar deuda". |
| 7 | Hacer click en "Fecha" (`data-testid="debt-form-date"`), escribir `<MAÑANA>` y hacer click en "Persona" para quitarle el foco. | Debajo de "Fecha" aparece `data-testid="debt-form-date-error"` con el texto exacto `"La fecha no puede ser futura"`, y el botón "Guardar deuda" queda deshabilitado (`disabled`). |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-071 — En /debts/new, hacer click en "Cancelar" con datos cargados vuelve a /debts sin crear ninguna deuda

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-11 · FR-18 |
| Invariante | — |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-071-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: persona `"Juan"`, monto `20000` ARS, nota `"Borrador"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-071-001@example.com`. | El campo "Email" muestra `qa+cp-deu-071-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Nueva deuda". |
| 6 | Escribir `Juan` en "Persona", `20000` en "Monto" y `Borrador` en "Nota (opcional)". | Los tres campos muestran los datos ingresados. |
| 7 | Hacer click en el botón "Cancelar" (`data-testid="debt-form-cancel"`). | Vuelve a `/debts` sin mostrar diálogo de confirmación y se ve el estado vacío `"No tenés deudas pendientes."` (`data-testid="debts-empty"`). |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-072 — Directo contra create_debt, p_person = "" se rechaza con "Ingresá el nombre de la persona"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-8 · FR-18 |
| Invariante | C6 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-DEU-052 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-072-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: `p_direction = "owed_to_me"`, `p_person = ""`, `p_amount = "20000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con cuerpo `{"p_direction": "owed_to_me", "p_person": "", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": null, "p_incurred_on": "2026-08-15", "p_notes": null}`. | Responde HTTP `400` con `code = "23514"` y `message = "Ingresá el nombre de la persona"`. |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id`. | Devuelve `[]`. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-073 — Directo contra create_debt, p_person = "   " se rechaza con "Ingresá el nombre de la persona"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-8 · FR-18 |
| Invariante | C6 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-DEU-052B |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-073-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: `p_direction = "owed_to_me"`, `p_person = "   "`, `p_amount = "20000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con cuerpo `{"p_direction": "owed_to_me", "p_person": "   ", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": null, "p_incurred_on": "2026-08-15", "p_notes": null}`. | Responde HTTP `400` con `code = "23514"` y `message = "Ingresá el nombre de la persona"`. |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id`. | Devuelve `[]`. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-074 — Directo contra create_debt, p_person = "\t" se rechaza con "Ingresá el nombre de la persona"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-8 · FR-18 |
| Invariante | C6 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-DEU-052B |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-074-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: `p_direction = "owed_to_me"`, `p_person = "\t"`, `p_amount = "20000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con cuerpo `{"p_direction": "owed_to_me", "p_person": "\t", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": null, "p_incurred_on": "2026-08-15", "p_notes": null}`. | Responde HTTP `400` con `code = "23514"` y `message = "Ingresá el nombre de la persona"`. |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id`. | Devuelve `[]`. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-075 — Directo contra create_debt, p_person de 61 caracteres se rechaza con "La persona admite hasta 60 caracteres"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-8 · FR-18 |
| Invariante | C6 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | API · CP-DEU-069B |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-075-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: `p_person = "A123456789B123456789C123456789D123456789E123456789F123456789Z"` (61 caracteres), `p_amount = "20000.00"`, `p_currency = "ARS"`, `p_incurred_on = "2026-08-15"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con cuerpo `{"p_direction": "owed_to_me", "p_person": "A123456789B123456789C123456789D123456789E123456789F123456789Z", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": null, "p_incurred_on": "2026-08-15", "p_notes": null}`. | Responde HTTP `400` con `code = "23514"` y `message = "La persona admite hasta 60 caracteres"`. |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id`. | Devuelve `[]`. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-076 — Directo contra create_debt, p_amount = 0 se rechaza con "I4: el monto debe ser mayor a cero"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-8 · FR-18 |
| Invariante | I4 · C6 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | API · CP-DEU-055 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-076-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: `p_person = "Juan"`, `p_amount = 0`, `p_currency = "ARS"`, `p_incurred_on = "2026-08-15"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con cuerpo `{"p_direction": "owed_to_me", "p_person": "Juan", "p_amount": 0, "p_currency": "ARS", "p_fx_rate": null, "p_incurred_on": "2026-08-15", "p_notes": null}`. | Responde HTTP `400` con `code = "23514"` y `message = "I4: el monto debe ser mayor a cero"`. |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id`. | Devuelve `[]`. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-076B — Directo contra create_debt, p_amount = null se rechaza con "I4: el monto debe ser mayor a cero"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-8 · ADR-037 §2 · FR-18 |
| Invariante | I4 · C6 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-DEU-053 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-076b-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: `p_person = "Juan"`, `p_amount = null`, `p_currency = "ARS"`, `p_incurred_on = "2026-08-15"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con cuerpo `{"p_direction": "owed_to_me", "p_person": "Juan", "p_amount": null, "p_currency": "ARS", "p_fx_rate": null, "p_incurred_on": "2026-08-15", "p_notes": null}`. | Responde HTTP `400` con `code = "23514"` y `message = "I4: el monto debe ser mayor a cero"`. |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id`. | Devuelve `[]`. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-077 — Directo contra create_debt, p_amount = -10 se rechaza con "I4: el monto debe ser mayor a cero"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-8 · FR-18 |
| Invariante | I4 · C6 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-DEU-056 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-077-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: `p_person = "Juan"`, `p_amount = -10`, `p_currency = "ARS"`, `p_incurred_on = "2026-08-15"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con cuerpo `{"p_direction": "owed_to_me", "p_person": "Juan", "p_amount": -10, "p_currency": "ARS", "p_fx_rate": null, "p_incurred_on": "2026-08-15", "p_notes": null}`. | Responde HTTP `400` con `code = "23514"` y `message = "I4: el monto debe ser mayor a cero"`. |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id`. | Devuelve `[]`. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-078 — Directo contra create_debt, p_amount = 1.001 (literal JSON) se rechaza con "I4: el monto admite hasta 2 decimales"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-8 · FR-18 |
| Invariante | I4 · C6 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | API · CP-DEU-057 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-078-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: `p_person = "Juan"`, `p_amount = 1.001`, `p_currency = "ARS"`, `p_incurred_on = "2026-08-15"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con cuerpo `{"p_direction": "owed_to_me", "p_person": "Juan", "p_amount": 1.001, "p_currency": "ARS", "p_fx_rate": null, "p_incurred_on": "2026-08-15", "p_notes": null}`. | Responde HTTP `400` con `code = "23514"` y `message = "I4: el monto admite hasta 2 decimales"`. |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id`. | Devuelve `[]`. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-079 — Directo contra create_debt, p_amount = "NaN" se rechaza con "I4: el monto debe ser mayor a cero"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-8 · ADR-037 §2 · FR-18 |
| Invariante | I4 · C6 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-DEU-054 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-079-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: `p_person = "Juan"`, `p_amount = "NaN"`, `p_currency = "ARS"`, `p_incurred_on = "2026-08-15"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con cuerpo `{"p_direction": "owed_to_me", "p_person": "Juan", "p_amount": "NaN", "p_currency": "ARS", "p_fx_rate": null, "p_incurred_on": "2026-08-15", "p_notes": null}`. | Responde HTTP `400` con `code = "23514"` y `message = "I4: el monto debe ser mayor a cero"`. |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id`. | Devuelve `[]`. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-080 — Directo contra create_debt, p_currency = "USD" con p_fx_rate = null se rechaza con "I5: fx_rate es obligatorio si y solo si la moneda es USD"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-8 · FR-18 |
| Invariante | I5 · C6 |
| Técnica · Tipo | Tabla de decisión · Negativo |
| Canal · Caso par | API · CP-DEU-051, CP-DEU-064 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-080-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: `p_person = "Juan"`, `p_amount = "40.00"`, `p_currency = "USD"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con cuerpo `{"p_direction": "owed_to_me", "p_person": "Juan", "p_amount": "40.00", "p_currency": "USD", "p_fx_rate": null, "p_incurred_on": "2026-08-15", "p_notes": null}`. | Responde HTTP `400` con `code = "23514"` y `message = "I5: fx_rate es obligatorio si y solo si la moneda es USD"`. |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id`. | Devuelve `[]`. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-081 — Directo contra create_debt, p_currency = "ARS" con p_fx_rate = "1250.0000" se rechaza con "I5: fx_rate es obligatorio si y solo si la moneda es USD"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-8 · FR-18 |
| Invariante | I5 · C6 |
| Técnica · Tipo | Tabla de decisión · Negativo |
| Canal · Caso par | API · CP-DEU-048 (la UI oculta el campo TC cuando la moneda es ARS) |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-081-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: `p_person = "Juan"`, `p_amount = "20000.00"`, `p_currency = "ARS"`, `p_fx_rate = "1250.0000"`, `p_incurred_on = "2026-08-15"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con cuerpo `{"p_direction": "owed_to_me", "p_person": "Juan", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": "1250.0000", "p_incurred_on": "2026-08-15", "p_notes": null}`. | Responde HTTP `400` con `code = "23514"` y `message = "I5: fx_rate es obligatorio si y solo si la moneda es USD"`. |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id`. | Devuelve `[]`. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-082 — Directo contra create_debt, p_fx_rate = 10000000000 se rechaza con "El tipo de cambio es demasiado grande"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-8 · FR-18 |
| Invariante | I5 · C6 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | API · CP-DEU-067 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-082-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: `p_person = "Juan"`, `p_amount = "1.00"`, `p_currency = "USD"`, `p_fx_rate = 10000000000`, `p_incurred_on = "2026-08-15"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con cuerpo `{"p_direction": "owed_to_me", "p_person": "Juan", "p_amount": "1.00", "p_currency": "USD", "p_fx_rate": 10000000000, "p_incurred_on": "2026-08-15", "p_notes": null}`. | Responde HTTP `400` con `code = "23514"` y `message = "El tipo de cambio es demasiado grande"`. |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id`. | Devuelve `[]`. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-083 — Directo contra create_debt, p_fx_rate = 0 se rechaza con "I5: fx_rate debe ser mayor a cero"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-8 · ADR-037 §2 · FR-18 |
| Invariante | I5 · C6 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | API · CP-DEU-065 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-083-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: `p_person = "Juan"`, `p_amount = "40.00"`, `p_currency = "USD"`, `p_fx_rate = 0`, `p_incurred_on = "2026-08-15"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con cuerpo `{"p_direction": "owed_to_me", "p_person": "Juan", "p_amount": "40.00", "p_currency": "USD", "p_fx_rate": 0, "p_incurred_on": "2026-08-15", "p_notes": null}`. | Responde HTTP `400` con `code = "23514"` y `message = "I5: fx_rate debe ser mayor a cero"`. |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id`. | Devuelve `[]`. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-083B — Directo contra create_debt, p_fx_rate = -100 se rechaza con "I5: fx_rate debe ser mayor a cero"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-8 · ADR-037 §2 · FR-18 |
| Invariante | I5 · C6 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-DEU-065B |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-083b-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: `p_person = "Juan"`, `p_amount = "40.00"`, `p_currency = "USD"`, `p_fx_rate = -100`, `p_incurred_on = "2026-08-15"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con cuerpo `{"p_direction": "owed_to_me", "p_person": "Juan", "p_amount": "40.00", "p_currency": "USD", "p_fx_rate": -100, "p_incurred_on": "2026-08-15", "p_notes": null}`. | Responde HTTP `400` con `code = "23514"` y `message = "I5: fx_rate debe ser mayor a cero"`. |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id`. | Devuelve `[]`. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-084 — Directo contra create_debt, USD 1000000000 a TC 1000 se rechaza con "En pesos daría más que el máximo de $999.999.999.999,99"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-8 · FR-18 |
| Invariante | I4 · C6 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | API · CP-DEU-061 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-084-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: `p_person = "Juan"`, `p_amount = "1000000000.00"`, `p_currency = "USD"`, `p_fx_rate = "1000.0000"`, `p_incurred_on = "2026-08-15"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con cuerpo `{"p_direction": "owed_to_me", "p_person": "Juan", "p_amount": "1000000000.00", "p_currency": "USD", "p_fx_rate": "1000.0000", "p_incurred_on": "2026-08-15", "p_notes": null}`. | Responde HTTP `400` con `code = "23514"` y `message = "En pesos daría más que el máximo de $999.999.999.999,99"`. |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id`. | Devuelve `[]`. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-084B — Directo contra create_debt, p_amount = "1000000000000.00" en ARS se rechaza por desborde de numeric(14,2) (code = "22003")

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-8 · ADR-037 §2 ("el tope en la moneda original lo da la columna numeric(14,2)") · FR-18 |
| Invariante | I4 · C6 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | API · CP-DEU-059 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-084b-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: `p_person = "Juan"`, `p_amount = "1000000000000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con cuerpo `{"p_direction": "owed_to_me", "p_person": "Juan", "p_amount": "1000000000000.00", "p_currency": "ARS", "p_fx_rate": null, "p_incurred_on": "2026-08-15", "p_notes": null}`. | Responde HTTP `400` con `code = "22003"` (`numeric field overflow`) sin insertar filas. |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id`. | Devuelve `[]`. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-084C — Directo contra create_debt, p_amount = "1000000000000.00" en USD a TC "0.5000" se rechaza por desborde de numeric(14,2) (code = "22003")

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-8 · ADR-037 §2 ("el tope en la moneda original lo da la columna numeric(14,2)") · FR-18 |
| Invariante | I4 · C6 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | API · CP-DEU-060 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-084c-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: `p_person = "Juan"`, `p_amount = "1000000000000.00"`, `p_currency = "USD"`, `p_fx_rate = "0.5000"`, `p_incurred_on = "2026-08-15"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con cuerpo `{"p_direction": "owed_to_me", "p_person": "Juan", "p_amount": "1000000000000.00", "p_currency": "USD", "p_fx_rate": "0.5000", "p_incurred_on": "2026-08-15", "p_notes": null}`. | Responde HTTP `400` con `code = "22003"` (`numeric field overflow`) sin insertar filas. |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id`. | Devuelve `[]`. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-085 — Directo contra create_debt, USD 0.01 a TC 0.4 se rechaza con "I4: en pesos daría menos de $0,01"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-8 · FR-18 |
| Invariante | I4 · C6 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | API · CP-DEU-062 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-085-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: `p_person = "Juan"`, `p_amount = "0.01"`, `p_currency = "USD"`, `p_fx_rate = "0.4000"`, `p_incurred_on = "2026-08-15"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con cuerpo `{"p_direction": "owed_to_me", "p_person": "Juan", "p_amount": "0.01", "p_currency": "USD", "p_fx_rate": "0.4000", "p_incurred_on": "2026-08-15", "p_notes": null}`. | Responde HTTP `400` con `code = "23514"` y `message = "I4: en pesos daría menos de $0,01"`. |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id`. | Devuelve `[]`. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-086 — Directo contra create_debt, p_incurred_on = "<MAÑANA>" se rechaza con "La fecha no puede ser posterior a hoy"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-8 · FR-18 |
| Invariante | C6 · ADR-021 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | API · CP-DEU-070 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-086-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: `p_person = "Juan"`, `p_amount = "20000.00"`, `p_currency = "ARS"`, `p_incurred_on = "<MAÑANA>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con cuerpo `{"p_direction": "owed_to_me", "p_person": "Juan", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": null, "p_incurred_on": "<MAÑANA>", "p_notes": null}`. | Responde HTTP `400` con `code = "23514"` y `message = "La fecha no puede ser posterior a hoy"`. |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id`. | Devuelve `[]`. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-087 — Directo contra create_debt, p_incurred_on = null se rechaza con "La fecha es obligatoria"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-8 · ADR-037 §2 · FR-18 |
| Invariante | C6 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-DEU-068 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-087-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: `p_person = "Juan"`, `p_amount = "20000.00"`, `p_currency = "ARS"`, `p_incurred_on = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con cuerpo `{"p_direction": "owed_to_me", "p_person": "Juan", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": null, "p_incurred_on": null, "p_notes": null}`. | Responde HTTP `400` con `code = "23514"` y `message = "La fecha es obligatoria"`. |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id`. | Devuelve `[]`. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-088 — Directo contra create_debt, una nota de 201 caracteres se rechaza con "La nota admite hasta 200 caracteres"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-8 · FR-18 |
| Invariante | C6 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | API · CP-DEU-069C |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-088-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: `p_notes = "01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789X"` (201 caracteres).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con cuerpo `{"p_direction": "owed_to_me", "p_person": "Juan", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": null, "p_incurred_on": "2026-08-15", "p_notes": "01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789X"}`. | Responde HTTP `400` con `code = "23514"` y `message = "La nota admite hasta 200 caracteres"`. |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id`. | Devuelve `[]`. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-089 — Directo contra create_debt, p_direction = null se rechaza con "Dirección y moneda son obligatorias"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-8 · ADR-037 §2 · FR-18 |
| Invariante | C6 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-DEU-048 (en la UI el selector "Dirección" siempre tiene una opción elegida) |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-089-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: `p_direction = null`, `p_person = "Juan"`, `p_amount = "20000.00"`, `p_currency = "ARS"`, `p_incurred_on = "2026-08-15"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con cuerpo `{"p_direction": null, "p_person": "Juan", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": null, "p_incurred_on": "2026-08-15", "p_notes": null}`. | Responde HTTP `400` con `code = "23514"` y `message = "Dirección y moneda son obligatorias"`. |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id`. | Devuelve `[]`. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-089B — Directo contra create_debt, p_currency = null se rechaza con "Dirección y moneda son obligatorias"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-8 · ADR-037 §2 · FR-18 |
| Invariante | C6 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-DEU-048 (en la UI el selector "Moneda" siempre tiene una opción elegida) |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-089b-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: `p_direction = "owed_to_me"`, `p_person = "Juan"`, `p_amount = "20000.00"`, `p_currency = null`, `p_incurred_on = "2026-08-15"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con cuerpo `{"p_direction": "owed_to_me", "p_person": "Juan", "p_amount": "20000.00", "p_currency": null, "p_fx_rate": null, "p_incurred_on": "2026-08-15", "p_notes": null}`. | Responde HTTP `400` con `code = "23514"` y `message = "Dirección y moneda son obligatorias"`. |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id`. | Devuelve `[]`. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-090 — Directo contra create_debt, p_currency = "EUR" (fuera del enum) se rechaza con code = "22P02"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-8 · FR-18 |
| Invariante | C6 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-DEU-048 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-090-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: `p_currency = "EUR"`, `p_person = "Juan"`, `p_amount = "20000.00"`, `p_incurred_on = "2026-08-15"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con cuerpo `{"p_direction": "owed_to_me", "p_person": "Juan", "p_amount": "20000.00", "p_currency": "EUR", "p_fx_rate": null, "p_incurred_on": "2026-08-15", "p_notes": null}`. | Responde HTTP `400` con `code = "22P02"` (`invalid input value for enum currency_code: "EUR"`). |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id`. | Devuelve `[]`. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-091 — Directo contra create_debt, p_direction = "x" (fuera del enum) se rechaza con code = "22P02"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-8 · FR-18 |
| Invariante | C6 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-DEU-048 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-091-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: `p_direction = "x"`, `p_person = "Juan"`, `p_amount = "20000.00"`, `p_currency = "ARS"`, `p_incurred_on = "2026-08-15"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con cuerpo `{"p_direction": "x", "p_person": "Juan", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": null, "p_incurred_on": "2026-08-15", "p_notes": null}`. | Responde HTTP `400` con `code = "22P02"` (`invalid input value for enum debt_direction: "x"`). |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id`. | Devuelve `[]`. |

**Post-condición:** 0 filas en `debts`.

---

#### CP-DEU-092 — Directo contra create_debt con el rol anon (sin Authorization) responde 42501 (permission denied)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-8 · FR-18 |
| Invariante | C7 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Canal · Caso par | API · CP-DEU-108C |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: ninguno (llamada sin sesión).
**Datos de prueba:** D 1: cuerpo válido `{"p_direction": "owed_to_me", "p_person": "Juan", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": null, "p_incurred_on": "2026-08-15", "p_notes": null}` enviado solo con `apikey: <ANON_KEY>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar un `POST <SUPABASE_URL>/rest/v1/rpc/create_debt` enviando únicamente `-H "apikey: <ANON_KEY>"` y `-H "Content-Type: application/json"` (sin `Authorization`), con el cuerpo de D 1. | Responde HTTP `401` o `403` con `code = "42501"` (`permission denied for function create_debt`). |

**Post-condición:** 0 filas creadas.

---

#### CP-DEU-093 — Un POST /rest/v1/debts directo con sesión autenticada responde 42501 (permission denied) y no crea filas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 · CA-9 · ADR-037 §1 · FR-18 |
| Invariante | C7 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Canal · Caso par | API · CP-DEU-048 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-093-001@example.com` creado con PR-01. S 2: `<TOKEN>` y `<USER_ID>` obtenidos con PR-04 (Paso 1).
**Datos de prueba:** D 1: `{"user_id": "<USER_ID>", "direction": "owed_to_me", "person": "Juan", "amount": "20000.00", "currency": "ARS", "status": "pending", "incurred_on": "2026-08-15"}`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/debts` con el cuerpo de D 1. | Responde HTTP `403` con `code = "42501"` (`permission denied for table debts`). |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id`. | Devuelve `[]`. |

**Post-condición:** 0 filas en `debts`.

---

### Sección 4 — Totales de deudas, listado y filtro por estado (US-37, US-38)

#### CP-DEU-094 — La tarjeta de totales suma las deudas pendientes en pesos (incluyendo USD al TC congelado), excluye las saldadas y no cambia al cambiar el filtro de estado

| Campo | Contenido |
|---|---|
| Historia · criterio | US-37 · CA-1, CA-4 · US-38 · CA-6 · FR-18 |
| Invariante | C5 |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-094-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: 4 deudas creadas con PR-04 (`create_debt`) usando D 1, D 2, D 3 y D 4, y la deuda D 4 saldada con PR-04 (`settle_debt`).
**Datos de prueba:**
- D 1: `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "60000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null` (pendiente).
- D 2: `p_direction = "owed_to_me"`, `p_person = "Juan"`, `p_amount = "40.00"`, `p_currency = "USD"`, `p_fx_rate = "1250.0000"`, `p_incurred_on = "2026-08-16"`, `p_notes = null` (pendiente, `amount_ars = 50000.00`).
- D 3: `p_direction = "i_owe"`, `p_person = "Ana"`, `p_amount = "15000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-17"`, `p_notes = null` (pendiente).
- D 4: `p_direction = "owed_to_me"`, `p_person = "Pedro"`, `p_amount = "8000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-10"`, `p_notes = null` (saldada con `settle_debt`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-094-001@example.com`. | El campo "Email" muestra `qa+cp-deu-094-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts` en la barra de direcciones y presionar Enter. | En `data-testid="debts-totals"`: `"Te deben"` (`data-testid="debts-total-owed-to-me"`) muestra `"$110.000,00"` (`60000 + 50000`, sin los `8000` saldados de Pedro), `"Debés"` (`data-testid="debts-total-i-owe"`) muestra `"$15.000,00"`, el neto (`data-testid="debts-net"`) muestra `"A tu favor $95.000,00"` y `data-testid="debts-totals-note"` muestra `"Solo suman las deudas pendientes."`. En la lista, la fila de `"Juan"` muestra `US$40,00` (`data-testid="debts-item-amount"`) y `"≈ $50.000,00"` (`data-testid="debts-item-amount-ars"`), mientras que las filas en ARS no tienen `data-testid="debts-item-amount-ars"`. |
| 6 | Hacer click en el filtro "Saldadas" (`data-testid="debts-filter-settled"`). | La tarjeta de totales sigue mostrando `"$110.000,00"`, `"$15.000,00"` y `"A tu favor $95.000,00"`. |
| 7 | Hacer click en el filtro "Todas" (`data-testid="debts-filter-all"`). | La tarjeta de totales sigue mostrando `"$110.000,00"`, `"$15.000,00"` y `"A tu favor $95.000,00"`. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-095 — Cuando "Debés" supera a "Te deben", el neto muestra "En contra $5.000,00"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-37 · CA-2 · FR-18 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-095-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: 2 deudas pendientes creadas con PR-04 (`create_debt`) usando D 1 y D 2.
**Datos de prueba:**
- D 1: `p_direction = "i_owe"`, `p_person = "Ana"`, `p_amount = "15000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.
- D 2: `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "10000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-095-001@example.com`. | El campo "Email" muestra `qa+cp-deu-095-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts` en la barra de direcciones y presionar Enter. | `"Te deben"` muestra `"$10.000,00"`, `"Debés"` muestra `"$15.000,00"` y `data-testid="debts-net"` muestra el texto exacto `"En contra $5.000,00"`. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-096 — Cuando "Te deben" y "Debés" son iguales ($25.000,00), el neto muestra "En cero"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-37 · CA-3 (parte 1) · FR-18 |
| Invariante | — |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-096-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: 2 deudas pendientes creadas con PR-04 (`create_debt`) usando D 1 y D 2.
**Datos de prueba:**
- D 1: `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "25000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.
- D 2: `p_direction = "i_owe"`, `p_person = "Ana"`, `p_amount = "25000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-096-001@example.com`. | El campo "Email" muestra `qa+cp-deu-096-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts` en la barra de direcciones y presionar Enter. | `"Te deben"` muestra `"$25.000,00"`, `"Debés"` muestra `"$25.000,00"` y `data-testid="debts-net"` muestra el texto exacto `"En cero"`. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-097 — Sin deudas pendientes, la tarjeta de totales muestra "$0,00" en ambos totales y "En cero" en el neto

| Campo | Contenido |
|---|---|
| Historia · criterio | US-37 · CA-3 (parte 2) · FR-18 |
| Invariante | — |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-097-001@example.com` con contraseña `Clave123!`, creado con PR-01 (sin deudas cargadas).
**Datos de prueba:** D 1: 0 deudas en `debts`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-097-001@example.com`. | El campo "Email" muestra `qa+cp-deu-097-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts` en la barra de direcciones y presionar Enter. | `"Te deben"` (`data-testid="debts-total-owed-to-me"`) muestra `"$0,00"`, `"Debés"` (`data-testid="debts-total-i-owe"`) muestra `"$0,00"` y `data-testid="debts-net"` muestra `"En cero"`. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-098 — Cambiar el TC de referencia del mes a 1400 no modifica "Te deben" de una deuda en USD ya creada a TC 1250 (C5)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-37 · CA-6 · FR-18 |
| Invariante | C5 · ADR-002 |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-098-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: TC de referencia D 1 cargado con PR-04 (`upsert_fx_rate`). S 4: deuda en USD D 2 creada con PR-04 (`create_debt`). S 5: TC de referencia de agosto actualizado con PR-04 (`upsert_fx_rate`) usando D 3.
**Datos de prueba:**
- D 1: `p_period = "2026-08-01"`, `p_ars_per_usd = "1250.0000"`.
- D 2: `p_direction = "owed_to_me"`, `p_person = "Juan"`, `p_amount = "40.00"`, `p_currency = "USD"`, `p_fx_rate = "1250.0000"`, `p_incurred_on = "2026-08-16"`, `p_notes = null` (`amount_ars = 50000.00`).
- D 3: `p_period = "2026-08-01"`, `p_ars_per_usd = "1400.0000"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-098-001@example.com`. | El campo "Email" muestra `qa+cp-deu-098-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts` en la barra de direcciones y presionar Enter. | `"Te deben"` (`data-testid="debts-total-owed-to-me"`) muestra `"$50.000,00"` (no `"$56.000,00"`), el neto muestra `"A tu favor $50.000,00"` y la fila de `"Juan"` muestra `"≈ $50.000,00"`. |

**Post-condición:** sin cambios en `debts`.

---

#### CP-DEU-099 — /debts sin parámetros muestra "Pendientes" seleccionado y solo pendientes; tocar "Saldadas" y "Todas" actualiza ?status= y filtra la lista

| Campo | Contenido |
|---|---|
| Historia · criterio | US-38 · CA-1, CA-2, CA-6, CA-11 · FR-18 |
| Invariante | C11 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-099-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: deudas D 1 y D 2 creadas con PR-04 (`create_debt`), y D 2 saldada con PR-04 (`settle_debt`).
**Datos de prueba:**
- D 1 (pendiente): `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "60000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = "Almuerzo"`.
- D 2 (saldada): `p_direction = "i_owe"`, `p_person = "Pedro"`, `p_amount = "8000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-10"`, `p_notes = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-099-001@example.com`. | El campo "Email" muestra `qa+cp-deu-099-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts` en la barra de direcciones y presionar Enter. | Se abre la pantalla con título `"Deudas"` (`data-testid="debts-title"`), botón `"Nueva deuda"` (`data-testid="debts-new"`), el filtro `"Pendientes"` (`data-testid="debts-filter-pending"`) con `aria-checked="true"`, y en `data-testid="debts-list"` únicamente la fila de `"Sofía"` (`data-status="pending"`, `data-testid="debts-item-direction"` = `"Te debe"`, `data-testid="debts-item-notes"` = `"Almuerzo"`, `data-testid="debts-item-status"` = `"Pendiente"`, botón `"Marcar saldada"`). |
| 6 | Hacer click en el filtro "Saldadas" (`data-testid="debts-filter-settled"`). | La URL cambia a `<APP>/debts?status=settled`, `"Saldadas"` tiene `aria-checked="true"` y la lista muestra únicamente la fila de `"Pedro"` (`data-status="settled"`, `data-testid="debts-item-direction"` = `"Le debés"`, botón `"Volver a pendiente"`). |
| 7 | Hacer click en el filtro "Todas" (`data-testid="debts-filter-all"`). | La URL cambia a `<APP>/debts?status=all`, `"Todas"` tiene `aria-checked="true"` y la lista muestra las 2 filas (`"Sofía"` y `"Pedro"`). |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-100 — Abrir directamente /debts?status=settled y recargar la página conserva "Saldadas" seleccionado y muestra solo saldadas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-38 · CA-3 · FR-18 |
| Invariante | C11 |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-100-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: deudas D 1 y D 2 creadas con PR-04 (`create_debt`), y D 2 saldada con PR-04 (`settle_debt`).
**Datos de prueba:**
- D 1 (pendiente): `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "60000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.
- D 2 (saldada): `p_direction = "owed_to_me"`, `p_person = "Pedro"`, `p_amount = "8000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-10"`, `p_notes = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-100-001@example.com`. | El campo "Email" muestra `qa+cp-deu-100-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts?status=settled` en la barra de direcciones y presionar Enter. | `"Saldadas"` (`data-testid="debts-filter-settled"`) aparece con `aria-checked="true"` y solo se ve la fila de `"Pedro"`. |
| 6 | Recargar la página del navegador (`F5`). | La URL sigue siendo `<APP>/debts?status=settled`, `"Saldadas"` conserva `aria-checked="true"` y solo se ve la fila de `"Pedro"`. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-101 — Abrir /debts?status=xyz se comporta como "Pendientes" y al tocar "Saldadas" reemplaza el parámetro por ?status=settled

| Campo | Contenido |
|---|---|
| Historia · criterio | US-38 · CA-4 · FR-18 |
| Invariante | C11 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · — (parámetro de URL del router cliente) |
| Prioridad · Camino feliz · Automatizable | Baja · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-101-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: deudas D 1 y D 2 creadas con PR-04 (`create_debt`), y D 2 saldada con PR-04 (`settle_debt`).
**Datos de prueba:**
- D 1 (pendiente): `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "60000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.
- D 2 (saldada): `p_direction = "owed_to_me"`, `p_person = "Pedro"`, `p_amount = "8000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-10"`, `p_notes = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-101-001@example.com`. | El campo "Email" muestra `qa+cp-deu-101-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts?status=xyz` en la barra de direcciones y presionar Enter. | `"Pendientes"` (`data-testid="debts-filter-pending"`) tiene `aria-checked="true"` y la lista muestra solo la fila pendiente de `"Sofía"`. |
| 6 | Hacer click en el filtro "Saldadas" (`data-testid="debts-filter-settled"`). | La URL pasa a `<APP>/debts?status=settled` y se muestra solo la fila de `"Pedro"`. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-102 — En /debts con filtro "Pendientes", las deudas se ordenan por fecha incurred_on descendente y, a igual fecha, por created_at descendente

| Campo | Contenido |
|---|---|
| Historia · criterio | US-38 · CA-5 (parte 1) · FR-18 |
| Invariante | — |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-102-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: 3 deudas pendientes creadas secuencialmente (esperando 2 segundos entre cada llamada) con PR-04 (`create_debt`) usando D 1, D 2 y D 3.
**Datos de prueba:**
- D 1 (creada 1.ª): `p_direction = "owed_to_me"`, `p_person = "Ana"`, `p_amount = "10000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-10-01"`, `p_notes = null`.
- D 2 (creada 2.ª): `p_direction = "owed_to_me"`, `p_person = "Beto"`, `p_amount = "20000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.
- D 3 (creada 3.ª, 2 s después de Ana): `p_direction = "owed_to_me"`, `p_person = "Carla"`, `p_amount = "30000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-10-01"`, `p_notes = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-102-001@example.com`. | El campo "Email" muestra `qa+cp-deu-102-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts` en la barra de direcciones y presionar Enter. | En "Pendientes", las 3 filas aparecen de arriba hacia abajo en el orden exacto: 1.º `"Carla"` (`01/10/2026`, creada más reciente), 2.º `"Ana"` (`01/10/2026`, creada antes), 3.º `"Beto"` (`15/08/2026`). |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-102B — En /debts?status=settled ("Saldadas"), las deudas se ordenan por fecha de saldada (settled_at) descendente

| Campo | Contenido |
|---|---|
| Historia · criterio | US-38 · CA-5 (parte 2) · FR-18 |
| Invariante | — |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-102b-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: deudas D 1 y D 2 creadas con PR-04 (`create_debt`); primero se salda D 1 con `settle_debt` y, esperando 2 segundos, se salda D 2 con `settle_debt`.
**Datos de prueba:**
- D 1 (saldada 1.ª): `p_direction = "owed_to_me"`, `p_person = "Diego"`, `p_amount = "15000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-10"`, `p_notes = null`.
- D 2 (saldada 2.ª, 2 s después): `p_direction = "owed_to_me"`, `p_person = "Elena"`, `p_amount = "25000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-05"`, `p_notes = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-102b-001@example.com`. | El campo "Email" muestra `qa+cp-deu-102b-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts?status=settled` en la barra de direcciones y presionar Enter. | En "Saldadas", las 2 filas aparecen de arriba hacia abajo en el orden exacto: 1.º `"Elena"` (saldada más recientemente), 2.º `"Diego"`. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-103 — Estado vacío en "Pendientes" muestra "No tenés deudas pendientes." y el botón "Cargar una deuda" que navega a /debts/new

| Campo | Contenido |
|---|---|
| Historia · criterio | US-38 · CA-7, CA-11 · FR-18 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-103-001@example.com` con contraseña `Clave123!`, creado con PR-01 (sin deudas).
**Datos de prueba:** D 1: 0 deudas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-103-001@example.com`. | El campo "Email" muestra `qa+cp-deu-103-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts` en la barra de direcciones y presionar Enter. | Se muestra `data-testid="debts-empty"` con el texto exacto `"No tenés deudas pendientes."` y el botón `"Cargar una deuda"` (`data-testid="debts-empty-new"`). |
| 6 | Hacer click en el botón "Cargar una deuda" (`data-testid="debts-empty-new"`). | Navega a `<APP>/debts/new`. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-104 — Estado vacío en "Saldadas" muestra "Todavía no saldaste ninguna deuda." sin botón de carga

| Campo | Contenido |
|---|---|
| Historia · criterio | US-38 · CA-7 · FR-18 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Baja · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-104-001@example.com` con contraseña `Clave123!`, creado con PR-01 (sin deudas).
**Datos de prueba:** D 1: 0 deudas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-104-001@example.com`. | El campo "Email" muestra `qa+cp-deu-104-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts?status=settled` en la barra de direcciones y presionar Enter. | Se muestra `data-testid="debts-empty"` con el texto exacto `"Todavía no saldaste ninguna deuda."` y el botón `data-testid="debts-empty-new"` no existe en el DOM. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-105 — Estado vacío en "Todas" muestra "No cargaste ninguna deuda todavía." y el botón "Cargar una deuda"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-38 · CA-7 · FR-18 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Baja · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-105-001@example.com` con contraseña `Clave123!`, creado con PR-01 (sin deudas).
**Datos de prueba:** D 1: 0 deudas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-105-001@example.com`. | El campo "Email" muestra `qa+cp-deu-105-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts?status=all` en la barra de direcciones y presionar Enter. | Se muestra `data-testid="debts-empty"` con el texto exacto `"No cargaste ninguna deuda todavía."` y el botón `"Cargar una deuda"` (`data-testid="debts-empty-new"`). |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-106 — En la UI, un segundo usuario autenticado no ve las deudas de otro usuario ni en la lista ni en los totales (C7)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-38 · CA-9 · FR-18 |
| Invariante | C7 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Canal · Caso par | UI · CP-DEU-107 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: PR-05 con los usuarios `qa+cp-deu-106-a@example.com` (Usuario A) y `qa+cp-deu-106-b@example.com` (Usuario B), obteniendo `<TOKEN_A>` y `<TOKEN_B>`. S 2: deuda D 1 creada para el Usuario A con PR-04 (`create_debt` usando `<TOKEN_A>`).
**Datos de prueba:** D 1 (deuda del Usuario A): `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "60000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`. D 2: Usuario B sin deudas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la ventana de incógnito donde inició sesión el Usuario B (`qa+cp-deu-106-b@example.com`), escribir `<APP>/debts?status=all` en la barra de direcciones y presionar Enter. | `"Te deben"` muestra `"$0,00"`, `"Debés"` muestra `"$0,00"`, el neto muestra `"En cero"` y se ve el estado vacío `"No cargaste ninguna deuda todavía."` (0 filas del Usuario A visibles). |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-107 — Directo por API, un segundo usuario autenticado recibe [] al consultar GET /rest/v1/debts (C7)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-38 · CA-9 (parte 1) · FR-18 |
| Invariante | C7 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Canal · Caso par | API · CP-DEU-106 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: PR-05 con los usuarios `qa+cp-deu-107-a@example.com` (Usuario A) y `qa+cp-deu-107-b@example.com` (Usuario B), obteniendo `<TOKEN_A>` y `<TOKEN_B>`. S 2: deuda D 1 (`<DEBT_A_ID>`) creada para el Usuario A con PR-04 (`create_debt` usando `<TOKEN_A>`).
**Datos de prueba:** D 1 (deuda del Usuario A): `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "60000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-08 (usando `<TOKEN_B>`) un `GET <SUPABASE_URL>/rest/v1/debts?select=*` y un `GET <SUPABASE_URL>/rest/v1/debts?id=eq.<DEBT_A_ID>&select=*`. | Ambas consultas responden HTTP `200` con arreglo vacío `[]`. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-108 — Directo por API, un GET /rest/v1/debts sin sesión (con el rol anon) responde 42501 (permission denied)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-38 · CA-9 (parte 2) · C7 · FR-18 |
| Invariante | C7 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Canal · Caso par | API · CP-DEU-108B |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: ninguno (consulta sin sesión).
**Datos de prueba:** D 1: solicitud `GET <SUPABASE_URL>/rest/v1/debts?select=*` enviada solo con `apikey: <ANON_KEY>` (sin encabezado `Authorization`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar un `GET <SUPABASE_URL>/rest/v1/debts?select=*` enviando únicamente el encabezado `-H "apikey: <ANON_KEY>"` (sin `Authorization`). | Responde HTTP `401` o `403` con `code = "42501"` (`permission denied for table debts`). |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-108B — Sin sesión iniciada, navegar a /debts redirige a /login?next=%2Fdebts

| Campo | Contenido |
|---|---|
| Historia · criterio | US-38 · CA-10 · FR-18 |
| Invariante | C7 |
| Técnica · Tipo | Transición de estados · Negativo |
| Canal · Caso par | UI · CP-DEU-108 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: ventana de incógnito limpia sin sesión iniciada.
**Datos de prueba:** D 1: ruta privada `<APP>/debts`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito limpia, escribir `<APP>/debts` en la barra de direcciones y presionar Enter. | El navegador redirige a `<APP>/login?next=%2Fdebts` y muestra la pantalla "Entrar". |

**Post-condición:** sin sesión iniciada.

---

#### CP-DEU-108C — Sin sesión iniciada, navegar a /debts/new redirige a /login?next=%2Fdebts%2Fnew

| Campo | Contenido |
|---|---|
| Historia · criterio | US-36 ("Rutas privadas") · US-38 · CA-10 · FR-18 |
| Invariante | C7 |
| Técnica · Tipo | Transición de estados · Negativo |
| Canal · Caso par | UI · CP-DEU-092 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: ventana de incógnito limpia sin sesión iniciada.
**Datos de prueba:** D 1: ruta privada `<APP>/debts/new`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito limpia, escribir `<APP>/debts/new` en la barra de direcciones y presionar Enter. | El navegador redirige a `<APP>/login?next=%2Fdebts%2Fnew` y muestra la pantalla "Entrar". |

**Post-condición:** sin sesión iniciada.


---

### Sección 5 — Saldar, volver a pendiente y filtrar por dirección (US-39, US-40, US-79)

#### CP-DEU-109 — En "Pendientes", tocar "Marcar saldada" llama una sola vez a settle_debt, saca la fila de la lista, muestra "Deuda con Sofía saldada" con "Deshacer", actualiza los totales y fija settled_at

| Campo | Contenido |
|---|---|
| Historia · criterio | US-39 · CA-1, CA-8 · US-37 · CA-5 · US-30 · CA-2 · FR-18 |
| Invariante | I9 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-109-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: deuda D 1 creada con PR-04 (`create_debt`).
**Datos de prueba:** D 1: `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "60000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, abrir las herramientas de desarrollador en la pestaña "Network" (Red), escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-109-001@example.com`. | El campo "Email" muestra `qa+cp-deu-109-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts` en la barra de direcciones y presionar Enter. | Se muestra `"Te deben"` = `"$60.000,00"`, `"A tu favor $60.000,00"` y la fila de `"Sofía"` con el botón `"Marcar saldada"` (`data-testid="debts-item-settle"`). |
| 6 | Limpiar la pestaña "Network" y hacer click en el botón "Marcar saldada" (`data-testid="debts-item-settle"`) de la fila de `"Sofía"`. | Se emite exactamente 1 llamada `POST /rest/v1/rpc/settle_debt`. La fila de `"Sofía"` sale de la lista de "Pendientes", aparece el estado vacío `"No tenés deudas pendientes."`, aparece el aviso `data-testid="debts-settled"` con el texto exacto `"Deuda con Sofía saldada"` y el botón `"Deshacer"` (`data-testid="debts-settled-undo"`), y en la tarjeta de totales `"Te deben"` baja en el acto a `"$0,00"` y el neto pasa a `"En cero"`. |
| 7 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=status,settled_at`. | Devuelve 1 fila con `status = "settled"` y `settled_at` no nulo (I9). |

**Post-condición:** 1 deuda con `status = "settled"` y `settled_at IS NOT NULL`.

---

#### CP-DEU-110 — En "Todas", tocar "Marcar saldada" mantiene la fila en la lista con "Saldada el <HOY_DMY>" y cambia su botón a "Volver a pendiente"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-39 · CA-2 · FR-18 |
| Invariante | I9 · ADR-021 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-110-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: deuda D 1 creada con PR-04 (`create_debt`).
**Datos de prueba:** D 1: `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "60000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-110-001@example.com`. | El campo "Email" muestra `qa+cp-deu-110-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts?status=all` en la barra de direcciones y presionar Enter. | Se ve la fila de `"Sofía"` con `data-status="pending"` y el botón `"Marcar saldada"`. |
| 6 | Hacer click en el botón "Marcar saldada" (`data-testid="debts-item-settle"`). | La fila de `"Sofía"` permanece en la lista con `data-status="settled"`, `data-testid="debts-item-status"` muestra `"Saldada el <HOY_DMY>"`, y el botón pasa a `"Volver a pendiente"` (`data-testid="debts-item-reopen"`). |

**Post-condición:** 1 deuda con `status = "settled"`.

---

#### CP-DEU-111 — Tocar "Deshacer" dentro de los 5 segundos tras saldar llama a reopen_debt, devuelve la fila a "Pendientes" con settled_at = null y restaura los totales

| Campo | Contenido |
|---|---|
| Historia · criterio | US-39 · CA-4 (parte 1) · FR-18 |
| Invariante | I9 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-111-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: deuda D 1 creada con PR-04 (`create_debt`).
**Datos de prueba:** D 1: `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "60000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-111-001@example.com`. | El campo "Email" muestra `qa+cp-deu-111-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts` en la barra de direcciones y presionar Enter. | Se ve la fila de `"Sofía"` en "Pendientes". |
| 6 | Hacer click en "Marcar saldada" (`data-testid="debts-item-settle"`). | Aparece el aviso `data-testid="debts-settled"` (`"Deuda con Sofía saldada"`) con el botón `"Deshacer"` (`data-testid="debts-settled-undo"`). |
| 7 | Antes de que pasen 5 segundos, hacer click en el botón "Deshacer" (`data-testid="debts-settled-undo"`). | Se llama a `reopen_debt`, el aviso desaparece, la fila de `"Sofía"` vuelve a aparecer en "Pendientes" y `"Te deben"` vuelve a `"$60.000,00"`. |
| 8 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=status,settled_at`. | Devuelve 1 fila con `status = "pending"` y `settled_at = null`. |

**Post-condición:** 1 deuda con `status = "pending"` y `settled_at = null`.

---

#### CP-DEU-111B — El aviso "Deuda con Sofía saldada" con "Deshacer" desaparece inmediatamente al cambiar de filtro en /debts

| Campo | Contenido |
|---|---|
| Historia · criterio | US-39 · CA-4 (parte 2) · FR-18 |
| Invariante | I9 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-111b-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: deuda D 1 creada con PR-04 (`create_debt`).
**Datos de prueba:** D 1: `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "60000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-111b-001@example.com`. | El campo "Email" muestra `qa+cp-deu-111b-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts` en la barra de direcciones y presionar Enter. | Se ve la fila de `"Sofía"` en "Pendientes". |
| 6 | Hacer click en "Marcar saldada" (`data-testid="debts-item-settle"`). | Aparece el aviso `data-testid="debts-settled"` con `"Deuda con Sofía saldada"` y `"Deshacer"`. |
| 7 | Antes de que pasen 5 segundos, hacer click en el filtro "Saldadas" (`data-testid="debts-filter-settled"`). | El aviso `data-testid="debts-settled"` desaparece inmediatamente del DOM al cambiar de filtro. |

**Post-condición:** 1 deuda con `status = "settled"`.

---

#### CP-DEU-112 — Si la deuda ya había sido saldada desde otra pestaña, tocar "Marcar saldada" muestra "No se pudo actualizar la deuda" con "La deuda ya está saldada" y actualiza la lista

| Campo | Contenido |
|---|---|
| Historia · criterio | US-39 · CA-5 · FR-18 |
| Invariante | I9 |
| Técnica · Tipo | Transición de estados · Negativo |
| Canal · Caso par | UI · CP-DEU-113 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-112-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: deuda D 1 creada con PR-04 (`create_debt`).
**Datos de prueba:** D 1: `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "60000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito (Pestaña 1), escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-112-001@example.com`. | El campo "Email" muestra `qa+cp-deu-112-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | En la Pestaña 1, escribir `<APP>/debts?status=all` en la barra de direcciones y presionar Enter. | En la Pestaña 1 se ve la fila de `"Sofía"` pendiente con el botón `"Marcar saldada"`. |
| 6 | Abrir una segunda pestaña (Pestaña 2) en la misma ventana de incógnito, escribir `<APP>/debts?status=all` y presionar Enter. | En la Pestaña 2 también se ve la fila de `"Sofía"` pendiente con el botón `"Marcar saldada"`. |
| 7 | En la Pestaña 2, hacer click en "Marcar saldada" (`data-testid="debts-item-settle"`). | En la Pestaña 2 la deuda de `"Sofía"` pasa a saldada. |
| 8 | Volver a la Pestaña 1 (sin recargarla) y hacer click en el botón "Marcar saldada" (`data-testid="debts-item-settle"`). | En la Pestaña 1 aparece el aviso de error `data-testid="debts-update-error"` con `"No se pudo actualizar la deuda"` y el motivo `"La deuda ya está saldada"`, y la lista se refresca mostrando la fila de `"Sofía"` como saldada (`data-status="settled"`). |

**Post-condición:** 1 deuda en estado `settled`.

---

#### CP-DEU-113 — Directo contra settle_debt, saldar una deuda que ya está settled se rechaza con "La deuda ya está saldada"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-39 · CA-6 (parte 1) · FR-18 |
| Invariante | I9 · C6 |
| Técnica · Tipo | Transición de estados · Negativo |
| Canal · Caso par | API · CP-DEU-112 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-113-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: deuda `<DEBT_ID>` creada con PR-04 (`create_debt`) usando D 1 y saldada con PR-04 (`settle_debt`).
**Datos de prueba:** D 1: `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "60000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`. D 2: `p_debt_id = "<DEBT_ID>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/settle_debt` con cuerpo `{"p_debt_id": "<DEBT_ID>"}`. | Responde HTTP `400` con `code = "23514"` y `message = "La deuda ya está saldada"`. |

**Post-condición:** la deuda sigue `settled` con su `settled_at` original.

---

#### CP-DEU-114 — Directo contra settle_debt, el Usuario B no puede saldar una deuda del Usuario A y recibe "La deuda no existe"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-39 · CA-6 (parte 2) · ADR-037 §3 · FR-18 |
| Invariante | C6 · C7 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Canal · Caso par | API · CP-DEU-106 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: PR-05 con los usuarios `qa+cp-deu-114-a@example.com` (Usuario A) y `qa+cp-deu-114-b@example.com` (Usuario B), obteniendo `<TOKEN_A>` y `<TOKEN_B>`. S 2: deuda `<DEBT_A_ID>` creada para el Usuario A con PR-04 (`create_debt` usando `<TOKEN_A>`) con D 1.
**Datos de prueba:** D 1 (deuda del Usuario A): `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "60000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`. D 2: `p_debt_id = "<DEBT_A_ID>"` invocado con `<TOKEN_B>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 (usando `<TOKEN_B>`) un `POST <SUPABASE_URL>/rest/v1/rpc/settle_debt` con cuerpo `{"p_debt_id": "<DEBT_A_ID>"}`. | Responde HTTP `400` con `code = "23514"` y `message = "La deuda no existe"`. |
| 2 | Ejecutar con PR-08 (usando `<TOKEN_A>`) un `GET <SUPABASE_URL>/rest/v1/debts?id=eq.<DEBT_A_ID>&select=status,settled_at`. | Devuelve `status = "pending"` y `settled_at = null` (sin cambios). |

**Post-condición:** la deuda del Usuario A permanece `pending`.

---

#### CP-DEU-114B — Directo contra settle_debt, un p_debt_id inexistente se rechaza con "La deuda no existe"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-39 · CA-6 (parte 2) · ADR-037 §3 · FR-18 |
| Invariante | C6 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-114b-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: `p_debt_id = "00000000-0000-0000-0000-000000000000"` (UUID inexistente).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/settle_debt` con cuerpo `{"p_debt_id": "00000000-0000-0000-0000-000000000000"}`. | Responde HTTP `400` con `code = "23514"` y `message = "La deuda no existe"`. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-115 — Directo contra settle_debt, sin sesión (anon) se rechaza con 42501 (permission denied)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-39 · CA-6 (parte 3) · FR-18 |
| Invariante | C7 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Canal · Caso par | API · CP-DEU-108B |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: ninguno (llamada sin sesión).
**Datos de prueba:** D 1: `{"p_debt_id": "00000000-0000-0000-0000-000000000000"}` enviado solo con `apikey: <ANON_KEY>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar un `POST <SUPABASE_URL>/rest/v1/rpc/settle_debt` enviando únicamente `-H "apikey: <ANON_KEY>"` y `-H "Content-Type: application/json"`, con el cuerpo de D 1. | Responde HTTP `401` o `403` con `code = "42501"` (`permission denied for function settle_debt`). |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-116 — Un PATCH /rest/v1/debts directo con sesión autenticada responde 42501 (permission denied) y no modifica la fila

| Campo | Contenido |
|---|---|
| Historia · criterio | US-39 · CA-7 · ADR-037 §1 · FR-18 |
| Invariante | C7 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Canal · Caso par | API · CP-DEU-109 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-116-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: deuda `<DEBT_ID>` pendiente creada con PR-04 (`create_debt`) usando D 1.
**Datos de prueba:** D 1: `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "60000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`. D 2: `PATCH /rest/v1/debts?id=eq.<DEBT_ID>` con `{"status": "settled"}`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `PATCH <SUPABASE_URL>/rest/v1/debts?id=eq.<DEBT_ID>` con cuerpo `{"status": "settled"}`. | Responde HTTP `403` con `code = "42501"` (`permission denied for table debts`). |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?id=eq.<DEBT_ID>&select=status`. | Devuelve 1 fila con `status = "pending"`. |

**Post-condición:** la fila `<DEBT_ID>` sigue intacta y `pending`.

---

#### CP-DEU-116B — Un DELETE /rest/v1/debts directo con sesión autenticada responde 42501 (permission denied) y no borra la fila

| Campo | Contenido |
|---|---|
| Historia · criterio | US-39 · CA-7 · ADR-037 §1 · FR-18 |
| Invariante | C7 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-116b-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: deuda `<DEBT_ID>` pendiente creada con PR-04 (`create_debt`) usando D 1.
**Datos de prueba:** D 1: `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "60000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `DELETE <SUPABASE_URL>/rest/v1/debts?id=eq.<DEBT_ID>`. | Responde HTTP `403` con `code = "42501"` (`permission denied for table debts`). |
| 2 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?id=eq.<DEBT_ID>&select=id,status`. | Devuelve 1 fila con `id = "<DEBT_ID>"` y `status = "pending"`. |

**Post-condición:** la fila `<DEBT_ID>` sigue intacta.

---

#### CP-DEU-117 — En "Saldadas", tocar "Volver a pendiente" llama una sola vez a reopen_debt, saca la fila de "Saldadas", muestra "La deuda con Sofía volvió a pendiente" y conserva todos sus campos con settled_at = null

| Campo | Contenido |
|---|---|
| Historia · criterio | US-40 · CA-1, CA-2 · FR-18 |
| Invariante | I9 · C10 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-117-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: deuda `<DEBT_ID>` creada con PR-04 (`create_debt`) usando D 1 y saldada con PR-04 (`settle_debt`).
**Datos de prueba:** D 1: `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "40.00"`, `p_currency = "USD"`, `p_fx_rate = "1250.0000"`, `p_incurred_on = "2026-08-15"`, `p_notes = "Viaje"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, abrir la pestaña "Network" (Red), escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-117-001@example.com`. | El campo "Email" muestra `qa+cp-deu-117-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts?status=settled` en la barra de direcciones y presionar Enter. | Se ve la fila de `"Sofía"` con el botón `"Volver a pendiente"` (`data-testid="debts-item-reopen"`). |
| 6 | Limpiar la pestaña "Network" y hacer click en "Volver a pendiente" (`data-testid="debts-item-reopen"`). | Se emite exactamente 1 llamada `POST /rest/v1/rpc/reopen_debt`. La fila sale de "Saldadas", aparece `"Todavía no saldaste ninguna deuda."` y se muestra `data-testid="debts-reopened"` con el texto exacto `"La deuda con Sofía volvió a pendiente"`. |
| 7 | Ejecutar con PR-08 un `GET <SUPABASE_URL>/rest/v1/debts?select=id,person,direction,amount_text:amount::text,currency,fx_rate_text:fx_rate::text,incurred_on,notes,status,settled_at`. | Devuelve exactamente 1 fila con el mismo `id = "<DEBT_ID>"`, `person = "Sofía"`, `direction = "owed_to_me"`, `amount_text = "40.00"`, `currency = "USD"`, `fx_rate_text = "1250.0000"`, `incurred_on = "2026-08-15"`, `notes = "Viaje"`, `status = "pending"` y `settled_at = null`. |

**Post-condición:** la misma fila vuelve a `pending` con `settled_at = null`.

---

#### CP-DEU-118 — En "Todas", tocar "Volver a pendiente" deja la fila con "Pendiente", cambia el botón a "Marcar saldada" y vuelve a sumarla en los totales de US-37

| Campo | Contenido |
|---|---|
| Historia · criterio | US-40 · CA-3 · US-37 · CA-5 · FR-18 |
| Invariante | I9 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-118-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: deuda D 1 creada con PR-04 (`create_debt`) y saldada con PR-04 (`settle_debt`).
**Datos de prueba:** D 1: `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "60000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-118-001@example.com`. | El campo "Email" muestra `qa+cp-deu-118-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts?status=all` en la barra de direcciones y presionar Enter. | `"Te deben"` muestra `"$0,00"`, el neto muestra `"En cero"` y la fila de `"Sofía"` tiene el botón `"Volver a pendiente"`. |
| 6 | Hacer click en "Volver a pendiente" (`data-testid="debts-item-reopen"`). | La fila de `"Sofía"` queda en la lista con `data-status="pending"`, `data-testid="debts-item-status"` igual a `"Pendiente"`, el botón pasa a `"Marcar saldada"` (`data-testid="debts-item-settle"`), y en la tarjeta de totales `"Te deben"` sube en el acto a `"$60.000,00"` y el neto pasa a `"A tu favor $60.000,00"`. |

**Post-condición:** 1 deuda en estado `pending`.

---

#### CP-DEU-119 — Directo contra reopen_debt, reabrir una deuda que ya está pending se rechaza con "La deuda ya está pendiente"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-40 · CA-4 (parte 1) · FR-18 |
| Invariante | I9 · C6 |
| Técnica · Tipo | Transición de estados · Negativo |
| Canal · Caso par | API · CP-DEU-119B |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-119-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: deuda `<DEBT_ID>` pendiente creada con PR-04 (`create_debt`) usando D 1.
**Datos de prueba:** D 1: `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "60000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`. D 2: `p_debt_id = "<DEBT_ID>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/reopen_debt` con cuerpo `{"p_debt_id": "<DEBT_ID>"}`. | Responde HTTP `400` con `code = "23514"` y `message = "La deuda ya está pendiente"`. |

**Post-condición:** la deuda sigue `pending`.

---

#### CP-DEU-119B — Si la deuda ya fue vuelta a pendiente desde otra pestaña, tocar "Volver a pendiente" muestra "No se pudo actualizar la deuda" con "La deuda ya está pendiente" y actualiza la lista

| Campo | Contenido |
|---|---|
| Historia · criterio | US-40 · CA-6 · FR-18 |
| Invariante | I9 |
| Técnica · Tipo | Transición de estados · Negativo |
| Canal · Caso par | UI · CP-DEU-119 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-119b-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: deuda D 1 creada con PR-04 (`create_debt`) y saldada con PR-04 (`settle_debt`).
**Datos de prueba:** D 1: `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "60000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito (Pestaña 1), escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-119b-001@example.com`. | El campo "Email" muestra `qa+cp-deu-119b-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | En la Pestaña 1, escribir `<APP>/debts?status=all` en la barra de direcciones y presionar Enter. | En la Pestaña 1 se ve la fila de `"Sofía"` saldada con el botón `"Volver a pendiente"` (`data-testid="debts-item-reopen"`). |
| 6 | Abrir una segunda pestaña (Pestaña 2) en la misma ventana de incógnito, escribir `<APP>/debts?status=all` y presionar Enter. | En la Pestaña 2 también se ve la fila de `"Sofía"` saldada con el botón `"Volver a pendiente"`. |
| 7 | En la Pestaña 2, hacer click en "Volver a pendiente" (`data-testid="debts-item-reopen"`). | En la Pestaña 2 la deuda de `"Sofía"` vuelve a pendiente. |
| 8 | Volver a la Pestaña 1 (sin recargarla) y hacer click en "Volver a pendiente" (`data-testid="debts-item-reopen"`). | En la Pestaña 1 aparece `data-testid="debts-update-error"` con `"No se pudo actualizar la deuda"` y el motivo `"La deuda ya está pendiente"`, y la lista se refresca mostrando la fila de `"Sofía"` como pendiente (`data-status="pending"`). |

**Post-condición:** 1 deuda en estado `pending`.

---

#### CP-DEU-120 — Directo contra reopen_debt, el Usuario B no puede reabrir una deuda del Usuario A y recibe "La deuda no existe"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-40 · CA-4 (parte 2) · ADR-037 §3 · FR-18 |
| Invariante | C6 · C7 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Canal · Caso par | API · CP-DEU-106 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: PR-05 con los usuarios `qa+cp-deu-120-a@example.com` (Usuario A) y `qa+cp-deu-120-b@example.com` (Usuario B), obteniendo `<TOKEN_A>` y `<TOKEN_B>`. S 2: deuda `<DEBT_A_ID>` creada para el Usuario A con PR-04 (`create_debt` usando `<TOKEN_A>`) con D 1 y saldada con `settle_debt`.
**Datos de prueba:** D 1 (deuda del Usuario A): `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "60000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`. D 2: `p_debt_id = "<DEBT_A_ID>"` invocado con `<TOKEN_B>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 (usando `<TOKEN_B>`) un `POST <SUPABASE_URL>/rest/v1/rpc/reopen_debt` con cuerpo `{"p_debt_id": "<DEBT_A_ID>"}`. | Responde HTTP `400` con `code = "23514"` y `message = "La deuda no existe"`. |
| 2 | Ejecutar con PR-08 (usando `<TOKEN_A>`) un `GET <SUPABASE_URL>/rest/v1/debts?id=eq.<DEBT_A_ID>&select=status,settled_at`. | Devuelve `status = "settled"` y `settled_at IS NOT NULL` (sin cambios). |

**Post-condición:** la deuda del Usuario A permanece `settled`.

---

#### CP-DEU-120B — Directo contra reopen_debt, un p_debt_id inexistente se rechaza con "La deuda no existe"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-40 · CA-4 (parte 2) · ADR-037 §3 · FR-18 |
| Invariante | C6 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-120b-001@example.com` creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: `p_debt_id = "00000000-0000-0000-0000-000000000000"` (UUID inexistente).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 un `POST <SUPABASE_URL>/rest/v1/rpc/reopen_debt` con cuerpo `{"p_debt_id": "00000000-0000-0000-0000-000000000000"}`. | Responde HTTP `400` con `code = "23514"` y `message = "La deuda no existe"`. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-121 — Directo contra reopen_debt, sin sesión (anon) se rechaza con 42501 (permission denied)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-40 · CA-4 (parte 3) · FR-18 |
| Invariante | C7 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Canal · Caso par | API · CP-DEU-108B |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: ninguno (llamada sin sesión).
**Datos de prueba:** D 1: `{"p_debt_id": "00000000-0000-0000-0000-000000000000"}` enviado solo con `apikey: <ANON_KEY>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar un `POST <SUPABASE_URL>/rest/v1/rpc/reopen_debt` enviando únicamente `-H "apikey: <ANON_KEY>"` y `-H "Content-Type: application/json"`, con el cuerpo de D 1. | Responde HTTP `401` o `403` con `code = "42501"` (`permission denied for function reopen_debt`). |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-122 — Saldar y volver a pendiente la misma deuda tres veces seguidas termina pendiente, con settled_at = null y sin filas nuevas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-40 · CA-5 · FR-18 |
| Invariante | I9 |
| Técnica · Tipo | Transición de estados · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-122-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: deuda `<DEBT_ID>` pendiente creada con PR-04 (`create_debt`) usando D 1.
**Datos de prueba:** D 1: `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "60000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-122-001@example.com`. | El campo "Email" muestra `qa+cp-deu-122-001@example.com`. |
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

#### CP-DEU-123 — El filtro por dirección en /debts muestra "Todas" por defecto, filtra por "Te deben" (?direction=owed_to_me) y "Debés" (?direction=i_owe), no altera los totales y no vuelve a pedir datos a la red

| Campo | Contenido |
|---|---|
| Historia · criterio | US-79 · CA-1, CA-2, CA-7, CA-8, CA-9 · FR-18 |
| Invariante | C11 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-123-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: deudas pendientes D 1 y D 2 creadas con PR-04 (`create_debt`).
**Datos de prueba:**
- D 1: `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "60000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.
- D 2: `p_direction = "i_owe"`, `p_person = "Ana"`, `p_amount = "15000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, abrir la pestaña "Network" (Red), escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-123-001@example.com`. | El campo "Email" muestra `qa+cp-deu-123-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts` en la barra de direcciones y presionar Enter. | Debajo del filtro de estado aparece `data-testid="debts-direction-filter"` (`role="radiogroup"`) con `"Todas"` (`data-testid="debts-direction-filter-all"`, `aria-checked="true"`), `"Te deben"` (`data-testid="debts-direction-filter-owed-to-me"`) y `"Debés"` (`data-testid="debts-direction-filter-i-owe"`). Se ven las 2 filas (`"Sofía"` y `"Ana"`). |
| 6 | Limpiar la pestaña "Network" y hacer click en "Te deben" (`data-testid="debts-direction-filter-owed-to-me"`). | La URL cambia a `<APP>/debts?direction=owed_to_me`, `"Te deben"` tiene `aria-checked="true"`, la lista muestra solo a `"Sofía"`, la tarjeta de totales sigue mostrando `"Te deben"` = `"$60.000,00"`, `"Debés"` = `"$15.000,00"` y `"A tu favor $45.000,00"`, y se registran 0 llamadas a `/rest/v1/debts`. |
| 7 | Hacer click en "Debés" (`data-testid="debts-direction-filter-i-owe"`). | La URL cambia a `<APP>/debts?direction=i_owe`, `"Debés"` tiene `aria-checked="true"`, la lista muestra solo a `"Ana"`, la tarjeta de totales no cambia, y se registran 0 llamadas a `/rest/v1/debts`. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-124 — Los filtros de estado y dirección se combinan en la URL (?status=settled&direction=i_owe) al cambiarlos o al abrir/recargar la URL directamente

| Campo | Contenido |
|---|---|
| Historia · criterio | US-79 · CA-3, CA-5 · FR-18 |
| Invariante | C11 |
| Técnica · Tipo | Tabla de decisión · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-124-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: 3 deudas creadas con PR-04 (`create_debt`) usando D 1, D 2 y D 3; D 2 y D 3 saldadas con PR-04 (`settle_debt`).
**Datos de prueba:**
- D 1 (pendiente, `owed_to_me`): `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "60000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.
- D 2 (saldada, `owed_to_me`): `p_direction = "owed_to_me"`, `p_person = "Pedro"`, `p_amount = "8000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-10"`, `p_notes = null`.
- D 3 (saldada, `i_owe`): `p_direction = "i_owe"`, `p_person = "Marta"`, `p_amount = "25000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-12"`, `p_notes = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-124-001@example.com`. | El campo "Email" muestra `qa+cp-deu-124-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts` en la barra de direcciones y presionar Enter. | Se abre `/debts` con "Pendientes" y "Todas" seleccionados. |
| 6 | Hacer click en "Debés" (`data-testid="debts-direction-filter-i-owe"`). | La URL pasa a `?direction=i_owe`. |
| 7 | Hacer click en "Saldadas" (`data-testid="debts-filter-settled"`). | La URL conserva ambos parámetros (`?direction=i_owe&status=settled` o `?status=settled&direction=i_owe`), `"Saldadas"` y `"Debés"` tienen `aria-checked="true"`, y se lista únicamente la fila de `"Marta"`. |
| 8 | Recargar la página (`F5`). | Ambos filtros siguen seleccionados y la lista sigue mostrando únicamente a `"Marta"`. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-125 — Abrir /debts?direction=xyz se comporta como "Todas" en dirección y al elegir "Te deben" reemplaza el parámetro por ?direction=owed_to_me

| Campo | Contenido |
|---|---|
| Historia · criterio | US-79 · CA-4 · FR-18 |
| Invariante | C11 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · — (parámetro de URL del router cliente) |
| Prioridad · Camino feliz · Automatizable | Baja · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-125-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: deudas pendientes D 1 y D 2 creadas con PR-04 (`create_debt`).
**Datos de prueba:**
- D 1: `p_direction = "owed_to_me"`, `p_person = "Sofía"`, `p_amount = "60000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.
- D 2: `p_direction = "i_owe"`, `p_person = "Ana"`, `p_amount = "15000.00"`, `p_currency = "ARS"`, `p_fx_rate = null`, `p_incurred_on = "2026-08-15"`, `p_notes = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-125-001@example.com`. | El campo "Email" muestra `qa+cp-deu-125-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts?direction=xyz` en la barra de direcciones y presionar Enter. | `"Todas"` (`data-testid="debts-direction-filter-all"`) tiene `aria-checked="true"` y se listan las 2 filas (`"Sofía"` y `"Ana"`). |
| 6 | Hacer click en "Te deben" (`data-testid="debts-direction-filter-owed-to-me"`). | La URL cambia a `<APP>/debts?direction=owed_to_me` y se muestra solo `"Sofía"`. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-126 — Estado vacío en /debts?direction=owed_to_me ("Pendientes" + "Te deben") muestra "Nadie te debe nada por ahora." y el botón "Cargar una deuda"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-79 · CA-6 · FR-18 |
| Invariante | — |
| Técnica · Tipo | Tabla de decisión · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Baja · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-126-001@example.com` con contraseña `Clave123!`, creado con PR-01 (sin deudas).
**Datos de prueba:** D 1: URL `<APP>/debts?direction=owed_to_me` (0 deudas).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-126-001@example.com`. | El campo "Email" muestra `qa+cp-deu-126-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts?direction=owed_to_me` en la barra de direcciones y presionar Enter. | `data-testid="debts-empty"` muestra el texto exacto `"Nadie te debe nada por ahora."` y el botón `"Cargar una deuda"` (`data-testid="debts-empty-new"`) está visible. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-126B — Estado vacío en /debts?status=settled&direction=owed_to_me ("Saldadas" + "Te deben") muestra "Todavía no te saldaron ninguna deuda." sin botón de carga

| Campo | Contenido |
|---|---|
| Historia · criterio | US-79 · CA-6 · FR-18 |
| Invariante | — |
| Técnica · Tipo | Tabla de decisión · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Baja · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-126b-001@example.com` con contraseña `Clave123!`, creado con PR-01 (sin deudas).
**Datos de prueba:** D 1: URL `<APP>/debts?status=settled&direction=owed_to_me` (0 deudas).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-126b-001@example.com`. | El campo "Email" muestra `qa+cp-deu-126b-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts?status=settled&direction=owed_to_me` en la barra de direcciones y presionar Enter. | `data-testid="debts-empty"` muestra el texto exacto `"Todavía no te saldaron ninguna deuda."` y el botón `data-testid="debts-empty-new"` no existe en el DOM. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-126C — Estado vacío en /debts?status=all&direction=owed_to_me ("Todas" + "Te deben") muestra "No cargaste deudas a tu favor." y el botón "Cargar una deuda"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-79 · CA-6 · FR-18 |
| Invariante | — |
| Técnica · Tipo | Tabla de decisión · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Baja · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-126c-001@example.com` con contraseña `Clave123!`, creado con PR-01 (sin deudas).
**Datos de prueba:** D 1: URL `<APP>/debts?status=all&direction=owed_to_me` (0 deudas).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-126c-001@example.com`. | El campo "Email" muestra `qa+cp-deu-126c-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts?status=all&direction=owed_to_me` en la barra de direcciones y presionar Enter. | `data-testid="debts-empty"` muestra el texto exacto `"No cargaste deudas a tu favor."` y el botón `"Cargar una deuda"` (`data-testid="debts-empty-new"`) está visible. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-127 — Estado vacío en /debts?direction=i_owe ("Pendientes" + "Debés") muestra "No debés nada por ahora." y el botón "Cargar una deuda"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-79 · CA-6 · FR-18 |
| Invariante | — |
| Técnica · Tipo | Tabla de decisión · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Baja · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-127-001@example.com` con contraseña `Clave123!`, creado con PR-01 (sin deudas).
**Datos de prueba:** D 1: URL `<APP>/debts?direction=i_owe` (0 deudas).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-127-001@example.com`. | El campo "Email" muestra `qa+cp-deu-127-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts?direction=i_owe` en la barra de direcciones y presionar Enter. | `data-testid="debts-empty"` muestra el texto exacto `"No debés nada por ahora."` y el botón `"Cargar una deuda"` (`data-testid="debts-empty-new"`) está visible. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-127B — Estado vacío en /debts?status=settled&direction=i_owe ("Saldadas" + "Debés") muestra "Todavía no saldaste ninguna deuda tuya." sin botón de carga

| Campo | Contenido |
|---|---|
| Historia · criterio | US-79 · CA-6 · FR-18 |
| Invariante | — |
| Técnica · Tipo | Tabla de decisión · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Baja · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-127b-001@example.com` con contraseña `Clave123!`, creado con PR-01 (sin deudas).
**Datos de prueba:** D 1: URL `<APP>/debts?status=settled&direction=i_owe` (0 deudas).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-127b-001@example.com`. | El campo "Email" muestra `qa+cp-deu-127b-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts?status=settled&direction=i_owe` en la barra de direcciones y presionar Enter. | `data-testid="debts-empty"` muestra el texto exacto `"Todavía no saldaste ninguna deuda tuya."` y el botón `data-testid="debts-empty-new"` no existe en el DOM. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-127C — Estado vacío en /debts?status=all&direction=i_owe ("Todas" + "Debés") muestra "No cargaste deudas que debas." y el botón "Cargar una deuda"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-79 · CA-6 · FR-18 |
| Invariante | — |
| Técnica · Tipo | Tabla de decisión · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Baja · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-127c-001@example.com` con contraseña `Clave123!`, creado con PR-01 (sin deudas).
**Datos de prueba:** D 1: URL `<APP>/debts?status=all&direction=i_owe` (0 deudas).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-127c-001@example.com`. | El campo "Email" muestra `qa+cp-deu-127c-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts?status=all&direction=i_owe` en la barra de direcciones y presionar Enter. | `data-testid="debts-empty"` muestra el texto exacto `"No cargaste deudas que debas."` y el botón `"Cargar una deuda"` (`data-testid="debts-empty-new"`) está visible. |

**Post-condición:** sin cambios en base de datos.
---

### Sección 6 — Compartir un gasto con varias personas (US-82)

#### CP-DEU-128 — Encender "Gasto compartido" muestra 1 fila sin "Quitar", "Agregar persona" suma la fila 2 con foco en "¿Con quién?" y "Quitar" en ambas, y guardar un gasto de $120.000,00 con "Sofía" 40000 y "Juan" 40000 crea 2 deudas en 1 llamada a create_transaction con aviso "Juan y Sofía te deben $80.000,00" y etiqueta "Compartido con Juan y Sofía"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-82 · CA-1, CA-2, CA-10, CA-22 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-128-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: gasto `120000` ARS, `"Otros"`, `"Efectivo"`, fecha `15/08/2026`. D 2: fila 1 `"Sofía"` (`40000`), fila 2 `"Juan"` (`40000`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, abrir las herramientas de desarrollador en la pestaña "Network" (Red), escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-128-001@example.com`. | El campo "Email" muestra `qa+cp-deu-128-001@example.com`. |
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

#### CP-DEU-128B — Orden alfabético sin distinguir mayúsculas ni tildes ("Beto", "álvaro", "Ángela") muestra "álvaro, Ángela y Beto te deben $90.000,00" y desempata en /debts en ese mismo orden

| Campo | Contenido |
|---|---|
| Historia · criterio | US-82 · CA-2, CA-10, CA-12 · US-38 · CA-5 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-128b-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: gasto `120000` ARS, `"Otros"`, `"Efectivo"`, fecha `15/08/2026`. D 2: fila 1 `"Beto"` (`30000`), fila 2 `"álvaro"` (`30000`), fila 3 `"Ángela"` (`30000`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-128b-001@example.com`. | El campo "Email" muestra `qa+cp-deu-128b-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1 de 3. |
| 5 | Escribir `120000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2 de 3. |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3 de 3. |
| 7 | En la sección "Fecha", hacer click en "Otra" y escribir `15/08/2026` en `data-testid="transaction-form-date"`. | El campo de fecha muestra `15/08/2026`. |
| 8 | Hacer click en el interruptor "Gasto compartido" (`data-testid="transaction-form-shared-toggle"`). | Aparece la fila 1. |
| 9 | En la fila 1 (`data-index="1"`), escribir `Beto` en "¿Con quién?" y `30000` en "¿Cuánto te debe?". | La fila 1 muestra `Beto` y `30000`. |
| 10 | Hacer click en "Agregar persona" (`data-testid="transaction-form-shared-add"`), escribir `álvaro` en "¿Con quién?" de la fila 2 y `30000` en "¿Cuánto te debe?". | La fila 2 muestra `álvaro` y `30000`. |
| 11 | Hacer click en "Agregar persona" (`data-testid="transaction-form-shared-add"`), escribir `Ángela` en "¿Con quién?" de la fila 3 y `30000` en "¿Cuánto te debe?". | La fila 3 muestra `Ángela` y `30000`. |
| 12 | Hacer click en el botón "Guardar gasto" (`data-testid="transaction-form-submit"`). | Aparece el aviso `"Gasto guardado"` (`data-testid="transaction-form-saved"`) con la descripción exacta `"álvaro, Ángela y Beto te deben $90.000,00"`. |
| 13 | Escribir `<APP>/debts?status=all` en la barra de direcciones y presionar Enter. | Las 3 filas (`data-testid="debts-item"`) aparecen en el orden exacto de arriba hacia abajo: `álvaro`, `Ángela`, `Beto` (desempate por persona sin distinguir mayúsculas ni tildes). |

**Post-condición:** 1 transacción y 3 deudas vinculadas (`álvaro`, `Ángela`, `Beto`) en `debts`.

---

#### CP-DEU-129 — "Dividir en partes iguales" con 2 filas sobre $100.000,00 completa 33333,33 en las dos (reemplazando montos previos) y muestra "Te van a deber $66.666,66 entre 2 personas · Tu parte: $33.333,34"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-82 · CA-3, CA-22 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Valores límite · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-129-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: gasto `100000` ARS, `"Otros"`. D 2: 2 filas (`"Sofía"` con monto previo `10000`, `"Juan"` con monto previo `20000`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-129-001@example.com`. | El campo "Email" muestra `qa+cp-deu-129-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1 de 3. |
| 5 | Escribir `100000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2 de 3. |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3 de 3. |
| 7 | Hacer click en el interruptor "Gasto compartido" (`data-testid="transaction-form-shared-toggle"`). | Aparece la fila 1. |
| 8 | En la fila 1 (`data-index="1"`), escribir `Sofía` en "¿Con quién?" y `10000` en "¿Cuánto te debe?". | La fila 1 muestra `Sofía` y `10000`. |
| 9 | Hacer click en "Agregar persona" (`data-testid="transaction-form-shared-add"`), escribir `Juan` en "¿Con quién?" de la fila 2 y `20000` en "¿Cuánto te debe?". | La fila 2 muestra `Juan` y `20000`. |
| 10 | Hacer click en el botón "Dividir en partes iguales" (`data-testid="transaction-form-shared-split"`). | El campo "¿Cuánto te debe?" de la fila 1 y el de la fila 2 reemplazan sus montos previos por `33333,33` (con coma decimal y sin separador de miles), y el resumen `data-testid="transaction-form-shared-summary"` muestra el texto exacto `"Te van a deber $66.666,66 entre 2 personas · Tu parte: $33.333,34"`. |

**Post-condición:** sin escrituras en base de datos.

---

#### CP-DEU-129B — "Dividir en partes iguales" con un gasto de $0,02 y 2 filas completa 0 en ambas y muestra "El monto debe ser mayor a cero"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-82 · CA-20 · FR-18 |
| Invariante | I5, I7 |
| Técnica · Tipo | Valores límite · Negativo |
| Canal · Caso par | UI · CP-DEU-024 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-129b-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: gasto `0,02` ARS, `"Otros"`. D 2: 2 filas (`"Sofía"`, `"Juan"`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-129b-001@example.com`. | El campo "Email" muestra `qa+cp-deu-129b-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1 de 3. |
| 5 | Escribir `0,02` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2 de 3. |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3 de 3. |
| 7 | Hacer click en el interruptor "Gasto compartido" (`data-testid="transaction-form-shared-toggle"`). | Aparece la fila 1. |
| 8 | En la fila 1, escribir `Sofía` en "¿Con quién?". | La fila 1 muestra `Sofía`. |
| 9 | Hacer click en "Agregar persona" (`data-testid="transaction-form-shared-add"`) y escribir `Juan` en "¿Con quién?" de la fila 2. | La fila 2 muestra `Juan`. |
| 10 | Hacer click en el botón "Dividir en partes iguales" (`data-testid="transaction-form-shared-split"`). | El campo "¿Cuánto te debe?" de la fila 1 y el de la fila 2 quedan con `0`, cada fila muestra el mensaje exacto `"El monto debe ser mayor a cero"` (`data-testid="transaction-form-shared-amount-error"`), y el botón "Guardar gasto" (`data-testid="transaction-form-submit"`) está deshabilitado. |

**Post-condición:** sin escrituras en base de datos.

---

#### CP-DEU-129C — "Dividir en partes iguales" con personas vacías está habilitado y completa los montos de las filas sin borrar ni exigir los nombres

| Campo | Contenido |
|---|---|
| Historia · criterio | US-82 · CA-3 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Baja · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-129c-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: gasto `90000` ARS, `"Otros"`. D 2: 2 filas con `"¿Con quién?"` vacío.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-129c-001@example.com`. | El campo "Email" muestra `qa+cp-deu-129c-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1 de 3. |
| 5 | Escribir `90000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2 de 3. |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3 de 3. |
| 7 | Hacer click en el interruptor "Gasto compartido" (`data-testid="transaction-form-shared-toggle"`). | Aparece la fila 1 con "¿Con quién?" vacío y el botón `"Dividir en partes iguales"` (`data-testid="transaction-form-shared-split"`) está habilitado. |
| 8 | Hacer click en "Agregar persona" (`data-testid="transaction-form-shared-add"`). | Aparece la fila 2 con "¿Con quién?" vacío. |
| 9 | Hacer click en el botón "Dividir en partes iguales" (`data-testid="transaction-form-shared-split"`). | El campo "¿Cuánto te debe?" de la fila 1 y el de la fila 2 se completan con `30000`, los campos "¿Con quién?" siguen vacíos y el botón "Guardar gasto" sigue deshabilitado hasta completar las personas. |

**Post-condición:** sin escrituras en base de datos.

---

#### CP-DEU-130 — "Dividir en partes iguales" con 3 filas sobre $120.000,00 completa 30000 en las tres y muestra "Tu parte: $30.000,00"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-82 · CA-3 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-130-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: gasto `120000` ARS, `"Otros"`. D 2: 3 filas (`"Sofía"`, `"Juan"`, `"Ana"`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-130-001@example.com`. | El campo "Email" muestra `qa+cp-deu-130-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1 de 3. |
| 5 | Escribir `120000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2 de 3. |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3 de 3. |
| 7 | Hacer click en el interruptor "Gasto compartido" (`data-testid="transaction-form-shared-toggle"`). | Aparece la fila 1. |
| 8 | Escribir `Sofía` en "¿Con quién?" de la fila 1, hacer click en "Agregar persona", escribir `Juan` en "¿Con quién?" de la fila 2, hacer click en "Agregar persona" y escribir `Ana` en "¿Con quién?" de la fila 3. | Hay 3 filas con `Sofía`, `Juan` y `Ana`. |
| 9 | Hacer click en el botón "Dividir en partes iguales" (`data-testid="transaction-form-shared-split"`). | El campo "¿Cuánto te debe?" de las 3 filas muestra `30000` (sin `,00`) y el resumen `data-testid="transaction-form-shared-summary"` muestra `"Te van a deber $90.000,00 entre 3 personas · Tu parte: $30.000,00"`. |

**Post-condición:** sin escrituras en base de datos.

---

#### CP-DEU-130B — Con 2 filas cargadas, volver al paso 1 y cambiar la moneda a US$ vacía los montos de las dos filas y conserva las personas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-82 · CA-16 · FR-18 |
| Invariante | I4, I7 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-130b-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: paso inicial `120000` ARS con `"Sofía"` (`30000`) y `"Juan"` (`30000`). D 2: cambio a `US$` con monto `100` y TC `1250`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-130b-001@example.com`. | El campo "Email" muestra `qa+cp-deu-130b-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1 de 3. |
| 5 | Escribir `120000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2 de 3. |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3 de 3. |
| 7 | Hacer click en el interruptor "Gasto compartido" (`data-testid="transaction-form-shared-toggle"`), escribir `Sofía` y `30000` en la fila 1, hacer click en "Agregar persona" y escribir `Juan` y `30000` en la fila 2. | Las 2 filas tienen `Sofía` (`30000`) y `Juan` (`30000`). |
| 8 | Hacer click en el chip de resumen del monto (`$120.000,00`) arriba del paso 3 para volver al paso 1. | Se abre el paso 1 de 3, "¿Cuánto?". |
| 9 | Hacer click en la moneda `US$`, escribir `100` en el monto, escribir `1250` en el tipo de cambio y hacer click en "Siguiente". | Se abre el paso 2 de 3. |
| 10 | Hacer click en la categoría "Otros". | Se abre el paso 3 de 3: el interruptor "Gasto compartido" sigue encendido con las 2 filas, "¿Con quién?" conserva `Sofía` en la fila 1 y `Juan` en la fila 2, y el campo "¿Cuánto te debe?" de ambas filas está vacío con prefijo `US$`. |

**Post-condición:** sin escrituras en base de datos.

---

#### CP-DEU-130C — "Dividir en partes iguales" con 2 filas sobre US$100,00 (TC 1250) completa 33,33 en cada fila y muestra "Tu parte: US$33,34"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-82 · CA-3 · FR-18 |
| Invariante | I4, I7 |
| Técnica · Tipo | Valores límite · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-130c-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: gasto `100` USD, TC `1250`, `"Otros"`. D 2: 2 filas (`"Sofía"`, `"Juan"`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-130c-001@example.com`. | El campo "Email" muestra `qa+cp-deu-130c-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1 de 3. |
| 5 | Hacer click en la moneda `US$`, escribir `100` en el campo del monto, escribir `1250` en el campo de tipo de cambio y hacer click en "Siguiente". | Se abre el paso 2 de 3. |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3 de 3. |
| 7 | Hacer click en el interruptor "Gasto compartido" (`data-testid="transaction-form-shared-toggle"`), escribir `Sofía` en "¿Con quién?" de la fila 1, hacer click en "Agregar persona" y escribir `Juan` en "¿Con quién?" de la fila 2. | Hay 2 filas con `Sofía` y `Juan`. |
| 8 | Hacer click en el botón "Dividir en partes iguales" (`data-testid="transaction-form-shared-split"`). | El campo "¿Cuánto te debe?" de ambas filas muestra `33,33` y el resumen `data-testid="transaction-form-shared-summary"` muestra `"Te van a deber US$66,66 entre 2 personas · Tu parte: US$33,34"`. |

**Post-condición:** sin escrituras en base de datos.

---

#### CP-DEU-130D — En US$ (US$0,02 a TC 0,4), "Dividir en partes iguales" con 1 fila completa 0,01 y muestra "En pesos daría menos de $0,01. Revisá el monto o el tipo de cambio"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-82 · CA-3 · US-34 · CA-7 · FR-18 |
| Invariante | I4, I5, I7 |
| Técnica · Tipo | Valores límite · Negativo |
| Canal · Caso par | UI · CP-DEU-028 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-130d-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: gasto `0,02` USD, TC `0,4`, `"Otros"`. D 2: 1 fila (`"Sofía"`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-130d-001@example.com`. | El campo "Email" muestra `qa+cp-deu-130d-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1 de 3. |
| 5 | Hacer click en la moneda `US$`, escribir `0,02` en el campo del monto, escribir `0,4` en el campo de tipo de cambio y hacer click en "Siguiente". | Se abre el paso 2 de 3 (`0,02 × 0,4 = $0,01` en pesos para el gasto). |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3 de 3. |
| 7 | Hacer click en el interruptor "Gasto compartido" (`data-testid="transaction-form-shared-toggle"`) y escribir `Sofía` en "¿Con quién?" de la fila 1. | La fila 1 muestra `Sofía`. |
| 8 | Hacer click en el botón "Dividir en partes iguales" (`data-testid="transaction-form-shared-split"`). | El campo "¿Cuánto te debe?" de la fila 1 se completa con `0,01` (`0,01 × 0,4 = 0,004` → `$0,00`), debajo de la fila aparece `data-testid="transaction-form-shared-amount-error"` con el texto exacto `"En pesos daría menos de $0,01. Revisá el monto o el tipo de cambio"`, y "Guardar gasto" queda deshabilitado. |

**Post-condición:** sin escrituras en base de datos.

---

#### CP-DEU-131 — Con un gasto de $120.000,00 y 2 filas (60000 + 60000), "Tu parte: $0,00" se guarda y crea las 2 deudas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-82 · CA-4 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-131-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: gasto `120000` ARS, `"Otros"`, `"Efectivo"`, fecha `15/08/2026`. D 2: fila 1 `"Sofía"` (`60000`), fila 2 `"Juan"` (`60000`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-131-001@example.com`. | El campo "Email" muestra `qa+cp-deu-131-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1 de 3. |
| 5 | Escribir `120000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2 de 3. |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3 de 3. |
| 7 | En la sección "Fecha", hacer click en "Otra" y escribir `15/08/2026` en `data-testid="transaction-form-date"`. | El campo de fecha muestra `15/08/2026`. |
| 8 | Hacer click en el interruptor "Gasto compartido" (`data-testid="transaction-form-shared-toggle"`), escribir `Sofía` y `60000` en la fila 1, hacer click en "Agregar persona" y escribir `Juan` y `60000` en la fila 2. | El resumen `data-testid="transaction-form-shared-summary"` muestra `"Te van a deber $120.000,00 entre 2 personas · Tu parte: $0,00"` y el botón "Guardar gasto" está habilitado. |
| 9 | Hacer click en el botón "Guardar gasto" (`data-testid="transaction-form-submit"`). | Aparece el aviso `"Gasto guardado"` (`data-testid="transaction-form-saved"`) con la descripción `"Juan y Sofía te deben $120.000,00"`. |

**Post-condición:** 1 transacción de `$120.000,00` y 2 deudas vinculadas de `$60.000,00` en `debts`.

---

#### CP-DEU-132 — Con un gasto de $120.000,00 y 2 filas (60000 + 60000,01), muestra "Entre todos no pueden deber más que el gasto ($120.000,00)" en transaction-form-shared-total-error y deshabilita "Guardar gasto"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-82 · CA-4, CA-22 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · CP-DEU-141 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-132-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: gasto `120000` ARS, `"Otros"`. D 2: fila 1 `"Sofía"` (`60000`), fila 2 `"Juan"` (`60000,01`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, abrir la pestaña "Network" (Red), escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-132-001@example.com`. | El campo "Email" muestra `qa+cp-deu-132-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1 de 3. |
| 5 | Escribir `120000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2 de 3. |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3 de 3. |
| 7 | Hacer click en el interruptor "Gasto compartido" (`data-testid="transaction-form-shared-toggle"`), escribir `Sofía` y `60000` en la fila 1, hacer click en "Agregar persona", escribir `Juan` y `60000,01` en la fila 2 y presionar Tab. | Aparece `data-testid="transaction-form-shared-total-error"` (`role="alert"`) con el texto exacto `"Entre todos no pueden deber más que el gasto ($120.000,00)"`, el botón "Guardar gasto" (`data-testid="transaction-form-submit"`) queda deshabilitado y no se emite ninguna petición de escritura. |

**Post-condición:** 0 filas en `transactions` y 0 filas en `debts`.

---

#### CP-DEU-132B — Con "Sofía" 40000 y "Juan" 40000 sobre $120.000,00, volver al paso 1 y bajar el gasto a $70.000,00 muestra "Entre todos no pueden deber más que el gasto ($70.000,00)" en el paso 3

| Campo | Contenido |
|---|---|
| Historia · criterio | US-82 · CA-18 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Transición de estados · Negativo |
| Canal · Caso par | UI · CP-DEU-141 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-132b-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: gasto inicial `120000` ARS con `"Sofía"` (`40000`) y `"Juan"` (`40000`). D 2: nuevo monto del gasto `70000`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-132b-001@example.com`. | El campo "Email" muestra `qa+cp-deu-132b-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1 de 3. |
| 5 | Escribir `120000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2 de 3. |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3 de 3. |
| 7 | Hacer click en el interruptor "Gasto compartido" (`data-testid="transaction-form-shared-toggle"`), escribir `Sofía` y `40000` en la fila 1, hacer click en "Agregar persona" y escribir `Juan` y `40000` en la fila 2. | El resumen muestra `"Te van a deber $80.000,00 entre 2 personas · Tu parte: $40.000,00"`. |
| 8 | Hacer click en el chip de resumen del monto (`$120.000,00`) arriba del paso 3 para volver al paso 1. | Se abre el paso 1 de 3. |
| 9 | Reemplazar el monto por `70000` y hacer click en "Siguiente". | Se abre el paso 2 de 3. |
| 10 | Hacer click en la categoría "Otros". | Se abre el paso 3 de 3: los montos de las filas siguen siendo `40000` y `40000` (no se ajustan solos), se muestra `data-testid="transaction-form-shared-total-error"` con el texto exacto `"Entre todos no pueden deber más que el gasto ($70.000,00)"` y "Guardar gasto" está deshabilitado. |

**Post-condición:** sin escrituras en base de datos.

---

#### CP-DEU-132C — Con 2 filas donde "Sofía" tiene 150000 sobre $120.000,00 y "Juan" 10000, muestra "No puede superar el monto del gasto ($120.000,00)" en la fila de Sofía y no muestra transaction-form-shared-total-error

| Campo | Contenido |
|---|---|
| Historia · criterio | US-82 · CA-19 · US-41 · CA-4 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · CP-DEU-035 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-132c-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: gasto `120000` ARS, `"Otros"`. D 2: fila 1 `"Sofía"` (`150000`), fila 2 `"Juan"` (`10000`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-132c-001@example.com`. | El campo "Email" muestra `qa+cp-deu-132c-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1 de 3. |
| 5 | Escribir `120000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2 de 3. |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3 de 3. |
| 7 | Hacer click en el interruptor "Gasto compartido" (`data-testid="transaction-form-shared-toggle"`), escribir `Sofía` y `150000` en la fila 1, hacer click en "Agregar persona", escribir `Juan` y `10000` en la fila 2 y presionar Tab. | En la fila 1 aparece `data-testid="transaction-form-shared-amount-error"` con el texto exacto `"No puede superar el monto del gasto ($120.000,00)"`, el elemento `data-testid="transaction-form-shared-total-error"` no existe en el DOM y "Guardar gasto" está deshabilitado. |

**Post-condición:** sin escrituras en base de datos.

---

#### CP-DEU-132D — Con "Sofía" 40000 y "Juan" 40000 sobre $120.000,00, volver al paso 1 y bajar el gasto a $30.000,00 muestra en cada fila "No puede superar el monto del gasto ($30.000,00)" y no muestra el error de la suma

| Campo | Contenido |
|---|---|
| Historia · criterio | US-82 · CA-18 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Transición de estados · Negativo |
| Canal · Caso par | UI · CP-DEU-035 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-132d-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: gasto inicial `120000` ARS con `"Sofía"` (`40000`) y `"Juan"` (`40000`). D 2: nuevo monto del gasto `30000`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-132d-001@example.com`. | El campo "Email" muestra `qa+cp-deu-132d-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1 de 3. |
| 5 | Escribir `120000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2 de 3. |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3 de 3. |
| 7 | Hacer click en el interruptor "Gasto compartido" (`data-testid="transaction-form-shared-toggle"`), escribir `Sofía` y `40000` en la fila 1, hacer click en "Agregar persona" y escribir `Juan` y `40000` en la fila 2. | El resumen muestra `"Te van a deber $80.000,00 entre 2 personas · Tu parte: $40.000,00"`. |
| 8 | Hacer click en el chip de resumen del monto (`$120.000,00`) arriba del paso 3 para volver al paso 1. | Se abre el paso 1 de 3. |
| 9 | Reemplazar el monto por `30000` y hacer click en "Siguiente". | Se abre el paso 2 de 3. |
| 10 | Hacer click en la categoría "Otros". | Se abre el paso 3 de 3: tanto la fila 1 como la fila 2 muestran `data-testid="transaction-form-shared-amount-error"` con el texto exacto `"No puede superar el monto del gasto ($30.000,00)"`, `data-testid="transaction-form-shared-total-error"` no existe en el DOM y "Guardar gasto" está deshabilitado. |

**Post-condición:** sin escrituras en base de datos.

---

#### CP-DEU-133 — Con 10 filas, "Agregar persona" se deshabilita, se ve "Podés compartir un gasto con hasta 10 personas" y al guardar crea 10 deudas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-82 · CA-5, CA-22 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-133-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: gasto `110000` ARS, `"Otros"`, `"Efectivo"`, fecha `15/08/2026`. D 2: 10 filas con nombres `"Persona 01"`, `"Persona 02"`, `"Persona 03"`, `"Persona 04"`, `"Persona 05"`, `"Persona 06"`, `"Persona 07"`, `"Persona 08"`, `"Persona 09"`, `"Persona 10"` y monto `10000` en cada una.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-133-001@example.com`. | El campo "Email" muestra `qa+cp-deu-133-001@example.com`. |
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

#### CP-DEU-134 — "Sofía" en la fila 1 y "  sofía " en la fila 2 muestra en la fila 2 "Ya agregaste a Sofía" y deshabilita "Guardar gasto"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-82 · CA-6 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · CP-DEU-140 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-134-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: gasto `100000` ARS, `"Otros"`. D 2: fila 1 `"Sofía"` (`30000`), fila 2 `"  sofía "` (`30000`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-134-001@example.com`. | El campo "Email" muestra `qa+cp-deu-134-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1 de 3. |
| 5 | Escribir `100000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2 de 3. |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3 de 3. |
| 7 | Hacer click en el interruptor "Gasto compartido" (`data-testid="transaction-form-shared-toggle"`), escribir `Sofía` y `30000` en la fila 1, hacer click en "Agregar persona", escribir `  sofía ` en "¿Con quién?" de la fila 2, escribir `30000` en "¿Cuánto te debe?" de la fila 2 y presionar Tab. | En la fila 2 aparece `data-testid="transaction-form-shared-person-error"` (`role="alert"`) con el texto exacto `"Ya agregaste a Sofía"` y el botón "Guardar gasto" (`data-testid="transaction-form-submit"`) queda deshabilitado. |

**Post-condición:** sin escrituras en base de datos.

---

#### CP-DEU-135 — Con 3 filas, dejar "¿Con quién?" vacío en la fila 2 muestra "Ingresá con quién compartiste el gasto" en esa fila y deshabilita "Guardar gasto"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-82 · CA-8 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · CP-DEU-142B |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-135-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: gasto `120000` ARS, `"Otros"`. D 2: fila 1 `"Sofía"` (`30000`), fila 2 persona vacía (`20000`), fila 3 `"Ana"` (`10000`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-135-001@example.com`. | El campo "Email" muestra `qa+cp-deu-135-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1 de 3. |
| 5 | Escribir `120000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2 de 3. |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3 de 3. |
| 7 | Hacer click en el interruptor "Gasto compartido" (`data-testid="transaction-form-shared-toggle"`), escribir `Sofía` y `30000` en la fila 1, hacer click en "Agregar persona", hacer click en "¿Con quién?" de la fila 2 y sin escribir nada pasar a "¿Cuánto te debe?" de la fila 2 y escribir `20000`, hacer click en "Agregar persona" y escribir `Ana` y `10000` en la fila 3. | En la fila 2 (`data-index="2"`) aparece `data-testid="transaction-form-shared-person-error"` con el texto exacto `"Ingresá con quién compartiste el gasto"` y el botón "Guardar gasto" (`data-testid="transaction-form-submit"`) está deshabilitado. |

**Post-condición:** sin escrituras en base de datos.

---

#### CP-DEU-135B — Con 3 filas cargadas ("Sofía" 30000, "Juan" 20000, "Ana" 10000), tocar "Quitar" en la fila 2 deja a Sofía y Ana con sus valores y data-index 1 y 2

| Campo | Contenido |
|---|---|
| Historia · criterio | US-82 · CA-7 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-135b-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: gasto `120000` ARS, `"Otros"`. D 2: fila 1 `"Sofía"` (`30000`), fila 2 `"Juan"` (`20000`), fila 3 `"Ana"` (`10000`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-135b-001@example.com`. | El campo "Email" muestra `qa+cp-deu-135b-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1 de 3. |
| 5 | Escribir `120000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2 de 3. |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3 de 3. |
| 7 | Hacer click en el interruptor "Gasto compartido" (`data-testid="transaction-form-shared-toggle"`), escribir `Sofía` y `30000` en la fila 1, hacer click en "Agregar persona", escribir `Juan` y `20000` en la fila 2, hacer click en "Agregar persona" y escribir `Ana` y `10000` en la fila 3. | Hay 3 filas (`data-index="1"`, `"2"`, `"3"`). |
| 8 | Hacer click en el botón "Quitar" de la fila 2 (`data-testid="transaction-form-shared-remove"`, `aria-label="Quitar a Juan"`). | Quedan 2 filas: la primera con `data-index="1"`, `Sofía` y `30000`, y la segunda con `data-index="2"`, `Ana` y `10000`. El resumen muestra `"Te van a deber $40.000,00 entre 2 personas · Tu parte: $80.000,00"`. |

**Post-condición:** sin escrituras en base de datos.

---

#### CP-DEU-135C — Con 2 filas cargadas, pasar a Ingreso en el paso 1 y volver a Gasto deja el interruptor apagado, y al encenderlo muestra 1 sola fila vacía

| Campo | Contenido |
|---|---|
| Historia · criterio | US-82 · CA-17 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-135c-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: gasto `120000` ARS con `"Sofía"` (`30000`) y `"Juan"` (`30000`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-135c-001@example.com`. | El campo "Email" muestra `qa+cp-deu-135c-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1 de 3. |
| 5 | Escribir `120000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2 de 3. |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3 de 3. |
| 7 | Hacer click en el interruptor "Gasto compartido" (`data-testid="transaction-form-shared-toggle"`), escribir `Sofía` y `30000` en la fila 1, hacer click en "Agregar persona" y escribir `Juan` y `30000` en la fila 2. | Hay 2 filas cargadas. |
| 8 | Hacer click en el chip de resumen del monto (`$120.000,00`) arriba del paso 3 para volver al paso 1. | Se abre el paso 1. |
| 9 | Hacer click en "Ingreso" (`data-testid="transaction-form-type-income"`) y luego volver a hacer click en "Gasto" (`data-testid="transaction-form-type-expense"`). | "Gasto" queda seleccionado. |
| 10 | Hacer click en "Siguiente" y luego en la categoría "Otros". | Se abre el paso 3 de 3 con el interruptor "Gasto compartido" (`data-testid="transaction-form-shared-toggle"`) apagado (`aria-checked="false"`). |
| 11 | Hacer click en el interruptor "Gasto compartido" (`data-testid="transaction-form-shared-toggle"`). | Aparece 1 sola fila (`data-index="1"`) con "¿Con quién?" y "¿Cuánto te debe?" vacíos. |

**Post-condición:** sin escrituras en base de datos.

---

#### CP-DEU-135D — Con 3 filas cargadas ("Sofía" 30000, "Juan" 30000, "Ana" 30000), apagar el interruptor y guardar crea el gasto sin deudas, y al volver a encenderlo en un nuevo gasto hay 1 sola fila vacía

| Campo | Contenido |
|---|---|
| Historia · criterio | US-82 · CA-9 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-135d-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1).
**Datos de prueba:** D 1: gasto `120000` ARS, `"Otros"`, `"Efectivo"`, fecha `15/08/2026`. D 2: 3 filas cargadas antes de apagar (`"Sofía"` `30000`, `"Juan"` `30000`, `"Ana"` `30000`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-135d-001@example.com`. | El campo "Email" muestra `qa+cp-deu-135d-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1 de 3. |
| 5 | Escribir `120000` en el campo del monto y hacer click en "Siguiente". | Se abre el paso 2 de 3. |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3 de 3. |
| 7 | En la sección "Fecha", hacer click en "Otra" y escribir `15/08/2026` en `data-testid="transaction-form-date"`. | El campo de fecha muestra `15/08/2026`. |
| 8 | Hacer click en el interruptor "Gasto compartido" (`data-testid="transaction-form-shared-toggle"`), escribir `Sofía` y `30000` en la fila 1, hacer click en "Agregar persona", escribir `Juan` y `30000` en la fila 2, hacer click en "Agregar persona" y escribir `Ana` y `30000` en la fila 3. | Hay 3 filas cargadas. |
| 9 | Hacer click en el interruptor "Gasto compartido" (`data-testid="transaction-form-shared-toggle"`). | El interruptor queda apagado (`aria-checked="false"`) y las 3 filas desaparecen. |
| 10 | Hacer click en el botón "Guardar gasto" (`data-testid="transaction-form-submit"`). | Aparece el aviso `"Gasto guardado"` sin mención de deudas. |
| 11 | Escribir `50000` en el campo del monto del nuevo gasto, hacer click en "Siguiente", hacer click en "Otros" y hacer click en el interruptor "Gasto compartido" (`data-testid="transaction-form-shared-toggle"`). | Aparece 1 sola fila (`data-index="1"`) vacía. |
| 12 | Consultar `GET <SUPABASE_URL>/rest/v1/debts?select=id` con PR-08 usando `<TOKEN>`. | Devuelve HTTP `200` con `[]` (0 deudas). |

**Post-condición:** 1 transacción y 0 deudas en `debts`.

---

#### CP-DEU-136 — Un gasto compartido con 3 personas ("Sofía", "Juan", "Ana") en 2 cuotas muestra "Compartido con Ana y 2 más" en cada cuota de Movimientos y en "Últimos movimientos" del Resumen

| Campo | Contenido |
|---|---|
| Historia · criterio | US-82 · CA-10 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-136-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` y `<USER_ID>` obtenidos con PR-04 (Paso 1); `<ACCOUNT_ID>` de `"Tarjeta de crédito"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Paso 2). S 3: gasto compartido D 1 creado con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con `{"p_type": "expense", "p_amount": "120000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 2, "p_occurred_on": "2026-08-15", "p_description": "Cena", "p_shared_persons": ["Sofía", "Juan", "Ana"], "p_shared_amounts": ["30000.00", "30000.00", "30000.00"]}`).
**Datos de prueba:** D 1: gasto `$120.000,00` en 2 cuotas (`2026-08` y `2026-09`) compartido con `"Sofía"`, `"Juan"` y `"Ana"` (`$30.000,00` cada uno).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-136-001@example.com`. | El campo "Email" muestra `qa+cp-deu-136-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/transactions?period=2026-08` en la barra de direcciones y presionar Enter. | La cuota 1/2 muestra la etiqueta `data-testid="transactions-item-shared"` con el texto exacto `"Compartido con Ana y 2 más"`. |
| 6 | Escribir `<APP>/transactions?period=2026-09` en la barra de direcciones y presionar Enter. | La cuota 2/2 muestra la etiqueta `data-testid="transactions-item-shared"` con el texto exacto `"Compartido con Ana y 2 más"`. |
| 7 | Escribir `<APP>/dashboard?period=2026-08` en la barra de direcciones y presionar Enter. | En "Últimos movimientos", la fila del gasto muestra `data-testid="dashboard-transaction-item-shared"` con el texto exacto `"Compartido con Ana y 2 más"`. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-136B — Al tocar la papelera de un gasto compartido con "Ana", "Juan" y "Sofía" por $30.000,00 cada uno, el diálogo muestra "También dejan de contar las deudas con Ana, Juan y Sofía por $90.000,00 en total."

| Campo | Contenido |
|---|---|
| Historia · criterio | US-82 · CA-11 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-136b-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` y `<USER_ID>` obtenidos con PR-04 (Paso 1); `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Paso 2). S 3: gasto compartido D 1 creado con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con `{"p_type": "expense", "p_amount": "120000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": "Cena", "p_shared_persons": ["Sofía", "Juan", "Ana"], "p_shared_amounts": ["30000.00", "30000.00", "30000.00"]}`).
**Datos de prueba:** D 1: gasto `$120.000,00` del `15/08/2026` con `"Sofía"`, `"Juan"` y `"Ana"` por `$30.000,00` cada uno.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-136b-001@example.com`. | El campo "Email" muestra `qa+cp-deu-136b-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/transactions?period=2026-08` en la barra de direcciones y presionar Enter. | Se muestra la fila del gasto de `$120.000,00`. |
| 6 | Hacer click en el botón de papelera (`data-testid="transactions-item-delete"`) de la fila del gasto. | Se abre el diálogo de confirmación de borrado y el elemento `data-testid="delete-transaction-debt-warning"` muestra el texto exacto `"También dejan de contar las deudas con Ana, Juan y Sofía por $90.000,00 en total."`. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-136C — En /debts?status=all, las 3 deudas de un mismo gasto compartido muestran su línea de origen, se ordenan "Ana", "Juan", "Sofía" y suman $90.000,00 en "Te deben" y en el neto del Resumen

| Campo | Contenido |
|---|---|
| Historia · criterio | US-82 · CA-12 · US-38 · CA-5 · US-37 · CA-1 · US-30 · CA-1 · FR-18, FR-19 |
| Invariante | I7, I10 |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-136c-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` y `<USER_ID>` obtenidos con PR-04 (Paso 1); `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Paso 2). S 3: gasto compartido D 1 creado con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con `{"p_type": "expense", "p_amount": "120000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": "Cena", "p_shared_persons": ["Sofía", "Juan", "Ana"], "p_shared_amounts": ["30000.00", "30000.00", "30000.00"]}`).
**Datos de prueba:** D 1: gasto `$120.000,00` del `15/08/2026` (`"Otros"`, `"Cena"`) con `"Sofía"`, `"Juan"` y `"Ana"` por `$30.000,00` cada uno.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-136c-001@example.com`. | El campo "Email" muestra `qa+cp-deu-136c-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts?status=all` en la barra de direcciones y presionar Enter. | `data-testid="debts-total-owed-to-me"` muestra `"$90.000,00"`; la lista muestra 3 filas (`data-testid="debts-item"`) en el orden exacto `Ana`, `Juan`, `Sofía`, y cada una muestra `data-testid="debts-item-origin"` con `"Gasto compartido: Otros, $120.000,00 del 15/08/2026"`. |
| 6 | Escribir `<APP>/dashboard?period=2026-08` en la barra de direcciones y presionar Enter. | `data-testid="dashboard-total-expenses"` muestra `"$120.000,00"` y `data-testid="dashboard-net-reimbursements-amount"` muestra `"$30.000,00"` (`$120.000,00 − $90.000,00`). |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-136D — Eliminar el gasto compartido con 3 personas saca las 3 deudas de /debts y deja "Te deben" en $0,00 y el neto en "En cero"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-82 · CA-13 · US-35 · CA-5 · FR-18 |
| Invariante | I7, I10 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-136d-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` y `<USER_ID>` obtenidos con PR-04 (Paso 1); `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Paso 2). S 3: gasto compartido D 1 creado con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con `{"p_type": "expense", "p_amount": "120000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": "Cena", "p_shared_persons": ["Sofía", "Juan", "Ana"], "p_shared_amounts": ["30000.00", "30000.00", "30000.00"]}`). S 4: `<DEBT_ID_ANA>` obtenido con PR-08 (`GET /rest/v1/debts?person=eq.Ana&select=id`) y saldado con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/settle_debt` con `{"p_debt_id": "<DEBT_ID_ANA>"}`).
**Datos de prueba:** D 1: gasto `$120.000,00` del `15/08/2026` con `"Ana"` (saldada), `"Juan"` (pendiente) y `"Sofía"` (pendiente).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-136d-001@example.com`. | El campo "Email" muestra `qa+cp-deu-136d-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/transactions?period=2026-08` en la barra de direcciones y presionar Enter. | Se muestra el gasto de `$120.000,00`. |
| 6 | Hacer click en el botón de papelera (`data-testid="transactions-item-delete"`) del gasto y confirmar haciendo click en "Eliminar" (`data-testid="delete-transaction-confirm"`). | El gasto desaparece de Movimientos activos. |
| 7 | Escribir `<APP>/debts?status=all` en la barra de direcciones y presionar Enter. | `data-testid="debts-total-owed-to-me"` muestra `"$0,00"`, `data-testid="debts-net"` muestra `"En cero"` y la lista muestra el estado vacío `"No cargaste ninguna deuda todavía."` (`data-testid="debts-empty"`). |

**Post-condición:** gasto con `deleted_at` no nulo; las 3 deudas ocultas en `/debts`.

---

#### CP-DEU-136E — Restaurar desde Eliminados el gasto compartido con 3 personas devuelve las 3 deudas a /debts con su estado previo ("Ana" saldada y "Juan" y "Sofía" pendientes)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-82 · CA-13 · US-35 · CA-6 · FR-18 |
| Invariante | I7, I9, I10 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-136e-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` y `<USER_ID>` obtenidos con PR-04 (Paso 1); `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Paso 2). S 3: gasto compartido D 1 creado con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con `{"p_type": "expense", "p_amount": "120000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": "Cena", "p_shared_persons": ["Sofía", "Juan", "Ana"], "p_shared_amounts": ["30000.00", "30000.00", "30000.00"]}` → `<TX_ID>`). S 4: `<DEBT_ID_ANA>` obtenido con PR-08 (`GET /rest/v1/debts?person=eq.Ana&select=id`) y saldado con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/settle_debt` con `{"p_debt_id": "<DEBT_ID_ANA>"}`). S 5: gasto `<TX_ID>` eliminado con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/delete_transaction` con `{"p_transaction_id": "<TX_ID>"}`).
**Datos de prueba:** D 1: gasto `$120.000,00` eliminado, con 3 deudas vinculadas (`"Ana"` saldada en `<HOY_DMY>`, `"Juan"` pendiente, `"Sofía"` pendiente).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-136e-001@example.com`. | El campo "Email" muestra `qa+cp-deu-136e-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/transactions?period=2026-08` en la barra de direcciones y presionar Enter, hacer click en la pestaña "Eliminados" y hacer click en "Restaurar" en la fila del gasto `"Cena"`. | El gasto se restaura a Movimientos activos. |
| 6 | Escribir `<APP>/debts?status=all` en la barra de direcciones y presionar Enter. | Vuelven a aparecer las 3 deudas: `"Juan"` y `"Sofía"` con estado `"Pendiente"` (`data-testid="debts-total-owed-to-me"` = `"$60.000,00"`) y `"Ana"` con estado `"Saldada el <HOY_DMY>"`. |

**Post-condición:** gasto activo y 3 deudas vinculadas visibles (`Ana` saldada, `Juan` y `Sofía` pendientes).

---

#### CP-DEU-137 — create_transaction rechaza 2 personas y 1 monto con HTTP 400 (23514) y mensaje "Un gasto compartido necesita una persona y un monto por cada deuda"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-82 · CA-14 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-DEU-008 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-137-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1); `<ACCOUNT_ID>` y `<CATEGORY_ID>` obtenidos con PR-04 (Paso 2).
**Datos de prueba:** D 1: `"p_shared_persons": ["Sofía", "Juan"]`, `"p_shared_amounts": [40000]`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con PR-04 enviando `{"p_type": "expense", "p_amount": 120000, "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null, "p_shared_persons": ["Sofía", "Juan"], "p_shared_amounts": [40000]}`. | Devuelve HTTP `400`, `"code": "23514"` y `"message": "Un gasto compartido necesita una persona y un monto por cada deuda"`. |
| 2 | Consultar `GET <SUPABASE_URL>/rest/v1/transactions?select=id`, `GET <SUPABASE_URL>/rest/v1/ledger_entries?select=id` y `GET <SUPABASE_URL>/rest/v1/debts?select=id` con PR-08 usando `<TOKEN>`. | Las tres consultas devuelven `[]`. |

**Post-condición:** 0 filas creadas.

---

#### CP-DEU-138 — create_transaction rechaza arreglos vacíos [] en personas y montos con HTTP 400 (23514) y mensaje "Un gasto compartido necesita al menos una persona"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-82 · CA-14 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | API · CP-DEU-016 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-138-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1); `<ACCOUNT_ID>` y `<CATEGORY_ID>` obtenidos con PR-04 (Paso 2).
**Datos de prueba:** D 1: `"p_shared_persons": []`, `"p_shared_amounts": []`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con PR-04 enviando `{"p_type": "expense", "p_amount": 120000, "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null, "p_shared_persons": [], "p_shared_amounts": []}`. | Devuelve HTTP `400`, `"code": "23514"` y `"message": "Un gasto compartido necesita al menos una persona"`. |
| 2 | Consultar `GET <SUPABASE_URL>/rest/v1/transactions?select=id`, `GET <SUPABASE_URL>/rest/v1/ledger_entries?select=id` y `GET <SUPABASE_URL>/rest/v1/debts?select=id` con PR-08 usando `<TOKEN>`. | Las tres consultas devuelven `[]`. |

**Post-condición:** 0 filas creadas.

---

#### CP-DEU-139 — create_transaction rechaza 11 personas con HTTP 400 (23514) y mensaje "Un gasto se comparte con hasta 10 personas"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-82 · CA-14 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | API · CP-DEU-133 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-139-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1); `<ACCOUNT_ID>` y `<CATEGORY_ID>` obtenidos con PR-04 (Paso 2).
**Datos de prueba:** D 1: `"p_shared_persons": ["P1","P2","P3","P4","P5","P6","P7","P8","P9","P10","P11"]`, `"p_shared_amounts": [1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000]`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con PR-04 enviando `{"p_type": "expense", "p_amount": 120000, "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null, "p_shared_persons": ["P1","P2","P3","P4","P5","P6","P7","P8","P9","P10","P11"], "p_shared_amounts": [1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000]}`. | Devuelve HTTP `400`, `"code": "23514"` y `"message": "Un gasto se comparte con hasta 10 personas"`. |
| 2 | Consultar `GET <SUPABASE_URL>/rest/v1/transactions?select=id`, `GET <SUPABASE_URL>/rest/v1/ledger_entries?select=id` y `GET <SUPABASE_URL>/rest/v1/debts?select=id` con PR-08 usando `<TOKEN>`. | Las tres consultas devuelven `[]`. |

**Post-condición:** 0 filas creadas.

---

#### CP-DEU-140 — create_transaction rechaza "Sofía" y "SOFÍA" con HTTP 400 (23514) y mensaje "Cada persona puede aparecer una sola vez"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-82 · CA-14 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-DEU-134 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-140-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1); `<ACCOUNT_ID>` y `<CATEGORY_ID>` obtenidos con PR-04 (Paso 2).
**Datos de prueba:** D 1: `"p_shared_persons": ["Sofía", "SOFÍA"]`, `"p_shared_amounts": [30000, 30000]`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con PR-04 enviando `{"p_type": "expense", "p_amount": 100000, "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null, "p_shared_persons": ["Sofía", "SOFÍA"], "p_shared_amounts": [30000, 30000]}`. | Devuelve HTTP `400`, `"code": "23514"` y `"message": "Cada persona puede aparecer una sola vez"`. |
| 2 | Consultar `GET <SUPABASE_URL>/rest/v1/transactions?select=id`, `GET <SUPABASE_URL>/rest/v1/ledger_entries?select=id` y `GET <SUPABASE_URL>/rest/v1/debts?select=id` con PR-08 usando `<TOKEN>`. | Las tres consultas devuelven `[]`. |

**Post-condición:** 0 filas creadas.

---

#### CP-DEU-141 — create_transaction rechaza gasto de 120000 con montos 60000 y 60000.01 con HTTP 400 (23514) y mensaje "I7: la suma de las deudas no puede superar el monto del gasto"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-82 · CA-14 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | API · CP-DEU-132, CP-DEU-132B |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-141-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1); `<ACCOUNT_ID>` y `<CATEGORY_ID>` obtenidos con PR-04 (Paso 2).
**Datos de prueba:** D 1: `"p_amount": 120000`, `"p_shared_persons": ["Sofía", "Juan"]`, `"p_shared_amounts": [60000, 60000.01]`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con PR-04 enviando `{"p_type": "expense", "p_amount": 120000, "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null, "p_shared_persons": ["Sofía", "Juan"], "p_shared_amounts": [60000, 60000.01]}`. | Devuelve HTTP `400`, `"code": "23514"` y `"message": "I7: la suma de las deudas no puede superar el monto del gasto"`. |
| 2 | Consultar `GET <SUPABASE_URL>/rest/v1/transactions?select=id`, `GET <SUPABASE_URL>/rest/v1/ledger_entries?select=id` y `GET <SUPABASE_URL>/rest/v1/debts?select=id` con PR-08 usando `<TOKEN>`. | Las tres consultas devuelven `[]`. |

**Post-condición:** 0 filas creadas.

---

#### CP-DEU-142 — En UI, gasto de US$3,00 a TC 1000,005 con 3 deudas de US$1,00 muestra "En pesos, la suma supera el gasto por redondeo. Bajá un centavo alguna deuda." y deshabilita "Guardar gasto"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-82 · CA-14, CA-22 · FR-18 |
| Invariante | I4, I7 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · CP-DEU-142A |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-142-001@example.com` con contraseña `Clave123!`, creado con PR-01.
**Datos de prueba:** D 1: gasto `3` USD, TC `1000,005` (`3 × 1000,005 = $3.000,02`), `"Otros"`. D 2: 3 filas (`"Sofía"` `1`, `"Juan"` `1`, `"Ana"` `1`, donde cada una redondea a `$1.000,01` y la suma en pesos da `$3.000,03 > $3.000,02`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-142-001@example.com`. | El campo "Email" muestra `qa+cp-deu-142-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre Registrar en el paso 1 de 3. |
| 5 | Hacer click en la moneda `US$`, escribir `3` en el campo del monto, escribir `1000,005` en el campo de tipo de cambio y hacer click en "Siguiente". | Se abre el paso 2 de 3. |
| 6 | Hacer click en la categoría "Otros". | Se abre el paso 3 de 3. |
| 7 | Hacer click en el interruptor "Gasto compartido" (`data-testid="transaction-form-shared-toggle"`), escribir `Sofía` y `1` en la fila 1, hacer click en "Agregar persona", escribir `Juan` y `1` en la fila 2, hacer click en "Agregar persona", escribir `Ana` y `1` en la fila 3 y presionar Tab. | Aparece `data-testid="transaction-form-shared-total-error"` (`role="alert"`) con el texto exacto `"En pesos, la suma supera el gasto por redondeo. Bajá un centavo alguna deuda."` y el botón "Guardar gasto" (`data-testid="transaction-form-submit"`) queda deshabilitado. |

**Post-condición:** sin escrituras en base de datos.

---

#### CP-DEU-142A — create_transaction rechaza gasto de US$3,00 a TC 1000.005 con tres deudas de 1 con HTTP 400 (23514) y mensaje "I7: en pesos, la suma de las deudas supera el gasto por redondeo"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-82 · CA-14 · FR-18 |
| Invariante | I4, I7 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | API · CP-DEU-142 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-142a-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1); `<ACCOUNT_ID>` y `<CATEGORY_ID>` obtenidos con PR-04 (Paso 2).
**Datos de prueba:** D 1: `"p_currency": "USD"`, `"p_amount": 3`, `"p_fx_rate": 1000.005`, `"p_shared_persons": ["Sofía", "Juan", "Ana"]`, `"p_shared_amounts": [1, 1, 1]`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con PR-04 enviando `{"p_type": "expense", "p_amount": 3, "p_currency": "USD", "p_fx_rate": 1000.005, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null, "p_shared_persons": ["Sofía", "Juan", "Ana"], "p_shared_amounts": [1, 1, 1]}`. | Devuelve HTTP `400`, `"code": "23514"` y `"message": "I7: en pesos, la suma de las deudas supera el gasto por redondeo"`. |
| 2 | Consultar `GET <SUPABASE_URL>/rest/v1/transactions?select=id`, `GET <SUPABASE_URL>/rest/v1/ledger_entries?select=id` y `GET <SUPABASE_URL>/rest/v1/debts?select=id` con PR-08 usando `<TOKEN>`. | Las tres consultas devuelven `[]`. |

**Post-condición:** 0 filas creadas.

---

#### CP-DEU-142B — create_transaction rechaza segunda persona "   " con HTTP 400 (23514) y mensaje "Ingresá con quién compartiste el gasto", sin crear ni el gasto ni la primera deuda (atomicidad C4)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-82 · CA-14 · FR-18 |
| Invariante | I7 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-DEU-135 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-142b-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1); `<ACCOUNT_ID>` y `<CATEGORY_ID>` obtenidos con PR-04 (Paso 2).
**Datos de prueba:** D 1: `"p_shared_persons": ["Sofía", "   "]`, `"p_shared_amounts": [30000, 20000]`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con PR-04 enviando `{"p_type": "expense", "p_amount": 120000, "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null, "p_shared_persons": ["Sofía", "   "], "p_shared_amounts": [30000, 20000]}`. | Devuelve HTTP `400`, `"code": "23514"` y `"message": "Ingresá con quién compartiste el gasto"`. |
| 2 | Consultar `GET <SUPABASE_URL>/rest/v1/transactions?select=id`, `GET <SUPABASE_URL>/rest/v1/ledger_entries?select=id` y `GET <SUPABASE_URL>/rest/v1/debts?select=id` con PR-08 usando `<TOKEN>`. | Las tres consultas devuelven `[]` (no se creó ni el gasto ni la deuda de Sofía). |

**Post-condición:** 0 filas en `transactions`, `ledger_entries` y `debts`.

---

### Sección 7 — Gasto neto de reembolsos y deudas sueltas en el balance del Resumen (US-30, US-83)

#### CP-DEU-143 — Gasto de $120.000,00 en 1 cuota con deuda vinculada pendiente de $60.000,00 muestra Gastado $120.000,00 (bruto), Neto de reembolsos $60.000,00 y "Ver deudas" navega a /debts

| Campo | Contenido |
|---|---|
| Historia · criterio | US-30 · CA-1, CA-9, CA-10 · FR-19 · R3 |
| Invariante | I7, I10 |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-143-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` y `<USER_ID>` obtenidos con PR-04 (Paso 1); `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Paso 2). S 3: gasto compartido D 1 creado con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con `{"p_type": "expense", "p_amount": "120000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": "Supermercado", "p_shared_persons": ["Sofía"], "p_shared_amounts": ["60000.00"]}`).
**Datos de prueba:** D 1: gasto `$120.000,00` del `15/08/2026` (`first_period = '2026-08'`) con deuda vinculada pendiente de `$60.000,00` (`owed_to_me`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-143-001@example.com`. | El campo "Email" muestra `qa+cp-deu-143-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/dashboard?period=2026-08` en la barra de direcciones y presionar Enter. | En la tarjeta "Gastado en agosto 2026": el número principal `data-testid="dashboard-total-expenses"` muestra `"$120.000,00"` (bruto); aparece la fila `data-testid="dashboard-net-reimbursements"` con la etiqueta `"Neto de reembolsos"` y el monto `data-testid="dashboard-net-reimbursements-amount"` = `"$60.000,00"`; el elemento `data-testid="dashboard-net-reimbursements-note"` no existe en el DOM; y debajo se ve el enlace `"Ver deudas"` (`data-testid="dashboard-net-reimbursements-link"`). |
| 6 | Hacer click en el enlace `"Ver deudas"` (`data-testid="dashboard-net-reimbursements-link"`). | El navegador navega a `<APP>/debts` y muestra la deuda de Sofía por `$60.000,00`. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-144 — Con la deuda vinculada ya saldada, el Resumen sigue mostrando Gastado $120.000,00 (bruto) y Neto de reembolsos $60.000,00

| Campo | Contenido |
|---|---|
| Historia · criterio | US-30 · CA-2, CA-10 · FR-19 · R3 |
| Invariante | I9, I10 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-144-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` y `<USER_ID>` obtenidos con PR-04 (Paso 1); `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Paso 2). S 3: gasto compartido D 1 creado con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con `{"p_type": "expense", "p_amount": "120000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null, "p_shared_persons": ["Sofía"], "p_shared_amounts": ["60000.00"]}`). S 4: `<DEBT_ID>` obtenido con PR-08 (`GET /rest/v1/debts?select=id`) y saldado con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/settle_debt` con `{"p_debt_id": "<DEBT_ID>"}`).
**Datos de prueba:** D 1: gasto `$120.000,00` del `15/08/2026` con deuda vinculada saldada (`status = 'settled'`) de `$60.000,00`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-144-001@example.com`. | El campo "Email" muestra `qa+cp-deu-144-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/dashboard?period=2026-08` en la barra de direcciones y presionar Enter. | `data-testid="dashboard-total-expenses"` muestra `"$120.000,00"` y `data-testid="dashboard-net-reimbursements-amount"` muestra `"$60.000,00"`. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-145 — Gasto de $120.000,00 en 12 cuotas del 15/08/2026 con deuda vinculada de $60.000,00 muestra en 2026-08 Gastado $10.000,00, Neto -$50.000,00 y la nota aclaratoria, y en 2026-09 no muestra la fila del neto

| Campo | Contenido |
|---|---|
| Historia · criterio | US-30 · CA-3, CA-7, CA-8, CA-10 · FR-19 · R1, R3 |
| Invariante | I2, I3, I7, I10 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-145-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` y `<USER_ID>` obtenidos con PR-04 (Paso 1); `<ACCOUNT_ID>` de `"Tarjeta de crédito"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Paso 2). S 3: gasto en 12 cuotas D 1 creado con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con `{"p_type": "expense", "p_amount": "120000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 12, "p_occurred_on": "2026-08-15", "p_description": null, "p_shared_persons": ["Sofía"], "p_shared_amounts": ["60000.00"]}`).
**Datos de prueba:** D 1: gasto `$120.000,00` en 12 cuotas (`$10.000,00` por mes desde `2026-08`) con deuda vinculada de `$60.000,00`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-145-001@example.com`. | El campo "Email" muestra `qa+cp-deu-145-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/dashboard?period=2026-08` en la barra de direcciones y presionar Enter. | En el Resumen de agosto 2026: `data-testid="dashboard-total-expenses"` muestra `"$10.000,00"`; `data-testid="dashboard-net-reimbursements-amount"` muestra `"-$50.000,00"` (`$10.000,00 − $60.000,00`); y debajo se ve `data-testid="dashboard-net-reimbursements-note"` con el texto exacto `"Las deudas se descuentan enteras en el mes de la compra, aunque sea en cuotas."`. |
| 6 | Escribir `<APP>/dashboard?period=2026-09` en la barra de direcciones y presionar Enter. | En el Resumen de septiembre 2026: `data-testid="dashboard-total-expenses"` muestra `"$10.000,00"` (cuota 2/12) y el elemento `data-testid="dashboard-net-reimbursements"` no existe en el DOM. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-146 — Una deuda suelta "Me deben" en el período no hace aparecer la fila "Neto de reembolsos" ni cambia el total gastado

| Campo | Contenido |
|---|---|
| Historia · criterio | US-30 · CA-4 · FR-19 |
| Invariante | I7 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-146-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` y `<USER_ID>` obtenidos con PR-04 (Paso 1); `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Paso 2). S 3: gasto sin deuda D 1 creado con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con `{"p_type": "expense", "p_amount": "80000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null}`). S 4: deuda suelta D 2 creada con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con `{"p_direction": "owed_to_me", "p_person": "Juan", "p_amount": "25000.00", "p_currency": "ARS", "p_fx_rate": null, "p_incurred_on": "2026-08-16", "p_notes": null}`).
**Datos de prueba:** D 1: gasto `$80.000,00` sin deuda (`2026-08-15`). D 2: deuda suelta `owed_to_me` de `$25.000,00` (`2026-08-16`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-146-001@example.com`. | El campo "Email" muestra `qa+cp-deu-146-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/dashboard?period=2026-08` en la barra de direcciones y presionar Enter. | `data-testid="dashboard-total-expenses"` muestra `"$80.000,00"` y el elemento `data-testid="dashboard-net-reimbursements"` no existe en el DOM. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-147 — Una deuda suelta "Debo" (i_owe) en el período no hace aparecer la fila "Neto de reembolsos" ni cambia el neto cuando hay una deuda vinculada

| Campo | Contenido |
|---|---|
| Historia · criterio | US-30 · CA-4 · FR-19 |
| Invariante | I7 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-147-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` y `<USER_ID>` obtenidos con PR-04 (Paso 1); `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Paso 2). S 3: gasto compartido D 1 creado con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con `{"p_type": "expense", "p_amount": "120000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null, "p_shared_persons": ["Sofía"], "p_shared_amounts": ["60000.00"]}`). S 4: deuda suelta `i_owe` D 2 creada con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con `{"p_direction": "i_owe", "p_person": "Martín", "p_amount": "15000.00", "p_currency": "ARS", "p_fx_rate": null, "p_incurred_on": "2026-08-16", "p_notes": null}`).
**Datos de prueba:** D 1: gasto `$120.000,00` con deuda vinculada `$60.000,00`. D 2: deuda suelta `i_owe` `$15.000,00`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-147-001@example.com`. | El campo "Email" muestra `qa+cp-deu-147-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/dashboard?period=2026-08` en la barra de direcciones y presionar Enter. | `data-testid="dashboard-total-expenses"` muestra `"$120.000,00"` y `data-testid="dashboard-net-reimbursements-amount"` muestra `"$60.000,00"` (la deuda `i_owe` de `$15.000,00` no suma ni resta en el neto). |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-148 — Con dos gastos compartidos en el mes, eliminar uno desde "Últimos movimientos" del Resumen actualiza el neto en vivo sin recargar la página

| Campo | Contenido |
|---|---|
| Historia · criterio | US-30 · CA-5 · US-35 · CA-5 · FR-19 |
| Invariante | I7, I10 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-148-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` y `<USER_ID>` obtenidos con PR-04 (Paso 1); `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Paso 2). S 3: gasto 1 D 1 creado con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con `{"p_type": "expense", "p_amount": "100000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": "Cena", "p_shared_persons": ["Sofía"], "p_shared_amounts": ["40000.00"]}`) y gasto 2 D 2 creado con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con `{"p_type": "expense", "p_amount": "50000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-16", "p_description": "Taxi", "p_shared_persons": ["Juan"], "p_shared_amounts": ["20000.00"]}`).
**Datos de prueba:** D 1: gasto 1 de `$100.000,00` del `15/08/2026` (`"Cena"`) con deuda de `"Sofía"` por `$40.000,00`. D 2: gasto 2 de `$50.000,00` del `16/08/2026` (`"Taxi"`) con deuda de `"Juan"` por `$20.000,00`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-148-001@example.com`. | El campo "Email" muestra `qa+cp-deu-148-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/dashboard?period=2026-08` en la barra de direcciones y presionar Enter. | `data-testid="dashboard-total-expenses"` muestra `"$150.000,00"` y `data-testid="dashboard-net-reimbursements-amount"` muestra `"$90.000,00"` (`$150.000,00 − $60.000,00`). |
| 6 | En "Últimos movimientos" del Resumen, hacer click en el botón de papelera (`data-testid="dashboard-transaction-item-delete"`) del gasto `"Taxi"` (`$50.000,00`) y confirmar haciendo click en "Eliminar" (`data-testid="delete-transaction-confirm"`). | Sin recargar la página, `data-testid="dashboard-total-expenses"` pasa a `"$100.000,00"` y `data-testid="dashboard-net-reimbursements-amount"` pasa a `"$60.000,00"` (`$100.000,00 − $40.000,00`). |

**Post-condición:** gasto `"Taxi"` con `deleted_at` no nulo; neto en `$60.000,00`.

---

#### CP-DEU-148B — Restaurar desde Eliminados un gasto compartido eliminado vuelve a restar su deuda en el "Neto de reembolsos" del Resumen

| Campo | Contenido |
|---|---|
| Historia · criterio | US-30 · CA-5 · US-35 · CA-6 · FR-19 |
| Invariante | I7, I10 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-148b-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` y `<USER_ID>` obtenidos con PR-04 (Paso 1); `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Paso 2). S 3: gasto 1 D 1 creado con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con `{"p_type": "expense", "p_amount": "100000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": "Cena", "p_shared_persons": ["Sofía"], "p_shared_amounts": ["40000.00"]}`) y gasto 2 D 2 creado con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con `{"p_type": "expense", "p_amount": "50000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-16", "p_description": "Taxi", "p_shared_persons": ["Juan"], "p_shared_amounts": ["20000.00"]}` → `<TX_ID_TAXI>`). S 4: gasto `"Taxi"` eliminado con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/delete_transaction` con `{"p_transaction_id": "<TX_ID_TAXI>"}`).
**Datos de prueba:** D 1: gasto `"Cena"` activo (`$100.000,00`, deuda `$40.000,00`). D 2: gasto `"Taxi"` eliminado (`$50.000,00`, deuda `$20.000,00`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-148b-001@example.com`. | El campo "Email" muestra `qa+cp-deu-148b-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/transactions?period=2026-08` en la barra de direcciones y presionar Enter, hacer click en "Eliminados" y hacer click en "Restaurar" en la fila de `"Taxi"`. | El gasto `"Taxi"` se restaura a Movimientos activos. |
| 6 | Escribir `<APP>/dashboard?period=2026-08` en la barra de direcciones y presionar Enter. | `data-testid="dashboard-total-expenses"` muestra `"$150.000,00"` y `data-testid="dashboard-net-reimbursements-amount"` muestra `"$90.000,00"` (`$150.000,00 − $60.000,00`). |

**Post-condición:** ambos gastos activos y neto en `$90.000,00`.

---

#### CP-DEU-149 — Gasto de US$100,00 a TC 1250 ($125.000,00) con deuda vinculada de US$40,00 ($50.000,00) muestra Neto $75.000,00 y no cambia aunque se modifique el TC de referencia del mes a 1500 (C5)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-30 · CA-6, CA-10 · FR-19 · R2, R3 |
| Invariante | I4, I7, I10 |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-149-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` y `<USER_ID>` obtenidos con PR-04 (Paso 1); `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Paso 2). S 3: gasto en USD compartido D 1 creado con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con `{"p_type": "expense", "p_amount": "100.00", "p_currency": "USD", "p_fx_rate": "1250.0000", "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null, "p_shared_persons": ["Sofía"], "p_shared_amounts": ["40.00"]}`). S 4: tipo de cambio de referencia del mes actualizado a `1500.0000` con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/upsert_fx_rate` con `{"p_period": "2026-08-01", "p_ars_per_usd": "1500.0000"}`).
**Datos de prueba:** D 1: gasto `US$100,00` a TC `1250` (`amount_ars = $125.000,00`) con deuda vinculada de `US$40,00` (`amount_ars = $50.000,00`). D 2: nuevo TC de referencia `1500`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-149-001@example.com`. | El campo "Email" muestra `qa+cp-deu-149-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/dashboard?period=2026-08` en la barra de direcciones y presionar Enter. | `data-testid="dashboard-total-expenses"` muestra `"$125.000,00"` y `data-testid="dashboard-net-reimbursements-amount"` muestra `"$75.000,00"` (`$125.000,00 − $50.000,00`, usando el `amount_ars` congelado de la deuda y no `$60.000,00`). |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-150 — Un período con gastos sin deudas vinculadas no muestra dashboard-net-reimbursements en el DOM

| Campo | Contenido |
|---|---|
| Historia · criterio | US-30 · CA-7, CA-8 · FR-19 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-150-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` y `<USER_ID>` obtenidos con PR-04 (Paso 1); `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Paso 2). S 3: gasto sin deuda D 1 creado con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con `{"p_type": "expense", "p_amount": "45000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "2026-08-15", "p_description": null}`).
**Datos de prueba:** D 1: gasto `$45.000,00` del `15/08/2026` sin deudas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-150-001@example.com`. | El campo "Email" muestra `qa+cp-deu-150-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/dashboard?period=2026-08` en la barra de direcciones y presionar Enter. | `data-testid="dashboard-total-expenses"` muestra `"$45.000,00"` y el elemento `data-testid="dashboard-net-reimbursements"` no existe en el DOM. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-151 — Con un ingreso de $100.000,00 y una deuda suelta "Me deben" de $20.000,00 en el mes H, el Resumen de H muestra Balance $80.000,00 con "Superávit" e "Incluye deudas sueltas: -$20.000,00"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-83 · CA-1, CA-10, CA-14 · FR-18, FR-20 |
| Invariante | I7 |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-151-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` y `<USER_ID>` obtenidos con PR-04 (Paso 1); `<ACCOUNT_ID>` de `"Efectivo"` obtenido con PR-04 (Paso 2). S 3: con `<H>` y `<H_FECHA>` según la tabla de Convenciones, ingreso D 1 creado con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con `{"p_type": "income", "p_amount": "100000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": null, "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "<H_FECHA>", "p_description": null}`) y deuda suelta D 2 creada con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con `{"p_direction": "owed_to_me", "p_person": "Juan", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": null, "p_incurred_on": "<H_FECHA>", "p_notes": null}`).
**Datos de prueba:** D 1: ingreso `$100.000,00` en `<H_FECHA>`. D 2: deuda suelta `owed_to_me` a `"Juan"` por `$20.000,00` en `<H_FECHA>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-151-001@example.com`. | El campo "Email" muestra `qa+cp-deu-151-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/dashboard?period=<H>` en la barra de direcciones y presionar Enter. | `data-testid="dashboard-total-income"` muestra `"$100.000,00"`; `data-testid="dashboard-total-expenses"` muestra `"$0,00"`; `data-testid="dashboard-total-balance"` muestra `"$80.000,00"`; `data-testid="dashboard-balance-badge"` muestra `"Superávit"`; `data-testid="dashboard-balance-loose-debts"` muestra el texto exacto `"Incluye deudas sueltas: -$20.000,00"`; y `data-testid="dashboard-net-reimbursements"` no existe en el DOM. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-152 — Con un ingreso de $100.000,00 y una deuda suelta "Debo" de $50.000,00 en el mes H, el Resumen de H muestra Balance $150.000,00 e "Incluye deudas sueltas: $50.000,00"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-83 · CA-2, CA-10 · FR-18, FR-20 |
| Invariante | I7 |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-152-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` y `<USER_ID>` obtenidos con PR-04 (Paso 1); `<ACCOUNT_ID>` de `"Efectivo"` obtenido con PR-04 (Paso 2). S 3: con `<H>` y `<H_FECHA>` según la tabla de Convenciones, ingreso D 1 creado con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con `{"p_type": "income", "p_amount": "100000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": null, "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "<H_FECHA>", "p_description": null}`) y deuda suelta D 2 creada con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con `{"p_direction": "i_owe", "p_person": "Marta", "p_amount": "50000.00", "p_currency": "ARS", "p_fx_rate": null, "p_incurred_on": "<H_FECHA>", "p_notes": null}`).
**Datos de prueba:** D 1: ingreso `$100.000,00` en `<H_FECHA>`. D 2: deuda suelta `i_owe` a `"Marta"` por `$50.000,00` en `<H_FECHA>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-152-001@example.com`. | El campo "Email" muestra `qa+cp-deu-152-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/dashboard?period=<H>` en la barra de direcciones y presionar Enter. | `data-testid="dashboard-total-income"` muestra `"$100.000,00"`; `data-testid="dashboard-total-expenses"` muestra `"$0,00"`; `data-testid="dashboard-total-balance"` muestra `"$150.000,00"`; `data-testid="dashboard-balance-badge"` muestra `"Superávit"`; y `data-testid="dashboard-balance-loose-debts"` muestra el texto exacto `"Incluye deudas sueltas: $50.000,00"`. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-153 — Saldar hoy la deuda suelta "Me deben" de $20.000,00 creada en H deja el balance de H en $100.000,00 y la línea en "Incluye deudas sueltas: $0,00"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-83 · CA-3 · FR-18, FR-20 |
| Invariante | I7, I9 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-153-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` y `<USER_ID>` obtenidos con PR-04 (Paso 1); `<ACCOUNT_ID>` de `"Efectivo"` obtenido con PR-04 (Paso 2). S 3: con `<H>` y `<H_FECHA>` según la tabla de Convenciones, ingreso D 1 creado con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con `{"p_type": "income", "p_amount": "100000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": null, "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "<H_FECHA>", "p_description": null}`) y deuda suelta D 2 creada con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con `{"p_direction": "owed_to_me", "p_person": "Juan", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": null, "p_incurred_on": "<H_FECHA>", "p_notes": null}` → `<DEBT_ID>`) y saldada con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/settle_debt` con `{"p_debt_id": "<DEBT_ID>"}`).
**Datos de prueba:** D 1: ingreso `$100.000,00` en `<H_FECHA>`. D 2: deuda suelta `owed_to_me` `$20.000,00` creada en `<H_FECHA>` y saldada hoy (ambos eventos en `<H>`: `-$20.000,00 + $20.000,00 = $0,00`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-153-001@example.com`. | El campo "Email" muestra `qa+cp-deu-153-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/dashboard?period=<H>` en la barra de direcciones y presionar Enter. | `data-testid="dashboard-total-balance"` muestra `"$100.000,00"`, `data-testid="dashboard-balance-badge"` muestra `"Superávit"` y `data-testid="dashboard-balance-loose-debts"` muestra el texto exacto `"Incluye deudas sueltas: $0,00"`. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-153B — Sin ingresos ni gastos, una deuda suelta "Me deben" de $20.000,00 creada y saldada en H deja el balance de H en $0,00 con la etiqueta "En cero" e "Incluye deudas sueltas: $0,00"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-83 · CA-3, CA-9, CA-10 · FR-18, FR-20 |
| Invariante | I7, I9 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-153b-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: con `<H>` y `<H_FECHA>` según la tabla de Convenciones, deuda suelta D 1 creada con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con `{"p_direction": "owed_to_me", "p_person": "Juan", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": null, "p_incurred_on": "<H_FECHA>", "p_notes": null}` → `<DEBT_ID>`) y saldada hoy con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/settle_debt` con `{"p_debt_id": "<DEBT_ID>"}`).
**Datos de prueba:** D 1: 0 transacciones; 1 deuda suelta `owed_to_me` de `$20.000,00` con alta y saldado en `<H>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-153b-001@example.com`. | El campo "Email" muestra `qa+cp-deu-153b-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/dashboard?period=<H>` en la barra de direcciones y presionar Enter. | `data-testid="dashboard-total-income"` muestra `"$0,00"`; `data-testid="dashboard-total-expenses"` muestra `"$0,00"`; `data-testid="dashboard-total-balance"` muestra `"$0,00"`; `data-testid="dashboard-balance-badge"` muestra el texto exacto `"En cero"`; y `data-testid="dashboard-balance-loose-debts"` muestra `"Incluye deudas sueltas: $0,00"`. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-154 — Una deuda suelta "Me deben" de $20.000,00 con fecha de H−1 saldada hoy resta $20.000,00 en el balance de H−1 y suma $20.000,00 en el de H

| Campo | Contenido |
|---|---|
| Historia · criterio | US-83 · CA-4, CA-10, CA-11 · FR-18, FR-20 |
| Invariante | I7, I9 |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-154-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: con `<H>`, `<H-1>` y `<H-1_FECHA>` según la tabla de Convenciones, deuda suelta D 1 creada con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con `{"p_direction": "owed_to_me", "p_person": "Juan", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": null, "p_incurred_on": "<H-1_FECHA>", "p_notes": null}` → `<DEBT_ID>`) y saldada hoy con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/settle_debt` con `{"p_debt_id": "<DEBT_ID>"}`).
**Datos de prueba:** D 1: deuda suelta `owed_to_me` de `$20.000,00` con `incurred_on = <H-1_FECHA>` y `settled_at` en `<H>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-154-001@example.com`. | El campo "Email" muestra `qa+cp-deu-154-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/dashboard?period=<H-1>` en la barra de direcciones y presionar Enter. | `data-testid="dashboard-total-balance"` muestra `"-$20.000,00"`, `data-testid="dashboard-balance-badge"` muestra `"Déficit"` y `data-testid="dashboard-balance-loose-debts"` muestra `"Incluye deudas sueltas: -$20.000,00"`. |
| 6 | Escribir `<APP>/dashboard?period=<H>` en la barra de direcciones y presionar Enter. | `data-testid="dashboard-total-balance"` muestra `"$20.000,00"`, `data-testid="dashboard-balance-badge"` muestra `"Superávit"` y `data-testid="dashboard-balance-loose-debts"` muestra `"Incluye deudas sueltas: $20.000,00"`. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-155 — Reabrir (US-40) la deuda suelta de H−1 saldada hoy saca el evento de H (la línea desaparece) y mantiene H−1 en -$20.000,00

| Campo | Contenido |
|---|---|
| Historia · criterio | US-83 · CA-5, CA-14 · FR-18, FR-20 |
| Invariante | I7, I9 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-155-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` y `<USER_ID>` obtenidos con PR-04 (Paso 1); `<ACCOUNT_ID>` de `"Efectivo"` obtenido con PR-04 (Paso 2). S 3: con `<H>`, `<H_FECHA>`, `<H-1>` y `<H-1_FECHA>` según la tabla de Convenciones, ingreso D 1 creado con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con `{"p_type": "income", "p_amount": "100000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": null, "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "<H_FECHA>", "p_description": null}`) y deuda suelta D 2 creada con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con `{"p_direction": "owed_to_me", "p_person": "Juan", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": null, "p_incurred_on": "<H-1_FECHA>", "p_notes": null}` → `<DEBT_ID>`) y saldada hoy con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/settle_debt` con `{"p_debt_id": "<DEBT_ID>"}`).
**Datos de prueba:** D 1: ingreso `$100.000,00` en `<H_FECHA>`. D 2: deuda suelta `owed_to_me` `$20.000,00` en `<H-1_FECHA>`, saldada en `<H>` y luego reabierta desde UI.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-155-001@example.com`. | El campo "Email" muestra `qa+cp-deu-155-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/debts?status=settled` en la barra de direcciones y presionar Enter, y hacer click en "Volver a pendiente" (`data-testid="debts-item-reopen"`) en la fila de Juan. | Aparece el aviso `"La deuda con Juan volvió a pendiente"` (`data-testid="debts-reopened"`). |
| 6 | Escribir `<APP>/dashboard?period=<H>` en la barra de direcciones y presionar Enter. | `data-testid="dashboard-total-balance"` vuelve a mostrar `"$100.000,00"` (ingresos − gastos) y el elemento `data-testid="dashboard-balance-loose-debts"` no existe en el DOM. |
| 7 | Escribir `<APP>/dashboard?period=<H-1>` en la barra de direcciones y presionar Enter. | `data-testid="dashboard-total-balance"` sigue mostrando `"-$20.000,00"` y `data-testid="dashboard-balance-loose-debts"` muestra `"Incluye deudas sueltas: -$20.000,00"`. |

**Post-condición:** deuda de Juan en `status = 'pending'` y `settled_at = null`.

---

#### CP-DEU-156 — Una deuda suelta "Debo" de $50.000,00 con fecha de H−1 saldada hoy suma $50.000,00 en H−1 y resta $50.000,00 en H

| Campo | Contenido |
|---|---|
| Historia · criterio | US-83 · CA-6, CA-11 · FR-18, FR-20 |
| Invariante | I7, I9 |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-156-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: con `<H>`, `<H-1>` y `<H-1_FECHA>` según la tabla de Convenciones, deuda suelta D 1 creada con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con `{"p_direction": "i_owe", "p_person": "Marta", "p_amount": "50000.00", "p_currency": "ARS", "p_fx_rate": null, "p_incurred_on": "<H-1_FECHA>", "p_notes": null}` → `<DEBT_ID>`) y saldada hoy con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/settle_debt` con `{"p_debt_id": "<DEBT_ID>"}`).
**Datos de prueba:** D 1: deuda suelta `i_owe` de `$50.000,00` en `<H-1_FECHA>`, saldada en `<H>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-156-001@example.com`. | El campo "Email" muestra `qa+cp-deu-156-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/dashboard?period=<H-1>` en la barra de direcciones y presionar Enter. | `data-testid="dashboard-total-balance"` muestra `"$50.000,00"`, `data-testid="dashboard-balance-badge"` muestra `"Superávit"` y `data-testid="dashboard-balance-loose-debts"` muestra `"Incluye deudas sueltas: $50.000,00"`. |
| 6 | Escribir `<APP>/dashboard?period=<H>` en la barra de direcciones y presionar Enter. | `data-testid="dashboard-total-balance"` muestra `"-$50.000,00"`, `data-testid="dashboard-balance-badge"` muestra `"Déficit"` y `data-testid="dashboard-balance-loose-debts"` muestra `"Incluye deudas sueltas: -$50.000,00"`. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-157 — Deuda suelta "Me deben" de US$40,00 a TC 1250 con fecha de H−1 resta $50.000,00 en H−1 y, al saldarse hoy con TC de referencia de H en 1500, suma $50.000,00 en H y no $60.000,00 (TC congelado, C5)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-83 · CA-7 · FR-18, FR-20 · R2 |
| Invariante | I4, I7, I9 |
| Técnica · Tipo | Caso de uso · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-157-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: con `<H>`, `<H-1>` y `<H-1_FECHA>` según la tabla de Convenciones, deuda suelta D 1 creada con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con `{"p_direction": "owed_to_me", "p_person": "Juan", "p_amount": "40.00", "p_currency": "USD", "p_fx_rate": "1250.0000", "p_incurred_on": "<H-1_FECHA>", "p_notes": null}` → `<DEBT_ID>`). S 4: tipo de cambio de referencia del mes `<H>` actualizado a `1500.0000` con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/upsert_fx_rate` con `{"p_period": "<H>-01", "p_ars_per_usd": "1500.0000"}`) y luego deuda D 1 saldada hoy con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/settle_debt` con `{"p_debt_id": "<DEBT_ID>"}`).
**Datos de prueba:** D 1: deuda suelta `owed_to_me` de `US$40,00` a TC `1250` (`amount_ars = $50.000,00` congelado). D 2: TC de referencia en `<H>` cambiado a `1500` antes de saldar.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-157-001@example.com`. | El campo "Email" muestra `qa+cp-deu-157-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/dashboard?period=<H-1>` en la barra de direcciones y presionar Enter. | `data-testid="dashboard-total-balance"` muestra `"-$50.000,00"` y `data-testid="dashboard-balance-loose-debts"` muestra `"Incluye deudas sueltas: -$50.000,00"`. |
| 6 | Escribir `<APP>/dashboard?period=<H>` en la barra de direcciones y presionar Enter. | `data-testid="dashboard-total-balance"` muestra `"$50.000,00"` (no `"$60.000,00"`) y `data-testid="dashboard-balance-loose-debts"` muestra `"Incluye deudas sueltas: $50.000,00"`. |

**Post-condición:** sin cambios en base de datos.

---

#### CP-DEU-158 — Un gasto compartido de $120.000,00 con deuda vinculada de $60.000,00 en H deja el balance de H en ingresos − gastos y no muestra dashboard-balance-loose-debts ni antes ni después de saldar la deuda

| Campo | Contenido |
|---|---|
| Historia · criterio | US-83 · CA-8, CA-14 · FR-18, FR-20 |
| Invariante | I7, I9 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-158-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` y `<USER_ID>` obtenidos con PR-04 (Paso 1); `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Otros"` obtenidos con PR-04 (Paso 2). S 3: con `<H>` y `<H_FECHA>` según la tabla de Convenciones, gasto compartido D 1 creado con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con `{"p_type": "expense", "p_amount": "120000.00", "p_currency": "ARS", "p_fx_rate": null, "p_category_id": "<CATEGORY_ID>", "p_account_id": "<ACCOUNT_ID>", "p_installments_count": 1, "p_occurred_on": "<H_FECHA>", "p_description": null, "p_shared_persons": ["Sofía"], "p_shared_amounts": ["60000.00"]}`).
**Datos de prueba:** D 1: gasto compartido `$120.000,00` en `<H_FECHA>` con deuda vinculada de `$60.000,00`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-158-001@example.com`. | El campo "Email" muestra `qa+cp-deu-158-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/dashboard?period=<H>` en la barra de direcciones y presionar Enter. | `data-testid="dashboard-total-expenses"` muestra `"$120.000,00"`, `data-testid="dashboard-total-balance"` muestra `"-$120.000,00"` y el elemento `data-testid="dashboard-balance-loose-debts"` no existe en el DOM. |
| 6 | Escribir `<APP>/debts` en la barra de direcciones y presionar Enter, y hacer click en "Marcar saldada" (`data-testid="debts-item-settle"`) en la fila de Sofía. | Aparece el aviso `"Deuda con Sofía saldada"`. |
| 7 | Escribir `<APP>/dashboard?period=<H>` en la barra de direcciones y presionar Enter. | `data-testid="dashboard-total-balance"` sigue mostrando `"-$120.000,00"` y el elemento `data-testid="dashboard-balance-loose-debts"` sigue sin existir en el DOM. |

**Post-condición:** deuda vinculada de Sofía saldada; balance sin cambios por la deuda vinculada.

---

#### CP-DEU-159 — Un mes sin transacciones y con solo una deuda suelta "Me deben" de $20.000,00 no muestra dashboard-empty: muestra Gastado $0,00, Ingresos $0,00, Balance -$20.000,00 con "Déficit" e "Incluye deudas sueltas: -$20.000,00"

| Campo | Contenido |
|---|---|
| Historia · criterio | US-83 · CA-9, CA-10 · FR-18, FR-20 |
| Invariante | I7 |
| Técnica · Tipo | Valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí |

**Pre-requisitos:** S 1: usuario `qa+cp-deu-159-001@example.com` con contraseña `Clave123!`, creado con PR-01. S 2: `<TOKEN>` obtenido con PR-04 (Paso 1). S 3: deuda suelta D 1 creada con PR-04 (`POST <SUPABASE_URL>/rest/v1/rpc/create_debt` con `{"p_direction": "owed_to_me", "p_person": "Juan", "p_amount": "20000.00", "p_currency": "ARS", "p_fx_rate": null, "p_incurred_on": "2026-08-15", "p_notes": null}`).
**Datos de prueba:** D 1: 0 transacciones en `2026-08`; 1 deuda suelta `owed_to_me` de `$20.000,00` del `15/08/2026`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito, escribir `<APP>` en la barra de direcciones y presionar Enter. | Se abre la pantalla "Entrar". |
| 2 | Hacer click en el campo "Email" y escribir `qa+cp-deu-159-001@example.com`. | El campo "Email" muestra `qa+cp-deu-159-001@example.com`. |
| 3 | Hacer click en el campo "Contraseña" y escribir `Clave123!`. | El campo "Contraseña" muestra los caracteres ocultos. |
| 4 | Hacer click en el botón "Entrar". | Se abre la app en Registrar. |
| 5 | Escribir `<APP>/dashboard?period=2026-08` en la barra de direcciones y presionar Enter. | El elemento `data-testid="dashboard-empty"` no existe en el DOM; se ven las tarjetas del Resumen con `data-testid="dashboard-total-expenses"` = `"$0,00"`, `data-testid="dashboard-total-income"` = `"$0,00"`, `data-testid="dashboard-total-balance"` = `"-$20.000,00"`, `data-testid="dashboard-balance-badge"` = `"Déficit"` y `data-testid="dashboard-balance-loose-debts"` = `"Incluye deudas sueltas: -$20.000,00"`, y las secciones de categorías, cuentas y últimos movimientos muestran sus estados vacíos individuales. |

**Post-condición:** sin cambios en base de datos.

---

## (c) Historias o criterios de aceptación sin caso manual (Huecos)

| ID | Historia · criterio | Motivo por el que no tiene caso manual en este archivo | Cobertura prevista |
|---|---|---|---|
| **H-DEU-01** | **US-36 · CA-10 (doble toque)**, **US-39 · CA-3 (estado `"Saldando…"` y doble toque)** y **US-39 · CA-4 (doble toque en `"Deshacer"` y desaparición a los 5 s por reloj)** | En entorno local contra Supabase en `127.0.0.1`, la RPC responde en `< 20 ms`, por lo que un ejecutante manual no puede observar de forma reproducible el texto transitorio `"Saldando…"` ni ejecutar dos clicks antes de la respuesta sin usar demoras artificiales de red (`page.route` / Network Throttling) o reloj simulado. | Se cubren en pruebas automatizadas de componente/E2E (Vitest / Playwright) reteniendo la promesa de `create_debt`, `settle_debt` y `reopen_debt` y avanzando el reloj 5.000 ms. |
| **H-DEU-02** | **US-36 · CA-13**, **US-39 · CA-5 (fallo de red)** y **US-40 · CA-6 (fallo de red)** | Provocar un fallo de red determinista justo al enviar `create_debt`, `settle_debt` o `reopen_debt` después de haber cargado la pantalla requiere interceptar o bloquear selectivamente el endpoint RPC en DevTools o Playwright (`docs/07-plan-de-testing.md` §10). | Se cubren en pruebas E2E automatizadas con Playwright (`page.route` abortando o devolviendo HTTP `500` en `/rest/v1/rpc/create_debt`, `settle_debt` y `reopen_debt`). |
| **H-DEU-03** | **US-36 · CA-15** y **US-41 · CA-8** (suite pgTAP `npm run test:db` y triggers internos `check_debt_rule` / `prevent_hard_delete` como propietario de tabla) | `US-36 · CA-15` exige la ejecución automatizada de `npm run test:db` (pgTAP), y `US-41 · CA-8` prueba el trigger `check_debt_rule` insertando directamente en `public.debts` como propietario de la tabla (por REST con `authenticated` o `anon` actúa antes el `REVOKE INSERT/UPDATE/DELETE`, ya cubierto en `CP-DEU-093`, `CP-DEU-116` y `CP-DEU-116B`). | Se cubren en la suite automatizada pgTAP (`supabase/tests/`). |
| **H-DEU-04** | **US-38 · CA-8** y **US-83 · CA-13** (estados `debts-error` con `"Reintentar"` y `dashboard-error` cuando falla la lectura de deudas) | Forzar que falle la lectura `GET /rest/v1/debts` con la sesión ya iniciada (y luego restablecerla para tocar `"Reintentar"`) requiere interceptación de red o corte del servicio PostgREST entre pasos. | Se cubren en pruebas E2E con Playwright interceptando `GET /rest/v1/debts`. |
| **H-DEU-05** | **US-82 · CA-21** (movimiento pendiente con varias personas y `"Reintentar"` cuando `US-70` está implementada) | El criterio es condicional a la implementación de `US-70` (*"Si US-70 ya está implementada…"*) y requiere simular caída de red al enviar `create_transaction`. | Se cubre junto con `US-70` en pruebas E2E con interceptación de red. |
| **H-DEU-06** | **US-83 · CA-12** (prueba de dominio con `hoy = 15/11/2026` y `settled_at = 2026-10-31T22:30:00-03:00` / `2026-11-01T01:30:00Z`) | El criterio especifica explícitamente *"En la prueba de dominio del cálculo, con hoy = 15/11/2026…"* y `settle_debt` asigna `settled_at = now()` en el servidor sin aceptar fecha por parámetro (ADR-037 §3). | Se cubre con prueba unitaria de Vitest sobre la función pura en `src/domain/`. |

---

## (d) Ambigüedades para el PO

| ID | Historia / Referencia | Descripción de la ambigüedad | Impacto en los casos |
|---|---|---|---|
| **AMB-DEU-01** | **US-35 · CA-2** vs. **US-43 (categorías iniciales)** | `US-35 · CA-2` exige el texto literal `"Gasto compartido: Tecnología, $120.000,00 del 15/08/2026"`, pero `"Tecnología"` no forma parte de las 9 categorías iniciales creadas por `PR-01` (`src/lib/seed.ts`). | En `CP-DEU-003` y `CP-DEU-040` se crea previamente la categoría personalizada `"Tecnología"` mediante `PR-04` para verificar el texto literal del criterio sin alterar el catálogo semilla. |
| **AMB-DEU-02** | **US-34 · CA-12** vs. **US-36 · CA-4** | Al cambiar la moneda del gasto en Registrar (`US-34 · CA-12`), el campo `"¿Cuánto te debe?"` se vacía y conserva la persona. En cambio, en Nueva deuda (`US-36 · CA-4`), al cambiar entre `ARS` y `US$` la historia especifica que se muestra/oculta el bloque de tipo de cambio, sin indicar si el campo `"Monto"` (`debt-form-amount`) debe conservarse o vaciarse. | En `CP-DEU-050` se verifica que Nueva deuda muestre/oculte el bloque de tipo de cambio sin exigir el vaciado de `"Monto"`, salvo que el PO decida unificar el comportamiento con `US-34 · CA-12`. |

