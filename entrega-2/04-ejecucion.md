# Entrega 2 · Ejecución de casos de prueba (V2) · Deudas y Navegación

Planilla: `04-ejecucion.xlsx` (una hoja por caso con el «Reporte de ejecución 1», el resultado obtenido, la evidencia y los defectos). Casos: ver `02-especificacion-casos-v2`.

## Condiciones de la ejecución

- **Fecha:** 2026-10-25.
- **Ejecutó a mano (Santiago):** CP-DEU-018 a 028 (con la variante 020B) y 40 casos de Navegación, en el **deploy de Vercel** (https://biyu-rust.vercel.app), con **Google Chrome**.
- **Ejecutó Claude Code, supervisado por Santiago (44 casos de Navegación):** los que el equipo no había podido probar (CP-NAV-013 a 017, 038, 039, 053 y 054) y los de herramienta técnica (CP-NAV-018 a 021, 040 a 046, 048, 063 a 085). Entorno local: Vite (`http://127.0.0.1:5173`) + Supabase local con todas las migraciones, `main` en `f096e22`, Chromium (Playwright 1.63) y navegador integrado de Claude Code.
- **Intento de CP-DEU-029 (Claude Code):** mismo entorno local.
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
| PASSED | 95 |
| FAILED | 1 |
| BLOCKED | 1 |
| No ejecutados | 1 |
| **Total** | **98** |

## Detalle de los casos que no son PASSED

### CP-DEU-029 — Sin haber iniciado sesión no se puede crear un gasto compartido · **BLOCKED**

**Obtenido:** No se pudo ejecutar como está escrito. Se probaron tres variantes en el entorno local: (A) el caso tal cual (sin sesión, con p_shared_persons y p_shared_amounts): responde 404 PGRST202 «función no encontrada» y no 401/42501; (B) sin sesión con la función actual de una sola persona (p_shared_person): responde 401 con el código 42501 «permission denied for function create_transaction» (sin sesión no se puede crear gastos); (C) con sesión y la firma de varias personas: también 404. Por eso el resultado esperado no puede comprobarse hasta que exista la función.

**Defectos:** —

**Notas:** BLOQUEADO: la función de varias personas (US-82, issue #270 abierto) todavía no está implementada en la app. Cuando exista, repetir el caso. Sin defecto: el bloqueo depende de una historia pendiente.

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
