# Entrega 3 · Guion de la defensa (una sola persona)

Guion para presentar y defender la Entrega 3 en unos **18 minutos**, con margen hasta 20. Usa la presentación
[`10-presentacion-keynote.html`](10-presentacion-keynote.html), la app en el deploy y la
[`Biyu-Planilla-Unica.xlsx`](Biyu-Planilla-Unica.xlsx). Lo que está en cita es lo que se dice; el resto son
indicaciones. No hace falta decirlo palabra por palabra: los números y los IDs, sí.

| Bloque | Qué | Tiempo | Acumulado |
|---|---|---|---|
| 1 | Diapositivas 1 a 11: requerimientos, casos, regresión, automatización, resultados y defectos | 9:00 | 9:00 |
| 2 | Demo de lo nuevo de V3, con el caso de prueba que cubre cada cosa | 5:00 | 14:00 |
| 3 | La planilla única y un caso en profundidad | 3:30 | 17:30 |
| 4 | Cierre | 0:30 | 18:00 |

Lo hablado de las diapositivas son unos 6 minutos: el resto es margen para pausas y para señalar los gráficos. Si se va de tiempo: en el bloque 1, las diapositivas 8 y 9 (evolución y cambios de estado) se cuentan en una sola
pasada (ahorra 1 minuto); en el bloque 3, se salta el segundo caso (DEF-037) y se lo deja para las preguntas.

---

## 0. Antes de empezar (10 minutos antes)

**Tres ventanas abiertas, en este orden de pestañas:**

1. La presentación, en pantalla completa (`F`). Las notas (`N`) muestran el tiempo sugerido de cada diapositiva y un
   reloj de la charla; `R` lo reinicia. Apretá `R` justo al empezar.
2. La app en https://biyu-rust.vercel.app, con la sesión iniciada en un usuario de prueba preparado (abajo).
3. `Biyu-Planilla-Unica.xlsx` abierta en la hoja **Inicio**, con el zoom en 120 % para que se lea en el proyector.

**Datos del usuario de la demo** (montos ficticios, nada real; cargalos el mismo día para que todo caiga en el mes
en curso y no salte el aviso de meses cerrados):

| Para | Cargar antes |
|---|---|
| Demo 1 · editar en cuotas | Un gasto de **$120.000,00 en 6 cuotas** con «Tarjeta de crédito», con fecha de hoy |
| Demo 2 · sugerencias de personas | Una deuda suelta «Me deben» con **Sofía** y otra con **Juan** (para que el campo las sugiera) |
| Demo 3 · borrado definitivo | Un gasto de **$30.000,00 en 3 cuotas** con «Tarjeta de crédito» |
| Demo 4 · un solo número | Algún ingreso del mes, para que el número cambie al prender «Ingresos» |

**Plan B:** si el deploy no carga o falla algo en vivo, no improvises: decí qué caso lo cubre (está en cada paso de
la demo) y mostralo en la planilla. La suite automatizada corre ese mismo caso en cada PR.

---

## 1. Diapositivas (9:00)

### Diapositiva 1 · Portada (0:20)

> «Somos Biyu, una app de control de gastos para Argentina: pesos y dólares, compras en cuotas y gastos compartidos.
> En esta entrega les vamos a mostrar V3: qué se pidió, cómo lo probamos y qué no podemos afirmar todavía.»

### Diapositiva 2 · 361 / 361 (0:30)

> «Empiezo por el resultado: los 184 casos nuevos de V3 y los 177 de regresión de V1 y V2 pasaron dos veces, con la
> suite automatizada y a mano en el deploy de Vercel. Los 8 defectos de V2 quedaron confirmados como corregidos y V3
> no registró defectos nuevos. Ahora les cuento de dónde sale este número, y al final, qué no dice.»

Anticipar el «qué no dice» desarma la pregunta de si un 100 % es creíble.

### Diapositiva 3 · Requerimientos de V3 (1:30)

> «V3 tenía un objetivo: completar el CRUD y pulir lo que ya existía. Son 26 historias nuevas en cuatro frentes.
> Siete de CRUD completo: editar y borrar en todas las entidades, que hasta V2 casi no se podía. Seis de deudas y del
> Resumen: compartir un gasto con varias personas, ver las deudas por persona y un Resumen con un solo número. Dos de
> importar Excel, y once de UX: navegación, legibilidad, tema oscuro y controles de 44 píxeles.»
>
> «Tres decisiones cambiaron la forma de probar. Editar un movimiento regenera todas sus cuotas, y eso toca la regla
> central del sistema: la suma de las cuotas tiene que dar exactamente el monto. El borrado definitivo contradice
> nuestro borrado lógico, así que lleva su propio ADR y una confirmación que dice qué se borra. Y el Resumen pasó a
> mostrar un solo número, el gasto neto, configurable.»

No leas los chips: la demo los muestra.

### Diapositiva 4 · Casos de V3 (1:00)

> «De esas historias salieron 184 casos. Cada uno cita su historia y su criterio de aceptación, y todo lo que valida
> datos se prueba dos veces: por la pantalla y directo contra la API, porque la validación real está en Postgres.
> 105 son de prioridad Alta. Los módulos con más casos son Registro y Deudas, que son los que V3 más toca.»

### Diapositiva 5 · Regresión (1:30)

> «Para la regresión no repetimos todo: elegimos 177 de los 286 casos de V1 y V2 con dos reglas. Todos los de
> prioridad Alta, que cubren lo que no se puede romper; y los de V2 que fallaron por un defecto, que además sirven
> de testeo de confirmación: si el defecto se corrigió, el caso tiene que pasar.»
>
> «En el gráfico, la barra clara es el total del módulo y la oscura lo elegido. Deudas y Suscripciones pesan más
> porque V3 les agrega edición, borrado y varias personas. Los casos que quedaron afuera conservan su último
> resultado; si aparece un defecto en esa zona, se amplía la selección.»

### Diapositiva 6 · Automatización (1:00)

> «Decidimos automatizar todo lo que se ejecuta: los 184 de V3, porque son la regresión de lo que venga, y los 177 de
> regresión, porque tienen que pasar en cada cambio. Son tres herramientas: Playwright para la pantalla y la API,
> con 290 tests; Vitest para la lógica pura, con 1131; y pgTAP para la base, con 1354 aserciones de seguridad e
> invariantes. Corren en la CI en cada PR, y si un test falla, la CI marca el build en rojo.»

### Diapositiva 7 · Resultado de V3 (1:00)

> «Este es el resultado: 100 % PASSED en los cuatro conjuntos, cero FAILED y cero BLOCKED. La automatizada corrió el
> 14 de noviembre; la manual, del 14 al 16, en el deploy. Manual y automatizado coinciden caso por caso.»

### Diapositiva 8 · Evolución entre entregas (1:00)

> «Mirado en el tiempo: V1 arrancó en 90,5 %, con tres casos que fallaron y cuatro bloqueados porque faltaba la
> configuración inicial. En V2, 93,1 %, con nueve fallas y cuatro bloqueados. V3 llega al 100 % con muchos más casos.
> Ojo: no son porcentajes comparables directo, porque cada entrega probó un conjunto distinto y de otra forma.»

### Diapositiva 9 · Cambios de estado (1:00)

> «Veinte casos pasaron a PASSED de la Entrega 2 a la 3, y ninguno hizo el camino inverso. Nueve fallaban por un
> defecto que se corrigió. Cuatro estaban bloqueados porque faltaba compartir con varias personas, que se hizo en
> V3. Seis no tenían resultado registrado y uno estaba en duda. Cada fila tiene su motivo en la planilla, que les
> muestro al final.»

### Diapositiva 10 · Defectos (1:00)

> «En las tres versiones encontramos 36 defectos: 28 en V1 y 8 en V2. Están todos cerrados y cada uno tiene dónde
> se confirmó la corrección: 9 en V3, 21 en la Entrega 2 y 6 en el re-test de V1. V3 no registró defectos con
> número, pero la suite frenó al menos dos regresiones antes de llegar a main; eso lo contamos como una lección.»

### Diapositiva 11 · Límites y lecciones (1:30)

> «Y lo que este 100 % no dice. No medimos cobertura ni mutación, así que no sabemos cuánto detectaría la suite si se
> rompiera una regla. La ejecución manual es lo que informó el equipo, sin capturas por caso. Y tres defectos de V1
> se confirmaron en parte, porque la condición se simuló: un iPhone, el límite de altas y una siembra lenta.»
>
> «Lo que haríamos distinto: escribir casos por partición y no por valor, porque llegamos a 672 casos y quedaron
> 206; hacer una sesión de exploración por versión, porque en V1 la mayoría de los defectos salió de afuera del
> catálogo; y que quien implementa una historia no escriba su test.»

Pasá a la diapositiva 12 (Demo) y cambiá a la pestaña de la app.

---

## 2. Demo (5:00)

> «Ahora lo nuevo de V3 en la app. Para cada cosa les digo qué caso de prueba la cubre.»

### Demo 1 · Editar una compra en cuotas (1:20) · US-84

1. **Movimientos** → tocar el gasto de $120.000,00 en 6 cuotas. Se abre **Editar** con los campos cargados.
2. Tocar el chip de **3 cuotas** y **Guardar cambios**.
3. Abrir el **Resumen**: este mes muestra la cuota de $40.000,00 en lugar de $20.000,00.

> «Editar un movimiento regenera sus cuotas. Pasamos de 6 a 3: tienen que quedar exactamente tres, de 40.000, en
> este mes y los dos siguientes, y ninguna más. Es el caso **CP-REG-021**, que después les abro en la planilla.
> Al lado está **CP-REG-020**, que prueba el redondeo: si el monto no divide justo, la última cuota absorbe el resto
> y la suma da exacta al centavo. Y **CP-REG-037** prueba que otro usuario no puede editar este movimiento ni por la
> API.»

Si alguien pregunta por un mes anterior: al cambiar el monto de algo de un mes cerrado aparece un aviso con
«Guardar igual» (CP-REG-022 y 023).

### Demo 2 · Compartir un gasto con varias personas (1:20) · US-82, US-100, US-91

1. **Registrar** → monto `120000` → completar categoría y cuenta → prender **Gasto compartido**.
2. En la persona, escribir `so`: aparece **Sofía** sugerida. Elegirla. **Agregar persona** y escribir `ju`: **Juan**.
3. Montos de 40000 cada uno (o **Dividir en partes iguales**) → **Guardar gasto**. Aviso «Juan y Sofía te deben
   $80.000,00».
4. Abrir **Deudas**: las deudas aparecen agrupadas por persona.

> «Un gasto de 120.000 compartido con dos personas. El caso **CP-DEU-086** verifica que todo se guarda en una sola
> llamada a la base, una transacción y dos deudas, sin inserts sueltos: si algo falla, no queda nada a medias.
> **CP-DEU-088** prueba el límite: las deudas no pueden sumar más que el gasto, ni por un centavo. Las sugerencias
> son **CP-DEU-096**, que no distingue mayúsculas ni tildes, y la vista por persona es **CP-DEU-073**.»

### Demo 3 · Borrar definitivamente (1:10) · US-85, US-94

1. **Movimientos** → tocar el gasto de $30.000,00 en 3 cuotas → **Eliminar movimiento** al pie de Editar →
   confirmar. Pasa a **Eliminados**, desde donde se puede restaurar.
2. En **Eliminados**, **Eliminar definitivamente**. Mostrar el diálogo: dice el monto, la cuenta, «3 cuotas», «Se
   borra para siempre. No se puede restaurar.» y «Se borran también sus 3 cuotas.»
3. Tocar **Cancelar** (no borra nada) y después confirmar.

> «Borrar es en dos pasos a propósito: primero va a Eliminados, que se puede deshacer, y recién ahí se borra para
> siempre. El caso **CP-REG-042** recorre esto entero y termina en la API: no quedan filas y restaurar ya no es
> posible. **CP-REG-046** prueba que Cancelar no borra, y **CP-REG-048** que el diálogo diga qué se borra, con sus
> cuotas y su deuda si la tiene.»

### Demo 4 · Un solo número en el Resumen (1:10) · US-101, US-103, US-102

1. **Resumen**: la tarjeta principal muestra lo gastado del mes («Solo gastos»).
2. Tocar el ícono de la esquina de la tarjeta → prender **Ingresos**: el número cambia al instante y el rótulo pasa a
   «Gastado neto».
3. Bajar a la **dona** por categoría.
4. **Ajustes** → **Apariencia** → **Oscuro**.

> «El Resumen tiene un solo número protagonista y cada uno elige qué entra: ingresos, deudas, suscripciones. El caso
> **CP-DAS-028** verifica que cada opción mueve el número con su signo y que la elección queda guardada;
> **CP-CFG-041** que es de cada usuario y otro no la ve. La dona es **CP-DAS-022**, y el tema oscuro, **CP-CFG-031**,
> que además se queda al recargar.»

---

## 3. La planilla única (3:30)

Cambiar a la pestaña del Excel, en la hoja **Inicio**.

> «Todo el trabajo de testing de las tres entregas está en un solo Excel, que fue el pedido de la devolución de la
> Entrega 2. Los IDs de casos, historias y defectos son links: se toca uno y te lleva a donde está especificado.»

### Recorrido por las hojas (0:50)

| Hoja | Qué decir |
|---|---|
| **Inicio** | «El índice: qué tiene cada hoja y el resumen de la entrega. La fila 2 de todas las hojas es la navegación.» |
| **Casos** | «Los 470 casos de las tres versiones, uno por fila: prioridad, técnica, si entra en la regresión de V3 y su resultado en cada entrega, con colores. La columna P marca los que cambiaron de estado.» |
| **Pasos** | «Pre-requisitos, pasos y resultado esperado de cada caso.» |
| **Historias** | «Cada historia con su issue de GitHub, cuántos casos tiene y su especificación, más los ADR.» |
| **Defectos** | «Los 36 defectos con pasos para reproducir, esperado, obtenido y en qué entrega se confirmó la corrección.» |
| **Resultados** y **Cambios de estado** | «Los porcentajes de cada ejecución, con el gráfico, y los 16 casos que cambiaron de estado con su motivo.» |

### Un caso en profundidad: CP-REG-021 (1:50)

1. Hoja **Casos** → `Cmd+F` / `Ctrl+F` → `CP-REG-021` (fila 343).

> «Este es el caso de la demo 1. Versión V3, módulo Registro, historia US-84. Prioridad Alta, camino feliz, y la
> técnica es valores límite: bajar la cantidad de cuotas es un borde, porque sobran imputaciones que hay que borrar.
> Es un caso nuevo de V3 y pasó en la ejecución manual y en la automatizada.»

2. Tocar el ID **CP-REG-021** (columna A): lleva a la hoja **Pasos**.

> «El pre-requisito: un usuario nuevo, que se crea con el procedimiento PR-01, y una compra de 120.000 en 6 cuotas
> con tarjeta, con fecha de este mes. El paso es uno solo: elegir 3 cuotas y guardar. Y el resultado esperado es
> preciso: exactamente tres imputaciones de 40.000 en este mes y los dos siguientes, numeradas de 1 a 3, y ninguna en
> los meses 4, 5 y 6. Al final cita I2 e I3: las invariantes del modelo de datos que dicen que una compra tiene
> tantas imputaciones como cuotas, sin huecos, y en meses consecutivos.»
>
> «¿Por qué es importante? Porque si al editar quedaran las cuotas viejas, el Resumen de los meses que vienen
> mostraría plata que ya no se debe, y no se vería a simple vista. Por eso el caso no mira solo la pantalla: cuenta
> las imputaciones. Está automatizado en Playwright, en `e2e/transactions-edit.spec.ts`, con el test
> "CA-5 · de 6 cuotas a 3".»

3. Volver con el link de la fila 2 (**Casos**) y tocar **US-84** (columna E): lleva a la hoja **Historias**.

> «Y desde el caso llego a su historia: US-84, issue 284, con sus 24 casos y la especificación completa con los 30
> criterios de aceptación. El caso cubre el criterio CA-5.»

### Segundo caso, si hay tiempo: CP-DEU-024 y DEF-037 (0:40)

1. Hoja **Casos** → buscar `CP-DEU-024` (fila 102).

> «Este caso de V2 muestra la cadena completa con un defecto. Falló en la Entrega 2 y pasó en la 3: la columna P dice
> "E2: FAILED → E3: PASSED".»

2. Tocar **DEF-037** (columna O): lleva a la hoja **Defectos**.

> «DEF-037: en "Nueva deuda", el primer clic en "US$" se perdía, porque aparecía un error arriba y corría los
> botones. Acá están los pasos para reproducirlo, lo esperado y lo obtenido, con la medida de cuánto se movía el
> botón. Severidad media, issue 351, cerrado el 31 de octubre y confirmado en V3: el mismo caso que lo detectó
> ahora pasa. Eso es el testeo de confirmación.»

---

## 4. Cierre (0:30)

Volver a la presentación, diapositiva 13.

> «Resumiendo: V3 completa el CRUD y suma UX; escribimos 184 casos nuevos, elegimos 177 de regresión por riesgo,
> automatizamos todo y pasaron los 361, a mano y automatizados, con los defectos de V2 confirmados. Y les dijimos qué
> no podemos afirmar. Todo está trazado en la planilla. ¿Preguntas?»

---

## 5. Preguntas probables

| Pregunta | Respuesta corta | Dónde mostrarlo |
|---|---|---|
| ¿Un 100 % no es sospechoso? | «Sí, por eso lo acotamos. Es cobertura de comportamiento: un test puede cubrir varios casos por criterio. No medimos cobertura de código ni mutación, que es la lección 9 del post-mortem. Lo que sí podemos decir es que cada caso tiene una prueba que lo cubre y que corre en cada PR.» | `07-reporte-final.md` §2 · `06-analisis-y-post-mortem.md` §3 |
| ¿Cómo sé que la ejecución manual se hizo? | «No hay capturas por caso; es lo que informó el equipo, y lo decimos así en el reporte. La automatizada sí tiene el resultado crudo de cada test.» | `08-ejecucion-manual.md` · `ejecucion/` |
| ¿Por qué no automatizaron los Media y Baja de V1 y V2? | «Porque no están en la regresión: conservan su último resultado. Si aparece un defecto en su zona, se suman, a la regresión y a la automatización.» | `02-seleccion-automatizacion.md` |
| ¿Por qué esas dos reglas para la regresión? | «La Alta cubre lo que no puede romperse, y los que fallaron por un defecto confirman la corrección. Las otras reglas de la Entrega 2 ya no aplicaban: los defectos de V1 estaban confirmados y la regresión de V1 dio 60 de 60.» | `03-seleccion-regresion.md` · ADR-027 |
| ¿Hubo fallas en la CI? | «Una: CP-CFG-028 falló en main porque la URL llegaba con `?period=` y el test esperaba `/settings` pelado. Era una aserción demasiado estricta, se corrigió en el PR 428 y la CI quedó en verde.» | `07-reporte-final.md` §5 |
| ¿La IA implementa y prueba lo mismo? | «Sí, y es un riesgo que reconocemos: los tests de V3 nacieron con la historia. La lección 8 es que los escriba una sesión distinta, a partir de los criterios y no del código.» | `06-analisis-y-post-mortem.md` §2.3 |
| ¿Qué pasó con DEF-021, 027 y 028? | «Se confirmaron en parte en la Entrega 2 porque la condición se simuló: un iPhone, el límite de altas y una siembra lenta. No se repitieron en V3. Lo dice la columna Confirmación de la planilla.» | Planilla · hoja Defectos |
| ¿Por qué 6 casos no tenían resultado en la Entrega 2? | «El equipo los informó como "OK" sin registrar el resultado. Entraron a la regresión de V3 por ser Alta y ahí sí pasaron con resultado.» | `entrega-2/04-ejecucion.md` · `07-reporte-final.md` §4 |
| ¿Por qué hay tantos casos de Deudas? | «Porque V3 le suma varias personas, edición, borrado y vista por persona, y cada criterio se prueba por pantalla y por API.» | `casos/us-82-…`, `us-86`, `us-87`, `us-91` |
| ¿Los datos de la demo son reales? | «No. El repo es público: semillas y casos usan montos ficticios, y la demo es un usuario de prueba.» | `docs/05-repo-publico.md` |

## 6. Números para tener a mano

| Dato | Valor |
|---|---|
| Historias nuevas de V3 | 26 (US-80 a US-105), más US-53 CA-4, US-68 y ADR-045 |
| Casos nuevos de V3 | 184 (105 Alta, 77 Media, 2 Baja) |
| Regresión | 177 de 286 (39 de V1, 138 de V2) |
| Tests | Playwright 290 · Vitest 1131 · pgTAP 1354 |
| Resultado | 361 de 361 PASSED, manual y automatizado |
| Evolución | E1 90,5 % → 97,3 % · E2 93,1 % · E3 100 % |
| Cambios de estado E2 → E3 | 20 a PASSED (9 FAILED, 6 sin resultado, 4 BLOCKED, 1 DUDA) |
| Defectos | 36 (28 de V1, 8 de V2): 2 críticos, 2 altos, 16 medios, 16 bajos; 0 abiertos |
| Confirmación | 9 en V3 · 21 en V2 (3 en parte) · 6 en el re-test de V1 |
| Planilla única | 470 casos · 157 historias y ADR · 36 defectos · 16 cambios de estado |
