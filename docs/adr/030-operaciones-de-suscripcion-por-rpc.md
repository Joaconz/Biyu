# ADR-030 — Las operaciones sobre una suscripción son RPC que la ponen al día

**Estado:** propuesta · **Fecha:** 2026-10
**Relacionada:** ADR-017 · ADR-020 · ADR-021 · ADR-031 · ADR-032 · `06-suscripciones.md` (R3, R7, R8) · C4, C6, C7

## Contexto

`04-data-model.md` deja `subscriptions` como tabla de escritura directa: el cliente podría hacer
`insert`, `update` y `delete` con el SDK, como en `categories`. Para suscripciones eso no alcanza:

1. **Pausar y reanudar dependen de "hoy".** R8 mueve `generate_from_period` según el período
   corriente. Si el cliente calcula ese valor y lo manda en un `update`, un cliente con el reloj mal (o
   una llamada directa a la API) puede hacer retroceder el piso y reabrir meses ya descartados. Es el
   mismo problema que ADR-021 resolvió para la fecha de una transacción.
2. **El hueco de R7.** `06-suscripciones.md` cierra "estoy tres meses atrasado y cambio el monto" con
   una regla de orden de la UI: la puesta al día corre antes de mostrar la edición. Una llamada directa
   a la API reabre el hueco, y lo mismo pasa al pausar o cancelar con meses atrasados: R3 deja de
   generarlos y se pierden.
3. **Cómo se insertan las ocurrencias.** C4 prohíbe inserts sueltos a `transactions` y
   `ledger_entries`. Pero `create_transaction` rechaza categorías y cuentas archivadas, y una
   suscripción ya existente sobre una categoría archivada tiene que seguir generando
   (`06-suscripciones.md`, casos de borde).

## Decisión

**Toda escritura sobre `subscriptions` es una RPC** (`security definer`, patrón de ADR-020). El cliente
conserva solo el permiso de lectura: `insert`, `update` y `delete` directos se revocan. V2 no tiene
"eliminar suscripción"; eliminar una cuenta las borra por `delete_account` (ADR-026).

| RPC | Orden, dentro de una sola transacción | Devuelve |
|---|---|---|
| `create_subscription` | Valida (ADR-032, I12, I13, categoría y cuenta activas del usuario) → inserta con `generate_from_period = start_period` → pone al día | `{ subscription_id, generated }` |
| `update_subscription` | Pone al día → aplica los cambios permitidos (ADR-032) → pone al día | `{ generated_before, generated_after }` |
| `pause_subscription` | Pone al día → aplica "Pausar" de `06-suscripciones.md` | `{ generated_before }` |
| `resume_subscription` | Aplica "Reanudar" → pone al día | `{ generated_after }` |
| `cancel_subscription` | Pone al día → aplica "Cancelar" | `{ generated_before }` |

- **"Hoy"** es el de ADR-021: `(now() at time zone 'America/Argentina/Buenos_Aires')::date`. Ninguna RPC
  pública recibe `today` ni `generate_from_period`.
- **"Poner al día"** es una función interna, `catch_up_subscriptions(p_user_id, p_today,
  p_subscription_id default null)`, la misma que llama la Edge Function `run-subscription-catchup`.
  Recibe `p_today` para que pgTAP pueda fijar la fecha; **no tiene `execute` para `authenticated` ni
  `anon`**: las RPC públicas la llaman con el hoy del servidor.
- **Cada suscripción se procesa en su propio bloque** (`begin … exception`, un savepoint por
  suscripción). Si una ocurrencia no se puede insertar (por ejemplo, `amount_ars` fuera de
  `numeric(14,2)` o redondeado a 0,00), esa ocurrencia no se crea, se informa en `failed` y las demás
  suscripciones y los demás períodos siguen. Una ocurrencia que choca con el índice único I11 (otra
  puesta al día concurrente) cuenta como ya generada, no como falla.
- **Las operaciones nunca fallan por la puesta al día previa.** Pausar o cancelar una suscripción con
  una ocurrencia que no se puede generar se hace igual; la ocurrencia queda sin generar.
- **Inserción.** `create_transaction` y la puesta al día comparten una función interna
  (`insert_transaction_with_entries`) que calcula `first_period`, las imputaciones e I1/I1' (C3, C4). La
  puesta al día **no** exige que la categoría ni la cuenta estén activas; todo lo demás (I4, I5, I8, I14)
  se valida igual.
- **Errores.** Transición inexistente (reanudar una activa, pausar una pausada, cualquier operación sobre
  una cancelada): `check_violation` (23514) con mensaje en español. Suscripción inexistente o de otro
  usuario: `no_data_found` (P0002) con el mensaje "Suscripción no encontrada" (no distingue una de otra,
  igual que RLS). Sin sesión: `permission denied` (42501), porque `anon` no tiene `execute`.

## Alternativas descartadas

- **`update` directo con el piso calculado en el cliente.** Lo más simple y lo que sugería el modelo de
  datos, pero el piso dependería del reloj del cliente y el hueco de R7 quedaría abierto para cualquier
  llamada que no pase por la pantalla. C6 pide que la validación real esté en Postgres.
- **Un trigger `before update` que recalcule el piso.** Resuelve el reloj, pero no puede insertar las
  ocurrencias atrasadas antes del cambio sin volverse una segunda puesta al día escondida.
- **Puesta al día "todo o nada".** Una sola suscripción con un monto que desborda en pesos tiraría abajo
  la generación de todas en cada carga, y además impediría cancelarla.
- **Reusar `create_transaction` tal cual para generar.** Rechaza categorías y cuentas archivadas y no
  recibe `subscription_id`.

## Consecuencias

- Cada RPC lleva su par de autorización en pgTAP (otra sesión → P0002 y nada cambia; `anon` → 42501), un
  caso por transición inexistente y el negativo por API de cada validación (C6, C7).
- `04-data-model.md` §RLS cambia: `subscriptions` pasa a ser de solo lectura para el cliente, como
  `transactions`.
- Pausar, editar, reanudar o cancelar pueden crear transacciones como efecto lateral. Es intencional; la
  UI informa cuántas (US-56 a US-59).
- I12, I13 e I15 siguen como `CHECK`: la RPC valida antes para dar mensajes en español, pero el `CHECK`
  es la red final.
- Pausar o cancelar no rescata los meses bloqueados por falta de tipo de cambio (R6): quedan sin generar
  para siempre. La UI lo avisa en el diálogo (US-56, US-58); no se impide la operación.
