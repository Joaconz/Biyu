# Entrega 2 · Ejecución de casos de prueba (V2) · Deudas, Navegación, Exportar CSV, Importar Excel y Suscripciones

Planilla: `04-ejecucion.xlsx` (una hoja por caso con el «Reporte de ejecución 1», el resultado obtenido, la evidencia y los defectos). Casos: ver `02-especificacion-casos-v2` (Deudas y Navegación) y `casos/exp.md`, `casos/imp.md` y `casos/sus.md` (Exportar, Importar y Suscripciones; sus pasos también están en la hoja de cada caso de la planilla).

## Condiciones de la ejecución

Catálogo reducido a 206 casos (recorte del 2026-10-27: se quitaron los casos que repetían una regla con otro valor, los de funciones todavía no implementadas y los de ancho de pantalla o testids repetidos). Acá figuran los 189 que tienen resultado; los 17 de Deudas restantes (CP-DEU-001, 002, 003, 004, 011, 012, 013, 014, 018, 020, 021, 022, 025, 036, 037, 038 y 039) no figuraban en este registro: el equipo informó como «OK» los CP-DEU-014, 018, 020, 021, 022, 036, 037, 038 y 039, y los otros 8 (CP-DEU-001, 002, 003, 004, 011, 012, 013 y 025) no se ejecutaron.

- **Fecha:** 2026-10-25.
- **Ejecutó a mano (Santiago):** CP-DEU-005, 006, 007, 008, 009 y 010, y 15 casos de Navegación (CP-NAV-001, 002, 003, 004, 008, 009, 010, 011, 012, 013, 019, 021, 023, 024 y 025), en el **deploy de Vercel** (https://biyu-rust.vercel.app), con **Google Chrome**.
- **Ejecutó Claude Code, supervisado por Santiago (10 casos de Navegación):** CP-NAV-005, 006, 007, 014, 015, 016, 017, 018, 020 y 022. Entorno local: Vite (`http://127.0.0.1:5173`) + Supabase local con todas las migraciones, `main` en `f096e22`, Chromium (Playwright 1.63) y navegador integrado de Claude Code.
- **Ejecutó Claude Code, supervisado por Santiago (Deudas):** los casos CP-DEU-040 a 061 que quedaron en el catálogo (CP-DEU-040, 041, 042, 043 a 046, 047 a 050, 051, 052, 053, 054, 055, 056, 057, 058, 059, 060 y 061), en el mismo entorno local. La preparación (deudas, gastos y tipos de cambio) se cargó por API, como en los casos originales con PR-04.
- **Datos:** usuarios y montos ficticios, uno por caso.
- **Exportar CSV (31 casos), Importar Excel (41 casos) y Suscripciones (48 casos):** ejecutados el **2026-10-27** en el entorno local (Vite + Supabase local, Chromium con Playwright), sobre `main` en `1c72d0f`. **Ejecutó Claude Code (IA), supervisado por Santiago:** los 31 de EXP, los 41 de IMP y 27 de los 48 de SUS (los que el equipo no pudo probar o informó con una observación). Los otros 21 casos de SUS los ejecutó el equipo y los informó como «ok» en un mensaje; no se repitieron. Detalle del entorno y de lo sustituido en `06-reporte-de-ejecucion`, §6.
- **Deudas, casos CP-DEU-015 a 035 (16 casos):** ejecutados el **2026-10-27** en el entorno local (Vite + Supabase local, Chromium con Playwright, reloj real), sobre `main` en `1c72d0f`. **Ejecutó Claude Code (IA), supervisado por Santiago:** CP-DEU-015, 016, 017, 019, 023, 024, 026, 027, 028, 029, 030, 031, 032, 033, 034 y 035. Los que el equipo informó como «OK» (CP-DEU-014, 018, 020, 021, 022, 036, 037, 038 y 039) no se repitieron y no figuran en este reporte.
- **Criterio para BLOCKED:** un caso que no se puede ejecutar porque falta una funcionalidad o un botón queda BLOCKED para V3.

## Resultado por caso

| ID | Prioridad | Título | Status | Ejecutó | Defectos |
|---|---|---|---|---|---|
| CP-DEU-005 | Alta | No se puede compartir un gasto si falta cuánto te deben | **PASSED** | Santiago | — |
| CP-DEU-006 | Alta | No se puede compartir un gasto si falta con quién | **PASSED** | Santiago | — |
| CP-DEU-007 | Alta | Un ingreso no se puede compartir | **PASSED** | Santiago | — |
| CP-DEU-008 | Alta | El nombre hecho solo de espacios no cuenta como nombre | **PASSED** | Santiago | — |
| CP-DEU-009 | Media | El nombre admite hasta 60 caracteres, no 61 | **PASSED** | Santiago | — |
| CP-DEU-010 | Alta | No se puede deber 0 pesos | **PASSED** | Santiago | — |
| CP-DEU-015 | Alta | Eliminar el gasto vinculado oculta la deuda de /debts, deja de sumarla en "Te deben" y en el neto del Resumen, y conserva intacta su fila en debts | **PASSED** | Claude Code | — |
| CP-DEU-016 | Alta | Al restaurar desde Movimientos → Eliminados un gasto cuya deuda vinculada estaba saldada, la deuda vuelve a /debts con estado saldada y la misma fecha settled_at | **PASSED** | Claude Code | — |
| CP-DEU-017 | Alta | Estado inicial de /debts/new y guardado de una deuda "Me deben" en ARS por $20.000,00 crea una fila pendiente con transaction_id = null en una sola llamada a create_debt | **PASSED** | Claude Code | — |
| CP-DEU-019 | Alta | En /debts/new, elegir "US$" con TC de referencia de 1250 precompleta "1.250,00", muestra "≈ $50.000,00" para US$40 y guarda fx_rate = 1250.0000 y amount_ars = 50000.00 | **PASSED** | Claude Code | — |
| CP-DEU-023 | Media | En /debts/new, un "Monto" con más de 2 decimales ("0,001") muestra "El monto admite hasta 2 decimales" | **PASSED** | Claude Code | — |
| CP-DEU-024 | Alta | En /debts/new con US$, Monto = 0,01 y TC = 0,5 se acepta (redondeo half-up a $0,01) y guarda amount_ars = "0.01" | **FAILED** | Claude Code | DEF-037 |
| CP-DEU-026 | Alta | En /debts/new, una fecha posterior a hoy (<MAÑANA>) muestra "La fecha no puede ser futura" y deshabilita "Guardar deuda" | **PASSED** | Claude Code | — |
| CP-DEU-027 | Alta | Directo contra create_debt, p_person = "" se rechaza con "Ingresá el nombre de la persona" | **PASSED** | Claude Code | — |
| CP-DEU-028 | Media | Directo contra create_debt, p_person de 61 caracteres se rechaza con "La persona admite hasta 60 caracteres" | **PASSED** | Claude Code | — |
| CP-DEU-029 | Alta | Directo contra create_debt, p_amount = 0 se rechaza con "I4: el monto debe ser mayor a cero" | **PASSED** | Claude Code | — |
| CP-DEU-030 | Media | Directo contra create_debt, p_amount = 1.001 (literal JSON) se rechaza con "I4: el monto admite hasta 2 decimales" | **PASSED** | Claude Code | — |
| CP-DEU-031 | Alta | Directo contra create_debt, p_currency = "USD" con p_fx_rate = null se rechaza con "I5: fx_rate es obligatorio si y solo si la moneda es USD" | **PASSED** | Claude Code | — |
| CP-DEU-032 | Media | Directo contra create_debt, p_currency = "ARS" con p_fx_rate = "1250.0000" se rechaza con "I5: fx_rate es obligatorio si y solo si la moneda es USD" | **PASSED** | Claude Code | — |
| CP-DEU-033 | Alta | Directo contra create_debt, p_incurred_on = "<MAÑANA>" se rechaza con "La fecha no puede ser posterior a hoy" | **PASSED** | Claude Code | — |
| CP-DEU-034 | Alta | Directo contra create_debt con el rol anon (sin Authorization) responde 42501 (permission denied) | **PASSED** | Claude Code | — |
| CP-DEU-035 | Alta | Un POST /rest/v1/debts directo con sesión autenticada responde 42501 (permission denied) y no crea filas | **PASSED** | Claude Code | — |
| CP-DEU-040 | Baja | Un filtro inválido en la dirección se trata como «Pendientes» | **PASSED** | Claude Code | — |
| CP-DEU-041 | Media | Deudas pendientes: la de fecha más nueva va primero | **PASSED** | Claude Code | — |
| CP-DEU-042 | Media | Sin deudas pendientes: mensaje y botón «Cargar una deuda» | **PASSED** | Claude Code | — |
| CP-DEU-043 | Alta | Otro usuario no ve las deudas de alguien más | **PASSED** | Claude Code | — |
| CP-DEU-044 | Alta | Por API, otro usuario no recibe las deudas de alguien más | **PASSED** | Claude Code | — |
| CP-DEU-045 | Alta | Por API, sin sesión no se pueden leer las deudas | **PASSED** | Claude Code | — |
| CP-DEU-046 | Alta | Marcar una deuda como saldada desde «Pendientes» | **PASSED** | Claude Code | — |
| CP-DEU-047 | Alta | «Deshacer» devuelve la deuda a pendiente | **PASSED** | Claude Code | — |
| CP-DEU-048 | Media | Saldar una deuda que ya se saldó en otra pestaña muestra un error | **PASSED** | Claude Code | — |
| CP-DEU-049 | Alta | Por API, saldar una deuda ya saldada se rechaza | **PASSED** | Claude Code | — |
| CP-DEU-050 | Alta | Por API, un usuario no puede saldar la deuda de otro | **PASSED** | Claude Code | — |
| CP-DEU-051 | Alta | Por API, no se puede modificar una deuda directamente | **PASSED** | Claude Code | — |
| CP-DEU-052 | Alta | «Volver a pendiente» desde «Saldadas» | **PASSED** | Claude Code | — |
| CP-DEU-053 | Media | Saldar y reabrir tres veces seguidas deja la deuda pendiente | **PASSED** | Claude Code | — |
| CP-DEU-054 | Alta | Filtro por dirección: «Todas», «Te deben» y «Debés» | **PASSED** | Claude Code | — |
| CP-DEU-055 | Alta | Gasto compartido con varias personas: agregar, quitar y guardar | **BLOCKED** | Claude Code | — |
| CP-DEU-056 | Alta | Se puede compartir con hasta 10 personas | **BLOCKED** | Claude Code | — |
| CP-DEU-057 | Alta | Por API, deudas que suman más que el gasto se rechazan | **BLOCKED** | Claude Code | — |
| CP-DEU-058 | Alta | Resumen: gasto bruto y neto de reembolsos | **PASSED** | Claude Code | — |
| CP-DEU-059 | Alta | Resumen: el neto no cambia al saldar la deuda | **PASSED** | Claude Code | — |
| CP-DEU-060 | Alta | Resumen: una deuda suelta «Me deben» no cambia el neto | **PASSED** | Claude Code | — |
| CP-DEU-061 | Alta | Resumen: el neto en dólares no cambia si cambia el tipo de cambio | **PASSED** | Claude Code | — |
| CP-NAV-001 | Media | La barra tiene cuatro secciones en el orden correcto | **PASSED** | Santiago | — |
| CP-NAV-002 | Media | «Deudas» lleva a Deudas | **PASSED** | Santiago | — |
| CP-NAV-003 | Media | En el Resumen la barra marca «Resumen» | **PASSED** | Santiago | — |
| CP-NAV-004 | Media | En Ajustes no se marca ninguna de las cuatro secciones | **PASSED** | Santiago | — |
| CP-NAV-005 | Media | Ancho 1023 px: barra abajo y engranaje de Ajustes | **PASSED** | Claude Code | — |
| CP-NAV-006 | Media | Ancho 1024 px: barra lateral con Ajustes al pie | **PASSED** | Claude Code | — |
| CP-NAV-007 | Media | Identificadores únicos en Registrar (375 px) | **PASSED** | Claude Code | — |
| CP-NAV-008 | Media | «Ver todos» y «‹ Resumen» mantienen el mes | **PASSED** | Santiago | — |
| CP-NAV-009 | Media | Deudas no arrastra el mes del Resumen | **PASSED** | Santiago | — |
| CP-NAV-010 | Alta | Tocar «Registrar» estando en Registrar no pierde lo cargado | **PASSED** | Santiago | — |
| CP-NAV-011 | Media | Guardar $12.500 muestra la confirmación completa | **PASSED** | Santiago | — |
| CP-NAV-012 | Alta | Sin internet el gasto no se pierde y aparece «Reintentar» | **PASSED** | Santiago | — |
| CP-NAV-013 | Alta | Reintentar al volver internet guarda una sola vez | **PASSED** | Santiago | — |
| CP-NAV-014 | Alta | Con internet muy lenta, a los 15 segundos avisa que falló | **PASSED** | Claude Code | — |
| CP-NAV-015 | Alta | Reintentar no duplica un gasto que ya se había guardado | **PASSED** | Claude Code | — |
| CP-NAV-016 | Alta | La misma clave dos veces seguidas devuelve el mismo gasto | **PASSED** | Claude Code | — |
| CP-NAV-017 | Alta | Dos pedidos simultáneos con la misma clave crean un solo gasto | **PASSED** | Claude Code | — |
| CP-NAV-018 | Alta | La misma clave en dos usuarios distintos no se pisa | **PASSED** | Claude Code | — |
| CP-NAV-019 | Alta | Si se archiva la categoría antes de guardar, el gasto se rechaza con aviso | **PASSED** | Santiago | — |
| CP-NAV-020 | Alta | La API rechaza un gasto con una categoría archivada | **PASSED** | Claude Code | — |
| CP-NAV-021 | Alta | Al volver a Registrar aparece el gasto pendiente | **PASSED** | Santiago | — |
| CP-NAV-022 | Alta | Recuperar un gasto que en realidad ya estaba guardado | **PASSED** | Claude Code | — |
| CP-NAV-023 | Alta | Descartar borra el pendiente, incluso al recargar | **PASSED** | Santiago | — |
| CP-NAV-024 | Alta | Cerrar sesión borra los pendientes | **PASSED** | Santiago | — |
| CP-NAV-025 | Alta | Tocar dos veces «Guardar» guarda una sola vez | **PASSED** | Santiago | — |
| CP-EXP-001 | Media | Una URL válida fija septiembre 2026 | **PASSED** | Claude Code | — |
| CP-EXP-002 | Alta | El mes siguiente está bloqueado | **PASSED** | Claude Code | — |
| CP-EXP-003 | Alta | El alcance mensual propone el nombre 2026-09 | **PASSED** | Claude Code | — |
| CP-EXP-004 | Alta | El primer día del mes se incluye | **PASSED** | Claude Code | — |
| CP-EXP-005 | Alta | El día posterior al mes se excluye | **PASSED** | Claude Code | — |
| CP-EXP-006 | Alta | El 1 de enero se incluye en el año | **PASSED** | Claude Code | — |
| CP-EXP-007 | Alta | El día posterior al año se excluye | **PASSED** | Claude Code | — |
| CP-EXP-008 | Alta | Una transacción eliminada queda fuera | **PASSED** | Claude Code | — |
| CP-EXP-009 | Alta | El archivo comienza con BOM UTF-8 | **PASSED** | Claude Code | — |
| CP-EXP-010 | Alta | El encabezado tiene doce columnas exactas | **PASSED** | Claude Code | — |
| CP-EXP-011 | Alta | Doce cuotas salen en una sola fila por el total | **PASSED** | Claude Code | — |
| CP-EXP-012 | Alta | ARS se escribe con dos decimales exactos | **PASSED** | Claude Code | — |
| CP-EXP-013 | Alta | USD conserva cuatro decimales de TC | **PASSED** | Claude Code | — |
| CP-EXP-014 | Alta | Una coma obliga a entrecomillar la descripción | **PASSED** | Claude Code | — |
| CP-EXP-015 | Alta | Las comillas internas se duplican | **PASSED** | Claude Code | — |
| CP-EXP-016 | Alta | Descripción con igual se neutraliza | **PASSED** | Claude Code | — |
| CP-EXP-017 | Alta | Una categoría que empieza con igual se neutraliza | **PASSED** | Claude Code | — |
| CP-EXP-018 | Alta | 1.500 transacciones se exportan sin faltantes | **PASSED** | Claude Code | — |
| CP-EXP-019 | Alta | El CSV de A no contiene movimientos de B | **PASSED** | Claude Code | — |
| CP-EXP-020 | Alta | La API con token de A devuelve cero filas de B | **PASSED** | Claude Code | — |
| CP-EXP-021 | Media | Categoría archivada sale con el nombre actual | **PASSED** | Claude Code | — |
| CP-EXP-022 | Media | Un ingreso exporta categoría vacía | **PASSED** | Claude Code | — |
| CP-EXP-023 | Alta | Un doble click inicia una sola descarga | **PASSED** | Claude Code | — |
| CP-EXP-024 | Media | Un mes sin transacciones muestra Vacío | **PASSED** | Claude Code | — |
| CP-EXP-025 | Alta | Offline muestra el error exacto | **PASSED** | Claude Code | — |
| CP-EXP-026 | Alta | El reintento después de Offline descarga completo | **PASSED** | Claude Code | — |
| CP-EXP-027 | Baja | Tocar fuera cierra sin descargar | **FAILED** | Claude Code | DEF-030 |
| CP-EXP-028 | Media | Atrás cierra la hoja inicial | **FAILED** | Claude Code | DEF-031 |
| CP-EXP-029 | Alta | Atrás durante Exportando cancela la descarga | **FAILED** | Claude Code | DEF-032 |
| CP-EXP-030 | Alta | Una alta concurrente impide descargar un año incompleto | **PASSED** | Claude Code | — |
| CP-EXP-031 | Alta | HTTP 500 muestra Error y no descarga | **PASSED** | Claude Code | — |
| CP-IMP-001 | Media | El acceso desde Registrar abre el paso Archivo | **PASSED** | Claude Code | — |
| CP-IMP-002 | Media | A1 rechaza la extensión .xls | **PASSED** | Claude Code | — |
| CP-IMP-003 | Media | A2 rechaza 1.048.577 bytes | **PASSED** | Claude Code | — |
| CP-IMP-004 | Media | A3 rechaza un archivo dañado con extensión xlsx | **PASSED** | Claude Code | — |
| CP-IMP-005 | Media | A4 enumera tres encabezados obligatorios faltantes | **PASSED** | Claude Code | — |
| CP-IMP-006 | Media | A7 rechaza 501 filas con datos | **PASSED** | Claude Code | — |
| CP-IMP-007 | Media | El límite de filas acepta exactamente 500 | **PASSED** | Claude Code | — |
| CP-IMP-008 | Media | Los encabezados aceptan orden, mayúsculas, espacios y tildes distintos | **PASSED** | Claude Code | — |
| CP-IMP-009 | Media | F1: fecha vacía | **PASSED** | Claude Code | — |
| CP-IMP-010 | Media | F2: fecha inexistente | **PASSED** | Claude Code | — |
| CP-IMP-011 | Media | F3: fecha futura fija | **PASSED** | Claude Code | — |
| CP-IMP-012 | Media | F5: tipo inválido | **PASSED** | Claude Code | — |
| CP-IMP-013 | Media | F7: monto no numérico | **PASSED** | Claude Code | — |
| CP-IMP-014 | Alta | F8: monto cero | **PASSED** | Claude Code | — |
| CP-IMP-015 | Media | F9: monto con tres decimales | **PASSED** | Claude Code | — |
| CP-IMP-016 | Media | F12: moneda EUR | **PASSED** | Claude Code | — |
| CP-IMP-017 | Media | F13a: USD sin tipo de cambio | **PASSED** | Claude Code | — |
| CP-IMP-018 | Media | F13b: ARS con tipo de cambio | **PASSED** | Claude Code | — |
| CP-IMP-019 | Media | F14b: categoría inexistente | **PASSED** | Claude Code | — |
| CP-IMP-020 | Media | F14d: cuenta inexistente | **PASSED** | Claude Code | — |
| CP-IMP-021 | Media | F14e: trece cuotas | **PASSED** | Claude Code | — |
| CP-IMP-022 | Media | F15: cuotas en cuenta no crédito | **PASSED** | Claude Code | — |
| CP-IMP-023 | Media | Errores de varias columnas conservan el orden de reglas | **PASSED** | Claude Code | — |
| CP-IMP-024 | Media | Nombres, tipo y moneda aceptan espacios y mayúsculas | **FAILED** | Claude Code | DEF-033 |
| CP-IMP-025 | Media | Categoría archivada no se acepta aunque el nombre coincida | **PASSED** | Claude Code | — |
| CP-IMP-026 | Media | El texto 1.500 se interpreta como mil quinientos | **PASSED** | Claude Code | — |
| CP-IMP-027 | Alta | El resumen del archivo de ejemplo suma solo las siete filas listas | **PASSED** | Claude Code | — |
| CP-IMP-028 | Media | El filtro muestra solo las cuatro filas con error | **PASSED** | Claude Code | — |
| CP-IMP-029 | Media | Cero filas listas deshabilita Importar 0 movimientos | **PASSED** | Claude Code | — |
| CP-IMP-030 | Alta | Confirmar importa solo las filas listas con todos sus campos | **PASSED** | Claude Code | — |
| CP-IMP-031 | Alta | La compra de 240.000 en seis cuotas crea seis imputaciones exactas | **PASSED** | Claude Code | — |
| CP-IMP-032 | Alta | Un rechazo tardío de categoría no impide las otras filas | **PASSED** | Claude Code | — |
| CP-IMP-033 | Alta | Quinientas filas de doce cuotas terminan en menos de diez segundos | **PASSED** | Claude Code | — |
| CP-IMP-034 | Alta | La RPC procesa una válida y rechaza tres inválidas | **PASSED** | Claude Code | — |
| CP-IMP-035 | Alta | La RPC rechaza un lote de 501 elementos | **PASSED** | Claude Code | — |
| CP-IMP-036 | Alta | El rol anon no puede ejecutar import_transactions | **PASSED** | Claude Code | — |
| CP-IMP-037 | Alta | Otro usuario no ve transacciones ni imports ajenos | **PASSED** | Claude Code | — |
| CP-IMP-038 | Alta | Reintento tras respuesta perdida reconoce lo guardado | **PASSED** | Claude Code | — |
| CP-IMP-039 | Alta | Dos llamadas API con el mismo import_id son idempotentes | **PASSED** | Claude Code | — |
| CP-IMP-040 | Alta | Sin respuesta conserva Revisión | **PASSED** | Claude Code | — |
| CP-IMP-041 | Alta | Sesión vencida ofrece volver a entrar | **PASSED** | Claude Code | — |
| CP-SUS-001 | Alta | Dar de alta una suscripción en ARS desde hace 2 meses con día de cobro 10 genera los 2 gastos vencidos al guardar | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-002 | Media | Dar de alta una suscripción en ARS desde el mes siguiente no genera gastos al guardar | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-003 | Media | Dar de alta una suscripción con el mismo nombre que una suscripción cancelada se acepta | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-004 | Media | Rechazar en UI el alta de suscripción con Nombre vacío o solo espacios | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-005 | Media | Rechazar en API `create_subscription` con Nombre vacío o solo espacios | **PASSED** | Claude Code | — |
| CP-SUS-006 | Alta | Rechazar en UI el alta de suscripción con Nombre igual al de otra activa sin distinguir mayúsculas ni espacios (`" netflix "`) | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-007 | Alta | Rechazar en API `create_subscription` con Nombre igual al de otra activa (`" netflix "`) | **PASSED** | Claude Code | — |
| CP-SUS-008 | Alta | Rechazar en UI el alta de suscripción con Monto igual a `"0"` | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-009 | Alta | Rechazar en API `create_subscription` con `p_amount = "0.00"` | **PASSED** | Claude Code | — |
| CP-SUS-010 | Media | Rechazar en API `create_subscription` en ARS con Monto mayor al máximo (`"1000000000000.00"`) | **PASSED** | Claude Code | — |
| CP-SUS-011 | Media | Rechazar en API `create_subscription` con `p_category_id = null` | **PASSED** | Claude Code | — |
| CP-SUS-012 | Media | Rechazar en API `create_subscription` con `p_billing_day = 32` | **PASSED** | Claude Code | — |
| CP-SUS-013 | Media | Rechazar en API `create_subscription` con Mes de inicio anterior al límite inferior (`-25` meses) | **PASSED** | Claude Code | — |
| CP-SUS-014 | Media | Rechazar en API `create_subscription` con `p_end_period < p_start_period` | **PASSED** | Claude Code | — |
| CP-SUS-015 | Baja | Rechazar en API `create_subscription` con Descripción de 201 caracteres | **PASSED** | Claude Code | — |
| CP-SUS-016 | Media | Rechazar en API `create_subscription` con `p_category_id` propia archivada | **PASSED** | Claude Code | — |
| CP-SUS-017 | Alta | Rechazar en API `create_subscription` usando `p_category_id` de otro usuario | **PASSED** | Claude Code | — |
| CP-SUS-018 | Alta | Rechazar en API un `INSERT` directo sobre `/rest/v1/subscriptions` con la sesión del usuario | **PASSED** | Claude Code | — |
| CP-SUS-019 | Media | Dos toques seguidos en `"Guardar suscripción"` deshabilitan el botón y crean una sola suscripción | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-020 | Alta | Rechazar en UI ver el detalle de una suscripción de otro usuario mostrando `subscription-detail-not-found` | **PASSED** | Claude Code | — |
| CP-SUS-021 | Alta | Rechazar en API leer una suscripción de otro usuario (`GET /rest/v1/subscriptions` devuelve `[]`) | **PASSED** | Claude Code | — |
| CP-SUS-022 | Alta | Rechazar en API `create_subscription` sin sesión autenticada (rol `anon`) | **FAILED** | Claude Code | DEF-035 |
| CP-SUS-023 | Baja | Mostrar estado vacío `subscriptions-empty` y ocultar la tarjeta del total comprometido cuando el usuario no tiene suscripciones | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-024 | Alta | Puesta al día automática al entrar a la app genera 2 períodos vencidos pendientes y muestra el aviso `app-catchup-generated` | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-025 | Alta | Dos llamadas consecutivas por API a `run_subscription_catchup` responden `200 OK` sin error y dejan exactamente 1 transacción por período | **PASSED** | Claude Code | — |
| CP-SUS-026 | Alta | Suscripción en estado `paused` no genera ocurrencias al ejecutar `run_subscription_catchup` | **PASSED** | Claude Code | — |
| CP-SUS-027 | Alta | Suscripción con día de cobro `31` entre `2026-01` y `2026-04` genera ocurrencias con fechas `31/01/2026`, `28/02/2026`, `31/03/2026` y `30/04/2026` | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-028 | Alta | Suscripción con día de cobro `<DIA_MAÑANA>` no genera la ocurrencia del mes corriente | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-029 | Alta | Suscripción con día de cobro igual a `<DIA_HOY>` genera la ocurrencia del mes corriente | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-030 | Alta | Pausar suscripción activa con día de cobro `28` (`> <DIA_HOY>`) muestra advertencia de este mes y pasa a `"Pausada desde <HOY>"` con piso en `<MES_SIGUIENTE>` | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-031 | Alta | `pause_subscription` por API ejecuta primero la puesta al día y genera los meses vencidos pendientes antes de pausar | **PASSED** | Claude Code | — |
| CP-SUS-032 | Alta | Rechazar en API `pause_subscription` usando la sesión de otro usuario (`404 P0002`) | **FAILED** | Claude Code | DEF-034 |
| CP-SUS-033 | Alta | Reanudar suscripción pausada abre `resume-subscription-dialog`, pasa a `"Activa"`, limpia `paused_at`, conserva `generate_from_period = '<MES_SIGUIENTE>-01'` y no genera el mes actual | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-034 | Alta | Cancelar suscripción activa con 4 gastos cargados mantiene el historial en el Detalle y en el Resumen y oculta los botones de acción | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-035 | Alta | Editar el monto de una suscripción activa de `$5.000,00` a `$7.000,00` conserva las 4 ocurrencias ya generadas en `$5.000,00` y muestra Moneda y Mes de inicio como solo lectura | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-036 | Media | Rechazar en API `update_subscription` con `p_end_period` anterior al período corriente (`<MES_ANTERIOR>-01`) | **PASSED** | Claude Code | — |
| CP-SUS-037 | Alta | Rechazar en UI renombrar una suscripción poniéndole el nombre de otra suscripción activa del mismo usuario | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-038 | Media | Rechazar en UI editar una suscripción cancelada al navegar directo a `/subscriptions/<SUB_ID>/edit` | **PASSED** | Claude Code | — |
| CP-SUS-039 | Media | Rechazar en API cambiar `p_category_id` en `update_subscription` a otra categoría archivada distinta de la actual | **PASSED** | Claude Code | — |
| CP-SUS-040 | Alta | Eliminar desde Movimientos la ocurrencia de `<MES_ANTERIOR>` muestra `delete-transaction-subscription-note`, figura con `"Eliminado"` en el Detalle y no vuelve a crearse al recargar | **PASSED** | Claude Code | — |
| CP-SUS-041 | Alta | Mostrar la marca de suscripción en Movimientos y en `"Últimos movimientos"` del Resumen (y no en un gasto manual) y navegar al Detalle al tocarla | **PASSED** | Claude Code | — |
| CP-SUS-042 | Alta | La ocurrencia generada de una suscripción suma en `"Gastado en <mes corto>"` y resta en `"Balance"` del Resumen de V1 | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-043 | Alta | Suscripción activa en USD con tipo de cambio en `<MES_HACE_2>` y sin tipo de cambio en `<MES_ANTERIOR>` genera solo `<MES_HACE_2>`, muestra `"Falta tipo de cambio"` y el botón `"Cargar tipo de cambio"` navega a `/settings?period=<MES_ANTERIOR>` | **PASSED** | Claude Code | — |
| CP-SUS-044 | Alta | Con dos suscripciones activas en ARS (`$5.000,00` y `$2.500,00`), el total mensual comprometido muestra `"$7.500,00"` y `"2 suscripciones activas este mes"` | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-045 | Alta | Suscripción activa en `USD 10,00` con tipo de cambio del período corriente `1.250,00` suma `"$12.500,00"` al total mensual comprometido | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-046 | Media | Una suscripción en estado `paused` no suma al total mensual comprometido (`"$0,00"` y `"No tenés suscripciones activas este mes"`) | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-047 | Alta | Vista previa en `/subscriptions/new` con `$5.000,00` ARS, día `28` (`> <DIA_HOY>`), desde `<MES_HACE_2>` y sin fin muestra 2 meses en `"Se cargan al guardar"`, 3 en `"Próximos cobros"`, resumen de `"$10.000,00"` y al guardar crea exactamente esas 2 transacciones | **PASSED** | Claude Code | — |
| CP-SUS-048 | Alta | Vista previa en `/subscriptions/new` en USD con tipo de cambio en `<MES_HACE_2>` y sin tipo de cambio en `<MES_ANTERIOR>` marca `<MES_ANTERIOR>` con `data-blocked="true"` y no lo cuenta en el resumen | **FAILED** | Claude Code | DEF-036 |

## Resumen

| Status | Casos |
|---|---|
| PASSED | 178 |
| FAILED | 8 |
| DUDA (pasa, con dudas) | 0 |
| BLOCKED | 3 |
| No ejecutados | 0 |
| **Total** | **189** |

Por módulo:

| Módulo | Casos | PASSED | FAILED | DUDA | BLOCKED | No ejecutados |
|---|---|---|---|---|---|---|
| Deudas (DEU) | 44 | 40 | 1 | 0 | 3 | 0 |
| Navegación (NAV) | 25 | 25 | 0 | 0 | 0 | 0 |
| Exportar CSV (EXP) | 31 | 28 | 3 | 0 | 0 | 0 |
| Importar Excel (IMP) | 41 | 40 | 1 | 0 | 0 | 0 |
| Suscripciones (SUS) | 48 | 45 | 3 | 0 | 0 | 0 |

## Detalle de los casos que no son PASSED

### CP-DEU-024 — En /debts/new con US$, Monto = 0,01 y TC = 0,5 se acepta (redondeo half-up a $0,01) y guarda amount_ars = "0.01" · **FAILED**

**Esperado:** Se muestra `data-testid="debt-form-fx-ars-equivalent"` con `"≈ $0,01"` y se habilita "Guardar deuda". Aparece `"Deuda guardada"` y se abre `/debts?status=pending`. Devuelve 1 fila con `amount_text = "0.01"`, `fx_rate_text = "0.5000"` y `amount_ars_text = "0.01"`.

**Obtenido:** Paso 6: el primer clic en «US$» no selecciona la moneda (se pierde porque al salir del foco de «Persona» aparece el error y corre los botones); con un segundo clic el resto del caso se cumple: ≈ $0,01 y se guarda amount 0.01, fx_rate 0.5000 y amount_ars 0.01 — Observado en la corrida — Paso 6: tras el primer clic en «US$», el campo «Tipo de cambio» NO aparece (el clic se perdió: al salir del foco de «Persona» aparece «Ingresá el nombre de la persona» y los botones se corren hacia abajo) Con un segundo clic en «US$» el campo «Tipo de cambio» aparece

**Informe previo del equipo:** Hasta el paso 7 ok; el 8 no sabe cómo testear.

**Defectos:** DEF-037

**Notas:** Ver DEF-037. Con un segundo clic en «US$» el resto del caso se cumple.

### CP-DEU-055 — Gasto compartido con varias personas: agregar, quitar y guardar · **BLOCKED**

**Esperado:** Se abre el paso 2 de 3. Se abre el paso 3 de 3. El campo de fecha muestra 15/08/2026. Aparece 1 sola fila vacía, sin botón «Quitar»; debajo se ven los botones «Agregar persona» y «Dividir en partes iguales». La fila 1 muestra Sofía y 40000. Se agrega la fila 2 vacía al final, el cursor queda en «¿Con quién?» de la fila 2 y aparece el botón «Quitar» en las dos filas. El resumen muestra «Te van a deber $80.000,00 entre 2 personas · Tu parte: $40.000,00». Aparece el aviso «Gasto guardado» con la descripción «Juan y Sofía te deben $80.000,00». La fila del gasto muestra la etiqueta «Compartido con Juan y Sofía». En «Últimos movimientos», la fila del gasto muestra «Compartido con Juan y Sofía».

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-056 — Se puede compartir con hasta 10 personas · **BLOCKED**

**Esperado:** Se abre el paso 2 de 3. Se abre el paso 3 de 3. El campo de fecha muestra 15/08/2026. Aparece la fila 1. Hay 10 filas, el botón «Agregar persona» está deshabilitado (disabled), y aparece el texto exacto «Podés compartir un gasto con hasta 10 personas». Aparece el aviso «Gasto guardado» con la descripción exacta «Persona 01, Persona 02, Persona 03, Persona 04, Persona 05, Persona 06, Persona 07, Persona 08, Persona 09 y Persona 10 te deben $100.000,00».

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-057 — Por API, deudas que suman más que el gasto se rechazan · **BLOCKED**

**Esperado:** Responde 400 con el código 23514 y «I7: la suma de las deudas no puede superar el monto del gasto»; no se crea nada.

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada» en vez del rechazo esperado). Observado: 400 con 23514 y «I7: la suma de las deudas no puede superar el monto del gasto» (obtenido: 404 PGRST202 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_o.

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-EXP-027 — Tocar fuera cierra sin descargar · **FAILED**

**Esperado:** Se abre la hoja. La hoja se cierra, no se descarga archivo y la URL conserva D1.

**Obtenido:** FALLA. Un clic sobre el fondo oscuro, fuera de la hoja, no la cierra: el clic lo recibe el `div` de fondo (`aria-hidden`), que es hijo del contenedor, y el controlador exige que el destino del clic sea el propio contenedor. La hoja sigue abierta. — Observado en la corrida — Descarga: ninguna Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV» Falla detectada: tocar fuera NO cierra la hoja (el click cae en el div de fondo aria-hidden, no en el contenedor)

**Defectos:** DEF-030

### CP-EXP-028 — Atrás cierra la hoja inicial · **FAILED**

**Esperado:** Se abre la hoja fijada a septiembre. La hoja se cierra, la URL pasa a `?period=2026-08` y no se descarga archivo.

**Obtenido:** FALLA. Con la hoja abierta, «Atrás» cambia la URL a `?period=2026-08` (el evento `popstate` se dispara) pero la hoja sigue abierta. — Observado en la corrida — Pantalla final: /transactions?period=2026-08 · hoja abierta · botón «Descargar CSV» Falla detectada: la URL pasó a 2026-08 pero la hoja sigue abierta

**Defectos:** DEF-031

### CP-EXP-029 — Atrás durante Exportando cancela la descarga · **FAILED**

**Esperado:** Se abre la hoja. Se ve "Exportando…". La hoja se cierra y la URL pasa a agosto. No aparece ningún archivo ni aviso de éxito.

**Obtenido:** FALLA. «Atrás» durante «Exportando…» no cancela la exportación: cuando termina la lectura se descarga el archivo y aparece el aviso «Exportamos 1 movimiento», con el usuario ya en el mes anterior. — Observado en la corrida — Pantalla final: /transactions?period=2026-08 · hoja cerrada · aviso: «Exportamos 1 movimiento» Falla detectada: Atrás durante Exportando no cancela: descargas=1, avisos de éxito=1

**Defectos:** DEF-032

### CP-IMP-024 — Nombres, tipo y moneda aceptan espacios y mayúsculas · **FAILED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. `Fila 2` está `Lista`; muestra `Gasto`, `US$10,00`, `Educación`, `Efectivo` y `TC 1.450,00`.

**Obtenido:** Fila 2 Lista 01/09/2026 · Gasto · educación · efectivo · TC 1.450,00 US$10,00

**Defectos:** DEF-033

### CP-SUS-022 — Rechazar en API `create_subscription` sin sesión autenticada (rol `anon`) · **FAILED**

**Esperado:** Respuesta HTTP `403 Forbidden` con `"code": "42501"` (`permission denied for function create_subscription`).

**Obtenido:** esperado HTTP 403 42501; obtenido HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function create_subscription"} (el código 42501 coincide; cambia el HTTP: la API responde 401 al rol anon) — Observado en la corrida — HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function create_subscription"}

**Informe previo del equipo:** No sabe cómo testearlo.

**Defectos:** DEF-035

### CP-SUS-032 — Rechazar en API `pause_subscription` usando la sesión de otro usuario (`404 P0002`) · **FAILED**

**Esperado:** Respuesta HTTP `404 Not Found` con `"code": "P0002"` y `"message": "Suscripción no encontrada"`. Respuesta HTTP `200 OK` con `[{"status":"active","paused_at":null}]`.

**Obtenido:** esperado HTTP 404 P0002 «Suscripción no encontrada»; obtenido HTTP 500 {"code":"P0002","details":null,"hint":null,"message":"Suscripción no encontrada"} — Observado en la corrida — HTTP 500 {"code":"P0002","details":null,"hint":null,"message":"Suscripción no encontrada"}

**Informe previo del equipo:** No sabe cómo testearlo.

**Defectos:** DEF-034

### CP-SUS-048 — Vista previa en `/subscriptions/new` en USD con tipo de cambio en `<MES_HACE_2>` y sin tipo de cambio en `<MES_ANTERIOR>` marca `<MES_ANTERIOR>` con `data-blocked="true"` y no lo cuenta en el resumen · **FAILED**

**Esperado:** Se abre `/subscriptions`. Se abre `/subscriptions/new`. La moneda queda seleccionada en `"USD"`. El campo muestra `20`. El campo muestra `28`. En `"Se cargan al guardar"` (`subscription-form-preview-due`), la fila `subscription-form-preview-due-item` con `data-period="<MES_HACE_2>"` tiene `data-blocked="false"`, la fila con `data-period="<MES_ANTERIOR>"` tiene `data-blocked="true"` y muestra `"Sin tipo de cambio: se carga cuando lo cargues"`, y el resumen (`subscription-form-preview-summary`) dice `"Al guardar se carga 1 gasto de USD 20,00."`.

**Obtenido:** la fila de 2026-08 no tiene data-blocked="false" (el atributo está ausente; solo se escribe cuando la fila está bloqueada) — Observado en la corrida — 2026-08: data-blocked=null; 2026-09: data-blocked=true; texto «septiembre 2026 · 28/09/2026 Sin tipo de cambio: se carga cuando lo cargues»; resumen: Al guardar se carga 1 gasto de USD 20,00.

**Informe previo del equipo:** No especifica los pasos correctamente.

**Defectos:** DEF-036


## Resultado obtenido de los casos que ejecutó Claude Code

| Caso | Status | Obtenido |
|---|---|---|
| CP-DEU-015 | PASSED | Coincide con el resultado esperado. Se verificó: Devuelve 1 fila intacta con person = "Sofía", status = "pending", settled_at = null, amount_text = "60000.00" y transaction_id = "<TX_ID>". — Observado en la corrida — adaptación: US-82 (varias personas) no existe; se preparó con p_shared_person y p_shared_amount de una persona |
| CP-DEU-016 | PASSED | Coincide con el resultado esperado. Se verificó: Devuelve 1 fila con status = "settled" y settled_at exactamente igual a <SETTLED_AT>. — Observado en la corrida — adaptación: US-82 (varias personas) no existe; se preparó con p_shared_person y p_shared_amount de una persona |
| CP-DEU-017 | PASSED | Coincide con el resultado esperado. Se verificó: Devuelve 1 fila con person = "Juan", direction = "owed_to_me", status = "pending", currency = "ARS", fx_rate = null, amount_text = "20000.00", amount_ars_text = "20000.00", incurred_on = "<HOY>", notes = null y transaction_id = null. — Observado en la corrida — Estado inicial: {"dir":"true","persona":"","foco":"debt-form-person","monto":"","ars":"true","fxEnDom":0,"fecha":"2026-10-27","nota":"","submitOff":true,"cancel":1} |
| CP-DEU-019 | PASSED | Coincide con el resultado esperado. Se verificó: Devuelve 1 fila con currency = "USD", amount_text = "40.00", fx_rate_text = "1250.0000" y amount_ars_text = "50000.00". — Observado en la corrida — TC sugerido: «1.250,00» |
| CP-DEU-023 | PASSED | Coincide con el resultado esperado. Se verificó: Aparece data-testid="debt-form-amount-error" con el texto exacto "El monto admite hasta 2 decimales", y "Guardar deuda" queda deshabilitado. — Observado en la corrida — error: «El monto admite hasta 2 decimales»; Guardar deuda deshabilitado |
| CP-DEU-024 | FAILED | Paso 6: el primer clic en «US$» no selecciona la moneda (se pierde porque al salir del foco de «Persona» aparece el error y corre los botones); con un segundo clic el resto del caso se cumple: ≈ $0,01 y se guarda amount 0.01, fx_rate 0.5000 y amount_ars 0.01 — Observado en la corrida — Paso 6: tras el primer clic en «US$», el campo «Tipo de cambio» NO aparece (el clic se perdió: al salir del foco de «Persona» aparece «Ingresá el nombre de la persona» y los botones se corren hacia abajo) Con un segundo clic en «US$» el campo «Tipo de cambio» aparece |
| CP-DEU-026 | PASSED | Coincide con el resultado esperado. Se verificó: Debajo de "Fecha" aparece data-testid="debt-form-date-error" con el texto exacto "La fecha no puede ser futura", y el botón "Guardar deuda" queda deshabilitado (disabled). — Observado en la corrida — fecha 2026-10-28; error: «La fecha no puede ser futura» |
| CP-DEU-027 | PASSED | Coincide con el resultado esperado. Se verificó: Devuelve []. — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"Ingresá el nombre de la persona"} |
| CP-DEU-028 | PASSED | Coincide con el resultado esperado. Se verificó: Devuelve []. — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"La persona admite hasta 60 caracteres"} |
| CP-DEU-029 | PASSED | Coincide con el resultado esperado. Se verificó: Devuelve []. — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"I4: el monto debe ser mayor a cero"} |
| CP-DEU-030 | PASSED | Coincide con el resultado esperado. Se verificó: Devuelve []. — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"I4: el monto admite hasta 2 decimales"} |
| CP-DEU-031 | PASSED | Coincide con el resultado esperado. Se verificó: Devuelve []. — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"I5: fx_rate es obligatorio si y solo si la moneda es USD"} |
| CP-DEU-032 | PASSED | Coincide con el resultado esperado. Se verificó: Devuelve []. — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"I5: fx_rate es obligatorio si y solo si la moneda es USD"} |
| CP-DEU-033 | PASSED | Coincide con el resultado esperado. Se verificó: Devuelve []. — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"La fecha no puede ser posterior a hoy"} |
| CP-DEU-034 | PASSED | Coincide con el resultado esperado. Se verificó: Responde HTTP 401 o 403 con code = "42501" (permission denied for function create_debt). — Observado en la corrida — HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function create_debt"} |
| CP-DEU-035 | PASSED | Coincide con el resultado esperado. Se verificó: Devuelve []. — Observado en la corrida — HTTP 403 {"code":"42501","details":null,"hint":"Grant the required privileges to the current role with: GRANT INSERT ON public.debts TO authenticated;","message":"permission denied for table debts"} |
| CP-DEU-040 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-041 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-042 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-043 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-044 | PASSED | La respuesta de la API coincide con la esperada. |
| CP-DEU-045 | PASSED | La respuesta de la API coincide con la esperada. |
| CP-DEU-046 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-047 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-048 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-049 | PASSED | La respuesta de la API coincide con la esperada y no se creó ni cambió nada. |
| CP-DEU-050 | PASSED | La respuesta de la API coincide con la esperada y no se creó ni cambió nada. |
| CP-DEU-051 | PASSED | La respuesta de la API coincide con la esperada y no se creó ni cambió nada. |
| CP-DEU-052 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-053 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-054 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-055 | BLOCKED | La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe). |
| CP-DEU-056 | BLOCKED | La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe). |
| CP-DEU-057 | BLOCKED | La función de varias personas (US-82, issue #270) no existe todavía: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada» en vez del rechazo esperado). Observado: 400 con 23514 y «I7: la suma de las deudas no puede superar el monto del gasto» (obtenido: 404 PGRST202 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_o. |
| CP-DEU-058 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-059 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-060 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-061 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-NAV-005 | PASSED | A 1023 px la barra está fija abajo (ancho completo, 57 px de alto), no hay barra lateral y se ve el engranaje de Ajustes arriba. |
| CP-NAV-006 | PASSED | A 1024 px hay una única barra lateral fija de 240 px con los cuatro ítems y «Ajustes» al pie; no hay barra inferior ni engranaje. |
| CP-NAV-007 | PASSED | La consola devolvió exactamente [1,1,1,1,1] en Registrar a 375 px: los cinco identificadores aparecen una vez, ninguno repetido. |
| CP-NAV-014 | PASSED | Con latencia de 20.000 ms y 1000 kb/s, el botón dijo «Guardando…», quedó deshabilitado y la pantalla ocupada; el error apareció a los 15,3 s, con el texto de conexión, el aviso de red y el botón «Reintentar». |
| CP-NAV-015 | PASSED | Con el gasto ya creado por API con la clave fija, el fallo sin internet y «Reintentar» mostraron «Gasto guardado» con «$12.500,00 · Comida · Visa BBVA». En Movimientos hay una sola fila de $12.500,00 y la API tiene una sola transacción, activa. |
| CP-NAV-016 | PASSED | Dos pedidos con la misma clave devolvieron 200 y el mismo identificador; hay una transacción y una cuota (imputación). |
| CP-NAV-017 | PASSED | Dos pedidos simultáneos con la misma clave devolvieron 200 y el mismo identificador, sin el código 23505; hay una transacción y una cuota. (Los dos pedidos se lanzaron a la vez con una barrera en Node, equivalente al script de PowerShell del caso original.) |
| CP-NAV-018 | PASSED | La misma clave de dos usuarios creó un gasto para cada uno, con identificadores distintos y el user_id de cada usuario. |
| CP-NAV-020 | PASSED | Con la categoría archivada, el pedido respondió 409 con code 23503 y «la categoría no existe, no es tuya o está archivada»; transacciones y cuotas quedaron en []. |
| CP-NAV-022 | PASSED | «Recuperar» mostró «Ese movimiento ya estaba guardado» con «$12.500,00 · Comida · Visa BBVA»; la fila pendiente desapareció y el formulario quedó vacío en el paso 1. La API sigue con una sola transacción activa. |
| CP-EXP-001 | PASSED | La hoja abre con «Solo septiembre 2026» elegido, «Todo 2026» visible, «Descargar CSV» y «Cancelar» habilitados y el texto fijo sobre activos y cuotas anteriores. — Observado en la corrida — Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV» |
| CP-EXP-002 | PASSED | Mes futuro (2026-11): «Exportar» deshabilitado, aparece «Solo podés exportar el mes actual o meses anteriores.», no abre ninguna hoja y la URL no cambia. — Observado en la corrida — Pantalla final: /transactions?period=2026-11 · hoja cerrada · aviso: «Solo podés exportar el mes actual o meses anteriores.» |
| CP-EXP-003 | PASSED | Descarga `biyu-movimientos-2026-09.csv` con una fila de datos cuyo id es el de la transacción creada. — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 217 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,1500.00,ARS,,1500.00,Otros,Efectivo,1,2026-09,Almuerzo,3beeb9fe-67fe-4028-aef8-ac57768be4c1 Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-004 | PASSED | El borde del período se incluye: una sola fila con la fecha límite y el id esperado. — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 207 bytes · 1 fila(s) de datos · fila 1: 2026-09-01,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,,4ac02c5d-66b5-4d37-8291-83577c5fc6e2 Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-005 | PASSED | El día fuera del período se excluye: no se descarga archivo, la hoja queda abierta y aparece el mensaje exacto de período vacío. — Observado en la corrida — Descarga: ninguna Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV» · mensaje: «No tenés movimientos con fecha en septiembre 2026.» |
| CP-EXP-006 | PASSED | El borde del período se incluye: una sola fila con la fecha límite y el id esperado. — Observado en la corrida — Descarga: biyu-movimientos-2025.csv · 207 bytes · 1 fila(s) de datos · fila 1: 2025-01-01,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2025-01,,95bf1454-0704-45f9-b3ca-a7109f4fdc4b Pantalla final: /transactions?period=2025-06 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-007 | PASSED | El día fuera del período se excluye: no se descarga archivo, la hoja queda abierta y aparece el mensaje exacto de período vacío. — Observado en la corrida — Descarga: ninguna Pantalla final: /transactions?period=2025-06 · hoja abierta · botón «Descargar CSV» · mensaje: «No tenés movimientos con fecha en 2025.» |
| CP-EXP-008 | PASSED | La transacción eliminada no sale: no se descarga archivo y aparece el mensaje de período vacío. — Observado en la corrida — Descarga: ninguna Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV» · mensaje: «No tenés movimientos con fecha en septiembre 2026.» |
| CP-EXP-009 | PASSED | Los primeros tres bytes del archivo son `EF BB BF`. — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 207 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,,516cde3a-ba46-47ad-8bc7-c5938c12560e Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-010 | PASSED | La primera línea es exactamente `fecha,tipo,monto,moneda,tipo_de_cambio,monto_ars,categoria,cuenta,cuotas,primer_periodo,descripcion,id`. — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 207 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,,8bbc9a3b-2342-46b6-865d-2459a250e613 Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-011 | PASSED | Una sola fila por el total: fecha 2026-08-15, monto 120000.00, cuotas 12, primer_periodo 2026-08 e id esperado (compra en tarjeta de crédito). — Observado en la corrida — Descarga: biyu-movimientos-2026-08.csv · 215 bytes · 1 fila(s) de datos · fila 1: 2026-08-15,gasto,120000.00,ARS,,120000.00,Otros,Visa BBVA,12,2026-08,,1a9244ee-655e-4840-9fb2-c174ea030e49 Pantalla final: /transactions?period=2026-08 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-012 | PASSED | La fila contiene `gasto,1500.00,ARS,,1500.00`; no aparecen `1.500,00`, signo ni `1500` sin decimales. — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 209 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,1500.00,ARS,,1500.00,Otros,Efectivo,1,2026-09,,b08e79d0-3719-428e-aba6-ec49af7e6be2 Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-013 | PASSED | La fila contiene `300.00,USD,1250.5000,375150.00` exacto. — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 219 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,300.00,USD,1250.5000,375150.00,Otros,Efectivo,1,2026-09,,66a7abf3-b3bf-4081-b808-661e26f4a6b1 Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-014 | PASSED | El campo coincide byte a byte con el esperado (coma entrecomillada / comillas internas duplicadas). — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 227 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,"Heladera, 3 cuotas",649a7b38-a67f-4214-974a-9cecea6ada82 Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-015 | PASSED | El campo coincide byte a byte con el esperado (coma entrecomillada / comillas internas duplicadas). — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 230 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,"Pizza ""a la piedra""",f965d5d8-2cbe-4db4-99f0-0e4d7f034cf2 Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-016 | PASSED | La descripción queda neutralizada con un solo apóstrofo delante (y entre comillas si corresponde); coincide con la salida esperada. — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 212 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,'=1+1,1a2752e5-cade-47d0-aa98-be6b6812ae2f Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-017 | PASSED | La categoría `=Categoria QA` sale como `'=Categoria QA`. — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 216 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,'=Categoria QA,Efectivo,1,2026-09,,5013a723-bc9a-4cb5-a0c3-6ae81b0d8d50 Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-018 | PASSED | El CSV trae exactamente N UUID distintos que coinciden con los creados (ninguno falta ni se repite) y el aviso dice «Exportamos N movimientos» con separador de miles. — Observado en la corrida — Descarga: biyu-movimientos-2025.csv · 156107 bytes · 1500 fila(s) de datos · fila 1: 2025-09-15,gasto,1.00,ARS,,1.00,Otros,Efectivo,1,2025-09,EXP-0001,d11874af-4400-4b0f-90b5-274489817464 Pantalla final: /transactions?period=2025-09 · hoja cerrada · aviso: «Exportamos 1.500 movimientos» |
| CP-EXP-019 | PASSED | El CSV del usuario A trae una fila (111.00, SOLO-A, su id) y nada de B (999.00, SOLO-B, id de B). — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 213 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,111.00,ARS,,111.00,Otros,Efectivo,1,2026-09,SOLO-A,b007657f-13b0-434a-9080-0d5a61601302 Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-020 | PASSED | Con el token de A, la lectura de `transactions` filtrada por el id de B responde HTTP 200 con `[]`; sin filtro, A ve 0 filas. — Observado en la corrida — API con token de A: GET transactions?id=eq.<ID-B> → HTTP 200, []; GET transactions (sin filtro) → 0 filas Pantalla final: /register · hoja cerrada |
| CP-EXP-021 | PASSED | La categoría archivada sale con el nombre actual `Viajes 2026`. — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 213 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Viajes 2026,Efectivo,1,2026-09,,5ec7ca84-dceb-45b6-bde5-711d1cb0472a Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-022 | PASSED | Un ingreso exporta `tipo=ingreso` y `categoria` vacía (campo vacío entre dos comas). — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 219 bytes · 1 fila(s) de datos · fila 1: 2026-09-01,ingreso,850000.00,ARS,,850000.00,,Billetera virtual,1,2026-09,,9c1820e1-04c4-4e4a-91fc-69f3f1598e4a Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-023 | PASSED | Un doble clic rápido genera una sola descarga y un solo aviso «Exportamos 1 movimiento». — Observado en la corrida — Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-024 | PASSED | Un mes sin transacciones muestra el mensaje de Vacío; al elegir «Todo 2026» queda elegido y el mensaje mensual desaparece. — Observado en la corrida — Descarga: ninguna Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV» |
| CP-EXP-025 | PASSED | Sin conexión: no se descarga archivo, aparece (con `role="alert"`) «No pudimos exportar tus movimientos. Probá de nuevo.» y alcances, «Descargar CSV» y «Cancelar» quedan habilitados. — Observado en la corrida — Descarga: ninguna Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV» · error: «No pudimos exportar tus movimientos. Probá de nuevo.» |
| CP-EXP-026 | PASSED | Al volver la conexión y reintentar, el error desaparece, se descarga el archivo con los dos ids una vez cada uno y aparece «Exportamos 2 movimientos». — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 307 bytes · 2 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,,00ea166a-1fbd-4118-928c-e941969f1ab4 Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 2 movimientos» |
| CP-EXP-027 | FAILED | FALLA. Un clic sobre el fondo oscuro, fuera de la hoja, no la cierra: el clic lo recibe el `div` de fondo (`aria-hidden`), que es hijo del contenedor, y el controlador exige que el destino del clic sea el propio contenedor. La hoja sigue abierta. — Observado en la corrida — Descarga: ninguna Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV» Falla detectada: tocar fuera NO cierra la hoja (el click cae en el div de fondo aria-hidden, no en el contenedor) |
| CP-EXP-028 | FAILED | FALLA. Con la hoja abierta, «Atrás» cambia la URL a `?period=2026-08` (el evento `popstate` se dispara) pero la hoja sigue abierta. — Observado en la corrida — Pantalla final: /transactions?period=2026-08 · hoja abierta · botón «Descargar CSV» Falla detectada: la URL pasó a 2026-08 pero la hoja sigue abierta |
| CP-EXP-029 | FAILED | FALLA. «Atrás» durante «Exportando…» no cancela la exportación: cuando termina la lectura se descarga el archivo y aparece el aviso «Exportamos 1 movimiento», con el usuario ya en el mes anterior. — Observado en la corrida — Pantalla final: /transactions?period=2026-08 · hoja cerrada · aviso: «Exportamos 1 movimiento» Falla detectada: Atrás durante Exportando no cancela: descargas=1, avisos de éxito=1 |
| CP-EXP-030 | PASSED | Con 1.500 transacciones y un alta concurrente de 2,00 con fecha 31/12/2025 durante la lectura: no se descarga archivo, la hoja sigue abierta y aparece el error con `role="alert"`. El alta se hizo por API entre la 1.ª y la 2.ª página, no desde una segunda ventana. — Observado en la corrida — Descarga: ninguna Pantalla final: /transactions?period=2025-09 · hoja abierta · botón «Descargar CSV» · error: «No pudimos exportar tus movimientos. Probá de nuevo.» |
| CP-EXP-031 | PASSED | No se descarga archivo y aparece «No pudimos exportar tus movimientos. Probá de nuevo.» con `role="alert"` (respuesta interceptada con HTTP 500 / monto textual inválido, simulado con una ruta de Playwright en lugar de pegar el código en la consola). — Observado en la corrida — Descarga: ninguna Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV» · error: «No pudimos exportar tus movimientos. Probá de nuevo.» |
| CP-IMP-001 | PASSED | Coincide con el resultado esperado. Se verificó: Existen register-import en el botón usado, import-back, import-steps con data-step="1", import-template-download, import-file-pick, import-file-input e import-file-dropzone. |
| CP-IMP-002 | PASSED | Coincide con el resultado esperado. Se verificó: Se mantiene 1 Archivo; aparece exactamente Solo se aceptan archivos .xlsx (Excel).. |
| CP-IMP-003 | PASSED | Coincide con el resultado esperado. Se verificó: Se mantiene 1 Archivo; aparece exactamente El archivo pesa más de 1 MB. Dividilo en varios archivos.. |
| CP-IMP-004 | PASSED | Coincide con el resultado esperado. Se verificó: Se mantiene 1 Archivo; aparece exactamente No pudimos leer el archivo. Abrilo en Excel, guardalo como .xlsx y probá de nuevo.. |
| CP-IMP-005 | PASSED | Coincide con el resultado esperado. Se verificó: Se mantiene 1 Archivo; aparece exactamente Faltan columnas: Fecha, Monto, Cuenta. La primera fila tiene que tener los encabezados de la plantilla.. |
| CP-IMP-006 | PASSED | Coincide con el resultado esperado. Se verificó: Se mantiene 1 Archivo; aparece exactamente El archivo tiene 501 filas con datos y el máximo es 500. Dividilo en varios archivos.. |
| CP-IMP-007 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; muestra 500 filas leídas · 500 listas para importar · 0 con error. |
| CP-IMP-008 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; muestra 1 fila leída · 1 lista para importar · 0 con error y la tarjeta Fila 2 está Lista. |
| CP-IMP-009 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Falta la fecha; Importar 0 movimientos está deshabilitado. |
| CP-IMP-010 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Fecha inválida: usá DD/MM/AAAA; Importar 0 movimientos está deshabilitado. |
| CP-IMP-011 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente La fecha no puede ser futura; Importar 0 movimientos está deshabilitado. |
| CP-IMP-012 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Tipo inválido: escribí Gasto o Ingreso; Importar 0 movimientos está deshabilitado. |
| CP-IMP-013 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Monto inválido: usá un número, por ejemplo 1234,56; Importar 0 movimientos está deshabilitado. |
| CP-IMP-014 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente El monto debe ser mayor a cero; Importar 0 movimientos está deshabilitado. |
| CP-IMP-015 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente El monto admite hasta 2 decimales; Importar 0 movimientos está deshabilitado. |
| CP-IMP-016 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Moneda inválida: escribí ARS o USD; Importar 0 movimientos está deshabilitado. |
| CP-IMP-017 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Falta el tipo de cambio; Importar 0 movimientos está deshabilitado. |
| CP-IMP-018 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Una transacción en ARS no lleva tipo de cambio; Importar 0 movimientos está deshabilitado. |
| CP-IMP-019 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente No existe la categoría «Mascotas» o está archivada; Importar 0 movimientos está deshabilitado. |
| CP-IMP-020 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente No existe la cuenta «Banco X» o está archivada; Importar 0 movimientos está deshabilitado. |
| CP-IMP-021 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Las cuotas van de 1 a 12; Importar 0 movimientos está deshabilitado. |
| CP-IMP-022 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Solo los gastos con tarjeta de crédito admiten cuotas; Importar 0 movimientos está deshabilitado. |
| CP-IMP-023 | PASSED | Coincide con el resultado esperado. Se verificó: Fila 2 queda Con error; aparecen, en este orden y una vez: Fecha inválida: usá DD/MM/AAAA, El monto debe ser mayor a cero, No existe la cuenta «Banco X» o está archivada. |
| CP-IMP-024 | FAILED | Fila 2 Lista 01/09/2026 · Gasto · educación · efectivo · TC 1.450,00 US$10,00 |
| CP-IMP-025 | PASSED | Coincide con el resultado esperado. Se verificó: Fila 2 muestra exactamente No existe la categoría «Otros» o está archivada. |
| CP-IMP-026 | PASSED | Coincide con el resultado esperado. Se verificó: Fila 2 está Lista y muestra exactamente $1.500,00. |
| CP-IMP-027 | PASSED | Coincide con el resultado esperado. Se verificó: Se ve exactamente Vas a importar 7 movimientos: $324.915,50 en gastos y $850.000,00 en ingresos (en pesos). |
| CP-IMP-028 | PASSED | Coincide con el resultado esperado. Se verificó: Queda encendido; solo se ven Fila 7, Fila 8, Fila 9 y Fila 10. |
| CP-IMP-029 | PASSED | Coincide con el resultado esperado. Se verificó: Se ve Importar 0 movimientos deshabilitado y No hay filas listas para importar. |
| CP-IMP-030 | PASSED | Coincide con el resultado esperado. Se verificó: Existen exactamente las transacciones de filas 2 y 3 con sus nueve campos exactos; descripción de fila 3 es null; no existe transacción para fila 4. |
| CP-IMP-031 | PASSED | Coincide con el resultado esperado. Se verificó: La transacción tiene amount=240000.00, seis imputaciones 40000.00, números 1–6, en 2026-09-01 a 2027-02-01; suman 240000.00. |
| CP-IMP-032 | PASSED | Coincide con el resultado esperado. Se verificó: Se ve Se importaron 6 de 11 filas., $321.715,50 en gastos y $850.000,00 en ingresos (en pesos). y Fila 6: No existe la categoría «Transporte» o está archivada; las demás válidas se importan. |
| CP-IMP-033 | PASSED | Coincide con el resultado esperado. Se verificó: El tiempo es menor a 10,0 s y se ve Se importaron 500 de 500 filas. Nota: Local (no Vercel/Supabase hosteado): 0.9 s |
| CP-IMP-034 | PASSED | Coincide con el resultado esperado. Se verificó: Existe solo la transacción e imputación de fila 1. |
| CP-IMP-035 | PASSED | Coincide con el resultado esperado. Se verificó: No hay transacciones, imputaciones ni import. |
| CP-IMP-036 | PASSED | Coincide con el resultado esperado. Se verificó: HTTP no exitoso de clase 4xx; JSON code:"42501" y mensaje de permiso denegado; no se crea nada; el número de status HTTP se registra como evidencia porque la especificación no fija su mapeo. — Observado en la corrida — HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function import_transactions"} |
| CP-IMP-037 | PASSED | Coincide con el resultado esperado. Se verificó: HTTP 200 y cuerpo exacto []. |
| CP-IMP-038 | PASSED | Coincide con el resultado esperado. Se verificó: La consola devuelve true; crypto.randomUUID() vuelve a generar UUID variables. |
| CP-IMP-039 | PASSED | Coincide con el resultado esperado. Se verificó: Una transacción, una imputación y un import. |
| CP-IMP-040 | PASSED | Coincide con el resultado esperado. Se verificó: No hay transacciones ni imputaciones. |
| CP-IMP-041 | PASSED | Coincide con el resultado esperado. Se verificó: No hay transacciones ni imputaciones. |
| CP-SUS-005 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"Escribí un nombre"} |
| CP-SUS-007 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con 1 única fila ([{"name":"Netflix","amount":5000}]) — Observado en la corrida — HTTP 409 {"code":"23505","details":null,"hint":null,"message":"Ya tenés una suscripción con ese nombre"} |
| CP-SUS-009 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"El monto debe ser mayor a cero"} |
| CP-SUS-010 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"El monto máximo es $999.999.999.999,99"} |
| CP-SUS-011 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"Elegí una categoría"} |
| CP-SUS-012 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"El día de cobro va de 1 a 31"} |
| CP-SUS-013 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"El mes de inicio va de octubre 2024 a octubre 2027"} |
| CP-SUS-014 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"El mes de fin no puede ser anterior al de inicio"} |
| CP-SUS-015 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"La descripción admite hasta 200 caracteres"} |
| CP-SUS-016 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 409 {"code":"23503","details":null,"hint":null,"message":"La categoría no está disponible"} |
| CP-SUS-017 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 409 {"code":"23503","details":null,"hint":null,"message":"La categoría no está disponible"} |
| CP-SUS-018 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 403 {"code":"42501","details":null,"hint":"Grant the required privileges to the current role with: GRANT INSERT ON public.subscriptions TO authenticated;","message":"permission denied for table subscriptions"} |
| CP-SUS-020 | PASSED | Coincide con el resultado esperado. Se verificó: Se muestra el estado subscription-detail-not-found con el texto "No encontramos esta suscripción." y el enlace "Ver suscripciones" (subscription-detail-not-found-back), sin exponer ningún dato de "Netflix B" |
| CP-SUS-021 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas devueltas por RLS) — Observado en la corrida — HTTP 200 [] |
| CP-SUS-022 | FAILED | esperado HTTP 403 42501; obtenido HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function create_subscription"} (el código 42501 coincide; cambia el HTTP: la API responde 401 al rol anon) — Observado en la corrida — HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function create_subscription"} |
| CP-SUS-025 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con exactamente 2 filas: subscription_period = "<MES_HACE_2>-01" y subscription_period = "<MES_ANTERIOR>-01", ambas con "amount_text": "10.00", "installments_count": 1 y "type": "expense" — Observado en la corrida — HTTP 200 {"failed":[],"generated":2} HTTP 200 {"failed":[],"generated":0} |
| CP-SUS-026 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 200 {"failed":[],"generated":0} |
| CP-SUS-031 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con "status": "paused", "paused_at" no nulo y "generate_from_period": "<MES_SIGUIENTE>-01" — Observado en la corrida — HTTP 200 {"generated_before":2} |
| CP-SUS-032 | FAILED | esperado HTTP 404 P0002 «Suscripción no encontrada»; obtenido HTTP 500 {"code":"P0002","details":null,"hint":null,"message":"Suscripción no encontrada"} — Observado en la corrida — HTTP 500 {"code":"P0002","details":null,"hint":null,"message":"Suscripción no encontrada"} |
| CP-SUS-036 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con [{"end_period":null}] — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"El mes de fin no puede ser anterior a octubre 2026"} |
| CP-SUS-038 | PASSED | Coincide con el resultado esperado. Se verificó: No se muestra el formulario editable; se muestra el texto "Esta suscripción está cancelada y no se puede editar." y el enlace "Volver" (subscription-form-cancelled-back) que apunta a /subscriptions/<SUB_ID> |
| CP-SUS-039 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con [{"category_id":"<CAT_ENTRETENIMIENTO>"}] — Observado en la corrida — HTTP 409 {"code":"23503","details":null,"hint":null,"message":"La categoría no está disponible"} |
| CP-SUS-040 | PASSED | Coincide con el resultado esperado. Se verificó: La puesta al día corre al recargar sin crear una nueva transacción para <MES_ANTERIOR>; no aparece app-catchup-generated y la fila subscription-detail-occurrence con data-period="<MES_ANTERIOR>" sigue con data-deleted="true" y "Eliminado" |
| CP-SUS-041 | PASSED | Coincide con el resultado esperado. Se verificó: Navega a /subscriptions/<SUB_ID> mostrando el Detalle de "Netflix" — Observado en la corrida — Resumen: marca en Netflix=1, marca en Kiosco=0 |
| CP-SUS-043 | PASSED | Coincide con el resultado esperado. Se verificó: Navega a /settings?period=<MES_ANTERIOR> con el campo "Mes" (settings-fx-period) preseleccionado en <MES_ANTERIOR> |
| CP-SUS-047 | PASSED | Coincide con el resultado esperado. Se verificó: Navega a /subscriptions/<SUB_ID>, muestra "Suscripción guardada. Se cargaron 2 gastos vencidos." (subscription-toast) y en "Gastos cargados" (subscription-detail-occurrences) aparecen exactamente las mismas 2 fechas y períodos (<MES_ANTERIOR> y <MES_HACE_2>) que mostró "Se cargan al guardar" — Observado en la corrida — Se cargan: agosto 2026 · 28/08/2026 \| septiembre 2026 · 28/09/2026; próximos: octubre 2026 · 28/10/2026 \| noviembre 2026 · 28/11/2026 \| diciembre 2026 · 28/12/2026; resumen: Al guardar se cargan 2 gastos de $5.000,00 (total $10.000,00). |
| CP-SUS-048 | FAILED | la fila de 2026-08 no tiene data-blocked="false" (el atributo está ausente; solo se escribe cuando la fila está bloqueada) — Observado en la corrida — 2026-08: data-blocked=null; 2026-09: data-blocked=true; texto «septiembre 2026 · 28/09/2026 Sin tipo de cambio: se carga cuando lo cargues»; resumen: Al guardar se carga 1 gasto de USD 20,00. |

Los 6 casos de Deudas (CP-DEU-005 a 010) y los 15 de Navegación ejecutados a mano coincidieron con el resultado esperado en cada paso.

Los 78 casos de Suscripciones informados como «ok» por el equipo no se repitieron: su estado es el que informó el equipo, sin detalle de la ejecución.
