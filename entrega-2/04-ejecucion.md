# Entrega 2 · Ejecución de casos de prueba (V2) · Deudas y Navegación

Planilla: `04-ejecucion.xlsx` (una hoja por caso con el «Reporte de ejecución 1», el resultado obtenido, la evidencia y los defectos). Casos: ver `02-especificacion-casos-v2`.

## Condiciones de la ejecución

- **Fecha:** 2026-10-25.
- **Ejecutó a mano (Santiago):** CP-DEU-018 a 028 (con la variante 020B) y 40 casos de Navegación, en el **deploy de Vercel** (https://biyu-rust.vercel.app), con **Google Chrome**.
- **Ejecutó Claude Code, supervisado por Santiago (44 casos de Navegación):** los que el equipo no había podido probar (CP-NAV-013 a 017, 038, 039, 053 y 054) y los de herramienta técnica (CP-NAV-018 a 021, 040 a 046, 048, 063 a 085). Entorno local: Vite (`http://127.0.0.1:5173`) + Supabase local con todas las migraciones, `main` en `f096e22`, Chromium (Playwright 1.63) y navegador integrado de Claude Code.
- **Ejecutó Claude Code, supervisado por Santiago (Deudas):** el intento de CP-DEU-029 y los 92 casos CP-DEU-100 a 159, en el mismo entorno local. La preparación (deudas, gastos y tipos de cambio) se cargó por API, como en los casos originales con PR-04.
- **Datos:** usuarios y montos ficticios, uno por caso.

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

## Resumen

| Status | Casos |
|---|---|
| PASSED | 143 |
| FAILED | 1 |
| DUDA (pasa, con dudas) | 2 |
| BLOCKED | 43 |
| No ejecutados | 1 |
| **Total** | **190** |

## Detalle de los casos que no son PASSED

### CP-DEU-029 — Sin haber iniciado sesión no se puede crear un gasto compartido · **BLOCKED**

**Obtenido:** No se pudo ejecutar como está escrito. Se probaron tres variantes en el entorno local: (A) el caso tal cual (sin sesión, con p_shared_persons y p_shared_amounts): responde 404 PGRST202 «función no encontrada» y no 401/42501; (B) sin sesión con la función actual de una sola persona (p_shared_person): responde 401 con el código 42501 «permission denied for function create_transaction» (sin sesión no se puede crear gastos); (C) con sesión y la firma de varias personas: también 404. Por eso el resultado esperado no puede comprobarse hasta que exista la función.

**Defectos:** —

**Notas:** BLOQUEADO: la función de varias personas (US-82, issue #270 abierto) todavía no está implementada en la app. Cuando exista, repetir el caso. Sin defecto: el bloqueo depende de una historia pendiente.

### CP-DEU-128 — Gasto compartido con varias personas: agregar, quitar y guardar · **BLOCKED**

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-128B — Las personas se ordenan por nombre sin distinguir mayúsculas ni tildes · **BLOCKED**

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-129 — «Dividir en partes iguales» entre 2 personas · **BLOCKED**

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-129B — Dividir un gasto de $0,02 entre 2 personas da error · **BLOCKED**

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-129C — «Dividir en partes iguales» con los nombres vacíos · **BLOCKED**

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-130 — «Dividir en partes iguales» entre 3 personas · **BLOCKED**

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-130B — Cambiar la moneda con personas cargadas vacía los montos · **BLOCKED**

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-130C — «Dividir en partes iguales» en dólares · **BLOCKED**

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-130D — En dólares, dividir un gasto muy chico da error de centavos · **BLOCKED**

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-131 — Entre todos pueden deber todo el gasto (tu parte es $0) · **BLOCKED**

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-132 — La suma de lo que te deben no puede superar el gasto · **BLOCKED**

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-132B — Bajar el gasto por debajo de lo que te deben da error · **BLOCKED**

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-132C — Una persona que debe más que el gasto da error en su fila · **BLOCKED**

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-132D — Bajar el gasto muy por debajo da error en cada fila · **BLOCKED**

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-133 — Se puede compartir con hasta 10 personas · **BLOCKED**

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-134 — No se puede repetir una persona · **BLOCKED**

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-135 — Una persona sin nombre da error en su fila · **BLOCKED**

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-135B — Quitar una persona conserva a las demás · **BLOCKED**

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-135C — Pasar a Ingreso y volver a Gasto reinicia la sección compartida · **BLOCKED**

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-135D — Apagar «Gasto compartido» guarda el gasto sin deudas · **BLOCKED**

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-136 — Gasto compartido con 3 personas en 2 cuotas: etiqueta en Movimientos y Resumen · **BLOCKED**

**Obtenido:** La preparación del caso necesita la función de varias personas (US-82, issue #270), que todavía no existe: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada»). Observado: se puede crear el gasto compartido con 3 personas (preparación del caso) (obtenido: 404 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_occurred_on, p_sh.

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-136B — Al borrar un gasto con varias deudas, el aviso las lista · **BLOCKED**

**Obtenido:** La preparación del caso necesita la función de varias personas (US-82, issue #270), que todavía no existe: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada»). Observado: se puede crear el gasto compartido con 3 personas (preparación del caso) (obtenido: 404 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_occurred_on, p_sh.

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-136C — Las 3 deudas de un mismo gasto aparecen en Deudas · **BLOCKED**

**Obtenido:** La preparación del caso necesita la función de varias personas (US-82, issue #270), que todavía no existe: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada»). Observado: se puede crear el gasto compartido con 3 personas (preparación del caso) (obtenido: 404 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_occurred_on, p_sh.

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-136D — Eliminar el gasto saca sus 3 deudas · **BLOCKED**

**Obtenido:** La preparación del caso necesita la función de varias personas (US-82, issue #270), que todavía no existe: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada»). Observado: se puede crear el gasto compartido con 3 personas (preparación del caso) (obtenido: 404 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_occurred_on, p_sh.

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-136E — Restaurar el gasto devuelve sus 3 deudas con su estado · **BLOCKED**

**Obtenido:** La preparación del caso necesita la función de varias personas (US-82, issue #270), que todavía no existe: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada»). Observado: se puede crear el gasto compartido con 3 personas (preparación del caso) (obtenido: 404 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_occurred_on, p_sh.

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-137 — Por API, 2 personas y 1 monto se rechaza · **BLOCKED**

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada» en vez del rechazo esperado). Observado: 400 con 23514 y «Un gasto compartido necesita una persona y un monto por cada deuda» (obtenido: 404 PGRST202 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count.

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-138 — Por API, listas vacías se rechazan · **BLOCKED**

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada» en vez del rechazo esperado). Observado: 400 con 23514 y «Un gasto compartido necesita al menos una persona» (obtenido: 404 PGRST202 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_occurred_on, .

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-139 — Por API, 11 personas se rechaza · **BLOCKED**

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada» en vez del rechazo esperado). Observado: 400 con 23514 y «Un gasto se comparte con hasta 10 personas» (obtenido: 404 PGRST202 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_occurred_on, p_share.

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-140 — Por API, la misma persona repetida se rechaza · **BLOCKED**

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada» en vez del rechazo esperado). Observado: 400 con 23514 y «Cada persona puede aparecer una sola vez» (obtenido: 404 PGRST202 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_occurred_on, p_shared_.

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-141 — Por API, deudas que suman más que el gasto se rechazan · **BLOCKED**

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada» en vez del rechazo esperado). Observado: 400 con 23514 y «I7: la suma de las deudas no puede superar el monto del gasto» (obtenido: 404 PGRST202 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_o.

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-142 — Dólares: el redondeo hace que las deudas sumen más que el gasto · **BLOCKED**

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: con «Gasto compartido» encendido no hay «Agregar persona» ni «Dividir en partes iguales», así que los pasos del caso no se pueden hacer. Observado: existe «Agregar persona» (obtenido: no existe); existe «Dividir en partes iguales» (obtenido: no existe).

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-142A — Por API, el mismo caso de redondeo se rechaza · **BLOCKED**

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada» en vez del rechazo esperado). Observado: 400 con 23514 y «I7: en pesos, la suma de las deudas supera el gasto por redondeo» (obtenido: 404 PGRST202 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, .

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-142B — Por API, una segunda persona sin nombre se rechaza sin guardar nada · **BLOCKED**

**Obtenido:** La función de varias personas (US-82, issue #270) no existe todavía: create_transaction no acepta listas de personas y montos (responde 404 «función no encontrada» en vez del rechazo esperado). Observado: 400 con 23514 y «Ingresá con quién compartiste el gasto» (obtenido: 404 PGRST202 Could not find the function public.create_transaction(p_account_id, p_amount, p_category_id, p_currency, p_description, p_fx_rate, p_installments_count, p_occurred_on, p_shared_am.

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-82 (issue #270). Sin defecto: depende de una historia pendiente.

### CP-DEU-145 — Resumen: gasto en 12 cuotas con deuda, neto negativo · **DUDA**

**Obtenido:** El caso pide 12 cuotas con la cuenta «Efectivo», pero la app solo permite cuotas con una cuenta de tarjeta de crédito: la preparación del caso no se puede hacer tal como está escrita. Se ejecutó con la cuenta «Tarjeta de crédito». La app hace lo esperado con la cuenta «Tarjeta de crédito»: agosto 2026 muestra total $10.000,00, neto -$50.000,00 y la aclaración del neto; septiembre 2026 muestra total $10.000,00 y no muestra la fila del neto.

**Defectos:** —

**Notas:** Parece un error del caso, no de la aplicación. Corregir la cuenta de preparación del caso.

### CP-DEU-151 — Balance: una deuda suelta «Me deben» resta del balance del mes · **BLOCKED**

**Obtenido:** La función «deudas sueltas en el balance del mes» (US-83, issue #271) todavía no existe: el Resumen no muestra «Incluye deudas sueltas» ni suma o resta las deudas sueltas en el balance. Observado: mes actual: balance $80.000,00 (obtenido: "$100.000,00" no contiene "$80.000,00"); mes actual: «Incluye deudas sueltas: -$20.000,00» (obtenido: "no existe la línea" no contiene "Incluye deudas sueltas: -$20.000,00").

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-83 (issue #271). Sin defecto: depende de una historia pendiente.

### CP-DEU-152 — Balance: una deuda suelta «Debo» suma al balance del mes · **BLOCKED**

**Obtenido:** La función «deudas sueltas en el balance del mes» (US-83, issue #271) todavía no existe: el Resumen no muestra «Incluye deudas sueltas» ni suma o resta las deudas sueltas en el balance. Observado: mes actual: balance $150.000,00 (obtenido: "$100.000,00" no contiene "$150.000,00"); mes actual: «Incluye deudas sueltas: $50.000,00» (obtenido: "no existe la línea" no contiene "Incluye deudas sueltas: $50.000,00").

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-83 (issue #271). Sin defecto: depende de una historia pendiente.

### CP-DEU-153 — Balance: saldar la deuda suelta el mismo mes lo deja como antes · **BLOCKED**

**Obtenido:** La función «deudas sueltas en el balance del mes» (US-83, issue #271) todavía no existe: el Resumen no muestra «Incluye deudas sueltas» ni suma o resta las deudas sueltas en el balance. Observado: mes actual: «Incluye deudas sueltas: $0,00» (obtenido: "no existe la línea" no contiene "Incluye deudas sueltas: $0,00").

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-83 (issue #271). Sin defecto: depende de una historia pendiente.

### CP-DEU-153B — Balance en cero: deuda suelta creada y saldada el mismo mes · **BLOCKED**

**Obtenido:** La función «deudas sueltas en el balance del mes» (US-83, issue #271) todavía no existe: el Resumen no muestra «Incluye deudas sueltas» ni suma o resta las deudas sueltas en el balance. Observado: mes actual: balance $0,00 (obtenido: "sin balance" no contiene "$0,00"); mes actual: etiqueta «En cero» (obtenido: "sin etiqueta" no contiene "En cero"); mes actual: «Incluye deudas sueltas: $0,00» (obtenido: "no existe la línea" no contiene "Incluye deudas su.

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-83 (issue #271). Sin defecto: depende de una historia pendiente.

### CP-DEU-154 — Balance: una deuda saldada hoy mueve el balance de dos meses · **BLOCKED**

**Obtenido:** La función «deudas sueltas en el balance del mes» (US-83, issue #271) todavía no existe: el Resumen no muestra «Incluye deudas sueltas» ni suma o resta las deudas sueltas en el balance. Observado: mes anterior: balance -$20.000,00 (obtenido: "sin balance" no contiene "-$20.000,00"); mes anterior: etiqueta «Déficit» (obtenido: "sin etiqueta" no contiene "Déficit"); mes anterior: «Incluye deudas sueltas: -$20.000,00» (obtenido: "no existe la línea" no con.

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-83 (issue #271). Sin defecto: depende de una historia pendiente.

### CP-DEU-155 — Balance: reabrir la deuda saca el evento del mes actual · **BLOCKED**

**Obtenido:** La función «deudas sueltas en el balance del mes» (US-83, issue #271) todavía no existe: el Resumen no muestra «Incluye deudas sueltas» ni suma o resta las deudas sueltas en el balance. Observado: mes anterior: balance -$20.000,00 (obtenido: "sin balance" no contiene "-$20.000,00"); mes anterior: «Incluye deudas sueltas: -$20.000,00» (obtenido: "no existe la línea" no contiene "Incluye deudas sueltas: -$20.000,00").

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-83 (issue #271). Sin defecto: depende de una historia pendiente.

### CP-DEU-156 — Balance: una deuda suelta «Debo» saldada hoy mueve dos meses · **BLOCKED**

**Obtenido:** La función «deudas sueltas en el balance del mes» (US-83, issue #271) todavía no existe: el Resumen no muestra «Incluye deudas sueltas» ni suma o resta las deudas sueltas en el balance. Observado: mes anterior: balance $50.000,00 (obtenido: "sin balance" no contiene "$50.000,00"); mes anterior: etiqueta «Superávit» (obtenido: "sin etiqueta" no contiene "Superávit"); mes anterior: «Incluye deudas sueltas: $50.000,00» (obtenido: "no existe la línea" no co.

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-83 (issue #271). Sin defecto: depende de una historia pendiente.

### CP-DEU-157 — Balance: la deuda en dólares conserva el tipo de cambio de origen · **BLOCKED**

**Obtenido:** La función «deudas sueltas en el balance del mes» (US-83, issue #271) todavía no existe: el Resumen no muestra «Incluye deudas sueltas» ni suma o resta las deudas sueltas en el balance. Observado: mes anterior: balance -$50.000,00 (obtenido: "sin balance" no contiene "-$50.000,00"); mes anterior: «Incluye deudas sueltas: -$50.000,00» (obtenido: "no existe la línea" no contiene "Incluye deudas sueltas: -$50.000,00"); mes actual: balance $50.000,00 (obten.

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-83 (issue #271). Sin defecto: depende de una historia pendiente.

### CP-DEU-158 — Balance: un gasto compartido no aparece como deuda suelta · **DUDA**

**Obtenido:** Pasa con la app actual, pero también pasaría si la función de deudas sueltas (US-83) no existiera: la línea «Incluye deudas sueltas» todavía no se muestra en ningún caso, así que el caso no prueba nada hasta que US-83 esté implementada. Se cumple todo lo esperado (balance -$120.000,00 antes y después de saldar la deuda y sin la línea «Incluye deudas sueltas»).

**Defectos:** —

**Notas:** Repetir cuando exista US-83: hoy el caso no prueba nada.

### CP-DEU-159 — Un mes solo con una deuda suelta no se ve vacío · **BLOCKED**

**Obtenido:** La función «deudas sueltas en el balance del mes» (US-83, issue #271) todavía no existe: el Resumen no muestra «Incluye deudas sueltas» ni suma o resta las deudas sueltas en el balance. Observado: no muestra el estado vacío del mes (obtenido: 1 ≠ 0); balance -$20.000,00 (obtenido: "sin balance" no contiene "-$20.000,00"); etiqueta «Déficit» (obtenido: "sin etiqueta" no contiene "Déficit"); línea «Incluye deudas sueltas: -$20.000,00» (obtenido: "no exist.

**Defectos:** —

**Notas:** BLOQUEADO por función no implementada: repetir el caso cuando se implemente US-83 (issue #271). Sin defecto: depende de una historia pendiente.

### CP-NAV-060 — Un lector de pantalla (TalkBack) anuncia el error sin mover el foco · **NO EJECUTADO**

**Obtenido:** No se ejecutó: requiere un teléfono Pixel 7 con Android 15, Chrome y TalkBack en español, que no estuvo disponible.

**Defectos:** —

**Notas:** Pendiente de ejecutar cuando haya un dispositivo con TalkBack.

### CP-NAV-084 — La API conserva un solo gasto eliminado para la clave recuperada · **FAILED**

**Obtenido:** La baja respondió HTTP 204 SIN cuerpo (el caso espera HTTP 200 con cuerpo null). El resto coincide: la transacción quedó con deleted_at con fecha (una sola fila) y la cuota histórica se conserva (installment_number 1, 12500.00).

**Defectos:** DEF-029

**Notas:** Ver DEF-029. Parece un error en el resultado esperado del caso: delete_transaction está definida como «returns void» y PostgREST responde 204 a esas funciones. Decisión pendiente: corregir el caso o la función. No se corrigió nada.

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

Los 12 casos de Deudas (018 a 028) y los 40 de Navegación ejecutados a mano coincidieron con el resultado esperado en cada paso.
