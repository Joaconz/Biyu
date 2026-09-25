# Biyu

Control de gastos personales para Argentina: dos monedas (ARS/USD), compras en cuotas y gastos
compartidos con reembolso. TP integrador de **Testing de Aplicaciones**: el objetivo primario es el
trabajo de calidad (requerimientos, casos de prueba, ADRs), no solo la app. Idioma: prosa y UI en
español rioplatense; nombres de código en inglés.

## Estado

Scaffold hecho: Vite + React + TypeScript con `@supabase/supabase-js` (`src/lib/supabase.ts`),
migraciones en `supabase/migrations/` y deploy en Vercel (`vercel.json`). La UI todavía es la
plantilla de Vite. Todavía no hay Tailwind, shadcn/ui ni scripts de test: no inventes comandos de
test; cuando existan, agregalos acá.

Stack planificado: React (Vite) + TypeScript + PWA · Supabase (Postgres, Auth, RLS, Edge Functions)
· Tailwind + shadcn/ui · Vitest, pgTAP, Playwright. Fuente de verdad: `docs/03-architecture-spec.md`
y `docs/adr/019-vuelta-a-supabase.md` (los ADR 016 y 018 describen la API Python, ya revertida).

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Levanta Vite. Lee `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` de `.env` (copiá `.env.example`) |
| `npm run build` | `tsc -b` + build de producción en `dist/` (lo mismo que corre Vercel) |
| `npm run preview` | Sirve `dist/` localmente |
| `npm run gen:types` | Regenera `src/lib/database.types.ts` desde Supabase local (`supabase start` antes) |
| `/speckit-checklist <foco>` | Checklist de calidad de redacción de los NFR; la feature es `specs/nfr/`, que apunta a `docs/pre-entrega.md` §4 |

## Dónde está cada cosa

| Necesitás | Leé |
|---|---|
| Vocabulario (Transaction, LedgerEntry, Period…) | `docs/01-domain-glossary.md` |
| Qué debe hacer el sistema (FR, reglas R*) | `docs/02-behavior-spec.md` |
| Constraints C1–C15 y estructura del repo | `docs/03-architecture-spec.md` |
| Schema e invariantes I1–I17 | `docs/04-data-model.md` |
| Higiene del repo público | `docs/05-repo-publico.md` |
| Testing: técnicas, defectos, propiedad cruzada | `docs/07-plan-de-testing.md` |
| FR/NFR → historias → issues → casos | `docs/08-trazabilidad.md` |
| Backlog y tablero (épicas, historias V1, tareas) | [Project Biyu](https://github.com/users/Joaconz/projects/3), milestones V1–V3 |
| Por qué se decidió X | `docs/adr/` |

## Reglas que no se negocian

- **Montos nunca en `float`/`number`.** `numeric(14,2)` en Postgres, `decimal.js` en TS. PostgREST
  devuelve `numeric` como string: no lo parsees a `number` (C2, ADR-013).
- **La suma de las imputaciones = el monto de la transacción**, la última cuota absorbe el resto (C3).
- **Crear una transacción es una sola llamada RPC** (`create_transaction`), nunca inserts sueltos a
  `transactions`/`ledger_entries`/`debts` (C4). El dashboard lee imputaciones materializadas, no
  recalcula el prorrateo (ADR-001).
- **El tipo de cambio se congela en la transacción**; nada reescribe el pasado (C5, ADR-002).
- **Validación real en Postgres**; Zod en el cliente es solo UX (C6). Cada caso negativo se prueba
  por la UI y directo contra la API/RPC.
- **RLS es la única autorización** (`user_id = auth.uid()`). Toda tabla nueva lleva políticas y su
  par de tests pgTAP (otra sesión y rol `anon` → cero filas) (C7).
- **Lógica de negocio fuera de los componentes**: funciones puras en `src/domain/`, o Postgres.
  `today` entra como parámetro, nunca se lee el reloj (C1).
- **Soft delete** en transacciones (`deleted_at`); todo KPI filtra las borradas (C10, I10).
- **El período y los filtros viven en la URL** (C11).
- **Todo elemento interactivo lleva `data-testid`** (`<pantalla>-<elemento>`, kebab-case). La
  automatización de V3 depende de eso (`docs/07-plan-de-testing.md` §2).
- **Decisión no obvia → ADR nuevo** en `docs/adr/` (C12). Skill: `/new-adr`.

## Repo público: qué nunca entra a git (C13, C14)

- Secretos: `.env*` (salvo `.env.example` con valores vacíos), `service_role key`, contraseñas de DB,
  claves de terceros. La `anon key` es pública por diseño; la `service_role` **nunca** va al cliente (C8).
- Datos reales: CSV, PDF, dumps, capturas con totales reales. Semillas, fixtures y ejemplos usan
  montos ficticios.
- Si algo se filtra: **rotar primero**, limpiar el historial después.

Un hook (`.claude/hooks/block-secrets.sh`) bloquea escrituras con patrones de credenciales, y
`.claude/settings.json` niega leer/editar `.env`. `.agents/hooks/guard-git-staging.sh` cubre los
rodeos por Bash (`git add -f`, `--no-verify`, leer `.env*`) y `.agents/hooks/git/pre-commit` repite
el chequeo al commitear para cualquier herramienta (activarlo: `git config core.hooksPath .agents/hooks/git`).

## Skills, agentes y hooks: `.agents/`

`.agents/` es una **copia** de `.claude/skills`, `.claude/agents` y `.claude/hooks` para que las use
cualquier IA (sin symlinks; ver `.agents/README.md`). Si editás una skill, agente o hook, aplicá el
cambio en las dos carpetas (`diff -rq` las compara). Skills externas:
`npx skills add <repo> -s <skill> -a codex -a claude-code --copy`. Migraciones nuevas también
pasan por `lint-migration.sh` (hook automático) y, para schema, la skill `supabase-postgres-best-practices`.

## Cómo trabajar acá

- Cada historia es un issue `US-nn` bajo su épica (`docs/08-trazabilidad.md`). Las tareas se abren
  como sub-issues recién cuando la historia arranca. Columnas del tablero y definición de "Hecho":
  `docs/07-plan-de-testing.md` §1.
- Ramas por historia de usuario, PR contra `main` con descripción (`Closes #n`). Commits que digan qué y por qué;
  nada de `fix`/`wip` en `main`.
- Antes de tocar una migración de `supabase/migrations/`, usá el agente `rls-migration-reviewer` y la
  skill `supabase-postgres-best-practices`.
- Al editar docs, mantené el vocabulario del glosario y las referencias cruzadas (C*, I*, R*, ADR-*).
  El agente `spec-consistency-checker` verifica que no se contradigan.
- Cambios de contrato (schema o Edge Functions) aparecen como diff en el PR (C15); los tipos de
  cliente salen de `supabase gen types typescript`.
