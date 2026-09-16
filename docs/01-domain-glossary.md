# Glosario de dominio

_Vocabulario cerrado. Estos términos se usan igual en la spec, en el código, en la base de datos y en la UI. Si un concepto no está acá, no existe todavía en el sistema._

Los nombres de código van en inglés; la prosa y la UI, en español.

---

## Términos centrales

### Transacción (`Transaction`)
El **evento económico** tal como ocurrió: una compra, un cobro de sueldo, una transferencia recibida. Ocurre una sola vez, en una fecha, por un monto total.

Una transacción **no es** lo que impacta el mes. Una compra de $120.000 en 12 cuotas es *una* transacción de $120.000.

### Imputación (`LedgerEntry`)
La porción de una transacción que **cae en un período determinado**. Es la unidad que el dashboard suma.

- Una transacción de contado genera **una** imputación, en el período de la compra.
- Una transacción en 12 cuotas genera **doce** imputaciones, una por período consecutivo.

Regla que no se negocia: la suma de las imputaciones de una transacción es exactamente igual al monto de la transacción. Ni un peso de más por redondeo.

### Período (`Period`)
Mes calendario, identificado como `YYYY-MM`. Es la unidad temporal de todo el dashboard. No hay períodos parciales ni ciclos de tarjeta desfasados (ver "Fecha de imputación" abajo).

### Cuota (`Installment`)
Cada una de las N partes en que se paga una transacción. `installment_number` va de 1 a `installments_count`. Una compra de contado tiene `installments_count = 1` — no es un caso especial, es el caso general con N=1.

### Fecha de imputación
El período al que pertenece la primera imputación. Por defecto es el período de la fecha de la transacción. **No se modela el ciclo de cierre de la tarjeta**: una compra del 28 de enero imputa a enero aunque el resumen la cobre en febrero. Es una simplificación consciente (ver ADR-001, sección Consecuencias).

### Suscripción (`Subscription`)
Un **gasto recurrente mensual**: Netflix, el gimnasio, el hosting. No es una transacción: es
una regla que genera transacciones, una por mes. Tiene monto, moneda, categoría, cuenta, día
de cobro, período de inicio, período de fin opcional y estado (`active`, `paused`,
`cancelled`).

Nótese el nivel de indirección: así como una transacción no es lo que suma el dashboard (lo
es la imputación), una suscripción no es una transacción. Son tres niveles: la **regla**
genera el **evento**, y el evento genera el **impacto mensual**.

**"Suscripción" nunca significa un plan de pago de la aplicación.** Biyu no cobra ni tiene
planes (ver `00-project-brief.md`, §5).

### Ocurrencia (`Occurrence`)
La transacción concreta que una suscripción genera para un período determinado. No es una
entidad propia: es una fila de `transactions` con `subscription_id` y `subscription_period`
cargados. Una vez creada se comporta como cualquier otra transacción — se edita, se borra y
suma en el dashboard sin código especial.

### Puesta al día (`catch-up`)
El proceso que crea las ocurrencias de los períodos vencidos que todavía no existen. Corre al
entrar el usuario a la app, no en un job programado. Su propiedad definitoria es la
**idempotencia**: ejecutarla dos veces no crea nada nuevo (ver ADR-017 y `06-suscripciones.md`).

---

## Identidad

### Usuario (`User`)
La identidad dueña de todas las filas del sistema a través de `user_id`. Se crea por registro
público en `/signup` (ver ADR-011). El aislamiento entre usuarios lo aplica la capa de API en
cada consulta, no RLS (ver ADR-016 y ADR-018).

**Dos colisiones de vocabulario a tener presentes**, porque la misma palabra se usa para
cosas distintas:

- **"Cuenta"** significa dos cosas en la UI: la entidad `Cuenta (Account)` definida abajo
  (un medio de pago, como "Visa BBVA") y la acción de "crear cuenta" en `/signup` (dar de
  alta un `Usuario`). El glosario nunca usa "cuenta" para referirse a un usuario; si un
  texto de UI dice "crear cuenta", se refiere siempre al alta de `Usuario`.
- **`/register` vs. `/signup`** — `/register` es el formulario de carga de gastos (el
  nombre viene del behavior spec, de antes de que existiera el registro público); `/signup`
  es el alta de `Usuario`. Son rutas distintas para conceptos distintos.

---

## Clasificación

### Categoría (`Category`)
Etiqueta de gasto definida por el usuario: Comida, Transporte, Salidas, Servicios. Tiene nombre, color e ícono. Es una entidad con identidad propia — no un string suelto ni un elemento de un array JSON (ver ADR-003).

### Cuenta (`Account`)
El medio de pago o el origen del dinero: "Visa BBVA", "Mastercard BBVA", "MercadoPago", "Efectivo", "Caja de ahorro USD". Tiene un tipo (`credit_card`, `debit_card`, `cash`, `bank_account`, `wallet`).

Solo las cuentas de tipo `credit_card` admiten transacciones en cuotas.

### Tipo (`TransactionType`)
`expense` o `income`. **El monto siempre se guarda positivo**; el signo lo determina el tipo. Nunca hay montos negativos en la base.

---

## Monedas

### Moneda (`Currency`)
`ARS` o `USD`. No hay conversión automática entre ambas al momento de registrar: se registra en la moneda en que ocurrió el gasto.

### Tipo de cambio de referencia (`reference_fx_rate`)
Valor en ARS de 1 USD, configurado manualmente por período. Es el **default sugerido** cuando se registra una transacción en USD. Editarlo no cambia el pasado.

### Tipo de cambio aplicado (`fx_rate`)
El valor congelado **dentro de la transacción** en el momento de registrarla. Es el que se usa para todos los cálculos históricos. Una transacción en USD sin `fx_rate` es inválida (ver ADR-002).

### Monto en ARS (`amount_ars`)
Valor derivado: `amount` si la moneda es ARS, `amount × fx_rate` si es USD. Es la unidad común de todos los KPIs del dashboard.

---

## Deudas y reembolsos

### Deuda (`Debt`)
Un compromiso de dinero entre el usuario y otra persona, en una de dos direcciones:

- `owed_to_me` — alguien le debe (típicamente: pagó algo compartido con su tarjeta)
- `i_owe` — el usuario le debe a alguien

Estado: `pending` o `settled`. No hay pagos parciales.

### Deuda vinculada
Una deuda que nació de una transacción concreta (`transaction_id` presente). El monto de una deuda vinculada no puede superar el monto de la transacción de origen.

### Gasto bruto vs. gasto neto
- **Bruto**: la suma de todas las imputaciones de gasto del período, sin descontar nada.
- **Neto de reembolsos**: el bruto menos las deudas `owed_to_me` pendientes o saldadas que están vinculadas a transacciones de ese período.

El dashboard muestra **bruto como número principal** y neto como KPI secundario. Razón: el bruto es lo que efectivamente salió de la cuenta, y un reembolso que nunca llega no debe desaparecer silenciosamente de la vista (ver ADR-006).

---

## Métricas

### Cobertura (`coverage`)
Qué porcentaje del gasto real del período está efectivamente registrado en el sistema.

En v1 se aproxima con **días con registro**: cantidad de días del período con al menos una transacción cargada, sobre los días transcurridos del período. Es una proxy imperfecta pero de costo cero.

La medición real de cobertura —comparar el total registrado contra el total del resumen de la tarjeta— requiere la importación de resúmenes y llega en V3+.

---

## Términos deliberadamente ausentes

Si aparecen en una conversación, hay que decidir explícitamente si entran al dominio antes de codearlos:

| Término | Estado |
|---|---|
| Presupuesto / límite por categoría | Fuera de alcance por decisión explícita |
| Patrimonio neto | V3+ — requiere saldos e inversiones |
| Saldo de cuenta | No modelado. El dashboard no sabe cuánta plata hay en ninguna cuenta |
| Transferencia entre cuentas propias | No modelado. Sería un tercer `TransactionType` |
| Interés / recargo por financiación | No modelado. Las cuotas se asumen sin interés |
| Resumen de tarjeta (`Statement`) | V3+, con la importación |
| Plan / suscripción de la aplicación | No existe. Biyu no cobra. Ver "Suscripción" arriba |
| Frecuencia de suscripción distinta de mensual | V3+. Anual, semanal o personalizada obligan a decidir cómo se imputan |
