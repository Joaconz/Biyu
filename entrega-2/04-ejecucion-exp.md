# Proyecto Biyu – Entrega 2 · Ejecución de casos de prueba (V2) · Exportar CSV (EXP)

Planilla: `04-ejecucion-exp.xlsx` (una hoja por caso con "Reporte de ejecución 1", resultado obtenido, evidencia y defectos). Casos: [`casos/exp.md`](casos/exp.md) (CP-EXP-001 a CP-EXP-075, US-47). Reporte con métricas: [`06-reporte-de-ejecucion-exp.md`](06-reporte-de-ejecucion-exp.md). Defectos: [`05-reportes-de-defectos-exp.md`](05-reportes-de-defectos-exp.md).

## Condiciones de la ejecución

- **Fecha:** 2026-10-27.
- **Versión probada:** `main` en el commit `1c72d0f` (código local, sin cambios). No se probó el deploy de Vercel.
- **Entorno:** Local: Vite (http://127.0.0.1:5173) + Supabase local · main 1c72d0f · Chromium (Playwright 1.63), es-AR, America/Argentina/Buenos_Aires, reloj del navegador fijado en 09/10/2026.
- **Quién ejecutó:** **los 75 casos los ejecutó Claude Code (IA), supervisado por Santiago.** Ningún caso de EXP lo ejecutó el equipo a mano ni tenía un estado previo.
- **Cómo se ejecutó:** un script de Playwright por caso ([`ejecucion/exp/`](ejecucion/exp/)). Cada caso crea su propio usuario (alta por API y entrada por la pantalla de ingreso, con la configuración inicial salteada), prepara los movimientos por la API (`create_transaction`, `delete_transaction`, `restore_transaction`, `upsert_fx_rate`, `delete_account`, categorías y cuentas) y recorre la pantalla Movimientos como lo haría una persona. Las descargas se leen del archivo que baja el navegador y se comparan byte a byte. Cada caso deja una captura del estado final en `evidencia/`.
- **Datos:** usuarios `qa+cp-exp-<nnn>-001@example.com` (con un sufijo de corrida), contraseña `Clave123!` y montos ficticios (C14), en Supabase local. En producción no se creó nada.

## Resultado por caso

| ID | Prioridad | Historia | Status | Ejecutó | Defectos |
|---|---|---|---|---|---|
| CP-EXP-001 | Media | US-47 · CA-1 · C11 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-002 | Media | US-47 · CA-1 · C1/C11 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-003 | Media | US-47 · CA-20 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-004 | Media | US-47 · CA-2 · C1 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-005 | Media | US-47 · CA-2 · C1 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-006 | Alta | US-47 · CA-2 · FR-21 · C1 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-007 | Alta | US-47 · CA-3 · FR-22 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-008 | Alta | US-47 · CA-4 · FR-22 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-009 | Alta | US-47 · CA-5 · FR-22 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-010 | Alta | US-47 · CA-5 · FR-22 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-011 | Alta | US-47 · CA-5 · FR-22 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-012 | Alta | US-47 · CA-5 · FR-22 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-013 | Alta | US-47 · CA-5 · FR-22 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-014 | Alta | US-47 · CA-5 · FR-22 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-015 | Alta | US-47 · CA-5 · FR-22 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-016 | Alta | US-47 · CA-5 · FR-22 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-017 | Alta | US-47 · CA-6 · C10 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-018 | Alta | US-47 · CA-6 · C10 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-019 | Alta | US-47 · CA-7 · C10 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-020 | Alta | US-47 · CA-8 · ADR-029 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-021 | Alta | US-47 · CA-8 · ADR-029 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-022 | Alta | US-47 · CA-8 · ADR-029 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-023 | Alta | US-47 · CA-9 · ADR-029 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-024 | Alta | US-47 · CA-9, CA-21 · ADR-001/029 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-025 | Alta | US-47 · CA-10 · C2 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-026 | Alta | US-47 · CA-10 · C2/C5 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-027 | Alta | US-47 · CA-11 · C5 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-028 | Alta | US-47 · CA-12 · ADR-029 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-029 | Alta | US-47 · CA-12 · ADR-029 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-030 | Alta | US-47 · CA-12 · ADR-029 | **DUDA** | Claude Code (IA) | — |
| CP-EXP-031 | Alta | US-47 · CA-13 · ADR-029 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-032 | Alta | US-47 · CA-13 · ADR-029 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-033 | Alta | US-47 · CA-13 · ADR-029 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-034 | Alta | US-47 · CA-13 · ADR-029 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-035 | Alta | US-47 · CA-13 · ADR-029 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-036 | Alta | US-47 · CA-13 · ADR-029 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-037 | Alta | US-47 · CA-13 · ADR-029 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-038 | Alta | US-47 · CA-13 · ADR-029 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-039 | Media | US-47 · CA-14 · ADR-029 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-040 | Alta | US-47 · CA-15 · C9 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-041 | Alta | US-47 · CA-15 · C9 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-042 | Alta | US-47 · CA-15 · C9 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-043 | Alta | US-47 · CA-16 · C7 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-044 | Alta | US-47 · CA-16 · C7 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-045 | Media | US-47 · CA-17 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-046 | Media | US-47 · CA-17 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-047 | Media | US-47 · CA-17 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-048 | Alta | US-47 · CA-20 · ADR-026 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-049 | Alta | US-47 · CA-18 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-050 | Alta | US-47 · CA-18 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-051 | Alta | US-47 · CA-18 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-052 | Media | US-47 · CA-19 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-053 | Media | US-47 · CA-19 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-054 | Media | US-47 · CA-20 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-055 | Media | US-47 · CA-20 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-056 | Alta | US-47 · CA-20 · C10 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-057 | Alta | US-47 · CA-22 · C9 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-058 | Alta | US-47 · CA-22 · C9 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-059 | Media | US-47 · CA-22 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-060 | Baja | US-47 · CA-23 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-061 | Baja | US-47 · CA-23 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-062 | Baja | US-47 · CA-23 | **FAILED** | Claude Code (IA) | DEF-030 |
| CP-EXP-063 | Media | US-47 · requisito narrativo: todo cambio de URL · C11 | **FAILED** | Claude Code (IA) | DEF-031 |
| CP-EXP-064 | Alta | US-47 · requisito narrativo: todo cambio de URL · C11 | **FAILED** | Claude Code (IA) | DEF-032 |
| CP-EXP-065 | Media | US-47 · requisito narrativo: todo cambio de URL | **FAILED** | Claude Code (IA) | DEF-031 |
| CP-EXP-066 | Media | US-47 · requisito narrativo: todo cambio de URL | **PASSED** | Claude Code (IA) | — |
| CP-EXP-067 | Alta | US-47 · CA-25 · C9/C11 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-068 | Alta | US-47 · Completitud · C9 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-069 | Alta | US-47 · CA-18 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-070 | Alta | US-47 · CA-18 | **PASSED** | Claude Code (IA) | DEF-030 |
| CP-EXP-071 | Alta | US-47 · CA-12 · ADR-029 | **DUDA** | Claude Code (IA) | — |
| CP-EXP-072 | Alta | US-47 · CA-25 · C9 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-073 | Alta | US-47 · Estado Error · C9 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-074 | Alta | US-47 · Estado Error · C2/C9 | **PASSED** | Claude Code (IA) | — |
| CP-EXP-075 | Media | US-47 · Estado Error | **PASSED** | Claude Code (IA) | — |

## Detalle

### CP-EXP-001 — Una URL válida fija septiembre 2026 · **PASSED**

**Esperado:** Se abre "Exportar movimientos"; "Solo septiembre 2026" está elegido; se ve "Todo 2026"; "Descargar CSV" y "Cancelar" están habilitados; aparece el texto fijo sobre activos y cuotas anteriores.

**Obtenido:**

```text
La hoja abre con «Solo septiembre 2026» elegido, «Todo 2026» visible, «Descargar CSV» y «Cancelar» habilitados y el texto fijo sobre activos y cuotas anteriores.
— Observado en la corrida —
Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV»
```

**Evidencia:** [CP-EXP-001.jpg](evidencia/CP-EXP-001.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-002 — Sin period se usa octubre 2026 · **PASSED**

**Esperado:** Se abre la hoja con "Solo octubre 2026" elegido y "Todo 2026" visible.

**Obtenido:**

```text
Sin `period` en la URL (reloj en 09/10/2026) la hoja abre con «Solo octubre 2026» elegido y «Todo 2026» visible.
— Observado en la corrida —
Pantalla final: /transactions?period=2026-10 · hoja abierta · botón «Descargar CSV»
```

**Evidencia:** [CP-EXP-002.jpg](evidencia/CP-EXP-002.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-003 — Cancelar desde Vacío cierra sin descargar · **PASSED**

**Esperado:** Se abre la hoja. No se descarga archivo y aparece "No tenés movimientos con fecha en septiembre 2026.". La hoja se cierra, la URL conserva `?period=2026-09` y no aparece archivo.

**Obtenido:**

```text
Sin transacciones: no se descarga nada, aparece «No tenés movimientos con fecha en septiembre 2026.», «Cancelar» cierra la hoja y la URL conserva `?period=2026-09`.
— Observado en la corrida —
Descarga: ninguna
Pantalla final: /transactions?period=2026-09 · hoja cerrada
```

**Evidencia:** [CP-EXP-003.jpg](evidencia/CP-EXP-003.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-004 — El mes actual permite exportar sin aviso · **PASSED**

**Esperado:** 

**Obtenido:**

```text
«Exportar» habilitado y sin aviso de período futuro; la hoja abre.
— Observado en la corrida —
Pantalla final: /transactions?period=2026-10 · hoja abierta · botón «Descargar CSV»
```

**Evidencia:** [CP-EXP-004.jpg](evidencia/CP-EXP-004.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-005 — El mes anterior permite exportar sin aviso · **PASSED**

**Esperado:** 

**Obtenido:**

```text
«Exportar» habilitado y sin aviso de período futuro; la hoja abre.
— Observado en la corrida —
Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV»
```

**Evidencia:** [CP-EXP-005.jpg](evidencia/CP-EXP-005.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-006 — El mes siguiente está bloqueado · **PASSED**

**Esperado:** El mensaje coincide exactamente con el texto esperado del paso 12. No se abre ninguna hoja y la URL sigue `?period=2026-11`.

**Obtenido:**

```text
Mes futuro (2026-11): «Exportar» deshabilitado, aparece «Solo podés exportar el mes actual o meses anteriores.», no abre ninguna hoja y la URL no cambia.
— Observado en la corrida —
Pantalla final: /transactions?period=2026-11 · hoja cerrada · aviso: «Solo podés exportar el mes actual o meses anteriores.»
```

**Evidencia:** [CP-EXP-006.jpg](evidencia/CP-EXP-006.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-007 — El alcance mensual propone el nombre 2026-09 · **PASSED**

**Esperado:** Se abre la hoja con el mes elegido. Se inicia y completa una descarga. Además, es exactamente D9. Se ve el archivo CSV recién descargado. Hay una fila de datos cuyo id es `<ID-A>`.

**Obtenido:**

```text
Descarga `biyu-movimientos-2026-09.csv` con una fila de datos cuyo id es el de la transacción creada.
— Observado en la corrida —
Descarga: biyu-movimientos-2026-09.csv · 217 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,1500.00,ARS,,1500.00,Otros,Efectivo,1,2026-09,Almuerzo,3beeb9fe-67fe-4028-aef8-ac57768be4c1
Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento»
```

**Evidencia:** [CP-EXP-007.jpg](evidencia/CP-EXP-007.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-008 — El alcance anual propone el nombre 2025 · **PASSED**

**Esperado:** Se abre la hoja. "Todo 2025" queda elegido. Se inicia y completa una descarga. Además, es exactamente D9. Se ve el archivo CSV anual recién descargado. La única fila tiene fecha `2025-02-10` e id `<ID-A>`.

**Obtenido:**

```text
Con «Todo 2025» descarga `biyu-movimientos-2025.csv` con una única fila (2025-02-10) y el id esperado.
— Observado en la corrida —
Descarga: biyu-movimientos-2025.csv · 209 bytes · 1 fila(s) de datos · fila 1: 2025-02-10,gasto,2500.00,ARS,,2500.00,Otros,Efectivo,1,2025-02,,f0f6a94a-8677-4ff2-85f6-1ab8d729b277
Pantalla final: /transactions?period=2025-06 · hoja cerrada · aviso: «Exportamos 1 movimiento»
```

**Evidencia:** [CP-EXP-008.jpg](evidencia/CP-EXP-008.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-009 — El primer día del mes se incluye · **PASSED**

**Esperado:** Se abre la hoja con septiembre elegido. Se descarga el archivo mensual. Hay exactamente una fila con fecha `2026-09-01` e id `<ID-A>`.

**Obtenido:**

```text
El borde del período se incluye: una sola fila con la fecha límite y el id esperado.
— Observado en la corrida —
Descarga: biyu-movimientos-2026-09.csv · 207 bytes · 1 fila(s) de datos · fila 1: 2026-09-01,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,,4ac02c5d-66b5-4d37-8291-83577c5fc6e2
Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento»
```

**Evidencia:** [CP-EXP-009.jpg](evidencia/CP-EXP-009.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-010 — El último día del mes se incluye · **PASSED**

**Esperado:** Se abre la hoja con septiembre elegido. Se descarga el archivo mensual. Hay exactamente una fila con fecha `2026-09-30` e id `<ID-A>`.

**Obtenido:**

```text
El borde del período se incluye: una sola fila con la fecha límite y el id esperado.
— Observado en la corrida —
Descarga: biyu-movimientos-2026-09.csv · 207 bytes · 1 fila(s) de datos · fila 1: 2026-09-30,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,,f59af1a2-1168-472b-a0f0-fb0fc0c2d2e4
Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento»
```

**Evidencia:** [CP-EXP-010.jpg](evidencia/CP-EXP-010.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-011 — El día anterior al mes se excluye · **PASSED**

**Esperado:** Se abre la hoja con septiembre elegido. No se descarga archivo; la hoja queda abierta. Además, dice exactamente "No tenés movimientos con fecha en septiembre 2026."

**Obtenido:**

```text
El día fuera del período se excluye: no se descarga archivo, la hoja queda abierta y aparece el mensaje exacto de período vacío.
— Observado en la corrida —
Descarga: ninguna
Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV» · mensaje: «No tenés movimientos con fecha en septiembre 2026.»
```

**Evidencia:** [CP-EXP-011.jpg](evidencia/CP-EXP-011.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-012 — El día posterior al mes se excluye · **PASSED**

**Esperado:** Se abre la hoja con septiembre elegido. No se descarga archivo; la hoja queda abierta. Además, dice exactamente "No tenés movimientos con fecha en septiembre 2026."

**Obtenido:**

```text
El día fuera del período se excluye: no se descarga archivo, la hoja queda abierta y aparece el mensaje exacto de período vacío.
— Observado en la corrida —
Descarga: ninguna
Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV» · mensaje: «No tenés movimientos con fecha en septiembre 2026.»
```

**Evidencia:** [CP-EXP-012.jpg](evidencia/CP-EXP-012.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-013 — El 1 de enero se incluye en el año · **PASSED**

**Esperado:** Se abre la hoja. El alcance anual queda elegido. Se descarga el archivo anual. Hay exactamente una fila con fecha `2025-01-01` e id `<ID-A>`.

**Obtenido:**

```text
El borde del período se incluye: una sola fila con la fecha límite y el id esperado.
— Observado en la corrida —
Descarga: biyu-movimientos-2025.csv · 207 bytes · 1 fila(s) de datos · fila 1: 2025-01-01,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2025-01,,95bf1454-0704-45f9-b3ca-a7109f4fdc4b
Pantalla final: /transactions?period=2025-06 · hoja cerrada · aviso: «Exportamos 1 movimiento»
```

**Evidencia:** [CP-EXP-013.jpg](evidencia/CP-EXP-013.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-014 — El 31 de diciembre se incluye en el año · **PASSED**

**Esperado:** Se abre la hoja. El alcance anual queda elegido. Se descarga el archivo anual. Hay exactamente una fila con fecha `2025-12-31` e id `<ID-A>`.

**Obtenido:**

```text
El borde del período se incluye: una sola fila con la fecha límite y el id esperado.
— Observado en la corrida —
Descarga: biyu-movimientos-2025.csv · 207 bytes · 1 fila(s) de datos · fila 1: 2025-12-31,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2025-12,,0aeee240-ab4e-45d6-8e63-ae30eedc1b6e
Pantalla final: /transactions?period=2025-06 · hoja cerrada · aviso: «Exportamos 1 movimiento»
```

**Evidencia:** [CP-EXP-014.jpg](evidencia/CP-EXP-014.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-015 — El día anterior al año se excluye · **PASSED**

**Esperado:** Se abre la hoja. El alcance anual queda elegido. No se descarga archivo; la hoja queda abierta. Además, dice exactamente "No tenés movimientos con fecha en 2025."

**Obtenido:**

```text
El día fuera del período se excluye: no se descarga archivo, la hoja queda abierta y aparece el mensaje exacto de período vacío.
— Observado en la corrida —
Descarga: ninguna
Pantalla final: /transactions?period=2025-06 · hoja abierta · botón «Descargar CSV» · mensaje: «No tenés movimientos con fecha en 2025.»
```

**Evidencia:** [CP-EXP-015.jpg](evidencia/CP-EXP-015.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-016 — El día posterior al año se excluye · **PASSED**

**Esperado:** Se abre la hoja. El alcance anual queda elegido. No se descarga archivo; la hoja queda abierta. Además, dice exactamente "No tenés movimientos con fecha en 2025."

**Obtenido:**

```text
El día fuera del período se excluye: no se descarga archivo, la hoja queda abierta y aparece el mensaje exacto de período vacío.
— Observado en la corrida —
Descarga: ninguna
Pantalla final: /transactions?period=2025-06 · hoja abierta · botón «Descargar CSV» · mensaje: «No tenés movimientos con fecha en 2025.»
```

**Evidencia:** [CP-EXP-016.jpg](evidencia/CP-EXP-016.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-017 — Una transacción eliminada queda fuera · **PASSED**

**Esperado:** Se abre la hoja. No se descarga archivo. Además, dice "No tenés movimientos con fecha en septiembre 2026." El mensaje coincide exactamente con el texto esperado del paso 14.

**Obtenido:**

```text
La transacción eliminada no sale: no se descarga archivo y aparece el mensaje de período vacío.
— Observado en la corrida —
Descarga: ninguna
Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV» · mensaje: «No tenés movimientos con fecha en septiembre 2026.»
```

**Evidencia:** [CP-EXP-017.jpg](evidencia/CP-EXP-017.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-018 — Una transacción restaurada vuelve a exportarse · **PASSED**

**Esperado:** Se abre la hoja. Se descarga un CSV. La única fila tiene id `<ID-A>`.

**Obtenido:**

```text
La transacción restaurada vuelve a salir: una fila con el id esperado.
— Observado en la corrida —
Descarga: biyu-movimientos-2026-09.csv · 207 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,200.00,ARS,,200.00,Otros,Efectivo,1,2026-09,,5d000dde-8e2e-4e11-8bbf-abeebfb905e8
Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento»
```

**Evidencia:** [CP-EXP-018.jpg](evidencia/CP-EXP-018.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-019 — El filtro Eliminados no cambia los bytes · **PASSED**

**Esperado:** Se abre la hoja. Se descarga el primer archivo. El archivo queda disponible para comparar. La lista muestra `<ID-B>` y no `<ID-A>`. Se abre otra vez la hoja. Se descarga el segundo archivo. Son idénticos; contienen `<ID-A>` y no `<ID-B>`.

**Obtenido:**

```text
Los dos archivos (vista Activos y vista Eliminados) son idénticos byte a byte; contienen `<ID-A>` y no `<ID-B>`.
— Observado en la corrida —
Descarga: biyu-movimientos-2026-09.csv · 207 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,,9a13d267-64ec-494e-983b-5bea5d9fc468
Descarga: biyu-movimientos-2026-09.csv · 207 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,,9a13d267-64ec-494e-983b-5bea5d9fc468
Pantalla final: /transactions?period=2026-09&view=deleted · hoja cerrada · aviso: «Exportamos 1 movimiento»
```

**Evidencia:** [CP-EXP-019.jpg](evidencia/CP-EXP-019.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-020 — El archivo comienza con BOM UTF-8 · **PASSED**

**Esperado:** Se abre la hoja. Se descarga el archivo. Los primeros tres bytes son exactamente D1.

**Obtenido:**

```text
Los primeros tres bytes del archivo son `EF BB BF`.
— Observado en la corrida —
Descarga: biyu-movimientos-2026-09.csv · 207 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,,516cde3a-ba46-47ad-8bc7-c5938c12560e
Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento»
```

**Evidencia:** [CP-EXP-020.jpg](evidencia/CP-EXP-020.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-021 — El encabezado tiene doce columnas exactas · **PASSED**

**Esperado:** Se abre la hoja. Se descarga el archivo. Además, coincide exactamente con D1.

**Obtenido:**

```text
La primera línea es exactamente `fecha,tipo,monto,moneda,tipo_de_cambio,monto_ars,categoria,cuenta,cuotas,primer_periodo,descripcion,id`.
— Observado en la corrida —
Descarga: biyu-movimientos-2026-09.csv · 207 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,,8bbc9a3b-2342-46b6-865d-2459a250e613
Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento»
```

**Evidencia:** [CP-EXP-021.jpg](evidencia/CP-EXP-021.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-022 — Cada fila termina en CRLF incluida la última · **PASSED**

**Esperado:** Se abre la hoja. Se descarga el archivo. Ambas terminan en D1; después del último `0A` no hay fila en blanco ni total.

**Obtenido:**

```text
Cada línea, incluida la última, termina en `0D 0A`; no hay línea en blanco ni total al final.
— Observado en la corrida —
Descarga: biyu-movimientos-2026-09.csv · 207 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,,9e37f2f9-8550-4064-8be8-539d9c7be88b
Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento»
```

**Evidencia:** [CP-EXP-022.jpg](evidencia/CP-EXP-022.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-023 — Doce cuotas salen en una sola fila por el total · **PASSED**

**Esperado:** Se abre la hoja. Se descarga el archivo. Hay exactamente una fila de datos y los cinco campos de D4 coinciden.

**Obtenido:**

```text
Una sola fila por el total: fecha 2026-08-15, monto 120000.00, cuotas 12, primer_periodo 2026-08 e id esperado (compra en tarjeta de crédito).
— Observado en la corrida —
Descarga: biyu-movimientos-2026-08.csv · 215 bytes · 1 fila(s) de datos · fila 1: 2026-08-15,gasto,120000.00,ARS,,120000.00,Otros,Visa BBVA,12,2026-08,,1a9244ee-655e-4840-9fb2-c174ea030e49
Pantalla final: /transactions?period=2026-08 · hoja cerrada · aviso: «Exportamos 1 movimiento»
```

**Evidencia:** [CP-EXP-023.jpg](evidencia/CP-EXP-023.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-024 — Un mes con solo cuota heredada produce Vacío · **PASSED**

**Esperado:** La fila sigue mostrando `2/3` y `$10.000,00`. La hoja muestra el texto sobre cuotas anteriores. No se descarga archivo. Además, dice "No tenés movimientos con fecha en septiembre 2026."

**Obtenido:**

```text
Un mes con solo cuota heredada produce el estado Vacío: no se descarga archivo y aparece «No tenés movimientos con fecha en septiembre 2026.»
— Observado en la corrida —
Descarga: ninguna
Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV» · mensaje: «No tenés movimientos con fecha en septiembre 2026.»
```

**Evidencia:** [CP-EXP-024.jpg](evidencia/CP-EXP-024.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-025 — ARS se escribe con dos decimales exactos · **PASSED**

**Esperado:** Se abre la hoja. Se descarga el CSV. Además, contiene D9; no contiene `1.500,00`, signo ni `1500` sin decimales.

**Obtenido:**

```text
La fila contiene `gasto,1500.00,ARS,,1500.00`; no aparecen `1.500,00`, signo ni `1500` sin decimales.
— Observado en la corrida —
Descarga: biyu-movimientos-2026-09.csv · 209 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,1500.00,ARS,,1500.00,Otros,Efectivo,1,2026-09,,b08e79d0-3719-428e-aba6-ec49af7e6be2
Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento»
```

**Evidencia:** [CP-EXP-025.jpg](evidencia/CP-EXP-025.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-026 — USD conserva cuatro decimales de TC · **PASSED**

**Esperado:** Se abre la hoja. Se descarga el CSV. Además, contiene D9 exactamente.

**Obtenido:**

```text
La fila contiene `300.00,USD,1250.5000,375150.00` exacto.
— Observado en la corrida —
Descarga: biyu-movimientos-2026-09.csv · 219 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,300.00,USD,1250.5000,375150.00,Otros,Efectivo,1,2026-09,,66a7abf3-b3bf-4081-b808-661e26f4a6b1
Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento»
```

**Evidencia:** [CP-EXP-026.jpg](evidencia/CP-EXP-026.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-027 — Cambiar la referencia no recalcula el histórico · **PASSED**

**Esperado:** Se abre la hoja. Se descarga el CSV. Además, `tipo_de_cambio` es `1250.5000` y `monto_ars` es `375150.00`; no aparecen `1400.0000` ni `420000.00`.

**Obtenido:**

```text
Tras cambiar la referencia a 1400.0000 el CSV conserva `1250.5000` y `375150.00`; no aparecen `1400.0000` ni `420000.00`.
— Observado en la corrida —
Descarga: biyu-movimientos-2026-09.csv · 219 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,300.00,USD,1250.5000,375150.00,Otros,Efectivo,1,2026-09,,6b531f6c-48eb-447f-ae92-37dcd5b6e114
Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento»
```

**Evidencia:** [CP-EXP-027.jpg](evidencia/CP-EXP-027.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-028 — Una coma obliga a entrecomillar la descripción · **PASSED**

**Esperado:** Se abre la hoja. Se descarga el CSV. Además, coincide byte a byte con D2.

**Obtenido:**

```text
El campo coincide byte a byte con el esperado (coma entrecomillada / comillas internas duplicadas).
— Observado en la corrida —
Descarga: biyu-movimientos-2026-09.csv · 227 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,"Heladera, 3 cuotas",649a7b38-a67f-4214-974a-9cecea6ada82
Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento»
```

**Evidencia:** [CP-EXP-028.jpg](evidencia/CP-EXP-028.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-029 — Las comillas internas se duplican · **PASSED**

**Esperado:** Se abre la hoja. Se descarga el CSV. Además, coincide byte a byte con D2.

**Obtenido:**

```text
El campo coincide byte a byte con el esperado (coma entrecomillada / comillas internas duplicadas).
— Observado en la corrida —
Descarga: biyu-movimientos-2026-09.csv · 230 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,"Pizza ""a la piedra""",f965d5d8-2cbe-4db4-99f0-0e4d7f034cf2
Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento»
```

**Evidencia:** [CP-EXP-029.jpg](evidencia/CP-EXP-029.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-030 — Un LF queda dentro de un campo citado · **DUDA**

**Esperado:** Se abre la hoja. Se descarga el CSV. Empieza y termina con `22`, conserva el `0A` interno y la fila lógica termina en `0D 0A`. Se obtienen 12 columnas y una fila de datos; la descripción conserva dos líneas.

**Obtenido:**

```text
El campo queda entre comillas con el salto de línea (LF) adentro y el archivo se lee como 12 columnas y una fila de datos con un lector RFC 4180. No se usó Google Sheets (el paso 16 lo pide): oráculo sustituido.
— Observado en la corrida —
Descarga: biyu-movimientos-2026-09.csv · 230 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,"Línea uno\nLínea dos",373609e1-efdc-4e01-a9f6-2cb0f7d638f8
Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento»
```

**Evidencia:** [CP-EXP-030.jpg](evidencia/CP-EXP-030.jpg)
**Notas:** Google Sheets no usado; validado con un lector RFC 4180 propio
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-031 — Descripción con igual se neutraliza · **PASSED**

**Esperado:** Se abre la hoja. Se descarga el CSV. Coincide exactamente con D2: se agregó un solo apóstrofo, se conservó el resto y luego se aplicaron comillas si correspondía.

**Obtenido:**

```text
La descripción queda neutralizada con un solo apóstrofo delante (y entre comillas si corresponde); coincide con la salida esperada.
— Observado en la corrida —
Descarga: biyu-movimientos-2026-09.csv · 212 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,'=1+1,1a2752e5-cade-47d0-aa98-be6b6812ae2f
Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento»
```

**Evidencia:** [CP-EXP-031.jpg](evidencia/CP-EXP-031.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-032 — Descripción con más se neutraliza · **PASSED**

**Esperado:** Se abre la hoja. Se descarga el CSV. Coincide exactamente con D2: se agregó un solo apóstrofo, se conservó el resto y luego se aplicaron comillas si correspondía.

**Obtenido:**

```text
La descripción queda neutralizada con un solo apóstrofo delante (y entre comillas si corresponde); coincide con la salida esperada.
— Observado en la corrida —
Descarga: biyu-movimientos-2026-09.csv · 217 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,'+SUMA(A1),1cdbce5b-789a-4e2e-b3bc-0c1924923e91
Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento»
```

**Evidencia:** [CP-EXP-032.jpg](evidencia/CP-EXP-032.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-033 — Descripción con menos se neutraliza · **PASSED**

**Esperado:** Se abre la hoja. Se descarga el CSV. Coincide exactamente con D2: se agregó un solo apóstrofo, se conservó el resto y luego se aplicaron comillas si correspondía.

**Obtenido:**

```text
La descripción queda neutralizada con un solo apóstrofo delante (y entre comillas si corresponde); coincide con la salida esperada.
— Observado en la corrida —
Descarga: biyu-movimientos-2026-09.csv · 219 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,"'-5, promo",ff171f8c-0a78-45ba-a155-0f125f11d278
Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento»
```

**Evidencia:** [CP-EXP-033.jpg](evidencia/CP-EXP-033.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-034 — Descripción con arroba se neutraliza · **PASSED**

**Esperado:** Se abre la hoja. Se descarga el CSV. Coincide exactamente con D2: se agregó un solo apóstrofo, se conservó el resto y luego se aplicaron comillas si correspondía.

**Obtenido:**

```text
La descripción queda neutralizada con un solo apóstrofo delante (y entre comillas si corresponde); coincide con la salida esperada.
— Observado en la corrida —
Descarga: biyu-movimientos-2026-09.csv · 216 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,'@usuario,db793bba-b92d-4dc2-881f-7eece75d87a7
Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento»
```

**Evidencia:** [CP-EXP-034.jpg](evidencia/CP-EXP-034.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-035 — Descripción con tabulación se neutraliza · **PASSED**

**Esperado:** Se abre la hoja. Se descarga el CSV. Coincide exactamente con D2: se agregó un solo apóstrofo, se conservó el resto y luego se aplicaron comillas si correspondía.

**Obtenido:**

```text
La descripción queda neutralizada con un solo apóstrofo delante (y entre comillas si corresponde); coincide con la salida esperada.
— Observado en la corrida —
Descarga: biyu-movimientos-2026-09.csv · 214 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,'	café,ab82da7a-396d-4253-82b4-0def59207584
Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento»
```

**Evidencia:** [CP-EXP-035.jpg](evidencia/CP-EXP-035.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-036 — Descripción con retorno de carro se neutraliza · **PASSED**

**Esperado:** Se abre la hoja. Se descarga el CSV. Coincide exactamente con D2: se agregó un solo apóstrofo, se conservó el resto y luego se aplicaron comillas si correspondía.

**Obtenido:**

```text
La descripción queda neutralizada con un solo apóstrofo delante (y entre comillas si corresponde); coincide con la salida esperada.
— Observado en la corrida —
Descarga: biyu-movimientos-2026-09.csv · 215 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,"'nota",8e70bf41-a459-4e54-9f9b-9e2cd17eb207
Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento»
```

**Evidencia:** [CP-EXP-036.jpg](evidencia/CP-EXP-036.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-037 — Una categoría que empieza con igual se neutraliza · **PASSED**

**Esperado:** Se abre la hoja. Se descarga el CSV. Además, coincide exactamente con D2.

**Obtenido:**

```text
La categoría `=Categoria QA` sale como `'=Categoria QA`.
— Observado en la corrida —
Descarga: biyu-movimientos-2026-09.csv · 216 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,'=Categoria QA,Efectivo,1,2026-09,,5013a723-bc9a-4cb5-a0c3-6ae81b0d8d50
Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento»
```

**Evidencia:** [CP-EXP-037.jpg](evidencia/CP-EXP-037.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-038 — Una cuenta que empieza con arroba se neutraliza · **PASSED**

**Esperado:** Se abre la hoja. Se descarga el CSV. Además, coincide exactamente con D2.

**Obtenido:**

```text
La cuenta `@Cuenta QA` sale como `'@Cuenta QA`.
— Observado en la corrida —
Descarga: biyu-movimientos-2026-09.csv · 210 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,'@Cuenta QA,1,2026-09,,9f4e6834-6d74-4c1a-bbc0-e1407b2b0227
Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento»
```

**Evidencia:** [CP-EXP-038.jpg](evidencia/CP-EXP-038.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-039 — Las filas se ordenan por fecha y creación · **PASSED**

**Esperado:** Se abre la hoja. Se descarga el CSV. Además, el orden coincide exactamente con D5.

**Obtenido:**

```text
El orden de las filas es B, C, A (fecha y luego created_at, con created_at(B) < created_at(C)).
— Observado en la corrida —
Descarga: biyu-movimientos-2026-09.csv · 407 bytes · 3 fila(s) de datos · fila 1: 2026-09-10,gasto,200.00,ARS,,200.00,Otros,Efectivo,1,2026-09,,50e42b19-7fca-4991-99e1-a8331eb683c1
Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 3 movimientos»
```

**Evidencia:** [CP-EXP-039.jpg](evidencia/CP-EXP-039.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-040 — 1.000 transacciones se exportan sin faltantes · **PASSED**

**Esperado:** Se abre la hoja. El alcance anual queda elegido. Se descarga el CSV. Además, coincide exactamente con D3. Además, hay exactamente N además del encabezado. Se ve el CSV anual descargado. El encabezado y las N filas están disponibles para contar. Hay N UUID distintos y el conjunto coincide: ninguno falta ni se repite.

**Obtenido:**

```text
El CSV trae exactamente N UUID distintos que coinciden con los creados (ninguno falta ni se repite) y el aviso dice «Exportamos N movimientos» con separador de miles.
— Observado en la corrida —
Descarga: biyu-movimientos-2025.csv · 104107 bytes · 1000 fila(s) de datos · fila 1: 2025-09-15,gasto,1.00,ARS,,1.00,Otros,Efectivo,1,2025-09,EXP-0001,48880cb3-3fe2-4507-b511-31b3a3864cdb
Pantalla final: /transactions?period=2025-09 · hoja cerrada · aviso: «Exportamos 1.000 movimientos»
```

**Evidencia:** [CP-EXP-040.jpg](evidencia/CP-EXP-040.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-041 — 1.500 transacciones se exportan sin faltantes · **PASSED**

**Esperado:** Se abre la hoja. El alcance anual queda elegido. Se descarga el CSV. Además, coincide exactamente con D3. Además, hay exactamente N además del encabezado. Se ve el CSV anual descargado. El encabezado y las N filas están disponibles para contar. Hay N UUID distintos y el conjunto coincide: ninguno falta ni se repite.

**Obtenido:**

```text
El CSV trae exactamente N UUID distintos que coinciden con los creados (ninguno falta ni se repite) y el aviso dice «Exportamos N movimientos» con separador de miles.
— Observado en la corrida —
Descarga: biyu-movimientos-2025.csv · 156107 bytes · 1500 fila(s) de datos · fila 1: 2025-09-15,gasto,1.00,ARS,,1.00,Otros,Efectivo,1,2025-09,EXP-0001,d11874af-4400-4b0f-90b5-274489817464
Pantalla final: /transactions?period=2025-09 · hoja cerrada · aviso: «Exportamos 1.500 movimientos»
```

**Evidencia:** [CP-EXP-041.jpg](evidencia/CP-EXP-041.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-042 — 2.000 transacciones se exportan sin faltantes · **PASSED**

**Esperado:** Se abre la hoja. El alcance anual queda elegido. Se descarga el CSV. Además, coincide exactamente con D3. Además, hay exactamente N además del encabezado. Se ve el CSV anual descargado. El encabezado y las N filas están disponibles para contar. Hay N UUID distintos y el conjunto coincide: ninguno falta ni se repite.

**Obtenido:**

```text
El CSV trae exactamente N UUID distintos que coinciden con los creados (ninguno falta ni se repite) y el aviso dice «Exportamos N movimientos» con separador de miles.
— Observado en la corrida —
Descarga: biyu-movimientos-2025.csv · 208107 bytes · 2000 fila(s) de datos · fila 1: 2025-09-15,gasto,1.00,ARS,,1.00,Otros,Efectivo,1,2025-09,EXP-0001,c5a93c10-1575-48c6-b888-50dca9b862c7
Pantalla final: /transactions?period=2025-09 · hoja cerrada · aviso: «Exportamos 2.000 movimientos»
```

**Evidencia:** [CP-EXP-042.jpg](evidencia/CP-EXP-042.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-043 — El CSV de A no contiene movimientos de B · **PASSED**

**Esperado:** Se abre la hoja. Se descarga un CSV con una fila. Además, contiene `111.00`, `SOLO-A`, `<ID-A>`; no contiene `999.00`, `SOLO-B` ni `<ID-B>`.

**Obtenido:**

```text
El CSV del usuario A trae una fila (111.00, SOLO-A, su id) y nada de B (999.00, SOLO-B, id de B).
— Observado en la corrida —
Descarga: biyu-movimientos-2026-09.csv · 213 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,111.00,ARS,,111.00,Otros,Efectivo,1,2026-09,SOLO-A,b007657f-13b0-434a-9080-0d5a61601302
Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento»
```

**Evidencia:** [CP-EXP-043.jpg](evidencia/CP-EXP-043.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-044 — La API con token de A devuelve cero filas de B · **PASSED**

**Esperado:** HTTP 200 y cuerpo exacto `[]`; no aparecen `<ID-B>` ni `999`.

**Obtenido:**

```text
Con el token de A, la lectura de `transactions` filtrada por el id de B responde HTTP 200 con `[]`; sin filtro, A ve 0 filas.
— Observado en la corrida —
API con token de A: GET transactions?id=eq.<ID-B> → HTTP 200, []; GET transactions (sin filtro) → 0 filas
Pantalla final: /register · hoja cerrada
```

**Evidencia:** [CP-EXP-044.jpg](evidencia/CP-EXP-044.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-045 — Categoría archivada sale con el nombre actual · **PASSED**

**Esperado:** Se abre la hoja. Se descarga el CSV. Además, es `Viajes 2026`, no `Viajes` ni vacío.

**Obtenido:**

```text
La categoría archivada sale con el nombre actual `Viajes 2026`.
— Observado en la corrida —
Descarga: biyu-movimientos-2026-09.csv · 213 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Viajes 2026,Efectivo,1,2026-09,,5ec7ca84-dceb-45b6-bde5-711d1cb0472a
Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento»
```

**Evidencia:** [CP-EXP-045.jpg](evidencia/CP-EXP-045.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-046 — Cuenta archivada sale con el nombre actual · **PASSED**

**Esperado:** Se abre la hoja. Se descarga el CSV. Además, es `Billetera QA 2026`, no el nombre anterior ni vacío.

**Obtenido:**

```text
La cuenta archivada sale con el nombre actual `Billetera QA 2026`.
— Observado en la corrida —
Descarga: biyu-movimientos-2026-09.csv · 216 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Billetera QA 2026,1,2026-09,,4b25e416-be24-409e-aac5-50a961f4cf8b
Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento»
```

**Evidencia:** [CP-EXP-046.jpg](evidencia/CP-EXP-046.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-047 — Un ingreso exporta categoría vacía · **PASSED**

**Esperado:** Se abre la hoja. Se descarga el CSV. Además, `tipo` es `ingreso` y `categoria` es el campo vacío entre dos comas.

**Obtenido:**

```text
Un ingreso exporta `tipo=ingreso` y `categoria` vacía (campo vacío entre dos comas).
— Observado en la corrida —
Descarga: biyu-movimientos-2026-09.csv · 219 bytes · 1 fila(s) de datos · fila 1: 2026-09-01,ingreso,850000.00,ARS,,850000.00,,Billetera virtual,1,2026-09,,9c1820e1-04c4-4e4a-91fc-69f3f1598e4a
Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento»
```

**Evidencia:** [CP-EXP-047.jpg](evidencia/CP-EXP-047.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-048 — Eliminar una cuenta quita su transacción · **PASSED**

**Esperado:** Se abre la hoja. No se descarga archivo. Además, dice "No tenés movimientos con fecha en septiembre 2026."

**Obtenido:**

```text
Tras eliminar la cuenta, su transacción ya no existe: no se descarga archivo y aparece el mensaje de período vacío.
— Observado en la corrida —
Descarga: ninguna
Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV» · mensaje: «No tenés movimientos con fecha en septiembre 2026.»
```

**Evidencia:** [CP-EXP-048.jpg](evidencia/CP-EXP-048.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-049 — Descargar muestra Exportando y aria-busy · **PASSED**

**Esperado:** Se abre la hoja. El botón dice "Exportando…", está deshabilitado y tiene `aria-busy="true"`.

**Obtenido:**

```text
Con la lectura demorada, el botón dice «Exportando…», está deshabilitado y tiene `aria-busy="true"`. Demora simulada de 4 s (no 1 kbit/s de DevTools).
— Observado en la corrida —
Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Exportando…»
```

**Evidencia:** [CP-EXP-049.jpg](evidencia/CP-EXP-049.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-050 — Los controles quedan bloqueados al exportar · **PASSED**

**Esperado:** Se abre la hoja. Se ve "Exportando…". Además, los tres controles están deshabilitados.

**Obtenido:**

```text
Con «Exportando…» quedan deshabilitados los dos alcances, «Cancelar» y «Descargar CSV». Demora simulada de 4 s.
— Observado en la corrida —
Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Exportando…»
```

**Evidencia:** [CP-EXP-050.jpg](evidencia/CP-EXP-050.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-051 — Un doble click inicia una sola descarga · **PASSED**

**Esperado:** Se abre la hoja. El control pasa a "Exportando…" y queda deshabilitado. Aparece un solo archivo y un solo aviso "Exportamos 1 movimiento"; no aparece archivo con sufijo.

**Obtenido:**

```text
Un doble clic rápido genera una sola descarga y un solo aviso «Exportamos 1 movimiento».
— Observado en la corrida —
Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento»
```

**Evidencia:** [CP-EXP-051.jpg](evidencia/CP-EXP-051.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-052 — Una fila usa singular y cierra la hoja · **PASSED**

**Esperado:** Se abre la hoja. Se descarga el archivo. Además, la hoja está cerrada y aparece exactamente D1. Además, hay exactamente 1.

**Obtenido:**

```text
Descarga el archivo, la hoja se cierra y aparece exactamente «Exportamos 1 movimiento» (un solo aviso).
— Observado en la corrida —
Descarga: biyu-movimientos-2026-09.csv · 207 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,,4881fc60-ca80-4dd3-a91d-81bdc70dac3b
Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento»
```

**Evidencia:** [CP-EXP-052.jpg](evidencia/CP-EXP-052.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-053 — Dos filas usan plural · **PASSED**

**Esperado:** Se abre la hoja. Se descarga el archivo. Además, aparece exactamente D1. Además, hay exactamente 2.

**Obtenido:**

```text
Descarga el archivo y aparece exactamente «Exportamos 2 movimientos» (un solo aviso).
— Observado en la corrida —
Descarga: biyu-movimientos-2026-09.csv · 307 bytes · 2 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,,46a94a75-a5af-49ad-b59d-722d14818b6e
Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 2 movimientos»
```

**Evidencia:** [CP-EXP-053.jpg](evidencia/CP-EXP-053.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-054 — Un mes sin transacciones muestra Vacío · **PASSED**

**Esperado:** Se abre la hoja. No se descarga archivo. Además, dice "No tenés movimientos con fecha en septiembre 2026." El mensaje coincide exactamente con el texto esperado del paso 14. La opción anual queda elegida y desaparece el mensaje mensual.

**Obtenido:**

```text
Un mes sin transacciones muestra el mensaje de Vacío; al elegir «Todo 2026» queda elegido y el mensaje mensual desaparece.
— Observado en la corrida —
Descarga: ninguna
Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV»
```

**Evidencia:** [CP-EXP-054.jpg](evidencia/CP-EXP-054.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-055 — Un año sin transacciones muestra Vacío anual · **PASSED**

**Esperado:** Se abre la hoja. El alcance anual queda elegido. No se descarga archivo. Además, dice "No tenés movimientos con fecha en 2025."

**Obtenido:**

```text
Un año sin transacciones: no se descarga archivo y aparece «No tenés movimientos con fecha en 2025.»
— Observado en la corrida —
Descarga: ninguna
Pantalla final: /transactions?period=2025-06 · hoja abierta · botón «Descargar CSV» · mensaje: «No tenés movimientos con fecha en 2025.»
```

**Evidencia:** [CP-EXP-055.jpg](evidencia/CP-EXP-055.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-056 — Un período con solo eliminadas muestra Vacío · **PASSED**

**Esperado:** Se abre la hoja. No se descarga archivo. Además, dice "No tenés movimientos con fecha en septiembre 2026."

**Obtenido:**

```text
Con solo transacciones eliminadas: no se descarga archivo y aparece el mensaje de período vacío.
— Observado en la corrida —
Descarga: ninguna
Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV» · mensaje: «No tenés movimientos con fecha en septiembre 2026.»
```

**Evidencia:** [CP-EXP-056.jpg](evidencia/CP-EXP-056.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-057 — Offline muestra el error exacto · **PASSED**

**Esperado:** Se abre la hoja. Las solicitudes nuevas quedan sin conexión. No se descarga archivo. Además, tiene `role="alert"` y dice "No pudimos exportar tus movimientos. Probá de nuevo." Además, alcances, "Descargar CSV" y "Cancelar" están habilitados.

**Obtenido:**

```text
Sin conexión: no se descarga archivo, aparece (con `role="alert"`) «No pudimos exportar tus movimientos. Probá de nuevo.» y alcances, «Descargar CSV» y «Cancelar» quedan habilitados.
— Observado en la corrida —
Descarga: ninguna
Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV» · error: «No pudimos exportar tus movimientos. Probá de nuevo.»
```

**Evidencia:** [CP-EXP-057.jpg](evidencia/CP-EXP-057.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-058 — El reintento después de Offline descarga completo · **PASSED**

**Esperado:** Se abre la hoja. Las solicitudes quedan sin conexión. Se muestra el error y no se descarga. La conexión queda restablecida. El error desaparece, se descarga el archivo y aparece "Exportamos 2 movimientos". Además, contiene exactamente `<ID-A>` y `<ID-B>`, una vez cada uno.

**Obtenido:**

```text
Al volver la conexión y reintentar, el error desaparece, se descarga el archivo con los dos ids una vez cada uno y aparece «Exportamos 2 movimientos».
— Observado en la corrida —
Descarga: biyu-movimientos-2026-09.csv · 307 bytes · 2 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,,00ea166a-1fbd-4118-928c-e941969f1ab4
Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 2 movimientos»
```

**Evidencia:** [CP-EXP-058.jpg](evidencia/CP-EXP-058.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-059 — Cancelar desde Error cierra sin descargar · **PASSED**

**Esperado:** Se abre la hoja. Las solicitudes quedan sin conexión. Aparece el error exacto. La hoja se cierra, no se descarga archivo y la URL conserva D2.

**Obtenido:**

```text
Desde el estado Error, «Cancelar» cierra la hoja, no se descarga nada y la URL conserva `?period=2026-09`.
— Observado en la corrida —
Descarga: ninguna
Pantalla final: /transactions?period=2026-09 · hoja cerrada
```

**Evidencia:** [CP-EXP-059.jpg](evidencia/CP-EXP-059.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-060 — Cancelar cierra sin descargar · **PASSED**

**Esperado:** Se abre la hoja. La hoja se cierra, no se descarga archivo y la URL conserva D1.

**Obtenido:**

```text
«Cancelar» cierra la hoja sin descargar y la URL conserva `?period=2026-09`.
— Observado en la corrida —
Descarga: ninguna
Pantalla final: /transactions?period=2026-09 · hoja cerrada
```

**Evidencia:** [CP-EXP-060.jpg](evidencia/CP-EXP-060.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-061 — Escape cierra sin descargar · **PASSED**

**Esperado:** Se abre la hoja. La hoja se cierra, no se descarga archivo y la URL conserva D1.

**Obtenido:**

```text
Escape cierra la hoja sin descargar y la URL conserva `?period=2026-09`.
— Observado en la corrida —
Descarga: ninguna
Pantalla final: /transactions?period=2026-09 · hoja cerrada
```

**Evidencia:** [CP-EXP-061.jpg](evidencia/CP-EXP-061.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-062 — Tocar fuera cierra sin descargar · **FAILED**

**Esperado:** Se abre la hoja. La hoja se cierra, no se descarga archivo y la URL conserva D1.

**Obtenido:**

```text
FALLA. Un clic sobre el fondo oscuro, fuera de la hoja, no la cierra: el clic lo recibe el `div` de fondo (`aria-hidden`), que es hijo del contenedor, y el controlador exige que el destino del clic sea el propio contenedor. La hoja sigue abierta.
— Observado en la corrida —
Descarga: ninguna
Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV»
Falla detectada: tocar fuera NO cierra la hoja (el click cae en el div de fondo aria-hidden, no en el contenedor)
```

**Evidencia:** [CP-EXP-062.jpg](evidencia/CP-EXP-062.jpg)
**Defectos:** DEF-030
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-063 — Atrás cierra la hoja inicial · **FAILED**

**Esperado:** Se abre la hoja fijada a septiembre. La hoja se cierra, la URL pasa a `?period=2026-08` y no se descarga archivo.

**Obtenido:**

```text
FALLA. Con la hoja abierta, «Atrás» cambia la URL a `?period=2026-08` (el evento `popstate` se dispara) pero la hoja sigue abierta.
— Observado en la corrida —
Pantalla final: /transactions?period=2026-08 · hoja abierta · botón «Descargar CSV»
Falla detectada: la URL pasó a 2026-08 pero la hoja sigue abierta
```

**Evidencia:** [CP-EXP-063.jpg](evidencia/CP-EXP-063.jpg)
**Defectos:** DEF-031
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-064 — Atrás durante Exportando cancela la descarga · **FAILED**

**Esperado:** Se abre la hoja. Se ve "Exportando…". La hoja se cierra y la URL pasa a agosto. No aparece ningún archivo ni aviso de éxito.

**Obtenido:**

```text
FALLA. «Atrás» durante «Exportando…» no cancela la exportación: cuando termina la lectura se descarga el archivo y aparece el aviso «Exportamos 1 movimiento», con el usuario ya en el mes anterior.
— Observado en la corrida —
Pantalla final: /transactions?period=2026-08 · hoja cerrada · aviso: «Exportamos 1 movimiento»
Falla detectada: Atrás durante Exportando no cancela: descargas=1, avisos de éxito=1
```

**Evidencia:** [CP-EXP-064.jpg](evidencia/CP-EXP-064.jpg)
**Defectos:** DEF-032
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-065 — Adelante cierra la hoja inicial · **FAILED**

**Esperado:** Se vuelve a agosto y Adelante tiene destino septiembre. Se abre la hoja fijada a agosto. La hoja se cierra, la URL pasa a `?period=2026-09` y no se descarga archivo.

**Obtenido:**

```text
FALLA. Con la hoja abierta, «Adelante» cambia la URL a `?period=2026-09` pero la hoja sigue abierta.
— Observado en la corrida —
Descarga: ninguna
Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV»
Falla detectada: la URL pasó a 2026-09 pero la hoja sigue abierta
```

**Evidencia:** [CP-EXP-065.jpg](evidencia/CP-EXP-065.jpg)
**Defectos:** DEF-031
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-066 — Salir a Resumen cierra la hoja · **PASSED**

**Esperado:** Se abre la hoja.

**Obtenido:**

```text
Al salir a `/dashboard?period=2026-09` se abre Resumen, la hoja desaparece y no se descarga archivo.
— Observado en la corrida —
Descarga: ninguna
Pantalla final: /dashboard?period=2026-09 · hoja cerrada
```

**Evidencia:** [CP-EXP-066.jpg](evidencia/CP-EXP-066.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-067 — Exportar no modifica datos ni período · **PASSED**

**Esperado:** La fila `<ID-A>` sigue mostrando `$3.000,00` antes de abrir Exportar. Se abre la hoja. Se descarga un CSV con una fila y la URL sigue D3. Sigue una fila por `$3.000,00`.

**Obtenido:**

```text
Exportar no modifica datos ni período: sigue una fila por `$3.000,00` (también tras recargar) y la API muestra la transacción sin `deleted_at`.
— Observado en la corrida —
Descarga: biyu-movimientos-2026-09.csv · 209 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,3000.00,ARS,,3000.00,Otros,Efectivo,1,2026-09,,995ac1b9-b682-4c3d-9572-ef17aa8df23e
Pantalla final: /transactions?period=2026-09 · hoja cerrada
```

**Evidencia:** [CP-EXP-067.jpg](evidencia/CP-EXP-067.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-068 — Una alta concurrente impide descargar un año incompleto · **PASSED**

**Esperado:** Se abre la hoja. El alcance anual queda elegido. Se ve "Exportando…" y comienzan las lecturas paginadas. La primera página terminó y la exportación continúa. Se ve Registrar en el paso 3/3 con monto `2` y cuenta "Efectivo". El campo de fecha queda editable. El cursor queda en el campo. El campo muestra `31/12/2025`. Aparece "Gasto guardado" y el botón muestra "Guardado". La hoja sigue en "Exportando…" o ya muestra el resultado. No se descarga ningún archivo; la hoja sigue abierta. Además, dice "No pudimos exportar tus movimientos. Probá de nuevo." con `role="alert"`.

**Obtenido:**

```text
Con 1.500 transacciones y un alta concurrente de 2,00 con fecha 31/12/2025 durante la lectura: no se descarga archivo, la hoja sigue abierta y aparece el error con `role="alert"`. El alta se hizo por API entre la 1.ª y la 2.ª página, no desde una segunda ventana.
— Observado en la corrida —
Descarga: ninguna
Pantalla final: /transactions?period=2025-09 · hoja abierta · botón «Descargar CSV» · error: «No pudimos exportar tus movimientos. Probá de nuevo.»
```

**Evidencia:** [CP-EXP-068.jpg](evidencia/CP-EXP-068.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-069 — Escape no cierra la hoja durante Exportando · **PASSED**

**Esperado:** Se abre la hoja. Se ve "Exportando…". La hoja permanece abierta y sigue mostrando "Exportando…".

**Obtenido:**

```text
Con la hoja en «Exportando…», Escape no la cierra y sigue mostrando «Exportando…».
— Observado en la corrida —
Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Exportando…»
```

**Evidencia:** [CP-EXP-069.jpg](evidencia/CP-EXP-069.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-070 — Tocar fuera no cierra la hoja durante Exportando · **PASSED**

**Esperado:** Se abre la hoja. Se ve "Exportando…". La hoja permanece abierta y sigue mostrando "Exportando…".

**Obtenido:**

```text
La hoja sigue abierta y mostrando «Exportando…», pero el caso no prueba nada hoy: tocar fuera nunca cierra la hoja (ver DEF-030 / CP-EXP-062), así que el resultado sería el mismo sin el bloqueo.
— Observado en la corrida —
Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Exportando…»
```

**Evidencia:** [CP-EXP-070.jpg](evidencia/CP-EXP-070.jpg)
**Defectos:** DEF-030
**Notas:** Sin valor hoy: tocar fuera nunca cierra la hoja (DEF-030); el resultado sería el mismo sin el bloqueo
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-071 — Un lector RFC 4180 obtiene doce columnas · **DUDA**

**Esperado:** Se abre la hoja. Se descarga el CSV. Se muestra una hoja sin datos. Se abre el menú Archivo. Se abre el diálogo Importar archivo. Se muestra la zona para subir un archivo. Se muestra la configuración de importación. El separador "Coma" queda seleccionado. Se importa un encabezado y una fila de datos. Además, hay exactamente 12 columnas. Además, conserva `Uno, "dos"`, un salto de línea y `Tres` en una sola celda.

**Obtenido:**

```text
El CSV se lee como 12 columnas y una fila de datos con un lector RFC 4180; la descripción `Uno, "dos"` + salto de línea + `Tres` queda en una sola celda. No se usó Google Sheets (pasos 16 a 21): oráculo sustituido.
— Observado en la corrida —
Descarga: biyu-movimientos-2026-09.csv · 226 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,"Uno, ""dos""\nTres",3953e175-6f06-44e8-be8d-320ad7b0cba5
Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento»
```

**Evidencia:** [CP-EXP-071.jpg](evidencia/CP-EXP-071.jpg)
**Notas:** Google Sheets no usado; validado con un lector RFC 4180 propio
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-072 — Exportar no modifica el total de Resumen · **PASSED**

**Esperado:** Se abre la hoja. Se descarga un CSV con una fila.

**Obtenido:**

```text
El total de Resumen vuelve a mostrar exactamente `$3.000,00` después de exportar.
— Observado en la corrida —
Descarga: biyu-movimientos-2026-09.csv · 209 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,3000.00,ARS,,3000.00,Otros,Efectivo,1,2026-09,,82f64962-e77d-46df-9539-7e9ed24fe908
Pantalla final: /dashboard?period=2026-09 · hoja cerrada
```

**Evidencia:** [CP-EXP-072.jpg](evidencia/CP-EXP-072.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-073 — HTTP 500 muestra Error y no descarga · **PASSED**

**Esperado:** Se abre la hoja. No se descarga archivo y aparece "No pudimos exportar tus movimientos. Probá de nuevo." con `role="alert"`.

**Obtenido:**

```text
No se descarga archivo y aparece «No pudimos exportar tus movimientos. Probá de nuevo.» con `role="alert"` (respuesta interceptada con HTTP 500 / monto textual inválido, simulado con una ruta de Playwright en lugar de pegar el código en la consola).
— Observado en la corrida —
Descarga: ninguna
Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV» · error: «No pudimos exportar tus movimientos. Probá de nuevo.»
```

**Evidencia:** [CP-EXP-073.jpg](evidencia/CP-EXP-073.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-074 — Un monto textual inválido cancela la descarga · **PASSED**

**Esperado:** Se abre la hoja. No se descarga archivo y aparece "No pudimos exportar tus movimientos. Probá de nuevo." con `role="alert"`.

**Obtenido:**

```text
No se descarga archivo y aparece «No pudimos exportar tus movimientos. Probá de nuevo.» con `role="alert"` (respuesta interceptada con HTTP 500 / monto textual inválido, simulado con una ruta de Playwright en lugar de pegar el código en la consola).
— Observado en la corrida —
Descarga: ninguna
Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV» · error: «No pudimos exportar tus movimientos. Probá de nuevo.»
```

**Evidencia:** [CP-EXP-074.jpg](evidencia/CP-EXP-074.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-EXP-075 — Cambiar el alcance borra el mensaje de Error · **PASSED**

**Esperado:** Se abre la hoja. Aparece el mensaje de Error. "Todo 2026" queda elegido y desaparece el mensaje "No pudimos exportar tus movimientos. Probá de nuevo."

**Obtenido:**

```text
Al elegir «Todo 2026» queda elegido y el mensaje de error desaparece.
— Observado en la corrida —
Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV»
```

**Evidencia:** [CP-EXP-075.jpg](evidencia/CP-EXP-075.jpg)
**Ejecutó:** Claude Code (IA), supervisado por Santiago
