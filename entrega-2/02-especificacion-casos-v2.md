# Entrega 2 · Especificación de casos de prueba (V2)

Planilla: `02-especificacion-casos-v2.xlsx` (un índice y una hoja por caso, mismo formato que la Entrega 1: ID, prioridad, técnica, trazabilidad, pre-requisitos, datos de prueba, pasos y resultado esperado). Alcance: los **212 casos** del catálogo de V2 después del recorte del 2026-10-27 (de 672 a 206 casos, más los 6 de Resumen por categoría que se sumaron ese día):

| Módulo | Historias | Casos |
|---|---|---|
| Deudas y gastos compartidos (DEU) | US-30, US-34 a US-41, US-79, US-82, US-83 | 61 |
| Navegación e interfaz (NAV) | US-69, US-70 | 25 |
| Exportar CSV (EXP) | US-47 | 31 |
| Importar Excel (IMP) | US-74, US-76, US-77, US-78 | 41 |
| Suscripciones (SUS) | US-52 a US-63, US-75 | 48 |
| Resumen por categoría (CAT) | US-72, US-73 | 6 |
| **Total** | | **212** |

La fuente de cada caso es su archivo de [`casos/`](casos/), con la trazabilidad `US-nn · CA-k → CP-*`, los huecos y las ambigüedades para el PO. Los IDs anteriores al recorte están en [`equivalencia-ids.md`](equivalencia-ids.md). El resultado de cada caso está en [`04-ejecucion.md`](04-ejecucion.md).

Los casos aparecen en dos redacciones:

- **En lenguaje simple (53 casos):** CP-DEU-005 a 010, CP-DEU-040 a 061 y los 25 de Navegación. Los pre-requisitos y los pasos dicen lo que hay que tocar en la aplicación y lo que se tendría que ver. Para CP-DEU-005 a 010, que en su versión original son llamadas directas a la API (función de varias personas de US-82, todavía no implementada), se describe la **prueba equivalente en la pantalla de Registrar** (caso gemelo), y la prueba original queda anotada en «Notas del diseño».
- **Con el formato del catálogo (159 casos):** el resto de Deudas, Exportar CSV, Importar Excel, Suscripciones y Resumen por categoría, como están en `casos/`. Usan los procedimientos `PR-nn` de [`docs/12-procedimientos-de-prueba.md`](../docs/12-procedimientos-de-prueba.md) y los marcadores de cada módulo (por ejemplo `<APP>`, `<HOY>` o `<TOKEN>`), definidos en sus convenciones.

## Cómo leer un caso

- **Pre-requisitos:** todo lo que tiene que estar listo antes del paso 1 (usuario, cuentas, categorías, gastos cargados, ancho de pantalla, herramientas). En el formato del catálogo se numeran `S 1`, `S 2`…
- **Datos de prueba:** los valores exactos que se escriben. En el formato del catálogo se numeran `D 1`, `D 2`…
- **Pasos y resultado esperado:** cada paso dice qué hacer y qué se tiene que ver; si se ve otra cosa, el caso falla.
- Cada caso usa **su propio usuario de prueba** (`qa+<id del caso>-001@example.com`, contraseña `Clave123!`): ningún caso depende de datos de otro.

## Índice

| ID | Prioridad | Título | User story | Camino feliz | Tipo | Técnica |
|---|---|---|---|---|---|---|
| CP-DEU-001 | Alta | El interruptor "Gasto compartido" aparece apagado en Gasto, despliega los campos al encenderse y al apagarse guarda el gasto sin deuda | US-34 | Sí | Positivo | Transición de estados |
| CP-DEU-002 | Alta | Registrar un gasto compartido de $120.000,00 ARS en 12 cuotas con Sofía por $60.000,00 crea la transacción, 12 cuotas y la deuda vinculada en una sola llamada RPC | US-34, US-35, US-82 | Sí | Positivo | Caso de uso |
| CP-DEU-003 | Alta | Registrar un gasto compartido en US$100,00 a TC 1250 con Sofía por US$40,00 congela fx_rate = 1250.0000 y amount_ars = 50000.00 y avisa en dólares | US-34 | Sí | Positivo | Partición de equivalencia |
| CP-DEU-004 | Media | El monto adeudado vacío muestra "Ingresá cuánto te debe" y deshabilita "Guardar gasto" | US-34 | No | Negativo | Partición de equivalencia |
| CP-DEU-005 | Alta | No se puede compartir un gasto si falta cuánto te deben | US-34, US-82 | No | Negativo | Partición de equivalencia |
| CP-DEU-006 | Alta | No se puede compartir un gasto si falta con quién | US-34, US-82 | No | Negativo | Partición de equivalencia |
| CP-DEU-007 | Alta | Un ingreso no se puede compartir | US-34, US-82 | No | Negativo | Partición de equivalencia |
| CP-DEU-008 | Alta | El nombre hecho solo de espacios no cuenta como nombre | US-34, US-82 | No | Negativo | Partición de equivalencia |
| CP-DEU-009 | Media | El nombre admite hasta 60 caracteres, no 61 | US-34, US-82 | No | Límite | Valores límite |
| CP-DEU-010 | Alta | No se puede deber 0 pesos | US-34, US-82 | No | Límite | Valores límite |
| CP-DEU-011 | Alta | Deuda de $10.000,00 sobre un gasto de $10.000,00 (igual al gasto) muestra "Tu parte: $0,00" y se guarda | US-41 | Sí | Límite | Valores límite |
| CP-DEU-012 | Alta | Deuda de $10.000,01 sobre un gasto de $10.000,00 (un centavo más) muestra "No puede superar el monto del gasto ($10.000,00)" y deshabilita "Guardar gasto" | US-41 | No | Límite | Valores límite |
| CP-DEU-013 | Alta | Directo contra create_transaction, una deuda de 10000.01 sobre un gasto de 10000.00 ARS se rechaza con "I7: la deuda no puede superar el monto del gasto" y revierte la transacción | US-41, US-82 | No | Límite | Valores límite |
| CP-DEU-014 | Media | En Movimientos, las 12 cuotas de un gasto compartido y "Últimos movimientos" muestran "Compartido con Sofía", mientras que un gasto sin deuda no tiene transactions-item-shared | US-35 | Sí | Positivo | Caso de uso |
| CP-DEU-015 | Alta | Eliminar el gasto vinculado oculta la deuda de /debts, deja de sumarla en "Te deben" y en el neto del Resumen, y conserva intacta su fila en debts | US-30, US-35, US-37 | Sí | Positivo | Transición de estados |
| CP-DEU-016 | Alta | Al restaurar desde Movimientos → Eliminados un gasto cuya deuda vinculada estaba saldada, la deuda vuelve a /debts con estado saldada y la misma fecha settled_at | US-35 | No | Positivo | Transición de estados |
| CP-DEU-017 | Alta | Estado inicial de /debts/new y guardado de una deuda "Me deben" en ARS por $20.000,00 crea una fila pendiente con transaction_id = null en una sola llamada a create_debt | US-36 | Sí | Positivo | Tabla de decisión |
| CP-DEU-018 | Alta | Guardar una deuda suelta con dirección "Debo" en ARS crea direction = "i_owe" y en la lista muestra "Le debés" | US-36 | Sí | Positivo | Tabla de decisión |
| CP-DEU-019 | Alta | En /debts/new, elegir "US$" con TC de referencia de 1250 precompleta "1.250,00", muestra "≈ $50.000,00" para US$40 y guarda fx_rate = 1250.0000 y amount_ars = 50000.00 | US-36 | Sí | Positivo | Tabla de decisión |
| CP-DEU-020 | Media | En /debts/new, elegir "US$" sin TC de referencia muestra "No tenés un tipo de cambio configurado para este mes", "Ir a Ajustes" y deshabilita "Guardar deuda" con "Falta el tipo de cambio" | US-36 | No | Negativo | Tabla de decisión |
| CP-DEU-021 | Media | En /debts/new, dejar "Persona" vacía "" y quitar el foco muestra "Ingresá el nombre de la persona" y deshabilita "Guardar deuda" | US-36 | No | Negativo | Partición de equivalencia |
| CP-DEU-022 | Alta | En /debts/new, un "Monto" igual a 0 muestra "El monto debe ser mayor a cero" | US-36 | No | Límite | Valores límite |
| CP-DEU-023 | Media | En /debts/new, un "Monto" con más de 2 decimales ("0,001") muestra "El monto admite hasta 2 decimales" | US-36 | No | Límite | Valores límite |
| CP-DEU-024 | Alta | En /debts/new con US$, Monto = 0,01 y TC = 0,5 se acepta (redondeo half-up a $0,01) y guarda amount_ars = "0.01" | US-36 | No | Límite | Valores límite |
| CP-DEU-025 | Alta | En /debts/new con US$, un "Tipo de cambio" igual a 0 muestra "El tipo de cambio debe ser mayor a cero" | US-36 | No | Límite | Valores límite |
| CP-DEU-026 | Alta | En /debts/new, una fecha posterior a hoy (<MAÑANA>) muestra "La fecha no puede ser futura" y deshabilita "Guardar deuda" | US-36 | No | Límite | Valores límite |
| CP-DEU-027 | Alta | Directo contra create_debt, p_person = "" se rechaza con "Ingresá el nombre de la persona" | US-36 | No | Negativo | Partición de equivalencia |
| CP-DEU-028 | Media | Directo contra create_debt, p_person de 61 caracteres se rechaza con "La persona admite hasta 60 caracteres" | US-36 | No | Límite | Valores límite |
| CP-DEU-029 | Alta | Directo contra create_debt, p_amount = 0 se rechaza con "I4: el monto debe ser mayor a cero" | US-36 | No | Límite | Valores límite |
| CP-DEU-030 | Media | Directo contra create_debt, p_amount = 1.001 (literal JSON) se rechaza con "I4: el monto admite hasta 2 decimales" | US-36 | No | Límite | Valores límite |
| CP-DEU-031 | Alta | Directo contra create_debt, p_currency = "USD" con p_fx_rate = null se rechaza con "I5: fx_rate es obligatorio si y solo si la moneda es USD" | US-36 | No | Negativo | Tabla de decisión |
| CP-DEU-032 | Media | Directo contra create_debt, p_currency = "ARS" con p_fx_rate = "1250.0000" se rechaza con "I5: fx_rate es obligatorio si y solo si la moneda es USD" | US-36 | No | Negativo | Tabla de decisión |
| CP-DEU-033 | Alta | Directo contra create_debt, p_incurred_on = "<MAÑANA>" se rechaza con "La fecha no puede ser posterior a hoy" | US-36 | No | Límite | Valores límite |
| CP-DEU-034 | Alta | Directo contra create_debt con el rol anon (sin Authorization) responde 42501 (permission denied) | US-36 | No | Negativo | Adivinación de errores |
| CP-DEU-035 | Alta | Un POST /rest/v1/debts directo con sesión autenticada responde 42501 (permission denied) y no crea filas | US-36 | No | Negativo | Adivinación de errores |
| CP-DEU-036 | Alta | La tarjeta de totales suma las deudas pendientes en pesos (incluyendo USD al TC congelado), excluye las saldadas y no cambia al cambiar el filtro de estado | US-37, US-38 | Sí | Positivo | Caso de uso |
| CP-DEU-037 | Alta | Cuando "Debés" supera a "Te deben", el neto muestra "En contra $5.000,00" | US-37 | No | Positivo | Partición de equivalencia |
| CP-DEU-038 | Alta | Cambiar el TC de referencia del mes a 1400 no modifica "Te deben" de una deuda en USD ya creada a TC 1250 (C5) | US-37 | No | Positivo | Caso de uso |
| CP-DEU-039 | Alta | /debts sin parámetros muestra "Pendientes" seleccionado y solo pendientes; tocar "Saldadas" y "Todas" actualiza ?status= y filtra la lista | US-38 | Sí | Positivo | Transición de estados |
| CP-DEU-040 | Baja | Un filtro inválido en la dirección se trata como «Pendientes» | US-38 | No | Negativo | Partición de equivalencia |
| CP-DEU-041 | Media | Deudas pendientes: la de fecha más nueva va primero | US-38 | No | Positivo | Caso de uso |
| CP-DEU-042 | Media | Sin deudas pendientes: mensaje y botón «Cargar una deuda» | US-38 | No | Límite | Partición de equivalencia |
| CP-DEU-043 | Alta | Otro usuario no ve las deudas de alguien más | US-38 | No | Negativo | Adivinación de errores |
| CP-DEU-044 | Alta | Por API, otro usuario no recibe las deudas de alguien más | US-38 | No | Negativo | Adivinación de errores |
| CP-DEU-045 | Alta | Por API, sin sesión no se pueden leer las deudas | US-38 | No | Negativo | Adivinación de errores |
| CP-DEU-046 | Alta | Marcar una deuda como saldada desde «Pendientes» | US-30, US-37, US-39 | Sí | Positivo | Transición de estados |
| CP-DEU-047 | Alta | «Deshacer» devuelve la deuda a pendiente | US-39 | No | Positivo | Transición de estados |
| CP-DEU-048 | Media | Saldar una deuda que ya se saldó en otra pestaña muestra un error | US-39 | No | Negativo | Transición de estados |
| CP-DEU-049 | Alta | Por API, saldar una deuda ya saldada se rechaza | US-39 | No | Negativo | Transición de estados |
| CP-DEU-050 | Alta | Por API, un usuario no puede saldar la deuda de otro | US-39 | No | Negativo | Adivinación de errores |
| CP-DEU-051 | Alta | Por API, no se puede modificar una deuda directamente | US-39 | No | Negativo | Adivinación de errores |
| CP-DEU-052 | Alta | «Volver a pendiente» desde «Saldadas» | US-40 | Sí | Positivo | Transición de estados |
| CP-DEU-053 | Media | Saldar y reabrir tres veces seguidas deja la deuda pendiente | US-40 | No | Límite | Transición de estados |
| CP-DEU-054 | Alta | Filtro por dirección: «Todas», «Te deben» y «Debés» | US-79 | Sí | Positivo | Transición de estados |
| CP-DEU-055 | Alta | Gasto compartido con varias personas: agregar, quitar y guardar | US-82 | Sí | Positivo | Caso de uso |
| CP-DEU-056 | Alta | Se puede compartir con hasta 10 personas | US-82 | No | Límite | Valores límite |
| CP-DEU-057 | Alta | Por API, deudas que suman más que el gasto se rechazan | US-82 | No | Límite | Valores límite |
| CP-DEU-058 | Alta | Resumen: gasto bruto y neto de reembolsos | US-30 | Sí | Positivo | Caso de uso |
| CP-DEU-059 | Alta | Resumen: el neto no cambia al saldar la deuda | US-30 | Sí | Positivo | Transición de estados |
| CP-DEU-060 | Alta | Resumen: una deuda suelta «Me deben» no cambia el neto | US-30 | No | Negativo | Partición de equivalencia |
| CP-DEU-061 | Alta | Resumen: el neto en dólares no cambia si cambia el tipo de cambio | US-30 | Sí | Positivo | Caso de uso |
| CP-NAV-001 | Media | La barra tiene cuatro secciones en el orden correcto | US-69 | Sí | Positivo | Caso de uso |
| CP-NAV-002 | Media | «Deudas» lleva a Deudas | US-69 | Sí | Positivo | Caso de uso |
| CP-NAV-003 | Media | En el Resumen la barra marca «Resumen» | US-69 | Sí | Positivo | Partición de equivalencia |
| CP-NAV-004 | Media | En Ajustes no se marca ninguna de las cuatro secciones | US-69 | Sí | Positivo | Partición de equivalencia |
| CP-NAV-005 | Media | Ancho 1023 px: barra abajo y engranaje de Ajustes | US-69 | No | Límite | Valores límite |
| CP-NAV-006 | Media | Ancho 1024 px: barra lateral con Ajustes al pie | US-69 | No | Límite | Valores límite |
| CP-NAV-007 | Media | Identificadores únicos en Registrar (375 px) | US-69 | Sí | Positivo | Valores límite |
| CP-NAV-008 | Media | «Ver todos» y «‹ Resumen» mantienen el mes | US-69 | Sí | Positivo | Caso de uso |
| CP-NAV-009 | Media | Deudas no arrastra el mes del Resumen | US-69 | Sí | Positivo | Partición de equivalencia |
| CP-NAV-010 | Alta | Tocar «Registrar» estando en Registrar no pierde lo cargado | US-69 | Sí | Positivo | Transición de estados |
| CP-NAV-011 | Media | Guardar $12.500 muestra la confirmación completa | US-10, US-70 | Sí | Positivo | Caso de uso |
| CP-NAV-012 | Alta | Sin internet el gasto no se pierde y aparece «Reintentar» | US-70 | No | Negativo | Adivinación de errores |
| CP-NAV-013 | Alta | Reintentar al volver internet guarda una sola vez | US-70 | Sí | Positivo | Transición de estados |
| CP-NAV-014 | Alta | Con internet muy lenta, a los 15 segundos avisa que falló | US-70 | No | Límite | Valores límite |
| CP-NAV-015 | Alta | Reintentar no duplica un gasto que ya se había guardado | US-70 | Sí | Positivo | Transición de estados |
| CP-NAV-016 | Alta | La misma clave dos veces seguidas devuelve el mismo gasto | US-70 | Sí | Positivo | Caso de uso |
| CP-NAV-017 | Alta | Dos pedidos simultáneos con la misma clave crean un solo gasto | US-70 | Sí | Positivo | Adivinación de errores |
| CP-NAV-018 | Alta | La misma clave en dos usuarios distintos no se pisa | US-70 | Sí | Positivo | Adivinación de errores |
| CP-NAV-019 | Alta | Si se archiva la categoría antes de guardar, el gasto se rechaza con aviso | US-70 | No | Negativo | Adivinación de errores |
| CP-NAV-020 | Alta | La API rechaza un gasto con una categoría archivada | US-70 | No | Negativo | Adivinación de errores |
| CP-NAV-021 | Alta | Al volver a Registrar aparece el gasto pendiente | US-70 | Sí | Positivo | Transición de estados |
| CP-NAV-022 | Alta | Recuperar un gasto que en realidad ya estaba guardado | US-70 | Sí | Positivo | Transición de estados |
| CP-NAV-023 | Alta | Descartar borra el pendiente, incluso al recargar | US-70 | Sí | Positivo | Transición de estados |
| CP-NAV-024 | Alta | Cerrar sesión borra los pendientes | US-70 | Sí | Positivo | Transición de estados |
| CP-NAV-025 | Alta | Tocar dos veces «Guardar» guarda una sola vez | US-70 | No | Límite | Adivinación de errores |
| CP-EXP-001 | Media | Una URL válida fija septiembre 2026 | US-47 | Sí | Positivo | Particiones de equivalencia |
| CP-EXP-002 | Alta | El mes siguiente está bloqueado | US-47 | No | Límite | Valores límite |
| CP-EXP-003 | Alta | El alcance mensual propone el nombre 2026-09 | US-47 | Sí | Positivo | Caso de uso |
| CP-EXP-004 | Alta | El primer día del mes se incluye | US-47 | No | Límite | Valores límite |
| CP-EXP-005 | Alta | El día posterior al mes se excluye | US-47 | No | Límite | Valores límite |
| CP-EXP-006 | Alta | El 1 de enero se incluye en el año | US-47 | No | Límite | Valores límite |
| CP-EXP-007 | Alta | El día posterior al año se excluye | US-47 | No | Límite | Valores límite |
| CP-EXP-008 | Alta | Una transacción eliminada queda fuera | US-47 | Sí | Positivo | Transición de estados |
| CP-EXP-009 | Alta | El archivo comienza con BOM UTF-8 | US-47 | Sí | Positivo | Caso de uso |
| CP-EXP-010 | Alta | El encabezado tiene doce columnas exactas | US-47 | Sí | Positivo | Caso de uso |
| CP-EXP-011 | Alta | Doce cuotas salen en una sola fila por el total | US-47 | No | Límite | Valores límite |
| CP-EXP-012 | Alta | ARS se escribe con dos decimales exactos | US-47 | Sí | Positivo | Particiones de equivalencia |
| CP-EXP-013 | Alta | USD conserva cuatro decimales de TC | US-47 | Sí | Positivo | Particiones de equivalencia |
| CP-EXP-014 | Alta | Una coma obliga a entrecomillar la descripción | US-47 | Sí | Positivo | Particiones de equivalencia |
| CP-EXP-015 | Alta | Las comillas internas se duplican | US-47 | Sí | Positivo | Particiones de equivalencia |
| CP-EXP-016 | Alta | Descripción con igual se neutraliza | US-47 | Sí | Positivo | Particiones de equivalencia |
| CP-EXP-017 | Alta | Una categoría que empieza con igual se neutraliza | US-47 | Sí | Positivo | Particiones de equivalencia |
| CP-EXP-018 | Alta | 1.500 transacciones se exportan sin faltantes | US-47 | No | Límite | Valores límite |
| CP-EXP-019 | Alta | El CSV de A no contiene movimientos de B | US-47 | No | Negativo | Particiones de equivalencia |
| CP-EXP-020 | Alta | La API con token de A devuelve cero filas de B | US-47 | No | Negativo | Particiones de equivalencia |
| CP-EXP-021 | Media | Categoría archivada sale con el nombre actual | US-47 | Sí | Positivo | Adivinación de errores |
| CP-EXP-022 | Media | Un ingreso exporta categoría vacía | US-47 | Sí | Positivo | Particiones de equivalencia |
| CP-EXP-023 | Alta | Un doble click inicia una sola descarga | US-47 | Sí | Positivo | Adivinación de errores |
| CP-EXP-024 | Media | Un mes sin transacciones muestra Vacío | US-47 | No | Límite | Valores límite |
| CP-EXP-025 | Alta | Offline muestra el error exacto | US-47 | No | Negativo | Transición de estados |
| CP-EXP-026 | Alta | El reintento después de Offline descarga completo | US-47 | No | Negativo | Transición de estados |
| CP-EXP-027 | Baja | Tocar fuera cierra sin descargar | US-47 | Sí | Positivo | Caso de uso |
| CP-EXP-028 | Media | Atrás cierra la hoja inicial | US-47 | Sí | Positivo | Transición de estados |
| CP-EXP-029 | Alta | Atrás durante Exportando cancela la descarga | US-47 | No | Negativo | Transición de estados |
| CP-EXP-030 | Alta | Una alta concurrente impide descargar un año incompleto | US-47 | No | Negativo | Adivinación de errores |
| CP-EXP-031 | Alta | HTTP 500 muestra Error y no descarga | US-47 | No | Negativo | Particiones de equivalencia |
| CP-IMP-001 | Media | El acceso desde Registrar abre el paso Archivo | US-74 | Sí | Positivo | Particiones de equivalencia |
| CP-IMP-002 | Media | A1 rechaza la extensión .xls | US-74 | No | Negativo | Particiones de equivalencia |
| CP-IMP-003 | Media | A2 rechaza 1.048.577 bytes | US-74 | No | Negativo | Particiones de equivalencia |
| CP-IMP-004 | Media | A3 rechaza un archivo dañado con extensión xlsx | US-74 | No | Negativo | Particiones de equivalencia |
| CP-IMP-005 | Media | A4 enumera tres encabezados obligatorios faltantes | US-74 | No | Negativo | Particiones de equivalencia |
| CP-IMP-006 | Media | A7 rechaza 501 filas con datos | US-74 | No | Negativo | Particiones de equivalencia |
| CP-IMP-007 | Media | El límite de filas acepta exactamente 500 | US-74 | No | Límite | Análisis de valores límite |
| CP-IMP-008 | Media | Los encabezados aceptan orden, mayúsculas, espacios y tildes distintos | US-74 | Sí | Positivo | Particiones de equivalencia |
| CP-IMP-009 | Media | F1: fecha vacía | US-76 | No | Negativo | Particiones de equivalencia |
| CP-IMP-010 | Media | F2: fecha inexistente | US-76 | No | Negativo | Particiones de equivalencia |
| CP-IMP-011 | Media | F3: fecha futura fija | US-76 | No | Negativo | Particiones de equivalencia |
| CP-IMP-012 | Media | F5: tipo inválido | US-76 | No | Negativo | Particiones de equivalencia |
| CP-IMP-013 | Media | F7: monto no numérico | US-76 | No | Negativo | Particiones de equivalencia |
| CP-IMP-014 | Alta | F8: monto cero | US-76 | No | Negativo | Particiones de equivalencia |
| CP-IMP-015 | Media | F9: monto con tres decimales | US-76 | No | Negativo | Particiones de equivalencia |
| CP-IMP-016 | Media | F12: moneda EUR | US-76 | No | Negativo | Particiones de equivalencia |
| CP-IMP-017 | Media | F13a: USD sin tipo de cambio | US-76 | No | Negativo | Particiones de equivalencia |
| CP-IMP-018 | Media | F13b: ARS con tipo de cambio | US-76 | No | Negativo | Particiones de equivalencia |
| CP-IMP-019 | Media | F14b: categoría inexistente | US-76 | No | Negativo | Particiones de equivalencia |
| CP-IMP-020 | Media | F14d: cuenta inexistente | US-76 | No | Negativo | Particiones de equivalencia |
| CP-IMP-021 | Media | F14e: trece cuotas | US-76 | No | Negativo | Particiones de equivalencia |
| CP-IMP-022 | Media | F15: cuotas en cuenta no crédito | US-76 | No | Negativo | Particiones de equivalencia |
| CP-IMP-023 | Media | Errores de varias columnas conservan el orden de reglas | US-76 | No | Negativo | Particiones de equivalencia |
| CP-IMP-024 | Media | Nombres, tipo y moneda aceptan espacios y mayúsculas | US-76 | Sí | Positivo | Particiones de equivalencia |
| CP-IMP-025 | Media | Categoría archivada no se acepta aunque el nombre coincida | US-76 | No | Negativo | Particiones de equivalencia |
| CP-IMP-026 | Media | El texto 1.500 se interpreta como mil quinientos | US-76 | Sí | Positivo | Particiones de equivalencia |
| CP-IMP-027 | Alta | El resumen del archivo de ejemplo suma solo las siete filas listas | US-76 | Sí | Positivo | Particiones de equivalencia |
| CP-IMP-028 | Media | El filtro muestra solo las cuatro filas con error | US-76 | Sí | Positivo | Particiones de equivalencia |
| CP-IMP-029 | Media | Cero filas listas deshabilita Importar 0 movimientos | US-76 | No | Negativo | Particiones de equivalencia |
| CP-IMP-030 | Alta | Confirmar importa solo las filas listas con todos sus campos | US-77 | Sí | Positivo | Particiones de equivalencia |
| CP-IMP-031 | Alta | La compra de 240.000 en seis cuotas crea seis imputaciones exactas | US-77 | Sí | Positivo | Particiones de equivalencia |
| CP-IMP-032 | Alta | Un rechazo tardío de categoría no impide las otras filas | US-77 | No | Negativo | Particiones de equivalencia |
| CP-IMP-033 | Alta | Quinientas filas de doce cuotas terminan en menos de diez segundos | US-77 | Sí | Positivo | Prueba de rendimiento |
| CP-IMP-034 | Alta | La RPC procesa una válida y rechaza tres inválidas | US-77 | No | Negativo | Particiones de equivalencia |
| CP-IMP-035 | Alta | La RPC rechaza un lote de 501 elementos | US-77 | No | Negativo | Análisis de valores límite |
| CP-IMP-036 | Alta | El rol anon no puede ejecutar import_transactions | US-77 | No | Negativo | Particiones de equivalencia |
| CP-IMP-037 | Alta | Otro usuario no ve transacciones ni imports ajenos | US-77 | No | Negativo | Particiones de equivalencia |
| CP-IMP-038 | Alta | Reintento tras respuesta perdida reconoce lo guardado | US-78 | Sí | Positivo | Transición de estados |
| CP-IMP-039 | Alta | Dos llamadas API con el mismo import_id son idempotentes | US-78 | Sí | Positivo | Particiones de equivalencia |
| CP-IMP-040 | Alta | Sin respuesta conserva Revisión | US-78 | No | Negativo | Particiones de equivalencia |
| CP-IMP-041 | Alta | Sesión vencida ofrece volver a entrar | US-78 | No | Negativo | Particiones de equivalencia |
| CP-SUS-001 | Alta | Dar de alta una suscripción en ARS desde hace 2 meses con día de cobro 10 genera los 2 gastos vencidos al guardar | US-52 | Sí | Positivo | Partición de equivalencia |
| CP-SUS-002 | Media | Dar de alta una suscripción en ARS desde el mes siguiente no genera gastos al guardar | US-52, US-53, US-61 | Sí | Positivo | Partición de equivalencia |
| CP-SUS-003 | Media | Dar de alta una suscripción con el mismo nombre que una suscripción cancelada se acepta | US-52, US-58 | No | Positivo | Transición de estados |
| CP-SUS-004 | Media | Rechazar en UI el alta de suscripción con Nombre vacío o solo espacios | US-52 | No | Negativo | Partición de equivalencia |
| CP-SUS-005 | Media | Rechazar en API `create_subscription` con Nombre vacío o solo espacios | US-52 | No | Negativo | Partición de equivalencia |
| CP-SUS-006 | Alta | Rechazar en UI el alta de suscripción con Nombre igual al de otra activa sin distinguir mayúsculas ni espacios (`" netflix "`) | US-52 | No | Negativo | Partición de equivalencia |
| CP-SUS-007 | Alta | Rechazar en API `create_subscription` con Nombre igual al de otra activa (`" netflix "`) | US-52 | No | Negativo | Partición de equivalencia |
| CP-SUS-008 | Alta | Rechazar en UI el alta de suscripción con Monto igual a `"0"` | US-52 | No | Negativo | Análisis de valores límite |
| CP-SUS-009 | Alta | Rechazar en API `create_subscription` con `p_amount = "0.00"` | US-52 | No | Negativo | Análisis de valores límite |
| CP-SUS-010 | Media | Rechazar en API `create_subscription` en ARS con Monto mayor al máximo (`"1000000000000.00"`) | US-52 | No | Negativo | Análisis de valores límite |
| CP-SUS-011 | Media | Rechazar en API `create_subscription` con `p_category_id = null` | US-52 | No | Negativo | Partición de equivalencia |
| CP-SUS-012 | Media | Rechazar en API `create_subscription` con `p_billing_day = 32` | US-52 | No | Negativo | Análisis de valores límite |
| CP-SUS-013 | Media | Rechazar en API `create_subscription` con Mes de inicio anterior al límite inferior (`-25` meses) | US-52 | No | Negativo | Análisis de valores límite |
| CP-SUS-014 | Media | Rechazar en API `create_subscription` con `p_end_period < p_start_period` | US-52 | No | Negativo | Análisis de valores límite |
| CP-SUS-015 | Baja | Rechazar en API `create_subscription` con Descripción de 201 caracteres | US-52 | No | Negativo | Análisis de valores límite |
| CP-SUS-016 | Media | Rechazar en API `create_subscription` con `p_category_id` propia archivada | US-52 | No | Negativo | Partición de equivalencia |
| CP-SUS-017 | Alta | Rechazar en API `create_subscription` usando `p_category_id` de otro usuario | US-52 | No | Negativo | Partición de equivalencia |
| CP-SUS-018 | Alta | Rechazar en API un `INSERT` directo sobre `/rest/v1/subscriptions` con la sesión del usuario | US-52 | No | Negativo | Partición de equivalencia |
| CP-SUS-019 | Media | Dos toques seguidos en `"Guardar suscripción"` deshabilitan el botón y crean una sola suscripción | US-52 | No | Positivo | Transición de estados |
| CP-SUS-020 | Alta | Rechazar en UI ver el detalle de una suscripción de otro usuario mostrando `subscription-detail-not-found` | US-52 | No | Negativo | Partición de equivalencia |
| CP-SUS-021 | Alta | Rechazar en API leer una suscripción de otro usuario (`GET /rest/v1/subscriptions` devuelve `[]`) | US-52 | No | Negativo | Partición de equivalencia |
| CP-SUS-022 | Alta | Rechazar en API `create_subscription` sin sesión autenticada (rol `anon`) | US-52 | No | Negativo | Partición de equivalencia |
| CP-SUS-023 | Baja | Mostrar estado vacío `subscriptions-empty` y ocultar la tarjeta del total comprometido cuando el usuario no tiene suscripciones | US-52, US-63 | No | Positivo | Partición de equivalencia |
| CP-SUS-024 | Alta | Puesta al día automática al entrar a la app genera 2 períodos vencidos pendientes y muestra el aviso `app-catchup-generated` | US-53 | Sí | Positivo | Partición de equivalencia |
| CP-SUS-025 | Alta | Dos llamadas consecutivas por API a `run_subscription_catchup` responden `200 OK` sin error y dejan exactamente 1 transacción por período | US-53 | No | Positivo | Transición de estados |
| CP-SUS-026 | Alta | Suscripción en estado `paused` no genera ocurrencias al ejecutar `run_subscription_catchup` | US-53, US-56 | No | Positivo | Transición de estados |
| CP-SUS-027 | Alta | Suscripción con día de cobro `31` entre `2026-01` y `2026-04` genera ocurrencias con fechas `31/01/2026`, `28/02/2026`, `31/03/2026` y `30/04/2026` | US-54, US-55, US-75 | No | Límite | Análisis de valores límite |
| CP-SUS-028 | Alta | Suscripción con día de cobro `<DIA_MAÑANA>` no genera la ocurrencia del mes corriente | US-53, US-55 | No | Límite | Análisis de valores límite |
| CP-SUS-029 | Alta | Suscripción con día de cobro igual a `<DIA_HOY>` genera la ocurrencia del mes corriente | US-53, US-55 | Sí | Límite | Análisis de valores límite |
| CP-SUS-030 | Alta | Pausar suscripción activa con día de cobro `28` (`> <DIA_HOY>`) muestra advertencia de este mes y pasa a `"Pausada desde <HOY>"` con piso en `<MES_SIGUIENTE>` | US-56 | Sí | Positivo | Transición de estados |
| CP-SUS-031 | Alta | `pause_subscription` por API ejecuta primero la puesta al día y genera los meses vencidos pendientes antes de pausar | US-56 | No | Positivo | Transición de estados |
| CP-SUS-032 | Alta | Rechazar en API `pause_subscription` usando la sesión de otro usuario (`404 PT404`) | US-56 | No | Negativo | Partición de equivalencia |
| CP-SUS-033 | Alta | Reanudar suscripción pausada abre `resume-subscription-dialog`, pasa a `"Activa"`, limpia `paused_at`, conserva `generate_from_period = '<MES_SIGUIENTE>-01'` y no genera el mes actual | US-56, US-57 | Sí | Positivo | Transición de estados |
| CP-SUS-034 | Alta | Cancelar suscripción activa con 4 gastos cargados mantiene el historial en el Detalle y en el Resumen y oculta los botones de acción | US-58 | Sí | Positivo | Transición de estados |
| CP-SUS-035 | Alta | Editar el monto de una suscripción activa de `$5.000,00` a `$7.000,00` conserva las 4 ocurrencias ya generadas en `$5.000,00` y muestra Moneda y Mes de inicio como solo lectura | US-59 | Sí | Positivo | Partición de equivalencia |
| CP-SUS-036 | Media | Rechazar en API `update_subscription` con `p_end_period` anterior al período corriente (`<MES_ANTERIOR>-01`) | US-59 | No | Negativo | Análisis de valores límite |
| CP-SUS-037 | Alta | Rechazar en UI renombrar una suscripción poniéndole el nombre de otra suscripción activa del mismo usuario | US-52, US-59 | No | Negativo | Partición de equivalencia |
| CP-SUS-038 | Media | Rechazar en UI editar una suscripción cancelada al navegar directo a `/subscriptions/<SUB_ID>/edit` | US-58, US-59 | No | Negativo | Transición de estados |
| CP-SUS-039 | Media | Rechazar en API cambiar `p_category_id` en `update_subscription` a otra categoría archivada distinta de la actual | US-59 | No | Negativo | Partición de equivalencia |
| CP-SUS-040 | Alta | Eliminar desde Movimientos la ocurrencia de `<MES_ANTERIOR>` muestra `delete-transaction-subscription-note`, figura con `"Eliminado"` en el Detalle y no vuelve a crearse al recargar | US-60 | Sí | Positivo | Transición de estados |
| CP-SUS-041 | Alta | Mostrar la marca de suscripción en Movimientos y en `"Últimos movimientos"` del Resumen (y no en un gasto manual) y navegar al Detalle al tocarla | US-61 | Sí | Positivo | Partición de equivalencia |
| CP-SUS-042 | Alta | La ocurrencia generada de una suscripción suma en `"Gastado en <mes corto>"` y resta en `"Balance"` del Resumen de V1 | US-53, US-61 | No | Positivo | Partición de equivalencia |
| CP-SUS-043 | Alta | Suscripción activa en USD con tipo de cambio en `<MES_HACE_2>` y sin tipo de cambio en `<MES_ANTERIOR>` genera solo `<MES_HACE_2>`, muestra `"Falta tipo de cambio"` y el botón `"Cargar tipo de cambio"` navega a `/settings?period=<MES_ANTERIOR>` | US-62 | Sí | Positivo | Partición de equivalencia |
| CP-SUS-044 | Alta | Con dos suscripciones activas en ARS (`$5.000,00` y `$2.500,00`), el total mensual comprometido muestra `"$7.500,00"` y `"2 suscripciones activas este mes"` | US-63 | Sí | Positivo | Partición de equivalencia |
| CP-SUS-045 | Alta | Suscripción activa en `USD 10,00` con tipo de cambio del período corriente `1.250,00` suma `"$12.500,00"` al total mensual comprometido | US-63 | No | Positivo | Partición de equivalencia |
| CP-SUS-046 | Media | Una suscripción en estado `paused` no suma al total mensual comprometido (`"$0,00"` y `"No tenés suscripciones activas este mes"`) | US-63 | No | Positivo | Partición de equivalencia |
| CP-SUS-047 | Alta | Vista previa en `/subscriptions/new` con `$5.000,00` ARS, día `28` (`> <DIA_HOY>`), desde `<MES_HACE_2>` y sin fin muestra 2 meses en `"Se cargan al guardar"`, 3 en `"Próximos cobros"`, resumen de `"$10.000,00"` y al guardar crea exactamente esas 2 transacciones | US-52, US-75 | Sí | Positivo | Partición de equivalencia |
| CP-SUS-048 | Alta | Vista previa en `/subscriptions/new` en USD con tipo de cambio en `<MES_HACE_2>` y sin tipo de cambio en `<MES_ANTERIOR>` marca `<MES_ANTERIOR>` con `data-blocked="true"` y no lo cuenta en el resumen | US-75 | No | Positivo | Partición de equivalencia |
| CP-CAT-001 | Alta | La torta muestra una porción por categoría, con su monto y su porcentaje | US-72 | Sí | Positivo | Caso de uso |
| CP-CAT-002 | Alta | Los ingresos y los gastos eliminados no entran en la torta | US-72 | No | Negativo | Adivinación de errores |
| CP-CAT-003 | Media | Con 7 categorías, las dos más chicas se agrupan en «Resto» en la torta | US-72 | No | Límite | Valores límite |
| CP-CAT-004 | Alta | Tocar una categoría del Resumen abre su detalle del mes | US-73 | Sí | Positivo | Caso de uso |
| CP-CAT-005 | Media | En el detalle, «Mes anterior» y «‹ Resumen» conservan la categoría y el mes | US-73 | Sí | Positivo | Transición de estados |
| CP-CAT-006 | Media | Una categoría que no existe muestra un aviso con salida al Resumen | US-73 | No | Negativo | Partición de equivalencia |

## Casos redactados en lenguaje simple (Deudas y Navegación)

### CP-DEU-005 — No se puede compartir un gasto si falta cuánto te deben

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Trazabilidad | US-34 · CA-8 · US-82 · CA-14, CA-15 · FR-18 · I4 · C4 · C6 |
| Historias de usuario | US-34, US-82 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-005-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-005-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**

- Monto del gasto: $20.000
- Persona: Sofía
- Monto que te deben: (vacío)

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 20000 en el monto y tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?»). |
| 2 | Tocar la categoría «Otros». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 3 | Prender el interruptor «Gasto compartido». | Aparecen los campos «¿Con quién?» y «¿Cuánto te debe?». |
| 4 | En «¿Con quién?» escribir Sofía. | El campo muestra «Sofía». |
| 5 | Tocar «¿Cuánto te debe?», no escribir nada y tocar «¿Con quién?» para salir del campo. | Debajo de «¿Cuánto te debe?» aparece «Ingresá cuánto te debe» y «Guardar gasto» queda deshabilitado (gris). |
| 6 | Abrir Movimientos (Resumen → «Ver todos») y Deudas, y mirar las listas. | No aparece ningún gasto ni deuda nueva: no se guardó nada. |

**Notas del diseño:** Prueba original por API (create_transaction con p_shared_persons = ["Sofía"] y p_shared_amounts = null): rechazo «Un gasto compartido necesita una persona y un monto por cada deuda». Se prueba su equivalente de pantalla (caso gemelo CP-DEU-004).

---

### CP-DEU-006 — No se puede compartir un gasto si falta con quién

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Trazabilidad | US-34 · CA-8 · US-82 · CA-14, CA-15 · FR-18 · C4 · C6 |
| Historias de usuario | US-34, US-82 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-006-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-006-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**

- Monto del gasto: $20.000
- Persona: (vacía)
- Monto que te deben: $10.000

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 20000 en el monto y tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?»). |
| 2 | Tocar la categoría «Otros». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 3 | Prender el interruptor «Gasto compartido». | Aparecen los campos «¿Con quién?» y «¿Cuánto te debe?». |
| 4 | En «¿Cuánto te debe?» escribir 10000. | El campo muestra 10000. |
| 5 | Tocar «¿Con quién?», no escribir nada y tocar «¿Cuánto te debe?» para salir del campo. | Debajo de «¿Con quién?» aparece «Ingresá con quién compartiste el gasto» y «Guardar gasto» queda deshabilitado (gris). |
| 6 | Abrir Movimientos (Resumen → «Ver todos») y Deudas, y mirar las listas. | No aparece ningún gasto ni deuda nueva: no se guardó nada. |

**Notas del diseño:** Prueba original por API (p_shared_persons = null con p_shared_amounts = ["10000.00"]). Equivalente de pantalla: el caso gemelo de Registrar, que se quitó del catálogo en el recorte.

---

### CP-DEU-007 — Un ingreso no se puede compartir

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Trazabilidad | US-34 · CA-8 · US-82 · CA-14, CA-15 · FR-18 · I7 · C4 · C6 |
| Historias de usuario | US-34, US-82 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-007-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-007-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**

- Tipo: Ingreso
- Monto: $100.000

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar tocar «Ingreso» (en vez de «Gasto»). | «Ingreso» queda seleccionado. |
| 2 | Escribir 100000 en el monto y tocar «Siguiente». | Se abre el último paso, «Revisá y guardá», con el botón «Guardar ingreso». |
| 3 | Mirar el último paso, debajo de «Nota (opcional)». | No existe la sección «Gasto compartido» ni su interruptor: no hay forma de marcar un ingreso como compartido. |

**Notas del diseño:** Prueba original por API (p_type = "income" con una deuda): rechazo «Un ingreso no se puede compartir». Equivalente de pantalla: el caso gemelo de Registrar, que se quitó del catálogo en el recorte.

---

### CP-DEU-008 — El nombre hecho solo de espacios no cuenta como nombre

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Trazabilidad | US-34 · CA-8 · US-82 · CA-14, CA-15 · FR-18 · C4 · C6 |
| Historias de usuario | US-34, US-82 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-008-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-008-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**

- Monto del gasto: $20.000
- Persona: 3 espacios en blanco
- Monto que te deben: $10.000

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 20000 en el monto y tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?»). |
| 2 | Tocar la categoría «Otros». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 3 | Prender el interruptor «Gasto compartido». | Aparecen los campos «¿Con quién?» y «¿Cuánto te debe?». |
| 4 | En «¿Con quién?» apretar la barra espaciadora tres veces (el campo parece vacío). | El campo tiene tres espacios. |
| 5 | En «¿Cuánto te debe?» escribir 10000. | Debajo de «¿Con quién?» aparece «Ingresá con quién compartiste el gasto» y «Guardar gasto» queda deshabilitado (gris). |
| 6 | Abrir Movimientos (Resumen → «Ver todos») y Deudas, y mirar las listas. | No aparece ningún gasto ni deuda nueva: no se guardó nada. |

**Notas del diseño:** Prueba original por API (p_shared_persons = ["   "]). Equivalente de pantalla: el caso gemelo de Registrar, que se quitó del catálogo en el recorte.

---

### CP-DEU-009 — El nombre admite hasta 60 caracteres, no 61

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-34 · CA-8 · US-82 · CA-14, CA-15 · FR-18 · C4 · C6 |
| Historias de usuario | US-34, US-82 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-009-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-009-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**

- Monto del gasto: $20.000
- Texto de 61 caracteres: A123456789B123456789C123456789D123456789E123456789F123456789Z
- Fecha: 15/08/2026
- Monto que te deben: $10.000

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 20000 en el monto y tocar «Siguiente». | Se abre el paso 2 de 3. |
| 2 | Tocar la categoría «Otros». | Se abre el paso 3 de 3. |
| 3 | En «Fecha» tocar «Otra» y escribir 15/08/2026. | La fecha muestra 15/08/2026. |
| 4 | Prender «Gasto compartido». | Aparecen «¿Con quién?» y «¿Cuánto te debe?». |
| 5 | En «¿Con quién?» escribir o pegar el texto de 61 caracteres de los datos de prueba. | El campo acepta solo los primeros 60 caracteres (termina en «…F123456789»): la «Z» final no entra. |
| 6 | En «¿Cuánto te debe?» escribir 10000. | Se habilita «Guardar gasto». |
| 7 | Tocar «Guardar gasto» y abrir Deudas con el filtro «Todas». | Aparece «Gasto guardado» y en Deudas hay una deuda cuyo nombre tiene exactamente los 60 caracteres. |

**Notas del diseño:** Prueba original por API (nombre de 61 caracteres): rechazo «La persona admite hasta 60 caracteres». Equivalente de pantalla: el caso gemelo de Registrar, que se quitó del catálogo en el recorte.

---

### CP-DEU-010 — No se puede deber 0 pesos

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-34 · CA-8 · US-82 · CA-14, CA-15 · FR-18 · I4 · C4 · C6 |
| Historias de usuario | US-34, US-82 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-010-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-010-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**

- Monto del gasto: $20.000
- Persona: Sofía
- Monto que te deben: 0

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 20000 en el monto y tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?»). |
| 2 | Tocar la categoría «Otros». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 3 | Prender el interruptor «Gasto compartido». | Aparecen los campos «¿Con quién?» y «¿Cuánto te debe?». |
| 4 | En «¿Con quién?» escribir Sofía. | El campo muestra «Sofía». |
| 5 | Tocar «¿Cuánto te debe?», escribir 0 y tocar «¿Con quién?» para salir del campo. | Debajo de «¿Cuánto te debe?» aparece «El monto debe ser mayor a cero» y «Guardar gasto» queda deshabilitado (gris). |
| 6 | Abrir Movimientos (Resumen → «Ver todos») y Deudas, y mirar las listas. | No aparece ningún gasto ni deuda nueva: no se guardó nada. |

**Notas del diseño:** Prueba original por API (p_shared_amounts = [0]): rechazo «I4: el monto de la deuda debe ser mayor a cero». Equivalente de pantalla: el caso gemelo de Registrar, que se quitó del catálogo en el recorte.

---

### CP-DEU-040 — Un filtro inválido en la dirección se trata como «Pendientes»

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Baja |
| Camino feliz | No |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Trazabilidad | US-38 · CA-4 · FR-18 · C11 |
| Historias de usuario | US-38 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-040-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-040-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Deudas D 1 y D 2 creadas desde Deudas → «Nueva deuda», y D 2 saldada con el botón «Marcar saldada».

**Datos de prueba:**

- D 1: Sofía te debe $60.000, con fecha 15/08/2026.
- D 2: Pedro te debe $8.000, con fecha 10/08/2026.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts?status=xyz a la dirección de la app y apretar Enter. | «Pendientes» queda seleccionado y la lista muestra solo la fila pendiente de «Sofía». |
| 2 | Tocar el filtro «Saldadas». | La URL pasa a /debts?status=settled y se muestra solo la fila de «Pedro». |

---

### CP-DEU-041 — Deudas pendientes: la de fecha más nueva va primero

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Caso de uso · Positivo |
| Trazabilidad | US-38 · CA-5 (parte 1) · FR-18 · — |
| Historias de usuario | US-38 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-041-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-041-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. 3 deudas pendientes creadas secuencialmente (esperando 2 segundos entre cada una) desde Deudas → «Nueva deuda».

**Datos de prueba:**

- D 1: Ana te debe $10.000, con fecha 01/10/2026.
- D 2: Beto te debe $20.000, con fecha 15/08/2026.
- D 3: Carla te debe $30.000, con fecha 01/10/2026.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts a la dirección de la app y apretar Enter. | En «Pendientes», las 3 filas aparecen de arriba hacia abajo en el orden exacto: 1.º «Carla» (01/10/2026, creada más reciente), 2.º «Ana» (01/10/2026, creada antes), 3.º «Beto» (15/08/2026). |

---

### CP-DEU-042 — Sin deudas pendientes: mensaje y botón «Cargar una deuda»

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Partición de equivalencia · Límite |
| Trazabilidad | US-38 · CA-7, CA-11 · FR-18 · — |
| Historias de usuario | US-38 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-042-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-042-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts a la dirección de la app y apretar Enter. | Se muestra el mensaje de lista vacía con el texto exacto «No tenés deudas pendientes.» y el botón «Cargar una deuda». |
| 2 | Tocar el botón «Cargar una deuda». | Navega a /debts/new. |

---

### CP-DEU-043 — Otro usuario no ve las deudas de alguien más

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Trazabilidad | US-38 · CA-9 · FR-18 · C7 |
| Historias de usuario | US-38 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Dos usuarios de prueba nuevos, cada uno con su propia sesión (ventana de incógnito distinta): Usuario A (qa+cp-deu-043-a@example.com) y Usuario B (qa+cp-deu-043-b@example.com), los dos con contraseña Clave123!. Cómo crearlos: en la pantalla «Entrar» tocar «Crear una cuenta», completar el email, la contraseña y «Confirmar contraseña», tocar «Crear cuenta» y «Saltear» en los 4 pasos de la configuración inicial. El caso se mira desde la ventana de incógnito del Usuario B.

**Datos de prueba:**

- D 1: Sofía te debe $60.000, con fecha 15/08/2026 (cargada por el Usuario A).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la ventana de incógnito donde inició sesión el Usuario B (qa+cp-deu-043-b@example.com), escribir /debts?status=all en la barra de direcciones y apretar Enter. | «Te deben» muestra «$0,00», «Debés» muestra «$0,00», el neto muestra «En cero» y se ve el estado vacío «No cargaste ninguna deuda todavía.» (0 filas del Usuario A visibles). |

---

### CP-DEU-044 — Por API, otro usuario no recibe las deudas de alguien más

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Trazabilidad | US-38 · CA-9 (parte 1) · FR-18 · C7 |
| Historias de usuario | US-38 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Dos usuarios de prueba NUEVOS: A (qa+cp-deu-044-a@example.com) y B (qa+cp-deu-044-b@example.com), los dos con contraseña Clave123!. Cómo crearlos: en la pantalla «Entrar» tocar «Crear una cuenta», completar el email, la contraseña y «Confirmar contraseña», tocar «Crear cuenta» y «Saltear» en los 4 pasos de la configuración inicial; cada usuario en su propia ventana de incógnito.
4. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
5. Token de cada usuario: igual que el token de un solo usuario (POST a SUPABASE_URL/auth/v1/token?grant_type=password con «apikey» = ANON_KEY y el email y la contraseña del usuario); copiar el «access_token» de A y el de B.
6. Usuarios A y B. Una deuda «Sofía te debe $60.000» con fecha 15/08/2026, cargada por A (desde Deudas → «Nueva deuda» con la sesión de A).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Con el token del usuario B pedir GET a /rest/v1/debts?select=* y a /rest/v1/debts?id=eq.<ID de la deuda de A>. | Las dos respuestas son 200 con la lista vacía []: B no ve nada de A. |

**Notas del diseño:** Caso por API: se hace con Postman (o curl), no desde la pantalla.

---

### CP-DEU-045 — Por API, sin sesión no se pueden leer las deudas

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Trazabilidad | US-38 · CA-9 (parte 2) · C7 · FR-18 · C7 |
| Historias de usuario | US-38 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
3. Ninguna: la consulta se hace sin sesión.

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Pedir GET a /rest/v1/debts?select=* enviando solo el encabezado «apikey» (sin «Authorization»). | Responde 401 o 403 con el código 42501 («permission denied for table debts»). |

**Notas del diseño:** Caso por API: se hace con Postman (o curl), no desde la pantalla.

---

### CP-DEU-046 — Marcar una deuda como saldada desde «Pendientes»

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-39 · CA-1, CA-8 · US-37 · CA-5 · US-30 · CA-2 · FR-18 · I9 |
| Historias de usuario | US-30, US-37, US-39 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-046-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-046-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Deuda D 1 creada desde Deudas → «Nueva deuda».

**Datos de prueba:**

- D 1: Sofía te debe $60.000, con fecha 15/08/2026.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts a la dirección de la app y apretar Enter. | Se muestra «Te deben» = «$60.000,00», «A tu favor $60.000,00» y la fila de «Sofía» con el botón «Marcar saldada». |
| 2 | Tocar el botón «Marcar saldada» de la fila de «Sofía». | La fila de «Sofía» sale de la lista de «Pendientes», aparece el estado vacío «No tenés deudas pendientes.», aparece el aviso con el texto exacto «Deuda con Sofía saldada» y el botón «Deshacer», y en la tarjeta de totales «Te deben» baja en el acto a «$0,00» y el neto pasa a «En cero». |

---

### CP-DEU-047 — «Deshacer» devuelve la deuda a pendiente

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-39 · CA-4 (parte 1) · FR-18 · I9 |
| Historias de usuario | US-39 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-047-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-047-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Deuda D 1 creada desde Deudas → «Nueva deuda».

**Datos de prueba:**

- D 1: Sofía te debe $60.000, con fecha 15/08/2026.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts a la dirección de la app y apretar Enter. | Se ve la fila de «Sofía» en «Pendientes». |
| 2 | Tocar «Marcar saldada». | Aparece el aviso («Deuda con Sofía saldada») con el botón «Deshacer». |
| 3 | Antes de que pasen 5 segundos, tocar el botón «Deshacer». | El aviso desaparece, la fila de «Sofía» vuelve a aparecer en «Pendientes» y «Te deben» vuelve a «$60.000,00». |

---

### CP-DEU-048 — Saldar una deuda que ya se saldó en otra pestaña muestra un error

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Transición de estados · Negativo |
| Trazabilidad | US-39 · CA-5 · FR-18 · I9 |
| Historias de usuario | US-39 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-048-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-048-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Deuda D 1 creada desde Deudas → «Nueva deuda».

**Datos de prueba:**

- D 1: Sofía te debe $60.000, con fecha 15/08/2026.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la Pestaña 1, escribir /debts?status=all en la barra de direcciones y apretar Enter. | En la Pestaña 1 se ve la fila de «Sofía» pendiente con el botón «Marcar saldada». |
| 2 | Abrir una segunda pestaña (Pestaña 2) en la misma ventana de incógnito, escribir /debts?status=all y apretar Enter. | En la Pestaña 2 también se ve la fila de «Sofía» pendiente con el botón «Marcar saldada». |
| 3 | En la Pestaña 2, tocar «Marcar saldada». | En la Pestaña 2 la deuda de «Sofía» pasa a saldada. |
| 4 | Volver a la Pestaña 1 (sin recargarla) y tocar el botón «Marcar saldada». | En la Pestaña 1 aparece el aviso de error con «No se pudo actualizar la deuda» y el motivo «La deuda ya está saldada», y la lista se refresca mostrando la fila de «Sofía» como saldada. |

---

### CP-DEU-049 — Por API, saldar una deuda ya saldada se rechaza

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Transición de estados · Negativo |
| Trazabilidad | US-39 · CA-6 (parte 1) · FR-18 · I9 · C6 |
| Historias de usuario | US-39 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-049-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
5. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-deu-049-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
6. Una deuda «Sofía te debe $60.000» con fecha 15/08/2026, ya marcada como saldada (botón «Marcar saldada»).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Con el token del usuario, enviar POST a /rest/v1/rpc/settle_debt con {"p_debt_id": "<ID de una deuda ya saldada>"}. | Responde 400 con el código 23514 y el mensaje «La deuda ya está saldada»; la deuda sigue saldada con su fecha original. |

**Notas del diseño:** Caso por API: se hace con Postman (o curl), no desde la pantalla.

---

### CP-DEU-050 — Por API, un usuario no puede saldar la deuda de otro

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Trazabilidad | US-39 · CA-6 (parte 2) · ADR-037 §3 · FR-18 · C6 · C7 |
| Historias de usuario | US-39 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Dos usuarios de prueba NUEVOS: A (qa+cp-deu-050-a@example.com) y B (qa+cp-deu-050-b@example.com), los dos con contraseña Clave123!. Cómo crearlos: en la pantalla «Entrar» tocar «Crear una cuenta», completar el email, la contraseña y «Confirmar contraseña», tocar «Crear cuenta» y «Saltear» en los 4 pasos de la configuración inicial; cada usuario en su propia ventana de incógnito.
4. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
5. Token de cada usuario: igual que el token de un solo usuario (POST a SUPABASE_URL/auth/v1/token?grant_type=password con «apikey» = ANON_KEY y el email y la contraseña del usuario); copiar el «access_token» de A y el de B.
6. Usuarios A y B. Una deuda «Sofía te debe $60.000» con fecha 15/08/2026, cargada por A y pendiente.

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Con el token del usuario B, enviar POST a /rest/v1/rpc/settle_debt con el ID de una deuda del usuario A. | Responde 400 con el código 23514 y «La deuda no existe»; la deuda de A sigue pendiente. |

**Notas del diseño:** Caso por API: se hace con Postman (o curl), no desde la pantalla.

---

### CP-DEU-051 — Por API, no se puede modificar una deuda directamente

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Trazabilidad | US-39 · CA-7 · ADR-037 §1 · FR-18 · C7 |
| Historias de usuario | US-39 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-051-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
5. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-deu-051-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
6. Una deuda «Sofía te debe $60.000» con fecha 15/08/2026 (pendiente).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Con el token del usuario, enviar PATCH a /rest/v1/debts?id=eq.<ID> con {"status": "settled"}. | Responde 403 con el código 42501 («permission denied for table debts»); la deuda sigue pendiente. |

**Notas del diseño:** Caso por API: se hace con Postman (o curl), no desde la pantalla.

---

### CP-DEU-052 — «Volver a pendiente» desde «Saldadas»

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-40 · CA-1, CA-2 · FR-18 · I9 · C10 |
| Historias de usuario | US-40 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-052-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-052-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Deuda creada desde Deudas → «Nueva deuda».

**Datos de prueba:**

- D 1: Sofía te debe US$40 (a tipo de cambio 1250), con fecha 15/08/2026 y nota «Viaje».

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts?status=settled a la dirección de la app y apretar Enter. | Se ve la fila de «Sofía» con el botón «Volver a pendiente». |
| 2 | Tocar «Volver a pendiente». | La fila sale de «Saldadas», aparece «Todavía no saldaste ninguna deuda.» y se muestra el aviso con el texto exacto «La deuda con Sofía volvió a pendiente». |

---

### CP-DEU-053 — Saldar y reabrir tres veces seguidas deja la deuda pendiente

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Transición de estados · Límite |
| Trazabilidad | US-40 · CA-5 · FR-18 · I9 |
| Historias de usuario | US-40 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-053-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-053-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Deuda pendiente creada desde Deudas → «Nueva deuda».
6. Fechas que dependen de hoy: «mes actual» es el mes de hoy; «mes anterior» es el mes calendario anterior; «el día 10 del mes actual» es el día 10 del mes de hoy (si hoy es antes del 10, la fecha de hoy); «el día 15 del mes anterior» es el 15 del mes anterior; «hoy» es el día en que se ejecuta el caso. En las direcciones, period=AAAA-MM es el año y el mes con dos dígitos (por ejemplo, para octubre de 2026: period=2026-10).

**Datos de prueba:**

- D 1: Sofía te debe $60.000, con fecha 15/08/2026.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts?status=all a la dirección de la app y apretar Enter. | Se ve 1 sola fila («Sofía», pendiente). |
| 2 | Tocar «Marcar saldada». | La fila pasa a «Saldada el [fecha de hoy]» con el botón «Volver a pendiente». |
| 3 | Tocar «Volver a pendiente». | La fila vuelve a «Pendiente» con el botón «Marcar saldada». |
| 4 | Tocar «Marcar saldada». | La fila pasa a «Saldada el [fecha de hoy]» con el botón «Volver a pendiente». |
| 5 | Tocar «Volver a pendiente». | La fila vuelve a «Pendiente» con el botón «Marcar saldada». |
| 6 | Tocar «Marcar saldada». | La fila pasa a «Saldada el [fecha de hoy]» con el botón «Volver a pendiente». |
| 7 | Tocar «Volver a pendiente». | En /debts?status=all sigue habiendo exactamente 1 fila, con estado «Pendiente» y «Te deben» = «$60.000,00». |

---

### CP-DEU-054 — Filtro por dirección: «Todas», «Te deben» y «Debés»

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-79 · CA-1, CA-2, CA-7, CA-8, CA-9 · FR-18 · C11 |
| Historias de usuario | US-79 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-054-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-054-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Deudas pendientes D 1 y D 2 creadas desde Deudas → «Nueva deuda».

**Datos de prueba:**

- D 1: Sofía te debe $60.000, con fecha 15/08/2026.
- D 2: Le debés $15.000 a Ana, con fecha 15/08/2026.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts a la dirección de la app y apretar Enter. | Debajo del filtro de estado aparece el filtro de dirección con «Todas» (seleccionado), «Te deben» y «Debés». Se ven las 2 filas («Sofía» y «Ana»). |
| 2 | Tocar «Te deben». | La URL cambia a /debts?direction=owed_to_me, «Te deben» queda seleccionado, la lista muestra solo a «Sofía», la tarjeta de totales sigue mostrando «Te deben» = «$60.000,00», «Debés» = «$15.000,00» y «A tu favor $45.000,00». |
| 3 | Tocar «Debés». | La URL cambia a /debts?direction=i_owe, «Debés» queda seleccionado, la lista muestra solo a «Ana», la tarjeta de totales no cambia. |

---

### CP-DEU-055 — Gasto compartido con varias personas: agregar, quitar y guardar

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Caso de uso · Positivo |
| Trazabilidad | US-82 · CA-1, CA-2, CA-10, CA-22 · FR-18 · I7 |
| Historias de usuario | US-82 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-055-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-055-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Escribir 120000 en el monto y tocar «Siguiente». | Se abre el paso 2 de 3. |
| 2 | Tocar la categoría «Otros». | Se abre el paso 3 de 3. |
| 3 | En «Fecha» tocar «Otra» y escribir 15/08/2026. | El campo de fecha muestra 15/08/2026. |
| 4 | Tocar el interruptor «Gasto compartido». | Aparece 1 sola fila vacía, sin botón «Quitar»; debajo se ven los botones «Agregar persona» y «Dividir en partes iguales». |
| 5 | En la fila 1 escribir Sofía en «¿Con quién?» y 40000 en «¿Cuánto te debe?». | La fila 1 muestra Sofía y 40000. |
| 6 | Tocar «Agregar persona». | Se agrega la fila 2 vacía al final, el cursor queda en «¿Con quién?» de la fila 2 y aparece el botón «Quitar» en las dos filas. |
| 7 | En la fila 2 escribir Juan en «¿Con quién?» y 40000 en «¿Cuánto te debe?». | El resumen muestra «Te van a deber $80.000,00 entre 2 personas · Tu parte: $40.000,00». |
| 8 | Tocar «Guardar gasto». | Aparece el aviso «Gasto guardado» con la descripción «Juan y Sofía te deben $80.000,00». |
| 9 | Agregar /transactions?period=2026-08 a la dirección de la app y apretar Enter. | La fila del gasto muestra la etiqueta «Compartido con Juan y Sofía». |
| 10 | Agregar /dashboard?period=2026-08 a la dirección de la app y apretar Enter. | En «Últimos movimientos», la fila del gasto muestra «Compartido con Juan y Sofía». |

---

### CP-DEU-056 — Se puede compartir con hasta 10 personas

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-82 · CA-5, CA-22 · FR-18 · I7 |
| Historias de usuario | US-82 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-056-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-056-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Escribir 110000 en el campo del monto y tocar «Siguiente». | Se abre el paso 2 de 3. |
| 2 | Tocar la categoría «Otros». | Se abre el paso 3 de 3. |
| 3 | En la sección «Fecha», tocar «Otra» y escribir 15/08/2026. | El campo de fecha muestra 15/08/2026. |
| 4 | Tocar el interruptor «Gasto compartido». | Aparece la fila 1. |
| 5 | Completar la fila 1 con Persona 01 y 10000, y tocar 9 veces en «Agregar persona», completando las filas 2 a 10 con Persona 02 a Persona 10 y 10000 en cada una. | Hay 10 filas, el botón «Agregar persona» está deshabilitado (disabled), y aparece el texto exacto «Podés compartir un gasto con hasta 10 personas». |
| 6 | Tocar el botón «Guardar gasto». | Aparece el aviso «Gasto guardado» con la descripción exacta «Persona 01, Persona 02, Persona 03, Persona 04, Persona 05, Persona 06, Persona 07, Persona 08, Persona 09 y Persona 10 te deben $100.000,00». |

---

### CP-DEU-057 — Por API, deudas que suman más que el gasto se rechazan

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-82 · CA-14 · FR-18 · I7 |
| Historias de usuario | US-82 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-057-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
5. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-deu-057-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
6. Identificadores de la categoría «Otros» y de la cuenta «Efectivo»: pedidos GET a SUPABASE_URL/rest/v1/categories?select=id,name y SUPABASE_URL/rest/v1/accounts?select=id,name,type con los encabezados «apikey» = ANON_KEY y «Authorization» = Bearer + el token. Anotar el «id» de «Otros» y el de «Efectivo».
7. Gasto de ejemplo: monto 120000 en pesos, fecha 2026-08-15, con la cuenta «Efectivo» y la categoría «Otros» del usuario de prueba.

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Enviar create_transaction de 120000 con montos 60000 y 60000.01. | Responde 400 con el código 23514 y «I7: la suma de las deudas no puede superar el monto del gasto»; no se crea nada. |

**Notas del diseño:** Caso por API: se hace con Postman (o curl), no desde la pantalla.

---

### CP-DEU-058 — Resumen: gasto bruto y neto de reembolsos

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Caso de uso · Positivo |
| Trazabilidad | US-30 · CA-1, CA-9, CA-10 · FR-19 · R3 · I7, I10 |
| Historias de usuario | US-30 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-058-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-058-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Gasto de $120.000 en una cuota, con fecha 15/08/2026 y nota «Supermercado», compartido con Sofía ($60.000) (Registrar → «Gasto compartido»). Se carga desde Registrar (categoría «Otros», cuenta «Efectivo»).
6. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /dashboard?period=2026-08 a la dirección de la app y apretar Enter. | En la tarjeta «Gastado en agosto 2026»: el gasto total muestra «$120.000,00» (bruto); aparece la fila «Neto de reembolsos» y el monto del neto = «$60.000,00»; la aclaración del neto no se ve; y debajo se ve el enlace «Ver deudas». |
| 2 | Tocar el enlace «Ver deudas». | El navegador navega a /debts y muestra la deuda de Sofía por $60.000,00. |

---

### CP-DEU-059 — Resumen: el neto no cambia al saldar la deuda

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-30 · CA-2, CA-10 · FR-19 · R3 · I9, I10 |
| Historias de usuario | US-30 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-059-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-059-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Gasto de $120.000 en una cuota, con fecha 15/08/2026, compartido con Sofía ($60.000) (Registrar → «Gasto compartido»). Se carga desde Registrar (categoría «Otros», cuenta «Efectivo»).
6. Esa deuda marcada como saldada hoy (botón «Marcar saldada»).
7. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).
8. Fechas que dependen de hoy: «mes actual» es el mes de hoy; «mes anterior» es el mes calendario anterior; «el día 10 del mes actual» es el día 10 del mes de hoy (si hoy es antes del 10, la fecha de hoy); «el día 15 del mes anterior» es el 15 del mes anterior; «hoy» es el día en que se ejecuta el caso. En las direcciones, period=AAAA-MM es el año y el mes con dos dígitos (por ejemplo, para octubre de 2026: period=2026-10).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /dashboard?period=2026-08 a la dirección de la app y apretar Enter. | El gasto total muestra «$120.000,00» y el monto del neto muestra «$60.000,00». |

---

### CP-DEU-060 — Resumen: una deuda suelta «Me deben» no cambia el neto

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Trazabilidad | US-30 · CA-4 · FR-19 · I7 |
| Historias de usuario | US-30 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-060-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-060-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Gasto de $80.000 en una cuota, con fecha 15/08/2026. Se carga desde Registrar (categoría «Otros», cuenta «Efectivo»).
6. Deuda cargada desde Deudas → «Nueva deuda»: Juan te debe $25.000, con fecha 16/08/2026.
7. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /dashboard?period=2026-08 a la dirección de la app y apretar Enter. | El gasto total muestra «$80.000,00» y la fila «Neto de reembolsos» no se ve. |

---

### CP-DEU-061 — Resumen: el neto en dólares no cambia si cambia el tipo de cambio

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Caso de uso · Positivo |
| Trazabilidad | US-30 · CA-6, CA-10 · FR-19 · R2, R3 · I4, I7, I10 |
| Historias de usuario | US-30 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-061-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-061-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Gasto de US$100 a tipo de cambio 1250 en una cuota, con fecha 15/08/2026, compartido con Sofía (US$40) (Registrar → «Gasto compartido»). Se carga desde Registrar (categoría «Otros», cuenta «Efectivo»).
6. Tipo de cambio de referencia cambiado a 1500 para agosto de 2026: Ajustes → «Tipo de cambio de referencia» → elegir el mes, escribir el valor y «Guardar tipo de cambio».
7. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /dashboard?period=2026-08 a la dirección de la app y apretar Enter. | El gasto total muestra «$125.000,00» y el monto del neto muestra «$75.000,00» ($125.000,00 − $50.000,00, usando el valor en pesos congelado de la deuda y no $60.000,00). |

---

### CP-NAV-001 — La barra tiene cuatro secciones en el orden correcto

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Caso de uso · Positivo |
| Trazabilidad | US-69 · CA-1 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-001-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-001-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Pantalla del navegador con ancho de 375 px y alto de 812 px: apretar F12, tocar el ícono «Toggle device toolbar» (pantalla adaptable) y escribir 375 en el ancho y 812 en el alto. Comprobar que arriba dice 375 × 812.
6. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Ancho de pantalla: 375 × 812

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Mirar la barra de abajo de izquierda a derecha. | Se leen exactamente «Registrar», «Resumen», «Deudas», «Suscripciones» (cuatro ítems, en ese orden) y no aparece «Movimientos». |

---

### CP-NAV-002 — «Deudas» lleva a Deudas

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Caso de uso · Positivo |
| Trazabilidad | US-69 · CA-2 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-002-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-002-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).

**Datos de prueba:**

- Pantalla de partida: Registrar

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Tocar «Deudas» en la barra. | Se abre Deudas y la dirección termina en /debts. |

---

### CP-NAV-003 — En el Resumen la barra marca «Resumen»

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Trazabilidad | US-69 · CA-3 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-003-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-003-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Pantalla a abrir: /dashboard?period=2026-08

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de direcciones agregar /dashboard?period=2026-08 a la dirección de la app y apretar Enter. | Se abre el Resumen de agosto de 2026. |
| 2 | Mirar la barra de navegación. | «Resumen» queda resaltado (verde y en negrita); las otras secciones no. |
| 3 | Verificación adicional: apretar F12, abrir «Console», pegar este texto y apretar Enter: [...document.querySelectorAll('nav[aria-label="Principal"] a[data-testid^="dashboard-nav-"]')].map(a=>[a.textContent.trim(),a.getAttribute('aria-current')]) | Devuelve [["Registrar", null], ["Resumen", "page"], ["Deudas", null], ["Suscripciones", null], ["", null]]: solo «Resumen» tiene aria-current="page". |

---

### CP-NAV-004 — En Ajustes no se marca ninguna de las cuatro secciones

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Trazabilidad | US-69 · CA-3 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-004-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-004-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Pantalla a abrir: /settings

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de direcciones agregar /settings a la dirección de la app y apretar Enter. | Se abre Ajustes. |
| 2 | Mirar la barra de navegación. | Ninguna de las cuatro secciones queda resaltada; solo el engranaje de Ajustes. |
| 3 | Verificación adicional: apretar F12, abrir «Console», pegar este texto y apretar Enter: [...document.querySelectorAll('nav[aria-label="Principal"] a[data-testid^="settings-nav-"]')].map(a=>[a.textContent.trim(),a.getAttribute('aria-current')]) | Devuelve [["Registrar", null], ["Resumen", null], ["Deudas", null], ["Suscripciones", null], ["", "page"]]: solo «Ajustes» tiene aria-current="page". |

---

### CP-NAV-005 — Ancho 1023 px: barra abajo y engranaje de Ajustes

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-69 · CA-5 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-005-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-005-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Pantalla del navegador con ancho de 1023 px y alto de 812 px: apretar F12, tocar el ícono «Toggle device toolbar» (pantalla adaptable) y escribir 1023 en el ancho y 812 en el alto. Comprobar que arriba dice 1023 × 812.
6. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Ancho de pantalla: 1023 × 812

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Mirar la navegación y el encabezado. | La navegación está fija abajo, no hay barra lateral y se ve el engranaje «Ajustes» arriba. |

---

### CP-NAV-006 — Ancho 1024 px: barra lateral con Ajustes al pie

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-69 · CA-5 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-006-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-006-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Pantalla del navegador con ancho de 1024 px y alto de 812 px: apretar F12, tocar el ícono «Toggle device toolbar» (pantalla adaptable) y escribir 1024 en el ancho y 812 en el alto. Comprobar que arriba dice 1024 × 812.
6. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Ancho de pantalla: 1024 × 812

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Mirar la navegación. | Hay una barra lateral de 240 px a la izquierda con los cuatro ítems y «Ajustes» abajo de todo; no hay barra inferior ni engranaje. |

---

### CP-NAV-007 — Identificadores únicos en Registrar (375 px)

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Valores límite · Positivo |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-007-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-007-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Pantalla del navegador con ancho de 375 px y alto de 812 px: apretar F12, tocar el ícono «Toggle device toolbar» (pantalla adaptable) y escribir 375 en el ancho y 812 en el alto. Comprobar que arriba dice 375 × 812.
6. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Pantalla: Registrar
- Dirección: /register
- Ancho de pantalla: 375 × 812

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de direcciones agregar /register a la dirección de la app y apretar Enter. | Se abre Registrar. |
| 2 | Apretar F12, abrir «Console», pegar este texto y apretar Enter: ["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="register-nav-'+d+'"]').length) | La consola devuelve exactamente [1, 1, 1, 1, 1]: cada uno de los cinco identificadores de la barra aparece una sola vez y ninguno está repetido. |

---

### CP-NAV-008 — «Ver todos» y «‹ Resumen» mantienen el mes

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Caso de uso · Positivo |
| Trazabilidad | US-69 · CA-7 · C11 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-008-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Un gasto ya cargado de $1.200 con fecha 15/08/2026 en una cuota: en Registrar escribir el monto, «Siguiente», elegir una categoría y una cuenta, en «Fecha» tocar «Otra» y escribir 15/08/2026, dejar «1» cuota y tocar «Guardar gasto».
5. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-008-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).

**Datos de prueba:**

- Mes: agosto de 2026
- Gasto: $1.200

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /dashboard?period=2026-08 a la dirección de la app y apretar Enter. | Se abre el Resumen de agosto de 2026 y se ve el gasto. |
| 2 | Tocar «Ver todos». | Se abre Movimientos de agosto de 2026: la dirección queda exactamente …/transactions?period=2026-08. |
| 3 | Tocar «‹ Resumen». | Se vuelve al Resumen de agosto de 2026: la dirección queda …/dashboard?period=2026-08. |

---

### CP-NAV-009 — Deudas no arrastra el mes del Resumen

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Trazabilidad | US-69 · CA-9 · C11 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-009-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-009-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).

**Datos de prueba:**

- Mes de partida: agosto de 2026

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /dashboard?period=2026-08 a la dirección de la app y apretar Enter. | Se abre el Resumen de agosto de 2026. |
| 2 | Tocar «Deudas» en la barra. | Se abre Deudas y la dirección queda exactamente …/debts, sin «?period». |

---

### CP-NAV-010 — Tocar «Registrar» estando en Registrar no pierde lo cargado

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-69 · CA-11 · ADR-024 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-010-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-010-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).

**Datos de prueba:**

- Gasto de ejemplo: 12500 · Comida · Visa BBVA · 06/10/2026 · nota «Almuerzo»

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 12500 en el monto. | El monto muestra 12500 y se habilita «Siguiente». |
| 2 | Tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?») con las categorías. |
| 3 | Tocar la categoría «Comida». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 4 | En «Cuenta», tocar «Visa BBVA». | «Visa BBVA» queda marcada. |
| 5 | En «Fecha», tocar «Otra» y escribir 06/10/2026. | El campo de fecha muestra 06/10/2026. |
| 6 | En «Nota (opcional)» escribir Almuerzo. | La nota muestra «Almuerzo». |
| 7 | Tocar «Registrar» en la barra (sin guardar). | Seguís en el último paso (paso 3 de 3) y todos los datos cargados siguen ahí; no se guardó nada. |

---

### CP-NAV-011 — Guardar $12.500 muestra la confirmación completa

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Caso de uso · Positivo |
| Trazabilidad | US-70 · CA-1 · US-10 |
| Historias de usuario | US-10, US-70 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-011-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-011-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).

**Datos de prueba:**

- Gasto de ejemplo: 12500 · Comida · Visa BBVA · una cuota · 06/10/2026 · nota «Almuerzo»

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 12500 en el monto. | El monto muestra 12500 y se habilita «Siguiente». |
| 2 | Tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?») con las categorías. |
| 3 | Tocar la categoría «Comida». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 4 | En «Cuenta», tocar «Visa BBVA». | «Visa BBVA» queda marcada. |
| 5 | En «Fecha», tocar «Otra» y escribir 06/10/2026. | El campo de fecha muestra 06/10/2026. |
| 6 | En «Nota (opcional)» escribir Almuerzo. | La nota muestra «Almuerzo». |
| 7 | Tocar «Guardar gasto». | Aparece «Gasto guardado» con «$12.500,00 · Comida · Visa BBVA» y el botón muestra un tilde y «Guardado». |
| 8 | Esperar 1 segundo. | Se abre el paso 1 de 3 vacío y «Visa BBVA» queda como última cuenta usada. |

---

### CP-NAV-012 — Sin internet el gasto no se pierde y aparece «Reintentar»

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Trazabilidad | US-70 · CA-3 · NFR-09 · ADR-034 · I18 |
| Historias de usuario | US-70 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-012-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-012-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
7. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).
8. Internet funcionando normalmente al empezar el caso (la conexión se corta recién en el paso que lo indica).

**Datos de prueba:**

- Gasto de ejemplo: 12500 · Comida · Visa BBVA · una cuota · 06/10/2026 · nota «Almuerzo»

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 12500 en el monto. | El monto muestra 12500 y se habilita «Siguiente». |
| 2 | Tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?») con las categorías. |
| 3 | Tocar la categoría «Comida». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 4 | En «Cuenta», tocar «Visa BBVA». | «Visa BBVA» queda marcada. |
| 5 | En «Fecha», tocar «Otra» y escribir 06/10/2026. | El campo de fecha muestra 06/10/2026. |
| 6 | En «Nota (opcional)» escribir Almuerzo. | La nota muestra «Almuerzo». |
| 7 | Cortar internet: apretar F12, abrir la pestaña «Network» y, en el selector que dice «No throttling», elegir «Offline». | El selector muestra «Offline». |
| 8 | Tocar «Guardar gasto». | Aparece «No se pudo guardar» con el texto «Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.»; el botón ahora dice «Reintentar» y todos los datos siguen cargados. |
| 9 | Devolver internet: en el mismo selector volver a elegir «No throttling». | El selector muestra «No throttling». |

---

### CP-NAV-013 — Reintentar al volver internet guarda una sola vez

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-70 · CA-5 · NFR-10 · ADR-034 · I18 |
| Historias de usuario | US-70 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-013-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-013-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
7. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).
8. Internet funcionando normalmente al empezar el caso (la conexión se corta recién en el paso que lo indica).

**Datos de prueba:**

- Gasto de ejemplo: 12500 · Comida · Visa BBVA · una cuota · 06/10/2026 · nota «Almuerzo»

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 12500 en el monto. | El monto muestra 12500 y se habilita «Siguiente». |
| 2 | Tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?») con las categorías. |
| 3 | Tocar la categoría «Comida». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 4 | En «Cuenta», tocar «Visa BBVA». | «Visa BBVA» queda marcada. |
| 5 | En «Fecha», tocar «Otra» y escribir 06/10/2026. | El campo de fecha muestra 06/10/2026. |
| 6 | En «Nota (opcional)» escribir Almuerzo. | La nota muestra «Almuerzo». |
| 7 | Cortar internet: apretar F12, abrir la pestaña «Network» y, en el selector que dice «No throttling», elegir «Offline». | El selector muestra «Offline». |
| 8 | Tocar «Guardar gasto». | Aparece «No se pudo guardar» con el texto «Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.»; el botón ahora dice «Reintentar» y todos los datos siguen cargados. |
| 9 | Devolver internet: en el mismo selector volver a elegir «No throttling». | El selector muestra «No throttling». |
| 10 | Tocar «Reintentar». | Aparece «Gasto guardado» con «$12.500,00 · Comida · Visa BBVA», el botón muestra «✓ Guardado» y vuelve al paso 1 vacío. |
| 11 | Agregar /transactions?period=2026-10 a la dirección de la app y apretar Enter. | Movimientos muestra exactamente UNA fila de $12.500,00. |

---

### CP-NAV-014 — Con internet muy lenta, a los 15 segundos avisa que falló

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-70 · CA-7 · ADR-034 |
| Historias de usuario | US-70 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-014-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-014-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
7. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).
8. Internet funcionando normalmente al empezar el caso (la conexión se corta recién en el paso que lo indica).
9. Perfil de red lento creado en Chrome: F12 → «Network» → selector «No throttling» → «Add…» (agregar perfil personalizado), con nombre «NAV-20s», latencia 20000 ms, descarga 1000 kb/s, subida 1000 kb/s. Un cronómetro con décimas de segundo (por ejemplo el del celular).

**Datos de prueba:**

- Gasto de ejemplo: 12500 · Comida · Visa BBVA · una cuota · 06/10/2026 · nota «Almuerzo»
- Perfil de red: NAV-20s (latencia 20000 ms, 1000 kb/s)

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 12500 en el monto. | El monto muestra 12500 y se habilita «Siguiente». |
| 2 | Tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?») con las categorías. |
| 3 | Tocar la categoría «Comida». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 4 | En «Cuenta», tocar «Visa BBVA». | «Visa BBVA» queda marcada. |
| 5 | En «Fecha», tocar «Otra» y escribir 06/10/2026. | El campo de fecha muestra 06/10/2026. |
| 6 | En «Nota (opcional)» escribir Almuerzo. | La nota muestra «Almuerzo». |
| 7 | En «Network» elegir el perfil «NAV-20s». | El selector muestra «NAV-20s». |
| 8 | Iniciar el cronómetro y tocar «Guardar gasto». | El botón dice «Guardando…», queda deshabilitado y la pantalla queda «ocupada». |
| 9 | Detener el cronómetro cuando aparezca «No se pudo guardar». | El error aparece entre los 14 y los 16 segundos, con «Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.» y el botón «Reintentar». |
| 10 | Devolver internet: en el mismo selector volver a elegir «No throttling». | El selector muestra «No throttling». |

---

### CP-NAV-015 — Reintentar no duplica un gasto que ya se había guardado

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-70 · CA-8 · NFR-10 · ADR-034 · I18 |
| Historias de usuario | US-70 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-015-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-015-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
7. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).
8. Internet funcionando normalmente al empezar el caso (la conexión se corta recién en el paso que lo indica).
9. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
10. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-nav-015-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
11. Identificadores de la categoría «Comida» y de la cuenta «Visa BBVA»: pedidos GET a SUPABASE_URL/rest/v1/categories?select=id,name y SUPABASE_URL/rest/v1/accounts?select=id,name,type con los encabezados «apikey» = ANON_KEY y «Authorization» = Bearer + el token. Anotar el «id» de «Comida» (ID_COMIDA) y el de «Visa BBVA» (ID_VISA).
12. Gasto ya creado por API con una clave fija (para imitar que sí llegó a guardarse): con Postman, pedido POST a SUPABASE_URL/rest/v1/rpc/create_transaction con los encabezados apikey, Authorization (Bearer + token) y Content-Type, y el cuerpo {"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"ID_COMIDA","p_account_id":"ID_VISA","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"39000000-0000-4000-8000-000000000039"}. Debe responder 200 con un identificador. Después de crearlo, cerrar la sesión de la app y volver a entrar con el usuario de prueba.

**Datos de prueba:**

- Gasto de ejemplo: 12500 · Comida · Visa BBVA · una cuota · 06/10/2026 · nota «Almuerzo»
- Clave fija: 39000000-0000-4000-8000-000000000039

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Apretar Ctrl+Shift+J (abre la consola) y pegar: window.__navUuid=crypto.randomUUID.bind(crypto);Object.defineProperty(crypto,'randomUUID',{configurable:true,value:()=>"39000000-0000-4000-8000-000000000039"}) y Enter. | La consola devuelve «undefined» (el reintento va a usar la clave fija). |
| 2 | En Registrar, escribir 12500 en el monto. | El monto muestra 12500 y se habilita «Siguiente». |
| 3 | Tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?») con las categorías. |
| 4 | Tocar la categoría «Comida». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 5 | En «Cuenta», tocar «Visa BBVA». | «Visa BBVA» queda marcada. |
| 6 | En «Fecha», tocar «Otra» y escribir 06/10/2026. | El campo de fecha muestra 06/10/2026. |
| 7 | En «Nota (opcional)» escribir Almuerzo. | La nota muestra «Almuerzo». |
| 8 | Cortar internet: apretar F12, abrir la pestaña «Network» y, en el selector que dice «No throttling», elegir «Offline». | El selector muestra «Offline». |
| 9 | Tocar «Guardar gasto». | Aparece «No se pudo guardar» con el texto «Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.»; el botón ahora dice «Reintentar» y todos los datos siguen cargados. |
| 10 | Devolver internet: en el mismo selector volver a elegir «No throttling». | El selector muestra «No throttling». |
| 11 | Tocar «Reintentar». | Aparece «Gasto guardado» con «$12.500,00 · Comida · Visa BBVA». |
| 12 | Agregar /transactions?period=2026-10 a la dirección de la app y apretar Enter. | Hay exactamente UNA fila de $12.500,00 (no dos). |
| 13 | En la consola pegar: Object.defineProperty(crypto,'randomUUID',{configurable:true,value:window.__navUuid});delete window.__navUuid | Devuelve «true» (se restaura el funcionamiento normal). |

---

### CP-NAV-016 — La misma clave dos veces seguidas devuelve el mismo gasto

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Caso de uso · Positivo |
| Trazabilidad | US-70 · CA-9 · NFR-10 · ADR-034 · I18 |
| Historias de usuario | US-70 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-016-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
7. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-nav-016-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
8. Identificadores de la categoría «Comida» y de la cuenta «Visa BBVA»: pedidos GET a SUPABASE_URL/rest/v1/categories?select=id,name y SUPABASE_URL/rest/v1/accounts?select=id,name,type con los encabezados «apikey» = ANON_KEY y «Authorization» = Bearer + el token. Anotar el «id» de «Comida» (ID_COMIDA) y el de «Visa BBVA» (ID_VISA).

**Datos de prueba:**

- Clave de reintento: 40000000-0000-4000-8000-000000000040

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Postman, pedido POST a SUPABASE_URL/rest/v1/rpc/create_transaction con los encabezados «apikey» = ANON_KEY, «Authorization» = Bearer + token y «Content-Type: application/json», y este cuerpo: {"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"ID_COMIDA","p_account_id":"ID_VISA","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"40000000-0000-4000-8000-000000000040"} | Responde 200 y un identificador (anotarlo como ID-1). |
| 2 | Enviar exactamente el mismo pedido otra vez. | Responde 200 y exactamente el mismo ID-1. |
| 3 | Pedido GET a SUPABASE_URL/rest/v1/transactions?select=id,amount_text:amount::text,request_id,deleted_at&request_id=eq.40000000-0000-4000-8000-000000000040 con los mismos encabezados. | Responde 200 con UNA sola fila: id = ID-1, amount_text = "12500.00", la clave indicada y deleted_at = null. |
| 4 | Pedido GET a SUPABASE_URL/rest/v1/ledger_entries?select=transaction_id,installment_number,amount_text:amount::text&transaction_id=eq.ID-1 con los mismos encabezados. | Responde 200 con UNA sola fila: installment_number = 1 y amount_text = "12500.00". |

---

### CP-NAV-017 — Dos pedidos simultáneos con la misma clave crean un solo gasto

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Adivinación de errores · Positivo |
| Trazabilidad | US-70 · CA-10 · NFR-10 · ADR-034 · I18 |
| Historias de usuario | US-70 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-017-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
7. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-nav-017-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
8. Identificadores de la categoría «Comida» y de la cuenta «Visa BBVA»: pedidos GET a SUPABASE_URL/rest/v1/categories?select=id,name y SUPABASE_URL/rest/v1/accounts?select=id,name,type con los encabezados «apikey» = ANON_KEY y «Authorization» = Bearer + el token. Anotar el «id» de «Comida» (ID_COMIDA) y el de «Visa BBVA» (ID_VISA).

**Datos de prueba:**

- Clave de reintento: 41000000-0000-4000-8000-000000000041

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Preparar DOS pedidos idénticos (como el paso 1 del caso anterior) con la clave 41000000-0000-4000-8000-000000000041 y enviarlos al mismo tiempo (por ejemplo, con el runner de Postman con 2 iteraciones en paralelo, o el script de PowerShell «NAV-CONC-01» del caso original). | Los dos responden 200 con el mismo identificador (ID-1) y ninguno devuelve el código 23505. |
| 2 | Pedido GET a SUPABASE_URL/rest/v1/transactions?select=id,amount_text:amount::text,request_id,deleted_at&request_id=eq.41000000-0000-4000-8000-000000000041 con los mismos encabezados. | Responde 200 con UNA sola fila: id = ID-1, amount_text = "12500.00" y deleted_at = null. |
| 3 | Pedido GET a SUPABASE_URL/rest/v1/ledger_entries?select=transaction_id,installment_number,amount_text:amount::text&transaction_id=eq.ID-1 con los mismos encabezados. | Responde 200 con UNA sola fila: installment_number = 1 y amount_text = "12500.00". |

---

### CP-NAV-018 — La misma clave en dos usuarios distintos no se pisa

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Adivinación de errores · Positivo |
| Trazabilidad | US-70 · CA-12 · C7 · ADR-034 · I18 |
| Historias de usuario | US-70 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-018-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
7. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-nav-018-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
8. Identificadores de la categoría «Comida» y de la cuenta «Visa BBVA»: pedidos GET a SUPABASE_URL/rest/v1/categories?select=id,name y SUPABASE_URL/rest/v1/accounts?select=id,name,type con los encabezados «apikey» = ANON_KEY y «Authorization» = Bearer + el token. Anotar el «id» de «Comida» (ID_COMIDA) y el de «Visa BBVA» (ID_VISA).
9. Segundo usuario de prueba (B): crearlo igual que el primero con el email qa+cp-nav-018-002@example.com (Clave123!), con su propia cuenta «Visa BBVA» y categorías «Comida» y «Tecnología», y obtener también su token e identificadores. El primer usuario es A.

**Datos de prueba:**

- Clave de reintento: 43000000-0000-4000-8000-000000000043

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Con el token del usuario A: En Postman, pedido POST a SUPABASE_URL/rest/v1/rpc/create_transaction con los encabezados «apikey» = ANON_KEY, «Authorization» = Bearer + token y «Content-Type: application/json», y este cuerpo: {"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"ID_COMIDA","p_account_id":"ID_VISA","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"43000000-0000-4000-8000-000000000043"} | Responde 200 y un identificador (ID-A). |
| 2 | Con el token del usuario B: el mismo pedido (con los ID_COMIDA e ID_VISA propios de B). | Responde 200 y un identificador distinto (ID-B). |
| 3 | Con el token de A: pedido GET a SUPABASE_URL/rest/v1/transactions?select=id,user_id,request_id&request_id=eq.43000000-0000-4000-8000-000000000043. | Responde 200 con UNA fila: id = ID-A y el user_id de A. |
| 4 | Con el token de B: el mismo pedido GET. | Responde 200 con UNA fila: id = ID-B y el user_id de B; no aparece ID-A. |

**Notas del diseño:** Este caso necesita dos usuarios: A (qa+cp-nav-018-001@example.com) y B (qa+cp-nav-018-002@example.com).

---

### CP-NAV-019 — Si se archiva la categoría antes de guardar, el gasto se rechaza con aviso

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Trazabilidad | US-70 · CA-16 · C6 |
| Historias de usuario | US-70 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-019-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-019-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
7. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).
8. Internet funcionando normalmente al empezar el caso (la conexión se corta recién en el paso que lo indica).

**Datos de prueba:**

- Gasto de ejemplo: 12500 · Comida · Visa BBVA · una cuota · 06/10/2026 · nota «Almuerzo»
- Pestañas: dos pestañas del mismo navegador (misma ventana de incógnito)

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 12500 en el monto. | El monto muestra 12500 y se habilita «Siguiente». |
| 2 | Tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?») con las categorías. |
| 3 | Tocar la categoría «Comida». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 4 | En «Cuenta», tocar «Visa BBVA». | «Visa BBVA» queda marcada. |
| 5 | En «Fecha», tocar «Otra» y escribir 06/10/2026. | El campo de fecha muestra 06/10/2026. |
| 6 | En «Nota (opcional)» escribir Almuerzo. | La nota muestra «Almuerzo». |
| 7 | Abrir una segunda pestaña en la misma ventana de incógnito, ir a Ajustes (agregar /settings a la dirección de la app) y tocar el botón de archivar de «Comida» («Archivar Comida»). | «Comida» pasa a la lista de categorías archivadas. |
| 8 | Volver a la primera pestaña. | Se ve el paso 3 con $12.500,00, «Comida» y «Visa BBVA». |
| 9 | Tocar «Guardar gasto». | Aparece «No se pudo guardar» con «la categoría no existe, no es tuya o está archivada»; el botón sigue diciendo «Guardar gasto» (no «Reintentar»). |
| 10 | Verificación adicional: F12 → «Console», pegar localStorage.getItem('biyu:pending-drafts:') y Enter. | Devuelve null o una lista que no contiene el gasto de 12500 (no quedó pendiente). |

---

### CP-NAV-020 — La API rechaza un gasto con una categoría archivada

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Trazabilidad | US-70 · CA-16 · C6 |
| Historias de usuario | US-70 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-020-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
7. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-nav-020-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
8. Identificadores de la categoría «Comida» y de la cuenta «Visa BBVA»: pedidos GET a SUPABASE_URL/rest/v1/categories?select=id,name y SUPABASE_URL/rest/v1/accounts?select=id,name,type con los encabezados «apikey» = ANON_KEY y «Authorization» = Bearer + el token. Anotar el «id» de «Comida» (ID_COMIDA) y el de «Visa BBVA» (ID_VISA).

**Datos de prueba:**

- Clave de reintento: 48000000-0000-4000-8000-000000000048

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Archivar la categoría «Comida» por API: pedido PATCH a SUPABASE_URL/rest/v1/categories?id=eq.ID_COMIDA con los mismos encabezados, «Prefer: return=minimal» y cuerpo {"archived_at":"2026-10-12T12:00:00Z"}. | Responde 204. |
| 2 | En Postman, pedido POST a SUPABASE_URL/rest/v1/rpc/create_transaction con los encabezados «apikey» = ANON_KEY, «Authorization» = Bearer + token y «Content-Type: application/json», y este cuerpo: {"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"ID_COMIDA","p_account_id":"ID_VISA","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"48000000-0000-4000-8000-000000000048"} | Responde 409 con el código 23503 y el mensaje «la categoría no existe, no es tuya o está archivada»; no devuelve ningún identificador. |
| 3 | Pedido GET a SUPABASE_URL/rest/v1/transactions?select=id,request_id&request_id=eq.48000000-0000-4000-8000-000000000048 con los mismos encabezados. | Responde 200 y el cuerpo es exactamente [] (no se creó el gasto). |
| 4 | Pedido GET a SUPABASE_URL/rest/v1/ledger_entries?select=id,transaction_id con los mismos encabezados. | Responde 200 y el cuerpo es exactamente [] (no hay cuotas). |

---

### CP-NAV-021 — Al volver a Registrar aparece el gasto pendiente

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-70 · CA-17 · NFR-09 |
| Historias de usuario | US-70 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-021-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-021-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
7. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).
8. Internet funcionando normalmente al empezar el caso (la conexión se corta recién en el paso que lo indica).

**Datos de prueba:**

- Gasto de ejemplo: 12500 · Comida · Visa BBVA · una cuota · 06/10/2026 · nota «Almuerzo»

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 12500 en el monto. | El monto muestra 12500 y se habilita «Siguiente». |
| 2 | Tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?») con las categorías. |
| 3 | Tocar la categoría «Comida». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 4 | En «Cuenta», tocar «Visa BBVA». | «Visa BBVA» queda marcada. |
| 5 | En «Fecha», tocar «Otra» y escribir 06/10/2026. | El campo de fecha muestra 06/10/2026. |
| 6 | En «Nota (opcional)» escribir Almuerzo. | La nota muestra «Almuerzo». |
| 7 | Cortar internet: apretar F12, abrir la pestaña «Network» y, en el selector que dice «No throttling», elegir «Offline». | El selector muestra «Offline». |
| 8 | Tocar «Guardar gasto». | Aparece «No se pudo guardar» con el texto «Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.»; el botón ahora dice «Reintentar» y todos los datos siguen cargados. |
| 9 | Devolver internet: en el mismo selector volver a elegir «No throttling». | El selector muestra «No throttling». |
| 10 | Tocar «Resumen» y después «Registrar». | Arriba aparece «Tenés 1 movimiento sin guardar» con «Gasto · $12.500,00 · Comida · 06/10/2026» y los botones «Recuperar» y «Descartar». |

---

### CP-NAV-022 — Recuperar un gasto que en realidad ya estaba guardado

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-70 · CA-20 · I18 · C6 |
| Historias de usuario | US-70 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-022-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-022-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
7. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).
8. Internet funcionando normalmente al empezar el caso (la conexión se corta recién en el paso que lo indica).
9. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
10. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-nav-022-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
11. Identificadores de la categoría «Comida» y de la cuenta «Visa BBVA»: pedidos GET a SUPABASE_URL/rest/v1/categories?select=id,name y SUPABASE_URL/rest/v1/accounts?select=id,name,type con los encabezados «apikey» = ANON_KEY y «Authorization» = Bearer + el token. Anotar el «id» de «Comida» (ID_COMIDA) y el de «Visa BBVA» (ID_VISA).
12. Gasto ya creado por API con la clave fija 53000000-0000-4000-8000-000000000053: pedido POST a SUPABASE_URL/rest/v1/rpc/create_transaction con los encabezados apikey, Authorization (Bearer + token) y Content-Type, y el cuerpo {"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"ID_COMIDA","p_account_id":"ID_VISA","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"53000000-0000-4000-8000-000000000053"}. Debe responder 200 con un identificador. Después, cerrar la sesión de la app y volver a entrar con el usuario de prueba.

**Datos de prueba:**

- Gasto de ejemplo: 12500 · Comida · Visa BBVA · una cuota · 06/10/2026 · nota «Almuerzo»
- Clave fija: 53000000-0000-4000-8000-000000000053

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Apretar Ctrl+Shift+J y pegar: window.__navUuid=crypto.randomUUID.bind(crypto);Object.defineProperty(crypto,'randomUUID',{configurable:true,value:()=>"53000000-0000-4000-8000-000000000053"}) y Enter. | La consola devuelve «undefined». |
| 2 | En Registrar, escribir 12500 en el monto. | El monto muestra 12500 y se habilita «Siguiente». |
| 3 | Tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?») con las categorías. |
| 4 | Tocar la categoría «Comida». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 5 | En «Cuenta», tocar «Visa BBVA». | «Visa BBVA» queda marcada. |
| 6 | En «Fecha», tocar «Otra» y escribir 06/10/2026. | El campo de fecha muestra 06/10/2026. |
| 7 | En «Nota (opcional)» escribir Almuerzo. | La nota muestra «Almuerzo». |
| 8 | Cortar internet: apretar F12, abrir la pestaña «Network» y, en el selector que dice «No throttling», elegir «Offline». | El selector muestra «Offline». |
| 9 | Tocar «Guardar gasto». | Aparece «No se pudo guardar» con el texto «Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.»; el botón ahora dice «Reintentar» y todos los datos siguen cargados. |
| 10 | Devolver internet: en el mismo selector volver a elegir «No throttling». | El selector muestra «No throttling». |
| 11 | Tocar «Resumen», después «Registrar» y después «Recuperar». | Aparece el aviso «Ese movimiento ya estaba guardado» con «$12.500,00 · Comida · Visa BBVA»; la fila pendiente desaparece y el formulario queda vacío en el paso 1. |
| 12 | Restaurar la consola: pegar Object.defineProperty(crypto,'randomUUID',{configurable:true,value:window.__navUuid});delete window.__navUuid | Devuelve «true». |

---

### CP-NAV-023 — Descartar borra el pendiente, incluso al recargar

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-70 · CA-23 · NFR-09 |
| Historias de usuario | US-70 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-023-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-023-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
7. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).
8. Internet funcionando normalmente al empezar el caso (la conexión se corta recién en el paso que lo indica).

**Datos de prueba:**

- Gasto de ejemplo: 12500 · Comida · Visa BBVA · una cuota · 06/10/2026 · nota «Almuerzo»

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 12500 en el monto. | El monto muestra 12500 y se habilita «Siguiente». |
| 2 | Tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?») con las categorías. |
| 3 | Tocar la categoría «Comida». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 4 | En «Cuenta», tocar «Visa BBVA». | «Visa BBVA» queda marcada. |
| 5 | En «Fecha», tocar «Otra» y escribir 06/10/2026. | El campo de fecha muestra 06/10/2026. |
| 6 | En «Nota (opcional)» escribir Almuerzo. | La nota muestra «Almuerzo». |
| 7 | Cortar internet: apretar F12, abrir la pestaña «Network» y, en el selector que dice «No throttling», elegir «Offline». | El selector muestra «Offline». |
| 8 | Tocar «Guardar gasto». | Aparece «No se pudo guardar» con el texto «Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.»; el botón ahora dice «Reintentar» y todos los datos siguen cargados. |
| 9 | Devolver internet: en el mismo selector volver a elegir «No throttling». | El selector muestra «No throttling». |
| 10 | Tocar «Resumen» en la barra de abajo. | Se abre el Resumen. |
| 11 | Tocar «Registrar» en la barra de abajo. | Se abre Registrar en el paso 1 y arriba aparece «Tenés 1 movimiento sin guardar» con la fila «Gasto · $12.500,00 · Comida · 06/10/2026» y los botones «Recuperar» y «Descartar». |
| 12 | Tocar «Descartar». | La fila desaparece y ya no se ve el aviso de pendientes. |
| 13 | Apretar Ctrl+R para recargar. | Registrar se recarga en el paso 1 y el aviso no reaparece. |
| 14 | Verificación adicional: F12 → «Console», pegar localStorage.getItem('biyu:pending-drafts:') y Enter. | Devuelve null o el texto "[]" (no queda nada guardado). |

---

### CP-NAV-024 — Cerrar sesión borra los pendientes

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-70 · CA-24 · NFR-09 |
| Historias de usuario | US-70 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-024-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-024-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
7. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).
8. Internet funcionando normalmente al empezar el caso (la conexión se corta recién en el paso que lo indica).

**Datos de prueba:**

- Gasto de ejemplo: 12500 · Comida · Visa BBVA · una cuota · 06/10/2026 · nota «Almuerzo»

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 12500 en el monto. | El monto muestra 12500 y se habilita «Siguiente». |
| 2 | Tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?») con las categorías. |
| 3 | Tocar la categoría «Comida». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 4 | En «Cuenta», tocar «Visa BBVA». | «Visa BBVA» queda marcada. |
| 5 | En «Fecha», tocar «Otra» y escribir 06/10/2026. | El campo de fecha muestra 06/10/2026. |
| 6 | En «Nota (opcional)» escribir Almuerzo. | La nota muestra «Almuerzo». |
| 7 | Cortar internet: apretar F12, abrir la pestaña «Network» y, en el selector que dice «No throttling», elegir «Offline». | El selector muestra «Offline». |
| 8 | Tocar «Guardar gasto». | Aparece «No se pudo guardar» con el texto «Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.»; el botón ahora dice «Reintentar» y todos los datos siguen cargados. |
| 9 | Devolver internet: en el mismo selector volver a elegir «No throttling». | El selector muestra «No throttling». |
| 10 | Tocar «Resumen» en la barra de abajo. | Se abre el Resumen. |
| 11 | Tocar «Registrar» en la barra de abajo. | Se abre Registrar en el paso 1 y arriba aparece «Tenés 1 movimiento sin guardar» con la fila «Gasto · $12.500,00 · Comida · 06/10/2026» y los botones «Recuperar» y «Descartar». |
| 12 | Tocar el engranaje «Ajustes» y después «Cerrar sesión». | Se abre «Entrar» (el login). |
| 13 | Verificación adicional: F12 → «Console», pegar localStorage.getItem('biyu:pending-drafts:') y Enter. | Devuelve null. |
| 14 | Volver a entrar con el mismo usuario (email y Clave123!). | Registrar abre en el paso 1 y no aparece el aviso de pendientes. |

---

### CP-NAV-025 — Tocar dos veces «Guardar» guarda una sola vez

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Adivinación de errores · Límite |
| Trazabilidad | US-70 · CA-28 · C4 |
| Historias de usuario | US-70 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-025-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-025-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
7. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).
8. Internet funcionando normalmente al empezar el caso (la conexión se corta recién en el paso que lo indica).
9. Perfil de red lento creado en Chrome (F12 → «Network» → «Add…»): nombre «Lento-500», latencia 500 ms, descarga 10 Mbps, subida 10 Mbps; y la casilla «Preserve log» marcada.

**Datos de prueba:**

- Gasto de ejemplo: 12500 · Comida · Visa BBVA · una cuota · 06/10/2026 · nota «Almuerzo»
- Perfil de red: latencia 500 ms, 10 Mbps

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 12500 en el monto. | El monto muestra 12500 y se habilita «Siguiente». |
| 2 | Tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?») con las categorías. |
| 3 | Tocar la categoría «Comida». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 4 | En «Cuenta», tocar «Visa BBVA». | «Visa BBVA» queda marcada. |
| 5 | En «Fecha», tocar «Otra» y escribir 06/10/2026. | El campo de fecha muestra 06/10/2026. |
| 6 | En «Nota (opcional)» escribir Almuerzo. | La nota muestra «Almuerzo». |
| 7 | En «Network» marcar «Preserve log» y elegir el perfil «Lento-500». | La casilla queda marcada y el selector muestra el perfil. |
| 8 | Tocar «Guardar gasto». | El botón cambia de inmediato a «Guardando…», queda deshabilitado y la pantalla queda «ocupada». |
| 9 | Tocar otra vez el botón «Guardando…». | No pasa nada: sigue deshabilitado y conserva «Guardando…». |
| 10 | Esperar hasta que aparezca «Gasto guardado». | Aparece «$12.500,00 · Comida · Visa BBVA» y el formulario vuelve al paso 1. |
| 11 | En «Network» filtrar por «create_transaction». | Hay exactamente UN pedido «create_transaction», con respuesta 200. |

---

## Casos con el formato del catálogo

Copiados tal cual de `casos/*.md` (la fuente de cada módulo), con sus convenciones y procedimientos de preparación. Los pasos comunes `PR-nn` están en [`docs/12-procedimientos-de-prueba.md`](../docs/12-procedimientos-de-prueba.md).

### Deudas y gastos compartidos (DEU, 33 casos)

Fuente: [`casos/deu.md`](casos/deu.md).

#### Convenciones de fechas y consultas

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
| 6 | Hacer click en el botón de papelera (`data-testid="transactions-item-delete"`) de la fila `"Cena"`. | Se abre el diálogo `"¿Eliminar transacción?"` con `"También deja de contar la deuda con Sofía por $60.000,00."`. |
| 7 | Hacer click en el botón "Eliminar" (`data-testid="delete-transaction-confirm"`). | Aparece el aviso `"Transacción eliminada"` y la fila sale de Movimientos. |
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

### Exportar CSV (EXP, 31 casos)

Fuente: [`casos/exp.md`](casos/exp.md).

#### Decisiones aprobadas para EXP

1. Las preparaciones ausentes de `docs/12-procedimientos-de-prueba.md` se documentan como `EXP-PREP-nn` dentro de este archivo. No se inventan nuevos `PR-nn`.
2. CA-14 se verifica manualmente por `fecha` y `created_at`. El desempate por `id` queda como hueco manual aceptado porque la API pública no permite fijar `created_at` e `id`.
3. Los escenarios que solo existen en el cliente —Offline, cierre/cancelación de la hoja y cambio de URL— no tienen par API porque ADR-029 no define endpoint/RPC de exportación. La excepción no alcanza a autorización: CA-16 conserva su par UI/API.

#### Anexo de preparación

##### EXP-PREP-01 · Crear una transacción

Requiere PR-01 y PR-04 pasos 1–2. Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con headers `apikey: <ANON_KEY>`, `Authorization: Bearer <TOKEN>`, `Content-Type: application/json` y body:
`{"p_type":"<TIPO>","p_amount":"<MONTO>","p_currency":"<MONEDA>","p_fx_rate":<TC-O-NULL>,"p_category_id":<UUID-O-NULL>,"p_account_id":"<UUID>","p_installments_count":<N>,"p_occurred_on":"<AAAA-MM-DD>","p_description":<TEXTO-O-NULL>,"p_request_id":null}`.
Mapear `gasto` a `expense` e `ingreso` a `income`; usar literalmente los demás datos D del caso. Esperado: HTTP 200 y UUID. Capturarlo como `<ID-A>`, `<ID-B>`, etc. Confirmar con PR-08.

##### EXP-PREP-02 · Eliminar o restaurar

Con headers de PR-04:
- Eliminar: `POST /rest/v1/rpc/delete_transaction`, body `{"p_transaction_id":"<ID>"}`. Esperado HTTP 200; PR-08 muestra `deleted_at` no nulo.
- Restaurar: `POST /rest/v1/rpc/restore_transaction`, body `{"p_transaction_id":"<ID>"}`. Esperado HTTP 200; PR-08 muestra `deleted_at:null`.

##### EXP-PREP-03 · Crear, renombrar y archivar catálogo

Todas las llamadas llevan headers de PR-04, `Content-Type: application/json` y `Prefer: return=representation`.
- Crear categoría: `POST <SUPABASE_URL>/rest/v1/categories`, body `{"name":"<NOMBRE>","color":"#336699"}`. Esperado HTTP 201 y una fila con `id`, nombre exacto y `archived_at:null`.
- Crear cuenta: `POST <SUPABASE_URL>/rest/v1/accounts`, body `{"name":"<NOMBRE>","type":"cash","currency":"ARS"}`. Esperado HTTP 201 y una fila con `id`, nombre exacto y `archived_at:null`.
- Renombrar: `PATCH <SUPABASE_URL>/rest/v1/<categories|accounts>?id=eq.<ID>`, body `{"name":"<NUEVO>"}`. Esperado HTTP 200 y una fila con el nombre nuevo.
- Archivar: mismo PATCH, body `{"archived_at":"2026-10-09T12:00:00-03:00"}`. Esperado HTTP 200 y una fila con ese valor.

##### EXP-PREP-07 · Sembrar N transacciones

Requiere PowerShell 7, PR-01 y PR-04. Completar variables en memoria; no guardar secretos.

```powershell
$expUrl = "<SUPABASE_URL>"
$expAnon = "<ANON_KEY>"
$expToken = "<TOKEN>"
$expCategory = "<uuid Otros>"
$expAccount = "<uuid Efectivo>"
$expN = <1000|1500|2000>
$expHeaders = @{ apikey=$expAnon; Authorization="Bearer $expToken"; "Content-Type"="application/json" }
$expIds = [System.Collections.Generic.List[string]]::new()
1..$expN | ForEach-Object {
  $expBody = @{ p_type="expense"; p_amount="1.00"; p_currency="ARS"; p_fx_rate=$null;
    p_category_id=$expCategory; p_account_id=$expAccount; p_installments_count=1;
    p_occurred_on="2025-09-15"; p_description=("EXP-{0:D4}" -f $_);
    p_request_id=[guid]::NewGuid().ToString() } | ConvertTo-Json -Compress
  $expId = Invoke-RestMethod -Method Post -Uri "$expUrl/rest/v1/rpc/create_transaction" -Headers $expHeaders -Body $expBody
  $expIds.Add([string]$expId)
}
"creadas=$($expIds.Count); distintas=$(@($expIds | Sort-Object -Unique).Count)"
```

Esperado: `creadas=N; distintas=N`. Conservar `$expIds` para comparar con el CSV.

##### EXP-PREP-08 · Simular HTTP 500 en la lectura

En la consola DevTools de Movimientos, ejecutar:

```javascript
window.__expOriginalFetch = window.fetch;
window.fetch = (...args) => String(args[0]).includes('/rest/v1/transactions')
  ? Promise.resolve(new Response(JSON.stringify({ code: 'XX000', message: 'fallo simulado' }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    }))
  : window.__expOriginalFetch(...args);
```

Esperado: la consola no muestra error. Para limpiar: `window.fetch = window.__expOriginalFetch`.

#### Convenciones

- Cada caso usa PR-01 con el email literal y contraseña `Clave123!`.
- Antes de una descarga, quitar de Descargas cualquier archivo Biyu del mismo período.
- Un sufijo que agregue el navegador no cambia el nombre propuesto que se valida.
- Los UUID capturados son datos exactos del caso.

#### CP-EXP-001 — Una URL válida fija septiembre 2026

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-1 · C11 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-001-001@example.com`.

**Datos de prueba:** D1: período `2026-09`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-001-001@example.com`. | El campo muestra `qa+cp-exp-001-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en el botón "Exportar". | Se abre "Exportar movimientos"; "Solo septiembre 2026" está elegido; se ve "Todo 2026"; "Descargar CSV" y "Cancelar" están habilitados; aparece el texto fijo sobre activos y cuotas anteriores. |

**Post-condición:** Hoja abierta; sin descarga.

---

#### CP-EXP-002 — El mes siguiente está bloqueado

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-2 · FR-21 · C1 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-002-001@example.com`. S2: dispositivo en `09/10/2026`.

**Datos de prueba:** D1: mes futuro `2026-11`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-002-001@example.com`. | El campo muestra `qa+cp-exp-002-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-11`. | La barra muestra exactamente `<APP>/transactions?period=2026-11`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-11`. Además, "Exportar" está deshabilitado y se ve exactamente "Solo podés exportar el mes actual o meses anteriores." |
| 13 | Leer el mensaje de período futuro. | El mensaje coincide exactamente con el texto esperado del paso 12. |
| 14 | Hacer click en "Exportar". | No se abre ninguna hoja y la URL sigue `?period=2026-11`. |

**Post-condición:** Sin descarga.

---

#### CP-EXP-003 — El alcance mensual propone el nombre 2026-09

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-3 · FR-22 |
| Invariante | — |
| Técnica | Caso de uso |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-003-001@example.com`. S2: EXP-PREP-01 con D1–D7.

**Datos de prueba:** D1: gasto; D2: `1500.00`; D3: ARS; D4: Otros/Efectivo; D5: 1 cuota; D6: `2026-09-15`; D7: `Almuerzo`; D8: `<ID-A>`; D9: `biyu-movimientos-2026-09.csv`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-003-001@example.com`. | El campo muestra `qa+cp-exp-003-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja con el mes elegido. |
| 14 | Hacer click en "Descargar CSV". | Se inicia y completa una descarga. Además, es exactamente D9. |
| 15 | Abrir la carpeta Descargas. | Se ve el archivo CSV recién descargado. |
| 16 | Abrir el archivo como texto. | Hay una fila de datos cuyo id es `<ID-A>`. |

**Post-condición:** Datos intactos; conservar el usuario como evidencia.

---

#### CP-EXP-004 — El primer día del mes se incluye

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-5 · FR-22 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-004-001@example.com`. S2: EXP-PREP-01 con D1–D7.

**Datos de prueba:** D1: gasto; D2: `100.00`; D3: ARS; D4: Otros/Efectivo; D5: 1; D6: `2026-09-01`; D7: null; D8: `<ID-A>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-004-001@example.com`. | El campo muestra `qa+cp-exp-004-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja con septiembre elegido. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el archivo mensual. |
| 15 | Abrir el archivo como texto. | Hay exactamente una fila con fecha `2026-09-01` e id `<ID-A>`. |

**Post-condición:** Datos intactos; conservar el usuario como evidencia.

---

#### CP-EXP-005 — El día posterior al mes se excluye

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-5 · FR-22 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-005-001@example.com`. S2: EXP-PREP-01 con D1–D7.

**Datos de prueba:** D1: gasto; D2: `100.00`; D3: ARS; D4: Otros/Efectivo; D5: 1; D6: `2026-10-01`; D7: null; D8: `<ID-A>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-005-001@example.com`. | El campo muestra `qa+cp-exp-005-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja con septiembre elegido. |
| 14 | Hacer click en "Descargar CSV". | No se descarga archivo; la hoja queda abierta. Además, dice exactamente "No tenés movimientos con fecha en septiembre 2026." |


**Post-condición:** Sin descarga; la transacción fuera del rango sigue activa.

---

#### CP-EXP-006 — El 1 de enero se incluye en el año

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-5 · FR-22 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-006-001@example.com`. S2: EXP-PREP-01 con D1–D7.

**Datos de prueba:** D1: gasto; D2: `100.00`; D3: ARS; D4: Otros/Efectivo; D5: 1; D6: `2025-01-01`; D7: null; D8: `<ID-A>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-006-001@example.com`. | El campo muestra `qa+cp-exp-006-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2025-09`. | La barra muestra exactamente `<APP>/transactions?period=2025-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2025-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Todo 2025". | El alcance anual queda elegido. |
| 15 | Hacer click en "Descargar CSV". | Se descarga el archivo anual. |
| 16 | Abrir el archivo como texto. | Hay exactamente una fila con fecha `2025-01-01` e id `<ID-A>`. |

**Post-condición:** Datos intactos; conservar el usuario como evidencia.

---

#### CP-EXP-007 — El día posterior al año se excluye

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-5 · FR-22 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-007-001@example.com`. S2: EXP-PREP-01 con D1–D7.

**Datos de prueba:** D1: gasto; D2: `100.00`; D3: ARS; D4: Otros/Efectivo; D5: 1; D6: `2026-01-01`; D7: null; D8: `<ID-A>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-007-001@example.com`. | El campo muestra `qa+cp-exp-007-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2025-09`. | La barra muestra exactamente `<APP>/transactions?period=2025-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2025-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Todo 2025". | El alcance anual queda elegido. |
| 15 | Hacer click en "Descargar CSV". | No se descarga archivo; la hoja queda abierta. Además, dice exactamente "No tenés movimientos con fecha en 2025." |


**Post-condición:** Sin descarga; la transacción fuera del rango sigue activa.

---

#### CP-EXP-008 — Una transacción eliminada queda fuera

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-6 · C10 |
| Invariante | I10 |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-008-001@example.com`. S2: crear `<ID-A>` con EXP-PREP-01 y eliminar con EXP-PREP-02.

**Datos de prueba:** D1: gasto `200.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, null; D2: `<ID-A>` con `deleted_at` no nulo.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-008-001@example.com`. | El campo muestra `qa+cp-exp-008-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | No se descarga archivo. Además, dice "No tenés movimientos con fecha en septiembre 2026." |
| 15 | Leer el mensaje de período vacío. | El mensaje coincide exactamente con el texto esperado del paso 14. |


**Post-condición:** La transacción sigue eliminada.

---

#### CP-EXP-009 — El archivo comienza con BOM UTF-8

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-8 · ADR-029 |
| Invariante | — |
| Técnica | Caso de uso |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-009-001@example.com`. S2: crear la transacción de D9 con EXP-PREP-01.

**Datos de prueba:** D1: bytes `EF BB BF`. D9: gasto `100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null, ID `<ID-A>`, creado con EXP-PREP-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-009-001@example.com`. | El campo muestra `qa+cp-exp-009-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el archivo. |
| 15 | Abrir el archivo en un visor hexadecimal. | Los primeros tres bytes son exactamente D1. |

**Post-condición:** Datos intactos; conservar el usuario como evidencia.

---

#### CP-EXP-010 — El encabezado tiene doce columnas exactas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-8 · ADR-029 |
| Invariante | — |
| Técnica | Caso de uso |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-010-001@example.com`. S2: crear la transacción de D9 con EXP-PREP-01.

**Datos de prueba:** D1: `fecha,tipo,monto,moneda,tipo_de_cambio,monto_ars,categoria,cuenta,cuotas,primer_periodo,descripcion,id`. D9: gasto `100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null, ID `<ID-A>`, creado con EXP-PREP-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-010-001@example.com`. | El campo muestra `qa+cp-exp-010-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el archivo. Además, coincide exactamente con D1. |


**Post-condición:** Datos intactos; conservar el usuario como evidencia.

---

#### CP-EXP-011 — Doce cuotas salen en una sola fila por el total

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-9 · ADR-029 |
| Invariante | I1, I2, I3 |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-011-001@example.com`. S2: PR-07 con D1–D3; capturar `<ID-A>` con PR-08.

**Datos de prueba:** D1: `120000`; D2: 12 cuotas; D3: `15/08/2026`; D4: `fecha=2026-08-15`, `monto=120000.00`, `cuotas=12`, `primer_periodo=2026-08`, `id=<ID-A>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-011-001@example.com`. | El campo muestra `qa+cp-exp-011-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-08`. | La barra muestra exactamente `<APP>/transactions?period=2026-08`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-08`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el archivo. |
| 15 | Abrir el CSV. | Hay exactamente una fila de datos y los cinco campos de D4 coinciden. |

**Post-condición:** Datos intactos; conservar el usuario como evidencia.

---

#### CP-EXP-012 — ARS se escribe con dos decimales exactos

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-10 · C2 |
| Invariante | I5 |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-012-001@example.com`. S2: EXP-PREP-01 con D1–D7.

**Datos de prueba:** D1: gasto; D2: `1500.00`; D3: ARS; D4: Otros/Efectivo; D5: 1; D6: `2026-09-15`; D7: null; D8: `<ID-A>`; D9: `gasto,1500.00,ARS,,1500.00`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-012-001@example.com`. | El campo muestra `qa+cp-exp-012-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el CSV. Además, contiene D9; no contiene `1.500,00`, signo ni `1500` sin decimales. |


**Post-condición:** Datos intactos; conservar el usuario como evidencia.

---

#### CP-EXP-013 — USD conserva cuatro decimales de TC

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-10 · C2/C5 |
| Invariante | I5 |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-013-001@example.com`. S2: EXP-PREP-01 con D1–D7.

**Datos de prueba:** D1: gasto; D2: `300.00`; D3: USD; D4: TC `1250.5000`; D5: Otros/Efectivo; D6: `2026-09-15`; D7: null; D8: `<ID-A>`; D9: `300.00,USD,1250.5000,375150.00`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-013-001@example.com`. | El campo muestra `qa+cp-exp-013-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el CSV. Además, contiene D9 exactamente. |


**Post-condición:** Datos intactos; conservar el usuario como evidencia.

---

#### CP-EXP-014 — Una coma obliga a entrecomillar la descripción

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-12 · ADR-029 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-014-001@example.com`. S2: EXP-PREP-01.

**Datos de prueba:** D1: descripción `Heladera, 3 cuotas`; D2: campo `"Heladera, 3 cuotas"`; D3: `<ID-A>`. D4: gasto `100.00` ARS, categoría Otros, cuenta Efectivo, 1 cuota, fecha `2026-09-15`, preparado con EXP-PREP-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-014-001@example.com`. | El campo muestra `qa+cp-exp-014-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el CSV. Además, coincide byte a byte con D2. |


**Post-condición:** Datos intactos; conservar el usuario como evidencia.

---

#### CP-EXP-015 — Las comillas internas se duplican

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-12 · ADR-029 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-015-001@example.com`. S2: EXP-PREP-01.

**Datos de prueba:** D1: descripción `Pizza "a la piedra"`; D2: campo `"Pizza ""a la piedra"""`; D3: `<ID-A>`. D4: gasto `100.00` ARS, categoría Otros, cuenta Efectivo, 1 cuota, fecha `2026-09-15`, preparado con EXP-PREP-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-015-001@example.com`. | El campo muestra `qa+cp-exp-015-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el CSV. Además, coincide byte a byte con D2. |


**Post-condición:** Datos intactos; conservar el usuario como evidencia.

---

#### CP-EXP-016 — Descripción con igual se neutraliza

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-13 · ADR-029 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-016-001@example.com`. S2: EXP-PREP-01.

**Datos de prueba:** D1: descripción `=1+1`; D2: salida `'=1+1`; D3: `<ID-A>`. D4: gasto `100.00` ARS, categoría Otros, cuenta Efectivo, 1 cuota, fecha `2026-09-15`, preparado con EXP-PREP-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-016-001@example.com`. | El campo muestra `qa+cp-exp-016-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el CSV. |
| 15 | Abrir el archivo descargado en un visor hexadecimal y localizar el dato indicado en D. | Coincide exactamente con D2: se agregó un solo apóstrofo, se conservó el resto y luego se aplicaron comillas si correspondía. |

**Post-condición:** Datos intactos; conservar el usuario como evidencia.

---

#### CP-EXP-017 — Una categoría que empieza con igual se neutraliza

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-13 · ADR-029 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-017-001@example.com`. S2: crear categoría con EXP-PREP-03. S3: crear transacción con EXP-PREP-01.

**Datos de prueba:** D1: categoría `=Categoria QA`; D2: salida `'=Categoria QA`; D3: `<ID-A>`. D4: gasto `100.00` ARS, cuenta Efectivo, 1 cuota, `2026-09-15`, descripción null.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-017-001@example.com`. | El campo muestra `qa+cp-exp-017-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el CSV. Además, coincide exactamente con D2. |


**Post-condición:** Datos intactos; conservar el usuario como evidencia.

---

#### CP-EXP-018 — 1.500 transacciones se exportan sin faltantes

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-15 · C9 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-018-001@example.com`. S2: EXP-PREP-07 con N=1500.

**Datos de prueba:** D1: N=1500; D2: conjunto `$expIds`; D3: `Exportamos 1.500 movimientos`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-018-001@example.com`. | El campo muestra `qa+cp-exp-018-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2025-09`. | La barra muestra exactamente `<APP>/transactions?period=2025-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2025-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Todo 2025". | El alcance anual queda elegido. |
| 15 | Hacer click en "Descargar CSV". | Se descarga el CSV. Además, coincide exactamente con D3. Además, hay exactamente N además del encabezado. |
| 16 | Abrir la carpeta Descargas. | Se ve el CSV anual descargado. |
| 17 | Abrir el CSV en un visor de texto. | El encabezado y las N filas están disponibles para contar. |


| 18 | Abrir el CSV descargado y compararlo en una herramienta de comparación binaria con la lista `$expIds` de D3. | Hay N UUID distintos y el conjunto coincide: ninguno falta ni se repite. |

**Post-condición:** Datos intactos; conservar el usuario como evidencia.

---

#### CP-EXP-019 — El CSV de A no contiene movimientos de B

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-16 · C7 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | CP-EXP-020 |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-05 con A `qa+cp-exp-019-001@example.com` y B `qa+cp-exp-019-002@example.com`. S2: EXP-PREP-01 una vez con cada token.

**Datos de prueba:** D1: A `111.00`, `SOLO-A`, `<ID-A>`; D2: B `999.00`, `SOLO-B`, `<ID-B>`; D3: fecha `2026-09-15`; D4: sesión A. D5: ambos son gastos ARS, Otros/Efectivo, 1 cuota.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-019-001@example.com`. | El campo muestra `qa+cp-exp-019-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga un CSV con una fila. Además, contiene `111.00`, `SOLO-A`, `<ID-A>`; no contiene `999.00`, `SOLO-B` ni `<ID-B>`. |


**Post-condición:** Datos intactos; conservar el usuario como evidencia.

---

#### CP-EXP-020 — La API con token de A devuelve cero filas de B

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-16 · C7 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | API |
| Caso par | CP-EXP-019 |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-05 con A `qa+cp-exp-020-001@example.com` y B `qa+cp-exp-020-002@example.com`. S2: crear la transacción de B con EXP-PREP-01 y `<TOKEN-B>`; A no tiene transacciones. S3: token A.

**Datos de prueba:** D1: fecha B `2026-09-15`; D2: `<ID-B>`; D3: body ninguno.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar `GET <SUPABASE_URL>/rest/v1/transactions?select=id,amount&occurred_on=gte.2026-09-01&occurred_on=lt.2026-10-01&deleted_at=is.null` con `apikey: <ANON_KEY>` y `Authorization: Bearer <TOKEN-A>`, sin body. | HTTP 200 y cuerpo exacto `[]`; no aparecen `<ID-B>` ni `999`. |

**Post-condición:** Base sin cambios.

---

#### CP-EXP-021 — Categoría archivada sale con el nombre actual

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-17 |
| Invariante | — |
| Técnica | Adivinación de errores |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-021-001@example.com`. S2: EXP-PREP-03 crea categoría. S3: EXP-PREP-01 crea gasto. S4: EXP-PREP-03 renombra y archiva.

**Datos de prueba:** D1: nombre inicial `Viajes`; D2: nombre actual `Viajes 2026`; D3: gasto `100.00`, `2026-09-15`; D4: `<ID-A>`. D5: gasto ARS, cuenta Efectivo, una cuota, descripción null.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-021-001@example.com`. | El campo muestra `qa+cp-exp-021-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el CSV. Además, es `Viajes 2026`, no `Viajes` ni vacío. |


**Post-condición:** Datos intactos; conservar el usuario como evidencia.

---

#### CP-EXP-022 — Un ingreso exporta categoría vacía

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-17 |
| Invariante | I8 |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-022-001@example.com`. S2: EXP-PREP-01.

**Datos de prueba:** D1: ingreso; D2: `850000.00`; D3: ARS; D4: categoría null; D5: Caja de ahorro; D6: `2026-09-01`; D7: `<ID-A>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-022-001@example.com`. | El campo muestra `qa+cp-exp-022-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el CSV. Además, `tipo` es `ingreso` y `categoria` es el campo vacío entre dos comas. |


**Post-condición:** Datos intactos; conservar el usuario como evidencia.

---

#### CP-EXP-023 — Un doble click inicia una sola descarga

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-18 |
| Invariante | — |
| Técnica | Adivinación de errores |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-023-001@example.com`. S2: crear la transacción de D9 con EXP-PREP-01. S3: Descargas sin archivos del período.

**Datos de prueba:** D1: doble click rápido; D2: una descarga esperada. D9: gasto `100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null, ID `<ID-A>`, creado con EXP-PREP-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-023-001@example.com`. | El campo muestra `qa+cp-exp-023-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer doble click rápido en "Descargar CSV". | El control pasa a "Exportando…" y queda deshabilitado. |
| 15 | Esperar a que termine. | Aparece un solo archivo y un solo aviso "Exportamos 1 movimiento"; no aparece archivo con sufijo. |

**Post-condición:** Exactamente una descarga.

---

#### CP-EXP-024 — Un mes sin transacciones muestra Vacío

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-20 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-024-001@example.com`; no crear transacciones.

**Datos de prueba:** D1: septiembre 2026.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-024-001@example.com`. | El campo muestra `qa+cp-exp-024-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | No se descarga archivo. Además, dice "No tenés movimientos con fecha en septiembre 2026." |
| 15 | Leer el mensaje de período vacío. | El mensaje coincide exactamente con el texto esperado del paso 14. |
| 16 | Hacer click en "Todo 2026". | La opción anual queda elegida y desaparece el mensaje mensual. |

**Post-condición:** Sin descarga.

---

#### CP-EXP-025 — Offline muestra el error exacto

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-22 · C9 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (comportamiento Offline exclusivo del cliente; excepción C6 aprobada) |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-025-001@example.com`. S2: crear la transacción de D9 con EXP-PREP-01.

**Datos de prueba:** D1: DevTools Network > Offline. D9: gasto `100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null, ID `<ID-A>`, creado con EXP-PREP-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-025-001@example.com`. | El campo muestra `qa+cp-exp-025-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Activar Offline en DevTools. | Las solicitudes nuevas quedan sin conexión. |
| 15 | Hacer click en "Descargar CSV". | No se descarga archivo. Además, tiene `role="alert"` y dice "No pudimos exportar tus movimientos. Probá de nuevo." Además, alcances, "Descargar CSV" y "Cancelar" están habilitados. |


**Post-condición:** Desactivar Offline; sin descarga.

---

#### CP-EXP-026 — El reintento después de Offline descarga completo

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-22 · C9 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (reintento Offline exclusivo del cliente; excepción C6 aprobada) |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-026-001@example.com`. S2: crear dos transacciones con EXP-PREP-01.

**Datos de prueba:** D1: Offline inicial; D2: dos IDs exactos. D9: `<ID-A>` gasto `100.00` y `<ID-B>` gasto `200.00`; ambos ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null, creados con EXP-PREP-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-026-001@example.com`. | El campo muestra `qa+cp-exp-026-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Activar Offline. | Las solicitudes quedan sin conexión. |
| 15 | Hacer click en "Descargar CSV". | Se muestra el error y no se descarga. |
| 16 | Desactivar Offline. | La conexión queda restablecida. |
| 17 | Hacer click en "Descargar CSV". | El error desaparece, se descarga el archivo y aparece "Exportamos 2 movimientos". Además, contiene exactamente `<ID-A>` y `<ID-B>`, una vez cada uno. |


**Post-condición:** Una descarga completa.

---

#### CP-EXP-027 — Tocar fuera cierra sin descargar

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-23 |
| Invariante | — |
| Técnica | Caso de uso |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Baja |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-027-001@example.com`. S2: crear la transacción de D9 con EXP-PREP-01.

**Datos de prueba:** D1: URL `?period=2026-09`. D9: transacción base: gasto `100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null, ID `<ID-A>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-027-001@example.com`. | El campo muestra `qa+cp-exp-027-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en el fondo fuera de la hoja. | La hoja se cierra, no se descarga archivo y la URL conserva D1. |

**Post-condición:** Sin descarga.

---

#### CP-EXP-028 — Atrás cierra la hoja inicial

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · requisito narrativo: todo cambio de URL · C11 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-028-001@example.com`. S2: una transacción creada con EXP-PREP-01; el historial se construye en los pasos.

**Datos de prueba:** D1: historial agosto → septiembre. D9: gasto `100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null, ID `<ID-A>`, creado con EXP-PREP-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-028-001@example.com`. | El campo muestra `qa+cp-exp-028-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en la barra de direcciones. | La URL queda seleccionada. |
| 14 | Escribir `<APP>/transactions?period=2026-08`. | La barra muestra agosto. |
| 15 | Presionar Enter. | Se abre agosto 2026. |
| 16 | Hacer click en la barra de direcciones. | La URL queda seleccionada. |
| 17 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra septiembre. |
| 18 | Presionar Enter. | Se abre septiembre y Atrás tiene destino agosto. |
| 19 | Hacer click en "Exportar". | Se abre la hoja fijada a septiembre. |
| 20 | Hacer click en Atrás del navegador. | La hoja se cierra, la URL pasa a `?period=2026-08` y no se descarga archivo. |

**Post-condición:** Sin descarga.

---

#### CP-EXP-029 — Atrás durante Exportando cancela la descarga

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · requisito narrativo: todo cambio de URL · C11 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (navegación y cancelación exclusivas del cliente; excepción C6 aprobada) |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-029-001@example.com`. S2: crear la transacción de D9 con EXP-PREP-01. S3: el historial se construye en los pasos. S4: throttling `1 kbit/s`, latencia `2000 ms`.

**Datos de prueba:** D1: exportación de septiembre en curso. D9: gasto `100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null, ID `<ID-A>`, creado con EXP-PREP-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-029-001@example.com`. | El campo muestra `qa+cp-exp-029-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en la barra de direcciones. | La URL queda seleccionada. |
| 14 | Escribir `<APP>/transactions?period=2026-08`. | La barra muestra agosto. |
| 15 | Presionar Enter. | Se abre agosto. |
| 16 | Hacer click en la barra de direcciones. | La URL queda seleccionada. |
| 17 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra septiembre. |
| 18 | Presionar Enter. | Se abre septiembre y Atrás tiene destino agosto. |
| 19 | Hacer click en "Exportar". | Se abre la hoja. |
| 20 | Hacer click en "Descargar CSV". | Se ve "Exportando…". |
| 21 | Hacer click en Atrás del navegador. | La hoja se cierra y la URL pasa a agosto. |
| 22 | Restablecer la velocidad de red. | No aparece ningún archivo ni aviso de éxito. |

**Post-condición:** Sin descarga.

---

#### CP-EXP-030 — Una alta concurrente impide descargar un año incompleto

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · Completitud · C9 |
| Invariante | — |
| Técnica | Adivinación de errores |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (no existe RPC pública de exportación para reproducir la condición concurrente; excepción C6 aprobada) |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-030-001@example.com`. S2: EXP-PREP-07 con N=1500. S3: en una segunda ventana de otro navegador, iniciar sesión con el mismo usuario y ejecutar PR-06 con monto `2` y cuenta "Efectivo"; dejarla en el paso 3/3. S4: aplicar DevTools Network `1 kbit/s`, latencia `2000 ms`, solo a la primera ventana.

**Datos de prueba:** D1: conteo inicial 1500; D2: alta concurrente `2.00` ARS, Otros/Efectivo, 1 cuota, fecha `31/12/2025`, descripción vacía; D3: el archivo no debe descargarse.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar". |
| 5 | Hacer click en "Email". | El cursor queda en el campo. |
| 6 | Escribir `qa+cp-exp-030-001@example.com`. | El campo muestra `qa+cp-exp-030-001@example.com`. |
| 7 | Hacer click en "Contraseña". | El cursor queda en el campo. |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en "Entrar". | Se abre Registrar. |
| 10 | Hacer click en la barra de direcciones. | La URL queda seleccionada. |
| 11 | Escribir `<APP>/transactions?period=2025-09`. | La barra muestra `<APP>/transactions?period=2025-09`. |
| 12 | Presionar Enter. | Se abre Movimientos de `2025-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Todo 2025". | El alcance anual queda elegido. |
| 15 | Hacer click en "Descargar CSV". | Se ve "Exportando…" y comienzan las lecturas paginadas. |
| 16 | Esperar a que la primera lectura de transacciones muestre HTTP 200 en Network. | La primera página terminó y la exportación continúa. |
| 17 | Cambiar a la segunda ventana. | Se ve Registrar en el paso 3/3 con monto `2` y cuenta "Efectivo". |
| 18 | Hacer click en "Otra" dentro de "Fecha". | El campo de fecha queda editable. |
| 19 | Hacer click en el campo de fecha. | El cursor queda en el campo. |
| 20 | Escribir `31/12/2025`. | El campo muestra `31/12/2025`. |
| 21 | Hacer click en "Guardar gasto". | Aparece "Gasto guardado" y el botón muestra "Guardado". |
| 22 | Volver a la primera ventana. | La hoja sigue en "Exportando…" o ya muestra el resultado. |
| 23 | Esperar a que termine la exportación. | No se descarga ningún archivo; la hoja sigue abierta. Además, dice "No pudimos exportar tus movimientos. Probá de nuevo." con `role="alert"`. |


**Post-condición:** Restablecer la red; queda la transacción concurrente guardada y ninguna descarga.

---

#### CP-EXP-031 — HTTP 500 muestra Error y no descarga

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · Estado Error · C9 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (no existe RPC de exportación invocable para provocar HTTP 500; excepción C6 aprobada) |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-031-001@example.com`. S2: crear `<ID-A>` con EXP-PREP-01. S3: ejecutar EXP-PREP-08.

**Datos de prueba:** D1: gasto `100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, null; D2: HTTP 500 simulado.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar". |
| 5 | Hacer click en "Email". | El cursor queda en el campo. |
| 6 | Escribir `qa+cp-exp-031-001@example.com`. | El campo muestra `qa+cp-exp-031-001@example.com`. |
| 7 | Hacer click en "Contraseña". | El cursor queda en el campo. |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en "Entrar". | Se abre Registrar. |
| 10 | Hacer click en la barra de direcciones. | La URL queda seleccionada. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra esa URL. |
| 12 | Presionar Enter. | Se abre Movimientos de `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | No se descarga archivo y aparece "No pudimos exportar tus movimientos. Probá de nuevo." con `role="alert"`. |

**Post-condición:** Restaurar `fetch` según EXP-PREP-08; sin descarga.

---

### Importar Excel (IMP, 41 casos)

Fuente: [`casos/imp.md`](casos/imp.md).

#### Convenciones de ejecución

1. Cada caso usa un usuario nuevo creado con PR-01 y el email exacto `qa+<id-en-minúsculas>-001@example.com`. Al terminar PR-01, cerrar la sesión; los pasos del caso vuelven a entrar desde una ventana nueva.
2. Salvo indicación contraria, cada libro tiene como primera hoja `Movimientos`, una segunda hoja vacía `Instrucciones` y ninguna otra hoja. Las celdas marcadas `vacía` no contienen fórmulas, espacios ni formato con valor.
3. `H` queda fijado para estos casos en octubre de 2026 y el día de referencia de Argentina en `12/10/2026`. H−1 es septiembre de 2026; H−2, agosto; H−3, julio; H−4, junio. Los casos que dependen de ese reloj requieren un entorno cuyo reloj de dominio esté fijado a esa fecha; la imposibilidad de fijarlo manualmente en el deploy se registra como ambigüedad.
4. Encabezado completo (`E10`), en A1:J1: `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`.
5. Fila válida base (`V`), en A2:J2: fecha Excel `01/09/2026` | `Gasto` | número `1000` | `ARS` | vacía | `Otros` | `Efectivo` | número `1` | vacía | `Compra ficticia`.
6. Para construir un archivo, crear un libro nuevo, escribir literalmente el encabezado y cada fila declarada, guardar como el nombre indicado y cerrar Excel antes de elegirlo en Biyu. Las fórmulas se fuerzan a recalcular y se guarda el resultado antes de cerrar.

##### IMP-DATA-01 · Archivo de ejemplo, fila por fila

Nombre `importar-excel-ejemplo.xlsx`. Primera hoja `Movimientos`. La columna `Cuotas pendientes` no existe en este libro heredado; por US-80 se interpreta vacía. Fechas como celdas de fecha Excel, salvo donde se indica texto; `—` significa celda vacía.

| Fila | Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Nota |
|---:|---|---|---:|---|---:|---|---|---:|---|
| 1 | Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Nota |
| 2 | 01/09/2026 | Gasto | 45800 | ARS | — | Comida y supermercado | Tarjeta de débito | 1 | Compra del mes |
| 3 | 03/09/2026 | Gasto | 240000 | ARS | — | Indumentaria | Tarjeta de crédito | 6 | Campera |
| 4 | 05/09/2026 | Gasto | 12,5 | USD | 1450 | Entretenimiento | Tarjeta de crédito | — | Juego online |
| 5 | 08/09/2026 | Ingreso | 850000 | ARS | — | — | Cuenta bancaria | — | Sueldo |
| 6 | 10/09/2026 | Gasto | 3200 | ARS | — | Transporte | Billetera virtual | — | Carga SUBE |
| 7 | 12/09/2026 | Gasto | 0 | ARS | — | Salud | Efectivo | — | Farmacia |
| 8 | 15/09/2026 | Gasto | 30 | USD | — | Otros | Efectivo | — | Regalo |
| 9 | 18/09/2026 | Gasto | 15000 | ARS | — | Mascotas | Efectivo | — | Veterinaria |
| 10 | 20/09/2026 | Gasto | 60000 | ARS | — | Educación | Efectivo | 3 | Curso |
| 11 | texto `22/09/2026` | Gasto | texto `9.990,50` | ARS | — | Servicios | Cuenta bancaria | — | Internet |
| 12 | — | — | — | — | — | — | — | — | — |
| 13 | 25/09/2026 | Gasto | 7800 | ARS | — | Comida y supermercado | Efectivo | — | Verdulería |

La segunda hoja `Instrucciones` puede conservar el contenido heredado del mock; solo la primera hoja participa en estos casos. Si se reconstruye el libro, respetar los tipos de celda indicados.

#### Procedimientos de preparación propios de IMP

##### IMP-PREP-03 · Llamar `import_transactions`

Requiere PR-04 pasos 1–2. Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/import_transactions` con headers `apikey: <ANON_KEY>`, `Authorization: Bearer <TOKEN>` y `Content-Type: application/json`. El body siempre es `{"p_import_id":"<UUID FIJO DEL CASO>","p_rows":[<FILAS>]}`; cada caso API detalla literalmente las filas. Un lote procesado responde HTTP 200 con `import_id`, `already_imported`, `sent_rows`, `imported_rows` y `rows`. Un rechazo de la RPC completa responde HTTP 4xx con `code` y `message`.

##### IMP-PREP-04 · Oráculo de persistencia

Usar PR-08 y, cuando corresponda, estas lecturas adicionales con headers de PR-04:

- `GET /rest/v1/transactions?select=id,type,amount_text:amount::text,amount_ars_text:amount_ars::text,currency,fx_rate_text:fx_rate::text,installments_count,installments_paid,occurred_on,first_period,description&order=occurred_on,id`.
- `GET /rest/v1/ledger_entries?select=transaction_id,installment_number,period,amount_text:amount::text,amount_ars_text:amount_ars::text&order=period,installment_number`.
- `GET /rest/v1/imports?select=id,sent_rows,imported_rows,result&id=eq.<UUID>`.

Resultado esperado: HTTP 200; las filas y valores exactos son los declarados en el caso. Una lista vacía es `[]`.

##### IMP-PREP-05 · Ajustar un XLSX a un tamaño exacto

Requiere una copia cerrada de un `.xlsx` válido cuyo tamaño sea menor al objetivo. En PowerShell, completar ruta y tamaño; los bytes nulos se agregan después del ZIP y no cambian sus celdas:

```powershell
$impPath = (Resolve-Path '<ARCHIVO.xlsx>').Path
$impTarget = <1048576|1048577>
$impBytes = [IO.File]::ReadAllBytes($impPath)
if ($impBytes.Length -ge $impTarget) { throw "El archivo base debe pesar menos de $impTarget bytes" }
$impExact = [byte[]]::new($impTarget)
[Array]::Copy($impBytes, $impExact, $impBytes.Length)
[IO.File]::WriteAllBytes($impPath, $impExact)
(Get-Item -LiteralPath $impPath).Length
```

Resultado esperado: imprime exactamente `1048576` o `1048577`, según el caso. Volver a abrir el libro confirma que las hojas y celdas declaradas no cambiaron.

##### IMP-PREP-06 · Fijar el identificador de la importación en el navegador

Usar solo en CP-IMP-038, después de entrar a `/import` y antes de elegir el archivo. Abrir DevTools, seleccionar `Console`, escribir literalmente el siguiente código en una sola línea y presionar Enter:

```javascript
window.__impOriginalRandomUUID=window.crypto.randomUUID.bind(window.crypto);Object.defineProperty(window.crypto,'randomUUID',{configurable:true,value:()=>"83838383-0000-4000-8000-000000000083"});window.crypto.randomUUID()
```

Resultado esperado: la consola devuelve exactamente `83838383-0000-4000-8000-000000000083`. Para limpiar el fixture al terminar, ejecutar `Object.defineProperty(window.crypto,'randomUUID',{configurable:true,value:window.__impOriginalRandomUUID});delete window.__impOriginalRandomUUID` y cerrar DevTools.

#### CP-IMP-001 — El acceso desde Registrar abre el paso Archivo

| Campo | Contenido |
|---|---|
| Historia · criterio | US-74 · CA-1 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-001-001@example.com`; sesión cerrada.

**Datos de prueba:** No se carga archivo.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-imp-001-001@example.com` en `Email`. | El campo muestra `qa+cp-imp-001-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en `Importar desde Excel`. | La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. |
| 9 | Inspeccionar esos elementos con DevTools Elements. | Existen `register-import` en el botón usado, `import-back`, `import-steps` con `data-step="1"`, `import-template-download`, `import-file-pick`, `import-file-input` e `import-file-dropzone`. |

**Post-condición:** La pantalla queda en `/import`, sin archivo elegido.

---

#### CP-IMP-002 — A1 rechaza la extensión .xls

| Campo | Contenido |
|---|---|
| Historia · criterio | US-74 · CA-3 · A1 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-002-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-002.xls`: Libro Excel 97-2003; primera hoja con fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota` y fila 2 = V.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-imp-002-001@example.com` en `Email`. | El campo muestra `qa+cp-imp-002-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en `Importar desde Excel`. | La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. |
| 9 | Arrastrar `cp-imp-002.xls` desde el Explorador de archivos hasta la zona `o arrastralo acá`. | La zona queda resaltada para recibir el archivo. |
| 10 | Soltar `cp-imp-002.xls` en la zona. | Se mantiene `1 Archivo`; aparece exactamente `Solo se aceptan archivos .xlsx (Excel).`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

---

#### CP-IMP-003 — A2 rechaza 1.048.577 bytes

| Campo | Contenido |
|---|---|
| Historia · criterio | US-74 · CA-3 · A2 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-003-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-003.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = V; ejecutar IMP-PREP-05 con objetivo `1048577`. Tamaño final exacto `1.048.577` bytes.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-imp-003-001@example.com` en `Email`. | El campo muestra `qa+cp-imp-003-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en `Importar desde Excel`. | La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector de archivos. |
| 10 | Elegir `cp-imp-003.xlsx`. | Se mantiene `1 Archivo`; aparece exactamente `El archivo pesa más de 1 MB. Dividilo en varios archivos.`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

---

#### CP-IMP-004 — A3 rechaza un archivo dañado con extensión xlsx

| Campo | Contenido |
|---|---|
| Historia · criterio | US-74 · CA-3 · A3 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-004-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-004.xlsx`: Archivo de texto plano cuyo contenido exacto es `archivo ficticio no xlsx`, renombrado a `.xlsx`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-imp-004-001@example.com` en `Email`. | El campo muestra `qa+cp-imp-004-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en `Importar desde Excel`. | La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector de archivos. |
| 10 | Elegir `cp-imp-004.xlsx`. | Se mantiene `1 Archivo`; aparece exactamente `No pudimos leer el archivo. Abrilo en Excel, guardalo como .xlsx y probá de nuevo.`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

---

#### CP-IMP-005 — A4 enumera tres encabezados obligatorios faltantes

| Campo | Contenido |
|---|---|
| Historia · criterio | US-74 · CA-3 · A4 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-005-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-005.xlsx`: Fila 1: `Tipo | Moneda | Categoría | Cuotas | Cuotas pendientes | Nota`; fila 2: `Gasto | ARS | Otros | 1 | vacía | Ficticio`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-imp-005-001@example.com` en `Email`. | El campo muestra `qa+cp-imp-005-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en `Importar desde Excel`. | La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector de archivos. |
| 10 | Elegir `cp-imp-005.xlsx`. | Se mantiene `1 Archivo`; aparece exactamente `Faltan columnas: Fecha, Monto, Cuenta. La primera fila tiene que tener los encabezados de la plantilla.`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

---

#### CP-IMP-006 — A7 rechaza 501 filas con datos

| Campo | Contenido |
|---|---|
| Historia · criterio | US-74 · CA-3 · A7 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-006-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-006.xlsx`: Fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`. Filas 2–502: fecha Excel `01/09/2026`, `Gasto`, monto numérico igual al número de fila, `ARS`, TC vacía, `Otros`, `Efectivo`, `1`, pendientes vacía, nota `Fila <n>`; son exactamente 501 filas con datos.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-imp-006-001@example.com` en `Email`. | El campo muestra `qa+cp-imp-006-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en `Importar desde Excel`. | La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector de archivos. |
| 10 | Elegir `cp-imp-006.xlsx`. | Se mantiene `1 Archivo`; aparece exactamente `El archivo tiene 501 filas con datos y el máximo es 500. Dividilo en varios archivos.`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

---

#### CP-IMP-007 — El límite de filas acepta exactamente 500

| Campo | Contenido |
|---|---|
| Historia · criterio | US-74 · CA-4 · A7 |
| Invariante | — |
| Técnica | Análisis de valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-007-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-007.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`. Filas 2–501: fecha Excel `01/09/2026`, `Gasto`, monto `1`, `ARS`, TC vacía, `Otros`, `Efectivo`, `1`, pendientes vacía, nota exacta `Fila <n>`; 500 filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-imp-007-001@example.com` en `Email`. | El campo muestra `qa+cp-imp-007-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en `Importar desde Excel`. | La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector de archivos. |
| 10 | Elegir `cp-imp-007.xlsx`. | Se abre `2 Revisión`; muestra `500 filas leídas · 500 listas para importar · 0 con error`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

---

#### CP-IMP-008 — Los encabezados aceptan orden, mayúsculas, espacios y tildes distintos

| Campo | Contenido |
|---|---|
| Historia · criterio | US-74 · CA-6 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-008-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-008.xlsx`. Fila 1 A:J: ` CUOTAS PENDIENTES  | monto | FECHA | cuenta | TIPO | moneda | CATEGORIA | NOTA | CUOTAS | TIPO DE CAMBIO`. Fila 2 en ese orden: vacía | `1000` | fecha Excel `01/09/2026` | `Efectivo` | ` gasto ` | `ars` | `Otros` | `Compra ficticia` | `1` | vacía.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-imp-008-001@example.com` en `Email`. | El campo muestra `qa+cp-imp-008-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en `Importar desde Excel`. | La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector de archivos. |
| 10 | Elegir `cp-imp-008.xlsx`. | Se abre `2 Revisión`; muestra `1 fila leída · 1 lista para importar · 0 con error` y la tarjeta `Fila 2` está `Lista`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

---

#### CP-IMP-009 — F1: fecha vacía

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F1 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (valor ausente sin oráculo API específico) |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-009-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-009.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = vacía | Gasto | 1000 | ARS | vacía | Otros | Efectivo | 1 | vacía | F1. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-009-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-009.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Falta la fecha`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

---

#### CP-IMP-010 — F2: fecha inexistente

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F2 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (formato de archivo no llega a la RPC) |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-010-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-010.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = texto `31/02/2026` | Gasto | 1000 | ARS | vacía | Otros | Efectivo | 1 | vacía | F2. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-010-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-010.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Fecha inválida: usá DD/MM/AAAA`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

---

#### CP-IMP-011 — F3: fecha futura fija

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F3 · FR-06 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (falta oráculo API aislado; ver ambigüedad 3) |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-011-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-011.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = texto `31/12/2099` | Gasto | 1000 | ARS | vacía | Otros | Efectivo | 1 | vacía | F3. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-011-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-011.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `La fecha no puede ser futura`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

---

#### CP-IMP-012 — F5: tipo inválido

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F5 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (la RPC recibe tipo normalizado) |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-012-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-012.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | `Gastos` | 1000 | ARS | vacía | Otros | Efectivo | 1 | vacía | F5. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-012-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-012.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Tipo inválido: escribí Gasto o Ingreso`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

---

#### CP-IMP-013 — F7: monto no numérico

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F7 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | CP-IMP-034 |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-013-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-013.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | texto `abc` | ARS | vacía | Otros | Efectivo | 1 | vacía | F7. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-013-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-013.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Monto inválido: usá un número, por ejemplo 1234,56`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

---

#### CP-IMP-014 — F8: monto cero

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F8 · I4 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | CP-IMP-034 |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-014-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-014.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | 0 | ARS | vacía | Otros | Efectivo | 1 | vacía | F8. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-014-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-014.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `El monto debe ser mayor a cero`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

---

#### CP-IMP-015 — F9: monto con tres decimales

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F9 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (contrato API exacto no especificado) |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-015-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-015.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | texto `10,001` | ARS | vacía | Otros | Efectivo | 1 | vacía | F9. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-015-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-015.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `El monto admite hasta 2 decimales`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

---

#### CP-IMP-016 — F12: moneda EUR

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F12 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (la RPC recibe moneda normalizada) |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-016-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-016.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | 1000 | `EUR` | vacía | Otros | Efectivo | 1 | vacía | F12. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-016-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-016.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Moneda inválida: escribí ARS o USD`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

---

#### CP-IMP-017 — F13a: USD sin tipo de cambio

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F13a · I5 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (contrato API exacto no especificado) |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-017-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-017.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | 10 | USD | vacía | Otros | Efectivo | 1 | vacía | F13a. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-017-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-017.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Falta el tipo de cambio`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

---

#### CP-IMP-018 — F13b: ARS con tipo de cambio

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F13b · I5 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (contrato API exacto no especificado) |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-018-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-018.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | 1000 | ARS | 1450 | Otros | Efectivo | 1 | vacía | F13b. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-018-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-018.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Una transacción en ARS no lleva tipo de cambio`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

---

#### CP-IMP-019 — F14b: categoría inexistente

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F14b |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (API exacta solo especificada para cambio posterior) |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-019-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-019.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | 1000 | ARS | vacía | `Mascotas` | Efectivo | 1 | vacía | F14b. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-019-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-019.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `No existe la categoría «Mascotas» o está archivada`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

---

#### CP-IMP-020 — F14d: cuenta inexistente

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F14d |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (contrato API exacto no especificado) |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-020-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-020.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | 1000 | ARS | vacía | Otros | `Banco X` | 1 | vacía | F14d. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-020-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-020.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `No existe la cuenta «Banco X» o está archivada`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

---

#### CP-IMP-021 — F14e: trece cuotas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F14e |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (contrato API exacto no especificado) |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-021-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-021.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | 1000 | ARS | vacía | Otros | Tarjeta de crédito | 13 | vacía | F14e. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-021-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-021.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Las cuotas van de 1 a 12`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

---

#### CP-IMP-022 — F15: cuotas en cuenta no crédito

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F15 · I6 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (contrato API exacto no especificado) |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-022-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-022.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | 1000 | ARS | vacía | Otros | Efectivo | 3 | vacía | F15. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-022-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-022.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Solo los gastos con tarjeta de crédito admiten cuotas`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

---

#### CP-IMP-023 — Errores de varias columnas conservan el orden de reglas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-3 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-023-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-023.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2: texto `31/02/2026` | Gasto | 0 | ARS | vacía | Otros | `Banco X` | 1 | vacía | `Tres errores`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-023-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-023.xlsx`. | `Fila 2` queda `Con error`; aparecen, en este orden y una vez: `Fecha inválida: usá DD/MM/AAAA`, `El monto debe ser mayor a cero`, `No existe la cuenta «Banco X» o está archivada`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

---

#### CP-IMP-024 — Nombres, tipo y moneda aceptan espacios y mayúsculas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-5 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-024-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-024.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2: `01/09/2026 |  gasto  | 10 | usd | 1450 |  educación  |  efectivo  | 1 | vacía | Coincidencia`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-024-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-024.xlsx`. | `Fila 2` está `Lista`; muestra `Gasto`, `US$10,00`, `Educación`, `Efectivo` y `TC 1.450,00`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

---

#### CP-IMP-025 — Categoría archivada no se acepta aunque el nombre coincida

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-5 · F14b |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-025-001@example.com`; archivar `Otros` desde Ajustes y cerrar sesión.

**Datos de prueba:** `cp-imp-025.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2: `01/09/2026 | Gasto | 1000 | ARS | vacía | Otros | Efectivo | 1 | vacía | Archivada`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-025-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-025.xlsx`. | `Fila 2` muestra exactamente `No existe la categoría «Otros» o está archivada`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

---

#### CP-IMP-026 — El texto 1.500 se interpreta como mil quinientos

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-7 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-026-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-026.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2: fecha Excel `01/09/2026` | Gasto | texto `1.500` | ARS | vacía | Otros | Efectivo | 1 | vacía | Fórmula.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-026-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-026.xlsx`. | `Fila 2` está `Lista` y muestra exactamente `$1.500,00`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

---

#### CP-IMP-027 — El resumen del archivo de ejemplo suma solo las siete filas listas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-8 · C2 |
| Invariante | I1' |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-027-001@example.com`; sesión cerrada.

**Datos de prueba:** Copia exacta de IMP-DATA-01, incluida la fila 12 vacía.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-027-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `importar-excel-ejemplo.xlsx`. | Se ve exactamente `Vas a importar 7 movimientos: $324.915,50 en gastos y $850.000,00 en ingresos (en pesos).` |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

---

#### CP-IMP-028 — El filtro muestra solo las cuatro filas con error

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-9 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-028-001@example.com`; sesión cerrada.

**Datos de prueba:** Copia exacta de IMP-DATA-01, incluida la fila 12 vacía.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-028-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `importar-excel-ejemplo.xlsx`. | El filtro `Ver solo filas con error` está apagado y se ven 11 tarjetas. |
| 11 | Hacer click en `Ver solo filas con error`. | Queda encendido; solo se ven `Fila 7`, `Fila 8`, `Fila 9` y `Fila 10`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

---

#### CP-IMP-029 — Cero filas listas deshabilita Importar 0 movimientos

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-11 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-029-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-029.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = V salvo Monto `0`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-029-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-029.xlsx`. | Se ve `Importar 0 movimientos` deshabilitado y `No hay filas listas para importar`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

---

#### CP-IMP-030 — Confirmar importa solo las filas listas con todos sus campos

| Campo | Contenido |
|---|---|
| Historia · criterio | US-77 · CA-1 · C4 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-030-001@example.com`; sesión cerrada; PR-04 listo.

**Datos de prueba:** `cp-imp-030.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`. Fila 2: `01/09/2026 | Gasto | 1000 | ARS | vacía | Otros | Efectivo | 1 | vacía | Nota ficticia`. Fila 3: `02/09/2026 | Ingreso | 2000 | ARS | vacía | vacía | Cuenta bancaria | 1 | vacía | vacía`. Fila 4 igual a fila 2 salvo Monto `0` y Nota `No importar`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-030-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-030.xlsx`. | `3 filas leídas · 2 listas para importar · 1 con error`. |
| 11 | Hacer click en `Importar 2 movimientos`. | Se ve `Se importaron 2 de 3 filas.`, `$1.000,00 en gastos y $2.000,00 en ingresos (en pesos).` y `Fila 4: El monto debe ser mayor a cero`. |
| 12 | Ejecutar IMP-PREP-04. | Existen exactamente las transacciones de filas 2 y 3 con sus nueve campos exactos; descripción de fila 3 es null; no existe transacción para fila 4. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

---

#### CP-IMP-031 — La compra de 240.000 en seis cuotas crea seis imputaciones exactas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-77 · CA-2 · C4 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-031-001@example.com`; sesión cerrada; PR-04 listo.

**Datos de prueba:** `cp-imp-031.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2: `03/09/2026 | Gasto | 240000 | ARS | vacía | Indumentaria | Tarjeta de crédito | 6 | vacía | Campera ficticia`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-031-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-031.xlsx`. | `Fila 2` está `Lista`; muestra `$240.000,00` y `6 cuotas`. |
| 11 | Hacer click en `Importar 1 movimiento`. | Se ve `Se importó 1 de 1 fila.` y `$240.000,00 en gastos y $0,00 en ingresos (en pesos).` |
| 12 | Ejecutar IMP-PREP-04. | La transacción tiene `amount=240000.00`, seis imputaciones `40000.00`, números 1–6, en `2026-09-01` a `2027-02-01`; suman `240000.00`. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

---

#### CP-IMP-032 — Un rechazo tardío de categoría no impide las otras filas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-77 · CA-4 · C6 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | CP-IMP-034 |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-032-001@example.com`; sesión cerrada; segunda sesión del mismo usuario disponible.

**Datos de prueba:** Copia exacta de IMP-DATA-01, incluida la fila 12 vacía.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-032-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `importar-excel-ejemplo.xlsx`. | Fila 6 está `Lista` con `Transporte`. |
| 11 | En la segunda sesión, archivar `Transporte`. | Ajustes muestra la categoría archivada. |
| 12 | En la primera sesión, hacer click en `Importar 7 movimientos`. | Se ve `Se importaron 6 de 11 filas.`, `$321.715,50 en gastos y $850.000,00 en ingresos (en pesos).` y `Fila 6: No existe la categoría «Transporte» o está archivada`; las demás válidas se importan. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

---

#### CP-IMP-033 — Quinientas filas de doce cuotas terminan en menos de diez segundos

| Campo | Contenido |
|---|---|
| Historia · criterio | US-77 · CA-6 |
| Invariante | — |
| Técnica | Prueba de rendimiento |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-033-001@example.com`; deploy Vercel/Supabase hosteado; cronómetro de 0,1 s.

**Datos de prueba:** `cp-imp-033.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`. Filas 2–501: `01/09/2026 | Gasto | 120 | ARS | vacía | Otros | Tarjeta de crédito | 12 | vacía | Carga <n>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-033-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-033.xlsx`. | `500 filas leídas · 500 listas para importar · 0 con error`. |
| 11 | Iniciar el cronómetro. | El cronómetro comienza en `0,0 s`. |
| 12 | Hacer click en `Importar 500 movimientos`. | Muestra `Importando…` deshabilitado. |
| 13 | Detener el cronómetro al aparecer Resultado. | El cronómetro se detiene. |
| 14 | Leer el cronómetro y el título del resultado. | El tiempo es menor a `10,0 s` y se ve `Se importaron 500 de 500 filas.` |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

---

#### CP-IMP-034 — La RPC procesa una válida y rechaza tres inválidas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-77 · CA-7 · C6 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | API |
| Caso par | CP-IMP-013, CP-IMP-014, CP-IMP-032 |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-034-001@example.com`; PR-04 pasos 1–2.

**Datos de prueba:** body literal `{"p_import_id":"77777777-0000-4000-8000-000000000077","p_rows":[{"row":1,"type":"expense","amount":"1000.00","currency":"ARS","fx_rate":null,"category_id":"<uuid Otros>","account_id":"<uuid Efectivo>","installments_count":1,"occurred_on":"2026-09-03","description":"válida"},{"row":2,"type":"expense","amount":"0","currency":"ARS","fx_rate":null,"category_id":"<uuid Otros>","account_id":"<uuid Efectivo>","installments_count":1,"occurred_on":"2026-09-03","description":null},{"row":3,"type":"expense","amount":"500.00","currency":"ARS","fx_rate":null,"category_id":"<uuid Otros>","installments_count":1,"occurred_on":"2026-09-03","description":null},{"row":4,"type":"expense","amount":"abc","currency":"ARS","fx_rate":null,"category_id":"<uuid Otros>","account_id":"<uuid Efectivo>","installments_count":1,"occurred_on":"2026-09-03","description":null}]}`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar IMP-PREP-03 con el body literal de Datos. | HTTP 200; `sent_rows:4`, `imported_rows:1`; fila 1 tiene `status:"imported"` y un `transaction_id`; fila 2 tiene `status:"rejected"`, `error_code:"23514"`, `error_message:"I4: el monto debe ser mayor a cero"`; fila 3 tiene `status:"rejected"`, `error_code:"23503"`, `error_message:"la cuenta no existe, no es tuya o está archivada"`; fila 4 tiene `status:"rejected"` y `error_code:"22P02"`. |
| 2 | Ejecutar IMP-PREP-04. | Existe solo la transacción e imputación de fila 1. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

---

#### CP-IMP-035 — La RPC rechaza un lote de 501 elementos

| Campo | Contenido |
|---|---|
| Historia · criterio | US-77 · CA-8 · C6 |
| Invariante | — |
| Técnica | Análisis de valores límite |
| Tipo | Negativo |
| Canal | API |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-035-001@example.com`; PR-04.

**Datos de prueba:** UUID `79797979-0000-4000-8000-000000000079`; 501 objetos como {"row":1,"type":"expense","amount":"1000.00","currency":"ARS","fx_rate":null,"category_id":"<uuid Otros>","account_id":"<uuid Efectivo>","installments_count":1,"occurred_on":"2026-09-03","description":"válida"}, con `row` 1–501.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar IMP-PREP-03. | HTTP no exitoso de clase 4xx; no hay resultado de lote; el número de status HTTP y el body se registran como evidencia porque la especificación no fija su mapeo ni un `code`. |
| 2 | Ejecutar IMP-PREP-04. | No hay transacciones, imputaciones ni import. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

---

#### CP-IMP-036 — El rol anon no puede ejecutar import_transactions

| Campo | Contenido |
|---|---|
| Historia · criterio | US-77 · CA-9 · C7 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | API |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** Conocer URL y anon key; sin sesión.

**Datos de prueba:** body `{"p_import_id":"80808080-0000-4000-8000-000000000080","p_rows":[{"row":1,"type":"expense","amount":"1000.00","currency":"ARS","fx_rate":null,"category_id":"00000000-0000-4000-8000-000000000001","account_id":"00000000-0000-4000-8000-000000000002","installments_count":1,"occurred_on":"2026-09-03","description":"válida"}]}`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/import_transactions` con `apikey: <ANON_KEY>`, `Authorization: Bearer <ANON_KEY>`, `Content-Type: application/json` y el body de Datos. | HTTP no exitoso de clase 4xx; JSON `code:"42501"` y mensaje de permiso denegado; no se crea nada; el número de status HTTP se registra como evidencia porque la especificación no fija su mapeo. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

---

#### CP-IMP-037 — Otro usuario no ve transacciones ni imports ajenos

| Campo | Contenido |
|---|---|
| Historia · criterio | US-77 · CA-9 · C7 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | API |
| Caso par | CP-IMP-030 |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 para A con `qa+cp-imp-037-001@example.com` y para B con `qa+cp-imp-037-002@example.com`; PR-04 para ambos. Con `<TOKEN-A>`, ejecutar IMP-PREP-03 usando el body de Datos y guardar el `transaction_id` como `<ID-A>`.

**Datos de prueba:** UUID `81818181-0000-4000-8000-000000000081`; body `{"p_import_id":"81818181-0000-4000-8000-000000000081","p_rows":[{"row":1,"type":"expense","amount":"1000.00","currency":"ARS","fx_rate":null,"category_id":"<uuid Otros de A>","account_id":"<uuid Efectivo de A>","installments_count":1,"occurred_on":"2026-09-03","description":"Solo A"}]}`. Las verificaciones usan `<TOKEN-B>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Con token B, ejecutar `GET <SUPABASE_URL>/rest/v1/transactions?select=id&id=eq.<ID-A>` con headers de PR-04 y sin body. | HTTP 200 y cuerpo exacto `[]`. |
| 2 | Con token B, ejecutar `GET <SUPABASE_URL>/rest/v1/imports?select=id&id=eq.81818181-0000-4000-8000-000000000081` con headers de PR-04 y sin body. | HTTP 200 y cuerpo exacto `[]`. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

---

#### CP-IMP-038 — Reintento tras respuesta perdida reconoce lo guardado

| Campo | Contenido |
|---|---|
| Historia · criterio | US-78 · CA-2 · ADR-035 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-038-001@example.com`; PR-04 pasos 1–2. Antes de abrir el navegador, ejecutar IMP-PREP-03 con el body literal `{"p_import_id":"83838383-0000-4000-8000-000000000083","p_rows":[{"row":2,"type":"expense","amount":"1000.00","currency":"ARS","fx_rate":null,"category_id":"<uuid Otros>","account_id":"<uuid Efectivo>","installments_count":1,"occurred_on":"2026-09-01","description":"Compra ficticia"}]}`. Esperado: HTTP 200, `already_imported:false`, `sent_rows:1`, `imported_rows:1` y fila 2 `status:"imported"`. Ejecutar IMP-PREP-04: existe exactamente una transacción y una imputación para ese UUID.

**Datos de prueba:** `cp-imp-038.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = V. UUID fijo `83838383-0000-4000-8000-000000000083`. El registro preexistente representa el commit confirmado cuya respuesta perdió el cliente; el primer intento UI se fuerza sin conexión y el reintento consulta ese mismo UUID.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-038-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Presionar F12. | Se abre DevTools. |
| 10 | Hacer click en la pestaña `Console`. | Se ve el prompt de la consola. |
| 11 | Ejecutar IMP-PREP-06. | La consola devuelve exactamente `83838383-0000-4000-8000-000000000083`. |
| 12 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 13 | Elegir `cp-imp-038.xlsx`. | Se ve una fila `Lista` y el botón `Importar 1 movimiento`. |
| 14 | En DevTools, abrir `Network conditions` y seleccionar `Offline`. | DevTools muestra `Offline`. |
| 15 | Hacer click en `Importar 1 movimiento`. | Se muestra exactamente `No pudimos confirmar la importación. Puede que se haya guardado: tocá Reintentar y te decimos qué pasó.` y el botón `Reintentar`; la revisión y el nombre del archivo siguen visibles. |
| 16 | En DevTools, cambiar `Offline` por `No throttling`. | DevTools muestra `No throttling`. |
| 17 | Hacer click en `Reintentar`. | Se abre el paso 3 y `import-result-already` muestra exactamente `Esta importación ya se había guardado.`. |
| 18 | Ejecutar IMP-PREP-04. | Hay exactamente una transacción de `1000.00` ARS, una imputación de `1000.00` para `2026-09-01` y un import con UUID `83838383-0000-4000-8000-000000000083`; no se creó un duplicado. |
| 19 | Ejecutar en Console la limpieza indicada en IMP-PREP-06. | La consola devuelve `true`; `crypto.randomUUID()` vuelve a generar UUID variables. |

**Post-condición:** Dejar Network en `No throttling`, cerrar DevTools y conservar usuario, archivo y respuestas como evidencia.

---

#### CP-IMP-039 — Dos llamadas API con el mismo import_id son idempotentes

| Campo | Contenido |
|---|---|
| Historia · criterio | US-78 · CA-2 · ADR-035 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | API |
| Caso par | CP-IMP-038 |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-039-001@example.com`; PR-04.

**Datos de prueba:** UUID `85858585-0000-4000-8000-000000000085`; una fila {"row":1,"type":"expense","amount":"1000.00","currency":"ARS","fx_rate":null,"category_id":"<uuid Otros>","account_id":"<uuid Efectivo>","installments_count":1,"occurred_on":"2026-09-03","description":"válida"}.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar IMP-PREP-03. | HTTP 200; `already_imported:false`; guardar transaction_id. |
| 2 | Repetir la misma llamada. | HTTP 200; `already_imported:true`; mismo transaction_id y resultado. |
| 3 | Ejecutar IMP-PREP-04. | Una transacción, una imputación y un import. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

---

#### CP-IMP-040 — Sin respuesta conserva Revisión

| Campo | Contenido |
|---|---|
| Historia · criterio | US-78 · CA-3 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-040-001@example.com`; sesión cerrada; DevTools Network abierto en Online.

**Datos de prueba:** `cp-imp-040.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = V.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-040-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-040.xlsx`. | Una fila lista. |
| 11 | Cambiar Network a Offline. | DevTools muestra Offline. |
| 12 | Hacer click en `Importar 1 movimiento`. | Sigue en Revisión; muestra exactamente `No pudimos confirmar la importación. Puede que se haya guardado: tocá Reintentar y te decimos qué pasó.`; botón `Reintentar`. |
| 13 | Ejecutar IMP-PREP-04 después de volver Network a Online. | No hay transacciones ni imputaciones. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

---

#### CP-IMP-041 — Sesión vencida ofrece volver a entrar

| Campo | Contenido |
|---|---|
| Historia · criterio | US-78 · CA-3 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-041-001@example.com`; DevTools para interceptar HTTP 401 con `42501`.

**Datos de prueba:** `cp-imp-041.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = V.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-041-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-041.xlsx`. | Una fila lista. |
| 11 | Hacer click en `Importar 1 movimiento`. | Sigue en Revisión; muestra exactamente `Tu sesión venció y no se importó ninguna fila. Volvé a entrar y subí el archivo de nuevo.`; botón `Volver a entrar`. |
| 12 | Ejecutar IMP-PREP-04. | No hay transacciones ni imputaciones. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

---

### Suscripciones (SUS, 48 casos)

Fuente: [`casos/sus.md`](casos/sus.md).

#### Convención de fechas relativas para la ejecución manual

El cliente (`todayInArgentina()`, ADR-031) y las funciones RPC del servidor (`public.argentina_today()`, ADR-021 y ADR-030) leen la fecha real del calendario en el huso `America/Argentina/Buenos_Aires`. Como en una prueba manual de caja negra no se altera el reloj del servidor ni del navegador, todos los casos de este documento declaran las fechas **relativas al día de ejecución (`<HOY>`)** e incluyen entre paréntesis un **ejemplo concreto tomando `<HOY> = 06/10/2026` (`2026-10-06`, `<MES_ACTUAL> = 2026-10` / `"octubre 2026"`)**:

| Símbolo en el caso | Definición relativa a la fecha de ejecución | Ejemplo concreto si `<HOY> = 06/10/2026` |
|---|---|---|
| `<HOY>` / `<HOY_ISO>` | Fecha actual en Argentina en formato `DD/MM/AAAA` / `AAAA-MM-DD` | `06/10/2026` / `2026-10-06` |
| `<DIA_HOY>` | Número de día del mes de `<HOY>` (`1` a `31`) | `6` |
| `<DIA_AYER>` | `<DIA_HOY> - 1` (requiere ejecutar en un día del mes $\ge 2$) | `5` |
| `<DIA_MAÑANA>` | `<DIA_HOY> + 1` (requiere ejecutar en un día del mes $\le 27$) | `7` |
| `<MES_ACTUAL>` | Período corriente en formato `AAAA-MM` (o `"mes AAAA"` en textos de UI) | `2026-10` (`"octubre 2026"`, mes corto `"octubre"`) |
| `<MES_ANTERIOR>` | 1 mes antes de `<MES_ACTUAL>` | `2026-09` (`"septiembre 2026"`, mes corto `"septiembre"`) |
| `<MES_HACE_2>` | 2 meses antes de `<MES_ACTUAL>` | `2026-08` (`"agosto 2026"`) |
| `<MES_HACE_3>` | 3 meses antes de `<MES_ACTUAL>` | `2026-07` (`"julio 2026"`) |
| `<MES_HACE_4>` | 4 meses antes de `<MES_ACTUAL>` | `2026-06` (`"junio 2026"`) |
| `<MES_HACE_5>` | 5 meses antes de `<MES_ACTUAL>` | `2026-05` (`"mayo 2026"`) |
| `<MES_HACE_24>` | 24 meses antes de `<MES_ACTUAL>` (mínimo permitido en alta, ADR-032) | `2024-10` (`"octubre 2024"`) |
| `<MES_HACE_25>` | 25 meses antes de `<MES_ACTUAL>` (primer mes fuera de rango inferior) | `2024-09` (`"septiembre 2024"`) |
| `<MES_SIGUIENTE>` | 1 mes después de `<MES_ACTUAL>` | `2026-11` (`"noviembre 2026"`) |
| `<MES_MAS_2>` | 2 meses después de `<MES_ACTUAL>` | `2026-12` (`"diciembre 2026"`) |
| `<MES_MAS_3>` | 3 meses después de `<MES_ACTUAL>` | `2027-01` (`"enero 2027"`) |
| `<MES_MAS_12>` | 12 meses después de `<MES_ACTUAL>` (máximo permitido en alta, ADR-032) | `2027-10` (`"octubre 2027"`) |
| `<MES_MAS_13>` | 13 meses después de `<MES_ACTUAL>` (primer mes fuera de rango superior) | `2027-11` (`"noviembre 2027"`) |

En llamadas a las RPC (`create_subscription`, `update_subscription`, `upsert_fx_rate`), cada período `AAAA-MM` se envía como fecha del primer día del mes (`<MES>-01`, por ejemplo `"2026-08-01"`), y todo monto decimal se envía como string (`"5000.00"`, `C2` y `docs/12-procedimientos-de-prueba.md`).

#### CP-SUS-001 — Dar de alta una suscripción en ARS desde hace 2 meses con día de cobro 10 genera los 2 gastos vencidos al guardar

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-1, CA-2, CA-12 · FR-15 · R1, R4, R5, R8 |
| Invariante | I4, I12, I13 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` (por defecto `http://localhost:5173`). S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`, con la cuenta `"Efectivo"` en `ARS` y la categoría `"Entretenimiento"` activas. S 3: la fecha de ejecución `<HOY>` tiene `<DIA_HOY> < 10` (ejemplo concreto: `<HOY> = 06/10/2026`, `<MES_ACTUAL> = 2026-10`, `<MES_HACE_2> = 2026-08`, `<MES_ANTERIOR> = 2026-09`; si `<DIA_HOY> >= 10`, usar `D 8 = "28"`).

**Datos de prueba:** D 1: Email `qa+cp-sus-001-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Netflix"`. D 4: Monto `"5000"`. D 5: Moneda `"ARS"`. D 6: Categoría `"Entretenimiento"`. D 7: Medio de pago `"Efectivo"`. D 8: Día de cobro `"10"`. D 9: Mes de inicio `"<MES_HACE_2>"` (`"2026-08"`). D 10: Descripción `"Plan estándar"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en el campo `"Email"` (`login-email`) | El campo `"Email"` toma foco |
| 4 | Escribir `qa+cp-sus-001-001@example.com` | El campo `"Email"` muestra `qa+cp-sus-001-001@example.com` |
| 5 | Hacer click en el campo `"Contraseña"` (`login-password`) | El campo `"Contraseña"` toma foco |
| 6 | Escribir `Clave123!` | El campo `"Contraseña"` muestra 9 caracteres ocultos |
| 7 | Hacer click en el botón `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 8 | Hacer click en `"Suscripciones"` en la barra de navegación (`register-nav-subscriptions`) | Se abre `/subscriptions` con el encabezado `"Suscripciones"` (`subscriptions-title`) |
| 9 | Hacer click en el botón `"Nueva"` (`subscriptions-new`) | Se abre `/subscriptions/new` con el formulario `"Nueva suscripción"` (`subscription-form`), Moneda `"ARS"` seleccionada y `"Mes de inicio"` en `<MES_ACTUAL>` |
| 10 | Hacer click en el campo `"Nombre"` (`subscription-form-name`) | El campo `"Nombre"` toma foco |
| 11 | Escribir `Netflix` | El campo `"Nombre"` muestra `Netflix` |
| 12 | Hacer click en el campo `"Monto"` (`subscription-form-amount`) | El campo `"Monto"` toma foco |
| 13 | Escribir `5000` | El campo `"Monto"` muestra `5000` |
| 14 | Seleccionar `"Entretenimiento"` en el desplegable `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 15 | Seleccionar `"Efectivo"` en el desplegable `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 16 | Hacer click en el campo `"Día de cobro"` (`subscription-form-billing-day`) | El campo `"Día de cobro"` toma foco |
| 17 | Escribir `10` | El campo `"Día de cobro"` muestra `10` |
| 18 | Ingresar `<MES_HACE_2>` (ej. `2026-08`) en el campo `"Mes de inicio"` (`subscription-form-start-period`) | `"Mes de inicio"` muestra `<MES_HACE_2>` y `subscription-form-preview-summary` muestra `"Al guardar se cargan 2 gastos de $5.000,00 (total $10.000,00)."` |
| 19 | Hacer click en el campo `"Descripción (opcional)"` (`subscription-form-description`) | El campo `"Descripción (opcional)"` toma foco |
| 20 | Escribir `Plan estándar` | El campo muestra `Plan estándar` y el contador inferior indica `13/200` |
| 21 | Hacer click en el botón `"Guardar suscripción"` (`subscription-form-submit`) | Navega a `/subscriptions/<SUB_ID>`, muestra el aviso `"Suscripción guardada. Se cargaron 2 gastos vencidos."` (`subscription-toast`), el título `"Netflix"` (`subscription-detail-name`), el estado `"Activa"` (`subscription-detail-status` con `data-status="active"`), `"Monto"` `"$5.000,00"`, `"Desde"` `"<mes hace 2>"` (ej. `"agosto 2026"`), `"Hasta"` `"Sin fin"`, `"Próximo cobro"` `"10/<MES_ACTUAL>"` (ej. `"10/10/2026"`), `"Descripción"` `"Plan estándar"` y en `"Gastos cargados"` (`subscription-detail-occurrences`) 2 filas: `<MES_ANTERIOR>` (`10/09/2026`, `"$5.000,00"`) y `<MES_HACE_2>` (`10/08/2026`, `"$5.000,00"`) |
| 22 | Hacer click en el botón atrás (`subscription-detail-back`) | Navega a `/subscriptions` y bajo el grupo `"Activas"` aparece la fila `"Netflix"` (`subscriptions-item` con `data-status="active"`), monto `"$5.000,00"` y `"Se cobra el día 10"` |

**Post-condición:** La suscripción `"Netflix"` queda visible en el grupo `"Activas"` con 2 gastos cargados (`<MES_HACE_2>` y `<MES_ANTERIOR>`). El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-002 — Dar de alta una suscripción en ARS desde el mes siguiente no genera gastos al guardar

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-1, CA-2 · US-53 · CA-13 · US-61 · CA-5 · FR-15, FR-16 · R1, R5, R8 |
| Invariante | I12, I17 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · Sí · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`, con cuenta `"Efectivo"` y categoría `"Entretenimiento"` activas.

**Datos de prueba:** D 1: Email `qa+cp-sus-002-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Disney+"`. D 4: Monto `"4200"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"15"`. D 8: Mes de inicio `"<MES_SIGUIENTE>"` (ej. `"2026-11"` si `<HOY> = 06/10/2026`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en `"Email"` (`login-email`) | El campo toma foco |
| 4 | Escribir `qa+cp-sus-002-001@example.com` | El campo muestra `qa+cp-sus-002-001@example.com` |
| 5 | Hacer click en `"Contraseña"` (`login-password`) | El campo toma foco |
| 6 | Escribir `Clave123!` | El campo muestra 9 caracteres ocultos |
| 7 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 8 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 9 | Hacer click en `"Nueva"` (`subscriptions-new`) | Se abre `/subscriptions/new` |
| 10 | Hacer click en `"Nombre"` (`subscription-form-name`) y escribir `Disney+` | El campo `"Nombre"` muestra `Disney+` |
| 11 | Hacer click en `"Monto"` (`subscription-form-amount`) y escribir `4200` | El campo `"Monto"` muestra `4200` |
| 12 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 13 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 14 | Hacer click en `"Día de cobro"` (`subscription-form-billing-day`) y escribir `15` | El campo `"Día de cobro"` muestra `15` |
| 15 | Ingresar `<MES_SIGUIENTE>` (ej. `2026-11`) en `"Mes de inicio"` (`subscription-form-start-period`) | `subscription-form-preview-summary` muestra `"Al guardar no se carga ningún gasto."` |
| 16 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada"` (`subscription-toast`), `"Próximo cobro"` (`subscription-detail-next-charge`) muestra `"15/<MES_SIGUIENTE>"` (ej. `"15/11/2026"`) y en `"Gastos cargados"` se lee `"Todavía no se cargó ningún gasto. El primero se carga el 15/<MES_SIGUIENTE>."` (`subscription-detail-occurrences-empty`) |

**Post-condición:** La suscripción `"Disney+"` queda activa sin transacciones cargadas. El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-003 — Dar de alta una suscripción con el mismo nombre que una suscripción cancelada se acepta

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-7 · US-58 · CA-7 · FR-15, FR-17 |
| Invariante | I15 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`, y con PR-04 (pasos 1 y 2) se obtuvieron `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Entretenimiento"`. S 3: con PR-04 se creó una suscripción `"Netflix"` (`p_amount: "4000.00"`, `p_billing_day: 10`, `p_start_period: "<MES_SIGUIENTE>-01"`) y se la canceló con `POST <SUPABASE_URL>/rest/v1/rpc/cancel_subscription` (`{"p_subscription_id":"<SUB_CANCELLED_ID>"}`).

**Datos de prueba:** D 1: Email `qa+cp-sus-003-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Netflix"`. D 4: Monto `"6500"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"15"`. D 8: Mes de inicio `"<MES_SIGUIENTE>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en `"Email"` (`login-email`) y escribir `qa+cp-sus-003-001@example.com` | El campo muestra `qa+cp-sus-003-001@example.com` |
| 4 | Hacer click en `"Contraseña"` (`login-password`) y escribir `Clave123!` | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/new` | Se abre `"Nueva suscripción"` |
| 7 | Hacer click en `"Nombre"` (`subscription-form-name`) y escribir `Netflix` | El campo muestra `Netflix` |
| 8 | Hacer click en `"Monto"` (`subscription-form-amount`) y escribir `6500` | El campo muestra `6500` |
| 9 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 10 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 11 | Hacer click en `"Día de cobro"` (`subscription-form-billing-day`) y escribir `15` | El campo muestra `15` |
| 12 | Ingresar `<MES_SIGUIENTE>` en `"Mes de inicio"` (`subscription-form-start-period`) | `"Mes de inicio"` muestra `<MES_SIGUIENTE>` |
| 13 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | Navega a `/subscriptions/<NEW_SUB_ID>`, muestra `"Suscripción guardada"` y estado `"Activa"` (`data-status="active"`) con `"Monto"` `"$6.500,00"` |
| 14 | Hacer click en el botón atrás (`subscription-detail-back`) | En `/subscriptions` aparece `"Netflix"` (`$6.500,00`) bajo `"Activas"` y `"Netflix"` (`$4.000,00`) bajo `"Canceladas"` |

**Post-condición:** Coexisten la suscripción `"Netflix"` cancelada y la nueva `"Netflix"` activa (`I15`). El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-004 — Rechazar en UI el alta de suscripción con Nombre vacío o solo espacios

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3 · FR-15 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · CP-SUS-005 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-004-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"   "` (tres espacios). D 4: Monto `"5000"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"10"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en `"Email"` (`login-email`) y escribir `qa+cp-sus-004-001@example.com` | El campo muestra `qa+cp-sus-004-001@example.com` |
| 4 | Hacer click en `"Contraseña"` (`login-password`) y escribir `Clave123!` | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/new` | Se abre `"Nueva suscripción"` |
| 7 | Hacer click en `"Nombre"` (`subscription-form-name`) y escribir `"   "` | El campo muestra tres espacios |
| 8 | Hacer click en `"Monto"` (`subscription-form-amount`) y escribir `5000` | El campo muestra `5000` |
| 9 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 10 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 11 | Hacer click en `"Día de cobro"` (`subscription-form-billing-day`) y escribir `10` | El campo muestra `10` |
| 12 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | La URL sigue siendo `/subscriptions/new` y debajo de `"Nombre"` aparece `"Escribí un nombre"` (`role="alert"`) |

**Post-condición:** No se creó ninguna suscripción. El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-005 — Rechazar en API `create_subscription` con Nombre vacío o solo espacios

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3, CA-8 · FR-15 · C6 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-SUS-004 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Entretenimiento"`.

**Datos de prueba:** D 1: Email `qa+cp-sus-005-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_name = "   "`. D 4: `p_amount = "5000.00"`. D 5: `p_currency = "ARS"`. D 6: `p_billing_day = 10`. D 7: `p_start_period = "<MES_ACTUAL>-01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"   ","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":10,"p_start_period":"<MES_ACTUAL>-01","p_end_period":null,"p_description":null}` | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "Escribí un nombre"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.subscriptions` existen 0 filas para el usuario. El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-006 — Rechazar en UI el alta de suscripción con Nombre igual al de otra activa sin distinguir mayúsculas ni espacios (`" netflix "`)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3, CA-7 · FR-15 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · CP-SUS-007 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`, y con PR-04 (pasos 1 y 2) se obtuvieron `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 3: con PR-04 se creó una suscripción activa con `D 3` (`POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con `p_name: "Netflix"`, `p_amount: "5000.00"`, `p_currency: "ARS"`, `p_category_id: "<CATEGORY_ID>"`, `p_account_id: "<ACCOUNT_ID>"`, `p_billing_day: 10`, `p_start_period: "<MES_SIGUIENTE>-01"`).

**Datos de prueba:** D 1: Email `qa+cp-sus-006-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre existente `"Netflix"`. D 4: Nombre nuevo `" netflix "`. D 5: Monto `"6000"`. D 6: Categoría `"Entretenimiento"`. D 7: Medio de pago `"Efectivo"`. D 8: Día de cobro `"15"`. D 9: Mes de inicio `"<MES_SIGUIENTE>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en `"Email"` (`login-email`) y escribir `qa+cp-sus-006-001@example.com` | El campo muestra `qa+cp-sus-006-001@example.com` |
| 4 | Hacer click en `"Contraseña"` (`login-password`) y escribir `Clave123!` | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/new` | Se abre `"Nueva suscripción"` |
| 7 | Hacer click en `"Nombre"` (`subscription-form-name`) y escribir `" netflix "` | El campo muestra `" netflix "` |
| 8 | Hacer click en `"Monto"` (`subscription-form-amount`) y escribir `6000` | El campo muestra `6000` |
| 9 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 10 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 11 | Hacer click en `"Día de cobro"` (`subscription-form-billing-day`) y escribir `15` | El campo muestra `15` |
| 12 | Ingresar `<MES_SIGUIENTE>` en `"Mes de inicio"` (`subscription-form-start-period`) | `"Mes de inicio"` muestra `<MES_SIGUIENTE>` |
| 13 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | La URL sigue siendo `/subscriptions/new` y debajo de `"Nombre"` aparece `"Ya tenés una suscripción con ese nombre"` |

**Post-condición:** No se creó una segunda suscripción `"Netflix"`. El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-007 — Rechazar en API `create_subscription` con Nombre igual al de otra activa (`" netflix "`)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-7, CA-8 · FR-15 · C6 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-SUS-006 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`, y se creó una suscripción activa con `D 3` (`p_name: "Netflix"`, `p_amount: "5000.00"`).

**Datos de prueba:** D 1: Email `qa+cp-sus-007-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre existente `"Netflix"`. D 4: `p_name = " netflix "`. D 5: `p_amount = "6000.00"`. D 6: `p_currency = "ARS"`. D 7: `p_billing_day = 15`. D 8: `p_start_period = "<MES_SIGUIENTE>-01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":" netflix ","p_amount":"6000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":15,"p_start_period":"<MES_SIGUIENTE>-01","p_end_period":null,"p_description":null}` | Respuesta HTTP `409 Conflict` con `"code": "23505"` y `"message": "Ya tenés una suscripción con ese nombre"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?select=name,amount` | Respuesta HTTP `200 OK` con 1 única fila (`[{"name":"Netflix","amount":5000}]`) |

**Post-condición:** En `public.subscriptions` sigue existiendo 1 sola fila para el usuario. El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-008 — Rechazar en UI el alta de suscripción con Monto igual a `"0"`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3 · FR-15 |
| Invariante | I4 |
| Técnica · Tipo | Análisis de valores límite · Negativo |
| Canal · Caso par | UI · CP-SUS-009 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-008-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Netflix"`. D 4: Monto `"0"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"10"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en `"Email"` (`login-email`) y escribir `qa+cp-sus-008-001@example.com` | El campo muestra `qa+cp-sus-008-001@example.com` |
| 4 | Hacer click en `"Contraseña"` (`login-password`) y escribir `Clave123!` | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/new` | Se abre `"Nueva suscripción"` |
| 7 | Hacer click en `"Nombre"` (`subscription-form-name`) y escribir `Netflix` | El campo muestra `Netflix` |
| 8 | Hacer click en `"Monto"` (`subscription-form-amount`) y escribir `0` | El campo muestra `0` |
| 9 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 10 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 11 | Hacer click en `"Día de cobro"` (`subscription-form-billing-day`) y escribir `10` | El campo muestra `10` |
| 12 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | La URL sigue siendo `/subscriptions/new` y debajo de `"Monto"` aparece `"El monto debe ser mayor a cero"` |

**Post-condición:** No se creó ninguna suscripción (`I4`). El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-009 — Rechazar en API `create_subscription` con `p_amount = "0.00"`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3, CA-8 · FR-15 · C6 |
| Invariante | I4 |
| Técnica · Tipo | Análisis de valores límite · Negativo |
| Canal · Caso par | API · CP-SUS-008 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-009-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_name = "Netflix"`. D 4: `p_amount = "0.00"`. D 5: `p_currency = "ARS"`. D 6: `p_billing_day = 10`. D 7: `p_start_period = "<MES_ACTUAL>-01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"0.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":10,"p_start_period":"<MES_ACTUAL>-01","p_end_period":null,"p_description":null}` | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "El monto debe ser mayor a cero"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.subscriptions` existen 0 filas para el usuario (`I4`). El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-010 — Rechazar en API `create_subscription` en ARS con Monto mayor al máximo (`"1000000000000.00"`)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3, CA-8 · FR-15 · C6 |
| Invariante | — |
| Técnica · Tipo | Análisis de valores límite · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-010-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_name = "Netflix"`. D 4: `p_amount = "1000000000000.00"`. D 5: `p_currency = "ARS"`. D 6: `p_billing_day = 10`. D 7: `p_start_period = "<MES_ACTUAL>-01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"1000000000000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":10,"p_start_period":"<MES_ACTUAL>-01","p_end_period":null,"p_description":null}` | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "El monto máximo es $999.999.999.999,99"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.subscriptions` existen 0 filas para el usuario. El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-011 — Rechazar en API `create_subscription` con `p_category_id = null`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3, CA-8 · FR-15 · C6 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ACCESS_TOKEN>` y `<ACCOUNT_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-011-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_name = "Netflix"`. D 4: `p_amount = "5000.00"`. D 5: `p_category_id = null`. D 6: `p_billing_day = 10`. D 7: `p_start_period = "<MES_ACTUAL>-01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":null,"p_account_id":"<ACCOUNT_ID>","p_billing_day":10,"p_start_period":"<MES_ACTUAL>-01","p_end_period":null,"p_description":null}` | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "Elegí una categoría"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.subscriptions` existen 0 filas para el usuario. El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-012 — Rechazar en API `create_subscription` con `p_billing_day = 32`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-4, CA-8 · FR-15 · C6 |
| Invariante | I13 |
| Técnica · Tipo | Análisis de valores límite · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-012-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_name = "Netflix"`. D 4: `p_amount = "5000.00"`. D 5: `p_billing_day = 32`. D 6: `p_start_period = "<MES_ACTUAL>-01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":32,"p_start_period":"<MES_ACTUAL>-01","p_end_period":null,"p_description":null}` | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "El día de cobro va de 1 a 31"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.subscriptions` existen 0 filas para el usuario (`I13`). El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-013 — Rechazar en API `create_subscription` con Mes de inicio anterior al límite inferior (`-25` meses)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-5, CA-8 · FR-15 · C6 · ADR-032 |
| Invariante | — |
| Técnica · Tipo | Análisis de valores límite · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-013-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_name = "Netflix"`. D 4: `p_amount = "5000.00"`. D 5: `p_billing_day = 10`. D 6: `p_start_period = "<MES_HACE_25>-01"` (ej. `"2024-09-01"`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":10,"p_start_period":"<MES_HACE_25>-01","p_end_period":null,"p_description":null}` | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "El mes de inicio va de <mes hace 24> a <mes +12>"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.subscriptions` existen 0 filas para el usuario. El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-014 — Rechazar en API `create_subscription` con `p_end_period < p_start_period`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3, CA-8 · FR-15 · C6 |
| Invariante | I12 |
| Técnica · Tipo | Análisis de valores límite · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-014-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_name = "Netflix"`. D 4: `p_amount = "5000.00"`. D 5: `p_billing_day = 10`. D 6: `p_start_period = "<MES_ACTUAL>-01"`. D 7: `p_end_period = "<MES_ANTERIOR>-01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":10,"p_start_period":"<MES_ACTUAL>-01","p_end_period":"<MES_ANTERIOR>-01","p_description":null}` | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "El mes de fin no puede ser anterior al de inicio"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.subscriptions` existen 0 filas para el usuario (`I12`). El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-015 — Rechazar en API `create_subscription` con Descripción de 201 caracteres

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3, CA-8 · FR-15 · C6 · ADR-032 |
| Invariante | — |
| Técnica · Tipo | Análisis de valores límite · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Baja · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-015-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_name = "Netflix"`. D 4: `p_amount = "5000.00"`. D 5: `p_billing_day = 10`. D 6: `p_start_period = "<MES_ACTUAL>-01"`. D 7: `p_description = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaZ"` (201 caracteres).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":10,"p_start_period":"<MES_ACTUAL>-01","p_end_period":null,"p_description":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaZ"}` | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "La descripción admite hasta 200 caracteres"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.subscriptions` existen 0 filas para el usuario. El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-016 — Rechazar en API `create_subscription` con `p_category_id` propia archivada

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3, CA-8 · FR-15 · C6 · ADR-030 |
| Invariante | I8 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` (`"Efectivo"`) y `<CATEGORY_ID>` (`"Entretenimiento"`). S 3: se archivó `<CATEGORY_ID>` ejecutando con PR-04 `PATCH <SUPABASE_URL>/rest/v1/categories?id=eq.<CATEGORY_ID>` con body `{"archived_at":"2026-01-01T00:00:00Z"}` (HTTP `204`).

**Datos de prueba:** D 1: Email `qa+cp-sus-016-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_name = "Netflix"`. D 4: `p_amount = "5000.00"`. D 5: `p_currency = "ARS"`. D 6: `p_billing_day = 10`. D 7: `p_start_period = "<MES_ACTUAL>-01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":10,"p_start_period":"<MES_ACTUAL>-01","p_end_period":null,"p_description":null}` | Respuesta HTTP `409 Conflict` con `"code": "23503"` y `"message": "La categoría no está disponible"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.subscriptions` existen 0 filas para el usuario. El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-017 — Rechazar en API `create_subscription` usando `p_category_id` de otro usuario

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3, CA-8, CA-15 · FR-15 · C6, C7 · ADR-030 |
| Invariante | I8 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: con PR-05 se crearon Usuario A (`D 1`, `<ACCESS_TOKEN_A>`, `<ACCOUNT_ID_A>`) y Usuario B (`D 2`, `<ACCESS_TOKEN_B>`, `<CATEGORY_ID_B>`).

**Datos de prueba:** D 1: Email A `qa+cp-sus-017-001@example.com` / Contraseña `Clave123!`. D 2: Email B `qa+cp-sus-017-002@example.com` / Contraseña `Clave123!`. D 3: `p_name = "Netflix"`. D 4: `p_amount = "5000.00"`. D 5: `p_billing_day = 10`. D 6: `p_start_period = "<MES_ACTUAL>-01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 usando `<ACCESS_TOKEN_A>` `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID_B>","p_account_id":"<ACCOUNT_ID_A>","p_billing_day":10,"p_start_period":"<MES_ACTUAL>-01","p_end_period":null,"p_description":null}` | Respuesta HTTP `409 Conflict` con `"code": "23503"` y `"message": "La categoría no está disponible"` |
| 2 | Ejecutar con PR-08 usando `<ACCESS_TOKEN_A>` `GET <SUPABASE_URL>/rest/v1/subscriptions?select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.subscriptions` existen 0 filas para Usuario A y 0 filas para Usuario B. Los usuarios A y B quedan como datos de prueba (emails únicos, sin limpieza).

---

#### CP-SUS-018 — Rechazar en API un `INSERT` directo sobre `/rest/v1/subscriptions` con la sesión del usuario

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-9 · FR-15 · C5, C7 · ADR-030 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<USER_ID>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-018-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `name = "Netflix"`. D 4: `amount = "5000.00"`. D 5: `currency = "ARS"`. D 6: `billing_day = 10`. D 7: `start_period = "<MES_ACTUAL>-01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/subscriptions` con body `{"user_id":"<USER_ID>","name":"Netflix","amount":"5000.00","currency":"ARS","billing_day":10,"account_id":"<ACCOUNT_ID>","category_id":"<CATEGORY_ID>","start_period":"<MES_ACTUAL>-01","generate_from_period":"<MES_ACTUAL>-01","status":"active"}` | Respuesta HTTP `403 Forbidden` con `"code": "42501"` (`permission denied for table subscriptions`) |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.subscriptions` existen 0 filas para el usuario. El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-019 — Dos toques seguidos en `"Guardar suscripción"` deshabilitan el botón y crean una sola suscripción

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-10 · FR-15 |
| Invariante | I12 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-019-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Netflix"`. D 4: Monto `"5000"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"28"`. D 8: Mes de inicio `"<MES_SIGUIENTE>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-019-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-019-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en `"Nueva"` (`subscriptions-new`) | Se abre `/subscriptions/new` |
| 8 | Escribir `Netflix` en `"Nombre"` (`subscription-form-name`) | El campo muestra `Netflix` |
| 9 | Escribir `5000` en `"Monto"` (`subscription-form-amount`) | El campo muestra `5000` |
| 10 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 11 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 12 | Escribir `28` en `"Día de cobro"` (`subscription-form-billing-day`) | El campo muestra `28` |
| 13 | Ingresar `<MES_SIGUIENTE>` en `"Mes de inicio"` (`subscription-form-start-period`) | `"Mes de inicio"` muestra `<MES_SIGUIENTE>` |
| 14 | Hacer doble click rápido sobre el botón `"Guardar suscripción"` (`subscription-form-submit`) | Tras el primer toque el botón queda deshabilitado (`disabled`) con el texto `"Guardando…"` y al completar navega a `/subscriptions/<SUB_ID>` mostrando el aviso `"Suscripción guardada"` (`subscription-toast`) |
| 15 | Hacer click en el botón atrás (`subscription-detail-back`) | Navega a `/subscriptions` y bajo `"Activas"` aparece una única fila `"Netflix"` (`subscriptions-item`) |

**Post-condición:** En `public.subscriptions` existe 1 sola fila con `name = 'Netflix'` para el usuario. El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-020 — Rechazar en UI ver el detalle de una suscripción de otro usuario mostrando `subscription-detail-not-found`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-13, CA-14 · FR-15 · C7 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · CP-SUS-021 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: con PR-05 se crearon Usuario A (`D 1`) y Usuario B (`D 2`, `<ACCESS_TOKEN_B>`, `<ACCOUNT_ID_B>`, `<CATEGORY_ID_B>`). S 3: con PR-04 usando `<ACCESS_TOKEN_B>` se ejecutó `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix B","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID_B>","p_account_id":"<ACCOUNT_ID_B>","p_billing_day":28,"p_start_period":"<MES_SIGUIENTE>-01","p_end_period":null,"p_description":null}`, guardando `subscription_id` como `<SUB_ID_B>`.

**Datos de prueba:** D 1: Email A `qa+cp-sus-020-001@example.com` / Contraseña `Clave123!`. D 2: Email B `qa+cp-sus-020-002@example.com` / Contraseña `Clave123!`. D 3: URL `<APP>/subscriptions/<SUB_ID_B>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-020-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-020-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/<SUB_ID_B>` | Se muestra el estado `subscription-detail-not-found` con el texto `"No encontramos esta suscripción."` y el enlace `"Ver suscripciones"` (`subscription-detail-not-found-back`), sin exponer ningún dato de `"Netflix B"` |

**Post-condición:** Usuario A no accede a los datos de Usuario B. Los usuarios A y B quedan como datos de prueba (emails únicos, sin limpieza).

---

#### CP-SUS-021 — Rechazar en API leer una suscripción de otro usuario (`GET /rest/v1/subscriptions` devuelve `[]`)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-13 · FR-15 · C7 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-SUS-020 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: con PR-05 se crearon Usuario A (`D 1`, `<ACCESS_TOKEN_A>`) y Usuario B (`D 2`, `<ACCESS_TOKEN_B>`, `<ACCOUNT_ID_B>`, `<CATEGORY_ID_B>`). S 2: con PR-04 usando `<ACCESS_TOKEN_B>` se creó una suscripción `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix B","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID_B>","p_account_id":"<ACCOUNT_ID_B>","p_billing_day":28,"p_start_period":"<MES_SIGUIENTE>-01","p_end_period":null,"p_description":null}`, guardando `subscription_id` como `<SUB_ID_B>`.

**Datos de prueba:** D 1: Email A `qa+cp-sus-021-001@example.com` / Contraseña `Clave123!`. D 2: Email B `qa+cp-sus-021-002@example.com` / Contraseña `Clave123!`. D 3: `id = "<SUB_ID_B>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-08 usando `Authorization: Bearer <ACCESS_TOKEN_A>` `GET <SUPABASE_URL>/rest/v1/subscriptions?id=eq.<SUB_ID_B>&select=*` | Respuesta HTTP `200 OK` con body `[]` (0 filas devueltas por RLS) |

**Post-condición:** La suscripción `<SUB_ID_B>` de Usuario B no es visible para Usuario A. Los usuarios A y B quedan como datos de prueba (emails únicos, sin limpieza).

---

#### CP-SUS-022 — Rechazar en API `create_subscription` sin sesión autenticada (rol `anon`)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-13 · FR-15 · C7 · ADR-030 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-022-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Header `Authorization: Bearer <ANON_KEY>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con headers `apikey: <ANON_KEY>` y `Authorization: Bearer <ANON_KEY>` y body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":10,"p_start_period":"<MES_ACTUAL>-01","p_end_period":null,"p_description":null}` | Respuesta HTTP `401 Unauthorized` con `"code": "42501"` (`permission denied for function create_subscription`). *Corregido en V3 (DEF-035): PostgREST responde 401 al rol `anon`; el caso esperaba 403.* |

**Post-condición:** No se crea ninguna suscripción. El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-023 — Mostrar estado vacío `subscriptions-empty` y ocultar la tarjeta del total comprometido cuando el usuario no tiene suscripciones

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-14 · US-63 (Pantalla) · FR-15 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Baja · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2` (con 0 suscripciones).

**Datos de prueba:** D 1: Email `qa+cp-sus-023-001@example.com`. D 2: Contraseña `Clave123!`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-023-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-023-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions`; se muestra `subscriptions-empty` con el texto `"Todavía no tenés suscripciones. Cargá lo que pagás todos los meses y se registra solo."` y el botón `"Agregar la primera"` (`subscriptions-empty-new`), y no se muestra la tarjeta `subscriptions-committed` |

**Post-condición:** El usuario sigue con 0 suscripciones. El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-024 — Puesta al día automática al entrar a la app genera 2 períodos vencidos pendientes y muestra el aviso `app-catchup-generated`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-53 · CA-1, CA-9 · FR-16 · R1, R4, R5, R6, R7 · C4, C5 · ADR-017, ADR-030, ADR-031 |
| Invariante | I1, I1', I2, I4, I5, I11, I14, I17 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` (`"Efectivo"`) y `<CATEGORY_ID>` (`"Entretenimiento"`). S 4: se creó una suscripción en `USD` aún sin tipos de cambio cargados para que quede con 0 transacciones generadas en `<MES_HACE_2>` y `<MES_ANTERIOR>`: se ejecutó con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Disney+","p_amount":"10.00","p_currency":"USD","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_start_period":"<MES_HACE_2>-01","p_end_period":null,"p_description":null}` (`"generated": 0`), guardando `subscription_id` como `<SUB_ID>`. S 5: se cargaron los tipos de cambio de `<MES_HACE_2>` y `<MES_ANTERIOR>` por API (sin disparar la puesta al día de la UI) ejecutando con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/upsert_fx_rate` con `{"p_period":"<MES_HACE_2>-01","p_ars_per_usd":"1200.00"}` y `POST <SUPABASE_URL>/rest/v1/rpc/upsert_fx_rate` con `{"p_period":"<MES_ANTERIOR>-01","p_ars_per_usd":"1200.00"}`.

**Datos de prueba:** D 1: Email `qa+cp-sus-024-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Suscripción `"Disney+"` (`USD 10,00`, día `28`, inicio `<MES_HACE_2>`) con tipos de cambio `1200.00` en `<MES_HACE_2>` y `<MES_ANTERIOR>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-024-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-024-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`); la puesta al día corre automáticamente y muestra el aviso `app-catchup-generated` con el texto `"Se cargaron 2 gastos de suscripciones"` |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en la fila `"Disney+"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) | Se abre `/subscriptions/<SUB_ID>`; en `"Gastos cargados"` (`subscription-detail-occurrences`) aparecen exactamente 2 filas (`subscription-detail-occurrence`): `<MES_ANTERIOR>` (`28/<MES_ANTERIOR>`, `"USD 10,00"`) y `<MES_HACE_2>` (`28/<MES_HACE_2>`, `"USD 10,00"`) |

**Post-condición:** En `public.transactions` existen 2 filas con `subscription_id = <SUB_ID>` y `subscription_period` en `{<MES_HACE_2>-01, <MES_ANTERIOR>-01}`, cada una con `type = 'expense'`, `installments_count = 1`, `amount = 10.00`, `currency = 'USD'`, `fx_rate = 1200.00`, `amount_ars = 12000.00` y 1 fila en `public.ledger_entries` con `amount = 10.00` y `amount_ars = 12000.00` (`I1`, `I1'`, `I2`, `I5`, `I11`, `I14`, `I17`). El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-025 — Dos llamadas consecutivas por API a `run_subscription_catchup` responden `200 OK` sin error y dejan exactamente 1 transacción por período

| Campo | Contenido |
|---|---|
| Historia · criterio | US-53 · CA-1, CA-2, CA-3 · FR-16 · R1, R2 · ADR-017, ADR-030 |
| Invariante | I1, I2, I11, I14, I16, I17 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción en `USD` sin tipos de cambio cargados aún ejecutando con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Spotify USD","p_amount":"10.00","p_currency":"USD","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_start_period":"<MES_HACE_2>-01","p_end_period":null,"p_description":null}` (`"generated": 0`), guardando `subscription_id` como `<SUB_ID>`. S 5: se cargaron los tipos de cambio de `<MES_HACE_2>` y `<MES_ANTERIOR>` ejecutando con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/upsert_fx_rate` con `{"p_period":"<MES_HACE_2>-01","p_ars_per_usd":"1200.00"}` y `{"p_period":"<MES_ANTERIOR>-01","p_ars_per_usd":"1200.00"}`.

**Datos de prueba:** D 1: Email `qa+cp-sus-025-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Endpoint `POST <SUPABASE_URL>/rest/v1/rpc/run_subscription_catchup` con body `{}`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/run_subscription_catchup` con body `{}` (primera llamada) | Respuesta HTTP `200 OK` con body `{"generated": 2, "failed": []}` |
| 2 | Ejecutar inmediatamente con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/run_subscription_catchup` con body `{}` (segunda llamada consecutiva) | Respuesta HTTP `200 OK` con body `{"generated": 0, "failed": []}` (sin error `23505`) |
| 3 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/transactions?subscription_id=eq.<SUB_ID>&select=id,subscription_period,amount_text:amount::text,installments_count,type&order=subscription_period.asc` | Respuesta HTTP `200 OK` con exactamente 2 filas: `subscription_period = "<MES_HACE_2>-01"` y `subscription_period = "<MES_ANTERIOR>-01"`, ambas con `"amount_text": "10.00"`, `"installments_count": 1` y `"type": "expense"` |

**Post-condición:** En `public.transactions` existen exactamente 2 filas para `<SUB_ID>` (cero duplicados, `I11`, `I14`, `I16`, `I17`). El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-026 — Suscripción en estado `paused` no genera ocurrencias al ejecutar `run_subscription_catchup`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-53 · CA-7 · US-56 · CA-5 · FR-16, FR-17 · R3 · ADR-030 |
| Invariante | I15 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 3: se creó una suscripción en `USD` desde `<MES_ANTERIOR>` sin tipo de cambio cargado (`POST /rest/v1/rpc/create_subscription` con `"p_currency":"USD"`, `"p_start_period":"<MES_ANTERIOR>-01"`, `"p_billing_day":28`, `"generated": 0`), se la pausó con `POST <SUPABASE_URL>/rest/v1/rpc/pause_subscription` (`{"p_subscription_id":"<SUB_ID>"}`) y luego se cargó el tipo de cambio de `<MES_ANTERIOR>-01` con `POST <SUPABASE_URL>/rest/v1/rpc/upsert_fx_rate` (`{"p_period":"<MES_ANTERIOR>-01","p_ars_per_usd":"1200.00"}`).

**Datos de prueba:** D 1: Email `qa+cp-sus-026-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Endpoint `POST <SUPABASE_URL>/rest/v1/rpc/run_subscription_catchup` con body `{}`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/run_subscription_catchup` con body `{}` | Respuesta HTTP `200 OK` con body `{"generated": 0, "failed": []}` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/transactions?subscription_id=eq.<SUB_ID>&select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.transactions` existen 0 filas para `<SUB_ID>` (`R3`). El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-027 — Suscripción con día de cobro `31` entre `2026-01` y `2026-04` genera ocurrencias con fechas `31/01/2026`, `28/02/2026`, `31/03/2026` y `30/04/2026`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-54 · CA-1, CA-4, CA-5 · US-55 · CA-6 · US-75 · CA-5 · FR-16 · R4 · ADR-017 |
| Invariante | I11, I13, I14 |
| Técnica · Tipo | Análisis de valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y los meses `2026-01` a `2026-04` (año no bisiesto) están en el pasado dentro de la ventana `[-24 meses, +12 meses]` respecto de `<MES_ACTUAL>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-027-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Adobe CC"`. D 4: Monto `"12000"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"31"`. D 8: Mes de inicio `"2026-01"`. D 9: Mes de fin `"2026-04"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-027-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-027-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en `"Nueva"` (`subscriptions-new`) | Se abre `/subscriptions/new` |
| 8 | Escribir `Adobe CC` en `"Nombre"` (`subscription-form-name`) | El campo muestra `Adobe CC` |
| 9 | Escribir `12000` en `"Monto"` (`subscription-form-amount`) | El campo muestra `12000` |
| 10 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 11 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 12 | Escribir `31` en `"Día de cobro"` (`subscription-form-billing-day`) | El campo muestra `31` |
| 13 | Ingresar `2026-01` en `"Mes de inicio"` (`subscription-form-start-period`) | `"Mes de inicio"` muestra `2026-01` |
| 14 | Ingresar `2026-04` en `"Mes de fin (opcional)"` (`subscription-form-end-period`) | En `"Se cargan al guardar"` (`subscription-form-preview-due`) aparecen las 4 filas con fechas `"enero 2026 · 31/01/2026"`, `"febrero 2026 · 28/02/2026"`, `"marzo 2026 · 31/03/2026"` y `"abril 2026 · 30/04/2026"` |
| 15 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada. Se cargaron 4 gastos vencidos."` (`subscription-toast`) y en `"Gastos cargados"` (`subscription-detail-occurrences`) las 4 ocurrencias muestran las fechas `30/04/2026` (`data-period="2026-04"`), `31/03/2026` (`data-period="2026-03"`), `28/02/2026` (`data-period="2026-02"`) y `31/01/2026` (`data-period="2026-01"`) |

**Post-condición:** En `public.subscriptions`, `billing_day = 31` (`I13`); en `public.transactions` existen 4 filas con `(subscription_period, occurred_on)` iguales a `('2026-01-01','2026-01-31')`, `('2026-02-01','2026-02-28')`, `('2026-03-01','2026-03-31')` y `('2026-04-01','2026-04-30')` (`R4`). El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-028 — Suscripción con día de cobro `<DIA_MAÑANA>` no genera la ocurrencia del mes corriente

| Campo | Contenido |
|---|---|
| Historia · criterio | US-55 · CA-1 · US-53 · CA-13 · FR-16 · R5 · ADR-021 |
| Invariante | I11, I17 |
| Técnica · Tipo | Análisis de valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27` (de modo que `<DIA_MAÑANA> = <DIA_HOY> + 1 <= 28`). S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-028-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Mañana TV"`. D 4: Monto `"5000"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"<DIA_MAÑANA>"` (ej. `"7"` si `<HOY> = 06/10/2026`). D 8: Mes de inicio `"<MES_ANTERIOR>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-028-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-028-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en `"Nueva"` (`subscriptions-new`) | Se abre `/subscriptions/new` |
| 8 | Escribir `Mañana TV` en `"Nombre"` (`subscription-form-name`) | El campo muestra `Mañana TV` |
| 9 | Escribir `5000` en `"Monto"` (`subscription-form-amount`) | El campo muestra `5000` |
| 10 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 11 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 12 | Escribir `<DIA_MAÑANA>` en `"Día de cobro"` (`subscription-form-billing-day`) | El campo muestra `<DIA_MAÑANA>` |
| 13 | Ingresar `<MES_ANTERIOR>` en `"Mes de inicio"` (`subscription-form-start-period`) | En `subscription-form-preview-due` aparece únicamente `<MES_ANTERIOR>` y `subscription-form-preview-summary` muestra `"Al guardar se carga 1 gasto de $5.000,00."` |
| 14 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada. Se cargó 1 gasto vencido."` (`subscription-toast`), `"Próximo cobro"` (`subscription-detail-next-charge`) muestra la fecha de mañana en `<MES_ACTUAL>` y en `"Gastos cargados"` (`subscription-detail-occurrences`) figura únicamente `<MES_ANTERIOR>` (1 fila) |

**Post-condición:** En `public.transactions` existe 1 sola fila para `"Mañana TV"` (`subscription_period = '<MES_ANTERIOR>-01'`). El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-029 — Suscripción con día de cobro igual a `<DIA_HOY>` genera la ocurrencia del mes corriente

| Campo | Contenido |
|---|---|
| Historia · criterio | US-55 · CA-2 · US-53 · CA-13 · FR-16 · R5 · ADR-021 |
| Invariante | I11, I17 |
| Técnica · Tipo | Análisis de valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-029-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Hoy TV"`. D 4: Monto `"5000"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"<DIA_HOY>"` (ej. `"6"` si `<HOY> = 06/10/2026`). D 8: Mes de inicio `"<MES_ANTERIOR>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-029-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-029-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en `"Nueva"` (`subscriptions-new`) | Se abre `/subscriptions/new` |
| 8 | Escribir `Hoy TV` en `"Nombre"` (`subscription-form-name`) | El campo muestra `Hoy TV` |
| 9 | Escribir `5000` en `"Monto"` (`subscription-form-amount`) | El campo muestra `5000` |
| 10 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 11 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 12 | Escribir `<DIA_HOY>` en `"Día de cobro"` (`subscription-form-billing-day`) | El campo muestra `<DIA_HOY>` |
| 13 | Ingresar `<MES_ANTERIOR>` en `"Mes de inicio"` (`subscription-form-start-period`) | En `subscription-form-preview-due` aparecen `<MES_ANTERIOR>` y `<MES_ACTUAL>` y `subscription-form-preview-summary` muestra `"Al guardar se cargan 2 gastos de $5.000,00 (total $10.000,00)."` |
| 14 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada. Se cargaron 2 gastos vencidos."` (`subscription-toast`) y en `"Gastos cargados"` (`subscription-detail-occurrences`) aparecen `<MES_ACTUAL>` (con fecha `<HOY>`) y `<MES_ANTERIOR>` |

**Post-condición:** En `public.transactions` existen 2 filas para `"Hoy TV"` (`subscription_period` en `{<MES_ANTERIOR>-01, <MES_ACTUAL>-01}`, esta última con `occurred_on = '<HOY_ISO>'`). El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-030 — Pausar suscripción activa con día de cobro `28` (`> <DIA_HOY>`) muestra advertencia de este mes y pasa a `"Pausada desde <HOY>"` con piso en `<MES_SIGUIENTE>`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-56 · CA-1, CA-2, CA-3, CA-5, CA-11 · FR-17 · R3, R8 · ADR-030 |
| Invariante | I12, I15 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción ejecutando con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_start_period":"<MES_ANTERIOR>-01","p_end_period":null,"p_description":null}` (`"generated": 1`, ocurrencia de `<MES_ANTERIOR>` creada), guardando `subscription_id` como `<SUB_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-030-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Suscripción `"Netflix"` activa con día `28` y 1 ocurrencia en `<MES_ANTERIOR>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-030-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-030-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en la fila `"Netflix"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) | Se abre `/subscriptions/<SUB_ID>` |
| 8 | Hacer click en el botón `"Pausar"` (`subscription-detail-pause`) | Se abre el diálogo `pause-subscription-dialog` con el título `"¿Pausar Netflix?"`, el texto `"Mientras esté pausada no se cargan gastos."` seguido de `"Este mes tampoco se cobra si todavía no llegó el día 28, aunque la reanudes antes."` y los botones `"Cancelar"` (`pause-subscription-dialog-cancel`) y `"Pausar"` (`pause-subscription-dialog-confirm`) |
| 9 | Hacer click en el botón `"Pausar"` (`pause-subscription-dialog-confirm`) | Se cierra el diálogo, aparece el aviso `"Suscripción pausada"` (`subscription-toast`), el estado (`subscription-detail-status`) cambia a `"Pausada desde <HOY>"` (con `data-status="paused"`), `"Próximo cobro"` (`subscription-detail-next-charge`) muestra `"—"`, `"Pausar"` se reemplaza por `"Reanudar"` (`subscription-detail-resume`) y `"Gastos cargados"` conserva intacta la ocurrencia de `<MES_ANTERIOR>` por `"$5.000,00"` |
| 10 | Hacer click en el botón atrás (`subscription-detail-back`) | Navega a `/subscriptions`; `"Netflix"` aparece bajo el grupo `"Pausadas"` (`subscriptions-item` con `data-status="paused"`) |

**Post-condición:** En `public.subscriptions`, `status = 'paused'`, `paused_at IS NOT NULL` y `generate_from_period = '<MES_SIGUIENTE>-01'` (`I12`, `I15`, `R8`); la transacción de `<MES_ANTERIOR>-01` no cambió. El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-031 — `pause_subscription` por API ejecuta primero la puesta al día y genera los meses vencidos pendientes antes de pausar

| Campo | Contenido |
|---|---|
| Historia · criterio | US-56 · CA-4 · FR-17 · R1, R8 · ADR-030 |
| Invariante | I11, I12, I14, I15, I17 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción en `USD` desde `<MES_HACE_2>` sin tipos de cambio aún (`POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix USD","p_amount":"10.00","p_currency":"USD","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_start_period":"<MES_HACE_2>-01","p_end_period":null,"p_description":null}`, `"generated": 0`), guardando `subscription_id` como `<SUB_ID>`. S 5: se cargaron los tipos de cambio de `<MES_HACE_2>` y `<MES_ANTERIOR>` ejecutando con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/upsert_fx_rate` con `{"p_period":"<MES_HACE_2>-01","p_ars_per_usd":"1200.00"}` y `{"p_period":"<MES_ANTERIOR>-01","p_ars_per_usd":"1200.00"}`.

**Datos de prueba:** D 1: Email `qa+cp-sus-031-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Endpoint `POST <SUPABASE_URL>/rest/v1/rpc/pause_subscription` con body `{"p_subscription_id":"<SUB_ID>"}`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/pause_subscription` con body `{"p_subscription_id":"<SUB_ID>"}` | Respuesta HTTP `200 OK` con body `{"generated_before": 2}` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/transactions?subscription_id=eq.<SUB_ID>&select=subscription_period&order=subscription_period.asc` | Respuesta HTTP `200 OK` con 2 filas (`"subscription_period": "<MES_HACE_2>-01"` y `"subscription_period": "<MES_ANTERIOR>-01"`) |
| 3 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?id=eq.<SUB_ID>&select=status,paused_at,generate_from_period` | Respuesta HTTP `200 OK` con `"status": "paused"`, `"paused_at"` no nulo y `"generate_from_period": "<MES_SIGUIENTE>-01"` |

**Post-condición:** Los 2 períodos vencidos quedaron generados antes de pasar a `paused` (`I12`, `I15`). El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-032 — Rechazar en API `pause_subscription` usando la sesión de otro usuario (`404 PT404`)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-56 · CA-9 · FR-17 · C7 · ADR-030 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: con PR-05 se crearon Usuario A (`D 1`, `<ACCESS_TOKEN_A>`) y Usuario B (`D 2`, `<ACCESS_TOKEN_B>`, `<ACCOUNT_ID_B>`, `<CATEGORY_ID_B>`). S 2: con PR-04 usando `<ACCESS_TOKEN_B>` se creó una suscripción `<SUB_ID_B>` (`POST /rest/v1/rpc/create_subscription`).

**Datos de prueba:** D 1: Email A `qa+cp-sus-032-001@example.com` / Contraseña `Clave123!`. D 2: Email B `qa+cp-sus-032-002@example.com` / Contraseña `Clave123!`. D 3: `p_subscription_id = "<SUB_ID_B>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 usando `<ACCESS_TOKEN_A>` `POST <SUPABASE_URL>/rest/v1/rpc/pause_subscription` con body `{"p_subscription_id":"<SUB_ID_B>"}` | Respuesta HTTP `404 Not Found` con `"code": "PT404"` y `"message": "Suscripción no encontrada"`. *Cambiado en V3 (DEF-034): antes respondía HTTP 500 con P0002.* |
| 2 | Ejecutar con PR-08 usando `<ACCESS_TOKEN_B>` `GET <SUPABASE_URL>/rest/v1/subscriptions?id=eq.<SUB_ID_B>&select=status,paused_at` | Respuesta HTTP `200 OK` con `[{"status":"active","paused_at":null}]` |

**Post-condición:** La suscripción `<SUB_ID_B>` de Usuario B permanece activa. Los usuarios A y B quedan como datos de prueba (emails únicos, sin limpieza).

---

#### CP-SUS-033 — Reanudar suscripción pausada abre `resume-subscription-dialog`, pasa a `"Activa"`, limpia `paused_at`, conserva `generate_from_period = '<MES_SIGUIENTE>-01'` y no genera el mes actual

| Campo | Contenido |
|---|---|
| Historia · criterio | US-57 · CA-1, CA-2, CA-4, CA-5 · US-56 · CA-3 · FR-17 · R8 · ADR-030 |
| Invariante | I12, I15, I17 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción con 1 ocurrencia en `<MES_ANTERIOR>` y el mes corriente aún no cobrado (`POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_start_period":"<MES_ANTERIOR>-01","p_end_period":null,"p_description":null}`, `"generated": 1`) y luego se la pausó con `POST <SUPABASE_URL>/rest/v1/rpc/pause_subscription` (`{"p_subscription_id":"<SUB_ID>"}`), lo que dejó `status = 'paused'` y `generate_from_period = '<MES_SIGUIENTE>-01'`.

**Datos de prueba:** D 1: Email `qa+cp-sus-033-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Suscripción `"Netflix"` pausada con `generate_from_period = '<MES_SIGUIENTE>-01'` y 1 ocurrencia en `<MES_ANTERIOR>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-033-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-033-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en la fila `"Netflix"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) | Se abre `/subscriptions/<SUB_ID>`; `"Gastos cargados"` muestra 1 sola fila (`<MES_ANTERIOR>`) |
| 8 | Hacer click en el botón `"Reanudar"` (`subscription-detail-resume`) | Se abre el diálogo `resume-subscription-dialog` con el título `"¿Reanudar Netflix?"`, el texto `"No se cargan los meses en los que estuvo pausada."` seguido de `"Próximo cobro: 28/<MES_SIGUIENTE>."` y los botones `"Cancelar"` (`resume-subscription-dialog-cancel`) y `"Reanudar"` (`resume-subscription-dialog-confirm`) |
| 9 | Hacer click en el botón `"Reanudar"` (`resume-subscription-dialog-confirm`) | El diálogo se cierra, muestra el aviso `"Suscripción reanudada"` (`subscription-toast`), el estado (`subscription-detail-status`) cambia a `"Activa"` (`data-status="active"`), `"Próximo cobro"` (`subscription-detail-next-charge`) muestra `"28/<MES_SIGUIENTE>"` (coincidiendo con el diálogo), `"Reanudar"` se reemplaza por `"Pausar"` (`subscription-detail-pause`) y `"Gastos cargados"` conserva únicamente la ocurrencia de `<MES_ANTERIOR>` |
| 10 | Hacer click en el botón atrás (`subscription-detail-back`) | Navega a `/subscriptions`; `"Netflix"` aparece bajo el grupo `"Activas"` (`subscriptions-item` con `data-status="active"`) |

**Post-condición:** En `public.subscriptions`, `status = 'active'`, `paused_at IS NULL` y `generate_from_period = '<MES_SIGUIENTE>-01'` (`max('<MES_SIGUIENTE>-01', '<MES_ANTERIOR>-01', '<MES_ACTUAL>-01') = '<MES_SIGUIENTE>-01'`, `I12`, `I15`, `R8`). El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-034 — Cancelar suscripción activa con 4 gastos cargados mantiene el historial en el Detalle y en el Resumen y oculta los botones de acción

| Campo | Contenido |
|---|---|
| Historia · criterio | US-58 · CA-1, CA-2, CA-3, CA-5, CA-6 · FR-17 · C5, C10 · ADR-030 |
| Invariante | I1, I2, I10, I15 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción con 4 períodos vencidos (`<MES_HACE_4>` a `<MES_ANTERIOR>`): `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_start_period":"<MES_HACE_4>-01","p_end_period":null,"p_description":null}` (`"generated": 4`), guardando `subscription_id` como `<SUB_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-034-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Suscripción `"Netflix"` (`$5.000,00` ARS) con 4 gastos cargados (`<MES_HACE_4>`, `<MES_HACE_3>`, `<MES_HACE_2>` y `<MES_ANTERIOR>`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-034-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-034-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en la fila `"Netflix"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) | Se abre `/subscriptions/<SUB_ID>` |
| 8 | Hacer click en el botón `"Cancelar suscripción"` (`subscription-detail-cancel`) | Se abre el diálogo `cancel-subscription-dialog` con el título `"¿Cancelar Netflix?"`, el texto `"No se van a cargar más gastos. Los 4 gastos ya cargados se mantienen. No se puede deshacer: para volver a registrarla, creá una suscripción nueva."` y los botones `"Volver"` (`cancel-subscription-dialog-cancel`) y `"Cancelar suscripción"` (`cancel-subscription-dialog-confirm`) |
| 9 | Hacer click en el botón `"Cancelar suscripción"` (`cancel-subscription-dialog-confirm`) | El diálogo se cierra, muestra el aviso `"Suscripción cancelada"` (`subscription-toast`), el estado (`subscription-detail-status`) cambia a `"Cancelada el <HOY>"` (`data-status="cancelled"`), `"Próximo cobro"` (`subscription-detail-next-charge`) muestra `"—"`, desaparecen los botones `"Editar"`, `"Pausar"`, `"Reanudar"` y `"Cancelar suscripción"`, y `"Gastos cargados"` (`subscription-detail-occurrences`) conserva las 4 filas |
| 10 | Hacer click en el botón atrás (`subscription-detail-back`) | Navega a `/subscriptions`; `"Netflix"` aparece bajo el grupo `"Canceladas"` (`subscriptions-item` con `data-status="cancelled"`) |
| 11 | Hacer click en `"Resumen"` (`subscriptions-nav-dashboard`) | Se abre `/dashboard` |
| 12 | Seleccionar `<MES_ANTERIOR>` en el selector de período (`dashboard-period-select`) | La tarjeta `"Gastado en <mes corto anterior>"` (`dashboard-total-expenses`, ej. `"Gastado en septiembre"`) muestra `"$5.000,00"` |

**Post-condición:** En `public.subscriptions`, `status = 'cancelled'` y `cancelled_at IS NOT NULL` (`I15`); las 4 filas de `public.transactions` siguen activas (`deleted_at IS NULL`). El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-035 — Editar el monto de una suscripción activa de `$5.000,00` a `$7.000,00` conserva las 4 ocurrencias ya generadas en `$5.000,00` y muestra Moneda y Mes de inicio como solo lectura

| Campo | Contenido |
|---|---|
| Historia · criterio | US-59 · CA-1, CA-5, CA-7 · FR-17 · R7 · C5 · ADR-030, ADR-032 |
| Invariante | I1, I2, I4, I11, I14 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción con 4 períodos vencidos (`<MES_HACE_4>` a `<MES_ANTERIOR>`): `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_start_period":"<MES_HACE_4>-01","p_end_period":null,"p_description":null}` (`"generated": 4`), guardando `subscription_id` como `<SUB_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-035-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Suscripción `"Netflix"` con monto original `"5000.00"` y 4 ocurrencias generadas. D 4: Nuevo monto `"7000"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-035-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-035-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en la fila `"Netflix"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) | Se abre `/subscriptions/<SUB_ID>` |
| 8 | Hacer click en el botón `"Editar"` (`subscription-detail-edit`) | Se abre `/subscriptions/<SUB_ID>/edit` mostrando el aviso fijo `"Los cambios aplican desde el próximo cobro. Los gastos ya cargados no cambian."`, y `"Moneda"` (`subscription-form-currency-readonly`) y `"Mes de inicio"` (`subscription-form-start-period-readonly`) como texto de solo lectura |
| 9 | Reemplazar `5000` por `7000` en `"Monto"` (`subscription-form-amount`) | El campo `"Monto"` muestra `7000` y `"Próximo cobro"` (`subscription-form-next-charge`) muestra `"Próximo cobro: 28/<MES_ACTUAL> por $7.000,00"` |
| 10 | Hacer click en `"Guardar cambios"` (`subscription-form-submit`) | Navega a `/subscriptions/<SUB_ID>`, muestra el aviso `"Cambios guardados"` (`subscription-toast`), en `"Datos"` la fila `"Monto"` muestra `"$7.000,00"` y en `"Gastos cargados"` (`subscription-detail-occurrences`) las 4 filas existentes (`<MES_ANTERIOR>`, `<MES_HACE_2>`, `<MES_HACE_3>` y `<MES_HACE_4>`) siguen mostrando `"$5.000,00"` |

**Post-condición:** En `public.subscriptions`, `amount = 7000.00`; las 4 filas de `public.transactions` y sus filas en `public.ledger_entries` conservan `amount = 5000.00` y `amount_ars = 5000.00` (`I1`, `I2`, `R7`). El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-036 — Rechazar en API `update_subscription` con `p_end_period` anterior al período corriente (`<MES_ANTERIOR>-01`)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-59 · CA-6 · FR-17 · C6 · ADR-030, ADR-032 |
| Invariante | I12 |
| Técnica · Tipo | Análisis de valores límite · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 3: se creó una suscripción `<SUB_ID>` desde `<MES_HACE_2>-01` con `p_end_period: null`.

**Datos de prueba:** D 1: Email `qa+cp-sus-036-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_end_period = "<MES_ANTERIOR>-01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/update_subscription` con body `{"p_subscription_id":"<SUB_ID>","p_name":"Netflix","p_amount":"5000.00","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_end_period":"<MES_ANTERIOR>-01","p_description":null}` | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "El mes de fin no puede ser anterior a <mes actual>"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?id=eq.<SUB_ID>&select=end_period` | Respuesta HTTP `200 OK` con `[{"end_period":null}]` |

**Post-condición:** En `public.subscriptions`, `<SUB_ID>` conserva `end_period IS NULL`. El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-037 — Rechazar en UI renombrar una suscripción poniéndole el nombre de otra suscripción activa del mismo usuario

| Campo | Contenido |
|---|---|
| Historia · criterio | US-59 · CA-7 · US-52 · CA-7 · FR-17 · C6 · ADR-032 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se crearon dos suscripciones activas con `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription`: `"Spotify"` (`<SUB_SPOTIFY>`) y `"Netflix"` (`<SUB_NETFLIX>`).

**Datos de prueba:** D 1: Email `qa+cp-sus-037-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre duplicado `"Spotify"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-037-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-037-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en la fila `"Netflix"` (`subscriptions-item` con `data-subscription-id="<SUB_NETFLIX>"`) | Se abre `/subscriptions/<SUB_NETFLIX>` |
| 8 | Hacer click en `"Editar"` (`subscription-detail-edit`) | Se abre `/subscriptions/<SUB_NETFLIX>/edit` |
| 9 | Reemplazar `Netflix` por `Spotify` en `"Nombre"` (`subscription-form-name`) | El campo `"Nombre"` muestra `Spotify` |
| 10 | Hacer click en `"Guardar cambios"` (`subscription-form-submit`) | La URL sigue siendo `/subscriptions/<SUB_NETFLIX>/edit` y debajo de `"Nombre"` aparece `"Ya tenés una suscripción con ese nombre"` |

**Post-condición:** En `public.subscriptions`, `<SUB_NETFLIX>` conserva `name = 'Netflix'`. El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-038 — Rechazar en UI editar una suscripción cancelada al navegar directo a `/subscriptions/<SUB_ID>/edit`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-59 · CA-8 · US-58 · CA-6 · FR-17 |
| Invariante | I15 |
| Técnica · Tipo | Transición de estados · Negativo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó y canceló una suscripción `<SUB_ID>` (`POST /rest/v1/rpc/create_subscription` y luego `POST /rest/v1/rpc/cancel_subscription`).

**Datos de prueba:** D 1: Email `qa+cp-sus-038-001@example.com`. D 2: Contraseña `Clave123!`. D 3: URL `<APP>/subscriptions/<SUB_ID>/edit`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-038-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-038-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/<SUB_ID>/edit` | No se muestra el formulario editable; se muestra el texto `"Esta suscripción está cancelada y no se puede editar."` y el enlace `"Volver"` (`subscription-form-cancelled-back`) que apunta a `/subscriptions/<SUB_ID>` |

**Post-condición:** La suscripción `<SUB_ID>` sigue en `status = 'cancelled'`. El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-039 — Rechazar en API cambiar `p_category_id` en `update_subscription` a otra categoría archivada distinta de la actual

| Campo | Contenido |
|---|---|
| Historia · criterio | US-59 · CA-10 · FR-17 · C6 · ADR-030, ADR-032 |
| Invariante | I8 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>`, `<CAT_ENTRETENIMIENTO>` y `<CAT_SALUD>`. S 3: se creó una suscripción `<SUB_ID>` con `p_category_id: "<CAT_ENTRETENIMIENTO>"`. S 4: se archivó `<CAT_SALUD>` ejecutando con PR-04 `PATCH <SUPABASE_URL>/rest/v1/categories?id=eq.<CAT_SALUD>` con body `{"archived_at":"2026-01-01T00:00:00Z"}`.

**Datos de prueba:** D 1: Email `qa+cp-sus-039-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_category_id = "<CAT_SALUD>"` (archivada, distinta de la actual).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/update_subscription` con body `{"p_subscription_id":"<SUB_ID>","p_name":"Netflix","p_amount":"5000.00","p_category_id":"<CAT_SALUD>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_end_period":null,"p_description":null}` | Respuesta HTTP `409 Conflict` con `"code": "23503"` y `"message": "La categoría no está disponible"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?id=eq.<SUB_ID>&select=category_id` | Respuesta HTTP `200 OK` con `[{"category_id":"<CAT_ENTRETENIMIENTO>"}]` |

**Post-condición:** En `public.subscriptions`, `<SUB_ID>` conserva `category_id = <CAT_ENTRETENIMIENTO>`. El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-040 — Eliminar desde Movimientos la ocurrencia de `<MES_ANTERIOR>` muestra `delete-transaction-subscription-note`, figura con `"Eliminado"` en el Detalle y no vuelve a crearse al recargar

| Campo | Contenido |
|---|---|
| Historia · criterio | US-60 · CA-1, CA-3, CA-5 · FR-08 · R2 · C10 · ADR-017 |
| Invariante | I10, I11 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción con 2 ocurrencias (`<MES_HACE_2>` y `<MES_ANTERIOR>`): `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_start_period":"<MES_HACE_2>-01","p_end_period":null,"p_description":null}` (`"generated": 2`), guardando `subscription_id` como `<SUB_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-040-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Ocurrencia de `<MES_ANTERIOR>` de la suscripción `"Netflix"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-040-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-040-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Movimientos"` (`register-nav-transactions`) | Se abre `/transactions` |
| 7 | Seleccionar `<MES_ANTERIOR>` en el selector de período (`transactions-period-select`) | Se muestra la fila del gasto `"Netflix"` por `"$5.000,00"` (`transactions-item`) |
| 8 | Hacer click en el botón de eliminar (`transactions-item-delete`) de la fila `"Netflix"` | Se abre `delete-transaction-dialog` mostrando `delete-transaction-subscription-note` con el texto `"Este gasto lo cargó la suscripción Netflix. Si lo eliminás, no se vuelve a cargar para <mes anterior>."` (ej. `"Este gasto lo cargó la suscripción Netflix. Si lo eliminás, no se vuelve a cargar para septiembre 2026."`) |
| 9 | Hacer click en `"Eliminar"` (`delete-transaction-confirm`) | El diálogo se cierra y la fila desaparece del listado `"Activos"` de `<MES_ANTERIOR>` |
| 10 | Hacer click en `"Suscripciones"` (`transactions-nav-subscriptions`) | Se abre `/subscriptions` |
| 11 | Hacer click en la fila `"Netflix"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) | Se abre `/subscriptions/<SUB_ID>`; en `"Gastos cargados"` (`subscription-detail-occurrences`) la fila `subscription-detail-occurrence` con `data-period="<MES_ANTERIOR>"` tiene `data-deleted="true"` y muestra la marca `"Eliminado"` (`subscription-detail-occurrence-deleted`) |
| 12 | Recargar la página del navegador (`F5`) en `/subscriptions/<SUB_ID>` | La puesta al día corre al recargar sin crear una nueva transacción para `<MES_ANTERIOR>`; no aparece `app-catchup-generated` y la fila `subscription-detail-occurrence` con `data-period="<MES_ANTERIOR>"` sigue con `data-deleted="true"` y `"Eliminado"` |

**Post-condición:** En `public.transactions` sigue existiendo 1 sola fila con `subscription_id = <SUB_ID>` y `subscription_period = '<MES_ANTERIOR>-01'`, con `deleted_at IS NOT NULL` (`I10`, `I11`, `R2`). El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-041 — Mostrar la marca de suscripción en Movimientos y en `"Últimos movimientos"` del Resumen (y no en un gasto manual) y navegar al Detalle al tocarla

| Campo | Contenido |
|---|---|
| Historia · criterio | US-61 · CA-1, CA-2 · FR-16 · ADR-017 |
| Invariante | I11, I14 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó un gasto manual en `<MES_ANTERIOR>` ejecutando con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con body `{"p_type":"expense","p_amount":"1500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_installments_count":1,"p_occurred_on":"<MES_ANTERIOR>-10","p_description":"Kiosco"}`. S 5: se creó una suscripción `"Netflix"` con 1 ocurrencia en `<MES_ANTERIOR>` (`POST /rest/v1/rpc/create_subscription` con `"p_start_period":"<MES_ANTERIOR>-01"`, `"p_billing_day":28`, `"generated": 1`), guardando `subscription_id` como `<SUB_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-041-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Gasto de suscripción `"Netflix"` (`subscription_id = <SUB_ID>`) y gasto manual `"Kiosco"` (`subscription_id = null`) en `<MES_ANTERIOR>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-041-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-041-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Resumen"` (`register-nav-dashboard`) | Se abre `/dashboard` |
| 7 | Seleccionar `<MES_ANTERIOR>` en el selector de período (`dashboard-period-select`) | En `"Últimos movimientos"`, la fila de `"Netflix"` muestra la marca `dashboard-transaction-item-subscription` con el nombre `"Netflix"` y la fila de `"Kiosco"` no tiene `dashboard-transaction-item-subscription` |
| 8 | Hacer click en `"Movimientos"` (`dashboard-nav-transactions`) | Se abre `/transactions` |
| 9 | Seleccionar `<MES_ANTERIOR>` en el selector de período (`transactions-period-select`) | La fila de `"Netflix"` muestra la marca `transactions-item-subscription` con el nombre `"Netflix"` y la fila de `"Kiosco"` no tiene `transactions-item-subscription` |
| 10 | Hacer click en la marca `transactions-item-subscription` (`"Netflix"`) | Navega a `/subscriptions/<SUB_ID>` mostrando el Detalle de `"Netflix"` |

**Post-condición:** No se modifican filas. El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-042 — La ocurrencia generada de una suscripción suma en `"Gastado en <mes corto>"` y resta en `"Balance"` del Resumen de V1

| Campo | Contenido |
|---|---|
| Historia · criterio | US-61 · CA-1 · US-53 · CA-1 · FR-16 · R7 · ADR-017 |
| Invariante | I1, I1', I2, I14 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción `"Netflix"` de `$5.000,00` ARS con ocurrencia en `<MES_ANTERIOR>` (`POST /rest/v1/rpc/create_subscription` con `"p_start_period":"<MES_ANTERIOR>-01"`, `"p_billing_day":28`, `"generated": 1`).

**Datos de prueba:** D 1: Email `qa+cp-sus-042-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Ocurrencia de `"Netflix"` en `<MES_ANTERIOR>` por `$5.000,00` ARS.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-042-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-042-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Resumen"` (`register-nav-dashboard`) | Se abre `/dashboard` |
| 7 | Seleccionar `<MES_ANTERIOR>` en el selector de período (`dashboard-period-select`) | En `/dashboard`, la tarjeta `"Gastado en <mes corto anterior>"` (`dashboard-total-expenses`) muestra `"$5.000,00"` y la tarjeta `"Balance"` (`dashboard-total-balance`) muestra `"-$5.000,00"` |

**Post-condición:** En `public.ledger_entries`, la ocurrencia tiene su fila de imputación (`installment_number = 1`, `period = '<MES_ANTERIOR>-01'`, `amount = 5000.00`, `amount_ars = 5000.00`) que alimenta el Resumen (`I1`, `I1'`, `I2`, `I14`). El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-043 — Suscripción activa en USD con tipo de cambio en `<MES_HACE_2>` y sin tipo de cambio en `<MES_ANTERIOR>` genera solo `<MES_HACE_2>`, muestra `"Falta tipo de cambio"` y el botón `"Cargar tipo de cambio"` navega a `/settings?period=<MES_ANTERIOR>`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-62 · CA-1, CA-2, CA-7 · FR-15 · R6 · C5 · ADR-002, ADR-031 |
| Invariante | I5, I11, I14 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se cargó únicamente el tipo de cambio de `<MES_HACE_2>-01` (`"1200.00"`) dejando `<MES_ANTERIOR>` sin tipo de cambio: se ejecutó con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/upsert_fx_rate` con body `{"p_period":"<MES_HACE_2>-01","p_ars_per_usd":"1200.00"}`. S 5: se creó una suscripción en `USD` desde `<MES_HACE_2>` con día `28`: `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"ChatGPT Plus","p_amount":"20.00","p_currency":"USD","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_start_period":"<MES_HACE_2>-01","p_end_period":null,"p_description":null}` (`"generated": 1`), guardando `subscription_id` como `<SUB_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-043-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Suscripción `"ChatGPT Plus"` (`USD 20,00`), `<MES_HACE_2>` con `fx_rate = 1200.00` y `<MES_ANTERIOR>` sin `fx_rate`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-043-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-043-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions`; en la fila `"ChatGPT Plus"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) se muestra la marca `"Falta tipo de cambio"` (`subscriptions-item-blocked`) |
| 7 | Hacer click en la fila `"ChatGPT Plus"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) | Se abre `/subscriptions/<SUB_ID>`; se muestra el aviso `subscription-detail-blocked` con el texto `"Falta el tipo de cambio de <mes anterior>. Ese mes no se cargó; se carga en cuanto lo cargues."` y el botón `"Cargar tipo de cambio"` (`subscription-detail-blocked-fx`), y en `"Gastos cargados"` (`subscription-detail-occurrences`) figura únicamente la ocurrencia de `<MES_HACE_2>` |
| 8 | Hacer click en el botón `"Cargar tipo de cambio"` (`subscription-detail-blocked-fx`) | Navega a `/settings?period=<MES_ANTERIOR>` con el campo `"Mes"` (`settings-fx-period`) preseleccionado en `<MES_ANTERIOR>` |

**Post-condición:** En `public.transactions` existe 1 sola fila para `<SUB_ID>` (`subscription_period = '<MES_HACE_2>-01'`, `fx_rate = 1200.00`, `I5`, `R6`). El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-044 — Con dos suscripciones activas en ARS (`$5.000,00` y `$2.500,00`), el total mensual comprometido muestra `"$7.500,00"` y `"2 suscripciones activas este mes"`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-63 · CA-1 · FR-16 · C1, C2 · ADR-033 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se crearon 2 suscripciones activas en `ARS` vigentes en `<MES_ACTUAL>` con `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription`: `"Netflix"` por `"5000.00"` ARS (`"p_start_period":"<MES_ACTUAL>-01"`, `"p_billing_day":10`) y `"Spotify"` por `"2500.00"` ARS (`"p_start_period":"<MES_ACTUAL>-01"`, `"p_billing_day":25`).

**Datos de prueba:** D 1: Email `qa+cp-sus-044-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `"Netflix"` (`$5.000,00`) + `"Spotify"` (`$2.500,00`) = `"$7.500,00"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-044-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-044-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | En `/subscriptions`, la tarjeta `subscriptions-committed` muestra el rótulo `"Comprometido en <mes actual>"`, el total `"$7.500,00"` (`subscriptions-committed-total`), el conteo `"2 suscripciones activas este mes"` (`subscriptions-committed-count`) y no muestra `subscriptions-committed-usd-pending` |

**Post-condición:** No se modifican filas. El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-045 — Suscripción activa en `USD 10,00` con tipo de cambio del período corriente `1.250,00` suma `"$12.500,00"` al total mensual comprometido

| Campo | Contenido |
|---|---|
| Historia · criterio | US-63 · CA-3 · FR-16 · C1, C2 · ADR-013, ADR-033 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se cargó el tipo de cambio de `<MES_ACTUAL>-01` igual a `"1250.00"` ejecutando con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/upsert_fx_rate` con body `{"p_period":"<MES_ACTUAL>-01","p_ars_per_usd":"1250.00"}`. S 5: se creó una suscripción activa en `USD` por `"10.00"` (`"p_name":"iCloud"`, `"p_start_period":"<MES_ACTUAL>-01"`, `"p_billing_day":28`).

**Datos de prueba:** D 1: Email `qa+cp-sus-045-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `"iCloud"` (`USD 10,00` × `1.250,00` = `"$12.500,00"`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-045-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-045-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | En `/subscriptions`, `subscriptions-committed-total` muestra `"$12.500,00"`, `subscriptions-committed-count` muestra `"1 suscripción activa este mes"` y no existe `subscriptions-committed-usd-pending` |

**Post-condición:** No se modifican filas. El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-046 — Una suscripción en estado `paused` no suma al total mensual comprometido (`"$0,00"` y `"No tenés suscripciones activas este mes"`)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-63 · CA-2 · FR-16 · ADR-033 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción `"Netflix"` por `"5000.00"` ARS y se la pausó con `POST <SUPABASE_URL>/rest/v1/rpc/pause_subscription`.

**Datos de prueba:** D 1: Email `qa+cp-sus-046-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Única suscripción `"Netflix"` en estado `paused`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-046-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-046-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | En `/subscriptions`, `subscriptions-committed-total` muestra `"$0,00"` y `subscriptions-committed-count` muestra `"No tenés suscripciones activas este mes"` |

**Post-condición:** No se modifican filas. El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-047 — Vista previa en `/subscriptions/new` con `$5.000,00` ARS, día `28` (`> <DIA_HOY>`), desde `<MES_HACE_2>` y sin fin muestra 2 meses en `"Se cargan al guardar"`, 3 en `"Próximos cobros"`, resumen de `"$10.000,00"` y al guardar crea exactamente esas 2 transacciones

| Campo | Contenido |
|---|---|
| Historia · criterio | US-75 · CA-1, CA-7 · US-52 · CA-2 · FR-16 · R1, R4, R5 · ADR-017, ADR-031, ADR-032 |
| Invariante | I11, I14, I17 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-047-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Netflix"`. D 4: Monto `"5000"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"28"`. D 8: Mes de inicio `"<MES_HACE_2>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-047-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-047-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en `"Nueva"` (`subscriptions-new`) | Se abre `/subscriptions/new` |
| 8 | Escribir `Netflix` en `"Nombre"` (`subscription-form-name`) | El campo muestra `Netflix` |
| 9 | Escribir `5000` en `"Monto"` (`subscription-form-amount`) | El campo muestra `5000` |
| 10 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 11 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 12 | Escribir `28` en `"Día de cobro"` (`subscription-form-billing-day`) | El campo muestra `28` |
| 13 | Ingresar `<MES_HACE_2>` en `"Mes de inicio"` (`subscription-form-start-period`) | En la sección `"Calendario"` (`subscription-form-preview`): `"Se cargan al guardar"` (`subscription-form-preview-due`) muestra 2 filas `subscription-form-preview-due-item` (`"<mes hace 2> · 28/<MES_HACE_2>"` y `"<mes anterior> · 28/<MES_ANTERIOR>"`), `"Próximos cobros"` (`subscription-form-preview-upcoming`) muestra 3 filas `subscription-form-preview-upcoming-item` (`<MES_ACTUAL>`, `<MES_SIGUIENTE>` y `<MES_MAS_2>`) y el resumen (`subscription-form-preview-summary`) dice `"Al guardar se cargan 2 gastos de $5.000,00 (total $10.000,00)."` |
| 14 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada. Se cargaron 2 gastos vencidos."` (`subscription-toast`) y en `"Gastos cargados"` (`subscription-detail-occurrences`) aparecen exactamente las mismas 2 fechas y períodos (`<MES_ANTERIOR>` y `<MES_HACE_2>`) que mostró `"Se cargan al guardar"` |

**Post-condición:** En `public.transactions` existen exactamente 2 filas (`<MES_HACE_2>-01` y `<MES_ANTERIOR>-01`) por `5000.00` ARS (`US-75 · CA-7`). El usuario queda como dato de prueba (email único, sin limpieza).

---

#### CP-SUS-048 — Vista previa en `/subscriptions/new` en USD con tipo de cambio en `<MES_HACE_2>` y sin tipo de cambio en `<MES_ANTERIOR>` marca `<MES_ANTERIOR>` con `data-blocked="true"` y no lo cuenta en el resumen

| Campo | Contenido |
|---|---|
| Historia · criterio | US-75 · CA-6 · FR-16 · R6 · ADR-031 |
| Invariante | I5 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>` y `<ACCESS_TOKEN>`. S 4: se cargó únicamente el tipo de cambio de `<MES_HACE_2>-01` (`"1200.00"`) dejando `<MES_ANTERIOR>` sin tipo de cambio: se ejecutó con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/upsert_fx_rate` con body `{"p_period":"<MES_HACE_2>-01","p_ars_per_usd":"1200.00"}`.

**Datos de prueba:** D 1: Email `qa+cp-sus-048-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Moneda `"USD"` · Monto `"20"` · Día de cobro `"28"` · Mes de inicio `"<MES_HACE_2>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-048-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-048-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en `"Nueva"` (`subscriptions-new`) | Se abre `/subscriptions/new` |
| 8 | Hacer click en el botón `"USD"` (`subscription-form-currency-usd`) | La moneda queda seleccionada en `"USD"` |
| 9 | Escribir `20` en `"Monto"` (`subscription-form-amount`) | El campo muestra `20` |
| 10 | Escribir `28` en `"Día de cobro"` (`subscription-form-billing-day`) | El campo muestra `28` |
| 11 | Ingresar `<MES_HACE_2>` en `"Mes de inicio"` (`subscription-form-start-period`) | En `"Se cargan al guardar"` (`subscription-form-preview-due`), la fila `subscription-form-preview-due-item` con `data-period="<MES_HACE_2>"` tiene `data-blocked="false"`, la fila con `data-period="<MES_ANTERIOR>"` tiene `data-blocked="true"` y muestra `"Sin tipo de cambio: se carga cuando lo cargues"`, y el resumen (`subscription-form-preview-summary`) dice `"Al guardar se carga 1 gasto de USD 20,00."` |

**Post-condición:** No se crean filas. El usuario queda como dato de prueba (email único, sin limpieza).

---

### Resumen por categoría (CAT, 6 casos)

Fuente: [`casos/cat.md`](casos/cat.md).

#### Convenciones de ejecución

- `<APP>` es la dirección del deploy bajo prueba. Cada caso usa su propio usuario (`qa+cp-cat-<nnn>-001@example.com`, contraseña `Clave123!`), creado con PR-01.
- Los movimientos de cada caso se cargan por la API con la RPC `create_transaction` (plantilla de PR-04), con la cuenta `"Efectivo"` salvo que el caso diga otra, una sola cuota y las fechas indicadas. Así no hay que cargar cada gasto por pantalla.
- Las fechas son de septiembre y agosto de 2026 y se abren con `?period=` en la dirección, por lo que el resultado no depende del día en que se ejecuta. Los montos son ficticios.

#### CP-CAT-001 — La torta muestra una porción por categoría, con su monto y su porcentaje

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

---

#### CP-CAT-002 — Los ingresos y los gastos eliminados no entran en la torta

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

---

#### CP-CAT-003 — Con 7 categorías, las dos más chicas se agrupan en «Resto» en la torta

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

---

#### CP-CAT-004 — Tocar una categoría del Resumen abre su detalle del mes

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

---

#### CP-CAT-005 — En el detalle, «Mes anterior» y «‹ Resumen» conservan la categoría y el mes

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

---

#### CP-CAT-006 — Una categoría que no existe muestra un aviso con salida al Resumen

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

---
