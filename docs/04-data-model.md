# Modelo de datos

_Nueve tablas. El corazón del modelo es la separación entre `transactions` (el evento) y `ledger_entries` (su impacto mensual)._

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
    ├──< debts
    └──< imports   (registro de cada importación desde Excel, ADR-035)
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

Índice único **parcial**: (`user_id`, `lower(name)`) `where archived_at is null`. No es una
restricción `UNIQUE` simple — permite reutilizar un nombre después de archivar la categoría
que lo tenía. Compara sin distinguir mayúsculas: "Salud" y "salud" no pueden estar activas a la
vez (DEF-019).

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

Índice único **parcial**, igual que en `categories`: (`user_id`, `lower(name)`) `where archived_at is
null`. Permite reutilizar un nombre después de archivar la cuenta que lo tenía.

Solo `type = 'credit_card'` admite `installments_count > 1` (ver invariante I6).

Una cuenta se archiva (`archived_at`) o se elimina. Eliminarla es un borrado físico que hace la RPC
`delete_account` junto con sus transacciones, imputaciones, deudas vinculadas y suscripciones
(ADR-026); es la única excepción a C10.

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
| name | text | not null — "Netflix". De 1 a 60 caracteres (`char_length`), sin espacios en los bordes (ADR-032) |
| amount | numeric(14,2) | > 0 |
| currency | enum | `ARS` \| `USD` |
| category_id | uuid FK → categories | not null |
| account_id | uuid FK → accounts | not null |
| billing_day | int | 1..31 — día del mes en que se cobra |
| start_period | date | día 1 del primer mes que corresponde cobrar |
| end_period | date | día 1; null = indefinida |
| generate_from_period | date | día 1. **Piso móvil de generación.** Arranca igual a `start_period`; pausar lo lleva al período siguiente al corriente y reanudar, al corriente, siempre con `max` (R8). Ninguna RPC lo recibe del cliente (ADR-030) |
| status | enum | `active` \| `paused` \| `cancelled` |
| paused_at | timestamptz | not null si `status = 'paused'` |
| cancelled_at | timestamptz | not null si `status = 'cancelled'` |
| description | text | opcional; hasta 200 caracteres (`char_length`), vacía se guarda como null (ADR-032) |
| created_at | timestamptz | default now() |

Índice único **parcial**: (`user_id`, `lower(name)`) `where status <> 'cancelled'`, así "Netflix"
y "netflix" chocan (ADR-032). Mismo criterio que en `categories` y `accounts`: se puede reutilizar
el nombre de una suscripción cancelada. `CHECK` de largo: `char_length(name) between 1 and 60` y
`description is null or char_length(description) <= 200`.

**Solo lectura para el cliente (ADR-030).** `authenticated` tiene `select` y nada más: alta,
edición, pausa, reanudación y cancelación son RPC `security definer` que ponen al día la
suscripción en la misma transacción (`create_subscription` hoy; las demás llegan con US-56 a
US-59). Las ocurrencias las inserta `insert_transaction_with_entries`, la misma función interna que
usa `create_transaction` (C4).

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
| amount_ars | numeric(14,2) | **columna generada**: `amount` si ARS, `amount * fx_rate` si USD, redondeado half-up a 2 decimales (ADR-013) |
| category_id | uuid FK → categories | not null si type = expense |
| account_id | uuid FK → accounts | not null |
| installments_count | int | default 1, entre 1 y 12 (`transactions_installments_max`, ADR-020) |
| first_period | date | día 1 del mes de la primera imputación |
| description | text | opcional |
| occurred_on | date | fecha real del evento; no posterior a hoy en Argentina (FR-06, `create_transaction`, ADR-021) |
| subscription_id | uuid FK → subscriptions | **opcional** — null si la cargó el usuario a mano |
| subscription_period | date | día 1. `CHECK ((subscription_id is null) = (subscription_period is null))` |
| request_id | uuid | **opcional** — clave de idempotencia de `create_transaction` (`p_request_id`, ADR-034). Null si la llamada no la mandó (V1, API sin clave) y en las ocurrencias de la puesta al día, que no pasan por `create_transaction` |
| deleted_at | timestamptz | soft delete |
| created_at | timestamptz | |

Índice único **parcial**: (`user_id`, `request_id`) `where request_id is not null` (I18). Con
una clave que ya existe para el usuario, `create_transaction` devuelve el `id` de esa
transacción sin validar ni insertar nada (ni imputaciones ni deuda), **también si está
eliminada**: reintentar no recrea lo que el usuario borró. Por `user_id`, la misma clave de otro
usuario no choca ni devuelve su fila (C7). "Recuperar" (US-70) lo consulta por API, bajo RLS.

Índice único **parcial**: (`subscription_id`, `subscription_period`) `where subscription_id
is not null`. Es la garantía de idempotencia de la puesta al día (I11), y **no filtra por
`deleted_at` a propósito**: si el usuario borró la ocurrencia de marzo, la puesta al día no
la vuelve a crear. Borrar es una decisión del usuario, no un hueco a rellenar.

`first_period` es derivable hoy: siempre es el mes de `occurred_on` (ver glosario, "Fecha
de imputación"). Existe como columna igual, sin `CHECK` que la ate a `occurred_on`, porque
es lo que permite modelar el ciclo de cierre de tarjeta más adelante sin migración — ahí
dejaría de ser derivable. La calcula el servidor (`create_transaction`) a partir de `occurred_on`; el cliente no la manda.

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
| amount_ars | numeric(14,2) | **no es columna generada.** La calcula `create_transaction` junto con `amount` (misma regla que `domain/installments.ts`) y se persiste — ver I1' más abajo |

Único: (`transaction_id`, `installment_number`).
Índice: (`user_id`, `period`) — es el acceso principal del dashboard.

## `debts`

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK → users | |
| transaction_id | uuid FK → transactions | **opcional** — null para deudas sueltas |
| person | text | not null; recortada, de 1 a 60 caracteres (`debts_person_length`, ADR-037 §2) |
| amount | numeric(14,2) | > 0 |
| currency | enum | `ARS` \| `USD` |
| fx_rate | numeric(14,4) | mismas reglas que en transactions |
| amount_ars | numeric(14,2) | columna generada, igual que en `transactions`: `amount` si ARS, `amount * fx_rate` si USD, redondeado half-up a 2 decimales (ADR-013). Necesaria para que el neto de reembolsos (consulta 6) reste en ARS sin convertir al leer (C5) |
| direction | enum | `owed_to_me` \| `i_owe` |
| status | enum | `pending` \| `settled` |
| settled_at | timestamptz | null si pending |
| notes | text | hasta 200 caracteres (`debts_notes_length`, ADR-037 §2) |
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
| I6 | `installments_count > 1` solo si la cuenta es `credit_card` y el tipo es `expense` | Trigger en la base (requiere join, no se resuelve con check), revalidado en `create_transaction`. Un segundo trigger en `accounts` impide que una cuenta con compras en cuotas deje de ser `credit_card` (DEF-009) |
| I7 | La suma de las deudas vinculadas a una transacción no supera `transactions.amount_ars`, y una deuda vinculada tiene la misma `currency` que su transacción de origen | Trigger en la base (`security definer`: bloquea la transacción con `for update`, que authenticated no puede hacer por C4; DEF-016) |
| I8 | Una transacción de tipo `expense` tiene categoría | Restricción de verificación |
| I9 | `status = 'settled'` implica `settled_at` not null | Restricción de verificación |
| I10 | Una transacción con `deleted_at` no aporta a ningún KPI, y tampoco su deuda vinculada (ADR-037 §4) | Filtro en todas las consultas de lectura |
| I11 | Una suscripción tiene **como máximo una** transacción por período | Índice único parcial `(subscription_id, subscription_period)` |
| I12 | `start_period ≤ generate_from_period`, y `start_period ≤ end_period` cuando `end_period` no es null. `generate_from_period` **nunca retrocede**: pausar y reanudar solo lo aumentan (R8) | Restricción de verificación + dominio |
| I13 | `billing_day` está entre 1 y 31 | Restricción de verificación |
| I14 | Una transacción con `subscription_id` tiene `installments_count = 1` y `type = 'expense'` | Restricción de verificación |
| I15 | `status = 'paused'` implica `paused_at` not null; `status = 'cancelled'` implica `cancelled_at` not null | Restricción de verificación |
| I16 | La puesta al día es idempotente: ejecutarla dos veces sobre el mismo estado no crea ninguna transacción nueva | Dominio (función pura) + I11 en la base |
| I17 | La puesta al día nunca genera una ocurrencia con `subscription_period` posterior al período corriente, anterior a `generate_from_period`, o posterior a `end_period` | Dominio |
| I18 | No hay dos transacciones del mismo usuario con el mismo `request_id` (ADR-034): reintentar `create_transaction` con la misma clave devuelve la transacción ya creada | Índice único parcial `(user_id, request_id) where request_id is not null` + `create_transaction` |

**I1' — por qué existe además de I1.** I1 garantiza que las cuotas en la moneda original
suman el total original. No garantiza lo mismo en ARS: convertir cada cuota por separado y
redondear introduce un desvío de redondeo que I1 no ve. Ejemplo — USD 100 en 3 cuotas con
`fx_rate = 1250.5555`: las cuotas en USD suman exactamente 100 (✓ I1), pero convertidas y
redondeadas una por una dan $125.055,54 contra un `transactions.amount_ars` de $125.055,55
— un centavo de diferencia en el número que muestra el dashboard. `create_transaction`
aplica la misma regla de absorción del resto (C3) también sobre `amount_ars`, y por eso esa
columna la calcula `create_transaction` en vez de generarse en la base: una columna generada no
puede absorber un resto.

---

## `imports`

Una importación desde Excel (US-77, [ADR-035](adr/035-importacion-por-lote-con-una-rpc.md)). La
escribe solo la RPC `import_transactions`; el cliente la lee bajo RLS. Su `id` hace idempotente el
reintento (NFR-10, US-78): repetir la llamada con el mismo id devuelve `result` sin importar otra vez.

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid PK | lo genera el cliente, uno por archivo confirmado; no tiene default |
| user_id | uuid FK → users | `default auth.uid()`; índice `imports_user_id_idx` |
| sent_rows | int | filas mandadas, de 1 a 500 (`imports_sent_rows_range`) |
| imported_rows | int | filas creadas, entre 0 y `sent_rows`; null mientras la importación corre |
| result | jsonb | la respuesta de la RPC: `import_id`, `sent_rows`, `imported_rows` y una entrada por fila con `transaction_id` o `error_code` y `error_message` |
| created_at | timestamptz | |

No guarda montos: cada fila importada es una transacción normal, sin marca de "importado" (§5 de
`entrega-2/historias/importar-excel.md`).

---

## Row Level Security

_Reemplaza a la sección "Aislamiento por usuario" de la versión con API propia. Ver
[ADR-019](adr/019-vuelta-a-supabase.md) y ADR-004._

El navegador habla directo con Supabase a través del Supabase Client SDK. No hay una capa de
aplicación intermedia que filtre por dueño: **Row Level Security es la autorización real**,
no una red de contención adicional.

Cada tabla (`categories`, `accounts`, `fx_rates`, `subscriptions`, `transactions`,
`ledger_entries`, `debts`, `imports`) tiene una política, como mínimo:

```sql
create policy "select_own_rows" on transactions
  for select using (user_id = auth.uid());
-- análogas para insert/update/delete en las tablas de escritura directa (categories, accounts).
-- transactions, ledger_entries, subscriptions, debts e imports son de solo lectura para el cliente:
-- transactions y ledger_entries se escriben únicamente vía create_transaction (ADR-020);
-- subscriptions, por RPC (create_subscription y las operaciones de ADR-030); debts, vía
-- create_transaction (deuda vinculada, ADR-036), create_debt (deuda suelta, US-36) y
-- settle_debt / reopen_debt (estado, US-39), ADR-037 §1; imports, solo vía import_transactions
-- (ADR-035).
```

Reglas, sin excepciones:

1. **Ninguna política es más laxa que `user_id = auth.uid()`.** No hay una política
   `using (true)` "temporal para probar" en ninguna tabla, ni siquiera en desarrollo.
2. **El `user_id` de una fila nueva se completa con `auth.uid()`**, nunca con un valor que
   mande el cliente. Se aplica con un `default auth.uid()` en la columna o con un trigger
   `before insert`, para que un cliente que intente forzar un `user_id` ajeno en el `insert`
   lo vea ignorado o rechazado.
3. **El rol `anon`** (sin sesión) no tiene privilegios ni políticas sobre estas tablas.
   Un pedido sin JWT válido contra la API de Supabase se rechaza con `permission denied`
   (`42501`) y no devuelve datos; un pedido con el JWT de otro usuario pidiendo un recurso
   ajeno devuelve cero filas — RLS no distingue "no existe"
   de "no es tuyo", y eso es intencional: no permite inferir existencia.
4. **La `service_role key`, que se salta RLS por completo, nunca la usa el cliente ni una Edge
   Function que atiende el pedido de un usuario.** `run-subscription-catchup` reenvía el JWT del
   usuario y llama a la RPC `run_subscription_catchup`, que toma el usuario de `auth.uid()`
   (ADR-030, ADR-031). Solo la tienen disponible el arnés de tests (ADR-015) y un proceso sin
   sesión de usuario, si llegara a existir (por ejemplo, el cierre de tarjeta), y la usan para
   escribir en nombre del usuario correcto explícitamente, no para saltear el filtro por error (C8).

`ledger_entries` conserva el `user_id` denormalizado. No es solo para que la política no
tenga que hacer un join por fila — aunque eso también importa para el plan de consulta —
sino porque el índice `(user_id, period)` es el acceso principal del dashboard.

**Grupo de pruebas obligatorio.** Para cada tabla, un caso de pgTAP que consulta con el JWT
de otro usuario y espera cero filas, y otro que consulta sin sesión (rol `anon`) y espera
`permission denied` (`42501`). Es la verificación directa de NFR-13 (`pre-entrega.md`) y lo que hace que C7 esté
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
   `transaction_id` tiene `first_period` igual al período consultado y no tiene `deleted_at`
   (ADR-037 §4: la deuda sigue la baja lógica de su gasto). Las deudas sueltas y las `i_owe` no
   restan, y la fila del neto solo aparece si al menos una deuda cuenta (US-30). La deuda se imputa
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
el único generador de imputaciones es `create_transaction` ([ADR-020](adr/020-create-transaction-security-definer.md)). Sirve de aserción en los
tests de integración y de herramienta de inspección manual si alguna vez hay que
sospechar de datos escritos por fuera del camino normal.
