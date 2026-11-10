-- ADR-055: el usuario elige el ícono de cada categoría. La columna `categories.icon` ya existía desde el
-- schema inicial (docs/04-data-model.md) y el cliente nunca la usó; guarda la clave de un ícono lucide en
-- kebab-case (`shopping-basket`, `heart-pulse`). Postgres solo valida la forma (C6): qué claves se ofrecen es
-- presentación y vive en el cliente (`src/lib/visuals.ts`), así que agregar un ícono no requiere migración
-- y una clave que el cliente ya no conozca se muestra como el punto de color.
-- La columna nunca se escribió desde la app, así que no hay valores previos que el check pueda rechazar.
-- Sin cambios de RLS ni de privilegios (C7): `categories` conserva sus políticas.

alter table public.categories
  add constraint categories_icon_format
  check (icon is null or icon ~ '^[a-z0-9-]{1,40}$');

comment on column public.categories.icon is
  'Clave del ícono lucide (kebab-case, hasta 40 caracteres) o null: sin ícono se muestra un punto de color (ADR-055).';
