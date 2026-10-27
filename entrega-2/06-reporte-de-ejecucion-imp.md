# Proyecto Biyu – Entrega 2 · Reporte de ejecución de casos de prueba (V2) · Importar Excel (IMP)

Planilla: `06-reporte-de-ejecucion-imp.xlsx` (hoja "Reporte de ejecución", mismo formato que el de la Entrega 1: ID, prioridad, título, historia, camino feliz, status y defectos, más el resumen). Formato del contenido: `docs/07-plan-de-testing.md` §6. Registro por caso en [`04-ejecucion-imp.md`](04-ejecucion-imp.md); defectos en [`05-reportes-de-defectos-imp.md`](05-reportes-de-defectos-imp.md).

| Dato | Valor |
|---|---|
| Versión probada | `main` en el commit `1c72d0f` (código local; los commits posteriores solo tocan documentos). No se probó el deploy de Vercel |
| Entorno | Local: Vite (http://127.0.0.1:5173) + Supabase local · main 1c72d0f · Chromium (Playwright 1.63), es-AR, America/Argentina/Buenos_Aires, reloj del navegador fijado en 12/10/2026 |
| Fecha | 2026-10-27 |
| Ejecutó | Claude Code (IA), supervisado por Santiago. Los 144 casos, con scripts de Playwright |
| Evidencia | Lo observado en cada caso (mensajes, filas, respuestas de la API) figura en «Resultado obtenido» de `04-ejecucion-imp`. No se guardaron capturas ni los scripts en el repositorio |

## 1. Planificados, ejecutados, pasados, fallados y bloqueados

Status vigente de cada caso: el de su única ejecución (no hubo re-test).

| Métrica | Casos | % |
|---|---|---|
| Planificados | **144** | 100 % |
| Ejecutados (PASSED + FAILED + DUDA) | **99** | 69 % de avance |
| PASSED | **90** | 91 % de los ejecutados |
| FAILED | **1** | 1 % de los ejecutados |
| DUDA (pasa, con dudas) | **8** | 8 % de los ejecutados |
| BLOCKED | **45** | 31 % de los planificados |
| No ejecutados | 0 | — |

- **BLOCKED (45):** dependen de funcionalidades que todavía no existen; se vuelven a ejecutar en V3. En el código no hay `installments_paid` (ni en la base ni en la app) ni la guía «¿Cómo armo el archivo?». **US-80, Cuotas pendientes (31):** CP-IMP-003, 018, 093 a 096, 099 a 110, 113 a 125. **US-81, guía (14):** CP-IMP-082, 127 a 136, 138, 140 y 141.
- **FAILED (1):** CP-IMP-052 (DEF-033): la tarjeta de la fila muestra el texto del archivo y no el nombre de la categoría y la cuenta de Biyu.
- **DUDA (8):** CP-IMP-012, 097 y 098, 111 y 112, 126, 137, 139. Los casos 097, 098, 111, 112, 126, 137 y 139 pasan, pero pasarían igual sin la funcionalidad que prueban (US-80 o US-81). CP-IMP-012: con un `.xlsx` válido de exactamente 1.048.576 bytes la app lo acepta; con la preparación literal del caso (ceros al final del archivo, IMP-PREP-05) responde «No pudimos leer el archivo». Parece un error de la preparación del caso.
- **Lo que sí se cumple:** acceso y rutas privadas, validación del archivo (extensión, tamaño, hojas, encabezados, 500 filas), las reglas F1 a F18 con sus mensajes exactos y el orden de reglas, lectura de fechas y montos, resumen y filtro, importación con confirmación, idempotencia por `import_id`, errores de red, sesión vencida, tiempo agotado y error del servidor, diálogo de salida con importación incierta, y las seis variantes API de `import_transactions` (incluido el rechazo atómico de CP-IMP-144).

## 2. Cobertura por prioridad, tipo, técnica y canal

| Prioridad | Casos | PASSED | FAILED | DUDA | BLOCKED |
|---|---|---|---|---|---|
| Alta | 69 | 33 | 0 | 6 | 30 |
| Media | 75 | 57 | 1 | 2 | 15 |
| Baja | 0 | 0 | 0 | 0 | 0 |

| Tipo | Casos | PASSED | FAILED | DUDA | BLOCKED |
|---|---|---|---|---|---|
| Negativo | 76 | 58 | 0 | 2 | 16 |
| Positivo | 59 | 27 | 1 | 5 | 26 |
| Límite | 9 | 5 | 0 | 1 | 3 |

| Técnica | Casos | PASSED | FAILED | DUDA | BLOCKED |
|---|---|---|---|---|---|
| Particiones de equivalencia | 108 | 75 | 1 | 5 | 27 |
| Transición de estados | 21 | 6 | 0 | 2 | 13 |
| Análisis de valores límite | 12 | 7 | 0 | 1 | 4 |
| Prueba de interfaz adaptable | 1 | 0 | 0 | 0 | 1 |
| Prueba de rendimiento | 1 | 1 | 0 | 0 | 0 |
| Adivinación de errores | 1 | 1 | 0 | 0 | 0 |

| Canal | Casos | PASSED | FAILED | DUDA | BLOCKED |
|---|---|---|---|---|---|
| API | 16 | 7 | 0 | 1 | 8 |
| UI | 128 | 83 | 1 | 7 | 37 |

Camino feliz: 59 casos. Negativos y de límite: 85 casos.

## 3. Quién ejecutó cada caso: con IA y sin IA

| Forma de ejecución | Casos | Cuáles |
|---|---:|---|
| **Con IA** (Claude Code, supervisado por Santiago) | **144** | CP-IMP-001 a 144 |
| Sin IA (a mano por el equipo) | 0 | — |

El equipo había informado resultados parciales de 70 de los 144 casos (fallas, pasos que no pudo hacer, casos que no sabía cómo probar y observaciones de redacción); el resto no tenía ningún dato. Esos mensajes están en «Informe previo del equipo» de cada caso. **Diferencias con la ejecución con IA:** CP-IMP-002 (en local la ruta redirige al login; el equipo probó el deploy de Vercel), CP-IMP-005, CP-IMP-021 y CP-IMP-063 (con la planilla armada como dice IMP-DATA-01 el resumen es 11 filas · 7 listas · 4 con error y 7 movimientos por $324.915,50 en gastos y $850.000,00 en ingresos; el equipo informó otras cifras y sospecha de su archivo) y CP-IMP-064 (con el filtro encendido se ven solo las filas 7 a 10).

## 4. Trazabilidad

Los 144 casos cubren los criterios de US-74, US-76, US-77, US-78, US-80 y US-81 (matriz en `casos/imp.md`). Todos los criterios de US-74 a US-78 tienen casos ejecutados y en verde, salvo la plantilla y la columna desconocida de CP-IMP-003 y CP-IMP-018, que dependen de US-80. **US-80 y US-81 no tienen ningún criterio verificable hoy**: su funcionalidad no existe.

## 5. Defectos por severidad

Detalle completo en `05-reportes-de-defectos-imp`.

| Severidad | Abiertos | IDs |
|---|---|---|
| Crítica | 0 | — |
| Alta | 0 | — |
| Media | 0 | — |
| Baja | 1 | DEF-033 |
| **Total abiertos** | **1** | DEF-033 |

Ninguno tiene issue todavía.

## 6. Criterios de salida (docs/07-plan-de-testing.md §6)

| Criterio | Estado |
|---|---|
| 1. Cero defectos de severidad Crítica abiertos | ✅ Cumplido |
| 2. Cero defectos de severidad Alta abiertos, o justificados por el PO | ✅ Cumplido |
| 3. Todos los casos de prioridad Alta ejecutados | ❌ No cumplido: 39 de 69. No ejecutados por funcionalidad inexistente (BLOCKED): CP-IMP-082, 093 a 096, 099 a 110, 113 a 125 |
| 4. Toda invariante del alcance con al menos un caso ejecutado | Parcial: las de este módulo sí; las demás de V2 van en otros módulos |

**Conclusión:** IMP cumple los criterios 1 y 2 y **no cumple el 3**: los casos de prioridad Alta que dependen de US-80 y US-81 no se pueden ejecutar hasta que esas funcionalidades existan; quedan BLOCKED para V3. Hay un defecto Bajo abierto (DEF-033). Todo lo que existe hoy (US-74 a US-78) pasó, salvo la presentación de CP-IMP-052.

## 7. Desvíos respecto de lo planificado

1. **Ejecución asistida por un script.** El plan prevé ejecución manual por un integrante que no diseñó el caso. Acá los pasos los ejecutó Claude Code con Playwright (y llamadas directas a la API) siguiendo cada caso. La propiedad cruzada del plan (`docs/07-plan-de-testing.md` §1) no se aplicó: conviene que cada integrante revise los resultados de su módulo.
2. **Entorno local, no el deploy.** Todo se ejecutó contra el código local y Supabase local; los resultados pueden diferir del deploy de Vercel si este está desactualizado. Solo Chromium.
3. **Reloj fijado.** El reloj del navegador se fijó en 12/10/2026 12:00 (America/Argentina/Buenos_Aires) como piden los casos; el reloj del servidor no se tocó (es el real, 27/10/2026). El caso CP-IMP-117 pide además avanzar el reloj del dominio al 12/11/2026, que no se puede en el entorno.
4. **Archivos.** Los `.xlsx` se generaron con `write-excel-file` a partir de los datos de cada caso, no con Excel ni LibreOffice. Las fórmulas de CP-IMP-061 y 062 se guardaron como el valor calculado (celda numérica, sin fórmula). CP-IMP-005 usa un `.xlsx` renombrado `.xls`, soltado con el evento de arrastrar y soltar y no desde el Explorador. IMP-DATA-01 se armó fila por fila desde la tabla del documento (la columna «Cuotas pendientes» no existe en ese libro).
5. **Herramientas sustituidas.** (a) Sin conexión (083, 084, 086, 090 a 092, 143): corte de red del contexto de Playwright. (b) HTTP 401, 400 y 500 (087 a 089): respuesta simulada con una ruta de Playwright. (c) CP-IMP-083: identificador fijado redefiniendo `crypto.randomUUID` con el mismo valor que IMP-PREP-06. (d) CP-IMP-092: el aviso nativo de recarga se verificó con el evento `beforeunload` (cancelable) y el diálogo de Playwright. (e) CP-IMP-076: el cronómetro es el del script y corre en local (0,9 s), no en el deploy de Vercel.
6. **Criterio para BLOCKED.** Siguiendo la indicación de Santiago, un caso que no se puede ejecutar porque falta una funcionalidad o un botón queda BLOCKED para V3, aunque la pantalla permita recorrer parte de los pasos. Se verificó la ausencia en el código y en la pantalla (`installments_paid` no existe; `import-guide-open` no existe). Cuando el caso igual pasa sin la funcionalidad queda DUDA.
7. **Preparación por API.** Los casos que piden PR-04 se ejecutaron con el token del usuario de prueba. Los usuarios se crearon por API y la configuración inicial se salteó por pantalla.
8. **Dependencias.** Para correr el importador hubo que instalar `read-excel-file` y `write-excel-file` (estaban en `package.json` pero no en `node_modules`).
9. **Evidencia.** No se adjuntaron capturas ni los scripts al repositorio.

## 8. Datos de prueba

Todo en Supabase **local**, con usuarios `qa+cp-imp-<nnn>-001@example.com` (los de aislamiento, `-A` y `-B`) y montos ficticios. `supabase db reset` los borra. En producción no se creó nada. La contraseña de prueba es `Clave123!` y solo existe en la base local.
