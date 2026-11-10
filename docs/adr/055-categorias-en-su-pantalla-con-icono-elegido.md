# ADR-055 — Categorías en su propia pantalla, con ícono y color que elige el usuario

**Estado:** propuesta · **Fecha:** 2026-11
**Relacionada:** ADR-052 (reemplaza lo que dice de la fila de categoría en Ajustes, §6), ADR-023 (el color queda
reservado a las categorías; ahora también eligen ícono), ADR-051 (la hoja que se reutiliza), ADR-044 §5 y US-94
(el borrado y su confirmación se conservan) · US-89 (borrar una categoría). La pantalla y el ícono elegible no
tienen una US propia todavía: el pedido salió de una tanda de UX.

## Contexto

La administración de categorías vivía dentro de Ajustes: una lista con tres iconos por fila (editar, archivar,
eliminar), un formulario de alta siempre abierto debajo y, al editar, una fila que se expandía en el lugar.
Con las ocho sembradas y alguna propia, Ajustes se volvía una pantalla larga donde lo único que se podía elegir
de una categoría era su nombre y uno de diez colores. Las categorías propias se mostraban con un punto de color,
mientras que las sembradas tenían ícono: no había forma de que «Mascotas» o «Viajes» se parecieran a ellas.

La columna `categories.icon` existe desde el schema inicial (`docs/04-data-model.md`) y el cliente nunca la
usó: `lib/catalog.ts` seleccionaba solo `id, name, color`.

## Decisión

1. **Pantalla propia, `/settings/categories`.** Ajustes conserva una sola fila, «Categorías · N activas»
   (`settings-nav-categories`), que lleva ahí. La ruta cuelga de `/settings`, así que la barra sigue marcando
   Ajustes. La pantalla lista cada categoría con su baldosa de ícono y color, el nombre y los movimientos del
   mes (el período vive en la URL, C11); «Nueva categoría» queda arriba; las archivadas van en un bloque
   plegado al pie.
2. **Una hoja para crear y editar**, con el patrón de ADR-051: en el celular una hoja desde abajo (Base UI
   Drawer) que se cierra deslizándola, y desde `sm` un popover (Base UI Popover) que cuelga de «Nueva
   categoría». Lleva nombre, una grilla de 24 íconos de lucide más «Sin ícono», la paleta de diez colores y una
   vista previa en vivo de la baldosa. Archivar y Eliminar están adentro, al pie; Eliminar sigue pasando por el
   `ConfirmDialog` de US-89 y US-94, que se abre con la hoja ya cerrada. El renglón entero de la lista abre la hoja:
   reemplaza al lápiz y a los tres botones por fila de ADR-052 §6.
3. **El ícono se guarda en `categories.icon`** como la clave de lucide en kebab-case (`shopping-basket`,
   `paw-print`). `CategoryIcon` resuelve en este orden: el ícono guardado, si el catálogo lo conoce; el de las
   sembradas por su nombre (los mismos ocho de siempre); un punto de color. Al abrir una sembrada para editar
   se preselecciona su ícono y al guardar queda escrito, para que renombrarla no se lo quite.
4. **Postgres valida la forma, el cliente ofrece el catálogo (C6).** Una migración agrega
   `check (icon is null or icon ~ '^[a-z0-9-]{1,40}$')`. Qué claves se ofrecen es presentación
   (`CATEGORY_ICON_KEYS` en `src/lib/visuals.ts`): agregar un ícono no pide migración, y una clave guardada que
   el catálogo ya no conozca se muestra como punto en vez de romper la pantalla. Sin cambios de RLS ni de
   privilegios (C7); la prueba pgTAP cubre el check y repite el par de autorización.
5. **Dónde se ve.** El ícono guardado aparece en la pantalla de Categorías y en la grilla de categorías de
   Registrar y de Editar movimiento (los que leen de `lib/catalog.ts`). El selector de categoría del formulario
   de suscripciones es un `<select>` nativo, que no puede mostrar íconos, y no cambia.

## Alternativas descartadas

- **Seguir en Ajustes con la edición en la fila.** Era el problema: cada alta o cambio de ícono sumaba altura
  a una pantalla que ya tiene cuentas, tipo de cambio y resumen.
- **Un diálogo centrado.** Es lo que ya usa el borrado, pero en el celular queda lejos del pulgar y no se
  cierra deslizando; la hoja de ADR-051 resuelve las dos cosas y ya está probada en los e2e.
- **Guardar el ícono como componente o SVG, o aceptar cualquier clave de lucide.** Obliga a incluir todo el
  catálogo de íconos en el bundle o a validar contra una lista en la base. Con un catálogo corto, el `check`
  de forma alcanza y el costo de cambiar la lista es cero.
- **Rellenar `icon` de las sembradas con una migración.** Es dato del usuario y el nombre ya las resuelve; se
  escribe recién cuando el usuario edita la categoría.

## Consecuencias

- Llegar a las categorías lleva un paso más (Ajustes → Categorías). Los e2e de `settings.spec.ts` y
  `regression-cfg-reg-das-cat.spec.ts` y `PR-02` de `docs/12-procedimientos-de-prueba.md` pasan por esa fila;
  crear, archivar y eliminar ocurren ahora en la hoja. Los casos CP-CFG que describen el formulario de alta en
  Ajustes quedan desactualizados en su redacción (los ids `settings-categories-*` se conservan).
- Se suman `settings-categories-{title,back,new,sheet,preview,icon-*,archived-toggle,count-*}` y
  `settings-nav-categories`. Los íconos de la grilla son `settings-categories[-edit]-icon-<clave>`.
- El resto de la app (Movimientos, las barras del Resumen, el resumen del paso de detalles de Registrar) sigue
  mostrando el ícono de las sembradas o el punto: llevan la categoría sin `icon` en sus consultas. Es una
  mejora pendiente, sin riesgo de datos.
- Los movimientos por categoría se cuentan en el cliente (`countCategoryMovementsInPeriod`), sobre las
  transacciones del mes sin dar de baja (C10). PostgREST devuelve a lo sumo 1000 filas por consulta: es una
  línea de presentación, no un KPI, y un mes personal no se acerca a ese número.
