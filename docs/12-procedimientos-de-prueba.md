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
| PR-04 | Obtener el token de sesión y llamar a la API directo | Token válido y llamada de ejemplo |
| PR-05 | Crear dos usuarios de prueba (A y B), cada uno con datos | Dos sesiones aisladas con su token |

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

**Paso 1 · Iniciar sesión y guardar el token.**

```bash
curl -s -X POST "<SUPABASE_URL>/auth/v1/token?grant_type=password" \
  -H "apikey: <ANON_KEY>" -H "Content-Type: application/json" \
  -d '{"email":"<EMAIL del usuario>","password":"Clave123!"}'
```

Resultado esperado: HTTP 200 y un JSON con `access_token` (de ahí sale `<TOKEN>`) y `user.id`.

**Paso 2 · Llamar a la RPC.** Todas las llamadas llevan los mismos dos headers de autorización:

```bash
curl -s -i -X POST "<SUPABASE_URL>/rest/v1/rpc/create_transaction" \
  -H "apikey: <ANON_KEY>" -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "p_type": "expense", "p_amount": "1200.00", "p_currency": "ARS", "p_fx_rate": null,
    "p_category_id": "<uuid de categoría>", "p_account_id": "<uuid de cuenta>",
    "p_installments_count": 1, "p_occurred_on": "2026-10-01", "p_description": null
  }'
```

- **Éxito:** HTTP 200 y el cuerpo es el `uuid` de la transacción creada.
- **Rechazo de Postgres:** HTTP 4xx con `code` y `message` en el JSON. Cada caso que usa esta variante
  declara el `code` y el texto esperados (por ejemplo `23514` / `check_violation`, o `42501`).
- Los montos viajan como string decimal, nunca como número (C2).

**Cómo obtener los uuid.** `GET <SUPABASE_URL>/rest/v1/categories?select=id,name` y
`GET <SUPABASE_URL>/rest/v1/accounts?select=id,name,type`, con los mismos dos headers de autorización.

**Otras RPC.** `upsert_fx_rate` (`p_period` fecha del primer día del mes, `p_ars_per_usd` numérico) y
`delete_transaction` (`p_transaction_id` uuid), por el mismo endpoint `/rest/v1/rpc/<nombre>`.
Los parámetros de las RPC nuevas de V2 se agregan acá cuando se especifican.

**Rol `anon`.** Para probar `permission denied`, repetir la llamada con `Authorization: Bearer <ANON_KEY>`
(sin sesión). Esperado: HTTP 401 o 403 con `code` `42501`.

## PR-05 · Dos usuarios de prueba, A y B, cada uno con datos

Para los casos de aislamiento (C7). **Requiere** PR-01 hecho dos veces, con dos emails distintos.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Hacer PR-01 con `qa+<ID>-A@example.com` y registrar un gasto de ARS 1.000,00 (categoría "Otros"). | El gasto aparece en Movimientos del usuario A. |
| 2 | En una segunda ventana de incógnito, hacer PR-01 con `qa+<ID>-B@example.com` y registrar un gasto de ARS 2.000,00. | El gasto aparece en Movimientos del usuario B. |
| 3 | Hacer PR-04 paso 1 para A y para B. | Dos `access_token` distintos: `<TOKEN-A>` y `<TOKEN-B>`. |
