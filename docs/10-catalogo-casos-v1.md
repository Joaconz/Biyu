# Catálogo de casos de prueba — V1

_Diseñado con `/new-test-case` a partir del spec (`02-behavior-spec.md`, `04-data-model.md`,
`03-architecture-spec.md`, `pre-entrega.md`), no del código. Formato de
`07-plan-de-testing.md` §4. IDs cargados en `08-trazabilidad.md`. Pasado por el agente
`spec-critic` (ver §Revisión al final)._

**Cómo leer un caso**: cada bloque declara sus 10 campos en el orden de §4 — ID, historia,
invariante, técnica, tipo, precondiciones, pasos, resultado esperado, prioridad, automatizable.
Los montos de las precondiciones son ficticios (C14). "Automatizable: V3" significa candidato al
subconjunto que se automatiza en V3 (`roadmap.md` §V3), no que ya esté automatizado. En los casos
transversales de autorización cruzada (uno por módulo, obligatorios por C7/NFR-13), el campo de
"historia de usuario" se reemplaza por la constraint que originan — no nacen de una historia
puntual, sino de la regla de RLS que aplica a todas.

Módulos: `ACC` acceso y autorización · `CFG` categorías, cuentas y TC de referencia · `REG`
registro, validaciones de alta y baja lógica · `CUO` cuotas · `MON` monedas y TC · `DAS`
dashboard.

---

## ACC — Acceso y autorización

**CP-ACC-001** — US-48 · FR-02, NFR-13 · Inv.: — · Técnica: Caso de uso · Tipo: Positivo · Prioridad: Alta · Automatizable: V3
Precondiciones: Sin sesión activa (storage vacío).
Pasos: 1) Abrir `/`. 2) Observar la URL resultante.
Resultado esperado: Redirige a `/login?next=%2Fregister`. No se renderiza contenido de `/register`.

**CP-ACC-002** — US-48 · FR-02, C7 · Inv.: — · Técnica: Adivinación de errores · Tipo: Negativo · Prioridad: Alta · Automatizable: Sí
Precondiciones: Sin sesión.
Pasos: 1) Navegar directo a `/settings` (sin pasar por `/login`). 2) Observar.
Resultado esperado: Redirige a `/login?next=%2Fsettings`, conservando el destino original.

**CP-ACC-003** — US-50 · FR-01, ADR-011 · Inv.: — · Técnica: Caso de uso · Tipo: Positivo · Prioridad: Alta · Automatizable: V3
Precondiciones: Email `nueva@test.local` sin cuenta previa.
Pasos: 1) Ir a `/signup`. 2) Completar email y contraseña `Clave123!` (cumple los 5 criterios de US-67), repetida en "Confirmar contraseña". 3) Enviar.
Resultado esperado: Cuenta creada, sesión activa inmediatamente (sin paso de confirmación por email, ADR-011), redirige a `/register`.
Nota de versión: reemplaza `clave123` (6 caracteres), desactualizado desde US-67 — ver nota de CP-ACC-004.

**CP-ACC-004** — US-50, US-67 · FR-01 · Inv.: — · Técnica: Tabla de decisión · Tipo: Negativo · Prioridad: Alta · Automatizable: Sí
Precondiciones: Email sin cuenta previa.
Pasos: Intentar crear cuenta con: (a) `abc1234` (7 caracteres, sin mayúscula ni especial), (b) `abcdefgh` (8 caracteres, solo minúsculas), (c) `12345678` (8 caracteres, solo números), (d) `abcd1234` (8 caracteres, minúscula+número, sin mayúscula ni especial), (e) `Abcd123!` (8 caracteres, cumple los 5 criterios de US-67).
Resultado esperado — **derivado de US-67** (mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial — ver `unmetPasswordCriteria` en `passwordPolicy.ts`): (a), (b), (c) y (d) rechazadas, cada una con el mensaje que indica específicamente qué falta; (e) aceptada.
Nota de versión: reemplaza la versión anterior de este caso (derivada solo de FR-01, "letra y número"), desactualizada desde que se agregó US-67 al spec — ver `08-trazabilidad.md`, fila FR-01.

**CP-ACC-005** — US-50 · FR-01 · Inv.: — · Técnica: Adivinación de errores · Tipo: Negativo · Prioridad: Alta · Automatizable: Sí
Precondiciones: Ya existe una cuenta con `prueba@biyu.local`.
Pasos: 1) Ir a `/signup`. 2) Reutilizar ese email. 3) Enviar.
Resultado esperado: Rechazado con "Ya existe una cuenta con ese email" (código `user_already_exists`/`email_exists`). No se crea una segunda cuenta.
Variante API: `POST /auth/v1/signup` directo con el mismo email → mismo código de error, sin pasar por el formulario.

**CP-ACC-006** — US-48, US-50 · FR-01 · Inv.: — · Técnica: Adivinación de errores · Tipo: Negativo · Prioridad: Media · Automatizable: Sí
Precondiciones: Ninguna cuenta con `noexiste@test.local`, o contraseña incorrecta para una que sí existe.
Pasos: 1) Ir a `/login`. 2) Completar email/contraseña inválidos. 3) Enviar. 4) Sin recargar, ir a `/signup`.
Resultado esperado: `/login` muestra "Email o contraseña incorrectos". Al pasar a `/signup`, ese error **no** persiste en el nuevo formulario (aislamiento de estado entre `mode="login"` y `mode="signup"`).

**CP-ACC-007** — US-51 · FR-01, ADR-011 · Inv.: — · Técnica: Adivinación de errores · Tipo: Límite · Prioridad: Media · Automatizable: No
Precondiciones: Hipotético: "Confirm email" se activara en el panel de Supabase (fuera del control del cliente).
Pasos: 1) Completar signup. 2) Simular que `signUp()` no devuelve `session`.
Resultado esperado: No se asume sesión ni se redirige a una ruta protegida; se muestra "Te creamos la cuenta, pero hace falta confirmar el email antes de entrar."

**CP-ACC-008** — US-43, US-51 · FR-04, ADR-014 · Inv.: — · Técnica: Caso de uso · Tipo: Positivo · Prioridad: Alta · Automatizable: V3
Precondiciones: Cuenta recién creada por `/signup`.
Pasos: 1) Completar signup. 2) Ir a `/settings`.
Resultado esperado: Existen las 8 categorías y las 5 cuentas de FR-04 (`pre-entrega.md` §3), sembradas antes de que el usuario haga nada.

**CP-ACC-009** — US-64 · FR-03 · Inv.: — · Técnica: Caso de uso · Tipo: Positivo · Prioridad: Alta · Automatizable: V3
Precondiciones: Sesión activa en `/register`, `/dashboard` o `/settings`.
Pasos: 1) Tocar "Salir" desde cualquiera de las tres pantallas. 2) Observar.
Resultado esperado: Sesión cerrada (`supabase.auth.signOut()`), redirige a `/login`. Volver atrás con el navegador no restaura el acceso a la ruta protegida (cae al guard de CP-ACC-002).

**CP-ACC-010** — US-49 · FR-03 · Inv.: — · Técnica: Caso de uso · Tipo: Positivo · Prioridad: Media · Automatizable: No
Precondiciones: Sesión activa.
Pasos: 1) Recargar la pestaña (F5). 2) Cerrar y reabrir el navegador apuntando a la misma URL.
Resultado esperado: La sesión persiste (localStorage), no vuelve a pedir login. Nota: el plazo de inactividad tras el cual el refresh token expira es configuración de Supabase Auth (Dashboard → Sessions), no verificable desde el cliente — queda fuera de este caso.

**CP-ACC-011** — (par obligatorio de autorización, C7, NFR-13) · Inv.: — · Técnica: Adivinación de errores · Tipo: Negativo · Prioridad: Alta · Automatizable: Sí
Precondiciones: Dos usuarios A y B, cada uno con sus propias `categories`/`accounts`/`fx_rates`/`transactions`/`ledger_entries`/`debts`/`subscriptions`.
Pasos: 1) Con la sesión de B, consultar cada tabla. 2) Con rol `anon` (sin sesión), consultar cada tabla.
Resultado esperado: B ve 0 filas de A en todas las tablas (RLS no distingue "no existe" de "no es tuyo"). `anon` recibe `permission denied` (42501) en todas. **Ya implementado y verde**: `supabase/tests/database/rls_isolation.test.sql` (34 aserciones).

---

## CFG — Categorías, cuentas y TC de referencia

**CP-CFG-001** — US-42 · FR-05 · Inv.: — · Técnica: Caso de uso · Tipo: Positivo · Prioridad: Alta · Automatizable: V3
Precondiciones: Usuario con categorías sembradas.
Pasos: 1) Ir a `/settings`. 2) Completar nombre "Mascotas" y elegir un color de la paleta. 3) Crear.
Resultado esperado: Aparece en el listado activo con ese nombre y color.

**CP-CFG-002** — US-42 · FR-05 · Inv.: — · Técnica: Caso de uso · Tipo: Positivo · Prioridad: Media · Automatizable: V3
Precondiciones: Categoría "Comida y supermercado" activa.
Pasos: 1) Tocar "Editar". 2) Cambiar nombre a "Comida" y el color. 3) Guardar.
Resultado esperado: El nombre y el color se actualizan en el listado, sin crear una fila nueva.

**CP-CFG-003** — US-42 · FR-05 · Inv.: — · Técnica: Adivinación de errores · Tipo: Negativo · Prioridad: Media · Automatizable: Sí
Precondiciones: Ya existe una categoría activa llamada "Salud".
Pasos: 1) Intentar crear otra categoría llamada "Salud".
Resultado esperado: Rechazado (índice único parcial `user_id, name where archived_at is null`); mensaje "Ya existe una categoría activa con ese nombre".
Variante API: `insert` directo a `categories` con el mismo nombre → `23505` (unique_violation).

**CP-CFG-004** — US-44 · FR-05, C10 · Inv.: — · Técnica: Caso de uso · Tipo: Positivo · Prioridad: Alta · Automatizable: V3
Precondiciones: Categoría "Entretenimiento" con al menos una transacción histórica que la usa.
Pasos: 1) Archivar "Entretenimiento". 2) Ir al listado activo de categorías. 3) Abrir la transacción histórica.
Resultado esperado: Desaparece del listado activo (y del futuro formulario de registro). La transacción histórica conserva `category_id` intacto y sigue mostrando "Entretenimiento" con marca de archivada.

**CP-CFG-005** — US-42, US-44 · FR-05 · Inv.: — · Técnica: Tabla de decisión · Tipo: Límite · Prioridad: Baja · Automatizable: Sí
Precondiciones: Categoría "Salidas" archivada.
Pasos: 1) Crear una categoría nueva llamada "Salidas" (mismo nombre que la archivada).
Resultado esperado: Se permite — el índice único es parcial (`where archived_at is null`), reutiliza el nombre.

**CP-CFG-006** — US-45 · FR-05, I6 · Inv.: I6 · Técnica: Caso de uso · Tipo: Positivo · Prioridad: Alta · Automatizable: V3
Precondiciones: Usuario con cuentas sembradas.
Pasos: 1) En `/settings`, completar nombre "Visa BBVA", tipo `credit_card`, moneda ARS. 2) Crear.
Resultado esperado: Aparece en el listado con el tipo mostrado en español ("Tarjeta de crédito"), disponible luego para cuotas (I6).

**CP-CFG-007** — US-45 · FR-05 · Inv.: — · Técnica: Adivinación de errores · Tipo: Negativo · Prioridad: Media · Automatizable: Sí
Precondiciones: Ya existe una cuenta activa llamada "Efectivo".
Pasos: 1) Intentar crear otra cuenta llamada "Efectivo".
Resultado esperado: Rechazado, mismo mecanismo que CP-CFG-003 sobre `accounts`.
Variante API: `insert` directo a `accounts` con el mismo nombre activo → `23505` (unique_violation, `accounts_user_name_active_uq`).

**CP-CFG-008** — US-43 · FR-04, ADR-014 · Inv.: — · Técnica: Adivinación de errores · Tipo: Límite · Prioridad: Alta · Automatizable: No
Precondiciones: Usuario recién creado, dos pestañas abiertas simultáneamente en `/register` (o dos llamadas concurrentes a `ensureUserSeeded`).
Pasos: 1) Disparar la siembra dos veces en paralelo (dos tabs cargando `/register` al mismo tiempo).
Resultado esperado: No quedan categorías ni cuentas duplicadas — la segunda llamada recibe `23505` en las filas que la primera ya insertó y lo ignora (best-effort, ADR-014).

**CP-CFG-009** — US-46 · FR-12 · Inv.: — · Técnica: Caso de uso · Tipo: Positivo · Prioridad: Alta · Automatizable: V3
Precondiciones: Período 2026-09 sin tipo de cambio cargado.
Pasos: 1) En `/settings`, elegir mes 2026-09 y cargar `1250`. 2) Guardar. 3) Volver a cargar el mismo mes con `1300`.
Resultado esperado: Primera carga crea la fila. Segunda carga la **actualiza** (upsert sobre `user_id, period`) a 1300, sin duplicar — no altera transacciones ya guardadas con `fx_rate` propio (C5, ver CP-MON-004).

**CP-CFG-010** — US-46 · FR-12 · Inv.: — · Técnica: Valores límite · Tipo: Límite · Prioridad: Media · Automatizable: Sí
Precondiciones: Ninguna.
Pasos: 1) Intentar cargar TC de referencia con valor `0`. 2) Repetir con `-100`. 3) Repetir con `0,01` (aceptar formato argentino).
Resultado esperado: `0` y `-100` rechazados ("El tipo de cambio debe ser mayor a cero"); `0,01` aceptado (`ars_per_usd > 0` en base).
Variante API: `upsert` directo a `fx_rates` con `ars_per_usd = 0` o `-100` → rechazado por `fx_rates_ars_per_usd_positive` (check constraint), sin pasar por el formulario.

---

## REG — Registro de transacciones, validaciones de alta y baja lógica

**CP-REG-001** — US-01 · FR-06 · Inv.: — · Técnica: Caso de uso · Tipo: Positivo · Prioridad: Alta · Automatizable: V3
Precondiciones: Usuario autenticado.
Pasos: 1) Abrir la app (`/`).
Resultado esperado: Cae directo en `/register`, sin pasos intermedios.

**CP-REG-002** — US-03 · FR-06, C1 · Inv.: — · Técnica: Caso de uso · Tipo: Positivo · Prioridad: Media · Automatizable: Sí
Precondiciones: Hoy = 2026-09-28 (fijo como dato de precondición, C1).
Pasos: 1) Abrir `/register`. 2) Cargar un monto y avanzar hasta el paso de detalles (ADR-024). 3) Observar el campo fecha.
Resultado esperado: Precargado con 2026-09-28.

**CP-REG-003** — US-04, US-05 · FR-06 · Inv.: — · Técnica: Caso de uso · Tipo: Positivo · Prioridad: Baja · Automatizable: Sí
Precondiciones: Formulario recién abierto.
Pasos: 1) Observar tipo y moneda por defecto.
Resultado esperado: Tipo = "gasto", moneda = ARS.

**CP-REG-016** — US-02 · FR-06, NFR-07 · Inv.: — · Técnica: Caso de uso · Tipo: Positivo · Prioridad: Media · Automatizable: No
Precondiciones: Ninguna.
Pasos: 1) Abrir `/register` en un celular (o emular teclado táctil). 2) Observar el campo de monto sin tocar nada.
Resultado esperado: El campo de monto ya tiene el foco y el teclado numérico está abierto, sin necesidad de tocar el campo — habilita cargar en menos de 10 segundos (NFR-07).

**CP-REG-004** — US-06 · FR-06, I8 · Inv.: I8 · Técnica: Caso de uso · Tipo: Positivo · Prioridad: Media · Automatizable: Sí
Precondiciones: Categorías activas sembradas.
Pasos: 1) Cargar un monto y tocar Siguiente. 2) Tocar el chip "Transporte" (avanza solo al paso de detalles). 3) Guardar.
Resultado esperado: La transacción queda con `category_id` de "Transporte", sin abrir ningún `select`.

**CP-REG-005** — US-06 · FR-06 · Inv.: — · Técnica: Adivinación de errores · Tipo: Negativo · Prioridad: Media · Automatizable: Sí
Precondiciones: Categoría "Salidas" archivada (ver CP-CFG-004).
Pasos: 1) Abrir `/register`, cargar un monto y tocar Siguiente. 2) Buscar el chip "Salidas" en la grilla.
Resultado esperado: No aparece — el formulario solo muestra categorías activas.
Variante API: `create_transaction` con el `p_category_id` de "Salidas" (archivada) → rechazado con "la categoría no existe, no es tuya o está archivada" (`create_transaction_rpc.sql`, chequeo explícito de `archived_at is null`). Confirmado en el código de la función, no es una ambigüedad.

**CP-REG-006** — US-07 · FR-06 · Inv.: — · Técnica: Caso de uso · Tipo: Positivo · Prioridad: Baja · Automatizable: Sí
Precondiciones: Se guardó la última transacción con la cuenta "Visa BBVA".
Pasos: 1) Volver a abrir `/register` y avanzar hasta el paso de detalles.
Resultado esperado: Cuenta precargada en "Visa BBVA".

**CP-REG-007** — US-08 · FR-06 · Inv.: — · Técnica: Valores límite · Tipo: Límite · Prioridad: Baja · Automatizable: Sí
Precondiciones: Formulario completo salvo descripción.
Pasos: 1) Dejar descripción vacía. 2) Guardar.
Resultado esperado: Se guarda con `description = null`, sin error.

**CP-REG-008** — US-09 · FR-06 · Inv.: — · Técnica: Valores límite · Tipo: Límite · Prioridad: Media · Automatizable: Sí
Precondiciones: Hoy = 2026-09-28.
Pasos: 1) Cargar un gasto con fecha 2026-09-27 (ayer). 2) Repetir con 2026-09-29 (mañana), sin cuotas ni suscripción futura.
Resultado esperado: Ayer → aceptado. Mañana → rechazado ("La fecha no puede ser futura"), salvo que corresponda a una cuota/suscripción ya comprometida (fuera de este caso).
Variante API: `create_transaction` con `occurred_on` futuro y sin `subscription_id` → rechazado en servidor también.

**CP-REG-009** — US-10 · FR-06 · Inv.: — · Técnica: Caso de uso · Tipo: Positivo · Prioridad: Media · Automatizable: Sí
Precondiciones: Formulario completo.
Pasos: 1) Guardar. 2) Observar.
Resultado esperado: Confirmación breve, formulario vuelve a su estado inicial en el paso del monto (ADR-024), conservando la última cuenta usada (CP-REG-006).

**CP-REG-010** — US-11 · FR-06, I4, C6 · Inv.: I4 · Técnica: Valores límite · Tipo: Negativo · Prioridad: Alta · Automatizable: Sí
Precondiciones: Ninguna.
Pasos: 1) Dejar el monto vacío e intentar guardar. 2) Ingresar `0`. 3) Ingresar `-500`. 4) Ingresar `0,01`.
Resultado esperado: Vacío, `0` y `-500` → el botón del paso (Siguiente en el paso del monto, ADR-024) queda deshabilitado, no se emite ninguna escritura. `0,01` → aceptado (mínimo válido).
Variante API: `create_transaction` con `p_amount = 0` o negativo → rechazado por la RPC con `23514 "I4: el monto debe ser mayor a cero"`, sin pasar por el cliente. (Ejecutado en #75: confirmado — el rechazo lo hace la validación explícita dentro de la función, no un `check` de tabla.)

**CP-REG-011** — US-11 · FR-06 · Inv.: I4 · Técnica: Valores límite · Tipo: Límite · Prioridad: Media · Automatizable: Sí
Precondiciones: Ninguna.
Pasos: 1) Ingresar un monto con 3 decimales, ej. `100,999`.
Resultado esperado: Rechazado en cliente ("El monto admite hasta 2 decimales"); si llegara a la base, `numeric(14,2)` trunca/redondea — el caso documenta que el cliente es quien previene la ambigüedad (C6).

**CP-REG-012** — US-65 · FR-08, C10, I10 · Inv.: I10 · Técnica: Caso de uso · Tipo: Positivo · Prioridad: Alta · Automatizable: V3
Precondiciones: Transacción de $50.000 ARS en el mes actual, sin cuotas.
Pasos: 1) Eliminarla desde el listado. 2) Confirmar el aviso. 3) Ver el dashboard del mes.
Resultado esperado: `deleted_at` se completa (soft delete). El total del mes ya no la incluye (I10). La transacción sigue existiendo con marca de eliminada, no desaparece de la base.

**CP-REG-013** — US-65, US-18 · FR-08, C10, I10 · Inv.: I10 · Técnica: Adivinación de errores · Tipo: Límite · Prioridad: Alta · Automatizable: V3
Precondiciones: Compra de $120.000 en 12 cuotas registrada en 2026-08; hoy es 2026-10 (dos cuotas ya "cerradas": agosto y septiembre).
Pasos: 1) Eliminar la transacción desde octubre. 2) Ver el dashboard de agosto y de septiembre.
Resultado esperado: Se advierte explícitamente antes de confirmar que esto altera totales de meses ya cerrados. Al confirmar, **todas** las imputaciones (incluidas agosto y septiembre) dejan de contar — efecto retroactivo (BDD "borrado lógico saca las imputaciones del cálculo").

**CP-REG-014** — (par de autorización, C7) · Inv.: — · Técnica: Adivinación de errores · Tipo: Negativo · Prioridad: Alta · Automatizable: Sí
Precondiciones: Transacción de A.
Pasos: 1) Con la sesión de B, intentar leer/eliminar esa transacción por ID.
Resultado esperado: 0 filas al leer (RLS); `create_transaction`/eliminar sobre un ID ajeno no encuentra la fila y no afecta nada de A. **Ya cubierto** por `rls_isolation.test.sql`.

**CP-REG-015** — US-11 · C4 · Inv.: I1, I1' · Técnica: Adivinación de errores · Tipo: Negativo · Prioridad: Alta · Automatizable: Sí
Precondiciones: Ninguna.
Pasos: 1) Intentar un `insert` directo a `transactions` (saltando `create_transaction`).
Resultado esperado: Rechazado con `permission denied` (42501) — `transactions`/`ledger_entries` son de solo lectura para el rol `authenticated`; toda escritura pasa por la RPC (C4). **Ya cubierto** por `rls_isolation.test.sql`.

---

## CUO — Cuotas

**CP-CUO-001** — US-12 · FR-09, I2, I3 · Inv.: I2, I3 · Técnica: Caso de uso · Tipo: Positivo · Prioridad: Alta · Automatizable: V3
Precondiciones: Cuenta "Visa BBVA" tipo `credit_card`.
Pasos: 1) Elegir esa cuenta en el formulario. 2) Elegir 12 cuotas. 3) Guardar $120.000.
Resultado esperado: Se crean 12 imputaciones consecutivas desde el mes de la compra, `installment_number` de 1 a 12 sin huecos (I2, I3).

**CP-CUO-002** — US-13 · FR-09 · Inv.: — · Técnica: Caso de uso · Tipo: Positivo · Prioridad: Alta · Automatizable: No
Precondiciones: Gasto de $120.000 en 12 cuotas, fecha 2026-08-15.
Pasos: 1) Completar el formulario sin guardar todavía. 2) Observar la previsualización.
Resultado esperado: Muestra "12 cuotas de $10.000 — de 2026-08 a 2027-07" antes de tocar Guardar.

**CP-CUO-003** — US-14 · I6 · Inv.: I6 · Técnica: Tabla de decisión · Tipo: Negativo · Prioridad: Alta · Automatizable: Sí
Precondiciones: 6 cuotas elegidas con cuenta "Visa BBVA" (`credit_card`).
Pasos: 1) Cambiar la cuenta a "Efectivo" (`cash`). 2) Observar el selector de cuotas.
Resultado esperado: El selector desaparece, el valor vuelve a 1, con aviso de que se restableció.
Variante API: `create_transaction` con `p_installments_count = 6` y una cuenta `cash` → rechazado por el trigger `check_installments_rule` (I6), aunque la UI lo hubiera prevenido.

**CP-CUO-004** — US-15 · FR-10, FR-11, I1, I1', C3, ADR-013 · Inv.: I1, I1' · Técnica: Valores límite · Tipo: Positivo · Prioridad: Alta · Automatizable: V3
Precondiciones: Ninguna.
Pasos: 1) Guardar $120.000 en 12 cuotas (división exacta).
Resultado esperado: 12 imputaciones de exactamente $10.000. Suma = $120.000.00 (I1).

**CP-CUO-005** — US-15 · FR-10, FR-11, I1, C3, ADR-013 · Inv.: I1 · Técnica: Valores límite · Tipo: Límite · Prioridad: Alta · Automatizable: V3
Precondiciones: Ninguna.
Pasos: 1) Guardar $100.000 en 3 cuotas (33.333,333...).
Resultado esperado: Dos cuotas de $33.333,33 y la última de $33.333,34. Suma exacta = $100.000,00. El resto **siempre** lo absorbe la última cuota, nunca la primera.

**CP-CUO-006** — US-15 · FR-09 · Inv.: — · Técnica: Tabla de decisión · Tipo: Límite · Prioridad: Alta · Automatizable: Sí
Precondiciones: Cuenta `credit_card`.
Pasos: Intentar guardar con cantidad de cuotas = 0, 1, 2, 12 y 13.
Resultado esperado: 0 → rechazado. 1 → aceptado (transacción sin cuotas, técnicamente 1 imputación). 2 → aceptado. 12 → aceptado (tope). 13 → rechazado. (Ejecutado en #75: confirmado por API — 0 y 13 dan `23514 "las cuotas van de 1 a 12"`, mensaje de la RPC `create_transaction`, no de un check `transactions_installments_max` como sugería ADR-020.)

**CP-CUO-007** — US-16 · FR-20 · Inv.: — · Técnica: Caso de uso · Tipo: Positivo · Prioridad: Media · Automatizable: V3
Precondiciones: Gasto de $120.000 en 12 cuotas registrado en 2026-08.
Pasos: 1) Ir al dashboard del período 2026-09.
Resultado esperado: El total del período incluye $10.000, y el KPI "cuotas de meses anteriores" también muestra $10.000 (BDD "el dashboard separa cuotas heredadas").

**CP-CUO-008** — US-17 · FR-20 · Inv.: — · Técnica: Caso de uso · Tipo: Positivo · Prioridad: Baja · Automatizable: Sí
Precondiciones: Compra en 12 cuotas, viendo la imputación número 3.
Pasos: 1) Ver el listado de transacciones del mes.
Resultado esperado: Muestra "3/12" junto a esa imputación.

**CP-CUO-009** — US-18 · FR-08, I10 · Inv.: I10 · Técnica: Caso de uso · Tipo: Positivo · Prioridad: Alta · Automatizable: V3
Precondiciones: Compra de $120.000 en 12 cuotas.
Pasos: 1) Eliminar la compra (no una cuota individual — no existe esa opción).
Resultado esperado: Las 12 imputaciones dejan de contar en todos los meses, incluidas las futuras (ver también CP-REG-013, mismo mecanismo).

**CP-CUO-012** — US-12 · I6 · Inv.: I6 · Técnica: Tabla de decisión · Tipo: Negativo · Prioridad: Alta · Automatizable: Sí
Precondiciones: Cuenta "Visa BBVA" (`credit_card`).
Pasos: 1) Cargar un **ingreso** (`type = income`) con esa cuenta. 2) Intentar elegir más de 1 cuota.
Resultado esperado: El selector de cuotas no aplica a ingresos (Asunción 6, `02-behavior-spec.md`: "los ingresos no van en cuotas"). I6 exige `type = expense` **y** cuenta `credit_card`, no alcanza con la cuenta sola — este caso ejercita la cláusula de tipo que `CP-CUO-003` no cubre.
Variante API: `create_transaction` con `p_type = 'income'`, `p_installments_count = 3` y cuenta `credit_card` → rechazado por el mismo trigger/chequeo de I6 en el servidor (`installments_count > 1 and not (type = expense and account = credit_card)`).

**CP-CUO-010** — US-15 · C2 · Inv.: I1' · Técnica: Adivinación de errores · Tipo: Límite · Prioridad: Media · Automatizable: Sí
Precondiciones: Gasto de USD 100 en 3 cuotas con `fx_rate = 1250,5555`.
Pasos: 1) Guardar. 2) Sumar `ledger_entries.amount_ars` de las 3 imputaciones.
Resultado esperado: La suma es exactamente `transactions.amount_ars` (I1'), no la suma de conversiones cuota a cuota redondeadas por separado — ver el ejemplo trabajado de `04-data-model.md` (diferencia de 1 centavo si se calculara mal).

**CP-CUO-011** — (par de autorización) · C7 · Inv.: — · Técnica: Adivinación de errores · Tipo: Negativo · Prioridad: Alta · Automatizable: Sí
Precondiciones: Compra en cuotas de A.
Pasos: 1) Con la sesión de B, consultar `ledger_entries` filtrando por el `transaction_id` de A.
Resultado esperado: 0 filas. **Ya cubierto** por `rls_isolation.test.sql`.

**CP-CUO-013** — (sad path "fallo parcial de escritura", `02-behavior-spec.md`) · C4 · Inv.: I1, I1' · Técnica: Adivinación de errores · Tipo: Negativo · Prioridad: Alta · Automatizable: Sí
Precondiciones: Ninguna transacción previa.
Pasos: 1) En un test de pgTAP, forzar que la generación de imputaciones dentro de `create_transaction` lance una excepción a mitad de camino (por ejemplo, con un `installments_count` que produzca un valor que viole una constraint de `ledger_entries` de forma controlada). 2) Contar filas en `transactions` y `ledger_entries` después del intento.
Resultado esperado: **Cero filas nuevas en ambas tablas** — la función es una sola unidad transaccional (C4); no puede quedar una `transaction` sin sus `ledger_entries`. Si el fallo no puede forzarse limpiamente con datos de entrada válidos, el caso queda documentado como prueba de humo del código de la función (revisión manual de que no hay un `commit` intermedio), no como caso ejecutable — a decidir en #75.

---

## MON — Monedas y tipo de cambio

**CP-MON-001** — US-19 · FR-12, I5 · Inv.: I5 · Técnica: Tabla de decisión · Tipo: Positivo · Prioridad: Alta · Automatizable: V3
Precondiciones: TC de referencia de 2026-09 = 1250.
Pasos: 1) Elegir moneda USD, monto 100. 2) Guardar sin tocar el tipo de cambio.
Resultado esperado: Se guarda con `fx_rate = 1250` (sugerido), `amount_ars = 125000`.

**CP-MON-002** — US-19 · FR-12, I5 · Inv.: I5 · Técnica: Tabla de decisión · Tipo: Negativo · Prioridad: Alta · Automatizable: Sí
Precondiciones: Ninguna.
Pasos: Las seis filas de la tabla de decisión de `07-plan-de-testing.md` §3: (ARS, sin TC ingresado), (ARS, con TC ingresado), (USD, TC de referencia existe, sin override), (USD, TC de referencia existe, con override), (USD, sin TC de referencia, sin override), (USD, sin TC de referencia, con override).
Resultado esperado: Se guarda en las filas 1, 3, 4 y 6. Se rechaza en la fila 2 (ARS con TC presente, I5) y en la fila 5 (USD sin ningún TC disponible, con mensaje que pide el tipo de cambio).
Variante API: fila 2 y 5 repetidas contra `create_transaction` directo → mismo rechazo (`transactions_fx_rate_iff_usd`, I5).

**CP-MON-003** — US-20, US-21 · FR-12 · Inv.: — · Técnica: Caso de uso · Tipo: Positivo · Prioridad: Media · Automatizable: Sí
Precondiciones: TC de referencia de 2026-09 = 1250.
Pasos: 1) Elegir USD. 2) Ver el TC sugerido. 3) Pisarlo con 1300. 4) Guardar.
Resultado esperado: El campo sugiere 1250 automáticamente; al pisarlo, se guarda con `fx_rate = 1300` (el override gana, `resolveFxRate`).

**CP-MON-004** — US-22 · C5, ADR-002 · Inv.: — · Técnica: Adivinación de errores · Tipo: Positivo · Prioridad: Alta · Automatizable: V3
Precondiciones: Gasto de USD 100 guardado en 2026-09 con `fx_rate = 1250` (`amount_ars = 125000`).
Pasos: 1) Ir a Configuración y cambiar el TC de referencia de 2026-09 a 1400. 2) Volver a ver esa transacción y el dashboard de 2026-09.
Resultado esperado: El monto en ARS de esa transacción **sigue siendo** $125.000 (BDD "el tipo de cambio queda congelado"). El nuevo TC solo afecta a transacciones futuras.

**CP-MON-005** — US-23 · FR-20, I1' · Inv.: I1' · Técnica: Caso de uso · Tipo: Positivo · Prioridad: Alta · Automatizable: V3
Precondiciones: Un gasto de $50.000 ARS y uno de USD 100 (`fx_rate=1250`) en el mismo mes.
Pasos: 1) Ver el total del mes en el dashboard.
Resultado esperado: Muestra $175.000 ($50.000 + $125.000 convertidos), un único número comparable.

**CP-MON-006** — US-24 · FR-20 · Inv.: — · Técnica: Caso de uso · Tipo: Positivo · Prioridad: Baja · Automatizable: Sí
Precondiciones: Gasto de USD 100 en el mes.
Pasos: 1) Ver el desglose de USD nativo en el dashboard.
Resultado esperado: Muestra "USD 100" por separado del total en ARS.

**CP-MON-007** — (par de autorización) · C7 · Inv.: — · Técnica: Adivinación de errores · Tipo: Negativo · Prioridad: Alta · Automatizable: Sí
Precondiciones: `fx_rates` de A para 2026-09.
Pasos: 1) Con la sesión de B, leer/actualizar esa fila.
Resultado esperado: 0 filas al leer; `update` de B sobre esa fila afecta 0 registros. **Ya cubierto** por `rls_isolation.test.sql`.

---

## DAS — Dashboard mensual

**CP-DAS-001** — US-25 · FR-20, I10 · Inv.: I10 · Técnica: Caso de uso · Tipo: Positivo · Prioridad: Alta · Automatizable: V3
Precondiciones: Transacciones cargadas en el mes actual.
Pasos: 1) Entrar a `/dashboard` sin tocar el selector de mes.
Resultado esperado: Muestra el total gastado del mes actual, resuelto automáticamente (sin que el usuario filtre nada).

**CP-DAS-002** — US-26 · FR-21, C11 · Inv.: — · Técnica: Caso de uso · Tipo: Positivo · Prioridad: Alta · Automatizable: Sí
Precondiciones: En `/dashboard?period=2026-09`.
Pasos: 1) Tocar "→" dos veces.
Resultado esperado: `period=2026-11` en la URL (C11: el período vive en la URL, es enlazable).

**CP-DAS-003** — US-26 · C11 · Inv.: — · Técnica: Adivinación de errores · Tipo: Límite · Prioridad: Media · Automatizable: Sí
Precondiciones: Ninguna.
Pasos: 1) Abrir `/dashboard?period=fecha-invalida`. 2) Abrir `/dashboard` sin el parámetro.
Resultado esperado: En ambos casos cae al período actual (`currentPeriod`), sin error visible, y la URL se corrige a `period=<mes actual>`.

**CP-DAS-004** — US-27 · FR-20 · Inv.: — · Técnica: Caso de uso · Tipo: Positivo · Prioridad: Media · Automatizable: Sí
Precondiciones: Gastos en 3 categorías distintas en el mes.
Pasos: 1) Ver el gráfico de barras por categoría.
Resultado esperado: Una barra por categoría con el total correcto, ordenadas de forma legible.

**CP-DAS-005** — US-28 · FR-20 · Inv.: — · Técnica: Caso de uso · Tipo: Positivo · Prioridad: Media · Automatizable: Sí
Precondiciones: Gastos en 2 cuentas distintas.
Pasos: 1) Ver el desglose por cuenta.
Resultado esperado: Un total por cuenta que coincide con la suma manual de sus transacciones.

**CP-DAS-006** — US-29 · FR-20 · Inv.: — · Técnica: Caso de uso · Tipo: Positivo · Prioridad: Media · Automatizable: Sí
Precondiciones: Ingresos de $200.000 y gastos de $150.000 en el mes.
Pasos: 1) Ver ingresos y balance.
Resultado esperado: Ingresos = $200.000, balance = +$50.000.

**CP-DAS-007** — US-29 · FR-20 · Inv.: — · Técnica: Valores límite · Tipo: Límite · Prioridad: Baja · Automatizable: Sí
Precondiciones: Gastos de $200.000 e ingresos de $50.000.
Pasos: 1) Ver el balance.
Resultado esperado: Balance = -$150.000, mostrado con signo negativo explícito, no como un total confuso.

**CP-DAS-008** — US-31 · FR-20 · Inv.: — · Técnica: Caso de uso · Tipo: Positivo · Prioridad: Media · Automatizable: Sí
Precondiciones: 15 transacciones en el mes.
Pasos: 1) Ver la sección de últimas transacciones.
Resultado esperado: Muestra las últimas 10, con un acceso a la lista completa (no las 15 truncadas sin salida).

**CP-DAS-009** — US-32 · FR-20 · Inv.: — · Técnica: Adivinación de errores · Tipo: Límite · Prioridad: Baja · Automatizable: Sí
Precondiciones: Compra en 12 cuotas de agosto, imputación de diciembre cayendo en el mes consultado; ningún otro registro real en diciembre.
Pasos: 1) Ver "días con registro" en el dashboard de diciembre.
Resultado esperado: **0 días** — la cuota heredada no cuenta como día de registro (mide hábito de carga por `occurred_on`, no impacto por `ledger_entries.period`, ver `04-data-model.md` consulta 7).

**CP-DAS-010** — US-33 · FR-20 · Inv.: — · Técnica: Caso de uso · Tipo: Límite · Prioridad: Media · Automatizable: Sí
Precondiciones: Mes sin ninguna transacción.
Pasos: 1) Ir al dashboard de ese mes.
Resultado esperado: Estado vacío con mensaje claro y un acceso directo a `/register` — no un dashboard de ceros sin contexto.

**CP-DAS-011** — (par de autorización) · C7 · Inv.: — · Técnica: Adivinación de errores · Tipo: Negativo · Prioridad: Alta · Automatizable: Sí
Precondiciones: Dashboard de A con datos cargados.
Pasos: 1) Con la sesión de B, repetir las mismas consultas del dashboard (por `user_id, period`).
Resultado esperado: 0 filas — el dashboard de B nunca ve datos de A. **Ya cubierto** por `rls_isolation.test.sql` (índice `ledger_entries_user_period_idx` filtra siempre por `user_id`).

---

## Trazabilidad corta (FR/I* → casos)

| Fuente | Casos |
|---|---|
| FR-01 | CP-ACC-003 a 007 |
| FR-02, NFR-13 | CP-ACC-001, CP-ACC-002, CP-ACC-011 |
| FR-03 | CP-ACC-009, CP-ACC-010 |
| FR-04, ADR-014 | CP-ACC-008, CP-CFG-008 |
| FR-05 | CP-CFG-001 a 007 |
| FR-06 | CP-REG-001 a 011 |
| FR-08, C10, I10 | CP-REG-012, CP-REG-013, CP-CUO-009 |
| FR-09, I2, I3 | CP-CUO-001, CP-CUO-002, CP-CUO-006 |
| I6 | CP-CUO-003, CP-CUO-012 |
| FR-10, FR-11, I1, I1', C3, C4 | CP-CUO-004, CP-CUO-005, CP-CUO-010, CP-CUO-013 |
| I4 | CP-REG-010, CP-REG-011 |
| I8 | CP-REG-004 |
| FR-12, I5 | CP-MON-001 a 004, CP-CFG-009, CP-CFG-010 |
| FR-20 | CP-CUO-007, CP-CUO-008, CP-MON-005, CP-MON-006, CP-DAS-001, CP-DAS-004 a 010 |
| FR-21, C11 | CP-DAS-002, CP-DAS-003 |
| C4, C7 | CP-REG-014, CP-REG-015, CP-ACC-011, CP-CUO-011, CP-MON-007, CP-DAS-011 |

**FR/I\* de V1 sin caso propio**: ninguno, tras la revisión de `spec-critic` (ver más abajo), que
encontró que US-02 había quedado sin ningún caso — corregido con CP-REG-016. Las historias sin
negativo natural (US-04/US-05 defaults visuales) quedan con un solo caso positivo a propósito —
no hay una regla que rechace algo ahí, forzar un negativo sería un caso sin oráculo (regla de
`new-test-case` §4).

## Ambigüedades para el Product Owner

1. ~~**CP-ACC-004 — la contraseña mínima no coincide con FR-01.**~~ **Parcialmente resuelto**:
   US-67 (#132, política completa de 8+mayúscula+minúscula+número+especial) sí llegó a
   producción. **US-67 (#131, confirmar contraseña) no llegó** — quedó huérfano por un error de
   merge (#136 contra la rama equivocada) hasta que la ejecución de #75 lo detectó como DEF-003;
   el fix está en #141. El caso se actualizó al oráculo de US-67 (ver CP-ACC-004 arriba).
   **Confirmado por la ejecución de #75 (DEF-005): el servidor (Supabase Auth) no aplica esta
   política** — acepta por API cualquier contraseña de 6+ caracteres, contradiciendo el "y en el
   servidor" de FR-01 (C6). Sigue sin resolver.
2. **CP-REG-011** (monto con 3 decimales): la spec no dice explícitamente si el rechazo es solo
   de cliente o si el servidor también lo valida antes de que `numeric(14,2)` trunque en
   silencio. Se prueba como límite, no como negativo duro, hasta que el PO lo confirme.
3. **CP-ACC-010** (plazo de inactividad de sesión, FR-03): "sugerido: 30 días" nunca se confirmó
   como valor final ni es verificable desde el cliente (vive en la config de Supabase Auth). No
   se escribió un caso que lo mida; si el equipo configura el valor en el panel, se agrega un
   caso de sistema al ejecutar (#75), no antes.

## Revisión — `spec-critic`

Corrida el 2026-09-28 sobre esta versión del catálogo, contrastándolo contra las seis fuentes de
spec y contra `07-plan-de-testing.md` §4 y `new-test-case/SKILL.md` §4. Encontró 2 hallazgos
**Bloqueantes** y 3 **Altos**, ya corregidos en este documento:

| Hallazgo | Severidad | Resolución |
|---|---|---|
| CP-ACC-004 fijaba un oráculo de 6 caracteres derivado del código, contradiciendo FR-01 (8 + letra + número) | Bloqueante | Reescrito con el oráculo correcto derivado del spec; discrepancia documentada arriba como decisión de PO, no corregida en silencio |
| El catálogo afirmaba "ningún hueco de trazabilidad" con US-02 sin ningún caso | Bloqueante | Agregado CP-REG-016; corregida la afirmación |
| I6 (cuotas solo en gastos con tarjeta) nunca se probó en su cláusula de tipo (`type = expense`), solo en la de cuenta | Alto | Agregado CP-CUO-012 |
| El sad path "fallo parcial de escritura" del spec no tenía ningún caso | Alto | Agregado CP-CUO-013 |
| CP-REG-005 no declaraba la variante API que exige `new-test-case` para todo negativo | Alto | Agregada, confirmada contra el código de `create_transaction` (rechaza categoría archivada) |

Los hallazgos **Medios** (variantes API faltantes en CP-CFG-007/010, tabla de trazabilidad
incompleta en I4/I8, convención no aclarada en los casos de autorización) también se corrigieron.
Riesgo residual aceptado: `CP-ACC-007` y `CP-CFG-008` siguen marcados "Automatizable: No" por ser
escenarios hipotéticos o de concurrencia difíciles de forzar limpiamente — a confirmar con el Test
Lead al planificar V3, no bloquea el cierre de #74.

**Veredicto:** catálogo listo para pasar a ejecución (#75), con la salvedad de la decisión de PO
pendiente sobre la política de contraseña (arriba).
