# Entrega 2 · Ejecución de casos de prueba (V2) · Deudas, Navegación, Exportar CSV, Importar Excel, Suscripciones y Resumen por categoría, y regresión de V1

Planilla: `04-ejecucion.xlsx` (una hoja por caso con el «Reporte de ejecución 1», el resultado obtenido, la evidencia y los defectos). Casos: ver `02-especificacion-casos-v2` (Deudas y Navegación) y `casos/exp.md`, `casos/imp.md` y `casos/sus.md` (Exportar, Importar y Suscripciones; sus pasos también están en la hoja de cada caso de la planilla). Los 60 casos de V1 de la regresión tienen su hoja (ACC-001 a DAS-011) con la ejecución de V1 como «Reporte de ejecución 1» y la regresión como «Reporte de ejecución 2» (3 en CP-CFG-011 y CP-CFG-013), en un bloque nuevo al pie de la hoja; la hoja «Repaso manual (Alta)» es la plantilla del repaso a mano del equipo; su detalle está en el último apartado, «Regresión de V1».

## Condiciones de la ejecución

Catálogo reducido a 206 casos (recorte del 2026-10-27: se quitaron los casos que repetían una regla con otro valor, los de funciones todavía no implementadas y los de ancho de pantalla o testids repetidos). A esos 206 casos se suman los 6 de Resumen por categoría (CAT), escritos el 2026-10-27: 212 en total. Acá figuran los 203 que tienen resultado; los 9 de Deudas restantes (CP-DEU-014, 018, 020, 021, 022, 036, 037, 038 y 039) no figuran porque el equipo los informó como «OK» y no se repitieron.

- **Fecha:** 2026-10-25.
- **Ejecutó a mano (Santiago):** CP-DEU-005, 006, 007, 008, 009 y 010, y 15 casos de Navegación (CP-NAV-001, 002, 003, 004, 008, 009, 010, 011, 012, 013, 019, 021, 023, 024 y 025), en el **deploy de Vercel** (https://biyu-rust.vercel.app), con **Google Chrome**.
- **Ejecutó Claude Code, supervisado por Santiago (10 casos de Navegación):** CP-NAV-005, 006, 007, 014, 015, 016, 017, 018, 020 y 022. Entorno local: Vite (`http://127.0.0.1:5173`) + Supabase local con todas las migraciones, `main` en `f096e22`, Chromium (Playwright 1.63) y navegador integrado de Claude Code.
- **Ejecutó Claude Code, supervisado por Santiago (Deudas):** los casos CP-DEU-040 a 061 que quedaron en el catálogo (CP-DEU-040, 041, 042, 043 a 046, 047 a 050, 051, 052, 053, 054, 055, 056, 057, 058, 059, 060 y 061), en el mismo entorno local. La preparación (deudas, gastos y tipos de cambio) se cargó por API, como en los casos originales con PR-04.
- **Datos:** usuarios y montos ficticios, uno por caso.
- **Exportar CSV (31 casos), Importar Excel (41 casos) y Suscripciones (48 casos):** ejecutados el **2026-10-27** en el entorno local (Vite + Supabase local, Chromium con Playwright), sobre `main` en `1c72d0f`. **Ejecutó Claude Code (IA), supervisado por Santiago:** los 31 de EXP, los 41 de IMP y 27 de los 48 de SUS (los que el equipo no pudo probar o informó con una observación). Los otros 21 casos de SUS los ejecutó el equipo y los informó como «ok» en un mensaje; no se repitieron. Detalle del entorno y de lo sustituido en `06-reporte-de-ejecucion`, §6.
- **Deudas, casos CP-DEU-015 a 035 (16 casos):** ejecutados el **2026-10-27** en el entorno local (Vite + Supabase local, Chromium con Playwright, reloj real), sobre `main` en `1c72d0f`. **Ejecutó Claude Code (IA), supervisado por Santiago:** CP-DEU-015, 016, 017, 019, 023, 024, 026, 027, 028, 029, 030, 031, 032, 033, 034 y 035. Los que el equipo informó como «OK» (CP-DEU-014, 018, 020, 021, 022, 036, 037, 038 y 039) no se repitieron y no figuran en este reporte.
- **Deudas, 8 casos pendientes (CP-DEU-001, 002, 003, 004, 011, 012, 013 y 025):** ejecutados el **2026-10-27** en el entorno local (Vite + Supabase local, Chromium con Playwright emulando un celular de 375 × 812 px, reloj real), sobre `main` en `deac2c7`. **Ejecutó Claude Code (IA), supervisado por Santiago.** Usuario nuevo por caso (`qa+cp-deu-<id>-001@example.com`); la pantalla se manejó con la interfaz y, donde el caso lo pide, la base se consultó por API con el token del usuario de prueba. Los casos 001, 003 y 011 se corrigieron el mismo día (paso de elegir la cuenta «Efectivo» y, en el 003, volver a cargar el tipo de cambio después de cambiar la fecha) y se volvieron a ejecutar.
- **Resumen por categoría (CAT, 6 casos: CP-CAT-001 a 006):** ejecutados el **2026-10-27** en el entorno local (Vite + Supabase local, Chromium con Playwright emulando un celular de 375 × 812 px, es-AR, hora de Argentina), sobre `main` en `15e3c4b`. **Ejecutó Claude Code (IA), supervisado por Santiago.** Usuario nuevo por caso (`qa+cp-cat-<nnn>-001@example.com`); los movimientos de cada caso se cargaron por la API con `create_transaction` (y `delete_transaction` en el 002), y todo lo demás se hizo por pantalla.
- **Regresión de V1 (60 casos de `03-seleccion-regresion`):** ejecutada el **2026-10-28** en el entorno local (Vite + Supabase local, Chromium con Playwright emulando un celular de 390 × 844 px), sobre `main` en `109007a`. **Ejecutó Claude Code (IA), supervisado por Joaquín.** Resultado: 60 PASSED; el repaso manual de los 39 de prioridad Alta está pendiente. No suma a los casos de V2; condiciones y detalle en el apartado «Regresión de V1», al final.
- **Criterio para BLOCKED:** un caso que no se puede ejecutar porque falta una funcionalidad o un botón queda BLOCKED para V3.

## Resultado por caso

| ID | Prioridad | Título | Status | Ejecutó | Defectos |
|---|---|---|---|---|---|
| CP-DEU-001 | Alta | El interruptor «Gasto compartido» se enciende y se apaga, y el gasto se guarda sin deuda | **PASSED** | Claude Code | — |
| CP-DEU-002 | Alta | Gasto compartido de $120.000,00 en 12 cuotas: se guarda el gasto y la deuda vinculada de Sofía | **DUDA** | Claude Code | — |
| CP-DEU-003 | Alta | Gasto compartido en dólares (US$100 a tipo de cambio 1250): avisa en dólares y congela el tipo de cambio | **PASSED** | Claude Code | — |
| CP-DEU-004 | Media | El monto adeudado vacío muestra «Ingresá cuánto te debe» y no deja guardar | **PASSED** | Claude Code | — |
| CP-DEU-005 | Alta | No se puede compartir un gasto si falta cuánto te deben | **PASSED** | Santiago | — |
| CP-DEU-006 | Alta | No se puede compartir un gasto si falta con quién | **PASSED** | Santiago | — |
| CP-DEU-007 | Alta | Un ingreso no se puede compartir | **PASSED** | Santiago | — |
| CP-DEU-008 | Alta | El nombre hecho solo de espacios no cuenta como nombre | **PASSED** | Santiago | — |
| CP-DEU-009 | Media | El nombre admite hasta 60 caracteres, no 61 | **PASSED** | Santiago | — |
| CP-DEU-010 | Alta | No se puede deber 0 pesos | **PASSED** | Santiago | — |
| CP-DEU-011 | Alta | Una deuda igual al gasto se acepta: «Tu parte» queda en $0,00 | **PASSED** | Claude Code | — |
| CP-DEU-012 | Alta | Una deuda un centavo mayor que el gasto no se puede guardar | **PASSED** | Claude Code | — |
| CP-DEU-013 | Alta | Por API, una deuda mayor que el gasto se rechaza y no se guarda nada | **BLOCKED** | Claude Code | — |
| CP-DEU-015 | Alta | Eliminar el gasto vinculado oculta la deuda de /debts, deja de sumarla en "Te deben" y en el neto del Resumen, y conserva intacta su fila en debts | **PASSED** | Claude Code | — |
| CP-DEU-016 | Alta | Al restaurar desde Movimientos → Eliminados un gasto cuya deuda vinculada estaba saldada, la deuda vuelve a /debts con estado saldada y la misma fecha settled_at | **PASSED** | Claude Code | — |
| CP-DEU-017 | Alta | Estado inicial de /debts/new y guardado de una deuda "Me deben" en ARS por $20.000,00 crea una fila pendiente con transaction_id = null en una sola llamada a create_debt | **PASSED** | Claude Code | — |
| CP-DEU-019 | Alta | En /debts/new, elegir "US$" con TC de referencia de 1250 precompleta "1.250,00", muestra "≈ $50.000,00" para US$40 y guarda fx_rate = 1250.0000 y amount_ars = 50000.00 | **PASSED** | Claude Code | — |
| CP-DEU-023 | Media | En /debts/new, un "Monto" con más de 2 decimales ("0,001") muestra "El monto admite hasta 2 decimales" | **PASSED** | Claude Code | — |
| CP-DEU-024 | Alta | En /debts/new con US$, Monto = 0,01 y TC = 0,5 se acepta (redondeo half-up a $0,01) y guarda amount_ars = "0.01" | **FAILED** | Claude Code | DEF-037 |
| CP-DEU-025 | Alta | En «Nueva deuda» con US$, un tipo de cambio de 0 muestra «El tipo de cambio debe ser mayor a cero» | **FAILED** | Claude Code | DEF-037 |
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
| CP-CAT-001 | Alta | La torta muestra una porción por categoría, con su monto y su porcentaje | **PASSED** | Claude Code | — |
| CP-CAT-002 | Alta | Los ingresos y los gastos eliminados no entran en la torta | **PASSED** | Claude Code | — |
| CP-CAT-003 | Media | Con 7 categorías, las dos más chicas se agrupan en «Resto» en la torta | **PASSED** | Claude Code | — |
| CP-CAT-004 | Alta | Tocar una categoría del Resumen abre su detalle del mes | **PASSED** | Claude Code | — |
| CP-CAT-005 | Media | En el detalle, «Mes anterior» y «‹ Resumen» conservan la categoría y el mes | **PASSED** | Claude Code | — |
| CP-CAT-006 | Media | Una categoría que no existe muestra un aviso con salida al Resumen | **PASSED** | Claude Code | — |

## Resumen

| Status | Casos |
|---|---|
| PASSED | 189 |
| FAILED | 9 |
| DUDA (pasa, con dudas) | 1 |
| BLOCKED | 4 |
| No ejecutados | 0 |
| **Total** | **203** |

Por módulo:

| Módulo | Casos | PASSED | FAILED | DUDA | BLOCKED | No ejecutados |
|---|---|---|---|---|---|---|
| Deudas (DEU) | 52 | 45 | 2 | 1 | 4 | 0 |
| Navegación (NAV) | 25 | 25 | 0 | 0 | 0 | 0 |
| Exportar CSV (EXP) | 31 | 28 | 3 | 0 | 0 | 0 |
| Importar Excel (IMP) | 41 | 40 | 1 | 0 | 0 | 0 |
| Suscripciones (SUS) | 48 | 45 | 3 | 0 | 0 | 0 |
| Resumen por categoría (CAT) | 6 | 6 | 0 | 0 | 0 | 0 |

## Detalle de los casos que no son PASSED

### CP-DEU-002 — Gasto compartido de $120.000,00 en 12 cuotas: se guarda el gasto y la deuda vinculada de Sofía · **DUDA**

**Esperado:** Aparece «Gasto guardado» con «Sofía te debe $60.000,00»; se emite 1 sola llamada create_transaction con p_shared_persons = ["Sofía"] y p_shared_amounts = ["60000.00"] y ninguna a /rest/v1/debts. En la base: 1 transacción de 120000.00 en 12 cuotas, 12 filas de ledger_entries de 10000.00 (2026-08 a 2027-07) y 1 deuda de Sofía de 60000.00, pendiente, vinculada a la transacción.

**Obtenido:** Coincide casi todo: se creó la categoría «Tecnología»; con «Tarjeta de crédito», 12 cuotas y fecha 15/08/2026 el resumen dice «Sofía te va a deber $60.000,00 · Tu parte: $60.000,00»; al guardar aparece «Gasto guardado» ($120.000,00 en 12 cuotas · Tecnología · Tarjeta de crédito · Sofía te debe $60.000,00), con 1 sola llamada create_transaction y ninguna a /rest/v1/debts; el formulario queda listo para otro gasto con «Tarjeta de crédito» preseleccionada y el interruptor apagado. /debts?status=all muestra una deuda de Sofía por $60.000,00 pendiente con «Gasto compartido: Tecnología, $120.000,00 del 15/08/2026». En la base: transactions 1 fila de 120000.00 en 12 cuotas; ledger_entries 12 filas de 10000.00 (2026-08-01 a 2027-07-01); debts 1 fila (Sofía, 60000.00, ARS, owed_to_me, pending, settled_at null, incurred_on 2026-08-15, transaction_id igual al de la transacción). La diferencia: el pedido que envía la pantalla usa p_shared_person = "Sofía" y p_shared_amount = "60000" (una sola persona), no los arreglos p_shared_persons y p_shared_amounts que pide el paso 15.

**Defectos:** —

**Notas:** Se cumple en lo esencial (1 llamada, 0 a /debts, 12 cuotas y deuda vinculada correctas). La diferencia es solo el nombre de los parámetros: la función de varias personas (US-82, issue #270) todavía no existe. Sin defecto. Repetir el paso 15 cuando exista US-82.

### CP-DEU-013 — Por API, una deuda mayor que el gasto se rechaza y no se guarda nada · **BLOCKED**

**Esperado:** create_transaction responde HTTP 400 con code 23514 y el mensaje «I7: la deuda no puede superar el monto del gasto»; transactions, ledger_entries y debts quedan vacías.

**Obtenido:** No se pudo ejecutar como está escrito: create_transaction con p_shared_persons y p_shared_amounts responde HTTP 404 con code PGRST202 (función no encontrada), porque la función de varias personas (US-82, issue #270) todavía no existe. Con la función actual (una persona: p_shared_person = "Sofía" y p_shared_amount = "10000.01") responde HTTP 400 con code 23514 y el mensaje «I7: la deuda no puede superar el monto del gasto», y transactions, ledger_entries y debts quedan vacías.

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-024 — En /debts/new con US$, Monto = 0,01 y TC = 0,5 se acepta (redondeo half-up a $0,01) y guarda amount_ars = "0.01" · **FAILED**

**Esperado:** Se muestra `data-testid="debt-form-fx-ars-equivalent"` con `"≈ $0,01"` y se habilita "Guardar deuda". Aparece `"Deuda guardada"` y se abre `/debts?status=pending`. Devuelve 1 fila con `amount_text = "0.01"`, `fx_rate_text = "0.5000"` y `amount_ars_text = "0.01"`.

**Obtenido:** Paso 6: el primer clic en «US$» no selecciona la moneda (se pierde porque al salir del foco de «Persona» aparece el error y corre los botones); con un segundo clic el resto del caso se cumple: ≈ $0,01 y se guarda amount 0.01, fx_rate 0.5000 y amount_ars 0.01 — Observado en la corrida — Paso 6: tras el primer clic en «US$», el campo «Tipo de cambio» NO aparece (el clic se perdió: al salir del foco de «Persona» aparece «Ingresá el nombre de la persona» y los botones se corren hacia abajo) Con un segundo clic en «US$» el campo «Tipo de cambio» aparece

**Informe previo del equipo:** Hasta el paso 7 ok; el 8 no sabe cómo testear.

**Defectos:** DEF-037

**Notas:** Ver DEF-037. Con un segundo clic en «US$» el resto del caso se cumple.

### CP-DEU-025 — En «Nueva deuda» con US$, un tipo de cambio de 0 muestra «El tipo de cambio debe ser mayor a cero» · **FAILED**

**Esperado:** Con «US$», Persona «Juan», Monto 40 y Tipo de cambio 0, al salir del campo aparece «El tipo de cambio debe ser mayor a cero» y «Guardar deuda» queda deshabilitado; no se guarda nada.

**Obtenido:** Paso 6: el primer clic en «US$» no selecciona la moneda y el campo «Tipo de cambio (ARS por US$)» no aparece, (se hizo clic en «US$» apenas se abrió «Nueva deuda», con el foco todavía en «Persona»). Con un segundo clic en «US$» el resto se cumple: al escribir 0 en «Tipo de cambio (ARS por US$)» y salir del campo aparece «El tipo de cambio debe ser mayor a cero», «Guardar deuda» queda deshabilitado y debts queda vacía.

**Defectos:** DEF-037

**Notas:** Ver DEF-037 (mismo problema que CP-DEU-024). Es el escenario descrito en DEF-037: clic en «US$» apenas se abre «Nueva deuda». Con un segundo clic en «US$» el resto del caso se cumple.

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
| CP-DEU-001 | PASSED | Coincide con el resultado esperado. Se verificó: interruptor apagado/encendido, resumen «Sofía te va a deber $25.000,00 · Tu parte: $25.000,00», «Gasto guardado» sin deuda, /debts vacío; 1 transacción de 50000.00 y 0 deudas. (Caso corregido: paso de elegir «Efectivo».) |
| CP-DEU-002 | DUDA | Se cumple todo (12 cuotas de $10.000,00 y 1 deuda de Sofía por $60.000,00 vinculada, con 1 sola llamada y ninguna a /debts). Diferencia: el pedido usa p_shared_person y p_shared_amount (una persona) y no los arreglos del paso 15, porque US-82 no existe. |
| CP-DEU-003 | PASSED | Coincide con el resultado esperado. Se verificó: avisos en dólares, aviso «Completá tipo de cambio para guardar» tras cambiar el mes, tipo de cambio vuelto a cargar en el paso 1, «Gasto guardado» con «Sofía te debe US$40,00»; deuda USD 40.00 con fx_rate 1250.0000 y amount_ars 50000.00. (Caso corregido.) |
| CP-DEU-004 | PASSED | Coincide con el resultado esperado. Se verificó: «Guardar gasto» deshabilitado; mensaje «Ingresá cuánto te debe»; transactions y debts vacías. |
| CP-DEU-011 | PASSED | Coincide con el resultado esperado. Se verificó: resumen «Tu parte: $0,00», «Guardar gasto» habilitado, «Gasto guardado» con «Sofía te debe $10.000,00», fila de Sofía con «$10.000,00»; 1 gasto y 1 deuda de 10000.00. (Caso corregido: paso de elegir «Efectivo».) |
| CP-DEU-012 | PASSED | Coincide con el resultado esperado. Se verificó: mensaje «No puede superar el monto del gasto ($10.000,00)», sin resumen, «Guardar gasto» deshabilitado, transactions y debts vacías. |
| CP-DEU-013 | BLOCKED | La función de varias personas (US-82) no existe: como está escrito responde 404 PGRST202. Con una sola persona responde 400, code 23514 y «I7: la deuda no puede superar el monto del gasto», sin dejar filas. |
| CP-DEU-015 | PASSED | Coincide con el resultado esperado. Se verificó: Devuelve 1 fila intacta con person = "Sofía", status = "pending", settled_at = null, amount_text = "60000.00" y transaction_id = "<TX_ID>". — Observado en la corrida — adaptación: US-82 (varias personas) no existe; se preparó con p_shared_person y p_shared_amount de una persona |
| CP-DEU-016 | PASSED | Coincide con el resultado esperado. Se verificó: Devuelve 1 fila con status = "settled" y settled_at exactamente igual a <SETTLED_AT>. — Observado en la corrida — adaptación: US-82 (varias personas) no existe; se preparó con p_shared_person y p_shared_amount de una persona |
| CP-DEU-017 | PASSED | Coincide con el resultado esperado. Se verificó: Devuelve 1 fila con person = "Juan", direction = "owed_to_me", status = "pending", currency = "ARS", fx_rate = null, amount_text = "20000.00", amount_ars_text = "20000.00", incurred_on = "<HOY>", notes = null y transaction_id = null. — Observado en la corrida — Estado inicial: {"dir":"true","persona":"","foco":"debt-form-person","monto":"","ars":"true","fxEnDom":0,"fecha":"2026-10-27","nota":"","submitOff":true,"cancel":1} |
| CP-DEU-019 | PASSED | Coincide con el resultado esperado. Se verificó: Devuelve 1 fila con currency = "USD", amount_text = "40.00", fx_rate_text = "1250.0000" y amount_ars_text = "50000.00". — Observado en la corrida — TC sugerido: «1.250,00» |
| CP-DEU-023 | PASSED | Coincide con el resultado esperado. Se verificó: Aparece data-testid="debt-form-amount-error" con el texto exacto "El monto admite hasta 2 decimales", y "Guardar deuda" queda deshabilitado. — Observado en la corrida — error: «El monto admite hasta 2 decimales»; Guardar deuda deshabilitado |
| CP-DEU-024 | FAILED | Paso 6: el primer clic en «US$» no selecciona la moneda (se pierde porque al salir del foco de «Persona» aparece el error y corre los botones); con un segundo clic el resto del caso se cumple: ≈ $0,01 y se guarda amount 0.01, fx_rate 0.5000 y amount_ars 0.01 — Observado en la corrida — Paso 6: tras el primer clic en «US$», el campo «Tipo de cambio» NO aparece (el clic se perdió: al salir del foco de «Persona» aparece «Ingresá el nombre de la persona» y los botones se corren hacia abajo) Con un segundo clic en «US$» el campo «Tipo de cambio» aparece |
| CP-DEU-025 | FAILED | Paso 6: el primer clic en «US$» no selecciona la moneda (no aparece «Tipo de cambio»); con un segundo clic el resto se cumple: mensaje «El tipo de cambio debe ser mayor a cero», «Guardar deuda» deshabilitado, debts vacía. |
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
| CP-CAT-001 | PASSED | Coincide con el resultado esperado. Se verificó: el Resumen de septiembre 2026 muestra «Gastado en septiembre» $100.000,00; la torta tiene 3 porciones (de 0° a 216°, de 216° a 324° y de 324° a 360°) y la lista «Por categoría» muestra Comida y supermercado $60.000,00 60,0 %, Transporte $30.000,00 30,0 % y Servicios $10.000,00 10,0 %. |
| CP-CAT-002 | PASSED | Coincide con el resultado esperado. Se verificó: con un gasto eliminado de $9.999,00 y un ingreso de $500.000,00, el Resumen de septiembre 2026 muestra «Gastado» $100.000,00 e «Ingresos» $500.000,00; la lista tiene 3 filas (Comida y supermercado $60.000,00, Transporte $30.000,00 y Servicios $10.000,00) y la torta 3 porciones. |
| CP-CAT-003 | PASSED | Coincide con el resultado esperado. Se verificó: con 7 categorías ($128.000,00) la torta tiene 6 porciones y la última, «Resto», tiene data-amount 13000.00, data-percentage 10.2 y data-count 2; la lista muestra las 7 categorías, la primera con 31,3 % y Entretenimiento con 6,3 %. «Resto» no tiene un rótulo visible en pantalla: solo se ve en los atributos de la porción. |
| CP-CAT-004 | PASSED | Coincide con el resultado esperado. Se verificó: al tocar «Comida y supermercado» se abre /dashboard/categories/<id>?period=2026-09 con el título «Comida y supermercado», $40.000,00, «80,0 % del gasto de septiembre» y «Cuotas de meses anteriores $0,00»; la lista tiene 2 filas («28 sep · Tarjeta de débito» -$15.000,00 y «14 sep · Efectivo» -$25.000,00) y las barras muestran agosto $20,0 mil, septiembre $40,0 mil y $0 en los meses anteriores. |
| CP-CAT-005 | PASSED | Coincide con el resultado esperado. Se verificó: en el detalle de septiembre 2026 ($40.000,00), «Mes anterior» pasa a Agosto 2026 (?period=2026-08) con la misma categoría, $20.000,00 y «100,0 % del gasto de agosto»; «‹ Resumen» abre /dashboard?period=2026-08 con el Resumen de Agosto 2026. |
| CP-CAT-006 | PASSED | Coincide con el resultado esperado. Se verificó: la dirección con una categoría inexistente muestra «No encontramos esta categoría.» y «Volver al Resumen», sin nombre ni montos; «Volver al Resumen» abre /dashboard?period=2026-09. |

## Regresión de V1 (60 casos, ejecutada el 2026-10-28)

Casos de V1 elegidos en `03-seleccion-regresion` (criterio de ADR-027: 58 de la selección inicial y 2 sumados el mismo día, CP-CFG-005 y CP-CFG-013, ver `03` §6), ejecutados sobre V2 con los pasos de `entrega-1/02-especificacion-casos-de-prueba`. Es el «Reporte de ejecución 2» de cada caso de V1 (el 1 es el de la Entrega 1; en CP-CFG-011 y CP-CFG-013 es el 3, porque en V1 se ejecutaron dos veces) y **no suma** a los 203 casos de V2 de arriba. Los 14 casos excluidos de la selección conservan el resultado de V1 y no se ejecutaron.

- **Fecha:** 2026-10-28.
- **Versión probada:** `main` en `109007a` (local, con las 24 migraciones hasta `20261012000000`). No se probó el deploy de Vercel.
- **Entorno:** Vite (`http://localhost:5173`) + Supabase local reiniciado con la configuración del repositorio (`supabase/config.toml`); Chromium (Playwright) emulando un celular de 390 × 844 px, es-AR, hora de Argentina; reloj real (28/10/2026), salvo CP-REG-013, que fija el reloj del navegador en 15/10/2026 como en V1.
- **Ejecutó Claude Code (IA), supervisado por Joaquín:** los 60 casos, con el script de la ejecución de V1 (`entrega-1/ejecucion/`) adaptado a las pantallas de V2, y pedidos directos a la API con el token de cada usuario de prueba para las variantes API y los pares de autorización. Las adaptaciones están en `06-reporte-de-ejecucion`, §6.
- **Datos:** usuarios `qa+reg-<caso o grupo>-<corrida>@example.com`, contraseña `Prueba-Biyu-2026!` (los de alta por pantalla, `Clave123!`); son cuentas de Supabase local, que no existen en ningún otro entorno. Montos ficticios. Se borraron de la base local al terminar.
- **Corridas:** cuatro corridas completas. La que vale es la cuarta (60 casos, 60 PASSED). Las dos primeras fallaron por el script y por la configuración de Supabase local, no por la aplicación; la tercera (58 PASSED) es anterior a la ampliación de la selección y a dos verificaciones que se sumaron al script (detalle en `06`, §6). El resultado crudo de la cuarta corrida está en `ejecucion/regresion-v1-resultados.json`.
- **Repaso manual (pendiente):** los 39 casos de prioridad Alta se re-confirman a mano por el equipo con la hoja «Repaso manual (Alta)» de `04-ejecucion.xlsx` (13 casos por persona: Micaela, Valentina y Mariana). Hasta que esté completa, el resultado de la regresión es el de la ejecución con IA.

| ID | Prioridad | Título | Resultado en V1 | Status | Ejecutó | Defectos |
|---|---|---|---|---|---|---|
| CP-ACC-001 | Alta | Sin sesión, la app redirige al login | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-ACC-002 | Alta | Una ruta privada abierta sin sesión conserva el destino | PASSED · DEF-008 | **PASSED** | **PASSED** | Claude Code | — |
| CP-ACC-003 | Alta | Crear una cuenta con email y contraseña válidos | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-ACC-004 | Alta | Contraseñas que no cumplen los criterios se rechazan | FAILED · DEF-005 | **PASSED** | **PASSED** | Claude Code | — |
| CP-ACC-005 | Alta | No se puede crear una cuenta con un email ya registrado | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-ACC-008 | Alta | Una cuenta nueva tiene el catálogo inicial sembrado | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-ACC-009 | Alta | Cerrar sesión y no poder volver con "atrás" | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-ACC-011 | Alta | Aislamiento entre usuarios en todas las tablas (par de autorización) | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-ACC-012 | Alta | Contraseña y confirmación distintas bloquean el alta | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-CFG-001 | Alta | Crear una categoría con nombre y color | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-CFG-003 | Media | No se permiten dos categorías activas con el mismo nombre | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-CFG-004 | Alta | Archivar una categoría con historia | FAILED · DEF-006 | **PASSED** | **PASSED** | Claude Code | — |
| CP-CFG-005 | Baja | Reusar el nombre de una categoría archivada | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-CFG-006 | Alta | Crear una cuenta de tarjeta de crédito | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-CFG-007 | Media | No se permiten dos cuentas activas con el mismo nombre | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-CFG-008 | Alta | La siembra concurrente no duplica el catálogo | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-CFG-009 | Alta | Cargar y actualizar el tipo de cambio de referencia del mes | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-CFG-010 | Media | Tipo de cambio de referencia en cero o negativo | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-CFG-011 | Alta | Después de crear la cuenta aparece la configuración inicial | PASSED (ejecución 2) · DEF-017 | **PASSED** | **PASSED** | Claude Code | — |
| CP-CFG-013 | Media | Destildar una categoría en el setup la archiva | PASSED (ejecución 2) · DEF-017 | **PASSED** | **PASSED** | Claude Code | — |
| CP-REG-001 | Alta | El registro es la pantalla de inicio | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-REG-002 | Media | La fecha viene precargada con hoy | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-REG-004 | Media | Elegir la categoría tocando un chip | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-REG-005 | Media | Una categoría archivada no se ofrece ni se acepta por API | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-REG-008 | Media | Fecha de ayer sí, fecha de mañana no | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-REG-009 | Media | Confirmación y formulario limpio después de guardar | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-REG-010 | Alta | Monto vacío, cero o negativo no se guarda | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-REG-011 | Media | Monto con tres decimales | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-REG-012 | Alta | Eliminar una transacción la saca del total del mes | PASSED · DEF-007 | **PASSED** | **PASSED** | Claude Code | — |
| CP-REG-013 | Alta | Eliminar una compra con cuotas en meses cerrados avisa y es retroactivo | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-REG-014 | Alta | Otro usuario no puede leer ni borrar una transacción ajena | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-REG-015 | Alta | No se puede escribir en transactions salteando la RPC | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-REG-016 | Media | El monto toma el foco con teclado numérico | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-CUO-001 | Alta | Compra en 12 cuotas genera 12 imputaciones consecutivas | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-CUO-002 | Alta | Previsualización del impacto mensual antes de guardar | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-CUO-003 | Alta | Cambiar a una cuenta que no es crédito resetea las cuotas | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-CUO-004 | Alta | División exacta: 12 cuotas iguales | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-CUO-005 | Alta | El resto lo absorbe la última cuota | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-CUO-006 | Alta | Cantidad de cuotas: 0, 1, 2, 12 y 13 | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-CUO-007 | Media | El Resumen separa las cuotas de meses anteriores | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-CUO-009 | Alta | Borrar una compra en cuotas saca todas sus cuotas | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-CUO-010 | Media | En USD, la suma en pesos de las cuotas es exacta | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-CUO-011 | Alta | Otro usuario no ve las cuotas de una compra ajena | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-CUO-012 | Alta | Un ingreso no admite cuotas aunque la cuenta sea crédito | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-CUO-013 | Alta | Un fallo a mitad de create_transaction no deja datos parciales | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-MON-001 | Alta | Gasto en USD con el tipo de cambio sugerido | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-MON-002 | Alta | Tabla de decisión de moneda y tipo de cambio (6 filas) | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-MON-003 | Media | Pisar el tipo de cambio sugerido | PASSED · DEF-020 | **PASSED** | **PASSED** | Claude Code | — |
| CP-MON-004 | Alta | Cambiar la referencia no altera lo ya guardado | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-MON-005 | Alta | El total del mes en pesos incluye lo gastado en dólares | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-MON-007 | Alta | Otro usuario no lee ni modifica el tipo de cambio ajeno | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-DAS-001 | Alta | El Resumen abre en el mes actual con su total | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-DAS-002 | Alta | El mes elegido vive en la URL | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-DAS-003 | Media | Período inválido o ausente cae al mes actual | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-DAS-004 | Media | Gasto por categoría en barras | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-DAS-005 | Media | Gasto por cuenta | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-DAS-006 | Media | Ingresos y balance positivo | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-DAS-008 | Media | Últimos 10 movimientos con acceso a la lista completa | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-DAS-010 | Media | Mes sin datos: estado vacío con acceso al registro | PASSED | **PASSED** | **PASSED** | Claude Code | — |
| CP-DAS-011 | Alta | El Resumen de un usuario nunca muestra datos de otro | PASSED | **PASSED** | **PASSED** | Claude Code | — |

### Resumen de la regresión

| Status | Casos |
|---|---|
| PASSED | 60 |
| FAILED | 0 |
| BLOCKED | 0 |
| No ejecutados | 0 |
| **Total** | **60** |

| Módulo de V1 | Casos | PASSED | FAILED | BLOCKED |
|---|---|---|---|---|
| Acceso (ACC) | 9 | 9 | 0 | 0 |
| Configuración (CFG) | 11 | 11 | 0 | 0 |
| Registro (REG) | 13 | 13 | 0 | 0 |
| Cuotas (CUO) | 12 | 12 | 0 | 0 |
| Monedas (MON) | 6 | 6 | 0 | 0 |
| Resumen (DAS) | 9 | 9 | 0 | 0 |

**Casos que cambiaron de estado respecto de la Entrega 1:** CP-ACC-004 (FAILED → PASSED, DEF-005) y CP-CFG-004 (FAILED → PASSED, DEF-006). Los otros 58 estaban PASSED en V1 y siguen PASSED. No apareció ningún defecto nuevo.

### Resultado obtenido de la regresión

| Caso | Status | Obtenido |
|---|---|---|
| CP-ACC-001 | PASSED | Sin sesión, abrir «/» termina en /login?next=%2Fregister con el formulario «Entrar»; no se renderiza nada de Registrar. |
| CP-ACC-002 | PASSED | Sin sesión, abrir /settings redirige a /login?next=%2Fsettings. Además, al iniciar sesión desde ahí la app vuelve a /settings?period=2026-10: el destino original se respeta (DEF-008 sigue corregido). |
| CP-ACC-003 | PASSED | La cuenta se crea con sesión activa y sin confirmar el email; se abre /setup («Configuración inicial»). Salteados los 4 pasos, la app queda en /register y la sesión está guardada en el navegador. |
| CP-ACC-004 | PASSED | (a) abc1234, (b) abcdefgh, (c) 12345678 y (d) abcd1234 se rechazan con «Falta que la contraseña cumpla: …» y los criterios que faltan (por ejemplo, para (d): «una mayúscula, un carácter especial»); ninguna crea la cuenta. (e) Abcd123! crea la cuenta. Variante API: POST /auth/v1/signup con abcd1234 responde HTTP 422 weak_password (DEF-005 sigue corregido). Nota: La primera corrida dio la variante API como aceptada porque Supabase local estaba levantado con una configuración de Auth vieja (mínimo 6 caracteres, sin requisitos). Se reinició con la configuración del repositorio (supabase/config.toml: 8 caracteres, mayúscula, minúscula, número y símbolo) y se repitió: rechazada. |
| CP-ACC-005 | PASSED | Con el email de CP-ACC-003 aparece «Ya existe una cuenta con ese email» y la pantalla sigue en «Crear cuenta»; en la base hay 1 sola cuenta con ese email. Variante API: user_already_exists. |
| CP-ACC-008 | PASSED | Ajustes muestra las 8 categorías (Comida y supermercado, Transporte, Servicios, Entretenimiento, Salud, Educación, Indumentaria y Otros) y las 5 cuentas; en la base hay 8 y 5. |
| CP-ACC-009 | PASSED | Desde Registrar, Resumen y Movimientos: Ajustes → «Cerrar sesión» lleva a /login y «atrás» vuelve a caer en /login (con el next de la pantalla anterior); la sesión ya no está en el navegador. Nota: «Cerrar sesión» está en Ajustes, que se abre con el engranaje de cada pantalla. |
| CP-ACC-011 | PASSED | Con el token de B, filtrando por el id de A: 0 filas en categories, accounts, fx_rates, transactions, ledger_entries, debts y subscriptions. Solo con la anon key: 42501 (permission denied) en las 7 tablas. Nota: Ejecutado por API con dos sesiones reales. pgTAP rls_isolation.test.sql también pasa en esta corrida. |
| CP-ACC-012 | PASSED | Con «Clave123!» y «Clave123?» aparece «Las contraseñas no son iguales»; los dos campos están enmascarados y no se crea la cuenta. |
| CP-CFG-001 | PASSED | «Mascotas» aparece en el listado activo con el color elegido; en la base: Mascotas, #4a7a6d. |
| CP-CFG-003 | PASSED | Crear «Salud» con «Salud» activa muestra «Ya existe una categoría activa con ese nombre» y la lista no cambia. Variante API: insert directo a categories → 23505. |
| CP-CFG-004 | PASSED | Al archivar «Entretenimiento» desaparece del listado activo y de la grilla de Registrar. En Movimientos, el gasto «Cine» de $8.000 conserva su categoría con la marca «archivada» (DEF-006 sigue corregido); en la base mantiene el category_id. Nota: La transacción «Cine» de la preparación se cargó por API (create_transaction), no por Registrar. |
| CP-CFG-005 | PASSED | Con «Salidas» archivada (la de CP-REG-005), crear «Salidas» en «Nueva categoría» se acepta sin error: queda 1 «Salidas» activa y 1 archivada. Nota: Sumado a la selección el 2026-10-28 (regla 3, por el cambio de unicidad de DEF-019; ver 03, §6). Depende de la preparación de CP-REG-005, como en V1. |
| CP-CFG-006 | PASSED | «Visa BBVA» aparece en la lista como «Tarjeta de crédito» (en la base: credit_card, ARS). En Registrar, al elegir «Visa BBVA» aparece «Cuotas» con los números 1 a 12. La lista de cuentas tiene «Editar» y «Archivar» en cada fila (DEF-011 sigue corregido). Nota: «Tarjeta de crédito» ya viene elegida en «Tipo»; no hizo falta abrir el desplegable. |
| CP-CFG-007 | PASSED | Crear «Efectivo» con «Efectivo» activa muestra «Ya existe una cuenta activa con ese nombre» y la lista no cambia. Variante API: insert directo a accounts → 23505 (accounts_user_name_active_uq). |
| CP-CFG-008 | PASSED | Con una cuenta creada por API y sin sembrar, las dos pestañas abiertas a la vez cargan (las dos llevan a /setup, porque la cuenta nueva tiene pendiente la configuración inicial). En la base quedan exactamente 8 categorías y 5 cuentas, sin duplicados. Nota: En V2 una cuenta nueva pasa primero por la configuración inicial (US-68), así que las pestañas muestran el setup en lugar del formulario de Registrar. La siembra ocurre igual. |
| CP-CFG-009 | PASSED | Con 1250 se crea la referencia de octubre 2026 (1250.0000 en la base). Con 1300 para el mismo mes se actualiza: 1 sola fila, 1300.0000; la lista muestra «octubre 2026 $ 1.300,00». |
| CP-CFG-010 | PASSED | 0 y -100 se rechazan con «El tipo de cambio debe ser mayor a cero»; 0,01 se acepta (0.0100 en la base). Variante API: el upsert directo a fx_rates responde 42501 y la RPC upsert_fx_rate responde 23514 «el tipo de cambio debe ser mayor a cero», con 0 y con -100. |
| CP-CFG-011 | PASSED | Después de crear la cuenta se abre /setup: paso 1 de 4, «¿Para qué vas a usar Biyu?», con 3 opciones, «Continuar» y «Saltear». |
| CP-CFG-013 | PASSED | «Continuar» en «¿Para qué vas a usar Biyu?» pasa a «Tus categorías» con las 8 categorías tildadas; al destildar «Educación» desaparece de la lista y «Continuar» lleva a «Tus cuentas». En la base, «Educación» sigue existiendo con archived_at completado (archivada, no borrada). Nota: Sumado a la selección el 2026-10-28 (regla 3, por el cambio del paso «Tus categorías» de DEF-026; ver 03, §6). |
| CP-REG-001 | PASSED | Con sesión, abrir «/» termina en /register con el paso del monto visible. |
| CP-REG-002 | PASSED | En el paso 3/3 la fecha viene con 2026-10-28, el día de la corrida. |
| CP-REG-004 | PASSED | El paso 2/3 muestra la grilla de chips, sin desplegables; tocar «Transporte» avanza solo al paso 3/3 y el gasto se guarda con la categoría Transporte. |
| CP-REG-005 | PASSED | Con «Salidas» archivada, el chip no aparece en la grilla de Registrar. Variante API: create_transaction con esa categoría se rechaza con «la categoría no existe, no es tuya o está archivada». |
| CP-REG-008 | PASSED | Con «Ayer» (2026-10-27) el gasto se guarda. Con mañana (2026-10-29) aparece «La fecha no puede ser futura» y «Guardar gasto» queda deshabilitado. Variante API: «FR-06: la fecha no puede ser posterior a hoy». |
| CP-REG-009 | PASSED | Al guardar aparece «Gasto guardado», el formulario vuelve al paso del monto vacío y el siguiente gasto conserva la última cuenta («Tarjeta de débito»). |
| CP-REG-010 | PASSED | Vacío, 0 y -500 dejan «Siguiente» deshabilitado; 0,01 se guarda (amount 0.01). Variante API: p_amount 0 y -5 → 23514 «I4: el monto debe ser mayor a cero». |
| CP-REG-011 | PASSED | Con 100,999 aparece «El monto admite hasta 2 decimales» y «Siguiente» queda deshabilitado. Variante API: «I4: el monto admite hasta 2 decimales». |
| CP-REG-012 | PASSED | Al confirmar se cierra el diálogo y aparece «Transacción eliminada». Con el gasto «Campera» de $50.000, el total del mes baja de $65.799,01 a $15.799,01 y la transacción queda con deleted_at. En Movimientos ya no está en «Activos» y aparece en «Eliminados» con la marca «eliminada» (DEF-007 sigue corregido). |
| CP-REG-013 | PASSED | Con hoy fijado en 15/10/2026, el diálogo avisa «Esta transacción tiene imputaciones en meses ya cerrados…» y lista 2026-08 (cuota 1) y 2026-09 (cuota 2), -$10.000,00 cada una. Después de confirmar, el Resumen de agosto y de septiembre queda vacío y no queda ninguna imputación que cuente. Nota: Como en V1, el reloj del navegador se fijó en 15/10/2026 con Playwright; el servidor usa la fecha real, que no interviene en el borrado. |
| CP-REG-014 | PASSED | Con la sesión de B, leer la transacción de A devuelve 0 filas y borrarla se rechaza con «la transacción no existe, ya fue eliminada o no te pertenece»; para A sigue activa. Nota: Ejecutado por API con dos sesiones reales. |
| CP-REG-015 | PASSED | Insert directo a transactions → 42501 «permission denied for table transactions»; a ledger_entries → 42501. |
| CP-REG-016 | PASSED | Al abrir Registrar el foco está en el monto (transaction-form-amount), con inputmode="decimal". Nota: Chromium emulando un celular: que se abra el teclado numérico no se puede ver en un navegador emulado; se verificó lo que lo provoca (foco y inputmode). |
| CP-CUO-001 | PASSED | Una compra de $120.000 en 12 cuotas con «Visa BBVA» genera 12 imputaciones, numeradas de 1 a 12, en meses consecutivos de 2026-10 a 2027-09. |
| CP-CUO-002 | PASSED | Antes de guardar, el recuadro dice «12 cuotas de $10.000,00 · de ago 2026 a jul 2027»; no hay ninguna transacción guardada con esa fecha. |
| CP-CUO-003 | PASSED | Con 6 cuotas, al cambiar a «Efectivo» el selector de cuotas desaparece y aparece «Las cuotas volvieron a 1»; al volver a «Visa BBVA» queda en 1. Variante API: 6 cuotas con una cuenta de efectivo → «I6: las cuotas solo aplican a gastos con cuenta credit_card». |
| CP-CUO-004 | PASSED | Las 12 imputaciones de la compra de $120.000 en 12 cuotas con «Visa BBVA» son de 10000.00; la suma de amount y de amount_ars es 120000.00 (I1). Nota: Desvío: en lugar de registrar su propia compra (categoría «Otros»), el caso usó la de CP-CUO-001 (mismo monto y cuotas, categoría «Indumentaria»), como en V1. La categoría no interviene en el reparto. |
| CP-CUO-005 | PASSED | $100.000 en 3 cuotas: 33333.33 + 33333.33 + 33333.34 = 100000.00 (la última absorbe el resto). |
| CP-CUO-006 | PASSED | La pantalla ofrece de 1 a 12 cuotas (no hay forma de elegir 0 ni 13). Variante API: 0 y 13 se rechazan con «las cuotas van de 1 a 12»; 1, 2 y 12 se aceptan. |
| CP-CUO-007 | PASSED | En el Resumen de 2026-09 (solo la compra de agosto en 12 cuotas de $10.000): «Gastado» $10.000,00 y «Cuotas de meses anteriores» $10.000,00. |
| CP-CUO-009 | PASSED | Borrar la compra en 12 cuotas: antes cuentan 12 imputaciones, después 0, y la cuota de 2027-04 ya no aparece en Movimientos. Nota: No hay forma de borrar una cuota sola: el botón elimina la compra entera. |
| CP-CUO-010 | PASSED | US$100 a 1250,5555 en 3 cuotas: amount_ars de la transacción 125055.55; imputaciones 41685.18 + 41685.18 + 41685.19 = 125055.55. |
| CP-CUO-011 | PASSED | Con la sesión de B, las imputaciones de la compra en cuotas de A devuelven 0 filas. Nota: Ejecutado por API con dos sesiones reales. |
| CP-CUO-012 | PASSED | Un ingreso con «Visa BBVA» no muestra el selector de cuotas. Variante API: ingreso en 3 cuotas → «I6: las cuotas solo aplican a gastos con cuenta credit_card». |
| CP-CUO-013 | PASSED | create_transaction con $0,02 en 3 cuotas inserta la transacción y falla en «I4: cada cuota debe ser al menos 0,01»; las filas de transactions y ledger_entries son las mismas antes y después (11 y 36): no queda nada a medias. Nota: El fallo a mitad de la función se fuerza con datos que pasan las primeras validaciones, como en V1. |
| CP-MON-001 | PASSED | US$100 guardado sin tocar el tipo de cambio sugerido: fx_rate 1250.0000 y amount_ars 125000.00. Nota: Se ejecuta dentro de la secuencia de CP-MON-002 (fila 3), con la referencia del mes en 1250, como en V1. |
| CP-MON-002 | PASSED | Fila 5 (USD, sin referencia ni TC): aviso «No tenés un tipo de cambio configurado» y «Siguiente» deshabilitado; por API, «I5: fx_rate es obligatorio si y solo si la moneda es USD». Fila 6 (USD, TC 1300 sin referencia): fx_rate 1300.0000. Fila 1 (ARS): fx_rate vacío. Fila 2 (ARS con TC): la pantalla no ofrece el campo y la API lo rechaza con I5. Fila 3 (referencia 1250): fx_rate 1250.0000, amount_ars 125000.00. Fila 4 (TC propio 1300): fx_rate 1300.0000. |
| CP-MON-003 | PASSED | Al tocar «US$» el campo sugiere «1.250,00» (DEF-020 sigue corregido). Al escribir 1300 aparece «Estás usando un valor distinto al de referencia. Se aplica solo a esta transacción.» y el gasto se guarda con fx_rate 1300.0000. Nota: En la segunda corrida el script leyó el campo antes de que llegara la sugerencia y lo dio vacío. La sugerencia aparece unos 10 ms después de tocar «US$»: se corrigió la espera del script; se repitió dos veces aparte (PASSED) y pasó en las corridas completas siguientes. |
| CP-MON-004 | PASSED | Al cambiar la referencia del mes a 1400, la transacción de US$100 sigue con fx_rate 1250.0000 y amount_ars 125000.00, y el total del Resumen no cambia ($606.685,18 antes y después). |
| CP-MON-005 | PASSED | Con $50.000 en pesos y US$100 a 1250 en el mes, el total del Resumen es $175.000,00. |
| CP-MON-007 | PASSED | Con la sesión de B: 0 filas de fx_rates de A y un update que afecta 0 filas; la referencia de A sigue en 1300.0000. Nota: Ejecutado por API con dos sesiones reales. |
| CP-DAS-001 | PASSED | Sin tocar el selector, el Resumen abre en 2026-10 (/dashboard?period=2026-10) con el total $175.000,00. |
| CP-DAS-002 | PASSED | Desde septiembre 2026, dos toques en «Mes siguiente» dejan la dirección en /dashboard?period=2026-11. |
| CP-DAS-003 | PASSED | ?period=fecha-invalida y la dirección sin período terminan en /dashboard?period=2026-10, sin mensaje de error. |
| CP-DAS-004 | PASSED | Las barras por categoría muestran Salud $70.000,00 (46,7 %), Comida y supermercado $50.000,00 (33,3 %) y Transporte $30.000,00 (20,0 %), en ese orden. Nota: En V2 la lista lleva además la torta (US-72) y cada fila abre el detalle de la categoría (US-73). |
| CP-DAS-005 | PASSED | Por cuenta: Efectivo $120.000,00 (80,0 %) y Tarjeta de débito $30.000,00 (20,0 %). |
| CP-DAS-006 | PASSED | Ingresos $200.000,00 y balance $50.000,00, con la etiqueta «Superávit». |
| CP-DAS-008 | PASSED | Con 15 movimientos en el mes, el Resumen muestra 10; «Ver todos» lleva a /transactions?period=2026-10 con los 15. |
| CP-DAS-010 | PASSED | Mayo 2026 sin datos: «No tenés movimientos registrados en mayo.» con un botón que lleva a /register, sin los totales. |
| CP-DAS-011 | PASSED | Con la sesión de B, las imputaciones de A del mes devuelven 0 filas, y sin filtro no aparece ninguna fila ajena. Nota: Ejecutado por API con dos sesiones reales. |
