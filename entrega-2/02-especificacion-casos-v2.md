# Entrega 2 · Especificación de casos de prueba (V2) · Deudas y Navegación

Planilla: `02-especificacion-casos-v2.xlsx` (una hoja por caso, mismo formato que la Entrega 1: ID, prioridad, técnica, trazabilidad, pre-requisitos, datos de prueba, pasos y resultado esperado). Alcance de este documento: **CP-DEU-018 a CP-DEU-029** (validaciones de gasto compartido, US-34 · CA-8), **CP-DEU-100 a CP-DEU-159** (listado, saldar, filtros, varias personas, neto y balance: US-30, US-37 a US-40, US-79, US-82 y US-83) y **CP-NAV-001 a CP-NAV-085** (Navegación e interfaz, US-69 y US-70): **190 casos**.

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
| CP-DEU-100 | Media | Abrir la dirección de «Saldadas» y recargar mantiene el filtro | US-38 | No | Positivo | Caso de uso |
| CP-DEU-101 | Baja | Un filtro inválido en la dirección se trata como «Pendientes» | US-38 | No | Negativo | Partición de equivalencia |
| CP-DEU-102 | Media | Deudas pendientes: la de fecha más nueva va primero | US-38 | No | Positivo | Caso de uso |
| CP-DEU-102B | Media | Deudas saldadas: la saldada más recientemente va primero | US-38 | No | Positivo | Caso de uso |
| CP-DEU-103 | Media | Sin deudas pendientes: mensaje y botón «Cargar una deuda» | US-38 | No | Límite | Partición de equivalencia |
| CP-DEU-104 | Baja | Sin deudas saldadas: mensaje y sin botón | US-38 | No | Límite | Partición de equivalencia |
| CP-DEU-105 | Baja | Sin ninguna deuda en «Todas»: mensaje y botón «Cargar una deuda» | US-38 | No | Límite | Partición de equivalencia |
| CP-DEU-106 | Alta | Otro usuario no ve las deudas de alguien más | US-38 | No | Negativo | Adivinación de errores |
| CP-DEU-107 | Alta | Por API, otro usuario no recibe las deudas de alguien más | US-38 | No | Negativo | Adivinación de errores |
| CP-DEU-108 | Alta | Por API, sin sesión no se pueden leer las deudas | US-38 | No | Negativo | Adivinación de errores |
| CP-DEU-108B | Alta | Sin sesión, la dirección /debts lleva al login | US-38 | No | Negativo | Transición de estados |
| CP-DEU-108C | Alta | Sin sesión, la dirección /debts/new lleva al login | US-36, US-38 | No | Negativo | Transición de estados |
| CP-DEU-109 | Alta | Marcar una deuda como saldada desde «Pendientes» | US-30, US-37, US-39 | Sí | Positivo | Transición de estados |
| CP-DEU-110 | Alta | Marcar saldada desde «Todas» deja la fila como saldada | US-39 | Sí | Positivo | Transición de estados |
| CP-DEU-111 | Alta | «Deshacer» devuelve la deuda a pendiente | US-39 | No | Positivo | Transición de estados |
| CP-DEU-111B | Media | El aviso con «Deshacer» desaparece al cambiar de filtro | US-39 | No | Positivo | Transición de estados |
| CP-DEU-112 | Media | Saldar una deuda que ya se saldó en otra pestaña muestra un error | US-39 | No | Negativo | Transición de estados |
| CP-DEU-113 | Alta | Por API, saldar una deuda ya saldada se rechaza | US-39 | No | Negativo | Transición de estados |
| CP-DEU-114 | Alta | Por API, un usuario no puede saldar la deuda de otro | US-39 | No | Negativo | Adivinación de errores |
| CP-DEU-114B | Media | Por API, saldar una deuda que no existe se rechaza | US-39 | No | Negativo | Partición de equivalencia |
| CP-DEU-115 | Alta | Por API, sin sesión no se puede saldar una deuda | US-39 | No | Negativo | Adivinación de errores |
| CP-DEU-116 | Alta | Por API, no se puede modificar una deuda directamente | US-39 | No | Negativo | Adivinación de errores |
| CP-DEU-116B | Alta | Por API, no se puede borrar una deuda directamente | US-39 | No | Negativo | Adivinación de errores |
| CP-DEU-117 | Alta | «Volver a pendiente» desde «Saldadas» | US-40 | Sí | Positivo | Transición de estados |
| CP-DEU-118 | Alta | «Volver a pendiente» desde «Todas» actualiza los totales | US-37, US-40 | Sí | Positivo | Transición de estados |
| CP-DEU-119 | Alta | Por API, reabrir una deuda que ya está pendiente se rechaza | US-40 | No | Negativo | Transición de estados |
| CP-DEU-119B | Media | Volver a pendiente una deuda que ya se reabrió en otra pestaña muestra un error | US-40 | No | Negativo | Transición de estados |
| CP-DEU-120 | Alta | Por API, un usuario no puede reabrir la deuda de otro | US-40 | No | Negativo | Adivinación de errores |
| CP-DEU-120B | Media | Por API, reabrir una deuda que no existe se rechaza | US-40 | No | Negativo | Partición de equivalencia |
| CP-DEU-121 | Alta | Por API, sin sesión no se puede reabrir una deuda | US-40 | No | Negativo | Adivinación de errores |
| CP-DEU-122 | Media | Saldar y reabrir tres veces seguidas deja la deuda pendiente | US-40 | No | Límite | Transición de estados |
| CP-DEU-123 | Alta | Filtro por dirección: «Todas», «Te deben» y «Debés» | US-79 | Sí | Positivo | Transición de estados |
| CP-DEU-124 | Media | Los filtros de estado y de dirección se combinan | US-79 | Sí | Positivo | Tabla de decisión |
| CP-DEU-125 | Baja | Una dirección inválida se trata como «Todas» | US-79 | No | Negativo | Partición de equivalencia |
| CP-DEU-126 | Baja | Sin deudas: «Pendientes» + «Te deben» | US-79 | No | Límite | Tabla de decisión |
| CP-DEU-126B | Baja | Sin deudas: «Saldadas» + «Te deben» | US-79 | No | Límite | Tabla de decisión |
| CP-DEU-126C | Baja | Sin deudas: «Todas» + «Te deben» | US-79 | No | Límite | Tabla de decisión |
| CP-DEU-127 | Baja | Sin deudas: «Pendientes» + «Debés» | US-79 | No | Límite | Tabla de decisión |
| CP-DEU-127B | Baja | Sin deudas: «Saldadas» + «Debés» | US-79 | No | Límite | Tabla de decisión |
| CP-DEU-127C | Baja | Sin deudas: «Todas» + «Debés» | US-79 | No | Límite | Tabla de decisión |
| CP-DEU-128 | Alta | Gasto compartido con varias personas: agregar, quitar y guardar | US-82 | Sí | Positivo | Caso de uso |
| CP-DEU-128B | Media | Las personas se ordenan por nombre sin distinguir mayúsculas ni tildes | US-38, US-82 | No | Positivo | Partición de equivalencia |
| CP-DEU-129 | Alta | «Dividir en partes iguales» entre 2 personas | US-82 | Sí | Positivo | Valores límite |
| CP-DEU-129B | Media | Dividir un gasto de $0,02 entre 2 personas da error | US-82 | No | Negativo | Valores límite |
| CP-DEU-129C | Baja | «Dividir en partes iguales» con los nombres vacíos | US-82 | No | Positivo | Partición de equivalencia |
| CP-DEU-130 | Media | «Dividir en partes iguales» entre 3 personas | US-82 | No | Positivo | Partición de equivalencia |
| CP-DEU-130B | Media | Cambiar la moneda con personas cargadas vacía los montos | US-82 | No | Positivo | Transición de estados |
| CP-DEU-130C | Media | «Dividir en partes iguales» en dólares | US-82 | No | Positivo | Valores límite |
| CP-DEU-130D | Media | En dólares, dividir un gasto muy chico da error de centavos | US-34, US-82 | No | Negativo | Valores límite |
| CP-DEU-131 | Alta | Entre todos pueden deber todo el gasto (tu parte es $0) | US-82 | No | Límite | Valores límite |
| CP-DEU-132 | Alta | La suma de lo que te deben no puede superar el gasto | US-82 | No | Límite | Valores límite |
| CP-DEU-132B | Media | Bajar el gasto por debajo de lo que te deben da error | US-82 | No | Negativo | Transición de estados |
| CP-DEU-132C | Media | Una persona que debe más que el gasto da error en su fila | US-41, US-82 | No | Negativo | Partición de equivalencia |
| CP-DEU-132D | Media | Bajar el gasto muy por debajo da error en cada fila | US-82 | No | Negativo | Transición de estados |
| CP-DEU-133 | Alta | Se puede compartir con hasta 10 personas | US-82 | No | Límite | Valores límite |
| CP-DEU-134 | Alta | No se puede repetir una persona | US-82 | No | Negativo | Partición de equivalencia |
| CP-DEU-135 | Media | Una persona sin nombre da error en su fila | US-82 | No | Negativo | Partición de equivalencia |
| CP-DEU-135B | Media | Quitar una persona conserva a las demás | US-82 | No | Positivo | Transición de estados |
| CP-DEU-135C | Media | Pasar a Ingreso y volver a Gasto reinicia la sección compartida | US-82 | No | Positivo | Transición de estados |
| CP-DEU-135D | Media | Apagar «Gasto compartido» guarda el gasto sin deudas | US-82 | No | Positivo | Transición de estados |
| CP-DEU-136 | Alta | Gasto compartido con 3 personas en 2 cuotas: etiqueta en Movimientos y Resumen | US-82 | Sí | Positivo | Partición de equivalencia |
| CP-DEU-136B | Media | Al borrar un gasto con varias deudas, el aviso las lista | US-82 | No | Positivo | Caso de uso |
| CP-DEU-136C | Alta | Las 3 deudas de un mismo gasto aparecen en Deudas | US-30, US-37, US-38, US-82 | Sí | Positivo | Caso de uso |
| CP-DEU-136D | Alta | Eliminar el gasto saca sus 3 deudas | US-35, US-82 | No | Positivo | Transición de estados |
| CP-DEU-136E | Alta | Restaurar el gasto devuelve sus 3 deudas con su estado | US-35, US-82 | No | Positivo | Transición de estados |
| CP-DEU-137 | Alta | Por API, 2 personas y 1 monto se rechaza | US-82 | No | Negativo | Partición de equivalencia |
| CP-DEU-138 | Media | Por API, listas vacías se rechazan | US-82 | No | Límite | Valores límite |
| CP-DEU-139 | Alta | Por API, 11 personas se rechaza | US-82 | No | Límite | Valores límite |
| CP-DEU-140 | Alta | Por API, la misma persona repetida se rechaza | US-82 | No | Negativo | Partición de equivalencia |
| CP-DEU-141 | Alta | Por API, deudas que suman más que el gasto se rechazan | US-82 | No | Límite | Valores límite |
| CP-DEU-142 | Alta | Dólares: el redondeo hace que las deudas sumen más que el gasto | US-82 | No | Límite | Valores límite |
| CP-DEU-142A | Alta | Por API, el mismo caso de redondeo se rechaza | US-82 | No | Límite | Valores límite |
| CP-DEU-142B | Alta | Por API, una segunda persona sin nombre se rechaza sin guardar nada | US-82 | No | Negativo | Partición de equivalencia |
| CP-DEU-143 | Alta | Resumen: gasto bruto y neto de reembolsos | US-30 | Sí | Positivo | Caso de uso |
| CP-DEU-144 | Alta | Resumen: el neto no cambia al saldar la deuda | US-30 | Sí | Positivo | Transición de estados |
| CP-DEU-145 | Alta | Resumen: gasto en 12 cuotas con deuda, neto negativo | US-30 | Sí | Límite | Valores límite |
| CP-DEU-146 | Alta | Resumen: una deuda suelta «Me deben» no cambia el neto | US-30 | No | Negativo | Partición de equivalencia |
| CP-DEU-147 | Alta | Resumen: una deuda suelta «Debo» no cambia el neto | US-30 | No | Negativo | Partición de equivalencia |
| CP-DEU-148 | Alta | Resumen: eliminar un gasto compartido actualiza el neto en vivo | US-30, US-35 | No | Positivo | Transición de estados |
| CP-DEU-148B | Alta | Resumen: restaurar un gasto compartido vuelve a restar su deuda | US-30, US-35 | No | Positivo | Transición de estados |
| CP-DEU-149 | Alta | Resumen: el neto en dólares no cambia si cambia el tipo de cambio | US-30 | Sí | Positivo | Caso de uso |
| CP-DEU-150 | Media | Resumen: sin deudas vinculadas no aparece el neto | US-30 | No | Negativo | Partición de equivalencia |
| CP-DEU-151 | Alta | Balance: una deuda suelta «Me deben» resta del balance del mes | US-83 | Sí | Positivo | Caso de uso |
| CP-DEU-152 | Alta | Balance: una deuda suelta «Debo» suma al balance del mes | US-83 | Sí | Positivo | Caso de uso |
| CP-DEU-153 | Alta | Balance: saldar la deuda suelta el mismo mes lo deja como antes | US-83 | Sí | Positivo | Transición de estados |
| CP-DEU-153B | Media | Balance en cero: deuda suelta creada y saldada el mismo mes | US-83 | No | Límite | Valores límite |
| CP-DEU-154 | Alta | Balance: una deuda saldada hoy mueve el balance de dos meses | US-83 | Sí | Positivo | Caso de uso |
| CP-DEU-155 | Alta | Balance: reabrir la deuda saca el evento del mes actual | US-83 | No | Positivo | Transición de estados |
| CP-DEU-156 | Alta | Balance: una deuda suelta «Debo» saldada hoy mueve dos meses | US-83 | Sí | Positivo | Caso de uso |
| CP-DEU-157 | Alta | Balance: la deuda en dólares conserva el tipo de cambio de origen | US-83 | Sí | Positivo | Caso de uso |
| CP-DEU-158 | Alta | Balance: un gasto compartido no aparece como deuda suelta | US-83 | No | Negativo | Partición de equivalencia |
| CP-DEU-159 | Alta | Un mes solo con una deuda suelta no se ve vacío | US-83 | No | Límite | Valores límite |
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

### CP-DEU-100 — Abrir la dirección de «Saldadas» y recargar mantiene el filtro

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Caso de uso · Positivo |
| Trazabilidad | US-38 · CA-3 · FR-18 · C11 |
| Historias de usuario | US-38 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-100-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-100-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Deudas D 1 y D 2 creadas desde Deudas → «Nueva deuda», y D 2 saldada con el botón «Marcar saldada».

**Datos de prueba:**

- D 1: Sofía te debe $60.000, con fecha 15/08/2026.
- D 2: Pedro te debe $8.000, con fecha 10/08/2026.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts?status=settled a la dirección de la app y apretar Enter. | «Saldadas» aparece seleccionado y solo se ve la fila de «Pedro». |
| 2 | Recargar la página del navegador (F5). | La URL sigue siendo /debts?status=settled, «Saldadas» sigue seleccionado y solo se ve la fila de «Pedro». |

---

### CP-DEU-101 — Un filtro inválido en la dirección se trata como «Pendientes»

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-101-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-101-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Deudas D 1 y D 2 creadas desde Deudas → «Nueva deuda», y D 2 saldada con el botón «Marcar saldada».

**Datos de prueba:**

- D 1: Sofía te debe $60.000, con fecha 15/08/2026.
- D 2: Pedro te debe $8.000, con fecha 10/08/2026.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts?status=xyz a la dirección de la app y apretar Enter. | «Pendientes» queda seleccionado y la lista muestra solo la fila pendiente de «Sofía». |
| 2 | Tocar el filtro «Saldadas». | La URL pasa a /debts?status=settled y se muestra solo la fila de «Pedro». |

---

### CP-DEU-102 — Deudas pendientes: la de fecha más nueva va primero

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-102-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-102-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. 3 deudas pendientes creadas secuencialmente (esperando 2 segundos entre cada una) desde Deudas → «Nueva deuda».

**Datos de prueba:**

- D 1: Ana te debe $10.000, con fecha 01/10/2026.
- D 2: Beto te debe $20.000, con fecha 15/08/2026.
- D 3: Carla te debe $30.000, con fecha 01/10/2026.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts a la dirección de la app y apretar Enter. | En «Pendientes», las 3 filas aparecen de arriba hacia abajo en el orden exacto: 1.º «Carla» (01/10/2026, creada más reciente), 2.º «Ana» (01/10/2026, creada antes), 3.º «Beto» (15/08/2026). |

---

### CP-DEU-102B — Deudas saldadas: la saldada más recientemente va primero

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Caso de uso · Positivo |
| Trazabilidad | US-38 · CA-5 (parte 2) · FR-18 · — |
| Historias de usuario | US-38 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-102b-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-102b-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Deudas D 1 y D 2 creadas desde Deudas → «Nueva deuda»; primero se salda D 1 con el botón «Marcar saldada» y, esperando 2 segundos, se salda D 2 con el botón «Marcar saldada».

**Datos de prueba:**

- D 1: Diego te debe $15.000, con fecha 10/08/2026.
- D 2: Elena te debe $25.000, con fecha 05/08/2026.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts?status=settled a la dirección de la app y apretar Enter. | En «Saldadas», las 2 filas aparecen de arriba hacia abajo en el orden exacto: 1.º «Elena» (saldada más recientemente), 2.º «Diego». |

---

### CP-DEU-103 — Sin deudas pendientes: mensaje y botón «Cargar una deuda»

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-103-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-103-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts a la dirección de la app y apretar Enter. | Se muestra el mensaje de lista vacía con el texto exacto «No tenés deudas pendientes.» y el botón «Cargar una deuda». |
| 2 | Tocar el botón «Cargar una deuda». | Navega a /debts/new. |

---

### CP-DEU-104 — Sin deudas saldadas: mensaje y sin botón

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Baja |
| Camino feliz | No |
| Técnica · Tipo | Partición de equivalencia · Límite |
| Trazabilidad | US-38 · CA-7 · FR-18 · — |
| Historias de usuario | US-38 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-104-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-104-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts?status=settled a la dirección de la app y apretar Enter. | Se muestra el mensaje de lista vacía con el texto exacto «Todavía no saldaste ninguna deuda.» y el botón no se ve. |

---

### CP-DEU-105 — Sin ninguna deuda en «Todas»: mensaje y botón «Cargar una deuda»

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Baja |
| Camino feliz | No |
| Técnica · Tipo | Partición de equivalencia · Límite |
| Trazabilidad | US-38 · CA-7 · FR-18 · — |
| Historias de usuario | US-38 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-105-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-105-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts?status=all a la dirección de la app y apretar Enter. | Se muestra el mensaje de lista vacía con el texto exacto «No cargaste ninguna deuda todavía.» y el botón «Cargar una deuda». |

---

### CP-DEU-106 — Otro usuario no ve las deudas de alguien más

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
3. Dos usuarios de prueba nuevos, cada uno con su propia sesión (ventana de incógnito distinta): Usuario A (qa+cp-deu-106-a@example.com) y Usuario B (qa+cp-deu-106-b@example.com), los dos con contraseña Clave123!. Cómo crearlos: en la pantalla «Entrar» tocar «Crear una cuenta», completar el email, la contraseña y «Confirmar contraseña», tocar «Crear cuenta» y «Saltear» en los 4 pasos de la configuración inicial. El caso se mira desde la ventana de incógnito del Usuario B.

**Datos de prueba:**

- D 1: Sofía te debe $60.000, con fecha 15/08/2026 (cargada por el Usuario A).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la ventana de incógnito donde inició sesión el Usuario B (qa+cp-deu-106-b@example.com), escribir /debts?status=all en la barra de direcciones y apretar Enter. | «Te deben» muestra «$0,00», «Debés» muestra «$0,00», el neto muestra «En cero» y se ve el estado vacío «No cargaste ninguna deuda todavía.» (0 filas del Usuario A visibles). |

---

### CP-DEU-107 — Por API, otro usuario no recibe las deudas de alguien más

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
3. Dos usuarios de prueba NUEVOS: A (qa+cp-deu-107-a@example.com) y B (qa+cp-deu-107-b@example.com), los dos con contraseña Clave123!. Cómo crearlos: en la pantalla «Entrar» tocar «Crear una cuenta», completar el email, la contraseña y «Confirmar contraseña», tocar «Crear cuenta» y «Saltear» en los 4 pasos de la configuración inicial; cada usuario en su propia ventana de incógnito.
4. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
5. Token de cada usuario: igual que el token de un solo usuario (POST a SUPABASE_URL/auth/v1/token?grant_type=password con «apikey» = ANON_KEY y el email y la contraseña del usuario); copiar el «access_token» de A y el de B.
6. Usuarios A y B. Una deuda «Sofía te debe $60.000» con fecha 15/08/2026, cargada por A (desde Deudas → «Nueva deuda» con la sesión de A).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Con el token del usuario B pedir GET a /rest/v1/debts?select=* y a /rest/v1/debts?id=eq.<ID de la deuda de A>. | Las dos respuestas son 200 con la lista vacía []: B no ve nada de A. |

**Notas del diseño:** Caso por API: se hace con Postman (o curl), no desde la pantalla.

---

### CP-DEU-108 — Por API, sin sesión no se pueden leer las deudas

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

### CP-DEU-108B — Sin sesión, la dirección /debts lleva al login

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Transición de estados · Negativo |
| Trazabilidad | US-38 · CA-10 · FR-18 · C7 |
| Historias de usuario | US-38 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Ventana de incógnito limpia, SIN sesión iniciada.

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito nueva (sin iniciar sesión), escribir /debts en la barra de direcciones y apretar Enter. | El navegador redirige a /login?next=%2Fdebts y muestra la pantalla «Entrar». |

---

### CP-DEU-108C — Sin sesión, la dirección /debts/new lleva al login

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Transición de estados · Negativo |
| Trazabilidad | US-36 ("Rutas privadas") · US-38 · CA-10 · FR-18 · C7 |
| Historias de usuario | US-36, US-38 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Ventana de incógnito limpia, SIN sesión iniciada.

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito nueva (sin iniciar sesión), escribir /debts/new en la barra de direcciones y apretar Enter. | El navegador redirige a /login?next=%2Fdebts%2Fnew y muestra la pantalla «Entrar». |

---

### CP-DEU-109 — Marcar una deuda como saldada desde «Pendientes»

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-109-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-109-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Deuda D 1 creada desde Deudas → «Nueva deuda».

**Datos de prueba:**

- D 1: Sofía te debe $60.000, con fecha 15/08/2026.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts a la dirección de la app y apretar Enter. | Se muestra «Te deben» = «$60.000,00», «A tu favor $60.000,00» y la fila de «Sofía» con el botón «Marcar saldada». |
| 2 | Tocar el botón «Marcar saldada» de la fila de «Sofía». | La fila de «Sofía» sale de la lista de «Pendientes», aparece el estado vacío «No tenés deudas pendientes.», aparece el aviso con el texto exacto «Deuda con Sofía saldada» y el botón «Deshacer», y en la tarjeta de totales «Te deben» baja en el acto a «$0,00» y el neto pasa a «En cero». |

---

### CP-DEU-110 — Marcar saldada desde «Todas» deja la fila como saldada

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-39 · CA-2 · FR-18 · I9 · ADR-021 |
| Historias de usuario | US-39 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-110-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-110-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Deuda D 1 creada desde Deudas → «Nueva deuda».
6. Fechas que dependen de hoy: «mes actual» es el mes de hoy; «mes anterior» es el mes calendario anterior; «el día 10 del mes actual» es el día 10 del mes de hoy (si hoy es antes del 10, la fecha de hoy); «el día 15 del mes anterior» es el 15 del mes anterior; «hoy» es el día en que se ejecuta el caso. En las direcciones, period=AAAA-MM es el año y el mes con dos dígitos (por ejemplo, para octubre de 2026: period=2026-10).

**Datos de prueba:**

- D 1: Sofía te debe $60.000, con fecha 15/08/2026.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts?status=all a la dirección de la app y apretar Enter. | Se ve la fila de «Sofía» con el botón «Marcar saldada». |
| 2 | Tocar el botón «Marcar saldada». | La fila de «Sofía» permanece en la lista y el estado muestra «Saldada el [fecha de hoy]», y el botón pasa a «Volver a pendiente». |

---

### CP-DEU-111 — «Deshacer» devuelve la deuda a pendiente

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-111-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-111-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Deuda D 1 creada desde Deudas → «Nueva deuda».

**Datos de prueba:**

- D 1: Sofía te debe $60.000, con fecha 15/08/2026.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts a la dirección de la app y apretar Enter. | Se ve la fila de «Sofía» en «Pendientes». |
| 2 | Tocar «Marcar saldada». | Aparece el aviso («Deuda con Sofía saldada») con el botón «Deshacer». |
| 3 | Antes de que pasen 5 segundos, tocar el botón «Deshacer». | El aviso desaparece, la fila de «Sofía» vuelve a aparecer en «Pendientes» y «Te deben» vuelve a «$60.000,00». |

---

### CP-DEU-111B — El aviso con «Deshacer» desaparece al cambiar de filtro

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-39 · CA-4 (parte 2) · FR-18 · I9 |
| Historias de usuario | US-39 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-111b-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-111b-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Deuda D 1 creada desde Deudas → «Nueva deuda».

**Datos de prueba:**

- D 1: Sofía te debe $60.000, con fecha 15/08/2026.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts a la dirección de la app y apretar Enter. | Se ve la fila de «Sofía» en «Pendientes». |
| 2 | Tocar «Marcar saldada». | Aparece el aviso con «Deuda con Sofía saldada» y «Deshacer». |
| 3 | Antes de que pasen 5 segundos, tocar el filtro «Saldadas». | El aviso el aviso desaparece inmediatamente de la pantalla al cambiar de filtro. |

---

### CP-DEU-112 — Saldar una deuda que ya se saldó en otra pestaña muestra un error

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-112-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-112-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
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

### CP-DEU-113 — Por API, saldar una deuda ya saldada se rechaza

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-113-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
5. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-deu-113-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
6. Una deuda «Sofía te debe $60.000» con fecha 15/08/2026, ya marcada como saldada (botón «Marcar saldada»).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Con el token del usuario, enviar POST a /rest/v1/rpc/settle_debt con {"p_debt_id": "<ID de una deuda ya saldada>"}. | Responde 400 con el código 23514 y el mensaje «La deuda ya está saldada»; la deuda sigue saldada con su fecha original. |

**Notas del diseño:** Caso por API: se hace con Postman (o curl), no desde la pantalla.

---

### CP-DEU-114 — Por API, un usuario no puede saldar la deuda de otro

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
3. Dos usuarios de prueba NUEVOS: A (qa+cp-deu-114-a@example.com) y B (qa+cp-deu-114-b@example.com), los dos con contraseña Clave123!. Cómo crearlos: en la pantalla «Entrar» tocar «Crear una cuenta», completar el email, la contraseña y «Confirmar contraseña», tocar «Crear cuenta» y «Saltear» en los 4 pasos de la configuración inicial; cada usuario en su propia ventana de incógnito.
4. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
5. Token de cada usuario: igual que el token de un solo usuario (POST a SUPABASE_URL/auth/v1/token?grant_type=password con «apikey» = ANON_KEY y el email y la contraseña del usuario); copiar el «access_token» de A y el de B.
6. Usuarios A y B. Una deuda «Sofía te debe $60.000» con fecha 15/08/2026, cargada por A y pendiente.

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Con el token del usuario B, enviar POST a /rest/v1/rpc/settle_debt con el ID de una deuda del usuario A. | Responde 400 con el código 23514 y «La deuda no existe»; la deuda de A sigue pendiente. |

**Notas del diseño:** Caso por API: se hace con Postman (o curl), no desde la pantalla.

---

### CP-DEU-114B — Por API, saldar una deuda que no existe se rechaza

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Trazabilidad | US-39 · CA-6 (parte 2) · ADR-037 §3 · FR-18 · C6 |
| Historias de usuario | US-39 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-114b-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
5. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-deu-114b-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
6. Solo el usuario de prueba (el caso usa un identificador de deuda que no existe).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Enviar POST a /rest/v1/rpc/settle_debt con un ID inexistente (00000000-0000-0000-0000-000000000000). | Responde 400 con el código 23514 y «La deuda no existe». |

**Notas del diseño:** Caso por API: se hace con Postman (o curl), no desde la pantalla.

---

### CP-DEU-115 — Por API, sin sesión no se puede saldar una deuda

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Trazabilidad | US-39 · CA-6 (parte 3) · FR-18 · C7 |
| Historias de usuario | US-39 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
3. Ninguna: el pedido se hace sin sesión.

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Enviar POST a /rest/v1/rpc/settle_debt solo con el encabezado «apikey» (sin sesión). | Responde 401 o 403 con el código 42501 («permission denied for function settle_debt»). |

**Notas del diseño:** Caso por API: se hace con Postman (o curl), no desde la pantalla.

---

### CP-DEU-116 — Por API, no se puede modificar una deuda directamente

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-116-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
5. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-deu-116-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
6. Una deuda «Sofía te debe $60.000» con fecha 15/08/2026 (pendiente).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Con el token del usuario, enviar PATCH a /rest/v1/debts?id=eq.<ID> con {"status": "settled"}. | Responde 403 con el código 42501 («permission denied for table debts»); la deuda sigue pendiente. |

**Notas del diseño:** Caso por API: se hace con Postman (o curl), no desde la pantalla.

---

### CP-DEU-116B — Por API, no se puede borrar una deuda directamente

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-116b-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
5. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-deu-116b-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
6. Una deuda «Sofía te debe $60.000» con fecha 15/08/2026 (pendiente).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Con el token del usuario, enviar DELETE a /rest/v1/debts?id=eq.<ID>. | Responde 403 con el código 42501; la deuda sigue existiendo. |

**Notas del diseño:** Caso por API: se hace con Postman (o curl), no desde la pantalla.

---

### CP-DEU-117 — «Volver a pendiente» desde «Saldadas»

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-117-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-117-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Deuda creada desde Deudas → «Nueva deuda».

**Datos de prueba:**

- D 1: Sofía te debe US$40 (a tipo de cambio 1250), con fecha 15/08/2026 y nota «Viaje».

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts?status=settled a la dirección de la app y apretar Enter. | Se ve la fila de «Sofía» con el botón «Volver a pendiente». |
| 2 | Tocar «Volver a pendiente». | La fila sale de «Saldadas», aparece «Todavía no saldaste ninguna deuda.» y se muestra el aviso con el texto exacto «La deuda con Sofía volvió a pendiente». |

---

### CP-DEU-118 — «Volver a pendiente» desde «Todas» actualiza los totales

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-40 · CA-3 · US-37 · CA-5 · FR-18 · I9 |
| Historias de usuario | US-37, US-40 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-118-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-118-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Deuda D 1 creada desde Deudas → «Nueva deuda» y saldada con el botón «Marcar saldada».

**Datos de prueba:**

- D 1: Sofía te debe $60.000, con fecha 15/08/2026.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts?status=all a la dirección de la app y apretar Enter. | «Te deben» muestra «$0,00», el neto muestra «En cero» y la fila de «Sofía» tiene el botón «Volver a pendiente». |
| 2 | Tocar «Volver a pendiente». | La fila de «Sofía» queda en la lista y el estado igual a «Pendiente», el botón pasa a «Marcar saldada», y en la tarjeta de totales «Te deben» sube en el acto a «$60.000,00» y el neto pasa a «A tu favor $60.000,00». |

---

### CP-DEU-119 — Por API, reabrir una deuda que ya está pendiente se rechaza

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Transición de estados · Negativo |
| Trazabilidad | US-40 · CA-4 (parte 1) · FR-18 · I9 · C6 |
| Historias de usuario | US-40 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-119-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
5. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-deu-119-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
6. Una deuda «Sofía te debe $60.000» con fecha 15/08/2026 (pendiente).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Con el token del usuario, enviar POST a /rest/v1/rpc/reopen_debt con el ID de una deuda ya pendiente. | Responde 400 con el código 23514 y «La deuda ya está pendiente». |

**Notas del diseño:** Caso por API: se hace con Postman (o curl), no desde la pantalla.

---

### CP-DEU-119B — Volver a pendiente una deuda que ya se reabrió en otra pestaña muestra un error

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Transición de estados · Negativo |
| Trazabilidad | US-40 · CA-6 · FR-18 · I9 |
| Historias de usuario | US-40 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-119b-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-119b-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Deuda D 1 creada desde Deudas → «Nueva deuda» y saldada con el botón «Marcar saldada».

**Datos de prueba:**

- D 1: Sofía te debe $60.000, con fecha 15/08/2026.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la Pestaña 1, escribir /debts?status=all en la barra de direcciones y apretar Enter. | En la Pestaña 1 se ve la fila de «Sofía» saldada con el botón «Volver a pendiente». |
| 2 | Abrir una segunda pestaña (Pestaña 2) en la misma ventana de incógnito, escribir /debts?status=all y apretar Enter. | En la Pestaña 2 también se ve la fila de «Sofía» saldada con el botón «Volver a pendiente». |
| 3 | En la Pestaña 2, tocar «Volver a pendiente». | En la Pestaña 2 la deuda de «Sofía» vuelve a pendiente. |
| 4 | Volver a la Pestaña 1 (sin recargarla) y tocar «Volver a pendiente». | En la Pestaña 1 aparece el aviso de error con «No se pudo actualizar la deuda» y el motivo «La deuda ya está pendiente», y la lista se refresca mostrando la fila de «Sofía» como pendiente. |

---

### CP-DEU-120 — Por API, un usuario no puede reabrir la deuda de otro

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Trazabilidad | US-40 · CA-4 (parte 2) · ADR-037 §3 · FR-18 · C6 · C7 |
| Historias de usuario | US-40 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Dos usuarios de prueba NUEVOS: A (qa+cp-deu-120-a@example.com) y B (qa+cp-deu-120-b@example.com), los dos con contraseña Clave123!. Cómo crearlos: en la pantalla «Entrar» tocar «Crear una cuenta», completar el email, la contraseña y «Confirmar contraseña», tocar «Crear cuenta» y «Saltear» en los 4 pasos de la configuración inicial; cada usuario en su propia ventana de incógnito.
4. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
5. Token de cada usuario: igual que el token de un solo usuario (POST a SUPABASE_URL/auth/v1/token?grant_type=password con «apikey» = ANON_KEY y el email y la contraseña del usuario); copiar el «access_token» de A y el de B.
6. Usuarios A y B. Una deuda «Sofía te debe $60.000» con fecha 15/08/2026, cargada por A y marcada como saldada.

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Con el token del usuario B, enviar POST a /rest/v1/rpc/reopen_debt con el ID de una deuda saldada de A. | Responde 400 con el código 23514 y «La deuda no existe»; la deuda de A sigue saldada. |

**Notas del diseño:** Caso por API: se hace con Postman (o curl), no desde la pantalla.

---

### CP-DEU-120B — Por API, reabrir una deuda que no existe se rechaza

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Trazabilidad | US-40 · CA-4 (parte 2) · ADR-037 §3 · FR-18 · C6 |
| Historias de usuario | US-40 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-120b-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
5. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-deu-120b-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
6. Solo el usuario de prueba (el caso usa un identificador de deuda que no existe).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Enviar POST a /rest/v1/rpc/reopen_debt con un ID inexistente. | Responde 400 con el código 23514 y «La deuda no existe». |

**Notas del diseño:** Caso por API: se hace con Postman (o curl), no desde la pantalla.

---

### CP-DEU-121 — Por API, sin sesión no se puede reabrir una deuda

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Adivinación de errores · Negativo |
| Trazabilidad | US-40 · CA-4 (parte 3) · FR-18 · C7 |
| Historias de usuario | US-40 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
3. Ninguna: el pedido se hace sin sesión.

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Enviar POST a /rest/v1/rpc/reopen_debt solo con el encabezado «apikey» (sin sesión). | Responde 401 o 403 con el código 42501 («permission denied for function reopen_debt»). |

**Notas del diseño:** Caso por API: se hace con Postman (o curl), no desde la pantalla.

---

### CP-DEU-122 — Saldar y reabrir tres veces seguidas deja la deuda pendiente

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-122-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-122-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
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

### CP-DEU-123 — Filtro por dirección: «Todas», «Te deben» y «Debés»

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-123-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-123-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
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

### CP-DEU-124 — Los filtros de estado y de dirección se combinan

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Media |
| Camino feliz | Sí |
| Técnica · Tipo | Tabla de decisión · Positivo |
| Trazabilidad | US-79 · CA-3, CA-5 · FR-18 · C11 |
| Historias de usuario | US-79 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-124-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-124-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. 3 deudas creadas desde Deudas → «Nueva deuda»; D 2 y D 3 saldadas con el botón «Marcar saldada».

**Datos de prueba:**

- D 1: Sofía te debe $60.000, con fecha 15/08/2026.
- D 2: Pedro te debe $8.000, con fecha 10/08/2026.
- D 3: Le debés $25.000 a Marta, con fecha 12/08/2026.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts a la dirección de la app y apretar Enter. | Se abre /debts con «Pendientes» y «Todas» seleccionados. |
| 2 | Tocar «Debés». | La URL pasa a ?direction=i_owe. |
| 3 | Tocar «Saldadas». | La URL conserva ambos parámetros (?direction=i_owe&status=settled o ?status=settled&direction=i_owe), «Saldadas» y «Debés» quedan seleccionados, y se lista únicamente la fila de «Marta». |
| 4 | Recargar la página (F5). | Ambos filtros siguen seleccionados y la lista sigue mostrando únicamente a «Marta». |

---

### CP-DEU-125 — Una dirección inválida se trata como «Todas»

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Baja |
| Camino feliz | No |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Trazabilidad | US-79 · CA-4 · FR-18 · C11 |
| Historias de usuario | US-79 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-125-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-125-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Deudas pendientes D 1 y D 2 creadas desde Deudas → «Nueva deuda».

**Datos de prueba:**

- D 1: Sofía te debe $60.000, con fecha 15/08/2026.
- D 2: Le debés $15.000 a Ana, con fecha 15/08/2026.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts?direction=xyz a la dirección de la app y apretar Enter. | «Todas» queda seleccionado y se listan las 2 filas («Sofía» y «Ana»). |
| 2 | Tocar «Te deben». | La URL cambia a /debts?direction=owed_to_me y se muestra solo «Sofía». |

---

### CP-DEU-126 — Sin deudas: «Pendientes» + «Te deben»

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Baja |
| Camino feliz | No |
| Técnica · Tipo | Tabla de decisión · Límite |
| Trazabilidad | US-79 · CA-6 · FR-18 · — |
| Historias de usuario | US-79 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-126-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-126-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts?direction=owed_to_me a la dirección de la app y apretar Enter. | El mensaje de lista vacía muestra el texto exacto «Nadie te debe nada por ahora.» y el botón «Cargar una deuda» está visible. |

---

### CP-DEU-126B — Sin deudas: «Saldadas» + «Te deben»

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Baja |
| Camino feliz | No |
| Técnica · Tipo | Tabla de decisión · Límite |
| Trazabilidad | US-79 · CA-6 · FR-18 · — |
| Historias de usuario | US-79 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-126b-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-126b-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts?status=settled&direction=owed_to_me a la dirección de la app y apretar Enter. | El mensaje de lista vacía muestra el texto exacto «Todavía no te saldaron ninguna deuda.» y el botón no se ve. |

---

### CP-DEU-126C — Sin deudas: «Todas» + «Te deben»

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Baja |
| Camino feliz | No |
| Técnica · Tipo | Tabla de decisión · Límite |
| Trazabilidad | US-79 · CA-6 · FR-18 · — |
| Historias de usuario | US-79 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-126c-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-126c-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts?status=all&direction=owed_to_me a la dirección de la app y apretar Enter. | El mensaje de lista vacía muestra el texto exacto «No cargaste deudas a tu favor.» y el botón «Cargar una deuda» está visible. |

---

### CP-DEU-127 — Sin deudas: «Pendientes» + «Debés»

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Baja |
| Camino feliz | No |
| Técnica · Tipo | Tabla de decisión · Límite |
| Trazabilidad | US-79 · CA-6 · FR-18 · — |
| Historias de usuario | US-79 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-127-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-127-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts?direction=i_owe a la dirección de la app y apretar Enter. | El mensaje de lista vacía muestra el texto exacto «No debés nada por ahora.» y el botón «Cargar una deuda» está visible. |

---

### CP-DEU-127B — Sin deudas: «Saldadas» + «Debés»

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Baja |
| Camino feliz | No |
| Técnica · Tipo | Tabla de decisión · Límite |
| Trazabilidad | US-79 · CA-6 · FR-18 · — |
| Historias de usuario | US-79 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-127b-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-127b-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts?status=settled&direction=i_owe a la dirección de la app y apretar Enter. | El mensaje de lista vacía muestra el texto exacto «Todavía no saldaste ninguna deuda tuya.» y el botón no se ve. |

---

### CP-DEU-127C — Sin deudas: «Todas» + «Debés»

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Baja |
| Camino feliz | No |
| Técnica · Tipo | Tabla de decisión · Límite |
| Trazabilidad | US-79 · CA-6 · FR-18 · — |
| Historias de usuario | US-79 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-127c-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-127c-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts?status=all&direction=i_owe a la dirección de la app y apretar Enter. | El mensaje de lista vacía muestra el texto exacto «No cargaste deudas que debas.» y el botón «Cargar una deuda» está visible. |

---

### CP-DEU-128 — Gasto compartido con varias personas: agregar, quitar y guardar

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-128-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-128-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
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

### CP-DEU-128B — Las personas se ordenan por nombre sin distinguir mayúsculas ni tildes

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Trazabilidad | US-82 · CA-2, CA-10, CA-12 · US-38 · CA-5 · FR-18 · I7 |
| Historias de usuario | US-38, US-82 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-128b-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-128b-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Escribir 120000 en el campo del monto y tocar «Siguiente». | Se abre el paso 2 de 3. |
| 2 | Tocar la categoría «Otros». | Se abre el paso 3 de 3. |
| 3 | En la sección «Fecha», tocar «Otra» y escribir 15/08/2026. | El campo de fecha muestra 15/08/2026. |
| 4 | Tocar el interruptor «Gasto compartido». | Aparece la fila 1. |
| 5 | En la fila 1, escribir Beto en «¿Con quién?» y 30000 en «¿Cuánto te debe?». | La fila 1 muestra Beto y 30000. |
| 6 | Tocar «Agregar persona», escribir álvaro en «¿Con quién?» de la fila 2 y 30000 en «¿Cuánto te debe?». | La fila 2 muestra álvaro y 30000. |
| 7 | Tocar «Agregar persona», escribir Ángela en «¿Con quién?» de la fila 3 y 30000 en «¿Cuánto te debe?». | La fila 3 muestra Ángela y 30000. |
| 8 | Tocar el botón «Guardar gasto». | Aparece el aviso «Gasto guardado» con la descripción exacta «álvaro, Ángela y Beto te deben $90.000,00». |
| 9 | Agregar /debts?status=all a la dirección de la app y apretar Enter. | Las 3 filas aparecen en el orden exacto de arriba hacia abajo: álvaro, Ángela, Beto (desempate por persona sin distinguir mayúsculas ni tildes). |

---

### CP-DEU-129 — «Dividir en partes iguales» entre 2 personas

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Valores límite · Positivo |
| Trazabilidad | US-82 · CA-3, CA-22 · FR-18 · I7 |
| Historias de usuario | US-82 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-129-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-129-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Escribir 100000 en el campo del monto y tocar «Siguiente». | Se abre el paso 2 de 3. |
| 2 | Tocar la categoría «Otros». | Se abre el paso 3 de 3. |
| 3 | Tocar el interruptor «Gasto compartido». | Aparece la fila 1. |
| 4 | En la fila 1, escribir Sofía en «¿Con quién?» y 10000 en «¿Cuánto te debe?». | La fila 1 muestra Sofía y 10000. |
| 5 | Tocar «Agregar persona», escribir Juan en «¿Con quién?» de la fila 2 y 20000 en «¿Cuánto te debe?». | La fila 2 muestra Juan y 20000. |
| 6 | Tocar el botón «Dividir en partes iguales». | El campo «¿Cuánto te debe?» de la fila 1 y el de la fila 2 reemplazan sus montos previos por 33333,33 (con coma decimal y sin separador de miles), y el resumen muestra el texto exacto «Te van a deber $66.666,66 entre 2 personas · Tu parte: $33.333,34». |

---

### CP-DEU-129B — Dividir un gasto de $0,02 entre 2 personas da error

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Negativo |
| Trazabilidad | US-82 · CA-20 · FR-18 · I5, I7 |
| Historias de usuario | US-82 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-129b-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-129b-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Escribir 0,02 en el campo del monto y tocar «Siguiente». | Se abre el paso 2 de 3. |
| 2 | Tocar la categoría «Otros». | Se abre el paso 3 de 3. |
| 3 | Tocar el interruptor «Gasto compartido». | Aparece la fila 1. |
| 4 | En la fila 1, escribir Sofía en «¿Con quién?». | La fila 1 muestra Sofía. |
| 5 | Tocar «Agregar persona» y escribir Juan en «¿Con quién?» de la fila 2. | La fila 2 muestra Juan. |
| 6 | Tocar el botón «Dividir en partes iguales». | El campo «¿Cuánto te debe?» de la fila 1 y el de la fila 2 quedan con 0, cada fila muestra el mensaje exacto «El monto debe ser mayor a cero», y el botón «Guardar gasto» está deshabilitado. |

---

### CP-DEU-129C — «Dividir en partes iguales» con los nombres vacíos

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Baja |
| Camino feliz | No |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Trazabilidad | US-82 · CA-3 · FR-18 · I7 |
| Historias de usuario | US-82 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-129c-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-129c-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Escribir 90000 en el campo del monto y tocar «Siguiente». | Se abre el paso 2 de 3. |
| 2 | Tocar la categoría «Otros». | Se abre el paso 3 de 3. |
| 3 | Tocar el interruptor «Gasto compartido». | Aparece la fila 1 con «¿Con quién?» vacío y el botón «Dividir en partes iguales» está habilitado. |
| 4 | Tocar «Agregar persona». | Aparece la fila 2 con «¿Con quién?» vacío. |
| 5 | Tocar el botón «Dividir en partes iguales». | El campo «¿Cuánto te debe?» de la fila 1 y el de la fila 2 se completan con 30000, los campos «¿Con quién?» siguen vacíos y el botón «Guardar gasto» sigue deshabilitado hasta completar las personas. |

---

### CP-DEU-130 — «Dividir en partes iguales» entre 3 personas

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Trazabilidad | US-82 · CA-3 · FR-18 · I7 |
| Historias de usuario | US-82 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-130-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-130-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Escribir 120000 en el campo del monto y tocar «Siguiente». | Se abre el paso 2 de 3. |
| 2 | Tocar la categoría «Otros». | Se abre el paso 3 de 3. |
| 3 | Tocar el interruptor «Gasto compartido». | Aparece la fila 1. |
| 4 | Escribir Sofía en «¿Con quién?» de la fila 1, tocar «Agregar persona», escribir Juan en «¿Con quién?» de la fila 2, tocar «Agregar persona» y escribir Ana en «¿Con quién?» de la fila 3. | Hay 3 filas con Sofía, Juan y Ana. |
| 5 | Tocar el botón «Dividir en partes iguales». | El campo «¿Cuánto te debe?» de las 3 filas muestra 30000 (sin,00) y el resumen muestra «Te van a deber $90.000,00 entre 3 personas · Tu parte: $30.000,00». |

---

### CP-DEU-130B — Cambiar la moneda con personas cargadas vacía los montos

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-82 · CA-16 · FR-18 · I4, I7 |
| Historias de usuario | US-82 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-130b-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-130b-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Escribir 120000 en el campo del monto y tocar «Siguiente». | Se abre el paso 2 de 3. |
| 2 | Tocar la categoría «Otros». | Se abre el paso 3 de 3. |
| 3 | Tocar el interruptor «Gasto compartido», escribir Sofía y 30000 en la fila 1, tocar «Agregar persona» y escribir Juan y 30000 en la fila 2. | Las 2 filas tienen Sofía (30000) y Juan (30000). |
| 4 | Tocar el chip de resumen del monto ($120.000,00) arriba del paso 3 para volver al paso 1. | Se abre el paso 1 de 3, «¿Cuánto?». |
| 5 | Tocar la moneda US$, escribir 100 en el monto, escribir 1250 en el tipo de cambio y tocar «Siguiente». | Se abre el paso 2 de 3. |
| 6 | Tocar la categoría «Otros». | Se abre el paso 3 de 3: el interruptor «Gasto compartido» sigue encendido con las 2 filas, «¿Con quién?» conserva Sofía en la fila 1 y Juan en la fila 2, y el campo «¿Cuánto te debe?» de ambas filas está vacío con prefijo US$. |

---

### CP-DEU-130C — «Dividir en partes iguales» en dólares

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Positivo |
| Trazabilidad | US-82 · CA-3 · FR-18 · I4, I7 |
| Historias de usuario | US-82 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-130c-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-130c-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Tocar la moneda US$, escribir 100 en el campo del monto, escribir 1250 en el campo de tipo de cambio y tocar «Siguiente». | Se abre el paso 2 de 3. |
| 2 | Tocar la categoría «Otros». | Se abre el paso 3 de 3. |
| 3 | Tocar el interruptor «Gasto compartido», escribir Sofía en «¿Con quién?» de la fila 1, tocar «Agregar persona» y escribir Juan en «¿Con quién?» de la fila 2. | Hay 2 filas con Sofía y Juan. |
| 4 | Tocar el botón «Dividir en partes iguales». | El campo «¿Cuánto te debe?» de ambas filas muestra 33,33 y el resumen muestra «Te van a deber US$66,66 entre 2 personas · Tu parte: US$33,34». |

---

### CP-DEU-130D — En dólares, dividir un gasto muy chico da error de centavos

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Negativo |
| Trazabilidad | US-82 · CA-3 · US-34 · CA-7 · FR-18 · I4, I5, I7 |
| Historias de usuario | US-34, US-82 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-130d-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-130d-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Tocar la moneda US$, escribir 0,02 en el campo del monto, escribir 0,4 en el campo de tipo de cambio y tocar «Siguiente». | Se abre el paso 2 de 3 (0,02 × 0,4 = $0,01 en pesos para el gasto). |
| 2 | Tocar la categoría «Otros». | Se abre el paso 3 de 3. |
| 3 | Tocar el interruptor «Gasto compartido» y escribir Sofía en «¿Con quién?» de la fila 1. | La fila 1 muestra Sofía. |
| 4 | Tocar el botón «Dividir en partes iguales». | El campo «¿Cuánto te debe?» de la fila 1 se completa con 0,01 (0,01 × 0,4 = 0,004 → $0,00), debajo de la fila aparece el mensaje de error con el texto exacto «En pesos daría menos de $0,01. Revisá el monto o el tipo de cambio», y «Guardar gasto» queda deshabilitado. |

---

### CP-DEU-131 — Entre todos pueden deber todo el gasto (tu parte es $0)

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-82 · CA-4 · FR-18 · I7 |
| Historias de usuario | US-82 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-131-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-131-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Escribir 120000 en el campo del monto y tocar «Siguiente». | Se abre el paso 2 de 3. |
| 2 | Tocar la categoría «Otros». | Se abre el paso 3 de 3. |
| 3 | En la sección «Fecha», tocar «Otra» y escribir 15/08/2026. | El campo de fecha muestra 15/08/2026. |
| 4 | Tocar el interruptor «Gasto compartido», escribir Sofía y 60000 en la fila 1, tocar «Agregar persona» y escribir Juan y 60000 en la fila 2. | El resumen muestra «Te van a deber $120.000,00 entre 2 personas · Tu parte: $0,00» y el botón «Guardar gasto» está habilitado. |
| 5 | Tocar el botón «Guardar gasto». | Aparece el aviso «Gasto guardado» con la descripción «Juan y Sofía te deben $120.000,00». |

---

### CP-DEU-132 — La suma de lo que te deben no puede superar el gasto

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-82 · CA-4, CA-22 · FR-18 · I7 |
| Historias de usuario | US-82 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-132-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-132-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Escribir 120000 en el campo del monto y tocar «Siguiente». | Se abre el paso 2 de 3. |
| 2 | Tocar la categoría «Otros». | Se abre el paso 3 de 3. |
| 3 | Tocar el interruptor «Gasto compartido», escribir Sofía y 60000 en la fila 1, tocar «Agregar persona», escribir Juan y 60000,01 en la fila 2 y apretar Tab. | Aparece el mensaje de error con el texto exacto «Entre todos no pueden deber más que el gasto ($120.000,00)», el botón «Guardar gasto» queda deshabilitado. |

---

### CP-DEU-132B — Bajar el gasto por debajo de lo que te deben da error

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Transición de estados · Negativo |
| Trazabilidad | US-82 · CA-18 · FR-18 · I7 |
| Historias de usuario | US-82 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-132b-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-132b-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Escribir 120000 en el campo del monto y tocar «Siguiente». | Se abre el paso 2 de 3. |
| 2 | Tocar la categoría «Otros». | Se abre el paso 3 de 3. |
| 3 | Tocar el interruptor «Gasto compartido», escribir Sofía y 40000 en la fila 1, tocar «Agregar persona» y escribir Juan y 40000 en la fila 2. | El resumen muestra «Te van a deber $80.000,00 entre 2 personas · Tu parte: $40.000,00». |
| 4 | Tocar el chip de resumen del monto ($120.000,00) arriba del paso 3 para volver al paso 1. | Se abre el paso 1 de 3. |
| 5 | Reemplazar el monto por 70000 y tocar «Siguiente». | Se abre el paso 2 de 3. |
| 6 | Tocar la categoría «Otros». | Se abre el paso 3 de 3: los montos de las filas siguen siendo 40000 y 40000 (no se ajustan solos), se muestra el mensaje de error con el texto exacto «Entre todos no pueden deber más que el gasto ($70.000,00)» y «Guardar gasto» está deshabilitado. |

---

### CP-DEU-132C — Una persona que debe más que el gasto da error en su fila

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Trazabilidad | US-82 · CA-19 · US-41 · CA-4 · FR-18 · I7 |
| Historias de usuario | US-41, US-82 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-132c-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-132c-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Escribir 120000 en el campo del monto y tocar «Siguiente». | Se abre el paso 2 de 3. |
| 2 | Tocar la categoría «Otros». | Se abre el paso 3 de 3. |
| 3 | Tocar el interruptor «Gasto compartido», escribir Sofía y 150000 en la fila 1, tocar «Agregar persona», escribir Juan y 10000 en la fila 2 y apretar Tab. | En la fila 1 aparece el mensaje de error con el texto exacto «No puede superar el monto del gasto ($120.000,00)», no aparece el mensaje de error de la suma total y «Guardar gasto» está deshabilitado. |

---

### CP-DEU-132D — Bajar el gasto muy por debajo da error en cada fila

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Transición de estados · Negativo |
| Trazabilidad | US-82 · CA-18 · FR-18 · I7 |
| Historias de usuario | US-82 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-132d-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-132d-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Escribir 120000 en el campo del monto y tocar «Siguiente». | Se abre el paso 2 de 3. |
| 2 | Tocar la categoría «Otros». | Se abre el paso 3 de 3. |
| 3 | Tocar el interruptor «Gasto compartido», escribir Sofía y 40000 en la fila 1, tocar «Agregar persona» y escribir Juan y 40000 en la fila 2. | El resumen muestra «Te van a deber $80.000,00 entre 2 personas · Tu parte: $40.000,00». |
| 4 | Tocar el chip de resumen del monto ($120.000,00) arriba del paso 3 para volver al paso 1. | Se abre el paso 1 de 3. |
| 5 | Reemplazar el monto por 30000 y tocar «Siguiente». | Se abre el paso 2 de 3. |
| 6 | Tocar la categoría «Otros». | Se abre el paso 3 de 3: tanto la fila 1 como la fila 2 muestran el mensaje de error con el texto exacto «No puede superar el monto del gasto ($30.000,00)», no aparece el mensaje de error de la suma total y «Guardar gasto» está deshabilitado. |

---

### CP-DEU-133 — Se puede compartir con hasta 10 personas

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-133-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-133-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
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

### CP-DEU-134 — No se puede repetir una persona

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Trazabilidad | US-82 · CA-6 · FR-18 · I7 |
| Historias de usuario | US-82 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-134-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-134-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Escribir 100000 en el campo del monto y tocar «Siguiente». | Se abre el paso 2 de 3. |
| 2 | Tocar la categoría «Otros». | Se abre el paso 3 de 3. |
| 3 | Tocar el interruptor «Gasto compartido», escribir Sofía y 30000 en la fila 1, tocar «Agregar persona», escribir sofía en «¿Con quién?» de la fila 2, escribir 30000 en «¿Cuánto te debe?» de la fila 2 y apretar Tab. | En la fila 2 aparece el mensaje de error con el texto exacto «Ya agregaste a Sofía» y el botón «Guardar gasto» queda deshabilitado. |

---

### CP-DEU-135 — Una persona sin nombre da error en su fila

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Trazabilidad | US-82 · CA-8 · FR-18 · I7 |
| Historias de usuario | US-82 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-135-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-135-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Escribir 120000 en el campo del monto y tocar «Siguiente». | Se abre el paso 2 de 3. |
| 2 | Tocar la categoría «Otros». | Se abre el paso 3 de 3. |
| 3 | Tocar el interruptor «Gasto compartido», escribir Sofía y 30000 en la fila 1, tocar «Agregar persona», tocar «¿Con quién?» de la fila 2 y sin escribir nada pasar a «¿Cuánto te debe?» de la fila 2 y escribir 20000, tocar «Agregar persona» y escribir Ana y 10000 en la fila 3. | En la fila 2 aparece el mensaje de error con el texto exacto «Ingresá con quién compartiste el gasto» y el botón «Guardar gasto» está deshabilitado. |

---

### CP-DEU-135B — Quitar una persona conserva a las demás

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-82 · CA-7 · FR-18 · I7 |
| Historias de usuario | US-82 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-135b-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-135b-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Escribir 120000 en el monto, tocar «Siguiente» y elegir la categoría «Otros». | Se abre el paso 3 de 3. |
| 2 | Tocar el interruptor «Gasto compartido», escribir Sofía y 30000 en la fila 1, tocar «Agregar persona», escribir Juan y 20000 en la fila 2, tocar «Agregar persona» y escribir Ana y 10000 en la fila 3. | Hay 3 filas. |
| 3 | Tocar el botón «Quitar» de la fila 2 (la de Juan). | Quedan 2 filas: la primera con Sofía y 30000, y la segunda con Ana y 10000. El resumen muestra «Te van a deber $40.000,00 entre 2 personas · Tu parte: $80.000,00». |

---

### CP-DEU-135C — Pasar a Ingreso y volver a Gasto reinicia la sección compartida

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-82 · CA-17 · FR-18 · I7 |
| Historias de usuario | US-82 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-135c-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-135c-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Escribir 120000 en el campo del monto y tocar «Siguiente». | Se abre el paso 2 de 3. |
| 2 | Tocar la categoría «Otros». | Se abre el paso 3 de 3. |
| 3 | Tocar el interruptor «Gasto compartido», escribir Sofía y 30000 en la fila 1, tocar «Agregar persona» y escribir Juan y 30000 en la fila 2. | Hay 2 filas cargadas. |
| 4 | Tocar el chip de resumen del monto ($120.000,00) arriba del paso 3 para volver al paso 1. | Se abre el paso 1. |
| 5 | Tocar «Ingreso» y luego volver a tocar «Gasto». | «Gasto» queda seleccionado. |
| 6 | Tocar «Siguiente» y luego en la categoría «Otros». | Se abre el paso 3 de 3 con el interruptor «Gasto compartido» apagado (apagado). |
| 7 | Tocar el interruptor «Gasto compartido». | Aparece 1 sola fila con «¿Con quién?» y «¿Cuánto te debe?» vacíos. |

---

### CP-DEU-135D — Apagar «Gasto compartido» guarda el gasto sin deudas

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-82 · CA-9 · FR-18 · I7 |
| Historias de usuario | US-82 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-135d-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-135d-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Escribir 120000 en el campo del monto y tocar «Siguiente». | Se abre el paso 2 de 3. |
| 2 | Tocar la categoría «Otros». | Se abre el paso 3 de 3. |
| 3 | En la sección «Fecha», tocar «Otra» y escribir 15/08/2026. | El campo de fecha muestra 15/08/2026. |
| 4 | Tocar el interruptor «Gasto compartido», escribir Sofía y 30000 en la fila 1, tocar «Agregar persona», escribir Juan y 30000 en la fila 2, tocar «Agregar persona» y escribir Ana y 30000 en la fila 3. | Hay 3 filas cargadas. |
| 5 | Tocar el interruptor «Gasto compartido». | El interruptor queda apagado (apagado) y las 3 filas desaparecen. |
| 6 | Tocar el botón «Guardar gasto». | Aparece el aviso «Gasto guardado» sin mención de deudas. |
| 7 | Escribir 50000 en el campo del monto del nuevo gasto, tocar «Siguiente», tocar «Otros» y tocar el interruptor «Gasto compartido». | Aparece 1 sola fila vacía. |

---

### CP-DEU-136 — Gasto compartido con 3 personas en 2 cuotas: etiqueta en Movimientos y Resumen

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Trazabilidad | US-82 · CA-10 · FR-18 · I7 |
| Historias de usuario | US-82 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-136-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-136-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Gasto de $120.000 en 2 cuotas, con fecha 15/08/2026 y nota «Cena», compartido con Sofía ($30.000), Juan ($30.000), Ana ($30.000) (Registrar → «Gasto compartido»). Se carga desde Registrar (categoría «Otros», cuenta «Efectivo»).
6. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /transactions?period=2026-08 a la dirección de la app y apretar Enter. | La cuota 1/2 muestra la etiqueta con el texto exacto «Compartido con Ana y 2 más». |
| 2 | Agregar /transactions?period=2026-09 a la dirección de la app y apretar Enter. | La cuota 2/2 muestra la etiqueta con el texto exacto «Compartido con Ana y 2 más». |
| 3 | Agregar /dashboard?period=2026-08 a la dirección de la app y apretar Enter. | En «Últimos movimientos», la fila del gasto muestra con el texto exacto «Compartido con Ana y 2 más». |

---

### CP-DEU-136B — Al borrar un gasto con varias deudas, el aviso las lista

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Caso de uso · Positivo |
| Trazabilidad | US-82 · CA-11 · FR-18 · I7 |
| Historias de usuario | US-82 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-136b-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-136b-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Gasto de $120.000 en una cuota, con fecha 15/08/2026 y nota «Cena», compartido con Sofía ($30.000), Juan ($30.000), Ana ($30.000) (Registrar → «Gasto compartido»). Se carga desde Registrar (categoría «Otros», cuenta «Efectivo»).
6. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /transactions?period=2026-08 a la dirección de la app y apretar Enter. | Se muestra la fila del gasto de $120.000,00. |
| 2 | Tocar el botón de papelera de la fila del gasto. | Se abre el diálogo de confirmación de borrado y el elemento muestra el texto exacto «También dejan de contar las deudas con Ana, Juan y Sofía por $90.000,00 en total.». |

---

### CP-DEU-136C — Las 3 deudas de un mismo gasto aparecen en Deudas

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Caso de uso · Positivo |
| Trazabilidad | US-82 · CA-12 · US-38 · CA-5 · US-37 · CA-1 · US-30 · CA-1 · FR-18, FR-19 · I7, I10 |
| Historias de usuario | US-30, US-37, US-38, US-82 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-136c-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-136c-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Gasto de $120.000 en una cuota, con fecha 15/08/2026 y nota «Cena», compartido con Sofía ($30.000), Juan ($30.000), Ana ($30.000) (Registrar → «Gasto compartido»). Se carga desde Registrar (categoría «Otros», cuenta «Efectivo»).
6. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /debts?status=all a la dirección de la app y apretar Enter. | «Te deben» muestra «$90.000,00»; la lista muestra 3 filas en el orden exacto Ana, Juan, Sofía, y cada una muestra con «Gasto compartido: Otros, $120.000,00 del 15/08/2026». |
| 2 | Agregar /dashboard?period=2026-08 a la dirección de la app y apretar Enter. | El gasto total muestra «$120.000,00» y el monto del neto muestra «$30.000,00» ($120.000,00 − $90.000,00). |

---

### CP-DEU-136D — Eliminar el gasto saca sus 3 deudas

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-82 · CA-13 · US-35 · CA-5 · FR-18 · I7, I10 |
| Historias de usuario | US-35, US-82 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-136d-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-136d-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Gasto de $120.000 en una cuota, con fecha 15/08/2026 y nota «Cena», compartido con Sofía ($30.000), Juan ($30.000), Ana ($30.000) (Registrar → «Gasto compartido»). Se carga desde Registrar (categoría «Otros», cuenta «Efectivo»).
6. La deuda de «Ana» marcada como saldada (botón «Marcar saldada»).
7. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /transactions?period=2026-08 a la dirección de la app y apretar Enter. | Se muestra el gasto de $120.000,00. |
| 2 | Tocar el botón de papelera del gasto y confirmar haciendo click en «Eliminar». | El gasto desaparece de Movimientos activos. |
| 3 | Agregar /debts?status=all a la dirección de la app y apretar Enter. | «Te deben» muestra «$0,00», el neto muestra «En cero» y la lista muestra el estado vacío «No cargaste ninguna deuda todavía.». |

---

### CP-DEU-136E — Restaurar el gasto devuelve sus 3 deudas con su estado

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-82 · CA-13 · US-35 · CA-6 · FR-18 · I7, I9, I10 |
| Historias de usuario | US-35, US-82 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-136e-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-136e-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Gasto de $120.000 en una cuota, con fecha 15/08/2026 y nota «Cena», compartido con Sofía ($30.000), Juan ($30.000), Ana ($30.000) (Registrar → «Gasto compartido»). Se carga desde Registrar (categoría «Otros», cuenta «Efectivo»).
6. La deuda de «Ana» marcada como saldada (botón «Marcar saldada»).
7. Ese gasto eliminado (Movimientos → tacho de la fila).
8. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).
9. Fechas que dependen de hoy: «mes actual» es el mes de hoy; «mes anterior» es el mes calendario anterior; «el día 10 del mes actual» es el día 10 del mes de hoy (si hoy es antes del 10, la fecha de hoy); «el día 15 del mes anterior» es el 15 del mes anterior; «hoy» es el día en que se ejecuta el caso. En las direcciones, period=AAAA-MM es el año y el mes con dos dígitos (por ejemplo, para octubre de 2026: period=2026-10).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Escribir /transactions?period=2026-08 en la barra de direcciones y apretar Enter, tocar la pestaña «Eliminados» y tocar «Restaurar» en la fila del gasto «Cena». | El gasto se restaura a Movimientos activos. |
| 2 | Agregar /debts?status=all a la dirección de la app y apretar Enter. | Vuelven a aparecer las 3 deudas: «Juan» y «Sofía» con estado «Pendiente» («Te deben» = «$60.000,00») y «Ana» con estado «Saldada el [fecha de hoy]». |

---

### CP-DEU-137 — Por API, 2 personas y 1 monto se rechaza

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Trazabilidad | US-82 · CA-14 · FR-18 · I7 |
| Historias de usuario | US-82 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-137-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
5. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-deu-137-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
6. Identificadores de la categoría «Otros» y de la cuenta «Efectivo»: pedidos GET a SUPABASE_URL/rest/v1/categories?select=id,name y SUPABASE_URL/rest/v1/accounts?select=id,name,type con los encabezados «apikey» = ANON_KEY y «Authorization» = Bearer + el token. Anotar el «id» de «Otros» y el de «Efectivo».
7. Gasto de ejemplo: monto 120000 en pesos, fecha 2026-08-15, con la cuenta «Efectivo» y la categoría «Otros» del usuario de prueba.

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Enviar create_transaction con 2 personas ["Sofía","Juan"] y 1 solo monto [40000]. | Responde 400 con el código 23514 y «Un gasto compartido necesita una persona y un monto por cada deuda»; no se crea nada. |

**Notas del diseño:** Caso por API: se hace con Postman (o curl), no desde la pantalla.

---

### CP-DEU-138 — Por API, listas vacías se rechazan

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-82 · CA-14 · FR-18 · I7 |
| Historias de usuario | US-82 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-138-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
5. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-deu-138-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
6. Identificadores de la categoría «Otros» y de la cuenta «Efectivo»: pedidos GET a SUPABASE_URL/rest/v1/categories?select=id,name y SUPABASE_URL/rest/v1/accounts?select=id,name,type con los encabezados «apikey» = ANON_KEY y «Authorization» = Bearer + el token. Anotar el «id» de «Otros» y el de «Efectivo».
7. Gasto de ejemplo: monto 120000 en pesos, fecha 2026-08-15, con la cuenta «Efectivo» y la categoría «Otros» del usuario de prueba.

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Enviar create_transaction con listas vacías de personas y de montos. | Responde 400 con el código 23514 y «Un gasto compartido necesita al menos una persona»; no se crea nada. |

**Notas del diseño:** Caso por API: se hace con Postman (o curl), no desde la pantalla.

---

### CP-DEU-139 — Por API, 11 personas se rechaza

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-139-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
5. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-deu-139-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
6. Identificadores de la categoría «Otros» y de la cuenta «Efectivo»: pedidos GET a SUPABASE_URL/rest/v1/categories?select=id,name y SUPABASE_URL/rest/v1/accounts?select=id,name,type con los encabezados «apikey» = ANON_KEY y «Authorization» = Bearer + el token. Anotar el «id» de «Otros» y el de «Efectivo».
7. Gasto de ejemplo: monto 120000 en pesos, fecha 2026-08-15, con la cuenta «Efectivo» y la categoría «Otros» del usuario de prueba.

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Enviar create_transaction con 11 personas. | Responde 400 con el código 23514 y «Un gasto se comparte con hasta 10 personas»; no se crea nada. |

**Notas del diseño:** Caso por API: se hace con Postman (o curl), no desde la pantalla.

---

### CP-DEU-140 — Por API, la misma persona repetida se rechaza

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Trazabilidad | US-82 · CA-14 · FR-18 · I7 |
| Historias de usuario | US-82 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-140-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
5. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-deu-140-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
6. Identificadores de la categoría «Otros» y de la cuenta «Efectivo»: pedidos GET a SUPABASE_URL/rest/v1/categories?select=id,name y SUPABASE_URL/rest/v1/accounts?select=id,name,type con los encabezados «apikey» = ANON_KEY y «Authorization» = Bearer + el token. Anotar el «id» de «Otros» y el de «Efectivo».
7. Gasto de ejemplo: monto 120000 en pesos, fecha 2026-08-15, con la cuenta «Efectivo» y la categoría «Otros» del usuario de prueba.

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Enviar create_transaction con las personas "Sofía" y "SOFÍA". | Responde 400 con el código 23514 y «Cada persona puede aparecer una sola vez»; no se crea nada. |

**Notas del diseño:** Caso por API: se hace con Postman (o curl), no desde la pantalla.

---

### CP-DEU-141 — Por API, deudas que suman más que el gasto se rechazan

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-141-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
5. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-deu-141-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
6. Identificadores de la categoría «Otros» y de la cuenta «Efectivo»: pedidos GET a SUPABASE_URL/rest/v1/categories?select=id,name y SUPABASE_URL/rest/v1/accounts?select=id,name,type con los encabezados «apikey» = ANON_KEY y «Authorization» = Bearer + el token. Anotar el «id» de «Otros» y el de «Efectivo».
7. Gasto de ejemplo: monto 120000 en pesos, fecha 2026-08-15, con la cuenta «Efectivo» y la categoría «Otros» del usuario de prueba.

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Enviar create_transaction de 120000 con montos 60000 y 60000.01. | Responde 400 con el código 23514 y «I7: la suma de las deudas no puede superar el monto del gasto»; no se crea nada. |

**Notas del diseño:** Caso por API: se hace con Postman (o curl), no desde la pantalla.

---

### CP-DEU-142 — Dólares: el redondeo hace que las deudas sumen más que el gasto

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-82 · CA-14, CA-22 · FR-18 · I4, I7 |
| Historias de usuario | US-82 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-142-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-142-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Tocar la moneda US$, escribir 3 en el campo del monto, escribir 1000,005 en el campo de tipo de cambio y tocar «Siguiente». | Se abre el paso 2 de 3. |
| 2 | Tocar la categoría «Otros». | Se abre el paso 3 de 3. |
| 3 | Tocar el interruptor «Gasto compartido», escribir Sofía y 1 en la fila 1, tocar «Agregar persona», escribir Juan y 1 en la fila 2, tocar «Agregar persona», escribir Ana y 1 en la fila 3 y apretar Tab. | Aparece el mensaje de error con el texto exacto «En pesos, la suma supera el gasto por redondeo. Bajá un centavo alguna deuda.» y el botón «Guardar gasto» queda deshabilitado. |

---

### CP-DEU-142A — Por API, el mismo caso de redondeo se rechaza

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-82 · CA-14 · FR-18 · I4, I7 |
| Historias de usuario | US-82 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-142a-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
5. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-deu-142a-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
6. Identificadores de la categoría «Otros» y de la cuenta «Efectivo»: pedidos GET a SUPABASE_URL/rest/v1/categories?select=id,name y SUPABASE_URL/rest/v1/accounts?select=id,name,type con los encabezados «apikey» = ANON_KEY y «Authorization» = Bearer + el token. Anotar el «id» de «Otros» y el de «Efectivo».
7. Gasto de ejemplo: monto 120000 en pesos, fecha 2026-08-15, con la cuenta «Efectivo» y la categoría «Otros» del usuario de prueba.

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Enviar create_transaction de US$3 a tipo de cambio 1000.005 con tres deudas de 1. | Responde 400 con el código 23514 y «I7: en pesos, la suma de las deudas supera el gasto por redondeo»; no se crea nada. |

**Notas del diseño:** Caso por API: se hace con Postman (o curl), no desde la pantalla.

---

### CP-DEU-142B — Por API, una segunda persona sin nombre se rechaza sin guardar nada

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Trazabilidad | US-82 · CA-14 · FR-18 · I7 |
| Historias de usuario | US-82 |
| Canal | API |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-142b-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Herramienta para llamar a la API: Postman (o curl). Datos del entorno de prueba: dirección de la base («SUPABASE_URL») y clave pública («ANON_KEY»), que se ven en la pestaña «Network» del navegador, en el encabezado «apikey» de cualquier pedido de la app.
5. Token de sesión del usuario: en Postman, pedido POST a SUPABASE_URL/auth/v1/token?grant_type=password con el encabezado «apikey» = ANON_KEY, tipo «Content-Type: application/json» y cuerpo {"email": "qa+cp-deu-142b-001@example.com", "password": "Clave123!"}. Debe responder 200; copiar el valor de «access_token».
6. Identificadores de la categoría «Otros» y de la cuenta «Efectivo»: pedidos GET a SUPABASE_URL/rest/v1/categories?select=id,name y SUPABASE_URL/rest/v1/accounts?select=id,name,type con los encabezados «apikey» = ANON_KEY y «Authorization» = Bearer + el token. Anotar el «id» de «Otros» y el de «Efectivo».
7. Gasto de ejemplo: monto 120000 en pesos, fecha 2026-08-15, con la cuenta «Efectivo» y la categoría «Otros» del usuario de prueba.

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Enviar create_transaction con personas ["Sofía", "   "] y montos [30000, 20000]. | Responde 400 con el código 23514 y «Ingresá con quién compartiste el gasto»; no se crea ni el gasto ni la deuda de Sofía. |

**Notas del diseño:** Caso por API: se hace con Postman (o curl), no desde la pantalla.

---

### CP-DEU-143 — Resumen: gasto bruto y neto de reembolsos

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-143-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-143-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Gasto de $120.000 en una cuota, con fecha 15/08/2026 y nota «Supermercado», compartido con Sofía ($60.000) (Registrar → «Gasto compartido»). Se carga desde Registrar (categoría «Otros», cuenta «Efectivo»).
6. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /dashboard?period=2026-08 a la dirección de la app y apretar Enter. | En la tarjeta «Gastado en agosto 2026»: el gasto total muestra «$120.000,00» (bruto); aparece la fila «Neto de reembolsos» y el monto del neto = «$60.000,00»; la aclaración del neto no se ve; y debajo se ve el enlace «Ver deudas». |
| 2 | Tocar el enlace «Ver deudas». | El navegador navega a /debts y muestra la deuda de Sofía por $60.000,00. |

---

### CP-DEU-144 — Resumen: el neto no cambia al saldar la deuda

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-144-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-144-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Gasto de $120.000 en una cuota, con fecha 15/08/2026, compartido con Sofía ($60.000) (Registrar → «Gasto compartido»). Se carga desde Registrar (categoría «Otros», cuenta «Efectivo»).
6. Esa deuda marcada como saldada hoy (botón «Marcar saldada»).
7. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).
8. Fechas que dependen de hoy: «mes actual» es el mes de hoy; «mes anterior» es el mes calendario anterior; «el día 10 del mes actual» es el día 10 del mes de hoy (si hoy es antes del 10, la fecha de hoy); «el día 15 del mes anterior» es el 15 del mes anterior; «hoy» es el día en que se ejecuta el caso. En las direcciones, period=AAAA-MM es el año y el mes con dos dígitos (por ejemplo, para octubre de 2026: period=2026-10).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /dashboard?period=2026-08 a la dirección de la app y apretar Enter. | El gasto total muestra «$120.000,00» y el monto del neto muestra «$60.000,00». |

---

### CP-DEU-145 — Resumen: gasto en 12 cuotas con deuda, neto negativo

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-30 · CA-3, CA-7, CA-8, CA-10 · FR-19 · R1, R3 · I2, I3, I7, I10 |
| Historias de usuario | US-30 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-145-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-145-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Gasto de $120.000 en 12 cuotas, con fecha 15/08/2026, compartido con Sofía ($60.000) (Registrar → «Gasto compartido»). Se carga desde Registrar (categoría «Otros», cuenta «Efectivo»).
6. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /dashboard?period=2026-08 a la dirección de la app y apretar Enter. | En el Resumen de agosto 2026: el gasto total muestra «$10.000,00»; el monto del neto muestra «-$50.000,00» ($10.000,00 − $60.000,00); y debajo se ve la aclaración del neto con el texto exacto «Las deudas se descuentan enteras en el mes de la compra, aunque sea en cuotas.». |
| 2 | Agregar /dashboard?period=2026-09 a la dirección de la app y apretar Enter. | En el Resumen de septiembre 2026: el gasto total muestra «$10.000,00» (cuota 2/12) y la fila «Neto de reembolsos» no se ve. |

**Notas del diseño:** Error de preparación del caso: pide 12 cuotas con la cuenta «Efectivo» y la app solo permite cuotas con una cuenta de tarjeta de crédito (regla I6); hay que preparar el gasto con la cuenta «Tarjeta de crédito».

---

### CP-DEU-146 — Resumen: una deuda suelta «Me deben» no cambia el neto

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-146-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-146-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Gasto de $80.000 en una cuota, con fecha 15/08/2026. Se carga desde Registrar (categoría «Otros», cuenta «Efectivo»).
6. Deuda cargada desde Deudas → «Nueva deuda»: Juan te debe $25.000, con fecha 16/08/2026.
7. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /dashboard?period=2026-08 a la dirección de la app y apretar Enter. | El gasto total muestra «$80.000,00» y la fila «Neto de reembolsos» no se ve. |

---

### CP-DEU-147 — Resumen: una deuda suelta «Debo» no cambia el neto

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-147-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-147-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Gasto de $120.000 en una cuota, con fecha 15/08/2026, compartido con Sofía ($60.000) (Registrar → «Gasto compartido»). Se carga desde Registrar (categoría «Otros», cuenta «Efectivo»).
6. Deuda cargada desde Deudas → «Nueva deuda»: Le debés $15.000 a Martín, con fecha 16/08/2026.
7. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /dashboard?period=2026-08 a la dirección de la app y apretar Enter. | El gasto total muestra «$120.000,00» y el monto del neto muestra «$60.000,00» (la deuda «Debo» de $15.000,00 no suma ni resta en el neto). |

---

### CP-DEU-148 — Resumen: eliminar un gasto compartido actualiza el neto en vivo

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-30 · CA-5 · US-35 · CA-5 · FR-19 · I7, I10 |
| Historias de usuario | US-30, US-35 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-148-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-148-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Gasto de $100.000 en una cuota, con fecha 15/08/2026 y nota «Cena», compartido con Sofía ($40.000) (Registrar → «Gasto compartido»). Se carga desde Registrar (categoría «Otros», cuenta «Efectivo»).
6. Gasto de $50.000 en una cuota, con fecha 16/08/2026 y nota «Taxi», compartido con Juan ($20.000) (Registrar → «Gasto compartido»). Se carga desde Registrar (categoría «Otros», cuenta «Efectivo»).
7. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /dashboard?period=2026-08 a la dirección de la app y apretar Enter. | El gasto total muestra «$150.000,00» y el monto del neto muestra «$90.000,00» ($150.000,00 − $60.000,00). |
| 2 | En «Últimos movimientos» del Resumen, tocar el botón de papelera del gasto «Taxi» ($50.000,00) y confirmar haciendo click en «Eliminar». | Sin recargar la página, el gasto total pasa a «$100.000,00» y el monto del neto pasa a «$60.000,00» ($100.000,00 − $40.000,00). |

---

### CP-DEU-148B — Resumen: restaurar un gasto compartido vuelve a restar su deuda

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-30 · CA-5 · US-35 · CA-6 · FR-19 · I7, I10 |
| Historias de usuario | US-30, US-35 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-148b-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-148b-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Gasto de $100.000 en una cuota, con fecha 15/08/2026 y nota «Cena», compartido con Sofía ($40.000) (Registrar → «Gasto compartido»). Se carga desde Registrar (categoría «Otros», cuenta «Efectivo»).
6. Gasto de $50.000 en una cuota, con fecha 16/08/2026 y nota «Taxi», compartido con Juan ($20.000) (Registrar → «Gasto compartido»). Se carga desde Registrar (categoría «Otros», cuenta «Efectivo»).
7. El gasto «Taxi» eliminado (Movimientos → tacho).
8. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Escribir /transactions?period=2026-08 en la barra de direcciones y apretar Enter, tocar «Eliminados» y tocar «Restaurar» en la fila de «Taxi». | El gasto «Taxi» se restaura a Movimientos activos. |
| 2 | Agregar /dashboard?period=2026-08 a la dirección de la app y apretar Enter. | El gasto total muestra «$150.000,00» y el monto del neto muestra «$90.000,00» ($150.000,00 − $60.000,00). |

---

### CP-DEU-149 — Resumen: el neto en dólares no cambia si cambia el tipo de cambio

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
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-149-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-149-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Gasto de US$100 a tipo de cambio 1250 en una cuota, con fecha 15/08/2026, compartido con Sofía (US$40) (Registrar → «Gasto compartido»). Se carga desde Registrar (categoría «Otros», cuenta «Efectivo»).
6. Tipo de cambio de referencia cambiado a 1500 para agosto de 2026: Ajustes → «Tipo de cambio de referencia» → elegir el mes, escribir el valor y «Guardar tipo de cambio».
7. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /dashboard?period=2026-08 a la dirección de la app y apretar Enter. | El gasto total muestra «$125.000,00» y el monto del neto muestra «$75.000,00» ($125.000,00 − $50.000,00, usando el valor en pesos congelado de la deuda y no $60.000,00). |

---

### CP-DEU-150 — Resumen: sin deudas vinculadas no aparece el neto

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Trazabilidad | US-30 · CA-7, CA-8 · FR-19 · — |
| Historias de usuario | US-30 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-150-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-150-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Gasto de $45.000 en una cuota, con fecha 15/08/2026. Se carga desde Registrar (categoría «Otros», cuenta «Efectivo»).
6. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /dashboard?period=2026-08 a la dirección de la app y apretar Enter. | El gasto total muestra «$45.000,00» y la fila «Neto de reembolsos» no se ve. |

---

### CP-DEU-151 — Balance: una deuda suelta «Me deben» resta del balance del mes

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Caso de uso · Positivo |
| Trazabilidad | US-83 · CA-1, CA-10, CA-14 · FR-18, FR-20 · I7 |
| Historias de usuario | US-83 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-151-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-151-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Ingreso de $100.000, con fecha el día 10 del mes actual. Se carga desde Registrar tocando «Ingreso» (cuenta «Efectivo»).
6. Deuda cargada desde Deudas → «Nueva deuda»: Juan te debe $20.000, con fecha el día 10 del mes actual.
7. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).
8. Fechas que dependen de hoy: «mes actual» es el mes de hoy; «mes anterior» es el mes calendario anterior; «el día 10 del mes actual» es el día 10 del mes de hoy (si hoy es antes del 10, la fecha de hoy); «el día 15 del mes anterior» es el 15 del mes anterior; «hoy» es el día en que se ejecuta el caso. En las direcciones, period=AAAA-MM es el año y el mes con dos dígitos (por ejemplo, para octubre de 2026: period=2026-10).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /dashboard?period=AAAA-MM del mes actual a la dirección de la app y apretar Enter. | El total de ingresos muestra «$100.000,00»; el gasto total muestra «$0,00»; el balance muestra «$80.000,00»; la etiqueta del balance muestra «Superávit»; la línea de deudas sueltas muestra el texto exacto «Incluye deudas sueltas: -$20.000,00»; y la fila «Neto de reembolsos» no se ve. |

---

### CP-DEU-152 — Balance: una deuda suelta «Debo» suma al balance del mes

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Caso de uso · Positivo |
| Trazabilidad | US-83 · CA-2, CA-10 · FR-18, FR-20 · I7 |
| Historias de usuario | US-83 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-152-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-152-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Ingreso de $100.000, con fecha el día 10 del mes actual. Se carga desde Registrar tocando «Ingreso» (cuenta «Efectivo»).
6. Deuda cargada desde Deudas → «Nueva deuda»: Le debés $50.000 a Marta, con fecha el día 10 del mes actual.
7. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).
8. Fechas que dependen de hoy: «mes actual» es el mes de hoy; «mes anterior» es el mes calendario anterior; «el día 10 del mes actual» es el día 10 del mes de hoy (si hoy es antes del 10, la fecha de hoy); «el día 15 del mes anterior» es el 15 del mes anterior; «hoy» es el día en que se ejecuta el caso. En las direcciones, period=AAAA-MM es el año y el mes con dos dígitos (por ejemplo, para octubre de 2026: period=2026-10).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /dashboard?period=AAAA-MM del mes actual a la dirección de la app y apretar Enter. | El total de ingresos muestra «$100.000,00»; el gasto total muestra «$0,00»; el balance muestra «$150.000,00»; la etiqueta del balance muestra «Superávit»; y la línea de deudas sueltas muestra el texto exacto «Incluye deudas sueltas: $50.000,00». |

---

### CP-DEU-153 — Balance: saldar la deuda suelta el mismo mes lo deja como antes

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-83 · CA-3 · FR-18, FR-20 · I7, I9 |
| Historias de usuario | US-83 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-153-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-153-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Ingreso de $100.000, con fecha el día 10 del mes actual. Se carga desde Registrar tocando «Ingreso» (cuenta «Efectivo»).
6. Deuda cargada desde Deudas → «Nueva deuda»: Juan te debe $20.000, con fecha el día 10 del mes actual.
7. Esa deuda marcada como saldada hoy (botón «Marcar saldada»).
8. Fechas que dependen de hoy: «mes actual» es el mes de hoy; «mes anterior» es el mes calendario anterior; «el día 10 del mes actual» es el día 10 del mes de hoy (si hoy es antes del 10, la fecha de hoy); «el día 15 del mes anterior» es el 15 del mes anterior; «hoy» es el día en que se ejecuta el caso. En las direcciones, period=AAAA-MM es el año y el mes con dos dígitos (por ejemplo, para octubre de 2026: period=2026-10).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /dashboard?period=AAAA-MM del mes actual a la dirección de la app y apretar Enter. | El balance muestra «$100.000,00», la etiqueta del balance muestra «Superávit» y la línea de deudas sueltas muestra el texto exacto «Incluye deudas sueltas: $0,00». |

---

### CP-DEU-153B — Balance en cero: deuda suelta creada y saldada el mismo mes

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Media |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-83 · CA-3, CA-9, CA-10 · FR-18, FR-20 · I7, I9 |
| Historias de usuario | US-83 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-153b-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-153b-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Deuda cargada desde Deudas → «Nueva deuda»: Juan te debe $20.000, con fecha el día 10 del mes actual.
6. Esa deuda marcada como saldada hoy (botón «Marcar saldada»).
7. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).
8. Fechas que dependen de hoy: «mes actual» es el mes de hoy; «mes anterior» es el mes calendario anterior; «el día 10 del mes actual» es el día 10 del mes de hoy (si hoy es antes del 10, la fecha de hoy); «el día 15 del mes anterior» es el 15 del mes anterior; «hoy» es el día en que se ejecuta el caso. En las direcciones, period=AAAA-MM es el año y el mes con dos dígitos (por ejemplo, para octubre de 2026: period=2026-10).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /dashboard?period=AAAA-MM del mes actual a la dirección de la app y apretar Enter. | El total de ingresos muestra «$0,00»; el gasto total muestra «$0,00»; el balance muestra «$0,00»; la etiqueta del balance muestra el texto exacto «En cero»; y la línea de deudas sueltas muestra «Incluye deudas sueltas: $0,00». |

---

### CP-DEU-154 — Balance: una deuda saldada hoy mueve el balance de dos meses

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Caso de uso · Positivo |
| Trazabilidad | US-83 · CA-4, CA-10, CA-11 · FR-18, FR-20 · I7, I9 |
| Historias de usuario | US-83 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-154-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-154-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Deuda cargada desde Deudas → «Nueva deuda»: Juan te debe $20.000, con fecha el día 15 del mes anterior.
6. Esa deuda marcada como saldada hoy (botón «Marcar saldada»).
7. Fechas que dependen de hoy: «mes actual» es el mes de hoy; «mes anterior» es el mes calendario anterior; «el día 10 del mes actual» es el día 10 del mes de hoy (si hoy es antes del 10, la fecha de hoy); «el día 15 del mes anterior» es el 15 del mes anterior; «hoy» es el día en que se ejecuta el caso. En las direcciones, period=AAAA-MM es el año y el mes con dos dígitos (por ejemplo, para octubre de 2026: period=2026-10).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /dashboard?period=AAAA-MM del mes anterior a la dirección de la app y apretar Enter. | El balance muestra «-$20.000,00», la etiqueta del balance muestra «Déficit» y la línea de deudas sueltas muestra «Incluye deudas sueltas: -$20.000,00». |
| 2 | Agregar /dashboard?period=AAAA-MM del mes actual a la dirección de la app y apretar Enter. | El balance muestra «$20.000,00», la etiqueta del balance muestra «Superávit» y la línea de deudas sueltas muestra «Incluye deudas sueltas: $20.000,00». |

---

### CP-DEU-155 — Balance: reabrir la deuda saca el evento del mes actual

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Transición de estados · Positivo |
| Trazabilidad | US-83 · CA-5, CA-14 · FR-18, FR-20 · I7, I9 |
| Historias de usuario | US-83 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-155-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-155-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Ingreso de $100.000, con fecha el día 10 del mes actual. Se carga desde Registrar tocando «Ingreso» (cuenta «Efectivo»).
6. Deuda cargada desde Deudas → «Nueva deuda»: Juan te debe $20.000, con fecha el día 15 del mes anterior.
7. Esa deuda marcada como saldada hoy (botón «Marcar saldada»).
8. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).
9. Fechas que dependen de hoy: «mes actual» es el mes de hoy; «mes anterior» es el mes calendario anterior; «el día 10 del mes actual» es el día 10 del mes de hoy (si hoy es antes del 10, la fecha de hoy); «el día 15 del mes anterior» es el 15 del mes anterior; «hoy» es el día en que se ejecuta el caso. En las direcciones, period=AAAA-MM es el año y el mes con dos dígitos (por ejemplo, para octubre de 2026: period=2026-10).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Escribir /debts?status=settled en la barra de direcciones y apretar Enter, y tocar «Volver a pendiente» en la fila de Juan. | Aparece el aviso «La deuda con Juan volvió a pendiente». |
| 2 | Agregar /dashboard?period=AAAA-MM del mes actual a la dirección de la app y apretar Enter. | El balance vuelve a mostrar «$100.000,00» (ingresos − gastos) y la línea de deudas sueltas no se ve. |
| 3 | Agregar /dashboard?period=AAAA-MM del mes anterior a la dirección de la app y apretar Enter. | El balance sigue mostrando «-$20.000,00» y la línea de deudas sueltas muestra «Incluye deudas sueltas: -$20.000,00». |

---

### CP-DEU-156 — Balance: una deuda suelta «Debo» saldada hoy mueve dos meses

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Caso de uso · Positivo |
| Trazabilidad | US-83 · CA-6, CA-11 · FR-18, FR-20 · I7, I9 |
| Historias de usuario | US-83 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-156-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-156-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Deuda cargada desde Deudas → «Nueva deuda»: Le debés $50.000 a Marta, con fecha el día 15 del mes anterior.
6. Esa deuda marcada como saldada hoy (botón «Marcar saldada»).
7. Fechas que dependen de hoy: «mes actual» es el mes de hoy; «mes anterior» es el mes calendario anterior; «el día 10 del mes actual» es el día 10 del mes de hoy (si hoy es antes del 10, la fecha de hoy); «el día 15 del mes anterior» es el 15 del mes anterior; «hoy» es el día en que se ejecuta el caso. En las direcciones, period=AAAA-MM es el año y el mes con dos dígitos (por ejemplo, para octubre de 2026: period=2026-10).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /dashboard?period=AAAA-MM del mes anterior a la dirección de la app y apretar Enter. | El balance muestra «$50.000,00», la etiqueta del balance muestra «Superávit» y la línea de deudas sueltas muestra «Incluye deudas sueltas: $50.000,00». |
| 2 | Agregar /dashboard?period=AAAA-MM del mes actual a la dirección de la app y apretar Enter. | El balance muestra «-$50.000,00», la etiqueta del balance muestra «Déficit» y la línea de deudas sueltas muestra «Incluye deudas sueltas: -$50.000,00». |

---

### CP-DEU-157 — Balance: la deuda en dólares conserva el tipo de cambio de origen

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | Sí |
| Técnica · Tipo | Caso de uso · Positivo |
| Trazabilidad | US-83 · CA-7 · FR-18, FR-20 · R2 · I4, I7, I9 |
| Historias de usuario | US-83 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-157-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-157-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Deuda cargada desde Deudas → «Nueva deuda»: Juan te debe US$40 (a tipo de cambio 1250), con fecha el día 15 del mes anterior.
6. Tipo de cambio de referencia cambiado a 1500 para el mes actual: Ajustes → «Tipo de cambio de referencia» → elegir el mes, escribir el valor y «Guardar tipo de cambio».
7. Esa deuda marcada como saldada hoy (botón «Marcar saldada»).
8. Fechas que dependen de hoy: «mes actual» es el mes de hoy; «mes anterior» es el mes calendario anterior; «el día 10 del mes actual» es el día 10 del mes de hoy (si hoy es antes del 10, la fecha de hoy); «el día 15 del mes anterior» es el 15 del mes anterior; «hoy» es el día en que se ejecuta el caso. En las direcciones, period=AAAA-MM es el año y el mes con dos dígitos (por ejemplo, para octubre de 2026: period=2026-10).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /dashboard?period=AAAA-MM del mes anterior a la dirección de la app y apretar Enter. | El balance muestra «-$50.000,00» y la línea de deudas sueltas muestra «Incluye deudas sueltas: -$50.000,00». |
| 2 | Agregar /dashboard?period=AAAA-MM del mes actual a la dirección de la app y apretar Enter. | El balance muestra «$50.000,00» (no «$60.000,00») y la línea de deudas sueltas muestra «Incluye deudas sueltas: $50.000,00». |

---

### CP-DEU-158 — Balance: un gasto compartido no aparece como deuda suelta

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Trazabilidad | US-83 · CA-8, CA-14 · FR-18, FR-20 · I7, I9 |
| Historias de usuario | US-83 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-158-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-158-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Gasto de $120.000 en una cuota, con fecha el día 10 del mes actual, compartido con Sofía ($60.000) (Registrar → «Gasto compartido»). Se carga desde Registrar (categoría «Otros», cuenta «Efectivo»).
6. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).
7. Fechas que dependen de hoy: «mes actual» es el mes de hoy; «mes anterior» es el mes calendario anterior; «el día 10 del mes actual» es el día 10 del mes de hoy (si hoy es antes del 10, la fecha de hoy); «el día 15 del mes anterior» es el 15 del mes anterior; «hoy» es el día en que se ejecuta el caso. En las direcciones, period=AAAA-MM es el año y el mes con dos dígitos (por ejemplo, para octubre de 2026: period=2026-10).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /dashboard?period=AAAA-MM del mes actual a la dirección de la app y apretar Enter. | El gasto total muestra «$120.000,00», el balance muestra «-$120.000,00» y la línea de deudas sueltas no se ve. |
| 2 | Escribir /debts en la barra de direcciones y apretar Enter, y tocar «Marcar saldada» en la fila de Sofía. | Aparece el aviso «Deuda con Sofía saldada». |
| 3 | Agregar /dashboard?period=AAAA-MM del mes actual a la dirección de la app y apretar Enter. | El balance sigue mostrando «-$120.000,00» y la línea de deudas sueltas sigue sin existir en pantalla. |

**Notas del diseño:** Este caso se cumple también sin la función US-83 (la línea «Incluye deudas sueltas» no se muestra nunca todavía); no prueba nada hasta que exista.

---

### CP-DEU-159 — Un mes solo con una deuda suelta no se ve vacío

| Campo | Contenido |
|---|---|
| Funcionalidad | Deudas y gastos compartidos |
| Prioridad | Alta |
| Camino feliz | No |
| Técnica · Tipo | Valores límite · Límite |
| Trazabilidad | US-83 · CA-9, CA-10 · FR-18, FR-20 · I7 |
| Historias de usuario | US-83 |
| Canal | UI |
| Automatizable | Sí |

**Pre-requisitos:**

1. La aplicación Biyu funcionando y accesible en el navegador (dirección de la app, por ejemplo https://biyu-rust.vercel.app). En este documento «la dirección de la app» es esa URL.
2. Navegador Google Chrome (versión estable), usando una ventana de incógnito para que no haya sesiones anteriores.
3. Usuario de prueba NUEVO, creado solo para este caso: email qa+cp-deu-159-001@example.com, contraseña Clave123!. Cómo crearlo: en la pantalla «Entrar» tocar «Crear una cuenta»; completar el email, la contraseña y «Confirmar contraseña»; tocar «Crear cuenta» y después «Saltear» en cada uno de los 4 pasos de la configuración inicial. Termina en Registrar, paso 1 («¿Cuánto?»).
4. Sesión iniciada con ese usuario: si se cerró la sesión, en «Entrar» escribir qa+cp-deu-159-001@example.com en «Email» y Clave123! en «Contraseña» y tocar «Entrar». Debe abrirse Registrar, paso 1 («¿Cuánto?»).
5. Deuda cargada desde Deudas → «Nueva deuda»: Juan te debe $20.000, con fecha 15/08/2026.
6. Catálogo inicial del usuario: viene con la cuenta «Efectivo» y la categoría «Otros» (no hace falta crear nada más).

**Datos de prueba:**


| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Agregar /dashboard?period=2026-08 a la dirección de la app y apretar Enter. | El mensaje de mes vacío no se ve; se ven las tarjetas del Resumen con el gasto total = «$0,00», el total de ingresos = «$0,00», el balance = «-$20.000,00», la etiqueta del balance = «Déficit» y la línea de deudas sueltas = «Incluye deudas sueltas: -$20.000,00», y las secciones de categorías, cuentas y últimos movimientos muestran sus estados vacíos individuales. |

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
