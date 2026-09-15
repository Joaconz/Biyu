# Testing de aplicaciones — Resumen completo (Clases 1 a 7)

Archivo único de referencia con el contenido de los 7 resúmenes de estudio, pensado para consultar al resolver tareas y trabajos prácticos.

**Cómo usarlo**

- Cada clase empieza con un título de nivel 1 (`# Clase N`). Las secciones están numeradas `N.x`, así que se puede buscar, por ejemplo, "5.3" o "Paradoja del pesticida".
- Los bloques citados (`>`) marcan el tipo de contenido: **Para el examen**, **Definición**, **Trampa frecuente**, **Caso aplicado / Ejemplo resuelto** y **Corrección al material** (errores de los PDFs originales, ya corregidos).
- Los diagramas de los HTML se reemplazaron por su descripción; la misma información está en las tablas y mapas mentales.
- Las preguntas de práctica tienen la respuesta visible, al final de cada clase.
- El material original eran slides con mucho contenido en imágenes: lo marcado como "agregado propio", "canónico" o "reconstruido" no sale del PDF y conviene contrastarlo con lo visto en clase.

## Índice

| Unidad | Clase | Tema |
| --- | --- | --- |
| 1 | 1 | Calidad, testing y sus objetivos |
| 1 | 2 | Deming (PDCA), verificación y validación, error-defecto-falla |
| 1 | 3 | Actividades del tester y trazabilidad |
| 2 | 4 | Ciclo de vida del testing (STLC) |
| 2 | 5 | Los siete principios del testing (ISTQB) |
| 2 | 6 | Tipos de pruebas y etapas de desarrollo |
| 2 | 7 | Testing tradicional vs. agile |

## Conexiones entre clases

| Idea | Dónde aparece |
| --- | --- |
| El testing muestra presencia, no ausencia de defectos (Dijkstra) | Clase 1 · Clase 5 (principio 1) |
| Probar temprano es más barato | Clase 2 (Barber, PDCA) · Clase 5 (principio 3) · Clase 6 (modelo V) · Clase 7 (ágil) |
| Verificación vs. validación | Clase 2 · Clase 5 (principio 7) · Clase 6 (niveles de prueba) |
| Trazabilidad / RTM | Clase 3 · Clase 4 (diseño y ejecución) |
| Smoke, sanity y regresión | Clase 4 (ambiente) · Clase 5 (pesticida) · Clase 6 (catálogo) |
| Atributos de calidad → pruebas no funcionales | Clase 1 · Clase 3 · Clase 6 |
| El enfoque depende del contexto | Clase 5 (principio 6) · Clase 7 (tradicional vs. ágil) |

# Clase 1 — Calidad, testing y sus objetivos

*Testing de aplicaciones — Clase 1 de 7 · Unidad 1, exposición de experto 1: ¿se puede construir software que no falle?, qué es la calidad, qué es el testing y para qué sirve. Material original en formato slides — completado con desarrollo propio para hacerlo autocontenido. Varias slides eran solo imágenes (Línea 14, modelo de calidad del producto): esa parte está reconstruida con contenido canónico del tema y marcada como tal.*

## 1.1 ¿Es posible construir un software que no falla?

> **El problema que resuelve**
>
> Antes de hablar de testing hay que fijar qué se le puede pedir. Si uno cree que probar "garantiza" que no haya errores, va a diseñar mal el proceso, prometer de más al cliente y frustrarse cuando aparezca el primer bug en producción.

### La respuesta corta: no se puede garantizar

El software tiene una **complejidad inherente**: la cantidad de combinaciones de entradas, estados internos, secuencias de uso, configuraciones y entornos crece de forma explosiva. Probarlas todas es imposible en tiempo y costo (esto vuelve como principio 2 del ISTQB en la Unidad 2). Por eso ningún proceso de pruebas puede asegurar la ausencia total de fallas.

> **Cita central — Dijkstra (1970)**
>
> "El testing sirve para mostrar la **presencia** de fallos, pero no la **ausencia** de ellos."

La justificación es lógica: una prueba que falla es una *evidencia positiva* de que hay un defecto. Una prueba que pasa solo dice que *ese caso* funcionó; no dice nada de los millones de casos que no se ejecutaron. Mil pruebas verdes no demuestran corrección; una roja sí demuestra incorrección.

### El caso de la Línea 14 del metro de París

La slide solo muestra el caso como imagen; lo que sigue es el contexto conocido. La Línea 14 (Météor, inaugurada en 1998) es totalmente automática, sin conductor. La parte crítica de seguridad de su software se desarrolló con **métodos formales** (el método B): el código se derivó de una especificación matemática y se *demostró* que la cumplía. Es el ejemplo clásico de software de altísima confiabilidad.

¿Por qué se usa en una clase que dice que no se puede construir software sin fallas? Porque incluso ahí la demostración garantiza que el código cumple la **especificación**, no que la especificación sea correcta, ni que el hardware, el compilador o el entorno se comporten como se supuso. Muestra hasta dónde se puede llegar con muchísimo esfuerzo y costo — y que igual el "cero fallas" es relativo a un modelo.

> **Para el examen**
>
> No es posible garantizar software sin fallas por su complejidad inherente. El testing **reduce el riesgo** y **aporta información** sobre la calidad; no prueba la corrección.

> **Caso aplicado**
>
> Un gerente dice: "Pasaron los 500 casos de prueba, entonces el sistema no tiene errores".  
> **Respuesta correcta:** los 500 casos muestran que esos 500 escenarios funcionan. Por Dijkstra, no se puede concluir ausencia de defectos. Lo correcto es decir: "con la cobertura actual no detectamos fallas; el riesgo residual está en lo que no probamos", y explicitar qué quedó afuera.

> **Trampa frecuente**
>
> Decir que "si se hace suficiente testing el software queda libre de errores". Es falso siempre, no solo "en la práctica": el testing es muestral por naturaleza.

## 1.2 Calidad

> **El problema que resuelve**
>
> El testing informa "sobre la calidad". Si no se define calidad, no se sabe qué medir ni cuándo algo es "suficientemente bueno" para entregarlo.

### Qué es la calidad

El material da una definición mínima: la calidad es una característica que permite **comparar** cosas entre sí. Es útil pero incompleta: no dice *respecto de qué* se compara. Las definiciones de Weinberg y Kaner resuelven eso poniendo a una persona en el centro.

| Autor | Definición | Qué agrega |
| --- | --- | --- |
| Jerry Weinberg | "La calidad es valor para una persona." | La calidad es **relativa**: no es una propiedad absoluta del producto, depende de quién lo usa y qué espera. |
| Cem Kaner | "La calidad es valor para una persona **a la que le interesa**" (*who matters*). | No todas las opiniones pesan igual: importa la de los **stakeholders relevantes** (cliente, usuario, negocio). Esto permite priorizar. |

> **Corrección al material**
>
> La slide atribuye a Kaner el libro *"Metrics and Models in Software Quality Engineering"*. Ese libro es de **Stephen H. Kan** (Addison-Wesley), no de Cem Kaner. La frase de Kaner sí es suya (la desarrolla, entre otros, en *Lessons Learned in Software Testing*).

### Calidad vs. perfección: la falacia del nirvana

La **falacia del nirvana** es un error lógico: descartar una opción real porque no alcanza un ideal perfecto que no existe. Aplicado a software: "si no podemos dejarlo sin bugs, no vale la pena probar" o "no se entrega hasta que esté perfecto". Ambas son falacias. Voltaire lo resume: **"Lo perfecto es enemigo de lo bueno"**.

La consecuencia práctica es que la calidad se trabaja como **nivel suficiente para el contexto**: un sistema de control ferroviario necesita un nivel muchísimo más alto que una app de recetas, y el esfuerzo de testing se ajusta a eso.

> **Caso aplicado**
>
> Una startup retrasa seis meses el lanzamiento porque "todavía quedan bugs menores de estética".  
> **Diagnóstico:** falacia del nirvana. Si los bugs no afectan el valor para el usuario que importa (Kaner), conviene lanzar, registrar los defectos y priorizarlos. Retrasar tiene un costo real (mercado, ingresos) que la perfección no compensa.

> **Trampa frecuente**
>
> Pensar que calidad = cero defectos. Un producto con pocos defectos pero que no resuelve lo que el usuario necesita tiene **baja** calidad (esto conecta con validación, Clase 2).

## 1.3 Testing: definición y objetivos

> **El problema que resuelve**
>
> Si calidad es relativa y no se puede garantizar, hace falta una actividad que **genere información** confiable para decidir: ¿entregamos?, ¿qué arreglamos primero?

### Tres definiciones, tres énfasis

| Autor | Definición | Énfasis |
| --- | --- | --- |
| Cem Kaner | Investigación técnica para proveer información a los stakeholders sobre la calidad del producto o servicio bajo prueba. | Testing como **fuente de información** para decidir. |
| Glenford Myers | \(a\) Proceso para asegurar que el código hace lo que debe y no hace lo que no debe. (b) Proceso de ejecutar un programa **con el objetivo de encontrar errores**. | Testing **destructivo**: un buen caso es el que encuentra un error. |
| Federico Toledo | Aportar calidad al software verificándolo y detectando posibles incidencias que pueda tener cuando esté en uso. | Testing como **aporte de valor** orientado al uso real. |

La definición (b) de Myers es la más citada en exámenes. Su lógica es psicológica: si el objetivo fuera "mostrar que anda", el tester elegiría inconscientemente casos que pasan. Si el objetivo es romperlo, elige casos límite, datos raros y flujos no previstos, que es donde están los defectos.

### Objetivo del testing

El material lo plantea así: encontrar **la mayor cantidad de fallos que más calidad agreguen**, es decir, los que **más van a molestar al cliente**. No todos los bugs valen lo mismo: se prioriza por impacto y riesgo. La síntesis agrega que los objetivos van más allá de detectar errores: **validar** que cumple los requisitos, **verificar** el funcionamiento esperado y **evaluar** desempeño, seguridad y usabilidad.

> **Para el examen**
>
> El objetivo no es encontrar *todos* los errores (imposible) sino los **más relevantes para el cliente**, y dar información para decidir. Y el testing es un **proceso continuo** a lo largo de todo el ciclo de vida, no un evento al final.

> **Caso aplicado**
>
> Quedan dos días de pruebas en un e-commerce. Opciones: (A) probar que el color del footer sea exacto en 10 navegadores; (B) probar el pago con tarjeta con montos límite y tarjetas rechazadas.  
> **Elección: B.** Una falla en el pago impacta directo en el cliente y en el negocio; el footer, casi nada. Es aplicar "los fallos que más molestan al cliente".

## 1.4 Aseguramiento vs. control de calidad

> **El problema que resuelve**
>
> Detectar defectos después de producidos es caro. Hace falta distinguir la actividad que *encuentra* problemas de la que *evita* que aparezcan.

| Criterio | Control de calidad (QC) | Aseguramiento de calidad (QA) |
| --- | --- | --- |
| Objetivo | **Detectar** deficiencias en la calidad | **Evitar** que se produzcan |
| Foco | Producto | Proceso |
| Enfoque | Reactivo / correctivo | Preventivo |
| Ejemplos | Ejecutar pruebas, inspeccionar entregables, reportar bugs | Definir estándares, revisar requisitos, capacitar, auditar el proceso, adoptar normas |
| Cuándo | Sobre algo ya construido | Durante todo el proceso |

> **Trampa frecuente**
>
> Usar "QA" como sinónimo de "tester que ejecuta pruebas". Ejecutar pruebas es **control**. El aseguramiento trabaja sobre el proceso para que los defectos no se inyecten.

### Normas de calidad

Hay varias formas de organizar el testing y el plan de pruebas. Una es aplicar la norma **ISO/IEC/IEEE 29119 — Software Testing**, que **reemplaza a la IEEE 829** (el estándar clásico de documentación de pruebas). Estas normas y organismos establecen y difunden estándares de pruebas: vocabulario común, procesos, documentación y técnicas.

Contexto canónico útil: la 29119 tiene varias partes (conceptos, procesos, documentación, técnicas). La parte de documentación (29119-3) es la que ocupa el lugar de la vieja IEEE 829.

## 1.5 Calidad del producto y atributos de calidad

> **El problema que resuelve**
>
> "Calidad" es abstracto. Para probarla hay que descomponerla en atributos concretos y medibles.

### Modelo de calidad del producto

La slide muestra un diagrama como imagen (no extraíble). El modelo estándar de calidad de producto es **ISO/IEC 25010** (familia SQuaRE). En su versión 2011 define 8 características:

| Característica | Pregunta que responde |
| --- | --- |
| Adecuación funcional | ¿Hace lo que tiene que hacer, completo y correcto? |
| Eficiencia de desempeño | ¿Responde rápido y usa bien los recursos? |
| Compatibilidad | ¿Convive e interopera con otros sistemas? |
| Usabilidad | ¿Es fácil de aprender y usar? |
| Fiabilidad | ¿Funciona sin fallar, está disponible, se recupera? |
| Seguridad | ¿Protege datos y accesos? |
| Mantenibilidad | ¿Es fácil de modificar, analizar y probar? |
| Portabilidad | ¿Se puede instalar y llevar a otros entornos? |

Nota: la revisión 2023 de ISO 25010 reorganiza el modelo en 9 características (agrega, por ejemplo, *safety* y *flexibility*). Confirmá con la cátedra qué versión toman.

### Atributos de calidad más comunes (lista del material)

No hay una lista definitiva: dependen del proyecto. Los más frecuentes:

| \# | Atributo | Qué significa |
| --- | --- | --- |
| 1 | Desplegabilidad | Facilidad para poner el sistema en producción. |
| 2 | Disponibilidad | Proporción del tiempo en que el sistema está operativo. |
| 3 | Escalabilidad | Capacidad de atender más carga agregando recursos. |
| 4 | Interoperabilidad | Capacidad de intercambiar información con otros sistemas. |
| 5 | Modificabilidad | Facilidad y bajo costo para introducir cambios. |
| 6 | Rendimiento | Tiempos de respuesta y throughput. |
| 7 | Seguridad | Protección frente a accesos y usos no autorizados. |
| 8 | Testeabilidad | Facilidad para probar el sistema. |
| 9 | Usabilidad | Facilidad de uso para el usuario final. |

> **Corrección al material**
>
> En la slide el ítem 4 aparece vacío y "Interoperabilidad" quedó suelto arriba de la lista por un error de diagramación. Por el orden alfabético de la lista, el ítem 4 es **Interoperabilidad**.

> **Caso aplicado**
>
> Un home banking. ¿Qué atributos priorizar? **Seguridad** (dinero y datos), **disponibilidad** (el cliente opera a toda hora) y **rendimiento** (picos a fin de mes). La desplegabilidad importa menos para el usuario. Esto define qué pruebas no funcionales pesan más (ver Clase 6).

> **Trampa frecuente**
>
> Confundir **testeabilidad** (atributo del producto: qué tan fácil es probarlo) con **testing** (la actividad). Un sistema muy acoplado tiene baja testeabilidad aunque se lo pruebe mucho.

## 1.6 Síntesis y mapa mental

| Idea | Qué hay que poder decir |
| --- | --- |
| Complejidad | Hace imposible garantizar que no haya fallas. |
| Enfoque en la calidad | No se eliminan todas las fallas, pero se mejora la calidad con buenas prácticas de desarrollo y pruebas. |
| Objetivos del testing | Detectar errores relevantes, validar requisitos, verificar funcionamiento, evaluar desempeño, seguridad y usabilidad. |
| Proceso continuo | Desde los requisitos hasta la entrega, no un evento final (se desarrolla en Clase 2). |

### Mapa mental

```text
¿Software sin fallas? ── NO (complejidad inherente)
        │                  └─ Dijkstra: el testing muestra presencia, no ausencia
        ▼
     CALIDAD ── valor para una persona (Weinberg) … que importa (Kaner)
        │   └─ no es perfección → falacia del nirvana (Voltaire)
        │   └─ se descompone en atributos → ISO 25010 / lista de 9 atributos
        ▼
     TESTING ── investigación que informa a stakeholders (Kaner)
        │   └─ ejecutar para encontrar errores (Myers)
        │   └─ objetivo: los fallos que más molestan al cliente
        ▼
  QC (detectar, producto)  vs  QA (prevenir, proceso)
        └─ normas: ISO/IEC/IEEE 29119 (reemplaza IEEE 829)
```

## 1.P Práctica — Clase 1

**P1 · JUSTIFICAR.** ¿Por qué una batería de pruebas que pasa completa no demuestra que el software no tiene defectos?

> **Respuesta:**
>
> Porque el testing es muestral: ejecuta un subconjunto finito de todas las combinaciones posibles de entradas, estados y entornos, que por la complejidad del software es prácticamente infinito. Que los casos ejecutados pasen solo informa sobre esos casos. En cambio, un caso que falla es evidencia concreta de un defecto. Es la idea de Dijkstra: el testing muestra la presencia de fallos, no su ausencia.

**P2 · COMPARAR.** Compará las definiciones de calidad de Weinberg y de Kaner. ¿Qué problema de la primera resuelve la segunda?

> **Respuesta:**
>
> Weinberg dice que la calidad es valor para una persona: la vuelve relativa, pero cualquier persona serviría como referencia, y distintas personas pueden querer cosas opuestas. Kaner agrega "a la que le interesa" (who matters): la referencia son los stakeholders relevantes. Eso permite priorizar cuando las expectativas chocan y decidir a quién hay que satisfacer.

**P3 · REFUTAR.** "Si no podemos garantizar que el software no falle, hacer testing es una pérdida de tiempo." ¿Qué falacia es y por qué está mal?

> **Respuesta:**
>
> Es la falacia del nirvana: descartar una opción real (testing que reduce riesgo) porque no alcanza un ideal inexistente (cero fallas). El testing tiene valor aunque no sea perfecto: detecta los defectos más relevantes, baja el riesgo y da información para decidir. "Lo perfecto es enemigo de lo bueno".

**P4 · COMPARAR.** Diferenciá aseguramiento de calidad y control de calidad, con un ejemplo de cada uno.

> **Respuesta:**
>
> El control de calidad busca **detectar** deficiencias en el producto ya construido; es reactivo. Ejemplo: ejecutar casos de prueba sobre una versión y reportar bugs. El aseguramiento busca **evitar** que se produzcan; trabaja sobre el proceso y es preventivo. Ejemplo: definir un estándar de revisión de requisitos o de código que se aplica antes de programar.

**P5 · APLICAR A UN CASO.** Tenés una semana para probar una app de turnos médicos. ¿Con qué criterio elegís qué probar primero?

> **Respuesta:**
>
> Con el objetivo del testing: buscar los fallos que más calidad agregan, es decir, los que más molestarían al cliente. Primero, reservar, cancelar y ver turnos (flujo central; una falla ahí deja al paciente sin atención), manejo de superposición de turnos y datos del paciente (seguridad/privacidad). Después, aspectos de menor impacto como textos o estética. Se prioriza por riesgo e impacto, no por facilidad.

**P6 · JUSTIFICAR.** ¿Por qué Myers define el testing como ejecutar un programa "con el objetivo de encontrar errores" y no "para mostrar que funciona"?

> **Respuesta:**
>
> Porque el objetivo condiciona cómo se diseñan las pruebas. Si se busca mostrar que funciona, se eligen casos felices que pasan. Si se busca romperlo, se eligen valores límite, datos inválidos y flujos inesperados, que es donde están los defectos. Una prueba exitosa, para Myers, es la que encuentra un error.

**P7 · REFUTAR.** "El testing es una actividad que se hace al final, cuando el software está terminado." ¿Qué dice la clase al respecto?

> **Respuesta:**
>
> Es falso: las pruebas son un proceso continuo a lo largo de todo el ciclo de vida, desde la especificación de requisitos hasta la entrega. Probar solo al final hace que los defectos se encuentren tarde, cuando son más caros de corregir (se profundiza en la Clase 2 con Barber y Deming).

**P8 · APLICAR A UN CASO.** ¿Qué norma aplicarías hoy para estructurar la documentación de un plan de pruebas y qué relación tiene con la IEEE 829?

> **Respuesta:**
>
> La ISO/IEC/IEEE 29119 (Software Testing). Sustituye a la IEEE 829, que era el estándar clásico de documentación de pruebas. La 29119 define vocabulario, procesos, documentación (plan de pruebas, especificaciones, reportes) y técnicas de prueba.

---

# Clase 2 — Deming, verificación y validación, error-defecto-falla

*Testing de aplicaciones — Clase 2 de 7 · Unidad 1, exposición de experto 2: por qué no conviene probar al final, el ciclo PDCA de Deming, verificación vs. validación y la cadena error → defecto → falla. Material original en formato slides — completado con desarrollo propio para hacerlo autocontenido. Incluye una corrección importante: la síntesis del material define error/falla/defecto de forma inconsistente con su propia slide.*

## 2.1 Testing al final del proyecto vs. el círculo de Deming

> **El problema que resuelve**
>
> En el modelo clásico se programa todo y recién después se prueba. Los defectos aparecen cuando ya están "enterrados" bajo capas de diseño y código, y corregirlos es caro y demora la entrega.

> **Cita central — Scott Barber**
>
> "Hacer las pruebas al final de un proyecto es como pedir un examen de sangre cuando el paciente ya está muerto."

La metáfora dice dos cosas: el diagnóstico llega **tarde para actuar**, y lo que se descubre ya no se puede corregir barato. Un requisito mal entendido detectado en la etapa de análisis se arregla editando un documento; detectado en producción obliga a rediseñar, reprogramar, volver a probar y volver a desplegar.

### Por qué el costo crece con el tiempo

Contenido canónico (no está explícito en las slides, pero es lo que sostiene la síntesis): el costo de corregir un defecto crece a medida que avanza el proyecto, porque cada etapa construye sobre la anterior. Un defecto de requisitos arrastra diseño, código, pruebas y documentación hechos sobre una base equivocada.

| Dónde se detecta un requisito mal entendido | Qué hay que rehacer | Costo relativo |
| --- | --- | --- |
| Revisión de requisitos | Corregir el documento | Bajo |
| Diseño | Documento + diseño | Medio |
| Pruebas de sistema | Documento + diseño + código + re-pruebas | Alto |
| Producción | Todo lo anterior + despliegue, soporte, daño al cliente | Muy alto |

### El ciclo de Deming (PDCA)

Deming propone un ciclo de mejora continua: **Plan – Do – Check – Act**. Aplicado al desarrollo, las pruebas (Check) no son una etapa final sino una parte de **cada vuelta** del ciclo, que se repite a lo largo de todo el proyecto.

| Fase | Qué se hace | En testing |
| --- | --- | --- |
| **Plan** (planificar) | Definir objetivos y cómo lograrlos | Qué se va a probar, con qué criterio de aceptación |
| **Do** (hacer) | Ejecutar lo planificado a pequeña escala | Construir el incremento y sus pruebas |
| **Check** (verificar) | Medir resultados contra lo planificado | Ejecutar pruebas, comparar resultado esperado vs. obtenido |
| **Act** (actuar) | Estandarizar lo que funcionó, corregir lo que no | Corregir defectos y mejorar el proceso para que no se repitan |

*\[Diagrama\] Ciclo PDCA. En verde, la fase donde viven las pruebas y la vuelta que repite el ciclo: el testing aparece en cada iteración, no solo al final.*

> **Para el examen**
>
> Probar al final implica encontrar defectos tarde, con **costo elevado y retrasos**. El PDCA incorpora pruebas de forma **continua**: reduce riesgos y genera una **cultura de mejora continua**.

> **Caso aplicado**
>
> Un equipo entrega un sistema de facturación en 8 meses y prueba en el mes 8. Aparece que el cálculo de IVA no contempla un régimen especial que el cliente mencionó al principio.  
> **Con PDCA:** en la primera vuelta (mes 1) se planifica el módulo de impuestos con criterios de aceptación que incluyen ese régimen, se construye, se verifica contra el cliente y se ajusta. El error se hubiera detectado en semanas, no al final.

> **Trampa frecuente**
>
> Decir que PDCA "es una metodología de testing". Es un ciclo de **mejora continua** general (viene de la gestión de calidad industrial); el testing se incorpora en su fase Check.

## 2.2 Verificación y validación

> **El problema que resuelve**
>
> Un software puede estar perfectamente construido según su especificación y aun así no servirle al cliente. Hacen falta dos preguntas distintas.

| Criterio | Verificación | Validación |
| --- | --- | --- |
| Pregunta | **¿Estamos construyendo el producto correctamente?** | **¿Estamos construyendo el producto correcto?** |
| Definición (material) | Asegurar que el software implementa correctamente una función específica. | Actividades que aseguran que el software respeta los requisitos del cliente. |
| Se compara contra | Especificación, diseño, estándares | Necesidades y expectativas reales del cliente |
| Quién participa | Equipo técnico | Cliente / usuarios |
| Ejemplos | Revisiones de código, pruebas unitarias, inspecciones | Pruebas de aceptación, demos, prototipos con usuarios |

> **Precisión sobre el material**
>
> El material dice que la validación asegura que se respetan los requisitos "que se encuentran en las especificaciones". Ojo: si solo se compara contra la especificación, eso es verificación. La validación mira si el producto satisface las **necesidades reales** del cliente, que pueden no estar bien escritas en la especificación. Esa diferencia es justamente la que se toma en los exámenes.

> **Caso aplicado**
>
> La especificación dice "el reporte se exporta en CSV". El equipo lo implementa y todas las pruebas pasan. El cliente, al verlo, dice que necesitaba abrirlo con formato en Excel.  
> **Verificación: OK** (se construyó bien lo especificado). **Validación: falla** (no es el producto que el cliente necesitaba).

> **Trampa frecuente**
>
> Invertir las preguntas. Truco: **V**alidación = el producto **V**álido para el cliente (el correcto). Verificación = hecho *correctamente*.

## 2.3 Error, defecto y falla

> **El problema que resuelve**
>
> "Hay un bug" mezcla tres cosas distintas: la equivocación de una persona, la marca que eso dejó en el código y el síntoma visible. Separarlas permite reportar bien y atacar la causa, no el síntoma.

### La cadena causal

```text
ERROR (acción humana)  ──produce──▶  DEFECTO (en el código/artefacto)  ──al ejecutarse puede provocar──▶  FALLA (comportamiento observable incorrecto)
```

| Término | Qué es | Dónde está | Ejemplo del material |
| --- | --- | --- | --- |
| **Error** (equivocación) | Acción humana que produce un resultado incorrecto | En la cabeza de una persona | Un desarrollador interpreta mal una especificación. Pueden distinguirse errores de programación y de lógica. |
| **Defecto** (bug, fault) | Imperfección en el producto, consecuencia del error | En el código, diseño o documento | Usar `>` en lugar de `>=`. |
| **Falla** (failure) | Manifestación del defecto al usar el sistema | En la ejecución, visible para el usuario | El sistema rechaza a alguien que cumplía la condición. |

> **Corrección al material**
>
> La **síntesis** del PDF define: "Error: desviación del comportamiento esperado. Falla: resultado incorrecto debido a un error. Defecto: causa de una falla." Eso **contradice** la slide anterior del mismo material, donde el error es una acción humana. La versión correcta (y la del glosario ISTQB) es la de la tabla: **error = acción humana → defecto = causa en el código → falla = síntoma observable**. La "desviación del comportamiento esperado" describe una **falla**, no un error. Usá la versión de la tabla en el examen.

> **Ejemplo resuelto**
>
> Requisito: "Pueden votar las personas de **18 años o más**".
>
> ```python
> def puede_votar(edad):
>     return edad > 18      # DEFECTO: debería ser edad >= 18
> ```
>
> **Error:** el programador leyó "mayores de 18" y lo interpretó como estrictamente mayor.  
> **Defecto:** el operador `>` en la línea 2.  
> **Traza:** `puede_votar(30)` → True (correcto, no hay falla aunque el defecto esté). `puede_votar(18)` → False → **falla**: una persona de 18 no puede votar.  
> **Conclusión:** un defecto puede existir sin manifestarse nunca si no se ejecuta el caso que lo dispara. Por eso las pruebas de valores límite (probar 17, 18 y 19) son tan efectivas.

> **Para el examen**
>
> Todo defecto viene de un error humano, pero **no todo defecto produce una falla** (depende de si se ejecuta el camino y el dato que lo dispara). Y una falla también puede venir del entorno (hardware, configuración), no solo de un defecto de código.

> **Trampa frecuente**
>
> Decir que "el tester encuentra errores". Estrictamente, el tester observa **fallas**; el desarrollador, al depurar, localiza el **defecto**; el análisis de causa raíz identifica el **error** humano que lo originó.

## 2.4 Síntesis y mapa mental

| Concepto | Frase para el examen |
| --- | --- |
| Testing al final | Defectos detectados tarde → costo elevado y retrasos. |
| PDCA | Pruebas continuas en cada ciclo → menos riesgo, mejora continua. |
| Verificación | Construir el producto correctamente. |
| Validación | Construir el producto correcto. |
| Error → defecto → falla | Acción humana → imperfección en el código → síntoma al ejecutar. |

### Mapa mental

```text
¿Cuándo probar?
 ├─ Al final ─▶ Barber: "examen de sangre al muerto" ─▶ caro y tarde
 └─ Siempre  ─▶ Deming PDCA (Plan → Do → Check → Act → …)
                  └─ Check = verificar ── ¿contra qué?
                          ├─ contra la especificación → VERIFICACIÓN
                          └─ contra la necesidad real → VALIDACIÓN
¿Qué encontramos?
 └─ FALLA (síntoma) ◀── DEFECTO (en el código) ◀── ERROR (humano)
Conexión: Clase 1 (testing continuo) · Clase 5 (principio 3: pruebas tempranas)
```

## 2.P Práctica — Clase 2

**P1 · JUSTIFICAR.** Explicá la frase de Scott Barber y por qué probar al final aumenta el costo.

> **Respuesta:**
>
> La frase compara probar al final con pedir un análisis cuando el paciente ya murió: el diagnóstico llega cuando ya no se puede actuar a tiempo. En software, cada etapa se construye sobre la anterior; un defecto introducido temprano (por ejemplo, en requisitos) queda arrastrado en el diseño, el código y la documentación. Detectarlo al final obliga a rehacer todo eso, re-probar y retrasar la entrega, por eso el costo es mucho mayor que si se hubiera detectado en su etapa de origen.

**P2 · COMPARAR.** Diferenciá verificación y validación y dá un ejemplo donde una se cumple y la otra no.

> **Respuesta:**
>
> Verificación responde "¿construimos el producto correctamente?": compara contra especificación y diseño. Validación responde "¿construimos el producto correcto?": compara contra las necesidades reales del cliente. Ejemplo: se especificó exportar en CSV, se implementó sin defectos (verificación OK), pero el cliente necesitaba un Excel con formato (validación falla).

**P3 · REFUTAR.** "Un error es la desviación del comportamiento esperado del sistema." ¿Es correcta esta definición? Justificá.

> **Respuesta:**
>
> No. La desviación observable del comportamiento esperado es una **falla**. El error es la acción humana equivocada (por ejemplo, interpretar mal un requisito), que produce un defecto en el código, y ese defecto, al ejecutarse, puede provocar la falla. La propia síntesis del material usa esa definición incorrecta y contradice su slide anterior.

**P4 · APLICAR A UN CASO.** Un descuento del 10% debe aplicarse a compras "desde \$10.000". El código dice `if total > 10000`. Identificá error, defecto y en qué caso aparece la falla.

> **Respuesta:**
>
> **Error:** el programador interpretó "desde" como "mayor a". **Defecto:** el operador `>` (debería ser `>=`). **Falla:** aparece solo cuando el total es exactamente \$10.000: el cliente no recibe el descuento. Con \$9.000 o \$15.000 el sistema se comporta bien, así que el defecto no se manifiesta; por eso hay que probar el valor límite.

**P5 · JUSTIFICAR.** ¿Puede existir un defecto que nunca produzca una falla? ¿Y una falla sin defecto en el código?

> **Respuesta:**
>
> Sí a ambas. Un defecto en un camino de código que nunca se ejecuta con los datos que lo disparan nunca se manifiesta. Y una falla puede originarse en el entorno (hardware defectuoso, configuración errónea, radiación, red) sin que haya un defecto en el código.

**P6 · COMPARAR.** Describí las cuatro fases del ciclo de Deming y ubicá el testing en ellas.

> **Respuesta:**
>
> Plan: definir objetivos y cómo lograrlos (qué probar, criterios de aceptación). Do: ejecutar lo planificado (construir el incremento y sus pruebas). Check: medir resultados contra lo esperado (ejecutar las pruebas). Act: corregir y estandarizar lo que funcionó (arreglar defectos, mejorar el proceso). El ciclo se repite, así que el testing aparece en todas las vueltas y no solo al final, generando mejora continua.

**P7 · APLICAR A UN CASO.** Un cliente usa el sistema y reporta: "Me cobró dos veces". ¿Qué término corresponde a lo que reporta y qué pasos siguen para llegar al defecto y al error?

> **Respuesta:**
>
> Reporta una **falla** (síntoma observable). El tester la reproduce y la documenta; el desarrollador depura y localiza el **defecto** (por ejemplo, un reintento de pago sin control de idempotencia); el análisis de causa raíz identifica el **error** humano (no se consideró que la red puede fallar y el usuario reintentar). Corregir solo el defecto arregla este caso; atacar el error (por ejemplo, con revisiones o guías de diseño) evita que se repita.

---

# Clase 3 — Actividades del tester y trazabilidad

*Testing de aplicaciones — Clase 3 de 7 · Unidad 1, exposición de experto 3: qué hace un tester más allá de "ejecutar pruebas" y cómo la trazabilidad conecta requisitos con pruebas. Material original en formato slides — completado con desarrollo propio para hacerlo autocontenido. La slide de trazabilidad horizontal/vertical era solo un gráfico: la explicación está reconstruida con las definiciones habituales del tema.*

## 3.1 ¿Qué actividades realiza un tester?

> **El problema que resuelve**
>
> La imagen popular del tester es alguien que "hace clic hasta que algo explota" al final del proyecto. Eso contradice todo lo visto en las Clases 1 y 2: si el testing es continuo y preventivo, el tester tiene que intervenir desde los requisitos.

El material presenta las actividades en tres niveles de detalle. Conviene leerlos como capas: el primero es el núcleo, el segundo es el ciclo de trabajo, el tercero amplía el rol hacia la prevención y lo no funcional.

### Núcleo del rol

**Diseño y ejecución de pruebas** e **identificación y reporte de errores**. Es lo mínimo: pensar casos, correrlos y comunicar lo que se encuentra.

### Ciclo de trabajo sobre las pruebas

| Actividad | Qué implica | Resultado |
| --- | --- | --- |
| Planificación de pruebas | Decidir qué se prueba, cómo, con qué recursos y en qué orden según el riesgo | Plan de pruebas |
| Ejecución de pruebas | Correr casos manuales o automatizados y registrar el resultado obtenido | Resultados de ejecución |
| Evaluación de resultados | Comparar resultado esperado vs. obtenido y decidir si es defecto, error del caso o del entorno | Veredicto por caso |
| Registro de defectos | Documentar la falla para que se pueda reproducir | Reporte de defecto |
| Seguimiento de defectos | Acompañar el defecto hasta su cierre y re-probar la corrección | Defecto verificado y cerrado |

> **Ejemplo resuelto — un buen reporte de defecto**
>
> ```text
> Título:     El descuento no se aplica con total exactamente $10.000
> Pasos:      1) Iniciar sesión  2) Agregar productos por $10.000  3) Ir al checkout
> Esperado:   Total con 10% de descuento = $9.000
> Obtenido:   Total = $10.000 (sin descuento)
> Entorno:    v2.3.1 · Chrome 128 · ambiente QA
> Severidad:  Media    Prioridad: Alta (afecta ventas en campaña)
> Evidencia:  captura + log de la request
> Requisito:  REQ-017 (trazabilidad, ver sección 2)
> ```
>
> Por qué está bien: es **reproducible** (pasos concretos), separa **esperado de obtenido**, indica **entorno y versión** y se vincula al requisito. Un reporte que dice "el descuento anda mal" obliga al desarrollador a adivinar.

### Actividades ampliadas (prevención y calidad no funcional)

| Actividad | Qué se busca | Tipo |
| --- | --- | --- |
| Revisión de requisitos | Que los requisitos funcionales y no funcionales sean claros y completos | Estática / preventiva |
| Análisis de riesgos | Identificar riesgos del proyecto y planes para mitigarlos | Preventiva / planificación |
| Revisión de diseño | Que el diseño cumpla requisitos y funcionalidades | Estática / preventiva |
| Revisión de código | Identificar defectos en el código fuente sin ejecutarlo | Estática |
| Pruebas de rendimiento | Rendimiento aceptable | Dinámica / no funcional |
| Pruebas de seguridad | Que el software sea seguro | Dinámica / no funcional |
| Pruebas de usabilidad | Que sea fácil de usar | Dinámica / no funcional |

La columna "Tipo" es un agregado propio útil para el examen: las **revisiones** son pruebas **estáticas** (no ejecutan el software) y detectan defectos directamente, antes de que causen fallas. Las pruebas **dinámicas** ejecutan el sistema y observan fallas. Las revisiones tempranas son la aplicación concreta de "probar temprano" (Clase 2, PDCA; Clase 5, principio 3).

> **Para el examen**
>
> El tester hace pruebas **manuales y automatizadas**, **crea casos de prueba**, **ejecuta** para identificar errores y **documenta** resultados para los desarrolladores. Pero su rol empieza antes del código: revisa requisitos y diseño y analiza riesgos.

> **Caso aplicado**
>
> Un requisito dice: "El sistema debe responder rápido".  
> **Acción del tester (revisión de requisitos):** marcarlo como no testeable y pedir un criterio medible, por ejemplo "el 95% de las búsquedas responde en menos de 2 segundos con 500 usuarios concurrentes". Sin eso, la prueba de rendimiento no tiene resultado esperado contra el cual comparar.

> **Trampa frecuente**
>
> Creer que el tester solo trabaja cuando hay software ejecutable. Las revisiones de requisitos, diseño y código son actividades del tester y se hacen **sin ejecutar** nada.

## 3.2 Trazabilidad

> **El problema que resuelve**
>
> Con cientos de requisitos y miles de casos: ¿cómo sabés que cada requisito está probado?, ¿qué pruebas hay que repetir si cambia un requisito?, ¿qué requisito se ve afectado por un defecto? Sin vínculos explícitos, esas preguntas no tienen respuesta.

> **Definición**
>
> **Trazabilidad:** capacidad de identificar elementos relacionados en la documentación y el software, por ejemplo, **requisitos con sus pruebas asociadas**.

### Qué aporta (síntesis del material)

Asegura que **cada requisito esté vinculado a su caso de prueba**; permite **rastrear cambios** y la evolución del software en el tiempo; facilita **identificar y resolver problemas**; mejora la **comunicación** entre los miembros del equipo.

### Horizontal y vertical

La slide solo nombra ambos tipos sobre un gráfico. Las definiciones habituales:

| Criterio | Trazabilidad vertical | Trazabilidad horizontal |
| --- | --- | --- |
| Qué vincula | Artefactos de **distintos niveles** de abstracción del desarrollo | Artefactos del **mismo nivel**, o a lo largo de la documentación de pruebas |
| Dirección | De arriba hacia abajo (y al revés) | De costado, entre elementos pares |
| Ejemplo | Requisito de negocio → requisito de software → diseño → código → caso de prueba | Plan de pruebas → diseño de pruebas → caso de prueba → procedimiento; o requisito ↔ requisito que depende de él |
| Pregunta que responde | ¿Este requisito se implementó y se probó? | ¿Qué otros elementos del mismo nivel se ven afectados si cambio este? |

Nota: distintas fuentes definen "horizontal" con matices diferentes (entre requisitos relacionados, o dentro de la documentación de pruebas de un nivel, como hace ISTQB). Lo estable es la idea: vertical cruza niveles, horizontal se mueve dentro de un nivel.

### La herramienta: matriz de trazabilidad (RTM)

> **Ejemplo resuelto**
>
> | Requisito | CP-01 | CP-02 | CP-03 | CP-04 | Estado |
> | --- | --- | --- | --- | --- | --- |
> | REQ-01 Login | ✔ pasó | ✔ pasó |  |  | Cubierto, OK |
> | REQ-02 Descuento ≥ \$10.000 |  |  | ✘ falló |  | Cubierto, con defecto |
> | REQ-03 Exportar reporte |  |  |  |  | **Sin cobertura** |
> | — |  |  |  | CP-04 sin requisito | **Caso huérfano** |
>
> **Lectura:** (1) REQ-03 no tiene pruebas → hay que diseñarlas antes de liberar. (2) REQ-02 tiene un defecto abierto → no se puede dar por cumplido. (3) CP-04 no corresponde a ningún requisito → o falta documentar un requisito, o es una prueba innecesaria. (4) Si el cliente cambia REQ-01, la matriz dice exactamente qué casos revisar: CP-01 y CP-02. Esa es la utilidad de "rastrear cambios".

> **Para el examen**
>
> La trazabilidad vincula requisitos con pruebas (y con diseño y código). Sirve para medir **cobertura**, hacer **análisis de impacto** ante cambios y ubicar el origen de los problemas. Su instrumento es la **matriz de trazabilidad de requisitos (RTM)**, que vuelve a aparecer en el ciclo de vida del testing (Clase 4).

> **Trampa frecuente**
>
> Pensar que la trazabilidad es "tener los requisitos documentados". Documentar no alcanza: tiene que existir el **vínculo explícito** entre elementos. Una lista de requisitos y otra de casos, sin relación, no es trazabilidad.

## 3.3 Síntesis y mapa mental

```text
TESTER
 ├─ Núcleo: diseñar + ejecutar pruebas · identificar + reportar errores
 ├─ Ciclo: planificar → ejecutar → evaluar → registrar → seguir defectos
 └─ Ampliado
     ├─ Estático/preventivo: revisar requisitos · diseño · código · análisis de riesgos
     └─ No funcional: rendimiento · seguridad · usabilidad  (→ Clase 6)

TRAZABILIDAD = vincular elementos relacionados (requisito ↔ prueba)
 ├─ Vertical: entre niveles (negocio → requisito → diseño → código → prueba)
 ├─ Horizontal: dentro de un nivel (requisito ↔ requisito / plan → caso)
 ├─ Herramienta: RTM  (→ Clase 4: se crea en Diseño y se actualiza en Ejecución)
 └─ Beneficios: cobertura · análisis de impacto · origen de problemas · comunicación
```

## 3.P Práctica — Clase 3

**P1 · REFUTAR.** "El tester empieza a trabajar cuando los desarrolladores terminan de programar." Refutá con al menos dos actividades.

> **Respuesta:**
>
> Es falso. El tester revisa requisitos (que estén claros, completos y sean testeables) y hace análisis de riesgos antes de que exista código; también revisa el diseño. Además planifica las pruebas y diseña casos en paralelo al desarrollo. Esas actividades son preventivas: encuentran defectos cuando corregirlos es barato.

**P2 · JUSTIFICAR.** ¿Qué elementos debe tener un reporte de defecto y por qué cada uno?

> **Respuesta:**
>
> Título claro (para identificarlo rápido), pasos para reproducir (el desarrollador tiene que poder ver la falla), resultado esperado y obtenido (define por qué es un defecto), entorno y versión (las fallas pueden depender de ellos), severidad y prioridad (para decidir el orden de corrección), evidencia (capturas, logs) y el requisito asociado (trazabilidad). Sin reproducibilidad, el defecto suele cerrarse como "no se puede reproducir".

**P3 · COMPARAR.** Diferenciá trazabilidad vertical y horizontal con un ejemplo de cada una.

> **Respuesta:**
>
> La vertical vincula artefactos de distintos niveles de abstracción: por ejemplo, el requisito "el usuario puede recuperar su contraseña" con su diseño, el módulo de código que lo implementa y los casos de prueba que lo verifican. La horizontal vincula elementos del mismo nivel: por ejemplo, el requisito de recuperación de contraseña con el de envío de emails, del que depende, o el plan de pruebas con los casos y procedimientos derivados. La vertical responde "¿se implementó y probó?"; la horizontal, "¿qué más se afecta si cambia esto?".

**P4 · APLICAR A UN CASO.** El cliente cambia el requisito de cálculo de envío a una semana de la entrega. ¿Cómo ayuda la trazabilidad?

> **Respuesta:**
>
> Con la matriz de trazabilidad se identifican exactamente los casos de prueba (y el diseño y código) vinculados a ese requisito. Así se actualizan y re-ejecutan solo esos casos, más los de requisitos relacionados, en lugar de repetir todo o, peor, olvidarse de alguno. Es análisis de impacto: ahorra tiempo y reduce el riesgo de liberar con pruebas desactualizadas.

**P5 · APLICAR A UN CASO.** En una RTM encontrás un requisito sin casos asociados y un caso sin requisito asociado. ¿Qué significa cada situación y qué hacés?

> **Respuesta:**
>
> Requisito sin casos: falta de cobertura; hay funcionalidad que no se está verificando, así que hay que diseñar pruebas antes de liberar. Caso sin requisito (huérfano): o existe un requisito que no está documentado (hay que documentarlo) o la prueba no aporta valor y puede eliminarse. En ambos casos la matriz revela una inconsistencia que sin ella pasaría inadvertida.

**P6 · COMPARAR.** ¿Qué diferencia hay entre una revisión de código y una prueba de rendimiento en cuanto a cómo detectan problemas?

> **Respuesta:**
>
> La revisión de código es estática: se lee el código sin ejecutarlo y se encuentran **defectos** directamente (por ejemplo, un operador mal usado). La prueba de rendimiento es dinámica: ejecuta el sistema bajo carga y observa **fallas** o degradaciones (tiempos de respuesta altos), cuyo defecto luego hay que localizar. Además, la de rendimiento evalúa un atributo no funcional.

**P7 · JUSTIFICAR.** ¿Por qué un requisito como "el sistema debe ser fácil de usar" es un problema para el tester y qué debería hacer?

> **Respuesta:**
>
> Porque no es testeable: no define un resultado esperado medible, así que ninguna prueba puede decir si se cumple. En la revisión de requisitos el tester debe señalarlo y proponer un criterio verificable, por ejemplo "un usuario nuevo completa una compra en menos de 3 minutos sin ayuda, en 8 de cada 10 intentos".

---

# Clase 4 — Ciclo de vida del testing (STLC)

*Testing de aplicaciones — Clase 4 de 7 · Unidad 2, exposición de experto 1: las seis fases del Software Testing Life Cycle, qué requiere y qué entrega cada una. Material original en formato slides (con texto muy fragmentado por la conversión) — completado con desarrollo propio para hacerlo autocontenido.*

## 4.1 Qué es el STLC y por qué existe

> **El problema que resuelve**
>
> La Unidad 1 dejó claro que el testing debe ser continuo y planificado. Pero "probar todo el tiempo" sin orden produce caos: pruebas sin plan, sin ambiente, sin datos, sin forma de saber cuándo terminar. El STLC ordena esas actividades en fases con entradas y salidas definidas.

> **Definición**
>
> El **ciclo de vida del testing (STLC, Software Testing Life Cycle)** es el proceso que guía las actividades de prueba durante el desarrollo de software, organizado en fases secuenciales, cada una con **lo que requiere** (entrada) y **lo que entrega** (salida).

*\[Diagrama\] Las seis fases del STLC. En verde, la fase que el material señala como la más importante; en ámbar (línea punteada), la preparación del ambiente, que puede arrancar en paralelo con el diseño.*

> **Para el examen**
>
> Fases: **análisis de requerimientos → planificación → diseño del test → configuración del ambiente → ejecución → cierre**. Cada una tiene un **requerido** y un **entregable**; el entregable de una suele ser el requerido de la siguiente.

## 4.2 Las seis fases en detalle

### 2.1 Análisis de requerimientos

Es, según el material, **la fase más importante del ciclo**. Se recopilan los requerimientos del cliente (**CRS**, Customer Requirement Specification) y las especificaciones del negocio (**BRS**, Business Requirement Specification). El equipo de pruebas los analiza para entender *qué* hay que probar y si *se puede* probar. Es la más importante porque todo lo demás se construye sobre ella: un requisito mal entendido acá contamina plan, casos y resultados (Clase 2, costo del defecto).

### 2.2 Planificación

Se planifican las pruebas, los **esfuerzos y recursos** necesarios, los **responsables** y las capacitaciones (training) si hacen falta. Acá se define la **estrategia**: qué tipos de prueba, qué se automatiza, qué riesgos priorizar, criterios para empezar y terminar.

### 2.3 Diseño del test

Se escriben los **casos de prueba** y, si aplica, los **scripts de automatización**, y se preparan los **datos de prueba**. Cuando los casos están listos se revisan **entre pares** (peer review) y se crea la **matriz de trazabilidad de requerimientos (RTM)**, que vincula cada requisito con sus casos (Clase 3).

### 2.4 Configuración y prueba del ambiente

Puede **iniciar en paralelo** con el diseño. Se preparan y verifican los ambientes donde se va a probar (software y hardware, si aplica). Se recomienda validar el ambiente con **smoke o sanity cases**: pruebas cortas que confirman que el ambiente y el build están en condiciones de recibir el testing completo.

> **Precisión sobre el material**
>
> La slide titula la fase "Testing del ambiente" y dice que se testean los ambientes "en los que el software será desarrollado". En el STLC esta fase es **Test Environment Setup**: se prepara el ambiente **donde se ejecutarán las pruebas**, que debería parecerse lo más posible al de producción. No es el ambiente de desarrollo.

### 2.5 Ejecución del test

Se ejecutan los casos según lo planificado, **actualizando el resultado** en cada caso para tener seguimiento. Los bugs se reportan al equipo con una **herramienta de seguimiento de defectos**. Cuando un bug se resuelve, **se vuelve a probar** (re-test), y conviene correr pruebas de regresión para confirmar que la corrección no rompió otra cosa (Clase 6).

### 2.6 Cierre del test

Se comparten los **resultados y métricas finales**. Es también el momento de las lecciones aprendidas: qué funcionó y qué mejorar para el próximo ciclo (el "Act" del PDCA, Clase 2).

### Tabla de entradas y salidas

| Fase | Requerido (entrada) | Entregable (salida) |
| --- | --- | --- |
| 1\. Análisis de requerimientos | Especificaciones del negocio y de los clientes (BRS, CRS) | Listado de **requerimientos testeables** y **factibilidad de automatización** |
| 2\. Planificación | Documentación detallada de los requerimientos | **Estrategia y plan de testing** + **estimación de esfuerzos** |
| 3\. Diseño del test | Documentación detallada de requerimientos (actualizada) | **Casos de testing**, scripts de automatización (si aplica), **datos de prueba** |
| 4\. Ambiente | Test plan, smoke test cases, test data | **Ambiente de testing** listo + resultados de smoke/sanity |
| 5\. Ejecución | Ambiente de testing, test plan, test data | **Reporte de ejecución**, **reporte de defectos**, **RTM** actualizada |
| 6\. Cierre | Reporte de ejecución y reporte de defectos | **Reporte y métricas finales** |

> **Trampa frecuente**
>
> Ubicar la RTM solo en una fase. Se **crea en el diseño** y se **actualiza y entrega en la ejecución**, con el estado de cada requisito según los resultados.

### Smoke vs. sanity

| Criterio | Smoke test (prueba de humo) | Sanity test (prueba de sanidad) |
| --- | --- | --- |
| Pregunta | ¿El build/ambiente funciona lo mínimo para empezar a probar? | ¿Esta parte puntual que cambió funciona razonablemente? |
| Alcance | Amplio y superficial (funciones principales) | Angosto y un poco más profundo (área modificada) |
| Cuándo | Al recibir un build nuevo o un ambiente nuevo | Tras una corrección o cambio menor |
| Si falla | Se rechaza el build/ambiente; no se sigue probando | Se devuelve el cambio antes de hacer regresión completa |

> **Caso aplicado — STLC de punta a punta**
>
> **Proyecto:** agregar pago con billetera virtual a un e-commerce.
>
> | Fase | Qué se hace concretamente |
> | --- | --- |
> | Análisis | Del BRS surge "aceptar pagos con billetera X". Se detecta que falta definir qué pasa si el pago queda pendiente → se consulta. Se decide que el flujo feliz es automatizable. |
> | Planificación | 2 testers, 10 días. Prioridad: pagos aprobados/rechazados/pendientes y seguridad. Se capacita al equipo en el sandbox del proveedor. |
> | Diseño | 25 casos (montos límite, cancelación, timeout), 5 scripts automatizados, tarjetas y cuentas de prueba. Revisión entre pares. RTM: cada requisito con sus casos. |
> | Ambiente | En paralelo: ambiente QA conectado al sandbox. Smoke: la app levanta, el botón de billetera aparece, el sandbox responde. |
> | Ejecución | Se corren los 25 casos. Falla "pago pendiente no actualiza el pedido" → se reporta en el tracker. Se corrige, se re-prueba, se corre regresión del checkout. RTM actualizada. |
> | Cierre | Métricas: 25 ejecutados, 24 OK, 3 defectos encontrados, 3 cerrados. Lección: pedir el sandbox antes la próxima vez. |

## 4.3 Síntesis y mapa mental

El STLC guía las actividades de prueba durante el desarrollo; sus etapas son análisis de requerimientos, planificación, diseño, ambiente, ejecución y cierre. **Facilita la identificación temprana de defectos**, contribuye a la **calidad del producto y la satisfacción del cliente**, y es una **parte integral** del desarrollo para entregar un producto confiable.

Relación con otros temas: el STLC no reemplaza al ciclo de vida del desarrollo (SDLC), **corre junto con él**. En la Clase 6 las mismas etapas aparecen como "las pruebas y las etapas de desarrollo".

```text
STLC
 ├─ 1 Análisis ── in: BRS/CRS ── out: requisitos testeables + factibilidad de automatizar   ★ la más importante
 ├─ 2 Planificación ── out: estrategia + plan + estimación (recursos, responsables, training)
 ├─ 3 Diseño ── out: casos + scripts + datos ── peer review ── crea RTM
 ├─ 4 Ambiente (∥ con 3) ── validar con smoke/sanity
 ├─ 5 Ejecución ── reportar bugs en tracker → corregir → re-test ── out: reportes + RTM
 └─ 6 Cierre ── out: reporte y métricas finales (+ lecciones aprendidas)
```

## 4.P Práctica — Clase 4

**P1 · JUSTIFICAR.** ¿Por qué se considera al análisis de requerimientos la fase más importante del STLC?

> **Respuesta:**
>
> Porque todas las fases siguientes se construyen sobre su resultado: el plan, los casos, los datos y los criterios de éxito dependen de haber entendido bien qué hay que probar. Un requisito mal interpretado o no testeable en esta fase se propaga a todo el ciclo y se descubre tarde, cuando corregirlo es caro. Además, acá se decide qué es testeable y qué conviene automatizar.

**P2 · APLICAR A UN CASO.** Indicá el requerido y el entregable de las fases de planificación y de ejecución.

> **Respuesta:**
>
> Planificación: requiere documentación detallada de los requerimientos; entrega la estrategia y el plan de testing más la estimación de esfuerzos. Ejecución: requiere el ambiente de testing, el test plan y los datos de prueba; entrega el reporte de ejecución de casos, el reporte de defectos y la matriz de trazabilidad actualizada.

**P3 · COMPARAR.** Diferenciá smoke test y sanity test. ¿Por qué se recomiendan en la fase de ambiente?

> **Respuesta:**
>
> El smoke es amplio y superficial: verifica que las funciones principales anden para decidir si el build o ambiente se puede probar. El sanity es acotado: verifica que una parte puntual que cambió funcione razonablemente. Se recomiendan en la fase de ambiente porque son rápidos y evitan invertir horas de ejecución en un ambiente mal configurado: si el smoke falla, el problema está en el ambiente o el build y no tiene sentido seguir.

**P4 · REFUTAR.** "La preparación del ambiente de pruebas recién empieza cuando terminó el diseño de los casos." ¿Es correcto?

> **Respuesta:**
>
> No. El material indica que puede iniciar en paralelo con el diseño del test. Tiene sentido porque son actividades independientes: mientras unos escriben casos, otros configuran el ambiente, y así se ahorra tiempo en el calendario.

**P5 · JUSTIFICAR.** ¿En qué fases interviene la RTM y qué rol cumple en cada una?

> **Respuesta:**
>
> Se crea en el diseño del test, una vez que los casos están listos y revisados: vincula cada requisito con sus casos y permite ver si hay requisitos sin cobertura. En la ejecución se actualiza con los resultados y es uno de los entregables: muestra qué requisitos pasaron, cuáles tienen defectos y cuáles no se probaron. Esa información alimenta el cierre.

**P6 · APLICAR A UN CASO.** Durante la ejecución encontrás un defecto y el desarrollador lo corrige. ¿Qué pasos siguen?

> **Respuesta:**
>
> El defecto ya fue reportado en la herramienta de seguimiento. Tras la corrección, se vuelve a ejecutar el caso que falló (re-test) para confirmar la solución; conviene ejecutar pruebas de regresión sobre las áreas relacionadas para confirmar que el cambio no rompió otra cosa. Se actualiza el estado del caso, del defecto (cerrado) y la RTM.

**P7 · COMPARAR.** ¿Qué diferencia hay entre el entregable del análisis de requerimientos y el del diseño del test?

> **Respuesta:**
>
> El análisis entrega *qué* se va a probar: un listado de requerimientos testeables y la evaluación de si conviene automatizar. El diseño entrega *cómo* se va a probar cada cosa: casos de prueba concretos con pasos y resultados esperados, scripts de automatización y datos de prueba.

**P8 · JUSTIFICAR.** ¿Qué aporta la fase de cierre si el software ya fue probado?

> **Respuesta:**
>
> Consolida resultados y métricas finales (casos ejecutados, defectos encontrados y cerrados, cobertura) para que los stakeholders decidan con información si se libera. Además permite registrar lecciones aprendidas y mejorar el proceso en el próximo ciclo, que es la lógica de mejora continua del PDCA.

---

# Clase 5 — Los siete principios del testing (ISTQB)

*Testing de aplicaciones — Clase 5 de 7 · Unidad 2, exposición de experto 2: qué es el ISTQB y sus siete principios. El material original solo trae los títulos de cada principio (el desarrollo estaba en la exposición oral o en imágenes): todo el desarrollo, los ejemplos y las justificaciones son propios, basados en el syllabus ISTQB Foundation Level.*

## 5.1 ¿Qué es el ISTQB?

> **El problema que resuelve**
>
> Cada empresa llamaba distinto a las mismas cosas ("bug", "incidencia", "error"...) y enseñaba testing a su manera. Hacía falta un cuerpo de conocimiento y un vocabulario comunes, reconocidos internacionalmente.

El **ISTQB** (*International Software Testing Qualifications Board*) es una organización sin fines de lucro, fundada en 2002, que define un **esquema internacional de certificaciones** para testers (la más conocida es la **Foundation Level**, CTFL). Publica syllabus y un **glosario estándar** de términos.

Sus **siete principios** son verdades generales sobre el testing, válidas para cualquier proyecto y metodología. Varios ya aparecieron en la Unidad 1 con otro nombre: acá se ordenan.

> **Para el examen — los 7 en orden**
>
> 1\. El testing muestra la presencia de defectos. 2. El testing exhaustivo es imposible. 3. Pruebas tempranas. 4. Agrupación (aglutinación) de defectos. 5. Paradoja del pesticida. 6. El testing depende del contexto. 7. La ausencia de errores es una falacia.

Nota: en el syllabus ISTQB v4.0 (2023) algunos nombres cambian levemente (por ejemplo, la paradoja del pesticida pasa a llamarse "las pruebas se desgastan"), pero el contenido y el orden son los mismos.

## 5.2 Principio 1 — El testing muestra la presencia de defectos

Es la cita de **Dijkstra** de la Clase 1: "el testing sirve para mostrar la presencia de fallos, pero no la ausencia de ellos". Las pruebas pueden demostrar que **hay** defectos; no pueden demostrar que **no hay**. Si no se encuentran defectos, se **reduce la probabilidad** de que queden, pero eso no es una prueba de corrección.

> **Caso aplicado**
>
> Tras una ronda de pruebas con 0 defectos, el informe no debe decir "el sistema no tiene errores" sino "con los 300 casos ejecutados sobre las funciones X, Y, Z no se detectaron fallas". La diferencia es lo que el principio exige.

> **Trampa frecuente**
>
> El material titula el principio "el testing sirve para *demostrar* defectos". No significa que el testing *demuestre corrección* cuando no los encuentra. La asimetría es el punto central.

## 5.3 Principio 2 — El testing exhaustivo no es posible

Probar **todas** las combinaciones de entradas y precondiciones es inviable salvo en casos triviales. Por eso, en vez de intentar probarlo todo, se usan **análisis de riesgo, técnicas de diseño de pruebas y priorización** para elegir qué probar.

> **Ejemplo resuelto — cuánto sería "todo"**
>
> Una función recibe dos enteros de 32 bits.
>
> Combinaciones: 2³² × 2³² = 2⁶⁴ ≈ 1,8 × 10¹⁹.
>
> Supongamos una máquina que ejecuta mil millones (10⁹) de pruebas por segundo:
>
> 1,8 × 10¹⁹ / 10⁹ = 1,8 × 10¹⁰ segundos ≈ 585 años.
>
> **Conclusión:** una función de dos parámetros ya es imposible de probar exhaustivamente. Un sistema real, con estados, secuencias y entornos, está órdenes de magnitud más lejos. Técnicas como **particiones de equivalencia** y **valores límite** reducen esos casos a unos pocos representativos (por ejemplo: negativo, cero, positivo, mínimo, máximo).

> **Trampa frecuente**
>
> Creer que el problema es de recursos ("con más testers se podría"). Es un problema de **crecimiento combinatorio**: ni siquiera con recursos ilimitados se terminaría en un tiempo razonable.

## 5.4 Principio 3 — Pruebas tempranas

Las actividades de prueba deben empezar **lo antes posible** en el ciclo de vida. Los defectos detectados temprano son **más baratos** de corregir y evitan defectos derivados en etapas posteriores. Es la misma idea que Barber y el PDCA (Clase 2), y justifica que el STLC arranque con el análisis de requerimientos (Clase 4). En la versión en inglés se lo conoce como *shift-left*: mover el testing "a la izquierda" de la línea de tiempo.

> **Caso aplicado**
>
> En la revisión de requisitos, el tester nota que "fecha de nacimiento" no especifica si se aceptan fechas futuras. Se aclara en una reunión de 10 minutos. Detectado en producción, hubiera requerido limpiar datos inválidos, corregir código, re-probar y desplegar.

> **Trampa frecuente**
>
> Pensar que "temprano" significa "apenas hay código". Temprano es desde los requisitos, con pruebas **estáticas** (revisiones), antes de que exista código ejecutable.

## 5.5 Principio 4 — Aglutinación (agrupación) de defectos

Los defectos **no se distribuyen de forma pareja**: una pequeña cantidad de módulos suele concentrar la mayoría de los defectos y de las fallas en producción. Se lo asocia con el **principio de Pareto** (aprox. 80% de los defectos en 20% de los módulos; la proporción es orientativa, no exacta). Las causas típicas: módulos más complejos, más modificados, con requisitos más inestables o hechos con más apuro.

**Consecuencia práctica:** los agrupamientos detectados (o predichos) son un insumo del **análisis de riesgo** para concentrar el esfuerzo de prueba ahí.

> **Ejemplo resuelto**
>
> | Módulo | Defectos del último release | % del total |
> | --- | --- | --- |
> | Facturación | 42 | 70% |
> | Usuarios | 8 | 13% |
> | Reportes | 6 | 10% |
> | Catálogo | 4 | 7% |
> | **Total** | **60** | **100%** |
>
> Un módulo de cuatro (25%) concentra el 70% de los defectos. Decisión: en el próximo ciclo, más casos y revisión de código en Facturación, sin abandonar el resto.

> **Trampa frecuente**
>
> Concluir que hay que probar *solo* los módulos problemáticos. Se prioriza, no se excluye: los demás también pueden tener defectos.

## 5.6 Principio 5 — Paradoja del pesticida

Si se repiten **siempre las mismas pruebas**, con el tiempo **dejan de encontrar defectos nuevos**, igual que los insectos se vuelven resistentes a un pesticida usado siempre. Las pruebas encuentran los defectos que pueden encontrar, se corrigen, y a partir de ahí pasan siempre en verde, aunque el sistema tenga defectos en zonas que esos casos no tocan.

**Cómo se combate:** revisar y actualizar periódicamente los casos, agregar casos nuevos, variar datos, sumar pruebas exploratorias.

> **Caso aplicado**
>
> Una suite de 200 pruebas automatizadas pasa en verde hace 6 meses, pero en producción aparecen bugs cada semana. Diagnóstico: paradoja del pesticida. Acción: analizar dónde aparecen los bugs de producción, escribir casos para esas zonas y rotar datos de prueba.

> **Trampa frecuente**
>
> Decir que la paradoja implica que las pruebas de regresión no sirven. La regresión repetida **sí** tiene valor: confirma que lo que andaba sigue andando. Lo que la paradoja dice es que **no alcanza** para encontrar defectos *nuevos*.

## 5.7 Principio 6 — El testing depende del contexto

No hay una única forma correcta de probar: el enfoque, las técnicas, la profundidad y la documentación **dependen del contexto** (tipo de sistema, riesgo, regulaciones, metodología, plazos).

| Criterio | Software de un marcapasos | App de un juego casual |
| --- | --- | --- |
| Riesgo de una falla | Vida de una persona | Mala reseña |
| Documentación | Exhaustiva, auditada, regulada | Liviana |
| Técnicas | Formales, cobertura alta, revisiones independientes | Exploratorias, usabilidad, pruebas en dispositivos |
| Metodología típica | Plan-driven con normas estrictas | Ágil, entregas frecuentes |

> **Trampa frecuente**
>
> Aplicar "la mejor práctica" sin mirar el contexto. Lo que es excelente en un banco puede ser burocracia inútil en una startup, y lo que alcanza en la startup es negligencia en un hospital.

## 5.8 Principio 7 — La ausencia de errores es una falacia

Encontrar y corregir muchos defectos **no garantiza el éxito** del sistema. Un software puede tener cero defectos conocidos y aun así ser **inútil** si no responde a las necesidades del usuario, es difícil de usar o es peor que la competencia. Conecta directamente con **validación** (Clase 2) y con la calidad como valor para una persona (Clase 1).

> **Caso aplicado**
>
> Un sistema de turnos se verifica al 100% contra la especificación, sin defectos abiertos. Pero la especificación asumía que los pacientes usan computadora, y el 80% usa el celular: la web no es responsive. Sin defectos respecto de la especificación, el producto fracasa. Faltó **validación**.

> **Trampa frecuente**
>
> Confundir el principio 7 con el 1. El 1 dice que no se puede *probar* que no hay defectos. El 7 dice que aunque no los hubiera, eso *no alcanza* para que el sistema sea útil.

## 5.9 Síntesis y mapa mental

| \# | Principio | Idea en una línea | Conexión |
| --- | --- | --- | --- |
| 1 | Presencia de defectos | Muestra que hay, no que no hay | Dijkstra (Clase 1) |
| 2 | Exhaustivo imposible | Se prioriza por riesgo y técnica | Complejidad (Clase 1) |
| 3 | Pruebas tempranas | Antes = más barato | Barber, PDCA (Clase 2) |
| 4 | Aglutinación | Pocos módulos, muchos defectos | Análisis de riesgos (Clase 3) |
| 5 | Pesticida | Las mismas pruebas dejan de encontrar | Regresión / exploratorias (Clase 6) |
| 6 | Contexto | No hay una única forma de probar | Tradicional vs. ágil (Clase 7) |
| 7 | Falacia de ausencia de errores | Sin bugs ≠ útil | Validación (Clase 2) |

```text
LÍMITES del testing          ┬─ 1 muestra presencia, no ausencia
                             └─ 2 exhaustivo imposible ─▶ priorizar
DÓNDE / CUÁNDO poner esfuerzo ┬─ 3 temprano
                             └─ 4 donde se agrupan los defectos
CÓMO mantenerlo efectivo      ┬─ 5 renovar pruebas (pesticida)
                             └─ 6 adaptar al contexto
PARA QUÉ                      └─ 7 sin defectos no alcanza: tiene que servir
```

## 5.P Práctica — Clase 5

**P1 · JUSTIFICAR.** ¿Por qué es imposible el testing exhaustivo y qué se hace en su lugar?

> **Respuesta:**
>
> Porque el número de combinaciones de entradas, estados y entornos crece de forma combinatoria: una sola función con dos enteros de 32 bits tiene unas 1,8×10¹⁹ combinaciones, que a mil millones de pruebas por segundo llevarían unos 585 años. En su lugar se usa análisis de riesgo, priorización y técnicas de diseño (particiones de equivalencia, valores límite) para elegir un subconjunto representativo.

**P2 · COMPARAR.** Diferenciá el principio 1 (presencia de defectos) del principio 7 (falacia de la ausencia de errores).

> **Respuesta:**
>
> El 1 es un límite de lo que el testing puede demostrar: si no encuentra defectos, no prueba que no los haya. El 7 va más allá: aunque el sistema efectivamente no tuviera defectos, podría no servir, porque no responde a las necesidades del usuario. El 1 habla de verificación y certeza; el 7, de validación y valor.

**P3 · APLICAR A UN CASO.** Una suite automatizada pasa en verde hace meses pero siguen apareciendo bugs en producción. ¿Qué principio explica esto y qué harías?

> **Respuesta:**
>
> La paradoja del pesticida: repetir siempre las mismas pruebas hace que dejen de encontrar defectos nuevos. Haría: analizar dónde aparecen los bugs de producción, agregar casos que cubran esas zonas, variar datos de prueba, revisar casos obsoletos y sumar sesiones de pruebas exploratorias. La suite actual se mantiene como regresión.

**P4 · REFUTAR.** "Como los defectos se agrupan, alcanza con probar los módulos que históricamente fallan." Refutá.

> **Respuesta:**
>
> La aglutinación sirve para priorizar, no para excluir. Los demás módulos también pueden tener defectos, y si se dejan de probar, por la paradoja del pesticida y por los cambios nuevos, pueden acumular problemas sin que nadie los vea. Además, los agrupamientos cambian con el tiempo según qué se modifica.

**P5 · APLICAR A UN CASO.** Tu equipo pasa de desarrollar una app de delivery a un sistema de control de dosis en un hospital. ¿Qué principio te obliga a cambiar el enfoque de pruebas y cómo?

> **Respuesta:**
>
> El principio 6, el testing depende del contexto. En el hospital el riesgo de una falla es la salud de una persona: hay que aumentar la cobertura, documentar formalmente, hacer revisiones independientes, cumplir regulaciones y usar técnicas más rigurosas. En la app de delivery alcanzaba con un enfoque más liviano, exploratorio y centrado en usabilidad.

**P6 · JUSTIFICAR.** ¿Qué relación hay entre el principio 3 y el costo de corregir defectos?

> **Respuesta:**
>
> Cuanto más tarde se detecta un defecto, más trabajo hay construido sobre él (diseño, código, pruebas, documentación, despliegue), y todo eso hay que rehacerlo. Probar temprano, incluso con revisiones estáticas de requisitos y diseño, encuentra los defectos cuando corregirlos es barato y evita defectos derivados en etapas posteriores.

**P7 · APLICAR A UN CASO.** Un producto se entrega sin defectos abiertos y los usuarios lo abandonan en un mes. ¿Qué principio aplica y qué faltó?

> **Respuesta:**
>
> El principio 7, la ausencia de errores es una falacia. Faltó validación: comprobar con usuarios reales que el producto resolvía sus necesidades y era usable (pruebas de aceptación, de usabilidad, prototipos). No tener defectos respecto de la especificación no garantiza que la especificación represente lo que el usuario necesita.

**P8 · JUSTIFICAR.** ¿Qué es el ISTQB y por qué es útil que exista un conjunto común de principios y vocabulario?

> **Respuesta:**
>
> Es el International Software Testing Qualifications Board, organización que define un esquema internacional de certificaciones para testers y publica syllabus y un glosario estándar. Un vocabulario común evita malentendidos (por ejemplo, error vs. defecto vs. falla), facilita trabajar entre empresas y países, y los principios dan criterios generales válidos para cualquier proyecto.

---

# Clase 6 — Tipos de pruebas y etapas de desarrollo

*Testing de aplicaciones — Clase 6 de 7 · Unidad 2, exposición de experto 3: pruebas funcionales vs. no funcionales, catálogo de tipos de prueba, otras agrupaciones (manual/automática y niveles) y la relación con las etapas. Material original en formato slides (el material solo lista los nombres de cada tipo) — completado con definiciones y ejemplos propios para hacerlo autocontenido.*

## 6.1 Funcionales vs. no funcionales

> **El problema que resuelve**
>
> "Probar el sistema" es demasiado amplio. Un sistema puede calcular bien una factura y tardar 40 segundos en hacerlo, o ser rapidísimo y calcular mal. Hace falta separar *qué hace* de *cómo lo hace* para no dejar huecos.

La división básica del material se hace con una pregunta: **¿estamos probando la funcionalidad del producto?** Si la respuesta es sí, son **pruebas funcionales**; si no, son **no funcionales**.

| Criterio | Pruebas funcionales | Pruebas no funcionales |
| --- | --- | --- |
| Pregunta | **¿Qué** hace el sistema? ¿Hace lo especificado? | **¿Cómo** lo hace? ¿Con qué calidad? |
| Base de comparación | Especificación de requerimientos funcionales | Requisitos no funcionales / atributos de calidad (Clase 1) |
| Foco (material) | Desvíos entre lo que el sistema hace y lo especificado; no importa *cómo* se procesa, sino si satisface las expectativas mínimas del usuario | Calidad, seguridad, rendimiento, accesibilidad y usabilidad |
| Ejemplo | "Al pagar \$10.000 se aplica 10% de descuento" | "El checkout responde en \< 2 s con 1.000 usuarios" |

> **Precisión sobre el material**
>
> La síntesis dice que las no funcionales hacen foco en "la calidad, seguridad o rendimiento **del código fuente**". Las pruebas no funcionales evalúan atributos **del sistema en funcionamiento** (tiempos de respuesta, resistencia a ataques, recuperación), no del código fuente en sí. La calidad del código se evalúa con revisiones y análisis estático (Clase 3 de la Unidad 1). Además, el texto extraído del diagrama de decisión aparece desordenado; la pregunta correcta es la del párrafo de arriba.

> **Para el examen**
>
> **Funcionales:** detectan desvíos entre lo que el sistema hace y lo especificado (el *qué*). **No funcionales:** evalúan calidad, seguridad, rendimiento, accesibilidad y usabilidad (el *cómo*).

> **Trampa frecuente**
>
> Pensar que las no funcionales son "menos importantes". Un home banking que calcula bien pero se cae en fin de mes o filtra datos fracasa igual.

## 6.2 Catálogo de tipos de prueba

El material lista los tipos en dos columnas sin definirlos. Esta es la agrupación habitual de esos tipos (7 funcionales y 6 no funcionales, coherente con las dos columnas del material), con su definición.

### Funcionales

| Tipo | Qué es | Ejemplo |
| --- | --- | --- |
| **Exploratorias** | Se diseñan y ejecutan a la vez, aprendiendo del sistema mientras se prueba, guiadas por un objetivo (charter) y un tiempo acotado | "Durante 60 min, explorar el alta de usuarios buscando problemas con datos raros" |
| **De regresión** | Re-ejecutan pruebas existentes tras un cambio para confirmar que lo que andaba sigue andando | Tras corregir el descuento, correr toda la suite de checkout |
| **Libres (free testing)** | Sin guion ni objetivo formal; el tester usa el sistema libremente con su experiencia | Usar la app como un usuario cualquiera buscando cosas raras |
| **Estructurales** | Diseñadas a partir de la estructura interna del código (caja blanca): caminos, decisiones, cobertura | Un caso por cada rama de un `if/else` |
| **De humo (smoke)** | Chequeo rápido y amplio de las funciones principales para decidir si vale la pena seguir probando | ¿Levanta la app, se puede loguear, abre el catálogo? |
| **Del mono (monkey)** | Entradas aleatorias, sin conocer el sistema, para ver si se rompe | Herramienta que toca la pantalla al azar 10.000 veces |
| **De sanidad (sanity)** | Chequeo acotado de que un área puntual que cambió funciona razonablemente | Tras un fix en el login, verificar login y logout |

### No funcionales

| Tipo | Qué evalúa | Ejemplo |
| --- | --- | --- |
| **De carga o rendimiento** | Tiempos de respuesta y comportamiento bajo carga esperada o extrema (estrés) | Simular 5.000 usuarios en un Hot Sale |
| **De recuperación / vuelta atrás** | Capacidad de recuperarse de fallas y de revertir cambios (rollback) sin perder datos | Cortar la base de datos durante una transacción y ver si queda consistente |
| **De compatibilidad de entorno** | Funcionamiento en distintos navegadores, SO, dispositivos | Probar en Chrome, Safari, Android e iOS |
| **De instalación** | Que se instale, actualice y desinstale correctamente | Actualizar de v1.2 a v2.0 conservando datos |
| **De configuración** | Comportamiento con distintas configuraciones de software/hardware/parámetros | Probar con idioma inglés, zona horaria UTC y 2 GB de RAM |
| **De seguridad** | Protección frente a accesos no autorizados y ataques | Intentar inyección SQL en el login |

> **Trampas frecuentes**
>
> **1)** Confundir **exploratorias** con **libres**: las exploratorias tienen objetivo, tiempo y registro; las libres no. **2)** Confundir **smoke** (amplio, superficial, "¿sigo probando?") con **sanity** (acotado a un cambio). **3)** Confundir **regresión** con **re-test**: el re-test verifica que *el defecto corregido* ya no está; la regresión verifica que la corrección *no rompió otra cosa*. **4)** Las estructurales se clasifican con las funcionales en esta lista, pero en rigor "estructural" (caja blanca) describe *cómo se diseñan* los casos, no *qué* se evalúa.

> **Caso aplicado**
>
> Llega un nuevo build con un fix en el cálculo de envío, a dos días del lanzamiento. ¿Qué tipos de prueba y en qué orden?
>
> **1. Smoke** → ¿el build se puede probar? Si falla, se devuelve. **2. Sanity / re-test** del cálculo de envío → ¿el fix funciona? **3. Regresión** del checkout → ¿rompió algo cercano? **4. Rendimiento** → el lanzamiento va a tener picos. **5. Exploratoria** acotada si queda tiempo. No hace falta monkey testing ni instalación: el riesgo está en otro lado (principio 6, contexto).

## 6.3 Otras agrupaciones de pruebas

### Manuales vs. automáticas

| Criterio | Manuales | Automáticas |
| --- | --- | --- |
| Quién ejecuta | Una persona | Un script / herramienta |
| Costo inicial | Bajo | Alto (escribir y mantener scripts) |
| Costo por repetición | Alto | Muy bajo |
| Conviene para | Exploratorias, usabilidad, funciones que cambian mucho, pruebas únicas | Regresión, smoke, carga, casos repetitivos y estables |
| Aporta | Criterio humano, detecta lo inesperado | Velocidad, repetibilidad, ejecución continua |

> **Trampa frecuente**
>
> "Automatizar todo es lo mejor". No: automatizar pruebas que cambian cada semana cuesta más en mantenimiento de lo que ahorra, y la automatización no reemplaza el juicio humano en usabilidad o exploración. Por eso el STLC evalúa la **factibilidad de automatización** en el análisis (Clase 4).

### Niveles de prueba

Agrupan las pruebas según **qué tamaño de pieza** se prueba. Van de lo más chico a lo más grande:

| Nivel | Qué se prueba | Quién suele hacerlo | Contra qué se compara | Ejemplo |
| --- | --- | --- | --- | --- |
| **Unitarias** | Una unidad aislada (función, clase) | Desarrollador | Diseño detallado / código | `calcular_descuento(10000) == 9000` |
| **De integración** | La interacción entre componentes | Desarrolladores / testers | Diseño de arquitectura, interfaces | El carrito envía bien el total al módulo de pagos |
| **De sistema** | El sistema completo, de punta a punta | Equipo de testing | Requisitos del sistema (funcionales y no funcionales) | Compra completa, desde login hasta email de confirmación |
| **De aceptación** | Si el sistema sirve para el cliente | Cliente / usuarios | Necesidades del negocio | El área comercial confirma que puede operar la campaña |

Relación con la Unidad 1: las tres primeras son sobre todo **verificación**; la de aceptación es la forma más directa de **validación**.

> **Ejemplo resuelto — prueba unitaria**
>
> ```python
> def calcular_descuento(total):
>     return total * 0.9 if total >= 10000 else total
>
> def test_limite_inferior():   # valor justo debajo del límite
>     assert calcular_descuento(9999) == 9999
>
> def test_en_el_limite():      # valor límite exacto: acá estaba el defecto de la Clase 2
>     assert calcular_descuento(10000) == 9000
>
> def test_por_encima():
>     assert calcular_descuento(20000) == 18000
> ```
>
> Es **unitaria** (una sola función aislada), **funcional** (verifica qué hace, no cuán rápido), **automática** (la corre una herramienta como pytest) y se diseñó con **valores límite**. Al quedar automatizada, sirve después como **regresión**. Un mismo test pertenece a varias agrupaciones a la vez: las clasificaciones no son excluyentes.

## 6.4 Las pruebas y las etapas de desarrollo

El material vuelve sobre las etapas del proceso de pruebas: **1. Análisis de requisitos, 2. Planificación, 3. Diseño, 4. Ejecución, 5. Cierre** (es el STLC de la Clase 4, con la preparación del ambiente incluida dentro de las otras). La idea clave de la síntesis: **cada etapa del desarrollo está ligada a distintos tipos de prueba**, y es una **mala práctica probar solo al finalizar** una etapa o el proyecto.

La relación etapa ↔ nivel de prueba se suele representar con el **modelo en V** (contenido canónico, no está en las slides): cada etapa de construcción tiene enfrente el nivel de prueba que la verifica, y esas pruebas se **diseñan** en el momento en que se produce la etapa, aunque se ejecuten después.

| Etapa de desarrollo | Nivel de prueba asociado | Qué se puede hacer ya en esa etapa |
| --- | --- | --- |
| Requisitos del negocio / usuario | Aceptación | Revisar requisitos; escribir criterios de aceptación |
| Especificación del sistema | Sistema | Diseñar casos de sistema; definir requisitos no funcionales medibles |
| Diseño de arquitectura | Integración | Revisar interfaces; planificar la integración |
| Diseño detallado / codificación | Unitarias | Revisión de código; escribir pruebas unitarias |

> **Para el examen**
>
> Cada etapa del desarrollo tiene pruebas asociadas; probar solo al final es mala práctica (conecta con Barber, PDCA y el principio 3 de pruebas tempranas).

## 6.5 Síntesis y mapa mental

```text
TIPOS DE PRUEBA
 ├─ Por QUÉ se evalúa
 │   ├─ Funcionales (¿qué hace?): exploratorias · regresión · libres · estructurales · humo · mono · sanidad
 │   └─ No funcionales (¿cómo?): carga/rendimiento · recuperación · compatibilidad · instalación · configuración · seguridad
 ├─ Por QUIÉN ejecuta: manuales · automáticas
 └─ Por NIVEL (tamaño): unitarias → integración → sistema → aceptación
                          (verificación ………………………………▶ validación)
ETAPAS: cada etapa del desarrollo ↔ un nivel de prueba (modelo V) → nunca solo al final
Conexiones: atributos de calidad (Clase 1) · smoke/sanity y ambiente (Clase 4) · pesticida y regresión (Clase 5)
```

## 6.P Práctica — Clase 6

**P1 · COMPARAR.** Diferenciá pruebas funcionales y no funcionales y clasificá: (a) verificar que un usuario bloqueado no pueda loguearse; (b) verificar que el login responda en menos de 1 s con 2.000 usuarios; (c) intentar una inyección SQL en el login.

> **Respuesta:**
>
> Las funcionales verifican que el sistema haga lo especificado (el qué); las no funcionales, atributos de calidad como rendimiento o seguridad (el cómo). (a) Funcional: es una regla de negocio especificada. (b) No funcional, de carga/rendimiento. (c) No funcional, de seguridad. Nota: (a) tiene que ver con el acceso, pero como verifica una regla funcional definida en los requisitos, se considera funcional.

**P2 · COMPARAR.** ¿Qué diferencia hay entre prueba de regresión y re-test? ¿Y entre smoke y sanity?

> **Respuesta:**
>
> El re-test vuelve a ejecutar el caso que falló para confirmar que el defecto se corrigió; la regresión re-ejecuta pruebas de otras áreas para confirmar que el cambio no rompió nada que antes funcionaba. El smoke es un chequeo amplio y superficial de las funciones principales para decidir si un build se puede probar; el sanity es un chequeo acotado sobre el área que cambió.

**P3 · APLICAR A UN CASO.** ¿Automatizarías las pruebas de una pantalla que el equipo de diseño rediseña cada sprint? ¿Y el cálculo de impuestos, estable hace dos años?

> **Respuesta:**
>
> La pantalla que cambia cada sprint, no (o solo lo mínimo): los scripts se romperían constantemente y el mantenimiento superaría el ahorro; conviene probarla manualmente y con exploratorias. El cálculo de impuestos, sí: es estable, repetitivo, crítico y se beneficia de correrse en cada regresión, así que el costo inicial se amortiza rápido.

**P4 · JUSTIFICAR.** Ordená los niveles de prueba y explicá cuál se relaciona más con la validación y por qué.

> **Respuesta:**
>
> Unitarias → integración → sistema → aceptación. La de aceptación es la más ligada a la validación porque la realizan el cliente o los usuarios y compara el sistema contra sus necesidades reales de negocio, respondiendo "¿construimos el producto correcto?". Las anteriores comparan contra diseño o especificación, es decir, verifican.

**P5 · REFUTAR.** "Las pruebas exploratorias y el free testing son lo mismo: probar sin guion." Refutá.

> **Respuesta:**
>
> No son lo mismo. Las exploratorias diseñan y ejecutan a la vez, pero tienen un objetivo (charter), un tiempo acotado y se registra lo que se hizo y encontró; son una técnica disciplinada. El free testing no tiene objetivo ni estructura formal: el tester usa el sistema libremente según su experiencia.

**P6 · APLICAR A UN CASO.** Un e-commerce se prepara para Black Friday. Elegí tres tipos de prueba no funcionales prioritarios y justificá.

> **Respuesta:**
>
> \(1\) Carga/rendimiento: se esperan picos muy superiores al tráfico normal; hay que saber si el sistema los soporta y con qué tiempos. (2) Recuperación: si un servicio cae en pleno pico, el sistema debe recuperarse sin perder pedidos ni cobrar dos veces. (3) Seguridad: los eventos de alto tráfico atraen fraude y ataques, y se manejan datos de pago. Compatibilidad también suma (mucho tráfico móvil), pero es menos crítica que las anteriores.

**P7 · JUSTIFICAR.** ¿Por qué el material dice que es mala práctica probar solo al finalizar una etapa o proyecto? Relacionalo con al menos dos temas anteriores.

> **Respuesta:**
>
> Porque cada etapa tiene pruebas asociadas que conviene diseñar y ejecutar mientras se trabaja en ella (modelo V): así los defectos se detectan donde se originan. Se relaciona con Barber (probar al final es como el examen de sangre al muerto), con el ciclo PDCA (probar en cada iteración) y con el principio 3 del ISTQB (pruebas tempranas son más baratas).

**P8 · APLICAR A UN CASO.** Clasificá un test automatizado que verifica, con pytest, que la función `validar_cuit()` rechaza un CUIT con dígito verificador incorrecto, según las tres agrupaciones vistas.

> **Respuesta:**
>
> Por qué evalúa: funcional (verifica una regla especificada). Por quién ejecuta: automática. Por nivel: unitaria (una función aislada). Una vez en la suite, además, sirve como prueba de regresión. Las agrupaciones no son excluyentes.

---

# Clase 7 — Testing tradicional vs. agile

*Testing de aplicaciones — Clase 7 de 7 · Unidad 2, exposición de experto 4: testing en cascada vs. testing ágil, ventajas y desventajas de las metodologías ágiles, y cómo se prueba en Scrum, Kanban y XP. Material original en formato slides (las comparaciones centrales eran imágenes) — completado con desarrollo propio para hacerlo autocontenido.*

## 7.1 Testing tradicional vs. testing ágil

> **El problema que resuelve**
>
> Toda la Unidad 1 insistió en probar temprano y de forma continua. El modelo en cascada, por diseño, deja el testing para una etapa tardía. Las metodologías ágiles cambian la organización del trabajo para que las pruebas estén en cada iteración.

### Testing tradicional (en cascada)

Enfoque **secuencial**: requisitos → diseño → implementación → **pruebas** → despliegue. Cada etapa se cierra antes de pasar a la siguiente. El testing se ejecuta en **etapas tardías** y funciona como una **revisión final** cuando el software ya está terminado. Es exactamente la situación que critica la frase de Barber (Clase 2).

### Testing ágil

Enfoque orientado a la **flexibilidad y la colaboración**. Las pruebas se integran **a lo largo de todo el ciclo**, en **iteraciones cortas y frecuentes**, lo que permite **detección temprana** de errores y **adaptación** a los cambios. El tester forma parte del equipo desde el inicio de cada iteración.

| Criterio | Tradicional (cascada) | Ágil |
| --- | --- | --- |
| Momento del testing | Fase separada, al final | Continuo, dentro de cada iteración |
| Detección de defectos | Tardía → más cara | Temprana → más barata |
| Cambios en requisitos | Costosos; se intentan congelar | Se esperan y se incorporan |
| Documentación | Extensa y formal (planes, especificaciones) | Liviana, la necesaria |
| Rol del tester | Equipo separado que recibe el producto terminado | Integrante del equipo, colabora con devs y cliente |
| Relación con el cliente | Al principio (requisitos) y al final (entrega) | Continua, con feedback en cada iteración |
| Automatización | Deseable | Prácticamente necesaria (la regresión se corre en cada iteración) |
| Conviene cuando | Requisitos estables, contexto regulado, contratos cerrados | Requisitos cambiantes, necesidad de entregar valor rápido |

### Contexto: el Manifiesto Ágil

La bibliografía de la clase remite al **Manifiesto Ágil** (2001). Sus cuatro valores: **individuos e interacciones** sobre procesos y herramientas; **software funcionando** sobre documentación extensiva; **colaboración con el cliente** sobre negociación contractual; **respuesta ante el cambio** sobre seguir un plan. "Sobre" no significa "en lugar de": lo de la derecha tiene valor, pero se valora más lo de la izquierda.

> **Para el examen**
>
> Tradicional: **secuencial**, testing en etapas **tardías**, como revisión final. Ágil: **flexible y colaborativo**, pruebas **integradas en iteraciones cortas**, detección temprana y adaptación al cambio. Lo ágil es un **cambio de paradigma** en el ciclo de vida, la organización de los equipos y la gestión de la calidad.

> **Trampa frecuente**
>
> Decir que "en ágil no hay documentación" o "no hay planificación". Hay ambas, pero livianas y continuas. Y no es cierto que ágil sea siempre mejor: por el principio 6 del ISTQB (contexto), un proyecto regulado con requisitos fijos puede justificar un enfoque tradicional.

## 7.2 Ventajas y desventajas de las metodologías ágiles

| Ventajas | Desventajas |
| --- | --- |
| Divide el proyecto en etapas para focalizar el trabajo | Al principio es difícil estimar con precisión tiempos y costos |
| Mayor adaptabilidad a medida que avanza el proyecto | Requiere sí o sí un equipo de alto desempeño, con base sólida de habilidades |
| Facilita reorganizar objetivos | Exige un alto nivel de interacción (en el equipo y con el cliente) |
| Permite identificar las tareas más importantes | La poca documentación dificulta el ingreso de nuevos miembros |
| Es más transparente | Riesgo de expansión descontrolada del alcance si no hay límites claros |
| Identificar errores se vuelve más sencillo |  |
| Más retroalimentación y flexibilidad |  |
| Estrecha la relación entre equipo y cliente |  |

El material aclara algo importante: **la mayoría de los problemas con las metodologías ágiles se deben a no entenderlas o a no querer seguirlas**, más que a la metodología en sí. Por ejemplo, un equipo que hace "sprints" pero no tiene al cliente disponible para dar feedback no está siendo ágil: está haciendo cascada en pedacitos.

> **Caso aplicado**
>
> Un organismo público licita un sistema con precio y plazo cerrados, y el pliego exige documentación formal completa antes de empezar.  
> **Análisis:** dos desventajas ágiles pegan fuerte (difícil estimar costo/tiempo al inicio; poca documentación) y la interacción con el cliente es limitada. Un enfoque tradicional, o un híbrido con iteraciones internas de prueba, encaja mejor. Una startup con un producto que pivotea cada mes es el caso opuesto.

## 7.3 Scrum, Kanban y XP

### Scrum

Se organiza en ciclos de duración fija llamados **sprints** (típicamente 1 a 4 semanas) y busca maximizar el tiempo de desarrollo del producto. Se usa sobre todo en desarrollo de software, pero también en otros contextos empresariales. Todos los días hay una reunión de **15 minutos**, la **daily** (scrum diario), para sincronizar actividades y planificar la jornada.

**Testing en Scrum** (agregado propio): las pruebas se hacen *dentro* del sprint; una historia no está terminada si no está probada (se suele incluir en la *Definition of Done*). El tester participa en la planificación del sprint para definir criterios de aceptación.

### Kanban

Ligado al concepto **just-in-time**. Todo se ve en un **tablero dividido en columnas** que representan el flujo (por ejemplo: Por hacer → En desarrollo → En prueba → Hecho). Cada tarea es una **tarjeta** que avanza por las columnas. Requiere **comunicación y transparencia** para que todos sepan en qué fase está cada cosa. Permite **limitar el trabajo en curso** (WIP) y se centra en el **tiempo de ciclo** (desde que algo se pide hasta que se entrega).

**Testing en Kanban** (agregado propio): "En prueba" suele ser una columna del tablero. Con límite de WIP, si esa columna se llena, el equipo deja de empezar tareas nuevas y ayuda a probar: el cuello de botella se hace visible.

### Extreme Programming (XP)

Se basa en los valores de **comunicación, simplicidad, feedback, valor agregado y respeto**, y pone la **satisfacción del cliente** por encima de todo. Da confianza a los desarrolladores para **aceptar cambios en los requisitos** aunque lleguen tarde. El trabajo en equipo es central: los problemas los resuelve todo el equipo (gestores, desarrolladores, clientes). Y lo más relevante para esta materia: **el software se prueba desde el primer día**.

**Testing en XP** (canónico): prácticas como **TDD** (escribir la prueba antes del código), **integración continua**, **programación en pares** (revisión de código constante) y **pruebas de aceptación** definidas con el cliente.

### Comparación

| Criterio | Scrum | Kanban | XP |
| --- | --- | --- | --- |
| Unidad de organización | Sprints de duración fija | Flujo continuo en tablero | Iteraciones cortas + prácticas técnicas |
| Foco | Gestión del trabajo y del equipo | Visualizar y optimizar el flujo | Excelencia técnica y calidad del código |
| Ventajas | Motivación; transparencia; foco constante en la calidad (menos errores); se pueden reorganizar prioridades | Se ven todas las tareas; se limita el trabajo en curso; foco en el tiempo de ciclo; entregas continuas | Código simple y mejorable en cualquier momento; proceso visible con resultados rápidos; más ágil por las pruebas constantes; potencia y retiene talento |
| Desventajas | Segmentar puede hacer perder de vista el conjunto; el rol de cada desarrollador puede no estar claro | Información del tablero malinterpretada u obsoleta; sin plazos pueden aparecer retrasos en las etapas | Puede restar importancia al diseño; funciona peor si el equipo no es presencial; no siempre se registran los errores, y pueden repetirse |
| Dónde vive el testing | Dentro de cada sprint (Definition of Done) | Columna del tablero, con límite de WIP | Desde el día 1: TDD, integración continua, pares |

> **Precisiones sobre el material**
>
> **Scrum:** la desventaja "el rol de cada desarrollador puede no estar bien definido" es una percepción frecuente, pero la Guía Scrum sí define tres responsabilidades (Product Owner, Scrum Master y Developers); lo que no define son subroles dentro de los Developers. **Kanban:** "no hay plazos" significa que no hay iteraciones de duración fija; un equipo Kanban igual puede tener fechas de entrega y acuerdos de tiempo de servicio.

> **Caso aplicado — ¿cuál elegir?**
>
> | Escenario | Elección | Por qué, y por qué no las otras |
> | --- | --- | --- |
> | Equipo de soporte que recibe incidencias todo el tiempo, sin poder planificar dos semanas | **Kanban** | Flujo continuo y entregas continuas. Scrum obliga a comprometer un sprint que se rompería con cada urgencia. |
> | Producto nuevo con un Product Owner disponible y funcionalidades que se priorizan periódicamente | **Scrum** | Sprints con objetivo claro y revisión frecuente con el cliente. Kanban funcionaría, pero pierde el ritmo de planificación y revisión. |
> | Módulo financiero donde un error de cálculo es muy costoso, con equipo presencial y cliente cercano | **XP** | TDD y programación en pares atacan la calidad técnica desde el día 1. Scrum no prescribe prácticas técnicas. |
>
> En la práctica se combinan (por ejemplo, Scrum para gestionar + prácticas de XP para la calidad).

> **Trampa frecuente**
>
> Tratar Scrum, Kanban y XP como equivalentes. Scrum y Kanban son marcos de **gestión** del trabajo; XP es sobre todo un conjunto de **prácticas de ingeniería**. Por eso se pueden combinar.

## 7.4 Síntesis y mapa mental

Las metodologías ágiles son un **cambio de paradigma** en el ciclo de vida, la organización de los equipos y la gestión de la calidad. Scrum, Kanban y XP comparten el foco en **dividir el proyecto en etapas**, la **detección temprana** de incidencias, la **transparencia** y la **relación entre equipo y cliente**.

```text
TESTING
 ├─ Tradicional (cascada): secuencial → pruebas al final → revisión final → defectos caros
 └─ Ágil: iteraciones cortas → pruebas continuas → detección temprana → adaptación
      ├─ + divide, adapta, transparenta, feedback, cercanía con el cliente
      ├─ − estimación inicial difícil, equipo de alto nivel, mucha interacción, poca doc, alcance que crece
      ├─ Scrum  → sprints + daily 15' → testing dentro del sprint
      ├─ Kanban → tablero + WIP + just-in-time → testing como columna del flujo
      └─ XP     → valores + prueba desde el día 1 → TDD, CI, pares
Conexiones: Barber y PDCA (Clase 2) · pruebas tempranas y contexto (Clase 5) · automatización y regresión (Clase 6)
```

## 7.P Práctica — Clase 7

**P1 · COMPARAR.** Compará el testing tradicional y el ágil en cuanto a momento de las pruebas, costo de los defectos y manejo de cambios.

> **Respuesta:**
>
> En el tradicional las pruebas son una fase tardía, una revisión final sobre el software terminado; los defectos aparecen tarde y son caros, y los cambios de requisitos son costosos porque obligan a rehacer etapas cerradas. En el ágil las pruebas se integran en cada iteración corta; los defectos se detectan temprano y son más baratos, y los cambios se esperan e incorporan en la siguiente iteración.

**P2 · REFUTAR.** "Las metodologías ágiles fracasan porque son desordenadas." ¿Qué dice el material?

> **Respuesta:**
>
> El material señala que la mayoría de los errores con metodologías ágiles se deben a no comprenderlas o a no querer seguirlas, no a la metodología. Las ágiles tienen estructura (sprints, dailies, tableros, límites de WIP, prácticas como TDD); lo que tienen es menos documentación formal y más adaptación, lo cual exige disciplina y un equipo de alto desempeño.

**P3 · APLICAR A UN CASO.** Un equipo de mantenimiento recibe pedidos urgentes de forma impredecible. ¿Scrum o Kanban? Justificá y explicá cómo se ubicaría el testing.

> **Respuesta:**
>
> Kanban: trabaja con flujo continuo y entregas continuas, sin comprometer un alcance fijo por sprint que las urgencias romperían. El testing sería una columna del tablero ("En prueba") con límite de WIP: si se acumulan tarjetas ahí, el equipo deja de empezar tareas nuevas y ayuda a probar, lo que hace visible el cuello de botella.

**P4 · JUSTIFICAR.** ¿Por qué en un equipo ágil la automatización de pruebas es prácticamente necesaria?

> **Respuesta:**
>
> Porque se entrega en iteraciones cortas y frecuentes, y en cada una hay que confirmar que lo nuevo no rompió lo anterior (regresión). Hacer esa regresión a mano cada dos semanas se vuelve inviable a medida que el producto crece. Automatizarla permite correrla en cada cambio (integración continua) y liberar tiempo humano para pruebas exploratorias y de usabilidad.

**P5 · COMPARAR.** Mencioná una ventaja y una desventaja de Scrum, Kanban y XP.

> **Respuesta:**
>
> Scrum: ventaja, transparencia y foco constante en la calidad; desventaja, la segmentación puede hacer perder de vista el conjunto del proyecto. Kanban: ventaja, permite ver todas las tareas y limitar el trabajo en curso; desventaja, la información del tablero puede quedar obsoleta o malinterpretarse, y sin plazos pueden aparecer retrasos. XP: ventaja, pruebas constantes desde el día 1 y código simple y mejorable; desventaja, puede restar importancia al diseño y funciona peor con equipos no presenciales.

**P6 · APLICAR A UN CASO.** Un proyecto para un organismo regulador exige documentación completa y aprobada antes de programar, con requisitos fijos por contrato. ¿Recomendarías un enfoque ágil puro? Relacionalo con un principio del ISTQB.

> **Respuesta:**
>
> No necesariamente. Por el principio 6 (el testing depende del contexto), el enfoque debe ajustarse al proyecto: requisitos estables, documentación obligatoria y poca interacción con el cliente juegan en contra de las ventajas ágiles y activan sus desventajas. Un enfoque tradicional o un híbrido (documentación formal para cumplir, pero pruebas continuas e iteraciones internas para detectar defectos temprano) encaja mejor.

**P7 · REFUTAR.** "Scrum, Kanban y XP son alternativas excluyentes: hay que elegir una." Refutá.

> **Respuesta:**
>
> No son excluyentes porque atacan cosas distintas. Scrum y Kanban organizan y gestionan el trabajo; XP propone prácticas de ingeniería (TDD, programación en pares, integración continua). Es muy común gestionar con Scrum o Kanban y aplicar prácticas de XP para asegurar la calidad técnica, e incluso combinar Scrum con un tablero Kanban.

**P8 · JUSTIFICAR.** ¿En qué sentido las metodologías ágiles son un "cambio de paradigma" respecto de la gestión de la calidad?

> **Respuesta:**
>
> En el modelo tradicional la calidad se controla al final, por un equipo separado, como revisión del producto terminado. En ágil la calidad es responsabilidad de todo el equipo, se construye y verifica en cada iteración, con el tester integrado y el cliente dando feedback continuo. Pasa de un control final a una práctica continua y compartida, en línea con el ciclo PDCA y con probar temprano.
