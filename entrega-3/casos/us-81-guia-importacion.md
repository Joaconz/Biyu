# Casos de prueba V3 — Guía para armar el archivo de importación (US-81)

**Historia:** [#269](https://github.com/Joaconz/Biyu/issues/269) · US-74, US-80 · ADR-023 · DEF-024 (regla de diálogos).
**Oráculo:** el botón «¿Cómo armo el archivo?» (pasos 1 y 2 de `/import`) abre un diálogo con título, texto, seis pasos, tabla de ejemplo y pie exactos. Nace cerrado, nunca se abre solo, se puede ignorar, y abrirlo o cerrarlo no cambia el paso, el archivo, el filtro ni la URL.
**Convenciones:** PR-01 crea el usuario (`docs/12-procedimientos-de-prueba.md`). Montos ficticios (C14).
**Automatización:** `e2e/import-guide.spec.ts` y `tests/domain/import-guide.test.ts`.

| ID | Título | Criterio | Técnica | Tipo | Canal | Prioridad | Automatizable |
|---|---|---|---|---|---|---|---|
| CP-IMP-053 | La guía nace cerrada, no está en el paso 3 y se deshabilita al importar | CA-1, CA-8 | Casos de uso | Positivo | UI | Media | Sí |
| CP-IMP-054 | Al abrirla muestra el título, el texto, los seis pasos, la tabla de ejemplo y el pie exactos | CA-2, CA-10 | Casos de uso | Positivo | UI | Alta | Sí |
| CP-IMP-055 | Se cierra por cuatro vías, el foco vuelve y Tab no sale del diálogo | CA-3, CA-4 | Particiones | Positivo | UI | Alta | Sí |
| CP-IMP-056 | «Descargar plantilla» del diálogo baja el mismo archivo que el del paso 1 | CA-5 | Casos de uso | Positivo | UI | Media | Sí |
| CP-IMP-057 | Se puede ignorar y abrirla no cambia el archivo, el resumen, el filtro ni la URL | CA-6, CA-7 | Casos de uso | Positivo | UI | Media | Sí |
| CP-IMP-058 | En 390 px entra con 16 px de margen y la tabla scrollea por dentro | CA-9 | Valores límite | Positivo | UI | Media | Sí |

## CP-IMP-053 — Cerrada por defecto
**Pre-requisitos:** PR-01 con `imp-053@biyu.test`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Entrar a `/import`; recargar y volver a entrar. | `import-guide-dialog` no está en el DOM; se ve «¿Cómo armo el archivo?» (`import-guide-open`). |
| 2 | Elegir un archivo válido, importar y llegar al paso 3. | `import-guide-open` no está en el paso 3. |
| 3 | Con «Importando…» en pantalla (red lenta). | `import-guide-open` está deshabilitado. |

## CP-IMP-054 — Contenido exacto
| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Tocar «¿Cómo armo el archivo?». | Diálogo `role="dialog"`, `aria-modal="true"`, título «Cómo armar el archivo». |
| 2 | Leer el texto y `import-guide-steps`. | El texto de la historia y los seis pasos numerados, exactos. |
| 3 | Leer `import-guide-example` y el pie. | Encabezados de la plantilla y las filas 01/09/2026 «Compra del mes» y 10/06/2026 «Heladera» (6 cuotas, 3 pendientes); pie «Hasta 500 filas y 1 MB. Solo se lee la primera hoja.». |
| 4 | Revisar los `data-testid`. | Existen `import-guide-open`, `-dialog`, `-steps`, `-example`, `-template-download`, `-done` y `-close`; el de cerrar tiene `aria-label="Cerrar guía"`. |

## CP-IMP-055 — Cierre y foco
| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir la guía. | El foco está en el botón de cerrar. |
| 2 | Tab y Shift+Tab repetidos. | El foco nunca sale del diálogo. |
| 3 | Cerrar con «Entendido»; repetir con el botón de cerrar, con Escape y tocando fuera. | En las cuatro, el diálogo se cierra y el foco vuelve a «¿Cómo armo el archivo?». |

## CP-IMP-056 a CP-IMP-058 — Plantilla, ignorarla y celular
| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Descargar la plantilla desde el diálogo y desde el paso 1. | Los dos bajan `biyu-plantilla-importacion.xlsx` con las mismas hojas y el mismo contenido de celdas. |
| 2 | Sin abrir la guía, elegir un archivo e importar. | Funciona igual que en US-77; nada se deshabilita ni avisa. |
| 3 | En el paso 2, con archivo, aplicar «Ver solo filas con error», abrir y cerrar la guía. | Mismo archivo, mismo resumen, mismo estado del filtro; la URL no cambia. |
| 4 | A 390 × 844 abrir la guía. | Margen de 16 px por lado; `scrollWidth` no supera el ancho de la ventana; la tabla de ejemplo scrollea horizontal dentro de su caja. |
