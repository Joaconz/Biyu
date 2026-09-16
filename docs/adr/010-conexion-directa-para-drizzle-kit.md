# ADR-010 — `drizzle-kit migrate` necesita una conexión de sesión, no el pooler de transacción

**Estado:** superada por [ADR-016](016-api-python-separada-del-frontend.md) · **Fecha:** 2026-08

> Sin Drizzle Kit y sin el pooler de Supabase, este problema dejó de existir. Las
> migraciones las genera Alembic contra la conexión de la API.
>
> **[ADR-019](019-vuelta-a-supabase.md) volvió a Supabase, pero no a Drizzle.** Las
> migraciones se manejan con **Supabase CLI** (`supabase migration new`, `supabase db push`),
> que no tiene el problema de advisory lock contra el pooler en modo transacción que motivó
> este documento. Este ADR queda como registro histórico de un problema que no vuelve a
> aparecer con la herramienta actual.

## Contexto

`DATABASE_URL` apunta al pooler de Supabase en modo transacción (Supavisor, puerto 6543),
elegido en ADR-007 porque es lo que necesita un runtime serverless como Vercel: sin eso,
cada invocación de función abriría su propia conexión directa a Postgres y el pool se
agotaría rápido bajo concurrencia.

Al intentar aplicar la migración inicial contra el proyecto hosteado con
`npm run db:migrate` (`drizzle-kit migrate` apuntando a `DATABASE_URL`), el comando se
quedaba colgado indefinidamente, sin ningún mensaje de error. La conexión TCP y el
handshake de Postgres funcionaban —confirmado con `psql` y con pruebas de conectividad
cruda— pero el comando nunca completaba.

## Causa

`drizzle-kit migrate` toma un **advisory lock** de Postgres antes de aplicar migraciones,
para que dos ejecuciones concurrentes no las apliquen dos veces. El pooler de Supavisor en
modo transacción multiplexa conexiones cliente sobre un pool de conexiones reales a
Postgres, reasignando la conexión física entre transacciones — así que un advisory lock
tomado en una transacción puede no estar disponible en la siguiente consulta del mismo
comando, porque terminó en una conexión física distinta. El resultado no es un error: es
un cuelgue silencioso esperando un lock que nunca se libera del todo.

## Decisión

Una variable de entorno separada, `DIRECT_URL`, con la misma cadena de conexión que
`DATABASE_URL` pero apuntando al modo **sesión** de Supabase (puerto 5432 del pooler, no el
6543): una conexión física fija durante todo el comando, donde el advisory lock se
mantiene sin ambigüedad. `drizzle.config.ts` usa `DIRECT_URL`; el resto de la aplicación
—`src/server/db/client.ts`, todo lo que corre en producción— sigue usando `DATABASE_URL`.

**Descartada:** la conexión directa a Postgres (`db.<project_ref>.supabase.co`, sin
pooler). Es IPv6-only en Supabase, y no resuelve en redes sin salida IPv6 —la mayoría de
routers domésticos y hotspots—, lo que la vuelve una fuente de fallos intermitentes según
la red de quien corra la migración. El modo sesión del pooler da la misma garantía de
conexión física fija sin ese problema.

## Consecuencias

- `.env.example` documenta `DIRECT_URL` con la advertencia explícita de para qué sirve y
  por qué no alcanza con reusar `DATABASE_URL`.
- Dos variables de entorno más para explicarle a un tercero que clona el repo — el costo
  de que el runtime serverless (`DATABASE_URL`) y la herramienta de migraciones
  (`DIRECT_URL`) tengan necesidades de conexión incompatibles entre sí.
- Si `drizzle-kit migrate` alguna vez se corre en CI (Slice 2, ver
  `03-architecture-spec.md`), ese pipeline también necesita `DIRECT_URL`, no solo
  `DATABASE_URL`.
