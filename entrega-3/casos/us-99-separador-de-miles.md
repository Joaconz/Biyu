# Casos de prueba V3 — Separador de miles al escribir el monto (US-99)

**Historia:** [#360](https://github.com/Joaconz/Biyu/issues/360) · hallazgo 7 de la auditoría [#352](https://github.com/Joaconz/Biyu/issues/352) · US-02, US-05.
**Oráculo:** la historia: el monto se muestra con formato es-AR («12.500», «12.500,5») mientras se escribe, sin cambiar el valor que se guarda (entra como texto a `decimal.js`, C2) y con el cursor en un lugar razonable. Vale para Registrar, Nueva deuda, Nueva suscripción y las pantallas de edición.
**Convenciones:** PR-01 crea el usuario (`docs/12-procedimientos-de-prueba.md`). Viewport de 390 px. Montos ficticios (C14).
**Automatización:** `e2e/amount-thousands.spec.ts` (CP-REG-053 a 057) y `tests/domain/amount-input.test.ts` (reglas de formato, cursor, pegado y borrado).

| ID | Título | Criterio | Técnica | Tipo | Canal | Prioridad | Automatizable |
|---|---|---|---|---|---|---|---|
| CP-REG-053 | El monto se muestra con separador de miles y coma decimal mientras se escribe | Formato es-AR | Clases de equivalencia | Positivo | UI | Alta | Sí |
| CP-REG-054 | Pegar un valor con punto decimal, una coma sola y letras | Entradas límite | Valores límite | Límite | UI | Media | Sí |
| CP-REG-055 | Editar en el medio no manda el cursor al final; borrar un punto borra el dígito vecino | Cursor | Casos de uso | Límite | UI | Media | Sí |
| CP-REG-056 | El gasto se guarda con el valor escrito (12.500,5 → 12500.50) | Valor guardado | Casos de uso | Positivo | UI + API | Alta | Sí |
| CP-REG-057 | Nueva deuda y Nueva suscripción muestran el mismo formato | Alcance | Casos de uso | Positivo | UI | Media | Sí |

## CP-REG-053 — Formato mientras se escribe
**Pre-requisitos:** PR-01 con `reg-053@biyu.test`, configuración inicial salteada.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En `/register` escribir «12500». | El campo muestra «12.500». |
| 2 | Escribir «,5». | El campo muestra «12.500,5». |
| 3 | Vaciar el campo y escribir «1234567». | El campo muestra «1.234.567». |

## CP-REG-054 — Pegado y entradas límite
**Pre-requisitos:** PR-01 con `reg-054@biyu.test`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Pegar «1234.56» en el monto. | Muestra «1.234,56». |
| 2 | Vaciar y escribir solo «,». | Muestra «0,». |
| 3 | Vaciar y escribir «12a». | Muestra «12»: la letra se descarta. |

## CP-REG-055 — Cursor y borrado
**Pre-requisitos:** PR-01 con `reg-055@biyu.test`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Escribir «1250» (se ve «1.250») y mover el cursor tres lugares a la izquierda («1.\|250»). | El cursor queda entre el punto y el «2». |
| 2 | Escribir «9» y después «7». | «19.250» y luego «197.250»; el cursor queda después del «7», no al final. |
| 3 | Mover el cursor una posición a la derecha y tocar Retroceso. | Se borra el punto y el dígito vecino: queda «19.250». |

## CP-REG-056 — El valor guardado no cambia
**Pre-requisitos:** PR-01 con `reg-056@biyu.test`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Escribir «12500,5» (se ve «12.500,5»), elegir «Otros» y «Efectivo» y guardar. | Aparece la confirmación de guardado. |
| 2 | PR-04: leer `transactions` con `amount::text`. | Una fila con `amount` = «12500.50». |

## CP-REG-057 — Deuda y suscripción
**Pre-requisitos:** PR-01 con `reg-057@biyu.test`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En `/debts/new` escribir «2500000» en el monto. | Muestra «2.500.000». |
| 2 | En `/subscriptions/new` escribir «7500,5» en el monto. | Muestra «7.500,5». |
