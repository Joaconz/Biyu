# NFR Requirements Quality Checklist: Calidad de redacción y ubicación por versión (NFR-01 a NFR-20)

**Purpose**: Validar que cada NFR de `docs/pre-entrega.md` §4 esté completo, sea claro y medible antes de decidir en qué versión (V1, V2, V3, V3+ o diferido) se prueba. Insumo de [#73](https://github.com/Joaconz/Biyu/issues/73).
**Created**: 2026-09-28
**Feature**: `specs/nfr/spec.md` → fuente real: `docs/pre-entrega.md` §4, `docs/roadmap.md`, `docs/02-behavior-spec.md` §Out of Scope

**Note**: Generado por `/speckit-checklist`.
**Review Ownership**: Artefacto de revisión de calidad de requerimientos. `[x]` significa que la persona que revisa considera satisfecho ese criterio de calidad — no que la funcionalidad esté implementada.
**Marker Semantics**: `[x]` = criterio de redacción revisado y satisfecho. No implica trabajo de implementación completo.

## Requirement Completeness

- [x] CHK001 - ¿NFR-01 especifica en qué dispositivo/modelo concreto de "gama media" se mide, más allá de "con throttling"? [Completeness, Spec §NFR-01] — **Gap real, aceptado**: se difiere a V2 (#20), donde se fija el dispositivo antes de medir.
- [x] CHK002 - ¿NFR-02 y NFR-03 especifican bajo qué condición de carga concurrente (cuántas sesiones simultáneas) se mide el percentil 95? [Completeness, Spec §NFR-02, §NFR-03] — Gap aceptado: fuera de alcance de V1/V2 (`07-plan-de-testing.md` declara explícitamente que no hay pruebas de carga real).
- [x] CHK003 - ¿NFR-05 enumera la lista concreta de funciones "centrales" cubiertas, o se apoya en un adjetivo? [Completeness, Ambiguity, Spec §NFR-05] — El propio NFR ya las nombra (registrar, ver dashboard, editar, eliminar); no es un gap.
- [x] CHK004 - ¿NFR-07 especifica el tamaño de muestra y el perfil de usuario de la prueba de usabilidad manual? [Completeness, Spec §NFR-07] — Gap: se resuelve al diseñar el caso de prueba en V2, no bloquea la redacción del NFR.
- [x] CHK005 - ¿NFR-09 especifica cuánto tiempo sobrevive el borrador local (¿hasta cerrar pestaña? ¿indefinido?) y qué pasa si se recarga la página? [Gap, Spec §NFR-09]

## Requirement Clarity

- [x] CHK006 - ¿"Gama media" en NFR-01 está cuantificado con un modelo o rango de specs, o es un término subjetivo? [Ambiguity, Spec §NFR-01]
- [x] CHK007 - ¿"Degradación aceptable" en NFR-05 está definida con un criterio objetivo de qué es "romperse", o es interpretable? [Clarity, Spec §NFR-05]
- [x] CHK008 - ¿NFR-15 a NFR-18 (PWA) usan vocabulario consistente con `02-behavior-spec.md` §Out of Scope, que ya la difiere a V3+? [Consistency, Spec §NFR-15–18]

## Requirement Consistency

- [x] CHK009 - ¿NFR-11 ("falla de la cotización no bloquea") es consistente con la decisión de FR-12 de que **no existe** API externa de cotización (`08-trazabilidad.md`, ajuste de FR-12)? [Conflict, Spec §NFR-11] — **Confirmado: NFR-11 referencia un mecanismo (API de cotización) que la spec vigente eliminó.** Se marca "No aplica" en la matriz, no se difiere.
- [x] CHK010 - ¿NFR-12 (HTTPS) depende de un enabler (deploy) que ya tiene su propio issue, o queda flotando sin dueño? [Traceability, Spec §NFR-12] — Tiene dueño: [#72](https://github.com/Joaconz/Biyu/issues/72).
- [x] CHK011 - ¿NFR-13 y NFR-14 (seguridad) son consistentes con C7 (`03-architecture-spec.md`) y con los pares pgTAP ya escritos (`rls_isolation.test.sql`)? [Consistency, Spec §NFR-13, §NFR-14] — Consistentes; NFR-13 ya tiene su verificación automatizada corriendo.

## Acceptance Criteria Quality (Measurability)

- [x] CHK012 - ¿Puede NFR-01 (LCP, INP, CLS) verificarse objetivamente con una herramienta (Lighthouse) sin ambigüedad de interpretación? [Measurability, Spec §NFR-01] — Sí.
- [x] CHK013 - ¿Puede NFR-06 (WCAG 2.1 AA) verificarse con una checklist de criterios objetivos (contraste, foco, ARIA, lector de pantalla), o requiere juicio subjetivo de "accesible"? [Measurability, Spec §NFR-06] — Verificable por criterio, aunque el lector de pantalla exige prueba manual (no automatizable en V1/V2).
- [x] CHK014 - ¿NFR-19 (80% de cobertura en cuotas/prorrateo, 100% de negativos de RLS) especifica cómo se mide el porcentaje (líneas, branches, casos)? [Ambiguity, Spec §NFR-19] — Gap menor: se interpreta como "casos del catálogo", a confirmar recién en V3 (no bloquea V1).

## Scenario Coverage

- [x] CHK015 - ¿Existen NFR para el camino de excepción de sesión expirada (más allá de FR-03, que está en el lado funcional)? [Gap, Coverage] — No hay NFR dedicado; FR-03 ya cubre el criterio funcional, no se abre uno nuevo.
- [x] CHK016 - ¿Hay un NFR o FR que cubra qué pasa si dos pestañas del mismo usuario escriben `ensureUserSeeded` a la vez? [Coverage, Edge Case] — Cubierto por diseño en ADR-014 (idempotencia), no por un NFR — correcto: es un detalle de implementación, no un atributo de calidad medible por el usuario.

## Dependencies & Assumptions

- [x] CHK017 - ¿La dependencia de NFR-15 a NFR-18 en que "exista uso real" antes de invertir en PWA está documentada como asunción, no como fecha fija? [Assumption, Spec §NFR-15–18] — Documentada en `roadmap.md` §V3+.
- [x] CHK018 - ¿NFR-04/NFR-05 (compatibilidad) asumen que el equipo tiene acceso a Safari iOS real para probar, o solo a herramientas de emulación? [Assumption, Gap] — Sin resolver; se anota como riesgo de V2, no bloquea V1.

## Notes

- Ítems `[x]` acá reflejan la revisión de calidad de redacción hecha en [#73](https://github.com/Joaconz/Biyu/issues/73) el 2026-09-28, no que la funcionalidad NFR esté implementada.
- Las decisiones de versión que salen de esta revisión (incluido el hallazgo de CHK009) están volcadas en `docs/08-trazabilidad.md` §Requerimientos no funcionales.
- `/speckit-implement` no aplica en Biyu (no se usa el ciclo completo de spec-kit); este archivo es sólo el checklist de calidad.
