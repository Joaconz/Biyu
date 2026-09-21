#!/usr/bin/env bash
# PreToolUse (Write|Edit): frena escrituras que parecen contener credenciales.
# El repo es público desde el primer commit (C13, docs/05-repo-publico.md).
set -uo pipefail

input=$(cat)
path=$(jq -r '.tool_input.file_path // ""' <<<"$input")
content=$(jq -r '.tool_input.content // .tool_input.new_string // ""' <<<"$input")

# Permitidos: plantillas y este mismo hook.
case "$path" in
  *.env.example|*/.claude/hooks/block-secrets.sh) exit 0 ;;
esac

# JWT (anon/service_role), claves Google AI, claves secretas de Supabase, claves privadas.
pattern='eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}|AIza[0-9A-Za-z_-]{30,}|AQ\.[A-Za-z0-9_-]{30,}|sb_secret_[A-Za-z0-9_-]{10,}|-----BEGIN [A-Z ]*PRIVATE KEY-----|postgres(ql)?://[^:@[:space:]]+:[^@[:space:]]+@'

if grep -Eq "$pattern" <<<"$content"; then
  echo "Bloqueado: el contenido parece incluir una credencial (JWT, API key o URL de conexión con contraseña). El repo es público (C13): usá una variable de entorno y dejá el valor vacío en .env.example." >&2
  exit 2
fi

case "$path" in
  *.csv|*.pdf|*.dump)
    echo "Bloqueado: los CSV/PDF/dumps no entran al repo (C13, C14). Usá datos ficticios en un fixture de otro formato." >&2
    exit 2 ;;
esac
exit 0
