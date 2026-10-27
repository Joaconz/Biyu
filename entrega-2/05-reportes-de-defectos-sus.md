# Proyecto Biyu – Entrega 2 · Reportes de defectos (V2) · Suscripciones

Planilla: `05-reportes-de-defectos-sus.xlsx` (un índice y una hoja por defecto, con el formato "Defect Report - Template" de la cátedra). La numeración sigue la de la Entrega 2: [`05-reportes-de-defectos.md`](05-reportes-de-defectos.md) llega hasta DEF-029 y [`05-reportes-de-defectos-exp.md`](05-reportes-de-defectos-exp.md) usa DEF-030 a DEF-032. Los de Importar Excel usan DEF-033. Todavía no tienen issue en GitHub: quedan listos para cargar.

Escala de severidad y flujo de estados: `docs/07-plan-de-testing.md` §5. Severidad la fija quien reporta; **prioridad la fija el PO** (la que figura acá es la sugerida por quien reportó).

**Los casos BLOCKED no tienen defecto:** dependen de funcionalidades todavía no implementadas (ver el reporte de ejecución) y se vuelven a ejecutar en V3.

## Resumen

| ID | Título | Severidad | Prioridad sugerida | Estado | Caso | Historia |
|---|---|---|---|---|---|---|
| DEF-034 | Operar sobre la suscripción de otro usuario responde HTTP 500 en lugar de 404 | Baja | A definir por el PO | Abierto · se reproduce el 2026-10-27 | CP-SUS-094, CP-SUS-100, CP-SUS-107 y CP-SUS-129 | US-56 · CA-9, US-57 · CA-7, US-58 · CA-9 y US-59 (Pausar, reanudar, cancelar y editar: par de autorización) |
| DEF-035 | Sin sesión, la API responde HTTP 401 y los casos esperan 403 | Baja | A definir por el PO | Abierto · se reproduce el 2026-10-27 | CP-SUS-065, CP-SUS-066, CP-SUS-095, CP-SUS-101, CP-SUS-108 y CP-SUS-130 | US-52 · CA-13 y US-56 · CA-9, US-57 · CA-7, US-58 · CA-9, US-59 (rol anon) |
| DEF-036 | La vista previa del calendario no marca con data-blocked="false" las filas que no están bloqueadas | Baja | A definir por el PO | Abierto · se reproduce el 2026-10-27 | CP-SUS-157 | US-61 · Vista previa del calendario al dar de alta una suscripción |

**Abiertos por severidad:** Crítica: 0 · Alta: 0 · Media: 0 · Baja: 3 · Total abiertos: 3.

## DEF-034 · Operar sobre la suscripción de otro usuario responde HTTP 500 en lugar de 404

| Campo | Contenido |
|---|---|
| Estado | Abierto · se reproduce el 2026-10-27 |
| Severidad | Baja |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | ejecución de CP-SUS-094, 100, 107 y 129 (Entrega 2). |
| Caso de prueba | CP-SUS-094, CP-SUS-100, CP-SUS-107 y CP-SUS-129 |
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

**Evidencia.** Respuesta de la API en las corridas de CP-SUS-094, 100, 107 y 129

**Notas.** Causa probable: PostgREST solo traduce a 4xx algunos códigos de error y P0002 no está entre ellos; hace falta un código propio (por ejemplo PT404) en la función. No se investigó a fondo ni se corrigió nada. Decisión pendiente: cambiar la función o el resultado esperado de los casos.

## DEF-035 · Sin sesión, la API responde HTTP 401 y los casos esperan 403

| Campo | Contenido |
|---|---|
| Estado | Abierto · se reproduce el 2026-10-27 |
| Severidad | Baja |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | ejecución de CP-SUS-065, 066, 095, 101, 108 y 130 (Entrega 2). |
| Caso de prueba | CP-SUS-065, CP-SUS-066, CP-SUS-095, CP-SUS-101, CP-SUS-108 y CP-SUS-130 |
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

**Notas.** Parece un error de los casos: PostgREST responde 401 al rol anónimo (el mismo comportamiento se vio en CP-DEU-029 y CP-DEU-108). No se corrigió nada. Decisión pendiente: corregir el HTTP esperado en los seis casos.

## DEF-036 · La vista previa del calendario no marca con data-blocked="false" las filas que no están bloqueadas

| Campo | Contenido |
|---|---|
| Estado | Abierto · se reproduce el 2026-10-27 |
| Severidad | Baja |
| Prioridad (sugerida) | A definir por el PO |
| Encontrado en | ejecución de CP-SUS-157 (Entrega 2). |
| Caso de prueba | CP-SUS-157 |
| Historia | US-61 · Vista previa del calendario al dar de alta una suscripción |
| Issue | A crear |
| Reportó | Claude Code (IA), supervisado por Santiago |
| Entorno | Local, 2026-10-27 · Vite (http://127.0.0.1:5173) + Supabase local · main 1c72d0f · Chromium (Playwright 1.63) · Edge Functions locales levantadas |

En «Se cargan al guardar», la fila de un mes sin bloqueo no tiene el atributo data-blocked; el caso espera data-blocked="false". La fila bloqueada sí lleva data-blocked="true" y el texto «Sin tipo de cambio: se carga cuando lo cargues».

**Pasos para reproducir**

1. Abrir la app e iniciar sesión con un usuario de prueba y cargar solo el tipo de cambio del mes de hace 2 meses (1200,00) en Ajustes.
2. Abrir /subscriptions/new, elegir USD, escribir monto 20 y día de cobro 28, y poner como mes de inicio el de hace 2 meses.
3. Con las herramientas de desarrollo, mirar los atributos de las filas subscription-form-preview-due-item de cada mes.

**Resultado esperado.** La fila del mes con tipo de cambio tiene data-blocked="false" y la del mes sin tipo de cambio data-blocked="true" (CP-SUS-157, paso 11).

**Resultado obtenido.** La fila del mes con tipo de cambio no tiene el atributo data-blocked; la del mes sin tipo de cambio sí lo tiene en "true" y muestra el texto esperado. El resumen dice «Al guardar se carga 1 gasto de USD 20,00.»

**Evidencia.** Observaciones de la corrida de CP-SUS-157

**Notas.** En src/components/subscriptions/SubscriptionPreview.tsx el atributo se escribe como data-blocked={row.blockedBy ? 'true' : undefined}. Parece un error del caso, o un atributo de automatización por completar. No se corrigió nada.
