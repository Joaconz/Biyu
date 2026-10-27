# Proyecto Biyu – Entrega 2 · Reporte de ejecución de casos de prueba (V2) · Exportar CSV (EXP)

Planilla: `06-reporte-de-ejecucion-exp.xlsx` (hoja "Reporte de ejecución - EXP E2", mismo formato que el de la Entrega 1: ID, prioridad, título, historia, camino feliz, status y defectos, más el resumen). Formato del contenido: `docs/07-plan-de-testing.md` §6. Registro por caso en [`04-ejecucion-exp.md`](04-ejecucion-exp.md); defectos en [`05-reportes-de-defectos-exp.md`](05-reportes-de-defectos-exp.md).

| Dato | Valor |
|---|---|
| Versión probada | `main` en el commit `1c72d0f` (código local, sin cambios). No se probó el deploy de Vercel |
| Entorno | Local: Vite en `http://127.0.0.1:5173` + Supabase local. Chromium (Playwright 1.63), es-AR, America/Argentina/Buenos_Aires, reloj del navegador fijado en 09/10/2026 12:00 |
| Fecha | 2026-10-27 |
| Ejecutó | Claude Code (IA), supervisado por Santiago. Los 75 casos, con scripts de Playwright |
| Evidencia | Lo observado en cada caso (nombre y tamaño del archivo descargado, fila exportada, mensajes y estado final de la pantalla) figura en «Resultado obtenido» de `04-ejecucion-exp`. No se guardaron capturas ni los scripts en el repositorio |

## 1. Planificados, ejecutados, pasados, fallados y bloqueados

Status vigente de cada caso: el de su única ejecución (no hubo re-test).

| Métrica | Casos | % |
|---|---|---|
| Planificados | **75** | 100 % |
| Ejecutados (PASSED + FAILED + DUDA) | **75** | 100 % de avance |
| PASSED | **69** | 92 % de los ejecutados |
| FAILED | **4** | 5 % de los ejecutados |
| DUDA (pasa, con dudas) | **2** | 3 % de los ejecutados |
| BLOCKED | **0** | — |
| No ejecutados | 0 | — |

- **FAILED:** CP-EXP-062 (DEF-030), CP-EXP-063 y CP-EXP-065 (DEF-031) y CP-EXP-064 (DEF-032). Los cuatro se reprodujeron más de una vez y el defecto es de la aplicación, no del caso.
- **DUDA:** CP-EXP-030 y CP-EXP-071. Los pasos finales piden importar el CSV en Google Sheets; no se pudo usar, así que el oráculo fue un lector RFC 4180 propio (12 columnas, una fila y descripción multilínea en una sola celda). Repetir con Google Sheets para cerrarlos.
- **PASSED sin valor hoy:** CP-EXP-070. Exige que tocar fuera no cierre la hoja durante «Exportando…», pero hoy tocar fuera nunca la cierra (DEF-030): pasaría aunque el bloqueo no existiera. Repetir cuando se corrija DEF-030.
- **Lo que sí se cumple:** el contenido del CSV pasó todas las comprobaciones de formato (BOM, doce columnas, CRLF), montos y tipo de cambio, escape de comas, comillas y saltos de línea, neutralización de fórmulas, orden, aislamiento entre usuarios (UI y API) y volumen (1.000, 1.500 y 2.000 filas sin faltantes).

## 2. Cobertura por prioridad, tipo, técnica y canal

| Prioridad | Casos | PASSED | FAILED | DUDA | BLOCKED |
|---|---|---|---|---|---|
| Alta | 54 | 51 | 1 | 2 | 0 |
| Media | 18 | 16 | 2 | 0 | 0 |
| Baja | 3 | 2 | 1 | 0 | 0 |

| Tipo | Casos | PASSED | FAILED | DUDA | BLOCKED |
|---|---|---|---|---|---|
| Positivo | 44 | 39 | 3 | 2 | 0 |
| Negativo | 10 | 9 | 1 | 0 | 0 |
| Límite | 21 | 21 | 0 | 0 | 0 |

| Técnica | Casos | PASSED | FAILED | DUDA | BLOCKED |
|---|---|---|---|---|---|
| Particiones de equivalencia | 21 | 20 | 0 | 1 | 0 |
| Valores límite | 19 | 19 | 0 | 0 | 0 |
| Transición de estados | 17 | 14 | 3 | 0 | 0 |
| Caso de uso | 11 | 9 | 1 | 1 | 0 |
| Adivinación de errores | 5 | 5 | 0 | 0 | 0 |
| Tabla de decisión | 2 | 2 | 0 | 0 | 0 |

| Canal | Casos | PASSED | FAILED | DUDA | BLOCKED |
|---|---|---|---|---|---|
| UI | 74 | 68 | 4 | 2 | 0 |
| API | 1 | 1 | 0 | 0 | 0 |

Camino feliz: 44 casos. Negativos y de límite: 31 casos.

**Pruebas automatizadas existentes:** el test unitario del dominio de exportación (`tests/domain/exportCsv.test.ts`) pasó 18/18 en esta corrida. No se corrieron el resto de Vitest, pgTAP ni Playwright smoke.

## 3. Quién ejecutó cada caso: con IA y sin IA

| Forma de ejecución | Casos | Cuáles |
|---|---:|---|
| **Con IA** (Claude Code, supervisado por Santiago) | **75** | CP-EXP-001 a CP-EXP-075 |
| Sin IA (a mano por el equipo) | 0 | — |

El equipo no tenía resultados previos de EXP, así que todo el módulo se ejecutó con IA. En estos casos la IA tuvo que sustituir la herramienta o el oráculo del caso (detalle en el punto 7): CP-EXP-030, CP-EXP-049, CP-EXP-050, CP-EXP-057, CP-EXP-058, CP-EXP-059, CP-EXP-064, CP-EXP-068, CP-EXP-069, CP-EXP-070, CP-EXP-071, CP-EXP-073, CP-EXP-074.

## 4. Trazabilidad

Los 75 casos cubren los criterios CA-1 a CA-25, el requisito de cambio de URL, la completitud y el estado Error de US-47 (matriz en `casos/exp.md` §1). Todos tienen al menos un caso ejecutado. Los casos que fallaron cubren CA-23 (CP-EXP-062) y CA-24 (CP-EXP-063 y 064), más el requisito «todo cambio de URL» (CP-EXP-065).

**Invariantes y restricciones:** C1, C2, C5, C7, C9, C10, C11 e I10 tienen casos ejecutados y en verde. Las demás invariantes de V2 se informan en otros módulos.

## 5. Defectos por severidad

Detalle completo en `05-reportes-de-defectos-exp`.

| Severidad | Abiertos | IDs |
|---|---|---|
| Crítica | 0 | — |
| Alta | 0 | — |
| Media | 3 | DEF-030, DEF-031, DEF-032 |
| Baja | 0 | — |
| **Total abiertos** | **3** | DEF-030, DEF-031, DEF-032 |

Los tres defectos son de la hoja «Exportar movimientos» (cómo se cierra); ninguno afecta el contenido del CSV. Ninguno tiene issue todavía.

## 6. Criterios de salida (docs/07-plan-de-testing.md §6)

| Criterio | Estado |
|---|---|
| 1. Cero defectos de severidad Crítica abiertos | ✅ Cumplido |
| 2. Cero defectos de severidad Alta abiertos, o justificados por el PO | ✅ Cumplido |
| 3. Todos los casos de prioridad Alta ejecutados | ✅ Cumplido: 54 de 54 (con FAILED: CP-EXP-064; con DUDA: CP-EXP-030 y CP-EXP-071) |
| 4. Toda invariante del alcance con al menos un caso ejecutado | Parcial: las de EXP sí (C1, C2, C5, C7, C9, C10, C11, I10); las demás de V2 van en otros módulos |

**Conclusión:** EXP cumple los criterios 1, 2 y 3 y no tiene casos sin ejecutar ni bloqueados. Hay tres defectos Medios abiertos (DEF-030 a DEF-032) sobre el cierre de la hoja, que hay que corregir y volver a probar junto con CP-EXP-062 a 065 y CP-EXP-070. Quedan por repetir con Google Sheets CP-EXP-030 y CP-EXP-071.

## 7. Desvíos respecto de lo planificado

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

## 8. Datos de prueba

Todo en Supabase **local**, con usuarios `qa+cp-exp-<nnn>-001@example.com` (los de aislamiento, `-A` y `-B`) y montos ficticios. `supabase db reset` los borra. En producción no se creó nada. La contraseña de prueba es `Clave123!` y solo existe en la base local.
