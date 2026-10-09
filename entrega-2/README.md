# Entrega 2 · Biyu

Entregables de la Entrega 02 del Proyecto Integrador (Testing de Aplicaciones): **V2, el MVP usable**.
Mismo esquema de IDs que la Entrega 1: **historia `US-nn` → criterio `CA-k` → caso `CP-<módulo>-<nnn>` →
resultado → defecto `DEF-nnn`**. Casos escritos con el estándar de `docs/07-plan-de-testing.md` §4
(ADR-028) y los procedimientos `PR-nn` de `docs/12-procedimientos-de-prueba.md`. La ejecución es **manual**.

| Parte | Archivo | Qué es | Estado |
|---|---|---|---|
| A | `01-historias-de-usuario-v2.md` + `mocks/` | Historias de V2 con pantalla, botones, campos, validaciones, criterios `CA-k` y mock | Pendiente |
| A | `02-especificacion-casos-v2.md` / `.xlsx` | Casos de prueba de V2 | Pendiente |
| A | `03-seleccion-regresion.md` / `.xlsx` | Casos de V1 elegidos para regresión, con el criterio (ADR-027) | Pendiente |
| B | `04-ejecucion.md` / `.xlsx` + `evidencia/` | Ejecución manual de V2, regresión y confirmación de defectos | Pendiente |
| B | `05-reportes-de-defectos.md` / `.xlsx` | Defectos de V2, con la funcionalidad que afectan (desde DEF-029) | Pendiente |
| B | `06-reporte-de-ejecucion.md` / `.xlsx` | % PASSED / FAILED / BLOCKED, gráfico y cambios de estado por caso entre entregas | Pendiente |
| Adicional | `07-ia-agentes-y-prompts.md` | Agentes de IA, IDEs y prompts usados | Pendiente |
| B | `08-presentacion.html` | Presentación de 15 minutos con la demo | Pendiente |
| Estudio | `09-resumen-de-estudio.md` | Para explicar todo oralmente | Pendiente |

**Antes de V2:** corregir la especificación de la Entrega 1 (el profesor pidió casos mejor especificados).
Seguimiento en `entrega-1/piloto-cuo-reescrito.md` (módulo piloto) y en el plan de la entrega.

## Equipo

| Quién | Frente |
|---|---|
| Joaquín Nuñez | Features nuevas de V2: historias, mocks e implementación con IA |
| Santiago | Defectos y pendientes de código, con su test de regresión por cada fix |
| Micaela, Valentina y Mariana | Diseño y ejecución manual de casos, con propiedad cruzada (`docs/07-plan-de-testing.md` §1) |

## Alcance de V2

| Nivel | Qué |
|---|---|
| 1 | Deudas (US-30, US-34 a US-41) · Suscripciones (US-52 a US-63) · Export CSV (US-47) · navegación inferior (#172) · feedback de guardado con reintento · confirmación destructiva · vista previa del calendario de suscripción |
| 2 | Gráfico de torta (US-72, #242) · detalle de categoría (US-73, #243) · editar un movimiento (US-84, #284) · NFR de rendimiento, accesibilidad y robustez |
| 3 | Importar gastos desde Excel (#169) |

Si algo del nivel 2 o 3 no llega, sus casos quedan `BLOCKED` con la justificación. Fecha de la presentación: ~2026-10-16.
