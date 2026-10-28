# Entrega 2 · Reporte de ejecución de casos de prueba (V2) · Deudas, Navegación, Exportar CSV, Importar Excel y Suscripciones

Planilla: `06-reporte-de-ejecucion.xlsx` (mismo formato que la Entrega 1: ID, prioridad, título, historia, camino feliz, status y defectos, más el resumen, el gráfico y los criterios de salida). Formato del contenido: `docs/07-plan-de-testing.md` §6. Registro por caso en [`04-ejecucion.md`](04-ejecucion.md); defectos en [`05-reportes-de-defectos.md`](05-reportes-de-defectos.md).

| Dato | Deudas y Navegación | Exportar CSV, Importar Excel y Suscripciones |
|---|---|---|
| Versión probada | Ejecución manual: deploy de Vercel (https://biyu-rust.vercel.app). Ejecución de Claude Code: main en f096e22 (local, con todas las migraciones hasta 20261012000000). | `main` en `1c72d0f` (local; los commits posteriores solo tocan documentos). No se probó el deploy de Vercel. |
| Entorno | Manual: Google Chrome contra el deploy. Claude Code: Vite local (127.0.0.1:5173) + Supabase local; Chromium (Playwright 1.63) y navegador integrado; pedidos directos a la API con el token del usuario de prueba. | Vite local (127.0.0.1:5173) + Supabase local (y Edge Functions locales en SUS); Chromium (Playwright 1.63), es-AR, America/Argentina/Buenos_Aires. Reloj del navegador fijado en 09/10/2026 (EXP) y 12/10/2026 (IMP); reloj real en SUS. |
| Fecha | 2026-10-25 | 2026-10-27 |
| Ejecutó | Santiago (a mano: Deudas CP-DEU-005 a 010 y 15 casos de Navegación) y Claude Code, supervisado por Santiago (el resto). | Claude Code (IA), supervisado por Santiago: EXP (31), IMP (41), 27 casos de SUS y 24 casos de Deudas (CP-DEU-015 a 035 y los 8 pendientes: 001 a 004, 011 a 013 y 025). El equipo: 21 casos de SUS, informados como «ok» por mensaje. |
| Datos | Usuarios qa+<id del caso>-001@example.com y montos ficticios, uno por caso; en local se pueden borrar con «supabase db reset». | Igual: usuarios `qa+cp-<módulo>-<nnn>-001@example.com` (con un sufijo de corrida) y montos ficticios. |

## 1. Planificados, ejecutados, pasados, fallados y bloqueados

Catálogo recortado el 2026-10-27: de 672 a **206 casos** (se quitaron los que repetían una regla con otro valor, los de funciones todavía no implementadas y los de ancho de pantalla o testids repetidos). Los números de este reporte son los **197 casos que tienen resultado**; los 9 de Deudas restantes (CP-DEU-014, 018, 020, 021, 022, 036, 037, 038 y 039) no figuran porque el equipo los informó como «OK» y no se repitieron. Los 8 casos de Deudas que no se habían ejecutado se ejecutaron el 2026-10-27 (ver abajo).

| Métrica | Casos | % |
|---|---|---|
| Planificados | 197 | 100 % |
| Ejecutados (PASSED + FAILED + DUDA) | 193 | 98 % de avance |
| PASSED | 180 | 93 % de los ejecutados |
| FAILED | 9 | 5 % de los ejecutados |
| DUDA (pasa, con dudas) | 4 | 2 % de los ejecutados |
| BLOCKED | 4 | 2 % de los planificados |
| No ejecutados | 0 | — |

**Deudas y Navegación (28 casos de Deudas y 25 de Navegación):**

- **FAILED:** ninguno. Navegación pasó los 25 casos.
- **BLOCKED:** 3 casos que dependen de una función todavía no implementada: CP-DEU-055, 056 y 057 (US-82, issue #270). Se dejaron en el catálogo para repetirlos cuando exista.

**Deudas, casos CP-DEU-015 a 035 (16 casos ejecutados con IA):**

- **FAILED (1):** CP-DEU-024 (DEF-037): el primer clic en «US$» de «Nueva deuda» se pierde (al salir del foco de «Persona» aparece el error y los botones se corren), así que el campo «Tipo de cambio» no aparece; con un segundo clic el resto del caso se cumple.
- **PASSED (15):** baja y restauración de un gasto con deuda (CP-DEU-015 y 016), alta de deuda por pantalla (017, 019, 023 y 026) y los 9 casos de `create_debt` directo por API (027, 028, 029, 030, 031, 032, 033, 034 y 035), incluidos el rechazo del rol anónimo y del `INSERT` directo.
- **Diferencias con el informe del equipo:** CP-DEU-023 pasa.

**Deudas, 8 casos pendientes (CP-DEU-001 a 004, 011 a 013 y 025; ejecutados con IA el 2026-10-27):**

- **PASSED (2):** CP-DEU-004 (falta «¿Cuánto te debe?») y CP-DEU-012 (deuda un centavo mayor que el gasto).
- **FAILED (1):** CP-DEU-025 (DEF-037): el primer clic en «US$» de «Nueva deuda» se pierde y el campo «Tipo de cambio» no aparece; con un segundo clic el resto se cumple (mensaje «El tipo de cambio debe ser mayor a cero»).
- **DUDA (4):** CP-DEU-001 y CP-DEU-011 no piden elegir una cuenta y, como están escritos, «Guardar gasto» queda deshabilitado («Completá cuenta para guardar»); con «Efectivo» elegida se cumple todo lo esperado (parece un error del caso). CP-DEU-003 tampoco pide elegir cuenta y además fija el tipo de cambio antes de cambiar la fecha a otro mes: la app descarta a propósito el tipo de cambio al cambiar de mes y hay que volver a cargarlo en el paso 1; con eso se cumple todo (parece un error del caso). CP-DEU-002 se cumple (12 cuotas de $10.000,00 y 1 deuda de Sofía por $60.000,00 vinculada, con 1 sola llamada y ninguna a /debts), pero el pedido usa p_shared_person y p_shared_amount en lugar de los arreglos que pide el paso 15, porque US-82 no existe.
- **BLOCKED (1):** CP-DEU-013 (por API, deuda mayor que el gasto): con p_shared_persons y p_shared_amounts responde 404 PGRST202 porque US-82 (issue #270) no existe; con una sola persona responde 400, code 23514 y «I7: la deuda no puede superar el monto del gasto», sin dejar filas.

**Exportar CSV (EXP) (31 casos):**

- **FAILED:** CP-EXP-027 (DEF-030), CP-EXP-028 (DEF-031) y CP-EXP-029 (DEF-032). Los tres se reprodujeron más de una vez y el defecto es de la aplicación, no del caso.
- **Lo que sí se cumple:** el contenido del CSV pasó todas las comprobaciones de formato (BOM, doce columnas), montos y tipo de cambio, escape de comas y comillas, neutralización de fórmulas, aislamiento entre usuarios (UI y API) y volumen (1.500 filas sin faltantes).

**Importar Excel (IMP) (41 casos):**

- **FAILED (1):** CP-IMP-024 (DEF-033): la tarjeta de la fila muestra el texto del archivo y no el nombre de la categoría y la cuenta de Biyu.
- **Lo que sí se cumple:** acceso, validación del archivo (extensión, tamaño, encabezados, 500 filas), las reglas de fila más representativas con sus mensajes exactos y el orden de reglas, lectura de montos, resumen y filtro, importación con confirmación, idempotencia por `import_id`, errores de red y sesión vencida, y las variantes API de `import_transactions` (lote inválido, anónimo y otro usuario).
- Las funciones de cuotas pendientes (US-80) y la guía «¿Cómo armo el archivo?» (US-81) todavía no existen: sus 51 casos se quitaron del catálogo y se vuelven a escribir cuando se implementen.

**Suscripciones (SUS) (48 casos):**

- **FAILED (3):** CP-SUS-032 (DEF-034: la API responde HTTP 500 con `P0002` donde el caso espera 404); CP-SUS-022 (DEF-035: sin sesión la API responde HTTP 401 donde el caso espera 403; el código 42501 coincide); CP-SUS-048 (DEF-036: la fila no bloqueada no tiene `data-blocked="false"`). Los tres defectos son de severidad Baja y DEF-035 y DEF-036 parecen errores de los casos.
- **Lo que sí se cumple:** las validaciones principales de `create_subscription` (mensajes y códigos exactos), el aislamiento entre usuarios, el rechazo de `INSERT` directo, la puesta al día (idempotencia, estado pausada, USD sin tipo de cambio), pausar, reanudar, cancelar y editar, el detalle de otro usuario, la eliminación de ocurrencias, la marca de suscripción, el total comprometido y dos vistas previas del calendario.
- **Equipo:** 21 casos los informó el equipo como «ok» y no se repitieron; su estado es el informado, sin detalle.

## 2. Cobertura por módulo, prioridad, tipo, técnica y canal

| Módulo | Casos | PASSED | FAILED | DUDA | BLOCKED | No ejecutados |
|---|---|---|---|---|---|---|
| DEU-H · Gasto compartido con una persona y tope de la deuda (US-34, US-36 y US-41; CP-DEU-001 a 004, 011 a 013 y 025; 8 casos ejecutados con IA) | 8 | 2 | 1 | 4 | 1 | 0 |
| DEU-A · Gasto compartido: validaciones de create_transaction (US-34, CP-DEU-005 a 010) | 6 | 6 | 0 | 0 | 0 | 0 |
| DEU-B · Listado, filtro por estado y acceso (US-37 y US-38, CP-DEU-040 a 045) | 6 | 6 | 0 | 0 | 0 | 0 |
| DEU-C · Saldar, volver a pendiente y filtro por dirección (US-39, US-40 y US-79, CP-DEU-046 a 054) | 9 | 9 | 0 | 0 | 0 | 0 |
| DEU-D · Compartir con varias personas (US-82, CP-DEU-055, 056 y 057) | 3 | 0 | 0 | 0 | 3 | 0 |
| DEU-E · Neto de reembolsos en el Resumen (US-30, CP-DEU-058 a 061) | 4 | 4 | 0 | 0 | 0 | 0 |
| DEU-G · Lectura y baja de gastos compartidos, alta de deuda suelta y create_debt por API (US-35, US-36 y US-41; CP-DEU-015 a 035, 16 casos ejecutados con IA) | 16 | 15 | 1 | 0 | 0 | 0 |
| NAV-69 · Barra de navegación (US-69) | 10 | 10 | 0 | 0 | 0 | 0 |
| NAV-70 · Aviso de guardado y reintento (US-70) | 15 | 15 | 0 | 0 | 0 | 0 |
| EXP · Exportar CSV (US-47, 31 casos) | 31 | 28 | 3 | 0 | 0 | 0 |
| IMP · Importar Excel (US-74 a US-79, 41 casos) | 41 | 40 | 1 | 0 | 0 | 0 |
| SUS · Suscripciones (US-52 a US-63 y US-75, 48 casos) | 48 | 45 | 3 | 0 | 0 | 0 |

| Prioridad | Casos | PASSED | FAILED | DUDA | BLOCKED | No ejecutados |
|---|---|---|---|---|---|---|
| Alta | 126 | 112 | 6 | 4 | 4 | 0 |
| Media | 67 | 65 | 2 | 0 | 0 | 0 |
| Baja | 4 | 3 | 1 | 0 | 0 | 0 |

| Tipo | Casos | PASSED | FAILED | DUDA | BLOCKED | No ejecutados |
|---|---|---|---|---|---|---|
| Positivo | 83 | 75 | 4 | 3 | 1 | 0 |
| Negativo | 81 | 78 | 3 | 0 | 0 | 0 |
| Límite | 33 | 27 | 2 | 1 | 3 | 0 |

| Técnica | Casos | PASSED | FAILED | DUDA | BLOCKED | No ejecutados |
|---|---|---|---|---|---|---|
| Partición de equivalencia | 88 | 83 | 4 | 1 | 0 | 0 |
| Tabla de decisión | 4 | 4 | 0 | 0 | 0 | 0 |
| Valores límite | 40 | 34 | 2 | 1 | 3 | 0 |
| Adivinación de errores | 16 | 16 | 0 | 0 | 0 | 0 |
| Caso de uso | 14 | 11 | 1 | 1 | 1 | 0 |
| Transición de estados | 34 | 31 | 2 | 1 | 0 | 0 |
| Prueba de rendimiento | 1 | 1 | 0 | 0 | 0 | 0 |

| Canal | Casos | PASSED | FAILED | DUDA | BLOCKED | No ejecutados |
|---|---|---|---|---|---|---|
| API | 52 | 48 | 2 | 0 | 2 | 0 |
| UI | 145 | 132 | 7 | 4 | 2 | 0 |

## 3. Quién ejecutó cada caso: con IA y sin IA

| Módulo | Casos | A mano por el equipo | Con IA (Claude Code, supervisado por Santiago) | Informados «ok» por el equipo, sin repetir |
|---|---|---|---|---|
| Deudas (DEU) | 52 | 6 (CP-DEU-005, 006, 007, 008, 009 y 010) | 46 | 0 |
| Navegación (NAV) | 25 | 15 | 10 | 0 |
| Exportar CSV (EXP) | 31 | 0 | 31 | 0 |
| Importar Excel (IMP) | 41 | 0 | 41 | 0 |
| Suscripciones (SUS) | 48 | 0 | 27 | 21 |
| **Total** | **197** | **21** | **155** | **21** |

Los casos de EXP, IMP y SUS que ejecutó la IA y el detalle de lo que se sustituyó (herramientas, oráculos y reloj) están en §6; los de SUS informados como «ok» por el equipo son los 21 que no figuran como ejecutados con IA (lista en `04-ejecucion`).

## 4. Defectos por severidad

| Severidad | Abiertos | IDs |
|---|---|---|
| Crítica | 0 | — |
| Alta | 0 | — |
| Media | 4 | DEF-030, DEF-031, DEF-032, DEF-037 |
| Baja | 4 | DEF-033, DEF-034, DEF-035, DEF-036 |
| **Total abiertos** | **8** | DEF-030, DEF-031, DEF-032, DEF-033, DEF-034, DEF-035, DEF-036, DEF-037 |

Detalle en `05-reportes-de-defectos`. Ninguno tiene issue todavía.

## 5. Criterios de salida (docs/07-plan-de-testing.md §6)

| Criterio | Estado | Detalle |
|---|---|---|
| 1. Cero defectos de severidad Crítica abiertos | Cumplido | No hay defectos críticos (los defectos abiertos son de severidad Media y Baja). |
| 2. Cero defectos de severidad Alta abiertos, o justificados por el PO | Cumplido | No hay defectos de severidad Alta. |
| 3. Todos los casos de prioridad Alta ejecutados | No cumplido | 122 de 126 casos de prioridad Alta ejecutados. No ejecutados: 4, todos BLOCKED porque dependen de una funcionalidad todavía no implementada: US-82 (issue #270), CP-DEU-055, 056, 057 y CP-DEU-013. Se ejecutan en V3. |
| 4. Toda invariante del alcance con al menos un caso ejecutado | Parcial | Deudas y Navegación: I10, I18, I2, I3, I4, I5, I7 e I9 con casos ejecutados; I1 ya no tiene caso en este alcance después del recorte y queda para la regresión de V1. En Exportar, Importar y Suscripciones no se verificó invariante por invariante en este reporte. Las demás invariantes de V2 (dashboard, etc.) están en otros casos. |
| 5. Regresión de V1 ejecutada y defectos corregidos confirmados | No evaluado | Fuera del alcance de este reporte: la selección de regresión (03) y la confirmación de los defectos de V1 se informan aparte. |

**Conclusión:** con este alcance se cumplen los criterios 1 y 2 (no hay defectos críticos ni altos). El criterio 3 **no se cumple**: los cuatro casos de prioridad Alta bloqueados por una funcionalidad inexistente (US-82) no se pueden ejecutar hasta que exista (quedan para V3). El 4 se cumple solo en parte porque el alcance es parcial, y el 5 (regresión de V1) se informa aparte.

## 6. Desvíos respecto de lo planificado

### Deudas y Navegación (ejecutado el 2026-10-25)

1. Catálogo recortado y alcance parcial de V2. El 2026-10-27 se recortó el catálogo de 672 a 206 casos y este reporte cubre los que tienen resultado: 28 casos de Deudas (CP-DEU-005 a 010 y 040 a 061), 8 casos de Deudas ejecutados después (ver el último apartado de Deudas) y 25 de Navegación. Los 9 casos de Deudas que el equipo informó como «OK» y los de Dashboard no están incluidos.
2. Tres formas de ejecutar. 15 casos de Navegación y los 6 de Deudas (CP-DEU-005 a 010) los ejecutó Santiago a mano en el deploy de Vercel, con Chrome. Los otros 10 de Navegación y los 22 de Deudas del 101 en adelante los ejecutó Claude Code en el entorno local (Playwright, navegador integrado y pedidos directos a la API). La propiedad cruzada del plan (07-plan-de-testing §1) no se aplicó.
3. Deudas CP-DEU-005 a 010 se verificaron en la pantalla, no por API. Los casos están escritos como llamadas directas a create_transaction con varias personas (US-82), que todavía no existe (issue #270). Se ejecutó la prueba equivalente en Registrar («Gasto compartido») de cada caso gemelo; el resultado esperado de la pantalla es el mensaje de error y el botón «Guardar gasto» deshabilitado.
4. Función todavía no implementada. US-82 (compartir con varias personas, issue #270) no existe en la app: quedan BLOCKED CP-DEU-055, 056 y 057. Se comprobó la ausencia de la función (botones y respuesta de la API) y no se les abrió defecto: dependen de una historia pendiente. Los demás casos de US-82 y todos los de US-83 (deudas sueltas en el balance del mes, issue #271) se quitaron del catálogo.
5. Casos con dudas quitados. Dos casos de Deudas (uno cuya preparación pedía 12 cuotas con la cuenta «Efectivo», que la app rechaza, y otro que se cumple aunque no exista US-83) estaban en DUDA y se quitaron en el recorte.
6. Preparación por API. En los casos CP-DEU-040 a 061 las deudas, gastos y tipos de cambio de la preparación se cargaron por API (create_debt, create_transaction, settle_debt, delete_transaction, upsert_fx_rate), como en los casos originales con PR-04; el formulario «Nueva deuda» no se ejercitó en esos casos.
7. El caso que necesitaba un Pixel 7 con Android 15 y TalkBack en español) se quitó del catálogo en el recorte.
8. El caso de la baja con respuesta 204 (CP-NAV-084 en la numeración anterior) estaba FAILED por una diferencia entre el caso y la implementación (204 sin cuerpo en vez de 200 con null) y se quitó del catálogo en el recorte. DEF-029 se retiró de los reportes de defectos: era un error del caso, no de la aplicación.
9. Adaptaciones de DevTools en las ejecuciones de Claude Code: el corte de red y el perfil de 20 s se aplicaron con el protocolo de Chrome (el mismo mecanismo de Network); en CP-NAV-005 y 006 se ocultó la barra de desplazamiento clásica del navegador integrado para imitar un celular. CP-NAV-017 usó una barrera en Node en lugar del script de PowerShell.
10. Evidencia: no se adjuntaron capturas al repositorio; lo observado queda en «Resultado obtenido» de cada caso (04-ejecucion).

### Deudas, casos CP-DEU-015 a 035 (ejecutado el 2026-10-27)

1. Ejecución con scripts de Playwright y llamadas directas a la API, no a mano; la propiedad cruzada del plan no se aplicó. Entorno local (Vite + Supabase local), solo Chromium, reloj real (27/10/2026); no se probó el deploy de Vercel.
2. Los casos CP-DEU-015 y 016 piden crear el gasto compartido con varias personas (`p_shared_persons` y `p_shared_amounts`, US-82), que todavía no existe. Se prepararon con una sola persona (`p_shared_person` y `p_shared_amount`), como en las ejecuciones anteriores de Deudas.
3. CP-DEU-026 y CP-DEU-033 piden la fecha de mañana: se usó la real (28/10/2026).
4. CP-DEU-024 se ejecutó como está escrito: el primer clic en «US$» se pierde (DEF-037) y el caso queda FAILED; se verificó que con un segundo clic el resto se cumple. El caso tampoco carga un tipo de cambio de referencia; no hace falta porque el campo permite escribirlo a mano.
5. En CP-DEU-019 se cargó el tipo de cambio de referencia por API (`upsert_fx_rate`) como indica la preparación y se eligió la fecha antes de tocar «US$».
6. Los casos que el equipo informó como «OK» no se repitieron y no figuran en el reporte. No se adjuntaron capturas ni los scripts.

### Deudas, 8 casos pendientes (ejecutado el 2026-10-27)

1. Ejecución con scripts de Playwright (Chromium emulando un celular de 375 × 812 px, es-AR, hora de Argentina) y llamadas directas a la API, no a mano; la propiedad cruzada del plan no se aplicó. Entorno local (Vite + Supabase local), sobre `main` en `deac2c7`, reloj real (27/10/2026); no se probó el deploy de Vercel.
2. Usuarios `qa+cp-deu-<id>-001@example.com`, uno por caso. Un intento anterior del script falló por selectores y creó usuarios con ese email: se borraron de la base local antes de la corrida final.
3. CP-DEU-001, 003 y 011 no piden elegir una cuenta, pero sin cuenta «Guardar gasto» queda deshabilitado («Completá cuenta para guardar»): se eligió «Efectivo» (la cuenta que nombran los datos de prueba de otros casos). Parece un error de los casos: agregar el paso.
4. CP-DEU-003 fija el tipo de cambio antes de cambiar la fecha a otro mes; la app descarta el tipo de cambio al cambiar de mes (es intencional) y en el paso 3 de 3 no hay dónde volver a escribirlo, así que se volvió al paso 1 («cambiar monto») para cargarlo de nuevo. Parece un error del caso.
5. CP-DEU-002: la categoría «Tecnología» se creó por pantalla desde Ajustes (el caso pide crearla por API con PR-04). La consulta final de la base (transactions, ledger_entries y debts) se hizo por API con el token del usuario. Los parámetros del pedido son los de una sola persona porque la función de varias personas (US-82) no existe.
6. CP-DEU-013 se ejecutó como está escrito y quedó BLOCKED; además se probó la variante con una sola persona (p_shared_person y p_shared_amount), que da el rechazo esperado.
7. CP-DEU-025 reproduce DEF-037 (el primer clic en «US$» se pierde).
8. No se adjuntaron capturas ni los scripts; lo observado queda en «Resultado obtenido» de cada caso (04-ejecucion).

### Exportar CSV (EXP) (ejecutado el 2026-10-27)

1. **Ejecución asistida por un script.** El plan prevé ejecución manual por un integrante que no diseñó el caso. Acá los pasos los ejecutó Claude Code con Playwright, siguiendo cada caso como lo haría una persona y leyendo el archivo descargado como oráculo. La propiedad cruzada del plan (`docs/07-plan-de-testing.md` §1) no se aplicó: conviene que cada integrante revise la evidencia de su módulo.
2. **Entorno local, no el deploy.** Todo se ejecutó contra el código local y Supabase local; los resultados pueden diferir del deploy de Vercel si este está desactualizado. Solo Chromium: no se probó Firefox ni Safari.
3. **Reloj fijado.** El reloj del navegador se fijó en 09/10/2026 12:00 (America/Argentina/Buenos_Aires), como piden los casos. El reloj del servidor no se tocó.
4. **Preparación por API.** Las transacciones, el catálogo y las referencias de tipo de cambio se cargaron por API (EXP-PREP-01 a 06), no por las pantallas. Los casos CP-EXP-018 y 030 sembraron más de 1.000 transacciones con un script de Node (8 pedidos en paralelo) en lugar del script de PowerShell 7 de EXP-PREP-07, que no está instalado.
5. **Herramientas sustituidas.** (a) Red lenta (CP-EXP-029): demora fija de 3 s en la lectura de `/rest/v1/transactions`, en lugar de «1 kbit/s, 2000 ms» de DevTools. (b) Sin conexión (CP-EXP-025 y 026): corte de red del contexto de Playwright. (c) HTTP 500 (CP-EXP-031): ruta interceptada de Playwright en lugar del código pegado en la consola (EXP-PREP-08), con el mismo efecto sobre el `fetch`. (d) CP-EXP-030: el alta concurrente se hizo por API entre la primera y la segunda página de la lectura, no desde una segunda ventana de otro navegador. (e) CP-EXP-027: clic fuera de la hoja en la posición (5, 5) de una ventana de 420 × 900.
6. **Cuotas (CP-EXP-011).** La preparación pide PR-07; se creó la compra con `create_transaction` en una cuenta «Visa BBVA» de tipo tarjeta de crédito, porque la base solo admite cuotas con tarjeta de crédito.
7. **Bajas.** `delete_transaction` responde 204 sin cuerpo (es el comportamiento esperado: el caso de Navegación que esperaba 200 estaba mal escrito); el script lo toma como éxito en CP-EXP-008 y los demás casos que eliminan una transacción.
8. **Casos reescritos por errores del script, no del caso ni de la app.** Se rehicieron CP-EXP-008 (la baja responde 204), CP-EXP-011 (faltaba la tarjeta de crédito) y CP-EXP-027 a 029 (esperas y verificaciones insuficientes en la primera versión). No se cambió el resultado de ningún caso a mano.
9. **Dependencias.** Para correr el import de Excel hubo que instalar `read-excel-file` y `write-excel-file` (estaban en `package.json` pero no en `node_modules`); no afecta a EXP.
10. **Evidencia.** No se adjuntaron capturas ni los scripts al repositorio; lo observado (nombre y tamaño del archivo, fila exportada, mensajes y estado final de la pantalla) queda en «Resultado obtenido» de cada caso. El contenido de los CSV tampoco se guardó.

### Importar Excel (IMP) (ejecutado el 2026-10-27)

1. **Ejecución asistida por un script.** El plan prevé ejecución manual por un integrante que no diseñó el caso. Acá los pasos los ejecutó Claude Code con Playwright (y llamadas directas a la API) siguiendo cada caso. La propiedad cruzada del plan (`docs/07-plan-de-testing.md` §1) no se aplicó: conviene que cada integrante revise los resultados de su módulo.
2. **Entorno local, no el deploy.** Todo se ejecutó contra el código local y Supabase local; los resultados pueden diferir del deploy de Vercel si este está desactualizado. Solo Chromium.
3. **Reloj fijado.** El reloj del navegador se fijó en 12/10/2026 12:00 (America/Argentina/Buenos_Aires) como piden los casos; el reloj del servidor no se tocó (es el real, 27/10/2026).
4. **Archivos.** Los `.xlsx` se generaron con `write-excel-file` a partir de los datos de cada caso, no con Excel ni LibreOffice. CP-IMP-002 usa un `.xlsx` renombrado `.xls`, soltado con el evento de arrastrar y soltar y no desde el Explorador. IMP-DATA-01 se armó fila por fila desde la tabla del documento (la columna «Cuotas pendientes» no existe en ese libro).
5. **Herramientas sustituidas.** (a) Sin conexión (CP-IMP-038 y 040): corte de red del contexto de Playwright. (b) HTTP 401 (CP-IMP-041): respuesta simulada con una ruta de Playwright. (c) CP-IMP-038: identificador fijado redefiniendo `crypto.randomUUID` con el mismo valor que IMP-PREP-06. (d) CP-IMP-033: el cronómetro es el del script y corre en local (0,9 s), no en el deploy de Vercel.
6. **Criterio para BLOCKED.** Un caso que no se puede ejecutar porque falta una funcionalidad o un botón queda BLOCKED para V3. Los casos de cuotas pendientes (US-80) y de la guía (US-81), que estaban en ese estado o en DUDA porque la función no existe (`installments_paid` e `import-guide-open` no existen), se quitaron del catálogo en el recorte.
7. **Preparación por API.** Los casos que piden PR-04 se ejecutaron con el token del usuario de prueba. Los usuarios se crearon por API y la configuración inicial se salteó por pantalla.
8. **Dependencias.** Para correr el importador hubo que instalar `read-excel-file` y `write-excel-file` (estaban en `package.json` pero no en `node_modules`).
9. **Evidencia.** No se adjuntaron capturas ni los scripts al repositorio.

### Suscripciones (SUS) (ejecutado el 2026-10-27)

1. **Ejecución asistida por un script.** El plan prevé ejecución manual por un integrante que no diseñó el caso. Acá los pasos los ejecutó Claude Code con Playwright (y llamadas directas a la API) siguiendo cada caso. La propiedad cruzada del plan (`docs/07-plan-de-testing.md` §1) no se aplicó: conviene que cada integrante revise los resultados de su módulo.
2. **Entorno local, no el deploy.** Todo se ejecutó contra el código local y Supabase local; los resultados pueden diferir del deploy de Vercel si este está desactualizado. Solo Chromium.
3. **Fechas relativas.** Los casos usan fechas relativas a `<HOY>`. Se ejecutaron el 2026-10-27 (`<DIA_HOY>` = 27, que cumple la condición `<= 27`): `<MES_ACTUAL>` = 2026-10, `<MES_ANTERIOR>` = 2026-09, `<MES_HACE_2>` = 2026-08, `<MES_SIGUIENTE>` = 2026-11, `<MES_MAS_3>` = 2027-01, `<MES_HACE_25>` = 2024-09 y `<MES_MAS_13>` = 2027-11. El reloj del servidor es el real; no se pudieron cubrir los huecos que piden otro reloj.
4. **Pasos que no existen en la pantalla.** Varios casos nombran `data-testid` que no existen (por ejemplo `register-nav-subscriptions`, `transactions-period-select` o `dashboard-period-select`). Se navegó por la dirección (`/subscriptions`, `/transactions?period=…`, `/dashboard?period=…`) y se usaron los `data-testid` reales. El caso CP-SUS-040 no aclara qué movimientos hay en Resumen: se usaron los de la preparación del caso.
5. **Puesta al día.** Para los casos que cargan la app y esperan la puesta al día (CP-SUS-040 y 043) se levantaron las Edge Functions locales (`supabase functions serve`).
6. **HTTP de los casos de API.** Los casos escriben HTTP 403 para el rol anónimo y 404 para la suscripción de otro usuario; la API responde 401 y 500 (DEF-035 y DEF-034). Se marcó FAILED cada uno, con el resultado exacto, para que el equipo decida si corrige el caso o la aplicación.
7. **Sin repetir los «ok» del equipo.** Los 21 casos informados como «ok» no se volvieron a ejecutar: su estado es el que informó el equipo.
8. **Los casos CP-SUS-047 y 048** («no especifica pasos correctamente», «no muestra ningún resumen») se ejecutaron con los datos y los pasos tal como están escritos, completando con los valores de la preparación del caso.
9. **Dependencias.** Se instalaron `read-excel-file` y `write-excel-file` en `node_modules` (no afecta a SUS).
10. **Evidencia.** No se adjuntaron capturas ni los scripts al repositorio.

## 7. Datos de prueba

Usuarios `qa+<id del caso>-001@example.com` con contraseña `Clave123!` y montos ficticios (C14), uno por caso. En el entorno local se borran con `supabase db reset`; en el deploy de Vercel quedan las cuentas de prueba creadas por la ejecución manual.

Exportar, Importar y Suscripciones: usuarios `qa+cp-<módulo>-<nnn>-001@example.com` (los de aislamiento, `-A` y `-B`) con contraseña `Clave123!` y montos ficticios (C14), en Supabase local; `supabase db reset` los borra. En producción no se creó nada.
