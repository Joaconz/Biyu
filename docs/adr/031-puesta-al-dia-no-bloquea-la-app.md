# ADR-033 — Si la puesta al día falla, la app se muestra igual y lo avisa

**Estado:** propuesta · **Fecha:** 2026-10
**Relacionada:** ADR-017 · ADR-021 · ADR-033 · `06-suscripciones.md` (R6) · `03-architecture-spec.md` §4

## Contexto

ADR-017 decide que la puesta al día corre al entrar, y `03-architecture-spec.md` §4 que el cliente
invoca la Edge Function `run-subscription-catchup` apenas resuelve la sesión, "antes de renderizar el
dashboard". Ninguno de los dos dice qué pasa cuando esa llamada falla o tarda (sin red, la Edge
Function caída, cincuenta suscripciones con dos años de atraso), ni cómo se entera el usuario de una
suscripción en USD bloqueada por falta de tipo de cambio (R6), que "se reporta como bloqueada" sin
decir dónde. Tampoco qué "hoy" usa el cliente para lo que calcula él (vista previa, bloqueadas).

Bloquear la app hasta que la puesta al día termine bien protege la completitud del Resumen, pero deja
al usuario sin poder registrar un gasto, la acción más importante de la app, por una feature
secundaria.

## Decisión

1. **Cuándo corre.** Una vez por carga de la app, cuando `AppLayout` resuelve una sesión con el setup
   completo (ADR-025), y otra vez **después de guardar un tipo de cambio en Ajustes** (es lo que
   destraba una bloqueada). No corre al navegar entre pestañas.
2. **Mientras corre** al cargar, `AppLayout` muestra "Poniendo al día tus suscripciones…" en lugar del
   contenido, como máximo **8 segundos**. La que corre después de guardar un tipo de cambio no bloquea
   la pantalla.
3. **Si termina bien** y creó al menos una transacción, se muestra el aviso "Se cargaron N gastos de
   suscripciones" ("Se cargó 1 gasto de suscripciones"). Si no creó nada, no hay aviso.
4. **Si falla o pasan los 8 segundos**, se muestra la pantalla pedida igual, con una franja: "No pudimos
   cargar tus suscripciones vencidas. Los totales pueden estar incompletos." y "Reintentar". Reintentar
   es seguro porque la puesta al día es idempotente (I16). Si la Edge Function termina después de los 8
   segundos, lo que creó queda creado y aparece en la próxima lectura.
5. **Respuesta de la Edge Function:** `200` con `{ generated, failed: [{ subscription_id, period, reason
   }] }`. Una ocurrencia que ya existía (incluida la que ganó otra puesta al día concurrente) no es
   error. Un `failed` no vacío **no** muestra la franja: esas suscripciones se marcan en Suscripciones
   (punto 6).
6. **Bloqueadas no se persisten.** Una suscripción está bloqueada si está activa y tiene al menos un
   período vencido según R1, R4 y R5, dentro de `[generate_from_period, end_period]`, sin transacción
   generada y que no se puede generar: por falta de `fx_rates` de ese período (R6) o porque su monto en
   pesos queda fuera de rango (mayor a $999.999.999.999,99 o menor a $0,01, ADR-033). Se deriva al
   leer con la función de dominio de la vista previa, sin columna nueva, y se muestra en Suscripciones,
   no en el Resumen.
7. **"Hoy" en el cliente** es el día calendario de Argentina, calculado por una función de
   `src/lib/clock.ts` (`todayInArgentina()`), no la fecha local del dispositivo. Las fechas que salen de
   un `timestamptz` (pausada desde, cancelada el) también se muestran en hora de Argentina. Así la vista
   previa, las bloqueadas y el total comprometido usan el mismo día que las RPC (ADR-021).

## Alternativas descartadas

- **Bloquear la app hasta que termine bien.** Es la lectura literal de "antes de renderizar el
  dashboard". Un fallo de la Edge Function dejaría la app inutilizable, incluido el registro de gastos.
- **No avisar nada al fallar.** El Resumen mostraría un total menor sin explicación, justo lo que la
  feature quiere evitar (US-53).
- **Guardar el estado "bloqueada" en una columna.** Es un dato derivado que se desincroniza en cuanto el
  usuario carga el tipo de cambio que faltaba, igual que el `last_generated_period` que
  `04-data-model.md` ya descartó.
- **Usar la fecha local del dispositivo.** Con el teléfono en otra zona horaria, o entre las 21:00 y las
  23:59 de Argentina, la vista previa mostraría meses distintos de los que crea el servidor.

## Consecuencias

- El hueco de R7 no depende de esta pantalla: lo cierra ADR-033 en la RPC. Por eso la app puede
  mostrarse aunque la puesta al día haya fallado.
- El tope de 8 segundos protege la UX, pero no mide rendimiento: el caso de 50 suscripciones con 24 meses
  de atraso tiene su propio criterio de tiempo, que exige terminar bien (US-53).
- La franja, el reintento y el aviso de éxito llevan `data-testid` (`app-catchup-*`).
- Si la app queda abierta pasado el día de cobro, la ocurrencia de ese día aparece recién al recargar.
