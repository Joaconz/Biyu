# Entrega 2 · Historias de usuario de V2 (documento único)

**Testing de Aplicaciones · Proyecto Integrador · Proyecto Biyu.** Este documento reúne en un solo lugar los requerimientos (historias de usuario) de la segunda versión de la aplicación (V2, el MVP usable), con el detalle que pide la consigna: pantalla y estructura, botones, campos y sus validaciones, estados, criterios de aceptación (`CA-k`), `data-testid` y mocks.

Cada Parte es el contenido, sin cambios, de un archivo de `entrega-2/historias/`, que siguen siendo la fuente. Las mismas historias son las que usa el equipo de desarrollo (el agente de IA) y el de testing: los casos de prueba las citan como `US-nn · CA-k`. Los mocks están en [`mocks/`](mocks/) y sus capturas en [`mocks-png/`](mocks-png/).

## 1. Qué trae V2

| Parte | Módulo | Qué agrega | Casos de prueba |
|---|---|---|---|
| 1 | Navegación e interfaz | Barra de navegación con Deudas y Suscripciones (US-69) y aviso de guardado o de error con reintento que conserva lo cargado y no duplica (US-70). | NAV (25) |
| 2 | Deudas y gastos compartidos | Marcar un gasto como compartido, ver y cargar deudas, filtrarlas, saldarlas y reabrirlas, y ver el neto de reembolsos en el Resumen (US-30, US-34 a US-41, US-79); compartir con varias personas y deudas sueltas en el balance (US-82 y US-83). | DEU (61) |
| 3 | Suscripciones | Alta, pausa, reanudación, cancelación y edición de suscripciones, carga automática de los meses vencidos, aviso en USD sin tipo de cambio, total comprometido y vista previa del calendario (US-52 a US-63 y US-75). | SUS (48) |
| 4 | Exportar CSV | Exportar las transacciones de un mes o de un año a un archivo CSV (US-47). | EXP (31) |
| 5 | Importar Excel | Subir un archivo de Excel, revisar las filas, importar las válidas, reintentar sin duplicar (US-74, US-76, US-77, US-78); compras en cuotas ya empezadas y guía para armar el archivo (US-80 y US-81). | IMP (41) |
| 6 | Resumen por categoría | Gráfico de torta del gasto por categoría en el Resumen (US-72) y detalle de una categoría (US-73). | sin casos |
| 7 | Editar un movimiento | Editar un movimiento ya cargado (US-84). | sin casos |

V1 dejó la base: registrar gastos e ingresos en pesos y dólares, compras en cuotas, categorías y cuentas, y un Resumen mensual. V2 lo vuelve usable en el día a día: deudas y gastos compartidos, suscripciones, exportar e importar, y una navegación y un guardado más confiables.

## 2. Historias de V2 y su estado

Estado al 2026-10-27, según lo implementado en la aplicación: **32 de 37 historias implementadas**. Las que no llegaron a V2 son US-80, US-81, US-82, US-83 y US-84; sus casos de prueba no están en el catálogo o quedan bloqueados (ver `06-reporte-de-ejecucion`).

| Historia | Título | Issue | Parte | Estado | Casos de prueba |
|---|---|---|---|---|---|
| US-69 | Barra de navegación con Deudas y Suscripciones | [#172](https://github.com/Joaconz/Biyu/issues/172) | 1 | Implementada | NAV (25) |
| US-70 | Aviso de guardado y de error con reintento que conserva lo cargado | — | 1 | Implementada | NAV (25) |
| US-30 | Ver el gasto neto de reembolsos en el Resumen | [#223](https://github.com/Joaconz/Biyu/issues/223) | 2 | Implementada | DEU (61) |
| US-34 | Marcar un gasto como compartido al registrarlo | [#224](https://github.com/Joaconz/Biyu/issues/224) | 2 | Implementada | DEU (61) |
| US-35 | Ver de qué gasto viene cada deuda | [#225](https://github.com/Joaconz/Biyu/issues/225) | 2 | Implementada | DEU (61) |
| US-36 | Cargar una deuda suelta | [#226](https://github.com/Joaconz/Biyu/issues/226) | 2 | Implementada | DEU (61) |
| US-37 | Ver lo que me deben y lo que debo por separado | [#227](https://github.com/Joaconz/Biyu/issues/227) | 2 | Implementada | DEU (61) |
| US-38 | Filtrar las deudas por pendientes o saldadas | [#228](https://github.com/Joaconz/Biyu/issues/228) | 2 | Implementada | DEU (61) |
| US-39 | Marcar una deuda como saldada en un toque | [#229](https://github.com/Joaconz/Biyu/issues/229) | 2 | Implementada | DEU (61) |
| US-40 | Volver a pendiente una deuda saldada por error | [#230](https://github.com/Joaconz/Biyu/issues/230) | 2 | Implementada | DEU (61) |
| US-41 | La deuda de un gasto no puede superar el gasto | [#231](https://github.com/Joaconz/Biyu/issues/231) | 2 | Implementada | DEU (61) |
| US-79 | Filtrar las deudas por lo que me deben o lo que debo | [#238](https://github.com/Joaconz/Biyu/issues/238) | 2 | Implementada | DEU (61) |
| US-82 | Compartir un gasto con varias personas | [#270](https://github.com/Joaconz/Biyu/issues/270) | 2 | **No implementada** | DEU (61) |
| US-83 | Las deudas sueltas mueven el balance del mes | [#271](https://github.com/Joaconz/Biyu/issues/271) | 2 | **No implementada** | DEU (61) |
| US-52 | Dar de alta una suscripción | [#210](https://github.com/Joaconz/Biyu/issues/210) | 3 | Implementada | SUS (48) |
| US-53 | Los meses vencidos se cargan solos al entrar | [#211](https://github.com/Joaconz/Biyu/issues/211) | 3 | Implementada | SUS (48) |
| US-54 | El día de cobro que no existe se cobra el último día del mes | [#212](https://github.com/Joaconz/Biyu/issues/212) | 3 | Implementada | SUS (48) |
| US-55 | El mes corriente aparece recién el día del cobro | [#213](https://github.com/Joaconz/Biyu/issues/213) | 3 | Implementada | SUS (48) |
| US-56 | Pausar una suscripción | [#214](https://github.com/Joaconz/Biyu/issues/214) | 3 | Implementada | SUS (48) |
| US-57 | Reanudar sin cargar los meses pausados | [#215](https://github.com/Joaconz/Biyu/issues/215) | 3 | Implementada | SUS (48) |
| US-58 | Cancelar sin perder el historial | [#216](https://github.com/Joaconz/Biyu/issues/216) | 3 | Implementada | SUS (48) |
| US-59 | Editar el monto sin cambiar los meses registrados | [#217](https://github.com/Joaconz/Biyu/issues/217) | 3 | Implementada | SUS (48) |
| US-60 | Borrar un mes puntual sin que vuelva | [#218](https://github.com/Joaconz/Biyu/issues/218) | 3 | Implementada | SUS (48) |
| US-61 | Ver qué movimientos vienen de una suscripción | [#219](https://github.com/Joaconz/Biyu/issues/219) | 3 | Implementada | SUS (48) |
| US-62 | Aviso de suscripción en USD sin tipo de cambio | [#220](https://github.com/Joaconz/Biyu/issues/220) | 3 | Implementada | SUS (48) |
| US-63 | Total mensual comprometido en suscripciones | [#221](https://github.com/Joaconz/Biyu/issues/221) | 3 | Implementada | SUS (48) |
| US-75 | Vista previa del calendario antes de dar de alta | [#222](https://github.com/Joaconz/Biyu/issues/222) | 3 | Implementada | SUS (48) |
| US-47 | Exportar mis transacciones de un mes o de un año a CSV | [#201](https://github.com/Joaconz/Biyu/issues/201) | 4 | Implementada | EXP (31) |
| US-74 | Subir un archivo de Excel | [#204](https://github.com/Joaconz/Biyu/issues/204) | 5 | Implementada | IMP (41) |
| US-76 | Revisar las filas antes de importar | [#205](https://github.com/Joaconz/Biyu/issues/205) | 5 | Implementada | IMP (41) |
| US-77 | Importar las filas válidas y ver el resultado | [#206](https://github.com/Joaconz/Biyu/issues/206) | 5 | Implementada | IMP (41) |
| US-78 | Reintentar una importación sin duplicar | [#207](https://github.com/Joaconz/Biyu/issues/207) | 5 | Implementada | IMP (41) |
| US-80 | Importar una compra en cuotas ya empezada | [#268](https://github.com/Joaconz/Biyu/issues/268) | 5 | **No implementada** | IMP (41) |
| US-81 | Guía para armar el archivo de importación | [#269](https://github.com/Joaconz/Biyu/issues/269) | 5 | **No implementada** | IMP (41) |
| US-72 | Gráfico de torta del gasto por categoría en el Resumen | [#242](https://github.com/Joaconz/Biyu/issues/242) | 6 | Implementada | sin casos |
| US-73 | Detalle de una categoría desde el Resumen | [#243](https://github.com/Joaconz/Biyu/issues/243) | 6 | Implementada | sin casos |
| US-84 | Editar un movimiento ya cargado | [#284](https://github.com/Joaconz/Biyu/issues/284) | 7 | **No implementada** | sin casos |

US-71 (confirmación antes de borrar) no tiene historia propia en V2: la cubre US-65 de V1.

---

## Parte 1 · Navegación e interfaz

_Fuente: `entrega-2/historias/navegacion.md`._

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

### US-69: Barra de navegación con Deudas y Suscripciones · [#172](https://github.com/Joaconz/Biyu/issues/172)

- **Objetivo:** Como usuario, quiero llegar a Registrar, Resumen, Deudas y Suscripciones con un solo
  toque desde la barra de abajo, para usar las secciones nuevas de V2 sin buscarlas.
- **Depende de:** las pantallas de listado de Deudas (historias US-34 a US-41) y de Suscripciones
  (US-52 a US-63). Esta historia define cómo se llega a ellas, no su contenido. **Se implementa
  después de que existan `/debts` y `/subscriptions`:** antes, sus ítems llevarían a la página de
  ruta inexistente y CA-2 y CA-9 no se podrían ejecutar.

#### Ruta y estructura

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

#### Botones y enlaces

| Elemento | Texto | Qué hace |
|---|---|---|
| Ítem de la barra | "Registrar" / "Resumen" / "Deudas" / "Suscripciones" | Navega al destino de la tabla |
| Engranaje (celular) / ítem al pie (computadora) | ícono sin texto con `aria-label="Ajustes"` / "Ajustes" | Navega a `/settings` (sin cambios) |
| Enlace en "Últimos movimientos" | "Ver todos" | Navega a `/transactions?period=<mes>` (sin cambios) |
| Enlace en el estado vacío del Resumen | "Ver movimientos" | Navega a `/transactions?period=<mes>` |
| Enlace en Movimientos | "‹ Resumen" | Navega a `/dashboard?period=<mes>` |

#### Estados

- **Vacío:** la barra no tiene estado vacío; siempre muestra los cuatro ítems. Los estados vacíos de
  Deudas y Suscripciones los definen sus historias.
- **Cargando:** mientras la app verifica la configuración inicial se ve "Cargando…" sin barra, igual
  que en V1 (`app-layout-loading`). Una vez visible, la barra no depende de datos y no tiene estado
  de carga.
- **Error:** la barra no consulta el servidor, así que no tiene error propio. Si una pantalla de
  destino falla, el error es de esa pantalla.

#### Celular y computadora

- **Celular (hasta 1023 px de ancho):** barra fija abajo, material translúcido con filete
  superior (ADR-023), cuatro columnas iguales con ícono arriba y rótulo abajo. Respeta el área segura
  inferior del iPhone. Se esconde con el teclado abierto, como en V1. Ajustes queda en el engranaje
  del encabezado.
- **Computadora (1024 px o más):** la misma `<nav>` se muestra como barra lateral de 240 px a la
  izquierda: wordmark arriba, los cuatro ítems en el mismo orden con ícono y rótulo en una fila, y
  "Ajustes" al pie. No hay encabezado con engranaje.
- Es un solo `<nav>` en el DOM para los dos tamaños (ADR-023): ningún `data-testid` se duplica.

#### `data-testid`

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

#### Criterios de aceptación

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

#### Decisiones y supuestos

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

### US-70: Aviso de guardado y de error con reintento que conserva lo cargado

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

#### Ruta y estructura

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

#### Botones y textos

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

#### Estados

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

#### Movimientos pendientes (NFR-09, ADR-034)

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

#### Celular y computadora

- **Celular:** el aviso de error va dentro del área de acción fija, encima del botón, y se apoya
  sobre el teclado como el botón (ADR-023), así que queda a la vista aunque el teclado esté abierto.
  El aviso de pendientes ocupa el ancho de la columna arriba del paso 1, con los botones de cada
  fila de al menos 44 px de alto (NFR-08). El toast aparece arriba al centro, debajo del área segura.
- **Computadora:** los mismos elementos en la columna del formulario (máximo 576 px de ancho). El
  área de acción es la tarjeta con borde al pie del formulario. El toast, arriba al centro.

#### `data-testid`

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

#### Criterios de aceptación

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

#### Supuestos

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

### US-71: no se escribe — la cubre US-65 de V1

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

### Pendientes fuera de este archivo

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

---

## Parte 2 · Deudas y gastos compartidos

_Fuente: `entrega-2/historias/deudas.md`._

Épica [#18](https://github.com/Joaconz/Biyu/issues/18) · Milestone V2 · Nivel 1 del alcance
(`entrega-2/README.md`). Formato de `entrega-1/01-historias-de-usuario.md`: cada criterio `CA-k` se
cita desde los casos como `US-34 · CA-k`. Fuentes: `docs/02-behavior-spec.md` (historias 30 y 34 a
41, happy path del gasto en cuotas compartido, sad path "deuda mayor que el gasto", supuestos 4 y
5), `docs/04-data-model.md` (`debts`, I4, I5, I7, I9, I10, consulta 6), `docs/roadmap.md` §V2 y
ADR-006. Las decisiones que no salían obvias de la spec están en
[ADR-036](../docs/adr/036-deuda-vinculada-en-create-transaction.md) (la deuda vinculada dentro de
`create_transaction`) y [ADR-037](../docs/adr/037-deudas-se-escriben-por-rpc.md) (escritura por
RPC, saldar y revertir, deudas de un gasto borrado y totales). US-82 y US-83 suman
[ADR-040](../docs/adr/040-gasto-compartido-con-varias-personas.md) (varias personas) y
[ADR-041](../docs/adr/041-deudas-sueltas-en-el-balance.md) (deudas sueltas en el balance).

**Mocks** (`entrega-2/mocks/`, ADR-023, montos ficticios):

| Pantalla | Ruta | Nueva o modificada | Historias | Mock |
|---|---|---|---|---|
| Registrar, paso 3 "Revisá y guardá" | `/register` | Modificada | US-34, US-41 | `deudas-registrar-compartido.html` |
| Deudas | `/debts` | Nueva | US-35, US-37 a US-40, US-79 | `deudas-listado.html` |
| Nueva deuda | `/debts/new` | Nueva | US-36 | `deudas-nueva.html` |
| Resumen | `/dashboard` | Modificada | US-30 | `deudas-resumen-neto.html` |
| Movimientos y diálogo de borrado | `/transactions` | Modificada | US-35 | `deudas-movimientos.html` |

### Convenciones de esta feature

Valen para todas las historias de abajo; cada historia las cita en vez de repetirlas.

- **Montos en pantalla:** `$1.234,56` en pesos y `US$1.234,56` en dólares (`formatArs`/`formatUsd`
  de `src/domain/money.ts`); negativos con `-` adelante: `-$50.000,00`. Nunca `number` (C2).
- **Montos tipeados:** los mismos formatos que el monto de Registrar (`tryParseMoney`): `1234,56`,
  `1.234,56`, `1234.56` y `1500`; `1.500` es mil quinientos, no 1,5. Teclado numérico
  (`inputmode="decimal"`). Letras, exponentes (`1e3`) o dos comas no son un número.
- **Fechas en pantalla:** `dd/mm/aaaa` (ej. `15/08/2026`). "Hoy" es la fecha de Argentina
  (ADR-021).
- **Cuándo aparece un error de campo:** cuando el campo se tocó y perdió el foco, igual que en
  Registrar (ADR-024). El botón de guardar está deshabilitado mientras haya cualquier error, tocado
  o no, y el motivo del primero se lee junto al botón.
- **Recorte y largo de texto:** persona y nota se recortan en los extremos con la definición de
  `String.prototype.trim` (espacio, tabulación, saltos de línea y espacio duro NBSP), en el cliente
  **y en el servidor** (la función SQL usa la misma clase de caracteres, no `btrim` a secas). Lo que
  se guarda es el texto recortado. "Hasta N caracteres" se cuenta sobre ese texto. El campo tiene
  `maxlength=N`; el navegador cuenta unidades UTF-16 (un emoji puede ocupar 2), así que el cliente
  nunca acepta algo que el servidor rechace.
- **Montos en avisos y textos:** van en la moneda de la deuda o del gasto: "Sofía te debe
  US$40,00", "…la deuda con Sofía por US$40,00.".
- **Rechazos directos contra la API (C6):** una validación de una RPC responde HTTP 400 con
  `code = '23514'` (`check_violation`) y el mensaje exacto indicado; un valor que no es del enum
  (`p_currency = 'EUR'`, `p_direction = 'x'`) lo rechaza PostgREST con HTTP 400 y `code = '22P02'`;
  sin sesión (rol `anon`), cualquier RPC de esta feature responde `42501`. En todos los casos no se
  crea ni cambia ninguna fila. En los criterios, los montos de un pedido directo se escriben como
  literal JSON (`1.001` es uno con tres decimales, no mil uno).
- **Doble toque:** todo botón que escribe se deshabilita en el primer toque; dos toques rápidos
  producen una sola llamada.
- **Rutas privadas:** `/debts` y `/debts/new` exigen sesión, como el resto (US-48): sin sesión
  redirigen a `/login?next=<ruta>`.
- **Navegación:** la entrada "Deudas" de la barra inferior la trae la feature "Navegación e interfaz" (#172).
  Hasta entonces a Deudas se llega por la URL y por el enlace "Ver deudas" del Resumen (US-30).
- **`data-testid`:** `<pantalla>-<elemento>` en kebab-case (`docs/07-plan-de-testing.md` §2). Las
  pantallas nuevas usan `debts-` (Deudas) y `debt-form-` (Nueva deuda); en las existentes se sigue
  el prefijo que ya tienen (`transaction-form-`, `dashboard-`, `transactions-item-` (Movimientos),
  `delete-transaction-`).

### Orden de implementación sugerido

US-34 y US-41 (misma RPC, ADR-036) → US-38 (pantalla Deudas) → US-35 → US-37 → US-39 y US-40 →
US-36 → US-30 → US-79 (filtro por dirección, sobre US-38 y US-37) → US-82 (varias personas, sobre
US-34 y US-41) → US-83 (balance, sobre US-36, US-39 y US-40).

---

### Historias de usuario

##### US-30: Ver el gasto neto de reembolsos en el Resumen · [#223](https://github.com/Joaconz/Biyu/issues/223)

- **Objetivo:** Como usuario, quiero ver el gasto neto de reembolsos (pendientes o saldados) como
  dato secundario, para saber cuánto es realmente mío.
- **Pantalla y estructura:** **Resumen** (`/dashboard?period=AAAA-MM`). Dentro de la tarjeta verde
  "Gastado en <mes>", en un bloque propio entre el total (y su línea "Incluye US$…",
  `dashboard-total-usd`) y el pie que hoy tiene "Cuotas de meses anteriores" y "N de M días con
  registro", se agrega la fila **"Neto de reembolsos"** con el monto a la derecha y, debajo, el
  enlace "Ver deudas". El número grande de la tarjeta sigue siendo el bruto (ADR-006); nada más de
  la pantalla cambia.
- **Elementos:**

  | Elemento | Tipo | Texto exacto | Cuándo se ve | `data-testid` |
  |---|---|---|---|---|
  | Fila del neto | texto | "Neto de reembolsos" | Solo si el período tiene al menos una deuda que cuenta para el neto (ver regla) | `dashboard-net-reimbursements` |
  | Monto del neto | texto | `$60.000,00` o `-$50.000,00` | Con la fila | `dashboard-net-reimbursements-amount` |
  | Aclaración de neto negativo | texto | "Las deudas se descuentan enteras en el mes de la compra, aunque sea en cuotas." | Solo si el neto es menor a cero | `dashboard-net-reimbursements-note` |
  | Enlace "Ver deudas" | enlace a `/debts` | "Ver deudas" | Con la fila | `dashboard-net-reimbursements-link` |

- **Regla del neto** (`04-data-model.md` consulta 6, ADR-037 §6): neto = total gastado del período
  (el mismo número de `dashboard-total-expenses`) − suma de `amount_ars` de las deudas que cumplen
  **todo** esto: dirección `owed_to_me`; estado pendiente **o** saldada; vinculadas a un gasto
  (`transaction_id` no nulo) sin baja lógica; y ese gasto tiene `first_period` igual al período
  consultado. La deuda se descuenta entera en el mes de la compra, no por cuota. Las deudas sueltas
  y las `i_owe` no cuentan. El cálculo vive en `src/domain/` o en una consulta SQL, no en el
  componente (C1).
- **Estados:** el neto se lee en la misma carga que el resto del Resumen. Cargando:
  `dashboard-loading`, sin fila. Error: si falla cualquier parte de esa carga, también la del neto,
  se ve `dashboard-error` y no se muestra ningún número a medias. Mes sin movimientos: estado vacío
  del Resumen (`dashboard-empty`, US-33), sin fila de neto.
- **Criterios de aceptación:**
  - CA-1: Con un gasto de $120.000,00 en 1 cuota en el período actual y una deuda vinculada pendiente
    de $60.000,00 a favor (`owed_to_me`), el Resumen del período muestra `dashboard-total-expenses` =
    `$120.000,00` y `dashboard-net-reimbursements-amount` = `$60.000,00` (escenario BDD "bruto y neto
    de reembolsos").
  - CA-2: Después de marcar esa deuda como saldada (US-39), el neto sigue en `$60.000,00`.
  - CA-3: Con un gasto de $120.000,00 en 12 cuotas del 15/08/2026 y una deuda vinculada de $60.000,00,
    el Resumen de `2026-08` muestra total `$10.000,00`, neto `-$50.000,00` y la aclaración
    `dashboard-net-reimbursements-note`. El Resumen de `2026-09` no muestra la fila del neto (si no
    hay otras deudas que cuenten en ese período).
  - CA-4: Una deuda suelta (US-36) en cualquier dirección y una deuda `i_owe` no hacen aparecer la
    fila ni cambian el neto.
  - CA-5: Si el gasto de origen se elimina (US-65) desde "Últimos movimientos" del Resumen, su deuda
    deja de restar sin recargar la página; si era la única, la fila desaparece. Al restaurarlo desde
    Movimientos → Eliminados y volver al Resumen, vuelve a restar.
  - CA-6: Con un gasto de US$100,00 a TC 1250 y una deuda vinculada de US$40,00, el neto resta
    `$50.000,00` (el `amount_ars` congelado de la deuda, C5), aunque después cambie el TC de
    referencia del mes.
  - CA-7: Un período sin deudas que cuenten no muestra `dashboard-net-reimbursements` (el elemento no
    está en el DOM) y el total gastado no cambia.
  - CA-8: El neto corresponde al `?period` de la URL (C11): abrir `/dashboard?period=2026-08`
    directamente muestra el neto de agosto 2026.
  - CA-9: "Ver deudas" lleva a `/debts`.
  - CA-10: El número grande de la tarjeta sigue siendo el bruto en todos los casos anteriores (ADR-006).
- **Trazabilidad:** FR-19 (ajustado, `08-trazabilidad.md`) · supuesto 4 · I10 · C1 · C5 · C11 ·
  ADR-006 · ADR-037 · consulta 6 de `04-data-model.md`

##### US-34: Marcar un gasto como compartido al registrarlo · [#224](https://github.com/Joaconz/Biyu/issues/224)

- **Objetivo:** Como usuario, quiero marcar un gasto como compartido al registrarlo, indicando persona
  y monto adeudado, para no tener que cargarlo dos veces.
- **Pantalla y estructura:** **Registrar** (`/register`), paso 3 **"Revisá y guardá"** (ADR-024).
  Orden de arriba hacia abajo: chips de resumen (monto, categoría) · Cuenta · Cuotas (solo tarjeta de
  crédito) · Fecha · Nota (opcional) · **sección nueva "Gasto compartido"** · botón fijo "Guardar
  gasto". Los pasos 1 y 2 no cambian. La sección solo existe si el tipo es **Gasto**.
- **Campos y elementos de la sección:**

  | Elemento | Tipo | Obligatorio | Rango / largo | Acepta | Valor inicial | `data-testid` |
  |---|---|---|---|---|---|---|
  | "Gasto compartido" | interruptor (`role="switch"`, `aria-checked`) | No | encendido / apagado | — | Apagado | `transaction-form-shared-toggle` |
  | "¿Con quién?" | texto, `maxlength=60`, placeholder "Nombre" | Sí, si el interruptor está encendido | 1 a 60 caracteres | Cualquier texto; se recortan los espacios de los extremos al guardar | Vacío | `transaction-form-shared-person` |
  | "¿Cuánto te debe?" | texto con teclado decimal, prefijo `$` o `US$` según la moneda del gasto | Sí, si el interruptor está encendido | > 0 y ≤ monto del gasto (US-41), hasta 2 decimales | Formatos de monto de las convenciones | Vacío | `transaction-form-shared-amount` |
  | Resumen de la deuda | texto | — | — | — | Visible cuando persona y monto son válidos | `transaction-form-shared-summary` |
  | Error de persona | texto (`role="alert"`) | — | — | — | — | `transaction-form-shared-person-error` |
  | Error de monto | texto (`role="alert"`) | — | — | — | — | `transaction-form-shared-amount-error` |

  Texto del resumen: "Sofía te va a deber $60.000,00 · Tu parte: $60.000,00" (tu parte = monto del
  gasto − monto adeudado, en la moneda del gasto).
- **Botones:** no se agregan. "Guardar gasto" (`transaction-form-submit`) guarda todo; mientras
  guarda dice "Guardando…" y la sección queda deshabilitada como el resto del paso.
- **Mensajes de error (cliente, exactos):**

  | Condición | Mensaje |
  |---|---|
  | Persona vacía o solo espacios | "Ingresá con quién compartiste el gasto" |
  | Monto vacío | "Ingresá cuánto te debe" |
  | Monto que no es un número | "Ingresá un número válido" |
  | Monto 0 o negativo | "El monto debe ser mayor a cero" |
  | Monto con más de 2 decimales | "El monto admite hasta 2 decimales" |
  | Gasto en US$: monto × TC del gasto redondea a $0,00 | "En pesos daría menos de $0,01. Revisá el monto o el tipo de cambio" |
  | Monto mayor al gasto | Ver US-41 |

- **Mensajes del servidor** (`create_transaction`, ADR-036): "Un gasto compartido necesita persona y
  monto", "Un ingreso no se puede compartir", "Ingresá con quién compartiste el gasto", "La persona
  admite hasta 60 caracteres", "I4: el monto de la deuda debe ser mayor a cero", "I4: el monto de la
  deuda admite hasta 2 decimales", "I4: la deuda en pesos daría menos de $0,01". En la UI aparecen
  como descripción del aviso "No se pudo guardar" (`transaction-form-save-error`). Un pedido directo
  sigue la convención de rechazos de arriba.
- **Estados:** vacío: no aplica (no hay listado). Cargando: "Guardando…" en el botón. Error: aviso
  "No se pudo guardar" con el motivo; no se crea nada. Éxito: aviso "Gasto guardado"
  (`transaction-form-saved`) con la descripción "Sofía te debe $60.000,00".
- **Criterios de aceptación:**
  - CA-1: Con tipo **Gasto**, el paso 3 muestra el interruptor "Gasto compartido" apagado. Con tipo
    **Ingreso**, `transaction-form-shared-toggle` no está en el DOM.
  - CA-2: Al encender el interruptor aparecen "¿Con quién?" y "¿Cuánto te debe?" vacíos. Al apagarlo
    desaparecen, y guardar crea el gasto sin deuda aunque antes se hubiera escrito algo.
  - CA-3: Gasto de $120.000,00 ARS, tarjeta de crédito, 12 cuotas, fecha 15/08/2026, compartido con
    "Sofía" por `60000`: se crean una transacción de $120.000,00, 12 imputaciones de $10.000,00 de
    `2026-08` a `2027-07`, y una deuda con `person = 'Sofía'`, `amount = 60000.00`,
    `currency = 'ARS'`, `fx_rate = null`, `direction = 'owed_to_me'`, `status = 'pending'`,
    `settled_at = null`, `incurred_on = 2026-08-15` y `transaction_id` = el id de esa transacción
    (escenario BDD "gasto compartido genera deuda vinculada").
  - CA-4: Guardar un gasto compartido hace exactamente una llamada a
    `POST /rest/v1/rpc/create_transaction` y ninguna a `/rest/v1/debts` (C4, ADR-036).
  - CA-5: Gasto de US$100,00 a TC 1250 compartido por `40`: la deuda queda con `currency = 'USD'`,
    `fx_rate = 1250.0000` y `amount_ars = 50000.00`.
  - CA-6: "  Sofía  " se guarda como "Sofía". Solo espacios muestra "Ingresá con quién compartiste
    el gasto" y deshabilita "Guardar gasto". 60 caracteres se guardan; el campo no deja escribir el
    carácter 61.
  - CA-7: En "¿Cuánto te debe?", vacío, `abc`, `0`, `-5` y `100,001` muestran el mensaje de la tabla
    correspondiente y dejan "Guardar gasto" deshabilitado; no se emite ninguna escritura.
  - CA-8: Directo contra la RPC (C6), cada uno de estos pedidos se rechaza con HTTP 400,
    `code = '23514'` y el mensaje del servidor indicado, y no crea filas en `transactions`,
    `ledger_entries` ni `debts`: solo `p_shared_person`; solo `p_shared_amount`; `p_type = 'income'`
    con deuda; persona `"   "`; persona `"\t"`; persona de 61 caracteres; `"p_shared_amount": 0`;
    `-1`; `1.001` (literal JSON); `"NaN"`; gasto de US$100 a TC `0.4` con `"p_shared_amount": 0.01`.
    Con el rol `anon`, el mismo pedido válido responde `42501`. **Modificado por US-82 (ADR-040):** la
    persona y el monto se mandan como arreglos de un elemento (`p_shared_persons`,
    `p_shared_amounts`); los mensajes no cambian.
  - CA-9 (**con varias personas, el aviso lo define US-82**): Después de guardar: aviso "Gasto guardado" con "Sofía te debe $60.000,00", el formulario
    vuelve al paso 1 con el interruptor apagado y los dos campos vacíos, y la cuenta usada queda
    preseleccionada (US-07, US-10).
  - CA-10: Si con el interruptor encendido se vuelve al paso 1 y se cambia el tipo a **Ingreso**, al
    guardar el ingreso no se crea deuda; si se vuelve a **Gasto**, el interruptor está apagado y los
    campos vacíos.
  - CA-11: Todos los elementos de la tabla tienen su `data-testid`.
  - CA-12: Si con la deuda cargada se vuelve al paso 1 y se cambia la moneda, al volver al paso 3
    "¿Cuánto te debe?" está vacío y su prefijo es el de la moneda nueva; la persona se conserva.
  - CA-13: Con un gasto en US$, el aviso de éxito dice "Sofía te debe US$40,00".
- **Trazabilidad:** FR-18 · I4 · I5 · I7 · C4 · C6 · ADR-024 · ADR-036 · happy path "registrar un
  gasto en cuotas compartido"

##### US-35: Ver de qué gasto viene cada deuda · [#225](https://github.com/Joaconz/Biyu/issues/225)

- **Objetivo:** Como usuario, quiero que esa deuda quede vinculada al gasto que la originó, para saber
  después de qué venía.
- **Pantallas y estructura:** no crea pantallas; agrega una línea en tres lugares.
  - **Deudas** (`/debts`, US-38): cada fila muestra, debajo de la persona, la línea de origen.
  - **Movimientos** (`/transactions`) y **"Últimos movimientos"** del Resumen: la fila de un gasto
    compartido muestra la etiqueta de compartido junto a las demás etiquetas (cuota "n/N",
    "archivada").
  - **Diálogo "¿Eliminar transacción?"** (US-65): si el gasto tiene deuda vinculada, una línea más
    justo antes de "Si te equivocaste, la podés restaurar desde Movimientos, en Eliminados." El resto
    del diálogo (aviso de meses cerrados, filas por mes) no cambia.
- **Elementos:**

  | Dónde | Texto exacto | Cuándo | `data-testid` |
  |---|---|---|---|
  | Fila de Deudas | "Gasto compartido: <categoría>, <monto del gasto> del <fecha del gasto>". Ej.: "Gasto compartido: Tecnología, $120.000,00 del 15/08/2026" | Deuda vinculada | `debts-item-origin` |
  | Fila de Deudas | "Deuda suelta" | Deuda sin gasto | `debts-item-origin` |
  | Fila de Movimientos | "Compartido con Sofía" | Gasto con deuda vinculada, en cada cuota | `transactions-item-shared` |
  | Fila de Últimos movimientos | "Compartido con Sofía" | Ídem | `dashboard-transaction-item-shared` |
  | Diálogo de borrado | "También deja de contar la deuda con Sofía por $60.000,00." | Gasto con deuda vinculada | `delete-transaction-debt-warning` |

  El monto del gasto va en su moneda (`US$100,00` si es en dólares) y es el total de la compra, no
  la cuota. Una categoría archivada se muestra con su nombre igual. Ninguno de estos textos es
  interactivo. **Modificado por US-82 (ADR-040):** con dos o más personas, la etiqueta
  de Movimientos y de Últimos movimientos y el aviso del diálogo de borrado cambian como dice US-82.
- **Estados:** los de cada pantalla; esta historia no agrega cargas propias. La deuda vinculada
  (persona y monto) viene en la misma consulta que la fila de la transacción (embed de `debts`): si
  esa consulta falla se ve el error de la pantalla, y el diálogo de borrado nunca se abre sin saber
  si el gasto tiene deuda.
- **Criterios de aceptación:**
  - CA-1: La deuda creada en US-34 · CA-3 tiene `transaction_id` igual al id de la transacción creada
    en la misma llamada.
  - CA-2: En `/debts?status=all`, la fila de esa deuda muestra "Gasto compartido: Tecnología,
    $120.000,00 del 15/08/2026"; la de una deuda suelta muestra "Deuda suelta".
  - CA-3: En Movimientos, las 12 cuotas de ese gasto (una por mes, navegando con `?period`) muestran
    "Compartido con Sofía"; un gasto sin deuda no tiene `transactions-item-shared`. Lo mismo en
    "Últimos movimientos".
  - CA-4: Al tocar la papelera de ese gasto, el diálogo muestra "También deja de contar la deuda con
    Sofía por $60.000,00."; para un gasto sin deuda, `delete-transaction-debt-warning` no está.
  - CA-5: Después de eliminar el gasto, su deuda no aparece en `/debts` con ningún filtro, deja de
    sumar en "Te deben" (US-37) y en el neto del Resumen (US-30), y su fila en `debts` no cambia
    (`status`, `settled_at`, `amount` iguales) (ADR-037 §4).
  - CA-6: Al restaurar el gasto desde Movimientos → Eliminados, la deuda vuelve a `/debts` con el
    mismo estado y la misma fecha de saldada que tenía.
  - CA-7: Directo contra la RPC, `settle_debt` y `reopen_debt` sobre la deuda de un gasto eliminado
    responden "La deuda no existe".
- **Trazabilidad:** FR-18 · I7 · I10 · C10 · US-65 · ADR-037

##### US-36: Cargar una deuda suelta · [#226](https://github.com/Joaconz/Biyu/issues/226)

- **Objetivo:** Como usuario, quiero cargar una deuda suelta, sin gasto asociado, para registrar una
  plata que presté en efectivo.
- **Pantalla y estructura:** **Nueva deuda** (`/debts/new`), pantalla completa. Se abre desde el botón
  "Nueva deuda" de Deudas (US-38) o desde "Cargar una deuda" del estado vacío. De arriba hacia abajo:
  título "Nueva deuda" · Dirección · Persona · Monto con su moneda · Tipo de cambio (solo US$) ·
  Fecha · Nota · botón fijo "Guardar deuda" y, debajo, "Cancelar". Al abrir, el foco está en
  "Persona".
- **Campos:**

  | Campo | Tipo | Obligatorio | Rango / largo | Acepta | Valor inicial | `data-testid` |
  |---|---|---|---|---|---|---|
  | "Dirección" | selector de 2 opciones: "Me deben" / "Debo" | Sí | `owed_to_me` / `i_owe` | — | "Me deben" | `debt-form-direction`, opciones `debt-form-direction-owed-to-me` y `debt-form-direction-i-owe` |
  | "Persona" | texto, `maxlength=60`, placeholder "Nombre" | Sí | 1 a 60 caracteres | Cualquier texto; se recortan los extremos | Vacío | `debt-form-person` |
  | "Monto" | texto con teclado decimal | Sí | > 0 y ≤ 999.999.999.999,99, hasta 2 decimales | Formatos de monto de las convenciones | Vacío | `debt-form-amount` |
  | "Moneda" | selector "ARS" / "US$" | Sí | `ARS` / `USD` | — | "ARS" | `debt-form-currency`, opciones `debt-form-currency-ars` y `debt-form-currency-usd` |
  | "Tipo de cambio (ARS por US$)" | texto con teclado decimal; solo con US$ | Sí, con US$ | > 0 y ≤ 9.999.999.999,9999, hasta 4 decimales; monto × TC entre $0,01 y $999.999.999.999,99 | Formatos de monto | El TC de referencia del mes de "Fecha" (US-20) o vacío | `debt-form-fx-rate` |
  | Equivalente en pesos | texto "≈ $50.000,00" | — | — | — | Con US$, monto y TC válidos | `debt-form-fx-ars-equivalent` |
  | "Fecha" | fecha (`type="date"`, `max` = hoy) | Sí | ≤ hoy | `aaaa-mm-dd` | Hoy | `debt-form-date` |
  | "Nota (opcional)" | texto de una línea, `maxlength=200`, placeholder "Préstamo en efectivo" | No | 0 a 200 caracteres | Cualquier texto; vacía o solo espacios se guarda sin nota | Vacío | `debt-form-notes` |

  El tipo de cambio sigue las reglas de Registrar: si el usuario no lo editó, al cambiar la fecha
  de mes se vuelve a sugerir el del mes nuevo; si lo editó, se respeta (US-21). Sin referencia para
  el mes: el campo queda vacío con el texto "No tenés un tipo de cambio configurado para este mes"
  (`debt-form-fx-rate-status`) y el enlace "Ir a Ajustes" (`debt-form-fx-settings`, a `/settings`).
- **Botones:**

  | Texto | Qué hace | `data-testid` |
  |---|---|---|
  | "Guardar deuda" (mientras guarda: "Guardando…") | Llama una vez a `create_debt` (ADR-037). Deshabilitado con cualquier error | `debt-form-submit` |
  | "Cancelar" | Vuelve a `/debts` sin guardar ni preguntar | `debt-form-cancel` |

  Junto a "Guardar deuda", el motivo del primer error: `debt-form-hint`.
- **Mensajes de error (cliente, exactos).** Cada error se muestra debajo de su campo, con
  `role="alert"` y su `data-testid`: `debt-form-person-error`, `debt-form-amount-error`,
  `debt-form-fx-rate-error`, `debt-form-date-error`. Las reglas son las de `validateTransactionDraft`
  para el monto y el TC (DEF-012, DEF-013, DEF-018), en el mismo orden de prioridad.

  | Campo | Condición | Mensaje |
  |---|---|---|
  | Persona | Vacía o solo espacios | "Ingresá el nombre de la persona" |
  | Monto | Vacío | "Ingresá el monto" |
  | Monto | No es un número | "Ingresá un número válido" |
  | Monto | 0 o negativo | "El monto debe ser mayor a cero" |
  | Monto | Más de 2 decimales | "El monto admite hasta 2 decimales" |
  | Monto | Mayor a 999.999.999.999,99, en ARS | "El monto máximo es $999.999.999.999,99" |
  | Monto | Mayor a 999.999.999.999,99, en US$ | "El monto máximo es US$999.999.999.999,99" |
  | Monto | En US$, monto × TC mayor a $999.999.999.999,99 | "En pesos daría más que el máximo de $999.999.999.999,99" |
  | Monto | En US$, monto × TC redondea a $0,00 | "En pesos daría menos de $0,01. Revisá el monto o el tipo de cambio" |
  | Tipo de cambio | Vacío con US$ | "Falta el tipo de cambio" |
  | Tipo de cambio | No es un número | "Ingresá un número válido" |
  | Tipo de cambio | 0 o negativo | "El tipo de cambio debe ser mayor a cero" |
  | Tipo de cambio | Más de 4 decimales | "Usá hasta 4 decimales" |
  | Tipo de cambio | Mayor a 9.999.999.999,9999 | "El tipo de cambio es demasiado grande" |
  | Fecha | Vacía o inválida | "Fecha inválida" |
  | Fecha | Posterior a hoy | "La fecha no puede ser futura" |

- **Mensajes del servidor** (`create_debt`, ADR-037 §2): "Dirección y moneda son obligatorias",
  "Ingresá el nombre de la persona", "La persona admite hasta 60 caracteres", "I4: el monto debe ser
  mayor a cero", "I4: el monto admite hasta 2 decimales", "I5: fx_rate es obligatorio si y solo si
  la moneda es USD", "I5: fx_rate debe ser mayor a cero", "El tipo de cambio es demasiado grande",
  "En pesos daría más que el máximo de $999.999.999.999,99", "I4: en pesos daría menos de $0,01",
  "La fecha es obligatoria", "La fecha no puede ser posterior a hoy", "La nota admite hasta 200
  caracteres". En la UI aparecen como descripción del aviso "No se pudo guardar la deuda"
  (`debt-form-save-error`). Un pedido directo sigue la convención de rechazos de arriba.
- **Estados:** vacío: no aplica. Cargando: mientras se busca el TC de referencia, "Buscando el tipo
  de cambio del mes…" (`debt-form-fx-loading`) y "Guardar deuda" deshabilitado; mientras guarda,
  "Guardando…" y todos los campos deshabilitados. Error al guardar: aviso "No se pudo guardar la
  deuda" con el motivo; el formulario conserva lo cargado. Error al buscar el TC: el campo queda
  vacío y editable, con el texto "No pudimos traer el tipo de cambio de referencia"
  (`debt-form-fx-rate-status`). Éxito: aviso "Deuda guardada" (`debt-form-saved`) y navegación a
  `/debts?status=pending`.
- **Criterios de aceptación:**
  - CA-1: "Nueva deuda" en `/debts` abre `/debts/new` con "Me deben", persona y monto vacíos, "ARS",
    sin campo de tipo de cambio, fecha = hoy, nota vacía y el foco en "Persona".
  - CA-2: Guardar "Juan", `20000`, ARS, hoy, sin nota crea una fila en `debts` con
    `transaction_id = null`, `direction = 'owed_to_me'`, `status = 'pending'`, `currency = 'ARS'`,
    `fx_rate = null`, `amount = 20000.00`, `incurred_on` = hoy y `notes = null`; muestra "Deuda
    guardada" y queda en `/debts?status=pending` con esa deuda en la lista.
  - CA-3: Con "Debo", la deuda se guarda con `direction = 'i_owe'` y en la lista dice "Le debés".
  - CA-4: Con "US$" y un TC de referencia de 1250 para el mes de la fecha, el campo viene con
    `1.250,00`; con monto `40` el equivalente dice "≈ $50.000,00"; guardada, la fila tiene
    `fx_rate = 1250.0000` y `amount_ars = 50000.00`.
  - CA-5: Con "US$" y sin TC de referencia para el mes, el campo está vacío, se ve "No tenés un tipo
    de cambio configurado para este mes" y "Ir a Ajustes", y "Guardar deuda" está deshabilitado con
    "Falta el tipo de cambio".
  - CA-6: Cada condición de la tabla de errores muestra su mensaje exacto en el `data-testid` de su
    campo y deja "Guardar deuda" deshabilitado; no se emite ninguna escritura. Valores límite del
    monto en ARS: `0` y `0,001` rechazados; `0,01` y `999.999.999.999,99` aceptados;
    `1.000.000.000.000` rechazado. En US$: `1.000.000.000` a TC `1000` rechazado ("En pesos daría
    más…"); `0,01` a TC `0,4` rechazado ("En pesos daría menos de $0,01…"); `0,01` a TC `0,5`
    aceptado (`amount_ars = 0.01`, redondeo half-up).
  - CA-7: Una fecha anterior a hoy (ej. 31/12/2025) se acepta; mañana se rechaza con "La fecha no
    puede ser futura". Persona de 60 caracteres se acepta; el campo no deja escribir el 61. La nota no
    deja escribir el carácter 201.
  - CA-8: Directo contra `create_debt` (C6), cada pedido inválido se rechaza según la convención de
    rechazos (HTTP 400, `23514`, mensaje del servidor) y no crea filas: persona `""`, `"   "` y
    `"\t"`; persona de 61 caracteres; `"p_amount": 0`; `1.001` (literal JSON); `"NaN"`; USD sin
    `p_fx_rate`; ARS con `p_fx_rate`; `"p_fx_rate": 10000000000`; USD `1000000000` a TC `1000`; USD
    `0.01` a TC `0.4`; fecha de mañana; nota de 201 caracteres; dirección `null`. Con
    `p_currency = 'EUR'` o `p_direction = 'x'`: HTTP 400 con `code = '22P02'`. Con el rol `anon`,
    un pedido válido responde `42501`.
  - CA-9: Un `POST /rest/v1/debts` directo con la sesión del usuario responde `permission denied`
    (`42501`) y no crea filas (ADR-037 §1).
  - CA-10: Guardar hace exactamente una llamada a `POST /rest/v1/rpc/create_debt`; dos toques rápidos
    en "Guardar deuda" producen una sola llamada y una sola fila.
  - CA-11: "Cancelar" vuelve a `/debts` y no crea nada.
  - CA-12: Una deuda suelta no cambia ningún número del Resumen (total, ingresos, balance ni neto,
    US-30). **Modificado por US-83 (ADR-041):** sí cambia el balance; el resto sigue igual.
  - CA-13: Si el servidor rechaza el guardado, aparece "No se pudo guardar la deuda" con el motivo y
    los campos conservan lo cargado.
  - CA-14: Todos los campos, botones y errores por campo tienen su `data-testid`.
  - CA-15: Las pruebas pgTAP que hoy escriben `debts` directo como `authenticated`
    (`rls_isolation.test.sql`: update y delete de `debts`; `db_defects.test.sql`: DEF-016;
    `nan_amounts.test.sql`: `debts`) pasan a esperar `42501` o a escribir con `create_debt` /
    `create_transaction`, y la suite completa (`npm run test:db`) pasa (ADR-037, consecuencias).
- **Trazabilidad:** FR-18 · I4 · I5 · C2 · C5 · C6 · C7 · ADR-002 · ADR-021 · ADR-037

##### US-37: Ver lo que me deben y lo que debo por separado · [#227](https://github.com/Joaconz/Biyu/issues/227)

- **Objetivo:** Como usuario, quiero ver dos totales separados —lo que me deben y lo que debo—, para
  tener el neto claro.
- **Pantalla y estructura:** **Deudas** (`/debts`, US-38). Entre el título y el filtro, una tarjeta
  con dos columnas, **"Te deben"** (verde, `--primary`) y **"Debés"** (bordó, `--destructive`), y
  debajo una línea con el neto.
- **Elementos:**

  | Elemento | Texto exacto | `data-testid` |
  |---|---|---|
  | Tarjeta de totales | — | `debts-totals` |
  | Total a favor | rótulo "Te deben", monto `$110.000,00` | `debts-total-owed-to-me` |
  | Total en contra | rótulo "Debés", monto `$15.000,00` | `debts-total-i-owe` |
  | Neto | "A tu favor $95.000,00" si es > 0 · "En contra $5.000,00" si es < 0 (el monto sin signo) · "En cero" si es 0 | `debts-net` |
  | Aclaración | "Solo suman las deudas pendientes." | `debts-totals-note` |

- **Regla** (ADR-037 §5): "Te deben" = suma de `amount_ars` de las deudas **pendientes**
  `owed_to_me` visibles; "Debés" = lo mismo con `i_owe`; neto = "Te deben" − "Debés". Visibles =
  sueltas, o vinculadas a un gasto sin baja lógica. Los totales **no dependen del filtro** de la
  lista. En pesos, con el `amount_ars` congelado de cada deuda (C5).
- **Estados:** cargando: la tarjeta no se muestra (se ve `debts-loading`). Error: no se muestra (se ve
  `debts-error`). Sin deudas pendientes: los dos totales en `$0,00` y "En cero".
- **Criterios de aceptación:**
  - CA-1: Con Sofía $60.000,00 pendiente a favor, Juan US$40,00 a TC 1250 pendiente a favor, Ana
    $15.000,00 pendiente en contra y Pedro $8.000,00 saldada a favor, la tarjeta muestra "Te deben"
    `$110.000,00`, "Debés" `$15.000,00` y "A tu favor $95.000,00".
  - CA-2: Con solo Ana $15.000,00 pendiente en contra y Sofía $10.000,00 pendiente a favor, el neto
    dice "En contra $5.000,00".
  - CA-3: Con "Te deben" y "Debés" iguales, o sin pendientes, el neto dice "En cero"; sin pendientes,
    los dos totales dicen `$0,00`.
  - CA-4: Los tres valores son los mismos con "Pendientes", "Saldadas" y "Todas".
  - CA-5: Al saldar (US-39) o volver a pendiente (US-40) una deuda, los totales se actualizan sin
    recargar la página.
  - CA-6: Cambiar el TC de referencia del mes de Juan a 1400 no cambia "Te deben" (C5).
  - CA-7: La deuda de un gasto eliminado no suma (US-35 · CA-5).
- **Trazabilidad:** FR-18 · C5 · ADR-037 · supuesto 5

##### US-38: Filtrar las deudas por pendientes o saldadas · [#228](https://github.com/Joaconz/Biyu/issues/228)

- **Objetivo:** Como usuario, quiero filtrar las deudas por pendientes o saldadas, para enfocarme en lo
  que falta cobrar.
- **Pantalla y estructura:** **Deudas** (`/debts?status=pending|settled|all`), pantalla nueva dentro del
  layout común (ADR-023), lista agrupada estilo iOS. De arriba hacia abajo:
  1. Encabezado: título "Deudas" (`debts-title`) y, a la derecha, botón "Nueva deuda"
     (`debts-new`, lleva a `/debts/new`, US-36).
  2. Tarjeta de totales (US-37).
  3. Filtro de tres opciones (`debts-filter`, `role="radiogroup"`): "Pendientes"
     (`debts-filter-pending`), "Saldadas" (`debts-filter-settled`), "Todas" (`debts-filter-all`).
  4. Lista (`debts-list`): una fila por deuda (`debts-item`, con `data-debt-id` y
     `data-status="pending|settled"`).
- **Fila de deuda:**

  | Elemento | Texto exacto | `data-testid` |
  |---|---|---|
  | Persona | "Sofía" | `debts-item-person` |
  | Dirección | "Te debe" (`owed_to_me`) o "Le debés" (`i_owe`) | `debts-item-direction` |
  | Monto en su moneda | `$60.000,00` o `US$40,00` | `debts-item-amount` |
  | Equivalente en pesos | "≈ $50.000,00" (solo deudas en US$) | `debts-item-amount-ars` |
  | Fecha | "15/08/2026" (`incurred_on`) | `debts-item-date` |
  | Origen | Ver US-35 | `debts-item-origin` |
  | Nota | El texto de la nota (solo si tiene) | `debts-item-notes` |
  | Estado | "Pendiente" o "Saldada el 20/08/2026" (`settled_at` en hora de Argentina) | `debts-item-status` |
  | Acción | "Marcar saldada" (US-39) o "Volver a pendiente" (US-40) | `debts-item-settle` / `debts-item-reopen` |

- **Filtro y URL (C11):** el valor vive en `?status=`. Sin parámetro o con un valor que no sea
  `pending`, `settled` ni `all`, se comporta como "Pendientes". Tocar una opción cambia la URL sin
  recargar y la lista se filtra.
- **Orden:** "Pendientes" y "Todas": fecha (`incurred_on`) más reciente primero; a igual fecha, la
  cargada más recientemente (`created_at`) primero. "Saldadas": `settled_at` más reciente primero. **Modificado por US-82 (ADR-040 §5):** a igual fecha y `created_at` (las deudas de un mismo
  gasto compartido), por persona en orden alfabético sin distinguir mayúsculas ni tildes, y después
  por `id`.
- **Qué se lista:** las deudas del usuario (RLS, C7) que son sueltas o están vinculadas a un gasto sin
  baja lógica (ADR-037 §4).
- **Estados:**

  | Estado | Qué se ve | `data-testid` |
  |---|---|---|
  | Cargando | "Cargando deudas…" (sin totales ni lista) | `debts-loading` |
  | Error | "No pudimos cargar tus deudas." y botón "Reintentar", que vuelve a pedir los datos | `debts-error`, `debts-retry` |
  | Vacío, "Pendientes" | "No tenés deudas pendientes." y botón "Cargar una deuda" (a `/debts/new`) | `debts-empty`, `debts-empty-new` |
  | Vacío, "Saldadas" | "Todavía no saldaste ninguna deuda." | `debts-empty` |
  | Vacío, "Todas" | "No cargaste ninguna deuda todavía." y botón "Cargar una deuda" | `debts-empty`, `debts-empty-new` |

- **Criterios de aceptación:**
  - CA-1: `/debts` sin parámetros muestra "Pendientes" seleccionado (`aria-checked="true"`) y solo
    filas con `data-status="pending"`.
  - CA-2: Tocar "Saldadas" cambia la URL a `/debts?status=settled` y muestra solo saldadas; "Todas",
    a `?status=all`, muestra pendientes y saldadas.
  - CA-3: Abrir `/debts?status=settled` directamente, o recargar en esa URL, muestra "Saldadas"
    seleccionado y solo saldadas.
  - CA-4: `/debts?status=xyz` lista solo pendientes y muestra "Pendientes" con
    `aria-checked="true"`; la URL queda como está hasta que se toca otra opción, que reemplaza el
    valor (`?status=settled`).
  - CA-5: Con tres pendientes del 01/10/2026, 15/08/2026 y 01/10/2026 (esta cargada después), el orden
    es: la del 01/10 cargada después, la otra del 01/10, la del 15/08. "Saldadas" ordena por fecha de
    saldada, la más reciente primero.
  - CA-6: Cada fila muestra los textos de la tabla con su formato; una deuda en US$ muestra
    `US$40,00` y "≈ $50.000,00"; una en pesos no tiene `debts-item-amount-ars`.
  - CA-7: Cada filtro vacío muestra su mensaje exacto; "Cargar una deuda" lleva a `/debts/new`.
  - CA-8: Si la carga falla (ej. sin red), se ve "No pudimos cargar tus deudas." y "Reintentar"; al
    volver la red, "Reintentar" muestra la lista sin recargar la página.
  - CA-9: Con la sesión de otro usuario, un `GET /rest/v1/debts` devuelve 0 filas del primero; con el
    rol `anon`, `permission denied` (`42501`) (par pgTAP de C7).
  - CA-10: Sin sesión, `/debts` redirige a `/login?next=%2Fdebts` (US-48).
  - CA-11: Todos los elementos interactivos de la pantalla tienen su `data-testid`.
- **Trazabilidad:** FR-18 · C7 · C11 · I10 · ADR-023 · ADR-037

##### US-39: Marcar una deuda como saldada en un toque · [#229](https://github.com/Joaconz/Biyu/issues/229)

- **Objetivo:** Como usuario, quiero marcar una deuda como saldada en un tap, para cerrarla cuando me
  pagan.
- **Pantalla y estructura:** **Deudas** (`/debts`, US-38). Cada fila **pendiente** tiene, a la
  derecha, el botón "Marcar saldada". No hay diálogo de confirmación: la acción se deshace con
  "Deshacer" o con "Volver a pendiente" (US-40).
- **Elementos:**

  | Elemento | Texto exacto | `data-testid` |
  |---|---|---|
  | Botón de la fila | "Marcar saldada"; mientras espera la respuesta, "Saldando…" y deshabilitado | `debts-item-settle` |
  | Aviso de éxito | "Deuda con Sofía saldada" | `debts-settled` |
  | Acción del aviso | "Deshacer" (llama a `reopen_debt`, US-40) | `debts-settled-undo` |
  | Aviso de error | "No se pudo actualizar la deuda", con el motivo del servidor | `debts-update-error` |

- **Transiciones** (ADR-037 §3): `pending → settled` con `settle_debt`, `settled_at` = hora del
  servidor. Saldar una saldada es inválido ("La deuda ya está saldada").
- **"Deshacer":** el aviso dura 5 segundos o hasta que se cambia de filtro o de pantalla, lo que pase
  primero; después la deuda solo se reabre con "Volver a pendiente" (US-40). Mientras "Deshacer"
  espera la respuesta queda deshabilitado. Si falla, aparece `debts-update-error`.
- **Estados:** cargando: el botón de esa fila dice "Saldando…"; el resto de la pantalla sigue usable.
  Error: aviso de error y la fila no cambia. Si el motivo es "La deuda ya está saldada" o "La deuda no
  existe" (otra pestaña la cambió, o se eliminó su gasto), además se vuelven a pedir la lista y los
  totales. Vacío: si era la última pendiente con el filtro "Pendientes", aparece el estado vacío de
  US-38.
- **Criterios de aceptación:**
  - CA-1: Con el filtro "Pendientes", un toque en "Marcar saldada" de Sofía hace exactamente una
    llamada a `POST /rest/v1/rpc/settle_debt`, la fila sale de la lista, aparece "Deuda con Sofía
    saldada" con "Deshacer", y en la base la deuda queda con `status = 'settled'` y `settled_at` no
    nulo (I9).
  - CA-2: Con "Todas", la fila queda en la lista con "Saldada el <fecha de hoy>" y el botón pasa a
    "Volver a pendiente".
  - CA-3: Dos toques rápidos producen una sola llamada (el botón se deshabilita en el primero).
  - CA-4: "Deshacer" dentro de los 5 segundos deja la deuda pendiente otra vez (`settled_at = null`) y
    vuelve a la lista de "Pendientes"; dos toques rápidos en "Deshacer" producen una sola llamada a
    `reopen_debt`. Pasados los 5 segundos, o al cambiar de filtro, el aviso ya no está.
  - CA-5: Si la llamada falla, aparece "No se pudo actualizar la deuda" con el motivo y la fila sigue
    pendiente. Si la deuda ya había sido saldada desde otra pestaña, aparece el aviso con "La deuda
    ya está saldada" y la lista se actualiza mostrándola saldada.
  - CA-6: Directo contra la RPC (C6): `settle_debt` sobre una deuda ya saldada responde "La deuda ya
    está saldada"; con un id inexistente o de otro usuario, "La deuda no existe"; con el rol `anon`,
    `42501`. Ninguno cambia filas.
  - CA-7: Un `PATCH /rest/v1/debts?id=eq.<id>` con `{"status":"settled"}` directo responde `42501` y
    no cambia la fila (ADR-037 §1).
  - CA-8: Saldar una deuda vinculada no cambia el neto del Resumen (US-30 · CA-2) y sí baja "Te deben"
    (US-37 · CA-5).
- **Trazabilidad:** FR-18 · I9 · C6 · C7 · ADR-037 · supuesto 5

##### US-40: Volver a pendiente una deuda saldada por error · [#230](https://github.com/Joaconz/Biyu/issues/230)

- **Objetivo:** Como usuario, quiero poder revertir un "saldada" marcado por error, para corregirme sin
  borrar el registro.
- **Pantalla y estructura:** **Deudas** (`/debts`, US-38). Cada fila **saldada** (filtros "Saldadas"
  y "Todas") tiene el botón "Volver a pendiente" en lugar de "Marcar saldada". Sin diálogo de
  confirmación: es reversible con "Marcar saldada".
- **Elementos:**

  | Elemento | Texto exacto | `data-testid` |
  |---|---|---|
  | Botón de la fila | "Volver a pendiente"; mientras espera, "Actualizando…" y deshabilitado | `debts-item-reopen` |
  | Aviso de éxito | "La deuda con Sofía volvió a pendiente" | `debts-reopened` |
  | Aviso de error | "No se pudo actualizar la deuda", con el motivo del servidor | `debts-update-error` |

- **Transiciones** (ADR-037 §3): `settled → pending` con `reopen_debt`, `settled_at = null`. Reabrir
  una pendiente es inválido ("La deuda ya está pendiente"). No existe otra transición.
- **Estados:** cargando: "Actualizando…" en el botón de esa fila. Error: aviso de error y la fila no
  cambia; si el motivo es "La deuda ya está pendiente" o "La deuda no existe", además se vuelven a
  pedir la lista y los totales. Vacío: si era la última saldada con el filtro "Saldadas", aparece el
  estado vacío de US-38.
- **Criterios de aceptación:**
  - CA-1: Con "Saldadas", un toque en "Volver a pendiente" de Sofía hace exactamente una llamada a
    `POST /rest/v1/rpc/reopen_debt`, la fila sale de la lista, aparece "La deuda con Sofía volvió a
    pendiente", y en la base queda `status = 'pending'` y `settled_at = null`.
  - CA-2: La deuda conserva su `id`, persona, monto, moneda, `fx_rate`, fecha, nota y vínculo; no se
    crea otra fila ni se borra la existente.
  - CA-3: Con "Todas", la fila queda con "Pendiente" y el botón pasa a "Marcar saldada"; los totales
    de US-37 vuelven a sumarla.
  - CA-4: Directo contra la RPC: `reopen_debt` sobre una pendiente responde "La deuda ya está
    pendiente"; con un id inexistente o de otro usuario, "La deuda no existe"; con `anon`, `42501`.
  - CA-5: Saldar y volver a pendiente la misma deuda tres veces seguidas termina pendiente, con
    `settled_at = null`, y sin filas nuevas.
  - CA-6: Si la llamada falla, aparece "No se pudo actualizar la deuda" y la fila sigue saldada.
- **Trazabilidad:** FR-18 · I9 · C6 · C10 (no se borra el registro) · ADR-037

##### US-41: La deuda de un gasto no puede superar el gasto · [#231](https://github.com/Joaconz/Biyu/issues/231)

- **Objetivo:** Como usuario, quiero que el monto de una deuda vinculada no pueda superar el gasto de
  origen, para no registrar imposibles.
- **Pantalla y estructura:** **Registrar**, paso 3, sección "Gasto compartido" (US-34). No agrega
  elementos: agrega una regla al campo "¿Cuánto te debe?" (`transaction-form-shared-amount`) y su
  error (`transaction-form-shared-amount-error`).
- **Regla:** monto adeudado ≤ monto del gasto, comparados en la **moneda del gasto** (la deuda siempre
  tiene la misma, ADR-036). Igual se acepta. El cliente lo valida como UX; la fuente de verdad es
  `create_transaction` (C6), y el trigger `check_debt_rule` (I7) queda como red de contención.
- **Mensajes exactos:**
  - Cliente: "No puede superar el monto del gasto ($10.000,00)", con el monto del gasto en su moneda
    (`US$100,00` si es en dólares).
  - Servidor: "I7: la deuda no puede superar el monto del gasto" (aviso "No se pudo guardar").
- **Estados:** los de US-34.
- **Criterios de aceptación** (valores límite del plan de testing: gasto − 0,01, igual, + 0,01):
  - CA-1: Gasto de $10.000,00 con deuda de `9999,99` se guarda.
  - CA-2: Gasto de $10.000,00 con deuda de `10000` se guarda; la deuda tiene `amount = 10000.00`.
  - CA-3: Gasto de $10.000,00 con deuda de `10000,01` muestra "No puede superar el monto del gasto
    ($10.000,00)", "Guardar gasto" queda deshabilitado y no se emite ninguna escritura.
  - CA-4: Gasto de $10.000,00 con deuda de `15000` (sad path de la spec): mismo mensaje; no se crea ni
    la transacción ni la deuda.
  - CA-5: Directo contra la RPC, `p_amount = 10000` con `p_shared_amount = 10000.01` se rechaza con
    "I7: la deuda no puede superar el monto del gasto" y no deja filas nuevas en `transactions`,
    `ledger_entries` ni `debts` (escenario BDD "la deuda no puede superar el gasto"). **Modificado por
    US-82 (ADR-040):** el pedido manda `"p_shared_amounts": [10000.01]`.
  - CA-6: Gasto de US$100,01 a TC 1250,5555: deuda `100,01` se guarda y su `amount_ars` es igual al
    del gasto (`125068.06`); `100,02` muestra "No puede superar el monto del gasto (US$100,01)".
  - CA-7: Con la deuda ya cargada, volver al paso 1 y bajar el monto del gasto por debajo de la deuda
    hace que, de vuelta en el paso 3, se vea el error y "Guardar gasto" esté deshabilitado; la deuda
    no se ajusta sola.
  - CA-8: En pgTAP, insertar como dueño de la tabla una deuda vinculada que, sumada a las existentes,
    supere el `amount_ars` del gasto, falla con `code = '23514'` y el mensaje
    "I7: la suma de las deudas supera el monto de la transacción" (trigger `check_debt_rule`).
- **Trazabilidad:** FR-18 · I7 · C4 · C6 · ADR-036 · sad path "deuda mayor que el gasto" ·
  `docs/07-plan-de-testing.md` (valores límite de deuda)

##### US-79: Filtrar las deudas por lo que me deben o lo que debo · [#238](https://github.com/Joaconz/Biyu/issues/238)

- **Objetivo:** Como usuario, quiero ver por separado lo que me deben y lo que debo, para saber qué
  tengo que cobrar y qué tengo que pagar sin mezclarlos.
- **Pantalla y estructura:** **Deudas** (`/debts`, US-38). Agrega un segundo filtro, por dirección,
  debajo del filtro por estado y antes de la lista. Nada más de la pantalla cambia: la tarjeta de
  totales (US-37) sigue igual y no depende de ningún filtro.
- **Filtro por dirección** (`debts-direction-filter`, `role="radiogroup"`, mismo aspecto que el de
  estado):

  | Opción (texto exacto) | `?direction=` | `data-testid` |
  |---|---|---|
  | "Todas" | `all` | `debts-direction-filter-all` |
  | "Te deben" | `owed_to_me` | `debts-direction-filter-owed-to-me` |
  | "Debés" | `i_owe` | `debts-direction-filter-i-owe` |

- **Filtro y URL (C11):** el valor vive en `?direction=`, junto a `?status=` (US-38). Sin parámetro o
  con un valor que no sea `all`, `owed_to_me` ni `i_owe`, se comporta como "Todas". Los dos filtros se
  combinan (Y): `/debts?status=pending&direction=i_owe` lista las pendientes que debés. Cambiar uno
  conserva el otro en la URL. Tocar una opción cambia la URL sin recargar y no vuelve a pedir datos.
- **Orden:** el de US-38 según el filtro de estado; el de dirección solo saca filas.
- **Estados:** los de US-38. Con "Todas" en dirección, los mensajes vacíos son los de US-38. Con otra
  dirección, si no queda ninguna fila:

  | Estado \ Dirección | "Te deben" | "Debés" |
  |---|---|---|
  | Pendientes | "Nadie te debe nada por ahora." | "No debés nada por ahora." |
  | Saldadas | "Todavía no te saldaron ninguna deuda." | "Todavía no saldaste ninguna deuda tuya." |
  | Todas | "No cargaste deudas a tu favor." | "No cargaste deudas que debas." |

  Van en `debts-empty`. "Cargar una deuda" (`debts-empty-new`) aparece en los mismos estados que en
  US-38 (Pendientes y Todas) y lleva a `/debts/new`.
- **Criterios de aceptación:**
  - CA-1: `/debts` sin parámetros muestra "Todas" seleccionado en dirección (`aria-checked="true"`) y
    filas de las dos direcciones.
  - CA-2: Tocar "Te deben" cambia la URL a `?direction=owed_to_me` (conservando `status` si estaba) y
    muestra solo filas con "Te debe"; "Debés", a `?direction=i_owe`, solo filas con "Le debés".
  - CA-3: Abrir o recargar `/debts?status=settled&direction=i_owe` muestra "Saldadas" y "Debés"
    seleccionados y solo deudas saldadas que debés.
  - CA-4: `/debts?direction=xyz` muestra "Todas" seleccionado y filas de las dos direcciones; la URL
    queda como está hasta que se toca otra opción, que reemplaza el valor.
  - CA-5: Con el filtro de dirección en "Debés", tocar "Saldadas" en el de estado lleva a
    `?direction=i_owe&status=settled` (el orden de los parámetros no importa).
  - CA-6: Cada combinación vacía muestra su mensaje exacto de la tabla; "Cargar una deuda" aparece
    solo con Pendientes o Todas en estado.
  - CA-7: Cambiar el filtro de dirección no cambia "Te deben", "Debés" ni el neto de la tarjeta de
    totales (US-37).
  - CA-8: Cambiar de opción no hace ningún pedido nuevo a la base (la lista ya está cargada).
  - CA-9: Todos los elementos interactivos del filtro tienen su `data-testid`.
- **Trazabilidad:** FR-18 · C11 · US-37 · US-38 · ADR-037

##### US-82: Compartir un gasto con varias personas · [#270](https://github.com/Joaconz/Biyu/issues/270)

- **Objetivo:** Como usuario, quiero repartir un gasto entre varias personas, cada una con lo que me
  debe, para no tener que cargar una deuda suelta por cada una.
- **Decisión:** [ADR-040](../docs/adr/040-gasto-compartido-con-varias-personas.md), que modifica
  ADR-036. Sin mock propio: reusa los campos de US-34 (`deudas-registrar-compartido.html`).
- **Pantalla y estructura:** **Registrar**, paso 3, sección "Gasto compartido" (US-34). Con el
  interruptor encendido, la sección muestra una **lista de personas**:
  - Cada fila (`transaction-form-shared-row`, con `data-index="1"`, `"2"`…) tiene "¿Con quién?" y
    "¿Cuánto te debe?" con los mismos campos, reglas, mensajes y `data-testid` de US-34, y sus errores
    debajo. Como las filas de Movimientos, cada `data-testid` se repite en cada fila y se distingue por
    el `data-index` de la fila.
  - A la derecha de cada fila, el botón "Quitar" (ícono, `aria-label="Quitar a <persona>"`, o "Quitar
    persona <i>" si el nombre está vacío). Con una sola fila no se muestra: para no compartir, se apaga
    el interruptor.
  - Quitar una fila conserva los valores de las demás y renumera `data-index` de 1 en adelante.
  - Al encender el interruptor hay una fila vacía. Al apagarlo y volver a encenderlo, vuelve a haber
    una sola fila vacía.
- **Elementos nuevos**, debajo de la lista:

  | Elemento | Tipo | Texto exacto | Qué hace | `data-testid` |
  |---|---|---|---|---|
  | Agregar | botón secundario | "Agregar persona" | Agrega una fila vacía al final y lleva el foco a su "¿Con quién?". Deshabilitado con 10 filas | `transaction-form-shared-add` |
  | Tope | texto | "Podés compartir un gasto con hasta 10 personas" | Solo con 10 filas | `transaction-form-shared-limit` |
  | Dividir | botón secundario | "Dividir en partes iguales" | Completa el monto de cada fila con la parte de cada uno (regla de abajo) y pisa lo que hubiera escrito | `transaction-form-shared-split` |
  | Quitar | botón (ícono) | — | Ver arriba | `transaction-form-shared-remove` |
  | Error de la suma | texto (`role="alert"`) | Ver tabla de errores | Con dos o más filas | `transaction-form-shared-total-error` |

- **"Dividir en partes iguales"** (ADR-040 §4):
  - Con n filas, el gasto se divide en n + 1 partes: las personas y vos. A cada persona le toca el
    monto del gasto ÷ (n + 1), truncado a 2 decimales, y tu parte absorbe el resto. En la moneda del
    gasto. La función vive en `src/domain/` (C1).
  - El monto se escribe en el campo con coma decimal, sin separador de miles y sin ",00" si es entero:
    `33333,33`, `30000`, `0,5`.
  - Está habilitado siempre que el interruptor esté encendido, aunque haya personas vacías. Solo
    completa los montos.
  - Si la parte da menos de 0,01, completa `0` y cada fila muestra "El monto debe ser mayor a cero".
  - Si en US$ la parte da menos de $0,01 en pesos, cada fila muestra el error de US-34 para ese caso.
- **Errores nuevos (cliente, exactos):**

  | Condición | Mensaje | Dónde |
  |---|---|---|
  | Persona igual a la de una fila anterior, después del recorte y sin distinguir mayúsculas | "Ya agregaste a <persona de la fila anterior>" | Error de persona de la fila repetida |
  | Dos o más filas, ninguna con error y la suma mayor al gasto | "Entre todos no pueden deber más que el gasto (<monto del gasto>)" | `transaction-form-shared-total-error` |
  | Gasto en US$, dos o más filas sin error, suma en dólares que no supera el gasto, pero la suma de cada monto × TC redondeado a 2 decimales supera el gasto en pesos (ADR-040 §2, punto 8) | "En pesos, la suma supera el gasto por redondeo. Bajá un centavo alguna deuda." | `transaction-form-shared-total-error` |

  - El tope de US-41 sigue valiendo **por fila**, con cualquier cantidad de filas: un monto mayor al
    gasto muestra en su fila "No puede superar el monto del gasto (…)", y mientras haya un error en
    alguna fila no se evalúa la suma.
  - "Guardar gasto" se deshabilita con cualquier error de cualquier fila (convenciones).
- **Resumen** (`transaction-form-shared-summary`, cuando todas las filas son válidas y no hay error de
  la suma). Con una persona,
  el texto de US-34. Con dos o más: "Te van a deber <suma> entre <n> personas · Tu parte: <gasto −
  suma>". Ejemplo: "Te van a deber $80.000,00 entre 2 personas · Tu parte: $40.000,00".
- **Varias personas en un texto** (ADR-040 §5): los nombres van en orden alfabético, sin distinguir
  mayúsculas ni tildes, separados por coma y con "y" antes del último.
  - Aviso de éxito ("Gasto guardado"): con una persona, el texto de US-34; con dos o más, "<nombres> te
    deben <suma>". Ejemplo: "Juan y Sofía te deben $80.000,00".
  - Etiqueta de Movimientos y de Últimos movimientos (US-35): "Compartido con Juan y Sofía" con dos
    personas, y "Compartido con <primer nombre> y <n − 1> más" con tres o más ("Compartido con Ana y
    2 más").
  - Diálogo de borrado (US-35): con dos o más personas, "También dejan de contar las deudas con
    <nombres> por <suma> en total." Ejemplo: "También dejan de contar las deudas con Ana, Juan y Sofía
    por $90.000,00 en total."
- **Mensajes del servidor** (`create_transaction`, ADR-040 §2): además de los de US-34 y US-41, "Un
  gasto compartido necesita una persona y un monto por cada deuda", "Un gasto compartido necesita al
  menos una persona", "Un gasto se comparte con hasta 10 personas", "Cada persona puede aparecer una
  sola vez" e "I7: la suma de las deudas no puede superar el monto del gasto". En la UI aparecen como
  descripción del aviso "No se pudo guardar".
- **Estados:** los de US-34.
- **Criterios de aceptación:**
  - CA-1: Al encender "Gasto compartido" hay una fila vacía, sin "Quitar". "Agregar persona" agrega la
    fila 2 vacía con el foco en su "¿Con quién?", y "Quitar" aparece en las dos.
  - CA-2: Gasto de $120.000,00 ARS en 1 cuota con "Sofía" `40000` y "Juan" `40000`: se crean una
    transacción y dos deudas `owed_to_me`, `pending`, de `40000.00`, con `transaction_id` igual al de
    esa transacción. Se hace una sola llamada a `create_transaction` y ninguna a `/rest/v1/debts`
    (C4). El aviso dice "Juan y Sofía te deben $80.000,00".
  - CA-3: Con 2 filas y un gasto de $100.000,00, "Dividir en partes iguales" completa `33333,33` en las
    dos y el resumen dice "Te van a deber $66.666,66 entre 2 personas · Tu parte: $33.333,34". Con 3
    filas y $120.000,00, completa `30000` en las tres y "Tu parte: $30.000,00". Con un gasto de
    US$100,00 y 2 filas, completa `33,33`. Si las filas tenían montos escritos, los reemplaza.
  - CA-4 (valores límite de la suma): con un gasto de $120.000,00 y 2 filas, `60000` + `60000` se guarda
    ("Tu parte: $0,00"); `60000` + `60000,01` muestra "Entre todos no pueden deber más que el gasto
    ($120.000,00)", deshabilita "Guardar gasto" y no emite ninguna escritura.
  - CA-5: Con 10 filas, "Agregar persona" está deshabilitado y se ve "Podés compartir un gasto con hasta
    10 personas". Guardar con 10 filas válidas crea 10 deudas.
  - CA-6: "Sofía" en la fila 1 y "  sofía " en la fila 2 muestran en la fila 2 "Ya agregaste a Sofía" y
    deshabilitan "Guardar gasto".
  - CA-7: Con 3 filas cargadas, quitar la 2 deja las filas 1 y 3 con sus valores, ahora con
    `data-index` 1 y 2.
  - CA-8: Una fila con la persona vacía deshabilita "Guardar gasto" aunque las demás estén bien.
  - CA-9: Apagar el interruptor con 3 filas cargadas y guardar crea el gasto sin deudas. Al volver a
    encenderlo hay una sola fila vacía.
  - CA-10: Un gasto compartido con Ana, Juan y Sofía muestra "Compartido con Ana y 2 más" en cada
    cuota de Movimientos y en Últimos movimientos. Uno con Juan y Sofía muestra "Compartido con Juan y
    Sofía".
  - CA-11: Al tocar la papelera del gasto compartido con Ana, Juan y Sofía por $30.000,00 cada uno, el
    diálogo dice "También dejan de contar las deudas con Ana, Juan y Sofía por $90.000,00 en total."
  - CA-12: En `/debts?status=all` hay una fila por persona, cada una con su línea de origen (US-35),
    en el orden Ana, Juan, Sofía: las tres tienen la misma fecha y el mismo `created_at`, y se
    desempatan por persona (ADR-040 §5; **modifica el orden de US-38**). "Te deben" (US-37) y el neto
    del Resumen (US-30) suman las tres.
  - CA-13: Eliminar ese gasto saca las tres deudas de Deudas y de los totales; restaurarlo las devuelve
    con su estado (US-35 · CA-5 y CA-6).
  - CA-14 (C6, directo contra la RPC): cada uno de estos pedidos se rechaza con HTTP 400,
    `code = '23514'` y el mensaje exacto indicado, y no crea filas en `transactions`,
    `ledger_entries` ni `debts`:
    - solo `p_shared_persons` → "Un gasto compartido necesita una persona y un monto por cada deuda";
    - 2 personas y 1 monto → el mismo mensaje;
    - `[]` en los dos → "Un gasto compartido necesita al menos una persona";
    - 11 personas → "Un gasto se comparte con hasta 10 personas";
    - "Sofía" y "SOFÍA" → "Cada persona puede aparecer una sola vez";
    - gasto de `120000` con montos `60000` y `60000.01` (literal JSON) → "I7: la suma de las deudas no
      puede superar el monto del gasto";
    - gasto de US$3,00 a TC `1000.005` con tres deudas de `1` → "I7: en pesos, la suma de las deudas
      supera el gasto por redondeo";
    - segunda persona `"   "` → "Ingresá con quién compartiste el gasto", sin crear ni el gasto ni la
      primera deuda (C4);
    - `p_type = 'income'` con deudas → "Un ingreso no se puede compartir";
    - `p_type = 'income'` con 11 personas → "Un ingreso no se puede compartir" (primer error del orden
      de ADR-040 §2).

    Con el rol `anon`, un pedido válido responde `42501`.
  - CA-15: Con una sola persona, US-34 y US-41 se cumplen igual: mismos textos, mensajes y
    `data-testid`. Cambia solo la forma del pedido directo: se manda `"p_shared_persons": ["Sofía"],
    "p_shared_amounts": [60000]` en lugar de `p_shared_person` y `p_shared_amount`. Esto modifica
    US-34 · CA-8 y US-41 · CA-5.
  - CA-16: Con 2 filas cargadas, volver al paso 1 y cambiar la moneda vacía los montos de las dos
    filas y conserva las personas (como US-34 · CA-12).
  - CA-17: Con 2 filas cargadas, pasar a Ingreso y volver a Gasto deja el interruptor apagado.
    Encenderlo muestra una sola fila vacía (como US-34 · CA-10).
  - CA-18: Con "Sofía" `40000` y "Juan" `40000` sobre un gasto de $120.000,00, volver al paso 1 y bajar
    el gasto a $70.000,00 muestra, de vuelta en el paso 3, "Entre todos no pueden deber más que el
    gasto ($70.000,00)". Con $30.000,00, muestra en cada fila "No puede superar el monto del gasto
    ($30.000,00)" y no muestra el error de la suma. Las deudas no se ajustan solas (como US-41 · CA-7).
  - CA-19: Con 2 filas, "Sofía" `150000` sobre un gasto de $120.000,00 muestra en esa fila "No puede
    superar el monto del gasto ($120.000,00)", y `transaction-form-shared-total-error` no está.
  - CA-20: Con un gasto de $0,02 y 2 filas, "Dividir en partes iguales" completa `0` en las dos y cada
    una muestra "El monto debe ser mayor a cero".
  - CA-21: Si US-70 ya está implementada, el movimiento pendiente de un gasto con varias personas
    guarda todas las filas, y "Reintentar" crea el gasto y todas sus deudas una sola vez (ADR-034,
    ADR-040 §6).
  - CA-22: Todos los elementos nuevos tienen su `data-testid`.
- **Trazabilidad:** FR-18 · I7 · C3 · C4 · C6 · ADR-036 · ADR-040 · US-34 · US-35 · US-37 · US-41 ·
  US-30

##### US-83: Las deudas sueltas mueven el balance del mes · [#271](https://github.com/Joaconz/Biyu/issues/271)

- **Objetivo:** Como usuario, quiero que lo que presto o me prestan sin un gasto de por medio cambie el
  balance del mes, para que el balance muestre la plata que de verdad salió y entró.
- **Decisión:** [ADR-041](../docs/adr/041-deudas-sueltas-en-el-balance.md), que modifica ADR-037 §6
  y US-36 · CA-12. Sin mock propio: agrega una línea a la tarjeta "Balance".
- **Pantalla y estructura:** **Resumen** (`/dashboard?period=AAAA-MM`), tarjeta **"Balance"**
  (`dashboard-balance`, US-29):
  - Cambia el número (`dashboard-total-balance`) y, con él, su etiqueta "Superávit", "Déficit" o "En
    cero" (`dashboard-balance-badge`).
  - Debajo del número se agrega una línea, cuando el período tiene al menos un evento de una deuda
    suelta: "Incluye deudas sueltas: <movimiento>" (`dashboard-balance-loose-debts`). El movimiento va
    con signo menos si es negativo y sin signo si es positivo o cero: "-$20.000,00", "$50.000,00",
    "$0,00".
  - Nada más de la pantalla cambia.
- **Regla** (ADR-041 §2): balance = ingresos − gastos + movimiento de deudas sueltas del período. Cada
  evento suma su `amount_ars` (congelado, C5) en el período del día en que pasó, en hora de
  Argentina:

  | Evento | Día | "Me deben" | "Debo" |
  |---|---|---|---|
  | Alta (US-36) | `incurred_on` | − monto | + monto |
  | Saldada (US-39) | `settled_at` | + monto | − monto |

  - Reabrir (US-40) borra el evento "saldada".
  - Las deudas vinculadas a un gasto (US-34) no generan eventos.
  - El cálculo vive en `src/domain/` o en una consulta SQL, no en el componente (C1).
- **Mes solo con deudas sueltas:** si el período no tiene datos según US-33 (ninguna imputación de
  una transacción activa) pero sí eventos, el Resumen no muestra el estado vacío (`dashboard-empty`).
  Muestra Gastado $0,00, Ingresos $0,00 y el balance con la línea, y las secciones de categorías,
  cuentas y últimos movimientos con sus estados vacíos. Sin imputaciones ni eventos, sigue el estado
  vacío de US-33.
- **Estados:** los eventos se leen en la misma carga que el resto del Resumen. Si falla, se ve
  `dashboard-error` y ningún número a medias.
- **Criterios de aceptación.** H es el mes de hoy en Argentina cuando se ejecuta el caso y H−1 el mes
  anterior. "Una fecha de H" es cualquier día de H hasta hoy. Saldar (US-39) siempre ocurre hoy, en H.
  Cada criterio arranca con un usuario sin movimientos.
  - CA-1: Con un ingreso de $100.000,00 y una deuda suelta "Me deben" a Juan por $20.000,00, los dos
    con fecha de H, el Resumen de H muestra Ingresos $100.000,00, Gastado $0,00, Balance $80.000,00 con
    "Superávit" e "Incluye deudas sueltas: -$20.000,00".
  - CA-2: Con un ingreso de $100.000,00 y una deuda suelta "Debo" a Marta por $50.000,00, los dos con
    fecha de H, el balance es $150.000,00 y la línea dice "Incluye deudas sueltas: $50.000,00".
  - CA-3: Saldar la deuda de CA-1 deja el balance de H en $100.000,00 y la línea en "Incluye deudas
    sueltas: $0,00".
  - CA-4: Una deuda suelta "Me deben" de $20.000,00 con fecha de H−1, saldada hoy, resta $20.000,00 en
    el balance de H−1 y suma $20.000,00 en el de H.
  - CA-5: Reabrir (US-40) la deuda de CA-4 saca el evento de H: sin otros eventos, la línea desaparece
    y el balance de H vuelve a ser ingresos − gastos. H−1 no cambia.
  - CA-6: Una deuda suelta "Debo" de $50.000,00 con fecha de H−1, saldada hoy, suma $50.000,00 en H−1 y
    resta $50.000,00 en H.
  - CA-7: Una deuda suelta "Me deben" de US$40,00 a TC 1250 con fecha de H−1 resta $50.000,00 en H−1.
    Si se cambia el tipo de cambio de referencia de H a 1500 (US-20) y después se salda, suma
    $50.000,00 en H, no $60.000,00 (C5).
  - CA-8: Un gasto compartido (US-34) de $120.000,00 con una deuda de $60.000,00, con fecha de H, deja el
    balance de H en ingresos − gastos y no muestra la línea, ni antes ni después de saldar la deuda.
  - CA-9: Un mes sin transacciones con solo la deuda de CA-1 (sin el ingreso) muestra el Resumen, no
    `dashboard-empty`: Gastado $0,00, Ingresos $0,00, Balance -$20.000,00 con "Déficit" y la línea.
  - CA-10: En ningún caso anterior la deuda suelta cambia Gastado (`dashboard-total-expenses`),
    Ingresos (`dashboard-total-income`), el neto de reembolsos (US-30) ni el desglose por categoría y
    por cuenta. Los totales de Deudas siguen la regla de US-37, sin cambios.
  - CA-11: Abrir directamente `/dashboard?period=<H−1>` muestra el balance de H−1 con sus eventos
    (C11).
  - CA-12: En la prueba de dominio del cálculo, con hoy = 15/11/2026, una deuda saldada el 31/10/2026
    a las 22:30 de Argentina (01/11/2026 01:30 UTC) cuenta en octubre 2026 (ADR-021).
  - CA-13: Si falla la lectura de las deudas, se ve `dashboard-error` y no se muestra ningún número.
  - CA-14: `dashboard-balance-loose-debts` está en el DOM solo cuando el período tiene eventos.
- **Modifica:** US-29 · CA-1 (el balance es ingresos − gastos + movimiento de deudas sueltas), US-33 ·
  CA-1 (un mes con eventos y sin transacciones no muestra el estado vacío; CP-DAS-010 sigue valiendo
  para un mes sin nada) y US-36 · CA-12 (una deuda suelta sí cambia el balance). US-30 · CA-4 sigue
  igual.
- **Trazabilidad:** FR-18 · FR-20 · US-29 · US-36 · US-39 · US-40 · C1 · C5 · C7 · C11 · ADR-006 ·
  ADR-021 · ADR-037 · ADR-041

---

### Supuestos de este documento

1. Las historias, sus objetivos y los escenarios BDD citados salen de `docs/02-behavior-spec.md`; no se
   agregaron historias ni IDs nuevos, salvo US-79 (filtro por dirección), que pidió el producto el
   2026-10-07 y no tiene mock propio: reusa el control del filtro por estado, y US-82 y US-83,
   que salieron de los pendientes de producto del 2026-10-08 ([#270](https://github.com/Joaconz/Biyu/issues/270) y
   [#271](https://github.com/Joaconz/Biyu/issues/271)). Los textos de pantalla, los `data-testid` y los mensajes son
   propuesta de esta especificación y se congelan en el issue de cada historia.
2. FR-19 (`pre-entrega.md`) dice que lo pendiente "no se computa como gasto propio ... hasta que se
   marca como cobrado". Se sigue el ajuste ya registrado en `08-trazabilidad.md`, el supuesto 4 y
   ADR-006: el número principal es el bruto y el neto de US-30 resta pendientes **y** saldadas.
3. No hay edición ni borrado de deudas en V2 (ADR-037, consecuencias). Ninguna historia lo pide.
4. La entrada "Deudas" de la barra inferior (#172) y el feedback de guardado con reintento
   conservando lo cargado en Registrar son de la feature "Navegación e interfaz", que aún no tiene
   historias ni IDs; esta especificación no las redefine.
5. La edición de transacciones (FR-07) es de V2 (US-84, ADR-043), que rechaza editar un gasto con deuda
   vinculada. Cuando se levante esa restricción, su historia tiene que definir qué pasa con la deuda vinculada al bajar el monto del gasto
   por debajo de la deuda, cambiar la moneda, pasarlo a ingreso o cambiarlo de mes; hoy el trigger
   de I7 rechazaría los dos primeros casos.
6. `08-trazabilidad.md` asigna FR-18 a "US-34 a US-36, US-41". Esta especificación traza también
   US-37 a US-40 a FR-18 (son la otra mitad de "el sistema lleva el saldo"); la tabla se actualiza
   al congelar las historias.
7. Montos, personas y fechas de los ejemplos son ficticios (C14).

---

## Parte 3 · Suscripciones

_Fuente: `entrega-2/historias/suscripciones.md`._

**Testing de Aplicaciones · Proyecto Integrador** · Épica: Suscripciones ([#17](https://github.com/Joaconz/Biyu/issues/17)) ·
Milestone V2 · Versión del documento: 2026-10-06

### Cómo leer este documento

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

#### Decisiones que estas historias dan por tomadas

| ADR | Qué decide | Historias que dependen |
|---|---|---|
| [ADR-017](../docs/adr/017-suscripciones-por-puesta-al-dia-idempotente.md) | Generación por puesta al día idempotente, al entrar | US-53, US-55, US-60 |
| [ADR-030](../docs/adr/030-operaciones-de-suscripcion-por-rpc.md) | Toda escritura sobre `subscriptions` es una RPC con el hoy del servidor, que pone al día esa suscripción; cada suscripción se genera aislada y una falla no frena a las demás ni a la operación | US-52, US-53, US-56 a US-59 |
| [ADR-031](../docs/adr/031-puesta-al-dia-no-bloquea-la-app.md) | Si la puesta al día falla o tarda más de 8 s, la app se muestra con una franja y "Reintentar"; corre al cargar y al guardar un tipo de cambio; "bloqueada" se deriva; el cliente usa el hoy argentino | US-53, US-62, US-75 |
| [ADR-032](../docs/adr/032-alcance-del-alta-y-la-edicion-de-suscripciones.md) | Rangos del alta (nombre de 60, inicio de −24 a +12 meses), qué campos se editan y cómo se extiende una terminada | US-52, US-59, US-75 |
| [ADR-033](../docs/adr/033-total-comprometido-en-suscripciones.md) | Qué suma el total comprometido y con qué tipo de cambio | US-63 |

#### Resumen

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
| US-60 | Borrar un mes puntual sin que vuelva | Movimientos (diálogo de borrado), Detalle ("Gastos cargados") |
| US-61 | Reconocer qué movimientos vienen de una suscripción | Movimientos, Resumen |
| US-62 | Avisar cuando falta el tipo de cambio de una suscripción en USD | Suscripciones, Detalle |
| US-63 | Ver el total mensual comprometido | Suscripciones |
| US-75 | Ver el calendario antes de guardar | Nueva suscripción |

---

### Historias de usuario

##### US-52: Dar de alta una suscripción · [#210](https://github.com/Joaconz/Biyu/issues/210)

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
  4. "Gastos cargados" (US-60).

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

##### US-53: Los meses vencidos se cargan solos al entrar · [#211](https://github.com/Joaconz/Biyu/issues/211)

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

##### US-54: El día de cobro que no existe se cobra el último día del mes · [#212](https://github.com/Joaconz/Biyu/issues/212)

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

##### US-55: El mes corriente aparece recién el día del cobro · [#213](https://github.com/Joaconz/Biyu/issues/213)

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

##### US-56: Pausar una suscripción · [#214](https://github.com/Joaconz/Biyu/issues/214)

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

##### US-57: Reanudar sin cargar los meses pausados · [#215](https://github.com/Joaconz/Biyu/issues/215)

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

##### US-58: Cancelar sin perder el historial · [#216](https://github.com/Joaconz/Biyu/issues/216)

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

##### US-59: Editar el monto sin cambiar los meses registrados · [#217](https://github.com/Joaconz/Biyu/issues/217)

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

##### US-60: Borrar un mes puntual sin que vuelva · [#218](https://github.com/Joaconz/Biyu/issues/218)

- **Objetivo:** Como usuario, quiero poder borrar una ocurrencia puntual (un mes que no me cobraron) sin
  que el sistema me la vuelva a crear.
- **Pantallas:**
  - **Movimientos** (`/transactions`): el mismo botón de papelera y el mismo diálogo de US-65
    (`delete-transaction-dialog`). Si la transacción vino de una suscripción, el diálogo suma una línea
    (`delete-transaction-subscription-note`): "Este gasto lo cargó la suscripción Netflix. Si lo eliminás,
    no se vuelve a cargar para octubre 2026."
  - **Detalle**, "Gastos cargados" (se describe en US-61, pero se implementa con esta historia: CA-4 y CA-5
    la necesitan; ver "Supuestos y pendientes" §7): la fila del mes borrado sigue apareciendo, con la marca
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

##### US-61: Ver qué movimientos vienen de una suscripción · [#219](https://github.com/Joaconz/Biyu/issues/219)

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

##### US-62: Aviso de suscripción en USD sin tipo de cambio · [#220](https://github.com/Joaconz/Biyu/issues/220)

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

##### US-63: Total mensual comprometido en suscripciones · [#221](https://github.com/Joaconz/Biyu/issues/221)

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

##### US-75: Vista previa del calendario antes de dar de alta · [#222](https://github.com/Joaconz/Biyu/issues/222)

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

### Supuestos y pendientes

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
7. **"Gastos cargados" se implementó con US-60, no con US-61.** US-60 CA-4 y CA-5 muestran la marca
   "Eliminado" en esa sección, así que no se podían cumplir sin ella ([#265](https://github.com/Joaconz/Biyu/pull/265)).
   La especificación de la sección sigue en US-61 y su CA-5 se verifica igual. US-61
   ([#266](https://github.com/Joaconz/Biyu/pull/266)) agregó solo la marca de Movimientos y el Resumen.

---

## Parte 4 · Exportar CSV

_Fuente: `entrega-2/historias/export-csv.md`._

Épica [#19](https://github.com/Joaconz/Biyu/issues/19) · Milestone V2 · Nivel 1 del alcance
(`entrega-2/README.md`). Formato de `entrega-1/01-historias-de-usuario.md`: cada criterio `CA-k` se
cita desde los casos como `US-47 · CA-k`. Las decisiones de formato y alcance que no se deducen
del spec están en [ADR-029](../docs/adr/029-formato-y-alcance-del-export-csv.md).

---

##### US-47: Exportar mis transacciones de un mes o de un año a CSV · [#201](https://github.com/Joaconz/Biyu/issues/201)

- **Objetivo:** Como usuario, quiero exportar a CSV mis transacciones de un mes o de un año, para
  tener mis datos afuera de la app.

- **Pantallas y campos:**
  - Pantalla **Movimientos** (`/transactions?period=AAAA-MM`). En el encabezado, junto al selector
    de mes, se agrega el botón **"Exportar"**, con ícono de descarga. La pantalla no cambia en lo
    demás. Composición según ADR-023: sin sombras, hoja de papel con filetes y el toast de la app.
  - El período a exportar es el mes que muestra el selector de mes de la pantalla
    (`transactions-period`, atributo `data-period`), que sale del `?period` de la URL (C11). Sin
    `?period`, o con uno inválido (ej.: `?period=2026-13`), la pantalla ya usa el mes actual y el
    export también. No hay un selector de período aparte.
  - **Ojo: Movimientos y el export no listan lo mismo.** Movimientos muestra las imputaciones del
    mes, incluidas las cuotas de compras anteriores. El export lista las transacciones con
    **fecha** en el período. Un mes que solo tiene cuotas de compras de meses anteriores muestra
    filas en Movimientos y da un export vacío.
  - **El período se fija al abrir la hoja.** Si mientras la hoja está abierta cambia la URL (Atrás o
    Adelante del navegador, o se sale de la pantalla), la hoja se cierra. Si estaba exportando, la
    exportación se cancela y no se descarga nada.
  - Tocar "Exportar" abre la hoja **"Exportar movimientos"**, con:
    - Dos opciones excluyentes (radio), y la primera viene elegida:
      - **"Solo <mes año>"**, por ejemplo "Solo septiembre 2026": el mes del `?period`.
      - **"Todo <año>"**, por ejemplo "Todo 2026": el año calendario completo de ese mes, de enero a
        diciembre.
    - El texto fijo "Se exportan los movimientos activos con fecha en ese período. Las cuotas de
      compras anteriores no se incluyen."
    - El botón **"Descargar CSV"** y el botón **"Cancelar"**. "Cancelar", Escape o tocar fuera de la
      hoja la cierran sin exportar.
  - **Solo el mes actual o meses pasados.** Si el `?period` es posterior al mes actual (Movimientos
    permite navegar a meses futuros, FR-21), el botón "Exportar" está deshabilitado. Debajo del
    encabezado se ve: "Solo podés exportar el mes actual o meses anteriores." El mes actual se
    calcula igual que en el resto de la app: `currentPeriod(today)` (`src/domain/period.ts`), con
    la fecha y la zona horaria del dispositivo, evaluado al mostrar la pantalla. Si el mes cambia
    con la pantalla abierta, el botón se actualiza recién al recargarla o al cambiar de mes.
  - El filtro "Activos / Eliminados" de la pantalla no cambia lo que se exporta: siempre se
    exportan solo las activas.

- **Qué se exporta:**
  - Las transacciones **activas** (`deleted_at` nulo) del usuario con sesión iniciada cuya `fecha`
    (`occurred_on`) cae en el período elegido: el mes completo, o del 1 de enero al 31 de diciembre
    del año. Nada de otros usuarios (RLS, C7).
  - **Las eliminadas no se exportan**, igual que no cuentan en ningún total de la app (C10, I10). Si
    una transacción eliminada se restauró desde "Eliminados", vuelve a estar activa y se exporta.
  - **Una fila por transacción**, nunca una por cuota. Una compra de $120.000 en 12 cuotas del 15
    de agosto sale una sola vez, en el export de agosto (o del año), con `monto = 120000.00` y
    `cuotas = 12`. **No** aparece en el export de septiembre aunque tenga una cuota imputada a
    septiembre (glosario: Transacción vs. Imputación).
  - Las transacciones de una cuenta **eliminada** (ADR-026) ya no existen y no salen. Las de una
    categoría o cuenta **archivada** sí salen, con el nombre de la categoría o la cuenta.
  - Los nombres de categoría y cuenta son los **actuales**: si una categoría se renombró, sus
    transacciones salen con el nombre nuevo. Si una categoría archivada y una activa tienen el
    mismo nombre, en el archivo no se distinguen. Se acepta así: el `id` de la transacción sigue
    siendo único.
  - No se exportan deudas, suscripciones, categorías, cuentas ni tipos de cambio de referencia.

- **Formato del archivo** (ADR-029):

  | Aspecto | Valor exacto |
  |---|---|
  | Nombre | Mes: `biyu-movimientos-AAAA-MM.csv` (ej.: `biyu-movimientos-2026-09.csv`). Año: `biyu-movimientos-AAAA.csv` (ej.: `biyu-movimientos-2026.csv`) |
  | Codificación | UTF-8 **con BOM** (los primeros 3 bytes son `EF BB BF`) |
  | Separador | Coma `,` |
  | Fin de línea | CRLF (`\r\n`) al final de cada fila, incluida la última |
  | Encabezado | Una fila, exactamente: `fecha,tipo,monto,moneda,tipo_de_cambio,monto_ars,categoria,cuenta,cuotas,primer_periodo,descripcion,id` |
  | Comillas | Un campo va entre comillas dobles solo si contiene `,`, `"`, CR o LF. Las comillas internas se duplican (`"` → `""`). Ningún otro campo lleva comillas |
  | Orden de las filas | `fecha` (`occurred_on`) ascendente; si empatan, `created_at` ascendente; si también empatan, `id` ascendente (orden de texto del UUID en minúsculas) |
  | Cantidad de filas | 1 de encabezado y 1 por transacción. Sin filas en blanco ni de totales |

  Columnas, en este orden:

  | # | Columna | Origen | Formato | Ejemplo |
  |---|---|---|---|---|
  | 1 | `fecha` | `occurred_on` | `AAAA-MM-DD` | `2026-08-15` |
  | 2 | `tipo` | `type` | `gasto` o `ingreso` | `gasto` |
  | 3 | `monto` | `amount` | String decimal con `.` y exactamente 2 decimales, sin separador de miles, sin símbolo y sin signo (C2) | `120000.00` |
  | 4 | `moneda` | `currency` | `ARS` o `USD` | `USD` |
  | 5 | `tipo_de_cambio` | `fx_rate` | String decimal con `.` y exactamente 4 decimales. **Vacío** si la moneda es ARS | `1250.5000` |
  | 6 | `monto_ars` | `amount_ars` | Igual que `monto`. Es el valor congelado en la transacción (C5) y no se recalcula al exportar | `375150.00` |
  | 7 | `categoria` | `categories.name` | Texto. **Vacío** si la transacción no tiene categoría (ingreso sin categoría) | `Supermercado` |
  | 8 | `cuenta` | `accounts.name` | Texto | `Visa BBVA` |
  | 9 | `cuotas` | `installments_count` | Entero de 1 a 12, sin decimales | `3` |
  | 10 | `primer_periodo` | `first_period` | `AAAA-MM`: los primeros 7 caracteres de `first_period` (que se guarda como el día 1 del mes, `2026-08-01`). No se recalcula desde `fecha` | `2026-08` |
  | 11 | `descripcion` | `description` | Texto tal cual se guardó. **Vacío** si no tiene | `Heladera, 3 cuotas` |
  | 12 | `id` | `id` | UUID de la transacción, en minúsculas | 36 caracteres |

  - **Montos (C2, ADR-013):** `monto`, `monto_ars` y `tipo_de_cambio` se leen de la base como texto
    (`amount::text`, `amount_ars::text`, `fx_rate::text`) y se escriben sin convertirlos a `number`.
    Sin ese cast, PostgREST devuelve `numeric` como número JSON y `1500.00` llega como `1500`
    (`src/lib/fxRates.ts`). Si un valor leído no cumple `^\d+\.\d{2}$` (montos) o `^\d+\.\d{4}$` (tipo
    de cambio), la exportación pasa al estado Error. `1234.5` y `1500` no son válidos: van
    `1234.50` y `1500.00`. Los gastos no llevan signo negativo; el sentido lo da `tipo` (glosario:
    Tipo).
  - **Neutralización de fórmulas:** si `categoria`, `cuenta` o `descripcion` empiezan con `=`, `+`,
    `-`, `@`, tabulación (`\t`) o retorno de carro (`\r`), se les agrega un apóstrofo `'` adelante.
    **Primero se neutraliza y después se entrecomilla**. Ejemplos de valor guardado → bytes en el
    archivo:
    - `=1+1` → `'=1+1`
    - `-5, promo` → `"'-5, promo"` (lleva apóstrofo por el `-` y comillas por la coma)
    - `\tcafé` → `'\tcafé` (sin comillas: la tabulación no obliga a entrecomillar)
    - `\rnota` → `"'\rnota"` (el CR obliga a entrecomillar)

    No se agrega, quita ni recorta ningún otro carácter. Los espacios al principio y al final se
    conservan.

  Ejemplo con montos ficticios: export "Solo agosto 2026", sin el BOM y con los UUID acortados.

  ```text
  fecha,tipo,monto,moneda,tipo_de_cambio,monto_ars,categoria,cuenta,cuotas,primer_periodo,descripcion,id
  2026-08-01,ingreso,850000.00,ARS,,850000.00,,Caja de ahorro,1,2026-08,Sueldo agosto,0b6e…
  2026-08-15,gasto,300.00,USD,1250.5000,375150.00,Hogar,Visa BBVA,3,2026-08,"Heladera, 3 cuotas",3f1c…
  2026-08-20,gasto,4500.00,ARS,,4500.00,Salidas,Efectivo,1,2026-08,"Pizza ""a la piedra""",9a42…
  2026-08-28,gasto,12000.00,ARS,,12000.00,Supermercado,Débito Galicia,1,2026-08,"'-5, promo",c7d8…
  ```

- **Completitud:** Supabase devuelve como máximo 1.000 filas por lectura, y un año puede tener
  más, así que la exportación lee en varias páginas. Al empezar obtiene el total de transacciones
  que corresponden al período. Si al terminar la cantidad de filas leídas no es igual a ese total
  (por ejemplo, porque mientras exportaba se cargó o se eliminó una transacción en otra pestaña),
  pasa al estado Error y no descarga nada. Nunca se descarga un archivo con filas de menos ni
  repetidas.

- **Estados:**

  | Estado | Cuándo | Qué se ve |
  |---|---|---|
  | Inicial | Al abrir la hoja | "Solo <mes año>" elegido; "Descargar CSV" y "Cancelar" habilitados |
  | Exportando | Desde que se toca "Descargar CSV" hasta que la app dispara la descarga o pasa a Vacío o Error | "Descargar CSV" queda deshabilitado, con `aria-busy="true"` y el texto "Exportando…". Las opciones y "Cancelar" también quedan deshabilitados, y la hoja no se cierra con Escape ni tocando fuera. Un segundo toque no inicia otra exportación |
  | Éxito | Hay al menos una transacción activa en el período y se leyeron todas | La app dispara la descarga, la hoja se cierra y aparece el aviso "Exportamos N movimientos". N es la cantidad de filas de datos del archivo, con punto de miles desde 1.000 (`1.500`). Si N es 1, dice "Exportamos 1 movimiento" |
  | Vacío | No hay ninguna transacción activa en el período elegido | **No** se descarga ningún archivo. La hoja sigue abierta y debajo de las opciones dice "No tenés movimientos con fecha en <mes año>." o "No tenés movimientos con fecha en <año>.", según la opción elegida. Las opciones, "Descargar CSV", "Cancelar", Escape y tocar fuera vuelven a funcionar |
  | Error | Falla cualquiera de las lecturas (sin conexión o error del servidor), un monto no cumple el formato o el total no coincide (ver "Completitud") | **No** se descarga ningún archivo, ni uno parcial. La hoja sigue abierta y debajo de las opciones, con `role="alert"`, dice "No pudimos exportar tus movimientos. Probá de nuevo." Las opciones, "Descargar CSV", "Cancelar", Escape y tocar fuera vuelven a funcionar; "Descargar CSV" sirve para reintentar |

  El mensaje de vacío o de error desaparece al cambiar de opción o al volver a tocar "Descargar
  CSV". Al cerrar y reabrir la hoja, vuelve al estado Inicial.

  **Nombre que se verifica:** el que propone la app (atributo `download` del enlace, o el que
  muestra el diálogo de Safari). Si en la carpeta ya existe un archivo con ese nombre y el navegador
  le agrega un sufijo (`biyu-movimientos-2026-09 (1).csv`), el sufijo no cuenta.

  **Qué es "descargar" en cada navegador** (NFR-04): en Chrome o Edge de escritorio y en Chrome de
  Android, el archivo queda en la carpeta de descargas con el nombre indicado en la fila "Nombre"
  del formato. En Safari de iOS, Safari pregunta si se quiere descargar el archivo, que queda en
  Archivos > Descargas con el mismo nombre.

- **`data-testid`:**

  | Elemento | `data-testid` |
  |---|---|
  | Botón "Exportar" del encabezado | `transactions-export` |
  | Aviso "Solo podés exportar el mes actual o meses anteriores." | `transactions-export-future` |
  | Hoja "Exportar movimientos" | `transactions-export-dialog` |
  | Opción "Solo <mes año>" | `transactions-export-scope-month` |
  | Opción "Todo <año>" | `transactions-export-scope-year` |
  | Botón "Descargar CSV" (también en estado "Exportando…") | `transactions-export-submit` |
  | Botón "Cancelar" | `transactions-export-cancel` |
  | Mensaje de vacío | `transactions-export-empty` |
  | Mensaje de error | `transactions-export-error` |
  | Aviso de éxito (toast) | `transactions-export-success` |

- **Criterios de aceptación:**

  _La verificación del contenido se hace sobre el archivo abierto como texto o en un visor
  hexadecimal, no sobre cómo lo muestra una planilla._

  - CA-1: En `/transactions` hay un botón "Exportar" (`transactions-export`) en el encabezado.
    Tocarlo abre la hoja "Exportar movimientos" (`transactions-export-dialog`) con "Solo <mes año>"
    elegido, donde <mes año> es el mes que muestra el selector (ej.: con `?period=2026-09`, "Solo
    septiembre 2026" y "Todo 2026"). Sin `?period` en la URL, las opciones son las del mes actual.
  - CA-2: Con el `?period` posterior al mes actual, el botón "Exportar" está deshabilitado y se ve
    "Solo podés exportar el mes actual o meses anteriores." (`transactions-export-future`). Con el
    mes actual o uno anterior, está habilitado y ese aviso no se ve.
  - CA-3: Con "Solo <mes año>" y al menos una transacción activa en ese mes, "Descargar CSV"
    descarga un archivo cuyo nombre propuesto es `biyu-movimientos-AAAA-MM.csv`, con el `AAAA-MM`
    del mes elegido.
  - CA-4: Con "Todo <año>" y al menos una transacción activa en ese año, "Descargar CSV" descarga
    un archivo cuyo nombre propuesto es `biyu-movimientos-AAAA.csv`, con el año del mes elegido.
  - CA-5: El export de un mes contiene exactamente las transacciones activas con `fecha` entre el
    día 1 y el último día de ese mes, incluidos los dos extremos (ej.: `2026-09-01` y `2026-09-30`
    sí; `2026-08-31` y `2026-10-01` no). El de un año, exactamente las de `AAAA-01-01` a
    `AAAA-12-31`, incluidos los dos extremos.
  - CA-6: Una transacción eliminada no aparece en el archivo. Si después se restaura, aparece en el
    siguiente export de su período.
  - CA-7: El filtro "Activos / Eliminados" de la pantalla no cambia el archivo: exportar el mismo
    período desde "Eliminados" y desde "Activos" da dos archivos con el mismo contenido, byte a
    byte.
  - CA-8: El archivo empieza con los bytes `EF BB BF`, cada fila termina en CRLF (incluida la
    última) y la primera fila es exactamente
    `fecha,tipo,monto,moneda,tipo_de_cambio,monto_ars,categoria,cuenta,cuotas,primer_periodo,descripcion,id`.
  - CA-9: Una transacción en N cuotas (N de 2 a 12) sale en una sola fila, en el export del mes de
    su `fecha`, con `monto` igual al total de la compra, `cuotas = N` y `primer_periodo` igual a
    los primeros 7 caracteres de su `first_period`. No aparece en el export de los meses siguientes
    en los que tiene cuotas.
  - CA-10: `monto` y `monto_ars` tienen exactamente 2 decimales con `.`, sin separador de miles,
    símbolo ni signo: un monto guardado de 1500 sale `1500.00`, no `1.500,00`, `1500` ni
    `-1500.00`. `tipo_de_cambio` tiene exactamente 4 decimales en las transacciones en USD
    (`1250.5000`) y está vacío en las de ARS.
  - CA-11: Para una transacción en USD, `monto_ars` es igual a `transactions.amount_ars` leído como
    texto, y no cambia si después se edita el tipo de cambio de referencia de su mes (C5).
  - CA-12: Una descripción que contiene una coma, comillas dobles o un salto de línea sale entre
    comillas dobles, con las comillas internas duplicadas. Ej.: `Pizza "a la piedra"` sale como
    `"Pizza ""a la piedra"""`. Un lector CSV que cumple RFC 4180 (por ejemplo, Google Sheets con
    Archivo > Importar > Subir y separador "Coma") lee 12 columnas en esa fila.
  - CA-13: Una `categoria`, `cuenta` o `descripcion` que empieza con `=`, `+`, `-`, `@`,
    tabulación o retorno de carro sale con `'` adelante y el resto igual, primero neutralizada y
    después entrecomillada, con los bytes de los cuatro ejemplos de "Neutralización de fórmulas".
  - CA-14: Las filas están ordenadas por `fecha` ascendente, después por `created_at` ascendente y
    después por `id` ascendente.
  - CA-15: Con exactamente 1.000, 1.500 y 2.000 transacciones activas en un mismo año, el export de
    ese año tiene 1.000, 1.500 y 2.000 filas de datos, sin repetidas (todos los `id` son distintos),
    y el aviso dice "Exportamos 1.000 movimientos", "Exportamos 1.500 movimientos" y "Exportamos
    2.000 movimientos".
  - CA-16: El archivo de un usuario no contiene ninguna transacción de otro usuario del mismo
    período (C7).
  - CA-17: Una transacción con una categoría o una cuenta archivadas sale con el nombre actual de
    esa categoría o cuenta. Un ingreso sin categoría sale con `categoria` vacío.
  - CA-18: Mientras exporta, "Descargar CSV" muestra "Exportando…", está deshabilitado y tiene
    `aria-busy="true"`. Las opciones y "Cancelar" están deshabilitados y la hoja no se cierra. Un
    segundo toque durante la exportación no descarga un segundo archivo.
  - CA-19: Al terminar con éxito, la hoja se cierra y aparece el aviso (`transactions-export-success`)
    "Exportamos N movimientos", con N igual a la cantidad de filas de datos del archivo. Con una
    sola transacción dice "Exportamos 1 movimiento".
  - CA-20: Sin transacciones activas en el período elegido (aunque haya eliminadas), "Descargar CSV"
    no descarga ningún archivo y muestra "No tenés movimientos con fecha en septiembre 2026." con
    "Solo septiembre 2026", o "No tenés movimientos con fecha en 2026." con "Todo 2026"
    (`transactions-export-empty`). Después, "Cancelar" cierra la hoja y las opciones se pueden
    cambiar.
  - CA-21: Con un mes que solo tiene cuotas de compras de meses anteriores (ej.: septiembre con la
    cuota 2/3 de una compra del 15 de agosto), Movimientos muestra esa cuota y "Solo septiembre
    2026" da el estado Vacío.
  - CA-22: Sin conexión (DevTools > Network > Offline), "Descargar CSV" no descarga ningún archivo y
    muestra "No pudimos exportar tus movimientos. Probá de nuevo." (`transactions-export-error`,
    `role="alert"`). Con la conexión restablecida, tocar "Descargar CSV" de nuevo descarga el
    archivo completo y el mensaje de error desaparece. Con el error visible, "Cancelar" cierra la
    hoja.
  - CA-23: "Cancelar" (`transactions-export-cancel`), Escape o tocar fuera de la hoja la cierran
    sin descargar nada, y la URL no cambia.
  - CA-24: Con la hoja abierta, el botón Atrás del navegador la cierra. Si estaba en
    "Exportando…", no se descarga ningún archivo.
  - CA-25: Exportar no modifica ningún dato: después de exportar, el Resumen y Movimientos del
    mismo período muestran los mismos valores que antes, y el `?period` de la URL no cambia.

- **Fuera de alcance (V2):**
  - Un rango de fechas libre (FR-22): se exporta un mes o un año calendario completo (ADR-029).
  - Exportar meses futuros, aunque tengan cuotas comprometidas.
  - Exportar transacciones eliminadas.
  - Exportar deudas, suscripciones, categorías o cuentas.
  - Una fila por cuota o un export por imputación del mes.
  - Formato "Excel argentino" (`;` como separador y `,` decimal). Abierto con doble clic en Excel
    con configuración regional de Argentina, el archivo queda en una columna; se importa con
    "Datos > Desde texto/CSV".
  - XLSX.
  - Un tiempo límite o un umbral de rendimiento propio: si una lectura queda colgada, sigue en
    "Exportando…" hasta que el navegador corte el pedido. Los NFR de rendimiento de V2 son otro
    frente.
  - Qué pasa si la sesión termina en medio de la exportación: lo maneja el guard de rutas (US-48).

- **Notas para quien implemente** (no agregan requisitos):
  - Las lecturas van por el SDK bajo RLS, con `deleted_at is null`, el filtro de `occurred_on` del
    período y los montos casteados a `::text`.
  - Conviene paginar con cursor sobre `(occurred_on, created_at, id)` en lugar de `offset`, y pedir
    `count: 'exact'` en la primera página para el control de "Completitud".
  - El armado del texto, el rango de fechas y el nombre del archivo son funciones puras en
    `src/domain/` que reciben las filas, el período y `today` (C1).
  - No hace falta ninguna migración (ADR-029).

- **Mock:** [`entrega-2/mocks/export-csv.html`](mocks/export-csv.html). Muestra Movimientos
  con el botón nuevo, la hoja en sus estados, el mes futuro y el archivo de ejemplo.

- **Trazabilidad:** FR-22 (con período de mes o año y sin la columna de estado, ADR-029) · C9 · C1 ·
  C2 · C5 · C7 · C10 · C11 · I10 · FR-21 · NFR-04 · ADR-013 · ADR-023 · ADR-026 · ADR-029 · Épica
  [#19](https://github.com/Joaconz/Biyu/issues/19)

- **Casos de prueba:** _los diseña Testing a partir de esta historia._

---

## Parte 5 · Importar Excel

_Fuente: `entrega-2/historias/importar-excel.md`._

**Testing de Aplicaciones · Proyecto Integrador** · Versión del documento: 2026-10-06 · Alcance de
V2, nivel 3 (`entrega-2/README.md`). Mismo formato que `entrega-1/01-historias-de-usuario.md`; estas
historias llevan además el detalle de pantalla, archivo y validaciones que pide la Entrega 2.

Archivo de ejemplo (datos ficticios, C14):
[`entrega-2/mocks/importar-excel-ejemplo.xlsx`](mocks/importar-excel-ejemplo.xlsx),
cuyo contenido es la tabla de la sección 6 · Decisión de escritura:
[ADR-035](../docs/adr/035-importacion-por-lote-con-una-rpc.md).

**Vocabulario.** "Movimiento" es el rótulo de la UI (la pantalla Movimientos) para una
**Transacción** del glosario (`docs/01-domain-glossary.md`); cada fila importada crea una transacción
con sus imputaciones.

---

### Las historias

La importación se parte en seis historias que se implementan en este orden, porque cada una usa lo
que dejó la anterior. Las reglas de detalle (pantallas, formato del archivo, mensajes, errores) son
una sola especificación, en las secciones 1 a 9 y 12 de más abajo; cada criterio remite a ella. Las
seis cuelgan de la épica [#203](https://github.com/Joaconz/Biyu/issues/203), que reemplaza a la idea del backlog [#169](https://github.com/Joaconz/Biyu/issues/169).

| Historia | Qué entrega | Depende de |
|---|---|---|
| US-74 · Subir un archivo de Excel | Entrar a la pantalla, bajar la plantilla y que el archivo se acepte o se rechace entero | — |
| US-76 · Revisar las filas antes de importar | Leer cada fila, marcar los errores con su mensaje y resumir lo que se va a importar, sin escribir nada | US-74 |
| US-77 · Importar las filas válidas y ver el resultado | Crear las filas válidas con `create_transaction`, tolerar rechazos y resumir al terminar | US-76 |
| US-78 · Reintentar una importación sin duplicar | Responder a errores de red y de la base, reintentar sin duplicar y no perder el estado al salir | US-77 |
| US-80 · Importar una compra en cuotas ya empezada | Columna "Cuotas pendientes": solo se imputan las cuotas que faltan, desde el mes de hoy (ADR-039) | US-77 |
| US-81 · Guía para armar el archivo de importación | Botón que abre un diálogo con la guía; cerrada por defecto y opcional | US-74, US-80 |

##### US-74: Subir un archivo de Excel · [#204](https://github.com/Joaconz/Biyu/issues/204)

- **Objetivo:** Como usuario que ya anota sus gastos en una planilla de Excel, quiero subir ese archivo
  a la app, para no cargar de a uno en Registrar lo que ya tengo escrito.
- **Pantallas y campos:** botón "Importar desde Excel" en **Registrar**, pantalla **Importar desde
  Excel** (`/import`), paso 1 (secciones 1 y 2), con la plantilla descargable.
- **Criterios de aceptación:**
  - CA-1: En Registrar existe el botón "Importar desde Excel", visible en los tres pasos del registro, y
    lleva a `/import` en el paso 1. Sin sesión, `/import` redirige a `/login?next=/import`.
  - CA-2: "Descargar plantilla" baja `biyu-plantilla-importacion.xlsx` cuya primera hoja tiene en la fila
    1, de A a I, exactamente: Fecha, Tipo, Monto, Moneda, Tipo de cambio, Categoría, Cuenta, Cuotas,
    Nota, y ninguna fila más con datos. Subir esa plantilla sin cambios muestra el mensaje A6. **Modificado
    por US-80 (ADR-039):** la plantilla pasa a tener 10 columnas, de A a J, con "Cuotas pendientes"
    después de "Cuotas".
  - CA-3: Cada regla A1 a A7 de la sección 3 muestra su mensaje exacto, la pantalla queda en el paso 1 y
    no se crea ninguna transacción.
  - CA-4: Un archivo de exactamente 500 filas con datos pasa al paso 2; uno de 501 muestra A7 con
    "501". Un archivo de 1.048.576 bytes pasa la regla A2; uno de 1.048.577 bytes muestra A2.
  - CA-5: Solo se lee la primera hoja: un libro cuya hoja 2 tiene filas válidas y cuya hoja 1 solo tiene
    encabezados muestra A6.
  - CA-6: Los encabezados se reconocen sin distinguir mayúsculas ni tildes, en cualquier orden: un
    archivo con " CATEGORIA ", "monto", "FECHA"… en otro orden se lee igual que la plantilla. Un
    encabezado desconocido ("Comercio") no impide la lectura y aparece en "Se ignoraron las columnas:
    Comercio."
  - CA-7: Un archivo en ARS sin las columnas "Tipo de cambio", "Cuotas" ni "Nota" pasa al paso 2 y sus
    filas válidas quedan "Lista". Un archivo sin "Categoría" pasa al paso 2 y cada gasto muestra F14a.
  - CA-8: Todo elemento interactivo de esta historia lleva el `data-testid` de la sección 12.
- **Trazabilidad:** sección 11 · C11 · C14
- **Casos de prueba:** a diseñar (módulo Importación, `docs/07-plan-de-testing.md` §1)

##### US-76: Revisar las filas antes de importar · [#205](https://github.com/Joaconz/Biyu/issues/205)

- **Objetivo:** Como usuario, quiero ver, antes de importar, qué filas de mi archivo están bien y cuáles
  tienen un error y por qué, para corregir la planilla sin haber guardado nada.
- **Pantallas y campos:** paso 2 de **Importar desde Excel** (sección 1), con el resumen, el filtro y una
  tarjeta por fila; validación de las secciones 2 y 4.
- **Criterios de aceptación:**
  - CA-1: Las filas vacías se saltean, no cuentan en T ni en el límite de 500 y no se renumeran: con el
    archivo de ejemplo, el paso 2 muestra "11 filas leídas · 7 listas para importar · 4 con error" y
    ninguna tarjeta "Fila 12".
  - CA-2: Cada regla F1 a F18 de la sección 4, aplicada a una fila que no tiene ningún otro error, marca
    la fila "Con error" y muestra su mensaje exacto.
  - CA-3: Una fila con errores en varias columnas muestra un mensaje por columna, en el orden de la
    tabla de la sección 4: Fecha "31/02/2026", Monto "0" y Cuenta "Banco X" muestran "Fecha inválida:
    usá DD/MM/AAAA", "El monto debe ser mayor a cero" y "No existe la cuenta «Banco X» o está
    archivada", en ese orden.
  - CA-4: Las reglas dependientes respetan la tabla de dependencias de la sección 4: Moneda "EUR" con
    Tipo de cambio "1450" muestra solo "Moneda inválida: escribí ARS o USD"; Tipo "Gastos" con
    Categoría vacía muestra solo "Tipo inválido: escribí Gasto o Ingreso"; Cuenta "Banco X" con 3 cuotas
    muestra solo el mensaje de la cuenta.
  - CA-5: Categoría y Cuenta se comparan sin distinguir mayúsculas, ignorando espacios al principio y al
    final, y distinguiendo tildes: con el usuario sembrado, "  efectivo " encuentra la cuenta "Efectivo"
    y "Educacion" da F14b. Tipo " gasto " y Moneda "usd" se aceptan. Una categoría o cuenta archivada da
    F14b o F14d aunque el nombre coincida.
  - CA-6: Una fecha de hoy es "Lista" y una de mañana da F3, con "hoy" según la hora de Argentina
    (ADR-021). Una celda de fecha con hora (05/09/2026 18:30) se lee como 05/09/2026. Una celda numérica
    sin formato de fecha (46000) da F2.
  - CA-7: El texto "1.500" en Monto se lee como 1500 (se muestra "$1.500,00"), y "1234.56" como 1234,56.
    Una celda con la fórmula `=0,1*3` se lee como 0,3 (se muestra "$0,30") y queda "Lista"; una con
    `=100/3` da F9.
  - CA-8: En el paso 2, "Vas a importar…" coincide con la suma de la sección 6: con el archivo de
    ejemplo, "Vas a importar 7 movimientos: $324.915,50 en gastos y $850.000,00 en ingresos (en pesos)."
  - CA-9: "Ver solo filas con error" arranca apagado; prendido, con el archivo de ejemplo la lista muestra
    solo las tarjetas de las filas 7, 8, 9 y 10. Con un archivo sin errores está deshabilitado.
  - CA-10: El paso 2 no escribe nada: llegar al paso 2 y tocar "Elegir otro archivo" deja la misma
    cantidad de transacciones que había antes de subir el archivo. Recargar en el paso 2 vuelve al paso 1
    sin archivo.
  - CA-11: Con 0 filas "Lista", "Importar 0 movimientos" está deshabilitado y se ve "No hay filas
    listas para importar". Con 1 fila "Lista", el botón dice "Importar 1 movimiento".
  - CA-12: Todo elemento interactivo de esta historia lleva el `data-testid` de la sección 12.
- **Trazabilidad:** sección 11 · C1 · C2 · C6 · I4 · I5 · I6 · I8 · FR-06
- **Casos de prueba:** a diseñar

##### US-77: Importar las filas válidas y ver el resultado · [#206](https://github.com/Joaconz/Biyu/issues/206)

- **Objetivo:** Como usuario, quiero que al confirmar se creen las filas válidas aunque otras tengan
  error, y ver cuántas entraron y cuáles no, para no perder el trabajo por una fila mala.
- **Pantallas y campos:** botón "Importar N movimientos" del paso 2 y paso 3 **Resultado** (sección 1);
  RPC `import_transactions` (ADR-035) y sus reglas (sección 5).
- **Criterios de aceptación:**
  - CA-1: Al confirmar se crean exactamente las N filas "Lista", ninguna de las M con error, y cada una
    con los datos de su fila: tipo, monto, moneda, tipo de cambio, categoría, cuenta, cuotas, fecha y
    nota (una Nota vacía queda sin descripción).
  - CA-2: Cada fila importada pasa por `create_transaction` (C4): la fila 3 del archivo de ejemplo genera
    6 imputaciones de $40.000,00, de 2026-09 a 2027-02, que suman $240.000,00 (I1, I1', I2, I3).
  - CA-3: Con el archivo de ejemplo y el usuario sembrado, el paso 3 muestra exactamente el resultado de
    la sección 6, y "Ver en Movimientos" lleva a `/transactions?period=2026-09`.
  - CA-4: Si la base rechaza una fila que el paso 2 dio por "Lista", las demás se importan igual y esa
    fila aparece en el resultado con el mensaje de la tabla de la sección 5. Con el archivo de ejemplo y
    el usuario sembrado: archivar "Transporte" después de llegar al paso 2 y antes de confirmar da "Se
    importaron 6 de 11 filas." y la línea "Fila 6: No existe la categoría «Transporte» o está
    archivada".
  - CA-5: Importar no cambia la cuenta que Registrar trae precargada (US-07).
  - CA-6: Con 500 filas "Lista" de 12 cuotas cada una, el paso 3 aparece en menos de 10 segundos desde
    que se toca "Importar 500 movimientos", en el deploy de Vercel contra Supabase hosteado, y muestra
    "Se importaron 500 de 500 filas."
  - CA-7: La base revalida cada fila aunque el cliente no lo haga (C6). Llamando a `import_transactions`
    directo por la API con cuatro filas, una válida y tres inválidas (monto `"0"`, sin `account_id`,
    monto `"abc"`): la válida se crea, las otras tres vuelven con `status: "rejected"` y no dejan
    transacción ni imputaciones.
  - CA-8: La base rechaza el lote entero, sin crear nada, si `p_rows` tiene 0 o 501 elementos.
  - CA-9: Sin sesión (rol `anon`) `import_transactions` da `permission denied` (42501), y otro usuario no
    ve las transacciones importadas ni el registro de la importación (cero filas, C7).
  - CA-10: Todo elemento interactivo de esta historia lleva el `data-testid` de la sección 12.
- **Trazabilidad:** sección 11 · C4 · C6 · C7 · ADR-005 · ADR-035 · I1 · I1' · I2 · I3
- **Casos de prueba:** a diseñar

##### US-78: Reintentar una importación sin duplicar · [#207](https://github.com/Joaconz/Biyu/issues/207)

- **Objetivo:** Como usuario, quiero que si se corta la conexión mientras importo pueda reintentar sin
  que se dupliquen los movimientos, para no tener que revisar a mano qué entró.
- **Pantallas y campos:** botón "Importando…" y "Reintentar", mensajes de error de toda la importación
  (sección 7) y diálogo de salida (sección 8).
- **Criterios de aceptación:**
  - CA-1: La importación es una sola llamada y el botón queda en "Importando…" deshabilitado hasta la
    respuesta: dos toques rápidos sobre "Importar N movimientos" crean N transacciones, no 2N (NFR-10).
  - CA-2: Reintentar no duplica (sección 7, ADR-035): si la primera llamada se guardó, "Reintentar"
    muestra "Esta importación ya se había guardado." y la cantidad de transacciones no cambia; si no se
    guardó, "Reintentar" importa las N filas una sola vez. Por API: llamar dos veces a
    `import_transactions` con el mismo `p_import_id` crea las filas una vez y la segunda respuesta trae
    `already_imported: true`.
  - CA-3: Cada error de toda la importación de la sección 7 muestra su mensaje exacto y no deja ninguna
    transacción creada (salvo el caso sin respuesta, que se resuelve con CA-2).
  - CA-4: Salir con una importación pendiente pide confirmación (sección 8): "Quedarme" deja la pantalla
    como estaba y "Salir igual" navega al destino tocado.
  - CA-5: Todo elemento interactivo de esta historia lleva el `data-testid` de la sección 12.
- **Trazabilidad:** sección 11 · NFR-10 · ADR-035
- **Casos de prueba:** a diseñar

##### US-80: Importar una compra en cuotas ya empezada · [#268](https://github.com/Joaconz/Biyu/issues/268)

- **Objetivo:** Como usuario que empieza a usar Biyu con compras en cuotas a medio pagar, quiero
  importarlas indicando cuántas cuotas me faltan, para ver en cada mes solo lo que todavía tengo que
  pagar.
- **Depende de:** US-77 (la RPC `import_transactions`). Decisión de modelo:
  [ADR-039](../docs/adr/039-compra-en-cuotas-empezada.md).
- **Notación de los ejemplos.** H es el mes de hoy en Argentina (ADR-021) cuando se ejecuta el caso;
  H−4 es cuatro meses antes, H+1 el mes siguiente. "Una fecha de H−4" es cualquier día de ese mes (una fecha de H, cualquier día hasta hoy). Los
  criterios no dependen del día de hoy, salvo los marcados como prueba de dominio, que fijan "hoy".
- **Pantallas y campos:** plantilla y pasos 2 y 3 de **Importar desde Excel**. Agrega una columna
  opcional a la sección 2, con las mismas reglas de encabezado que las demás (sin distinguir
  mayúsculas ni tildes, en cualquier orden; repetida da A5):

  | Encabezado | Celda obligatoria | Qué va | Formatos aceptados |
  |---|---|---|---|
  | Cuotas pendientes | No. Vacía = la compra se imputa desde el mes de su fecha, como hasta ahora | Cuántas cuotas faltan pagar, contando la del mes de hoy (una compra de 6 cuotas con 3 ya pagadas lleva 3) | Entero, celda numérica o texto |

  - Sin la columna, todas las filas se tratan como vacías en "Cuotas pendientes".
  - La columna cuenta para decidir si una fila está vacía (sección 2): una fila con solo "Cuotas
    pendientes" no se saltea y da los errores de las celdas obligatorias.
- **Qué se crea** (ADR-039). Con N = Cuotas, P = Cuotas pendientes y K = N − P (cuotas ya pagadas):
  - El calendario de N cuotas se calcula sobre el **Monto** de la fila, que es el total de la compra,
    con la regla de siempre: cuota base truncada a 2 decimales y la última absorbe el resto (C3).
  - Se guardan solo las últimas P cuotas, numeradas de K + 1 a N, una por mes **desde el mes de
    hoy**. Vale también con P = N (K = 0): ninguna pagada, pero las N cuotas se imputan desde el mes
    de hoy y no desde el mes de la fecha.
  - El monto del movimiento es lo que falta pagar: la suma de esas P cuotas.
  - En USD, el equivalente en pesos del movimiento es lo que falta pagar × tipo de cambio, redondeado
    half-up a 2 decimales (ADR-013). Ese equivalente se reparte entre las P cuotas con la regla de
    siempre: base truncada y la última absorbe el resto (I1').
  - La fecha del movimiento sigue siendo la Fecha de la fila, es decir, la de la compra.
  - Cada fila de `p_rows` de `import_transactions` (ADR-035) lleva la clave `installments_paid` (K)
    solo si la celda "Cuotas pendientes" tiene valor. Si la clave falta o es `null`, la fila es una
    compra normal. Pasa a `create_transaction` como `p_installments_paid`, y la base revalida K (C6).
- **Reglas nuevas de la sección 4**, después de F18, con mensajes exactos:

  | # | Columna | Regla | Mensaje exacto |
  |---|---|---|---|
  | F19 | Cuotas pendientes | No vacía, y Cuotas vacía o igual a 1 | "Las cuotas pendientes solo van en una compra en cuotas" |
  | F20 | Cuotas pendientes | No es un entero entre 1 y Cuotas | "Las cuotas pendientes van de 1 a <N>" |
  | F21 | Cuotas pendientes | K > (año de hoy × 12 + mes de hoy) − (año de la Fecha × 12 + mes de la Fecha) | "Con esa fecha todavía no puede haber <K> cuotas pagadas" ("1 cuota pagada" si K = 1) |

  Dependencias (como la tabla de la sección 4):
  - F19 se evalúa solo si Cuotas no tuvo error.
  - F20 y F21 se evalúan solo si Tipo, Cuenta y Cuotas no tuvieron error y la fila no tiene F15.
  - F21 necesita además que Fecha no tenga error.
  - A lo sumo un mensaje en la columna: el primero de F19, F20 y F21.
- **Paso 2.** La tarjeta de una fila con Cuotas pendientes cambia "<k> cuotas" por "Faltan <P> de <N>
  cuotas (<lo que falta pagar>)", con el monto en la moneda de la fila y el formato de la sección 1.
  Ejemplos: "Faltan 3 de 6 cuotas ($60.000,00)" y "Faltan 2 de 3 cuotas (US$66,67)". Con P = 1 dice
  "Falta 1 de <N> cuotas (…)". Va en `import-row-<n>-pending`. "Vas a importar…" suma, de esa fila,
  el equivalente en pesos de lo que falta pagar, no el Monto escrito.
- **Paso 3.**
  - El monto importado suma lo mismo que el paso 2.
  - **Modifica la sección 1:** "Ver en Movimientos" lleva al mes más reciente entre el mes de la fecha
    de cada fila creada y, si alguna es una compra empezada, el mes de hoy, que es donde empiezan sus
    cuotas.
- **Plantilla y "Instrucciones".**
  - "Descargar plantilla" baja la hoja 1 con los encabezados de A a J: Fecha, Tipo, Monto, Moneda, Tipo
    de cambio, Categoría, Cuenta, Cuotas, Cuotas pendientes, Nota.
  - La hoja "Instrucciones" agrega la fila de "Cuotas pendientes" con el contenido de la tabla de
    arriba (encabezado, si es obligatoria, qué va y formatos).
  - **Modifica US-74 · CA-2.**
- **Criterios de aceptación.** Usuario sembrado: las categorías y cuentas de US-43 sin cambios.
  - CA-1: La plantilla descargada tiene en la fila 1, de A a J, exactamente: Fecha, Tipo, Monto, Moneda,
    Tipo de cambio, Categoría, Cuenta, Cuotas, Cuotas pendientes, Nota. La hoja "Instrucciones" tiene la
    fila de "Cuotas pendientes" con el texto de la tabla de esta historia.
  - CA-2: Una fila con una fecha de H−4 · Gasto · 120000 · ARS · Otros · Tarjeta de crédito · Cuotas 6 ·
    Cuotas pendientes 3 · "Heladera" queda "Lista" con "Faltan 3 de 6 cuotas ($60.000,00)". Al
    importarla se crea una transacción con:
    - `amount = 60000.00`, `installments_count = 6` e `installments_paid = 3`;
    - `occurred_on` = la fecha de la fila y `first_period` = el día 1 de H;
    - 3 imputaciones de $20.000,00, números 4, 5 y 6, en H, H+1 y H+2.
  - CA-3: En Movimientos, esa compra aparece en H como "4/6", en H+1 como "5/6" y en H+2 como "6/6". No
    aparece de H−4 a H−1 ni en H+3. "Ver en Movimientos" del paso 3 lleva a `?period=` de H.
  - CA-4 (resto): una fecha de H−1 · 100000 · ARS · 3 cuotas · pendientes 2 crea la cuota 2/3 de
    $33.333,33 en H y la 3/3 de $33.333,34 en H+1. El monto del movimiento es $66.666,67.
  - CA-5 (P = N): una fecha de H−1 · 120000 · 6 cuotas · pendientes 6 crea las 6 cuotas de $20.000,00,
    de 1/6 en H a 6/6 en H+5. El monto es $120.000,00 y la transacción queda con
    `installments_paid = 0` y `first_period` = H.
  - CA-6: Con Cuotas pendientes vacía, o con un archivo sin esa columna, la fila se importa igual que en
    US-77: una fecha de H−1 · 240000 · 6 cuotas imputa de H−1 a H+4.
  - CA-7 (F19): Cuotas vacía con pendientes 1, y Cuotas 1 con pendientes 1, muestran "Las cuotas
    pendientes solo van en una compra en cuotas".
  - CA-8 (F20): Con Cuotas 6, las pendientes `0`, `-1`, `7`, `2,5` y `dos` muestran "Las cuotas
    pendientes van de 1 a 6". `1` y `6` son válidas.
  - CA-9 (F21, valores límite): Con Cuotas 6 y pendientes 3 (K = 3):
    - una fecha de H−3 queda "Lista";
    - una fecha de H−2 muestra "Con esa fecha todavía no puede haber 3 cuotas pagadas";
    - una fecha de H con Cuotas 6 y pendientes 5 muestra "Con esa fecha todavía no puede haber 1 cuota
      pagada".
  - CA-10 (dependencias): Cuenta "Efectivo" con Cuotas 3 y pendientes 2 muestra solo "Solo los gastos
    con tarjeta de crédito admiten cuotas". Cuotas `13` con pendientes 2 muestra solo "Las cuotas van de
    1 a 12".
  - CA-11 (USD, sin resto): una fecha de H−2 · US$300 · TC 1000 · 3 cuotas · pendientes 1 muestra
    "Falta 1 de 3 cuotas (US$100,00)". Crea una sola imputación, la 3/3, de US$100,00 y $100.000,00 en
    H. La transacción queda con `amount = 100.00` y `amount_ars = 100000.00`.
  - CA-12 (USD, con resto): una fecha de H−1 · US$100 · TC 1000 · 3 cuotas · pendientes 2 muestra
    "Faltan 2 de 3 cuotas (US$66,67)". Crea la 2/3 de US$33,33 y la 3/3 de US$33,34. Las dos imputaciones
    son de $33.335,00 en pesos y suman el `amount_ars` del movimiento, $66.670,00 (I1, I1'). "Vas a
    importar…" suma $66.670,00 por esta fila.
  - CA-13: Un archivo con solo la fila de CA-2 muestra en el paso 2 "Vas a importar 1 movimiento:
    $60.000,00 en gastos y $0,00 en ingresos (en pesos)." En el paso 3 dice "$60.000,00 en gastos y
    $0,00 en ingresos (en pesos)."
  - CA-14: En el Resumen de H, la compra de CA-2 aporta $20.000,00 a "Cuotas de meses anteriores"
    (`dashboard-inherited-installments-amount`), porque su cuota de H es la 4/6.
  - CA-15: El diálogo de borrado (US-65) de una compra empezada muestra los meses y montos de sus
    imputaciones guardadas, no un calendario recalculado desde la fecha. El mismo mes de la
    importación no lista meses cerrados. En la prueba de dominio de ese aviso, con hoy un día de H+1,
    la compra de CA-2 lista solo H, con la cuota 4/6 de $20.000,00.
  - CA-16 (C6, directo contra la API): estos pedidos a `create_transaction` con
    `p_installments_count = 6` responden HTTP 400 y no crean filas:
    - `p_installments_paid` `6` y `-1` → `code = '23514'`, "Las cuotas ya pagadas tienen que ser menos
      que el total de cuotas";
    - con `p_installments_count = 1` y `p_installments_paid = 0` → `23514`, "Las cuotas ya pagadas solo
      van en una compra en cuotas";
    - fecha de hoy con `p_installments_paid = 1` → `23514`, "Con esa fecha todavía no puede haber
      tantas cuotas pagadas";
    - `p_installments_paid` con deudas (`p_shared_…`) → `23514`, "Una compra empezada no se puede
      compartir";
    - `p_installments_paid = 1.5` → `code = '22P02'` (PostgREST rechaza el tipo).

    `p_installments_paid` `null` o ausente crea una compra normal. Por `import_transactions`, una fila
    con `"installments_paid": 6` y 6 cuotas vuelve con `status: "rejected"` y las demás se importan.
    Con el rol `anon`, `42501`.
  - CA-17: `import-row-<n>-pending` está en la tarjeta de toda fila "Lista" con Cuotas pendientes.
- **Trazabilidad:** sección 4 · C3 · C4 · C6 · I1 · I1' · I2 (modificada por ADR-039) · I3 · I6 ·
  ADR-013 · ADR-021 · ADR-035 · ADR-039 · US-65 · US-74 · US-77
- **Casos de prueba:** a diseñar

##### US-81: Guía para armar el archivo de importación · [#269](https://github.com/Joaconz/Biyu/issues/269)

- **Objetivo:** Como usuario que nunca importó un Excel, quiero abrir una guía corta de cómo armar el
  archivo, para no adivinar el formato. Quien ya sabe tiene que poder ignorarla.
- **Depende de:** US-74 (pantalla Importar desde Excel) y US-80 (la guía nombra "Cuotas pendientes").
  Se implementa después de US-80.
- **Pantalla y estructura:** **Importar desde Excel** (`/import`), pasos 1 y 2. Debajo del indicador de
  pasos, el botón secundario **"¿Cómo armo el archivo?"**. No está en el paso 3. Mientras dice
  "Importando…", está deshabilitado.
- **Diálogo "Cómo armar el archivo"** (`role="dialog"`, `aria-modal="true"`). Contenido exacto, de
  arriba hacia abajo:
  - Título: "Cómo armar el archivo".
  - Texto: "Podés usar tu propia planilla o empezar desde la plantilla. Lo que importa es la primera fila
    y que haya un movimiento por fila."
  - Lista numerada de seis pasos:
    1. "En la primera fila van los encabezados. Fecha, Tipo, Monto, Moneda y Cuenta son obligatorios;
       Tipo de cambio, Categoría, Cuotas, Cuotas pendientes y Nota son opcionales."
    2. "Escribí la fecha como DD/MM/AAAA o usá una celda de fecha de Excel. No puede ser posterior a
       hoy."
    3. "En Tipo poné Gasto o Ingreso, y en Moneda, ARS o USD. Si es USD, completá el tipo de cambio de
       esa compra."
    4. "La categoría y la cuenta tienen que existir en Biyu con el mismo nombre. Las mayúsculas no
       importan; las tildes sí. Un gasto necesita categoría."
    5. "Si compraste en cuotas con tarjeta de crédito, poné el monto total de la compra (no el de una
       cuota) y la cantidad en Cuotas (hasta 12). Si ya pagaste algunas, poné en Cuotas pendientes
       cuántas te faltan, contando la de este mes: en una compra de 6 cuotas con 3 pagadas, van 3. La
       fecha es la de la compra. Si dejás Cuotas pendientes vacía, se cargan todas las cuotas desde el
       mes de la fecha."
    6. "Antes de importar vas a ver qué filas tienen errores y por qué. Las que están bien se importan
       aunque otras fallen."
  - Tabla "Ejemplo", con los encabezados de la plantilla (US-80 · CA-1) y dos filas:

    | Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota |
    |---|---|---|---|---|---|---|---|---|---|
    | 01/09/2026 | Gasto | 45800 | ARS | | Comida y supermercado | Tarjeta de débito | | | Compra del mes |
    | 10/06/2026 | Gasto | 120000 | ARS | | Otros | Tarjeta de crédito | 6 | 3 | Heladera |

  - Pie: "Hasta 500 filas y 1 MB. Solo se lee la primera hoja."
  - Botones: "Descargar plantilla" (baja el mismo archivo que el botón del paso 1) y "Entendido"
    (cierra). Arriba a la derecha, un botón de cerrar con `aria-label="Cerrar guía"`.
- **Comportamiento:**
  - **Cerrada por defecto.** Entrar a `/import` nunca la abre sola, tampoco la primera vez, y no se
    recuerda si se abrió antes.
  - **Se puede saltear.** No hace falta abrirla para elegir un archivo ni para importar. Nada se
    deshabilita ni avisa por no haberla abierto.
  - Abrirla y cerrarla no cambia el paso, el archivo elegido, el filtro ni la URL, y no escribe nada.
  - Sigue la regla de diálogos de DEF-024; acá el foco inicial va al botón de cerrar. Al abrir, el foco
    va al botón de cerrar; Tab y Shift+Tab no salen del diálogo; Escape lo cierra; tocar fuera del diálogo
    lo cierra; al cerrarse por cualquier vía, el foco vuelve a "¿Cómo armo el archivo?".
  - En el celular (390 px de ancho) ocupa el ancho de la pantalla menos 16 px por lado y su contenido
    scrollea por dentro. La tabla de ejemplo scrollea horizontal dentro de su caja: la página no tiene
    scroll horizontal.
- **`data-testid`:**

  | Elemento | `data-testid` |
  |---|---|
  | Botón "¿Cómo armo el archivo?" | `import-guide-open` |
  | Diálogo | `import-guide-dialog` |
  | Lista de pasos | `import-guide-steps` |
  | Tabla de ejemplo | `import-guide-example` |
  | Botón "Descargar plantilla" del diálogo | `import-guide-template-download` |
  | Botón "Entendido" | `import-guide-done` |
  | Botón de cerrar | `import-guide-close` |

- **Criterios de aceptación:**
  - CA-1: Al entrar a `/import`, `import-guide-dialog` no está en el DOM y se ve "¿Cómo armo el
    archivo?" en el paso 1. Recargar o volver a entrar no lo abre.
  - CA-2: Tocar "¿Cómo armo el archivo?" abre el diálogo con el título, el texto, los seis pasos, la
    tabla de ejemplo y el pie, todos exactos.
  - CA-3: "Entendido", el botón de cerrar, Escape y un toque fuera del diálogo lo cierran. En los
    cuatro casos el foco vuelve a "¿Cómo armo el archivo?".
  - CA-4: Al abrir, el foco está en el botón de cerrar. Con Tab y Shift+Tab repetidos, el foco nunca
    sale del diálogo.
  - CA-5: "Descargar plantilla" del diálogo baja `biyu-plantilla-importacion.xlsx` con las mismas hojas
    y el mismo contenido de celdas que el del paso 1 (US-80 · CA-1).
  - CA-6: Elegir un archivo e importar sin haber abierto nunca la guía funciona igual que en US-77.
  - CA-7: En el paso 2 con un archivo elegido, abrir y cerrar la guía deja el mismo archivo, el mismo
    resumen y el mismo estado del filtro "Ver solo filas con error". La URL no cambia.
  - CA-8: En el paso 3 no está `import-guide-open`. Mientras dice "Importando…", está deshabilitado.
  - CA-9: A 390 × 844, el diálogo entra en la pantalla con 16 px de margen por lado,
    `document.documentElement.scrollWidth` no supera el ancho de la ventana, y la tabla de ejemplo se
    puede recorrer con scroll horizontal dentro de su caja.
  - CA-10: Todos los elementos de la tabla de `data-testid` lo tienen.
- **Trazabilidad:** US-74 · US-80 · ADR-023 · DEF-024
- **Casos de prueba:** a diseñar

### Especificación compartida

Las secciones 1 a 9 y 12 valen para las cuatro historias.

#### 1. Dónde se importa y estructura de la pantalla

**Entrada.** En **Registrar** (`/register`), en el encabezado y visible en los tres pasos del
registro, un botón secundario **"Importar desde Excel"** que navega a `/import`. Importar es otra forma
de registrar, y Registrar es la pantalla de inicio (US-01): queda a la vista sin sumar una pestaña a la
barra. El botón no cambia nada del registro manual: el foco sigue arrancando en el monto (US-02). Es
una ruta privada: sin sesión redirige a `/login?next=/import` (US-48).

**Encabezado.** Botón "Registrar" (volver) y el título "Importar desde Excel". Debajo, un indicador de
tres pasos ("1 Archivo · 2 Revisión · 3 Resultado") con el paso actual marcado. El paso vive en el
estado de la pantalla, no en la URL: recargar vuelve al paso 1 sin archivo elegido (el archivo se lee
en el navegador y no se guarda en ningún lado).

**Plurales.** Los textos con un número usan singular cuando el número es 1: "1 fila leída", "1 lista
para importar", "1 con error", "Importar 1 movimiento", "Vas a importar 1 movimiento", "Se importó 1 de
<T> filas." (y "de 1 fila" si T = 1), "1 fila no se importó:". En las tablas de abajo se escribe la
forma plural.

**Paso 1 · Archivo.**

| Elemento | Texto | Comportamiento |
|---|---|---|
| Texto de ayuda | "Subí una planilla .xlsx con un movimiento por fila. La primera fila tiene que tener los encabezados de la plantilla." | — |
| Botón secundario | "Descargar plantilla" | Descarga `biyu-plantilla-importacion.xlsx`, generado en el navegador: hoja 1 "Movimientos" con solo la fila de encabezados de la sección 2, en ese orden; hoja 2 "Instrucciones" con la tabla de columnas de la sección 2 |
| Zona de archivo | "Elegir archivo .xlsx" (botón) y "o arrastralo acá" (desktop) | Abre el selector del sistema filtrado a `.xlsx`. Al elegir un archivo se valida (sección 3) y, si pasa, se va al paso 2 |
| Límites | "Hasta 500 filas y 1 MB. Solo se lee la primera hoja." | — |
| Error de archivo | Uno de los mensajes de la sección 3 | Se muestra debajo de la zona de archivo; la pantalla sigue en el paso 1 |

**Paso 2 · Revisión.** No escribe nada en la base.

| Elemento | Texto | Comportamiento |
|---|---|---|
| Nombre del archivo | "<nombre>.xlsx" | — |
| Resumen de la lectura | "<T> filas leídas · <N> listas para importar · <M> con error" | T = N + M (las filas vacías no cuentan, sección 2) |
| Monto a importar | "Vas a importar <N> movimientos: <$G> en gastos y <$I> en ingresos (en pesos)." | G e I suman el monto en ARS de cada fila lista: el monto si es ARS, y monto × tipo de cambio redondeado half-up a 2 decimales si es USD (ADR-013). Es el monto total de cada transacción, no lo que imputa a un mes. Si G o I es cero, se muestra "$0,00" |
| Columnas ignoradas | "Se ignoraron las columnas: <A>, <B>." | Solo si el archivo tiene encabezados que no son de la sección 2. En el orden del archivo |
| Aviso de duplicados | "Si ya importaste este archivo, los movimientos se van a duplicar." | Siempre visible en este paso |
| Filtro | Interruptor "Ver solo filas con error" | Apagado por defecto. Prendido, la lista muestra solo las M filas con error. Deshabilitado si M = 0 |
| Lista de filas | Una tarjeta por fila con datos, en el orden del archivo | Cada tarjeta: "Fila <n>" (número de fila de Excel), fecha DD/MM/AAAA, tipo, monto con su moneda ("$45.800,00" o "US$12,50"), categoría, cuenta, en USD el tipo de cambio ("TC 1.450,00") y, si hay más de una, "<k> cuotas". Etiqueta de estado "Lista" (verde) o "Con error" (bordó); con error, debajo, cada mensaje de la sección 4 en una línea. Una celda que no se pudo interpretar se muestra con el texto que tenía |
| Botón secundario | "Elegir otro archivo" | Vuelve al paso 1 sin archivo y sin escribir nada |
| Botón principal | "Importar <N> movimientos" | Habilitado si N ≥ 1. Con N = 0 queda deshabilitado y debajo dice "No hay filas listas para importar" |

**Mientras importa.** Al tocar "Importar <N> movimientos" el botón pasa a "Importando…" y queda
deshabilitado junto con "Elegir otro archivo" hasta que llega la respuesta o pasan **30 segundos**
(tiempo de espera del cliente). Se hace **una sola** llamada a la base (ADR-035): no hay barra de
progreso por fila. Salir de la pantalla en este estado pide confirmación (sección 8).

**Paso 3 · Resultado.**

| Elemento | Texto | Comportamiento |
|---|---|---|
| Título | "Se importaron <K> de <T> filas." | K = filas creadas en la base; T = el mismo T del paso 2 |
| Monto importado | "<$G'> en gastos y <$I'> en ingresos (en pesos)." | Igual que en el paso 2, pero solo sobre las K filas creadas |
| Lista de no importadas | "<T−K> filas no se importaron:" y una línea por fila: "Fila <n>: <mensaje>" | Solo si T − K > 0. Incluye las M filas con error del paso 2 y las que rechazó la base (sección 5). Ordenadas por número de fila. Una fila con varios errores muestra los mensajes separados por " · " |
| Botón principal | "Ver en Movimientos" | Navega a `/transactions?period=<AAAA-MM>` (C11), donde AAAA-MM es el mes de la **fecha** (`occurred_on`) más reciente entre las K filas creadas; no el de su última cuota. Si K = 0, no se muestra |
| Botón secundario | "Importar otro archivo" | Vuelve al paso 1 vacío |

#### 2. Formato del archivo

| Propiedad | Valor |
|---|---|
| Extensión aceptada | Solo `.xlsx` (Excel 2007 en adelante, o LibreOffice/Google Sheets exportado como .xlsx). No se aceptan `.xls`, `.csv`, `.ods` ni `.numbers` (sección 9) |
| Tamaño máximo | 1 MB (1.048.576 bytes). Un archivo de exactamente 1.048.576 bytes se acepta |
| Hoja que se lee | Solo la **primera hoja** del libro. Las demás se ignoran sin aviso |
| Fila de encabezados | La fila 1 de la primera hoja. Los datos empiezan en la fila 2 |
| Cantidad de filas | Entre 1 y **500** filas con datos. Una fila es "vacía" si todas sus celdas de las columnas de la tabla de abajo están vacías o tienen solo espacios: se saltea y no cuenta para T ni para el límite |
| Número de fila | El número de fila de Excel (la primera fila de datos es la 2). Las filas vacías salteadas conservan su número: no se renumera |
| Fórmulas | Se usa el valor calculado que quedó guardado en el archivo, con la regla de celdas numéricas de abajo |
| Celdas combinadas, formato, colores, comentarios | Se ignoran; se lee el valor de cada celda |
| Texto de las celdas | Toda celda de texto se lee sin los espacios del principio y del final, y normalizada a Unicode NFC (una tilde escrita como carácter aparte cuenta igual que la tilde compuesta) |

**Columnas.** Los encabezados se reconocen sin distinguir mayúsculas ni tildes, e ignorando espacios
al principio y al final ("categoria", " CATEGORÍA " y "Categoría" son la misma columna). Pueden estar
en cualquier orden. Cualquier otro encabezado se ignora y se lista en el paso 2.

- **Encabezados obligatorios** (sin ellos, el archivo se rechaza con A4): Fecha, Tipo, Monto, Moneda,
  Cuenta.
- **Encabezados opcionales**: Tipo de cambio, Categoría, Cuotas, Nota (y Cuotas pendientes desde
  US-80). Si la columna no está, se trata
  como vacía en todas las filas: un archivo solo en ARS no necesita "Tipo de cambio", pero sin
  "Categoría" todo gasto da F14a.

| Encabezado | Celda obligatoria | Qué va | Formatos aceptados |
|---|---|---|---|
| Fecha | Sí | Fecha del movimiento (`occurred_on`) | Celda con formato de fecha de Excel (si tiene hora, se toma solo el día; se respeta el sistema de fechas del libro, 1900 o 1904), o texto `DD/MM/AAAA` con día y mes de 1 o 2 dígitos ("5/9/2026" vale). Una celda numérica **sin** formato de fecha (por ejemplo 46000) no es una fecha: da F2. No hay fecha mínima, igual que en Registrar |
| Tipo | Sí | `Gasto` o `Ingreso` | Texto, sin distinguir mayúsculas |
| Monto | Sí | Monto total del movimiento, siempre positivo (el signo lo da Tipo, I4). En una compra en cuotas va el total de la compra, no el valor de una cuota | Celda numérica, o texto con el mismo criterio que el monto de Registrar (`tryParseMoney`): "1234,56", "1.234,56", "1234.56"; un punto seguido de grupos de 3 dígitos es separador de miles ("1.500" = 1500). Sin símbolo de moneda ni espacios internos |
| Moneda | Sí | `ARS` o `USD` | Texto, sin distinguir mayúsculas |
| Tipo de cambio | Solo si Moneda = USD | Pesos por dólar de **esa** fila (`fx_rate`, se congela, C5) | Celda numérica o texto con el criterio de Monto, hasta 4 decimales. No se completa con el tipo de cambio de referencia del mes (sección 9) |
| Categoría | Sí si Tipo = Gasto | Nombre de una categoría **activa** del usuario | Se compara sin distinguir mayúsculas; las tildes **sí** cuentan, porque "Educación" y "Educacion" pueden ser dos categorías distintas (índice `lower(name)`, `04-data-model.md`). En un Ingreso es opcional; si viene, tiene que existir |
| Cuenta | Sí | Nombre de una cuenta **activa** del usuario | Mismo criterio que Categoría |
| Cuotas | No (vacía = 1) | Cantidad de cuotas de la compra; solo en un Gasto con cuenta de tarjeta de crédito | Entero de 1 a 12, celda numérica o texto |
| Nota | No | Descripción | Texto libre. Vacía = sin descripción (US-08) |

**Celdas numéricas y C2.** Excel guarda los números como binario de punto flotante: una fórmula
`=0,1*3` guarda 0,30000000000000004 aunque muestre "0,3". Por eso una celda numérica (de Monto, Tipo de
cambio o Cuotas) se redondea a **15 dígitos significativos**, la precisión que muestra Excel, se escribe
como texto decimal sin notación exponencial y recién ahí se parsea con `decimal.js`. `=0,1*3` se lee
como 0,3; `=100/3` como 33,3333333333333 y da F9. Ningún monto se opera como `number` y a la base
llega como texto.

#### 3. Validación del archivo (rechaza el archivo entero)

Se evalúan en este orden; el primero que falla se muestra y el archivo no pasa al paso 2. No se
escribe nada.

| # | Regla | Mensaje exacto |
|---|---|---|
| A1 | La extensión no es `.xlsx` (sin distinguir mayúsculas) | "Solo se aceptan archivos .xlsx (Excel)." |
| A2 | Pesa más de 1.048.576 bytes | "El archivo pesa más de 1 MB. Dividilo en varios archivos." |
| A3 | No se puede abrir como .xlsx (dañado, protegido con contraseña, o con extensión .xlsx pero otro formato) | "No pudimos leer el archivo. Abrilo en Excel, guardalo como .xlsx y probá de nuevo." |
| A4 | Falta uno o más de los encabezados obligatorios (Fecha, Tipo, Monto, Moneda, Cuenta) en la fila 1 | "Faltan columnas: <C1>, <C2>. La primera fila tiene que tener los encabezados de la plantilla." con las faltantes en ese orden; si falta una sola, "Falta la columna: <C1>. La primera fila tiene que tener los encabezados de la plantilla." |
| A5 | Un encabezado de la sección 2 aparece dos veces | "La columna <C> está repetida. Dejá una sola." |
| A6 | No hay ninguna fila con datos debajo de los encabezados | "El archivo no tiene filas con datos debajo de los encabezados." |
| A7 | Hay más de 500 filas con datos | "El archivo tiene <T> filas con datos y el máximo es 500. Dividilo en varios archivos." |

#### 4. Validación fila por fila

Las reglas son las del alta manual (I4–I8, FR-06, DEF-012, DEF-013, DEF-018; `validateTransactionDraft`
en `src/domain/validation.ts`), pero **los mensajes son propios de la importación**, porque nombran la
columna de la planilla y no un campo del formulario: algunos difieren a propósito de los de Registrar
("Fecha inválida: usá DD/MM/AAAA" en lugar de "Fecha inválida"). Al implementarse, la regla se reusa
desde `src/domain/` y se traduce a estos mensajes; no se copia (C1). Esta validación es solo de
experiencia de uso: la base vuelve a validar cada fila al importar (C6, sección 5). "Hoy" es el día
calendario de Argentina (ADR-021), el mismo que usa Registrar.

**Orden y dependencias.** Se evalúan las reglas en el orden de la tabla y se muestra **a lo sumo un
mensaje por columna** (el primero que falla en esa columna). Una regla que depende de otra columna se
evalúa solo si esa columna no tuvo error:

| Regla | Se evalúa solo si no tuvieron error |
|---|---|
| F13a, F13b (tipo de cambio según moneda) | Moneda |
| F14a (categoría obligatoria en un gasto) | Tipo |
| F15 (cuotas solo con tarjeta de crédito) | Tipo, Cuenta y Cuotas |
| F16, F18 (equivalente en pesos) | Monto, Moneda y Tipo de cambio |
| F17 (cuota menor a 0,01) | Monto, Moneda, Tipo de cambio y Cuotas |

Ejemplo: con Moneda "EUR" y Tipo de cambio "1450", la fila muestra solo F12. Una fila es **"Lista"**
si no tiene ningún mensaje.

| # | Columna | Regla | Mensaje exacto |
|---|---|---|---|
| F1 | Fecha | Vacía | "Falta la fecha" |
| F2 | Fecha | No es fecha de Excel ni texto `DD/MM/AAAA`, o es una fecha inexistente (31/02/2026) | "Fecha inválida: usá DD/MM/AAAA" |
| F3 | Fecha | Posterior a hoy | "La fecha no puede ser futura" |
| F4 | Tipo | Vacío | "Falta el tipo" |
| F5 | Tipo | No es Gasto ni Ingreso | "Tipo inválido: escribí Gasto o Ingreso" |
| F6 | Monto | Vacío | "Falta el monto" |
| F7 | Monto | No es un número en los formatos de la sección 2 | "Monto inválido: usá un número, por ejemplo 1234,56" |
| F8 | Monto | Menor o igual a cero (I4) | "El monto debe ser mayor a cero" |
| F9 | Monto | Más de 2 decimales | "El monto admite hasta 2 decimales" |
| F10 | Monto | Mayor a 999.999.999.999,99 (DEF-012) | "El monto máximo es $999.999.999.999,99" |
| F11 | Moneda | Vacía | "Falta la moneda" |
| F12 | Moneda | No es ARS ni USD | "Moneda inválida: escribí ARS o USD" |
| F13a | Tipo de cambio | Moneda USD y celda vacía (I5) | "Falta el tipo de cambio" |
| F13b | Tipo de cambio | Moneda ARS y celda no vacía (I5) | "Una transacción en ARS no lleva tipo de cambio" |
| F13c | Tipo de cambio | Moneda USD y no es un número, o es menor o igual a cero | "Tipo de cambio inválido: usá un número mayor a cero" |
| F13d | Tipo de cambio | Moneda USD y más de 4 decimales (DEF-018) | "Usá hasta 4 decimales en el tipo de cambio" |
| F13e | Tipo de cambio | Moneda USD y mayor a 9.999.999.999,9999 | "El tipo de cambio es demasiado grande" |
| F14a | Categoría | Vacía y Tipo = Gasto (I8) | "Falta la categoría (es obligatoria en un gasto)" |
| F14b | Categoría | No vacía y no coincide con ninguna categoría activa | "No existe la categoría «<valor>» o está archivada" |
| F14c | Cuenta | Vacía | "Falta la cuenta" |
| F14d | Cuenta | No coincide con ninguna cuenta activa | "No existe la cuenta «<valor>» o está archivada" |
| F14e | Cuotas | No es un entero entre 1 y 12 | "Las cuotas van de 1 a 12" |
| F15 | Cuotas | Más de 1 cuota y no es un Gasto con cuenta de tipo Tarjeta de crédito (I6) | "Solo los gastos con tarjeta de crédito admiten cuotas" |
| F16 | Monto | Moneda USD y monto × tipo de cambio supera 999.999.999.999,99 (DEF-012) | "En pesos daría más que el máximo de $999.999.999.999,99" |
| F17 | Cuotas | Más de 1 cuota y la cuota base (monto ÷ cuotas, truncado a 2 decimales) da menos de 0,01, en la moneda o en pesos (I4, ADR-013) | "Con ese monto, cada cuota daría menos de 0,01" |
| F18 | Monto | 1 cuota, USD y el equivalente en pesos da menos de $0,01 (DEF-013) | "En pesos daría menos de $0,01. Revisá el monto o el tipo de cambio" |

`<valor>` es el texto de la celda ya recortado. Nota no tiene reglas. Si F16 y F18 aplicaran a la vez
sobre Monto, se muestra F16 (primera en la tabla dentro de la columna).

#### 5. Filas válidas y con error: qué se importa

1. **Se importan solo las filas "Lista".** Las filas con error del paso 2 no se envían a la base y
   aparecen en el resultado como no importadas, con sus mensajes. No hace falta corregirlas para
   importar las demás.
2. **Cada fila es atómica por separado** (C4): se crea con `create_transaction`, que escribe la
   transacción y sus imputaciones juntas o ninguna. Una fila que la base rechaza no deja nada escrito
   y no impide que se creen las otras (ADR-035).
3. **La base revalida cada fila** (C6). Si rechaza una fila que el paso 2 dio por "Lista" (por
   ejemplo, la categoría se archivó en otra pestaña entre la revisión y la importación), la fila
   figura en el resultado como no importada. El mensaje sale del texto de error de
   `create_transaction`, que es contrato (lo fijan sus tests pgTAP):

   | El error de la base empieza con | Mensaje en el resultado |
   |---|---|
   | "la cuenta no existe, no es tuya o está archivada" | "No existe la cuenta «<valor>» o está archivada" |
   | "la categoría no existe, no es tuya o está archivada" | "No existe la categoría «<valor>» o está archivada" |
   | "FR-06: la fecha no puede ser posterior a hoy" | "La fecha no puede ser futura" |
   | Cualquier otro | "La base rechazó esta fila: <mensaje del servidor>" |

   `create_transaction` valida la cuenta antes que la categoría: si las dos están archivadas, la fila
   muestra solo el mensaje de la cuenta.
4. **Lo importado es un movimiento como cualquier otro.** Sale en Movimientos y en el Resumen, imputa
   sus cuotas desde el mes de su fecha (I2, I3; **modificado por US-80:** una compra empezada imputa
   desde el mes de hoy), se puede eliminar de a uno (US-65) y no tiene marca
   de "importado". No cambia la cuenta precargada de Registrar (US-07).
5. **No se detectan duplicados** contra movimientos existentes: importar dos veces el mismo archivo
   crea todo dos veces. Por eso el aviso del paso 2.

#### 6. Archivo de ejemplo y resumen esperado

Esta tabla **es** el contenido de la hoja "Movimientos" de `importar-excel-ejemplo.xlsx`; si el
archivo y la tabla difieren, vale la tabla. Fechas como celdas de fecha de Excel, salvo la fila 11,
que tiene fecha y monto como texto. Celdas vacías: "—".

| Fila | Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Nota | Estado esperado |
|---|---|---|---|---|---|---|---|---|---|---|
| 2 | 01/09/2026 | Gasto | 45800 | ARS | — | Comida y supermercado | Tarjeta de débito | 1 | Compra del mes | Lista |
| 3 | 03/09/2026 | Gasto | 240000 | ARS | — | Indumentaria | Tarjeta de crédito | 6 | Campera | Lista |
| 4 | 05/09/2026 | Gasto | 12,5 | USD | 1450 | Entretenimiento | Tarjeta de crédito | — | Juego online | Lista ($18.125,00) |
| 5 | 08/09/2026 | Ingreso | 850000 | ARS | — | — | Cuenta bancaria | — | Sueldo | Lista |
| 6 | 10/09/2026 | Gasto | 3200 | ARS | — | Transporte | Billetera virtual | — | Carga SUBE | Lista |
| 7 | 12/09/2026 | Gasto | 0 | ARS | — | Salud | Efectivo | — | Farmacia | F8 |
| 8 | 15/09/2026 | Gasto | 30 | USD | — | Otros | Efectivo | — | Regalo | F13a |
| 9 | 18/09/2026 | Gasto | 15000 | ARS | — | Mascotas | Efectivo | — | Veterinaria | F14b |
| 10 | 20/09/2026 | Gasto | 60000 | ARS | — | Educación | Efectivo | 3 | Curso | F15 |
| 11 | "22/09/2026" | Gasto | "9.990,50" | ARS | — | Servicios | Cuenta bancaria | — | Internet | Lista |
| 12 | — | — | — | — | — | — | — | — | — | Vacía, se saltea |
| 13 | 25/09/2026 | Gasto | 7800 | ARS | — | Comida y supermercado | Efectivo | — | Verdulería | Lista |

Gastos de las filas Lista: 45.800 + 240.000 + 18.125 + 3.200 + 9.990,50 + 7.800 = **$324.915,50**.
Ingresos: **$850.000,00**. Con un usuario sembrado (US-43 sin cambios) y hoy posterior al 25/09/2026,
el paso 3 muestra exactamente:

- "Se importaron 7 de 11 filas."
- "$324.915,50 en gastos y $850.000,00 en ingresos (en pesos)."
- "4 filas no se importaron:"
  - "Fila 7: El monto debe ser mayor a cero"
  - "Fila 8: Falta el tipo de cambio"
  - "Fila 9: No existe la categoría «Mascotas» o está archivada"
  - "Fila 10: Solo los gastos con tarjeta de crédito admiten cuotas"

El gasto de la fila 3 ($240.000,00 en 6 cuotas) suma completo en "gastos", aunque en septiembre imputa
$40.000,00. "Ver en Movimientos" lleva a `/transactions?period=2026-09`.

#### 7. Errores de toda la importación

Si la llamada falla entera, no hay paso 3: la pantalla sigue en el paso 2 con un mensaje arriba del
botón y el botón principal pasa a **"Reintentar"**, que repite la misma importación con el mismo
identificador (ADR-035).

| Qué pasa | Qué se sabe | Mensaje exacto |
|---|---|---|
| Sin respuesta: sin conexión, corte o 30 s sin respuesta | Puede haberse guardado o no | "No pudimos confirmar la importación. Puede que se haya guardado: tocá Reintentar y te decimos qué pasó." |
| La base responde que la sesión venció (`42501`) | No se guardó nada | "Tu sesión venció y no se importó ninguna fila. Volvé a entrar y subí el archivo de nuevo." (en este caso no hay "Reintentar": el botón lleva a `/login?next=/import`) |
| La base responde que se agotó su tiempo (`57014`) | No se guardó nada | "La importación tardó demasiado y no se importó ninguna fila. Dividí el archivo en partes más chicas." |
| Cualquier otro error con respuesta | No se guardó nada | "No se importó ninguna fila. Probá de nuevo en un rato." |

Al reintentar:

- si la importación no se había guardado, se importa ahora y se ve el paso 3;
- si ya se había guardado, no se crea nada nuevo y se ve el paso 3 con el resultado original y, arriba,
  "Esta importación ya se había guardado.";
- si la primera llamada todavía está corriendo en la base, el reintento espera a que termine y
  responde como en el caso anterior (ADR-035).

#### 8. Salir de la pantalla con una importación pendiente

Mientras dice "Importando…" o mientras se ve el mensaje "No pudimos confirmar la importación…", tocar
"Registrar" (volver), un destino de la barra de navegación o "Elegir otro archivo" abre el diálogo **"¿Salir sin
saber si se importó?"** con el texto "Puede que la importación se haya guardado. Si salís, revisá
Movimientos antes de volver a importar este archivo." y los botones **"Quedarme"** (cierra el diálogo)
y **"Salir igual"** (hace lo que se tocó). Recargar o cerrar la pestaña en ese estado muestra el aviso
nativo del navegador de que hay cambios sin guardar. En los demás estados se sale sin preguntar.

#### 9. Fuera de alcance

| Fuera | Por qué |
|---|---|
| `.csv`, `.xls`, `.ods` | Un CSV argentino usa `;` o `,` y coma decimal según cómo se exportó: es ambigüedad que hay que especificar y probar aparte. Además el repo no admite `*.csv` (C13, `.gitignore`), así que no habría archivo de ejemplo versionable. Excel, LibreOffice y Google Sheets guardan como .xlsx |
| Re-importar el CSV de US-47 | US-47 exporta CSV, que esta historia no acepta. Las columnas comparten nombres donde coinciden, pero el ida y vuelta no es un criterio |
| Crear categorías o cuentas que no existen | Una fila con un nombre desconocido es un error (F14b, F14d), no un alta implícita. Evita que un error de tipeo cree una categoría nueva |
| Completar el tipo de cambio con el de referencia del mes (US-20) | Un archivo de muchas filas con el tipo de cambio puesto en silencio es difícil de revisar; el paso 2 mostraría montos en pesos que el usuario no escribió |
| Gastos compartidos (deudas) y suscripciones | No hay columna para eso; se cargan desde sus pantallas |
| Detección de duplicados | Necesita una regla de "mismo movimiento" que el dominio no define |
| Editar una fila dentro de la app antes de importar | Se corrige en el archivo y se vuelve a subir |
| Deshacer una importación entera | Cada movimiento importado se elimina de a uno (US-65) |
| Fechas de texto en formato `MM/DD/AAAA` | Un texto "05/09/2026" se lee siempre como 5 de septiembre. Una celda de fecha de Excel no tiene ambigüedad: vale la fecha guardada, cualquiera sea cómo se muestra |

#### 10. Criterios de aceptación

Están en cada historia, arriba. "El archivo de ejemplo" es el de la sección 6; "usuario sembrado" es un
usuario con las 8 categorías y 5 cuentas de US-43 sin cambios.

#### 11. Trazabilidad

- **Issue:** épica [#203](https://github.com/Joaconz/Biyu/issues/203), que reemplaza a [#169](https://github.com/Joaconz/Biyu/issues/169) (idea del backlog personal). Sin FR propio en la pre-entrega: lleva el alta de FR-06 a una carga por lote.
  Entra a V2 como nivel 3 del alcance de `entrega-2/README.md` y figura en la tabla de épicas de
  `docs/08-trazabilidad.md`; `docs/roadmap.md` todavía no la lista (supuesto 4).
- **Constraints:** C1 (la regla se reusa de `src/domain/`), C2 (montos como texto y `decimal.js`), C4
  (cada fila por `create_transaction`), C6 (la base revalida), C7 (RLS), C11 (enlace a Movimientos con
  `?period`), C14 (ejemplos ficticios; el archivo no se sube ni se guarda).
- **Invariantes:** I1, I1', I2, I3, I4, I5, I6, I8.
- **NFR:** NFR-10 (no duplicar al reintentar).
- **ADR:** ADR-005 (la importación usa el mismo camino de escritura que el registro manual), ADR-013
  (redondeo), ADR-021 (hoy en Argentina), ADR-023 (sistema de diseño), ADR-035 (escritura por
  lote y fallo parcial).
- **Historias relacionadas:** US-47 (exportar a CSV, la operación inversa; sección 9), US-07, US-08,
  US-09, US-11, US-14, US-19 (las validaciones de alta que se repiten por fila), US-65 (eliminar lo
  importado).

#### 12. `data-testid`

Prefijo `import-` (`docs/07-plan-de-testing.md` §2). `<n>` es el número de fila de Excel.

| Elemento | `data-testid` |
|---|---|
| Botón "Importar desde Excel" en Registrar | `register-import` |
| Botón "Registrar" (volver) | `import-back` |
| Indicador de pasos | `import-steps` (con `data-step="1"`, `"2"` o `"3"`) |
| Botón "Descargar plantilla" | `import-template-download` |
| Botón "Elegir archivo .xlsx" | `import-file-pick` |
| `<input type="file">` | `import-file-input` |
| Zona para arrastrar | `import-file-dropzone` |
| Error de archivo (A1–A7) | `import-file-error` |
| Nombre del archivo | `import-file-name` |
| Resumen de la lectura | `import-summary` |
| Monto a importar | `import-summary-amounts` |
| Columnas ignoradas | `import-ignored-columns` |
| Aviso de duplicados | `import-duplicates-warning` |
| Interruptor "Ver solo filas con error" | `import-filter-errors` |
| Lista de filas | `import-rows` |
| Tarjeta de una fila | `import-row-<n>` (con `data-status="ready"` o `"error"`) |
| Mensajes de error de una fila | `import-row-<n>-errors` |
| Botón "Elegir otro archivo" | `import-change-file` |
| Botón "Importar N movimientos" / "Importando…" / "Reintentar" / volver a entrar | `import-submit` |
| Texto "No hay filas listas para importar" | `import-submit-hint` |
| Mensaje de error de toda la importación (sección 7) | `import-batch-error` |
| Diálogo "¿Salir sin saber si se importó?" | `import-leave-dialog` |
| Botón "Quedarme" | `import-leave-stay` |
| Botón "Salir igual" | `import-leave-confirm` |
| Título del resultado | `import-result-title` |
| Aviso "Esta importación ya se había guardado." | `import-result-already` |
| Monto importado | `import-result-amounts` |
| Lista de no importadas | `import-result-rejected` |
| Línea de una fila no importada | `import-result-row-<n>` |
| Botón "Ver en Movimientos" | `import-go-transactions` |
| Botón "Importar otro archivo" | `import-again` |

#### 13. Supuestos de esta historia

1. La entrada va en Registrar y no en Ajustes ni en una pestaña nueva: es una carga, como el registro
   manual, y una quinta pestaña ocuparía un lugar fijo para algo que se usa poco.
2. El límite de 500 filas y 1 MB es de esta historia, no de la base. Alcanza para un año de gastos de
   una persona. Si al implementar 500 filas de 12 cuotas no entran en una sola llamada, se baja el límite
   (ADR-035), no se parte la llamada.
3. El archivo se lee en el navegador; a la base solo llegan las filas "Lista" ya convertidas. El
   archivo no se guarda en Supabase Storage ni en ningún otro lado (C14).
4. Esta entrega edita `docs/08-trazabilidad.md` (fila de la épica) y no toca `docs/02-behavior-spec.md`,
   `docs/roadmap.md` ni `docs/03-architecture-spec.md`. Al aceptarse hay que sumar las historias a los
   dos primeros y extender C4 y C7 en el tercero con la RPC de ADR-035.
5. US-80 y US-81 se agregaron el 2026-10-08 desde los pendientes de producto
   ([#268](https://github.com/Joaconz/Biyu/issues/268) y [#269](https://github.com/Joaconz/Biyu/issues/269)).
   Las secciones 1 a 12 describen la importación hasta US-78. Lo que agregan US-80 (columna "Cuotas
   pendientes", reglas F19 a F21, plantilla de 10 columnas) y US-81 (la guía) está en cada historia y
   vale desde que se implementa. La idea original pedía además una columna "Es cuota" y hasta 24 cuotas:
   no se agregan, porque "Es cuota" se deduce de Cuotas > 1 y el máximo de 12 es el de la base
   (`transactions_installments_max`, US-12).

---

## Parte 6 · Resumen por categoría

_Fuente: `entrega-2/historias/dashboard-categorias.md`._

Feature del nivel 2 de V2 (`entrega-2/README.md`, "Alcance de V2"). Son dos historias nuevas que
reemplazan las ideas del backlog [#170](https://github.com/Joaconz/Biyu/issues/170) y
[#171](https://github.com/Joaconz/Biyu/issues/171). Siguen el formato de
`entrega-1/01-historias-de-usuario.md`: objetivo, pantallas y campos, criterios `CA-k` y trazabilidad.
Todavía no tienen casos `CP-*`; se diseñan en `02-especificacion-casos-v2`.

Las dos historias reabren la decisión de gráficos del dashboard que se tomó en V1 (FR-20,
[#78](https://github.com/Joaconz/Biyu/issues/78)). El detalle está en
[ADR-038](../docs/adr/038-torta-por-categoria-y-detalle.md), que también actualiza FR-20.

### Reglas comunes a las dos historias

- **De dónde sale cada monto.** De las imputaciones materializadas del período (`ledger_entries`,
  ADR-001), en ARS y con el tipo de cambio congelado (`amount_ars`, I1', C5). El cliente no
  recalcula nada a partir de la transacción.
- **Qué entra.** Solo las imputaciones de **gastos** (`type = 'expense'`) de transacciones **no
  eliminadas** (I10). Los **ingresos** no aparecen en ningún gráfico ni lista de estas historias,
  aunque tengan categoría: la RPC acepta `p_category_id` en un ingreso cargado por API (fila 16 de
  D1). Siguen sumando en la tarjeta "Ingresos" de US-29.
- **Cuotas heredadas.** Una compra en cuotas le suma a su categoría, en cada período, solo la cuota
  que cae en ese período. Por ejemplo, $45.000,00 en 3 cuotas desde agosto le suma $15.000,00 a
  septiembre, no $45.000,00.
- **Categorías archivadas.** Si tienen gasto en el período, aparecen igual que las activas, con la
  marca "archivada" (US-27, US-44). Archivar una categoría no cambia montos ni porcentajes.
- **Porcentaje de una categoría.** Es `monto de la categoría en el período ÷ total gastado del
  período × 100`, redondeado a 1 decimal con `ROUND_HALF_UP` (el medio redondea hacia arriba:
  31,25 → 31,3). Se muestra con coma decimal y un espacio antes del signo: "40,0 %". El total gastado
  del período es el mismo número de la tarjeta "Gastado en <mes>" (US-25), con las cuotas heredadas
  y los gastos en USD convertidos. Si ese total es $0,00, el porcentaje es "0,0 %". Los porcentajes
  no se ajustan para que sumen 100: tres categorías de $100,00 muestran "33,3 %" cada una y suman
  99,9 %.
- **Orden de las categorías.** Primero por monto, de mayor a menor. A igual monto, por nombre en orden
  alfabético español, sin distinguir mayúsculas. Si también coincide el nombre (solo pasa entre una
  activa y una archivada, o entre dos archivadas, porque el nombre es único entre las activas), va
  primero la activa, y entre dos archivadas, la de `id` menor. _El desempate es nuevo: US-27 no lo
  definía._
- **Montos.** Formato argentino, sin espacio después del signo: "$60.000,00", "US$10,00" (C2).
- **Período.** Vive en la URL como `?period=AAAA-MM` (C11). Un valor ausente o inválido
  (`?period=2026-13`, `?period=hola`) se reemplaza por el período actual sin agregar una entrada al
  historial del navegador, igual que hoy en el Resumen. Elegir otro mes con el selector **sí** agrega
  una entrada al historial, así que Atrás vuelve al mes anterior.
- **Cómo simular un error de red.** Bloquear las solicitudes al dominio de Supabase: en DevTools,
  pestaña Network, clic derecho en una solicitud a `*.supabase.co` y "Block request domain". Después
  recargar la página. Cortar toda la red no sirve, porque la app no tiene service worker y el
  navegador no llega a cargarla.
- **Fuera de alcance.** Cambiar la categoría de una transacción ya cargada. ADR-009 define que la
  edición regenera las imputaciones y US-84 (ADR-043) la implementa en V2; se prueba en esa
  historia, no acá.

#### Datos de ejemplo

Todos los montos son ficticios (C14). "Hoy" es 2026-10-06. Cada conjunto usa un usuario propio con
la siembra de US-43, y las filas se cargan en el orden de la tabla. Salvo la fila 16, todas se cargan
por la UI.

**D1, usuario `qa-categorias`.** Suma una categoría propia, "Viajes" (color musgo `#6f7d4a`), que se
archiva el 2026-09-30, después de cargar la fila 8.

| # | Fecha | Tipo | Categoría | Cuenta | Monto | Cuotas | Imputa en 2026-09 |
|---|---|---|---|---|---|---|---|
| 1 | 2026-09-05 | Gasto | Comida y supermercado | Billetera virtual | $8.500,00 | 1 | $8.500,00 |
| 2 | 2026-09-14 | Gasto | Comida y supermercado | Tarjeta de crédito | $18.700,00 | 1 | $18.700,00 |
| 3 | 2026-09-14 | Gasto | Comida y supermercado | Efectivo | $8.300,00 | 1 | $8.300,00 |
| 4 | 2026-09-28 | Gasto | Comida y supermercado | Tarjeta de débito | $24.500,00 | 1 | $24.500,00 |
| 5 | 2026-09-10 | Gasto | Transporte | Tarjeta de débito | $37.500,00 | 1 | $37.500,00 |
| 6 | 2026-09-02 | Gasto | Servicios | Cuenta bancaria | $22.500,00 | 1 | $22.500,00 |
| 7 | 2026-08-20 | Gasto | Indumentaria | Tarjeta de crédito | $45.000,00 | 3 | $15.000,00 (cuota 2/3) |
| 8 | 2026-09-12 | Gasto | Viajes | Efectivo | US$10,00 a TC 1.500 | 1 | $15.000,00 |
| 9 | 2026-09-01 | Ingreso | — | Cuenta bancaria | $500.000,00 | 1 | (ingreso) |
| 10 | 2026-09-15 | Gasto, **eliminado** después de cargarlo | Comida y supermercado | Efectivo | $9.999,00 | 1 | — (I10) |
| 11 | 2026-04-10 | Gasto | Comida y supermercado | Efectivo | $52.000,00 | 1 | — (abril) |
| 12 | 2026-05-10 | Gasto | Comida y supermercado | Efectivo | $48.500,00 | 1 | — (mayo) |
| 13 | 2026-06-10 | Gasto | Comida y supermercado | Efectivo | $55.000,00 | 1 | — (junio) |
| 14 | 2026-07-10 | Gasto | Comida y supermercado | Efectivo | $61.200,00 | 1 | — (julio) |
| 15 | 2026-08-10 | Gasto | Comida y supermercado | Efectivo | $57.800,00 | 1 | — (agosto) |
| 16 | 2026-09-20 | Ingreso **con categoría**, por API (`create_transaction` con `p_category_id` de Comida y supermercado) | Comida y supermercado | Cuenta bancaria | $7.000,00 | 1 | (ingreso) |

En septiembre 2026, D1 da **$150.000,00** de gasto: Comida y supermercado $60.000,00 (40,0 %),
Transporte $37.500,00 (25,0 %), Servicios $22.500,00 (15,0 %), Indumentaria $15.000,00 (10,0 %) y
Viajes $15.000,00 (10,0 %). Indumentaria y Viajes empatan, y va primero Indumentaria por orden
alfabético. Ingresos: $507.000,00. Días con registro: 8 de 30.

**D2 a D8.** Un usuario por conjunto, todo en septiembre 2026, gastos en una cuota con "Efectivo".

| Conjunto | Usuario | Contenido de 2026-09 | Total gastado |
|---|---|---|---|
| D2 | `qa-cat-ocho` | Comida y supermercado $40.000,00 · Transporte $30.000,00 · Servicios $20.000,00 · Salud $15.000,00 · Educación $10.000,00 · Entretenimiento $8.000,00 · Indumentaria $5.000,00 · Otros $2.000,00 | $130.000,00 |
| D3 | `qa-cat-siete` | Comida y supermercado $40.000,00 · Transporte $30.000,00 · Servicios $20.000,00 · Salud $15.000,00 · Educación $10.000,00 · Entretenimiento $8.000,00 · Indumentaria $5.000,00 | $128.000,00 |
| D4 | `qa-cat-seis` | Comida y supermercado $30.000,00 · Transporte $25.000,00 · Servicios $20.000,00 · Salud $15.000,00 · Educación $6.000,00 · Entretenimiento $4.000,00 | $100.000,00 |
| D5 | `qa-cat-tercios` | Comida y supermercado $100,00 · Servicios $100,00 · Transporte $100,00 | $300,00 |
| D6 | `qa-cat-una` | Salud $5.000,00 | $5.000,00 |
| D7 | `qa-cat-ingreso` | Solo un ingreso de $1.000,00 | $0,00 |
| D8 | `qa-cat-vacio` | Nada | $0,00 |

---

### Historias de usuario

#### Épica: Resumen mensual (dashboard)

##### US-72: Gráfico de torta del gasto por categoría en el Resumen · [#242](https://github.com/Joaconz/Biyu/issues/242) (reemplaza [#170](https://github.com/Joaconz/Biyu/issues/170))

- **Objetivo:** Como usuario, quiero ver el gasto del mes por categoría en un gráfico de torta arriba
  de la lista de categorías, para darme cuenta de un vistazo qué parte del total se lleva cada una sin
  leer los montos uno por uno.
- **Pantallas y campos:**
  - Pantalla **Resumen** (`/dashboard?period=AAAA-MM`). La estructura es la de hoy y solo cambia la
    sección "Por categoría". De arriba hacia abajo: encabezado con el selector de mes, tarjeta
    "Gastado en <mes>", tarjetas "Ingresos" y "Balance", **"Por categoría"**, "Por cuenta" y
    "Últimos movimientos". Desde 1024 px, "Por categoría" y "Por cuenta" siguen lado a lado.
  - Sección **"Por categoría"**, de arriba hacia abajo:
    1. Rótulo "Por categoría".
    2. **Gráfico de torta.** Círculo lleno, sin hueco central, centrado, de 176 px de diámetro. Tiene
       una porción por categoría con gasto en el período, en el color de la categoría (la paleta de
       ADR-023, la misma de su barra). La primera porción empieza a las 12 y las siguientes siguen en
       sentido horario, en el orden de las reglas comunes. El orden de las porciones en el DOM es ese
       mismo orden. El ángulo de cada porción es proporcional al monto exacto, no al porcentaje
       redondeado. Las porciones se separan con un filete de 2 px del color de la superficie
       (`--card`, `#fdfbf7`), así dos porciones del mismo color o de tonos parecidos no se funden.
       Una sola porción no lleva filete. La torta no tiene texto adentro.
    3. **Lista de categorías**, igual que hoy (US-27): ícono, nombre, marca "archivada" si
       corresponde, monto, porcentaje y barra de proporción. Hace de leyenda y muestra **todas** las
       categorías con gasto, aunque la torta agrupe algunas en "Resto". Ahora cada fila es también el
       acceso al detalle de la categoría (US-73). Es un `<li>` con un enlace `<a>` adentro, con el
       nombre accesible "Ver detalle de <nombre>" y un ícono "›" a la derecha. El `data-testid` de la
       fila pasa al enlace.
  - **Agrupación "Resto".** Con 6 categorías con gasto o menos, hay una porción por categoría. Con 7 o
    más, la torta muestra las 5 primeras del orden y una sexta porción llamada **"Resto (N
    categorías)"**, en el color del borde de control (`--input`, `#948877` en `src/index.css`, ADR-023). Su monto es la suma de las
    categorías agrupadas y su porcentaje sale de la regla común aplicada a esa suma. "Resto" no
    aparece en la lista.
  - **Las porciones no son interactivas** en V2: tocar una no hace nada. Al detalle se entra por la
    fila de la lista (ADR-038).
  - **Accesibilidad.** La torta es una imagen (`role="img"`) con el texto alternativo "Gasto por
    categoría en <mes año>: <nombre> <porcentaje>, …", en el orden de las porciones. Con D1 dice
    "Gasto por categoría en septiembre 2026: Comida y supermercado 40,0 %, Transporte 25,0 %,
    Servicios 15,0 %, Indumentaria 10,0 %, Viajes 10,0 %". Si hay "Resto", el texto termina con
    "Resto (N categorías) <porcentaje>". La torta no recibe foco.
  - **Estados:**
    - Cargando: se ve el "Cargando…" del Resumen (`dashboard-loading`), sin torta ni lista.
    - Error al leer el resumen: se ve el texto del Resumen, que empieza con "No se pudo cargar el
      resumen:" y sigue con el detalle técnico (`dashboard-error`), sin torta ni lista.
    - Mes sin ningún movimiento: se ve el estado vacío de US-33 ("No tenés movimientos registrados en
      <mes>." y "Registrar un gasto") y la sección "Por categoría" no se muestra.
    - Mes con ingresos y sin gastos: la sección muestra "No hay gastos por categoría en este mes."
      (`dashboard-categories-empty`), sin torta.
  - **`data-testid`.** Los de la lista existen desde US-27 y no cambian. Los ángulos se expresan en
    grados, con 1 decimal y punto decimal, y salen de los montos exactos acumulados (redondeo
    `ROUND_HALF_UP`).

    | Elemento | `data-testid` | Atributos para la automatización |
    |---|---|---|
    | Sección | `dashboard-category-bars` | — |
    | Torta | `dashboard-category-chart` | `data-period="AAAA-MM"`, `aria-label` con el texto alternativo |
    | Porción de una categoría | `dashboard-category-chart-slice-<categoryId>` | `data-amount` ("60000.00"), `data-percentage` ("40.0"), `data-start-angle` ("0.0"), `data-end-angle` ("144.0") |
    | Porción "Resto" | `dashboard-category-chart-slice-rest` | los mismos, más `data-count` (categorías agrupadas) |
    | Lista | `dashboard-categories-list` | — |
    | Enlace de la fila | `dashboard-category-bar-<categoryId>` | `href` al detalle, `aria-label="Ver detalle de <nombre>"` |
    | Nombre, monto, porcentaje, marca | `category-bar-name`, `category-bar-amount`, `category-bar-percentage`, `category-bar-archived` | — |
    | Sin gastos | `dashboard-categories-empty` | — |

- **Criterios de aceptación:**
  - CA-1: Con D1, `/dashboard?period=2026-09` muestra la torta con exactamente 5 porciones. En el
    orden del DOM son Comida y supermercado, Transporte, Servicios, Indumentaria y Viajes, con
    `data-start-angle`–`data-end-angle` "0.0"–"144.0", "144.0"–"234.0", "234.0"–"288.0",
    "288.0"–"324.0" y "324.0"–"360.0".
  - CA-2: Con D1, la lista de "Por categoría" de septiembre 2026 muestra 5 filas, en el mismo orden que
    la torta, con estos montos y porcentajes: "$60.000,00" "40,0 %", "$37.500,00" "25,0 %",
    "$22.500,00" "15,0 %", "$15.000,00" "10,0 %", "$15.000,00" "10,0 %".
  - CA-3: Con D1, ni el ingreso de $500.000,00 (fila 9) ni el ingreso con categoría de $7.000,00 (fila
    16) aparecen en la torta o en la lista. Comida y supermercado sigue en $60.000,00 · 40,0 %.
  - CA-4: Con D1, la transacción eliminada de $9.999,00 (fila 10) no le suma a Comida y supermercado:
    su monto sigue siendo $60.000,00.
  - CA-5: Con D1, Indumentaria muestra $15.000,00 en septiembre (la cuota 2/3 de la fila 7), no
    $45.000,00.
  - CA-6: Con D1, Viajes (archivada) aparece en la torta y en la lista. La fila tiene la marca
    "archivada" y muestra $15.000,00 · 10,0 %, el gasto en USD convertido a TC 1.500.
  - CA-7: Con D1, Indumentaria y Viajes empatan en $15.000,00 y aparecen en ese orden (alfabético) en la
    torta y en la lista.
  - CA-8: Con D2 (8 categorías), la torta tiene 6 porciones. Las 5 primeras tienen `data-percentage`
    "30.8", "23.1", "15.4", "11.5" y "7.7", y "Resto" tiene `data-amount` "15000.00",
    `data-percentage` "11.5" y `data-count` "3". La lista muestra las 8 filas, y las últimas tres son
    "$8.000,00" "6,2 %", "$5.000,00" "3,8 %" y "$2.000,00" "1,5 %".
  - CA-9: Con D3 (7 categorías, el límite), la torta tiene 6 porciones. "Resto" tiene `data-amount`
    "13000.00", `data-percentage` "10.2" y `data-count` "2". La primera fila de la lista muestra
    "31,3 %" (31,25 redondeado hacia arriba) y la de Entretenimiento "6,3 %" (6,25).
  - CA-10: Con D3, la porción de Comida y supermercado va de "0.0" a "112.5" y la de Transporte de
    "112.5" a "196.9".
  - CA-11: Con D4 (6 categorías), la torta tiene 6 porciones, no existe
    `dashboard-category-chart-slice-rest` y los `data-percentage` son "30.0", "25.0", "20.0", "15.0",
    "6.0" y "4.0".
  - CA-12: Con D5, las tres filas muestran "33,3 %", en el orden Comida y supermercado, Servicios,
    Transporte. Las porciones van de "0.0" a "120.0", de "120.0" a "240.0" y de "240.0" a "360.0".
  - CA-13: Con D6, la torta tiene una sola porción, de "0.0" a "360.0", con el color de Salud
    (`#9a3b3b`) y sin filete, y la fila muestra "100,0 %".
  - CA-14: Con D7, la sección muestra "No hay gastos por categoría en este mes." y no existe el
    elemento `dashboard-category-chart`.
  - CA-15: Con D8, se ve el estado vacío de US-33 y no existe el elemento `dashboard-category-chart`.
  - CA-16: Con D1, el `aria-label` de la torta es exactamente "Gasto por categoría en septiembre 2026:
    Comida y supermercado 40,0 %, Transporte 25,0 %, Servicios 15,0 %, Indumentaria 10,0 %, Viajes
    10,0 %". Con D2 termina en ", Resto (3 categorías) 11,5 %".
  - CA-17: Tocar una porción no navega ni cambia la URL.
  - CA-18: Con D1, cambiar de mes con el selector a agosto actualiza la torta y la lista, y la URL pasa
    a `?period=2026-08` (C11). Se ven 2 porciones: Comida y supermercado $57.800,00 · 79,4 % e
    Indumentaria $15.000,00 · 20,6 %.
  - CA-19: Con D1 en septiembre, después de eliminar desde "Últimos movimientos" el gasto de $24.500,00
    (fila 4), la torta y la lista se actualizan sin recargar. Transporte pasa al primer lugar con
    $37.500,00 · 29,9 % y Comida y supermercado queda segunda con $35.500,00 · 28,3 %. _Este CA
    modifica D1: se corre al final o sobre una copia._
  - CA-20: Con D1 y las solicitudes a Supabase bloqueadas (ver "Cómo simular un error de red"),
    recargar `/dashboard?period=2026-09` muestra un texto que empieza con "No se pudo cargar el
    resumen:" y no muestra la torta.
  - CA-21: La sección `dependencies` de `package.json` no tiene paquetes nuevos respecto de `main` al
    2026-10-06: la torta se dibuja con SVG propio (ADR-038).
  - CA-22: Con D1, el enlace `dashboard-category-bar-<id de Comida y supermercado>` tiene el nombre
    accesible "Ver detalle de Comida y supermercado".
- **Trazabilidad:** FR-20 (reabre el ajuste de [#78](https://github.com/Joaconz/Biyu/issues/78)) · US-27 ·
  US-33 · US-44 · ADR-001 · ADR-023 · ADR-038 · I1' · I10 · C2 · C11
- **Mock:** `entrega-2/mocks/dashboard-categorias-resumen.html`
- **Casos de prueba:** se diseñan en la Parte A de la Entrega 2. CP-DAS-004 (US-27) es candidato a la
  regresión de V2 (criterio de ADR-027) porque la sección cambia.

##### US-73: Detalle de una categoría desde el Resumen · [#243](https://github.com/Joaconz/Biyu/issues/243) (reemplaza [#171](https://github.com/Joaconz/Biyu/issues/171))

- **Objetivo:** Como usuario, quiero tocar una categoría en el Resumen y ver su detalle (cuánto gasté
  en el mes, cómo viene en los últimos meses y cada gasto que la compone), para entender por qué esa
  categoría pesa lo que pesa.
- **Pantallas y campos:**
  - **Entrada:** tocar una fila de "Por categoría" en el Resumen abre
    `/dashboard/categories/<categoryId>?period=AAAA-MM`, con el mismo período que tenía el Resumen.
    `categoryId` es el UUID de la categoría. En la barra de navegación sigue marcado "Resumen", y sus
    enlaces llevan los testids `dashboard-nav-*` porque la ruta empieza con `/dashboard`.
  - Pantalla **Detalle de categoría**, de arriba hacia abajo:
    1. **Encabezado:** el enlace "‹ Resumen", que vuelve a `/dashboard?period=` con el período que se
       está viendo en el detalle. Después, el nombre de la categoría como título, con la marca
       "archivada" si corresponde, y el selector de mes (flechas "Mes anterior" y "Mes siguiente" y
       el nombre del mes, que abre el selector nativo, igual que en el Resumen). Cambiar de mes
       cambia solo `?period=`; la categoría no cambia.
    2. **Tarjeta del total:**
       - el rótulo "Gastado en <mes>";
       - el monto de la categoría en el período, en grande;
       - el texto "<porcentaje> del gasto de <mes>", con la regla común (es el mismo número que la
         fila del Resumen);
       - "Cuotas de meses anteriores <monto>": la parte del monto que viene de cuotas con número
         mayor a 1, como en US-16;
       - "Incluye <US$ monto> en dólares", solo si la categoría tiene gastos en USD en ese período,
         como en US-24.
    3. **Sección "Últimos 6 meses":** un gráfico de 6 barras verticales, una por período, desde el
       período visto menos 5 hasta el período visto, de izquierda a derecha.
       - Debajo de cada barra va el mes abreviado ("abr", "may"…), y encima, el monto en formato
         compacto.
       - La altura es proporcional al mayor de los 6 montos. Un mes en $0,00 muestra una línea de base
         de 2 px; un mes con monto mayor que cero mide al menos 4 px, aunque la proporción dé menos.
       - La barra del período visto va en el color de la categoría. Las otras van en ese color al 35 %
         sobre la superficie: `color-mix(in srgb, <color> 35%, #fdfbf7)`.
       - Cada barra es un botón: tocarlo cambia `?period=` a ese mes. Su nombre accesible es "<mes
         año>: <monto completo>", por ejemplo "julio 2026: $61.200,00".
    4. **Sección "Gastos de <mes año>":** las imputaciones de gastos de esa categoría en el período, no
       eliminadas. Se ordenan por fecha de la transacción, de la más nueva a la más vieja, y a igual
       fecha va primero la que se cargó después. No hay límite de cantidad. Cada fila es la misma de
       Movimientos (US-17): el título (la nota o, si no hay, el nombre de la categoría), "<día> <mes
       abreviado> · <cuenta>", la etiqueta "n/N" si es una cuota, el monto de la imputación con
       signo ("-$24.500,00") y, si es en dólares, el monto en USD debajo. La diferencia es que **no
       tiene papelera ni botón de restaurar**: el detalle es de solo lectura.
  - **Formato compacto** de los montos de las barras, con redondeo `ROUND_HALF_UP`:
    - menos de $1.000: el entero redondeado ("$950", "$0");
    - desde $1.000 y menos de $999.950: miles con 1 decimal ("$52,0 mil", "$48,5 mil");
    - desde $999.950: millones con 1 decimal ("$1,3 M" para $1.250.000,00).
  - **Estados.** El encabezado se ve de forma distinta según el estado:
    - Cargando: solo "‹ Resumen" y "Cargando…", sin título, selector de mes, tarjeta, barras ni lista.
    - Error al leer cualquiera de los datos: "‹ Resumen", el texto "No se pudo cargar la categoría." y
      el botón "Reintentar", que vuelve a pedir todo. No hay título, selector de mes, tarjeta, barras
      ni lista.
    - Categoría inexistente, de otro usuario (RLS devuelve 0 filas) o con un `categoryId` que no es un
      UUID: solo "No encontramos esta categoría." y el enlace "Volver al Resumen" a
      `/dashboard?period=` con el período de la URL. No hay "‹ Resumen", título ni selector de mes.
    - Mes sin gastos en la categoría: la tarjeta muestra "$0,00", "0,0 % del gasto de <mes>" y "Cuotas
      de meses anteriores $0,00"; las barras se ven igual; la lista dice "No hay gastos de <categoría>
      en <mes año>.".
    - Los 6 meses en $0,00: debajo de las barras aparece "Sin gastos en esta categoría en los últimos 6
      meses.".
  - **`data-testid`:**

    | Elemento | `data-testid` | Atributos |
    |---|---|---|
    | Enlace "‹ Resumen" | `category-detail-back` | `href` |
    | Título | `category-detail-title` | — |
    | Marca "archivada" | `category-detail-archived` | — |
    | Selector de mes | `category-detail-period-prev`, `category-detail-period`, `category-detail-period-select`, `category-detail-period-next` | `data-period` en `category-detail-period` |
    | Tarjeta del total | `category-detail-total` | — |
    | Monto | `category-detail-total-amount` | — |
    | Porcentaje | `category-detail-percentage` | — |
    | Cuotas de meses anteriores | `category-detail-inherited-amount` | — |
    | Subtotal en dólares | `category-detail-total-usd` | — |
    | Sección de barras | `category-detail-evolution` | — |
    | Barra de un mes (botón) | `category-detail-evolution-bar-AAAA-MM` | `data-amount` ("61200.00"), `aria-current="true"` solo en la del período visto |
    | Monto compacto de la barra | `category-detail-evolution-amount-AAAA-MM` | — |
    | Seis meses en cero | `category-detail-evolution-empty` | — |
    | Lista | `category-detail-transactions` | — |
    | Fila | `category-detail-transaction-item` (y los sufijos de Movimientos: `-installment`, `-archived`) | — |
    | Lista vacía | `category-detail-transactions-empty` | — |
    | Cargando, error, reintentar | `category-detail-loading`, `category-detail-error`, `category-detail-retry` | — |
    | No encontrada, volver | `category-detail-not-found`, `category-detail-not-found-back` | — |
    | Navegación global (sin cambios) | `dashboard-nav-<destino>` | `aria-current="page"` en el de Resumen |

- **Criterios de aceptación:**
  - CA-1: Con D1, tocar la fila "Comida y supermercado" en `/dashboard?period=2026-09` abre
    `/dashboard/categories/<id de Comida y supermercado>?period=2026-09`.
  - CA-2: Con D1, el detalle de Comida y supermercado en septiembre 2026 muestra:
    - el título "Comida y supermercado";
    - el monto "$60.000,00";
    - el texto "40,0 % del gasto de septiembre";
    - "Cuotas de meses anteriores $0,00";
    - y no existe `category-detail-total-usd`.
  - CA-3: Con D1 en septiembre 2026, el porcentaje del detalle de cada una de las 5 categorías es igual
    al de su fila en el Resumen.
  - CA-4: Con D1, la lista de Comida y supermercado en septiembre 2026 tiene 4 filas, en este orden:
    "28 sep · Tarjeta de débito" "-$24.500,00"; "14 sep · Efectivo" "-$8.300,00"; "14 sep · Tarjeta de
    crédito" "-$18.700,00"; "5 sep · Billetera virtual" "-$8.500,00". No aparecen la eliminada de
    $9.999,00 (fila 10) ni el ingreso de $7.000,00 (fila 16).
  - CA-5: Con D1, las barras de Comida y supermercado en septiembre 2026 son, de izquierda a derecha,
    `2026-04` a `2026-09`. Sus `data-amount` son "52000.00", "48500.00", "55000.00", "61200.00",
    "57800.00" y "60000.00", y sus montos compactos, "$52,0 mil", "$48,5 mil", "$55,0 mil", "$61,2
    mil", "$57,8 mil" y "$60,0 mil". La más alta es la de julio, y `aria-current="true"` está solo en
    `2026-09`.
  - CA-6: Con D1, el detalle de Indumentaria en septiembre 2026 muestra "$15.000,00", "10,0 % del gasto
    de septiembre", "Cuotas de meses anteriores $15.000,00" y una fila con la etiqueta "2/3" y
    "-$15.000,00".
  - CA-7: Con D1, las barras de Indumentaria en septiembre 2026 tienen `data-amount` "0.00" de abril a
    julio y "15000.00" en agosto y septiembre. En `?period=2026-10`, la barra de octubre vale
    "15000.00" (la cuota 3/3 comprometida).
  - CA-8: Con D1, el detalle de Viajes en septiembre 2026 muestra la marca "archivada", "$15.000,00",
    "10,0 % del gasto de septiembre" e "Incluye US$10,00 en dólares". Su fila muestra "US$10,00" debajo
    de "-$15.000,00".
  - CA-9: Con D1, el ingreso con categoría de $7.000,00 (fila 16) no suma al monto del detalle de Comida
    y supermercado (sigue en "$60.000,00") ni a su barra de septiembre (sigue en "60000.00").
  - CA-10: Con D1, en el detalle de Comida y supermercado en 2026-09, "Mes anterior" lleva a
    `?period=2026-08` sin cambiar `<categoryId>`. Se ven "$57.800,00", "79,4 % del gasto de agosto" y
    barras de `2026-03` a `2026-08`.
  - CA-11: Con D1, tocar la barra `2026-07` en el detalle de Comida y supermercado lleva a
    `?period=2026-07`, y el monto pasa a "$61.200,00".
  - CA-12: "‹ Resumen" desde el detalle en `?period=2026-08` lleva a `/dashboard?period=2026-08`.
  - CA-13: Después de CA-1, el botón Atrás del navegador vuelve a `/dashboard?period=2026-09` (C11).
    Después de CA-10, Atrás vuelve al detalle en `?period=2026-09`, porque cambiar de mes agrega una
    entrada al historial.
  - CA-14: Abrir la URL del detalle de CA-1 en otra pestaña con la misma sesión muestra la misma
    categoría y el mismo período (enlace compartible, C11).
  - CA-15: Con D1, el detalle de Transporte en `?period=2027-03` muestra "$0,00", "0,0 % del gasto de
    marzo", "Cuotas de meses anteriores $0,00" y "No hay gastos de Transporte en marzo 2027.". Sus 6
    barras (`2026-10` a `2027-03`) valen "0.00" y se ve "Sin gastos en esta categoría en los últimos 6
    meses.".
  - CA-16: Con D6, en el detalle de Salud en `?period=2026-10`, la barra de septiembre mide más de 4 px
    y las de mayo a agosto y la de octubre miden 2 px.
  - CA-17: `/dashboard/categories/00000000-0000-0000-0000-000000000000?period=2026-09` muestra "No
    encontramos esta categoría.", y "Volver al Resumen" lleva a `/dashboard?period=2026-09`.
  - CA-18: `/dashboard/categories/hola?period=2026-09` muestra "No encontramos esta categoría." y no
    hace ninguna solicitud a `ledger_entries` (pestaña Network).
  - CA-19: Con la sesión de `qa-categorias`, abrir el detalle de la categoría Salud de `qa-cat-una` (D6)
    muestra "No encontramos esta categoría.". No se ven ni su nombre ni sus montos (RLS, C7).
  - CA-20: `/dashboard/categories/<id de Comida y supermercado>?period=2026-13` reemplaza el período
    por el actual de la fecha de ejecución (`2026-10` si hoy es 2026-10-06), sin agregar una entrada
    al historial, y muestra ese mes.
  - CA-21: Con D1 y las solicitudes a Supabase bloqueadas, recargar el detalle de Comida y supermercado
    muestra "‹ Resumen", "No se pudo cargar la categoría." y el botón "Reintentar". Si después se
    desbloquea el dominio y se toca "Reintentar", se ve el detalle de CA-2 sin recargar la página.
  - CA-22: Las filas del detalle no tienen botón de eliminar ni de restaurar.
  - CA-23: Formato compacto: $950,00 → "$950"; $999,50 → "$1.000"; $48.500,00 → "$48,5 mil";
    $999.949,99 → "$999,9 mil"; $999.950,00 → "$1,0 M"; $1.250.000,00 → "$1,3 M".
  - CA-24: En el detalle, el enlace `dashboard-nav-dashboard` tiene `aria-current="page"`.
- **Trazabilidad:** FR-20 (la evolución que [#78](https://github.com/Joaconz/Biyu/issues/78) dejó para
  "una historia específica posterior") · FR-21 · US-16 · US-17 · US-24 · US-72 · ADR-001 · ADR-023 ·
  ADR-038 · I1' · I10 · C2 · C7 · C11
- **Mock:** `entrega-2/mocks/dashboard-categorias-detalle.html`
- **Casos de prueba:** se diseñan en la Parte A de la Entrega 2.

---

### Supuestos de este documento

1. Los IDs US-72 y US-73 se asignaron a esta feature. Los issues #170 y #171 eran ideas del backlog
   sin historia; se cerraron al crear #242 y #243.
2. "Pantallas y campos" describe la UI de `main` al 2026-10-06 con estos cambios aplicados. Si la
   navegación inferior de V2 (#172) cambia las pestañas, "Resumen" sigue siendo la que queda marcada.
3. El cálculo de porcentajes es el de V1 en `src/domain/summary.ts` (US-27). Estas historias lo dejan
   por escrito, no lo cambian. Lo único nuevo es el desempate del orden.
4. El detalle de una categoría es de solo lectura: borrar y editar se siguen haciendo desde
   Movimientos.
5. FR-20 (`docs/pre-entrega.md`) y su fila en `docs/08-trazabilidad.md` se actualizaron con ADR-038:
   torta más barras en el Resumen y evolución por categoría en el detalle.

---

## Parte 7 · Editar un movimiento

_Fuente: `entrega-2/historias/editar-movimiento.md`._

**Testing de Aplicaciones · Proyecto Integrador** · Versión del documento: 2026-10-09 · Alcance de
V2. Mismo formato que `entrega-2/historias/importar-excel.md`. Decisión de diseño:
[ADR-043](../docs/adr/043-editar-un-movimiento-con-una-rpc.md), que aplica
[ADR-009](../docs/adr/009-regeneracion-de-imputaciones-al-editar.md) a un contrato concreto.

**Vocabulario.** "Movimiento" es el rótulo de la UI para una **Transacción** del glosario
(`docs/01-domain-glossary.md`). "Mes cerrado" es el de la definición del glosario: cualquier período
anterior al mes actual. H es el mes de hoy en Argentina (ADR-021) cuando se ejecuta el caso; H−1 es el
mes anterior, H−3 tres meses antes. "Una fecha de H−1" es cualquier día de ese mes. Los criterios no
dependen del día de hoy, salvo los marcados como prueba de dominio, que fijan "hoy".

---

##### US-84: Editar un movimiento ya cargado · [#284](https://github.com/Joaconz/Biyu/issues/284)

- **Objetivo:** Como usuario que se equivocó al cargar un gasto o un ingreso, quiero corregirlo, para
  no tener que eliminarlo y volver a cargarlo, y quiero que me avise qué meses ya cerrados van a
  cambiar antes de guardar.
- **Épica:** [#23](https://github.com/Joaconz/Biyu/issues/23) (Edición de transacciones). Cubre FR-07.
- **Depende de:** Registrar (US-01 a US-11) y Movimientos (US-17, US-18, US-65). No depende de la
  importación. Los avisos de un movimiento de suscripción y de uno compartido (apartado 2) existen porque
  esos movimientos ya existen (US-52, US-34, US-82); si esas historias no están, esos estados no aparecen.

###### 1. Dónde se entra

- En **Movimientos** (`/transactions`), cada fila activa tiene el botón de ícono **"Editar"**
  (`transactions-item-edit`, `aria-label="Editar movimiento"`), al lado de "Eliminar". Las filas
  eliminadas no lo tienen: en la vista "Eliminados" (`?view=deleted`) solo se ofrece "Restaurar".
- Lleva a **Editar movimiento** (`/transactions/:id/edit`). El período de Movimientos queda en la
  URL (C11): al guardar o cancelar se vuelve a `/transactions?period=<AAAA-MM>` con el mismo período
  con que se salió. La barra inferior marca Resumen, como en el resto de Movimientos (US-69).
- El Resumen y el detalle de una categoría no tienen el botón en V2.

###### 2. Pantalla Editar movimiento

Una sola pantalla con el formulario precargado, no el asistente de pasos de Registrar (ADR-024).

- Encabezado "Editar movimiento" con el botón atrás (`edit-transaction-back`) → `/transactions` con
  el período con que se entró. Debajo, en texto (no controles): el **Tipo** ("Gasto" o "Ingreso"), la
  **Moneda** y, en USD, el **Tipo de cambio** ("TC 1.450,00") (`edit-transaction-type-readonly`,
  `edit-transaction-currency-readonly`, `edit-transaction-fx-readonly`), con el aviso fijo "El tipo, la
  moneda y el tipo de cambio no se pueden cambiar. Si están mal, eliminá el movimiento y cargalo de
  nuevo." (`edit-transaction-readonly-note`).
- Campos editables, precargados, con los mismos rangos, formatos y mensajes de error que Registrar:

  | Campo | `data-testid` | Notas |
  |---|---|---|
  | Monto | `edit-transaction-amount` | En la moneda del movimiento, mayor a 0, hasta 2 decimales. En un gasto con cuotas es el total de la compra |
  | Fecha | `edit-transaction-date` | No posterior a hoy. No hay fecha mínima |
  | Categoría | `edit-transaction-category-chip-<slug>` | Solo en un gasto. Si la actual está archivada, sigue visible con "(archivada)", se puede guardar sin cambiarla y se puede volver a elegir después de probar otra; ninguna otra archivada se ofrece |
  | Cuenta | `edit-transaction-account-chip-<slug>` | Misma regla de archivada que Categoría |
  | Cuotas | `edit-transaction-installments-chip-<n>` | Solo en un gasto con cuenta de tarjeta de crédito: 1 a 12. Con otra cuenta no se muestra |
  | Descripción (opcional) | `edit-transaction-description` | Texto libre |

- Cambiar a una cuenta que no es tarjeta de crédito con Cuotas > 1 reinicia las cuotas a 1 y lo avisa
  (`edit-transaction-installments-reset`), igual que Registrar.
- **Vista previa de las cuotas** (`edit-transaction-installments-preview-summary`): "<N> cuotas de
  <cuota>" y la lista mes a mes, igual que Registrar: la serie va en la moneda del movimiento (en USD,
  en dólares), con la regla de siempre: cuota base truncada a 2 decimales y la última absorbe el resto (C3).
- **Cambios sin guardar.** El botón "Guardar cambios" (`edit-transaction-submit`) está deshabilitado
  hasta que algún campo difiera de su valor original, comparando valores ya interpretados (el monto con
  `tryParseMoney`: "12500" y "12.500,00" son lo mismo); mientras guarda dice "Guardando…" y también
  queda deshabilitado. "Cancelar" (`edit-transaction-cancel`) vuelve sin guardar. Si hay cambios, el
  botón atrás y "Cancelar" piden confirmar: "¿Salir sin guardar los cambios?" con "Seguir editando"
  (`edit-transaction-leave-stay`) y "Salir sin guardar" (`edit-transaction-leave-confirm`) en el diálogo
  `edit-transaction-leave-dialog`. Sin cambios, vuelven directo.
- **Estados:**
  - cargando: `edit-transaction-loading`;
  - error al cargar: "No pudimos cargar el movimiento." con "Reintentar"
    (`edit-transaction-load-error`, `edit-transaction-load-retry`);
  - no existe o es de otro usuario: "No encontramos este movimiento." con el enlace "Volver"
    (`edit-transaction-not-found`, `edit-transaction-not-found-back`);
  - eliminado: "Este movimiento está eliminado. Restauralo para poder editarlo."
    (`edit-transaction-blocked-deleted`);
  - de una suscripción: "Este gasto lo generó la suscripción <nombre>. Editar la suscripción no
    cambia los meses ya cargados." (`edit-transaction-blocked-subscription`);
  - con deuda vinculada: "Este gasto está compartido con <persona>. Para cambiarlo, eliminalo y
    cargalo de nuevo." (`edit-transaction-blocked-shared`). Si hay varias personas (ADR-040),
    "con <n> personas";
  - en los tres bloqueos no se muestra el formulario, solo el aviso y el enlace "Volver"
    (`edit-transaction-blocked-back`);
  - error al guardar: franja `edit-transaction-error` con el mensaje de la base traducido y el formulario
    con lo escrito; no se pierde nada.

###### 3. Aviso de meses cerrados (FR-07)

Al tocar "Guardar cambios", **antes de llamar a la base**, se calcula el calendario de imputaciones
original y el nuevo con `generateLedgerEntries(monto, tipo de cambio congelado, cuotas, primer período)`,
y se pasa `today` a la función de aviso (C1). En USD el calendario va en pesos con el `fx_rate` congelado
de la transacción (C5).

Para cada mes cerrado M (período anterior a H) se compara la imputación de M antes y después en **tres
datos**: el monto en pesos, la categoría y la cuenta, que son los totales que el Resumen muestra por mes,
por categoría y por cuenta. Una imputación que aparece o desaparece cuenta como cambio. La descripción no
cuenta.

- Si **algún mes cerrado difiere**, se abre el diálogo `edit-transaction-closed-dialog`
  (`role="dialog"`, `aria-modal="true"`), título "Esto cambia meses que ya pasaron". Por cada mes afectado,
  una línea (`edit-transaction-closed-period-<AAAA-MM>`) con el nombre del mes y las partes que cambian,
  separadas por " · ": "de $<antes> a $<después>" si cambia el monto ("$0,00" donde no hay imputación),
  "categoría: de <A> a <B>" si cambia la categoría y "cuenta: de <C> a <D>" si cambia la cuenta. Debajo,
  "Los totales y el resumen de esos meses se van a recalcular." Botones "Cancelar"
  (`edit-transaction-closed-cancel`, el foco inicial) y "Guardar igual" (`edit-transaction-closed-confirm`).
  Escape y el toque fuera equivalen a Cancelar. Nada se guarda hasta "Guardar igual".
- Si **ninguno difiere**, guarda directo, sin diálogo: cambiar solo la descripción, cualquier cambio en un
  movimiento de este mes o posterior, o un cambio que solo toca imputaciones futuras (por ejemplo, el resto de
  centavos que cae en la última cuota).
- El aviso es UX (C6): la base edita igual si la llaman sin pasar por acá.

###### 4. Qué guarda la base

Una sola llamada a la RPC `update_transaction` (ADR-043), nunca `update`/`delete`/`insert` sueltos (C4):

- Actualiza la transacción y **borra y vuelve a crear todas sus imputaciones** (ADR-009), en la misma
  transacción de base, con la regla de C3. `first_period` pasa a ser el mes de la nueva fecha.
- En USD, `amount_ars` se recalcula con el tipo de cambio congelado de la transacción (C5).
- La RPC no recibe tipo, moneda ni tipo de cambio. Es un **reemplazo completo**: todos los parámetros son
  obligatorios salvo `p_description` (nulo o vacío = sin descripción). Para un ingreso se aplican las mismas
  reglas de categoría y cuotas que en `create_transaction` (I6, I8).
- Validaciones en la base (C6), con los mismos mensajes que `create_transaction` para monto, fecha,
  categoría, cuenta y cuotas, más estas, todas con `errcode = 'check_violation'`:

  | Caso | Mensaje exacto |
  |---|---|
  | Movimiento eliminado | "Un movimiento eliminado no se puede editar" |
  | Movimiento de una suscripción | "Un movimiento de una suscripción no se puede editar" |
  | Movimiento con deuda vinculada | "Un movimiento compartido no se puede editar" |

  Un movimiento de otro usuario o inexistente responde `foreign_key_violation` "la transacción no existe o
  no te pertenece", como `delete_transaction`; sin sesión, `42501`. Las validaciones corren en este orden:
  sesión, existencia y dueño, eliminado, suscripción, deuda vinculada y, por último, los campos (monto,
  fecha, categoría, cuenta, cuotas). Si un movimiento cumple dos bloqueos, sale el primero.
- Al guardar con éxito: vuelve a Movimientos con el aviso `transactions-edited` "Cambios guardados" y la
  lista y el Resumen ya muestran los valores nuevos (no hay que recargar). Si el período de la URL deja de
  incluir la imputación, el movimiento deja de verse ahí sin más aviso.

###### 5. Criterios de aceptación

Usuario sembrado: las categorías y cuentas de US-43 sin cambios, entre ellas "Tarjeta de crédito",
"Tarjeta de débito" y "Efectivo". "Compra de $X en N cuotas" es el total X; la cuota es X ÷ N.

- CA-1 (entrada): en Movimientos, cada fila activa tiene `transactions-item-edit`; una eliminada (`?view=deleted`)
  no. Tocarlo abre `/transactions/<id>/edit` con los campos precargados. Desde la fila "2/3" de una compra de
  $30.000,00 en 3 cuotas, Monto muestra $30.000,00 (el total), no la cuota.
- CA-2 (solo lectura): tipo, moneda y tipo de cambio se ven como texto con `edit-transaction-readonly-note` y
  no son controles. Por API, `update_transaction` no tiene esos parámetros: mandar `p_currency` falla con
  `PGRST202`.
- CA-3 (monto sin cuotas, mes actual): un gasto de H de $10.000,00 en 1 cuota, cambiar el monto a $12.500,00:
  se guarda sin diálogo, vuelve a Movimientos con "Cambios guardados" y el Resumen de H muestra $12.500,00 en
  esa categoría. La transacción tiene 1 imputación de $12.500,00 (I1).
- CA-4 (resto en cuotas): una compra de H de $100.000,00 en 3 cuotas con tarjeta (33.333,33 + 33.333,33 +
  33.333,34), pasarla a $100.001,00: las 3 imputaciones pasan a 33.333,66 + 33.333,66 + 33.333,68 y suman
  exactamente $100.001,00 (C3, I1, I2). La vista previa del formulario muestra lo mismo antes de guardar.
- CA-5 (cantidad de cuotas): una compra de H de $120.000,00 en 6 cuotas, pasarla a 3 cuotas: hay exactamente 3
  imputaciones de $40.000,00, en H, H+1 y H+2, numeradas de 1 a 3 sin huecos (I2, I3), y ninguna en H+3, H+4 ni H+5.
- CA-6 (fecha a un mes cerrado): una compra de H de $30.000,00 en 3 cuotas, cambiar la fecha a un día de H−1:
  las imputaciones pasan a H−1, H y H+1 (`first_period` = H−1) y, como H−1 es un mes cerrado, aparece el diálogo
  del apartado 3 con la línea de H−1 "de $0,00 a $10.000,00".
- CA-7 (monto en un mes cerrado): un gasto con fecha de H−1 y 1 cuota de $30.000,00, cambiar el monto a
  $35.000,00: el diálogo lista H−1 con "de $30.000,00 a $35.000,00". "Cancelar" no guarda nada; "Guardar igual"
  guarda y el Resumen de H−1 muestra $35.000,00.
- CA-8 (categoría sola, con cuotas): una compra de $30.000,00 en 3 cuotas con fecha de H−2 en "Comida y
  supermercado", cambiar la categoría a "Otros": el diálogo lista H−2 y H−1 con "categoría: de Comida y
  supermercado a Otros", sin montos (H no se lista: no está cerrado). Al guardar, el Resumen de H−2 mueve $10.000,00
  de una categoría a la otra.
- CA-9 (categoría sola, 1 cuota): un gasto de 1 cuota con fecha de H−1, cambiar solo la categoría: se abre el
  diálogo con la línea de H−1 "categoría: de <A> a <B>".
- CA-10 (monto y categoría a la vez): el gasto de CA-7 con monto $35.000,00 y otra categoría: la línea de H−1
  dice "de $30.000,00 a $35.000,00 · categoría: de <A> a <B>".
- CA-11 (cuenta): un gasto de 1 cuota con fecha de H−2 en "Efectivo", cambiar la cuenta a "Tarjeta de débito":
  el diálogo lista H−2 con "cuenta: de Efectivo a Tarjeta de débito", y al guardar "Gasto por cuenta" del Resumen
  de H−2 mueve el monto de una cuenta a la otra.
- CA-12 (sin aviso, mes cerrado): un gasto de 1 cuota con fecha de H−1 en el que solo cambia la descripción se
  guarda sin diálogo; moverle la fecha dentro de H−1 (del día 5 al 20) tampoco abre el diálogo, porque la
  imputación de H−1 queda igual.
- CA-13 (solo cambia una cuota futura): una compra de $100.000,00 en 3 cuotas con fecha de H−1
  (33.333,33 + 33.333,33 + 33.333,34), pasarla a $100.000,01 (33.333,33 + 33.333,33 + 33.333,35): solo cambia la
  cuota de H+1, así que se guarda sin diálogo.
- CA-14 (fecha de H−1 a H): un gasto de 1 cuota de $30.000,00 con fecha de H−1, cambiar la fecha a un día de H:
  el diálogo lista H−1 con "de $30.000,00 a $0,00".
- CA-15 (USD): un gasto de US$100,00 con TC 1.000,00 congelado y fecha de H, cambiar el monto a US$120,00: la
  imputación queda en US$120,00 y $120.000,00, el TC sigue en 1.000,00 aunque hoy el de referencia sea otro (C5)
  y `amount_ars` es $120.000,00. La vista previa de una compra en cuotas va en dólares.
- CA-16 (USD en el diálogo): el mismo gasto con fecha de H−1 y 1 cuota: el diálogo dice "de $100.000,00 a
  $120.000,00", en pesos con el TC congelado.
- CA-17 (ingreso): un ingreso de $50.000,00 con fecha de H−1, cambiar el monto a $55.000,00: el formulario no
  muestra Categoría ni Cuotas, el diálogo lista H−1 "de $50.000,00 a $55.000,00" y se guarda. Por API, un
  ingreso con `p_installments_count` 3 se rechaza con "I6: las cuotas solo aplican a gastos con cuenta
  credit_card".
- CA-18 (I6): un gasto en 6 cuotas con "Tarjeta de crédito", cambiar la cuenta a "Efectivo": las cuotas vuelven a
  1 y se avisa (`edit-transaction-installments-reset`). Por API, `update_transaction` con
  `p_installments_count` 6 y una cuenta de efectivo se rechaza con el mensaje de I6 y la transacción no cambia.
- CA-19 (validaciones, UI y API): monto vacío, 0, negativo, con 3 decimales o `NaN`; cuotas `0` y `13`; categoría
  vacía en un gasto; cuenta ajena o archivada distinta de la actual: se rechazan con los mismos mensajes que
  Registrar en la pantalla y con los de `create_transaction` directo contra la RPC. Valores límite: la fecha de hoy
  en Argentina se acepta y la de mañana se rechaza con "FR-06: la fecha no puede ser posterior a hoy"; $0,11 en 12
  cuotas se rechaza con "I4: cada cuota debe ser al menos 0,01". Siempre, la transacción y sus imputaciones quedan
  como estaban (atomicidad).
- CA-20 (archivada): un movimiento cuya categoría o cuenta fue archivada después de cargarse se puede editar (por
  ejemplo, el monto) sin tocarla; si se elige otra y se vuelve a la original, se guarda. Por API, mandar otra
  categoría o cuenta archivada se rechaza con "la categoría no existe, no es tuya o está archivada" o "la cuenta no
  existe, no es tuya o está archivada".
- CA-21 (bloqueos y orden): un movimiento eliminado, uno generado por una suscripción y uno con deuda vinculada
  muestran su aviso (apartado 2) y no el formulario. Por API, `update_transaction` sobre cada uno responde
  `check_violation` con el mensaje exacto del apartado 4. Una ocurrencia de suscripción que además está eliminada
  responde el mensaje de eliminado. Un movimiento eliminado de otro usuario responde `foreign_key_violation` y no
  revela que existe.
- CA-22 (cambios sin guardar): "Guardar cambios" está deshabilitado con los valores originales; al cambiar un
  campo se habilita; si se vuelve al valor original (aunque se escriba "12.500,00" donde estaba "12500"), se
  vuelve a deshabilitar. Con cambios, atrás y "Cancelar" abren `edit-transaction-leave-dialog`: "Seguir editando"
  conserva lo escrito y "Salir sin guardar" vuelve a la lista sin guardar.
- CA-23 (error al guardar): con la red cortada, o con la base rechazando, aparece `edit-transaction-error`, se
  mantiene el formulario con lo escrito y "Guardar cambios" vuelve a estar habilitado. Reintentar con la red
  guarda.
- CA-24 (idempotencia, por API): llamar dos veces a `update_transaction` con los mismos valores deja las mismas
  imputaciones, comparadas por (período, número de cuota, monto, monto en pesos); los ids pueden cambiar.
- CA-25 (concurrencia, por API): dos llamadas simultáneas sobre el mismo movimiento terminan con una sola versión
  consistente: gana la que confirma última, las imputaciones suman exactamente el monto (I1, I1') y hay exactamente
  `installments_count` (I2), sin mezcla de las dos. Si un `delete_transaction` confirma antes que una edición en
  curso, la edición responde `check_violation` "Un movimiento eliminado no se puede editar" y nada cambia.
- CA-26 (URL): al entrar a la edición desde `/transactions?period=<H−1>` y guardar o cancelar, se vuelve a esa
  misma URL (C11), y durante la edición la barra inferior marca Resumen.
- CA-27 (autorización, C7): con la sesión de otro usuario, `update_transaction` responde `foreign_key_violation`
  "la transacción no existe o no te pertenece" y nada cambia; `/transactions/<id>/edit` muestra "No encontramos
  este movimiento."; sin sesión, `42501` (`anon`: `permission denied`). Un `update` directo sobre `transactions` o
  un `delete` sobre `ledger_entries` con la sesión del usuario se rechaza con `42501` "permission denied" (C4, C7).
- CA-28 (integridad de los KPI): con un gasto eliminado de $5.000,00 en H−1 y otro activo de $30.000,00 en H−1,
  editar el activo a $35.000,00: el Resumen de H−1 muestra $35.000,00 (el eliminado no suma, I10) y el de H no
  cambia. Las imputaciones del editado suman exactamente su monto, en su moneda y en pesos (I1, I1').
- CA-29 (prueba de dominio, `today` fijo): con `today` = 2026-10-09, un gasto del 2026-09-15 de $30.000,00 en 3
  cuotas de $10.000,00, cambiando el total a $36.000,00 (cuotas de $12.000,00), la función de aviso devuelve una sola
  línea (septiembre 2026: de $10.000,00 a $12.000,00). Con `today` = 2026-09-30 no devuelve ninguna (septiembre no
  está cerrado) y con `today` = 2026-10-01 devuelve la misma.
- CA-30 (accesibilidad y celular): en 390 px de ancho no hay scroll horizontal; los diálogos cumplen DEF-024 (foco
  inicial, Tab atrapado, Escape, devolución del foco al botón que los abrió); el botón de ícono "Editar" mide al
  menos 44×44 px (NFR-08) y tiene `aria-label`.

###### 6. Fuera de alcance

- Cambiar el tipo, la moneda o el tipo de cambio (ADR-043 §2, C5).
- Editar un movimiento compartido o su deuda; editar el movimiento de una suscripción; editar uno eliminado.
- Editar varios movimientos a la vez; deshacer una edición; historial de cambios.
- Entrar a editar desde el Resumen, el detalle de una categoría o un listado de deudas.
- La compra en cuotas empezada (US-80): cuando exista, no se podrá editar (ADR-043 §8).

###### 7. Supuestos

1. Un movimiento de H−1 o anterior se puede editar sin límite de antigüedad; el aviso del apartado 3 es la
   única barrera (FR-07).
2. El aviso se arma en el cliente con el calendario original recalculado desde los datos del movimiento,
   no leyendo las imputaciones guardadas. Como las imputaciones se generan siempre con la misma función
   (C3), el resultado coincide; si alguna vez no coincidiera, es un defecto de integridad (I1 a I3).
3. "Mes que cambia" compara, por cada mes cerrado, el monto en pesos, la categoría y la cuenta de la
   imputación, que son los totales del Resumen (mes, categoría y "Gasto por cuenta"). La descripción no
   mueve ningún total y no cuenta.
4. No hay control optimista de versión: gana la última edición (ADR-043 §6).

###### 8. Trazabilidad

- **Trazabilidad:** FR-07 · FR-06 · FR-10 · FR-11 · C3, C4, C5, C6, C7, C10, C11 · I1, I1', I2, I3, I6, I10 ·
  ADR-009, ADR-043
- **Mock:** pendiente (se hace con la primera ronda de implementación).
