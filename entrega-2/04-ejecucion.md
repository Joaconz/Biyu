# Entrega 2 · Ejecución de casos de prueba (V2) · Deudas, Navegación, Exportar CSV, Importar Excel y Suscripciones

Planilla: `04-ejecucion.xlsx` (una hoja por caso con el «Reporte de ejecución 1», el resultado obtenido, la evidencia y los defectos). Casos: ver `02-especificacion-casos-v2` (Deudas y Navegación) y `casos/exp.md`, `casos/imp.md` y `casos/sus.md` (Exportar, Importar y Suscripciones; sus pasos también están en la hoja de cada caso de la planilla).

## Condiciones de la ejecución

- **Fecha:** 2026-10-25.
- **Ejecutó a mano (Santiago):** CP-DEU-018 a 028 (con la variante 020B) y 40 casos de Navegación, en el **deploy de Vercel** (https://biyu-rust.vercel.app), con **Google Chrome**.
- **Ejecutó Claude Code, supervisado por Santiago (44 casos de Navegación):** los que el equipo no había podido probar (CP-NAV-013 a 017, 038, 039, 053 y 054) y los de herramienta técnica (CP-NAV-018 a 021, 040 a 046, 048, 063 a 085). Entorno local: Vite (`http://127.0.0.1:5173`) + Supabase local con todas las migraciones, `main` en `f096e22`, Chromium (Playwright 1.63) y navegador integrado de Claude Code.
- **Ejecutó Claude Code, supervisado por Santiago (Deudas):** el intento de CP-DEU-029 y los 92 casos CP-DEU-100 a 159, en el mismo entorno local. La preparación (deudas, gastos y tipos de cambio) se cargó por API, como en los casos originales con PR-04.
- **Datos:** usuarios y montos ficticios, uno por caso.
- **Exportar CSV (CP-EXP-001 a 075), Importar Excel (CP-IMP-001 a 144) y Suscripciones (CP-SUS):** ejecutados el **2026-10-27** en el entorno local (Vite + Supabase local, Chromium con Playwright), sobre `main` en `1c72d0f`. **Ejecutó Claude Code (IA), supervisado por Santiago:** los 75 de EXP, los 144 de IMP y 80 de los 158 de SUS (los que el equipo no pudo probar o informó con una observación). Los otros 78 casos de SUS los ejecutó el equipo y los informó como «ok» en un mensaje; no se repitieron. Detalle del entorno y de lo sustituido en `06-reporte-de-ejecucion`, §7.
- **Criterio para BLOCKED:** un caso que no se puede ejecutar porque falta una funcionalidad o un botón queda BLOCKED para V3.


## Resultado por caso

| ID | Prioridad | Título | Status | Ejecutó | Defectos |
|---|---|---|---|---|---|
| CP-DEU-018 | Alta | No se puede compartir un gasto si falta cuánto te deben | **PASSED** | Santiago | — |
| CP-DEU-019 | Alta | No se puede compartir un gasto si falta con quién | **PASSED** | Santiago | — |
| CP-DEU-020 | Alta | Un ingreso no se puede compartir | **PASSED** | Santiago | — |
| CP-DEU-020B | Alta | Un ingreso repartido entre 11 personas tampoco se puede compartir | **PASSED** | Santiago | — |
| CP-DEU-021 | Alta | El nombre hecho solo de espacios no cuenta como nombre | **PASSED** | Santiago | — |
| CP-DEU-022 | Media | El nombre hecho solo de una tabulación no cuenta como nombre | **PASSED** | Santiago | — |
| CP-DEU-023 | Media | El nombre admite hasta 60 caracteres, no 61 | **PASSED** | Santiago | — |
| CP-DEU-024 | Alta | No se puede deber 0 pesos | **PASSED** | Santiago | — |
| CP-DEU-025 | Alta | No se puede deber un monto negativo | **PASSED** | Santiago | — |
| CP-DEU-026 | Media | El monto que te deben admite hasta 2 decimales | **PASSED** | Santiago | — |
| CP-DEU-027 | Media | El monto que te deben no acepta texto | **PASSED** | Santiago | — |
| CP-DEU-028 | Alta | Una deuda en dólares que en pesos vale menos de un centavo se rechaza | **PASSED** | Santiago | — |
| CP-DEU-029 | Alta | Sin haber iniciado sesión no se puede crear un gasto compartido | **BLOCKED** | Claude Code | — |
| CP-DEU-100 | Media | Abrir la dirección de «Saldadas» y recargar mantiene el filtro | **PASSED** | Claude Code | — |
| CP-DEU-101 | Baja | Un filtro inválido en la dirección se trata como «Pendientes» | **PASSED** | Claude Code | — |
| CP-DEU-102 | Media | Deudas pendientes: la de fecha más nueva va primero | **PASSED** | Claude Code | — |
| CP-DEU-102B | Media | Deudas saldadas: la saldada más recientemente va primero | **PASSED** | Claude Code | — |
| CP-DEU-103 | Media | Sin deudas pendientes: mensaje y botón «Cargar una deuda» | **PASSED** | Claude Code | — |
| CP-DEU-104 | Baja | Sin deudas saldadas: mensaje y sin botón | **PASSED** | Claude Code | — |
| CP-DEU-105 | Baja | Sin ninguna deuda en «Todas»: mensaje y botón «Cargar una deuda» | **PASSED** | Claude Code | — |
| CP-DEU-106 | Alta | Otro usuario no ve las deudas de alguien más | **PASSED** | Claude Code | — |
| CP-DEU-107 | Alta | Por API, otro usuario no recibe las deudas de alguien más | **PASSED** | Claude Code | — |
| CP-DEU-108 | Alta | Por API, sin sesión no se pueden leer las deudas | **PASSED** | Claude Code | — |
| CP-DEU-108B | Alta | Sin sesión, la dirección /debts lleva al login | **PASSED** | Claude Code | — |
| CP-DEU-108C | Alta | Sin sesión, la dirección /debts/new lleva al login | **PASSED** | Claude Code | — |
| CP-DEU-109 | Alta | Marcar una deuda como saldada desde «Pendientes» | **PASSED** | Claude Code | — |
| CP-DEU-110 | Alta | Marcar saldada desde «Todas» deja la fila como saldada | **PASSED** | Claude Code | — |
| CP-DEU-111 | Alta | «Deshacer» devuelve la deuda a pendiente | **PASSED** | Claude Code | — |
| CP-DEU-111B | Media | El aviso con «Deshacer» desaparece al cambiar de filtro | **PASSED** | Claude Code | — |
| CP-DEU-112 | Media | Saldar una deuda que ya se saldó en otra pestaña muestra un error | **PASSED** | Claude Code | — |
| CP-DEU-113 | Alta | Por API, saldar una deuda ya saldada se rechaza | **PASSED** | Claude Code | — |
| CP-DEU-114 | Alta | Por API, un usuario no puede saldar la deuda de otro | **PASSED** | Claude Code | — |
| CP-DEU-114B | Media | Por API, saldar una deuda que no existe se rechaza | **PASSED** | Claude Code | — |
| CP-DEU-115 | Alta | Por API, sin sesión no se puede saldar una deuda | **PASSED** | Claude Code | — |
| CP-DEU-116 | Alta | Por API, no se puede modificar una deuda directamente | **PASSED** | Claude Code | — |
| CP-DEU-116B | Alta | Por API, no se puede borrar una deuda directamente | **PASSED** | Claude Code | — |
| CP-DEU-117 | Alta | «Volver a pendiente» desde «Saldadas» | **PASSED** | Claude Code | — |
| CP-DEU-118 | Alta | «Volver a pendiente» desde «Todas» actualiza los totales | **PASSED** | Claude Code | — |
| CP-DEU-119 | Alta | Por API, reabrir una deuda que ya está pendiente se rechaza | **PASSED** | Claude Code | — |
| CP-DEU-119B | Media | Volver a pendiente una deuda que ya se reabrió en otra pestaña muestra un error | **PASSED** | Claude Code | — |
| CP-DEU-120 | Alta | Por API, un usuario no puede reabrir la deuda de otro | **PASSED** | Claude Code | — |
| CP-DEU-120B | Media | Por API, reabrir una deuda que no existe se rechaza | **PASSED** | Claude Code | — |
| CP-DEU-121 | Alta | Por API, sin sesión no se puede reabrir una deuda | **PASSED** | Claude Code | — |
| CP-DEU-122 | Media | Saldar y reabrir tres veces seguidas deja la deuda pendiente | **PASSED** | Claude Code | — |
| CP-DEU-123 | Alta | Filtro por dirección: «Todas», «Te deben» y «Debés» | **PASSED** | Claude Code | — |
| CP-DEU-124 | Media | Los filtros de estado y de dirección se combinan | **PASSED** | Claude Code | — |
| CP-DEU-125 | Baja | Una dirección inválida se trata como «Todas» | **PASSED** | Claude Code | — |
| CP-DEU-126 | Baja | Sin deudas: «Pendientes» + «Te deben» | **PASSED** | Claude Code | — |
| CP-DEU-126B | Baja | Sin deudas: «Saldadas» + «Te deben» | **PASSED** | Claude Code | — |
| CP-DEU-126C | Baja | Sin deudas: «Todas» + «Te deben» | **PASSED** | Claude Code | — |
| CP-DEU-127 | Baja | Sin deudas: «Pendientes» + «Debés» | **PASSED** | Claude Code | — |
| CP-DEU-127B | Baja | Sin deudas: «Saldadas» + «Debés» | **PASSED** | Claude Code | — |
| CP-DEU-127C | Baja | Sin deudas: «Todas» + «Debés» | **PASSED** | Claude Code | — |
| CP-DEU-128 | Alta | Gasto compartido con varias personas: agregar, quitar y guardar | **BLOCKED** | Claude Code | — |
| CP-DEU-128B | Media | Las personas se ordenan por nombre sin distinguir mayúsculas ni tildes | **BLOCKED** | Claude Code | — |
| CP-DEU-129 | Alta | «Dividir en partes iguales» entre 2 personas | **BLOCKED** | Claude Code | — |
| CP-DEU-129B | Media | Dividir un gasto de $0,02 entre 2 personas da error | **BLOCKED** | Claude Code | — |
| CP-DEU-129C | Baja | «Dividir en partes iguales» con los nombres vacíos | **BLOCKED** | Claude Code | — |
| CP-DEU-130 | Media | «Dividir en partes iguales» entre 3 personas | **BLOCKED** | Claude Code | — |
| CP-DEU-130B | Media | Cambiar la moneda con personas cargadas vacía los montos | **BLOCKED** | Claude Code | — |
| CP-DEU-130C | Media | «Dividir en partes iguales» en dólares | **BLOCKED** | Claude Code | — |
| CP-DEU-130D | Media | En dólares, dividir un gasto muy chico da error de centavos | **BLOCKED** | Claude Code | — |
| CP-DEU-131 | Alta | Entre todos pueden deber todo el gasto (tu parte es $0) | **BLOCKED** | Claude Code | — |
| CP-DEU-132 | Alta | La suma de lo que te deben no puede superar el gasto | **BLOCKED** | Claude Code | — |
| CP-DEU-132B | Media | Bajar el gasto por debajo de lo que te deben da error | **BLOCKED** | Claude Code | — |
| CP-DEU-132C | Media | Una persona que debe más que el gasto da error en su fila | **BLOCKED** | Claude Code | — |
| CP-DEU-132D | Media | Bajar el gasto muy por debajo da error en cada fila | **BLOCKED** | Claude Code | — |
| CP-DEU-133 | Alta | Se puede compartir con hasta 10 personas | **BLOCKED** | Claude Code | — |
| CP-DEU-134 | Alta | No se puede repetir una persona | **BLOCKED** | Claude Code | — |
| CP-DEU-135 | Media | Una persona sin nombre da error en su fila | **BLOCKED** | Claude Code | — |
| CP-DEU-135B | Media | Quitar una persona conserva a las demás | **BLOCKED** | Claude Code | — |
| CP-DEU-135C | Media | Pasar a Ingreso y volver a Gasto reinicia la sección compartida | **BLOCKED** | Claude Code | — |
| CP-DEU-135D | Media | Apagar «Gasto compartido» guarda el gasto sin deudas | **BLOCKED** | Claude Code | — |
| CP-DEU-136 | Alta | Gasto compartido con 3 personas en 2 cuotas: etiqueta en Movimientos y Resumen | **BLOCKED** | Claude Code | — |
| CP-DEU-136B | Media | Al borrar un gasto con varias deudas, el aviso las lista | **BLOCKED** | Claude Code | — |
| CP-DEU-136C | Alta | Las 3 deudas de un mismo gasto aparecen en Deudas | **BLOCKED** | Claude Code | — |
| CP-DEU-136D | Alta | Eliminar el gasto saca sus 3 deudas | **BLOCKED** | Claude Code | — |
| CP-DEU-136E | Alta | Restaurar el gasto devuelve sus 3 deudas con su estado | **BLOCKED** | Claude Code | — |
| CP-DEU-137 | Alta | Por API, 2 personas y 1 monto se rechaza | **BLOCKED** | Claude Code | — |
| CP-DEU-138 | Media | Por API, listas vacías se rechazan | **BLOCKED** | Claude Code | — |
| CP-DEU-139 | Alta | Por API, 11 personas se rechaza | **BLOCKED** | Claude Code | — |
| CP-DEU-140 | Alta | Por API, la misma persona repetida se rechaza | **BLOCKED** | Claude Code | — |
| CP-DEU-141 | Alta | Por API, deudas que suman más que el gasto se rechazan | **BLOCKED** | Claude Code | — |
| CP-DEU-142 | Alta | Dólares: el redondeo hace que las deudas sumen más que el gasto | **BLOCKED** | Claude Code | — |
| CP-DEU-142A | Alta | Por API, el mismo caso de redondeo se rechaza | **BLOCKED** | Claude Code | — |
| CP-DEU-142B | Alta | Por API, una segunda persona sin nombre se rechaza sin guardar nada | **BLOCKED** | Claude Code | — |
| CP-DEU-143 | Alta | Resumen: gasto bruto y neto de reembolsos | **PASSED** | Claude Code | — |
| CP-DEU-144 | Alta | Resumen: el neto no cambia al saldar la deuda | **PASSED** | Claude Code | — |
| CP-DEU-145 | Alta | Resumen: gasto en 12 cuotas con deuda, neto negativo | **DUDA** | Claude Code | — |
| CP-DEU-146 | Alta | Resumen: una deuda suelta «Me deben» no cambia el neto | **PASSED** | Claude Code | — |
| CP-DEU-147 | Alta | Resumen: una deuda suelta «Debo» no cambia el neto | **PASSED** | Claude Code | — |
| CP-DEU-148 | Alta | Resumen: eliminar un gasto compartido actualiza el neto en vivo | **PASSED** | Claude Code | — |
| CP-DEU-148B | Alta | Resumen: restaurar un gasto compartido vuelve a restar su deuda | **PASSED** | Claude Code | — |
| CP-DEU-149 | Alta | Resumen: el neto en dólares no cambia si cambia el tipo de cambio | **PASSED** | Claude Code | — |
| CP-DEU-150 | Media | Resumen: sin deudas vinculadas no aparece el neto | **PASSED** | Claude Code | — |
| CP-DEU-151 | Alta | Balance: una deuda suelta «Me deben» resta del balance del mes | **BLOCKED** | Claude Code | — |
| CP-DEU-152 | Alta | Balance: una deuda suelta «Debo» suma al balance del mes | **BLOCKED** | Claude Code | — |
| CP-DEU-153 | Alta | Balance: saldar la deuda suelta el mismo mes lo deja como antes | **BLOCKED** | Claude Code | — |
| CP-DEU-153B | Media | Balance en cero: deuda suelta creada y saldada el mismo mes | **BLOCKED** | Claude Code | — |
| CP-DEU-154 | Alta | Balance: una deuda saldada hoy mueve el balance de dos meses | **BLOCKED** | Claude Code | — |
| CP-DEU-155 | Alta | Balance: reabrir la deuda saca el evento del mes actual | **BLOCKED** | Claude Code | — |
| CP-DEU-156 | Alta | Balance: una deuda suelta «Debo» saldada hoy mueve dos meses | **BLOCKED** | Claude Code | — |
| CP-DEU-157 | Alta | Balance: la deuda en dólares conserva el tipo de cambio de origen | **BLOCKED** | Claude Code | — |
| CP-DEU-158 | Alta | Balance: un gasto compartido no aparece como deuda suelta | **DUDA** | Claude Code | — |
| CP-DEU-159 | Alta | Un mes solo con una deuda suelta no se ve vacío | **BLOCKED** | Claude Code | — |
| CP-NAV-001 | Media | La barra tiene cuatro secciones en el orden correcto | **PASSED** | Santiago | — |
| CP-NAV-002 | Media | «Registrar» lleva a Registrar | **PASSED** | Santiago | — |
| CP-NAV-003 | Media | «Resumen» lleva al Resumen | **PASSED** | Santiago | — |
| CP-NAV-004 | Media | «Deudas» lleva a Deudas | **PASSED** | Santiago | — |
| CP-NAV-005 | Media | «Suscripciones» lleva a Suscripciones | **PASSED** | Santiago | — |
| CP-NAV-006 | Media | En Registrar la barra marca «Registrar» | **PASSED** | Santiago | — |
| CP-NAV-007 | Media | En el Resumen la barra marca «Resumen» | **PASSED** | Santiago | — |
| CP-NAV-008 | Media | En Movimientos la barra sigue marcando «Resumen» | **PASSED** | Santiago | — |
| CP-NAV-009 | Media | En Movimientos eliminados la barra sigue marcando «Resumen» | **PASSED** | Santiago | — |
| CP-NAV-010 | Media | En Deudas la barra marca «Deudas» | **PASSED** | Santiago | — |
| CP-NAV-011 | Media | En Suscripciones la barra marca «Suscripciones» | **PASSED** | Santiago | — |
| CP-NAV-012 | Media | En Ajustes no se marca ninguna de las cuatro secciones | **PASSED** | Santiago | — |
| CP-NAV-013 | Media | Pantalla muy angosta (320 px): los nombres se leen completos | **PASSED** | Claude Code | — |
| CP-NAV-014 | Media | Pantalla angosta (320 px): los botones son cómodos de tocar | **PASSED** | Claude Code | — |
| CP-NAV-015 | Media | Ancho 1023 px: barra abajo y engranaje de Ajustes | **PASSED** | Claude Code | — |
| CP-NAV-016 | Media | Ancho 1024 px: barra lateral con Ajustes al pie | **PASSED** | Claude Code | — |
| CP-NAV-017 | Media | Ancho 1280 px: se mantiene la barra lateral | **PASSED** | Claude Code | — |
| CP-NAV-018 | Media | Identificadores únicos en Registrar (375 px) | **PASSED** | Claude Code | — |
| CP-NAV-019 | Media | Identificadores únicos en Registrar (1023 px) | **PASSED** | Claude Code | — |
| CP-NAV-020 | Media | Identificadores únicos en Registrar (1024 px) | **PASSED** | Claude Code | — |
| CP-NAV-021 | Media | Identificadores únicos en Registrar (1280 px) | **PASSED** | Claude Code | — |
| CP-NAV-022 | Media | «Ver todos» y «‹ Resumen» mantienen el mes | **PASSED** | Santiago | — |
| CP-NAV-023 | Media | Con el mes vacío se llega igual a los movimientos eliminados | **PASSED** | Santiago | — |
| CP-NAV-024 | Media | Deudas no arrastra el mes del Resumen | **PASSED** | Santiago | — |
| CP-NAV-025 | Media | Suscripciones no arrastra el mes del Resumen | **PASSED** | Santiago | — |
| CP-NAV-026 | Media | Del Movimiento al Resumen se conserva el mes | **PASSED** | Santiago | — |
| CP-NAV-027 | Alta | Tocar «Registrar» estando en Registrar no pierde lo cargado | **PASSED** | Santiago | — |
| CP-NAV-028 | Media | Escribir /transactions abre Movimientos con la barra nueva | **PASSED** | Santiago | — |
| CP-NAV-029 | Media | El aviso al borrar explica cómo restaurar un gasto | **PASSED** | Santiago | — |
| CP-NAV-030 | Media | Guardar $12.500 muestra la confirmación completa | **PASSED** | Santiago | — |
| CP-NAV-031 | Media | Guardar $120.000 en 12 cuotas lo dice en el aviso | **PASSED** | Santiago | — |
| CP-NAV-032 | Alta | Sin internet el gasto no se pierde y aparece «Reintentar» | **PASSED** | Santiago | — |
| CP-NAV-033 | Alta | El aviso de error no desaparece solo | **PASSED** | Santiago | — |
| CP-NAV-034 | Alta | Reintentar al volver internet guarda una sola vez | **PASSED** | Santiago | — |
| CP-NAV-035 | Alta | Cambiar el monto después del fallo empieza un intento nuevo | **PASSED** | Santiago | — |
| CP-NAV-036 | Alta | Guardar el gasto corregido elimina el pendiente anterior | **PASSED** | Santiago | — |
| CP-NAV-037 | Alta | Dos fallos seguidos dejan un solo pendiente | **PASSED** | Santiago | — |
| CP-NAV-038 | Alta | Con internet muy lenta, a los 15 segundos avisa que falló | **PASSED** | Claude Code | — |
| CP-NAV-039 | Alta | Reintentar no duplica un gasto que ya se había guardado | **PASSED** | Claude Code | — |
| CP-NAV-040 | Alta | La misma clave dos veces seguidas devuelve el mismo gasto | **PASSED** | Claude Code | — |
| CP-NAV-041 | Alta | Dos pedidos simultáneos con la misma clave crean un solo gasto | **PASSED** | Claude Code | — |
| CP-NAV-042 | Alta | Claves distintas con el mismo contenido crean dos gastos | **PASSED** | Claude Code | — |
| CP-NAV-043 | Alta | La misma clave en dos usuarios distintos no se pisa | **PASSED** | Claude Code | — |
| CP-NAV-044 | Alta | La misma clave con otro monto conserva el gasto original | **PASSED** | Claude Code | — |
| CP-NAV-045 | Alta | La misma clave sigue funcionando después de archivar la categoría | **PASSED** | Claude Code | — |
| CP-NAV-046 | Alta | Sin clave, cada llamada crea un gasto distinto | **PASSED** | Claude Code | — |
| CP-NAV-047 | Alta | Si se archiva la categoría antes de guardar, el gasto se rechaza con aviso | **PASSED** | Santiago | — |
| CP-NAV-048 | Alta | La API rechaza un gasto con una categoría archivada | **PASSED** | Claude Code | — |
| CP-NAV-049 | Alta | Al volver a Registrar aparece el gasto pendiente | **PASSED** | Santiago | — |
| CP-NAV-050 | Alta | Al recargar la página sigue el gasto pendiente | **PASSED** | Santiago | — |
| CP-NAV-051 | Alta | Dos gastos fallidos: dos pendientes, el más nuevo primero | **PASSED** | Santiago | — |
| CP-NAV-052 | Alta | Recuperar un gasto en dólares conserva fecha y tipo de cambio | **PASSED** | Santiago | — |
| CP-NAV-053 | Alta | Recuperar un gasto que en realidad ya estaba guardado | **PASSED** | Claude Code | — |
| CP-NAV-054 | Alta | Recuperar un gasto que ya estaba guardado y fue eliminado | **PASSED** | Claude Code | — |
| CP-NAV-055 | Alta | Recuperar sin internet no pierde el pendiente | **PASSED** | Santiago | — |
| CP-NAV-056 | Alta | Descartar borra el pendiente, incluso al recargar | **PASSED** | Santiago | — |
| CP-NAV-057 | Alta | Cerrar sesión borra los pendientes | **PASSED** | Santiago | — |
| CP-NAV-058 | Alta | Recuperar con la categoría archivada deja la categoría vacía | **PASSED** | Santiago | — |
| CP-NAV-059 | Alta | Un pendiente de septiembre se guarda en septiembre | **PASSED** | Santiago | — |
| CP-NAV-060 | Media | Un lector de pantalla (TalkBack) anuncia el error sin mover el foco | **NO EJECUTADO** | — | — |
| CP-NAV-061 | Alta | Tocar dos veces «Guardar» guarda una sola vez | **PASSED** | Santiago | — |
| CP-NAV-062 | Alta | El primer gasto guiado también conserva los datos y ofrece «Reintentar» | **PASSED** | Santiago | — |
| CP-NAV-063 | Media | Identificadores únicos en Resumen (375 px) | **PASSED** | Claude Code | — |
| CP-NAV-064 | Media | Identificadores únicos en Movimientos (375 px) | **PASSED** | Claude Code | — |
| CP-NAV-065 | Media | Identificadores únicos en Deudas (375 px) | **PASSED** | Claude Code | — |
| CP-NAV-066 | Media | Identificadores únicos en Suscripciones (375 px) | **PASSED** | Claude Code | — |
| CP-NAV-067 | Media | Identificadores únicos en Ajustes (375 px) | **PASSED** | Claude Code | — |
| CP-NAV-068 | Media | Identificadores únicos en Resumen (1023 px) | **PASSED** | Claude Code | — |
| CP-NAV-069 | Media | Identificadores únicos en Movimientos (1023 px) | **PASSED** | Claude Code | — |
| CP-NAV-070 | Media | Identificadores únicos en Deudas (1023 px) | **PASSED** | Claude Code | — |
| CP-NAV-071 | Media | Identificadores únicos en Suscripciones (1023 px) | **PASSED** | Claude Code | — |
| CP-NAV-072 | Media | Identificadores únicos en Ajustes (1023 px) | **PASSED** | Claude Code | — |
| CP-NAV-073 | Media | Identificadores únicos en Resumen (1024 px) | **PASSED** | Claude Code | — |
| CP-NAV-074 | Media | Identificadores únicos en Movimientos (1024 px) | **PASSED** | Claude Code | — |
| CP-NAV-075 | Media | Identificadores únicos en Deudas (1024 px) | **PASSED** | Claude Code | — |
| CP-NAV-076 | Media | Identificadores únicos en Suscripciones (1024 px) | **PASSED** | Claude Code | — |
| CP-NAV-077 | Media | Identificadores únicos en Ajustes (1024 px) | **PASSED** | Claude Code | — |
| CP-NAV-078 | Media | Identificadores únicos en Resumen (1280 px) | **PASSED** | Claude Code | — |
| CP-NAV-079 | Media | Identificadores únicos en Movimientos (1280 px) | **PASSED** | Claude Code | — |
| CP-NAV-080 | Media | Identificadores únicos en Deudas (1280 px) | **PASSED** | Claude Code | — |
| CP-NAV-081 | Media | Identificadores únicos en Suscripciones (1280 px) | **PASSED** | Claude Code | — |
| CP-NAV-082 | Media | Identificadores únicos en Ajustes (1280 px) | **PASSED** | Claude Code | — |
| CP-NAV-083 | Alta | La API devuelve un solo gasto activo para la clave recuperada | **PASSED** | Claude Code | — |
| CP-NAV-084 | Alta | La API conserva un solo gasto eliminado para la clave recuperada | **FAILED** | Claude Code | DEF-029 |
| CP-NAV-085 | Alta | La API confirma la clave del gasto reintentado por pantalla | **PASSED** | Claude Code | — |
| CP-EXP-001 | Media | Una URL válida fija septiembre 2026 | **PASSED** | Claude Code | — |
| CP-EXP-002 | Media | Sin period se usa octubre 2026 | **PASSED** | Claude Code | — |
| CP-EXP-003 | Media | Cancelar desde Vacío cierra sin descargar | **PASSED** | Claude Code | — |
| CP-EXP-004 | Media | El mes actual permite exportar sin aviso | **PASSED** | Claude Code | — |
| CP-EXP-005 | Media | El mes anterior permite exportar sin aviso | **PASSED** | Claude Code | — |
| CP-EXP-006 | Alta | El mes siguiente está bloqueado | **PASSED** | Claude Code | — |
| CP-EXP-007 | Alta | El alcance mensual propone el nombre 2026-09 | **PASSED** | Claude Code | — |
| CP-EXP-008 | Alta | El alcance anual propone el nombre 2025 | **PASSED** | Claude Code | — |
| CP-EXP-009 | Alta | El primer día del mes se incluye | **PASSED** | Claude Code | — |
| CP-EXP-010 | Alta | El último día del mes se incluye | **PASSED** | Claude Code | — |
| CP-EXP-011 | Alta | El día anterior al mes se excluye | **PASSED** | Claude Code | — |
| CP-EXP-012 | Alta | El día posterior al mes se excluye | **PASSED** | Claude Code | — |
| CP-EXP-013 | Alta | El 1 de enero se incluye en el año | **PASSED** | Claude Code | — |
| CP-EXP-014 | Alta | El 31 de diciembre se incluye en el año | **PASSED** | Claude Code | — |
| CP-EXP-015 | Alta | El día anterior al año se excluye | **PASSED** | Claude Code | — |
| CP-EXP-016 | Alta | El día posterior al año se excluye | **PASSED** | Claude Code | — |
| CP-EXP-017 | Alta | Una transacción eliminada queda fuera | **PASSED** | Claude Code | — |
| CP-EXP-018 | Alta | Una transacción restaurada vuelve a exportarse | **PASSED** | Claude Code | — |
| CP-EXP-019 | Alta | El filtro Eliminados no cambia los bytes | **PASSED** | Claude Code | — |
| CP-EXP-020 | Alta | El archivo comienza con BOM UTF-8 | **PASSED** | Claude Code | — |
| CP-EXP-021 | Alta | El encabezado tiene doce columnas exactas | **PASSED** | Claude Code | — |
| CP-EXP-022 | Alta | Cada fila termina en CRLF incluida la última | **PASSED** | Claude Code | — |
| CP-EXP-023 | Alta | Doce cuotas salen en una sola fila por el total | **PASSED** | Claude Code | — |
| CP-EXP-024 | Alta | Un mes con solo cuota heredada produce Vacío | **PASSED** | Claude Code | — |
| CP-EXP-025 | Alta | ARS se escribe con dos decimales exactos | **PASSED** | Claude Code | — |
| CP-EXP-026 | Alta | USD conserva cuatro decimales de TC | **PASSED** | Claude Code | — |
| CP-EXP-027 | Alta | Cambiar la referencia no recalcula el histórico | **PASSED** | Claude Code | — |
| CP-EXP-028 | Alta | Una coma obliga a entrecomillar la descripción | **PASSED** | Claude Code | — |
| CP-EXP-029 | Alta | Las comillas internas se duplican | **PASSED** | Claude Code | — |
| CP-EXP-030 | Alta | Un LF queda dentro de un campo citado | **DUDA** | Claude Code | — |
| CP-EXP-031 | Alta | Descripción con igual se neutraliza | **PASSED** | Claude Code | — |
| CP-EXP-032 | Alta | Descripción con más se neutraliza | **PASSED** | Claude Code | — |
| CP-EXP-033 | Alta | Descripción con menos se neutraliza | **PASSED** | Claude Code | — |
| CP-EXP-034 | Alta | Descripción con arroba se neutraliza | **PASSED** | Claude Code | — |
| CP-EXP-035 | Alta | Descripción con tabulación se neutraliza | **PASSED** | Claude Code | — |
| CP-EXP-036 | Alta | Descripción con retorno de carro se neutraliza | **PASSED** | Claude Code | — |
| CP-EXP-037 | Alta | Una categoría que empieza con igual se neutraliza | **PASSED** | Claude Code | — |
| CP-EXP-038 | Alta | Una cuenta que empieza con arroba se neutraliza | **PASSED** | Claude Code | — |
| CP-EXP-039 | Media | Las filas se ordenan por fecha y creación | **PASSED** | Claude Code | — |
| CP-EXP-040 | Alta | 1.000 transacciones se exportan sin faltantes | **PASSED** | Claude Code | — |
| CP-EXP-041 | Alta | 1.500 transacciones se exportan sin faltantes | **PASSED** | Claude Code | — |
| CP-EXP-042 | Alta | 2.000 transacciones se exportan sin faltantes | **PASSED** | Claude Code | — |
| CP-EXP-043 | Alta | El CSV de A no contiene movimientos de B | **PASSED** | Claude Code | — |
| CP-EXP-044 | Alta | La API con token de A devuelve cero filas de B | **PASSED** | Claude Code | — |
| CP-EXP-045 | Media | Categoría archivada sale con el nombre actual | **PASSED** | Claude Code | — |
| CP-EXP-046 | Media | Cuenta archivada sale con el nombre actual | **PASSED** | Claude Code | — |
| CP-EXP-047 | Media | Un ingreso exporta categoría vacía | **PASSED** | Claude Code | — |
| CP-EXP-048 | Alta | Eliminar una cuenta quita su transacción | **PASSED** | Claude Code | — |
| CP-EXP-049 | Alta | Descargar muestra Exportando y aria-busy | **PASSED** | Claude Code | — |
| CP-EXP-050 | Alta | Los controles quedan bloqueados al exportar | **PASSED** | Claude Code | — |
| CP-EXP-051 | Alta | Un doble click inicia una sola descarga | **PASSED** | Claude Code | — |
| CP-EXP-052 | Media | Una fila usa singular y cierra la hoja | **PASSED** | Claude Code | — |
| CP-EXP-053 | Media | Dos filas usan plural | **PASSED** | Claude Code | — |
| CP-EXP-054 | Media | Un mes sin transacciones muestra Vacío | **PASSED** | Claude Code | — |
| CP-EXP-055 | Media | Un año sin transacciones muestra Vacío anual | **PASSED** | Claude Code | — |
| CP-EXP-056 | Alta | Un período con solo eliminadas muestra Vacío | **PASSED** | Claude Code | — |
| CP-EXP-057 | Alta | Offline muestra el error exacto | **PASSED** | Claude Code | — |
| CP-EXP-058 | Alta | El reintento después de Offline descarga completo | **PASSED** | Claude Code | — |
| CP-EXP-059 | Media | Cancelar desde Error cierra sin descargar | **PASSED** | Claude Code | — |
| CP-EXP-060 | Baja | Cancelar cierra sin descargar | **PASSED** | Claude Code | — |
| CP-EXP-061 | Baja | Escape cierra sin descargar | **PASSED** | Claude Code | — |
| CP-EXP-062 | Baja | Tocar fuera cierra sin descargar | **FAILED** | Claude Code | DEF-030 |
| CP-EXP-063 | Media | Atrás cierra la hoja inicial | **FAILED** | Claude Code | DEF-031 |
| CP-EXP-064 | Alta | Atrás durante Exportando cancela la descarga | **FAILED** | Claude Code | DEF-032 |
| CP-EXP-065 | Media | Adelante cierra la hoja inicial | **FAILED** | Claude Code | DEF-031 |
| CP-EXP-066 | Media | Salir a Resumen cierra la hoja | **PASSED** | Claude Code | — |
| CP-EXP-067 | Alta | Exportar no modifica datos ni período | **PASSED** | Claude Code | — |
| CP-EXP-068 | Alta | Una alta concurrente impide descargar un año incompleto | **PASSED** | Claude Code | — |
| CP-EXP-069 | Alta | Escape no cierra la hoja durante Exportando | **PASSED** | Claude Code | — |
| CP-EXP-070 | Alta | Tocar fuera no cierra la hoja durante Exportando | **PASSED** | Claude Code | DEF-030 |
| CP-EXP-071 | Alta | Un lector RFC 4180 obtiene doce columnas | **DUDA** | Claude Code | — |
| CP-EXP-072 | Alta | Exportar no modifica el total de Resumen | **PASSED** | Claude Code | — |
| CP-EXP-073 | Alta | HTTP 500 muestra Error y no descarga | **PASSED** | Claude Code | — |
| CP-EXP-074 | Alta | Un monto textual inválido cancela la descarga | **PASSED** | Claude Code | — |
| CP-EXP-075 | Media | Cambiar el alcance borra el mensaje de Error | **PASSED** | Claude Code | — |
| CP-IMP-001 | Media | El acceso desde Registrar abre el paso Archivo | **PASSED** | Claude Code | — |
| CP-IMP-002 | Alta | La ruta privada sin sesión conserva next=/import | **PASSED** | Claude Code | — |
| CP-IMP-003 | Media | La plantilla descargada tiene diez columnas y la instrucción de cuotas pendientes | **BLOCKED** | Claude Code | — |
| CP-IMP-004 | Media | Subir la plantilla vacía muestra A6 | **PASSED** | Claude Code | — |
| CP-IMP-005 | Media | A1 rechaza la extensión .xls | **PASSED** | Claude Code | — |
| CP-IMP-006 | Media | A2 rechaza 1.048.577 bytes | **PASSED** | Claude Code | — |
| CP-IMP-007 | Media | A3 rechaza un archivo dañado con extensión xlsx | **PASSED** | Claude Code | — |
| CP-IMP-008 | Media | A4 enumera tres encabezados obligatorios faltantes | **PASSED** | Claude Code | — |
| CP-IMP-009 | Media | A5 rechaza un encabezado repetido | **PASSED** | Claude Code | — |
| CP-IMP-010 | Media | A6 rechaza filas completamente vacías | **PASSED** | Claude Code | — |
| CP-IMP-011 | Media | A7 rechaza 501 filas con datos | **PASSED** | Claude Code | — |
| CP-IMP-012 | Media | El límite de tamaño acepta exactamente 1.048.576 bytes | **DUDA** | Claude Code | — |
| CP-IMP-013 | Media | Un byte sobre el límite de tamaño muestra A2 | **PASSED** | Claude Code | — |
| CP-IMP-014 | Media | El límite de filas acepta exactamente 500 | **PASSED** | Claude Code | — |
| CP-IMP-015 | Media | Una fila sobre el límite muestra A7 con 501 | **PASSED** | Claude Code | — |
| CP-IMP-016 | Media | Solo se lee la primera hoja | **PASSED** | Claude Code | — |
| CP-IMP-017 | Media | Los encabezados aceptan orden, mayúsculas, espacios y tildes distintos | **PASSED** | Claude Code | — |
| CP-IMP-018 | Media | Una columna desconocida se ignora y se informa | **BLOCKED** | Claude Code | — |
| CP-IMP-019 | Media | Un archivo ARS sin columnas opcionales deja la fila lista | **PASSED** | Claude Code | — |
| CP-IMP-020 | Media | Sin columna Categoría un gasto muestra F14a | **PASSED** | Claude Code | — |
| CP-IMP-021 | Media | El archivo de ejemplo conserva números de fila y omite la fila vacía 12 | **PASSED** | Claude Code | — |
| CP-IMP-022 | Media | F1: fecha vacía | **PASSED** | Claude Code | — |
| CP-IMP-023 | Media | F2: fecha inexistente | **PASSED** | Claude Code | — |
| CP-IMP-024 | Media | F3: fecha futura fija | **PASSED** | Claude Code | — |
| CP-IMP-025 | Media | F4: tipo vacío | **PASSED** | Claude Code | — |
| CP-IMP-026 | Media | F5: tipo inválido | **PASSED** | Claude Code | — |
| CP-IMP-027 | Media | F6: monto vacío | **PASSED** | Claude Code | — |
| CP-IMP-028 | Media | F7: monto no numérico | **PASSED** | Claude Code | — |
| CP-IMP-029 | Alta | F8: monto cero | **PASSED** | Claude Code | — |
| CP-IMP-030 | Media | F9: monto con tres decimales | **PASSED** | Claude Code | — |
| CP-IMP-031 | Alta | F10: monto sobre el máximo | **PASSED** | Claude Code | — |
| CP-IMP-032 | Media | F11: moneda vacía | **PASSED** | Claude Code | — |
| CP-IMP-033 | Media | F12: moneda EUR | **PASSED** | Claude Code | — |
| CP-IMP-034 | Media | F13a: USD sin tipo de cambio | **PASSED** | Claude Code | — |
| CP-IMP-035 | Media | F13b: ARS con tipo de cambio | **PASSED** | Claude Code | — |
| CP-IMP-036 | Media | F13c: tipo de cambio cero | **PASSED** | Claude Code | — |
| CP-IMP-037 | Media | F13d: tipo de cambio con cinco decimales | **PASSED** | Claude Code | — |
| CP-IMP-038 | Media | F13e: tipo de cambio sobre el máximo | **PASSED** | Claude Code | — |
| CP-IMP-039 | Media | F14a: gasto sin categoría | **PASSED** | Claude Code | — |
| CP-IMP-040 | Media | F14b: categoría inexistente | **PASSED** | Claude Code | — |
| CP-IMP-041 | Media | F14c: cuenta vacía | **PASSED** | Claude Code | — |
| CP-IMP-042 | Media | F14d: cuenta inexistente | **PASSED** | Claude Code | — |
| CP-IMP-043 | Media | F14e: trece cuotas | **PASSED** | Claude Code | — |
| CP-IMP-044 | Media | F15: cuotas en cuenta no crédito | **PASSED** | Claude Code | — |
| CP-IMP-045 | Alta | F16: equivalente ARS sobre el máximo | **PASSED** | Claude Code | — |
| CP-IMP-046 | Alta | F17: cuota base menor a un centavo | **PASSED** | Claude Code | — |
| CP-IMP-047 | Alta | F18: equivalente ARS menor a un centavo | **PASSED** | Claude Code | — |
| CP-IMP-048 | Media | Errores de varias columnas conservan el orden de reglas | **PASSED** | Claude Code | — |
| CP-IMP-049 | Media | Moneda inválida oculta el error dependiente de tipo de cambio | **PASSED** | Claude Code | — |
| CP-IMP-050 | Media | Tipo inválido oculta categoría obligatoria | **PASSED** | Claude Code | — |
| CP-IMP-051 | Media | Cuenta inválida oculta la regla de cuotas | **PASSED** | Claude Code | — |
| CP-IMP-052 | Media | Nombres, tipo y moneda aceptan espacios y mayúsculas | **FAILED** | Claude Code | DEF-033 |
| CP-IMP-053 | Media | Una categoría sin tilde no coincide con Educación | **PASSED** | Claude Code | — |
| CP-IMP-054 | Media | Categoría archivada no se acepta aunque el nombre coincida | **PASSED** | Claude Code | — |
| CP-IMP-055 | Media | La fecha exacta del día de Argentina queda lista | **PASSED** | Claude Code | — |
| CP-IMP-056 | Media | El día siguiente de Argentina muestra F3 | **PASSED** | Claude Code | — |
| CP-IMP-057 | Media | Una celda de fecha con hora usa solo el día | **PASSED** | Claude Code | — |
| CP-IMP-058 | Media | Un serial numérico sin formato de fecha muestra F2 | **PASSED** | Claude Code | — |
| CP-IMP-059 | Media | El texto 1.500 se interpreta como mil quinientos | **PASSED** | Claude Code | — |
| CP-IMP-060 | Media | El texto 1234.56 se interpreta con dos decimales | **PASSED** | Claude Code | — |
| CP-IMP-061 | Media | La fórmula 0,1 por 3 se redondea a quince dígitos | **PASSED** | Claude Code | — |
| CP-IMP-062 | Media | La fórmula 100 dividido 3 muestra F9 | **PASSED** | Claude Code | — |
| CP-IMP-063 | Alta | El resumen del archivo de ejemplo suma solo las siete filas listas | **PASSED** | Claude Code | — |
| CP-IMP-064 | Media | El filtro muestra solo las cuatro filas con error | **PASSED** | Claude Code | — |
| CP-IMP-065 | Media | El filtro está deshabilitado cuando no hay errores | **PASSED** | Claude Code | — |
| CP-IMP-066 | Alta | Elegir otro archivo no persiste filas revisadas | **PASSED** | Claude Code | — |
| CP-IMP-067 | Alta | Recargar en Revisión vuelve a Archivo sin persistir | **PASSED** | Claude Code | — |
| CP-IMP-068 | Media | Cero filas listas deshabilita Importar 0 movimientos | **PASSED** | Claude Code | — |
| CP-IMP-069 | Media | Una fila lista usa los plurales singulares | **PASSED** | Claude Code | — |
| CP-IMP-070 | Alta | Confirmar importa solo las filas listas con todos sus campos | **PASSED** | Claude Code | — |
| CP-IMP-071 | Alta | Una nota vacía se guarda como descripción nula | **PASSED** | Claude Code | — |
| CP-IMP-072 | Alta | La compra de 240.000 en seis cuotas crea seis imputaciones exactas | **PASSED** | Claude Code | — |
| CP-IMP-073 | Alta | El archivo de ejemplo produce el resultado y destino exactos | **PASSED** | Claude Code | — |
| CP-IMP-074 | Alta | Un rechazo tardío de categoría no impide las otras filas | **PASSED** | Claude Code | — |
| CP-IMP-075 | Alta | Importar no cambia la cuenta precargada de Registrar | **PASSED** | Claude Code | — |
| CP-IMP-076 | Alta | Quinientas filas de doce cuotas terminan en menos de diez segundos | **PASSED** | Claude Code | — |
| CP-IMP-077 | Alta | La RPC procesa una válida y rechaza tres inválidas | **PASSED** | Claude Code | — |
| CP-IMP-078 | Alta | La RPC rechaza un lote vacío | **PASSED** | Claude Code | — |
| CP-IMP-079 | Alta | La RPC rechaza un lote de 501 elementos | **PASSED** | Claude Code | — |
| CP-IMP-080 | Alta | El rol anon no puede ejecutar import_transactions | **PASSED** | Claude Code | — |
| CP-IMP-081 | Alta | Otro usuario no ve transacciones ni imports ajenos | **PASSED** | Claude Code | — |
| CP-IMP-082 | Alta | Dos clicks rápidos generan una sola llamada y transacción | **BLOCKED** | Claude Code | — |
| CP-IMP-083 | Alta | Reintento tras respuesta perdida reconoce lo guardado | **PASSED** | Claude Code | — |
| CP-IMP-084 | Alta | Reintento tras corte previo al envío importa una sola vez | **PASSED** | Claude Code | — |
| CP-IMP-085 | Alta | Dos llamadas API con el mismo import_id son idempotentes | **PASSED** | Claude Code | — |
| CP-IMP-086 | Alta | Sin respuesta conserva Revisión | **PASSED** | Claude Code | — |
| CP-IMP-087 | Alta | Sesión vencida ofrece volver a entrar | **PASSED** | Claude Code | — |
| CP-IMP-088 | Alta | Timeout de base informa lote grande | **PASSED** | Claude Code | — |
| CP-IMP-089 | Alta | Otro error usa mensaje genérico | **PASSED** | Claude Code | — |
| CP-IMP-090 | Alta | Quedarme conserva el estado pendiente | **PASSED** | Claude Code | — |
| CP-IMP-091 | Alta | Salir igual navega al destino solicitado | **PASSED** | Claude Code | — |
| CP-IMP-092 | Alta | Recargar con importación incierta muestra aviso nativo | **PASSED** | Claude Code | — |
| CP-IMP-093 | Alta | Compra empezada conserva solo tres cuotas desde H | **BLOCKED** | Claude Code | — |
| CP-IMP-094 | Alta | Movimientos muestra 4/6 a 6/6 solo desde H | **BLOCKED** | Claude Code | — |
| CP-IMP-095 | Alta | El resto queda en la última cuota pendiente | **BLOCKED** | Claude Code | — |
| CP-IMP-096 | Alta | P igual a N desplaza todas las cuotas a H | **BLOCKED** | Claude Code | — |
| CP-IMP-097 | Alta | Cuotas pendientes vacía conserva calendario normal | **DUDA** | Claude Code | — |
| CP-IMP-098 | Alta | Sin columna Cuotas pendientes conserva calendario normal | **DUDA** | Claude Code | — |
| CP-IMP-099 | Alta | F19 con Cuotas vacía | **BLOCKED** | Claude Code | — |
| CP-IMP-100 | Alta | F19 con Cuotas igual a uno | **BLOCKED** | Claude Code | — |
| CP-IMP-101 | Alta | F20 con pendientes cero | **BLOCKED** | Claude Code | — |
| CP-IMP-102 | Alta | F20 con pendientes menos uno | **BLOCKED** | Claude Code | — |
| CP-IMP-103 | Alta | F20 con pendientes siete | **BLOCKED** | Claude Code | — |
| CP-IMP-104 | Alta | F20 con pendientes decimal | **BLOCKED** | Claude Code | — |
| CP-IMP-105 | Alta | F20 con pendientes textual | **BLOCKED** | Claude Code | — |
| CP-IMP-106 | Alta | F20 acepta el mínimo pendiente uno | **BLOCKED** | Claude Code | — |
| CP-IMP-107 | Alta | F20 acepta el máximo pendiente seis | **BLOCKED** | Claude Code | — |
| CP-IMP-108 | Alta | F21 acepta K igual a meses transcurridos | **BLOCKED** | Claude Code | — |
| CP-IMP-109 | Alta | F21 rechaza K un mes sobre lo posible | **BLOCKED** | Claude Code | — |
| CP-IMP-110 | Alta | F21 usa singular para una cuota pagada imposible | **BLOCKED** | Claude Code | — |
| CP-IMP-111 | Alta | F15 oculta F20 con cuenta Efectivo | **DUDA** | Claude Code | — |
| CP-IMP-112 | Alta | F14e oculta reglas de cuotas pendientes | **DUDA** | Claude Code | — |
| CP-IMP-113 | Alta | USD sin resto conserva solo la cuota 3/3 | **BLOCKED** | Claude Code | — |
| CP-IMP-114 | Alta | USD con resto reparte ARS exacto entre dos cuotas | **BLOCKED** | Claude Code | — |
| CP-IMP-115 | Alta | Paso 2 y Resultado muestran el mismo saldo pendiente | **BLOCKED** | Claude Code | — |
| CP-IMP-116 | Alta | Resumen cuenta la cuota heredada de una compra empezada | **BLOCKED** | Claude Code | — |
| CP-IMP-117 | Alta | Borrado enumera solo imputaciones guardadas no cerradas | **BLOCKED** | Claude Code | — |
| CP-IMP-118 | Alta | installments_paid igual al total se rechaza | **BLOCKED** | Claude Code | — |
| CP-IMP-119 | Alta | installments_paid negativo se rechaza | **BLOCKED** | Claude Code | — |
| CP-IMP-120 | Alta | installments_paid en una cuota se rechaza | **BLOCKED** | Claude Code | — |
| CP-IMP-121 | Alta | Una cuota pagada con fecha de hoy se rechaza | **BLOCKED** | Claude Code | — |
| CP-IMP-122 | Alta | Compra empezada compartida se rechaza | **BLOCKED** | Claude Code | — |
| CP-IMP-123 | Alta | installments_paid decimal se rechaza por tipo | **BLOCKED** | Claude Code | — |
| CP-IMP-124 | Alta | import_transactions rechaza una installments_paid inválida y continúa | **BLOCKED** | Claude Code | — |
| CP-IMP-125 | Alta | installments_paid null crea una compra normal | **BLOCKED** | Claude Code | — |
| CP-IMP-126 | Alta | installments_paid ausente crea una compra normal | **DUDA** | Claude Code | — |
| CP-IMP-127 | Media | La guía está cerrada por defecto | **BLOCKED** | Claude Code | — |
| CP-IMP-128 | Media | Recargar y volver a entrar no abre la guía | **BLOCKED** | Claude Code | — |
| CP-IMP-129 | Media | La guía muestra todo el contenido exacto | **BLOCKED** | Claude Code | — |
| CP-IMP-130 | Media | Cerrar con Entendido devuelve el foco | **BLOCKED** | Claude Code | — |
| CP-IMP-131 | Media | Cerrar con el botón cerrar devuelve el foco | **BLOCKED** | Claude Code | — |
| CP-IMP-132 | Media | Cerrar con Escape devuelve el foco | **BLOCKED** | Claude Code | — |
| CP-IMP-133 | Media | Cerrar con un click exterior devuelve el foco | **BLOCKED** | Claude Code | — |
| CP-IMP-134 | Media | El foco inicial va a Cerrar guía | **BLOCKED** | Claude Code | — |
| CP-IMP-135 | Media | Tab y Shift+Tab quedan atrapados en el diálogo | **BLOCKED** | Claude Code | — |
| CP-IMP-136 | Media | Descargar plantilla desde la guía produce el mismo libro | **BLOCKED** | Claude Code | — |
| CP-IMP-137 | Alta | Se puede importar sin abrir la guía | **DUDA** | Claude Code | — |
| CP-IMP-138 | Media | Abrir y cerrar la guía conserva archivo, resumen, filtro y URL | **BLOCKED** | Claude Code | — |
| CP-IMP-139 | Media | El botón de guía no existe en Resultado | **DUDA** | Claude Code | — |
| CP-IMP-140 | Media | El botón de guía se deshabilita mientras importa | **BLOCKED** | Claude Code | — |
| CP-IMP-141 | Media | La guía móvil mantiene márgenes y scroll interno | **BLOCKED** | Claude Code | — |
| CP-IMP-142 | Media | Cuenta archivada no se acepta aunque el nombre coincida | **PASSED** | Claude Code | — |
| CP-IMP-143 | Alta | Elegir otro archivo durante un estado incierto pide confirmación | **PASSED** | Claude Code | — |
| CP-IMP-144 | Alta | Una fila que falla después del alta no deja transacción sin imputaciones | **PASSED** | Claude Code | — |
| CP-SUS-001 | Alta | Dar de alta una suscripción en ARS desde hace 2 meses con día de cobro 10 genera los 2 gastos vencidos al guardar | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-002 | Media | Dar de alta una suscripción en ARS desde el mes siguiente no genera gastos al guardar | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-003 | Media | Dar de alta una suscripción con Monto en el límite inferior válido (`"0,01"`) se acepta | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-004 | Media | Dar de alta una suscripción en ARS con Monto en el límite superior válido (`"999999999999,99"`) se acepta | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-005 | Media | Dar de alta una suscripción con Día de cobro en el límite inferior `"01"` se guarda como `"1"` | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-006 | Media | Dar de alta una suscripción con Día de cobro en el límite superior `"31"` se acepta | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-007 | Media | Dar de alta una suscripción con Mes de inicio en el límite inferior (`-24` meses) y Mes de fin igual al de inicio genera exactamente 1 ocurrencia | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-008 | Media | Dar de alta una suscripción con Mes de inicio en el límite superior (`+12` meses) se acepta sin generar gastos | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-009 | Baja | Dar de alta una suscripción con Mes de fin en el límite superior válido (`"2099-12"`) se acepta | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-010 | Media | Dar de alta una suscripción con Nombre de 60 caracteres se acepta y el campo no deja escribir el carácter 61 | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-011 | Baja | Dar de alta una suscripción con espacios en los bordes del Nombre (`"  Netflix  "`) la guarda como `"Netflix"` | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-012 | Media | Dar de alta una suscripción con el mismo nombre que una suscripción cancelada se acepta | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-013 | Media | Rechazar en UI el alta de suscripción con Nombre vacío o solo espacios | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-014 | Media | Rechazar en API `create_subscription` con Nombre vacío o solo espacios | **PASSED** | Claude Code | — |
| CP-SUS-015 | Media | Rechazar en API `create_subscription` con Nombre de 61 caracteres | **PASSED** | Claude Code | — |
| CP-SUS-016 | Alta | Rechazar en UI el alta de suscripción con Nombre igual al de otra activa sin distinguir mayúsculas ni espacios (`" netflix "`) | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-017 | Alta | Rechazar en API `create_subscription` con Nombre igual al de otra activa (`" netflix "`) | **PASSED** | Claude Code | — |
| CP-SUS-018 | Alta | Rechazar en UI el alta de suscripción con Nombre igual al de una suscripción pausada | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-019 | Alta | Rechazar en API `create_subscription` con Nombre igual al de una suscripción pausada | **PASSED** | Claude Code | — |
| CP-SUS-020 | Alta | Rechazar en UI el alta de suscripción con Monto vacío | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-021 | Alta | Rechazar en API `create_subscription` con `p_amount = null` | **PASSED** | Claude Code | — |
| CP-SUS-022 | Alta | Rechazar en UI el alta de suscripción con Monto igual a `"0"` | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-023 | Alta | Rechazar en API `create_subscription` con `p_amount = "0.00"` | **PASSED** | Claude Code | — |
| CP-SUS-024 | Alta | Rechazar en UI el alta de suscripción con Monto negativo (`"-100"`) | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-025 | Alta | Rechazar en API `create_subscription` con Monto negativo (`p_amount = "-100.00"`) | **PASSED** | Claude Code | — |
| CP-SUS-026 | Media | Rechazar en UI el alta de suscripción con Monto de más de 2 decimales (`"100,123"`) | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-027 | Media | Rechazar en API `create_subscription` con Monto de más de 2 decimales (`"100.123"`) | **PASSED** | Claude Code | — |
| CP-SUS-028 | Media | Rechazar en UI el alta de suscripción en ARS con Monto mayor al máximo (`"1000000000000"`) | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-029 | Media | Rechazar en API `create_subscription` en ARS con Monto mayor al máximo (`"1000000000000.00"`) | **PASSED** | Claude Code | — |
| CP-SUS-030 | Media | Rechazar en UI el alta de suscripción en USD con Monto mayor al máximo (`"1000000000000"`) | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-031 | Media | Rechazar en API `create_subscription` en USD con Monto mayor al máximo (`"1000000000000.00"`) | **PASSED** | Claude Code | — |
| CP-SUS-032 | Media | Rechazar en UI el alta de suscripción sin elegir Categoría | **PASSED** | Claude Code | — |
| CP-SUS-033 | Media | Rechazar en API `create_subscription` con `p_category_id = null` | **PASSED** | Claude Code | — |
| CP-SUS-034 | Media | Rechazar en UI el alta de suscripción sin elegir Medio de pago | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-035 | Media | Rechazar en API `create_subscription` con `p_account_id = null` | **PASSED** | Claude Code | — |
| CP-SUS-036 | Media | Rechazar en UI el alta de suscripción con Día de cobro vacío | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-037 | Media | Rechazar en API `create_subscription` con `p_billing_day = null` | **PASSED** | Claude Code | — |
| CP-SUS-038 | Media | Rechazar en UI el alta de suscripción con Día de cobro `"0"` | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-039 | Media | Rechazar en API `create_subscription` con `p_billing_day = 0` | **PASSED** | Claude Code | — |
| CP-SUS-040 | Media | Rechazar en UI el alta de suscripción con Día de cobro `"32"` | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-041 | Media | Rechazar en API `create_subscription` con `p_billing_day = 32` | **PASSED** | Claude Code | — |
| CP-SUS-042 | Baja | Bloquear en UI la escritura de letras, coma y signo menos en Día de cobro | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-043 | Media | Rechazar en API `create_subscription` con Día de cobro no entero (`p_billing_day = 1.5`) | **PASSED** | Claude Code | — |
| CP-SUS-044 | Media | Rechazar en UI el alta de suscripción con Mes de inicio vacío | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-045 | Media | Rechazar en API `create_subscription` con `p_start_period = null` | **PASSED** | Claude Code | — |
| CP-SUS-046 | Media | Rechazar en UI el alta de suscripción con Mes de inicio anterior al límite inferior (`-25` meses) | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-047 | Media | Rechazar en API `create_subscription` con Mes de inicio anterior al límite inferior (`-25` meses) | **PASSED** | Claude Code | — |
| CP-SUS-048 | Media | Rechazar en UI el alta de suscripción con Mes de inicio posterior al límite superior (`+13` meses) | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-049 | Media | Rechazar en API `create_subscription` con Mes de inicio posterior al límite superior (`+13` meses) | **PASSED** | Claude Code | — |
| CP-SUS-050 | Media | Rechazar en UI el alta de suscripción con Mes de fin anterior al Mes de inicio | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-051 | Media | Rechazar en API `create_subscription` con `p_end_period < p_start_period` | **PASSED** | Claude Code | — |
| CP-SUS-052 | Baja | Rechazar en UI el alta de suscripción con Mes de fin posterior a diciembre 2099 (`"2100-01"`) | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-053 | Baja | Rechazar en API `create_subscription` con `p_end_period = "2100-01-01"` | **PASSED** | Claude Code | — |
| CP-SUS-054 | Baja | Dar de alta una suscripción con Descripción de 200 caracteres se acepta y la UI recorta el carácter 201 | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-055 | Baja | Rechazar en API `create_subscription` con Descripción de 201 caracteres | **PASSED** | Claude Code | — |
| CP-SUS-056 | Media | Rechazar en API `create_subscription` con `p_category_id` propia archivada | **PASSED** | Claude Code | — |
| CP-SUS-057 | Media | Rechazar en API `create_subscription` con `p_account_id` propia archivada | **PASSED** | Claude Code | — |
| CP-SUS-058 | Alta | Rechazar en API `create_subscription` usando `p_category_id` de otro usuario | **PASSED** | Claude Code | — |
| CP-SUS-059 | Alta | Rechazar en API `create_subscription` usando `p_account_id` de otro usuario | **PASSED** | Claude Code | — |
| CP-SUS-060 | Alta | Rechazar en API un `INSERT` directo sobre `/rest/v1/subscriptions` con la sesión del usuario | **PASSED** | Claude Code | — |
| CP-SUS-061 | Alta | Rechazar en API un `DELETE` directo sobre `/rest/v1/subscriptions` con la sesión del usuario | **PASSED** | Claude Code | — |
| CP-SUS-062 | Media | Dos toques seguidos en `"Guardar suscripción"` deshabilitan el botón y crean una sola suscripción | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-063 | Alta | Rechazar en UI ver el detalle de una suscripción de otro usuario mostrando `subscription-detail-not-found` | **PASSED** | Claude Code | — |
| CP-SUS-064 | Alta | Rechazar en API leer una suscripción de otro usuario (`GET /rest/v1/subscriptions` devuelve `[]`) | **PASSED** | Claude Code | — |
| CP-SUS-065 | Alta | Rechazar en API `create_subscription` sin sesión autenticada (rol `anon`) | **FAILED** | Claude Code | DEF-035 |
| CP-SUS-066 | Alta | Rechazar en API `GET /rest/v1/subscriptions` sin sesión autenticada (rol `anon`) | **FAILED** | Claude Code | DEF-035 |
| CP-SUS-067 | Baja | Mostrar estado vacío `subscriptions-empty` y ocultar la tarjeta del total comprometido cuando el usuario no tiene suscripciones | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-068 | Baja | Mostrar aviso `subscription-form-category-empty` y enlace `"Ir a Ajustes"` cuando el usuario no tiene categorías activas | **PASSED** | Claude Code | — |
| CP-SUS-069 | Baja | Mostrar aviso `subscription-form-account-empty` y enlace `"Ir a Ajustes"` cuando el usuario no tiene medios de pago activos | **PASSED** | Claude Code | — |
| CP-SUS-070 | Alta | Puesta al día automática al entrar a la app genera 2 períodos vencidos pendientes y muestra el aviso `app-catchup-generated` | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-071 | Alta | Recargar la página y navegar entre pestañas con las suscripciones al día no crea transacciones nuevas ni muestra `app-catchup-generated` | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-072 | Alta | Dos llamadas consecutivas por API a `run_subscription_catchup` responden `200 OK` sin error y dejan exactamente 1 transacción por período | **PASSED** | Claude Code | — |
| CP-SUS-073 | Media | `run_subscription_catchup` sigue generando ocurrencias aunque la categoría y el medio de pago se hayan archivado después del alta | **PASSED** | Claude Code | — |
| CP-SUS-074 | Alta | Suscripción en estado `paused` no genera ocurrencias al ejecutar `run_subscription_catchup` | **PASSED** | Claude Code | — |
| CP-SUS-075 | Alta | Suscripción en estado `cancelled` no genera ocurrencias al ejecutar `run_subscription_catchup` | **PASSED** | Claude Code | — |
| CP-SUS-076 | Alta | Dar de alta una suscripción con rango cerrado en el pasado (`<MES_HACE_4>` a `<MES_HACE_2>`) genera exactamente esos 3 meses y muestra `"Terminó en <mes hace 2>"` | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-077 | Alta | Suscripción en USD cuyo monto en pesos supera `$999.999.999.999,99` queda bloqueada con `"No se pudo cargar"` sin frenar otra suscripción activa ni mostrar `app-catchup-error` | **PASSED** | Claude Code | — |
| CP-SUS-078 | Alta | Suscripción con día de cobro `31` entre `2026-01` y `2026-04` genera ocurrencias con fechas `31/01/2026`, `28/02/2026`, `31/03/2026` y `30/04/2026` | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-079 | Media | Suscripción con día de cobro `29` en febrero de año no bisiesto (`2026-02`) genera la ocurrencia con fecha `28/02/2026` | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-080 | Media | Suscripción con día de cobro `30` en febrero de año no bisiesto (`2026-02`) genera la ocurrencia con fecha `28/02/2026` | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-081 | Alta | Suscripción con día de cobro `<DIA_MAÑANA>` no genera la ocurrencia del mes corriente | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-082 | Alta | Suscripción con día de cobro igual a `<DIA_HOY>` genera la ocurrencia del mes corriente | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-083 | Alta | Suscripción con día de cobro `<DIA_AYER>` genera la ocurrencia del mes corriente con fecha de ayer | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-084 | Alta | Períodos anteriores al corriente se generan siempre aunque el día de cobro (`28`) sea posterior a `<DIA_HOY>` | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-085 | Alta | Pausar suscripción activa con día de cobro `28` (`> <DIA_HOY>`) muestra advertencia de este mes y pasa a `"Pausada desde <HOY>"` con piso en `<MES_SIGUIENTE>` | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-086 | Media | Pausar suscripción activa cuyo cobro del mes corriente ya fue generado (`<DIA_AYER>`) no muestra la oración `"Este mes tampoco se cobra..."` | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-087 | Media | Tocar `"Cancelar"` en el diálogo de pausa cierra el diálogo y mantiene la suscripción `"Activa"` | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-088 | Alta | `pause_subscription` por API ejecuta primero la puesta al día y genera los meses vencidos pendientes antes de pausar | **PASSED** | Claude Code | — |
| CP-SUS-089 | Alta | Pausar suscripción en USD con mes bloqueado por falta de tipo de cambio muestra `pause-subscription-dialog-blocked-warning` y quita el bloqueo al confirmar | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-090 | Alta | Cargar en Ajustes el tipo de cambio de un mes descartado al pausar y luego reanudar la suscripción no genera retroactivamente ese mes | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-091 | Media | Rechazar en API `pause_subscription` sobre una suscripción que ya está en estado `paused` | **PASSED** | Claude Code | — |
| CP-SUS-092 | Media | Rechazar en API `pause_subscription` sobre una suscripción en estado `cancelled` | **PASSED** | Claude Code | — |
| CP-SUS-093 | Alta | Rechazar en API un `PATCH` directo de `status` sobre `/rest/v1/subscriptions` con la sesión del usuario | **PASSED** | Claude Code | — |
| CP-SUS-094 | Alta | Rechazar en API `pause_subscription` usando la sesión de otro usuario (`404 P0002`) | **FAILED** | Claude Code | DEF-034 |
| CP-SUS-095 | Alta | Rechazar en API `pause_subscription` sin sesión autenticada (rol `anon`) | **FAILED** | Claude Code | DEF-035 |
| CP-SUS-096 | Alta | Reanudar suscripción pausada abre `resume-subscription-dialog`, pasa a `"Activa"`, limpia `paused_at`, conserva `generate_from_period = '<MES_SIGUIENTE>-01'` y no genera el mes actual | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-097 | Media | Reanudar suscripción pausada con `start_period` futuro (`<MES_MAS_3>`) conserva `generate_from_period = '<MES_MAS_3>-01'` y no genera gastos | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-098 | Media | Rechazar en API `resume_subscription` sobre una suscripción que ya está en estado `active` | **PASSED** | Claude Code | — |
| CP-SUS-099 | Media | Rechazar en API `resume_subscription` sobre una suscripción en estado `cancelled` | **PASSED** | Claude Code | — |
| CP-SUS-100 | Alta | Rechazar en API `resume_subscription` usando la sesión de otro usuario (`404 P0002`) | **FAILED** | Claude Code | DEF-034 |
| CP-SUS-101 | Alta | Rechazar en API `resume_subscription` sin sesión autenticada (rol `anon`) | **FAILED** | Claude Code | DEF-035 |
| CP-SUS-102 | Alta | Cancelar suscripción activa con 4 gastos cargados mantiene el historial en el Detalle y en el Resumen y oculta los botones de acción | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-103 | Media | Cancelar suscripción desde el estado `"Pausada"` (`paused -> cancelled`) fija `cancelled_at` y la mueve al grupo `"Canceladas"` | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-104 | Alta | `cancel_subscription` por API ejecuta primero la puesta al día y genera los meses vencidos pendientes antes de cancelar | **PASSED** | Claude Code | — |
| CP-SUS-105 | Media | Cancelar suscripción en USD bloqueada sin gastos cargados muestra `cancel-subscription-dialog-blocked-warning` y `"Todavía no se cargó ningún gasto."` | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-106 | Media | Rechazar en API `cancel_subscription` sobre una suscripción que ya está en estado `cancelled` | **PASSED** | Claude Code | — |
| CP-SUS-107 | Alta | Rechazar en API `cancel_subscription` usando la sesión de otro usuario (`404 P0002`) | **FAILED** | Claude Code | DEF-034 |
| CP-SUS-108 | Alta | Rechazar en API `cancel_subscription` sin sesión autenticada (rol `anon`) | **FAILED** | Claude Code | DEF-035 |
| CP-SUS-109 | Alta | Editar el monto de una suscripción activa de `$5.000,00` a `$7.000,00` conserva las 4 ocurrencias ya generadas en `$5.000,00` y muestra Moneda y Mes de inicio como solo lectura | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-110 | Alta | `update_subscription` por API genera primero los meses vencidos pendientes con el monto anterior antes de guardar el monto nuevo | **PASSED** | Claude Code | — |
| CP-SUS-111 | Media | Editar la categoría y el medio de pago de una suscripción no modifica las transacciones ya generadas | **PASSED** | Claude Code | — |
| CP-SUS-112 | Media | Editar el nombre de `"Netflix"` a `"Netflix 4K"` mantiene la descripción `"Netflix"` en la transacción anterior y muestra `"Netflix 4K"` en la marca de Movimientos | **PASSED** | Claude Code | — |
| CP-SUS-113 | Alta | Editar el día de cobro de `28` a `1` cuando el mes corriente aún no se había generado crea al guardar la ocurrencia del mes corriente con los datos nuevos | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-114 | Media | Rechazar en API enviar `p_currency` en `update_subscription` | **PASSED** | Claude Code | — |
| CP-SUS-115 | Media | Rechazar en API enviar `p_start_period` en `update_subscription` | **PASSED** | Claude Code | — |
| CP-SUS-116 | Media | Rechazar en UI editar el Mes de fin de una suscripción activa a un período pasado (`<MES_ANTERIOR>`) | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-117 | Media | Rechazar en API `update_subscription` con `p_end_period` anterior al período corriente (`<MES_ANTERIOR>-01`) | **PASSED** | Claude Code | — |
| CP-SUS-118 | Alta | Rechazar en UI renombrar una suscripción poniéndole el nombre de otra suscripción activa del mismo usuario | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-119 | Alta | Rechazar en API `update_subscription` renombrando una suscripción con el nombre de otra activa del mismo usuario | **PASSED** | Claude Code | — |
| CP-SUS-120 | Media | Rechazar en UI editar una suscripción cancelada al navegar directo a `/subscriptions/<SUB_ID>/edit` | **PASSED** | Claude Code | — |
| CP-SUS-121 | Media | Rechazar en API `update_subscription` sobre una suscripción en estado `cancelled` | **PASSED** | Claude Code | — |
| CP-SUS-122 | Alta | Rechazar en API un `PATCH` directo de `amount` sobre `/rest/v1/subscriptions` con la sesión del usuario | **PASSED** | Claude Code | — |
| CP-SUS-123 | Media | Editar el monto de una suscripción cuya categoría actual fue archivada permite guardar conservando `"Entretenimiento (archivada)"` | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-124 | Media | Rechazar en API cambiar `p_category_id` en `update_subscription` a otra categoría archivada distinta de la actual | **PASSED** | Claude Code | — |
| CP-SUS-125 | Media | Editar el monto de una suscripción cuyo medio de pago actual fue archivado permite guardar conservando `"Efectivo (archivada)"` | **PASSED** | Claude Code | — |
| CP-SUS-126 | Media | Rechazar en API cambiar `p_account_id` en `update_subscription` a otra cuenta archivada distinta de la actual | **PASSED** | Claude Code | — |
| CP-SUS-127 | Media | Editar la descripción de una suscripción terminada (`end_period = <MES_HACE_2>`) sin tocar el Mes de fin permite guardar | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-128 | Alta | Extender una suscripción terminada (`end_period = <MES_HACE_2>`) tocando `"Sin fin"` mueve `generate_from_period` al período corriente sin rellenar `<MES_ANTERIOR>` | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-129 | Alta | Rechazar en API `update_subscription` usando la sesión de otro usuario (`404 P0002`) | **FAILED** | Claude Code | DEF-034 |
| CP-SUS-130 | Alta | Rechazar en API `update_subscription` sin sesión autenticada (rol `anon`) | **FAILED** | Claude Code | DEF-035 |
| CP-SUS-131 | Alta | Eliminar desde Movimientos la ocurrencia de `<MES_ANTERIOR>` muestra `delete-transaction-subscription-note`, figura con `"Eliminado"` en el Detalle y no vuelve a crearse al recargar | **PASSED** | Claude Code | — |
| CP-SUS-132 | Alta | Eliminar la ocurrencia de `<MES_ANTERIOR>` de una suscripción deja de sumarla en `"Gastado en <mes corto>"` del Resumen | **PASSED** | Claude Code | — |
| CP-SUS-133 | Alta | Restaurar desde el filtro `"Eliminados"` de Movimientos la ocurrencia borrada vuelve a sumarla en el Resumen, quita la marca `"Eliminado"` en el Detalle y no duplica el mes | **PASSED** | Claude Code | — |
| CP-SUS-134 | Alta | Mostrar la marca de suscripción en Movimientos y en `"Últimos movimientos"` del Resumen (y no en un gasto manual) y navegar al Detalle al tocarla | **PASSED** | Claude Code | — |
| CP-SUS-135 | Alta | La ocurrencia generada de una suscripción suma en `"Gastado en <mes corto>"` y resta en `"Balance"` del Resumen de V1 | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-136 | Media | Listar en `"Gastos cargados"` del Detalle las ocurrencias de la suscripción ordenadas por período descendente | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-137 | Media | Mostrar la marca de suscripción en Movimientos aunque la suscripción esté en estado `paused` | **PASSED** | Claude Code | — |
| CP-SUS-138 | Media | Mostrar la marca de suscripción en Movimientos aunque la suscripción esté en estado `cancelled` | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-139 | Alta | Suscripción activa en USD con tipo de cambio en `<MES_HACE_2>` y sin tipo de cambio en `<MES_ANTERIOR>` genera solo `<MES_HACE_2>`, muestra `"Falta tipo de cambio"` y el botón `"Cargar tipo de cambio"` navega a `/settings?period=<MES_ANTERIOR>` | **PASSED** | Claude Code | — |
| CP-SUS-140 | Alta | Guardar en Ajustes el tipo de cambio faltante de `<MES_ANTERIOR>` dispara la puesta al día sin recargar, muestra `"Se cargó 1 gasto de suscripciones"` y quita el bloqueo | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-141 | Media | Con 3 meses bloqueados por falta de tipo de cambio, el aviso los lista con comas y `"y"` y el botón `"Cargar tipo de cambio"` apunta al mes más viejo | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-142 | Media | Suscripción activa en USD sin tipo de cambio del mes corriente antes del día de cobro (`28 > <DIA_HOY>`) no se muestra bloqueada | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-143 | Alta | Con dos suscripciones activas en ARS (`$5.000,00` y `$2.500,00`), el total mensual comprometido muestra `"$7.500,00"` y `"2 suscripciones activas este mes"` | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-144 | Alta | Suscripción activa en `USD 10,00` con tipo de cambio del período corriente `1.250,00` suma `"$12.500,00"` al total mensual comprometido | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-145 | Alta | Con una sola suscripción activa en `USD 10,00` y sin tipo de cambio del período corriente, el total comprometido muestra `"$0,00"`, `"1 suscripción activa este mes"` y `"+ USD 10,00 sin tipo de cambio de <mes actual>"` | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-146 | Alta | Editar el monto de una suscripción de `$5.000,00` a `$8.000,00` actualiza el total mensual comprometido a `"$8.000,00"` aunque la ocurrencia del mes corriente ya se haya generado por `$5.000,00` | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-147 | Alta | El Resumen (`/dashboard`) no suma suscripciones cuya ocurrencia del mes corriente aún no fue generada y muestra el estado vacío del período | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-148 | Alta | Una suscripción activa con `end_period` igual al período corriente (`<MES_ACTUAL>`) sí suma al total mensual comprometido | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-149 | Media | Una suscripción en estado `paused` no suma al total mensual comprometido (`"$0,00"` y `"No tenés suscripciones activas este mes"`) | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-150 | Media | Una suscripción en estado `cancelled` no suma al total mensual comprometido | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-151 | Media | Una suscripción activa con `start_period` en el mes siguiente (`<MES_SIGUIENTE>`) no suma al total mensual comprometido del mes corriente | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-152 | Media | Una suscripción activa ya terminada (`end_period = <MES_ANTERIOR>`) no suma al total mensual comprometido del mes corriente | **PASSED** | Equipo (informado por mensaje) | — |
| CP-SUS-153 | Alta | Vista previa en `/subscriptions/new` con `$5.000,00` ARS, día `28` (`> <DIA_HOY>`), desde `<MES_HACE_2>` y sin fin muestra 2 meses en `"Se cargan al guardar"`, 3 en `"Próximos cobros"`, resumen de `"$10.000,00"` y al guardar crea exactamente esas 2 transacciones | **PASSED** | Claude Code | — |
| CP-SUS-154 | Alta | Vista previa en `/subscriptions/new` con día de cobro igual a `<DIA_HOY>` incluye el período corriente en `"Se cargan al guardar"` | **PASSED** | Claude Code | — |
| CP-SUS-155 | Media | Vista previa en `/subscriptions/new` con Mes de inicio futuro (`<MES_MAS_3>`) muestra `"Al guardar no se carga ningún gasto."` y `"Próximos cobros"` desde `<MES_MAS_3>` | **PASSED** | Claude Code | — |
| CP-SUS-156 | Media | Vista previa en `/subscriptions/new` con rango cerrado en el pasado (`2026-03` a `2026-05`) y día `31` muestra `31/03/2026`, `30/04/2026`, `31/05/2026` y `"No hay más cobros: termina en mayo 2026."` | **PASSED** | Claude Code | — |
| CP-SUS-157 | Alta | Vista previa en `/subscriptions/new` en USD con tipo de cambio en `<MES_HACE_2>` y sin tipo de cambio en `<MES_ANTERIOR>` marca `<MES_ANTERIOR>` con `data-blocked="true"` y no lo cuenta en el resumen | **FAILED** | Claude Code | DEF-036 |
| CP-SUS-158 | Media | Vista previa en `/subscriptions/new` con el campo `"Monto"` vacío muestra `subscription-form-preview-empty` | **PASSED** | Equipo (informado por mensaje) | — |

## Resumen

| Status | Casos |
|---|---|
| PASSED | 449 |
| FAILED | 17 |
| DUDA (pasa, con dudas) | 12 |
| BLOCKED | 88 |
| No ejecutados | 1 |
| **Total** | **567** |

Por módulo:

| Módulo | Casos | PASSED | FAILED | DUDA | BLOCKED | No ejecutados |
|---|---|---|---|---|---|---|
| Deudas (DEU) | 105 | 60 | 0 | 2 | 43 | 0 |
| Navegación (NAV) | 85 | 83 | 1 | 0 | 0 | 1 |
| Exportar CSV (EXP) | 75 | 69 | 4 | 2 | 0 | 0 |
| Importar Excel (IMP) | 144 | 90 | 1 | 8 | 45 | 0 |
| Suscripciones (SUS) | 158 | 147 | 11 | 0 | 0 | 0 |

## Detalle de los casos que no son PASSED

### CP-DEU-029 — Sin haber iniciado sesión no se puede crear un gasto compartido · **BLOCKED**

**Esperado:** El sistema responde con error 401 o 403 y el código 42501 («permission denied for function create_transaction»). Ambos devuelven [] : no se creó nada.

**Obtenido:** No se pudo ejecutar como está escrito. Se probaron tres variantes en el entorno local: (A) el caso tal cual (sin sesión, con p_shared_persons y p_shared_amounts): responde 404 PGRST202 «función no encontrada» y no 401/42501; (B) sin sesión con la función actual de una sola persona (p_shared_person): responde 401 con el código 42501 «permission denied for function create_transaction» (sin sesión no se puede crear gastos); (C) con sesión y la firma de varias personas: también 404. Por eso el resultado esperado no puede comprobarse hasta que exista la función.

**Defectos:** —

**Notas:** BLOQUEADO: la función de varias personas (US-82, issue #270 abierto) todavía no está implementada en la app. Cuando exista, repetir el caso. Sin defecto: el bloqueo depende de una historia pendiente.

### CP-DEU-128 — Gasto compartido con varias personas: agregar, quitar y guardar · **BLOCKED**

**Esperado:** Se abre el paso 2 de 3. Se abre el paso 3 de 3. El campo de fecha muestra 15/08/2026. Aparece 1 sola fila vacía, sin botón «Quitar»; debajo se ven los botones «Agregar persona» y «Dividir en partes iguales». La fila 1 muestra Sofía y 40000. Se agrega la fila 2 vacía al final, el cursor queda en «¿Con quién?» de la fila 2 y aparece el botón «Quitar» en las dos filas. El resumen muestra «Te van a deber $80.000,00 entre 2 personas · Tu parte: $40.000,00». Aparece el aviso «Gasto guardado» con la descripción «Juan y Sofía te deben $80.000,00». La fila del gasto muestra la etiqueta «Compartido con Juan y Sofía». En «Últimos movimientos», la fila del gasto muestra «Compartido con Juan y Sofía».

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-128B — Las personas se ordenan por nombre sin distinguir mayúsculas ni tildes · **BLOCKED**

**Esperado:** Se abre el paso 2 de 3. Se abre el paso 3 de 3. El campo de fecha muestra 15/08/2026. Aparece la fila 1. La fila 1 muestra Beto y 30000. La fila 2 muestra álvaro y 30000. La fila 3 muestra Ángela y 30000. Aparece el aviso «Gasto guardado» con la descripción exacta «álvaro, Ángela y Beto te deben $90.000,00». Las 3 filas aparecen en el orden exacto de arriba hacia abajo: álvaro, Ángela, Beto (desempate por persona sin distinguir mayúsculas ni tildes).

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-129 — «Dividir en partes iguales» entre 2 personas · **BLOCKED**

**Esperado:** Se abre el paso 2 de 3. Se abre el paso 3 de 3. Aparece la fila 1. La fila 1 muestra Sofía y 10000. La fila 2 muestra Juan y 20000. El campo «¿Cuánto te debe?» de la fila 1 y el de la fila 2 reemplazan sus montos previos por 33333,33 (con coma decimal y sin separador de miles), y el resumen muestra el texto exacto «Te van a deber $66.666,66 entre 2 personas · Tu parte: $33.333,34».

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-129B — Dividir un gasto de $0,02 entre 2 personas da error · **BLOCKED**

**Esperado:** Se abre el paso 2 de 3. Se abre el paso 3 de 3. Aparece la fila 1. La fila 1 muestra Sofía. La fila 2 muestra Juan. El campo «¿Cuánto te debe?» de la fila 1 y el de la fila 2 quedan con 0, cada fila muestra el mensaje exacto «El monto debe ser mayor a cero», y el botón «Guardar gasto» está deshabilitado.

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-129C — «Dividir en partes iguales» con los nombres vacíos · **BLOCKED**

**Esperado:** Se abre el paso 2 de 3. Se abre el paso 3 de 3. Aparece la fila 1 con «¿Con quién?» vacío y el botón «Dividir en partes iguales» está habilitado. Aparece la fila 2 con «¿Con quién?» vacío. El campo «¿Cuánto te debe?» de la fila 1 y el de la fila 2 se completan con 30000, los campos «¿Con quién?» siguen vacíos y el botón «Guardar gasto» sigue deshabilitado hasta completar las personas.

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-130 — «Dividir en partes iguales» entre 3 personas · **BLOCKED**

**Esperado:** Se abre el paso 2 de 3. Se abre el paso 3 de 3. Aparece la fila 1. Hay 3 filas con Sofía, Juan y Ana. El campo «¿Cuánto te debe?» de las 3 filas muestra 30000 (sin,00) y el resumen muestra «Te van a deber $90.000,00 entre 3 personas · Tu parte: $30.000,00».

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-130B — Cambiar la moneda con personas cargadas vacía los montos · **BLOCKED**

**Esperado:** Se abre el paso 2 de 3. Se abre el paso 3 de 3. Las 2 filas tienen Sofía (30000) y Juan (30000). Se abre el paso 1 de 3, «¿Cuánto?». Se abre el paso 2 de 3. Se abre el paso 3 de 3: el interruptor «Gasto compartido» sigue encendido con las 2 filas, «¿Con quién?» conserva Sofía en la fila 1 y Juan en la fila 2, y el campo «¿Cuánto te debe?» de ambas filas está vacío con prefijo US$.

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-130C — «Dividir en partes iguales» en dólares · **BLOCKED**

**Esperado:** Se abre el paso 2 de 3. Se abre el paso 3 de 3. Hay 2 filas con Sofía y Juan. El campo «¿Cuánto te debe?» de ambas filas muestra 33,33 y el resumen muestra «Te van a deber US$66,66 entre 2 personas · Tu parte: US$33,34».

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-130D — En dólares, dividir un gasto muy chico da error de centavos · **BLOCKED**

**Esperado:** Se abre el paso 2 de 3 (0,02 × 0,4 = $0,01 en pesos para el gasto). Se abre el paso 3 de 3. La fila 1 muestra Sofía. El campo «¿Cuánto te debe?» de la fila 1 se completa con 0,01 (0,01 × 0,4 = 0,004 → $0,00), debajo de la fila aparece el mensaje de error con el texto exacto «En pesos daría menos de $0,01. Revisá el monto o el tipo de cambio», y «Guardar gasto» queda deshabilitado.

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-131 — Entre todos pueden deber todo el gasto (tu parte es $0) · **BLOCKED**

**Esperado:** Se abre el paso 2 de 3. Se abre el paso 3 de 3. El campo de fecha muestra 15/08/2026. El resumen muestra «Te van a deber $120.000,00 entre 2 personas · Tu parte: $0,00» y el botón «Guardar gasto» está habilitado. Aparece el aviso «Gasto guardado» con la descripción «Juan y Sofía te deben $120.000,00».

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-132 — La suma de lo que te deben no puede superar el gasto · **BLOCKED**

**Esperado:** Se abre el paso 2 de 3. Se abre el paso 3 de 3. Aparece el mensaje de error con el texto exacto «Entre todos no pueden deber más que el gasto ($120.000,00)», el botón «Guardar gasto» queda deshabilitado.

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-132B — Bajar el gasto por debajo de lo que te deben da error · **BLOCKED**

**Esperado:** Se abre el paso 2 de 3. Se abre el paso 3 de 3. El resumen muestra «Te van a deber $80.000,00 entre 2 personas · Tu parte: $40.000,00». Se abre el paso 1 de 3. Se abre el paso 2 de 3. Se abre el paso 3 de 3: los montos de las filas siguen siendo 40000 y 40000 (no se ajustan solos), se muestra el mensaje de error con el texto exacto «Entre todos no pueden deber más que el gasto ($70.000,00)» y «Guardar gasto» está deshabilitado.

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-132C — Una persona que debe más que el gasto da error en su fila · **BLOCKED**

**Esperado:** Se abre el paso 2 de 3. Se abre el paso 3 de 3. En la fila 1 aparece el mensaje de error con el texto exacto «No puede superar el monto del gasto ($120.000,00)», no aparece el mensaje de error de la suma total y «Guardar gasto» está deshabilitado.

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-132D — Bajar el gasto muy por debajo da error en cada fila · **BLOCKED**

**Esperado:** Se abre el paso 2 de 3. Se abre el paso 3 de 3. El resumen muestra «Te van a deber $80.000,00 entre 2 personas · Tu parte: $40.000,00». Se abre el paso 1 de 3. Se abre el paso 2 de 3. Se abre el paso 3 de 3: tanto la fila 1 como la fila 2 muestran el mensaje de error con el texto exacto «No puede superar el monto del gasto ($30.000,00)», no aparece el mensaje de error de la suma total y «Guardar gasto» está deshabilitado.

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-133 — Se puede compartir con hasta 10 personas · **BLOCKED**

**Esperado:** Se abre el paso 2 de 3. Se abre el paso 3 de 3. El campo de fecha muestra 15/08/2026. Aparece la fila 1. Hay 10 filas, el botón «Agregar persona» está deshabilitado (disabled), y aparece el texto exacto «Podés compartir un gasto con hasta 10 personas». Aparece el aviso «Gasto guardado» con la descripción exacta «Persona 01, Persona 02, Persona 03, Persona 04, Persona 05, Persona 06, Persona 07, Persona 08, Persona 09 y Persona 10 te deben $100.000,00».

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-134 — No se puede repetir una persona · **BLOCKED**

**Esperado:** Se abre el paso 2 de 3. Se abre el paso 3 de 3. En la fila 2 aparece el mensaje de error con el texto exacto «Ya agregaste a Sofía» y el botón «Guardar gasto» queda deshabilitado.

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-135 — Una persona sin nombre da error en su fila · **BLOCKED**

**Esperado:** Se abre el paso 2 de 3. Se abre el paso 3 de 3. En la fila 2 aparece el mensaje de error con el texto exacto «Ingresá con quién compartiste el gasto» y el botón «Guardar gasto» está deshabilitado.

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-135B — Quitar una persona conserva a las demás · **BLOCKED**

**Esperado:** Se abre el paso 3 de 3. Hay 3 filas. Quedan 2 filas: la primera con Sofía y 30000, y la segunda con Ana y 10000. El resumen muestra «Te van a deber $40.000,00 entre 2 personas · Tu parte: $80.000,00».

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-135C — Pasar a Ingreso y volver a Gasto reinicia la sección compartida · **BLOCKED**

**Esperado:** Se abre el paso 2 de 3. Se abre el paso 3 de 3. Hay 2 filas cargadas. Se abre el paso 1. «Gasto» queda seleccionado. Se abre el paso 3 de 3 con el interruptor «Gasto compartido» apagado (apagado). Aparece 1 sola fila con «¿Con quién?» y «¿Cuánto te debe?» vacíos.

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-135D — Apagar «Gasto compartido» guarda el gasto sin deudas · **BLOCKED**

**Esperado:** Se abre el paso 2 de 3. Se abre el paso 3 de 3. El campo de fecha muestra 15/08/2026. Hay 3 filas cargadas. El interruptor queda apagado (apagado) y las 3 filas desaparecen. Aparece el aviso «Gasto guardado» sin mención de deudas. Aparece 1 sola fila vacía.

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-136 — Gasto compartido con 3 personas en 2 cuotas: etiqueta en Movimientos y Resumen · **BLOCKED**

**Esperado:** La cuota 1/2 muestra la etiqueta con el texto exacto «Compartido con Ana y 2 más». La cuota 2/2 muestra la etiqueta con el texto exacto «Compartido con Ana y 2 más». En «Últimos movimientos», la fila del gasto muestra con el texto exacto «Compartido con Ana y 2 más».

**Obtenido:** La preparación del caso necesita la función de varias personas (US-82, issue #270), que todavía no existe: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada»). Observado: se puede crear el gasto compartido con 3 personas (preparación del caso) (obtenido: 404 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_occurred_on, p_sh.

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-136B — Al borrar un gasto con varias deudas, el aviso las lista · **BLOCKED**

**Esperado:** Se muestra la fila del gasto de $120.000,00. Se abre el diálogo de confirmación de borrado y el elemento muestra el texto exacto «También dejan de contar las deudas con Ana, Juan y Sofía por $90.000,00 en total.».

**Obtenido:** La preparación del caso necesita la función de varias personas (US-82, issue #270), que todavía no existe: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada»). Observado: se puede crear el gasto compartido con 3 personas (preparación del caso) (obtenido: 404 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_occurred_on, p_sh.

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-136C — Las 3 deudas de un mismo gasto aparecen en Deudas · **BLOCKED**

**Esperado:** «Te deben» muestra «$90.000,00»; la lista muestra 3 filas en el orden exacto Ana, Juan, Sofía, y cada una muestra con «Gasto compartido: Otros, $120.000,00 del 15/08/2026». El gasto total muestra «$120.000,00» y el monto del neto muestra «$30.000,00» ($120.000,00 − $90.000,00).

**Obtenido:** La preparación del caso necesita la función de varias personas (US-82, issue #270), que todavía no existe: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada»). Observado: se puede crear el gasto compartido con 3 personas (preparación del caso) (obtenido: 404 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_occurred_on, p_sh.

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-136D — Eliminar el gasto saca sus 3 deudas · **BLOCKED**

**Esperado:** Se muestra el gasto de $120.000,00. El gasto desaparece de Movimientos activos. «Te deben» muestra «$0,00», el neto muestra «En cero» y la lista muestra el estado vacío «No cargaste ninguna deuda todavía.».

**Obtenido:** La preparación del caso necesita la función de varias personas (US-82, issue #270), que todavía no existe: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada»). Observado: se puede crear el gasto compartido con 3 personas (preparación del caso) (obtenido: 404 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_occurred_on, p_sh.

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-136E — Restaurar el gasto devuelve sus 3 deudas con su estado · **BLOCKED**

**Esperado:** El gasto se restaura a Movimientos activos. Vuelven a aparecer las 3 deudas: «Juan» y «Sofía» con estado «Pendiente» («Te deben» = «$60.000,00») y «Ana» con estado «Saldada el [fecha de hoy]».

**Obtenido:** La preparación del caso necesita la función de varias personas (US-82, issue #270), que todavía no existe: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada»). Observado: se puede crear el gasto compartido con 3 personas (preparación del caso) (obtenido: 404 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_occurred_on, p_sh.

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-137 — Por API, 2 personas y 1 monto se rechaza · **BLOCKED**

**Esperado:** Responde 400 con el código 23514 y «Un gasto compartido necesita una persona y un monto por cada deuda»; no se crea nada.

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada» en vez del rechazo esperado). Observado: 400 con 23514 y «Un gasto compartido necesita una persona y un monto por cada deuda» (obtenido: 404 PGRST202 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count.

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-138 — Por API, listas vacías se rechazan · **BLOCKED**

**Esperado:** Responde 400 con el código 23514 y «Un gasto compartido necesita al menos una persona»; no se crea nada.

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada» en vez del rechazo esperado). Observado: 400 con 23514 y «Un gasto compartido necesita al menos una persona» (obtenido: 404 PGRST202 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_occurred_on, .

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-139 — Por API, 11 personas se rechaza · **BLOCKED**

**Esperado:** Responde 400 con el código 23514 y «Un gasto se comparte con hasta 10 personas»; no se crea nada.

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada» en vez del rechazo esperado). Observado: 400 con 23514 y «Un gasto se comparte con hasta 10 personas» (obtenido: 404 PGRST202 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_occurred_on, p_share.

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-140 — Por API, la misma persona repetida se rechaza · **BLOCKED**

**Esperado:** Responde 400 con el código 23514 y «Cada persona puede aparecer una sola vez»; no se crea nada.

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada» en vez del rechazo esperado). Observado: 400 con 23514 y «Cada persona puede aparecer una sola vez» (obtenido: 404 PGRST202 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_occurred_on, p_shared_.

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-141 — Por API, deudas que suman más que el gasto se rechazan · **BLOCKED**

**Esperado:** Responde 400 con el código 23514 y «I7: la suma de las deudas no puede superar el monto del gasto»; no se crea nada.

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada» en vez del rechazo esperado). Observado: 400 con 23514 y «I7: la suma de las deudas no puede superar el monto del gasto» (obtenido: 404 PGRST202 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_o.

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-142 — Dólares: el redondeo hace que las deudas sumen más que el gasto · **BLOCKED**

**Esperado:** Se abre el paso 2 de 3. Se abre el paso 3 de 3. Aparece el mensaje de error con el texto exacto «En pesos, la suma supera el gasto por redondeo. Bajá un centavo alguna deuda.» y el botón «Guardar gasto» queda deshabilitado.

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-142A — Por API, el mismo caso de redondeo se rechaza · **BLOCKED**

**Esperado:** Responde 400 con el código 23514 y «I7: en pesos, la suma de las deudas supera el gasto por redondeo»; no se crea nada.

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada» en vez del rechazo esperado). Observado: 400 con 23514 y «I7: en pesos, la suma de las deudas supera el gasto por redondeo» (obtenido: 404 PGRST202 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, .

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-142B — Por API, una segunda persona sin nombre se rechaza sin guardar nada · **BLOCKED**

**Esperado:** Responde 400 con el código 23514 y «Ingresá con quién compartiste el gasto»; no se crea ni el gasto ni la deuda de Sofía.

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada» en vez del rechazo esperado). Observado: 400 con 23514 y «Ingresá con quién compartiste el gasto» (obtenido: 404 PGRST202 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_occurred_on, p_shared_am.

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-145 — Resumen: gasto en 12 cuotas con deuda, neto negativo · **DUDA**

**Esperado:** En el Resumen de agosto 2026: el gasto total muestra «$10.000,00»; el monto del neto muestra «-$50.000,00» ($10.000,00 − $60.000,00); y debajo se ve la aclaración del neto con el texto exacto «Las deudas se descuentan enteras en el mes de la compra, aunque sea en cuotas.». En el Resumen de septiembre 2026: el gasto total muestra «$10.000,00» (cuota 2/12) y la fila «Neto de reembolsos» no se ve.

**Obtenido:** El caso pide 12 cuotas con la cuenta «Efectivo», pero la app solo permite cuotas con una cuenta de tarjeta de crédito: la preparación del caso no se puede hacer tal como está escrita. Se ejecutó con la cuenta «Tarjeta de crédito». La app hace lo esperado con la cuenta «Tarjeta de crédito»: agosto 2026 muestra total $10.000,00, neto -$50.000,00 y la aclaración del neto; septiembre 2026 muestra total $10.000,00 y no muestra la fila del neto.

**Defectos:** —

**Notas:** Parece un error del caso, no de la aplicación. Corregir la cuenta de preparación del caso.

### CP-DEU-151 — Balance: una deuda suelta «Me deben» resta del balance del mes · **BLOCKED**

**Esperado:** El total de ingresos muestra «$100.000,00»; el gasto total muestra «$0,00»; el balance muestra «$80.000,00»; la etiqueta del balance muestra «Superávit»; la línea de deudas sueltas muestra el texto exacto «Incluye deudas sueltas: -$20.000,00»; y la fila «Neto de reembolsos» no se ve.

**Obtenido:** La función «deudas sueltas en el balance del mes» (US-83, issue #271) todavía no existe: el Resumen no muestra «Incluye deudas sueltas» ni suma o resta las deudas sueltas en el balance. Observado: mes actual: balance $80.000,00 (obtenido: "$100.000,00" no contiene "$80.000,00"); mes actual: «Incluye deudas sueltas: -$20.000,00» (obtenido: "no existe la línea" no contiene "Incluye deudas sueltas: -$20.000,00").

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-83 (issue #271). Sin defecto: depende de una historia pendiente.

### CP-DEU-152 — Balance: una deuda suelta «Debo» suma al balance del mes · **BLOCKED**

**Esperado:** El total de ingresos muestra «$100.000,00»; el gasto total muestra «$0,00»; el balance muestra «$150.000,00»; la etiqueta del balance muestra «Superávit»; y la línea de deudas sueltas muestra el texto exacto «Incluye deudas sueltas: $50.000,00».

**Obtenido:** La función «deudas sueltas en el balance del mes» (US-83, issue #271) todavía no existe: el Resumen no muestra «Incluye deudas sueltas» ni suma o resta las deudas sueltas en el balance. Observado: mes actual: balance $150.000,00 (obtenido: "$100.000,00" no contiene "$150.000,00"); mes actual: «Incluye deudas sueltas: $50.000,00» (obtenido: "no existe la línea" no contiene "Incluye deudas sueltas: $50.000,00").

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-83 (issue #271). Sin defecto: depende de una historia pendiente.

### CP-DEU-153 — Balance: saldar la deuda suelta el mismo mes lo deja como antes · **BLOCKED**

**Esperado:** El balance muestra «$100.000,00», la etiqueta del balance muestra «Superávit» y la línea de deudas sueltas muestra el texto exacto «Incluye deudas sueltas: $0,00».

**Obtenido:** La función «deudas sueltas en el balance del mes» (US-83, issue #271) todavía no existe: el Resumen no muestra «Incluye deudas sueltas» ni suma o resta las deudas sueltas en el balance. Observado: mes actual: «Incluye deudas sueltas: $0,00» (obtenido: "no existe la línea" no contiene "Incluye deudas sueltas: $0,00").

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-83 (issue #271). Sin defecto: depende de una historia pendiente.

### CP-DEU-153B — Balance en cero: deuda suelta creada y saldada el mismo mes · **BLOCKED**

**Esperado:** El total de ingresos muestra «$0,00»; el gasto total muestra «$0,00»; el balance muestra «$0,00»; la etiqueta del balance muestra el texto exacto «En cero»; y la línea de deudas sueltas muestra «Incluye deudas sueltas: $0,00».

**Obtenido:** La función «deudas sueltas en el balance del mes» (US-83, issue #271) todavía no existe: el Resumen no muestra «Incluye deudas sueltas» ni suma o resta las deudas sueltas en el balance. Observado: mes actual: balance $0,00 (obtenido: "sin balance" no contiene "$0,00"); mes actual: etiqueta «En cero» (obtenido: "sin etiqueta" no contiene "En cero"); mes actual: «Incluye deudas sueltas: $0,00» (obtenido: "no existe la línea" no contiene "Incluye deudas su.

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-83 (issue #271). Sin defecto: depende de una historia pendiente.

### CP-DEU-154 — Balance: una deuda saldada hoy mueve el balance de dos meses · **BLOCKED**

**Esperado:** El balance muestra «-$20.000,00», la etiqueta del balance muestra «Déficit» y la línea de deudas sueltas muestra «Incluye deudas sueltas: -$20.000,00». El balance muestra «$20.000,00», la etiqueta del balance muestra «Superávit» y la línea de deudas sueltas muestra «Incluye deudas sueltas: $20.000,00».

**Obtenido:** La función «deudas sueltas en el balance del mes» (US-83, issue #271) todavía no existe: el Resumen no muestra «Incluye deudas sueltas» ni suma o resta las deudas sueltas en el balance. Observado: mes anterior: balance -$20.000,00 (obtenido: "sin balance" no contiene "-$20.000,00"); mes anterior: etiqueta «Déficit» (obtenido: "sin etiqueta" no contiene "Déficit"); mes anterior: «Incluye deudas sueltas: -$20.000,00» (obtenido: "no existe la línea" no con.

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-83 (issue #271). Sin defecto: depende de una historia pendiente.

### CP-DEU-155 — Balance: reabrir la deuda saca el evento del mes actual · **BLOCKED**

**Esperado:** Aparece el aviso «La deuda con Juan volvió a pendiente». El balance vuelve a mostrar «$100.000,00» (ingresos − gastos) y la línea de deudas sueltas no se ve. El balance sigue mostrando «-$20.000,00» y la línea de deudas sueltas muestra «Incluye deudas sueltas: -$20.000,00».

**Obtenido:** La función «deudas sueltas en el balance del mes» (US-83, issue #271) todavía no existe: el Resumen no muestra «Incluye deudas sueltas» ni suma o resta las deudas sueltas en el balance. Observado: mes anterior: balance -$20.000,00 (obtenido: "sin balance" no contiene "-$20.000,00"); mes anterior: «Incluye deudas sueltas: -$20.000,00» (obtenido: "no existe la línea" no contiene "Incluye deudas sueltas: -$20.000,00").

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-83 (issue #271). Sin defecto: depende de una historia pendiente.

### CP-DEU-156 — Balance: una deuda suelta «Debo» saldada hoy mueve dos meses · **BLOCKED**

**Esperado:** El balance muestra «$50.000,00», la etiqueta del balance muestra «Superávit» y la línea de deudas sueltas muestra «Incluye deudas sueltas: $50.000,00». El balance muestra «-$50.000,00», la etiqueta del balance muestra «Déficit» y la línea de deudas sueltas muestra «Incluye deudas sueltas: -$50.000,00».

**Obtenido:** La función «deudas sueltas en el balance del mes» (US-83, issue #271) todavía no existe: el Resumen no muestra «Incluye deudas sueltas» ni suma o resta las deudas sueltas en el balance. Observado: mes anterior: balance $50.000,00 (obtenido: "sin balance" no contiene "$50.000,00"); mes anterior: etiqueta «Superávit» (obtenido: "sin etiqueta" no contiene "Superávit"); mes anterior: «Incluye deudas sueltas: $50.000,00» (obtenido: "no existe la línea" no co.

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-83 (issue #271). Sin defecto: depende de una historia pendiente.

### CP-DEU-157 — Balance: la deuda en dólares conserva el tipo de cambio de origen · **BLOCKED**

**Esperado:** El balance muestra «-$50.000,00» y la línea de deudas sueltas muestra «Incluye deudas sueltas: -$50.000,00». El balance muestra «$50.000,00» (no «$60.000,00») y la línea de deudas sueltas muestra «Incluye deudas sueltas: $50.000,00».

**Obtenido:** La función «deudas sueltas en el balance del mes» (US-83, issue #271) todavía no existe: el Resumen no muestra «Incluye deudas sueltas» ni suma o resta las deudas sueltas en el balance. Observado: mes anterior: balance -$50.000,00 (obtenido: "sin balance" no contiene "-$50.000,00"); mes anterior: «Incluye deudas sueltas: -$50.000,00» (obtenido: "no existe la línea" no contiene "Incluye deudas sueltas: -$50.000,00"); mes actual: balance $50.000,00 (obten.

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-83 (issue #271). Sin defecto: depende de una historia pendiente.

### CP-DEU-158 — Balance: un gasto compartido no aparece como deuda suelta · **DUDA**

**Esperado:** El gasto total muestra «$120.000,00», el balance muestra «-$120.000,00» y la línea de deudas sueltas no se ve. Aparece el aviso «Deuda con Sofía saldada». El balance sigue mostrando «-$120.000,00» y la línea de deudas sueltas sigue sin existir en pantalla.

**Obtenido:** Pasa con la app actual, pero también pasaría si la función de deudas sueltas (US-83) no existiera: la línea «Incluye deudas sueltas» todavía no se muestra en ningún caso, así que el caso no prueba nada hasta que US-83 esté implementada. Se cumple todo lo esperado (balance -$120.000,00 antes y después de saldar la deuda y sin la línea «Incluye deudas sueltas»).

**Defectos:** —

**Notas:** Repetir cuando exista US-83: hoy el caso no prueba nada.

### CP-DEU-159 — Un mes solo con una deuda suelta no se ve vacío · **BLOCKED**

**Esperado:** El mensaje de mes vacío no se ve; se ven las tarjetas del Resumen con el gasto total = «$0,00», el total de ingresos = «$0,00», el balance = «-$20.000,00», la etiqueta del balance = «Déficit» y la línea de deudas sueltas = «Incluye deudas sueltas: -$20.000,00», y las secciones de categorías, cuentas y últimos movimientos muestran sus estados vacíos individuales.

**Obtenido:** La función «deudas sueltas en el balance del mes» (US-83, issue #271) todavía no existe: el Resumen no muestra «Incluye deudas sueltas» ni suma o resta las deudas sueltas en el balance. Observado: no muestra el estado vacío del mes (obtenido: 1 ≠ 0); balance -$20.000,00 (obtenido: "sin balance" no contiene "-$20.000,00"); etiqueta «Déficit» (obtenido: "sin etiqueta" no contiene "Déficit"); línea «Incluye deudas sueltas: -$20.000,00» (obtenido: "no exist.

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-83 (issue #271). Sin defecto: depende de una historia pendiente.

### CP-NAV-060 — Un lector de pantalla (TalkBack) anuncia el error sin mover el foco · **NO EJECUTADO**

**Esperado:** El monto muestra 12500 y se habilita «Siguiente». Se abre el paso 2 de 3 («¿En qué?») con las categorías. Se abre el paso 3 de 3 («Revisá y guardá»). «Visa BBVA» queda marcada. El campo de fecha muestra 06/10/2026. La nota muestra «Almuerzo». TalkBack anuncia Chrome y el elemento que tiene el foco. Android muestra «Modo avión activado» y no hay Wi-Fi ni datos móviles. TalkBack anuncia «Guardar gasto, botón»; se conserva el paso 3 con todos los datos. TalkBack anuncia UNA sola vez «No se pudo guardar. Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.»; el botón visible pasa a «Reintentar». En la captura el indicador de foco de TalkBack rodea el botón «Reintentar», no el aviso ni otro elemento.

**Obtenido:** No se ejecutó: requiere un teléfono Pixel 7 con Android 15, Chrome y TalkBack en español, que no estuvo disponible.

**Defectos:** —

**Notas:** Pendiente de ejecutar cuando haya un dispositivo con TalkBack.

### CP-NAV-084 — La API conserva un solo gasto eliminado para la clave recuperada · **FAILED**

**Esperado:** Responde 200 y un identificador (ID-1). Responde 200 y el cuerpo es null. Responde 200 con UNA fila: id = ID-1, amount_text = "12500.00", la clave indicada y deleted_at con una fecha (no vacío). Responde 200 con UNA fila (cuota histórica): transaction_id = ID-1, installment_number = 1 y amount_text = "12500.00"; no cuenta en los cálculos porque su gasto está eliminado.

**Obtenido:** La baja respondió HTTP 204 SIN cuerpo (el caso espera HTTP 200 con cuerpo null). El resto coincide: la transacción quedó con deleted_at con fecha (una sola fila) y la cuota histórica se conserva (installment_number 1, 12500.00).

**Defectos:** DEF-029

**Notas:** Ver DEF-029. Parece un error en el resultado esperado del caso: delete_transaction está definida como «returns void» y PostgREST responde 204 a esas funciones. Decisión pendiente: corregir el caso o la función. No se corrigió nada.

### CP-EXP-030 — Un LF queda dentro de un campo citado · **DUDA**

**Esperado:** Se abre la hoja. Se descarga el CSV. Empieza y termina con `22`, conserva el `0A` interno y la fila lógica termina en `0D 0A`. Se obtienen 12 columnas y una fila de datos; la descripción conserva dos líneas.

**Obtenido:** El campo queda entre comillas con el salto de línea (LF) adentro y el archivo se lee como 12 columnas y una fila de datos con un lector RFC 4180. No se usó Google Sheets (el paso 16 lo pide): oráculo sustituido. — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 230 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,"Línea uno\nLínea dos",373609e1-efdc-4e01-a9f6-2cb0f7d638f8 Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento»

**Defectos:** —

**Notas:** Pasa con la app actual, pero hay dudas sobre lo que prueba o sobre el caso (ver «Obtenido»).

### CP-EXP-062 — Tocar fuera cierra sin descargar · **FAILED**

**Esperado:** Se abre la hoja. La hoja se cierra, no se descarga archivo y la URL conserva D1.

**Obtenido:** FALLA. Un clic sobre el fondo oscuro, fuera de la hoja, no la cierra: el clic lo recibe el `div` de fondo (`aria-hidden`), que es hijo del contenedor, y el controlador exige que el destino del clic sea el propio contenedor. La hoja sigue abierta. — Observado en la corrida — Descarga: ninguna Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV» Falla detectada: tocar fuera NO cierra la hoja (el click cae en el div de fondo aria-hidden, no en el contenedor)

**Defectos:** DEF-030

### CP-EXP-063 — Atrás cierra la hoja inicial · **FAILED**

**Esperado:** Se abre la hoja fijada a septiembre. La hoja se cierra, la URL pasa a `?period=2026-08` y no se descarga archivo.

**Obtenido:** FALLA. Con la hoja abierta, «Atrás» cambia la URL a `?period=2026-08` (el evento `popstate` se dispara) pero la hoja sigue abierta. — Observado en la corrida — Pantalla final: /transactions?period=2026-08 · hoja abierta · botón «Descargar CSV» Falla detectada: la URL pasó a 2026-08 pero la hoja sigue abierta

**Defectos:** DEF-031

### CP-EXP-064 — Atrás durante Exportando cancela la descarga · **FAILED**

**Esperado:** Se abre la hoja. Se ve "Exportando…". La hoja se cierra y la URL pasa a agosto. No aparece ningún archivo ni aviso de éxito.

**Obtenido:** FALLA. «Atrás» durante «Exportando…» no cancela la exportación: cuando termina la lectura se descarga el archivo y aparece el aviso «Exportamos 1 movimiento», con el usuario ya en el mes anterior. — Observado en la corrida — Pantalla final: /transactions?period=2026-08 · hoja cerrada · aviso: «Exportamos 1 movimiento» Falla detectada: Atrás durante Exportando no cancela: descargas=1, avisos de éxito=1

**Defectos:** DEF-032

### CP-EXP-065 — Adelante cierra la hoja inicial · **FAILED**

**Esperado:** Se vuelve a agosto y Adelante tiene destino septiembre. Se abre la hoja fijada a agosto. La hoja se cierra, la URL pasa a `?period=2026-09` y no se descarga archivo.

**Obtenido:** FALLA. Con la hoja abierta, «Adelante» cambia la URL a `?period=2026-09` pero la hoja sigue abierta. — Observado en la corrida — Descarga: ninguna Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV» Falla detectada: la URL pasó a 2026-09 pero la hoja sigue abierta

**Defectos:** DEF-031

### CP-EXP-071 — Un lector RFC 4180 obtiene doce columnas · **DUDA**

**Esperado:** Se abre la hoja. Se descarga el CSV. Se muestra una hoja sin datos. Se abre el menú Archivo. Se abre el diálogo Importar archivo. Se muestra la zona para subir un archivo. Se muestra la configuración de importación. El separador "Coma" queda seleccionado. Se importa un encabezado y una fila de datos. Además, hay exactamente 12 columnas. Además, conserva `Uno, "dos"`, un salto de línea y `Tres` en una sola celda.

**Obtenido:** El CSV se lee como 12 columnas y una fila de datos con un lector RFC 4180; la descripción `Uno, "dos"` + salto de línea + `Tres` queda en una sola celda. No se usó Google Sheets (pasos 16 a 21): oráculo sustituido. — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 226 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,"Uno, ""dos""\nTres",3953e175-6f06-44e8-be8d-320ad7b0cba5 Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento»

**Defectos:** —

**Notas:** Pasa con la app actual, pero hay dudas sobre lo que prueba o sobre el caso (ver «Obtenido»).

### CP-IMP-003 — La plantilla descargada tiene diez columnas y la instrucción de cuotas pendientes · **BLOCKED**

**Esperado:** La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. Se descarga una vez `biyu-plantilla-importacion.xlsx`. Existen exactamente las hojas `Movimientos` e `Instrucciones`; sus celdas coinciden exactamente con los datos de prueba y no hay filas de datos en `Movimientos`.

**Obtenido:** US-80 (Cuotas pendientes) no está implementada: la plantilla descargada tiene 9 columnas (Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Nota) y la hoja Instrucciones no incluye «Cuotas pendientes»

**Informe previo del equipo:** Falló: la planilla no muestra la columna de cuotas pendientes.

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-012 — El límite de tamaño acepta exactamente 1.048.576 bytes · **DUDA**

**Esperado:** La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. Se abre el selector de archivos. Se abre `2 Revisión`; muestra `1 fila leída · 1 lista para importar · 0 con error`.

**Obtenido:** Con un ZIP válido de exactamente 1.048.576 bytes la app acepta el archivo (1 fila leída · 1 lista · 0 con error). Con la preparación literal del caso (IMP-PREP-05: ceros al final del ZIP) responde «No pudimos leer el archivo»: probable error de la preparación del caso

**Defectos:** —

**Notas:** Pasa con la app actual, pero hay dudas sobre lo que prueba o sobre el caso (ver «Obtenido»).

### CP-IMP-018 — Una columna desconocida se ignora y se informa · **BLOCKED**

**Esperado:** La URL termina en `/import`; se ve `Importar desde Excel` y el paso `1 Archivo`. Se abre el selector de archivos. Se abre `2 Revisión`; aparece exactamente `Se ignoraron las columnas: Comercio.` y `1 fila leída · 1 lista para importar · 0 con error`.

**Obtenido:** US-80 (Cuotas pendientes) no está implementada: la app informa «Se ignoraron las columnas: Cuotas pendientes, Comercio.» en lugar de solo «Comercio.»

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-052 — Nombres, tipo y moneda aceptan espacios y mayúsculas · **FAILED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. `Fila 2` está `Lista`; muestra `Gasto`, `US$10,00`, `Educación`, `Efectivo` y `TC 1.450,00`.

**Obtenido:** Fila 2 Lista 01/09/2026 · Gasto · educación · efectivo · TC 1.450,00 US$10,00

**Defectos:** DEF-033

### CP-IMP-082 — Dos clicks rápidos generan una sola llamada y transacción · **BLOCKED**

**Esperado:** Se abre `/import` en `1 Archivo`. Se abre el selector. Una fila lista. `import-submit` muestra `Importando…` deshabilitado; `import-change-file` y `import-guide-open` están deshabilitados; Network registra una sola llamada a `/rpc/import_transactions`. Se ve `Se importó 1 de 1 fila.`; existe una sola transacción.

**Obtenido:** US-81 (guía «¿Cómo armo el archivo?») no está implementada: el caso también pide que `import-guide-open` esté deshabilitado. Verificado: 1 sola llamada a /rpc/import_transactions, «Importando…» deshabilitado y una sola transacción

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-093 — Compra empezada conserva solo tres cuotas desde H · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Fila 2 `Lista`; `Faltan 3 de 6 cuotas ($60.000,00)` en `import-row-2-pending`. Resultado: `Se importó 1 de 1 fila.` y `$60.000,00 en gastos...`. Transacción: amount `60000.00`, installments_count 6, installments_paid 3, occurred_on `2026-06-10`, first_period `2026-10-01`; cuotas 4–6 de `20000.00` en octubre–diciembre.

**Obtenido:** US-80 (Cuotas pendientes) no está implementada: no existe `import-row-2-pending` («Faltan 3 de 6 cuotas ($60.000,00)») y el resumen suma Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 10/06/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado

**Informe previo del equipo:** No sabe cómo testearlo.

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-094 — Movimientos muestra 4/6 a 6/6 solo desde H · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Fila lista. Resultado. URL `/transactions?period=2026-10`; muestra `4/6`, `$20.000,00`. Muestra `5/6`, `$20.000,00`. Muestra `6/6`, `$20.000,00`. La compra no aparece. La compra no aparece. La compra no aparece. La compra no aparece. La compra no aparece.

**Obtenido:** US-80 (Cuotas pendientes) no está implementada: la importación todavía no desplaza las cuotas ni muestra «Faltan 3 de 6»; Movimientos mostraría las 6 cuotas desde junio — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 10/06/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado

**Informe previo del equipo:** No falló, pero el paso a paso está mal redactado: si la compra fue en junio, la compra aparece hasta diciembre.

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-095 — El resto queda en la última cuota pendiente · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Muestra `Faltan 2 de 3 cuotas ($66.666,67)`. Resultado suma `$66.666,67`. Transacción amount `66666.67`; cuota 2/3 `33333.33` en `2026-10-01`; 3/3 `33333.34` en `2026-11-01`; suma exacta `66666.67`.

**Obtenido:** US-80 (Cuotas pendientes) no está implementada: no muestra «Faltan 2 de 3 cuotas ($66.666,67)»; el resumen suma Vas a importar 1 movimiento: $100.000,00 en gastos y $0,00 en ingresos (en pesos). — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 15/09/2026 · Gasto · Otros · Tarjeta de crédito · 3 cuotas $100.000,00» · Vas a importar 1 movimiento: $100.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado

**Informe previo del equipo:** Falló: no se cumple a partir del paso 10.

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-096 — P igual a N desplaza todas las cuotas a H · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Muestra `Faltan 6 de 6 cuotas ($120.000,00)`. Resultado suma `$120.000,00`. amount `120000.00`, installments_paid 0, first_period `2026-10-01`; cuotas 1–6 de `20000.00` entre octubre 2026 y marzo 2027.

**Obtenido:** US-80 (Cuotas pendientes) no está implementada: no muestra «Faltan 6 de 6 cuotas ($120.000,00)»; no existe el campo `installments_paid` — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 15/09/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado

**Informe previo del equipo:** Falló a partir del paso 10 (la suma sí es correcta); no pudo ejecutar el paso 12.

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-097 — Cuotas pendientes vacía conserva calendario normal · **DUDA**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Fila lista; muestra `6 cuotas`, no texto `Faltan`. Resultado suma `$240.000,00`. Seis cuotas de `40000.00` desde `2026-09-01` a `2027-02-01`; installments_paid null.

**Obtenido:** Pasa con la app actual, pero también pasaría sin US-80 (la columna `installments_paid` no existe y no se pudo verificar que sea null); el caso no prueba nada hasta que US-80 esté implementada — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 15/09/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $240.000,00» · Vas a importar 1 movimiento: $240.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado

**Informe previo del equipo:** No pudo ejecutar el paso 12.

**Defectos:** —

**Notas:** Pasa con la app actual, pero hay dudas sobre lo que prueba o sobre el caso (ver «Obtenido»).

### CP-IMP-098 — Sin columna Cuotas pendientes conserva calendario normal · **DUDA**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Fila lista; `6 cuotas`. Resultado suma `$240.000,00`. Seis cuotas de `40000.00`, septiembre 2026 a febrero 2027; installments_paid null.

**Obtenido:** Pasa con la app actual, pero también pasaría sin US-80 (no se pudo verificar installments_paid null: la columna no existe)

**Informe previo del equipo:** No pudo ejecutar el paso 12.

**Defectos:** —

**Notas:** Pasa con la app actual, pero hay dudas sobre lo que prueba o sobre el caso (ver «Obtenido»).

### CP-IMP-099 — F19 con Cuotas vacía · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Fila 2 `Con error`; muestra exactamente `Las cuotas pendientes solo van en una compra en cuotas`; importar está deshabilitado.

**Obtenido:** US-80 (Cuotas pendientes) no está implementada: la app ignora la columna «Cuotas pendientes»: no muestra «Las cuotas pendientes solo van en una compra en cuotas» y el botón queda «Importar 1 movimiento» — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 01/09/2026 · Gasto · Otros · Tarjeta de crédito $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado

**Informe previo del equipo:** Falló: «Importar» queda habilitado y no hay mensaje de error; la app ignora la columna «Cuotas pendientes».

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-100 — F19 con Cuotas igual a uno · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Fila 2 `Con error`; muestra exactamente `Las cuotas pendientes solo van en una compra en cuotas`; importar está deshabilitado.

**Obtenido:** US-80 (Cuotas pendientes) no está implementada: la app ignora la columna «Cuotas pendientes»: no muestra «Las cuotas pendientes solo van en una compra en cuotas» y el botón queda «Importar 1 movimiento» — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 01/09/2026 · Gasto · Otros · Tarjeta de crédito $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado

**Informe previo del equipo:** Falló: «Importar» queda habilitado y no hay mensaje de error; la app ignora la columna «Cuotas pendientes».

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-101 — F20 con pendientes cero · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Fila 2 `Con error`; muestra exactamente `Las cuotas pendientes van de 1 a 6`; importar está deshabilitado.

**Obtenido:** US-80 (Cuotas pendientes) no está implementada: la app ignora la columna «Cuotas pendientes»: no muestra «Las cuotas pendientes van de 1 a 6» y el botón queda «Importar 1 movimiento» — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 01/09/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado

**Informe previo del equipo:** Falló: «Importar» queda habilitado y no hay mensaje de error; la app ignora la columna «Cuotas pendientes».

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-102 — F20 con pendientes menos uno · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Fila 2 `Con error`; muestra exactamente `Las cuotas pendientes van de 1 a 6`; importar está deshabilitado.

**Obtenido:** US-80 (Cuotas pendientes) no está implementada: la app ignora la columna «Cuotas pendientes»: no muestra «Las cuotas pendientes van de 1 a 6» y el botón queda «Importar 1 movimiento» — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 01/09/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado

**Informe previo del equipo:** Falló: «Importar» queda habilitado y no hay mensaje de error; la app ignora la columna «Cuotas pendientes».

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-103 — F20 con pendientes siete · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Fila 2 `Con error`; muestra exactamente `Las cuotas pendientes van de 1 a 6`; importar está deshabilitado.

**Obtenido:** US-80 (Cuotas pendientes) no está implementada: la app ignora la columna «Cuotas pendientes»: no muestra «Las cuotas pendientes van de 1 a 6» y el botón queda «Importar 1 movimiento» — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 01/09/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado

**Informe previo del equipo:** Falló: «Importar» queda habilitado y no hay mensaje de error; la app ignora la columna «Cuotas pendientes».

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-104 — F20 con pendientes decimal · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Fila 2 `Con error`; muestra exactamente `Las cuotas pendientes van de 1 a 6`; importar está deshabilitado.

**Obtenido:** US-80 (Cuotas pendientes) no está implementada: la app ignora la columna «Cuotas pendientes»: no muestra «Las cuotas pendientes van de 1 a 6» y el botón queda «Importar 1 movimiento» — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 01/09/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado

**Informe previo del equipo:** Falló: «Importar» queda habilitado y no hay mensaje de error; la app ignora la columna «Cuotas pendientes».

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-105 — F20 con pendientes textual · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Fila 2 `Con error`; muestra exactamente `Las cuotas pendientes van de 1 a 6`; importar está deshabilitado.

**Obtenido:** US-80 (Cuotas pendientes) no está implementada: la app ignora la columna «Cuotas pendientes»: no muestra «Las cuotas pendientes van de 1 a 6» y el botón queda «Importar 1 movimiento» — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 01/09/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado

**Informe previo del equipo:** Falló: «Importar» queda habilitado y no hay mensaje de error; la app ignora la columna «Cuotas pendientes».

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-106 — F20 acepta el mínimo pendiente uno · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Fila 2 `Lista`; muestra `Falta 1 de 6 cuotas ($20.000,00)`.

**Obtenido:** US-80 (Cuotas pendientes) no está implementada: no muestra «Falta 1 de 6 cuotas ($20.000,00)»; la fila muestra «Fila 2 Lista 01/05/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 01/05/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado

**Informe previo del equipo:** Falló: «Importar» queda habilitado y no hay mensaje de error; la app ignora la columna «Cuotas pendientes».

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-107 — F20 acepta el máximo pendiente seis · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Fila 2 `Lista`; muestra `Faltan 6 de 6 cuotas ($120.000,00)`.

**Obtenido:** US-80 (Cuotas pendientes) no está implementada: no muestra «Faltan 6 de 6 cuotas ($120.000,00)»; la fila muestra «Fila 2 Lista 01/09/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 01/09/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado

**Informe previo del equipo:** Falló: «Importar» queda habilitado y no hay mensaje de error; la app ignora la columna «Cuotas pendientes».

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-108 — F21 acepta K igual a meses transcurridos · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Fila 2 `Lista`; muestra `Faltan 3 de 6 cuotas ($60.000,00)`.

**Obtenido:** US-80 (Cuotas pendientes) no está implementada: no muestra «Faltan 3 de 6 cuotas ($60.000,00)»; la fila muestra «Fila 2 Lista 15/07/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 15/07/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado

**Informe previo del equipo:** Falló: «Importar» queda habilitado y no hay mensaje de error; la app ignora la columna «Cuotas pendientes».

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-109 — F21 rechaza K un mes sobre lo posible · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Muestra exactamente `Con esa fecha todavía no puede haber 3 cuotas pagadas`.

**Obtenido:** US-80 (Cuotas pendientes) no está implementada: la app ignora la columna «Cuotas pendientes»: no muestra «Con esa fecha todavía no puede haber 3 cuotas pagadas» y el botón queda «Importar 1 movimiento» — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 15/08/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado

**Informe previo del equipo:** Falló: «Importar» queda habilitado y no hay mensaje de error; la app ignora la columna «Cuotas pendientes».

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-110 — F21 usa singular para una cuota pagada imposible · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Muestra exactamente `Con esa fecha todavía no puede haber 1 cuota pagada`.

**Obtenido:** US-80 (Cuotas pendientes) no está implementada: la app ignora la columna «Cuotas pendientes»: no muestra «Con esa fecha todavía no puede haber 1 cuota pagada» y el botón queda «Importar 1 movimiento» — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 12/10/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado

**Informe previo del equipo:** Falló: «Importar» queda habilitado y no hay mensaje de error; la app ignora la columna «Cuotas pendientes».

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-111 — F15 oculta F20 con cuenta Efectivo · **DUDA**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Muestra solo `Solo los gastos con tarjeta de crédito admiten cuotas`; no muestra F20 ni F21.

**Obtenido:** Pasa con la app actual, pero también pasaría sin US-80 (no hay regla F20/F21 que ocultar); el caso no prueba nada hasta que US-80 esté implementada — Observado en la corrida — Fila 2: error · Solo los gastos con tarjeta de crédito admiten cuotas · «Fila 2 Con error 01/09/2026 · Gasto · Otros · Efectivo · 3 cuotas $120.000,00 Solo los gastos con tarjeta de crédito admiten cuotas» · Vas a importar 0 movimientos: $0,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 0 movimientos» deshabilitado

**Defectos:** —

**Notas:** Pasa con la app actual, pero hay dudas sobre lo que prueba o sobre el caso (ver «Obtenido»).

### CP-IMP-112 — F14e oculta reglas de cuotas pendientes · **DUDA**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Muestra solo `Las cuotas van de 1 a 12`; no muestra F20 ni F21.

**Obtenido:** Pasa con la app actual, pero también pasaría sin US-80 (no hay regla F20/F21 que ocultar); el caso no prueba nada hasta que US-80 esté implementada — Observado en la corrida — Fila 2: error · Las cuotas van de 1 a 12 · «Fila 2 Con error 01/09/2026 · Gasto · Otros · Tarjeta de crédito $120.000,00 Las cuotas van de 1 a 12» · Vas a importar 0 movimientos: $0,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 0 movimientos» deshabilitado

**Defectos:** —

**Notas:** Pasa con la app actual, pero hay dudas sobre lo que prueba o sobre el caso (ver «Obtenido»).

### CP-IMP-113 — USD sin resto conserva solo la cuota 3/3 · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Muestra `Falta 1 de 3 cuotas (US$100,00)`. Resultado `$100.000,00` en gastos. Transacción amount `100.00`, amount_ars `100000.00`; una cuota 3/3 de `100.00` y `100000.00` en octubre.

**Obtenido:** US-80 (Cuotas pendientes) no está implementada: no muestra «Falta 1 de 3 cuotas (US$100,00)»; el resumen suma Vas a importar 1 movimiento: $300.000,00 en gastos y $0,00 en ingresos (en pesos). — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 15/08/2026 · Gasto · Otros · Tarjeta de crédito · TC 1.000,00 · 3 cuotas US$300,00» · Vas a importar 1 movimiento: $300.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado

**Informe previo del equipo:** No pudo hacer el paso 12.

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-114 — USD con resto reparte ARS exacto entre dos cuotas · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Muestra `Faltan 2 de 3 cuotas (US$66,67)` y `Vas a importar 1 movimiento: $66.670,00 en gastos...`. Resultado suma `$66.670,00`. Cuotas 2/3 `33.33` y 3/3 `33.34`; cada amount_ars `33335.00`; suma `66670.00` igual a amount_ars.

**Obtenido:** US-80 (Cuotas pendientes) no está implementada: no muestra «Faltan 2 de 3 cuotas (US$66,67)»; el resumen suma Vas a importar 1 movimiento: $100.000,00 en gastos y $0,00 en ingresos (en pesos). — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 15/09/2026 · Gasto · Otros · Tarjeta de crédito · TC 1.000,00 · 3 cuotas US$100,00» · Vas a importar 1 movimiento: $100.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado

**Informe previo del equipo:** Falló a partir del paso 10: ignora la columna «Cuotas pendientes».

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-115 — Paso 2 y Resultado muestran el mismo saldo pendiente · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Exactamente `Vas a importar 1 movimiento: $60.000,00 en gastos y $0,00 en ingresos (en pesos).`. Exactamente `$60.000,00 en gastos y $0,00 en ingresos (en pesos).`.

**Obtenido:** US-80 (Cuotas pendientes) no está implementada: el resumen dice «Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos).» en lugar de $60.000,00 (la app toma las 6 cuotas, $120.000,00) — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 10/06/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado

**Informe previo del equipo:** Está ok, pero los pasos 10 y 11 están mal redactados porque el monto del pre-requisito es $120.000.

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-116 — Resumen cuenta la cuota heredada de una compra empezada · **BLOCKED**

**Esperado:** Se abre `/import`, paso 1. Se abre selector. Fila lista. Resultado exitoso. Resumen de octubre de 2026 muestra `Cuotas de meses anteriores` por `$20.000,00`.

**Obtenido:** US-80 (Cuotas pendientes) no está implementada: el Resumen de octubre no tendría «Cuotas de meses anteriores» por $20.000,00: sin US-80 la compra se imputa desde junio y no hay cuota heredada de ese monto — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 10/06/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-117 — Borrado enumera solo imputaciones guardadas no cerradas · **BLOCKED**

**Esperado:** Se ve la compra como `5/6`. Se muestran las acciones del movimiento. El diálogo lista solo octubre de 2026, cuota `4/6`, `$20.000,00`; no lista junio–septiembre ni recalcula seis cuotas.

**Obtenido:** US-80 (Cuotas pendientes) no está implementada: create_transaction no tiene el parámetro p_installments_paid y el borrado no puede listar solo las cuotas no cerradas de una compra empezada. El caso además exige avanzar el reloj del dominio al 12/11/2026, que no se puede en el entorno

**Informe previo del equipo:** No puede testearlo.

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-118 — installments_paid igual al total se rechaza · **BLOCKED**

**Esperado:** HTTP 400; JSON `code:"23514"`, `message:"Las cuotas ya pagadas tienen que ser menos que el total de cuotas"`. No hay transacciones ni imputaciones.

**Obtenido:** US-80 (Cuotas pendientes) no está implementada: create_transaction no tiene el parámetro p_installments_paid (HTTP 404 PGRST202) — Observado en la corrida — HTTP 404 {"code":"PGRST202","details":"Searched for the function public.create_transaction with parameters p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_installments_paid, p_occurred_on, p_request_id, p_type or with a single unnamed json/jsonb parameter,

**Informe previo del equipo:** No puede testearlo.

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-119 — installments_paid negativo se rechaza · **BLOCKED**

**Esperado:** HTTP 400; JSON `code:"23514"`, `message:"Las cuotas ya pagadas tienen que ser menos que el total de cuotas"`. No hay transacciones ni imputaciones.

**Obtenido:** US-80 (Cuotas pendientes) no está implementada: create_transaction no tiene el parámetro p_installments_paid (HTTP 404 PGRST202) — Observado en la corrida — HTTP 404 {"code":"PGRST202","details":"Searched for the function public.create_transaction with parameters p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_installments_paid, p_occurred_on, p_request_id, p_type or with a single unnamed json/jsonb parameter,

**Informe previo del equipo:** No puede testearlo.

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-120 — installments_paid en una cuota se rechaza · **BLOCKED**

**Esperado:** HTTP 400; JSON `code:"23514"`, `message:"Las cuotas ya pagadas solo van en una compra en cuotas"`. No hay transacciones ni imputaciones.

**Obtenido:** US-80 (Cuotas pendientes) no está implementada: create_transaction no tiene el parámetro p_installments_paid (HTTP 404 PGRST202) — Observado en la corrida — HTTP 404 {"code":"PGRST202","details":"Searched for the function public.create_transaction with parameters p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_installments_paid, p_occurred_on, p_request_id, p_type or with a single unnamed json/jsonb parameter,

**Informe previo del equipo:** No puede testearlo.

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-121 — Una cuota pagada con fecha de hoy se rechaza · **BLOCKED**

**Esperado:** HTTP 400; JSON `code:"23514"`, `message:"Con esa fecha todavía no puede haber tantas cuotas pagadas"`. No hay transacciones ni imputaciones.

**Obtenido:** US-80 (Cuotas pendientes) no está implementada: create_transaction no tiene el parámetro p_installments_paid (HTTP 404 PGRST202) — Observado en la corrida — HTTP 404 {"code":"PGRST202","details":"Searched for the function public.create_transaction with parameters p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_installments_paid, p_occurred_on, p_request_id, p_type or with a single unnamed json/jsonb parameter,

**Informe previo del equipo:** No puede testearlo.

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-122 — Compra empezada compartida se rechaza · **BLOCKED**

**Esperado:** HTTP 400; `code:"23514"`; `message:"Una compra empezada no se puede compartir"`. No hay filas.

**Obtenido:** US-80 (Cuotas pendientes) no está implementada: create_transaction no tiene el parámetro p_installments_paid (HTTP 404 PGRST202) — Observado en la corrida — HTTP 404 {"code":"PGRST202","details":"Searched for the function public.create_transaction with parameters p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_installments_paid, p_occurred_on, p_request_id, p_shared_amount, p_shared_person, p_type or with a si

**Informe previo del equipo:** No puede testearlo.

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-123 — installments_paid decimal se rechaza por tipo · **BLOCKED**

**Esperado:** HTTP 400; JSON `code:"22P02"`; no devuelve UUID. No hay filas.

**Obtenido:** US-80 (Cuotas pendientes) no está implementada: create_transaction no tiene el parámetro p_installments_paid (HTTP 404 PGRST202) — Observado en la corrida — HTTP 404 {"code":"PGRST202","details":"Searched for the function public.create_transaction with parameters p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_installments_paid, p_occurred_on, p_request_id, p_type or with a single unnamed json/jsonb parameter,

**Informe previo del equipo:** No puede testearlo.

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-124 — import_transactions rechaza una installments_paid inválida y continúa · **BLOCKED**

**Esperado:** HTTP 200; `sent_rows:2`, `imported_rows:1`; fila 1 tiene `status:"imported"`; fila 2 tiene `status:"rejected"`, `error_code:"23514"` y `error_message:"Las cuotas ya pagadas tienen que ser menos que el total de cuotas"`. Existe solo la transacción de fila 1.

**Obtenido:** US-80 (Cuotas pendientes) no está implementada: import_transactions ignora `installments_paid`: la fila 2 no se rechaza con el mensaje esperado — Observado en la corrida — HTTP 200 {"rows":[{"row":1,"status":"imported","transaction_id":"d291a0e8-67f4-4927-90ff-4d21389355ed"},{"row":2,"status":"imported","transaction_id":"bf563d38-267a-4da4-9b78-15da445c2c02"}],"import_id":"12412412-0000-4000-8000-000000000124","sent_rows":2,"imported_rows":2,"already_imported":false}

**Informe previo del equipo:** No puede testearlo.

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-125 — installments_paid null crea una compra normal · **BLOCKED**

**Esperado:** HTTP 200 y UUID. amount `120000.00`, installments_paid null; seis cuotas 1–6 desde junio a noviembre de 2026.

**Obtenido:** US-80 (Cuotas pendientes) no está implementada: create_transaction no tiene el parámetro p_installments_paid (HTTP 404 PGRST202) — Observado en la corrida — HTTP 404 {"code":"PGRST202","details":"Searched for the function public.create_transaction with parameters p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_installments_paid, p_occurred_on, p_request_id, p_type or with a single unnamed json/jsonb parameter,

**Informe previo del equipo:** No puede testearlo.

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-126 — installments_paid ausente crea una compra normal · **DUDA**

**Esperado:** HTTP 200 y UUID. amount `120000.00`, installments_paid null; seis cuotas 1–6 desde junio a noviembre de 2026.

**Obtenido:** Pasa con la app actual, pero también pasaría sin US-80 (la columna `installments_paid` no existe y no se pudo verificar que sea null) — Observado en la corrida — HTTP 200 "58ee07f1-b876-4511-8b46-8a9923d12a97"

**Informe previo del equipo:** No puede testearlo.

**Defectos:** —

**Notas:** Pasa con la app actual, pero hay dudas sobre lo que prueba o sobre el caso (ver «Obtenido»).

### CP-IMP-127 — La guía está cerrada por defecto · **BLOCKED**

**Esperado:** Se abre `/import`, paso `1 Archivo`. Se ve `¿Cómo armo el archivo?` con `data-testid="import-guide-open"`; `import-guide-dialog` no está en el DOM.

**Obtenido:** US-81 (guía «¿Cómo armo el archivo?») no está implementada — Observado en la corrida — import-guide-open: no existe; texto «¿Cómo armo el archivo?»: no existe

**Informe previo del equipo:** Falló: no se cumple el paso 9.

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-128 — Recargar y volver a entrar no abre la guía · **BLOCKED**

**Esperado:** Se abre `/import`, paso `1 Archivo`. Sigue en paso 1; la guía está cerrada. Se abre Registrar. Vuelve a `/import`; la guía sigue cerrada.

**Obtenido:** US-81 (guía «¿Cómo armo el archivo?») no está implementada — Observado en la corrida — import-guide-open: no existe; texto «¿Cómo armo el archivo?»: no existe

**Informe previo del equipo:** Falló: no existe el botón «¿Cómo armo el archivo?», no lo puede ejecutar.

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-129 — La guía muestra todo el contenido exacto · **BLOCKED**

**Esperado:** Se abre `/import`, paso `1 Archivo`. Se abre `role="dialog"`, `aria-modal="true"`, `data-testid="import-guide-dialog"`; título, introducción, seis pasos, tabla y pie coinciden carácter por carácter con Datos; existen `import-guide-steps`, `import-guide-example`, `import-guide-template-download`, `import-guide-done` e `import-guide-close`.

**Obtenido:** US-81 (guía «¿Cómo armo el archivo?») no está implementada — Observado en la corrida — import-guide-open: no existe; texto «¿Cómo armo el archivo?»: no existe

**Informe previo del equipo:** Falló: no existe el botón «¿Cómo armo el archivo?», no lo puede ejecutar.

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-130 — Cerrar con Entendido devuelve el foco · **BLOCKED**

**Esperado:** Se abre `/import`, paso `1 Archivo`. Se abre la guía. La guía se cierra, deja de estar en el DOM y el foco vuelve a `¿Cómo armo el archivo?`.

**Obtenido:** US-81 (guía «¿Cómo armo el archivo?») no está implementada — Observado en la corrida — import-guide-open: no existe; texto «¿Cómo armo el archivo?»: no existe

**Informe previo del equipo:** Falló: no existe el botón «¿Cómo armo el archivo?», no lo puede ejecutar.

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-131 — Cerrar con el botón cerrar devuelve el foco · **BLOCKED**

**Esperado:** Se abre `/import`, paso `1 Archivo`. Se abre la guía. La guía se cierra, deja de estar en el DOM y el foco vuelve a `¿Cómo armo el archivo?`.

**Obtenido:** US-81 (guía «¿Cómo armo el archivo?») no está implementada — Observado en la corrida — import-guide-open: no existe; texto «¿Cómo armo el archivo?»: no existe

**Informe previo del equipo:** Falló: no existe el botón «¿Cómo armo el archivo?», no lo puede ejecutar.

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-132 — Cerrar con Escape devuelve el foco · **BLOCKED**

**Esperado:** Se abre `/import`, paso `1 Archivo`. Se abre la guía. La guía se cierra, deja de estar en el DOM y el foco vuelve a `¿Cómo armo el archivo?`.

**Obtenido:** US-81 (guía «¿Cómo armo el archivo?») no está implementada — Observado en la corrida — import-guide-open: no existe; texto «¿Cómo armo el archivo?»: no existe

**Informe previo del equipo:** Falló: no existe el botón «¿Cómo armo el archivo?», no lo puede ejecutar.

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-133 — Cerrar con un click exterior devuelve el foco · **BLOCKED**

**Esperado:** Se abre `/import`, paso `1 Archivo`. Se abre la guía. La guía se cierra, deja de estar en el DOM y el foco vuelve a `¿Cómo armo el archivo?`.

**Obtenido:** US-81 (guía «¿Cómo armo el archivo?») no está implementada — Observado en la corrida — import-guide-open: no existe; texto «¿Cómo armo el archivo?»: no existe

**Informe previo del equipo:** Falló: no existe el botón «¿Cómo armo el archivo?», no lo puede ejecutar.

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-134 — El foco inicial va a Cerrar guía · **BLOCKED**

**Esperado:** Se abre `/import`, paso `1 Archivo`. Se abre la guía y `document.activeElement` es el botón con `aria-label="Cerrar guía"`.

**Obtenido:** US-81 (guía «¿Cómo armo el archivo?») no está implementada — Observado en la corrida — import-guide-open: no existe; texto «¿Cómo armo el archivo?»: no existe

**Informe previo del equipo:** No sabe cómo testearlo.

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-135 — Tab y Shift+Tab quedan atrapados en el diálogo · **BLOCKED**

**Esperado:** Se abre `/import`, paso `1 Archivo`. Se abre la guía. En cada pulsación el foco visible queda dentro de `import-guide-dialog`; nunca llega a la página. En cada pulsación el foco visible sigue dentro del diálogo.

**Obtenido:** US-81 (guía «¿Cómo armo el archivo?») no está implementada — Observado en la corrida — import-guide-open: no existe; texto «¿Cómo armo el archivo?»: no existe

**Informe previo del equipo:** Falló: no existe el botón «¿Cómo armo el archivo?», no lo puede ejecutar.

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-136 — Descargar plantilla desde la guía produce el mismo libro · **BLOCKED**

**Esperado:** Se abre `/import`, paso `1 Archivo`. Se abre la guía. Se descarga `biyu-plantilla-importacion.xlsx`. Hojas y celdas coinciden exactamente con Datos y con CP-IMP-003.

**Obtenido:** US-81 (guía «¿Cómo armo el archivo?») no está implementada — Observado en la corrida — import-guide-open: no existe; texto «¿Cómo armo el archivo?»: no existe

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-137 — Se puede importar sin abrir la guía · **DUDA**

**Esperado:** Se abre `/import`, paso `1 Archivo`. Se abre selector; nunca se abrió la guía. Se abre Revisión con una fila lista. Se ve `Se importó 1 de 1 fila.`; no apareció aviso sobre la guía.

**Obtenido:** Pasa (se importa sin abrir la guía), pero la guía no existe todavía (US-81): el caso no prueba nada sobre ella

**Defectos:** —

**Notas:** Pasa con la app actual, pero hay dudas sobre lo que prueba o sobre el caso (ver «Obtenido»).

### CP-IMP-138 — Abrir y cerrar la guía conserva archivo, resumen, filtro y URL · **BLOCKED**

**Esperado:** Se abre `/import`, paso `1 Archivo`. Selector. Revisión: 11/7/4; URL `/import`. Filtro encendido; filas 7–10. Guía abierta sobre Revisión. Guía cerrada; mismo nombre de archivo, resumen 11/7/4, filtro encendido, filas 7–10 y URL `/import`.

**Obtenido:** US-81 (guía «¿Cómo armo el archivo?») no está implementada: los pasos 12 y 13 piden abrir y cerrar la guía. Verificado hasta el paso 11: resumen 11/7/4 y filas 7 a 10 con el filtro encendido — Observado en la corrida — Revisión con filtro de errores: filas 7,8,9,10; import-guide-open: no existe

**Informe previo del equipo:** Falló: no existe el botón «¿Cómo armo el archivo?». Además, el archivo de IMP-DATA-01 está mal hecho.

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-139 — El botón de guía no existe en Resultado · **DUDA**

**Esperado:** Se abre `/import`, paso `1 Archivo`. Una fila lista. Se abre Resultado. No se ve `¿Cómo armo el archivo?` y `import-guide-open` no está en el DOM.

**Obtenido:** Pasa (en Resultado no hay botón de guía), pero el botón no existe en ninguna pantalla todavía (US-81): el caso no prueba nada hasta que exista

**Informe previo del equipo:** No entiende cómo testearlo.

**Defectos:** —

**Notas:** Pasa con la app actual, pero hay dudas sobre lo que prueba o sobre el caso (ver «Obtenido»).

### CP-IMP-140 — El botón de guía se deshabilita mientras importa · **BLOCKED**

**Esperado:** Se abre `/import`, paso `1 Archivo`. Una fila lista; se ve guía. Muestra `Importando…`. El botón está deshabilitado; no se abre `import-guide-dialog`.

**Obtenido:** US-81 (guía «¿Cómo armo el archivo?») no está implementada — Observado en la corrida — import-guide-open: no existe; texto «¿Cómo armo el archivo?»: no existe

**Informe previo del equipo:** Falló: no existe el botón «¿Cómo armo el archivo?», no lo puede ejecutar.

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-IMP-141 — La guía móvil mantiene márgenes y scroll interno · **BLOCKED**

**Esperado:** Se abre `/import`, paso `1 Archivo`. El diálogo mide 358 px y deja 16 px a cada lado. Su contenido scrollea dentro del panel; la página de atrás no se desplaza. El valor es menor o igual a `390`. La tabla se recorre completa; el diálogo y la página no generan scroll horizontal.

**Obtenido:** US-81 (guía «¿Cómo armo el archivo?») no está implementada — Observado en la corrida — import-guide-open: no existe; texto «¿Cómo armo el archivo?»: no existe

**Informe previo del equipo:** Falló: no existe el botón «¿Cómo armo el archivo?», no lo puede ejecutar.

**Defectos:** —

**Notas:** BLOQUEADO por funcionalidad inexistente: repetir el caso en V3. Sin defecto: depende de una historia pendiente.

### CP-SUS-065 — Rechazar en API `create_subscription` sin sesión autenticada (rol `anon`) · **FAILED**

**Esperado:** Respuesta HTTP `403 Forbidden` con `"code": "42501"` (`permission denied for function create_subscription`).

**Obtenido:** esperado HTTP 403 42501; obtenido HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function create_subscription"} (el código 42501 coincide; cambia el HTTP: la API responde 401 al rol anon) — Observado en la corrida — HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function create_subscription"}

**Informe previo del equipo:** No sabe cómo testearlo.

**Defectos:** DEF-035

### CP-SUS-066 — Rechazar en API `GET /rest/v1/subscriptions` sin sesión autenticada (rol `anon`) · **FAILED**

**Esperado:** Respuesta HTTP `403 Forbidden` con `"code": "42501"` (`permission denied for table subscriptions`).

**Obtenido:** esperado HTTP 403 42501; obtenido HTTP 401 {"code":"42501","details":null,"hint":"Grant the required privileges to the current role with: GRANT SELECT ON public.subscriptions TO anon;","message":"permission denied for table subscriptions"} (el código 42501 coincide; cambia el HTTP: la API responde 401 al rol anon) — Observado en la corrida — HTTP 401 {"code":"42501","details":null,"hint":"Grant the required privileges to the current role with: GRANT SELECT ON public.subscriptions TO anon;","message":"permission denied for table subscriptions"}

**Informe previo del equipo:** No sabe cómo testearlo.

**Defectos:** DEF-035

### CP-SUS-094 — Rechazar en API `pause_subscription` usando la sesión de otro usuario (`404 P0002`) · **FAILED**

**Esperado:** Respuesta HTTP `404 Not Found` con `"code": "P0002"` y `"message": "Suscripción no encontrada"`. Respuesta HTTP `200 OK` con `[{"status":"active","paused_at":null}]`.

**Obtenido:** esperado HTTP 404 P0002 «Suscripción no encontrada»; obtenido HTTP 500 {"code":"P0002","details":null,"hint":null,"message":"Suscripción no encontrada"} — Observado en la corrida — HTTP 500 {"code":"P0002","details":null,"hint":null,"message":"Suscripción no encontrada"}

**Informe previo del equipo:** No sabe cómo testearlo.

**Defectos:** DEF-034

### CP-SUS-095 — Rechazar en API `pause_subscription` sin sesión autenticada (rol `anon`) · **FAILED**

**Esperado:** Respuesta HTTP `403 Forbidden` con `"code": "42501"` (`permission denied for function pause_subscription`).

**Obtenido:** esperado HTTP 403 42501; obtenido HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function pause_subscription"} (el código 42501 coincide; cambia el HTTP: la API responde 401 al rol anon) — Observado en la corrida — HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function pause_subscription"}

**Informe previo del equipo:** No sabe cómo testearlo.

**Defectos:** DEF-035

### CP-SUS-100 — Rechazar en API `resume_subscription` usando la sesión de otro usuario (`404 P0002`) · **FAILED**

**Esperado:** Respuesta HTTP `404 Not Found` con `"code": "P0002"` y `"message": "Suscripción no encontrada"`. Respuesta HTTP `200 OK` con `[{"status":"paused"}]`.

**Obtenido:** esperado HTTP 404 P0002 «Suscripción no encontrada»; obtenido HTTP 500 {"code":"P0002","details":null,"hint":null,"message":"Suscripción no encontrada"} — Observado en la corrida — HTTP 500 {"code":"P0002","details":null,"hint":null,"message":"Suscripción no encontrada"}

**Informe previo del equipo:** No sabe cómo testearlo.

**Defectos:** DEF-034

### CP-SUS-101 — Rechazar en API `resume_subscription` sin sesión autenticada (rol `anon`) · **FAILED**

**Esperado:** Respuesta HTTP `403 Forbidden` con `"code": "42501"` (`permission denied for function resume_subscription`).

**Obtenido:** esperado HTTP 403 42501; obtenido HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function resume_subscription"} (el código 42501 coincide; cambia el HTTP: la API responde 401 al rol anon) — Observado en la corrida — HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function resume_subscription"}

**Informe previo del equipo:** No sabe cómo testearlo.

**Defectos:** DEF-035

### CP-SUS-107 — Rechazar en API `cancel_subscription` usando la sesión de otro usuario (`404 P0002`) · **FAILED**

**Esperado:** Respuesta HTTP `404 Not Found` con `"code": "P0002"` y `"message": "Suscripción no encontrada"`. Respuesta HTTP `200 OK` con `[{"status":"active"}]`.

**Obtenido:** esperado HTTP 404 P0002 «Suscripción no encontrada»; obtenido HTTP 500 {"code":"P0002","details":null,"hint":null,"message":"Suscripción no encontrada"} — Observado en la corrida — HTTP 500 {"code":"P0002","details":null,"hint":null,"message":"Suscripción no encontrada"}

**Informe previo del equipo:** No sabe cómo testearlo.

**Defectos:** DEF-034

### CP-SUS-108 — Rechazar en API `cancel_subscription` sin sesión autenticada (rol `anon`) · **FAILED**

**Esperado:** Respuesta HTTP `403 Forbidden` con `"code": "42501"` (`permission denied for function cancel_subscription`).

**Obtenido:** esperado HTTP 403 42501; obtenido HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function cancel_subscription"} (el código 42501 coincide; cambia el HTTP: la API responde 401 al rol anon) — Observado en la corrida — HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function cancel_subscription"}

**Informe previo del equipo:** No sabe cómo testearlo.

**Defectos:** DEF-035

### CP-SUS-129 — Rechazar en API `update_subscription` usando la sesión de otro usuario (`404 P0002`) · **FAILED**

**Esperado:** Respuesta HTTP `404 Not Found` con `"code": "P0002"` y `"message": "Suscripción no encontrada"`. Respuesta HTTP `200 OK` con `[{"name":"Netflix B","amount_text":"5000.00"}]`.

**Obtenido:** esperado HTTP 404 P0002 «Suscripción no encontrada»; obtenido HTTP 500 {"code":"P0002","details":null,"hint":null,"message":"Suscripción no encontrada"} — Observado en la corrida — HTTP 500 {"code":"P0002","details":null,"hint":null,"message":"Suscripción no encontrada"}

**Informe previo del equipo:** No sabe cómo testearlo.

**Defectos:** DEF-034

### CP-SUS-130 — Rechazar en API `update_subscription` sin sesión autenticada (rol `anon`) · **FAILED**

**Esperado:** Respuesta HTTP `403 Forbidden` con `"code": "42501"` (`permission denied for function update_subscription`).

**Obtenido:** esperado HTTP 403 42501; obtenido HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function update_subscription"} (el código 42501 coincide; cambia el HTTP: la API responde 401 al rol anon) — Observado en la corrida — HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function update_subscription"}

**Informe previo del equipo:** No sabe cómo testearlo.

**Defectos:** DEF-035

### CP-SUS-157 — Vista previa en `/subscriptions/new` en USD con tipo de cambio en `<MES_HACE_2>` y sin tipo de cambio en `<MES_ANTERIOR>` marca `<MES_ANTERIOR>` con `data-blocked="true"` y no lo cuenta en el resumen · **FAILED**

**Esperado:** Se abre `/subscriptions`. Se abre `/subscriptions/new`. La moneda queda seleccionada en `"USD"`. El campo muestra `20`. El campo muestra `28`. En `"Se cargan al guardar"` (`subscription-form-preview-due`), la fila `subscription-form-preview-due-item` con `data-period="<MES_HACE_2>"` tiene `data-blocked="false"`, la fila con `data-period="<MES_ANTERIOR>"` tiene `data-blocked="true"` y muestra `"Sin tipo de cambio: se carga cuando lo cargues"`, y el resumen (`subscription-form-preview-summary`) dice `"Al guardar se carga 1 gasto de USD 20,00."`.

**Obtenido:** la fila de 2026-08 no tiene data-blocked="false" (el atributo está ausente; solo se escribe cuando la fila está bloqueada) — Observado en la corrida — 2026-08: data-blocked=null; 2026-09: data-blocked=true; texto «septiembre 2026 · 28/09/2026 Sin tipo de cambio: se carga cuando lo cargues»; resumen: Al guardar se carga 1 gasto de USD 20,00.

**Informe previo del equipo:** No especifica los pasos correctamente.

**Defectos:** DEF-036


## Resultado obtenido de los casos que ejecutó Claude Code

| Caso | Status | Obtenido |
|---|---|---|
| CP-DEU-029 | BLOCKED | No se pudo ejecutar como está escrito. Se probaron tres variantes en el entorno local: (A) el caso tal cual (sin sesión, con p_shared_persons y p_shared_amounts): responde 404 PGRST202 «función no encontrada» y no 401/42501; (B) sin sesión con la función actual de una sola persona (p_shared_person): responde 401 con el código 42501 «permission denied for function create_transaction» (sin sesión no se puede crear gastos); (C) con sesión y la firma de varias personas: también 404. Por eso el resultado esperado no puede comprobarse hasta que exista la función. |
| CP-DEU-100 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-101 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-102 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-102B | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-103 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-104 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-105 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-106 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-107 | PASSED | La respuesta de la API coincide con la esperada. |
| CP-DEU-108 | PASSED | La respuesta de la API coincide con la esperada. |
| CP-DEU-108B | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-108C | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-109 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-110 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-111 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-111B | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-112 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-113 | PASSED | La respuesta de la API coincide con la esperada y no se creó ni cambió nada. |
| CP-DEU-114 | PASSED | La respuesta de la API coincide con la esperada y no se creó ni cambió nada. |
| CP-DEU-114B | PASSED | La respuesta de la API coincide con la esperada y no se creó ni cambió nada. |
| CP-DEU-115 | PASSED | La respuesta de la API coincide con la esperada y no se creó ni cambió nada. |
| CP-DEU-116 | PASSED | La respuesta de la API coincide con la esperada y no se creó ni cambió nada. |
| CP-DEU-116B | PASSED | La respuesta de la API coincide con la esperada y no se creó ni cambió nada. |
| CP-DEU-117 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-118 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-119 | PASSED | La respuesta de la API coincide con la esperada y no se creó ni cambió nada. |
| CP-DEU-119B | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-120 | PASSED | La respuesta de la API coincide con la esperada y no se creó ni cambió nada. |
| CP-DEU-120B | PASSED | La respuesta de la API coincide con la esperada y no se creó ni cambió nada. |
| CP-DEU-121 | PASSED | La respuesta de la API coincide con la esperada y no se creó ni cambió nada. |
| CP-DEU-122 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-123 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-124 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-125 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-126 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-126B | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-126C | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-127 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-127B | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-127C | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-128 | BLOCKED | La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe). |
| CP-DEU-128B | BLOCKED | La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe). |
| CP-DEU-129 | BLOCKED | La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe). |
| CP-DEU-129B | BLOCKED | La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe). |
| CP-DEU-129C | BLOCKED | La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe). |
| CP-DEU-130 | BLOCKED | La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe). |
| CP-DEU-130B | BLOCKED | La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe). |
| CP-DEU-130C | BLOCKED | La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe). |
| CP-DEU-130D | BLOCKED | La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe). |
| CP-DEU-131 | BLOCKED | La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe). |
| CP-DEU-132 | BLOCKED | La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe). |
| CP-DEU-132B | BLOCKED | La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe). |
| CP-DEU-132C | BLOCKED | La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe). |
| CP-DEU-132D | BLOCKED | La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe). |
| CP-DEU-133 | BLOCKED | La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe). |
| CP-DEU-134 | BLOCKED | La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe). |
| CP-DEU-135 | BLOCKED | La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe). |
| CP-DEU-135B | BLOCKED | La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe). |
| CP-DEU-135C | BLOCKED | La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe). |
| CP-DEU-135D | BLOCKED | La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe). |
| CP-DEU-136 | BLOCKED | La preparación del caso necesita la función de varias personas (US-82, issue #270), que todavía no existe: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada»). Observado: se puede crear el gasto compartido con 3 personas (preparación del caso) (obtenido: 404 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_occurred_on, p_sh. |
| CP-DEU-136B | BLOCKED | La preparación del caso necesita la función de varias personas (US-82, issue #270), que todavía no existe: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada»). Observado: se puede crear el gasto compartido con 3 personas (preparación del caso) (obtenido: 404 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_occurred_on, p_sh. |
| CP-DEU-136C | BLOCKED | La preparación del caso necesita la función de varias personas (US-82, issue #270), que todavía no existe: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada»). Observado: se puede crear el gasto compartido con 3 personas (preparación del caso) (obtenido: 404 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_occurred_on, p_sh. |
| CP-DEU-136D | BLOCKED | La preparación del caso necesita la función de varias personas (US-82, issue #270), que todavía no existe: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada»). Observado: se puede crear el gasto compartido con 3 personas (preparación del caso) (obtenido: 404 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_occurred_on, p_sh. |
| CP-DEU-136E | BLOCKED | La preparación del caso necesita la función de varias personas (US-82, issue #270), que todavía no existe: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada»). Observado: se puede crear el gasto compartido con 3 personas (preparación del caso) (obtenido: 404 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_occurred_on, p_sh. |
| CP-DEU-137 | BLOCKED | La función de varias personas (US-82, issue #270) no existe todavía: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada» en vez del rechazo esperado). Observado: 400 con 23514 y «Un gasto compartido necesita una persona y un monto por cada deuda» (obtenido: 404 PGRST202 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count. |
| CP-DEU-138 | BLOCKED | La función de varias personas (US-82, issue #270) no existe todavía: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada» en vez del rechazo esperado). Observado: 400 con 23514 y «Un gasto compartido necesita al menos una persona» (obtenido: 404 PGRST202 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_occurred_on, . |
| CP-DEU-139 | BLOCKED | La función de varias personas (US-82, issue #270) no existe todavía: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada» en vez del rechazo esperado). Observado: 400 con 23514 y «Un gasto se comparte con hasta 10 personas» (obtenido: 404 PGRST202 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_occurred_on, p_share. |
| CP-DEU-140 | BLOCKED | La función de varias personas (US-82, issue #270) no existe todavía: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada» en vez del rechazo esperado). Observado: 400 con 23514 y «Cada persona puede aparecer una sola vez» (obtenido: 404 PGRST202 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_occurred_on, p_shared_. |
| CP-DEU-141 | BLOCKED | La función de varias personas (US-82, issue #270) no existe todavía: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada» en vez del rechazo esperado). Observado: 400 con 23514 y «I7: la suma de las deudas no puede superar el monto del gasto» (obtenido: 404 PGRST202 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_o. |
| CP-DEU-142 | BLOCKED | La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe). |
| CP-DEU-142A | BLOCKED | La función de varias personas (US-82, issue #270) no existe todavía: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada» en vez del rechazo esperado). Observado: 400 con 23514 y «I7: en pesos, la suma de las deudas supera el gasto por redondeo» (obtenido: 404 PGRST202 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, . |
| CP-DEU-142B | BLOCKED | La función de varias personas (US-82, issue #270) no existe todavía: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada» en vez del rechazo esperado). Observado: 400 con 23514 y «Ingresá con quién compartiste el gasto» (obtenido: 404 PGRST202 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_occurred_on, p_shared_am. |
| CP-DEU-143 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-144 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-145 | DUDA | El caso pide 12 cuotas con la cuenta «Efectivo», pero la app solo permite cuotas con una cuenta de tarjeta de crédito: la preparación del caso no se puede hacer tal como está escrita. Se ejecutó con la cuenta «Tarjeta de crédito». La app hace lo esperado con la cuenta «Tarjeta de crédito»: agosto 2026 muestra total $10.000,00, neto -$50.000,00 y la aclaración del neto; septiembre 2026 muestra total $10.000,00 y no muestra la fila del neto. |
| CP-DEU-146 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-147 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-148 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-148B | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-149 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-150 | PASSED | Coincide con el resultado esperado en cada paso (verificado en la pantalla y, donde el caso lo pide, en la base). |
| CP-DEU-151 | BLOCKED | La función «deudas sueltas en el balance del mes» (US-83, issue #271) todavía no existe: el Resumen no muestra «Incluye deudas sueltas» ni suma o resta las deudas sueltas en el balance. Observado: mes actual: balance $80.000,00 (obtenido: "$100.000,00" no contiene "$80.000,00"); mes actual: «Incluye deudas sueltas: -$20.000,00» (obtenido: "no existe la línea" no contiene "Incluye deudas sueltas: -$20.000,00"). |
| CP-DEU-152 | BLOCKED | La función «deudas sueltas en el balance del mes» (US-83, issue #271) todavía no existe: el Resumen no muestra «Incluye deudas sueltas» ni suma o resta las deudas sueltas en el balance. Observado: mes actual: balance $150.000,00 (obtenido: "$100.000,00" no contiene "$150.000,00"); mes actual: «Incluye deudas sueltas: $50.000,00» (obtenido: "no existe la línea" no contiene "Incluye deudas sueltas: $50.000,00"). |
| CP-DEU-153 | BLOCKED | La función «deudas sueltas en el balance del mes» (US-83, issue #271) todavía no existe: el Resumen no muestra «Incluye deudas sueltas» ni suma o resta las deudas sueltas en el balance. Observado: mes actual: «Incluye deudas sueltas: $0,00» (obtenido: "no existe la línea" no contiene "Incluye deudas sueltas: $0,00"). |
| CP-DEU-153B | BLOCKED | La función «deudas sueltas en el balance del mes» (US-83, issue #271) todavía no existe: el Resumen no muestra «Incluye deudas sueltas» ni suma o resta las deudas sueltas en el balance. Observado: mes actual: balance $0,00 (obtenido: "sin balance" no contiene "$0,00"); mes actual: etiqueta «En cero» (obtenido: "sin etiqueta" no contiene "En cero"); mes actual: «Incluye deudas sueltas: $0,00» (obtenido: "no existe la línea" no contiene "Incluye deudas su. |
| CP-DEU-154 | BLOCKED | La función «deudas sueltas en el balance del mes» (US-83, issue #271) todavía no existe: el Resumen no muestra «Incluye deudas sueltas» ni suma o resta las deudas sueltas en el balance. Observado: mes anterior: balance -$20.000,00 (obtenido: "sin balance" no contiene "-$20.000,00"); mes anterior: etiqueta «Déficit» (obtenido: "sin etiqueta" no contiene "Déficit"); mes anterior: «Incluye deudas sueltas: -$20.000,00» (obtenido: "no existe la línea" no con. |
| CP-DEU-155 | BLOCKED | La función «deudas sueltas en el balance del mes» (US-83, issue #271) todavía no existe: el Resumen no muestra «Incluye deudas sueltas» ni suma o resta las deudas sueltas en el balance. Observado: mes anterior: balance -$20.000,00 (obtenido: "sin balance" no contiene "-$20.000,00"); mes anterior: «Incluye deudas sueltas: -$20.000,00» (obtenido: "no existe la línea" no contiene "Incluye deudas sueltas: -$20.000,00"). |
| CP-DEU-156 | BLOCKED | La función «deudas sueltas en el balance del mes» (US-83, issue #271) todavía no existe: el Resumen no muestra «Incluye deudas sueltas» ni suma o resta las deudas sueltas en el balance. Observado: mes anterior: balance $50.000,00 (obtenido: "sin balance" no contiene "$50.000,00"); mes anterior: etiqueta «Superávit» (obtenido: "sin etiqueta" no contiene "Superávit"); mes anterior: «Incluye deudas sueltas: $50.000,00» (obtenido: "no existe la línea" no co. |
| CP-DEU-157 | BLOCKED | La función «deudas sueltas en el balance del mes» (US-83, issue #271) todavía no existe: el Resumen no muestra «Incluye deudas sueltas» ni suma o resta las deudas sueltas en el balance. Observado: mes anterior: balance -$50.000,00 (obtenido: "sin balance" no contiene "-$50.000,00"); mes anterior: «Incluye deudas sueltas: -$50.000,00» (obtenido: "no existe la línea" no contiene "Incluye deudas sueltas: -$50.000,00"); mes actual: balance $50.000,00 (obten. |
| CP-DEU-158 | DUDA | Pasa con la app actual, pero también pasaría si la función de deudas sueltas (US-83) no existiera: la línea «Incluye deudas sueltas» todavía no se muestra en ningún caso, así que el caso no prueba nada hasta que US-83 esté implementada. Se cumple todo lo esperado (balance -$120.000,00 antes y después de saldar la deuda y sin la línea «Incluye deudas sueltas»). |
| CP-DEU-159 | BLOCKED | La función «deudas sueltas en el balance del mes» (US-83, issue #271) todavía no existe: el Resumen no muestra «Incluye deudas sueltas» ni suma o resta las deudas sueltas en el balance. Observado: no muestra el estado vacío del mes (obtenido: 1 ≠ 0); balance -$20.000,00 (obtenido: "sin balance" no contiene "-$20.000,00"); etiqueta «Déficit» (obtenido: "sin etiqueta" no contiene "Déficit"); línea «Incluye deudas sueltas: -$20.000,00» (obtenido: "no exist. |
| CP-NAV-013 | PASSED | A 320 px las cuatro etiquetas se leen completas (Registrar, Resumen, Deudas, Suscripciones), sin recorte ni superposición; la última termina a 318,1 px de 320. |
| CP-NAV-014 | PASSED | La consola devolvió [[true,true],[true,true],[true,true],[true,true]]: cada botón mide 80 × 56 px. |
| CP-NAV-015 | PASSED | A 1023 px la barra está fija abajo (ancho completo, 57 px de alto), no hay barra lateral y se ve el engranaje de Ajustes arriba. |
| CP-NAV-016 | PASSED | A 1024 px hay una única barra lateral fija de 240 px con los cuatro ítems y «Ajustes» al pie; no hay barra inferior ni engranaje. |
| CP-NAV-017 | PASSED | A 1280 px se mantiene la barra lateral de 240 px con los cuatro ítems y «Ajustes» al pie; no hay barra inferior. |
| CP-NAV-018 | PASSED | La consola devolvió exactamente [1,1,1,1,1] en Registrar a 375 px: los cinco identificadores aparecen una vez, ninguno repetido. |
| CP-NAV-019 | PASSED | La consola devolvió exactamente [1,1,1,1,1] en Registrar a 1023 px: los cinco identificadores aparecen una vez, ninguno repetido. |
| CP-NAV-020 | PASSED | La consola devolvió exactamente [1,1,1,1,1] en Registrar a 1024 px: los cinco identificadores aparecen una vez, ninguno repetido. |
| CP-NAV-021 | PASSED | La consola devolvió exactamente [1,1,1,1,1] en Registrar a 1280 px: los cinco identificadores aparecen una vez, ninguno repetido. |
| CP-NAV-038 | PASSED | Con latencia de 20.000 ms y 1000 kb/s, el botón dijo «Guardando…», quedó deshabilitado y la pantalla ocupada; el error apareció a los 15,3 s, con el texto de conexión, el aviso de red y el botón «Reintentar». |
| CP-NAV-039 | PASSED | Con el gasto ya creado por API con la clave fija, el fallo sin internet y «Reintentar» mostraron «Gasto guardado» con «$12.500,00 · Comida · Visa BBVA». En Movimientos hay una sola fila de $12.500,00 y la API tiene una sola transacción, activa. |
| CP-NAV-040 | PASSED | Dos pedidos con la misma clave devolvieron 200 y el mismo identificador; hay una transacción y una cuota (imputación). |
| CP-NAV-041 | PASSED | Dos pedidos simultáneos con la misma clave devolvieron 200 y el mismo identificador, sin el código 23505; hay una transacción y una cuota. (Los dos pedidos se lanzaron a la vez con una barrera en Node, equivalente al script de PowerShell del caso original.) |
| CP-NAV-042 | PASSED | Dos claves distintas con el mismo contenido crearon dos transacciones y dos cuotas, con identificadores distintos. |
| CP-NAV-043 | PASSED | La misma clave de dos usuarios creó un gasto para cada uno, con identificadores distintos y el user_id de cada usuario. |
| CP-NAV-044 | PASSED | La misma clave con otro monto (12600) devolvió el identificador original; la fila conserva 12500.00 y no hay ninguna de 12600.00. |
| CP-NAV-045 | PASSED | Archivar la categoría (204) y repetir la clave devolvió 200 y el mismo identificador, sin error; una sola fila. |
| CP-NAV-046 | PASSED | Sin clave, dos llamadas crearon dos transacciones y dos cuotas, con request_id nulo. |
| CP-NAV-048 | PASSED | Con la categoría archivada, el pedido respondió 409 con code 23503 y «la categoría no existe, no es tuya o está archivada»; transacciones y cuotas quedaron en []. |
| CP-NAV-053 | PASSED | «Recuperar» mostró «Ese movimiento ya estaba guardado» con «$12.500,00 · Comida · Visa BBVA»; la fila pendiente desapareció y el formulario quedó vacío en el paso 1. La API sigue con una sola transacción activa. |
| CP-NAV-054 | PASSED | «Recuperar» mostró «Ese movimiento ya estaba guardado y después se eliminó» y «Está en Movimientos, en Eliminados.»; la fila pendiente desapareció y no se creó otro gasto (la API tiene una sola transacción, eliminada). |
| CP-NAV-063 | PASSED | La consola devolvió exactamente [1,1,1,1,1] en Resumen a 375 px: los cinco identificadores aparecen una vez, ninguno repetido. |
| CP-NAV-064 | PASSED | La consola devolvió exactamente [1,1,1,1,1] en Movimientos a 375 px: los cinco identificadores aparecen una vez, ninguno repetido. |
| CP-NAV-065 | PASSED | La consola devolvió exactamente [1,1,1,1,1] en Deudas a 375 px: los cinco identificadores aparecen una vez, ninguno repetido. |
| CP-NAV-066 | PASSED | La consola devolvió exactamente [1,1,1,1,1] en Suscripciones a 375 px: los cinco identificadores aparecen una vez, ninguno repetido. |
| CP-NAV-067 | PASSED | La consola devolvió exactamente [1,1,1,1,1] en Ajustes a 375 px: los cinco identificadores aparecen una vez, ninguno repetido (la app agregó ?period=2026-10 a la dirección de Ajustes). |
| CP-NAV-068 | PASSED | La consola devolvió exactamente [1,1,1,1,1] en Resumen a 1023 px: los cinco identificadores aparecen una vez, ninguno repetido. |
| CP-NAV-069 | PASSED | La consola devolvió exactamente [1,1,1,1,1] en Movimientos a 1023 px: los cinco identificadores aparecen una vez, ninguno repetido. |
| CP-NAV-070 | PASSED | La consola devolvió exactamente [1,1,1,1,1] en Deudas a 1023 px: los cinco identificadores aparecen una vez, ninguno repetido. |
| CP-NAV-071 | PASSED | La consola devolvió exactamente [1,1,1,1,1] en Suscripciones a 1023 px: los cinco identificadores aparecen una vez, ninguno repetido. |
| CP-NAV-072 | PASSED | La consola devolvió exactamente [1,1,1,1,1] en Ajustes a 1023 px: los cinco identificadores aparecen una vez, ninguno repetido (la app agregó ?period=2026-10 a la dirección de Ajustes). |
| CP-NAV-073 | PASSED | La consola devolvió exactamente [1,1,1,1,1] en Resumen a 1024 px: los cinco identificadores aparecen una vez, ninguno repetido. |
| CP-NAV-074 | PASSED | La consola devolvió exactamente [1,1,1,1,1] en Movimientos a 1024 px: los cinco identificadores aparecen una vez, ninguno repetido. |
| CP-NAV-075 | PASSED | La consola devolvió exactamente [1,1,1,1,1] en Deudas a 1024 px: los cinco identificadores aparecen una vez, ninguno repetido. |
| CP-NAV-076 | PASSED | La consola devolvió exactamente [1,1,1,1,1] en Suscripciones a 1024 px: los cinco identificadores aparecen una vez, ninguno repetido. |
| CP-NAV-077 | PASSED | La consola devolvió exactamente [1,1,1,1,1] en Ajustes a 1024 px: los cinco identificadores aparecen una vez, ninguno repetido (la app agregó ?period=2026-10 a la dirección de Ajustes). |
| CP-NAV-078 | PASSED | La consola devolvió exactamente [1,1,1,1,1] en Resumen a 1280 px: los cinco identificadores aparecen una vez, ninguno repetido. |
| CP-NAV-079 | PASSED | La consola devolvió exactamente [1,1,1,1,1] en Movimientos a 1280 px: los cinco identificadores aparecen una vez, ninguno repetido. |
| CP-NAV-080 | PASSED | La consola devolvió exactamente [1,1,1,1,1] en Deudas a 1280 px: los cinco identificadores aparecen una vez, ninguno repetido. |
| CP-NAV-081 | PASSED | La consola devolvió exactamente [1,1,1,1,1] en Suscripciones a 1280 px: los cinco identificadores aparecen una vez, ninguno repetido. |
| CP-NAV-082 | PASSED | La consola devolvió exactamente [1,1,1,1,1] en Ajustes a 1280 px: los cinco identificadores aparecen una vez, ninguno repetido (la app agregó ?period=2026-10 a la dirección de Ajustes). |
| CP-NAV-083 | PASSED | Una transacción activa (deleted_at nulo) y una cuota con installment_number 1 y 12500.00. |
| CP-NAV-084 | FAILED | La baja respondió HTTP 204 SIN cuerpo (el caso espera HTTP 200 con cuerpo null). El resto coincide: la transacción quedó con deleted_at con fecha (una sola fila) y la cuota histórica se conserva (installment_number 1, 12500.00). |
| CP-NAV-085 | PASSED | Con la clave fija, la fila pendiente guardó exactamente esa clave; tras el reintento por pantalla la API tiene una transacción activa con esa clave y una cuota (installment_number 1, 12500.00). |
| CP-EXP-001 | PASSED | La hoja abre con «Solo septiembre 2026» elegido, «Todo 2026» visible, «Descargar CSV» y «Cancelar» habilitados y el texto fijo sobre activos y cuotas anteriores. — Observado en la corrida — Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV» |
| CP-EXP-002 | PASSED | Sin `period` en la URL (reloj en 09/10/2026) la hoja abre con «Solo octubre 2026» elegido y «Todo 2026» visible. — Observado en la corrida — Pantalla final: /transactions?period=2026-10 · hoja abierta · botón «Descargar CSV» |
| CP-EXP-003 | PASSED | Sin transacciones: no se descarga nada, aparece «No tenés movimientos con fecha en septiembre 2026.», «Cancelar» cierra la hoja y la URL conserva `?period=2026-09`. — Observado en la corrida — Descarga: ninguna Pantalla final: /transactions?period=2026-09 · hoja cerrada |
| CP-EXP-004 | PASSED | «Exportar» habilitado y sin aviso de período futuro; la hoja abre. — Observado en la corrida — Pantalla final: /transactions?period=2026-10 · hoja abierta · botón «Descargar CSV» |
| CP-EXP-005 | PASSED | «Exportar» habilitado y sin aviso de período futuro; la hoja abre. — Observado en la corrida — Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV» |
| CP-EXP-006 | PASSED | Mes futuro (2026-11): «Exportar» deshabilitado, aparece «Solo podés exportar el mes actual o meses anteriores.», no abre ninguna hoja y la URL no cambia. — Observado en la corrida — Pantalla final: /transactions?period=2026-11 · hoja cerrada · aviso: «Solo podés exportar el mes actual o meses anteriores.» |
| CP-EXP-007 | PASSED | Descarga `biyu-movimientos-2026-09.csv` con una fila de datos cuyo id es el de la transacción creada. — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 217 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,1500.00,ARS,,1500.00,Otros,Efectivo,1,2026-09,Almuerzo,3beeb9fe-67fe-4028-aef8-ac57768be4c1 Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-008 | PASSED | Con «Todo 2025» descarga `biyu-movimientos-2025.csv` con una única fila (2025-02-10) y el id esperado. — Observado en la corrida — Descarga: biyu-movimientos-2025.csv · 209 bytes · 1 fila(s) de datos · fila 1: 2025-02-10,gasto,2500.00,ARS,,2500.00,Otros,Efectivo,1,2025-02,,f0f6a94a-8677-4ff2-85f6-1ab8d729b277 Pantalla final: /transactions?period=2025-06 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-009 | PASSED | El borde del período se incluye: una sola fila con la fecha límite y el id esperado. — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 207 bytes · 1 fila(s) de datos · fila 1: 2026-09-01,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,,4ac02c5d-66b5-4d37-8291-83577c5fc6e2 Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-010 | PASSED | El borde del período se incluye: una sola fila con la fecha límite y el id esperado. — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 207 bytes · 1 fila(s) de datos · fila 1: 2026-09-30,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,,f59af1a2-1168-472b-a0f0-fb0fc0c2d2e4 Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-011 | PASSED | El día fuera del período se excluye: no se descarga archivo, la hoja queda abierta y aparece el mensaje exacto de período vacío. — Observado en la corrida — Descarga: ninguna Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV» · mensaje: «No tenés movimientos con fecha en septiembre 2026.» |
| CP-EXP-012 | PASSED | El día fuera del período se excluye: no se descarga archivo, la hoja queda abierta y aparece el mensaje exacto de período vacío. — Observado en la corrida — Descarga: ninguna Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV» · mensaje: «No tenés movimientos con fecha en septiembre 2026.» |
| CP-EXP-013 | PASSED | El borde del período se incluye: una sola fila con la fecha límite y el id esperado. — Observado en la corrida — Descarga: biyu-movimientos-2025.csv · 207 bytes · 1 fila(s) de datos · fila 1: 2025-01-01,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2025-01,,95bf1454-0704-45f9-b3ca-a7109f4fdc4b Pantalla final: /transactions?period=2025-06 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-014 | PASSED | El borde del período se incluye: una sola fila con la fecha límite y el id esperado. — Observado en la corrida — Descarga: biyu-movimientos-2025.csv · 207 bytes · 1 fila(s) de datos · fila 1: 2025-12-31,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2025-12,,0aeee240-ab4e-45d6-8e63-ae30eedc1b6e Pantalla final: /transactions?period=2025-06 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-015 | PASSED | El día fuera del período se excluye: no se descarga archivo, la hoja queda abierta y aparece el mensaje exacto de período vacío. — Observado en la corrida — Descarga: ninguna Pantalla final: /transactions?period=2025-06 · hoja abierta · botón «Descargar CSV» · mensaje: «No tenés movimientos con fecha en 2025.» |
| CP-EXP-016 | PASSED | El día fuera del período se excluye: no se descarga archivo, la hoja queda abierta y aparece el mensaje exacto de período vacío. — Observado en la corrida — Descarga: ninguna Pantalla final: /transactions?period=2025-06 · hoja abierta · botón «Descargar CSV» · mensaje: «No tenés movimientos con fecha en 2025.» |
| CP-EXP-017 | PASSED | La transacción eliminada no sale: no se descarga archivo y aparece el mensaje de período vacío. — Observado en la corrida — Descarga: ninguna Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV» · mensaje: «No tenés movimientos con fecha en septiembre 2026.» |
| CP-EXP-018 | PASSED | La transacción restaurada vuelve a salir: una fila con el id esperado. — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 207 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,200.00,ARS,,200.00,Otros,Efectivo,1,2026-09,,5d000dde-8e2e-4e11-8bbf-abeebfb905e8 Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-019 | PASSED | Los dos archivos (vista Activos y vista Eliminados) son idénticos byte a byte; contienen `<ID-A>` y no `<ID-B>`. — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 207 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,,9a13d267-64ec-494e-983b-5bea5d9fc468 Descarga: biyu-movimientos-2026-09.csv · 207 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,,9a13d267-64ec-494e-983b-5bea5d9fc468 Pantalla final: /transactions?period=2026-09&view=deleted · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-020 | PASSED | Los primeros tres bytes del archivo son `EF BB BF`. — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 207 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,,516cde3a-ba46-47ad-8bc7-c5938c12560e Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-021 | PASSED | La primera línea es exactamente `fecha,tipo,monto,moneda,tipo_de_cambio,monto_ars,categoria,cuenta,cuotas,primer_periodo,descripcion,id`. — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 207 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,,8bbc9a3b-2342-46b6-865d-2459a250e613 Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-022 | PASSED | Cada línea, incluida la última, termina en `0D 0A`; no hay línea en blanco ni total al final. — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 207 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,,9e37f2f9-8550-4064-8be8-539d9c7be88b Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-023 | PASSED | Una sola fila por el total: fecha 2026-08-15, monto 120000.00, cuotas 12, primer_periodo 2026-08 e id esperado (compra en tarjeta de crédito). — Observado en la corrida — Descarga: biyu-movimientos-2026-08.csv · 215 bytes · 1 fila(s) de datos · fila 1: 2026-08-15,gasto,120000.00,ARS,,120000.00,Otros,Visa BBVA,12,2026-08,,1a9244ee-655e-4840-9fb2-c174ea030e49 Pantalla final: /transactions?period=2026-08 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-024 | PASSED | Un mes con solo cuota heredada produce el estado Vacío: no se descarga archivo y aparece «No tenés movimientos con fecha en septiembre 2026.» — Observado en la corrida — Descarga: ninguna Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV» · mensaje: «No tenés movimientos con fecha en septiembre 2026.» |
| CP-EXP-025 | PASSED | La fila contiene `gasto,1500.00,ARS,,1500.00`; no aparecen `1.500,00`, signo ni `1500` sin decimales. — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 209 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,1500.00,ARS,,1500.00,Otros,Efectivo,1,2026-09,,b08e79d0-3719-428e-aba6-ec49af7e6be2 Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-026 | PASSED | La fila contiene `300.00,USD,1250.5000,375150.00` exacto. — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 219 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,300.00,USD,1250.5000,375150.00,Otros,Efectivo,1,2026-09,,66a7abf3-b3bf-4081-b808-661e26f4a6b1 Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-027 | PASSED | Tras cambiar la referencia a 1400.0000 el CSV conserva `1250.5000` y `375150.00`; no aparecen `1400.0000` ni `420000.00`. — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 219 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,300.00,USD,1250.5000,375150.00,Otros,Efectivo,1,2026-09,,6b531f6c-48eb-447f-ae92-37dcd5b6e114 Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-028 | PASSED | El campo coincide byte a byte con el esperado (coma entrecomillada / comillas internas duplicadas). — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 227 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,"Heladera, 3 cuotas",649a7b38-a67f-4214-974a-9cecea6ada82 Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-029 | PASSED | El campo coincide byte a byte con el esperado (coma entrecomillada / comillas internas duplicadas). — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 230 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,"Pizza ""a la piedra""",f965d5d8-2cbe-4db4-99f0-0e4d7f034cf2 Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-030 | DUDA | El campo queda entre comillas con el salto de línea (LF) adentro y el archivo se lee como 12 columnas y una fila de datos con un lector RFC 4180. No se usó Google Sheets (el paso 16 lo pide): oráculo sustituido. — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 230 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,"Línea uno\nLínea dos",373609e1-efdc-4e01-a9f6-2cb0f7d638f8 Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-031 | PASSED | La descripción queda neutralizada con un solo apóstrofo delante (y entre comillas si corresponde); coincide con la salida esperada. — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 212 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,'=1+1,1a2752e5-cade-47d0-aa98-be6b6812ae2f Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-032 | PASSED | La descripción queda neutralizada con un solo apóstrofo delante (y entre comillas si corresponde); coincide con la salida esperada. — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 217 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,'+SUMA(A1),1cdbce5b-789a-4e2e-b3bc-0c1924923e91 Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-033 | PASSED | La descripción queda neutralizada con un solo apóstrofo delante (y entre comillas si corresponde); coincide con la salida esperada. — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 219 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,"'-5, promo",ff171f8c-0a78-45ba-a155-0f125f11d278 Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-034 | PASSED | La descripción queda neutralizada con un solo apóstrofo delante (y entre comillas si corresponde); coincide con la salida esperada. — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 216 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,'@usuario,db793bba-b92d-4dc2-881f-7eece75d87a7 Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-035 | PASSED | La descripción queda neutralizada con un solo apóstrofo delante (y entre comillas si corresponde); coincide con la salida esperada. — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 214 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,' café,ab82da7a-396d-4253-82b4-0def59207584 Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-036 | PASSED | La descripción queda neutralizada con un solo apóstrofo delante (y entre comillas si corresponde); coincide con la salida esperada. — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 215 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,"' nota",8e70bf41-a459-4e54-9f9b-9e2cd17eb207 Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-037 | PASSED | La categoría `=Categoria QA` sale como `'=Categoria QA`. — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 216 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,'=Categoria QA,Efectivo,1,2026-09,,5013a723-bc9a-4cb5-a0c3-6ae81b0d8d50 Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-038 | PASSED | La cuenta `@Cuenta QA` sale como `'@Cuenta QA`. — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 210 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,'@Cuenta QA,1,2026-09,,9f4e6834-6d74-4c1a-bbc0-e1407b2b0227 Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-039 | PASSED | El orden de las filas es B, C, A (fecha y luego created_at, con created_at(B) < created_at(C)). — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 407 bytes · 3 fila(s) de datos · fila 1: 2026-09-10,gasto,200.00,ARS,,200.00,Otros,Efectivo,1,2026-09,,50e42b19-7fca-4991-99e1-a8331eb683c1 Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 3 movimientos» |
| CP-EXP-040 | PASSED | El CSV trae exactamente N UUID distintos que coinciden con los creados (ninguno falta ni se repite) y el aviso dice «Exportamos N movimientos» con separador de miles. — Observado en la corrida — Descarga: biyu-movimientos-2025.csv · 104107 bytes · 1000 fila(s) de datos · fila 1: 2025-09-15,gasto,1.00,ARS,,1.00,Otros,Efectivo,1,2025-09,EXP-0001,48880cb3-3fe2-4507-b511-31b3a3864cdb Pantalla final: /transactions?period=2025-09 · hoja cerrada · aviso: «Exportamos 1.000 movimientos» |
| CP-EXP-041 | PASSED | El CSV trae exactamente N UUID distintos que coinciden con los creados (ninguno falta ni se repite) y el aviso dice «Exportamos N movimientos» con separador de miles. — Observado en la corrida — Descarga: biyu-movimientos-2025.csv · 156107 bytes · 1500 fila(s) de datos · fila 1: 2025-09-15,gasto,1.00,ARS,,1.00,Otros,Efectivo,1,2025-09,EXP-0001,d11874af-4400-4b0f-90b5-274489817464 Pantalla final: /transactions?period=2025-09 · hoja cerrada · aviso: «Exportamos 1.500 movimientos» |
| CP-EXP-042 | PASSED | El CSV trae exactamente N UUID distintos que coinciden con los creados (ninguno falta ni se repite) y el aviso dice «Exportamos N movimientos» con separador de miles. — Observado en la corrida — Descarga: biyu-movimientos-2025.csv · 208107 bytes · 2000 fila(s) de datos · fila 1: 2025-09-15,gasto,1.00,ARS,,1.00,Otros,Efectivo,1,2025-09,EXP-0001,c5a93c10-1575-48c6-b888-50dca9b862c7 Pantalla final: /transactions?period=2025-09 · hoja cerrada · aviso: «Exportamos 2.000 movimientos» |
| CP-EXP-043 | PASSED | El CSV del usuario A trae una fila (111.00, SOLO-A, su id) y nada de B (999.00, SOLO-B, id de B). — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 213 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,111.00,ARS,,111.00,Otros,Efectivo,1,2026-09,SOLO-A,b007657f-13b0-434a-9080-0d5a61601302 Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-044 | PASSED | Con el token de A, la lectura de `transactions` filtrada por el id de B responde HTTP 200 con `[]`; sin filtro, A ve 0 filas. — Observado en la corrida — API con token de A: GET transactions?id=eq.<ID-B> → HTTP 200, []; GET transactions (sin filtro) → 0 filas Pantalla final: /register · hoja cerrada |
| CP-EXP-045 | PASSED | La categoría archivada sale con el nombre actual `Viajes 2026`. — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 213 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Viajes 2026,Efectivo,1,2026-09,,5ec7ca84-dceb-45b6-bde5-711d1cb0472a Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-046 | PASSED | La cuenta archivada sale con el nombre actual `Billetera QA 2026`. — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 216 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Billetera QA 2026,1,2026-09,,4b25e416-be24-409e-aac5-50a961f4cf8b Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-047 | PASSED | Un ingreso exporta `tipo=ingreso` y `categoria` vacía (campo vacío entre dos comas). — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 219 bytes · 1 fila(s) de datos · fila 1: 2026-09-01,ingreso,850000.00,ARS,,850000.00,,Billetera virtual,1,2026-09,,9c1820e1-04c4-4e4a-91fc-69f3f1598e4a Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-048 | PASSED | Tras eliminar la cuenta, su transacción ya no existe: no se descarga archivo y aparece el mensaje de período vacío. — Observado en la corrida — Descarga: ninguna Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV» · mensaje: «No tenés movimientos con fecha en septiembre 2026.» |
| CP-EXP-049 | PASSED | Con la lectura demorada, el botón dice «Exportando…», está deshabilitado y tiene `aria-busy="true"`. Demora simulada de 4 s (no 1 kbit/s de DevTools). — Observado en la corrida — Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Exportando…» |
| CP-EXP-050 | PASSED | Con «Exportando…» quedan deshabilitados los dos alcances, «Cancelar» y «Descargar CSV». Demora simulada de 4 s. — Observado en la corrida — Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Exportando…» |
| CP-EXP-051 | PASSED | Un doble clic rápido genera una sola descarga y un solo aviso «Exportamos 1 movimiento». — Observado en la corrida — Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-052 | PASSED | Descarga el archivo, la hoja se cierra y aparece exactamente «Exportamos 1 movimiento» (un solo aviso). — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 207 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,,4881fc60-ca80-4dd3-a91d-81bdc70dac3b Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-053 | PASSED | Descarga el archivo y aparece exactamente «Exportamos 2 movimientos» (un solo aviso). — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 307 bytes · 2 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,,46a94a75-a5af-49ad-b59d-722d14818b6e Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 2 movimientos» |
| CP-EXP-054 | PASSED | Un mes sin transacciones muestra el mensaje de Vacío; al elegir «Todo 2026» queda elegido y el mensaje mensual desaparece. — Observado en la corrida — Descarga: ninguna Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV» |
| CP-EXP-055 | PASSED | Un año sin transacciones: no se descarga archivo y aparece «No tenés movimientos con fecha en 2025.» — Observado en la corrida — Descarga: ninguna Pantalla final: /transactions?period=2025-06 · hoja abierta · botón «Descargar CSV» · mensaje: «No tenés movimientos con fecha en 2025.» |
| CP-EXP-056 | PASSED | Con solo transacciones eliminadas: no se descarga archivo y aparece el mensaje de período vacío. — Observado en la corrida — Descarga: ninguna Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV» · mensaje: «No tenés movimientos con fecha en septiembre 2026.» |
| CP-EXP-057 | PASSED | Sin conexión: no se descarga archivo, aparece (con `role="alert"`) «No pudimos exportar tus movimientos. Probá de nuevo.» y alcances, «Descargar CSV» y «Cancelar» quedan habilitados. — Observado en la corrida — Descarga: ninguna Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV» · error: «No pudimos exportar tus movimientos. Probá de nuevo.» |
| CP-EXP-058 | PASSED | Al volver la conexión y reintentar, el error desaparece, se descarga el archivo con los dos ids una vez cada uno y aparece «Exportamos 2 movimientos». — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 307 bytes · 2 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,,00ea166a-1fbd-4118-928c-e941969f1ab4 Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 2 movimientos» |
| CP-EXP-059 | PASSED | Desde el estado Error, «Cancelar» cierra la hoja, no se descarga nada y la URL conserva `?period=2026-09`. — Observado en la corrida — Descarga: ninguna Pantalla final: /transactions?period=2026-09 · hoja cerrada |
| CP-EXP-060 | PASSED | «Cancelar» cierra la hoja sin descargar y la URL conserva `?period=2026-09`. — Observado en la corrida — Descarga: ninguna Pantalla final: /transactions?period=2026-09 · hoja cerrada |
| CP-EXP-061 | PASSED | Escape cierra la hoja sin descargar y la URL conserva `?period=2026-09`. — Observado en la corrida — Descarga: ninguna Pantalla final: /transactions?period=2026-09 · hoja cerrada |
| CP-EXP-062 | FAILED | FALLA. Un clic sobre el fondo oscuro, fuera de la hoja, no la cierra: el clic lo recibe el `div` de fondo (`aria-hidden`), que es hijo del contenedor, y el controlador exige que el destino del clic sea el propio contenedor. La hoja sigue abierta. — Observado en la corrida — Descarga: ninguna Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV» Falla detectada: tocar fuera NO cierra la hoja (el click cae en el div de fondo aria-hidden, no en el contenedor) |
| CP-EXP-063 | FAILED | FALLA. Con la hoja abierta, «Atrás» cambia la URL a `?period=2026-08` (el evento `popstate` se dispara) pero la hoja sigue abierta. — Observado en la corrida — Pantalla final: /transactions?period=2026-08 · hoja abierta · botón «Descargar CSV» Falla detectada: la URL pasó a 2026-08 pero la hoja sigue abierta |
| CP-EXP-064 | FAILED | FALLA. «Atrás» durante «Exportando…» no cancela la exportación: cuando termina la lectura se descarga el archivo y aparece el aviso «Exportamos 1 movimiento», con el usuario ya en el mes anterior. — Observado en la corrida — Pantalla final: /transactions?period=2026-08 · hoja cerrada · aviso: «Exportamos 1 movimiento» Falla detectada: Atrás durante Exportando no cancela: descargas=1, avisos de éxito=1 |
| CP-EXP-065 | FAILED | FALLA. Con la hoja abierta, «Adelante» cambia la URL a `?period=2026-09` pero la hoja sigue abierta. — Observado en la corrida — Descarga: ninguna Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV» Falla detectada: la URL pasó a 2026-09 pero la hoja sigue abierta |
| CP-EXP-066 | PASSED | Al salir a `/dashboard?period=2026-09` se abre Resumen, la hoja desaparece y no se descarga archivo. — Observado en la corrida — Descarga: ninguna Pantalla final: /dashboard?period=2026-09 · hoja cerrada |
| CP-EXP-067 | PASSED | Exportar no modifica datos ni período: sigue una fila por `$3.000,00` (también tras recargar) y la API muestra la transacción sin `deleted_at`. — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 209 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,3000.00,ARS,,3000.00,Otros,Efectivo,1,2026-09,,995ac1b9-b682-4c3d-9572-ef17aa8df23e Pantalla final: /transactions?period=2026-09 · hoja cerrada |
| CP-EXP-068 | PASSED | Con 1.500 transacciones y un alta concurrente de 2,00 con fecha 31/12/2025 durante la lectura: no se descarga archivo, la hoja sigue abierta y aparece el error con `role="alert"`. El alta se hizo por API entre la 1.ª y la 2.ª página, no desde una segunda ventana. — Observado en la corrida — Descarga: ninguna Pantalla final: /transactions?period=2025-09 · hoja abierta · botón «Descargar CSV» · error: «No pudimos exportar tus movimientos. Probá de nuevo.» |
| CP-EXP-069 | PASSED | Con la hoja en «Exportando…», Escape no la cierra y sigue mostrando «Exportando…». — Observado en la corrida — Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Exportando…» |
| CP-EXP-070 | PASSED | La hoja sigue abierta y mostrando «Exportando…», pero el caso no prueba nada hoy: tocar fuera nunca cierra la hoja (ver DEF-030 / CP-EXP-062), así que el resultado sería el mismo sin el bloqueo. — Observado en la corrida — Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Exportando…» |
| CP-EXP-071 | DUDA | El CSV se lee como 12 columnas y una fila de datos con un lector RFC 4180; la descripción `Uno, "dos"` + salto de línea + `Tres` queda en una sola celda. No se usó Google Sheets (pasos 16 a 21): oráculo sustituido. — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 226 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,100.00,ARS,,100.00,Otros,Efectivo,1,2026-09,"Uno, ""dos""\nTres",3953e175-6f06-44e8-be8d-320ad7b0cba5 Pantalla final: /transactions?period=2026-09 · hoja cerrada · aviso: «Exportamos 1 movimiento» |
| CP-EXP-072 | PASSED | El total de Resumen vuelve a mostrar exactamente `$3.000,00` después de exportar. — Observado en la corrida — Descarga: biyu-movimientos-2026-09.csv · 209 bytes · 1 fila(s) de datos · fila 1: 2026-09-15,gasto,3000.00,ARS,,3000.00,Otros,Efectivo,1,2026-09,,82f64962-e77d-46df-9539-7e9ed24fe908 Pantalla final: /dashboard?period=2026-09 · hoja cerrada |
| CP-EXP-073 | PASSED | No se descarga archivo y aparece «No pudimos exportar tus movimientos. Probá de nuevo.» con `role="alert"` (respuesta interceptada con HTTP 500 / monto textual inválido, simulado con una ruta de Playwright en lugar de pegar el código en la consola). — Observado en la corrida — Descarga: ninguna Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV» · error: «No pudimos exportar tus movimientos. Probá de nuevo.» |
| CP-EXP-074 | PASSED | No se descarga archivo y aparece «No pudimos exportar tus movimientos. Probá de nuevo.» con `role="alert"` (respuesta interceptada con HTTP 500 / monto textual inválido, simulado con una ruta de Playwright en lugar de pegar el código en la consola). — Observado en la corrida — Descarga: ninguna Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV» · error: «No pudimos exportar tus movimientos. Probá de nuevo.» |
| CP-EXP-075 | PASSED | Al elegir «Todo 2026» queda elegido y el mensaje de error desaparece. — Observado en la corrida — Pantalla final: /transactions?period=2026-09 · hoja abierta · botón «Descargar CSV» |
| CP-IMP-001 | PASSED | Coincide con el resultado esperado. Se verificó: Existen register-import en el botón usado, import-back, import-steps con data-step="1", import-template-download, import-file-pick, import-file-input e import-file-dropzone. |
| CP-IMP-002 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre sin sesión. |
| CP-IMP-003 | BLOCKED | US-80 (Cuotas pendientes) no está implementada: la plantilla descargada tiene 9 columnas (Fecha \| Tipo \| Monto \| Moneda \| Tipo de cambio \| Categoría \| Cuenta \| Cuotas \| Nota) y la hoja Instrucciones no incluye «Cuotas pendientes» |
| CP-IMP-004 | PASSED | Coincide con el resultado esperado. Se verificó: Se mantiene 1 Archivo; aparece exactamente El archivo no tiene filas con datos debajo de los encabezados. en un elemento con data-testid="import-file-error". |
| CP-IMP-005 | PASSED | Coincide con el resultado esperado. Se verificó: Se mantiene 1 Archivo; aparece exactamente Solo se aceptan archivos .xlsx (Excel).. |
| CP-IMP-006 | PASSED | Coincide con el resultado esperado. Se verificó: Se mantiene 1 Archivo; aparece exactamente El archivo pesa más de 1 MB. Dividilo en varios archivos.. |
| CP-IMP-007 | PASSED | Coincide con el resultado esperado. Se verificó: Se mantiene 1 Archivo; aparece exactamente No pudimos leer el archivo. Abrilo en Excel, guardalo como .xlsx y probá de nuevo.. |
| CP-IMP-008 | PASSED | Coincide con el resultado esperado. Se verificó: Se mantiene 1 Archivo; aparece exactamente Faltan columnas: Fecha, Monto, Cuenta. La primera fila tiene que tener los encabezados de la plantilla.. |
| CP-IMP-009 | PASSED | Coincide con el resultado esperado. Se verificó: Se mantiene 1 Archivo; aparece exactamente La columna Monto está repetida. Dejá una sola.. |
| CP-IMP-010 | PASSED | Coincide con el resultado esperado. Se verificó: Se mantiene 1 Archivo; aparece exactamente El archivo no tiene filas con datos debajo de los encabezados.. |
| CP-IMP-011 | PASSED | Coincide con el resultado esperado. Se verificó: Se mantiene 1 Archivo; aparece exactamente El archivo tiene 501 filas con datos y el máximo es 500. Dividilo en varios archivos.. |
| CP-IMP-012 | DUDA | Con un ZIP válido de exactamente 1.048.576 bytes la app acepta el archivo (1 fila leída · 1 lista · 0 con error). Con la preparación literal del caso (IMP-PREP-05: ceros al final del ZIP) responde «No pudimos leer el archivo»: probable error de la preparación del caso |
| CP-IMP-013 | PASSED | Coincide con el resultado esperado. Se verificó: Se mantiene 1 Archivo; aparece exactamente El archivo pesa más de 1 MB. Dividilo en varios archivos.. |
| CP-IMP-014 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; muestra 500 filas leídas · 500 listas para importar · 0 con error. |
| CP-IMP-015 | PASSED | Coincide con el resultado esperado. Se verificó: Se mantiene 1 Archivo; aparece exactamente El archivo tiene 501 filas con datos y el máximo es 500. Dividilo en varios archivos.. |
| CP-IMP-016 | PASSED | Coincide con el resultado esperado. Se verificó: Se mantiene 1 Archivo; aparece exactamente El archivo no tiene filas con datos debajo de los encabezados.. |
| CP-IMP-017 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; muestra 1 fila leída · 1 lista para importar · 0 con error y la tarjeta Fila 2 está Lista. |
| CP-IMP-018 | BLOCKED | US-80 (Cuotas pendientes) no está implementada: la app informa «Se ignoraron las columnas: Cuotas pendientes, Comercio.» en lugar de solo «Comercio.» |
| CP-IMP-019 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 está Lista y muestra $1.000,00. |
| CP-IMP-020 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 está Con error y muestra exactamente Falta la categoría (es obligatoria en un gasto). |
| CP-IMP-021 | PASSED | Coincide con el resultado esperado. Se verificó: Existen import-file-name, import-summary, import-summary-amounts, import-duplicates-warning, import-filter-errors, import-rows, import-row-2 con data-status="ready", import-row-7 con data-status="error", import-row-7-errors, import-change-file e import-submit; import-ignored-columns no está porque no hay columnas desconocidas. |
| CP-IMP-022 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Falta la fecha; Importar 0 movimientos está deshabilitado. |
| CP-IMP-023 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Fecha inválida: usá DD/MM/AAAA; Importar 0 movimientos está deshabilitado. |
| CP-IMP-024 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente La fecha no puede ser futura; Importar 0 movimientos está deshabilitado. |
| CP-IMP-025 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Falta el tipo; Importar 0 movimientos está deshabilitado. |
| CP-IMP-026 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Tipo inválido: escribí Gasto o Ingreso; Importar 0 movimientos está deshabilitado. |
| CP-IMP-027 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Falta el monto; Importar 0 movimientos está deshabilitado. |
| CP-IMP-028 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Monto inválido: usá un número, por ejemplo 1234,56; Importar 0 movimientos está deshabilitado. |
| CP-IMP-029 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente El monto debe ser mayor a cero; Importar 0 movimientos está deshabilitado. |
| CP-IMP-030 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente El monto admite hasta 2 decimales; Importar 0 movimientos está deshabilitado. |
| CP-IMP-031 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente El monto máximo es $999.999.999.999,99; Importar 0 movimientos está deshabilitado. |
| CP-IMP-032 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Falta la moneda; Importar 0 movimientos está deshabilitado. |
| CP-IMP-033 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Moneda inválida: escribí ARS o USD; Importar 0 movimientos está deshabilitado. |
| CP-IMP-034 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Falta el tipo de cambio; Importar 0 movimientos está deshabilitado. |
| CP-IMP-035 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Una transacción en ARS no lleva tipo de cambio; Importar 0 movimientos está deshabilitado. |
| CP-IMP-036 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Tipo de cambio inválido: usá un número mayor a cero; Importar 0 movimientos está deshabilitado. |
| CP-IMP-037 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Usá hasta 4 decimales en el tipo de cambio; Importar 0 movimientos está deshabilitado. |
| CP-IMP-038 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente El tipo de cambio es demasiado grande; Importar 0 movimientos está deshabilitado. |
| CP-IMP-039 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Falta la categoría (es obligatoria en un gasto); Importar 0 movimientos está deshabilitado. |
| CP-IMP-040 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente No existe la categoría «Mascotas» o está archivada; Importar 0 movimientos está deshabilitado. |
| CP-IMP-041 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Falta la cuenta; Importar 0 movimientos está deshabilitado. |
| CP-IMP-042 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente No existe la cuenta «Banco X» o está archivada; Importar 0 movimientos está deshabilitado. |
| CP-IMP-043 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Las cuotas van de 1 a 12; Importar 0 movimientos está deshabilitado. |
| CP-IMP-044 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Solo los gastos con tarjeta de crédito admiten cuotas; Importar 0 movimientos está deshabilitado. |
| CP-IMP-045 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente En pesos daría más que el máximo de $999.999.999.999,99; Importar 0 movimientos está deshabilitado. |
| CP-IMP-046 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente Con ese monto, cada cuota daría menos de 0,01; Importar 0 movimientos está deshabilitado. |
| CP-IMP-047 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre 2 Revisión; Fila 2 queda Con error y muestra exactamente En pesos daría menos de $0,01. Revisá el monto o el tipo de cambio; Importar 0 movimientos está deshabilitado. |
| CP-IMP-048 | PASSED | Coincide con el resultado esperado. Se verificó: Fila 2 queda Con error; aparecen, en este orden y una vez: Fecha inválida: usá DD/MM/AAAA, El monto debe ser mayor a cero, No existe la cuenta «Banco X» o está archivada. |
| CP-IMP-049 | PASSED | Coincide con el resultado esperado. Se verificó: La fila muestra solo Moneda inválida: escribí ARS o USD; no aparece otro mensaje de tipo de cambio. |
| CP-IMP-050 | PASSED | Coincide con el resultado esperado. Se verificó: La fila muestra solo Tipo inválido: escribí Gasto o Ingreso; no aparece otro mensaje de categoría. |
| CP-IMP-051 | PASSED | Coincide con el resultado esperado. Se verificó: La fila muestra solo No existe la cuenta «Banco X» o está archivada; no aparece otro mensaje de cuotas. |
| CP-IMP-052 | FAILED | Fila 2 Lista 01/09/2026 · Gasto · educación · efectivo · TC 1.450,00 US$10,00 |
| CP-IMP-053 | PASSED | Coincide con el resultado esperado. Se verificó: Fila 2 muestra exactamente No existe la categoría «Educacion» o está archivada. |
| CP-IMP-054 | PASSED | Coincide con el resultado esperado. Se verificó: Fila 2 muestra exactamente No existe la categoría «Otros» o está archivada. |
| CP-IMP-055 | PASSED | Coincide con el resultado esperado. Se verificó: Fila 2 está Lista y muestra 12/10/2026. |
| CP-IMP-056 | PASSED | Coincide con el resultado esperado. Se verificó: Fila 2 muestra exactamente La fecha no puede ser futura. |
| CP-IMP-057 | PASSED | Coincide con el resultado esperado. Se verificó: Fila 2 está Lista y muestra 05/09/2026, sin hora. |
| CP-IMP-058 | PASSED | Coincide con el resultado esperado. Se verificó: Fila 2 muestra exactamente Fecha inválida: usá DD/MM/AAAA. |
| CP-IMP-059 | PASSED | Coincide con el resultado esperado. Se verificó: Fila 2 está Lista y muestra exactamente $1.500,00. |
| CP-IMP-060 | PASSED | Coincide con el resultado esperado. Se verificó: Fila 2 está Lista y muestra exactamente $1.234,56. |
| CP-IMP-061 | PASSED | Coincide con el resultado esperado. Se verificó: Fila 2 está Lista y muestra exactamente $0,30. Nota: Sin fórmula real: celda numérica con el valor guardado 0,30000000000000004 |
| CP-IMP-062 | PASSED | Coincide con el resultado esperado. Se verificó: Fila 2 está Con error y muestra exactamente El monto admite hasta 2 decimales. Nota: Sin fórmula real: celda numérica con el valor guardado 33,3333333333333 |
| CP-IMP-063 | PASSED | Coincide con el resultado esperado. Se verificó: Se ve exactamente Vas a importar 7 movimientos: $324.915,50 en gastos y $850.000,00 en ingresos (en pesos). |
| CP-IMP-064 | PASSED | Coincide con el resultado esperado. Se verificó: Queda encendido; solo se ven Fila 7, Fila 8, Fila 9 y Fila 10. |
| CP-IMP-065 | PASSED | Coincide con el resultado esperado. Se verificó: Ver solo filas con error está apagado y deshabilitado; Fila 2 está Lista. |
| CP-IMP-066 | PASSED | Coincide con el resultado esperado. Se verificó: Transacciones e imputaciones responden HTTP 200 con []. |
| CP-IMP-067 | PASSED | Coincide con el resultado esperado. Se verificó: Transacciones e imputaciones responden HTTP 200 con []. |
| CP-IMP-068 | PASSED | Coincide con el resultado esperado. Se verificó: Se ve Importar 0 movimientos deshabilitado y No hay filas listas para importar. |
| CP-IMP-069 | PASSED | Coincide con el resultado esperado. Se verificó: Se ve exactamente 1 fila leída · 1 lista para importar · 0 con error, Vas a importar 1 movimiento: $1.000,00 en gastos y $0,00 en ingresos (en pesos). y Importar 1 movimiento habilitado. |
| CP-IMP-070 | PASSED | Coincide con el resultado esperado. Se verificó: Existen exactamente las transacciones de filas 2 y 3 con sus nueve campos exactos; descripción de fila 3 es null; no existe transacción para fila 4. |
| CP-IMP-071 | PASSED | Coincide con el resultado esperado. Se verificó: La única transacción tiene description:null. |
| CP-IMP-072 | PASSED | Coincide con el resultado esperado. Se verificó: La transacción tiene amount=240000.00, seis imputaciones 40000.00, números 1–6, en 2026-09-01 a 2027-02-01; suman 240000.00. |
| CP-IMP-073 | PASSED | Coincide con el resultado esperado. Se verificó: La URL termina en /transactions?period=2026-09. |
| CP-IMP-074 | PASSED | Coincide con el resultado esperado. Se verificó: Se ve Se importaron 6 de 11 filas., $321.715,50 en gastos y $850.000,00 en ingresos (en pesos). y Fila 6: No existe la categoría «Transporte» o está archivada; las demás válidas se importan. |
| CP-IMP-075 | PASSED | Coincide con el resultado esperado. Se verificó: Está seleccionada Cuenta bancaria, no Efectivo. |
| CP-IMP-076 | PASSED | Coincide con el resultado esperado. Se verificó: El tiempo es menor a 10,0 s y se ve Se importaron 500 de 500 filas. Nota: Local (no Vercel/Supabase hosteado): 0.9 s |
| CP-IMP-077 | PASSED | Coincide con el resultado esperado. Se verificó: Existe solo la transacción e imputación de fila 1. |
| CP-IMP-078 | PASSED | Coincide con el resultado esperado. Se verificó: No hay transacciones, imputaciones ni import con ese UUID. — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"una importación lleva de 1 a 500 filas"} |
| CP-IMP-079 | PASSED | Coincide con el resultado esperado. Se verificó: No hay transacciones, imputaciones ni import. |
| CP-IMP-080 | PASSED | Coincide con el resultado esperado. Se verificó: HTTP no exitoso de clase 4xx; JSON code:"42501" y mensaje de permiso denegado; no se crea nada; el número de status HTTP se registra como evidencia porque la especificación no fija su mapeo. — Observado en la corrida — HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function import_transactions"} |
| CP-IMP-081 | PASSED | Coincide con el resultado esperado. Se verificó: HTTP 200 y cuerpo exacto []. |
| CP-IMP-082 | BLOCKED | US-81 (guía «¿Cómo armo el archivo?») no está implementada: el caso también pide que `import-guide-open` esté deshabilitado. Verificado: 1 sola llamada a /rpc/import_transactions, «Importando…» deshabilitado y una sola transacción |
| CP-IMP-083 | PASSED | Coincide con el resultado esperado. Se verificó: La consola devuelve true; crypto.randomUUID() vuelve a generar UUID variables. |
| CP-IMP-084 | PASSED | Coincide con el resultado esperado. Se verificó: Se importó 1 de 1 fila. sin aviso de ya guardado; una transacción. |
| CP-IMP-085 | PASSED | Coincide con el resultado esperado. Se verificó: Una transacción, una imputación y un import. |
| CP-IMP-086 | PASSED | Coincide con el resultado esperado. Se verificó: No hay transacciones ni imputaciones. |
| CP-IMP-087 | PASSED | Coincide con el resultado esperado. Se verificó: No hay transacciones ni imputaciones. |
| CP-IMP-088 | PASSED | Coincide con el resultado esperado. Se verificó: No hay transacciones ni imputaciones. |
| CP-IMP-089 | PASSED | Coincide con el resultado esperado. Se verificó: No hay transacciones ni imputaciones. |
| CP-IMP-090 | PASSED | Coincide con el resultado esperado. Se verificó: Sigue /import, con archivo, resumen, mensaje y Reintentar. |
| CP-IMP-091 | PASSED | Coincide con el resultado esperado. Se verificó: Navega a /register. |
| CP-IMP-092 | PASSED | Coincide con el resultado esperado. Se verificó: El navegador muestra su aviso nativo de cambios sin guardar; no recarga aún. — Observado en la corrida — beforeunload: defaultPrevented=true; diálogo nativo=beforeunload |
| CP-IMP-093 | BLOCKED | US-80 (Cuotas pendientes) no está implementada: no existe `import-row-2-pending` («Faltan 3 de 6 cuotas ($60.000,00)») y el resumen suma Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 10/06/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado |
| CP-IMP-094 | BLOCKED | US-80 (Cuotas pendientes) no está implementada: la importación todavía no desplaza las cuotas ni muestra «Faltan 3 de 6»; Movimientos mostraría las 6 cuotas desde junio — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 10/06/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado |
| CP-IMP-095 | BLOCKED | US-80 (Cuotas pendientes) no está implementada: no muestra «Faltan 2 de 3 cuotas ($66.666,67)»; el resumen suma Vas a importar 1 movimiento: $100.000,00 en gastos y $0,00 en ingresos (en pesos). — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 15/09/2026 · Gasto · Otros · Tarjeta de crédito · 3 cuotas $100.000,00» · Vas a importar 1 movimiento: $100.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado |
| CP-IMP-096 | BLOCKED | US-80 (Cuotas pendientes) no está implementada: no muestra «Faltan 6 de 6 cuotas ($120.000,00)»; no existe el campo `installments_paid` — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 15/09/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado |
| CP-IMP-097 | DUDA | Pasa con la app actual, pero también pasaría sin US-80 (la columna `installments_paid` no existe y no se pudo verificar que sea null); el caso no prueba nada hasta que US-80 esté implementada — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 15/09/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $240.000,00» · Vas a importar 1 movimiento: $240.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado |
| CP-IMP-098 | DUDA | Pasa con la app actual, pero también pasaría sin US-80 (no se pudo verificar installments_paid null: la columna no existe) |
| CP-IMP-099 | BLOCKED | US-80 (Cuotas pendientes) no está implementada: la app ignora la columna «Cuotas pendientes»: no muestra «Las cuotas pendientes solo van en una compra en cuotas» y el botón queda «Importar 1 movimiento» — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 01/09/2026 · Gasto · Otros · Tarjeta de crédito $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado |
| CP-IMP-100 | BLOCKED | US-80 (Cuotas pendientes) no está implementada: la app ignora la columna «Cuotas pendientes»: no muestra «Las cuotas pendientes solo van en una compra en cuotas» y el botón queda «Importar 1 movimiento» — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 01/09/2026 · Gasto · Otros · Tarjeta de crédito $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado |
| CP-IMP-101 | BLOCKED | US-80 (Cuotas pendientes) no está implementada: la app ignora la columna «Cuotas pendientes»: no muestra «Las cuotas pendientes van de 1 a 6» y el botón queda «Importar 1 movimiento» — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 01/09/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado |
| CP-IMP-102 | BLOCKED | US-80 (Cuotas pendientes) no está implementada: la app ignora la columna «Cuotas pendientes»: no muestra «Las cuotas pendientes van de 1 a 6» y el botón queda «Importar 1 movimiento» — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 01/09/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado |
| CP-IMP-103 | BLOCKED | US-80 (Cuotas pendientes) no está implementada: la app ignora la columna «Cuotas pendientes»: no muestra «Las cuotas pendientes van de 1 a 6» y el botón queda «Importar 1 movimiento» — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 01/09/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado |
| CP-IMP-104 | BLOCKED | US-80 (Cuotas pendientes) no está implementada: la app ignora la columna «Cuotas pendientes»: no muestra «Las cuotas pendientes van de 1 a 6» y el botón queda «Importar 1 movimiento» — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 01/09/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado |
| CP-IMP-105 | BLOCKED | US-80 (Cuotas pendientes) no está implementada: la app ignora la columna «Cuotas pendientes»: no muestra «Las cuotas pendientes van de 1 a 6» y el botón queda «Importar 1 movimiento» — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 01/09/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado |
| CP-IMP-106 | BLOCKED | US-80 (Cuotas pendientes) no está implementada: no muestra «Falta 1 de 6 cuotas ($20.000,00)»; la fila muestra «Fila 2 Lista 01/05/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 01/05/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado |
| CP-IMP-107 | BLOCKED | US-80 (Cuotas pendientes) no está implementada: no muestra «Faltan 6 de 6 cuotas ($120.000,00)»; la fila muestra «Fila 2 Lista 01/09/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 01/09/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado |
| CP-IMP-108 | BLOCKED | US-80 (Cuotas pendientes) no está implementada: no muestra «Faltan 3 de 6 cuotas ($60.000,00)»; la fila muestra «Fila 2 Lista 15/07/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 15/07/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado |
| CP-IMP-109 | BLOCKED | US-80 (Cuotas pendientes) no está implementada: la app ignora la columna «Cuotas pendientes»: no muestra «Con esa fecha todavía no puede haber 3 cuotas pagadas» y el botón queda «Importar 1 movimiento» — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 15/08/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado |
| CP-IMP-110 | BLOCKED | US-80 (Cuotas pendientes) no está implementada: la app ignora la columna «Cuotas pendientes»: no muestra «Con esa fecha todavía no puede haber 1 cuota pagada» y el botón queda «Importar 1 movimiento» — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 12/10/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado |
| CP-IMP-111 | DUDA | Pasa con la app actual, pero también pasaría sin US-80 (no hay regla F20/F21 que ocultar); el caso no prueba nada hasta que US-80 esté implementada — Observado en la corrida — Fila 2: error · Solo los gastos con tarjeta de crédito admiten cuotas · «Fila 2 Con error 01/09/2026 · Gasto · Otros · Efectivo · 3 cuotas $120.000,00 Solo los gastos con tarjeta de crédito admiten cuotas» · Vas a importar 0 movimientos: $0,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 0 movimientos» deshabilitado |
| CP-IMP-112 | DUDA | Pasa con la app actual, pero también pasaría sin US-80 (no hay regla F20/F21 que ocultar); el caso no prueba nada hasta que US-80 esté implementada — Observado en la corrida — Fila 2: error · Las cuotas van de 1 a 12 · «Fila 2 Con error 01/09/2026 · Gasto · Otros · Tarjeta de crédito $120.000,00 Las cuotas van de 1 a 12» · Vas a importar 0 movimientos: $0,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 0 movimientos» deshabilitado |
| CP-IMP-113 | BLOCKED | US-80 (Cuotas pendientes) no está implementada: no muestra «Falta 1 de 3 cuotas (US$100,00)»; el resumen suma Vas a importar 1 movimiento: $300.000,00 en gastos y $0,00 en ingresos (en pesos). — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 15/08/2026 · Gasto · Otros · Tarjeta de crédito · TC 1.000,00 · 3 cuotas US$300,00» · Vas a importar 1 movimiento: $300.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado |
| CP-IMP-114 | BLOCKED | US-80 (Cuotas pendientes) no está implementada: no muestra «Faltan 2 de 3 cuotas (US$66,67)»; el resumen suma Vas a importar 1 movimiento: $100.000,00 en gastos y $0,00 en ingresos (en pesos). — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 15/09/2026 · Gasto · Otros · Tarjeta de crédito · TC 1.000,00 · 3 cuotas US$100,00» · Vas a importar 1 movimiento: $100.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado |
| CP-IMP-115 | BLOCKED | US-80 (Cuotas pendientes) no está implementada: el resumen dice «Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos).» en lugar de $60.000,00 (la app toma las 6 cuotas, $120.000,00) — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 10/06/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado |
| CP-IMP-116 | BLOCKED | US-80 (Cuotas pendientes) no está implementada: el Resumen de octubre no tendría «Cuotas de meses anteriores» por $20.000,00: sin US-80 la compra se imputa desde junio y no hay cuota heredada de ese monto — Observado en la corrida — Fila 2: ready · «Fila 2 Lista 10/06/2026 · Gasto · Otros · Tarjeta de crédito · 6 cuotas $120.000,00» · Vas a importar 1 movimiento: $120.000,00 en gastos y $0,00 en ingresos (en pesos). · import-row-2-pending: no existe · botón «Importar 1 movimiento» habilitado |
| CP-IMP-117 | BLOCKED | US-80 (Cuotas pendientes) no está implementada: create_transaction no tiene el parámetro p_installments_paid y el borrado no puede listar solo las cuotas no cerradas de una compra empezada. El caso además exige avanzar el reloj del dominio al 12/11/2026, que no se puede en el entorno |
| CP-IMP-118 | BLOCKED | US-80 (Cuotas pendientes) no está implementada: create_transaction no tiene el parámetro p_installments_paid (HTTP 404 PGRST202) — Observado en la corrida — HTTP 404 {"code":"PGRST202","details":"Searched for the function public.create_transaction with parameters p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_installments_paid, p_occurred_on, p_request_id, p_type or with a single unnamed json/jsonb parameter, |
| CP-IMP-119 | BLOCKED | US-80 (Cuotas pendientes) no está implementada: create_transaction no tiene el parámetro p_installments_paid (HTTP 404 PGRST202) — Observado en la corrida — HTTP 404 {"code":"PGRST202","details":"Searched for the function public.create_transaction with parameters p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_installments_paid, p_occurred_on, p_request_id, p_type or with a single unnamed json/jsonb parameter, |
| CP-IMP-120 | BLOCKED | US-80 (Cuotas pendientes) no está implementada: create_transaction no tiene el parámetro p_installments_paid (HTTP 404 PGRST202) — Observado en la corrida — HTTP 404 {"code":"PGRST202","details":"Searched for the function public.create_transaction with parameters p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_installments_paid, p_occurred_on, p_request_id, p_type or with a single unnamed json/jsonb parameter, |
| CP-IMP-121 | BLOCKED | US-80 (Cuotas pendientes) no está implementada: create_transaction no tiene el parámetro p_installments_paid (HTTP 404 PGRST202) — Observado en la corrida — HTTP 404 {"code":"PGRST202","details":"Searched for the function public.create_transaction with parameters p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_installments_paid, p_occurred_on, p_request_id, p_type or with a single unnamed json/jsonb parameter, |
| CP-IMP-122 | BLOCKED | US-80 (Cuotas pendientes) no está implementada: create_transaction no tiene el parámetro p_installments_paid (HTTP 404 PGRST202) — Observado en la corrida — HTTP 404 {"code":"PGRST202","details":"Searched for the function public.create_transaction with parameters p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_installments_paid, p_occurred_on, p_request_id, p_shared_amount, p_shared_person, p_type or with a si |
| CP-IMP-123 | BLOCKED | US-80 (Cuotas pendientes) no está implementada: create_transaction no tiene el parámetro p_installments_paid (HTTP 404 PGRST202) — Observado en la corrida — HTTP 404 {"code":"PGRST202","details":"Searched for the function public.create_transaction with parameters p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_installments_paid, p_occurred_on, p_request_id, p_type or with a single unnamed json/jsonb parameter, |
| CP-IMP-124 | BLOCKED | US-80 (Cuotas pendientes) no está implementada: import_transactions ignora `installments_paid`: la fila 2 no se rechaza con el mensaje esperado — Observado en la corrida — HTTP 200 {"rows":[{"row":1,"status":"imported","transaction_id":"d291a0e8-67f4-4927-90ff-4d21389355ed"},{"row":2,"status":"imported","transaction_id":"bf563d38-267a-4da4-9b78-15da445c2c02"}],"import_id":"12412412-0000-4000-8000-000000000124","sent_rows":2,"imported_rows":2,"already_imported":false} |
| CP-IMP-125 | BLOCKED | US-80 (Cuotas pendientes) no está implementada: create_transaction no tiene el parámetro p_installments_paid (HTTP 404 PGRST202) — Observado en la corrida — HTTP 404 {"code":"PGRST202","details":"Searched for the function public.create_transaction with parameters p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_installments_paid, p_occurred_on, p_request_id, p_type or with a single unnamed json/jsonb parameter, |
| CP-IMP-126 | DUDA | Pasa con la app actual, pero también pasaría sin US-80 (la columna `installments_paid` no existe y no se pudo verificar que sea null) — Observado en la corrida — HTTP 200 "58ee07f1-b876-4511-8b46-8a9923d12a97" |
| CP-IMP-127 | BLOCKED | US-81 (guía «¿Cómo armo el archivo?») no está implementada — Observado en la corrida — import-guide-open: no existe; texto «¿Cómo armo el archivo?»: no existe |
| CP-IMP-128 | BLOCKED | US-81 (guía «¿Cómo armo el archivo?») no está implementada — Observado en la corrida — import-guide-open: no existe; texto «¿Cómo armo el archivo?»: no existe |
| CP-IMP-129 | BLOCKED | US-81 (guía «¿Cómo armo el archivo?») no está implementada — Observado en la corrida — import-guide-open: no existe; texto «¿Cómo armo el archivo?»: no existe |
| CP-IMP-130 | BLOCKED | US-81 (guía «¿Cómo armo el archivo?») no está implementada — Observado en la corrida — import-guide-open: no existe; texto «¿Cómo armo el archivo?»: no existe |
| CP-IMP-131 | BLOCKED | US-81 (guía «¿Cómo armo el archivo?») no está implementada — Observado en la corrida — import-guide-open: no existe; texto «¿Cómo armo el archivo?»: no existe |
| CP-IMP-132 | BLOCKED | US-81 (guía «¿Cómo armo el archivo?») no está implementada — Observado en la corrida — import-guide-open: no existe; texto «¿Cómo armo el archivo?»: no existe |
| CP-IMP-133 | BLOCKED | US-81 (guía «¿Cómo armo el archivo?») no está implementada — Observado en la corrida — import-guide-open: no existe; texto «¿Cómo armo el archivo?»: no existe |
| CP-IMP-134 | BLOCKED | US-81 (guía «¿Cómo armo el archivo?») no está implementada — Observado en la corrida — import-guide-open: no existe; texto «¿Cómo armo el archivo?»: no existe |
| CP-IMP-135 | BLOCKED | US-81 (guía «¿Cómo armo el archivo?») no está implementada — Observado en la corrida — import-guide-open: no existe; texto «¿Cómo armo el archivo?»: no existe |
| CP-IMP-136 | BLOCKED | US-81 (guía «¿Cómo armo el archivo?») no está implementada — Observado en la corrida — import-guide-open: no existe; texto «¿Cómo armo el archivo?»: no existe |
| CP-IMP-137 | DUDA | Pasa (se importa sin abrir la guía), pero la guía no existe todavía (US-81): el caso no prueba nada sobre ella |
| CP-IMP-138 | BLOCKED | US-81 (guía «¿Cómo armo el archivo?») no está implementada: los pasos 12 y 13 piden abrir y cerrar la guía. Verificado hasta el paso 11: resumen 11/7/4 y filas 7 a 10 con el filtro encendido — Observado en la corrida — Revisión con filtro de errores: filas 7,8,9,10; import-guide-open: no existe |
| CP-IMP-139 | DUDA | Pasa (en Resultado no hay botón de guía), pero el botón no existe en ninguna pantalla todavía (US-81): el caso no prueba nada hasta que exista |
| CP-IMP-140 | BLOCKED | US-81 (guía «¿Cómo armo el archivo?») no está implementada — Observado en la corrida — import-guide-open: no existe; texto «¿Cómo armo el archivo?»: no existe |
| CP-IMP-141 | BLOCKED | US-81 (guía «¿Cómo armo el archivo?») no está implementada — Observado en la corrida — import-guide-open: no existe; texto «¿Cómo armo el archivo?»: no existe |
| CP-IMP-142 | PASSED | Coincide con el resultado esperado. Se verificó: Fila 2 queda Con error y muestra exactamente No existe la cuenta «Efectivo» o está archivada; Importar 0 movimientos está deshabilitado. |
| CP-IMP-143 | PASSED | Coincide con el resultado esperado. Se verificó: Vuelve a 1 Archivo, sin nombre ni resumen del archivo anterior. |
| CP-IMP-144 | PASSED | Coincide con el resultado esperado. Se verificó: transactions responde HTTP 200 con []; ledger_entries responde HTTP 200 con []; imports responde HTTP 200 con una sola fila de id 14414414-0000-4000-8000-000000000144, sent_rows:1, imported_rows:0 y una fila 2 con status:"rejected". — Observado en la corrida — HTTP 200 {"rows":[{"row":2,"status":"rejected","error_code":"23514","error_message":"I4: cada cuota debe ser al menos 0,01"}],"import_id":"14414414-0000-4000-8000-000000000144","sent_rows":1,"imported_rows":0,"already_imported":false} |
| CP-SUS-014 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"Escribí un nombre"} |
| CP-SUS-015 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"El nombre admite hasta 60 caracteres"} |
| CP-SUS-017 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con 1 única fila ([{"name":"Netflix","amount":5000}]) — Observado en la corrida — HTTP 409 {"code":"23505","details":null,"hint":null,"message":"Ya tenés una suscripción con ese nombre"} |
| CP-SUS-019 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con 1 única fila ([{"name":"Spotify","status":"paused"}]) — Observado en la corrida — HTTP 409 {"code":"23505","details":null,"hint":null,"message":"Ya tenés una suscripción con ese nombre"} |
| CP-SUS-021 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"El monto debe ser mayor a cero"} |
| CP-SUS-023 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"El monto debe ser mayor a cero"} |
| CP-SUS-025 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"El monto debe ser mayor a cero"} |
| CP-SUS-027 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"El monto admite hasta 2 decimales"} |
| CP-SUS-029 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"El monto máximo es $999.999.999.999,99"} |
| CP-SUS-031 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"El monto máximo es USD 999.999.999.999,99"} |
| CP-SUS-032 | PASSED | Coincide con el resultado esperado. Se verificó: La URL sigue siendo /subscriptions/new y debajo de "Categoría" aparece "Elegí una categoría" |
| CP-SUS-033 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"Elegí una categoría"} |
| CP-SUS-035 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"Elegí un medio de pago"} |
| CP-SUS-037 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"Indicá el día de cobro"} |
| CP-SUS-039 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"El día de cobro va de 1 a 31"} |
| CP-SUS-041 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"El día de cobro va de 1 a 31"} |
| CP-SUS-043 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"El día de cobro va de 1 a 31"} |
| CP-SUS-045 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"Elegí el mes de inicio"} |
| CP-SUS-047 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"El mes de inicio va de octubre 2024 a octubre 2027"} |
| CP-SUS-049 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"El mes de inicio va de octubre 2024 a octubre 2027"} |
| CP-SUS-051 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"El mes de fin no puede ser anterior al de inicio"} |
| CP-SUS-053 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"El mes de fin puede ser como máximo diciembre 2099"} |
| CP-SUS-055 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"La descripción admite hasta 200 caracteres"} |
| CP-SUS-056 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 409 {"code":"23503","details":null,"hint":null,"message":"La categoría no está disponible"} |
| CP-SUS-057 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 409 {"code":"23503","details":null,"hint":null,"message":"El medio de pago no está disponible"} |
| CP-SUS-058 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 409 {"code":"23503","details":null,"hint":null,"message":"La categoría no está disponible"} |
| CP-SUS-059 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 409 {"code":"23503","details":null,"hint":null,"message":"El medio de pago no está disponible"} |
| CP-SUS-060 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 403 {"code":"42501","details":null,"hint":"Grant the required privileges to the current role with: GRANT INSERT ON public.subscriptions TO authenticated;","message":"permission denied for table subscriptions"} |
| CP-SUS-061 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con 1 fila ("id": "<SUB_ID>", "status": "active") — Observado en la corrida — HTTP 403 {"code":"42501","details":null,"hint":"Grant the required privileges to the current role with: GRANT DELETE ON public.subscriptions TO authenticated;","message":"permission denied for table subscriptions"} |
| CP-SUS-063 | PASSED | Coincide con el resultado esperado. Se verificó: Se muestra el estado subscription-detail-not-found con el texto "No encontramos esta suscripción." y el enlace "Ver suscripciones" (subscription-detail-not-found-back), sin exponer ningún dato de "Netflix B" |
| CP-SUS-064 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas devueltas por RLS) — Observado en la corrida — HTTP 200 [] |
| CP-SUS-065 | FAILED | esperado HTTP 403 42501; obtenido HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function create_subscription"} (el código 42501 coincide; cambia el HTTP: la API responde 401 al rol anon) — Observado en la corrida — HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function create_subscription"} |
| CP-SUS-066 | FAILED | esperado HTTP 403 42501; obtenido HTTP 401 {"code":"42501","details":null,"hint":"Grant the required privileges to the current role with: GRANT SELECT ON public.subscriptions TO anon;","message":"permission denied for table subscriptions"} (el código 42501 coincide; cambia el HTTP: la API responde 401 al rol anon) — Observado en la corrida — HTTP 401 {"code":"42501","details":null,"hint":"Grant the required privileges to the current role with: GRANT SELECT ON public.subscriptions TO anon;","message":"permission denied for table subscriptions"} |
| CP-SUS-068 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre /subscriptions/new; se muestra subscription-form-category-empty con el texto "No tenés categorías activas." y el enlace "Ir a Ajustes" (subscription-form-category-empty-settings) que apunta a /settings — Observado en la corrida — subscription-form-category-empty: existe; formulario habilitado: true |
| CP-SUS-069 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre /subscriptions/new; se muestra subscription-form-account-empty con el texto "No tenés medios de pago activos." y el enlace "Ir a Ajustes" (subscription-form-account-empty-settings) que apunta a /settings — Observado en la corrida — subscription-form-account-empty: existe; formulario habilitado: true |
| CP-SUS-072 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con exactamente 2 filas: subscription_period = "<MES_HACE_2>-01" y subscription_period = "<MES_ANTERIOR>-01", ambas con "amount_text": "10.00", "installments_count": 1 y "type": "expense" — Observado en la corrida — HTTP 200 {"failed":[],"generated":2} HTTP 200 {"failed":[],"generated":0} |
| CP-SUS-073 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con 1 fila ("subscription_period": "<MES_ANTERIOR>-01", "category_id": "<CATEGORY_ID>", "account_id": "<ACCOUNT_ID>", "amount_text": "10.00") — Observado en la corrida — HTTP 200 {"failed":[],"generated":1} |
| CP-SUS-074 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 200 {"failed":[],"generated":0} |
| CP-SUS-075 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas) — Observado en la corrida — HTTP 200 {"failed":[],"generated":0} |
| CP-SUS-077 | PASSED | Coincide con el resultado esperado. Se verificó: Se abre /subscriptions/<SUB_OVERFLOW_ID>; arriba de los datos se muestra el aviso subscription-detail-blocked con el texto "El gasto de <mes anterior> no se pudo cargar porque en pesos supera $999.999.999.999,99 (o no llega a $0,01). Revisá el monto o el tipo de cambio de ese mes." y **sin** el botón "Cargar tipo de cambio" |
| CP-SUS-088 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con "status": "paused", "paused_at" no nulo y "generate_from_period": "<MES_SIGUIENTE>-01" — Observado en la corrida — HTTP 200 {"generated_before":2} |
| CP-SUS-091 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con [{"status":"paused"}] — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"La suscripción ya está pausada"} |
| CP-SUS-092 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con "status": "cancelled" y "cancelled_at" no nulo — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"Una suscripción cancelada no se puede modificar"} |
| CP-SUS-093 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con [{"status":"active","paused_at":null}] — Observado en la corrida — HTTP 403 {"code":"42501","details":null,"hint":"Grant the required privileges to the current role with: GRANT UPDATE ON public.subscriptions TO authenticated;","message":"permission denied for table subscriptions"} |
| CP-SUS-094 | FAILED | esperado HTTP 404 P0002 «Suscripción no encontrada»; obtenido HTTP 500 {"code":"P0002","details":null,"hint":null,"message":"Suscripción no encontrada"} — Observado en la corrida — HTTP 500 {"code":"P0002","details":null,"hint":null,"message":"Suscripción no encontrada"} |
| CP-SUS-095 | FAILED | esperado HTTP 403 42501; obtenido HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function pause_subscription"} (el código 42501 coincide; cambia el HTTP: la API responde 401 al rol anon) — Observado en la corrida — HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function pause_subscription"} |
| CP-SUS-098 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con [{"status":"active","generate_from_period":"<MES_SIGUIENTE>-01"}] — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"La suscripción no está pausada"} |
| CP-SUS-099 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con "status": "cancelled" y "cancelled_at" no nulo — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"Una suscripción cancelada no se puede modificar"} |
| CP-SUS-100 | FAILED | esperado HTTP 404 P0002 «Suscripción no encontrada»; obtenido HTTP 500 {"code":"P0002","details":null,"hint":null,"message":"Suscripción no encontrada"} — Observado en la corrida — HTTP 500 {"code":"P0002","details":null,"hint":null,"message":"Suscripción no encontrada"} |
| CP-SUS-101 | FAILED | esperado HTTP 403 42501; obtenido HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function resume_subscription"} (el código 42501 coincide; cambia el HTTP: la API responde 401 al rol anon) — Observado en la corrida — HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function resume_subscription"} |
| CP-SUS-104 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con "status": "cancelled" y "cancelled_at" no nulo — Observado en la corrida — HTTP 200 {"generated_before":2} |
| CP-SUS-106 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con [{"status":"cancelled"}] — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"Una suscripción cancelada no se puede modificar"} |
| CP-SUS-107 | FAILED | esperado HTTP 404 P0002 «Suscripción no encontrada»; obtenido HTTP 500 {"code":"P0002","details":null,"hint":null,"message":"Suscripción no encontrada"} — Observado en la corrida — HTTP 500 {"code":"P0002","details":null,"hint":null,"message":"Suscripción no encontrada"} |
| CP-SUS-108 | FAILED | esperado HTTP 403 42501; obtenido HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function cancel_subscription"} (el código 42501 coincide; cambia el HTTP: la API responde 401 al rol anon) — Observado en la corrida — HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function cancel_subscription"} |
| CP-SUS-110 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con [{"amount_text":"15.00"}] — Observado en la corrida — HTTP 200 {"generated_after":0,"generated_before":2} |
| CP-SUS-111 | PASSED | Coincide con el resultado esperado. Se verificó: La transacción de <MES_ANTERIOR> sigue mostrando la categoría "Entretenimiento" y el medio de pago "Efectivo" |
| CP-SUS-112 | PASSED | Coincide con el resultado esperado. Se verificó: En la fila del movimiento (transactions-item), la descripción sigue diciendo "Netflix" y la marca de suscripción (transactions-item-subscription) muestra el nombre nuevo "Netflix 4K" |
| CP-SUS-114 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con [{"currency":"ARS"}] — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"La moneda y el mes de inicio no se pueden cambiar"} |
| CP-SUS-115 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con [{"start_period":"<MES_ACTUAL>-01"}] — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"La moneda y el mes de inicio no se pueden cambiar"} |
| CP-SUS-117 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con [{"end_period":null}] — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"El mes de fin no puede ser anterior a octubre 2026"} |
| CP-SUS-119 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con [{"name":"Netflix"}] — Observado en la corrida — HTTP 409 {"code":"23505","details":null,"hint":null,"message":"Ya tenés una suscripción con ese nombre"} |
| CP-SUS-120 | PASSED | Coincide con el resultado esperado. Se verificó: No se muestra el formulario editable; se muestra el texto "Esta suscripción está cancelada y no se puede editar." y el enlace "Volver" (subscription-form-cancelled-back) que apunta a /subscriptions/<SUB_ID> |
| CP-SUS-121 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con [{"status":"cancelled","amount_text":"5000.00"}] — Observado en la corrida — HTTP 400 {"code":"23514","details":null,"hint":null,"message":"Una suscripción cancelada no se puede modificar"} |
| CP-SUS-122 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con [{"amount_text":"5000.00"}] — Observado en la corrida — HTTP 403 {"code":"42501","details":null,"hint":"Grant the required privileges to the current role with: GRANT UPDATE ON public.subscriptions TO authenticated;","message":"permission denied for table subscriptions"} |
| CP-SUS-124 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con [{"category_id":"<CAT_ENTRETENIMIENTO>"}] — Observado en la corrida — HTTP 409 {"code":"23503","details":null,"hint":null,"message":"La categoría no está disponible"} |
| CP-SUS-125 | PASSED | Coincide con el resultado esperado. Se verificó: Navega a /subscriptions/<SUB_ID>, muestra "Cambios guardados" (subscription-toast) y en "Datos" la fila "Monto" muestra "$6.500,00" |
| CP-SUS-126 | PASSED | Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con [{"account_id":"<ACC_EFECTIVO>"}] — Observado en la corrida — HTTP 409 {"code":"23503","details":null,"hint":null,"message":"El medio de pago no está disponible"} |
| CP-SUS-129 | FAILED | esperado HTTP 404 P0002 «Suscripción no encontrada»; obtenido HTTP 500 {"code":"P0002","details":null,"hint":null,"message":"Suscripción no encontrada"} — Observado en la corrida — HTTP 500 {"code":"P0002","details":null,"hint":null,"message":"Suscripción no encontrada"} |
| CP-SUS-130 | FAILED | esperado HTTP 403 42501; obtenido HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function update_subscription"} (el código 42501 coincide; cambia el HTTP: la API responde 401 al rol anon) — Observado en la corrida — HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function update_subscription"} |
| CP-SUS-131 | PASSED | Coincide con el resultado esperado. Se verificó: La puesta al día corre al recargar sin crear una nueva transacción para <MES_ANTERIOR>; no aparece app-catchup-generated y la fila subscription-detail-occurrence con data-period="<MES_ANTERIOR>" sigue con data-deleted="true" y "Eliminado" |
| CP-SUS-132 | PASSED | Coincide con el resultado esperado. Se verificó: La tarjeta "Gastado en <mes corto anterior>" (dashboard-total-expenses) muestra "$1.000,00" (la ocurrencia eliminada de $5.000,00 dejó de sumar) |
| CP-SUS-133 | PASSED | Coincide con el resultado esperado. Se verificó: En /subscriptions/<SUB_ID>, la sección "Gastos cargados" (subscription-detail-occurrences) muestra 1 sola fila subscription-detail-occurrence con data-period="<MES_ANTERIOR>", data-deleted="false" y sin la marca "Eliminado" (subscription-detail-occurrence-deleted) |
| CP-SUS-134 | PASSED | Coincide con el resultado esperado. Se verificó: Navega a /subscriptions/<SUB_ID> mostrando el Detalle de "Netflix" — Observado en la corrida — Resumen: marca en Netflix=1, marca en Kiosco=0 |
| CP-SUS-137 | PASSED | Coincide con el resultado esperado. Se verificó: La fila del gasto muestra la marca transactions-item-subscription con el nombre "Netflix" |
| CP-SUS-139 | PASSED | Coincide con el resultado esperado. Se verificó: Navega a /settings?period=<MES_ANTERIOR> con el campo "Mes" (settings-fx-period) preseleccionado en <MES_ANTERIOR> |
| CP-SUS-153 | PASSED | Coincide con el resultado esperado. Se verificó: Navega a /subscriptions/<SUB_ID>, muestra "Suscripción guardada. Se cargaron 2 gastos vencidos." (subscription-toast) y en "Gastos cargados" (subscription-detail-occurrences) aparecen exactamente las mismas 2 fechas y períodos (<MES_ANTERIOR> y <MES_HACE_2>) que mostró "Se cargan al guardar" — Observado en la corrida — Se cargan: agosto 2026 · 28/08/2026 \| septiembre 2026 · 28/09/2026; próximos: octubre 2026 · 28/10/2026 \| noviembre 2026 · 28/11/2026 \| diciembre 2026 · 28/12/2026; resumen: Al guardar se cargan 2 gastos de $5.000,00 (total $10.000,00). |
| CP-SUS-154 | PASSED | Coincide con el resultado esperado. Se verificó: En "Se cargan al guardar" (subscription-form-preview-due) aparecen 3 filas (<MES_HACE_2>, <MES_ANTERIOR> y <MES_ACTUAL> con fecha <HOY>), "Próximos cobros" (subscription-form-preview-upcoming) empieza en <MES_SIGUIENTE> y el resumen (subscription-form-preview-summary) dice "Al guardar se cargan 3 gastos de $5.000,00 (total $15.000,00)." — Observado en la corrida — Se cargan: agosto 2026 · 27/08/2026 \| septiembre 2026 · 27/09/2026 \| octubre 2026 · 27/10/2026; próximos: noviembre 2026 · 27/11/2026 \| diciembre 2026 · 27/12/2026 \| enero 2027 · 27/01/2027; resumen: Al guardar se cargan 3 gastos de $5.000,00 (total $15.000,00). |
| CP-SUS-155 | PASSED | Coincide con el resultado esperado. Se verificó: En subscription-form-preview, el resumen (subscription-form-preview-summary) dice "Al guardar no se carga ningún gasto." y "Próximos cobros" (subscription-form-preview-upcoming) muestra 3 cobros empezando en "<mes mas 3> · 15/<MES_MAS_3>" — Observado en la corrida — próximos: enero 2027 · 15/01/2027 \| febrero 2027 · 15/02/2027 \| marzo 2027 · 15/03/2027; resumen: Al guardar no se carga ningún gasto. |
| CP-SUS-156 | PASSED | Coincide con el resultado esperado. Se verificó: En subscription-form-preview, "Se cargan al guardar" (subscription-form-preview-due) muestra las 3 filas "marzo 2026 · 31/03/2026", "abril 2026 · 30/04/2026" y "mayo 2026 · 31/05/2026", el resumen (subscription-form-preview-summary) dice "Al guardar se cargan 3 gastos de $8.000,00 (total $24.000,00)." y "Próximos cobros" (subscription-form-preview-upcoming) muestra "No hay más cobros: termina en mayo 2026." — Observado en la corrida — Se cargan: marzo 2026 · 31/03/2026 \| abril 2026 · 30/04/2026 \| mayo 2026 · 31/05/2026; resumen: Al guardar se cargan 3 gastos de $8.000,00 (total $24.000,00).; próximos: Próximos cobros No hay más cobros: termina… |
| CP-SUS-157 | FAILED | la fila de 2026-08 no tiene data-blocked="false" (el atributo está ausente; solo se escribe cuando la fila está bloqueada) — Observado en la corrida — 2026-08: data-blocked=null; 2026-09: data-blocked=true; texto «septiembre 2026 · 28/09/2026 Sin tipo de cambio: se carga cuando lo cargues»; resumen: Al guardar se carga 1 gasto de USD 20,00. |

Los 12 casos de Deudas (018 a 028) y los 40 de Navegación ejecutados a mano coincidieron con el resultado esperado en cada paso.

Los 78 casos de Suscripciones informados como «ok» por el equipo no se repitieron: su estado es el que informó el equipo, sin detalle de la ejecución.
