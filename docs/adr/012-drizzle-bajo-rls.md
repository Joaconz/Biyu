# ADR-012 — Drizzle corre bajo RLS: se revisa la alternativa descartada en ADR-008

**Estado:** superada por [ADR-016](016-api-python-separada-del-frontend.md) · **Fecha:** 2026-08

> No hay RLS: el aislamiento por usuario lo aplica la capa de aplicación en cada consulta.
> Ver ADR-016, sección Consecuencias, para lo que se perdió al soltar esta red.
>
> **[ADR-019](019-vuelta-a-supabase.md) volvió a Supabase con RLS, pero no con Drizzle.** El
> problema que este documento resuelve —simular una sesión autenticada con `SET LOCAL ROLE` +
> `set_config` para que `auth.uid()` no dé `NULL`— es exclusivo de conectarse a Postgres por
> fuera de la API de Supabase. Con el **Supabase Client SDK**, el JWT de sesión viaja en cada
> request de forma nativa y `auth.uid()` resuelve solo: no hace falta ninguna de las dos
> sentencias `SET LOCAL` que describe este ADR. Queda como referencia de un problema que no
> vuelve a existir con el SDK.

## Contexto

ADR-008 documentó que el camino de Drizzle no pasa por RLS (no hay JWT en una conexión
directa a Postgres) y decidió no resolverlo: la autorización queda 100% en manos de
`src/server/`, cubierta por tests, con RLS como defensa de un vector distinto (la `anon key`
contra PostgREST).

Esa decisión pesaba una cosa contra otra: la ceremonia de simular una sesión autenticada en
cada transacción de base, contra el riesgo de que un bug de autorización se escape. Con un
solo usuario (ADR-004), el peor caso de ese bug era ver tus propios datos filtrados mal —
molesto, no grave. ADR-011 abre el registro público. El mismo bug, en multi-tenant, expone
los datos financieros de otra persona. La balanza se corrió lo suficiente como para que la
alternativa descartada deje de ser la mejor opción.

## Decisión

Cada acceso a datos por Drizzle corre dentro de una transacción de Postgres que:

1. `set local role authenticated` — cambia el rol efectivo de la conexión para esa
   transacción, que es el `to authenticated` que llevan las políticas RLS del schema.
2. `select set_config('request.jwt.claims', '{"sub":"<user_id>","role":"authenticated"}', true)`
   — el tercer argumento `true` es lo que hace que el `set_config` sea *local* a la
   transacción, equivalente a `SET LOCAL`. Es la función, no el comando `SET LOCAL ... =`,
   porque `SET` no acepta parámetros vinculados (`$1`) en el protocolo de Postgres; armar
   el JSON a mano con interpolación de string sería la puerta de entrada a una inyección.
   `set_config` sí es una llamada de función común, así que el valor va como parámetro real.
3. Corre la consulta.
4. La transacción termina (commit o rollback) y con ella el `SET LOCAL` — no hay estado que
   se filtre a la siguiente conexión que tome el pool.

`auth.uid()` —la función que usan las seis políticas RLS— lee exactamente
`request.jwt.claims->>'sub'`, así que este patrón lo alimenta con el `user_id` real de la
sesión de Supabase Auth vigente, resuelta antes con `supabase.auth.getUser()`.

**Por qué una transacción explícita y no una conexión con `SET` de sesión.** El pooler de
Supabase en modo transacción (`DATABASE_URL`, ADR-007) puede reasignar la conexión física
entre transacciones de un mismo cliente lógico — es el mismo motivo por el que ADR-010 tuvo
que introducir `DIRECT_URL` para `drizzle-kit`. Un `SET` fuera de una transacción quedaría
pegado a una conexión física que la siguiente consulta podría no reusar. `SET LOCAL` dentro
de una transacción explícita no tiene ese problema: vive y muere con la transacción,
sin importar a qué conexión física terminó yendo a parar.

## Consecuencias

- **El argumento original de ADR-008 no desaparece, se debilita.** Los tests de servidor
  siguen siendo la primera línea de defensa — siguen siendo obligatorios en Slice 2. Lo que
  cambia es que ahora hay una segunda línea real: si un test se olvida de cubrir un caso, o
  si el bug está en el propio test, RLS igual filtra.
- **Costo de ceremonia, tal como anticipaba ADR-008.** Toda lectura o escritura pasa por
  `withUserSession`, no por `db` directo. Es más fricción que antes; se acepta porque ahora
  hay algo real detrás para justificarla.
- **Requisito operativo silencioso: el rol de conexión tiene que poder volverse
  `authenticated`.** `SET LOCAL ROLE authenticated` exige que el rol con el que se conecta
  `DATABASE_URL` sea superusuario o tenga membresía explícita en el rol `authenticated`
  (`GRANT authenticated TO <rol>`). Hoy la conexión usa el rol por defecto del pooler de
  Supabase, que sí tiene ese permiso. **Si en algún momento se resuelve la deuda anotada en
  ADR-008 de crear un rol de aplicación de menor privilegio, ese rol necesita el `GRANT`
  explícito** o este patrón entero deja de funcionar en silencio (las consultas fallarían
  con un error de permiso al intentar `SET ROLE`, no sería un fallo silencioso — pero vale
  dejarlo escrito para no perder una tarde redescubriéndolo).
- **No verificado de punta a punta todavía.** Hoy no existe una sola consulta de datos en
  el repositorio (`src/server/db/` no tiene repositorios) — `withUserSession` se agrega sin
  un llamador real. Queda probado recién en Slice 2, cuando aparece la primera lectura.
