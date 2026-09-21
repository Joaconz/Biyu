#!/usr/bin/env bash
# PreToolUse (Bash): cierra los rodeos de block-secrets.sh, que solo mira Write|Edit.
# El repo es público desde el primer commit (C13, C14, docs/05-repo-publico.md).
#   1. `git add -f` / `--force`: saltea el .gitignore y mete .env, CSV, PDF o dumps.
#   2. `--no-verify`: saltea el pre-commit de .agents/hooks/git/.
#   3. Leer o escribir .env* por shell (el `deny` de Read/Edit solo cubre esas herramientas).
set -uo pipefail

input=$(cat)
cmd=$(jq -r '.tool_input.command // ""' <<<"$input")
[ -z "$cmd" ] && exit 0

block() { echo "Bloqueado: $1" >&2; exit 2; }

if grep -Eq 'git[[:space:]]+add([[:space:]]+[^;&|]*)?[[:space:]](-[a-zA-Z]*f[a-zA-Z]*|--force)([[:space:]]|$)' <<<"$cmd"; then
  block "\`git add -f\` saltea el .gitignore y puede meter secretos o datos reales al repo público (C13, C14). Agregá los archivos sin --force; si el archivo está ignorado, es a propósito."
fi

if grep -Eq 'git[[:space:]].*--no-verify' <<<"$cmd"; then
  block "\`--no-verify\` saltea el pre-commit que frena secretos y datos reales (C13, C14). Arreglá lo que reporta el hook en vez de saltearlo."
fi

# Comandos de git no tocan el contenido de .env; el resto sí se revisa.
if ! grep -Eq '^[[:space:]]*git[[:space:]]' <<<"$cmd"; then
  hits=$(grep -oE "(^|[[:space:]/'\"=<>])\.env(\.[A-Za-z0-9_-]+)?([[:space:]'\";|&<>]|$)" <<<"$cmd" \
    | grep -Ev '\.env\.example' || true)
  if [ -n "$hits" ]; then
    block "el comando toca un archivo .env*, que puede tener credenciales (C13). Usá variables de entorno y editá .env.example (con valores vacíos) para documentar las claves."
  fi
fi
exit 0
