# Entrega 3 · Historias de usuario de V3

**Testing de Aplicaciones · Proyecto Integrador · Proyecto Biyu.** Este documento junta en un solo lugar los requerimientos funcionales de la tercera versión de la aplicación (V3): qué funcionalidad nueva trae, qué se refinó de lo que ya existía y con qué criterios de aceptación se prueba cada historia.

La fuente de cada historia es su issue de GitHub (milestone V3). Las historias que se escribieron en la Entrega 2 y pasaron a V3 (US-80 a US-84) tienen su especificación completa en `entrega-2/historias/`; acá va el resumen y el enlace. Los criterios `CA-k` son los que citan los casos de prueba de [`casos/`](casos/): cuando una historia se adaptó a lo implementado, valen los criterios de la versión adaptada. Los casos están en [`01-especificacion-casos-v3.md`](01-especificacion-casos-v3.md) y su resultado, en [`04-ejecucion.md`](04-ejecucion.md) y [`08-ejecucion-manual.md`](08-ejecucion-manual.md).

## 1. Qué trae V3

V1 dejó el núcleo (registrar gastos e ingresos en pesos y dólares, cuotas, categorías, cuentas y un Resumen mensual). V2 lo volvió usable (deudas, suscripciones, exportar e importar). V3 completa lo que faltaba para corregir errores de carga y pule la interfaz:

| Área | Qué agrega o cambia | Historias | Casos |
|---|---|---|---|
| CRUD completo | Editar un movimiento y una deuda; eliminar definitivamente un movimiento, una suscripción y una categoría; eliminar una deuda; reactivar una cuenta archivada | US-84 a US-90 | 62 |
| Deudas | Compartir un gasto con varias personas, ver las deudas agrupadas por persona y sugerir personas ya cargadas | US-82, US-91, US-100 | 23 |
| Importar Excel | Importar una compra en cuotas ya empezada y una guía para armar el archivo | US-80, US-81 | 17 |
| Resumen | Las deudas sueltas en el gasto neto, elegir qué entra en el número del Resumen, suscripciones por cobrar, dona y tendencias | US-83, US-101, ADR-045, US-103 | 27 |
| Interfaz (UX) | Barra inferior flotante, Ajustes en tarjetas, confirmación de borrado con detalle, mismos textos en Suscripciones, controles de 44 px, esqueletos y transiciones, categorías legibles, separador de miles, rebranding con tema claro y oscuro, gráficos de Suscripciones, categorías con ícono | US-92 a US-99, US-102, US-104, US-105 | 49 |
| Ajustes a historias anteriores | La franja de la puesta al día se puede cerrar (US-53 · CA-4) y la configuración inicial al crear la cuenta (US-68) | US-53, US-68 | 6 |
| **Total** | | **28 historias y ADR-045** | **184** |

Además, V3 corrige los defectos de V2 (DEF-030 a DEF-037). No tienen historia: se confirman con el caso de V2 que los detectó, que está en la regresión ([`03-seleccion-regresion.md`](03-seleccion-regresion.md)).

## 2. Decisiones que cambian lo que se prueba

| Decisión | Qué dice | A qué historias afecta |
|---|---|---|
| [ADR-044](../docs/adr/044-borrado-definitivo.md) · Borrado definitivo | Los movimientos se borran en dos pasos: «Eliminar» sigue siendo la baja lógica (C10) y «Eliminar definitivamente» aparece solo en «Eliminados». Un movimiento generado por una suscripción nunca se borra definitivamente (así la puesta al día no lo regenera, I11). Deudas y suscripciones se borran directo, con confirmación; los gastos de una suscripción borrada quedan como movimientos sueltos. Una categoría solo se borra si no tiene uso. Una deuda saldada primero vuelve a pendiente | US-85, US-87, US-88, US-89, US-94 |
| [ADR-043](../docs/adr/043-editar-un-movimiento-con-una-rpc.md) · Editar con una RPC | Editar un movimiento borra y regenera todas sus imputaciones en una sola operación de Postgres (C4, ADR-009). El tipo de cambio sigue congelado (C5) y cambiar un mes cerrado pide confirmación | US-84, US-86 |
| [ADR-053](../docs/adr/053-un-solo-numero-de-gasto-neto-en-el-resumen.md) · Un solo número en el Resumen | El Resumen muestra un solo número, el gasto neto. Ingresos, deudas sueltas, reembolsos y suscripciones por cobrar son opciones que arrancan apagadas. Reescribe los casos de US-83 y define los de US-101 | US-83, US-101, ADR-045 |

## 3. Historias de V3 y su estado

Estado al 2026-11-24: **las 28 historias y las suscripciones por cobrar están implementadas y sus 184 casos, ejecutados** (184 PASSED, de forma automatizada y manual). US-95, US-96, US-99 y US-100 se implementaron en los últimos días de la entrega (PR [#422](https://github.com/Joaconz/Biyu/pull/422) a [#425](https://github.com/Joaconz/Biyu/pull/425)); el aviso «no implementada en V3» al principio de esos issues es anterior a esos PR.

| Historia | Título | Issue | Área | Decisión | Casos |
|---|---|---|---|---|---|
| US-80 | Importar una compra en cuotas ya empezada | [#268](https://github.com/Joaconz/Biyu/issues/268) | Importar | ADR-039 | CP-IMP-042 a 052 (11) |
| US-81 | Guía para armar el archivo de importación | [#269](https://github.com/Joaconz/Biyu/issues/269) | Importar | — | CP-IMP-053 a 058 (6) |
| US-82 | Compartir un gasto con varias personas | [#270](https://github.com/Joaconz/Biyu/issues/270) | Deudas | ADR-040 | CP-DEU-085 a 095 (11) |
| US-83 | Las deudas sueltas mueven el gasto neto del mes | [#271](https://github.com/Joaconz/Biyu/issues/271) | Resumen | ADR-041, ADR-053 | CP-DAS-012 a 020 (9) |
| US-84 | Editar un movimiento ya cargado | [#284](https://github.com/Joaconz/Biyu/issues/284) | CRUD | ADR-043, ADR-009 | CP-REG-017 a 040 (24) |
| US-85 | Eliminar definitivamente un movimiento | [#328](https://github.com/Joaconz/Biyu/issues/328) | CRUD | ADR-044 | CP-REG-041 a 046 (6) |
| US-86 | Editar una deuda ya cargada | [#285](https://github.com/Joaconz/Biyu/issues/285) | CRUD | ADR-037 | CP-DEU-078 a 084 (7) |
| US-87 | Eliminar una deuda | [#329](https://github.com/Joaconz/Biyu/issues/329) | CRUD | ADR-044 | CP-DEU-062 a 068 (7) |
| US-88 | Eliminar definitivamente una suscripción | [#330](https://github.com/Joaconz/Biyu/issues/330) | CRUD | ADR-044 | CP-SUS-049 a 055 (7) |
| US-89 | Eliminar definitivamente una categoría | [#331](https://github.com/Joaconz/Biyu/issues/331) | CRUD | ADR-044 | CP-CFG-016 a 022 (7) |
| US-90 | Reactivar una cuenta archivada | [#332](https://github.com/Joaconz/Biyu/issues/332) | CRUD | — | CP-CFG-023 a 026 (4) |
| US-91 | Ver las deudas agrupadas por persona | [#333](https://github.com/Joaconz/Biyu/issues/333) | Deudas | — | CP-DEU-073 a 077 (5) |
| US-92 | Barra inferior flotante con Registrar al centro | [#353](https://github.com/Joaconz/Biyu/issues/353) | UX | ADR-048 | CP-NAV-026 a 032 (7) |
| US-93 | Ajustes ordenado en tarjetas | [#354](https://github.com/Joaconz/Biyu/issues/354) | UX | ADR-052, ADR-055 | CP-CFG-027 a 030 (4) |
| US-94 | Confirmación de borrado que dice qué se borra | [#355](https://github.com/Joaconz/Biyu/issues/355) | UX | ADR-044 | CP-REG-047 a 049 (3) |
| US-95 | Mismos textos y controles en Suscripciones | [#356](https://github.com/Joaconz/Biyu/issues/356) | UX | — | CP-SUS-160 a 162 (3) |
| US-96 | Botones y controles de al menos 44 px | [#357](https://github.com/Joaconz/Biyu/issues/357) | UX | ADR-052 | CP-NAV-038 a 041 (4) |
| US-97 | Esqueletos de carga y transiciones | [#358](https://github.com/Joaconz/Biyu/issues/358) | UX | ADR-049 | CP-NAV-033 a 037 (5) |
| US-98 | Categorías y cuentas legibles al registrar | [#359](https://github.com/Joaconz/Biyu/issues/359) | UX | ADR-052 | CP-REG-050 a 052 (3) |
| US-99 | Separador de miles al escribir el monto | [#360](https://github.com/Joaconz/Biyu/issues/360) | UX | — | CP-REG-053 a 057 (5) |
| US-100 | Sugerir personas ya cargadas en Nueva deuda | [#361](https://github.com/Joaconz/Biyu/issues/361) | Deudas | — | CP-DEU-096 a 102 (7) |
| US-101 | Qué entra en el número del Resumen | [#371](https://github.com/Joaconz/Biyu/issues/371) | Resumen | ADR-047, ADR-051, ADR-053 | CP-DAS-027 a 032 y CP-CFG-040 a 041 (8) |
| — | Suscripciones por cobrar en el Resumen | PR [#370](https://github.com/Joaconz/Biyu/pull/370) | Resumen | ADR-045 | CP-SUS-062 a 066 (5) |
| US-102 | Rebranding esmeralda con tema claro y oscuro | [#410](https://github.com/Joaconz/Biyu/issues/410) | UX | ADR-052 | CP-CFG-031 a 034 y CP-DAS-021 (5) |
| US-103 | Dona y tendencias en el Resumen | [#411](https://github.com/Joaconz/Biyu/issues/411) | Resumen | ADR-050 | CP-DAS-022 a 026 (5) |
| US-104 | Gráficos de cobros y por categoría en Suscripciones | [#412](https://github.com/Joaconz/Biyu/issues/412) | UX | ADR-053 (gráficos) | CP-SUS-057 a 061 (5) |
| US-105 | Categorías en su pantalla, con ícono y color | [#413](https://github.com/Joaconz/Biyu/issues/413) | UX | ADR-055 | CP-CFG-035 a 039 (5) |
| US-53 | Franja de la puesta al día que se puede cerrar (CA-4) | [#211](https://github.com/Joaconz/Biyu/issues/211) | Ajuste | ADR-017 | CP-SUS-067 a 068 (2) |
| US-68 | Configuración inicial al crear la cuenta | [#159](https://github.com/Joaconz/Biyu/issues/159) | Ajuste | ADR-025 | CP-ACC-013 a 016 (4) |

Las suscripciones por cobrar no tienen número de historia: nacieron de un pedido de producto y se decidieron en ADR-045. Hoy son una de las cuatro opciones de US-101.

Todas las historias comparten la definición de **Hecho** de `docs/07-plan-de-testing.md` §1: implementada, desplegada, con sus casos diseñados y ejecutados, `data-testid` en todo elemento interactivo nuevo, validación en Postgres (C6) y, si toca una tabla, su par de tests pgTAP de autorización (C7).

---

## 4. CRUD completo

### US-84 · Editar un movimiento ya cargado

- **Objetivo:** como usuario que se equivocó al cargar un gasto, quiero corregir el monto, la fecha, la categoría, la cuenta, la nota o las cuotas, sin borrarlo y volver a cargarlo.
- **Especificación completa:** [`entrega-2/historias/editar-movimiento.md`](../entrega-2/historias/editar-movimiento.md) (criterios CA-1 a CA-30). Se escribió en la Entrega 2 y no llegó a implementarse; pasó a V3.
- **Qué cambia:** cada fila activa de Movimientos abre «Editar» con los campos precargados. Tipo, moneda y tipo de cambio se muestran como texto y no se pueden cambiar (C5). Guardar llama a una sola RPC, `update_transaction`, que borra y regenera las imputaciones (C3, C4). Si el cambio toca un mes anterior al de hoy, se abre el aviso de meses cerrados con «Cancelar» y «Guardar igual».
- **Criterios principales:** el resto de una compra en cuotas se reparte con la regla de C3 (CA-4); pasar de 6 cuotas a 3 deja exactamente 3 imputaciones (CA-5); cambiar un mes cerrado pide confirmación y cambiar la nota no (CA-6 a CA-13); un movimiento eliminado, de una suscripción o compartido no se edita (CA-21); las validaciones son las de Registrar y se repiten en la RPC (CA-19); otro usuario y `anon` no pueden editar (CA-27).
- **Casos:** [`us-84`](casos/us-84-editar-movimiento.md), CP-REG-017 a 040.

### US-85 · Eliminar definitivamente un movimiento

- **Objetivo:** como usuario que eliminó un movimiento y está seguro de que no lo quiere más, quiero borrarlo definitivamente, para que no quede en «Eliminados» ni en ningún dato.
- **Qué cambia:** en Movimientos → «Eliminados», cada fila suma «Eliminar definitivamente» al lado de «Restaurar», con una confirmación que dice que no se puede deshacer, cuántas cuotas tiene y si arrastra una deuda. La RPC `purge_transaction` borra el movimiento, sus imputaciones y su deuda vinculada en una sola transacción.
- **Criterios:**
  - CA-1: un movimiento activo no ofrece la acción y la RPC lo rechaza.
  - CA-2: después de borrar, no aparece en «Eliminados», no se puede restaurar y la API no lo devuelve.
  - CA-3: sus imputaciones y su deuda desaparecen; los totales del Resumen no cambian (ya no lo contaban).
  - CA-4: el movimiento de otro usuario responde «no encontrado» y no se borra (C7).
  - CA-5: cancelar la confirmación no borra nada.
  - Por ADR-044: un movimiento generado por una suscripción no ofrece la acción y la RPC lo rechaza.
- **Casos:** [`us-85`](casos/us-85-eliminar-movimiento-definitivo.md), CP-REG-041 a 046.

### US-86 · Editar una deuda ya cargada

- **Objetivo:** como usuario que se equivocó en la persona, el monto, la dirección o la fecha de una deuda, quiero corregirla desde Deudas.
- **Qué cambia:** cada deuda pendiente ofrece «Editar». Una deuda suelta edita persona, monto, nota, fecha y dirección; la de un gasto compartido, persona, monto y nota, con el monto topado por el del gasto (I7). La moneda y el tipo de cambio quedan congelados (C5). Guardar llama a una sola RPC, `update_debt`.
- **Criterios (según sus casos):**
  - CA-1: editar una deuda suelta y volver al listado con los mismos filtros.
  - CA-2: en US$ el tipo de cambio sigue congelado y la moneda es texto.
  - CA-3 y CA-4: la deuda de un gasto edita persona, monto y nota, sin superar el gasto.
  - CA-5: las validaciones de la pantalla se repiten en la RPC.
  - CA-6: una deuda saldada no se edita; vuelta a pendiente, sí.
  - CA-7: si falla guardar, se conserva lo escrito y reintentar guarda.
  - CA-8: otro usuario y `anon` no pueden editarla; la de un gasto eliminado no se edita.
- **Casos:** [`us-86`](casos/us-86-editar-deuda.md), CP-DEU-078 a 084.

### US-87 · Eliminar una deuda

- **Objetivo:** como usuario que cargó una deuda por error, quiero eliminarla, para que no figure en el listado ni en los totales.
- **Qué cambia:** cada deuda suma «Eliminar», con una confirmación que dice qué total cambia. Se borra con la RPC `delete_debt` (ADR-037 no permite borrar directo).
- **Criterios:**
  - CA-1: la deuda desaparece del listado y de los totales; el neto de reembolsos del Resumen se recalcula.
  - CA-2: la deuda de otro usuario responde «no encontrada» y no se borra (C7).
  - CA-3: cancelar la confirmación no borra nada.
  - CA-4: el aviso de guardado confirma la baja y un error de red permite reintentar.
  - Por ADR-044: una deuda saldada no se borra (primero vuelve a pendiente) y la deuda de un gasto compartido se borra sola, dejando el gasto como gasto normal.
- **Casos:** [`us-87`](casos/us-87-eliminar-deuda.md), CP-DEU-062 a 068.

### US-88 · Eliminar definitivamente una suscripción

- **Objetivo:** como usuario que dio de alta una suscripción por error o que ya no la quiere ver, quiero eliminarla, para que no quede ni siquiera como cancelada.
- **Qué cambia:** el detalle de la suscripción suma «Eliminar definitivamente», separado de «Cancelar», con una confirmación que dice cuántos movimientos generó. La RPC `delete_subscription` toma el mismo bloqueo que la puesta al día, así no corren en paralelo.
- **Criterios:**
  - CA-1: la suscripción no aparece en el listado ni en el total comprometido.
  - CA-2: la puesta al día no genera nada más de ella.
  - CA-3: la de otro usuario responde «no encontrada» (HTTP 404, como se decidió para DEF-034).
  - CA-4: cancelar la confirmación no borra nada.
  - Por ADR-044: se puede borrar en cualquier estado, y los gastos que ya generó quedan como movimientos sueltos, con los meses cerrados sin cambios.
- **Casos:** [`us-88`](casos/us-88-eliminar-suscripcion.md), CP-SUS-049 a 055.

### US-89 · Eliminar definitivamente una categoría

- **Objetivo:** como usuario que creó una categoría que no usa, quiero eliminarla, para no verla ni en la lista de archivadas.
- **Qué cambia:** las categorías activas y archivadas ofrecen «Eliminar», con la RPC `delete_category`.
- **Criterios:**
  - CA-1: una categoría sin uso se borra y desaparece de Ajustes, de Registrar y del Resumen.
  - CA-2: una categoría en uso (movimientos, incluso dados de baja, o suscripciones) no se borra; el mensaje dice cuántos usos tiene y sugiere archivarla, sin error 500.
  - CA-3: la categoría de otro usuario no se borra (C7).
  - CA-4: el nombre queda libre para crear otra categoría igual.
- **Casos:** [`us-89`](casos/us-89-borrar-categoria.md), CP-CFG-016 a 022.

### US-90 · Reactivar una cuenta archivada

- **Objetivo:** como usuario que archivó una cuenta por error o que volvió a usarla, quiero reactivarla, para elegirla de nuevo al registrar.
- **Qué cambia:** Ajustes → Cuentas suma una sección «Archivadas» con «Reactivar», igual a la de categorías.
- **Criterios:**
  - CA-1: reactivar la devuelve a la lista activa y a Registrar.
  - CA-2: si ya hay una cuenta activa con el mismo nombre (sin distinguir mayúsculas), no se reactiva y se avisa.
  - CA-3: los movimientos de la cuenta no cambian.
  - CA-4: la cuenta de otro usuario no se reactiva (C7).
- **Casos:** [`us-90`](casos/us-90-reactivar-cuenta.md), CP-CFG-023 a 026.

## 5. Deudas

### US-82 · Compartir un gasto con varias personas

- **Objetivo:** como usuario, quiero repartir un gasto entre varias personas, cada una con lo que me debe, para no cargar una deuda suelta por cada una.
- **Especificación completa:** [`entrega-2/historias/deudas.md`](../entrega-2/historias/deudas.md) (US-82). Decisión: ADR-040, que modifica ADR-036.
- **Qué cambia:** con «Gasto compartido» encendido, Registrar muestra una lista de 1 a 10 personas, cada una con su monto. La suma no puede superar el gasto (I7). «Dividir en partes iguales» reparte en n+1 partes y la del usuario absorbe el resto. Se guarda con una sola llamada a `create_transaction`, que crea el gasto y una deuda por persona.
- **Casos:** [`us-82`](casos/us-82-compartir-varias-personas.md), CP-DEU-085 a 095. Con esta historia pasan también los 4 casos de V2 que estaban BLOCKED (CP-DEU-013, 055, 056 y 057).

### US-91 · Ver las deudas agrupadas por persona

- **Objetivo:** como usuario que tiene varias deudas con la misma persona, quiero verlas juntas, con cuánto me debe o le debo en total, para no sumarlas a mano y para que «Juan» y «juan » no aparezcan como dos personas.
- **Qué cambia:** Deudas agrupa por persona, ignorando mayúsculas, tildes y espacios de más. Una persona con 2 o más deudas aparece como un grupo plegado con la cantidad y el neto por moneda (ARS y US$ por separado, sin convertir); con una sola deuda es una fila normal. Los grupos respetan los filtros de la URL (C11) y se ordenan por la deuda más reciente. No cambia datos.
- **Criterios:**
  - CA-1: «Juan», «juan » y «Juán» quedan en un solo grupo.
  - CA-2: el neto de un grupo con deudas en ARS y US$ muestra las dos monedas.
  - CA-3: con el filtro «Saldadas», un grupo solo cuenta sus saldadas; un grupo sin deudas en el filtro no se muestra.
  - CA-4: el estado vacío y los totales por dirección no cambian.
  - CA-5: cada grupo tiene `data-testid` (`debts-group-<slug>`, `debts-group-toggle`, `debts-group-net`).
- **Casos:** [`us-91`](casos/us-91-deudas-por-persona.md), CP-DEU-073 a 077.

### US-100 · Sugerir personas ya cargadas en Nueva deuda

- **Objetivo:** como usuario, quiero que «Persona» me sugiera a quienes ya cargué, para no crear a la misma persona dos veces.
- **Qué cambia:** al escribir en «Persona» (Nueva deuda) o en «¿Con quién?» (gasto compartido de Registrar) se sugieren las personas de mis deudas que coinciden, con la misma normalización de US-91. Es un combobox accesible que se maneja con el teclado. Sugerir no obliga: se puede escribir un nombre nuevo. Nueva deuda suma «‹ Deudas» en el encabezado.
- **Criterios (según sus casos):**
  - CA-1: sugiere las personas que coinciden, sin distinguir mayúsculas ni tildes, cada una una sola vez.
  - CA-2: elegir una sugerencia completa el campo y guarda en la misma persona.
  - CA-3: sin coincidencias o con el campo vacío no sugiere nada.
  - CA-4: con el teclado, las flechas recorren, Enter elige sin enviar y Escape cierra.
  - CA-5: también sugiere en el gasto compartido de Registrar.
  - CA-6: «‹ Deudas» vuelve a la lista.
- **Casos:** [`us-100`](casos/us-100-sugerir-personas.md), CP-DEU-096 a 102.

## 6. Importar Excel

### US-80 · Importar una compra en cuotas ya empezada

- **Objetivo:** como usuario que empieza a usar Biyu con compras en cuotas a medio pagar, quiero importarlas indicando cuántas cuotas me faltan, para ver en cada mes solo lo que todavía tengo que pagar.
- **Especificación completa:** [`entrega-2/historias/importar-excel.md`](../entrega-2/historias/importar-excel.md) (US-80). Decisión: ADR-039.
- **Qué cambia:** la plantilla suma la columna opcional «Cuotas pendientes» (P). Se guardan solo las últimas P cuotas del calendario de N, numeradas de N−P+1 a N, una por mes desde el mes de hoy. El monto del movimiento es lo que falta pagar; en US$, lo que falta por el tipo de cambio. Postgres revalida la columna (C6).
- **Casos:** [`us-80`](casos/us-80-importar-compra-empezada.md), CP-IMP-042 a 052.

### US-81 · Guía para armar el archivo de importación

- **Objetivo:** como usuario que nunca importó un Excel, quiero abrir una guía corta de cómo armar el archivo, para no adivinar el formato. Quien ya sabe tiene que poder ignorarla.
- **Especificación completa:** [`entrega-2/historias/importar-excel.md`](../entrega-2/historias/importar-excel.md) (US-81).
- **Qué cambia:** en los pasos 1 y 2 de Importar, el botón «¿Cómo armo el archivo?» abre un diálogo con título, texto, seis pasos, una tabla de ejemplo y un pie. Nace cerrado, nunca se abre solo, y abrirlo o cerrarlo no cambia el paso, el archivo, el filtro ni la URL.
- **Casos:** [`us-81`](casos/us-81-guia-importacion.md), CP-IMP-053 a 058.

## 7. Resumen

### US-83 · Las deudas sueltas mueven el gasto neto del mes

- **Objetivo:** como usuario, quiero que lo que presto o me prestan sin un gasto de por medio cambie el número del mes, para que muestre la plata que de verdad salió y entró.
- **Especificación completa:** [`entrega-2/historias/deudas.md`](../entrega-2/historias/deudas.md) (US-83), con la decisión de ADR-041. **Reescrita por ADR-053:** el Resumen ya no tiene una tarjeta de Balance sino un solo número, el gasto neto, y las deudas sueltas son una de sus opciones.
- **Qué cambia:** con la opción de deudas sueltas encendida, cada deuda suelta mueve el gasto neto en el mes en que pasó: el alta en su fecha y el saldado en el día en que se saldó, con el monto en pesos congelado. Reabrir quita el evento del saldado. Las deudas de un gasto compartido no generan eventos. Gastado, Ingresos y el desglose por categoría no cambian.
- **Casos:** [`us-83`](casos/us-83-deudas-sueltas-balance.md), CP-DAS-012 a 020 (criterios CA-1 a CA-14).

### US-101 · Qué entra en el número del Resumen

- **Objetivo:** como usuario, quiero elegir qué entra en el número del Resumen, para que refleje cómo yo cuento mi plata.
- **Decisiones:** ADR-047 y ADR-051, reemplazados en lo que se contradicen por ADR-053, que es el que vale.
- **Qué cambia:** el Resumen muestra un solo número, el gasto neto: lo gastado menos el aporte de cada opción incluida. Las cuatro opciones (ingresos, deudas sueltas, reembolsos y suscripciones por cobrar) arrancan apagadas. Se eligen desde la pill bajo el número y desde Ajustes → Resumen. La elección se guarda por usuario (`user_preferences`) y no reescribe ninguna transacción (C5).
- **Criterios (según sus casos):**
  - CA-1: el predeterminado es «Solo gastos», con las cuatro opciones apagadas.
  - CA-2 y CA-3: cada opción mueve el número al instante, con su signo, y la elección queda guardada.
  - CA-4: «Solo gastos» apaga todas las opciones de un toque.
  - CA-5: el desglose suma exactamente el número y «Fuera del número» muestra lo que moverían las opciones apagadas.
  - CA-6: el ícono de la esquina abre la misma hoja; en la compu es un popover y Escape devuelve el foco.
  - CA-7: el rótulo pasa a «Gastado neto» con alguna opción y un número negativo lleva el signo menos.
  - CA-8: en Ajustes cada interruptor cambia solo el número del Resumen y la elección sobrevive al recargar.
  - CA-9: la preferencia es de cada usuario; otro no la ve ni la modifica (C7).
- **Casos:** [`us-101`](casos/us-101-gasto-neto-a-eleccion.md), CP-DAS-027 a 032 y CP-CFG-040 a 041.

### Suscripciones por cobrar en el Resumen (ADR-045)

- **Objetivo:** ver lo que las suscripciones activas todavía van a cobrar en el mes, aunque todavía no generaron su movimiento (una suscripción genera el gasto recién el día de cobro, R5).
- **Qué cambia:** en un mes sin movimientos es una tarjeta con el total en pesos y cuántos cobros faltan; en un mes con movimientos es una de las opciones del número del Resumen (US-101). No crea ningún movimiento. Las pausadas y canceladas no cuentan, y las de US$ sin tipo de cambio del mes se avisan aparte.
- **Casos:** [`adr-045`](casos/adr-045-suscripciones-por-cobrar.md), CP-SUS-062 a 066.

### US-103 · Dona y tendencias en el Resumen

- **Objetivo:** como usuario, quiero ver cómo vienen mis gastos del mes y los que ya tengo comprometidos, para anticiparme sin hacer la cuenta a mano.
- **Qué cambia:** la torta por categoría pasa a dona, con el total del período en el hueco. Tres tarjetas de tendencia: «Gastado vs ingresos» (6 meses), «Ritmo del mes» (gasto acumulado por día contra el mes anterior) y «Cuotas que vienen» (lo que las compras en cuotas imputan en los 6 meses siguientes). Si la lectura falla, las tarjetas no se dibujan y el resto del Resumen sigue.
- **Criterios:**
  - CA-1: la dona muestra una porción por categoría con monto y porcentaje, sin ingresos ni eliminados, y el total en el hueco.
  - CA-2: «Gastado vs ingresos» muestra 6 meses con dos columnas por mes en una sola escala.
  - CA-3: «Ritmo del mes» termina en el mismo total que la tarjeta de lo gastado.
  - CA-4: «Cuotas que vienen» suma solo imputaciones de gastos no eliminados.
  - CA-5: si falla la lectura de las tendencias, el resto del Resumen sigue visible.
- **Casos:** [`us-103`](casos/us-103-dona-y-tendencias.md), CP-DAS-022 a 026.

## 8. Interfaz (UX)

Las historias de UX salen de la auditoría [#352](https://github.com/Joaconz/Biyu/issues/352). Varias se implementaron de otra forma de la que pedían, así que la historia se adaptó a lo implementado antes de escribir sus casos (lo dice cada issue). US-102 a US-105 son historias nuevas que describen lo que se implementó.

### US-92 · Barra inferior flotante con Registrar al centro

- **Objetivo:** como usuario del celular, quiero una barra inferior con las pantallas que más uso y Registrar al centro, para llegar a cada una con el pulgar y saber siempre dónde estoy.
- **Qué cambia:** en el celular la barra es una píldora flotante con Resumen · Deudas · Registrar · Suscripciones · Ajustes; el engranaje sale del encabezado. Movimientos se abre desde el Resumen. Desde 1024 px es una barra lateral con Ajustes al pie.
- **Criterios:**
  - CA-1: a 390 px la barra muestra los cinco destinos en ese orden y el encabezado no tiene engranaje.
  - CA-2: el indicador queda bajo el ítem activo y una ruta inexistente muestra «Esta página no existe» sin barra.
  - CA-3: en `/transactions` la barra marca Resumen y el Resumen ofrece el acceso a Movimientos.
  - CA-4: a 1024 px hay barra lateral con Ajustes al pie y ningún `data-testid` repetido.
  - CA-5: un toque en el aire alrededor de la píldora no activa nada de atrás.
  - CA-6: tocar «Registrar» estando en Registrar conserva el paso y el borrador.
- **Casos:** [`us-92`](casos/us-92-barra-inferior-flotante.md), CP-NAV-026 a 032.

### US-93 · Ajustes ordenado en tarjetas

- **Objetivo:** como usuario, quiero encontrar rápido categorías, cuentas, tipo de cambio y lo que entra al Resumen, sin recorrer un listado plano.
- **Criterios:**
  - CA-1: Ajustes muestra las tarjetas en orden (Apariencia, Categorías, Cuentas, Tipo de cambio, Resumen, configuración inicial) y «Cerrar sesión» es la última, en su propia tarjeta.
  - CA-2: «Categorías» abre `/settings/categories` y la barra sigue marcando Ajustes.
  - CA-3: todo elemento interactivo de Ajustes tiene un `data-testid` propio y sin repetir (DEF-015).
  - CA-4: «Volver a hacer la configuración inicial» abre `/setup`.
- **Casos:** [`us-93`](casos/us-93-ajustes-en-tarjetas.md), CP-CFG-027 a 030.

### US-94 · Confirmación de borrado que dice qué se borra

- **Objetivo:** como usuario, quiero que la confirmación de eliminar me muestre qué voy a borrar, para no borrar el movimiento equivocado.
- **Qué cambia:** un solo componente de confirmación para los borrados de movimiento, deuda, suscripción y categoría. Usa el vocabulario de la UI («¿Eliminar movimiento?»), muestra el detalle (monto, categoría o persona, fecha, cuotas o deuda vinculada) y el botón de confirmar tiene estilo de peligro, separado de «Cancelar».
- **Criterios (según sus casos):**
  - CA-1: el diálogo de un movimiento dice «¿Eliminar movimiento?».
  - CA-2: muestra el detalle, con las cuotas y la deuda vinculada si las tiene.
  - CA-3: el botón de confirmar tiene estilo de peligro y está separado de «Cancelar».
  - CA-4: «Cancelar» no borra, en los cuatro diálogos.
- **Casos:** [`us-94`](casos/us-94-confirmacion-de-borrado.md), CP-REG-047 a 049.

### US-95 · Mismos textos y controles en Suscripciones

- **Objetivo:** como usuario, quiero que Suscripciones se use igual que Registrar y Deudas, para no aprender dos formas de cargar lo mismo.
- **Criterios (según sus casos):** la moneda se muestra como «US$»; «Medio de pago» pasa a llamarse «Cuenta»; categoría y cuenta se eligen con chips, como en Registrar, en el alta y en la edición; la lista ofrece «Nueva suscripción» con el mismo estilo de alta que Deudas.
- **Casos:** [`us-95`](casos/us-95-mismos-textos-y-controles-en-suscripciones.md), CP-SUS-160 a 162.

### US-96 · Botones y controles de al menos 44 px

- **Objetivo:** como usuario del celular, quiero tocar los botones sin errarle, para no abrir lo que no quería.
- **Criterios (según sus casos):**
  - CA-1: a 390 px todo control tocable mide al menos 44 px de alto («Ver todos», «Activos» y «Eliminados», los filtros y acciones de Deudas).
  - CA-2: en Ajustes, el selector de tema y los interruptores también.
  - CA-3: hay al menos 8 px entre controles vecinos y no aparece scroll horizontal.
- **Casos:** [`us-96`](casos/us-96-controles-44px.md), CP-NAV-038 a 041.

### US-97 · Esqueletos de carga y transiciones

- **Objetivo:** como usuario, quiero ver la forma de la pantalla mientras carga y que el paso de una pantalla a otra se note, para que nada salte de golpe.
- **Criterios:**
  - CA-1: el Resumen, Movimientos, Deudas y Suscripciones muestran un esqueleto y después el contenido.
  - CA-2: cambiar de mes o de filtro no dispara transición.
  - CA-3: con movimiento reducido no hay desplazamiento, solo fundido.
  - CA-4: el «atrás» del navegador no usa la dirección de la navegación anterior.
- **Casos:** [`us-97`](casos/us-97-esqueletos-y-transiciones.md), CP-NAV-033 a 037.

### US-98 · Categorías y cuentas legibles al registrar

- **Objetivo:** como usuario, quiero leer el nombre completo de cada categoría al registrar, para elegir sin adivinar.
- **Criterios:**
  - CA-1: en el paso 2 de Registrar a 390 px las ocho categorías sembradas se leen completas, sin cortar palabras.
  - CA-2: un nombre largo ocupa dos líneas como máximo.
  - CA-3: los chips de cuenta miden al menos 48 px de alto.
- **Casos:** [`us-98`](casos/us-98-categorias-y-cuentas-legibles.md), CP-REG-050 a 052.

### US-99 · Separador de miles al escribir el monto

- **Objetivo:** como usuario, quiero ver el monto con separador de miles mientras lo escribo, para no equivocarme de cifra.
- **Criterios (según sus casos):** el monto se muestra con formato es-AR mientras se escribe («12.500», «12.500,5»); pegar un valor con punto decimal, una coma sola o letras da un resultado razonable; editar en el medio no manda el cursor al final; el valor guardado no cambia (12.500,5 se guarda como 12500.50, C2); Nueva deuda y Nueva suscripción usan el mismo formato.
- **Casos:** [`us-99`](casos/us-99-separador-de-miles.md), CP-REG-053 a 057.

### US-102 · Rebranding esmeralda con tema claro y oscuro

- **Objetivo:** como usuario, quiero que la app tenga una identidad visual propia y pueda verse en claro u oscuro, para usarla cómoda de día y de noche.
- **Criterios:**
  - CA-1: elegir «Oscuro» cambia el tema al instante y queda al recargar; «Automático» sigue al sistema.
  - CA-2: la elección se guarda en el dispositivo, no en la base.
  - CA-3: en los dos temas el texto cumple contraste.
  - CA-4: un monto con centavos se lee igual con lector de pantalla y en los tests (`$436.850,50`).
- **Casos:** [`us-102`](casos/us-102-rebranding-y-tema.md), CP-CFG-031 a 034 y CP-DAS-021.

### US-104 · Gráficos de cobros y por categoría en Suscripciones

- **Objetivo:** como usuario, quiero ver cuándo cobran mis suscripciones y en qué categoría se me van, para saber qué falta cobrar este mes.
- **Criterios:**
  - CA-1: «Cobros de {mes}» suma, entre cobrados y faltantes, el total de la tarjeta.
  - CA-2: una suscripción con día de cobro anterior a hoy figura como cobrada y una posterior como falta.
  - CA-3: «Por categoría» ordena de mayor a menor y los porcentajes son sobre el total en pesos.
  - CA-4: una suscripción en US$ sin tipo de cambio del mes se avisa y no entra a la barra.
  - CA-5: sin suscripciones activas no se dibuja ninguno de los dos gráficos.
- **Casos:** [`us-104`](casos/us-104-graficos-de-suscripciones.md), CP-SUS-057 a 061.

### US-105 · Categorías en su pantalla, con ícono y color

- **Objetivo:** como usuario, quiero administrar mis categorías en su propia pantalla y elegir su ícono y su color, para reconocerlas de un vistazo.
- **Criterios:**
  - CA-1: crear una categoría con nombre, ícono y color la muestra en la lista con esa baldosa.
  - CA-2: editar una sembrada preselecciona su ícono y al guardar queda escrito.
  - CA-3: archivar, reactivar y eliminar siguen funcionando desde la hoja, con la confirmación al eliminar.
  - CA-4: Postgres rechaza una clave de ícono con mayúsculas o de más de 40 caracteres (C6).
  - CA-5: otro usuario no ve ni modifica las categorías ajenas (C7).
- **Casos:** [`us-105`](casos/us-105-categorias-con-icono.md), CP-CFG-035 a 039.

## 9. Ajustes a historias anteriores

### US-53 · La franja de la puesta al día se puede cerrar (CA-4)

- **Qué cambia:** si la puesta al día de suscripciones falla, la franja que lo avisa ahora tiene una X que la cierra mientras dure la sesión del navegador, también al recargar. «Reintentar» vuelve a llamar a la función y, si responde bien, la franja desaparece. Antes de V3 no se podía cerrar.
- **Casos:** [`us-53`](casos/us-53-franja-de-la-puesta-al-dia.md), CP-SUS-067 a 068.

### US-68 · Configuración inicial al crear la cuenta

- **Qué cambia:** una cuenta nueva ve la configuración inicial (motivo, categorías, cuentas y primer gasto), puede saltearla o completarla, y después no vuelve a aparecer. Un error al leer o guardar ese estado nunca bloquea el acceso, y una cuenta anterior a US-68 entra directo. Es una historia de V1; en V3 se le escribieron casos que corren también contra el deploy, para detectar una migración sin aplicar en la base hosteada.
- **Casos:** [`us-68`](casos/us-68-configuracion-inicial.md), CP-ACC-013 a 016.
