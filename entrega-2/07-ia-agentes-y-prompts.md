# Entrega 2 · Agentes de IA, IDEs y prompts

Material adicional que pide la consigna: qué agentes de IA e IDEs se usaron y con qué prompts. La
herramienta de cada PR sale del historial de git (autor y línea `Co-Authored-By` de los commits) y
del enlace a la sesión en la descripción del PR. Los prompts son los que se pegaron en cada sesión,
copiados tal cual.

## 1. La regla de la consigna y cómo se cumplió

La consigna pide que la IA trabaje como «equipo de desarrollo» con **los mismos requerimientos que
usa Testing**, sin cambios funcionales en el prompt. Para cumplirlo, el trabajo se separó en dos
pasos:

1. **Especificar.** Una sesión escribe las historias de una feature en `entrega-2/historias/<feature>.md`,
   con pantallas, campos, mensajes exactos, `data-testid`, criterios `CA-k` y mock. Al terminar crea
   un issue por historia con el texto de la historia tal cual (prompts de la sección 4).
2. **Implementar.** Otra sesión, nueva, recibe solo el número de issue. El prompt dice qué leer, qué
   reglas técnicas del repo respetar (CLAUDE.md) y cuándo parar. **No agrega ni cambia requisitos**:
   si el issue es ambiguo, la IA tiene que parar y preguntar (prompts de la sección 5).

Las sesiones de implementación son nuevas a propósito: si la misma sesión que escribió la historia
la implementa, completa los huecos con lo que «quiso decir» y no con lo que quedó escrito. Una sesión
nueva solo tiene el texto del issue, igual que las testers, que diseñaron los casos `CP-*` desde ese
mismo texto.

Todos los prompts de implementación terminan con «No diseñes ni ejecutes casos CP-*». Los casos los
diseñó Testing.

## 2. Herramientas

| Herramienta | Quién la usó | Para qué |
|---|---|---|
| **Claude Code**, app de escritorio (pestaña Code) | Joaquín y Santiago | Especificación de las historias, implementación de Deudas, Navegación, Export CSV y Resumen por categoría, corrección de los defectos de V1, ejecución con IA de casos y redacción de reportes |
| **Claude Code en la web** (claude.ai/code) | Joaquín | Implementación de Suscripciones (US-56 a US-63 y US-75), Importar Excel (US-74 a US-78) y US-34. Los PR enlazan la sesión |
| **Antigravity** (IDE de Google) | Joaquín | Destino de los prompts de implementación del 2026-10-07 y 2026-10-08 (sección 5.2). Como no corre los subagentes de Claude Code, el prompt le pide leer sus instrucciones de `.agents/` |
| **Codex** (CLI de OpenAI) | Opción del equipo | Documentado en `docs/09-guia-de-inicio.md` §5, con las mismas reglas (`AGENTS.md`) |
| **Playwright** (con Claude Code) | El equipo | Ejecución con IA de los casos de V2 y de la regresión de V1 (Chromium emulando un celular), más pedidos directos a la API con el token del usuario de prueba |

**Modelos** (según la línea `Co-Authored-By` de los commits): Claude Opus 5.5 en la mayor parte de la
implementación y de los fixes; Claude Sonnet 5.5 en las specs de Deudas, Excel, Navegación y US-84;
Claude Haiku 4.5 en la spec de Suscripciones y en parte de la de Navegación.

### Lo que el repo le da a la IA

Todas las herramientas leen las mismas reglas: `CLAUDE.md` (constraints C1 a C15) y `AGENTS.md`, que
apunta a CLAUDE.md para las IA que no son Claude Code. `.agents/` es una copia de `.claude/skills`,
`.claude/agents` y `.claude/hooks` para Codex y Antigravity.

| Tipo | Nombre | Para qué |
|---|---|---|
| Subagente | `spec-critic` | Ataca historias y casos buscando ambigüedad, requisitos no verificables y bordes faltantes |
| Subagente | `spec-consistency-checker` | Verifica que `docs/` no se contradiga (glosario, C*, I*, R*, ADR-*) |
| Subagente | `rls-migration-reviewer` | Revisa cada migración contra RLS, atomicidad, montos y soft delete |
| Subagente | `pgtap-writer` | Escribe los tests pgTAP: el par de autorización por tabla y las invariantes I1 a I18 |
| Subagente | `domain-purity-reviewer` | Revisa `src/` contra C1, C2 y C5 (sin `number` en montos, sin reloj, lógica fuera de la UI) |
| Subagente | `test-adversary` | Ejecuta casos contra la app buscando romperla, sin arreglar nada |
| Subagente | `docs-writer` | Redacta reportes de ejecución y de defectos |
| Skill | `new-adr`, `new-test-case` | Plantillas de ADR y de caso de prueba (estándar de ADR-028) |
| Skill | `supabase-postgres-best-practices`, `supabase` | Schema, RLS, índices y RPC |
| Skill | `speckit-checklist` | Checklist de calidad de redacción de los NFR |
| Skill | `shadcn`, `frontend-design`, `mobile-native`, `emil-design-eng`, `apple-design` | UI con el sistema de diseño de ADR-023 |
| Skill | `playwright-cli`, `archify` | Navegador automatizado y diagrama de arquitectura |
| Hook | `block-secrets.sh`, `guard-git-staging.sh`, pre-commit de git | Bloquean credenciales y `.env` antes de que entren al repo público (C13, C14) |
| Hook | `lint-migration.sh` | Revisa cada migración nueva al escribirla |

## 3. Quién hizo qué con IA

| Frente | Quién | Con IA | Sin IA |
|---|---|---|---|
| Historias de V2 y mocks | Joaquín | Redacción, mocks HTML, ADR y revisión con `spec-critic` | Alcance, decisiones de producto y OK final de cada spec |
| Implementación de V2 | Joaquín y Santiago | Todo el código, migraciones y tests (Vitest y pgTAP) | Revisión y merge de cada PR |
| Fix de los defectos de V1 | Santiago | Fix y test de regresión de cada defecto | Revisión y merge |
| Diseño de casos de V2 | Micaela, Valentina y Mariana | — | Los casos de `casos/*.md` (PR #287 a #291) |
| Ejecución de V2 | El equipo | 161 casos con Claude Code | 21 casos a mano y 21 de Suscripciones informados por el equipo; después, repaso manual de todos los casos |
| Regresión de V1 | El equipo | 60 casos con Claude Code | Repaso manual de los 60 casos |

## 4. Prompts para especificar las features

Pegados el 2026-10-06, uno por sesión. Las seis sesiones corrieron en paralelo: cada una escribía su
propio archivo y tenía sus números de historia reservados.

### 4.1 Deudas (PR #232)

```text
Escribí las historias de usuario de V2 para la feature Deudas y gastos compartidos de Biyu (Joaconz/Biyu): US-30 y US-34 a US-41. No crees IDs nuevos (hay otras sesiones en paralelo). Escribí solo en entrega-2/historias/deudas.md.

1. Leé AGENTS.md, CLAUDE.md, entrega-2/README.md y entrega-1/01-historias-de-usuario.md (es el formato a copiar). Fuentes: docs/02-behavior-spec.md (Deudas, sad path "deuda mayor que el gasto", supuesto 4), docs/04-data-model.md (tabla debts, I7, I9), docs/roadmap.md §V2, la épica #18 y los ADR que apliquen.
2. Cada historia lleva: objetivo; ruta y estructura de la pantalla; cada botón con su texto; cada campo con tipo, obligatorio, rango, máximo de caracteres y qué acepta; mensajes de error exactos; estados vacío, cargando y error; data-testid de cada elemento interactivo (<pantalla>-<elemento>); criterios de aceptación numerados CA-1, CA-2… verificables con pass/fail; trazabilidad (FR, R*, I*, C*, ADR).
3. Un mock por pantalla nueva o modificada (Stitch o HTML en entrega-2/mocks/), respetando ADR-023. Montos ficticios.
4. Si una decisión no es obvia (por ejemplo, cómo create_transaction crea la deuda vinculada en la misma llamada, C4), escribí un ADR con /new-adr en vez de decidirla dentro de la historia.
5. Pasá el archivo por el agente spec-critic y corregí los hallazgos; después, spec-consistency-checker.
6. Mostrame el resultado y esperá mi OK. Recién ahí: rama spec/deudas, commit, y un issue por historia con gh (label historia, milestone V2, bajo la épica #18) con el texto de la historia tal cual.

No implementes nada. No diseñes casos de prueba CP-*.
```

### 4.2 Suscripciones (PR #209)

```text
Escribí las historias de usuario de V2 para la feature Suscripciones de Biyu (Joaconz/Biyu): US-52 a US-63, más una nueva, US-75 (vista previa del calendario de una suscripción antes de darla de alta). No uses otros IDs (hay otras sesiones en paralelo). Escribí solo en entrega-2/historias/suscripciones.md.

1. Leé AGENTS.md, CLAUDE.md, entrega-2/README.md y entrega-1/01-historias-de-usuario.md (es el formato a copiar). Fuentes: docs/06-suscripciones.md (reglas R1–R8, escenarios BDD, casos de borde), docs/04-data-model.md (subscriptions, I11–I17), docs/adr/017-suscripciones-por-puesta-al-dia-idempotente.md, docs/roadmap.md §V2, la épica #17.
2. Cada historia lleva: objetivo; ruta y estructura de la pantalla; cada botón con su texto; cada campo con tipo, obligatorio, rango (por ejemplo, día de cobro 1–31), máximo de caracteres y qué acepta; mensajes de error exactos; estados vacío, cargando y error; data-testid de cada elemento interactivo (<pantalla>-<elemento>); criterios de aceptación numerados CA-1, CA-2… verificables con pass/fail; trazabilidad (FR, R*, I*, C*, ADR).
3. Un mock por pantalla nueva o modificada (Stitch o HTML en entrega-2/mocks/), respetando ADR-023. Montos ficticios.
4. Si una decisión no es obvia, escribí un ADR con /new-adr en vez de decidirla dentro de la historia.
5. Pasá el archivo por el agente spec-critic y corregí los hallazgos; después, spec-consistency-checker.
6. Mostrame el resultado y esperá mi OK. Recién ahí: rama spec/suscripciones, commit, y un issue por historia con gh (label historia, milestone V2, bajo la épica #17) con el texto de la historia tal cual.

No implementes nada. No diseñes casos de prueba CP-*.
```

### 4.3 Export CSV (PR #202)

```text
Escribí la historia de usuario de V2 para la feature Export CSV de Biyu (Joaconz/Biyu): US-47. No crees IDs nuevos (hay otras sesiones en paralelo). Escribí solo en entrega-2/historias/export-csv.md.

1. Leé AGENTS.md, CLAUDE.md, entrega-2/README.md y entrega-1/01-historias-de-usuario.md (es el formato a copiar). Fuentes: docs/02-behavior-spec.md (historia 47, FR-22), docs/03-architecture-spec.md (C9), docs/04-data-model.md, docs/roadmap.md §V2, la épica #19.
2. La historia lleva: objetivo; dónde está el botón y con qué texto; columnas exactas del CSV, orden, separador, codificación, formato de montos (string decimal, C2), fechas y moneda; qué pasa con las transacciones eliminadas y con las cuotas; nombre del archivo; estados vacío, cargando y error con mensajes exactos; data-testid; criterios de aceptación numerados CA-1, CA-2… verificables con pass/fail; trazabilidad.
3. Un mock de la pantalla modificada (Stitch o HTML en entrega-2/mocks/), respetando ADR-023. Montos ficticios.
4. Si una decisión no es obvia, escribí un ADR con /new-adr.
5. Pasá el archivo por el agente spec-critic y corregí los hallazgos; después, spec-consistency-checker.
6. Mostrame el resultado y esperá mi OK. Recién ahí: rama spec/export-csv, commit, y el issue con gh (label historia, milestone V2, bajo la épica #19) con el texto de la historia tal cual.

No implementes nada. No diseñes casos de prueba CP-*.
```

### 4.4 Navegación e interfaz (PR #248)

```text
Escribí las historias de usuario de V2 para la feature Navegación e interfaz de Biyu (Joaconz/Biyu). IDs nuevos que podés usar, y ningún otro (hay otras sesiones en paralelo):
- US-69: barra de navegación inferior con más opciones (issue #172; ver el comentario de src/lib/navigation.ts sobre los destinos de V2).
- US-70: feedback explícito de guardado y de error, con opción de reintentar conservando lo cargado.
- US-71: confirmación destructiva con consecuencias explícitas al borrar una transacción en cuotas. Antes verificá si US-65 de V1 ya lo cubre; si es así, no la escribas y explicá por qué.
Escribí solo en entrega-2/historias/navegacion.md.

1. Leé AGENTS.md, CLAUDE.md, entrega-2/README.md y entrega-1/01-historias-de-usuario.md (es el formato a copiar). Fuentes: docs/roadmap.md §V2 "Cambios de interfaz", docs/02-behavior-spec.md, docs/adr/023 y 024, docs/design/pendientes-ui.md, la épica #20.
2. Cada historia lleva: objetivo; ruta y estructura de la pantalla; cada botón con su texto; estados vacío, cargando y error con mensajes exactos; comportamiento en celular y en computadora; data-testid de cada elemento interactivo (<pantalla>-<elemento>); criterios de aceptación numerados CA-1, CA-2… verificables con pass/fail; trazabilidad.
3. Un mock por pantalla nueva o modificada (Stitch o HTML en entrega-2/mocks/), respetando ADR-023.
4. Si una decisión no es obvia, escribí un ADR con /new-adr.
5. Pasá el archivo por el agente spec-critic y corregí los hallazgos; después, spec-consistency-checker.
6. Mostrame el resultado y esperá mi OK. Recién ahí: rama spec/navegacion, commit, y un issue por historia con gh (label historia, milestone V2, bajo la épica #20) con el texto de la historia tal cual.

No implementes nada. No diseñes casos de prueba CP-*.
```

### 4.5 Resumen por categoría (PR #244)

```text
Escribí las historias de usuario de V2 para la feature Dashboard por categoría de Biyu (Joaconz/Biyu). IDs nuevos que podés usar, y ningún otro (hay otras sesiones en paralelo):
- US-72: gráfico de torta del gasto por categoría en el Resumen (issue #170).
- US-73: tocar una categoría del Resumen abre su detalle, con el total del período, su evolución y la lista de sus gastos (issue #171).
Escribí solo en entrega-2/historias/dashboard-categorias.md.

1. Leé AGENTS.md, CLAUDE.md, entrega-2/README.md y entrega-1/01-historias-de-usuario.md (es el formato a copiar). Fuentes: US-27 y FR-20 (la decisión de gráficos de V1, issue #78, que esto reabre), docs/02-behavior-spec.md, docs/03-architecture-spec.md (C11: período y filtros en la URL), docs/adr/006 y 023.
2. Cada historia lleva: objetivo; ruta (con los parámetros de URL) y estructura de la pantalla; cada elemento con su texto; cómo se calculan los porcentajes y qué pasa con las categorías archivadas, los ingresos y las cuotas heredadas; estados vacío, cargando y error con mensajes exactos; data-testid; criterios de aceptación numerados CA-1, CA-2… verificables con pass/fail (con montos de ejemplo exactos); trazabilidad.
3. Un mock por pantalla nueva o modificada (Stitch o HTML en entrega-2/mocks/), respetando ADR-023. Montos ficticios.
4. El cambio de tipo de gráfico reabre FR-20: escribí el ADR con /new-adr.
5. Pasá el archivo por el agente spec-critic y corregí los hallazgos; después, spec-consistency-checker.
6. Mostrame el resultado y esperá mi OK. Recién ahí: rama spec/dashboard-categorias, commit, y un issue por historia con gh (label historia, milestone V2) con el texto de la historia tal cual; cerrá #170 y #171 referenciando los issues nuevos.

No implementes nada. No diseñes casos de prueba CP-*.
```

### 4.6 Importar desde Excel (PR #208)

```text
Escribí la historia de usuario de V2 para la feature Importar gastos desde Excel de Biyu (Joaconz/Biyu): ID nuevo US-74 (issue #169), y ningún otro (hay otras sesiones en paralelo). Escribí solo en entrega-2/historias/importar-excel.md.

1. Leé AGENTS.md, CLAUDE.md, entrega-2/README.md y entrega-1/01-historias-de-usuario.md (es el formato a copiar). Fuentes: el issue #169, docs/02-behavior-spec.md (validaciones de alta), docs/03-architecture-spec.md (C4, C6, C14), docs/04-data-model.md, US-47 (export CSV, la operación inversa).
2. La historia lleva: objetivo; dónde se importa y la estructura de la pantalla; formato exacto del archivo (extensiones aceptadas, columnas, encabezados, formato de montos, fechas y moneda, tamaño y cantidad máxima de filas); validación fila por fila con el mensaje de error exacto de cada regla; qué pasa si unas filas son válidas y otras no; resumen al terminar; data-testid; criterios de aceptación numerados CA-1, CA-2… verificables con pass/fail; trazabilidad.
3. Un mock de la pantalla (Stitch o HTML en entrega-2/mocks/), respetando ADR-023. Montos ficticios, y un archivo de ejemplo con datos ficticios.
4. Escribí un ADR con /new-adr sobre cómo se crea cada fila respetando C4 (una llamada a create_transaction por fila, o una RPC batch) y qué pasa ante un fallo parcial.
5. Pasá el archivo por el agente spec-critic y corregí los hallazgos; después, spec-consistency-checker.
6. Mostrame el resultado y esperá mi OK. Recién ahí: rama spec/importar-excel, commit, y el issue con gh (label historia, milestone V2) con el texto de la historia tal cual; cerrá #169 referenciando el issue nuevo.

No implementes nada. No diseñes casos de prueba CP-*.
```

La sesión de Importar Excel partió US-74 en cuatro historias (US-74, US-76, US-77 y US-78). Las
historias US-80 a US-83 (PR #274) y US-84 (PR #286) se escribieron el 2026-10-08 y el 2026-10-09 en la
sesión de planificación, con las mismas reglas; ninguna llegó a implementarse en V2.

## 5. Prompts para implementar

### 5.1 Plantilla de un issue (Claude Code)

Se usó para Deudas (US-34, US-35, US-36, US-37, US-38, US-41, US-30 y US-79), cambiando solo `#NN`.

```text
Implementá el issue #NN de Joaconz/Biyu. Solo este issue.

1. Leé AGENTS.md, CLAUDE.md, el issue y solo los docs que cita. El issue es el requerimiento congelado: no lo reinterpretes. Si es ambiguo o contradice el spec, pará y preguntame.
2. Rama us/NN-slug desde main actualizado. Si depende de algo que no está en main, pará y avisame.
3. Solo los criterios de aceptación del issue. Montos con Decimal (nunca number), lógica en src/domain o Postgres, transacciones por create_transaction (C4), RLS y su par pgTAP en toda tabla nueva (C7), data-testid en todo lo interactivo.
4. Si tocás supabase/migrations: skill supabase-postgres-best-practices, agente rls-migration-reviewer, agente pgtap-writer para los tests, y npm run gen:types. NO apliques migraciones a producción (nada de supabase db push): eso lo hago yo cuando Testing termine la re-ejecución de V1.
5. Si tocás src/: agente domain-purity-reviewer antes del PR.
6. npm test, npm run test:db y npm run build en verde. PR contra main con "Closes #NN" y la lista de criterios cubiertos.

No diseñes ni ejecutes casos CP-*: eso lo hace Testing desde la spec.
```

### 5.2 Plantilla de un issue para Antigravity (2026-10-07)

Antigravity no tiene los subagentes de Claude Code, así que el prompt le pide aplicar las
instrucciones de `.agents/`. Se preparó para US-37 (#227), US-79 (#238) y US-47 (#201).

```text
Implementá el issue #NN de Joaconz/Biyu. Solo este issue.

1. Leé AGENTS.md, CLAUDE.md, el issue (gh issue view NN) y solo los docs que cita. El issue es el requerimiento congelado: no lo reinterpretes ni agregues cosas. Si es ambiguo o contradice el spec, pará y preguntame.
2. Actualizá main (git pull) y creá la rama us/NN-slug. Si depende de algo que no está en main, pará y avisame.
3. Implementá solo los criterios de aceptación del issue. Reglas: montos con Decimal (decimal.js), nunca number; lógica de negocio en src/domain (funciones puras, sin leer el reloj) o en Postgres; el período y los filtros en la URL; data-testid exactamente como dice el issue en todo lo interactivo; textos de pantalla exactamente como dice el issue.
4. Antes de abrir el PR, revisá tu cambio siguiendo las instrucciones de .agents/agents/domain-purity-reviewer.md y corregí lo que encuentres.
5. Agregá tests de Vitest para la lógica nueva de src/domain. Corré npm test y npm run build: tienen que quedar en verde.
6. Abrí un PR contra main con "Closes #NN" y la lista de criterios (CA-1, CA-2…) que cubriste.

No diseñes ni ejecutes casos de prueba CP-*: eso lo hace el equipo de Testing desde la spec.
```

Para el CSV se sumó esta línea antes de la última:

```text
El formato exacto del archivo (columnas, orden, separador, montos y fechas) está en docs/adr/029-formato-y-alcance-del-export-csv.md: respetalo al pie de la letra.
```

### 5.3 Saldar y volver a pendiente una deuda (US-39 y US-40)

Los dos issues comparten pantalla y RPC, así que la sesión fue una sola. Al final se abrieron dos PR
(#246 y #247).

```text
Implementá los issues #229 (US-39) y #230 (US-40) de Joaconz/Biyu, juntos en una sola rama y un solo PR, porque comparten pantalla y RPC. Solo esos dos issues.

1. Leé AGENTS.md, CLAUDE.md, los dos issues (gh issue view 229 y 230), docs/adr/037-deudas-se-escriben-por-rpc.md y solo los docs que citan. Los issues son el requerimiento congelado: no los reinterpretes. Si algo es ambiguo, pará y preguntame.
2. Actualizá main (git pull) y creá la rama us/229-saldar-deuda.
3. Implementá solo los criterios de aceptación. Las escrituras sobre debts van solo por las RPC settle_debt y reopen_debt (ADR-037), nunca con update directo desde el cliente. Montos con Decimal, data-testid y textos exactamente como dicen los issues.
4. Migración nueva en supabase/migrations/: seguí .agents/skills/supabase-postgres-best-practices y revisala con las instrucciones de .agents/agents/rls-migration-reviewer.md. Las RPC validan en el servidor lo mismo que la UI, con los mensajes de error que piden los issues (C6).
5. Tests pgTAP en supabase/tests/database/ siguiendo .agents/agents/pgtap-writer.md: cada RPC funciona, rechaza los casos que piden los criterios, otra sesión no puede tocar una deuda ajena y el rol anon recibe permission denied (C7).
6. Corré npm run gen:types, npm test, npm run test:db y npm run build: todo en verde.
7. NO apliques la migración a producción (nada de supabase db push): eso lo hago yo.
8. PR contra main con "Closes #229" y "Closes #230" y la lista de criterios cubiertos.

No diseñes ni ejecutes casos de prueba CP-*.
```

### 5.4 Suscripciones, en cuatro sesiones (2026-10-07)

Cada sesión implementa varios issues seguidos, con un PR por issue, y se detiene después de cada PR
hasta que se le dice «mergeado». Orden: la 1 sola; la 2 y la 3 en paralelo; la 4 al final.

| Sesión | Issues | PR |
|---|---|---|
| 1 · Base | #210 a #213 (US-52 a US-55) | #251, #255, #256, #257 |
| 2 · Consultas | #222, #220, #221 (US-75, US-62, US-63) | #258, #260 |
| 3 · Ciclo de vida | #214 a #217 (US-56 a US-59) | #259, #261, #262, #263, #264 |
| 4 · Movimientos | #218, #219 (US-60, US-61) y la trazabilidad | #265, #266, #267 |

**Sesión 1 · Base**

```text
Implementá, en este orden, los issues #210 (US-52), #211 (US-53), #212 (US-54) y #213 (US-55) de Joaconz/Biyu. Son la base de Suscripciones: schema, RPC, puesta al día y las pantallas Suscripciones, Nueva suscripción y Detalle.

Antes de empezar
1. Leé AGENTS.md, CLAUDE.md, los cuatro issues y solo los docs que citan. De entrega-2/historias/suscripciones.md leé "Cómo leer este documento" (hoy argentino, textos exactos, data-testid, formatos, diálogos) y "Supuestos y pendientes" §3 y §4. ADR que mandan: 017, 021, 030, 031, 032. Mocks: entrega-2/mocks/suscripciones-*.html.
2. Partí de main actualizado. Si necesitás algo que no está en main, pará y avisame.

Por cada issue
3. Rama us/NN-slug desde main. Un PR por issue con "Closes #NN". Después de abrir cada PR, pará y esperá a que te diga "mergeado"; el siguiente arranca desde main actualizado.
4. Solo los criterios de aceptación de ese issue. Nada de pausar, cancelar, editar, total comprometido, vista previa ni barra de navegación: son otros issues.
5. Reglas: montos con Decimal (nunca number); "hoy" entra como parámetro (todayInArgentina() en el cliente, el hoy del servidor en las RPC, ADR-021/031); lógica en src/domain/subscriptions.ts o en Postgres; toda escritura sobre subscriptions por RPC (ADR-030); cada transacción generada se inserta con sus imputaciones de forma atómica; data-testid en todo elemento interactivo; textos de botones, avisos y errores exactos como en el issue.

Migraciones
6. Lo que lista "Supuestos y pendientes" §3: las RPC de ADR-030, catch_up_subscriptions(p_today) e insert_transaction_with_entries; revocar insert/update/delete de authenticated sobre subscriptions; índice único (user_id, lower(name)); CHECK de largo de ADR-032. Revisalas con el agente rls-migration-reviewer y la skill supabase-postgres-best-practices.
7. pgTAP con el agente pgtap-writer: par RLS (otra sesión → 0 filas, anon → 42501), idempotencia (correr la puesta al día dos veces no duplica) y los CA con fecha fija llamando a catch_up_subscriptions con su p_today.
8. Después de cada migración: npm run gen:types.
9. NO apliques migraciones a producción: nada de supabase db push ni del Supabase hosteado. Solo base local; las aplico yo.

Dominio
10. computeDueOccurrences en src/domain/subscriptions.ts, pura, con today como parámetro. Tests en tests/domain/ con los ejemplos de los CA (día 31 en febrero y en meses de 30 días; mes corriente antes del día de cobro y el mismo día). Pasá el agente domain-purity-reviewer antes de cada PR.

Docs
11. En el PR del issue que corresponda, actualizá lo de "Supuestos y pendientes" §4 para 03-architecture-spec, 04-data-model, 06-suscripciones y 01-domain-glossary. 08-trazabilidad y 02-behavior-spec no: van en otra sesión.

Cierre de cada PR
12. npm test, npm run test:db y npm run build en verde; /code-review antes de abrir el PR.

No diseñes ni ejecutes casos CP-*. No commitees .env.
```

**Sesión 2 · Vista previa, aviso USD y total comprometido**

```text
Implementá, en este orden, los issues #222 (US-75), #220 (US-62) y #221 (US-63) de Joaconz/Biyu.

Antes de empezar
1. Leé AGENTS.md, CLAUDE.md, los tres issues y solo los docs que citan. De entrega-2/historias/suscripciones.md leé "Cómo leer este documento". ADR que mandan: 031, 032 y 033. Mocks: entrega-2/mocks/suscripciones-*.html.
2. Esto depende de US-52 a US-55 (#210 a #213): las pantallas de Suscripciones, computeDueOccurrences y catch_up_subscriptions tienen que estar en main. Si no están, pará y avisame.

Por cada issue
3. Rama us/NN-slug desde main. Un PR por issue con "Closes #NN". Después de abrir cada PR, pará y esperá a que te diga "mergeado".
4. Solo los criterios de aceptación de ese issue. No toques pausar, reanudar, cancelar ni editar (otra sesión los está haciendo en paralelo).
5. Reglas: montos con Decimal (nunca number); "hoy" como parámetro (todayInArgentina()); la vista previa reutiliza computeDueOccurrences, no la reimplementa; committedMonthlyTotal en src/domain/subscriptions.ts, puro, con las reglas de ADR-033; "bloqueada" se deriva, no se guarda (ADR-031); data-testid en todo elemento interactivo; textos exactos del issue.
6. Si necesitás una migración: un timestamp posterior al último de supabase/migrations/ en main, revisión con rls-migration-reviewer y supabase-postgres-best-practices, pgTAP con pgtap-writer y npm run gen:types. NO la apliques a producción (nada de supabase db push); las aplico yo.
7. Tests de dominio en tests/domain/ con los ejemplos de los CA (USD sin tipo de cambio, suscripciones pausadas, canceladas y terminadas en el total). Pasá domain-purity-reviewer antes de cada PR.

Cierre de cada PR
8. npm test, npm run test:db y npm run build en verde; /code-review antes de abrir el PR.

No diseñes ni ejecutes casos CP-*. No commitees .env.
```

**Sesión 3 · Pausar, reanudar, cancelar y editar**

```text
Implementá, en este orden, los issues #214 (US-56), #215 (US-57), #216 (US-58) y #217 (US-59) de Joaconz/Biyu.

Antes de empezar
1. Leé AGENTS.md, CLAUDE.md, los cuatro issues y solo los docs que citan. De entrega-2/historias/suscripciones.md leé "Cómo leer este documento" (ahí está la regla de los diálogos: foco, Tab y Escape, como delete-transaction-dialog). ADR que mandan: 017, 030 y 032; reglas R7 y R8 de docs/06-suscripciones.md. Mocks: entrega-2/mocks/suscripciones-*.html.
2. Esto depende de US-52 a US-55 (#210 a #213) en main: pantalla Detalle, RPC de alta y catch_up_subscriptions. Si no están, pará y avisame.

Por cada issue
3. Rama us/NN-slug desde main. Un PR por issue con "Closes #NN". Después de abrir cada PR, pará y esperá a que te diga "mergeado".
4. Solo los criterios de aceptación de ese issue. No toques la vista previa, el aviso USD ni el total comprometido (otra sesión los está haciendo en paralelo).
5. Reglas: cada operación (pausar, reanudar, cancelar, editar) es una RPC que usa el hoy del servidor y pone al día esa suscripción antes de cambiarla (ADR-030); el update directo sobre subscriptions sigue revocado; reanudar no rellena los meses pausados; cancelar es irreversible y no borra lo ya generado; editar no cambia las transacciones ya registradas. Montos con Decimal, data-testid en todo elemento interactivo, textos exactos del issue.

Migraciones
6. Timestamp posterior al último de supabase/migrations/ en main. Revisión con rls-migration-reviewer y supabase-postgres-best-practices. pgTAP con pgtap-writer: transiciones válidas e inválidas (por ejemplo, pausar una cancelada o reanudar una activa tienen que fallar con el mensaje del issue), que reanudar no rellene, que editar no toque el pasado, y el par RLS de cada RPC (otra sesión no puede operar sobre una suscripción ajena; anon → 42501).
7. npm run gen:types después de cada migración. NO apliques migraciones a producción (nada de supabase db push); las aplico yo.

Cierre de cada PR
8. domain-purity-reviewer si tocás src/; npm test, npm run test:db y npm run build en verde; /code-review antes de abrir el PR.

No diseñes ni ejecutes casos CP-*. No commitees .env.
```

**Sesión 4 · Borrar un mes y marcar los movimientos**

```text
Implementá, en este orden, los issues #218 (US-60) y #219 (US-61) de Joaconz/Biyu. Después, un último PR de docs.

Antes de empezar
1. Leé AGENTS.md, CLAUDE.md, los dos issues y solo los docs que citan. De entrega-2/historias/suscripciones.md leé "Cómo leer este documento" y "Supuestos y pendientes" §4. ADR que mandan: 017 y 030; C10 e I10 (soft delete).
2. Tienen que estar en main US-52 a US-59 (#210 a #217). Si falta alguno, pará y avisame.

Por cada issue
3. Rama us/NN-slug desde main. Un PR por issue con "Closes #NN". Después de abrir cada PR, pará y esperá a que te diga "mergeado".
4. Solo los criterios de aceptación de ese issue.
5. Reglas: borrar un mes generado es el soft delete de siempre (deleted_at), y la puesta al día no lo vuelve a generar (verificalo con pgTAP corriendo catch_up_subscriptions después del borrado); la marca de suscripción en Movimientos, Resumen y Detalle sale de subscription_id, no del nombre. Montos con Decimal, data-testid en todo elemento interactivo, textos exactos del issue.
6. Si necesitás una migración: timestamp posterior al último en main, rls-migration-reviewer, supabase-postgres-best-practices, pgtap-writer y npm run gen:types. NO la apliques a producción (nada de supabase db push).

PR de docs (rama docs/trazabilidad-suscripciones, sin Closes)
7. Lo que falta de "Supuestos y pendientes" §4: 08-trazabilidad.md (US-75 en sus tres lugares y el mapeo FR → US completo que da ese punto) y 02-behavior-spec.md línea 7. Pasá el agente spec-consistency-checker antes de abrir el PR.

Cierre de cada PR
8. npm test, npm run test:db y npm run build en verde; /code-review antes de abrir el PR.

No diseñes ni ejecutes casos CP-*. No commitees .env.
```

### 5.5 Navegación, Resumen por categoría e Importar Excel, en tres sesiones (2026-10-08)

| Sesión | Issues | PR |
|---|---|---|
| A · Navegación y guardado | #233 (US-69), #234 (US-70) | #273, #275 |
| B · Resumen por categoría | #242 (US-72), #243 (US-73) | #276, #281 |
| C · Importar Excel | #204, #205, #206, #207 (US-74, US-76, US-77, US-78) | #277, #278, #279, #280 |

**Sesión A · Barra de navegación y aviso de error con reintento**

```text
Implementá, en este orden, los issues #233 (US-69) y #234 (US-70) de Joaconz/Biyu.

Antes de empezar
1. Leé AGENTS.md, CLAUDE.md, los dos issues y solo los docs que citan. La spec completa está en entrega-2/historias/navegacion.md (leé también "Supuestos" y "Pendientes fuera de este archivo"). ADR que mandan: 023, 024 y 034. Mocks: entrega-2/mocks/navegacion-barra.html y registrar-guardado.html.
2. Partí de main actualizado. Si necesitás algo que no está en main, pará y avisame.

Por cada issue
3. Rama us/NN-slug desde main. Un PR por issue con "Closes #NN". Después de abrir cada PR, pará y esperá a que te diga "mergeado"; el siguiente arranca desde main actualizado.
4. Solo los criterios de aceptación de ese issue. Textos, rótulos y avisos exactos como en el issue. data-testid en todo elemento interactivo, sin duplicados (la barra es un solo <nav> para celular y computadora, ADR-023).

US-69
5. Cambia la navegación global (AppNav): Registrar, Resumen, Deudas y Suscripciones. Respetá el área segura del celular y los estados del issue. Revisá con la skill mobile-native. Si algún test e2e de e2e/ dependía de Movimientos en la barra, actualizalo.

US-70
6. Migración según ADR-034: create_transaction suma p_request_id uuid default null (sigue siendo una sola llamada, C4), transactions suma request_id con índice único parcial (user_id, request_id). Reintentar con la misma clave devuelve la transacción ya creada y no duplica, también cuando el gasto es compartido y crea deuda (supuesto 6). Revisión con el agente rls-migration-reviewer y la skill supabase-postgres-best-practices; pgTAP con pgtap-writer (misma clave dos veces → una sola transacción; otra sesión no puede reutilizar una clave ajena; anon → 42501). Después, npm run gen:types.
7. Movimientos pendientes en el dispositivo según la sección "Movimientos pendientes": guardados con el user_id, se borran al cerrar sesión, nunca reemplazan a una transacción guardada. La lógica de clasificar errores (red, rechazo, sesión vencida) va en src/domain o en src/lib, no en el componente; con tests en tests/domain/.
8. Docs que tocan este issue, de "Pendientes fuera de este archivo": 04-data-model (columna e invariante), 01-domain-glossary ("movimiento pendiente", "clave de idempotencia"), docs/12-procedimientos-de-prueba.md PR-04 y PR-08 (request_id y p_request_id) y 08-trazabilidad (US-69 y US-70). No toques entrega-1/ ni docs/pre-entrega.md.
9. NO apliques migraciones a producción: nada de supabase db push ni del Supabase hosteado. Solo base local; las aplico yo.

Cierre de cada PR
10. Agente domain-purity-reviewer si tocás src/; npm test, npm run test:db y npm run build en verde; /code-review antes de abrir el PR.

No diseñes ni ejecutes casos CP-*. No commitees .env.
```

**Sesión B · Torta por categoría y detalle de categoría**

```text
Implementá, en este orden, los issues #242 (US-72) y #243 (US-73) de Joaconz/Biyu.

Antes de empezar
1. Leé AGENTS.md, CLAUDE.md, los dos issues y solo los docs que citan. La spec completa está en entrega-2/historias/dashboard-categorias.md: leé "Reglas comunes a las dos historias", "Datos de ejemplo" y "Supuestos de este documento". ADR que mandan: 001, 023 y 038. Mocks: entrega-2/mocks/dashboard-categorias-resumen.html y dashboard-categorias-detalle.html.
2. Partí de main actualizado. Si necesitás algo que no está en main, pará y avisame.

Por cada issue
3. Rama us/NN-slug desde main. Un PR por issue con "Closes #NN". Después de abrir cada PR, pará y esperá a que te diga "mergeado".
4. Solo los criterios de aceptación de ese issue. Textos exactos, colores con los tokens de src/index.css (ADR-023), data-testid en todo elemento interactivo.
5. Reglas:
   - La torta se dibuja con SVG propio, sin librería de gráficos (ADR-038).
   - Los montos salen de las imputaciones guardadas del mes en ARS (amount_ars, ADR-001), sin recalcular el prorrateo y sin las transacciones borradas (I10).
   - Montos con Decimal, nunca number; los ángulos de la torta se calculan a partir de esos Decimal, en una función pura de src/domain/ con tests en tests/domain/ que usen los "Datos de ejemplo" de la spec.
   - El período y la categoría elegida viven en la URL (C11).
   - El detalle de categoría lee solo datos del usuario (RLS, C7).
6. Si necesitás una migración (por ejemplo, una vista o RPC de lectura): timestamp posterior al último de supabase/migrations/ en main, revisión con rls-migration-reviewer y supabase-postgres-best-practices, par RLS en pgTAP con pgtap-writer y npm run gen:types. NO la apliques a producción (nada de supabase db push).
7. Accesibilidad: la torta tiene que tener una alternativa en texto (la lista con los montos) y ser operable con teclado; revisá con la skill design:accessibility-review.

Cierre de cada PR
8. Agente domain-purity-reviewer; npm test, npm run test:db y npm run build en verde; /code-review antes de abrir el PR.

No diseñes ni ejecutes casos CP-*. No commitees .env.
```

**Sesión C · Importar gastos desde un Excel**

```text
Implementá, en este orden, los issues #204 (US-74), #205 (US-76), #206 (US-77) y #207 (US-78) de Joaconz/Biyu.

Antes de empezar
1. Leé AGENTS.md, CLAUDE.md, los cuatro issues y solo los docs que citan. La spec completa está en entrega-2/historias/importar-excel.md: las historias apuntan a su "Especificación compartida" (secciones 1 a 13), que es la que manda en textos, validaciones (A1…, F1…F17) y data-testid. ADR que mandan: 005, 013, 021, 023 y 035. Archivo de ejemplo: entrega-2/mocks/importar-excel-ejemplo.xlsx (sección 6 tiene el resumen esperado).
2. Partí de main actualizado. Si necesitás algo que no está en main, pará y avisame.

Por cada issue
3. Rama us/NN-slug desde main. Un PR por issue con "Closes #NN". Después de abrir cada PR, pará y esperá a que te diga "mergeado".
4. Solo los criterios de aceptación de ese issue. Textos exactos de la spec, data-testid de la sección 12.
5. Reglas:
   - Montos con Decimal (nunca number), también al leer celdas numéricas del Excel.
   - "Hoy" es todayInArgentina() (ADR-021), como en Registrar.
   - El monto en ARS de las filas en USD usa half-up a 2 decimales (ADR-013).
   - La lectura y la validación fila por fila van en funciones puras de src/domain/ con tests en tests/domain/ (incluí el archivo de ejemplo y cada regla F1…F17); la validación real se repite en Postgres (C6).
6. Librería para leer y generar .xlsx en el navegador: elegí una mantenida y sin vulnerabilidades conocidas, cargada solo en la pantalla de importación (lazy import). Si la elección no es obvia, registrala con /new-adr.

Migración (US-77 y US-78)
7. RPC import_transactions según ADR-035: una sola llamada para todo el lote, cada fila con las mismas reglas e imputaciones que create_transaction (C3, C4, I4), y reintentar no duplica (sección 7). Revisión con rls-migration-reviewer y supabase-postgres-best-practices. pgTAP con pgtap-writer: par RLS (otra sesión → 0 filas, anon → 42501), filas inválidas rechazadas por la base, idempotencia del reintento y la suma de imputaciones = monto. Después, npm run gen:types.
8. NO apliques migraciones a producción: nada de supabase db push ni del Supabase hosteado. Solo base local; las aplico yo.
9. Lo que la spec deja fuera de alcance (sección 9) queda fuera, aunque docs/pendientes.md lo mencione (por ejemplo, cuotas en la plantilla).

Cierre de cada PR
10. Agente domain-purity-reviewer; npm test, npm run test:db y npm run build en verde; /code-review antes de abrir el PR.

No diseñes ni ejecutes casos CP-*. No commitees .env.
```

## 6. Prompt para corregir un defecto

La consigna pide pasarle a la IA los reportes de defectos para que los corrija. Santiago corrigió los
22 defectos de V1 confirmados en la Entrega 1 con Claude Code (Claude Opus 5.5), con un test de
regresión por cada fix (`docs/07-plan-de-testing.md` §5, PR #187). La plantilla es esta:

```text
Corregí el defecto DEF-NNN (issue #NN) de Joaconz/Biyu. Solo ese defecto.
Leé AGENTS.md, CLAUDE.md, el issue y docs/07-plan-de-testing.md §5. Primero escribí el test que reproduce el defecto y falla; después el fix. Rama fix/def-NNN, PR con "Closes #NN" y la ruta del test de regresión. No cierres el defecto: lo confirma quien lo reportó.
```

Los 22 son DEF-005 a DEF-028, sin DEF-017 ni DEF-022, que se corrigieron y verificaron durante la
Entrega 1 (PR #173 y #176), igual que DEF-001 y DEF-004 (PR #163 y #162).

| PR | Defectos | Fecha |
|---|---|---|
| #183 | DEF-009, DEF-016, DEF-019 (schema) | 2026-10-02 |
| #188 | DEF-005, DEF-008, DEF-014 (acceso y rutas) | 2026-10-03 |
| #189 | DEF-012, DEF-013, DEF-018, DEF-020 (montos y tipo de cambio) | 2026-10-03 |
| #190 | DEF-021 (montos grandes en el celular) | 2026-10-03 |
| #191 | DEF-010, DEF-011, DEF-015 (cuentas y Ajustes) | 2026-10-05 |
| #192 | DEF-006, DEF-007 (eliminadas y categorías archivadas) | 2026-10-05 |
| #198 | DEF-023 a DEF-028 | 2026-10-05 |

La confirmación de que esos defectos quedaron resueltos en V2 está en `03-seleccion-regresion.md` §5.
Los defectos de V2 (DEF-030 a DEF-037) todavía no se le pasaron a la IA: no tienen issue.

## 7. IA en las actividades de Testing

La consigna no pide IA en Testing, pero se usó y se declara:

- **Revisión de las specs y los casos:** los agentes `spec-critic` y `spec-consistency-checker` sobre
  cada historia y sobre los casos de V2.
- **Ejecución:** Claude Code ejecutó 161 casos de V2 y los 60 casos de la regresión de V1 con
  Playwright y pedidos directos a la API. Cada sesión partía de un
  plan con los casos a ejecutar, la regla para decidir PASSED, FAILED o BLOCKED y la prohibición de
  cambiar un resultado a mano. Quién ejecutó cada caso está en `06-reporte-de-ejecucion.md` §3.
- **Reportes:** el agente `docs-writer` redactó los reportes de ejecución y de defectos con el formato
  de la Entrega 1. Los números se verificaron contra las planillas.
- **Repaso manual:** después de la ejecución con Claude Code, el equipo repasó a mano todos los casos de V2
  y los 60 de la regresión.

## 8. Registro de sesiones de implementación

Herramienta según el historial de git: «Claude Code» cuando el commit lleva `Co-Authored-By` de
Claude, «Claude Code (web)» cuando el PR enlaza una sesión de claude.ai/code.

| Historia | Issue | PR | Prompt | Herramienta |
|---|---|---|---|---|
| US-34 | #224 | #235 | 5.1 | Claude Code (web) |
| US-41 | #231 | #236 | 5.1 | Claude Code, Opus 5.5 |
| US-38 | #228 | #237 | 5.1 | Claude Code, Opus 5.5 |
| US-35 | #225 | #239 | 5.1 | Claude Code, Opus 5.5 |
| US-37 | #227 | #241 | 5.2 | Claude Code, Opus 5.5 |
| US-47 | #201 | #245 | 5.2 | Sin co-autor de IA en el commit (prompt de Antigravity) |
| US-39 | #229 | #246 | 5.3 | Claude Code, Opus 5.5 |
| US-40 | #230 | #247 | 5.3 | Claude Code, Opus 5.5 |
| US-36 | #226 | #249 | 5.1 | Claude Code, Opus 5.5 |
| US-30 | #223 | #250 | 5.1 | Claude Code, Opus 5.5 |
| US-79 | #238 | #252 | 5.2 | Claude Code, Opus 5.5 |
| US-52 a US-55 | #210 a #213 | #251, #255, #256, #257 | 5.4, sesión 1 | Claude Code, Opus 5.5 (Santiago) |
| US-75, US-62, US-63 | #222, #220, #221 | #258, #260 | 5.4, sesión 2 | Claude Code (web) |
| US-56 a US-59 | #214 a #217 | #259, #261, #262, #263 | 5.4, sesión 3 | Claude Code (web) |
| US-60, US-61 | #218, #219 | #265, #266 | 5.4, sesión 4 | Claude Code (web) |
| US-69, US-70 | #233, #234 | #273, #275 | 5.5, sesión A | Claude Code, Opus 5.5 |
| US-72, US-73 | #242, #243 | #276, #281 | 5.5, sesión B | Claude Code, Opus 5.5 |
| US-74, US-76, US-77, US-78 | #204 a #207 | #277, #278, #279, #280 | 5.5, sesión C | Claude Code (web) |

US-80 a US-84 se especificaron pero no se implementaron: sus casos quedan fuera del catálogo o
`BLOCKED` (`06-reporte-de-ejecucion.md`).
