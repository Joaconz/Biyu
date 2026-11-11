# Casos de prueba V3 — Confirmación de borrado que dice qué se borra (US-94)

**Historia:** [#355](https://github.com/Joaconz/Biyu/issues/355) · ADR-044 · C4, C10.
**Oráculo:** la confirmación de eliminar usa el vocabulario de la UI («movimiento»), muestra el detalle de lo que se borra, y su botón de confirmar tiene estilo de peligro y está separado de «Cancelar». Es el mismo componente (`ConfirmDialog`) en los borrados de movimiento, deuda, suscripción y categoría.
**Convenciones:** PR-01 crea el usuario (`docs/12-procedimientos-de-prueba.md`). H es el mes de hoy en Argentina. Montos ficticios (C14). Los diálogos de deuda, suscripción y categoría ya tienen su caso en US-87, US-88 y US-89: acá se prueba lo común.
**Automatización:** `e2e/ux-ajustes.spec.ts` (CP-REG-047 a 049); `e2e/transactions-history.spec.ts` recorre además el diálogo de movimiento.

| ID | Título | Criterio | Técnica | Tipo | Canal | Prioridad | Automatizable |
|---|---|---|---|---|---|---|---|
| CP-REG-047 | El diálogo de un movimiento dice «¿Eliminar movimiento?» y muestra su detalle | CA-1, CA-2 | Casos de uso | Positivo | UI | Alta | Sí |
| CP-REG-048 | Una compra en cuotas con deuda vinculada muestra las cuotas y la deuda en el detalle | CA-2 | Casos de uso | Positivo | UI | Alta | Sí |
| CP-REG-049 | El botón de confirmar tiene estilo de peligro, está separado de «Cancelar» y «Cancelar» no borra, en los cuatro diálogos | CA-3, CA-4 | Particiones | Negativo | UI | Media | Sí |

## CP-REG-047 — Vocabulario y detalle
**Pre-requisitos:** PR-01 con `borrar-047@biyu.test`; un gasto de $12.500,00 en «Comida y supermercado» con «Efectivo», fecha de hoy.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir el gasto desde `/transactions?period=<H>` y tocar «Eliminar movimiento». | Diálogo «¿Eliminar movimiento?». Nunca dice «transacción». |
| 2 | Leer el resumen del diálogo. | Muestra el monto $12.500,00, la categoría «Comida y supermercado» y la fecha. |
| 3 | Tocar «Eliminar». | Aviso «Movimiento eliminado» y el gasto sale de la lista de activos. |

## CP-REG-048 — Cuotas y deuda vinculada
**Pre-requisitos:** PR-01 con `borrar-048@biyu.test`; un gasto de $30.000,00 en 3 cuotas con «Tarjeta de crédito», compartido con «Sofía» (deuda de $10.000,00).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir el gasto y tocar «Eliminar movimiento». | El diálogo muestra el monto, la categoría, la fecha y «3 cuotas». |
| 2 | Leer el aviso de la deuda. | Dice que la deuda con Sofía por $10.000,00 también se elimina. |
| 3 | Tocar «Cancelar». | El diálogo se cierra y el gasto y su deuda siguen. |

## CP-REG-049 — Estilo de peligro y separación
**Pre-requisitos:** PR-01 con `borrar-049@biyu.test`; un gasto, una deuda suelta, una suscripción y una categoría propia sin movimientos.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir el diálogo de eliminar de cada uno de los cuatro. | Todos tienen el mismo formato: título, resumen, botón «Eliminar» con estilo de peligro (destructivo) y botón «Cancelar» aparte, a al menos 8 px de distancia, sin que se puedan confundir. |
| 2 | En cada diálogo tocar «Cancelar» (y repetir con Escape). | Se cierra sin borrar nada. |
