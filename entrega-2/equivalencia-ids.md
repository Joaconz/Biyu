# Entrega 2 · Equivalencia de IDs de casos de prueba (V2)

El 2026-10-27 el catálogo de V2 se recortó de 672 a 206 casos y después se **renumeró**: cada módulo quedó con IDs consecutivos desde 001. Esta tabla relaciona el **ID anterior** (el que figura en mensajes, issues, capturas o versiones viejas de los reportes) con el **ID nuevo** (el vigente en `casos/`, `02`, `04`, `05`, `06` y los `.xlsx`).

- Los casos que se quitaron en el recorte **no tienen ID nuevo** y no figuran acá.
- Los registros históricos de `ejecucion/` conservan los IDs anteriores.
- Los usuarios de prueba siguen la regla `qa+cp-<módulo>-<nnn>-001@example.com` con el ID **nuevo**; las ejecuciones ya hechas usaron el email con el ID anterior.
- Los identificadores de pedido de los casos de Navegación (por ejemplo `41000000-0000-4000-8000-000000000041`) son datos de prueba y **no** se renumeraron.

## NAV · Navegación e interfaz (25 casos)

| ID anterior | ID nuevo | Título |
|---|---|---|
| CP-NAV-001 | CP-NAV-001 | A 375 px la barra muestra cuatro secciones en el orden definido |
| CP-NAV-004 | CP-NAV-002 | Deudas abre /debts desde Registrar |
| CP-NAV-007 | CP-NAV-003 | Resumen queda activo en /dashboard |
| CP-NAV-012 | CP-NAV-004 | Ajustes no marca ninguna de las cuatro secciones |
| CP-NAV-015 | CP-NAV-005 | A 1023 px se usa barra inferior y engranaje |
| CP-NAV-016 | CP-NAV-006 | A 1024 px se usa barra lateral con Ajustes al pie |
| CP-NAV-018 | CP-NAV-007 | Los testids de Registrar son únicos a 375 px |
| CP-NAV-022 | CP-NAV-008 | Ver todos y ‹ Resumen conservan agosto de 2026 |
| CP-NAV-024 | CP-NAV-009 | Deudas descarta el período del Resumen |
| CP-NAV-027 | CP-NAV-010 | Tocar Registrar en Registrar conserva el paso 3 y el borrador |
| CP-NAV-030 | CP-NAV-011 | Guardar $12.500 muestra la confirmación completa |
| CP-NAV-032 | CP-NAV-012 | Un fallo offline conserva todos los datos y ofrece Reintentar |
| CP-NAV-034 | CP-NAV-013 | Reintentar al volver Online guarda una sola transacción |
| CP-NAV-038 | CP-NAV-014 | A los 15 segundos de espera aparece el error reintentable |
| CP-NAV-039 | CP-NAV-015 | Un reintento con commit previo no duplica |
| CP-NAV-040 | CP-NAV-016 | La misma clave secuencial devuelve el mismo id |
| CP-NAV-041 | CP-NAV-017 | Dos llamadas simultáneas con la misma clave crean una fila |
| CP-NAV-043 | CP-NAV-018 | La misma clave de dos usuarios no colisiona |
| CP-NAV-047 | CP-NAV-019 | Archivar la categoría entre revisión y guardado produce rechazo sin pendiente |
| CP-NAV-048 | CP-NAV-020 | La API rechaza una categoría archivada con el código de integridad |
| CP-NAV-049 | CP-NAV-021 | Volver a Registrar muestra el pendiente con sus acciones |
| CP-NAV-053 | CP-NAV-022 | Recuperar detecta una transacción activa que ya se había guardado |
| CP-NAV-056 | CP-NAV-023 | Descartar elimina el pendiente incluso después de recargar |
| CP-NAV-057 | CP-NAV-024 | Cerrar sesión borra todos los pendientes del usuario |
| CP-NAV-061 | CP-NAV-025 | Doble activación durante Guardando envía una sola RPC |

## DEU · Deudas y gastos compartidos (61 casos)

| ID anterior | ID nuevo | Título |
|---|---|---|
| CP-DEU-001 | CP-DEU-001 | El interruptor "Gasto compartido" aparece apagado en Gasto, despliega los campos al encenderse y al apagarse guarda el gasto sin deuda |
| CP-DEU-003 | CP-DEU-002 | Registrar un gasto compartido de $120.000,00 ARS en 12 cuotas con Sofía por $60.000,00 crea la transacción, 12 cuotas y la deuda vinculada en una sola llamada RPC |
| CP-DEU-004 | CP-DEU-003 | Registrar un gasto compartido en US$100,00 a TC 1250 con Sofía por US$40,00 congela fx_rate = 1250.0000 y amount_ars = 50000.00 y avisa en dólares |
| CP-DEU-008 | CP-DEU-004 | El monto adeudado vacío muestra "Ingresá cuánto te debe" y deshabilita "Guardar gasto" |
| CP-DEU-018 | CP-DEU-005 | Directo contra create_transaction, enviar p_shared_persons = ["Sofía"] con p_shared_amounts = null se rechaza con "Un gasto compartido necesita una persona y un monto por cada deuda" |
| CP-DEU-019 | CP-DEU-006 | Directo contra create_transaction, enviar p_shared_persons = null con p_shared_amounts = ["10000.00"] se rechaza con "Un gasto compartido necesita una persona y un monto por cada deuda" |
| CP-DEU-020 | CP-DEU-007 | Directo contra create_transaction, p_type = "income" con una deuda compartida se rechaza con "Un ingreso no se puede compartir" |
| CP-DEU-021 | CP-DEU-008 | Directo contra create_transaction, p_shared_persons = ["   "] se rechaza con "Ingresá con quién compartiste el gasto" |
| CP-DEU-023 | CP-DEU-009 | Directo contra create_transaction, una persona de 61 caracteres se rechaza con "La persona admite hasta 60 caracteres" |
| CP-DEU-024 | CP-DEU-010 | Directo contra create_transaction, p_shared_amounts = [0] se rechaza con "I4: el monto de la deuda debe ser mayor a cero" |
| CP-DEU-031 | CP-DEU-011 | Deuda de $10.000,00 sobre un gasto de $10.000,00 (igual al gasto) muestra "Tu parte: $0,00" y se guarda |
| CP-DEU-032 | CP-DEU-012 | Deuda de $10.000,01 sobre un gasto de $10.000,00 (un centavo más) muestra "No puede superar el monto del gasto ($10.000,00)" y deshabilita "Guardar gasto" |
| CP-DEU-035 | CP-DEU-013 | Directo contra create_transaction, una deuda de 10000.01 sobre un gasto de 10000.00 ARS se rechaza con "I7: la deuda no puede superar el monto del gasto" y revierte la transacción |
| CP-DEU-041 | CP-DEU-014 | En Movimientos, las 12 cuotas de un gasto compartido y "Últimos movimientos" muestran "Compartido con Sofía", mientras que un gasto sin deuda no tiene transactions-item-shared |
| CP-DEU-044 | CP-DEU-015 | Eliminar el gasto vinculado oculta la deuda de /debts, deja de sumarla en "Te deben" y en el neto del Resumen, y conserva intacta su fila en debts |
| CP-DEU-045 | CP-DEU-016 | Al restaurar desde Movimientos → Eliminados un gasto cuya deuda vinculada estaba saldada, la deuda vuelve a /debts con estado saldada y la misma fecha settled_at |
| CP-DEU-048 | CP-DEU-017 | Estado inicial de /debts/new y guardado de una deuda "Me deben" en ARS por $20.000,00 crea una fila pendiente con transaction_id = null en una sola llamada a create_debt |
| CP-DEU-049 | CP-DEU-018 | Guardar una deuda suelta con dirección "Debo" en ARS crea direction = "i_owe" y en la lista muestra "Le debés" |
| CP-DEU-050 | CP-DEU-019 | En /debts/new, elegir "US$" con TC de referencia de 1250 precompleta "1.250,00", muestra "≈ $50.000,00" para US$40 y guarda fx_rate = 1250.0000 y amount_ars = 50000.00 |
| CP-DEU-051 | CP-DEU-020 | En /debts/new, elegir "US$" sin TC de referencia muestra "No tenés un tipo de cambio configurado para este mes", "Ir a Ajustes" y deshabilita "Guardar deuda" con "Falta el tipo de cambio" |
| CP-DEU-052 | CP-DEU-021 | En /debts/new, dejar "Persona" vacía "" y quitar el foco muestra "Ingresá el nombre de la persona" y deshabilita "Guardar deuda" |
| CP-DEU-055 | CP-DEU-022 | En /debts/new, un "Monto" igual a 0 muestra "El monto debe ser mayor a cero" |
| CP-DEU-057 | CP-DEU-023 | En /debts/new, un "Monto" con más de 2 decimales ("0,001") muestra "El monto admite hasta 2 decimales" |
| CP-DEU-063 | CP-DEU-024 | En /debts/new con US$, Monto = 0,01 y TC = 0,5 se acepta (redondeo half-up a $0,01) y guarda amount_ars = "0.01" |
| CP-DEU-065 | CP-DEU-025 | En /debts/new con US$, un "Tipo de cambio" igual a 0 muestra "El tipo de cambio debe ser mayor a cero" |
| CP-DEU-070 | CP-DEU-026 | En /debts/new, una fecha posterior a hoy (<MAÑANA>) muestra "La fecha no puede ser futura" y deshabilita "Guardar deuda" |
| CP-DEU-072 | CP-DEU-027 | Directo contra create_debt, p_person = "" se rechaza con "Ingresá el nombre de la persona" |
| CP-DEU-075 | CP-DEU-028 | Directo contra create_debt, p_person de 61 caracteres se rechaza con "La persona admite hasta 60 caracteres" |
| CP-DEU-076 | CP-DEU-029 | Directo contra create_debt, p_amount = 0 se rechaza con "I4: el monto debe ser mayor a cero" |
| CP-DEU-078 | CP-DEU-030 | Directo contra create_debt, p_amount = 1.001 (literal JSON) se rechaza con "I4: el monto admite hasta 2 decimales" |
| CP-DEU-080 | CP-DEU-031 | Directo contra create_debt, p_currency = "USD" con p_fx_rate = null se rechaza con "I5: fx_rate es obligatorio si y solo si la moneda es USD" |
| CP-DEU-081 | CP-DEU-032 | Directo contra create_debt, p_currency = "ARS" con p_fx_rate = "1250.0000" se rechaza con "I5: fx_rate es obligatorio si y solo si la moneda es USD" |
| CP-DEU-086 | CP-DEU-033 | Directo contra create_debt, p_incurred_on = "<MAÑANA>" se rechaza con "La fecha no puede ser posterior a hoy" |
| CP-DEU-092 | CP-DEU-034 | Directo contra create_debt con el rol anon (sin Authorization) responde 42501 (permission denied) |
| CP-DEU-093 | CP-DEU-035 | Un POST /rest/v1/debts directo con sesión autenticada responde 42501 (permission denied) y no crea filas |
| CP-DEU-094 | CP-DEU-036 | La tarjeta de totales suma las deudas pendientes en pesos (incluyendo USD al TC congelado), excluye las saldadas y no cambia al cambiar el filtro de estado |
| CP-DEU-095 | CP-DEU-037 | Cuando "Debés" supera a "Te deben", el neto muestra "En contra $5.000,00" |
| CP-DEU-098 | CP-DEU-038 | Cambiar el TC de referencia del mes a 1400 no modifica "Te deben" de una deuda en USD ya creada a TC 1250 (C5) |
| CP-DEU-099 | CP-DEU-039 | /debts sin parámetros muestra "Pendientes" seleccionado y solo pendientes; tocar "Saldadas" y "Todas" actualiza ?status= y filtra la lista |
| CP-DEU-101 | CP-DEU-040 | Abrir /debts?status=xyz se comporta como "Pendientes" y al tocar "Saldadas" reemplaza el parámetro por ?status=settled |
| CP-DEU-102 | CP-DEU-041 | En /debts con filtro "Pendientes", las deudas se ordenan por fecha incurred_on descendente y, a igual fecha, por created_at descendente |
| CP-DEU-103 | CP-DEU-042 | Estado vacío en "Pendientes" muestra "No tenés deudas pendientes." y el botón "Cargar una deuda" que navega a /debts/new |
| CP-DEU-106 | CP-DEU-043 | En la UI, un segundo usuario autenticado no ve las deudas de otro usuario ni en la lista ni en los totales (C7) |
| CP-DEU-107 | CP-DEU-044 | Directo por API, un segundo usuario autenticado recibe [] al consultar GET /rest/v1/debts (C7) |
| CP-DEU-108 | CP-DEU-045 | Directo por API, un GET /rest/v1/debts sin sesión (con el rol anon) responde 42501 (permission denied) |
| CP-DEU-109 | CP-DEU-046 | En "Pendientes", tocar "Marcar saldada" llama una sola vez a settle_debt, saca la fila de la lista, muestra "Deuda con Sofía saldada" con "Deshacer", actualiza los totales y fija settled_at |
| CP-DEU-111 | CP-DEU-047 | Tocar "Deshacer" dentro de los 5 segundos tras saldar llama a reopen_debt, devuelve la fila a "Pendientes" con settled_at = null y restaura los totales |
| CP-DEU-112 | CP-DEU-048 | Si la deuda ya había sido saldada desde otra pestaña, tocar "Marcar saldada" muestra "No se pudo actualizar la deuda" con "La deuda ya está saldada" y actualiza la lista |
| CP-DEU-113 | CP-DEU-049 | Directo contra settle_debt, saldar una deuda que ya está settled se rechaza con "La deuda ya está saldada" |
| CP-DEU-114 | CP-DEU-050 | Directo contra settle_debt, el Usuario B no puede saldar una deuda del Usuario A y recibe "La deuda no existe" |
| CP-DEU-116 | CP-DEU-051 | Un PATCH /rest/v1/debts directo con sesión autenticada responde 42501 (permission denied) y no modifica la fila |
| CP-DEU-117 | CP-DEU-052 | En "Saldadas", tocar "Volver a pendiente" llama una sola vez a reopen_debt, saca la fila de "Saldadas", muestra "La deuda con Sofía volvió a pendiente" y conserva todos sus campos con settled_at = null |
| CP-DEU-122 | CP-DEU-053 | Saldar y volver a pendiente la misma deuda tres veces seguidas termina pendiente, con settled_at = null y sin filas nuevas |
| CP-DEU-123 | CP-DEU-054 | El filtro por dirección en /debts muestra "Todas" por defecto, filtra por "Te deben" (?direction=owed_to_me) y "Debés" (?direction=i_owe), no altera los totales y no vuelve a pedir datos a la red |
| CP-DEU-128 | CP-DEU-055 | Encender "Gasto compartido" muestra 1 fila sin "Quitar", "Agregar persona" suma la fila 2 con foco en "¿Con quién?" y "Quitar" en ambas, y guardar un gasto de $120.000,00 con "Sofía" 40000 y "Juan" 40000 crea 2 deudas en 1 llamada a create_transaction con aviso "Juan y Sofía te deben $80.000,00" y etiqueta "Compartido con Juan y Sofía" |
| CP-DEU-133 | CP-DEU-056 | Con 10 filas, "Agregar persona" se deshabilita, se ve "Podés compartir un gasto con hasta 10 personas" y al guardar crea 10 deudas |
| CP-DEU-141 | CP-DEU-057 | create_transaction rechaza gasto de 120000 con montos 60000 y 60000.01 con HTTP 400 (23514) y mensaje "I7: la suma de las deudas no puede superar el monto del gasto" |
| CP-DEU-143 | CP-DEU-058 | Gasto de $120.000,00 en 1 cuota con deuda vinculada pendiente de $60.000,00 muestra Gastado $120.000,00 (bruto), Neto de reembolsos $60.000,00 y "Ver deudas" navega a /debts |
| CP-DEU-144 | CP-DEU-059 | Con la deuda vinculada ya saldada, el Resumen sigue mostrando Gastado $120.000,00 (bruto) y Neto de reembolsos $60.000,00 |
| CP-DEU-146 | CP-DEU-060 | Una deuda suelta "Me deben" en el período no hace aparecer la fila "Neto de reembolsos" ni cambia el total gastado |
| CP-DEU-149 | CP-DEU-061 | Gasto de US$100,00 a TC 1250 ($125.000,00) con deuda vinculada de US$40,00 ($50.000,00) muestra Neto $75.000,00 y no cambia aunque se modifique el TC de referencia del mes a 1500 (C5) |

## EXP · Exportar CSV (31 casos)

| ID anterior | ID nuevo | Título |
|---|---|---|
| CP-EXP-001 | CP-EXP-001 | Una URL válida fija septiembre 2026 |
| CP-EXP-006 | CP-EXP-002 | El mes siguiente está bloqueado |
| CP-EXP-007 | CP-EXP-003 | El alcance mensual propone el nombre 2026-09 |
| CP-EXP-009 | CP-EXP-004 | El primer día del mes se incluye |
| CP-EXP-012 | CP-EXP-005 | El día posterior al mes se excluye |
| CP-EXP-013 | CP-EXP-006 | El 1 de enero se incluye en el año |
| CP-EXP-016 | CP-EXP-007 | El día posterior al año se excluye |
| CP-EXP-017 | CP-EXP-008 | Una transacción eliminada queda fuera |
| CP-EXP-020 | CP-EXP-009 | El archivo comienza con BOM UTF-8 |
| CP-EXP-021 | CP-EXP-010 | El encabezado tiene doce columnas exactas |
| CP-EXP-023 | CP-EXP-011 | Doce cuotas salen en una sola fila por el total |
| CP-EXP-025 | CP-EXP-012 | ARS se escribe con dos decimales exactos |
| CP-EXP-026 | CP-EXP-013 | USD conserva cuatro decimales de TC |
| CP-EXP-028 | CP-EXP-014 | Una coma obliga a entrecomillar la descripción |
| CP-EXP-029 | CP-EXP-015 | Las comillas internas se duplican |
| CP-EXP-031 | CP-EXP-016 | Descripción con igual se neutraliza |
| CP-EXP-037 | CP-EXP-017 | Una categoría que empieza con igual se neutraliza |
| CP-EXP-041 | CP-EXP-018 | 1.500 transacciones se exportan sin faltantes |
| CP-EXP-043 | CP-EXP-019 | El CSV de A no contiene movimientos de B |
| CP-EXP-044 | CP-EXP-020 | La API con token de A devuelve cero filas de B |
| CP-EXP-045 | CP-EXP-021 | Categoría archivada sale con el nombre actual |
| CP-EXP-047 | CP-EXP-022 | Un ingreso exporta categoría vacía |
| CP-EXP-051 | CP-EXP-023 | Un doble click inicia una sola descarga |
| CP-EXP-054 | CP-EXP-024 | Un mes sin transacciones muestra Vacío |
| CP-EXP-057 | CP-EXP-025 | Offline muestra el error exacto |
| CP-EXP-058 | CP-EXP-026 | El reintento después de Offline descarga completo |
| CP-EXP-062 | CP-EXP-027 | Tocar fuera cierra sin descargar |
| CP-EXP-063 | CP-EXP-028 | Atrás cierra la hoja inicial |
| CP-EXP-064 | CP-EXP-029 | Atrás durante Exportando cancela la descarga |
| CP-EXP-068 | CP-EXP-030 | Una alta concurrente impide descargar un año incompleto |
| CP-EXP-073 | CP-EXP-031 | HTTP 500 muestra Error y no descarga |

## SUS · Suscripciones (48 casos)

| ID anterior | ID nuevo | Título |
|---|---|---|
| CP-SUS-001 | CP-SUS-001 | Dar de alta una suscripción en ARS desde hace 2 meses con día de cobro 10 genera los 2 gastos vencidos al guardar |
| CP-SUS-002 | CP-SUS-002 | Dar de alta una suscripción en ARS desde el mes siguiente no genera gastos al guardar |
| CP-SUS-012 | CP-SUS-003 | Dar de alta una suscripción con el mismo nombre que una suscripción cancelada se acepta |
| CP-SUS-013 | CP-SUS-004 | Rechazar en UI el alta de suscripción con Nombre vacío o solo espacios |
| CP-SUS-014 | CP-SUS-005 | Rechazar en API `create_subscription` con Nombre vacío o solo espacios |
| CP-SUS-016 | CP-SUS-006 | Rechazar en UI el alta de suscripción con Nombre igual al de otra activa sin distinguir mayúsculas ni espacios (`" netflix "`) |
| CP-SUS-017 | CP-SUS-007 | Rechazar en API `create_subscription` con Nombre igual al de otra activa (`" netflix "`) |
| CP-SUS-022 | CP-SUS-008 | Rechazar en UI el alta de suscripción con Monto igual a `"0"` |
| CP-SUS-023 | CP-SUS-009 | Rechazar en API `create_subscription` con `p_amount = "0.00"` |
| CP-SUS-029 | CP-SUS-010 | Rechazar en API `create_subscription` en ARS con Monto mayor al máximo (`"1000000000000.00"`) |
| CP-SUS-033 | CP-SUS-011 | Rechazar en API `create_subscription` con `p_category_id = null` |
| CP-SUS-041 | CP-SUS-012 | Rechazar en API `create_subscription` con `p_billing_day = 32` |
| CP-SUS-047 | CP-SUS-013 | Rechazar en API `create_subscription` con Mes de inicio anterior al límite inferior (`-25` meses) |
| CP-SUS-051 | CP-SUS-014 | Rechazar en API `create_subscription` con `p_end_period < p_start_period` |
| CP-SUS-055 | CP-SUS-015 | Rechazar en API `create_subscription` con Descripción de 201 caracteres |
| CP-SUS-056 | CP-SUS-016 | Rechazar en API `create_subscription` con `p_category_id` propia archivada |
| CP-SUS-058 | CP-SUS-017 | Rechazar en API `create_subscription` usando `p_category_id` de otro usuario |
| CP-SUS-060 | CP-SUS-018 | Rechazar en API un `INSERT` directo sobre `/rest/v1/subscriptions` con la sesión del usuario |
| CP-SUS-062 | CP-SUS-019 | Dos toques seguidos en `"Guardar suscripción"` deshabilitan el botón y crean una sola suscripción |
| CP-SUS-063 | CP-SUS-020 | Rechazar en UI ver el detalle de una suscripción de otro usuario mostrando `subscription-detail-not-found` |
| CP-SUS-064 | CP-SUS-021 | Rechazar en API leer una suscripción de otro usuario (`GET /rest/v1/subscriptions` devuelve `[]`) |
| CP-SUS-065 | CP-SUS-022 | Rechazar en API `create_subscription` sin sesión autenticada (rol `anon`) |
| CP-SUS-067 | CP-SUS-023 | Mostrar estado vacío `subscriptions-empty` y ocultar la tarjeta del total comprometido cuando el usuario no tiene suscripciones |
| CP-SUS-070 | CP-SUS-024 | Puesta al día automática al entrar a la app genera 2 períodos vencidos pendientes y muestra el aviso `app-catchup-generated` |
| CP-SUS-072 | CP-SUS-025 | Dos llamadas consecutivas por API a `run_subscription_catchup` responden `200 OK` sin error y dejan exactamente 1 transacción por período |
| CP-SUS-074 | CP-SUS-026 | Suscripción en estado `paused` no genera ocurrencias al ejecutar `run_subscription_catchup` |
| CP-SUS-078 | CP-SUS-027 | Suscripción con día de cobro `31` entre `2026-01` y `2026-04` genera ocurrencias con fechas `31/01/2026`, `28/02/2026`, `31/03/2026` y `30/04/2026` |
| CP-SUS-081 | CP-SUS-028 | Suscripción con día de cobro `<DIA_MAÑANA>` no genera la ocurrencia del mes corriente |
| CP-SUS-082 | CP-SUS-029 | Suscripción con día de cobro igual a `<DIA_HOY>` genera la ocurrencia del mes corriente |
| CP-SUS-085 | CP-SUS-030 | Pausar suscripción activa con día de cobro `28` (`> <DIA_HOY>`) muestra advertencia de este mes y pasa a `"Pausada desde <HOY>"` con piso en `<MES_SIGUIENTE>` |
| CP-SUS-088 | CP-SUS-031 | `pause_subscription` por API ejecuta primero la puesta al día y genera los meses vencidos pendientes antes de pausar |
| CP-SUS-094 | CP-SUS-032 | Rechazar en API `pause_subscription` usando la sesión de otro usuario (`404 P0002`) |
| CP-SUS-096 | CP-SUS-033 | Reanudar suscripción pausada abre `resume-subscription-dialog`, pasa a `"Activa"`, limpia `paused_at`, conserva `generate_from_period = '<MES_SIGUIENTE>-01'` y no genera el mes actual |
| CP-SUS-102 | CP-SUS-034 | Cancelar suscripción activa con 4 gastos cargados mantiene el historial en el Detalle y en el Resumen y oculta los botones de acción |
| CP-SUS-109 | CP-SUS-035 | Editar el monto de una suscripción activa de `$5.000,00` a `$7.000,00` conserva las 4 ocurrencias ya generadas en `$5.000,00` y muestra Moneda y Mes de inicio como solo lectura |
| CP-SUS-117 | CP-SUS-036 | Rechazar en API `update_subscription` con `p_end_period` anterior al período corriente (`<MES_ANTERIOR>-01`) |
| CP-SUS-118 | CP-SUS-037 | Rechazar en UI renombrar una suscripción poniéndole el nombre de otra suscripción activa del mismo usuario |
| CP-SUS-120 | CP-SUS-038 | Rechazar en UI editar una suscripción cancelada al navegar directo a `/subscriptions/<SUB_ID>/edit` |
| CP-SUS-124 | CP-SUS-039 | Rechazar en API cambiar `p_category_id` en `update_subscription` a otra categoría archivada distinta de la actual |
| CP-SUS-131 | CP-SUS-040 | Eliminar desde Movimientos la ocurrencia de `<MES_ANTERIOR>` muestra `delete-transaction-subscription-note`, figura con `"Eliminado"` en el Detalle y no vuelve a crearse al recargar |
| CP-SUS-134 | CP-SUS-041 | Mostrar la marca de suscripción en Movimientos y en `"Últimos movimientos"` del Resumen (y no en un gasto manual) y navegar al Detalle al tocarla |
| CP-SUS-135 | CP-SUS-042 | La ocurrencia generada de una suscripción suma en `"Gastado en <mes corto>"` y resta en `"Balance"` del Resumen de V1 |
| CP-SUS-139 | CP-SUS-043 | Suscripción activa en USD con tipo de cambio en `<MES_HACE_2>` y sin tipo de cambio en `<MES_ANTERIOR>` genera solo `<MES_HACE_2>`, muestra `"Falta tipo de cambio"` y el botón `"Cargar tipo de cambio"` navega a `/settings?period=<MES_ANTERIOR>` |
| CP-SUS-143 | CP-SUS-044 | Con dos suscripciones activas en ARS (`$5.000,00` y `$2.500,00`), el total mensual comprometido muestra `"$7.500,00"` y `"2 suscripciones activas este mes"` |
| CP-SUS-144 | CP-SUS-045 | Suscripción activa en `USD 10,00` con tipo de cambio del período corriente `1.250,00` suma `"$12.500,00"` al total mensual comprometido |
| CP-SUS-149 | CP-SUS-046 | Una suscripción en estado `paused` no suma al total mensual comprometido (`"$0,00"` y `"No tenés suscripciones activas este mes"`) |
| CP-SUS-153 | CP-SUS-047 | Vista previa en `/subscriptions/new` con `$5.000,00` ARS, día `28` (`> <DIA_HOY>`), desde `<MES_HACE_2>` y sin fin muestra 2 meses en `"Se cargan al guardar"`, 3 en `"Próximos cobros"`, resumen de `"$10.000,00"` y al guardar crea exactamente esas 2 transacciones |
| CP-SUS-157 | CP-SUS-048 | Vista previa en `/subscriptions/new` en USD con tipo de cambio en `<MES_HACE_2>` y sin tipo de cambio en `<MES_ANTERIOR>` marca `<MES_ANTERIOR>` con `data-blocked="true"` y no lo cuenta en el resumen |

## IMP · Importar Excel (41 casos)

| ID anterior | ID nuevo | Título |
|---|---|---|
| CP-IMP-001 | CP-IMP-001 | El acceso desde Registrar abre el paso Archivo |
| CP-IMP-005 | CP-IMP-002 | A1 rechaza la extensión .xls |
| CP-IMP-006 | CP-IMP-003 | A2 rechaza 1.048.577 bytes |
| CP-IMP-007 | CP-IMP-004 | A3 rechaza un archivo dañado con extensión xlsx |
| CP-IMP-008 | CP-IMP-005 | A4 enumera tres encabezados obligatorios faltantes |
| CP-IMP-011 | CP-IMP-006 | A7 rechaza 501 filas con datos |
| CP-IMP-014 | CP-IMP-007 | El límite de filas acepta exactamente 500 |
| CP-IMP-017 | CP-IMP-008 | Los encabezados aceptan orden, mayúsculas, espacios y tildes distintos |
| CP-IMP-022 | CP-IMP-009 | F1: fecha vacía |
| CP-IMP-023 | CP-IMP-010 | F2: fecha inexistente |
| CP-IMP-024 | CP-IMP-011 | F3: fecha futura fija |
| CP-IMP-026 | CP-IMP-012 | F5: tipo inválido |
| CP-IMP-028 | CP-IMP-013 | F7: monto no numérico |
| CP-IMP-029 | CP-IMP-014 | F8: monto cero |
| CP-IMP-030 | CP-IMP-015 | F9: monto con tres decimales |
| CP-IMP-033 | CP-IMP-016 | F12: moneda EUR |
| CP-IMP-034 | CP-IMP-017 | F13a: USD sin tipo de cambio |
| CP-IMP-035 | CP-IMP-018 | F13b: ARS con tipo de cambio |
| CP-IMP-040 | CP-IMP-019 | F14b: categoría inexistente |
| CP-IMP-042 | CP-IMP-020 | F14d: cuenta inexistente |
| CP-IMP-043 | CP-IMP-021 | F14e: trece cuotas |
| CP-IMP-044 | CP-IMP-022 | F15: cuotas en cuenta no crédito |
| CP-IMP-048 | CP-IMP-023 | Errores de varias columnas conservan el orden de reglas |
| CP-IMP-052 | CP-IMP-024 | Nombres, tipo y moneda aceptan espacios y mayúsculas |
| CP-IMP-054 | CP-IMP-025 | Categoría archivada no se acepta aunque el nombre coincida |
| CP-IMP-059 | CP-IMP-026 | El texto 1.500 se interpreta como mil quinientos |
| CP-IMP-063 | CP-IMP-027 | El resumen del archivo de ejemplo suma solo las siete filas listas |
| CP-IMP-064 | CP-IMP-028 | El filtro muestra solo las cuatro filas con error |
| CP-IMP-068 | CP-IMP-029 | Cero filas listas deshabilita Importar 0 movimientos |
| CP-IMP-070 | CP-IMP-030 | Confirmar importa solo las filas listas con todos sus campos |
| CP-IMP-072 | CP-IMP-031 | La compra de 240.000 en seis cuotas crea seis imputaciones exactas |
| CP-IMP-074 | CP-IMP-032 | Un rechazo tardío de categoría no impide las otras filas |
| CP-IMP-076 | CP-IMP-033 | Quinientas filas de doce cuotas terminan en menos de diez segundos |
| CP-IMP-077 | CP-IMP-034 | La RPC procesa una válida y rechaza tres inválidas |
| CP-IMP-079 | CP-IMP-035 | La RPC rechaza un lote de 501 elementos |
| CP-IMP-080 | CP-IMP-036 | El rol anon no puede ejecutar import_transactions |
| CP-IMP-081 | CP-IMP-037 | Otro usuario no ve transacciones ni imports ajenos |
| CP-IMP-083 | CP-IMP-038 | Reintento tras respuesta perdida reconoce lo guardado |
| CP-IMP-085 | CP-IMP-039 | Dos llamadas API con el mismo import_id son idempotentes |
| CP-IMP-086 | CP-IMP-040 | Sin respuesta conserva Revisión |
| CP-IMP-087 | CP-IMP-041 | Sesión vencida ofrece volver a entrar |
