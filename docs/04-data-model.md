# Modelo de datos

_Ocho tablas. El corazón del modelo es la separación entre `transactions` (el evento) y `ledger_entries` (su impacto mensual)._

---

## Diagrama de relaciones

```
users
    │
    ├──< categories
    ├──< accounts
    ├──< fx_rates
    │
    ├──< subscriptions ──┐
    │                    │  (transactions.subscription_id opcional)
    ├──< transactions ──< ledger_entries
    │         │
    │         └──< debts   (debts.transaction_id opcional)
    └──< debts
```

> **Nota de stack.** Este documento pasó de Supabase a una API propia (ADR-016) y volvió a
> Supabase ([ADR-019](adr/019-vuelta-a-supabase.md)). `users` vuelve a ser `auth.users`: la
> tabla de usuarios la administra Supabase Auth, no el schema de la aplicación. Cada `user_id`
> de las tablas de abajo es una FK a `auth.users(id)`. Ver la sección "Row Level Security" al
> final, que reemplaza a la de "Aislamiento por usuario" de la versión con API propia.

---

## `categories`

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK → users | not null |
| name | text | not null |
| color | text | hex |
| icon | text | nombre del ícono |
| archived_at | timestamptz | null = activa |
| created_at | timestamptz | default now() |

Índice único **parcial**: (`user_id`, `name`) `where archived_at is null`. No es una
restricción `UNIQUE` simple — permite reutilizar un nombre después de archivar la categoría
que lo tenía.

## `accounts`

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK → users | not null |
| name | text | not null |
| type | enum | `credit_card` \| `debit_card` \| `cash` \| `bank_account` \| `wallet` |
| currency | enum | `ARS` \| `USD` — moneda principal, solo sugiere el default |
| archived_at | timestamptz | |
| created_at | timestamptz | |

Índice único **parcial**, igual que en `categories`: (`user_id`, `name`) `where archived_at is
null`. Permite reutilizar un nombre después de archivar la cuenta que lo tenía.

Solo `type = 'credit_card'` admite `installments_count > 1` (ver invariante I6).

## `fx_rates`

Tipo de cambio de referencia por período. **Solo sugiere un default al registrar** — no se usa para calcular nada histórico.

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK → users | |
| period | date | día 1 del mes |
| ars_per_usd | numeric(14,4) | > 0 |
| created_at | timestamptz | default now() |

Único: (`user_id`, `period`).

## `subscriptions`

Un gasto recurrente mensual: Netflix, el gimnasio, el hosting. **No es una transacción.** Es
una regla que genera transacciones, una por período vencido. La generación es la parte
interesante y está en `06-suscripciones.md`.

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK → users | not null |
| name | text | not null — "Netflix" |
| amount | numeric(14,2) | > 0 |
| currency | enum | `ARS` \| `USD` |
| category_id | uuid FK → categories | not null |
| account_id | uuid FK → accounts | not null |
| billing_day | int | 1..31 — día del mes en que se cobra |
| start_period | date | día 1 del primer mes que corresponde cobrar |
| end_period | date | día 1; null = indefinida |
| generate_from_period | date | día 1. **Piso móvil de generación.** Arranca igual a `start_period`; reanudar una suscripción pausada lo mueve al período corriente |
| status | enum | `active` \| `paused` \| `cancelled` |
| paused_at | timestamptz | not null si `status = 'paused'` |
| cancelled_at | timestamptz | not null si `status = 'cancelled'` |
| description | text | opcional |
| created_at | timestamptz | default now() |

Índice único **parcial**: (`user_id`, `name`) `where status <> 'cancelled'`. Mismo criterio
que en `categories` y `accounts`: se puede reutilizar el nombre de una suscripción cancelada.

**Por qué no hay `fx_rate` acá.** Una suscripción en USD no congela un tipo de cambio: cada
ocurrencia toma el `fx_rates` de **su propio período** al momento de generarse, y lo congela
en la transacción resultante (C5). Si ese período no tiene tipo de cambio cargado, la
ocurrencia no se genera y la suscripción queda reportada como bloqueada. Congelar un único
tipo de cambio al crear la suscripción sería peor: una suscripción de USD 10 dada de alta en
enero seguiría valuándose al dólar de enero en diciembre.

**Por qué no hay `last_generated_period`.** Sería un contador denormalizado que puede
desincronizarse. La idempotencia la garantiza la base con un índice único sobre
`transactions (subscription_id, subscription_period)` — ver I11. `generate_from_period` es
otra cosa: no registra qué se generó, sino desde dónde se puede generar.

**Por qué no hay cuotas.** Una suscripción genera transacciones de una sola imputación
(I14). Cuotas sobre un gasto recurrente no tiene sentido de negocio y multiplicaría los
casos de borde sin agregar nada.

## `transactions`

El evento económico. Una compra, un ingreso. **No es lo que suma el dashboard.**

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK → users | |
| type | enum | `expense` \| `income` |
| amount | numeric(14,2) | **siempre > 0** — el signo lo da `type` |
| currency | enum | `ARS` \| `USD` |
| fx_rate | numeric(14,4) | not null si currency = USD, null si ARS |
| amount_ars | numeric(14,2) | **columna generada**: `amount` si ARS, `amount * fx_rate` si USD |
| category_id | uuid FK → categories | not null si type = expense |
| account_id | uuid FK → accounts | not null |
| installments_count | int | default 1, ≥ 1 |
| first_period | date | día 1 del mes de la primera imputación |
| description | text | opcional |
| occurred_on | date | fecha real del evento |
| subscription_id | uuid FK → subscriptions | **opcional** — null si la cargó el usuario a mano |
| subscription_period | date | día 1. `CHECK ((subscription_id is null) = (subscription_period is null))` |
| deleted_at | timestamptz | soft delete |
| created_at | timestamptz | |

Índice único **parcial**: (`subscription_id`, `subscription_period`) `where subscription_id
is not null`. Es la garantía de idempotencia de la puesta al día (I11), y **no filtra por
`deleted_at` a propósito**: si el usuario borró la ocurrencia de marzo, la puesta al día no
la vuelve a crear. Borrar es una decisión del usuario, no un hueco a rellenar.

`first_period` es derivable hoy: siempre es el mes de `occurred_on` (ver glosario, "Fecha
de imputación"). Existe como columna igual, sin `CHECK` que la ate a `occurred_on`, porque
es lo que permite modelar el ciclo de cierre de tarjeta más adelante sin migración — ahí
dejaría de ser derivable. Se valida en el servidor, no en la base.

## `ledger_entries`

La imputación mensual. **Esto es lo que suma el dashboard.**

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK → users | denormalizado: es el filtro de dueño y el índice principal del dashboard |
| transaction_id | uuid FK → transactions | on delete cascade — red de contención administrativa; el camino normal de borrado es `transactions.deleted_at` (C10) y nunca la dispara |
| period | date | día 1 del mes |
| installment_number | int | 1..installments_count |
| amount | numeric(14,2) | en la moneda de la transacción |
| amount_ars | numeric(14,2) | **no es columna generada.** Se calcula en el dominio junto con `amount` y se persiste — ver I1' más abajo |

Único: (`transaction_id`, `installment_number`).
Índice: (`user_id`, `period`) — es el acceso principal del dashboard.

## `debts`

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK → users | |
| transaction_id | uuid FK → transactions | **opcional** — null para deudas sueltas |
| person | text | not null |
| amount | numeric(14,2) | > 0 |
| currency | enum | `ARS` \| `USD` |
| fx_rate | numeric(14,4) | mismas reglas que en transactions |
| amount_ars | numeric(14,2) | columna generada, igual que en `transactions`: `amount` si ARS, `amount * fx_rate` si USD. Necesaria para que el neto de reembolsos (consulta 6) reste en ARS sin convertir al leer (C5) |
| direction | enum | `owed_to_me` \| `i_owe` |
| status | enum | `pending` \| `settled` |
| settled_at | timestamptz | null si pending |
| notes | text | |
| incurred_on | date | |
| created_at | timestamptz | |

---

## Invariantes

Cada una tiene un test. Si una no se puede testear, está mal formulada.

| # | Invariante | Dónde se hace cumplir |
|---|---|---|
| I1 | La suma de `ledger_entries.amount` de una transacción es exactamente `transactions.amount`, en la moneda de la transacción | Dominio + vista de integridad |
| I1' | La suma de `ledger_entries.amount_ars` de una transacción es exactamente `transactions.amount_ars` | Dominio + vista de integridad |
| I2 | Una transacción tiene exactamente `installments_count` imputaciones, con `installment_number` de 1 a N sin huecos | Dominio + vista de integridad (la unicidad de `(transaction_id, installment_number)` evita duplicados, pero no huecos ni el conteo total) |
| I3 | Los períodos de las imputaciones son consecutivos desde `first_period`, sin saltos ni repeticiones | Dominio |
| I4 | `amount > 0` siempre, en transacciones, imputaciones y deudas | Restricción de verificación en la base |
| I5 | `fx_rate` es not null si y solo si `currency = 'USD'` | Restricción de verificación |
| I6 | `installments_count > 1` solo si la cuenta es `credit_card` y el tipo es `expense` | Validación de servidor (requiere join, no se resuelve con check) |
| I7 | La suma de las deudas vinculadas a una transacción no supera `transactions.amount_ars`, y una deuda vinculada tiene la misma `currency` que su transacción de origen | Validación de servidor |
| I8 | Una transacción de tipo `expense` tiene categoría | Restricción de verificación |
| I9 | `status = 'settled'` implica `settled_at` not null | Restricción de verificación |
| I10 | Una transacción con `deleted_at` no aporta a ningún KPI | Filtro en todas las consultas de lectura |
| I11 | Una suscripción tiene **como máximo una** transacción por período | Índice único parcial `(subscription_id, subscription_period)` |
| I12 | `start_period ≤ generate_from_period`, y `start_period ≤ end_period` cuando `end_period` no es null. `generate_from_period` **nunca retrocede**: pausar y reanudar solo lo aumentan (R8) | Restricción de verificación + dominio |
| I13 | `billing_day` está entre 1 y 31 | Restricción de verificación |
| I14 | Una transacción con `subscription_id` tiene `installments_count = 1` y `type = 'expense'` | Restricción de verificación |
| I15 | `status = 'paused'` implica `paused_at` not null; `status = 'cancelled'` implica `cancelled_at` not null | Restricción de verificación |
| I16 | La puesta al día es idempotente: ejecutarla dos veces sobre el mismo estado no crea ninguna transacción nueva | Dominio (función pura) + I11 en la base |
| I17 | La puesta al día nunca genera una ocurrencia con `subscription_period` posterior al período corriente, anterior a `generate_from_period`, o posterior a `end_period` | Dominio |

**I1' — por qué existe además de I1.** I1 garantiza que las cuotas en la moneda original
suman el total original. No garantiza lo mismo en ARS: convertir cada cuota por separado y
redondear introduce un desvío de redondeo que I1 no ve. Ejemplo — USD 100 en 3 cuotas con
`fx_rate = 1250.5555`: las cuotas en USD suman exactamente 100 (✓ I1), pero convertidas y
redondeadas una por una dan $125.055,56 contra un `transactions.amount_ars` de $125.055,55
— un centavo de diferencia en el número que muestra el dashboard. `generate_ledger_entries`
aplica la misma regla de absorción del resto (C3) también sobre `amount_ars`, y por eso esa
columna se calcula en el dominio en vez de generarse en la base: una columna generada no
puede absorber un resto.

---

## Row Level Security

_Reemplaza a la sección "Aislamiento por usuario" de la versión con API propia. Ver
[ADR-019](adr/019-vuelta-a-supabase.md) y ADR-004._

El navegador habla directo con Supabase a través del Supabase Client SDK. No hay una capa de
aplicación intermedia que filtre por dueño: **Row Level Security es la autorización real**,
no una red de contención adicional.

Cada tabla (`categories`, `accounts`, `fx_rates`, `subscriptions`, `transactions`,
`ledger_entries`, `debts`) tiene una política, como mínimo:

```sql
create policy "select_own_rows" on transactions
  for select using (user_id = auth.uid());
-- análogas para insert/update/delete, y una política por tabla
```

Reglas, sin excepciones:

1. **Ninguna política es más laxa que `user_id = auth.uid()`.** No hay una política
   `using (true)` "temporal para probar" en ninguna tabla, ni siquiera en desarrollo.
2. **El `user_id` de una fila nueva se completa con `auth.uid()`**, nunca con un valor que
   mande el cliente. Se aplica con un `default auth.uid()` en la columna o con un trigger
   `before insert`, para que un cliente que intente forzar un `user_id` ajeno en el `insert`
   lo vea ignorado o rechazado.
3. **El rol `anon`** (sin sesión) no tiene ninguna política que le dé acceso a estas tablas.
   Un pedido sin JWT válido contra la API de Supabase devuelve cero filas, igual que un
   pedido con el JWT de otro usuario pidiendo un recurso ajeno — RLS no distingue "no existe"
   de "no es tuyo", y eso es intencional: no permite inferir existencia.
4. **La `service_role key`, que se salta RLS por completo, nunca la usa el cliente.** Solo
   las Edge Functions que corren en el servidor de Supabase (cierre de tarjeta, puesta al día
   de suscripciones) y el arnés de tests la tienen disponible, y ambos la usan para escribir
   en nombre del usuario correcto explícitamente, no para saltear el filtro por error (C8).

`ledger_entries` conserva el `user_id` denormalizado. No es solo para que la política no
tenga que hacer un join por fila — aunque eso también importa para el plan de consulta —
sino porque el índice `(user_id, period)` es el acceso principal del dashboard.

**Grupo de pruebas obligatorio.** Para cada tabla, un caso de pgTAP que consulta con el JWT
de otro usuario y espera cero filas, y otro que consulta sin sesión (rol `anon`) y espera
cero filas. Es la verificación directa de NFR-13 (`pre-entrega.md`) y lo que hace que C7 esté
cubierta y no solo declarada.

---

## Ejemplo trabajado

Compra de $100.000 ARS en 3 cuotas con Visa BBVA el 2026-08-15, compartida con Sofía por $50.000.

**`transactions`** — una fila:

```
amount: 100000.00 | currency: ARS | fx_rate: null | amount_ars: 100000.00
installments_count: 3 | first_period: 2026-08-01 | occurred_on: 2026-08-15
```

**`ledger_entries`** — tres filas:

```
2026-08-01 | 1/3 | 33333.33
2026-09-01 | 2/3 | 33333.33
2026-10-01 | 3/3 | 33333.34   ← la última absorbe el resto
                    ─────────
                    100000.00  ✓ I1
```

**`debts`** — una fila:

```
transaction_id: <la de arriba> | person: Sofía | amount: 50000.00
direction: owed_to_me | status: pending
```

Dashboard de septiembre: gasto bruto $33.333,33, del cual $33.333,33 son cuotas de meses anteriores.

---

## Consultas principales del dashboard

Las consultas 1 a 5 parten de `ledger_entries` filtrando por `user_id` y `period`, con join
a `transactions` para excluir borradas y traer categoría y cuenta. Las consultas 6 y 7
parten de otra tabla — está indicado en cada una.

1. **Total gastado del período** — suma de `amount_ars` de imputaciones cuya transacción es `expense` y no está borrada.
2. **Total ingresos** — mismo cálculo con `income`.
3. **Por categoría** — el total agrupado por `category_id`.
4. **Por cuenta** — el total agrupado por `account_id`.
5. **Cuotas heredadas** — imputaciones cuyo `installment_number > 1`.
6. **Neto de reembolsos** — parte de `transactions`, no de `ledger_entries`. Total gastado
   del período menos las deudas `owed_to_me` **pendientes o saldadas** cuyo
   `transaction_id` tiene `first_period` igual al período consultado. La deuda se imputa
   entera al mes de nacimiento de la compra, no prorrateada entre las cuotas — si se
   prorrateara, un gasto en 12 cuotas restaría una fracción de la deuda en cada uno de los
   doce meses, con su propio problema de redondeo. El compromiso de reembolso nace cuando
   nace la compra, no cuota a cuota.
7. **Días con registro** — parte de `transactions`, no de `ledger_entries`: días distintos
   de `occurred_on`, agrupados por `date_trunc('month', occurred_on)`, con al menos una
   transacción no borrada en el mes. Usar `ledger_entries.period` acá daría mal: una compra
   de agosto en 12 cuotas tiene imputación en diciembre, y ese día de agosto no es un día
   con registro *de diciembre*. Esta consulta mide hábito de registro, no impacto mensual.

## Vista de integridad

`ledger_integrity_violations` expone las transacciones cuya suma de imputaciones no cuadra
contra I1 o I1' — no debería devolver filas nunca, dado que la escritura es atómica (C4) y
el único generador de imputaciones es `generate_ledger_entries`. Sirve de aserción en los
tests de integración y de herramienta de inspección manual si alguna vez hay que
sospechar de datos escritos por fuera del camino normal.
