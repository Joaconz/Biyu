# Casos de prueba V2 · EXP — Exportar CSV

> **Recorte y renumeración del 2026-10-27.** Los IDs son consecutivos desde 001; la tabla de equivalencia con los IDs anteriores está en [`equivalencia-ids.md`](../equivalencia-ids.md). El catálogo de Exportar CSV pasó de 75 a 31 casos: se quitaron los bordes de mes y año repetidos, las variantes de neutralización de fórmulas, los textos de singular y plural y los cierres de la hoja repetidos. Los criterios que quedaron sin caso figuran como «sin caso» en la trazabilidad.

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

## Convenciones

- Cada caso usa PR-01 con el email literal y contraseña `Clave123!`.
- Antes de una descarga, quitar de Descargas cualquier archivo Biyu del mismo período.
- Un sufijo que agregue el navegador no cambia el nombre propuesto que se valida.
- Los UUID capturados son datos exactos del caso.

## 1. Trazabilidad CA-k → casos

| Criterio | Casos |
|---|---|
| US-47 · CA-1 | CP-EXP-001 |
| US-47 · CA-2 | CP-EXP-002 |
| US-47 · CA-3 | CP-EXP-003 |
| US-47 · CA-4 | — (sin caso tras el recorte del 2026-10-27) |
| US-47 · CA-5 | CP-EXP-004, CP-EXP-005, CP-EXP-006, CP-EXP-007 |
| US-47 · CA-6 | CP-EXP-008 |
| US-47 · CA-7 | — (sin caso tras el recorte del 2026-10-27) |
| US-47 · CA-8 | CP-EXP-009, CP-EXP-010 |
| US-47 · CA-9 | CP-EXP-011 |
| US-47 · CA-10 | CP-EXP-012, CP-EXP-013 |
| US-47 · CA-11 | — (sin caso tras el recorte del 2026-10-27) |
| US-47 · CA-12 | CP-EXP-014, CP-EXP-015 |
| US-47 · CA-13 | CP-EXP-016, CP-EXP-017 |
| US-47 · CA-14 | — (sin caso tras el recorte del 2026-10-27) |
| US-47 · CA-15 | CP-EXP-018 |
| US-47 · CA-16 | CP-EXP-019, CP-EXP-020 |
| US-47 · CA-17 | CP-EXP-021, CP-EXP-022 |
| US-47 · CA-18 | CP-EXP-023 |
| US-47 · CA-19 | — (sin caso tras el recorte del 2026-10-27) |
| US-47 · CA-20 | CP-EXP-024 |
| US-47 · CA-21 | — (sin caso tras el recorte del 2026-10-27) |
| US-47 · CA-22 | CP-EXP-025, CP-EXP-026 |
| US-47 · CA-23 | CP-EXP-027 |
| US-47 · CA-24 | CP-EXP-028, CP-EXP-029 |
| US-47 · CA-25 | — (sin caso tras el recorte del 2026-10-27) |
| US-47 · requisito narrativo: todo cambio de URL | — (sin caso tras el recorte del 2026-10-27) |
| US-47 · Completitud | CP-EXP-030 |
| US-47 · Estado Error | CP-EXP-031 |

## 2. Índice

| ID | Título | Tipo | Canal | Prioridad | Caso par |
|---|---|---|---|---|---|
| CP-EXP-001 | Una URL válida fija septiembre 2026 | Positivo | UI | Media | — |
| CP-EXP-002 | El mes siguiente está bloqueado | Límite | UI | Alta | — |
| CP-EXP-003 | El alcance mensual propone el nombre 2026-09 | Positivo | UI | Alta | — |
| CP-EXP-004 | El primer día del mes se incluye | Límite | UI | Alta | — |
| CP-EXP-005 | El día posterior al mes se excluye | Límite | UI | Alta | — |
| CP-EXP-006 | El 1 de enero se incluye en el año | Límite | UI | Alta | — |
| CP-EXP-007 | El día posterior al año se excluye | Límite | UI | Alta | — |
| CP-EXP-008 | Una transacción eliminada queda fuera | Positivo | UI | Alta | — |
| CP-EXP-009 | El archivo comienza con BOM UTF-8 | Positivo | UI | Alta | — |
| CP-EXP-010 | El encabezado tiene doce columnas exactas | Positivo | UI | Alta | — |
| CP-EXP-011 | Doce cuotas salen en una sola fila por el total | Límite | UI | Alta | — |
| CP-EXP-012 | ARS se escribe con dos decimales exactos | Positivo | UI | Alta | — |
| CP-EXP-013 | USD conserva cuatro decimales de TC | Positivo | UI | Alta | — |
| CP-EXP-014 | Una coma obliga a entrecomillar la descripción | Positivo | UI | Alta | — |
| CP-EXP-015 | Las comillas internas se duplican | Positivo | UI | Alta | — |
| CP-EXP-016 | Descripción con igual se neutraliza | Positivo | UI | Alta | — |
| CP-EXP-017 | Una categoría que empieza con igual se neutraliza | Positivo | UI | Alta | — |
| CP-EXP-018 | 1.500 transacciones se exportan sin faltantes | Límite | UI | Alta | — |
| CP-EXP-019 | El CSV de A no contiene movimientos de B | Negativo | UI | Alta | CP-EXP-020 |
| CP-EXP-020 | La API con token de A devuelve cero filas de B | Negativo | API | Alta | CP-EXP-019 |
| CP-EXP-021 | Categoría archivada sale con el nombre actual | Positivo | UI | Media | — |
| CP-EXP-022 | Un ingreso exporta categoría vacía | Positivo | UI | Media | — |
| CP-EXP-023 | Un doble click inicia una sola descarga | Positivo | UI | Alta | — |
| CP-EXP-024 | Un mes sin transacciones muestra Vacío | Límite | UI | Media | — |
| CP-EXP-025 | Offline muestra el error exacto | Negativo | UI | Alta | — (excepción cliente aprobada) |
| CP-EXP-026 | El reintento después de Offline descarga completo | Negativo | UI | Alta | — (excepción cliente aprobada) |
| CP-EXP-027 | Tocar fuera cierra sin descargar | Positivo | UI | Baja | — |
| CP-EXP-028 | Atrás cierra la hoja inicial | Positivo | UI | Media | — |
| CP-EXP-029 | Atrás durante Exportando cancela la descarga | Negativo | UI | Alta | — (excepción cliente aprobada) |
| CP-EXP-030 | Una alta concurrente impide descargar un año incompleto | Negativo | UI | Alta | — (excepción cliente aprobada) |
| CP-EXP-031 | HTTP 500 muestra Error y no descarga | Negativo | UI | Alta | — (excepción cliente aprobada) |

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

### CP-EXP-002 — El mes siguiente está bloqueado

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

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-002-001@example.com`. S2: dispositivo en `09/10/2026`.

**Datos de prueba:** D1: mes futuro `2026-11`.

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
| 11 | Escribir `<APP>/transactions?period=2026-11`. | La barra muestra exactamente `<APP>/transactions?period=2026-11`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-11`. Además, "Exportar" está deshabilitado y se ve exactamente "Solo podés exportar el mes actual o meses anteriores." |
| 13 | Leer el mensaje de período futuro. | El mensaje coincide exactamente con el texto esperado del paso 12. |

| 14 | Hacer click en "Exportar". | No se abre ninguna hoja y la URL sigue `?period=2026-11`. |

**Post-condición:** Sin descarga.

### CP-EXP-003 — El alcance mensual propone el nombre 2026-09

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

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-003-001@example.com`. S2: EXP-PREP-01 con D1–D7.

**Datos de prueba:** D1: gasto; D2: `1500.00`; D3: ARS; D4: Otros/Efectivo; D5: 1 cuota; D6: `2026-09-15`; D7: `Almuerzo`; D8: `<ID-A>`; D9: `biyu-movimientos-2026-09.csv`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar" con los campos "Email" y "Contraseña" y el botón "Entrar". |
| 5 | Hacer click en el campo "Email". | El cursor queda en "Email". |
| 6 | Escribir `qa+cp-exp-003-001@example.com`. | El campo muestra `qa+cp-exp-003-001@example.com`. |
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

### CP-EXP-004 — El primer día del mes se incluye

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

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-004-001@example.com`. S2: EXP-PREP-01 con D1–D7.

**Datos de prueba:** D1: gasto; D2: `100.00`; D3: ARS; D4: Otros/Efectivo; D5: 1; D6: `2026-09-01`; D7: null; D8: `<ID-A>`.

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
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja con septiembre elegido. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el archivo mensual. |
| 15 | Abrir el archivo como texto. | Hay exactamente una fila con fecha `2026-09-01` e id `<ID-A>`. |

**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-005 — El día posterior al mes se excluye

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

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-005-001@example.com`. S2: EXP-PREP-01 con D1–D7.

**Datos de prueba:** D1: gasto; D2: `100.00`; D3: ARS; D4: Otros/Efectivo; D5: 1; D6: `2026-10-01`; D7: null; D8: `<ID-A>`.

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
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja con septiembre elegido. |
| 14 | Hacer click en "Descargar CSV". | No se descarga archivo; la hoja queda abierta. Además, dice exactamente "No tenés movimientos con fecha en septiembre 2026." |


**Post-condición:** Sin descarga; la transacción fuera del rango sigue activa.

### CP-EXP-006 — El 1 de enero se incluye en el año

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

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-006-001@example.com`. S2: EXP-PREP-01 con D1–D7.

**Datos de prueba:** D1: gasto; D2: `100.00`; D3: ARS; D4: Otros/Efectivo; D5: 1; D6: `2025-01-01`; D7: null; D8: `<ID-A>`.

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
| 11 | Escribir `<APP>/transactions?period=2025-09`. | La barra muestra exactamente `<APP>/transactions?period=2025-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2025-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Todo 2025". | El alcance anual queda elegido. |
| 15 | Hacer click en "Descargar CSV". | Se descarga el archivo anual. |
| 16 | Abrir el archivo como texto. | Hay exactamente una fila con fecha `2025-01-01` e id `<ID-A>`. |

**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-007 — El día posterior al año se excluye

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

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-007-001@example.com`. S2: EXP-PREP-01 con D1–D7.

**Datos de prueba:** D1: gasto; D2: `100.00`; D3: ARS; D4: Otros/Efectivo; D5: 1; D6: `2026-01-01`; D7: null; D8: `<ID-A>`.

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
| 11 | Escribir `<APP>/transactions?period=2025-09`. | La barra muestra exactamente `<APP>/transactions?period=2025-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2025-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Todo 2025". | El alcance anual queda elegido. |
| 15 | Hacer click en "Descargar CSV". | No se descarga archivo; la hoja queda abierta. Además, dice exactamente "No tenés movimientos con fecha en 2025." |


**Post-condición:** Sin descarga; la transacción fuera del rango sigue activa.

### CP-EXP-008 — Una transacción eliminada queda fuera

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

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-008-001@example.com`. S2: crear `<ID-A>` con EXP-PREP-01 y eliminar con EXP-PREP-02.

**Datos de prueba:** D1: gasto `200.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, null; D2: `<ID-A>` con `deleted_at` no nulo.

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
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | No se descarga archivo. Además, dice "No tenés movimientos con fecha en septiembre 2026." |
| 15 | Leer el mensaje de período vacío. | El mensaje coincide exactamente con el texto esperado del paso 14. |


**Post-condición:** La transacción sigue eliminada.

### CP-EXP-009 — El archivo comienza con BOM UTF-8

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

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-009-001@example.com`. S2: crear la transacción de D9 con EXP-PREP-01.

**Datos de prueba:** D1: bytes `EF BB BF`. D9: gasto `100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null, ID `<ID-A>`, creado con EXP-PREP-01.

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
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el archivo. |
| 15 | Abrir el archivo en un visor hexadecimal. | Los primeros tres bytes son exactamente D1. |

**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-010 — El encabezado tiene doce columnas exactas

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

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-010-001@example.com`. S2: crear la transacción de D9 con EXP-PREP-01.

**Datos de prueba:** D1: `fecha,tipo,monto,moneda,tipo_de_cambio,monto_ars,categoria,cuenta,cuotas,primer_periodo,descripcion,id`. D9: gasto `100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null, ID `<ID-A>`, creado con EXP-PREP-01.

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
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el archivo. Además, coincide exactamente con D1. |


**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-011 — Doce cuotas salen en una sola fila por el total

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

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-011-001@example.com`. S2: PR-07 con D1–D3; capturar `<ID-A>` con PR-08.

**Datos de prueba:** D1: `120000`; D2: 12 cuotas; D3: `15/08/2026`; D4: `fecha=2026-08-15`, `monto=120000.00`, `cuotas=12`, `primer_periodo=2026-08`, `id=<ID-A>`.

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
| 11 | Escribir `<APP>/transactions?period=2026-08`. | La barra muestra exactamente `<APP>/transactions?period=2026-08`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-08`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el archivo. |
| 15 | Abrir el CSV. | Hay exactamente una fila de datos y los cinco campos de D4 coinciden. |

**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-012 — ARS se escribe con dos decimales exactos

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

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-012-001@example.com`. S2: EXP-PREP-01 con D1–D7.

**Datos de prueba:** D1: gasto; D2: `1500.00`; D3: ARS; D4: Otros/Efectivo; D5: 1; D6: `2026-09-15`; D7: null; D8: `<ID-A>`; D9: `gasto,1500.00,ARS,,1500.00`.

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
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el CSV. Además, contiene D9; no contiene `1.500,00`, signo ni `1500` sin decimales. |


**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-013 — USD conserva cuatro decimales de TC

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

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-013-001@example.com`. S2: EXP-PREP-01 con D1–D7.

**Datos de prueba:** D1: gasto; D2: `300.00`; D3: USD; D4: TC `1250.5000`; D5: Otros/Efectivo; D6: `2026-09-15`; D7: null; D8: `<ID-A>`; D9: `300.00,USD,1250.5000,375150.00`.

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
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el CSV. Además, contiene D9 exactamente. |


**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-014 — Una coma obliga a entrecomillar la descripción

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

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-014-001@example.com`. S2: EXP-PREP-01.

**Datos de prueba:** D1: descripción `Heladera, 3 cuotas`; D2: campo `"Heladera, 3 cuotas"`; D3: `<ID-A>`. D4: gasto `100.00` ARS, categoría Otros, cuenta Efectivo, 1 cuota, fecha `2026-09-15`, preparado con EXP-PREP-01.

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
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el CSV. Además, coincide byte a byte con D2. |


**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-015 — Las comillas internas se duplican

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

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-015-001@example.com`. S2: EXP-PREP-01.

**Datos de prueba:** D1: descripción `Pizza "a la piedra"`; D2: campo `"Pizza ""a la piedra"""`; D3: `<ID-A>`. D4: gasto `100.00` ARS, categoría Otros, cuenta Efectivo, 1 cuota, fecha `2026-09-15`, preparado con EXP-PREP-01.

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
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el CSV. Además, coincide byte a byte con D2. |


**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-016 — Descripción con igual se neutraliza

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

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-016-001@example.com`. S2: EXP-PREP-01.

**Datos de prueba:** D1: descripción `=1+1`; D2: salida `'=1+1`; D3: `<ID-A>`. D4: gasto `100.00` ARS, categoría Otros, cuenta Efectivo, 1 cuota, fecha `2026-09-15`, preparado con EXP-PREP-01.

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
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | Se descarga el CSV. |
| 15 | Abrir el archivo descargado en un visor hexadecimal y localizar el dato indicado en D. | Coincide exactamente con D2: se agregó un solo apóstrofo, se conservó el resto y luego se aplicaron comillas si correspondía. |

**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-017 — Una categoría que empieza con igual se neutraliza

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

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-017-001@example.com`. S2: crear categoría con EXP-PREP-03. S3: crear transacción con EXP-PREP-01.

**Datos de prueba:** D1: categoría `=Categoria QA`; D2: salida `'=Categoria QA`; D3: `<ID-A>`. D4: gasto `100.00` ARS, cuenta Efectivo, 1 cuota, `2026-09-15`, descripción null.

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
| 14 | Hacer click en "Descargar CSV". | Se descarga el CSV. Además, coincide exactamente con D2. |


**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-018 — 1.500 transacciones se exportan sin faltantes

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

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-018-001@example.com`. S2: EXP-PREP-07 con N=1500.

**Datos de prueba:** D1: N=1500; D2: conjunto `$expIds`; D3: `Exportamos 1.500 movimientos`.

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
| 11 | Escribir `<APP>/transactions?period=2025-09`. | La barra muestra exactamente `<APP>/transactions?period=2025-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2025-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Todo 2025". | El alcance anual queda elegido. |
| 15 | Hacer click en "Descargar CSV". | Se descarga el CSV. Además, coincide exactamente con D3. Además, hay exactamente N además del encabezado. |
| 16 | Abrir la carpeta Descargas. | Se ve el CSV anual descargado. |
| 17 | Abrir el CSV en un visor de texto. | El encabezado y las N filas están disponibles para contar. |


| 18 | Abrir el CSV descargado y compararlo en una herramienta de comparación binaria con la lista `$expIds` de D3. | Hay N UUID distintos y el conjunto coincide: ninguno falta ni se repite. |

**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-019 — El CSV de A no contiene movimientos de B

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-16 · C7 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | CP-EXP-020 |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-05 con A `qa+cp-exp-019-001@example.com` y B `qa+cp-exp-019-002@example.com`. S2: EXP-PREP-01 una vez con cada token.

**Datos de prueba:** D1: A `111.00`, `SOLO-A`, `<ID-A>`; D2: B `999.00`, `SOLO-B`, `<ID-B>`; D3: fecha `2026-09-15`; D4: sesión A. D5: ambos son gastos ARS, Otros/Efectivo, 1 cuota.

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
| 14 | Hacer click en "Descargar CSV". | Se descarga un CSV con una fila. Además, contiene `111.00`, `SOLO-A`, `<ID-A>`; no contiene `999.00`, `SOLO-B` ni `<ID-B>`. |


**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-020 — La API con token de A devuelve cero filas de B

| Campo | Contenido |
|---|---|
| Historia · criterio | US-47 · CA-16 · C7 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | API |
| Caso par | CP-EXP-019 |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** S1: PR-05 con A `qa+cp-exp-020-001@example.com` y B `qa+cp-exp-020-002@example.com`. S2: crear la transacción de B con EXP-PREP-01 y `<TOKEN-B>`; A no tiene transacciones. S3: token A.

**Datos de prueba:** D1: fecha B `2026-09-15`; D2: `<ID-B>`; D3: body ninguno.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar `GET <SUPABASE_URL>/rest/v1/transactions?select=id,amount&occurred_on=gte.2026-09-01&occurred_on=lt.2026-10-01&deleted_at=is.null` con `apikey: <ANON_KEY>` y `Authorization: Bearer <TOKEN-A>`, sin body. | HTTP 200 y cuerpo exacto `[]`; no aparecen `<ID-B>` ni `999`. |

**Post-condición:** Base sin cambios.

### CP-EXP-021 — Categoría archivada sale con el nombre actual

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

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-021-001@example.com`. S2: EXP-PREP-03 crea categoría. S3: EXP-PREP-01 crea gasto. S4: EXP-PREP-03 renombra y archiva.

**Datos de prueba:** D1: nombre inicial `Viajes`; D2: nombre actual `Viajes 2026`; D3: gasto `100.00`, `2026-09-15`; D4: `<ID-A>`. D5: gasto ARS, cuenta Efectivo, una cuota, descripción null.

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
| 14 | Hacer click en "Descargar CSV". | Se descarga el CSV. Además, es `Viajes 2026`, no `Viajes` ni vacío. |


**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-022 — Un ingreso exporta categoría vacía

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

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-022-001@example.com`. S2: EXP-PREP-01.

**Datos de prueba:** D1: ingreso; D2: `850000.00`; D3: ARS; D4: categoría null; D5: Caja de ahorro; D6: `2026-09-01`; D7: `<ID-A>`.

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
| 14 | Hacer click en "Descargar CSV". | Se descarga el CSV. Además, `tipo` es `ingreso` y `categoria` es el campo vacío entre dos comas. |


**Post-condición:** Datos intactos; conservar el usuario como evidencia.

### CP-EXP-023 — Un doble click inicia una sola descarga

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

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-023-001@example.com`. S2: crear la transacción de D9 con EXP-PREP-01. S3: Descargas sin archivos del período.

**Datos de prueba:** D1: doble click rápido; D2: una descarga esperada. D9: gasto `100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null, ID `<ID-A>`, creado con EXP-PREP-01.

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
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer doble click rápido en "Descargar CSV". | El control pasa a "Exportando…" y queda deshabilitado. |
| 15 | Esperar a que termine. | Aparece un solo archivo y un solo aviso "Exportamos 1 movimiento"; no aparece archivo con sufijo. |

**Post-condición:** Exactamente una descarga.

### CP-EXP-024 — Un mes sin transacciones muestra Vacío

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

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-024-001@example.com`; no crear transacciones.

**Datos de prueba:** D1: septiembre 2026.

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
| 12 | Presionar Enter. | Se abre Movimientos del período `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | No se descarga archivo. Además, dice "No tenés movimientos con fecha en septiembre 2026." |
| 15 | Leer el mensaje de período vacío. | El mensaje coincide exactamente con el texto esperado del paso 14. |

| 16 | Hacer click en "Todo 2026". | La opción anual queda elegida y desaparece el mensaje mensual. |

**Post-condición:** Sin descarga.

### CP-EXP-025 — Offline muestra el error exacto

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

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-025-001@example.com`. S2: crear la transacción de D9 con EXP-PREP-01.

**Datos de prueba:** D1: DevTools Network > Offline. D9: gasto `100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null, ID `<ID-A>`, creado con EXP-PREP-01.

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
| 14 | Activar Offline en DevTools. | Las solicitudes nuevas quedan sin conexión. |
| 15 | Hacer click en "Descargar CSV". | No se descarga archivo. Además, tiene `role="alert"` y dice "No pudimos exportar tus movimientos. Probá de nuevo." Además, alcances, "Descargar CSV" y "Cancelar" están habilitados. |


**Post-condición:** Desactivar Offline; sin descarga.

### CP-EXP-026 — El reintento después de Offline descarga completo

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

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-026-001@example.com`. S2: crear dos transacciones con EXP-PREP-01.

**Datos de prueba:** D1: Offline inicial; D2: dos IDs exactos. D9: `<ID-A>` gasto `100.00` y `<ID-B>` gasto `200.00`; ambos ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null, creados con EXP-PREP-01.

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
| 14 | Activar Offline. | Las solicitudes quedan sin conexión. |
| 15 | Hacer click en "Descargar CSV". | Se muestra el error y no se descarga. |
| 16 | Desactivar Offline. | La conexión queda restablecida. |
| 17 | Hacer click en "Descargar CSV". | El error desaparece, se descarga el archivo y aparece "Exportamos 2 movimientos". Además, contiene exactamente `<ID-A>` y `<ID-B>`, una vez cada uno. |


**Post-condición:** Una descarga completa.

### CP-EXP-027 — Tocar fuera cierra sin descargar

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

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-027-001@example.com`. S2: crear la transacción de D9 con EXP-PREP-01.

**Datos de prueba:** D1: URL `?period=2026-09`. D9: transacción base: gasto `100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null, ID `<ID-A>`.

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
| 14 | Hacer click en el fondo fuera de la hoja. | La hoja se cierra, no se descarga archivo y la URL conserva D1. |

**Post-condición:** Sin descarga.

### CP-EXP-028 — Atrás cierra la hoja inicial

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

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-028-001@example.com`. S2: una transacción creada con EXP-PREP-01; el historial se construye en los pasos.

**Datos de prueba:** D1: historial agosto → septiembre. D9: gasto `100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null, ID `<ID-A>`, creado con EXP-PREP-01.

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
| 13 | Hacer click en la barra de direcciones. | La URL queda seleccionada. |
| 14 | Escribir `<APP>/transactions?period=2026-08`. | La barra muestra agosto. |
| 15 | Presionar Enter. | Se abre agosto 2026. |
| 16 | Hacer click en la barra de direcciones. | La URL queda seleccionada. |
| 17 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra septiembre. |
| 18 | Presionar Enter. | Se abre septiembre y Atrás tiene destino agosto. |
| 19 | Hacer click en "Exportar". | Se abre la hoja fijada a septiembre. |
| 20 | Hacer click en Atrás del navegador. | La hoja se cierra, la URL pasa a `?period=2026-08` y no se descarga archivo. |

**Post-condición:** Sin descarga.

### CP-EXP-029 — Atrás durante Exportando cancela la descarga

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

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-029-001@example.com`. S2: crear la transacción de D9 con EXP-PREP-01. S3: el historial se construye en los pasos. S4: throttling `1 kbit/s`, latencia `2000 ms`.

**Datos de prueba:** D1: exportación de septiembre en curso. D9: gasto `100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, descripción null, ID `<ID-A>`, creado con EXP-PREP-01.

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

### CP-EXP-030 — Una alta concurrente impide descargar un año incompleto

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

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-030-001@example.com`. S2: EXP-PREP-07 con N=1500. S3: en una segunda ventana de otro navegador, iniciar sesión con el mismo usuario y ejecutar PR-06 con monto `2` y cuenta "Efectivo"; dejarla en el paso 3/3. S4: aplicar DevTools Network `1 kbit/s`, latencia `2000 ms`, solo a la primera ventana.

**Datos de prueba:** D1: conteo inicial 1500; D2: alta concurrente `2.00` ARS, Otros/Efectivo, 1 cuota, fecha `31/12/2025`, descripción vacía; D3: el archivo no debe descargarse.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar". |
| 5 | Hacer click en "Email". | El cursor queda en el campo. |
| 6 | Escribir `qa+cp-exp-030-001@example.com`. | El campo muestra `qa+cp-exp-030-001@example.com`. |
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

### CP-EXP-031 — HTTP 500 muestra Error y no descarga

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

**Pre-requisitos:** S1: PR-01 con `qa+cp-exp-031-001@example.com`. S2: crear `<ID-A>` con EXP-PREP-01. S3: ejecutar EXP-PREP-08.

**Datos de prueba:** D1: gasto `100.00` ARS, Otros/Efectivo, 1 cuota, `2026-09-15`, null; D2: HTTP 500 simulado.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se abre "Entrar". |
| 5 | Hacer click en "Email". | El cursor queda en el campo. |
| 6 | Escribir `qa+cp-exp-031-001@example.com`. | El campo muestra `qa+cp-exp-031-001@example.com`. |
| 7 | Hacer click en "Contraseña". | El cursor queda en el campo. |
| 8 | Escribir `Clave123!`. | El campo queda enmascarado. |
| 9 | Hacer click en "Entrar". | Se abre Registrar. |
| 10 | Hacer click en la barra de direcciones. | La URL queda seleccionada. |
| 11 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra esa URL. |
| 12 | Presionar Enter. | Se abre Movimientos de `2026-09`. |
| 13 | Hacer click en "Exportar". | Se abre la hoja. |
| 14 | Hacer click en "Descargar CSV". | No se descarga archivo y aparece "No pudimos exportar tus movimientos. Probá de nuevo." con `role="alert"`. |

**Post-condición:** Restaurar `fetch` según EXP-PREP-08; sin descarga.

## 4. Historias o CA sin caso (huecos)

- No hay criterios de US-47 sin un caso asociado.
- **CA-14 — desempate por `id`:** El caso que cubría fecha y `created_at` se quitó del catálogo en el recorte. El último desempate queda fuera de la ejecución manual porque la API pública no permite fijar ambos campos. Requiere automatización de dominio o fixture administrativo futuro.
- Los errores por cambio concurrente, HTTP 500 y decimal textual inválido se cubren mediante CP-EXP-030 y CP-EXP-031 (el caso del decimal textual inválido se quitó en el recorte).

## 5. Ambigüedades para el PO

1. `?period` inválido se menciona en la narrativa de US-47, pero no tiene un CA/I/R que defina el fallback; no se inventó un oráculo y queda pendiente del PO.
2. No quedan otras decisiones bloqueantes. La excepción de C6 para comportamientos exclusivos del cliente y el hueco manual de CA-14 fueron aprobados para EXP.
3. No se fija una duración mínima de Exportando; CP-EXP-029 usa throttling solo para hacerlo observable.
4. Una categoría archivada y una activa pueden compartir nombre; el archivo no las distingue fuera del `id`, como acepta la historia.
5. CP-EXP-031 no tiene caso par API porque el producto no expone una RPC de exportación a la que el probador pueda provocar HTTP 500, inyectar `amount_text` inválido o conservar un error al cambiar el alcance. EXP-PREP-08/09 interceptan la respuesta HTTP en el cliente para verificar exclusivamente el comportamiento de la hoja; se documenta como excepción C6 aprobada.

## 6. Resumen cuantitativo

| Dimensión | Cantidad |
|---|---:|
| Casos totales | 31 |
| Positivos | 16 |
| Negativos | 7 |
| Límites | 8 |
| Canal UI | 30 |
| Canal API | 1 |
| Prioridad Alta | 25 |
| Prioridad Media | 5 |
| Prioridad Baja | 1 |
| Automatizable Sí | 31 |
