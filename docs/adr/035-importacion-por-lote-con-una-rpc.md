# ADR-035 — Importación por lote: una RPC que llama a `create_transaction` por fila

**Estado:** propuesta · **Fecha:** 2026-10
**Relacionada:** ADR-005, 013, 020, 021

## Contexto

US-74, US-76, US-77 y US-78 (`entrega-2/historias/importar-excel.md`; US-74 es [#169](https://github.com/Joaconz/Biyu/issues/169))
importa hasta 500 transacciones desde un `.xlsx`. C4 dice que crear una transacción es una sola llamada
a `create_transaction`, nunca inserts sueltos, y ADR-005 ya había fijado que una importación "crea
transacciones normales a través del mismo camino de escritura que el registro manual". Falta decidir
dos cosas que C4 no contesta porque piensa en una transacción por vez:

1. **Cuántas llamadas.** Una por fila desde el navegador, o una sola para todo el archivo.
2. **Qué pasa si falla una parte.** Una fila que la base rechaza (C6) aunque el cliente la dio por
   válida, o un corte de red en la mitad del lote. La historia pide que las filas válidas se importen
   igual y que reintentar no duplique (NFR-10).

## Decisión

**Una RPC nueva, `import_transactions(p_import_id uuid, p_rows jsonb) returns jsonb`**, `security
definer` con `search_path = ''` y grants como `create_transaction` (ADR-020): `execute` solo para
`authenticated`, revocado de `public` y `anon`.

**Cada fila pasa por `create_transaction`.** La RPC recorre `p_rows` y, por cada elemento, llama a
`public.create_transaction(...)` con los mismos parámetros que manda Registrar. No hay un insert propio
a `transactions` ni a `ledger_entries`: las validaciones, el redondeo (ADR-013), el "hoy" de Argentina
(ADR-021) y la pertenencia de cuenta y categoría son las de siempre. `auth.uid()` sigue resolviendo al
usuario de la request dentro de las dos funciones.

**Cada fila es atómica por separado.** El trabajo de cada fila va en su propio bloque `begin …
exception when others then … end` de plpgsql, que abre una subtransacción: si algo falla, se deshace
solo esa fila (transacción e imputaciones) y la RPC sigue con la próxima. Dentro del bloque está
también la lectura y el cast de cada campo (`p_rows->i->>'amount'` a `numeric`, etc.): un elemento mal
formado (monto `"abc"`, clave faltante, cuotas `"3.5"`) rechaza esa fila, no el lote. Los montos se
leen como texto (`->>`), aunque vengan como número JSON (C2). El resultado de la fila guarda el
`sqlstate` y el mensaje (`sqlerrm`).

**Los mensajes de `create_transaction` son contrato.** El cliente traduce el rechazo de una fila
mirando el comienzo de `error_message` ("la cuenta no existe…", "la categoría no existe…", "FR-06: …";
tabla en la historia, §5). Esos textos ya los fijan los tests pgTAP de `create_transaction`: cambiarlos
es un cambio de contrato (C15) que rompe la importación. Se eligió esto antes que agregar códigos de
error propios a `create_transaction`, que cambiaría una función que no hace falta tocar.

**Fallo del lote entero.** Rechazan todo, sin escribir nada: sin sesión (`42501`), `p_import_id` nulo,
`p_rows` que no es un array o tiene 0 o más de 500 elementos (`check_violation`). La RPC entera es una
sola transacción de Postgres: si la base aborta (por ejemplo, `statement_timeout`, `57014`), no queda
nada. Un corte de red del lado del cliente es distinto: **la base no se entera y puede terminar en
`commit`**. El cliente no sabe si se guardó; lo resuelve el reintento idempotente.

**Idempotencia por identificador de importación.** El cliente genera `p_import_id` (uuid v4) una vez
por archivo confirmado y lo repite en cada reintento. Una tabla nueva **`imports`** (`id` uuid PK = el
de la importación, `user_id`, `sent_rows`, `imported_rows`, `result` jsonb, `created_at`) registra cada
importación. Lo **primero** que hace la RPC es `insert into imports (id, user_id, …) values (…) on
conflict (id) do nothing`, y lo último, guardar `imported_rows` y `result` en esa fila:

- Si el insert entra, la importación es nueva y sigue.
- Si hay conflicto con una fila ya confirmada del mismo usuario, la RPC no crea nada y devuelve el
  `result` guardado con `already_imported = true`.
- Si otra llamada con el mismo id todavía está corriendo, el insert **espera** a que termine (es como
  Postgres resuelve un `on conflict` contra una fila sin confirmar): si la otra hizo `commit`, cae en el
  caso anterior; si hizo `rollback`, el insert entra y la importación se hace ahora. Dos llamadas
  concurrentes nunca importan dos veces.
- Si el id existe pero es de otro usuario (un uuid repetido, o uno elegido a propósito), la RPC
  rechaza el lote (`check_violation`) sin revelar nada de la otra importación.

`imports` tiene RLS `user_id = auth.uid()` solo para `select`; se escribe únicamente desde la RPC, como
`transactions` (C7, ADR-020).

**Contrato.** Cada elemento de `p_rows`: `{ "row": 7, "type", "amount": "45800.00", "currency",
"fx_rate": "1450.0000" | null, "category_id", "account_id", "installments_count", "occurred_on",
"description" }`. `row` es el número de fila de Excel: la RPC no lo valida, solo lo devuelve.
Respuesta: `{ "import_id", "already_imported", "sent_rows", "imported_rows", "rows": [ { "row",
"status": "imported", "transaction_id" } | { "row", "status": "rejected", "error_code",
"error_message" } ] }`.

**Límite de 500 filas**, en la RPC y en el cliente. Tiene que entrar en el `statement_timeout` del rol
`authenticated` de PostgREST. 500 filas son 500 subtransacciones con escritura: superan el caché de
64 subtransacciones por proceso de Postgres, que es un costo de rendimiento conocido. No hay medición
todavía: al implementar se mide 500 filas de 12 cuotas en el deploy. Si no entra en el tiempo de espera, se baja el límite de filas; no se parte la importación en varias llamadas, porque
eso devuelve el problema del fallo a mitad de camino.

## Alternativas descartadas

- **Una llamada a `create_transaction` por fila desde el navegador.** Es lo más simple y no toca la
  base, pero 500 filas son 500 requests: un corte en la fila 230 deja 229 importadas sin ningún
  registro de cuáles, y reintentar el archivo duplica esas 229. NFR-10 obligaría a inventar una clave
  de idempotencia por fila en `transactions`. Además el tiempo total depende de la red del celular.
- **Una RPC por lote todo-o-nada.** Una sola transacción sin subtransacciones: atómica y simple, pero
  una fila rechazada por la base (una categoría archivada en otra pestaña) tira abajo las 499 válidas.
  Contradice la historia, que importa las válidas aunque haya inválidas.
- **Una RPC por lote que inserta directo en `transactions` y `ledger_entries`.** Más rápida, pero copia
  las validaciones y el prorrateo de `create_transaction`: dos implementaciones de la misma regla que
  pueden divergir (C1, C3) y la "ruta de escritura paralela" que ADR-005 prohíbe.
- **Chequear `imports` al final en vez de insertar al principio.** Deja una carrera: un reintento que
  llega mientras la primera llamada sigue corriendo no ve la fila, vuelve a crear todo y termina en un
  error de clave duplicada en vez de en "ya se había guardado".
- **Sin idempotencia, con un aviso de "revisá Movimientos antes de reintentar".** Ahorra la tabla
  `imports`, pero deja al usuario adivinando si 500 transacciones se guardaron.

## Consecuencias

- C4 se cumple fila por fila: cada transacción con sus imputaciones se escribe toda o nada, y la regla
  de alta vive en un solo lugar. I1 a I8 se garantizan igual que en Registrar.
- El fallo parcial queda definido: una fila rechazada por la base no se importa y se informa; un error
  de la base sobre el lote no deja nada; un corte de red deja el estado desconocido y el reintento con
  el mismo id lo resuelve sin duplicar.
- C4 y C7 (`03-architecture-spec.md`) nombran a `create_transaction` como la escritura de
  transacciones; al aceptarse este ADR hay que agregar `import_transactions` como segundo punto de
  entrada (que solo la llama a ella) y sumar `imports` a `04-data-model.md`.
- Cuesta una tabla nueva con su política y su par de tests pgTAP (otra sesión → cero filas, `anon` →
  `permission denied`, C7). La migración pasa por `rls-migration-reviewer`.
- ADR-020 sigue valiendo: `create_transaction` es la única función que escribe `transactions` y
  `ledger_entries`; `import_transactions` no las toca, solo la llama.
- `create_transaction` no cambia. Depende de su firma: si las deudas de V2 la reemplazan por una
  versión con deuda opcional, `import_transactions` se actualiza en la misma migración y pasa la deuda
  vacía.
- Los textos de error de `create_transaction` pasan a ser contrato de la importación.
- La idempotencia cubre el reintento de **la misma** importación, no subir dos veces el mismo archivo:
  eso genera dos `p_import_id` y duplica. La historia lo avisa en pantalla y pide confirmación antes de
  abandonar una importación sin respuesta.
