# Casos de prueba V2 · IMP — Importar Excel

> **Recorte y renumeración del 2026-10-27.** Los IDs son consecutivos desde 001; la tabla de equivalencia con los IDs anteriores está en [`equivalencia-ids.md`](../equivalencia-ids.md). El catálogo de Importar Excel pasó de 144 a 41 casos: se quitaron los casos de cuotas pendientes (US-80) y de la guía «¿Cómo armo el archivo?» (US-81), que no están implementados, y las reglas de fila y las variantes de lectura que repetían otro caso. Los criterios que quedaron sin caso figuran como «sin caso» en la matriz de cobertura.

Fuente: US-74, US-76, US-77, US-78, US-80, US-81; C1, C2, C3, C4, C6, C7, C11, C14; I1, I1', I2, I3, I4, I5, I6, I8; ADR-005/013/021/023/035/039. Todos los nombres, emails, notas y movimientos son ficticios (C14).

## Convenciones de ejecución

1. Cada caso usa un usuario nuevo creado con PR-01 y el email exacto `qa+<id-en-minúsculas>-001@example.com`. Al terminar PR-01, cerrar la sesión; los pasos del caso vuelven a entrar desde una ventana nueva.
2. Salvo indicación contraria, cada libro tiene como primera hoja `Movimientos`, una segunda hoja vacía `Instrucciones` y ninguna otra hoja. Las celdas marcadas `vacía` no contienen fórmulas, espacios ni formato con valor.
3. `H` queda fijado para estos casos en octubre de 2026 y el día de referencia de Argentina en `12/10/2026`. H−1 es septiembre de 2026; H−2, agosto; H−3, julio; H−4, junio. Los casos que dependen de ese reloj requieren un entorno cuyo reloj de dominio esté fijado a esa fecha; la imposibilidad de fijarlo manualmente en el deploy se registra como ambigüedad.
4. Encabezado completo (`E10`), en A1:J1: `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`.
5. Fila válida base (`V`), en A2:J2: fecha Excel `01/09/2026` | `Gasto` | número `1000` | `ARS` | vacía | `Otros` | `Efectivo` | número `1` | vacía | `Compra ficticia`.
6. Para construir un archivo, crear un libro nuevo, escribir literalmente el encabezado y cada fila declarada, guardar como el nombre indicado y cerrar Excel antes de elegirlo en Biyu. Las fórmulas se fuerzan a recalcular y se guarda el resultado antes de cerrar.

### IMP-DATA-01 · Archivo de ejemplo, fila por fila

Nombre `importar-excel-ejemplo.xlsx`. Primera hoja `Movimientos`. La columna `Cuotas pendientes` no existe en este libro heredado; por US-80 se interpreta vacía. Fechas como celdas de fecha Excel, salvo donde se indica texto; `—` significa celda vacía.

| Fila | Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Nota |
|---:|---|---|---:|---|---:|---|---|---:|---|
| 1 | Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Nota |
| 2 | 01/09/2026 | Gasto | 45800 | ARS | — | Comida y supermercado | Tarjeta de débito | 1 | Compra del mes |
| 3 | 03/09/2026 | Gasto | 240000 | ARS | — | Indumentaria | Tarjeta de crédito | 6 | Campera |
| 4 | 05/09/2026 | Gasto | 12,5 | USD | 1450 | Entretenimiento | Tarjeta de crédito | — | Juego online |
| 5 | 08/09/2026 | Ingreso | 850000 | ARS | — | — | Cuenta bancaria | — | Sueldo |
| 6 | 10/09/2026 | Gasto | 3200 | ARS | — | Transporte | Billetera virtual | — | Carga SUBE |
| 7 | 12/09/2026 | Gasto | 0 | ARS | — | Salud | Efectivo | — | Farmacia |
| 8 | 15/09/2026 | Gasto | 30 | USD | — | Otros | Efectivo | — | Regalo |
| 9 | 18/09/2026 | Gasto | 15000 | ARS | — | Mascotas | Efectivo | — | Veterinaria |
| 10 | 20/09/2026 | Gasto | 60000 | ARS | — | Educación | Efectivo | 3 | Curso |
| 11 | texto `22/09/2026` | Gasto | texto `9.990,50` | ARS | — | Servicios | Cuenta bancaria | — | Internet |
| 12 | — | — | — | — | — | — | — | — | — |
| 13 | 25/09/2026 | Gasto | 7800 | ARS | — | Comida y supermercado | Efectivo | — | Verdulería |

La segunda hoja `Instrucciones` puede conservar el contenido heredado del mock; solo la primera hoja participa en estos casos. Si se reconstruye el libro, respetar los tipos de celda indicados.

## Procedimientos de preparación propios de IMP

### IMP-PREP-03 · Llamar `import_transactions`

Requiere PR-04 pasos 1–2. Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/import_transactions` con headers `apikey: <ANON_KEY>`, `Authorization: Bearer <TOKEN>` y `Content-Type: application/json`. El body siempre es `{"p_import_id":"<UUID FIJO DEL CASO>","p_rows":[<FILAS>]}`; cada caso API detalla literalmente las filas. Un lote procesado responde HTTP 200 con `import_id`, `already_imported`, `sent_rows`, `imported_rows` y `rows`. Un rechazo de la RPC completa responde HTTP 4xx con `code` y `message`.

### IMP-PREP-04 · Oráculo de persistencia

Usar PR-08 y, cuando corresponda, estas lecturas adicionales con headers de PR-04:

- `GET /rest/v1/transactions?select=id,type,amount_text:amount::text,amount_ars_text:amount_ars::text,currency,fx_rate_text:fx_rate::text,installments_count,installments_paid,occurred_on,first_period,description&order=occurred_on,id`.
- `GET /rest/v1/ledger_entries?select=transaction_id,installment_number,period,amount_text:amount::text,amount_ars_text:amount_ars::text&order=period,installment_number`.
- `GET /rest/v1/imports?select=id,sent_rows,imported_rows,result&id=eq.<UUID>`.

Resultado esperado: HTTP 200; las filas y valores exactos son los declarados en el caso. Una lista vacía es `[]`.

### IMP-PREP-05 · Ajustar un XLSX a un tamaño exacto

Requiere una copia cerrada de un `.xlsx` válido cuyo tamaño sea menor al objetivo. En PowerShell, completar ruta y tamaño; los bytes nulos se agregan después del ZIP y no cambian sus celdas:

```powershell
$impPath = (Resolve-Path '<ARCHIVO.xlsx>').Path
$impTarget = <1048576|1048577>
$impBytes = [IO.File]::ReadAllBytes($impPath)
if ($impBytes.Length -ge $impTarget) { throw "El archivo base debe pesar menos de $impTarget bytes" }
$impExact = [byte[]]::new($impTarget)
[Array]::Copy($impBytes, $impExact, $impBytes.Length)
[IO.File]::WriteAllBytes($impPath, $impExact)
(Get-Item -LiteralPath $impPath).Length
```

Resultado esperado: imprime exactamente `1048576` o `1048577`, según el caso. Volver a abrir el libro confirma que las hojas y celdas declaradas no cambiaron.

### IMP-PREP-06 · Fijar el identificador de la importación en el navegador

Usar solo en CP-IMP-038, después de entrar a `/import` y antes de elegir el archivo. Abrir DevTools, seleccionar `Console`, escribir literalmente el siguiente código en una sola línea y presionar Enter:

```javascript
window.__impOriginalRandomUUID=window.crypto.randomUUID.bind(window.crypto);Object.defineProperty(window.crypto,'randomUUID',{configurable:true,value:()=>"83838383-0000-4000-8000-000000000083"});window.crypto.randomUUID()
```

Resultado esperado: la consola devuelve exactamente `83838383-0000-4000-8000-000000000083`. Para limpiar el fixture al terminar, ejecutar `Object.defineProperty(window.crypto,'randomUUID',{configurable:true,value:window.__impOriginalRandomUUID});delete window.__impOriginalRandomUUID` y cerrar DevTools.

## Matriz de cobertura CA → casos

| Historia | Criterio | Casos |
|---|---|---|
| US-74 | CA-1 | CP-IMP-001 |
| US-74 | CA-2 | — (sin caso tras el recorte del 2026-10-27) |
| US-74 | CA-3 | CP-IMP-002 a CP-IMP-005, CP-IMP-006 |
| US-74 | CA-4 | CP-IMP-007 |
| US-74 | CA-5 | — (sin caso tras el recorte del 2026-10-27) |
| US-74 | CA-6 | CP-IMP-008 |
| US-74 | CA-7 | — (sin caso tras el recorte del 2026-10-27) |
| US-74 | CA-8 | CP-IMP-001, CP-IMP-002 a CP-IMP-005, CP-IMP-006, CP-IMP-007, CP-IMP-008 |
| US-76 | CA-1 | — (sin caso tras el recorte del 2026-10-27) |
| US-76 | CA-2 | CP-IMP-009 a CP-IMP-011, CP-IMP-012, CP-IMP-013 a CP-IMP-015, CP-IMP-016 a CP-IMP-018, CP-IMP-019, CP-IMP-020 a CP-IMP-022 |
| US-76 | CA-3 | CP-IMP-023 |
| US-76 | CA-4 | — (sin caso tras el recorte del 2026-10-27) |
| US-76 | CA-5 | CP-IMP-024, CP-IMP-025 |
| US-76 | CA-6 | — (sin caso tras el recorte del 2026-10-27) |
| US-76 | CA-7 | CP-IMP-026 |
| US-76 | CA-8 | CP-IMP-027 |
| US-76 | CA-9 | CP-IMP-028 |
| US-76 | CA-10 | — (sin caso tras el recorte del 2026-10-27) |
| US-76 | CA-11 | CP-IMP-029 |
| US-76 | CA-12 | CP-IMP-009 a CP-IMP-011, CP-IMP-012, CP-IMP-013 a CP-IMP-015, CP-IMP-016 a CP-IMP-018, CP-IMP-019, CP-IMP-020 a CP-IMP-022, CP-IMP-023, CP-IMP-024, CP-IMP-025, CP-IMP-026, CP-IMP-027, CP-IMP-028, CP-IMP-029 |
| US-77 | CA-1 | CP-IMP-030 |
| US-77 | CA-2 | CP-IMP-031 |
| US-77 | CA-3 | — (sin caso tras el recorte del 2026-10-27) |
| US-77 | CA-4 | CP-IMP-032 |
| US-77 | CA-5 | — (sin caso tras el recorte del 2026-10-27) |
| US-77 | CA-6 | CP-IMP-033 |
| US-77 | CA-7 | CP-IMP-034 |
| US-77 | CA-8 | CP-IMP-035 |
| US-77 | CA-9 | CP-IMP-036, CP-IMP-037 |
| US-77 | CA-10 | CP-IMP-030, CP-IMP-031, CP-IMP-032, CP-IMP-033 |
| US-78 | CA-1 | — (sin caso tras el recorte del 2026-10-27) |
| US-78 | CA-2 | CP-IMP-038, CP-IMP-039 |
| US-78 | CA-3 | CP-IMP-040, CP-IMP-041 |
| US-78 | CA-4 | — (sin caso tras el recorte del 2026-10-27) |
| US-78 | CA-5 | CP-IMP-038, CP-IMP-039 a CP-IMP-041 |
| US-80 | CA-1 | — (sin caso tras el recorte del 2026-10-27) |
| US-80 | CA-2 | — (sin caso tras el recorte del 2026-10-27) |
| US-80 | CA-3 | — (sin caso tras el recorte del 2026-10-27) |
| US-80 | CA-4 | — (sin caso tras el recorte del 2026-10-27) |
| US-80 | CA-5 | — (sin caso tras el recorte del 2026-10-27) |
| US-80 | CA-6 | — (sin caso tras el recorte del 2026-10-27) |
| US-80 | CA-7 | — (sin caso tras el recorte del 2026-10-27) |
| US-80 | CA-8 | — (sin caso tras el recorte del 2026-10-27) |
| US-80 | CA-9 | — (sin caso tras el recorte del 2026-10-27) |
| US-80 | CA-10 | — (sin caso tras el recorte del 2026-10-27) |
| US-80 | CA-11 | — (sin caso tras el recorte del 2026-10-27) |
| US-80 | CA-12 | — (sin caso tras el recorte del 2026-10-27) |
| US-80 | CA-13 | — (sin caso tras el recorte del 2026-10-27) |
| US-80 | CA-14 | — (sin caso tras el recorte del 2026-10-27) |
| US-80 | CA-15 | — (sin caso tras el recorte del 2026-10-27) |
| US-80 | CA-16 | — (sin caso tras el recorte del 2026-10-27) |
| US-80 | CA-17 | — (sin caso tras el recorte del 2026-10-27) |
| US-81 | CA-1 | — (sin caso tras el recorte del 2026-10-27) |
| US-81 | CA-2 | — (sin caso tras el recorte del 2026-10-27) |
| US-81 | CA-3 | — (sin caso tras el recorte del 2026-10-27) |
| US-81 | CA-4 | — (sin caso tras el recorte del 2026-10-27) |
| US-81 | CA-5 | — (sin caso tras el recorte del 2026-10-27) |
| US-81 | CA-6 | — (sin caso tras el recorte del 2026-10-27) |
| US-81 | CA-7 | — (sin caso tras el recorte del 2026-10-27) |
| US-81 | CA-8 | — (sin caso tras el recorte del 2026-10-27) |
| US-81 | CA-9 | — (sin caso tras el recorte del 2026-10-27) |
| US-81 | CA-10 | — (sin caso tras el recorte del 2026-10-27) |

## Casos

### CP-IMP-001 — El acceso desde Registrar abre el paso Archivo

| Campo | Contenido |
|---|---|
| Historia · criterio | US-74 · CA-1 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-001-001@example.com`; sesión cerrada.

**Datos de prueba:** No se carga archivo.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-imp-001-001@example.com` en `Email`. | El campo muestra `qa+cp-imp-001-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en `Importar desde Excel`. | La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. |
| 9 | Inspeccionar esos elementos con DevTools Elements. | Existen `register-import` en el botón usado, `import-back`, `import-steps` con `data-step="1"`, `import-template-download`, `import-file-pick`, `import-file-input` e `import-file-dropzone`. |

**Post-condición:** La pantalla queda en `/import`, sin archivo elegido.

### CP-IMP-002 — A1 rechaza la extensión .xls

| Campo | Contenido |
|---|---|
| Historia · criterio | US-74 · CA-3 · A1 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-002-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-002.xls`: Libro Excel 97-2003; primera hoja con fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota` y fila 2 = V.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-imp-002-001@example.com` en `Email`. | El campo muestra `qa+cp-imp-002-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en `Importar desde Excel`. | La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. |
| 9 | Arrastrar `cp-imp-002.xls` desde el Explorador de archivos hasta la zona `o arrastralo acá`. | La zona queda resaltada para recibir el archivo. |
| 10 | Soltar `cp-imp-002.xls` en la zona. | Se mantiene `1 Archivo`; aparece exactamente `Solo se aceptan archivos .xlsx (Excel).`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-003 — A2 rechaza 1.048.577 bytes

| Campo | Contenido |
|---|---|
| Historia · criterio | US-74 · CA-3 · A2 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-003-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-003.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = V; ejecutar IMP-PREP-05 con objetivo `1048577`. Tamaño final exacto `1.048.577` bytes.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-imp-003-001@example.com` en `Email`. | El campo muestra `qa+cp-imp-003-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en `Importar desde Excel`. | La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector de archivos. |
| 10 | Elegir `cp-imp-003.xlsx`. | Se mantiene `1 Archivo`; aparece exactamente `El archivo pesa más de 1 MB. Dividilo en varios archivos.`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-004 — A3 rechaza un archivo dañado con extensión xlsx

| Campo | Contenido |
|---|---|
| Historia · criterio | US-74 · CA-3 · A3 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-004-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-004.xlsx`: Archivo de texto plano cuyo contenido exacto es `archivo ficticio no xlsx`, renombrado a `.xlsx`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-imp-004-001@example.com` en `Email`. | El campo muestra `qa+cp-imp-004-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en `Importar desde Excel`. | La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector de archivos. |
| 10 | Elegir `cp-imp-004.xlsx`. | Se mantiene `1 Archivo`; aparece exactamente `No pudimos leer el archivo. Abrilo en Excel, guardalo como .xlsx y probá de nuevo.`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-005 — A4 enumera tres encabezados obligatorios faltantes

| Campo | Contenido |
|---|---|
| Historia · criterio | US-74 · CA-3 · A4 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-005-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-005.xlsx`: Fila 1: `Tipo | Moneda | Categoría | Cuotas | Cuotas pendientes | Nota`; fila 2: `Gasto | ARS | Otros | 1 | vacía | Ficticio`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-imp-005-001@example.com` en `Email`. | El campo muestra `qa+cp-imp-005-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en `Importar desde Excel`. | La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector de archivos. |
| 10 | Elegir `cp-imp-005.xlsx`. | Se mantiene `1 Archivo`; aparece exactamente `Faltan columnas: Fecha, Monto, Cuenta. La primera fila tiene que tener los encabezados de la plantilla.`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-006 — A7 rechaza 501 filas con datos

| Campo | Contenido |
|---|---|
| Historia · criterio | US-74 · CA-3 · A7 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-006-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-006.xlsx`: Fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`. Filas 2–502: fecha Excel `01/09/2026`, `Gasto`, monto numérico igual al número de fila, `ARS`, TC vacía, `Otros`, `Efectivo`, `1`, pendientes vacía, nota `Fila <n>`; son exactamente 501 filas con datos.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-imp-006-001@example.com` en `Email`. | El campo muestra `qa+cp-imp-006-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en `Importar desde Excel`. | La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector de archivos. |
| 10 | Elegir `cp-imp-006.xlsx`. | Se mantiene `1 Archivo`; aparece exactamente `El archivo tiene 501 filas con datos y el máximo es 500. Dividilo en varios archivos.`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-007 — El límite de filas acepta exactamente 500

| Campo | Contenido |
|---|---|
| Historia · criterio | US-74 · CA-4 · A7 |
| Invariante | — |
| Técnica | Análisis de valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-007-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-007.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`. Filas 2–501: fecha Excel `01/09/2026`, `Gasto`, monto `1`, `ARS`, TC vacía, `Otros`, `Efectivo`, `1`, pendientes vacía, nota exacta `Fila <n>`; 500 filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-imp-007-001@example.com` en `Email`. | El campo muestra `qa+cp-imp-007-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en `Importar desde Excel`. | La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector de archivos. |
| 10 | Elegir `cp-imp-007.xlsx`. | Se abre `2 Revisión`; muestra `500 filas leídas · 500 listas para importar · 0 con error`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-008 — Los encabezados aceptan orden, mayúsculas, espacios y tildes distintos

| Campo | Contenido |
|---|---|
| Historia · criterio | US-74 · CA-6 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-008-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-008.xlsx`. Fila 1 A:J: ` CUOTAS PENDIENTES  | monto | FECHA | cuenta | TIPO | moneda | CATEGORIA | NOTA | CUOTAS | TIPO DE CAMBIO`. Fila 2 en ese orden: vacía | `1000` | fecha Excel `01/09/2026` | `Efectivo` | ` gasto ` | `ars` | `Otros` | `Compra ficticia` | `1` | vacía.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-imp-008-001@example.com` en `Email`. | El campo muestra `qa+cp-imp-008-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en `Importar desde Excel`. | La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector de archivos. |
| 10 | Elegir `cp-imp-008.xlsx`. | Se abre `2 Revisión`; muestra `1 fila leída · 1 lista para importar · 0 con error` y la tarjeta `Fila 2` está `Lista`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-009 — F1: fecha vacía

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F1 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (valor ausente sin oráculo API específico) |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-009-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-009.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = vacía | Gasto | 1000 | ARS | vacía | Otros | Efectivo | 1 | vacía | F1. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-009-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-009.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Falta la fecha`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-010 — F2: fecha inexistente

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F2 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (formato de archivo no llega a la RPC) |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-010-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-010.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = texto `31/02/2026` | Gasto | 1000 | ARS | vacía | Otros | Efectivo | 1 | vacía | F2. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-010-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-010.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Fecha inválida: usá DD/MM/AAAA`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-011 — F3: fecha futura fija

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F3 · FR-06 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (falta oráculo API aislado; ver ambigüedad 3) |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-011-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-011.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = texto `31/12/2099` | Gasto | 1000 | ARS | vacía | Otros | Efectivo | 1 | vacía | F3. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-011-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-011.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `La fecha no puede ser futura`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-012 — F5: tipo inválido

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F5 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (la RPC recibe tipo normalizado) |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-012-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-012.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | `Gastos` | 1000 | ARS | vacía | Otros | Efectivo | 1 | vacía | F5. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-012-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-012.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Tipo inválido: escribí Gasto o Ingreso`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-013 — F7: monto no numérico

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F7 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | CP-IMP-034 |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-013-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-013.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | texto `abc` | ARS | vacía | Otros | Efectivo | 1 | vacía | F7. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-013-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-013.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Monto inválido: usá un número, por ejemplo 1234,56`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-014 — F8: monto cero

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F8 · I4 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | CP-IMP-034 |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-014-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-014.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | 0 | ARS | vacía | Otros | Efectivo | 1 | vacía | F8. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-014-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-014.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `El monto debe ser mayor a cero`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-015 — F9: monto con tres decimales

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F9 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (contrato API exacto no especificado) |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-015-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-015.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | texto `10,001` | ARS | vacía | Otros | Efectivo | 1 | vacía | F9. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-015-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-015.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `El monto admite hasta 2 decimales`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-016 — F12: moneda EUR

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F12 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (la RPC recibe moneda normalizada) |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-016-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-016.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | 1000 | `EUR` | vacía | Otros | Efectivo | 1 | vacía | F12. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-016-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-016.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Moneda inválida: escribí ARS o USD`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-017 — F13a: USD sin tipo de cambio

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F13a · I5 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (contrato API exacto no especificado) |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-017-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-017.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | 10 | USD | vacía | Otros | Efectivo | 1 | vacía | F13a. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-017-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-017.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Falta el tipo de cambio`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-018 — F13b: ARS con tipo de cambio

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F13b · I5 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (contrato API exacto no especificado) |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-018-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-018.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | 1000 | ARS | 1450 | Otros | Efectivo | 1 | vacía | F13b. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-018-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-018.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Una transacción en ARS no lleva tipo de cambio`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-019 — F14b: categoría inexistente

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F14b |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (API exacta solo especificada para cambio posterior) |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-019-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-019.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | 1000 | ARS | vacía | `Mascotas` | Efectivo | 1 | vacía | F14b. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-019-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-019.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `No existe la categoría «Mascotas» o está archivada`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-020 — F14d: cuenta inexistente

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F14d |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (contrato API exacto no especificado) |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-020-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-020.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | 1000 | ARS | vacía | Otros | `Banco X` | 1 | vacía | F14d. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-020-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-020.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `No existe la cuenta «Banco X» o está archivada`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-021 — F14e: trece cuotas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F14e |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (contrato API exacto no especificado) |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-021-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-021.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | 1000 | ARS | vacía | Otros | Tarjeta de crédito | 13 | vacía | F14e. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-021-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-021.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Las cuotas van de 1 a 12`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-022 — F15: cuotas en cuenta no crédito

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F15 · I6 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (contrato API exacto no especificado) |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-022-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-022.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | 1000 | ARS | vacía | Otros | Efectivo | 3 | vacía | F15. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-022-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-022.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Solo los gastos con tarjeta de crédito admiten cuotas`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-023 — Errores de varias columnas conservan el orden de reglas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-3 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-023-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-023.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2: texto `31/02/2026` | Gasto | 0 | ARS | vacía | Otros | `Banco X` | 1 | vacía | `Tres errores`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-023-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-023.xlsx`. | `Fila 2` queda `Con error`; aparecen, en este orden y una vez: `Fecha inválida: usá DD/MM/AAAA`, `El monto debe ser mayor a cero`, `No existe la cuenta «Banco X» o está archivada`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-024 — Nombres, tipo y moneda aceptan espacios y mayúsculas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-5 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-024-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-024.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2: `01/09/2026 |  gasto  | 10 | usd | 1450 |  educación  |  efectivo  | 1 | vacía | Coincidencia`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-024-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-024.xlsx`. | `Fila 2` está `Lista`; muestra `Gasto`, `US$10,00`, `Educación`, `Efectivo` y `TC 1.450,00`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-025 — Categoría archivada no se acepta aunque el nombre coincida

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-5 · F14b |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-025-001@example.com`; archivar `Otros` desde Ajustes y cerrar sesión.

**Datos de prueba:** `cp-imp-025.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2: `01/09/2026 | Gasto | 1000 | ARS | vacía | Otros | Efectivo | 1 | vacía | Archivada`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-025-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-025.xlsx`. | `Fila 2` muestra exactamente `No existe la categoría «Otros» o está archivada`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-026 — El texto 1.500 se interpreta como mil quinientos

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-7 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-026-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-026.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2: fecha Excel `01/09/2026` | Gasto | texto `1.500` | ARS | vacía | Otros | Efectivo | 1 | vacía | Fórmula.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-026-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-026.xlsx`. | `Fila 2` está `Lista` y muestra exactamente `$1.500,00`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-027 — El resumen del archivo de ejemplo suma solo las siete filas listas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-8 · C2 |
| Invariante | I1' |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-027-001@example.com`; sesión cerrada.

**Datos de prueba:** Copia exacta de IMP-DATA-01, incluida la fila 12 vacía.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-027-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `importar-excel-ejemplo.xlsx`. | Se ve exactamente `Vas a importar 7 movimientos: $324.915,50 en gastos y $850.000,00 en ingresos (en pesos).` |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-028 — El filtro muestra solo las cuatro filas con error

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-9 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-028-001@example.com`; sesión cerrada.

**Datos de prueba:** Copia exacta de IMP-DATA-01, incluida la fila 12 vacía.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-028-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `importar-excel-ejemplo.xlsx`. | El filtro `Ver solo filas con error` está apagado y se ven 11 tarjetas. |
| 11 | Hacer click en `Ver solo filas con error`. | Queda encendido; solo se ven `Fila 7`, `Fila 8`, `Fila 9` y `Fila 10`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-029 — Cero filas listas deshabilita Importar 0 movimientos

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-11 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-029-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-029.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = V salvo Monto `0`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-029-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-029.xlsx`. | Se ve `Importar 0 movimientos` deshabilitado y `No hay filas listas para importar`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-030 — Confirmar importa solo las filas listas con todos sus campos

| Campo | Contenido |
|---|---|
| Historia · criterio | US-77 · CA-1 · C4 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-030-001@example.com`; sesión cerrada; PR-04 listo.

**Datos de prueba:** `cp-imp-030.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`. Fila 2: `01/09/2026 | Gasto | 1000 | ARS | vacía | Otros | Efectivo | 1 | vacía | Nota ficticia`. Fila 3: `02/09/2026 | Ingreso | 2000 | ARS | vacía | vacía | Cuenta bancaria | 1 | vacía | vacía`. Fila 4 igual a fila 2 salvo Monto `0` y Nota `No importar`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-030-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-030.xlsx`. | `3 filas leídas · 2 listas para importar · 1 con error`. |
| 11 | Hacer click en `Importar 2 movimientos`. | Se ve `Se importaron 2 de 3 filas.`, `$1.000,00 en gastos y $2.000,00 en ingresos (en pesos).` y `Fila 4: El monto debe ser mayor a cero`. |
| 12 | Ejecutar IMP-PREP-04. | Existen exactamente las transacciones de filas 2 y 3 con sus nueve campos exactos; descripción de fila 3 es null; no existe transacción para fila 4. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-031 — La compra de 240.000 en seis cuotas crea seis imputaciones exactas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-77 · CA-2 · C4 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-031-001@example.com`; sesión cerrada; PR-04 listo.

**Datos de prueba:** `cp-imp-031.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2: `03/09/2026 | Gasto | 240000 | ARS | vacía | Indumentaria | Tarjeta de crédito | 6 | vacía | Campera ficticia`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-031-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-031.xlsx`. | `Fila 2` está `Lista`; muestra `$240.000,00` y `6 cuotas`. |
| 11 | Hacer click en `Importar 1 movimiento`. | Se ve `Se importó 1 de 1 fila.` y `$240.000,00 en gastos y $0,00 en ingresos (en pesos).` |
| 12 | Ejecutar IMP-PREP-04. | La transacción tiene `amount=240000.00`, seis imputaciones `40000.00`, números 1–6, en `2026-09-01` a `2027-02-01`; suman `240000.00`. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-032 — Un rechazo tardío de categoría no impide las otras filas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-77 · CA-4 · C6 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | CP-IMP-034 |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-032-001@example.com`; sesión cerrada; segunda sesión del mismo usuario disponible.

**Datos de prueba:** Copia exacta de IMP-DATA-01, incluida la fila 12 vacía.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-032-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `importar-excel-ejemplo.xlsx`. | Fila 6 está `Lista` con `Transporte`. |
| 11 | En la segunda sesión, archivar `Transporte`. | Ajustes muestra la categoría archivada. |
| 12 | En la primera sesión, hacer click en `Importar 7 movimientos`. | Se ve `Se importaron 6 de 11 filas.`, `$321.715,50 en gastos y $850.000,00 en ingresos (en pesos).` y `Fila 6: No existe la categoría «Transporte» o está archivada`; las demás válidas se importan. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-033 — Quinientas filas de doce cuotas terminan en menos de diez segundos

| Campo | Contenido |
|---|---|
| Historia · criterio | US-77 · CA-6 |
| Invariante | — |
| Técnica | Prueba de rendimiento |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-033-001@example.com`; deploy Vercel/Supabase hosteado; cronómetro de 0,1 s.

**Datos de prueba:** `cp-imp-033.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`. Filas 2–501: `01/09/2026 | Gasto | 120 | ARS | vacía | Otros | Tarjeta de crédito | 12 | vacía | Carga <n>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-033-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-033.xlsx`. | `500 filas leídas · 500 listas para importar · 0 con error`. |
| 11 | Iniciar el cronómetro. | El cronómetro comienza en `0,0 s`. |
| 12 | Hacer click en `Importar 500 movimientos`. | Muestra `Importando…` deshabilitado. |
| 13 | Detener el cronómetro al aparecer Resultado. | El cronómetro se detiene. |
| 14 | Leer el cronómetro y el título del resultado. | El tiempo es menor a `10,0 s` y se ve `Se importaron 500 de 500 filas.` |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-034 — La RPC procesa una válida y rechaza tres inválidas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-77 · CA-7 · C6 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | API |
| Caso par | CP-IMP-013, CP-IMP-014, CP-IMP-032 |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-034-001@example.com`; PR-04 pasos 1–2.

**Datos de prueba:** body literal `{"p_import_id":"77777777-0000-4000-8000-000000000077","p_rows":[{"row":1,"type":"expense","amount":"1000.00","currency":"ARS","fx_rate":null,"category_id":"<uuid Otros>","account_id":"<uuid Efectivo>","installments_count":1,"occurred_on":"2026-09-03","description":"válida"},{"row":2,"type":"expense","amount":"0","currency":"ARS","fx_rate":null,"category_id":"<uuid Otros>","account_id":"<uuid Efectivo>","installments_count":1,"occurred_on":"2026-09-03","description":null},{"row":3,"type":"expense","amount":"500.00","currency":"ARS","fx_rate":null,"category_id":"<uuid Otros>","installments_count":1,"occurred_on":"2026-09-03","description":null},{"row":4,"type":"expense","amount":"abc","currency":"ARS","fx_rate":null,"category_id":"<uuid Otros>","account_id":"<uuid Efectivo>","installments_count":1,"occurred_on":"2026-09-03","description":null}]}`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar IMP-PREP-03 con el body literal de Datos. | HTTP 200; `sent_rows:4`, `imported_rows:1`; fila 1 tiene `status:"imported"` y un `transaction_id`; fila 2 tiene `status:"rejected"`, `error_code:"23514"`, `error_message:"I4: el monto debe ser mayor a cero"`; fila 3 tiene `status:"rejected"`, `error_code:"23503"`, `error_message:"la cuenta no existe, no es tuya o está archivada"`; fila 4 tiene `status:"rejected"` y `error_code:"22P02"`. |
| 2 | Ejecutar IMP-PREP-04. | Existe solo la transacción e imputación de fila 1. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-035 — La RPC rechaza un lote de 501 elementos

| Campo | Contenido |
|---|---|
| Historia · criterio | US-77 · CA-8 · C6 |
| Invariante | — |
| Técnica | Análisis de valores límite |
| Tipo | Negativo |
| Canal | API |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-035-001@example.com`; PR-04.

**Datos de prueba:** UUID `79797979-0000-4000-8000-000000000079`; 501 objetos como {"row":1,"type":"expense","amount":"1000.00","currency":"ARS","fx_rate":null,"category_id":"<uuid Otros>","account_id":"<uuid Efectivo>","installments_count":1,"occurred_on":"2026-09-03","description":"válida"}, con `row` 1–501.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar IMP-PREP-03. | HTTP no exitoso de clase 4xx; no hay resultado de lote; el número de status HTTP y el body se registran como evidencia porque la especificación no fija su mapeo ni un `code`. |
| 2 | Ejecutar IMP-PREP-04. | No hay transacciones, imputaciones ni import. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-036 — El rol anon no puede ejecutar import_transactions

| Campo | Contenido |
|---|---|
| Historia · criterio | US-77 · CA-9 · C7 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | API |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** Conocer URL y anon key; sin sesión.

**Datos de prueba:** body `{"p_import_id":"80808080-0000-4000-8000-000000000080","p_rows":[{"row":1,"type":"expense","amount":"1000.00","currency":"ARS","fx_rate":null,"category_id":"00000000-0000-4000-8000-000000000001","account_id":"00000000-0000-4000-8000-000000000002","installments_count":1,"occurred_on":"2026-09-03","description":"válida"}]}`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/import_transactions` con `apikey: <ANON_KEY>`, `Authorization: Bearer <ANON_KEY>`, `Content-Type: application/json` y el body de Datos. | HTTP no exitoso de clase 4xx; JSON `code:"42501"` y mensaje de permiso denegado; no se crea nada; el número de status HTTP se registra como evidencia porque la especificación no fija su mapeo. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-037 — Otro usuario no ve transacciones ni imports ajenos

| Campo | Contenido |
|---|---|
| Historia · criterio | US-77 · CA-9 · C7 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | API |
| Caso par | CP-IMP-030 |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 para A con `qa+cp-imp-037-001@example.com` y para B con `qa+cp-imp-037-002@example.com`; PR-04 para ambos. Con `<TOKEN-A>`, ejecutar IMP-PREP-03 usando el body de Datos y guardar el `transaction_id` como `<ID-A>`.

**Datos de prueba:** UUID `81818181-0000-4000-8000-000000000081`; body `{"p_import_id":"81818181-0000-4000-8000-000000000081","p_rows":[{"row":1,"type":"expense","amount":"1000.00","currency":"ARS","fx_rate":null,"category_id":"<uuid Otros de A>","account_id":"<uuid Efectivo de A>","installments_count":1,"occurred_on":"2026-09-03","description":"Solo A"}]}`. Las verificaciones usan `<TOKEN-B>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Con token B, ejecutar `GET <SUPABASE_URL>/rest/v1/transactions?select=id&id=eq.<ID-A>` con headers de PR-04 y sin body. | HTTP 200 y cuerpo exacto `[]`. |
| 2 | Con token B, ejecutar `GET <SUPABASE_URL>/rest/v1/imports?select=id&id=eq.81818181-0000-4000-8000-000000000081` con headers de PR-04 y sin body. | HTTP 200 y cuerpo exacto `[]`. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-038 — Reintento tras respuesta perdida reconoce lo guardado

| Campo | Contenido |
|---|---|
| Historia · criterio | US-78 · CA-2 · ADR-035 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-038-001@example.com`; PR-04 pasos 1–2. Antes de abrir el navegador, ejecutar IMP-PREP-03 con el body literal `{"p_import_id":"83838383-0000-4000-8000-000000000083","p_rows":[{"row":2,"type":"expense","amount":"1000.00","currency":"ARS","fx_rate":null,"category_id":"<uuid Otros>","account_id":"<uuid Efectivo>","installments_count":1,"occurred_on":"2026-09-01","description":"Compra ficticia"}]}`. Esperado: HTTP 200, `already_imported:false`, `sent_rows:1`, `imported_rows:1` y fila 2 `status:"imported"`. Ejecutar IMP-PREP-04: existe exactamente una transacción y una imputación para ese UUID.

**Datos de prueba:** `cp-imp-038.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = V. UUID fijo `83838383-0000-4000-8000-000000000083`. El registro preexistente representa el commit confirmado cuya respuesta perdió el cliente; el primer intento UI se fuerza sin conexión y el reintento consulta ese mismo UUID.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-038-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Presionar F12. | Se abre DevTools. |
| 10 | Hacer click en la pestaña `Console`. | Se ve el prompt de la consola. |
| 11 | Ejecutar IMP-PREP-06. | La consola devuelve exactamente `83838383-0000-4000-8000-000000000083`. |
| 12 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 13 | Elegir `cp-imp-038.xlsx`. | Se ve una fila `Lista` y el botón `Importar 1 movimiento`. |
| 14 | En DevTools, abrir `Network conditions` y seleccionar `Offline`. | DevTools muestra `Offline`. |
| 15 | Hacer click en `Importar 1 movimiento`. | Se muestra exactamente `No pudimos confirmar la importación. Puede que se haya guardado: tocá Reintentar y te decimos qué pasó.` y el botón `Reintentar`; la revisión y el nombre del archivo siguen visibles. |
| 16 | En DevTools, cambiar `Offline` por `No throttling`. | DevTools muestra `No throttling`. |
| 17 | Hacer click en `Reintentar`. | Se abre el paso 3 y `import-result-already` muestra exactamente `Esta importación ya se había guardado.`. |
| 18 | Ejecutar IMP-PREP-04. | Hay exactamente una transacción de `1000.00` ARS, una imputación de `1000.00` para `2026-09-01` y un import con UUID `83838383-0000-4000-8000-000000000083`; no se creó un duplicado. |
| 19 | Ejecutar en Console la limpieza indicada en IMP-PREP-06. | La consola devuelve `true`; `crypto.randomUUID()` vuelve a generar UUID variables. |

**Post-condición:** Dejar Network en `No throttling`, cerrar DevTools y conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-039 — Dos llamadas API con el mismo import_id son idempotentes

| Campo | Contenido |
|---|---|
| Historia · criterio | US-78 · CA-2 · ADR-035 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | API |
| Caso par | CP-IMP-038 |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-039-001@example.com`; PR-04.

**Datos de prueba:** UUID `85858585-0000-4000-8000-000000000085`; una fila {"row":1,"type":"expense","amount":"1000.00","currency":"ARS","fx_rate":null,"category_id":"<uuid Otros>","account_id":"<uuid Efectivo>","installments_count":1,"occurred_on":"2026-09-03","description":"válida"}.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar IMP-PREP-03. | HTTP 200; `already_imported:false`; guardar transaction_id. |
| 2 | Repetir la misma llamada. | HTTP 200; `already_imported:true`; mismo transaction_id y resultado. |
| 3 | Ejecutar IMP-PREP-04. | Una transacción, una imputación y un import. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-040 — Sin respuesta conserva Revisión

| Campo | Contenido |
|---|---|
| Historia · criterio | US-78 · CA-3 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-040-001@example.com`; sesión cerrada; DevTools Network abierto en Online.

**Datos de prueba:** `cp-imp-040.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = V.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-040-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-040.xlsx`. | Una fila lista. |
| 11 | Cambiar Network a Offline. | DevTools muestra Offline. |
| 12 | Hacer click en `Importar 1 movimiento`. | Sigue en Revisión; muestra exactamente `No pudimos confirmar la importación. Puede que se haya guardado: tocá Reintentar y te decimos qué pasó.`; botón `Reintentar`. |
| 13 | Ejecutar IMP-PREP-04 después de volver Network a Online. | No hay transacciones ni imputaciones. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-041 — Sesión vencida ofrece volver a entrar

| Campo | Contenido |
|---|---|
| Historia · criterio | US-78 · CA-3 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-041-001@example.com`; DevTools para interceptar HTTP 401 con `42501`.

**Datos de prueba:** `cp-imp-041.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = V.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-041-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-041.xlsx`. | Una fila lista. |
| 11 | Hacer click en `Importar 1 movimiento`. | Sigue en Revisión; muestra exactamente `Tu sesión venció y no se importó ninguna fila. Volvé a entrar y subí el archivo de nuevo.`; botón `Volver a entrar`. |
| 12 | Ejecutar IMP-PREP-04. | No hay transacciones ni imputaciones. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

## Historias o criterios sin caso (huecos)

No quedan historias ni criterios de aceptación sin al menos un caso. Las seis historias y sus 62 criterios están trazados en la matriz.

Quedan estos huecos de ejecución o de oráculo, sin inventar comportamiento:

1. Los negativos A1–A7 y los errores de formato F1–F21 que el cliente excluye antes de llamar a la base no tienen un endpoint de carga de archivos. Solo se enlazó un caso API cuando el criterio define un body, status/code y mensaje observable. Para F7, F8 y F14c el par es el lote explícito CP-IMP-034; los casos de cuotas empezadas se quitaron del catálogo en el recorte.
2. Para F1, F4, F6, F9–F18 y parte de F19–F21, la historia no fija el `error_code` ni el `error_message` de una fila arbitraria enviada directamente a `import_transactions`. Se mantienen como casos UI sin fabricar ese oráculo API. El caso de rollback de C4 con un dato F17 se quitó del catálogo en el recorte. El PO debe decidir si se amplía el contrato de la sección 5.
3. Los casos que requerían un reloj de dominio fijado al 12/10/2026 (los de fecha del día de Argentina y los de cuotas empezadas) se quitaron del catálogo en el recorte; `docs/12-procedimientos-de-prueba.md` no define cómo fijar el reloj del deploy.
4. CP-IMP-038 reproduce de forma determinista la recuperación de “commit confirmado, respuesta desconocida” sembrando antes el mismo UUID y haciendo que el primer intento del navegador falle sin conexión. No reproduce el instante físico en que una respuesta se corta después del commit; ese ensayo de transporte requiere un proxy de fallos del entorno.

## Ambigüedades para el PO

1. `entrega-2/mocks/importar-excel-ejemplo.xlsx` y su hoja `Instrucciones` todavía tienen nueve columnas y no incluyen `Cuotas pendientes`. US-80 · CA-1 exige diez. Estos casos toman como oráculo la historia más nueva; confirmar si el archivo de ejemplo debe regenerarse antes de la ejecución.
2. C1 exige fechas fijas y prohíbe “hoy”, mientras US-76 · CA-6 y US-80 expresan límites relativos a hoy. Se fijó hoy en Argentina a `12/10/2026`; falta un procedimiento oficial para controlar ese reloj en UI/API manual.
3. C6 exige pares UI/API para negativos, pero la especificación solo fija respuesta directa para el lote de US-77 · CA-7 y las variantes de US-80 · CA-16. Confirmar si se desean contratos de error adicionales para cada F1–F21 o si las excepciones documentadas son aceptables.
4. US-74 · CA-8, US-76 · CA-12, US-77 · CA-10, US-78 · CA-5 y US-81 · CA-10 hablan de todos los elementos interactivos. Se verifican los `data-testid` al usar cada elemento en los casos funcionales; confirmar si el equipo además quiere una inspección exhaustiva separada del DOM, que duplicaría la cobertura sin probar otra conducta.
5. US-77 · CA-8 solo fija rechazo total y ausencia de persistencia: no contractualiza el número HTTP, `code` ni mensaje. CA-9 sí fija `permission denied`/`42501`, pero tampoco el número HTTP que PostgREST debe asignar. CP-IMP-035/036 verifican únicamente esos oráculos sin inventar `400`, `401` o `403`; el PO debe definir el contrato HTTP restante si quiere usarlo como veredicto.

## Resumen cuantitativo

| Dimensión | Cantidad |
|---|---:|
| Total | 41 |
| Positivos | 11 |
| Negativos | 29 |
| Límites | 1 |
| UI | 36 |
| API | 5 |
| Prioridad Alta | 14 |
| Prioridad Media | 27 |
| Prioridad Baja | 0 |
| Automatizable Sí | 41 |
| Automatizable No | 0 |
| Automatizable V3 | 0 |
