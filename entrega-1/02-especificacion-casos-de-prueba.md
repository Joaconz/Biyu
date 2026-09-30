# Proyecto Biyu – Entrega 1 · Especificación de casos de prueba (V1)

Planilla con una hoja por caso (formato de la plantilla de la cátedra): `02-especificacion-casos-de-prueba.xlsx`. Fuente única: `fuentes/casos.mjs`.

## Qué contiene

- **74 casos**: los 68 del catálogo de V1 (`docs/10-catalogo-casos-v1.md`, mismos IDs y oráculos) más **6 casos nuevos** de esta entrega para las historias que no tenían ninguno: CP-ACC-012 (US-66) y CP-CFG-011 a CP-CFG-015 (US-68).
- Cada caso declara técnica de diseño, tipo, prioridad, si es **camino feliz**, precondiciones, datos de prueba y pasos con su resultado esperado.
- Los negativos llevan una **variante API**: el mismo ataque directo contra Supabase, salteando la UI (C6: la validación real es la de Postgres).
- IDs: `CP-<módulo>-<nnn>`. Módulos: `ACC` Acceso y autorización · `CFG` Configuración · `REG` Registro y baja · `CUO` Cuotas · `MON` Monedas · `DAS` Dashboard.

## Cobertura del diseño

| Módulo | Casos | Alta | Media | Baja |
|---|---|---|---|---|
| ACC · Acceso y autorización | 12 | 9 | 3 | 0 |
| CFG · Configuración | 15 | 6 | 7 | 2 |
| REG · Registro y baja | 16 | 6 | 7 | 3 |
| CUO · Cuotas | 13 | 10 | 2 | 1 |
| MON · Monedas | 7 | 5 | 1 | 1 |
| DAS · Dashboard | 11 | 3 | 6 | 2 |
| **Total** | **74** | **39** | **26** | **9** |

| Tipo | Casos |
|---|---|
| Positivo | 39 |
| Negativo | 19 |
| Límite | 16 |

| Técnica | Casos |
|---|---|
| Caso de uso | 37 |
| Adivinación de errores | 21 |
| Valores límite | 8 |
| Tabla de decisión | 7 |
| Transición de estados | 1 |

Casos de camino feliz: 36.

## Índice

| ID | Prioridad | Título | Historia | Camino feliz | Tipo |
|---|---|---|---|---|---|
| CP-ACC-001 | Alta | Sin sesión, la app redirige al login | US-48 | Sí | Positivo |
| CP-ACC-002 | Alta | Una ruta privada abierta sin sesión conserva el destino | US-48 | No | Negativo |
| CP-ACC-003 | Alta | Crear una cuenta con email y contraseña válidos | US-50, US-51 | Sí | Positivo |
| CP-ACC-004 | Alta | Contraseñas que no cumplen los criterios se rechazan | US-50, US-67 | No | Negativo |
| CP-ACC-005 | Alta | No se puede crear una cuenta con un email ya registrado | US-50 | No | Negativo |
| CP-ACC-006 | Media | Credenciales inválidas en el login, sin arrastrar el error al signup | US-48, US-50 | No | Negativo |
| CP-ACC-007 | Media | Alta sin sesión (confirmación de email activa) no entra a la app | US-51 | No | Límite |
| CP-ACC-008 | Alta | Una cuenta nueva tiene el catálogo inicial sembrado | US-43, US-51 | Sí | Positivo |
| CP-ACC-009 | Alta | Cerrar sesión y no poder volver con "atrás" | US-64 | Sí | Positivo |
| CP-ACC-010 | Media | La sesión persiste al recargar y al reabrir el navegador | US-49 | Sí | Positivo |
| CP-ACC-011 | Alta | Aislamiento entre usuarios en todas las tablas (par de autorización) | US-48 | No | Negativo |
| CP-ACC-012 *(nuevo)* | Alta | Contraseña y confirmación distintas bloquean el alta | US-66 | No | Negativo |
| CP-CFG-001 | Alta | Crear una categoría con nombre y color | US-42 | Sí | Positivo |
| CP-CFG-002 | Media | Renombrar una categoría y cambiarle el color | US-42 | Sí | Positivo |
| CP-CFG-003 | Media | No se permiten dos categorías activas con el mismo nombre | US-42 | No | Negativo |
| CP-CFG-004 | Alta | Archivar una categoría con historia | US-44 | Sí | Positivo |
| CP-CFG-005 | Baja | Reusar el nombre de una categoría archivada | US-42, US-44 | No | Límite |
| CP-CFG-006 | Alta | Crear una cuenta de tarjeta de crédito | US-45 | Sí | Positivo |
| CP-CFG-007 | Media | No se permiten dos cuentas activas con el mismo nombre | US-45 | No | Negativo |
| CP-CFG-008 | Alta | La siembra concurrente no duplica el catálogo | US-43 | No | Límite |
| CP-CFG-009 | Alta | Cargar y actualizar el tipo de cambio de referencia del mes | US-46 | Sí | Positivo |
| CP-CFG-010 | Media | Tipo de cambio de referencia en cero o negativo | US-46 | No | Límite |
| CP-CFG-011 *(nuevo)* | Alta | Después de crear la cuenta aparece la configuración inicial | US-68 | Sí | Positivo |
| CP-CFG-012 *(nuevo)* | Media | Saltear todo el setup deja la siembra de siempre | US-68, US-43 | No | Positivo |
| CP-CFG-013 *(nuevo)* | Media | Destildar una categoría en el setup la archiva | US-68 | No | Positivo |
| CP-CFG-014 *(nuevo)* | Media | La cuenta elegida como predeterminada viene preseleccionada | US-68, US-07 | Sí | Positivo |
| CP-CFG-015 *(nuevo)* | Baja | El setup no reaparece y se puede reabrir desde Ajustes | US-68 | No | Límite |
| CP-REG-001 | Alta | El registro es la pantalla de inicio | US-01 | Sí | Positivo |
| CP-REG-002 | Media | La fecha viene precargada con hoy | US-03 | Sí | Positivo |
| CP-REG-003 | Baja | Tipo "gasto" y moneda ARS por defecto | US-04, US-05 | Sí | Positivo |
| CP-REG-004 | Media | Elegir la categoría tocando un chip | US-06 | Sí | Positivo |
| CP-REG-005 | Media | Una categoría archivada no se ofrece ni se acepta por API | US-06 | No | Negativo |
| CP-REG-006 | Baja | La cuenta viene precargada con la última usada | US-07 | Sí | Positivo |
| CP-REG-007 | Baja | Guardar sin nota | US-08 | No | Límite |
| CP-REG-008 | Media | Fecha de ayer sí, fecha de mañana no | US-09 | No | Límite |
| CP-REG-009 | Media | Confirmación y formulario limpio después de guardar | US-10 | Sí | Positivo |
| CP-REG-010 | Alta | Monto vacío, cero o negativo no se guarda | US-11 | No | Negativo |
| CP-REG-011 | Media | Monto con tres decimales | US-11 | No | Límite |
| CP-REG-012 | Alta | Eliminar una transacción la saca del total del mes | US-65 | Sí | Positivo |
| CP-REG-013 | Alta | Eliminar una compra con cuotas en meses cerrados avisa y es retroactivo | US-65, US-18 | No | Límite |
| CP-REG-014 | Alta | Otro usuario no puede leer ni borrar una transacción ajena | US-48 | No | Negativo |
| CP-REG-015 | Alta | No se puede escribir en transactions salteando la RPC | US-11 | No | Negativo |
| CP-REG-016 | Media | El monto toma el foco con teclado numérico | US-02 | Sí | Positivo |
| CP-CUO-001 | Alta | Compra en 12 cuotas genera 12 imputaciones consecutivas | US-12 | Sí | Positivo |
| CP-CUO-002 | Alta | Previsualización del impacto mensual antes de guardar | US-13 | Sí | Positivo |
| CP-CUO-003 | Alta | Cambiar a una cuenta que no es crédito resetea las cuotas | US-14 | No | Negativo |
| CP-CUO-004 | Alta | División exacta: 12 cuotas iguales | US-15 | Sí | Positivo |
| CP-CUO-005 | Alta | El resto lo absorbe la última cuota | US-15 | No | Límite |
| CP-CUO-006 | Alta | Cantidad de cuotas: 0, 1, 2, 12 y 13 | US-15, US-12 | No | Límite |
| CP-CUO-007 | Media | El Resumen separa las cuotas de meses anteriores | US-16 | Sí | Positivo |
| CP-CUO-008 | Baja | El listado muestra el número de cuota | US-17 | Sí | Positivo |
| CP-CUO-009 | Alta | Borrar una compra en cuotas saca todas sus cuotas | US-18 | Sí | Positivo |
| CP-CUO-010 | Media | En USD, la suma en pesos de las cuotas es exacta | US-15 | No | Límite |
| CP-CUO-011 | Alta | Otro usuario no ve las cuotas de una compra ajena | US-48 | No | Negativo |
| CP-CUO-012 | Alta | Un ingreso no admite cuotas aunque la cuenta sea crédito | US-12, US-14 | No | Negativo |
| CP-CUO-013 | Alta | Un fallo a mitad de create_transaction no deja datos parciales | US-15 | No | Negativo |
| CP-MON-001 | Alta | Gasto en USD con el tipo de cambio sugerido | US-19 | Sí | Positivo |
| CP-MON-002 | Alta | Tabla de decisión de moneda y tipo de cambio (6 filas) | US-19 | No | Negativo |
| CP-MON-003 | Media | Pisar el tipo de cambio sugerido | US-20, US-21 | Sí | Positivo |
| CP-MON-004 | Alta | Cambiar la referencia no altera lo ya guardado | US-22 | No | Positivo |
| CP-MON-005 | Alta | El total del mes en pesos incluye lo gastado en dólares | US-23 | Sí | Positivo |
| CP-MON-006 | Baja | El gasto en dólares se ve por separado | US-24 | Sí | Positivo |
| CP-MON-007 | Alta | Otro usuario no lee ni modifica el tipo de cambio ajeno | US-48 | No | Negativo |
| CP-DAS-001 | Alta | El Resumen abre en el mes actual con su total | US-25 | Sí | Positivo |
| CP-DAS-002 | Alta | El mes elegido vive en la URL | US-26 | Sí | Positivo |
| CP-DAS-003 | Media | Período inválido o ausente cae al mes actual | US-26 | No | Límite |
| CP-DAS-004 | Media | Gasto por categoría en barras | US-27 | Sí | Positivo |
| CP-DAS-005 | Media | Gasto por cuenta | US-28 | Sí | Positivo |
| CP-DAS-006 | Media | Ingresos y balance positivo | US-29 | Sí | Positivo |
| CP-DAS-007 | Baja | Balance negativo con signo explícito | US-29 | No | Límite |
| CP-DAS-008 | Media | Últimos 10 movimientos con acceso a la lista completa | US-31 | Sí | Positivo |
| CP-DAS-009 | Baja | Una cuota heredada no cuenta como día con registro | US-32 | No | Límite |
| CP-DAS-010 | Media | Mes sin datos: estado vacío con acceso al registro | US-33 | No | Límite |
| CP-DAS-011 | Alta | El Resumen de un usuario nunca muestra datos de otro | US-48 | No | Negativo |

## Casos

### ACC · Acceso y autorización

#### CP-ACC-001 — Sin sesión, la app redirige al login

| Campo | Contenido |
|---|---|
| Funcionalidad | Acceso |
| Historias de usuario | US-48 |
| Trazabilidad | FR-02 · NFR-13 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Alta · Sí |
| Automatización | V3 |
| Pre-requisitos | Navegador sin sesión de Biyu: ventana de incógnito, o en una ventana normal cerrar sesión desde Ajustes → "Cerrar sesión". |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Escribir la dirección de la app (la raíz, "/") en la barra del navegador y dar Enter. | Redirige a /login?next=%2Fregister. |
| 2 | Observar la pantalla. | Se ve el formulario "Entrar" (Email, Contraseña, botón "Entrar"); no se renderiza nada de /register. |

#### CP-ACC-002 — Una ruta privada abierta sin sesión conserva el destino

| Campo | Contenido |
|---|---|
| Funcionalidad | Acceso |
| Historias de usuario | US-48 |
| Trazabilidad | FR-02 · C7 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Prioridad · Camino feliz | Alta · No |
| Automatización | Sí |
| Pre-requisitos | Navegador sin sesión de Biyu (ventana de incógnito). |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Escribir en la barra del navegador la dirección de la app seguida de /settings (por ejemplo http://localhost:5180/settings) y dar Enter, sin pasar antes por /login. | Redirige a /login?next=%2Fsettings, conservando el destino original. |

#### CP-ACC-003 — Crear una cuenta con email y contraseña válidos

| Campo | Contenido |
|---|---|
| Funcionalidad | Registro de usuario |
| Historias de usuario | US-50, US-51 |
| Trazabilidad | FR-01 · ADR-011 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Alta · Sí |
| Automatización | V3 |
| Pre-requisitos | Navegador sin sesión de Biyu.<br>Email sin cuenta previa. |
| Datos de prueba | Email: nueva@test.local (uno nuevo por corrida)<br>Contraseña: Clave123! |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir la app. En /login, tocar "Crear una cuenta". | Se ve "Crear cuenta" con los criterios de contraseña. |
| 2 | Escribir el email en "Email", Clave123! en "Contraseña" y Clave123! en "Confirmar contraseña". | Los criterios se marcan como cumplidos; las contraseñas se ven enmascaradas. |
| 3 | Tocar "Crear cuenta". | Cuenta creada con sesión activa, sin paso de confirmación por email (ADR-011). Se abre la configuración inicial ("¿Para qué vas a usar Biyu?", US-68). |
| 4 | En la configuración inicial, tocar "Saltear" en cada uno de los 4 pasos. | La configuración inicial termina y se abre Registrar. |
| 5 | Observar la URL. | La app queda en /register. |

#### CP-ACC-004 — Contraseñas que no cumplen los criterios se rechazan

| Campo | Contenido |
|---|---|
| Funcionalidad | Registro de usuario |
| Historias de usuario | US-50, US-67 |
| Trazabilidad | FR-01 |
| Técnica · Tipo | Tabla de decisión · Negativo |
| Prioridad · Camino feliz | Alta · No |
| Automatización | Sí |
| Pre-requisitos | Navegador sin sesión de Biyu.<br>Un email distinto, sin cuenta previa, para cada contraseña.<br>Para la variante API: la anon key del proyecto y el token de sesión del usuario. La llamada se hace fuera de la pantalla (Postman o curl contra /rest/v1, o la consola del navegador con el cliente de Supabase de la app). |
| Datos de prueba | (a): abc1234 — 7 caracteres<br>(b): abcdefgh — solo minúsculas<br>(c): 12345678 — solo números<br>(d): abcd1234 — sin mayúscula ni especial<br>(e): Abcd123! — cumple los 5 criterios |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir la app. En /login, tocar "Crear una cuenta". | Se ve "Crear cuenta" con la lista de los 5 criterios, todos con ○ (pendientes). |
| 2 | Escribir un email nuevo y la contraseña (a) en "Contraseña" y en "Confirmar contraseña". Tocar "Crear cuenta". | Mensaje "Falta que la contraseña cumpla: …" con los criterios que faltan. No se crea la cuenta. |
| 3 | Repetir el paso anterior con (b), (c) y (d), cada una con un email nuevo. | Cada una se rechaza con un mensaje que dice qué criterio falta. No se crea la cuenta. |
| 4 | Repetir con (e) y un email nuevo. | Se acepta: la cuenta se crea y se abre la configuración inicial. |
| 5 | Variante API: POST /auth/v1/signup con un email nuevo y la contraseña (d), sin pasar por el formulario. | Rechazada: FR-01 pide validar también en el servidor. |

#### CP-ACC-005 — No se puede crear una cuenta con un email ya registrado

| Campo | Contenido |
|---|---|
| Funcionalidad | Registro de usuario |
| Historias de usuario | US-50 |
| Trazabilidad | FR-01 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Prioridad · Camino feliz | Alta · No |
| Automatización | Sí |
| Pre-requisitos | Ya existe una cuenta con el email de prueba (la de CP-ACC-003).<br>Navegador sin sesión de Biyu.<br>Para la variante API: la anon key del proyecto y el token de sesión del usuario. La llamada se hace fuera de la pantalla (Postman o curl contra /rest/v1, o la consola del navegador con el cliente de Supabase de la app). |
| Datos de prueba | Email: el de CP-ACC-003 |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir la app. En /login, tocar "Crear una cuenta". | Se abre "Crear cuenta" con los campos Email, Contraseña y Confirmar contraseña, y la lista de criterios de contraseña. |
| 2 | Escribir el email de CP-ACC-003 en "Email", Clave123! en "Contraseña" y otra vez Clave123! en "Confirmar contraseña". | Los cinco criterios de contraseña se marcan con ✓; las dos contraseñas se ven enmascaradas. |
| 3 | Tocar "Crear cuenta". | Mensaje "Ya existe una cuenta con ese email". No se crea una segunda cuenta y la pantalla sigue en "Crear cuenta". |
| 4 | Variante API: POST /auth/v1/signup con el mismo email. | Error user_already_exists / email_exists. |

#### CP-ACC-006 — Credenciales inválidas en el login, sin arrastrar el error al signup

| Campo | Contenido |
|---|---|
| Funcionalidad | Inicio de sesión |
| Historias de usuario | US-48, US-50 |
| Trazabilidad | FR-01 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Prioridad · Camino feliz | Media · No |
| Automatización | Sí |
| Pre-requisitos | Navegador sin sesión de Biyu.<br>Email sin cuenta, o contraseña incorrecta para una que existe. |
| Datos de prueba | Email: noexiste@test.local<br>Contraseña: Cualquiera, por ejemplo Clave123! |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir la app en /login. | Se ve el formulario "Entrar". |
| 2 | Escribir noexiste@test.local en "Email" y Clave123! en "Contraseña". Tocar "Entrar". | Mensaje "Email o contraseña incorrectos". La pantalla sigue en /login. |
| 3 | Sin recargar la página, tocar "Crear una cuenta" (debajo del botón "Entrar"). | Se abre /signup y el error anterior no aparece. |

#### CP-ACC-007 — Alta sin sesión (confirmación de email activa) no entra a la app

| Campo | Contenido |
|---|---|
| Funcionalidad | Registro de usuario |
| Historias de usuario | US-51 |
| Trazabilidad | FR-01 · ADR-011 |
| Técnica · Tipo | Adivinación de errores · Límite |
| Prioridad · Camino feliz | Media · No |
| Automatización | No |
| Pre-requisitos | Hipotético: "Confirm email" activo en Supabase, de modo que signUp() no devuelve sesión. Para simularlo sin tocar el proyecto, interceptar la respuesta de /auth/v1/signup para que llegue sin sesión (por ejemplo con Playwright, como en la ejecución 1).<br>Navegador sin sesión de Biyu. |
| Datos de prueba | Email: uno nuevo<br>Contraseña: Clave123! |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir la app. En /login, tocar "Crear una cuenta". | Se abre "Crear cuenta" con los campos Email, Contraseña y Confirmar contraseña, y la lista de criterios de contraseña. |
| 2 | Escribir un email nuevo en "Email", Clave123! en "Contraseña" y otra vez Clave123! en "Confirmar contraseña". | Los cinco criterios de contraseña se marcan con ✓; las dos contraseñas se ven enmascaradas. |
| 3 | Tocar "Crear cuenta", con la respuesta de signup llegando sin sesión. | No se redirige a una ruta protegida: la pantalla sigue en /signup y muestra "Te creamos la cuenta, pero hace falta confirmar el email antes de entrar." |

#### CP-ACC-008 — Una cuenta nueva tiene el catálogo inicial sembrado

| Campo | Contenido |
|---|---|
| Funcionalidad | Configuración |
| Historias de usuario | US-43, US-51 |
| Trazabilidad | FR-04 · ADR-014 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Alta · Sí |
| Automatización | V3 |
| Pre-requisitos | Navegador sin sesión de Biyu.<br>Email sin cuenta previa. |
| Datos de prueba | Email: uno nuevo<br>Contraseña: Clave123! |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir la app. En /login, tocar "Crear una cuenta". | Se abre "Crear cuenta" con los campos Email, Contraseña y Confirmar contraseña, y la lista de criterios de contraseña. |
| 2 | Escribir un email nuevo en "Email", Clave123! en "Contraseña" y otra vez Clave123! en "Confirmar contraseña". | Los cinco criterios de contraseña se marcan con ✓; las dos contraseñas se ven enmascaradas. |
| 3 | Tocar "Crear cuenta". | Se abre la configuración inicial. |
| 4 | En la configuración inicial, tocar "Saltear" en cada uno de los 4 pasos. | La configuración inicial termina y se abre Registrar. |
| 5 | Tocar el engranaje "Ajustes" arriba a la derecha (en computadora, "Ajustes" en el menú lateral). | Se abre Ajustes con las secciones Categorías, Cuentas y Tipo de cambio de referencia. |
| 6 | Revisar las listas "Categorías" y "Cuentas". | Están las 8 categorías (Comida y supermercado, Transporte, Servicios, Entretenimiento, Salud, Educación, Indumentaria, Otros) y las 5 cuentas de FR-04 (Tarjeta de crédito, Tarjeta de débito, Efectivo, Cuenta bancaria, Billetera virtual). |

#### CP-ACC-009 — Cerrar sesión y no poder volver con "atrás"

| Campo | Contenido |
|---|---|
| Funcionalidad | Cierre de sesión |
| Historias de usuario | US-64 |
| Trazabilidad | FR-03 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Alta · Sí |
| Automatización | V3 |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Resumen". | Se abre el Resumen del mes. |
| 2 | Tocar el engranaje "Ajustes" arriba a la derecha (en computadora, "Ajustes" en el menú lateral). | Se abre Ajustes con las secciones Categorías, Cuentas y Tipo de cambio de referencia. |
| 3 | Bajar hasta el final de Ajustes y tocar "Cerrar sesión". | La sesión se cierra y redirige a /login. |
| 4 | Tocar el botón "atrás" del navegador. | No se recupera el acceso: cae otra vez en /login. |
| 5 | Volver a iniciar sesión y repetir los pasos 2 a 4 partiendo de Registrar y de Movimientos. | Mismo resultado desde cada pantalla. |

#### CP-ACC-010 — La sesión persiste al recargar y al reabrir el navegador

| Campo | Contenido |
|---|---|
| Funcionalidad | Acceso |
| Historias de usuario | US-49 |
| Trazabilidad | FR-03 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Media · Sí |
| Automatización | No |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Estar en Registrar (/register).<br>Ventana normal del navegador, no de incógnito (la sesión se guarda en el navegador). |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Recargar la pestaña (F5 o el botón de recargar). | Sigue en /register sin pedir login. |
| 2 | Cerrar el navegador por completo, volver a abrirlo y entrar a la misma dirección de la app. | La sesión persiste (localStorage): abre Registrar sin pedir login. |

#### CP-ACC-011 — Aislamiento entre usuarios en todas las tablas (par de autorización)

| Campo | Contenido |
|---|---|
| Funcionalidad | Autorización |
| Historias de usuario | US-48 |
| Trazabilidad | C7 · NFR-13 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Prioridad · Camino feliz | Alta · No |
| Automatización | Sí |
| Pre-requisitos | Dos usuarios de prueba, A y B, cada uno con sus propios datos cargados, y el token de sesión de cada uno.<br>Id de usuario de A (se ve en la tabla auth.users o en el token de A).<br>Para la variante API: la anon key del proyecto y el token de sesión del usuario. La llamada se hace fuera de la pantalla (Postman o curl contra /rest/v1, o la consola del navegador con el cliente de Supabase de la app). |
| Datos de prueba | Tablas: categories, accounts, fx_rates, transactions, ledger_entries, debts, subscriptions |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Con el token de B, consultar cada tabla filtrando por el id de A: GET /rest/v1/<tabla>?user_id=eq.<id de A>. | B ve 0 filas de A en categories, accounts, fx_rates, transactions, ledger_entries, debts y subscriptions. |
| 2 | Sin token de usuario, solo con la anon key (rol anon), hacer GET /rest/v1/<tabla> para cada tabla. | permission denied (42501) en todas. |

#### CP-ACC-012 — Contraseña y confirmación distintas bloquean el alta *(nuevo)*

| Campo | Contenido |
|---|---|
| Funcionalidad | Registro de usuario |
| Historias de usuario | US-66 |
| Trazabilidad | FR-01 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Prioridad · Camino feliz | Alta · No |
| Automatización | Sí |
| Pre-requisitos | Navegador sin sesión de Biyu.<br>Email sin cuenta previa. |
| Datos de prueba | Contraseña: Clave123!<br>Confirmar contraseña: Clave123? |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir la app. En /login, tocar "Crear una cuenta". | Se abre "Crear cuenta". |
| 2 | Escribir un email nuevo en "Email", Clave123! en "Contraseña" y Clave123? en "Confirmar contraseña". | Los dos campos se ven enmascarados. |
| 3 | Tocar "Crear cuenta". | Mensaje "Las contraseñas no son iguales". No se crea la cuenta y la pantalla sigue en "Crear cuenta". |

### CFG · Configuración

#### CP-CFG-001 — Crear una categoría con nombre y color

| Campo | Contenido |
|---|---|
| Funcionalidad | Categorías |
| Historias de usuario | US-42 |
| Trazabilidad | FR-05 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Alta · Sí |
| Automatización | V3 |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Usuario con categorías sembradas. |
| Datos de prueba | Nombre: Mascotas |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Tocar el engranaje "Ajustes" arriba a la derecha (en computadora, "Ajustes" en el menú lateral). | Se abre Ajustes con las secciones Categorías, Cuentas y Tipo de cambio de referencia. |
| 2 | En la sección "Categorías", bajar hasta el formulario y escribir "Mascotas" en "Nueva categoría". | El nombre queda cargado. |
| 3 | Tocar un color de la paleta, distinto del primero. | El color elegido queda marcado. |
| 4 | Tocar "Crear categoría". | Aparece en el listado activo con ese nombre y color. |

#### CP-CFG-002 — Renombrar una categoría y cambiarle el color

| Campo | Contenido |
|---|---|
| Funcionalidad | Categorías |
| Historias de usuario | US-42 |
| Trazabilidad | FR-05 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Media · Sí |
| Automatización | V3 |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Categoría "Comida y supermercado" activa. |
| Datos de prueba | Nombre nuevo: Comida |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Tocar el engranaje "Ajustes" arriba a la derecha (en computadora, "Ajustes" en el menú lateral). | Se abre Ajustes con las secciones Categorías, Cuentas y Tipo de cambio de referencia. |
| 2 | En "Categorías", tocar el lápiz ("Editar Comida y supermercado") a la derecha de "Comida y supermercado". | Se abre la edición en línea, con el nombre, la paleta y los botones "Cancelar" y "Guardar". |
| 3 | Borrar el nombre y escribir "Comida". Tocar otro color de la paleta. | Se ven el nombre y el color nuevos. |
| 4 | Tocar "Guardar". | El listado muestra el nombre y el color nuevos, sin crear una fila nueva. |

#### CP-CFG-003 — No se permiten dos categorías activas con el mismo nombre

| Campo | Contenido |
|---|---|
| Funcionalidad | Categorías |
| Historias de usuario | US-42 |
| Trazabilidad | FR-05 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Prioridad · Camino feliz | Media · No |
| Automatización | Sí |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Existe la categoría activa "Salud".<br>Para la variante API: la anon key del proyecto y el token de sesión del usuario. La llamada se hace fuera de la pantalla (Postman o curl contra /rest/v1, o la consola del navegador con el cliente de Supabase de la app). |
| Datos de prueba | Nombre: Salud |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Tocar el engranaje "Ajustes" arriba a la derecha (en computadora, "Ajustes" en el menú lateral). | Se abre Ajustes con las secciones Categorías, Cuentas y Tipo de cambio de referencia. |
| 2 | En "Nueva categoría", escribir "Salud" y tocar "Crear categoría". | Rechazado con "Ya existe una categoría activa con ese nombre". La lista no cambia. |
| 3 | Variante API: POST /rest/v1/categories con name "Salud" (insert directo a categories con el mismo nombre). | Error 23505 (unique_violation). |

#### CP-CFG-004 — Archivar una categoría con historia

| Campo | Contenido |
|---|---|
| Funcionalidad | Categorías |
| Historias de usuario | US-44 |
| Trazabilidad | FR-05 · C10 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Alta · Sí |
| Automatización | V3 |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>"Entretenimiento" con al menos una transacción que la usa: en Registrar, escribir 8000, tocar "Siguiente", tocar "Entretenimiento", escribir "Cine" en "Nota (opcional)" y tocar "Guardar gasto". |
| Datos de prueba | Transacción: $8.000, nota "Cine" |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Tocar el engranaje "Ajustes" arriba a la derecha (en computadora, "Ajustes" en el menú lateral). | Se abre Ajustes con las secciones Categorías, Cuentas y Tipo de cambio de referencia. |
| 2 | En "Categorías", tocar el botón de archivar ("Archivar Entretenimiento") a la derecha de "Entretenimiento". | Desaparece del listado activo. |
| 3 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Registrar". | Se abre Registrar en el paso 1/3 ("¿Cuánto?"), con "Gasto" y "ARS" seleccionados y el cursor en el monto. |
| 4 | Escribir 1000 en el monto. | El monto queda cargado y se habilita "Siguiente". |
| 5 | Tocar "Siguiente". | Pasa al paso 2/3 ("¿En qué?") con la grilla de categorías. |
| 6 | Observar la grilla de categorías. | No aparece "Entretenimiento". |
| 7 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Movimientos". | Se abre Movimientos del mes actual. |
| 8 | Buscar la transacción "Cine" de $8.000. | Conserva su categoría y la muestra con una marca de archivada. |

#### CP-CFG-005 — Reusar el nombre de una categoría archivada

| Campo | Contenido |
|---|---|
| Funcionalidad | Categorías |
| Historias de usuario | US-42, US-44 |
| Trazabilidad | FR-05 |
| Técnica · Tipo | Tabla de decisión · Límite |
| Prioridad · Camino feliz | Baja · No |
| Automatización | Sí |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Categoría "Salidas" archivada y ninguna activa con ese nombre: en Ajustes, crear "Salidas" con "Crear categoría" y después tocar "Archivar Salidas". |
| Datos de prueba | Nombre: Salidas |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Tocar el engranaje "Ajustes" arriba a la derecha (en computadora, "Ajustes" en el menú lateral). | Se abre Ajustes con las secciones Categorías, Cuentas y Tipo de cambio de referencia. |
| 2 | En "Nueva categoría", escribir "Salidas" y tocar "Crear categoría". | Se permite: "Salidas" aparece en el listado activo (el índice único solo cuenta las activas). |

#### CP-CFG-006 — Crear una cuenta de tarjeta de crédito

| Campo | Contenido |
|---|---|
| Funcionalidad | Cuentas |
| Historias de usuario | US-45 |
| Trazabilidad | FR-05 · I6 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Alta · Sí |
| Automatización | V3 |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Usuario con cuentas sembradas y sin una cuenta llamada "Visa BBVA". |
| Datos de prueba | Nombre: Visa BBVA<br>Tipo: Tarjeta de crédito<br>Moneda: ARS |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Tocar el engranaje "Ajustes" arriba a la derecha (en computadora, "Ajustes" en el menú lateral). | Se abre Ajustes con las secciones Categorías, Cuentas y Tipo de cambio de referencia. |
| 2 | En la sección "Cuentas", escribir "Visa BBVA" en "Nueva cuenta". | El nombre queda cargado. |
| 3 | Abrir el desplegable "Tipo" y elegir "Tarjeta de crédito". Dejar "ARS" en "Moneda". | Se ven "Tarjeta de crédito" y "ARS". |
| 4 | Tocar "Crear cuenta". | Aparece en la lista con el tipo en español ("Tarjeta de crédito"). |
| 5 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Registrar". | Se abre Registrar en el paso 1/3 ("¿Cuánto?"), con "Gasto" y "ARS" seleccionados y el cursor en el monto. |
| 6 | Escribir 1000 en el monto. | El monto queda cargado y se habilita "Siguiente". |
| 7 | Tocar "Siguiente". | Pasa al paso 2/3 ("¿En qué?") con la grilla de categorías. |
| 8 | Tocar el chip "Otros". | Avanza solo al paso 3/3 ("Revisá y guardá"). |
| 9 | En "Cuenta", tocar "Visa BBVA". | Se ofrece el selector de cuotas (I6): aparece "Cuotas" con los números 1 a 12. |

#### CP-CFG-007 — No se permiten dos cuentas activas con el mismo nombre

| Campo | Contenido |
|---|---|
| Funcionalidad | Cuentas |
| Historias de usuario | US-45 |
| Trazabilidad | FR-05 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Prioridad · Camino feliz | Media · No |
| Automatización | Sí |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Existe la cuenta activa "Efectivo" (sembrada).<br>Para la variante API: la anon key del proyecto y el token de sesión del usuario. La llamada se hace fuera de la pantalla (Postman o curl contra /rest/v1, o la consola del navegador con el cliente de Supabase de la app). |
| Datos de prueba | Nombre: Efectivo |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Tocar el engranaje "Ajustes" arriba a la derecha (en computadora, "Ajustes" en el menú lateral). | Se abre Ajustes con las secciones Categorías, Cuentas y Tipo de cambio de referencia. |
| 2 | En "Cuentas", escribir "Efectivo" en "Nueva cuenta", elegir cualquier "Tipo" y tocar "Crear cuenta". | Rechazado con "Ya existe una cuenta activa con ese nombre". La lista no cambia. |
| 3 | Variante API: POST /rest/v1/accounts con name "Efectivo" (insert directo a accounts). | Error 23505. |

#### CP-CFG-008 — La siembra concurrente no duplica el catálogo

| Campo | Contenido |
|---|---|
| Funcionalidad | Configuración |
| Historias de usuario | US-43 |
| Trazabilidad | FR-04 · ADR-014 |
| Técnica · Tipo | Adivinación de errores · Límite |
| Prioridad · Camino feliz | Alta · No |
| Automatización | No |
| Pre-requisitos | Usuario recién creado por API (POST /auth/v1/signup), todavía sin sembrar: no abrió la app nunca.<br>Acceso de lectura a la base local para contar filas. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Iniciar sesión con ese usuario y abrir /register en dos pestañas al mismo tiempo (abrir la segunda pestaña antes de que termine de cargar la primera). | Las dos cargan el formulario. |
| 2 | En la base, contar las categorías y las cuentas del usuario (select count(*) from categories / accounts where user_id = <id>). | Exactamente 8 y 5: sin duplicados. |

#### CP-CFG-009 — Cargar y actualizar el tipo de cambio de referencia del mes

| Campo | Contenido |
|---|---|
| Funcionalidad | Tipo de cambio |
| Historias de usuario | US-46 |
| Trazabilidad | FR-12 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Alta · Sí |
| Automatización | V3 |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>El mes actual sin tipo de cambio cargado. |
| Datos de prueba | TC 1: 1250<br>TC 2: 1300 |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Tocar el engranaje "Ajustes" arriba a la derecha (en computadora, "Ajustes" en el menú lateral). | Se abre Ajustes con las secciones Categorías, Cuentas y Tipo de cambio de referencia. |
| 2 | En "Tipo de cambio de referencia", elegir el mes actual en "Mes". | El mes queda cargado. |
| 3 | Escribir 1250 en "ARS por USD" y tocar "Guardar tipo de cambio". | Se crea la referencia del mes: aparece en la lista con $ 1.250,00. |
| 4 | Con el mismo mes, escribir 1300 en "ARS por USD" y tocar "Guardar tipo de cambio". | Se actualiza a 1300, sin duplicar la fila: la lista sigue teniendo una sola fila para ese mes. |

#### CP-CFG-010 — Tipo de cambio de referencia en cero o negativo

| Campo | Contenido |
|---|---|
| Funcionalidad | Tipo de cambio |
| Historias de usuario | US-46 |
| Trazabilidad | FR-12 |
| Técnica · Tipo | Valores límite · Límite |
| Prioridad · Camino feliz | Media · No |
| Automatización | Sí |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Para la variante API: la anon key del proyecto y el token de sesión del usuario. La llamada se hace fuera de la pantalla (Postman o curl contra /rest/v1, o la consola del navegador con el cliente de Supabase de la app). |
| Datos de prueba | Valores: 0 · -100 · 0,01 |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Tocar el engranaje "Ajustes" arriba a la derecha (en computadora, "Ajustes" en el menú lateral). | Se abre Ajustes con las secciones Categorías, Cuentas y Tipo de cambio de referencia. |
| 2 | En "Tipo de cambio de referencia", elegir un mes en "Mes", escribir 0 en "ARS por USD" y tocar "Guardar tipo de cambio". | Rechazado con "El tipo de cambio debe ser mayor a cero". |
| 3 | Repetir con -100. | Rechazado con el mismo mensaje. |
| 4 | Repetir con 0,01. | Aceptado (mínimo válido): aparece en la lista. |
| 5 | Variante API: upsert directo a fx_rates (POST /rest/v1/fx_rates) y llamada a la RPC upsert_fx_rate, las dos con 0 y con -100. | Rechazados por la base. |

#### CP-CFG-011 — Después de crear la cuenta aparece la configuración inicial *(nuevo)*

| Campo | Contenido |
|---|---|
| Funcionalidad | Configuración inicial |
| Historias de usuario | US-68 |
| Trazabilidad | FR-04 · FR-05 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Alta · Sí |
| Automatización | V3 |
| Pre-requisitos | Navegador sin sesión de Biyu.<br>Email sin cuenta previa. |
| Datos de prueba | Contraseña: Clave123! |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir la app. En /login, tocar "Crear una cuenta". | Se abre "Crear cuenta" con los campos Email, Contraseña y Confirmar contraseña, y la lista de criterios de contraseña. |
| 2 | Escribir un email nuevo en "Email", Clave123! en "Contraseña" y otra vez Clave123! en "Confirmar contraseña". | Los cinco criterios de contraseña se marcan con ✓; las dos contraseñas se ven enmascaradas. |
| 3 | Tocar "Crear cuenta". | La cuenta se crea. |
| 4 | Observar la pantalla siguiente. | Se muestra el setup (elementos con data-testid "setup-"), con los pasos "para qué la usás", categorías, cuentas y primer gasto: se ve "¿Para qué vas a usar Biyu?" con 3 opciones, "Continuar" y "Saltear", y una barra de 4 pasos. |

#### CP-CFG-012 — Saltear todo el setup deja la siembra de siempre *(nuevo)*

| Campo | Contenido |
|---|---|
| Funcionalidad | Configuración inicial |
| Historias de usuario | US-68, US-43 |
| Trazabilidad | FR-04 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Media · No |
| Automatización | V3 |
| Pre-requisitos | Cuenta recién creada, con el setup a la vista (pasos 1 a 3 de CP-CFG-011). |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En "¿Para qué vas a usar Biyu?", tocar "Saltear". | Pasa al paso "Tus categorías". |
| 2 | En "Tus categorías", tocar "Saltear". | Pasa al paso "Tus cuentas". |
| 3 | En "Tus cuentas", tocar "Saltear". | Pasa al paso "Registrá tu primer gasto". |
| 4 | En "Registrá tu primer gasto", tocar "Saltear" (al pie). | El setup termina y la app abre en Registrar. |
| 5 | Tocar el engranaje "Ajustes" arriba a la derecha (en computadora, "Ajustes" en el menú lateral). | Se abre Ajustes con las secciones Categorías, Cuentas y Tipo de cambio de referencia. |
| 6 | Revisar las listas "Categorías" y "Cuentas". | Quedan las 8 categorías y 5 cuentas sembradas (US-43). |

#### CP-CFG-013 — Destildar una categoría en el setup la archiva *(nuevo)*

| Campo | Contenido |
|---|---|
| Funcionalidad | Configuración inicial |
| Historias de usuario | US-68 |
| Trazabilidad | FR-05 · C10 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Media · No |
| Automatización | V3 |
| Pre-requisitos | Cuenta recién creada, con el setup a la vista (pasos 1 a 3 de CP-CFG-011).<br>Acceso de lectura a la base local para verificar el archivado. |
| Datos de prueba | Categoría: Educación |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En "¿Para qué vas a usar Biyu?", tocar "Continuar". | Pasa al paso "Tus categorías", con las 8 categorías tildadas. |
| 2 | Tocar el tilde a la derecha de "Educación" ("Destildar Educación"). | "Educación" desaparece de la lista. |
| 3 | Tocar "Continuar". | Sigue el siguiente paso ("Tus cuentas"). |
| 4 | En la base, consultar las categorías del usuario con nombre "Educación" (select name, archived_at from categories where user_id = <id>). | "Educación" queda archivada, no borrada: la fila existe con archived_at completado. |

#### CP-CFG-014 — La cuenta elegida como predeterminada viene preseleccionada *(nuevo)*

| Campo | Contenido |
|---|---|
| Funcionalidad | Configuración inicial |
| Historias de usuario | US-68, US-07 |
| Trazabilidad | FR-06 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Media · Sí |
| Automatización | V3 |
| Pre-requisitos | Setup en el paso "Tus cuentas" (por ejemplo, seguir CP-CFG-013 hasta el paso 3). |
| Datos de prueba | Cuenta: Tarjeta de débito<br>Monto del primer gasto: 1500 |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Tocar el círculo a la izquierda de "Tarjeta de débito" ("Marcar Tarjeta de débito como predeterminada"). | El círculo de "Tarjeta de débito" queda marcado. |
| 2 | Tocar "Continuar". | Se abre el registro guiado ("Registrá tu primer gasto"). |
| 3 | Escribir 1500 en el monto y tocar "Siguiente". | Pasa a la grilla de categorías. |
| 4 | Tocar el chip "Otros". | Avanza al paso de detalles. |
| 5 | Observar la sección "Cuenta". | "Tarjeta de débito" viene seleccionada. |

#### CP-CFG-015 — El setup no reaparece y se puede reabrir desde Ajustes *(nuevo)*

| Campo | Contenido |
|---|---|
| Funcionalidad | Configuración inicial |
| Historias de usuario | US-68 |
| Trazabilidad | FR-04 |
| Técnica · Tipo | Transición de estados · Límite |
| Prioridad · Camino feliz | Baja · No |
| Automatización | V3 |
| Pre-requisitos | Setup completado o salteado con una cuenta nueva (por ejemplo, al terminar CP-CFG-014 tocar "Saltear" al pie).<br>Email y contraseña de esa cuenta. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Tocar el engranaje "Ajustes" arriba a la derecha (en computadora, "Ajustes" en el menú lateral). | Se abre Ajustes con las secciones Categorías, Cuentas y Tipo de cambio de referencia. |
| 2 | Bajar hasta el final y tocar "Cerrar sesión". | Se abre /login. |
| 3 | Escribir el email y la contraseña de la cuenta y tocar "Entrar". | No aparece el setup: abre Registrar. |
| 4 | Tocar el engranaje "Ajustes" arriba a la derecha (en computadora, "Ajustes" en el menú lateral). | Se abre Ajustes con las secciones Categorías, Cuentas y Tipo de cambio de referencia. |
| 5 | Tocar "Volver a hacer la configuración inicial". | Se muestra de nuevo el setup ("¿Para qué vas a usar Biyu?"). |

### REG · Registro y baja

#### CP-REG-001 — El registro es la pantalla de inicio

| Campo | Contenido |
|---|---|
| Funcionalidad | Registro de transacciones |
| Historias de usuario | US-01 |
| Trazabilidad | FR-06 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Alta · Sí |
| Automatización | V3 |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Escribir la dirección de la app (la raíz, "/") en la barra del navegador y dar Enter. | Cae directo en /register, en el paso del monto (paso 1/3, "¿Cuánto?"). |

#### CP-REG-002 — La fecha viene precargada con hoy

| Campo | Contenido |
|---|---|
| Funcionalidad | Registro de transacciones |
| Historias de usuario | US-03 |
| Trazabilidad | FR-06 · C1 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Media · Sí |
| Automatización | Sí |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Hoy = 2026-09-28 (fijado como dato, C1). |
| Datos de prueba | Monto: 1500 |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Registrar". | Se abre Registrar en el paso 1/3 ("¿Cuánto?"), con "Gasto" y "ARS" seleccionados y el cursor en el monto. |
| 2 | Escribir 1500 en el monto. | El monto queda cargado y se habilita "Siguiente". |
| 3 | Tocar "Siguiente". | Pasa al paso 2/3 ("¿En qué?") con la grilla de categorías. |
| 4 | Tocar el chip "Otros". | Avanza al paso de detalles (ADR-024). |
| 5 | Observar la sección "Fecha". | Precargada con la fecha de hoy: "Hoy" seleccionado y el campo con 28/09/2026. |

#### CP-REG-003 — Tipo "gasto" y moneda ARS por defecto

| Campo | Contenido |
|---|---|
| Funcionalidad | Registro de transacciones |
| Historias de usuario | US-04, US-05 |
| Trazabilidad | FR-06 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Baja · Sí |
| Automatización | Sí |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Registrar". | Se abre Registrar en el paso 1/3 ("¿Cuánto?"), con "Gasto" y "ARS" seleccionados y el cursor en el monto. |
| 2 | Observar el selector de tipo (arriba) y el de moneda (junto al monto). | Tipo = Gasto; moneda = ARS; no se muestra tipo de cambio. |

#### CP-REG-004 — Elegir la categoría tocando un chip

| Campo | Contenido |
|---|---|
| Funcionalidad | Registro de transacciones |
| Historias de usuario | US-06 |
| Trazabilidad | FR-06 · I8 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Media · Sí |
| Automatización | Sí |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Categorías activas sembradas. |
| Datos de prueba | Monto: 2300<br>Categoría: Transporte |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Registrar". | Se abre Registrar en el paso 1/3 ("¿Cuánto?"), con "Gasto" y "ARS" seleccionados y el cursor en el monto. |
| 2 | Escribir 2300 en el monto y tocar "Siguiente". | Se ve la grilla de categorías, sin ningún select. |
| 3 | Tocar el chip "Transporte". | Avanza solo al paso de detalles. |
| 4 | Tocar "Guardar gasto". | Aparece "Gasto guardado". |
| 5 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Movimientos". | Se abre Movimientos del mes actual. |
| 6 | Buscar el movimiento de $2.300. | La transacción queda con la categoría "Transporte". |

#### CP-REG-005 — Una categoría archivada no se ofrece ni se acepta por API

| Campo | Contenido |
|---|---|
| Funcionalidad | Registro de transacciones |
| Historias de usuario | US-06 |
| Trazabilidad | FR-06 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Prioridad · Camino feliz | Media · No |
| Automatización | Sí |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Categoría "Salidas" archivada (ver la precondición de CP-CFG-005) y su id.<br>Para la variante API: la anon key del proyecto y el token de sesión del usuario. La llamada se hace fuera de la pantalla (Postman o curl contra /rest/v1, o la consola del navegador con el cliente de Supabase de la app). |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Registrar". | Se abre Registrar en el paso 1/3 ("¿Cuánto?"), con "Gasto" y "ARS" seleccionados y el cursor en el monto. |
| 2 | Escribir un monto (por ejemplo 1000) y tocar "Siguiente". | La grilla no muestra "Salidas". |
| 3 | Variante API: POST /rest/v1/rpc/create_transaction con p_category_id = el id de "Salidas" y el resto de los datos válidos. | Rechazado: "la categoría no existe, no es tuya o está archivada". |

#### CP-REG-006 — La cuenta viene precargada con la última usada

| Campo | Contenido |
|---|---|
| Funcionalidad | Registro de transacciones |
| Historias de usuario | US-07 |
| Trazabilidad | FR-06 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Baja · Sí |
| Automatización | Sí |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Cuenta "Visa BBVA" de tipo "Tarjeta de crédito": en Ajustes → "Cuentas", escribir "Visa BBVA" en "Nueva cuenta", elegir "Tarjeta de crédito" en "Tipo" y tocar "Crear cuenta".<br>La última transacción se guardó con "Visa BBVA": registrar un gasto cualquiera eligiendo "Visa BBVA" en "Cuenta". |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Resumen". | Se abre el Resumen. |
| 2 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Registrar". | Se abre Registrar en el paso 1/3 ("¿Cuánto?"), con "Gasto" y "ARS" seleccionados y el cursor en el monto. |
| 3 | Escribir 1000 en el monto. | El monto queda cargado y se habilita "Siguiente". |
| 4 | Tocar "Siguiente". | Pasa al paso 2/3 ("¿En qué?") con la grilla de categorías. |
| 5 | Tocar el chip "Otros". | Avanza solo al paso 3/3 ("Revisá y guardá"). |
| 6 | Observar la sección "Cuenta". | "Visa BBVA" viene seleccionada. |

#### CP-REG-007 — Guardar sin nota

| Campo | Contenido |
|---|---|
| Funcionalidad | Registro de transacciones |
| Historias de usuario | US-08 |
| Trazabilidad | FR-06 |
| Técnica · Tipo | Valores límite · Límite |
| Prioridad · Camino feliz | Baja · No |
| Automatización | Sí |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Acceso de lectura a la base local. |
| Datos de prueba | Monto: 1234 |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Registrar". | Se abre Registrar en el paso 1/3 ("¿Cuánto?"), con "Gasto" y "ARS" seleccionados y el cursor en el monto. |
| 2 | Escribir 1234 en el monto. | El monto queda cargado y se habilita "Siguiente". |
| 3 | Tocar "Siguiente". | Pasa al paso 2/3 ("¿En qué?") con la grilla de categorías. |
| 4 | Tocar el chip "Otros". | Avanza solo al paso 3/3 ("Revisá y guardá"). |
| 5 | Dejar "Nota (opcional)" vacía y tocar "Guardar gasto". | Se guarda sin error ("Gasto guardado"). |
| 6 | En la base, ver la transacción de $1.234. | description = null. |

#### CP-REG-008 — Fecha de ayer sí, fecha de mañana no

| Campo | Contenido |
|---|---|
| Funcionalidad | Registro de transacciones |
| Historias de usuario | US-09 |
| Trazabilidad | FR-06 |
| Técnica · Tipo | Valores límite · Límite |
| Prioridad · Camino feliz | Media · No |
| Automatización | Sí |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Hoy = 2026-09-28.<br>Para la variante API: la anon key del proyecto y el token de sesión del usuario. La llamada se hace fuera de la pantalla (Postman o curl contra /rest/v1, o la consola del navegador con el cliente de Supabase de la app). |
| Datos de prueba | Ayer: 2026-09-27<br>Mañana: 2026-09-29 |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Registrar". | Se abre Registrar en el paso 1/3 ("¿Cuánto?"), con "Gasto" y "ARS" seleccionados y el cursor en el monto. |
| 2 | Escribir 1000 en el monto. | El monto queda cargado y se habilita "Siguiente". |
| 3 | Tocar "Siguiente". | Pasa al paso 2/3 ("¿En qué?") con la grilla de categorías. |
| 4 | Tocar el chip "Otros". | Avanza solo al paso 3/3 ("Revisá y guardá"). |
| 5 | En "Fecha", tocar "Ayer". | La fecha pasa a 27/09/2026. |
| 6 | Tocar "Guardar gasto". | Se guarda ("Gasto guardado"). |
| 7 | Escribir 1000 en el monto. | El monto queda cargado y se habilita "Siguiente". |
| 8 | Tocar "Siguiente". | Pasa al paso 2/3 ("¿En qué?") con la grilla de categorías. |
| 9 | Tocar el chip "Otros". | Avanza solo al paso 3/3 ("Revisá y guardá"). |
| 10 | En "Fecha", tocar "Otra" y escribir 29/09/2026 (mañana) en el campo de fecha. | Rechazado: "La fecha no puede ser futura", y "Guardar gasto" queda deshabilitado. |
| 11 | Variante API: POST /rest/v1/rpc/create_transaction con p_occurred_on = mañana y el resto de los datos válidos. | Rechazado también en el servidor. |

#### CP-REG-009 — Confirmación y formulario limpio después de guardar

| Campo | Contenido |
|---|---|
| Funcionalidad | Registro de transacciones |
| Historias de usuario | US-10 |
| Trazabilidad | FR-06 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Media · Sí |
| Automatización | Sí |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos. |
| Datos de prueba | Monto: 4500<br>Cuenta: Efectivo |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Registrar". | Se abre Registrar en el paso 1/3 ("¿Cuánto?"), con "Gasto" y "ARS" seleccionados y el cursor en el monto. |
| 2 | Escribir 4500 en el monto. | El monto queda cargado y se habilita "Siguiente". |
| 3 | Tocar "Siguiente". | Pasa al paso 2/3 ("¿En qué?") con la grilla de categorías. |
| 4 | Tocar el chip "Otros". | Avanza solo al paso 3/3 ("Revisá y guardá"). |
| 5 | En "Cuenta", tocar "Efectivo". | "Efectivo" queda marcada. |
| 6 | Tocar "Guardar gasto". | Confirmación breve ("Gasto guardado"). |
| 7 | Esperar un segundo y observar el formulario. | Vuelve al paso del monto, vacío. |
| 8 | Escribir un monto, tocar "Siguiente" y tocar un chip de categoría. | En "Cuenta" viene seleccionada "Efectivo": conserva la última cuenta usada. |

#### CP-REG-010 — Monto vacío, cero o negativo no se guarda

| Campo | Contenido |
|---|---|
| Funcionalidad | Registro de transacciones |
| Historias de usuario | US-11 |
| Trazabilidad | FR-06 · I4 · C6 |
| Técnica · Tipo | Valores límite · Negativo |
| Prioridad · Camino feliz | Alta · No |
| Automatización | Sí |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Para la variante API: la anon key del proyecto y el token de sesión del usuario. La llamada se hace fuera de la pantalla (Postman o curl contra /rest/v1, o la consola del navegador con el cliente de Supabase de la app). |
| Datos de prueba | Montos: vacío · 0 · -500 · 0,01 |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Registrar". | Se abre Registrar en el paso 1/3 ("¿Cuánto?"), con "Gasto" y "ARS" seleccionados y el cursor en el monto. |
| 2 | Dejar el monto vacío. | Siguiente queda deshabilitado; no se emite ninguna escritura. |
| 3 | Escribir 0 en el monto. | Siguiente sigue deshabilitado y el campo dice por qué. |
| 4 | Borrar y escribir -500. | Siguiente sigue deshabilitado; no se emite ninguna escritura. |
| 5 | Borrar y escribir 0,01. Tocar "Siguiente", tocar el chip "Otros" y tocar "Guardar gasto". | Se acepta (mínimo válido): "Gasto guardado". |
| 6 | Variante API: POST /rest/v1/rpc/create_transaction con p_amount "0" y después "-500". | Rechazado con 23514 "I4: el monto debe ser mayor a cero". |

#### CP-REG-011 — Monto con tres decimales

| Campo | Contenido |
|---|---|
| Funcionalidad | Registro de transacciones |
| Historias de usuario | US-11 |
| Trazabilidad | FR-06 · I4 |
| Técnica · Tipo | Valores límite · Límite |
| Prioridad · Camino feliz | Media · No |
| Automatización | Sí |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos. |
| Datos de prueba | Monto: 100,999 |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Registrar". | Se abre Registrar en el paso 1/3 ("¿Cuánto?"), con "Gasto" y "ARS" seleccionados y el cursor en el monto. |
| 2 | Escribir 100,999 en el monto. | Rechazado en cliente: "El monto admite hasta 2 decimales", y "Siguiente" queda deshabilitado. |

#### CP-REG-012 — Eliminar una transacción la saca del total del mes

| Campo | Contenido |
|---|---|
| Funcionalidad | Baja lógica |
| Historias de usuario | US-65 |
| Trazabilidad | FR-08 · C10 · I10 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Alta · Sí |
| Automatización | V3 |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Transacción de $50.000 ARS en el mes actual, sin cuotas, con nota "Campera": en Registrar, escribir 50000, tocar "Siguiente", tocar "Indumentaria", tocar "Efectivo" en "Cuenta", escribir "Campera" en "Nota (opcional)" y tocar "Guardar gasto".<br>Anotar el total del mes que muestra el Resumen.<br>Acceso de lectura a la base local. |
| Datos de prueba | Nota: Campera |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Movimientos". | Se abre Movimientos del mes actual. |
| 2 | En el movimiento "Campera", tocar el tacho ("Eliminar Campera"). | Se abre el diálogo "¿Eliminar transacción?". |
| 3 | Tocar "Eliminar". | Se cierra el diálogo y aparece "Transacción eliminada". |
| 4 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Resumen". | Se abre el Resumen del mes actual. |
| 5 | Comparar "Gastado en …" con el total anotado. | El total ya no la incluye (I10): bajó $50.000. |
| 6 | En la base, ver la transacción "Campera" (select deleted_at from transactions where description = 'Campera'). | deleted_at completado: la transacción sigue existiendo, marcada como eliminada. |

#### CP-REG-013 — Eliminar una compra con cuotas en meses cerrados avisa y es retroactivo

| Campo | Contenido |
|---|---|
| Funcionalidad | Baja lógica |
| Historias de usuario | US-65, US-18 |
| Trazabilidad | FR-08 · C10 · I10 |
| Técnica · Tipo | Adivinación de errores · Límite |
| Prioridad · Camino feliz | Alta · No |
| Automatización | V3 |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Cuenta "Visa BBVA" de tipo "Tarjeta de crédito": en Ajustes → "Cuentas", escribir "Visa BBVA" en "Nueva cuenta", elegir "Tarjeta de crédito" en "Tipo" y tocar "Crear cuenta".<br>Compra de $120.000 en 12 cuotas registrada el 2026-08-15: en Registrar, escribir 120000, tocar "Siguiente", tocar "Otros", tocar "Visa BBVA", tocar "12" en "Cuotas", en "Fecha" tocar "Otra" y escribir 15/08/2026, y tocar "Guardar gasto".<br>Hoy = 2026-10-15 (agosto y septiembre cerrados): fijar la fecha del navegador (por ejemplo con el reloj simulado de Playwright, como en la ejecución 1). |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Movimientos". | Se abre Movimientos de octubre 2026, con la cuota 3/12. |
| 2 | Tocar el tacho del movimiento de la compra ("Eliminar …"). | Antes de confirmar, avisa que cambian los totales de meses cerrados (2026-08 y 2026-09): "Aviso: Esta transacción tiene imputaciones en meses ya cerrados…", con la lista de meses y el "Total meses cerrados". |
| 3 | Tocar "Eliminar". | Aparece "Transacción eliminada". |
| 4 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Resumen". | Se abre el Resumen de octubre. |
| 5 | Tocar "Mes anterior" (la flecha de la izquierda) hasta llegar a agosto 2026, y después pasar a septiembre 2026. | Todas las imputaciones dejan de contar, también las de meses cerrados: agosto y septiembre ya no incluyen sus cuotas (si no hay otros movimientos, muestran el estado vacío). |

#### CP-REG-014 — Otro usuario no puede leer ni borrar una transacción ajena

| Campo | Contenido |
|---|---|
| Funcionalidad | Autorización |
| Historias de usuario | US-48 |
| Trazabilidad | C7 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Prioridad · Camino feliz | Alta · No |
| Automatización | Sí |
| Pre-requisitos | Dos usuarios de prueba, A y B, cada uno con sus propios datos cargados, y el token de sesión de cada uno.<br>Una transacción de A y su id.<br>Para la variante API: la anon key del proyecto y el token de sesión del usuario. La llamada se hace fuera de la pantalla (Postman o curl contra /rest/v1, o la consola del navegador con el cliente de Supabase de la app). |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Con el token de B, leer esa transacción por id: GET /rest/v1/transactions?id=eq.<id>. | 0 filas. |
| 2 | Con el token de B, intentar eliminarla: POST /rest/v1/rpc/delete_transaction con p_transaction_id = <id>. | No la encuentra; la transacción de A queda intacta (sigue activa para A). |

#### CP-REG-015 — No se puede escribir en transactions salteando la RPC

| Campo | Contenido |
|---|---|
| Funcionalidad | Autorización |
| Historias de usuario | US-11 |
| Trazabilidad | C4 · I1 · I1' |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Prioridad · Camino feliz | Alta · No |
| Automatización | Sí |
| Pre-requisitos | Un usuario de prueba y su token de sesión.<br>Para la variante API: la anon key del proyecto y el token de sesión del usuario. La llamada se hace fuera de la pantalla (Postman o curl contra /rest/v1, o la consola del navegador con el cliente de Supabase de la app). |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Con el token del usuario, hacer POST /rest/v1/transactions con una fila válida (insert directo, sin la RPC). | permission denied (42501): toda escritura pasa por create_transaction (C4). |
| 2 | Repetir con POST /rest/v1/ledger_entries. | permission denied (42501). |

#### CP-REG-016 — El monto toma el foco con teclado numérico

| Campo | Contenido |
|---|---|
| Funcionalidad | Registro de transacciones |
| Historias de usuario | US-02 |
| Trazabilidad | FR-06 · NFR-07 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Media · Sí |
| Automatización | No |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Un celular real (o emulación táctil del navegador). |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Registrar". | Se abre Registrar. |
| 2 | Sin tocar nada, observar el monto y el teclado. | El monto ya tiene el foco y el teclado numérico está abierto. |

### CUO · Cuotas

#### CP-CUO-001 — Compra en 12 cuotas genera 12 imputaciones consecutivas

| Campo | Contenido |
|---|---|
| Funcionalidad | Cuotas |
| Historias de usuario | US-12 |
| Trazabilidad | FR-09 · I2 · I3 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Alta · Sí |
| Automatización | V3 |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Cuenta "Visa BBVA" de tipo "Tarjeta de crédito": en Ajustes → "Cuentas", escribir "Visa BBVA" en "Nueva cuenta", elegir "Tarjeta de crédito" en "Tipo" y tocar "Crear cuenta".<br>Acceso de lectura a la base local. |
| Datos de prueba | Monto: $120.000<br>Cuotas: 12 |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Registrar". | Se abre Registrar en el paso 1/3 ("¿Cuánto?"), con "Gasto" y "ARS" seleccionados y el cursor en el monto. |
| 2 | Escribir 120000 en el monto. | El monto queda cargado y se habilita "Siguiente". |
| 3 | Tocar "Siguiente". | Pasa al paso 2/3 ("¿En qué?") con la grilla de categorías. |
| 4 | Tocar el chip "Otros". | Avanza solo al paso 3/3 ("Revisá y guardá"). |
| 5 | En "Cuenta", tocar "Visa BBVA". | "Visa BBVA" queda marcada. |
| 6 | En "Cuotas", tocar "12". | Debajo aparece la previsualización de las 12 cuotas. |
| 7 | Tocar "Guardar gasto". | Se guarda ("Gasto guardado"). |
| 8 | En la base, consultar las imputaciones de la compra (select installment_number, period from ledger_entries where transaction_id = <id> order by 1). | 12 imputaciones numeradas 1 a 12, en meses consecutivos desde el de la compra. |

#### CP-CUO-002 — Previsualización del impacto mensual antes de guardar

| Campo | Contenido |
|---|---|
| Funcionalidad | Cuotas |
| Historias de usuario | US-13 |
| Trazabilidad | FR-09 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Alta · Sí |
| Automatización | No |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Cuenta "Visa BBVA" de tipo "Tarjeta de crédito": en Ajustes → "Cuentas", escribir "Visa BBVA" en "Nueva cuenta", elegir "Tarjeta de crédito" en "Tipo" y tocar "Crear cuenta". |
| Datos de prueba | Gasto: $120.000 en 12 cuotas con fecha 2026-08-15 |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Registrar". | Se abre Registrar en el paso 1/3 ("¿Cuánto?"), con "Gasto" y "ARS" seleccionados y el cursor en el monto. |
| 2 | Escribir 120000 en el monto. | El monto queda cargado y se habilita "Siguiente". |
| 3 | Tocar "Siguiente". | Pasa al paso 2/3 ("¿En qué?") con la grilla de categorías. |
| 4 | Tocar el chip "Otros". | Avanza solo al paso 3/3 ("Revisá y guardá"). |
| 5 | En "Cuenta", tocar "Visa BBVA". | "Visa BBVA" queda marcada. |
| 6 | En "Cuotas", tocar "12". | Debajo aparece la previsualización de las 12 cuotas. |
| 7 | En "Fecha", tocar "Otra" y escribir 15/08/2026 en el campo de fecha. | La fecha queda cargada. |
| 8 | Sin tocar "Guardar gasto", leer el recuadro debajo de "Cuotas". | Muestra "12 cuotas de $10.000 — de 2026-08 a 2027-07" antes de tocar Guardar (en pantalla: "12 cuotas de $10.000,00 · de ago 2026 a jul 2027"). |

#### CP-CUO-003 — Cambiar a una cuenta que no es crédito resetea las cuotas

| Campo | Contenido |
|---|---|
| Funcionalidad | Cuotas |
| Historias de usuario | US-14 |
| Trazabilidad | I6 |
| Técnica · Tipo | Tabla de decisión · Negativo |
| Prioridad · Camino feliz | Alta · No |
| Automatización | Sí |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Cuenta "Visa BBVA" de tipo "Tarjeta de crédito": en Ajustes → "Cuentas", escribir "Visa BBVA" en "Nueva cuenta", elegir "Tarjeta de crédito" en "Tipo" y tocar "Crear cuenta".<br>Para la variante API: la anon key del proyecto y el token de sesión del usuario. La llamada se hace fuera de la pantalla (Postman o curl contra /rest/v1, o la consola del navegador con el cliente de Supabase de la app). |
| Datos de prueba | Monto: 60000<br>Cuotas: 6 |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Registrar". | Se abre Registrar en el paso 1/3 ("¿Cuánto?"), con "Gasto" y "ARS" seleccionados y el cursor en el monto. |
| 2 | Escribir 60000 en el monto. | El monto queda cargado y se habilita "Siguiente". |
| 3 | Tocar "Siguiente". | Pasa al paso 2/3 ("¿En qué?") con la grilla de categorías. |
| 4 | Tocar el chip "Otros". | Avanza solo al paso 3/3 ("Revisá y guardá"). |
| 5 | En "Cuenta", tocar "Visa BBVA". | "Visa BBVA" queda marcada. |
| 6 | En "Cuotas", tocar "6". | Debajo aparece la previsualización de las 6 cuotas. |
| 7 | En "Cuenta", tocar "Efectivo". | El selector de cuotas desaparece, el valor vuelve a 1 y hay un aviso ("Las cuotas volvieron a 1"). |
| 8 | Variante API: POST /rest/v1/rpc/create_transaction con p_installments_count = 6 y el id de la cuenta "Efectivo" (tipo cash). | Rechazado por I6. |

#### CP-CUO-004 — División exacta: 12 cuotas iguales

| Campo | Contenido |
|---|---|
| Funcionalidad | Cuotas |
| Historias de usuario | US-15 |
| Trazabilidad | FR-10 · FR-11 · I1 · I1' · C3 |
| Técnica · Tipo | Valores límite · Positivo |
| Prioridad · Camino feliz | Alta · Sí |
| Automatización | V3 |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Cuenta "Visa BBVA" de tipo "Tarjeta de crédito": en Ajustes → "Cuentas", escribir "Visa BBVA" en "Nueva cuenta", elegir "Tarjeta de crédito" en "Tipo" y tocar "Crear cuenta".<br>Acceso de lectura a la base local. |
| Datos de prueba | Monto: $120.000 en 12 cuotas |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Registrar". | Se abre Registrar en el paso 1/3 ("¿Cuánto?"), con "Gasto" y "ARS" seleccionados y el cursor en el monto. |
| 2 | Escribir 120000 en el monto. | El monto queda cargado y se habilita "Siguiente". |
| 3 | Tocar "Siguiente". | Pasa al paso 2/3 ("¿En qué?") con la grilla de categorías. |
| 4 | Tocar el chip "Otros". | Avanza solo al paso 3/3 ("Revisá y guardá"). |
| 5 | En "Cuenta", tocar "Visa BBVA". | "Visa BBVA" queda marcada. |
| 6 | En "Cuotas", tocar "12". | Debajo aparece la previsualización de las 12 cuotas. |
| 7 | Tocar "Guardar gasto". | Se guarda ("Gasto guardado"). |
| 8 | En la base, listar los montos de las 12 imputaciones y sumarlos. | 12 imputaciones de exactamente $10.000; suma $120.000,00 (I1). |

#### CP-CUO-005 — El resto lo absorbe la última cuota

| Campo | Contenido |
|---|---|
| Funcionalidad | Cuotas |
| Historias de usuario | US-15 |
| Trazabilidad | FR-10 · FR-11 · I1 · C3 |
| Técnica · Tipo | Valores límite · Límite |
| Prioridad · Camino feliz | Alta · No |
| Automatización | V3 |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Cuenta "Visa BBVA" de tipo "Tarjeta de crédito": en Ajustes → "Cuentas", escribir "Visa BBVA" en "Nueva cuenta", elegir "Tarjeta de crédito" en "Tipo" y tocar "Crear cuenta".<br>Acceso de lectura a la base local. |
| Datos de prueba | Monto: $100.000 en 3 cuotas |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Registrar". | Se abre Registrar en el paso 1/3 ("¿Cuánto?"), con "Gasto" y "ARS" seleccionados y el cursor en el monto. |
| 2 | Escribir 100000 en el monto. | El monto queda cargado y se habilita "Siguiente". |
| 3 | Tocar "Siguiente". | Pasa al paso 2/3 ("¿En qué?") con la grilla de categorías. |
| 4 | Tocar el chip "Otros". | Avanza solo al paso 3/3 ("Revisá y guardá"). |
| 5 | En "Cuenta", tocar "Visa BBVA". | "Visa BBVA" queda marcada. |
| 6 | En "Cuotas", tocar "3". | Debajo aparece la previsualización de las 3 cuotas. |
| 7 | Leer la previsualización debajo de "Cuotas". | Muestra "3 cuotas de $33.333,33 · de <mes> a <mes>" y debajo "La última es de $33.333,34". |
| 8 | Tocar "Guardar gasto". | Se guarda ("Gasto guardado"). |
| 9 | En la base, listar los montos de las 3 imputaciones. | $33.333,33 + $33.333,33 + $33.333,34 = $100.000,00. El resto va en la última. |

#### CP-CUO-006 — Cantidad de cuotas: 0, 1, 2, 12 y 13

| Campo | Contenido |
|---|---|
| Funcionalidad | Cuotas |
| Historias de usuario | US-15, US-12 |
| Trazabilidad | FR-09 |
| Técnica · Tipo | Tabla de decisión · Límite |
| Prioridad · Camino feliz | Alta · No |
| Automatización | Sí |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Cuenta "Visa BBVA" de tipo "Tarjeta de crédito": en Ajustes → "Cuentas", escribir "Visa BBVA" en "Nueva cuenta", elegir "Tarjeta de crédito" en "Tipo" y tocar "Crear cuenta".<br>Para la variante API: la anon key del proyecto y el token de sesión del usuario. La llamada se hace fuera de la pantalla (Postman o curl contra /rest/v1, o la consola del navegador con el cliente de Supabase de la app). |
| Datos de prueba | Cuotas: 0 · 1 · 2 · 12 · 13<br>Monto: 1200 |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Registrar". | Se abre Registrar en el paso 1/3 ("¿Cuánto?"), con "Gasto" y "ARS" seleccionados y el cursor en el monto. |
| 2 | Escribir 1200 en el monto. | El monto queda cargado y se habilita "Siguiente". |
| 3 | Tocar "Siguiente". | Pasa al paso 2/3 ("¿En qué?") con la grilla de categorías. |
| 4 | Tocar el chip "Otros". | Avanza solo al paso 3/3 ("Revisá y guardá"). |
| 5 | En "Cuenta", tocar "Visa BBVA". | "Visa BBVA" queda marcada. |
| 6 | Mirar las opciones de "Cuotas". | La pantalla ofrece solo 1 a 12: no hay forma de elegir 0 ni 13 desde la UI. |
| 7 | Intentar guardar con cada cantidad: 1, 2 y 12 desde la pantalla (tocar el número y "Guardar gasto", repitiendo el registro), y 0 y 13 por API (POST /rest/v1/rpc/create_transaction con p_installments_count = 0 y = 13). | 0 rechazado; 1, 2 y 12 aceptados; 13 rechazado. |

#### CP-CUO-007 — El Resumen separa las cuotas de meses anteriores

| Campo | Contenido |
|---|---|
| Funcionalidad | Cuotas |
| Historias de usuario | US-16 |
| Trazabilidad | FR-20 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Media · Sí |
| Automatización | V3 |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Cuenta "Visa BBVA" de tipo "Tarjeta de crédito": en Ajustes → "Cuentas", escribir "Visa BBVA" en "Nueva cuenta", elegir "Tarjeta de crédito" en "Tipo" y tocar "Crear cuenta".<br>Gasto de $120.000 en 12 cuotas registrado en 2026-08 (como en la precondición de CP-REG-013) y ningún otro gasto en 2026-09. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Resumen". | Se abre el Resumen del mes actual. |
| 2 | Con "Mes anterior" / "Mes siguiente" (las flechas junto al título), ir a septiembre 2026. | La URL termina en ?period=2026-09. |
| 3 | Leer "Gastado en septiembre" y "Cuotas de meses anteriores". | El total incluye $10.000 y "Cuotas de meses anteriores" muestra $10.000. |

#### CP-CUO-008 — El listado muestra el número de cuota

| Campo | Contenido |
|---|---|
| Funcionalidad | Cuotas |
| Historias de usuario | US-17 |
| Trazabilidad | FR-20 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Baja · Sí |
| Automatización | Sí |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Compra en 12 cuotas de agosto 2026 (como en la precondición de CP-REG-013); en octubre 2026 cae la cuota 3. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Movimientos". | Se abre Movimientos del mes actual. |
| 2 | Con las flechas junto al título, ir a octubre 2026. | Se ve la imputación de la compra. |
| 3 | Mirar la fila de la compra. | Muestra "3/12" junto a la imputación. |

#### CP-CUO-009 — Borrar una compra en cuotas saca todas sus cuotas

| Campo | Contenido |
|---|---|
| Funcionalidad | Cuotas |
| Historias de usuario | US-18 |
| Trazabilidad | FR-08 · I10 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Alta · Sí |
| Automatización | V3 |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Cuenta "Visa BBVA" de tipo "Tarjeta de crédito": en Ajustes → "Cuentas", escribir "Visa BBVA" en "Nueva cuenta", elegir "Tarjeta de crédito" en "Tipo" y tocar "Crear cuenta".<br>Compra de $120.000 en 12 cuotas con fecha de hoy: registrarla eligiendo "Visa BBVA" y "12" en "Cuotas".<br>Acceso de lectura a la base local. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Movimientos". | Se abre Movimientos del mes actual, con la cuota 1/12. |
| 2 | Observar la fila de la compra. | Solo tiene la opción de eliminar la compra: no existe la opción de borrar una cuota suelta. |
| 3 | Tocar el tacho de la compra y, en el diálogo, tocar "Eliminar". | Aparece "Transacción eliminada". |
| 4 | En el Resumen, pasar con "Mes siguiente" por los meses siguientes; en la base, contar las imputaciones activas de la compra. | Las 12 imputaciones dejan de contar en todos los meses, incluidas las futuras. |

#### CP-CUO-010 — En USD, la suma en pesos de las cuotas es exacta

| Campo | Contenido |
|---|---|
| Funcionalidad | Cuotas |
| Historias de usuario | US-15 |
| Trazabilidad | C2 · I1' |
| Técnica · Tipo | Adivinación de errores · Límite |
| Prioridad · Camino feliz | Media · No |
| Automatización | Sí |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Cuenta "Visa BBVA" de tipo "Tarjeta de crédito": en Ajustes → "Cuentas", escribir "Visa BBVA" en "Nueva cuenta", elegir "Tarjeta de crédito" en "Tipo" y tocar "Crear cuenta".<br>Acceso de lectura a la base local. |
| Datos de prueba | Gasto: USD 100 en 3 cuotas con TC 1250,5555 |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Registrar". | Se abre Registrar en el paso 1/3 ("¿Cuánto?"), con "Gasto" y "ARS" seleccionados y el cursor en el monto. |
| 2 | Tocar "US$". | Aparece el campo "Tipo de cambio (ARS por US$)" debajo del monto. |
| 3 | Escribir 100 en el monto. | El monto queda cargado y se habilita "Siguiente". |
| 4 | En "Tipo de cambio (ARS por US$)", borrar el valor y escribir 1250,5555. | El campo muestra el valor nuevo. |
| 5 | Tocar "Siguiente". | Pasa al paso 2/3 ("¿En qué?") con la grilla de categorías. |
| 6 | Tocar el chip "Otros". | Avanza solo al paso 3/3 ("Revisá y guardá"). |
| 7 | En "Cuenta", tocar "Visa BBVA". | "Visa BBVA" queda marcada. |
| 8 | En "Cuotas", tocar "3". | Debajo aparece la previsualización de las 3 cuotas. |
| 9 | Tocar "Guardar gasto". | Se guarda ("Gasto guardado"). |
| 10 | En la base, sumar amount_ars de las 3 imputaciones y compararlo con amount_ars de la transacción. | Es exactamente transactions.amount_ars (I1'), sin diferencias de un centavo. |

#### CP-CUO-011 — Otro usuario no ve las cuotas de una compra ajena

| Campo | Contenido |
|---|---|
| Funcionalidad | Autorización |
| Historias de usuario | US-48 |
| Trazabilidad | C7 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Prioridad · Camino feliz | Alta · No |
| Automatización | Sí |
| Pre-requisitos | Dos usuarios de prueba, A y B, cada uno con sus propios datos cargados, y el token de sesión de cada uno.<br>Una compra en cuotas de A y su id.<br>Para la variante API: la anon key del proyecto y el token de sesión del usuario. La llamada se hace fuera de la pantalla (Postman o curl contra /rest/v1, o la consola del navegador con el cliente de Supabase de la app). |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Con el token de B, consultar las imputaciones de esa compra: GET /rest/v1/ledger_entries?transaction_id=eq.<id>. | 0 filas. |

#### CP-CUO-012 — Un ingreso no admite cuotas aunque la cuenta sea crédito

| Campo | Contenido |
|---|---|
| Funcionalidad | Cuotas |
| Historias de usuario | US-12, US-14 |
| Trazabilidad | I6 |
| Técnica · Tipo | Tabla de decisión · Negativo |
| Prioridad · Camino feliz | Alta · No |
| Automatización | Sí |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Cuenta "Visa BBVA" de tipo "Tarjeta de crédito": en Ajustes → "Cuentas", escribir "Visa BBVA" en "Nueva cuenta", elegir "Tarjeta de crédito" en "Tipo" y tocar "Crear cuenta".<br>Para la variante API: la anon key del proyecto y el token de sesión del usuario. La llamada se hace fuera de la pantalla (Postman o curl contra /rest/v1, o la consola del navegador con el cliente de Supabase de la app). |
| Datos de prueba | Monto: 50000 |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Registrar". | Se abre Registrar en el paso 1/3 ("¿Cuánto?"), con "Gasto" y "ARS" seleccionados y el cursor en el monto. |
| 2 | Tocar "Ingreso". | Queda seleccionado "Ingreso". |
| 3 | Escribir 50000 en el monto. | El monto queda cargado y se habilita "Siguiente". |
| 4 | Tocar "Siguiente". | Pasa al paso de detalles, sin elegir categoría (un ingreso no la lleva). |
| 5 | En "Cuenta", tocar "Visa BBVA". | "Visa BBVA" queda marcada. |
| 6 | Observar el paso de detalles. | No aparece el selector de cuotas. |
| 7 | Variante API: POST /rest/v1/rpc/create_transaction con p_type = "income", p_installments_count = 3 y el id de "Visa BBVA". | Rechazado por I6. |

#### CP-CUO-013 — Un fallo a mitad de create_transaction no deja datos parciales

| Campo | Contenido |
|---|---|
| Funcionalidad | Cuotas |
| Historias de usuario | US-15 |
| Trazabilidad | C4 · I1 · I1' |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Prioridad · Camino feliz | Alta · No |
| Automatización | Sí |
| Pre-requisitos | Un usuario de prueba con la cuenta "Visa BBVA" y su token de sesión.<br>Para la variante API: la anon key del proyecto y el token de sesión del usuario. La llamada se hace fuera de la pantalla (Postman o curl contra /rest/v1, o la consola del navegador con el cliente de Supabase de la app).<br>Acceso de lectura a la base local. |
| Datos de prueba | Llamada: $0,02 en 3 cuotas (la cuota base da 0) |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la base, contar las filas de transactions y ledger_entries del usuario. | Se anotan los dos números. |
| 2 | Forzar que create_transaction falle después de insertar la transacción: POST /rest/v1/rpc/create_transaction con p_amount "0.02", p_installments_count = 3 y "Visa BBVA" (la cuota base da 0 y la función falla al generar las imputaciones). | La llamada devuelve error. |
| 3 | Volver a contar filas de transactions y ledger_entries. | Cero filas nuevas en ambas: todo se revierte (C4). |

### MON · Monedas

#### CP-MON-001 — Gasto en USD con el tipo de cambio sugerido

| Campo | Contenido |
|---|---|
| Funcionalidad | Monedas |
| Historias de usuario | US-19 |
| Trazabilidad | FR-12 · I5 |
| Técnica · Tipo | Tabla de decisión · Positivo |
| Prioridad · Camino feliz | Alta · Sí |
| Automatización | V3 |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Tipo de cambio de referencia del mes actual = 1250: en Ajustes → "Tipo de cambio de referencia", elegir el mes actual en "Mes", escribir 1250 en "ARS por USD" y tocar "Guardar tipo de cambio".<br>Acceso de lectura a la base local. |
| Datos de prueba | Monto: USD 100 |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Registrar". | Se abre Registrar en el paso 1/3 ("¿Cuánto?"), con "Gasto" y "ARS" seleccionados y el cursor en el monto. |
| 2 | Tocar "US$". | Aparece "Tipo de cambio (ARS por US$)" con 1250 sugerido. |
| 3 | Escribir 100 en el monto, sin tocar el tipo de cambio. Tocar "Siguiente". | Pasa a la grilla de categorías. |
| 4 | Tocar el chip "Otros" y después "Guardar gasto". | Aparece "Gasto guardado". |
| 5 | En la base, ver la transacción. | Se guarda con fx_rate = 1250 y amount_ars = 125.000. |

#### CP-MON-002 — Tabla de decisión de moneda y tipo de cambio (6 filas)

| Campo | Contenido |
|---|---|
| Funcionalidad | Monedas |
| Historias de usuario | US-19 |
| Trazabilidad | FR-12 · I5 |
| Técnica · Tipo | Tabla de decisión · Negativo |
| Prioridad · Camino feliz | Alta · No |
| Automatización | Sí |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Se ejecuta primero sin referencia del mes (filas 5 y 6) y después con 1250 (filas 1 a 4): ver la precondición de CP-MON-001.<br>Para la variante API: la anon key del proyecto y el token de sesión del usuario. La llamada se hace fuera de la pantalla (Postman o curl contra /rest/v1, o la consola del navegador con el cliente de Supabase de la app). |
| Datos de prueba | Filas: ARS sin TC · ARS con TC · USD con referencia sin override · USD con referencia con override · USD sin referencia sin TC · USD sin referencia con TC |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Fila 5 (USD sin referencia, sin TC): en Registrar, tocar "US$" y escribir 100 en el monto, dejando vacío el tipo de cambio. | Aviso "No tenés un tipo de cambio configurado para este mes." con "Ir a Ajustes"; "Siguiente" deshabilitado. |
| 2 | Fila 6 (USD sin referencia, con TC): escribir 1300 en "Tipo de cambio (ARS por US$)", tocar "Siguiente", tocar "Otros" y "Guardar gasto". | Se guarda. |
| 3 | Cargar la referencia del mes en 1250 (en Ajustes, como en CP-MON-001). | La referencia queda guardada. |
| 4 | Fila 1 (ARS sin TC): registrar un gasto en ARS normal. Fila 3 (USD con referencia sin override): tocar "US$", dejar 1250 y guardar. Fila 4 (USD con referencia con override): tocar "US$", cambiar a 1300 y guardar. | Se guardan las filas 1, 3 y 4. |
| 5 | Fila 2 (ARS con TC): no se puede armar por la pantalla, porque en ARS no aparece el campo de tipo de cambio. Se prueba por API en el paso siguiente. | La pantalla no ofrece tipo de cambio en ARS. |
| 6 | Variante API: filas 2 (p_currency "ARS" con p_fx_rate) y 5 (p_currency "USD" sin p_fx_rate) contra create_transaction. | Se guardan las filas 1, 3, 4 y 6. Se rechazan la 2 (ARS con TC, I5) y la 5 (USD sin ningún TC, con mensaje que pide el tipo de cambio). Mismo rechazo por API (I5). |

#### CP-MON-003 — Pisar el tipo de cambio sugerido

| Campo | Contenido |
|---|---|
| Funcionalidad | Monedas |
| Historias de usuario | US-20, US-21 |
| Trazabilidad | FR-12 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Media · Sí |
| Automatización | Sí |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Tipo de cambio de referencia del mes actual = 1250: en Ajustes → "Tipo de cambio de referencia", elegir el mes actual en "Mes", escribir 1250 en "ARS por USD" y tocar "Guardar tipo de cambio".<br>Acceso de lectura a la base local. |
| Datos de prueba | TC propio: 1300 |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Registrar". | Se abre Registrar en el paso 1/3 ("¿Cuánto?"), con "Gasto" y "ARS" seleccionados y el cursor en el monto. |
| 2 | Tocar "US$". | El campo sugiere 1250. |
| 3 | Borrar el tipo de cambio y escribir 1300. | Aparece "Estás usando un valor distinto al de referencia. Se aplica solo a esta transacción." |
| 4 | Escribir 100 en el monto, tocar "Siguiente", tocar "Otros" y "Guardar gasto". | Aparece "Gasto guardado". |
| 5 | En la base, ver la transacción. | Se guarda con fx_rate = 1300. |

#### CP-MON-004 — Cambiar la referencia no altera lo ya guardado

| Campo | Contenido |
|---|---|
| Funcionalidad | Monedas |
| Historias de usuario | US-22 |
| Trazabilidad | C5 · ADR-002 |
| Técnica · Tipo | Adivinación de errores · Positivo |
| Prioridad · Camino feliz | Alta · No |
| Automatización | V3 |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Gasto de USD 100 guardado con fx_rate = 1250 (amount_ars = 125.000): seguir CP-MON-001.<br>Anotar el total del mes que muestra el Resumen. |
| Datos de prueba | Nueva referencia: 1400 |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Tocar el engranaje "Ajustes" arriba a la derecha (en computadora, "Ajustes" en el menú lateral). | Se abre Ajustes con las secciones Categorías, Cuentas y Tipo de cambio de referencia. |
| 2 | En "Tipo de cambio de referencia", con el mes actual en "Mes", escribir 1400 en "ARS por USD" y tocar "Guardar tipo de cambio". | Se guarda: la lista muestra $ 1.400,00 para el mes. |
| 3 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Movimientos". | Se abre Movimientos del mes actual. |
| 4 | Ver la transacción de USD 100. | La transacción sigue valiendo $125.000. |
| 5 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Resumen". | Se abre el Resumen del mes actual. |
| 6 | Comparar "Gastado en …" con el total anotado. | El total no cambia. |

#### CP-MON-005 — El total del mes en pesos incluye lo gastado en dólares

| Campo | Contenido |
|---|---|
| Funcionalidad | Monedas |
| Historias de usuario | US-23 |
| Trazabilidad | FR-20 · I1' |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Alta · Sí |
| Automatización | V3 |
| Pre-requisitos | Usuario nuevo, sin otros gastos en el mes (para que el total sea solo esto). Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Tipo de cambio de referencia del mes actual = 1250: en Ajustes → "Tipo de cambio de referencia", elegir el mes actual en "Mes", escribir 1250 en "ARS por USD" y tocar "Guardar tipo de cambio".<br>Un gasto de $50.000 ARS: en Registrar, escribir 50000, tocar "Siguiente", tocar "Comida y supermercado", tocar "Efectivo" y "Guardar gasto".<br>Uno de USD 100 a 1250 en el mismo mes: en Registrar, tocar "US$", escribir 100 (el TC sugerido es 1250), tocar "Siguiente", tocar "Transporte" y "Guardar gasto". |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Resumen". | Se abre el Resumen del mes actual. |
| 2 | Leer el total "Gastado en …". | $175.000 ($50.000 + $125.000). |

#### CP-MON-006 — El gasto en dólares se ve por separado

| Campo | Contenido |
|---|---|
| Funcionalidad | Monedas |
| Historias de usuario | US-24 |
| Trazabilidad | FR-20 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Baja · Sí |
| Automatización | Sí |
| Pre-requisitos | Los datos de CP-MON-005 (gasto de USD 100 en el mes).<br>Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Resumen". | Se abre el Resumen del mes actual. |
| 2 | Mirar la tarjeta verde, debajo del total. | Muestra "USD 100" por separado del total en ARS. |

#### CP-MON-007 — Otro usuario no lee ni modifica el tipo de cambio ajeno

| Campo | Contenido |
|---|---|
| Funcionalidad | Autorización |
| Historias de usuario | US-48 |
| Trazabilidad | C7 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Prioridad · Camino feliz | Alta · No |
| Automatización | Sí |
| Pre-requisitos | Dos usuarios de prueba, A y B, cada uno con sus propios datos cargados, y el token de sesión de cada uno.<br>fx_rates de A para el mes actual (A cargó su referencia en Ajustes).<br>Para la variante API: la anon key del proyecto y el token de sesión del usuario. La llamada se hace fuera de la pantalla (Postman o curl contra /rest/v1, o la consola del navegador con el cliente de Supabase de la app). |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Con el token de B, leer esa fila: GET /rest/v1/fx_rates?user_id=eq.<id de A>. | 0 filas al leer. |
| 2 | Con el token de B, actualizarla: PATCH /rest/v1/fx_rates?user_id=eq.<id de A> con ars_per_usd = 1. | El update afecta 0 filas; el tipo de cambio de A no cambia. |

### DAS · Dashboard

#### CP-DAS-001 — El Resumen abre en el mes actual con su total

| Campo | Contenido |
|---|---|
| Funcionalidad | Dashboard |
| Historias de usuario | US-25 |
| Trazabilidad | FR-20 · I10 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Alta · Sí |
| Automatización | V3 |
| Pre-requisitos | Los datos de CP-MON-005 (transacciones en el mes actual).<br>Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Resumen". | Se abre /dashboard. |
| 2 | Sin tocar el selector de mes, leer el título de la tarjeta verde y el total. | Muestra el total gastado del mes actual ("Gastado en <mes actual>"). |

#### CP-DAS-002 — El mes elegido vive en la URL

| Campo | Contenido |
|---|---|
| Funcionalidad | Dashboard |
| Historias de usuario | US-26 |
| Trazabilidad | FR-21 · C11 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Alta · Sí |
| Automatización | Sí |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Escribir en la barra del navegador la dirección de la app seguida de /dashboard?period=2026-09 y dar Enter. | Se abre el Resumen de septiembre 2026. |
| 2 | Tocar "Mes siguiente" (la flecha de la derecha, junto al título) dos veces. | La URL pasa a period=2026-11. |

#### CP-DAS-003 — Período inválido o ausente cae al mes actual

| Campo | Contenido |
|---|---|
| Funcionalidad | Dashboard |
| Historias de usuario | US-26 |
| Trazabilidad | C11 |
| Técnica · Tipo | Adivinación de errores · Límite |
| Prioridad · Camino feliz | Media · No |
| Automatización | Sí |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Escribir en la barra del navegador la dirección de la app seguida de /dashboard?period=fecha-invalida y dar Enter. | Cae al mes actual sin error visible y corrige la URL. |
| 2 | Escribir la dirección de la app seguida de /dashboard, sin parámetro, y dar Enter. | Ídem. |

#### CP-DAS-004 — Gasto por categoría en barras

| Campo | Contenido |
|---|---|
| Funcionalidad | Dashboard |
| Historias de usuario | US-27 |
| Trazabilidad | FR-20 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Media · Sí |
| Automatización | Sí |
| Pre-requisitos | Usuario nuevo, sin otros gastos en el mes. Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Gastos en 3 categorías en el mes actual, registrados desde Registrar: Salud $70.000, Comida y supermercado $50.000, Transporte $30.000. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Resumen". | Se abre el Resumen del mes actual. |
| 2 | Bajar hasta "Por categoría" y mirar el gráfico. | Una barra por categoría con su total, ordenadas de mayor a menor. |

#### CP-DAS-005 — Gasto por cuenta

| Campo | Contenido |
|---|---|
| Funcionalidad | Dashboard |
| Historias de usuario | US-28 |
| Trazabilidad | FR-20 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Media · Sí |
| Automatización | Sí |
| Pre-requisitos | Usuario nuevo, sin otros gastos en el mes. Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Gastos en 2 cuentas en el mes actual, registrados desde Registrar eligiendo la cuenta en "Cuenta": Efectivo $120.000 (en uno o más gastos), Tarjeta de débito $30.000. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Resumen". | Se abre el Resumen del mes actual. |
| 2 | Bajar hasta "Por cuenta" y leer los totales. | Cada total coincide con la suma manual de sus transacciones. |

#### CP-DAS-006 — Ingresos y balance positivo

| Campo | Contenido |
|---|---|
| Funcionalidad | Dashboard |
| Historias de usuario | US-29 |
| Trazabilidad | FR-20 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Media · Sí |
| Automatización | Sí |
| Pre-requisitos | Usuario nuevo, sin otros movimientos en el mes. Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Gastos por $150.000 en el mes actual (por ejemplo los de CP-DAS-004).<br>Un ingreso de $200.000: en Registrar, tocar "Ingreso", escribir 200000, tocar "Siguiente", tocar "Cuenta bancaria" y "Guardar ingreso". |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Resumen". | Se abre el Resumen del mes actual. |
| 2 | Leer las tarjetas "Ingresos" y "Balance". | Ingresos $200.000; balance +$50.000. |

#### CP-DAS-007 — Balance negativo con signo explícito

| Campo | Contenido |
|---|---|
| Funcionalidad | Dashboard |
| Historias de usuario | US-29 |
| Trazabilidad | FR-20 |
| Técnica · Tipo | Valores límite · Límite |
| Prioridad · Camino feliz | Baja · No |
| Automatización | Sí |
| Pre-requisitos | Usuario nuevo, sin otros movimientos en el mes. Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Un gasto de $200.000 (Registrar → 200000 → "Siguiente" → "Servicios" → "Guardar gasto") y un ingreso de $50.000 (Registrar → "Ingreso" → 50000 → "Siguiente" → "Guardar ingreso"). |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Resumen". | Se abre el Resumen del mes actual. |
| 2 | Leer la tarjeta "Balance". | -$150.000, con signo negativo explícito. |

#### CP-DAS-008 — Últimos 10 movimientos con acceso a la lista completa

| Campo | Contenido |
|---|---|
| Funcionalidad | Dashboard |
| Historias de usuario | US-31 |
| Trazabilidad | FR-20 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Media · Sí |
| Automatización | Sí |
| Pre-requisitos | Usuario nuevo. Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>15 transacciones en el mes actual, registradas desde Registrar (15 gastos cualquiera, por ejemplo de $1.000 a $15.000). |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Resumen". | Se abre el Resumen del mes actual. |
| 2 | Bajar hasta "Últimos movimientos" y contar las filas. | Muestra 10. |
| 3 | Tocar "Ver todos". | Abre Movimientos del mes con las 15. |

#### CP-DAS-009 — Una cuota heredada no cuenta como día con registro

| Campo | Contenido |
|---|---|
| Funcionalidad | Dashboard |
| Historias de usuario | US-32 |
| Trazabilidad | FR-20 |
| Técnica · Tipo | Adivinación de errores · Límite |
| Prioridad · Camino feliz | Baja · No |
| Automatización | Sí |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Compra en 12 cuotas de agosto 2026 (como en la precondición de CP-REG-013); en diciembre 2026 solo cae su cuota. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Resumen". | Se abre el Resumen del mes actual. |
| 2 | Con "Mes siguiente" (la flecha de la derecha), ir a diciembre 2026. | Se ve el Resumen de diciembre, con la cuota de la compra en el total. |
| 3 | Leer "días con registro" en la tarjeta verde. | 0 días. |

#### CP-DAS-010 — Mes sin datos: estado vacío con acceso al registro

| Campo | Contenido |
|---|---|
| Funcionalidad | Dashboard |
| Historias de usuario | US-33 |
| Trazabilidad | FR-20 |
| Técnica · Tipo | Caso de uso · Límite |
| Prioridad · Camino feliz | Media · No |
| Automatización | Sí |
| Pre-requisitos | Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.<br>Un mes sin ninguna transacción (por ejemplo mayo 2026). |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Resumen". | Se abre el Resumen del mes actual. |
| 2 | Con "Mes anterior" (la flecha de la izquierda), ir a ese mes. | Mensaje claro y un botón a /register, no un dashboard de ceros: "No tenés movimientos registrados en <mes>." y "Registrar un gasto". |
| 3 | Tocar "Registrar un gasto". | Se abre Registrar (/register). |

#### CP-DAS-011 — El Resumen de un usuario nunca muestra datos de otro

| Campo | Contenido |
|---|---|
| Funcionalidad | Autorización |
| Historias de usuario | US-48 |
| Trazabilidad | C7 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Prioridad · Camino feliz | Alta · No |
| Automatización | Sí |
| Pre-requisitos | Dos usuarios de prueba, A y B, cada uno con sus propios datos cargados, y el token de sesión de cada uno.<br>Resumen de A con datos en el mes actual.<br>Para la variante API: la anon key del proyecto y el token de sesión del usuario. La llamada se hace fuera de la pantalla (Postman o curl contra /rest/v1, o la consola del navegador con el cliente de Supabase de la app). |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Con el token de B, repetir las consultas del Resumen filtrando por A: GET /rest/v1/ledger_entries?user_id=eq.<id de A>&period=eq.<mes actual>. | 0 filas. |
| 2 | Con el token de B, hacer la misma consulta sin filtrar por usuario. | Solo devuelve filas de B: ninguna de A. |

## Supuestos

1. Los 68 casos conservan el oráculo del catálogo del repo; donde el rediseño (ADR-023/024) cambió el camino en pantalla se reescribió el paso, no el resultado esperado.
2. "Creado por": el catálogo se diseñó con la skill `/new-test-case` a partir de la spec y lo revisó el agente `spec-critic` (`docs/10-catalogo-casos-v1.md` §Revisión). No hay registro de qué integrante diseñó cada caso, así que no se asigna uno por caso.
3. Los 6 casos nuevos (US-66, US-68) se diseñaron en esta entrega desde los criterios de aceptación de sus issues.
