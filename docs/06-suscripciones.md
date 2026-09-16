# Suscripciones — spec de dominio

_Gastos recurrentes mensuales. Entra en V2 (ver `roadmap.md`). La decisión de generarlas por
puesta al día en vez de por job programado está en ADR-017._

---

## Qué es y qué no es

Una suscripción es **una regla que genera transacciones**, no una transacción. Netflix no es
un gasto: es la razón por la que aparece un gasto todos los meses. La distinción es la misma
que ya existe entre `transactions` (el evento) y `ledger_entries` (su impacto mensual), un
nivel más arriba.

Consecuencia práctica: **el dashboard no sabe que las suscripciones existen.** Suma
imputaciones, y las imputaciones de una suscripción son imputaciones normales. Nada del
cálculo mensual cambia por esta feature. Eso es intencional y es lo que la hace barata.

No es: una suscripción de pago de la app (planes, cobro, límites). Ver "Lo que esto no es",
al final.

## El modelo de generación

Cada vez que el usuario entra a la app, antes de renderizar cualquier cosa, el servidor
ejecuta una **puesta al día**: mira todas las suscripciones activas del usuario y crea las
transacciones de los períodos vencidos que todavía no existen. No hay cron, no hay worker, no
hay estado a mantener entre corridas.

La corrección de esto depende de una sola propiedad: **la puesta al día tiene que ser
idempotente**. Correrla cien veces seguidas tiene que dar el mismo resultado que correrla una
vez. Se garantiza en dos capas: la función de dominio no propone un período que ya está
generado, y la base tiene un índice único que lo haría fallar igual si el dominio se
equivocara (I11).

### Contrato de la función pura

```python
@dataclass(frozen=True)
class OccurrenceDraft:
    period: Period          # día 1 del mes al que se imputa
    occurred_on: date       # fecha real del cargo
    amount: Decimal
    currency: Currency
    fx_rate: Decimal | None # el de fx_rates de ESE período; None si ARS

def compute_due_occurrences(
    subscription: SubscriptionState,
    already_generated: frozenset[Period],   # períodos que ya tienen transacción
    fx_rates_by_period: Mapping[Period, Decimal],
    today: date,
) -> list[OccurrenceDraft]: ...
```

Sin base de datos, sin red, sin reloj implícito: `today` entra como parámetro. Es lo que
permite testear "no abrí la app en tres meses" sin tocar el reloj del sistema.

### Las reglas, numeradas

| # | Regla |
|---|---|
| **R1** | Los períodos candidatos van desde `generate_from_period` hasta `período_de(today)` —o hasta `min(período_de(today), end_period)` si `end_period` no es null— inclusive en ambos extremos. Si el rango queda vacío, no se genera nada |
| **R2** | Un período que ya está en `already_generated` se saltea, sin importar si esa transacción fue borrada después |
| **R3** | Si `status` es `paused` o `cancelled`, no se genera nada |
| **R4** | `occurred_on = date(período.año, período.mes, min(billing_day, días_del_mes))` |
| **R5** | El período **corriente** solo se genera si `today >= occurred_on`. Los períodos pasados se generan siempre |
| **R6** | Si `currency` es USD y el período no tiene tipo de cambio en `fx_rates`, esa ocurrencia **no se genera** y la suscripción se reporta como bloqueada. Los demás períodos sí se generan |
| **R7** | El `amount` de la ocurrencia es el `amount` **actual** de la suscripción, no uno histórico |
| **R8** | `generate_from_period` es **monótono creciente**: ninguna operación lo hace retroceder. Pausar lo lleva a `max(generate_from_period, siguiente(período_de(today)))`; reanudar, a `max(generate_from_period, start_period, período_de(today))`. Al crear la suscripción vale `start_period` |

### Por qué R4 es la regla más interesante

`billing_day = 31` y el período es febrero. No existe el 31 de febrero. La regla es
**recortar al último día del mes**, no correrse al 1 de marzo: el cargo pertenece a febrero
aunque el día no exista. Da tres casos de borde inmediatos: febrero de un año no bisiesto
(28), febrero bisiesto (29), y abril (30). Con `billing_day = 29`, febrero bisiesto genera el
29 y el común genera el 28.

### Por qué R5 existe

Sin R5, dar de alta el 2 de agosto una suscripción que se cobra el 28 haría aparecer un gasto
de agosto que todavía no ocurrió, y el dashboard del mes corriente mentiría hacia arriba. Con
R5, el 27 de agosto no hay ocurrencia y el 28 aparece. Es un límite exacto sobre `today`, con
los tres casos obvios: `today = occurred_on - 1`, `= occurred_on`, `= occurred_on + 1`.

### Por qué R7 no reescribe el pasado

Cambiar el monto de Netflix de $5.000 a $7.000 no toca las transacciones de los meses ya
generados: esas son filas propias, con su monto congelado (C5). El monto nuevo aplica desde
la próxima ocurrencia.

Queda un hueco: si el usuario está tres meses atrasado **y** cambia el monto antes de que
corra la puesta al día, los tres meses viejos se generarían al monto nuevo. Se cierra con una
regla de orden, no con una columna: **la puesta al día corre antes de servir cualquier
pantalla, incluida la de edición.** Cuando el formulario de edición se muestra, ya no hay
nada atrasado. Está anotado como una precondición del endpoint de edición, y tiene su caso de
prueba.

## Pausar, reanudar, cancelar

| Acción | Efecto |
|---|---|
| **Pausar** | `status = 'paused'`, `paused_at = now()`, y **`generate_from_period = max(generate_from_period, siguiente(período_de(today)))`** |
| **Reanudar** | `status = 'active'`, `paused_at = null`, y **`generate_from_period = max(generate_from_period, start_period, período_de(today))`** |
| **Cancelar** | `status = 'cancelled'`, `cancelled_at = now()`. Irreversible. Las transacciones ya generadas no se tocan |

Ninguna de las tres toca las transacciones ya generadas.

**Por qué mover el piso al pausar y no solo al reanudar.** La versión ingenua —pausar no
toca nada, reanudar lleva el piso al período corriente— tiene un agujero de un mes de ancho.
Con día de cobro 28: el usuario pausa el 1 de agosto (agosto todavía no se generó, por R5) y
reanuda el 30 de agosto. R1 vuelve a proponer agosto, R5 lo habilita porque `30 ≥ 28`, y se
cobra el mes en el que estuvo pausado justo el día del cargo. Adelantar el piso al pausar lo
cierra.

**Por qué `max` y no asignación directa.** Sin el `max`, reanudar puede hacer retroceder el
piso y volver a abrir períodos ya descartados —el caso de arriba, exactamente—. Y con
`start_period` en el futuro, una asignación directa escribiría un `generate_from_period`
menor que `start_period` y **rompería la invariante I12**: el `CHECK` rechazaría el UPDATE y
reanudar fallaría con un error de base. La monotonía de R8 no es prolijidad: es lo que hace
que las tres operaciones se puedan componer en cualquier orden y cualquier cantidad de veces.

**Limitación conocida, con su caso de prueba.** El piso tiene granularidad de mes, así que una
pausa que empieza y termina dentro del mismo mes **antes** del día de cobro igual saltea ese
mes. Ejemplo: día de cobro 28, pausa del 1 al 5 de agosto → agosto no se cobra, aunque la
suscripción estuvo activa el 28. Es un error conservador —saltea en vez de duplicar— y la
alternativa sería llevar una tabla de ventanas de pausa, que multiplica el modelo por una
precisión que nadie pidió. Queda anotado como caso esperado, no como defecto: si aparece en
una ejecución, se cierra como "comportamiento especificado".

**Cancelar es irreversible a propósito.** Reactivar una cancelada es dar de alta una nueva.
Evita una tercera transición de estado y el problema de qué hacer con el hueco.

## Historias de usuario

_Continúan la numeración de `02-behavior-spec.md`._

52. Como usuario, quiero dar de alta un gasto recurrente indicando nombre, monto, moneda, categoría, medio de pago y día de cobro, para no cargarlo a mano todos los meses.
53. Como usuario, quiero que los meses vencidos aparezcan cargados solos al entrar a la app, para que el dashboard esté completo sin que yo haga nada.
54. Como usuario, quiero que una suscripción cuyo día de cobro no existe en un mes se cobre igual el último día de ese mes, para que ningún mes se saltee.
55. Como usuario, quiero que el gasto del mes corriente aparezca recién el día que se cobra, para que el mes en curso no muestre plata que todavía no se fue.
56. Como usuario, quiero pausar una suscripción, para dejar de registrarla mientras no la estoy pagando.
57. Como usuario, quiero que reanudar una suscripción pausada no me cargue de golpe los meses que estuve sin pagarla, para que el mes de la reanudación no quede inflado.
58. Como usuario, quiero cancelar una suscripción sin perder el historial de lo que ya pagué, para que los meses cerrados no cambien.
59. Como usuario, quiero cambiar el monto de una suscripción cuando aumenta, sin que se modifiquen los meses ya registrados.
60. Como usuario, quiero poder borrar una ocurrencia puntual (un mes que no me cobraron) sin que el sistema me la vuelva a crear.
61. Como usuario, quiero ver qué transacciones vinieron de una suscripción y de cuál, para reconocerlas en el listado.
62. Como usuario, quiero que una suscripción en USD sin tipo de cambio cargado me avise en vez de inventar un valor, para no ensuciar los totales.
63. Como usuario, quiero ver el total mensual comprometido en suscripciones activas, para saber cuánto del mes ya está tomado antes de gastar nada.

## Escenarios BDD

```gherkin
Escenario: puesta al día de meses vencidos
  Dada una suscripción activa de 5000 ARS con día de cobro 10, desde "2026-05"
  Y ninguna transacción generada
  Cuando el usuario entra a la app el 2026-08-15
  Entonces se crean 4 transacciones, de "2026-05" a "2026-08"
  Y cada una tiene occurred_on el día 10 de su mes
  Y cada una tiene installments_count igual a 1

Escenario: la puesta al día es idempotente
  Dada la misma suscripción con sus 4 transacciones ya generadas
  Cuando la puesta al día se ejecuta de nuevo el mismo día
  Entonces no se crea ninguna transacción nueva

Escenario: día de cobro que no existe en el mes
  Dada una suscripción activa de 3000 ARS con día de cobro 31, desde "2027-01"
  Cuando el usuario entra a la app el 2027-03-05
  Entonces la ocurrencia de "2027-01" tiene occurred_on 2027-01-31
  Y la ocurrencia de "2027-02" tiene occurred_on 2027-02-28

Escenario: el mes corriente no se anticipa
  Dada una suscripción activa con día de cobro 28 y sin ocurrencias del mes corriente
  Cuando el usuario entra a la app el día 27 del mes
  Entonces no se genera la ocurrencia del mes corriente
  Pero cuando entra el día 28
  Entonces sí se genera

Escenario: reanudar no rellena los meses pausados
  Dada una suscripción con día de cobro 1, pausada el 2026-08-05, con ocurrencias hasta "2026-07"
  Cuando el usuario la reanuda el 2026-11-03
  Y la puesta al día se ejecuta
  Entonces no existen ocurrencias de "2026-08", "2026-09" ni "2026-10"
  Y la primera ocurrencia nueva pertenece al período "2026-11"

Escenario: pausar antes del día de cobro no cobra ese mes
  Dada una suscripción activa con día de cobro 28 y sin ocurrencia del mes corriente
  Cuando el usuario la pausa el día 1 del mes
  Y la reanuda el día 30 del mismo mes
  Y la puesta al día se ejecuta
  Entonces no existe ocurrencia del mes corriente

Escenario: reanudar una suscripción que todavía no empezó
  Dada una suscripción con start_period "2027-01", pausada el 2026-09-10
  Cuando el usuario la reanuda el 2026-10-04
  Entonces la operación no falla
  Y generate_from_period queda en "2027-01"
  Y no se genera ninguna ocurrencia

Escenario: una ocurrencia borrada no se regenera
  Dada una suscripción activa con la ocurrencia de "2026-06" ya generada
  Cuando el usuario elimina esa transacción
  Y la puesta al día se ejecuta de nuevo
  Entonces no se crea ninguna transacción para "2026-06"

Escenario: cancelar no toca el historial
  Dada una suscripción con ocurrencias de "2026-05" a "2026-08"
  Cuando el usuario la cancela el 2026-09-02
  Entonces las 4 transacciones siguen existiendo y contando en sus meses
  Y no se genera ninguna ocurrencia nueva

Escenario: suscripción en USD sin tipo de cambio del período
  Dada una suscripción activa de 10 USD desde "2026-06"
  Y tipo de cambio de referencia cargado para "2026-06" pero no para "2026-07"
  Cuando la puesta al día se ejecuta el 2026-07-20
  Entonces se genera la ocurrencia de "2026-06" con su tipo de cambio congelado
  Y no se genera la ocurrencia de "2026-07"
  Y la suscripción se reporta como bloqueada por falta de tipo de cambio en "2026-07"

Escenario: cambiar el monto no reescribe el pasado
  Dada una suscripción de 5000 ARS con ocurrencias de "2026-05" a "2026-08"
  Cuando el usuario cambia el monto a 7000
  Entonces las 4 transacciones existentes siguen siendo de 5000
  Y la próxima ocurrencia generada es de 7000

Escenario: suscripción con fin definido
  Dada una suscripción de 4000 ARS desde "2026-03" hasta "2026-05"
  Cuando el usuario entra a la app el 2026-09-01
  Entonces existen exactamente 3 ocurrencias: "2026-03", "2026-04" y "2026-05"
```

## Casos de borde para el catálogo de pruebas

Además de los escenarios de arriba, estos entran al catálogo de V2:

- `billing_day = 1` y `billing_day = 31` (los dos extremos válidos), `0` y `32` (rechazados).
- Febrero bisiesto vs. no bisiesto con `billing_day` 29, 30 y 31.
- `start_period` igual al período corriente, y `start_period` en el futuro (no genera nada).
- `end_period` igual a `start_period` (genera exactamente una ocurrencia).
- `end_period` anterior a `start_period` (rechazado, I12).
- Suscripción sobre una categoría o una cuenta **archivada**: no se puede crear, pero una ya existente sigue generando.
- Dos suscripciones del mismo usuario con el mismo nombre (rechazado); una cancelada y una nueva con el mismo nombre (aceptado).
- Cincuenta suscripciones activas con dos años de atraso: la puesta al día tiene que terminar en un tiempo razonable y no bloquear la respuesta.
- Dos pedidos concurrentes del mismo usuario disparando la puesta al día a la vez: uno de los dos falla contra el índice único y tiene que degradar a "ya estaba generado", no a error 500.

Ese último es el caso que un diseño de pruebas superficial no encuentra y que un índice único
convierte en trivial de arreglar. Vale la pena tenerlo escrito.

## Lo que esto no es

**No son planes de pago de la aplicación.** El brief (`00-project-brief.md`, §5) dice que
Biyu no es un producto con onboarding, planes ni cobro, y eso sigue en pie. "Suscripción"
acá significa siempre un gasto recurrente **del usuario**, registrado por el usuario. Si
alguna vez apareciera un modelo de cobro de la app, sería un dominio nuevo y necesitaría su
propio spec y su propio ADR.

**No hay frecuencias distintas de la mensual.** Anual, semanal o personalizada quedan fuera:
el modelo de períodos del sistema entero es mensual (día 1 de cada mes), y meter una
frecuencia anual obliga a decidir si se imputa entera a un mes o se prorratea en doce —
una decisión de negocio real que no vale la pena tomar antes de que exista uso. Anotado como
candidato de V3+ en el roadmap.

**No hay pagos automáticos ni integración bancaria.** El sistema registra que el gasto
existió, no lo ejecuta.
