# ADR-034 — Reintento del guardado con clave de idempotencia y movimientos pendientes locales

**Estado:** propuesta · **Fecha:** 2026-10

## Contexto

US-70 (V2) pide que, si guardar una transacción falla, el usuario pueda reintentar sin volver a
cargarla. Hoy el formulario de Registrar conserva lo cargado en memoria, pero el error es un toast que
desaparece solo, no ofrece reintentar y, sin conexión, muestra el mensaje técnico del navegador
("TypeError: Failed to fetch"). Dos NFR de V2 acotan la solución (`docs/pre-entrega.md` §4, épica #20):

- **NFR-10:** reintentar tras un error de red no genera transacciones duplicadas.
- **NFR-09:** si se pierde la conexión, lo cargado no se pierde (borrador local). La trazabilidad
  dejó abierto "cuánto sobrevive el borrador local" (`docs/08-trazabilidad.md`, CHK005).

El caso difícil es el ambiguo: el pedido llega a Postgres, `create_transaction` confirma y la
respuesta se pierde (corte de señal, o el cliente deja de esperar). El cliente ve un error, pero la
transacción ya existe. Si se reintenta con la RPC actual, se crea una segunda transacción con sus N
imputaciones, y el total del mes queda inflado sin que nada lo avise.

## Decisión

**Clave de idempotencia generada por el cliente.**

- El formulario genera un UUID (`crypto.randomUUID()`) al tocar Guardar sobre un borrador y lo
  reusa en cada reintento mientras los valores sean los mismos del intento que falló. Si algún valor
  queda distinto, el próximo Guardar es un intento nuevo, con clave nueva. Volver al mismo valor no
  cuenta como cambio.
- `create_transaction` suma el parámetro `p_request_id uuid default null`. Sigue siendo una sola
  llamada (C4). `transactions` suma la columna `request_id uuid null`, con un índice único parcial
  `(user_id, request_id) where request_id is not null`.
- **La clave se busca antes de validar.** Si ya existe una transacción del mismo `auth.uid()` con esa
  clave, esté activa o eliminada (C10), la RPC devuelve su `id` y no valida, no compara el contenido
  y no inserta nada: ni transacción, ni imputaciones, ni la deuda que sume US-34. Así, el reintento de
  algo que ya se guardó no falla porque, mientras tanto, su categoría se haya archivado.
- Dos llamadas simultáneas con la misma clave las resuelve el índice único: la RPC inserta con
  `on conflict do nothing` y, si no insertó, devuelve el `id` existente. El `23505` nunca llega al
  cliente.
- La búsqueda filtra por `user_id`, así que la clave de otro usuario nunca devuelve una fila ajena
  (C7).
- Con `p_request_id` nulo, la RPC se comporta como hoy. Las llamadas de V1, de pgTAP y de la API sin
  clave no cambian.

**Clasificación del fallo en el cliente.** Es un *rechazo*, y no se reintenta, cuando la respuesta
trae un código de Postgres de clase `22`, de clase `23` o `42501`: repetir el mismo dato fallaría
igual. Todo lo demás es un *error de red* y se puede reintentar: sin respuesta, 15 s sin respuesta,
HTTP 5xx, 404, 408, 429, `40001`, `57014`. Un HTTP 401 (token vencido, `PGRST301`) también es un
rechazo, porque reintentar no lo arregla.

**Plazo de espera.** A los 15 segundos el cliente aborta el pedido (`AbortController`) y lo trata como
error de red. Si la base igual confirma, la clave hace seguro el intento siguiente.

**Movimientos pendientes en el dispositivo, solo tras un error de red.**

- Después de un error de red, el borrador (todos sus campos, el tipo de cambio incluido) se guarda
  en una lista en `localStorage`, con la clave `biyu:pending-drafts:<user_id>`. **Un pendiente es un
  borrador, no una clave:** guarda sus valores más recientes y todas las claves con las que se
  intentó guardarlo. Si el usuario lo edita y vuelve a fallar, se actualiza el mismo pendiente con
  una clave más. Dos borradores distintos son dos pendientes, y un fallo nunca pisa a otro. Un
  rechazo no agrega nada.
- Un pendiente se borra cuando ese borrador se guarda con éxito con cualquiera de sus claves, cuando
  el usuario toca su "Descartar" o cuando cierra sesión. Al cerrar sesión se borran todos los de ese
  usuario (US-64): después de cerrar sesión no queda nada suyo. No vencen por tiempo: la fecha del gasto viaja en el
  borrador, así que recuperarlo días después lo imputa al mes correcto.
- **Recuperar verifica primero.** Antes de cargar un pendiente en el formulario, el cliente consulta
  por la API (bajo RLS) si existe una transacción propia con alguna de sus `request_id`, incluidas
  las eliminadas:
  - Si existe, avisa que ya estaba guardado (o guardado y eliminado) y borra el pendiente.
  - Si no existe, carga el borrador con su fecha y su tipo de cambio (C5), y guarda con la última
    clave.

  Esto cierra el caso en el que el usuario tiene que cambiar un campo del borrador recuperado (por
  ejemplo, una categoría que se archivó): como ya se verificó que el intento original no llegó, la
  clave nueva no puede duplicar nada.
- Si `localStorage` no está disponible (almacenamiento lleno o bloqueado), no se
  persiste nada y el borrador vive solo en memoria, como hoy. No se muestra ningún error por eso.

## Alternativas descartadas

- **Reintentar sin clave y avisar "revisá Movimientos antes de reintentar".** No toca el schema, pero
  le pasa al usuario un problema que el sistema puede resolver, y no cumple NFR-10.
- **Detectar duplicados por contenido** (mismo monto, cuenta, categoría y fecha en los últimos
  minutos). Dos cafés iguales el mismo día son dos gastos legítimos: se rechazarían datos válidos.
- **Clave derivada del contenido del borrador** (un hash). Tiene el mismo problema: dos gastos
  idénticos colisionan.
- **Rechazar una clave repetida con otro contenido** (lo que hacen algunas APIs de pago). Es más
  estricto, pero obliga a comparar el payload campo por campo y convierte en error el reintento
  legítimo de algo que ya se guardó. El cliente ya genera una clave nueva ante cualquier cambio, así
  que una clave repetida con otro contenido solo llega por la API a mano. En ese caso se devuelve el
  `id` original y el comportamiento queda documentado (US-70 · CA-13).
- **Un pendiente por clave.** Cada edición después de un fallo dejaría un pendiente viejo, y
  recuperarlo duplicaría el gasto ya corregido y guardado.
- **Un solo pendiente por usuario, que se reemplaza con cada fallo.** Es más simple, pero si el
  usuario ignora el aviso y le falla otro gasto, pierde el primero sin enterarse. Contradice NFR-09.
- **Guardar el borrador en `localStorage` en cada cambio, aunque no haya fallado nada.** También
  cubre recargar a mitad de la carga, pero cada formulario abandonado aparecería como "pendiente" y
  el aviso perdería valor. Mientras se completa el formulario no se envía nada, así que perder la
  conexión en ese momento no pierde datos: el riesgo real es al guardar. ADR-024 ya acepta que
  recargar a mitad de la carga vacía el borrador.
- **Cola offline con reenvío automático al reconectar.** Es lo que pediría una PWA, que ADR-022
  difiere a V3, y en Safari iOS no hay Background Sync (NFR-05). Fuera de alcance.

## Consecuencias

- **Contrato y schema.** Cambia el contrato de `create_transaction` (parámetro nuevo, opcional) y el
  schema de `transactions`. La migración pasa por `rls-migration-reviewer` y aparece como diff en el
  PR (C15). Al implementar, `docs/04-data-model.md` suma la columna y una invariante nueva: "no hay
  dos transacciones del mismo usuario con el mismo `request_id`". Los tipos se regeneran con
  `npm run gen:types`.
- **Tests pgTAP nuevos:**
  - La misma clave dos veces devuelve el mismo `id` y deja 1 transacción y N imputaciones.
  - La misma clave con otro monto, o con la categoría ya archivada, devuelve el `id` original.
  - Claves distintas con el mismo contenido crean 2 transacciones.
  - La clave de otro usuario no devuelve su fila.

  El par de RLS de `transactions` (C7) no cambia.
- **Clave de una transacción borrada.** Una transacción borrada (C10) conserva su `request_id`:
  reintentar con esa clave devuelve el `id` de la borrada y no la recrea. "Recuperar" lo detecta y lo
  avisa. Con "Reintentar" en la misma visita solo puede pasar si se la borró desde otro dispositivo
  en el medio. Se acepta.
- **Riesgo residual aceptado.** Si el intento ambiguo sí confirmó y el usuario **edita** el borrador
  en la misma visita antes de reintentar, la clave cambia y puede quedar un duplicado. El usuario
  cambió el gasto a propósito: el toast de éxito dice qué se guardó y Movimientos lo muestra.
- **NFR-18.** Un pendiente vive solo en `localStorage`, pero no es un dato guardado sino una ayuda
  para recuperarlo. Si el navegador lo borra (Safari libera el almacenamiento de un sitio sin uso a
  los 7 días), se pierde la recuperación, nunca una transacción guardada. Es dato del usuario en su
  propio dispositivo, no un secreto ni un dato real del repo (C13, C14).
- **C1 no cambia:** la clave no depende del reloj, y la fecha del borrador ya es un campo del
  formulario.
