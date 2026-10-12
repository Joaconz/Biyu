# Casos de prueba V2 · EXP — Exportar CSV

Fuente: US-47, FR-22, C1, C2, C5, C7, C9, C10, C11, I10 y ADR-013/023/026/029. Todos los datos son ficticios (C14). El CSV se inspecciona como texto UTF-8 o en hexadecimal; la interpretación automática de una planilla no es el oráculo.

## Decisiones aprobadas para EXP

1. Las preparaciones ausentes de `docs/12-procedimientos-de-prueba.md` se documentan como `EXP-PREP-nn` dentro de este archivo. No se inventan nuevos `PR-nn`.
2. CA-14 se verifica manualmente por `fecha` y `created_at`. El desempate por `id` queda como hueco manual aceptado porque la API pública no permite fijar `created_at` e `id`.
3. Los escenarios que solo existen en el cliente —Offline, cierre/cancelación de la hoja y cambio de URL— no tienen par API porque ADR-029 no define endpoint/RPC de exportación. La excepción no alcanza a autorización: CA-16 conserva su par UI/API.

## Anexo de preparación

### EXP-PREP-01 · Crear una transacción

Requiere PR-01 y PR-04 pasos 1–2. Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con headers `apikey: <ANON_KEY>`, `Authorization: Bearer <TOKEN>`, `Content-Type: application/json` y body:
`{"p_type":"<TIPO>","p_amount":"<MONTO>","p_currency":"<MONEDA>","p_fx_rate":<TC-O-NULL>,"p_category_id":<UUID-O-NULL>,"p_account_id":"<UUID>","p_installments_count":<N>,"p_occurred_on":"<AAAA-MM-DD>","p_description":<TEXTO-O-NULL>,"p_request_id":null}`.
Mapear `gasto` a `expense` e `ingreso` a `income`; usar literalmente los demás datos D del caso. Esperado: HTTP 200 y UUID. Capturarlo como `<ID-A>`, `<ID-B>`, etc. Confirmar con PR-08.

### EXP-PREP-02 · Eliminar o restaurar

Con headers de PR-04:
- Eliminar: `POST /rest/v1/rpc/delete_transaction`, body `{"p_transaction_id":"<ID>"}`. Esperado HTTP 200; PR-08 muestra `deleted_at` no nulo.
- Restaurar: `POST /rest/v1/rpc/restore_transaction`, body `{"p_transaction_id":"<ID>"}`. Esperado HTTP 200; PR-08 muestra `deleted_at:null`.

### EXP-PREP-03 · Crear, renombrar y archivar catálogo

Todas las llamadas llevan headers de PR-04, `Content-Type: application/json` y `Prefer: return=representation`.
- Crear categoría: `POST <SUPABASE_URL>/rest/v1/categories`, body `{"name":"<NOMBRE>","color":"#336699"}`. Esperado HTTP 201 y una fila con `id`, nombre exacto y `archived_at:null`.
- Crear cuenta: `POST <SUPABASE_URL>/rest/v1/accounts`, body `{"name":"<NOMBRE>","type":"cash","currency":"ARS"}`. Esperado HTTP 201 y una fila con `id`, nombre exacto y `archived_at:null`.
- Renombrar: `PATCH <SUPABASE_URL>/rest/v1/<categories|accounts>?id=eq.<ID>`, body `{"name":"<NUEVO>"}`. Esperado HTTP 200 y una fila con el nombre nuevo.
- Archivar: mismo PATCH, body `{"archived_at":"2026-10-09T12:00:00-03:00"}`. Esperado HTTP 200 y una fila con ese valor.

### EXP-PREP-04 · Actualizar el tipo de cambio de referencia

Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/upsert_fx_rate` con headers de PR-04, `Content-Type: application/json` y body `{"p_period":"2026-09-01","p_ars_per_usd":"1400.0000"}`. Esperado: HTTP 200. Confirmar con `GET <SUPABASE_URL>/rest/v1/fx_rates?select=period,ars_per_usd&period=eq.2026-09-01`: HTTP 200 y una fila con `period=2026-09-01` y `ars_per_usd=1400.0000`.

### EXP-PREP-05 · Consultar created_at para ordenar

Crear B, esperar que el reloj avance un segundo y recién entonces crear C. Ejecutar `GET <SUPABASE_URL>/rest/v1/transactions?select=id,created_at&id=in.(<ID-B>,<ID-C>)&order=created_at.asc` con headers de PR-04 y sin body. Esperado: HTTP 200 y dos filas en orden B, C, con `created_at(B) < created_at(C)`.

### EXP-PREP-06 · Eliminar una cuenta

`POST <SUPABASE_URL>/rest/v1/rpc/delete_account` con headers de PR-04 y body `{"p_account_id":"<ID-CUENTA>"}`. Esperado HTTP 200 y cuerpo `1` cuando borra una transacción. Luego `GET <SUPABASE_URL>/rest/v1/accounts?id=eq.<ID-CUENTA>` y `GET <SUPABASE_URL>/rest/v1/transactions?id=eq.<ID-TRANSACCION>` responden HTTP 200 con `[]`.

### EXP-PREP-07 · Sembrar N transacciones

Requiere PowerShell 7, PR-01 y PR-04. Completar variables en memoria; no guardar secretos.

```powershell
$expUrl = "<SUPABASE_URL>"
$expAnon = "<ANON_KEY>"
$expToken = "<TOKEN>"
$expCategory = "<uuid Otros>"
$expAccount = "<uuid Efectivo>"
$expN = <1000|1500|2000>
$expHeaders = @{ apikey=$expAnon; Authorization="Bearer $expToken"; "Content-Type"="application/json" }
$expIds = [System.Collections.Generic.List[string]]::new()
1..$expN | ForEach-Object {
  $expBody = @{ p_type="expense"; p_amount="1.00"; p_currency="ARS"; p_fx_rate=$null;
    p_category_id=$expCategory; p_account_id=$expAccount; p_installments_count=1;
    p_occurred_on="2025-09-15"; p_description=("EXP-{0:D4}" -f $_);
    p_request_id=[guid]::NewGuid().ToString() } | ConvertTo-Json -Compress
  $expId = Invoke-RestMethod -Method Post -Uri "$expUrl/rest/v1/rpc/create_transaction" -Headers $expHeaders -Body $expBody
  $expIds.Add([string]$expId)
}
"creadas=$($expIds.Count); distintas=$(@($expIds | Sort-Object -Unique).Count)"
```

Esperado: `creadas=N; distintas=N`. Conservar `$expIds` para comparar con el CSV.

### EXP-PREP-08 · Simular HTTP 500 en la lectura

En la consola DevTools de Movimientos, ejecutar:

```javascript
window.__expOriginalFetch = window.fetch;
window.fetch = (...args) => String(args[0]).includes('/rest/v1/transactions')
  ? Promise.resolve(new Response(JSON.stringify({ code: 'XX000', message: 'fallo simulado' }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    }))
  : window.__expOriginalFetch(...args);
```

Esperado: la consola no muestra error. Para limpiar: `window.fetch = window.__expOriginalFetch`.

### EXP-PREP-09 · Simular un decimal textual inválido

Con una transacción `1500.00` existente, ejecutar en la consola:

```javascript
window.__expOriginalFetch = window.fetch;
window.fetch = async (...args) => {
  const response = await window.__expOriginalFetch(...args);
  if (!String(args[0]).includes('/rest/v1/transactions') || !response.ok) return response;
  const text = (await response.text()).replace('"amount_text":"1500.00"', '"amount_text":"1500"');
  return new Response(text, { status: response.status, headers: response.headers });
};
```

Esperado: la consola no muestra error. Para limpiar: `window.fetch = window.__expOriginalFetch`.

## Convenciones

- Cada caso usa PR-01 con el email literal y contraseña `Clave123!`.
- Antes de una descarga, quitar de Descargas cualquier archivo Biyu del mismo período.
- Un sufijo que agregue el navegador no cambia el nombre propuesto que se valida.
- Los UUID capturados son datos exactos del caso.

## 1. Trazabilidad CA-k → casos

| Criterio | Casos |
|---|---|
| US-47 · CA-1 | CP-EXP-001, CP-EXP-002 |
| US-47 · CA-2 | CP-EXP-004, CP-EXP-005, CP-EXP-006 |
| US-47 · CA-3 | CP-EXP-007 |
| US-47 · CA-4 | CP-EXP-008 |
| US-47 · CA-5 | CP-EXP-009, CP-EXP-010, CP-EXP-011, CP-EXP-012, CP-EXP-013, CP-EXP-014, CP-EXP-015, CP-EXP-016 |
| US-47 · CA-6 | CP-EXP-017, CP-EXP-018 |
| US-47 · CA-7 | CP-EXP-019 |
| US-47 · CA-8 | CP-EXP-020, CP-EXP-021, CP-EXP-022 |
| US-47 · CA-9 | CP-EXP-023, CP-EXP-024 |
| US-47 · CA-10 | CP-EXP-025, CP-EXP-026 |
| US-47 · CA-11 | CP-EXP-027 |
| US-47 · CA-12 | CP-EXP-028, CP-EXP-029, CP-EXP-030, CP-EXP-071 |
| US-47 · CA-13 | CP-EXP-031, CP-EXP-032, CP-EXP-033, CP-EXP-034, CP-EXP-035, CP-EXP-036, CP-EXP-037, CP-EXP-038 |
| US-47 · CA-14 | CP-EXP-039 (parcial: fecha y created_at) |
| US-47 · CA-15 | CP-EXP-040, CP-EXP-041, CP-EXP-042 |
| US-47 · CA-16 | CP-EXP-043, CP-EXP-044 |
| US-47 · CA-17 | CP-EXP-045, CP-EXP-046, CP-EXP-047 |
| US-47 · CA-18 | CP-EXP-049, CP-EXP-050, CP-EXP-051, CP-EXP-069, CP-EXP-070 |
| US-47 · CA-19 | CP-EXP-052, CP-EXP-053 |
| US-47 · CA-20 | CP-EXP-003, CP-EXP-048, CP-EXP-054, CP-EXP-055, CP-EXP-056 |
| US-47 · CA-21 | CP-EXP-024 |
| US-47 · CA-22 | CP-EXP-057, CP-EXP-058, CP-EXP-059 |
| US-47 · CA-23 | CP-EXP-060, CP-EXP-061, CP-EXP-062 |
| US-47 · CA-24 | CP-EXP-063, CP-EXP-064 |
| US-47 · CA-25 | CP-EXP-067, CP-EXP-072 |
| US-47 · requisito narrativo: todo cambio de URL | CP-EXP-065, CP-EXP-066 |
| US-47 · Completitud | CP-EXP-068 |
| US-47 · Estado Error | CP-EXP-073, CP-EXP-074, CP-EXP-075 |

## 2. Índice

| ID | Título | Tipo | Canal | Prioridad | Caso par |
|---|---|---|---|---|---|
| CP-EXP-001 | Una URL válida fija septiembre 2026 | Positivo | UI | Media | — |
| CP-EXP-002 | Sin period se usa octubre 2026 | Positivo | UI | Media | — |
| CP-EXP-003 | Cancelar desde Vacío cierra sin descargar | Positivo | UI | Media | — |
| CP-EXP-004 | El mes actual permite exportar sin aviso | Límite | UI | Media | — |
| CP-EXP-005 | El mes anterior permite exportar sin aviso | Límite | UI | Media | — |
| CP-EXP-006 | El mes siguiente está bloqueado | Límite | UI | Alta | — |
| CP-EXP-007 | El alcance mensual propone el nombre 2026-09 | Positivo | UI | Alta | — |
| CP-EXP-008 | El alcance anual propone el nombre 2025 | Positivo | UI | Alta | — |
| CP-EXP-009 | El primer día del mes se incluye | Límite | UI | Alta | — |
| CP-EXP-010 | El último día del mes se incluye | Límite | UI | Alta | — |
| CP-EXP-011 | El día anterior al mes se excluye | Límite | UI | Alta | — |
| CP-EXP-012 | El día posterior al mes se excluye | Límite | UI | Alta | — |
| CP-EXP-013 | El 1 de enero se incluye en el año | Límite | UI | Alta | — |
| CP-EXP-014 | El 31 de diciembre se incluye en el año | Límite | UI | Alta | — |
| CP-EXP-015 | El día anterior al año se excluye | Límite | UI | Alta | — |
| CP-EXP-016 | El día posterior al año se excluye | Límite | UI | Alta | — |
| CP-EXP-017 | Una transacción eliminada queda fuera | Positivo | UI | Alta | — |
| CP-EXP-018 | Una transacción restaurada vuelve a exportarse | Positivo | UI | Alta | — |
| CP-EXP-019 | El filtro Eliminados no cambia los bytes | Positivo | UI | Alta | — |
| CP-EXP-020 | El archivo comienza con BOM UTF-8 | Positivo | UI | Alta | — |
| CP-EXP-021 | El encabezado tiene doce columnas exactas | Positivo | UI | Alta | — |
| CP-EXP-022 | Cada fila termina en CRLF incluida la última | Positivo | UI | Alta | — |
| CP-EXP-023 | Doce cuotas salen en una sola fila por el total | Límite | UI | Alta | — |
| CP-EXP-024 | Un mes con solo cuota heredada produce Vacío | Límite | UI | Alta | — |
| CP-EXP-025 | ARS se escribe con dos decimales exactos | Positivo | UI | Alta | — |
| CP-EXP-026 | USD conserva cuatro decimales de TC | Positivo | UI | Alta | — |
| CP-EXP-027 | Cambiar la referencia no recalcula el histórico | Positivo | UI | Alta | — |
| CP-EXP-028 | Una coma obliga a entrecomillar la descripción | Positivo | UI | Alta | — |
| CP-EXP-029 | Las comillas internas se duplican | Positivo | UI | Alta | — |
| CP-EXP-030 | Un LF queda dentro de un campo citado | Positivo | UI | Alta | — |
| CP-EXP-031 | Descripción con igual se neutraliza | Positivo | UI | Alta | — |
| CP-EXP-032 | Descripción con más se neutraliza | Positivo | UI | Alta | — |
| CP-EXP-033 | Descripción con menos se neutraliza | Positivo | UI | Alta | — |
| CP-EXP-034 | Descripción con arroba se neutraliza | Positivo | UI | Alta | — |
| CP-EXP-035 | Descripción con tabulación se neutraliza | Positivo | UI | Alta | — |
| CP-EXP-036 | Descripción con retorno de carro se neutraliza | Positivo | UI | Alta | — |
| CP-EXP-037 | Una categoría que empieza con igual se neutraliza | Positivo | UI | Alta | — |
| CP-EXP-038 | Una cuenta que empieza con arroba se neutraliza | Positivo | UI | Alta | — |
| CP-EXP-039 | Las filas se ordenan por fecha y creación | Positivo | UI | Media | — |
| CP-EXP-040 | 1.000 transacciones se exportan sin faltantes | Límite | UI | Alta | — |
| CP-EXP-041 | 1.500 transacciones se exportan sin faltantes | Límite | UI | Alta | — |
| CP-EXP-042 | 2.000 transacciones se exportan sin faltantes | Límite | UI | Alta | — |
| CP-EXP-043 | El CSV de A no contiene movimientos de B | Negativo | UI | Alta | CP-EXP-044 |
| CP-EXP-044 | La API con token de A devuelve cero filas de B | Negativo | API | Alta | CP-EXP-043 |
| CP-EXP-045 | Categoría archivada sale con el nombre actual | Positivo | UI | Media | — |
| CP-EXP-046 | Cuenta archivada sale con el nombre actual | Positivo | UI | Media | — |
| CP-EXP-047 | Un ingreso exporta categoría vacía | Positivo | UI | Media | — |
| CP-EXP-048 | Eliminar una cuenta quita su transacción | Positivo | UI | Alta | — |
| CP-EXP-049 | Descargar muestra Exportando y aria-busy | Positivo | UI | Alta | — |
| CP-EXP-050 | Los controles quedan bloqueados al exportar | Positivo | UI | Alta | — |
| CP-EXP-051 | Un doble click inicia una sola descarga | Positivo | UI | Alta | — |
| CP-EXP-052 | Una fila usa singular y cierra la hoja | Límite | UI | Media | — |
| CP-EXP-053 | Dos filas usan plural | Límite | UI | Media | — |
| CP-EXP-054 | Un mes sin transacciones muestra Vacío | Límite | UI | Media | — |
| CP-EXP-055 | Un año sin transacciones muestra Vacío anual | Límite | UI | Media | — |
| CP-EXP-056 | Un período con solo eliminadas muestra Vacío | Límite | UI | Alta | — |
| CP-EXP-057 | Offline muestra el error exacto | Negativo | UI | Alta | — (excepción cliente aprobada) |
| CP-EXP-058 | El reintento después de Offline descarga completo | Negativo | UI | Alta | — (excepción cliente aprobada) |
| CP-EXP-059 | Cancelar desde Error cierra sin descargar | Negativo | UI | Media | — (excepción cliente aprobada) |
| CP-EXP-060 | Cancelar cierra sin descargar | Positivo | UI | Baja | — |
| CP-EXP-061 | Escape cierra sin descargar | Positivo | UI | Baja | — |
| CP-EXP-062 | Tocar fuera cierra sin descargar | Positivo | UI | Baja | — |
| CP-EXP-063 | Atrás cierra la hoja inicial | Positivo | UI | Media | — |
| CP-EXP-064 | Atrás durante Exportando cancela la descarga | Negativo | UI | Alta | — (excepción cliente aprobada) |
| CP-EXP-065 | Adelante cierra la hoja inicial | Positivo | UI | Media | — |
| CP-EXP-066 | Salir a Resumen cierra la hoja | Positivo | UI | Media | — |
| CP-EXP-067 | Exportar no modifica datos ni período | Positivo | UI | Alta | — |
| CP-EXP-068 | Una alta concurrente impide descargar un año incompleto | Negativo | UI | Alta | — (excepción cliente aprobada) |
| CP-EXP-069 | Escape no cierra la hoja durante Exportando | Positivo | UI | Alta | — |
| CP-EXP-070 | Tocar fuera no cierra la hoja durante Exportando | Positivo | UI | Alta | — |
| CP-EXP-071 | Un lector RFC 4180 obtiene doce columnas | Positivo | UI | Alta | — |
| CP-EXP-072 | Exportar no modifica el total de Resumen | Positivo | UI | Alta | — |
| CP-EXP-073 | HTTP 500 muestra Error y no descarga | Negativo | UI | Alta | — (excepción cliente aprobada) |
| CP-EXP-074 | Un monto textual inválido cancela la descarga | Negativo | UI | Alta | — (excepción cliente aprobada) |
| CP-EXP-075 | Cambiar el alcance borra el mensaje de Error | Negativo | UI | Media | — (excepción cliente aprobada) |

## 3. Casos completos

### CP-EXP-001 — Una URL válida fija septiembre 2026

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-1 · C11 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-001-001@example.com`.

**Datos de prueba:** D1: período `2026-09`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-001-001@example.com`. | El campo muestra `qa+cp-exp-001-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en el botón "Exportar". | Se abre "Exportar movimientos"; "Solo septiembre 2026" está elegido; se ve "Todo 2026"; "Descargar CSV" y "Cancelar" están habilitados; aparece el texto fijo sobre activos y cuotas anteriores. |

**Post-condición:** Hoja abierta; sin descarga.

### CP-EXP-002 — Sin period se usa octubre 2026

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-1 · C1/C11 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-002-001@example.com`. S2: dispositivo en `09/10/2026`, zona `America/Buenos_Aires`.

**Datos de prueba:** D1: URL `/transactions` sin query.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-002-001@example.com`. | El campo muestra `qa+cp-exp-002-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions`. | La barra muestra exactamente `<APP>/transactions`. |
| 12 | Presionar Enter. | Se abre Movimientos; el período efectivo es octubre 2026 según D. |
| 13 | Hacer click en "Exportar". | Se abre la hoja con "Solo octubre 2026" elegido y "Todo 2026" visible. |

**Post-condición:** Hoja abierta; sin descarga.

### CP-EXP-003 — Cancelar desde Vacío cierra sin descargar

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-20 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-003-001@example.com`; no crear transacciones.

**Datos de prueba:** D1: septiembre 2026; D2: ninguna transacción activa.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar". |
| 5 | Hacer click en "Email". | El cursor queda en el campo. |
| 6 | Escribir `qa+cp-exp-003-001@example.com`. | El campo muestra ese email. |
| 7 | Hacer click en "Contraseña". | El cursor queda en el campo. |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en "Entrar". | Se abre Registrar. |
| 10 | Hacer click en la barra de direcciones. | La URL queda seleccionada. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra esa URL. |
| 12 | Presionar Enter. | Se abre Movimientos de septiembre 2026. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | No se descarga archivo y aparece "No tenés movimientos con fecha en septiembre 2026.". |
| 15 | Hacer click en "Cancelar". | La hoja se cierra, la URL conserva `?period=2026-09` y no aparece archivo. |

**Post-condición:** Sin descarga ni datos.
### CP-EXP-004 — El mes actual permite exportar sin aviso

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-2 · C1 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-004-001@example.com`. S2: dispositivo en `09/10/2026`.

**Datos de prueba:** D1: mes actual `2026-10`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-004-001@example.com`. | El campo muestra `qa+cp-exp-004-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-10`. | La barra muestra exactamente `<APP>/transactions?period=2026-10`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-10`. Además, "Exportar" está habilitado y no se ve "Solo podés exportar el mes actual o meses anteriores." |


**Post-condición:** Sin descarga.

### CP-EXP-005 — El mes anterior permite exportar sin aviso

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-2 · C1 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-005-001@example.com`. S2: dispositivo en `09/10/2026`.

**Datos de prueba:** D1: mes anterior `2026-09`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-005-001@example.com`. | El campo muestra `qa+cp-exp-005-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. Además, "Exportar" está habilitado y no se ve el aviso de mes futuro. |


**Post-condición:** Sin descarga.

### CP-EXP-006 — El mes siguiente está bloqueado

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-2 · FR-21 · C1 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-006-001@example.com`. S2: dispositivo en `09/10/2026`.

**Datos de prueba:** D1: mes futuro `2026-11`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-006-001@example.com`. | El campo muestra `qa+cp-exp-006-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-11`. | La barra muestra exactamente `<APP>/transactions?period=2026-11`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-11`. Además, "Exportar" está deshabilitado y se ve exactamente "Solo podés exportar el mes actual o meses anteriores." |
| 13 | Leer el mensaje de período futuro. | El mensaje coincide exactamente con el texto esperado del paso 12. |

| 14 | Hacer click en "Exportar". | No se abre ninguna hoja y la URL sigue `?period=2026-11`. |

**Post-condición:** Sin descarga.

### CP-EXP-007 — El alcance mensual propone el nombre 2026-09

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-3 · FR-22 |
| Invariante | — |
| Técnica | Caso de uso |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-007-001@example.com`. S2: EXP-PREP-01 con D1–D7.

**Datos de prueba:** D1: gasto; D2: `1500.00`; D3: ARS; D4: Otros/Efectivo; D5: 1 cuota; D6: `2026-09-15`; D7: `Almuerzo`; D8: `<ID-A>`; D9: `biyu-movimientos-2026-09.csv`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-007-001@example.com`. | El campo muestra `qa+cp-exp-007-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja con el mes elegido. |
| 14 | Hacer click en "Descargar CSV". | Se inicia y completa una descarga. Además, es exactamente D9. |
| 15 | Abrir la carpeta Descargas. | Se ve el archivo CSV recién descargado. |
| 16 | Abrir el archivo como texto. | Hay una fila de datos cuyo id es `<ID-A>`. |

**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-008 — El alcance anual propone el nombre 2025

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-4 · FR-22 |
| Invariante | — |
| Técnica | Caso de uso |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-008-001@example.com`. S2: EXP-PREP-01 con D1–D7.

**Datos de prueba:** D1: gasto; D2: `2500.00`; D3: ARS; D4: Otros/Efectivo; D5: 1; D6: `2025-02-10`; D7: null; D8: `<ID-A>`; D9: `biyu-movimientos-2025.csv`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-008-001@example.com`. | El campo muestra `qa+cp-exp-008-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2025-09`. | La barra muestra exactamente `<APP>/transactions?period=2025-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2025-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Todo 2025". | "Todo 2025" queda elegido. |
| 15 | Hacer click en "Descargar CSV". | Se inicia y completa una descarga. Además, es exactamente D9. |
| 16 | Abrir la carpeta Descargas. | Se ve el archivo CSV anual recién descargado. |

| 17 | Abrir el archivo como texto. | La única fila tiene fecha `2025-02-10` e id `<ID-A>`. |

**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-009 — El primer día del mes se incluye

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-5 · FR-22 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-009-001@example.com`. S2: EXP-PREP-01 con D1–D7.

**Datos de prueba:** D1: gasto; D2: `100.00`; D3: ARS; D4: Otros/Efectivo; D5: 1; D6: `2026-09-01`; D7: null; D8: `<ID-A>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-009-001@example.com`. | El campo muestra `qa+cp-exp-009-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja con septiembre elegido. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el archivo mensual. |
| 15 | Abrir el archivo como texto. | Hay exactamente una fila con fecha `2026-09-01` e id `<ID-A>`. |

**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-010 — El último día del mes se incluye

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-5 · FR-22 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-010-001@example.com`. S2: EXP-PREP-01 con D1–D7.

**Datos de prueba:** D1: gasto; D2: `100.00`; D3: ARS; D4: Otros/Efectivo; D5: 1; D6: `2026-09-30`; D7: null; D8: `<ID-A>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-010-001@example.com`. | El campo muestra `qa+cp-exp-010-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja con septiembre elegido. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el archivo mensual. |
| 15 | Abrir el archivo como texto. | Hay exactamente una fila con fecha `2026-09-30` e id `<ID-A>`. |

**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-011 — El día anterior al mes se excluye

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-5 · FR-22 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-011-001@example.com`. S2: EXP-PREP-01 con D1–D7.

**Datos de prueba:** D1: gasto; D2: `100.00`; D3: ARS; D4: Otros/Efectivo; D5: 1; D6: `2026-08-31`; D7: null; D8: `<ID-A>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-011-001@example.com`. | El campo muestra `qa+cp-exp-011-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja con septiembre elegido. |
| 14 | Hacer click en "Descargar CSV". | No se descarga archivo; la hoja queda abierta. Además, dice exactamente "No tenés movimientos con fecha en septiembre 2026." |


**Post-condición:** Sin descarga; la transacción fuera del rango sigue activa.

### CP-EXP-012 — El día posterior al mes se excluye

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-5 · FR-22 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-012-001@example.com`. S2: EXP-PREP-01 con D1–D7.

**Datos de prueba:** D1: gasto; D2: `100.00`; D3: ARS; D4: Otros/Efectivo; D5: 1; D6: `2026-10-01`; D7: null; D8: `<ID-A>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-012-001@example.com`. | El campo muestra `qa+cp-exp-012-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja con septiembre elegido. |
| 14 | Hacer click en "Descargar CSV". | No se descarga archivo; la hoja queda abierta. Además, dice exactamente "No tenés movimientos con fecha en septiembre 2026." |


**Post-condición:** Sin descarga; la transacción fuera del rango sigue activa.

### CP-EXP-013 — El 1 de enero se incluye en el año

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-5 · FR-22 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-013-001@example.com`. S2: EXP-PREP-01 con D1–D7.

**Datos de prueba:** D1: gasto; D2: `100.00`; D3: ARS; D4: Otros/Efectivo; D5: 1; D6: `2025-01-01`; D7: null; D8: `<ID-A>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-013-001@example.com`. | El campo muestra `qa+cp-exp-013-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2025-09`. | La barra muestra exactamente `<APP>/transactions?period=2025-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2025-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Todo 2025". | El alcance anual queda elegido. |
| 15 | Hacer click en "Descargar CSV". | Se descarga el archivo anual. |
| 16 | Abrir el archivo como texto. | Hay exactamente una fila con fecha `2025-01-01` e id `<ID-A>`. |

**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-014 — El 31 de diciembre se incluye en el año

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-5 · FR-22 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-014-001@example.com`. S2: EXP-PREP-01 con D1–D7.

**Datos de prueba:** D1: gasto; D2: `100.00`; D3: ARS; D4: Otros/Efectivo; D5: 1; D6: `2025-12-31`; D7: null; D8: `<ID-A>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-014-001@example.com`. | El campo muestra `qa+cp-exp-014-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2025-09`. | La barra muestra exactamente `<APP>/transactions?period=2025-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2025-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Todo 2025". | El alcance anual queda elegido. |
| 15 | Hacer click en "Descargar CSV". | Se descarga el archivo anual. |
| 16 | Abrir el archivo como texto. | Hay exactamente una fila con fecha `2025-12-31` e id `<ID-A>`. |

**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-015 — El día anterior al año se excluye

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-5 · FR-22 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-015-001@example.com`. S2: EXP-PREP-01 con D1–D7.

**Datos de prueba:** D1: gasto; D2: `100.00`; D3: ARS; D4: Otros/Efectivo; D5: 1; D6: `2024-12-31`; D7: null; D8: `<ID-A>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-015-001@example.com`. | El campo muestra `qa+cp-exp-015-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2025-09`. | La barra muestra exactamente `<APP>/transactions?period=2025-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2025-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Todo 2025". | El alcance anual queda elegido. |
| 15 | Hacer click en "Descargar CSV". | No se descarga archivo; la hoja queda abierta. Además, dice exactamente "No tenés movimientos con fecha en 2025." |


**Post-condición:** Sin descarga; la transacción fuera del rango sigue activa.

### CP-EXP-016 — El día posterior al año se excluye

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-5 · FR-22 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-016-001@example.com`. S2: EXP-PREP-01 con D1–D7.

**Datos de prueba:** D1: gasto; D2: `100.00`; D3: ARS; D4: Otros/Efectivo; D5: 1; D6: `2026-01-01`; D7: null; D8: `<ID-A>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-016-001@example.com`. | El campo muestra `qa+cp-exp-016-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2025-09`. | La barra muestra exactamente `<APP>/transactions?period=2025-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2025-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Todo 2025". | El alcance anual queda elegido. |
| 15 | Hacer click en "Descargar CSV". | No se descarga archivo; la hoja queda abierta. Además, dice exactamente "No tenés movimientos con fecha en 2025." |


**Post-condición:** Sin descarga; la transacción fuera del rango sigue activa.

### CP-EXP-017 — Una transacción eliminada queda fuera

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-6 · C10 |
| Invariante | I10 |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-017-001@example.com`. S2: crear `<ID-A>` con EXP-PREP-01 y eliminar con EXP-PREP-02.

**Datos de prueba:** D1: gasto `200.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, null; D2: `<ID-A>` con `deleted_at` no nulo.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-017-001@example.com`. | El campo muestra `qa+cp-exp-017-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | No se descarga archivo. Además, dice "No tenés movimientos con fecha en septiembre 2026." |
| 15 | Leer el mensaje de período vacío. | El mensaje coincide exactamente con el texto esperado del paso 14. |


**Post-condición:** La transacción sigue eliminada.

### CP-EXP-018 — Una transacción restaurada vuelve a exportarse

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-6 · C10 |
| Invariante | I10 |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-018-001@example.com`. S2: crear, eliminar y restaurar `<ID-A>` con EXP-PREP-01/02.

**Datos de prueba:** D1: gasto `200.00` ARS, `2026-09-15`; D2: `<ID-A>` con `deleted_at:null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-018-001@example.com`. | El campo muestra `qa+cp-exp-018-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga un CSV. |
| 15 | Abrir el archivo. | La única fila tiene id `<ID-A>`. |

**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-019 — El filtro Eliminados no cambia los bytes

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-7 · C10 |
| Invariante | I10 |
| Técnica | Tabla de decisión |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-019-001@example.com`. S2: crear `<ID-A>` y `<ID-B>` con EXP-PREP-01 usando D4. S3: eliminar `<ID-B>` con EXP-PREP-02.

**Datos de prueba:** D1: `<ID-A>`; D2: `<ID-B>`; D3: dos archivos conservados por separado. D4: ambos son gastos ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null; creados con EXP-PREP-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-019-001@example.com`. | El campo muestra `qa+cp-exp-019-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el primer archivo. |
| 15 | Guardar el primer archivo fuera de Descargas. | El archivo queda disponible para comparar. |
| 16 | Hacer click en "Eliminados". | La lista muestra `<ID-B>` y no `<ID-A>`. |
| 17 | Hacer click en "Exportar". | Se abre otra vez la hoja. |
| 18 | Hacer click en "Descargar CSV". | Se descarga el segundo archivo. |
| 19 | Abrir los dos archivos descargados en una herramienta de comparación binaria. | Son idénticos; contienen `<ID-A>` y no `<ID-B>`. |

**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-020 — El archivo comienza con BOM UTF-8

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-8 · ADR-029 |
| Invariante | — |
| Técnica | Caso de uso |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-020-001@example.com`. S2: crear la transacción de D9 con EXP-PREP-01.

**Datos de prueba:** D1: bytes `EF BB BF`. D9: gasto `100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null, ID `<ID-A>`, creado con EXP-PREP-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-020-001@example.com`. | El campo muestra `qa+cp-exp-020-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el archivo. |
| 15 | Abrir el archivo en un visor hexadecimal. | Los primeros tres bytes son exactamente D1. |

**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-021 — El encabezado tiene doce columnas exactas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-8 · ADR-029 |
| Invariante | — |
| Técnica | Caso de uso |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-021-001@example.com`. S2: crear la transacción de D9 con EXP-PREP-01.

**Datos de prueba:** D1: `fecha,tipo,monto,moneda,tipo_de_cambio,monto_ars,categoria,cuenta,cuotas,primer_periodo,descripcion,id`. D9: gasto `100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null, ID `<ID-A>`, creado con EXP-PREP-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-021-001@example.com`. | El campo muestra `qa+cp-exp-021-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el archivo. Además, coincide exactamente con D1. |


**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-022 — Cada fila termina en CRLF incluida la última

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-8 · ADR-029 |
| Invariante | — |
| Técnica | Caso de uso |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-022-001@example.com`. S2: crear la transacción de D9 con EXP-PREP-01.

**Datos de prueba:** D1: bytes `0D 0A`. D9: gasto `100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null, ID `<ID-A>`, creado con EXP-PREP-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-022-001@example.com`. | El campo muestra `qa+cp-exp-022-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el archivo. |
| 15 | Abrir el archivo descargado en un visor hexadecimal y localizar el dato indicado en D. | Ambas terminan en D1; después del último `0A` no hay fila en blanco ni total. |

**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-023 — Doce cuotas salen en una sola fila por el total

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-9 · ADR-029 |
| Invariante | I1, I2, I3 |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-023-001@example.com`. S2: PR-07 con D1–D3; capturar `<ID-A>` con PR-08.

**Datos de prueba:** D1: `120000`; D2: 12 cuotas; D3: `15/08/2026`; D4: `fecha=2026-08-15`, `monto=120000.00`, `cuotas=12`, `primer_periodo=2026-08`, `id=<ID-A>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-023-001@example.com`. | El campo muestra `qa+cp-exp-023-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-08`. | La barra muestra exactamente `<APP>/transactions?period=2026-08`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-08`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el archivo. |
| 15 | Abrir el CSV. | Hay exactamente una fila de datos y los cinco campos de D4 coinciden. |

**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-024 — Un mes con solo cuota heredada produce Vacío

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-9, CA-21 · ADR-001/029 |
| Invariante | I2, I3 |
| Técnica | Adivinación de errores |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-024-001@example.com`. S2: PR-07 con D1–D3; no crear otra transacción.

**Datos de prueba:** D1: `30000`; D2: 3 cuotas; D3: `15/08/2026`; D4: septiembre 2026.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-024-001@example.com`. | El campo muestra `qa+cp-exp-024-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. Además, se ve una fila `2/3` por `$10.000,00`. |
| 13 | Leer la fila de cuota heredada. | La fila sigue mostrando `2/3` y `$10.000,00`. |

| 14 | Hacer click en "Exportar". | La hoja muestra el texto sobre cuotas anteriores. |
| 15 | Hacer click en "Descargar CSV". | No se descarga archivo. Además, dice "No tenés movimientos con fecha en septiembre 2026." |


**Post-condición:** Sin descarga; compra intacta.

### CP-EXP-025 — ARS se escribe con dos decimales exactos

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-10 · C2 |
| Invariante | I5 |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-025-001@example.com`. S2: EXP-PREP-01 con D1–D7.

**Datos de prueba:** D1: gasto; D2: `1500.00`; D3: ARS; D4: Otros/Efectivo; D5: 1; D6: `2026-09-15`; D7: null; D8: `<ID-A>`; D9: `gasto,1500.00,ARS,,1500.00`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-025-001@example.com`. | El campo muestra `qa+cp-exp-025-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el CSV. Además, contiene D9; no contiene `1.500,00`, signo ni `1500` sin decimales. |


**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-026 — USD conserva cuatro decimales de TC

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-10 · C2/C5 |
| Invariante | I5 |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-026-001@example.com`. S2: EXP-PREP-01 con D1–D7.

**Datos de prueba:** D1: gasto; D2: `300.00`; D3: USD; D4: TC `1250.5000`; D5: Otros/Efectivo; D6: `2026-09-15`; D7: null; D8: `<ID-A>`; D9: `300.00,USD,1250.5000,375150.00`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-026-001@example.com`. | El campo muestra `qa+cp-exp-026-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el CSV. Además, contiene D9 exactamente. |


**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-027 — Cambiar la referencia no recalcula el histórico

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-11 · C5 |
| Invariante | I5 |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-027-001@example.com`. S2: crear gasto USD con EXP-PREP-01. S3: actualizar la referencia con EXP-PREP-04.

**Datos de prueba:** D1: USD `300.00`; D2: TC aplicado `1250.5000`; D3: monto ARS `375150.00`; D4: `2026-09-15`; D5: `<ID-A>`; D6: nueva referencia `1400.0000` para `2026-09-01`. D7: categoría Otros; D8: cuenta Efectivo; D9: 1 cuota; D10: descripción null. La referencia se actualiza con EXP-PREP-04.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-027-001@example.com`. | El campo muestra `qa+cp-exp-027-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el CSV. Además, `tipo_de_cambio` es `1250.5000` y `monto_ars` es `375150.00`; no aparecen `1400.0000` ni `420000.00`. |


**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-028 — Una coma obliga a entrecomillar la descripción

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-12 · ADR-029 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-028-001@example.com`. S2: EXP-PREP-01.

**Datos de prueba:** D1: descripción `Heladera, 3 cuotas`; D2: campo `"Heladera, 3 cuotas"`; D3: `<ID-A>`. D4: gasto `100.00` ARS, categoría Otros, cuenta Efectivo, 1 cuota, fecha `2026-09-15`, preparado con EXP-PREP-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-028-001@example.com`. | El campo muestra `qa+cp-exp-028-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el CSV. Además, coincide byte a byte con D2. |


**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-029 — Las comillas internas se duplican

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-12 · ADR-029 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-029-001@example.com`. S2: EXP-PREP-01.

**Datos de prueba:** D1: descripción `Pizza "a la piedra"`; D2: campo `"Pizza ""a la piedra"""`; D3: `<ID-A>`. D4: gasto `100.00` ARS, categoría Otros, cuenta Efectivo, 1 cuota, fecha `2026-09-15`, preparado con EXP-PREP-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-029-001@example.com`. | El campo muestra `qa+cp-exp-029-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el CSV. Además, coincide byte a byte con D2. |


**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-030 — Un LF queda dentro de un campo citado

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-12 · ADR-029 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-030-001@example.com`. S2: EXP-PREP-01.

**Datos de prueba:** D1: descripción `Línea uno` + LF + `Línea dos`; D2: `<ID-A>`. D4: gasto `100.00` ARS, categoría Otros, cuenta Efectivo, 1 cuota, fecha `2026-09-15`, preparado con EXP-PREP-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-030-001@example.com`. | El campo muestra `qa+cp-exp-030-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el CSV. |
| 15 | Abrir el archivo descargado en un visor hexadecimal y localizar el dato indicado en D. | Empieza y termina con `22`, conserva el `0A` interno y la fila lógica termina en `0D 0A`. |
| 16 | Importar el archivo en Google Sheets con separador "Coma". | Se obtienen 12 columnas y una fila de datos; la descripción conserva dos líneas. |

**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-031 — Descripción con igual se neutraliza

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-13 · ADR-029 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-031-001@example.com`. S2: EXP-PREP-01.

**Datos de prueba:** D1: descripción `=1+1`; D2: salida `'=1+1`; D3: `<ID-A>`. D4: gasto `100.00` ARS, categoría Otros, cuenta Efectivo, 1 cuota, fecha `2026-09-15`, preparado con EXP-PREP-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-031-001@example.com`. | El campo muestra `qa+cp-exp-031-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el CSV. |
| 15 | Abrir el archivo descargado en un visor hexadecimal y localizar el dato indicado en D. | Coincide exactamente con D2: se agregó un solo apóstrofo, se conservó el resto y luego se aplicaron comillas si correspondía. |

**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-032 — Descripción con más se neutraliza

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-13 · ADR-029 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-032-001@example.com`. S2: EXP-PREP-01.

**Datos de prueba:** D1: descripción `+SUMA(A1)`; D2: salida `'+SUMA(A1)`; D3: `<ID-A>`. D4: gasto `100.00` ARS, categoría Otros, cuenta Efectivo, 1 cuota, fecha `2026-09-15`, preparado con EXP-PREP-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-032-001@example.com`. | El campo muestra `qa+cp-exp-032-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el CSV. |
| 15 | Abrir el archivo descargado en un visor hexadecimal y localizar el dato indicado en D. | Coincide exactamente con D2: se agregó un solo apóstrofo, se conservó el resto y luego se aplicaron comillas si correspondía. |

**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-033 — Descripción con menos se neutraliza

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-13 · ADR-029 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-033-001@example.com`. S2: EXP-PREP-01.

**Datos de prueba:** D1: descripción `-5, promo`; D2: salida `"'-5, promo"`; D3: `<ID-A>`. D4: gasto `100.00` ARS, categoría Otros, cuenta Efectivo, 1 cuota, fecha `2026-09-15`, preparado con EXP-PREP-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-033-001@example.com`. | El campo muestra `qa+cp-exp-033-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el CSV. |
| 15 | Abrir el archivo descargado en un visor hexadecimal y localizar el dato indicado en D. | Coincide exactamente con D2: se agregó un solo apóstrofo, se conservó el resto y luego se aplicaron comillas si correspondía. |

**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-034 — Descripción con arroba se neutraliza

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-13 · ADR-029 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-034-001@example.com`. S2: EXP-PREP-01.

**Datos de prueba:** D1: descripción `@usuario`; D2: salida `'@usuario`; D3: `<ID-A>`. D4: gasto `100.00` ARS, categoría Otros, cuenta Efectivo, 1 cuota, fecha `2026-09-15`, preparado con EXP-PREP-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-034-001@example.com`. | El campo muestra `qa+cp-exp-034-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el CSV. |
| 15 | Abrir el archivo descargado en un visor hexadecimal y localizar el dato indicado en D. | Coincide exactamente con D2: se agregó un solo apóstrofo, se conservó el resto y luego se aplicaron comillas si correspondía. |

**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-035 — Descripción con tabulación se neutraliza

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-13 · ADR-029 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-035-001@example.com`. S2: EXP-PREP-01.

**Datos de prueba:** D1: descripción TAB + `café`; D2: salida apóstrofo + TAB + `café`, sin comillas; D3: `<ID-A>`. D4: gasto `100.00` ARS, categoría Otros, cuenta Efectivo, 1 cuota, fecha `2026-09-15`, preparado con EXP-PREP-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-035-001@example.com`. | El campo muestra `qa+cp-exp-035-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el CSV. |
| 15 | Abrir el archivo descargado en un visor hexadecimal y localizar el dato indicado en D. | Coincide exactamente con D2: se agregó un solo apóstrofo, se conservó el resto y luego se aplicaron comillas si correspondía. |

**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-036 — Descripción con retorno de carro se neutraliza

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-13 · ADR-029 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-036-001@example.com`. S2: EXP-PREP-01.

**Datos de prueba:** D1: descripción CR + `nota`; D2: salida comilla + apóstrofo + CR + `nota` + comilla; D3: `<ID-A>`. D4: gasto `100.00` ARS, categoría Otros, cuenta Efectivo, 1 cuota, fecha `2026-09-15`, preparado con EXP-PREP-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-036-001@example.com`. | El campo muestra `qa+cp-exp-036-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el CSV. |
| 15 | Abrir el archivo descargado en un visor hexadecimal y localizar el dato indicado en D. | Coincide exactamente con D2: se agregó un solo apóstrofo, se conservó el resto y luego se aplicaron comillas si correspondía. |

**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-037 — Una categoría que empieza con igual se neutraliza

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-13 · ADR-029 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-037-001@example.com`. S2: crear categoría con EXP-PREP-03. S3: crear transacción con EXP-PREP-01.

**Datos de prueba:** D1: categoría `=Categoria QA`; D2: salida `'=Categoria QA`; D3: `<ID-A>`. D4: gasto `100.00` ARS, cuenta Efectivo, 1 cuota, `2026-09-15`, descripción null.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-037-001@example.com`. | El campo muestra `qa+cp-exp-037-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el CSV. Además, coincide exactamente con D2. |


**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-038 — Una cuenta que empieza con arroba se neutraliza

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-13 · ADR-029 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-038-001@example.com`. S2: crear cuenta con EXP-PREP-03. S3: crear transacción con EXP-PREP-01.

**Datos de prueba:** D1: cuenta `@Cuenta QA`; D2: salida `'@Cuenta QA`; D3: `<ID-A>`. D4: gasto `100.00` ARS, categoría Otros, 1 cuota, `2026-09-15`, descripción null; cuenta `cash`, `currency=ARS`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-038-001@example.com`. | El campo muestra `qa+cp-exp-038-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el CSV. Además, coincide exactamente con D2. |


**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-039 — Las filas se ordenan por fecha y creación

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-14 · ADR-029 |
| Invariante | — |
| Técnica | Tabla de decisión |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-039-001@example.com`. S2: crear A y B con EXP-PREP-01. S3: esperar que el reloj avance un segundo. S4: crear C con EXP-PREP-01. S5: ejecutar EXP-PREP-05.

**Datos de prueba:** D1: A gasto `100.00`, fecha `2026-09-20`; D2: B gasto `200.00`, fecha `2026-09-10`; D3: C gasto `300.00`, fecha `2026-09-10`; todos ARS, Otros/Efectivo, 1 cuota, descripción null; D4: `created_at(B) < created_at(C)`; D5: orden B,C,A.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-039-001@example.com`. | El campo muestra `qa+cp-exp-039-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el CSV. Además, el orden coincide exactamente con D5. |


**Post-condición:** Datos intactos. El desempate final por `id` queda como hueco manual aprobado.

### CP-EXP-040 — 1.000 transacciones se exportan sin faltantes

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-15 · C9 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-040-001@example.com`. S2: EXP-PREP-07 con N=1000.

**Datos de prueba:** D1: N=1000; D2: conjunto `$expIds`; D3: `Exportamos 1.000 movimientos`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-040-001@example.com`. | El campo muestra `qa+cp-exp-040-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2025-09`. | La barra muestra exactamente `<APP>/transactions?period=2025-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2025-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Todo 2025". | El alcance anual queda elegido. |
| 15 | Hacer click en "Descargar CSV". | Se descarga el CSV. Además, coincide exactamente con D3. Además, hay exactamente N además del encabezado. |
| 16 | Abrir la carpeta Descargas. | Se ve el CSV anual descargado. |
| 17 | Abrir el CSV en un visor de texto. | El encabezado y las N filas están disponibles para contar. |


| 18 | Abrir el CSV descargado y compararlo en una herramienta de comparación binaria con la lista `$expIds` de D3. | Hay N UUID distintos y el conjunto coincide: ninguno falta ni se repite. |

**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-041 — 1.500 transacciones se exportan sin faltantes

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-15 · C9 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-041-001@example.com`. S2: EXP-PREP-07 con N=1500.

**Datos de prueba:** D1: N=1500; D2: conjunto `$expIds`; D3: `Exportamos 1.500 movimientos`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-041-001@example.com`. | El campo muestra `qa+cp-exp-041-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2025-09`. | La barra muestra exactamente `<APP>/transactions?period=2025-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2025-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Todo 2025". | El alcance anual queda elegido. |
| 15 | Hacer click en "Descargar CSV". | Se descarga el CSV. Además, coincide exactamente con D3. Además, hay exactamente N además del encabezado. |
| 16 | Abrir la carpeta Descargas. | Se ve el CSV anual descargado. |
| 17 | Abrir el CSV en un visor de texto. | El encabezado y las N filas están disponibles para contar. |


| 18 | Abrir el CSV descargado y compararlo en una herramienta de comparación binaria con la lista `$expIds` de D3. | Hay N UUID distintos y el conjunto coincide: ninguno falta ni se repite. |

**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-042 — 2.000 transacciones se exportan sin faltantes

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-15 · C9 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-042-001@example.com`. S2: EXP-PREP-07 con N=2000.

**Datos de prueba:** D1: N=2000; D2: conjunto `$expIds`; D3: `Exportamos 2.000 movimientos`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-042-001@example.com`. | El campo muestra `qa+cp-exp-042-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2025-09`. | La barra muestra exactamente `<APP>/transactions?period=2025-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2025-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Todo 2025". | El alcance anual queda elegido. |
| 15 | Hacer click en "Descargar CSV". | Se descarga el CSV. Además, coincide exactamente con D3. Además, hay exactamente N además del encabezado. |
| 16 | Abrir la carpeta Descargas. | Se ve el CSV anual descargado. |
| 17 | Abrir el CSV en un visor de texto. | El encabezado y las N filas están disponibles para contar. |


| 18 | Abrir el CSV descargado y compararlo en una herramienta de comparación binaria con la lista `$expIds` de D3. | Hay N UUID distintos y el conjunto coincide: ninguno falta ni se repite. |

**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-043 — El CSV de A no contiene movimientos de B

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-16 · C7 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | CP-EXP-044 |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-05 con A `qa+cp-exp-043-001@example.com` y B `qa+cp-exp-043-002@example.com`. S2: EXP-PREP-01 una vez con cada token.

**Datos de prueba:** D1: A `111.00`, `SOLO-A`, `<ID-A>`; D2: B `999.00`, `SOLO-B`, `<ID-B>`; D3: fecha `2026-09-15`; D4: sesión A. D5: ambos son gastos ARS, Otros/Efectivo, 1 cuota.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-043-001@example.com`. | El campo muestra `qa+cp-exp-043-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga un CSV con una fila. Además, contiene `111.00`, `SOLO-A`, `<ID-A>`; no contiene `999.00`, `SOLO-B` ni `<ID-B>`. |


**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-044 — La API con token de A devuelve cero filas de B

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-16 · C7 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | API |
| Caso par | CP-EXP-043 |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-05 con A `qa+cp-exp-044-001@example.com` y B `qa+cp-exp-044-002@example.com`. S2: crear la transacción de B con EXP-PREP-01 y `<TOKEN-B>`; A no tiene transacciones. S3: token A.

**Datos de prueba:** D1: fecha B `2026-09-15`; D2: `<ID-B>`; D3: body ninguno.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar `GET <SUPABASE_URL>/rest/v1/transactions?select=id,amount&occurred_on=gte.2026-09-01&occurred_on=lt.2026-10-01&deleted_at=is.null` con `apikey: <ANON_KEY>` y `Authorization: Bearer <TOKEN-A>`, sin body. | HTTP 200 y cuerpo exacto `[]`; no aparecen `<ID-B>` ni `999`. |

**Post-condición:** Base sin cambios.

### CP-EXP-045 — Categoría archivada sale con el nombre actual

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-17 |
| Invariante | — |
| Técnica | Adivinación de errores |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-045-001@example.com`. S2: EXP-PREP-03 crea categoría. S3: EXP-PREP-01 crea gasto. S4: EXP-PREP-03 renombra y archiva.

**Datos de prueba:** D1: nombre inicial `Viajes`; D2: nombre actual `Viajes 2026`; D3: gasto `100.00`, `2026-09-15`; D4: `<ID-A>`. D5: gasto ARS, cuenta Efectivo, una cuota, descripción null.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-045-001@example.com`. | El campo muestra `qa+cp-exp-045-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el CSV. Además, es `Viajes 2026`, no `Viajes` ni vacío. |


**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-046 — Cuenta archivada sale con el nombre actual

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-17 |
| Invariante | — |
| Técnica | Adivinación de errores |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-046-001@example.com`. S2: EXP-PREP-03 crea cuenta. S3: EXP-PREP-01 crea gasto. S4: EXP-PREP-03 renombra y archiva.

**Datos de prueba:** D1: nombre inicial `Billetera QA`; D2: nombre actual `Billetera QA 2026`; D3: gasto `100.00`, `2026-09-15`; D4: `<ID-A>`. D5: gasto ARS, categoría Otros, una cuota, descripción null; cuenta `currency=ARS`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-046-001@example.com`. | El campo muestra `qa+cp-exp-046-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el CSV. Además, es `Billetera QA 2026`, no el nombre anterior ni vacío. |


**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-047 — Un ingreso exporta categoría vacía

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-17 |
| Invariante | I8 |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-047-001@example.com`. S2: EXP-PREP-01.

**Datos de prueba:** D1: ingreso; D2: `850000.00`; D3: ARS; D4: categoría null; D5: Caja de ahorro; D6: `2026-09-01`; D7: `<ID-A>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-047-001@example.com`. | El campo muestra `qa+cp-exp-047-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el CSV. Además, `tipo` es `ingreso` y `categoria` es el campo vacío entre dos comas. |


**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-048 — Eliminar una cuenta quita su transacción

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-20 · ADR-026 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-048-001@example.com`. S2: EXP-PREP-03 crea cuenta. S3: EXP-PREP-01 crea `<ID-A>`. S4: EXP-PREP-06 elimina la cuenta.

**Datos de prueba:** D1: cuenta `Cuenta descartable`; D2: gasto `700.00`, `2026-09-15`; D3: `<ID-A>` físicamente inexistente. D4: gasto ARS, categoría Otros, una cuota, descripción null; cuenta `cash`, `currency=ARS`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-048-001@example.com`. | El campo muestra `qa+cp-exp-048-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | No se descarga archivo. Además, dice "No tenés movimientos con fecha en septiembre 2026." |


**Post-condición:** Cuenta y transacción permanecen físicamente eliminadas.

### CP-EXP-049 — Descargar muestra Exportando y aria-busy

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-18 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-049-001@example.com`. S2: crear la transacción de D9 con EXP-PREP-01. S3: DevTools Network en `1 kbit/s`, latencia `2000 ms`.

**Datos de prueba:** D1: estado Exportando. D9: gasto `100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null, ID `<ID-A>`, creado con EXP-PREP-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-049-001@example.com`. | El campo muestra `qa+cp-exp-049-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | El botón dice "Exportando…", está deshabilitado y tiene `aria-busy="true"`. |

**Post-condición:** Restablecer la red y esperar exactamente una descarga.

### CP-EXP-050 — Los controles quedan bloqueados al exportar

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-18 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-050-001@example.com`. S2: crear la transacción de D9 con EXP-PREP-01. S3: DevTools Network en `1 kbit/s`, latencia `2000 ms`.

**Datos de prueba:** D1: estado Exportando. D9: gasto `100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null, ID `<ID-A>`, creado con EXP-PREP-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-050-001@example.com`. | El campo muestra `qa+cp-exp-050-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se ve "Exportando…". Además, los tres controles están deshabilitados. |


**Post-condición:** Restablecer la red y esperar exactamente una descarga.

### CP-EXP-051 — Un doble click inicia una sola descarga

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-18 |
| Invariante | — |
| Técnica | Adivinación de errores |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-051-001@example.com`. S2: crear la transacción de D9 con EXP-PREP-01. S3: Descargas sin archivos del período.

**Datos de prueba:** D1: doble click rápido; D2: una descarga esperada. D9: gasto `100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null, ID `<ID-A>`, creado con EXP-PREP-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-051-001@example.com`. | El campo muestra `qa+cp-exp-051-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer doble click rápido en "Descargar CSV". | El control pasa a "Exportando…" y queda deshabilitado. |
| 15 | Esperar a que termine. | Aparece un solo archivo y un solo aviso "Exportamos 1 movimiento"; no aparece archivo con sufijo. |

**Post-condición:** Exactamente una descarga.

### CP-EXP-052 — Una fila usa singular y cierra la hoja

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-19 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-052-001@example.com`. S2: crear la transacción de D9 con EXP-PREP-01.

**Datos de prueba:** D1: mensaje `Exportamos 1 movimiento`. D9: transacción base: gasto `100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null, ID `<ID-A>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-052-001@example.com`. | El campo muestra `qa+cp-exp-052-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el archivo. Además, la hoja está cerrada y aparece exactamente D1. Además, hay exactamente 1. |


**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-053 — Dos filas usan plural

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-19 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-053-001@example.com`. S2: crear las dos transacciones de D9 con EXP-PREP-01.

**Datos de prueba:** D1: mensaje `Exportamos 2 movimientos`. D9: gastos `100.00` (`<ID-A>`) y `200.00` (`<ID-B>`), ARS, Otros/Efectivo, `2026-09-15`, una cuota, descripción null, creados con EXP-PREP-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-053-001@example.com`. | El campo muestra `qa+cp-exp-053-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el archivo. Además, aparece exactamente D1. Además, hay exactamente 2. |


**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-054 — Un mes sin transacciones muestra Vacío

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-20 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-054-001@example.com`; no crear transacciones.

**Datos de prueba:** D1: septiembre 2026.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-054-001@example.com`. | El campo muestra `qa+cp-exp-054-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | No se descarga archivo. Además, dice "No tenés movimientos con fecha en septiembre 2026." |
| 15 | Leer el mensaje de período vacío. | El mensaje coincide exactamente con el texto esperado del paso 14. |

| 16 | Hacer click en "Todo 2026". | La opción anual queda elegida y desaparece el mensaje mensual. |

**Post-condición:** Sin descarga.

### CP-EXP-055 — Un año sin transacciones muestra Vacío anual

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-20 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-055-001@example.com`; no crear transacciones.

**Datos de prueba:** D1: Todo 2025.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-055-001@example.com`. | El campo muestra `qa+cp-exp-055-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2025-09`. | La barra muestra exactamente `<APP>/transactions?period=2025-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2025-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Todo 2025". | El alcance anual queda elegido. |
| 15 | Hacer click en "Descargar CSV". | No se descarga archivo. Además, dice "No tenés movimientos con fecha en 2025." |


**Post-condición:** Sin descarga.

### CP-EXP-056 — Un período con solo eliminadas muestra Vacío

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-20 · C10 |
| Invariante | I10 |
| Técnica | Particiones de equivalencia |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-056-001@example.com`. S2: crear y eliminar `<ID-A>` con EXP-PREP-01/02.

**Datos de prueba:** D1: gasto `100.00`, `2026-09-15`; D2: `<ID-A>` eliminado.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-056-001@example.com`. | El campo muestra `qa+cp-exp-056-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | No se descarga archivo. Además, dice "No tenés movimientos con fecha en septiembre 2026." |


**Post-condición:** La transacción sigue eliminada.

### CP-EXP-057 — Offline muestra el error exacto

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-22 · C9 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (comportamiento Offline exclusivo del cliente; excepción C6 aprobada) |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-057-001@example.com`. S2: crear la transacción de D9 con EXP-PREP-01.

**Datos de prueba:** D1: DevTools Network > Offline. D9: gasto `100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null, ID `<ID-A>`, creado con EXP-PREP-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-057-001@example.com`. | El campo muestra `qa+cp-exp-057-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Activar Offline en DevTools. | Las solicitudes nuevas quedan sin conexión. |
| 15 | Hacer click en "Descargar CSV". | No se descarga archivo. Además, tiene `role="alert"` y dice "No pudimos exportar tus movimientos. Probá de nuevo." Además, alcances, "Descargar CSV" y "Cancelar" están habilitados. |


**Post-condición:** Desactivar Offline; sin descarga.

### CP-EXP-058 — El reintento después de Offline descarga completo

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-22 · C9 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (reintento Offline exclusivo del cliente; excepción C6 aprobada) |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-058-001@example.com`. S2: crear dos transacciones con EXP-PREP-01.

**Datos de prueba:** D1: Offline inicial; D2: dos IDs exactos. D9: `<ID-A>` gasto `100.00` y `<ID-B>` gasto `200.00`; ambos ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null, creados con EXP-PREP-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-058-001@example.com`. | El campo muestra `qa+cp-exp-058-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Activar Offline. | Las solicitudes quedan sin conexión. |
| 15 | Hacer click en "Descargar CSV". | Se muestra el error y no se descarga. |
| 16 | Desactivar Offline. | La conexión queda restablecida. |
| 17 | Hacer click en "Descargar CSV". | El error desaparece, se descarga el archivo y aparece "Exportamos 2 movimientos". Además, contiene exactamente `<ID-A>` y `<ID-B>`, una vez cada uno. |


**Post-condición:** Una descarga completa.

### CP-EXP-059 — Cancelar desde Error cierra sin descargar

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-22 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (cierre de hoja exclusivo del cliente; excepción C6 aprobada) |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-059-001@example.com`. S2: crear la transacción de D9 con EXP-PREP-01.

**Datos de prueba:** D1: Offline; D2: URL `?period=2026-09`. D9: gasto `100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null, ID `<ID-A>`, creado con EXP-PREP-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-059-001@example.com`. | El campo muestra `qa+cp-exp-059-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Activar Offline. | Las solicitudes quedan sin conexión. |
| 15 | Hacer click en "Descargar CSV". | Aparece el error exacto. |
| 16 | Hacer click en "Cancelar". | La hoja se cierra, no se descarga archivo y la URL conserva D2. |

**Post-condición:** Desactivar Offline; sin descarga.

### CP-EXP-060 — Cancelar cierra sin descargar

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-23 |
| Invariante | — |
| Técnica | Caso de uso |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Baja |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-060-001@example.com`. S2: crear la transacción de D9 con EXP-PREP-01.

**Datos de prueba:** D1: URL `?period=2026-09`. D9: transacción base: gasto `100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null, ID `<ID-A>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-060-001@example.com`. | El campo muestra `qa+cp-exp-060-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Cancelar". | La hoja se cierra, no se descarga archivo y la URL conserva D1. |

**Post-condición:** Sin descarga.

### CP-EXP-061 — Escape cierra sin descargar

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-23 |
| Invariante | — |
| Técnica | Caso de uso |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Baja |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-061-001@example.com`. S2: crear la transacción de D9 con EXP-PREP-01.

**Datos de prueba:** D1: URL `?period=2026-09`. D9: transacción base: gasto `100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null, ID `<ID-A>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-061-001@example.com`. | El campo muestra `qa+cp-exp-061-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Presionar Escape. | La hoja se cierra, no se descarga archivo y la URL conserva D1. |

**Post-condición:** Sin descarga.

### CP-EXP-062 — Tocar fuera cierra sin descargar

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-23 |
| Invariante | — |
| Técnica | Caso de uso |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Baja |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-062-001@example.com`. S2: crear la transacción de D9 con EXP-PREP-01.

**Datos de prueba:** D1: URL `?period=2026-09`. D9: transacción base: gasto `100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null, ID `<ID-A>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-062-001@example.com`. | El campo muestra `qa+cp-exp-062-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en el fondo fuera de la hoja. | La hoja se cierra, no se descarga archivo y la URL conserva D1. |

**Post-condición:** Sin descarga.

### CP-EXP-063 — Atrás cierra la hoja inicial

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · requisito narrativo: todo cambio de URL · C11 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-063-001@example.com`. S2: una transacción creada con EXP-PREP-01; el historial se construye en los pasos.

**Datos de prueba:** D1: historial agosto → septiembre. D9: gasto `100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null, ID `<ID-A>`, creado con EXP-PREP-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-063-001@example.com`. | El campo muestra `qa+cp-exp-063-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en la barra de direcciones. | La URL queda seleccionada. |
| 14 | Escribir `<APP>/transactions?period=2026-08`. | La barra muestra agosto. |
| 15 | Presionar Enter. | Se abre agosto 2026. |
| 16 | Hacer click en la barra de direcciones. | La URL queda seleccionada. |
| 17 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra septiembre. |
| 18 | Presionar Enter. | Se abre septiembre y Atrás tiene destino agosto. |
| 19 | Hacer click en "Exportar". | Se abre la hoja fijada a septiembre. |
| 20 | Hacer click en Atrás del navegador. | La hoja se cierra, la URL pasa a `?period=2026-08` y no se descarga archivo. |

**Post-condición:** Sin descarga.

### CP-EXP-064 — Atrás durante Exportando cancela la descarga

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · requisito narrativo: todo cambio de URL · C11 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (navegación y cancelación exclusivas del cliente; excepción C6 aprobada) |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-064-001@example.com`. S2: crear la transacción de D9 con EXP-PREP-01. S3: el historial se construye en los pasos. S4: throttling `1 kbit/s`, latencia `2000 ms`.

**Datos de prueba:** D1: exportación de septiembre en curso. D9: gasto `100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null, ID `<ID-A>`, creado con EXP-PREP-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-064-001@example.com`. | El campo muestra `qa+cp-exp-064-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en la barra de direcciones. | La URL queda seleccionada. |
| 14 | Escribir `<APP>/transactions?period=2026-08`. | La barra muestra agosto. |
| 15 | Presionar Enter. | Se abre agosto. |
| 16 | Hacer click en la barra de direcciones. | La URL queda seleccionada. |
| 17 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra septiembre. |
| 18 | Presionar Enter. | Se abre septiembre y Atrás tiene destino agosto. |
| 19 | Hacer click en "Exportar". | Se abre la hoja. |
| 20 | Hacer click en "Descargar CSV". | Se ve "Exportando…". |
| 21 | Hacer click en Atrás del navegador. | La hoja se cierra y la URL pasa a agosto. |
| 22 | Restablecer la velocidad de red. | No aparece ningún archivo ni aviso de éxito. |

**Post-condición:** Sin descarga.

### CP-EXP-065 — Adelante cierra la hoja inicial

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · requisito narrativo: todo cambio de URL |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-065-001@example.com`. S2: el historial se construye en los pasos.

**Datos de prueba:** D1: Adelante tiene destino septiembre.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-065-001@example.com`. | El campo muestra `qa+cp-exp-065-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-08`. | La barra muestra exactamente `<APP>/transactions?period=2026-08`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-08`. |
| 13 | Hacer click en la barra de direcciones. | La URL queda seleccionada. |
| 14 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra septiembre. |
| 15 | Presionar Enter. | Se abre septiembre. |
| 16 | Hacer click en Atrás del navegador. | Se vuelve a agosto y Adelante tiene destino septiembre. |
| 17 | Hacer click en "Exportar". | Se abre la hoja fijada a agosto. |
| 18 | Hacer click en Adelante del navegador. | La hoja se cierra, la URL pasa a `?period=2026-09` y no se descarga archivo. |

**Post-condición:** Sin descarga.

### CP-EXP-066 — Salir a Resumen cierra la hoja

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · requisito narrativo: todo cambio de URL |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-066-001@example.com`. S2: crear la transacción de D9 con EXP-PREP-01.

**Datos de prueba:** D1: destino `/dashboard?period=2026-09`. D9: gasto `100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null, ID `<ID-A>`, creado con EXP-PREP-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-066-001@example.com`. | El campo muestra `qa+cp-exp-066-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en la barra de direcciones. | La URL queda seleccionada. |
| 15 | Escribir `<APP>/dashboard?period=2026-09`. | La barra muestra D1. |
| 16 | Presionar Enter. | Se abre Resumen, la hoja desaparece y no se descarga archivo. |

**Post-condición:** Sin descarga.

### CP-EXP-067 — Exportar no modifica datos ni período

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-25 · C9/C11 |
| Invariante | — |
| Técnica | Caso de uso |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-067-001@example.com`. S2: crear `<ID-A>` con EXP-PREP-01 usando D4.

**Datos de prueba:** D1: una fila por `$3.000,00`; D2: URL `?period=2026-09`; D3: `<ID-A>`; D4: gasto `3000.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-067-001@example.com`. | El campo muestra `qa+cp-exp-067-001@example.com`. |
| 7 | Hacer click en el campo "Contraseña". | El cursor queda en "Contraseña". |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en el botón "Entrar". | Se abre la aplicación en Registrar. |
| 10 | Hacer click en la barra de direcciones. | El contenido queda seleccionado. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. Además, se ve una fila `<ID-A>` por `$3.000,00` y la URL contiene D3. |
| 13 | Leer la fila de movimientos. | La fila `<ID-A>` sigue mostrando `$3.000,00` antes de abrir Exportar. |

| 14 | Hacer click en "Exportar". | Se abre la hoja. |
| 15 | Hacer click en "Descargar CSV". | Se descarga un CSV con una fila y la URL sigue D3. |
| 16 | Recargar Movimientos. | Sigue una fila por `$3.000,00`. |

**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-068 — Una alta concurrente impide descargar un año incompleto

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · Completitud · C9 |
| Invariante | — |
| Técnica | Adivinación de errores |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (no existe RPC pública de exportación para reproducir la condición concurrente; excepción C6 aprobada) |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-068-001@example.com`. S2: EXP-PREP-07 con N=1500. S3: en una segunda ventana de otro navegador, iniciar sesión con el mismo usuario y ejecutar PR-06 con monto `2` y cuenta "Efectivo"; dejarla en el paso 3/3. S4: aplicar DevTools Network `1 kbit/s`, latencia `2000 ms`, solo a la primera ventana.

**Datos de prueba:** D1: conteo inicial 1500; D2: alta concurrente `2.00` ARS, Otros/Efectivo, 1 cuota, fecha `31/12/2025`, descripción vacía; D3: el archivo no debe descargarse.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar". |
| 5 | Hacer click en "Email". | El cursor queda en el campo. |
| 6 | Escribir `qa+cp-exp-068-001@example.com`. | El campo muestra `qa+cp-exp-068-001@example.com`. |
| 7 | Hacer click en "Contraseña". | El cursor queda en el campo. |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en "Entrar". | Se abre Registrar. |
| 10 | Hacer click en la barra de direcciones. | La URL queda seleccionada. |
| 11 | Escribir `<APP>/transactions?period=2025-09`. | La barra muestra `<APP>/transactions?period=2025-09`. |
| 12 | Presionar Enter. | Se abre Movimientos de `2025-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Todo 2025". | El alcance anual queda elegido. |
| 15 | Hacer click en "Descargar CSV". | Se ve "Exportando…" y comienzan las lecturas paginadas. |
| 16 | Esperar a que la primera lectura de transacciones muestre HTTP 200 en Network. | La primera página terminó y la exportación continúa. |
| 17 | Cambiar a la segunda ventana. | Se ve Registrar en el paso 3/3 con monto `2` y cuenta "Efectivo". |
| 18 | Hacer click en "Otra" dentro de "Fecha". | El campo de fecha queda editable. |
| 19 | Hacer click en el campo de fecha. | El cursor queda en el campo. |
| 20 | Escribir `31/12/2025`. | El campo muestra `31/12/2025`. |
| 21 | Hacer click en "Guardar gasto". | Aparece "Gasto guardado" y el botón muestra "Guardado". |
| 22 | Volver a la primera ventana. | La hoja sigue en "Exportando…" o ya muestra el resultado. |
| 23 | Esperar a que termine la exportación. | No se descarga ningún archivo; la hoja sigue abierta. Además, dice "No pudimos exportar tus movimientos. Probá de nuevo." con `role="alert"`. |


**Post-condición:** Restablecer la red; queda la transacción concurrente guardada y ninguna descarga.

### CP-EXP-069 — Escape no cierra la hoja durante Exportando

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-18 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-069-001@example.com`. S2: crear la transacción D1 (`100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null, ID `<ID-A>`) con EXP-PREP-01. S3: throttling `1 kbit/s`, latencia `2000 ms`.

**Datos de prueba:** D1: gasto `100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, null, `<ID-A>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar". |
| 5 | Hacer click en "Email". | El cursor queda en el campo. |
| 6 | Escribir `qa+cp-exp-069-001@example.com`. | El campo muestra `qa+cp-exp-069-001@example.com`. |
| 7 | Hacer click en "Contraseña". | El cursor queda en el campo. |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en "Entrar". | Se abre Registrar. |
| 10 | Hacer click en la barra de direcciones. | La URL queda seleccionada. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos de `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se ve "Exportando…". |
| 15 | Presionar Escape. | La hoja permanece abierta y sigue mostrando "Exportando…". |

**Post-condición:** Restablecer la red y esperar exactamente una descarga.

### CP-EXP-070 — Tocar fuera no cierra la hoja durante Exportando

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-18 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-070-001@example.com`. S2: crear la transacción D1 (`100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null, ID `<ID-A>`) con EXP-PREP-01. S3: throttling `1 kbit/s`, latencia `2000 ms`.

**Datos de prueba:** D1: gasto `100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, null, `<ID-A>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar". |
| 5 | Hacer click en "Email". | El cursor queda en el campo. |
| 6 | Escribir `qa+cp-exp-070-001@example.com`. | El campo muestra `qa+cp-exp-070-001@example.com`. |
| 7 | Hacer click en "Contraseña". | El cursor queda en el campo. |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en "Entrar". | Se abre Registrar. |
| 10 | Hacer click en la barra de direcciones. | La URL queda seleccionada. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos de `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se ve "Exportando…". |
| 15 | Hacer click en el fondo fuera de la hoja. | La hoja permanece abierta y sigue mostrando "Exportando…". |

**Post-condición:** Restablecer la red y esperar exactamente una descarga.

### CP-EXP-071 — Un lector RFC 4180 obtiene doce columnas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-12 · ADR-029 |
| Invariante | — |
| Técnica | Caso de uso |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-071-001@example.com`. S2: crear la transacción D1 (`100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null, ID `<ID-A>`) con EXP-PREP-01. S3: acceso a Google Sheets.

**Datos de prueba:** D1: gasto `100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`; D2: descripción `Uno, "dos"` + LF + `Tres`; D3: `<ID-A>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar". |
| 5 | Hacer click en "Email". | El cursor queda en el campo. |
| 6 | Escribir `qa+cp-exp-071-001@example.com`. | El campo muestra `qa+cp-exp-071-001@example.com`. |
| 7 | Hacer click en "Contraseña". | El cursor queda en el campo. |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en "Entrar". | Se abre Registrar. |
| 10 | Hacer click en la barra de direcciones. | La URL queda seleccionada. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos de `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el CSV. |
| 15 | Abrir una hoja vacía en Google Sheets. | Se muestra una hoja sin datos. |
| 16 | Hacer click en "Archivo". | Se abre el menú Archivo. |
| 17 | Hacer click en "Importar". | Se abre el diálogo Importar archivo. |
| 18 | Hacer click en "Subir". | Se muestra la zona para subir un archivo. |
| 19 | Elegir el CSV descargado. | Se muestra la configuración de importación. |
| 20 | Elegir "Coma" como separador. | El separador "Coma" queda seleccionado. |
| 21 | Confirmar la importación. | Se importa un encabezado y una fila de datos. Además, hay exactamente 12 columnas. Además, conserva `Uno, "dos"`, un salto de línea y `Tres` en una sola celda. |


**Post-condición:** CSV conservado como evidencia; la base no cambia.

### CP-EXP-072 — Exportar no modifica el total de Resumen

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-25 · C9 |
| Invariante | — |
| Técnica | Caso de uso |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-072-001@example.com`. S2: crear `<ID-A>` con EXP-PREP-01 usando D3.

**Datos de prueba:** D1: total antes y después `$3.000,00`; D2: período `2026-09`; D3: gasto `3000.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar". |
| 5 | Hacer click en "Email". | El cursor queda en el campo. |
| 6 | Escribir `qa+cp-exp-072-001@example.com`. | El campo muestra `qa+cp-exp-072-001@example.com`. |
| 7 | Hacer click en "Contraseña". | El cursor queda en el campo. |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en "Entrar". | Se abre Registrar. |
| 10 | Hacer click en la barra de direcciones. | La URL queda seleccionada. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra esa URL. |
| 12 | Presionar Enter. | Se abre Movimientos de `2026-09`. |
| 13 | Hacer click en la barra de direcciones. | La URL queda seleccionada. |
| 14 | Escribir `<APP>/dashboard?period=2026-09`. | La barra muestra esa URL. |
| 15 | Presionar Enter. | Resumen muestra `$3.000,00`. |
| 16 | Hacer click en la barra de direcciones. | La URL queda seleccionada. |
| 17 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra esa URL. |
| 18 | Presionar Enter. | Se abre Movimientos. |
| 19 | Hacer click en "Exportar". | Se abre la hoja. |
| 20 | Hacer click en "Descargar CSV". | Se descarga un CSV con una fila. |
| 21 | Hacer click en la barra de direcciones. | La URL queda seleccionada. |
| 22 | Escribir `<APP>/dashboard?period=2026-09`. | La barra muestra esa URL. |
| 23 | Presionar Enter. | Resumen vuelve a mostrar exactamente D1. |

**Post-condición:** Una transacción y una descarga; total sin cambios.

### CP-EXP-073 — HTTP 500 muestra Error y no descarga

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · Estado Error · C9 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (no existe RPC de exportación invocable para provocar HTTP 500; excepción C6 aprobada) |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-073-001@example.com`. S2: crear `<ID-A>` con EXP-PREP-01. S3: ejecutar EXP-PREP-08.

**Datos de prueba:** D1: gasto `100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, null; D2: HTTP 500 simulado.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar". |
| 5 | Hacer click en "Email". | El cursor queda en el campo. |
| 6 | Escribir `qa+cp-exp-073-001@example.com`. | El campo muestra `qa+cp-exp-073-001@example.com`. |
| 7 | Hacer click en "Contraseña". | El cursor queda en el campo. |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en "Entrar". | Se abre Registrar. |
| 10 | Hacer click en la barra de direcciones. | La URL queda seleccionada. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra esa URL. |
| 12 | Presionar Enter. | Se abre Movimientos de `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | No se descarga archivo y aparece "No pudimos exportar tus movimientos. Probá de nuevo." con `role="alert"`. |

**Post-condición:** Restaurar `fetch` según EXP-PREP-08; sin descarga.

### CP-EXP-074 — Un monto textual inválido cancela la descarga

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · Estado Error · C2/C9 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (no existe RPC de exportación invocable para inyectar `amount_text` inválido; excepción C6 aprobada) |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-074-001@example.com`. S2: crear `<ID-A>` con EXP-PREP-01. S3: ejecutar EXP-PREP-09.

**Datos de prueba:** D1: gasto `1500.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, null; D2: respuesta interceptada `amount_text="1500"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar". |
| 5 | Hacer click en "Email". | El cursor queda en el campo. |
| 6 | Escribir `qa+cp-exp-074-001@example.com`. | El campo muestra `qa+cp-exp-074-001@example.com`. |
| 7 | Hacer click en "Contraseña". | El cursor queda en el campo. |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en "Entrar". | Se abre Registrar. |
| 10 | Hacer click en la barra de direcciones. | La URL queda seleccionada. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra esa URL. |
| 12 | Presionar Enter. | Se abre Movimientos de `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | No se descarga archivo y aparece "No pudimos exportar tus movimientos. Probá de nuevo." con `role="alert"`. |

**Post-condición:** Restaurar `fetch` según EXP-PREP-09; la base conserva `1500.00` y no hay descarga.

### CP-EXP-075 — Cambiar el alcance borra el mensaje de Error

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · Estado Error |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (estado de la hoja exclusivo del cliente; excepción C6 aprobada) |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-075-001@example.com`. S2: crear `<ID-A>` con EXP-PREP-01. S3: ejecutar EXP-PREP-08.

**Datos de prueba:** D1: gasto `100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, null; D2: error visible en alcance mensual.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar". |
| 5 | Hacer click en "Email". | El cursor queda en el campo. |
| 6 | Escribir `qa+cp-exp-075-001@example.com`. | El campo muestra `qa+cp-exp-075-001@example.com`. |
| 7 | Hacer click en "Contraseña". | El cursor queda en el campo. |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en "Entrar". | Se abre Registrar. |
| 10 | Hacer click en la barra de direcciones. | La URL queda seleccionada. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra esa URL. |
| 12 | Presionar Enter. | Se abre Movimientos de `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Aparece el mensaje de Error. |
| 15 | Hacer click en "Todo 2026". | "Todo 2026" queda elegido y desaparece el mensaje "No pudimos exportar tus movimientos. Probá de nuevo." |

**Post-condición:** Restaurar `fetch`; sin descarga.

## 4. Historias o CA sin caso (huecos)

- No hay criterios de US-47 sin un caso asociado.
- **CA-14 — desempate por `id`:** CP-EXP-039 cubre fecha y `created_at`. El último desempate queda fuera de la ejecución manual porque la API pública no permite fijar ambos campos. Requiere automatización de dominio o fixture administrativo futuro.
- Los errores por cambio concurrente, HTTP 500 y decimal textual inválido se cubren mediante CP-EXP-068, CP-EXP-073 y CP-EXP-074.

## 5. Ambigüedades para el PO

1. `?period` inválido se menciona en la narrativa de US-47, pero no tiene un CA/I/R que defina el fallback; no se inventó un oráculo y queda pendiente del PO.
2. No quedan otras decisiones bloqueantes. La excepción de C6 para comportamientos exclusivos del cliente y el hueco manual de CA-14 fueron aprobados para EXP.
3. No se fija una duración mínima de Exportando; CP-EXP-049/050 usa throttling solo para hacerlo observable.
4. Una categoría archivada y una activa pueden compartir nombre; el archivo no las distingue fuera del `id`, como acepta la historia.
5. CP-EXP-073/074/075 no tienen caso par API porque el producto no expone una RPC de exportación a la que el probador pueda provocar HTTP 500, inyectar `amount_text` inválido o conservar un error al cambiar el alcance. EXP-PREP-08/09 interceptan la respuesta HTTP en el cliente para verificar exclusivamente el comportamiento de la hoja; se documenta como excepción C6 aprobada.

## 6. Resumen cuantitativo

| Dimensión | Cantidad |
|---|---:|
| Casos totales | 75 |
| Positivos | 44 |
| Negativos | 10 |
| Límites | 21 |
| Canal UI | 74 |
| Canal API | 1 |
| Prioridad Alta | 54 |
| Prioridad Media | 18 |
| Prioridad Baja | 3 |
| Automatizable Sí | 75 |
