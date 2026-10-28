# Entrega 2 · Reportes de defectos (V2) · Deudas, Navegación, Exportar CSV, Importar Excel y Suscripciones

Planilla: `05-reportes-de-defectos.xlsx` (un índice y una hoja por defecto, con el formato «Defect Report - Template» de la cátedra). La numeración sigue la de la Entrega 1 (DEF-001 a DEF-028): los defectos de V2 empiezan en **DEF-029** (retirado, ver abajo) y siguen desde DEF-030. Todavía no tienen issue en GitHub: quedan listos para cargar.

Escala de severidad y flujo de estados: `docs/07-plan-de-testing.md` §5. Severidad la fija quien reporta; **prioridad la fija el PO** (la que figura acá es la sugerida por quien reportó).

DEF-029 se retiró el 2026-10-27: era un error de un caso de Navegación (CP-NAV-084 en la numeración anterior: la baja responde 204 sin cuerpo, y el caso esperaba 200 con `null`), no un defecto de la aplicación; el caso se quitó del catálogo. La numeración de los demás defectos no cambia.

**Los casos BLOCKED no tienen defecto:** dependen de funcionalidades todavía no implementadas (US-82, US-83, US-80 y US-81) y se vuelven a ejecutar en V3.

**Regresión de V1 (2026-10-28):** los 60 casos de V1 seleccionados pasaron sobre V2; no se abrió ningún defecto nuevo (ver `06-reporte-de-ejecucion`).

## Resumen

| ID | Título | Severidad | Prioridad sugerida | Estado | Caso | Historia |
|---|---|---|---|---|---|---|
| DEF-030 | Tocar fuera de la hoja «Exportar movimientos» no la cierra | Media | A definir por el PO | Abierto · se reproduce el 2026-10-27 | CP-EXP-027 | US-47 · Exportar movimientos a CSV (CA-23) |
| DEF-031 | «Atrás» y «Adelante» del navegador cambian la URL pero la hoja de exportar queda abierta | Media | A definir por el PO | Abierto · se reproduce el 2026-10-27 | CP-EXP-028 (el caso equivalente con «Adelante» se recortó del catálogo el 2026-10-27) | US-47 · Exportar movimientos a CSV (CA-24 y requisito «todo cambio de URL») |
| DEF-032 | «Atrás» durante «Exportando…» no cancela la exportación: el archivo se descarga igual | Media | A definir por el PO | Abierto · se reproduce el 2026-10-27 | CP-EXP-029 | US-47 · Exportar movimientos a CSV (CA-24) |
| DEF-033 | La tarjeta de una fila lista muestra la categoría y la cuenta como están escritas en el archivo, no como se llaman en Biyu | Baja | A definir por el PO | Abierto · se reproduce el 2026-10-27 | CP-IMP-024 | US-76 · Revisión de filas (CA-5) |
| DEF-034 | Operar sobre la suscripción de otro usuario responde HTTP 500 en lugar de 404 | Baja | A definir por el PO | Abierto · se reproduce el 2026-10-27 | CP-SUS-032 (otros tres casos con el mismo defecto se recortaron del catálogo el 2026-10-27) | US-56 · CA-9, US-57 · CA-7, US-58 · CA-9 y US-59 (Pausar, reanudar, cancelar y editar: par de autorización) |
| DEF-035 | Sin sesión, la API responde HTTP 401 y los casos esperan 403 | Baja | A definir por el PO | Abierto · se reproduce el 2026-10-27 | CP-SUS-022 (otros cinco casos con el mismo defecto se recortaron del catálogo el 2026-10-27) | US-52 · CA-13 y US-56 · CA-9, US-57 · CA-7, US-58 · CA-9, US-59 (rol anon) |
| DEF-036 | La vista previa del calendario no marca con data-blocked="false" las filas que no están bloqueadas | Baja | A definir por el PO | Abierto · se reproduce el 2026-10-27 | CP-SUS-048 | US-61 · Vista previa del calendario al dar de alta una suscripción |
| DEF-037 | El primer clic en «US$» de «Nueva deuda» se pierde: el error de «Persona» corre los botones y la moneda no se selecciona | Media | A definir por el PO | Abierto · se reproduce el 2026-10-27 | CP-DEU-024 y CP-DEU-025 | US-36 · Cargar una deuda suelta (CA-6, FR-18) |

**Abiertos por severidad:** Crítica: 0 · Alta: 0 · Media: 4 · Baja: 4 · Total abiertos: 8.

## DEF-030 · Tocar fuera de la hoja «Exportar movimientos» no la cierra

| Campo | Contenido |
|---|---|
| Estado | Abierto · se reproduce el 2026-10-27 |
| Severidad | Media |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | ejecución de CP-EXP-027 (Entrega 2). |
| Caso de prueba | CP-EXP-027 |
| Historia | US-47 · Exportar movimientos a CSV (CA-23) |
| Issue | A crear |
| Reportó | Claude Code (IA), supervisado por Santiago |
| Entorno | Local, 2026-10-27 · Vite (http://127.0.0.1:5173) + Supabase local · main 1c72d0f · Chromium (Playwright 1.63), reloj fijado en 09/10/2026 |

Tocar fuera de la hoja «Exportar movimientos» no la cierra.

**Pasos para reproducir**

1. Abrir la app e iniciar sesión con un usuario de prueba. Si aparece la configuración inicial, tocar «Saltear» en sus 4 pasos.
2. Crear un gasto con fecha en septiembre de 2026 y abrir en el navegador /transactions?period=2026-09.
3. Tocar «Exportar» arriba a la derecha: se abre la hoja «Exportar movimientos».
4. Hacer clic sobre el fondo oscuro, fuera de la hoja (por ejemplo, en la esquina superior izquierda de la pantalla).
5. Mirar si la hoja sigue abierta.

**Resultado esperado.** CA-23 / CP-EXP-027: tocar fuera de la hoja la cierra sin descargar nada y la URL conserva ?period=2026-09 (mientras no esté en «Exportando…»).

**Resultado obtenido.** La hoja sigue abierta. El elemento que recibe el clic en esa posición es el div de fondo (clases fixed inset-0 -z-10, aria-hidden="true"), no el contenedor de la hoja. Solo «Cancelar» y Escape la cierran.

**Evidencia.** Observado en la corrida de CP-EXP-027: la hoja sigue abierta tras el clic; document.elementFromPoint(5, 5) = DIV.fixed.inset-0.-z-10.bg-[rgba(43,30,25,0.32)], aria-hidden=true

**Notas.** Causa probable: en src/components/transactions/ExportTransactionsDialog.tsx el cierre por clic exige e.target === e.currentTarget, pero el div de fondo es hijo del contenedor y cubre toda la pantalla: recibe el clic y el destino nunca coincide. No se corrigió nada.

## DEF-031 · «Atrás» y «Adelante» del navegador cambian la URL pero la hoja de exportar queda abierta

| Campo | Contenido |
|---|---|
| Estado | Abierto · se reproduce el 2026-10-27 |
| Severidad | Media |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | ejecución de CP-EXP-028 y de su caso equivalente con «Adelante» (Entrega 2). |
| Caso de prueba | CP-EXP-028 (el caso equivalente con «Adelante» se recortó del catálogo el 2026-10-27) |
| Historia | US-47 · Exportar movimientos a CSV (CA-24 y requisito «todo cambio de URL») |
| Issue | A crear |
| Reportó | Claude Code (IA), supervisado por Santiago |
| Entorno | Local, 2026-10-27 · Vite (http://127.0.0.1:5173) + Supabase local · main 1c72d0f · Chromium (Playwright 1.63), reloj fijado en 09/10/2026 |

Con la hoja «Exportar movimientos» abierta, «Atrás» y «Adelante» del navegador cambian el período de la URL pero la hoja no se cierra.

**Pasos para reproducir**

1. Abrir la app e iniciar sesión con un usuario de prueba (con la configuración inicial salteada).
2. Abrir en el navegador /transactions?period=2026-08.
3. Tocar el botón de mes siguiente: la URL pasa a ?period=2026-09.
4. Tocar «Exportar»: se abre la hoja.
5. Hacer clic en «Atrás» del navegador y mirar la URL y la hoja. (Para el caso equivalente con «Adelante», recortado: abrir la hoja en agosto, después de haber vuelto desde septiembre, y hacer clic en «Adelante».)

**Resultado esperado.** CA-24 / CP-EXP-028 y su caso equivalente con «Adelante»: la hoja se cierra, la URL pasa a ?period=2026-08 (con «Adelante», a ?period=2026-09) y no se descarga archivo.

**Resultado obtenido.** La URL cambia al período anterior (o al siguiente) y la hoja sigue abierta. El evento popstate sí se dispara (verificado en 3 de 3 repeticiones), pero la hoja no se cierra.

**Evidencia.** Observado en las corridas de CP-EXP-028 y de su caso equivalente con «Adelante»: URL cambiada con la hoja abierta; log de popstate: ['popstate@?period=2026-08']

**Notas.** Causa no determinada. En ExportTransactionsDialog.tsx hay un efecto que cierra la hoja cuando cambia location.key y un oyente de popstate; ninguno logra cerrarla. Hipótesis sin confirmar: el efecto que reinicia initialLocationKeyRef cuando cambia location.key corre antes del que compara la clave y la deja siempre igual. No se corrigió nada.

## DEF-032 · «Atrás» durante «Exportando…» no cancela la exportación: el archivo se descarga igual

| Campo | Contenido |
|---|---|
| Estado | Abierto · se reproduce el 2026-10-27 |
| Severidad | Media |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | ejecución de CP-EXP-029 (Entrega 2). |
| Caso de prueba | CP-EXP-029 |
| Historia | US-47 · Exportar movimientos a CSV (CA-24) |
| Issue | A crear |
| Reportó | Claude Code (IA), supervisado por Santiago |
| Entorno | Local, 2026-10-27 · Vite (http://127.0.0.1:5173) + Supabase local · main 1c72d0f · Chromium (Playwright 1.63), reloj fijado en 09/10/2026 |

«Atrás» durante «Exportando…» no cancela la exportación: el archivo se descarga igual.

**Pasos para reproducir**

1. Abrir la app e iniciar sesión con un usuario de prueba que tenga un gasto de septiembre de 2026.
2. Abrir /transactions?period=2026-08, tocar el mes siguiente (URL ?period=2026-09) y tocar «Exportar».
3. Demorar unos segundos las respuestas de /rest/v1/transactions (en las pruebas, 3 s con Playwright; en DevTools, «1 kbit/s» y latencia 2000 ms).
4. Tocar «Descargar CSV»: el botón pasa a «Exportando…».
5. Hacer clic en «Atrás» del navegador y esperar a que termine la demora.

**Resultado esperado.** CA-24 / CP-EXP-029 (paso 22): la exportación se cancela; no aparece ningún archivo ni aviso de éxito.

**Resultado obtenido.** Al terminar la lectura se descarga biyu-movimientos-2026-09.csv y aparece el aviso «Exportamos 1 movimiento» (1 descarga y 1 aviso), con el usuario ya en ?period=2026-08.

**Evidencia.** Observado en la corrida de CP-EXP-029: aviso de éxito en el período anterior; descargas registradas por el navegador = 1

**Notas.** Relacionado con DEF-031: el cierre por «Atrás» no llega a abortar la exportación en curso (AbortController). No se investigó a fondo. No se corrigió nada.

## DEF-033 · La tarjeta de una fila lista muestra la categoría y la cuenta como están escritas en el archivo, no como se llaman en Biyu

| Campo | Contenido |
|---|---|
| Estado | Abierto · se reproduce el 2026-10-27 |
| Severidad | Baja |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | ejecución de CP-IMP-024 (Entrega 2). |
| Caso de prueba | CP-IMP-024 |
| Historia | US-76 · Revisión de filas (CA-5) |
| Issue | A crear |
| Reportó | Claude Code (IA), supervisado por Santiago |
| Entorno | Local, 2026-10-27 · Vite (http://127.0.0.1:5173) + Supabase local · main 1c72d0f · Chromium (Playwright 1.63) |

En la Revisión del importador, la tarjeta de una fila «Lista» muestra el texto de la categoría y de la cuenta tal cual está en el Excel (por ejemplo «educación» y «efectivo»), en lugar del nombre con el que existen en Biyu («Educación» y «Efectivo»).

**Pasos para reproducir**

1. Abrir la app e iniciar sesión con un usuario de prueba (con la configuración inicial salteada) y tocar «Importar desde Excel».
2. Armar un .xlsx con los encabezados de la plantilla y una fila: fecha 01/09/2026, Tipo « gasto » (con espacios), Monto 10, Moneda «usd», Tipo de cambio 1450, Categoría «  educación  », Cuenta «  efectivo  », Cuotas 1, Nota «Coincidencia».
3. Tocar «Elegir archivo .xlsx» y elegir el archivo.
4. Mirar la tarjeta «Fila 2» de la Revisión.

**Resultado esperado.** CP-IMP-024 (paso 10): «Fila 2» está «Lista» y muestra «Gasto», «US$10,00», «Educación», «Efectivo» y «TC 1.450,00».

**Resultado obtenido.** La fila está «Lista» (la coincidencia sin distinguir mayúsculas ni espacios funciona) pero la tarjeta dice «01/09/2026 · Gasto · educación · efectivo · TC 1.450,00 US$10,00»: muestra el texto del archivo, no los nombres de Biyu.

**Evidencia.** Texto de la tarjeta import-row-2 en la corrida de CP-IMP-024

**Notas.** Causa probable: la tarjeta arma el detalle con el texto leído del archivo y no con el nombre del catálogo que resolvió la fila. No se investigó a fondo ni se corrigió nada.

## DEF-034 · Operar sobre la suscripción de otro usuario responde HTTP 500 en lugar de 404

| Campo | Contenido |
|---|---|
| Estado | Abierto · se reproduce el 2026-10-27 |
| Severidad | Baja |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | ejecución de CP-SUS-032 y de otros tres casos equivalentes (Entrega 2). |
| Caso de prueba | CP-SUS-032 (otros tres casos con el mismo defecto se recortaron del catálogo el 2026-10-27) |
| Historia | US-56 · CA-9, US-57 · CA-7, US-58 · CA-9 y US-59 (Pausar, reanudar, cancelar y editar: par de autorización) |
| Issue | A crear |
| Reportó | Claude Code (IA), supervisado por Santiago |
| Entorno | Local, 2026-10-27 · Vite (http://127.0.0.1:5173) + Supabase local · main 1c72d0f · Chromium (Playwright 1.63) · Edge Functions locales levantadas |

Cuando un usuario llama a pause_subscription, resume_subscription, cancel_subscription o update_subscription con el identificador de una suscripción de otro usuario, la API rechaza la operación (P0002 «Suscripción no encontrada») pero con HTTP 500 en lugar de 404.

**Pasos para reproducir**

1. Crear dos usuarios de prueba, A y B, con la configuración inicial salteada, y obtener el token de cada uno (PR-04).
2. Con el token de B, crear una suscripción (POST /rest/v1/rpc/create_subscription) y guardar su id.
3. Con el token de A, enviar POST /rest/v1/rpc/pause_subscription con body {"p_subscription_id":"<id de B>"}.
4. Mirar el código HTTP y el cuerpo. Repetir con resume_subscription (sobre una pausada), cancel_subscription y update_subscription.

**Resultado esperado.** Los casos esperan HTTP 404 con "code": "P0002" y "message": "Suscripción no encontrada".

**Resultado obtenido.** HTTP 500 con {"code":"P0002","details":null,"hint":null,"message":"Suscripción no encontrada"}. El código y el mensaje coinciden; cambia el HTTP. La suscripción de B no se modifica.

**Evidencia.** Respuesta de la API en las corridas de CP-SUS-032 y de otros tres casos equivalentes

**Notas.** Causa probable: PostgREST solo traduce a 4xx algunos códigos de error y P0002 no está entre ellos; hace falta un código propio (por ejemplo PT404) en la función. No se investigó a fondo ni se corrigió nada. Decisión pendiente: cambiar la función o el resultado esperado de los casos.

## DEF-035 · Sin sesión, la API responde HTTP 401 y los casos esperan 403

| Campo | Contenido |
|---|---|
| Estado | Abierto · se reproduce el 2026-10-27 |
| Severidad | Baja |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | ejecución de CP-SUS-022 y de otros cinco casos equivalentes (Entrega 2). |
| Caso de prueba | CP-SUS-022 (otros cinco casos con el mismo defecto se recortaron del catálogo el 2026-10-27) |
| Historia | US-52 · CA-13 y US-56 · CA-9, US-57 · CA-7, US-58 · CA-9, US-59 (rol anon) |
| Issue | A crear |
| Reportó | Claude Code (IA), supervisado por Santiago |
| Entorno | Local, 2026-10-27 · Vite (http://127.0.0.1:5173) + Supabase local · main 1c72d0f · Chromium (Playwright 1.63) · Edge Functions locales levantadas |

Las llamadas a las funciones y la lectura de la tabla de suscripciones con la clave anónima (sin sesión) se rechazan con "code": "42501" como pide el caso, pero con HTTP 401 y no con 403.

**Pasos para reproducir**

1. Con la clave anónima como apikey y como Bearer, enviar POST /rest/v1/rpc/create_subscription con un body válido (o GET /rest/v1/subscriptions?select=*).
2. Mirar el código HTTP y el cuerpo. Repetir con pause_subscription, resume_subscription, cancel_subscription y update_subscription.

**Resultado esperado.** HTTP 403 Forbidden con "code": "42501" («permission denied for function …» o «… for table subscriptions»).

**Resultado obtenido.** HTTP 401 con "code": "42501" y el mismo mensaje de permiso denegado. No se crea ni se lee nada.

**Evidencia.** Respuesta de la API en las corridas de los seis casos

**Notas.** Parece un error de los casos: PostgREST responde 401 al rol anónimo (el mismo comportamiento se vio en otros casos que se recortaron del catálogo el 2026-10-27). No se corrigió nada. Decisión pendiente: corregir el HTTP esperado en el caso.

## DEF-036 · La vista previa del calendario no marca con data-blocked="false" las filas que no están bloqueadas

| Campo | Contenido |
|---|---|
| Estado | Abierto · se reproduce el 2026-10-27 |
| Severidad | Baja |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | ejecución de CP-SUS-048 (Entrega 2). |
| Caso de prueba | CP-SUS-048 |
| Historia | US-61 · Vista previa del calendario al dar de alta una suscripción |
| Issue | A crear |
| Reportó | Claude Code (IA), supervisado por Santiago |
| Entorno | Local, 2026-10-27 · Vite (http://127.0.0.1:5173) + Supabase local · main 1c72d0f · Chromium (Playwright 1.63) · Edge Functions locales levantadas |

En «Se cargan al guardar», la fila de un mes sin bloqueo no tiene el atributo data-blocked; el caso espera data-blocked="false". La fila bloqueada sí lleva data-blocked="true" y el texto «Sin tipo de cambio: se carga cuando lo cargues».

**Pasos para reproducir**

1. Abrir la app e iniciar sesión con un usuario de prueba y cargar solo el tipo de cambio del mes de hace 2 meses (1200,00) en Ajustes.
2. Abrir /subscriptions/new, elegir USD, escribir monto 20 y día de cobro 28, y poner como mes de inicio el de hace 2 meses.
3. Con las herramientas de desarrollo, mirar los atributos de las filas subscription-form-preview-due-item de cada mes.

**Resultado esperado.** La fila del mes con tipo de cambio tiene data-blocked="false" y la del mes sin tipo de cambio data-blocked="true" (CP-SUS-048, paso 11).

**Resultado obtenido.** La fila del mes con tipo de cambio no tiene el atributo data-blocked; la del mes sin tipo de cambio sí lo tiene en "true" y muestra el texto esperado. El resumen dice «Al guardar se carga 1 gasto de USD 20,00.»

**Evidencia.** Observaciones de la corrida de CP-SUS-048

**Notas.** En src/components/subscriptions/SubscriptionPreview.tsx el atributo se escribe como data-blocked={row.blockedBy ? 'true' : undefined}. Parece un error del caso, o un atributo de automatización por completar. No se corrigió nada.

## DEF-037 · El primer clic en «US$» de «Nueva deuda» se pierde: el error de «Persona» corre los botones y la moneda no se selecciona

| Campo | Contenido |
|---|---|
| Estado | Abierto · se reproduce el 2026-10-27 |
| Severidad | Media |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | ejecución de CP-DEU-024 y CP-DEU-025 (Entrega 2). |
| Caso de prueba | CP-DEU-024 y CP-DEU-025 |
| Historia | US-36 · Cargar una deuda suelta (CA-6, FR-18) |
| Issue | A crear |
| Reportó | Claude Code (IA), supervisado por Santiago |
| Entorno | Local, 2026-10-27 · Vite (http://127.0.0.1:5173) + Supabase local · main 1c72d0f · Chromium (Playwright 1.63) |

En «Nueva deuda», si el primer clic sobre el formulario es en «US$», la moneda no se selecciona y no aparece el campo «Tipo de cambio (ARS por US$)». Hace falta un segundo clic.

**Pasos para reproducir**

1. Abrir la app e iniciar sesión con un usuario de prueba (con la configuración inicial salteada).
2. Abrir /debts/new (Deudas → «Nueva deuda»): el foco queda en «Persona».
3. Sin escribir nada, hacer clic en «US$».
4. Mirar el formulario: la moneda sigue sin cambiar, no aparece el campo «Tipo de cambio (ARS por US$)» y debajo de «Persona» aparece «Ingresá el nombre de la persona».
5. Hacer clic otra vez en «US$»: ahora sí se selecciona y aparece el campo «Tipo de cambio».

**Resultado esperado.** CP-DEU-024 (paso 6): al hacer clic en «US$» se selecciona la moneda y aparece el campo «Tipo de cambio (ARS por US$)».

**Resultado obtenido.** El primer clic en «US$» no hace nada visible. Al salir del foco de «Persona» aparece el error «Ingresá el nombre de la persona» y los botones bajan unos 26 px (la caja de «US$» pasa de y = 343,8 a y = 370,0 entre apretar y soltar el botón del mouse), así que el clic cae en otro elemento. El segundo clic funciona.

**Evidencia.** Medidas de la corrida de CP-DEU-024 (posición de «US$» antes y después de apretar el mouse)

**Notas.** Causa probable: la validación al perder el foco muestra el mensaje de error entre el mousedown y el mouseup y desplaza los botones, de modo que el clic no llega al botón. No se corrigió nada. Con un segundo clic el resto del caso se cumple (≈ $0,01 y se guarda amount 0.01, fx_rate 0.5000 y amount_ars 0.01). Puede explicar parte de las dudas del equipo sobre los casos de tipo de cambio en US$ (dos casos recortados del catálogo). Se reprodujo también en CP-DEU-025 (2026-10-27), con el mismo comportamiento al hacer clic en «US$» apenas se abre «Nueva deuda»; con un segundo clic el resto del caso se cumple.
