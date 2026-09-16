# Plan de Testing y organización del equipo

_Cómo se organiza el equipo, cómo se diseñan los casos, cómo se reportan los defectos y qué
se automatiza. Es el documento que sostiene lo que la materia evalúa._

---

## 1. Equipo

Cinco integrantes. Los roles ordenan la coordinación; **no concentran el trabajo de
testing**.

| Rol | Responsabilidad principal |
|---|---|
| Product Owner | Mantiene requerimientos e historias de usuario con criterios de aceptación. Prioriza el backlog. Es quien decide si un defecto es defecto o es comportamiento esperado mal especificado |
| Test Lead | Plan de pruebas, catálogo consolidado, reportes de ejecución, criterio de salida de cada versión |
| Dev Backend | Conduce los agentes de IA sobre `api/`. Responsable de que el dominio quede puro y testeable |
| Dev Frontend | Conduce los agentes de IA sobre `web/`. Responsable de que la UI exponga los estados que hay que probar |
| QA / Automatización | Alta y seguimiento de defectos hasta el cierre. Lidera la automatización de V3 |

### Regla de propiedad cruzada

Cada integrante es **dueño del diseño** de los casos de un módulo y **ejecutor** de los de
otro:

| Integrante | Diseña los casos de | Ejecuta los casos de |
|---|---|---|
| 1 | Cuotas y prorrateo | Dashboard |
| 2 | Monedas y tipo de cambio | Cuotas y prorrateo |
| 3 | Dashboard y KPIs | Suscripciones |
| 4 | Suscripciones | Deudas |
| 5 | Deudas, acceso y autorización | Monedas y tipo de cambio |

**Por qué.** Nadie prueba lo que diseñó ni lo que implementó. Es la contramedida más barata
contra el sesgo de confirmación, y hace que cada caso tenga que estar escrito lo bastante
claro como para que otro lo ejecute sin preguntar. Un caso que solo entiende quien lo
escribió es un caso mal escrito.

### Ceremonias

Un sprint por versión. Planificación al abrir (se estima y se reparte), revisión al cerrar
(demo + reporte de ejecución + estado de defectos), retrospectiva breve. Seguimiento en un
tablero con las columnas: `Backlog · En desarrollo · Listo para probar · En prueba ·
Defecto abierto · Hecho`.

**"Hecho" incluye los casos ejecutados.** Una historia sin sus casos ejecutados no sale de
`En prueba`, aunque la funcionalidad ande.

---

## 2. Alcance y niveles de prueba

| Nivel | Qué prueba | Quién | Cuándo |
|---|---|---|---|
| Unitario / dominio | Cálculos puros: prorrateo, conversión, resúmenes, ocurrencias | Devs, con agentes | Continuo desde V1 |
| Integración / API | Atomicidad, validación de servidor, autorización, efectos en base | Devs + QA | Continuo desde V1 |
| Sistema / funcional | Casos de usuario de punta a punta, manuales | Todo el equipo | Cierre de cada versión |
| Regresión | Reejecución del catálogo de la versión anterior | Test Lead reparte | V2 y V3 |
| Confirmación | Re-test de cada defecto corregido | Quien lo reportó | Continuo |
| No funcional | Rendimiento del dashboard, accesibilidad, usabilidad | Test Lead + QA | V2 |
| Automatizado | Subconjunto de V1 y V2 | QA lidera | V3 |

### Fuera de alcance del plan

Pruebas de seguridad más allá de la autorización entre usuarios, pruebas de carga real,
pruebas de compatibilidad exhaustiva de navegadores (se prueba en Chrome y Safari móvil), y
pruebas de instalación. Se declara para que la ausencia sea una decisión y no un olvido.

---

## 3. Técnicas de diseño de casos

Cada caso del catálogo declara con qué técnica se derivó. No es burocracia: es lo que
permite argumentar cobertura sin contar líneas de código.

| Técnica | Dónde se aplica en Biyu | Ejemplo |
|---|---|---|
| **Particiones de equivalencia** | Monto, cantidad de cuotas, día de cobro | Monto: negativo · cero · positivo válido · mayor al máximo |
| **Valores límite** | Todo campo numérico o de fecha con rango | Cuotas: 0, 1, 2, 12, 13 · Día de cobro: 0, 1, 31, 32 · Deuda: monto del gasto − 0,01, igual, + 0,01 |
| **Tabla de decisión** | Combinaciones de moneda × tipo de cambio × tipo de cuenta | USD sin TC, USD con TC, ARS con TC (inválido), ARS sin TC |
| **Transición de estados** | Suscripciones y deudas | activa → pausada → activa → cancelada, y las transiciones que **no** existen (cancelada → activa) |
| **Adivinación de errores** | Concurrencia, fechas raras, datos archivados | Dos pedidos simultáneos de puesta al día · 29 de febrero · suscripción sobre categoría archivada |
| **Casos de uso** | Flujos completos de las historias de usuario | Registrar gasto compartido en cuotas y verlo en dos meses distintos |

### La tabla de decisión de moneda, escrita

| Moneda | TC de referencia del período | TC ingresado a mano | Resultado esperado |
|---|---|---|---|
| ARS | — | ausente | Se guarda, `fx_rate` null |
| ARS | — | presente | **Rechazado** (I5) |
| USD | existe | ausente | Se guarda con el TC de referencia |
| USD | existe | presente | Se guarda con el TC ingresado, que pisa al de referencia |
| USD | no existe | ausente | **Rechazado**, con mensaje que pide el TC |
| USD | no existe | presente | Se guarda con el TC ingresado |

Seis filas, seis casos. Es el ejemplo de por qué la técnica vale: la fila "ARS con TC
presente" es la que nadie escribe si va improvisando, y es un caso negativo real.

---

## 4. Formato del caso de prueba

Un caso vive en la planilla del catálogo con estas columnas:

| Campo | Contenido |
|---|---|
| ID | `CP-<módulo>-<nnn>` — ej. `CP-CUO-007` |
| Historia de usuario | Referencia a `02-behavior-spec.md` o `06-suscripciones.md` |
| Invariante cubierta | I1 … I17, si aplica |
| Técnica | Cuál de las de arriba |
| Tipo | Positivo · Negativo · Límite |
| Precondiciones | Estado del sistema y datos necesarios |
| Pasos | Numerados, ejecutables por alguien que no diseñó el caso |
| Resultado esperado | Concreto y verificable. "$33.333,34", no "el monto correcto" |
| Prioridad | Alta · Media · Baja |
| Automatizable | Sí · No · V3 |

**La columna de invariante es la que hace fuerte al catálogo.** Un caso que se puede anclar a
"I1: la suma de las imputaciones es exactamente el monto" tiene un oráculo objetivo. Un caso
cuyo resultado esperado es "debería funcionar bien" no es un caso.

---

## 5. Reporte de defectos

### Formato

| Campo | Contenido |
|---|---|
| ID | `DEF-nnn` |
| Título | Qué falla, en una línea, sin la causa supuesta |
| Caso de prueba | El `CP-` que lo detectó, si vino de uno |
| Entorno | Versión desplegada, navegador, dispositivo |
| Pasos para reproducir | Numerados, desde un estado conocido |
| Resultado obtenido | Qué pasó, con datos concretos |
| Resultado esperado | Qué debía pasar, con la referencia al spec |
| Evidencia | Captura, respuesta de la API, log |
| Severidad | Ver escala |
| Prioridad | Ver escala |
| Estado | Abierto · En análisis · Corregido · **En confirmación** · Cerrado · Rechazado · Diferido |

### Escala de severidad

| Nivel | Criterio, con ejemplo de este sistema |
|---|---|
| **Crítica** | Los números están mal y el usuario no puede notarlo. Ej.: la suma de las cuotas no da el total; un usuario ve datos de otro |
| **Alta** | Una funcionalidad principal no se puede completar. Ej.: no se puede guardar un gasto en USD; la puesta al día duplica ocurrencias |
| **Media** | Funciona con un rodeo, o falla un caso no principal. Ej.: el estado vacío muestra una tabla de ceros |
| **Baja** | Cosmético o de redacción. Ej.: un mensaje de error dice "amount" en vez de "monto" |

Severidad la fija quien reporta (es un hecho técnico). **Prioridad la fija el Product Owner**
(es una decisión de negocio). Un defecto cosmético en la pantalla principal puede ser
severidad baja y prioridad alta; el catálogo tiene que poder expresar eso.

### Flujo

`Abierto` → el PO decide si es defecto o especificación mal escrita. Si es lo segundo, se
corrige el spec y se cierra como `Rechazado` con la justificación escrita. Si es defecto, va
a desarrollo → `Corregido` → **quien lo reportó** lo re-testea (`En confirmación`) → `Cerrado`
o vuelve a `Abierto`.

**Nadie cierra su propio defecto.** Igual que con los casos: quien reporta confirma.

---

## 6. Reporte de ejecución

Al cierre de cada versión, un reporte con:

- Casos planificados, ejecutados, pasados, fallados y bloqueados, con el porcentaje de avance.
- Cobertura por módulo y por técnica: cuántos casos de límite, cuántos negativos.
- Trazabilidad: qué historias de usuario quedaron sin ningún caso ejecutado. **Una historia sin caso es un hueco, y va reportado como tal.**
- Defectos abiertos por severidad al momento del cierre.
- Defectos de la versión anterior confirmados (V2 y V3).
- Desvíos respecto de lo planificado y por qué.

### Criterios de salida de una versión

Se cierra una versión cuando, todo junto:

1. Cero defectos de severidad crítica abiertos.
2. Cero defectos de severidad alta abiertos, o cada uno con una justificación aceptada por el PO y registrada.
3. Todos los casos de prioridad alta ejecutados.
4. Toda invariante de `04-data-model.md` tiene al menos un caso ejecutado que la verifica.
5. En V2 y V3: la suite de regresión de la versión anterior ejecutada, y todos los defectos corregidos confirmados.

El punto 4 es el que conecta el plan de pruebas con el modelo de dominio, y es la métrica M1
del brief.

---

## 7. Herramientas

| Actividad | Herramienta |
|---|---|
| Gestión de casos y defectos | Planilla colaborativa compartida, o el tablero de issues del repositorio |
| Pruebas de dominio (TypeScript) | Vitest |
| Pruebas de base de datos (invariantes, RLS, atomicidad) | pgTAP contra Supabase local |
| Pruebas de Edge Functions | Deno Test / Vitest |
| Pruebas de componentes | Vitest + Testing Library |
| Pruebas end-to-end | Playwright (Chromium, WebKit, Firefox) |
| Rendimiento, accesibilidad y PWA | Lighthouse CI |
| Exploración manual de la base | Panel de Supabase (Table Editor, SQL Editor) del proyecto local |
| Integración continua | GitHub Actions, con Supabase CLI levantando el stack local |
| Datos de prueba | Semillas sintéticas versionadas en el repo. **Nunca datos financieros reales** (C14) |

---

## 8. Riesgos del plan

| Riesgo | Mitigación |
|---|---|
| El desarrollo se come el tiempo del testing | La regla de corte del roadmap: no se amplía una versión sin los casos de la anterior ejecutados |
| Se prueba solo lo que se implementó, no lo que se especificó | Los casos se derivan de las historias de usuario y las invariantes, **antes** de que exista la funcionalidad |
| El agente de IA genera código que "pasa los tests" porque los escribió el mismo agente | Los casos de prueba de sistema los diseña una persona a partir del spec, no el agente a partir del código |
| Nadie ejecuta los casos aburridos en la tercera pasada | Son los primeros candidatos a automatizar en V3 |
| Los defectos se corrigen y nadie confirma | El estado `En confirmación` es obligatorio en el flujo; no se puede saltar de `Corregido` a `Cerrado` |

El tercero es el riesgo específico de esta cursada y vale la pena tenerlo escrito: la
consigna obliga a implementar con agentes, y un agente que escribe el código y sus pruebas
converge a pruebas que confirman lo que hizo. La separación entre quién especifica, quién
implementa y quién diseña los casos es lo que lo evita.
