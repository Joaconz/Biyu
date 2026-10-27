# Entrega 2 · Reporte de ejecución de casos de prueba (V2) · Deudas, Navegación, Exportar CSV, Importar Excel y Suscripciones

Planilla: `06-reporte-de-ejecucion.xlsx` (mismo formato que la Entrega 1: ID, prioridad, título, historia, camino feliz, status y defectos, más el resumen, el gráfico y los criterios de salida). Formato del contenido: `docs/07-plan-de-testing.md` §6. Registro por caso en [`04-ejecucion.md`](04-ejecucion.md); defectos en [`05-reportes-de-defectos.md`](05-reportes-de-defectos.md).

| Dato | Deudas y Navegación | Exportar CSV, Importar Excel y Suscripciones |
|---|---|---|
| Versión probada | Ejecución manual: deploy de Vercel (https://biyu-rust.vercel.app). Ejecución de Claude Code: main en f096e22 (local, con todas las migraciones hasta 20261012000000). | `main` en `1c72d0f` (local; los commits posteriores solo tocan documentos). No se probó el deploy de Vercel. |
| Entorno | Manual: Google Chrome contra el deploy. Claude Code: Vite local (127.0.0.1:5173) + Supabase local; Chromium (Playwright 1.63) y navegador integrado; pedidos directos a la API con el token del usuario de prueba. | Vite local (127.0.0.1:5173) + Supabase local (y Edge Functions locales en SUS); Chromium (Playwright 1.63), es-AR, America/Argentina/Buenos_Aires. Reloj del navegador fijado en 09/10/2026 (EXP) y 12/10/2026 (IMP); reloj real en SUS. |
| Fecha | 2026-10-25 | 2026-10-27 |
| Ejecutó | Santiago (a mano: Deudas 018 a 028 y 40 casos de Navegación) y Claude Code, supervisado por Santiago (el resto). | Claude Code (IA), supervisado por Santiago: EXP (75), IMP (144) y 80 casos de SUS. El equipo: 78 casos de SUS, informados como «ok» por mensaje. |
| Datos | Usuarios qa+<id del caso>-001@example.com y montos ficticios, uno por caso; en local se pueden borrar con «supabase db reset». | Igual: usuarios `qa+cp-<módulo>-<nnn>-001@example.com` (con un sufijo de corrida) y montos ficticios. |

## 1. Planificados, ejecutados, pasados, fallados y bloqueados

| Métrica | Casos | % |
|---|---|---|
| Planificados | 567 | 100 % |
| Ejecutados (PASSED + FAILED + DUDA) | 478 | 84 % de avance |
| PASSED | 449 | 94 % de los ejecutados |
| FAILED | 17 | 4 % de los ejecutados |
| DUDA (pasa, con dudas) | 12 | 3 % de los ejecutados |
| BLOCKED | 88 | 16 % de los planificados |
| No ejecutados | 1 | — |

**Deudas y Navegación (190 casos):**

- **FAILED:** CP-NAV-084 (DEF-029): la baja responde 204 sin cuerpo y el caso espera 200 con `null`; parece un error del caso.
- **BLOCKED:** 43 casos que dependen de funciones todavía no implementadas: CP-DEU-029 y CP-DEU-128 a 142B (US-82, issue #270), y CP-DEU-151 a 157 y 159 (US-83, issue #271).
- **DUDA:** CP-DEU-145 (la preparación pide 12 cuotas con una cuenta «Efectivo», que la app rechaza; parece un error del caso) y CP-DEU-158 (se cumple, pero también se cumpliría sin US-83).
- **No ejecutado:** CP-NAV-060: requiere un Pixel 7 con TalkBack.

**Exportar CSV (EXP) (75 casos):**

- **FAILED:** CP-EXP-062 (DEF-030), CP-EXP-063 y CP-EXP-065 (DEF-031) y CP-EXP-064 (DEF-032). Los cuatro se reprodujeron más de una vez y el defecto es de la aplicación, no del caso.
- **DUDA:** CP-EXP-030 y CP-EXP-071. Los pasos finales piden importar el CSV en Google Sheets; no se pudo usar, así que el oráculo fue un lector RFC 4180 propio (12 columnas, una fila y descripción multilínea en una sola celda). Repetir con Google Sheets para cerrarlos.
- **PASSED sin valor hoy:** CP-EXP-070. Exige que tocar fuera no cierre la hoja durante «Exportando…», pero hoy tocar fuera nunca la cierra (DEF-030): pasaría aunque el bloqueo no existiera. Repetir cuando se corrija DEF-030.
- **Lo que sí se cumple:** el contenido del CSV pasó todas las comprobaciones de formato (BOM, doce columnas, CRLF), montos y tipo de cambio, escape de comas, comillas y saltos de línea, neutralización de fórmulas, orden, aislamiento entre usuarios (UI y API) y volumen (1.000, 1.500 y 2.000 filas sin faltantes).

**Importar Excel (IMP) (144 casos):**

- **BLOCKED (45):** dependen de funcionalidades que todavía no existen; se vuelven a ejecutar en V3. En el código no hay `installments_paid` (ni en la base ni en la app) ni la guía «¿Cómo armo el archivo?». **US-80, Cuotas pendientes (31):** CP-IMP-003, 018, 093 a 096, 099 a 110, 113 a 125. **US-81, guía (14):** CP-IMP-082, 127 a 136, 138, 140 y 141.
- **FAILED (1):** CP-IMP-052 (DEF-033): la tarjeta de la fila muestra el texto del archivo y no el nombre de la categoría y la cuenta de Biyu.
- **DUDA (8):** CP-IMP-012, 097 y 098, 111 y 112, 126, 137, 139. Los casos 097, 098, 111, 112, 126, 137 y 139 pasan, pero pasarían igual sin la funcionalidad que prueban (US-80 o US-81). CP-IMP-012: con un `.xlsx` válido de exactamente 1.048.576 bytes la app lo acepta; con la preparación literal del caso (ceros al final del archivo, IMP-PREP-05) responde «No pudimos leer el archivo». Parece un error de la preparación del caso.
- **Lo que sí se cumple:** acceso y rutas privadas, validación del archivo (extensión, tamaño, hojas, encabezados, 500 filas), las reglas F1 a F18 con sus mensajes exactos y el orden de reglas, lectura de fechas y montos, resumen y filtro, importación con confirmación, idempotencia por `import_id`, errores de red, sesión vencida, tiempo agotado y error del servidor, diálogo de salida con importación incierta, y las seis variantes API de `import_transactions` (incluido el rechazo atómico de CP-IMP-144).

**Suscripciones (SUS) (158 casos):**

- **FAILED (11):** CP-SUS-094, 100, 107 y 129 (DEF-034: la API responde HTTP 500 con `P0002` donde el caso espera 404); CP-SUS-065, 066, 095, 101, 108 y 130 (DEF-035: sin sesión la API responde HTTP 401 donde el caso espera 403; el código 42501 coincide); CP-SUS-157 (DEF-036: la fila no bloqueada no tiene `data-blocked="false"`). Los tres defectos son de severidad Baja y DEF-035 y DEF-036 parecen errores de los casos.
- **Lo que sí se cumple:** las 26 validaciones de `create_subscription` (mensajes y códigos exactos), el aislamiento entre usuarios, el rechazo de `INSERT`, `DELETE` y `PATCH` directos, la puesta al día (idempotencia, estados pausada y cancelada, categoría y cuenta archivadas, USD sin tipo de cambio), pausar, reanudar, cancelar y editar por API, los avisos de catálogo vacío, el detalle de otro usuario, las ediciones y la eliminación y restauración de ocurrencias desde Movimientos y Resumen, la marca de suscripción y las cuatro vistas previas del calendario.
- **Equipo:** 78 casos los informó el equipo como «ok» y no se repitieron; su estado es el informado, sin detalle.

## 2. Cobertura por módulo, prioridad, tipo, técnica y canal

| Módulo | Casos | PASSED | FAILED | DUDA | BLOCKED | No ejecutados |
|---|---|---|---|---|---|---|
| DEU-A · Gasto compartido: validaciones de create_transaction (US-34, 018 a 029) | 13 | 12 | 0 | 0 | 1 | 0 |
| DEU-B · Listado, filtro por estado y acceso (US-37 y US-38, 100 a 108C) | 12 | 12 | 0 | 0 | 0 | 0 |
| DEU-C · Saldar, volver a pendiente y filtro por dirección (US-39, US-40 y US-79, 109 a 127C) | 28 | 28 | 0 | 0 | 0 | 0 |
| DEU-D · Compartir con varias personas (US-82, 128 a 142B) | 33 | 0 | 0 | 0 | 33 | 0 |
| DEU-E · Neto de reembolsos en el Resumen (US-30, 143 a 150) | 9 | 8 | 0 | 1 | 0 | 0 |
| DEU-F · Deudas sueltas en el balance del mes (US-83, 151 a 159) | 10 | 0 | 0 | 1 | 9 | 0 |
| NAV-69 · Barra de navegación (US-69) | 49 | 49 | 0 | 0 | 0 | 0 |
| NAV-70 · Aviso de guardado y reintento (US-70) | 36 | 34 | 1 | 0 | 0 | 1 |
| EXP · Exportar CSV (US-47, 001 a 075) | 75 | 69 | 4 | 2 | 0 | 0 |
| IMP · Importar Excel (US-74 a US-81, 001 a 144) | 144 | 90 | 1 | 8 | 45 | 0 |
| SUS · Suscripciones (US-52 a US-63 y US-75, 001 a 158) | 158 | 147 | 11 | 0 | 0 | 0 |

| Prioridad | Casos | PASSED | FAILED | DUDA | BLOCKED | No ejecutados |
|---|---|---|---|---|---|---|
| Alta | 289 | 210 | 13 | 10 | 56 | 0 |
| Media | 254 | 217 | 3 | 2 | 31 | 1 |
| Baja | 24 | 22 | 1 | 0 | 1 | 0 |

| Tipo | Casos | PASSED | FAILED | DUDA | BLOCKED | No ejecutados |
|---|---|---|---|---|---|---|
| Positivo | 259 | 197 | 6 | 7 | 48 | 1 |
| Negativo | 213 | 172 | 11 | 3 | 27 | 0 |
| Límite | 95 | 80 | 0 | 2 | 13 | 0 |

| Técnica | Casos | PASSED | FAILED | DUDA | BLOCKED | No ejecutados |
|---|---|---|---|---|---|---|
| Partición de equivalencia | 249 | 193 | 12 | 7 | 37 | 0 |
| Tabla de decisión | 10 | 10 | 0 | 0 | 0 | 0 |
| Valores límite | 129 | 109 | 0 | 2 | 18 | 0 |
| Adivinación de errores | 24 | 23 | 0 | 0 | 1 | 0 |
| Caso de uso | 39 | 28 | 1 | 1 | 8 | 1 |
| Transición de estados | 114 | 85 | 4 | 2 | 23 | 0 |
| Prueba de rendimiento | 1 | 1 | 0 | 0 | 0 | 0 |
| Prueba de interfaz adaptable | 1 | 0 | 0 | 0 | 1 | 0 |

| Canal | Casos | PASSED | FAILED | DUDA | BLOCKED | No ejecutados |
|---|---|---|---|---|---|---|
| API | 120 | 92 | 11 | 1 | 16 | 0 |
| UI | 447 | 357 | 6 | 11 | 72 | 1 |

## 3. Quién ejecutó cada caso: con IA y sin IA

| Módulo | Casos | A mano por el equipo | Con IA (Claude Code, supervisado por Santiago) | Informados «ok» por el equipo, sin repetir |
|---|---|---|---|---|
| Deudas (DEU) | 105 | 12 (018 a 028 y 020B) | 93 | 0 |
| Navegación (NAV) | 85 | 40 | 44 (y 1 sin ejecutar: CP-NAV-060) | 0 |
| Exportar CSV (EXP) | 75 | 0 | 75 | 0 |
| Importar Excel (IMP) | 144 | 0 | 144 | 0 |
| Suscripciones (SUS) | 158 | 0 | 80 | 78 |
| **Total** | **567** | **52** | **436** | **78** |

Los casos de EXP, IMP y SUS que ejecutó la IA y el detalle de lo que se sustituyó (herramientas, oráculos y reloj) están en §6; los de SUS informados como «ok» por el equipo son los 78 que no figuran como ejecutados con IA (lista en `04-ejecucion`).

## 4. Defectos por severidad

| Severidad | Abiertos | IDs |
|---|---|---|
| Crítica | 0 | — |
| Alta | 0 | — |
| Media | 3 | DEF-030, DEF-031, DEF-032 |
| Baja | 5 | DEF-029, DEF-033, DEF-034, DEF-035, DEF-036 |
| **Total abiertos** | **8** | DEF-029, DEF-030, DEF-031, DEF-032, DEF-033, DEF-034, DEF-035, DEF-036 |

Detalle en `05-reportes-de-defectos`. Ninguno tiene issue todavía.

## 5. Criterios de salida (docs/07-plan-de-testing.md §6)

| Criterio | Estado | Detalle |
|---|---|---|
| 1. Cero defectos de severidad Crítica abiertos | Cumplido | No hay defectos críticos (los defectos abiertos son de severidad Media y Baja). |
| 2. Cero defectos de severidad Alta abiertos, o justificados por el PO | Cumplido | No hay defectos de severidad Alta. |
| 3. Todos los casos de prioridad Alta ejecutados | No cumplido | 233 de 289 casos de prioridad Alta ejecutados. No ejecutados: 56, todos BLOCKED (o sin ejecutar) porque dependen de funcionalidades todavía no implementadas: US-82 (issue #270) y US-83 (issue #271) en Deudas, US-80 (Cuotas pendientes) y US-81 (guía de Importar) en Importar Excel; más CP-NAV-060 (requiere un Pixel 7 con TalkBack). Se ejecutan en V3. |
| 4. Toda invariante del alcance con al menos un caso ejecutado | Parcial | Deudas y Navegación: I1, I10, I18, I2, I3, I4, I7, I9 con casos ejecutados; solo con casos sin ejecutar: I5. En Exportar, Importar y Suscripciones no se verificó invariante por invariante en este reporte. Las demás invariantes de V2 (dashboard, etc.) están en otros casos. |
| 5. Regresión de V1 ejecutada y defectos corregidos confirmados | No evaluado | Fuera del alcance de este reporte: la selección de regresión (03) y la confirmación de los defectos de V1 se informan aparte. |

**Conclusión:** con este alcance se cumplen los criterios 1 y 2 (no hay defectos críticos ni altos). El criterio 3 **no se cumple**: los casos de prioridad Alta bloqueados por funcionalidades inexistentes no se pueden ejecutar hasta que existan (quedan para V3). El 4 se cumple solo en parte porque el alcance es parcial, y el 5 (regresión de V1) se informa aparte.

## 6. Desvíos respecto de lo planificado

### Deudas y Navegación (ejecutado el 2026-10-25)

1. Alcance parcial de V2. Este reporte cubre CP-DEU-018 a 029 y CP-DEU-100 a 159 (Deudas) y CP-NAV-001 a 085 (Navegación): 190 casos. Los otros casos de Deudas (CP-DEU-001 a 017, 030 a 099) y los de Suscripciones, Export, Importar y Dashboard no están incluidos.
2. Tres formas de ejecutar. 40 casos de Navegación y los 12 de Deudas (018 a 028) los ejecutó Santiago a mano en el deploy de Vercel, con Chrome. Los otros 44 de Navegación, CP-DEU-029 y los 92 de Deudas del 100 en adelante los ejecutó Claude Code en el entorno local (Playwright, navegador integrado y pedidos directos a la API). La propiedad cruzada del plan (07-plan-de-testing §1) no se aplicó.
3. Deudas 018–028 se verificaron en la pantalla, no por API. Los casos están escritos como llamadas directas a create_transaction con varias personas (US-82), que todavía no existe (issue #270). Se ejecutó la prueba equivalente en Registrar («Gasto compartido») de cada caso gemelo; el resultado esperado de la pantalla es el mensaje de error y el botón «Guardar gasto» deshabilitado.
4. Funciones todavía no implementadas. US-82 (compartir con varias personas, issue #270) y US-83 (deudas sueltas en el balance del mes, issue #271) no existen en la app: quedan BLOCKED CP-DEU-029, los 33 casos CP-DEU-128 a 142B y los 9 casos CP-DEU-151 a 157 y 159 (43 en total). Se comprobó la ausencia de cada función (botones, respuesta de la API y Resumen) y no se les abrió defecto: dependen de historias pendientes.
5. CP-DEU-145 y CP-DEU-158 con dudas. En el 145 la preparación del caso pide 12 cuotas con la cuenta «Efectivo» y la app solo permite cuotas con tarjeta de crédito (se ejecutó con «Tarjeta de crédito»: el resultado es el esperado): parece un error del caso. El 158 se cumple, pero también se cumpliría sin US-83.
6. Preparación por API. En los casos CP-DEU-100 a 159 las deudas, gastos y tipos de cambio de la preparación se cargaron por API (create_debt, create_transaction, settle_debt, delete_transaction, upsert_fx_rate), como en los casos originales con PR-04; el formulario «Nueva deuda» no se ejercitó en esos casos.
7. CP-NAV-060 sin ejecutar: necesita un Pixel 7 con Android 15 y TalkBack en español.
8. CP-NAV-084 FAILED por una diferencia entre el caso y la implementación (204 sin cuerpo en vez de 200 con null). Parece un error del caso. No se corrigió nada: hay que decidir si cambia el caso o la función (DEF-029).
9. Adaptaciones de DevTools en las ejecuciones de Claude Code: el corte de red y el perfil de 20 s se aplicaron con el protocolo de Chrome (el mismo mecanismo de Network); en 013 a 017 se ocultó la barra de desplazamiento clásica del navegador integrado para imitar un celular. CP-NAV-041 usó una barrera en Node en lugar del script de PowerShell. CP-NAV-059 verifica la variante mensual equivalente (H-NAV-02).
10. Evidencia: no se adjuntaron capturas al repositorio; lo observado queda en «Resultado obtenido» de cada caso (04-ejecucion).

### Exportar CSV (EXP) (ejecutado el 2026-10-27)

1. **Ejecución asistida por un script.** El plan prevé ejecución manual por un integrante que no diseñó el caso. Acá los pasos los ejecutó Claude Code con Playwright, siguiendo cada caso como lo haría una persona y leyendo el archivo descargado como oráculo. La propiedad cruzada del plan (`docs/07-plan-de-testing.md` §1) no se aplicó: conviene que cada integrante revise la evidencia de su módulo.
2. **Entorno local, no el deploy.** Todo se ejecutó contra el código local y Supabase local; los resultados pueden diferir del deploy de Vercel si este está desactualizado. Solo Chromium: no se probó Firefox ni Safari.
3. **Reloj fijado.** El reloj del navegador se fijó en 09/10/2026 12:00 (America/Argentina/Buenos_Aires), como piden los casos CP-EXP-002 y 004 a 006. El reloj del servidor no se tocó.
4. **Preparación por API.** Las transacciones, el catálogo y las referencias de tipo de cambio se cargaron por API (EXP-PREP-01 a 06), no por las pantallas. Los casos 040 a 042 y 068 sembraron 1.000, 1.500 y 2.000 transacciones con un script de Node (8 pedidos en paralelo) en lugar del script de PowerShell 7 de EXP-PREP-07, que no está instalado.
5. **Herramientas sustituidas.** (a) Red lenta (049, 050, 064, 069 y 070): demora fija de 4 s (3 s en el 064) en la lectura de `/rest/v1/transactions`, en lugar de «1 kbit/s, 2000 ms» de DevTools. (b) Sin conexión (057 a 059): corte de red del contexto de Playwright. (c) HTTP 500 y monto inválido (073 y 074): ruta interceptada de Playwright en lugar del código pegado en la consola (EXP-PREP-08 y 09), con el mismo efecto sobre el `fetch`. (d) CP-EXP-068: el alta concurrente se hizo por API entre la primera y la segunda página de la lectura, no desde una segunda ventana de otro navegador. (e) CP-EXP-030 y 071: lector RFC 4180 propio en lugar de Google Sheets. (f) 062 y 070: clic fuera de la hoja en la posición (5, 5) de una ventana de 420 × 900.
6. **Cuotas (023 y 024).** La preparación pide PR-07; se creó la compra con `create_transaction` en una cuenta «Visa BBVA» de tipo tarjeta de crédito, porque la base solo admite cuotas con tarjeta de crédito.
7. **Bajas.** `delete_transaction` responde 204 sin cuerpo (ver DEF-029); el script lo toma como éxito en 017, 019, 056 y los demás casos que eliminan una transacción.
8. **Casos reescritos por errores del script, no del caso ni de la app.** Se rehicieron CP-EXP-017 (la baja responde 204), CP-EXP-023 y 024 (faltaba la tarjeta de crédito) y CP-EXP-062 a 066 (esperas y verificaciones insuficientes en la primera versión; CP-EXP-066 se ejecutó tecleando la URL de destino, como pide el caso). No se cambió el resultado de ningún caso a mano.
9. **Dependencias.** Para correr el import de Excel hubo que instalar `read-excel-file` y `write-excel-file` (estaban en `package.json` pero no en `node_modules`); no afecta a EXP.
10. **Evidencia.** No se adjuntaron capturas ni los scripts al repositorio; lo observado (nombre y tamaño del archivo, fila exportada, mensajes y estado final de la pantalla) queda en «Resultado obtenido» de cada caso. El contenido de los CSV tampoco se guardó.

### Importar Excel (IMP) (ejecutado el 2026-10-27)

1. **Ejecución asistida por un script.** El plan prevé ejecución manual por un integrante que no diseñó el caso. Acá los pasos los ejecutó Claude Code con Playwright (y llamadas directas a la API) siguiendo cada caso. La propiedad cruzada del plan (`docs/07-plan-de-testing.md` §1) no se aplicó: conviene que cada integrante revise los resultados de su módulo.
2. **Entorno local, no el deploy.** Todo se ejecutó contra el código local y Supabase local; los resultados pueden diferir del deploy de Vercel si este está desactualizado. Solo Chromium.
3. **Reloj fijado.** El reloj del navegador se fijó en 12/10/2026 12:00 (America/Argentina/Buenos_Aires) como piden los casos; el reloj del servidor no se tocó (es el real, 27/10/2026). El caso CP-IMP-117 pide además avanzar el reloj del dominio al 12/11/2026, que no se puede en el entorno.
4. **Archivos.** Los `.xlsx` se generaron con `write-excel-file` a partir de los datos de cada caso, no con Excel ni LibreOffice. Las fórmulas de CP-IMP-061 y 062 se guardaron como el valor calculado (celda numérica, sin fórmula). CP-IMP-005 usa un `.xlsx` renombrado `.xls`, soltado con el evento de arrastrar y soltar y no desde el Explorador. IMP-DATA-01 se armó fila por fila desde la tabla del documento (la columna «Cuotas pendientes» no existe en ese libro).
5. **Herramientas sustituidas.** (a) Sin conexión (083, 084, 086, 090 a 092, 143): corte de red del contexto de Playwright. (b) HTTP 401, 400 y 500 (087 a 089): respuesta simulada con una ruta de Playwright. (c) CP-IMP-083: identificador fijado redefiniendo `crypto.randomUUID` con el mismo valor que IMP-PREP-06. (d) CP-IMP-092: el aviso nativo de recarga se verificó con el evento `beforeunload` (cancelable) y el diálogo de Playwright. (e) CP-IMP-076: el cronómetro es el del script y corre en local (0,9 s), no en el deploy de Vercel.
6. **Criterio para BLOCKED.** Siguiendo la indicación de Santiago, un caso que no se puede ejecutar porque falta una funcionalidad o un botón queda BLOCKED para V3, aunque la pantalla permita recorrer parte de los pasos. Se verificó la ausencia en el código y en la pantalla (`installments_paid` no existe; `import-guide-open` no existe). Cuando el caso igual pasa sin la funcionalidad queda DUDA.
7. **Preparación por API.** Los casos que piden PR-04 se ejecutaron con el token del usuario de prueba. Los usuarios se crearon por API y la configuración inicial se salteó por pantalla.
8. **Dependencias.** Para correr el importador hubo que instalar `read-excel-file` y `write-excel-file` (estaban en `package.json` pero no en `node_modules`).
9. **Evidencia.** No se adjuntaron capturas ni los scripts al repositorio.

### Suscripciones (SUS) (ejecutado el 2026-10-27)

1. **Ejecución asistida por un script.** El plan prevé ejecución manual por un integrante que no diseñó el caso. Acá los pasos los ejecutó Claude Code con Playwright (y llamadas directas a la API) siguiendo cada caso. La propiedad cruzada del plan (`docs/07-plan-de-testing.md` §1) no se aplicó: conviene que cada integrante revise los resultados de su módulo.
2. **Entorno local, no el deploy.** Todo se ejecutó contra el código local y Supabase local; los resultados pueden diferir del deploy de Vercel si este está desactualizado. Solo Chromium.
3. **Fechas relativas.** Los casos usan fechas relativas a `<HOY>`. Se ejecutaron el 2026-10-27 (`<DIA_HOY>` = 27, que cumple la condición `<= 27`): `<MES_ACTUAL>` = 2026-10, `<MES_ANTERIOR>` = 2026-09, `<MES_HACE_2>` = 2026-08, `<MES_SIGUIENTE>` = 2026-11, `<MES_MAS_3>` = 2027-01, `<MES_HACE_25>` = 2024-09 y `<MES_MAS_13>` = 2027-11. El reloj del servidor es el real; no se pudieron cubrir los huecos que piden otro reloj.
4. **Pasos que no existen en la pantalla.** Varios casos nombran `data-testid` que no existen (por ejemplo `register-nav-subscriptions`, `transactions-period-select` o `dashboard-period-select`). Se navegó por la dirección (`/subscriptions`, `/transactions?period=…`, `/dashboard?period=…`) y se usaron los `data-testid` reales. Los casos CP-SUS-111, 112, 131, 132 y 137 no aclaran qué movimientos hay en Resumen: se usaron los de la preparación del caso.
5. **Puesta al día.** Para los casos que cargan la app y esperan la puesta al día (CP-SUS-077, 131, 139) se levantaron las Edge Functions locales (`supabase functions serve`).
6. **HTTP de los casos de API.** Los casos escriben HTTP 403 para el rol anónimo y 404 para la suscripción de otro usuario; la API responde 401 y 500 (DEF-035 y DEF-034). Se marcó FAILED cada uno, con el resultado exacto, para que el equipo decida si corrige el caso o la aplicación.
7. **Sin repetir los «ok» del equipo.** Los 78 casos informados como «ok» no se volvieron a ejecutar: su estado es el que informó el equipo.
8. **Los casos 153 a 157** («no especifica pasos correctamente», «no muestra ningún resumen») se ejecutaron con los datos y los pasos tal como están escritos, completando con los valores de la preparación del caso.
9. **Dependencias.** Se instalaron `read-excel-file` y `write-excel-file` en `node_modules` (no afecta a SUS).
10. **Evidencia.** No se adjuntaron capturas ni los scripts al repositorio.

## 7. Datos de prueba

Usuarios `qa+<id del caso>-001@example.com` con contraseña `Clave123!` y montos ficticios (C14), uno por caso. En el entorno local se borran con `supabase db reset`; en el deploy de Vercel quedan las cuentas de prueba creadas por la ejecución manual.

Exportar, Importar y Suscripciones: usuarios `qa+cp-<módulo>-<nnn>-001@example.com` (los de aislamiento, `-A` y `-B`) con contraseña `Clave123!` y montos ficticios (C14), en Supabase local; `supabase db reset` los borra. En producción no se creó nada.
