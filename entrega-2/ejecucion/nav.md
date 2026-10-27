# Entrega 2 · Ejecución de casos de prueba · Navegación e interfaz (NAV)

> **Nota del 2026-10-27.** Este es un registro histórico de la ejecución original, con los IDs anteriores. El catálogo de V2 se recortó después (de 672 a 206 casos) y se renumeró: varios casos que figuran acá ya no están en `casos/` y los demás tienen otro ID (ver [`equivalencia-ids.md`](../equivalencia-ids.md)). El registro vigente es [`04-ejecucion.md`](../04-ejecucion.md).

Registro de la ejecución de **CP-NAV-001 a CP-NAV-085** (US-69 y US-70). Los casos están escritos en
[`entrega-2/casos/nav.md`](../casos/nav.md); acá solo va el resultado. Mismo esquema de IDs que la
Entrega 1: historia `US-nn` → criterio `CA-k` → caso `CP-NAV-nnn` → resultado → defecto `DEF-nnn`.

## Condiciones de la ejecución

- **Ejecución manual (equipo):** 40 de los 85 casos, siguiendo los pasos de cada caso y los procedimientos `PR-nn` de
  [`docs/12-procedimientos-de-prueba.md`](../../docs/12-procedimientos-de-prueba.md). Fecha, versión probada y
  entorno: a completar por quien ejecutó.
- **Ejecutados por Claude Code (44 casos):** CP-NAV-013, 014, 015, 016, 017, 038, 039, 053 y 054, que el equipo no
  pudo probar, y los 35 de herramienta técnica (consola de Chrome y API): CP-NAV-018 a 021, 040 a 046, 048, 063 a 082 y
  083 a 085 (ver su sección más abajo). Fecha: 2026-10-25.
- **Datos:** usuarios y montos ficticios (C14); cada caso con su propio usuario de prueba.

## Resultado por caso

| ID | Prioridad | Historia · criterio | Canal | Status | Ejecutó | Defectos |
|---|---|---|---|---|---|---|
| CP-NAV-001 | Media | US-69 · CA-1 | UI | **PASSED** | Manual | — |
| CP-NAV-002 | Media | US-69 · CA-2 | UI | **PASSED** | Manual | — |
| CP-NAV-003 | Media | US-69 · CA-2 | UI | **PASSED** | Manual | — |
| CP-NAV-004 | Media | US-69 · CA-2 | UI | **PASSED** | Manual | — |
| CP-NAV-005 | Media | US-69 · CA-2 | UI | **PASSED** | Manual | — |
| CP-NAV-006 | Media | US-69 · CA-3 | UI | **PASSED** | Manual | — |
| CP-NAV-007 | Media | US-69 · CA-3 | UI | **PASSED** | Manual | — |
| CP-NAV-008 | Media | US-69 · CA-3 | UI | **PASSED** | Manual | — |
| CP-NAV-009 | Media | US-69 · CA-3 | UI | **PASSED** | Manual | — |
| CP-NAV-010 | Media | US-69 · CA-3 | UI | **PASSED** | Manual | — |
| CP-NAV-011 | Media | US-69 · CA-3 | UI | **PASSED** | Manual | — |
| CP-NAV-012 | Media | US-69 · CA-3 | UI | **PASSED** | Manual | — |
| CP-NAV-013 | Media | US-69 · CA-4 | UI | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-014 | Media | US-69 · CA-4 | UI | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-015 | Media | US-69 · CA-5 | UI | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-016 | Media | US-69 · CA-5 | UI | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-017 | Media | US-69 · CA-5 | UI | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-018 | Media | US-69 · CA-6 | UI | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-019 | Media | US-69 · CA-6 | UI | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-020 | Media | US-69 · CA-6 | UI | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-021 | Media | US-69 · CA-6 | UI | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-022 | Media | US-69 · CA-7 | UI | **PASSED** | Manual | — |
| CP-NAV-023 | Media | US-69 · CA-8 | UI | **PASSED** | Manual | — |
| CP-NAV-024 | Media | US-69 · CA-9 | UI | **PASSED** | Manual | — |
| CP-NAV-025 | Media | US-69 · CA-9 | UI | **PASSED** | Manual | — |
| CP-NAV-026 | Media | US-69 · CA-10 | UI | **PASSED** | Manual | — |
| CP-NAV-027 | Alta | US-69 · CA-11 | UI | **PASSED** | Manual | — |
| CP-NAV-028 | Media | US-69 · CA-12 | UI | **PASSED** | Manual | — |
| CP-NAV-029 | Media | US-69 · CA-13 · US-65 | UI | **PASSED** | Manual | — |
| CP-NAV-030 | Media | US-70 · CA-1 · US-10 | UI | **PASSED** | Manual | — |
| CP-NAV-031 | Media | US-70 · CA-2 · US-10 | UI | **PASSED** | Manual | — |
| CP-NAV-032 | Alta | US-70 · CA-3 | UI | **PASSED** | Manual | — |
| CP-NAV-033 | Alta | US-70 · CA-4 | UI | **PASSED** | Manual | — |
| CP-NAV-034 | Alta | US-70 · CA-5 | UI | **PASSED** | Manual | — |
| CP-NAV-035 | Alta | US-70 · CA-6 | UI | **PASSED** | Manual | — |
| CP-NAV-036 | Alta | US-70 · CA-6b | UI | **PASSED** | Manual | — |
| CP-NAV-037 | Alta | US-70 · CA-6c | UI | **PASSED** | Manual | — |
| CP-NAV-038 | Alta | US-70 · CA-7 | UI | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-039 | Alta | US-70 · CA-8 | UI | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-040 | Alta | US-70 · CA-9 | API | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-041 | Alta | US-70 · CA-10 | API | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-042 | Alta | US-70 · CA-11 | API | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-043 | Alta | US-70 · CA-12 | API | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-044 | Alta | US-70 · CA-13 | API | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-045 | Alta | US-70 · CA-14 | API | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-046 | Alta | US-70 · CA-15 | API | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-047 | Alta | US-70 · CA-16 | UI | **PASSED** | Manual | — |
| CP-NAV-048 | Alta | US-70 · CA-16 | API | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-049 | Alta | US-70 · CA-17 | UI | **PASSED** | Manual | — |
| CP-NAV-050 | Alta | US-70 · CA-17 | UI | **PASSED** | Manual | — |
| CP-NAV-051 | Alta | US-70 · CA-18 | UI | **PASSED** | Manual | — |
| CP-NAV-052 | Alta | US-70 · CA-19 | UI | **PASSED** | Manual | — |
| CP-NAV-053 | Alta | US-70 · CA-20 | UI | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-054 | Alta | US-70 · CA-21 | UI | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-055 | Alta | US-70 · CA-22 | UI | **PASSED** | Manual | — |
| CP-NAV-056 | Alta | US-70 · CA-23 | UI | **PASSED** | Manual | — |
| CP-NAV-057 | Alta | US-70 · CA-24 | UI | **PASSED** | Manual | — |
| CP-NAV-058 | Alta | US-70 · CA-25 · US-11 | UI | **PASSED** | Manual | — |
| CP-NAV-059 | Alta | US-70 · CA-26 | UI | **PASSED** | Manual | — |
| CP-NAV-060 | Media | US-70 · CA-27 | UI | **Pendiente** (sin ejecutar) | — | — |
| CP-NAV-061 | Alta | US-70 · CA-28 | UI | **PASSED** | Manual | — |
| CP-NAV-062 | Alta | US-70 · CA-29 · US-68 | UI | **PASSED** | Manual | — |
| CP-NAV-063 | Media | US-69 · CA-6 | UI | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-064 | Media | US-69 · CA-6 | UI | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-065 | Media | US-69 · CA-6 | UI | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-066 | Media | US-69 · CA-6 | UI | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-067 | Media | US-69 · CA-6 | UI | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-068 | Media | US-69 · CA-6 | UI | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-069 | Media | US-69 · CA-6 | UI | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-070 | Media | US-69 · CA-6 | UI | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-071 | Media | US-69 · CA-6 | UI | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-072 | Media | US-69 · CA-6 | UI | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-073 | Media | US-69 · CA-6 | UI | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-074 | Media | US-69 · CA-6 | UI | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-075 | Media | US-69 · CA-6 | UI | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-076 | Media | US-69 · CA-6 | UI | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-077 | Media | US-69 · CA-6 | UI | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-078 | Media | US-69 · CA-6 | UI | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-079 | Media | US-69 · CA-6 | UI | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-080 | Media | US-69 · CA-6 | UI | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-081 | Media | US-69 · CA-6 | UI | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-082 | Media | US-69 · CA-6 | UI | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-083 | Alta | US-70 · CA-20 | API | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |
| CP-NAV-084 | Alta | US-70 · CA-21 | API | **FAILED** | Claude Code | — (ver nota) |
| CP-NAV-085 | Alta | US-70 · CA-5 | API | **PASSED** | Claude Code (ver «Ejecutados por Claude Code») | — |

## Resumen

| Status | Casos |
|---|---:|
| PASSED | 83 |
| FAILED | 1 |
| BLOCKED | 0 |
| Pendiente (sin ejecutar) | 1 |
| **Total** | **85** |

## Ejecutados por Claude Code

### Casos de pantalla (9)

**Entorno:** app local (Vite, `main` en `f096e22`) contra Supabase local con todas las migraciones aplicadas
(hasta `20261012000000`). Chromium de Playwright 1.63 (CP-NAV-038, 039, 053 y 054, emulación de celular 375 × 812) y
el navegador integrado de Claude Code (CP-NAV-013 a 017, anchos emulados 320, 1023, 1024 y 1280 px). Usuarios
`qa+cp-nav-<nnn>-001@example.com`, contraseña `Clave123!`, con PR-01, PR-02 y NAV-PREP-01.

| Caso | Obtenido |
|---|---|
| CP-NAV-013 | A 320 px las cuatro etiquetas de la barra se leen completas (`Registrar`, `Resumen`, `Deudas`, `Suscripciones`), sin recorte ni superposición; cada ítem mide 80 px de ancho y la última etiqueta termina a 318,1 px de 320. |
| CP-NAV-014 | `[...document.querySelectorAll('nav[aria-label="Principal"] a')].map(...)` devuelve `[[true,true],[true,true],[true,true],[true,true]]` (cada destino mide 80 × 56 px). |
| CP-NAV-015 | A 1023 px la navegación está fija abajo (ancho completo, 57 px de alto), no hay barra lateral y se ve el engranaje de Ajustes arriba. |
| CP-NAV-016 | A 1024 px hay una única barra lateral fija de 240 px con los cuatro ítems y `Ajustes` al pie; no hay barra inferior ni engranaje. |
| CP-NAV-017 | A 1280 px se mantiene la barra lateral de 240 px con los cuatro ítems y `Ajustes` al pie; no hay barra inferior. |
| CP-NAV-038 | Con latencia de 20.000 ms y 1000 kb/s, el botón dice `Guardando…`, queda deshabilitado y el formulario tiene `aria-busy`; el error aparece a los **15,3 s**, con el texto de conexión, `data-kind="network"` y el botón `Reintentar`. |
| CP-NAV-039 | Con el gasto ya creado por API con la clave `39000000-…-0039`, el fallo offline y `Reintentar` muestran `Gasto guardado` con `$12.500,00 · Comida · Visa BBVA`; en la API queda **una** transacción, activa. |
| CP-NAV-053 | `Recuperar` muestra `Ese movimiento ya estaba guardado` con `$12.500,00 · Comida · Visa BBVA`; la fila pendiente desaparece, el formulario queda en el paso 1 vacío y la API sigue con una sola transacción activa. |
| CP-NAV-054 | Con el gasto ya guardado y eliminado desde Movimientos, `Recuperar` muestra `Ese movimiento ya estaba guardado y después se eliminó` y `Está en Movimientos, en Eliminados.`; la fila desaparece y no se crea otra transacción (la API tiene una sola, eliminada). |

### Casos de herramienta técnica (35)

**Identificadores `data-testid` únicos (CP-NAV-018 a 021 y 063 a 082).** Para cada caso se creó un usuario con PR-01, se abrió
la ruta indicada en el ancho del caso y se ejecutó en la consola la expresión del paso final. Anchos: 375 × 812 (celular), 1023 × 812,
1024 × 900 y 1280 × 900. Resultado en los 24 casos: `[1,1,1,1,1]`, los cinco identificadores de la barra aparecen una vez y ninguno
está duplicado (incluidos los de la barra lateral y los de la barra inferior, que conviven en el DOM).

| Anchos | Pantallas | Casos | Obtenido |
|---|---|---|---|
| 375 / 1023 / 1024 / 1280 | Registrar | CP-NAV-018, 019, 020, 021 | `[1,1,1,1,1]` en los cuatro. |
| 375 | Resumen, Movimientos, Deudas, Suscripciones, Ajustes | CP-NAV-063 a 067 | `[1,1,1,1,1]` en los cinco. |
| 1023 | Resumen, Movimientos, Deudas, Suscripciones, Ajustes | CP-NAV-068 a 072 | `[1,1,1,1,1]` en los cinco. |
| 1024 | Resumen, Movimientos, Deudas, Suscripciones, Ajustes | CP-NAV-073 a 077 | `[1,1,1,1,1]` en los cinco. |
| 1280 | Resumen, Movimientos, Deudas, Suscripciones, Ajustes | CP-NAV-078 a 082 | `[1,1,1,1,1]` en los cinco. |

Observación: al abrir `/settings` la app agrega `?period=2026-10` a la dirección (queda `/settings?period=2026-10`); los casos 067, 072, 077
y 082 describen la ruta como `/settings`. No afecta al resultado (la pantalla es Ajustes y los identificadores son únicos).

**Idempotencia de `request_id` y consultas por API (CP-NAV-040 a 046, 048 y 083 a 085).** Cada caso con su propio usuario, PR-02 y
NAV-PREP-01, y llamadas directas con el token del usuario (PR-04) contra el Supabase local.

| Caso | Resultado | Obtenido |
|---|---|---|
| CP-NAV-040 | PASSED | Dos POST con la misma clave devuelven el mismo id; hay una transacción y una imputación. |
| CP-NAV-041 | PASSED | Dos POST simultáneos (liberados a la vez) devuelven `200` con el mismo id, sin `23505`; hay una transacción y una imputación. La barrera se armó con `Promise.all` en Node, equivalente al bloque `NAV-CONC-01` de PowerShell. |
| CP-NAV-042 | PASSED | Dos claves distintas con el mismo contenido crean dos transacciones y dos imputaciones. |
| CP-NAV-043 | PASSED | La misma clave de dos usuarios crea una transacción para cada uno, con su propio `user_id`. |
| CP-NAV-044 | PASSED | La misma clave con otro monto (12600) devuelve el id original; la fila conserva `12500.00` y no hay ninguna de `12600.00`. |
| CP-NAV-045 | PASSED | Archivar la categoría (`204`) y repetir la clave devuelve el mismo id sin error; una sola fila. |
| CP-NAV-046 | PASSED | Sin `request_id`, dos llamadas crean dos transacciones y dos imputaciones, con `request_id` nulo. |
| CP-NAV-048 | PASSED | Con la categoría archivada, el POST responde `409` con `code:"23503"` y `message:"la categoría no existe, no es tuya o está archivada"`; transacciones e imputaciones quedan en `[]`. |
| CP-NAV-083 | PASSED | Una transacción activa (`deleted_at` nulo) y una imputación con `installment_number` 1 y `12500.00`. |
| CP-NAV-084 | **FAILED** | Ver la nota debajo. |
| CP-NAV-085 | PASSED | Tras fijar la clave `85000000-…-0085`, fallar offline y reintentar por pantalla, la clave está en `requestIds` del pendiente, y la API tiene una transacción activa con esa clave y una imputación. |

**CP-NAV-084 · nota del FAILED.** El paso 2 espera que `POST /rest/v1/rpc/delete_transaction` responda *HTTP 200 y cuerpo JSON `null`*. Respondió
**HTTP 204 sin cuerpo**. El resto del caso se cumple: la transacción queda con `deleted_at` no nulo, con una sola fila, y la
imputación histórica se conserva (`installment_number` 1, `12500.00`). La diferencia se explica porque `delete_transaction`
está definida como `returns void` (`supabase/migrations/20260927180000_delete_transaction_rpc.sql`) y PostgREST responde
`204 No Content` a las funciones que no devuelven nada. Parece un error del resultado esperado del caso y no de la aplicación; hay que decidir si se
corrige el caso (esperar `204`) o si la función debería devolver un valor. No se abrió un reporte de defecto.

**Cómo se adaptaron los pasos de DevTools:**

- El corte de red (`Offline`) y el perfil de 20 s se aplicaron con el protocolo de Chrome (`Network.emulateNetworkConditions`), el mismo mecanismo de DevTools → Network.
- `crypto.randomUUID` se fijó con `Object.defineProperty`, igual que en los pasos del caso.
- La preparación por API (PR-04) usó el token del usuario de prueba contra el Supabase local.
- En 013 a 017 el panel de emulación del navegador integrado deja una barra de desplazamiento clásica que ensancha la página unos 12 px; se ocultó la barra para imitar el comportamiento de celular de DevTools, y las medidas son las de ese estado.

## Pendientes

- **CP-NAV-060** (TalkBack anuncia el aviso de error sin mover el foco): sin ejecutar. Requiere un teléfono Pixel 7 con
  Android 15, Chrome y TalkBack en español, que no estuvo disponible.
- **CP-NAV-084:** FAILED por la diferencia de código de respuesta descrita arriba; falta decidir si se corrige el caso o la función.
