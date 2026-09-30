# Entrega 1 · Biyu

Entregables de la Entrega 01 del Proyecto Integrador (Testing de Aplicaciones). IDs consistentes en
todos los archivos: **historia `US-nn` → caso `CP-<módulo>-<nnn>` → resultado → defecto `DEF-nnn`**.

| Parte | Archivo | Qué es |
|---|---|---|
| A | `01-historias-de-usuario.md` | 46 historias de V1 con objetivo, pantallas y campos, y criterios de aceptación (formato del ejemplo TaskMaster) |
| B | `02-especificacion-casos-de-prueba.md` / `.xlsx` | 74 casos (68 del catálogo + 6 nuevos), una hoja por caso con la plantilla de la cátedra |
| B | `03-ejecucion-casos-de-prueba.md` / `.xlsx` | Resultado obtenido, evidencia y defecto de cada caso |
| B | `04-reportes-de-defectos.md` / `.xlsx` | 22 defectos (16 de #75 re-testeados + 6 nuevos), un índice y una hoja por defecto con el template "Defect Report" de la cátedra |
| B | `05-reporte-de-ejecucion.md` / `.xlsx` | Métricas, cobertura, criterios de salida y desvíos |
| Presentación | `06-presentacion.html` | Slides para la clase, con las capturas de la app en un marco de celular |
| Estudio | `07-resumen-de-estudio.md` | Para explicar todo oralmente, con preguntas probables |

Resultado vigente: **74 planificados · 74 ejecutados · 72 PASSED · 2 FAILED · 0 BLOCKED**, V1 cerrada. Ejecución 1
sobre `main` 44f1519 (2026-09-28), con Vitest 239/239 y pgTAP 158/158. Ejecución 2 (2026-09-29, `de26493`):
re-test de CP-CFG-011 a 015 después de implementar US-68.

## Cómo se reproduce

```bash
supabase start && supabase migration up
npm run dev -- --port 5180
node entrega-1/ejecucion/run.mjs
node -e "import('./entrega-1/fuentes/casos.mjs').then(m=>process.stdout.write(JSON.stringify(m.CASOS)))" > entrega-1/fuentes/casos.json
python3 entrega-1/fuentes/armar_defectos.py <issues-DEF.json>
python3 entrega-1/fuentes/generar.py
```

- `node entrega-1/ejecucion/run.mjs CP-MON-003 DEF-016` corre solo esos IDs.
- `run.mjs` escribe `ejecucion/resultados.json` y las capturas de `evidencia/`. Solo apunta al stack
  local: nunca a producción.
- `generar.py` necesita `openpyxl` y arma los `.md` 02–04 y las cuatro planillas. `generar.py defectos`
  regenera solo el 04. En Windows, correrlo con `PYTHONUTF8=1`.
- `05-reporte-de-ejecucion.md` se escribe a mano a partir de las métricas que imprime el generador.

| Fuente | Contenido |
|---|---|
| `fuentes/casos.mjs` | Fuente única de los casos (IDs y oráculos de `docs/10-catalogo-casos-v1.md`) |
| `fuentes/defectos-nuevos.json` | DEF-017 a DEF-022 |
| `fuentes/defectos-detalle.json` | Campos del template de defectos que no están en `defectos.json`: impacto, reproducibilidad, criterio de aceptación afectado, navegadores y corrección |
| `fuentes/defectos.json` | Defectos armados desde los issues de GitHub y el re-test de esta corrida |
