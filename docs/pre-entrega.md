# Biyu — Pre-Entrega (revisión)

**Testing de Aplicaciones · Proyecto Integrador**

Grupo: Valentina Giampieri, Santiago Pazos, Joaquin Nuñez, Mariana Caceres y Micaela Dopazo · Fecha: 2026-09-02

> Documento entregado; no se reescribe. Las diferencias con la spec posterior (cuotas de 1 a 12, tipo
> de cambio manual, cierre de tarjeta fuera de alcance, entre otras) están resueltas en
> [`08-trazabilidad.md`](08-trazabilidad.md).

---

## 1. Nombre tentativo

**Biyu** — control de gastos personales para el contexto argentino.

## 2. Qué problema resuelve

**Para quién.** Personas que viven en Argentina, gastan en pesos y en dólares, pagan una parte importante de sus compras en cuotas, y comparten algunos gastos con otra persona que después les reembolsa.

**Qué problema.** No es falta de plata: es falta de visibilidad. Nadie puede responder "¿en qué se me fue la plata en julio?" sin abrir cuatro resúmenes de tarjeta y hacer cuentas a mano.

**Por qué las apps existentes no alcanzan.** Casi ninguna modela bien tres cosas que definen el gasto acá:

- **Dos monedas simultáneas.** Convertir todo al dólar de hoy distorsiona el pasado: una compra de USD 100 a $1.250 costó $125.000, y eso no cambia porque hoy el dólar valga $1.400.
- **Cuotas.** Contar una compra de 12 cuotas entera en el mes de la compra hace que ese mes parezca catastrófico y los 11 siguientes parezcan baratos.
- **Gastos compartidos.** Si el reembolso que te deben no se modela, el total del mes miente.

**Qué hace la app.** Registra cada gasto en menos de diez segundos desde el celular, reparte automáticamente las cuotas entre los meses que corresponde, congela el tipo de cambio del momento, y muestra un dashboard mensual que responde la pregunta.

## 3. Requerimientos funcionales

Organizados por módulo y con un identificador (FR-xx) para poder trazarlos contra casos de prueba, como se vio en la materia. Los puntos marcados "a confirmar" son decisiones de producto que el equipo todavía tiene que cerrar antes de diseñar los casos de prueba correspondientes.

### Cuentas y sesión

- **FR-01. Registro e inicio de sesión:** alta de cuenta e inicio de sesión con email y contraseña (mínimo 8 caracteres, al menos una letra y un número), validado en cliente y en el servidor.
- **FR-02. Aislamiento de datos:** cada usuario ve y modifica únicamente sus propias categorías, medios de pago, transacciones, tarjetas y suscripciones, sin excepción.
- **FR-03. Cierre y expiración de sesión:** el usuario puede cerrar sesión manualmente; la sesión también expira sola tras un período de inactividad a definir por el equipo (sugerido: 30 días).

### Categorías y medios de pago

- **FR-04. Set inicial precargado:** al crear la cuenta se cargan automáticamente categorías por defecto (Comida y supermercado, Transporte, Servicios, Entretenimiento, Salud, Educación, Indumentaria, Otros) y los medios de pago tarjeta de crédito, débito, efectivo, cuenta y billetera virtual. La lista es ajustable por el equipo antes de V1.
- **FR-05. ABM de categorías y medios de pago:** el usuario puede crear, editar y dar de baja sus propias categorías y medios de pago. No se puede eliminar una categoría o medio de pago con transacciones asociadas; en ese caso se ofrece archivarlo en vez de borrarlo.

### Transacciones

- **FR-06. Registrar un gasto o ingreso:** monto mayor a cero, moneda (ARS o USD), categoría, medio de pago y fecha. La fecha no puede ser posterior a hoy, salvo que corresponda a una cuota o suscripción futura ya comprometida (ver FR-09 y FR-16).
- **FR-07. Editar una transacción existente:** si la transacción pertenece a un mes ya cerrado, el sistema muestra una advertencia explícita indicando qué totales se van a modificar, antes de confirmar el cambio.
- **FR-08. Eliminar una transacción (baja lógica):** la transacción deja de contarse en los totales pero permanece visible en el historial con una marca de eliminada; si pertenece a un mes cerrado, se advierte antes de confirmar.

### Cuotas

- **FR-09. Registrar una compra en cuotas:** de 2 a 24 cuotas (límite a confirmar por el equipo), en ARS o USD. El sistema reparte el monto entre los N meses siguientes y muestra el impacto mes a mes antes de guardar.
- **FR-10. Regla de redondeo:** si el monto no se divide en partes exactas entre la cantidad de cuotas, la diferencia se absorbe en la última cuota (recomendado; a confirmar con el equipo antes de V1, ya que define un caso de valor límite obligatorio para testing).
- **FR-11. Invariante de cuotas:** la suma de los montos de todas las cuotas de una compra es siempre exactamente igual al monto original de la compra. Esta invariante se valida con una restricción en la base de datos, no solo en el cliente.

### Multimoneda

- **FR-12. Cotización del dólar oficial:** al registrar un gasto en USD, el sistema obtiene la cotización del dólar oficial vigente desde una API pública externa (candidata a confirmar, por ejemplo dolarapi.com) y la congela junto con la transacción; ese valor no cambia si la cotización de referencia cambia después.
- **FR-12.1. Carga manual de respaldo:** si la API de cotización no responde, el usuario puede ingresar manualmente el tipo de cambio de esa compra para no bloquear el registro del gasto.

### Tarjetas y cierres

- **FR-13. Día de cierre por tarjeta:** cada tarjeta de crédito tiene un día de cierre configurable (1 a 31), con manejo explícito de meses cortos (por ejemplo, cierre día 31 en un mes de 30 días cae el último día del mes).
- **FR-14. Cierre automático:** al llegar el día de cierre de una tarjeta, un proceso programado congela en ARS el valor de las compras en USD pendientes de esa tarjeta, usando la cotización oficial vigente al momento del cierre (ver FR-12).

### Suscripciones

- **FR-15. Alta de suscripción:** monto, moneda, categoría, medio de pago y periodicidad mensual (otras periodicidades quedan fuera de alcance salvo que el equipo decida incorporarlas).
- **FR-16. Proyección a futuro:** una suscripción activa se refleja por adelantado en los meses futuros del dashboard sin generar una transacción real hasta que el mes correspondiente se cumple.
- **FR-17. Pausar, reactivar o cancelar:** el usuario puede pausar, reactivar o cancelar una suscripción en cualquier momento. Pausar detiene la proyección hacia adelante sin borrar el historial de cargos ya generados.

### Gastos compartidos

- **FR-18. Registrar la parte de otra persona:** al cargar un gasto compartido, el usuario indica qué monto le corresponde a la otra persona y el sistema lleva el saldo de cuánto le debe.
- **FR-19. El saldo pendiente no distorsiona el balance:** el monto pendiente de reembolso no se computa como gasto propio en el balance del mes hasta que se marca como cobrado.

### Dashboard y navegación

- **FR-20. Dashboard mensual:** muestra total gastado, total de ingresos, balance, monto de cuotas heredadas de compras anteriores, desglose por categoría, desglose por medio de pago, las últimas 10 transacciones y al menos dos gráficos (uno de torta por categoría y uno de barras con la evolución de los últimos meses).
- **FR-21. Navegación entre meses:** el usuario puede navegar a cualquier mes, pasado o futuro; los meses futuros muestran las cuotas y suscripciones ya comprometidas aunque todavía no exista una transacción real.

### Exportación (opcional)

- **FR-22. Exportar a CSV:** exportación opcional de todas las transacciones del usuario en un rango de fechas, con columnas fecha, monto original, moneda, tipo de cambio aplicado, monto en ARS, categoría, medio de pago y estado (activa o eliminada).

## 4. Requerimientos no funcionales

Organizados por atributo de calidad (mismo criterio de ISO/IEC 25010 usado en la materia), cada uno con un umbral medible: un no funcional sin número no se puede dar por cumplido ni por incumplido en una prueba.

### Rendimiento

- **NFR-01. Métricas de carga (Core Web Vitals):** medidas con Lighthouse en modo mobile con throttling, sobre un dispositivo de gama media: LCP menor a 2,5 s, INP menor a 200 ms, CLS menor a 0,1.
- **NFR-02. Dashboard bajo volumen:** el dashboard mensual renderiza en menos de 2 segundos (percentil 95, red 4G simulada) con hasta 5.000 transacciones acumuladas en la cuenta.
- **NFR-03. Tiempo de respuesta de la API:** las consultas a Supabase para el resumen mensual responden en menos de 500 ms en el percentil 95.

### Compatibilidad multiplataforma

- **NFR-04. Navegadores soportados:** funcionalidad completa en las últimas dos versiones estables de Chrome en Android, Safari en iOS, y Chrome o Edge en desktop.
- **NFR-05. Degradación aceptable en iOS Safari:** ninguna función central (registrar un gasto, ver el dashboard, editar o eliminar una transacción) puede romperse en Safari iOS por la ausencia de APIs avanzadas como Background Sync o Push antes de instalar la PWA.

### Usabilidad y accesibilidad

- **NFR-06. Nivel de accesibilidad:** los flujos críticos (login, registrar un gasto, ver el dashboard) cumplen WCAG 2.1 nivel AA: contraste mínimo 4,5 a 1, navegación completa por teclado en desktop, etiquetas ARIA en los formularios, compatibilidad con lector de pantalla (VoiceOver y TalkBack).
- **NFR-07. Velocidad de carga de un gasto:** un usuario que ya conoce la app registra un gasto en como máximo 4 pasos y en menos de 10 segundos (medido en pruebas de usabilidad, no automatizado).
- **NFR-08. Áreas táctiles:** los botones principales tienen un área táctil mínima de 44 por 44 píxeles.

### Confiabilidad y manejo de errores

- **NFR-09. Sin pérdida de datos ante falla de conexión:** si se pierde la conexión mientras se completa el formulario de un gasto, el texto ingresado no se pierde (se guarda como borrador local) aunque no se pueda confirmar el guardado hasta reconectar. No hay sincronización automática en esta versión.
- **NFR-10. Guardado idempotente:** reintentar guardar una transacción tras un error de red no genera transacciones duplicadas.
- **NFR-11. Falla de la cotización no bloquea:** un error en la API de cotización del dólar no impide registrar un gasto en pesos, y ofrece la carga manual prevista en FR-12.1 para un gasto en dólares.

### Seguridad

- **NFR-12. Tráfico cifrado:** toda la aplicación se sirve sobre HTTPS; el service worker y el manifest solo se registran en origen seguro.
- **NFR-13. Row Level Security verificada:** caso de prueba obligatorio: el usuario A no puede leer ni modificar filas del usuario B, ni siquiera manipulando la request directamente contra la API.
- **NFR-14. Credenciales:** las contraseñas nunca se almacenan ni se transmiten en texto plano (delegado a Supabase Auth); la sesión puede revocarse manualmente en cualquier momento.

### Instalabilidad y comportamiento como PWA

- **NFR-15. Manifest y auditoría PWA:** manifest válido (nombre, íconos de 192 y 512 píxeles, color de tema, modo standalone) con un puntaje Lighthouse PWA de al menos 90 en Chrome Android y desktop.
- **NFR-16. Instalación en Android e iOS:** en Android el navegador ofrece el prompt de instalación automático; en iOS, donde Safari no muestra ese prompt, la app despliega una instrucción visible de cómo instalarla manualmente (Compartir → Agregar a inicio).
- **NFR-17. Actualización sin fricción:** el service worker actualiza la versión de la app sin que el usuario tenga que desinstalar y reinstalar; se acepta un aviso del tipo "hay una versión nueva, tocá para actualizar".
- **NFR-18. Nada crítico depende del navegador:** dado que Safari iOS puede liberar el almacenamiento local de una PWA no abierta en 7 días, ningún dato importante del usuario depende exclusivamente de localStorage o IndexedDB; todo lo relevante vive en Supabase.

### Mantenibilidad y automatización (V3)

- **NFR-19. Cobertura mínima automatizada:** 80% de cobertura en las funciones de cálculo de cuotas y prorrateo (pgTAP), y 100% de los casos negativos de Row Level Security.
- **NFR-20. Duración de la suite en CI:** la suite completa de pruebas automatizadas corre en menos de 10 minutos en GitHub Actions ante cada cambio sobre la rama principal.

## 5. Roadmap

### V1 — Núcleo funcional mínimo, ya testeable

Registro y login. ABM de categorías y medios de pago. Registro de transacciones con monto, moneda, tipo, categoría, cuenta y fecha. Cuotas con prorrateo y absorción de resto. Multimoneda con tipo de cambio congelado. Dashboard mensual con totales, ingresos, balance y cuotas heredadas. Baja lógica.

**Foco de testing:** casos felices, negativos y de borde sobre el cálculo de cuotas, la conversión de moneda y las validaciones de alta.

### V2 — Evolución a MVP usable

- **Funcional:** edición de una transacción existente, con recálculo de cuotas y aviso si afecta meses ya cerrados · desglose del dashboard por categoría y por medio de pago · suscripciones (puesta al día, pausa, reactivación, cancelación) · gastos compartidos y gestión de deudas · exportación a CSV.
- **Interfaz:** estados vacíos con acción, previsualización del impacto de cuotas, retroalimentación de carga y error.
- **No funcional:** rendimiento del dashboard bajo volumen de datos (NFR-01 a NFR-03), compatibilidad entre Chrome Android, Safari iOS y Chrome/Edge desktop (NFR-04, NFR-05), accesibilidad WCAG 2.1 AA en los flujos críticos (NFR-06 a NFR-08), comportamiento ante pérdida de conexión al registrar un gasto sin sincronización automática (NFR-09, NFR-10) e instalabilidad como PWA (NFR-15 a NFR-18).

**Foco de testing:** casos nuevos, más pruebas de regresión sobre todo V1 —con foco en la edición de transacciones como principal vector para romper la invariante de cuotas— y confirmación de los defectos reportados en la etapa anterior.

### V3 — Automatización

Automatizar un subconjunto representativo de los casos de V1 y V2: pruebas unitarias del cálculo de cuotas y resúmenes mensuales, pruebas de API para casos negativos y de autorización, y pruebas end-to-end de los dos flujos críticos (registrar un gasto en cuotas y verlo en el dashboard). Todo en integración continua ante cada cambio.

## 6. Análisis de factibilidad

### Stack tentativo

| Capa | Elección | Por qué |
|---|---|---|
| Frontend | React (Vite) + PWA (Workbox) | Se sirve como sitio web instalable (Agregar a pantalla de inicio); sin pasar por App Store/Play Store ni generar builds nativas; reutiliza el conocimiento de React del equipo aplicado directo a la web |
| Backend / lógica de negocio | Supabase (Postgres + Auth + Row Level Security + Edge Functions) | Auth y aislamiento de datos por usuario (RLS) ya resueltos; API REST/GraphQL autogenerada sin mantener un servidor propio; Edge Functions (Deno/TypeScript) para el cierre de tarjetas y la proyección de suscripciones |
| Base de datos | PostgreSQL (Supabase) | Restricciones reales, tipo `numeric` sin coma flotante, transacciones atómicas, RLS nativo |
| Acceso a datos | Supabase Client SDK (con localStorage del navegador para persistir la sesión) + Supabase CLI (migraciones SQL) | Migraciones versionadas en el repositorio, igual que se buscaba con Alembic |
| Validación | Constraints/triggers en Postgres + Zod (cliente y Edge Functions) | La invariante de cuotas se valida en la base, que es el lugar más difícil de sortear; el cliente solo mejora la experiencia |
| Pruebas | pgTAP (funciones SQL) + Deno Test/Vitest (Edge Functions) + React Testing Library (componentes) + Playwright (end-to-end multi-navegador: Chromium, WebKit y Firefox) + Lighthouse CI (rendimiento, accesibilidad y PWA) | Cubre lógica en la base, lógica en Edge Functions, componentes y flujos end-to-end en los tres motores de navegador (Chromium/WebKit/Firefox) en V3 |
| CI | GitHub Actions | Ejecuta la suite ante cada cambio |
| Despliegue | Vercel o Netlify con HTTPS y CDN (front) · Supabase (backend, base de datos, autenticación) | Se comparte por URL pública, instalable como PWA desde el navegador sin pasar por una tienda de apps; un solo proveedor para todo el backend |

### Consideraciones relevantes

- **Supabase separado del frontend:** la base de datos y la autenticación se prueban contra la API REST/GraphQL que Supabase autogenera, sin depender del navegador, y la interfaz se puede probar con datos simulados sin depender de la base — la misma separación que se buscaba con una API propia, pero sin mantener un servidor.
- **Por qué no NoSQL:** la invariante central (suma de cuotas = monto de la compra) necesita restricciones y transacciones atómicas reales, que Postgres —vía Supabase— da de fábrica.
- **Por qué Supabase en vez de un backend a medida:** Auth, aislamiento de datos por usuario vía Row Level Security y una API ya generada reducen trabajo de infraestructura y aceleran el vibe-coding. La contrapartida es que la lógica más particular de la app (cierre de tarjetas, proyección de suscripciones) pasa a vivir en funciones de base de datos y Edge Functions en vez de en un framework de aplicación tradicional; eso hay que tenerlo presente al diseñar las pruebas unitarias de V3, que en este stack se escriben en SQL (pgTAP) y en Deno/TypeScript (Edge Functions) en vez de en Python. Una RLS mal configurada es además una fuente de bugs real y muy testeable: "el usuario A no debería poder leer ni modificar transacciones del usuario B" pasa a ser un caso de prueba negativo concreto.
- **Cómo se resuelven el cierre de tarjetas y las suscripciones:** para no saturar la base de datos, el cierre de tarjeta se resuelve con una función programada (pg_cron o un Scheduled Edge Function de Supabase) que, al llegar el día de cierre de cada tarjeta, congela en ARS las compras en USD pendientes de esa tarjeta; las suscripciones no generan filas de gastos futuros por adelantado, sino que se proyectan "al vuelo" en el dashboard a partir de una tabla de plantillas, y solo se convierten en una transacción real al vencer el mes correspondiente.
- **Por qué React web (PWA) en vez de una app nativa:** se prioriza mobile-first pero como sitio web instalable: un solo código sirve para celular, tablet y desktop, se actualiza al instante sin esperar aprobación de tienda, y cualquiera la abre desde un link sin instalar nada. La contrapartida es la fragmentación entre navegadores: Safari en iOS no tiene Background Sync, puede liberar el almacenamiento local de una PWA no usada en 7 días, y solo habilita notificaciones push si la app ya fue agregada a la pantalla de inicio. Por eso el soporte offline se deja fuera de alcance por ahora (ver NFR-09 y NFR-10) en vez de prometer algo que Safari no puede sostener.
- **Cómo se comparte:** repositorio público en GitHub y app publicada en una URL pública (Vercel o Netlify), instalable como PWA directo desde el navegador; contra un proyecto de Supabase con registro abierto. El profesor y otros grupos entran desde el link sin instalar nada adicional, y pueden agregarla a la pantalla de inicio si quieren usarla como una app, cada uno con su propia cuenta y datos aislados por RLS.
- **Riesgo asumido:** es de alcance, no técnico. V1 deja afuera deudas y suscripciones a propósito, y V3 no agrega features: ninguna versión se amplía si la anterior no tiene sus pruebas diseñadas y ejecutadas.
- **Implementación con agentes de IA:** el desarrollo se hace con vibe-coding según la consigna; el equipo mantiene la especificación de comportamiento como fuente de verdad, y las pruebas se diseñan contra esa especificación, no contra el código generado.

## 7. Por qué esta app es interesante para testear

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

## 8. Equipo y organización

Cinco integrantes, con marco Scrum: un sprint por versión, reuniones de planificación y revisión, y seguimiento en un tablero.

| Rol | Responsabilidad |
|---|---|
| Product Owner | Mantiene los requerimientos y las historias de usuario con sus criterios de aceptación; prioriza el backlog |
| Test Lead | Plan de pruebas, catálogo de casos, reportes de ejecución y criterio de salida de cada versión |
| Desarrollo (2) | Conducen los agentes de IA contra la especificación; uno backend/base de datos, uno frontend |
| QA / Automatización | Reporte y seguimiento de defectos; lidera la automatización de V3 |

**Los cinco diseñan casos de prueba.** Los roles ordenan la coordinación, no concentran el trabajo de testing: cada integrante es dueño de los casos de un módulo (cuotas, monedas, dashboard, suscripciones, deudas) y ejecuta los de otro, para que ningún módulo lo pruebe solo quien lo escribió.
