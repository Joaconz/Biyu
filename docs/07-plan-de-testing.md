# Plan de Testing y organización del equipo

_Cómo se organiza el equipo, cómo se diseñan los casos, cómo se reportan los defectos y qué
se automatiza. Es el documento que sostiene lo que la materia evalúa._

---

## 1. Equipo

Cinco integrantes. Los roles ordenan la coordinación; **no concentran el trabajo de testing**.
Desde V2 el equipo se divide por frente: dos desarrollan y tres prueban.

| Quién | Frente | Responsabilidad principal |
|---|---|---|
| Joaquín Nuñez | Features nuevas | Product Owner y desarrollo de las funcionalidades nuevas. Escribe las historias de V2 con criterios de aceptación, decide si un defecto es defecto o es comportamiento esperado mal especificado, y conduce a los agentes de IA que implementan las features |
| Santiago | Defectos y pendientes de código | Corrige con agentes de IA los defectos reportados y los pendientes técnicos (`data-testid` faltantes, datos sintéticos de rendimiento, accesibilidad, idempotencia). Cada fix lleva su test automático |
| Micaela | Testing | Diseña y ejecuta casos (ver tabla de propiedad cruzada). Alta y seguimiento de los defectos que encuentra |
| Valentina | Testing | Ídem |
| Mariana | Testing | Ídem. Cierra el reporte de ejecución de cada versión |

Los tres testers comparten el rol de Test Lead: el plan, el catálogo consolidado, los reportes y el
criterio de salida de una versión se reparten entre ellos. **Los devs no prueban su propio código.**

_V1 se hizo con la división original de cinco roles (PO, Test Lead, Dev Backend, Dev Frontend,
QA/Automatización). La división de arriba rige desde la Entrega 2._

### Regla de propiedad cruzada

Cada tester es **dueño del diseño** de los casos de ciertos módulos y **ejecutor** de los de otro tester:

| Tester | Diseña los casos de (V1 reescrita) | Y de (V2) | Ejecuta los casos de |
|---|---|---|---|
| Micaela | Acceso (`ACC`), Configuración (`CFG`) | Deudas (`DEU`) | Valentina |
| Valentina | Registro (`REG`), Cuotas (`CUO`) | Suscripciones (`SUS`) | Mariana |
| Mariana | Monedas (`MON`), Dashboard (`DAS`) | Export CSV, Importación, Navegación y no funcionales | Micaela |

**Por qué.** Nadie prueba lo que diseñó ni lo que implementó. Es la contramedida más barata
contra el sesgo de confirmación, y hace que cada caso tenga que estar escrito lo bastante
claro como para que otro lo ejecute sin preguntar. Un caso que solo entiende quien lo
escribió es un caso mal escrito.

**Flujo de un defecto.** El tester lo reporta (`DEF-nnn`) → Santiago lo corrige con IA y lo mergea
→ el mismo tester que lo reportó lo confirma. Si el defecto está en una feature nueva que todavía no
se mergeó, lo corrige Joaquín.

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
| Unitario / dominio | Cálculos puros: prorrateo, conversión, resúmenes, ocurrencias | Joaquín y Santiago, con agentes | Continuo desde V1 |
| Integración / API | Atomicidad, validación de servidor, autorización, efectos en base | Joaquín y Santiago + testers | Continuo desde V1 |
| Sistema / funcional | Casos de usuario de punta a punta, **manuales** | Testers | Cierre de cada versión |
| Regresión | Reejecución de los casos de la versión anterior **seleccionados por riesgo** (ADR-027) | Testers, por propiedad cruzada | V2 y V3 |
| Confirmación | Re-test de cada defecto corregido, con su test de regresión del defecto en verde (§5) | Quien lo reportó | Continuo |
| No funcional | Rendimiento del dashboard, accesibilidad, usabilidad | Testers (Santiago prepara los datos) | V2 |
| Automatizado | Subconjunto del catálogo de V1 y V2 | Todo el equipo | V3 |

La automatización de V3 es la del **catálogo de casos**. Los tests de regresión de cada defecto
(§5) no esperan a V3: se escriben con la corrección, desde V1. No hay que confundirlos con la
**regresión** de la fila de arriba, que es la reejecución manual de los casos seleccionados.

**Selectores estables desde V1.** Todo elemento interactivo de la UI (botones, inputs, selects,
links de navegación, filas clickeables) lleva un atributo `data-testid` en kebab-case con el
formato `<pantalla>-<elemento>` (por ejemplo, `transaction-form-amount`, `dashboard-period-next`).
La automatización de V3 se apoya en esos atributos y no en textos ni clases de CSS, que cambian con
el diseño. Un elemento interactivo sin `data-testid` es un defecto de testeabilidad.

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

Un caso vive en la planilla del catálogo (plantilla de la cátedra, una hoja por caso) con estos campos:

| Campo | Contenido |
|---|---|
| ID | `CP-<módulo>-<nnn>` — ej. `CP-CUO-007` |
| Título | Una frase que dice qué se verifica y con qué dato: "12 cuotas de $100,00 dan 12 imputaciones" |
| Historia de usuario y criterio | `US-nn · CA-k`: la historia **y el criterio de aceptación** que el caso verifica (`02-behavior-spec.md` o `06-suscripciones.md`). Más FR / R* |
| Invariante cubierta | I1 … I17, si aplica |
| Técnica | Cuál de las de §3 |
| Tipo | Positivo · Negativo · Límite |
| Canal | `UI` o `API`. Un caso es de un solo canal; el par del otro canal se enlaza en "Caso par" |
| Caso par | ID del caso hermano (UI ↔ API) cuando es un negativo, o "—" |
| Pre-requisitos | Numerados (`S 1`, `S 2`…). Procedimientos comunes por ID (`PR-01`), no copiados |
| Datos de prueba | Numerados, con **valores exactos**: email, montos, cantidad de cuotas, TC, fecha de hoy fijada |
| Pasos | Numerados. **Un paso, una acción**. Ejecutables por alguien que no diseñó el caso |
| Resultado esperado | Uno **por paso**, observable y exacto: texto del mensaje, URL, monto formateado ("$33.333,34"), orden, estado del botón; en API, status HTTP y `code` |
| Post-condición | Estado en que queda el sistema, y la limpieza si hace falta |
| Prioridad | Alta · Media · Baja |
| Automatizable | Sí · No · V3 |

### Estándar de redacción (lo que revisa `spec-critic` antes de aprobar un caso)

1. **Atómico.** Una condición o partición y un juego de datos por caso, con un único veredicto. Si el
   caso falla, se sabe cuál fue la causa. Un caso que prueba 0, 1, 2, 12 y 13 cuotas son cinco casos.
   Cuando un caso viejo se parte, el primero conserva el ID y los otros toman los siguientes del módulo;
   la tabla de mapeo `ID anterior → IDs nuevos` mantiene la trazabilidad.
2. **UI y API van en casos separados.** El negativo por UI y el negativo directo contra la RPC (C6) son
   dos casos enlazados por "Caso par". Así un fallo del servidor no tapa que la UI se comporta bien, ni
   al revés.
3. **Independiente.** Cada caso arranca con su propio usuario (`PR-01`). Ningún caso necesita que otro
   se haya ejecutado antes ni usa datos que dejó otro.
4. **Datos concretos, no "el usuario de prueba".** Ni "un monto válido": el monto exacto. Los datos van en
   "Datos de prueba", no mezclados con los pre-requisitos. Todo ficticio (C14).
5. **Un paso, una acción, un resultado observable, escrito para alguien que nunca vio la app.** Cada
   click y cada texto que se escribe es un paso propio, con el nombre que se ve en pantalla: "Hacer click en
   el campo \"Email\"", "Escribir `qa+cp-cuo-001-001@example.com`", "Hacer click en el botón \"Entrar\"". El caso
   arranca desde el navegador: el inicio de sesión y la navegación hasta la pantalla que se prueba son pasos
   del caso, no un pre-requisito. Los procedimientos `PR-nn` quedan para preparar datos **antes** del caso
   (crear el usuario, la cuenta, una compra previa). "Observar la pantalla" no es un paso. "Guardar" sin
   decir qué se ve después, tampoco.
6. **Variante API ejecutable a mano.** Método, endpoint, headers (por `PR-04`), body JSON y respuesta
   esperada: status HTTP más `code` y mensaje.
7. **Oráculo anclado al spec.** Cada resultado sale del criterio de aceptación, de una I* o de una R*, no
   de lo que la app hace hoy. Un caso sin oráculo es un hueco del spec: se reporta, no se inventa.
8. **Post-condición y limpieza** declaradas, y trazabilidad al criterio (`US-nn · CA-k`).

Los procedimientos comunes (`PR-nn`) están en `docs/12-procedimientos-de-prueba.md`. La decisión de fondo está en ADR-028.

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
| Evidencia | Captura, respuesta de PostgREST o de la RPC, log |
| Severidad | Ver escala |
| Prioridad | Ver escala |
| Test de regresión | Ruta del test que reproduce el defecto (ver Flujo), o el `CP-` manual con la justificación |
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

**Cada corrección trae su test de regresión del defecto.** Antes de tocar el código, se escribe
un test que reproduce el defecto y **falla**; el fix es lo que lo hace pasar. Va en el nivel más
bajo que alcance para reproducirlo: Vitest en `tests/domain/` o `tests/lib/` si es lógica de
cliente, pgTAP en `supabase/tests/database/` si es schema, RPC o RLS, Playwright en `e2e/` solo
si no se puede más abajo. Vitest y pgTAP corren en la CI; Playwright no: el test e2e se corre en
rojo contra producción y en verde contra el Preview del PR, y las dos corridas van como
evidencia. El test nombra el `DEF-nnn` y su ruta se anota en el campo *Test de regresión*. Sin
ese test el defecto no pasa a `Corregido`. Si no es automatizable (un defecto cosmético, por
ejemplo), se agrega un `CP-` manual al catálogo y la justificación queda en el reporte. La regla
rige para las correcciones posteriores a esta versión del plan; los defectos ya corregidos no se
completan retroactivamente.

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
5. En V2 y V3: los casos de regresión seleccionados de la versión anterior (ADR-027) ejecutados, y todos los defectos corregidos confirmados.

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
