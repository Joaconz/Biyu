#!/usr/bin/env bash
# Lint de migraciones de Supabase contra las constraints de Biyu. Dos modos:
#   - Claude Code, PostToolUse (Write|Edit): sin argumentos, lee el JSON del hook por stdin.
#   - Cualquier otra herramienta / git pre-commit: pasar los .sql como argumentos.
# Solo mira supabase/migrations/*.sql. Sale con 2 y explica por stderr si algo no cumple;
# el agente rls-migration-reviewer sigue siendo la revisión completa, esto es el piso.
set -uo pipefail

files=("$@")
if [ ${#files[@]} -eq 0 ]; then
  input=$(cat)
  path=$(jq -r '.tool_input.file_path // ""' <<<"$input")
  [ -n "$path" ] && files=("$path")
fi

problems=()

for f in "${files[@]}"; do
  case "$f" in
    */supabase/migrations/*.sql|supabase/migrations/*.sql) ;;
    *) continue ;;
  esac
  [ -f "$f" ] || continue

  # Sin comentarios `--`, todo en minúscula y en una sola línea, para poder buscar patrones.
  sql=$(sed -E 's/--.*$//' "$f" | tr '[:upper:]' '[:lower:]' | tr '\n' ' ')
  name=$(basename "$f")

  # C7: toda tabla nueva lleva RLS y políticas.
  while read -r table; do
    [ -z "$table" ] && continue
    t=${table##*.}
    t=${t//\"/}
    if ! grep -Eq "alter[[:space:]]+table[[:space:]]+(only[[:space:]]+)?(if[[:space:]]+exists[[:space:]]+)?([a-z0-9_\"]+\.)?\"?${t}\"?[[:space:]]+enable[[:space:]]+row[[:space:]]+level[[:space:]]+security" <<<"$sql"; then
      problems+=("$name: la tabla \`$t\` no hace \`enable row level security\` (C7).")
    fi
    if ! grep -Eq "create[[:space:]]+policy[[:space:]]+[^;]*[[:space:]]on[[:space:]]+([a-z0-9_\"]+\.)?\"?${t}\"?[[:space:]]" <<<"$sql"; then
      problems+=("$name: la tabla \`$t\` no tiene \`create policy\` en esta migración (C7). Si va en otra, documentalo en el PR.")
    fi
  done < <(grep -oE 'create[[:space:]]+table[[:space:]]+(if[[:space:]]+not[[:space:]]+exists[[:space:]]+)?[a-z0-9_."]+' <<<"$sql" | awk '{print $NF}')

  # C2: montos y tipos de cambio en numeric, nunca en coma flotante ni `money`.
  if grep -Eq '(^|[^a-z0-9_])(float[48]?|real|double[[:space:]]+precision|money)([^a-z0-9_]|$)' <<<"$sql"; then
    problems+=("$name: usa float/real/double precision/money. Montos en \`numeric(14,2)\` y tipo de cambio en \`numeric(14,4)\` (C2, ADR-013).")
  fi

  # Seguridad: security definer sin search_path fijo permite secuestrar la función.
  if grep -Eq 'security[[:space:]]+definer' <<<"$sql" && ! grep -Eq 'set[[:space:]]+search_path' <<<"$sql"; then
    problems+=("$name: función \`security definer\` sin \`set search_path\`. Fijalo (p. ej. \`set search_path = ''\`).")
  fi
done

if [ ${#problems[@]} -gt 0 ]; then
  echo "lint-migration: la migración no cumple constraints de Biyu:" >&2
  printf '  - %s\n' "${problems[@]}" >&2
  exit 2
fi
exit 0
