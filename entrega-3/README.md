# Entrega 3 · Biyu

Entregables de la Entrega 03 del Proyecto Integrador (Testing de Aplicaciones): **V3, CRUD completo, mejoras de UX y automatización**. Mismo esquema de IDs que las entregas anteriores: **historia `US-nn` → criterio `CA-k` → caso `CP-<módulo>-<nnn>` → resultado → defecto `DEF-nnn`**. Casos escritos con el estándar de `docs/07-plan-de-testing.md` §4 y los procedimientos `PR-nn` de `docs/12-procedimientos-de-prueba.md`.

**Para la defensa:** la presentación es [`09-presentacion.html`](09-presentacion.html) y el resumen de todo, con los porcentajes y los gráficos, es [`07-reporte-final.md`](07-reporte-final.md). Todo el trabajo de testing de las tres entregas, con los casos, las historias y los defectos enlazados, está en una sola planilla: [`Biyu-Planilla-Unica.xlsx`](Biyu-Planilla-Unica.xlsx).

## Resultado en una línea

184 casos nuevos de V3 y 177 de regresión de V1 y V2: **361 de 361 PASSED**, tanto en la ejecución automatizada (2026-11-14) como en la manual del equipo en el deploy de Vercel (14 al 16 de noviembre). Los 8 defectos de V2 y DEF-023 de V1 quedaron confirmados (9 de 9). V3 no registró defectos nuevos.

## Qué pide la consigna y dónde está

| Objetivo de la Entrega 03 | Archivo |
|---|---|
| Resumen de las funcionalidades nuevas y los requerimientos funcionales | [`00-historias-de-usuario-v3.md`](00-historias-de-usuario-v3.md) y la sección «Requerimientos de V3» de la presentación |
| Corregir los defectos encontrados en V1 y V2 | Los 36 están cerrados; la confirmación, en [`04-ejecucion.md`](04-ejecucion.md) («Confirmación de defectos») y [`08-ejecucion-manual.md`](08-ejecucion-manual.md) |
| Casos de prueba de las funcionalidades de V3 | [`01-especificacion-casos-v3.md`](01-especificacion-casos-v3.md) / `.xlsx` y una ficha por historia en [`casos/`](casos/) |
| Cómo se eligieron los casos de V1 y V2 a ejecutar (regresión) | [`03-seleccion-regresion.md`](03-seleccion-regresion.md): 177 de 286, por prioridad Alta o por haber fallado por un defecto en V2 |
| Cómo se eligieron los casos a automatizar | [`02-seleccion-automatizacion.md`](02-seleccion-automatizacion.md): los 184 de V3 y los 177 de regresión |
| Especificación de los casos de regresión a ejecutar | [`03-seleccion-regresion.md`](03-seleccion-regresion.md) («Casos seleccionados» y «Casos ajustados a V3») |
| Ejecución manual de los casos de V3 y de la regresión | [`08-ejecucion-manual.md`](08-ejecucion-manual.md) / `.xlsx` |
| Ejecución de los casos automatizados | [`04-ejecucion.md`](04-ejecucion.md) / `.xlsx` (resultado por caso) y [`05-reporte-ejecucion-automatizada.md`](05-reporte-ejecucion-automatizada.md) (la suite y su comparación con la Entrega 2) |
| % de PASSED, FAILED y BLOCKED, gráfico y casos que cambiaron de estado en cada entrega | [`07-reporte-final.md`](07-reporte-final.md) §2 a §4 y [`graficos/`](graficos/) |
| Resumen de defectos | [`07-reporte-final.md`](07-reporte-final.md) §5 y [`06-analisis-y-post-mortem.md`](06-analisis-y-post-mortem.md) §1 |
| Análisis de defectos y post-mortem de las actividades | [`06-analisis-y-post-mortem.md`](06-analisis-y-post-mortem.md) |

## Archivos

| Archivo | Qué es |
|---|---|
| [`00-historias-de-usuario-v3.md`](00-historias-de-usuario-v3.md) | Las 28 historias de V3 y las suscripciones por cobrar (ADR-045): objetivo, qué cambia, criterios de aceptación, decisiones y casos de cada una |
| [`01-especificacion-casos-v3.md`](01-especificacion-casos-v3.md) / `.xlsx` | Los 184 casos de V3 por historia, con el formato de la cátedra (ID, prioridad, técnica, trazabilidad, pre-requisitos, datos, pasos y resultado esperado) |
| [`02-seleccion-automatizacion.md`](02-seleccion-automatizacion.md) | Qué se automatiza, por qué y con qué herramienta (Playwright, pgTAP y Vitest) |
| [`03-seleccion-regresion.md`](03-seleccion-regresion.md) | Criterio de la regresión, los 177 casos elegidos y los ajustes que necesitaron para V3 |
| [`04-ejecucion.md`](04-ejecucion.md) / `.xlsx` | Ejecución automatizada: resultado de los 361 casos, qué prueba cubre cada uno y la confirmación de defectos |
| [`05-reporte-ejecucion-automatizada.md`](05-reporte-ejecucion-automatizada.md) | Reporte de la suite: qué se corrió y dónde, incidentes de las corridas y comparación con la Entrega 2 |
| [`06-analisis-y-post-mortem.md`](06-analisis-y-post-mortem.md) | Análisis de los 36 defectos de V1 y V2 y post-mortem de las actividades de testing de las tres entregas |
| [`07-reporte-final.md`](07-reporte-final.md) | Reporte final: resultado de V3, gráficos, cambios de estado entre entregas, defectos y criterios de «Terminado» |
| [`08-ejecucion-manual.md`](08-ejecucion-manual.md) / `.xlsx` | Ejecución manual del equipo: resultado de los 361 casos y testeo de confirmación |
| [`09-presentacion.html`](09-presentacion.html) | Presentación de la entrega |
| [`10-presentacion-keynote.html`](10-presentacion-keynote.html) | Otra versión de la presentación, estilo Keynote, para 15 a 20 minutos: 13 diapositivas (unos 12 minutos) y una demo de 5 con su guion. Notas del orador con tiempo sugerido y reloj (tecla N), tema claro u oscuro (T) y export a PDF con la impresión del navegador |
| [`Biyu-Planilla-Unica.xlsx`](Biyu-Planilla-Unica.xlsx) | Planilla única de las tres entregas, con casos, historias y defectos enlazados |
| [`casos/`](casos/) | Una ficha por historia: la fuente de cada caso de V3 |
| [`ejecucion/`](ejecucion/) | Resultados crudos de Playwright, Vitest y pgTAP |
| [`graficos/`](graficos/) | Gráficos de resultados por entrega, evolución entre entregas y defectos por módulo |
| [`fuentes/`](fuentes/) | Scripts de Python que generan las planillas y los gráficos a partir de los `.md` y de los resultados |

## Qué cambió de la Entrega 2 a la 3

- **Funcionalidad nueva:** editar y borrar en todas las entidades (US-84 a US-90), deudas agrupadas por persona y compartidas con varias personas, importar compras en cuotas ya empezadas, un Resumen con un solo número configurable (US-101, ADR-053) y once historias de UX.
- **Automatización:** la suite corre en la CI en cada PR (Playwright, Vitest y pgTAP) y falla el build cuando un test falla. Antes la ejecución era con IA y repaso manual; ahora cada caso de V3 y de la regresión tiene su prueba automatizada.
- **Defectos:** los 8 de V2 se corrigieron y se confirmaron. Los 4 casos de V2 que estaban BLOCKED por US-82 pasaron, porque US-82 se implementó.

## Cómo se regeneran los datos

Los comandos están en [`07-reporte-final.md`](07-reporte-final.md) §7. Si cambia un archivo de `casos/`, la planilla de casos se regenera con `python entrega-3/fuentes/generar_casos_v3.py` (necesita `openpyxl`).
