# ADR-008 — RLS no se ejecuta en el camino de la aplicación, y por qué eso no rompe C7

**Estado:** superada por [ADR-016](016-api-python-separada-del-frontend.md) · **Fecha:** 2026-08

> Ya no hay RLS ni query builder de TypeScript. La autorización pasó a la capa de
> aplicación en Python (C7) y el acceso a datos a SQLAlchemy. La pregunta que este documento
> se hace —dónde vive la autorización y qué se pierde al moverla— sigue siendo la correcta;
> la respuesta cambió, y el costo está declarado en ADR-016.

> Este documento predijo su propia revisión (ver Consecuencias, último párrafo de
> "Alternativa descartada"): "si en algún momento el objetivo del proyecto cambia hacia
> demostrar RLS como mecanismo principal de autorización... para un rol multi-tenant con
> más de un tipo de acceso, esta decisión se revisita con su propio ADR." Eso es
> exactamente lo que hace ADR-012 al abrir el registro público. El resto de este documento
> —por qué RLS protege el vector de la `anon key` y no el camino de Drizzle por defecto,
> y por qué el rol de conexión no lleva `BYPASSRLS`— sigue siendo la explicación correcta
> del punto de partida.

## Contexto

`docs/04-data-model.md` define políticas RLS con `using (user_id = auth.uid())` en las
seis tablas. `auth.uid()` es una función de Supabase que lee el `user_id` del JWT de la
request — el mecanismo por el que PostgREST (la API REST que genera Supabase sobre
Postgres) sabe quién está pidiendo qué.

Este proyecto no usa PostgREST para leer ni escribir datos (ADR-007): Drizzle se conecta
directo a Postgres por el puerto del pooler, con la cadena de conexión de `DATABASE_URL`.
Esa conexión no lleva un JWT. `auth.uid()` evaluado ahí devuelve `NULL`.

## Problema

Si `auth.uid()` es `NULL`, ninguna fila cumple `user_id = auth.uid()`, así que las
políticas RLS —tal como están escritas— bloquearían absolutamente todo, incluyendo las
consultas legítimas de la propia aplicación. En la práctica, esto no pasa porque el rol con
el que se conecta Drizzle en desarrollo suele ser `postgres`, que es superusuario y
**se salta RLS por completo**, tenga o no `auth.uid()` un valor.

Cualquiera de los dos resultados es información importante que la documentación original
no dice: **el camino de escritura y lectura de la aplicación no pasa por RLS**, ni para
bien (protegido) ni para mal (bloqueado). RLS, tal como está declarada, solo se ejecuta
cuando algo consulta a través de PostgREST — es decir, cuando alguien usa la `anon key`
directo contra la API REST de Supabase.

## Decisión

Aceptar que RLS protege un vector específico, no el camino de la aplicación, y hacerlo
explícito en vez de dejarlo implícito:

1. **RLS protege contra el navegador atacando la API REST directamente.** La `anon key`
   viaja en el bundle del cliente por diseño (es pública). Si alguien la copia y pega
   requests contra `https://<proyecto>.supabase.co/rest/v1/...`, RLS es lo único que le
   impide leer o escribir filas de otro usuario — o de cualquier usuario, dado que en v1
   hay un solo usuario y ni siquiera hace falta que sea "de otro". Contra ese vector,
   funciona exactamente como está declarada.

2. **RLS no protege el camino de Drizzle.** La autorización de ese camino es
   responsabilidad exclusiva de `src/server/`: cada Server Action y cada query verifica
   `user_id` contra la sesión antes de tocar la base, y eso está testeado (C7 ya lo pedía:
   "la autorización vive en el servidor y está testeada; RLS es defensa en profundidad" —
   este ADR explica qué significa "en profundidad" en este diseño concreto).

3. **Drizzle se conecta con un rol de aplicación sin `BYPASSRLS`, nunca con `postgres`.**
   No porque eso haga que RLS empiece a filtrar sus consultas (`auth.uid()` sigue siendo
   `NULL` para ese rol, así que RLS seguiría bloqueando todo si estuviera activa para él) —
   sino porque un rol sin privilegios de superusuario es el principio de menor privilegio
   aplicado a la única credencial de base de datos que existe en el sistema. Si algún día
   se decide hacer que el camino de Drizzle respete RLS (ver alternativa descartada), un
   rol ya con `BYPASSRLS` lo haría imposible sin cambiar de rol primero.

## Alternativa descartada

**Hacer que Drizzle opere bajo RLS.** Técnicamente posible: en cada transacción, ejecutar
`set local role authenticated` y `set local request.jwt.claims = '{"sub": "<user_id>"}'`
antes de la consulta, para que `auth.uid()` resuelva al usuario real. Eso convertiría RLS
en la autorización real del camino de la aplicación, no solo del vector directo a
PostgREST.

Se descarta para v1 por dos razones. Primero, agrega ceremonia (dos `SET LOCAL` por
transacción, o un wrapper que los inyecte) a cambio de una defensa que el proyecto ya
decidió cubrir con tests de servidor (C7). Segundo, mezclar dos mecanismos de autorización
—políticas de base y checks de servidor— para el mismo camino duplica dónde hay que mirar
cuando algo falla, sin duplicar la cobertura real: si el check de servidor tiene un bug,
las políticas de RLS con los `SET LOCAL` inyectados por el propio servidor tienen
exactamente el mismo bug.

Si en algún momento el objetivo del proyecto cambia hacia demostrar RLS como mecanismo
principal de autorización (por ejemplo, para un rol multi-tenant con más de un tipo de
acceso), esta decisión se revisita con su propio ADR.

## Consecuencias

- Un bug de autorización en `src/server/` **no** lo detiene RLS. Es la razón concreta por
  la que Slice 2 incluye tests de Server Action que verifican rechazo de operaciones sobre
  datos de otro `user_id` — no es una precaución genérica, es la única red que existe en
  ese camino.
- RLS sigue siendo obligatoria en las seis tablas (no se relaja C7): protege el vector real
  que identifica ADR-004 — la `anon key` pública contra la API REST — y es barata de
  mantener una vez declarada en el schema de Drizzle.
- La `DATABASE_URL` de la aplicación usa un rol sin `BYPASSRLS`. Es higiene de menor
  privilegio, no una defensa activa en el diseño actual.
