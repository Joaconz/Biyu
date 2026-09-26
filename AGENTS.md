# AGENTS.md

Las reglas del proyecto (comandos, constraints C1–C15, qué nunca entra a git, cómo trabajar) están en
[`CLAUDE.md`](CLAUDE.md). **Leelo completo antes de tocar código**: aplica igual aunque uses Codex,
Antigravity u otra herramienta que no sea Claude Code.

- Skills: `.agents/skills/` (las leen Codex y Antigravity solas). Agentes: `.agents/agents/*.md`, que se
  usan como prompt ("actuá según `.agents/agents/rls-migration-reviewer.md` y revisá esta migración").
- Los hooks de Claude Code no corren en otras herramientas: la protección del repo público es el
  pre-commit de git. Activarlo una vez por clon: `git config core.hooksPath .agents/hooks/git`.
- Guía de instalación y de trabajo: [`docs/09-guia-de-inicio.md`](docs/09-guia-de-inicio.md).
