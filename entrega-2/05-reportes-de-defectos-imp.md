# Proyecto Biyu – Entrega 2 · Reportes de defectos (V2) · Importar Excel

Planilla: `05-reportes-de-defectos-imp.xlsx` (un índice y una hoja por defecto, con el formato "Defect Report - Template" de la cátedra). La numeración sigue la de la Entrega 2: [`05-reportes-de-defectos.md`](05-reportes-de-defectos.md) llega hasta DEF-029 y [`05-reportes-de-defectos-exp.md`](05-reportes-de-defectos-exp.md) usa DEF-030 a DEF-032. Los de Suscripciones siguen desde DEF-034. Todavía no tienen issue en GitHub: quedan listos para cargar.

Escala de severidad y flujo de estados: `docs/07-plan-de-testing.md` §5. Severidad la fija quien reporta; **prioridad la fija el PO** (la que figura acá es la sugerida por quien reportó).

**Los casos BLOCKED no tienen defecto:** dependen de funcionalidades todavía no implementadas (ver el reporte de ejecución) y se vuelven a ejecutar en V3.

## Resumen

| ID | Título | Severidad | Prioridad sugerida | Estado | Caso | Historia |
|---|---|---|---|---|---|---|
| DEF-033 | La tarjeta de una fila lista muestra la categoría y la cuenta como están escritas en el archivo, no como se llaman en Biyu | Baja | A definir por el PO | Abierto · se reproduce el 2026-10-27 | CP-IMP-052 | US-76 · Revisión de filas (CA-5) |

**Abiertos por severidad:** Crítica: 0 · Alta: 0 · Media: 0 · Baja: 1 · Total abiertos: 1.

## DEF-033 · La tarjeta de una fila lista muestra la categoría y la cuenta como están escritas en el archivo, no como se llaman en Biyu

| Campo | Contenido |
|---|---|
| Estado | Abierto · se reproduce el 2026-10-27 |
| Severidad | Baja |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | ejecución de CP-IMP-052 (Entrega 2). |
| Caso de prueba | CP-IMP-052 |
| Historia | US-76 · Revisión de filas (CA-5) |
| Issue | A crear |
| Reportó | Claude Code (IA), supervisado por Santiago |
| Entorno | Local, 2026-10-27 · Vite (http://127.0.0.1:5173) + Supabase local · main 1c72d0f · Chromium (Playwright 1.63) |

En la Revisión del importador, la tarjeta de una fila «Lista» muestra el texto de la categoría y de la cuenta tal cual está en el Excel (por ejemplo «educación» y «efectivo»), en lugar del nombre con el que existen en Biyu («Educación» y «Efectivo»).

**Pasos para reproducir**

1. Abrir la app e iniciar sesión con un usuario de prueba (con la configuración inicial salteada) y tocar «Importar desde Excel».
2. Armar un .xlsx con los encabezados de la plantilla y una fila: fecha 01/09/2026, Tipo « gasto » (con espacios), Monto 10, Moneda «usd», Tipo de cambio 1450, Categoría «  educación  », Cuenta «  efectivo  », Cuotas 1, Nota «Coincidencia».
3. Tocar «Elegir archivo .xlsx» y elegir el archivo.
4. Mirar la tarjeta «Fila 2» de la Revisión.

**Resultado esperado.** CP-IMP-052 (paso 10): «Fila 2» está «Lista» y muestra «Gasto», «US$10,00», «Educación», «Efectivo» y «TC 1.450,00».

**Resultado obtenido.** La fila está «Lista» (la coincidencia sin distinguir mayúsculas ni espacios funciona) pero la tarjeta dice «01/09/2026 · Gasto · educación · efectivo · TC 1.450,00 US$10,00»: muestra el texto del archivo, no los nombres de Biyu.

**Evidencia.** Texto de la tarjeta import-row-2 en la corrida de CP-IMP-052

**Notas.** Causa probable: la tarjeta arma el detalle con el texto leído del archivo y no con el nombre del catálogo que resolvió la fila. No se investigó a fondo ni se corrigió nada.
