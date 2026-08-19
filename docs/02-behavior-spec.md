# Behavior Spec

_Qué tiene que hacer el sistema, desde la perspectiva del usuario. El "cómo" está en `03-architecture-spec.md`._

Alcance de este spec: **registro de transacciones + dashboard mensual + deudas**. La
importación de resúmenes de tarjeta queda fuera (ver ADR-005). Las **suscripciones** (gastos
recurrentes mensuales) tienen su propio documento: `06-suscripciones.md`, historias 52 a 63.

> **Nota de versiones.** Este documento se escribió cuando el proyecto tenía un roadmap
> propio de seis slices. El corte vigente es el de la materia — V1 / V2 / V3 en
> `roadmap.md`. El contenido de acá no cambió; cambió cómo se reparte. Lo que quedó afuera de
> V1 está marcado en el roadmap, no acá.

---

## Problem Statement

Joaquin gasta en cuatro medios de pago distintos, en dos monedas, y una parte de esos gastos son compartidos con otra persona que después le reembolsa. Hoy no tiene ninguna forma de responder "¿en qué se fue la plata en julio?" sin abrir cuatro resúmenes y hacer cuentas a mano.

Dos intentos anteriores de resolverlo murieron porque el registro requería estar frente a una computadora o pelear con la app de Google Sheets en el celular.

## Solution

Una aplicación web mobile-first donde:

1. Registrar un gasto es la pantalla de inicio, y toma menos de diez segundos.
2. Una compra en cuotas se reparte automáticamente entre los meses que corresponde, sin que el usuario haga cuentas.
3. Los gastos en dólares se guardan con el tipo de cambio del momento y no se recalculan retroactivamente.
4. Un gasto compartido puede convertirse en una deuda a cobrar sin salir del flujo de registro.
5. El dashboard mensual muestra cuánto se gastó, en qué categorías y con qué medio de pago.

## Assumptions

Decisiones que tomé sin confirmación explícita. Revisá esta lista: si alguna está mal, corregila antes de implementar.

1. **Multi-tenant desde el registro público.** Cualquiera con el link puede crear una cuenta en `/signup`. El aislamiento por `user_id` lo aplica la capa de API en cada consulta, no RLS (ver ADR-016 y ADR-018). Reemplaza la decisión original de ADR-004 (usuario único creado a mano) — ver ADR-011.
2. **El ciclo de cierre de la tarjeta se ignora.** Una compra imputa al mes de su fecha, no al mes en que la cobra el resumen. Modelar el cierre real requeriría configurar día de cierre por tarjeta y desplazar imputaciones — complejidad que no aporta al objetivo primario.
3. **Cuotas sin interés.** El monto total de la transacción se reparte en partes iguales. No se modela recargo por financiación.
4. **El dashboard muestra bruto.** El neto de reembolsos es un KPI secundario, no el número grande.
5. **Las deudas no tienen pagos parciales.** Están pendientes o saldadas.
6. **Los ingresos no van en cuotas.** `installments_count > 1` solo se permite para `type = expense` sobre cuentas de tipo tarjeta de crédito.
7. **No hay borrado físico de transacciones.** Se marcan como eliminadas (soft delete) para que el historial de un mes cerrado no cambie por accidente. Se pueden ocultar del dashboard, no evaporar.
8. **Los períodos futuros son visibles.** Si hoy es agosto y hay cuotas hasta diciembre, el selector de mes deja ver diciembre con las imputaciones ya conocidas.
9. **Las suscripciones no se anticipan.** Un período futuro muestra las cuotas ya comprometidas pero **no** las suscripciones que todavía no se cobraron: una cuota es una obligación ya contraída, una suscripción es una que se puede cancelar antes. Ver `06-suscripciones.md`, regla R1 (el tope en el período corriente) y R5.

## User Stories

### Registro de transacciones

1. Como usuario, quiero que el formulario de registro sea lo primero que veo al abrir la app, para no navegar antes de cargar un gasto.
2. Como usuario, quiero que el campo de monto reciba el foco automáticamente y abra el teclado numérico, para empezar a tipear sin tocar nada.
3. Como usuario, quiero que la fecha venga precargada con hoy, para no tocarla en el 95% de los casos.
4. Como usuario, quiero que el tipo venga precargado en "gasto", porque registro muchos más gastos que ingresos.
5. Como usuario, quiero que la moneda venga precargada en ARS, porque es la moneda de la mayoría de mis gastos.
6. Como usuario, quiero elegir la categoría tocando un chip en una grilla visible, en vez de abrir un `select` y scrollear.
7. Como usuario, quiero que la cuenta venga precargada con la que usé la última vez, para ahorrar un tap en el caso frecuente.
8. Como usuario, quiero poder guardar un gasto sin escribir descripción, porque la categoría suele alcanzar.
9. Como usuario, quiero registrar un gasto con fecha pasada, para cargar algo que me olvidé ayer.
10. Como usuario, quiero ver una confirmación breve al guardar y volver al formulario vacío, para poder cargar dos gastos seguidos.
11. Como usuario, quiero que el formulario no me deje guardar un monto de cero o negativo, para no ensuciar los datos.

### Cuotas

12. Como usuario, quiero indicar la cantidad de cuotas al registrar una compra con tarjeta de crédito, para que se reparta sola entre los meses.
13. Como usuario, quiero ver, antes de guardar, cuánto va a impactar por mes y hasta qué mes llega, para confirmar que entendí bien la compra.
14. Como usuario, quiero que el selector de cuotas solo aparezca si elegí una tarjeta de crédito, para que el formulario no tenga campos irrelevantes.
15. Como usuario, quiero que el reparto de cuotas nunca pierda ni invente centavos, para que la suma de las cuotas sea exactamente lo que gasté.
16. Como usuario, quiero ver en el dashboard de un mes cuánto de ese total es "cuotas de meses anteriores", para entender qué parte del mes ya estaba comprometida antes de empezarlo.
17. Como usuario, quiero ver qué cuota de cuántas es cada imputación en el listado (ej. "3/12"), para reconocerla.
18. Como usuario, quiero que borrar una compra en cuotas borre todas sus cuotas futuras, para no quedarme con imputaciones huérfanas.

### Monedas

19. Como usuario, quiero registrar un gasto en USD sin convertirlo a mano, para no hacer cuentas.
20. Como usuario, quiero que la app me sugiera el tipo de cambio del mes que ya configuré, para no tipearlo cada vez.
21. Como usuario, quiero poder pisar ese tipo de cambio sugerido en una transacción puntual, para reflejar una operación a un valor distinto.
22. Como usuario, quiero que cambiar el tipo de cambio de referencia no altere los totales de meses ya cargados, para que el historial sea estable.
23. Como usuario, quiero ver el total del mes en ARS incluyendo los gastos en USD convertidos, para tener un único número comparable.
24. Como usuario, quiero ver por separado cuánto gasté en USD nativo, para saber cuánto salió de mis dólares.

### Dashboard

25. Como usuario, quiero ver el total gastado del mes actual apenas entro al dashboard, para tener la respuesta principal sin filtrar nada.
26. Como usuario, quiero cambiar de mes con un selector, para revisar meses anteriores o ver cuotas futuras.
27. Como usuario, quiero ver el gasto desagregado por categoría en un gráfico de barras, para identificar dónde se concentra.
28. Como usuario, quiero ver el gasto desagregado por cuenta, para saber qué tarjeta está cargada.
29. Como usuario, quiero ver el total de ingresos del mes y el balance (ingresos menos gastos), para saber si el mes cerró en positivo.
30. Como usuario, quiero ver el gasto neto de reembolsos (pendientes o saldados) como dato secundario, para saber cuánto es realmente mío.
31. Como usuario, quiero ver las últimas transacciones del mes con un acceso a la lista completa, para verificar lo que cargué.
32. Como usuario, quiero ver cuántos días del mes tienen al menos un registro, para saber si estoy siendo consistente.
33. Como usuario, quiero que un mes sin datos muestre un mensaje claro y un acceso al registro, en vez de un dashboard de ceros.

### Deudas

34. Como usuario, quiero marcar un gasto como compartido al registrarlo, indicando persona y monto adeudado, para no tener que cargarlo dos veces.
35. Como usuario, quiero que esa deuda quede vinculada al gasto que la originó, para saber después de qué venía.
36. Como usuario, quiero cargar una deuda suelta, sin gasto asociado, para registrar una plata que presté en efectivo.
37. Como usuario, quiero ver dos totales separados —lo que me deben y lo que debo—, para tener el neto claro.
38. Como usuario, quiero filtrar las deudas por pendientes o saldadas, para enfocarme en lo que falta cobrar.
39. Como usuario, quiero marcar una deuda como saldada en un tap, para cerrarla cuando me pagan.
40. Como usuario, quiero poder revertir un "saldada" marcado por error, para corregirme sin borrar el registro.
41. Como usuario, quiero que el monto de una deuda vinculada no pueda superar el gasto de origen, para no registrar imposibles.

### Configuración

42. Como usuario, quiero crear, renombrar y elegir color de mis categorías, para que reflejen cómo pienso mis gastos.
43. Como usuario, quiero que la app venga con un set de categorías inicial, para no arrancar con una pantalla vacía.
44. Como usuario, quiero archivar una categoría que ya no uso sin perder las transacciones históricas que la usaban, para limpiar el formulario sin romper el pasado.
45. Como usuario, quiero crear mis cuentas indicando su tipo, para que la app sepa cuáles admiten cuotas.
46. Como usuario, quiero cargar el tipo de cambio de referencia de cada mes, para que el registro en USD sea rápido.
47. Como usuario, quiero exportar todas mis transacciones a CSV, para tener mis datos afuera de la app.

### Acceso

48. Como usuario, quiero que la app pida login, para que mis finanzas no queden expuestas en una URL pública.
49. Como usuario, quiero seguir logueado entre sesiones en mi celular, para no autenticarme cada vez que registro un gasto.
50. Como usuario nuevo, quiero crear mi cuenta con email y contraseña en `/signup`, para empezar a usar la app sin que nadie me la habilite a mano.
51. Como usuario nuevo, quiero entrar directo después de registrarme, sin un paso intermedio de confirmación por email, para no perder el momento en que decidí usar la app.

---

## Behavior Detail

### Happy path — registrar un gasto en cuotas compartido

1. El usuario abre la app en el celular y cae en `/register` ya autenticado.
2. El foco está en el campo de monto; tipea `120000`.
3. Deja moneda en ARS y tipo en "gasto".
4. Toca el chip de categoría "Tecnología".
5. Selecciona la cuenta "Visa BBVA" (tipo `credit_card`).
6. Aparece el selector de cuotas. Elige 12.
7. La UI muestra: "12 cuotas de $10.000 — de 2026-08 a 2027-07".
8. Activa "compartido", ingresa persona "Sofía" y monto `60000`.
9. Toca Guardar.
10. El sistema crea, **en una sola operación atómica**: una transacción de $120.000, doce imputaciones de $10.000 en períodos consecutivos desde 2026-08, y una deuda `owed_to_me` de $60.000 vinculada a la transacción.
11. Se muestra una confirmación breve y el formulario vuelve a su estado inicial, conservando la última cuenta usada.

### Happy path — ver el mes

1. El usuario entra a `/dashboard`.
2. El sistema resuelve el período actual y suma todas las imputaciones de ese período.
3. Muestra: total gastado ARS (con USD convertido a su `fx_rate` congelado), total ingresos, balance, gasto neto de reembolsos, y cuánto del total corresponde a cuotas iniciadas en meses anteriores.
4. Debajo: barras por categoría, desglose por cuenta, últimas 10 transacciones, y días con registro.

### Sad path — monto inválido

1. El usuario deja el monto vacío, o ingresa `0`, o un valor negativo.
2. El botón Guardar queda deshabilitado y el campo muestra el motivo.
3. No se emite ninguna escritura.

### Sad path — transacción en USD sin tipo de cambio

1. El usuario elige moneda USD y el período actual no tiene tipo de cambio de referencia configurado.
2. El formulario muestra un campo de tipo de cambio vacío y obligatorio, con un enlace a configuración.
3. Si intenta guardar sin completarlo, el guardado se bloquea con un mensaje explícito. No se asume ningún valor por defecto.

### Sad path — cuotas sobre una cuenta que no es tarjeta de crédito

1. El usuario tenía 6 cuotas seleccionadas y cambia la cuenta a "Efectivo".
2. El selector de cuotas desaparece y el valor vuelve a 1, con un aviso de que se restableció.
3. Si una petición llegara igual con `installments_count > 1` sobre una cuenta no crediticia, el servidor la rechaza.

### Sad path — reparto de cuotas con resto

1. El usuario registra $100.000 en 3 cuotas.
2. La división da 33.333,333…
3. El sistema genera dos cuotas de $33.333,33 y una última de $33.333,34.
4. La suma es exactamente $100.000. **El resto siempre lo absorbe la última cuota.**

### Sad path — deuda mayor que el gasto

1. El usuario registra un gasto de $10.000 y marca compartido por $15.000.
2. La validación falla en cliente y en servidor. No se crea ni la transacción ni la deuda.

### Sad path — fallo parcial de escritura

1. La transacción se inserta pero la generación de imputaciones falla.
2. La operación completa se revierte. No queda ninguna transacción sin imputaciones.
3. El usuario ve un error genérico con opción de reintentar, y el formulario conserva lo que había cargado.

### Sad path — borrado de una transacción con cuotas ya transcurridas

1. El usuario borra en octubre una compra de agosto en 12 cuotas.
2. El sistema marca la transacción como eliminada y **todas** sus imputaciones dejan de contar, incluidas las de agosto y septiembre.
3. Se advierte explícitamente antes de confirmar que esto altera los totales de meses ya cerrados.

### Sad path — categoría archivada

1. El usuario archiva "Salidas".
2. La categoría desaparece del formulario de registro.
3. Las transacciones históricas la siguen mostrando, con una marca visual de archivada.
4. El dashboard de meses pasados sigue mostrando la barra de esa categoría.

### BDD scenarios

```gherkin
Escenario: prorrateo exacto sin resto
  Dado un gasto de 120000 ARS en 12 cuotas con fecha 2026-08-15
  Cuando se guarda la transacción
  Entonces se crean 12 imputaciones de 10000 ARS
  Y la primera imputación pertenece al período "2026-08"
  Y la última imputación pertenece al período "2027-07"
  Y la suma de las imputaciones es exactamente 120000

Escenario: prorrateo con resto absorbido por la última cuota
  Dado un gasto de 100000 ARS en 3 cuotas
  Cuando se guarda la transacción
  Entonces las primeras 2 imputaciones son de 33333.33
  Y la última imputación es de 33333.34
  Y la suma de las imputaciones es exactamente 100000

Escenario: el tipo de cambio queda congelado
  Dado un gasto de 100 USD registrado con un tipo de cambio de 1250
  Cuando el tipo de cambio de referencia del período cambia a 1400
  Entonces el monto en ARS de ese gasto sigue siendo 125000

Escenario: USD sin tipo de cambio se rechaza
  Dado un gasto en USD
  Y ningún tipo de cambio de referencia configurado para el período
  Cuando el usuario intenta guardar sin ingresar un tipo de cambio
  Entonces el guardado se rechaza
  Y se muestra un mensaje que pide el tipo de cambio
  Y no se crea ninguna transacción

Escenario: gasto compartido genera deuda vinculada
  Dado un gasto de 120000 ARS marcado como compartido con "Sofía" por 60000
  Cuando se guarda la transacción
  Entonces existe una deuda de 60000 con dirección "owed_to_me"
  Y esa deuda referencia la transacción creada
  Y su estado es "pending"

Escenario: la deuda no puede superar el gasto
  Dado un gasto de 10000 ARS marcado como compartido por 15000
  Cuando se intenta guardar
  Entonces la operación se rechaza
  Y no se crea ninguna transacción ni ninguna deuda

Escenario: cuotas restringidas a tarjetas de crédito
  Dado un gasto sobre una cuenta de tipo "cash"
  Cuando se intenta guardar con 6 cuotas
  Entonces la operación se rechaza

Escenario: el dashboard separa cuotas heredadas
  Dado un gasto de 120000 en 12 cuotas registrado en 2026-08
  Cuando se consulta el dashboard del período "2026-09"
  Entonces el total del período incluye 10000
  Y el KPI de cuotas de meses anteriores es 10000

Escenario: bruto y neto de reembolsos
  Dado un gasto de 120000 en el período actual con una deuda pendiente de 60000 a favor
  Cuando se consulta el dashboard
  Entonces el gasto bruto es 120000
  Y el gasto neto de reembolsos es 60000

Escenario: borrado lógico saca las imputaciones del cálculo
  Dado un gasto de 120000 en 12 cuotas registrado en 2026-08
  Cuando el usuario elimina la transacción
  Entonces el total del período "2026-08" ya no incluye esa imputación
  Y el total del período "2027-01" ya no incluye esa imputación
```

---

## Implementation Decisions

- **Módulos de dominio puros.** `generate_ledger_entries`, `compute_monthly_summary`, `resolve_fx_rate`, `validate_transaction_draft` y `compute_due_occurrences` son funciones puras de Python, sin dependencias de FastAPI ni de SQLAlchemy. Reciben datos, devuelven datos.
- **Las escrituras pasan por endpoints de la API**, que validan con un modelo Pydantic, invocan al dominio y persisten en una transacción de base. La validación de cliente es una conveniencia, no la fuente de verdad: toda regla se revalida en el servidor.
- **Las imputaciones se materializan al escribir**, no se calculan al leer (ver ADR-001). Insertar una transacción y sus N imputaciones es una operación atómica en la base.
- **Contrato de `generate_ledger_entries`** — encoda la regla de redondeo (ver ADR-013 para el
  porqué de las dos reglas distintas: truncar + absorber para las cuotas, half-up para la
  conversión a ARS):

```python
@dataclass(frozen=True)
class LedgerEntryDraft:
    period: Period            # (año, mes) — ver domain/period.py
    installment_number: int
    amount: Decimal           # en la moneda de la transacción
    amount_ars: Decimal       # prorrateo del total en ARS, no la conversión cuota a cuota (I1')

# Invariante I1:  sum(e.amount for e in result)     == amount,                       exacto.
# Invariante I1': sum(e.amount_ars for e in result) == convert_to_ars(amount, fx_rate), exacto.
# El resto de cada división lo absorbe la última cuota, en las dos series por separado.
def generate_ledger_entries(
    amount: Decimal,
    fx_rate: Decimal | None,   # None ⇒ ARS (I5)
    installments_count: int,
    first_period: Period,
) -> list[LedgerEntryDraft]: ...
```

- **Aritmética decimal, nunca punto flotante** para montos. `numeric(14,2)` en Postgres y `decimal.Decimal` de la biblioteca estándar en Python. Un `0.1 + 0.2` en el prorrateo rompe la invariante principal del sistema.
- **Categorías y cuentas son tablas**, no JSON dentro de una fila de configuración (ver ADR-003). Las claves foráneas son reales.
- **La clave de API de Anthropic no se almacena en la base de datos** ni se pide por UI. Cuando llegue la importación en V3+, será una variable de entorno del servidor.
- **El dashboard se lee del servidor** en un único endpoint que devuelve el resumen ya calculado, sin estado de cliente para datos que no cambian dentro de la vista. El selector de mes navega cambiando el parámetro de URL, de modo que un mes es enlazable (C11).
- **Soft delete** con `deleted_at` en transacciones; las consultas del dashboard filtran por él.

## Testing Decisions

**Qué es un buen test acá:** verifica comportamiento observable —lo que entra y lo que sale de un módulo, o lo que el usuario ve— y no la forma interna en que está resuelto. Un test que se rompe al renombrar una función privada o al reordenar un `useState` es ruido y hay que borrarlo.

Seams, del más alto al más bajo:

1. **Dominio puro** (seam principal, donde va el grueso de los tests). `generate_ledger_entries`, `compute_monthly_summary` y `compute_due_occurrences` se testean con tablas de casos parametrizadas: montos con y sin resto, 1 cuota, 12 cuotas, cruce de año, mezcla ARS/USD, período vacío, día 31 en febrero. Cada invariante de `04-data-model.md` tiene su test.
2. **API** (integración, pocos y elegidos). Contra una instancia de Postgres en Docker. Cubren: atomicidad de transacción + imputaciones + deuda, rechazo de cuotas sobre cuenta no crediticia, rechazo de USD sin tipo de cambio, que el soft delete saque las imputaciones del cálculo, idempotencia de la puesta al día, y **autorización cruzada** (pedir con el token de otro usuario devuelve 404).
3. **Formulario de registro** (componente). Testing Library, comportamiento visible: el selector de cuotas aparece y desaparece según el tipo de cuenta, la previsualización de cuotas refleja el monto, Guardar queda deshabilitado con monto inválido.
4. **Flujo completo** (end-to-end). Login → registrar un gasto en cuotas → verlo reflejado en el dashboard. En V1 es una sola prueba de humo del deploy; en V3 se amplía al subconjunto automatizado.

**Prior art:** ninguno, es un proyecto nuevo. Estos cuatro niveles definen la convención; lo que se agregue después se acomoda a ellos. El detalle de quién diseña qué, cómo se reportan los defectos y qué se automatiza está en `07-plan-de-testing.md`.

**Test de arquitectura:** una prueba que falla si algún módulo bajo `domain/` importa `fastapi`, `sqlalchemy` o cualquier cosa de infraestructura. Es la métrica M2 del brief, automatizada.

## Out of Scope

| Fuera de alcance | Razón |
|---|---|
| Importación de resúmenes de tarjeta en PDF | Es la feature más compleja del sistema original y la que menos aporta al modelo de dominio. Ver ADR-005 |
| Ciclo de cierre real de la tarjeta | Requiere configurar día de cierre por cuenta y desplazar imputaciones |
| Cuotas con interés o recargo | Se asume financiación sin costo |
| Pagos parciales de deudas | Una deuda está pendiente o saldada |
| Presupuesto o límite por categoría | Decisión explícita: el sistema informa, no controla |
| Patrimonio neto, inversiones, CEDEARs | Requiere saldos y cotizaciones en tiempo real |
| Tipo de cambio automático desde una API | Manual por período |
| Transferencias entre cuentas propias | Necesitaría un tercer tipo de transacción |
| Recuperación de contraseña | Sin SMTP configurado. Se resuelve a mano contra la base mientras tanto |
| Confirmación de email al registrarse | Desactivada a propósito (ADR-011): no hay servicio de envío y el flujo agrega un paso que corta el momento del alta |
| CAPTCHA u otra mitigación de bots en `/signup` | Agrega una dependencia que la spec no justifica todavía; asumido como riesgo en ADR-011 |
| Aplicación instalable (PWA) | V3+, una vez que exista uso real |
| Categorías anidadas | Una sola dimensión de categoría |
| Suscripciones con frecuencia distinta de la mensual | Anual, semanal o personalizada. Ver `06-suscripciones.md`, "Lo que esto no es" |
| Planes de pago de la aplicación | No es un producto con cobro (`00-project-brief.md`, §5) |

## Further Notes

**El riesgo principal no es técnico.** Es el tercer intento de este sistema. Los dos anteriores fallaron por acumulación de alcance antes de que existiera uso. La restricción operativa es: no se agrega ninguna feature de v2 hasta que exista **un mes calendario completo con datos reales cargados**. Esto no es una preferencia estética; es el criterio de corte que hace que este proyecto sea distinto de los dos anteriores.

**Sobre la tensión entre las dos metas.** El objetivo primario declarado es el artefacto de ingeniería. Eso justifica invertir en dominio testeado, ADRs y arquitectura limpia — no justifica construir más pantallas. Una app chica con un modelo de dominio bien resuelto y defendido se presenta mejor que una app grande con lógica desparramada en componentes.

**Lo más interesante de defender en una entrevista o una mesa de examen** es el modelo transacción/imputación: por qué el evento económico y su impacto mensual son entidades distintas, y qué se rompe si se colapsan en una sola tabla. Vale la pena que el README lo cuente explícitamente.
