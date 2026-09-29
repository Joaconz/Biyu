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
| Pre-requisitos | Navegador sin sesión de Biyu (almacenamiento vacío). |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir la raíz de la app (/). | Redirige a /login?next=%2Fregister. |
| 2 | Observar la pantalla. | Se ve el formulario "Entrar"; no se renderiza nada de /register. |

#### CP-ACC-002 — Una ruta privada abierta sin sesión conserva el destino

| Campo | Contenido |
|---|---|
| Funcionalidad | Acceso |
| Historias de usuario | US-48 |
| Trazabilidad | FR-02 · C7 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Prioridad · Camino feliz | Alta · No |
| Automatización | Sí |
| Pre-requisitos | Sin sesión. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Navegar directo a /settings, sin pasar por /login. | Redirige a /login?next=%2Fsettings, conservando el destino original. |

#### CP-ACC-003 — Crear una cuenta con email y contraseña válidos

| Campo | Contenido |
|---|---|
| Funcionalidad | Registro de usuario |
| Historias de usuario | US-50, US-51 |
| Trazabilidad | FR-01 · ADR-011 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Alta · Sí |
| Automatización | V3 |
| Pre-requisitos | Email sin cuenta previa. |
| Datos de prueba | Email: nueva@test.local (uno nuevo por corrida)<br>Contraseña: Clave123! |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ir a /signup. | Se ve "Crear cuenta" con los criterios de contraseña. |
| 2 | Completar email, contraseña y "Confirmar contraseña" con el mismo valor. | Los criterios se marcan como cumplidos; las contraseñas se ven enmascaradas. |
| 3 | Tocar "Crear cuenta". | Cuenta creada con sesión activa, sin paso de confirmación por email (ADR-011); redirige a /register. |

#### CP-ACC-004 — Contraseñas que no cumplen los criterios se rechazan

| Campo | Contenido |
|---|---|
| Funcionalidad | Registro de usuario |
| Historias de usuario | US-50, US-67 |
| Trazabilidad | FR-01 |
| Técnica · Tipo | Tabla de decisión · Negativo |
| Prioridad · Camino feliz | Alta · No |
| Automatización | Sí |
| Pre-requisitos | Emails sin cuenta previa. |
| Datos de prueba | (a): abc1234 — 7 caracteres<br>(b): abcdefgh — solo minúsculas<br>(c): 12345678 — solo números<br>(d): abcd1234 — sin mayúscula ni especial<br>(e): Abcd123! — cumple los 5 criterios |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Intentar crear cuenta con (a), (b), (c) y (d). | Cada una se rechaza con un mensaje que dice qué criterio falta. No se crea la cuenta. |
| 2 | Intentar crear cuenta con (e). | Se acepta. |
| 3 | Variante API: POST /auth/v1/signup con (d), sin pasar por el formulario. | Rechazada: FR-01 pide validar también en el servidor. |

#### CP-ACC-005 — No se puede crear una cuenta con un email ya registrado

| Campo | Contenido |
|---|---|
| Funcionalidad | Registro de usuario |
| Historias de usuario | US-50 |
| Trazabilidad | FR-01 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Prioridad · Camino feliz | Alta · No |
| Automatización | Sí |
| Pre-requisitos | Ya existe una cuenta con el email de prueba (la de CP-ACC-003). |
| Datos de prueba | Email: el de CP-ACC-003 |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ir a /signup y completar el formulario con ese email. | Los datos se cargan. |
| 2 | Tocar "Crear cuenta". | Mensaje "Ya existe una cuenta con ese email". No se crea una segunda cuenta. |
| 3 | Variante API: POST /auth/v1/signup con el mismo email. | Error user_already_exists / email_exists. |

#### CP-ACC-006 — Credenciales inválidas en el login, sin arrastrar el error al signup

| Campo | Contenido |
|---|---|
| Funcionalidad | Inicio de sesión |
| Historias de usuario | US-48, US-50 |
| Trazabilidad | FR-01 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Prioridad · Camino feliz | Media · No |
| Automatización | Sí |
| Pre-requisitos | Email sin cuenta, o contraseña incorrecta para una que existe. |
| Datos de prueba | Email: noexiste@test.local |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ir a /login, completar credenciales inválidas y tocar "Entrar". | Mensaje "Email o contraseña incorrectos". |
| 2 | Sin recargar, tocar "Crear una cuenta". | En /signup el error anterior no aparece. |

#### CP-ACC-007 — Alta sin sesión (confirmación de email activa) no entra a la app

| Campo | Contenido |
|---|---|
| Funcionalidad | Registro de usuario |
| Historias de usuario | US-51 |
| Trazabilidad | FR-01 · ADR-011 |
| Técnica · Tipo | Adivinación de errores · Límite |
| Prioridad · Camino feliz | Media · No |
| Automatización | No |
| Pre-requisitos | Hipotético: "Confirm email" activo en Supabase, de modo que signUp() no devuelve sesión. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Completar el signup con datos válidos. | Los datos se cargan. |
| 2 | Enviar, con la respuesta de signup sin sesión. | No se redirige a una ruta protegida; se muestra "Te creamos la cuenta, pero hace falta confirmar el email antes de entrar." |

#### CP-ACC-008 — Una cuenta nueva tiene el catálogo inicial sembrado

| Campo | Contenido |
|---|---|
| Funcionalidad | Configuración |
| Historias de usuario | US-43, US-51 |
| Trazabilidad | FR-04 · ADR-014 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Alta · Sí |
| Automatización | V3 |
| Pre-requisitos | Cuenta recién creada por /signup. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Completar el signup. | La app entra a /register. |
| 2 | Ir a Ajustes. | Están las 8 categorías (Comida y supermercado, Transporte, Servicios, Entretenimiento, Salud, Educación, Indumentaria, Otros) y las 5 cuentas de FR-04. |

#### CP-ACC-009 — Cerrar sesión y no poder volver con "atrás"

| Campo | Contenido |
|---|---|
| Funcionalidad | Cierre de sesión |
| Historias de usuario | US-64 |
| Trazabilidad | FR-03 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Alta · Sí |
| Automatización | V3 |
| Pre-requisitos | Sesión activa en /register, /dashboard o /transactions. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Desde cada pantalla, abrir Ajustes y tocar "Cerrar sesión". | La sesión se cierra y redirige a /login. |
| 2 | Tocar "atrás" en el navegador. | No se recupera el acceso: cae otra vez en /login. |

#### CP-ACC-010 — La sesión persiste al recargar y al reabrir el navegador

| Campo | Contenido |
|---|---|
| Funcionalidad | Acceso |
| Historias de usuario | US-49 |
| Trazabilidad | FR-03 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Media · Sí |
| Automatización | No |
| Pre-requisitos | Sesión activa. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Recargar la pestaña (F5). | Sigue en /register sin pedir login. |
| 2 | Cerrar y reabrir el navegador en la misma URL. | La sesión persiste (localStorage). |

#### CP-ACC-011 — Aislamiento entre usuarios en todas las tablas (par de autorización)

| Campo | Contenido |
|---|---|
| Funcionalidad | Autorización |
| Historias de usuario | US-48 |
| Trazabilidad | C7 · NFR-13 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Prioridad · Camino feliz | Alta · No |
| Automatización | Sí |
| Pre-requisitos | Usuarios A y B, cada uno con sus datos. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Con la sesión de B, consultar cada tabla filtrando por A. | B ve 0 filas de A en categories, accounts, fx_rates, transactions, ledger_entries, debts y subscriptions. |
| 2 | Con el rol anon (sin sesión), consultar cada tabla. | permission denied (42501) en todas. |

#### CP-ACC-012 — Contraseña y confirmación distintas bloquean el alta *(nuevo)*

| Campo | Contenido |
|---|---|
| Funcionalidad | Registro de usuario |
| Historias de usuario | US-66 |
| Trazabilidad | FR-01 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Prioridad · Camino feliz | Alta · No |
| Automatización | Sí |
| Pre-requisitos | Email sin cuenta previa. |
| Datos de prueba | Contraseña: Clave123!<br>Confirmar contraseña: Clave123? |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ir a /signup y completar email, contraseña y una confirmación distinta. | Los dos campos se ven enmascarados. |
| 2 | Tocar "Crear cuenta". | Mensaje "Las contraseñas no son iguales". No se crea la cuenta. |

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
| Pre-requisitos | Usuario con categorías sembradas. |
| Datos de prueba | Nombre: Mascotas |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ir a Ajustes, completar "Mascotas" y elegir un color de la paleta. | El nombre y el color quedan cargados. |
| 2 | Tocar "Crear categoría". | Aparece en el listado activo con ese nombre y color. |

#### CP-CFG-002 — Renombrar una categoría y cambiarle el color

| Campo | Contenido |
|---|---|
| Funcionalidad | Categorías |
| Historias de usuario | US-42 |
| Trazabilidad | FR-05 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Media · Sí |
| Automatización | V3 |
| Pre-requisitos | Categoría "Comida y supermercado" activa. |
| Datos de prueba | Nombre nuevo: Comida |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Tocar "Editar" en "Comida y supermercado". | Se abre la edición en línea. |
| 2 | Cambiar el nombre a "Comida" y el color; tocar "Guardar". | El listado muestra el nombre y el color nuevos, sin crear una fila nueva. |

#### CP-CFG-003 — No se permiten dos categorías activas con el mismo nombre

| Campo | Contenido |
|---|---|
| Funcionalidad | Categorías |
| Historias de usuario | US-42 |
| Trazabilidad | FR-05 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Prioridad · Camino feliz | Media · No |
| Automatización | Sí |
| Pre-requisitos | Existe la categoría activa "Salud". |
| Datos de prueba | Nombre: Salud |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Intentar crear otra categoría "Salud". | Rechazado con "Ya existe una categoría activa con ese nombre". |
| 2 | Variante API: insert directo a categories con el mismo nombre. | Error 23505 (unique_violation). |

#### CP-CFG-004 — Archivar una categoría con historia

| Campo | Contenido |
|---|---|
| Funcionalidad | Categorías |
| Historias de usuario | US-44 |
| Trazabilidad | FR-05 · C10 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Alta · Sí |
| Automatización | V3 |
| Pre-requisitos | "Entretenimiento" con al menos una transacción que la usa. |
| Datos de prueba | Transacción: $8.000, nota "Cine" |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Archivar "Entretenimiento" en Ajustes. | Desaparece del listado activo. |
| 2 | Abrir el registro. | No aparece en la grilla de categorías. |
| 3 | Abrir la transacción histórica en Movimientos. | Conserva su categoría y la muestra con una marca de archivada. |

#### CP-CFG-005 — Reusar el nombre de una categoría archivada

| Campo | Contenido |
|---|---|
| Funcionalidad | Categorías |
| Historias de usuario | US-42, US-44 |
| Trazabilidad | FR-05 |
| Técnica · Tipo | Tabla de decisión · Límite |
| Prioridad · Camino feliz | Baja · No |
| Automatización | Sí |
| Pre-requisitos | Categoría "Salidas" archivada y ninguna activa con ese nombre. |
| Datos de prueba | Nombre: Salidas |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Crear una categoría nueva "Salidas". | Se permite: el índice único solo cuenta las activas. |

#### CP-CFG-006 — Crear una cuenta de tarjeta de crédito

| Campo | Contenido |
|---|---|
| Funcionalidad | Cuentas |
| Historias de usuario | US-45 |
| Trazabilidad | FR-05 · I6 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Alta · Sí |
| Automatización | V3 |
| Pre-requisitos | Usuario con cuentas sembradas. |
| Datos de prueba | Nombre: Visa BBVA<br>Tipo: Tarjeta de crédito<br>Moneda: ARS |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Ajustes, completar nombre, tipo y moneda; tocar "Crear cuenta". | Aparece con el tipo en español ("Tarjeta de crédito"). |
| 2 | En el registro, elegir esa cuenta para un gasto. | Se ofrece el selector de cuotas (I6). |

#### CP-CFG-007 — No se permiten dos cuentas activas con el mismo nombre

| Campo | Contenido |
|---|---|
| Funcionalidad | Cuentas |
| Historias de usuario | US-45 |
| Trazabilidad | FR-05 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Prioridad · Camino feliz | Media · No |
| Automatización | Sí |
| Pre-requisitos | Existe la cuenta activa "Efectivo". |
| Datos de prueba | Nombre: Efectivo |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Intentar crear otra cuenta "Efectivo". | Rechazado con "Ya existe una cuenta activa con ese nombre". |
| 2 | Variante API: insert directo a accounts. | Error 23505. |

#### CP-CFG-008 — La siembra concurrente no duplica el catálogo

| Campo | Contenido |
|---|---|
| Funcionalidad | Configuración |
| Historias de usuario | US-43 |
| Trazabilidad | FR-04 · ADR-014 |
| Técnica · Tipo | Adivinación de errores · Límite |
| Prioridad · Camino feliz | Alta · No |
| Automatización | No |
| Pre-requisitos | Usuario recién creado, todavía sin sembrar. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir /register en dos pestañas al mismo tiempo. | Las dos cargan el formulario. |
| 2 | Contar categorías y cuentas del usuario. | Exactamente 8 y 5: sin duplicados. |

#### CP-CFG-009 — Cargar y actualizar el tipo de cambio de referencia del mes

| Campo | Contenido |
|---|---|
| Funcionalidad | Tipo de cambio |
| Historias de usuario | US-46 |
| Trazabilidad | FR-12 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Alta · Sí |
| Automatización | V3 |
| Pre-requisitos | El mes actual sin tipo de cambio cargado. |
| Datos de prueba | TC 1: 1250<br>TC 2: 1300 |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Ajustes, elegir el mes actual, cargar 1250 y guardar. | Se crea la referencia del mes. |
| 2 | Volver a cargar el mismo mes con 1300. | Se actualiza a 1300, sin duplicar la fila. |

#### CP-CFG-010 — Tipo de cambio de referencia en cero o negativo

| Campo | Contenido |
|---|---|
| Funcionalidad | Tipo de cambio |
| Historias de usuario | US-46 |
| Trazabilidad | FR-12 |
| Técnica · Tipo | Valores límite · Límite |
| Prioridad · Camino feliz | Media · No |
| Automatización | Sí |
| Pre-requisitos | Ninguna. |
| Datos de prueba | Valores: 0 · -100 · 0,01 |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Cargar 0 y después -100. | Rechazados con "El tipo de cambio debe ser mayor a cero". |
| 2 | Cargar 0,01. | Aceptado (mínimo válido). |
| 3 | Variante API: upsert directo a fx_rates y RPC upsert_fx_rate con 0 y -100. | Rechazados por la base. |

#### CP-CFG-011 — Después de crear la cuenta aparece la configuración inicial *(nuevo)*

| Campo | Contenido |
|---|---|
| Funcionalidad | Configuración inicial |
| Historias de usuario | US-68 |
| Trazabilidad | FR-04 · FR-05 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Alta · Sí |
| Automatización | V3 |
| Pre-requisitos | Email sin cuenta previa. |
| Datos de prueba | Contraseña: Clave123! |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Crear una cuenta en /signup. | La cuenta se crea. |
| 2 | Observar la pantalla siguiente. | Se muestra el setup (elementos con data-testid "setup-"), con los pasos "para qué la usás", categorías, cuentas y primer gasto. |

#### CP-CFG-012 — Saltear todo el setup deja la siembra de siempre *(nuevo)*

| Campo | Contenido |
|---|---|
| Funcionalidad | Configuración inicial |
| Historias de usuario | US-68, US-43 |
| Trazabilidad | FR-04 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Media · No |
| Automatización | V3 |
| Pre-requisitos | Cuenta recién creada, con el setup a la vista. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Tocar "Saltear" en cada paso. | El setup termina y la app abre en Registrar. |
| 2 | Ir a Ajustes. | Quedan las 8 categorías y 5 cuentas sembradas (US-43). |

#### CP-CFG-013 — Destildar una categoría en el setup la archiva *(nuevo)*

| Campo | Contenido |
|---|---|
| Funcionalidad | Configuración inicial |
| Historias de usuario | US-68 |
| Trazabilidad | FR-05 · C10 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Media · No |
| Automatización | V3 |
| Pre-requisitos | Setup en el paso de categorías. |
| Datos de prueba | Categoría: Educación |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Destildar "Educación" y continuar. | Sigue el siguiente paso. |
| 2 | Consultar las categorías del usuario. | "Educación" queda archivada, no borrada. |

#### CP-CFG-014 — La cuenta elegida como predeterminada viene preseleccionada *(nuevo)*

| Campo | Contenido |
|---|---|
| Funcionalidad | Configuración inicial |
| Historias de usuario | US-68, US-07 |
| Trazabilidad | FR-06 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Media · Sí |
| Automatización | V3 |
| Pre-requisitos | Setup en el paso de cuentas. |
| Datos de prueba | Cuenta: Tarjeta de débito |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Marcar "Tarjeta de débito" como predeterminada y seguir al primer gasto. | Se abre el registro guiado. |
| 2 | Llegar al paso de detalles. | "Tarjeta de débito" viene seleccionada. |

#### CP-CFG-015 — El setup no reaparece y se puede reabrir desde Ajustes *(nuevo)*

| Campo | Contenido |
|---|---|
| Funcionalidad | Configuración inicial |
| Historias de usuario | US-68 |
| Trazabilidad | FR-04 |
| Técnica · Tipo | Transición de estados · Límite |
| Prioridad · Camino feliz | Baja · No |
| Automatización | V3 |
| Pre-requisitos | Setup completado o salteado. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Cerrar sesión y volver a entrar. | No aparece el setup: abre Registrar. |
| 2 | Abrir el setup desde Ajustes. | Se muestra de nuevo. |

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
| Pre-requisitos | Usuario autenticado. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir la app (/). | Cae directo en /register, en el paso del monto. |

#### CP-REG-002 — La fecha viene precargada con hoy

| Campo | Contenido |
|---|---|
| Funcionalidad | Registro de transacciones |
| Historias de usuario | US-03 |
| Trazabilidad | FR-06 · C1 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Media · Sí |
| Automatización | Sí |
| Pre-requisitos | Hoy = 2026-09-28 (fijado como dato, C1). |
| Datos de prueba | Monto: 1500 |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir /register, cargar un monto y elegir categoría. | Avanza al paso de detalles (ADR-024). |
| 2 | Observar la fecha. | Precargada con la fecha de hoy. |

#### CP-REG-003 — Tipo "gasto" y moneda ARS por defecto

| Campo | Contenido |
|---|---|
| Funcionalidad | Registro de transacciones |
| Historias de usuario | US-04, US-05 |
| Trazabilidad | FR-06 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Baja · Sí |
| Automatización | Sí |
| Pre-requisitos | Formulario recién abierto. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Observar tipo y moneda. | Tipo = Gasto; moneda = ARS; no se muestra tipo de cambio. |

#### CP-REG-004 — Elegir la categoría tocando un chip

| Campo | Contenido |
|---|---|
| Funcionalidad | Registro de transacciones |
| Historias de usuario | US-06 |
| Trazabilidad | FR-06 · I8 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Media · Sí |
| Automatización | Sí |
| Pre-requisitos | Categorías activas sembradas. |
| Datos de prueba | Monto: 2300<br>Categoría: Transporte |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Cargar un monto y tocar Siguiente. | Se ve la grilla de categorías, sin ningún select. |
| 2 | Tocar el chip "Transporte". | Avanza solo al paso de detalles. |
| 3 | Guardar. | La transacción queda con la categoría "Transporte". |

#### CP-REG-005 — Una categoría archivada no se ofrece ni se acepta por API

| Campo | Contenido |
|---|---|
| Funcionalidad | Registro de transacciones |
| Historias de usuario | US-06 |
| Trazabilidad | FR-06 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Prioridad · Camino feliz | Media · No |
| Automatización | Sí |
| Pre-requisitos | Categoría "Salidas" archivada. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir /register, cargar un monto y tocar Siguiente. | La grilla no muestra "Salidas". |
| 2 | Variante API: create_transaction con el id de "Salidas". | Rechazado: "la categoría no existe, no es tuya o está archivada". |

#### CP-REG-006 — La cuenta viene precargada con la última usada

| Campo | Contenido |
|---|---|
| Funcionalidad | Registro de transacciones |
| Historias de usuario | US-07 |
| Trazabilidad | FR-06 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Baja · Sí |
| Automatización | Sí |
| Pre-requisitos | La última transacción se guardó con "Visa BBVA". |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Volver a abrir /register y avanzar hasta detalles. | "Visa BBVA" viene seleccionada. |

#### CP-REG-007 — Guardar sin nota

| Campo | Contenido |
|---|---|
| Funcionalidad | Registro de transacciones |
| Historias de usuario | US-08 |
| Trazabilidad | FR-06 |
| Técnica · Tipo | Valores límite · Límite |
| Prioridad · Camino feliz | Baja · No |
| Automatización | Sí |
| Pre-requisitos | Formulario completo salvo la nota. |
| Datos de prueba | Monto: 1234 |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Dejar la nota vacía y guardar. | Se guarda sin error, con description = null. |

#### CP-REG-008 — Fecha de ayer sí, fecha de mañana no

| Campo | Contenido |
|---|---|
| Funcionalidad | Registro de transacciones |
| Historias de usuario | US-09 |
| Trazabilidad | FR-06 |
| Técnica · Tipo | Valores límite · Límite |
| Prioridad · Camino feliz | Media · No |
| Automatización | Sí |
| Pre-requisitos | Hoy = 2026-09-28. |
| Datos de prueba | Ayer: 2026-09-27<br>Mañana: 2026-09-29 |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Cargar un gasto con fecha de ayer. | Se guarda. |
| 2 | Cargar un gasto con fecha de mañana. | Rechazado: "La fecha no puede ser futura". |
| 3 | Variante API: create_transaction con fecha futura. | Rechazado también en el servidor. |

#### CP-REG-009 — Confirmación y formulario limpio después de guardar

| Campo | Contenido |
|---|---|
| Funcionalidad | Registro de transacciones |
| Historias de usuario | US-10 |
| Trazabilidad | FR-06 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Media · Sí |
| Automatización | Sí |
| Pre-requisitos | Formulario completo. |
| Datos de prueba | Monto: 4500 |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Guardar. | Confirmación breve ("Gasto guardado"). |
| 2 | Observar el formulario. | Vuelve al paso del monto, vacío, conservando la última cuenta usada. |

#### CP-REG-010 — Monto vacío, cero o negativo no se guarda

| Campo | Contenido |
|---|---|
| Funcionalidad | Registro de transacciones |
| Historias de usuario | US-11 |
| Trazabilidad | FR-06 · I4 · C6 |
| Técnica · Tipo | Valores límite · Negativo |
| Prioridad · Camino feliz | Alta · No |
| Automatización | Sí |
| Pre-requisitos | Ninguna. |
| Datos de prueba | Montos: vacío · 0 · -500 · 0,01 |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Dejar el monto vacío; después 0; después -500. | Siguiente queda deshabilitado; no se emite ninguna escritura. |
| 2 | Cargar 0,01 y completar. | Se acepta (mínimo válido). |
| 3 | Variante API: create_transaction con 0 o negativo. | Rechazado con 23514 "I4: el monto debe ser mayor a cero". |

#### CP-REG-011 — Monto con tres decimales

| Campo | Contenido |
|---|---|
| Funcionalidad | Registro de transacciones |
| Historias de usuario | US-11 |
| Trazabilidad | FR-06 · I4 |
| Técnica · Tipo | Valores límite · Límite |
| Prioridad · Camino feliz | Media · No |
| Automatización | Sí |
| Pre-requisitos | Ninguna. |
| Datos de prueba | Monto: 100,999 |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Cargar 100,999. | Rechazado en cliente: "El monto admite hasta 2 decimales". |

#### CP-REG-012 — Eliminar una transacción la saca del total del mes

| Campo | Contenido |
|---|---|
| Funcionalidad | Baja lógica |
| Historias de usuario | US-65 |
| Trazabilidad | FR-08 · C10 · I10 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Alta · Sí |
| Automatización | V3 |
| Pre-requisitos | Transacción de $50.000 ARS en el mes actual, sin cuotas. |
| Datos de prueba | Nota: Campera |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Eliminarla desde Movimientos y confirmar el aviso. | Se cierra el diálogo. |
| 2 | Ver el Resumen del mes. | El total ya no la incluye (I10). |
| 3 | Consultar la base. | deleted_at completado: la transacción sigue existiendo, marcada como eliminada. |

#### CP-REG-013 — Eliminar una compra con cuotas en meses cerrados avisa y es retroactivo

| Campo | Contenido |
|---|---|
| Funcionalidad | Baja lógica |
| Historias de usuario | US-65, US-18 |
| Trazabilidad | FR-08 · C10 · I10 |
| Técnica · Tipo | Adivinación de errores · Límite |
| Prioridad · Camino feliz | Alta · No |
| Automatización | V3 |
| Pre-requisitos | Compra de $120.000 en 12 cuotas registrada el 2026-08-15.<br>Hoy = 2026-10-15 (agosto y septiembre cerrados). |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Eliminar la compra desde octubre. | Antes de confirmar, avisa que cambian los totales de meses cerrados (2026-08 y 2026-09). |
| 2 | Confirmar y ver el Resumen de agosto y de septiembre. | Todas las imputaciones dejan de contar, también las de meses cerrados. |

#### CP-REG-014 — Otro usuario no puede leer ni borrar una transacción ajena

| Campo | Contenido |
|---|---|
| Funcionalidad | Autorización |
| Historias de usuario | US-48 |
| Trazabilidad | C7 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Prioridad · Camino feliz | Alta · No |
| Automatización | Sí |
| Pre-requisitos | Transacción de A. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Con la sesión de B, leer esa transacción por id. | 0 filas. |
| 2 | Con la sesión de B, intentar eliminarla. | No la encuentra; la transacción de A queda intacta. |

#### CP-REG-015 — No se puede escribir en transactions salteando la RPC

| Campo | Contenido |
|---|---|
| Funcionalidad | Autorización |
| Historias de usuario | US-11 |
| Trazabilidad | C4 · I1 · I1' |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Prioridad · Camino feliz | Alta · No |
| Automatización | Sí |
| Pre-requisitos | Ninguna. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Intentar un insert directo a transactions (y a ledger_entries). | permission denied (42501): toda escritura pasa por create_transaction (C4). |

#### CP-REG-016 — El monto toma el foco con teclado numérico

| Campo | Contenido |
|---|---|
| Funcionalidad | Registro de transacciones |
| Historias de usuario | US-02 |
| Trazabilidad | FR-06 · NFR-07 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Media · Sí |
| Automatización | No |
| Pre-requisitos | Ninguna. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir /register en un celular (o emulación táctil) sin tocar nada. | El monto ya tiene el foco y el teclado numérico está abierto. |

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
| Pre-requisitos | Cuenta "Visa BBVA" de tipo tarjeta de crédito. |
| Datos de prueba | Monto: $120.000<br>Cuotas: 12 |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Elegir la cuenta, 12 cuotas y guardar $120.000. | Se guarda. |
| 2 | Consultar las imputaciones. | 12 imputaciones numeradas 1 a 12, en meses consecutivos desde el de la compra. |

#### CP-CUO-002 — Previsualización del impacto mensual antes de guardar

| Campo | Contenido |
|---|---|
| Funcionalidad | Cuotas |
| Historias de usuario | US-13 |
| Trazabilidad | FR-09 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Alta · Sí |
| Automatización | No |
| Pre-requisitos | Gasto de $120.000 en 12 cuotas con fecha 2026-08-15. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Completar el formulario sin guardar. | Muestra "12 cuotas de $10.000 — de 2026-08 a 2027-07" antes de tocar Guardar. |

#### CP-CUO-003 — Cambiar a una cuenta que no es crédito resetea las cuotas

| Campo | Contenido |
|---|---|
| Funcionalidad | Cuotas |
| Historias de usuario | US-14 |
| Trazabilidad | I6 |
| Técnica · Tipo | Tabla de decisión · Negativo |
| Prioridad · Camino feliz | Alta · No |
| Automatización | Sí |
| Pre-requisitos | 6 cuotas elegidas con "Visa BBVA". |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Cambiar la cuenta a "Efectivo". | El selector de cuotas desaparece, el valor vuelve a 1 y hay un aviso. |
| 2 | Variante API: create_transaction con 6 cuotas y cuenta cash. | Rechazado por I6. |

#### CP-CUO-004 — División exacta: 12 cuotas iguales

| Campo | Contenido |
|---|---|
| Funcionalidad | Cuotas |
| Historias de usuario | US-15 |
| Trazabilidad | FR-10 · FR-11 · I1 · I1' · C3 |
| Técnica · Tipo | Valores límite · Positivo |
| Prioridad · Camino feliz | Alta · Sí |
| Automatización | V3 |
| Pre-requisitos | Ninguna. |
| Datos de prueba | Monto: $120.000 en 12 cuotas |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Guardar $120.000 en 12 cuotas. | 12 imputaciones de exactamente $10.000; suma $120.000,00 (I1). |

#### CP-CUO-005 — El resto lo absorbe la última cuota

| Campo | Contenido |
|---|---|
| Funcionalidad | Cuotas |
| Historias de usuario | US-15 |
| Trazabilidad | FR-10 · FR-11 · I1 · C3 |
| Técnica · Tipo | Valores límite · Límite |
| Prioridad · Camino feliz | Alta · No |
| Automatización | V3 |
| Pre-requisitos | Ninguna. |
| Datos de prueba | Monto: $100.000 en 3 cuotas |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Guardar $100.000 en 3 cuotas. | $33.333,33 + $33.333,33 + $33.333,34 = $100.000,00. El resto va en la última. |

#### CP-CUO-006 — Cantidad de cuotas: 0, 1, 2, 12 y 13

| Campo | Contenido |
|---|---|
| Funcionalidad | Cuotas |
| Historias de usuario | US-15, US-12 |
| Trazabilidad | FR-09 |
| Técnica · Tipo | Tabla de decisión · Límite |
| Prioridad · Camino feliz | Alta · No |
| Automatización | Sí |
| Pre-requisitos | Cuenta de tarjeta de crédito. |
| Datos de prueba | Cuotas: 0 · 1 · 2 · 12 · 13 |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Intentar guardar con cada cantidad. | 0 rechazado; 1, 2 y 12 aceptados; 13 rechazado. |

#### CP-CUO-007 — El Resumen separa las cuotas de meses anteriores

| Campo | Contenido |
|---|---|
| Funcionalidad | Cuotas |
| Historias de usuario | US-16 |
| Trazabilidad | FR-20 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Media · Sí |
| Automatización | V3 |
| Pre-requisitos | Gasto de $120.000 en 12 cuotas registrado en 2026-08. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ir al Resumen de 2026-09. | El total incluye $10.000 y "Cuotas de meses anteriores" muestra $10.000. |

#### CP-CUO-008 — El listado muestra el número de cuota

| Campo | Contenido |
|---|---|
| Funcionalidad | Cuotas |
| Historias de usuario | US-17 |
| Trazabilidad | FR-20 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Baja · Sí |
| Automatización | Sí |
| Pre-requisitos | Compra en 12 cuotas de agosto; mes con la cuota 3. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ver Movimientos de ese mes. | Muestra "3/12" junto a la imputación. |

#### CP-CUO-009 — Borrar una compra en cuotas saca todas sus cuotas

| Campo | Contenido |
|---|---|
| Funcionalidad | Cuotas |
| Historias de usuario | US-18 |
| Trazabilidad | FR-08 · I10 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Alta · Sí |
| Automatización | V3 |
| Pre-requisitos | Compra de $120.000 en 12 cuotas. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Eliminar la compra (no existe la opción de borrar una cuota suelta). | Las 12 imputaciones dejan de contar en todos los meses, incluidas las futuras. |

#### CP-CUO-010 — En USD, la suma en pesos de las cuotas es exacta

| Campo | Contenido |
|---|---|
| Funcionalidad | Cuotas |
| Historias de usuario | US-15 |
| Trazabilidad | C2 · I1' |
| Técnica · Tipo | Adivinación de errores · Límite |
| Prioridad · Camino feliz | Media · No |
| Automatización | Sí |
| Pre-requisitos | Gasto de USD 100 en 3 cuotas con TC 1250,5555. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Guardar. | Se guarda. |
| 2 | Sumar amount_ars de las 3 imputaciones. | Es exactamente transactions.amount_ars (I1'), sin diferencias de un centavo. |

#### CP-CUO-011 — Otro usuario no ve las cuotas de una compra ajena

| Campo | Contenido |
|---|---|
| Funcionalidad | Autorización |
| Historias de usuario | US-48 |
| Trazabilidad | C7 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Prioridad · Camino feliz | Alta · No |
| Automatización | Sí |
| Pre-requisitos | Compra en cuotas de A. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Con la sesión de B, consultar ledger_entries de esa compra. | 0 filas. |

#### CP-CUO-012 — Un ingreso no admite cuotas aunque la cuenta sea crédito

| Campo | Contenido |
|---|---|
| Funcionalidad | Cuotas |
| Historias de usuario | US-12, US-14 |
| Trazabilidad | I6 |
| Técnica · Tipo | Tabla de decisión · Negativo |
| Prioridad · Camino feliz | Alta · No |
| Automatización | Sí |
| Pre-requisitos | Cuenta "Visa BBVA" de crédito. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Cargar un ingreso con esa cuenta. | No aparece el selector de cuotas. |
| 2 | Variante API: ingreso en 3 cuotas con cuenta de crédito. | Rechazado por I6. |

#### CP-CUO-013 — Un fallo a mitad de create_transaction no deja datos parciales

| Campo | Contenido |
|---|---|
| Funcionalidad | Cuotas |
| Historias de usuario | US-15 |
| Trazabilidad | C4 · I1 · I1' |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Prioridad · Camino feliz | Alta · No |
| Automatización | Sí |
| Pre-requisitos | Ninguna. |
| Datos de prueba | Llamada: $0,02 en 3 cuotas (la cuota base da 0) |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Forzar que create_transaction falle después de insertar la transacción. | La llamada devuelve error. |
| 2 | Contar filas de transactions y ledger_entries. | Cero filas nuevas en ambas: todo se revierte (C4). |

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
| Pre-requisitos | TC de referencia del mes = 1250. |
| Datos de prueba | Monto: USD 100 |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Elegir USD, monto 100 y guardar sin tocar el tipo de cambio. | Se guarda con fx_rate = 1250 y amount_ars = 125.000. |

#### CP-MON-002 — Tabla de decisión de moneda y tipo de cambio (6 filas)

| Campo | Contenido |
|---|---|
| Funcionalidad | Monedas |
| Historias de usuario | US-19 |
| Trazabilidad | FR-12 · I5 |
| Técnica · Tipo | Tabla de decisión · Negativo |
| Prioridad · Camino feliz | Alta · No |
| Automatización | Sí |
| Pre-requisitos | Ninguna (se ejecuta primero sin referencia del mes y después con 1250). |
| Datos de prueba | Filas: ARS sin TC · ARS con TC · USD con referencia sin override · USD con referencia con override · USD sin referencia sin TC · USD sin referencia con TC |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar las seis combinaciones de 07-plan-de-testing.md §3. | Se guardan las filas 1, 3, 4 y 6. Se rechazan la 2 (ARS con TC, I5) y la 5 (USD sin ningún TC, con mensaje que pide el tipo de cambio). |
| 2 | Variante API: filas 2 y 5 contra create_transaction. | Mismo rechazo (I5). |

#### CP-MON-003 — Pisar el tipo de cambio sugerido

| Campo | Contenido |
|---|---|
| Funcionalidad | Monedas |
| Historias de usuario | US-20, US-21 |
| Trazabilidad | FR-12 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Media · Sí |
| Automatización | Sí |
| Pre-requisitos | TC de referencia del mes = 1250. |
| Datos de prueba | TC propio: 1300 |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Elegir USD. | El campo sugiere 1250. |
| 2 | Pisarlo con 1300 y guardar. | Se guarda con fx_rate = 1300. |

#### CP-MON-004 — Cambiar la referencia no altera lo ya guardado

| Campo | Contenido |
|---|---|
| Funcionalidad | Monedas |
| Historias de usuario | US-22 |
| Trazabilidad | C5 · ADR-002 |
| Técnica · Tipo | Adivinación de errores · Positivo |
| Prioridad · Camino feliz | Alta · No |
| Automatización | V3 |
| Pre-requisitos | Gasto de USD 100 guardado con fx_rate = 1250 (amount_ars = 125.000). |
| Datos de prueba | Nueva referencia: 1400 |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Cambiar en Ajustes la referencia del mes a 1400. | Se guarda. |
| 2 | Ver esa transacción y el Resumen del mes. | La transacción sigue valiendo $125.000; el total no cambia. |

#### CP-MON-005 — El total del mes en pesos incluye lo gastado en dólares

| Campo | Contenido |
|---|---|
| Funcionalidad | Monedas |
| Historias de usuario | US-23 |
| Trazabilidad | FR-20 · I1' |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Alta · Sí |
| Automatización | V3 |
| Pre-requisitos | Un gasto de $50.000 ARS y uno de USD 100 a 1250 en el mismo mes. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ver el total del mes en el Resumen. | $175.000 ($50.000 + $125.000). |

#### CP-MON-006 — El gasto en dólares se ve por separado

| Campo | Contenido |
|---|---|
| Funcionalidad | Monedas |
| Historias de usuario | US-24 |
| Trazabilidad | FR-20 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Baja · Sí |
| Automatización | Sí |
| Pre-requisitos | Gasto de USD 100 en el mes. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ver el Resumen. | Muestra "USD 100" por separado del total en ARS. |

#### CP-MON-007 — Otro usuario no lee ni modifica el tipo de cambio ajeno

| Campo | Contenido |
|---|---|
| Funcionalidad | Autorización |
| Historias de usuario | US-48 |
| Trazabilidad | C7 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Prioridad · Camino feliz | Alta · No |
| Automatización | Sí |
| Pre-requisitos | fx_rates de A para el mes actual. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Con la sesión de B, leer y actualizar esa fila. | 0 filas al leer; el update afecta 0 filas. |

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
| Pre-requisitos | Transacciones en el mes actual. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Entrar a /dashboard sin tocar el selector de mes. | Muestra el total gastado del mes actual. |

#### CP-DAS-002 — El mes elegido vive en la URL

| Campo | Contenido |
|---|---|
| Funcionalidad | Dashboard |
| Historias de usuario | US-26 |
| Trazabilidad | FR-21 · C11 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Alta · Sí |
| Automatización | Sí |
| Pre-requisitos | En /dashboard?period=2026-09. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Tocar "→" dos veces. | La URL pasa a period=2026-11. |

#### CP-DAS-003 — Período inválido o ausente cae al mes actual

| Campo | Contenido |
|---|---|
| Funcionalidad | Dashboard |
| Historias de usuario | US-26 |
| Trazabilidad | C11 |
| Técnica · Tipo | Adivinación de errores · Límite |
| Prioridad · Camino feliz | Media · No |
| Automatización | Sí |
| Pre-requisitos | Ninguna. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir /dashboard?period=fecha-invalida. | Cae al mes actual sin error visible y corrige la URL. |
| 2 | Abrir /dashboard sin parámetro. | Ídem. |

#### CP-DAS-004 — Gasto por categoría en barras

| Campo | Contenido |
|---|---|
| Funcionalidad | Dashboard |
| Historias de usuario | US-27 |
| Trazabilidad | FR-20 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Media · Sí |
| Automatización | Sí |
| Pre-requisitos | Gastos en 3 categorías: Salud $70.000, Comida $50.000, Transporte $30.000. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ver el gráfico por categoría. | Una barra por categoría con su total, ordenadas de mayor a menor. |

#### CP-DAS-005 — Gasto por cuenta

| Campo | Contenido |
|---|---|
| Funcionalidad | Dashboard |
| Historias de usuario | US-28 |
| Trazabilidad | FR-20 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Media · Sí |
| Automatización | Sí |
| Pre-requisitos | Gastos en 2 cuentas (Efectivo $120.000, Tarjeta de débito $30.000). |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ver el desglose por cuenta. | Cada total coincide con la suma manual de sus transacciones. |

#### CP-DAS-006 — Ingresos y balance positivo

| Campo | Contenido |
|---|---|
| Funcionalidad | Dashboard |
| Historias de usuario | US-29 |
| Trazabilidad | FR-20 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Media · Sí |
| Automatización | Sí |
| Pre-requisitos | Ingresos $200.000 y gastos $150.000 en el mes. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ver ingresos y balance. | Ingresos $200.000; balance +$50.000. |

#### CP-DAS-007 — Balance negativo con signo explícito

| Campo | Contenido |
|---|---|
| Funcionalidad | Dashboard |
| Historias de usuario | US-29 |
| Trazabilidad | FR-20 |
| Técnica · Tipo | Valores límite · Límite |
| Prioridad · Camino feliz | Baja · No |
| Automatización | Sí |
| Pre-requisitos | Gastos $200.000 e ingresos $50.000. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ver el balance. | -$150.000, con signo negativo explícito. |

#### CP-DAS-008 — Últimos 10 movimientos con acceso a la lista completa

| Campo | Contenido |
|---|---|
| Funcionalidad | Dashboard |
| Historias de usuario | US-31 |
| Trazabilidad | FR-20 |
| Técnica · Tipo | Caso de uso · Positivo |
| Prioridad · Camino feliz | Media · Sí |
| Automatización | Sí |
| Pre-requisitos | 15 transacciones en el mes. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ver "Últimos movimientos". | Muestra 10. |
| 2 | Tocar "Ver todos". | Abre Movimientos del mes con las 15. |

#### CP-DAS-009 — Una cuota heredada no cuenta como día con registro

| Campo | Contenido |
|---|---|
| Funcionalidad | Dashboard |
| Historias de usuario | US-32 |
| Trazabilidad | FR-20 |
| Técnica · Tipo | Adivinación de errores · Límite |
| Prioridad · Camino feliz | Baja · No |
| Automatización | Sí |
| Pre-requisitos | Compra en 12 cuotas de agosto; en diciembre solo cae su cuota. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ver "días con registro" en el Resumen de diciembre. | 0 días. |

#### CP-DAS-010 — Mes sin datos: estado vacío con acceso al registro

| Campo | Contenido |
|---|---|
| Funcionalidad | Dashboard |
| Historias de usuario | US-33 |
| Trazabilidad | FR-20 |
| Técnica · Tipo | Caso de uso · Límite |
| Prioridad · Camino feliz | Media · No |
| Automatización | Sí |
| Pre-requisitos | Mes sin ninguna transacción. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ir al Resumen de ese mes. | Mensaje claro y un botón a /register, no un dashboard de ceros. |

#### CP-DAS-011 — El Resumen de un usuario nunca muestra datos de otro

| Campo | Contenido |
|---|---|
| Funcionalidad | Autorización |
| Historias de usuario | US-48 |
| Trazabilidad | C7 |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Prioridad · Camino feliz | Alta · No |
| Automatización | Sí |
| Pre-requisitos | Resumen de A con datos. |
| Datos de prueba | — |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Con la sesión de B, repetir las consultas del Resumen filtrando por A. | 0 filas. |

## Supuestos

1. Los 68 casos conservan el oráculo del catálogo del repo; donde el rediseño (ADR-023/024) cambió el camino en pantalla se reescribió el paso, no el resultado esperado.
2. "Creado por": el catálogo se diseñó con la skill `/new-test-case` a partir de la spec y lo revisó el agente `spec-critic` (`docs/10-catalogo-casos-v1.md` §Revisión). No hay registro de qué integrante diseñó cada caso, así que no se asigna uno por caso.
3. Los 6 casos nuevos (US-66, US-68) se diseñaron en esta entrega desde los criterios de aceptación de sus issues.
