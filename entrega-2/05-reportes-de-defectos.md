# Entrega 2 · Reportes de defectos (V2) · Deudas y Navegación

Planilla: `05-reportes-de-defectos.xlsx` (hoja «Index» y una hoja por defecto, mismo formato que la Entrega 1). La numeración sigue la de la Entrega 1 (DEF-001 a DEF-028): los defectos de V2 empiezan en **DEF-029**.

| Defect ID | Title | Severity | Status | Test case | User story | GitHub issue |
|---|---|---|---|---|---|---|
| DEF-029 | La baja de un gasto (delete_transaction) responde 204 sin cuerpo y el caso espera 200 con null | Baja | Abierto · se reproduce el 2026-10-25 | CP-NAV-084 | US-70 · Reintento sin duplicar al recuperar un gasto (CA-21) | — (sin issue) |

## DEF-029 — La baja de un gasto (delete_transaction) responde 204 sin cuerpo y el caso espera 200 con null

**Descripción:** Al eliminar un gasto llamando a la función delete_transaction, el sistema responde HTTP 204 sin cuerpo. El caso CP-NAV-084 espera HTTP 200 con el cuerpo null. La baja en sí funciona bien (el gasto queda eliminado y su cuota histórica se conserva); lo que no coincide es la respuesta.

**Pasos para reproducir:**

1. Versión donde ocurre: main en f096e22 (app local contra Supabase local con todas las migraciones aplicadas).
2. Tener un usuario de prueba con la cuenta «Visa BBVA» y la categoría «Comida» (ver los pre-requisitos de CP-NAV-084) y su token de sesión.
3. En Postman, enviar un POST a SUPABASE_URL/rest/v1/rpc/create_transaction con los encabezados apikey, Authorization (Bearer + token) y Content-Type: application/json, y el cuerpo {"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<id de Comida>","p_account_id":"<id de Visa BBVA>","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"84000000-0000-4000-8000-000000000084"}. Anotar el identificador que devuelve (ID-1).
4. Enviar un POST a SUPABASE_URL/rest/v1/rpc/delete_transaction con los mismos encabezados y el cuerpo {"p_transaction_id":"<ID-1>"}.
5. Mirar el código de respuesta y si trae cuerpo.
6. Enviar un GET a SUPABASE_URL/rest/v1/transactions?select=id,request_id,deleted_at&request_id=eq.84000000-0000-4000-8000-000000000084 y comprobar la fila.

**Resultado esperado:** Según el caso CP-NAV-084 (paso 2): HTTP 200 y el cuerpo JSON null.

**Resultado actual:** HTTP 204 (sin contenido) y cuerpo vacío. La fila de la transacción queda con deleted_at con fecha y la cuota histórica se conserva.

**Severidad / incidencia:** Severidad Baja: la baja lógica y la cuota histórica se comportan bien; solo difiere el código de respuesta del contrato que espera el caso, y no afecta a lo que ve el usuario. 100 % (1 de 1 ejecución).

**Historia y criterio afectados:** US-70 · CA-21: «Recuperar un gasto ya guardado y eliminado no crea otro gasto». El criterio funcional se cumple; el caso CP-NAV-084 pide además un código de respuesta que la función no devuelve.

**Navegadores:** No aplica: llamada directa a la API (Postman).

**Entorno:** Local: Vite (http://127.0.0.1:5173) + Supabase local · main f096e22 · migraciones hasta 20261012000000.

**Notas:**

- Defect ID: DEF-029
- Estado: Abierto · se reproduce el 2026-10-25
- Issue de GitHub: sin issue
- Caso de prueba: CP-NAV-084
- Encontrado en: ejecución de CP-NAV-084 (Entrega 2).
- Reportó: Claude Code, supervisado por Santiago
- Causa probable: la función delete_transaction está definida como «returns void» (supabase/migrations/20260927180000_delete_transaction_rpc.sql) y PostgREST responde 204 No Content a las funciones que no devuelven nada. Parece un error del resultado esperado del caso y no de la aplicación.
- Decisión pendiente: corregir el caso (esperar 204) o cambiar la función para que devuelva un valor. Por decisión de Santiago no se corrigió nada.
- Evidencia: respuesta 204 de delete_transaction y consulta de la fila con deleted_at con fecha (ver CP-NAV-084 en 04-ejecucion).
