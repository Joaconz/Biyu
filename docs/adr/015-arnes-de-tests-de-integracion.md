# ADR-015 — Arnés de tests de integración contra Supabase local

**Estado:** parcialmente superada por [ADR-016](016-api-python-separada-del-frontend.md) · **Fecha:** 2026-08

> **El criterio sigue vigente:** los tests de integración corren contra una base real,
> levantada localmente y en CI, nunca contra un proyecto remoto compartido (el repo es
> público, C13). Cambió la herramienta: `supabase start` pasó a ser un Postgres en Docker
> Compose, y en GitHub Actions un *service container*. Los tests son de pytest, cada uno en
> una transacción que se revierte.

## Contexto

`03-architecture-spec.md` pone el seam de Server Actions como el segundo nivel de testing:
"atomicidad, validación de servidor, efectos en base", contra una instancia local de
Supabase. ADR-012 dejó anotado explícitamente que `withUserSession` —el mecanismo que hace
cumplir RLS al pasar por Drizzle— "queda probado recién en Slice 2, cuando aparece la primera
lectura". Ese momento es este: `createTransaction` es la primera Server Action que escribe
datos de verdad, así que es también la primera vez que hay algo real que verificar contra una
base real.

Dos preguntas concretas a resolver: cómo crear usuarios de test sin pasar por el flujo de
`/signup` completo, y cómo evitar que una corrida de tests toque por accidente el proyecto
Supabase hosteado.

## Decisión

**Supabase CLI local (`supabase start`), Docker.** Es el mismo stack que ya usa
`supabase/migrations/` para generar y versionar el schema — no se introduce una herramienta
nueva.

**Usuarios de test vía la admin API con la `service_role key`**
([supabase-admin.ts](../../tests/server/support/supabase-admin.ts)). `supabase.auth.admin.createUser()`
crea un usuario ya confirmado sin pasar por el flujo de email; es más rápido y no depende del
servidor SMTP de test. C7 prohíbe la `service_role key` en código que atiende pedidos de un
usuario real — un arnés de tests, que no atiende pedidos de nadie, no es ese código. La clave
además es la del stack **local**, generada por `supabase start` a partir del secreto de JWT
por defecto del CLI: no protege nada que no sea un contenedor Docker en la máquina de quien
corre los tests.

**Config separada: `.env.test.local`, nunca `.env.local`.** `.env.local` es el archivo que
usan `npm run dev` y `npm run build`, y en cualquier punto después de Slice 0 puede apuntar al
proyecto Supabase hosteado. Los tests de integración crean, leen y borran filas de verdad; si
por error corrieran con `DATABASE_URL` del proyecto hosteado, no hay forma de deshacerlo. Por
eso:

- Las credenciales viven en `.env.test.local` (documentado en
  [.env.test.example](../../.env.test.example), gitignoreado como todo `.env.*`).
- [setup-env.ts](../../tests/server/setup-env.ts) —un `setupFiles` del proyecto
  `integration-node` en `vitest.config.ts`— carga ese archivo y **aborta si `DATABASE_URL`
  no apunta a `127.0.0.1` o `localhost`**. No es una verificación opcional: es la única
  barrera entre "correr los tests" y "borrar datos reales" si alguna vez alguien apunta
  `.env.test.local` al lugar equivocado por error de copy-paste.

**`npm test` no depende de Docker.** `vitest.config.ts` separa tres proyectos
(`domain-node`, `components-jsdom`, `integration-node`); `npm test` / `npm run test:unit`
corren solo los dos primeros. `npm run test:integration` es el único comando que toca
`tests/server/`. Esto preserva la propiedad que pide `CLAUDE.md`: "un clon del repo
typechequea sin Postgres corriendo" — y ahora también "testea", no solo "typechequea", sin
Postgres corriendo.

**`getCurrentUser` se stubea; el resto de cada Server Action corre real.** `getCurrentUser`
resuelve la sesión vía `next/headers`, que solo existe dentro de una request real de
Next.js — no hay forma de fabricar ese contexto en un proceso de Vitest. Se reemplaza esa
única función con `vi.mock`, devolviendo el usuario de test creado por la admin API; todo lo
demás —parseo Zod, `validateTransactionDraft`, `generateLedgerEntries`, la escritura dentro de
`withUserSession`— corre sin mocks, contra Postgres.

## Consecuencias

- **A favor:** las pruebas de `tests/server/create-transaction.test.ts` y
  `tests/server/rls.test.ts` verifican comportamiento real de la base — atomicidad, RLS,
  las restricciones de columna — que ningún test de dominio puede cubrir por sí solo.
- **En contra:** requieren Docker corriendo y `.env.test.local` configurado; no corren en CI
  sin un paso adicional que levante el stack de Supabase (fuera de alcance de este slice:
  no hay pipeline de CI en el repo todavía).
- **Límite conocido, no un hueco:** no hay forma de forzar, con input válido, que
  `generateLedgerEntries` produzca imputaciones que violen un CHECK de `ledger_entries` que
  `transactions` no haya rechazado antes — es una propiedad positiva del dominio (ver el
  test "C4: withUserSession revierte todo..." en `create-transaction.test.ts`, que prueba el
  mecanismo de rollback directamente en vez de forzar un fallo artificial a través de la
  Server Action).
- **No ejecutado en esta sesión de trabajo.** El entorno donde se escribió este código no
  tiene Docker disponible. Hay que correr `supabase start && npm run db:reset && npm run
  test:integration` en una máquina con Docker antes de dar por buena la atomicidad y el
  aislamiento de RLS de Slice 2.
