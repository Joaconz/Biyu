# Entrega 2 · Ejecución de casos de prueba · Navegación e interfaz (NAV)

Registro de la ejecución de **CP-NAV-001 a CP-NAV-085** (US-69 y US-70). Los casos están escritos en
[`entrega-2/casos/nav.md`](../casos/nav.md); acá solo va el resultado. Mismo esquema de IDs que la
Entrega 1: historia `US-nn` → criterio `CA-k` → caso `CP-NAV-nnn` → resultado → defecto `DEF-nnn`.

## Condiciones de la ejecución

- **Ejecución manual (equipo):** 40 de los 85 casos, siguiendo los pasos de cada caso y los procedimientos `PR-nn` de
  [`docs/12-procedimientos-de-prueba.md`](../../docs/12-procedimientos-de-prueba.md). Fecha, versión probada y
  entorno: a completar por quien ejecutó.
- **Ejecutados por Claude Code (9 casos):** CP-NAV-013, 014, 015, 016, 017, 038, 039, 053 y 054, que el equipo no
  pudo probar (ver su sección más abajo). Fecha: 2026-10-25.
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
| CP-NAV-018 | Media | US-69 · CA-6 | UI | **Pendiente** (sin ejecutar) | — | — |
| CP-NAV-019 | Media | US-69 · CA-6 | UI | **Pendiente** (sin ejecutar) | — | — |
| CP-NAV-020 | Media | US-69 · CA-6 | UI | **Pendiente** (sin ejecutar) | — | — |
| CP-NAV-021 | Media | US-69 · CA-6 | UI | **Pendiente** (sin ejecutar) | — | — |
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
| CP-NAV-040 | Alta | US-70 · CA-9 | API | **Pendiente** (sin ejecutar) | — | — |
| CP-NAV-041 | Alta | US-70 · CA-10 | API | **Pendiente** (sin ejecutar) | — | — |
| CP-NAV-042 | Alta | US-70 · CA-11 | API | **Pendiente** (sin ejecutar) | — | — |
| CP-NAV-043 | Alta | US-70 · CA-12 | API | **Pendiente** (sin ejecutar) | — | — |
| CP-NAV-044 | Alta | US-70 · CA-13 | API | **Pendiente** (sin ejecutar) | — | — |
| CP-NAV-045 | Alta | US-70 · CA-14 | API | **Pendiente** (sin ejecutar) | — | — |
| CP-NAV-046 | Alta | US-70 · CA-15 | API | **Pendiente** (sin ejecutar) | — | — |
| CP-NAV-047 | Alta | US-70 · CA-16 | UI | **PASSED** | Manual | — |
| CP-NAV-048 | Alta | US-70 · CA-16 | API | **Pendiente** (sin ejecutar) | — | — |
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
| CP-NAV-063 | Media | US-69 · CA-6 | UI | **Pendiente** (sin ejecutar) | — | — |
| CP-NAV-064 | Media | US-69 · CA-6 | UI | **Pendiente** (sin ejecutar) | — | — |
| CP-NAV-065 | Media | US-69 · CA-6 | UI | **Pendiente** (sin ejecutar) | — | — |
| CP-NAV-066 | Media | US-69 · CA-6 | UI | **Pendiente** (sin ejecutar) | — | — |
| CP-NAV-067 | Media | US-69 · CA-6 | UI | **Pendiente** (sin ejecutar) | — | — |
| CP-NAV-068 | Media | US-69 · CA-6 | UI | **Pendiente** (sin ejecutar) | — | — |
| CP-NAV-069 | Media | US-69 · CA-6 | UI | **Pendiente** (sin ejecutar) | — | — |
| CP-NAV-070 | Media | US-69 · CA-6 | UI | **Pendiente** (sin ejecutar) | — | — |
| CP-NAV-071 | Media | US-69 · CA-6 | UI | **Pendiente** (sin ejecutar) | — | — |
| CP-NAV-072 | Media | US-69 · CA-6 | UI | **Pendiente** (sin ejecutar) | — | — |
| CP-NAV-073 | Media | US-69 · CA-6 | UI | **Pendiente** (sin ejecutar) | — | — |
| CP-NAV-074 | Media | US-69 · CA-6 | UI | **Pendiente** (sin ejecutar) | — | — |
| CP-NAV-075 | Media | US-69 · CA-6 | UI | **Pendiente** (sin ejecutar) | — | — |
| CP-NAV-076 | Media | US-69 · CA-6 | UI | **Pendiente** (sin ejecutar) | — | — |
| CP-NAV-077 | Media | US-69 · CA-6 | UI | **Pendiente** (sin ejecutar) | — | — |
| CP-NAV-078 | Media | US-69 · CA-6 | UI | **Pendiente** (sin ejecutar) | — | — |
| CP-NAV-079 | Media | US-69 · CA-6 | UI | **Pendiente** (sin ejecutar) | — | — |
| CP-NAV-080 | Media | US-69 · CA-6 | UI | **Pendiente** (sin ejecutar) | — | — |
| CP-NAV-081 | Media | US-69 · CA-6 | UI | **Pendiente** (sin ejecutar) | — | — |
| CP-NAV-082 | Media | US-69 · CA-6 | UI | **Pendiente** (sin ejecutar) | — | — |
| CP-NAV-083 | Alta | US-70 · CA-20 | API | **Pendiente** (sin ejecutar) | — | — |
| CP-NAV-084 | Alta | US-70 · CA-21 | API | **Pendiente** (sin ejecutar) | — | — |
| CP-NAV-085 | Alta | US-70 · CA-5 | API | **Pendiente** (sin ejecutar) | — | — |

## Resumen

| Status | Casos |
|---|---:|
| PASSED | 49 |
| FAILED | 0 |
| BLOCKED | 0 |
| Pendiente (sin ejecutar) | 36 |
| **Total** | **85** |

## Ejecutados por Claude Code

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

**Cómo se adaptaron los pasos de DevTools:**

- El corte de red (`Offline`) y el perfil de 20 s se aplicaron con el protocolo de Chrome (`Network.emulateNetworkConditions`), el mismo mecanismo de DevTools → Network.
- `crypto.randomUUID` se fijó con `Object.defineProperty`, igual que en los pasos del caso.
- La preparación por API (PR-04) usó el token del usuario de prueba contra el Supabase local.
- En 013 a 017 el panel de emulación del navegador integrado deja una barra de desplazamiento clásica que ensancha la página unos 12 px; se ocultó la barra para imitar el comportamiento de celular de DevTools, y las medidas son las de ese estado.

## Pendientes

- **Casos con herramienta técnica (35):** CP-NAV-018 a 021, 040 a 046, 048, 063 a 082 y 083 a 085: sin
  ejecutar. Son verificaciones por consola de Chrome (identificadores `data-testid` únicos en cada pantalla y ancho) y por
  API (idempotencia de `request_id`, rechazo por categoría archivada y consultas de apoyo).
- **CP-NAV-060** (TalkBack anuncia el aviso de error sin mover el foco): sin ejecutar. Requiere un teléfono Pixel 7 con
  Android 15, Chrome y TalkBack en español, que no estuvo disponible.
- El resto de los casos queda sin defectos reportados.
