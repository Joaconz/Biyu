# Entrega 2 · Reporte de ejecución de casos de prueba (V2) · Deudas, Navegación, Exportar CSV, Importar Excel, Suscripciones y Resumen por categoría, y regresión de V1

Planilla: `06-reporte-de-ejecucion.xlsx` (mismo formato que la Entrega 1: ID, prioridad, título, historia, camino feliz, status y defectos, más el resumen y los criterios de salida). Gráficos de los porcentajes: [`graficos/resultados-por-entrega.svg`](graficos/resultados-por-entrega.svg) y [`graficos/resultados-v2-por-modulo.svg`](graficos/resultados-v2-por-modulo.svg). Formato del contenido: `docs/07-plan-de-testing.md` §6. Registro por caso en [`04-ejecucion.md`](04-ejecucion.md); defectos en [`05-reportes-de-defectos.md`](05-reportes-de-defectos.md).

| Dato | Deudas y Navegación | Exportar CSV, Importar Excel y Suscripciones | Regresión de V1 |
|---|---|---|---|
| Versión probada | Ejecución manual: deploy de Vercel (https://biyu-rust.vercel.app). Ejecución de Claude Code: main en f096e22 (local, con todas las migraciones hasta 20261012000000). | `main` en `1c72d0f` (local; los commits posteriores solo tocan documentos). No se probó el deploy de Vercel. | `main` en `109007a` (local, con las 24 migraciones hasta `20261012000000`). No se probó el deploy de Vercel. |
| Entorno | Manual: Google Chrome contra el deploy. Claude Code: Vite local (127.0.0.1:5173) + Supabase local; Chromium (Playwright 1.63) y navegador integrado; pedidos directos a la API con el token del usuario de prueba. | Vite local (127.0.0.1:5173) + Supabase local (y Edge Functions locales en SUS); Chromium (Playwright 1.63), es-AR, America/Argentina/Buenos_Aires. Reloj del navegador fijado en 09/10/2026 (EXP) y 12/10/2026 (IMP); reloj real en SUS. | Vite local (localhost:5173) + Supabase local reiniciado con `supabase/config.toml`; Chromium (Playwright) emulando un celular de 390 × 844 px, es-AR, America/Argentina/Buenos_Aires; reloj real, salvo CP-REG-013 (15/10/2026, como en V1). |
| Fecha | 2026-10-25 | 2026-10-27 | 2026-10-28 |
| Ejecutó | Santiago (a mano: Deudas CP-DEU-005 a 010 y 15 casos de Navegación) y Claude Code, supervisado por Santiago (el resto). | Claude Code (IA), supervisado por Santiago: EXP (31), IMP (41), 27 casos de SUS y 24 casos de Deudas (CP-DEU-015 a 035 y los 8 pendientes: 001 a 004, 011 a 013 y 025) y los 6 de Resumen por categoría. El equipo: 21 casos de SUS, informados como «ok» por mensaje. | Claude Code (IA), supervisado por Joaquín: los 60 casos de V1 seleccionados en `03-seleccion-regresion`. Repaso manual de los 39 de prioridad Alta por el equipo: pendiente. |
| Datos | Usuarios qa+<id del caso>-001@example.com y montos ficticios, uno por caso; en local se pueden borrar con «supabase db reset». | Igual: usuarios `qa+cp-<módulo>-<nnn>-001@example.com` (con un sufijo de corrida) y montos ficticios. | Usuarios `qa+reg-<caso o grupo>-<corrida>@example.com` y montos ficticios; se borraron de la base local al terminar. |

## 1. Planificados, ejecutados, pasados, fallados y bloqueados

Catálogo recortado el 2026-10-27: de 672 a **206 casos** (se quitaron los que repetían una regla con otro valor, los de funciones todavía no implementadas y los de ancho de pantalla o testids repetidos). Ese día se sumaron además **6 casos de Resumen por categoría** (CAT, US-72 y US-73), que no tenían ninguno: 212 en total. Los números de este reporte son los **203 casos que tienen resultado**; los 9 de Deudas restantes (CP-DEU-014, 018, 020, 021, 022, 036, 037, 038 y 039) no figuran porque el equipo los informó como «OK» y no se repitieron.

| Métrica | Casos | % |
|---|---|---|
| Planificados | 203 | 100 % |
| Ejecutados (PASSED + FAILED + DUDA) | 199 | 98 % de avance |
| PASSED | 189 | 95 % de los ejecutados |
| FAILED | 9 | 5 % de los ejecutados |
| DUDA (pasa, con dudas) | 1 | 1 % de los ejecutados |
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

- **PASSED (5):** CP-DEU-001, 003 y 011 (después de corregir los casos), CP-DEU-004 (falta «¿Cuánto te debe?») y CP-DEU-012 (deuda un centavo mayor que el gasto).
- **FAILED (1):** CP-DEU-025 (DEF-037): el primer clic en «US$» de «Nueva deuda» se pierde y el campo «Tipo de cambio» no aparece; con un segundo clic el resto se cumple (mensaje «El tipo de cambio debe ser mayor a cero»).
- **DUDA (1):** CP-DEU-002 se cumple (12 cuotas de $10.000,00 y 1 deuda de Sofía por $60.000,00 vinculada, con 1 sola llamada y ninguna a /debts), pero el pedido usa p_shared_person y p_shared_amount en lugar de los arreglos que pide el paso 15, porque US-82 no existe.
- **BLOCKED (1):** CP-DEU-013 (por API, deuda mayor que el gasto): con p_shared_persons y p_shared_amounts responde 404 PGRST202 porque US-82 (issue #270) no existe; con una sola persona responde 400, code 23514 y «I7: la deuda no puede superar el monto del gasto», sin dejar filas.
- **Casos corregidos:** en la primera corrida CP-DEU-001, 003 y 011 quedaron en DUDA por pasos que faltaban o estaban mal ordenados; se corrigieron en casos/deu.md y se volvieron a ejecutar (ver el último apartado de Deudas).

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

**Resumen por categoría (CAT) (6 casos, ejecutados con IA el 2026-10-27):**

- **PASSED (6):** la torta con una porción por categoría (CP-CAT-001), sin ingresos ni gastos eliminados (CP-CAT-002) y con «Resto» a partir de 7 categorías (CP-CAT-003); el detalle de una categoría (CP-CAT-004), su navegación por mes y hacia el Resumen (CP-CAT-005) y el aviso de una categoría que no existe (CP-CAT-006).
- US-84 (editar un movimiento) no tiene casos porque la función todavía no existe en la aplicación.

**Confirmación de defectos de V1 (22 defectos, ejecutada el 2026-10-28; no suma a los casos de arriba):**

- **Confirmados corregidos en V2 (18):** DEF-005, DEF-006, DEF-007, DEF-008, DEF-009, DEF-010, DEF-011, DEF-012, DEF-013, DEF-014, DEF-015, DEF-016, DEF-018, DEF-019, DEF-020, DEF-024, DEF-025, DEF-026. Cada uno se repitió con los pasos de su reporte y el comportamiento es el esperado (detalle en `03-seleccion-regresion`, sección 5). DEF-005 se repitió el 2026-10-28 después de reiniciar Supabase local con la configuración del repositorio, y a DEF-026 se le completó el paso «Tus categorías» de la configuración inicial, que la primera confirmación no había revisado.
- **Confirmados en parte (3):** DEF-021 (se probó en WebKit con el viewport de un iPhone 13, no en un iPhone real), DEF-027 (el límite de altas se simuló con una respuesta 429) y DEF-028 (la siembra lenta se simuló con demoras). El comportamiento corregido se ve, pero no en las condiciones del reporte original.
- **No concluyente (1):** DEF-023 (la pantalla en blanco después de crear la cuenta). El defecto era intermitente; en 16 altas (8 en Chromium y 8 en WebKit) no se reprodujo, pero no alcanzan para descartarlo. El equipo decidió cerrarlo igual; se reabre si reaparece.

**Regresión de V1 (60 casos, ejecutada el 2026-10-28; no suma a los casos de arriba):**

| Métrica | Casos | % |
|---|---|---|
| Planificados (seleccionados en `03`) | 60 | 100 % |
| Ejecutados | 60 | 100 % de avance |
| PASSED | 60 | 100 % de los ejecutados |
| FAILED | 0 | 0 % |
| BLOCKED | 0 | 0 % |
| No ejecutados | 0 | — |

- **PASSED (60):** lo que funcionaba en V1 sigue funcionando en V2 en Acceso (9), Configuración (11), Registro (13), Cuotas (12), Monedas (6) y Resumen (9), incluidas las variantes API y los pares de autorización (otro usuario → 0 filas, rol anon → 42501).
- **Los dos casos que fallaron en V1 pasan:** CP-ACC-004 (la API rechaza `abcd1234` con HTTP 422 weak_password, DEF-005) y CP-CFG-004 (el movimiento de una categoría archivada lleva la marca «archivada», DEF-006).
- **Casos que cambiaron de estado respecto de la Entrega 1:** CP-ACC-004 y CP-CFG-004 (FAILED → PASSED). Los otros 58 siguen PASSED.
- **Selección ampliada:** se sumaron CP-CFG-005 y CP-CFG-013 (regla 3, por los fixes de DEF-019 y DEF-026, que tocaron Configuración; `03` §6). Los dos pasan.
- **Defectos nuevos:** ninguno. Detalle por caso en `04-ejecucion`, apartado «Regresión de V1»; resultado crudo en `ejecucion/regresion-v1-resultados.json`.
- **Repaso manual:** pendiente (0 de 39 casos de prioridad Alta).

## 2. Cobertura por módulo, prioridad, tipo, técnica y canal

| Módulo | Casos | PASSED | FAILED | DUDA | BLOCKED | No ejecutados |
|---|---|---|---|---|---|---|
| DEU-H · Gasto compartido con una persona y tope de la deuda (US-34, US-36 y US-41; CP-DEU-001 a 004, 011 a 013 y 025; 8 casos ejecutados con IA) | 8 | 5 | 1 | 1 | 1 | 0 |
| DEU-A · Gasto compartido: validaciones de create_transaction (US-34, CP-DEU-005 a 010) | 6 | 6 | 0 | 0 | 0 | 0 |
| DEU-B · Listado, filtro por estado y acceso (US-37 y US-38, CP-DEU-040 a 045) | 6 | 6 | 0 | 0 | 0 | 0 |
| DEU-C · Saldar, volver a pendiente y filtro por dirección (US-39, US-40 y US-79, CP-DEU-046 a 054) | 9 | 9 | 0 | 0 | 0 | 0 |
| DEU-D · Compartir con varias personas (US-82, CP-DEU-055, 056 y 057) | 3 | 0 | 0 | 0 | 3 | 0 |
| DEU-E · Neto de reembolsos en el Resumen (US-30, CP-DEU-058 a 061) | 4 | 4 | 0 | 0 | 0 | 0 |
| DEU-G · Lectura y baja de gastos compartidos, alta de deuda suelta y create_debt por API (US-35, US-36 y US-41; CP-DEU-015 a 035, 16 casos ejecutados con IA) | 16 | 15 | 1 | 0 | 0 | 0 |
| NAV-69 · Barra de navegación (US-69) | 10 | 10 | 0 | 0 | 0 | 0 |
| NAV-70 · Aviso de guardado y reintento (US-70) | 15 | 15 | 0 | 0 | 0 | 0 |
| EXP · Exportar CSV (US-47, 31 casos) | 31 | 28 | 3 | 0 | 0 | 0 |
| IMP · Importar Excel (US-74, US-76, US-77 y US-78, 41 casos) | 41 | 40 | 1 | 0 | 0 | 0 |
| SUS · Suscripciones (US-52 a US-63 y US-75, 48 casos) | 48 | 45 | 3 | 0 | 0 | 0 |
| CAT · Resumen por categoría (US-72 y US-73, 6 casos) | 6 | 6 | 0 | 0 | 0 | 0 |

| Prioridad | Casos | PASSED | FAILED | DUDA | BLOCKED | No ejecutados |
|---|---|---|---|---|---|---|
| Alta | 129 | 118 | 6 | 1 | 4 | 0 |
| Media | 70 | 68 | 2 | 0 | 0 | 0 |
| Baja | 4 | 3 | 1 | 0 | 0 | 0 |

| Tipo | Casos | PASSED | FAILED | DUDA | BLOCKED | No ejecutados |
|---|---|---|---|---|---|---|
| Positivo | 86 | 80 | 4 | 1 | 1 | 0 |
| Negativo | 83 | 80 | 3 | 0 | 0 | 0 |
| Límite | 34 | 29 | 2 | 0 | 3 | 0 |

| Técnica | Casos | PASSED | FAILED | DUDA | BLOCKED | No ejecutados |
|---|---|---|---|---|---|---|
| Partición de equivalencia | 89 | 85 | 4 | 0 | 0 | 0 |
| Tabla de decisión | 4 | 4 | 0 | 0 | 0 | 0 |
| Valores límite | 41 | 36 | 2 | 0 | 3 | 0 |
| Adivinación de errores | 17 | 17 | 0 | 0 | 0 | 0 |
| Caso de uso | 16 | 13 | 1 | 1 | 1 | 0 |
| Transición de estados | 35 | 33 | 2 | 0 | 0 | 0 |
| Prueba de rendimiento | 1 | 1 | 0 | 0 | 0 | 0 |

| Canal | Casos | PASSED | FAILED | DUDA | BLOCKED | No ejecutados |
|---|---|---|---|---|---|---|
| API | 52 | 48 | 2 | 0 | 2 | 0 |
| UI | 151 | 141 | 7 | 1 | 2 | 0 |

**Regresión de V1 (60 casos):**

| Módulo de V1 | Casos | PASSED | FAILED | BLOCKED | No ejecutados |
|---|---|---|---|---|---|
| ACC · Acceso y autorización | 9 | 9 | 0 | 0 | 0 |
| CFG · Configuración | 11 | 11 | 0 | 0 | 0 |
| REG · Registro y baja | 13 | 13 | 0 | 0 | 0 |
| CUO · Cuotas | 12 | 12 | 0 | 0 | 0 |
| MON · Monedas | 6 | 6 | 0 | 0 | 0 |
| DAS · Resumen | 9 | 9 | 0 | 0 | 0 |

| Prioridad | Casos | PASSED | FAILED | BLOCKED | No ejecutados |
|---|---|---|---|---|---|
| Alta | 39 | 39 | 0 | 0 | 0 |
| Media | 20 | 20 | 0 | 0 | 0 |
| Baja | 1 | 1 | 0 | 0 | 0 |

## 3. Quién ejecutó cada caso: con IA y sin IA

| Módulo | Casos | A mano por el equipo | Con IA (Claude Code, supervisado por Santiago) | Informados «ok» por el equipo, sin repetir |
|---|---|---|---|---|
| Deudas (DEU) | 52 | 6 (CP-DEU-005, 006, 007, 008, 009 y 010) | 46 | 0 |
| Navegación (NAV) | 25 | 15 | 10 | 0 |
| Exportar CSV (EXP) | 31 | 0 | 31 | 0 |
| Importar Excel (IMP) | 41 | 0 | 41 | 0 |
| Suscripciones (SUS) | 48 | 0 | 27 | 21 |
| Resumen por categoría (CAT) | 6 | 0 | 6 | 0 |
| **Total** | **203** | **21** | **161** | **21** |

Los casos de EXP, IMP y SUS que ejecutó la IA y el detalle de lo que se sustituyó (herramientas, oráculos y reloj) están en §6; los de SUS informados como «ok» por el equipo son los 21 que no figuran como ejecutados con IA (lista en `04-ejecucion`).

La regresión de V1 (60 casos, aparte de los 203) la ejecutó entera Claude Code (IA), supervisado por Joaquín: 0 a mano y 60 con IA. El repaso manual de los 39 casos de prioridad Alta por el equipo (hoja «Repaso manual (Alta)» de `04-ejecucion.xlsx`) está pendiente.

## 4. Defectos por severidad

| Severidad | Abiertos | IDs |
|---|---|---|
| Crítica | 0 | — |
| Alta | 0 | — |
| Media | 4 | DEF-030, DEF-031, DEF-032, DEF-037 |
| Baja | 4 | DEF-033, DEF-034, DEF-035, DEF-036 |
| **Total abiertos** | **8** | DEF-030, DEF-031, DEF-032, DEF-033, DEF-034, DEF-035, DEF-036, DEF-037 |

Detalle en `05-reportes-de-defectos`. Ninguno tiene issue todavía. La regresión de V1 no encontró defectos nuevos.

## 5. Criterios de salida (docs/07-plan-de-testing.md §6)

| Criterio | Estado | Detalle |
|---|---|---|
| 1. Cero defectos de severidad Crítica abiertos | Cumplido | No hay defectos críticos (los defectos abiertos son de severidad Media y Baja). |
| 2. Cero defectos de severidad Alta abiertos, o justificados por el PO | Cumplido | No hay defectos de severidad Alta. |
| 3. Todos los casos de prioridad Alta ejecutados | No cumplido | 125 de 129 casos de prioridad Alta de V2 ejecutados. No ejecutados: 4, todos BLOCKED porque dependen de una funcionalidad todavía no implementada: US-82 (issue #270), CP-DEU-055, 056, 057 y CP-DEU-013. Se ejecutan en V3. En la regresión de V1 se ejecutaron los 39 casos de prioridad Alta (39 PASSED, con IA; el repaso manual está pendiente). |
| 4. Toda invariante del alcance con al menos un caso ejecutado | Parcial | Deudas y Navegación: I10, I18, I2, I3, I4, I5, I7 e I9 con casos ejecutados. I1 e I1' se ejecutaron en la regresión de V1 (CP-CUO-004, 005, 010 y 013, y CP-REG-015: PASSED). En Exportar, Importar y Suscripciones no se verificó invariante por invariante en este reporte. Las demás invariantes de V2 (dashboard, etc.) están en otros casos. |
| 5. Regresión de V1 ejecutada y defectos corregidos confirmados | Cumplido, con salvedades | Confirmación de defectos de V1 ejecutada el 2026-10-28: 18 confirmados corregidos en V2, 3 confirmados en parte (DEF-021, DEF-027 y DEF-028) y 1 no concluyente (DEF-023, de severidad Alta, cerrado por decisión del equipo; se reabre si reaparece). Regresión de los 60 casos de V1 seleccionados (`03`) ejecutada el 2026-10-28 con IA: 60 PASSED, sin defectos nuevos. Salvedades: todo se verificó en local (DEF-005 depende de la configuración de Auth del proyecto hosteado, que no se verificó) y el repaso manual de los 39 casos de prioridad Alta está pendiente. |

**Conclusión:** con este alcance se cumplen los criterios 1 y 2 (no hay defectos críticos ni altos) y el 5 con salvedades (la regresión de V1 pasó entera; de los defectos de V1, 18 están confirmados, 3 confirmados en parte y DEF-023 se cerró sin confirmar; falta el repaso manual). El criterio 3 **no se cumple**: los cuatro casos de prioridad Alta bloqueados por una funcionalidad inexistente (US-82) no se pueden ejecutar hasta que exista (quedan para V3). El 4 se cumple solo en parte porque el alcance es parcial.

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
2. Usuarios `qa+cp-deu-<id>-001@example.com`, uno por caso. Los intentos anteriores del script (que fallaron por selectores) y la primera corrida de los casos 001, 003 y 011 crearon usuarios con ese email: se borraron de la base local antes de cada corrida final.
3. En la primera corrida, CP-DEU-001, 003 y 011 no pedían elegir una cuenta, pero sin cuenta «Guardar gasto» queda deshabilitado («Completá cuenta para guardar»), y el 003 fijaba el tipo de cambio antes de cambiar la fecha a otro mes (la app lo descarta a propósito al cambiar de mes y en el paso 3 de 3 no hay dónde volver a escribirlo): quedaron en DUDA. El mismo día se corrigieron los tres casos en `casos/deu.md` (paso de elegir «Efectivo» y, en el 003, volver al paso 1 para cargar de nuevo el tipo de cambio) y se volvieron a ejecutar con los pasos corregidos: PASSED.
4. CP-DEU-002: la categoría «Tecnología» se creó por pantalla desde Ajustes (el caso pide crearla por API con PR-04). La consulta final de la base (transactions, ledger_entries y debts) se hizo por API con el token del usuario. Los parámetros del pedido son los de una sola persona porque la función de varias personas (US-82) no existe.
5. CP-DEU-013 se ejecutó como está escrito y quedó BLOCKED; además se probó la variante con una sola persona (p_shared_person y p_shared_amount), que da el rechazo esperado.
6. CP-DEU-025 reproduce DEF-037 (el primer clic en «US$» se pierde).
7. No se adjuntaron capturas ni los scripts; lo observado queda en «Resultado obtenido» de cada caso (04-ejecucion).

### Resumen por categoría (CAT) (ejecutado el 2026-10-27)

1. Ejecución con scripts de Playwright (Chromium emulando un celular de 375 × 812 px, es-AR, hora de Argentina), no a mano; la propiedad cruzada del plan no se aplicó. Entorno local (Vite + Supabase local), sobre `main` en `15e3c4b`, reloj real (27/10/2026); no se probó el deploy de Vercel.
2. Usuarios `qa+cp-cat-<nnn>-001@example.com`, uno por caso. Una primera corrida falló en tres casos por una diferencia de mayúsculas en el nombre del mes («Septiembre 2026» en pantalla, «septiembre 2026» en el caso) y en el 006 por esperar un total que no existe en un Resumen vacío; se corrigieron el texto de los casos y la espera del script, se borraron los usuarios de esa corrida y se volvió a ejecutar.
3. Los movimientos de cada caso se cargaron por la API (`create_transaction`, y `delete_transaction` en el 002), como piden los casos; el resto se hizo por pantalla.
4. CP-CAT-003: la porción «Resto» no tiene un rótulo visible; se verificó en sus atributos (`data-amount`, `data-percentage` y `data-count`), como dice el caso.
5. No se adjuntaron capturas ni los scripts; lo observado queda en «Resultado obtenido» de cada caso (04-ejecucion).

### Confirmación de defectos de V1 (ejecutada el 2026-10-28)

1. Ejecución con scripts de Playwright (Chromium emulando un celular de 375 × 812 px, es-AR; WebKit para DEF-023) y llamadas directas a la API, no a mano; la propiedad cruzada del plan no se aplicó. Entorno local (Vite + Supabase local), sobre `main` en `ee62a2d`, reloj real; no se probó el deploy de Vercel. Un usuario nuevo por defecto (`qa+v1-def<nnn>-001@example.com`), borrados al terminar.
2. DEF-005 se verificó contra la política de contraseñas de Supabase local; en el proyecto hosteado la configuración puede ser otra. Se repitió el 2026-10-28 después de reiniciar Supabase local con la configuración del repositorio (ver la regresión, punto 3).
3. DEF-021 se verificó en Chromium a 390 px de ancho y, el 2026-10-28, en WebKit (el motor de Safari) con el viewport de iPhone 13; el defecto original era de un iPhone con Safari, y falta probarlo en uno real: queda «Confirmado parcial».
4. DEF-023 es intermitente: 16 altas sin falla (8 en Chromium y 8 en WebKit) no lo descartan; queda como no concluyente y el equipo decidió cerrarlo igual (se reabre si reaparece).
5. DEF-026: se comprobó Registrar y Ajustes; el paso «Tus categorías» de la configuración inicial, que la primera confirmación no recorrió, se completó el 2026-10-28.
6. DEF-027 y DEF-028 se simularon: el límite de altas con una respuesta 429 interceptada y la siembra lenta con demoras de 4 s (cuentas) y 1,5 s (categorías).
7. No se adjuntaron capturas ni los scripts; la evidencia de cada defecto está en `03-seleccion-regresion` (sección 5).

### Regresión de V1 (ejecutada el 2026-10-28)

1. **Ejecución con script, no a mano.** Los 60 casos los ejecutó Claude Code con el script de la ejecución de V1 (`entrega-1/ejecucion/`), copiado fuera del repositorio y adaptado a V2; la propiedad cruzada del plan (`docs/07-plan-de-testing.md` §1) no se aplicó. Entorno local (Vite + Supabase local), sobre `main` en `109007a`, solo Chromium emulando un celular; no se probó el deploy de Vercel.
2. **Adaptaciones del script a V2.** Salvo en CP-CFG-008, cambian cómo se llega y no lo que se verifica: CP-ACC-003 saltea los 4 pasos de la configuración inicial antes de llegar a Registrar, como dice el caso (el script de V1 es anterior a US-68); en CP-CFG-008 la cuenta nueva abre /setup en las dos pestañas, no el formulario de Registrar que dice el paso 1, y se contó la siembra igual (es el único caso cuyo resultado esperado cambió en V2: `03` §6); CP-REG-012 busca el gasto borrado en Movimientos → «Eliminados» (FR-08, corregido por DEF-007); CP-DAS-004 lee las filas de la lista de categorías, que en V2 son enlaces al detalle (US-73); CP-MON-003 espera a que llegue el tipo de cambio sugerido; CP-CFG-004 acepta `true` como valor booleano de la base. Además, en la cuarta corrida el script verifica dos pasos que el de V1 no miraba: el aviso «Transacción eliminada» de CP-REG-012 y, en CP-CFG-013, las 8 categorías tildadas y que «Educación» desaparezca de la lista.
3. **Supabase local con una configuración vieja.** La primera corrida encontró la API de Auth aceptando `abcd1234` (CP-ACC-004): el stack local estaba levantado con una configuración anterior (mínimo 6 caracteres, sin requisitos). Se reinició Supabase con la configuración del repositorio (`supabase/config.toml`: 8 caracteres, mayúscula, minúscula, número y símbolo; los datos se conservaron) y se repitió: HTTP 422 weak_password. En el proyecto hosteado la configuración de Auth puede ser otra y no se verificó.
4. **Cuatro corridas completas.** No se cambió a mano el resultado de ningún caso; el resultado crudo de la cuarta está en `ejecucion/regresion-v1-resultados.json`.
   - **Primera (58 casos):** 51 PASSED, 4 FAILED y 3 errores, ninguno de la aplicación. CP-ACC-003 FAILED porque el script esperaba Registrar después del alta y la app abre la configuración inicial, como dice el caso. CP-ACC-008 y CP-ACC-009 dieron error porque dependen del usuario de CP-ACC-003. CP-ACC-004 FAILED por la configuración vieja de Supabase (punto 3). CP-CFG-004 FAILED porque el script comparaba el booleano con `t` y la base devuelve `true` (en la pantalla y en la base estaba todo bien). CP-CFG-008 dio error porque esperaba el formulario de Registrar. CP-DAS-004 FAILED porque el script no encontraba las filas de la lista, que en V2 tienen otro marcado.
   - **Segunda (58 casos):** 57 PASSED y 1 FAILED. CP-MON-003 falló porque el script leyó el tipo de cambio antes de que llegara la sugerencia, que aparece unos 10 ms después de tocar «US$»; repetido dos veces aparte: PASSED.
   - **Tercera (58 casos):** 58 PASSED.
   - **Cuarta (60 casos, la que vale):** con la selección ampliada (CP-CFG-005 y CP-CFG-013) y las dos verificaciones que se sumaron (punto 2): 60 PASSED.
5. **Preparación por API y casos encadenados.** Como en V1, los usuarios que son datos de otros casos se crearon por la API de Auth con la configuración inicial marcada como hecha, y los movimientos de la preparación (Resumen, cuotas de agosto, «Cine» de CP-CFG-004) se cargaron con `create_transaction`; los pasos de cada caso se hicieron por pantalla, y las variantes API, por API. Algunos casos usan datos de otro, como en V1: CP-ACC-005, 008 y 009 usan la cuenta de CP-ACC-003 (el caso CP-ACC-005 lo pide); CP-CFG-005 usa la «Salidas» archivada de CP-REG-005; CP-MON-001 se ejecuta como la fila 3 de CP-MON-002; y CP-CUO-004 usa la compra de CP-CUO-001 (mismo monto y cuotas, otra categoría) en lugar de registrar la suya.
6. **Fechas.** Los casos que dependen de «hoy» usaron la fecha real (28/10/2026); CP-REG-013 fija el reloj del navegador en 15/10/2026 con Playwright, como en V1.
7. **pgTAP.** `supabase test db` corrió en la misma sesión: `rls_isolation.test.sql` (el par de autorización de CP-ACC-011, CP-REG-014, CP-CUO-011, CP-MON-007 y CP-DAS-011) pasa. Fallan 2 de 164 pruebas de `update_subscription.test.sql` («ningún rechazo creó ni cambió transacciones»), que es de Suscripciones (V2) y no forma parte de esta regresión; queda para que el equipo lo revise, sin defecto abierto.
8. **Repaso manual pendiente.** La consigna pide ejecución manual. Para cubrirlo, el equipo re-confirma a mano los 39 casos de prioridad Alta con la hoja «Repaso manual (Alta)» de `04-ejecucion.xlsx`, con los pasos de la especificación de V1 y el resultado de Claude al lado para comparar. Hasta que esté completa, la regresión cuenta como ejecutada con IA; si un repaso no coincide, se repite el caso y, si se confirma, se abre un defecto.
9. **Evidencia.** Se adjunta el resultado crudo de la cuarta corrida (`ejecucion/regresion-v1-resultados.json`: estado, lo observado y la duración de cada caso). No se adjuntaron capturas ni los scripts; lo observado queda en «Resultado obtenido» de cada caso (`04-ejecucion`, apartado «Regresión de V1», y la hoja de cada caso en `04-ejecucion.xlsx`).

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

Regresión de V1: usuarios `qa+reg-<caso o grupo>-<corrida>@example.com` con contraseña `Prueba-Biyu-2026!` (los que se dan de alta por pantalla, `Clave123!`) y montos ficticios (C14), en Supabase local: son contraseñas de prueba que no existen en ningún otro entorno. Se borraron al terminar. En producción no se creó nada.
