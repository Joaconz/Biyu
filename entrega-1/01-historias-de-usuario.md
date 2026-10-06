# Proyecto Biyu – Entrega 1 · Historias de Usuario (V1)

**Testing de Aplicaciones · Proyecto Integrador** · Grupo: Valentina Giampieri, Santiago Pazos,
Joaquin Nuñez, Mariana Caceres y Micaela Dopazo · Versión del documento: 2026-09-28

## Sobre el proyecto

Biyu es una aplicación web (React + Supabase) de control de gastos personales para Argentina:
registra gastos e ingresos en pesos y en dólares, reparte las compras en cuotas entre los meses
que corresponden y muestra un resumen mensual que responde "¿en qué se me fue la plata este mes?".
Se desarrolla en tres versiones incrementales (V1, V2, V3) para simular un proyecto real.

En esta primera entrega el equipo implementó, con agentes de IA, el **núcleo funcional mínimo**:
acceso con cuenta propia, configuración de categorías, cuentas y tipo de cambio, registro de
transacciones (con cuotas y dólares), resumen mensual y baja lógica.

App: <https://biyu-rust.vercel.app> · Repositorio: <https://github.com/Joaconz/Biyu> · Tablero:
[Project Biyu](https://github.com/users/Joaconz/projects/3), milestone V1.

## Cómo leer este documento

- Cada historia tiene el ID `US-nn` del repositorio (`docs/02-behavior-spec.md`) y su issue de
  GitHub. Los IDs no son correlativos porque las historias de V2 (deudas y suscripciones: US-30,
  US-34 a US-41, US-47, US-52 a US-63) quedaron fuera de esta versión.
- **Criterios de aceptación**: copiados de cada issue y numerados (`CA-1`, `CA-2`…) para que cada caso de prueba cite el criterio que verifica (`US-12 · CA-2`). Donde el rediseño de la UI (ADR-023, ADR-024)
  cambió la forma de la pantalla, se aclara en "Pantallas y campos"; el criterio no se reescribe.
- **Casos de prueba**: IDs de `02-especificacion-casos-de-prueba`. El resultado de cada uno está en
  `03-ejecucion-casos-de-prueba`.
- **Estado en V1**: 46 historias de V1, las 46 implementadas y cerradas. US-68 fue la última: en la
  ejecución 1 no estaba implementada (DEF-017); se implementó en #173 y sus 5 casos pasan en la
  ejecución 2 (ver `05-reporte-de-ejecucion`).

## Resumen de las historias de usuario

| Épica | Historias | Qué permite |
|---|---|---|
| Acceso (#9) | US-48, US-49, US-50, US-51, US-64, US-66, US-67 | Crear cuenta con una contraseña segura y confirmada, entrar directo, mantener la sesión, cerrarla, y que nadie vea datos de otro |
| Configuración mínima (#10) | US-42, US-43, US-44, US-45, US-46, US-68 | Arrancar con categorías y cuentas precargadas, crear y archivar categorías, crear cuentas con su tipo y cargar el tipo de cambio de cada mes |
| Registro de transacciones (#11) | US-01 a US-11 | Registrar un gasto o ingreso en tres toques: monto, categoría y detalles, con valores precargados y validaciones |
| Cuotas (#12) | US-12 a US-18 | Repartir una compra con tarjeta de crédito en 1 a 12 cuotas sin perder centavos y verla mes a mes |
| Monedas (#13) | US-19 a US-24 | Registrar en dólares con el tipo de cambio congelado y ver todo en un total en pesos |
| Resumen mensual (#14) | US-25 a US-29, US-31 a US-33 | Ver cuánto se gastó en el mes, por categoría y por cuenta, ingresos, balance y últimos movimientos |
| Baja lógica (#15) | US-65 | Eliminar una transacción sin perder el historial, con aviso si cambia meses cerrados |

---

## Historias de usuario

### Épica: Acceso

#### US-48: La app pide login · [#61](https://github.com/Joaconz/Biyu/issues/61) · Implementada

- **Objetivo:** Como usuario, quiero que la app pida login, para que mis finanzas no queden
  expuestas en una URL pública.
- **Pantallas y campos:**
  - Pantalla **Entrar** (`/login`): campo "Email", campo "Contraseña" (enmascarado), botón
    "Entrar", enlace "Crear una cuenta".
  - Cualquier ruta privada (`/register`, `/dashboard`, `/transactions`, `/settings`) sin sesión
    redirige a `/login?next=<ruta>`.
- **Criterios de aceptación:**
  - CA-1: Toda ruta salvo `/login` y `/signup` exige sesión.
  - CA-2: Otro usuario y el rol `anon` ven 0 filas en cada tabla (par pgTAP de C7).
- **Trazabilidad:** FR-02 · C7 · NFR-13
- **Casos de prueba:** CP-ACC-001, CP-ACC-002, CP-ACC-006, CP-ACC-011, CP-REG-014, CP-CUO-011,
  CP-MON-007, CP-DAS-011

#### US-49: Sesión persistente en el celular · [#62](https://github.com/Joaconz/Biyu/issues/62) · Implementada

- **Objetivo:** Como usuario, quiero seguir logueado entre sesiones en mi celular, para no
  autenticarme cada vez que registro un gasto.
- **Pantallas y campos:** no agrega pantallas; la sesión se guarda en el almacenamiento del navegador.
- **Criterios de aceptación:**
  - CA-1: Cerrar y reabrir el navegador mantiene la sesión.
  - CA-2: La sesión expira tras el período de inactividad definido (FR-03 sugiere 30 días).
- **Trazabilidad:** FR-03
- **Casos de prueba:** CP-ACC-010

#### US-50: Crear cuenta con email y contraseña · [#63](https://github.com/Joaconz/Biyu/issues/63) · Implementada

- **Objetivo:** Como usuario nuevo, quiero crear mi cuenta con email y contraseña en `/signup`,
  para empezar a usar la app sin que nadie me la habilite a mano.
- **Pantallas y campos:**
  - Pantalla **Crear cuenta** (`/signup`): "Email", "Contraseña" (enmascarada), lista de criterios
    de contraseña, "Confirmar contraseña" (enmascarada), botón "Crear cuenta", enlace "Ya tengo
    cuenta".
- **Criterios de aceptación:**
  - CA-1: Alta en `/signup` con email y contraseña de mínimo 8 caracteres, al menos una letra y un número,
    validado en cliente y en Supabase Auth. *(US-67 amplió después los criterios.)*
  - CA-2: Email duplicado da un error claro.
- **Trazabilidad:** FR-01 · ADR-011
- **Casos de prueba:** CP-ACC-003, CP-ACC-004, CP-ACC-005, CP-ACC-006

#### US-51: Entrar directo tras registrarse · [#64](https://github.com/Joaconz/Biyu/issues/64) · Implementada

- **Objetivo:** Como usuario nuevo, quiero entrar directo después de registrarme, sin un paso
  intermedio de confirmación por email, para no perder el momento en que decidí usar la app.
- **Pantallas y campos:** después de "Crear cuenta" se abre **Registrar** (`/register`). Si el
  servidor exigiera confirmar el email, se muestra "Te creamos la cuenta, pero hace falta confirmar
  el email antes de entrar".
- **Criterios de aceptación:**
  - CA-1: Sin confirmación por email: después del alta el usuario queda logueado en `/register`.
- **Trazabilidad:** FR-01 · ADR-011
- **Casos de prueba:** CP-ACC-003, CP-ACC-007, CP-ACC-008

#### US-64: Cerrar sesión · [#65](https://github.com/Joaconz/Biyu/issues/65) · Implementada

- **Objetivo:** Como usuario, quiero cerrar sesión desde la app, para que nadie más use mi cuenta
  en un dispositivo compartido.
- **Pantallas y campos:**
  - Botón de engranaje (**Ajustes**) en el encabezado de todas las pantallas privadas.
  - En **Ajustes**, al final: botón "Cerrar sesión" (ADR-023).
- **Criterios de aceptación:**
  - CA-1: Hay una acción visible para cerrar sesión.
  - CA-2: Después de cerrarla, volver atrás en el navegador no muestra datos.
- **Trazabilidad:** FR-03
- **Casos de prueba:** CP-ACC-009

#### US-66: Confirmar contraseña al registrarse · [#131](https://github.com/Joaconz/Biyu/issues/131) · Implementada

- **Objetivo:** Como usuario nuevo, quiero confirmar mi contraseña al registrarme escribiéndola dos
  veces, para no crear la cuenta con una contraseña mal tipeada que después no puedo reproducir.
- **Pantallas y campos:** campo "Confirmar contraseña" en `/signup`, con máscara.
- **Criterios de aceptación:**
  - CA-1: El formulario de `/signup` tiene un segundo campo "Confirmar contraseña", con máscara igual que
    el campo de contraseña.
  - CA-2: Si "Contraseña" y "Confirmar contraseña" no coinciden, el envío se bloquea con el mensaje "Las
    contraseñas no son iguales".
  - CA-3: Si coinciden y cumplen los criterios de US-67, el registro sigue el flujo normal (US-50).
  - CA-4: Esta validación es de cliente únicamente.
- **Trazabilidad:** FR-01. Se agregó al contrastar contra el ejemplo de la cátedra (TaskMaster TM-1).
- **Casos de prueba:** CP-ACC-003, CP-ACC-012

#### US-67: Mensaje claro de qué criterio de contraseña falta · [#132](https://github.com/Joaconz/Biyu/issues/132) · Implementada

- **Objetivo:** Como usuario nuevo, quiero que la app me diga con claridad qué le falta a mi
  contraseña (mayúscula, minúscula, número, carácter especial, largo mínimo) cuando no cumple los
  criterios, para poder corregirla sin adivinar.
- **Pantallas y campos:** en `/signup`, debajo de "Contraseña", la lista de criterios: "Al menos 8
  caracteres", "Al menos una mayúscula", "Al menos una minúscula", "Al menos un número", "Al menos un
  carácter especial (!@#$%^&*...)". Cada uno se marca con ✓ al cumplirse.
- **Criterios de aceptación:**
  - CA-1: `/signup` valida en cliente: mínimo 8 caracteres, al menos una mayúscula, una minúscula, un número
    y un carácter especial.
  - CA-2: Los criterios se muestran en pantalla antes de que el usuario escriba, no solo como error posterior.
  - CA-3: Si no se cumple alguno, el mensaje indica específicamente cuál falta.
  - CA-4: El servidor (Supabase Auth) rechaza igual una contraseña que no cumpla (C6).
- **Trazabilidad:** FR-01
- **Casos de prueba:** CP-ACC-004

### Épica: Configuración mínima

#### US-42: Crear, renombrar y elegir color de categorías · [#56](https://github.com/Joaconz/Biyu/issues/56) · Implementada

- **Objetivo:** Como usuario, quiero crear, renombrar y elegir color de mis categorías, para que
  reflejen cómo pienso mis gastos.
- **Pantallas y campos:**
  - **Ajustes → Categorías**: lista de categorías activas, cada una con botones "Editar" (lápiz) y
    "Archivar".
  - Formulario "Nueva categoría": campo de nombre, paleta de colores, botón "Crear categoría".
  - Edición en línea: campo de nombre, paleta, botones "Cancelar" y "Guardar".
- **Criterios de aceptación:**
  - CA-1: ABM de categorías propias con nombre y color.
  - CA-2: El par de autorización RLS de `categories` (otra sesión y `anon` → 0 filas).
- **Trazabilidad:** FR-05
- **Casos de prueba:** CP-CFG-001, CP-CFG-002, CP-CFG-003, CP-CFG-005

#### US-43: Set inicial de categorías y cuentas · [#57](https://github.com/Joaconz/Biyu/issues/57) · Implementada

- **Objetivo:** Como usuario, quiero que la app venga con un set de categorías inicial, para no
  arrancar con una pantalla vacía.
- **Pantallas y campos:** no agrega pantallas. Al crear la cuenta se cargan 8 categorías (Comida y
  supermercado, Transporte, Servicios, Entretenimiento, Salud, Educación, Indumentaria, Otros) y 5
  cuentas (Tarjeta de crédito, Tarjeta de débito, Efectivo, Cuenta bancaria, Billetera virtual).
- **Criterios de aceptación:**
  - CA-1: Un usuario nuevo tiene las categorías y cuentas por defecto al primer login.
  - CA-2: La siembra es por usuario y no se repite si ya existe (ADR-014).
- **Trazabilidad:** FR-04 · ADR-014
- **Casos de prueba:** CP-ACC-008, CP-CFG-008

#### US-44: Archivar una categoría sin perder historia · [#58](https://github.com/Joaconz/Biyu/issues/58) · Implementada

- **Objetivo:** Como usuario, quiero archivar una categoría que ya no uso sin perder las
  transacciones históricas que la usaban, para limpiar el formulario sin romper el pasado.
- **Pantallas y campos:** botón "Archivar" en cada categoría de **Ajustes**. No existe "Borrar".
- **Criterios de aceptación:**
  - CA-1: Archivar la saca del formulario; las transacciones históricas la siguen mostrando con marca de
    archivada.
  - CA-2: No se puede borrar una categoría con transacciones: se ofrece archivar (FR-05).
- **Trazabilidad:** FR-05
- **Casos de prueba:** CP-CFG-004, CP-CFG-005, CP-REG-005

#### US-45: Crear cuentas indicando su tipo · [#59](https://github.com/Joaconz/Biyu/issues/59) · Implementada

- **Objetivo:** Como usuario, quiero crear mis cuentas indicando su tipo, para que la app sepa
  cuáles admiten cuotas.
- **Pantallas y campos:** **Ajustes → Cuentas**: lista de cuentas (nombre y tipo) y formulario
  "Nueva cuenta" con nombre, "Tipo" (Tarjeta de crédito, Tarjeta de débito, Efectivo, Cuenta
  bancaria, Billetera virtual), "Moneda" (ARS o USD) y botón "Crear cuenta".
- **Criterios de aceptación:**
  - CA-1: ABM de cuentas con tipo (`credit_card`, débito, efectivo, etc.).
  - CA-2: El tipo determina si admite cuotas (I6).
- **Trazabilidad:** FR-05 · I6
- **Casos de prueba:** CP-CFG-006, CP-CFG-007

#### US-46: Cargar el TC de referencia de cada mes · [#60](https://github.com/Joaconz/Biyu/issues/60) · Implementada

- **Objetivo:** Como usuario, quiero cargar el tipo de cambio de referencia de cada mes, para que
  el registro en USD sea rápido.
- **Pantallas y campos:** **Ajustes → Tipo de cambio de referencia**: lista de meses cargados y
  formulario con "Mes", "ARS por USD" y botón "Guardar tipo de cambio".
- **Criterios de aceptación:**
  - CA-1: Se puede cargar y cambiar el TC de referencia de un período.
  - CA-2: Cambiarlo no altera transacciones ya guardadas (C5).
- **Trazabilidad:** FR-12
- **Casos de prueba:** CP-CFG-009, CP-CFG-010

#### US-68: Configuración inicial al crear la cuenta · [#159](https://github.com/Joaconz/Biyu/issues/159) · Implementada

- **Objetivo:** Como usuario nuevo, quiero una configuración inicial breve al crear mi cuenta, para
  dejar las categorías y los medios de pago como los uso y registrar mi primer gasto sabiendo cómo
  funciona la app.
- **Pantallas y campos:** pantalla **Configuración inicial** (`/setup`), que aparece una sola vez
  después de crear la cuenta, con cuatro pasos que se pueden saltear: (1) para qué la usás, (2)
  categorías, con la opción de destildar, (3) cuentas y cuenta predeterminada, (4) primer gasto
  guiado. Se vuelve a abrir desde Ajustes. Renombrar o sumar categorías, que el issue también
  planteaba, se hace desde Ajustes (US-42). Elementos con `data-testid` de prefijo `setup-` (ADR-025).
- **Criterios de aceptación:**
  - CA-1: Después de crear la cuenta se muestra el setup, y no vuelve a aparecer una vez que se completó o
    se salteó.
  - CA-2: Cada paso tiene "Saltear". Salteando todo, el usuario queda con la siembra de US-43.
  - CA-3: Destildar una categoría o una cuenta la archiva (C10): no se borra nada.
  - CA-4: La cuenta elegida como predeterminada viene preseleccionada en el primer registro (US-07).
  - CA-5: El primer gasto se guarda con `create_transaction` (C4).
  - CA-6: Se puede volver a abrir el setup desde Ajustes.
  - CA-7: La respuesta de "para qué la usás" no bloquea ni limita nada.
  - CA-8: Todo elemento interactivo nuevo lleva `data-testid` con el prefijo `setup-`.
- **Trazabilidad:** FR-04 · FR-05 · FR-06
- **Casos de prueba:** CP-CFG-011 a CP-CFG-015 (casos nuevos de esta entrega)

### Épica: Registro de transacciones

El registro se hace en pasos (ADR-024): **¿Cuánto?** (tipo, monto, moneda y tipo de cambio) →
**¿En qué?** (grilla de categorías; los ingresos se lo saltean) → **Revisá y guardá** (cuenta,
cuotas, fecha, nota y botón "Guardar gasto"/"Guardar ingreso"). Arriba hay una barra de progreso
("1/3") y el botón "Paso anterior".

#### US-01: El registro es la pantalla de inicio · [#24](https://github.com/Joaconz/Biyu/issues/24) · Implementada

- **Objetivo:** Como usuario, quiero que el formulario de registro sea lo primero que veo al abrir
  la app, para no navegar antes de cargar un gasto.
- **Pantallas y campos:** `/` redirige a **Registrar** (`/register`). Barra inferior con Registrar,
  Resumen y Movimientos.
- **Criterios de aceptación:**
  - CA-1: Un usuario autenticado que abre la app cae en `/register`.
  - CA-2: Sin sesión, redirige a login y, después de loguearse, vuelve a `/register`.
- **Trazabilidad:** FR-06
- **Casos de prueba:** CP-REG-001, CP-ACC-001

#### US-02: El monto recibe el foco y abre el teclado numérico · [#25](https://github.com/Joaconz/Biyu/issues/25) · Implementada

- **Objetivo:** Como usuario, quiero que el campo de monto reciba el foco automáticamente y abra el
  teclado numérico, para empezar a tipear sin tocar nada.
- **Pantallas y campos:** paso **¿Cuánto?**: monto grande y centrado.
- **Criterios de aceptación:**
  - CA-1: Al cargar `/register` el foco está en el monto.
  - CA-2: El input usa `inputmode="decimal"` (teclado numérico en el celular).
- **Trazabilidad:** FR-06 · NFR-07
- **Casos de prueba:** CP-REG-016

#### US-03: La fecha viene precargada con hoy · [#26](https://github.com/Joaconz/Biyu/issues/26) · Implementada

- **Objetivo:** Como usuario, quiero que la fecha venga precargada con hoy, para no tocarla en el 95%
  de los casos.
- **Pantallas y campos:** paso **Revisá y guardá**: atajos "Hoy", "Ayer" y "Otra", y el campo de fecha.
- **Criterios de aceptación:**
  - CA-1: La fecha por defecto es la de hoy en la zona horaria del usuario.
  - CA-2: `today` entra como parámetro al dominio; ningún módulo de `src/domain/` lee el reloj (C1).
- **Trazabilidad:** FR-06 · C1
- **Casos de prueba:** CP-REG-002

#### US-04: El tipo viene precargado en gasto · [#27](https://github.com/Joaconz/Biyu/issues/27) · Implementada

- **Objetivo:** Como usuario, quiero que el tipo venga precargado en "gasto", porque registro muchos
  más gastos que ingresos.
- **Pantallas y campos:** selector "Gasto | Ingreso" en el paso **¿Cuánto?**.
- **Criterios de aceptación:**
  - CA-1: El tipo por defecto es `expense`.
- **Trazabilidad:** FR-06
- **Casos de prueba:** CP-REG-003

#### US-05: La moneda viene precargada en ARS · [#28](https://github.com/Joaconz/Biyu/issues/28) · Implementada

- **Objetivo:** Como usuario, quiero que la moneda venga precargada en ARS, porque es la moneda de la
  mayoría de mis gastos.
- **Pantallas y campos:** selector "ARS | US$" debajo del monto.
- **Criterios de aceptación:**
  - CA-1: La moneda por defecto es ARS y no se muestra campo de tipo de cambio.
- **Trazabilidad:** FR-06
- **Casos de prueba:** CP-REG-003

#### US-06: Categoría por chips en una grilla visible · [#29](https://github.com/Joaconz/Biyu/issues/29) · Implementada

- **Objetivo:** Como usuario, quiero elegir la categoría tocando un chip en una grilla visible, en
  vez de abrir un `select` y scrollear.
- **Pantallas y campos:** paso **¿En qué?**: grilla de 4 columnas con ícono y nombre. Tocar un chip
  avanza solo al paso siguiente.
- **Criterios de aceptación:**
  - CA-1: Las categorías activas se muestran como chips, sin `select`.
  - CA-2: Un gasto sin categoría no se puede guardar, ni por la UI ni directo contra la RPC (I8).
  - CA-3: Las categorías archivadas no aparecen.
- **Trazabilidad:** FR-06 · I8
- **Casos de prueba:** CP-REG-004, CP-REG-005

#### US-07: La cuenta viene precargada con la última usada · [#30](https://github.com/Joaconz/Biyu/issues/30) · Implementada

- **Objetivo:** Como usuario, quiero que la cuenta venga precargada con la que usé la última vez,
  para ahorrar un tap en el caso frecuente.
- **Pantallas y campos:** paso **Revisá y guardá**: chips de cuenta en dos columnas.
- **Criterios de aceptación:**
  - CA-1: Después de guardar, la cuenta queda seleccionada para la próxima carga.
  - CA-2: Si la última cuenta usada ya no existe o está archivada, no se preselecciona ninguna.
- **Trazabilidad:** FR-06
- **Casos de prueba:** CP-REG-006, CP-REG-009

#### US-08: Guardar sin descripción · [#31](https://github.com/Joaconz/Biyu/issues/31) · Implementada

- **Objetivo:** Como usuario, quiero poder guardar un gasto sin escribir descripción, porque la
  categoría suele alcanzar.
- **Pantallas y campos:** campo "Nota (opcional)".
- **Criterios de aceptación:**
  - CA-1: La descripción es opcional en la UI y en la RPC.
- **Trazabilidad:** FR-06
- **Casos de prueba:** CP-REG-007

#### US-09: Registrar un gasto con fecha pasada · [#32](https://github.com/Joaconz/Biyu/issues/32) · Implementada

- **Objetivo:** Como usuario, quiero registrar un gasto con fecha pasada, para cargar algo que me
  olvidé ayer.
- **Pantallas y campos:** atajo "Ayer" y el campo de fecha (máximo: hoy).
- **Criterios de aceptación:**
  - CA-1: Se puede elegir una fecha anterior a hoy y la transacción imputa a ese período.
  - CA-2: Una fecha posterior a hoy se rechaza en cliente y en servidor (FR-06).
- **Trazabilidad:** FR-06
- **Casos de prueba:** CP-REG-008

#### US-10: Confirmación breve y formulario vacío tras guardar · [#33](https://github.com/Joaconz/Biyu/issues/33) · Implementada

- **Objetivo:** Como usuario, quiero ver una confirmación breve al guardar y volver al formulario
  vacío, para poder cargar dos gastos seguidos.
- **Pantallas y campos:** aviso "Gasto guardado", el botón pasa a "✓ Guardado" y el formulario
  vuelve al paso **¿Cuánto?**.
- **Criterios de aceptación:**
  - CA-1: Al guardar se muestra una confirmación breve.
  - CA-2: El formulario vuelve al estado inicial conservando la última cuenta usada.
- **Trazabilidad:** FR-06
- **Casos de prueba:** CP-REG-009

#### US-11: No se puede guardar monto cero o negativo · [#34](https://github.com/Joaconz/Biyu/issues/34) · Implementada

- **Objetivo:** Como usuario, quiero que el formulario no me deje guardar un monto de cero o
  negativo, para no ensuciar los datos.
- **Pantallas y campos:** debajo del monto, el motivo del error; junto al botón, "Completá monto para
  seguir".
- **Criterios de aceptación:**
  - CA-1: Con monto vacío, 0 o negativo el botón queda deshabilitado y el campo dice por qué.
  - CA-2: La RPC rechaza `amount <= 0` aunque el cliente lo deje pasar (I4, C6).
  - CA-3: No se emite ninguna escritura.
- **Trazabilidad:** FR-06 · I4 · C6
- **Casos de prueba:** CP-REG-010, CP-REG-011, CP-REG-015

### Épica: Cuotas

#### US-12: Indicar cantidad de cuotas con tarjeta de crédito · [#35](https://github.com/Joaconz/Biyu/issues/35) · Implementada

- **Objetivo:** Como usuario, quiero indicar la cantidad de cuotas al registrar una compra con
  tarjeta de crédito, para que se reparta sola entre los meses.
- **Pantallas y campos:** sección "Cuotas": grilla de 12 botones (1 a 12).
- **Criterios de aceptación:**
  - CA-1: Se pueden elegir de 1 a 12 cuotas (valores límite del plan de testing: 0, 1, 2, 12, 13).
  - CA-2: Una transacción en N cuotas genera N imputaciones numeradas de 1 a N, en períodos consecutivos
    desde el de la fecha (I2, I3).
  - CA-3: Transacción e imputaciones se crean en una sola llamada a `create_transaction` (C4).
- **Trazabilidad:** FR-09 · I2 · I3
- **Casos de prueba:** CP-CUO-001, CP-CUO-006, CP-CUO-012

#### US-13: Previsualizar impacto mensual antes de guardar · [#36](https://github.com/Joaconz/Biyu/issues/36) · Implementada

- **Objetivo:** Como usuario, quiero ver, antes de guardar, cuánto va a impactar por mes y hasta qué
  mes llega, para confirmar que entendí bien la compra.
- **Pantallas y campos:** debajo de las cuotas, un recuadro "12 cuotas de $10.000,00 · de ago 2026 a
  jul 2027" y, si hay resto, "La última es de $…".
- **Criterios de aceptación:**
  - CA-1: La UI muestra "N cuotas de $X — de AAAA-MM a AAAA-MM" antes de guardar.
  - CA-2: La previsualización usa `generateLedgerEntries` del dominio, la misma regla que la RPC.
- **Trazabilidad:** FR-09
- **Casos de prueba:** CP-CUO-002

#### US-14: El selector de cuotas solo aparece con tarjeta de crédito · [#37](https://github.com/Joaconz/Biyu/issues/37) · Implementada

- **Objetivo:** Como usuario, quiero que el selector de cuotas solo aparezca si elegí una tarjeta de
  crédito, para que el formulario no tenga campos irrelevantes.
- **Pantallas y campos:** la sección "Cuotas" aparece solo con un gasto y una cuenta de crédito. Al
  cambiar de cuenta, aviso "Las cuotas volvieron a 1".
- **Criterios de aceptación:**
  - CA-1: El selector aparece solo si la cuenta es `credit_card` y el tipo es gasto.
  - CA-2: Si había cuotas elegidas y se cambia a otra cuenta, vuelve a 1 con un aviso.
  - CA-3: La RPC rechaza `installments_count > 1` sobre cuenta no crediticia o sobre un ingreso (I6).
- **Trazabilidad:** I6
- **Casos de prueba:** CP-CUO-003, CP-CUO-012

#### US-15: El reparto de cuotas no pierde ni inventa centavos · [#38](https://github.com/Joaconz/Biyu/issues/38) · Implementada

- **Objetivo:** Como usuario, quiero que el reparto de cuotas nunca pierda ni invente centavos, para
  que la suma de las cuotas sea exactamente lo que gasté.
- **Pantallas y campos:** no agrega pantallas; es una regla de cálculo en la base.
- **Criterios de aceptación:**
  - CA-1: $100.000 en 3 cuotas = 33.333,33 + 33.333,33 + 33.333,34.
  - CA-2: La suma de `amount` y de `amount_ars` de las imputaciones es exactamente el total (I1, I1').
  - CA-3: La última cuota absorbe el resto, en las dos series por separado.
- **Trazabilidad:** FR-10 · FR-11 · I1 · I1' · C3 · ADR-013
- **Casos de prueba:** CP-CUO-004, CP-CUO-005, CP-CUO-006, CP-CUO-010, CP-CUO-013

#### US-16: Ver cuotas de meses anteriores en el dashboard · [#39](https://github.com/Joaconz/Biyu/issues/39) · Implementada

- **Objetivo:** Como usuario, quiero ver en el dashboard de un mes cuánto de ese total es "cuotas de
  meses anteriores", para entender qué parte del mes ya estaba comprometida antes de empezarlo.
- **Pantallas y campos:** **Resumen**, tarjeta principal: "Cuotas de meses anteriores $…".
- **Criterios de aceptación:**
  - CA-1: El dashboard de un período muestra cuánto del total viene de cuotas iniciadas antes.
  - CA-2: Escenario BDD "el dashboard separa cuotas heredadas" de la spec.
- **Trazabilidad:** FR-20
- **Casos de prueba:** CP-CUO-007

#### US-17: Ver número de cuota en el listado (3/12) · [#40](https://github.com/Joaconz/Biyu/issues/40) · Implementada

- **Objetivo:** Como usuario, quiero ver qué cuota de cuántas es cada imputación en el listado (ej.
  "3/12"), para reconocerla.
- **Pantallas y campos:** **Movimientos** y "Últimos movimientos": etiqueta "n/N" junto al título.
- **Criterios de aceptación:**
  - CA-1: Cada imputación en cuotas se muestra como "n/N" en el listado del mes.
- **Trazabilidad:** FR-20
- **Casos de prueba:** CP-CUO-008

#### US-18: Borrar una compra en cuotas saca todas sus cuotas · [#41](https://github.com/Joaconz/Biyu/issues/41) · Implementada

- **Objetivo:** Como usuario, quiero que borrar una compra en cuotas borre todas sus cuotas futuras,
  para no quedarme con imputaciones huérfanas.
- **Pantallas y campos:** el botón de papelera de cualquier cuota elimina la compra entera.
- **Criterios de aceptación:**
  - CA-1: Al borrar la transacción, ninguna de sus imputaciones cuenta en ningún período, pasadas ni
    futuras (I10).
  - CA-2: Escenario BDD "borrado lógico saca las imputaciones del cálculo".
- **Trazabilidad:** FR-08 · I10
- **Casos de prueba:** CP-CUO-009, CP-REG-013

### Épica: Monedas

#### US-19: Registrar un gasto en USD sin convertir a mano · [#42](https://github.com/Joaconz/Biyu/issues/42) · Implementada

- **Objetivo:** Como usuario, quiero registrar un gasto en USD sin convertirlo a mano, para no hacer
  cuentas.
- **Pantallas y campos:** con "US$" elegido aparece el recuadro "Tipo de cambio (ARS por US$)" con el
  equivalente en pesos ("≈ $125.000,00").
- **Criterios de aceptación:**
  - CA-1: Con moneda USD, el sistema calcula `amount_ars` con el tipo de cambio de la transacción.
  - CA-2: `fx_rate` es obligatorio en USD y prohibido en ARS (I5): las 6 filas de la tabla de decisión.
- **Trazabilidad:** FR-12 · I5
- **Casos de prueba:** CP-MON-001, CP-MON-002

#### US-20: Sugerir el tipo de cambio de referencia del mes · [#43](https://github.com/Joaconz/Biyu/issues/43) · Implementada

- **Objetivo:** Como usuario, quiero que la app me sugiera el tipo de cambio del mes que ya
  configuré, para no tipearlo cada vez.
- **Pantallas y campos:** el campo de tipo de cambio viene precargado; si el mes no tiene
  referencia, aviso "No tenés un tipo de cambio configurado para este mes" y enlace "Ir a Ajustes".
- **Criterios de aceptación:**
  - CA-1: Si el período tiene TC de referencia, el formulario lo precarga.
  - CA-2: Si no tiene, el campo queda vacío y obligatorio, con un enlace a configuración.
- **Trazabilidad:** FR-12
- **Casos de prueba:** CP-MON-003, CP-MON-002

#### US-21: Pisar el tipo de cambio sugerido en una transacción · [#44](https://github.com/Joaconz/Biyu/issues/44) · Implementada

- **Objetivo:** Como usuario, quiero poder pisar ese tipo de cambio sugerido en una transacción
  puntual, para reflejar una operación a un valor distinto.
- **Pantallas y campos:** al editar el campo aparece "Estás usando un valor distinto al de
  referencia. Se aplica solo a esta transacción."
- **Criterios de aceptación:**
  - CA-1: El TC ingresado a mano pisa al de referencia solo para esa transacción.
- **Trazabilidad:** FR-12
- **Casos de prueba:** CP-MON-003

#### US-22: Cambiar el TC de referencia no altera meses cargados · [#45](https://github.com/Joaconz/Biyu/issues/45) · Implementada

- **Objetivo:** Como usuario, quiero que cambiar el tipo de cambio de referencia no altere los
  totales de meses ya cargados, para que el historial sea estable.
- **Pantallas y campos:** nota al pie en Ajustes: "Cambiar la referencia no modifica las
  transacciones que ya guardaste."
- **Criterios de aceptación:**
  - CA-1: 100 USD a 1250 siguen siendo $125.000 aunque la referencia pase a 1400.
- **Trazabilidad:** C5 · ADR-002
- **Casos de prueba:** CP-MON-004

#### US-23: Total del mes en ARS incluye USD convertido · [#46](https://github.com/Joaconz/Biyu/issues/46) · Implementada

- **Objetivo:** Como usuario, quiero ver el total del mes en ARS incluyendo los gastos en USD
  convertidos, para tener un único número comparable.
- **Pantallas y campos:** **Resumen**: "Gastado en <mes>".
- **Criterios de aceptación:**
  - CA-1: El total del período suma `amount_ars` de las imputaciones, con el TC congelado.
- **Trazabilidad:** FR-20 · I1'
- **Casos de prueba:** CP-MON-005

#### US-24: Ver por separado el gasto en USD nativo · [#47](https://github.com/Joaconz/Biyu/issues/47) · Implementada

- **Objetivo:** Como usuario, quiero ver por separado cuánto gasté en USD nativo, para saber cuánto
  salió de mis dólares.
- **Pantallas y campos:** debajo del total: "Incluye US$… en dólares".
- **Criterios de aceptación:**
  - CA-1: El dashboard muestra el subtotal en USD de las imputaciones en dólares.
- **Trazabilidad:** FR-20
- **Casos de prueba:** CP-MON-006

### Épica: Resumen mensual (dashboard)

#### US-25: Total gastado del mes actual al entrar · [#48](https://github.com/Joaconz/Biyu/issues/48) · Implementada

- **Objetivo:** Como usuario, quiero ver el total gastado del mes actual apenas entro al dashboard,
  para tener la respuesta principal sin filtrar nada.
- **Pantallas y campos:** **Resumen** (`/dashboard`): tarjeta verde "Gastado en <mes>" con el total.
- **Criterios de aceptación:**
  - CA-1: `/dashboard` sin parámetros muestra el período actual.
  - CA-2: El total suma las imputaciones del período y excluye transacciones borradas (I10).
- **Trazabilidad:** FR-20 · I10
- **Casos de prueba:** CP-DAS-001, CP-REG-012

#### US-26: Cambiar de mes con un selector · [#49](https://github.com/Joaconz/Biyu/issues/49) · Implementada

- **Objetivo:** Como usuario, quiero cambiar de mes con un selector, para revisar meses anteriores o
  ver cuotas futuras.
- **Pantallas y campos:** flechas "Mes anterior" / "Mes siguiente" y el nombre del mes, que abre un
  selector. El mes queda en la URL (`?period=AAAA-MM`).
- **Criterios de aceptación:**
  - CA-1: El período vive en la URL (`?period=AAAA-MM`) y es enlazable (C11).
  - CA-2: Se puede navegar a meses futuros: muestran cuotas comprometidas, no suscripciones.
- **Trazabilidad:** FR-21 · C11
- **Casos de prueba:** CP-DAS-002, CP-DAS-003

#### US-27: Gasto por categoría en barras · [#50](https://github.com/Joaconz/Biyu/issues/50) · Implementada

- **Objetivo:** Como usuario, quiero ver el gasto desagregado por categoría en un gráfico de barras,
  para identificar dónde se concentra.
- **Pantallas y campos:** sección "Por categoría": una barra por categoría con monto y porcentaje.
- **Criterios de aceptación:**
  - CA-1: Gráfico de barras con el gasto del período por categoría, incluidas las archivadas.
- **Trazabilidad:** FR-20 (ajustado por #78: barras en lugar de torta)
- **Casos de prueba:** CP-DAS-004

#### US-28: Gasto por cuenta · [#51](https://github.com/Joaconz/Biyu/issues/51) · Implementada

- **Objetivo:** Como usuario, quiero ver el gasto desagregado por cuenta, para saber qué tarjeta está
  cargada.
- **Pantallas y campos:** sección "Por cuenta" con monto y porcentaje.
- **Criterios de aceptación:**
  - CA-1: Desglose del gasto del período por cuenta.
- **Trazabilidad:** FR-20
- **Casos de prueba:** CP-DAS-005

#### US-29: Ingresos y balance del mes · [#52](https://github.com/Joaconz/Biyu/issues/52) · Implementada

- **Objetivo:** Como usuario, quiero ver el total de ingresos del mes y el balance (ingresos menos
  gastos), para saber si el mes cerró en positivo.
- **Pantallas y campos:** tarjetas "Ingresos" y "Balance" con etiqueta "Superávit", "Déficit" o "En cero".
- **Criterios de aceptación:**
  - CA-1: Muestra total de ingresos y balance = ingresos − gastos.
- **Trazabilidad:** FR-20
- **Casos de prueba:** CP-DAS-006, CP-DAS-007

#### US-31: Últimas transacciones con acceso a la lista completa · [#53](https://github.com/Joaconz/Biyu/issues/53) · Implementada

- **Objetivo:** Como usuario, quiero ver las últimas transacciones del mes con un acceso a la lista
  completa, para verificar lo que cargué.
- **Pantallas y campos:** sección "Últimos movimientos" con enlace "Ver todos" a **Movimientos**
  (`/transactions`), agrupados por día.
- **Criterios de aceptación:**
  - CA-1: Muestra las últimas 10 transacciones del período y un acceso a la lista completa.
- **Trazabilidad:** FR-20
- **Casos de prueba:** CP-DAS-008

#### US-32: Días del mes con al menos un registro · [#54](https://github.com/Joaconz/Biyu/issues/54) · Implementada

- **Objetivo:** Como usuario, quiero ver cuántos días del mes tienen al menos un registro, para saber
  si estoy siendo consistente.
- **Pantallas y campos:** en la tarjeta principal: "N de M días con registro".
- **Criterios de aceptación:**
  - CA-1: Muestra cuántos días distintos del período tienen al menos una transacción no borrada.
- **Trazabilidad:** FR-20
- **Casos de prueba:** CP-DAS-009

#### US-33: Estado vacío con acceso al registro · [#55](https://github.com/Joaconz/Biyu/issues/55) · Implementada

- **Objetivo:** Como usuario, quiero que un mes sin datos muestre un mensaje claro y un acceso al
  registro, en vez de un dashboard de ceros.
- **Pantallas y campos:** "No tenés movimientos registrados en <mes>." y botón "Registrar un gasto".
- **Criterios de aceptación:**
  - CA-1: Un período sin datos muestra un mensaje claro y un acceso a `/register`, no ceros.
- **Trazabilidad:** FR-20
- **Casos de prueba:** CP-DAS-010

### Épica: Baja lógica

#### US-65: Eliminar una transacción con aviso si toca meses cerrados · [#66](https://github.com/Joaconz/Biyu/issues/66) · Implementada

- **Objetivo:** Como usuario, quiero eliminar una transacción que cargué mal, con un aviso si eso
  cambia los totales de meses ya cerrados, para corregir el registro sin perder el historial.
- **Pantallas y campos:** botón de papelera en cada movimiento; diálogo "¿Eliminar transacción?" con
  "Cancelar" y "Eliminar". Si hay imputaciones en meses cerrados, el diálogo lista cada mes y cuánto
  baja su total.
- **Criterios de aceptación:**
  - CA-1: El borrado es lógico (`deleted_at`) y la transacción sale de todos los KPI (I10).
  - CA-2: Si sus imputaciones tocan meses anteriores al actual, se avisa qué totales cambian antes de
    confirmar.
- **Trazabilidad:** FR-08 · C10 · I10
- **Casos de prueba:** CP-REG-012, CP-REG-013

---

## Supuestos de este documento

1. Las historias, su redacción y sus criterios salen de los issues de GitHub y de
   `docs/02-behavior-spec.md`; no se agregaron historias nuevas.
2. "Pantallas y campos" describe la UI de `main` al 2026-09-28 (commit `9e8c219`, después del
   rediseño de ADR-023 y ADR-024), no la de las capturas de la pre-entrega.
3. US-50 conserva el criterio original de "una letra y un número"; el criterio vigente es el de
   US-67, que lo amplió. No se reescribió para no perder la historia del cambio.
