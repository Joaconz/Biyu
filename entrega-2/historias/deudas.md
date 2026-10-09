# Entrega 2 · Historias de usuario · Deudas y gastos compartidos (V2)

Épica [#18](https://github.com/Joaconz/Biyu/issues/18) · Milestone V2 · Nivel 1 del alcance
(`entrega-2/README.md`). Formato de `entrega-1/01-historias-de-usuario.md`: cada criterio `CA-k` se
cita desde los casos como `US-34 · CA-k`. Fuentes: `docs/02-behavior-spec.md` (historias 30 y 34 a
41, happy path del gasto en cuotas compartido, sad path "deuda mayor que el gasto", supuestos 4 y
5), `docs/04-data-model.md` (`debts`, I4, I5, I7, I9, I10, consulta 6), `docs/roadmap.md` §V2 y
ADR-006. Las decisiones que no salían obvias de la spec están en
[ADR-036](../../docs/adr/036-deuda-vinculada-en-create-transaction.md) (la deuda vinculada dentro de
`create_transaction`) y [ADR-037](../../docs/adr/037-deudas-se-escriben-por-rpc.md) (escritura por
RPC, saldar y revertir, deudas de un gasto borrado y totales). US-82 y US-83 suman
[ADR-040](../../docs/adr/040-gasto-compartido-con-varias-personas.md) (varias personas) y
[ADR-041](../../docs/adr/041-deudas-sueltas-en-el-balance.md) (deudas sueltas en el balance).

**Mocks** (`entrega-2/mocks/`, ADR-023, montos ficticios):

| Pantalla | Ruta | Nueva o modificada | Historias | Mock |
|---|---|---|---|---|
| Registrar, paso 3 "Revisá y guardá" | `/register` | Modificada | US-34, US-41 | `deudas-registrar-compartido.html` |
| Deudas | `/debts` | Nueva | US-35, US-37 a US-40, US-79 | `deudas-listado.html` |
| Nueva deuda | `/debts/new` | Nueva | US-36 | `deudas-nueva.html` |
| Resumen | `/dashboard` | Modificada | US-30 | `deudas-resumen-neto.html` |
| Movimientos y diálogo de borrado | `/transactions` | Modificada | US-35 | `deudas-movimientos.html` |

## Convenciones de esta feature

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

## Orden de implementación sugerido

US-34 y US-41 (misma RPC, ADR-036) → US-38 (pantalla Deudas) → US-35 → US-37 → US-39 y US-40 →
US-36 → US-30 → US-79 (filtro por dirección, sobre US-38 y US-37) → US-82 (varias personas, sobre
US-34 y US-41) → US-83 (balance, sobre US-36, US-39 y US-40).

---

## Historias de usuario

#### US-30: Ver el gasto neto de reembolsos en el Resumen · [#223](https://github.com/Joaconz/Biyu/issues/223) · Pendiente

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

#### US-34: Marcar un gasto como compartido al registrarlo · [#224](https://github.com/Joaconz/Biyu/issues/224) · Pendiente

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

#### US-35: Ver de qué gasto viene cada deuda · [#225](https://github.com/Joaconz/Biyu/issues/225) · Pendiente

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

#### US-36: Cargar una deuda suelta · [#226](https://github.com/Joaconz/Biyu/issues/226) · Pendiente

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

#### US-37: Ver lo que me deben y lo que debo por separado · [#227](https://github.com/Joaconz/Biyu/issues/227) · Pendiente

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

#### US-38: Filtrar las deudas por pendientes o saldadas · [#228](https://github.com/Joaconz/Biyu/issues/228) · Pendiente

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

#### US-39: Marcar una deuda como saldada en un toque · [#229](https://github.com/Joaconz/Biyu/issues/229) · Pendiente

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

#### US-40: Volver a pendiente una deuda saldada por error · [#230](https://github.com/Joaconz/Biyu/issues/230) · Pendiente

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

#### US-41: La deuda de un gasto no puede superar el gasto · [#231](https://github.com/Joaconz/Biyu/issues/231) · Pendiente

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

#### US-79: Filtrar las deudas por lo que me deben o lo que debo · [#238](https://github.com/Joaconz/Biyu/issues/238) · Pendiente

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

#### US-82: Compartir un gasto con varias personas · [#270](https://github.com/Joaconz/Biyu/issues/270) · Pendiente

- **Objetivo:** Como usuario, quiero repartir un gasto entre varias personas, cada una con lo que me
  debe, para no tener que cargar una deuda suelta por cada una.
- **Decisión:** [ADR-040](../../docs/adr/040-gasto-compartido-con-varias-personas.md), que modifica
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

#### US-83: Las deudas sueltas mueven el balance del mes · [#271](https://github.com/Joaconz/Biyu/issues/271) · Pendiente

- **Objetivo:** Como usuario, quiero que lo que presto o me prestan sin un gasto de por medio cambie el
  balance del mes, para que el balance muestre la plata que de verdad salió y entró.
- **Decisión:** [ADR-041](../../docs/adr/041-deudas-sueltas-en-el-balance.md), que modifica ADR-037 §6
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

## Supuestos de este documento

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
