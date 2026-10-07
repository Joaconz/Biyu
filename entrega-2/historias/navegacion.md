# Historias de V2 · Navegación e interfaz

**Épica:** Interfaz y no funcionales de V2 ([#20](https://github.com/Joaconz/Biyu/issues/20)) ·
**Milestone:** V2 · **Fuente:** `docs/roadmap.md` §V2 "Cambios de interfaz", ADR-023, ADR-024,
ADR-034 · Versión del documento: 2026-10-06

Mismo formato que `entrega-1/01-historias-de-usuario.md`: cada criterio se numera `CA-k` para que
los casos de prueba citen `US-nn · CA-k`. La UI de referencia es `main` al 2026-10-06 (`a255aa0`).
Los mocks están en `entrega-2/mocks/`.

| Historia | Qué permite | Mock |
|---|---|---|
| US-69 | Ir a Registrar, Resumen, Deudas y Suscripciones desde la barra de abajo; Movimientos pasa a colgar del Resumen | `mocks/navegacion-barra.html` |
| US-70 | Saber si el gasto se guardó y, si falló, reintentar sin volver a cargarlo y sin duplicarlo | `mocks/registrar-guardado.html` |
| US-71 | No se escribe: la cubre US-65 de V1 (ver al final) | — |

---

## US-69: Barra de navegación con Deudas y Suscripciones · [#172](https://github.com/Joaconz/Biyu/issues/172)

- **Objetivo:** Como usuario, quiero llegar a Registrar, Resumen, Deudas y Suscripciones con un solo
  toque desde la barra de abajo, para usar las secciones nuevas de V2 sin buscarlas.
- **Depende de:** las pantallas de listado de Deudas (historias US-34 a US-41) y de Suscripciones
  (US-52 a US-63). Esta historia define cómo se llega a ellas, no su contenido. **Se implementa
  después de que existan `/debts` y `/subscriptions`:** antes, sus ítems llevarían a la página de
  ruta inexistente y CA-2 y CA-9 no se podrían ejecutar.

### Ruta y estructura

No agrega una pantalla: cambia la navegación global (`AppNav`, ADR-023), que se ve en todas las
rutas privadas (`/register`, `/dashboard`, `/transactions`, `/debts`, `/subscriptions`, `/settings`).
No se muestra en `/login`, `/signup`, `/setup` ni en la página de ruta inexistente, igual que en V1.

| Orden | Ítem (texto exacto) | Ícono | Destino |
|---|---|---|---|
| 1 | Registrar | círculo con + | `/register` |
| 2 | Resumen | barras | `/dashboard` |
| 3 | Deudas | manos con moneda | `/debts` |
| 4 | Suscripciones | flechas en círculo | `/subscriptions` |

- **Ajustes** no entra en la barra: sigue en el engranaje del encabezado en el celular y al pie de la
  barra lateral en la computadora (US-64).
- **Movimientos** (`/transactions`) sale de la barra y pasa a colgar del Resumen:
  - En el Resumen, el enlace "Ver todos" de "Últimos movimientos" (ya existe) lleva a
    `/transactions?period=<mes del Resumen>`.
  - En el Resumen de un mes sin movimientos, debajo de "Registrar un gasto", se suma el enlace
    "Ver movimientos", que lleva a `/transactions?period=<mes>`. Sin él, en un mes vacío no habría
    forma de llegar a "Eliminados" para restaurar una transacción (FR-08).
  - En Movimientos, a la izquierda del título, se suma el enlace "‹ Resumen", que lleva a
    `/dashboard?period=<mes de Movimientos>`.
- **Ítem activo:** el de la sección en la que se está, también en sus subrutas y con cualquier
  parámetro (`/debts/<algo>` marca Deudas; `/transactions?view=deleted` marca Resumen). Movimientos
  marca **Resumen**. En `/settings`
  no se marca ninguno de los cuatro (se marca el engranaje en el celular y "Ajustes" en la
  computadora). El activo se ve en verde con el rótulo en negrita y un punto dorado arriba del ícono
  (celular) o un filete dorado a la izquierda (computadora), y lleva `aria-current="page"`.
- **Mes en la URL (C11):** se mantiene la regla de V1. Entre Resumen y Movimientos viaja `?period`.
  Deudas y Suscripciones no son vistas por mes: se abren sin `?period`.
- **Tocar el ítem de la ruta en la que ya se está** (la ruta exacta del ítem, sin contar los
  parámetros) no hace nada: no recarga ni vuelve al paso 1 ni cambia el `?period`. Desde una subruta o
  desde Movimientos, el ítem sí navega (CA-10). En Registrar eso protege un borrador a medio cargar. Volver al paso 1 con un toque lo vaciaría, y ADR-024 ya
  advierte que salir del registro pierde el borrador.
- **Texto del diálogo de borrado (US-65):** "Si te equivocaste, la podés restaurar desde Movimientos,
  en Eliminados." pasa a "Si te equivocaste, la podés restaurar desde Resumen → Ver todos, en
  Eliminados.", porque Movimientos ya no está en la barra.

### Botones y enlaces

| Elemento | Texto | Qué hace |
|---|---|---|
| Ítem de la barra | "Registrar" / "Resumen" / "Deudas" / "Suscripciones" | Navega al destino de la tabla |
| Engranaje (celular) / ítem al pie (computadora) | ícono sin texto con `aria-label="Ajustes"` / "Ajustes" | Navega a `/settings` (sin cambios) |
| Enlace en "Últimos movimientos" | "Ver todos" | Navega a `/transactions?period=<mes>` (sin cambios) |
| Enlace en el estado vacío del Resumen | "Ver movimientos" | Navega a `/transactions?period=<mes>` |
| Enlace en Movimientos | "‹ Resumen" | Navega a `/dashboard?period=<mes>` |

### Estados

- **Vacío:** la barra no tiene estado vacío; siempre muestra los cuatro ítems. Los estados vacíos de
  Deudas y Suscripciones los definen sus historias.
- **Cargando:** mientras la app verifica la configuración inicial se ve "Cargando…" sin barra, igual
  que en V1 (`app-layout-loading`). Una vez visible, la barra no depende de datos y no tiene estado
  de carga.
- **Error:** la barra no consulta el servidor, así que no tiene error propio. Si una pantalla de
  destino falla, el error es de esa pantalla.

### Celular y computadora

- **Celular (hasta 1023 px de ancho):** barra fija abajo, material translúcido con filete
  superior (ADR-023), cuatro columnas iguales con ícono arriba y rótulo abajo. Respeta el área segura
  inferior del iPhone. Se esconde con el teclado abierto, como en V1. Ajustes queda en el engranaje
  del encabezado.
- **Computadora (1024 px o más):** la misma `<nav>` se muestra como barra lateral de 240 px a la
  izquierda: wordmark arriba, los cuatro ítems en el mismo orden con ícono y rótulo en una fila, y
  "Ajustes" al pie. No hay encabezado con engranaje.
- Es un solo `<nav>` en el DOM para los dos tamaños (ADR-023): ningún `data-testid` se duplica.

### `data-testid`

Se mantiene la forma `<pantalla>-nav-<destino>` de V1 (`src/lib/navigation.ts`). Pantallas:
`register`, `dashboard`, `transactions`, `debts`, `subscriptions`, `settings`.

| Elemento | `data-testid` |
|---|---|
| Ítem Registrar | `<pantalla>-nav-register` (p. ej. `debts-nav-register`) |
| Ítem Resumen | `<pantalla>-nav-dashboard` |
| Ítem Deudas | `<pantalla>-nav-debts` |
| Ítem Suscripciones | `<pantalla>-nav-subscriptions` |
| Engranaje / "Ajustes" | `<pantalla>-nav-settings` (sin cambios) |
| "Ver todos" | `dashboard-transactions-view-all` (sin cambios) |
| "Ver movimientos" (Resumen vacío) | `dashboard-empty-view-transactions` |
| "‹ Resumen" | `transactions-back` |

Los `<pantalla>-nav-transactions` de V1 dejan de existir.

### Criterios de aceptación

- CA-1: Con sesión iniciada, en un celular de 375 px de ancho, la barra de abajo muestra exactamente
  cuatro ítems, en este orden y con estos textos: "Registrar", "Resumen", "Deudas", "Suscripciones".
  No muestra "Movimientos".
- CA-2: Tocar cada ítem abre su ruta: "Registrar" → `/register`, "Resumen" → `/dashboard`,
  "Deudas" → `/debts`, "Suscripciones" → `/subscriptions`.
- CA-3: En cada una de las seis rutas privadas, el ítem marcado como activo (con
  `aria-current="page"`) es: `/register` → Registrar; `/dashboard`, `/transactions` y
  `/transactions?view=deleted` → Resumen; `/debts` → Deudas; `/subscriptions` → Suscripciones;
  `/settings` → ninguno de los cuatro.
- CA-4: En un celular de 320 px de ancho, los cuatro rótulos se leen completos (sin "…" ni corte), y
  cada ítem tiene un área táctil de al menos 44 × 44 px (NFR-08).
- CA-5: Con la ventana en 1024 px y en 1280 px de ancho, la navegación es una barra lateral con los
  mismos cuatro ítems en el mismo orden y "Ajustes" al pie, sin barra abajo. En 1023 px es la barra
  de abajo con el engranaje en el encabezado.
- CA-6: Con la ventana en 375, 1023, 1024 y 1280 px, en cada ruta privada, cada `data-testid` de la
  tabla aparece como máximo una vez en el DOM, y los cinco `<pantalla>-nav-*` de la ruta aparecen
  exactamente una vez.
- CA-7: Desde `/dashboard?period=2026-08` con movimientos, "Ver todos" abre
  `/transactions?period=2026-08`, y desde ahí "‹ Resumen" vuelve a `/dashboard?period=2026-08`.
- CA-8: En el Resumen de un mes sin movimientos, el estado vacío muestra el enlace "Ver movimientos",
  que abre Movimientos en ese mismo mes; desde ahí se llega a "Eliminados".
- CA-9: Desde `/dashboard?period=2026-08`, tocar "Deudas" abre `/debts` sin `?period`; tocar
  "Suscripciones" abre `/subscriptions` sin `?period`.
- CA-10: En `/transactions?period=2026-08`, tocar "Resumen" en la barra abre
  `/dashboard?period=2026-08` (C11, regla de V1).
- CA-11: Estando en Registrar en el paso 3 con un monto y una categoría cargados, tocar "Registrar"
  en la barra no vacía el borrador ni cambia de paso.
- CA-12: Abrir `/transactions` escribiendo la URL sigue funcionando y muestra Movimientos con la barra.
- CA-13: En el diálogo "¿Eliminar transacción?" (US-65), la línea de restauración dice "Si te
  equivocaste, la podés restaurar desde Resumen → Ver todos, en Eliminados."

- **Trazabilidad:** roadmap §V2 "Navegación mobile-first" · ADR-023 (navegación global) · ADR-024 ·
  C11 · NFR-08 · FR-08 (acceso a "Eliminados") · US-65 · issue #172.

### Decisiones y supuestos

1. **Por qué estas cuatro y no Cuentas o Ajustes** (la idea de #172): ADR-023 ya fijó la barra de V2
   en Registrar · Resumen · Deudas · Suscripciones. Ajustes ya está a un toque (engranaje) y Cuentas
   vive dentro de Ajustes. Un quinto ítem no entra a 320 px con el rótulo "Suscripciones" completo
   (CA-4). No hace falta un ADR nuevo: es la decisión de ADR-023.
2. **"La barra aparece recién cuando hay más de una sección"** (roadmap §V2): desde V1 la barra ya
   tiene tres secciones, así que siempre se muestra. No hay barra condicional.
3. **Rutas en inglés** (`/debts`, `/subscriptions`), como las de V1. Si las historias de Deudas o
   Suscripciones fijan otra ruta, manda la de ellas y esta tabla se ajusta.
4. **Regresión:** ocho casos de V1 llegan a Movimientos tocando "Movimientos" en la barra
   (`entrega-1/02-especificacion-casos-de-prueba.md`): CP-ACC-009, CP-CFG-004, CP-REG-004,
   CP-REG-012, CP-REG-013, CP-CUO-008, CP-CUO-009 y CP-MON-004. Con US-69 ese paso pasa a ser "tocar 'Resumen' y
   después 'Ver todos'", o "Ver movimientos" si el mes está vacío. Hay que reescribirlos antes de
   correrlos como regresión (ADR-027). `docs/12-procedimientos-de-prueba.md` y los e2e de `e2e/` no
   usan `*-nav-transactions`. Los toasts de US-70 que dicen "Está en Movimientos, en Eliminados"
   siguen siendo correctos: Movimientos existe, solo que se llega desde el Resumen.

---

## US-70: Aviso de guardado y de error con reintento que conserva lo cargado

- **Objetivo:** Como usuario, quiero saber con certeza si mi gasto se guardó y, si falló, reintentar
  sin volver a cargarlo y sin que se duplique, para no perder un gasto ni contarlo dos veces.
- **Alcance:** el guardado del formulario de transacción (`TransactionForm`, `create_transaction`)
  en Registrar (`/register`). El aviso de error y "Reintentar" también valen en el primer gasto
  guiado de `/setup` (US-68), que usa el mismo formulario. El aviso de movimientos pendientes solo
  está en Registrar. Borrar, restaurar, Ajustes, Deudas y Suscripciones quedan fuera: sus historias
  definen su propio aviso.
- **Qué cambia respecto de V1:** hoy, si guardar falla, el formulario conserva lo cargado, pero el
  error es un toast que se va solo, no ofrece reintentar y, sin conexión, muestra el mensaje técnico
  del navegador ("TypeError: Failed to fetch"). Si el primer pedido sí había llegado, reintentar a
  mano crea un duplicado. El roadmap dice que "un fallo de red vacía el formulario", pero en `main` ya
  no pasa.
- **Decisión de diseño:** ADR-034 (clave de idempotencia y movimientos pendientes en el dispositivo),
  en estado "propuesta" hasta que el equipo apruebe esta historia.

### Ruta y estructura

`/register` (ADR-024). Esta historia toca dos lugares:

1. **Paso 3 "Revisá y guardá":** encima del botón, en el área de acción fija de abajo (que hoy tiene
   el motivo de US-11 y el botón de guardar), se suma un **aviso de error**: una caja con borde
   bordó, ícono de alerta, título en negrita y un texto.
2. **Paso 1 "¿Cuánto?":** arriba de Gasto | Ingreso, el **aviso de movimientos pendientes**, con una
   fila por cada guardado que falló y no se resolvió.

Cómo se clasifica un fallo al guardar, según el código de Postgres que devuelve la respuesta:

| Tipo | Cuándo | Reintentable |
|---|---|---|
| Rechazo | La respuesta trae un código de clase `22` (dato inválido: `22003`, `22023`, `22P02`…), de clase `23` (regla de integridad: `23514`, `23503`…), `42501` (sin sesión) o es HTTP 401 (token vencido, `PGRST301`) | No: repetir el mismo dato falla igual |
| Red | Todo lo demás: no llega respuesta (sin conexión, corte), pasan 15 s sin respuesta, HTTP 5xx, o cualquier otro error (p. ej. 404, 408, 429, `40001`, `57014`) | Sí |

Así, un fallo a mitad de la escritura que no sea una regla (sad path "fallo parcial de escritura" de
`02-behavior-spec.md`) es reintentable. El `23505` del índice de idempotencia nunca llega al cliente:
lo resuelve la RPC (ADR-034).

### Botones y textos

| Elemento | Texto exacto | Cuándo se ve | Qué hace |
|---|---|---|---|
| Botón principal | "Guardar gasto" / "Guardar ingreso" | Paso 3, salvo durante un error de red sin cambios | Guarda (una sola RPC, C4) |
| Botón principal | "Guardando…" (deshabilitado) | Mientras espera la respuesta | — |
| Botón principal | "Reintentar" | Paso 3, después de un error de red, mientras los valores sean los del intento que falló | Vuelve a guardar con la misma clave (ADR-034) |
| Botón principal | "✓ Guardado" | Durante 900 ms al guardar con éxito (V1, US-10) | — |
| Aviso de error de red | Título "No se pudo guardar". Texto "Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá." | Después de un error de red | — |
| Aviso de rechazo | Título "No se pudo guardar". Texto: el motivo de la base, como en V1 (`saveErrorMessage`). Con `42501` o HTTP 401: "Tu sesión venció. Volvé a entrar." | Después de un rechazo | — |
| Toast de éxito | Título "Gasto guardado" / "Ingreso guardado" (V1). Descripción nueva: monto, " en N cuotas" si hay más de una, categoría si hay y cuenta, separados por " · " | Al guardar con éxito | Se cierra solo |
| Aviso de pendientes | Título "Tenés 1 movimiento sin guardar" / "Tenés N movimientos sin guardar" | Al abrir Registrar, si hay pendientes | — |
| Fila del aviso | "Gasto" o "Ingreso" · monto · categoría (si hay) · fecha `dd/mm/aaaa` | Una por pendiente, el más reciente arriba | — |
| Botón de la fila | "Recuperar" | En cada fila | Ver "Recuperar" abajo |
| Botón de la fila | "Descartar" | En cada fila | Borra ese pendiente y saca su fila |
| Mensaje de "ya guardado" (toast) | Título "Ese movimiento ya estaba guardado". Descripción: la del toast de éxito | "Recuperar" encuentra la transacción ya creada y activa | — |
| Mensaje de "ya guardado y eliminado" (toast) | Título "Ese movimiento ya estaba guardado y después se eliminó". Descripción "Está en Movimientos, en Eliminados." | "Recuperar" la encuentra con `deleted_at` | — |
| Mensaje de verificación fallida | En la fila: "No pudimos verificar si ya se guardó. Revisá tu conexión y probá de nuevo." | "Recuperar" no puede consultar la API | — |

Ejemplos de la descripción del toast de éxito (montos ficticios, C14):
"$12.500,00 · Comida · Visa BBVA" · "$120.000,00 en 12 cuotas · Tecnología · Visa BBVA" ·
"US$50,00 · Viajes · Efectivo" · "$300.000,00 · Banco" (ingreso sin categoría).
Ejemplos de fila del aviso: "Gasto · $12.500,00 · Comida · 06/10/2026" ·
"Ingreso · $300.000,00 · 01/10/2026".

### Estados

- **Vacío:** sin pendientes, Registrar abre como en V1, sin aviso.
- **Cargando (guardando):** el botón dice "Guardando…" y está deshabilitado, los campos del paso 3
  quedan deshabilitados y el formulario lleva `aria-busy="true"`. A los 15 s el cliente aborta el
  pedido (lo trata como error de red). Si la base igual llegó a confirmar, la clave evita el
  duplicado en el próximo intento.
- **Cargando (recuperando):** mientras "Recuperar" consulta la API, la fila muestra "Verificando…"
  y sus dos botones quedan deshabilitados.
- **Error:** según el tipo (red o rechazo), con los textos exactos de arriba. El aviso lleva
  `role="alert"` para que el lector de pantalla lo anuncie (NFR-06). El formulario sigue en el paso
  3 con todos los valores. El aviso se va cuando se guarda con éxito o cuando algún valor queda
  distinto del que tenía en el intento que falló. En ese caso el botón vuelve a "Guardar gasto" y el
  próximo intento usa una clave nueva. Volver al mismo valor (tocar de nuevo el mismo chip, ir y
  volver entre pasos) no cuenta como cambio.
- **Éxito:** toast con la descripción nueva, botón "✓ Guardado" y vuelta al paso 1 con el formulario
  vacío y la última cuenta usada (US-10, sin cambios).

### Movimientos pendientes (NFR-09, ADR-034)

- **Cuándo se guarda uno:** después de un error de **red**, el borrador (todos sus campos, incluido
  el tipo de cambio, y su clave) queda guardado en este dispositivo para este usuario. Un rechazo no
  guarda nada nuevo.
- **Un pendiente por borrador, no por clave:** el pendiente es el borrador que está en el
  formulario. Guarda sus valores más recientes y **todas** las claves con las que se intentó
  guardarlo. Si se edita después de un fallo y vuelve a fallar, se actualiza el mismo pendiente, con
  los valores nuevos y una clave más; no se suma otro. Dos gastos distintos que fallan son dos
  pendientes, y un fallo nunca pisa a otro borrador.
- **Cuándo se borra uno:** cuando ese borrador se guarda con éxito con cualquiera de sus claves
  (incluso después de editarlo), cuando "Recuperar" lo encuentra ya guardado, al tocar su
  "Descartar", o al cerrar sesión (se borran todos los de ese usuario). Guardar **otro** movimiento
  no lo borra. No vencen por tiempo.
- **Cuándo se ve el aviso:** solo al abrir Registrar (al entrar desde otra pantalla o al recargar),
  en el paso 1, y no en la misma visita en la que falló el guardado. Desaparece cuando se resuelven
  todas sus filas. Escribir un monto no lo saca.
- **"Recuperar"** primero consulta por la API si existe una transacción propia con alguna de sus
  claves (`request_id`, incluidas las eliminadas):
  - Si existe y está activa: toast "Ese movimiento ya estaba guardado", se borra el pendiente y el
    formulario no cambia.
  - Si existe y está eliminada: toast "Ese movimiento ya estaba guardado y después se eliminó", y se
    borra el pendiente.
  - Si no existe: reemplaza lo que hubiera en el formulario por el borrador, abre el paso 3 con
    "Guardar gasto" (o "Guardar ingreso") y guarda con la última clave.
  - Si la consulta falla: la fila muestra el mensaje de verificación fallida y el pendiente queda.
- **Fecha y tipo de cambio:** el borrador recuperado conserva su fecha original (se imputa a su
  mes, aunque ya esté cerrado, igual que una fecha pasada de US-09) y su tipo de cambio (C5), aunque
  el de referencia del mes haya cambiado.
- **Cuenta o categoría archivada:** si la cuenta o la categoría del borrador ya no está activa, ese
  campo queda vacío y el motivo de US-11 la pide. Elegir otra es un cambio y genera una clave nueva.
  Es seguro porque "Recuperar" ya verificó que el intento original no se había guardado.
- **Sin almacenamiento:** si el navegador no deja escribir (almacenamiento lleno o bloqueado), no hay
  pendientes ni aviso, y no se muestra ningún error por eso. El aviso de error y "Reintentar"
  funcionan igual. No tiene criterio manual: con los datos del sitio bloqueados tampoco se puede
  iniciar sesión, porque la sesión de Supabase también vive en `localStorage`. Se verifica con un
  test de componente en V3.
- **Dónde se ve el pendiente para el tester:** en DevTools → Application → Local Storage, la entrada
  `biyu:pending-drafts:<user_id>`, que muestra cada borrador con sus `request_id`.

### Celular y computadora

- **Celular:** el aviso de error va dentro del área de acción fija, encima del botón, y se apoya
  sobre el teclado como el botón (ADR-023), así que queda a la vista aunque el teclado esté abierto.
  El aviso de pendientes ocupa el ancho de la columna arriba del paso 1, con los botones de cada
  fila de al menos 44 px de alto (NFR-08). El toast aparece arriba al centro, debajo del área segura.
- **Computadora:** los mismos elementos en la columna del formulario (máximo 576 px de ancho). El
  área de acción es la tarjeta con borde al pie del formulario. El toast, arriba al centro.

### `data-testid`

| Elemento | `data-testid` |
|---|---|
| Botón principal (todas sus etiquetas) | `transaction-form-submit` (sin cambios) |
| Aviso de error (los dos tipos) | `transaction-form-save-error`, con `data-kind="network"` o `"rejected"` |
| Toast de éxito | `transaction-form-saved` (sin cambios) |
| Aviso de pendientes | `register-pending-drafts` |
| Fila del aviso (se repite) | `register-pending-draft`, con `data-request-id="<última clave>"` |
| "Recuperar" de una fila | `register-pending-draft-restore` (dentro de su fila) |
| "Descartar" de una fila | `register-pending-draft-discard` (dentro de su fila) |
| Toast "ya estaba guardado" (los dos) | `register-pending-draft-already-saved` |

### Criterios de aceptación

Usuario de prueba según PR-01, con "Visa BBVA" (PR-02). Montos ficticios.

- CA-1: Guardar un gasto de $12.500,00 en "Comida" con "Visa BBVA" en 1 cuota muestra el toast
  "Gasto guardado" con la descripción "$12.500,00 · Comida · Visa BBVA", y el formulario vuelve al
  paso 1 vacío con "Visa BBVA" como cuenta (US-10).
- CA-2: Guardar $120.000,00 en 12 cuotas en "Tecnología" con "Visa BBVA" muestra la descripción
  "$120.000,00 en 12 cuotas · Tecnología · Visa BBVA".
- CA-3: Sin conexión (DevTools → Network → Offline), tocar "Guardar gasto" en el paso 3 muestra el
  aviso "No se pudo guardar" / "Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá."
  con `data-kind="network"`. El botón pasa a "Reintentar", y el monto, la categoría, la cuenta, las
  cuotas, la fecha y la nota siguen con los valores cargados.
- CA-4: 30 s después, el aviso de CA-3 sigue visible.
- CA-5: Con la conexión restablecida, tocar "Reintentar" muestra el toast de CA-1. Por la API
  (PR-08) hay exactamente 1 transacción con el `request_id` del pendiente.
- CA-6: Después de CA-3, cambiar el monto de $12.500,00 a $12.600,00 saca el aviso y vuelve el botón
  a "Guardar gasto". Volver a poner $12.500,00 lo deja en "Guardar gasto", sin aviso.
- CA-6b: Después de CA-3, restablecer la conexión, cambiar el monto a $12.600,00 y guardar: se ve el
  toast de éxito y, al volver a Registrar, no hay aviso de pendientes. En Movimientos hay una sola
  transacción de ese gasto, de $12.600,00.
- CA-6c: Después de CA-3, cambiar el monto a $12.600,00 y volver a guardar sin conexión: al volver a
  Registrar, el aviso dice "Tenés 1 movimiento sin guardar", con la fila de $12.600,00, y en Local
  Storage ese pendiente tiene dos `request_id`.
- CA-7: Con una latencia de 20.000 ms (DevTools → Network → throttling personalizado), "Guardar gasto"
  muestra a los 15 s (±1 s) el aviso de error de red de CA-3.
- CA-8 (UI + API, intento que llegó sin respuesta): después de CA-3, leer el `request_id` del
  pendiente en Local Storage y llamar a `create_transaction` por la API (PR-04) con esos mismos datos
  y `p_request_id` = esa clave. Después, restablecer la conexión y tocar "Reintentar": se ve el toast
  de CA-1 y por la API hay exactamente 1 transacción con esa clave.
- CA-9 (API): dos llamadas a `create_transaction` del mismo usuario con el mismo `p_request_id`
  devuelven el mismo `id`. Quedan 1 transacción y N imputaciones, no 2 y 2N (NFR-10).
- CA-10 (API): dos llamadas simultáneas con el mismo `p_request_id` devuelven el mismo `id` y dejan
  1 transacción. Ninguna recibe un error `23505`.
- CA-11 (API): dos llamadas con el mismo contenido y distinto `p_request_id` crean 2 transacciones.
- CA-12 (API): si el usuario B llama con un `p_request_id` que ya usó el usuario A, se crea una
  transacción de B y la respuesta no es el `id` de la de A (C7).
- CA-13 (API): una segunda llamada con el mismo `p_request_id` y **otro** monto devuelve el `id` de
  la primera y no cambia su monto (ADR-034).
- CA-14 (API): una segunda llamada con el mismo `p_request_id` cuando la categoría de la primera ya
  está archivada devuelve el `id` de la primera, sin error.
- CA-15 (API): una llamada sin `p_request_id` se comporta como en V1: crea una transacción por
  llamada.
- CA-16: Con Registrar abierto en el paso 3 con "Comida" elegida, archivar "Comida" desde Ajustes en
  otra pestaña y tocar "Guardar gasto" muestra el aviso "No se pudo guardar" con el motivo "la
  categoría no existe, no es tuya o está archivada" y `data-kind="rejected"`. El botón sigue en
  "Guardar gasto" y en Local Storage no aparece un pendiente nuevo.
- CA-17: Después de CA-3, ir al Resumen, restablecer la conexión y volver a Registrar muestra en el
  paso 1 el aviso "Tenés 1 movimiento sin guardar" con la fila "Gasto · $12.500,00 · Comida ·
  <fecha>" y los botones "Recuperar" y "Descartar". Lo mismo después de recargar la página.
- CA-18: Con dos fallos de red de dos gastos distintos ($12.500,00 y $3.400,00), al volver a
  Registrar el aviso dice "Tenés 2 movimientos sin guardar" y muestra las dos filas.
- CA-19: Tocar "Recuperar" en un pendiente que no llegó a la base abre el paso 3 con todos sus
  campos, incluidas la fecha original y el tipo de cambio original si es en USD. "Guardar gasto" lo
  guarda y, al volver a abrir Registrar, su fila ya no está.
- CA-20 (UI + API): después de CA-3, leer la clave del pendiente, crearla por la API como en CA-8,
  volver a Registrar con conexión y tocar "Recuperar": aparece el toast "Ese movimiento ya estaba
  guardado", el formulario no cambia, la fila desaparece, y por la API sigue habiendo exactamente 1
  transacción con esa clave.
- CA-21 (UI + API): como CA-20, pero eliminando esa transacción desde Movimientos antes de tocar
  "Recuperar": aparece el toast "Ese movimiento ya estaba guardado y después se eliminó" y no se
  crea otra transacción.
- CA-22: Sin conexión, tocar "Recuperar" muestra en la fila "No pudimos verificar si ya se guardó.
  Revisá tu conexión y probá de nuevo." y la fila sigue.
- CA-23: "Descartar" saca esa fila. Al recargar, no vuelve.
- CA-24: Con un pendiente, cerrar sesión desde Ajustes y volver a entrar con el mismo usuario: no
  aparece el aviso, y en Local Storage no está la entrada `biyu:pending-drafts:<user_id>`.
- CA-25: Si "Comida" se archivó antes de tocar "Recuperar" en un pendiente que no llegó a la base,
  el paso 3 abre sin categoría y junto al botón dice "Completá categoría para guardar" (US-11).
- CA-26: Un pendiente con fecha 30/09/2026, recuperado y guardado el 06/10/2026, aparece en el
  Resumen de septiembre 2026 y no en el de octubre.
- CA-27: Con VoiceOver o TalkBack activo, al aparecer el aviso de error se leen su título y su texto
  sin que el foco se mueva (`role="alert"`, NFR-06).
- CA-28: Mientras se guarda, tocar el botón otra vez no envía un segundo pedido: en la pestaña
  Network hay un solo `POST /rest/v1/rpc/create_transaction`.
- CA-29: En `/setup`, en el primer gasto guiado, un fallo de red muestra el aviso de CA-3 y el botón
  "Reintentar".

- **Trazabilidad:** FR-06 · `02-behavior-spec.md` sad path "fallo parcial de escritura" (paso 3) ·
  NFR-06 · NFR-08 · NFR-09 · NFR-10 · NFR-18 · C4 · C5 · C6 · C7 · C10 · US-09 · US-10 · US-11 ·
  US-68 · ADR-024 · ADR-034.

### Supuestos

1. **15 s de espera** es una decisión de producto: es mucho más que una respuesta normal de
   `create_transaction` y menos de lo que alguien espera con el celular en la mano antes de cerrar
   la app.
2. **NFR-09** dice que lo cargado "no se pierde (se guarda como borrador local)" si se corta la
   conexión mientras se completa el formulario. Mientras se completa, no se envía nada: el borrador
   está en memoria y un corte no lo afecta. El riesgo aparece al guardar, y ahí se guarda en el
   dispositivo. Esto responde la duda de CHK005 ("cuánto sobrevive el borrador local"): hasta que se
   guarde, se descarte o se cierre sesión. Recargar a mitad de la carga, sin haber intentado guardar,
   sigue vaciando el formulario, como acepta ADR-024.
3. **NFR-18** ("ningún dato importante depende exclusivamente de localStorage"): un pendiente no es
   un dato guardado sino una ayuda para recuperarlo. Si el navegador lo borra, se pierde la
   recuperación, nunca una transacción guardada.
4. **Cerrar sesión borra los pendientes sin preguntar.** Quien cierra sesión deja el dispositivo
   (US-64): después de cerrar sesión no queda ningún pendiente suyo. Que la sesión venza sola no los
   borra, porque nadie cerró sesión. Quedan para el mismo usuario (la entrada lleva su `user_id`) y
   otro usuario no los ve en la app, aunque siguen en el almacenamiento del navegador.
5. **La sesión vencida no tiene aviso propio.** Supabase renueva el token mientras la app está
   abierta, y sin sesión la app ya lleva a `/login` (US-48). Si igual llegara un `42501` o un 401
   (`PGRST301`), se muestra como rechazo con "Tu sesión venció. Volvé a entrar." y no se guarda
   pendiente. No se puede provocar a mano de forma confiable, así que no tiene criterio.
6. **Gastos compartidos (US-34):** si al implementar las deudas `create_transaction` también crea la
   deuda, la clave cubre toda la operación (ADR-034) y el borrador incluye los campos de "compartido".

---

## US-71: no se escribe — la cubre US-65 de V1

El roadmap (§V2) pide una "confirmación destructiva con consecuencias explícitas al borrar una
transacción en cuotas ('esto cambia los totales de 4 meses ya cerrados')". Antes de escribirla se
revisó US-65 ([#66](https://github.com/Joaconz/Biyu/issues/66)), su implementación y su ejecución:

| Lo que pide el roadmap | Qué hay en V1 |
|---|---|
| Confirmación antes de borrar | Diálogo "¿Eliminar transacción?" con "Cancelar" y "Eliminar" (`delete-transaction-dialog`) |
| Consecuencias explícitas en meses cerrados | US-65 · CA-2 pide avisar "qué totales cambian" antes de confirmar. La implementación va más allá del criterio: lista cada mes cerrado afectado, con el número de cuota y cuánto baja su total, y el total de los meses cerrados (`delete-transaction-affected-periods`, `src/domain/deletion.ts`) |
| Para transacciones en cuotas | El aviso aparece cuando alguna imputación cae en un mes anterior al actual: una compra en cuotas de un mes pasado |
| Probado | CP-REG-013 "Eliminar una compra con cuotas en meses cerrados avisa y es retroactivo": **PASSED** en la ejecución 1 de la Entrega 1 (2026-09-28). Con US-69 su paso 1 cambia (Movimientos sale de la barra, ver US-69, supuesto 4) |

El ejemplo del roadmap es exactamente el caso de US-65 · CA-2, y el mismo roadmap pide no repetir en
V2 lo que trajo V1. Escribir US-71 duplicaría criterios y casos de prueba.

Quedan cuatro diferencias menores. Ninguna justifica una historia nueva; cada una necesita una
decisión del equipo:

1. Una compra en cuotas **del mes actual** no muestra consecuencias aunque saque N cuotas de meses
   futuros. Los meses futuros no están cerrados y nada reescribe el pasado (C5), así que es
   coherente con US-65. Si se quisiera avisar, sería un criterio nuevo de US-65, no otra historia.
2. El diálogo no dice **qué** transacción se borra (monto, categoría). Mismo tratamiento que el 1.
3. El aviso usa el ámbar por defecto de Tailwind (`text-amber-600`) en vez del token `--warning` de
   ADR-023. Es un defecto de estilo, para reportar como DEF, no una historia.
4. El aviso recalcula el prorrateo con `generateLedgerEntries` en lugar de leer las imputaciones
   guardadas (ADR-001). Da lo mismo porque la regla es la misma que la de la RPC (ADR-013), pero
   conviene revisarlo junto con el punto 3.

---

## Pendientes fuera de este archivo

Este documento se limitó a `entrega-2/historias/navegacion.md`, el ADR-034 y los mocks. Lo
siguiente queda para quien corresponda:

| Qué | Dónde | Por qué |
|---|---|---|
| Reescribir el paso que toca "Movimientos" en la barra en CP-ACC-009, CP-CFG-004, CP-REG-004, CP-REG-012, CP-REG-013, CP-CUO-008, CP-CUO-009 y CP-MON-004 | `entrega-1/02-especificacion-casos-de-prueba.md` | US-69 saca Movimientos de la barra |
| Agregar US-69 y US-70 a la matriz y cerrar la duda de CHK005 | `docs/08-trazabilidad.md` | US-70, supuesto 2 |
| Enmendar NFR-09 con la interpretación de US-70 (el borrador se guarda en el dispositivo al fallar el guardado, y sobrevive hasta guardarse, descartarse o cerrar sesión), o registrar que el equipo la acepta | `docs/pre-entrega.md` §4 | US-70, supuesto 2. Un caso escrito contra el texto literal fallaría por diseño |
| Registrar que la "confirmación destructiva" de V2 la cubre US-65 | `docs/roadmap.md` §V2, `entrega-2/README.md` §Alcance | Sección US-71 |
| Sumar `request_id` a la lectura por API y el parámetro `p_request_id` | `docs/12-procedimientos-de-prueba.md` PR-04 y PR-08 | CA-5, CA-8 y CA-20 de US-70 |
| Columna e invariante nuevas al implementar | `docs/04-data-model.md` | ADR-034 |
| Agregar "movimiento pendiente" (borrador que falló al guardarse y todavía no es una transacción) y "clave de idempotencia" | `docs/01-domain-glossary.md` | US-70, ADR-034 |
| Ajustar el nombre del entregable (el README planea `01-historias-de-usuario-v2.md`) y quitar "un fallo de red vacía el formulario" | `entrega-2/README.md`, `docs/roadmap.md` §V2 | US-70, "Qué cambia respecto de V1" |
| Reportar el ámbar fuera de paleta del diálogo de borrado | `entrega-2/05-reportes-de-defectos` | Sección US-71, punto 3 |
