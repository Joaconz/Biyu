# Entrega 2 · Especificación de casos de prueba (V2) · Deudas y Navegación

Planilla: `02-especificacion-casos-v2.xlsx` (una hoja por caso, mismo formato que la Entrega 1: ID, prioridad, técnica, trazabilidad, pre-requisitos, datos de prueba, pasos y resultado esperado). Alcance de este documento, después del recorte del 2026-10-27 (de 190 a 53 casos): **CP-DEU-005 a CP-DEU-010** (validaciones de gasto compartido, US-34 · CA-8), **CP-DEU-040 a CP-DEU-061** (listado, saldar, filtros, varias personas y neto: US-30, US-37 a US-40, US-79 y US-82; 22 casos) y **25 casos de Navegación e interfaz** (US-69 y US-70): **53 casos**.

Los casos salen de [`entrega-2/casos/deu.md`](casos/deu.md) y [`entrega-2/casos/nav.md`](casos/nav.md). Acá los pre-requisitos y los pasos están redactados **en lenguaje simple**, con lo que hay que tocar en la aplicación y lo que se tendría que ver. Para los casos de Deudas CP-DEU-005 a 010, que en su versión original son llamadas directas a la API (función de varias personas de US-82, todavía no implementada), se describe la **prueba equivalente en la pantalla de Registrar** (caso gemelo), y la prueba original queda anotada en «Notas del diseño».

## Cómo leer un caso

- **Pre-requisitos:** todo lo que tiene que estar listo antes del paso 1 (usuario, cuentas, categorías, gastos cargados, ancho de pantalla, herramientas).
- **Datos de prueba:** los valores exactos que se escriben.
- **Pasos y resultado esperado:** cada paso dice qué hacer y qué se tiene que ver; si se ve otra cosa, el caso falla.
- Cada caso usa **su propio usuario de prueba** (`qa+<id del caso>-001@example.com`, contraseña `Clave123!`): ningún caso depende de datos de otro.

## Índice

| ID | Prioridad | Título | User story | Camino feliz | Tipo | Técnica |
|---|---|---|---|---|---|---|
| CP-DEU-005 | Alta | No se puede compartir un gasto si falta cuánto te deben | US-34, US-82 | No | Negativo | Partición de equivalencia |
| CP-DEU-006 | Alta | No se puede compartir un gasto si falta con quién | US-34, US-82 | No | Negativo | Partición de equivalencia |
| CP-DEU-007 | Alta | Un ingreso no se puede compartir | US-34, US-82 | No | Negativo | Partición de equivalencia |
| CP-DEU-008 | Alta | El nombre hecho solo de espacios no cuenta como nombre | US-34, US-82 | No | Negativo | Partición de equivalencia |
| CP-DEU-009 | Media | El nombre admite hasta 60 caracteres, no 61 | US-34, US-82 | No | Límite | Valores límite |
| CP-DEU-010 | Alta | No se puede deber 0 pesos | US-34, US-82 | No | Límite | Valores límite |
| CP-DEU-040 | Baja | Un filtro inválido en la dirección se trata como «Pendientes» | US-38 | No | Negativo | Partición de equivalencia |
| CP-DEU-041 | Media | Deudas pendientes: la de fecha más nueva va primero | US-38 | No | Positivo | Caso de uso |
| CP-DEU-042 | Media | Sin deudas pendientes: mensaje y botón «Cargar una deuda» | US-38 | No | Límite | Partición de equivalencia |
| CP-DEU-043 | Alta | Otro usuario no ve las deudas de alguien más | US-38 | No | Negativo | Adivinación de errores |
| CP-DEU-044 | Alta | Por API, otro usuario no recibe las deudas de alguien más | US-38 | No | Negativo | Adivinación de errores |
| CP-DEU-045 | Alta | Por API, sin sesión no se pueden leer las deudas | US-38 | No | Negativo | Adivinación de errores |
| CP-DEU-046 | Alta | Marcar una deuda como saldada desde «Pendientes» | US-30, US-37, US-39 | Sí | Positivo | Transición de estados |
| CP-DEU-047 | Alta | «Deshacer» devuelve la deuda a pendiente | US-39 | No | Positivo | Transición de estados |
| CP-DEU-048 | Media | Saldar una deuda que ya se saldó en otra pestaña muestra un error | US-39 | No | Negativo | Transición de estados |
| CP-DEU-049 | Alta | Por API, saldar una deuda ya saldada se rechaza | US-39 | No | Negativo | Transición de estados |
| CP-DEU-050 | Alta | Por API, un usuario no puede saldar la deuda de otro | US-39 | No | Negativo | Adivinación de errores |
| CP-DEU-051 | Alta | Por API, no se puede modificar una deuda directamente | US-39 | No | Negativo | Adivinación de errores |
| CP-DEU-052 | Alta | «Volver a pendiente» desde «Saldadas» | US-40 | Sí | Positivo | Transición de estados |
| CP-DEU-053 | Media | Saldar y reabrir tres veces seguidas deja la deuda pendiente | US-40 | No | Límite | Transición de estados |
| CP-DEU-054 | Alta | Filtro por dirección: «Todas», «Te deben» y «Debés» | US-79 | Sí | Positivo | Transición de estados |
| CP-DEU-055 | Alta | Gasto compartido con varias personas: agregar, quitar y guardar | US-82 | Sí | Positivo | Caso de uso |
| CP-DEU-056 | Alta | Se puede compartir con hasta 10 personas | US-82 | No | Límite | Valores límite |
| CP-DEU-057 | Alta | Por API, deudas que suman más que el gasto se rechazan | US-82 | No | Límite | Valores límite |
| CP-DEU-058 | Alta | Resumen: gasto bruto y neto de reembolsos | US-30 | Sí | Positivo | Caso de uso |
| CP-DEU-059 | Alta | Resumen: el neto no cambia al saldar la deuda | US-30 | Sí | Positivo | Transición de estados |
| CP-DEU-060 | Alta | Resumen: una deuda suelta «Me deben» no cambia el neto | US-30 | No | Negativo | Partición de equivalencia |
| CP-DEU-061 | Alta | Resumen: el neto en dólares no cambia si cambia el tipo de cambio | US-30 | Sí | Positivo | Caso de uso |
| CP-NAV-001 | Media | La barra tiene cuatro secciones en el orden correcto | US-69 | Sí | Positivo | Caso de uso |
| CP-NAV-002 | Media | «Deudas» lleva a Deudas | US-69 | Sí | Positivo | Caso de uso |
| CP-NAV-003 | Media | En el Resumen la barra marca «Resumen» | US-69 | Sí | Positivo | Partición de equivalencia |
| CP-NAV-004 | Media | En Ajustes no se marca ninguna de las cuatro secciones | US-69 | Sí | Positivo | Partición de equivalencia |
| CP-NAV-005 | Media | Ancho 1023 px: barra abajo y engranaje de Ajustes | US-69 | No | Límite | Valores límite |
| CP-NAV-006 | Media | Ancho 1024 px: barra lateral con Ajustes al pie | US-69 | No | Límite | Valores límite |
| CP-NAV-007 | Media | Identificadores únicos en Registrar (375 px) | US-69 | Sí | Positivo | Valores límite |
| CP-NAV-008 | Media | «Ver todos» y «‹ Resumen» mantienen el mes | US-69 | Sí | Positivo | Caso de uso |
| CP-NAV-009 | Media | Deudas no arrastra el mes del Resumen | US-69 | Sí | Positivo | Partición de equivalencia |
| CP-NAV-010 | Alta | Tocar «Registrar» estando en Registrar no pierde lo cargado | US-69 | Sí | Positivo | Transición de estados |
| CP-NAV-011 | Media | Guardar $12.500 muestra la confirmación completa | US-10, US-70 | Sí | Positivo | Caso de uso |
| CP-NAV-012 | Alta | Sin internet el gasto no se pierde y aparece «Reintentar» | US-70 | No | Negativo | Adivinación de errores |
| CP-NAV-013 | Alta | Reintentar al volver internet guarda una sola vez | US-70 | Sí | Positivo | Transición de estados |
| CP-NAV-014 | Alta | Con internet muy lenta, a los 15 segundos avisa que falló | US-70 | No | Límite | Valores límite |
| CP-NAV-015 | Alta | Reintentar no duplica un gasto que ya se había guardado | US-70 | Sí | Positivo | Transición de estados |
| CP-NAV-016 | Alta | La misma clave dos veces seguidas devuelve el mismo gasto | US-70 | Sí | Positivo | Caso de uso |
| CP-NAV-017 | Alta | Dos pedidos simultáneos con la misma clave crean un solo gasto | US-70 | Sí | Positivo | Adivinación de errores |
| CP-NAV-018 | Alta | La misma clave en dos usuarios distintos no se pisa | US-70 | Sí | Positivo | Adivinación de errores |
| CP-NAV-019 | Alta | Si se archiva la categoría antes de guardar, el gasto se rechaza con aviso | US-70 | No | Negativo | Adivinación de errores |
| CP-NAV-020 | Alta | La API rechaza un gasto con una categoría archivada | US-70 | No | Negativo | Adivinación de errores |
| CP-NAV-021 | Alta | Al volver a Registrar aparece el gasto pendiente | US-70 | Sí | Positivo | Transición de estados |
| CP-NAV-022 | Alta | Recuperar un gasto que en realidad ya estaba guardado | US-70 | Sí | Positivo | Transición de estados |
| CP-NAV-023 | Alta | Descartar borra el pendiente, incluso al recargar | US-70 | Sí | Positivo | Transición de estados |
| CP-NAV-024 | Alta | Cerrar sesión borra los pendientes | US-70 | Sí | Positivo | Transición de estados |
| CP-NAV-025 | Alta | Tocar dos veces «Guardar» guarda una sola vez | US-70 | No | Límite | Adivinación de errores |

## Casos

### CP-DEU-005 — No se puede compartir un gasto si falta cuánto te deben

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-005-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-005-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
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

**Notas del diseño:** Prueba original por API (create_transaction con p_shared_persons = ["Sofía"] y p_shared_amounts = null): rechazo «Un gasto compartido necesita una persona y un monto por cada deuda». Se prueba su equivalente de pantalla (caso gemelo CP-DEU-004).

---

### CP-DEU-006 — No se puede compartir un gasto si falta con quién

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-006-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-006-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
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

**Notas del diseño:** Prueba original por API (p_shared_persons = null con p_shared_amounts = ["10000.00"]). Equivalente de pantalla: el caso gemelo de Registrar, que se quitó del catálogo en el recorte.

---

### CP-DEU-007 — Un ingreso no se puede compartir

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-007-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-007-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**

- Tipo: Ingreso
- Monto: $100.000

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En Registrar tocar «Ingreso» (en vez de «Gasto»). | «Ingreso» queda seleccionado. |
| 2 | Escribir 100000 en el monto y tocar «Siguiente». | Se abre el último paso, «Revisá y guardá», con el botón «Guardar ingreso». |
| 3 | Mirar el último paso, debajo de «Nota (opcional)». | No existe la sección «Gasto compartido» ni su interruptor: no hay forma de marcar un ingreso como compartido. |

**Notas del diseño:** Prueba original por API (p_type = "income" con una deuda): rechazo «Un ingreso no se puede compartir». Equivalente de pantalla: el caso gemelo de Registrar, que se quitó del catálogo en el recorte.

---

### CP-DEU-008 — El nombre hecho solo de espacios no cuenta como nombre

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-008-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-008-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
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

**Notas del diseño:** Prueba original por API (p_shared_persons = ["   "]). Equivalente de pantalla: el caso gemelo de Registrar, que se quitó del catálogo en el recorte.

---

### CP-DEU-009 — El nombre admite hasta 60 caracteres, no 61

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-009-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-009-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
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

**Notas del diseño:** Prueba original por API (nombre de 61 caracteres): rechazo «La persona admite hasta 60 caracteres». Equivalente de pantalla: el caso gemelo de Registrar, que se quitó del catálogo en el recorte.

---

### CP-DEU-010 — No se puede deber 0 pesos

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-010-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-010-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
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

**Notas del diseño:** Prueba original por API (p_shared_amounts = [0]): rechazo «I4: el monto de la deuda debe ser mayor a cero». Equivalente de pantalla: el caso gemelo de Registrar, que se quitó del catálogo en el recorte.

---

### CP-DEU-040 — Un filtro inválido en la dirección se trata como «Pendientes»

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Baja |
| Camino feliz | No |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Trazabilidad | US-38 · CA-4 · FR-18 · C11 |
| Historias de usuario | US-38 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-040-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-040-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Deudas D 1 y D 2 creadas desde Deudas → «Nueva deuda», y D 2 saldada con el botón «Marcar saldada».

**Datos de prueba:**

- D 1: Sofía te debe $60.000, con fecha 15/08/2026.
- D 2: Pedro te debe $8.000, con fecha 10/08/2026.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts?status=xyz a la dirección de la app y apretar Enter. | «Pendientes» queda seleccionado y la lista muestra solo la fila pendiente de «Sofía». |
| 2 | Tocar el filtro «Saldadas». | La URL pasa a /debts?status=settled y se muestra solo la fila de «Pedro». |

---

### CP-DEU-041 — Deudas pendientes: la de fecha más nueva va primero

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Caso de uso · Positivo |
| Trazabilidad | US-38 · CA-5 (parte 1) · FR-18 · — |
| Historias de usuario | US-38 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-041-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-041-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. 3 deudas pendientes creadas secuencialmente (esperando 2 segundos entre cada una) desde Deudas → «Nueva deuda».

**Datos de prueba:**

- D 1: Ana te debe $10.000, con fecha 01/10/2026.
- D 2: Beto te debe $20.000, con fecha 15/08/2026.
- D 3: Carla te debe $30.000, con fecha 01/10/2026.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts a la dirección de la app y apretar Enter. | En «Pendientes», las 3 filas aparecen de arriba hacia abajo en el orden exacto: 1.º «Carla» (01/10/2026, creada más reciente), 2.º «Ana» (01/10/2026, creada antes), 3.º «Beto» (15/08/2026). |

---

### CP-DEU-042 — Sin deudas pendientes: mensaje y botón «Cargar una deuda»

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Partición de equivalencia · Límite |
| Trazabilidad | US-38 · CA-7, CA-11 · FR-18 · — |
| Historias de usuario | US-38 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-042-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-042-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts a la dirección de la app y apretar Enter. | Se muestra el mensaje de lista vacía con el texto exacto «No tenés deudas pendientes.» y el botón «Cargar una deuda». |
| 2 | Tocar el botón «Cargar una deuda». | Navega a /debts/new. |

---

### CP-DEU-043 — Otro usuario no ve las deudas de alguien más

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Trazabilidad | US-38 · CA-9 · FR-18 · C7 |
| Historias de usuario | US-38 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Dos usuarios de prueba nuevos, cada uno con su propia sesión (ventana de incógnito distinta): Usuario A (qa+cp-deu-043-a@example.com) y Usuario B (qa+cp-deu-043-b@example.com), los dos con contraseña Clave123!. Cómo crearlos: en la pantalla «Entrar» tocar «Crear una cuenta», completar el email, la contraseña y «Confirmar contraseña», tocar «Crear cuenta» y «Saltear» en los 4 pasos de la configuración inicial. El caso se mira desde la ventana de incógnito del Usuario B.

**Datos de prueba:**

- D 1: Sofía te debe $60.000, con fecha 15/08/2026 (cargada por el Usuario A).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la ventana de incógnito donde inició sesión el Usuario B (qa+cp-deu-043-b@example.com), escribir /debts?status=all en la barra de direcciones y apretar Enter. | «Te deben» muestra «$0,00», «Debés» muestra «$0,00», el neto muestra «En cero» y se ve el estado vacío «No cargaste ninguna deuda todavía.» (0 filas del Usuario A visibles). |

---

### CP-DEU-044 — Por API, otro usuario no recibe las deudas de alguien más

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Trazabilidad | US-38 · CA-9 (parte 1) · FR-18 · C7 |
| Historias de usuario | US-38 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Dos usuarios de prueba NUEVOS: A (qa+cp-deu-044-a@example.com) y B (qa+cp-deu-044-b@example.com), los dos con contraseña Clave123!. Cómo crearlos: en la pantalla «Entrar» tocar «Crear una cuenta», completar el email, la contraseña y «Confirmar contraseña», tocar «Crear cuenta» y «Saltear» en los 4 pasos de la configuración inicial; cada usuario en su propia ventana de incógnito.
4. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
5. Token de cada usuario: igual que el token de un solo usuario (POST a SUPABASE_URL/auth/v1/token?grant_type=password con «apikey» = ANON_KEY y el email y la contraseña del usuario); copiar el «access_token» de A y el de B.
6. Usuarios A y B. Una deuda «Sofía te debe $60.000» con fecha 15/08/2026, cargada por A (desde Deudas → «Nueva deuda» con la sesión de A).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Con el token del usuario B pedir GET a /rest/v1/debts?select=* y a /rest/v1/debts?id=eq.<ID de la deuda de A>. | Las dos respuestas son 200 con la lista vacía []: B no ve nada de A. |

**Notas del diseño:** Caso por API: se hace con Postman (o curl), no desde la pantalla.

---

### CP-DEU-045 — Por API, sin sesión no se pueden leer las deudas

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Trazabilidad | US-38 · CA-9 (parte 2) · C7 · FR-18 · C7 |
| Historias de usuario | US-38 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
3. Ninguna: la consulta se hace sin sesión.

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Pedir GET a /rest/v1/debts?select=* enviando solo el encabezado «apikey» (sin «Authorization»). | Responde 401 o 403 con el código 42501 («permission denied for table debts»). |

**Notas del diseño:** Caso por API: se hace con Postman (o curl), no desde la pantalla.

---

### CP-DEU-046 — Marcar una deuda como saldada desde «Pendientes»

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-39 · CA-1, CA-8 · US-37 · CA-5 · US-30 · CA-2 · FR-18 · I9 |
| Historias de usuario | US-30, US-37, US-39 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-046-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-046-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Deuda D 1 creada desde Deudas → «Nueva deuda».

**Datos de prueba:**

- D 1: Sofía te debe $60.000, con fecha 15/08/2026.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts a la dirección de la app y apretar Enter. | Se muestra «Te deben» = «$60.000,00», «A tu favor $60.000,00» y la fila de «Sofía» con el botón «Marcar saldada». |
| 2 | Tocar el botón «Marcar saldada» de la fila de «Sofía». | La fila de «Sofía» sale de la lista de «Pendientes», aparece el estado vacío «No tenés deudas pendientes.», aparece el aviso con el texto exacto «Deuda con Sofía saldada» y el botón «Deshacer», y en la tarjeta de totales «Te deben» baja en el acto a «$0,00» y el neto pasa a «En cero». |

---

### CP-DEU-047 — «Deshacer» devuelve la deuda a pendiente

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-39 · CA-4 (parte 1) · FR-18 · I9 |
| Historias de usuario | US-39 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-047-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-047-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Deuda D 1 creada desde Deudas → «Nueva deuda».

**Datos de prueba:**

- D 1: Sofía te debe $60.000, con fecha 15/08/2026.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts a la dirección de la app y apretar Enter. | Se ve la fila de «Sofía» en «Pendientes». |
| 2 | Tocar «Marcar saldada». | Aparece el aviso («Deuda con Sofía saldada») con el botón «Deshacer». |
| 3 | Antes de que pasen 5 segundos, tocar el botón «Deshacer». | El aviso desaparece, la fila de «Sofía» vuelve a aparecer en «Pendientes» y «Te deben» vuelve a «$60.000,00». |

---

### CP-DEU-048 — Saldar una deuda que ya se saldó en otra pestaña muestra un error

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Transición de estados · Negativo |
| Trazabilidad | US-39 · CA-5 · FR-18 · I9 |
| Historias de usuario | US-39 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-048-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-048-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Deuda D 1 creada desde Deudas → «Nueva deuda».

**Datos de prueba:**

- D 1: Sofía te debe $60.000, con fecha 15/08/2026.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la Pestaña 1, escribir /debts?status=all en la barra de direcciones y apretar Enter. | En la Pestaña 1 se ve la fila de «Sofía» pendiente con el botón «Marcar saldada». |
| 2 | Abrir una segunda pestaña (Pestaña 2) en la misma ventana de incógnito, escribir /debts?status=all y apretar Enter. | En la Pestaña 2 también se ve la fila de «Sofía» pendiente con el botón «Marcar saldada». |
| 3 | En la Pestaña 2, tocar «Marcar saldada». | En la Pestaña 2 la deuda de «Sofía» pasa a saldada. |
| 4 | Volver a la Pestaña 1 (sin recargarla) y tocar el botón «Marcar saldada». | En la Pestaña 1 aparece el aviso de error con «No se pudo actualizar la deuda» y el motivo «La deuda ya está saldada», y la lista se refresca mostrando la fila de «Sofía» como saldada. |

---

### CP-DEU-049 — Por API, saldar una deuda ya saldada se rechaza

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Transición de estados · Negativo |
| Trazabilidad | US-39 · CA-6 (parte 1) · FR-18 · I9 · C6 |
| Historias de usuario | US-39 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-049-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
5. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-deu-049-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
6. Una deuda «Sofía te debe $60.000» con fecha 15/08/2026, ya marcada como saldada (botón «Marcar saldada»).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Con el token del usuario, enviar POST a /rest/v1/rpc/settle_debt con {"p_debt_id": "<ID de una deuda ya saldada>"}. | Responde 400 con el código 23514 y el mensaje «La deuda ya está saldada»; la deuda sigue saldada con su fecha original. |

**Notas del diseño:** Caso por API: se hace con Postman (o curl), no desde la pantalla.

---

### CP-DEU-050 — Por API, un usuario no puede saldar la deuda de otro

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Trazabilidad | US-39 · CA-6 (parte 2) · ADR-037 §3 · FR-18 · C6 · C7 |
| Historias de usuario | US-39 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Dos usuarios de prueba NUEVOS: A (qa+cp-deu-050-a@example.com) y B (qa+cp-deu-050-b@example.com), los dos con contraseña Clave123!. Cómo crearlos: en la pantalla «Entrar» tocar «Crear una cuenta», completar el email, la contraseña y «Confirmar contraseña», tocar «Crear cuenta» y «Saltear» en los 4 pasos de la configuración inicial; cada usuario en su propia ventana de incógnito.
4. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
5. Token de cada usuario: igual que el token de un solo usuario (POST a SUPABASE_URL/auth/v1/token?grant_type=password con «apikey» = ANON_KEY y el email y la contraseña del usuario); copiar el «access_token» de A y el de B.
6. Usuarios A y B. Una deuda «Sofía te debe $60.000» con fecha 15/08/2026, cargada por A y pendiente.

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Con el token del usuario B, enviar POST a /rest/v1/rpc/settle_debt con el ID de una deuda del usuario A. | Responde 400 con el código 23514 y «La deuda no existe»; la deuda de A sigue pendiente. |

**Notas del diseño:** Caso por API: se hace con Postman (o curl), no desde la pantalla.

---

### CP-DEU-051 — Por API, no se puede modificar una deuda directamente

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Trazabilidad | US-39 · CA-7 · ADR-037 §1 · FR-18 · C7 |
| Historias de usuario | US-39 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-051-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
5. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-deu-051-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
6. Una deuda «Sofía te debe $60.000» con fecha 15/08/2026 (pendiente).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Con el token del usuario, enviar PATCH a /rest/v1/debts?id=eq.<ID> con {"status": "settled"}. | Responde 403 con el código 42501 («permission denied for table debts»); la deuda sigue pendiente. |

**Notas del diseño:** Caso por API: se hace con Postman (o curl), no desde la pantalla.

---

### CP-DEU-052 — «Volver a pendiente» desde «Saldadas»

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-40 · CA-1, CA-2 · FR-18 · I9 · C10 |
| Historias de usuario | US-40 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-052-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-052-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Deuda creada desde Deudas → «Nueva deuda».

**Datos de prueba:**

- D 1: Sofía te debe US$40 (a tipo de cambio 1250), con fecha 15/08/2026 y nota «Viaje».

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts?status=settled a la dirección de la app y apretar Enter. | Se ve la fila de «Sofía» con el botón «Volver a pendiente». |
| 2 | Tocar «Volver a pendiente». | La fila sale de «Saldadas», aparece «Todavía no saldaste ninguna deuda.» y se muestra el aviso con el texto exacto «La deuda con Sofía volvió a pendiente». |

---

### CP-DEU-053 — Saldar y reabrir tres veces seguidas deja la deuda pendiente

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Transición de estados · Límite |
| Trazabilidad | US-40 · CA-5 · FR-18 · I9 |
| Historias de usuario | US-40 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-053-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-053-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Deuda pendiente creada desde Deudas → «Nueva deuda».
6. Fechas que dependen de hoy: «mes actual» es el mes de hoy; «mes anterior» es el mes calendario anterior; «el día 10 del mes actual» es el día 10 del mes de hoy (si hoy es antes del 10, la fecha de hoy); «el día 15 del mes anterior» es el 15 del mes anterior; «hoy» es el día en que se ejecuta el caso. En las direcciones, period=AAAA-MM es el año y el mes con dos dígitos (por ejemplo, para octubre de 2026: period=2026-10).

**Datos de prueba:**

- D 1: Sofía te debe $60.000, con fecha 15/08/2026.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts?status=all a la dirección de la app y apretar Enter. | Se ve 1 sola fila («Sofía», pendiente). |
| 2 | Tocar «Marcar saldada». | La fila pasa a «Saldada el [fecha de hoy]» con el botón «Volver a pendiente». |
| 3 | Tocar «Volver a pendiente». | La fila vuelve a «Pendiente» con el botón «Marcar saldada». |
| 4 | Tocar «Marcar saldada». | La fila pasa a «Saldada el [fecha de hoy]» con el botón «Volver a pendiente». |
| 5 | Tocar «Volver a pendiente». | La fila vuelve a «Pendiente» con el botón «Marcar saldada». |
| 6 | Tocar «Marcar saldada». | La fila pasa a «Saldada el [fecha de hoy]» con el botón «Volver a pendiente». |
| 7 | Tocar «Volver a pendiente». | En /debts?status=all sigue habiendo exactamente 1 fila, con estado «Pendiente» y «Te deben» = «$60.000,00». |

---

### CP-DEU-054 — Filtro por dirección: «Todas», «Te deben» y «Debés»

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-79 · CA-1, CA-2, CA-7, CA-8, CA-9 · FR-18 · C11 |
| Historias de usuario | US-79 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-054-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-054-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Deudas pendientes D 1 y D 2 creadas desde Deudas → «Nueva deuda».

**Datos de prueba:**

- D 1: Sofía te debe $60.000, con fecha 15/08/2026.
- D 2: Le debés $15.000 a Ana, con fecha 15/08/2026.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts a la dirección de la app y apretar Enter. | Debajo del filtro de estado aparece el filtro de dirección con «Todas» (seleccionado), «Te deben» y «Debés». Se ven las 2 filas («Sofía» y «Ana»). |
| 2 | Tocar «Te deben». | La URL cambia a /debts?direction=owed_to_me, «Te deben» queda seleccionado, la lista muestra solo a «Sofía», la tarjeta de totales sigue mostrando «Te deben» = «$60.000,00», «Debés» = «$15.000,00» y «A tu favor $45.000,00». |
| 3 | Tocar «Debés». | La URL cambia a /debts?direction=i_owe, «Debés» queda seleccionado, la lista muestra solo a «Ana», la tarjeta de totales no cambia. |

---

### CP-DEU-055 — Gasto compartido con varias personas: agregar, quitar y guardar

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Caso de uso · Positivo |
| Trazabilidad | US-82 · CA-1, CA-2, CA-10, CA-22 · FR-18 · I7 |
| Historias de usuario | US-82 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-055-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-055-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Escribir 120000 en el monto y tocar «Siguiente». | Se abre el paso 2 de 3. |
| 2 | Tocar la categoría «Otros». | Se abre el paso 3 de 3. |
| 3 | En «Fecha» tocar «Otra» y escribir 15/08/2026. | El campo de fecha muestra 15/08/2026. |
| 4 | Tocar el interruptor «Gasto compartido». | Aparece 1 sola fila vacía, sin botón «Quitar»; debajo se ven los botones «Agregar persona» y «Dividir en partes iguales». |
| 5 | En la fila 1 escribir Sofía en «¿Con quién?» y 40000 en «¿Cuánto te debe?». | La fila 1 muestra Sofía y 40000. |
| 6 | Tocar «Agregar persona». | Se agrega la fila 2 vacía al final, el cursor queda en «¿Con quién?» de la fila 2 y aparece el botón «Quitar» en las dos filas. |
| 7 | En la fila 2 escribir Juan en «¿Con quién?» y 40000 en «¿Cuánto te debe?». | El resumen muestra «Te van a deber $80.000,00 entre 2 personas · Tu parte: $40.000,00». |
| 8 | Tocar «Guardar gasto». | Aparece el aviso «Gasto guardado» con la descripción «Juan y Sofía te deben $80.000,00». |
| 9 | Agregar /transactions?period=2026-08 a la dirección de la app y apretar Enter. | La fila del gasto muestra la etiqueta «Compartido con Juan y Sofía». |
| 10 | Agregar /dashboard?period=2026-08 a la dirección de la app y apretar Enter. | En «Últimos movimientos», la fila del gasto muestra «Compartido con Juan y Sofía». |

---

### CP-DEU-056 — Se puede compartir con hasta 10 personas

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-82 · CA-5, CA-22 · FR-18 · I7 |
| Historias de usuario | US-82 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-056-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-056-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Escribir 110000 en el campo del monto y tocar «Siguiente». | Se abre el paso 2 de 3. |
| 2 | Tocar la categoría «Otros». | Se abre el paso 3 de 3. |
| 3 | En la sección «Fecha», tocar «Otra» y escribir 15/08/2026. | El campo de fecha muestra 15/08/2026. |
| 4 | Tocar el interruptor «Gasto compartido». | Aparece la fila 1. |
| 5 | Completar la fila 1 con Persona 01 y 10000, y tocar 9 veces en «Agregar persona», completando las filas 2 a 10 con Persona 02 a Persona 10 y 10000 en cada una. | Hay 10 filas, el botón «Agregar persona» está deshabilitado (disabled), y aparece el texto exacto «Podés compartir un gasto con hasta 10 personas». |
| 6 | Tocar el botón «Guardar gasto». | Aparece el aviso «Gasto guardado» con la descripción exacta «Persona 01, Persona 02, Persona 03, Persona 04, Persona 05, Persona 06, Persona 07, Persona 08, Persona 09 y Persona 10 te deben $100.000,00». |

---

### CP-DEU-057 — Por API, deudas que suman más que el gasto se rechazan

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-82 · CA-14 · FR-18 · I7 |
| Historias de usuario | US-82 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-057-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
5. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-deu-057-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
6. Identificadores de la categoría «Otros» y de la cuenta «Efectivo»: pedidos GET a SUPABASE_URL/rest/v1/categories?select=id,name y SUPABASE_URL/rest/v1/accounts?select=id,name,type con los encabezados «apikey» = ANON_KEY y «Authorization» = Bearer + el token. Anotar el «id» de «Otros» y el de «Efectivo».
7. Gasto de ejemplo: monto 120000 en pesos, fecha 2026-08-15, con la cuenta «Efectivo» y la categoría «Otros» del usuario de prueba.

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Enviar create_transaction de 120000 con montos 60000 y 60000.01. | Responde 400 con el código 23514 y «I7: la suma de las deudas no puede superar el monto del gasto»; no se crea nada. |

**Notas del diseño:** Caso por API: se hace con Postman (o curl), no desde la pantalla.

---

### CP-DEU-058 — Resumen: gasto bruto y neto de reembolsos

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Caso de uso · Positivo |
| Trazabilidad | US-30 · CA-1, CA-9, CA-10 · FR-19 · R3 · I7, I10 |
| Historias de usuario | US-30 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-058-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-058-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Gasto de $120.000 en una cuota, con fecha 15/08/2026 y nota «Supermercado», compartido con Sofía ($60.000) (Registrar → «Gasto compartido»). Se carga desde Registrar (categoría «Otros», cuenta «Efectivo»).
6. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /dashboard?period=2026-08 a la dirección de la app y apretar Enter. | En la tarjeta «Gastado en agosto 2026»: el gasto total muestra «$120.000,00» (bruto); aparece la fila «Neto de reembolsos» y el monto del neto = «$60.000,00»; la aclaración del neto no se ve; y debajo se ve el enlace «Ver deudas». |
| 2 | Tocar el enlace «Ver deudas». | El navegador navega a /debts y muestra la deuda de Sofía por $60.000,00. |

---

### CP-DEU-059 — Resumen: el neto no cambia al saldar la deuda

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-30 · CA-2, CA-10 · FR-19 · R3 · I9, I10 |
| Historias de usuario | US-30 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-059-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-059-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Gasto de $120.000 en una cuota, con fecha 15/08/2026, compartido con Sofía ($60.000) (Registrar → «Gasto compartido»). Se carga desde Registrar (categoría «Otros», cuenta «Efectivo»).
6. Esa deuda marcada como saldada hoy (botón «Marcar saldada»).
7. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).
8. Fechas que dependen de hoy: «mes actual» es el mes de hoy; «mes anterior» es el mes calendario anterior; «el día 10 del mes actual» es el día 10 del mes de hoy (si hoy es antes del 10, la fecha de hoy); «el día 15 del mes anterior» es el 15 del mes anterior; «hoy» es el día en que se ejecuta el caso. En las direcciones, period=AAAA-MM es el año y el mes con dos dígitos (por ejemplo, para octubre de 2026: period=2026-10).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /dashboard?period=2026-08 a la dirección de la app y apretar Enter. | El gasto total muestra «$120.000,00» y el monto del neto muestra «$60.000,00». |

---

### CP-DEU-060 — Resumen: una deuda suelta «Me deben» no cambia el neto

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Trazabilidad | US-30 · CA-4 · FR-19 · I7 |
| Historias de usuario | US-30 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-060-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-060-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Gasto de $80.000 en una cuota, con fecha 15/08/2026. Se carga desde Registrar (categoría «Otros», cuenta «Efectivo»).
6. Deuda cargada desde Deudas → «Nueva deuda»: Juan te debe $25.000, con fecha 16/08/2026.
7. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /dashboard?period=2026-08 a la dirección de la app y apretar Enter. | El gasto total muestra «$80.000,00» y la fila «Neto de reembolsos» no se ve. |

---

### CP-DEU-061 — Resumen: el neto en dólares no cambia si cambia el tipo de cambio

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Caso de uso · Positivo |
| Trazabilidad | US-30 · CA-6, CA-10 · FR-19 · R2, R3 · I4, I7, I10 |
| Historias de usuario | US-30 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-061-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-061-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Gasto de US$100 a tipo de cambio 1250 en una cuota, con fecha 15/08/2026, compartido con Sofía (US$40) (Registrar → «Gasto compartido»). Se carga desde Registrar (categoría «Otros», cuenta «Efectivo»).
6. Tipo de cambio de referencia cambiado a 1500 para agosto de 2026: Ajustes → «Tipo de cambio de referencia» → elegir el mes, escribir el valor y «Guardar tipo de cambio».
7. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /dashboard?period=2026-08 a la dirección de la app y apretar Enter. | El gasto total muestra «$125.000,00» y el monto del neto muestra «$75.000,00» ($125.000,00 − $50.000,00, usando el valor en pesos congelado de la deuda y no $60.000,00). |

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

### CP-NAV-002 — «Deudas» lleva a Deudas

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

- Pantalla de partida: Registrar

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Tocar «Deudas» en la barra. | Se abre Deudas y la dirección termina en /debts. |

---

### CP-NAV-003 — En el Resumen la barra marca «Resumen»

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-003-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-003-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Pantalla a abrir: /dashboard?period=2026-08

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de direcciones agregar /dashboard?period=2026-08 a la dirección de la app y apretar Enter. | Se abre el Resumen de agosto de 2026. |
| 2 | Mirar la barra de navegación. | «Resumen» queda resaltado (verde y en negrita); las otras secciones no. |
| 3 | Verificación adicional: apretar F12, abrir «Console», pegar este texto y apretar Enter: [...document.querySelectorAll('nav[aria-label="Principal"] a[data-testid^="dashboard-nav-"]')].map(a=>[a.textContent.trim(),a.getAttribute('aria-current')]) | Devuelve [["Registrar", null], ["Resumen", "page"], ["Deudas", null], ["Suscripciones", null], ["", null]]: solo «Resumen» tiene aria-current="page". |

---

### CP-NAV-004 — En Ajustes no se marca ninguna de las cuatro secciones

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-004-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-004-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Pantalla a abrir: /settings

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la barra de direcciones agregar /settings a la dirección de la app y apretar Enter. | Se abre Ajustes. |
| 2 | Mirar la barra de navegación. | Ninguna de las cuatro secciones queda resaltada; solo el engranaje de Ajustes. |
| 3 | Verificación adicional: apretar F12, abrir «Console», pegar este texto y apretar Enter: [...document.querySelectorAll('nav[aria-label="Principal"] a[data-testid^="settings-nav-"]')].map(a=>[a.textContent.trim(),a.getAttribute('aria-current')]) | Devuelve [["Registrar", null], ["Resumen", null], ["Deudas", null], ["Suscripciones", null], ["", "page"]]: solo «Ajustes» tiene aria-current="page". |

---

### CP-NAV-005 — Ancho 1023 px: barra abajo y engranaje de Ajustes

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-005-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-005-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Pantalla del navegador con ancho de 1023 px y alto de 812 px: apretar F12, tocar el ícono «Toggle device toolbar» (pantalla adaptable) y escribir 1023 en el ancho y 812 en el alto. Comprobar que arriba dice 1023 × 812.
6. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Ancho de pantalla: 1023 × 812

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Mirar la navegación y el encabezado. | La navegación está fija abajo, no hay barra lateral y se ve el engranaje «Ajustes» arriba. |

---

### CP-NAV-006 — Ancho 1024 px: barra lateral con Ajustes al pie

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-006-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-006-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Pantalla del navegador con ancho de 1024 px y alto de 812 px: apretar F12, tocar el ícono «Toggle device toolbar» (pantalla adaptable) y escribir 1024 en el ancho y 812 en el alto. Comprobar que arriba dice 1024 × 812.
6. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).

**Datos de prueba:**

- Ancho de pantalla: 1024 × 812

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Mirar la navegación. | Hay una barra lateral de 240 px a la izquierda con los cuatro ítems y «Ajustes» abajo de todo; no hay barra inferior ni engranaje. |

---

### CP-NAV-007 — Identificadores únicos en Registrar (375 px)

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-007-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-007-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
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

### CP-NAV-008 — «Ver todos» y «‹ Resumen» mantienen el mes

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-008-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Un gasto ya cargado de $1.200 con fecha 15/08/2026 en una cuota: en Registrar escribir el monto, «Siguiente», elegir una categoría y una cuenta, en «Fecha» tocar «Otra» y escribir 15/08/2026, dejar «1» cuota y tocar «Guardar gasto».
5. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-008-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).

**Datos de prueba:**

- Mes: agosto de 2026
- Gasto: $1.200

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /dashboard?period=2026-08 a la dirección de la app y apretar Enter. | Se abre el Resumen de agosto de 2026 y se ve el gasto. |
| 2 | Tocar «Ver todos». | Se abre Movimientos de agosto de 2026: la dirección queda exactamente …/transactions?period=2026-08. |
| 3 | Tocar «‹ Resumen». | Se vuelve al Resumen de agosto de 2026: la dirección queda …/dashboard?period=2026-08. |

---

### CP-NAV-009 — Deudas no arrastra el mes del Resumen

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-009-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-009-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).

**Datos de prueba:**

- Mes de partida: agosto de 2026

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /dashboard?period=2026-08 a la dirección de la app y apretar Enter. | Se abre el Resumen de agosto de 2026. |
| 2 | Tocar «Deudas» en la barra. | Se abre Deudas y la dirección queda exactamente …/debts, sin «?period». |

---

### CP-NAV-010 — Tocar «Registrar» estando en Registrar no pierde lo cargado

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-010-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-010-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).

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

### CP-NAV-011 — Guardar $12.500 muestra la confirmación completa

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-011-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-011-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).

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

### CP-NAV-012 — Sin internet el gasto no se pierde y aparece «Reintentar»

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-012-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-012-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
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

### CP-NAV-013 — Reintentar al volver internet guarda una sola vez

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-013-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-013-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
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

### CP-NAV-014 — Con internet muy lenta, a los 15 segundos avisa que falló

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-014-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-014-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
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

### CP-NAV-015 — Reintentar no duplica un gasto que ya se había guardado

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-015-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-015-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
7. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).
8. Internet funcionando normalmente al empezar el caso (la conexión se corta recién en el paso que lo indica).
9. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
10. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-nav-015-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
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

### CP-NAV-016 — La misma clave dos veces seguidas devuelve el mismo gasto

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-016-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
7. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-nav-016-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
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

### CP-NAV-017 — Dos pedidos simultáneos con la misma clave crean un solo gasto

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-017-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
7. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-nav-017-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
8. Identificadores de la categoría «Comida» y de la cuenta «Visa BBVA»: pedidos GET a SUPABASE_URL/rest/v1/categories?select=id,name y SUPABASE_URL/rest/v1/accounts?select=id,name,type con los encabezados «apikey» = ANON_KEY y «Authorization» = Bearer + el token. Anotar el «id» de «Comida» (ID_COMIDA) y el de «Visa BBVA» (ID_VISA).

**Datos de prueba:**

- Clave de reintento: 41000000-0000-4000-8000-000000000041

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Preparar DOS pedidos idénticos (como el paso 1 del caso anterior) con la clave 41000000-0000-4000-8000-000000000041 y enviarlos al mismo tiempo (por ejemplo, con el runner de Postman con 2 iteraciones en paralelo, o el script de PowerShell «NAV-CONC-01» del caso original). | Los dos responden 200 con el mismo identificador (ID-1) y ninguno devuelve el código 23505. |
| 2 | Pedido GET a SUPABASE_URL/rest/v1/transactions?select=id,amount_text:amount::text,request_id,deleted_at&request_id=eq.41000000-0000-4000-8000-000000000041 con los mismos encabezados. | Responde 200 con UNA sola fila: id = ID-1, amount_text = "12500.00" y deleted_at = null. |
| 3 | Pedido GET a SUPABASE_URL/rest/v1/ledger_entries?select=transaction_id,installment_number,amount_text:amount::text&transaction_id=eq.ID-1 con los mismos encabezados. | Responde 200 con UNA sola fila: installment_number = 1 y amount_text = "12500.00". |

---

### CP-NAV-018 — La misma clave en dos usuarios distintos no se pisa

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-018-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
7. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-nav-018-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
8. Identificadores de la categoría «Comida» y de la cuenta «Visa BBVA»: pedidos GET a SUPABASE_URL/rest/v1/categories?select=id,name y SUPABASE_URL/rest/v1/accounts?select=id,name,type con los encabezados «apikey» = ANON_KEY y «Authorization» = Bearer + el token. Anotar el «id» de «Comida» (ID_COMIDA) y el de «Visa BBVA» (ID_VISA).
9. Segundo usuario de prueba (B): crearlo igual que el primero con el email qa+cp-nav-018-002@example.com (Clave123!), con su propia cuenta «Visa BBVA» y categorías «Comida» y «Tecnología», y obtener también su token e identificadores. El primer usuario es A.

**Datos de prueba:**

- Clave de reintento: 43000000-0000-4000-8000-000000000043

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Con el token del usuario A: En Postman, pedido POST a SUPABASE_URL/rest/v1/rpc/create_transaction con los encabezados «apikey» = ANON_KEY, «Authorization» = Bearer + token y «Content-Type: application/json», y este cuerpo: {"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"ID_COMIDA","p_account_id":"ID_VISA","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"43000000-0000-4000-8000-000000000043"} | Responde 200 y un identificador (ID-A). |
| 2 | Con el token del usuario B: el mismo pedido (con los ID_COMIDA e ID_VISA propios de B). | Responde 200 y un identificador distinto (ID-B). |
| 3 | Con el token de A: pedido GET a SUPABASE_URL/rest/v1/transactions?select=id,user_id,request_id&request_id=eq.43000000-0000-4000-8000-000000000043. | Responde 200 con UNA fila: id = ID-A y el user_id de A. |
| 4 | Con el token de B: el mismo pedido GET. | Responde 200 con UNA fila: id = ID-B y el user_id de B; no aparece ID-A. |

**Notas del diseño:** Este caso necesita dos usuarios: A (qa+cp-nav-018-001@example.com) y B (qa+cp-nav-018-002@example.com).

---

### CP-NAV-019 — Si se archiva la categoría antes de guardar, el gasto se rechaza con aviso

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-019-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-019-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
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

### CP-NAV-020 — La API rechaza un gasto con una categoría archivada

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-020-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
7. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-nav-020-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
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

### CP-NAV-021 — Al volver a Registrar aparece el gasto pendiente

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-021-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-021-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
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

### CP-NAV-022 — Recuperar un gasto que en realidad ya estaba guardado

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-022-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-022-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
7. Saber abrir las herramientas del desarrollador de Chrome con la tecla F12 (se usan las pestañas «Network» y «Console»).
8. Internet funcionando normalmente al empezar el caso (la conexión se corta recién en el paso que lo indica).
9. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
10. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-nav-022-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
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

### CP-NAV-023 — Descartar borra el pendiente, incluso al recargar

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-023-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-023-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
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

### CP-NAV-024 — Cerrar sesión borra los pendientes

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-024-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-024-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
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

### CP-NAV-025 — Tocar dos veces «Guardar» guarda una sola vez

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-nav-025-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Cuenta «Visa BBVA» creada: tocar el engranaje «Ajustes» (en computadora, «Ajustes» en el menú lateral); en «Cuentas» escribir «Visa BBVA» en «Nueva cuenta», elegir el tipo «Tarjeta de crédito» y tocar «Crear cuenta». «Visa BBVA» debe aparecer en la lista.
5. Categorías «Comida» y «Tecnología»: en Ajustes → «Categorías» tocar el lápiz de «Comida y supermercado», cambiar el nombre a «Comida» y guardar; después escribir «Tecnología» en «Nueva categoría» y tocar «Crear categoría». Las dos deben verse en la lista.
6. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-nav-025-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
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
