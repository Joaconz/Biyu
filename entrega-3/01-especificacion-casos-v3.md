# Entrega 3 · Especificación de casos de prueba (V3)

Planilla: [`01-especificacion-casos-v3.xlsx`](01-especificacion-casos-v3.xlsx) (un «Índice» con los 146 casos y una hoja por sección de cada archivo, con el formato de la cátedra: ID, prioridad, técnica, trazabilidad, pre-requisitos, datos, pasos y resultado esperado). Issue [#338](https://github.com/Joaconz/Biyu/issues/338), épica [#326](https://github.com/Joaconz/Biyu/issues/326).

La fuente de cada caso es su archivo de [`casos/`](casos/). La planilla se genera con `python3 entrega-3/fuentes/generar_casos_v3.py` (necesita `openpyxl`): si cambia un `.md`, se vuelve a correr.

## Alcance

Los casos de las historias de V3 que ya están implementadas: las que pasaron de V2 a V3 (US-80 a US-83), el CRUD completo (US-84 a US-90) y deudas por persona (US-91).

| Historia | Issue | Archivo | Casos | Rango |
|---|---|---|---|---|
| US-80 · Importar una compra empezada | [#268](https://github.com/Joaconz/Biyu/issues/268) | [`us-80`](casos/us-80-importar-compra-empezada.md) | 11 | CP-IMP-042 a 052 |
| US-81 · Guía de importación | [#269](https://github.com/Joaconz/Biyu/issues/269) | [`us-81`](casos/us-81-guia-importacion.md) | 6 | CP-IMP-053 a 058 |
| US-82 · Compartir con varias personas | [#270](https://github.com/Joaconz/Biyu/issues/270) | [`us-82`](casos/us-82-compartir-varias-personas.md) | 11 | CP-DEU-085 a 095 |
| US-83 · Deudas sueltas en el balance | [#271](https://github.com/Joaconz/Biyu/issues/271) | [`us-83`](casos/us-83-deudas-sueltas-balance.md) | 9 | CP-DAS-012 a 020 |
| US-84 · Editar un movimiento | [#284](https://github.com/Joaconz/Biyu/issues/284) | [`us-84`](casos/us-84-editar-movimiento.md) | 24 | CP-REG-017 a 040 |
| US-85 · Eliminar definitivamente un movimiento | [#328](https://github.com/Joaconz/Biyu/issues/328) | [`us-85`](casos/us-85-eliminar-movimiento-definitivo.md) | 6 | CP-REG-041 a 046 |
| US-86 · Editar una deuda | [#285](https://github.com/Joaconz/Biyu/issues/285) | [`us-86`](casos/us-86-editar-deuda.md) | 7 | CP-DEU-078 a 084 |
| US-87 · Eliminar una deuda | [#329](https://github.com/Joaconz/Biyu/issues/329) | [`us-87`](casos/us-87-eliminar-deuda.md) | 7 | CP-DEU-062 a 068 |
| US-88 · Eliminar una suscripción | [#330](https://github.com/Joaconz/Biyu/issues/330) | [`us-88`](casos/us-88-eliminar-suscripcion.md) | 7 | CP-SUS-049 a 055 |
| US-89 · Borrar una categoría | [#331](https://github.com/Joaconz/Biyu/issues/331) | [`us-89`](casos/us-89-borrar-categoria.md) | 7 | CP-CFG-016 a 022 |
| US-90 · Reactivar una cuenta | [#332](https://github.com/Joaconz/Biyu/issues/332) | [`us-90`](casos/us-90-reactivar-cuenta.md) | 4 | CP-CFG-023 a 026 |
| US-91 · Deudas agrupadas por persona | [#333](https://github.com/Joaconz/Biyu/issues/333) | [`us-91`](casos/us-91-deudas-por-persona.md) | 5 | CP-DEU-073 a 077 |
| US-92 · Barra inferior flotante | [#353](https://github.com/Joaconz/Biyu/issues/353) | [`us-92`](casos/us-92-barra-inferior-flotante.md) | 7 | CP-NAV-026 a 032 |
| US-93 · Ajustes en tarjetas | [#354](https://github.com/Joaconz/Biyu/issues/354) | [`us-93`](casos/us-93-ajustes-en-tarjetas.md) | 4 | CP-CFG-027 a 030 |
| US-94 · Confirmación de borrado | [#355](https://github.com/Joaconz/Biyu/issues/355) | [`us-94`](casos/us-94-confirmacion-de-borrado.md) | 3 | CP-REG-047 a 049 |
| US-97 · Esqueletos y transiciones | [#358](https://github.com/Joaconz/Biyu/issues/358) | [`us-97`](casos/us-97-esqueletos-y-transiciones.md) | 5 | CP-NAV-033 a 037 |
| US-98 · Categorías y cuentas legibles | [#359](https://github.com/Joaconz/Biyu/issues/359) | [`us-98`](casos/us-98-categorias-y-cuentas-legibles.md) | 3 | CP-REG-050 a 052 |
| US-102 · Rebranding y tema | [#410](https://github.com/Joaconz/Biyu/issues/410) | [`us-102`](casos/us-102-rebranding-y-tema.md) | 5 | CP-CFG-031 a 034 y CP-DAS-021 |
| US-103 · Dona y tendencias | [#411](https://github.com/Joaconz/Biyu/issues/411) | [`us-103`](casos/us-103-dona-y-tendencias.md) | 5 | CP-DAS-022 a 026 |
| US-104 · Gráficos de Suscripciones | [#412](https://github.com/Joaconz/Biyu/issues/412) | [`us-104`](casos/us-104-graficos-de-suscripciones.md) | 5 | CP-SUS-057 a 061 |
| US-105 · Categorías con ícono | [#413](https://github.com/Joaconz/Biyu/issues/413) | [`us-105`](casos/us-105-categorias-con-icono.md) | 5 | CP-CFG-035 a 039 |
| **Total** | | | **146** | |

Por módulo: REG 36, DEU 30, CFG 24, IMP 17, DAS 15, SUS 12, NAV 12. Por prioridad: 88 Alta, 57 Media y 1 Baja. Los 104 de US-80 a US-91 son automatizables y están automatizados (cada archivo dice en qué spec de Playwright, test pgTAP o test de Vitest). Los 42 de las historias de UX (US-92 a US-105) están automatizados en `e2e/ux-navegacion.spec.ts`, `e2e/ux-ajustes.spec.ts` y `e2e/ux-resumen.spec.ts`, salvo 2 de inspección manual (CP-NAV-037, el «atrás» del navegador, y CP-CFG-034, el contraste).

## Qué no está acá

- **Mejoras de UX que no tienen casos (épica [#325](https://github.com/Joaconz/Biyu/issues/325)).** Se implementaron de otra forma de la que pedían las historias, así que se adaptaron: US-92, US-93, US-94, US-97 y US-98, más las nuevas US-102 a US-105 (rebranding y tema, dona y tendencias, gráficos de Suscripciones, categorías con ícono). Sus 42 casos están en la tabla de arriba. US-95, US-96, US-99 y US-100 no se implementaron en V3 y no tienen casos. Los casos de V1 y V2 que esa UX toca (ACC, NAV, parte de DAS y REG) ya están automatizados contra la UX final.
- **Casos de confirmación de DEF-030 a DEF-037.** No se escriben casos nuevos: cada defecto lo detectó un caso de V2, y ese caso (corregido cuando el defecto era del caso: DEF-035 y DEF-036) está en la selección de regresión ([`03-seleccion-regresion.md`](03-seleccion-regresion.md)) y en la automatización.

## Cómo se arma la planilla

- Cada archivo de `casos/` tiene una tabla de índice (ID, título, criterio, técnica, tipo, canal, prioridad) y una sección por caso o grupo de casos relacionados que comparten pre-requisitos y pasos. La planilla tiene una hoja por sección: su nombre dice qué casos cubre (por ejemplo `DEU-064-065`) y el «Índice» enlaza cada caso con su hoja.
- «Camino feliz» es «Sí» en los casos de tipo Positivo.
- Las columnas «Reporte de ejecución 1, 2 y 3» quedan vacías a propósito: el resultado de V3 se registra en la ejecución ([#340](https://github.com/Joaconz/Biyu/issues/340)).
