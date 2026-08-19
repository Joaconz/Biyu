# ADR-014 — Siembra inicial por usuario: función idempotente, no trigger

**Estado:** parcialmente superada por [ADR-016](016-api-python-separada-del-frontend.md) · **Fecha:** 2026-08

> **La decisión sigue vigente:** la siembra del set inicial de categorías y cuentas es una
> función idempotente por usuario, no un trigger de base. Cambió dónde vive: de una Server
> Action de Next.js a un módulo `seed/` de la API, invocado al crear la cuenta.

## Contexto

El roadmap pide, para Slice 2, "categorías y cuentas sembradas con un set inicial" (story
43: "quiero que la app venga con un set de categorías inicial, para no arrancar con una
pantalla vacía"). Antes de ADR-011 esto podía ser un seed SQL estático, corrido una vez a
mano contra el único usuario del sistema. Con `/signup` público y multi-tenant, cada cuenta
nueva necesita su propio set — la siembra deja de ser un evento único y pasa a ser parte del
flujo de alta de cada usuario.

## Alternativas evaluadas

**A. Trigger de Postgres sobre `auth.users`** (`handle_new_user()` con `SECURITY DEFINER`).
Es el patrón que recomienda la documentación de Supabase, y da la garantía más fuerte:
corre dentro de la misma transacción que crea la fila en `auth.users`, así que es imposible
tener un usuario sin su set inicial. Se descartó por tres razones concretas:

- `SECURITY DEFINER` ejecuta con los permisos de quien creó la función, no de quien la
  dispara — es una escalada de privilegios real si el `search_path` no se fija
  explícitamente (`set search_path = ''`). Se puede hacer bien, pero es superficie de
  ataque que el resto del proyecto no tiene: todo lo demás corre con el rol de aplicación
  sin `BYPASSRLS` (ADR-008).
- El set inicial queda escrito en SQL dentro de una migración. Cambiarlo — agregar una
  categoría, ajustar un color — es una migración nueva, no un cambio de un archivo de
  TypeScript, y no se puede testear sin una base real corriendo.
- Si el trigger falla, Supabase Auth devuelve el genérico `"Database error saving new
  user"` a `signUp()`, sin distinguir esa causa de cualquier otro error de base. Es el peor
  tipo de fallo para diagnosticar en producción.

**B. Sembrar solo en la Server Action de `/signup`.** Un único lugar, sin consulta extra en
el caso normal, sin la ceremonia de un trigger. Se descartó porque `auth.users` ya quedó
creado por Supabase Auth antes de que el código de la aplicación corra — no hay transacción
que lo cubra. Si la escritura de siembra falla ahí, el usuario queda con una cuenta activa y
sin categorías ni cuentas, sin ningún camino para repararse hasta que exista el CRUD de
Slice 5.

**C. Función idempotente, llamada desde `/signup` y desde `/register`.** Elegida.

## Decisión

`ensureUserSeeded(userId)` ([ensure-user-seeded.ts](../../src/server/seed/ensure-user-seeded.ts))
inserta el set inicial ([initial-data.ts](../../src/server/seed/initial-data.ts)) dentro de
`withUserSession`, apoyada en `onConflictDoNothing()` sobre los índices únicos parciales de
`categories` y `accounts` — así que correrla una vez, dos veces, o dos veces en paralelo deja
siempre el mismo set, sin filas duplicadas ni errores.

Se llama desde dos lugares:

1. **Al final de `signup`** ([actions.ts](../../src/app/(auth)/signup/actions.ts)) — el
   camino normal. Es best-effort: si falla, se loguea y `signup` igual redirige, en vez de
   dejar al usuario varado en una pantalla de error por un problema de siembra.
2. **Desde `/register`** ([page.tsx](../../src/app/(app)/register/page.tsx)), como red de
   contención: si la lectura de categorías activas vuelve vacía, se llama a
   `ensureUserSeeded` y se vuelve a leer. Esa lectura ya se hace para pintar los chips del
   formulario — la llamada de acá no agrega una consulta al caso normal (usuario ya
   sembrado), solo cubre el caso donde (1) falló o donde el usuario se creó por otro camino
   (por ejemplo, a mano desde el panel de Supabase).

**Corolario — el índice único que le faltaba a `accounts`.** `categories` ya tenía un índice
único parcial `(user_id, name) where archived_at is null`; `accounts` no tenía ninguno, así
que era posible crear dos cuentas activas con el mismo nombre. Sin ese índice,
`onConflictDoNothing()` sobre `accounts` no tiene contra qué chocar, y dos llamadas
concurrentes a `ensureUserSeeded` (por ejemplo, dos tabs abriendo `/register` al mismo
tiempo) duplicarían las cuentas sembradas. Se agregó `accounts_user_name_active_unique`,
igual que en `categories` — no es solo un requisito de esta decisión, es un bug independiente
que esta decisión hizo visible.

## Consecuencias

- **A favor:** el set inicial vive en TypeScript ([initial-data.ts](../../src/server/seed/initial-data.ts)),
  testeable sin trigger ni migración; corre con el mismo rol sin privilegios elevados que
  todo el resto de la aplicación (ADR-008, ADR-012); un fallo de siembra no bloquea la
  creación de cuenta.
- **En contra:** dos puntos de llamada en vez de una garantía transaccional única. Si algún
  día aparece un tercer camino de alta de usuarios (por ejemplo, invitaciones), tiene que
  acordarse de llamar a `ensureUserSeeded` también — no hay nada en la base que lo fuerce.
  Se acepta porque, a cambio, ninguna parte del sistema depende de `SECURITY DEFINER`.
- **Verificado en Slice 2** por `tests/server/ensure-user-seeded.test.ts` (idempotencia)
  contra Supabase local — ver ADR-015.
