# Casos de prueba V3 — Gráficos de cobros y por categoría en Suscripciones (US-104)

**Historia:** [#412](https://github.com/Joaconz/Biyu/issues/412) · ADR-053 (gráficos de Suscripciones), ADR-033 · C1, C2 · US-63.
**Oráculo:** los criterios CA-1 a CA-5 de la historia. «Cobrado» es que el día de cobro ya llegó (hoy incluido, R5), no que exista la transacción; cobrado + falta = el total comprometido de la tarjeta. Las suscripciones en US$ se convierten al tipo de cambio del mes.
**Convenciones:** PR-01 crea el usuario (`docs/12-procedimientos-de-prueba.md`). H es el mes de hoy en Argentina. Los casos con día de cobro entre hoy y el fin de mes se deben ajustar a la fecha de ejecución. Montos ficticios (C14).
**Automatización:** `e2e/ux-resumen.spec.ts` (CP-SUS-057 a 061), `e2e/subscriptions-charts.spec.ts` y `tests/domain/subscription-charts.test.ts`.

| ID | Título | Criterio | Técnica | Tipo | Canal | Prioridad | Automatizable |
|---|---|---|---|---|---|---|---|
| CP-SUS-057 | Lo cobrado más lo que falta es el total de la tarjeta | CA-1 | Casos de uso | Positivo | UI | Alta | Sí |
| CP-SUS-058 | Un día de cobro anterior a hoy figura como cobrado y uno posterior, como falta | CA-2 | Valores límite | Límite | UI | Alta | Sí |
| CP-SUS-059 | «Por categoría» ordena de mayor a menor y los porcentajes salen del total en pesos | CA-3 | Particiones | Positivo | UI | Media | Sí |
| CP-SUS-060 | Una suscripción en US$ sin tipo de cambio del mes se avisa y no entra a la barra | CA-4 | Adivinación de errores | Negativo | UI | Alta | Sí |
| CP-SUS-061 | Sin suscripciones activas en el mes no se dibuja ninguno de los dos gráficos | CA-5 | Valores límite | Límite | UI | Media | Sí |

## CP-SUS-057 — Cobrado + falta = total
**Pre-requisitos:** PR-01 con `grafsus-057@biyu.test`; dos suscripciones activas: $5.000,00 con día de cobro 1 y $8.000,00 con día de cobro 28.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/subscriptions` y leer `subscriptions-committed-total`. | $13.000,00. |
| 2 | Leer en «Cobros de {mes}» lo cobrado (`subscriptions-schedule-charged-amount`) y lo que falta (`subscriptions-schedule-pending-amount`). | Cobrado $5.000,00 y falta $8.000,00 (con hoy entre el 1 y el 27): suman $13.000,00. |

## CP-SUS-058 — Frontera de hoy
**Pre-requisitos:** PR-01 con `grafsus-058@biyu.test`; una suscripción de $2.000,00 con día de cobro igual al día de hoy y otra de $3.000,00 con día de cobro de mañana.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/subscriptions`. | La del día de hoy figura cobrada (círculo lleno; hoy incluido) y la de mañana, como falta (aro). |
| 2 | Tocar la columna de mañana. | El detalle debajo muestra su nombre, su monto y «falta». |
| 3 | Tocar un lugar vacío de la tira. | Elige el día con cobros más cercano. |

## CP-SUS-059 — Por categoría
**Pre-requisitos:** PR-01 con `grafsus-059@biyu.test`; suscripciones activas en ARS: $6.000,00 en «Entretenimiento», $3.000,00 en «Servicios», $1.000,00 en «Educación».

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/subscriptions` y mirar `subscriptions-by-category`. | Orden: Entretenimiento, Servicios, Educación. |
| 2 | Leer los porcentajes. | 60,0 %, 30,0 % y 10,0 %, cada uno con su monto. |
| 3 | Leer la tabla oculta (`subscriptions-by-category-table`). | Tiene las mismas tres filas. |

## CP-SUS-060 — US$ sin tipo de cambio
**Pre-requisitos:** PR-01 con `grafsus-060@biyu.test`; una suscripción de US$10,00 en «Servicios» y otra de $4.000,00 en ARS; sin tipo de cambio cargado para H.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/subscriptions`. | La fila de «Servicios» avisa que falta el tipo de cambio de la suscripción en US$. |
| 2 | Mirar las barras. | La de US$ no suma a ninguna barra; el total de la tarjeta y de los gráficos cuentan solo los $4.000,00. |
| 3 | Cargar el tipo de cambio de H en Ajustes y volver. | La suscripción en US$ entra con su monto en pesos y el aviso desaparece. |

## CP-SUS-061 — Sin suscripciones
**Pre-requisitos:** PR-01 con `grafsus-061@biyu.test`, sin suscripciones.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/subscriptions`. | Aparece el estado vacío (`subscriptions-empty`). No se dibuja «Cobros de {mes}» ni «Por categoría». |
| 2 | Crear una suscripción activa y volver. | Aparecen los dos gráficos. |
