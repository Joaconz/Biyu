# Guita — Pre-Entrega

**Testing de Aplicaciones · Proyecto Integrador**

Grupo: _(completar nombres)_ · Fecha: _(completar)_

---

## 1. Nombre tentativo

**Guita** — control de gastos personales para el contexto argentino.

## 2. Qué problema resuelve

**Para quién.** Personas que viven en Argentina, gastan en pesos y en dólares, pagan una parte importante de sus compras en cuotas, y comparten algunos gastos con otra persona que después les reembolsa.

**Qué problema.** No es falta de plata: es falta de visibilidad. Nadie puede responder "¿en qué se me fue la plata en julio?" sin abrir cuatro resúmenes de tarjeta y hacer cuentas a mano.

**Por qué las apps existentes no alcanzan.** Casi ninguna modela bien las tres cosas que definen el gasto acá:

1. **Dos monedas simultáneas.** Convertir todo al dólar de hoy distorsiona el pasado. Una compra de USD 100 hecha a $1.250 costó $125.000, y eso no cambia porque hoy el dólar valga $1.400.
2. **Cuotas.** Contar una compra de 12 cuotas entera en el mes de la compra hace que ese mes parezca catastrófico y los 11 siguientes parezcan baratos.
3. **Gastos compartidos.** Si el reembolso que te deben no se modela, el total del mes miente.

**Qué hace la app.** Registra cada gasto en menos de diez segundos desde el celular, reparte automáticamente las cuotas entre los meses que corresponde, congela el tipo de cambio del momento, y muestra un dashboard mensual que responde la pregunta.

## 3. Requerimientos de alto nivel

Desde el punto de vista del usuario, la aplicación permite:

- Crear una cuenta y entrar con email y contraseña; los datos de cada usuario son privados y aislados.
- Definir sus **categorías** de gasto y sus **medios de pago** (tarjeta de crédito, débito, efectivo, cuenta bancaria, billetera virtual), con un set inicial ya cargado.
- **Registrar un gasto o un ingreso** indicando monto, moneda (ARS o USD), categoría, medio de pago y fecha.
- Registrar una compra **en cuotas**: el sistema reparte el monto entre los meses siguientes sin que el usuario haga cuentas, y le muestra el impacto mensual antes de guardar.
- Cargar gastos en **dólares** con el tipo de cambio del momento, que queda congelado y no se recalcula nunca.
- Marcar un gasto como **compartido**, generando una deuda a cobrar vinculada a ese gasto.
- Dar de alta **suscripciones** (gastos recurrentes mensuales como Netflix o el gimnasio): el sistema genera solo las transacciones de los meses vencidos, y la suscripción se puede pausar, reactivar o cancelar.
- Ver un **dashboard mensual**: total gastado, ingresos, balance, qué parte del mes son cuotas arrastradas de meses anteriores, desglose por categoría y por medio de pago, y las últimas transacciones.
- Navegar a **cualquier mes**, pasado o futuro (las cuotas ya comprometidas se ven por adelantado).
- **Eliminar** una transacción sin que desaparezca del historial, con aviso de que altera totales de meses ya cerrados.
- **Exportar** todos sus datos a CSV.

## 4. Por qué esta app es interesante para testear

Esta es la sección que importa para la aprobación. No es un CRUD: cada operación dispara un cálculo o un cambio de estado con reglas que se pueden violar de formas concretas.

| Regla de negocio | Casos que genera |
|---|---|
| El monto se reparte en N cuotas y **la suma de las cuotas es exactamente el monto original** | Valores límite: 1 cuota, 12 cuotas, montos que dividen exacto vs. con resto ($100.000 en 3 = 33.333,33 + 33.333,33 + **33.333,34**), monto mínimo $0,01, cruce de año |
| Las cuotas solo se permiten sobre **tarjeta de crédito** y solo en gastos | Caso negativo dependiente de estado: cambiar la cuenta a "Efectivo" con 6 cuotas ya elegidas; petición directa a la API salteando la UI |
| Un gasto en USD **exige** tipo de cambio; uno en ARS no puede tenerlo | Caso negativo, y regla de exclusión mutua en ambos sentidos |
| El tipo de cambio **queda congelado** al momento de guardar | Regla temporal: cambiar la configuración no puede alterar ningún total ya calculado |
| El monto de una deuda **no puede superar** el gasto que la originó | Valor límite: igual al gasto (válido), un centavo más (rechazado) |
| Las ocurrencias de una suscripción se generan **al día, sin duplicar** | Idempotencia (correr la puesta al día dos veces no duplica nada), suscripción con día 31 en febrero, tres meses sin abrir la app, cancelación con meses vencidos sin generar |
| Borrar una transacción en cuotas **saca todas** sus cuotas, incluidas las pasadas | Efecto retroactivo sobre meses ya cerrados |
| Cada usuario ve **solo** sus datos | Caso de seguridad: pedir por ID un recurso de otro usuario |
| Crear una transacción es **atómico** | Fallo parcial: si falla la generación de cuotas, no puede quedar una transacción huérfana |

Cada una de estas reglas está escrita en el proyecto como una **invariante numerada**, lo que da un oráculo verificable para cada caso de prueba en vez de un "debería andar".

## 5. Roadmap

### V1 — Núcleo funcional mínimo, ya testeable

Registro y login. ABM de categorías y medios de pago. Registro de transacciones con monto, moneda, tipo, categoría, cuenta y fecha. **Cuotas con prorrateo y absorción de resto.** Multimoneda con tipo de cambio congelado. Dashboard mensual con totales, cuotas heredadas, desglose por categoría y por cuenta. Baja lógica.

**Foco de testing:** casos felices, negativos y de borde sobre el cálculo de cuotas, la conversión de moneda y las validaciones de alta.

### V2 — Evolución a MVP usable

- **Funcional:** suscripciones (gastos recurrentes mensuales con puesta al día, pausa, reactivación y cancelación) · gastos compartidos y gestión de deudas (pendiente/saldada, con reversión) · exportación a CSV.
- **Interfaz:** estados vacíos con acción, previsualización del impacto de cuotas antes de guardar, retroalimentación de carga y error, diseño mobile-first.
- **No funcional:** tiempo de respuesta del dashboard bajo volumen de datos, accesibilidad básica por teclado y contraste.

**Foco de testing:** además de los casos nuevos, **pruebas de regresión** sobre todo V1 y **confirmación de los defectos** reportados en la etapa anterior.

### V3 — Automatización

Automatizar un subconjunto representativo de los casos de V1 y V2, en tres niveles: pruebas unitarias del cálculo de cuotas y de los resúmenes mensuales, pruebas de la API para los casos negativos y de autorización, y pruebas end-to-end de los dos flujos críticos (registrar un gasto en cuotas y verlo en el dashboard). Todo corriendo en integración continua ante cada cambio.

**Mejora funcional menor:** edición de una transacción existente. Se elige a propósito porque es la funcionalidad que más fácilmente puede romper en silencio la invariante principal (al cambiar el monto o la cantidad de cuotas hay que regenerar el reparto), y por lo tanto es el mejor objetivo posible para una suite de regresión automatizada.

## 6. Análisis de factibilidad

### Stack

| Capa | Elección | Por qué |
|---|---|---|
| Frontend | React + Next.js + TypeScript | Mobile-first; el equipo ya lo conoce |
| Backend | Python + FastAPI | API REST con documentación OpenAPI generada automáticamente; `Decimal` nativo para montos |
| Base de datos | PostgreSQL (Neon) | Restricciones reales, tipo `numeric` sin coma flotante y transacciones atómicas: la app maneja plata |
| Acceso a datos | SQLAlchemy + Alembic | Migraciones versionadas en el repositorio |
| Validación | Pydantic (servidor) + Zod (cliente) | Toda regla se valida en el servidor; el cliente solo mejora la experiencia |
| Pruebas | pytest, Testing Library, Playwright | Un solo lenguaje para dominio, API y end-to-end en V3 |
| CI | GitHub Actions | Ejecuta la suite ante cada cambio |
| Despliegue | Vercel (front) · Render (back) · Neon (base) | Los tres con plan gratuito |

### Consideraciones

- **Por qué la API va separada del frontend.** Permite diseñar y ejecutar casos de prueba por capa: la API se puede probar sin navegador y la interfaz se puede probar sin base de datos. En V3 esto es lo que hace que la automatización sea barata. Además FastAPI publica un contrato navegable en `/docs` que sirve de insumo directo para escribir casos de prueba.
- **Por qué no una base NoSQL.** La invariante central del sistema es que la suma de las cuotas sea exactamente el monto de la compra, y la escritura de una transacción con sus cuotas y su deuda tiene que ser atómica. Postgres garantiza eso con restricciones y transacciones; en una base documental habría que reimplementarlo en el código de la aplicación.
- **Cómo se comparte.** Repositorio público en GitHub desde el primer commit. La aplicación queda desplegada en una URL pública con registro abierto, así que el profesor y los otros grupos pueden crear su propia cuenta y usarla con datos propios, aislados del resto. Ningún dato financiero real entra al repositorio ni a las capturas.
- **Riesgo asumido y cómo se acota.** El riesgo principal es de alcance, no técnico: lo que se evalúa es el trabajo de calidad, no la aplicación. Por eso V1 deja afuera deudas y suscripciones a propósito, y V3 no agrega features. El criterio de corte es que ninguna versión se amplía si la anterior no tiene sus casos de prueba diseñados y ejecutados.
- **Implementación con agentes de IA.** El desarrollo se hace con agentes (vibe-coding), según la consigna. El equipo mantiene la especificación de comportamiento y los criterios de aceptación como fuente de verdad: el agente implementa contra la especificación, y las pruebas se diseñan contra la especificación, no contra el código que el agente produjo.

## 7. Equipo y organización

Cinco integrantes, con marco Scrum: un sprint por versión, reuniones de planificación y revisión, y seguimiento en un tablero.

| Rol | Responsabilidad |
|---|---|
| Product Owner | Mantiene los requerimientos y las historias de usuario con sus criterios de aceptación; prioriza el backlog |
| Test Lead | Plan de pruebas, catálogo de casos, reportes de ejecución y criterio de salida de cada versión |
| Desarrollo (2) | Conducen los agentes de IA contra la especificación; uno backend, uno frontend |
| QA / Automatización | Reporte y seguimiento de defectos; lidera la automatización de V3 |

**Los cinco diseñan casos de prueba.** Los roles ordenan la coordinación, no concentran el trabajo de testing: cada integrante es dueño de los casos de un módulo (cuotas, monedas, dashboard, suscripciones, deudas) y ejecuta los de otro, para que ningún módulo lo pruebe solo quien lo escribió.
