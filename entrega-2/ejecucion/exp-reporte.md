# Entrega 2 · Reporte de ejecución de casos de prueba (V2) · Exportar CSV (EXP)

Planilla: `ejecucion/exp.xlsx` (hojas Resumen, Casos y Defectos). Formato del contenido: `docs/07-plan-de-testing.md` §6. Registro por caso en [`exp.md`](exp.md); defectos en [`05-reportes-de-defectos.md`](../05-reportes-de-defectos.md).

| Dato | Valor |
|---|---|
| Versión probada | Repositorio local, rama `main` (migraciones hasta 20261012000000). No se probó el deploy de Vercel. |
| Entorno | Vite local (127.0.0.1:5173) + Supabase local · Chromium (Playwright 1.63), es-AR, zona America/Argentina/Buenos_Aires, reloj fijado en 09/10/2026. |
| Fecha | 2026-10-27 |
| Ejecutó | Claude Code (IA), supervisado por Santiago. Los 75 casos. |
| Datos | Usuarios `qa+cp-exp-<nnn>-001@example.com` y montos ficticios, uno por caso; en local se pueden borrar con `supabase db reset`. |

## 1. Planificados, ejecutados, pasados, fallados y bloqueados

| Métrica | Casos | % |
|---|---|---|
| Planificados | 75 | 100 % |
| Ejecutados (PASSED + FAILED + DUDA) | 75 | 100 % de avance |
| PASSED | 69 | 92 % de los ejecutados |
| FAILED | 4 | 5 % de los ejecutados |
| DUDA (pasa, con dudas) | 2 | 3 % de los ejecutados |
| BLOCKED | 0 | — |
| No ejecutados | 0 | — |

- **FAILED:** CP-EXP-062 (DEF-030), CP-EXP-063 y CP-EXP-065 (DEF-031) y CP-EXP-064 (DEF-032).
- **DUDA:** CP-EXP-030 y CP-EXP-071 (sin Google Sheets; oráculo sustituido por un lector RFC 4180).
- **PASSED sin valor hoy:** CP-EXP-070 (depende de DEF-030).

## 2. Cobertura por prioridad, tipo, técnica y canal

| Prioridad | Casos | PASSED | FAILED | DUDA | BLOCKED |
|---|---|---|---|---|---|
| Alta | 54 | 51 | 1 | 2 | 0 |
| Media | 18 | 16 | 2 | 0 | 0 |
| Baja | 3 | 2 | 1 | 0 | 0 |

| Tipo | Casos | PASSED | FAILED | DUDA | BLOCKED |
|---|---|---|---|---|---|
| Positivo | 44 | 39 | 3 | 2 | 0 |
| Límite | 21 | 21 | 0 | 0 | 0 |
| Negativo | 10 | 9 | 1 | 0 | 0 |

| Técnica | Casos | PASSED | FAILED | DUDA | BLOCKED |
|---|---|---|---|---|---|
| Particiones de equivalencia | 21 | 20 | 0 | 1 | 0 |
| Transición de estados | 17 | 14 | 3 | 0 | 0 |
| Valores límite | 19 | 19 | 0 | 0 | 0 |
| Caso de uso | 11 | 9 | 1 | 1 | 0 |
| Tabla de decisión | 2 | 2 | 0 | 0 | 0 |
| Adivinación de errores | 5 | 5 | 0 | 0 | 0 |

| Canal | Casos | PASSED | FAILED | DUDA | BLOCKED |
|---|---|---|---|---|---|
| UI | 74 | 68 | 4 | 2 | 0 |
| API | 1 | 1 | 0 | 0 | 0 |

## 3. Quién ejecutó cada caso: con IA y sin IA

| Forma de ejecución | Casos | Cuáles |
|---|---:|---|
| **Con IA** (Claude Code, supervisado por Santiago) | **75** | CP-EXP-001 a CP-EXP-075 |
| Sin IA (a mano por el equipo) | 0 | — |

El equipo no tenía resultados previos de EXP, así que todo el módulo se ejecutó con IA. Los casos donde la IA no pudo replicar la herramienta o el oráculo del caso (ver el punto 5 de los desvíos) son CP-EXP-030, 049, 050, 057 a 059, 064, 068, 069, 070, 071, 073 y 074.

## 4. Defectos por severidad

| Severidad | Abiertos | IDs |
|---|---|---|
| Crítica | 0 | — |
| Alta | 0 | — |
| Media | 3 | DEF-030, DEF-031, DEF-032 |
| Baja | 0 | — |
| **Total abiertos** | **3** | DEF-030, DEF-031, DEF-032 |

Detalle en `05-reportes-de-defectos`.

## 5. Criterios de salida (docs/07-plan-de-testing.md §6)

| Criterio | Estado | Detalle |
|---|---|---|
| 1. Cero defectos de severidad Crítica abiertos | Cumplido | No hay defectos críticos. |
| 2. Cero defectos de severidad Alta abiertos, o justificados por el PO | Cumplido | No hay defectos de severidad Alta. |
| 3. Todos los casos de prioridad Alta ejecutados | Cumplido | Los 54 casos de prioridad Alta se ejecutaron. Con FAILED: CP-EXP-064 (Alta); con DUDA: CP-EXP-030 y 071 (Alta). |
| 4. Toda invariante del alcance con al menos un caso ejecutado | Parcial | EXP cubre C1, C2, C5, C7, C9, C10, C11 e I10; las demás invariantes de V2 se informan en otros módulos. |
| 5. Regresión de V1 ejecutada y defectos corregidos confirmados | No evaluado | Fuera del alcance de este reporte. |

**Conclusión:** EXP cumple los criterios 1, 2 y 3. Hay tres defectos Medios abiertos (DEF-030 a 032) sobre el cierre de la hoja; ninguno afecta el contenido del CSV, que pasó todas las comprobaciones de formato, escape de fórmulas, orden, aislamiento por usuario y volumen (1.000, 1.500 y 2.000 filas). Quedan por repetir con Google Sheets CP-EXP-030 y 071, y CP-EXP-070 cuando se corrija DEF-030.

## 6. Desvíos respecto de lo planificado

1. **Entorno local, no el deploy.** Todo se ejecutó contra el código local y Supabase local. Los resultados pueden diferir del deploy de Vercel si este está desactualizado.
2. **Un solo navegador.** Solo Chromium (Playwright); no se probó Firefox ni Safari.
3. **Reloj fijado.** El reloj del navegador se fijó en 09/10/2026 12:00 (America/Argentina/Buenos_Aires), como piden los casos 002 y 004 a 006. El reloj del servidor no se tocó.
4. **Preparación por API.** Las transacciones, el catálogo y las referencias de tipo de cambio se cargaron por API (EXP-PREP-01 a 06), no por las pantallas. Los casos 040 a 042 y 068 sembraron 1.000, 1.500 y 2.000 transacciones con un script de Node con 8 pedidos en paralelo, en lugar del script de PowerShell 7 de EXP-PREP-07 (no está instalado).
5. **Herramientas sustituidas.** (a) Red lenta (049, 050, 064, 069, 070): demora fija de 4 s (3 s en el 064) en la lectura de `/rest/v1/transactions` en lugar de «1 kbit/s, 2000 ms» de DevTools. (b) Sin conexión (057 a 059): corte de red del contexto de Playwright. (c) HTTP 500 y monto inválido (073, 074): ruta interceptada de Playwright en lugar del código pegado en la consola (EXP-PREP-08 y 09); mismo efecto sobre el `fetch`. (d) 068: el alta concurrente se hizo por API entre la primera y la segunda página de la lectura, no desde una segunda ventana de otro navegador. (e) 030 y 071: lector RFC 4180 propio en lugar de Google Sheets. (f) 062, 070: clic fuera de la hoja en la posición (5, 5) de una ventana de 420 × 900. (g) Las descargas se leyeron del archivo descargado por el navegador, no del Explorador de archivos.
6. **Cuotas heredadas (023 y 024).** La preparación pide PR-07 (compra en cuotas); se creó la compra con `create_transaction` en una cuenta de tipo tarjeta de crédito «Visa BBVA», porque la base solo admite cuotas con tarjeta de crédito.
7. **Eliminación de la baja (017, 056).** `delete_transaction` responde 204 sin cuerpo (ver DEF-029); el script lo toma como éxito.
8. **CP-EXP-070.** Pasa sin valor mientras DEF-030 esté abierto.
9. **Evidencia:** no se adjuntaron capturas al repositorio; lo observado queda en «Resultado obtenido» de cada caso.

## 7. Datos de prueba

Usuarios `qa+cp-exp-<nnn>-001@example.com` (los de aislamiento, `-A` y `-B`) con contraseña `Clave123!` y montos ficticios (C14), uno por caso. En el entorno local se borran con `supabase db reset`.
