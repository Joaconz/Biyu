# Proyecto Biyu – Entrega 2 · Reporte de ejecución de casos de prueba (V2) · Suscripciones (SUS)

Planilla: `06-reporte-de-ejecucion-sus.xlsx` (hoja "Reporte de ejecución", mismo formato que el de la Entrega 1: ID, prioridad, título, historia, camino feliz, status y defectos, más el resumen). Formato del contenido: `docs/07-plan-de-testing.md` §6. Registro por caso en [`04-ejecucion-sus.md`](04-ejecucion-sus.md); defectos en [`05-reportes-de-defectos-sus.md`](05-reportes-de-defectos-sus.md).

| Dato | Valor |
|---|---|
| Versión probada | `main` en el commit `1c72d0f` (código local; los commits posteriores solo tocan documentos). No se probó el deploy de Vercel |
| Entorno | Local: Vite (http://127.0.0.1:5173) + Supabase local · main 1c72d0f · Chromium (Playwright 1.63), es-AR, America/Argentina/Buenos_Aires, reloj real (27/10/2026) y Edge Functions locales levantadas |
| Fecha | 2026-10-27 |
| Ejecutó | 80 casos: Claude Code (IA), supervisado por Santiago, con scripts de Playwright. 78 casos: el equipo (informados como «ok» por mensaje, sin repetir) |
| Evidencia | Lo observado en cada caso (mensajes, filas, respuestas de la API) figura en «Resultado obtenido» de `04-ejecucion-sus`. No se guardaron capturas ni los scripts en el repositorio |

## 1. Planificados, ejecutados, pasados, fallados y bloqueados

Status vigente de cada caso: el de su única ejecución (no hubo re-test).

| Métrica | Casos | % |
|---|---|---|
| Planificados | **158** | 100 % |
| Ejecutados (PASSED + FAILED + DUDA) | **158** | 100 % de avance |
| PASSED | **147** | 93 % de los ejecutados |
| FAILED | **11** | 7 % de los ejecutados |
| DUDA (pasa, con dudas) | **0** | 0 % de los ejecutados |
| BLOCKED | **0** | 0 % de los planificados |
| No ejecutados | 0 | — |

- **FAILED (11):** CP-SUS-094, 100, 107 y 129 (DEF-034: la API responde HTTP 500 con `P0002` donde el caso espera 404); CP-SUS-065, 066, 095, 101, 108 y 130 (DEF-035: sin sesión la API responde HTTP 401 donde el caso espera 403; el código 42501 coincide); CP-SUS-157 (DEF-036: la fila no bloqueada no tiene `data-blocked="false"`). Los tres defectos son de severidad Baja y DEF-035 y DEF-036 parecen errores de los casos.
- **Lo que sí se cumple:** las 26 validaciones de `create_subscription` (mensajes y códigos exactos), el aislamiento entre usuarios, el rechazo de `INSERT`, `DELETE` y `PATCH` directos, la puesta al día (idempotencia, estados pausada y cancelada, categoría y cuenta archivadas, USD sin tipo de cambio), pausar, reanudar, cancelar y editar por API, los avisos de catálogo vacío, el detalle de otro usuario, las ediciones y la eliminación y restauración de ocurrencias desde Movimientos y Resumen, la marca de suscripción y las cuatro vistas previas del calendario.
- **Equipo:** 78 casos los informó el equipo como «ok» y no se repitieron; su estado es el informado, sin detalle.

## 2. Cobertura por prioridad, tipo, técnica y canal

| Prioridad | Casos | PASSED | FAILED | DUDA | BLOCKED |
|---|---|---|---|---|---|
| Alta | 70 | 59 | 11 | 0 | 0 |
| Media | 78 | 78 | 0 | 0 | 0 |
| Baja | 10 | 10 | 0 | 0 | 0 |

| Tipo | Casos | PASSED | FAILED | DUDA | BLOCKED |
|---|---|---|---|---|---|
| Negativo | 78 | 68 | 10 | 0 | 0 |
| Positivo | 59 | 58 | 1 | 0 | 0 |
| Límite | 21 | 21 | 0 | 0 | 0 |

| Técnica | Casos | PASSED | FAILED | DUDA | BLOCKED |
|---|---|---|---|---|---|
| Partición de equivalencia | 80 | 69 | 11 | 0 | 0 |
| Análisis de valores límite | 49 | 49 | 0 | 0 | 0 |
| Transición de estados | 29 | 29 | 0 | 0 | 0 |

| Canal | Casos | PASSED | FAILED | DUDA | BLOCKED |
|---|---|---|---|---|---|
| API | 60 | 50 | 10 | 0 | 0 |
| UI | 98 | 97 | 1 | 0 | 0 |

Camino feliz: 13 casos. Negativos y de límite: 145 casos.

## 3. Quién ejecutó cada caso: con IA y sin IA

| Forma de ejecución | Casos | Cuáles |
|---|---:|---|
| **Con IA** (Claude Code, supervisado por Santiago) | **80** | CP-SUS-014 y 015, 017, 019, 021, 023, 025, 027, 029, 031 a 033, 035, 037, 039, 041, 043, 045, 047, 049, 051, 053, 055 a 061, 063 a 066, 068 y 069, 072 a 075, 077, 088, 091 a 095, 098 a 101, 104, 106 a 108, 110 a 112, 114 y 115, 117, 119 a 122, 124 a 126, 129 a 134, 137, 139, 153 a 157 |
| Sin IA (a mano por el equipo) | 78 | CP-SUS-001 a 013, 016, 018, 020, 022, 024, 026, 028, 030, 034, 036, 038, 040, 042, 044, 046, 048, 050, 052, 054, 062, 067, 070 y 071, 076, 078 a 087, 089 y 090, 096 y 097, 102 y 103, 105, 109, 113, 116, 118, 123, 127 y 128, 135 y 136, 138, 140 a 152, 158 |

Los 78 casos del equipo son los que informó como «ok» sin comentarios; no se repitieron. Los 80 casos con IA son los que el equipo marcó como «no sé cómo testearlos» o informó con una observación sobre el caso. En estos casos la IA tuvo que sustituir la forma de ejecución del caso (detalle en el punto 7): el equipo no sabía cómo hacerlos (la mayoría llama directo a la API) y se ejecutaron con scripts.

## 4. Trazabilidad

Los 158 casos cubren US-52 a US-63 y US-75 (matriz en `casos/sus.md`). Con este reporte todos los casos tienen resultado. Los huecos que el propio documento marca (H-SUS-01 a H-SUS-06: corte de red, reloj fijo, año bisiesto 2028, carga de 50 suscripciones) no tienen caso y no se ejecutaron.

## 5. Defectos por severidad

Detalle completo en `05-reportes-de-defectos-sus`.

| Severidad | Abiertos | IDs |
|---|---|---|
| Crítica | 0 | — |
| Alta | 0 | — |
| Media | 0 | — |
| Baja | 3 | DEF-034, DEF-035, DEF-036 |
| **Total abiertos** | **3** | DEF-034, DEF-035, DEF-036 |

Ninguno tiene issue todavía.

## 6. Criterios de salida (docs/07-plan-de-testing.md §6)

| Criterio | Estado |
|---|---|
| 1. Cero defectos de severidad Crítica abiertos | ✅ Cumplido |
| 2. Cero defectos de severidad Alta abiertos, o justificados por el PO | ✅ Cumplido |
| 3. Todos los casos de prioridad Alta ejecutados | ✅ Cumplido: 70 de 70 |
| 4. Toda invariante del alcance con al menos un caso ejecutado | Parcial: las de este módulo sí; las demás de V2 van en otros módulos |

**Conclusión:** SUS cumple los criterios 1, 2 y 3: no hay casos BLOCKED y los de prioridad Alta tienen resultado. Hay tres defectos Bajos abiertos (DEF-034 a DEF-036); dos de ellos parecen errores de los casos. Hay que decidir si se corrigen los casos (HTTP 401 y atributo `data-blocked`) o la aplicación (HTTP 404 para la suscripción de otro usuario).

## 7. Desvíos respecto de lo planificado

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

## 8. Datos de prueba

Todo en Supabase **local**, con usuarios `qa+cp-sus-<nnn>-001@example.com` (los de aislamiento, `-A` y `-B`) y montos ficticios. `supabase db reset` los borra. En producción no se creó nada. La contraseña de prueba es `Clave123!` y solo existe en la base local.
