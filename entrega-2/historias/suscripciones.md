# Proyecto Biyu – Entrega 2 · Historias de Usuario de Suscripciones (V2)

**Testing de Aplicaciones · Proyecto Integrador** · Épica: Suscripciones ([#17](https://github.com/Joaconz/Biyu/issues/17)) ·
Milestone V2 · Versión del documento: 2026-10-06

## Cómo leer este documento

- Trece historias: US-52 a US-63 (las de `docs/06-suscripciones.md`) y **US-75**, nueva: vista previa
  del calendario de una suscripción antes de darla de alta (roadmap §V2, "Cambios de interfaz").
- Mismo esquema que la Entrega 1: **historia `US-nn` → criterio `CA-k` → caso `CP-SUS-nnn`**. Los casos
  se diseñan aparte; este documento no los escribe.
- Cada historia dice qué pantalla toca, con su ruta, y especifica **solo los elementos que agrega o
  cambia**. La pantalla que una historia introduce se describe entera en esa historia (las pantallas
  Suscripciones, Nueva suscripción y Detalle nacen en US-52).
- Los textos entre comillas son **exactos**: botones, rótulos, mensajes de error y avisos. Un caso de
  prueba los compara carácter por carácter.
- Todo elemento interactivo lleva `data-testid` con la forma `<pantalla>-<elemento>`
  (`docs/07-plan-de-testing.md` §2). Las filas de una lista repiten su `data-testid` y se distinguen por
  atributos `data-*`, como `transactions-item` en Movimientos.
- **"Hoy"** es el día calendario de Argentina, en el servidor (ADR-021) y en el cliente
  (`todayInArgentina()`, ADR-031), no la fecha local del dispositivo. Las fechas y horas que salen de un
  `timestamptz` también se muestran en hora de Argentina. En los ejemplos, hoy es **2026-10-06** y el
  período corriente es octubre 2026.
- **CA con fecha fija.** Un criterio que dice "con la puesta al día del 2026-08-15" fija el hoy. En pgTAP
  se verifica llamando a la función interna `catch_up_subscriptions` con ese `p_today` (ADR-030). En la
  ejecución manual se traduce a fechas relativas: el mes del ejemplo pasa a ser el período corriente y
  los demás se corren igual ("desde mayo 2026, hoy 2026-08-15" = "desde 3 meses antes del corriente,
  hoy día 15"). Si el día del ejemplo no coincide con el de la ejecución, se elige el día de cobro
  respecto de hoy, como indica la nota de US-55.
- **Avisos y diálogos.** Los avisos breves ("Suscripción guardada", etc.) llevan `data-testid` =
  `subscription-toast`, salvo los de la puesta al día (`app-catchup-generated`). Los tres diálogos nuevos
  siguen la regla de DEF-024 (`entrega-1/04-reportes-de-defectos.md`), la misma de `delete-transaction-dialog`: al abrir, el foco va al botón de cerrar; Tab no sale del diálogo; Escape lo
  cierra y el foco vuelve al botón que lo abrió.
- **Listas desplegables y selector de mes** son controles nativos (`<select>`, `<input type="month">`):
  las opciones no llevan `data-testid` y se eligen por valor (el `id` o el `YYYY-MM`).
- **Cantidades en los textos.** Donde un texto dice "N gastos", con N = 1 dice "1 gasto" (y el verbo en
  singular, "se cargó"), y con N = 0 no se muestra la oración salvo que la historia diga otra cosa. Una
  lista de meses se escribe separada por comas y con "y" antes del último: "julio 2026, agosto 2026 y
  septiembre 2026".
- Formatos: pesos "$5.000,00"; dólares "USD 10,00"; fechas "10/08/2026"; meses "agosto 2026" en
  pantalla y `YYYY-MM` en la URL y en `data-period` (C11, ADR-023). Montos ficticios (C14).
- Mocks: `entrega-2/mocks/suscripciones-*.html`, con el sistema de diseño de ADR-023.

### Decisiones que estas historias dan por tomadas

| ADR | Qué decide | Historias que dependen |
|---|---|---|
| [ADR-017](../../docs/adr/017-suscripciones-por-puesta-al-dia-idempotente.md) | Generación por puesta al día idempotente, al entrar | US-53, US-55, US-60 |
| [ADR-030](../../docs/adr/030-operaciones-de-suscripcion-por-rpc.md) | Toda escritura sobre `subscriptions` es una RPC con el hoy del servidor, que pone al día esa suscripción; cada suscripción se genera aislada y una falla no frena a las demás ni a la operación | US-52, US-53, US-56 a US-59 |
| [ADR-031](../../docs/adr/031-puesta-al-dia-no-bloquea-la-app.md) | Si la puesta al día falla o tarda más de 8 s, la app se muestra con una franja y "Reintentar"; corre al cargar y al guardar un tipo de cambio; "bloqueada" se deriva; el cliente usa el hoy argentino | US-53, US-62, US-75 |
| [ADR-032](../../docs/adr/032-alcance-del-alta-y-la-edicion-de-suscripciones.md) | Rangos del alta (nombre de 60, inicio de −24 a +12 meses), qué campos se editan y cómo se extiende una terminada | US-52, US-59, US-75 |
| [ADR-033](../../docs/adr/033-total-comprometido-en-suscripciones.md) | Qué suma el total comprometido y con qué tipo de cambio | US-63 |

### Resumen

| Historia | Qué permite | Pantallas |
|---|---|---|
| US-52 | Dar de alta una suscripción | Suscripciones, Nueva suscripción, Detalle (nuevas) |
| US-53 | Que los meses vencidos se carguen solos al entrar | Todas las privadas (aviso de puesta al día) |
| US-54 | Que el día 31 se cobre el último día de los meses cortos | Nueva suscripción, Detalle |
| US-55 | Que el mes corriente aparezca recién el día del cobro | Detalle |
| US-56 | Pausar | Detalle, diálogo "Pausar" |
| US-57 | Reanudar sin relleno | Detalle, diálogo "Reanudar" |
| US-58 | Cancelar sin perder el historial | Detalle, diálogo "Cancelar" |
| US-59 | Editar el monto y otros datos sin tocar el pasado | Editar suscripción (nueva) |
| US-60 | Borrar un mes puntual sin que vuelva | Movimientos (diálogo de borrado), Detalle |
| US-61 | Reconocer qué movimientos vienen de una suscripción | Movimientos, Resumen, Detalle |
| US-62 | Avisar cuando falta el tipo de cambio de una suscripción en USD | Suscripciones, Detalle |
| US-63 | Ver el total mensual comprometido | Suscripciones |
| US-75 | Ver el calendario antes de guardar | Nueva suscripción |

---

## Historias de usuario

#### US-52: Dar de alta una suscripción · [#210](https://github.com/Joaconz/Biyu/issues/210) · Pendiente

- **Objetivo:** Como usuario, quiero dar de alta un gasto recurrente indicando nombre, monto, moneda,
  categoría, medio de pago y día de cobro, para no cargarlo a mano todos los meses.
- **Pantallas (tres nuevas):**

  **1. Suscripciones** (`/subscriptions`). Destino "Suscripciones" de la barra de navegación
  (`<pantalla>-nav-subscriptions`; la barra de V2 es #172, ADR-023). Estructura, de arriba abajo:
  1. Encabezado "Suscripciones" (`subscriptions-title`) con el botón "Nueva" (`subscriptions-new`) → `/subscriptions/new`.
  2. Tarjeta del total comprometido (US-63). No se muestra en el estado vacío.
  3. Tres grupos, en este orden y solo si tienen filas: "Activas", "Pausadas", "Canceladas". Dentro de
     cada grupo, orden alfabético por nombre sin distinguir mayúsculas.
  4. Cada fila (`subscriptions-item`, con `data-subscription-id` y `data-status` =
     `active` | `paused` | `cancelled`) es un enlace a `/subscriptions/:id` y muestra: nombre
     (`subscriptions-item-name`), monto con moneda (`subscriptions-item-amount`), "Se cobra el día 10"
     (`subscriptions-item-billing-day`), si corresponde la marca de US-62 y, si está terminada (`end_period`
     anterior al período corriente, ADR-032), "Terminó en mayo 2026" (`subscriptions-item-ended`) en lugar
     de "Se cobra el día…". Una terminada sigue en "Activas".

  | Estado | Qué se ve | `data-testid` |
  |---|---|---|
  | Cargando | "Cargando suscripciones…" | `subscriptions-loading` |
  | Error | "No pudimos cargar tus suscripciones." y el botón "Reintentar" | `subscriptions-error`, `subscriptions-retry` |
  | Vacío | "Todavía no tenés suscripciones. Cargá lo que pagás todos los meses y se registra solo." y el botón "Agregar la primera" → `/subscriptions/new` | `subscriptions-empty`, `subscriptions-empty-new` |

  **2. Nueva suscripción** (`/subscriptions/new`). Encabezado "Nueva suscripción" con el botón atrás
  (`subscription-form-back`) → `/subscriptions`. Debajo, el formulario (`subscription-form`), la vista
  previa (US-75) y, al pie, fijos, "Cancelar" (`subscription-form-cancel`) y "Guardar suscripción"
  (`subscription-form-submit`).

  | Campo | `data-testid` | Tipo | Oblig. | Acepta / rango | Máx. | Valor inicial |
  |---|---|---|---|---|---|---|
  | "Nombre" | `subscription-form-name` | Texto | Sí | Cualquier carácter. Se guarda sin espacios al principio ni al final y tiene que quedar de 1 a 60 caracteres | 60 caracteres, contados como en Postgres (un emoji cuenta 1); el campo no deja escribir más | Vacío |
  | "Monto" | `subscription-form-amount` | Texto con teclado decimal | Sí | Mismo formato que el monto de Registrar (US-01): dígitos y una coma decimal, hasta 2 decimales; > 0 y ≤ 999.999.999.999,99 | — | Vacío |
  | "Moneda" | `subscription-form-currency-ars`, `subscription-form-currency-usd` | Control segmentado | Sí | ARS o USD | — | ARS |
  | "Categoría" | `subscription-form-category` | Lista desplegable | Sí | Categorías activas del usuario | — | Ninguna |
  | "Medio de pago" | `subscription-form-account` | Lista desplegable | Sí | Cuentas activas del usuario, de cualquier tipo | — | Ninguna |
  | "Día de cobro" | `subscription-form-billing-day` | Texto con teclado numérico | Sí | Solo dígitos (cualquier otro carácter no se escribe); 1 a 31; "01" se guarda como 1. Debajo, fijo: "Si el mes tiene menos días, se cobra el último día del mes." | 2 dígitos | Vacío |
  | "Mes de inicio" | `subscription-form-start-period` | Selector de mes | Sí | Desde 24 meses antes del período corriente hasta 12 meses después, inclusive (hoy: octubre 2024 a octubre 2027) | — | Período corriente |
  | "Mes de fin (opcional)" | `subscription-form-end-period` | Selector de mes, con "Sin fin" (`subscription-form-end-period-clear`) | No | ≥ mes de inicio y ≤ diciembre 2099. Vacío = sin fin | — | Vacío |
  | "Descripción (opcional)" | `subscription-form-description` | Texto multilínea con contador "n/200" | No | Cualquier carácter. Se guarda sin espacios en los bordes; vacía se guarda como sin descripción | 200 caracteres, contados como el nombre; el campo no deja escribir más | Vacío |

  Mensajes de error, debajo de su campo, al tocar "Guardar suscripción" (y en vivo después del primer intento):

  | Condición | Mensaje |
  |---|---|
  | Nombre vacío o solo espacios | "Escribí un nombre" |
  | Nombre de más de 60 caracteres (solo llega por API) | "El nombre admite hasta 60 caracteres" |
  | Nombre igual, sin distinguir mayúsculas ni espacios de los bordes, al de otra suscripción activa o pausada | "Ya tenés una suscripción con ese nombre" |
  | Monto vacío, 0 o negativo | "El monto debe ser mayor a cero" |
  | Monto con más de 2 decimales | "El monto admite hasta 2 decimales" |
  | Monto mayor al máximo | "El monto máximo es $999.999.999.999,99" en ARS y "El monto máximo es USD 999.999.999.999,99" en USD |
  | Sin categoría | "Elegí una categoría" |
  | Sin medio de pago | "Elegí un medio de pago" |
  | Día de cobro vacío | "Indicá el día de cobro" |
  | Día de cobro 0 o mayor a 31 (por API, también no entero) | "El día de cobro va de 1 a 31" |
  | Mes de inicio vacío | "Elegí el mes de inicio" |
  | Mes de inicio fuera de rango | "El mes de inicio va de octubre 2024 a octubre 2027" (con los meses calculados a partir de hoy) |
  | Mes de fin anterior al de inicio | "El mes de fin no puede ser anterior al de inicio" |
  | Mes de fin posterior a diciembre 2099 | "El mes de fin puede ser como máximo diciembre 2099" |
  | Descripción de más de 200 caracteres (solo llega por API) | "La descripción admite hasta 200 caracteres" |
  | Categoría o cuenta archivada o de otro usuario (solo llega por API) | "La categoría no está disponible" / "El medio de pago no está disponible" |

  | Estado | Qué se ve | `data-testid` |
  |---|---|---|
  | Cargando categorías y cuentas | "Cargando…" en lugar del formulario | `subscription-form-loading` |
  | Error al cargarlas | "No pudimos cargar tus categorías y medios de pago." y "Reintentar" | `subscription-form-load-error`, `subscription-form-load-retry` |
  | Sin categorías activas | "No tenés categorías activas." y el enlace "Ir a Ajustes" → `/settings` | `subscription-form-category-empty`, `subscription-form-category-empty-settings` |
  | Sin cuentas activas | "No tenés medios de pago activos." y el enlace "Ir a Ajustes" → `/settings` | `subscription-form-account-empty`, `subscription-form-account-empty-settings` |
  | Guardando | "Guardar suscripción" deshabilitado con el texto "Guardando…"; los campos no se pueden editar | `subscription-form-submit` |
  | Error al guardar | Arriba de los botones: "No se pudo guardar: <motivo>". Los campos conservan lo cargado y "Guardar suscripción" vuelve a estar habilitado. Sin red, el motivo es "revisá tu conexión y probá de nuevo" | `subscription-form-error` |
  | Reintento después de un error de red que choca con el nombre | Si el intento anterior falló por red y el reintento da "Ya tenés una suscripción con ese nombre", debajo del mensaje se agrega "Puede que se haya guardado en el intento anterior." y el enlace "Ver suscripciones" → `/subscriptions` | `subscription-form-error-list` |

  "Cancelar" y el botón atrás vuelven a `/subscriptions` sin guardar y sin pedir confirmación.

  **3. Detalle de suscripción** (`/subscriptions/:id`). Encabezado con el botón atrás
  (`subscription-detail-back`) → `/subscriptions`, el nombre (`subscription-detail-name`) y el estado
  (`subscription-detail-status`, con `data-status`): "Activa", "Pausada desde 01/10/2026" o "Cancelada
  el 02/09/2026". Debajo:
  1. Avisos (US-62).
  2. Datos (`subscription-detail-data`): "Monto", "Categoría", "Medio de pago", "Día de cobro", "Desde"
     (mes de inicio), "Hasta" (mes de fin o "Sin fin"), "Próximo cobro" (US-54) y "Descripción" (si
     tiene).
  3. Acciones, según el estado: "Editar" (`subscription-detail-edit`, US-59), "Pausar" o "Reanudar"
     (US-56, US-57) y "Cancelar suscripción" (US-58). Una cancelada no muestra ninguna.
  4. "Gastos cargados" (US-61).

  | Estado | Qué se ve | `data-testid` |
  |---|---|---|
  | Cargando | "Cargando…" | `subscription-detail-loading` |
  | Error | "No pudimos cargar la suscripción." y "Reintentar" | `subscription-detail-error`, `subscription-detail-retry` |
  | No existe o es de otro usuario | "No encontramos esta suscripción." y el enlace "Ver suscripciones" → `/subscriptions` | `subscription-detail-not-found`, `subscription-detail-not-found-back` |

- **Criterios de aceptación:**
  - CA-1: Con todos los campos válidos, "Guardar suscripción" crea **una** suscripción con
    `status = 'active'` y `generate_from_period = start_period`, lleva a `/subscriptions/:id` de la nueva y
    muestra el aviso "Suscripción guardada" o, si se cargaron gastos vencidos, "Suscripción guardada. Se
    cargaron N gastos vencidos." (N = `generated` de la RPC).
  - CA-2: Al guardar se crean en la misma operación las transacciones de los períodos vencidos que la
    vista previa de US-75 muestra en "Se cargan al guardar" **sin** `data-blocked="true"`, y ninguna otra.
  - CA-3: Cada condición de la tabla de mensajes impide guardar y muestra su mensaje exacto debajo de su
    campo; no se crea ninguna suscripción.
  - CA-4: Día de cobro en la UI: 1 y 31 se aceptan; "01" se guarda como 1; 0 y 32 se rechazan con "El día
    de cobro va de 1 a 31"; vacío, con "Indicá el día de cobro"; letras, coma y signo menos no se pueden
    escribir. Por API: 0, 32 y 1,5 se rechazan sin crear nada.
  - CA-5: Mes de inicio: el primero y el último del rango se aceptan; el mes anterior al primero y el
    posterior al último se rechazan con su mensaje.
  - CA-6: Nombre: 60 caracteres se acepta; el campo no deja escribir el 61. Por API, 61 caracteres se
    rechaza con "El nombre admite hasta 60 caracteres". "  Netflix  " se guarda como "Netflix".
  - CA-7: Un nombre igual a una suscripción activa o pausada ("Netflix" contra " netflix ") se rechaza;
    igual a una cancelada se acepta.
  - CA-8: Cada validación de CA-3 a CA-7, enviada directo a la RPC `create_subscription` sin pasar por la
    UI, se rechaza con el mismo mensaje y no crea nada (C6, ADR-030).
  - CA-9: Un `insert` y un `delete` directos sobre `subscriptions` con la sesión del usuario se rechazan
    con `permission denied` (42501) y no cambian nada (ADR-030).
  - CA-10: Durante el guardado el botón está deshabilitado; dos toques seguidos crean una sola
    suscripción.
  - CA-11: Si el guardado falla por red, los nueve campos conservan lo cargado y se muestra
    `subscription-form-error`.
  - CA-12: Con la suscripción guardada, la lista de `/subscriptions` la muestra en "Activas" con
    `data-status="active"`.
  - CA-13: Par de autorización de `subscriptions` (C7): con la sesión de otro usuario, la consulta devuelve
    0 filas y `/subscriptions/:id` muestra `subscription-detail-not-found`; sin sesión (rol `anon`), la
    consulta y la llamada a `create_subscription` dan `permission denied` (42501).
  - CA-14: Cada estado de las tres tablas de estados aparece con su texto y su `data-testid`.
  - CA-15: Por API, `create_subscription` con una categoría o una cuenta de otro usuario se rechaza con
    "La categoría no está disponible" / "El medio de pago no está disponible".
  - CA-16: Si el intento anterior falló por red y el reintento choca con el nombre, se ve
    `subscription-form-error-list` con su texto y su enlace.
- **Trazabilidad:** FR-15 · R1, R4, R5, R8 · I4, I12, I13 · C4, C6, C7 · ADR-017, ADR-030, ADR-032
- **Mock:** `entrega-2/mocks/suscripciones-lista.html`, `suscripciones-alta.html`, `suscripciones-detalle.html`

#### US-53: Los meses vencidos se cargan solos al entrar · [#211](https://github.com/Joaconz/Biyu/issues/211) · Pendiente

- **Objetivo:** Como usuario, quiero que los meses vencidos aparezcan cargados solos al entrar a la app,
  para que el dashboard esté completo sin que yo haga nada.
- **Pantalla:** todas las rutas privadas dentro de `AppLayout` (`/register`, `/dashboard`,
  `/transactions`, `/subscriptions…`, `/settings`). No corre en `/setup`, `/login` ni `/signup`.
  - Mientras corre la puesta al día: "Poniendo al día tus suscripciones…" en lugar del contenido
    (`app-catchup-loading`), como máximo 8 segundos (ADR-031).
  - Si creó transacciones: aviso "Se cargaron N gastos de suscripciones" (con N = 1: "Se cargó 1 gasto de
    suscripciones"), con `data-testid` `app-catchup-generated`. Si no creó ninguna, no hay aviso.
  - También corre, sin bloquear la pantalla, después de guardar un tipo de cambio en Ajustes (ADR-031), con
    el mismo aviso si crea algo.
  - Si falla o pasan los 8 segundos: la pantalla pedida se muestra igual, con una franja arriba del
    contenido (`app-catchup-error`, `role="alert"`): "No pudimos cargar tus suscripciones vencidas. Los
    totales pueden estar incompletos." y el botón "Reintentar" (`app-catchup-retry`). Al tocarlo, la
    franja pasa a "Reintentando…" con el botón deshabilitado; si sale bien, desaparece y se muestra el
    aviso de arriba.
- **Qué genera cada ocurrencia:** una transacción de tipo gasto, 1 cuota, con el monto, la moneda, la
  categoría y la cuenta **actuales** de la suscripción (R7), `occurred_on` según R4, `first_period` =
  `subscription_period` = el período, descripción = el nombre de la suscripción en ese momento y, si es
  USD, `fx_rate` = el `fx_rates` del usuario para ese período, congelado (C5).
- **Criterios de aceptación:**
  - CA-1: Suscripción activa de $5.000,00 ARS, día de cobro 10, desde mayo 2026, sin transacciones;
    con la puesta al día del 2026-08-15 existen exactamente 4 transacciones, de mayo a agosto 2026, cada
    una con `occurred_on` el día 10 de su mes, `installments_count = 1`, `type = 'expense'` y monto
    $5.000,00.
  - CA-2: Recargar la página después de CA-1 no crea ninguna transacción nueva y no muestra el aviso
    (I16).
  - CA-3: Dos puestas al día del mismo usuario lanzadas a la vez (dos pestañas abiertas al mismo tiempo,
    o dos llamadas simultáneas a `run-subscription-catchup`) dejan exactamente las mismas transacciones
    que una sola, y ninguna de las dos respuestas es un error: la que pierde contra el índice único
    responde como "ya estaba generado" (I11).
  - CA-4: Con la Edge Function caída (o sin red al entrar), la pantalla pedida se muestra con la franja
    `app-catchup-error` y su texto exacto; "Reintentar" con la Edge Function de vuelta crea las
    transacciones pendientes y la franja desaparece.
  - CA-5: Con 50 suscripciones activas y 24 meses de atraso (día de cobro 1: 25 ocurrencias por
    suscripción, 1.250 en total), contra el stack local (`supabase start`) en Chrome de escritorio sin
    limitación de red, la puesta al día **termina bien** (sin franja) y crea las 1.250 transacciones en
    menos de 5 segundos desde que se resolvió la sesión.
  - CA-6: Una suscripción cuya categoría o cuenta se archivó después del alta sigue generando.
  - CA-7: Una suscripción `paused` o `cancelled` no genera nada (R3).
  - CA-8: Con `end_period` = mayo 2026, desde marzo 2026, la puesta al día del 2026-09-01 deja exactamente
    3 transacciones: marzo, abril y mayo 2026.
  - CA-9: Ninguna transacción generada tiene `subscription_period` posterior al período corriente,
    anterior a `generate_from_period` ni posterior a `end_period` (I17).
  - CA-10: La puesta al día corre una sola vez por carga de la app: navegar entre pestañas no la vuelve a
    llamar.
  - CA-11: Si la puesta al día no responde, el contenido se muestra con la franja `app-catchup-error` a los
    8 segundos (más/menos 1) desde que se resolvió la sesión.
  - CA-12: Si una suscripción no puede generar una ocurrencia (por ejemplo, USD 999.999.999.999,99 con un
    tipo de cambio que desborda el monto en pesos), las demás suscripciones y los demás períodos se
    generan igual, no aparece la franja de error y esa suscripción se muestra bloqueada (US-62).
  - CA-13: `start_period` igual al período corriente, con el día de cobro ya pasado: se genera exactamente
    la ocurrencia del período corriente. `start_period` en el futuro: no se genera nada.
  - CA-14: `end_period` igual a `start_period`, ambos en el pasado: se genera exactamente una ocurrencia.
- **Trazabilidad:** FR-16 (ajustado: sin anticipar meses futuros, `08-trazabilidad.md`) · R1, R2, R3, R7 ·
  I11, I14, I16, I17 · C4, C5 · ADR-017, ADR-030, ADR-031
- **Mock:** `entrega-2/mocks/suscripciones-puesta-al-dia.html`

#### US-54: El día de cobro que no existe se cobra el último día del mes · [#212](https://github.com/Joaconz/Biyu/issues/212) · Pendiente

- **Objetivo:** Como usuario, quiero que una suscripción cuyo día de cobro no existe en un mes se cobre
  igual el último día de ese mes, para que ningún mes se saltee.
- **Pantallas:** no agrega elementos interactivos.
  - **Nueva suscripción** y **Editar suscripción**: el texto fijo debajo de "Día de cobro" (US-52).
  - **Detalle**: "Próximo cobro" (`subscription-detail-next-charge`) muestra la fecha real según R4, por
    ejemplo "28/02/2027" para día 31. Si la suscripción está pausada, cancelada o ya pasó su mes de fin,
    muestra "—".
- **Criterios de aceptación:**
  - CA-1: Día de cobro 31, desde enero 2027: la ocurrencia de enero tiene `occurred_on` 2027-01-31, la de
    febrero 2027-02-28 y la de abril 2027-04-30.
  - CA-2: Día de cobro 29: febrero 2028 (bisiesto) da 2028-02-29 y febrero 2027 da 2027-02-28.
  - CA-3: Día de cobro 30: febrero 2028 da 2028-02-29 y febrero 2027 da 2027-02-28.
  - CA-4: Ningún recorte mueve la ocurrencia al mes siguiente: `subscription_period` siempre es el mes de
    `occurred_on`.
  - CA-5: La vista previa (US-75) y "Próximo cobro" muestran las mismas fechas que después tienen las
    transacciones generadas.
  - CA-6: Día de cobro 31: febrero 2028 (bisiesto) da 2028-02-29.
- **Trazabilidad:** FR-16 · R4 · I13 · ADR-017
- **Mock:** `entrega-2/mocks/suscripciones-detalle.html`

#### US-55: El mes corriente aparece recién el día del cobro · [#213](https://github.com/Joaconz/Biyu/issues/213) · Pendiente

- **Objetivo:** Como usuario, quiero que el gasto del mes corriente aparezca recién el día que se cobra,
  para que el mes en curso no muestre plata que todavía no se fue.
- **Pantallas:** no agrega elementos. En **Detalle**, "Próximo cobro" muestra la fecha del mes corriente
  mientras no llegue el día.
- **Criterios de aceptación:**
  - CA-1: Suscripción activa con día de cobro 28, sin ocurrencia del mes corriente: con la puesta al día
    del día 27 no se genera la del mes corriente.
  - CA-2: La misma suscripción, con la puesta al día del día 28, genera la del mes corriente.
  - CA-3: Con la puesta al día del día 29, también la genera (si no existía).
  - CA-4: Los períodos anteriores al corriente se generan siempre, sin importar el día de hoy.
  - CA-5: "Hoy" es el de Argentina: entre las 21:00 y las 23:59 del día 27 (hora de Argentina, ya día 28
    en UTC), la del día 28 no se genera.
  - CA-6: Día de cobro 31 en un mes de 30 días: se genera el día 30.
- **Nota para el diseño de casos:** el día de hoy no se puede elegir en una prueba manual. CA-1 a CA-3 se
  ejecutan eligiendo el día de cobro respecto del día de la ejecución (mañana, hoy y ayer).
- **Trazabilidad:** FR-16 (ajustado) · R5 · `02-behavior-spec.md` supuesto 9 · C1 · ADR-021
- **Mock:** `entrega-2/mocks/suscripciones-detalle.html`

#### US-56: Pausar una suscripción · [#214](https://github.com/Joaconz/Biyu/issues/214) · Pendiente

- **Objetivo:** Como usuario, quiero pausar una suscripción, para dejar de registrarla mientras no la
  estoy pagando.
- **Pantalla:** **Detalle** (`/subscriptions/:id`) de una suscripción activa.
  - Botón "Pausar" (`subscription-detail-pause`), solo si está activa.
  - Diálogo (`pause-subscription-dialog`): título "¿Pausar Netflix?" y el texto "Mientras esté pausada no
    se cargan gastos." Se agrega "Este mes tampoco se cobra si todavía no llegó el día 28, aunque la
    reanudes antes." solo si el período corriente está dentro de `[generate_from_period, end_period]`, no
    tiene transacción generada y hoy es anterior a su `occurred_on` (R1, R4, R5); el día del texto es el de
    `occurred_on` (con día de cobro 31 en un mes de 30, dice 30). Si la suscripción está bloqueada (US-62),
    se agrega además (`pause-subscription-dialog-blocked-warning`): "Julio 2026 no se cargó por falta de
    tipo de cambio. Si la pausás, ese mes no se va a cargar." (con la lista de meses bloqueados). Botones
    "Cancelar" (`pause-subscription-dialog-cancel`) y "Pausar" (`pause-subscription-dialog-confirm`;
    "Pausando…" mientras guarda).
  - Al confirmar: el estado pasa a "Pausada desde 06/10/2026", "Pausar" se reemplaza por "Reanudar" y se
    muestra el aviso (`subscription-toast`) "Suscripción pausada". Si antes de pausar se generaron gastos
    atrasados (`generated_before` > 0, ADR-030), el aviso es "Suscripción pausada. Antes se cargaron N
    gastos vencidos."
  - Error: el diálogo queda abierto con "No se pudo pausar: <motivo>" (`pause-subscription-dialog-error`)
    y los botones habilitados.
- **Criterios de aceptación:**
  - CA-1: Al confirmar, la suscripción queda con `status = 'paused'`, `paused_at` con la fecha y hora de la
    operación y `generate_from_period = max(generate_from_period anterior, mes siguiente al corriente)`
    (R8).
  - CA-2: Las transacciones ya generadas no cambian (ni monto, ni `deleted_at`).
  - CA-3: Día de cobro 28, sin ocurrencia del mes corriente: pausar el día 1 y reanudar el día 30 del
    mismo mes no genera ocurrencia del mes corriente.
  - CA-4: Una suscripción con meses vencidos sin generar los genera al pausar, antes de cambiar el estado.
  - CA-5: Mientras está pausada, ninguna puesta al día genera transacciones para ella (R3).
  - CA-6: "Cancelar" en el diálogo no cambia nada.
  - CA-7: Por API, `pause_subscription` sobre una pausada se rechaza con "La suscripción ya está pausada";
    sobre una cancelada, con "Una suscripción cancelada no se puede modificar" (las dos con 23514).
  - CA-8: Un `update` directo de `status` sobre `subscriptions` con la sesión del usuario se rechaza
    (ADR-030).
  - CA-9: Par de autorización (C7): con la sesión de otro usuario, `pause_subscription` responde P0002
    "Suscripción no encontrada" y la suscripción no cambia; sin sesión, responde 42501.
  - CA-10: Pausar una bloqueada muestra `pause-subscription-dialog-blocked-warning`; al confirmar, se
    pausa igual y los meses bloqueados no se generan después de reanudar.
  - CA-11: El texto sobre "este mes" aparece con día de cobro 28 y hoy 6, sin ocurrencia del mes; no
    aparece con día de cobro 3 y hoy 6 (ya generada).
- **Trazabilidad:** FR-17 · R3, R8 · I12, I15 · C6 · ADR-030
- **Mock:** `entrega-2/mocks/suscripciones-dialogos.html`

#### US-57: Reanudar sin cargar los meses pausados · [#215](https://github.com/Joaconz/Biyu/issues/215) · Pendiente

- **Objetivo:** Como usuario, quiero que reanudar una suscripción pausada no me cargue de golpe los meses
  que estuve sin pagarla, para que el mes de la reanudación no quede inflado.
- **Pantalla:** **Detalle** de una suscripción pausada.
  - Botón "Reanudar" (`subscription-detail-resume`), solo si está pausada.
  - Diálogo (`resume-subscription-dialog`): título "¿Reanudar Netflix?" y el texto "No se cargan los meses
    en los que estuvo pausada." seguido de una de estas dos oraciones, según R4, R5 y R8 con el piso nuevo:
    si el período corriente ya está vencido (hoy ≥ su `occurred_on`), "Al reanudar se carga octubre 2026
    (01/10/2026)."; si no, "Próximo cobro: 10/10/2026." Si el mes de fin ya pasó: "No hay más cobros:
    terminó en mayo 2026." Botones "Cancelar" (`resume-subscription-dialog-cancel`) y "Reanudar"
    (`resume-subscription-dialog-confirm`; "Reanudando…" mientras guarda).
  - Al confirmar: el estado pasa a "Activa", "Reanudar" se reemplaza por "Pausar" y se muestra el aviso
    (`subscription-toast`) "Suscripción reanudada" o, si la puesta al día posterior creó el gasto del mes
    (`generated_after` > 0, ADR-030), "Suscripción reanudada. Se cargó el gasto de octubre 2026."
  - Error: "No se pudo reanudar: <motivo>" (`resume-subscription-dialog-error`), con el diálogo abierto.
- **Criterios de aceptación:**
  - CA-1: Al confirmar, `status = 'active'`, `paused_at = null` y
    `generate_from_period = max(generate_from_period anterior, start_period, período corriente)` (R8).
  - CA-2: Día de cobro 1, pausada el 2026-08-05 con ocurrencias hasta julio 2026, reanudada el 2026-11-03:
    no existen ocurrencias de agosto, septiembre ni octubre 2026, y la primera nueva es de noviembre 2026.
  - CA-3: Con `start_period` = enero 2027, pausada el 2026-09-10 y reanudada el 2026-10-04: la operación no
    falla, `generate_from_period` queda en enero 2027 y no se genera nada.
  - CA-4: `generate_from_period` después de reanudar nunca es menor que antes (I12).
  - CA-5: El "Próximo cobro" del diálogo coincide con el `occurred_on` de la primera ocurrencia que se
    genera después. Si el diálogo dijo "Al reanudar se carga…", esa ocurrencia existe apenas termina la
    operación, sin recargar.
  - CA-6: Por API, `resume_subscription` sobre una activa se rechaza con "La suscripción no está pausada";
    sobre una cancelada, con "Una suscripción cancelada no se puede modificar" (las dos con 23514).
  - CA-7: Par de autorización (C7): con la sesión de otro usuario, `resume_subscription` responde P0002
    "Suscripción no encontrada" y la suscripción no cambia; sin sesión, responde 42501.
- **Trazabilidad:** FR-17 · R8 · I12, I15 · ADR-030
- **Mock:** `entrega-2/mocks/suscripciones-dialogos.html`

#### US-58: Cancelar sin perder el historial · [#216](https://github.com/Joaconz/Biyu/issues/216) · Pendiente

- **Objetivo:** Como usuario, quiero cancelar una suscripción sin perder el historial de lo que ya pagué,
  para que los meses cerrados no cambien.
- **Pantalla:** **Detalle** de una suscripción activa o pausada.
  - Botón "Cancelar suscripción" (`subscription-detail-cancel`), estilo destructivo (bordó, ADR-023).
  - Diálogo (`cancel-subscription-dialog`): título "¿Cancelar Netflix?" y el texto "No se van a cargar más
    gastos. Los N gastos ya cargados se mantienen. No se puede deshacer: para volver a registrarla, creá
    una suscripción nueva." Con N = 1, la segunda oración es "El gasto ya cargado se mantiene."; con N = 0,
    "Todavía no se cargó ningún gasto." Si está bloqueada, se agrega
    (`cancel-subscription-dialog-blocked-warning`): "Julio 2026 no se cargó por falta de tipo de cambio. Si
    la cancelás, ese mes no se va a cargar." Botones "Volver" (`cancel-subscription-dialog-cancel`) y "Cancelar
    suscripción" (`cancel-subscription-dialog-confirm`, destructivo; "Cancelando…" mientras guarda). El
    botón de cerrar dice "Volver" y no "Cancelar" para no confundirse con la acción.
  - Al confirmar: el estado pasa a "Cancelada el 06/10/2026", desaparecen "Editar", "Pausar"/"Reanudar" y
    "Cancelar suscripción", y se muestra el aviso (`subscription-toast`) "Suscripción cancelada" o, si antes se generaron
    gastos atrasados, "Suscripción cancelada. Antes se cargaron N gastos vencidos." En `/subscriptions`
    pasa al grupo "Canceladas".
  - Error: "No se pudo cancelar: <motivo>" (`cancel-subscription-dialog-error`), con el diálogo abierto.
- **Criterios de aceptación:**
  - CA-1: Al confirmar, `status = 'cancelled'` y `cancelled_at` con la fecha y hora de la operación (I15).
  - CA-2: Con ocurrencias de mayo a agosto 2026, cancelada el 2026-09-02: las 4 transacciones siguen
    existiendo, sin `deleted_at`, y siguen sumando en el Resumen de sus meses.
  - CA-3: Ninguna puesta al día posterior genera transacciones para ella.
  - CA-4: Los meses vencidos sin generar se generan antes de cancelar (ADR-030).
  - CA-5: N en el texto del diálogo es la cantidad de transacciones de la suscripción sin `deleted_at` más
    las ocurrencias vencidas que la cancelación va a generar antes (las no bloqueadas), es decir, la
    cantidad que queda después de confirmar.
  - CA-6: Una cancelada no vuelve a `active` ni a `paused` por ninguna de estas vías, que se rechazan:
    `pause_subscription`, `resume_subscription`, `update_subscription` (23514, "Una suscripción cancelada
    no se puede modificar") y un `update` directo de `status` (42501). El Detalle de una cancelada no
    muestra "Pausar", "Reanudar", "Editar" ni "Cancelar suscripción".
  - CA-7: Después de cancelar, se puede dar de alta otra suscripción con el mismo nombre.
  - CA-8: Por API, `cancel_subscription` sobre una cancelada se rechaza con "Una suscripción cancelada no
    se puede modificar" (23514).
  - CA-9: Par de autorización (C7): con la sesión de otro usuario, `cancel_subscription` responde P0002
    "Suscripción no encontrada" y la suscripción no cambia; sin sesión, responde 42501.
  - CA-10: Cancelar una bloqueada muestra `cancel-subscription-dialog-blocked-warning` y se cancela igual.
- **Trazabilidad:** FR-17 · I15 · C5, C10 · ADR-030
- **Mock:** `entrega-2/mocks/suscripciones-dialogos.html`

#### US-59: Editar el monto sin cambiar los meses registrados · [#217](https://github.com/Joaconz/Biyu/issues/217) · Pendiente

- **Objetivo:** Como usuario, quiero cambiar el monto de una suscripción cuando aumenta, sin que se
  modifiquen los meses ya registrados.
- **Pantalla nueva: Editar suscripción** (`/subscriptions/:id/edit`), desde "Editar"
  (`subscription-detail-edit`) en el Detalle de una activa o pausada.
  - Encabezado "Editar suscripción" con el botón atrás (`subscription-form-back`) → `/subscriptions/:id`.
  - Aviso fijo arriba del formulario: "Los cambios aplican desde el próximo cobro. Los gastos ya cargados
    no cambian."
  - Mismos campos, `data-testid`, rangos y mensajes que Nueva suscripción (US-52), con estas diferencias
    (ADR-032):

  | Campo | En la edición |
  |---|---|
  | "Nombre", "Monto", "Día de cobro", "Descripción (opcional)" | Editables, precargados |
  | "Categoría", "Medio de pago" | Editables, precargados. Si la actual está archivada, aparece seleccionada con "(archivada)" y se puede guardar sin cambiarla; una vez cambiada, no se puede volver a elegir |
  | "Mes de fin (opcional)" | Editable, precargado. Solo se valida si se cambia: un valor nuevo tiene que ser el mayor entre el mes de inicio y el período corriente, o posterior. Fuera de rango: "El mes de fin no puede ser anterior a octubre 2026". Si la suscripción está terminada, debajo: "Terminó en mayo 2026. Si la extendés, los meses entre mayo 2026 y octubre 2026 no se cargan." |
  | "Moneda", "Mes de inicio" | Solo lectura: texto, no control (`subscription-form-currency-readonly`, `subscription-form-start-period-readonly`) |

  - Sin vista previa del calendario. En su lugar, "Próximo cobro: 10/10/2026 por $7.000,00"
    (`subscription-form-next-charge`), recalculado con los valores del formulario y el piso que quedaría
    después de guardar. Si con esos valores el período corriente queda vencido sin generar: "Al guardar se
    carga octubre 2026 (03/10/2026) por $7.000,00". Si está pausada: "Pausada: no hay próximo cobro". Si
    está terminada y no se extiende: "No hay más cobros: terminó en mayo 2026."
  - Botones: "Cancelar" (`subscription-form-cancel`) → Detalle sin guardar, y "Guardar cambios"
    (`subscription-form-submit`; "Guardando…" mientras guarda).
  - Al guardar: vuelve al Detalle con el aviso (`subscription-toast`) "Cambios guardados". Si antes se
    generaron gastos atrasados (`generated_before` > 0, ADR-030), se agrega "Antes se cargaron N gastos
    vencidos con los datos anteriores."; si después se generó el del mes (`generated_after` > 0), se agrega
    "Se cargó el gasto de octubre 2026 con los datos nuevos."
  - Estados: cargando (`subscription-form-loading`), error al cargar (`subscription-form-load-error`,
    `subscription-form-load-retry`), error al guardar (`subscription-form-error`), como en US-52. Si la
    suscripción está cancelada: "Esta suscripción está cancelada y no se puede editar." con el enlace
    "Volver" (`subscription-form-cancelled-back`) → Detalle. Si no existe o es de otro usuario: "No
    encontramos esta suscripción." (`subscription-form-not-found`).
- **Criterios de aceptación:**
  - CA-1: $5.000,00 ARS con ocurrencias de mayo a agosto 2026; cambiar el monto a $7.000,00: las 4
    transacciones siguen siendo de $5.000,00 y la próxima ocurrencia generada es de $7.000,00 (R7).
  - CA-2: Si al editar había meses vencidos sin generar, se generan con el monto **anterior** antes de
    aplicar el cambio (ADR-030). Se verifica por API, llamando a `update_subscription` sin correr antes la
    puesta al día.
  - CA-3: Cambiar el día de cobro, la categoría o el medio de pago no modifica ninguna transacción
    generada; la próxima ocurrencia usa el valor nuevo.
  - CA-4: Cambiar el nombre no cambia la descripción de las transacciones ya generadas.
  - CA-5: Moneda y mes de inicio no se pueden cambiar desde la UI; por API, un `update_subscription` que
    los incluya se rechaza con "La moneda y el mes de inicio no se pueden cambiar".
  - CA-6: El mes de fin anterior al mínimo se rechaza con su mensaje, en la UI y por API.
  - CA-7: Las validaciones de US-52 CA-3 a CA-7 valen también al editar (el nombre se compara contra las
    demás suscripciones, no contra sí misma).
  - CA-8: Editar una cancelada se rechaza en la UI (mensaje de arriba) y por API ("Una suscripción
    cancelada no se puede modificar").
  - CA-9: Un `update` directo de `amount` sobre `subscriptions` con la sesión del usuario se rechaza con
    42501 (ADR-030).
  - CA-10: Con la categoría actual archivada, cambiar solo el monto se guarda; elegir por API una categoría
    archivada distinta de la actual se rechaza con "La categoría no está disponible".
  - CA-11: Una terminada (fin mayo 2026, hoy octubre 2026) se puede editar sin tocar el mes de fin (por
    ejemplo, la descripción). Extenderla a "Sin fin" deja `generate_from_period` en octubre 2026 y no
    genera junio a septiembre 2026.
  - CA-12: Cambiar el día de cobro de 28 a 3 con hoy 6 y el mes corriente sin generar crea al guardar la
    ocurrencia del mes corriente con fecha 3 y los datos nuevos, y el aviso lo informa.
  - CA-13: Par de autorización (C7): con la sesión de otro usuario, `update_subscription` responde P0002
    "Suscripción no encontrada" y nada cambia; sin sesión, responde 42501.
- **Trazabilidad:** FR-17 · R7 · C5, C6 · ADR-030, ADR-032
- **Mock:** `entrega-2/mocks/suscripciones-edicion.html`

#### US-60: Borrar un mes puntual sin que vuelva · [#218](https://github.com/Joaconz/Biyu/issues/218) · Pendiente

- **Objetivo:** Como usuario, quiero poder borrar una ocurrencia puntual (un mes que no me cobraron) sin
  que el sistema me la vuelva a crear.
- **Pantallas:**
  - **Movimientos** (`/transactions`): el mismo botón de papelera y el mismo diálogo de US-65
    (`delete-transaction-dialog`). Si la transacción vino de una suscripción, el diálogo suma una línea
    (`delete-transaction-subscription-note`): "Este gasto lo cargó la suscripción Netflix. Si lo eliminás,
    no se vuelve a cargar para octubre 2026."
  - **Detalle**, "Gastos cargados" (US-61): la fila del mes borrado sigue apareciendo, con la marca
    "Eliminado" (`subscription-detail-occurrence-deleted`).
- **Criterios de aceptación:**
  - CA-1: Con la ocurrencia de junio 2026 generada, eliminarla (borrado lógico, `deleted_at`) y volver a
    correr la puesta al día no crea ninguna transacción para junio 2026 (R2).
  - CA-2: La ocurrencia eliminada deja de sumar en el Resumen de junio 2026 (I10).
  - CA-3: El diálogo de borrado muestra `delete-transaction-subscription-note` con el nombre de la
    suscripción y el mes, solo si la transacción tiene `subscription_id`.
  - CA-4: Restaurarla desde el filtro "Eliminados" de Movimientos (`transactions-item-restore`, DEF-007)
    vuelve a sumarla, el Detalle le saca la marca "Eliminado", y no aparece una segunda transacción para
    ese mes.
  - CA-5: En el Detalle, junio 2026 figura con la marca "Eliminado".
- **Trazabilidad:** FR-08 · R2 · I10, I11 · C10 · ADR-017
- **Mock:** `entrega-2/mocks/suscripciones-movimientos.html`

#### US-61: Ver qué movimientos vienen de una suscripción · [#219](https://github.com/Joaconz/Biyu/issues/219) · Pendiente

- **Objetivo:** Como usuario, quiero ver qué transacciones vinieron de una suscripción y de cuál, para
  reconocerlas en el listado.
- **Pantallas:**
  - **Movimientos** (`/transactions`) y **Resumen**, "Últimos movimientos" (`/dashboard`): en cada
    transacción con `subscription_id`, una marca con el ícono de repetición y el nombre **actual** de la
    suscripción, "Netflix". Es un enlace a `/subscriptions/:id`: `transactions-item-subscription` en
    Movimientos y `dashboard-transaction-item-subscription` en el Resumen.
  - **Detalle**, sección "Gastos cargados" (`subscription-detail-occurrences`): una fila por transacción
    de la suscripción, borradas incluidas, del período más reciente al más viejo
    (`subscription-detail-occurrence`, con `data-period` = `YYYY-MM` y `data-deleted` = `true` | `false`):
    mes, fecha de cobro y monto con su moneda. Vacío: "Todavía no se cargó ningún gasto. El primero se
    carga el 10/10/2026." (`subscription-detail-occurrences-empty`); sin próximo cobro: "Todavía no se
    cargó ningún gasto."
- **Criterios de aceptación:**
  - CA-1: Toda transacción con `subscription_id` muestra la marca en Movimientos y en el Resumen; ninguna
    transacción cargada a mano la muestra.
  - CA-2: Tocar la marca lleva al Detalle de esa suscripción.
  - CA-3: Si la suscripción se renombró, la marca muestra el nombre nuevo.
  - CA-4: La marca aparece también en las suscripciones pausadas y canceladas.
  - CA-5: "Gastos cargados" lista exactamente las transacciones con ese `subscription_id`, ordenadas por
    período descendente.
- **Trazabilidad:** FR-16 · I11, I14 · ADR-017
- **Mock:** `entrega-2/mocks/suscripciones-movimientos.html`, `suscripciones-detalle.html`

#### US-62: Aviso de suscripción en USD sin tipo de cambio · [#220](https://github.com/Joaconz/Biyu/issues/220) · Pendiente

- **Objetivo:** Como usuario, quiero que una suscripción en USD sin tipo de cambio cargado me avise en vez
  de inventar un valor, para no ensuciar los totales.
- **Definición:** una suscripción está **bloqueada** si está activa y tiene al menos un período vencido
  según R1, R4 y R5, dentro de `[generate_from_period, end_period]`, sin transacción generada y que no se
  puede generar: es USD y falta el `fx_rates` del usuario para ese período (R6), o su monto en pesos queda
  fuera de rango (ADR-030, ADR-031). No se guarda: se calcula al leer.
- **Pantallas:**
  - **Suscripciones**: en la fila, la marca "Falta tipo de cambio" (`subscriptions-item-blocked`).
  - **Detalle**: arriba de los datos, el aviso (`subscription-detail-blocked`, `role="alert"`): "Falta el
    tipo de cambio de julio 2026. Ese mes no se cargó; se carga en cuanto lo cargues." Con más de un mes:
    "Falta el tipo de cambio de julio 2026 y agosto 2026. Esos meses no se cargaron; se cargan en cuanto
    los cargues." (con tres o más, la lista con comas y "y"). Botón "Cargar tipo de cambio"
    (`subscription-detail-blocked-fx`) → `/settings?period=2026-07` (el mes más viejo que falta).
  - Si el motivo es el monto en pesos fuera de rango, el aviso dice "El gasto de julio 2026 no se pudo
    cargar porque en pesos supera $999.999.999.999,99 (o no llega a $0,01). Revisá el monto o el tipo de
    cambio de ese mes." (`subscription-detail-blocked`, sin el botón), y la marca de la lista dice "No se
    pudo cargar".
- **Criterios de aceptación:**
  - CA-1: USD 10,00 desde junio 2026, con tipo de cambio de junio y sin el de julio; con la puesta al día
    del 2026-07-20 se genera junio con el `fx_rate` de junio congelado, no se genera julio, y la
    suscripción se muestra bloqueada.
  - CA-2: Ninguna transacción de suscripción en USD se genera con `fx_rate` null, 0 ni de otro período.
  - CA-3: Después de guardar el tipo de cambio de julio en Ajustes, sin recargar, la puesta al día corre
    sola (ADR-031), genera julio con ese tipo de cambio, muestra "Se cargó 1 gasto de suscripciones", y al
    volver a Suscripciones la marca y el aviso ya no están.
  - CA-4: Una suscripción en ARS nunca se muestra bloqueada.
  - CA-5: Una pausada o cancelada no se muestra bloqueada.
  - CA-6: Una USD sin tipo de cambio del mes corriente **antes** del día de cobro (R5) no se muestra
    bloqueada.
  - CA-7: El botón lleva a Ajustes con el mes más viejo que falta en `?period`.
  - CA-8: Con tres meses bloqueados, el aviso los lista con comas y "y".
- **Trazabilidad:** FR-15 · R6 · I5 · C5 · ADR-002, ADR-031
- **Mock:** `entrega-2/mocks/suscripciones-lista.html`, `suscripciones-detalle.html`

#### US-63: Total mensual comprometido en suscripciones · [#221](https://github.com/Joaconz/Biyu/issues/221) · Pendiente

- **Objetivo:** Como usuario, quiero ver el total mensual comprometido en suscripciones activas, para saber
  cuánto del mes ya está tomado antes de gastar nada.
- **Pantalla:** **Suscripciones** (`/subscriptions`), primera tarjeta (`subscriptions-committed`), sin
  elementos interactivos:
  - Rótulo "Comprometido en octubre 2026" (el período corriente).
  - Total en pesos (`subscriptions-committed-total`), por ejemplo "$27.500,00".
  - "4 suscripciones activas este mes" (`subscriptions-committed-count`; con 1: "1 suscripción activa este
    mes").
  - Si hay suscripciones en USD que entran y el período corriente no tiene tipo de cambio: "+ USD 10,00 sin
    tipo de cambio de octubre 2026" (`subscriptions-committed-usd-pending`).
  - Sin ninguna que entre (pero con alguna suscripción cargada): "$0,00" y "No tenés suscripciones
    activas este mes". Si solo entran USD sin tipo de cambio: "$0,00", el conteo y la línea "+ USD…".
  - Con ninguna suscripción cargada, la tarjeta no se muestra: se ve solo el estado vacío de US-52.
  - El conteo incluye todas las que entran, también las USD sin tipo de cambio; "+ USD" es la suma de
    todas esas, sin convertir.
- **Qué suma** (ADR-033): las suscripciones con `status = 'active'`, `generate_from_period ≤ período
  corriente` y `end_period` null o `≥ período corriente`, con el **monto actual**, ya cobradas este mes o
  no. Las USD se convierten con el tipo de cambio del período corriente, redondeando cada una a 2
  decimales (half-up) antes de sumar.
- **Criterios de aceptación:**
  - CA-1: Con $5.000,00 ARS y $2.500,00 ARS activas, el total es $7.500,00.
  - CA-2: Una pausada, una cancelada, una que empieza el mes que viene y una cuyo mes de fin ya pasó no
    suman.
  - CA-3: Una USD 10,00 con tipo de cambio de octubre 2026 de 1.250,00 suma $12.500,00.
  - CA-4: Sin tipo de cambio de octubre 2026, la USD 10,00 no suma al total en pesos y aparece en
    `subscriptions-committed-usd-pending`.
  - CA-5: Cambiar el monto de una suscripción (US-59) cambia el total al volver a la lista, aunque las
    transacciones del mes sigan con el monto anterior.
  - CA-6: El Resumen (`/dashboard`) no cambia por esta historia: ningún KPI suma suscripciones que no
    tengan transacción.
  - CA-7: Con una sola suscripción, USD 10,00, y sin tipo de cambio de octubre 2026: "$0,00", "1
    suscripción activa este mes" y "+ USD 10,00 sin tipo de cambio de octubre 2026".
  - CA-8: Una terminada (fin anterior al período corriente) no suma; una con fin igual al período
    corriente sí.
- **Trazabilidad:** FR-16 · `02-behavior-spec.md` supuesto 9 · C1, C2 · ADR-013, ADR-033
- **Mock:** `entrega-2/mocks/suscripciones-lista.html`

#### US-75: Vista previa del calendario antes de dar de alta · [#222](https://github.com/Joaconz/Biyu/issues/222) · Pendiente

- **Objetivo:** Como usuario, quiero ver qué meses va a cargar una suscripción y desde cuándo antes de
  darla de alta, para no llevarme la sorpresa de varios gastos cargados de golpe.
- **Pantalla:** **Nueva suscripción** (`/subscriptions/new`), sección "Calendario"
  (`subscription-form-preview`), entre el formulario y los botones. Se recalcula al cambiar cualquier
  campo, sin tocar la base: usa la misma función de dominio que la puesta al día
  (`computeDueOccurrences`, `src/domain/subscriptions.ts`) con el hoy argentino del cliente
  (`todayInArgentina()`, ADR-031) y los tipos de cambio del usuario.
  - Sin monto válido, día de cobro válido o mes de inicio válido: "Completá el monto, el día de cobro y el
    mes de inicio para ver el calendario." (`subscription-form-preview-empty`).
  - Resumen (`subscription-form-preview-summary`): "Al guardar se cargan 2 gastos de $5.000,00 (total
    $10.000,00)." Con 1: "Al guardar se carga 1 gasto de $5.000,00." Con 0: "Al guardar no se carga
    ningún gasto." En USD, el monto va como "USD 10,00" y el total no se convierte.
  - "Se cargan al guardar" (`subscription-form-preview-due`): una fila por período vencido
    (`subscription-form-preview-due-item`, con `data-period`), con el mes y la fecha de cobro: "agosto
    2026 · 10/08/2026". En USD, si ese período no tiene tipo de cambio, la fila dice además "Sin tipo de
    cambio: se carga cuando lo cargues" y lleva `data-blocked="true"`; esas filas no cuentan en el
    resumen.
  - "Próximos cobros" (`subscription-form-preview-upcoming`): los próximos 3 cobros que todavía no
    vencieron (`subscription-form-preview-upcoming-item`, con `data-period`), o menos si el mes de fin
    llega antes. Si no hay ninguno: "No hay más cobros: termina en mayo 2026."
- **Criterios de aceptación:**
  - CA-1: Hoy 2026-10-06, $5.000,00 ARS, día 10, desde agosto 2026, sin fin: "Se cargan al guardar" muestra
    agosto y septiembre 2026 (10/08/2026 y 10/09/2026); "Próximos cobros", octubre, noviembre y diciembre
    2026; el resumen dice "Al guardar se cargan 2 gastos de $5.000,00 (total $10.000,00)."
  - CA-2: Igual que CA-1 pero con día 6: octubre 2026 pasa a "Se cargan al guardar" (R5, hoy = día de
    cobro).
  - CA-3: Mes de inicio enero 2027: "Al guardar no se carga ningún gasto." y "Próximos cobros" empieza en
    enero 2027.
  - CA-4: Desde marzo 2026 hasta mayo 2026: "Se cargan al guardar" muestra exactamente marzo, abril y mayo
    2026, y "Próximos cobros" dice "No hay más cobros: termina en mayo 2026."
  - CA-5: Día 31: las fechas siguen R4 (30/09/2026, 28/02/2027).
  - CA-6: USD sin tipo de cambio de septiembre 2026: la fila de septiembre lleva `data-blocked="true"` y su
    texto, y no cuenta en el resumen.
  - CA-7: Al guardar el mismo día, las transacciones creadas coinciden período por período y fecha por
    fecha con las filas de "Se cargan al guardar" que no están bloqueadas (US-52 CA-2).
  - CA-8: Con un campo inválido se muestra `subscription-form-preview-empty` y ninguna lista.
  - CA-9: A las 22:00 de Argentina del día anterior al de cobro (ya el día de cobro en UTC), el período
    corriente aparece en "Próximos cobros", no en "Se cargan al guardar", aunque el dispositivo esté en
    UTC.
- **Trazabilidad:** FR-16 · roadmap §V2 "Cambios de interfaz" · R1, R4, R5, R6 · C1 · ADR-017, ADR-031, ADR-032
- **Mock:** `entrega-2/mocks/suscripciones-alta.html`

---

## Supuestos y pendientes

1. **Navegación.** El destino "Suscripciones" de la barra inferior es parte de #172 (ADR-023). Si no
   llega, `/subscriptions` se alcanza escribiendo la URL y los casos de navegación quedan `BLOCKED`.
2. **No hay eliminar suscripción** en V2: solo cancelar (irreversible). Eliminar una **cuenta** borra
   sus suscripciones (ADR-026).
3. **Implementación necesaria** (no es parte de estas historias, pero sus criterios la suponen):
   - Migración: las RPC de ADR-030 y sus funciones internas (`catch_up_subscriptions`,
     `insert_transaction_with_entries`); revocar los `insert`, `update` y `delete` que
     `supabase/migrations/20260925000100_table_grants.sql` concede hoy a `authenticated` sobre
     `subscriptions`; cambiar el índice `subscriptions_user_name_not_cancelled_uq` de `(user_id, name)` a
     `(user_id, lower(name))` y agregar los `CHECK` de largo de ADR-032. Pasa por `rls-migration-reviewer`
     y `supabase-postgres-best-practices`.
   - Código que todavía no existe: `todayInArgentina()` en `src/lib/clock.ts` (hoy solo hay `today()`), y
     `src/domain/subscriptions.ts` con `computeDueOccurrences` y `committedMonthlyTotal`.
4. **Docs a actualizar al implementar** (no se tocan en esta entrega para no pisar a las otras sesiones):
   - `03-architecture-spec.md`: C7 (§ línea 100) pasa a listar `subscriptions` entre las tablas de solo
     lectura; la línea 91 extiende el patrón RPC a las operaciones de suscripción (ADR-030); §4 (línea 217)
     cambia "antes de renderizar el dashboard" por el comportamiento de ADR-031.
   - `04-data-model.md`: RLS de `subscriptions` de solo lectura, índice `lower(name)`, `CHECK` de largo, y
     la nota de `generate_from_period`, que hoy dice que solo reanudar lo mueve (pausar también, R8).
   - `06-suscripciones.md`: el modelo de generación (ADR-030) y el párrafo de R7, que hoy cierra el hueco
     con una regla de orden de la UI y pasa a cerrarse en la RPC (ADR-030); los casos de borde de ADR-032;
     y US-75 en la lista de historias.
   - `08-trazabilidad.md`: US-75 en las líneas 10, 183 y 204, y el mapeo FR → US, que hoy da FR-16 solo a
     US-53 y US-55 y FR-17 solo a US-56 a US-58. Mapeo completo: FR-15 → US-52, US-62 · FR-16 → US-53,
     US-54, US-55, US-61, US-63, US-75 · FR-17 → US-56, US-57, US-58, US-59 · FR-08 → US-60.
     `02-behavior-spec.md` línea 7 también dice "historias 52 a 63".
   - `01-domain-glossary.md`: "suscripción terminada" (`end_period` anterior al período corriente; no es
     un estado, ADR-032) y "suscripción bloqueada" (derivada, ADR-031).
5. US-75 no tiene FR propio en `pre-entrega.md`: sale del roadmap §V2 y se traza a FR-16 por ser la
   proyección de qué meses se cargan.
6. **Edición de transacciones** es V3 (roadmap). Cuando llegue, una transacción con `subscription_id` no
   puede cambiar su fecha a otro mes ni su moneda, porque rompería US-54 CA-4 y R6; queda anotado para
   esa historia.
