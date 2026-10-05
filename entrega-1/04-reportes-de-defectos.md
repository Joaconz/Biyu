# Proyecto Biyu – Entrega 1 · Reportes de defectos (V1)

Planilla: `04-reportes-de-defectos.xlsx` (un índice y una hoja por defecto, con el formato "Defect Report - Template" de la cátedra). Cada defecto existe también como issue en GitHub con la etiqueta `bug`, salvo los nuevos de esta entrega, que quedan listos para cargar.

Escala de severidad y flujo de estados: `docs/07-plan-de-testing.md` §5. Severidad la fija quien reporta; **prioridad la fija el PO** (la que figura acá es la sugerida por quien reportó).

## Resumen

| ID | Título | Severidad | Prioridad sugerida | Estado | Caso | Historia |
|---|---|---|---|---|---|---|
| DEF-001 | Ruta inexistente muestra el error crudo del router, sin salida a la app | Media | A definir por el PO | Cerrado · confirmado corregido el 2026-09-28 | — (ataque libre) | US-48 · La app pide login (navegación) |
| DEF-002 | <html lang="en"> y título de pestaña "scaffold" en toda la app | Baja | A definir por el PO | Cerrado · no se reproduce el 2026-09-28, issue cerrado el 2026-09-29 | — (ataque libre) | Transversal (NFR-06, accesibilidad) |
| DEF-003 | US-66 (confirmar contraseña) nunca llegó a producción por un error de merge | Media | A definir por el PO | Cerrado · no se reproduce el 2026-09-28, issue cerrado el 2026-09-29 | — (ataque libre; US-66 no tenía caso propio en el catálogo) | US-66 · Confirmar contraseña al registrarse |
| DEF-004 | NaN como monto se guarda y rompe el dashboard ("$NaN,undefined") | Crítica | A definir por el PO (sugerida: Alta dado que integridad de datos es I4) | Cerrado · confirmado corregido el 2026-09-28 | — (ataque libre) | US-11 · No se puede guardar monto cero o negativo |
| DEF-005 | El servidor acepta contraseñas que no cumplen FR-01/US-67 | Media | A definir por el PO | Corregido · falta confirmación | CP-ACC-004, variante servidor | US-67 · Criterios de contraseña (FR-01) |
| DEF-006 | Transacción de una categoría archivada no muestra marca de archivada en /transactions | Baja | A definir por el PO | Corregido · falta confirmación | CP-CFG-004 | US-44 · Archivar una categoría sin perder historia |
| DEF-007 | Una transacción eliminada desaparece del historial en vez de quedar marcada como eliminada | Media | A definir por el PO | Corregido · falta confirmación | CP-REG-012 | US-65 · Eliminar una transacción (FR-08) |
| DEF-008 | Tras iniciar sesión se ignora el destino original (next) y siempre entra a /register | Media | A definir por el PO | Corregido · falta confirmación | CP-ACC-002 | US-48 · La app pide login |
| DEF-009 | Cambiar el tipo de una cuenta a no-crédito deja compras en cuotas existentes violando I6 | Media | A definir por el PO | Corregido en #183 · falta confirmación | — (derivado de CP-CUO-003, I6) | US-45 · Crear cuentas indicando su tipo (I6) |
| DEF-010 | Archivar todas las categorías hace que se resiembren las 8 por defecto | Media | A definir por el PO | Corregido · falta confirmación | — (FR-04/FR-05) | US-43 · Set inicial de categorías y cuentas |
| DEF-011 | No se pueden editar ni archivar cuentas (medios de pago) desde la UI | Media | A definir por el PO | Corregido · falta confirmación | — (FR-05, relacionado con CP-CFG-006) | US-45 · Cuentas (FR-05) |
| DEF-012 | Un monto extremo pasa la validación del cliente y termina en un error técnico en inglés | Baja | A definir por el PO | Corregido · falta confirmación | — (valores límite, I4/C6) | US-11 · Validación del monto |
| DEF-013 | Con un monto USD muy chico, Guardar se deshabilita sin ningún mensaje visible | Baja | A definir por el PO | Corregido · falta confirmación | — (valores límite) | US-19 · Registrar un gasto en USD |
| DEF-014 | El período 0000-01 en el dashboard muestra un error de base de datos crudo | Baja | A definir por el PO | Corregido · falta confirmación | — (relacionado con CP-DAS-003, Media) | US-26 · Cambiar de mes con un selector |
| DEF-015 | Los botones de la paleta de color en /settings no tienen data-testid | Baja | A definir por el PO | Corregido · falta confirmación | — (07-plan-de-testing.md §2) | Transversal (data-testid, plan de testing §2) |
| DEF-016 | No se puede crear ninguna deuda vinculada, ni siquiera una válida (falta SECURITY DEFINER) | Media | A definir por el PO | Corregido en #183 · falta confirmación | — (I7; latente, deudas no son de V1 pero el trigger ya existe en el schema) | V2 · Deudas (I7), latente en el schema |
| DEF-017 | Después de crear la cuenta no aparece la configuración inicial (US-68 sin implementar) | Alta | A definir por el PO (sugerida: Alta, US-68 está en el alcance de la Entrega 1) | Cerrado · corregido en #173; CP-CFG-011 a CP-CFG-015 pasan en el re-test del 2026-09-29 | CP-CFG-011 (bloquea CP-CFG-012 a CP-CFG-015) | US-68 · Configuración inicial al crear la cuenta |
| DEF-018 | El registro acepta un tipo de cambio con más de 4 decimales y la base lo redondea sin avisar | Baja | A definir por el PO | Corregido · falta confirmación | — (exploración, relacionado con CP-CUO-010 y CP-CFG-010) | US-21 · Pisar el tipo de cambio sugerido |
| DEF-019 | Se pueden tener dos categorías activas que solo difieren en mayúsculas ("Salud" y "salud") | Baja | A definir por el PO | Corregido en #183 · falta confirmación | — (exploración, variante de CP-CFG-003) | US-42 · Crear, renombrar y elegir color de categorías |
| DEF-020 | El tipo de cambio sugerido se muestra con el formato de la base ("1250.0000") | Baja | A definir por el PO | Corregido · falta confirmación | CP-MON-003 (PASSED: el valor sugerido es correcto) | US-20 · Sugerir el tipo de cambio de referencia del mes |
| DEF-021 | Los montos grandes se salen de sus casilleros en el Resumen (celular) | Media | A definir por el PO | Corregido · falta confirmación | — (uso manual; relacionado con DEF-012, montos extremos) | US-25 · Total gastado del mes actual al entrar; US-29 · Ingresos y balance del mes; US-27 · Gasto por categoría en barras |
| DEF-022 | El setup de US-68 deja afuera de la app a cuentas existentes y a quien no puede guardarlo | Crítica | A definir por el PO | Cerrado · corregido en #176 el 2026-09-29; migraciones aplicadas y verificado en producción el 2026-09-29 | — (no había caso; se agregaron los tests de regresión de e2e/setup.spec.ts) | US-68 · Configuración inicial al crear la cuenta |
| DEF-023 | Después de crear la cuenta, a veces la pantalla queda en blanco en /register | Alta | A definir por el PO | Abierto · encontrado el 2026-10-05 | — (aparece en e2e/setup.spec.ts, "una cuenta nueva ve el setup…") | US-68 · Configuración inicial al crear la cuenta; US-51 · Entrar directo tras registrarse |
| DEF-024 | Los diálogos de confirmación no toman el foco del teclado | Media | A definir por el PO | Abierto · encontrado el 2026-10-05 | — (NFR-06, WCAG 2.1 AA en flujos críticos) | US-65 · Eliminar una transacción; DEF-011 · Eliminar una cuenta |
| DEF-025 | El error al editar una cuenta o una categoría aparece fuera de la pantalla | Baja | A definir por el PO | Abierto · encontrado el 2026-10-05 | — (relacionado con CP-CFG-003 y DEF-009) | US-42 · Categorías; DEF-011 · Editar cuentas |
| DEF-026 | Sin categorías activas, el registro y el setup quedan sin salida | Baja | A definir por el PO | Abierto · encontrado el 2026-10-05 | — (derivado de DEF-010) | US-44 · Archivar una categoría; US-68 · Configuración inicial; US-01 · Registrar un gasto |
| DEF-027 | Al llegar al límite de altas, el mensaje dice "Probá de nuevo" | Baja | A definir por el PO | Abierto · encontrado el 2026-10-05 | — (relacionado con US-50 · Traducir errores de Auth) | US-50 · Traducir errores de Auth y evitar doble submit |

**Abiertos por severidad:** Crítica: 0 · Alta: 1 · Media: 1 · Baja: 3 · Total abiertos: 5 (más 16 corregidos que esperan confirmación).

## DEF-001 · Ruta inexistente muestra el error crudo del router, sin salida a la app

| Campo | Contenido |
|---|---|
| Estado | Cerrado · confirmado corregido el 2026-09-28 |
| Severidad | Media |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | ejecución adversarial de #75 (ataque libre, fuera del catálogo escrito). |
| Caso de prueba | — (ataque libre) |
| Historia | US-48 · La app pide login (navegación) |
| Issue | #142 |
| Reportó | Sesión test-adversary (#75), coordinada por Joaquin Nuñez |
| Entorno | Producción https://biyu-rust.vercel.app, navegador Chromium, Windows 11, 2026-09-28 |

Ruta inexistente muestra el error crudo del router, sin salida a la app.

**Pasos para reproducir**

1. Versión donde ocurría: producción antes de #163. Se reproduce con o sin sesión.
2. Abrir el navegador (Chromium) y escribir en la barra de direcciones https://biyu-rust.vercel.app/no-existe-esta-ruta. Dar Enter.
3. Observar la pantalla que se abre: el texto, si aparece el encabezado de Biyu y si hay algún botón o link para volver a la app.

**Resultado esperado.** Una pantalla de "no encontrado" propia en español con un camino de vuelta a la app, o redirección a /

**Resultado obtenido.** El body muestra textualmente "Unexpected Application Error!\n404 Not Found" — la pantalla de error por defecto de React Router. Sin header de Biyu, sin link a /register o /login, sin redirección

**Evidencia.** document.body.innerText = "Unexpected Application Error!\n404 Not Found", location.href = la URL inexistente · Re-test 2026-09-28 (main 44f1519): Body: "biyu. Esta página no existe Revisá la dirección o volvé a la app. Volver a Biyu"

## DEF-002 · <html lang="en"> y título de pestaña "scaffold" en toda la app

| Campo | Contenido |
|---|---|
| Estado | Cerrado · no se reproduce el 2026-09-28, issue cerrado el 2026-09-29 |
| Severidad | Baja |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | ejecución adversarial de #75 (ataque libre). |
| Caso de prueba | — (ataque libre) |
| Historia | Transversal (NFR-06, accesibilidad) |
| Issue | #143 |
| Reportó | Sesión test-adversary (#75), coordinada por Joaquin Nuñez |
| Entorno | Producción https://biyu-rust.vercel.app, /login, /signup, /settings y la ruta 404, 2026-09-28 |

<html lang="en"> y título de pestaña "scaffold" en toda la app.

**Pasos para reproducir**

1. Versión donde ocurría: producción antes del rediseño de la UI (#161).
2. Abrir https://biyu-rust.vercel.app/login en el navegador.
3. Leer el título de la pestaña del navegador.
4. Abrir las herramientas de desarrollo (F12), ir a la pestaña "Console", escribir document.documentElement.lang y dar Enter.
5. Repetir los pasos 3 y 4 en /signup, /settings (con sesión iniciada) y en una ruta inexistente.

**Resultado esperado.** Título "Biyu" (o por pantalla) y lang="es" (idealmente es-AR, CLAUDE.md fija español rioplatense). NFR-06 pide WCAG 2.1 AA; el criterio 3.1.1 (Idioma de la página) exige que lang coincida con el idioma real, si no los lectores de pantalla leen el español con fonética inglesa

**Resultado obtenido.** document.title = "scaffold" (el nombre del template de Vite), lang = "en" en todas las pantallas probadas

**Evidencia.** {"lang":"en","title":"scaffold","url":"https://biyu-rust.vercel.app/login"} · Re-test 2026-09-28 (main 44f1519): title="Biyu", lang="es-AR"

## DEF-003 · US-66 (confirmar contraseña) nunca llegó a producción por un error de merge

| Campo | Contenido |
|---|---|
| Estado | Cerrado · no se reproduce el 2026-09-28, issue cerrado el 2026-09-29 |
| Severidad | Media |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | ejecución adversarial de #75 (ataque libre — probó los criterios de US-66/US-67 en /signup). |
| Caso de prueba | — (ataque libre; US-66 no tenía caso propio en el catálogo) |
| Historia | US-66 · Confirmar contraseña al registrarse |
| Issue | #144 |
| Reportó | Sesión test-adversary (#75), coordinada por Joaquin Nuñez |
| Entorno | Producción https://biyu-rust.vercel.app/signup, 2026-09-28 |

US-66 (confirmar contraseña) nunca llegó a producción por un error de merge.

**Pasos para reproducir**

1. Versión donde ocurría: producción antes de #141 (US-66 se había perdido en un merge).
2. Abrir https://biyu-rust.vercel.app en el navegador, sin sesión.
3. En la pantalla "Entrar", tocar "Crear una cuenta".
4. Mirar los campos del formulario "Crear cuenta": qué hay debajo de "Contraseña" y de la lista de criterios, antes del botón "Crear cuenta".

**Resultado esperado.** US-66 (02-behavior-spec.md): "quiero confirmar mi contraseña al registrarme escribiéndola dos veces"

**Resultado obtenido.** Solo aparecen "Email", "Contraseña", la lista de 5 criterios y "Crear cuenta". No hay un segundo campo de confirmación

**Evidencia.** read_page de /signup sin el campo confirmPassword · Re-test 2026-09-28 (main 44f1519): El formulario de /signup local (main 44f1519) tiene "Confirmar contraseña". Producción no se verificó en esta corrida.

## DEF-004 · NaN como monto se guarda y rompe el dashboard ("$NaN,undefined")

| Campo | Contenido |
|---|---|
| Estado | Cerrado · confirmado corregido el 2026-09-28 |
| Severidad | Crítica |
| Prioridad (sugerida) | A definir por el PO (sugerida: Alta dado que integridad de datos es I4) |
| Encontrado en | ejecución adversarial de #75 (ataque libre, derivado de la variante API de CP-REG-010 / I4). |
| Caso de prueba | — (ataque libre) |
| Historia | US-11 · No se puede guardar monto cero o negativo |
| Issue | #145 |
| Reportó | Sesión test-adversary (#75), coordinada por Joaquin Nuñez |
| Entorno | Local: http://localhost:5174 + Supabase local, 2026-09-28 |

NaN como monto se guarda y rompe el dashboard ("$NaN,undefined").

**Pasos para reproducir**

1. Versión donde ocurría: main antes de #162, contra el stack local (Supabase local y la app en localhost).
2. Abrir la app e iniciar sesión: en /login, escribir el email y la contraseña del usuario de prueba y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.
3. Obtener el token de sesión del usuario (en la consola del navegador, con la app abierta: la clave "sb-…-auth-token" de localStorage, campo access_token) y la anon key del proyecto. Las llamadas de los pasos siguientes llevan los encabezados "apikey: <anon key>" y "Authorization: Bearer <token>".
4. Con ese token, obtener los ids que pide la llamada: GET /rest/v1/categories?select=id,name y GET /rest/v1/accounts?select=id,name,type.
5. Llamar a POST /rest/v1/rpc/create_transaction con el cuerpo {"p_amount": "NaN", "p_currency": "ARS", "p_category_id": "<id de Otros>", "p_account_id": "<id de Efectivo>", "p_occurred_on": "<fecha de hoy, AAAA-MM-DD>"}.
6. Llamar otra vez con {"p_amount": "1", "p_currency": "USD", "p_fx_rate": "NaN", "p_category_id": "<id de Otros>", "p_account_id": "<id de Efectivo>", "p_occurred_on": "<fecha de hoy>"}.
7. En la app, tocar "Resumen" en la barra de navegación y mirar el mes actual: el total gastado, el balance, "Por categoría" y "Por cuenta".

**Resultado esperado.** Rechazado por I4 (amount > 0) — en Postgres NaN > 0 evalúa true, así que el check no alcanza. upsert_fx_rate ya tiene esta misma protección para fx_rates; create_transaction y el check de debts no.

**Resultado obtenido.** Las dos llamadas devuelven un uuid (se crean). En la base: amount: "NaN", amount_ars: "NaN", mismo en ledger_entries. El dashboard muestra "Total gastado $NaN,undefined", "Balance $NaN,undefined", totales por categoría/cuenta "$NaN,undefined" y porcentajes "NaN%". ledger_integrity_violations no lo detecta (en Postgres NaN = NaN es verdadero). Un insert directo a debts con amount: "NaN" también se acepta.

**Evidencia.** Respuestas de la API y texto literal del dashboard (arriba) · Re-test 2026-09-28 (main 44f1519): create_transaction(p_amount='NaN') → rechazado "I4: el monto debe ser mayor a cero". Dashboard: "(sin total)".

## DEF-005 · El servidor acepta contraseñas que no cumplen FR-01/US-67

| Campo | Contenido |
|---|---|
| Estado | Corregido · falta la confirmación de quien lo reportó |
| Severidad | Media |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | ejecución adversarial de #75, variante servidor de CP-ACC-004. |
| Caso de prueba | CP-ACC-004, variante servidor |
| Historia | US-67 · Criterios de contraseña (FR-01) |
| Issue | #146 |
| Test de regresión | `tests/lib/passwordPolicy.test.ts` (Vitest: `supabase/config.toml` exige los mismos criterios que US-67) |
| Reportó | Sesión test-adversary (#75), coordinada por Joaquin Nuñez |
| Entorno | Local: Supabase Auth local (minimum_password_length = 6, password_requirements = ""). No verificado en producción |

El servidor acepta contraseñas que no cumplen FR-01/US-67.

**Pasos para reproducir**

1. Se reproduce contra Supabase Auth local (política de contraseñas del proyecto local); no se verificó en producción.
2. Obtener la anon key del proyecto local (salida de "supabase status").
3. Sin pasar por la pantalla de la app, llamar a POST /auth/v1/signup con el encabezado "apikey: <anon key>" y el cuerpo {"email": "<un email nuevo>", "password": "abc1234"}.
4. Repetir la llamada con otro email nuevo y "password": "abcd1234".
5. Leer las dos respuestas: si traen access_token, la cuenta se creó con sesión.

**Resultado esperado.** Rechazo — FR-01 exige "validado en cliente **y en el servidor**"; US-67 amplía el criterio a 8+mayúscula+minúscula+número+especial

**Resultado obtenido.** Las dos devuelven access_token: cuenta creada con sesión

**Evidencia.** Respuestas de signup con access_token presente en ambos casos · Re-test 2026-09-28 (main 44f1519): Ver CP-ACC-004, variante API.

## DEF-006 · Transacción de una categoría archivada no muestra marca de archivada en /transactions

| Campo | Contenido |
|---|---|
| Estado | Corregido · falta la confirmación de quien lo reportó |
| Severidad | Baja |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | ejecución de CP-CFG-004 (#75). |
| Caso de prueba | CP-CFG-004 |
| Historia | US-44 · Archivar una categoría sin perder historia |
| Issue | #147 |
| Test de regresión | `e2e/transactions-history.spec.ts`, caso "DEF-006" (Playwright, en rojo contra producción y en verde con el arreglo) |
| Reportó | Sesión test-adversary (#75), coordinada por Joaquin Nuñez |
| Entorno | Local, 2026-09-28 |

Transacción de una categoría archivada no muestra marca de archivada en /transactions.

**Pasos para reproducir**

1. Abrir la app e iniciar sesión: en /login, escribir el email y la contraseña del usuario de prueba y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.
2. En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Registrar". Después: escribir 8000 en el monto, tocar "Siguiente", tocar el chip "Entretenimiento", tocar "Guardar gasto" (aparece "Gasto guardado").
3. Tocar el engranaje "Ajustes" arriba a la derecha (en computadora, "Ajustes" en el menú lateral).
4. En la sección "Categorías", tocar el botón de archivar a la derecha de "Entretenimiento" ("Archivar Entretenimiento"). "Entretenimiento" desaparece de la lista.
5. En la barra de navegación, tocar "Movimientos" (queda en el mes actual, el del gasto).
6. Buscar el gasto de $8.000 y mirar cómo se muestra su categoría.

**Resultado esperado.** 02-behavior-spec.md, sad path "categoría archivada": "Las transacciones históricas la siguen mostrando, **con una marca visual de archivada**" — el dashboard ya lo hace bien, /transactions no

**Resultado obtenido.** El ítem muestra el nombre de la categoría sin ningún indicador de archivada (<span class="truncate">Entretenimiento</span>, sin clase ni marca)

**Evidencia.** innerHTML del ítem en /transactions, comparado con el dashboard que sí marca "Entretenimiento archivada" · Re-test 2026-09-28 (main 44f1519): Ver CP-CFG-004.

## DEF-007 · Una transacción eliminada desaparece del historial en vez de quedar marcada como eliminada

| Campo | Contenido |
|---|---|
| Estado | Corregido · falta la confirmación de quien lo reportó |
| Severidad | Media |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | ejecución de CP-REG-012 (#75) — el caso "pasa" contra la base (soft delete correcto, KPIs excluyen la fila), pero contradice FR-08 en la UI. |
| Caso de prueba | CP-REG-012 |
| Historia | US-65 · Eliminar una transacción (FR-08) |
| Issue | #148 |
| Test de regresión | `supabase/tests/database/restore_transaction.test.sql` (pgTAP) y `e2e/transactions-history.spec.ts`, caso "DEF-007" (Playwright) |
| Reportó | Sesión test-adversary (#75), coordinada por Joaquin Nuñez |
| Entorno | Local, 2026-09-28 |

Una transacción eliminada desaparece del historial en vez de quedar marcada como eliminada.

**Pasos para reproducir**

1. Abrir la app e iniciar sesión: en /login, escribir el email y la contraseña del usuario de prueba y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.
2. En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Registrar". Después: escribir 50000 en el monto, tocar "Siguiente", tocar el chip "Indumentaria", en "Cuenta" tocar "Efectivo", en "Nota (opcional)" escribir "Campera", tocar "Guardar gasto" (aparece "Gasto guardado").
3. En la barra de navegación, tocar "Movimientos" (mes actual).
4. En el movimiento "Campera", tocar el tacho ("Eliminar Campera"). Se abre el diálogo "¿Eliminar transacción?".
5. Tocar "Eliminar". Aparece "Transacción eliminada".
6. Mirar el listado de Movimientos del mes, y después "Últimos movimientos" en el Resumen: si el gasto sigue visible con alguna marca de eliminado.

**Resultado esperado.** pre-entrega.md FR-08: "la transacción deja de contarse en los totales pero **permanece visible en el historial con una marca de eliminada**"

**Resultado obtenido.** El ítem desaparece por completo de todos los listados. En la base, deleted_at queda seteado correctamente y el total del mes baja lo esperado

**Evidencia.** Conteo de ítems en /transactions antes/después, y query directa con deleted_at is not null mostrando la fila · Re-test 2026-09-28 (main 44f1519): Ver CP-REG-012.

## DEF-008 · Tras iniciar sesión se ignora el destino original (next) y siempre entra a /register

| Campo | Contenido |
|---|---|
| Estado | Corregido · falta la confirmación de quien lo reportó |
| Severidad | Media |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | ejecución completa de CP-ACC-002 (#75) — el guard en sí funciona (redirige a /login?next=... correctamente), pero el recorrido completo (login → destino original) falla. |
| Caso de prueba | CP-ACC-002 |
| Historia | US-48 · La app pide login |
| Issue | #149 |
| Test de regresión | `tests/lib/postAuthDestination.test.ts` (Vitest) y `e2e/access.spec.ts` (Playwright, en rojo contra producción y en verde contra el Preview del PR) |
| Reportó | Sesión test-adversary (#75), coordinada por Joaquin Nuñez |
| Entorno | Local, 2026-09-28. Mismo código en producción, probablemente reproduce igual |

Tras iniciar sesión se ignora el destino original (next) y siempre entra a /register.

**Pasos para reproducir**

1. Usar un usuario que ya existe y ya completó o salteó la configuración inicial. Empezar sin sesión: si hay una abierta, ir a Ajustes y tocar "Cerrar sesión".
2. Escribir en la barra del navegador la dirección de la app seguida de /dashboard?period=2026-06 y dar Enter. La app redirige a /login?next=%2Fdashboard%3Fperiod%3D2026-06.
3. En "Entrar", escribir el email y la contraseña del usuario y tocar "Entrar".
4. Observar a qué pantalla lleva y la URL final.

**Resultado esperado.** Volver a /dashboard?period=2026-06 — AuthForm.tsx sí llama navigate(next), pero algo lo pisa

**Resultado obtenido.** Termina siempre en /register, ignorando el next

**Evidencia.** Probado dos veces, con next=%2Fdashboard... y next=%2Fsettings, mismo resultado · Re-test 2026-09-28 (main 44f1519): Login desde /login?next=/dashboard?period=2026-06 termina en /register.

## DEF-009 · Cambiar el tipo de una cuenta a no-crédito deja compras en cuotas existentes violando I6

| Campo | Contenido |
|---|---|
| Estado | Corregido en #183 · migración aplicada y verificada en producción el 2026-10-02; falta la confirmación de quien lo reportó |
| Severidad | Media |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | ejecución adversarial de #75, derivado de CP-CUO-003. |
| Caso de prueba | — (derivado de CP-CUO-003, I6) |
| Historia | US-45 · Crear cuentas indicando su tipo (I6) |
| Issue | #150 |
| Test de regresión | `supabase/tests/database/db_defects.test.sql` (pgTAP, corre en la CI) |
| Reportó | Sesión test-adversary (#75), coordinada por Joaquin Nuñez |
| Entorno | Local, 2026-09-28 |

Cambiar el tipo de una cuenta a no-crédito deja compras en cuotas existentes violando I6.

**Pasos para reproducir**

1. Abrir la app e iniciar sesión: en /login, escribir el email y la contraseña del usuario de prueba y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.
2. Tocar el engranaje "Ajustes" arriba a la derecha (en computadora, "Ajustes" en el menú lateral). En "Cuentas", escribir "Visa BBVA" en "Nueva cuenta", elegir "Tarjeta de crédito" en "Tipo" y tocar "Crear cuenta".
3. Registrar tres compras en cuotas con esa cuenta. En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Registrar". Después: escribir 12000 en el monto, tocar "Siguiente", tocar el chip "Otros", en "Cuenta" tocar "Visa BBVA", en "Cuotas" tocar "2", tocar "Guardar gasto" (aparece "Gasto guardado"). Repetir con "3" y con "12" en "Cuotas".
4. Obtener el token de sesión del usuario (en la consola del navegador, con la app abierta: la clave "sb-…-auth-token" de localStorage, campo access_token) y la anon key del proyecto. Las llamadas de los pasos siguientes llevan los encabezados "apikey: <anon key>" y "Authorization: Bearer <token>".
5. Obtener el id de "Visa BBVA": GET /rest/v1/accounts?select=id,name&name=eq.Visa BBVA. La pantalla no permite editar cuentas (DEF-011), por eso el cambio se hace por API.
6. Llamar a PATCH /rest/v1/accounts?id=eq.<id de Visa BBVA> con el cuerpo {"type": "cash"}.
7. Leer la respuesta y, en la base local, consultar las compras de esa cuenta: select installments_count from transactions where account_id = '<id>' and deleted_at is null.

**Resultado esperado.** I6 ("installments_count > 1 solo si la cuenta es credit_card") debería impedir este estado, o al menos advertirlo — el trigger actual (check_installments_rule) solo corre sobre transactions, nunca se dispara al editar accounts

**Resultado obtenido.** 200, el tipo cambia. Las transacciones existentes quedan con installments_count > 1 sobre una cuenta ahora cash

**Evidencia.** Respuesta del PATCH + consulta mostrando installments_count 3/2/12 con account.type = "cash" · Re-test 2026-09-28 (main 44f1519): PATCH accounts.type=cash sobre Visa BBVA → aceptado; quedan 4 compras en cuotas sobre una cuenta que ya no es de crédito (I6).

## DEF-010 · Archivar todas las categorías hace que se resiembren las 8 por defecto

| Campo | Contenido |
|---|---|
| Estado | Corregido · falta la confirmación de quien lo reportó |
| Severidad | Media |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | ejecución adversarial de #75 (ataque libre). |
| Caso de prueba | — (FR-04/FR-05) |
| Historia | US-43 · Set inicial de categorías y cuentas |
| Issue | #151 |
| Test de regresión | `tests/lib/seedPlan.test.ts` (Vitest) y `e2e/settings.spec.ts`, caso "DEF-010" (Playwright, en rojo contra producción y en verde con el arreglo) |
| Reportó | Sesión test-adversary (#75), coordinada por Joaquin Nuñez |
| Entorno | Local, 2026-09-28 |

Archivar todas las categorías hace que se resiembren las 8 por defecto.

**Pasos para reproducir**

1. Abrir la app e iniciar sesión: en /login, escribir el email y la contraseña del usuario de prueba y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.
2. Tocar el engranaje "Ajustes" arriba a la derecha (en computadora, "Ajustes" en el menú lateral).
3. En "Categorías", tocar el botón de archivar ("Archivar …") a la derecha de cada una de las 8 categorías sembradas (Comida y supermercado, Transporte, Servicios, Entretenimiento, Salud, Educación, Indumentaria, Otros), una por una, hasta que la lista quede vacía.
4. En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Registrar".
5. Escribir cualquier monto y tocar "Siguiente": mirar la grilla de categorías.
6. Volver a Ajustes y mirar la lista "Categorías". En la base local, contar las categorías del usuario: select count(*), count(*) filter (where archived_at is null) from categories where user_id = '<id>'.

**Resultado esperado.** Respetar la decisión del usuario de no tener categorías activas; ADR-014 pensó la red de contención de /register solo para un usuario que nunca se sembró, no para uno que archivó todo a propósito

**Resultado obtenido.** Aparecen 8 categorías activas nuevas (recién creadas), además de las 8 archivadas — 16 filas en total

**Evidencia.** Listado de categories del usuario de prueba con 16 filas tras el paso 2 · Re-test 2026-09-28 (main 44f1519): Tras archivar las 8 y abrir /register: activas|total = 8|16.

## DEF-011 · No se pueden editar ni archivar cuentas (medios de pago) desde la UI

| Campo | Contenido |
|---|---|
| Estado | Corregido · falta la confirmación de quien lo reportó |
| Severidad | Media |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | ejecución de CP-CFG-006 y ataque libre (#75). |
| Caso de prueba | — (FR-05, relacionado con CP-CFG-006) |
| Historia | US-45 · Cuentas (FR-05) |
| Issue | #152 |
| Test de regresión | `supabase/tests/database/delete_account.test.sql` (pgTAP) y `e2e/settings.spec.ts`, caso "DEF-011" (Playwright) |
| Reportó | Sesión test-adversary (#75), coordinada por Joaquin Nuñez |
| Entorno | Local, 2026-09-28 |

No se pueden editar ni archivar cuentas (medios de pago) desde la UI.

**Pasos para reproducir**

1. Abrir la app e iniciar sesión: en /login, escribir el email y la contraseña del usuario de prueba y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.
2. Tocar el engranaje "Ajustes" arriba a la derecha (en computadora, "Ajustes" en el menú lateral).
3. Mirar la sección "Categorías": cada fila tiene un lápiz ("Editar …") y un botón de archivar ("Archivar …").
4. Mirar la sección "Cuentas": buscar en cada fila un botón para editar el nombre o el tipo, o para archivar la cuenta.

**Resultado esperado.** FR-05: "el usuario puede crear, editar y dar de baja **sus propias categorías y medios de pago**" — solo la mitad (categorías) está implementada

**Resultado obtenido.** Cada fila muestra solo nombre y tipo, sin acciones. Las categorías sí tienen "Editar" y "Archivar" (settings-categories-edit/-archive); las cuentas no tienen equivalente

**Evidencia.** Recorrido del DOM de /settings · Re-test 2026-09-28 (main 44f1519): Botones de acción en la lista de cuentas: 0.

## DEF-012 · Un monto extremo pasa la validación del cliente y termina en un error técnico en inglés

| Campo | Contenido |
|---|---|
| Estado | Corregido · falta la confirmación de quien lo reportó |
| Severidad | Baja |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | ataque libre de #75 (valores límite no escritos). |
| Caso de prueba | — (valores límite, I4/C6) |
| Historia | US-11 · Validación del monto |
| Issue | #153 |
| Test de regresión | `tests/domain/validation.test.ts`, casos "DEF-012" (monto y equivalente en pesos), y `tests/lib/errors.test.ts` (traducción de 22003) (Vitest) |
| Reportó | Sesión test-adversary (#75), coordinada por Joaquin Nuñez |
| Entorno | Local, 2026-09-28 |

Un monto extremo pasa la validación del cliente y termina en un error técnico en inglés.

**Pasos para reproducir**

1. Abrir la app e iniciar sesión: en /login, escribir el email y la contraseña del usuario de prueba y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.
2. En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Registrar".
3. Escribir 1000000000000 en el monto (un billón: supera el máximo de numeric(14,2)). "Siguiente" queda habilitado.
4. Tocar "Siguiente" y después el chip "Otros".
5. En "Cuenta", tocar "Tarjeta de crédito" y en "Cuotas" tocar "2". Leer la previsualización ("2 cuotas de $500.000.000.000,00").
6. Tocar "Guardar gasto" y leer el aviso que aparece arriba.

**Resultado esperado.** Validación de cliente que rechace el monto antes de enviarlo, con un mensaje en español ("El monto máximo permitido es…")

**Resultado obtenido.** La previsualización de cuotas lo muestra normal ("2 cuotas de $500.000.000.000,00"). Al guardar: toast "No se pudo guardar / numeric field overflow" (mensaje técnico en inglés)

**Evidencia.** Texto literal del toast · Re-test 2026-09-28 (main 44f1519): Monto 1000000000000: Siguiente habilitado true; al guardar: "No se pudo guardar numeric field overflow".

## DEF-013 · Con un monto USD muy chico, Guardar se deshabilita sin ningún mensaje visible

| Campo | Contenido |
|---|---|
| Estado | Corregido · falta la confirmación de quien lo reportó |
| Severidad | Baja |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | ataque libre de #75 (valores límite no escritos). |
| Caso de prueba | — (valores límite) |
| Historia | US-19 · Registrar un gasto en USD |
| Issue | #154 |
| Test de regresión | `tests/domain/validation.test.ts`, caso "DEF-013" (Vitest) |
| Reportó | Sesión test-adversary (#75), coordinada por Joaquin Nuñez |
| Entorno | Local, 2026-09-28 |

Con un monto USD muy chico, Guardar se deshabilita sin ningún mensaje visible.

**Pasos para reproducir**

1. Abrir la app e iniciar sesión: en /login, escribir el email y la contraseña del usuario de prueba y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.
2. En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Registrar".
3. Tocar "US$". Escribir 0,01 en el monto.
4. En "Tipo de cambio (ARS por US$)", borrar el valor y escribir 0,01. Tocar "Siguiente".
5. Tocar el chip "Otros". En "Cuenta", tocar "Efectivo" (una cuenta que no es de crédito, así no aparece el selector de cuotas).
6. Mirar el botón "Guardar gasto" y buscar en la pantalla algún mensaje que explique por qué no se puede guardar.

**Resultado esperado.** Un mensaje visible que explique por qué no se puede guardar, sin importar si el selector de cuotas está oculto

**Resultado obtenido.** El botón Guardar queda deshabilitado, sin ningún texto de error visible. El motivo real ("Con ese monto, cada cuota daría menos de 0,01") lo genera validateTransactionDraft pero lo asigna al campo de cuotas, que no se renderiza con esa cuenta

**Evidencia.** Estado del formulario: botón deshabilitado, cero mensajes de error en pantalla · Re-test 2026-09-28 (main 44f1519): Guardar deshabilitado: true. Texto visible: "Completá cuotas para guardar". El motivo real ("cada cuota daría menos de 0,01") no se muestra.

## DEF-014 · El período 0000-01 en el dashboard muestra un error de base de datos crudo

| Campo | Contenido |
|---|---|
| Estado | Corregido · falta la confirmación de quien lo reportó |
| Severidad | Baja |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | ataque libre de #75, relacionado con CP-DAS-003. |
| Caso de prueba | — (relacionado con CP-DAS-003, Media) |
| Historia | US-26 · Cambiar de mes con un selector |
| Issue | #155 |
| Test de regresión | `tests/domain/period-fx-money.test.ts`, caso "parsePeriod rechaza el año 0000 (DEF-014)" (Vitest) |
| Reportó | Sesión test-adversary (#75), coordinada por Joaquin Nuñez |
| Entorno | Local, 2026-09-28 |

El período 0000-01 en el dashboard muestra un error de base de datos crudo.

**Pasos para reproducir**

1. Abrir la app e iniciar sesión: en /login, escribir el email y la contraseña del usuario de prueba y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.
2. Escribir en la barra del navegador la dirección de la app seguida de /dashboard?period=0000-01 y dar Enter.
3. Leer el mensaje que muestra el Resumen.
4. Para comparar, repetir con /dashboard?period=2026-13 y /dashboard?period=fecha-invalida: esos vuelven al mes actual sin error.

**Resultado esperado.** Igual que otros períodos inválidos (2026-13, fecha-invalida, <script>, 9999-12+"→"): volver silenciosamente al mes actual, sin error visible

**Resultado obtenido.** "No se pudo cargar el resumen: date/time field value out of range: …" (mensaje técnico de Postgres, en inglés)

**Evidencia.** Texto literal de la pantalla · Re-test 2026-09-28 (main 44f1519): "No se pudo cargar el resumen: date/time field value out of range: "0000-01-01""

## DEF-015 · Los botones de la paleta de color en /settings no tienen data-testid

| Campo | Contenido |
|---|---|
| Estado | Corregido · falta la confirmación de quien lo reportó |
| Severidad | Baja |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | ataque libre de #75. |
| Caso de prueba | — (07-plan-de-testing.md §2) |
| Historia | Transversal (data-testid, plan de testing §2) |
| Issue | #156 |
| Test de regresión | `e2e/settings.spec.ts`, caso "DEF-015": todo elemento interactivo de /settings tiene un data-testid único (Playwright) |
| Reportó | Sesión test-adversary (#75), coordinada por Joaquin Nuñez |
| Entorno | Local, 2026-09-28 |

Los botones de la paleta de color en /settings no tienen data-testid.

**Pasos para reproducir**

1. Abrir la app e iniciar sesión: en /login, escribir el email y la contraseña del usuario de prueba y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.
2. Tocar el engranaje "Ajustes" arriba a la derecha (en computadora, "Ajustes" en el menú lateral).
3. Abrir las herramientas de desarrollo (F12), pestaña "Elements" (o "Inspector").
4. En la sección "Categorías", hacer clic derecho sobre un círculo de color de la paleta de "Nueva categoría" y elegir "Inspeccionar".
5. En el HTML del botón (aria-label con el color, por ejemplo "#f97316"), buscar el atributo data-testid. Repetir con los demás colores.
6. Inspeccionar también los botones de lápiz y de archivar de dos categorías distintas y comparar sus data-testid.

**Resultado esperado.** "Todo elemento interactivo lleva data-testid" (07-plan-de-testing.md §2); "un elemento interactivo sin data-testid es un defecto de testeabilidad"

**Resultado obtenido.** Los 10 botones de color (aria-label="#f97316" … "#0ea5e9") tienen data-testid = null. Además settings-categories-edit/-archive se repiten idénticos en cada fila de categoría (sin distinguir cuál)

**Evidencia.** Recorrido del DOM de /settings · Re-test 2026-09-28 (main 44f1519): Botones de la paleta sin data-testid: 10.

## DEF-016 · No se puede crear ninguna deuda vinculada, ni siquiera una válida (falta SECURITY DEFINER)

| Campo | Contenido |
|---|---|
| Estado | Corregido en #183 · migración aplicada y verificada en producción el 2026-10-02; falta la confirmación de quien lo reportó |
| Severidad | Media |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | ejecución adversarial de #75, intentando verificar I7. |
| Caso de prueba | — (I7; latente, deudas no son de V1 pero el trigger ya existe en el schema) |
| Historia | V2 · Deudas (I7), latente en el schema |
| Issue | #157 |
| Test de regresión | `supabase/tests/database/db_defects.test.sql` (pgTAP, corre en la CI) |
| Reportó | Sesión test-adversary (#75), coordinada por Joaquin Nuñez |
| Entorno | Local, 2026-09-28 |

No se puede crear ninguna deuda vinculada, ni siquiera una válida (falta SECURITY DEFINER).

**Pasos para reproducir**

1. Afecta a las deudas, que son de V2 y no tienen pantalla: se reproduce por API, contra el stack local.
2. Abrir la app e iniciar sesión: en /login, escribir el email y la contraseña del usuario de prueba y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.
3. En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Registrar". Después: escribir 1000 en el monto, tocar "Siguiente", tocar el chip "Otros", en "Cuenta" tocar "Efectivo", tocar "Guardar gasto" (aparece "Gasto guardado").
4. Obtener el token de sesión del usuario (en la consola del navegador, con la app abierta: la clave "sb-…-auth-token" de localStorage, campo access_token) y la anon key del proyecto. Las llamadas de los pasos siguientes llevan los encabezados "apikey: <anon key>" y "Authorization: Bearer <token>".
5. Obtener el id de ese gasto: GET /rest/v1/transactions?select=id,amount&order=created_at.desc&limit=1.
6. Llamar a POST /rest/v1/debts con el cuerpo {"transaction_id": "<id del gasto>", "person": "Sofi", "amount": "500", "currency": "ARS", "direction": "owed_to_me", "incurred_on": "<fecha de hoy>"}. El monto (500) es menor que el gasto (1000), así que cumple I7.
7. Leer el código y el mensaje de la respuesta.

**Resultado esperado.** Aceptar una deuda válida; rechazar solo las que violan I7 con un mensaje de I7 — hoy rechaza **todas**, válidas o no

**Resultado obtenido.** 42501 "permission denied for table transactions", con hint "GRANT UPDATE ON public.transactions". El trigger check_debt_rule hace select … for update sobre transactions sin security definer, así que corre con los permisos del cliente (que no tiene UPDATE sobre esa tabla, C4)

**Evidencia.** Respuesta 42501 de la API · Re-test 2026-09-28 (main 44f1519): Insert de una deuda válida → 42501 "permission denied for table transactions". (re-test repetido en la corrida mum0fi8l: el primero omitía la columna obligatoria incurred_on y devolvía 23502)

## DEF-017 · Después de crear la cuenta no aparece la configuración inicial (US-68 sin implementar)

| Campo | Contenido |
|---|---|
| Estado | Cerrado · corregido en #173; CP-CFG-011 a CP-CFG-015 pasan en el re-test del 2026-09-29 |
| Severidad | Alta |
| Prioridad (sugerida) | A definir por el PO (sugerida: Alta, US-68 está en el alcance de la Entrega 1) |
| Encontrado en | Ejecución de la Entrega 1, caso CP-CFG-011 |
| Caso de prueba | CP-CFG-011 (bloquea CP-CFG-012 a CP-CFG-015) |
| Historia | US-68 · Configuración inicial al crear la cuenta |
| Issue | #165 |
| Reportó | Ejecución de la Entrega 1 (runner Playwright, Claude Code), supervisada por Joaquin Nuñez |
| Entorno | Local: Vite http://localhost:5180 + Supabase local, main 44f1519, Chromium 390×844, 2026-09-28 |

La historia US-68 entra en el alcance de la Entrega 1 pero no tiene implementación: no hay ruta, pantalla ni componentes de setup en src/. El issue #159 sigue abierto.

**Pasos para reproducir**

1. Versión donde ocurría: main 44f1519, antes de #173 (US-68 sin implementar).
2. Abrir la app sin sesión. En /login, tocar "Crear una cuenta".
3. Escribir un email nuevo en "Email", Clave123! en "Contraseña" y Clave123! en "Confirmar contraseña". Los cinco criterios se marcan con ✓.
4. Tocar "Crear cuenta".
5. Observar la pantalla que se abre y la URL: si aparece la configuración inicial ("¿Para qué vas a usar Biyu?") o se va directo a Registrar.

**Resultado esperado.** US-68: después de crear la cuenta se muestra el setup (para qué la usás, categorías, cuentas y primer gasto), con elementos data-testid de prefijo setup-.

**Resultado obtenido.** La app va directo a /register. No hay ningún elemento con data-testid que empiece con setup-.

**Evidencia.** evidencia/CP-CFG-011-sin-setup.jpg

**Notas.** Es una historia sin implementar más que un error de código. Se reporta como defecto porque la historia está comprometida para esta versión y sus 5 casos no pueden pasar. Los casos CP-CFG-012 a CP-CFG-015 quedan BLOCKED por este defecto.

## DEF-018 · El registro acepta un tipo de cambio con más de 4 decimales y la base lo redondea sin avisar

| Campo | Contenido |
|---|---|
| Estado | Corregido · falta la confirmación de quien lo reportó |
| Severidad | Baja |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | Exploración negativa y de borde de la Entrega 1 (EXP-01) |
| Caso de prueba | — (exploración, relacionado con CP-CUO-010 y CP-CFG-010) |
| Historia | US-21 · Pisar el tipo de cambio sugerido |
| Issue | #184 |
| Test de regresión | `tests/domain/validation.test.ts`, caso "DEF-018" (Vitest) |
| Reportó | Ejecución de la Entrega 1 (exploración de bordes EXP-01) |
| Entorno | Local: Vite http://localhost:5180 + Supabase local, main 44f1519, Chromium 390×844, 2026-09-28 |

En Ajustes el tipo de cambio de referencia se valida a 4 decimales ("Usá hasta 4 decimales"), pero en el formulario de registro no: se puede guardar un TC con 5 decimales y la base lo redondea en silencio.

**Pasos para reproducir**

1. Abrir la app e iniciar sesión: en /login, escribir el email y la contraseña del usuario de prueba y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.
2. En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Registrar".
3. Tocar "US$". Escribir 100 en el monto.
4. En "Tipo de cambio (ARS por US$)", borrar el valor y escribir 1250,55555 (5 decimales). Mirar si aparece algún aviso y el equivalente "≈ $…" que muestra el campo.
5. Tocar "Siguiente", tocar el chip "Otros", en "Cuenta" tocar "Efectivo" y tocar "Guardar gasto". Aparece "Gasto guardado".
6. En la base local, consultar la transacción guardada: select fx_rate, amount_ars from transactions order by created_at desc limit 1.
7. Para comparar: en Ajustes → "Tipo de cambio de referencia", escribir 1250,55555 en "ARS por USD" y tocar "Guardar tipo de cambio": ahí sí se rechaza con "Usá hasta 4 decimales".

**Resultado esperado.** Misma validación que en Ajustes: rechazar más de 4 decimales con un mensaje (C6: el cliente anticipa lo que la base va a hacer), o guardar exactamente lo que se mostró.

**Resultado obtenido.** Se guarda sin aviso con fx_rate 1250.5556 y amount_ars 125055.56. El equivalente en pesos que mostraba el formulario se calculó con el valor sin redondear.

**Evidencia.** Consulta a la base: fx_rate|amount_ars = 1250.5556|125055.56 (resultados.json, EXP-01).

## DEF-019 · Se pueden tener dos categorías activas que solo difieren en mayúsculas ("Salud" y "salud")

| Campo | Contenido |
|---|---|
| Estado | Corregido en #183 · migración aplicada y verificada en producción el 2026-10-02; falta la confirmación de quien lo reportó |
| Severidad | Baja |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | Exploración negativa y de borde de la Entrega 1 (EXP-02) |
| Caso de prueba | — (exploración, variante de CP-CFG-003) |
| Historia | US-42 · Crear, renombrar y elegir color de categorías |
| Issue | #185 |
| Test de regresión | `supabase/tests/database/db_defects.test.sql` (pgTAP, corre en la CI) |
| Reportó | Ejecución de la Entrega 1 (exploración de bordes EXP-02) |
| Entorno | Local: Vite http://localhost:5180 + Supabase local, main 44f1519, Chromium 390×844, 2026-09-28 |

La regla de CP-CFG-003 (no dos categorías activas con el mismo nombre) compara el nombre exacto. Cambiando solo mayúsculas se crea un duplicado que en la grilla del registro se ve como dos chips casi iguales.

**Pasos para reproducir**

1. Abrir la app e iniciar sesión: en /login, escribir el email y la contraseña del usuario de prueba y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.
2. Tocar el engranaje "Ajustes" arriba a la derecha (en computadora, "Ajustes" en el menú lateral).
3. Confirmar que en "Categorías" está activa "Salud" (sembrada al crear la cuenta).
4. En "Nueva categoría", escribir "salud" (todo en minúsculas) y tocar "Crear categoría".
5. Mirar la lista de "Categorías" y, en Registrar, la grilla de categorías (escribir un monto y tocar "Siguiente").

**Resultado esperado.** Rechazado con "Ya existe una categoría activa con ese nombre", igual que "Salud".

**Resultado obtenido.** Se acepta. Quedan activas "salud" y "Salud".

**Evidencia.** evidencia/EXP-02-salud-duplicada.jpg

**Notas.** El índice único parcial compara con distinción de mayúsculas; lo mismo aplica a cuentas (mismo mecanismo que CP-CFG-007).

## DEF-020 · El tipo de cambio sugerido se muestra con el formato de la base ("1250.0000")

| Campo | Contenido |
|---|---|
| Estado | Corregido · falta la confirmación de quien lo reportó |
| Severidad | Baja |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | Ejecución de la Entrega 1, caso CP-MON-003 |
| Caso de prueba | CP-MON-003 (PASSED: el valor sugerido es correcto) |
| Historia | US-20 · Sugerir el tipo de cambio de referencia del mes |
| Issue | #186 |
| Test de regresión | `tests/domain/draft.test.ts`, caso "DEF-020" (Vitest) |
| Reportó | Ejecución de la Entrega 1 (CP-MON-003) |
| Entorno | Local: Vite http://localhost:5180 + Supabase local, main 44f1519, Chromium 390×844, 2026-09-28 |

El valor sugerido es el correcto, pero el campo lo muestra tal como lo devuelve PostgREST, con punto decimal y 4 decimales, mientras el resto de la app usa formato argentino (Ajustes muestra "$ 1.250,00").

**Pasos para reproducir**

1. Abrir la app e iniciar sesión: en /login, escribir el email y la contraseña del usuario de prueba y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.
2. Tocar el engranaje "Ajustes" arriba a la derecha (en computadora, "Ajustes" en el menú lateral). En "Tipo de cambio de referencia", elegir el mes actual en "Mes", escribir 1250 en "ARS por USD" y tocar "Guardar tipo de cambio". La lista muestra "$ 1.250,00".
3. En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Registrar".
4. Escribir 100 en el monto y tocar "US$".
5. Leer el valor precargado en el campo "Tipo de cambio (ARS por US$)" y compararlo con el formato del equivalente "≈ $125.000,00" y con el de Ajustes.

**Resultado esperado.** "1.250" o "1.250,00", con el mismo formato que Ajustes y que el equivalente "≈ $125.000,00".

**Resultado obtenido.** "1250.0000".

**Evidencia.** evidencia/CP-MON-003-tc-sugerido.jpg

**Notas.** Cosmético: si el usuario edita el valor igual se interpreta bien. Se registra aparte para no marcar como FAILED un caso cuyo oráculo (el TC sugerido es 1250) se cumple.

## DEF-021 · Los montos grandes se salen de sus casilleros en el Resumen (celular)

| Campo | Contenido |
|---|---|
| Estado | Corregido · falta la confirmación de quien lo reportó |
| Severidad | Media |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | uso manual en producción desde un iPhone, fuera del catálogo escrito. |
| Caso de prueba | — (uso manual; relacionado con DEF-012, montos extremos) |
| Historia | US-25 · Total gastado del mes actual al entrar; US-29 · Ingresos y balance del mes; US-27 · Gasto por categoría en barras |
| Issue | #167 |
| Test de regresión | `e2e/dashboard-amounts.spec.ts` (Playwright a 360 px, en rojo contra producción y en verde contra el Preview del PR) |
| Reportó | Uso manual en producción, equipo Biyu |
| Entorno | Producción (Vercel), Safari en iPhone, ancho ~390 px, 2026-09-29 |

Con montos de 9 cifras o más, los totales del Resumen no entran en sus tarjetas: se cortan o desbordan el contenedor, y el porcentaje de "Por categoría" baja de línea.

**Pasos para reproducir**

1. Usar un iPhone con Safari (o un navegador con ancho de pantalla de unos 390 px).
2. Abrir la app e iniciar sesión: en /login, escribir el email y la contraseña del usuario de prueba y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.
3. En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Registrar". Tocar "Ingreso", escribir 81818491500 en el monto, tocar "Siguiente", en "Cuenta" tocar "Cuenta bancaria" y tocar "Guardar ingreso".
4. En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Registrar". Después: escribir 2165003118 en el monto, tocar "Siguiente", tocar el chip "Otros", en "Cuenta" tocar "Efectivo", tocar "Guardar gasto" (aparece "Gasto guardado").
5. En la barra de navegación, tocar "Resumen" (mes actual).
6. Mirar la tarjeta verde "Gastado en …", las tarjetas "Ingresos" y "Balance", y la lista "Por categoría": si algún monto se corta o se sale de su recuadro.

**Resultado esperado.** Ningún monto se corta ni desborda su contenedor, a cualquier ancho y con montos de hasta el máximo que permite numeric(14,2).

**Resultado obtenido.** El total gastado ($2.165.003.118,…) queda cortado por el borde de la tarjeta; Ingresos ($81.818.491.500) y Balance ($79.653.488.381,50) desbordan su casillero; en "Por categoría" el porcentaje "100,0 %" baja de línea.

**Evidencia.** Captura de pantalla del usuario (no se sube al repo: muestra totales de una cuenta de prueba).

**Notas.** Relacionado con DEF-012: los montos enormes entran al sistema y la UI no los soporta. El issue se había creado como DEF-018 y se renumeró a DEF-021 porque DEF-018 ya estaba asignado.

## DEF-022 · El setup de US-68 deja afuera de la app a cuentas existentes y a quien no puede guardarlo

| Campo | Contenido |
|---|---|
| Estado | Cerrado · corregido en #176 el 2026-09-29; migraciones aplicadas y verificado en producción el 2026-09-29 |
| Severidad | Crítica |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | uso en producción después del merge de #173 (US-68), fuera del catálogo escrito. |
| Caso de prueba | — (no había caso; se agregaron los tests de regresión de e2e/setup.spec.ts) |
| Historia | US-68 · Configuración inicial al crear la cuenta |
| Issue | #175 |
| Reportó | Uso en producción (usuario con cuenta previa), analizado con Claude Code, equipo Biyu |
| Entorno | Producción (Vercel + Supabase hosteado), 2026-09-29. Reproducido y verificado en local: Vite http://localhost:5180 + Supabase local, main 7812350 |

Después del merge de US-68, las cuentas creadas antes de esa historia tenían que hacer el setup otra vez, y al terminar el setup la app no avanzaba: volvía a /setup sin mensaje. Causa: "sin fila en user_setup" se leía como "setup pendiente" (las cuentas previas no tienen fila) y cualquier error al leer o guardar el estado mandaba de vuelta a /setup, un bucle sin salida cuando la escritura falla (por ejemplo, con la migración sin aplicar en la base hosteada).

**Pasos para reproducir**

1. Versión donde ocurría: main 7812350, antes de #176. En producción las migraciones de US-68 todavía no estaban aplicadas.
2. Caso A, cuenta anterior a US-68: abrir la app sin sesión y, en /login, entrar con una cuenta creada antes del merge de US-68 (#173). Para reproducirlo en local: crear una cuenta nueva, borrar su fila de configuración (delete from user_setup where user_id = '<id>') y cerrar sesión.
3. Observar la pantalla que se abre después de tocar "Entrar": si va a Registrar o a la configuración inicial ("¿Para qué vas a usar Biyu?").
4. Caso B, no se puede guardar el setup: con una cuenta nueva, en la configuración inicial, tocar "Saltear" en "¿Para qué vas a usar Biyu?", "Tus categorías" y "Tus cuentas", y en "Registrá tu primer gasto" tocar "Saltear" al pie. Esto con la escritura en user_setup fallando, como en producción sin la migración, o en local bloqueando las llamadas a /rest/v1/user_setup desde las herramientas de desarrollo (pestaña "Network" → "Block request URL").
5. Observar si la app avanza a Registrar, si aparece algún mensaje, y qué pasa al tocar "Saltear" otra vez.

**Resultado esperado.** Una cuenta existente entra directo a la app (US-01). Terminar el setup lleva a Registrar y el setup no vuelve a aparecer (US-68).

**Resultado obtenido.** La cuenta existente es obligada a hacer el setup. Al terminarlo, la app se queda en /setup: el botón vuelve a habilitarse sin ningún mensaje.

**Evidencia.** Tests de regresión en rojo antes de la corrección: e2e/setup.spec.ts (fallan "si guardar el setup falla", "si leer el estado falla" y "cuenta sin fila") y e2e/smoke.spec.ts (esperaba /register después del signup). Después de #176: e2e 28/28 en Chromium y WebKit, pgTAP 175/175, Vitest 246/246.

**Notas.** No saltó ninguna alarma porque ningún test cubría cuentas previas ni fallas al guardar, y la prueba de humo, que sí fallaba, no corre en la CI. Corrección (ADR-025 §6): trigger que crea la fila pendiente al registrarse (sin fila = cuenta anterior) y el guard falla abierto. Las migraciones se aplicaron en producción con supabase db push y el flujo se verificó allí.

## DEF-023 · Después de crear la cuenta, a veces la pantalla queda en blanco en /register

| Campo | Contenido |
|---|---|
| Estado | Abierto · encontrado el 2026-10-05 |
| Severidad | Alta |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | testeo completo del 2026-10-05: dos fallos intermitentes de e2e (setup.spec.ts y dashboard-amounts.spec.ts) contra producción. |
| Caso de prueba | — (aparece en e2e/setup.spec.ts, "una cuenta nueva ve el setup…") |
| Historia | US-68 · Configuración inicial al crear la cuenta; US-51 · Entrar directo tras registrarse |
| Issue | #193 |
| Test de regresión | A escribir con la corrección (plan de testing §5) |
| Reportó | Testeo completo posterior a #191 y #192, con Claude Code |
| Entorno | Producción (Vercel + Supabase hosteado), main e6b2e0c, 2026-10-05. Reproducido también en local (Local: Vite http://localhost:5173 + Supabase local, main e6b2e0c, Chromium y WebKit, 2026-10-05) |

Justo después de crear la cuenta, la app a veces se queda con la pantalla vacía en /register: no muestra ni la configuración inicial ni el formulario de registro. Recargar la página la destraba. Es intermitente: depende de en qué orden terminan dos pedidos.

**Pasos para reproducir**

1. Abrir /signup sin sesión.
2. Escribir un email nuevo y una contraseña válida en "Contraseña" y "Confirmar contraseña", y tocar "Crear cuenta".
3. Observar la pantalla durante los 20 segundos siguientes.
4. Repetir varias veces: en producción con WebKit pasó en 2 de 12 altas; en local, 1 de cada ~80.

**Resultado esperado.** La cuenta nueva va a la configuración inicial ("¿Para qué vas a usar Biyu?", US-68) en uno o dos segundos.

**Resultado obtenido.** La URL queda en /register y la página no muestra nada: el contenedor de la app está vacío (solo queda el de las notificaciones). La sesión sí está iniciada. Al recargar, va a /setup.

**Evidencia.** Registro de navegaciones de una corrida colgada: 3543 ms replaceState /register (RedirectIfAuthed, al aparecer la sesión) → 3737 ms replaceState /setup (AppLayout: setup pendiente) → 3740 ms replaceState /register (AuthForm). Todos los pedidos a Supabase terminan con 200/201; no hay errores de JavaScript.

**Notas.** Causa: después de signUp, AuthForm espera la siembra (ensureUserSeeded) y recién ahí navega a /register. Para entonces RedirectIfAuthed ya llevó a /register y AppLayout ya mandó a /setup: la navegación tardía de AuthForm la pisa, y el <Navigate to="/setup"> que ya se ejecutó no vuelve a dispararse. La misma carrera explica dos síntomas vistos el 2026-10-02: la cuenta que a veces entraba sin pasar por el setup y el formulario de registro que perdía el monto tipeado.

## DEF-024 · Los diálogos de confirmación no toman el foco del teclado

| Campo | Contenido |
|---|---|
| Estado | Abierto · encontrado el 2026-10-05 |
| Severidad | Media |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | testeo exploratorio del 2026-10-05 (accesibilidad). |
| Caso de prueba | — (NFR-06, WCAG 2.1 AA en flujos críticos) |
| Historia | US-65 · Eliminar una transacción; DEF-011 · Eliminar una cuenta |
| Issue | #194 |
| Test de regresión | A escribir con la corrección (plan de testing §5) |
| Reportó | Testeo completo posterior a #191 y #192, con Claude Code |
| Entorno | Local: Vite http://localhost:5173 + Supabase local, main e6b2e0c, Chromium y WebKit, 2026-10-05 |

Al abrir "¿Estás seguro de que querés eliminar esta transacción?" o "¿Seguro que querés eliminar «…»?", el foco del teclado se queda en el botón de atrás. Con teclado o lector de pantalla se sigue navegando la página de fondo, y al cerrar el foco no vuelve a un lugar previsible.

**Pasos para reproducir**

1. Iniciar sesión y abrir /settings.
2. En "Cuentas", tocar el lápiz de "Efectivo" y después "Eliminar".
3. Sin usar el mouse, mirar dónde está el foco (document.activeElement) y apretar Tab varias veces.
4. Repetir en /transactions con el tacho de un movimiento.

**Resultado esperado.** Diálogo modal accesible (WCAG 2.4.3, patrón dialog de ARIA): el foco entra al diálogo al abrirlo, Tab no sale de él, Escape lo cierra y el foco vuelve al botón que lo abrió.

**Resultado obtenido.** El foco queda en "Eliminar" (settings-accounts-delete), fuera del diálogo; Tab recorre la página de fondo.

**Evidencia.** focoAlAbrir = settings-accounts-delete, focoDentro = false. DeleteTransactionDialog tiene el mismo código y el mismo comportamiento.

**Notas.** Afecta a src/components/shared/ConfirmDialog.tsx (nuevo en #191) y a src/components/transactions/DeleteTransactionDialog.tsx (anterior).

## DEF-025 · El error al editar una cuenta o una categoría aparece fuera de la pantalla

| Campo | Contenido |
|---|---|
| Estado | Abierto · encontrado el 2026-10-05 |
| Severidad | Baja |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | testeo exploratorio del 2026-10-05. |
| Caso de prueba | — (relacionado con CP-CFG-003 y DEF-009) |
| Historia | US-42 · Categorías; DEF-011 · Editar cuentas |
| Issue | #195 |
| Test de regresión | A escribir con la corrección (plan de testing §5) |
| Reportó | Testeo completo posterior a #191 y #192, con Claude Code |
| Entorno | Local: Vite http://localhost:5173 + Supabase local, main e6b2e0c, Chromium y WebKit, 2026-10-05 |

Si guardar la edición de una cuenta o de una categoría falla, el mensaje se muestra en el formulario de alta ("Nueva cuenta" o "Nueva categoría"), entre 200 y 360 px más abajo. En la fila que se está editando no pasa nada visible.

**Pasos para reproducir**

1. Iniciar sesión y registrar un gasto en 3 cuotas con "Tarjeta de crédito".
2. Abrir /settings y, en "Cuentas", tocar el lápiz de "Tarjeta de crédito".
3. Cambiar el tipo a "Efectivo" y tocar "Guardar".
4. Para categorías: tocar el lápiz de "Transporte", escribir "OTROS" y tocar "Guardar".

**Resultado esperado.** El motivo ("Esta cuenta tiene compras en cuotas: tiene que seguir siendo tarjeta de crédito", "Ya existe una categoría activa con ese nombre") aparece en la fila que se está editando.

**Resultado obtenido.** La fila sigue abierta sin ningún cambio. El mensaje está debajo del formulario de alta: 357 px más abajo en cuentas (fuera de la pantalla, con 720 px de alto) y 209 px en categorías.

**Evidencia.** Medición en el navegador: settings-accounts-error top = 795 px, settings-accounts-save top = 438 px, alto de la ventana = 720 px.

**Notas.** Las secciones de Ajustes usan un solo estado de error para el alta y la edición.

## DEF-026 · Sin categorías activas, el registro y el setup quedan sin salida

| Campo | Contenido |
|---|---|
| Estado | Abierto · encontrado el 2026-10-05 |
| Severidad | Baja |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | testeo exploratorio del 2026-10-05, combinando DEF-010 con la configuración inicial. |
| Caso de prueba | — (derivado de DEF-010) |
| Historia | US-44 · Archivar una categoría; US-68 · Configuración inicial; US-01 · Registrar un gasto |
| Issue | #196 |
| Test de regresión | A escribir con la corrección (plan de testing §5) |
| Reportó | Testeo completo posterior a #191 y #192, con Claude Code |
| Entorno | Local: Vite http://localhost:5173 + Supabase local, main e6b2e0c, Chromium y WebKit, 2026-10-05 |

Desde DEF-010, archivar todas las categorías ya no las vuelve a sembrar. Pero entonces Registrar y la configuración inicial muestran "Todavía no tenés categorías cargadas." sin ninguna salida, y las categorías archivadas no se pueden reactivar desde ningún lado.

**Pasos para reproducir**

1. Iniciar sesión y abrir /settings.
2. En "Categorías", tocar "Archivar" en todas.
3. Ir a Registrar, escribir un monto y tocar "Siguiente".
4. Volver a Ajustes y tocar "Volver a hacer la configuración inicial"; avanzar hasta "Tus categorías" y hasta "Registrá tu primer gasto".

**Resultado esperado.** La app explica qué hacer: un acceso a Ajustes para crear o reactivar categorías, y en Ajustes una forma de reactivar las archivadas.

**Resultado obtenido.** Registrar dice "Todavía no tenés categorías cargadas." sin link. El paso "Tus categorías" del setup queda vacío, aunque dice "Destildá las que no uses". En Ajustes las archivadas no aparecen.

**Evidencia.** Capturas del paso "Tus categorías" vacío y del paso "¿En qué?" sin chips (testeo del 2026-10-05).

**Notas.** Antes de DEF-010 este caso no existía porque /register volvía a sembrar las 8 categorías.

## DEF-027 · Al llegar al límite de altas, el mensaje dice "Probá de nuevo"

| Campo | Contenido |
|---|---|
| Estado | Abierto · encontrado el 2026-10-05 |
| Severidad | Baja |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | testeo completo del 2026-10-05: la suite e2e llegó al límite de altas de Supabase Auth en producción. |
| Caso de prueba | — (relacionado con US-50 · Traducir errores de Auth) |
| Historia | US-50 · Traducir errores de Auth y evitar doble submit |
| Issue | #197 |
| Test de regresión | A escribir con la corrección (plan de testing §5) |
| Reportó | Testeo completo posterior a #191 y #192, con Claude Code |
| Entorno | Producción (Vercel + Supabase hosteado), main e6b2e0c, 2026-10-05 (429 observado). Mensaje verificado en local simulando el 429 |

Cuando Supabase Auth corta por demasiadas altas desde la misma IP (429, over_request_rate_limit), el formulario muestra el mensaje genérico "No se pudo completar la operación. Probá de nuevo". Reintentar sigue fallando durante un buen rato.

**Pasos para reproducir**

1. Crear muchas cuentas seguidas desde la misma IP (en producción alcanzó con correr la suite e2e un par de veces en una hora).
2. En /signup, completar email, contraseña y confirmación, y tocar "Crear cuenta".

**Resultado esperado.** Un mensaje que diga que hubo demasiados intentos y que hay que esperar unos minutos, como ya pasa con over_email_send_rate_limit.

**Resultado obtenido.** "No se pudo completar la operación. Probá de nuevo".

**Evidencia.** Consola de producción: "Failed to load resource: the server responded with a status of 429". Mensaje de la UI con el 429 simulado: ["No se pudo completar la operación. Probá de nuevo"].

**Notas.** translateAuthError no tiene entrada para over_request_rate_limit.
