# Entrega 2 · Biyu

Entregables de la Entrega 02 del Proyecto Integrador (Testing de Aplicaciones): **V2, el MVP usable**.
Mismo esquema de IDs que la Entrega 1: **historia `US-nn` → criterio `CA-k` → caso `CP-<módulo>-<nnn>` →
resultado → defecto `DEF-nnn`**. Casos escritos con el estándar de `docs/07-plan-de-testing.md` §4
(ADR-028) y los procedimientos `PR-nn` de `docs/12-procedimientos-de-prueba.md`. La ejecución fue en parte manual y en parte con IA supervisada (`06-reporte-de-ejecucion.md` §3).

**Para la defensa:** [`00-guia-de-la-defensa.md`](00-guia-de-la-defensa.md) tiene el mapa de la consigna, los gráficos, los casos que
cambiaron de estado y qué caso abrir para cada tema.

| Parte | Archivo | Qué es | Estado |
|---|---|---|---|
| A | `01-historias-de-usuario-v2.md` + `mocks/` | Historias de V2 con pantalla, botones, campos, validaciones, criterios `CA-k` y mock | **Hecho**: 37 historias de V2 en un solo documento (32 implementadas); las fuentes siguen en `historias/` |
| A | `02-especificacion-casos-v2.md` / `.xlsx` | Casos de prueba de V2 | **Hecho**: los 212 casos del catálogo (DEU 61, NAV 25, EXP 31, IMP 41, SUS 48, CAT 6), con un índice y una hoja por caso. 53 tienen los pasos en lenguaje simple (Deudas y Navegación) y 159 el formato del catálogo de `casos/`, recortado el 2026-10-27 |
| A | `03-seleccion-regresion.md` / `.xlsx` | Casos de V1 elegidos para regresión, con el criterio (ADR-027) | **Parcial**: selección de 58 de los 74 casos de V1, con el motivo de cada uno, y confirmación de los 22 defectos de V1 (21 confirmados y 1 no concluyente, cerrado igual). Falta ejecutar la regresión |
| B | `04-ejecucion.md` / `.xlsx` | Ejecución de V2 de todos los módulos (Deudas, Navegación, Exportar CSV, Importar Excel y Suscripciones): una hoja por caso, resultado por caso y detalle de lo que no es PASSED | **Parcial**: 203 casos (189 PASSED, 9 FAILED, 1 DUDA, 4 BLOCKED). 161 con IA, 21 a mano y 21 de Suscripciones informados como «ok» por el equipo. Sin regresión |
| B | `05-reportes-de-defectos.md` / `.xlsx` | Defectos de V2 de todos los módulos, con la funcionalidad que afectan (desde DEF-030) | **Parcial**: DEF-030 a DEF-037 (4 Medios y 4 Bajos; DEF-029 se retiró por ser un error del caso), sin issue |
| B | `06-reporte-de-ejecucion.md` / `.xlsx` | % PASSED / FAILED / BLOCKED por módulo, quién ejecutó cada caso (IA o equipo), criterios de salida y desvíos | **Parcial**: Deudas, Navegación, Exportar CSV, Importar Excel y Suscripciones |
| Adicional | `equivalencia-ids.md` | Tabla con el ID anterior y el ID nuevo de cada caso de V2 (recorte y renumeración del 2026-10-27) | Hecho |
| Adicional | `07-ia-agentes-y-prompts.md` | Agentes de IA, IDEs y prompts usados | **Hecho**: herramientas y modelos, prompts de especificación, de implementación y de corrección de defectos tal cual se usaron, y el registro de qué prompt y qué herramienta produjo cada PR |
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
