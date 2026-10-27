# Proyecto Biyu – Entrega 2 · Ejecución de casos de prueba (V2) · Importar Excel (IMP)

Planilla: `04-ejecucion-imp.xlsx` (una hoja por caso con "Reporte de ejecución 1", resultado obtenido, informe previo del equipo y defectos). Casos: [`casos/imp.md`](casos/imp.md) (US-74, US-76, US-77, US-78, US-80 y US-81). Reporte con métricas: [`06-reporte-de-ejecucion-imp.md`](06-reporte-de-ejecucion-imp.md). Defectos: [`05-reportes-de-defectos-imp.md`](05-reportes-de-defectos-imp.md).

## Condiciones de la ejecución

- **Fecha:** 2026-10-27.
- **Versión probada:** `main` en el commit `1c72d0f` (código local; los commits posteriores solo tocan documentos). No se probó el deploy de Vercel.
- **Entorno:** Local: Vite (http://127.0.0.1:5173) + Supabase local · main 1c72d0f · Chromium (Playwright 1.63), es-AR, America/Argentina/Buenos_Aires, reloj del navegador fijado en 12/10/2026.
- **Quién ejecutó:** **los 144 casos los ejecutó Claude Code (IA), supervisado por Santiago.** El equipo había informado por mensaje resultados parciales de 70 de ellos (ver «Informe previo del equipo» en cada caso); los otros 74 no tenían ningún dato.
- **Cómo se ejecutó:** scripts de Playwright. Cada caso crea su propio usuario (alta por API y entrada por la pantalla de ingreso, con la configuración inicial salteada), prepara los datos por la API y recorre la pantalla como lo haría una persona; los casos de API llaman directo a las funciones con el token del usuario (o con la clave anónima) y consultan las tablas como oráculo.
- **Datos:** usuarios `qa+cp-imp-<nnn>-001@example.com` (con un sufijo de corrida), contraseña `Clave123!` y montos ficticios (C14), en Supabase local. En producción no se creó nada.

## Resultado por caso

| ID | Prioridad | Historia | Status | Ejecutó | Defectos |
|---|---|---|---|---|---|
| CP-IMP-001 | Media | US-74 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-002 | Alta | US-74 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-003 | Media | US-74 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-004 | Media | US-74 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-005 | Media | US-74 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-006 | Media | US-74 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-007 | Media | US-74 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-008 | Media | US-74 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-009 | Media | US-74 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-010 | Media | US-74 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-011 | Media | US-74 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-012 | Media | US-74 | **DUDA** | Claude Code (IA) | — |
| CP-IMP-013 | Media | US-74 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-014 | Media | US-74 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-015 | Media | US-74 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-016 | Media | US-74 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-017 | Media | US-74 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-018 | Media | US-74 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-019 | Media | US-74 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-020 | Media | US-74 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-021 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-022 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-023 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-024 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-025 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-026 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-027 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-028 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-029 | Alta | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-030 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-031 | Alta | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-032 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-033 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-034 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-035 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-036 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-037 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-038 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-039 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-040 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-041 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-042 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-043 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-044 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-045 | Alta | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-046 | Alta | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-047 | Alta | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-048 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-049 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-050 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-051 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-052 | Media | US-76 | **FAILED** | Claude Code (IA) | DEF-033 |
| CP-IMP-053 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-054 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-055 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-056 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-057 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-058 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-059 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-060 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-061 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-062 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-063 | Alta | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-064 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-065 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-066 | Alta | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-067 | Alta | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-068 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-069 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-070 | Alta | US-77 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-071 | Alta | US-77 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-072 | Alta | US-77 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-073 | Alta | US-77 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-074 | Alta | US-77 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-075 | Alta | US-77 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-076 | Alta | US-77 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-077 | Alta | US-77 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-078 | Alta | US-77 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-079 | Alta | US-77 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-080 | Alta | US-77 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-081 | Alta | US-77 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-082 | Alta | US-78 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-083 | Alta | US-78 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-084 | Alta | US-78 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-085 | Alta | US-78 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-086 | Alta | US-78 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-087 | Alta | US-78 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-088 | Alta | US-78 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-089 | Alta | US-78 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-090 | Alta | US-78 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-091 | Alta | US-78 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-092 | Alta | US-78 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-093 | Alta | US-80 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-094 | Alta | US-80 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-095 | Alta | US-80 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-096 | Alta | US-80 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-097 | Alta | US-80 | **DUDA** | Claude Code (IA) | — |
| CP-IMP-098 | Alta | US-80 | **DUDA** | Claude Code (IA) | — |
| CP-IMP-099 | Alta | US-80 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-100 | Alta | US-80 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-101 | Alta | US-80 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-102 | Alta | US-80 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-103 | Alta | US-80 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-104 | Alta | US-80 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-105 | Alta | US-80 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-106 | Alta | US-80 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-107 | Alta | US-80 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-108 | Alta | US-80 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-109 | Alta | US-80 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-110 | Alta | US-80 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-111 | Alta | US-80 | **DUDA** | Claude Code (IA) | — |
| CP-IMP-112 | Alta | US-80 | **DUDA** | Claude Code (IA) | — |
| CP-IMP-113 | Alta | US-80 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-114 | Alta | US-80 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-115 | Alta | US-80 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-116 | Alta | US-80 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-117 | Alta | US-80 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-118 | Alta | US-80 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-119 | Alta | US-80 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-120 | Alta | US-80 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-121 | Alta | US-80 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-122 | Alta | US-80 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-123 | Alta | US-80 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-124 | Alta | US-80 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-125 | Alta | US-80 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-126 | Alta | US-80 | **DUDA** | Claude Code (IA) | — |
| CP-IMP-127 | Media | US-81 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-128 | Media | US-81 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-129 | Media | US-81 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-130 | Media | US-81 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-131 | Media | US-81 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-132 | Media | US-81 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-133 | Media | US-81 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-134 | Media | US-81 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-135 | Media | US-81 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-136 | Media | US-81 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-137 | Alta | US-81 | **DUDA** | Claude Code (IA) | — |
| CP-IMP-138 | Media | US-81 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-139 | Media | US-81 | **DUDA** | Claude Code (IA) | — |
| CP-IMP-140 | Media | US-81 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-141 | Media | US-81 | **BLOCKED** | Claude Code (IA) | — |
| CP-IMP-142 | Media | US-76 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-143 | Alta | US-78 | **PASSED** | Claude Code (IA) | — |
| CP-IMP-144 | Alta | US-77 | **PASSED** | Claude Code (IA) | — |

## Detalle

### CP-IMP-001 — El acceso desde Registrar abre el paso Archivo · **PASSED**

**Esperado:** La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. Existen `register-import` en el botón usado, `import-back`, `import-steps` con `data-step="1"`, `import-template-download`, `import-file-pick`, `import-file-input` e `import-file-dropzone`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Existen register-import en el botón usado, import-back, import-steps con data-step="1", import-template-download, import-file-pick, import-file-input e import-file-dropzone.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-002 — La ruta privada sin sesión conserva next=/import · **PASSED**

**Esperado:** Se abre sin sesión.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se abre sin sesión.
```

**Informe previo del equipo:** Falló: la URL queda en /import (deploy de Vercel) y se muestra Importar en lugar del login; la ruta no está protegida.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-003 — La plantilla descargada tiene diez columnas y la instrucción de cuotas pendientes · **BLOCKED**

**Esperado:** La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. Se descarga una vez `biyu-plantilla-importacion.xlsx`. Existen exactamente las hojas `Movimientos` e `Instrucciones`; sus celdas coinciden exactamente con los datos de prueba y no hay filas de datos en `Movimientos`.

**Obtenido:**

```text
US-80 (Cuotas pendientes) no está implementada: la plantilla descargada tiene 9 columnas (Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Nota) y la hoja Instrucciones no incluye «Cuotas pendientes»
```

**Informe previo del equipo:** Falló: la planilla no muestra la columna de cuotas pendientes.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-004 — Subir la plantilla vacía muestra A6 · **PASSED**

**Esperado:** La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. Se abre el selector de archivos. Se mantiene `1 Archivo`; aparece exactamente `El archivo no tiene filas con datos debajo de los encabezados.` en un elemento con `data-testid="import-file-error"`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se mantiene 1 Archivo; aparece exactamente El archivo no tiene filas con datos debajo de los encabezados. en un elemento con data-testid="import-file-error".
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-005 — A1 rechaza la extensión .xls · **PASSED**

**Esperado:** La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. La zona queda resaltada para recibir el archivo. Se mantiene `1 Archivo`; aparece exactamente `Solo se aceptan archivos .xlsx (Excel).`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se mantiene 1 Archivo; aparece exactamente Solo se aceptan archivos .xlsx (Excel)..
```

**Informe previo del equipo:** Falló: el error que muestra es «El archivo no tiene filas con datos debajo de los encabezados (si los tiene)».
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-006 — A2 rechaza 1.048.577 bytes · **PASSED**

**Esperado:** La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. Se abre el selector de archivos. Se mantiene `1 Archivo`; aparece exactamente `El archivo pesa más de 1 MB. Dividilo en varios archivos.`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se mantiene 1 Archivo; aparece exactamente El archivo pesa más de 1 MB. Dividilo en varios archivos..
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-007 — A3 rechaza un archivo dañado con extensión xlsx · **PASSED**

**Esperado:** La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. Se abre el selector de archivos. Se mantiene `1 Archivo`; aparece exactamente `No pudimos leer el archivo. Abrilo en Excel, guardalo como .xlsx y probá de nuevo.`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se mantiene 1 Archivo; aparece exactamente No pudimos leer el archivo. Abrilo en Excel, guardalo como .xlsx y probá de nuevo..
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-008 — A4 enumera tres encabezados obligatorios faltantes · **PASSED**

**Esperado:** La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. Se abre el selector de archivos. Se mantiene `1 Archivo`; aparece exactamente `Faltan columnas: Fecha, Monto, Cuenta. La primera fila tiene que tener los encabezados de la plantilla.`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se mantiene 1 Archivo; aparece exactamente Faltan columnas: Fecha, Monto, Cuenta. La primera fila tiene que tener los encabezados de la plantilla..
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-009 — A5 rechaza un encabezado repetido · **PASSED**

**Esperado:** La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. Se abre el selector de archivos. Se mantiene `1 Archivo`; aparece exactamente `La columna Monto está repetida. Dejá una sola.`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se mantiene 1 Archivo; aparece exactamente La columna Monto está repetida. Dejá una sola..
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-010 — A6 rechaza filas completamente vacías · **PASSED**

**Esperado:** La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. Se abre el selector de archivos. Se mantiene `1 Archivo`; aparece exactamente `El archivo no tiene filas con datos debajo de los encabezados.`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se mantiene 1 Archivo; aparece exactamente El archivo no tiene filas con datos debajo de los encabezados..
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-011 — A7 rechaza 501 filas con datos · **PASSED**

**Esperado:** La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. Se abre el selector de archivos. Se mantiene `1 Archivo`; aparece exactamente `El archivo tiene 501 filas con datos y el máximo es 500. Dividilo en varios archivos.`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se mantiene 1 Archivo; aparece exactamente El archivo tiene 501 filas con datos y el máximo es 500. Dividilo en varios archivos..
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-012 — El límite de tamaño acepta exactamente 1.048.576 bytes · **DUDA**

**Esperado:** La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. Se abre el selector de archivos. Se abre `2 Revisión`; muestra `1 fila leída · 1 lista para importar · 0 con error`.

**Obtenido:**

```text
Con un ZIP válido de exactamente 1.048.576 bytes la app acepta el archivo (1 fila leída · 1 lista · 0 con error). Con la preparación literal del caso (IMP-PREP-05: ceros al final del ZIP) responde «No pudimos leer el archivo»: probable error de la preparación del caso
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-013 — Un byte sobre el límite de tamaño muestra A2 · **PASSED**

**Esperado:** La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. Se abre el selector de archivos. Se mantiene `1 Archivo`; aparece exactamente `El archivo pesa más de 1 MB. Dividilo en varios archivos.`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se mantiene 1 Archivo; aparece exactamente El archivo pesa más de 1 MB. Dividilo en varios archivos..
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-014 — El límite de filas acepta exactamente 500 · **PASSED**

**Esperado:** La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. Se abre el selector de archivos. Se abre `2 Revisión`; muestra `500 filas leídas · 500 listas para importar · 0 con error`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; muestra 500 filas leídas · 500 listas para importar · 0 con error.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-015 — Una fila sobre el límite muestra A7 con 501 · **PASSED**

**Esperado:** La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. Se abre el selector de archivos. Se mantiene `1 Archivo`; aparece exactamente `El archivo tiene 501 filas con datos y el máximo es 500. Dividilo en varios archivos.`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se mantiene 1 Archivo; aparece exactamente El archivo tiene 501 filas con datos y el máximo es 500. Dividilo en varios archivos..
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-016 — Solo se lee la primera hoja · **PASSED**

**Esperado:** La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. Se abre el selector de archivos. Se mantiene `1 Archivo`; aparece exactamente `El archivo no tiene filas con datos debajo de los encabezados.`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se mantiene 1 Archivo; aparece exactamente El archivo no tiene filas con datos debajo de los encabezados..
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-017 — Los encabezados aceptan orden, mayúsculas, espacios y tildes distintos · **PASSED**

**Esperado:** La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. Se abre el selector de archivos. Se abre `2 Revisión`; muestra `1 fila leída · 1 lista para importar · 0 con error` y la tarjeta `Fila 2` está `Lista`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; muestra 1 fila leída · 1 lista para importar · 0 con error y la tarjeta Fila 2 está Lista.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-018 — Una columna desconocida se ignora y se informa · **BLOCKED**

**Esperado:** La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. Se abre el selector de archivos. Se abre `2 Revisión`; aparece exactamente `Se ignoraron las columnas: Comercio.` y `1 fila leída · 1 lista para importar · 0 con error`.

**Obtenido:**

```text
US-80 (Cuotas pendientes) no está implementada: la app informa «Se ignoraron las columnas: Cuotas pendientes, Comercio.» en lugar de solo «Comercio.»
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-019 — Un archivo ARS sin columnas opcionales deja la fila lista · **PASSED**

**Esperado:** La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. Se abre el selector de archivos. Se abre `2 Revisión`; `Fila 2` está `Lista` y muestra `$1.000,00`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 está Lista y muestra $1.000,00.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-020 — Sin columna Categoría un gasto muestra F14a · **PASSED**

**Esperado:** La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. Se abre el selector de archivos. Se abre `2 Revisión`; `Fila 2` está `Con error` y muestra exactamente `Falta la categoría (es obligatoria en un gasto)`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 está Con error y muestra exactamente Falta la categoría (es obligatoria en un gasto).
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-021 — El archivo de ejemplo conserva números de fila y omite la fila vacía 12 · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Se abre `2 Revisión`; muestra exactamente `11 filas leídas · 7 listas para importar · 4 con error`; existen tarjetas `Fila 2` a `Fila 11` y `Fila 13`, y no existe `Fila 12`. Existen `import-file-name`, `import-summary`, `import-summary-amounts`, `import-duplicates-warning`, `import-filter-errors`, `import-rows`, `import-row-2` con `data-status="ready"`, `import-row-7` con `data-status="error"`, `import-row-7-errors`, `import-change-file` e `import-submit`; `import-ignored-columns` no está porque no hay columnas desconocidas.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Existen import-file-name, import-summary, import-summary-amounts, import-duplicates-warning, import-filter-errors, import-rows, import-row-2 con data-status="ready", import-row-7 con data-status="error", import-row-7-errors, import-change-file e import-submit; import-ignored-columns no está porque no hay columnas desconocidas.
```

**Informe previo del equipo:** Falló: el resumen dice 12 filas leídas · 5 listas · 7 con error (el caso espera 11 · 7 · 4) y la Fila 2 aparece con error. Habría que revisar IMP-DATA-01.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-022 — F1: fecha vacía · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Falta la fecha`; `Importar 0 movimientos` está deshabilitado.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Falta la fecha; Importar 0 movimientos está deshabilitado.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-023 — F2: fecha inexistente · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Fecha inválida: usá DD/MM/AAAA`; `Importar 0 movimientos` está deshabilitado.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Fecha inválida: usá DD/MM/AAAA; Importar 0 movimientos está deshabilitado.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-024 — F3: fecha futura fija · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `La fecha no puede ser futura`; `Importar 0 movimientos` está deshabilitado.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente La fecha no puede ser futura; Importar 0 movimientos está deshabilitado.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-025 — F4: tipo vacío · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Falta el tipo`; `Importar 0 movimientos` está deshabilitado.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Falta el tipo; Importar 0 movimientos está deshabilitado.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-026 — F5: tipo inválido · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Tipo inválido: escribí Gasto o Ingreso`; `Importar 0 movimientos` está deshabilitado.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Tipo inválido: escribí Gasto o Ingreso; Importar 0 movimientos está deshabilitado.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-027 — F6: monto vacío · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Falta el monto`; `Importar 0 movimientos` está deshabilitado.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Falta el monto; Importar 0 movimientos está deshabilitado.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-028 — F7: monto no numérico · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Monto inválido: usá un número, por ejemplo 1234,56`; `Importar 0 movimientos` está deshabilitado.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Monto inválido: usá un número, por ejemplo 1234,56; Importar 0 movimientos está deshabilitado.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-029 — F8: monto cero · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `El monto debe ser mayor a cero`; `Importar 0 movimientos` está deshabilitado.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente El monto debe ser mayor a cero; Importar 0 movimientos está deshabilitado.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-030 — F9: monto con tres decimales · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `El monto admite hasta 2 decimales`; `Importar 0 movimientos` está deshabilitado.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente El monto admite hasta 2 decimales; Importar 0 movimientos está deshabilitado.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-031 — F10: monto sobre el máximo · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `El monto máximo es $999.999.999.999,99`; `Importar 0 movimientos` está deshabilitado.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente El monto máximo es $999.999.999.999,99; Importar 0 movimientos está deshabilitado.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-032 — F11: moneda vacía · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Falta la moneda`; `Importar 0 movimientos` está deshabilitado.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Falta la moneda; Importar 0 movimientos está deshabilitado.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-033 — F12: moneda EUR · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Moneda inválida: escribí ARS o USD`; `Importar 0 movimientos` está deshabilitado.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Moneda inválida: escribí ARS o USD; Importar 0 movimientos está deshabilitado.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-034 — F13a: USD sin tipo de cambio · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Falta el tipo de cambio`; `Importar 0 movimientos` está deshabilitado.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Falta el tipo de cambio; Importar 0 movimientos está deshabilitado.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-035 — F13b: ARS con tipo de cambio · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Una transacción en ARS no lleva tipo de cambio`; `Importar 0 movimientos` está deshabilitado.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Una transacción en ARS no lleva tipo de cambio; Importar 0 movimientos está deshabilitado.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-036 — F13c: tipo de cambio cero · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Tipo de cambio inválido: usá un número mayor a cero`; `Importar 0 movimientos` está deshabilitado.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Tipo de cambio inválido: usá un número mayor a cero; Importar 0 movimientos está deshabilitado.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-037 — F13d: tipo de cambio con cinco decimales · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Usá hasta 4 decimales en el tipo de cambio`; `Importar 0 movimientos` está deshabilitado.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Usá hasta 4 decimales en el tipo de cambio; Importar 0 movimientos está deshabilitado.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-038 — F13e: tipo de cambio sobre el máximo · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `El tipo de cambio es demasiado grande`; `Importar 0 movimientos` está deshabilitado.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente El tipo de cambio es demasiado grande; Importar 0 movimientos está deshabilitado.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-039 — F14a: gasto sin categoría · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Falta la categoría (es obligatoria en un gasto)`; `Importar 0 movimientos` está deshabilitado.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Falta la categoría (es obligatoria en un gasto); Importar 0 movimientos está deshabilitado.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-040 — F14b: categoría inexistente · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `No existe la categoría «Mascotas» o está archivada`; `Importar 0 movimientos` está deshabilitado.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente No existe la categoría «Mascotas» o está archivada; Importar 0 movimientos está deshabilitado.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-041 — F14c: cuenta vacía · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Falta la cuenta`; `Importar 0 movimientos` está deshabilitado.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Falta la cuenta; Importar 0 movimientos está deshabilitado.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-042 — F14d: cuenta inexistente · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `No existe la cuenta «Banco X» o está archivada`; `Importar 0 movimientos` está deshabilitado.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente No existe la cuenta «Banco X» o está archivada; Importar 0 movimientos está deshabilitado.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-043 — F14e: trece cuotas · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Las cuotas van de 1 a 12`; `Importar 0 movimientos` está deshabilitado.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Las cuotas van de 1 a 12; Importar 0 movimientos está deshabilitado.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-044 — F15: cuotas en cuenta no crédito · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Solo los gastos con tarjeta de crédito admiten cuotas`; `Importar 0 movimientos` está deshabilitado.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Solo los gastos con tarjeta de crédito admiten cuotas; Importar 0 movimientos está deshabilitado.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-045 — F16: equivalente ARS sobre el máximo · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `En pesos daría más que el máximo de $999.999.999.999,99`; `Importar 0 movimientos` está deshabilitado.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente En pesos daría más que el máximo de $999.999.999.999,99; Importar 0 movimientos está deshabilitado.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-046 — F17: cuota base menor a un centavo · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `Con ese monto, cada cuota daría menos de 0,01`; `Importar 0 movimientos` está deshabilitado.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Con ese monto, cada cuota daría menos de 0,01; Importar 0 movimientos está deshabilitado.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-047 — F18: equivalente ARS menor a un centavo · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Se abre `2 Revisión`; `Fila 2` queda `Con error` y muestra exactamente `En pesos daría menos de $0,01. Revisá el monto o el tipo de cambio`; `Importar 0 movimientos` está deshabilitado.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente En pesos daría menos de $0,01. Revisá el monto o el tipo de cambio; Importar 0 movimientos está deshabilitado.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-048 — Errores de varias columnas conservan el orden de reglas · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. `Fila 2` queda `Con error`; aparecen, en este orden y una vez: `Fecha inválida: usá DD/MM/AAAA`, `El monto debe ser mayor a cero`, `No existe la cuenta «Banco X» o está archivada`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Fila 2 queda Con error; aparecen, en este orden y una vez: Fecha inválida: usá DD/MM/AAAA, El monto debe ser mayor a cero, No existe la cuenta «Banco X» o está archivada.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-049 — Moneda inválida oculta el error dependiente de tipo de cambio · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. La fila muestra solo `Moneda inválida: escribí ARS o USD`; no aparece otro mensaje de tipo de cambio.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: La fila muestra solo Moneda inválida: escribí ARS o USD; no aparece otro mensaje de tipo de cambio.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-050 — Tipo inválido oculta categoría obligatoria · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. La fila muestra solo `Tipo inválido: escribí Gasto o Ingreso`; no aparece otro mensaje de categoría.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: La fila muestra solo Tipo inválido: escribí Gasto o Ingreso; no aparece otro mensaje de categoría.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-051 — Cuenta inválida oculta la regla de cuotas · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. La fila muestra solo `No existe la cuenta «Banco X» o está archivada`; no aparece otro mensaje de cuotas.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: La fila muestra solo No existe la cuenta «Banco X» o está archivada; no aparece otro mensaje de cuotas.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-052 — Nombres, tipo y moneda aceptan espacios y mayúsculas · **FAILED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. `Fila 2` está `Lista`; muestra `Gasto`, `US$10,00`, `Educación`, `Efectivo` y `TC 1.450,00`.

**Obtenido:**

```text
Fila 2 Lista 01/09/2026 · Gasto · educación · efectivo · TC 1.450,00 US$10,00
```

**Defectos:** DEF-033
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-053 — Una categoría sin tilde no coincide con Educación · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. `Fila 2` muestra exactamente `No existe la categoría «Educacion» o está archivada`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Fila 2 muestra exactamente No existe la categoría «Educacion» o está archivada.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-054 — Categoría archivada no se acepta aunque el nombre coincida · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. `Fila 2` muestra exactamente `No existe la categoría «Otros» o está archivada`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Fila 2 muestra exactamente No existe la categoría «Otros» o está archivada.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-055 — La fecha exacta del día de Argentina queda lista · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. `Fila 2` está `Lista` y muestra `12/10/2026`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Fila 2 está Lista y muestra 12/10/2026.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-056 — El día siguiente de Argentina muestra F3 · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. `Fila 2` muestra exactamente `La fecha no puede ser futura`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Fila 2 muestra exactamente La fecha no puede ser futura.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-057 — Una celda de fecha con hora usa solo el día · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. `Fila 2` está `Lista` y muestra `05/09/2026`, sin hora.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Fila 2 está Lista y muestra 05/09/2026, sin hora.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-058 — Un serial numérico sin formato de fecha muestra F2 · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. `Fila 2` muestra exactamente `Fecha inválida: usá DD/MM/AAAA`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Fila 2 muestra exactamente Fecha inválida: usá DD/MM/AAAA.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-059 — El texto 1.500 se interpreta como mil quinientos · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. `Fila 2` está `Lista` y muestra exactamente `$1.500,00`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Fila 2 está Lista y muestra exactamente $1.500,00.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-060 — El texto 1234.56 se interpreta con dos decimales · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. `Fila 2` está `Lista` y muestra exactamente `$1.234,56`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Fila 2 está Lista y muestra exactamente $1.234,56.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-061 — La fórmula 0,1 por 3 se redondea a quince dígitos · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. `Fila 2` está `Lista` y muestra exactamente `$0,30`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Fila 2 está Lista y muestra exactamente $0,30.
Nota: Sin fórmula real: celda numérica con el valor guardado 0,30000000000000004
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-062 — La fórmula 100 dividido 3 muestra F9 · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. `Fila 2` está `Con error` y muestra exactamente `El monto admite hasta 2 decimales`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Fila 2 está Con error y muestra exactamente El monto admite hasta 2 decimales.
Nota: Sin fórmula real: celda numérica con el valor guardado 33,3333333333333
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-063 — El resumen del archivo de ejemplo suma solo las siete filas listas · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Se ve exactamente `Vas a importar 7 movimientos: $324.915,50 en gastos y $850.000,00 en ingresos (en pesos).`

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se ve exactamente Vas a importar 7 movimientos: $324.915,50 en gastos y $850.000,00 en ingresos (en pesos).
```

**Informe previo del equipo:** Con la plantilla de IMP-DATA-01 dan 6 filas con error. Chequear.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-064 — El filtro muestra solo las cuatro filas con error · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. El filtro `Ver solo filas con error` está apagado y se ven 11 tarjetas. Queda encendido; solo se ven `Fila 7`, `Fila 8`, `Fila 9` y `Fila 10`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Queda encendido; solo se ven Fila 7, Fila 8, Fila 9 y Fila 10.
```

**Informe previo del equipo:** Falló: sin filtro se ven 12 tarjetas; con filtro, las filas 2, 8, 9, 10, 11 y 12.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-065 — El filtro está deshabilitado cuando no hay errores · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. `Ver solo filas con error` está apagado y deshabilitado; `Fila 2` está `Lista`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Ver solo filas con error está apagado y deshabilitado; Fila 2 está Lista.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-066 — Elegir otro archivo no persiste filas revisadas · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Se abre `2 Revisión` con una fila lista. Vuelve a `1 Archivo`; no aparece nombre ni resumen. Transacciones e imputaciones responden HTTP 200 con `[]`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Transacciones e imputaciones responden HTTP 200 con [].
```

**Informe previo del equipo:** No lo pudo hacer.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-067 — Recargar en Revisión vuelve a Archivo sin persistir · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Se abre `2 Revisión` con el archivo. Se ve `1 Archivo`; no aparece el archivo ni su resumen. Transacciones e imputaciones responden HTTP 200 con `[]`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Transacciones e imputaciones responden HTTP 200 con [].
```

**Informe previo del equipo:** No lo pudo hacer.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-068 — Cero filas listas deshabilita Importar 0 movimientos · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Se ve `Importar 0 movimientos` deshabilitado y `No hay filas listas para importar`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se ve Importar 0 movimientos deshabilitado y No hay filas listas para importar.
```

**Informe previo del equipo:** El botón «Importar 0 movimientos» está deshabilitado, pero aparece «El monto debe ser mayor a 0» (no figura en el caso).
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-069 — Una fila lista usa los plurales singulares · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Se ve exactamente `1 fila leída · 1 lista para importar · 0 con error`, `Vas a importar 1 movimiento: $1.000,00 en gastos y $0,00 en ingresos (en pesos).` y `Importar 1 movimiento` habilitado.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se ve exactamente 1 fila leída · 1 lista para importar · 0 con error, Vas a importar 1 movimiento: $1.000,00 en gastos y $0,00 en ingresos (en pesos). y Importar 1 movimiento habilitado.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-070 — Confirmar importa solo las filas listas con todos sus campos · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. `3 filas leídas · 2 listas para importar · 1 con error`. Se ve `Se importaron 2 de 3 filas.`, `$1.000,00 en gastos y $2.000,00 en ingresos (en pesos).` y `Fila 4: El monto debe ser mayor a cero`. Existen exactamente las transacciones de filas 2 y 3 con sus nueve campos exactos; descripción de fila 3 es null; no existe transacción para fila 4.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Existen exactamente las transacciones de filas 2 y 3 con sus nueve campos exactos; descripción de fila 3 es null; no existe transacción para fila 4.
```

**Informe previo del equipo:** Todo ok hasta el paso 11; el 12 no lo pudo hacer.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-071 — Una nota vacía se guarda como descripción nula · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Una fila lista. Se ve `Se importó 1 de 1 fila.` La única transacción tiene `description:null`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: La única transacción tiene description:null.
```

**Informe previo del equipo:** No pudo hacer el paso 12.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-072 — La compra de 240.000 en seis cuotas crea seis imputaciones exactas · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. `Fila 2` está `Lista`; muestra `$240.000,00` y `6 cuotas`. Se ve `Se importó 1 de 1 fila.` y `$240.000,00 en gastos y $0,00 en ingresos (en pesos).` La transacción tiene `amount=240000.00`, seis imputaciones `40000.00`, números 1–6, en `2026-09-01` a `2027-02-01`; suman `240000.00`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: La transacción tiene amount=240000.00, seis imputaciones 40000.00, números 1–6, en 2026-09-01 a 2027-02-01; suman 240000.00.
```

**Informe previo del equipo:** No pudo hacer el paso 12.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-073 — El archivo de ejemplo produce el resultado y destino exactos · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Se ve `Importar 7 movimientos`. Se ve `Se importaron 7 de 11 filas.`, `$324.915,50 en gastos y $850.000,00 en ingresos (en pesos).`, y las cuatro líneas exactas de filas 7–10. Existen `import-result-title`, `import-result-amounts`, `import-result-rejected`, `import-result-row-7`, `import-result-row-8`, `import-result-row-9`, `import-result-row-10`, `import-go-transactions` e `import-again`; no existe `import-result-already`. La URL termina en `/transactions?period=2026-09`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: La URL termina en /transactions?period=2026-09.
```

**Informe previo del equipo:** Sin respuesta en el mensaje.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-074 — Un rechazo tardío de categoría no impide las otras filas · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Fila 6 está `Lista` con `Transporte`. Ajustes muestra la categoría archivada. Se ve `Se importaron 6 de 11 filas.`, `$321.715,50 en gastos y $850.000,00 en ingresos (en pesos).` y `Fila 6: No existe la categoría «Transporte» o está archivada`; las demás válidas se importan.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se ve Se importaron 6 de 11 filas., $321.715,50 en gastos y $850.000,00 en ingresos (en pesos). y Fila 6: No existe la categoría «Transporte» o está archivada; las demás válidas se importan.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-075 — Importar no cambia la cuenta precargada de Registrar · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Una fila lista. Se ve Resultado. Se abre Registrar. El monto muestra `10` y se habilita `Siguiente`. Se abre `¿En qué?`. Se abre `Revisá y guardá`. Está seleccionada `Cuenta bancaria`, no `Efectivo`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Está seleccionada Cuenta bancaria, no Efectivo.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-076 — Quinientas filas de doce cuotas terminan en menos de diez segundos · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. `500 filas leídas · 500 listas para importar · 0 con error`. El cronómetro comienza en `0,0 s`. Muestra `Importando…` deshabilitado. El cronómetro se detiene. El tiempo es menor a `10,0 s` y se ve `Se importaron 500 de 500 filas.`

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: El tiempo es menor a 10,0 s y se ve Se importaron 500 de 500 filas.
Nota: Local (no Vercel/Supabase hosteado): 0.9 s
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-077 — La RPC procesa una válida y rechaza tres inválidas · **PASSED**

**Esperado:** HTTP 200; `sent_rows:4`, `imported_rows:1`; fila 1 tiene `status:"imported"` y un `transaction_id`; fila 2 tiene `status:"rejected"`, `error_code:"23514"`, `error_message:"I4: el monto debe ser mayor a cero"`; fila 3 tiene `status:"rejected"`, `error_code:"23503"`, `error_message:"la cuenta no existe, no es tuya o está archivada"`; fila 4 tiene `status:"rejected"` y `error_code:"22P02"`. Existe solo la transacción e imputación de fila 1.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Existe solo la transacción e imputación de fila 1.
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-078 — La RPC rechaza un lote vacío · **PASSED**

**Esperado:** HTTP no exitoso de clase 4xx; no hay resultado de lote; el número de status HTTP y el body se registran como evidencia porque la especificación no fija su mapeo ni un `code`. No hay transacciones, imputaciones ni import con ese UUID.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: No hay transacciones, imputaciones ni import con ese UUID.
— Observado en la corrida —
HTTP 400 {"code":"23514","details":null,"hint":null,"message":"una importación lleva de 1 a 500 filas"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-079 — La RPC rechaza un lote de 501 elementos · **PASSED**

**Esperado:** HTTP no exitoso de clase 4xx; no hay resultado de lote; el número de status HTTP y el body se registran como evidencia porque la especificación no fija su mapeo ni un `code`. No hay transacciones, imputaciones ni import.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: No hay transacciones, imputaciones ni import.
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-080 — El rol anon no puede ejecutar import_transactions · **PASSED**

**Esperado:** HTTP no exitoso de clase 4xx; JSON `code:"42501"` y mensaje de permiso denegado; no se crea nada; el número de status HTTP se registra como evidencia porque la especificación no fija su mapeo.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: HTTP no exitoso de clase 4xx; JSON code:"42501" y mensaje de permiso denegado; no se crea nada; el número de status HTTP se registra como evidencia porque la especificación no fija su mapeo.
— Observado en la corrida —
HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function import_transactions"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-081 — Otro usuario no ve transacciones ni imports ajenos · **PASSED**

**Esperado:** HTTP 200 y cuerpo exacto `[]`. HTTP 200 y cuerpo exacto `[]`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: HTTP 200 y cuerpo exacto [].
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-082 — Dos clicks rápidos generan una sola llamada y transacción · **BLOCKED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Una fila lista. `import-submit` muestra `Importando…` deshabilitado; `import-change-file` y `import-guide-open` están deshabilitados; Network registra una sola llamada a `/rpc/import_transactions`. Se ve `Se importó 1 de 1 fila.`; existe una sola transacción.

**Obtenido:**

```text
US-81 (guía «¿Cómo armo el archivo?») no está implementada: el caso también pide que `import-guide-open` esté deshabilitado. Verificado: 1 sola llamada a /rpc/import_transactions, «Importando…» deshabilitado y una sola transacción
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-083 — Reintento tras respuesta perdida reconoce lo guardado · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre DevTools. Se ve el prompt de la consola. La consola devuelve exactamente `83838383-0000-4000-8000-000000000083`. Se abre el selector. Se ve una fila `Lista` y el botón `Importar 1 movimiento`. DevTools muestra `Offline`. Se muestra exactamente `No pudimos confirmar la importación. Puede que se haya guardado: tocá Reintentar y te decimos qué pasó.` y el botón `Reintentar`; la revisión y el nombre del archivo siguen visibles. DevTools muestra `No throttling`. Se abre el paso 3 y `import-result-already` muestra exactamente `Esta importación ya se había guardado.`. Hay exactamente una transacción de `1000.00` ARS, una imputación de `1000.00` para `2026-09-01` y un import con UUID `83838383-0000-4000-8000-000000000083`; no se creó un duplicado. La consola devuelve `true`; `crypto.randomUUID()` vuelve a generar UUID variables.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: La consola devuelve true; crypto.randomUUID() vuelve a generar UUID variables.
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-084 — Reintento tras corte previo al envío importa una sola vez · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Una fila lista. Offline. Mensaje de no confirmación; no hay transacción. Online. `Se importó 1 de 1 fila.` sin aviso de ya guardado; una transacción.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se importó 1 de 1 fila. sin aviso de ya guardado; una transacción.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-085 — Dos llamadas API con el mismo import_id son idempotentes · **PASSED**

**Esperado:** HTTP 200; `already_imported:false`; guardar transaction_id. HTTP 200; `already_imported:true`; mismo transaction_id y resultado. Una transacción, una imputación y un import.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Una transacción, una imputación y un import.
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-086 — Sin respuesta conserva Revisión · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Una fila lista. DevTools muestra Offline. Sigue en Revisión; muestra exactamente `No pudimos confirmar la importación. Puede que se haya guardado: tocá Reintentar y te decimos qué pasó.`; botón `Reintentar`. No hay transacciones ni imputaciones.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: No hay transacciones ni imputaciones.
```

**Informe previo del equipo:** Probó hasta el paso 12; el 13 no sabe cómo hacerlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-087 — Sesión vencida ofrece volver a entrar · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Una fila lista. Sigue en Revisión; muestra exactamente `Tu sesión venció y no se importó ninguna fila. Volvé a entrar y subí el archivo de nuevo.`; botón `Volver a entrar`. No hay transacciones ni imputaciones.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: No hay transacciones ni imputaciones.
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-088 — Timeout de base informa lote grande · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Una fila lista. Sigue en Revisión; muestra exactamente `La importación tardó demasiado y no se importó ninguna fila. Dividí el archivo en partes más chicas.`; botón `Reintentar`. No hay transacciones ni imputaciones.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: No hay transacciones ni imputaciones.
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-089 — Otro error usa mensaje genérico · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Una fila lista. Sigue en Revisión; muestra exactamente `No se importó ninguna fila. Probá de nuevo en un rato.`; botón `Reintentar`. No hay transacciones ni imputaciones.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: No hay transacciones ni imputaciones.
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-090 — Quedarme conserva el estado pendiente · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Una fila lista. DevTools muestra Offline. Aparece el mensaje exacto de no confirmación. `import-leave-dialog` muestra `¿Salir sin saber si se importó?`, el texto `Puede que la importación se haya guardado. Si salís, revisá Movimientos antes de volver a importar este archivo.`, `import-leave-stay` y `import-leave-confirm`. Sigue `/import`, con archivo, resumen, mensaje y `Reintentar`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Sigue /import, con archivo, resumen, mensaje y Reintentar.
```

**Informe previo del equipo:** Falta aclarar en el caso que hay que tocar «Elegir otro archivo» para que se cumpla el paso 13.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-091 — Salir igual navega al destino solicitado · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Una fila lista. DevTools muestra Offline. Aparece el mensaje exacto de no confirmación. Se abre el diálogo `¿Salir sin saber si se importó?`. Navega a `/register`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Navega a /register.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-092 — Recargar con importación incierta muestra aviso nativo · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Una fila lista. DevTools muestra Offline. Aparece el mensaje exacto de no confirmación. El navegador muestra su aviso nativo de cambios sin guardar; no recarga aún.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: El navegador muestra su aviso nativo de cambios sin guardar; no recarga aún.
— Observado en la corrida —
beforeunload: defaultPrevented=true; diálogo nativo=beforeunload
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-093 — Compra empezada conserva solo tres cuotas desde H · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Fila 2 `Lista`; `Faltan 3 de 6 cuotas ($60.000,00)` en `import-row-2-pending`. Resultado: `Se importó 1 de 1 fila.` y `$60.000,00 en gastos...` Transacción: amount `60000.00`, installments_count 6, installments_paid 3, occurred_on `2026-06-10`, first_period `2026-10-01`; cuotas 4–6 de `20000.00` en octubre–diciembre.

**Obtenido:**

```text
US-80 (Cuotas pendientes) no está implementada: no existe `import-row-2-pending` («Faltan 3 de 6 cuotas ($60.000,00)») y el resumen suma Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos).
— Observado en la corrida —
Fila 2: ready · «Fila 2 Lista 10/06/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-094 — Movimientos muestra 4/6 a 6/6 solo desde H · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Fila lista. Resultado. URL `/transactions?period=2026-10`; muestra `4/6`, `$20.000,00`. Muestra `5/6`, `$20.000,00`. Muestra `6/6`, `$20.000,00`. La compra no aparece. La compra no aparece. La compra no aparece. La compra no aparece. La compra no aparece.

**Obtenido:**

```text
US-80 (Cuotas pendientes) no está implementada: la importación todavía no desplaza las cuotas ni muestra «Faltan 3 de 6»; Movimientos mostraría las 6 cuotas desde junio
— Observado en la corrida —
Fila 2: ready · «Fila 2 Lista 10/06/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado
```

**Informe previo del equipo:** No falló, pero el paso a paso está mal redactado: si la compra fue en junio, la compra aparece hasta diciembre.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-095 — El resto queda en la última cuota pendiente · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Muestra `Faltan 2 de 3 cuotas ($66.666,67)`. Resultado suma `$66.666,67`. Transacción amount `66666.67`; cuota 2/3 `33333.33` en `2026-10-01`; 3/3 `33333.34` en `2026-11-01`; suma exacta `66666.67`.

**Obtenido:**

```text
US-80 (Cuotas pendientes) no está implementada: no muestra «Faltan 2 de 3 cuotas ($66.666,67)»; el resumen suma Vas a importar 1 movimiento: $100.000,00 en gastos y $0,00 en ingresos (en pesos).
— Observado en la corrida —
Fila 2: ready · «Fila 2 Lista 15/09/2026 · Gasto · Otros · Tarjeta de crédito · 3 cuotas $100.000,00» · Vas a importar 1 movimiento: $100.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado
```

**Informe previo del equipo:** Falló: no se cumple a partir del paso 10.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-096 — P igual a N desplaza todas las cuotas a H · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Muestra `Faltan 6 de 6 cuotas ($120.000,00)`. Resultado suma `$120.000,00`. amount `120000.00`, installments_paid 0, first_period `2026-10-01`; cuotas 1–6 de `20000.00` entre octubre 2026 y marzo 2027.

**Obtenido:**

```text
US-80 (Cuotas pendientes) no está implementada: no muestra «Faltan 6 de 6 cuotas ($120.000,00)»; no existe el campo `installments_paid`
— Observado en la corrida —
Fila 2: ready · «Fila 2 Lista 15/09/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado
```

**Informe previo del equipo:** Falló a partir del paso 10 (la suma sí es correcta); no pudo ejecutar el paso 12.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-097 — Cuotas pendientes vacía conserva calendario normal · **DUDA**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Fila lista; muestra `6 cuotas`, no texto `Faltan`. Resultado suma `$240.000,00`. Seis cuotas de `40000.00` desde `2026-09-01` a `2027-02-01`; installments_paid null.

**Obtenido:**

```text
Pasa con la app actual, pero también pasaría sin US-80 (la columna `installments_paid` no existe y no se pudo verificar que sea null); el caso no prueba nada hasta que US-80 esté implementada
— Observado en la corrida —
Fila 2: ready · «Fila 2 Lista 15/09/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $240.000,00» · Vas a importar 1 movimiento: $240.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado
```

**Informe previo del equipo:** No pudo ejecutar el paso 12.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-098 — Sin columna Cuotas pendientes conserva calendario normal · **DUDA**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Fila lista; `6 cuotas`. Resultado suma `$240.000,00`. Seis cuotas de `40000.00`, septiembre 2026 a febrero 2027; installments_paid null.

**Obtenido:**

```text
Pasa con la app actual, pero también pasaría sin US-80 (no se pudo verificar installments_paid null: la columna no existe)
```

**Informe previo del equipo:** No pudo ejecutar el paso 12.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-099 — F19 con Cuotas vacía · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Fila 2 `Con error`; muestra exactamente `Las cuotas pendientes solo van en una compra en cuotas`; importar está deshabilitado.

**Obtenido:**

```text
US-80 (Cuotas pendientes) no está implementada: la app ignora la columna «Cuotas pendientes»: no muestra «Las cuotas pendientes solo van en una compra en cuotas» y el botón queda «Importar 1 movimiento»
— Observado en la corrida —
Fila 2: ready · «Fila 2 Lista 01/09/2026 · Gasto · Otros · Tarjeta de crédito $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado
```

**Informe previo del equipo:** Falló: «Importar» queda habilitado y no hay mensaje de error; la app ignora la columna «Cuotas pendientes».
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-100 — F19 con Cuotas igual a uno · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Fila 2 `Con error`; muestra exactamente `Las cuotas pendientes solo van en una compra en cuotas`; importar está deshabilitado.

**Obtenido:**

```text
US-80 (Cuotas pendientes) no está implementada: la app ignora la columna «Cuotas pendientes»: no muestra «Las cuotas pendientes solo van en una compra en cuotas» y el botón queda «Importar 1 movimiento»
— Observado en la corrida —
Fila 2: ready · «Fila 2 Lista 01/09/2026 · Gasto · Otros · Tarjeta de crédito $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado
```

**Informe previo del equipo:** Falló: «Importar» queda habilitado y no hay mensaje de error; la app ignora la columna «Cuotas pendientes».
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-101 — F20 con pendientes cero · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Fila 2 `Con error`; muestra exactamente `Las cuotas pendientes van de 1 a 6`; importar está deshabilitado.

**Obtenido:**

```text
US-80 (Cuotas pendientes) no está implementada: la app ignora la columna «Cuotas pendientes»: no muestra «Las cuotas pendientes van de 1 a 6» y el botón queda «Importar 1 movimiento»
— Observado en la corrida —
Fila 2: ready · «Fila 2 Lista 01/09/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado
```

**Informe previo del equipo:** Falló: «Importar» queda habilitado y no hay mensaje de error; la app ignora la columna «Cuotas pendientes».
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-102 — F20 con pendientes menos uno · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Fila 2 `Con error`; muestra exactamente `Las cuotas pendientes van de 1 a 6`; importar está deshabilitado.

**Obtenido:**

```text
US-80 (Cuotas pendientes) no está implementada: la app ignora la columna «Cuotas pendientes»: no muestra «Las cuotas pendientes van de 1 a 6» y el botón queda «Importar 1 movimiento»
— Observado en la corrida —
Fila 2: ready · «Fila 2 Lista 01/09/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado
```

**Informe previo del equipo:** Falló: «Importar» queda habilitado y no hay mensaje de error; la app ignora la columna «Cuotas pendientes».
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-103 — F20 con pendientes siete · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Fila 2 `Con error`; muestra exactamente `Las cuotas pendientes van de 1 a 6`; importar está deshabilitado.

**Obtenido:**

```text
US-80 (Cuotas pendientes) no está implementada: la app ignora la columna «Cuotas pendientes»: no muestra «Las cuotas pendientes van de 1 a 6» y el botón queda «Importar 1 movimiento»
— Observado en la corrida —
Fila 2: ready · «Fila 2 Lista 01/09/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado
```

**Informe previo del equipo:** Falló: «Importar» queda habilitado y no hay mensaje de error; la app ignora la columna «Cuotas pendientes».
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-104 — F20 con pendientes decimal · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Fila 2 `Con error`; muestra exactamente `Las cuotas pendientes van de 1 a 6`; importar está deshabilitado.

**Obtenido:**

```text
US-80 (Cuotas pendientes) no está implementada: la app ignora la columna «Cuotas pendientes»: no muestra «Las cuotas pendientes van de 1 a 6» y el botón queda «Importar 1 movimiento»
— Observado en la corrida —
Fila 2: ready · «Fila 2 Lista 01/09/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado
```

**Informe previo del equipo:** Falló: «Importar» queda habilitado y no hay mensaje de error; la app ignora la columna «Cuotas pendientes».
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-105 — F20 con pendientes textual · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Fila 2 `Con error`; muestra exactamente `Las cuotas pendientes van de 1 a 6`; importar está deshabilitado.

**Obtenido:**

```text
US-80 (Cuotas pendientes) no está implementada: la app ignora la columna «Cuotas pendientes»: no muestra «Las cuotas pendientes van de 1 a 6» y el botón queda «Importar 1 movimiento»
— Observado en la corrida —
Fila 2: ready · «Fila 2 Lista 01/09/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado
```

**Informe previo del equipo:** Falló: «Importar» queda habilitado y no hay mensaje de error; la app ignora la columna «Cuotas pendientes».
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-106 — F20 acepta el mínimo pendiente uno · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Fila 2 `Lista`; muestra `Falta 1 de 6 cuotas ($20.000,00)`.

**Obtenido:**

```text
US-80 (Cuotas pendientes) no está implementada: no muestra «Falta 1 de 6 cuotas ($20.000,00)»; la fila muestra «Fila 2 Lista 01/05/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00»
— Observado en la corrida —
Fila 2: ready · «Fila 2 Lista 01/05/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado
```

**Informe previo del equipo:** Falló: «Importar» queda habilitado y no hay mensaje de error; la app ignora la columna «Cuotas pendientes».
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-107 — F20 acepta el máximo pendiente seis · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Fila 2 `Lista`; muestra `Faltan 6 de 6 cuotas ($120.000,00)`.

**Obtenido:**

```text
US-80 (Cuotas pendientes) no está implementada: no muestra «Faltan 6 de 6 cuotas ($120.000,00)»; la fila muestra «Fila 2 Lista 01/09/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00»
— Observado en la corrida —
Fila 2: ready · «Fila 2 Lista 01/09/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado
```

**Informe previo del equipo:** Falló: «Importar» queda habilitado y no hay mensaje de error; la app ignora la columna «Cuotas pendientes».
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-108 — F21 acepta K igual a meses transcurridos · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Fila 2 `Lista`; muestra `Faltan 3 de 6 cuotas ($60.000,00)`.

**Obtenido:**

```text
US-80 (Cuotas pendientes) no está implementada: no muestra «Faltan 3 de 6 cuotas ($60.000,00)»; la fila muestra «Fila 2 Lista 15/07/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00»
— Observado en la corrida —
Fila 2: ready · «Fila 2 Lista 15/07/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado
```

**Informe previo del equipo:** Falló: «Importar» queda habilitado y no hay mensaje de error; la app ignora la columna «Cuotas pendientes».
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-109 — F21 rechaza K un mes sobre lo posible · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Muestra exactamente `Con esa fecha todavía no puede haber 3 cuotas pagadas`.

**Obtenido:**

```text
US-80 (Cuotas pendientes) no está implementada: la app ignora la columna «Cuotas pendientes»: no muestra «Con esa fecha todavía no puede haber 3 cuotas pagadas» y el botón queda «Importar 1 movimiento»
— Observado en la corrida —
Fila 2: ready · «Fila 2 Lista 15/08/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado
```

**Informe previo del equipo:** Falló: «Importar» queda habilitado y no hay mensaje de error; la app ignora la columna «Cuotas pendientes».
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-110 — F21 usa singular para una cuota pagada imposible · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Muestra exactamente `Con esa fecha todavía no puede haber 1 cuota pagada`.

**Obtenido:**

```text
US-80 (Cuotas pendientes) no está implementada: la app ignora la columna «Cuotas pendientes»: no muestra «Con esa fecha todavía no puede haber 1 cuota pagada» y el botón queda «Importar 1 movimiento»
— Observado en la corrida —
Fila 2: ready · «Fila 2 Lista 12/10/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado
```

**Informe previo del equipo:** Falló: «Importar» queda habilitado y no hay mensaje de error; la app ignora la columna «Cuotas pendientes».
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-111 — F15 oculta F20 con cuenta Efectivo · **DUDA**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Muestra solo `Solo los gastos con tarjeta de crédito admiten cuotas`; no muestra F20 ni F21.

**Obtenido:**

```text
Pasa con la app actual, pero también pasaría sin US-80 (no hay regla F20/F21 que ocultar); el caso no prueba nada hasta que US-80 esté implementada
— Observado en la corrida —
Fila 2: error · Solo los gastos con tarjeta de crédito admiten cuotas · «Fila 2 Con error 01/09/2026 · Gasto · Otros · Efectivo · 3 cuotas $120.000,00 Solo los gastos con tarjeta de crédito admiten cuotas» · Vas a importar 0 movimientos: $0,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 0 movimientos» deshabilitado
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-112 — F14e oculta reglas de cuotas pendientes · **DUDA**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Muestra solo `Las cuotas van de 1 a 12`; no muestra F20 ni F21.

**Obtenido:**

```text
Pasa con la app actual, pero también pasaría sin US-80 (no hay regla F20/F21 que ocultar); el caso no prueba nada hasta que US-80 esté implementada
— Observado en la corrida —
Fila 2: error · Las cuotas van de 1 a 12 · «Fila 2 Con error 01/09/2026 · Gasto · Otros · Tarjeta de crédito $120.000,00 Las cuotas van de 1 a 12» · Vas a importar 0 movimientos: $0,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 0 movimientos» deshabilitado
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-113 — USD sin resto conserva solo la cuota 3/3 · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Muestra `Falta 1 de 3 cuotas (US$100,00)`. Resultado `$100.000,00` en gastos. Transacción amount `100.00`, amount_ars `100000.00`; una cuota 3/3 de `100.00` y `100000.00` en octubre.

**Obtenido:**

```text
US-80 (Cuotas pendientes) no está implementada: no muestra «Falta 1 de 3 cuotas (US$100,00)»; el resumen suma Vas a importar 1 movimiento: $300.000,00 en gastos y $0,00 en ingresos (en pesos).
— Observado en la corrida —
Fila 2: ready · «Fila 2 Lista 15/08/2026 · Gasto · Otros · Tarjeta de crédito · TC 1.000,00 · 3 cuotas US$300,00» · Vas a importar 1 movimiento: $300.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado
```

**Informe previo del equipo:** No pudo hacer el paso 12.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-114 — USD con resto reparte ARS exacto entre dos cuotas · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Muestra `Faltan 2 de 3 cuotas (US$66,67)` y `Vas a importar 1 movimiento: $66.670,00 en gastos...`. Resultado suma `$66.670,00`. Cuotas 2/3 `33.33` y 3/3 `33.34`; cada amount_ars `33335.00`; suma `66670.00` igual a amount_ars.

**Obtenido:**

```text
US-80 (Cuotas pendientes) no está implementada: no muestra «Faltan 2 de 3 cuotas (US$66,67)»; el resumen suma Vas a importar 1 movimiento: $100.000,00 en gastos y $0,00 en ingresos (en pesos).
— Observado en la corrida —
Fila 2: ready · «Fila 2 Lista 15/09/2026 · Gasto · Otros · Tarjeta de crédito · TC 1.000,00 · 3 cuotas US$100,00» · Vas a importar 1 movimiento: $100.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado
```

**Informe previo del equipo:** Falló a partir del paso 10: ignora la columna «Cuotas pendientes».
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-115 — Paso 2 y Resultado muestran el mismo saldo pendiente · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Exactamente `Vas a importar 1 movimiento: $60.000,00 en gastos y $0,00 en ingresos (en pesos).` Exactamente `$60.000,00 en gastos y $0,00 en ingresos (en pesos).`

**Obtenido:**

```text
US-80 (Cuotas pendientes) no está implementada: el resumen dice «Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos).» en lugar de $60.000,00 (la app toma las 6 cuotas, $120.000,00)
— Observado en la corrida —
Fila 2: ready · «Fila 2 Lista 10/06/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado
```

**Informe previo del equipo:** Está ok, pero los pasos 10 y 11 están mal redactados porque el monto del pre-requisito es $120.000.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-116 — Resumen cuenta la cuota heredada de una compra empezada · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Fila lista. Resultado exitoso. Resumen de octubre de 2026 muestra `Cuotas de meses anteriores` por `$20.000,00`.

**Obtenido:**

```text
US-80 (Cuotas pendientes) no está implementada: el Resumen de octubre no tendría «Cuotas de meses anteriores» por $20.000,00: sin US-80 la compra se imputa desde junio y no hay cuota heredada de ese monto
— Observado en la corrida —
Fila 2: ready · «Fila 2 Lista 10/06/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-117 — Borrado enumera solo imputaciones guardadas no cerradas · **BLOCKED**

**Esperado:** Se ve la compra como `5/6`. Se muestran las acciones del movimiento. El diálogo lista solo octubre de 2026, cuota `4/6`, `$20.000,00`; no lista junio–septiembre ni recalcula seis cuotas.

**Obtenido:**

```text
US-80 (Cuotas pendientes) no está implementada: create_transaction no tiene el parámetro p_installments_paid y el borrado no puede listar solo las cuotas no cerradas de una compra empezada. El caso además exige avanzar el reloj del dominio al 12/11/2026, que no se puede en el entorno
```

**Informe previo del equipo:** No puede testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-118 — installments_paid igual al total se rechaza · **BLOCKED**

**Esperado:** HTTP 400; JSON `code:"23514"`, `message:"Las cuotas ya pagadas tienen que ser menos que el total de cuotas"`. No hay transacciones ni imputaciones.

**Obtenido:**

```text
US-80 (Cuotas pendientes) no está implementada: create_transaction no tiene el parámetro p_installments_paid (HTTP 404 PGRST202)
— Observado en la corrida —
HTTP 404 {"code":"PGRST202","details":"Searched for the function public.create_transaction with parameters p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_installments_paid, p_occurred_on, p_request_id, p_type or with a single unnamed json/jsonb parameter,
```

**Informe previo del equipo:** No puede testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-119 — installments_paid negativo se rechaza · **BLOCKED**

**Esperado:** HTTP 400; JSON `code:"23514"`, `message:"Las cuotas ya pagadas tienen que ser menos que el total de cuotas"`. No hay transacciones ni imputaciones.

**Obtenido:**

```text
US-80 (Cuotas pendientes) no está implementada: create_transaction no tiene el parámetro p_installments_paid (HTTP 404 PGRST202)
— Observado en la corrida —
HTTP 404 {"code":"PGRST202","details":"Searched for the function public.create_transaction with parameters p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_installments_paid, p_occurred_on, p_request_id, p_type or with a single unnamed json/jsonb parameter,
```

**Informe previo del equipo:** No puede testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-120 — installments_paid en una cuota se rechaza · **BLOCKED**

**Esperado:** HTTP 400; JSON `code:"23514"`, `message:"Las cuotas ya pagadas solo van en una compra en cuotas"`. No hay transacciones ni imputaciones.

**Obtenido:**

```text
US-80 (Cuotas pendientes) no está implementada: create_transaction no tiene el parámetro p_installments_paid (HTTP 404 PGRST202)
— Observado en la corrida —
HTTP 404 {"code":"PGRST202","details":"Searched for the function public.create_transaction with parameters p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_installments_paid, p_occurred_on, p_request_id, p_type or with a single unnamed json/jsonb parameter,
```

**Informe previo del equipo:** No puede testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-121 — Una cuota pagada con fecha de hoy se rechaza · **BLOCKED**

**Esperado:** HTTP 400; JSON `code:"23514"`, `message:"Con esa fecha todavía no puede haber tantas cuotas pagadas"`. No hay transacciones ni imputaciones.

**Obtenido:**

```text
US-80 (Cuotas pendientes) no está implementada: create_transaction no tiene el parámetro p_installments_paid (HTTP 404 PGRST202)
— Observado en la corrida —
HTTP 404 {"code":"PGRST202","details":"Searched for the function public.create_transaction with parameters p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_installments_paid, p_occurred_on, p_request_id, p_type or with a single unnamed json/jsonb parameter,
```

**Informe previo del equipo:** No puede testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-122 — Compra empezada compartida se rechaza · **BLOCKED**

**Esperado:** HTTP 400; `code:"23514"`; `message:"Una compra empezada no se puede compartir"`. No hay filas.

**Obtenido:**

```text
US-80 (Cuotas pendientes) no está implementada: create_transaction no tiene el parámetro p_installments_paid (HTTP 404 PGRST202)
— Observado en la corrida —
HTTP 404 {"code":"PGRST202","details":"Searched for the function public.create_transaction with parameters p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_installments_paid, p_occurred_on, p_request_id, p_shared_amount, p_shared_person, p_type or with a si
```

**Informe previo del equipo:** No puede testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-123 — installments_paid decimal se rechaza por tipo · **BLOCKED**

**Esperado:** HTTP 400; JSON `code:"22P02"`; no devuelve UUID. No hay filas.

**Obtenido:**

```text
US-80 (Cuotas pendientes) no está implementada: create_transaction no tiene el parámetro p_installments_paid (HTTP 404 PGRST202)
— Observado en la corrida —
HTTP 404 {"code":"PGRST202","details":"Searched for the function public.create_transaction with parameters p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_installments_paid, p_occurred_on, p_request_id, p_type or with a single unnamed json/jsonb parameter,
```

**Informe previo del equipo:** No puede testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-124 — import_transactions rechaza una installments_paid inválida y continúa · **BLOCKED**

**Esperado:** HTTP 200; `sent_rows:2`, `imported_rows:1`; fila 1 tiene `status:"imported"`; fila 2 tiene `status:"rejected"`, `error_code:"23514"` y `error_message:"Las cuotas ya pagadas tienen que ser menos que el total de cuotas"`. Existe solo la transacción de fila 1.

**Obtenido:**

```text
US-80 (Cuotas pendientes) no está implementada: import_transactions ignora `installments_paid`: la fila 2 no se rechaza con el mensaje esperado
— Observado en la corrida —
HTTP 200 {"rows":[{"row":1,"status":"imported","transaction_id":"d291a0e8-67f4-4927-90ff-4d21389355ed"},{"row":2,"status":"imported","transaction_id":"bf563d38-267a-4da4-9b78-15da445c2c02"}],"import_id":"12412412-0000-4000-8000-000000000124","sent_rows":2,"imported_rows":2,"already_imported":false}
```

**Informe previo del equipo:** No puede testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-125 — installments_paid null crea una compra normal · **BLOCKED**

**Esperado:** HTTP 200 y UUID. amount `120000.00`, installments_paid null; seis cuotas 1–6 desde junio a noviembre de 2026.

**Obtenido:**

```text
US-80 (Cuotas pendientes) no está implementada: create_transaction no tiene el parámetro p_installments_paid (HTTP 404 PGRST202)
— Observado en la corrida —
HTTP 404 {"code":"PGRST202","details":"Searched for the function public.create_transaction with parameters p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_installments_paid, p_occurred_on, p_request_id, p_type or with a single unnamed json/jsonb parameter,
```

**Informe previo del equipo:** No puede testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-126 — installments_paid ausente crea una compra normal · **DUDA**

**Esperado:** HTTP 200 y UUID. amount `120000.00`, installments_paid null; seis cuotas 1–6 desde junio a noviembre de 2026.

**Obtenido:**

```text
Pasa con la app actual, pero también pasaría sin US-80 (la columna `installments_paid` no existe y no se pudo verificar que sea null)
— Observado en la corrida —
HTTP 200 "58ee07f1-b876-4511-8b46-8a9923d12a97"
```

**Informe previo del equipo:** No puede testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-127 — La guía está cerrada por defecto · **BLOCKED**

**Esperado:** Se abre `/import`, paso `1 Archivo`. Se ve `¿Cómo armo el archivo?` con `data-testid="import-guide-open"`; `import-guide-dialog` no está en el DOM.

**Obtenido:**

```text
US-81 (guía «¿Cómo armo el archivo?») no está implementada
— Observado en la corrida —
import-guide-open: no existe; texto «¿Cómo armo el archivo?»: no existe
```

**Informe previo del equipo:** Falló: no se cumple el paso 9.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-128 — Recargar y volver a entrar no abre la guía · **BLOCKED**

**Esperado:** Se abre `/import`, paso `1 Archivo`. Sigue en paso 1; la guía está cerrada. Se abre Registrar. Vuelve a `/import`; la guía sigue cerrada.

**Obtenido:**

```text
US-81 (guía «¿Cómo armo el archivo?») no está implementada
— Observado en la corrida —
import-guide-open: no existe; texto «¿Cómo armo el archivo?»: no existe
```

**Informe previo del equipo:** Falló: no existe el botón «¿Cómo armo el archivo?», no lo puede ejecutar.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-129 — La guía muestra todo el contenido exacto · **BLOCKED**

**Esperado:** Se abre `/import`, paso `1 Archivo`. Se abre `role="dialog"`, `aria-modal="true"`, `data-testid="import-guide-dialog"`; título, introducción, seis pasos, tabla y pie coinciden carácter por carácter con Datos; existen `import-guide-steps`, `import-guide-example`, `import-guide-template-download`, `import-guide-done` e `import-guide-close`.

**Obtenido:**

```text
US-81 (guía «¿Cómo armo el archivo?») no está implementada
— Observado en la corrida —
import-guide-open: no existe; texto «¿Cómo armo el archivo?»: no existe
```

**Informe previo del equipo:** Falló: no existe el botón «¿Cómo armo el archivo?», no lo puede ejecutar.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-130 — Cerrar con Entendido devuelve el foco · **BLOCKED**

**Esperado:** Se abre `/import`, paso `1 Archivo`. Se abre la guía. La guía se cierra, deja de estar en el DOM y el foco vuelve a `¿Cómo armo el archivo?`.

**Obtenido:**

```text
US-81 (guía «¿Cómo armo el archivo?») no está implementada
— Observado en la corrida —
import-guide-open: no existe; texto «¿Cómo armo el archivo?»: no existe
```

**Informe previo del equipo:** Falló: no existe el botón «¿Cómo armo el archivo?», no lo puede ejecutar.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-131 — Cerrar con el botón cerrar devuelve el foco · **BLOCKED**

**Esperado:** Se abre `/import`, paso `1 Archivo`. Se abre la guía. La guía se cierra, deja de estar en el DOM y el foco vuelve a `¿Cómo armo el archivo?`.

**Obtenido:**

```text
US-81 (guía «¿Cómo armo el archivo?») no está implementada
— Observado en la corrida —
import-guide-open: no existe; texto «¿Cómo armo el archivo?»: no existe
```

**Informe previo del equipo:** Falló: no existe el botón «¿Cómo armo el archivo?», no lo puede ejecutar.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-132 — Cerrar con Escape devuelve el foco · **BLOCKED**

**Esperado:** Se abre `/import`, paso `1 Archivo`. Se abre la guía. La guía se cierra, deja de estar en el DOM y el foco vuelve a `¿Cómo armo el archivo?`.

**Obtenido:**

```text
US-81 (guía «¿Cómo armo el archivo?») no está implementada
— Observado en la corrida —
import-guide-open: no existe; texto «¿Cómo armo el archivo?»: no existe
```

**Informe previo del equipo:** Falló: no existe el botón «¿Cómo armo el archivo?», no lo puede ejecutar.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-133 — Cerrar con un click exterior devuelve el foco · **BLOCKED**

**Esperado:** Se abre `/import`, paso `1 Archivo`. Se abre la guía. La guía se cierra, deja de estar en el DOM y el foco vuelve a `¿Cómo armo el archivo?`.

**Obtenido:**

```text
US-81 (guía «¿Cómo armo el archivo?») no está implementada
— Observado en la corrida —
import-guide-open: no existe; texto «¿Cómo armo el archivo?»: no existe
```

**Informe previo del equipo:** Falló: no existe el botón «¿Cómo armo el archivo?», no lo puede ejecutar.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-134 — El foco inicial va a Cerrar guía · **BLOCKED**

**Esperado:** Se abre `/import`, paso `1 Archivo`. Se abre la guía y `document.activeElement` es el botón con `aria-label="Cerrar guía"`.

**Obtenido:**

```text
US-81 (guía «¿Cómo armo el archivo?») no está implementada
— Observado en la corrida —
import-guide-open: no existe; texto «¿Cómo armo el archivo?»: no existe
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-135 — Tab y Shift+Tab quedan atrapados en el diálogo · **BLOCKED**

**Esperado:** Se abre `/import`, paso `1 Archivo`. Se abre la guía. En cada pulsación el foco visible queda dentro de `import-guide-dialog`; nunca llega a la página. En cada pulsación el foco visible sigue dentro del diálogo.

**Obtenido:**

```text
US-81 (guía «¿Cómo armo el archivo?») no está implementada
— Observado en la corrida —
import-guide-open: no existe; texto «¿Cómo armo el archivo?»: no existe
```

**Informe previo del equipo:** Falló: no existe el botón «¿Cómo armo el archivo?», no lo puede ejecutar.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-136 — Descargar plantilla desde la guía produce el mismo libro · **BLOCKED**

**Esperado:** Se abre `/import`, paso `1 Archivo`. Se abre la guía. Se descarga `biyu-plantilla-importacion.xlsx`. Hojas y celdas coinciden exactamente con Datos y con CP-IMP-003.

**Obtenido:**

```text
US-81 (guía «¿Cómo armo el archivo?») no está implementada
— Observado en la corrida —
import-guide-open: no existe; texto «¿Cómo armo el archivo?»: no existe
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-137 — Se puede importar sin abrir la guía · **DUDA**

**Esperado:** Se abre `/import`, paso `1 Archivo`. Se abre selector; nunca se abrió la guía. Se abre Revisión con una fila lista. Se ve `Se importó 1 de 1 fila.`; no apareció aviso sobre la guía.

**Obtenido:**

```text
Pasa (se importa sin abrir la guía), pero la guía no existe todavía (US-81): el caso no prueba nada sobre ella
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-138 — Abrir y cerrar la guía conserva archivo, resumen, filtro y URL · **BLOCKED**

**Esperado:** Se abre `/import`, paso `1 Archivo`. Selector. Revisión: 11/7/4; URL `/import`. Filtro encendido; filas 7–10. Guía abierta sobre Revisión. Guía cerrada; mismo nombre de archivo, resumen 11/7/4, filtro encendido, filas 7–10 y URL `/import`.

**Obtenido:**

```text
US-81 (guía «¿Cómo armo el archivo?») no está implementada: los pasos 12 y 13 piden abrir y cerrar la guía. Verificado hasta el paso 11: resumen 11/7/4 y filas 7 a 10 con el filtro encendido
— Observado en la corrida —
Revisión con filtro de errores: filas 7,8,9,10; import-guide-open: no existe
```

**Informe previo del equipo:** Falló: no existe el botón «¿Cómo armo el archivo?». Además, el archivo de IMP-DATA-01 está mal hecho.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-139 — El botón de guía no existe en Resultado · **DUDA**

**Esperado:** Se abre `/import`, paso `1 Archivo`. Una fila lista. Se abre Resultado. No se ve `¿Cómo armo el archivo?` y `import-guide-open` no está en el DOM.

**Obtenido:**

```text
Pasa (en Resultado no hay botón de guía), pero el botón no existe en ninguna pantalla todavía (US-81): el caso no prueba nada hasta que exista
```

**Informe previo del equipo:** No entiende cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-140 — El botón de guía se deshabilita mientras importa · **BLOCKED**

**Esperado:** Se abre `/import`, paso `1 Archivo`. Una fila lista; se ve guía. Muestra `Importando…`. El botón está deshabilitado; no se abre `import-guide-dialog`.

**Obtenido:**

```text
US-81 (guía «¿Cómo armo el archivo?») no está implementada
— Observado en la corrida —
import-guide-open: no existe; texto «¿Cómo armo el archivo?»: no existe
```

**Informe previo del equipo:** Falló: no existe el botón «¿Cómo armo el archivo?», no lo puede ejecutar.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-141 — La guía móvil mantiene márgenes y scroll interno · **BLOCKED**

**Esperado:** Se abre `/import`, paso `1 Archivo`. El diálogo mide 358 px y deja 16 px a cada lado. Su contenido scrollea dentro del panel; la página de atrás no se desplaza. El valor es menor o igual a `390`. La tabla se recorre completa; el diálogo y la página no generan scroll horizontal.

**Obtenido:**

```text
US-81 (guía «¿Cómo armo el archivo?») no está implementada
— Observado en la corrida —
import-guide-open: no existe; texto «¿Cómo armo el archivo?»: no existe
```

**Informe previo del equipo:** Falló: no existe el botón «¿Cómo armo el archivo?», no lo puede ejecutar.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-142 — Cuenta archivada no se acepta aunque el nombre coincida · **PASSED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. `Fila 2` queda `Con error` y muestra exactamente `No existe la cuenta «Efectivo» o está archivada`; `Importar 0 movimientos` está deshabilitado.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Fila 2 queda Con error y muestra exactamente No existe la cuenta «Efectivo» o está archivada; Importar 0 movimientos está deshabilitado.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-143 — Elegir otro archivo durante un estado incierto pide confirmación · **PASSED**

**Esperado:** Se abre `/import`. Se abre el selector. Se abre Revisión con una fila lista. DevTools muestra Offline. Aparece el mensaje exacto de no confirmación y el botón `Reintentar`. Se abre `¿Salir sin saber si se importó?`; todavía se ve el nombre `cp-imp-143.xlsx` detrás del diálogo. Vuelve a `1 Archivo`, sin nombre ni resumen del archivo anterior.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Vuelve a 1 Archivo, sin nombre ni resumen del archivo anterior.
```

**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-IMP-144 — Una fila que falla después del alta no deja transacción sin imputaciones · **PASSED**

**Esperado:** HTTP 200; `import_id:"14414414-0000-4000-8000-000000000144"`, `already_imported:false`, `sent_rows:1`, `imported_rows:0`; fila 2 tiene `status:"rejected"`. Registrar `error_code` y `error_message` como evidencia, sin usarlos para el veredicto porque la historia no los contractualiza para F17. `transactions` responde HTTP 200 con `[]`; `ledger_entries` responde HTTP 200 con `[]`; `imports` responde HTTP 200 con una sola fila de id `14414414-0000-4000-8000-000000000144`, `sent_rows:1`, `imported_rows:0` y una fila 2 con `status:"rejected"`.

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: transactions responde HTTP 200 con []; ledger_entries responde HTTP 200 con []; imports responde HTTP 200 con una sola fila de id 14414414-0000-4000-8000-000000000144, sent_rows:1, imported_rows:0 y una fila 2 con status:"rejected".
— Observado en la corrida —
HTTP 200 {"rows":[{"row":2,"status":"rejected","error_code":"23514","error_message":"I4: cada cuota debe ser al menos 0,01"}],"import_id":"14414414-0000-4000-8000-000000000144","sent_rows":1,"imported_rows":0,"already_imported":false}
```

**Informe previo del equipo:** No lo puede testear.
**Ejecutó:** Claude Code (IA), supervisado por Santiago
