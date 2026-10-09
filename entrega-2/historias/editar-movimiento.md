# Proyecto Biyu – Entrega 2 · Editar un movimiento: US-84 (V2)

**Testing de Aplicaciones · Proyecto Integrador** · Versión del documento: 2026-10-09 · Alcance de
V2. Mismo formato que `entrega-2/historias/importar-excel.md`. Decisión de diseño:
[ADR-043](../../docs/adr/043-editar-un-movimiento-con-una-rpc.md), que aplica
[ADR-009](../../docs/adr/009-regeneracion-de-imputaciones-al-editar.md) a un contrato concreto.

**Vocabulario.** "Movimiento" es el rótulo de la UI para una **Transacción** del glosario
(`docs/01-domain-glossary.md`). "Mes cerrado" es el de la definición del glosario: cualquier período
anterior al mes actual. H es el mes de hoy en Argentina (ADR-021) cuando se ejecuta el caso; H−1 es el
mes anterior, H−3 tres meses antes. "Una fecha de H−1" es cualquier día de ese mes. Los criterios no
dependen del día de hoy, salvo los marcados como prueba de dominio, que fijan "hoy".

---

#### US-84: Editar un movimiento ya cargado · [#284](https://github.com/Joaconz/Biyu/issues/284) · Pendiente

- **Objetivo:** Como usuario que se equivocó al cargar un gasto o un ingreso, quiero corregirlo, para
  no tener que eliminarlo y volver a cargarlo, y quiero que me avise qué meses ya cerrados van a
  cambiar antes de guardar.
- **Épica:** [#23](https://github.com/Joaconz/Biyu/issues/23) (Edición de transacciones). Cubre FR-07.
- **Depende de:** Registrar (US-01 a US-11) y Movimientos (US-17, US-18, US-65). No depende de la
  importación. Los avisos de un movimiento de suscripción y de uno compartido (apartado 2) existen porque
  esos movimientos ya existen (US-52, US-34, US-82); si esas historias no están, esos estados no aparecen.

##### 1. Dónde se entra

- En **Movimientos** (`/transactions`), cada fila activa tiene el botón de ícono **"Editar"**
  (`transactions-item-edit`, `aria-label="Editar movimiento"`), al lado de "Eliminar". Las filas
  eliminadas no lo tienen: en la vista "Eliminados" (`?view=deleted`) solo se ofrece "Restaurar".
- Lleva a **Editar movimiento** (`/transactions/:id/edit`). El período de Movimientos queda en la
  URL (C11): al guardar o cancelar se vuelve a `/transactions?period=<AAAA-MM>` con el mismo período
  con que se salió. La barra inferior marca Resumen, como en el resto de Movimientos (US-69).
- El Resumen y el detalle de una categoría no tienen el botón en V2.

##### 2. Pantalla Editar movimiento

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

##### 3. Aviso de meses cerrados (FR-07)

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

##### 4. Qué guarda la base

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

##### 5. Criterios de aceptación

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

##### 6. Fuera de alcance

- Cambiar el tipo, la moneda o el tipo de cambio (ADR-043 §2, C5).
- Editar un movimiento compartido o su deuda; editar el movimiento de una suscripción; editar uno eliminado.
- Editar varios movimientos a la vez; deshacer una edición; historial de cambios.
- Entrar a editar desde el Resumen, el detalle de una categoría o un listado de deudas.
- La compra en cuotas empezada (US-80): cuando exista, no se podrá editar (ADR-043 §8).

##### 7. Supuestos

1. Un movimiento de H−1 o anterior se puede editar sin límite de antigüedad; el aviso del apartado 3 es la
   única barrera (FR-07).
2. El aviso se arma en el cliente con el calendario original recalculado desde los datos del movimiento,
   no leyendo las imputaciones guardadas. Como las imputaciones se generan siempre con la misma función
   (C3), el resultado coincide; si alguna vez no coincidiera, es un defecto de integridad (I1 a I3).
3. "Mes que cambia" compara, por cada mes cerrado, el monto en pesos, la categoría y la cuenta de la
   imputación, que son los totales del Resumen (mes, categoría y "Gasto por cuenta"). La descripción no
   mueve ningún total y no cuenta.
4. No hay control optimista de versión: gana la última edición (ADR-043 §6).

##### 8. Trazabilidad

- **Trazabilidad:** FR-07 · FR-06 · FR-10 · FR-11 · C3, C4, C5, C6, C7, C10, C11 · I1, I1', I2, I3, I6, I10 ·
  ADR-009, ADR-043
- **Mock:** pendiente (se hace con la primera ronda de implementación).
