# Procedimientos comunes de prueba (PR-nn)

_Pasos que se repiten en muchos casos, escritos una sola vez. Un caso de prueba los cita en sus
pre-requisitos (`PR-01`) en vez de copiarlos. Si un procedimiento cambia, se corrige acá y
no en 100 casos. Estándar del caso: `docs/07-plan-de-testing.md` §4._

**Regla.** Cada caso arranca con **su propio usuario** (PR-01). Ningún caso usa datos que dejó otro.
Todos los datos son ficticios (C14). La URL base, `<APP>`, es la del deploy bajo prueba; `<SUPABASE_URL>`
es la del proyecto de Supabase que usa ese deploy.

| ID | Procedimiento | Resultado |
|---|---|---|
| PR-01 | Crear un usuario de prueba nuevo y saltear la configuración inicial | Sesión iniciada en Registrar, con el catálogo inicial |
| PR-02 | Crear la cuenta "Visa BBVA" de tipo tarjeta de crédito | Cuenta disponible en Registrar |
| PR-03 | Cargar el tipo de cambio de referencia del mes | Referencia guardada |
| PR-04 | Obtener el token y los uuid, y llamar a la API directo | Token, uuid de categorías y cuentas, y plantilla de llamada |
| PR-05 | Crear dos usuarios de prueba, A y B | Dos sesiones aisladas con su token, sin datos |
| PR-06 | Llegar al paso 3/3 de Registrar con un monto y una cuenta | Formulario listo para elegir cuotas o fecha |
| PR-07 | Registrar un gasto completo en cuotas, con fecha | Compra guardada, para casos que la usan como dato |
| PR-08 | Leer por la API las filas propias (oráculo de verificación) | Filas de `transactions` y `ledger_entries` del usuario |

---

## PR-01 · Crear un usuario de prueba nuevo y saltear la configuración inicial

**Datos.** Email `qa+<ID del caso>-<nnn>@example.com`, con `<nnn>` correlativo para no repetir
(por ejemplo `qa+cp-cuo-006-001@example.com`). Contraseña `Clave123!` (cumple los 5 criterios, US-67).
Si el proyecto tiene confirmación de email activa, el alta no entra sola: usar el email de un buzón
real del equipo o confirmar el usuario desde el panel de Supabase (Authentication → Users).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `<APP>` en una ventana de incógnito. | Redirige a `/login?next=%2Fregister` y se ve el formulario "Entrar". |
| 2 | Tocar "Crear una cuenta". | Se ve "Crear cuenta" con los campos Email, Contraseña y Confirmar contraseña, y los 5 criterios de contraseña con ○. |
| 3 | Escribir el email en "Email". | El campo muestra el email. |
| 4 | Escribir `Clave123!` en "Contraseña". | Los 5 criterios pasan a ✓. |
| 5 | Escribir `Clave123!` en "Confirmar contraseña". | El campo queda cargado; los dos se ven enmascarados. |
| 6 | Tocar "Crear cuenta". | Se abre la configuración inicial (paso 1 de 4). |
| 7 | Tocar "Saltear" en cada uno de los 4 pasos. | Termina la configuración inicial y se abre Registrar en el paso 1/3 ("¿Cuánto?"), con "Gasto" y "ARS" seleccionados. |

**Post-condición.** Usuario con las categorías y cuentas iniciales de US-43. Para volver a empezar
de cero, repetir PR-01 con el siguiente `<nnn>`.

## PR-02 · Crear la cuenta "Visa BBVA" (tarjeta de crédito)

**Requiere** PR-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Tocar el engranaje "Ajustes" arriba a la derecha (en computadora, "Ajustes" en el menú lateral). | Se abre Ajustes con las secciones Categorías, Cuentas y Tipo de cambio de referencia. |
| 2 | En "Cuentas", escribir `Visa BBVA` en "Nueva cuenta". | El campo muestra "Visa BBVA". |
| 3 | En "Tipo", elegir "Tarjeta de crédito". | "Tarjeta de crédito" queda seleccionada. |
| 4 | Tocar "Crear cuenta". | "Visa BBVA" aparece en la lista de cuentas. |

## PR-03 · Cargar el tipo de cambio de referencia del mes

**Requiere** PR-01. **Dato.** `<TC>`: el valor que pide el caso (ej. `1250`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir Ajustes (paso 1 de PR-02). | Se abre Ajustes. |
| 2 | En "Tipo de cambio de referencia", elegir el mes actual en "Mes". | El selector muestra el mes actual. |
| 3 | Escribir `<TC>` en "ARS por USD". | El campo muestra `<TC>`. |
| 4 | Tocar "Guardar tipo de cambio". | La referencia del mes queda guardada con `<TC>`. |

## PR-04 · Obtener el token de sesión y llamar a la API directo

Sirve para toda variante **API** de un caso (C6: la validación real es la de Postgres). Se hace con
`curl`, o Postman con los mismos headers. **Requiere** PR-01 (el usuario ya existe).

**Datos.** `<SUPABASE_URL>` y `<ANON_KEY>`: las del deploy bajo prueba (la anon key es pública por
diseño; se ve en la pestaña Network del navegador, en el header `apikey` de cualquier llamada de la app).
La `service_role` **nunca** se usa para probar (C8).

**Paso 1 · Iniciar sesión y guardar el token.** No escribe nada en la base.

```bash
curl -s -X POST "<SUPABASE_URL>/auth/v1/token?grant_type=password" \
  -H "apikey: <ANON_KEY>" -H "Content-Type: application/json" \
  -d '{"email":"<EMAIL del usuario>","password":"Clave123!"}'
```

Resultado esperado: HTTP 200 y un JSON con `access_token` (de ahí sale `<TOKEN>`) y `user.id`.

**Paso 2 · Obtener los uuid de categoría y cuenta.** Solo lectura: no escribe nada.

```bash
curl -s "<SUPABASE_URL>/rest/v1/categories?select=id,name" -H "apikey: <ANON_KEY>" -H "Authorization: Bearer <TOKEN>"
curl -s "<SUPABASE_URL>/rest/v1/accounts?select=id,name,type" -H "apikey: <ANON_KEY>" -H "Authorization: Bearer <TOKEN>"
```

Resultado esperado: HTTP 200 y las listas del catálogo inicial. De ahí salen `<uuid Otros>`, `<uuid Visa BBVA>`,
`<uuid Efectivo>`, etc.

**Plantilla de llamada a la RPC (no es un paso).** Es el formato de las llamadas que cada caso API escribe completas, con
sus propios valores. **No se ejecuta tal cual como parte de un pre-requisito**: crearía una transacción.

```bash
curl -s -i -X POST "<SUPABASE_URL>/rest/v1/rpc/create_transaction" \
  -H "apikey: <ANON_KEY>" -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "p_type": "expense", "p_amount": "1200.00", "p_currency": "ARS", "p_fx_rate": null,
    "p_category_id": "<uuid de categoría>", "p_account_id": "<uuid de cuenta>",
    "p_installments_count": 1, "p_occurred_on": "2026-10-01", "p_description": null,
    "p_request_id": null
  }'
```

- **Éxito:** HTTP 200 y el cuerpo es el `uuid` de la transacción creada.
- **Rechazo de Postgres:** HTTP 4xx con `code` y `message` en el JSON. Cada caso declara el `code` y el texto esperados
  (por ejemplo `23514` / `check_violation`).
- **`p_request_id`** (uuid, opcional, US-70, ADR-034): la clave de idempotencia. Con `null` o sin el
  parámetro, cada llamada crea una transacción (como en V1). Con un uuid, la primera llamada la crea y
  cualquier otra del mismo usuario con esa clave devuelve el **mismo** `uuid` sin crear nada, aunque cambie el
  contenido o la transacción esté eliminada. La de otro usuario no choca (C7). Para una clave nueva, generá un
  uuid (`uuidgen` en macOS o Linux); la del movimiento pendiente se lee en DevTools → Application → Local
  Storage, entrada `biyu:pending-drafts:<user_id>`, campo `requestIds` (la última es la de la fila).
- Los montos se mandan como string decimal, nunca como número (C2). En las lecturas, PostgREST devuelve
  `numeric` como número JSON: para comparar el valor exacto, pedilo con `::text` (`select=amount_text:amount::text`).

**Otras RPC.** `upsert_fx_rate` (`p_period` fecha del primer día del mes, `p_ars_per_usd` numérico) y
`delete_transaction` (`p_transaction_id` uuid), por el mismo endpoint `/rest/v1/rpc/<nombre>`.
Los parámetros de las RPC nuevas de V2 se agregan acá cuando se especifican.

**Rol `anon`.** Para repetir una llamada sin sesión, cambiar el header por `Authorization: Bearer <ANON_KEY>`.
Lo que debe responder lo dice cada caso (la regla vigente de US-48 · CA-2 y C7 se verifica en el módulo `ACC`).

---

## PR-05 · Crear dos usuarios de prueba, A y B

Para los casos de aislamiento (C7). Los datos de cada usuario los carga el caso (por ejemplo con `PR-07`),
así el caso sabe exactamente qué filas existen. **Requiere** PR-01 dos veces, con dos emails distintos.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Hacer PR-01 con `qa+<ID>-A@example.com`. | Usuario A con sesión iniciada. |
| 2 | En una segunda ventana de incógnito, hacer PR-01 con `qa+<ID>-B@example.com`. | Usuario B con sesión iniciada, en una sesión aparte de la de A. |
| 3 | Hacer PR-04 paso 1 para A y para B. | Dos `access_token` distintos: `<TOKEN-A>` y `<TOKEN-B>`. |

**Post-condición.** A y B no tienen ninguna transacción. Quien cita este procedimiento cargará los datos que necesite.

---

## PR-06 · Llegar al paso 3/3 de Registrar con un monto y una cuenta

**Requiere** PR-01, y PR-02 si `<CUENTA>` es "Visa BBVA". **Datos.** `<MONTO>`, `<CUENTA>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de navegación de abajo (en computadora, el menú lateral), tocar "Registrar". | Se abre Registrar en el paso 1/3 ("¿Cuánto?"), con "Gasto" y "ARS" seleccionados y el cursor en el monto. |
| 2 | Escribir `<MONTO>` en el monto. | El monto queda cargado y se habilita "Siguiente". |
| 3 | Tocar "Siguiente". | Pasa al paso 2/3 ("¿En qué?") con la grilla de categorías. |
| 4 | Tocar el chip "Otros". | Avanza solo al paso 3/3 ("Revisá y guardá"). |
| 5 | En "Cuenta", tocar `<CUENTA>`. | `<CUENTA>` queda marcada. |

## PR-07 · Registrar un gasto completo en cuotas, con fecha

Para los casos donde la compra es un **dato** y no lo que se prueba. **Requiere** PR-01.
**Datos.** `<MONTO>`, `<CUOTAS>`, `<FECHA>`, y la cuenta (por defecto "Tarjeta de crédito", que viene en el catálogo inicial) en formato DD/MM/AAAA (se fija siempre una fecha pasada
explícita: el caso no depende del día en que se ejecuta, C1).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Hacer PR-06 con `<MONTO>` y la cuenta "Tarjeta de crédito". | Paso 3/3 con "Tarjeta de crédito" marcada. |
| 2 | En "Cuotas", tocar `<CUOTAS>`. | Debajo aparece la previsualización de las cuotas. |
| 3 | En "Fecha", tocar "Otra" y escribir `<FECHA>`. | La fecha queda cargada. |
| 4 | Tocar "Guardar gasto". | Aparece el aviso "Gasto guardado" y el botón muestra "Guardado". |

## PR-08 · Leer por la API las filas propias (oráculo de verificación)

Reemplaza a "mirar la base": funciona igual contra producción, porque la RLS devuelve solo las filas
del usuario del token (C7). **Requiere** PR-04 paso 1 (`<TOKEN>`). Como cada caso usa su propio usuario,
todas las filas que aparecen son las de ese caso.

```bash
# Imputaciones del usuario, en orden
curl -s "<SUPABASE_URL>/rest/v1/ledger_entries?select=installment_number,period,amount,amount_ars&order=installment_number" \
  -H "apikey: <ANON_KEY>" -H "Authorization: Bearer <TOKEN>"

# Transacciones del usuario
curl -s "<SUPABASE_URL>/rest/v1/transactions?select=id,amount,amount_ars,installments_count,request_id,deleted_at" \
  -H "apikey: <ANON_KEY>" -H "Authorization: Bearer <TOKEN>"

# Transacciones con una clave de idempotencia (US-70): incluye las eliminadas
curl -s "<SUPABASE_URL>/rest/v1/transactions?select=id,amount,deleted_at&request_id=eq.<request_id>" \
  -H "apikey: <ANON_KEY>" -H "Authorization: Bearer <TOKEN>"
```

Los importes llegan como **string** (`"10000.00"`): se leen tal cual, no se redondean (C2). El período es el
primer día del mes (`"2026-08-01"`).
