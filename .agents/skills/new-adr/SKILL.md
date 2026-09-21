---
name: new-adr
description: Crea un ADR nuevo en docs/adr/ con la numeración y el formato de Biyu. Usalo cuando se toma una decisión de arquitectura no obvia (constraint C12).
disable-model-invocation: true
argument-hint: <título corto de la decisión>
---

Creá un ADR para: $ARGUMENTS

1. Listá `docs/adr/` y tomá el siguiente número correlativo de tres dígitos.
2. Leé un ADR corto existente (p. ej. `002-tipo-de-cambio-congelado.md`) y copiá su tono.
3. Escribí `docs/adr/NNN-slug-en-kebab-case.md` con esta estructura, en español:

```markdown
# ADR-NNN — <título>

**Estado:** propuesta · **Fecha:** AAAA-MM

## Contexto
<qué situación obliga a decidir>

## Decisión
<qué se decide, concreto>

## Alternativas descartadas
<al menos una, con por qué no>

## Consecuencias
<qué mejora, qué cuesta, qué constraints (C*) o invariantes (I*) toca>
```

4. Si la decisión reemplaza a otro ADR, marcá el anterior como `reemplazada por ADR-NNN` y linkealo.
5. Agregá el ADR a la tabla de `docs/` en `README.md` solo si el README ya lista ADRs individuales;
   si no, no lo toques.
6. Usá montos ficticios en los ejemplos (C14). No hagas commit: mostrá el archivo y esperá.
