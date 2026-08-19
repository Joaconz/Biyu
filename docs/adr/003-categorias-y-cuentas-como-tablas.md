# ADR-003 — Categorías y cuentas son tablas, no JSON en configuración

**Estado:** aceptada · **Fecha:** 2026-08

## Contexto

La propuesta original tenía una tabla `config` de una sola fila con `categories` y `accounts` como arrays JSON, y al mismo tiempo declaraba `transactions.category_id` como clave foránea hacia `config`.

## Problema

Eso no es una clave foránea. Postgres no puede validar que un `category_id` exista dentro de un array JSON. Consecuencias concretas:

- Se puede borrar una categoría y dejar cientos de transacciones apuntando a un id inexistente. El dashboard muestra "Sin categoría" sin que nada haya fallado visiblemente.
- Agrupar por categoría requiere desarmar el JSON en cada consulta.
- No se puede archivar una categoría conservando el histórico, porque no hay dónde poner el estado.

El ahorro real de la opción JSON —dos tablas menos— es marginal. El costo es la integridad referencial, que es justamente lo que se espera ver en un proyecto presentado como trabajo de ingeniería.

## Decisión

`categories` y `accounts` son tablas con clave primaria, claves foráneas reales desde `transactions`, y `archived_at` para retiro suave. La tabla `config` de una sola fila desaparece: los tipos de cambio pasan a `fx_rates`, y no queda nada más que guardar ahí.

## Consecuencias

- Dos migraciones más y dos pantallas de CRUD simples.
- Archivar una categoría la saca del formulario sin romper el histórico.
- `accounts.type` habilita la regla de cuotas (invariante I6), que con JSON habría requerido leer y parsear el blob en cada validación.
