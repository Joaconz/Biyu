# Entrega 3 · Selección de los casos de regresión (V1 y V2 sobre V3)

Qué casos de V1 y V2 se vuelven a ejecutar sobre V3 para comprobar que lo que ya funcionaba sigue funcionando. Issue [#339](https://github.com/Joaconz/Biyu/issues/339). Fecha de la selección: 2026-10-30.

**Resultado: 177 de 286 casos** (39 de los 74 de V1 y 138 de los 212 de V2). Los mismos 177 casos se automatizan ([`02-seleccion-automatizacion.md`](02-seleccion-automatizacion.md)), así que la regresión se ejecuta dos veces: a mano y con la suite.

## Criterio

Entra un caso si cumple **alguna** de estas reglas (decisión del equipo, 2026-10-30):

| Regla | Qué incluye | Por qué |
|---|---|---|
| 1 | Todos los casos de prioridad **Alta** de V1 y de V2 | Cubren lo que no puede romperse. Es la misma regla 1 que usó la regresión de V1 en la Entrega 2 (ADR-027). |
| 2 | Los casos de V2 que **fallaron por un defecto** (DEF-030 a DEF-037), aunque no sean Alta | Sirven de testeo de confirmación: V3 corrige esos defectos y el caso tiene que pasar. |

Quedan afuera los casos Media y Baja que no fallaron en V2. Conservan el resultado de su última ejecución. Si aparece un defecto en un área excluida, se amplía la selección y se anota en «Cambios a la selección».

Respecto de la Entrega 2 se dejan de lado sus reglas 2 a 4 (Media de los módulos tocados, defectos de V1 y casos que fallaron en V1): los 22 defectos de V1 se confirmaron sobre V2 y la regresión de V1 dio 60 de 60 PASSED, así que no queda nada de V1 por confirmar.

## Resumen

| Módulo | Versión | Casos | Seleccionados | Qué de V3 lo puede romper |
|---|---|---|---|---|
| Acceso (ACC) | V1 | 12 | 9 | US-92 (barra inferior) y US-96 (tamaño de los controles) cambian la navegación que recorren |
| Configuración (CFG) | V1 | 15 | 6 | US-89 (borrar categoría), US-90 (reactivar cuenta) y US-93 (Ajustes por secciones) |
| Registro (REG) | V1 | 16 | 6 | US-84 (editar un movimiento), US-98 (chips) y US-99 (separador de miles al escribir el monto) |
| Cuotas (CUO) | V1 | 13 | 10 | US-84 regenera las imputaciones al editar (ADR-009) y US-85 las borra |
| Monedas (MON) | V1 | 7 | 5 | US-84 (el tipo de cambio sigue congelado al editar) y US-99 |
| Resumen (DAS) | V1 | 11 | 3 | Todo borrado o edición cambia los totales; US-92 y US-97 cambian la pantalla |
| Deudas (DEU) | V2 | 61 | 47 | US-82, US-83, US-86, US-87, US-91, US-100 y DEF-037 |
| Navegación (NAV) | V2 | 25 | 15 | US-92 (quinto ítem en la barra), US-96 y US-97 |
| Exportar CSV (EXP) | V2 | 31 | 27 | US-85 (lo borrado definitivamente no se exporta) y DEF-030 a DEF-032 |
| Importar Excel (IMP) | V2 | 41 | 15 | US-80, US-81 y DEF-033 |
| Suscripciones (SUS) | V2 | 48 | 31 | US-88 (borrar una suscripción), US-95 (US$, «Cuenta» y chips) y DEF-034 a DEF-036 |
| Resumen por categoría (CAT) | V2 | 6 | 3 | US-85 y US-89 (categorías y movimientos que se borran) |
| **Total** | | **286** | **177** | |

| Prioridad | Seleccionados |
|---|---|
| Alta | 174 |
| Media | 2 |
| Baja | 1 |

- **Por la regla 2 sin ser Alta:** CP-EXP-027, CP-EXP-028, CP-IMP-024.
- **Estado en V2 de los seleccionados de V2:** 118 PASSED, 1 DUDA, 4 BLOCKED, 9 FAILED, y 6 sin resultado en V2 (no figuran en `entrega-2/04-ejecucion`).
- Los 4 BLOCKED y el DUDA de V2 (CP-DEU-002, 013, 055, 056 y 057) dependen de US-82, que entra en V3: se ejecutan cuando esté implementada.

## Antes de ejecutar

- Cada caso se revisa contra V3. Si una historia de V3 cambió un paso o un texto (por ejemplo, «USD» pasa a «US$» con US-95, la barra inferior suma Movimientos con US-92, la confirmación de borrado cambia con US-94), se corrige el caso y se anota el cambio en «Cambios a la selección». El resultado esperado no se relaja para que pase.
- Los IDs son los vigentes (V2 renumerado el 2026-10-27, ver `entrega-2/equivalencia-ids.md`).
- Cada caso usa su propio usuario de prueba (PR-01 de `docs/12-procedimientos-de-prueba.md`).

## Casos seleccionados

| ID | Versión | Prioridad | Título | Último resultado | Reglas |
|---|---|---|---|---|---|
| CP-ACC-001 | V1 | Alta | Sin sesión, la app redirige al login | PASSED (regresión en V2) | 1 |
| CP-ACC-002 | V1 | Alta | Una ruta privada abierta sin sesión conserva el destino | PASSED (regresión en V2) | 1 |
| CP-ACC-003 | V1 | Alta | Crear una cuenta con email y contraseña válidos | PASSED (regresión en V2) | 1 |
| CP-ACC-004 | V1 | Alta | Contraseñas que no cumplen los criterios se rechazan | PASSED (regresión en V2) | 1 |
| CP-ACC-005 | V1 | Alta | No se puede crear una cuenta con un email ya registrado | PASSED (regresión en V2) | 1 |
| CP-ACC-008 | V1 | Alta | Una cuenta nueva tiene el catálogo inicial sembrado | PASSED (regresión en V2) | 1 |
| CP-ACC-009 | V1 | Alta | Cerrar sesión y no poder volver con "atrás" | PASSED (regresión en V2) | 1 |
| CP-ACC-011 | V1 | Alta | Aislamiento entre usuarios en todas las tablas (par de autorización) | PASSED (regresión en V2) | 1 |
| CP-ACC-012 | V1 | Alta | Contraseña y confirmación distintas bloquean el alta | PASSED (regresión en V2) | 1 |
| CP-CFG-001 | V1 | Alta | Crear una categoría con nombre y color | PASSED (regresión en V2) | 1 |
| CP-CFG-004 | V1 | Alta | Archivar una categoría con historia | PASSED (regresión en V2) | 1 |
| CP-CFG-006 | V1 | Alta | Crear una cuenta de tarjeta de crédito | PASSED (regresión en V2) | 1 |
| CP-CFG-008 | V1 | Alta | La siembra concurrente no duplica el catálogo | PASSED (regresión en V2) | 1 |
| CP-CFG-009 | V1 | Alta | Cargar y actualizar el tipo de cambio de referencia del mes | PASSED (regresión en V2) | 1 |
| CP-CFG-011 | V1 | Alta | Después de crear la cuenta aparece la configuración inicial | PASSED (regresión en V2) | 1 |
| CP-REG-001 | V1 | Alta | El registro es la pantalla de inicio | PASSED (regresión en V2) | 1 |
| CP-REG-010 | V1 | Alta | Monto vacío, cero o negativo no se guarda | PASSED (regresión en V2) | 1 |
| CP-REG-012 | V1 | Alta | Eliminar una transacción la saca del total del mes | PASSED (regresión en V2) | 1 |
| CP-REG-013 | V1 | Alta | Eliminar una compra con cuotas en meses cerrados avisa y es retroactivo | PASSED (regresión en V2) | 1 |
| CP-REG-014 | V1 | Alta | Otro usuario no puede leer ni borrar una transacción ajena | PASSED (regresión en V2) | 1 |
| CP-REG-015 | V1 | Alta | No se puede escribir en transactions salteando la RPC | PASSED (regresión en V2) | 1 |
| CP-CUO-001 | V1 | Alta | Compra en 12 cuotas genera 12 imputaciones consecutivas | PASSED (regresión en V2) | 1 |
| CP-CUO-002 | V1 | Alta | Previsualización del impacto mensual antes de guardar | PASSED (regresión en V2) | 1 |
| CP-CUO-003 | V1 | Alta | Cambiar a una cuenta que no es crédito resetea las cuotas | PASSED (regresión en V2) | 1 |
| CP-CUO-004 | V1 | Alta | División exacta: 12 cuotas iguales | PASSED (regresión en V2) | 1 |
| CP-CUO-005 | V1 | Alta | El resto lo absorbe la última cuota | PASSED (regresión en V2) | 1 |
| CP-CUO-006 | V1 | Alta | Cantidad de cuotas: 0, 1, 2, 12 y 13 | PASSED (regresión en V2) | 1 |
| CP-CUO-009 | V1 | Alta | Borrar una compra en cuotas saca todas sus cuotas | PASSED (regresión en V2) | 1 |
| CP-CUO-011 | V1 | Alta | Otro usuario no ve las cuotas de una compra ajena | PASSED (regresión en V2) | 1 |
| CP-CUO-012 | V1 | Alta | Un ingreso no admite cuotas aunque la cuenta sea crédito | PASSED (regresión en V2) | 1 |
| CP-CUO-013 | V1 | Alta | Un fallo a mitad de create_transaction no deja datos parciales | PASSED (regresión en V2) | 1 |
| CP-MON-001 | V1 | Alta | Gasto en USD con el tipo de cambio sugerido | PASSED (regresión en V2) | 1 |
| CP-MON-002 | V1 | Alta | Tabla de decisión de moneda y tipo de cambio (6 filas) | PASSED (regresión en V2) | 1 |
| CP-MON-004 | V1 | Alta | Cambiar la referencia no altera lo ya guardado | PASSED (regresión en V2) | 1 |
| CP-MON-005 | V1 | Alta | El total del mes en pesos incluye lo gastado en dólares | PASSED (regresión en V2) | 1 |
| CP-MON-007 | V1 | Alta | Otro usuario no lee ni modifica el tipo de cambio ajeno | PASSED (regresión en V2) | 1 |
| CP-DAS-001 | V1 | Alta | El Resumen abre en el mes actual con su total | PASSED (regresión en V2) | 1 |
| CP-DAS-002 | V1 | Alta | El mes elegido vive en la URL | PASSED (regresión en V2) | 1 |
| CP-DAS-011 | V1 | Alta | El Resumen de un usuario nunca muestra datos de otro | PASSED (regresión en V2) | 1 |
| CP-DEU-001 | V2 | Alta | El interruptor «Gasto compartido» se enciende y se apaga, y el gasto se guarda sin deuda | PASSED | 1 |
| CP-DEU-002 | V2 | Alta | Gasto compartido de $120.000,00 en 12 cuotas: se guarda el gasto y la deuda vinculada de Sofía | DUDA | 1 |
| CP-DEU-003 | V2 | Alta | Gasto compartido en dólares (US$100 a tipo de cambio 1250): avisa en dólares y congela el tipo de cambio | PASSED | 1 |
| CP-DEU-005 | V2 | Alta | No se puede compartir un gasto si falta cuánto te deben | PASSED | 1 |
| CP-DEU-006 | V2 | Alta | No se puede compartir un gasto si falta con quién | PASSED | 1 |
| CP-DEU-007 | V2 | Alta | Un ingreso no se puede compartir | PASSED | 1 |
| CP-DEU-008 | V2 | Alta | El nombre hecho solo de espacios no cuenta como nombre | PASSED | 1 |
| CP-DEU-010 | V2 | Alta | No se puede deber 0 pesos | PASSED | 1 |
| CP-DEU-011 | V2 | Alta | Una deuda igual al gasto se acepta: «Tu parte» queda en $0,00 | PASSED | 1 |
| CP-DEU-012 | V2 | Alta | Una deuda un centavo mayor que el gasto no se puede guardar | PASSED | 1 |
| CP-DEU-013 | V2 | Alta | Por API, una deuda mayor que el gasto se rechaza y no se guarda nada | BLOCKED | 1 |
| CP-DEU-015 | V2 | Alta | Eliminar el gasto vinculado oculta la deuda de /debts, deja de sumarla en "Te deben" y en el neto del Resumen, y conserva intacta su fila en debts | PASSED | 1 |
| CP-DEU-016 | V2 | Alta | Al restaurar desde Movimientos → Eliminados un gasto cuya deuda vinculada estaba saldada, la deuda vuelve a /debts con estado saldada y la misma fecha settled_at | PASSED | 1 |
| CP-DEU-017 | V2 | Alta | Estado inicial de /debts/new y guardado de una deuda "Me deben" en ARS por $20.000,00 crea una fila pendiente con transaction_id = null en una sola llamada a create_debt | PASSED | 1 |
| CP-DEU-018 | V2 | Alta | Guardar una deuda suelta con dirección "Debo" en ARS crea direction = "i_owe" y en la lista muestra "Le debés" | no ejecutado | 1 |
| CP-DEU-019 | V2 | Alta | En /debts/new, elegir "US$" con TC de referencia de 1250 precompleta "1.250,00", muestra "≈ $50.000,00" para US$40 y guarda fx_rate = 1250.0000 y amount_ars = 50000.00 | PASSED | 1 |
| CP-DEU-022 | V2 | Alta | En /debts/new, un "Monto" igual a 0 muestra "El monto debe ser mayor a cero" | no ejecutado | 1 |
| CP-DEU-024 | V2 | Alta | En /debts/new con US$, Monto = 0,01 y TC = 0,5 se acepta (redondeo half-up a $0,01) y guarda amount_ars = "0.01" | FAILED · DEF-037 | 1, 2 |
| CP-DEU-025 | V2 | Alta | En «Nueva deuda» con US$, un tipo de cambio de 0 muestra «El tipo de cambio debe ser mayor a cero» | FAILED · DEF-037 | 1, 2 |
| CP-DEU-026 | V2 | Alta | En /debts/new, una fecha posterior a hoy (<MAÑANA>) muestra "La fecha no puede ser futura" y deshabilita "Guardar deuda" | PASSED | 1 |
| CP-DEU-027 | V2 | Alta | Directo contra create_debt, p_person = "" se rechaza con "Ingresá el nombre de la persona" | PASSED | 1 |
| CP-DEU-029 | V2 | Alta | Directo contra create_debt, p_amount = 0 se rechaza con "I4: el monto debe ser mayor a cero" | PASSED | 1 |
| CP-DEU-031 | V2 | Alta | Directo contra create_debt, p_currency = "USD" con p_fx_rate = null se rechaza con "I5: fx_rate es obligatorio si y solo si la moneda es USD" | PASSED | 1 |
| CP-DEU-033 | V2 | Alta | Directo contra create_debt, p_incurred_on = "<MAÑANA>" se rechaza con "La fecha no puede ser posterior a hoy" | PASSED | 1 |
| CP-DEU-034 | V2 | Alta | Directo contra create_debt con el rol anon (sin Authorization) responde 42501 (permission denied) | PASSED | 1 |
| CP-DEU-035 | V2 | Alta | Un POST /rest/v1/debts directo con sesión autenticada responde 42501 (permission denied) y no crea filas | PASSED | 1 |
| CP-DEU-036 | V2 | Alta | La tarjeta de totales suma las deudas pendientes en pesos (incluyendo USD al TC congelado), excluye las saldadas y no cambia al cambiar el filtro de estado | no ejecutado | 1 |
| CP-DEU-037 | V2 | Alta | Cuando "Debés" supera a "Te deben", el neto muestra "En contra $5.000,00" | no ejecutado | 1 |
| CP-DEU-038 | V2 | Alta | Cambiar el TC de referencia del mes a 1400 no modifica "Te deben" de una deuda en USD ya creada a TC 1250 (C5) | no ejecutado | 1 |
| CP-DEU-039 | V2 | Alta | /debts sin parámetros muestra "Pendientes" seleccionado y solo pendientes; tocar "Saldadas" y "Todas" actualiza ?status= y filtra la lista | no ejecutado | 1 |
| CP-DEU-043 | V2 | Alta | Otro usuario no ve las deudas de alguien más | PASSED | 1 |
| CP-DEU-044 | V2 | Alta | Por API, otro usuario no recibe las deudas de alguien más | PASSED | 1 |
| CP-DEU-045 | V2 | Alta | Por API, sin sesión no se pueden leer las deudas | PASSED | 1 |
| CP-DEU-046 | V2 | Alta | Marcar una deuda como saldada desde «Pendientes» | PASSED | 1 |
| CP-DEU-047 | V2 | Alta | «Deshacer» devuelve la deuda a pendiente | PASSED | 1 |
| CP-DEU-049 | V2 | Alta | Por API, saldar una deuda ya saldada se rechaza | PASSED | 1 |
| CP-DEU-050 | V2 | Alta | Por API, un usuario no puede saldar la deuda de otro | PASSED | 1 |
| CP-DEU-051 | V2 | Alta | Por API, no se puede modificar una deuda directamente | PASSED | 1 |
| CP-DEU-052 | V2 | Alta | «Volver a pendiente» desde «Saldadas» | PASSED | 1 |
| CP-DEU-054 | V2 | Alta | Filtro por dirección: «Todas», «Te deben» y «Debés» | PASSED | 1 |
| CP-DEU-055 | V2 | Alta | Gasto compartido con varias personas: agregar, quitar y guardar | BLOCKED | 1 |
| CP-DEU-056 | V2 | Alta | Se puede compartir con hasta 10 personas | BLOCKED | 1 |
| CP-DEU-057 | V2 | Alta | Por API, deudas que suman más que el gasto se rechazan | BLOCKED | 1 |
| CP-DEU-058 | V2 | Alta | Resumen: gasto bruto y neto de reembolsos | PASSED | 1 |
| CP-DEU-059 | V2 | Alta | Resumen: el neto no cambia al saldar la deuda | PASSED | 1 |
| CP-DEU-060 | V2 | Alta | Resumen: una deuda suelta «Me deben» no cambia el neto | PASSED | 1 |
| CP-DEU-061 | V2 | Alta | Resumen: el neto en dólares no cambia si cambia el tipo de cambio | PASSED | 1 |
| CP-NAV-010 | V2 | Alta | Tocar «Registrar» estando en Registrar no pierde lo cargado | PASSED | 1 |
| CP-NAV-012 | V2 | Alta | Sin internet el gasto no se pierde y aparece «Reintentar» | PASSED | 1 |
| CP-NAV-013 | V2 | Alta | Reintentar al volver internet guarda una sola vez | PASSED | 1 |
| CP-NAV-014 | V2 | Alta | Con internet muy lenta, a los 15 segundos avisa que falló | PASSED | 1 |
| CP-NAV-015 | V2 | Alta | Reintentar no duplica un gasto que ya se había guardado | PASSED | 1 |
| CP-NAV-016 | V2 | Alta | La misma clave dos veces seguidas devuelve el mismo gasto | PASSED | 1 |
| CP-NAV-017 | V2 | Alta | Dos pedidos simultáneos con la misma clave crean un solo gasto | PASSED | 1 |
| CP-NAV-018 | V2 | Alta | La misma clave en dos usuarios distintos no se pisa | PASSED | 1 |
| CP-NAV-019 | V2 | Alta | Si se archiva la categoría antes de guardar, el gasto se rechaza con aviso | PASSED | 1 |
| CP-NAV-020 | V2 | Alta | La API rechaza un gasto con una categoría archivada | PASSED | 1 |
| CP-NAV-021 | V2 | Alta | Al volver a Registrar aparece el gasto pendiente | PASSED | 1 |
| CP-NAV-022 | V2 | Alta | Recuperar un gasto que en realidad ya estaba guardado | PASSED | 1 |
| CP-NAV-023 | V2 | Alta | Descartar borra el pendiente, incluso al recargar | PASSED | 1 |
| CP-NAV-024 | V2 | Alta | Cerrar sesión borra los pendientes | PASSED | 1 |
| CP-NAV-025 | V2 | Alta | Tocar dos veces «Guardar» guarda una sola vez | PASSED | 1 |
| CP-EXP-002 | V2 | Alta | El mes siguiente está bloqueado | PASSED | 1 |
| CP-EXP-003 | V2 | Alta | El alcance mensual propone el nombre 2026-09 | PASSED | 1 |
| CP-EXP-004 | V2 | Alta | El primer día del mes se incluye | PASSED | 1 |
| CP-EXP-005 | V2 | Alta | El día posterior al mes se excluye | PASSED | 1 |
| CP-EXP-006 | V2 | Alta | El 1 de enero se incluye en el año | PASSED | 1 |
| CP-EXP-007 | V2 | Alta | El día posterior al año se excluye | PASSED | 1 |
| CP-EXP-008 | V2 | Alta | Una transacción eliminada queda fuera | PASSED | 1 |
| CP-EXP-009 | V2 | Alta | El archivo comienza con BOM UTF-8 | PASSED | 1 |
| CP-EXP-010 | V2 | Alta | El encabezado tiene doce columnas exactas | PASSED | 1 |
| CP-EXP-011 | V2 | Alta | Doce cuotas salen en una sola fila por el total | PASSED | 1 |
| CP-EXP-012 | V2 | Alta | ARS se escribe con dos decimales exactos | PASSED | 1 |
| CP-EXP-013 | V2 | Alta | USD conserva cuatro decimales de TC | PASSED | 1 |
| CP-EXP-014 | V2 | Alta | Una coma obliga a entrecomillar la descripción | PASSED | 1 |
| CP-EXP-015 | V2 | Alta | Las comillas internas se duplican | PASSED | 1 |
| CP-EXP-016 | V2 | Alta | Descripción con igual se neutraliza | PASSED | 1 |
| CP-EXP-017 | V2 | Alta | Una categoría que empieza con igual se neutraliza | PASSED | 1 |
| CP-EXP-018 | V2 | Alta | 1.500 transacciones se exportan sin faltantes | PASSED | 1 |
| CP-EXP-019 | V2 | Alta | El CSV de A no contiene movimientos de B | PASSED | 1 |
| CP-EXP-020 | V2 | Alta | La API con token de A devuelve cero filas de B | PASSED | 1 |
| CP-EXP-023 | V2 | Alta | Un doble click inicia una sola descarga | PASSED | 1 |
| CP-EXP-025 | V2 | Alta | Offline muestra el error exacto | PASSED | 1 |
| CP-EXP-026 | V2 | Alta | El reintento después de Offline descarga completo | PASSED | 1 |
| CP-EXP-027 | V2 | Baja | Tocar fuera cierra sin descargar | FAILED · DEF-030 | 2 |
| CP-EXP-028 | V2 | Media | Atrás cierra la hoja inicial | FAILED · DEF-031 | 2 |
| CP-EXP-029 | V2 | Alta | Atrás durante Exportando cancela la descarga | FAILED · DEF-032 | 1, 2 |
| CP-EXP-030 | V2 | Alta | Una alta concurrente impide descargar un año incompleto | PASSED | 1 |
| CP-EXP-031 | V2 | Alta | HTTP 500 muestra Error y no descarga | PASSED | 1 |
| CP-IMP-014 | V2 | Alta | F8: monto cero | PASSED | 1 |
| CP-IMP-024 | V2 | Media | Nombres, tipo y moneda aceptan espacios y mayúsculas | FAILED · DEF-033 | 2 |
| CP-IMP-027 | V2 | Alta | El resumen del archivo de ejemplo suma solo las siete filas listas | PASSED | 1 |
| CP-IMP-030 | V2 | Alta | Confirmar importa solo las filas listas con todos sus campos | PASSED | 1 |
| CP-IMP-031 | V2 | Alta | La compra de 240.000 en seis cuotas crea seis imputaciones exactas | PASSED | 1 |
| CP-IMP-032 | V2 | Alta | Un rechazo tardío de categoría no impide las otras filas | PASSED | 1 |
| CP-IMP-033 | V2 | Alta | Quinientas filas de doce cuotas terminan en menos de diez segundos | PASSED | 1 |
| CP-IMP-034 | V2 | Alta | La RPC procesa una válida y rechaza tres inválidas | PASSED | 1 |
| CP-IMP-035 | V2 | Alta | La RPC rechaza un lote de 501 elementos | PASSED | 1 |
| CP-IMP-036 | V2 | Alta | El rol anon no puede ejecutar import_transactions | PASSED | 1 |
| CP-IMP-037 | V2 | Alta | Otro usuario no ve transacciones ni imports ajenos | PASSED | 1 |
| CP-IMP-038 | V2 | Alta | Reintento tras respuesta perdida reconoce lo guardado | PASSED | 1 |
| CP-IMP-039 | V2 | Alta | Dos llamadas API con el mismo import_id son idempotentes | PASSED | 1 |
| CP-IMP-040 | V2 | Alta | Sin respuesta conserva Revisión | PASSED | 1 |
| CP-IMP-041 | V2 | Alta | Sesión vencida ofrece volver a entrar | PASSED | 1 |
| CP-SUS-001 | V2 | Alta | Dar de alta una suscripción en ARS desde hace 2 meses con día de cobro 10 genera los 2 gastos vencidos al guardar | PASSED | 1 |
| CP-SUS-006 | V2 | Alta | Rechazar en UI el alta de suscripción con Nombre igual al de otra activa sin distinguir mayúsculas ni espacios (`" netflix "`) | PASSED | 1 |
| CP-SUS-007 | V2 | Alta | Rechazar en API `create_subscription` con Nombre igual al de otra activa (`" netflix "`) | PASSED | 1 |
| CP-SUS-008 | V2 | Alta | Rechazar en UI el alta de suscripción con Monto igual a `"0"` | PASSED | 1 |
| CP-SUS-009 | V2 | Alta | Rechazar en API `create_subscription` con `p_amount = "0.00"` | PASSED | 1 |
| CP-SUS-017 | V2 | Alta | Rechazar en API `create_subscription` usando `p_category_id` de otro usuario | PASSED | 1 |
| CP-SUS-018 | V2 | Alta | Rechazar en API un `INSERT` directo sobre `/rest/v1/subscriptions` con la sesión del usuario | PASSED | 1 |
| CP-SUS-020 | V2 | Alta | Rechazar en UI ver el detalle de una suscripción de otro usuario mostrando `subscription-detail-not-found` | PASSED | 1 |
| CP-SUS-021 | V2 | Alta | Rechazar en API leer una suscripción de otro usuario (`GET /rest/v1/subscriptions` devuelve `[]`) | PASSED | 1 |
| CP-SUS-022 | V2 | Alta | Rechazar en API `create_subscription` sin sesión autenticada (rol `anon`) | FAILED · DEF-035 | 1, 2 |
| CP-SUS-024 | V2 | Alta | Puesta al día automática al entrar a la app genera 2 períodos vencidos pendientes y muestra el aviso `app-catchup-generated` | PASSED | 1 |
| CP-SUS-025 | V2 | Alta | Dos llamadas consecutivas por API a `run_subscription_catchup` responden `200 OK` sin error y dejan exactamente 1 transacción por período | PASSED | 1 |
| CP-SUS-026 | V2 | Alta | Suscripción en estado `paused` no genera ocurrencias al ejecutar `run_subscription_catchup` | PASSED | 1 |
| CP-SUS-027 | V2 | Alta | Suscripción con día de cobro `31` entre `2026-01` y `2026-04` genera ocurrencias con fechas `31/01/2026`, `28/02/2026`, `31/03/2026` y `30/04/2026` | PASSED | 1 |
| CP-SUS-028 | V2 | Alta | Suscripción con día de cobro `<DIA_MAÑANA>` no genera la ocurrencia del mes corriente | PASSED | 1 |
| CP-SUS-029 | V2 | Alta | Suscripción con día de cobro igual a `<DIA_HOY>` genera la ocurrencia del mes corriente | PASSED | 1 |
| CP-SUS-030 | V2 | Alta | Pausar suscripción activa con día de cobro `28` (`> <DIA_HOY>`) muestra advertencia de este mes y pasa a `"Pausada desde <HOY>"` con piso en `<MES_SIGUIENTE>` | PASSED | 1 |
| CP-SUS-031 | V2 | Alta | `pause_subscription` por API ejecuta primero la puesta al día y genera los meses vencidos pendientes antes de pausar | PASSED | 1 |
| CP-SUS-032 | V2 | Alta | Rechazar en API `pause_subscription` usando la sesión de otro usuario (`404 P0002`) | FAILED · DEF-034 | 1, 2 |
| CP-SUS-033 | V2 | Alta | Reanudar suscripción pausada abre `resume-subscription-dialog`, pasa a `"Activa"`, limpia `paused_at`, conserva `generate_from_period = '<MES_SIGUIENTE>-01'` y no genera el mes actual | PASSED | 1 |
| CP-SUS-034 | V2 | Alta | Cancelar suscripción activa con 4 gastos cargados mantiene el historial en el Detalle y en el Resumen y oculta los botones de acción | PASSED | 1 |
| CP-SUS-035 | V2 | Alta | Editar el monto de una suscripción activa de `$5.000,00` a `$7.000,00` conserva las 4 ocurrencias ya generadas en `$5.000,00` y muestra Moneda y Mes de inicio como solo lectura | PASSED | 1 |
| CP-SUS-037 | V2 | Alta | Rechazar en UI renombrar una suscripción poniéndole el nombre de otra suscripción activa del mismo usuario | PASSED | 1 |
| CP-SUS-040 | V2 | Alta | Eliminar desde Movimientos la ocurrencia de `<MES_ANTERIOR>` muestra `delete-transaction-subscription-note`, figura con `"Eliminado"` en el Detalle y no vuelve a crearse al recargar | PASSED | 1 |
| CP-SUS-041 | V2 | Alta | Mostrar la marca de suscripción en Movimientos y en `"Últimos movimientos"` del Resumen (y no en un gasto manual) y navegar al Detalle al tocarla | PASSED | 1 |
| CP-SUS-042 | V2 | Alta | La ocurrencia generada de una suscripción suma en `"Gastado en <mes corto>"` y resta en `"Balance"` del Resumen de V1 | PASSED | 1 |
| CP-SUS-043 | V2 | Alta | Suscripción activa en USD con tipo de cambio en `<MES_HACE_2>` y sin tipo de cambio en `<MES_ANTERIOR>` genera solo `<MES_HACE_2>`, muestra `"Falta tipo de cambio"` y el botón `"Cargar tipo de cambio"` navega a `/settings?period=<MES_ANTERIOR>` | PASSED | 1 |
| CP-SUS-044 | V2 | Alta | Con dos suscripciones activas en ARS (`$5.000,00` y `$2.500,00`), el total mensual comprometido muestra `"$7.500,00"` y `"2 suscripciones activas este mes"` | PASSED | 1 |
| CP-SUS-045 | V2 | Alta | Suscripción activa en `USD 10,00` con tipo de cambio del período corriente `1.250,00` suma `"$12.500,00"` al total mensual comprometido | PASSED | 1 |
| CP-SUS-047 | V2 | Alta | Vista previa en `/subscriptions/new` con `$5.000,00` ARS, día `28` (`> <DIA_HOY>`), desde `<MES_HACE_2>` y sin fin muestra 2 meses en `"Se cargan al guardar"`, 3 en `"Próximos cobros"`, resumen de `"$10.000,00"` y al guardar crea exactamente esas 2 transacciones | PASSED | 1 |
| CP-SUS-048 | V2 | Alta | Vista previa en `/subscriptions/new` en USD con tipo de cambio en `<MES_HACE_2>` y sin tipo de cambio en `<MES_ANTERIOR>` marca `<MES_ANTERIOR>` con `data-blocked="true"` y no lo cuenta en el resumen | FAILED · DEF-036 | 1, 2 |
| CP-CAT-001 | V2 | Alta | La torta muestra una porción por categoría, con su monto y su porcentaje | PASSED | 1 |
| CP-CAT-002 | V2 | Alta | Los ingresos y los gastos eliminados no entran en la torta | PASSED | 1 |
| CP-CAT-004 | V2 | Alta | Tocar una categoría del Resumen abre su detalle del mes | PASSED | 1 |

## Cambios a la selección

Ninguno todavía.

## Casos ajustados a V3

Pasos o resultados esperados que cambian porque V3 cambió la aplicación. El resultado esperado se ajusta al comportamiento nuevo; no se relaja.

| Caso | Qué cambió | Por |
|---|---|---|
| CP-REG-012, CP-REG-013, CP-CUO-009, CP-DEU-015 | El diálogo dice «¿Eliminar movimiento?» y el aviso «Movimiento eliminado» (antes, «transacción») | US-94 (#355) |
