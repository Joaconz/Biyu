# Proyecto Biyu – Entrega 2 · Reportes de defectos (V2) · Exportar CSV

Planilla: `05-reportes-de-defectos-exp.xlsx` (un índice y una hoja por defecto, con el formato "Defect Report - Template" de la cátedra). La numeración sigue la de la Entrega 2: DEF-029 es el último de [`05-reportes-de-defectos.md`](05-reportes-de-defectos.md) y los de Exportar CSV empiezan en **DEF-030**. Todavía no tienen issue en GitHub: quedan listos para cargar.

Escala de severidad y flujo de estados: `docs/07-plan-de-testing.md` §5. Severidad la fija quien reporta; **prioridad la fija el PO** (la que figura acá es la sugerida por quien reportó).

## Resumen

| ID | Título | Severidad | Prioridad sugerida | Estado | Caso | Historia |
|---|---|---|---|---|---|---|
| DEF-030 | Tocar fuera de la hoja «Exportar movimientos» no la cierra | Media | A definir por el PO | Abierto · se reproduce el 2026-10-27 | CP-EXP-062 (también quita valor a CP-EXP-070) | US-47 · Exportar movimientos a CSV (CA-23) |
| DEF-031 | «Atrás» y «Adelante» del navegador cambian la URL pero la hoja de exportar queda abierta | Media | A definir por el PO | Abierto · se reproduce el 2026-10-27 | CP-EXP-063 y CP-EXP-065 | US-47 · Exportar movimientos a CSV (CA-24 y requisito «todo cambio de URL») |
| DEF-032 | «Atrás» durante «Exportando…» no cancela la exportación: el archivo se descarga igual | Media | A definir por el PO | Abierto · se reproduce el 2026-10-27 | CP-EXP-064 | US-47 · Exportar movimientos a CSV (CA-24) |

**Abiertos por severidad:** Crítica: 0 · Alta: 0 · Media: 3 · Baja: 0 · Total abiertos: 3.

## DEF-030 · Tocar fuera de la hoja «Exportar movimientos» no la cierra

| Campo | Contenido |
|---|---|
| Estado | Abierto · se reproduce el 2026-10-27 |
| Severidad | Media |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | ejecución de CP-EXP-062 (Entrega 2). |
| Caso de prueba | CP-EXP-062 (también quita valor a CP-EXP-070) |
| Historia | US-47 · Exportar movimientos a CSV (CA-23) |
| Issue | A crear |
| Reportó | Claude Code (IA), supervisado por Santiago |
| Entorno | Local, 2026-10-27 · Vite (http://127.0.0.1:5173) + Supabase local · main 1c72d0f · Chromium (Playwright 1.63), reloj fijado en 09/10/2026 |

Tocar fuera de la hoja «Exportar movimientos» no la cierra.

**Pasos para reproducir**

1. Abrir la app e iniciar sesión con un usuario de prueba. Si aparece la configuración inicial, tocar «Saltear» en sus 4 pasos.
2. Crear un gasto con fecha en septiembre de 2026 y abrir en el navegador /transactions?period=2026-09.
3. Tocar «Exportar» arriba a la derecha: se abre la hoja «Exportar movimientos».
4. Hacer clic sobre el fondo oscuro, fuera de la hoja (por ejemplo, en la esquina superior izquierda de la pantalla).
5. Mirar si la hoja sigue abierta.

**Resultado esperado.** CA-23 / CP-EXP-062: tocar fuera de la hoja la cierra sin descargar nada y la URL conserva ?period=2026-09 (mientras no esté en «Exportando…»).

**Resultado obtenido.** La hoja sigue abierta. El elemento que recibe el clic en esa posición es el div de fondo (clases fixed inset-0 -z-10, aria-hidden="true"), no el contenedor de la hoja. Solo «Cancelar» y Escape la cierran.

**Evidencia.** Captura evidencia/CP-EXP-062.jpg (hoja abierta tras el clic) y document.elementFromPoint(5, 5) = DIV.fixed.inset-0.-z-10.bg-[rgba(43,30,25,0.32)], aria-hidden=true

**Notas.** Causa probable: en src/components/transactions/ExportTransactionsDialog.tsx el cierre por clic exige e.target === e.currentTarget, pero el div de fondo es hijo del contenedor y cubre toda la pantalla: recibe el clic y el destino nunca coincide. No se corrigió nada.

## DEF-031 · «Atrás» y «Adelante» del navegador cambian la URL pero la hoja de exportar queda abierta

| Campo | Contenido |
|---|---|
| Estado | Abierto · se reproduce el 2026-10-27 |
| Severidad | Media |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | ejecución de CP-EXP-063 y CP-EXP-065 (Entrega 2). |
| Caso de prueba | CP-EXP-063 y CP-EXP-065 |
| Historia | US-47 · Exportar movimientos a CSV (CA-24 y requisito «todo cambio de URL») |
| Issue | A crear |
| Reportó | Claude Code (IA), supervisado por Santiago |
| Entorno | Local, 2026-10-27 · Vite (http://127.0.0.1:5173) + Supabase local · main 1c72d0f · Chromium (Playwright 1.63), reloj fijado en 09/10/2026 |

Con la hoja «Exportar movimientos» abierta, «Atrás» y «Adelante» del navegador cambian el período de la URL pero la hoja no se cierra.

**Pasos para reproducir**

1. Abrir la app e iniciar sesión con un usuario de prueba (con la configuración inicial salteada).
2. Abrir en el navegador /transactions?period=2026-08.
3. Tocar el botón de mes siguiente: la URL pasa a ?period=2026-09.
4. Tocar «Exportar»: se abre la hoja.
5. Hacer clic en «Atrás» del navegador y mirar la URL y la hoja. (Para CP-EXP-065: abrir la hoja en agosto, después de haber vuelto desde septiembre, y hacer clic en «Adelante».)

**Resultado esperado.** CA-24 / CP-EXP-063 y 065: la hoja se cierra, la URL pasa a ?period=2026-08 (con «Adelante», a ?period=2026-09) y no se descarga archivo.

**Resultado obtenido.** La URL cambia al período anterior (o al siguiente) y la hoja sigue abierta. El evento popstate sí se dispara (verificado en 3 de 3 repeticiones), pero la hoja no se cierra.

**Evidencia.** Capturas evidencia/CP-EXP-063.jpg y evidencia/CP-EXP-065.jpg (URL cambiada con la hoja abierta); log de popstate: ['popstate@?period=2026-08']

**Notas.** Causa no determinada. En ExportTransactionsDialog.tsx hay un efecto que cierra la hoja cuando cambia location.key y un oyente de popstate; ninguno logra cerrarla. Hipótesis sin confirmar: el efecto que reinicia initialLocationKeyRef cuando cambia location.key corre antes del que compara la clave y la deja siempre igual. No se corrigió nada.

## DEF-032 · «Atrás» durante «Exportando…» no cancela la exportación: el archivo se descarga igual

| Campo | Contenido |
|---|---|
| Estado | Abierto · se reproduce el 2026-10-27 |
| Severidad | Media |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | ejecución de CP-EXP-064 (Entrega 2). |
| Caso de prueba | CP-EXP-064 |
| Historia | US-47 · Exportar movimientos a CSV (CA-24) |
| Issue | A crear |
| Reportó | Claude Code (IA), supervisado por Santiago |
| Entorno | Local, 2026-10-27 · Vite (http://127.0.0.1:5173) + Supabase local · main 1c72d0f · Chromium (Playwright 1.63), reloj fijado en 09/10/2026 |

«Atrás» durante «Exportando…» no cancela la exportación: el archivo se descarga igual.

**Pasos para reproducir**

1. Abrir la app e iniciar sesión con un usuario de prueba que tenga un gasto de septiembre de 2026.
2. Abrir /transactions?period=2026-08, tocar el mes siguiente (URL ?period=2026-09) y tocar «Exportar».
3. Demorar unos segundos las respuestas de /rest/v1/transactions (en las pruebas, 3 s con Playwright; en DevTools, «1 kbit/s» y latencia 2000 ms).
4. Tocar «Descargar CSV»: el botón pasa a «Exportando…».
5. Hacer clic en «Atrás» del navegador y esperar a que termine la demora.

**Resultado esperado.** CA-24 / CP-EXP-064 (paso 22): la exportación se cancela; no aparece ningún archivo ni aviso de éxito.

**Resultado obtenido.** Al terminar la lectura se descarga biyu-movimientos-2026-09.csv y aparece el aviso «Exportamos 1 movimiento» (1 descarga y 1 aviso), con el usuario ya en ?period=2026-08.

**Evidencia.** Captura evidencia/CP-EXP-064.jpg (aviso de éxito en el período anterior); descargas registradas por el navegador = 1

**Notas.** Relacionado con DEF-031: el cierre por «Atrás» no llega a abortar la exportación en curso (AbortController). No se investigó a fondo. No se corrigió nada.
