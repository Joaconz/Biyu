# Proyecto Biyu – Entrega 1 · Ejecución de casos de prueba (V1)

Planilla: `03-ejecucion-casos-de-prueba.xlsx` (una hoja por caso con "Reporte de ejecución 1", resultado obtenido, evidencia y defectos).

## Condiciones de la ejecución

- **Fecha:** 2026-09-28 (hoy según el reloj de la corrida, hora argentina).
- **Versión probada:** `main` en el commit `44f1519` (incluye los fixes de DEF-004 y DEF-001 mergeados ese día).
- **Entorno:** Local: Vite (http://localhost:5180) + Supabase local · main 44f1519 · Chromium (Playwright) 390×844 móvil.
- **Cómo se ejecutó:** Claude Code con el runner entrega-1/ejecucion/run.mjs, supervisado por Joaquin Nuñez. El runner recorre cada caso por la UI como lo haría una persona (Playwright, emulación de celular), ejecuta las variantes API con la anon key y sesiones reales de usuarios de prueba, y usa consultas directas a la base local solo como oráculo. Cada caso guarda su resultado obtenido y, si aplica, una captura en `evidencia/`.
- **Datos:** usuarios y montos ficticios creados por la corrida (`mum0bycw`) en Supabase local. En producción no se creó nada.
- **Además:** Vitest 239/239 y pgTAP 158/158 en verde sobre el mismo commit (ver `05-reporte-de-ejecucion`).

## Resultado por caso

| ID | Prioridad | Historia | Status | Defectos |
|---|---|---|---|---|
| CP-ACC-001 | Alta | US-48 | **PASSED** | — |
| CP-ACC-002 | Alta | US-48 | **PASSED** | DEF-008 |
| CP-ACC-003 | Alta | US-50, US-51 | **PASSED** | — |
| CP-ACC-004 | Alta | US-50, US-67 | **FAILED** | DEF-005 |
| CP-ACC-005 | Alta | US-50 | **PASSED** | — |
| CP-ACC-006 | Media | US-48, US-50 | **PASSED** | — |
| CP-ACC-007 | Media | US-51 | **PASSED** | — |
| CP-ACC-008 | Alta | US-43, US-51 | **PASSED** | — |
| CP-ACC-009 | Alta | US-64 | **PASSED** | — |
| CP-ACC-010 | Media | US-49 | **PASSED** | — |
| CP-ACC-011 | Alta | US-48 | **PASSED** | — |
| CP-ACC-012 | Alta | US-66 | **PASSED** | — |
| CP-CFG-001 | Alta | US-42 | **PASSED** | — |
| CP-CFG-002 | Media | US-42 | **PASSED** | — |
| CP-CFG-003 | Media | US-42 | **PASSED** | — |
| CP-CFG-004 | Alta | US-44 | **FAILED** | DEF-006 |
| CP-CFG-005 | Baja | US-42, US-44 | **PASSED** | — |
| CP-CFG-006 | Alta | US-45 | **PASSED** | — |
| CP-CFG-007 | Media | US-45 | **PASSED** | — |
| CP-CFG-008 | Alta | US-43 | **PASSED** | — |
| CP-CFG-009 | Alta | US-46 | **PASSED** | — |
| CP-CFG-010 | Media | US-46 | **PASSED** | — |
| CP-CFG-011 | Alta | US-68 | **FAILED** | DEF-017 |
| CP-CFG-012 | Media | US-68, US-43 | **BLOCKED** | DEF-017 |
| CP-CFG-013 | Media | US-68 | **BLOCKED** | DEF-017 |
| CP-CFG-014 | Media | US-68, US-07 | **BLOCKED** | DEF-017 |
| CP-CFG-015 | Baja | US-68 | **BLOCKED** | DEF-017 |
| CP-REG-001 | Alta | US-01 | **PASSED** | — |
| CP-REG-002 | Media | US-03 | **PASSED** | — |
| CP-REG-003 | Baja | US-04, US-05 | **PASSED** | — |
| CP-REG-004 | Media | US-06 | **PASSED** | — |
| CP-REG-005 | Media | US-06 | **PASSED** | — |
| CP-REG-006 | Baja | US-07 | **PASSED** | — |
| CP-REG-007 | Baja | US-08 | **PASSED** | — |
| CP-REG-008 | Media | US-09 | **PASSED** | — |
| CP-REG-009 | Media | US-10 | **PASSED** | — |
| CP-REG-010 | Alta | US-11 | **PASSED** | — |
| CP-REG-011 | Media | US-11 | **PASSED** | — |
| CP-REG-012 | Alta | US-65 | **PASSED** | DEF-007 |
| CP-REG-013 | Alta | US-65, US-18 | **PASSED** | — |
| CP-REG-014 | Alta | US-48 | **PASSED** | — |
| CP-REG-015 | Alta | US-11 | **PASSED** | — |
| CP-REG-016 | Media | US-02 | **PASSED** | — |
| CP-CUO-001 | Alta | US-12 | **PASSED** | — |
| CP-CUO-002 | Alta | US-13 | **PASSED** | — |
| CP-CUO-003 | Alta | US-14 | **PASSED** | — |
| CP-CUO-004 | Alta | US-15 | **PASSED** | — |
| CP-CUO-005 | Alta | US-15 | **PASSED** | — |
| CP-CUO-006 | Alta | US-15, US-12 | **PASSED** | — |
| CP-CUO-007 | Media | US-16 | **PASSED** | — |
| CP-CUO-008 | Baja | US-17 | **PASSED** | — |
| CP-CUO-009 | Alta | US-18 | **PASSED** | — |
| CP-CUO-010 | Media | US-15 | **PASSED** | — |
| CP-CUO-011 | Alta | US-48 | **PASSED** | — |
| CP-CUO-012 | Alta | US-12, US-14 | **PASSED** | — |
| CP-CUO-013 | Alta | US-15 | **PASSED** | — |
| CP-MON-001 | Alta | US-19 | **PASSED** | — |
| CP-MON-002 | Alta | US-19 | **PASSED** | — |
| CP-MON-003 | Media | US-20, US-21 | **PASSED** | DEF-020 |
| CP-MON-004 | Alta | US-22 | **PASSED** | — |
| CP-MON-005 | Alta | US-23 | **PASSED** | — |
| CP-MON-006 | Baja | US-24 | **PASSED** | — |
| CP-MON-007 | Alta | US-48 | **PASSED** | — |
| CP-DAS-001 | Alta | US-25 | **PASSED** | — |
| CP-DAS-002 | Alta | US-26 | **PASSED** | — |
| CP-DAS-003 | Media | US-26 | **PASSED** | — |
| CP-DAS-004 | Media | US-27 | **PASSED** | — |
| CP-DAS-005 | Media | US-28 | **PASSED** | — |
| CP-DAS-006 | Media | US-29 | **PASSED** | — |
| CP-DAS-007 | Baja | US-29 | **PASSED** | — |
| CP-DAS-008 | Media | US-31 | **PASSED** | — |
| CP-DAS-009 | Baja | US-32 | **PASSED** | — |
| CP-DAS-010 | Media | US-33 | **PASSED** | — |
| CP-DAS-011 | Alta | US-48 | **PASSED** | — |

## Detalle

### CP-ACC-001 — Sin sesión, la app redirige al login · **PASSED**

**Esperado:** Redirige a /login?next=%2Fregister. Se ve el formulario "Entrar"; no se renderiza nada de /register.

**Obtenido:**

```text
URL final /login?next=%2Fregister; formulario de registro renderizado: no
```

**Evidencia:** [CP-ACC-001-login.jpg](evidencia/CP-ACC-001-login.jpg)

### CP-ACC-002 — Una ruta privada abierta sin sesión conserva el destino · **PASSED**

**Esperado:** Redirige a /login?next=%2Fsettings, conservando el destino original.

**Obtenido:**

```text
Redirige a /login?next=%2Fsettings. Exploración: después de iniciar sesión la app terminó en /register.
```

**Defectos:** DEF-008
**Notas:** El caso escrito pasa; el login posterior ignora el next (DEF-008 sigue reproduciéndose).

### CP-ACC-003 — Crear una cuenta con email y contraseña válidos · **PASSED**

**Esperado:** Se ve "Crear cuenta" con los criterios de contraseña. Los criterios se marcan como cumplidos; las contraseñas se ven enmascaradas. Cuenta creada con sesión activa, sin paso de confirmación por email (ADR-011); redirige a /register.

**Obtenido:**

```text
Cuenta creada; URL /register; sesión en localStorage: sí.
```

**Evidencia:** [CP-ACC-003-signup-completo.jpg](evidencia/CP-ACC-003-signup-completo.jpg) · [CP-ACC-003-post-signup.jpg](evidencia/CP-ACC-003-post-signup.jpg)

### CP-ACC-004 — Contraseñas que no cumplen los criterios se rechazan · **FAILED**

**Esperado:** Cada una se rechaza con un mensaje que dice qué criterio falta. No se crea la cuenta. Se acepta. Rechazada: FR-01 pide validar también en el servidor.

**Obtenido:**

```text
(a) abc1234 → rechazada: "Falta que la contraseña cumpla: 8 caracteres, una mayúscula, un carácter especial (!@#$%^&*...)."
(b) abcdefgh → rechazada: "Falta que la contraseña cumpla: una mayúscula, un número, un carácter especial (!@#$%^&*...)."
(c) 12345678 → rechazada: "Falta que la contraseña cumpla: una mayúscula, una minúscula, un carácter especial (!@#$%^&*...)."
(d) abcd1234 → rechazada: "Falta que la contraseña cumpla: una mayúscula, un carácter especial (!@#$%^&*...)."
(e) Abcd123! → cuenta creada
Variante API: POST /auth/v1/signup con abcd1234 → aceptada (devuelve sesión)
```

**Evidencia:** [CP-ACC-004-criterios.jpg](evidencia/CP-ACC-004-criterios.jpg)
**Defectos:** DEF-005
**Notas:** La UI rechaza (a)–(d) con el criterio que falta y acepta (e). El servidor (Supabase Auth, mínimo 6 caracteres) acepta la contraseña débil: falla la parte "validado en el servidor" de FR-01.

### CP-ACC-005 — No se puede crear una cuenta con un email ya registrado · **PASSED**

**Esperado:** Los datos se cargan. Mensaje "Ya existe una cuenta con ese email". No se crea una segunda cuenta. Error user_already_exists / email_exists.

**Obtenido:**

```text
UI: "Ya existe una cuenta con ese email". Cuentas con ese email: 1. API: código user_already_exists.
```

**Evidencia:** [CP-ACC-005-email-repetido.jpg](evidencia/CP-ACC-005-email-repetido.jpg)

### CP-ACC-006 — Credenciales inválidas en el login, sin arrastrar el error al signup · **PASSED**

**Esperado:** Mensaje "Email o contraseña incorrectos". En /signup el error anterior no aparece.

**Obtenido:**

```text
Login: "Email o contraseña incorrectos". Al pasar a /signup el error no persiste.
```

**Evidencia:** [CP-ACC-006-credenciales-invalidas.jpg](evidencia/CP-ACC-006-credenciales-invalidas.jpg)

### CP-ACC-007 — Alta sin sesión (confirmación de email activa) no entra a la app · **PASSED**

**Esperado:** Los datos se cargan. No se redirige a una ruta protegida; se muestra "Te creamos la cuenta, pero hace falta confirmar el email antes de entrar."

**Obtenido:**

```text
Mensaje: "Te creamos la cuenta, pero hace falta confirmar el email antes de entrar. Revisá tu casilla.". URL: /signup.
```

**Evidencia:** [CP-ACC-007-confirmar-email.jpg](evidencia/CP-ACC-007-confirmar-email.jpg)
**Notas:** Respuesta sin sesión simulada interceptando /auth/v1/signup con Playwright (el caso es hipotético: el proyecto no tiene confirmación de email).

### CP-ACC-008 — Una cuenta nueva tiene el catálogo inicial sembrado · **PASSED**

**Esperado:** La app entra a /register. Están las 8 categorías (Comida y supermercado, Transporte, Servicios, Entretenimiento, Salud, Educación, Indumentaria, Otros) y las 5 cuentas de FR-04.

**Obtenido:**

```text
Ajustes muestra 8 categorías y 5 cuentas; en la base hay 8 y 5.
```

**Evidencia:** [CP-ACC-008-siembra.jpg](evidencia/CP-ACC-008-siembra.jpg)

### CP-ACC-009 — Cerrar sesión y no poder volver con "atrás" · **PASSED**

**Esperado:** La sesión se cierra y redirige a /login. No se recupera el acceso: cae otra vez en /login.

**Obtenido:**

```text
Desde /register → Ajustes → Cerrar sesión: /login; "atrás" queda en /login?next=%2Fregister; sesión en storage: no
Desde /dashboard → Ajustes → Cerrar sesión: /login; "atrás" queda en /login?next=%2Fdashboard%3Fperiod%3D2026-09; sesión en storage: no
Desde /transactions → Ajustes → Cerrar sesión: /login; "atrás" queda en /login?next=%2Ftransactions%3Fperiod%3D2026-09; sesión en storage: no
```

**Evidencia:** [CP-ACC-009-logout.jpg](evidencia/CP-ACC-009-logout.jpg)
**Notas:** Con el rediseño (ADR-023) "Cerrar sesión" vive en Ajustes, que se abre desde el header de cada pantalla; el paso 1 se ejecutó por ese camino.

### CP-ACC-010 — La sesión persiste al recargar y al reabrir el navegador · **PASSED**

**Esperado:** Sigue en /register sin pedir login. La sesión persiste (localStorage).

**Obtenido:**

```text
Tras F5: /register. Navegador nuevo con el mismo almacenamiento: /register (formulario visible: sí).
```

**Notas:** El plazo de inactividad (configuración de Supabase Auth) queda fuera del caso, como dice el catálogo.

### CP-ACC-011 — Aislamiento entre usuarios en todas las tablas (par de autorización) · **PASSED**

**Esperado:** B ve 0 filas de A en categories, accounts, fx_rates, transactions, ledger_entries, debts y subscriptions. permission denied (42501) en todas.

**Obtenido:**

```text
categories: B ve 0 filas de A; anon → 42501
accounts: B ve 0 filas de A; anon → 42501
fx_rates: B ve 0 filas de A; anon → 42501
transactions: B ve 0 filas de A; anon → 42501
ledger_entries: B ve 0 filas de A; anon → 42501
debts: B ve 0 filas de A; anon → 42501
subscriptions: B ve 0 filas de A; anon → 42501
```

**Notas:** Ejecutado por API con dos sesiones reales; también cubierto por supabase/tests/database/rls_isolation.test.sql (verde en esta corrida).

### CP-ACC-012 — Contraseña y confirmación distintas bloquean el alta · **PASSED**

**Esperado:** Los dos campos se ven enmascarados. Mensaje "Las contraseñas no son iguales". No se crea la cuenta.

**Obtenido:**

```text
Mensaje: "Las contraseñas no son iguales". Campo enmascarado: sí. Cuenta creada: no.
```

**Evidencia:** [CP-ACC-012-no-coinciden.jpg](evidencia/CP-ACC-012-no-coinciden.jpg)

### CP-CFG-001 — Crear una categoría con nombre y color · **PASSED**

**Esperado:** El nombre y el color quedan cargados. Aparece en el listado activo con ese nombre y color.

**Obtenido:**

```text
Aparece "Mascotas" en el listado; en la base: Mascotas|#4a7a6d (color elegido #4a7a6d).
```

**Evidencia:** [CP-CFG-001-categoria-creada.jpg](evidencia/CP-CFG-001-categoria-creada.jpg)

### CP-CFG-002 — Renombrar una categoría y cambiarle el color · **PASSED**

**Esperado:** Se abre la edición en línea. El listado muestra el nombre y el color nuevos, sin crear una fila nueva.

**Obtenido:**

```text
Filas antes/después: 9/9. Fila editada: Comida|#9a3b3b.
```

**Evidencia:** [CP-CFG-002-categoria-editada.jpg](evidencia/CP-CFG-002-categoria-editada.jpg)

### CP-CFG-003 — No se permiten dos categorías activas con el mismo nombre · **PASSED**

**Esperado:** Rechazado con "Ya existe una categoría activa con ese nombre". Error 23505 (unique_violation).

**Obtenido:**

```text
UI: "Ya existe una categoría activa con ese nombre". API insert directo: 23505.
```

**Evidencia:** [CP-CFG-003-duplicada.jpg](evidencia/CP-CFG-003-duplicada.jpg)

### CP-CFG-004 — Archivar una categoría con historia · **FAILED**

**Esperado:** Desaparece del listado activo. No aparece en la grilla de categorías. Conserva su categoría y la muestra con una marca de archivada.

**Obtenido:**

```text
Listado activo la muestra: no. Chip en el registro: no. category_id intacto en la base (Entretenimiento|true). En /transactions el gasto "Cine" NO tiene marca de archivada.
```

**Evidencia:** [CP-CFG-004-historial.jpg](evidencia/CP-CFG-004-historial.jpg)
**Defectos:** DEF-006

### CP-CFG-005 — Reusar el nombre de una categoría archivada · **PASSED**

**Esperado:** Se permite: el índice único solo cuenta las activas.

**Obtenido:**

```text
Error mostrado: ninguno. Filas "Salidas" activas|archivadas: 1|1.
```


### CP-CFG-006 — Crear una cuenta de tarjeta de crédito · **PASSED**

**Esperado:** Aparece con el tipo en español ("Tarjeta de crédito"). Se ofrece el selector de cuotas (I6).

**Obtenido:**

```text
Tipo preseleccionado: Tarjeta de crédito▼. Fila: "Visa BBVATarjeta de crédito". Base: credit_card|ARS. Con Visa BBVA el registro ofrece cuotas: sí.
```

**Evidencia:** [CP-CFG-006-cuenta-creada.jpg](evidencia/CP-CFG-006-cuenta-creada.jpg)

### CP-CFG-007 — No se permiten dos cuentas activas con el mismo nombre · **PASSED**

**Esperado:** Rechazado con "Ya existe una cuenta activa con ese nombre". Error 23505.

**Obtenido:**

```text
UI: "Ya existe una cuenta activa con ese nombre". API insert directo: 23505 duplicate key value violates unique constraint "accounts_user_name_active_uq".
```

**Evidencia:** [CP-CFG-007-cuenta-duplicada.jpg](evidencia/CP-CFG-007-cuenta-duplicada.jpg)

### CP-CFG-008 — La siembra concurrente no duplica el catálogo · **PASSED**

**Esperado:** Las dos cargan el formulario. Exactamente 8 y 5: sin duplicados.

**Obtenido:**

```text
Dos pestañas cargando /register en paralelo sobre una cuenta sin sembrar. Categorías|cuentas resultantes: 8|5.
```


### CP-CFG-009 — Cargar y actualizar el tipo de cambio de referencia del mes · **PASSED**

**Esperado:** Se crea la referencia del mes. Se actualiza a 1300, sin duplicar la fila.

**Obtenido:**

```text
Primera carga: 1250.0000. Tras la segunda: 1|1300.0000 (filas|valor). Lista: "septiembre 2026$ 1.300,00".
```

**Evidencia:** [CP-CFG-009-tc-referencia.jpg](evidencia/CP-CFG-009-tc-referencia.jpg)

### CP-CFG-010 — Tipo de cambio de referencia en cero o negativo · **PASSED**

**Esperado:** Rechazados con "El tipo de cambio debe ser mayor a cero". Aceptado (mínimo válido). Rechazados por la base.

**Obtenido:**

```text
0 → rechazado: "El tipo de cambio debe ser mayor a cero"
-100 → rechazado: "El tipo de cambio debe ser mayor a cero"
0,01 → aceptado (base: 0.0100)
API 0: upsert directo → 42501 permission denied for table fx_rates; RPC upsert_fx_rate → 23514 el tipo de cambio debe ser mayor a cero
API -100: upsert directo → 42501 permission denied for table fx_rates; RPC upsert_fx_rate → 23514 el tipo de cambio debe ser mayor a cero
```

**Evidencia:** [CP-CFG-010-tc-invalido.jpg](evidencia/CP-CFG-010-tc-invalido.jpg)

### CP-CFG-011 — Después de crear la cuenta aparece la configuración inicial · **FAILED**

**Esperado:** La cuenta se crea. Se muestra el setup (elementos con data-testid "setup-"), con los pasos "para qué la usás", categorías, cuentas y primer gasto.

**Obtenido:**

```text
Después de crear la cuenta la app va directo a /register. Elementos con data-testid "setup-": 0. No aparece ninguna configuración inicial.
```

**Evidencia:** [CP-CFG-011-sin-setup.jpg](evidencia/CP-CFG-011-sin-setup.jpg)
**Defectos:** DEF-017

### CP-CFG-012 — Saltear todo el setup deja la siembra de siempre · **BLOCKED**

**Esperado:** El setup termina y la app abre en Registrar. Quedan las 8 categorías y 5 cuentas sembradas (US-43).

**Obtenido:**

```text
No se puede ejecutar: el flujo de configuración inicial no existe (CP-CFG-011 falló). No hay pasos que saltear, destildar ni reabrir desde Ajustes.
```

**Defectos:** DEF-017

### CP-CFG-013 — Destildar una categoría en el setup la archiva · **BLOCKED**

**Esperado:** Sigue el siguiente paso. "Educación" queda archivada, no borrada.

**Obtenido:**

```text
No se puede ejecutar: el flujo de configuración inicial no existe (CP-CFG-011 falló). No hay pasos que saltear, destildar ni reabrir desde Ajustes.
```

**Defectos:** DEF-017

### CP-CFG-014 — La cuenta elegida como predeterminada viene preseleccionada · **BLOCKED**

**Esperado:** Se abre el registro guiado. "Tarjeta de débito" viene seleccionada.

**Obtenido:**

```text
No se puede ejecutar: el flujo de configuración inicial no existe (CP-CFG-011 falló). No hay pasos que saltear, destildar ni reabrir desde Ajustes.
```

**Defectos:** DEF-017

### CP-CFG-015 — El setup no reaparece y se puede reabrir desde Ajustes · **BLOCKED**

**Esperado:** No aparece el setup: abre Registrar. Se muestra de nuevo.

**Obtenido:**

```text
No se puede ejecutar: el flujo de configuración inicial no existe (CP-CFG-011 falló). No hay pasos que saltear, destildar ni reabrir desde Ajustes.
```

**Defectos:** DEF-017

### CP-REG-001 — El registro es la pantalla de inicio · **PASSED**

**Esperado:** Cae directo en /register, en el paso del monto.

**Obtenido:**

```text
Abrir / con sesión termina en /register, con el paso del monto visible.
```

**Evidencia:** [CP-REG-001-registro-inicio.jpg](evidencia/CP-REG-001-registro-inicio.jpg)

### CP-REG-002 — La fecha viene precargada con hoy · **PASSED**

**Esperado:** Avanza al paso de detalles (ADR-024). Precargada con la fecha de hoy.

**Obtenido:**

```text
Fecha precargada: 2026-09-28 (hoy según el reloj de la corrida: 2026-09-28).
```

**Evidencia:** [CP-REG-002-fecha-hoy.jpg](evidencia/CP-REG-002-fecha-hoy.jpg)

### CP-REG-003 — Tipo "gasto" y moneda ARS por defecto · **PASSED**

**Esperado:** Tipo = Gasto; moneda = ARS; no se muestra tipo de cambio.

**Obtenido:**

```text
Gasto seleccionado: true. ARS seleccionado: true.
```

**Evidencia:** [CP-REG-003-valores-por-defecto.jpg](evidencia/CP-REG-003-valores-por-defecto.jpg)

### CP-REG-004 — Elegir la categoría tocando un chip · **PASSED**

**Esperado:** Se ve la grilla de categorías, sin ningún select. Avanza solo al paso de detalles. La transacción queda con la categoría "Transporte".

**Obtenido:**

```text
Tocar el chip avanzó solo a detalles. Categoría guardada: Transporte. Selects en el paso: 0.
```

**Evidencia:** [CP-REG-004-grilla-categorias.jpg](evidencia/CP-REG-004-grilla-categorias.jpg)

### CP-REG-005 — Una categoría archivada no se ofrece ni se acepta por API · **PASSED**

**Esperado:** La grilla no muestra "Salidas". Rechazado: "la categoría no existe, no es tuya o está archivada".

**Obtenido:**

```text
Chip "Salidas" en la grilla: no. API con la categoría archivada: "la categoría no existe, no es tuya o está archivada".
```

**Evidencia:** [CP-REG-005-grilla-sin-archivada.jpg](evidencia/CP-REG-005-grilla-sin-archivada.jpg)

### CP-REG-006 — La cuenta viene precargada con la última usada · **PASSED**

**Esperado:** "Visa BBVA" viene seleccionada.

**Obtenido:**

```text
Al volver a abrir el registro, "Visa BBVA" viene seleccionada: true.
```

**Evidencia:** [CP-REG-006-cuenta-precargada.jpg](evidencia/CP-REG-006-cuenta-precargada.jpg)

### CP-REG-007 — Guardar sin nota · **PASSED**

**Esperado:** Se guarda sin error, con description = null.

**Obtenido:**

```text
Guardado sin nota. description en la base: NULL.
```


### CP-REG-008 — Fecha de ayer sí, fecha de mañana no · **PASSED**

**Esperado:** Se guarda. Rechazado: "La fecha no puede ser futura". Rechazado también en el servidor.

**Obtenido:**

```text
Ayer (2026-09-27) → guardado: sí. Mañana (2026-09-29) → mensaje "La fecha no puede ser futura", Guardar deshabilitado: true. API con fecha futura: "FR-06: la fecha no puede ser posterior a hoy".
```

**Evidencia:** [CP-REG-008-fecha-futura.jpg](evidencia/CP-REG-008-fecha-futura.jpg)

### CP-REG-009 — Confirmación y formulario limpio después de guardar · **PASSED**

**Esperado:** Confirmación breve ("Gasto guardado"). Vuelve al paso del monto, vacío, conservando la última cuenta usada.

**Obtenido:**

```text
Toast "Gasto guardado": sí. Vuelve al paso del monto con el monto vacío: sí. Conserva la última cuenta: true.
```

**Evidencia:** [CP-REG-009-post-guardado.jpg](evidencia/CP-REG-009-post-guardado.jpg)

### CP-REG-010 — Monto vacío, cero o negativo no se guarda · **PASSED**

**Esperado:** Siguiente queda deshabilitado; no se emite ninguna escritura. Se acepta (mínimo válido). Rechazado con 23514 "I4: el monto debe ser mayor a cero".

**Obtenido:**

```text
"vacío" → Siguiente deshabilitado: true
"0" → Siguiente deshabilitado: true
"-500" → Siguiente deshabilitado: true
"0,01" → guardado con amount=0.01
API p_amount=0 → 23514 "I4: el monto debe ser mayor a cero"
API p_amount=-5 → 23514 "I4: el monto debe ser mayor a cero"
```

**Evidencia:** [CP-REG-010-monto-negativo.jpg](evidencia/CP-REG-010-monto-negativo.jpg)

### CP-REG-011 — Monto con tres decimales · **PASSED**

**Esperado:** Rechazado en cliente: "El monto admite hasta 2 decimales".

**Obtenido:**

```text
Mensaje: "El monto admite hasta 2 decimales". Siguiente deshabilitado: true. API con 100.999: rechazado "I4: el monto admite hasta 2 decimales".
```

**Evidencia:** [CP-REG-011-tres-decimales.jpg](evidencia/CP-REG-011-tres-decimales.jpg)
**Notas:** La ambigüedad 2 del catálogo queda resuelta: el servidor también rechaza más de 2 decimales (no trunca en silencio).

### CP-REG-012 — Eliminar una transacción la saca del total del mes · **PASSED**

**Esperado:** Se cierra el diálogo. El total ya no la incluye (I10). deleted_at completado: la transacción sigue existiendo, marcada como eliminada.

**Obtenido:**

```text
Total del mes antes $70.233,01 → después $20.233,01. deleted_at completado: true. En el historial (/transactions) el gasto desaparece (sin marca de eliminada).
```

**Evidencia:** [CP-REG-012-confirmar-borrado.jpg](evidencia/CP-REG-012-confirmar-borrado.jpg) · [CP-REG-012-historial-post-borrado.jpg](evidencia/CP-REG-012-historial-post-borrado.jpg)
**Defectos:** DEF-007
**Notas:** El resultado esperado del caso se cumple (soft delete y total). FR-08 pide además que quede visible en el historial con marca de eliminada: no ocurre (DEF-007).

### CP-REG-013 — Eliminar una compra con cuotas en meses cerrados avisa y es retroactivo · **PASSED**

**Esperado:** Antes de confirmar, avisa que cambian los totales de meses cerrados (2026-08 y 2026-09). Todas las imputaciones dejan de contar, también las de meses cerrados.

**Obtenido:**

```text
Aviso: "Aviso: Esta transacción tiene imputaciones en meses ya cerrados. Si la eliminás, van a cambiar los siguientes totales:"
Detalle: 2026-08 (cuota 1)-$10.000,002026-09 (cuota 2)-$10.000,00Total meses cerrados:-$20.000,00
Dashboard 2026-08 tras confirmar: vacío (la cuota ya no cuenta)
Dashboard 2026-09 tras confirmar: vacío (la cuota ya no cuenta)
Imputaciones que siguen contando: 0
```

**Evidencia:** [CP-REG-013-aviso-meses-cerrados.jpg](evidencia/CP-REG-013-aviso-meses-cerrados.jpg)
**Notas:** En la corrida anterior (#75) quedó bloqueado por no poder fijar "hoy". Acá se fijó el reloj del navegador en 2026-10-15 con page.clock de Playwright; el servidor sigue con la fecha real, que no interviene en el borrado.

### CP-REG-014 — Otro usuario no puede leer ni borrar una transacción ajena · **PASSED**

**Esperado:** 0 filas. No la encuentra; la transacción de A queda intacta.

**Obtenido:**

```text
B lee la transacción ee9d22bd… de A: 0 filas. B intenta borrarla: "la transacción no existe, ya fue eliminada o no te pertenece". Sigue activa para A: true.
```

**Notas:** Ejecutado por API con dos sesiones reales; también cubierto por supabase/tests/database/rls_isolation.test.sql (verde en esta corrida).

### CP-REG-015 — No se puede escribir en transactions salteando la RPC · **PASSED**

**Esperado:** permission denied (42501): toda escritura pasa por create_transaction (C4).

**Obtenido:**

```text
Insert directo a transactions: 42501 "permission denied for table transactions". A ledger_entries: 42501.
```

**Notas:** También cubierto por supabase/tests/database/rls_isolation.test.sql (verde en esta corrida).

### CP-REG-016 — El monto toma el foco con teclado numérico · **PASSED**

**Esperado:** El monto ya tiene el foco y el teclado numérico está abierto.

**Obtenido:**

```text
Elemento con foco al abrir: transaction-form-amount; inputmode="decimal".
```

**Notas:** Ejecutado en Chromium con emulación móvil (390×844, touch). Que el sistema operativo abra el teclado numérico no se puede observar en un navegador emulado: se verificó la condición que lo provoca (foco automático + inputmode decimal). Confirmar en un celular real antes de la demo.

### CP-CUO-001 — Compra en 12 cuotas genera 12 imputaciones consecutivas · **PASSED**

**Esperado:** Se guarda. 12 imputaciones numeradas 1 a 12, en meses consecutivos desde el de la compra.

**Obtenido:**

```text
12 imputaciones; números 1,2,3,4,5,6,7,8,9,10,11,12; períodos 2026-09 … 2027-08 consecutivos: sí.
```

**Evidencia:** [CP-CUO-001-doce-cuotas.jpg](evidencia/CP-CUO-001-doce-cuotas.jpg)

### CP-CUO-002 — Previsualización del impacto mensual antes de guardar · **PASSED**

**Esperado:** Muestra "12 cuotas de $10.000 — de 2026-08 a 2027-07" antes de tocar Guardar.

**Obtenido:**

```text
Antes de Guardar se muestra: "12 cuotas de $10.000,00 · de ago 2026 a jul 2027". Transacciones guardadas con esa fecha: 0.
```

**Evidencia:** [CP-CUO-002-previsualizacion.jpg](evidencia/CP-CUO-002-previsualizacion.jpg)
**Notas:** Contenido equivalente al esperado; cambia solo el formato ("$10.000,00" y "ago 2026 a jul 2027" en lugar de "$10.000" y "2026-08 a 2027-07") por el rediseño (ADR-023). Oráculo a actualizar en el catálogo, no es defecto.

### CP-CUO-003 — Cambiar a una cuenta que no es crédito resetea las cuotas · **PASSED**

**Esperado:** El selector de cuotas desaparece, el valor vuelve a 1 y hay un aviso. Rechazado por I6.

**Obtenido:**

```text
Con Efectivo el selector desaparece; aviso "Las cuotas volvieron a 1": sí; al volver a Visa queda en 1: true. API 6 cuotas con cuenta cash: "I6: las cuotas solo aplican a gastos con cuenta credit_card".
```

**Evidencia:** [CP-CUO-003-reset-cuotas.jpg](evidencia/CP-CUO-003-reset-cuotas.jpg)

### CP-CUO-004 — División exacta: 12 cuotas iguales · **PASSED**

**Esperado:** 12 imputaciones de exactamente $10.000; suma $120.000,00 (I1).

**Obtenido:**

```text
12 imputaciones de 10000.00. Suma amount|amount_ars = 120000.00|120000.00.
```


### CP-CUO-005 — El resto lo absorbe la última cuota · **PASSED**

**Esperado:** $33.333,33 + $33.333,33 + $33.333,34 = $100.000,00. El resto va en la última.

**Obtenido:**

```text
Cuotas: 33333.33 + 33333.33 + 33333.34 = 100000.00.
```

**Evidencia:** [CP-CUO-005-resto-ultima-cuota.jpg](evidencia/CP-CUO-005-resto-ultima-cuota.jpg)

### CP-CUO-006 — Cantidad de cuotas: 0, 1, 2, 12 y 13 · **PASSED**

**Esperado:** 0 rechazado; 1, 2 y 12 aceptados; 13 rechazado.

**Obtenido:**

```text
UI: la grilla ofrece 1,2,3,4,5,6,7,8,9,10,11,12 (no hay forma de elegir 0 ni 13).
API 0 cuotas → rechazado "las cuotas van de 1 a 12"
API 1 cuotas → aceptado
API 2 cuotas → aceptado
API 12 cuotas → aceptado
API 13 cuotas → rechazado "las cuotas van de 1 a 12"
```


### CP-CUO-007 — El Resumen separa las cuotas de meses anteriores · **PASSED**

**Esperado:** El total incluye $10.000 y "Cuotas de meses anteriores" muestra $10.000.

**Obtenido:**

```text
Dashboard 2026-09 de un usuario con solo la compra de agosto (12 × $10.000): total $10.000,00, cuotas de meses anteriores $10.000,00.
```

**Evidencia:** [CP-CUO-007-cuotas-heredadas.jpg](evidencia/CP-CUO-007-cuotas-heredadas.jpg)

### CP-CUO-008 — El listado muestra el número de cuota · **PASSED**

**Esperado:** Muestra "3/12" junto a la imputación.

**Obtenido:**

```text
En el listado de 2026-10 la imputación muestra "3/12".
```

**Evidencia:** [CP-CUO-008-numero-de-cuota.jpg](evidencia/CP-CUO-008-numero-de-cuota.jpg)

### CP-CUO-009 — Borrar una compra en cuotas saca todas sus cuotas · **PASSED**

**Esperado:** Las 12 imputaciones dejan de contar en todos los meses, incluidas las futuras.

**Obtenido:**

```text
Imputaciones que cuentan antes: 12; después: 0. En 2027-03 (cuota futura) ya no aparece: sí.
```

**Notas:** No existe opción de borrar una cuota individual: el único botón elimina la compra entera.

### CP-CUO-010 — En USD, la suma en pesos de las cuotas es exacta · **PASSED**

**Esperado:** Se guarda. Es exactamente transactions.amount_ars (I1'), sin diferencias de un centavo.

**Obtenido:**

```text
transactions.amount_ars = 125055.55; imputaciones 41685.18 + 41685.18 + 41685.19 = 125055.55.
```


### CP-CUO-011 — Otro usuario no ve las cuotas de una compra ajena · **PASSED**

**Esperado:** 0 filas.

**Obtenido:**

```text
B consulta ledger_entries de la compra en cuotas 8e08e2ae… de A: 0 filas.
```

**Notas:** Ejecutado por API con dos sesiones reales; también cubierto por supabase/tests/database/rls_isolation.test.sql (verde en esta corrida).

### CP-CUO-012 — Un ingreso no admite cuotas aunque la cuenta sea crédito · **PASSED**

**Esperado:** No aparece el selector de cuotas. Rechazado por I6.

**Obtenido:**

```text
Ingreso con Visa BBVA: selector de cuotas oculto. API ingreso en 3 cuotas: "I6: las cuotas solo aplican a gastos con cuenta credit_card".
```

**Evidencia:** [CP-CUO-012-ingreso-sin-cuotas.jpg](evidencia/CP-CUO-012-ingreso-sin-cuotas.jpg)

### CP-CUO-013 — Un fallo a mitad de create_transaction no deja datos parciales · **PASSED**

**Esperado:** La llamada devuelve error. Cero filas nuevas en ambas: todo se revierte (C4).

**Obtenido:**

```text
create_transaction($0,02 en 3 cuotas) inserta la transacción y lanza "I4: cada cuota debe ser al menos 0,01" antes de las imputaciones. Filas transactions|ledger_entries antes 13|38, después 13|38.
```

**Notas:** El fallo a mitad de camino se forzó con datos válidos para las primeras validaciones: la excepción ocurre después del INSERT en transactions y todo se revierte (C4).

### CP-MON-001 — Gasto en USD con el tipo de cambio sugerido · **PASSED**

**Esperado:** Se guarda con fx_rate = 1250 y amount_ars = 125.000.

**Obtenido:**

```text
USD 100 guardado sin tocar el TC: fx_rate|amount_ars = 1250.0000|125000.00.
```

**Evidencia:** [CP-MON-001-usd-tc-sugerido.jpg](evidencia/CP-MON-001-usd-tc-sugerido.jpg)
**Notas:** Ejecutado dentro de la secuencia de CP-MON-002 (fila 3), con la referencia del mes en 1250.

### CP-MON-002 — Tabla de decisión de moneda y tipo de cambio (6 filas) · **PASSED**

**Esperado:** Se guardan las filas 1, 3, 4 y 6. Se rechazan la 2 (ARS con TC, I5) y la 5 (USD sin ningún TC, con mensaje que pide el tipo de cambio). Mismo rechazo (I5).

**Obtenido:**

```text
Fila 5 (USD, sin referencia, sin TC): aviso "No tenés un tipo de cambio configurado", Siguiente deshabilitado: true
Fila 5 por API: rechazada "I5: fx_rate es obligatorio si y solo si la moneda es USD"
Fila 6 (USD, sin referencia, TC 1300): guardada con fx_rate 1300.0000
Fila 1 (ARS, sin TC): guardada, fx_rate NULL
Fila 2 (ARS con TC): la UI no ofrece el campo en ARS (no lo muestra); por API → rechazada "I5: fx_rate es obligatorio si y solo si la moneda es USD"
Fila 3 (USD, referencia 1250, sin override): guardada con fx_rate|amount_ars 1250.0000|125000.00
Fila 4 (USD, referencia 1250, override 1300): guardada con fx_rate 1300.0000
```

**Evidencia:** [CP-MON-002-fila5-sin-tc.jpg](evidencia/CP-MON-002-fila5-sin-tc.jpg)

### CP-MON-003 — Pisar el tipo de cambio sugerido · **PASSED**

**Esperado:** El campo sugiere 1250. Se guarda con fx_rate = 1300.

**Obtenido:**

```text
TC sugerido: "1250.0000". Al pisarlo: "Estás usando un valor distinto al de referencia. Se aplica solo a esta transacción.". Guardado con fx_rate 1300.0000.
```

**Evidencia:** [CP-MON-003-tc-sugerido.jpg](evidencia/CP-MON-003-tc-sugerido.jpg) · [CP-MON-003-tc-pisado.jpg](evidencia/CP-MON-003-tc-pisado.jpg)
**Defectos:** DEF-020
**Notas:** Re-ejecutado en la corrida mum0fi8l: en la corrida mum0bycw había dado FAILED por un error del runner (leía "1250.0000" con el parser de formato argentino como 12.500.000), no de la app. El valor sugerido se muestra como "1250.0000" (formato de la base, con punto y 4 decimales) en lugar del formato argentino que usa el resto de la app.

### CP-MON-004 — Cambiar la referencia no altera lo ya guardado · **PASSED**

**Esperado:** Se guarda. La transacción sigue valiendo $125.000; el total no cambia.

**Obtenido:**

```text
Referencia del mes ahora 1400.0000. La transacción sigue en fx_rate|amount_ars 1250.0000|125000.00. Total del dashboard antes $606.685,18, después $606.685,18.
```

**Evidencia:** [CP-MON-004-tc-congelado.jpg](evidencia/CP-MON-004-tc-congelado.jpg)

### CP-MON-005 — El total del mes en pesos incluye lo gastado en dólares · **PASSED**

**Esperado:** $175.000 ($50.000 + $125.000).

**Obtenido:**

```text
Con $50.000 ARS y USD 100 a 1250 en el mes, el total es $175.000,00.
```

**Evidencia:** [CP-MON-005-total-ars.jpg](evidencia/CP-MON-005-total-ars.jpg)

### CP-MON-006 — El gasto en dólares se ve por separado · **PASSED**

**Esperado:** Muestra "USD 100" por separado del total en ARS.

**Obtenido:**

```text
Debajo del total: "Incluye US$100,00 en dólares".
```

**Evidencia:** [CP-MON-005-total-ars.jpg](evidencia/CP-MON-005-total-ars.jpg)

### CP-MON-007 — Otro usuario no lee ni modifica el tipo de cambio ajeno · **PASSED**

**Esperado:** 0 filas al leer; el update afecta 0 filas.

**Obtenido:**

```text
B lee fx_rates de A: 0 filas. B hace update: 0 filas afectadas. El TC de A sigue en 1300.0000.
```

**Notas:** Ejecutado por API con dos sesiones reales; también cubierto por supabase/tests/database/rls_isolation.test.sql (verde en esta corrida).

### CP-DAS-001 — El Resumen abre en el mes actual con su total · **PASSED**

**Esperado:** Muestra el total gastado del mes actual.

**Obtenido:**

```text
Sin tocar el selector: período 2026-09, URL /dashboard?period=2026-09, total $175.000,00.
```


### CP-DAS-002 — El mes elegido vive en la URL · **PASSED**

**Esperado:** La URL pasa a period=2026-11.

**Obtenido:**

```text
Tras dos toques en "→": /dashboard?period=2026-11.
```


### CP-DAS-003 — Período inválido o ausente cae al mes actual · **PASSED**

**Esperado:** Cae al mes actual sin error visible y corrige la URL. Ídem.

**Obtenido:**

```text
/dashboard?period=fecha-invalida → /dashboard?period=2026-09; error visible: no
/dashboard → /dashboard?period=2026-09; error visible: no
```


### CP-DAS-004 — Gasto por categoría en barras · **PASSED**

**Esperado:** Una barra por categoría con su total, ordenadas de mayor a menor.

**Obtenido:**

```text
Barras: Salud$70.000,0046,7 % | Comida y supermercado$50.000,0033,3 % | Transporte$30.000,0020,0 %. Orden: Salud > Comida > Transporte.
```

**Evidencia:** [CP-DAS-004-barras-categoria.jpg](evidencia/CP-DAS-004-barras-categoria.jpg)

### CP-DAS-005 — Gasto por cuenta · **PASSED**

**Esperado:** Cada total coincide con la suma manual de sus transacciones.

**Obtenido:**

```text
Por cuenta: Efectivo$120.000,0080,0 % | Tarjeta de débito$30.000,0020,0 % (esperado Efectivo $120.000 = 50.000 + 70.000, Tarjeta de débito $30.000).
```

**Evidencia:** [CP-DAS-004-barras-categoria.jpg](evidencia/CP-DAS-004-barras-categoria.jpg)

### CP-DAS-006 — Ingresos y balance positivo · **PASSED**

**Esperado:** Ingresos $200.000; balance +$50.000.

**Obtenido:**

```text
Ingresos $200.000,00; balance $50.000,00 (Superávit).
```

**Evidencia:** [CP-DAS-006-ingresos-balance.jpg](evidencia/CP-DAS-006-ingresos-balance.jpg)

### CP-DAS-007 — Balance negativo con signo explícito · **PASSED**

**Esperado:** -$150.000, con signo negativo explícito.

**Obtenido:**

```text
Balance -$150.000,00, con etiqueta "Déficit".
```

**Evidencia:** [CP-DAS-007-balance-negativo.jpg](evidencia/CP-DAS-007-balance-negativo.jpg)

### CP-DAS-008 — Últimos 10 movimientos con acceso a la lista completa · **PASSED**

**Esperado:** Muestra 10. Abre Movimientos del mes con las 15.

**Obtenido:**

```text
Con 15 transacciones en el mes, el dashboard muestra 10; "Ver todos" lleva a /transactions?period=2026-09 con 15.
```

**Evidencia:** [CP-DAS-008-ultimas-10.jpg](evidencia/CP-DAS-008-ultimas-10.jpg)

### CP-DAS-009 — Una cuota heredada no cuenta como día con registro · **PASSED**

**Esperado:** 0 días.

**Obtenido:**

```text
Diciembre 2026, solo la cuota 5/12 heredada (total $10.000,00): días con registro = 0.
```

**Evidencia:** [CP-DAS-009-dias-con-registro.jpg](evidencia/CP-DAS-009-dias-con-registro.jpg)

### CP-DAS-010 — Mes sin datos: estado vacío con acceso al registro · **PASSED**

**Esperado:** Mensaje claro y un botón a /register, no un dashboard de ceros.

**Obtenido:**

```text
Estado vacío: "No tenés movimientos registrados en mayo."; el botón lleva a /register.
```

**Evidencia:** [CP-DAS-010-estado-vacio.jpg](evidencia/CP-DAS-010-estado-vacio.jpg)

### CP-DAS-011 — El Resumen de un usuario nunca muestra datos de otro · **PASSED**

**Esperado:** 0 filas.

**Obtenido:**

```text
Consultas del dashboard con la sesión de B filtrando por A: 0 filas; sin filtro, filas ajenas: 0.
```

**Notas:** Ejecutado por API con dos sesiones reales; también cubierto por supabase/tests/database/rls_isolation.test.sql (verde en esta corrida).
