# Entrega 2 · Especificación de casos de prueba (V2) · Deudas y Navegación

Planilla: `02-especificacion-casos-v2.xlsx` (una hoja por caso, mismo formato que la Entrega 1: ID, prioridad, técnica, trazabilidad, pre-requisitos, datos de prueba, pasos y resultado esperado). Alcance de este documento: **CP-DEU-018 a CP-DEU-029** (Deudas y gastos compartidos, US-34 · CA-8) y **CP-NAV-001 a CP-NAV-085** (Navegación e interfaz, US-69 y US-70): **98 casos**.

Los casos salen de [`entrega-2/casos/deu.md`](casos/deu.md) y [`entrega-2/casos/nav.md`](casos/nav.md). Acá los pre-requisitos y los pasos están redactados **en lenguaje simple**, con lo que hay que tocar en la aplicación y lo que se tendría que ver. Para los casos de Deudas 018 a 028, que en su versión original son llamadas directas a la API (función de varias personas de US-82, todavía no implementada), se describe la **prueba equivalente en la pantalla de Registrar** (caso gemelo), y la prueba original queda anotada en «Notas del diseño».

## Cómo leer un caso

- **Pre-requisitos:** todo lo que tiene que estar listo antes del paso 1 (usuario, cuentas, categorías, gastos cargados, ancho de pantalla, herramientas).
- **Datos de prueba:** los valores exactos que se escriben.
- **Pasos y resultado esperado:** cada paso dice qué hacer y qué se tiene que ver; si se ve otra cosa, el caso falla.
- Cada caso usa **su propio usuario de prueba** (`qa+<id del caso>-001@example.com`, contraseña `Clave123!`): ningún caso depende de datos de otro.

## Índice

| ID | Prioridad | Título | User story | Camino feliz | Tipo | Técnica |
|---|---|---|---|---|---|---|
| CP-DEU-018 | Alta | No se puede compartir un gasto si falta cuánto te deben | US-34, US-82 | No | Negativo | Partición de equivalencia |
| CP-DEU-019 | Alta | No se puede compartir un gasto si falta con quién | US-34, US-82 | No | Negativo | Partición de equivalencia |
| CP-DEU-020 | Alta | Un ingreso no se puede compartir | US-34, US-82 | No | Negativo | Partición de equivalencia |
| CP-DEU-020B | Alta | Un ingreso repartido entre 11 personas tampoco se puede compartir | US-82 | No | Negativo | Tabla de decisión |
| CP-DEU-021 | Alta | El nombre hecho solo de espacios no cuenta como nombre | US-34, US-82 | No | Negativo | Partición de equivalencia |
| CP-DEU-022 | Media | El nombre hecho solo de una tabulación no cuenta como nombre | US-34, US-82 | No | Negativo | Partición de equivalencia |
| CP-DEU-023 | Media | El nombre admite hasta 60 caracteres, no 61 | US-34, US-82 | No | Límite | Valores límite |
| CP-DEU-024 | Alta | No se puede deber 0 pesos | US-34, US-82 | No | Límite | Valores límite |
| CP-DEU-025 | Alta | No se puede deber un monto negativo | US-34, US-82 | No | Negativo | Partición de equivalencia |
| CP-DEU-026 | Media | El monto que te deben admite hasta 2 decimales | US-34, US-82 | No | Límite | Valores límite |
| CP-DEU-027 | Media | El monto que te deben no acepta texto | US-34, US-82 | No | Negativo | Partición de equivalencia |
| CP-DEU-028 | Alta | Una deuda en dólares que en pesos vale menos de un centavo se rechaza | US-34, US-82 | No | Límite | Valores límite |
| CP-DEU-029 | Alta | Sin haber iniciado sesión no se puede crear un gasto compartido | US-34, US-82 | No | Negativo | Adivinación de errores |
| CP-NAV-001 | Media | La barra tiene cuatro secciones en el orden correcto | US-69 | Sí | Positivo | Caso de uso |
| CP-NAV-002 | Media | «Registrar» lleva a Registrar | US-69 | Sí | Positivo | Caso de uso |
| CP-NAV-003 | Media | «Resumen» lleva al Resumen | US-69 | Sí | Positivo | Caso de uso |
| CP-NAV-004 | Media | «Deudas» lleva a Deudas | US-69 | Sí | Positivo | Caso de uso |
| CP-NAV-005 | Media | «Suscripciones» lleva a Suscripciones | US-69 | Sí | Positivo | Caso de uso |
| CP-NAV-006 | Media | En Registrar la barra marca «Registrar» | US-69 | Sí | Positivo | Partición de equivalencia |
| CP-NAV-007 | Media | En el Resumen la barra marca «Resumen» | US-69 | Sí | Positivo | Partición de equivalencia |
| CP-NAV-008 | Media | En Movimientos la barra sigue marcando «Resumen» | US-69 | Sí | Positivo | Partición de equivalencia |
| CP-NAV-009 | Media | En Movimientos eliminados la barra sigue marcando «Resumen» | US-69 | Sí | Positivo | Partición de equivalencia |
| CP-NAV-010 | Media | En Deudas la barra marca «Deudas» | US-69 | Sí | Positivo | Partición de equivalencia |
| CP-NAV-011 | Media | En Suscripciones la barra marca «Suscripciones» | US-69 | Sí | Positivo | Partición de equivalencia |
| CP-NAV-012 | Media | En Ajustes no se marca ninguna de las cuatro secciones | US-69 | Sí | Positivo | Partición de equivalencia |
| CP-NAV-013 | Media | Pantalla muy angosta (320 px): los nombres se leen completos | US-69 | No | Límite | Valores límite |
| CP-NAV-014 | Media | Pantalla angosta (320 px): los botones son cómodos de tocar | US-69 | No | Límite | Valores límite |
| CP-NAV-015 | Media | Ancho 1023 px: barra abajo y engranaje de Ajustes | US-69 | No | Límite | Valores límite |
| CP-NAV-016 | Media | Ancho 1024 px: barra lateral con Ajustes al pie | US-69 | No | Límite | Valores límite |
| CP-NAV-017 | Media | Ancho 1280 px: se mantiene la barra lateral | US-69 | No | Límite | Valores límite |
| CP-NAV-018 | Media | Identificadores únicos en Registrar (375 px) | US-69 | Sí | Positivo | Valores límite |
| CP-NAV-019 | Media | Identificadores únicos en Registrar (1023 px) | US-69 | Sí | Positivo | Valores límite |
| CP-NAV-020 | Media | Identificadores únicos en Registrar (1024 px) | US-69 | No | Límite | Valores límite |
| CP-NAV-021 | Media | Identificadores únicos en Registrar (1280 px) | US-69 | No | Límite | Valores límite |
| CP-NAV-022 | Media | «Ver todos» y «‹ Resumen» mantienen el mes | US-69 | Sí | Positivo | Caso de uso |
| CP-NAV-023 | Media | Con el mes vacío se llega igual a los movimientos eliminados | US-69 | Sí | Positivo | Caso de uso |
| CP-NAV-024 | Media | Deudas no arrastra el mes del Resumen | US-69 | Sí | Positivo | Partición de equivalencia |
| CP-NAV-025 | Media | Suscripciones no arrastra el mes del Resumen | US-69 | Sí | Positivo | Partición de equivalencia |
| CP-NAV-026 | Media | Del Movimiento al Resumen se conserva el mes | US-69 | Sí | Positivo | Caso de uso |
| CP-NAV-027 | Alta | Tocar «Registrar» estando en Registrar no pierde lo cargado | US-69 | Sí | Positivo | Transición de estados |
| CP-NAV-028 | Media | Escribir /transactions abre Movimientos con la barra nueva | US-69 | Sí | Positivo | Caso de uso |
| CP-NAV-029 | Media | El aviso al borrar explica cómo restaurar un gasto | US-65, US-69 | Sí | Positivo | Caso de uso |
| CP-NAV-030 | Media | Guardar $12.500 muestra la confirmación completa | US-10, US-70 | Sí | Positivo | Caso de uso |
| CP-NAV-031 | Media | Guardar $120.000 en 12 cuotas lo dice en el aviso | US-10, US-70 | Sí | Positivo | Caso de uso |
| CP-NAV-032 | Alta | Sin internet el gasto no se pierde y aparece «Reintentar» | US-70 | No | Negativo | Adivinación de errores |
| CP-NAV-033 | Alta | El aviso de error no desaparece solo | US-70 | No | Negativo | Transición de estados |
| CP-NAV-034 | Alta | Reintentar al volver internet guarda una sola vez | US-70 | Sí | Positivo | Transición de estados |
| CP-NAV-035 | Alta | Cambiar el monto después del fallo empieza un intento nuevo | US-70 | Sí | Positivo | Transición de estados |
| CP-NAV-036 | Alta | Guardar el gasto corregido elimina el pendiente anterior | US-70 | Sí | Positivo | Transición de estados |
| CP-NAV-037 | Alta | Dos fallos seguidos dejan un solo pendiente | US-70 | No | Negativo | Adivinación de errores |
| CP-NAV-038 | Alta | Con internet muy lenta, a los 15 segundos avisa que falló | US-70 | No | Límite | Valores límite |
| CP-NAV-039 | Alta | Reintentar no duplica un gasto que ya se había guardado | US-70 | Sí | Positivo | Transición de estados |
| CP-NAV-040 | Alta | La misma clave dos veces seguidas devuelve el mismo gasto | US-70 | Sí | Positivo | Caso de uso |
| CP-NAV-041 | Alta | Dos pedidos simultáneos con la misma clave crean un solo gasto | US-70 | Sí | Positivo | Adivinación de errores |
| CP-NAV-042 | Alta | Claves distintas con el mismo contenido crean dos gastos | US-70 | Sí | Positivo | Partición de equivalencia |
| CP-NAV-043 | Alta | La misma clave en dos usuarios distintos no se pisa | US-70 | Sí | Positivo | Adivinación de errores |
| CP-NAV-044 | Alta | La misma clave con otro monto conserva el gasto original | US-70 | Sí | Positivo | Partición de equivalencia |
| CP-NAV-045 | Alta | La misma clave sigue funcionando después de archivar la categoría | US-70 | Sí | Positivo | Transición de estados |
| CP-NAV-046 | Alta | Sin clave, cada llamada crea un gasto distinto | US-70 | Sí | Positivo | Partición de equivalencia |
| CP-NAV-047 | Alta | Si se archiva la categoría antes de guardar, el gasto se rechaza con aviso | US-70 | No | Negativo | Adivinación de errores |
| CP-NAV-048 | Alta | La API rechaza un gasto con una categoría archivada | US-70 | No | Negativo | Adivinación de errores |
| CP-NAV-049 | Alta | Al volver a Registrar aparece el gasto pendiente | US-70 | Sí | Positivo | Transición de estados |
| CP-NAV-050 | Alta | Al recargar la página sigue el gasto pendiente | US-70 | Sí | Positivo | Transición de estados |
| CP-NAV-051 | Alta | Dos gastos fallidos: dos pendientes, el más nuevo primero | US-70 | Sí | Positivo | Transición de estados |
| CP-NAV-052 | Alta | Recuperar un gasto en dólares conserva fecha y tipo de cambio | US-70 | Sí | Positivo | Transición de estados |
| CP-NAV-053 | Alta | Recuperar un gasto que en realidad ya estaba guardado | US-70 | Sí | Positivo | Transición de estados |
| CP-NAV-054 | Alta | Recuperar un gasto que ya estaba guardado y fue eliminado | US-70 | Sí | Positivo | Transición de estados |
| CP-NAV-055 | Alta | Recuperar sin internet no pierde el pendiente | US-70 | No | Negativo | Adivinación de errores |
| CP-NAV-056 | Alta | Descartar borra el pendiente, incluso al recargar | US-70 | Sí | Positivo | Transición de estados |
| CP-NAV-057 | Alta | Cerrar sesión borra los pendientes | US-70 | Sí | Positivo | Transición de estados |
| CP-NAV-058 | Alta | Recuperar con la categoría archivada deja la categoría vacía | US-11, US-70 | Sí | Positivo | Transición de estados |
| CP-NAV-059 | Alta | Un pendiente de septiembre se guarda en septiembre | US-70 | Sí | Positivo | Transición de estados |
| CP-NAV-060 | Media | Un lector de pantalla (TalkBack) anuncia el error sin mover el foco | US-70 | Sí | Positivo | Caso de uso |
| CP-NAV-061 | Alta | Tocar dos veces «Guardar» guarda una sola vez | US-70 | No | Límite | Adivinación de errores |
| CP-NAV-062 | Alta | El primer gasto guiado también conserva los datos y ofrece «Reintentar» | US-68, US-70 | No | Negativo | Caso de uso |
| CP-NAV-063 | Media | Identificadores únicos en Resumen (375 px) | US-69 | Sí | Positivo | Valores límite |
| CP-NAV-064 | Media | Identificadores únicos en Movimientos (375 px) | US-69 | Sí | Positivo | Valores límite |
| CP-NAV-065 | Media | Identificadores únicos en Deudas (375 px) | US-69 | Sí | Positivo | Valores límite |
| CP-NAV-066 | Media | Identificadores únicos en Suscripciones (375 px) | US-69 | Sí | Positivo | Valores límite |
| CP-NAV-067 | Media | Identificadores únicos en Ajustes (375 px) | US-69 | Sí | Positivo | Valores límite |
| CP-NAV-068 | Media | Identificadores únicos en Resumen (1023 px) | US-69 | Sí | Positivo | Valores límite |
| CP-NAV-069 | Media | Identificadores únicos en Movimientos (1023 px) | US-69 | Sí | Positivo | Valores límite |
| CP-NAV-070 | Media | Identificadores únicos en Deudas (1023 px) | US-69 | Sí | Positivo | Valores límite |
| CP-NAV-071 | Media | Identificadores únicos en Suscripciones (1023 px) | US-69 | Sí | Positivo | Valores límite |
| CP-NAV-072 | Media | Identificadores únicos en Ajustes (1023 px) | US-69 | Sí | Positivo | Valores límite |
| CP-NAV-073 | Media | Identificadores únicos en Resumen (1024 px) | US-69 | No | Límite | Valores límite |
| CP-NAV-074 | Media | Identificadores únicos en Movimientos (1024 px) | US-69 | No | Límite | Valores límite |
| CP-NAV-075 | Media | Identificadores únicos en Deudas (1024 px) | US-69 | No | Límite | Valores límite |
| CP-NAV-076 | Media | Identificadores únicos en Suscripciones (1024 px) | US-69 | No | Límite | Valores límite |
| CP-NAV-077 | Media | Identificadores únicos en Ajustes (1024 px) | US-69 | No | Límite | Valores límite |
| CP-NAV-078 | Media | Identificadores únicos en Resumen (1280 px) | US-69 | No | Límite | Valores límite |
| CP-NAV-079 | Media | Identificadores únicos en Movimientos (1280 px) | US-69 | No | Límite | Valores límite |
| CP-NAV-080 | Media | Identificadores únicos en Deudas (1280 px) | US-69 | No | Límite | Valores límite |
| CP-NAV-081 | Media | Identificadores únicos en Suscripciones (1280 px) | US-69 | No | Límite | Valores límite |
| CP-NAV-082 | Media | Identificadores únicos en Ajustes (1280 px) | US-69 | No | Límite | Valores límite |
| CP-NAV-083 | Alta | La API devuelve un solo gasto activo para la clave recuperada | US-70 | Sí | Positivo | Transición de estados |
| CP-NAV-084 | Alta | La API conserva un solo gasto eliminado para la clave recuperada | US-70 | Sí | Positivo | Transición de estados |
| CP-NAV-085 | Alta | La API confirma la clave del gasto reintentado por pantalla | US-70 | Sí | Positivo | Transición de estados |

## Casos

### CP-DEU-018 — No se puede compartir un gasto si falta cuánto te deben

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Trazabilidad | US-34 · CA-8 · US-82 · CA-14, CA-15 · FR-18 · I4 · C4 · C6 |
| Historias de usuario | US-34, US-82 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-018-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-018-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**

- Monto del gasto: $20.000
- Persona: Sofía
- Monto que te deben: (vacío)

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 20000 en el monto y tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?»). |
| 2 | Tocar la categoría «Otros». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 3 | Prender el interruptor «Gasto compartido». | Aparecen los campos «¿Con quién?» y «¿Cuánto te debe?». |
| 4 | En «¿Con quién?» escribir Sofía. | El campo muestra «Sofía». |
| 5 | Tocar «¿Cuánto te debe?», no escribir nada y tocar «¿Con quién?» para salir del campo. | Debajo de «¿Cuánto te debe?» aparece «Ingresá cuánto te debe» y «Guardar gasto» queda deshabilitado (gris). |
| 6 | Abrir Movimientos (Resumen → «Ver todos») y Deudas, y mirar las listas. | No aparece ningún gasto ni deuda nueva: no se guardó nada. |

**Notas del diseño:** Prueba original por API (create_transaction con p_shared_persons = ["Sofía"] y p_shared_amounts = null): rechazo «Un gasto compartido necesita una persona y un monto por cada deuda». Se prueba su equivalente de pantalla (caso gemelo CP-DEU-008).

---

### CP-DEU-019 — No se puede compartir un gasto si falta con quién

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Trazabilidad | US-34 · CA-8 · US-82 · CA-14, CA-15 · FR-18 · C4 · C6 |
| Historias de usuario | US-34, US-82 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-019-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-019-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**

- Monto del gasto: $20.000
- Persona: (vacía)
- Monto que te deben: $10.000

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 20000 en el monto y tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?»). |
| 2 | Tocar la categoría «Otros». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 3 | Prender el interruptor «Gasto compartido». | Aparecen los campos «¿Con quién?» y «¿Cuánto te debe?». |
| 4 | En «¿Cuánto te debe?» escribir 10000. | El campo muestra 10000. |
| 5 | Tocar «¿Con quién?», no escribir nada y tocar «¿Cuánto te debe?» para salir del campo. | Debajo de «¿Con quién?» aparece «Ingresá con quién compartiste el gasto» y «Guardar gasto» queda deshabilitado (gris). |
| 6 | Abrir Movimientos (Resumen → «Ver todos») y Deudas, y mirar las listas. | No aparece ningún gasto ni deuda nueva: no se guardó nada. |

**Notas del diseño:** Prueba original por API (p_shared_persons = null con p_shared_amounts = ["10000.00"]). Equivalente de pantalla: caso gemelo CP-DEU-016.

---

### CP-DEU-020 — Un ingreso no se puede compartir

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Trazabilidad | US-34 · CA-8 · US-82 · CA-14, CA-15 · FR-18 · I7 · C4 · C6 |
| Historias de usuario | US-34, US-82 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-020-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-020-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**

- Tipo: Ingreso
- Monto: $100.000

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar tocar «Ingreso» (en vez de «Gasto»). | «Ingreso» queda seleccionado. |
| 2 | Escribir 100000 en el monto y tocar «Siguiente». | Se abre el último paso, «Revisá y guardá», con el botón «Guardar ingreso». |
| 3 | Mirar el último paso, debajo de «Nota (opcional)». | No existe la sección «Gasto compartido» ni su interruptor: no hay forma de marcar un ingreso como compartido. |

**Notas del diseño:** Prueba original por API (p_type = "income" con una deuda): rechazo «Un ingreso no se puede compartir». Equivalente de pantalla: caso gemelo CP-DEU-002.

---

### CP-DEU-020B — Un ingreso repartido entre 11 personas tampoco se puede compartir

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Tabla de decisión · Negativo |
| Trazabilidad | US-82 · CA-14 · ADR-040 §2 · FR-18 · I7 · C4 · C6 |
| Historias de usuario | US-82 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-020b-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-020b-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**

- Tipo: Ingreso
- Monto: $120.000

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar tocar «Ingreso» (en vez de «Gasto»). | «Ingreso» queda seleccionado. |
| 2 | Escribir 120000 en el monto y tocar «Siguiente». | Se abre el último paso, «Revisá y guardá». |
| 3 | Buscar en el último paso la forma de agregar personas («Gasto compartido»). | No existe «Gasto compartido»: no se pueden cargar personas en un ingreso, ni una ni 11. |

**Notas del diseño:** Prueba original por API (ingreso con 11 personas): rechazo «Un ingreso no se puede compartir», que es el primer error que se revisa (ADR-040 §2). Equivalente de pantalla: caso gemelo CP-DEU-002.

---

### CP-DEU-021 — El nombre hecho solo de espacios no cuenta como nombre

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Trazabilidad | US-34 · CA-8 · US-82 · CA-14, CA-15 · FR-18 · C4 · C6 |
| Historias de usuario | US-34, US-82 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-021-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-021-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**

- Monto del gasto: $20.000
- Persona: 3 espacios en blanco
- Monto que te deben: $10.000

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 20000 en el monto y tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?»). |
| 2 | Tocar la categoría «Otros». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 3 | Prender el interruptor «Gasto compartido». | Aparecen los campos «¿Con quién?» y «¿Cuánto te debe?». |
| 4 | En «¿Con quién?» apretar la barra espaciadora tres veces (el campo parece vacío). | El campo tiene tres espacios. |
| 5 | En «¿Cuánto te debe?» escribir 10000. | Debajo de «¿Con quién?» aparece «Ingresá con quién compartiste el gasto» y «Guardar gasto» queda deshabilitado (gris). |
| 6 | Abrir Movimientos (Resumen → «Ver todos») y Deudas, y mirar las listas. | No aparece ningún gasto ni deuda nueva: no se guardó nada. |

**Notas del diseño:** Prueba original por API (p_shared_persons = ["   "]). Equivalente de pantalla: caso gemelo CP-DEU-006.

---

### CP-DEU-022 — El nombre hecho solo de una tabulación no cuenta como nombre

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Trazabilidad | US-34 · CA-8 · US-82 · CA-14, CA-15 · FR-18 · C4 · C6 |
| Historias de usuario | US-34, US-82 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-022-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-022-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**

- Monto del gasto: $20.000
- Persona: 3 espacios en blanco (en la pantalla no se puede escribir una tabulación)
- Monto que te deben: $10.000

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 20000 en el monto y tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?»). |
| 2 | Tocar la categoría «Otros». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 3 | Prender el interruptor «Gasto compartido». | Aparecen los campos «¿Con quién?» y «¿Cuánto te debe?». |
| 4 | En «¿Con quién?» apretar la barra espaciadora tres veces. (La tecla Tab cambia de campo, por eso en pantalla se prueba con espacios.) | El campo tiene tres espacios. |
| 5 | En «¿Cuánto te debe?» escribir 10000. | Debajo de «¿Con quién?» aparece «Ingresá con quién compartiste el gasto» y «Guardar gasto» queda deshabilitado (gris). |
| 6 | Abrir Movimientos (Resumen → «Ver todos») y Deudas, y mirar las listas. | No aparece ningún gasto ni deuda nueva: no se guardó nada. |

**Notas del diseño:** Prueba original por API (p_shared_persons = ["\t"]); la tabulación solo se puede enviar por API. Equivalente de pantalla: caso gemelo CP-DEU-006.

---

### CP-DEU-023 — El nombre admite hasta 60 caracteres, no 61

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-34 · CA-8 · US-82 · CA-14, CA-15 · FR-18 · C4 · C6 |
| Historias de usuario | US-34, US-82 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-023-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-023-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**

- Monto del gasto: $20.000
- Texto de 61 caracteres: A123456789B123456789C123456789D123456789E123456789F123456789Z
- Fecha: 15/08/2026
- Monto que te deben: $10.000

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 20000 en el monto y tocar «Siguiente». | Se abre el paso 2 de 3. |
| 2 | Tocar la categoría «Otros». | Se abre el paso 3 de 3. |
| 3 | En «Fecha» tocar «Otra» y escribir 15/08/2026. | La fecha muestra 15/08/2026. |
| 4 | Prender «Gasto compartido». | Aparecen «¿Con quién?» y «¿Cuánto te debe?». |
| 5 | En «¿Con quién?» escribir o pegar el texto de 61 caracteres de los datos de prueba. | El campo acepta solo los primeros 60 caracteres (termina en «…F123456789»): la «Z» final no entra. |
| 6 | En «¿Cuánto te debe?» escribir 10000. | Se habilita «Guardar gasto». |
| 7 | Tocar «Guardar gasto» y abrir Deudas con el filtro «Todas». | Aparece «Gasto guardado» y en Deudas hay una deuda cuyo nombre tiene exactamente los 60 caracteres. |

**Notas del diseño:** Prueba original por API (nombre de 61 caracteres): rechazo «La persona admite hasta 60 caracteres». Equivalente de pantalla: caso gemelo CP-DEU-007.

---

### CP-DEU-024 — No se puede deber 0 pesos

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-34 · CA-8 · US-82 · CA-14, CA-15 · FR-18 · I4 · C4 · C6 |
| Historias de usuario | US-34, US-82 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-024-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-024-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**

- Monto del gasto: $20.000
- Persona: Sofía
- Monto que te deben: 0

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 20000 en el monto y tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?»). |
| 2 | Tocar la categoría «Otros». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 3 | Prender el interruptor «Gasto compartido». | Aparecen los campos «¿Con quién?» y «¿Cuánto te debe?». |
| 4 | En «¿Con quién?» escribir Sofía. | El campo muestra «Sofía». |
| 5 | Tocar «¿Cuánto te debe?», escribir 0 y tocar «¿Con quién?» para salir del campo. | Debajo de «¿Cuánto te debe?» aparece «El monto debe ser mayor a cero» y «Guardar gasto» queda deshabilitado (gris). |
| 6 | Abrir Movimientos (Resumen → «Ver todos») y Deudas, y mirar las listas. | No aparece ningún gasto ni deuda nueva: no se guardó nada. |

**Notas del diseño:** Prueba original por API (p_shared_amounts = [0]): rechazo «I4: el monto de la deuda debe ser mayor a cero». Equivalente de pantalla: caso gemelo CP-DEU-010.

---

### CP-DEU-025 — No se puede deber un monto negativo

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Trazabilidad | US-34 · CA-8 · US-82 · CA-14, CA-15 · FR-18 · I4 · C4 · C6 |
| Historias de usuario | US-34, US-82 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-025-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-025-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**

- Monto del gasto: $20.000
- Persona: Sofía
- Monto que te deben: -5

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 20000 en el monto y tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?»). |
| 2 | Tocar la categoría «Otros». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 3 | Prender el interruptor «Gasto compartido». | Aparecen los campos «¿Con quién?» y «¿Cuánto te debe?». |
| 4 | En «¿Con quién?» escribir Sofía. | El campo muestra «Sofía». |
| 5 | Tocar «¿Cuánto te debe?», escribir -5 y tocar «¿Con quién?» para salir del campo. | Debajo de «¿Cuánto te debe?» aparece «El monto debe ser mayor a cero» y «Guardar gasto» queda deshabilitado (gris). |
| 6 | Abrir Movimientos (Resumen → «Ver todos») y Deudas, y mirar las listas. | No aparece ningún gasto ni deuda nueva: no se guardó nada. |

**Notas del diseño:** Prueba original por API (p_shared_amounts = [-1]). Equivalente de pantalla: caso gemelo CP-DEU-011 (con -5).

---

### CP-DEU-026 — El monto que te deben admite hasta 2 decimales

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-34 · CA-8 · US-82 · CA-14, CA-15 · FR-18 · I4 · C4 · C6 |
| Historias de usuario | US-34, US-82 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-026-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-026-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**

- Monto del gasto: $20.000
- Persona: Sofía
- Monto que te deben: 100,001

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 20000 en el monto y tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?»). |
| 2 | Tocar la categoría «Otros». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 3 | Prender el interruptor «Gasto compartido». | Aparecen los campos «¿Con quién?» y «¿Cuánto te debe?». |
| 4 | En «¿Con quién?» escribir Sofía. | El campo muestra «Sofía». |
| 5 | Tocar «¿Cuánto te debe?», escribir 100,001 y tocar «¿Con quién?» para salir del campo. | Debajo de «¿Cuánto te debe?» aparece «El monto admite hasta 2 decimales» y «Guardar gasto» queda deshabilitado (gris). |
| 6 | Abrir Movimientos (Resumen → «Ver todos») y Deudas, y mirar las listas. | No aparece ningún gasto ni deuda nueva: no se guardó nada. |

**Notas del diseño:** Prueba original por API (p_shared_amounts = [1.001]): rechazo «I4: el monto de la deuda admite hasta 2 decimales». Equivalente de pantalla: caso gemelo CP-DEU-012.

---

### CP-DEU-027 — El monto que te deben no acepta texto

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Trazabilidad | US-34 · CA-8 · US-82 · CA-14, CA-15 · ADR-036 §5 · FR-18 · I4 · C4 · C6 |
| Historias de usuario | US-34, US-82 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-027-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-027-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**

- Monto del gasto: $20.000
- Persona: Sofía
- Monto que te deben: abc

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 20000 en el monto y tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?»). |
| 2 | Tocar la categoría «Otros». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 3 | Prender el interruptor «Gasto compartido». | Aparecen los campos «¿Con quién?» y «¿Cuánto te debe?». |
| 4 | En «¿Con quién?» escribir Sofía. | El campo muestra «Sofía». |
| 5 | Tocar «¿Cuánto te debe?», escribir abc y tocar «¿Con quién?» para salir del campo. | Debajo de «¿Cuánto te debe?» aparece «Ingresá un número válido» y «Guardar gasto» queda deshabilitado (gris). |
| 6 | Abrir Movimientos (Resumen → «Ver todos») y Deudas, y mirar las listas. | No aparece ningún gasto ni deuda nueva: no se guardó nada. |

**Notas del diseño:** Prueba original por API (p_shared_amounts = ["NaN"]): rechazo «I4: el monto de la deuda debe ser mayor a cero». En pantalla el mensaje es el indicado. Equivalente de pantalla: caso gemelo CP-DEU-009.

---

### CP-DEU-028 — Una deuda en dólares que en pesos vale menos de un centavo se rechaza

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-34 · CA-8 · US-82 · CA-14, CA-15 · FR-18 · I4 · C4 · C6 |
| Historias de usuario | US-34, US-82 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-028-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-028-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**

- Monto del gasto: US$ 100
- Tipo de cambio: 0,4
- Persona: Sofía
- Monto que te deben: US$ 0,01

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar tocar «US$», escribir 100 en el monto y 0,4 en «Tipo de cambio (ARS por US$)». | Aparece «≈ $40,00» y se habilita «Siguiente». |
| 2 | Tocar «Siguiente» y elegir la categoría «Otros». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 3 | Prender «Gasto compartido» y escribir Sofía en «¿Con quién?». | El campo muestra «Sofía». |
| 4 | Tocar «¿Cuánto te debe?», escribir 0,01 y tocar «¿Con quién?» para salir del campo. | Aparece «En pesos daría menos de $0,01. Revisá el monto o el tipo de cambio» y «Guardar gasto» queda deshabilitado (gris). |
| 5 | Abrir Movimientos (Resumen → «Ver todos») y Deudas, y mirar las listas. | No aparece ningún gasto ni deuda nueva: no se guardó nada. |

**Notas del diseño:** Prueba original por API (gasto de US$100 a tipo de cambio 0.4 con deuda "0.01"): rechazo «I4: la deuda en pesos daría menos de $0,01». Equivalente de pantalla: caso gemelo CP-DEU-013.

---

### CP-DEU-029 — Sin haber iniciado sesión no se puede crear un gasto compartido

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Trazabilidad | US-34 · CA-8 · US-82 · CA-14, CA-15 · FR-18 · C7 |
| Historias de usuario | US-34, US-82 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-029-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
5. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-deu-029-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
6. Identificadores de la categoría «Otros» y de la cuenta «Efectivo»: pedidos GET a SUPABASE_URL/rest/v1/categories?select=id,name y SUPABASE_URL/rest/v1/accounts?select=id,name,type con los encabezados «apikey» = ANON_KEY y «Authorization» = Bearer + el token. Anotar el «id» de «Otros» (ID_OTROS) y el de «Efectivo» (ID_EFECTIVO).
7. Función de varias personas (US-82) disponible en el entorno: el caso la llama con listas de personas y de montos (ver Notas).

**Datos de prueba:**

- Monto del gasto: 20000.00 ARS
- Fecha: 2026-08-15
- Personas: ["Sofía"]
- Montos: ["10000.00"]

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Postman crear un pedido POST a SUPABASE_URL/rest/v1/rpc/create_transaction con SOLO los encabezados «apikey» = ANON_KEY y «Content-Type: application/json» (SIN el encabezado «Authorization»). Cuerpo: {"p_type":"expense","p_amount":"20000.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"ID_OTROS","p_account_id":"ID_EFECTIVO","p_installments_count":1,"p_occurred_on":"2026-08-15","p_description":null,"p_shared_persons":["Sofía"],"p_shared_amounts":["10000.00"]}. Enviar. | El sistema responde con error 401 o 403 y el código 42501 («permission denied for function create_transaction»). |
| 2 | Con el token del usuario, pedir GET a SUPABASE_URL/rest/v1/transactions?select=id y a /rest/v1/debts?select=id. | Ambos devuelven [] : no se creó nada. |

**Notas del diseño:** No hay equivalente en pantalla: la app sin sesión lleva directo al login. Prueba original por API. BLOQUEADO: la función de varias personas (US-82, issue #270) todavía no existe en la app.

---

### CP-NAV-001 — La barra tiene cuatro secciones en el orden correcto

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Caso de uso · Positivo |
| Trazabilidad | US-69 · CA-1 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-001-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-001-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Pantalla del navegador con ancho de 375 px y alto de 812 px: apretar F12, tocar el ícono «Toggle device toolbar» (pantalla adaptable) y escribir 375 en el ancho y 812 en el alto. Comprobar que arriba dice 375 × 812.
6. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Ancho de pantalla: 375 × 812

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Mirar la barra de abajo de izquierda a derecha. | Se leen exactamente «Registrar», «Resumen», «Deudas», «Suscripciones» (cuatro ítems, en ese orden) y no aparece «Movimientos». |

---

### CP-NAV-002 — «Registrar» lleva a Registrar

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Caso de uso · Positivo |
| Trazabilidad | US-69 · CA-2 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-002-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-002-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).

**Datos de prueba:**

- Pantalla de partida: Resumen

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /dashboard a la dirección de la app y apretar Enter. | Se abre el Resumen. |
| 2 | Tocar «Registrar» en la barra. | Se abre Registrar en el paso 1 («¿Cuánto?»); la dirección termina en /register. |

---

### CP-NAV-003 — «Resumen» lleva al Resumen

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Caso de uso · Positivo |
| Trazabilidad | US-69 · CA-2 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-003-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-003-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).

**Datos de prueba:**

- Pantalla de partida: Registrar

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Tocar «Resumen» en la barra. | Se abre el Resumen y la dirección termina en /dashboard. |

---

### CP-NAV-004 — «Deudas» lleva a Deudas

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Caso de uso · Positivo |
| Trazabilidad | US-69 · CA-2 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-004-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-004-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).

**Datos de prueba:**

- Pantalla de partida: Registrar

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Tocar «Deudas» en la barra. | Se abre Deudas y la dirección termina en /debts. |

---

### CP-NAV-005 — «Suscripciones» lleva a Suscripciones

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Caso de uso · Positivo |
| Trazabilidad | US-69 · CA-2 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-005-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-005-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).

**Datos de prueba:**

- Pantalla de partida: Registrar

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Tocar «Suscripciones» en la barra. | Se abre Suscripciones y la dirección termina en /subscriptions. |

---

### CP-NAV-006 — En Registrar la barra marca «Registrar»

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Trazabilidad | US-69 · CA-3 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-006-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-006-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Pantalla a abrir: /register

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de direcciones agregar /register a la dirección de la app y apretar Enter. | Se abre Registrar. |
| 2 | Mirar la barra de navegación. | «Registrar» se ve resaltado (verde y en negrita); Resumen, Deudas y Suscripciones se ven normales, y el engranaje de Ajustes tampoco está marcado. |
| 3 | Verificación adicional: apretar F12, abrir «Console», pegar este texto y apretar Enter: [...document.querySelectorAll('nav[aria-label="Principal"] a[data-testid^="register-nav-"]')].map(a=>[a.textContent.trim(),a.getAttribute('aria-current')]) | Devuelve [["Registrar", "page"], ["Resumen", null], ["Deudas", null], ["Suscripciones", null], ["", null]]: solo «Registrar» tiene aria-current="page". |

---

### CP-NAV-007 — En el Resumen la barra marca «Resumen»

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Trazabilidad | US-69 · CA-3 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-007-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-007-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Pantalla a abrir: /dashboard?period=2026-08

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de direcciones agregar /dashboard?period=2026-08 a la dirección de la app y apretar Enter. | Se abre el Resumen de agosto de 2026. |
| 2 | Mirar la barra de navegación. | «Resumen» queda resaltado (verde y en negrita); las otras secciones no. |
| 3 | Verificación adicional: apretar F12, abrir «Console», pegar este texto y apretar Enter: [...document.querySelectorAll('nav[aria-label="Principal"] a[data-testid^="dashboard-nav-"]')].map(a=>[a.textContent.trim(),a.getAttribute('aria-current')]) | Devuelve [["Registrar", null], ["Resumen", "page"], ["Deudas", null], ["Suscripciones", null], ["", null]]: solo «Resumen» tiene aria-current="page". |

---

### CP-NAV-008 — En Movimientos la barra sigue marcando «Resumen»

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Trazabilidad | US-69 · CA-3 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-008-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-008-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Pantalla a abrir: /transactions?period=2026-08

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de direcciones agregar /transactions?period=2026-08 a la dirección de la app y apretar Enter. | Se abre Movimientos de agosto de 2026. |
| 2 | Mirar la barra de navegación. | «Resumen» queda resaltado (Movimientos ya no está en la barra). |
| 3 | Verificación adicional: apretar F12, abrir «Console», pegar este texto y apretar Enter: [...document.querySelectorAll('nav[aria-label="Principal"] a[data-testid^="transactions-nav-"]')].map(a=>[a.textContent.trim(),a.getAttribute('aria-current')]) | Devuelve [["Registrar", null], ["Resumen", "page"], ["Deudas", null], ["Suscripciones", null], ["", null]]: solo «Resumen» tiene aria-current="page". |

---

### CP-NAV-009 — En Movimientos eliminados la barra sigue marcando «Resumen»

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Trazabilidad | US-69 · CA-3 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-009-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-009-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Pantalla a abrir: /transactions?period=2026-08&view=deleted

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de direcciones agregar /transactions?period=2026-08&view=deleted a la dirección de la app y apretar Enter. | Se abre la lista de movimientos eliminados de agosto de 2026. |
| 2 | Mirar la barra de navegación. | «Resumen» queda resaltado. |
| 3 | Verificación adicional: apretar F12, abrir «Console», pegar este texto y apretar Enter: [...document.querySelectorAll('nav[aria-label="Principal"] a[data-testid^="transactions-nav-"]')].map(a=>[a.textContent.trim(),a.getAttribute('aria-current')]) | Devuelve [["Registrar", null], ["Resumen", "page"], ["Deudas", null], ["Suscripciones", null], ["", null]]: solo «Resumen» tiene aria-current="page". |

---

### CP-NAV-010 — En Deudas la barra marca «Deudas»

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Trazabilidad | US-69 · CA-3 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-010-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-010-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Pantalla a abrir: /debts

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de direcciones agregar /debts a la dirección de la app y apretar Enter. | Se abre Deudas. |
| 2 | Mirar la barra de navegación. | «Deudas» queda resaltado (verde y en negrita); las otras no. |
| 3 | Verificación adicional: apretar F12, abrir «Console», pegar este texto y apretar Enter: [...document.querySelectorAll('nav[aria-label="Principal"] a[data-testid^="debts-nav-"]')].map(a=>[a.textContent.trim(),a.getAttribute('aria-current')]) | Devuelve [["Registrar", null], ["Resumen", null], ["Deudas", "page"], ["Suscripciones", null], ["", null]]: solo «Deudas» tiene aria-current="page". |

---

### CP-NAV-011 — En Suscripciones la barra marca «Suscripciones»

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Trazabilidad | US-69 · CA-3 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-011-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-011-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Pantalla a abrir: /subscriptions

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de direcciones agregar /subscriptions a la dirección de la app y apretar Enter. | Se abre Suscripciones. |
| 2 | Mirar la barra de navegación. | «Suscripciones» queda resaltado; las otras no. |
| 3 | Verificación adicional: apretar F12, abrir «Console», pegar este texto y apretar Enter: [...document.querySelectorAll('nav[aria-label="Principal"] a[data-testid^="subscriptions-nav-"]')].map(a=>[a.textContent.trim(),a.getAttribute('aria-current')]) | Devuelve [["Registrar", null], ["Resumen", null], ["Deudas", null], ["Suscripciones", "page"], ["", null]]: solo «Suscripciones» tiene aria-current="page". |

---

### CP-NAV-012 — En Ajustes no se marca ninguna de las cuatro secciones

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Trazabilidad | US-69 · CA-3 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-012-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-012-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Pantalla a abrir: /settings

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de direcciones agregar /settings a la dirección de la app y apretar Enter. | Se abre Ajustes. |
| 2 | Mirar la barra de navegación. | Ninguna de las cuatro secciones queda resaltada; solo el engranaje de Ajustes. |
| 3 | Verificación adicional: apretar F12, abrir «Console», pegar este texto y apretar Enter: [...document.querySelectorAll('nav[aria-label="Principal"] a[data-testid^="settings-nav-"]')].map(a=>[a.textContent.trim(),a.getAttribute('aria-current')]) | Devuelve [["Registrar", null], ["Resumen", null], ["Deudas", null], ["Suscripciones", null], ["", "page"]]: solo «Ajustes» tiene aria-current="page". |

---

### CP-NAV-013 — Pantalla muy angosta (320 px): los nombres se leen completos

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-69 · CA-4 · NFR-08 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-013-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-013-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Pantalla del navegador con ancho de 320 px y alto de 812 px: apretar F12, tocar el ícono «Toggle device toolbar» (pantalla adaptable) y escribir 320 en el ancho y 812 en el alto. Comprobar que arriba dice 320 × 812.
6. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Ancho de pantalla: 320 × 812

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Leer los cuatro nombres de la barra de abajo. | Se leen completos «Registrar», «Resumen», «Deudas» y «Suscripciones», sin «…», sin cortes y sin superponerse. |

---

### CP-NAV-014 — Pantalla angosta (320 px): los botones son cómodos de tocar

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-69 · CA-4 · NFR-08 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-014-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-014-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Pantalla del navegador con ancho de 320 px y alto de 812 px: apretar F12, tocar el ícono «Toggle device toolbar» (pantalla adaptable) y escribir 320 en el ancho y 812 en el alto. Comprobar que arriba dice 320 × 812.
6. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Ancho de pantalla: 320 × 812
- Tamaño mínimo: 44 × 44 píxeles

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Apretar F12, abrir «Console», pegar este texto y apretar Enter: [...document.querySelectorAll('nav[aria-label="Principal"] a')].map(a=>{const r=a.getBoundingClientRect();return [r.width>=44,r.height>=44]}) | La consola devuelve [[true,true],[true,true],[true,true],[true,true]]: cada uno de los cuatro botones mide 44 × 44 píxeles o más. |

---

### CP-NAV-015 — Ancho 1023 px: barra abajo y engranaje de Ajustes

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-69 · CA-5 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-015-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-015-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Pantalla del navegador con ancho de 1023 px y alto de 812 px: apretar F12, tocar el ícono «Toggle device toolbar» (pantalla adaptable) y escribir 1023 en el ancho y 812 en el alto. Comprobar que arriba dice 1023 × 812.
6. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Ancho de pantalla: 1023 × 812

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Mirar la navegación y el encabezado. | La navegación está fija abajo, no hay barra lateral y se ve el engranaje «Ajustes» arriba. |

---

### CP-NAV-016 — Ancho 1024 px: barra lateral con Ajustes al pie

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-69 · CA-5 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-016-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-016-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Pantalla del navegador con ancho de 1024 px y alto de 812 px: apretar F12, tocar el ícono «Toggle device toolbar» (pantalla adaptable) y escribir 1024 en el ancho y 812 en el alto. Comprobar que arriba dice 1024 × 812.
6. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Ancho de pantalla: 1024 × 812

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Mirar la navegación. | Hay una barra lateral de 240 px a la izquierda con los cuatro ítems y «Ajustes» abajo de todo; no hay barra inferior ni engranaje. |

---

### CP-NAV-017 — Ancho 1280 px: se mantiene la barra lateral

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-69 · CA-5 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-017-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-017-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Pantalla del navegador con ancho de 1280 px y alto de 812 px: apretar F12, tocar el ícono «Toggle device toolbar» (pantalla adaptable) y escribir 1280 en el ancho y 812 en el alto. Comprobar que arriba dice 1280 × 812.
6. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Ancho de pantalla: 1280 × 900

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Mirar la navegación. | Se ve la barra lateral de 240 px con los cuatro ítems y «Ajustes» al pie; no hay barra inferior. |

---

### CP-NAV-018 — Identificadores únicos en Registrar (375 px)

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Valores límite · Positivo |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-018-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-018-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Pantalla del navegador con ancho de 375 px y alto de 812 px: apretar F12, tocar el ícono «Toggle device toolbar» (pantalla adaptable) y escribir 375 en el ancho y 812 en el alto. Comprobar que arriba dice 375 × 812.
6. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Pantalla: Registrar
- Dirección: /register
- Ancho de pantalla: 375 × 812

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de direcciones agregar /register a la dirección de la app y apretar Enter. | Se abre Registrar. |
| 2 | Apretar F12, abrir «Console», pegar este texto y apretar Enter: ["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="register-nav-'+d+'"]').length) | La consola devuelve exactamente [1, 1, 1, 1, 1]: cada uno de los cinco identificadores de la barra aparece una sola vez y ninguno está repetido. |

---

### CP-NAV-019 — Identificadores únicos en Registrar (1023 px)

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Valores límite · Positivo |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-019-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-019-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Pantalla del navegador con ancho de 1023 px y alto de 812 px: apretar F12, tocar el ícono «Toggle device toolbar» (pantalla adaptable) y escribir 1023 en el ancho y 812 en el alto. Comprobar que arriba dice 1023 × 812.
6. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Pantalla: Registrar
- Dirección: /register
- Ancho de pantalla: 1023 × 812

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de direcciones agregar /register a la dirección de la app y apretar Enter. | Se abre Registrar. |
| 2 | Apretar F12, abrir «Console», pegar este texto y apretar Enter: ["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="register-nav-'+d+'"]').length) | La consola devuelve exactamente [1, 1, 1, 1, 1]: cada uno de los cinco identificadores de la barra aparece una sola vez y ninguno está repetido. |

---

### CP-NAV-020 — Identificadores únicos en Registrar (1024 px)

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-020-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-020-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Pantalla del navegador con ancho de 1024 px y alto de 900 px: apretar F12, tocar el ícono «Toggle device toolbar» (pantalla adaptable) y escribir 1024 en el ancho y 900 en el alto. Comprobar que arriba dice 1024 × 900.
6. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Pantalla: Registrar
- Dirección: /register
- Ancho de pantalla: 1024 × 900

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de direcciones agregar /register a la dirección de la app y apretar Enter. | Se abre Registrar. |
| 2 | Apretar F12, abrir «Console», pegar este texto y apretar Enter: ["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="register-nav-'+d+'"]').length) | La consola devuelve exactamente [1, 1, 1, 1, 1]: cada uno de los cinco identificadores de la barra aparece una sola vez y ninguno está repetido. |

---

### CP-NAV-021 — Identificadores únicos en Registrar (1280 px)

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-021-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-021-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Pantalla del navegador con ancho de 1280 px y alto de 900 px: apretar F12, tocar el ícono «Toggle device toolbar» (pantalla adaptable) y escribir 1280 en el ancho y 900 en el alto. Comprobar que arriba dice 1280 × 900.
6. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Pantalla: Registrar
- Dirección: /register
- Ancho de pantalla: 1280 × 900

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de direcciones agregar /register a la dirección de la app y apretar Enter. | Se abre Registrar. |
| 2 | Apretar F12, abrir «Console», pegar este texto y apretar Enter: ["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="register-nav-'+d+'"]').length) | La consola devuelve exactamente [1, 1, 1, 1, 1]: cada uno de los cinco identificadores de la barra aparece una sola vez y ninguno está repetido. |

---

### CP-NAV-022 — «Ver todos» y «‹ Resumen» mantienen el mes

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Caso de uso · Positivo |
| Trazabilidad | US-69 · CA-7 · C11 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-022-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Un gasto ya cargado de $1.200 con fecha 15/08/2026 en una cuota: en Registrar escribir el monto, «Siguiente», elegir una categoría y una cuenta, en «Fecha» tocar «Otra» y escribir 15/08/2026, dejar «1» cuota y tocar «Guardar gasto».
5. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-022-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).

**Datos de prueba:**

- Mes: agosto de 2026
- Gasto: $1.200

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /dashboard?period=2026-08 a la dirección de la app y apretar Enter. | Se abre el Resumen de agosto de 2026 y se ve el gasto. |
| 2 | Tocar «Ver todos». | Se abre Movimientos de agosto de 2026: la dirección queda exactamente …/transactions?period=2026-08. |
| 3 | Tocar «‹ Resumen». | Se vuelve al Resumen de agosto de 2026: la dirección queda …/dashboard?period=2026-08. |

---

### CP-NAV-023 — Con el mes vacío se llega igual a los movimientos eliminados

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Caso de uso · Positivo |
| Trazabilidad | US-69 · CA-8 · FR-08 · C11 · I10 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-023-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-023-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).

**Datos de prueba:**

- Mes vacío: agosto de 2026 (sin ningún gasto)

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /dashboard?period=2026-08 a la dirección de la app y apretar Enter. | Se ve el Resumen vacío con «Registrar un gasto» y «Ver movimientos». |
| 2 | Tocar «Ver movimientos». | Se abre Movimientos de agosto de 2026: la dirección queda …/transactions?period=2026-08. |
| 3 | Tocar «Eliminados». | Se ve la lista de eliminados del mismo mes: la dirección tiene period=2026-08 y view=deleted. |

---

### CP-NAV-024 — Deudas no arrastra el mes del Resumen

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Trazabilidad | US-69 · CA-9 · C11 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-024-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-024-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).

**Datos de prueba:**

- Mes de partida: agosto de 2026

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /dashboard?period=2026-08 a la dirección de la app y apretar Enter. | Se abre el Resumen de agosto de 2026. |
| 2 | Tocar «Deudas» en la barra. | Se abre Deudas y la dirección queda exactamente …/debts, sin «?period». |

---

### CP-NAV-025 — Suscripciones no arrastra el mes del Resumen

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Trazabilidad | US-69 · CA-9 · C11 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-025-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-025-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).

**Datos de prueba:**

- Mes de partida: agosto de 2026

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /dashboard?period=2026-08 a la dirección de la app y apretar Enter. | Se abre el Resumen de agosto de 2026. |
| 2 | Tocar «Suscripciones» en la barra. | Se abre Suscripciones y la dirección queda exactamente …/subscriptions, sin «?period». |

---

### CP-NAV-026 — Del Movimiento al Resumen se conserva el mes

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Caso de uso · Positivo |
| Trazabilidad | US-69 · CA-10 · C11 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-026-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-026-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).

**Datos de prueba:**

- Mes de partida: agosto de 2026

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /transactions?period=2026-08 a la dirección de la app y apretar Enter. | Se abre Movimientos de agosto de 2026. |
| 2 | Tocar «Resumen» en la barra. | Se abre el Resumen de agosto de 2026: la dirección queda …/dashboard?period=2026-08. |

---

### CP-NAV-027 — Tocar «Registrar» estando en Registrar no pierde lo cargado

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-69 · CA-11 · ADR-024 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-027-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-027-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).

**Datos de prueba:**

- Gasto de ejemplo: 12500 · Comida · Visa BBVA · 06/10/2026 · nota «Almuerzo»

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 12500 en el monto. | El monto muestra 12500 y se habilita «Siguiente». |
| 2 | Tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?») con las categorías. |
| 3 | Tocar la categoría «Comida». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 4 | En «Cuenta», tocar «Visa BBVA». | «Visa BBVA» queda marcada. |
| 5 | En «Fecha», tocar «Otra» y escribir 06/10/2026. | El campo de fecha muestra 06/10/2026. |
| 6 | En «Nota (opcional)» escribir Almuerzo. | La nota muestra «Almuerzo». |
| 7 | Tocar «Registrar» en la barra (sin guardar). | Seguís en el último paso (paso 3 de 3) y todos los datos cargados siguen ahí; no se guardó nada. |

---

### CP-NAV-028 — Escribir /transactions abre Movimientos con la barra nueva

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Caso de uso · Positivo |
| Trazabilidad | US-69 · CA-12 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-028-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-028-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).

**Datos de prueba:**

- Dirección: /transactions

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /transactions a la dirección de la app y apretar Enter. | Se abre Movimientos con la barra «Registrar», «Resumen», «Deudas», «Suscripciones»; «Resumen» está marcado y «Movimientos» no aparece en la barra. |

---

### CP-NAV-029 — El aviso al borrar explica cómo restaurar un gasto

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Caso de uso · Positivo |
| Trazabilidad | US-69 · CA-13 · US-65 · FR-08 · I10 |
| Historias de usuario | US-65, US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-029-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Un gasto ya cargado de $1.200 con fecha 01/09/2026 en una cuota: en Registrar escribir el monto, «Siguiente», elegir una categoría y una cuenta, en «Fecha» tocar «Otra» y escribir 01/09/2026, dejar «1» cuota y tocar «Guardar gasto».
5. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-029-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).

**Datos de prueba:**

- Mes: septiembre de 2026
- Gasto: $1.200

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /transactions?period=2026-09 a la dirección de la app y apretar Enter. | Se abre Movimientos de septiembre de 2026 con la fila de $1.200. |
| 2 | Tocar el tacho de la fila de $1.200. | Se abre «¿Eliminar transacción?» y dice exactamente: «Si te equivocaste, la podés restaurar desde Resumen → Ver todos, en Eliminados.». |
| 3 | Tocar «Cancelar». | El diálogo se cierra y el gasto sigue en la lista. |

---

### CP-NAV-030 — Guardar $12.500 muestra la confirmación completa

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Caso de uso · Positivo |
| Trazabilidad | US-70 · CA-1 · US-10 |
| Historias de usuario | US-10, US-70 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-030-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-030-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).

**Datos de prueba:**

- Gasto de ejemplo: 12500 · Comida · Visa BBVA · una cuota · 06/10/2026 · nota «Almuerzo»

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 12500 en el monto. | El monto muestra 12500 y se habilita «Siguiente». |
| 2 | Tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?») con las categorías. |
| 3 | Tocar la categoría «Comida». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 4 | En «Cuenta», tocar «Visa BBVA». | «Visa BBVA» queda marcada. |
| 5 | En «Fecha», tocar «Otra» y escribir 06/10/2026. | El campo de fecha muestra 06/10/2026. |
| 6 | En «Nota (opcional)» escribir Almuerzo. | La nota muestra «Almuerzo». |
| 7 | Tocar «Guardar gasto». | Aparece «Gasto guardado» con «$12.500,00 · Comida · Visa BBVA» y el botón muestra un tilde y «Guardado». |
| 8 | Esperar 1 segundo. | Se abre el paso 1 de 3 vacío y «Visa BBVA» queda como última cuenta usada. |

---

### CP-NAV-031 — Guardar $120.000 en 12 cuotas lo dice en el aviso

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Caso de uso · Positivo |
| Trazabilidad | US-70 · CA-2 · US-10 · I1, I2 |
| Historias de usuario | US-10, US-70 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-031-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-031-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).

**Datos de prueba:**

- Gasto: 120000 · Tecnología · Visa BBVA · 12 cuotas · 06/10/2026 · nota «Notebook ficticia»

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 120000 en el monto y tocar «Siguiente». | Se abre el paso 2 de 3. |
| 2 | Tocar la categoría «Tecnología». | Se abre el paso 3 de 3. |
| 3 | En «Cuenta» tocar «Visa BBVA» y en «Cuotas» tocar «12». | «Visa BBVA» y «12» quedan marcadas. |
| 4 | En «Fecha» tocar «Otra» y escribir 06/10/2026; en «Nota (opcional)» escribir Notebook ficticia. | Fecha y nota quedan cargadas. |
| 5 | Tocar «Guardar gasto». | Aparece «Gasto guardado» con «$120.000,00 en 12 cuotas · Tecnología · Visa BBVA». |

---

### CP-NAV-032 — Sin internet el gasto no se pierde y aparece «Reintentar»

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Trazabilidad | US-70 · CA-3 · NFR-09 · ADR-034 · I18 |
| Historias de usuario | US-70 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-032-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-032-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
7. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).
8. Internet funcionando normalmente al empezar el caso (la conexión se corta recién en el paso que lo indica).

**Datos de prueba:**

- Gasto de ejemplo: 12500 · Comida · Visa BBVA · una cuota · 06/10/2026 · nota «Almuerzo»

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 12500 en el monto. | El monto muestra 12500 y se habilita «Siguiente». |
| 2 | Tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?») con las categorías. |
| 3 | Tocar la categoría «Comida». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 4 | En «Cuenta», tocar «Visa BBVA». | «Visa BBVA» queda marcada. |
| 5 | En «Fecha», tocar «Otra» y escribir 06/10/2026. | El campo de fecha muestra 06/10/2026. |
| 6 | En «Nota (opcional)» escribir Almuerzo. | La nota muestra «Almuerzo». |
| 7 | Cortar internet: apretar F12, abrir la pestaña «Network» y, en el selector que dice «No throttling», elegir «Offline». | El selector muestra «Offline». |
| 8 | Tocar «Guardar gasto». | Aparece «No se pudo guardar» con el texto «Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.»; el botón ahora dice «Reintentar» y todos los datos siguen cargados. |
| 9 | Devolver internet: en el mismo selector volver a elegir «No throttling». | El selector muestra «No throttling». |

---

### CP-NAV-033 — El aviso de error no desaparece solo

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Transición de estados · Negativo |
| Trazabilidad | US-70 · CA-4 · NFR-09 |
| Historias de usuario | US-70 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-033-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-033-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
7. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).
8. Internet funcionando normalmente al empezar el caso (la conexión se corta recién en el paso que lo indica).

**Datos de prueba:**

- Gasto de ejemplo: 12500 · Comida · Visa BBVA · una cuota · 06/10/2026 · nota «Almuerzo»

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 12500 en el monto. | El monto muestra 12500 y se habilita «Siguiente». |
| 2 | Tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?») con las categorías. |
| 3 | Tocar la categoría «Comida». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 4 | En «Cuenta», tocar «Visa BBVA». | «Visa BBVA» queda marcada. |
| 5 | En «Fecha», tocar «Otra» y escribir 06/10/2026. | El campo de fecha muestra 06/10/2026. |
| 6 | En «Nota (opcional)» escribir Almuerzo. | La nota muestra «Almuerzo». |
| 7 | Cortar internet: apretar F12, abrir la pestaña «Network» y, en el selector que dice «No throttling», elegir «Offline». | El selector muestra «Offline». |
| 8 | Tocar «Guardar gasto». | Aparece «No se pudo guardar» con el texto «Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.»; el botón ahora dice «Reintentar» y todos los datos siguen cargados. |
| 9 | Esperar 30 segundos sin tocar nada. | El aviso completo y el botón «Reintentar» siguen visibles. |
| 10 | Devolver internet: en el mismo selector volver a elegir «No throttling». | El selector muestra «No throttling». |

---

### CP-NAV-034 — Reintentar al volver internet guarda una sola vez

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-70 · CA-5 · NFR-10 · ADR-034 · I18 |
| Historias de usuario | US-70 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-034-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-034-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
7. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).
8. Internet funcionando normalmente al empezar el caso (la conexión se corta recién en el paso que lo indica).

**Datos de prueba:**

- Gasto de ejemplo: 12500 · Comida · Visa BBVA · una cuota · 06/10/2026 · nota «Almuerzo»

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 12500 en el monto. | El monto muestra 12500 y se habilita «Siguiente». |
| 2 | Tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?») con las categorías. |
| 3 | Tocar la categoría «Comida». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 4 | En «Cuenta», tocar «Visa BBVA». | «Visa BBVA» queda marcada. |
| 5 | En «Fecha», tocar «Otra» y escribir 06/10/2026. | El campo de fecha muestra 06/10/2026. |
| 6 | En «Nota (opcional)» escribir Almuerzo. | La nota muestra «Almuerzo». |
| 7 | Cortar internet: apretar F12, abrir la pestaña «Network» y, en el selector que dice «No throttling», elegir «Offline». | El selector muestra «Offline». |
| 8 | Tocar «Guardar gasto». | Aparece «No se pudo guardar» con el texto «Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.»; el botón ahora dice «Reintentar» y todos los datos siguen cargados. |
| 9 | Devolver internet: en el mismo selector volver a elegir «No throttling». | El selector muestra «No throttling». |
| 10 | Tocar «Reintentar». | Aparece «Gasto guardado» con «$12.500,00 · Comida · Visa BBVA», el botón muestra «✓ Guardado» y vuelve al paso 1 vacío. |
| 11 | Agregar /transactions?period=2026-10 a la dirección de la app y apretar Enter. | Movimientos muestra exactamente UNA fila de $12.500,00. |

---

### CP-NAV-035 — Cambiar el monto después del fallo empieza un intento nuevo

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-70 · CA-6 · ADR-034 · I18 |
| Historias de usuario | US-70 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-035-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-035-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
7. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).
8. Internet funcionando normalmente al empezar el caso (la conexión se corta recién en el paso que lo indica).

**Datos de prueba:**

- Gasto de ejemplo: 12500 · Comida · Visa BBVA · una cuota · 06/10/2026 · nota «Almuerzo»

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 12500 en el monto. | El monto muestra 12500 y se habilita «Siguiente». |
| 2 | Tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?») con las categorías. |
| 3 | Tocar la categoría «Comida». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 4 | En «Cuenta», tocar «Visa BBVA». | «Visa BBVA» queda marcada. |
| 5 | En «Fecha», tocar «Otra» y escribir 06/10/2026. | El campo de fecha muestra 06/10/2026. |
| 6 | En «Nota (opcional)» escribir Almuerzo. | La nota muestra «Almuerzo». |
| 7 | Cortar internet: apretar F12, abrir la pestaña «Network» y, en el selector que dice «No throttling», elegir «Offline». | El selector muestra «Offline». |
| 8 | Tocar «Guardar gasto». | Aparece «No se pudo guardar» con el texto «Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.»; el botón ahora dice «Reintentar» y todos los datos siguen cargados. |
| 9 | Tocar el cuadrito «$12.500,00» de arriba. | Se vuelve al paso 1. |
| 10 | Cambiar el monto a 12600. | Desaparece el aviso de error. |
| 11 | Volver a poner 12500. | El aviso NO reaparece. |
| 12 | Tocar «Siguiente» y después la categoría «Comida». | Se abre el paso 3 de 3 y el botón dice «Guardar gasto» (ya no «Reintentar»). |
| 13 | Devolver internet: en el mismo selector volver a elegir «No throttling». | El selector muestra «No throttling». |

---

### CP-NAV-036 — Guardar el gasto corregido elimina el pendiente anterior

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-70 · CA-6b · NFR-09 · NFR-10 · I18 |
| Historias de usuario | US-70 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-036-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-036-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
7. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).
8. Internet funcionando normalmente al empezar el caso (la conexión se corta recién en el paso que lo indica).

**Datos de prueba:**

- Gasto de ejemplo: 12500 · Comida · Visa BBVA · una cuota · 06/10/2026 · nota «Almuerzo»

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 12500 en el monto. | El monto muestra 12500 y se habilita «Siguiente». |
| 2 | Tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?») con las categorías. |
| 3 | Tocar la categoría «Comida». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 4 | En «Cuenta», tocar «Visa BBVA». | «Visa BBVA» queda marcada. |
| 5 | En «Fecha», tocar «Otra» y escribir 06/10/2026. | El campo de fecha muestra 06/10/2026. |
| 6 | En «Nota (opcional)» escribir Almuerzo. | La nota muestra «Almuerzo». |
| 7 | Cortar internet: apretar F12, abrir la pestaña «Network» y, en el selector que dice «No throttling», elegir «Offline». | El selector muestra «Offline». |
| 8 | Tocar «Guardar gasto». | Aparece «No se pudo guardar» con el texto «Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.»; el botón ahora dice «Reintentar» y todos los datos siguen cargados. |
| 9 | Tocar el cuadrito «$12.500,00» y cambiar el monto a 12600. | El monto cambia y el aviso desaparece. |
| 10 | Devolver internet: en el mismo selector volver a elegir «No throttling». | El selector muestra «No throttling». |
| 11 | Tocar «Siguiente», elegir «Comida» y tocar «Guardar gasto». | Aparece «Gasto guardado» con «$12.600,00 · Comida · Visa BBVA». |
| 12 | Tocar «Resumen» y después «Registrar». | Registrar abre en el paso 1 y no aparece el aviso de movimientos sin guardar. |
| 13 | Agregar /transactions?period=2026-10 a la dirección de la app y apretar Enter. | Hay exactamente una fila, de $12.600,00. |

---

### CP-NAV-037 — Dos fallos seguidos dejan un solo pendiente

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Trazabilidad | US-70 · CA-6c · ADR-034 · I18 |
| Historias de usuario | US-70 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-037-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-037-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
7. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).
8. Internet funcionando normalmente al empezar el caso (la conexión se corta recién en el paso que lo indica).

**Datos de prueba:**

- Gasto de ejemplo: 12500 · Comida · Visa BBVA · una cuota · 06/10/2026 · nota «Almuerzo»

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 12500 en el monto. | El monto muestra 12500 y se habilita «Siguiente». |
| 2 | Tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?») con las categorías. |
| 3 | Tocar la categoría «Comida». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 4 | En «Cuenta», tocar «Visa BBVA». | «Visa BBVA» queda marcada. |
| 5 | En «Fecha», tocar «Otra» y escribir 06/10/2026. | El campo de fecha muestra 06/10/2026. |
| 6 | En «Nota (opcional)» escribir Almuerzo. | La nota muestra «Almuerzo». |
| 7 | Cortar internet: apretar F12, abrir la pestaña «Network» y, en el selector que dice «No throttling», elegir «Offline». | El selector muestra «Offline». |
| 8 | Tocar «Guardar gasto». | Aparece «No se pudo guardar» con el texto «Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.»; el botón ahora dice «Reintentar» y todos los datos siguen cargados. |
| 9 | Tocar el cuadrito «$12.500,00», cambiar el monto a 12600, tocar «Siguiente» y elegir «Comida». | Se abre el paso 3 de 3 con el botón «Guardar gasto». |
| 10 | Tocar «Guardar gasto» (sigue sin internet). | Vuelve a fallar: «No se pudo guardar», el texto de conexión y «Reintentar». |
| 11 | Devolver internet: en el mismo selector volver a elegir «No throttling». | El selector muestra «No throttling». |
| 12 | Tocar «Resumen» y después «Registrar». | Aparece «Tenés 1 movimiento sin guardar» con UNA sola fila: «Gasto · $12.600,00 · Comida · 06/10/2026». |

---

### CP-NAV-038 — Con internet muy lenta, a los 15 segundos avisa que falló

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-70 · CA-7 · ADR-034 |
| Historias de usuario | US-70 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-038-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-038-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
7. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).
8. Internet funcionando normalmente al empezar el caso (la conexión se corta recién en el paso que lo indica).
9. Perfil de red lento creado en Chrome: F12 → «Network» → selector «No throttling» → «Add…» (agregar perfil personalizado), con nombre «NAV-20s», latencia 20000 ms, descarga 1000 kb/s, subida 1000 kb/s. Un cronómetro con décimas de segundo (por ejemplo el del celular).

**Datos de prueba:**

- Gasto de ejemplo: 12500 · Comida · Visa BBVA · una cuota · 06/10/2026 · nota «Almuerzo»
- Perfil de red: NAV-20s (latencia 20000 ms, 1000 kb/s)

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 12500 en el monto. | El monto muestra 12500 y se habilita «Siguiente». |
| 2 | Tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?») con las categorías. |
| 3 | Tocar la categoría «Comida». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 4 | En «Cuenta», tocar «Visa BBVA». | «Visa BBVA» queda marcada. |
| 5 | En «Fecha», tocar «Otra» y escribir 06/10/2026. | El campo de fecha muestra 06/10/2026. |
| 6 | En «Nota (opcional)» escribir Almuerzo. | La nota muestra «Almuerzo». |
| 7 | En «Network» elegir el perfil «NAV-20s». | El selector muestra «NAV-20s». |
| 8 | Iniciar el cronómetro y tocar «Guardar gasto». | El botón dice «Guardando…», queda deshabilitado y la pantalla queda «ocupada». |
| 9 | Detener el cronómetro cuando aparezca «No se pudo guardar». | El error aparece entre los 14 y los 16 segundos, con «Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.» y el botón «Reintentar». |
| 10 | Devolver internet: en el mismo selector volver a elegir «No throttling». | El selector muestra «No throttling». |

---

### CP-NAV-039 — Reintentar no duplica un gasto que ya se había guardado

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-70 · CA-8 · NFR-10 · ADR-034 · I18 |
| Historias de usuario | US-70 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-039-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-039-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
7. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).
8. Internet funcionando normalmente al empezar el caso (la conexión se corta recién en el paso que lo indica).
9. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
10. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-nav-039-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
11. Identificadores de la categoría «Comida» y de la cuenta «Visa BBVA»: pedidos GET a SUPABASE_URL/rest/v1/categories?select=id,name y SUPABASE_URL/rest/v1/accounts?select=id,name,type con los encabezados «apikey» = ANON_KEY y «Authorization» = Bearer + el token. Anotar el «id» de «Comida» (ID_COMIDA) y el de «Visa BBVA» (ID_VISA).
12. Gasto ya creado por API con una clave fija (para imitar que sí llegó a guardarse): con Postman, pedido POST a SUPABASE_URL/rest/v1/rpc/create_transaction con los encabezados apikey, Authorization (Bearer + token) y Content-Type, y el cuerpo {"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"ID_COMIDA","p_account_id":"ID_VISA","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"39000000-0000-4000-8000-000000000039"}. Debe responder 200 con un identificador. Después de crearlo, cerrar la sesión de la app y volver a entrar con el usuario de prueba.

**Datos de prueba:**

- Gasto de ejemplo: 12500 · Comida · Visa BBVA · una cuota · 06/10/2026 · nota «Almuerzo»
- Clave fija: 39000000-0000-4000-8000-000000000039

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Apretar Ctrl+Shift+J (abre la consola) y pegar: window.__navUuid=crypto.randomUUID.bind(crypto);Object.defineProperty(crypto,'randomUUID',{configurable:true,value:()=>"39000000-0000-4000-8000-000000000039"}) y Enter. | La consola devuelve «undefined» (el reintento va a usar la clave fija). |
| 2 | En Registrar, escribir 12500 en el monto. | El monto muestra 12500 y se habilita «Siguiente». |
| 3 | Tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?») con las categorías. |
| 4 | Tocar la categoría «Comida». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 5 | En «Cuenta», tocar «Visa BBVA». | «Visa BBVA» queda marcada. |
| 6 | En «Fecha», tocar «Otra» y escribir 06/10/2026. | El campo de fecha muestra 06/10/2026. |
| 7 | En «Nota (opcional)» escribir Almuerzo. | La nota muestra «Almuerzo». |
| 8 | Cortar internet: apretar F12, abrir la pestaña «Network» y, en el selector que dice «No throttling», elegir «Offline». | El selector muestra «Offline». |
| 9 | Tocar «Guardar gasto». | Aparece «No se pudo guardar» con el texto «Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.»; el botón ahora dice «Reintentar» y todos los datos siguen cargados. |
| 10 | Devolver internet: en el mismo selector volver a elegir «No throttling». | El selector muestra «No throttling». |
| 11 | Tocar «Reintentar». | Aparece «Gasto guardado» con «$12.500,00 · Comida · Visa BBVA». |
| 12 | Agregar /transactions?period=2026-10 a la dirección de la app y apretar Enter. | Hay exactamente UNA fila de $12.500,00 (no dos). |
| 13 | En la consola pegar: Object.defineProperty(crypto,'randomUUID',{configurable:true,value:window.__navUuid});delete window.__navUuid | Devuelve «true» (se restaura el funcionamiento normal). |

---

### CP-NAV-040 — La misma clave dos veces seguidas devuelve el mismo gasto

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Caso de uso · Positivo |
| Trazabilidad | US-70 · CA-9 · NFR-10 · ADR-034 · I18 |
| Historias de usuario | US-70 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-040-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
7. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-nav-040-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
8. Identificadores de la categoría «Comida» y de la cuenta «Visa BBVA»: pedidos GET a SUPABASE_URL/rest/v1/categories?select=id,name y SUPABASE_URL/rest/v1/accounts?select=id,name,type con los encabezados «apikey» = ANON_KEY y «Authorization» = Bearer + el token. Anotar el «id» de «Comida» (ID_COMIDA) y el de «Visa BBVA» (ID_VISA).

**Datos de prueba:**

- Clave de reintento: 40000000-0000-4000-8000-000000000040

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Postman, pedido POST a SUPABASE_URL/rest/v1/rpc/create_transaction con los encabezados «apikey» = ANON_KEY, «Authorization» = Bearer + token y «Content-Type: application/json», y este cuerpo: {"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"ID_COMIDA","p_account_id":"ID_VISA","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"40000000-0000-4000-8000-000000000040"} | Responde 200 y un identificador (anotarlo como ID-1). |
| 2 | Enviar exactamente el mismo pedido otra vez. | Responde 200 y exactamente el mismo ID-1. |
| 3 | Pedido GET a SUPABASE_URL/rest/v1/transactions?select=id,amount_text:amount::text,request_id,deleted_at&request_id=eq.40000000-0000-4000-8000-000000000040 con los mismos encabezados. | Responde 200 con UNA sola fila: id = ID-1, amount_text = "12500.00", la clave indicada y deleted_at = null. |
| 4 | Pedido GET a SUPABASE_URL/rest/v1/ledger_entries?select=transaction_id,installment_number,amount_text:amount::text&transaction_id=eq.ID-1 con los mismos encabezados. | Responde 200 con UNA sola fila: installment_number = 1 y amount_text = "12500.00". |

---

### CP-NAV-041 — Dos pedidos simultáneos con la misma clave crean un solo gasto

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Adivinación de errores · Positivo |
| Trazabilidad | US-70 · CA-10 · NFR-10 · ADR-034 · I18 |
| Historias de usuario | US-70 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-041-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
7. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-nav-041-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
8. Identificadores de la categoría «Comida» y de la cuenta «Visa BBVA»: pedidos GET a SUPABASE_URL/rest/v1/categories?select=id,name y SUPABASE_URL/rest/v1/accounts?select=id,name,type con los encabezados «apikey» = ANON_KEY y «Authorization» = Bearer + el token. Anotar el «id» de «Comida» (ID_COMIDA) y el de «Visa BBVA» (ID_VISA).

**Datos de prueba:**

- Clave de reintento: 41000000-0000-4000-8000-000000000041

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Preparar DOS pedidos idénticos (como el paso 1 del caso anterior) con la clave 41000000-0000-4000-8000-000000000041 y enviarlos al mismo tiempo (por ejemplo, con el runner de Postman con 2 iteraciones en paralelo, o el script de PowerShell «NAV-CONC-01» del caso original). | Los dos responden 200 con el mismo identificador (ID-1) y ninguno devuelve el código 23505. |
| 2 | Pedido GET a SUPABASE_URL/rest/v1/transactions?select=id,amount_text:amount::text,request_id,deleted_at&request_id=eq.41000000-0000-4000-8000-000000000041 con los mismos encabezados. | Responde 200 con UNA sola fila: id = ID-1, amount_text = "12500.00" y deleted_at = null. |
| 3 | Pedido GET a SUPABASE_URL/rest/v1/ledger_entries?select=transaction_id,installment_number,amount_text:amount::text&transaction_id=eq.ID-1 con los mismos encabezados. | Responde 200 con UNA sola fila: installment_number = 1 y amount_text = "12500.00". |

---

### CP-NAV-042 — Claves distintas con el mismo contenido crean dos gastos

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Trazabilidad | US-70 · CA-11 · ADR-034 · I18 |
| Historias de usuario | US-70 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-042-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
7. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-nav-042-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
8. Identificadores de la categoría «Comida» y de la cuenta «Visa BBVA»: pedidos GET a SUPABASE_URL/rest/v1/categories?select=id,name y SUPABASE_URL/rest/v1/accounts?select=id,name,type con los encabezados «apikey» = ANON_KEY y «Authorization» = Bearer + el token. Anotar el «id» de «Comida» (ID_COMIDA) y el de «Visa BBVA» (ID_VISA).

**Datos de prueba:**

- Clave de reintento: 42000000-0000-4000-8000-000000000042 y 42000000-0000-4000-8000-000000000043

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Postman, pedido POST a SUPABASE_URL/rest/v1/rpc/create_transaction con los encabezados «apikey» = ANON_KEY, «Authorization» = Bearer + token y «Content-Type: application/json», y este cuerpo: {"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"ID_COMIDA","p_account_id":"ID_VISA","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"42000000-0000-4000-8000-000000000042"} | Responde 200 y un identificador (ID-1). |
| 2 | En Postman, pedido POST a SUPABASE_URL/rest/v1/rpc/create_transaction con los encabezados «apikey» = ANON_KEY, «Authorization» = Bearer + token y «Content-Type: application/json», y este cuerpo: {"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"ID_COMIDA","p_account_id":"ID_VISA","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"42000000-0000-4000-8000-000000000043"} (misma información, otra clave). | Responde 200 y otro identificador distinto (ID-2). |
| 3 | Pedido GET a SUPABASE_URL/rest/v1/transactions?select=id,amount_text:amount::text,request_id&request_id=in.(42000000-0000-4000-8000-000000000042,42000000-0000-4000-8000-000000000043)&order=request_id con los mismos encabezados. | Responde 200 con DOS filas, ambas con amount_text = "12500.00", ids distintos y las dos claves. |
| 4 | Pedido GET a SUPABASE_URL/rest/v1/ledger_entries?select=transaction_id,installment_number,amount_text:amount::text&transaction_id=in.(ID-1,ID-2)&order=transaction_id con los mismos encabezados. | Responde 200 con DOS filas (una por gasto), ambas con installment_number = 1 y amount_text = "12500.00". |

---

### CP-NAV-043 — La misma clave en dos usuarios distintos no se pisa

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Adivinación de errores · Positivo |
| Trazabilidad | US-70 · CA-12 · C7 · ADR-034 · I18 |
| Historias de usuario | US-70 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-043-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
7. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-nav-043-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
8. Identificadores de la categoría «Comida» y de la cuenta «Visa BBVA»: pedidos GET a SUPABASE_URL/rest/v1/categories?select=id,name y SUPABASE_URL/rest/v1/accounts?select=id,name,type con los encabezados «apikey» = ANON_KEY y «Authorization» = Bearer + el token. Anotar el «id» de «Comida» (ID_COMIDA) y el de «Visa BBVA» (ID_VISA).
9. Segundo usuario de prueba (B): crearlo igual que el primero con el email qa+cp-nav-043-002@example.com (Clave123!), con su propia cuenta «Visa BBVA» y categorías «Comida» y «Tecnología», y obtener también su token e identificadores. El primer usuario es A.

**Datos de prueba:**

- Clave de reintento: 43000000-0000-4000-8000-000000000043

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Con el token del usuario A: En Postman, pedido POST a SUPABASE_URL/rest/v1/rpc/create_transaction con los encabezados «apikey» = ANON_KEY, «Authorization» = Bearer + token y «Content-Type: application/json», y este cuerpo: {"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"ID_COMIDA","p_account_id":"ID_VISA","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"43000000-0000-4000-8000-000000000043"} | Responde 200 y un identificador (ID-A). |
| 2 | Con el token del usuario B: el mismo pedido (con los ID_COMIDA e ID_VISA propios de B). | Responde 200 y un identificador distinto (ID-B). |
| 3 | Con el token de A: pedido GET a SUPABASE_URL/rest/v1/transactions?select=id,user_id,request_id&request_id=eq.43000000-0000-4000-8000-000000000043. | Responde 200 con UNA fila: id = ID-A y el user_id de A. |
| 4 | Con el token de B: el mismo pedido GET. | Responde 200 con UNA fila: id = ID-B y el user_id de B; no aparece ID-A. |

**Notas del diseño:** Este caso necesita dos usuarios: A (qa+cp-nav-043-001@example.com) y B (qa+cp-nav-043-002@example.com).

---

### CP-NAV-044 — La misma clave con otro monto conserva el gasto original

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Trazabilidad | US-70 · CA-13 · ADR-034 · I18 |
| Historias de usuario | US-70 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-044-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
7. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-nav-044-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
8. Identificadores de la categoría «Comida» y de la cuenta «Visa BBVA»: pedidos GET a SUPABASE_URL/rest/v1/categories?select=id,name y SUPABASE_URL/rest/v1/accounts?select=id,name,type con los encabezados «apikey» = ANON_KEY y «Authorization» = Bearer + el token. Anotar el «id» de «Comida» (ID_COMIDA) y el de «Visa BBVA» (ID_VISA).

**Datos de prueba:**

- Clave de reintento: 44000000-0000-4000-8000-000000000044

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Postman, pedido POST a SUPABASE_URL/rest/v1/rpc/create_transaction con los encabezados «apikey» = ANON_KEY, «Authorization» = Bearer + token y «Content-Type: application/json», y este cuerpo: {"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"ID_COMIDA","p_account_id":"ID_VISA","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"44000000-0000-4000-8000-000000000044"} | Responde 200 y un identificador (ID-1). |
| 2 | En Postman, pedido POST a SUPABASE_URL/rest/v1/rpc/create_transaction con los encabezados «apikey» = ANON_KEY, «Authorization» = Bearer + token y «Content-Type: application/json», y este cuerpo: {"p_type":"expense","p_amount":"12600.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"ID_COMIDA","p_account_id":"ID_VISA","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"44000000-0000-4000-8000-000000000044"} (misma clave, monto distinto: 12600). | Responde 200 y exactamente el mismo ID-1. |
| 3 | Pedido GET a SUPABASE_URL/rest/v1/transactions?select=id,amount_text:amount::text,request_id,deleted_at&request_id=eq.44000000-0000-4000-8000-000000000044 con los mismos encabezados. | Responde 200 con UNA fila: id = ID-1, amount_text = "12500.00" y deleted_at = null; no hay ninguna fila de 12600.00. |

---

### CP-NAV-045 — La misma clave sigue funcionando después de archivar la categoría

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-70 · CA-14 · ADR-034 · I18 |
| Historias de usuario | US-70 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-045-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
7. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-nav-045-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
8. Identificadores de la categoría «Comida» y de la cuenta «Visa BBVA»: pedidos GET a SUPABASE_URL/rest/v1/categories?select=id,name y SUPABASE_URL/rest/v1/accounts?select=id,name,type con los encabezados «apikey» = ANON_KEY y «Authorization» = Bearer + el token. Anotar el «id» de «Comida» (ID_COMIDA) y el de «Visa BBVA» (ID_VISA).

**Datos de prueba:**

- Clave de reintento: 45000000-0000-4000-8000-000000000045

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Postman, pedido POST a SUPABASE_URL/rest/v1/rpc/create_transaction con los encabezados «apikey» = ANON_KEY, «Authorization» = Bearer + token y «Content-Type: application/json», y este cuerpo: {"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"ID_COMIDA","p_account_id":"ID_VISA","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"45000000-0000-4000-8000-000000000045"} | Responde 200 y un identificador (ID-1). |
| 2 | Pedido PATCH a SUPABASE_URL/rest/v1/categories?id=eq.ID_COMIDA con los mismos encabezados, «Prefer: return=minimal» y cuerpo {"archived_at":"2026-10-12T12:00:00Z"}. | Responde 204 y el cuerpo vacío (la categoría queda archivada). |
| 3 | Enviar otra vez exactamente el pedido del paso 1. | Responde 200 y exactamente el mismo ID-1, sin error. |
| 4 | Pedido GET a SUPABASE_URL/rest/v1/transactions?select=id,amount_text:amount::text,request_id,deleted_at&request_id=eq.45000000-0000-4000-8000-000000000045 con los mismos encabezados. | Responde 200 con UNA fila: id = ID-1, amount_text = "12500.00" y la clave indicada. |

---

### CP-NAV-046 — Sin clave, cada llamada crea un gasto distinto

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Trazabilidad | US-70 · CA-15 · ADR-034 |
| Historias de usuario | US-70 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-046-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
7. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-nav-046-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
8. Identificadores de la categoría «Comida» y de la cuenta «Visa BBVA»: pedidos GET a SUPABASE_URL/rest/v1/categories?select=id,name y SUPABASE_URL/rest/v1/accounts?select=id,name,type con los encabezados «apikey» = ANON_KEY y «Authorization» = Bearer + el token. Anotar el «id» de «Comida» (ID_COMIDA) y el de «Visa BBVA» (ID_VISA).

**Datos de prueba:**

- Clave de reintento: ninguna (p_request_id = null)

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Postman, pedido POST a SUPABASE_URL/rest/v1/rpc/create_transaction con los encabezados «apikey» = ANON_KEY, «Authorization» = Bearer + token y «Content-Type: application/json», y este cuerpo: {"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"ID_COMIDA","p_account_id":"ID_VISA","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":null} | Responde 200 y un identificador (ID-1). |
| 2 | Enviar exactamente el mismo pedido otra vez. | Responde 200 y otro identificador distinto (ID-2). |
| 3 | Pedido GET a SUPABASE_URL/rest/v1/transactions?select=id,amount_text:amount::text,request_id&amount=eq.12500.00&order=id con los mismos encabezados. | Responde 200 con DOS filas, ids distintos, amount_text = "12500.00" y request_id = null. |
| 4 | Pedido GET a SUPABASE_URL/rest/v1/ledger_entries?select=transaction_id,installment_number,amount_text:amount::text&transaction_id=in.(ID-1,ID-2)&order=transaction_id con los mismos encabezados. | Responde 200 con DOS filas (una por gasto), installment_number = 1 y amount_text = "12500.00". |

---

### CP-NAV-047 — Si se archiva la categoría antes de guardar, el gasto se rechaza con aviso

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Trazabilidad | US-70 · CA-16 · C6 |
| Historias de usuario | US-70 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-047-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-047-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
7. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).
8. Internet funcionando normalmente al empezar el caso (la conexión se corta recién en el paso que lo indica).

**Datos de prueba:**

- Gasto de ejemplo: 12500 · Comida · Visa BBVA · una cuota · 06/10/2026 · nota «Almuerzo»
- Pestañas: dos pestañas del mismo navegador (misma ventana de incógnito)

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 12500 en el monto. | El monto muestra 12500 y se habilita «Siguiente». |
| 2 | Tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?») con las categorías. |
| 3 | Tocar la categoría «Comida». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 4 | En «Cuenta», tocar «Visa BBVA». | «Visa BBVA» queda marcada. |
| 5 | En «Fecha», tocar «Otra» y escribir 06/10/2026. | El campo de fecha muestra 06/10/2026. |
| 6 | En «Nota (opcional)» escribir Almuerzo. | La nota muestra «Almuerzo». |
| 7 | Abrir una segunda pestaña en la misma ventana de incógnito, ir a Ajustes (agregar /settings a la dirección de la app) y tocar el botón de archivar de «Comida» («Archivar Comida»). | «Comida» pasa a la lista de categorías archivadas. |
| 8 | Volver a la primera pestaña. | Se ve el paso 3 con $12.500,00, «Comida» y «Visa BBVA». |
| 9 | Tocar «Guardar gasto». | Aparece «No se pudo guardar» con «la categoría no existe, no es tuya o está archivada»; el botón sigue diciendo «Guardar gasto» (no «Reintentar»). |
| 10 | Verificación adicional: F12 → «Console», pegar localStorage.getItem('biyu:pending-drafts:') y Enter. | Devuelve null o una lista que no contiene el gasto de 12500 (no quedó pendiente). |

---

### CP-NAV-048 — La API rechaza un gasto con una categoría archivada

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Trazabilidad | US-70 · CA-16 · C6 |
| Historias de usuario | US-70 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-048-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
7. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-nav-048-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
8. Identificadores de la categoría «Comida» y de la cuenta «Visa BBVA»: pedidos GET a SUPABASE_URL/rest/v1/categories?select=id,name y SUPABASE_URL/rest/v1/accounts?select=id,name,type con los encabezados «apikey» = ANON_KEY y «Authorization» = Bearer + el token. Anotar el «id» de «Comida» (ID_COMIDA) y el de «Visa BBVA» (ID_VISA).

**Datos de prueba:**

- Clave de reintento: 48000000-0000-4000-8000-000000000048

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Archivar la categoría «Comida» por API: pedido PATCH a SUPABASE_URL/rest/v1/categories?id=eq.ID_COMIDA con los mismos encabezados, «Prefer: return=minimal» y cuerpo {"archived_at":"2026-10-12T12:00:00Z"}. | Responde 204. |
| 2 | En Postman, pedido POST a SUPABASE_URL/rest/v1/rpc/create_transaction con los encabezados «apikey» = ANON_KEY, «Authorization» = Bearer + token y «Content-Type: application/json», y este cuerpo: {"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"ID_COMIDA","p_account_id":"ID_VISA","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"48000000-0000-4000-8000-000000000048"} | Responde 409 con el código 23503 y el mensaje «la categoría no existe, no es tuya o está archivada»; no devuelve ningún identificador. |
| 3 | Pedido GET a SUPABASE_URL/rest/v1/transactions?select=id,request_id&request_id=eq.48000000-0000-4000-8000-000000000048 con los mismos encabezados. | Responde 200 y el cuerpo es exactamente [] (no se creó el gasto). |
| 4 | Pedido GET a SUPABASE_URL/rest/v1/ledger_entries?select=id,transaction_id con los mismos encabezados. | Responde 200 y el cuerpo es exactamente [] (no hay cuotas). |

---

### CP-NAV-049 — Al volver a Registrar aparece el gasto pendiente

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-70 · CA-17 · NFR-09 |
| Historias de usuario | US-70 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-049-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-049-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
7. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).
8. Internet funcionando normalmente al empezar el caso (la conexión se corta recién en el paso que lo indica).

**Datos de prueba:**

- Gasto de ejemplo: 12500 · Comida · Visa BBVA · una cuota · 06/10/2026 · nota «Almuerzo»

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 12500 en el monto. | El monto muestra 12500 y se habilita «Siguiente». |
| 2 | Tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?») con las categorías. |
| 3 | Tocar la categoría «Comida». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 4 | En «Cuenta», tocar «Visa BBVA». | «Visa BBVA» queda marcada. |
| 5 | En «Fecha», tocar «Otra» y escribir 06/10/2026. | El campo de fecha muestra 06/10/2026. |
| 6 | En «Nota (opcional)» escribir Almuerzo. | La nota muestra «Almuerzo». |
| 7 | Cortar internet: apretar F12, abrir la pestaña «Network» y, en el selector que dice «No throttling», elegir «Offline». | El selector muestra «Offline». |
| 8 | Tocar «Guardar gasto». | Aparece «No se pudo guardar» con el texto «Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.»; el botón ahora dice «Reintentar» y todos los datos siguen cargados. |
| 9 | Devolver internet: en el mismo selector volver a elegir «No throttling». | El selector muestra «No throttling». |
| 10 | Tocar «Resumen» y después «Registrar». | Arriba aparece «Tenés 1 movimiento sin guardar» con «Gasto · $12.500,00 · Comida · 06/10/2026» y los botones «Recuperar» y «Descartar». |

---

### CP-NAV-050 — Al recargar la página sigue el gasto pendiente

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-70 · CA-17 · NFR-09 |
| Historias de usuario | US-70 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-050-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-050-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
7. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).
8. Internet funcionando normalmente al empezar el caso (la conexión se corta recién en el paso que lo indica).

**Datos de prueba:**

- Gasto de ejemplo: 12500 · Comida · Visa BBVA · una cuota · 06/10/2026 · nota «Almuerzo»

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 12500 en el monto. | El monto muestra 12500 y se habilita «Siguiente». |
| 2 | Tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?») con las categorías. |
| 3 | Tocar la categoría «Comida». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 4 | En «Cuenta», tocar «Visa BBVA». | «Visa BBVA» queda marcada. |
| 5 | En «Fecha», tocar «Otra» y escribir 06/10/2026. | El campo de fecha muestra 06/10/2026. |
| 6 | En «Nota (opcional)» escribir Almuerzo. | La nota muestra «Almuerzo». |
| 7 | Cortar internet: apretar F12, abrir la pestaña «Network» y, en el selector que dice «No throttling», elegir «Offline». | El selector muestra «Offline». |
| 8 | Tocar «Guardar gasto». | Aparece «No se pudo guardar» con el texto «Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.»; el botón ahora dice «Reintentar» y todos los datos siguen cargados. |
| 9 | Devolver internet: en el mismo selector volver a elegir «No throttling». | El selector muestra «No throttling». |
| 10 | Apretar Ctrl+R para recargar la página. | Registrar se recarga en el paso 1 y muestra «Tenés 1 movimiento sin guardar» con «Gasto · $12.500,00 · Comida · 06/10/2026», «Recuperar» y «Descartar». |

---

### CP-NAV-051 — Dos gastos fallidos: dos pendientes, el más nuevo primero

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-70 · CA-18 · NFR-09 |
| Historias de usuario | US-70 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-051-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-051-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
7. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).
8. Internet funcionando normalmente al empezar el caso (la conexión se corta recién en el paso que lo indica).

**Datos de prueba:**

- Gasto de ejemplo: 12500 · Comida · Visa BBVA · una cuota · 06/10/2026 · nota «Almuerzo»
- Segundo gasto: 3400 · Comida · Visa BBVA · 05/10/2026 · nota «Café»

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 12500 en el monto. | El monto muestra 12500 y se habilita «Siguiente». |
| 2 | Tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?») con las categorías. |
| 3 | Tocar la categoría «Comida». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 4 | En «Cuenta», tocar «Visa BBVA». | «Visa BBVA» queda marcada. |
| 5 | En «Fecha», tocar «Otra» y escribir 06/10/2026. | El campo de fecha muestra 06/10/2026. |
| 6 | En «Nota (opcional)» escribir Almuerzo. | La nota muestra «Almuerzo». |
| 7 | Cortar internet: apretar F12, abrir la pestaña «Network» y, en el selector que dice «No throttling», elegir «Offline». | El selector muestra «Offline». |
| 8 | Tocar «Guardar gasto». | Aparece «No se pudo guardar» con el texto «Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.»; el botón ahora dice «Reintentar» y todos los datos siguen cargados. |
| 9 | Devolver internet: en el mismo selector volver a elegir «No throttling». | El selector muestra «No throttling». |
| 10 | Tocar «Resumen» en la barra de abajo. | Se abre el Resumen. |
| 11 | Tocar «Registrar» en la barra de abajo. | Se abre Registrar en el paso 1 y arriba aparece «Tenés 1 movimiento sin guardar» con la fila «Gasto · $12.500,00 · Comida · 06/10/2026» y los botones «Recuperar» y «Descartar». |
| 12 | En el paso 1 escribir 3400 y tocar «Siguiente»; elegir «Comida»; cuenta «Visa BBVA»; fecha «Otra» 05/10/2026; nota «Café». | El segundo gasto queda cargado en el paso 3. |
| 13 | Cortar internet: apretar F12, abrir la pestaña «Network» y, en el selector que dice «No throttling», elegir «Offline». | El selector muestra «Offline». |
| 14 | Tocar «Guardar gasto». | Aparece el aviso de conexión y el botón «Reintentar». |
| 15 | Devolver internet: en el mismo selector volver a elegir «No throttling». | El selector muestra «No throttling». |
| 16 | Tocar «Resumen» y después «Registrar». | Aparece «Tenés 2 movimientos sin guardar»: primero «Gasto · $3.400,00 · Comida · 05/10/2026» (el más reciente) y después «Gasto · $12.500,00 · Comida · 06/10/2026», cada uno con «Recuperar» y «Descartar». |

---

### CP-NAV-052 — Recuperar un gasto en dólares conserva fecha y tipo de cambio

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-70 · CA-19 · C5 · NFR-09 |
| Historias de usuario | US-70 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-052-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-052-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
7. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).
8. Internet funcionando normalmente al empezar el caso (la conexión se corta recién en el paso que lo indica).

**Datos de prueba:**

- Gasto en dólares: US$ 50 · tipo de cambio 1500 · Comida · Visa BBVA · 30/09/2026 · nota «Cena ficticia»

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar tocar «US$», escribir 50 en el monto y 1500 en «Tipo de cambio (ARS por US$)». | Se habilita «Siguiente». |
| 2 | Tocar «Siguiente», elegir «Comida», cuenta «Visa BBVA», fecha «Otra» 30/09/2026 y nota «Cena ficticia». | Todo queda cargado en el paso 3. |
| 3 | Cortar internet: apretar F12, abrir la pestaña «Network» y, en el selector que dice «No throttling», elegir «Offline». | El selector muestra «Offline». |
| 4 | Tocar «Guardar gasto». | Aparece «No se pudo guardar» y el botón «Reintentar». |
| 5 | Devolver internet: en el mismo selector volver a elegir «No throttling». | El selector muestra «No throttling». |
| 6 | Tocar «Resumen», después «Registrar» y después «Recuperar». | Se abre el paso 3 de 3 con US$50,00, tipo de cambio 1500, fecha 30/09/2026, categoría «Comida», cuenta «Visa BBVA» y nota «Cena ficticia»; el botón dice «Guardar gasto». |
| 7 | Tocar «Guardar gasto». | Aparece «Gasto guardado» con «US$50,00 · Comida · Visa BBVA» y vuelve al paso 1. |
| 8 | Tocar «Resumen» y después «Registrar». | Registrar abre en el paso 1 sin el aviso de pendientes. |

---

### CP-NAV-053 — Recuperar un gasto que en realidad ya estaba guardado

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-70 · CA-20 · I18 · C6 |
| Historias de usuario | US-70 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-053-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-053-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
7. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).
8. Internet funcionando normalmente al empezar el caso (la conexión se corta recién en el paso que lo indica).
9. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
10. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-nav-053-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
11. Identificadores de la categoría «Comida» y de la cuenta «Visa BBVA»: pedidos GET a SUPABASE_URL/rest/v1/categories?select=id,name y SUPABASE_URL/rest/v1/accounts?select=id,name,type con los encabezados «apikey» = ANON_KEY y «Authorization» = Bearer + el token. Anotar el «id» de «Comida» (ID_COMIDA) y el de «Visa BBVA» (ID_VISA).
12. Gasto ya creado por API con la clave fija 53000000-0000-4000-8000-000000000053: pedido POST a SUPABASE_URL/rest/v1/rpc/create_transaction con los encabezados apikey, Authorization (Bearer + token) y Content-Type, y el cuerpo {"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"ID_COMIDA","p_account_id":"ID_VISA","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"53000000-0000-4000-8000-000000000053"}. Debe responder 200 con un identificador. Después, cerrar la sesión de la app y volver a entrar con el usuario de prueba.

**Datos de prueba:**

- Gasto de ejemplo: 12500 · Comida · Visa BBVA · una cuota · 06/10/2026 · nota «Almuerzo»
- Clave fija: 53000000-0000-4000-8000-000000000053

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Apretar Ctrl+Shift+J y pegar: window.__navUuid=crypto.randomUUID.bind(crypto);Object.defineProperty(crypto,'randomUUID',{configurable:true,value:()=>"53000000-0000-4000-8000-000000000053"}) y Enter. | La consola devuelve «undefined». |
| 2 | En Registrar, escribir 12500 en el monto. | El monto muestra 12500 y se habilita «Siguiente». |
| 3 | Tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?») con las categorías. |
| 4 | Tocar la categoría «Comida». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 5 | En «Cuenta», tocar «Visa BBVA». | «Visa BBVA» queda marcada. |
| 6 | En «Fecha», tocar «Otra» y escribir 06/10/2026. | El campo de fecha muestra 06/10/2026. |
| 7 | En «Nota (opcional)» escribir Almuerzo. | La nota muestra «Almuerzo». |
| 8 | Cortar internet: apretar F12, abrir la pestaña «Network» y, en el selector que dice «No throttling», elegir «Offline». | El selector muestra «Offline». |
| 9 | Tocar «Guardar gasto». | Aparece «No se pudo guardar» con el texto «Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.»; el botón ahora dice «Reintentar» y todos los datos siguen cargados. |
| 10 | Devolver internet: en el mismo selector volver a elegir «No throttling». | El selector muestra «No throttling». |
| 11 | Tocar «Resumen», después «Registrar» y después «Recuperar». | Aparece el aviso «Ese movimiento ya estaba guardado» con «$12.500,00 · Comida · Visa BBVA»; la fila pendiente desaparece y el formulario queda vacío en el paso 1. |
| 12 | Restaurar la consola: pegar Object.defineProperty(crypto,'randomUUID',{configurable:true,value:window.__navUuid});delete window.__navUuid | Devuelve «true». |

---

### CP-NAV-054 — Recuperar un gasto que ya estaba guardado y fue eliminado

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-70 · CA-21 · I10 · I18 |
| Historias de usuario | US-70 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-054-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-054-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
7. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).
8. Internet funcionando normalmente al empezar el caso (la conexión se corta recién en el paso que lo indica).
9. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
10. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-nav-054-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
11. Identificadores de la categoría «Comida» y de la cuenta «Visa BBVA»: pedidos GET a SUPABASE_URL/rest/v1/categories?select=id,name y SUPABASE_URL/rest/v1/accounts?select=id,name,type con los encabezados «apikey» = ANON_KEY y «Authorization» = Bearer + el token. Anotar el «id» de «Comida» (ID_COMIDA) y el de «Visa BBVA» (ID_VISA).
12. Gasto ya creado por API con la clave fija 54000000-0000-4000-8000-000000000054: pedido POST a SUPABASE_URL/rest/v1/rpc/create_transaction con los encabezados apikey, Authorization (Bearer + token) y Content-Type, y el cuerpo {"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"ID_COMIDA","p_account_id":"ID_VISA","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"54000000-0000-4000-8000-000000000054"}. Debe responder 200 con un identificador. Después, cerrar la sesión de la app y volver a entrar con el usuario de prueba.

**Datos de prueba:**

- Gasto de ejemplo: 12500 · Comida · Visa BBVA · una cuota · 06/10/2026 · nota «Almuerzo»
- Clave fija: 54000000-0000-4000-8000-000000000054

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Apretar Ctrl+Shift+J y pegar: window.__navUuid=crypto.randomUUID.bind(crypto);Object.defineProperty(crypto,'randomUUID',{configurable:true,value:()=>"54000000-0000-4000-8000-000000000054"}) y Enter. | La consola devuelve «undefined». |
| 2 | En Registrar, escribir 12500 en el monto. | El monto muestra 12500 y se habilita «Siguiente». |
| 3 | Tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?») con las categorías. |
| 4 | Tocar la categoría «Comida». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 5 | En «Cuenta», tocar «Visa BBVA». | «Visa BBVA» queda marcada. |
| 6 | En «Fecha», tocar «Otra» y escribir 06/10/2026. | El campo de fecha muestra 06/10/2026. |
| 7 | En «Nota (opcional)» escribir Almuerzo. | La nota muestra «Almuerzo». |
| 8 | Cortar internet: apretar F12, abrir la pestaña «Network» y, en el selector que dice «No throttling», elegir «Offline». | El selector muestra «Offline». |
| 9 | Tocar «Guardar gasto». | Aparece «No se pudo guardar» con el texto «Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.»; el botón ahora dice «Reintentar» y todos los datos siguen cargados. |
| 10 | Devolver internet: en el mismo selector volver a elegir «No throttling». | El selector muestra «No throttling». |
| 11 | Agregar /transactions?period=2026-10 a la dirección de la app y Enter. | Movimientos muestra una fila «Almuerzo» de $12.500,00. |
| 12 | Tocar el botón «Eliminar Almuerzo» y después «Eliminar» en el diálogo. | Aparece «Transacción eliminada» y la fila sale de los movimientos activos. |
| 13 | Tocar «Registrar» y después «Recuperar» en la fila pendiente. | Aparece «Ese movimiento ya estaba guardado y después se eliminó» con «Está en Movimientos, en Eliminados.»; la fila pendiente desaparece y no se crea otro gasto. |
| 14 | Restaurar la consola: pegar Object.defineProperty(crypto,'randomUUID',{configurable:true,value:window.__navUuid});delete window.__navUuid | Devuelve «true». |

---

### CP-NAV-055 — Recuperar sin internet no pierde el pendiente

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Trazabilidad | US-70 · CA-22 · NFR-09 |
| Historias de usuario | US-70 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-055-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-055-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
7. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).
8. Internet funcionando normalmente al empezar el caso (la conexión se corta recién en el paso que lo indica).

**Datos de prueba:**

- Gasto de ejemplo: 12500 · Comida · Visa BBVA · una cuota · 06/10/2026 · nota «Almuerzo»

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 12500 en el monto. | El monto muestra 12500 y se habilita «Siguiente». |
| 2 | Tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?») con las categorías. |
| 3 | Tocar la categoría «Comida». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 4 | En «Cuenta», tocar «Visa BBVA». | «Visa BBVA» queda marcada. |
| 5 | En «Fecha», tocar «Otra» y escribir 06/10/2026. | El campo de fecha muestra 06/10/2026. |
| 6 | En «Nota (opcional)» escribir Almuerzo. | La nota muestra «Almuerzo». |
| 7 | Cortar internet: apretar F12, abrir la pestaña «Network» y, en el selector que dice «No throttling», elegir «Offline». | El selector muestra «Offline». |
| 8 | Tocar «Guardar gasto». | Aparece «No se pudo guardar» con el texto «Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.»; el botón ahora dice «Reintentar» y todos los datos siguen cargados. |
| 9 | Devolver internet: en el mismo selector volver a elegir «No throttling». | El selector muestra «No throttling». |
| 10 | Tocar «Resumen» en la barra de abajo. | Se abre el Resumen. |
| 11 | Tocar «Registrar» en la barra de abajo. | Se abre Registrar en el paso 1 y arriba aparece «Tenés 1 movimiento sin guardar» con la fila «Gasto · $12.500,00 · Comida · 06/10/2026» y los botones «Recuperar» y «Descartar». |
| 12 | Cortar internet: apretar F12, abrir la pestaña «Network» y, en el selector que dice «No throttling», elegir «Offline». | El selector muestra «Offline». |
| 13 | Tocar «Recuperar». | La fila muestra «No pudimos verificar si ya se guardó. Revisá tu conexión y probá de nuevo.»; la misma fila y sus botones siguen visibles. |
| 14 | Devolver internet: en el mismo selector volver a elegir «No throttling». | El selector muestra «No throttling». |

---

### CP-NAV-056 — Descartar borra el pendiente, incluso al recargar

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-70 · CA-23 · NFR-09 |
| Historias de usuario | US-70 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-056-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-056-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
7. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).
8. Internet funcionando normalmente al empezar el caso (la conexión se corta recién en el paso que lo indica).

**Datos de prueba:**

- Gasto de ejemplo: 12500 · Comida · Visa BBVA · una cuota · 06/10/2026 · nota «Almuerzo»

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 12500 en el monto. | El monto muestra 12500 y se habilita «Siguiente». |
| 2 | Tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?») con las categorías. |
| 3 | Tocar la categoría «Comida». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 4 | En «Cuenta», tocar «Visa BBVA». | «Visa BBVA» queda marcada. |
| 5 | En «Fecha», tocar «Otra» y escribir 06/10/2026. | El campo de fecha muestra 06/10/2026. |
| 6 | En «Nota (opcional)» escribir Almuerzo. | La nota muestra «Almuerzo». |
| 7 | Cortar internet: apretar F12, abrir la pestaña «Network» y, en el selector que dice «No throttling», elegir «Offline». | El selector muestra «Offline». |
| 8 | Tocar «Guardar gasto». | Aparece «No se pudo guardar» con el texto «Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.»; el botón ahora dice «Reintentar» y todos los datos siguen cargados. |
| 9 | Devolver internet: en el mismo selector volver a elegir «No throttling». | El selector muestra «No throttling». |
| 10 | Tocar «Resumen» en la barra de abajo. | Se abre el Resumen. |
| 11 | Tocar «Registrar» en la barra de abajo. | Se abre Registrar en el paso 1 y arriba aparece «Tenés 1 movimiento sin guardar» con la fila «Gasto · $12.500,00 · Comida · 06/10/2026» y los botones «Recuperar» y «Descartar». |
| 12 | Tocar «Descartar». | La fila desaparece y ya no se ve el aviso de pendientes. |
| 13 | Apretar Ctrl+R para recargar. | Registrar se recarga en el paso 1 y el aviso no reaparece. |
| 14 | Verificación adicional: F12 → «Console», pegar localStorage.getItem('biyu:pending-drafts:') y Enter. | Devuelve null o el texto "[]" (no queda nada guardado). |

---

### CP-NAV-057 — Cerrar sesión borra los pendientes

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-70 · CA-24 · NFR-09 |
| Historias de usuario | US-70 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-057-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-057-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
7. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).
8. Internet funcionando normalmente al empezar el caso (la conexión se corta recién en el paso que lo indica).

**Datos de prueba:**

- Gasto de ejemplo: 12500 · Comida · Visa BBVA · una cuota · 06/10/2026 · nota «Almuerzo»

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 12500 en el monto. | El monto muestra 12500 y se habilita «Siguiente». |
| 2 | Tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?») con las categorías. |
| 3 | Tocar la categoría «Comida». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 4 | En «Cuenta», tocar «Visa BBVA». | «Visa BBVA» queda marcada. |
| 5 | En «Fecha», tocar «Otra» y escribir 06/10/2026. | El campo de fecha muestra 06/10/2026. |
| 6 | En «Nota (opcional)» escribir Almuerzo. | La nota muestra «Almuerzo». |
| 7 | Cortar internet: apretar F12, abrir la pestaña «Network» y, en el selector que dice «No throttling», elegir «Offline». | El selector muestra «Offline». |
| 8 | Tocar «Guardar gasto». | Aparece «No se pudo guardar» con el texto «Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.»; el botón ahora dice «Reintentar» y todos los datos siguen cargados. |
| 9 | Devolver internet: en el mismo selector volver a elegir «No throttling». | El selector muestra «No throttling». |
| 10 | Tocar «Resumen» en la barra de abajo. | Se abre el Resumen. |
| 11 | Tocar «Registrar» en la barra de abajo. | Se abre Registrar en el paso 1 y arriba aparece «Tenés 1 movimiento sin guardar» con la fila «Gasto · $12.500,00 · Comida · 06/10/2026» y los botones «Recuperar» y «Descartar». |
| 12 | Tocar el engranaje «Ajustes» y después «Cerrar sesión». | Se abre «Entrar» (el login). |
| 13 | Verificación adicional: F12 → «Console», pegar localStorage.getItem('biyu:pending-drafts:') y Enter. | Devuelve null. |
| 14 | Volver a entrar con el mismo usuario (email y Clave123!). | Registrar abre en el paso 1 y no aparece el aviso de pendientes. |

---

### CP-NAV-058 — Recuperar con la categoría archivada deja la categoría vacía

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-70 · CA-25 · US-11 |
| Historias de usuario | US-11, US-70 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-058-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-058-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
7. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).
8. Internet funcionando normalmente al empezar el caso (la conexión se corta recién en el paso que lo indica).

**Datos de prueba:**

- Gasto de ejemplo: 12500 · Comida · Visa BBVA · una cuota · 06/10/2026 · nota «Almuerzo»

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 12500 en el monto. | El monto muestra 12500 y se habilita «Siguiente». |
| 2 | Tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?») con las categorías. |
| 3 | Tocar la categoría «Comida». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 4 | En «Cuenta», tocar «Visa BBVA». | «Visa BBVA» queda marcada. |
| 5 | En «Fecha», tocar «Otra» y escribir 06/10/2026. | El campo de fecha muestra 06/10/2026. |
| 6 | En «Nota (opcional)» escribir Almuerzo. | La nota muestra «Almuerzo». |
| 7 | Cortar internet: apretar F12, abrir la pestaña «Network» y, en el selector que dice «No throttling», elegir «Offline». | El selector muestra «Offline». |
| 8 | Tocar «Guardar gasto». | Aparece «No se pudo guardar» con el texto «Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.»; el botón ahora dice «Reintentar» y todos los datos siguen cargados. |
| 9 | Devolver internet: en el mismo selector volver a elegir «No throttling». | El selector muestra «No throttling». |
| 10 | Tocar el engranaje «Ajustes» y archivar «Comida» (botón «Archivar Comida»). | «Comida» pasa a categorías archivadas. |
| 11 | Tocar «Registrar» y después «Recuperar» en la fila pendiente. | Se abre el paso 3 de 3 con la categoría VACÍA; el monto $12.500,00, la cuenta «Visa BBVA» y la fecha 06/10/2026 se conservan; junto al botón dice «Completá categoría para guardar». |

---

### CP-NAV-059 — Un pendiente de septiembre se guarda en septiembre

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-70 · CA-26 · C5 |
| Historias de usuario | US-70 |
| Canal | UI |
| Automatizable | V3 |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-059-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-059-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
7. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).
8. Internet funcionando normalmente al empezar el caso (la conexión se corta recién en el paso que lo indica).
9. Ejecutar el caso durante octubre de 2026 (el día exacto 06/10/2026 del criterio original no se puede reproducir: ver Notas).

**Datos de prueba:**

- Gasto: 12500 · Comida · Visa BBVA · fecha 30/09/2026 · nota «Almuerzo»

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar cargar el gasto de ejemplo pero con fecha «Otra» 30/09/2026 (monto 12500, «Comida», «Visa BBVA», nota «Almuerzo»). | Queda cargado en el paso 3. |
| 2 | Cortar internet: apretar F12, abrir la pestaña «Network» y, en el selector que dice «No throttling», elegir «Offline». | El selector muestra «Offline». |
| 3 | Tocar «Guardar gasto». | Aparece «No se pudo guardar» y «Reintentar». |
| 4 | Devolver internet: en el mismo selector volver a elegir «No throttling». | El selector muestra «No throttling». |
| 5 | Tocar «Resumen», después «Registrar», después «Recuperar» y después «Guardar gasto». | Se abre el paso 3 con fecha 30/09/2026 y aparece «Gasto guardado». |
| 6 | Agregar /dashboard?period=2026-09 a la dirección de la app y apretar Enter. | El Resumen de septiembre de 2026 muestra gastos de $12.500,00 y el gasto «Almuerzo». |
| 7 | Tocar «Mes siguiente». | Se abre el Resumen de octubre de 2026 y NO incluye $12.500,00 ni «Almuerzo». |

**Notas del diseño:** Hueco H-NAV-02: el criterio original fija el guardado el 06/10/2026, que la app no permite reproducir (no hay reloj controlable); este caso verifica la variante mensual equivalente.

---

### CP-NAV-060 — Un lector de pantalla (TalkBack) anuncia el error sin mover el foco

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Caso de uso · Positivo |
| Trazabilidad | US-70 · CA-27 · NFR-06 |
| Historias de usuario | US-70 |
| Canal | UI |
| Automatizable | No |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-060-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-060-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
7. Internet funcionando normalmente al empezar el caso (la conexión se corta recién en el paso que lo indica).
8. Teléfono Pixel 7 con Android 15, Chrome estable y el lector de pantalla TalkBack en español, con el indicador visual de foco activado; Wi-Fi y datos móviles disponibles. Saber activar TalkBack (atajo de accesibilidad del teléfono).

**Datos de prueba:**

- Gasto de ejemplo: 12500 · Comida · Visa BBVA · una cuota · 06/10/2026 · nota «Almuerzo»

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 12500 en el monto. | El monto muestra 12500 y se habilita «Siguiente». |
| 2 | Tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?») con las categorías. |
| 3 | Tocar la categoría «Comida». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 4 | En «Cuenta», tocar «Visa BBVA». | «Visa BBVA» queda marcada. |
| 5 | En «Fecha», tocar «Otra» y escribir 06/10/2026. | El campo de fecha muestra 06/10/2026. |
| 6 | En «Nota (opcional)» escribir Almuerzo. | La nota muestra «Almuerzo». |
| 7 | Activar TalkBack con el atajo de accesibilidad del teléfono. | TalkBack anuncia Chrome y el elemento que tiene el foco. |
| 8 | Abrir los Ajustes rápidos de Android y activar el «Modo avión». | Android muestra «Modo avión activado» y no hay Wi-Fi ni datos móviles. |
| 9 | Volver a Chrome y llevar el foco de TalkBack a «Guardar gasto». | TalkBack anuncia «Guardar gasto, botón»; se conserva el paso 3 con todos los datos. |
| 10 | Hacer doble toque para activar «Guardar gasto». | TalkBack anuncia UNA sola vez «No se pudo guardar. Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.»; el botón visible pasa a «Reintentar». |
| 11 | Sacar una captura de pantalla (botones «Encendido» + «Bajar volumen»). | En la captura el indicador de foco de TalkBack rodea el botón «Reintentar», no el aviso ni otro elemento. |

---

### CP-NAV-061 — Tocar dos veces «Guardar» guarda una sola vez

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Adivinación de errores · Límite |
| Trazabilidad | US-70 · CA-28 · C4 |
| Historias de usuario | US-70 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-061-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-061-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
7. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).
8. Internet funcionando normalmente al empezar el caso (la conexión se corta recién en el paso que lo indica).
9. Perfil de red lento creado en Chrome (F12 → «Network» → «Add…»): nombre «Lento-500», latencia 500 ms, descarga 10 Mbps, subida 10 Mbps; y la casilla «Preserve log» marcada.

**Datos de prueba:**

- Gasto de ejemplo: 12500 · Comida · Visa BBVA · una cuota · 06/10/2026 · nota «Almuerzo»
- Perfil de red: latencia 500 ms, 10 Mbps

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar, escribir 12500 en el monto. | El monto muestra 12500 y se habilita «Siguiente». |
| 2 | Tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?») con las categorías. |
| 3 | Tocar la categoría «Comida». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 4 | En «Cuenta», tocar «Visa BBVA». | «Visa BBVA» queda marcada. |
| 5 | En «Fecha», tocar «Otra» y escribir 06/10/2026. | El campo de fecha muestra 06/10/2026. |
| 6 | En «Nota (opcional)» escribir Almuerzo. | La nota muestra «Almuerzo». |
| 7 | En «Network» marcar «Preserve log» y elegir el perfil «Lento-500». | La casilla queda marcada y el selector muestra el perfil. |
| 8 | Tocar «Guardar gasto». | El botón cambia de inmediato a «Guardando…», queda deshabilitado y la pantalla queda «ocupada». |
| 9 | Tocar otra vez el botón «Guardando…». | No pasa nada: sigue deshabilitado y conserva «Guardando…». |
| 10 | Esperar hasta que aparezca «Gasto guardado». | Aparece «$12.500,00 · Comida · Visa BBVA» y el formulario vuelve al paso 1. |
| 11 | En «Network» filtrar por «create_transaction». | Hay exactamente UN pedido «create_transaction», con respuesta 200. |

---

### CP-NAV-062 — El primer gasto guiado también conserva los datos y ofrece «Reintentar»

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Caso de uso · Negativo |
| Trazabilidad | US-70 · CA-29 · US-68 · NFR-09 |
| Historias de usuario | US-68, US-70 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-062-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-062-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
7. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).
8. Internet funcionando normalmente al empezar el caso (la conexión se corta recién en el paso que lo indica).

**Datos de prueba:**

- Gasto de ejemplo: 12500 · Comida · Visa BBVA · una cuota · 06/10/2026 · nota «Almuerzo»

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Tocar el engranaje «Ajustes» y después «Volver a hacer la configuración inicial». | Se abre la configuración inicial, paso 1 de 4. |
| 2 | Tocar «Saltear» en los tres primeros pasos. | Se llega al paso 4 de 4 «Registrá tu primer gasto» con el formulario «¿Cuánto?». |
| 3 | En Registrar, escribir 12500 en el monto. | El monto muestra 12500 y se habilita «Siguiente». |
| 4 | Tocar «Siguiente». | Se abre el paso 2 de 3 («¿En qué?») con las categorías. |
| 5 | Tocar la categoría «Comida». | Se abre el paso 3 de 3 («Revisá y guardá»). |
| 6 | En «Cuenta», tocar «Visa BBVA». | «Visa BBVA» queda marcada. |
| 7 | En «Fecha», tocar «Otra» y escribir 06/10/2026. | El campo de fecha muestra 06/10/2026. |
| 8 | En «Nota (opcional)» escribir Almuerzo. | La nota muestra «Almuerzo». |
| 9 | Cortar internet: apretar F12, abrir la pestaña «Network» y, en el selector que dice «No throttling», elegir «Offline». | El selector muestra «Offline». |
| 10 | Tocar «Guardar gasto». | Aparece «No se pudo guardar» con el texto de conexión y el botón «Reintentar»; se queda en el paso 3 con $12.500,00, «Comida», «Visa BBVA», 06/10/2026 y «Almuerzo» intactos. |

---

### CP-NAV-063 — Identificadores únicos en Resumen (375 px)

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Valores límite · Positivo |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-063-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-063-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Pantalla del navegador con ancho de 375 px y alto de 812 px: apretar F12, tocar el ícono «Toggle device toolbar» (pantalla adaptable) y escribir 375 en el ancho y 812 en el alto. Comprobar que arriba dice 375 × 812.
6. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Pantalla: Resumen
- Dirección: /dashboard?period=2026-08
- Ancho de pantalla: 375 × 812

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de direcciones agregar /dashboard?period=2026-08 a la dirección de la app y apretar Enter. | Se abre Resumen. |
| 2 | Apretar F12, abrir «Console», pegar este texto y apretar Enter: ["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="dashboard-nav-'+d+'"]').length) | La consola devuelve exactamente [1, 1, 1, 1, 1]: cada uno de los cinco identificadores de la barra aparece una sola vez y ninguno está repetido. |

---

### CP-NAV-064 — Identificadores únicos en Movimientos (375 px)

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Valores límite · Positivo |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-064-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-064-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Pantalla del navegador con ancho de 375 px y alto de 812 px: apretar F12, tocar el ícono «Toggle device toolbar» (pantalla adaptable) y escribir 375 en el ancho y 812 en el alto. Comprobar que arriba dice 375 × 812.
6. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Pantalla: Movimientos
- Dirección: /transactions?period=2026-08
- Ancho de pantalla: 375 × 812

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de direcciones agregar /transactions?period=2026-08 a la dirección de la app y apretar Enter. | Se abre Movimientos. |
| 2 | Apretar F12, abrir «Console», pegar este texto y apretar Enter: ["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="transactions-nav-'+d+'"]').length) | La consola devuelve exactamente [1, 1, 1, 1, 1]: cada uno de los cinco identificadores de la barra aparece una sola vez y ninguno está repetido. |

---

### CP-NAV-065 — Identificadores únicos en Deudas (375 px)

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Valores límite · Positivo |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-065-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-065-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Pantalla del navegador con ancho de 375 px y alto de 812 px: apretar F12, tocar el ícono «Toggle device toolbar» (pantalla adaptable) y escribir 375 en el ancho y 812 en el alto. Comprobar que arriba dice 375 × 812.
6. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Pantalla: Deudas
- Dirección: /debts
- Ancho de pantalla: 375 × 812

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de direcciones agregar /debts a la dirección de la app y apretar Enter. | Se abre Deudas. |
| 2 | Apretar F12, abrir «Console», pegar este texto y apretar Enter: ["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="debts-nav-'+d+'"]').length) | La consola devuelve exactamente [1, 1, 1, 1, 1]: cada uno de los cinco identificadores de la barra aparece una sola vez y ninguno está repetido. |

---

### CP-NAV-066 — Identificadores únicos en Suscripciones (375 px)

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Valores límite · Positivo |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-066-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-066-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Pantalla del navegador con ancho de 375 px y alto de 812 px: apretar F12, tocar el ícono «Toggle device toolbar» (pantalla adaptable) y escribir 375 en el ancho y 812 en el alto. Comprobar que arriba dice 375 × 812.
6. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Pantalla: Suscripciones
- Dirección: /subscriptions
- Ancho de pantalla: 375 × 812

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de direcciones agregar /subscriptions a la dirección de la app y apretar Enter. | Se abre Suscripciones. |
| 2 | Apretar F12, abrir «Console», pegar este texto y apretar Enter: ["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="subscriptions-nav-'+d+'"]').length) | La consola devuelve exactamente [1, 1, 1, 1, 1]: cada uno de los cinco identificadores de la barra aparece una sola vez y ninguno está repetido. |

---

### CP-NAV-067 — Identificadores únicos en Ajustes (375 px)

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Valores límite · Positivo |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-067-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-067-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Pantalla del navegador con ancho de 375 px y alto de 812 px: apretar F12, tocar el ícono «Toggle device toolbar» (pantalla adaptable) y escribir 375 en el ancho y 812 en el alto. Comprobar que arriba dice 375 × 812.
6. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Pantalla: Ajustes
- Dirección: /settings
- Ancho de pantalla: 375 × 812

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de direcciones agregar /settings a la dirección de la app y apretar Enter. | Se abre Ajustes. |
| 2 | Apretar F12, abrir «Console», pegar este texto y apretar Enter: ["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="settings-nav-'+d+'"]').length) | La consola devuelve exactamente [1, 1, 1, 1, 1]: cada uno de los cinco identificadores de la barra aparece una sola vez y ninguno está repetido. |

---

### CP-NAV-068 — Identificadores únicos en Resumen (1023 px)

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Valores límite · Positivo |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-068-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-068-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Pantalla del navegador con ancho de 1023 px y alto de 812 px: apretar F12, tocar el ícono «Toggle device toolbar» (pantalla adaptable) y escribir 1023 en el ancho y 812 en el alto. Comprobar que arriba dice 1023 × 812.
6. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Pantalla: Resumen
- Dirección: /dashboard?period=2026-08
- Ancho de pantalla: 1023 × 812

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de direcciones agregar /dashboard?period=2026-08 a la dirección de la app y apretar Enter. | Se abre Resumen. |
| 2 | Apretar F12, abrir «Console», pegar este texto y apretar Enter: ["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="dashboard-nav-'+d+'"]').length) | La consola devuelve exactamente [1, 1, 1, 1, 1]: cada uno de los cinco identificadores de la barra aparece una sola vez y ninguno está repetido. |

---

### CP-NAV-069 — Identificadores únicos en Movimientos (1023 px)

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Valores límite · Positivo |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-069-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-069-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Pantalla del navegador con ancho de 1023 px y alto de 812 px: apretar F12, tocar el ícono «Toggle device toolbar» (pantalla adaptable) y escribir 1023 en el ancho y 812 en el alto. Comprobar que arriba dice 1023 × 812.
6. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Pantalla: Movimientos
- Dirección: /transactions?period=2026-08
- Ancho de pantalla: 1023 × 812

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de direcciones agregar /transactions?period=2026-08 a la dirección de la app y apretar Enter. | Se abre Movimientos. |
| 2 | Apretar F12, abrir «Console», pegar este texto y apretar Enter: ["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="transactions-nav-'+d+'"]').length) | La consola devuelve exactamente [1, 1, 1, 1, 1]: cada uno de los cinco identificadores de la barra aparece una sola vez y ninguno está repetido. |

---

### CP-NAV-070 — Identificadores únicos en Deudas (1023 px)

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Valores límite · Positivo |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-070-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-070-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Pantalla del navegador con ancho de 1023 px y alto de 812 px: apretar F12, tocar el ícono «Toggle device toolbar» (pantalla adaptable) y escribir 1023 en el ancho y 812 en el alto. Comprobar que arriba dice 1023 × 812.
6. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Pantalla: Deudas
- Dirección: /debts
- Ancho de pantalla: 1023 × 812

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de direcciones agregar /debts a la dirección de la app y apretar Enter. | Se abre Deudas. |
| 2 | Apretar F12, abrir «Console», pegar este texto y apretar Enter: ["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="debts-nav-'+d+'"]').length) | La consola devuelve exactamente [1, 1, 1, 1, 1]: cada uno de los cinco identificadores de la barra aparece una sola vez y ninguno está repetido. |

---

### CP-NAV-071 — Identificadores únicos en Suscripciones (1023 px)

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Valores límite · Positivo |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-071-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-071-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Pantalla del navegador con ancho de 1023 px y alto de 812 px: apretar F12, tocar el ícono «Toggle device toolbar» (pantalla adaptable) y escribir 1023 en el ancho y 812 en el alto. Comprobar que arriba dice 1023 × 812.
6. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Pantalla: Suscripciones
- Dirección: /subscriptions
- Ancho de pantalla: 1023 × 812

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de direcciones agregar /subscriptions a la dirección de la app y apretar Enter. | Se abre Suscripciones. |
| 2 | Apretar F12, abrir «Console», pegar este texto y apretar Enter: ["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="subscriptions-nav-'+d+'"]').length) | La consola devuelve exactamente [1, 1, 1, 1, 1]: cada uno de los cinco identificadores de la barra aparece una sola vez y ninguno está repetido. |

---

### CP-NAV-072 — Identificadores únicos en Ajustes (1023 px)

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Valores límite · Positivo |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-072-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-072-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Pantalla del navegador con ancho de 1023 px y alto de 812 px: apretar F12, tocar el ícono «Toggle device toolbar» (pantalla adaptable) y escribir 1023 en el ancho y 812 en el alto. Comprobar que arriba dice 1023 × 812.
6. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Pantalla: Ajustes
- Dirección: /settings
- Ancho de pantalla: 1023 × 812

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de direcciones agregar /settings a la dirección de la app y apretar Enter. | Se abre Ajustes. |
| 2 | Apretar F12, abrir «Console», pegar este texto y apretar Enter: ["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="settings-nav-'+d+'"]').length) | La consola devuelve exactamente [1, 1, 1, 1, 1]: cada uno de los cinco identificadores de la barra aparece una sola vez y ninguno está repetido. |

---

### CP-NAV-073 — Identificadores únicos en Resumen (1024 px)

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-073-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-073-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Pantalla del navegador con ancho de 1024 px y alto de 900 px: apretar F12, tocar el ícono «Toggle device toolbar» (pantalla adaptable) y escribir 1024 en el ancho y 900 en el alto. Comprobar que arriba dice 1024 × 900.
6. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Pantalla: Resumen
- Dirección: /dashboard?period=2026-08
- Ancho de pantalla: 1024 × 900

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de direcciones agregar /dashboard?period=2026-08 a la dirección de la app y apretar Enter. | Se abre Resumen. |
| 2 | Apretar F12, abrir «Console», pegar este texto y apretar Enter: ["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="dashboard-nav-'+d+'"]').length) | La consola devuelve exactamente [1, 1, 1, 1, 1]: cada uno de los cinco identificadores de la barra aparece una sola vez y ninguno está repetido. |

---

### CP-NAV-074 — Identificadores únicos en Movimientos (1024 px)

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-074-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-074-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Pantalla del navegador con ancho de 1024 px y alto de 900 px: apretar F12, tocar el ícono «Toggle device toolbar» (pantalla adaptable) y escribir 1024 en el ancho y 900 en el alto. Comprobar que arriba dice 1024 × 900.
6. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Pantalla: Movimientos
- Dirección: /transactions?period=2026-08
- Ancho de pantalla: 1024 × 900

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de direcciones agregar /transactions?period=2026-08 a la dirección de la app y apretar Enter. | Se abre Movimientos. |
| 2 | Apretar F12, abrir «Console», pegar este texto y apretar Enter: ["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="transactions-nav-'+d+'"]').length) | La consola devuelve exactamente [1, 1, 1, 1, 1]: cada uno de los cinco identificadores de la barra aparece una sola vez y ninguno está repetido. |

---

### CP-NAV-075 — Identificadores únicos en Deudas (1024 px)

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-075-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-075-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Pantalla del navegador con ancho de 1024 px y alto de 900 px: apretar F12, tocar el ícono «Toggle device toolbar» (pantalla adaptable) y escribir 1024 en el ancho y 900 en el alto. Comprobar que arriba dice 1024 × 900.
6. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Pantalla: Deudas
- Dirección: /debts
- Ancho de pantalla: 1024 × 900

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de direcciones agregar /debts a la dirección de la app y apretar Enter. | Se abre Deudas. |
| 2 | Apretar F12, abrir «Console», pegar este texto y apretar Enter: ["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="debts-nav-'+d+'"]').length) | La consola devuelve exactamente [1, 1, 1, 1, 1]: cada uno de los cinco identificadores de la barra aparece una sola vez y ninguno está repetido. |

---

### CP-NAV-076 — Identificadores únicos en Suscripciones (1024 px)

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-076-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-076-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Pantalla del navegador con ancho de 1024 px y alto de 900 px: apretar F12, tocar el ícono «Toggle device toolbar» (pantalla adaptable) y escribir 1024 en el ancho y 900 en el alto. Comprobar que arriba dice 1024 × 900.
6. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Pantalla: Suscripciones
- Dirección: /subscriptions
- Ancho de pantalla: 1024 × 900

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de direcciones agregar /subscriptions a la dirección de la app y apretar Enter. | Se abre Suscripciones. |
| 2 | Apretar F12, abrir «Console», pegar este texto y apretar Enter: ["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="subscriptions-nav-'+d+'"]').length) | La consola devuelve exactamente [1, 1, 1, 1, 1]: cada uno de los cinco identificadores de la barra aparece una sola vez y ninguno está repetido. |

---

### CP-NAV-077 — Identificadores únicos en Ajustes (1024 px)

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-077-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-077-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Pantalla del navegador con ancho de 1024 px y alto de 900 px: apretar F12, tocar el ícono «Toggle device toolbar» (pantalla adaptable) y escribir 1024 en el ancho y 900 en el alto. Comprobar que arriba dice 1024 × 900.
6. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Pantalla: Ajustes
- Dirección: /settings
- Ancho de pantalla: 1024 × 900

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de direcciones agregar /settings a la dirección de la app y apretar Enter. | Se abre Ajustes. |
| 2 | Apretar F12, abrir «Console», pegar este texto y apretar Enter: ["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="settings-nav-'+d+'"]').length) | La consola devuelve exactamente [1, 1, 1, 1, 1]: cada uno de los cinco identificadores de la barra aparece una sola vez y ninguno está repetido. |

---

### CP-NAV-078 — Identificadores únicos en Resumen (1280 px)

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-078-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-078-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Pantalla del navegador con ancho de 1280 px y alto de 900 px: apretar F12, tocar el ícono «Toggle device toolbar» (pantalla adaptable) y escribir 1280 en el ancho y 900 en el alto. Comprobar que arriba dice 1280 × 900.
6. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Pantalla: Resumen
- Dirección: /dashboard?period=2026-08
- Ancho de pantalla: 1280 × 900

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de direcciones agregar /dashboard?period=2026-08 a la dirección de la app y apretar Enter. | Se abre Resumen. |
| 2 | Apretar F12, abrir «Console», pegar este texto y apretar Enter: ["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="dashboard-nav-'+d+'"]').length) | La consola devuelve exactamente [1, 1, 1, 1, 1]: cada uno de los cinco identificadores de la barra aparece una sola vez y ninguno está repetido. |

---

### CP-NAV-079 — Identificadores únicos en Movimientos (1280 px)

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-079-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-079-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Pantalla del navegador con ancho de 1280 px y alto de 900 px: apretar F12, tocar el ícono «Toggle device toolbar» (pantalla adaptable) y escribir 1280 en el ancho y 900 en el alto. Comprobar que arriba dice 1280 × 900.
6. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Pantalla: Movimientos
- Dirección: /transactions?period=2026-08
- Ancho de pantalla: 1280 × 900

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de direcciones agregar /transactions?period=2026-08 a la dirección de la app y apretar Enter. | Se abre Movimientos. |
| 2 | Apretar F12, abrir «Console», pegar este texto y apretar Enter: ["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="transactions-nav-'+d+'"]').length) | La consola devuelve exactamente [1, 1, 1, 1, 1]: cada uno de los cinco identificadores de la barra aparece una sola vez y ninguno está repetido. |

---

### CP-NAV-080 — Identificadores únicos en Deudas (1280 px)

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-080-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-080-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Pantalla del navegador con ancho de 1280 px y alto de 900 px: apretar F12, tocar el ícono «Toggle device toolbar» (pantalla adaptable) y escribir 1280 en el ancho y 900 en el alto. Comprobar que arriba dice 1280 × 900.
6. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Pantalla: Deudas
- Dirección: /debts
- Ancho de pantalla: 1280 × 900

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de direcciones agregar /debts a la dirección de la app y apretar Enter. | Se abre Deudas. |
| 2 | Apretar F12, abrir «Console», pegar este texto y apretar Enter: ["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="debts-nav-'+d+'"]').length) | La consola devuelve exactamente [1, 1, 1, 1, 1]: cada uno de los cinco identificadores de la barra aparece una sola vez y ninguno está repetido. |

---

### CP-NAV-081 — Identificadores únicos en Suscripciones (1280 px)

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-081-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-081-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Pantalla del navegador con ancho de 1280 px y alto de 900 px: apretar F12, tocar el ícono «Toggle device toolbar» (pantalla adaptable) y escribir 1280 en el ancho y 900 en el alto. Comprobar que arriba dice 1280 × 900.
6. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Pantalla: Suscripciones
- Dirección: /subscriptions
- Ancho de pantalla: 1280 × 900

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de direcciones agregar /subscriptions a la dirección de la app y apretar Enter. | Se abre Suscripciones. |
| 2 | Apretar F12, abrir «Console», pegar este texto y apretar Enter: ["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="subscriptions-nav-'+d+'"]').length) | La consola devuelve exactamente [1, 1, 1, 1, 1]: cada uno de los cinco identificadores de la barra aparece una sola vez y ninguno está repetido. |

---

### CP-NAV-082 — Identificadores únicos en Ajustes (1280 px)

| Campo | Contenido |
|---|---|
| Funcionalidad | Barra de navegación (US-69) |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Historias de usuario | US-69 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-082-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-082-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Pantalla del navegador con ancho de 1280 px y alto de 900 px: apretar F12, tocar el ícono «Toggle device toolbar» (pantalla adaptable) y escribir 1280 en el ancho y 900 en el alto. Comprobar que arriba dice 1280 × 900.
6. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Pantalla: Ajustes
- Dirección: /settings
- Ancho de pantalla: 1280 × 900

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de direcciones agregar /settings a la dirección de la app y apretar Enter. | Se abre Ajustes. |
| 2 | Apretar F12, abrir «Console», pegar este texto y apretar Enter: ["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="settings-nav-'+d+'"]').length) | La consola devuelve exactamente [1, 1, 1, 1, 1]: cada uno de los cinco identificadores de la barra aparece una sola vez y ninguno está repetido. |

---

### CP-NAV-083 — La API devuelve un solo gasto activo para la clave recuperada

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-70 · CA-20 · I18 |
| Historias de usuario | US-70 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-083-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
7. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-nav-083-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
8. Identificadores de la categoría «Comida» y de la cuenta «Visa BBVA»: pedidos GET a SUPABASE_URL/rest/v1/categories?select=id,name y SUPABASE_URL/rest/v1/accounts?select=id,name,type con los encabezados «apikey» = ANON_KEY y «Authorization» = Bearer + el token. Anotar el «id» de «Comida» (ID_COMIDA) y el de «Visa BBVA» (ID_VISA).

**Datos de prueba:**

- Clave de reintento: 83000000-0000-4000-8000-000000000083

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Postman, pedido POST a SUPABASE_URL/rest/v1/rpc/create_transaction con los encabezados «apikey» = ANON_KEY, «Authorization» = Bearer + token y «Content-Type: application/json», y este cuerpo: {"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"ID_COMIDA","p_account_id":"ID_VISA","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"83000000-0000-4000-8000-000000000083"} | Responde 200 y un identificador (ID-1). |
| 2 | Pedido GET a SUPABASE_URL/rest/v1/transactions?select=id,amount_text:amount::text,request_id,deleted_at&request_id=eq.83000000-0000-4000-8000-000000000083 con los mismos encabezados. | Responde 200 con UNA fila: id = ID-1, amount_text = "12500.00", la clave indicada y deleted_at = null. |
| 3 | Pedido GET a SUPABASE_URL/rest/v1/ledger_entries?select=transaction_id,installment_number,amount_text:amount::text&transaction_id=eq.ID-1 con los mismos encabezados. | Responde 200 con UNA fila: transaction_id = ID-1, installment_number = 1 y amount_text = "12500.00". |

---

### CP-NAV-084 — La API conserva un solo gasto eliminado para la clave recuperada

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-70 · CA-21 · I10 · I18 |
| Historias de usuario | US-70 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-084-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
7. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-nav-084-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
8. Identificadores de la categoría «Comida» y de la cuenta «Visa BBVA»: pedidos GET a SUPABASE_URL/rest/v1/categories?select=id,name y SUPABASE_URL/rest/v1/accounts?select=id,name,type con los encabezados «apikey» = ANON_KEY y «Authorization» = Bearer + el token. Anotar el «id» de «Comida» (ID_COMIDA) y el de «Visa BBVA» (ID_VISA).

**Datos de prueba:**

- Clave de reintento: 84000000-0000-4000-8000-000000000084

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Postman, pedido POST a SUPABASE_URL/rest/v1/rpc/create_transaction con los encabezados «apikey» = ANON_KEY, «Authorization» = Bearer + token y «Content-Type: application/json», y este cuerpo: {"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"ID_COMIDA","p_account_id":"ID_VISA","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"84000000-0000-4000-8000-000000000084"} | Responde 200 y un identificador (ID-1). |
| 2 | Pedido POST a SUPABASE_URL/rest/v1/rpc/delete_transaction con los mismos encabezados y cuerpo {"p_transaction_id":"ID-1"}. | Responde 200 y el cuerpo es null. |
| 3 | Pedido GET a SUPABASE_URL/rest/v1/transactions?select=id,amount_text:amount::text,request_id,deleted_at&request_id=eq.84000000-0000-4000-8000-000000000084 con los mismos encabezados. | Responde 200 con UNA fila: id = ID-1, amount_text = "12500.00", la clave indicada y deleted_at con una fecha (no vacío). |
| 4 | Pedido GET a SUPABASE_URL/rest/v1/ledger_entries?select=transaction_id,installment_number,amount_text:amount::text&transaction_id=eq.ID-1 con los mismos encabezados. | Responde 200 con UNA fila (cuota histórica): transaction_id = ID-1, installment_number = 1 y amount_text = "12500.00"; no cuenta en los cálculos porque su gasto está eliminado. |

---

### CP-NAV-085 — La API confirma la clave del gasto reintentado por pantalla

| Campo | Contenido |
|---|---|
| Funcionalidad | Aviso de guardado y reintento (US-70) |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-70 · CA-5 · NFR-10 · ADR-034 · I18 |
| Historias de usuario | US-70 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-085-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
7. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-nav-085-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
8. Identificadores de la categoría «Comida» y de la cuenta «Visa BBVA»: pedidos GET a SUPABASE_URL/rest/v1/categories?select=id,name y SUPABASE_URL/rest/v1/accounts?select=id,name,type con los encabezados «apikey» = ANON_KEY y «Authorization» = Bearer + el token. Anotar el «id» de «Comida» (ID_COMIDA) y el de «Visa BBVA» (ID_VISA).
9. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-085-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
10. Internet funcionando normalmente al empezar el caso (la conexión se corta recién en el paso que lo indica).
11. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Clave del pendiente: 85000000-0000-4000-8000-000000000085
- Gasto de ejemplo: 12500 · Comida · Visa BBVA · 06/10/2026 · nota «Almuerzo»

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la pantalla: abrir la consola (Ctrl+Shift+J) y fijar la clave: window.__navUuid=crypto.randomUUID.bind(crypto);Object.defineProperty(crypto,'randomUUID',{configurable:true,value:()=>"85000000-0000-4000-8000-000000000085"}). Cargar el gasto de ejemplo (12500, «Comida», «Visa BBVA», 06/10/2026, «Almuerzo»), cortar internet y tocar «Guardar gasto». | Aparece «No se pudo guardar» y «Reintentar». |
| 2 | Restaurar la consola (Object.defineProperty(crypto,'randomUUID',{configurable:true,value:window.__navUuid});delete window.__navUuid), devolver internet y tocar «Reintentar». | Aparece «Gasto guardado» con «$12.500,00 · Comida · Visa BBVA». |
| 3 | Obtener el token del usuario (como indican los pre-requisitos) y pedir GET a SUPABASE_URL/rest/v1/transactions?select=id,amount_text:amount::text,request_id,deleted_at&request_id=eq.85000000-0000-4000-8000-000000000085 con los encabezados apikey y Authorization. | Responde 200 con UNA fila: id = ID-1, amount_text = "12500.00", request_id = «85000000-0000-4000-8000-000000000085» y deleted_at = null. |
| 4 | Pedido GET a SUPABASE_URL/rest/v1/ledger_entries?select=transaction_id,installment_number,amount_text:amount::text&transaction_id=eq.ID-1 con los mismos encabezados. | Responde 200 con UNA fila: transaction_id = ID-1, installment_number = 1 y amount_text = "12500.00". |

---
