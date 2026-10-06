# Entrega 2 · Agentes de IA, IDEs y prompts

_Material adicional que pide la consigna: qué agentes e IDEs se usaron y con qué prompts. Las
plantillas de abajo son las que se pegan en cada sesión nueva; el registro del final se completa a
medida que se usan._

**Regla de la consigna:** la IA es el "equipo de desarrollo" y recibe **los mismos requerimientos que
usa Testing**, sin cambios funcionales en el prompt. Por eso el orden es siempre: historia escrita y
congelada en un issue → el prompt de implementación solo dice "implementá el issue #NN".

## 1. Herramientas

| Herramienta | Para qué |
|---|---|
| Claude Code (app de escritorio, pestaña Code) | Especificación, implementación, revisión y documentación |
| Skills del repo (`.claude/skills`, copia en `.agents/skills`) | `new-test-case`, `new-adr`, `speckit-checklist`, `supabase-postgres-best-practices`, `shadcn`, `frontend-design`, `emil-design-eng`, `apple-design` |
| Subagentes del repo (`.claude/agents`) | `spec-critic`, `spec-consistency-checker`, `rls-migration-reviewer`, `pgtap-writer`, `domain-purity-reviewer`, `docs-writer` |
| Stitch (MCP) | Mocks de pantallas de las historias |

## 2. Features de V2 a cargo de Joaquín

Cada feature pasa por **dos sesiones**: una que escribe las historias (plantilla A) y, cuando Testing
las revisó y están congeladas, una sesión por issue que las implementa (plantilla B).

| # | Feature | Historias | IDs nuevos reservados | Archivo de historias | Nivel |
|---|---|---|---|---|---|
| 1 | Deudas y gastos compartidos | US-30, US-34 a US-41 | — | `entrega-2/historias/deudas.md` | 1 |
| 2 | Suscripciones | US-52 a US-63 | US-75 (vista previa del calendario) | `entrega-2/historias/suscripciones.md` | 1 |
| 3 | Export CSV | US-47 | — | `entrega-2/historias/export-csv.md` | 1 |
| 4 | Navegación e interfaz | — | US-69 (barra inferior, #172) · US-70 (guardado con reintento que conserva lo cargado) · US-71 (confirmación destructiva en cuotas, solo si V1 no la cubre ya) | `entrega-2/historias/navegacion.md` | 1 |
| 5 | Dashboard por categoría | — | US-72 (torta, #170) · US-73 (detalle de categoría, #171) | `entrega-2/historias/dashboard-categorias.md` | 2 |
| 6 | Importar desde Excel | — | US-74 (#169) | `entrega-2/historias/importar-excel.md` | 3 |

**Orden de implementación sugerido:** Deudas → Suscripciones → CSV → Navegación (la barra necesita
que existan las pantallas de Deudas y Suscripciones) → Dashboard por categoría → Excel. Las sesiones de
especificación (A) se pueden correr las seis en paralelo porque cada una escribe su propio archivo.

**Fuera de la cancha de Joaquín:** los NFR técnicos (rendimiento, accesibilidad, idempotencia bajo
concurrencia) y los defectos son de Santiago; los casos de prueba son de Micaela, Valentina y Mariana.

## 3. Plantilla A · Especificar una feature (una sesión por feature)

Reemplazar `<FEATURE>`, `<HISTORIAS>`, `<IDS NUEVOS>` y `<ARCHIVO>` con la fila de la tabla de arriba.

```text
Escribí las historias de usuario de V2 para la feature <FEATURE> de Biyu (Joaconz/Biyu).
Historias: <HISTORIAS>. IDs nuevos que podés usar: <IDS NUEVOS> (no uses otros: hay
sesiones en paralelo). Escribí solo en <ARCHIVO>.

1. Leé AGENTS.md, CLAUDE.md, entrega-2/README.md y entrega-1/01-historias-de-usuario.md
   (es el formato a copiar). Fuentes de la feature: docs/02-behavior-spec.md,
   docs/06-suscripciones.md, docs/04-data-model.md, docs/roadmap.md §V2, los ADR que
   apliquen y el issue de la feature si existe.
2. Cada historia lleva: objetivo; ruta y estructura de la pantalla; cada botón con su
   texto; cada campo con tipo, obligatorio, rango, máximo de caracteres y qué acepta;
   mensajes de error exactos; estados vacío, cargando y error; data-testid de cada
   elemento interactivo (<pantalla>-<elemento>); criterios de aceptación numerados
   CA-1, CA-2… verificables con pass/fail; trazabilidad (FR, R*, I*, C*, ADR).
3. Un mock por pantalla nueva o modificada (Stitch o HTML en entrega-2/mocks/),
   respetando ADR-023. Montos ficticios.
4. Si una decisión no es obvia (ej. qué RPC nueva hace falta), escribí un ADR con
   /new-adr en vez de decidirla en la historia.
5. Pasá el archivo por el agente spec-critic y corregí los hallazgos. Después
   spec-consistency-checker.
6. Mostrame el resultado y esperá mi OK. Recién ahí creá un issue por historia con
   gh (label historia, milestone V2, bajo la épica de la feature), con el texto de
   la historia tal cual, y commiteá en una rama spec/<feature>.

No implementes nada. No diseñes casos de prueba CP-*.
```

## 4. Plantilla B · Implementar un issue (una sesión por issue)

Se usa recién cuando la historia está congelada (Testing la revisó). El texto funcional sale del issue:
el prompt no agrega ni cambia requisitos.

```text
Implementá el issue #NN de Joaconz/Biyu. Solo este issue.

1. Leé AGENTS.md, CLAUDE.md, el issue y solo los docs que cita. El issue es el
   requerimiento congelado: no lo reinterpretes; si es ambiguo o contradice el
   spec, pará y preguntame.
2. Rama us/NN-slug desde main actualizado. Si depende de algo que no está en
   main, pará y avisame.
3. Solo los criterios de aceptación del issue. Montos con Decimal (nunca number),
   lógica en src/domain o Postgres, transacciones por create_transaction (C4),
   RLS y su par pgTAP en toda tabla nueva (C7), data-testid en todo lo interactivo.
4. Si tocás supabase/migrations: skill supabase-postgres-best-practices, agente
   rls-migration-reviewer, pgtap-writer para los tests, npm run gen:types.
   NO apliques migraciones a producción (nada de supabase db push): eso lo hago yo
   cuando Testing termine la re-ejecución de V1.
5. Si tocás src/: agente domain-purity-reviewer antes del PR.
6. npm test, npm run test:db y npm run build en verde. PR contra main con
   "Closes #NN" y la lista de CA cubiertos.

No diseñes ni ejecutes casos CP-*: eso lo hace Testing desde la spec.
```

## 5. Plantilla C · Corregir un defecto (Santiago)

```text
Corregí el defecto DEF-NNN (issue #NN) de Joaconz/Biyu. Solo ese defecto.
Leé AGENTS.md, CLAUDE.md, el issue y docs/07-plan-de-testing.md §5. Primero escribí
el test que reproduce el defecto y falla; después el fix. Rama fix/def-NNN, PR con
"Closes #NN" y la ruta del test de regresión. No cierres el defecto: lo confirma
quien lo reportó.
```

## 6. Registro de prompts usados

| Fecha | Quién | Plantilla | Feature / issue | Sesión o PR | Notas |
|---|---|---|---|---|---|
| 2026-10-06 | Joaquín | — | Plan de la Entrega 2, estándar de casos y piloto de Cuotas | [#200](https://github.com/Joaconz/Biyu/pull/200) | Prompt libre de planificación: "Empecemos por planear la entrega 2…" |
