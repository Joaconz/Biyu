# Casos de prueba V2 · IMP — Importar Excel

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

### IMP-PREP-01 · Entrar a Importar desde Excel

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir el email del caso en `Email`. | El campo muestra el email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en `Importar desde Excel`. | La URL termina en `/import`; se ve `Importar desde Excel`, el indicador en `1 Archivo` y `Elegir archivo .xlsx`. |

### IMP-PREP-02 · Elegir un archivo

Requiere IMP-PREP-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector de archivos filtrado para `.xlsx`. |
| 2 | Elegir el archivo exacto del caso. | El selector se cierra y Biyu procesa ese archivo. |

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

Usar solo en CP-IMP-083, después de entrar a `/import` y antes de elegir el archivo. Abrir DevTools, seleccionar `Console`, escribir literalmente el siguiente código en una sola línea y presionar Enter:

```javascript
window.__impOriginalRandomUUID=window.crypto.randomUUID.bind(window.crypto);Object.defineProperty(window.crypto,'randomUUID',{configurable:true,value:()=>"83838383-0000-4000-8000-000000000083"});window.crypto.randomUUID()
```

Resultado esperado: la consola devuelve exactamente `83838383-0000-4000-8000-000000000083`. Para limpiar el fixture al terminar, ejecutar `Object.defineProperty(window.crypto,'randomUUID',{configurable:true,value:window.__impOriginalRandomUUID});delete window.__impOriginalRandomUUID` y cerrar DevTools.

## Matriz de cobertura CA → casos

| Historia | Criterio | Casos |
|---|---|---|
| US-74 | CA-1 | CP-IMP-001, CP-IMP-002 |
| US-74 | CA-2 | CP-IMP-003, CP-IMP-004 |
| US-74 | CA-3 | CP-IMP-005 a CP-IMP-011 |
| US-74 | CA-4 | CP-IMP-012 a CP-IMP-015 |
| US-74 | CA-5 | CP-IMP-016 |
| US-74 | CA-6 | CP-IMP-017, CP-IMP-018 |
| US-74 | CA-7 | CP-IMP-019, CP-IMP-020 |
| US-74 | CA-8 | CP-IMP-001, CP-IMP-003, CP-IMP-005 a CP-IMP-020 |
| US-76 | CA-1 | CP-IMP-021 |
| US-76 | CA-2 | CP-IMP-022 a CP-IMP-047 |
| US-76 | CA-3 | CP-IMP-048 |
| US-76 | CA-4 | CP-IMP-049 a CP-IMP-051 |
| US-76 | CA-5 | CP-IMP-052 a CP-IMP-054, CP-IMP-142 |
| US-76 | CA-6 | CP-IMP-055 a CP-IMP-058 |
| US-76 | CA-7 | CP-IMP-059 a CP-IMP-062 |
| US-76 | CA-8 | CP-IMP-063 |
| US-76 | CA-9 | CP-IMP-064, CP-IMP-065 |
| US-76 | CA-10 | CP-IMP-066, CP-IMP-067 |
| US-76 | CA-11 | CP-IMP-068, CP-IMP-069 |
| US-76 | CA-12 | CP-IMP-021 a CP-IMP-069 |
| US-77 | CA-1 | CP-IMP-070, CP-IMP-071 |
| US-77 | CA-2 | CP-IMP-072 |
| US-77 | CA-3 | CP-IMP-073 |
| US-77 | CA-4 | CP-IMP-074 |
| US-77 | CA-5 | CP-IMP-075 |
| US-77 | CA-6 | CP-IMP-076 |
| US-77 | CA-7 | CP-IMP-077, CP-IMP-144 |
| US-77 | CA-8 | CP-IMP-078, CP-IMP-079 |
| US-77 | CA-9 | CP-IMP-080, CP-IMP-081 |
| US-77 | CA-10 | CP-IMP-070 a CP-IMP-076 |
| US-78 | CA-1 | CP-IMP-082 |
| US-78 | CA-2 | CP-IMP-083 a CP-IMP-085 |
| US-78 | CA-3 | CP-IMP-086 a CP-IMP-089 |
| US-78 | CA-4 | CP-IMP-090 a CP-IMP-092, CP-IMP-143 |
| US-78 | CA-5 | CP-IMP-082 a CP-IMP-092 |
| US-80 | CA-1 | CP-IMP-003 |
| US-80 | CA-2 | CP-IMP-093 |
| US-80 | CA-3 | CP-IMP-094 |
| US-80 | CA-4 | CP-IMP-095 |
| US-80 | CA-5 | CP-IMP-096 |
| US-80 | CA-6 | CP-IMP-097, CP-IMP-098 |
| US-80 | CA-7 | CP-IMP-099, CP-IMP-100 |
| US-80 | CA-8 | CP-IMP-101 a CP-IMP-107 |
| US-80 | CA-9 | CP-IMP-108 a CP-IMP-110 |
| US-80 | CA-10 | CP-IMP-111, CP-IMP-112 |
| US-80 | CA-11 | CP-IMP-113 |
| US-80 | CA-12 | CP-IMP-114 |
| US-80 | CA-13 | CP-IMP-115 |
| US-80 | CA-14 | CP-IMP-116 |
| US-80 | CA-15 | CP-IMP-117 |
| US-80 | CA-16 | CP-IMP-118 a CP-IMP-126 |
| US-80 | CA-17 | CP-IMP-093 |
| US-81 | CA-1 | CP-IMP-127, CP-IMP-128 |
| US-81 | CA-2 | CP-IMP-129 |
| US-81 | CA-3 | CP-IMP-130 a CP-IMP-133 |
| US-81 | CA-4 | CP-IMP-134, CP-IMP-135 |
| US-81 | CA-5 | CP-IMP-136 |
| US-81 | CA-6 | CP-IMP-137 |
| US-81 | CA-7 | CP-IMP-138 |
| US-81 | CA-8 | CP-IMP-139, CP-IMP-140 |
| US-81 | CA-9 | CP-IMP-141 |
| US-81 | CA-10 | CP-IMP-127 a CP-IMP-141 |

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

### CP-IMP-002 — La ruta privada sin sesión conserva next=/import

| Campo | Contenido |
|---|---|
| Historia · criterio | US-74 · CA-1 · C7 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** Navegador sin sesión.

**Datos de prueba:** URL `<APP>/import`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>/import`. | La barra muestra exactamente `<APP>/import`. |
| 4 | Presionar Enter. | La URL termina en `/login?next=%2Fimport` y se ve `Entrar`. |

**Post-condición:** Sin sesión ni datos.

### CP-IMP-003 — La plantilla descargada tiene diez columnas y la instrucción de cuotas pendientes

| Campo | Contenido |
|---|---|
| Historia · criterio | US-74 · CA-2 · US-80 · CA-1 |
| Invariante | C14 |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-003-001@example.com`; sesión cerrada. Excel o LibreOffice disponible.

**Datos de prueba:** Nombre esperado `biyu-plantilla-importacion.xlsx`. Hoja 1 `Movimientos`: solo A1:J1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`. Hoja 2 `Instrucciones`: encabezado `Encabezado | Celda obligatoria | Qué va | Formatos aceptados` y diez filas, incluida `Cuotas pendientes | No. Vacía = la compra se imputa desde el mes de su fecha, como hasta ahora | Cuántas cuotas faltan pagar, contando la del mes de hoy (una compra de 6 cuotas con 3 ya pagadas lleva 3) | Entero, celda numérica o texto`.

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
| 9 | Hacer click en `Descargar plantilla`. | Se descarga una vez `biyu-plantilla-importacion.xlsx`. |
| 10 | Abrir el archivo descargado en Excel o LibreOffice. | Existen exactamente las hojas `Movimientos` e `Instrucciones`; sus celdas coinciden exactamente con los datos de prueba y no hay filas de datos en `Movimientos`. |

**Post-condición:** No se creó ninguna transacción; conservar la descarga como evidencia.

### CP-IMP-004 — Subir la plantilla vacía muestra A6

| Campo | Contenido |
|---|---|
| Historia · criterio | US-74 · CA-2 · A6 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-004-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-004.xlsx`: primera hoja `Movimientos`; fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; no hay otra fila con valor.

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
| 10 | Elegir `cp-imp-004.xlsx`. | Se mantiene `1 Archivo`; aparece exactamente `El archivo no tiene filas con datos debajo de los encabezados.` en un elemento con `data-testid="import-file-error"`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-005 — A1 rechaza la extensión .xls

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-005-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-005.xls`: Libro Excel 97-2003; primera hoja con fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota` y fila 2 = V.

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
| 9 | Arrastrar `cp-imp-005.xls` desde el Explorador de archivos hasta la zona `o arrastralo acá`. | La zona queda resaltada para recibir el archivo. |
| 10 | Soltar `cp-imp-005.xls` en la zona. | Se mantiene `1 Archivo`; aparece exactamente `Solo se aceptan archivos .xlsx (Excel).`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-006 — A2 rechaza 1.048.577 bytes

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-006-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-006.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = V; ejecutar IMP-PREP-05 con objetivo `1048577`. Tamaño final exacto `1.048.577` bytes.

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
| 10 | Elegir `cp-imp-006.xlsx`. | Se mantiene `1 Archivo`; aparece exactamente `El archivo pesa más de 1 MB. Dividilo en varios archivos.`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-007 — A3 rechaza un archivo dañado con extensión xlsx

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-007-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-007.xlsx`: Archivo de texto plano cuyo contenido exacto es `archivo ficticio no xlsx`, renombrado a `.xlsx`.

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
| 10 | Elegir `cp-imp-007.xlsx`. | Se mantiene `1 Archivo`; aparece exactamente `No pudimos leer el archivo. Abrilo en Excel, guardalo como .xlsx y probá de nuevo.`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-008 — A4 enumera tres encabezados obligatorios faltantes

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-008-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-008.xlsx`: Fila 1: `Tipo | Moneda | Categoría | Cuotas | Cuotas pendientes | Nota`; fila 2: `Gasto | ARS | Otros | 1 | vacía | Ficticio`.

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
| 10 | Elegir `cp-imp-008.xlsx`. | Se mantiene `1 Archivo`; aparece exactamente `Faltan columnas: Fecha, Monto, Cuenta. La primera fila tiene que tener los encabezados de la plantilla.`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-009 — A5 rechaza un encabezado repetido

| Campo | Contenido |
|---|---|
| Historia · criterio | US-74 · CA-3 · A5 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-009-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-009.xlsx`: Fila 1: `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota` más una columna K `Monto`; fila 2 = V y K2 `2000`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-imp-009-001@example.com` en `Email`. | El campo muestra `qa+cp-imp-009-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en `Importar desde Excel`. | La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector de archivos. |
| 10 | Elegir `cp-imp-009.xlsx`. | Se mantiene `1 Archivo`; aparece exactamente `La columna Monto está repetida. Dejá una sola.`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-010 — A6 rechaza filas completamente vacías

| Campo | Contenido |
|---|---|
| Historia · criterio | US-74 · CA-3 · A6 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-010-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-010.xlsx`: Fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; filas 2 a 10 tienen celdas vacías o texto compuesto solo por espacios.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-imp-010-001@example.com` en `Email`. | El campo muestra `qa+cp-imp-010-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en `Importar desde Excel`. | La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector de archivos. |
| 10 | Elegir `cp-imp-010.xlsx`. | Se mantiene `1 Archivo`; aparece exactamente `El archivo no tiene filas con datos debajo de los encabezados.`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-011 — A7 rechaza 501 filas con datos

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-011-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-011.xlsx`: Fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`. Filas 2–502: fecha Excel `01/09/2026`, `Gasto`, monto numérico igual al número de fila, `ARS`, TC vacía, `Otros`, `Efectivo`, `1`, pendientes vacía, nota `Fila <n>`; son exactamente 501 filas con datos.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-imp-011-001@example.com` en `Email`. | El campo muestra `qa+cp-imp-011-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en `Importar desde Excel`. | La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector de archivos. |
| 10 | Elegir `cp-imp-011.xlsx`. | Se mantiene `1 Archivo`; aparece exactamente `El archivo tiene 501 filas con datos y el máximo es 500. Dividilo en varios archivos.`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-012 — El límite de tamaño acepta exactamente 1.048.576 bytes

| Campo | Contenido |
|---|---|
| Historia · criterio | US-74 · CA-4 · A2 |
| Invariante | — |
| Técnica | Análisis de valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-012-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-012.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = V; ejecutar IMP-PREP-05 con objetivo `1048576`. Tamaño final exacto `1.048.576` bytes.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-imp-012-001@example.com` en `Email`. | El campo muestra `qa+cp-imp-012-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en `Importar desde Excel`. | La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector de archivos. |
| 10 | Elegir `cp-imp-012.xlsx`. | Se abre `2 Revisión`; muestra `1 fila leída · 1 lista para importar · 0 con error`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-013 — Un byte sobre el límite de tamaño muestra A2

| Campo | Contenido |
|---|---|
| Historia · criterio | US-74 · CA-4 · A2 |
| Invariante | — |
| Técnica | Análisis de valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-013-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-013.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = V; ejecutar IMP-PREP-05 con objetivo `1048577`. Tamaño final exacto `1.048.577` bytes.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-imp-013-001@example.com` en `Email`. | El campo muestra `qa+cp-imp-013-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en `Importar desde Excel`. | La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector de archivos. |
| 10 | Elegir `cp-imp-013.xlsx`. | Se mantiene `1 Archivo`; aparece exactamente `El archivo pesa más de 1 MB. Dividilo en varios archivos.`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-014 — El límite de filas acepta exactamente 500

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-014-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-014.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`. Filas 2–501: fecha Excel `01/09/2026`, `Gasto`, monto `1`, `ARS`, TC vacía, `Otros`, `Efectivo`, `1`, pendientes vacía, nota exacta `Fila <n>`; 500 filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-imp-014-001@example.com` en `Email`. | El campo muestra `qa+cp-imp-014-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en `Importar desde Excel`. | La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector de archivos. |
| 10 | Elegir `cp-imp-014.xlsx`. | Se abre `2 Revisión`; muestra `500 filas leídas · 500 listas para importar · 0 con error`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-015 — Una fila sobre el límite muestra A7 con 501

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-015-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-015.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; filas 2–502 iguales al patrón de CP-IMP-014; 501 filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-imp-015-001@example.com` en `Email`. | El campo muestra `qa+cp-imp-015-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en `Importar desde Excel`. | La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector de archivos. |
| 10 | Elegir `cp-imp-015.xlsx`. | Se mantiene `1 Archivo`; aparece exactamente `El archivo tiene 501 filas con datos y el máximo es 500. Dividilo en varios archivos.`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-016 — Solo se lee la primera hoja

| Campo | Contenido |
|---|---|
| Historia · criterio | US-74 · CA-5 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-016-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-016.xlsx`: hoja 1 `Primera`, fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota` y sin datos; hoja 2 `Movimientos`, fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota` y fila 2 = V.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-imp-016-001@example.com` en `Email`. | El campo muestra `qa+cp-imp-016-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en `Importar desde Excel`. | La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector de archivos. |
| 10 | Elegir `cp-imp-016.xlsx`. | Se mantiene `1 Archivo`; aparece exactamente `El archivo no tiene filas con datos debajo de los encabezados.`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-017 — Los encabezados aceptan orden, mayúsculas, espacios y tildes distintos

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-017-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-017.xlsx`. Fila 1 A:J: ` CUOTAS PENDIENTES  | monto | FECHA | cuenta | TIPO | moneda | CATEGORIA | NOTA | CUOTAS | TIPO DE CAMBIO`. Fila 2 en ese orden: vacía | `1000` | fecha Excel `01/09/2026` | `Efectivo` | ` gasto ` | `ars` | `Otros` | `Compra ficticia` | `1` | vacía.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-imp-017-001@example.com` en `Email`. | El campo muestra `qa+cp-imp-017-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en `Importar desde Excel`. | La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector de archivos. |
| 10 | Elegir `cp-imp-017.xlsx`. | Se abre `2 Revisión`; muestra `1 fila leída · 1 lista para importar · 0 con error` y la tarjeta `Fila 2` está `Lista`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-018 — Una columna desconocida se ignora y se informa

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-018-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-018.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota` y K1 `Comercio`; fila 2 = V y K2 `Almacén ficticio`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-imp-018-001@example.com` en `Email`. | El campo muestra `qa+cp-imp-018-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en `Importar desde Excel`. | La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector de archivos. |
| 10 | Elegir `cp-imp-018.xlsx`. | Se abre `2 Revisión`; aparece exactamente `Se ignoraron las columnas: Comercio.` y `1 fila leída · 1 lista para importar · 0 con error`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-019 — Un archivo ARS sin columnas opcionales deja la fila lista

| Campo | Contenido |
|---|---|
| Historia · criterio | US-74 · CA-7 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-019-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-019.xlsx`. Fila 1: `Fecha | Tipo | Monto | Moneda | Categoría | Cuenta | Cuotas pendientes`. Fila 2: fecha Excel `01/09/2026` | `Gasto` | `1000` | `ARS` | `Otros` | `Efectivo` | vacía. No existen `Tipo de cambio`, `Cuotas` ni `Nota`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-imp-019-001@example.com` en `Email`. | El campo muestra `qa+cp-imp-019-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en `Importar desde Excel`. | La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector de archivos. |
| 10 | Elegir `cp-imp-019.xlsx`. | Se abre `2 Revisión`; `Fila 2` está `Lista` y muestra `$1.000,00`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-020 — Sin columna Categoría un gasto muestra F14a

| Campo | Contenido |
|---|---|
| Historia · criterio | US-74 · CA-7 · US-76 · F14a |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (el archivo no se envía a la RPC; ver ambigüedad 3) |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-020-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-020.xlsx`. Fila 1: `Fecha | Tipo | Monto | Moneda | Cuenta`; fila 2: fecha Excel `01/09/2026` | `Gasto` | `1000` | `ARS` | `Efectivo`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-imp-020-001@example.com` en `Email`. | El campo muestra `qa+cp-imp-020-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en `Importar desde Excel`. | La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector de archivos. |
| 10 | Elegir `cp-imp-020.xlsx`. | Se abre `2 Revisión`; `Fila 2` está `Con error` y muestra exactamente `Falta la categoría (es obligatoria en un gasto)`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-021 — El archivo de ejemplo conserva números de fila y omite la fila vacía 12

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-1 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-021-001@example.com`; sesión cerrada.

**Datos de prueba:** Copia exacta de IMP-DATA-01; filas 2–11 y 13 tienen datos y la fila 12 está vacía.

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
| 10 | Elegir `importar-excel-ejemplo.xlsx`. | Se abre `2 Revisión`; muestra exactamente `11 filas leídas · 7 listas para importar · 4 con error`; existen tarjetas `Fila 2` a `Fila 11` y `Fila 13`, y no existe `Fila 12`. |
| 11 | Inspeccionar la Revisión con DevTools Elements. | Existen `import-file-name`, `import-summary`, `import-summary-amounts`, `import-duplicates-warning`, `import-filter-errors`, `import-rows`, `import-row-2` con `data-status="ready"`, `import-row-7` con `data-status="error"`, `import-row-7-errors`, `import-change-file` e `import-submit`; `import-ignored-columns` no está porque no hay columnas desconocidas. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-022 — F1: fecha vacía

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-022-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-022.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = vacía | Gasto | 1000 | ARS | vacía | Otros | Efectivo | 1 | vacía | F1. No hay más filas.

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
| 10 | Elegir `cp-imp-022.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Falta la fecha`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-023 — F2: fecha inexistente

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-023-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-023.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = texto `31/02/2026` | Gasto | 1000 | ARS | vacía | Otros | Efectivo | 1 | vacía | F2. No hay más filas.

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
| 10 | Elegir `cp-imp-023.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Fecha inválida: usá DD/MM/AAAA`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-024 — F3: fecha futura fija

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-024-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-024.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = texto `31/12/2099` | Gasto | 1000 | ARS | vacía | Otros | Efectivo | 1 | vacía | F3. No hay más filas.

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
| 10 | Elegir `cp-imp-024.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `La fecha no puede ser futura`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-025 — F4: tipo vacío

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F4 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (valor ausente sin oráculo API específico) |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-025-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-025.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | vacía | 1000 | ARS | vacía | Otros | Efectivo | 1 | vacía | F4. No hay más filas.

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
| 10 | Elegir `cp-imp-025.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Falta el tipo`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-026 — F5: tipo inválido

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-026-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-026.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | `Gastos` | 1000 | ARS | vacía | Otros | Efectivo | 1 | vacía | F5. No hay más filas.

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
| 10 | Elegir `cp-imp-026.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Tipo inválido: escribí Gasto o Ingreso`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-027 — F6: monto vacío

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F6 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (valor ausente sin oráculo API específico) |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-027-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-027.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | vacía | ARS | vacía | Otros | Efectivo | 1 | vacía | F6. No hay más filas.

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
| 10 | Elegir `cp-imp-027.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Falta el monto`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-028 — F7: monto no numérico

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F7 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | CP-IMP-077 |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-028-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-028.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | texto `abc` | ARS | vacía | Otros | Efectivo | 1 | vacía | F7. No hay más filas.

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
| 10 | Elegir `cp-imp-028.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Monto inválido: usá un número, por ejemplo 1234,56`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-029 — F8: monto cero

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F8 · I4 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | CP-IMP-077 |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-029-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-029.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | 0 | ARS | vacía | Otros | Efectivo | 1 | vacía | F8. No hay más filas.

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
| 10 | Elegir `cp-imp-029.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `El monto debe ser mayor a cero`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-030 — F9: monto con tres decimales

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-030-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-030.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | texto `10,001` | ARS | vacía | Otros | Efectivo | 1 | vacía | F9. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-030-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-030.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `El monto admite hasta 2 decimales`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-031 — F10: monto sobre el máximo

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F10 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (contrato API exacto no especificado) |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-031-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-031.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | texto `1000000000000,00` | ARS | vacía | Otros | Efectivo | 1 | vacía | F10. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-031-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-031.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `El monto máximo es $999.999.999.999,99`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-032 — F11: moneda vacía

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F11 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (valor ausente sin oráculo API específico) |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-032-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-032.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | 1000 | vacía | vacía | Otros | Efectivo | 1 | vacía | F11. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-032-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-032.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Falta la moneda`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-033 — F12: moneda EUR

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-033-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-033.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | 1000 | `EUR` | vacía | Otros | Efectivo | 1 | vacía | F12. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-033-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-033.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Moneda inválida: escribí ARS o USD`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-034 — F13a: USD sin tipo de cambio

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-034-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-034.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | 10 | USD | vacía | Otros | Efectivo | 1 | vacía | F13a. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-034-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-034.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Falta el tipo de cambio`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-035 — F13b: ARS con tipo de cambio

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-035-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-035.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | 1000 | ARS | 1450 | Otros | Efectivo | 1 | vacía | F13b. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-035-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-035.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Una transacción en ARS no lleva tipo de cambio`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-036 — F13c: tipo de cambio cero

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F13c |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (contrato API exacto no especificado) |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-036-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-036.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | 10 | USD | 0 | Otros | Efectivo | 1 | vacía | F13c. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-036-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-036.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Tipo de cambio inválido: usá un número mayor a cero`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-037 — F13d: tipo de cambio con cinco decimales

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F13d |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (contrato API exacto no especificado) |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-037-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-037.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | 10 | USD | texto `1450,00001` | Otros | Efectivo | 1 | vacía | F13d. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-037-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-037.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Usá hasta 4 decimales en el tipo de cambio`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-038 — F13e: tipo de cambio sobre el máximo

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F13e |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (contrato API exacto no especificado) |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-038-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-038.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | 10 | USD | texto `10000000000,0000` | Otros | Efectivo | 1 | vacía | F13e. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-038-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-038.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `El tipo de cambio es demasiado grande`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-039 — F14a: gasto sin categoría

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F14a · I8 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (valor ausente sin oráculo API específico) |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-039-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-039.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | 1000 | ARS | vacía | vacía | Efectivo | 1 | vacía | F14a. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-039-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-039.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Falta la categoría (es obligatoria en un gasto)`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-040 — F14b: categoría inexistente

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-040-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-040.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | 1000 | ARS | vacía | `Mascotas` | Efectivo | 1 | vacía | F14b. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-040-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-040.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `No existe la categoría «Mascotas» o está archivada`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-041 — F14c: cuenta vacía

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F14c |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | CP-IMP-077 |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-041-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-041.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | 1000 | ARS | vacía | Otros | vacía | 1 | vacía | F14c. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-041-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-041.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Falta la cuenta`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-042 — F14d: cuenta inexistente

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-042-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-042.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | 1000 | ARS | vacía | Otros | `Banco X` | 1 | vacía | F14d. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-042-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-042.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `No existe la cuenta «Banco X» o está archivada`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-043 — F14e: trece cuotas

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-043-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-043.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | 1000 | ARS | vacía | Otros | Tarjeta de crédito | 13 | vacía | F14e. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-043-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-043.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Las cuotas van de 1 a 12`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-044 — F15: cuotas en cuenta no crédito

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-044-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-044.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | 1000 | ARS | vacía | Otros | Efectivo | 3 | vacía | F15. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-044-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-044.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Solo los gastos con tarjeta de crédito admiten cuotas`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-045 — F16: equivalente ARS sobre el máximo

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F16 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (contrato API exacto no especificado) |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-045-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-045.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | 999999999999.99 | USD | 2 | Otros | Efectivo | 1 | vacía | F16. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-045-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-045.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `En pesos daría más que el máximo de $999.999.999.999,99`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-046 — F17: cuota base menor a un centavo

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F17 · I4 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (contrato API exacto no especificado) |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-046-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-046.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | 0.01 | ARS | vacía | Otros | Tarjeta de crédito | 2 | vacía | F17. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-046-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-046.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Con ese monto, cada cuota daría menos de 0,01`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-047 — F18: equivalente ARS menor a un centavo

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-2 · F18 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (contrato API exacto no especificado) |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-047-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-047.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | Gasto | 0.01 | USD | 0.1 | Otros | Efectivo | 1 | vacía | F18. No hay más filas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-047-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-047.xlsx`. | Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `En pesos daría menos de $0,01. Revisá el monto o el tipo de cambio`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-048 — Errores de varias columnas conservan el orden de reglas

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-048-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-048.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2: texto `31/02/2026` | Gasto | 0 | ARS | vacía | Otros | `Banco X` | 1 | vacía | `Tres errores`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-048-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-048.xlsx`. | `Fila 2` queda `Con error`; aparecen, en este orden y una vez: `Fecha inválida: usá DD/MM/AAAA`, `El monto debe ser mayor a cero`, `No existe la cuenta «Banco X» o está archivada`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-049 — Moneda inválida oculta el error dependiente de tipo de cambio

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-4 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-049-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-049.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = 01/09/2026 | Gasto | 1000 | EUR | 1450 | Otros | Efectivo | 1 | vacía | Dependencia.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-049-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-049.xlsx`. | La fila muestra solo `Moneda inválida: escribí ARS o USD`; no aparece otro mensaje de tipo de cambio. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-050 — Tipo inválido oculta categoría obligatoria

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-4 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-050-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-050.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = 01/09/2026 | Gastos | 1000 | ARS | vacía | vacía | Efectivo | 1 | vacía | Dependencia.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-050-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-050.xlsx`. | La fila muestra solo `Tipo inválido: escribí Gasto o Ingreso`; no aparece otro mensaje de categoría. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-051 — Cuenta inválida oculta la regla de cuotas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-4 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-051-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-051.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = 01/09/2026 | Gasto | 1000 | ARS | vacía | Otros | Banco X | 3 | vacía | Dependencia.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-051-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-051.xlsx`. | La fila muestra solo `No existe la cuenta «Banco X» o está archivada`; no aparece otro mensaje de cuotas. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-052 — Nombres, tipo y moneda aceptan espacios y mayúsculas

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-052-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-052.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2: `01/09/2026 |  gasto  | 10 | usd | 1450 |  educación  |  efectivo  | 1 | vacía | Coincidencia`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-052-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-052.xlsx`. | `Fila 2` está `Lista`; muestra `Gasto`, `US$10,00`, `Educación`, `Efectivo` y `TC 1.450,00`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-053 — Una categoría sin tilde no coincide con Educación

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-053-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-053.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2: `01/09/2026 | Gasto | 1000 | ARS | vacía | Educacion | Efectivo | 1 | vacía | Tilde`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-053-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-053.xlsx`. | `Fila 2` muestra exactamente `No existe la categoría «Educacion» o está archivada`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-054 — Categoría archivada no se acepta aunque el nombre coincida

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-054-001@example.com`; archivar `Otros` desde Ajustes y cerrar sesión.

**Datos de prueba:** `cp-imp-054.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2: `01/09/2026 | Gasto | 1000 | ARS | vacía | Otros | Efectivo | 1 | vacía | Archivada`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-054-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-054.xlsx`. | `Fila 2` muestra exactamente `No existe la categoría «Otros» o está archivada`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-055 — La fecha exacta del día de Argentina queda lista

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-6 · ADR-021 |
| Invariante | — |
| Técnica | Análisis de valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-055-001@example.com`; sesión cerrada; reloj de dominio `12/10/2026`.

**Datos de prueba:** `cp-imp-055.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `12/10/2026` | Gasto | 1000 | ARS | vacía | Otros | Efectivo | 1 | vacía | Hoy.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-055-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-055.xlsx`. | `Fila 2` está `Lista` y muestra `12/10/2026`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-056 — El día siguiente de Argentina muestra F3

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-6 · F3 · ADR-021 |
| Invariante | — |
| Técnica | Análisis de valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-056-001@example.com`; sesión cerrada; reloj de dominio `12/10/2026`.

**Datos de prueba:** `cp-imp-056.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `13/10/2026` | Gasto | 1000 | ARS | vacía | Otros | Efectivo | 1 | vacía | Mañana.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-056-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-056.xlsx`. | `Fila 2` muestra exactamente `La fecha no puede ser futura`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-057 — Una celda de fecha con hora usa solo el día

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-6 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-057-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-057.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; A2 es fecha-hora Excel `05/09/2026 18:30`; B2:J2 = `Gasto | 1000 | ARS | vacía | Otros | Efectivo | 1 | vacía | Hora`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-057-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-057.xlsx`. | `Fila 2` está `Lista` y muestra `05/09/2026`, sin hora. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-058 — Un serial numérico sin formato de fecha muestra F2

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-6 · F2 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-058-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-058.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; A2 es número `46000` con formato General; B2:J2 = `Gasto | 1000 | ARS | vacía | Otros | Efectivo | 1 | vacía | Serial`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-058-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-058.xlsx`. | `Fila 2` muestra exactamente `Fecha inválida: usá DD/MM/AAAA`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-059 — El texto 1.500 se interpreta como mil quinientos

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-059-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-059.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2: fecha Excel `01/09/2026` | Gasto | texto `1.500` | ARS | vacía | Otros | Efectivo | 1 | vacía | Fórmula.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-059-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-059.xlsx`. | `Fila 2` está `Lista` y muestra exactamente `$1.500,00`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-060 — El texto 1234.56 se interpreta con dos decimales

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-060-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-060.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2: fecha Excel `01/09/2026` | Gasto | texto `1234.56` | ARS | vacía | Otros | Efectivo | 1 | vacía | Fórmula.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-060-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-060.xlsx`. | `Fila 2` está `Lista` y muestra exactamente `$1.234,56`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-061 — La fórmula 0,1 por 3 se redondea a quince dígitos

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-061-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-061.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2: fecha Excel `01/09/2026` | Gasto | fórmula `=0,1*3`, valor guardado `0,30000000000000004` | ARS | vacía | Otros | Efectivo | 1 | vacía | Fórmula.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-061-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-061.xlsx`. | `Fila 2` está `Lista` y muestra exactamente `$0,30`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-062 — La fórmula 100 dividido 3 muestra F9

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-7 · F9 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-062-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-062.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2: fecha Excel `01/09/2026` | Gasto | fórmula `=100/3`, valor guardado `33,3333333333333` | ARS | vacía | Otros | Efectivo | 1 | vacía | Fórmula.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-062-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-062.xlsx`. | `Fila 2` está `Con error` y muestra exactamente `El monto admite hasta 2 decimales`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-063 — El resumen del archivo de ejemplo suma solo las siete filas listas

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-063-001@example.com`; sesión cerrada.

**Datos de prueba:** Copia exacta de IMP-DATA-01, incluida la fila 12 vacía.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-063-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `importar-excel-ejemplo.xlsx`. | Se ve exactamente `Vas a importar 7 movimientos: $324.915,50 en gastos y $850.000,00 en ingresos (en pesos).` |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-064 — El filtro muestra solo las cuatro filas con error

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-064-001@example.com`; sesión cerrada.

**Datos de prueba:** Copia exacta de IMP-DATA-01, incluida la fila 12 vacía.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-064-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `importar-excel-ejemplo.xlsx`. | El filtro `Ver solo filas con error` está apagado y se ven 11 tarjetas. |
| 11 | Hacer click en `Ver solo filas con error`. | Queda encendido; solo se ven `Fila 7`, `Fila 8`, `Fila 9` y `Fila 10`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-065 — El filtro está deshabilitado cuando no hay errores

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-065-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-065.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = V.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-065-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-065.xlsx`. | `Ver solo filas con error` está apagado y deshabilitado; `Fila 2` está `Lista`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-066 — Elegir otro archivo no persiste filas revisadas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-10 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-066-001@example.com`; sesión cerrada; PR-04 token listo.

**Datos de prueba:** `cp-imp-066.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = V.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-066-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-066.xlsx`. | Se abre `2 Revisión` con una fila lista. |
| 11 | Hacer click en `Elegir otro archivo`. | Vuelve a `1 Archivo`; no aparece nombre ni resumen. |
| 12 | Ejecutar IMP-PREP-04. | Transacciones e imputaciones responden HTTP 200 con `[]`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-067 — Recargar en Revisión vuelve a Archivo sin persistir

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-10 · C14 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-067-001@example.com`; sesión cerrada; PR-04 token listo.

**Datos de prueba:** `cp-imp-067.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = V.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-067-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-067.xlsx`. | Se abre `2 Revisión` con el archivo. |
| 11 | Recargar la página una vez. | Se ve `1 Archivo`; no aparece el archivo ni su resumen. |
| 12 | Ejecutar IMP-PREP-04. | Transacciones e imputaciones responden HTTP 200 con `[]`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-068 — Cero filas listas deshabilita Importar 0 movimientos

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-068-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-068.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = V salvo Monto `0`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-068-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-068.xlsx`. | Se ve `Importar 0 movimientos` deshabilitado y `No hay filas listas para importar`. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-069 — Una fila lista usa los plurales singulares

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-11 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-069-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-069.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = V.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-069-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-069.xlsx`. | Se ve exactamente `1 fila leída · 1 lista para importar · 0 con error`, `Vas a importar 1 movimiento: $1.000,00 en gastos y $0,00 en ingresos (en pesos).` y `Importar 1 movimiento` habilitado. |

**Post-condición:** No se creó ninguna transacción; conservar el archivo como evidencia.

### CP-IMP-070 — Confirmar importa solo las filas listas con todos sus campos

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-070-001@example.com`; sesión cerrada; PR-04 listo.

**Datos de prueba:** `cp-imp-070.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`. Fila 2: `01/09/2026 | Gasto | 1000 | ARS | vacía | Otros | Efectivo | 1 | vacía | Nota ficticia`. Fila 3: `02/09/2026 | Ingreso | 2000 | ARS | vacía | vacía | Cuenta bancaria | 1 | vacía | vacía`. Fila 4 igual a fila 2 salvo Monto `0` y Nota `No importar`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-070-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-070.xlsx`. | `3 filas leídas · 2 listas para importar · 1 con error`. |
| 11 | Hacer click en `Importar 2 movimientos`. | Se ve `Se importaron 2 de 3 filas.`, `$1.000,00 en gastos y $2.000,00 en ingresos (en pesos).` y `Fila 4: El monto debe ser mayor a cero`. |
| 12 | Ejecutar IMP-PREP-04. | Existen exactamente las transacciones de filas 2 y 3 con sus nueve campos exactos; descripción de fila 3 es null; no existe transacción para fila 4. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-071 — Una nota vacía se guarda como descripción nula

| Campo | Contenido |
|---|---|
| Historia · criterio | US-77 · CA-1 · US-08 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-071-001@example.com`; sesión cerrada; PR-04 listo.

**Datos de prueba:** `cp-imp-071.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = V con Nota vacía.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-071-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-071.xlsx`. | Una fila lista. |
| 11 | Hacer click en `Importar 1 movimiento`. | Se ve `Se importó 1 de 1 fila.` |
| 12 | Ejecutar IMP-PREP-04. | La única transacción tiene `description:null`. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-072 — La compra de 240.000 en seis cuotas crea seis imputaciones exactas

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-072-001@example.com`; sesión cerrada; PR-04 listo.

**Datos de prueba:** `cp-imp-072.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2: `03/09/2026 | Gasto | 240000 | ARS | vacía | Indumentaria | Tarjeta de crédito | 6 | vacía | Campera ficticia`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-072-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-072.xlsx`. | `Fila 2` está `Lista`; muestra `$240.000,00` y `6 cuotas`. |
| 11 | Hacer click en `Importar 1 movimiento`. | Se ve `Se importó 1 de 1 fila.` y `$240.000,00 en gastos y $0,00 en ingresos (en pesos).` |
| 12 | Ejecutar IMP-PREP-04. | La transacción tiene `amount=240000.00`, seis imputaciones `40000.00`, números 1–6, en `2026-09-01` a `2027-02-01`; suman `240000.00`. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-073 — El archivo de ejemplo produce el resultado y destino exactos

| Campo | Contenido |
|---|---|
| Historia · criterio | US-77 · CA-3 |
| Invariante | I1' |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-073-001@example.com`; sesión cerrada.

**Datos de prueba:** Copia exacta de IMP-DATA-01, incluida la fila 12 vacía.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-073-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `importar-excel-ejemplo.xlsx`. | Se ve `Importar 7 movimientos`. |
| 11 | Hacer click en `Importar 7 movimientos`. | Se ve `Se importaron 7 de 11 filas.`, `$324.915,50 en gastos y $850.000,00 en ingresos (en pesos).`, y las cuatro líneas exactas de filas 7–10. |
| 12 | Inspeccionar Resultado con DevTools Elements. | Existen `import-result-title`, `import-result-amounts`, `import-result-rejected`, `import-result-row-7`, `import-result-row-8`, `import-result-row-9`, `import-result-row-10`, `import-go-transactions` e `import-again`; no existe `import-result-already`. |
| 13 | Hacer click en `Ver en Movimientos`. | La URL termina en `/transactions?period=2026-09`. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-074 — Un rechazo tardío de categoría no impide las otras filas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-77 · CA-4 · C6 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | CP-IMP-077 |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-074-001@example.com`; sesión cerrada; segunda sesión del mismo usuario disponible.

**Datos de prueba:** Copia exacta de IMP-DATA-01, incluida la fila 12 vacía.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-074-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `importar-excel-ejemplo.xlsx`. | Fila 6 está `Lista` con `Transporte`. |
| 11 | En la segunda sesión, archivar `Transporte`. | Ajustes muestra la categoría archivada. |
| 12 | En la primera sesión, hacer click en `Importar 7 movimientos`. | Se ve `Se importaron 6 de 11 filas.`, `$321.715,50 en gastos y $850.000,00 en ingresos (en pesos).` y `Fila 6: No existe la categoría «Transporte» o está archivada`; las demás válidas se importan. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-075 — Importar no cambia la cuenta precargada de Registrar

| Campo | Contenido |
|---|---|
| Historia · criterio | US-77 · CA-5 · US-07 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-075-001@example.com`; mediante PR-06 cargar monto `100`, categoría `Otros`, cuenta `Cuenta bancaria`, fecha `01/09/2026` y guardar el gasto; cerrar sesión.

**Datos de prueba:** `cp-imp-075.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = V con Cuenta `Efectivo`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-075-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-075.xlsx`. | Una fila lista. |
| 11 | Hacer click en `Importar 1 movimiento`. | Se ve Resultado. |
| 12 | Hacer click en `Registrar`. | Se abre Registrar. |
| 13 | Escribir `10` en el monto. | El monto muestra `10` y se habilita `Siguiente`. |
| 14 | Hacer click en `Siguiente`. | Se abre `¿En qué?`. |
| 15 | Hacer click en la categoría `Otros`. | Se abre `Revisá y guardá`. |
| 16 | Observar la sección `Cuenta`. | Está seleccionada `Cuenta bancaria`, no `Efectivo`. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-076 — Quinientas filas de doce cuotas terminan en menos de diez segundos

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-076-001@example.com`; deploy Vercel/Supabase hosteado; cronómetro de 0,1 s.

**Datos de prueba:** `cp-imp-076.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`. Filas 2–501: `01/09/2026 | Gasto | 120 | ARS | vacía | Otros | Tarjeta de crédito | 12 | vacía | Carga <n>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-076-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-076.xlsx`. | `500 filas leídas · 500 listas para importar · 0 con error`. |
| 11 | Iniciar el cronómetro. | El cronómetro comienza en `0,0 s`. |
| 12 | Hacer click en `Importar 500 movimientos`. | Muestra `Importando…` deshabilitado. |
| 13 | Detener el cronómetro al aparecer Resultado. | El cronómetro se detiene. |
| 14 | Leer el cronómetro y el título del resultado. | El tiempo es menor a `10,0 s` y se ve `Se importaron 500 de 500 filas.` |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-077 — La RPC procesa una válida y rechaza tres inválidas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-77 · CA-7 · C6 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | API |
| Caso par | CP-IMP-028, CP-IMP-029, CP-IMP-041, CP-IMP-074 |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-077-001@example.com`; PR-04 pasos 1–2.

**Datos de prueba:** body literal `{"p_import_id":"77777777-0000-4000-8000-000000000077","p_rows":[{"row":1,"type":"expense","amount":"1000.00","currency":"ARS","fx_rate":null,"category_id":"<uuid Otros>","account_id":"<uuid Efectivo>","installments_count":1,"occurred_on":"2026-09-03","description":"válida"},{"row":2,"type":"expense","amount":"0","currency":"ARS","fx_rate":null,"category_id":"<uuid Otros>","account_id":"<uuid Efectivo>","installments_count":1,"occurred_on":"2026-09-03","description":null},{"row":3,"type":"expense","amount":"500.00","currency":"ARS","fx_rate":null,"category_id":"<uuid Otros>","installments_count":1,"occurred_on":"2026-09-03","description":null},{"row":4,"type":"expense","amount":"abc","currency":"ARS","fx_rate":null,"category_id":"<uuid Otros>","account_id":"<uuid Efectivo>","installments_count":1,"occurred_on":"2026-09-03","description":null}]}`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar IMP-PREP-03 con el body literal de Datos. | HTTP 200; `sent_rows:4`, `imported_rows:1`; fila 1 tiene `status:"imported"` y un `transaction_id`; fila 2 tiene `status:"rejected"`, `error_code:"23514"`, `error_message:"I4: el monto debe ser mayor a cero"`; fila 3 tiene `status:"rejected"`, `error_code:"23503"`, `error_message:"la cuenta no existe, no es tuya o está archivada"`; fila 4 tiene `status:"rejected"` y `error_code:"22P02"`. |
| 2 | Ejecutar IMP-PREP-04. | Existe solo la transacción e imputación de fila 1. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-078 — La RPC rechaza un lote vacío

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-078-001@example.com`; PR-04.

**Datos de prueba:** Body `{"p_import_id":"78787878-0000-4000-8000-000000000078","p_rows":[]}`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar el POST exacto. | HTTP no exitoso de clase 4xx; no hay resultado de lote; el número de status HTTP y el body se registran como evidencia porque la especificación no fija su mapeo ni un `code`. |
| 2 | Ejecutar IMP-PREP-04. | No hay transacciones, imputaciones ni import con ese UUID. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-079 — La RPC rechaza un lote de 501 elementos

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-079-001@example.com`; PR-04.

**Datos de prueba:** UUID `79797979-0000-4000-8000-000000000079`; 501 objetos como {"row":1,"type":"expense","amount":"1000.00","currency":"ARS","fx_rate":null,"category_id":"<uuid Otros>","account_id":"<uuid Efectivo>","installments_count":1,"occurred_on":"2026-09-03","description":"válida"}, con `row` 1–501.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar IMP-PREP-03. | HTTP no exitoso de clase 4xx; no hay resultado de lote; el número de status HTTP y el body se registran como evidencia porque la especificación no fija su mapeo ni un `code`. |
| 2 | Ejecutar IMP-PREP-04. | No hay transacciones, imputaciones ni import. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-080 — El rol anon no puede ejecutar import_transactions

| Campo | Contenido |
|---|---|
| Historia · criterio | US-77 · CA-9 · C7 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | API |
| Caso par | CP-IMP-002 |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** Conocer URL y anon key; sin sesión.

**Datos de prueba:** body `{"p_import_id":"80808080-0000-4000-8000-000000000080","p_rows":[{"row":1,"type":"expense","amount":"1000.00","currency":"ARS","fx_rate":null,"category_id":"00000000-0000-4000-8000-000000000001","account_id":"00000000-0000-4000-8000-000000000002","installments_count":1,"occurred_on":"2026-09-03","description":"válida"}]}`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/import_transactions` con `apikey: <ANON_KEY>`, `Authorization: Bearer <ANON_KEY>`, `Content-Type: application/json` y el body de Datos. | HTTP no exitoso de clase 4xx; JSON `code:"42501"` y mensaje de permiso denegado; no se crea nada; el número de status HTTP se registra como evidencia porque la especificación no fija su mapeo. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-081 — Otro usuario no ve transacciones ni imports ajenos

| Campo | Contenido |
|---|---|
| Historia · criterio | US-77 · CA-9 · C7 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | API |
| Caso par | CP-IMP-070 |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 para A con `qa+cp-imp-081-001@example.com` y para B con `qa+cp-imp-081-002@example.com`; PR-04 para ambos. Con `<TOKEN-A>`, ejecutar IMP-PREP-03 usando el body de Datos y guardar el `transaction_id` como `<ID-A>`.

**Datos de prueba:** UUID `81818181-0000-4000-8000-000000000081`; body `{"p_import_id":"81818181-0000-4000-8000-000000000081","p_rows":[{"row":1,"type":"expense","amount":"1000.00","currency":"ARS","fx_rate":null,"category_id":"<uuid Otros de A>","account_id":"<uuid Efectivo de A>","installments_count":1,"occurred_on":"2026-09-03","description":"Solo A"}]}`. Las verificaciones usan `<TOKEN-B>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Con token B, ejecutar `GET <SUPABASE_URL>/rest/v1/transactions?select=id&id=eq.<ID-A>` con headers de PR-04 y sin body. | HTTP 200 y cuerpo exacto `[]`. |
| 2 | Con token B, ejecutar `GET <SUPABASE_URL>/rest/v1/imports?select=id&id=eq.81818181-0000-4000-8000-000000000081` con headers de PR-04 y sin body. | HTTP 200 y cuerpo exacto `[]`. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-082 — Dos clicks rápidos generan una sola llamada y transacción

| Campo | Contenido |
|---|---|
| Historia · criterio | US-78 · CA-1 · NFR-10 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-082-001@example.com`; DevTools Network con Preserve log.

**Datos de prueba:** `cp-imp-082.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = V.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-082-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-082.xlsx`. | Una fila lista. |
| 11 | Hacer doble click rápido en `Importar 1 movimiento`. | `import-submit` muestra `Importando…` deshabilitado; `import-change-file` y `import-guide-open` están deshabilitados; Network registra una sola llamada a `/rpc/import_transactions`. |
| 12 | Esperar Resultado. | Se ve `Se importó 1 de 1 fila.`; existe una sola transacción. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-083 — Reintento tras respuesta perdida reconoce lo guardado

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-083-001@example.com`; PR-04 pasos 1–2. Antes de abrir el navegador, ejecutar IMP-PREP-03 con el body literal `{"p_import_id":"83838383-0000-4000-8000-000000000083","p_rows":[{"row":2,"type":"expense","amount":"1000.00","currency":"ARS","fx_rate":null,"category_id":"<uuid Otros>","account_id":"<uuid Efectivo>","installments_count":1,"occurred_on":"2026-09-01","description":"Compra ficticia"}]}`. Esperado: HTTP 200, `already_imported:false`, `sent_rows:1`, `imported_rows:1` y fila 2 `status:"imported"`. Ejecutar IMP-PREP-04: existe exactamente una transacción y una imputación para ese UUID.

**Datos de prueba:** `cp-imp-083.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = V. UUID fijo `83838383-0000-4000-8000-000000000083`. El registro preexistente representa el commit confirmado cuya respuesta perdió el cliente; el primer intento UI se fuerza sin conexión y el reintento consulta ese mismo UUID.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-083-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Presionar F12. | Se abre DevTools. |
| 10 | Hacer click en la pestaña `Console`. | Se ve el prompt de la consola. |
| 11 | Ejecutar IMP-PREP-06. | La consola devuelve exactamente `83838383-0000-4000-8000-000000000083`. |
| 12 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 13 | Elegir `cp-imp-083.xlsx`. | Se ve una fila `Lista` y el botón `Importar 1 movimiento`. |
| 14 | En DevTools, abrir `Network conditions` y seleccionar `Offline`. | DevTools muestra `Offline`. |
| 15 | Hacer click en `Importar 1 movimiento`. | Se muestra exactamente `No pudimos confirmar la importación. Puede que se haya guardado: tocá Reintentar y te decimos qué pasó.` y el botón `Reintentar`; la revisión y el nombre del archivo siguen visibles. |
| 16 | En DevTools, cambiar `Offline` por `No throttling`. | DevTools muestra `No throttling`. |
| 17 | Hacer click en `Reintentar`. | Se abre el paso 3 y `import-result-already` muestra exactamente `Esta importación ya se había guardado.`. |
| 18 | Ejecutar IMP-PREP-04. | Hay exactamente una transacción de `1000.00` ARS, una imputación de `1000.00` para `2026-09-01` y un import con UUID `83838383-0000-4000-8000-000000000083`; no se creó un duplicado. |
| 19 | Ejecutar en Console la limpieza indicada en IMP-PREP-06. | La consola devuelve `true`; `crypto.randomUUID()` vuelve a generar UUID variables. |

**Post-condición:** Dejar Network en `No throttling`, cerrar DevTools y conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-084 — Reintento tras corte previo al envío importa una sola vez

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-084-001@example.com`; Network.

**Datos de prueba:** `cp-imp-084.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = V.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-084-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-084.xlsx`. | Una fila lista. |
| 11 | Poner Network Offline. | Offline. |
| 12 | Hacer click en Importar. | Mensaje de no confirmación; no hay transacción. |
| 13 | Poner Online. | Online. |
| 14 | Hacer click en `Reintentar`. | `Se importó 1 de 1 fila.` sin aviso de ya guardado; una transacción. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-085 — Dos llamadas API con el mismo import_id son idempotentes

| Campo | Contenido |
|---|---|
| Historia · criterio | US-78 · CA-2 · ADR-035 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | API |
| Caso par | CP-IMP-083, CP-IMP-084 |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-085-001@example.com`; PR-04.

**Datos de prueba:** UUID `85858585-0000-4000-8000-000000000085`; una fila {"row":1,"type":"expense","amount":"1000.00","currency":"ARS","fx_rate":null,"category_id":"<uuid Otros>","account_id":"<uuid Efectivo>","installments_count":1,"occurred_on":"2026-09-03","description":"válida"}.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar IMP-PREP-03. | HTTP 200; `already_imported:false`; guardar transaction_id. |
| 2 | Repetir la misma llamada. | HTTP 200; `already_imported:true`; mismo transaction_id y resultado. |
| 3 | Ejecutar IMP-PREP-04. | Una transacción, una imputación y un import. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-086 — Sin respuesta conserva Revisión

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-086-001@example.com`; sesión cerrada; DevTools Network abierto en Online.

**Datos de prueba:** `cp-imp-086.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = V.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-086-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-086.xlsx`. | Una fila lista. |
| 11 | Cambiar Network a Offline. | DevTools muestra Offline. |
| 12 | Hacer click en `Importar 1 movimiento`. | Sigue en Revisión; muestra exactamente `No pudimos confirmar la importación. Puede que se haya guardado: tocá Reintentar y te decimos qué pasó.`; botón `Reintentar`. |
| 13 | Ejecutar IMP-PREP-04 después de volver Network a Online. | No hay transacciones ni imputaciones. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-087 — Sesión vencida ofrece volver a entrar

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-087-001@example.com`; DevTools para interceptar HTTP 401 con `42501`.

**Datos de prueba:** `cp-imp-087.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = V.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-087-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-087.xlsx`. | Una fila lista. |
| 11 | Hacer click en `Importar 1 movimiento`. | Sigue en Revisión; muestra exactamente `Tu sesión venció y no se importó ninguna fila. Volvé a entrar y subí el archivo de nuevo.`; botón `Volver a entrar`. |
| 12 | Ejecutar IMP-PREP-04. | No hay transacciones ni imputaciones. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-088 — Timeout de base informa lote grande

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-088-001@example.com`; DevTools para interceptar HTTP 400 con `57014`.

**Datos de prueba:** `cp-imp-088.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = V.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-088-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-088.xlsx`. | Una fila lista. |
| 11 | Hacer click en `Importar 1 movimiento`. | Sigue en Revisión; muestra exactamente `La importación tardó demasiado y no se importó ninguna fila. Dividí el archivo en partes más chicas.`; botón `Reintentar`. |
| 12 | Ejecutar IMP-PREP-04. | No hay transacciones ni imputaciones. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-089 — Otro error usa mensaje genérico

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

**Pre-requisitos:** PR-01 con `qa+cp-imp-089-001@example.com`; DevTools para interceptar HTTP 500 con `XX000`.

**Datos de prueba:** `cp-imp-089.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = V.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-089-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-089.xlsx`. | Una fila lista. |
| 11 | Hacer click en `Importar 1 movimiento`. | Sigue en Revisión; muestra exactamente `No se importó ninguna fila. Probá de nuevo en un rato.`; botón `Reintentar`. |
| 12 | Ejecutar IMP-PREP-04. | No hay transacciones ni imputaciones. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-090 — Quedarme conserva el estado pendiente

| Campo | Contenido |
|---|---|
| Historia · criterio | US-78 · CA-4 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-090-001@example.com`; sesión cerrada; DevTools Network abierto en Online.

**Datos de prueba:** `cp-imp-090.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = V.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-090-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-090.xlsx`. | Una fila lista. |
| 11 | Cambiar Network a Offline. | DevTools muestra Offline. |
| 12 | Hacer click en `Importar 1 movimiento`. | Aparece el mensaje exacto de no confirmación. |
| 13 | Hacer click en `Registrar`. | `import-leave-dialog` muestra `¿Salir sin saber si se importó?`, el texto `Puede que la importación se haya guardado. Si salís, revisá Movimientos antes de volver a importar este archivo.`, `import-leave-stay` y `import-leave-confirm`. |
| 14 | Hacer click en `Quedarme`. | Sigue `/import`, con archivo, resumen, mensaje y `Reintentar`. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-091 — Salir igual navega al destino solicitado

| Campo | Contenido |
|---|---|
| Historia · criterio | US-78 · CA-4 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-091-001@example.com`; sesión cerrada; DevTools Network abierto en Online.

**Datos de prueba:** `cp-imp-091.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = V.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-091-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-091.xlsx`. | Una fila lista. |
| 11 | Cambiar Network a Offline. | DevTools muestra Offline. |
| 12 | Hacer click en `Importar 1 movimiento`. | Aparece el mensaje exacto de no confirmación. |
| 13 | Hacer click en `Registrar`. | Se abre el diálogo `¿Salir sin saber si se importó?`. |
| 14 | Hacer click en `Salir igual`. | Navega a `/register`. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-092 — Recargar con importación incierta muestra aviso nativo

| Campo | Contenido |
|---|---|
| Historia · criterio | US-78 · CA-4 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | No |

**Pre-requisitos:** PR-01 con `qa+cp-imp-092-001@example.com`; sesión cerrada; DevTools Network abierto en Online.

**Datos de prueba:** `cp-imp-092.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = V.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-092-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-092.xlsx`. | Una fila lista. |
| 11 | Cambiar Network a Offline. | DevTools muestra Offline. |
| 12 | Hacer click en `Importar 1 movimiento`. | Aparece el mensaje exacto de no confirmación. |
| 13 | Recargar la pestaña. | El navegador muestra su aviso nativo de cambios sin guardar; no recarga aún. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-093 — Compra empezada conserva solo tres cuotas desde H

| Campo | Contenido |
|---|---|
| Historia · criterio | US-80 · CA-2 · ADR-039 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-093-001@example.com`; reloj de dominio `12/10/2026`; PR-04.

**Datos de prueba:** `cp-imp-093.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = 10/06/2026 | Gasto | 120000 | ARS | vacía | Otros | Tarjeta de crédito | 6 | 3 | Heladera.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir incógnito. | Ventana sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-093-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso 1. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre selector. |
| 10 | Elegir `cp-imp-093.xlsx`. | Fila 2 `Lista`; `Faltan 3 de 6 cuotas ($60.000,00)` en `import-row-2-pending`. |
| 11 | Hacer click en `Importar 1 movimiento`. | Resultado: `Se importó 1 de 1 fila.` y `$60.000,00 en gastos...` |
| 12 | Ejecutar IMP-PREP-04. | Transacción: amount `60000.00`, installments_count 6, installments_paid 3, occurred_on `2026-06-10`, first_period `2026-10-01`; cuotas 4–6 de `20000.00` en octubre–diciembre. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-094 — Movimientos muestra 4/6 a 6/6 solo desde H

| Campo | Contenido |
|---|---|
| Historia · criterio | US-80 · CA-3 · C11 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-094-001@example.com`; reloj `12/10/2026`; importar el archivo del caso.

**Datos de prueba:** `cp-imp-094.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = 10/06/2026 | Gasto | 120000 | ARS | vacía | Otros | Tarjeta de crédito | 6 | 3 | Heladera.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir incógnito. | Ventana sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-094-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso 1. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre selector. |
| 10 | Elegir `cp-imp-094.xlsx`. | Fila lista. |
| 11 | Hacer click en `Importar 1 movimiento`. | Resultado. |
| 12 | Hacer click en `Ver en Movimientos`. | URL `/transactions?period=2026-10`; muestra `4/6`, `$20.000,00`. |
| 13 | Cambiar período a noviembre de 2026. | Muestra `5/6`, `$20.000,00`. |
| 14 | Cambiar período a diciembre de 2026. | Muestra `6/6`, `$20.000,00`. |
| 15 | Cambiar el período a junio de 2026. | La compra no aparece. |
| 16 | Cambiar el período a julio de 2026. | La compra no aparece. |
| 17 | Cambiar el período a agosto de 2026. | La compra no aparece. |
| 18 | Cambiar el período a septiembre de 2026. | La compra no aparece. |
| 19 | Cambiar el período a enero de 2027. | La compra no aparece. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-095 — El resto queda en la última cuota pendiente

| Campo | Contenido |
|---|---|
| Historia · criterio | US-80 · CA-4 · ADR-039 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-095-001@example.com`; reloj `12/10/2026`; PR-04.

**Datos de prueba:** `cp-imp-095.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = 15/09/2026 | Gasto | 100000 | ARS | vacía | Otros | Tarjeta de crédito | 3 | 2 | Resto.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir incógnito. | Ventana sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-095-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso 1. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre selector. |
| 10 | Elegir `cp-imp-095.xlsx`. | Muestra `Faltan 2 de 3 cuotas ($66.666,67)`. |
| 11 | Hacer click en `Importar 1 movimiento`. | Resultado suma `$66.666,67`. |
| 12 | Ejecutar IMP-PREP-04. | Transacción amount `66666.67`; cuota 2/3 `33333.33` en `2026-10-01`; 3/3 `33333.34` en `2026-11-01`; suma exacta `66666.67`. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-096 — P igual a N desplaza todas las cuotas a H

| Campo | Contenido |
|---|---|
| Historia · criterio | US-80 · CA-5 · ADR-039 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-096-001@example.com`; reloj `12/10/2026`; PR-04.

**Datos de prueba:** `cp-imp-096.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = 15/09/2026 | Gasto | 120000 | ARS | vacía | Otros | Tarjeta de crédito | 6 | 6 | Todas pendientes.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir incógnito. | Ventana sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-096-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso 1. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre selector. |
| 10 | Elegir `cp-imp-096.xlsx`. | Muestra `Faltan 6 de 6 cuotas ($120.000,00)`. |
| 11 | Hacer click en Importar. | Resultado suma `$120.000,00`. |
| 12 | Ejecutar IMP-PREP-04. | amount `120000.00`, installments_paid 0, first_period `2026-10-01`; cuotas 1–6 de `20000.00` entre octubre 2026 y marzo 2027. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-097 — Cuotas pendientes vacía conserva calendario normal

| Campo | Contenido |
|---|---|
| Historia · criterio | US-80 · CA-6 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-097-001@example.com`; reloj `12/10/2026`; PR-04.

**Datos de prueba:** `cp-imp-097.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = 15/09/2026 | Gasto | 240000 | ARS | vacía | Otros | Tarjeta de crédito | 6 | vacía | Normal.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir incógnito. | Ventana sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-097-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso 1. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre selector. |
| 10 | Elegir `cp-imp-097.xlsx`. | Fila lista; muestra `6 cuotas`, no texto `Faltan`. |
| 11 | Hacer click en Importar. | Resultado suma `$240.000,00`. |
| 12 | Ejecutar IMP-PREP-04. | Seis cuotas de `40000.00` desde `2026-09-01` a `2027-02-01`; installments_paid null. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-098 — Sin columna Cuotas pendientes conserva calendario normal

| Campo | Contenido |
|---|---|
| Historia · criterio | US-80 · CA-6 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-098-001@example.com`; reloj `12/10/2026`; PR-04.

**Datos de prueba:** `cp-imp-098.xlsx`: fila 1: `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Nota`; fila 2: `15/09/2026 | Gasto | 240000 | ARS | vacía | Otros | Tarjeta de crédito | 6 | Normal`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir incógnito. | Ventana sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-098-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso 1. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre selector. |
| 10 | Elegir `cp-imp-098.xlsx`. | Fila lista; `6 cuotas`. |
| 11 | Hacer click en Importar. | Resultado suma `$240.000,00`. |
| 12 | Ejecutar IMP-PREP-04. | Seis cuotas de `40000.00`, septiembre 2026 a febrero 2027; installments_paid null. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-099 — F19 con Cuotas vacía

| Campo | Contenido |
|---|---|
| Historia · criterio | US-80 · CA-7 · F19 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (sin oráculo API exacto para esta representación) |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-099-001@example.com`; reloj `12/10/2026`.

**Datos de prueba:** `cp-imp-099.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = 01/09/2026 | Gasto | 120000 | ARS | vacía | Otros | Tarjeta de crédito | vacía | 1 | Regla.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir incógnito. | Ventana sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-099-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso 1. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre selector. |
| 10 | Elegir `cp-imp-099.xlsx`. | Fila 2 `Con error`; muestra exactamente `Las cuotas pendientes solo van en una compra en cuotas`; importar está deshabilitado. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-100 — F19 con Cuotas igual a uno

| Campo | Contenido |
|---|---|
| Historia · criterio | US-80 · CA-7 · F19 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | CP-IMP-120 |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-100-001@example.com`; reloj `12/10/2026`.

**Datos de prueba:** `cp-imp-100.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = 01/09/2026 | Gasto | 120000 | ARS | vacía | Otros | Tarjeta de crédito | 1 | 1 | Regla.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir incógnito. | Ventana sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-100-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso 1. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre selector. |
| 10 | Elegir `cp-imp-100.xlsx`. | Fila 2 `Con error`; muestra exactamente `Las cuotas pendientes solo van en una compra en cuotas`; importar está deshabilitado. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-101 — F20 con pendientes cero

| Campo | Contenido |
|---|---|
| Historia · criterio | US-80 · CA-8 · F20 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (sin oráculo API exacto para esta representación) |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-101-001@example.com`; reloj `12/10/2026`.

**Datos de prueba:** `cp-imp-101.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = 01/09/2026 | Gasto | 120000 | ARS | vacía | Otros | Tarjeta de crédito | 6 | 0 | Regla.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir incógnito. | Ventana sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-101-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso 1. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre selector. |
| 10 | Elegir `cp-imp-101.xlsx`. | Fila 2 `Con error`; muestra exactamente `Las cuotas pendientes van de 1 a 6`; importar está deshabilitado. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-102 — F20 con pendientes menos uno

| Campo | Contenido |
|---|---|
| Historia · criterio | US-80 · CA-8 · F20 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (sin oráculo API exacto para esta representación) |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-102-001@example.com`; reloj `12/10/2026`.

**Datos de prueba:** `cp-imp-102.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = 01/09/2026 | Gasto | 120000 | ARS | vacía | Otros | Tarjeta de crédito | 6 | -1 | Regla.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir incógnito. | Ventana sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-102-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso 1. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre selector. |
| 10 | Elegir `cp-imp-102.xlsx`. | Fila 2 `Con error`; muestra exactamente `Las cuotas pendientes van de 1 a 6`; importar está deshabilitado. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-103 — F20 con pendientes siete

| Campo | Contenido |
|---|---|
| Historia · criterio | US-80 · CA-8 · F20 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | CP-IMP-118 |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-103-001@example.com`; reloj `12/10/2026`.

**Datos de prueba:** `cp-imp-103.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = 01/09/2026 | Gasto | 120000 | ARS | vacía | Otros | Tarjeta de crédito | 6 | 7 | Regla.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir incógnito. | Ventana sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-103-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso 1. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre selector. |
| 10 | Elegir `cp-imp-103.xlsx`. | Fila 2 `Con error`; muestra exactamente `Las cuotas pendientes van de 1 a 6`; importar está deshabilitado. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-104 — F20 con pendientes decimal

| Campo | Contenido |
|---|---|
| Historia · criterio | US-80 · CA-8 · F20 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (sin oráculo API exacto para esta representación) |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-104-001@example.com`; reloj `12/10/2026`.

**Datos de prueba:** `cp-imp-104.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = 01/09/2026 | Gasto | 120000 | ARS | vacía | Otros | Tarjeta de crédito | 6 | texto `2,5` | Regla.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir incógnito. | Ventana sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-104-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso 1. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre selector. |
| 10 | Elegir `cp-imp-104.xlsx`. | Fila 2 `Con error`; muestra exactamente `Las cuotas pendientes van de 1 a 6`; importar está deshabilitado. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-105 — F20 con pendientes textual

| Campo | Contenido |
|---|---|
| Historia · criterio | US-80 · CA-8 · F20 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (sin oráculo API exacto para esta representación) |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-105-001@example.com`; reloj `12/10/2026`.

**Datos de prueba:** `cp-imp-105.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = 01/09/2026 | Gasto | 120000 | ARS | vacía | Otros | Tarjeta de crédito | 6 | texto `dos` | Regla.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir incógnito. | Ventana sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-105-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso 1. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre selector. |
| 10 | Elegir `cp-imp-105.xlsx`. | Fila 2 `Con error`; muestra exactamente `Las cuotas pendientes van de 1 a 6`; importar está deshabilitado. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-106 — F20 acepta el mínimo pendiente uno

| Campo | Contenido |
|---|---|
| Historia · criterio | US-80 · CA-8 · F20 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Análisis de valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-106-001@example.com`; reloj `12/10/2026`.

**Datos de prueba:** `cp-imp-106.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = 01/05/2026 | Gasto | 120000 | ARS | vacía | Otros | Tarjeta de crédito | 6 | 1 | Mínimo.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir incógnito. | Ventana sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-106-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso 1. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre selector. |
| 10 | Elegir `cp-imp-106.xlsx`. | Fila 2 `Lista`; muestra `Falta 1 de 6 cuotas ($20.000,00)`. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-107 — F20 acepta el máximo pendiente seis

| Campo | Contenido |
|---|---|
| Historia · criterio | US-80 · CA-8 · F20 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Análisis de valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-107-001@example.com`; reloj `12/10/2026`.

**Datos de prueba:** `cp-imp-107.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = 01/09/2026 | Gasto | 120000 | ARS | vacía | Otros | Tarjeta de crédito | 6 | 6 | Máximo.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir incógnito. | Ventana sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-107-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso 1. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre selector. |
| 10 | Elegir `cp-imp-107.xlsx`. | Fila 2 `Lista`; muestra `Faltan 6 de 6 cuotas ($120.000,00)`. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-108 — F21 acepta K igual a meses transcurridos

| Campo | Contenido |
|---|---|
| Historia · criterio | US-80 · CA-9 · F21 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Análisis de valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-108-001@example.com`; reloj `12/10/2026`.

**Datos de prueba:** `cp-imp-108.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = 15/07/2026 | Gasto | 120000 | ARS | vacía | Otros | Tarjeta de crédito | 6 | 3 | Límite válido.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir incógnito. | Ventana sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-108-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso 1. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre selector. |
| 10 | Elegir `cp-imp-108.xlsx`. | Fila 2 `Lista`; muestra `Faltan 3 de 6 cuotas ($60.000,00)`. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-109 — F21 rechaza K un mes sobre lo posible

| Campo | Contenido |
|---|---|
| Historia · criterio | US-80 · CA-9 · F21 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Análisis de valores límite |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-109-001@example.com`; reloj `12/10/2026`.

**Datos de prueba:** `cp-imp-109.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = 15/08/2026 | Gasto | 120000 | ARS | vacía | Otros | Tarjeta de crédito | 6 | 3 | Límite inválido.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir incógnito. | Ventana sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-109-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso 1. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre selector. |
| 10 | Elegir `cp-imp-109.xlsx`. | Muestra exactamente `Con esa fecha todavía no puede haber 3 cuotas pagadas`. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-110 — F21 usa singular para una cuota pagada imposible

| Campo | Contenido |
|---|---|
| Historia · criterio | US-80 · CA-9 · F21 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-110-001@example.com`; reloj `12/10/2026`.

**Datos de prueba:** `cp-imp-110.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = 12/10/2026 | Gasto | 120000 | ARS | vacía | Otros | Tarjeta de crédito | 6 | 5 | Singular.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir incógnito. | Ventana sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-110-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso 1. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre selector. |
| 10 | Elegir `cp-imp-110.xlsx`. | Muestra exactamente `Con esa fecha todavía no puede haber 1 cuota pagada`. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-111 — F15 oculta F20 con cuenta Efectivo

| Campo | Contenido |
|---|---|
| Historia · criterio | US-80 · CA-10 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-111-001@example.com`; reloj `12/10/2026`.

**Datos de prueba:** `cp-imp-111.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2: `01/09/2026 | Gasto | 120000 | ARS | vacía | Otros | Efectivo | 3 | 2 | Dependencia`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir incógnito. | Ventana sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-111-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso 1. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre selector. |
| 10 | Elegir `cp-imp-111.xlsx`. | Muestra solo `Solo los gastos con tarjeta de crédito admiten cuotas`; no muestra F20 ni F21. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-112 — F14e oculta reglas de cuotas pendientes

| Campo | Contenido |
|---|---|
| Historia · criterio | US-80 · CA-10 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-112-001@example.com`; reloj `12/10/2026`.

**Datos de prueba:** `cp-imp-112.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = 01/09/2026 | Gasto | 120000 | ARS | vacía | Otros | Tarjeta de crédito | 13 | 2 | Dependencia.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir incógnito. | Ventana sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-112-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso 1. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre selector. |
| 10 | Elegir `cp-imp-112.xlsx`. | Muestra solo `Las cuotas van de 1 a 12`; no muestra F20 ni F21. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-113 — USD sin resto conserva solo la cuota 3/3

| Campo | Contenido |
|---|---|
| Historia · criterio | US-80 · CA-11 · ADR-013 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-113-001@example.com`; reloj `12/10/2026`; PR-04.

**Datos de prueba:** `cp-imp-113.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = 15/08/2026 | Gasto | 300 | USD | 1000 | Otros | Tarjeta de crédito | 3 | 1 | USD exacto.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir incógnito. | Ventana sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-113-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso 1. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre selector. |
| 10 | Elegir `cp-imp-113.xlsx`. | Muestra `Falta 1 de 3 cuotas (US$100,00)`. |
| 11 | Hacer click en Importar. | Resultado `$100.000,00` en gastos. |
| 12 | Ejecutar IMP-PREP-04. | Transacción amount `100.00`, amount_ars `100000.00`; una cuota 3/3 de `100.00` y `100000.00` en octubre. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-114 — USD con resto reparte ARS exacto entre dos cuotas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-80 · CA-12 · ADR-013 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-114-001@example.com`; reloj `12/10/2026`; PR-04.

**Datos de prueba:** `cp-imp-114.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = 15/09/2026 | Gasto | 100 | USD | 1000 | Otros | Tarjeta de crédito | 3 | 2 | USD resto.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir incógnito. | Ventana sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-114-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso 1. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre selector. |
| 10 | Elegir `cp-imp-114.xlsx`. | Muestra `Faltan 2 de 3 cuotas (US$66,67)` y `Vas a importar 1 movimiento: $66.670,00 en gastos...`. |
| 11 | Hacer click en Importar. | Resultado suma `$66.670,00`. |
| 12 | Ejecutar IMP-PREP-04. | Cuotas 2/3 `33.33` y 3/3 `33.34`; cada amount_ars `33335.00`; suma `66670.00` igual a amount_ars. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-115 — Paso 2 y Resultado muestran el mismo saldo pendiente

| Campo | Contenido |
|---|---|
| Historia · criterio | US-80 · CA-13 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-115-001@example.com`; reloj `12/10/2026`.

**Datos de prueba:** `cp-imp-115.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = 10/06/2026 | Gasto | 120000 | ARS | vacía | Otros | Tarjeta de crédito | 6 | 3 | Heladera.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir incógnito. | Ventana sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-115-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso 1. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre selector. |
| 10 | Elegir `cp-imp-115.xlsx`. | Exactamente `Vas a importar 1 movimiento: $60.000,00 en gastos y $0,00 en ingresos (en pesos).` |
| 11 | Hacer click en Importar. | Exactamente `$60.000,00 en gastos y $0,00 en ingresos (en pesos).` |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-116 — Resumen cuenta la cuota heredada de una compra empezada

| Campo | Contenido |
|---|---|
| Historia · criterio | US-80 · CA-14 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-116-001@example.com`; reloj `12/10/2026`.

**Datos de prueba:** `cp-imp-116.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = 10/06/2026 | Gasto | 120000 | ARS | vacía | Otros | Tarjeta de crédito | 6 | 3 | Heladera.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir incógnito. | Ventana sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-116-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso 1. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre selector. |
| 10 | Elegir `cp-imp-116.xlsx`. | Fila lista. |
| 11 | Hacer click en Importar. | Resultado exitoso. |
| 12 | Hacer click en `Resumen`. | Resumen de octubre de 2026 muestra `Cuotas de meses anteriores` por `$20.000,00`. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-117 — Borrado enumera solo imputaciones guardadas no cerradas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-80 · CA-15 · US-65 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-117-001@example.com`; PR-04 pasos 1–2. Con el reloj de dominio en `12/10/2026`, ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con headers de PR-04 y body `{"p_type":"expense","p_amount":"120000.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Otros>","p_account_id":"<uuid Tarjeta de crédito>","p_installments_count":6,"p_installments_paid":3,"p_occurred_on":"2026-06-10","p_description":"Heladera","p_request_id":null}`. Esperado: HTTP 200 y UUID; IMP-PREP-04 confirma las tres imputaciones de Datos. Luego avanzar el reloj de dominio a `12/11/2026` antes de empezar los pasos.

**Datos de prueba:** Compra empezada: fecha `10/06/2026`, monto original 120000, 6 cuotas, 3 pendientes; imputaciones 4/6 octubre, 5/6 noviembre, 6/6 diciembre, cada una 20000.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión. |
| 2 | Escribir `<APP>` en la barra de direcciones. | La barra muestra `<APP>`. |
| 3 | Presionar Enter. | Se ve `Entrar`. |
| 4 | Escribir `qa+cp-imp-117-001@example.com` en `Email`. | El email queda cargado. |
| 5 | Escribir `Clave123!` en `Contraseña`. | La contraseña queda enmascarada. |
| 6 | Hacer click en `Entrar`. | Se abre la aplicación. |
| 7 | Abrir Movimientos de noviembre de 2026. | Se ve la compra como `5/6`. |
| 8 | Abrir el menú de la compra. | Se muestran las acciones del movimiento. |
| 9 | Hacer click en `Eliminar`. | El diálogo lista solo octubre de 2026, cuota `4/6`, `$20.000,00`; no lista junio–septiembre ni recalcula seis cuotas. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-118 — installments_paid igual al total se rechaza

| Campo | Contenido |
|---|---|
| Historia · criterio | US-80 · CA-16 · C6 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | API |
| Caso par | CP-IMP-103 |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-118-001@example.com`; PR-04; reloj `12/10/2026`.

**Datos de prueba:** POST `create_transaction` con body `{"p_type":"expense","p_amount":"120000.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Otros>","p_account_id":"<uuid Tarjeta de crédito>","p_installments_count":6,"p_installments_paid":6,"p_occurred_on":"2026-06-10","p_description":"API ficticia","p_request_id":null}`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con headers de PR-04 y el body de Datos. | HTTP 400; JSON `code:"23514"`, `message:"Las cuotas ya pagadas tienen que ser menos que el total de cuotas"`. |
| 2 | Ejecutar IMP-PREP-04. | No hay transacciones ni imputaciones. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-119 — installments_paid negativo se rechaza

| Campo | Contenido |
|---|---|
| Historia · criterio | US-80 · CA-16 · C6 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | API |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-119-001@example.com`; PR-04; reloj `12/10/2026`.

**Datos de prueba:** POST `create_transaction` con body `{"p_type":"expense","p_amount":"120000.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Otros>","p_account_id":"<uuid Tarjeta de crédito>","p_installments_count":6,"p_installments_paid":-1,"p_occurred_on":"2026-06-10","p_description":"API ficticia","p_request_id":null}`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con headers de PR-04 y el body de Datos. | HTTP 400; JSON `code:"23514"`, `message:"Las cuotas ya pagadas tienen que ser menos que el total de cuotas"`. |
| 2 | Ejecutar IMP-PREP-04. | No hay transacciones ni imputaciones. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-120 — installments_paid en una cuota se rechaza

| Campo | Contenido |
|---|---|
| Historia · criterio | US-80 · CA-16 · C6 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | API |
| Caso par | CP-IMP-100 |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-120-001@example.com`; PR-04; reloj `12/10/2026`.

**Datos de prueba:** POST `create_transaction` con body `{"p_type":"expense","p_amount":"120000.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Otros>","p_account_id":"<uuid Tarjeta de crédito>","p_installments_count":1,"p_installments_paid":0,"p_occurred_on":"2026-06-10","p_description":"API ficticia","p_request_id":null}`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con headers de PR-04 y el body de Datos. | HTTP 400; JSON `code:"23514"`, `message:"Las cuotas ya pagadas solo van en una compra en cuotas"`. |
| 2 | Ejecutar IMP-PREP-04. | No hay transacciones ni imputaciones. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-121 — Una cuota pagada con fecha de hoy se rechaza

| Campo | Contenido |
|---|---|
| Historia · criterio | US-80 · CA-16 · C6 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | API |
| Caso par | CP-IMP-110 |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-121-001@example.com`; PR-04; reloj `12/10/2026`.

**Datos de prueba:** POST `create_transaction` con body `{"p_type":"expense","p_amount":"120000.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Otros>","p_account_id":"<uuid Tarjeta de crédito>","p_installments_count":6,"p_installments_paid":1,"p_occurred_on":"2026-10-12","p_description":"API ficticia","p_request_id":null}`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con headers de PR-04 y el body de Datos. | HTTP 400; JSON `code:"23514"`, `message:"Con esa fecha todavía no puede haber tantas cuotas pagadas"`. |
| 2 | Ejecutar IMP-PREP-04. | No hay transacciones ni imputaciones. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-122 — Compra empezada compartida se rechaza

| Campo | Contenido |
|---|---|
| Historia · criterio | US-80 · CA-16 · C6 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | API |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-122-001@example.com`; PR-04.

**Datos de prueba:** POST `create_transaction` con body `{"p_type":"expense","p_amount":"120000.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Otros>","p_account_id":"<uuid Tarjeta de crédito>","p_installments_count":6,"p_installments_paid":1,"p_occurred_on":"2026-06-10","p_description":"API ficticia","p_request_id":null,"p_shared_person":"Ana Ficticia","p_shared_amount":"10000.00"}`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con headers de PR-04 y el body de Datos. | HTTP 400; `code:"23514"`; `message:"Una compra empezada no se puede compartir"`. |
| 2 | Ejecutar IMP-PREP-04. | No hay filas. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-123 — installments_paid decimal se rechaza por tipo

| Campo | Contenido |
|---|---|
| Historia · criterio | US-80 · CA-16 · C6 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | API |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-123-001@example.com`; PR-04.

**Datos de prueba:** POST `create_transaction` con body `{"p_type":"expense","p_amount":"120000.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Otros>","p_account_id":"<uuid Tarjeta de crédito>","p_installments_count":6,"p_installments_paid":1.5,"p_occurred_on":"2026-06-10","p_description":"API ficticia","p_request_id":null}`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con headers de PR-04 y el body de Datos. | HTTP 400; JSON `code:"22P02"`; no devuelve UUID. |
| 2 | Ejecutar IMP-PREP-04. | No hay filas. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-124 — import_transactions rechaza una installments_paid inválida y continúa

| Campo | Contenido |
|---|---|
| Historia · criterio | US-80 · CA-16 · C6 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | API |
| Caso par | CP-IMP-118 |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-124-001@example.com`; PR-04.

**Datos de prueba:** body literal `{"p_import_id":"12412412-0000-4000-8000-000000000124","p_rows":[{"row":1,"type":"expense","amount":"120000.00","currency":"ARS","fx_rate":null,"category_id":"<uuid Otros>","account_id":"<uuid Tarjeta de crédito>","installments_count":6,"installments_paid":3,"occurred_on":"2026-06-10","description":"Válida"},{"row":2,"type":"expense","amount":"120000.00","currency":"ARS","fx_rate":null,"category_id":"<uuid Otros>","account_id":"<uuid Tarjeta de crédito>","installments_count":6,"installments_paid":6,"occurred_on":"2026-06-10","description":"Inválida"}]}`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar IMP-PREP-03 con el body literal de Datos. | HTTP 200; `sent_rows:2`, `imported_rows:1`; fila 1 tiene `status:"imported"`; fila 2 tiene `status:"rejected"`, `error_code:"23514"` y `error_message:"Las cuotas ya pagadas tienen que ser menos que el total de cuotas"`. |
| 2 | Ejecutar IMP-PREP-04. | Existe solo la transacción de fila 1. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-125 — installments_paid null crea una compra normal

| Campo | Contenido |
|---|---|
| Historia · criterio | US-80 · CA-16 · C6 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | API |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-125-001@example.com`; PR-04.

**Datos de prueba:** POST create_transaction con {"p_type":"expense","p_amount":"120000.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Otros>","p_account_id":"<uuid Tarjeta de crédito>","p_installments_count":6,"p_occurred_on":"2026-06-10","p_description":"API ficticia","p_request_id":null,"p_installments_paid":null}; fecha 10/06/2026.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar POST. | HTTP 200 y UUID. |
| 2 | Ejecutar IMP-PREP-04. | amount `120000.00`, installments_paid null; seis cuotas 1–6 desde junio a noviembre de 2026. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-126 — installments_paid ausente crea una compra normal

| Campo | Contenido |
|---|---|
| Historia · criterio | US-80 · CA-16 · C6 |
| Invariante | I1, I1', I2, I3 |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | API |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-126-001@example.com`; PR-04.

**Datos de prueba:** POST create_transaction con {"p_type":"expense","p_amount":"120000.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Otros>","p_account_id":"<uuid Tarjeta de crédito>","p_installments_count":6,"p_occurred_on":"2026-06-10","p_description":"API ficticia","p_request_id":null}; fecha 10/06/2026.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar POST. | HTTP 200 y UUID. |
| 2 | Ejecutar IMP-PREP-04. | amount `120000.00`, installments_paid null; seis cuotas 1–6 desde junio a noviembre de 2026. |

**Post-condición:** Conservar usuario, archivo y respuestas como evidencia.

### CP-IMP-127 — La guía está cerrada por defecto

| Campo | Contenido |
|---|---|
| Historia · criterio | US-81 · CA-1 · CA-10 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-127-001@example.com`; sesión cerrada.

**Datos de prueba:** Sin archivo.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-127-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso `1 Archivo`. |
| 9 | Inspeccionar la pantalla y el DOM con DevTools Elements. | Se ve `¿Cómo armo el archivo?` con `data-testid="import-guide-open"`; `import-guide-dialog` no está en el DOM. |

**Post-condición:** No se creó ninguna transacción; la guía queda cerrada.

### CP-IMP-128 — Recargar y volver a entrar no abre la guía

| Campo | Contenido |
|---|---|
| Historia · criterio | US-81 · CA-1 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-128-001@example.com`; sesión cerrada.

**Datos de prueba:** Sin archivo.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-128-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso `1 Archivo`. |
| 9 | Recargar `/import`. | Sigue en paso 1; la guía está cerrada. |
| 10 | Hacer click en `Registrar`. | Se abre Registrar. |
| 11 | Hacer click en `Importar desde Excel`. | Vuelve a `/import`; la guía sigue cerrada. |

**Post-condición:** No se creó ninguna transacción; la guía queda cerrada.

### CP-IMP-129 — La guía muestra todo el contenido exacto

| Campo | Contenido |
|---|---|
| Historia · criterio | US-81 · CA-2 · CA-10 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-129-001@example.com`; sesión cerrada.

**Datos de prueba:** Título `Cómo armar el archivo`; introducción exacta `Podés usar tu propia planilla o empezar desde la plantilla. Lo que importa es la primera fila y que haya un movimiento por fila.`. Lista numerada exacta: (1) `En la primera fila van los encabezados. Fecha, Tipo, Monto, Moneda y Cuenta son obligatorios; Tipo de cambio, Categoría, Cuotas, Cuotas pendientes y Nota son opcionales.`; (2) `Escribí la fecha como DD/MM/AAAA o usá una celda de fecha de Excel. No puede ser posterior a hoy.`; (3) `En Tipo poné Gasto o Ingreso, y en Moneda, ARS o USD. Si es USD, completá el tipo de cambio de esa compra.`; (4) `La categoría y la cuenta tienen que existir en Biyu con el mismo nombre. Las mayúsculas no importan; las tildes sí. Un gasto necesita categoría.`; (5) `Si compraste en cuotas con tarjeta de crédito, poné el monto total de la compra (no el de una cuota) y la cantidad en Cuotas (hasta 12). Si ya pagaste algunas, poné en Cuotas pendientes cuántas te faltan, contando la de este mes: en una compra de 6 cuotas con 3 pagadas, van 3. La fecha es la de la compra. Si dejás Cuotas pendientes vacía, se cargan todas las cuotas desde el mes de la fecha.`; (6) `Antes de importar vas a ver qué filas tienen errores y por qué. Las que están bien se importan aunque otras fallen.`. Tabla `Ejemplo`: encabezado `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 `01/09/2026 | Gasto | 45800 | ARS | vacía | Comida y supermercado | Tarjeta de débito | vacía | vacía | Compra del mes`; fila 3 `10/06/2026 | Gasto | 120000 | ARS | vacía | Otros | Tarjeta de crédito | 6 | 3 | Heladera`. Pie `Hasta 500 filas y 1 MB. Solo se lee la primera hoja.`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-129-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso `1 Archivo`. |
| 9 | Hacer click en `¿Cómo armo el archivo?`. | Se abre `role="dialog"`, `aria-modal="true"`, `data-testid="import-guide-dialog"`; título, introducción, seis pasos, tabla y pie coinciden carácter por carácter con Datos; existen `import-guide-steps`, `import-guide-example`, `import-guide-template-download`, `import-guide-done` e `import-guide-close`. |

**Post-condición:** No se creó ninguna transacción; la guía queda cerrada.

### CP-IMP-130 — Cerrar con Entendido devuelve el foco

| Campo | Contenido |
|---|---|
| Historia · criterio | US-81 · CA-3 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-130-001@example.com`; sesión cerrada.

**Datos de prueba:** Sin archivo.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-130-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso `1 Archivo`. |
| 9 | Hacer click en `¿Cómo armo el archivo?`. | Se abre la guía. |
| 10 | Hacer click en `Entendido`. | La guía se cierra, deja de estar en el DOM y el foco vuelve a `¿Cómo armo el archivo?`. |

**Post-condición:** No se creó ninguna transacción; la guía queda cerrada.

### CP-IMP-131 — Cerrar con el botón cerrar devuelve el foco

| Campo | Contenido |
|---|---|
| Historia · criterio | US-81 · CA-3 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-131-001@example.com`; sesión cerrada.

**Datos de prueba:** Sin archivo.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-131-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso `1 Archivo`. |
| 9 | Hacer click en `¿Cómo armo el archivo?`. | Se abre la guía. |
| 10 | Hacer click en el botón `Cerrar guía`. | La guía se cierra, deja de estar en el DOM y el foco vuelve a `¿Cómo armo el archivo?`. |

**Post-condición:** No se creó ninguna transacción; la guía queda cerrada.

### CP-IMP-132 — Cerrar con Escape devuelve el foco

| Campo | Contenido |
|---|---|
| Historia · criterio | US-81 · CA-3 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-132-001@example.com`; sesión cerrada.

**Datos de prueba:** Sin archivo.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-132-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso `1 Archivo`. |
| 9 | Hacer click en `¿Cómo armo el archivo?`. | Se abre la guía. |
| 10 | Presionar Escape. | La guía se cierra, deja de estar en el DOM y el foco vuelve a `¿Cómo armo el archivo?`. |

**Post-condición:** No se creó ninguna transacción; la guía queda cerrada.

### CP-IMP-133 — Cerrar con un click exterior devuelve el foco

| Campo | Contenido |
|---|---|
| Historia · criterio | US-81 · CA-3 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-133-001@example.com`; sesión cerrada.

**Datos de prueba:** Sin archivo.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-133-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso `1 Archivo`. |
| 9 | Hacer click en `¿Cómo armo el archivo?`. | Se abre la guía. |
| 10 | Hacer click fuera del panel del diálogo. | La guía se cierra, deja de estar en el DOM y el foco vuelve a `¿Cómo armo el archivo?`. |

**Post-condición:** No se creó ninguna transacción; la guía queda cerrada.

### CP-IMP-134 — El foco inicial va a Cerrar guía

| Campo | Contenido |
|---|---|
| Historia · criterio | US-81 · CA-4 · DEF-024 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-134-001@example.com`; sesión cerrada.

**Datos de prueba:** Teclado físico; sin mouse después de abrir.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-134-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso `1 Archivo`. |
| 9 | Hacer click en `¿Cómo armo el archivo?`. | Se abre la guía y `document.activeElement` es el botón con `aria-label="Cerrar guía"`. |

**Post-condición:** No se creó ninguna transacción; la guía queda cerrada.

### CP-IMP-135 — Tab y Shift+Tab quedan atrapados en el diálogo

| Campo | Contenido |
|---|---|
| Historia · criterio | US-81 · CA-4 · DEF-024 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-135-001@example.com`; sesión cerrada; teclado.

**Datos de prueba:** Secuencia: 20 Tab, luego 20 Shift+Tab.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-135-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso `1 Archivo`. |
| 9 | Hacer click en `¿Cómo armo el archivo?`. | Se abre la guía. |
| 10 | Presionar Tab veinte veces. | En cada pulsación el foco visible queda dentro de `import-guide-dialog`; nunca llega a la página. |
| 11 | Presionar Shift+Tab veinte veces. | En cada pulsación el foco visible sigue dentro del diálogo. |

**Post-condición:** No se creó ninguna transacción; la guía queda cerrada.

### CP-IMP-136 — Descargar plantilla desde la guía produce el mismo libro

| Campo | Contenido |
|---|---|
| Historia · criterio | US-81 · CA-5 · US-80 · CA-1 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-136-001@example.com`; sesión cerrada; Excel o LibreOffice.

**Datos de prueba:** Plantilla esperada: `biyu-plantilla-importacion.xlsx`; Movimientos solo fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; Instrucciones con las diez filas exactas, incluida Cuotas pendientes.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-136-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso `1 Archivo`. |
| 9 | Hacer click en `¿Cómo armo el archivo?`. | Se abre la guía. |
| 10 | Hacer click en `Descargar plantilla` dentro de la guía. | Se descarga `biyu-plantilla-importacion.xlsx`. |
| 11 | Abrir la descarga. | Hojas y celdas coinciden exactamente con Datos y con CP-IMP-003. |

**Post-condición:** No se creó ninguna transacción; la guía queda cerrada.

### CP-IMP-137 — Se puede importar sin abrir la guía

| Campo | Contenido |
|---|---|
| Historia · criterio | US-81 · CA-6 · US-77 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-137-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-137.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = V.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-137-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre selector; nunca se abrió la guía. |
| 10 | Elegir `cp-imp-137.xlsx`. | Se abre Revisión con una fila lista. |
| 11 | Hacer click en `Importar 1 movimiento`. | Se ve `Se importó 1 de 1 fila.`; no apareció aviso sobre la guía. |

**Post-condición:** Existe una transacción ficticia.

### CP-IMP-138 — Abrir y cerrar la guía conserva archivo, resumen, filtro y URL

| Campo | Contenido |
|---|---|
| Historia · criterio | US-81 · CA-7 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-138-001@example.com`; sesión cerrada.

**Datos de prueba:** Copia exacta de IMP-DATA-01, incluida la fila 12 vacía.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-138-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Selector. |
| 10 | Elegir `importar-excel-ejemplo.xlsx`. | Revisión: 11/7/4; URL `/import`. |
| 11 | Hacer click en `Ver solo filas con error`. | Filtro encendido; filas 7–10. |
| 12 | Hacer click en `¿Cómo armo el archivo?`. | Guía abierta sobre Revisión. |
| 13 | Hacer click en `Entendido`. | Guía cerrada; mismo nombre de archivo, resumen 11/7/4, filtro encendido, filas 7–10 y URL `/import`. |

**Post-condición:** No se creó ninguna transacción; la guía queda cerrada.

### CP-IMP-139 — El botón de guía no existe en Resultado

| Campo | Contenido |
|---|---|
| Historia · criterio | US-81 · CA-8 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-139-001@example.com`; sesión cerrada.

**Datos de prueba:** `cp-imp-139.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = V.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-139-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso `1 Archivo`. |
| 9 | Elegir `cp-imp-139.xlsx` mediante `Elegir archivo .xlsx`. | Una fila lista. |
| 10 | Hacer click en `Importar 1 movimiento`. | Se abre Resultado. |
| 11 | Inspeccionar pantalla y DOM. | No se ve `¿Cómo armo el archivo?` y `import-guide-open` no está en el DOM. |

**Post-condición:** Existe una transacción.

### CP-IMP-140 — El botón de guía se deshabilita mientras importa

| Campo | Contenido |
|---|---|
| Historia · criterio | US-81 · CA-8 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-140-001@example.com`; sesión cerrada; DevTools throttling para mantener la RPC pendiente.

**Datos de prueba:** `cp-imp-140.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = V.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-140-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso `1 Archivo`. |
| 9 | Elegir `cp-imp-140.xlsx` mediante `Elegir archivo .xlsx`. | Una fila lista; se ve guía. |
| 10 | Hacer click en `Importar 1 movimiento`. | Muestra `Importando…`. |
| 11 | Intentar activar `¿Cómo armo el archivo?`. | El botón está deshabilitado; no se abre `import-guide-dialog`. |

**Post-condición:** No se creó ninguna transacción; la guía queda cerrada.

### CP-IMP-141 — La guía móvil mantiene márgenes y scroll interno

| Campo | Contenido |
|---|---|
| Historia · criterio | US-81 · CA-9 · ADR-023 |
| Invariante | — |
| Técnica | Prueba de interfaz adaptable |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Media |
| Automatizable | No |

**Pre-requisitos:** PR-01 con `qa+cp-imp-141-001@example.com`; sesión cerrada; DevTools Responsive `390 × 844`, zoom 100%.

**Datos de prueba:** Ancho esperado del diálogo `358 px` (390 − 16 − 16).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre sin sesión. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-141-001@example.com` en `Email`. | Email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | Valor enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`, paso `1 Archivo`. |
| 9 | Hacer click en `¿Cómo armo el archivo?`. | El diálogo mide 358 px y deja 16 px a cada lado. |
| 10 | Desplazar verticalmente dentro del diálogo. | Su contenido scrollea dentro del panel; la página de atrás no se desplaza. |
| 11 | Leer `document.documentElement.scrollWidth` en Console. | El valor es menor o igual a `390`. |
| 12 | Desplazar horizontalmente la tabla Ejemplo dentro de su caja. | La tabla se recorre completa; el diálogo y la página no generan scroll horizontal. |

**Post-condición:** No se creó ninguna transacción; la guía queda cerrada.

### CP-IMP-142 — Cuenta archivada no se acepta aunque el nombre coincida

| Campo | Contenido |
|---|---|
| Historia · criterio | US-76 · CA-5 · F14d |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Negativo |
| Canal | UI |
| Caso par | — (el contrato API exacto no está especificado; ver ambigüedad 3) |
| Prioridad | Media |
| Automatizable | No |

**Pre-requisitos:** PR-01 con `qa+cp-imp-142-001@example.com`; archivar la cuenta `Efectivo` desde Ajustes y cerrar sesión.

**Datos de prueba:** `cp-imp-142.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | `Gasto` | número `1000` | `ARS` | vacía | `Otros` | `Efectivo` | número `1` | vacía | `Cuenta archivada`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-142-001@example.com` en `Email`. | El campo muestra el email exacto. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import` en `1 Archivo`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-142.xlsx`. | `Fila 2` queda `Con error` y muestra exactamente `No existe la cuenta «Efectivo» o está archivada`; `Importar 0 movimientos` está deshabilitado. |

**Post-condición:** No se creó ninguna transacción; la cuenta sigue archivada.

### CP-IMP-143 — Elegir otro archivo durante un estado incierto pide confirmación

| Campo | Contenido |
|---|---|
| Historia · criterio | US-78 · CA-4 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-143-001@example.com`; sesión cerrada; DevTools Network abierto en Online.

**Datos de prueba:** `cp-imp-143.xlsx`: fila 1 = `Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota`; fila 2 = fecha Excel `01/09/2026` | `Gasto` | número `1000` | `ARS` | vacía | `Otros` | `Efectivo` | `1` | vacía | `Cambio pendiente`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-imp-143-001@example.com` en `Email`. | El email queda cargado. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar. |
| 8 | Hacer click en `Importar desde Excel`. | Se abre `/import`. |
| 9 | Hacer click en `Elegir archivo .xlsx`. | Se abre el selector. |
| 10 | Elegir `cp-imp-143.xlsx`. | Se abre Revisión con una fila lista. |
| 11 | Cambiar Network a Offline. | DevTools muestra Offline. |
| 12 | Hacer click en `Importar 1 movimiento`. | Aparece el mensaje exacto de no confirmación y el botón `Reintentar`. |
| 13 | Hacer click en `Elegir otro archivo`. | Se abre `¿Salir sin saber si se importó?`; todavía se ve el nombre `cp-imp-143.xlsx` detrás del diálogo. |
| 14 | Hacer click en `Salir igual`. | Vuelve a `1 Archivo`, sin nombre ni resumen del archivo anterior. |

**Post-condición:** No se creó ninguna transacción porque la red estuvo Offline.

### CP-IMP-144 — Una fila que falla después del alta no deja transacción sin imputaciones

| Campo | Contenido |
|---|---|
| Historia · criterio | US-77 · CA-7 · C4 · I4 · ADR-035 |
| Invariante | I1 |
| Técnica | Adivinación de errores |
| Tipo | Negativo |
| Canal | API |
| Caso par | CP-IMP-046 |
| Prioridad | Alta |
| Automatizable | Sí |

**Pre-requisitos:** PR-01 con `qa+cp-imp-144-001@example.com`; PR-04 pasos 1–2.

**Datos de prueba:** body literal `{"p_import_id":"14414414-0000-4000-8000-000000000144","p_rows":[{"row":2,"type":"expense","amount":"0.02","currency":"ARS","fx_rate":null,"category_id":"<uuid Otros>","account_id":"<uuid Tarjeta de crédito>","installments_count":3,"occurred_on":"2026-09-01","description":"Fallo atómico ficticio"}]}`. Este dato pasa las validaciones externas de monto positivo y cuotas 1–12; al crear imputaciones, la cuota base truncada es `0.00`, por lo que la escritura de la fila falla después de intentar el alta de la transacción. ADR-035 exige que la subtransacción revierta toda la fila.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar IMP-PREP-03 con el body literal de Datos. | HTTP 200; `import_id:"14414414-0000-4000-8000-000000000144"`, `already_imported:false`, `sent_rows:1`, `imported_rows:0`; fila 2 tiene `status:"rejected"`. Registrar `error_code` y `error_message` como evidencia, sin usarlos para el veredicto porque la historia no los contractualiza para F17. |
| 2 | Ejecutar IMP-PREP-04. | `transactions` responde HTTP 200 con `[]`; `ledger_entries` responde HTTP 200 con `[]`; `imports` responde HTTP 200 con una sola fila de id `14414414-0000-4000-8000-000000000144`, `sent_rows:1`, `imported_rows:0` y una fila 2 con `status:"rejected"`. |

**Post-condición:** Conservar usuario, body y respuestas como evidencia de que no quedó una transacción parcial.

## Historias o criterios sin caso (huecos)

No quedan historias ni criterios de aceptación sin al menos un caso. Las seis historias y sus 62 criterios están trazados en la matriz.

Quedan estos huecos de ejecución o de oráculo, sin inventar comportamiento:

1. Los negativos A1–A7 y los errores de formato F1–F21 que el cliente excluye antes de llamar a la base no tienen un endpoint de carga de archivos. Solo se enlazó un caso API cuando el criterio define un body, status/code y mensaje observable. Para F7, F8 y F14c el par es el lote explícito CP-IMP-077; para cuotas empezadas se usan CP-IMP-118 a CP-IMP-126.
2. Para F1, F4, F6, F9–F18 y parte de F19–F21, la historia no fija el `error_code` ni el `error_message` de una fila arbitraria enviada directamente a `import_transactions`. Se mantienen como casos UI sin fabricar ese oráculo API. CP-IMP-144 usa un dato F17 solo para provocar y verificar el rollback de C4: exige `status:"rejected"` y cero residuos, pero registra code/message únicamente como evidencia. El PO debe decidir si se amplía el contrato de la sección 5.
3. CP-IMP-055/056 y CP-IMP-093 a CP-IMP-121 requieren un reloj de dominio fijado al 12/10/2026. `docs/12-procedimientos-de-prueba.md` no define cómo fijar el reloj del deploy; hasta que exista el fixture, esos casos son ejecutables solo en un entorno controlado.
4. CP-IMP-083 reproduce de forma determinista la recuperación de “commit confirmado, respuesta desconocida” sembrando antes el mismo UUID y haciendo que el primer intento del navegador falle sin conexión. No reproduce el instante físico en que una respuesta se corta después del commit; ese ensayo de transporte requiere un proxy de fallos del entorno.

## Ambigüedades para el PO

1. `entrega-2/mocks/importar-excel-ejemplo.xlsx` y su hoja `Instrucciones` todavía tienen nueve columnas y no incluyen `Cuotas pendientes`. US-80 · CA-1 exige diez. Estos casos toman como oráculo la historia más nueva; confirmar si el archivo de ejemplo debe regenerarse antes de la ejecución.
2. C1 exige fechas fijas y prohíbe “hoy”, mientras US-76 · CA-6 y US-80 expresan límites relativos a hoy. Se fijó hoy en Argentina a `12/10/2026`; falta un procedimiento oficial para controlar ese reloj en UI/API manual.
3. C6 exige pares UI/API para negativos, pero la especificación solo fija respuesta directa para el lote de US-77 · CA-7 y las variantes de US-80 · CA-16. Confirmar si se desean contratos de error adicionales para cada F1–F21 o si las excepciones documentadas son aceptables.
4. US-74 · CA-8, US-76 · CA-12, US-77 · CA-10, US-78 · CA-5 y US-81 · CA-10 hablan de todos los elementos interactivos. Se verifican los `data-testid` al usar cada elemento en los casos funcionales y en CP-IMP-127/129; confirmar si el equipo además quiere una inspección exhaustiva separada del DOM, que duplicaría la cobertura sin probar otra conducta.
5. US-77 · CA-8 solo fija rechazo total y ausencia de persistencia: no contractualiza el número HTTP, `code` ni mensaje. CA-9 sí fija `permission denied`/`42501`, pero tampoco el número HTTP que PostgREST debe asignar. CP-IMP-078/079/080 verifican únicamente esos oráculos sin inventar `400`, `401` o `403`; el PO debe definir el contrato HTTP restante si quiere usarlo como veredicto.

## Resumen cuantitativo

| Dimensión | Cantidad |
|---|---:|
| Total | 144 |
| Positivos | 59 |
| Negativos | 76 |
| Límites | 9 |
| UI | 128 |
| API | 16 |
| Prioridad Alta | 69 |
| Prioridad Media | 75 |
| Prioridad Baja | 0 |
| Automatizable Sí | 141 |
| Automatizable No | 3 |
| Automatizable V3 | 0 |
