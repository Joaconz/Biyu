# Guía de inicio

_Instalar el repo, levantar todo en tu máquina y trabajar con Codex o Antigravity usando `gh`. Sin
vueltas: copiá y pegá de arriba hacia abajo._

---

## 1. Herramientas (una sola vez)

| Herramienta | Para qué |
|---|---|
| Git | Control de versiones |
| GitHub CLI (`gh`) | Issues, ramas y PRs desde la terminal |
| Node 22 o más nuevo | Correr la app y los tests |
| Docker Desktop | Supabase local (la base para probar) |
| Supabase CLI | Levantar esa base y correr los tests de la base |
| Tu IA: Codex o Antigravity | Ver la sección 5 |

**macOS (Homebrew)**

```bash
brew install git gh node supabase/tap/supabase
brew install --cask docker
```

**Windows** (PowerShell; Supabase CLI va por Scoop)

```powershell
winget install Git.Git GitHub.cli OpenJS.NodeJS.LTS Docker.DockerDesktop
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

Abrí **Docker Desktop** y dejalo corriendo. Sin eso, nada de Supabase funciona.

## 2. Clonar e instalar

Necesitás ser colaborador del repo (pedíselo a quien lo administra). Después:

```bash
gh auth login
gh repo clone Joaconz/Biyu
cd Biyu
npm ci
git config core.hooksPath .agents/hooks/git
```

La última línea activa el pre-commit que frena secretos, `.env` y datos reales (repo público, C13 y C14).
**Es obligatoria**: con Codex o Antigravity es la única protección, porque los hooks de Claude Code no
corren ahí. Nunca uses `--no-verify`.

## 3. Base local y variables

```bash
supabase start
supabase status -o env
cp .env.example .env
```

`supabase start` la primera vez baja imágenes (varios minutos) y aplica solo las migraciones de
`supabase/migrations/`. Después abrí `.env` y completá:

| Variable | Valor |
|---|---|
| `VITE_SUPABASE_URL` | el `API_URL` que mostró `supabase status` (normalmente `http://127.0.0.1:54321`) |
| `VITE_SUPABASE_ANON_KEY` | el `ANON_KEY` de esa misma salida |

Son claves de la base **local** y no protegen nada, pero `.env` igual nunca se commitea. La `service_role`
jamás va en el cliente (C8).

## 4. Correr y probar

| Comando | Qué hace |
|---|---|
| `npm run dev` | Levanta la app en <http://localhost:5173>. Creá tu usuario en `/signup` |
| `npm test` | Tests del dominio (Vitest). No necesita Docker |
| `npm run test:db` | Tests de la base (pgTAP). Necesita `supabase start` |
| `npm run build` | Lo mismo que corre Vercel; tiene que compilar sin errores |

Antes de abrir un PR: `npm test`, `npm run test:db` y `npm run build` en verde. La CI corre lo mismo.

## 5. Trabajar con Codex o Antigravity

**Instalar**

- **Codex:** `npm install -g @openai/codex` y después `codex` dentro de la carpeta del repo. Inicia sesión
  con tu cuenta de ChatGPT.
- **Antigravity:** es un IDE, se descarga de <https://antigravity.google> (no tiene comando de instalación).
  Abrí la carpeta del repo desde el IDE.

**Qué leen solos:** el `AGENTS.md` de la raíz (que manda a `CLAUDE.md`, las reglas del proyecto) y las
skills de `.agents/skills/`: `new-test-case`, `new-adr`, `gh`, `supabase`, `playwright-cli`, etc. Los
subagentes de `.agents/agents/` no se activan solos: pedíselos como prompt ("actuá según
`.agents/agents/rls-migration-reviewer.md` y revisá esta migración").

**Prompt para arrancar una historia** (cambiá el número):

```text
Leé CLAUDE.md y el issue #35 (gh issue view 35). Creá la rama us/35-<slug> desde main, implementá la
historia siguiendo las reglas de CLAUDE.md, corré npm test y npm run build, y abrí el PR contra main
con "Closes #35". No pushees a otra rama que no sea la tuya.
```

Dejá que la IA use `gh`: ya está autenticado con tu cuenta.

## 6. Flujo de todos los días con `gh`

```bash
gh issue list --milestone V1 --assignee @me     # mis tareas
gh issue view 35                                 # leer una historia
git switch main && git pull
git switch -c us/35-cuotas                       # una rama por historia
# ... trabajar, commitear ...
git push -u origin us/35-cuotas
gh pr create --base main --title "US-12 · Indicar cuotas" --body "Closes #35"
gh pr checks --watch                             # esperar la CI
```

- **`--base main` siempre.** Un PR apilado sobre otra rama, mergeado por error, ya nos costó un revert.
- Tablero (Project Biyu): tarjeta a **En desarrollo** cuando arrancás y a **Listo para probar** cuando se
  mergea. "Hecho" es recién con los casos de prueba ejecutados.
- Migraciones nuevas en `supabase/migrations/`: revisalas con el agente `rls-migration-reviewer` antes de
  commitear. Tras un `git pull` que traiga migraciones, corré `supabase db reset`.

## 7. Si algo falla

| Síntoma | Qué hacer |
|---|---|
| `Cannot connect to the Docker daemon` | Abrir Docker Desktop y esperar que arranque |
| `Faltan VITE_SUPABASE_URL…` al abrir la app | Falta el `.env`; completalo y reiniciá `npm run dev` |
| `supabase start` dice que el puerto está ocupado | Tenés otra base local: `supabase stop` en el otro clon |
| El pre-commit te frena | Leé el mensaje, sacá lo que marca del commit. No lo saltees |
| `npm run test:db` falla al conectar | Falta `supabase start` |
