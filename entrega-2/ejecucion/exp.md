# Entrega 2 · Ejecución de casos de prueba · Exportar CSV (EXP)

Registro de la ejecución de **CP-EXP-001 a CP-EXP-075** (US-47, FR-22, ADR-029). Los casos están escritos en [`entrega-2/casos/exp.md`](../casos/exp.md); acá va el resultado. Mismo esquema de IDs que la Entrega 1: historia `US-nn` → criterio `CA-k` → caso `CP-EXP-nnn` → resultado → defecto `DEF-nnn`. Resumen y métricas en [`exp-reporte.md`](exp-reporte.md); defectos en [`05-reportes-de-defectos.md`](../05-reportes-de-defectos.md).

## Condiciones de la ejecución

- **Fecha:** 2026-10-27.
- **Quién ejecutó:** **los 75 casos los ejecutó Claude Code (IA), supervisado por Santiago.** Ningún caso de EXP lo ejecutó una persona a mano ni tenía estado previo del equipo.
- **Versión probada:** código del repositorio en el directorio de trabajo (rama `main` local, con todas las migraciones hasta 20261012000000). No se probó el deploy de Vercel.
- **Entorno:** Vite local (`http://127.0.0.1:5173`) + Supabase local (Docker) · Chromium (Playwright 1.63) con idioma es-AR, zona horaria America/Argentina/Buenos_Aires y el reloj del navegador fijado en 09/10/2026 12:00 (como piden los casos). Solo Chromium.
- **Cómo se ejecutó:** un script de Playwright por caso: usuario nuevo por caso (registro por API y entrada por la pantalla de ingreso, saltando la configuración inicial), preparación de movimientos por la API (`create_transaction`, `delete_transaction`, `restore_transaction`, `upsert_fx_rate`, `delete_account`, catálogo por `categories` y `accounts`), descarga real del CSV y lectura de sus bytes.
- **Datos:** usuarios `qa+cp-exp-<nnn>-001@example.com` (con un sufijo de corrida) y contraseña `Clave123!`; montos ficticios (C14).

## Resultado por caso

| ID | Prioridad | Título | Historia · criterio | Canal | Status | Ejecutó | Defectos |
|---|---|---|---|---|---|---|---|
| CP-EXP-001 | Media | Una URL válida fija septiembre 2026 | US-47 · CA-1 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-002 | Media | Sin period se usa octubre 2026 | US-47 · CA-1 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-003 | Media | Cancelar desde Vacío cierra sin descargar | US-47 · CA-20 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-004 | Media | El mes actual permite exportar sin aviso | US-47 · CA-2 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-005 | Media | El mes anterior permite exportar sin aviso | US-47 · CA-2 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-006 | Alta | El mes siguiente está bloqueado | US-47 · CA-2 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-007 | Alta | El alcance mensual propone el nombre 2026-09 | US-47 · CA-3 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-008 | Alta | El alcance anual propone el nombre 2025 | US-47 · CA-4 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-009 | Alta | El primer día del mes se incluye | US-47 · CA-5 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-010 | Alta | El último día del mes se incluye | US-47 · CA-5 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-011 | Alta | El día anterior al mes se excluye | US-47 · CA-5 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-012 | Alta | El día posterior al mes se excluye | US-47 · CA-5 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-013 | Alta | El 1 de enero se incluye en el año | US-47 · CA-5 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-014 | Alta | El 31 de diciembre se incluye en el año | US-47 · CA-5 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-015 | Alta | El día anterior al año se excluye | US-47 · CA-5 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-016 | Alta | El día posterior al año se excluye | US-47 · CA-5 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-017 | Alta | Una transacción eliminada queda fuera | US-47 · CA-6 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-018 | Alta | Una transacción restaurada vuelve a exportarse | US-47 · CA-6 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-019 | Alta | El filtro Eliminados no cambia los bytes | US-47 · CA-7 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-020 | Alta | El archivo comienza con BOM UTF-8 | US-47 · CA-8 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-021 | Alta | El encabezado tiene doce columnas exactas | US-47 · CA-8 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-022 | Alta | Cada fila termina en CRLF incluida la última | US-47 · CA-8 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-023 | Alta | Doce cuotas salen en una sola fila por el total | US-47 · CA-9 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-024 | Alta | Un mes con solo cuota heredada produce Vacío | US-47 · CA-9, CA-21 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-025 | Alta | ARS se escribe con dos decimales exactos | US-47 · CA-10 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-026 | Alta | USD conserva cuatro decimales de TC | US-47 · CA-10 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-027 | Alta | Cambiar la referencia no recalcula el histórico | US-47 · CA-11 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-028 | Alta | Una coma obliga a entrecomillar la descripción | US-47 · CA-12 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-029 | Alta | Las comillas internas se duplican | US-47 · CA-12 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-030 | Alta | Un LF queda dentro de un campo citado | US-47 · CA-12 | UI | **DUDA** | Claude Code (IA) | — |
| CP-EXP-031 | Alta | Descripción con igual se neutraliza | US-47 · CA-13 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-032 | Alta | Descripción con más se neutraliza | US-47 · CA-13 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-033 | Alta | Descripción con menos se neutraliza | US-47 · CA-13 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-034 | Alta | Descripción con arroba se neutraliza | US-47 · CA-13 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-035 | Alta | Descripción con tabulación se neutraliza | US-47 · CA-13 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-036 | Alta | Descripción con retorno de carro se neutraliza | US-47 · CA-13 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-037 | Alta | Una categoría que empieza con igual se neutraliza | US-47 · CA-13 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-038 | Alta | Una cuenta que empieza con arroba se neutraliza | US-47 · CA-13 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-039 | Media | Las filas se ordenan por fecha y creación | US-47 · CA-14 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-040 | Alta | 1.000 transacciones se exportan sin faltantes | US-47 · CA-15 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-041 | Alta | 1.500 transacciones se exportan sin faltantes | US-47 · CA-15 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-042 | Alta | 2.000 transacciones se exportan sin faltantes | US-47 · CA-15 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-043 | Alta | El CSV de A no contiene movimientos de B | US-47 · CA-16 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-044 | Alta | La API con token de A devuelve cero filas de B | US-47 · CA-16 | API | **PASSED** | Claude Code (IA) | — |
| CP-EXP-045 | Media | Categoría archivada sale con el nombre actual | US-47 · CA-17 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-046 | Media | Cuenta archivada sale con el nombre actual | US-47 · CA-17 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-047 | Media | Un ingreso exporta categoría vacía | US-47 · CA-17 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-048 | Alta | Eliminar una cuenta quita su transacción | US-47 · CA-20 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-049 | Alta | Descargar muestra Exportando y aria-busy | US-47 · CA-18 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-050 | Alta | Los controles quedan bloqueados al exportar | US-47 · CA-18 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-051 | Alta | Un doble click inicia una sola descarga | US-47 · CA-18 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-052 | Media | Una fila usa singular y cierra la hoja | US-47 · CA-19 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-053 | Media | Dos filas usan plural | US-47 · CA-19 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-054 | Media | Un mes sin transacciones muestra Vacío | US-47 · CA-20 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-055 | Media | Un año sin transacciones muestra Vacío anual | US-47 · CA-20 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-056 | Alta | Un período con solo eliminadas muestra Vacío | US-47 · CA-20 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-057 | Alta | Offline muestra el error exacto | US-47 · CA-22 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-058 | Alta | El reintento después de Offline descarga completo | US-47 · CA-22 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-059 | Media | Cancelar desde Error cierra sin descargar | US-47 · CA-22 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-060 | Baja | Cancelar cierra sin descargar | US-47 · CA-23 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-061 | Baja | Escape cierra sin descargar | US-47 · CA-23 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-062 | Baja | Tocar fuera cierra sin descargar | US-47 · CA-23 | UI | **FAILED** | Claude Code (IA) | DEF-030 |
| CP-EXP-063 | Media | Atrás cierra la hoja inicial | US-47 · requisito narrativo: todo cambio de URL | UI | **FAILED** | Claude Code (IA) | DEF-031 |
| CP-EXP-064 | Alta | Atrás durante Exportando cancela la descarga | US-47 · requisito narrativo: todo cambio de URL | UI | **FAILED** | Claude Code (IA) | DEF-032 |
| CP-EXP-065 | Media | Adelante cierra la hoja inicial | US-47 · requisito narrativo: todo cambio de URL | UI | **FAILED** | Claude Code (IA) | DEF-031 |
| CP-EXP-066 | Media | Salir a Resumen cierra la hoja | US-47 · requisito narrativo: todo cambio de URL | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-067 | Alta | Exportar no modifica datos ni período | US-47 · CA-25 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-068 | Alta | Una alta concurrente impide descargar un año incompleto | US-47 · Completitud | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-069 | Alta | Escape no cierra la hoja durante Exportando | US-47 · CA-18 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-070 | Alta | Tocar fuera no cierra la hoja durante Exportando | US-47 · CA-18 | UI | **PASSED** | Claude Code (IA) | DEF-030 |
| CP-EXP-071 | Alta | Un lector RFC 4180 obtiene doce columnas | US-47 · CA-12 | UI | **DUDA** | Claude Code (IA) | — |
| CP-EXP-072 | Alta | Exportar no modifica el total de Resumen | US-47 · CA-25 | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-073 | Alta | HTTP 500 muestra Error y no descarga | US-47 · Estado Error | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-074 | Alta | Un monto textual inválido cancela la descarga | US-47 · Estado Error | UI | **PASSED** | Claude Code (IA) | — |
| CP-EXP-075 | Media | Cambiar el alcance borra el mensaje de Error | US-47 · Estado Error | UI | **PASSED** | Claude Code (IA) | — |

## Resumen

| Status | Casos |
|---|---:|
| PASSED | 69 |
| FAILED | 4 |
| DUDA (pasa, con dudas) | 2 |
| BLOCKED | 0 |
| Pendiente (sin ejecutar) | 0 |
| **Total** | **75** |

## Resultado obtenido de cada caso

| Caso | Status | Obtenido |
|---|---|---|
| CP-EXP-001 | PASSED | La hoja abre con «Solo septiembre 2026» elegido, «Todo 2026» visible, «Descargar CSV» y «Cancelar» habilitados y el texto fijo sobre activos y cuotas anteriores. |
| CP-EXP-002 | PASSED | Sin `period` en la URL (reloj en 09/10/2026) la hoja abre con «Solo octubre 2026» elegido y «Todo 2026» visible. |
| CP-EXP-003 | PASSED | Sin transacciones: no se descarga nada, aparece «No tenés movimientos con fecha en septiembre 2026.», «Cancelar» cierra la hoja y la URL conserva `?period=2026-09`. |
| CP-EXP-004 | PASSED | «Exportar» habilitado y sin aviso de período futuro; la hoja abre. |
| CP-EXP-005 | PASSED | «Exportar» habilitado y sin aviso de período futuro; la hoja abre. |
| CP-EXP-006 | PASSED | Mes futuro (2026-11): «Exportar» deshabilitado, aparece «Solo podés exportar el mes actual o meses anteriores.», no abre ninguna hoja y la URL no cambia. |
| CP-EXP-007 | PASSED | Descarga `biyu-movimientos-2026-09.csv` con una fila de datos cuyo id es el de la transacción creada. |
| CP-EXP-008 | PASSED | Con «Todo 2025» descarga `biyu-movimientos-2025.csv` con una única fila (2025-02-10) y el id esperado. |
| CP-EXP-009 | PASSED | El borde del período se incluye: una sola fila con la fecha límite y el id esperado. |
| CP-EXP-010 | PASSED | El borde del período se incluye: una sola fila con la fecha límite y el id esperado. |
| CP-EXP-011 | PASSED | El día fuera del período se excluye: no se descarga archivo, la hoja queda abierta y aparece el mensaje exacto de período vacío. |
| CP-EXP-012 | PASSED | El día fuera del período se excluye: no se descarga archivo, la hoja queda abierta y aparece el mensaje exacto de período vacío. |
| CP-EXP-013 | PASSED | El borde del período se incluye: una sola fila con la fecha límite y el id esperado. |
| CP-EXP-014 | PASSED | El borde del período se incluye: una sola fila con la fecha límite y el id esperado. |
| CP-EXP-015 | PASSED | El día fuera del período se excluye: no se descarga archivo, la hoja queda abierta y aparece el mensaje exacto de período vacío. |
| CP-EXP-016 | PASSED | El día fuera del período se excluye: no se descarga archivo, la hoja queda abierta y aparece el mensaje exacto de período vacío. |
| CP-EXP-017 | PASSED | La transacción eliminada no sale: no se descarga archivo y aparece el mensaje de período vacío. |
| CP-EXP-018 | PASSED | La transacción restaurada vuelve a salir: una fila con el id esperado. |
| CP-EXP-019 | PASSED | Los dos archivos (vista Activos y vista Eliminados) son idénticos byte a byte; contienen `<ID-A>` y no `<ID-B>`. |
| CP-EXP-020 | PASSED | Los primeros tres bytes del archivo son `EF BB BF`. |
| CP-EXP-021 | PASSED | La primera línea es exactamente `fecha,tipo,monto,moneda,tipo_de_cambio,monto_ars,categoria,cuenta,cuotas,primer_periodo,descripcion,id`. |
| CP-EXP-022 | PASSED | Cada línea, incluida la última, termina en `0D 0A`; no hay línea en blanco ni total al final. |
| CP-EXP-023 | PASSED | Una sola fila por el total: fecha 2026-08-15, monto 120000.00, cuotas 12, primer_periodo 2026-08 e id esperado (compra en tarjeta de crédito). |
| CP-EXP-024 | PASSED | Un mes con solo cuota heredada produce el estado Vacío: no se descarga archivo y aparece «No tenés movimientos con fecha en septiembre 2026.» |
| CP-EXP-025 | PASSED | La fila contiene `gasto,1500.00,ARS,,1500.00`; no aparecen `1.500,00`, signo ni `1500` sin decimales. |
| CP-EXP-026 | PASSED | La fila contiene `300.00,USD,1250.5000,375150.00` exacto. |
| CP-EXP-027 | PASSED | Tras cambiar la referencia a 1400.0000 el CSV conserva `1250.5000` y `375150.00`; no aparecen `1400.0000` ni `420000.00`. |
| CP-EXP-028 | PASSED | El campo coincide byte a byte con el esperado (coma entrecomillada / comillas internas duplicadas). |
| CP-EXP-029 | PASSED | El campo coincide byte a byte con el esperado (coma entrecomillada / comillas internas duplicadas). |
| CP-EXP-030 | DUDA | El campo queda entre comillas con el salto de línea (LF) adentro y el archivo se lee como 12 columnas y una fila de datos con un lector RFC 4180. **No se usó Google Sheets** (el paso 16 lo pide): oráculo sustituido. |
| CP-EXP-031 | PASSED | La descripción queda neutralizada con un solo apóstrofo delante (y entre comillas si corresponde); coincide con la salida esperada. |
| CP-EXP-032 | PASSED | La descripción queda neutralizada con un solo apóstrofo delante (y entre comillas si corresponde); coincide con la salida esperada. |
| CP-EXP-033 | PASSED | La descripción queda neutralizada con un solo apóstrofo delante (y entre comillas si corresponde); coincide con la salida esperada. |
| CP-EXP-034 | PASSED | La descripción queda neutralizada con un solo apóstrofo delante (y entre comillas si corresponde); coincide con la salida esperada. |
| CP-EXP-035 | PASSED | La descripción queda neutralizada con un solo apóstrofo delante (y entre comillas si corresponde); coincide con la salida esperada. |
| CP-EXP-036 | PASSED | La descripción queda neutralizada con un solo apóstrofo delante (y entre comillas si corresponde); coincide con la salida esperada. |
| CP-EXP-037 | PASSED | La categoría `=Categoria QA` sale como `'=Categoria QA`. |
| CP-EXP-038 | PASSED | La cuenta `@Cuenta QA` sale como `'@Cuenta QA`. |
| CP-EXP-039 | PASSED | El orden de las filas es B, C, A (fecha y luego created_at, con created_at(B) < created_at(C)). |
| CP-EXP-040 | PASSED | El CSV trae exactamente N UUID distintos que coinciden con los creados (ninguno falta ni se repite) y el aviso dice «Exportamos N movimientos» con separador de miles. |
| CP-EXP-041 | PASSED | El CSV trae exactamente N UUID distintos que coinciden con los creados (ninguno falta ni se repite) y el aviso dice «Exportamos N movimientos» con separador de miles. |
| CP-EXP-042 | PASSED | El CSV trae exactamente N UUID distintos que coinciden con los creados (ninguno falta ni se repite) y el aviso dice «Exportamos N movimientos» con separador de miles. |
| CP-EXP-043 | PASSED | El CSV del usuario A trae una fila (111.00, SOLO-A, su id) y nada de B (999.00, SOLO-B, id de B). |
| CP-EXP-044 | PASSED | Con el token de A, la lectura de `transactions` filtrada por el id de B responde HTTP 200 con `[]`; sin filtro, A ve 0 filas. |
| CP-EXP-045 | PASSED | La categoría archivada sale con el nombre actual `Viajes 2026`. |
| CP-EXP-046 | PASSED | La cuenta archivada sale con el nombre actual `Billetera QA 2026`. |
| CP-EXP-047 | PASSED | Un ingreso exporta `tipo=ingreso` y `categoria` vacía (campo vacío entre dos comas). |
| CP-EXP-048 | PASSED | Tras eliminar la cuenta, su transacción ya no existe: no se descarga archivo y aparece el mensaje de período vacío. |
| CP-EXP-049 | PASSED | Con la lectura demorada, el botón dice «Exportando…», está deshabilitado y tiene `aria-busy="true"`. Demora simulada de 4 s (no 1 kbit/s de DevTools). |
| CP-EXP-050 | PASSED | Con «Exportando…» quedan deshabilitados los dos alcances, «Cancelar» y «Descargar CSV». Demora simulada de 4 s. |
| CP-EXP-051 | PASSED | Un doble clic rápido genera una sola descarga y un solo aviso «Exportamos 1 movimiento». |
| CP-EXP-052 | PASSED | Descarga el archivo, la hoja se cierra y aparece exactamente «Exportamos 1 movimiento» (un solo aviso). |
| CP-EXP-053 | PASSED | Descarga el archivo y aparece exactamente «Exportamos 2 movimientos» (un solo aviso). |
| CP-EXP-054 | PASSED | Un mes sin transacciones muestra el mensaje de Vacío; al elegir «Todo 2026» queda elegido y el mensaje mensual desaparece. |
| CP-EXP-055 | PASSED | Un año sin transacciones: no se descarga archivo y aparece «No tenés movimientos con fecha en 2025.» |
| CP-EXP-056 | PASSED | Con solo transacciones eliminadas: no se descarga archivo y aparece el mensaje de período vacío. |
| CP-EXP-057 | PASSED | Sin conexión: no se descarga archivo, aparece (con `role="alert"`) «No pudimos exportar tus movimientos. Probá de nuevo.» y alcances, «Descargar CSV» y «Cancelar» quedan habilitados. |
| CP-EXP-058 | PASSED | Al volver la conexión y reintentar, el error desaparece, se descarga el archivo con los dos ids una vez cada uno y aparece «Exportamos 2 movimientos». |
| CP-EXP-059 | PASSED | Desde el estado Error, «Cancelar» cierra la hoja, no se descarga nada y la URL conserva `?period=2026-09`. |
| CP-EXP-060 | PASSED | «Cancelar» cierra la hoja sin descargar y la URL conserva `?period=2026-09`. |
| CP-EXP-061 | PASSED | Escape cierra la hoja sin descargar y la URL conserva `?period=2026-09`. |
| CP-EXP-062 | FAILED | **FALLA.** Un clic sobre el fondo oscuro, fuera de la hoja, no la cierra: el clic lo recibe el `div` de fondo (`aria-hidden`), que es hijo del contenedor, y el controlador exige que el destino del clic sea el propio contenedor. La hoja sigue abierta. |
| CP-EXP-063 | FAILED | **FALLA.** Con la hoja abierta, «Atrás» cambia la URL a `?period=2026-08` (el evento `popstate` se dispara) pero la hoja sigue abierta. |
| CP-EXP-064 | FAILED | **FALLA.** «Atrás» durante «Exportando…» no cancela la exportación: cuando termina la lectura se descarga el archivo y aparece el aviso «Exportamos 1 movimiento», con el usuario ya en el mes anterior. |
| CP-EXP-065 | FAILED | **FALLA.** Con la hoja abierta, «Adelante» cambia la URL a `?period=2026-09` pero la hoja sigue abierta. |
| CP-EXP-066 | PASSED | Al salir a `/dashboard?period=2026-09` se abre Resumen, la hoja desaparece y no se descarga archivo. |
| CP-EXP-067 | PASSED | Exportar no modifica datos ni período: sigue una fila por `$3.000,00` (también tras recargar) y la API muestra la transacción sin `deleted_at`. |
| CP-EXP-068 | PASSED | Con 1.500 transacciones y un alta concurrente de 2,00 con fecha 31/12/2025 durante la lectura: no se descarga archivo, la hoja sigue abierta y aparece el error con `role="alert"`. El alta se hizo por API entre la 1.ª y la 2.ª página, no desde una segunda ventana. |
| CP-EXP-069 | PASSED | Con la hoja en «Exportando…», Escape no la cierra y sigue mostrando «Exportando…». |
| CP-EXP-070 | PASSED | La hoja sigue abierta y mostrando «Exportando…», **pero el caso no prueba nada hoy**: tocar fuera nunca cierra la hoja (ver DEF-030 / CP-EXP-062), así que el resultado sería el mismo sin el bloqueo. |
| CP-EXP-071 | DUDA | El CSV se lee como 12 columnas y una fila de datos con un lector RFC 4180; la descripción `Uno, "dos"` + salto de línea + `Tres` queda en una sola celda. **No se usó Google Sheets** (pasos 16 a 21): oráculo sustituido. |
| CP-EXP-072 | PASSED | El total de Resumen vuelve a mostrar exactamente `$3.000,00` después de exportar. |
| CP-EXP-073 | PASSED | No se descarga archivo y aparece «No pudimos exportar tus movimientos. Probá de nuevo.» con `role="alert"` (respuesta interceptada con HTTP 500 / monto textual inválido, simulado con una ruta de Playwright en lugar de pegar el código en la consola). |
| CP-EXP-074 | PASSED | No se descarga archivo y aparece «No pudimos exportar tus movimientos. Probá de nuevo.» con `role="alert"` (respuesta interceptada con HTTP 500 / monto textual inválido, simulado con una ruta de Playwright en lugar de pegar el código en la consola). |
| CP-EXP-075 | PASSED | Al elegir «Todo 2026» queda elegido y el mensaje de error desaparece. |

## Casos con resultado distinto de PASSED

- **FAILED (4):** CP-EXP-062 (DEF-030), CP-EXP-063 y CP-EXP-065 (DEF-031) y CP-EXP-064 (DEF-032). Los cuatro se reprodujeron más de una vez y el defecto es de la aplicación, no del caso.
- **DUDA (2):** CP-EXP-030 y CP-EXP-071. Los pasos finales piden importar el CSV en Google Sheets; no se pudo usar Google Sheets, así que el oráculo fue un lector RFC 4180 propio (12 columnas, una fila, descripción multilínea en una sola celda). Repetir con Google Sheets para cerrarlos.
- **PASSED sin valor hoy (1):** CP-EXP-070. El caso exige que tocar fuera no cierre la hoja durante «Exportando…», pero hoy tocar fuera nunca la cierra (DEF-030), así que pasaría aunque el bloqueo no existiera. Repetir cuando se corrija DEF-030.
