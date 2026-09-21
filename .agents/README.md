# .agents/ — configuración para agentes de IA

Copia de las skills, agentes y hooks de Biyu en una carpeta neutral, para que las use cualquier
herramienta y no solo Claude Code. Las reglas del proyecto están en `CLAUDE.md` en la raíz.

```
.agents/
  skills/    # estándar abierto de skills (SKILL.md). Lo leen Codex, Cursor, Gemini CLI, OpenCode, etc.
  agents/    # subagentes en Markdown con frontmatter (formato Claude Code; en otras herramientas, usarlos como prompt)
  hooks/     # scripts de shell
    block-secrets.sh        # Claude Code, PreToolUse (Write|Edit)
    guard-git-staging.sh    # Claude Code, PreToolUse (Bash)
    lint-migration.sh       # Claude Code, PostToolUse (Write|Edit); también corre a mano: lint-migration.sh <archivo.sql>
    git/pre-commit          # hook de git: funciona con cualquier herramienta
```

## Relación con `.claude/`

**Son copias, no enlaces.** `.claude/skills/`, `.claude/agents/` y `.claude/hooks/` y esta carpeta
tienen el mismo contenido, cada una autosuficiente: Claude Code usa la suya (`settings.json` apunta a
`.claude/hooks/`) y las demás herramientas usan `.agents/`. Lo que es propio de Claude
(`settings.json`, `settings.local.json`, `worktrees/`) no se copia. `git/pre-commit` vive solo acá,
porque es de git y no de Claude.

**El costo de tener dos copias es que pueden divergir.** Si editás una skill, agente o hook en un
lado, aplicá el mismo cambio en el otro. Para detectar diferencias:

```
diff -rq .claude/skills .agents/skills
diff -rq .claude/agents .agents/agents
diff -rq .claude/hooks .agents/hooks   # "Only in .agents/hooks: git" es lo esperado
```

Las skills externas se instalan con copias reales en ambos lados y registran la versión en
`skills-lock.json`:

```
npx skills add <repo> -s <skill> -a codex -a claude-code --copy
```

## Activar el pre-commit (una vez por clon)

```
git config core.hooksPath .agents/hooks/git
```

Frena: archivos `.env*` (salvo `.env.example`), CSV/PDF/dumps, credenciales en las líneas agregadas y
migraciones que no cumplen C2/C7 (ver `lint-migration.sh`). Es la capa que protege el repo público
aunque el commit lo haga otra herramienta o una persona.

## Qué hay

| Tipo | Nombre | Para qué |
|---|---|---|
| Skill | `new-test-case` | Casos de prueba con el formato del plan de testing |
| Skill | `new-adr`, `to-spec` | ADR con el formato del repo · specs a partir de la conversación |
| Skill | `gh`, `playwright-cli`, `find-skills` | GitHub CLI · automatización de navegador y tests · descubrir skills |
| Skill (externa) | `supabase`, `supabase-postgres-best-practices` | Buenas prácticas de Supabase/Postgres, antes de tocar migraciones |
| Skill (externa) | `emil-design-eng`, `mobile-native` | Detalle de UI · que la PWA se sienta nativa en el celular |
| Agente | `spec-critic`, `spec-consistency-checker`, `docs-writer` | Atacar specs · coherencia de `docs/` · redactar reportes |
| Agente | `rls-migration-reviewer`, `test-adversary` | Revisar migraciones y RLS · probar la app buscando romperla |
| Agente | `domain-purity-reviewer` | Revisa `src/` contra C1, C2, C5 |
| Agente | `pgtap-writer` | Escribe tests pgTAP en `tests/db/` (C7, I1–I17) |
