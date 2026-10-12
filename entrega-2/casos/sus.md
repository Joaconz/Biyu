# Casos de Prueba V2 — Módulo Suscripciones (`SUS`)

**Proyecto Biyu — Entrega 2 (V2)** · Épica: Suscripciones (`US-52` a `US-63` y `US-75`) · Rama: `casos/sus`

---

## Convención de fechas relativas para la ejecución manual

El cliente (`todayInArgentina()`, ADR-031) y las funciones RPC del servidor (`public.argentina_today()`, ADR-021 y ADR-030) leen la fecha real del calendario en el huso `America/Argentina/Buenos_Aires`. Como en una prueba manual de caja negra no se altera el reloj del servidor ni del navegador, todos los casos de este documento declaran las fechas **relativas al día de ejecución (`<HOY>`)** e incluyen entre paréntesis un **ejemplo concreto tomando `<HOY> = 06/10/2026` (`2026-10-06`, `<MES_ACTUAL> = 2026-10` / `"octubre 2026"`)**:

| Símbolo en el caso | Definición relativa a la fecha de ejecución | Ejemplo concreto si `<HOY> = 06/10/2026` |
|---|---|---|
| `<HOY>` / `<HOY_ISO>` | Fecha actual en Argentina en formato `DD/MM/AAAA` / `AAAA-MM-DD` | `06/10/2026` / `2026-10-06` |
| `<DIA_HOY>` | Número de día del mes de `<HOY>` (`1` a `31`) | `6` |
| `<DIA_AYER>` | `<DIA_HOY> - 1` (requiere ejecutar en un día del mes $\ge 2$) | `5` |
| `<DIA_MAÑANA>` | `<DIA_HOY> + 1` (requiere ejecutar en un día del mes $\le 27$) | `7` |
| `<MES_ACTUAL>` | Período corriente en formato `AAAA-MM` (o `"mes AAAA"` en textos de UI) | `2026-10` (`"octubre 2026"`, mes corto `"octubre"`) |
| `<MES_ANTERIOR>` | 1 mes antes de `<MES_ACTUAL>` | `2026-09` (`"septiembre 2026"`, mes corto `"septiembre"`) |
| `<MES_HACE_2>` | 2 meses antes de `<MES_ACTUAL>` | `2026-08` (`"agosto 2026"`) |
| `<MES_HACE_3>` | 3 meses antes de `<MES_ACTUAL>` | `2026-07` (`"julio 2026"`) |
| `<MES_HACE_4>` | 4 meses antes de `<MES_ACTUAL>` | `2026-06` (`"junio 2026"`) |
| `<MES_HACE_5>` | 5 meses antes de `<MES_ACTUAL>` | `2026-05` (`"mayo 2026"`) |
| `<MES_HACE_24>` | 24 meses antes de `<MES_ACTUAL>` (mínimo permitido en alta, ADR-032) | `2024-10` (`"octubre 2024"`) |
| `<MES_HACE_25>` | 25 meses antes de `<MES_ACTUAL>` (primer mes fuera de rango inferior) | `2024-09` (`"septiembre 2024"`) |
| `<MES_SIGUIENTE>` | 1 mes después de `<MES_ACTUAL>` | `2026-11` (`"noviembre 2026"`) |
| `<MES_MAS_2>` | 2 meses después de `<MES_ACTUAL>` | `2026-12` (`"diciembre 2026"`) |
| `<MES_MAS_3>` | 3 meses después de `<MES_ACTUAL>` | `2027-01` (`"enero 2027"`) |
| `<MES_MAS_12>` | 12 meses después de `<MES_ACTUAL>` (máximo permitido en alta, ADR-032) | `2027-10` (`"octubre 2027"`) |
| `<MES_MAS_13>` | 13 meses después de `<MES_ACTUAL>` (primer mes fuera de rango superior) | `2027-11` (`"noviembre 2027"`) |

En llamadas a las RPC (`create_subscription`, `update_subscription`, `upsert_fx_rate`), cada período `AAAA-MM` se envía como fecha del primer día del mes (`<MES>-01`, por ejemplo `"2026-08-01"`), y todo monto decimal se envía como string (`"5000.00"`, `C2` y `docs/12-procedimientos-de-prueba.md`).

---

## (a) Tabla de trazabilidad `US-nn · CA-k → CP-SUS-nnn`

| Historia | Criterio (`CA-k`) | Resumen del criterio | Casos que lo cubren / Hueco |
|---|---|---|---|
| **US-52** | CA-1 | Guardar suscripción válida crea 1 fila `active` con `generate_from_period = start_period`, redirige a `/subscriptions/:id` y muestra el aviso con `N` gastos vencidos | CP-SUS-001, CP-SUS-002 |
| **US-52** | CA-2 | Al guardar se crean en la misma operación las transacciones de los períodos vencidos no bloqueados que muestra la vista previa | CP-SUS-001, CP-SUS-002, CP-SUS-153 |
| **US-52** | CA-3 | Cada validación de la tabla (y sus bordes válidos) funciona con su mensaje exacto y no crea suscripción cuando es inválida | CP-SUS-003, CP-SUS-004, CP-SUS-009, CP-SUS-013, CP-SUS-016, CP-SUS-018, CP-SUS-020, CP-SUS-022, CP-SUS-024, CP-SUS-026, CP-SUS-028, CP-SUS-030, CP-SUS-032, CP-SUS-034, CP-SUS-036, CP-SUS-038, CP-SUS-040, CP-SUS-044, CP-SUS-046, CP-SUS-048, CP-SUS-050, CP-SUS-052, CP-SUS-054, CP-SUS-056, CP-SUS-057 |
| **US-52** | CA-4 | Día de cobro: `1`, `31` y `"01"` se aceptan; `0` y `32` se rechazan; vacío se rechaza; letras/coma/menos no se escriben en UI; `0`, `32` y `1.5` se rechazan por API | CP-SUS-005, CP-SUS-006, CP-SUS-036, CP-SUS-037, CP-SUS-038, CP-SUS-039, CP-SUS-040, CP-SUS-041, CP-SUS-042, CP-SUS-043 |
| **US-52** | CA-5 | Mes de inicio: límites `-24` y `+12` meses se aceptan; `-25` y `+13` meses se rechazan en UI y API | CP-SUS-007, CP-SUS-008, CP-SUS-046, CP-SUS-047, CP-SUS-048, CP-SUS-049 |
| **US-52** | CA-6 | Nombre: 60 caracteres se acepta y la UI no deja escribir el 61; 61 se rechaza por API; `"  Netflix  "` se guarda como `"Netflix"` | CP-SUS-010, CP-SUS-011, CP-SUS-015 |
| **US-52** | CA-7 | Nombre duplicado contra activa o pausada (sin distinguir mayúsculas ni espacios) se rechaza; contra cancelada se acepta | CP-SUS-012, CP-SUS-016, CP-SUS-017, CP-SUS-018, CP-SUS-019 |
| **US-52** | CA-8 | Todas las validaciones de CA-3 a CA-7 enviadas directo a la RPC `create_subscription` se rechazan con el mismo mensaje (C6, ADR-030) | CP-SUS-014, CP-SUS-015, CP-SUS-017, CP-SUS-019, CP-SUS-021, CP-SUS-023, CP-SUS-025, CP-SUS-027, CP-SUS-029, CP-SUS-031, CP-SUS-033, CP-SUS-035, CP-SUS-037, CP-SUS-039, CP-SUS-041, CP-SUS-043, CP-SUS-045, CP-SUS-047, CP-SUS-049, CP-SUS-051, CP-SUS-053, CP-SUS-055, CP-SUS-056, CP-SUS-057 |
| **US-52** | CA-9 | `INSERT` y `DELETE` directos sobre `subscriptions` con sesión del usuario se rechazan con `42501` | CP-SUS-060, CP-SUS-061 |
| **US-52** | CA-10 | Durante el guardado el botón está deshabilitado y dos toques seguidos crean una sola suscripción | CP-SUS-062 |
| **US-52** | CA-11 | Si el guardado falla por red, los 9 campos conservan lo cargado y se muestra `subscription-form-error` | **Hueco H-SUS-01** (requiere corte de red) |
| **US-52** | CA-12 | Con la suscripción guardada, `/subscriptions` la muestra en `"Activas"` con `data-status="active"` | CP-SUS-001, CP-SUS-076 |
| **US-52** | CA-13 | Par de autorización (C7): otro usuario recibe 0 filas y `subscription-detail-not-found`; sin sesión (`anon`) la consulta y `create_subscription` dan `42501` | CP-SUS-063, CP-SUS-064, CP-SUS-065, CP-SUS-066 |
| **US-52** | CA-14 | Estados vacíos, de no encontrado y sin catálogos activos aparecen con su texto y `data-testid` (los de carga/error de red van a hueco) | CP-SUS-063, CP-SUS-067, CP-SUS-068, CP-SUS-069 + **Hueco H-SUS-01** |
| **US-52** | CA-15 | Por API, `create_subscription` con categoría o cuenta de otro usuario se rechaza con `"La categoría no está disponible"` / `"El medio de pago no está disponible"` | CP-SUS-058, CP-SUS-059 |
| **US-52** | CA-16 | Reintento tras fallo de red que choca con nombre duplicado muestra `subscription-form-error-list` | **Hueco H-SUS-01** (requiere fallo de red en tránsito) |
| **US-53** | CA-1 | Puesta al día genera exactamente las transacciones de los períodos vencidos con `occurred_on` en el día de cobro, `installments_count = 1`, `type = 'expense'` y monto actual | CP-SUS-070, CP-SUS-072 + **Hueco H-SUS-02** |
| **US-53** | CA-2 | Recargar la página después de la puesta al día no crea transacciones nuevas ni muestra el aviso (`I16`) | CP-SUS-071, CP-SUS-072 |
| **US-53** | CA-3 | Dos ejecuciones de puesta al día dejan exactamente las mismas transacciones que una sola y ninguna devuelve error (`I11`) | CP-SUS-072 + **Hueco H-SUS-03** (concurrencia simultánea exacta) |
| **US-53** | CA-4 | Con la Edge Function caída, se muestra `app-catchup-error` y `"Reintentar"` genera las pendientes al restablecerse | **Hueco H-SUS-01** (requiere caída de Edge Function / red) |
| **US-53** | CA-5 | Performance: 50 suscripciones con 24 meses de atraso (1.250 transacciones) terminan en < 5 s | **Hueco H-SUS-04** (prueba no funcional de carga) |
| **US-53** | CA-6 | Una suscripción cuya categoría o cuenta se archivó después del alta sigue generando | CP-SUS-073 |
| **US-53** | CA-7 | Una suscripción `paused` o `cancelled` no genera nada (`R3`) | CP-SUS-074, CP-SUS-075 |
| **US-53** | CA-8 | Con `end_period` vencido en el pasado, la puesta al día genera solo hasta `end_period` inclusive (3 transacciones para un rango de 3 meses) | CP-SUS-076 |
| **US-53** | CA-9 | Ninguna transacción generada tiene `subscription_period` fuera de `[generate_from_period, min(end_period, período corriente)]` (`I17`) | CP-SUS-070, CP-SUS-076 |
| **US-53** | CA-10 | La puesta al día corre una sola vez por carga de la app: navegar entre pestañas no la vuelve a llamar | CP-SUS-071 |
| **US-53** | CA-11 | Si la puesta al día no responde en 8 s (±1 s), la pantalla se muestra con `app-catchup-error` | **Hueco H-SUS-01** (requiere demorar la red > 8 s) |
| **US-53** | CA-12 | Si una suscripción falla al generar una ocurrencia (desborde en ARS), las demás se generan igual, no hay franja de error y la fallida queda bloqueada | CP-SUS-077 |
| **US-53** | CA-13 | `start_period = período corriente` con día de cobro ya pasado genera 1 ocurrencia; `start_period` en el futuro no genera nada | CP-SUS-002, CP-SUS-008, CP-SUS-081, CP-SUS-082, CP-SUS-083 |
| **US-53** | CA-14 | `end_period = start_period`, ambos en el pasado, genera exactamente 1 ocurrencia | CP-SUS-007 |
| **US-54** | CA-1 | Día de cobro `31`: enero tiene `occurred_on` día 31, febrero no bisiesto día 28 y abril día 30 | CP-SUS-078 |
| **US-54** | CA-2 | Día de cobro `29`: febrero no bisiesto da día 28; febrero bisiesto (2028) da día 29 | CP-SUS-079 + **Hueco H-SUS-05** (año bisiesto 2028 fuera de `[-24, +12]`) |
| **US-54** | CA-3 | Día de cobro `30`: febrero no bisiesto da día 28; febrero bisiesto (2028) da día 29 | CP-SUS-080 + **Hueco H-SUS-05** (año bisiesto 2028 fuera de `[-24, +12]`) |
| **US-54** | CA-4 | Ningún recorte mueve la ocurrencia al mes siguiente: `subscription_period` es siempre el mes de `occurred_on` | CP-SUS-078, CP-SUS-079, CP-SUS-080 |
| **US-54** | CA-5 | La vista previa y `"Próximo cobro"` muestran las mismas fechas reales según `R4` que las transacciones generadas | CP-SUS-078, CP-SUS-156 |
| **US-54** | CA-6 | Día de cobro `31` en febrero bisiesto (2028) da `2028-02-29` | **Hueco H-SUS-05** (febrero 2028 fuera del rango de alta en 2026) |
| **US-55** | CA-1 | Día de cobro mañana (`<DIA_MAÑANA>`): la puesta al día de hoy no genera la ocurrencia del mes corriente | CP-SUS-081 |
| **US-55** | CA-2 | Día de cobro hoy (`<DIA_HOY>`): la puesta al día de hoy genera la ocurrencia del mes corriente | CP-SUS-082 |
| **US-55** | CA-3 | Día de cobro ayer (`<DIA_AYER>`): la puesta al día de hoy genera la ocurrencia del mes corriente | CP-SUS-083 |
| **US-55** | CA-4 | Los períodos anteriores al corriente se generan siempre, sin importar el día de hoy | CP-SUS-084 |
| **US-55** | CA-5 | Entre las 21:00 y 23:59 hora de Argentina del día anterior al cobro (ya día de cobro en UTC), no se genera | **Hueco H-SUS-06** (requiere ventana horaria nocturna / reloj fijo) |
| **US-55** | CA-6 | Día de cobro `31` en un mes de 30 días se genera el día 30 | CP-SUS-078 + **Hueco H-SUS-05** (si se ejecuta el propio día 30 como `<HOY>`) |
| **US-56** | CA-1 | Al confirmar pausa: `status = 'paused'`, `paused_at` con fecha/hora de la operación y `generate_from_period = max(anterior, mes siguiente al corriente)` (`R8`) | CP-SUS-085 |
| **US-56** | CA-2 | Las transacciones ya generadas no cambian ni de monto ni de `deleted_at` | CP-SUS-085 |
| **US-56** | CA-3 | Con día de cobro 28 sin ocurrencia del mes, pausar antes y reanudar en el mismo mes deja el piso en el mes siguiente y no genera el mes corriente | CP-SUS-085, CP-SUS-096 + **Hueco H-SUS-02** (esperar del día 1 al 30) |
| **US-56** | CA-4 | Una suscripción con meses vencidos sin generar los genera al pausar, antes de cambiar el estado | CP-SUS-088 |
| **US-56** | CA-5 | Mientras está pausada, ninguna puesta al día genera transacciones para ella (`R3`) | CP-SUS-074, CP-SUS-085 |
| **US-56** | CA-6 | `"Cancelar"` en el diálogo de pausa no cambia nada | CP-SUS-087 |
| **US-56** | CA-7 | Por API, `pause_subscription` sobre una pausada da `"La suscripción ya está pausada"` (`23514`) y sobre una cancelada da `"Una suscripción cancelada no se puede modificar"` (`23514`) | CP-SUS-091, CP-SUS-092 |
| **US-56** | CA-8 | Un `UPDATE` directo de `status` sobre `subscriptions` con la sesión del usuario se rechaza con `42501` | CP-SUS-093 |
| **US-56** | CA-9 | Par de autorización (C7) de `pause_subscription`: otro usuario recibe `P0002` `"Suscripción no encontrada"`; sin sesión recibe `42501` | CP-SUS-094, CP-SUS-095 |
| **US-56** | CA-10 | Pausar una bloqueada muestra `pause-subscription-dialog-blocked-warning`, se pausa igual y los meses bloqueados no se generan al reanudar | CP-SUS-089, CP-SUS-090 |
| **US-56** | CA-11 | El texto sobre `"Este mes tampoco se cobra..."` aparece cuando el mes corriente aún no venció y no aparece cuando ya se generó | CP-SUS-085, CP-SUS-086 |
| **US-57** | CA-1 | Al confirmar reanudación: `status = 'active'`, `paused_at = null` y `generate_from_period = max(anterior, start_period, período corriente)` (`R8`) | CP-SUS-096 |
| **US-57** | CA-2 | Los meses intermedios en los que estuvo pausada no se generan al reanudar | CP-SUS-090, CP-SUS-096 + **Hueco H-SUS-02** (avance de 3 meses de reloj) |
| **US-57** | CA-3 | Con `start_period` en el futuro, pausada y reanudada hoy: no falla, `generate_from_period` queda en `start_period` y no genera nada | CP-SUS-097 |
| **US-57** | CA-4 | `generate_from_period` después de reanudar nunca es menor que antes (`I12`) | CP-SUS-096, CP-SUS-097 |
| **US-57** | CA-5 | El `"Próximo cobro"` del diálogo de reanudar coincide con el del Detalle tras reanudar (la rama `"Al reanudar se carga..."` requiere pausa en mes anterior) | CP-SUS-096, CP-SUS-097 + **Hueco H-SUS-02** (`generated_after = 1`) |
| **US-57** | CA-6 | Por API, `resume_subscription` sobre una activa da `"La suscripción no está pausada"` (`23514`) y sobre una cancelada da `"Una suscripción cancelada no se puede modificar"` (`23514`) | CP-SUS-098, CP-SUS-099 |
| **US-57** | CA-7 | Par de autorización (C7) de `resume_subscription`: otro usuario recibe `P0002` `"Suscripción no encontrada"`; sin sesión recibe `42501` | CP-SUS-100, CP-SUS-101 |
| **US-58** | CA-1 | Al confirmar cancelación (desde activa o pausada): `status = 'cancelled'` y `cancelled_at` con fecha y hora de la operación (`I15`) | CP-SUS-102, CP-SUS-103, CP-SUS-104 |
| **US-58** | CA-2 | Las transacciones ya generadas siguen existiendo sin `deleted_at` y siguen sumando en el Resumen de sus meses | CP-SUS-102 |
| **US-58** | CA-3 | Ninguna puesta al día posterior genera transacciones para una cancelada | CP-SUS-075, CP-SUS-102 |
| **US-58** | CA-4 | Los meses vencidos sin generar se generan antes de cancelar (ADR-030) | CP-SUS-104 |
| **US-58** | CA-5 | `N` en el texto del diálogo de cancelar coincide con la cantidad de transacciones que quedan después de confirmar | CP-SUS-102, CP-SUS-105 |
| **US-58** | CA-6 | Una cancelada no vuelve a `active` ni `paused` (`pause_subscription`, `resume_subscription`, `update_subscription` dan `23514`; `UPDATE` directo da `42501`), y el Detalle no muestra botones de acción | CP-SUS-092, CP-SUS-093, CP-SUS-099, CP-SUS-102, CP-SUS-120, CP-SUS-121 |
| **US-58** | CA-7 | Después de cancelar, se puede dar de alta otra suscripción con el mismo nombre | CP-SUS-012 |
| **US-58** | CA-8 | Por API, `cancel_subscription` sobre una cancelada se rechaza con `"Una suscripción cancelada no se puede modificar"` (`23514`) | CP-SUS-106 |
| **US-58** | CA-9 | Par de autorización (C7) de `cancel_subscription`: otro usuario recibe `P0002` `"Suscripción no encontrada"`; sin sesión recibe `42501` | CP-SUS-107, CP-SUS-108 |
| **US-58** | CA-10 | Cancelar una bloqueada muestra `cancel-subscription-dialog-blocked-warning` y se cancela igual | CP-SUS-105 |
| **US-59** | CA-1 | Cambiar el monto de `$5.000,00` a `$7.000,00` no modifica las transacciones ya generadas y aplica desde el próximo cobro (`R7`) | CP-SUS-109 |
| **US-59** | CA-2 | Si al editar había meses vencidos sin generar, `update_subscription` los genera con el monto **anterior** antes de aplicar el cambio | CP-SUS-110 |
| **US-59** | CA-3 | Cambiar día de cobro, categoría o medio de pago no modifica las transacciones ya generadas y usa el valor nuevo en la siguiente | CP-SUS-111, CP-SUS-113 |
| **US-59** | CA-4 | Cambiar el nombre no cambia la descripción de las transacciones ya generadas | CP-SUS-112 |
| **US-59** | CA-5 | Moneda y mes de inicio son de solo lectura en la UI; por API, `update_subscription` con `p_currency` o con `p_start_period` se rechaza con `"La moneda y el mes de inicio no se pueden cambiar"` | CP-SUS-109, CP-SUS-114, CP-SUS-115 |
| **US-59** | CA-6 | El mes de fin anterior al mínimo se rechaza con su mensaje en la UI y por API | CP-SUS-116, CP-SUS-117 |
| **US-59** | CA-7 | Las validaciones del alta valen al editar (nombre duplicado se compara contra las demás suscripciones, no contra sí misma) | CP-SUS-109, CP-SUS-118, CP-SUS-119 |
| **US-59** | CA-8 | Editar una cancelada se rechaza en la UI (`"Esta suscripción está cancelada y no se puede editar."`) y por API (`23514`) | CP-SUS-120, CP-SUS-121 |
| **US-59** | CA-9 | Un `UPDATE` directo de `amount` sobre `subscriptions` con la sesión del usuario se rechaza con `42501` | CP-SUS-122 |
| **US-59** | CA-10 | Con la categoría o cuenta actual archivada, cambiar solo el monto se guarda; elegir por API otra categoría o cuenta archivada distinta de la actual se rechaza | CP-SUS-123, CP-SUS-124, CP-SUS-125, CP-SUS-126 |
| **US-59** | CA-11 | Una terminada se puede editar sin tocar el mes de fin; extenderla a `"Sin fin"` deja `generate_from_period` en el período corriente sin rellenar los meses intermedios | CP-SUS-127, CP-SUS-128 |
| **US-59** | CA-12 | Cambiar el día de cobro de `28` a `3` (con `<DIA_HOY> >= 3` y mes corriente sin generar) crea al guardar la ocurrencia del mes corriente con fecha día `3` y los datos nuevos | CP-SUS-113 |
| **US-59** | CA-13 | Par de autorización (C7) de `update_subscription`: otro usuario recibe `P0002` `"Suscripción no encontrada"`; sin sesión recibe `42501` | CP-SUS-129, CP-SUS-130 |
| **US-60** | CA-1 | Eliminar una ocurrencia generada (`deleted_at`) y volver a correr la puesta al día no vuelve a crear la transacción de ese mes (`R2`) | CP-SUS-131 |
| **US-60** | CA-2 | La ocurrencia eliminada deja de sumar en el Resumen de su mes (`I10`) | CP-SUS-132 |
| **US-60** | CA-3 | El diálogo de borrado muestra `delete-transaction-subscription-note` con el nombre de la suscripción y el mes solo si tiene `subscription_id` | CP-SUS-131 |
| **US-60** | CA-4 | Restaurar la ocurrencia desde el filtro `"Eliminados"` de Movimientos vuelve a sumarla, quita la marca `"Eliminado"` en el Detalle y no duplica el mes | CP-SUS-133 |
| **US-60** | CA-5 | En `"Gastos cargados"` del Detalle, el mes borrado sigue apareciendo con la marca `"Eliminado"` (`subscription-detail-occurrence-deleted`) | CP-SUS-131 |
| **US-61** | CA-1 | Toda transacción con `subscription_id` muestra la marca en Movimientos y en el Resumen (donde suma a los KPI); ninguna cargada a mano la muestra | CP-SUS-134, CP-SUS-135 |
| **US-61** | CA-2 | Tocar la marca en Movimientos o Resumen lleva a `/subscriptions/:id` | CP-SUS-134 |
| **US-61** | CA-3 | Si la suscripción se renombró, la marca muestra el nombre nuevo | CP-SUS-112 |
| **US-61** | CA-4 | La marca aparece también en las suscripciones pausadas y canceladas | CP-SUS-137, CP-SUS-138 |
| **US-61** | CA-5 | `"Gastos cargados"` lista exactamente las transacciones con ese `subscription_id` en orden de período descendente (y texto vacío cuando no hay) | CP-SUS-002, CP-SUS-136 |
| **US-62** | CA-1 | USD `10,00` con tipo de cambio en un mes y sin tipo de cambio en el siguiente genera el primero con su `fx_rate` congelado, no genera el segundo y muestra la suscripción bloqueada | CP-SUS-139 |
| **US-62** | CA-2 | Ninguna transacción de suscripción en USD se genera con `fx_rate` nulo, 0 ni de otro período (`I5`) | CP-SUS-139 |
| **US-62** | CA-3 | Al guardar el tipo de cambio faltante en Ajustes, la puesta al día corre sola, genera el mes pendiente, muestra `"Se cargó 1 gasto de suscripciones"` y quita el bloqueo | CP-SUS-140 |
| **US-62** | CA-4 | Una suscripción en ARS nunca se muestra bloqueada | CP-SUS-001, CP-SUS-142 |
| **US-62** | CA-5 | Una suscripción pausada o cancelada no se muestra bloqueada | CP-SUS-089, CP-SUS-105 |
| **US-62** | CA-6 | Una suscripción en USD sin tipo de cambio del mes corriente **antes** del día de cobro (`R5`) no se muestra bloqueada | CP-SUS-142 |
| **US-62** | CA-7 | El botón `"Cargar tipo de cambio"` lleva a `/settings?period=<YYYY-MM>` con el mes más viejo que falta | CP-SUS-139, CP-SUS-141 |
| **US-62** | CA-8 | Con tres meses bloqueados, el aviso los lista separados por comas y `"y"` | CP-SUS-141 |
| **US-63** | CA-1 | Con `$5.000,00` ARS y `$2.500,00` ARS activas, el total comprometido es `"$7.500,00"` | CP-SUS-143 |
| **US-63** | CA-2 | Una pausada, una cancelada, una que empieza el mes que viene y una cuyo mes de fin ya pasó no suman | CP-SUS-149, CP-SUS-150, CP-SUS-151, CP-SUS-152 |
| **US-63** | CA-3 | Una `USD 10,00` con tipo de cambio del período corriente de `1.250,00` suma `"$12.500,00"` | CP-SUS-144 |
| **US-63** | CA-4 | Sin tipo de cambio del período corriente, la `USD 10,00` no suma al total en pesos y aparece en `subscriptions-committed-usd-pending` | CP-SUS-145 |
| **US-63** | CA-5 | Cambiar el monto de una suscripción cambia el total comprometido al volver a la lista, aunque la transacción del mes siga con el monto anterior | CP-SUS-146 |
| **US-63** | CA-6 | El Resumen (`/dashboard`) no suma suscripciones que no tengan transacción generada | CP-SUS-147 |
| **US-63** | CA-7 | Con una sola suscripción `USD 10,00` sin tipo de cambio del mes corriente: `"$0,00"`, `"1 suscripción activa este mes"` y `"+ USD 10,00 sin tipo de cambio de <mes actual>"` | CP-SUS-145 |
| **US-63** | CA-8 | Una terminada (`end_period < período corriente`) no suma; una con `end_period = período corriente` sí suma | CP-SUS-148, CP-SUS-152 |
| **US-75** | CA-1 | Vista previa con `$5.000,00` ARS, día posterior a hoy (`10`), desde `<MES_HACE_2>` y sin fin muestra 2 meses en `"Se cargan al guardar"`, 3 en `"Próximos cobros"` y resumen de 2 gastos por `"$10.000,00"` | CP-SUS-153 |
| **US-75** | CA-2 | Igual que CA-1 pero con día de cobro igual a `<DIA_HOY>`: el período corriente pasa a `"Se cargan al guardar"` (`R5`) | CP-SUS-154 |
| **US-75** | CA-3 | Con Mes de inicio futuro (`<MES_MAS_3>`): `"Al guardar no se carga ningún gasto."` y `"Próximos cobros"` empieza en `<MES_MAS_3>` | CP-SUS-155 |
| **US-75** | CA-4 | Rango cerrado en el pasado (`2026-03` a `2026-05`): `"Se cargan al guardar"` muestra esos 3 meses y `"Próximos cobros"` dice `"No hay más cobros: termina en mayo 2026."` | CP-SUS-156 |
| **US-75** | CA-5 | Con día de cobro `31`, las fechas de la vista previa siguen `R4` (30 en meses de 30 días, 28 en febrero no bisiesto) | CP-SUS-078, CP-SUS-156 |
| **US-75** | CA-6 | En USD sin tipo de cambio de un mes vencido, esa fila lleva `data-blocked="true"` con `"Sin tipo de cambio: se carga cuando lo cargues"` y no cuenta en el resumen | CP-SUS-157 |
| **US-75** | CA-7 | Al guardar el mismo día, las transacciones creadas coinciden período por período y fecha por fecha con las filas no bloqueadas de `"Se cargan al guardar"` | CP-SUS-153 |
| **US-75** | CA-8 | Con un campo obligatorio inválido o vacío se muestra `subscription-form-preview-empty` y ninguna lista | CP-SUS-158 |
| **US-75** | CA-9 | A las 22:00 de Argentina del día anterior al de cobro (ya día de cobro en UTC), el período corriente aparece en `"Próximos cobros"` aunque el dispositivo esté en UTC | **Hueco H-SUS-06** (requiere ventana horaria nocturna / reloj fijo) |

---

## (b) Casos de prueba completos

### CP-SUS-001 — Dar de alta una suscripción en ARS desde hace 2 meses con día de cobro 10 genera los 2 gastos vencidos al guardar

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-1, CA-2, CA-12 · FR-15 · R1, R4, R5, R8 |
| Invariante | I4, I12, I13 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` (por defecto `http://localhost:5173`). S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`, con la cuenta `"Efectivo"` en `ARS` y la categoría `"Entretenimiento"` activas. S 3: la fecha de ejecución `<HOY>` tiene `<DIA_HOY> < 10` (ejemplo concreto: `<HOY> = 06/10/2026`, `<MES_ACTUAL> = 2026-10`, `<MES_HACE_2> = 2026-08`, `<MES_ANTERIOR> = 2026-09`; si `<DIA_HOY> >= 10`, usar `D 8 = "28"`).

**Datos de prueba:** D 1: Email `qa+cp-sus-001-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Netflix"`. D 4: Monto `"5000"`. D 5: Moneda `"ARS"`. D 6: Categoría `"Entretenimiento"`. D 7: Medio de pago `"Efectivo"`. D 8: Día de cobro `"10"`. D 9: Mes de inicio `"<MES_HACE_2>"` (`"2026-08"`). D 10: Descripción `"Plan estándar"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en el campo `"Email"` (`login-email`) | El campo `"Email"` toma foco |
| 4 | Escribir `qa+cp-sus-001-001@example.com` | El campo `"Email"` muestra `qa+cp-sus-001-001@example.com` |
| 5 | Hacer click en el campo `"Contraseña"` (`login-password`) | El campo `"Contraseña"` toma foco |
| 6 | Escribir `Clave123!` | El campo `"Contraseña"` muestra 9 caracteres ocultos |
| 7 | Hacer click en el botón `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 8 | Hacer click en `"Suscripciones"` en la barra de navegación (`register-nav-subscriptions`) | Se abre `/subscriptions` con el encabezado `"Suscripciones"` (`subscriptions-title`) |
| 9 | Hacer click en el botón `"Nueva"` (`subscriptions-new`) | Se abre `/subscriptions/new` con el formulario `"Nueva suscripción"` (`subscription-form`), Moneda `"ARS"` seleccionada y `"Mes de inicio"` en `<MES_ACTUAL>` |
| 10 | Hacer click en el campo `"Nombre"` (`subscription-form-name`) | El campo `"Nombre"` toma foco |
| 11 | Escribir `Netflix` | El campo `"Nombre"` muestra `Netflix` |
| 12 | Hacer click en el campo `"Monto"` (`subscription-form-amount`) | El campo `"Monto"` toma foco |
| 13 | Escribir `5000` | El campo `"Monto"` muestra `5000` |
| 14 | Seleccionar `"Entretenimiento"` en el desplegable `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 15 | Seleccionar `"Efectivo"` en el desplegable `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 16 | Hacer click en el campo `"Día de cobro"` (`subscription-form-billing-day`) | El campo `"Día de cobro"` toma foco |
| 17 | Escribir `10` | El campo `"Día de cobro"` muestra `10` |
| 18 | Ingresar `<MES_HACE_2>` (ej. `2026-08`) en el campo `"Mes de inicio"` (`subscription-form-start-period`) | `"Mes de inicio"` muestra `<MES_HACE_2>` y `subscription-form-preview-summary` muestra `"Al guardar se cargan 2 gastos de $5.000,00 (total $10.000,00)."` |
| 19 | Hacer click en el campo `"Descripción (opcional)"` (`subscription-form-description`) | El campo `"Descripción (opcional)"` toma foco |
| 20 | Escribir `Plan estándar` | El campo muestra `Plan estándar` y el contador inferior indica `13/200` |
| 21 | Hacer click en el botón `"Guardar suscripción"` (`subscription-form-submit`) | Navega a `/subscriptions/<SUB_ID>`, muestra el aviso `"Suscripción guardada. Se cargaron 2 gastos vencidos."` (`subscription-toast`), el título `"Netflix"` (`subscription-detail-name`), el estado `"Activa"` (`subscription-detail-status` con `data-status="active"`), `"Monto"` `"$5.000,00"`, `"Desde"` `"<mes hace 2>"` (ej. `"agosto 2026"`), `"Hasta"` `"Sin fin"`, `"Próximo cobro"` `"10/<MES_ACTUAL>"` (ej. `"10/10/2026"`), `"Descripción"` `"Plan estándar"` y en `"Gastos cargados"` (`subscription-detail-occurrences`) 2 filas: `<MES_ANTERIOR>` (`10/09/2026`, `"$5.000,00"`) y `<MES_HACE_2>` (`10/08/2026`, `"$5.000,00"`) |
| 22 | Hacer click en el botón atrás (`subscription-detail-back`) | Navega a `/subscriptions` y bajo el grupo `"Activas"` aparece la fila `"Netflix"` (`subscriptions-item` con `data-status="active"`), monto `"$5.000,00"` y `"Se cobra el día 10"` |

**Post-condición:** La suscripción `"Netflix"` queda visible en el grupo `"Activas"` con 2 gastos cargados (`<MES_HACE_2>` y `<MES_ANTERIOR>`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-002 — Dar de alta una suscripción en ARS desde el mes siguiente no genera gastos al guardar

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-1, CA-2 · US-53 · CA-13 · US-61 · CA-5 · FR-15, FR-16 · R1, R5, R8 |
| Invariante | I12, I17 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · Sí · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`, con cuenta `"Efectivo"` y categoría `"Entretenimiento"` activas.

**Datos de prueba:** D 1: Email `qa+cp-sus-002-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Disney+"`. D 4: Monto `"4200"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"15"`. D 8: Mes de inicio `"<MES_SIGUIENTE>"` (ej. `"2026-11"` si `<HOY> = 06/10/2026`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en `"Email"` (`login-email`) | El campo toma foco |
| 4 | Escribir `qa+cp-sus-002-001@example.com` | El campo muestra `qa+cp-sus-002-001@example.com` |
| 5 | Hacer click en `"Contraseña"` (`login-password`) | El campo toma foco |
| 6 | Escribir `Clave123!` | El campo muestra 9 caracteres ocultos |
| 7 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 8 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 9 | Hacer click en `"Nueva"` (`subscriptions-new`) | Se abre `/subscriptions/new` |
| 10 | Hacer click en `"Nombre"` (`subscription-form-name`) y escribir `Disney+` | El campo `"Nombre"` muestra `Disney+` |
| 11 | Hacer click en `"Monto"` (`subscription-form-amount`) y escribir `4200` | El campo `"Monto"` muestra `4200` |
| 12 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 13 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 14 | Hacer click en `"Día de cobro"` (`subscription-form-billing-day`) y escribir `15` | El campo `"Día de cobro"` muestra `15` |
| 15 | Ingresar `<MES_SIGUIENTE>` (ej. `2026-11`) en `"Mes de inicio"` (`subscription-form-start-period`) | `subscription-form-preview-summary` muestra `"Al guardar no se carga ningún gasto."` |
| 16 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada"` (`subscription-toast`), `"Próximo cobro"` (`subscription-detail-next-charge`) muestra `"15/<MES_SIGUIENTE>"` (ej. `"15/11/2026"`) y en `"Gastos cargados"` se lee `"Todavía no se cargó ningún gasto. El primero se carga el 15/<MES_SIGUIENTE>."` (`subscription-detail-occurrences-empty`) |

**Post-condición:** La suscripción `"Disney+"` queda activa sin transacciones cargadas. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-003 — Dar de alta una suscripción con Monto en el límite inferior válido (`"0,01"`) se acepta

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3 · FR-15 |
| Invariante | I4 |
| Técnica · Tipo | Análisis de valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-003-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Prueba Centavo"`. D 4: Monto `"0,01"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"10"`. D 8: Mes de inicio `"<MES_SIGUIENTE>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en `"Email"` (`login-email`) y escribir `qa+cp-sus-003-001@example.com` | El campo muestra `qa+cp-sus-003-001@example.com` |
| 4 | Hacer click en `"Contraseña"` (`login-password`) y escribir `Clave123!` | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/new` | Se abre `"Nueva suscripción"` |
| 7 | Hacer click en `"Nombre"` (`subscription-form-name`) y escribir `Prueba Centavo` | El campo `"Nombre"` muestra `Prueba Centavo` |
| 8 | Hacer click en `"Monto"` (`subscription-form-amount`) y escribir `0,01` | El campo `"Monto"` muestra `0,01` |
| 9 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 10 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 11 | Hacer click en `"Día de cobro"` (`subscription-form-billing-day`) y escribir `10` | El campo `"Día de cobro"` muestra `10` |
| 12 | Ingresar `<MES_SIGUIENTE>` en `"Mes de inicio"` (`subscription-form-start-period`) | `"Mes de inicio"` muestra `<MES_SIGUIENTE>` |
| 13 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada"` y en `"Datos"` la fila `"Monto"` muestra `"$0,01"` |

**Post-condición:** La suscripción queda creada con monto `$0,01` (`I4`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-004 — Dar de alta una suscripción en ARS con Monto en el límite superior válido (`"999999999999,99"`) se acepta

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3 · FR-15 |
| Invariante | I4 |
| Técnica · Tipo | Análisis de valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-004-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Tope ARS"`. D 4: Monto `"999999999999,99"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"10"`. D 8: Mes de inicio `"<MES_SIGUIENTE>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en `"Email"` (`login-email`) y escribir `qa+cp-sus-004-001@example.com` | El campo muestra `qa+cp-sus-004-001@example.com` |
| 4 | Hacer click en `"Contraseña"` (`login-password`) y escribir `Clave123!` | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/new` | Se abre `"Nueva suscripción"` |
| 7 | Hacer click en `"Nombre"` (`subscription-form-name`) y escribir `Tope ARS` | El campo `"Nombre"` muestra `Tope ARS` |
| 8 | Hacer click en `"Monto"` (`subscription-form-amount`) y escribir `999999999999,99` | El campo `"Monto"` muestra `999999999999,99` |
| 9 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 10 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 11 | Hacer click en `"Día de cobro"` (`subscription-form-billing-day`) y escribir `10` | El campo `"Día de cobro"` muestra `10` |
| 12 | Ingresar `<MES_SIGUIENTE>` en `"Mes de inicio"` (`subscription-form-start-period`) | `"Mes de inicio"` muestra `<MES_SIGUIENTE>` |
| 13 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada"` y en `"Datos"` la fila `"Monto"` muestra `"$999.999.999.999,99"` |

**Post-condición:** La suscripción queda creada con monto `$999.999.999.999,99` (`I4`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-005 — Dar de alta una suscripción con Día de cobro en el límite inferior `"01"` se guarda como `"1"`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-4 · FR-15 · R4 |
| Invariante | I13 |
| Técnica · Tipo | Análisis de valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-005-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Spotify"`. D 4: Monto `"3500"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"01"`. D 8: Mes de inicio `"<MES_SIGUIENTE>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en `"Email"` (`login-email`) y escribir `qa+cp-sus-005-001@example.com` | El campo muestra `qa+cp-sus-005-001@example.com` |
| 4 | Hacer click en `"Contraseña"` (`login-password`) y escribir `Clave123!` | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/new` | Se abre `"Nueva suscripción"` |
| 7 | Hacer click en `"Nombre"` (`subscription-form-name`) y escribir `Spotify` | El campo muestra `Spotify` |
| 8 | Hacer click en `"Monto"` (`subscription-form-amount`) y escribir `3500` | El campo muestra `3500` |
| 9 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 10 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 11 | Hacer click en `"Día de cobro"` (`subscription-form-billing-day`) y escribir `01` | El campo `"Día de cobro"` muestra `01` |
| 12 | Ingresar `<MES_SIGUIENTE>` en `"Mes de inicio"` (`subscription-form-start-period`) | `"Mes de inicio"` muestra `<MES_SIGUIENTE>` |
| 13 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada"` y en `"Datos"` la fila `"Día de cobro"` muestra `"1"` |

**Post-condición:** La suscripción queda guardada con Día de cobro `"1"` (`I13`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-006 — Dar de alta una suscripción con Día de cobro en el límite superior `"31"` se acepta

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-4 · FR-15 · R4 |
| Invariante | I13 |
| Técnica · Tipo | Análisis de valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-006-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"YouTube Premium"`. D 4: Monto `"3800"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"31"`. D 8: Mes de inicio `"<MES_SIGUIENTE>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en `"Email"` (`login-email`) y escribir `qa+cp-sus-006-001@example.com` | El campo muestra `qa+cp-sus-006-001@example.com` |
| 4 | Hacer click en `"Contraseña"` (`login-password`) y escribir `Clave123!` | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/new` | Se abre `"Nueva suscripción"` |
| 7 | Hacer click en `"Nombre"` (`subscription-form-name`) y escribir `YouTube Premium` | El campo muestra `YouTube Premium` |
| 8 | Hacer click en `"Monto"` (`subscription-form-amount`) y escribir `3800` | El campo muestra `3800` |
| 9 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 10 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 11 | Hacer click en `"Día de cobro"` (`subscription-form-billing-day`) y escribir `31` | El campo `"Día de cobro"` muestra `31` |
| 12 | Ingresar `<MES_SIGUIENTE>` en `"Mes de inicio"` (`subscription-form-start-period`) | `"Mes de inicio"` muestra `<MES_SIGUIENTE>` |
| 13 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada"` y en `"Datos"` la fila `"Día de cobro"` muestra `"31"` |

**Post-condición:** La suscripción queda guardada con Día de cobro `"31"` (`I13`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-007 — Dar de alta una suscripción con Mes de inicio en el límite inferior (`-24` meses) y Mes de fin igual al de inicio genera exactamente 1 ocurrencia

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-5 · US-53 · CA-14 · FR-15, FR-16 · R1 |
| Invariante | I12, I17 |
| Técnica · Tipo | Análisis de valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-007-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Max"`. D 4: Monto `"4500"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"10"`. D 8: Mes de inicio `"<MES_HACE_24>"` (ej. `"2024-10"` si `<HOY> = 06/10/2026`). D 9: Mes de fin `"<MES_HACE_24>"` (ej. `"2024-10"`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en `"Email"` (`login-email`) y escribir `qa+cp-sus-007-001@example.com` | El campo muestra `qa+cp-sus-007-001@example.com` |
| 4 | Hacer click en `"Contraseña"` (`login-password`) y escribir `Clave123!` | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/new` | Se abre `"Nueva suscripción"` |
| 7 | Hacer click en `"Nombre"` (`subscription-form-name`) y escribir `Max` | El campo muestra `Max` |
| 8 | Hacer click en `"Monto"` (`subscription-form-amount`) y escribir `4500` | El campo muestra `4500` |
| 9 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 10 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 11 | Hacer click en `"Día de cobro"` (`subscription-form-billing-day`) y escribir `10` | El campo muestra `10` |
| 12 | Ingresar `<MES_HACE_24>` (ej. `2024-10`) en `"Mes de inicio"` (`subscription-form-start-period`) | `"Mes de inicio"` muestra `<MES_HACE_24>` |
| 13 | Ingresar `<MES_HACE_24>` (ej. `2024-10`) en `"Mes de fin (opcional)"` (`subscription-form-end-period`) | `subscription-form-preview-summary` muestra `"Al guardar se carga 1 gasto de $4.500,00."` |
| 14 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada. Se cargó 1 gasto vencido."`, `"Próximo cobro"` muestra `"—"` y `"Gastos cargados"` contiene exactamente 1 fila para `<MES_HACE_24>` (`10/10/2024`, `"$4.500,00"`) |

**Post-condición:** La suscripción `"Max"` queda creada con 1 única ocurrencia en `<MES_HACE_24>` (`I12`, `I17`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-008 — Dar de alta una suscripción con Mes de inicio en el límite superior (`+12` meses) se acepta sin generar gastos

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-5 · US-53 · CA-13 · FR-15 · R1, R5 |
| Invariante | I12, I17 |
| Técnica · Tipo | Análisis de valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-008-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Prime Video"`. D 4: Monto `"3900"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"10"`. D 8: Mes de inicio `"<MES_MAS_12>"` (ej. `"2027-10"` si `<HOY> = 06/10/2026`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en `"Email"` (`login-email`) y escribir `qa+cp-sus-008-001@example.com` | El campo muestra `qa+cp-sus-008-001@example.com` |
| 4 | Hacer click en `"Contraseña"` (`login-password`) y escribir `Clave123!` | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/new` | Se abre `"Nueva suscripción"` |
| 7 | Hacer click en `"Nombre"` (`subscription-form-name`) y escribir `Prime Video` | El campo muestra `Prime Video` |
| 8 | Hacer click en `"Monto"` (`subscription-form-amount`) y escribir `3900` | El campo muestra `3900` |
| 9 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 10 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 11 | Hacer click en `"Día de cobro"` (`subscription-form-billing-day`) y escribir `10` | El campo muestra `10` |
| 12 | Ingresar `<MES_MAS_12>` (ej. `2027-10`) en `"Mes de inicio"` (`subscription-form-start-period`) | `subscription-form-preview-summary` muestra `"Al guardar no se carga ningún gasto."` |
| 13 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada"` y `"Desde"` muestra `"<mes +12>"` (ej. `"octubre 2027"`) |

**Post-condición:** La suscripción `"Prime Video"` queda activa con inicio en `<MES_MAS_12>` y 0 gastos cargados. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-009 — Dar de alta una suscripción con Mes de fin en el límite superior válido (`"2099-12"`) se acepta

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3 · FR-15 · ADR-032 |
| Invariante | I12 |
| Técnica · Tipo | Análisis de valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Baja · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-009-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Dominio Anual"`. D 4: Monto `"5000"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"10"`. D 8: Mes de inicio `"<MES_SIGUIENTE>"`. D 9: Mes de fin `"2099-12"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en `"Email"` (`login-email`) y escribir `qa+cp-sus-009-001@example.com` | El campo muestra `qa+cp-sus-009-001@example.com` |
| 4 | Hacer click en `"Contraseña"` (`login-password`) y escribir `Clave123!` | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/new` | Se abre `"Nueva suscripción"` |
| 7 | Hacer click en `"Nombre"` (`subscription-form-name`) y escribir `Dominio Anual` | El campo muestra `Dominio Anual` |
| 8 | Hacer click en `"Monto"` (`subscription-form-amount`) y escribir `5000` | El campo muestra `5000` |
| 9 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 10 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 11 | Hacer click en `"Día de cobro"` (`subscription-form-billing-day`) y escribir `10` | El campo muestra `10` |
| 12 | Ingresar `<MES_SIGUIENTE>` en `"Mes de inicio"` (`subscription-form-start-period`) | `"Mes de inicio"` muestra `<MES_SIGUIENTE>` |
| 13 | Ingresar `2099-12` en `"Mes de fin (opcional)"` (`subscription-form-end-period`) | `"Mes de fin (opcional)"` muestra `2099-12` |
| 14 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada"` y en `"Datos"` la fila `"Hasta"` muestra `"diciembre 2099"` |

**Post-condición:** La suscripción queda creada con `"Hasta"` en `"diciembre 2099"` (`I12`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-010 — Dar de alta una suscripción con Nombre de 60 caracteres se acepta y el campo no deja escribir el carácter 61

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-6 · FR-15 |
| Invariante | — |
| Técnica · Tipo | Análisis de valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-010-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Cadena de 61 caracteres `"SuscripcionMensualDeEntretenimientoFamiliarConPlanCompleto12X"` (los primeros 60 terminan en `"12"` y el 61 es `"X"`). D 4: Monto `"5000"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"10"`. D 8: Mes de inicio `"<MES_SIGUIENTE>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en `"Email"` (`login-email`) y escribir `qa+cp-sus-010-001@example.com` | El campo muestra `qa+cp-sus-010-001@example.com` |
| 4 | Hacer click en `"Contraseña"` (`login-password`) y escribir `Clave123!` | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/new` | Se abre `"Nueva suscripción"` |
| 7 | Hacer click en `"Nombre"` (`subscription-form-name`) y escribir `SuscripcionMensualDeEntretenimientoFamiliarConPlanCompleto12X` | El campo `"Nombre"` muestra únicamente los primeros 60 caracteres `SuscripcionMensualDeEntretenimientoFamiliarConPlanCompleto12` (sin la `"X"`) |
| 8 | Hacer click en `"Monto"` (`subscription-form-amount`) y escribir `5000` | El campo muestra `5000` |
| 9 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 10 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 11 | Hacer click en `"Día de cobro"` (`subscription-form-billing-day`) y escribir `10` | El campo muestra `10` |
| 12 | Ingresar `<MES_SIGUIENTE>` en `"Mes de inicio"` (`subscription-form-start-period`) | `"Mes de inicio"` muestra `<MES_SIGUIENTE>` |
| 13 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada"` y el título (`subscription-detail-name`) es `SuscripcionMensualDeEntretenimientoFamiliarConPlanCompleto12` |

**Post-condición:** La suscripción queda guardada con el nombre de 60 caracteres. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-011 — Dar de alta una suscripción con espacios en los bordes del Nombre (`"  Netflix  "`) la guarda como `"Netflix"`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-6 · FR-15 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Baja · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-011-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"  Netflix  "`. D 4: Monto `"5000"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"10"`. D 8: Mes de inicio `"<MES_SIGUIENTE>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en `"Email"` (`login-email`) y escribir `qa+cp-sus-011-001@example.com` | El campo muestra `qa+cp-sus-011-001@example.com` |
| 4 | Hacer click en `"Contraseña"` (`login-password`) y escribir `Clave123!` | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/new` | Se abre `"Nueva suscripción"` |
| 7 | Hacer click en `"Nombre"` (`subscription-form-name`) y escribir `"  Netflix  "` | El campo muestra `"  Netflix  "` |
| 8 | Hacer click en `"Monto"` (`subscription-form-amount`) y escribir `5000` | El campo muestra `5000` |
| 9 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 10 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 11 | Hacer click en `"Día de cobro"` (`subscription-form-billing-day`) y escribir `10` | El campo muestra `10` |
| 12 | Ingresar `<MES_SIGUIENTE>` en `"Mes de inicio"` (`subscription-form-start-period`) | `"Mes de inicio"` muestra `<MES_SIGUIENTE>` |
| 13 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | Navega a `/subscriptions/<SUB_ID>` y el encabezado (`subscription-detail-name`) muestra `"Netflix"` sin espacios en los bordes |

**Post-condición:** La suscripción queda guardada con nombre `"Netflix"`. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-012 — Dar de alta una suscripción con el mismo nombre que una suscripción cancelada se acepta

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-7 · US-58 · CA-7 · FR-15, FR-17 |
| Invariante | I15 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`, y con PR-04 (pasos 1 y 2) se obtuvieron `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Entretenimiento"`. S 3: con PR-04 se creó una suscripción `"Netflix"` (`p_amount: "4000.00"`, `p_billing_day: 10`, `p_start_period: "<MES_SIGUIENTE>-01"`) y se la canceló con `POST <SUPABASE_URL>/rest/v1/rpc/cancel_subscription` (`{"p_subscription_id":"<SUB_CANCELLED_ID>"}`).

**Datos de prueba:** D 1: Email `qa+cp-sus-012-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Netflix"`. D 4: Monto `"6500"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"15"`. D 8: Mes de inicio `"<MES_SIGUIENTE>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en `"Email"` (`login-email`) y escribir `qa+cp-sus-012-001@example.com` | El campo muestra `qa+cp-sus-012-001@example.com` |
| 4 | Hacer click en `"Contraseña"` (`login-password`) y escribir `Clave123!` | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/new` | Se abre `"Nueva suscripción"` |
| 7 | Hacer click en `"Nombre"` (`subscription-form-name`) y escribir `Netflix` | El campo muestra `Netflix` |
| 8 | Hacer click en `"Monto"` (`subscription-form-amount`) y escribir `6500` | El campo muestra `6500` |
| 9 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 10 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 11 | Hacer click en `"Día de cobro"` (`subscription-form-billing-day`) y escribir `15` | El campo muestra `15` |
| 12 | Ingresar `<MES_SIGUIENTE>` en `"Mes de inicio"` (`subscription-form-start-period`) | `"Mes de inicio"` muestra `<MES_SIGUIENTE>` |
| 13 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | Navega a `/subscriptions/<NEW_SUB_ID>`, muestra `"Suscripción guardada"` y estado `"Activa"` (`data-status="active"`) con `"Monto"` `"$6.500,00"` |
| 14 | Hacer click en el botón atrás (`subscription-detail-back`) | En `/subscriptions` aparece `"Netflix"` (`$6.500,00`) bajo `"Activas"` y `"Netflix"` (`$4.000,00`) bajo `"Canceladas"` |

**Post-condición:** Coexisten la suscripción `"Netflix"` cancelada y la nueva `"Netflix"` activa (`I15`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-013 — Rechazar en UI el alta de suscripción con Nombre vacío o solo espacios

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3 · FR-15 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · CP-SUS-014 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-013-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"   "` (tres espacios). D 4: Monto `"5000"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"10"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en `"Email"` (`login-email`) y escribir `qa+cp-sus-013-001@example.com` | El campo muestra `qa+cp-sus-013-001@example.com` |
| 4 | Hacer click en `"Contraseña"` (`login-password`) y escribir `Clave123!` | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/new` | Se abre `"Nueva suscripción"` |
| 7 | Hacer click en `"Nombre"` (`subscription-form-name`) y escribir `"   "` | El campo muestra tres espacios |
| 8 | Hacer click en `"Monto"` (`subscription-form-amount`) y escribir `5000` | El campo muestra `5000` |
| 9 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 10 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 11 | Hacer click en `"Día de cobro"` (`subscription-form-billing-day`) y escribir `10` | El campo muestra `10` |
| 12 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | La URL sigue siendo `/subscriptions/new` y debajo de `"Nombre"` aparece `"Escribí un nombre"` (`role="alert"`) |

**Post-condición:** No se creó ninguna suscripción. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-014 — Rechazar en API `create_subscription` con Nombre vacío o solo espacios

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3, CA-8 · FR-15 · C6 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-SUS-013 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` de `"Efectivo"` y `<CATEGORY_ID>` de `"Entretenimiento"`.

**Datos de prueba:** D 1: Email `qa+cp-sus-014-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_name = "   "`. D 4: `p_amount = "5000.00"`. D 5: `p_currency = "ARS"`. D 6: `p_billing_day = 10`. D 7: `p_start_period = "<MES_ACTUAL>-01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"   ","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":10,"p_start_period":"<MES_ACTUAL>-01","p_end_period":null,"p_description":null}` | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "Escribí un nombre"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.subscriptions` existen 0 filas para el usuario. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-015 — Rechazar en API `create_subscription` con Nombre de 61 caracteres

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-6, CA-8 · FR-15 · C6 · ADR-032 |
| Invariante | — |
| Técnica · Tipo | Análisis de valores límite · Negativo |
| Canal · Caso par | API · — (en la UI el campo recorta a 60 caracteres, verificado en `CP-SUS-010`) |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-015-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_name = "SuscripcionMensualDeEntretenimientoFamiliarConPlanCompleto12X"` (61 caracteres). D 4: `p_amount = "5000.00"`. D 5: `p_currency = "ARS"`. D 6: `p_billing_day = 10`. D 7: `p_start_period = "<MES_ACTUAL>-01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"SuscripcionMensualDeEntretenimientoFamiliarConPlanCompleto12X","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":10,"p_start_period":"<MES_ACTUAL>-01","p_end_period":null,"p_description":null}` | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "El nombre admite hasta 60 caracteres"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.subscriptions` existen 0 filas para el usuario. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-016 — Rechazar en UI el alta de suscripción con Nombre igual al de otra activa sin distinguir mayúsculas ni espacios (`" netflix "`)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3, CA-7 · FR-15 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · CP-SUS-017 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`, y con PR-04 (pasos 1 y 2) se obtuvieron `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 3: con PR-04 se creó una suscripción activa con `D 3` (`POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con `p_name: "Netflix"`, `p_amount: "5000.00"`, `p_currency: "ARS"`, `p_category_id: "<CATEGORY_ID>"`, `p_account_id: "<ACCOUNT_ID>"`, `p_billing_day: 10`, `p_start_period: "<MES_SIGUIENTE>-01"`).

**Datos de prueba:** D 1: Email `qa+cp-sus-016-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre existente `"Netflix"`. D 4: Nombre nuevo `" netflix "`. D 5: Monto `"6000"`. D 6: Categoría `"Entretenimiento"`. D 7: Medio de pago `"Efectivo"`. D 8: Día de cobro `"15"`. D 9: Mes de inicio `"<MES_SIGUIENTE>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en `"Email"` (`login-email`) y escribir `qa+cp-sus-016-001@example.com` | El campo muestra `qa+cp-sus-016-001@example.com` |
| 4 | Hacer click en `"Contraseña"` (`login-password`) y escribir `Clave123!` | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/new` | Se abre `"Nueva suscripción"` |
| 7 | Hacer click en `"Nombre"` (`subscription-form-name`) y escribir `" netflix "` | El campo muestra `" netflix "` |
| 8 | Hacer click en `"Monto"` (`subscription-form-amount`) y escribir `6000` | El campo muestra `6000` |
| 9 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 10 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 11 | Hacer click en `"Día de cobro"` (`subscription-form-billing-day`) y escribir `15` | El campo muestra `15` |
| 12 | Ingresar `<MES_SIGUIENTE>` en `"Mes de inicio"` (`subscription-form-start-period`) | `"Mes de inicio"` muestra `<MES_SIGUIENTE>` |
| 13 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | La URL sigue siendo `/subscriptions/new` y debajo de `"Nombre"` aparece `"Ya tenés una suscripción con ese nombre"` |

**Post-condición:** No se creó una segunda suscripción `"Netflix"`. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-017 — Rechazar en API `create_subscription` con Nombre igual al de otra activa (`" netflix "`)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-7, CA-8 · FR-15 · C6 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-SUS-016 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`, y se creó una suscripción activa con `D 3` (`p_name: "Netflix"`, `p_amount: "5000.00"`).

**Datos de prueba:** D 1: Email `qa+cp-sus-017-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre existente `"Netflix"`. D 4: `p_name = " netflix "`. D 5: `p_amount = "6000.00"`. D 6: `p_currency = "ARS"`. D 7: `p_billing_day = 15`. D 8: `p_start_period = "<MES_SIGUIENTE>-01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":" netflix ","p_amount":"6000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":15,"p_start_period":"<MES_SIGUIENTE>-01","p_end_period":null,"p_description":null}` | Respuesta HTTP `409 Conflict` con `"code": "23505"` y `"message": "Ya tenés una suscripción con ese nombre"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?select=name,amount` | Respuesta HTTP `200 OK` con 1 única fila (`[{"name":"Netflix","amount":5000}]`) |

**Post-condición:** En `public.subscriptions` sigue existiendo 1 sola fila para el usuario. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-018 — Rechazar en UI el alta de suscripción con Nombre igual al de una suscripción pausada

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3, CA-7 · FR-15 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · CP-SUS-019 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`, y con PR-04 (pasos 1 y 2) se obtuvieron `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 3: con PR-04 se creó una suscripción `"Spotify"` (`<SUB_ID>`) y se la pausó con `POST <SUPABASE_URL>/rest/v1/rpc/pause_subscription` (`{"p_subscription_id":"<SUB_ID>"}`).

**Datos de prueba:** D 1: Email `qa+cp-sus-018-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Spotify"`. D 4: Monto `"4000"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"10"`. D 8: Mes de inicio `"<MES_SIGUIENTE>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en `"Email"` (`login-email`) y escribir `qa+cp-sus-018-001@example.com` | El campo muestra `qa+cp-sus-018-001@example.com` |
| 4 | Hacer click en `"Contraseña"` (`login-password`) y escribir `Clave123!` | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/new` | Se abre `"Nueva suscripción"` |
| 7 | Hacer click en `"Nombre"` (`subscription-form-name`) y escribir `Spotify` | El campo muestra `Spotify` |
| 8 | Hacer click en `"Monto"` (`subscription-form-amount`) y escribir `4000` | El campo muestra `4000` |
| 9 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 10 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 11 | Hacer click en `"Día de cobro"` (`subscription-form-billing-day`) y escribir `10` | El campo muestra `10` |
| 12 | Ingresar `<MES_SIGUIENTE>` en `"Mes de inicio"` (`subscription-form-start-period`) | `"Mes de inicio"` muestra `<MES_SIGUIENTE>` |
| 13 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | La URL sigue siendo `/subscriptions/new` y debajo de `"Nombre"` aparece `"Ya tenés una suscripción con ese nombre"` |

**Post-condición:** No se creó una segunda suscripción `"Spotify"`. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-019 — Rechazar en API `create_subscription` con Nombre igual al de una suscripción pausada

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-7, CA-8 · FR-15 · C6 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-SUS-018 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`, se creó `"Spotify"` (`<SUB_ID>`) y se pausó mediante `pause_subscription`.

**Datos de prueba:** D 1: Email `qa+cp-sus-019-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_name = "Spotify"`. D 4: `p_amount = "4000.00"`. D 5: `p_currency = "ARS"`. D 6: `p_billing_day = 10`. D 7: `p_start_period = "<MES_SIGUIENTE>-01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Spotify","p_amount":"4000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":10,"p_start_period":"<MES_SIGUIENTE>-01","p_end_period":null,"p_description":null}` | Respuesta HTTP `409 Conflict` con `"code": "23505"` y `"message": "Ya tenés una suscripción con ese nombre"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?select=name,status` | Respuesta HTTP `200 OK` con 1 única fila (`[{"name":"Spotify","status":"paused"}]`) |

**Post-condición:** En `public.subscriptions` sigue existiendo 1 sola fila para el usuario. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-020 — Rechazar en UI el alta de suscripción con Monto vacío

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3 · FR-15 |
| Invariante | I4 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · CP-SUS-021 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-020-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Netflix"`. D 4: Monto vacío (`""`). D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"10"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en `"Email"` (`login-email`) y escribir `qa+cp-sus-020-001@example.com` | El campo muestra `qa+cp-sus-020-001@example.com` |
| 4 | Hacer click en `"Contraseña"` (`login-password`) y escribir `Clave123!` | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/new` | Se abre `"Nueva suscripción"` |
| 7 | Hacer click en `"Nombre"` (`subscription-form-name`) y escribir `Netflix` | El campo muestra `Netflix` |
| 8 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 9 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 10 | Hacer click en `"Día de cobro"` (`subscription-form-billing-day`) y escribir `10` | El campo muestra `10` y `"Monto"` queda vacío |
| 11 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | La URL sigue siendo `/subscriptions/new` y debajo de `"Monto"` aparece `"El monto debe ser mayor a cero"` |

**Post-condición:** No se creó ninguna suscripción (`I4`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-021 — Rechazar en API `create_subscription` con `p_amount = null`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3, CA-8 · FR-15 · C6 |
| Invariante | I4 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-SUS-020 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-021-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_name = "Netflix"`. D 4: `p_amount = null`. D 5: `p_currency = "ARS"`. D 6: `p_billing_day = 10`. D 7: `p_start_period = "<MES_ACTUAL>-01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":null,"p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":10,"p_start_period":"<MES_ACTUAL>-01","p_end_period":null,"p_description":null}` | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "El monto debe ser mayor a cero"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.subscriptions` existen 0 filas para el usuario (`I4`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-022 — Rechazar en UI el alta de suscripción con Monto igual a `"0"`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3 · FR-15 |
| Invariante | I4 |
| Técnica · Tipo | Análisis de valores límite · Negativo |
| Canal · Caso par | UI · CP-SUS-023 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-022-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Netflix"`. D 4: Monto `"0"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"10"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en `"Email"` (`login-email`) y escribir `qa+cp-sus-022-001@example.com` | El campo muestra `qa+cp-sus-022-001@example.com` |
| 4 | Hacer click en `"Contraseña"` (`login-password`) y escribir `Clave123!` | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/new` | Se abre `"Nueva suscripción"` |
| 7 | Hacer click en `"Nombre"` (`subscription-form-name`) y escribir `Netflix` | El campo muestra `Netflix` |
| 8 | Hacer click en `"Monto"` (`subscription-form-amount`) y escribir `0` | El campo muestra `0` |
| 9 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 10 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 11 | Hacer click en `"Día de cobro"` (`subscription-form-billing-day`) y escribir `10` | El campo muestra `10` |
| 12 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | La URL sigue siendo `/subscriptions/new` y debajo de `"Monto"` aparece `"El monto debe ser mayor a cero"` |

**Post-condición:** No se creó ninguna suscripción (`I4`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-023 — Rechazar en API `create_subscription` con `p_amount = "0.00"`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3, CA-8 · FR-15 · C6 |
| Invariante | I4 |
| Técnica · Tipo | Análisis de valores límite · Negativo |
| Canal · Caso par | API · CP-SUS-022 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-023-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_name = "Netflix"`. D 4: `p_amount = "0.00"`. D 5: `p_currency = "ARS"`. D 6: `p_billing_day = 10`. D 7: `p_start_period = "<MES_ACTUAL>-01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"0.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":10,"p_start_period":"<MES_ACTUAL>-01","p_end_period":null,"p_description":null}` | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "El monto debe ser mayor a cero"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.subscriptions` existen 0 filas para el usuario (`I4`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-024 — Rechazar en UI el alta de suscripción con Monto negativo (`"-100"`)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3 · FR-15 |
| Invariante | I4 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · CP-SUS-025 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-024-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Netflix"`. D 4: Monto `"-100"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"10"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en `"Email"` (`login-email`) y escribir `qa+cp-sus-024-001@example.com` | El campo muestra `qa+cp-sus-024-001@example.com` |
| 4 | Hacer click en `"Contraseña"` (`login-password`) y escribir `Clave123!` | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/new` | Se abre `"Nueva suscripción"` |
| 7 | Hacer click en `"Nombre"` (`subscription-form-name`) y escribir `Netflix` | El campo muestra `Netflix` |
| 8 | Hacer click en `"Monto"` (`subscription-form-amount`) y escribir `-100` | El campo muestra `-100` |
| 9 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 10 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 11 | Hacer click en `"Día de cobro"` (`subscription-form-billing-day`) y escribir `10` | El campo muestra `10` |
| 12 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | La URL sigue siendo `/subscriptions/new` y debajo de `"Monto"` aparece `"El monto debe ser mayor a cero"` |

**Post-condición:** No se creó ninguna suscripción (`I4`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-025 — Rechazar en API `create_subscription` con Monto negativo (`p_amount = "-100.00"`)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3, CA-8 · FR-15 · C6 |
| Invariante | I4 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-SUS-024 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-025-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_name = "Netflix"`. D 4: `p_amount = "-100.00"`. D 5: `p_currency = "ARS"`. D 6: `p_billing_day = 10`. D 7: `p_start_period = "<MES_ACTUAL>-01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"-100.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":10,"p_start_period":"<MES_ACTUAL>-01","p_end_period":null,"p_description":null}` | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "El monto debe ser mayor a cero"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.subscriptions` existen 0 filas para el usuario (`I4`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-026 — Rechazar en UI el alta de suscripción con Monto de más de 2 decimales (`"100,123"`)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3 · FR-15 |
| Invariante | — |
| Técnica · Tipo | Análisis de valores límite · Negativo |
| Canal · Caso par | UI · CP-SUS-027 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-026-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Netflix"`. D 4: Monto `"100,123"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"10"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en `"Email"` (`login-email`) y escribir `qa+cp-sus-026-001@example.com` | El campo muestra `qa+cp-sus-026-001@example.com` |
| 4 | Hacer click en `"Contraseña"` (`login-password`) y escribir `Clave123!` | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/new` | Se abre `"Nueva suscripción"` |
| 7 | Hacer click en `"Nombre"` (`subscription-form-name`) y escribir `Netflix` | El campo muestra `Netflix` |
| 8 | Hacer click en `"Monto"` (`subscription-form-amount`) y escribir `100,123` | El campo muestra `100,123` |
| 9 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 10 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 11 | Hacer click en `"Día de cobro"` (`subscription-form-billing-day`) y escribir `10` | El campo muestra `10` |
| 12 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | La URL sigue siendo `/subscriptions/new` y debajo de `"Monto"` aparece `"El monto admite hasta 2 decimales"` |

**Post-condición:** No se creó ninguna suscripción. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-027 — Rechazar en API `create_subscription` con Monto de más de 2 decimales (`"100.123"`)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3, CA-8 · FR-15 · C6 |
| Invariante | — |
| Técnica · Tipo | Análisis de valores límite · Negativo |
| Canal · Caso par | API · CP-SUS-026 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-027-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_name = "Netflix"`. D 4: `p_amount = "100.123"`. D 5: `p_currency = "ARS"`. D 6: `p_billing_day = 10`. D 7: `p_start_period = "<MES_ACTUAL>-01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"100.123","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":10,"p_start_period":"<MES_ACTUAL>-01","p_end_period":null,"p_description":null}` | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "El monto admite hasta 2 decimales"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.subscriptions` existen 0 filas para el usuario. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-028 — Rechazar en UI el alta de suscripción en ARS con Monto mayor al máximo (`"1000000000000"`)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3 · FR-15 |
| Invariante | — |
| Técnica · Tipo | Análisis de valores límite · Negativo |
| Canal · Caso par | UI · CP-SUS-029 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-028-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Netflix"`. D 4: Monto `"1000000000000"`. D 5: Moneda `"ARS"`. D 6: Categoría `"Entretenimiento"`. D 7: Medio de pago `"Efectivo"`. D 8: Día de cobro `"10"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en `"Email"` (`login-email`) y escribir `qa+cp-sus-028-001@example.com` | El campo muestra `qa+cp-sus-028-001@example.com` |
| 4 | Hacer click en `"Contraseña"` (`login-password`) y escribir `Clave123!` | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/new` | Se abre `"Nueva suscripción"` con Moneda `"ARS"` seleccionada |
| 7 | Hacer click en `"Nombre"` (`subscription-form-name`) y escribir `Netflix` | El campo muestra `Netflix` |
| 8 | Hacer click en `"Monto"` (`subscription-form-amount`) y escribir `1000000000000` | El campo muestra `1000000000000` |
| 9 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 10 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 11 | Hacer click en `"Día de cobro"` (`subscription-form-billing-day`) y escribir `10` | El campo muestra `10` |
| 12 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | La URL sigue siendo `/subscriptions/new` y debajo de `"Monto"` aparece `"El monto máximo es $999.999.999.999,99"` |

**Post-condición:** No se creó ninguna suscripción. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-029 — Rechazar en API `create_subscription` en ARS con Monto mayor al máximo (`"1000000000000.00"`)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3, CA-8 · FR-15 · C6 |
| Invariante | — |
| Técnica · Tipo | Análisis de valores límite · Negativo |
| Canal · Caso par | API · CP-SUS-028 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-029-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_name = "Netflix"`. D 4: `p_amount = "1000000000000.00"`. D 5: `p_currency = "ARS"`. D 6: `p_billing_day = 10`. D 7: `p_start_period = "<MES_ACTUAL>-01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"1000000000000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":10,"p_start_period":"<MES_ACTUAL>-01","p_end_period":null,"p_description":null}` | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "El monto máximo es $999.999.999.999,99"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.subscriptions` existen 0 filas para el usuario. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-030 — Rechazar en UI el alta de suscripción en USD con Monto mayor al máximo (`"1000000000000"`)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3 · FR-15 |
| Invariante | — |
| Técnica · Tipo | Análisis de valores límite · Negativo |
| Canal · Caso par | UI · CP-SUS-031 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-030-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Netflix USD"`. D 4: Monto `"1000000000000"`. D 5: Moneda `"USD"`. D 6: Categoría `"Entretenimiento"`. D 7: Medio de pago `"Efectivo"`. D 8: Día de cobro `"10"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en `"Email"` (`login-email`) y escribir `qa+cp-sus-030-001@example.com` | El campo muestra `qa+cp-sus-030-001@example.com` |
| 4 | Hacer click en `"Contraseña"` (`login-password`) y escribir `Clave123!` | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/new` | Se abre `"Nueva suscripción"` |
| 7 | Hacer click en `"USD"` en el control `"Moneda"` (`subscription-form-currency-usd`) | Queda seleccionada la moneda `"USD"` |
| 8 | Hacer click en `"Nombre"` (`subscription-form-name`) y escribir `Netflix USD` | El campo muestra `Netflix USD` |
| 9 | Hacer click en `"Monto"` (`subscription-form-amount`) y escribir `1000000000000` | El campo muestra `1000000000000` |
| 10 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 11 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 12 | Hacer click en `"Día de cobro"` (`subscription-form-billing-day`) y escribir `10` | El campo muestra `10` |
| 13 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | La URL sigue siendo `/subscriptions/new` y debajo de `"Monto"` aparece `"El monto máximo es USD 999.999.999.999,99"` |

**Post-condición:** No se creó ninguna suscripción. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-031 — Rechazar en API `create_subscription` en USD con Monto mayor al máximo (`"1000000000000.00"`)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3, CA-8 · FR-15 · C6 |
| Invariante | — |
| Técnica · Tipo | Análisis de valores límite · Negativo |
| Canal · Caso par | API · CP-SUS-030 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-031-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_name = "Netflix USD"`. D 4: `p_amount = "1000000000000.00"`. D 5: `p_currency = "USD"`. D 6: `p_billing_day = 10`. D 7: `p_start_period = "<MES_ACTUAL>-01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix USD","p_amount":"1000000000000.00","p_currency":"USD","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":10,"p_start_period":"<MES_ACTUAL>-01","p_end_period":null,"p_description":null}` | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "El monto máximo es USD 999.999.999.999,99"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.subscriptions` existen 0 filas para el usuario. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-032 — Rechazar en UI el alta de suscripción sin elegir Categoría

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3 · FR-15 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · CP-SUS-033 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-032-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Netflix"`. D 4: Monto `"5000"`. D 5: Categoría sin elegir (`""`). D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"10"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en `"Email"` (`login-email`) y escribir `qa+cp-sus-032-001@example.com` | El campo muestra `qa+cp-sus-032-001@example.com` |
| 4 | Hacer click en `"Contraseña"` (`login-password`) y escribir `Clave123!` | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/new` | Se abre `"Nueva suscripción"` |
| 7 | Hacer click en `"Nombre"` (`subscription-form-name`) y escribir `Netflix` | El campo muestra `Netflix` |
| 8 | Hacer click en `"Monto"` (`subscription-form-amount`) y escribir `5000` | El campo muestra `5000` |
| 9 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` y `"Categoría"` queda en `"Elegí…"` |
| 10 | Hacer click en `"Día de cobro"` (`subscription-form-billing-day`) y escribir `10` | El campo muestra `10` |
| 11 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | La URL sigue siendo `/subscriptions/new` y debajo de `"Categoría"` aparece `"Elegí una categoría"` |

**Post-condición:** No se creó ninguna suscripción. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-033 — Rechazar en API `create_subscription` con `p_category_id = null`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3, CA-8 · FR-15 · C6 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-SUS-032 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ACCESS_TOKEN>` y `<ACCOUNT_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-033-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_name = "Netflix"`. D 4: `p_amount = "5000.00"`. D 5: `p_category_id = null`. D 6: `p_billing_day = 10`. D 7: `p_start_period = "<MES_ACTUAL>-01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":null,"p_account_id":"<ACCOUNT_ID>","p_billing_day":10,"p_start_period":"<MES_ACTUAL>-01","p_end_period":null,"p_description":null}` | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "Elegí una categoría"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.subscriptions` existen 0 filas para el usuario. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-034 — Rechazar en UI el alta de suscripción sin elegir Medio de pago

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3 · FR-15 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · CP-SUS-035 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-034-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Netflix"`. D 4: Monto `"5000"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago sin elegir (`""`). D 7: Día de cobro `"10"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en `"Email"` (`login-email`) y escribir `qa+cp-sus-034-001@example.com` | El campo muestra `qa+cp-sus-034-001@example.com` |
| 4 | Hacer click en `"Contraseña"` (`login-password`) y escribir `Clave123!` | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/new` | Se abre `"Nueva suscripción"` |
| 7 | Hacer click en `"Nombre"` (`subscription-form-name`) y escribir `Netflix` | El campo muestra `Netflix` |
| 8 | Hacer click en `"Monto"` (`subscription-form-amount`) y escribir `5000` | El campo muestra `5000` |
| 9 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` y `"Medio de pago"` queda en `"Elegí…"` |
| 10 | Hacer click en `"Día de cobro"` (`subscription-form-billing-day`) y escribir `10` | El campo muestra `10` |
| 11 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | La URL sigue siendo `/subscriptions/new` y debajo de `"Medio de pago"` aparece `"Elegí un medio de pago"` |

**Post-condición:** No se creó ninguna suscripción. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-035 — Rechazar en API `create_subscription` con `p_account_id = null`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3, CA-8 · FR-15 · C6 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-SUS-034 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ACCESS_TOKEN>` y `<CATEGORY_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-035-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_name = "Netflix"`. D 4: `p_amount = "5000.00"`. D 5: `p_account_id = null`. D 6: `p_billing_day = 10`. D 7: `p_start_period = "<MES_ACTUAL>-01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":null,"p_billing_day":10,"p_start_period":"<MES_ACTUAL>-01","p_end_period":null,"p_description":null}` | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "Elegí un medio de pago"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.subscriptions` existen 0 filas para el usuario. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-036 — Rechazar en UI el alta de suscripción con Día de cobro vacío

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3, CA-4 · FR-15 |
| Invariante | I13 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · CP-SUS-037 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-036-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Netflix"`. D 4: Monto `"5000"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro vacío (`""`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en `"Email"` (`login-email`) y escribir `qa+cp-sus-036-001@example.com` | El campo muestra `qa+cp-sus-036-001@example.com` |
| 4 | Hacer click en `"Contraseña"` (`login-password`) y escribir `Clave123!` | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/new` | Se abre `"Nueva suscripción"` |
| 7 | Hacer click en `"Nombre"` (`subscription-form-name`) y escribir `Netflix` | El campo muestra `Netflix` |
| 8 | Hacer click en `"Monto"` (`subscription-form-amount`) y escribir `5000` | El campo muestra `5000` |
| 9 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 10 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` y `"Día de cobro"` queda vacío |
| 11 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | La URL sigue siendo `/subscriptions/new` y debajo de `"Día de cobro"` aparece `"Indicá el día de cobro"` |

**Post-condición:** No se creó ninguna suscripción (`I13`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-037 — Rechazar en API `create_subscription` con `p_billing_day = null`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-4, CA-8 · FR-15 · C6 |
| Invariante | I13 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-SUS-036 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-037-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_name = "Netflix"`. D 4: `p_amount = "5000.00"`. D 5: `p_billing_day = null`. D 6: `p_start_period = "<MES_ACTUAL>-01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":null,"p_start_period":"<MES_ACTUAL>-01","p_end_period":null,"p_description":null}` | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "Indicá el día de cobro"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.subscriptions` existen 0 filas para el usuario (`I13`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-038 — Rechazar en UI el alta de suscripción con Día de cobro `"0"`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3, CA-4 · FR-15 |
| Invariante | I13 |
| Técnica · Tipo | Análisis de valores límite · Negativo |
| Canal · Caso par | UI · CP-SUS-039 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-038-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Netflix"`. D 4: Monto `"5000"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"0"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en `"Email"` (`login-email`) y escribir `qa+cp-sus-038-001@example.com` | El campo muestra `qa+cp-sus-038-001@example.com` |
| 4 | Hacer click en `"Contraseña"` (`login-password`) y escribir `Clave123!` | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/new` | Se abre `"Nueva suscripción"` |
| 7 | Hacer click en `"Nombre"` (`subscription-form-name`) y escribir `Netflix` | El campo muestra `Netflix` |
| 8 | Hacer click en `"Monto"` (`subscription-form-amount`) y escribir `5000` | El campo muestra `5000` |
| 9 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 10 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 11 | Hacer click en `"Día de cobro"` (`subscription-form-billing-day`) y escribir `0` | El campo muestra `0` |
| 12 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | La URL sigue siendo `/subscriptions/new` y debajo de `"Día de cobro"` aparece `"El día de cobro va de 1 a 31"` |

**Post-condición:** No se creó ninguna suscripción (`I13`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-039 — Rechazar en API `create_subscription` con `p_billing_day = 0`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-4, CA-8 · FR-15 · C6 |
| Invariante | I13 |
| Técnica · Tipo | Análisis de valores límite · Negativo |
| Canal · Caso par | API · CP-SUS-038 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-039-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_name = "Netflix"`. D 4: `p_amount = "5000.00"`. D 5: `p_billing_day = 0`. D 6: `p_start_period = "<MES_ACTUAL>-01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":0,"p_start_period":"<MES_ACTUAL>-01","p_end_period":null,"p_description":null}` | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "El día de cobro va de 1 a 31"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.subscriptions` existen 0 filas para el usuario (`I13`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-040 — Rechazar en UI el alta de suscripción con Día de cobro `"32"`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3, CA-4 · FR-15 |
| Invariante | I13 |
| Técnica · Tipo | Análisis de valores límite · Negativo |
| Canal · Caso par | UI · CP-SUS-041 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-040-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Netflix"`. D 4: Monto `"5000"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"32"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en `"Email"` (`login-email`) y escribir `qa+cp-sus-040-001@example.com` | El campo muestra `qa+cp-sus-040-001@example.com` |
| 4 | Hacer click en `"Contraseña"` (`login-password`) y escribir `Clave123!` | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/new` | Se abre `"Nueva suscripción"` |
| 7 | Hacer click en `"Nombre"` (`subscription-form-name`) y escribir `Netflix` | El campo muestra `Netflix` |
| 8 | Hacer click en `"Monto"` (`subscription-form-amount`) y escribir `5000` | El campo muestra `5000` |
| 9 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 10 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 11 | Hacer click en `"Día de cobro"` (`subscription-form-billing-day`) y escribir `32` | El campo muestra `32` |
| 12 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | La URL sigue siendo `/subscriptions/new` y debajo de `"Día de cobro"` aparece `"El día de cobro va de 1 a 31"` |

**Post-condición:** No se creó ninguna suscripción (`I13`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-041 — Rechazar en API `create_subscription` con `p_billing_day = 32`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-4, CA-8 · FR-15 · C6 |
| Invariante | I13 |
| Técnica · Tipo | Análisis de valores límite · Negativo |
| Canal · Caso par | API · CP-SUS-040 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-041-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_name = "Netflix"`. D 4: `p_amount = "5000.00"`. D 5: `p_billing_day = 32`. D 6: `p_start_period = "<MES_ACTUAL>-01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":32,"p_start_period":"<MES_ACTUAL>-01","p_end_period":null,"p_description":null}` | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "El día de cobro va de 1 a 31"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.subscriptions` existen 0 filas para el usuario (`I13`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-042 — Bloquear en UI la escritura de letras, coma y signo menos en Día de cobro

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-4 · FR-15 |
| Invariante | I13 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · CP-SUS-043 |
| Prioridad · Camino feliz · Automatizable | Baja · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-042-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Secuencia de entrada `"-1,5a"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en `"Email"` (`login-email`) y escribir `qa+cp-sus-042-001@example.com` | El campo muestra `qa+cp-sus-042-001@example.com` |
| 4 | Hacer click en `"Contraseña"` (`login-password`) y escribir `Clave123!` | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/new` | Se abre `"Nueva suscripción"` |
| 7 | Hacer click en el campo `"Día de cobro"` (`subscription-form-billing-day`) | El campo toma foco |
| 8 | Escribir `-1,5a` | El campo `"Día de cobro"` ignora `-`, `,` y `a` y muestra únicamente `15` |

**Post-condición:** El campo `"Día de cobro"` solo admitió dígitos (`"15"`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-043 — Rechazar en API `create_subscription` con Día de cobro no entero (`p_billing_day = 1.5`)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-4, CA-8 · FR-15 · C6 |
| Invariante | I13 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-SUS-042 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-043-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_name = "Netflix"`. D 4: `p_amount = "5000.00"`. D 5: `p_billing_day = 1.5`. D 6: `p_start_period = "<MES_ACTUAL>-01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":1.5,"p_start_period":"<MES_ACTUAL>-01","p_end_period":null,"p_description":null}` | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "El día de cobro va de 1 a 31"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.subscriptions` existen 0 filas para el usuario (`I13`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-044 — Rechazar en UI el alta de suscripción con Mes de inicio vacío

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3 · FR-15 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · CP-SUS-045 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-044-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Netflix"`. D 4: Monto `"5000"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"10"`. D 8: Mes de inicio vacío (`""`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en `"Email"` (`login-email`) y escribir `qa+cp-sus-044-001@example.com` | El campo muestra `qa+cp-sus-044-001@example.com` |
| 4 | Hacer click en `"Contraseña"` (`login-password`) y escribir `Clave123!` | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/new` | Se abre `"Nueva suscripción"` |
| 7 | Hacer click en `"Nombre"` (`subscription-form-name`) y escribir `Netflix` | El campo muestra `Netflix` |
| 8 | Hacer click en `"Monto"` (`subscription-form-amount`) y escribir `5000` | El campo muestra `5000` |
| 9 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 10 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 11 | Hacer click en `"Día de cobro"` (`subscription-form-billing-day`) y escribir `10` | El campo muestra `10` |
| 12 | Borrar el valor de `"Mes de inicio"` (`subscription-form-start-period`) | `"Mes de inicio"` queda vacío |
| 13 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | La URL sigue siendo `/subscriptions/new` y debajo de `"Mes de inicio"` aparece `"Elegí el mes de inicio"` |

**Post-condición:** No se creó ninguna suscripción. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-045 — Rechazar en API `create_subscription` con `p_start_period = null`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3, CA-8 · FR-15 · C6 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-SUS-044 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-045-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_name = "Netflix"`. D 4: `p_amount = "5000.00"`. D 5: `p_billing_day = 10`. D 6: `p_start_period = null`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":10,"p_start_period":null,"p_end_period":null,"p_description":null}` | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "Elegí el mes de inicio"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.subscriptions` existen 0 filas para el usuario. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-046 — Rechazar en UI el alta de suscripción con Mes de inicio anterior al límite inferior (`-25` meses)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3, CA-5 · FR-15 · ADR-032 |
| Invariante | — |
| Técnica · Tipo | Análisis de valores límite · Negativo |
| Canal · Caso par | UI · CP-SUS-047 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-046-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Netflix"`. D 4: Monto `"5000"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"10"`. D 8: Mes de inicio `"<MES_HACE_25>"` (ej. `"2024-09"` si `<HOY> = 06/10/2026`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en `"Email"` (`login-email`) y escribir `qa+cp-sus-046-001@example.com` | El campo muestra `qa+cp-sus-046-001@example.com` |
| 4 | Hacer click en `"Contraseña"` (`login-password`) y escribir `Clave123!` | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/new` | Se abre `"Nueva suscripción"` |
| 7 | Hacer click en `"Nombre"` (`subscription-form-name`) y escribir `Netflix` | El campo muestra `Netflix` |
| 8 | Hacer click en `"Monto"` (`subscription-form-amount`) y escribir `5000` | El campo muestra `5000` |
| 9 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 10 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 11 | Hacer click en `"Día de cobro"` (`subscription-form-billing-day`) y escribir `10` | El campo muestra `10` |
| 12 | Ingresar `<MES_HACE_25>` (ej. `2024-09`) en `"Mes de inicio"` (`subscription-form-start-period`) | `"Mes de inicio"` muestra `<MES_HACE_25>` |
| 13 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | La URL sigue siendo `/subscriptions/new` y debajo de `"Mes de inicio"` aparece `"El mes de inicio va de <mes hace 24> a <mes +12>"` (ej. `"El mes de inicio va de octubre 2024 a octubre 2027"`) |

**Post-condición:** No se creó ninguna suscripción. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-047 — Rechazar en API `create_subscription` con Mes de inicio anterior al límite inferior (`-25` meses)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-5, CA-8 · FR-15 · C6 · ADR-032 |
| Invariante | — |
| Técnica · Tipo | Análisis de valores límite · Negativo |
| Canal · Caso par | API · CP-SUS-046 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-047-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_name = "Netflix"`. D 4: `p_amount = "5000.00"`. D 5: `p_billing_day = 10`. D 6: `p_start_period = "<MES_HACE_25>-01"` (ej. `"2024-09-01"`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":10,"p_start_period":"<MES_HACE_25>-01","p_end_period":null,"p_description":null}` | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "El mes de inicio va de <mes hace 24> a <mes +12>"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.subscriptions` existen 0 filas para el usuario. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-048 — Rechazar en UI el alta de suscripción con Mes de inicio posterior al límite superior (`+13` meses)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3, CA-5 · FR-15 · ADR-032 |
| Invariante | — |
| Técnica · Tipo | Análisis de valores límite · Negativo |
| Canal · Caso par | UI · CP-SUS-049 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-048-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Netflix"`. D 4: Monto `"5000"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"10"`. D 8: Mes de inicio `"<MES_MAS_13>"` (ej. `"2027-11"` si `<HOY> = 06/10/2026`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en `"Email"` (`login-email`) y escribir `qa+cp-sus-048-001@example.com` | El campo muestra `qa+cp-sus-048-001@example.com` |
| 4 | Hacer click en `"Contraseña"` (`login-password`) y escribir `Clave123!` | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/new` | Se abre `"Nueva suscripción"` |
| 7 | Hacer click en `"Nombre"` (`subscription-form-name`) y escribir `Netflix` | El campo muestra `Netflix` |
| 8 | Hacer click en `"Monto"` (`subscription-form-amount`) y escribir `5000` | El campo muestra `5000` |
| 9 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 10 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 11 | Hacer click en `"Día de cobro"` (`subscription-form-billing-day`) y escribir `10` | El campo muestra `10` |
| 12 | Ingresar `<MES_MAS_13>` (ej. `2027-11`) en `"Mes de inicio"` (`subscription-form-start-period`) | `"Mes de inicio"` muestra `<MES_MAS_13>` |
| 13 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | La URL sigue siendo `/subscriptions/new` y debajo de `"Mes de inicio"` aparece `"El mes de inicio va de <mes hace 24> a <mes +12>"` |

**Post-condición:** No se creó ninguna suscripción. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-049 — Rechazar en API `create_subscription` con Mes de inicio posterior al límite superior (`+13` meses)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-5, CA-8 · FR-15 · C6 · ADR-032 |
| Invariante | — |
| Técnica · Tipo | Análisis de valores límite · Negativo |
| Canal · Caso par | API · CP-SUS-048 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-049-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_name = "Netflix"`. D 4: `p_amount = "5000.00"`. D 5: `p_billing_day = 10`. D 6: `p_start_period = "<MES_MAS_13>-01"` (ej. `"2027-11-01"`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":10,"p_start_period":"<MES_MAS_13>-01","p_end_period":null,"p_description":null}` | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "El mes de inicio va de <mes hace 24> a <mes +12>"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.subscriptions` existen 0 filas para el usuario. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-050 — Rechazar en UI el alta de suscripción con Mes de fin anterior al Mes de inicio

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3 · FR-15 |
| Invariante | I12 |
| Técnica · Tipo | Análisis de valores límite · Negativo |
| Canal · Caso par | UI · CP-SUS-051 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-050-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Netflix"`. D 4: Monto `"5000"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"10"`. D 8: Mes de inicio `"<MES_ACTUAL>"`. D 9: Mes de fin `"<MES_ANTERIOR>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en `"Email"` (`login-email`) y escribir `qa+cp-sus-050-001@example.com` | El campo muestra `qa+cp-sus-050-001@example.com` |
| 4 | Hacer click en `"Contraseña"` (`login-password`) y escribir `Clave123!` | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/new` | Se abre `"Nueva suscripción"` con `"Mes de inicio"` en `<MES_ACTUAL>` |
| 7 | Hacer click en `"Nombre"` (`subscription-form-name`) y escribir `Netflix` | El campo muestra `Netflix` |
| 8 | Hacer click en `"Monto"` (`subscription-form-amount`) y escribir `5000` | El campo muestra `5000` |
| 9 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 10 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 11 | Hacer click en `"Día de cobro"` (`subscription-form-billing-day`) y escribir `10` | El campo muestra `10` |
| 12 | Ingresar `<MES_ANTERIOR>` (ej. `2026-09`) en `"Mes de fin (opcional)"` (`subscription-form-end-period`) | `"Mes de fin (opcional)"` muestra `<MES_ANTERIOR>` |
| 13 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | La URL sigue siendo `/subscriptions/new` y debajo de `"Mes de fin (opcional)"` aparece `"El mes de fin no puede ser anterior al de inicio"` |

**Post-condición:** No se creó ninguna suscripción (`I12`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-051 — Rechazar en API `create_subscription` con `p_end_period < p_start_period`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3, CA-8 · FR-15 · C6 |
| Invariante | I12 |
| Técnica · Tipo | Análisis de valores límite · Negativo |
| Canal · Caso par | API · CP-SUS-050 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-051-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_name = "Netflix"`. D 4: `p_amount = "5000.00"`. D 5: `p_billing_day = 10`. D 6: `p_start_period = "<MES_ACTUAL>-01"`. D 7: `p_end_period = "<MES_ANTERIOR>-01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":10,"p_start_period":"<MES_ACTUAL>-01","p_end_period":"<MES_ANTERIOR>-01","p_description":null}` | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "El mes de fin no puede ser anterior al de inicio"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.subscriptions` existen 0 filas para el usuario (`I12`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-052 — Rechazar en UI el alta de suscripción con Mes de fin posterior a diciembre 2099 (`"2100-01"`)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3 · FR-15 · ADR-032 |
| Invariante | — |
| Técnica · Tipo | Análisis de valores límite · Negativo |
| Canal · Caso par | UI · CP-SUS-053 |
| Prioridad · Camino feliz · Automatizable | Baja · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-052-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Netflix"`. D 4: Monto `"5000"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"10"`. D 8: Mes de fin `"2100-01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en `"Email"` (`login-email`) y escribir `qa+cp-sus-052-001@example.com` | El campo muestra `qa+cp-sus-052-001@example.com` |
| 4 | Hacer click en `"Contraseña"` (`login-password`) y escribir `Clave123!` | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/new` | Se abre `"Nueva suscripción"` |
| 7 | Hacer click en `"Nombre"` (`subscription-form-name`) y escribir `Netflix` | El campo muestra `Netflix` |
| 8 | Hacer click en `"Monto"` (`subscription-form-amount`) y escribir `5000` | El campo muestra `5000` |
| 9 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 10 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 11 | Hacer click en `"Día de cobro"` (`subscription-form-billing-day`) y escribir `10` | El campo muestra `10` |
| 12 | Ingresar `2100-01` en `"Mes de fin (opcional)"` (`subscription-form-end-period`) | `"Mes de fin (opcional)"` muestra `2100-01` |
| 13 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | La URL sigue siendo `/subscriptions/new` y debajo de `"Mes de fin (opcional)"` aparece `"El mes de fin puede ser como máximo diciembre 2099"` |

**Post-condición:** No se creó ninguna suscripción. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-053 — Rechazar en API `create_subscription` con `p_end_period = "2100-01-01"`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3, CA-8 · FR-15 · C6 · ADR-032 |
| Invariante | — |
| Técnica · Tipo | Análisis de valores límite · Negativo |
| Canal · Caso par | API · CP-SUS-052 |
| Prioridad · Camino feliz · Automatizable | Baja · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-053-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_name = "Netflix"`. D 4: `p_amount = "5000.00"`. D 5: `p_billing_day = 10`. D 6: `p_start_period = "<MES_ACTUAL>-01"`. D 7: `p_end_period = "2100-01-01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":10,"p_start_period":"<MES_ACTUAL>-01","p_end_period":"2100-01-01","p_description":null}` | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "El mes de fin puede ser como máximo diciembre 2099"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.subscriptions` existen 0 filas para el usuario. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-054 — Dar de alta una suscripción con Descripción de 200 caracteres se acepta y la UI recorta el carácter 201

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3 · FR-15 · ADR-032 |
| Invariante | — |
| Técnica · Tipo | Análisis de valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Baja · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-054-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Netflix"`. D 4: Monto `"5000"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"10"`. D 8: Mes de inicio `"<MES_SIGUIENTE>"`. D 9: Cadena de 201 caracteres `"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaZ"` (200 letras `"a"` seguidas de `"Z"`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Hacer click en `"Email"` (`login-email`) y escribir `qa+cp-sus-054-001@example.com` | El campo muestra `qa+cp-sus-054-001@example.com` |
| 4 | Hacer click en `"Contraseña"` (`login-password`) y escribir `Clave123!` | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/new` | Se abre `"Nueva suscripción"` |
| 7 | Hacer click en `"Nombre"` (`subscription-form-name`) y escribir `Netflix` | El campo muestra `Netflix` |
| 8 | Hacer click en `"Monto"` (`subscription-form-amount`) y escribir `5000` | El campo muestra `5000` |
| 9 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 10 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 11 | Hacer click en `"Día de cobro"` (`subscription-form-billing-day`) y escribir `10` | El campo muestra `10` |
| 12 | Ingresar `<MES_SIGUIENTE>` en `"Mes de inicio"` (`subscription-form-start-period`) | `"Mes de inicio"` muestra `<MES_SIGUIENTE>` |
| 13 | Hacer click en `"Descripción (opcional)"` (`subscription-form-description`) y pegar `D 9` | El campo conserva únicamente las 200 letras `"a"` (sin la `"Z"`) y el contador inferior indica `200/200` |
| 14 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | Navega a `/subscriptions/<SUB_ID>` y muestra `"Suscripción guardada"` |

**Post-condición:** La suscripción queda guardada con la descripción de 200 caracteres. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-055 — Rechazar en API `create_subscription` con Descripción de 201 caracteres

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3, CA-8 · FR-15 · C6 · ADR-032 |
| Invariante | — |
| Técnica · Tipo | Análisis de valores límite · Negativo |
| Canal · Caso par | API · — (en la UI el campo recorta a 200 caracteres, verificado en `CP-SUS-054`) |
| Prioridad · Camino feliz · Automatizable | Baja · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-055-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_name = "Netflix"`. D 4: `p_amount = "5000.00"`. D 5: `p_billing_day = 10`. D 6: `p_start_period = "<MES_ACTUAL>-01"`. D 7: `p_description = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaZ"` (201 caracteres).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":10,"p_start_period":"<MES_ACTUAL>-01","p_end_period":null,"p_description":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaZ"}` | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "La descripción admite hasta 200 caracteres"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.subscriptions` existen 0 filas para el usuario. El usuario queda como dato de prueba (email único, sin limpieza).
---

### CP-SUS-056 — Rechazar en API `create_subscription` con `p_category_id` propia archivada

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3, CA-8 · FR-15 · C6 · ADR-030 |
| Invariante | I8 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` (`"Efectivo"`) y `<CATEGORY_ID>` (`"Entretenimiento"`). S 3: se archivó `<CATEGORY_ID>` ejecutando con PR-04 `PATCH <SUPABASE_URL>/rest/v1/categories?id=eq.<CATEGORY_ID>` con body `{"archived_at":"2026-01-01T00:00:00Z"}` (HTTP `204`).

**Datos de prueba:** D 1: Email `qa+cp-sus-056-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_name = "Netflix"`. D 4: `p_amount = "5000.00"`. D 5: `p_currency = "ARS"`. D 6: `p_billing_day = 10`. D 7: `p_start_period = "<MES_ACTUAL>-01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":10,"p_start_period":"<MES_ACTUAL>-01","p_end_period":null,"p_description":null}` | Respuesta HTTP `409 Conflict` con `"code": "23503"` y `"message": "La categoría no está disponible"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.subscriptions` existen 0 filas para el usuario. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-057 — Rechazar en API `create_subscription` con `p_account_id` propia archivada

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3, CA-8 · FR-15 · C6 · ADR-030 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` (`"Efectivo"`) y `<CATEGORY_ID>` (`"Entretenimiento"`). S 3: se archivó `<ACCOUNT_ID>` ejecutando con PR-04 `PATCH <SUPABASE_URL>/rest/v1/accounts?id=eq.<ACCOUNT_ID>` con body `{"archived_at":"2026-01-01T00:00:00Z"}` (HTTP `204`).

**Datos de prueba:** D 1: Email `qa+cp-sus-057-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_name = "Netflix"`. D 4: `p_amount = "5000.00"`. D 5: `p_currency = "ARS"`. D 6: `p_billing_day = 10`. D 7: `p_start_period = "<MES_ACTUAL>-01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":10,"p_start_period":"<MES_ACTUAL>-01","p_end_period":null,"p_description":null}` | Respuesta HTTP `409 Conflict` con `"code": "23503"` y `"message": "El medio de pago no está disponible"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.subscriptions` existen 0 filas para el usuario. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-058 — Rechazar en API `create_subscription` usando `p_category_id` de otro usuario

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3, CA-8, CA-15 · FR-15 · C6, C7 · ADR-030 |
| Invariante | I8 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: con PR-05 se crearon Usuario A (`D 1`, `<ACCESS_TOKEN_A>`, `<ACCOUNT_ID_A>`) y Usuario B (`D 2`, `<ACCESS_TOKEN_B>`, `<CATEGORY_ID_B>`).

**Datos de prueba:** D 1: Email A `qa+cp-sus-058-001@example.com` / Contraseña `Clave123!`. D 2: Email B `qa+cp-sus-058-002@example.com` / Contraseña `Clave123!`. D 3: `p_name = "Netflix"`. D 4: `p_amount = "5000.00"`. D 5: `p_billing_day = 10`. D 6: `p_start_period = "<MES_ACTUAL>-01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 usando `<ACCESS_TOKEN_A>` `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID_B>","p_account_id":"<ACCOUNT_ID_A>","p_billing_day":10,"p_start_period":"<MES_ACTUAL>-01","p_end_period":null,"p_description":null}` | Respuesta HTTP `409 Conflict` con `"code": "23503"` y `"message": "La categoría no está disponible"` |
| 2 | Ejecutar con PR-08 usando `<ACCESS_TOKEN_A>` `GET <SUPABASE_URL>/rest/v1/subscriptions?select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.subscriptions` existen 0 filas para Usuario A y 0 filas para Usuario B. Los usuarios A y B quedan como datos de prueba (emails únicos, sin limpieza).

---

### CP-SUS-059 — Rechazar en API `create_subscription` usando `p_account_id` de otro usuario

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-3, CA-8, CA-15 · FR-15 · C6, C7 · ADR-030 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: con PR-05 se crearon Usuario A (`D 1`, `<ACCESS_TOKEN_A>`, `<CATEGORY_ID_A>`) y Usuario B (`D 2`, `<ACCESS_TOKEN_B>`, `<ACCOUNT_ID_B>`).

**Datos de prueba:** D 1: Email A `qa+cp-sus-059-001@example.com` / Contraseña `Clave123!`. D 2: Email B `qa+cp-sus-059-002@example.com` / Contraseña `Clave123!`. D 3: `p_name = "Netflix"`. D 4: `p_amount = "5000.00"`. D 5: `p_billing_day = 10`. D 6: `p_start_period = "<MES_ACTUAL>-01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 usando `<ACCESS_TOKEN_A>` `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID_A>","p_account_id":"<ACCOUNT_ID_B>","p_billing_day":10,"p_start_period":"<MES_ACTUAL>-01","p_end_period":null,"p_description":null}` | Respuesta HTTP `409 Conflict` con `"code": "23503"` y `"message": "El medio de pago no está disponible"` |
| 2 | Ejecutar con PR-08 usando `<ACCESS_TOKEN_A>` `GET <SUPABASE_URL>/rest/v1/subscriptions?select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.subscriptions` existen 0 filas para Usuario A y 0 filas para Usuario B. Los usuarios A y B quedan como datos de prueba (emails únicos, sin limpieza).

---

### CP-SUS-060 — Rechazar en API un `INSERT` directo sobre `/rest/v1/subscriptions` con la sesión del usuario

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-9 · FR-15 · C5, C7 · ADR-030 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<USER_ID>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-060-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `name = "Netflix"`. D 4: `amount = "5000.00"`. D 5: `currency = "ARS"`. D 6: `billing_day = 10`. D 7: `start_period = "<MES_ACTUAL>-01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/subscriptions` con body `{"user_id":"<USER_ID>","name":"Netflix","amount":"5000.00","currency":"ARS","billing_day":10,"account_id":"<ACCOUNT_ID>","category_id":"<CATEGORY_ID>","start_period":"<MES_ACTUAL>-01","generate_from_period":"<MES_ACTUAL>-01","status":"active"}` | Respuesta HTTP `403 Forbidden` con `"code": "42501"` (`permission denied for table subscriptions`) |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.subscriptions` existen 0 filas para el usuario. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-061 — Rechazar en API un `DELETE` directo sobre `/rest/v1/subscriptions` con la sesión del usuario

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-9 · FR-15 · C5, C7, C10 · ADR-030 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 3: se creó una suscripción ejecutando con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_start_period":"<MES_SIGUIENTE>-01","p_end_period":null,"p_description":null}`, guardando `subscription_id` como `<SUB_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-061-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `id = "<SUB_ID>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `DELETE <SUPABASE_URL>/rest/v1/subscriptions?id=eq.<SUB_ID>` | Respuesta HTTP `403 Forbidden` con `"code": "42501"` (`permission denied for table subscriptions`) |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?id=eq.<SUB_ID>&select=id,status` | Respuesta HTTP `200 OK` con 1 fila (`"id": "<SUB_ID>"`, `"status": "active"`) |

**Post-condición:** La suscripción `<SUB_ID>` permanece intacta en `public.subscriptions`. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-062 — Dos toques seguidos en `"Guardar suscripción"` deshabilitan el botón y crean una sola suscripción

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-10 · FR-15 |
| Invariante | I12 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-062-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Netflix"`. D 4: Monto `"5000"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"28"`. D 8: Mes de inicio `"<MES_SIGUIENTE>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-062-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-062-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en `"Nueva"` (`subscriptions-new`) | Se abre `/subscriptions/new` |
| 8 | Escribir `Netflix` en `"Nombre"` (`subscription-form-name`) | El campo muestra `Netflix` |
| 9 | Escribir `5000` en `"Monto"` (`subscription-form-amount`) | El campo muestra `5000` |
| 10 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 11 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 12 | Escribir `28` en `"Día de cobro"` (`subscription-form-billing-day`) | El campo muestra `28` |
| 13 | Ingresar `<MES_SIGUIENTE>` en `"Mes de inicio"` (`subscription-form-start-period`) | `"Mes de inicio"` muestra `<MES_SIGUIENTE>` |
| 14 | Hacer doble click rápido sobre el botón `"Guardar suscripción"` (`subscription-form-submit`) | Tras el primer toque el botón queda deshabilitado (`disabled`) con el texto `"Guardando…"` y al completar navega a `/subscriptions/<SUB_ID>` mostrando el aviso `"Suscripción guardada"` (`subscription-toast`) |
| 15 | Hacer click en el botón atrás (`subscription-detail-back`) | Navega a `/subscriptions` y bajo `"Activas"` aparece una única fila `"Netflix"` (`subscriptions-item`) |

**Post-condición:** En `public.subscriptions` existe 1 sola fila con `name = 'Netflix'` para el usuario. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-063 — Rechazar en UI ver el detalle de una suscripción de otro usuario mostrando `subscription-detail-not-found`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-13, CA-14 · FR-15 · C7 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · CP-SUS-064 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: con PR-05 se crearon Usuario A (`D 1`) y Usuario B (`D 2`, `<ACCESS_TOKEN_B>`, `<ACCOUNT_ID_B>`, `<CATEGORY_ID_B>`). S 3: con PR-04 usando `<ACCESS_TOKEN_B>` se ejecutó `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix B","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID_B>","p_account_id":"<ACCOUNT_ID_B>","p_billing_day":28,"p_start_period":"<MES_SIGUIENTE>-01","p_end_period":null,"p_description":null}`, guardando `subscription_id` como `<SUB_ID_B>`.

**Datos de prueba:** D 1: Email A `qa+cp-sus-063-001@example.com` / Contraseña `Clave123!`. D 2: Email B `qa+cp-sus-063-002@example.com` / Contraseña `Clave123!`. D 3: URL `<APP>/subscriptions/<SUB_ID_B>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-063-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-063-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/<SUB_ID_B>` | Se muestra el estado `subscription-detail-not-found` con el texto `"No encontramos esta suscripción."` y el enlace `"Ver suscripciones"` (`subscription-detail-not-found-back`), sin exponer ningún dato de `"Netflix B"` |

**Post-condición:** Usuario A no accede a los datos de Usuario B. Los usuarios A y B quedan como datos de prueba (emails únicos, sin limpieza).

---

### CP-SUS-064 — Rechazar en API leer una suscripción de otro usuario (`GET /rest/v1/subscriptions` devuelve `[]`)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-13 · FR-15 · C7 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-SUS-063 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: con PR-05 se crearon Usuario A (`D 1`, `<ACCESS_TOKEN_A>`) y Usuario B (`D 2`, `<ACCESS_TOKEN_B>`, `<ACCOUNT_ID_B>`, `<CATEGORY_ID_B>`). S 2: con PR-04 usando `<ACCESS_TOKEN_B>` se creó una suscripción `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix B","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID_B>","p_account_id":"<ACCOUNT_ID_B>","p_billing_day":28,"p_start_period":"<MES_SIGUIENTE>-01","p_end_period":null,"p_description":null}`, guardando `subscription_id` como `<SUB_ID_B>`.

**Datos de prueba:** D 1: Email A `qa+cp-sus-064-001@example.com` / Contraseña `Clave123!`. D 2: Email B `qa+cp-sus-064-002@example.com` / Contraseña `Clave123!`. D 3: `id = "<SUB_ID_B>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-08 usando `Authorization: Bearer <ACCESS_TOKEN_A>` `GET <SUPABASE_URL>/rest/v1/subscriptions?id=eq.<SUB_ID_B>&select=*` | Respuesta HTTP `200 OK` con body `[]` (0 filas devueltas por RLS) |

**Post-condición:** La suscripción `<SUB_ID_B>` de Usuario B no es visible para Usuario A. Los usuarios A y B quedan como datos de prueba (emails únicos, sin limpieza).

---

### CP-SUS-065 — Rechazar en API `create_subscription` sin sesión autenticada (rol `anon`)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-13 · FR-15 · C7 · ADR-030 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-065-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Header `Authorization: Bearer <ANON_KEY>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con headers `apikey: <ANON_KEY>` y `Authorization: Bearer <ANON_KEY>` y body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":10,"p_start_period":"<MES_ACTUAL>-01","p_end_period":null,"p_description":null}` | Respuesta HTTP `403 Forbidden` con `"code": "42501"` (`permission denied for function create_subscription`) |

**Post-condición:** No se crea ninguna suscripción. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-066 — Rechazar en API `GET /rest/v1/subscriptions` sin sesión autenticada (rol `anon`)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-13 · FR-15 · C7 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: se obtuvo `<ANON_KEY>` con PR-04 (paso 1).

**Datos de prueba:** D 1: Header `Authorization: Bearer <ANON_KEY>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar `GET <SUPABASE_URL>/rest/v1/subscriptions?select=*` con headers `apikey: <ANON_KEY>` y `Authorization: Bearer <ANON_KEY>` | Respuesta HTTP `403 Forbidden` con `"code": "42501"` (`permission denied for table subscriptions`) |

**Post-condición:** No se expone ninguna fila de `public.subscriptions`. No requiere usuario.

---

### CP-SUS-067 — Mostrar estado vacío `subscriptions-empty` y ocultar la tarjeta del total comprometido cuando el usuario no tiene suscripciones

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-14 · US-63 (Pantalla) · FR-15 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Baja · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2` (con 0 suscripciones).

**Datos de prueba:** D 1: Email `qa+cp-sus-067-001@example.com`. D 2: Contraseña `Clave123!`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-067-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-067-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions`; se muestra `subscriptions-empty` con el texto `"Todavía no tenés suscripciones. Cargá lo que pagás todos los meses y se registra solo."` y el botón `"Agregar la primera"` (`subscriptions-empty-new`), y no se muestra la tarjeta `subscriptions-committed` |

**Post-condición:** El usuario sigue con 0 suscripciones. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-068 — Mostrar aviso `subscription-form-category-empty` y enlace `"Ir a Ajustes"` cuando el usuario no tiene categorías activas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-14 · FR-15 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Baja · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (paso 1) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>` y `<USER_ID>`. S 4: se archivaron todas las categorías del usuario ejecutando con PR-04 `PATCH <SUPABASE_URL>/rest/v1/categories?user_id=eq.<USER_ID>` con body `{"archived_at":"2026-01-01T00:00:00Z"}` (HTTP `204`).

**Datos de prueba:** D 1: Email `qa+cp-sus-068-001@example.com`. D 2: Contraseña `Clave123!`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-068-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-068-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en `"Nueva"` (`subscriptions-new`) | Se abre `/subscriptions/new`; se muestra `subscription-form-category-empty` con el texto `"No tenés categorías activas."` y el enlace `"Ir a Ajustes"` (`subscription-form-category-empty-settings`) que apunta a `/settings` |

**Post-condición:** En `public.subscriptions` existen 0 filas para el usuario. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-069 — Mostrar aviso `subscription-form-account-empty` y enlace `"Ir a Ajustes"` cuando el usuario no tiene medios de pago activos

| Campo | Contenido |
|---|---|
| Historia · criterio | US-52 · CA-14 · FR-15 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Baja · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (paso 1) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>` y `<USER_ID>`. S 4: se archivaron todas las cuentas del usuario ejecutando con PR-04 `PATCH <SUPABASE_URL>/rest/v1/accounts?user_id=eq.<USER_ID>` con body `{"archived_at":"2026-01-01T00:00:00Z"}` (HTTP `204`).

**Datos de prueba:** D 1: Email `qa+cp-sus-069-001@example.com`. D 2: Contraseña `Clave123!`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-069-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-069-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en `"Nueva"` (`subscriptions-new`) | Se abre `/subscriptions/new`; se muestra `subscription-form-account-empty` con el texto `"No tenés medios de pago activos."` y el enlace `"Ir a Ajustes"` (`subscription-form-account-empty-settings`) que apunta a `/settings` |

**Post-condición:** En `public.subscriptions` existen 0 filas para el usuario. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-070 — Puesta al día automática al entrar a la app genera 2 períodos vencidos pendientes y muestra el aviso `app-catchup-generated`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-53 · CA-1, CA-9 · FR-16 · R1, R4, R5, R6, R7 · C4, C5 · ADR-017, ADR-030, ADR-031 |
| Invariante | I1, I1', I2, I4, I5, I11, I14, I17 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` (`"Efectivo"`) y `<CATEGORY_ID>` (`"Entretenimiento"`). S 4: se creó una suscripción en `USD` aún sin tipos de cambio cargados para que quede con 0 transacciones generadas en `<MES_HACE_2>` y `<MES_ANTERIOR>`: se ejecutó con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Disney+","p_amount":"10.00","p_currency":"USD","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_start_period":"<MES_HACE_2>-01","p_end_period":null,"p_description":null}` (`"generated": 0`), guardando `subscription_id` como `<SUB_ID>`. S 5: se cargaron los tipos de cambio de `<MES_HACE_2>` y `<MES_ANTERIOR>` por API (sin disparar la puesta al día de la UI) ejecutando con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/upsert_fx_rate` con `{"p_period":"<MES_HACE_2>-01","p_ars_per_usd":"1200.00"}` y `POST <SUPABASE_URL>/rest/v1/rpc/upsert_fx_rate` con `{"p_period":"<MES_ANTERIOR>-01","p_ars_per_usd":"1200.00"}`.

**Datos de prueba:** D 1: Email `qa+cp-sus-070-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Suscripción `"Disney+"` (`USD 10,00`, día `28`, inicio `<MES_HACE_2>`) con tipos de cambio `1200.00` en `<MES_HACE_2>` y `<MES_ANTERIOR>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-070-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-070-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`); la puesta al día corre automáticamente y muestra el aviso `app-catchup-generated` con el texto `"Se cargaron 2 gastos de suscripciones"` |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en la fila `"Disney+"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) | Se abre `/subscriptions/<SUB_ID>`; en `"Gastos cargados"` (`subscription-detail-occurrences`) aparecen exactamente 2 filas (`subscription-detail-occurrence`): `<MES_ANTERIOR>` (`28/<MES_ANTERIOR>`, `"USD 10,00"`) y `<MES_HACE_2>` (`28/<MES_HACE_2>`, `"USD 10,00"`) |

**Post-condición:** En `public.transactions` existen 2 filas con `subscription_id = <SUB_ID>` y `subscription_period` en `{<MES_HACE_2>-01, <MES_ANTERIOR>-01}`, cada una con `type = 'expense'`, `installments_count = 1`, `amount = 10.00`, `currency = 'USD'`, `fx_rate = 1200.00`, `amount_ars = 12000.00` y 1 fila en `public.ledger_entries` con `amount = 10.00` y `amount_ars = 12000.00` (`I1`, `I1'`, `I2`, `I5`, `I11`, `I14`, `I17`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-071 — Recargar la página y navegar entre pestañas con las suscripciones al día no crea transacciones nuevas ni muestra `app-catchup-generated`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-53 · CA-2, CA-10 · FR-16 · R2 · ADR-017, ADR-031 |
| Invariante | I11, I16 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción al día ejecutando con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_start_period":"<MES_HACE_2>-01","p_end_period":null,"p_description":null}` (`"generated": 2`, ocurrencias de `<MES_HACE_2>` y `<MES_ANTERIOR>` ya creadas), guardando `subscription_id` como `<SUB_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-071-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Suscripción `"Netflix"` ya al día con 2 ocurrencias (`<MES_HACE_2>` y `<MES_ANTERIOR>`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-071-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-071-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) y no aparece el aviso `app-catchup-generated` |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` sin volver a disparar aviso `app-catchup-generated` |
| 7 | Recargar la página del navegador (`F5`) en `/subscriptions` | La página recarga `/subscriptions` mostrando `"Netflix"` y no aparece `app-catchup-generated` ni `app-catchup-error` |
| 8 | Hacer click en la fila `"Netflix"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) | Se abre `/subscriptions/<SUB_ID>`; en `"Gastos cargados"` (`subscription-detail-occurrences`) siguen existiendo exactamente 2 filas (`<MES_ANTERIOR>` y `<MES_HACE_2>`, sin duplicados) |

**Post-condición:** En `public.transactions` existen exactamente 2 filas para `<SUB_ID>` (`I11`, `I16`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-072 — Dos llamadas consecutivas por API a `run_subscription_catchup` responden `200 OK` sin error y dejan exactamente 1 transacción por período

| Campo | Contenido |
|---|---|
| Historia · criterio | US-53 · CA-1, CA-2, CA-3 · FR-16 · R1, R2 · ADR-017, ADR-030 |
| Invariante | I1, I2, I11, I14, I16, I17 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción en `USD` sin tipos de cambio cargados aún ejecutando con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Spotify USD","p_amount":"10.00","p_currency":"USD","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_start_period":"<MES_HACE_2>-01","p_end_period":null,"p_description":null}` (`"generated": 0`), guardando `subscription_id` como `<SUB_ID>`. S 5: se cargaron los tipos de cambio de `<MES_HACE_2>` y `<MES_ANTERIOR>` ejecutando con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/upsert_fx_rate` con `{"p_period":"<MES_HACE_2>-01","p_ars_per_usd":"1200.00"}` y `{"p_period":"<MES_ANTERIOR>-01","p_ars_per_usd":"1200.00"}`.

**Datos de prueba:** D 1: Email `qa+cp-sus-072-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Endpoint `POST <SUPABASE_URL>/rest/v1/rpc/run_subscription_catchup` con body `{}`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/run_subscription_catchup` con body `{}` (primera llamada) | Respuesta HTTP `200 OK` con body `{"generated": 2, "failed": []}` |
| 2 | Ejecutar inmediatamente con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/run_subscription_catchup` con body `{}` (segunda llamada consecutiva) | Respuesta HTTP `200 OK` con body `{"generated": 0, "failed": []}` (sin error `23505`) |
| 3 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/transactions?subscription_id=eq.<SUB_ID>&select=id,subscription_period,amount_text:amount::text,installments_count,type&order=subscription_period.asc` | Respuesta HTTP `200 OK` con exactamente 2 filas: `subscription_period = "<MES_HACE_2>-01"` y `subscription_period = "<MES_ANTERIOR>-01"`, ambas con `"amount_text": "10.00"`, `"installments_count": 1` y `"type": "expense"` |

**Post-condición:** En `public.transactions` existen exactamente 2 filas para `<SUB_ID>` (cero duplicados, `I11`, `I14`, `I16`, `I17`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-073 — `run_subscription_catchup` sigue generando ocurrencias aunque la categoría y el medio de pago se hayan archivado después del alta

| Campo | Contenido |
|---|---|
| Historia · criterio | US-53 · CA-6 · FR-16 · R1, R7 · ADR-030 |
| Invariante | I1, I2, I11, I14, I17 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` (`"Efectivo"`) y `<CATEGORY_ID>` (`"Entretenimiento"`). S 4: se creó una suscripción en `USD` aún sin tipo de cambio en `<MES_ANTERIOR>`: `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix USD","p_amount":"10.00","p_currency":"USD","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_start_period":"<MES_ANTERIOR>-01","p_end_period":null,"p_description":null}` (`"generated": 0`), guardando `subscription_id` como `<SUB_ID>`. S 5: se archivaron `<CATEGORY_ID>` y `<ACCOUNT_ID>` ejecutando con PR-04 `PATCH <SUPABASE_URL>/rest/v1/categories?id=eq.<CATEGORY_ID>` con `{"archived_at":"2026-01-01T00:00:00Z"}` y `PATCH <SUPABASE_URL>/rest/v1/accounts?id=eq.<ACCOUNT_ID>` con `{"archived_at":"2026-01-01T00:00:00Z"}`, y se cargó el tipo de cambio con `POST <SUPABASE_URL>/rest/v1/rpc/upsert_fx_rate` (`{"p_period":"<MES_ANTERIOR>-01","p_ars_per_usd":"1200.00"}`).

**Datos de prueba:** D 1: Email `qa+cp-sus-073-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Endpoint `POST <SUPABASE_URL>/rest/v1/rpc/run_subscription_catchup` con body `{}`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/run_subscription_catchup` con body `{}` | Respuesta HTTP `200 OK` con body `{"generated": 1, "failed": []}` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/transactions?subscription_id=eq.<SUB_ID>&select=subscription_period,category_id,account_id,amount_text:amount::text` | Respuesta HTTP `200 OK` con 1 fila (`"subscription_period": "<MES_ANTERIOR>-01"`, `"category_id": "<CATEGORY_ID>"`, `"account_id": "<ACCOUNT_ID>"`, `"amount_text": "10.00"`) |

**Post-condición:** La ocurrencia de `<MES_ANTERIOR>` se creó con la categoría y la cuenta originales archivadas. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-074 — Suscripción en estado `paused` no genera ocurrencias al ejecutar `run_subscription_catchup`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-53 · CA-7 · US-56 · CA-5 · FR-16, FR-17 · R3 · ADR-030 |
| Invariante | I15 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 3: se creó una suscripción en `USD` desde `<MES_ANTERIOR>` sin tipo de cambio cargado (`POST /rest/v1/rpc/create_subscription` con `"p_currency":"USD"`, `"p_start_period":"<MES_ANTERIOR>-01"`, `"p_billing_day":28`, `"generated": 0`), se la pausó con `POST <SUPABASE_URL>/rest/v1/rpc/pause_subscription` (`{"p_subscription_id":"<SUB_ID>"}`) y luego se cargó el tipo de cambio de `<MES_ANTERIOR>-01` con `POST <SUPABASE_URL>/rest/v1/rpc/upsert_fx_rate` (`{"p_period":"<MES_ANTERIOR>-01","p_ars_per_usd":"1200.00"}`).

**Datos de prueba:** D 1: Email `qa+cp-sus-074-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Endpoint `POST <SUPABASE_URL>/rest/v1/rpc/run_subscription_catchup` con body `{}`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/run_subscription_catchup` con body `{}` | Respuesta HTTP `200 OK` con body `{"generated": 0, "failed": []}` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/transactions?subscription_id=eq.<SUB_ID>&select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.transactions` existen 0 filas para `<SUB_ID>` (`R3`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-075 — Suscripción en estado `cancelled` no genera ocurrencias al ejecutar `run_subscription_catchup`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-53 · CA-7 · US-58 · CA-3 · FR-16, FR-17 · R3 · ADR-030 |
| Invariante | I15 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 3: se creó una suscripción en `USD` desde `<MES_ANTERIOR>` sin tipo de cambio cargado (`"generated": 0`), se la canceló con `POST <SUPABASE_URL>/rest/v1/rpc/cancel_subscription` (`{"p_subscription_id":"<SUB_ID>"}`) y luego se cargó el tipo de cambio de `<MES_ANTERIOR>-01` con `POST <SUPABASE_URL>/rest/v1/rpc/upsert_fx_rate` (`{"p_period":"<MES_ANTERIOR>-01","p_ars_per_usd":"1200.00"}`).

**Datos de prueba:** D 1: Email `qa+cp-sus-075-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Endpoint `POST <SUPABASE_URL>/rest/v1/rpc/run_subscription_catchup` con body `{}`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/run_subscription_catchup` con body `{}` | Respuesta HTTP `200 OK` con body `{"generated": 0, "failed": []}` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/transactions?subscription_id=eq.<SUB_ID>&select=id` | Respuesta HTTP `200 OK` con body `[]` (0 filas) |

**Post-condición:** En `public.transactions` existen 0 filas para `<SUB_ID>` (`R3`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-076 — Dar de alta una suscripción con rango cerrado en el pasado (`<MES_HACE_4>` a `<MES_HACE_2>`) genera exactamente esos 3 meses y muestra `"Terminó en <mes hace 2>"`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-53 · CA-8, CA-9 · US-52 · CA-12 · FR-15, FR-16 · R1 · ADR-032 |
| Invariante | I11, I12, I14, I17 |
| Técnica · Tipo | Análisis de valores límite · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-076-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Curso trimestral"`. D 4: Monto `"8000"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"10"`. D 8: Mes de inicio `"<MES_HACE_4>"` (ej. `"2026-06"`). D 9: Mes de fin `"<MES_HACE_2>"` (ej. `"2026-08"`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-076-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-076-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en `"Nueva"` (`subscriptions-new`) | Se abre `/subscriptions/new` |
| 8 | Escribir `Curso trimestral` en `"Nombre"` (`subscription-form-name`) | El campo muestra `Curso trimestral` |
| 9 | Escribir `8000` en `"Monto"` (`subscription-form-amount`) | El campo muestra `8000` |
| 10 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 11 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 12 | Escribir `10` en `"Día de cobro"` (`subscription-form-billing-day`) | El campo muestra `10` |
| 13 | Ingresar `<MES_HACE_4>` en `"Mes de inicio"` (`subscription-form-start-period`) | `"Mes de inicio"` muestra `<MES_HACE_4>` |
| 14 | Ingresar `<MES_HACE_2>` en `"Mes de fin (opcional)"` (`subscription-form-end-period`) | `"Mes de fin (opcional)"` muestra `<MES_HACE_2>` y `subscription-form-preview-summary` muestra `"Al guardar se cargan 3 gastos de $8.000,00 (total $24.000,00)."` |
| 15 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | Navega a `/subscriptions/<SUB_ID>`, muestra el aviso `"Suscripción guardada. Se cargaron 3 gastos vencidos."` (`subscription-toast`), `"Próximo cobro"` (`subscription-detail-next-charge`) muestra `"—"` y `"Gastos cargados"` (`subscription-detail-occurrences`) lista exactamente 3 filas (`<MES_HACE_2>`, `<MES_HACE_3>` y `<MES_HACE_4>`), sin crear `<MES_ANTERIOR>` ni `<MES_ACTUAL>` |
| 16 | Hacer click en el botón atrás (`subscription-detail-back`) | Navega a `/subscriptions`; bajo el grupo `"Activas"` la fila `"Curso trimestral"` (`subscriptions-item` con `data-status="active"`) muestra `"Terminó en <mes hace 2>"` (`subscriptions-item-ended`, ej. `"Terminó en agosto 2026"`) en lugar de `"Se cobra el día 10"` |

**Post-condición:** En `public.transactions` existen exactamente 3 filas para `"Curso trimestral"` con `subscription_period` en `{<MES_HACE_4>-01, <MES_HACE_3>-01, <MES_HACE_2>-01}` (`I17`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-077 — Suscripción en USD cuyo monto en pesos supera `$999.999.999.999,99` queda bloqueada con `"No se pudo cargar"` sin frenar otra suscripción activa ni mostrar `app-catchup-error`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-53 · CA-12 · US-62 (Pantalla) · FR-16 · R1, R6 · ADR-030, ADR-031 |
| Invariante | I4, I5, I11, I14 |
| Técnica · Tipo | Análisis de valores límite · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se crearon dos suscripciones en `USD` desde `<MES_ANTERIOR>` con día `28` antes de cargar el tipo de cambio (`"generated": 0` en ambas):
- `"Enterprise USD"` con `p_amount: "999999999999.99"` (`<SUB_OVERFLOW_ID>`)
- `"Spotify USD"` con `p_amount: "10.00"` (`<SUB_OK_ID>`)
S 5: se cargó el tipo de cambio de `<MES_ANTERIOR>-01` igual a `"2.00"` ejecutando con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/upsert_fx_rate` con body `{"p_period":"<MES_ANTERIOR>-01","p_ars_per_usd":"2.00"}` (de modo que `"Enterprise USD"` da `1999999999999.98 > 999999999999.99` y desborda `numeric(14,2)`, mientras `"Spotify USD"` da `$20,00` y es válida).

**Datos de prueba:** D 1: Email `qa+cp-sus-077-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `"Enterprise USD"` (`USD 999.999.999.999,99` × `2,00` > `$999.999.999.999,99`). D 4: `"Spotify USD"` (`USD 10,00` × `2,00` = `$20,00`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-077-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-077-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`); se muestra el aviso `app-catchup-generated` `"Se cargó 1 gasto de suscripciones"` (por `"Spotify USD"`) y **no** aparece la franja `app-catchup-error` |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions`; en la fila `"Enterprise USD"` (`subscriptions-item` con `data-subscription-id="<SUB_OVERFLOW_ID>"`) se muestra la marca `"No se pudo cargar"` (`subscriptions-item-blocked`) |
| 7 | Hacer click en la fila `"Enterprise USD"` (`subscriptions-item` con `data-subscription-id="<SUB_OVERFLOW_ID>"`) | Se abre `/subscriptions/<SUB_OVERFLOW_ID>`; arriba de los datos se muestra el aviso `subscription-detail-blocked` con el texto `"El gasto de <mes anterior> no se pudo cargar porque en pesos supera $999.999.999.999,99 (o no llega a $0,01). Revisá el monto o el tipo de cambio de ese mes."` y **sin** el botón `"Cargar tipo de cambio"` |

**Post-condición:** En `public.transactions` existen 0 filas para `<SUB_OVERFLOW_ID>` y 1 fila (`<MES_ANTERIOR>-01`) para `<SUB_OK_ID>`. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-078 — Suscripción con día de cobro `31` entre `2026-01` y `2026-04` genera ocurrencias con fechas `31/01/2026`, `28/02/2026`, `31/03/2026` y `30/04/2026`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-54 · CA-1, CA-4, CA-5 · US-55 · CA-6 · US-75 · CA-5 · FR-16 · R4 · ADR-017 |
| Invariante | I11, I13, I14 |
| Técnica · Tipo | Análisis de valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y los meses `2026-01` a `2026-04` (año no bisiesto) están en el pasado dentro de la ventana `[-24 meses, +12 meses]` respecto de `<MES_ACTUAL>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-078-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Adobe CC"`. D 4: Monto `"12000"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"31"`. D 8: Mes de inicio `"2026-01"`. D 9: Mes de fin `"2026-04"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-078-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-078-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en `"Nueva"` (`subscriptions-new`) | Se abre `/subscriptions/new` |
| 8 | Escribir `Adobe CC` en `"Nombre"` (`subscription-form-name`) | El campo muestra `Adobe CC` |
| 9 | Escribir `12000` en `"Monto"` (`subscription-form-amount`) | El campo muestra `12000` |
| 10 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 11 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 12 | Escribir `31` en `"Día de cobro"` (`subscription-form-billing-day`) | El campo muestra `31` |
| 13 | Ingresar `2026-01` en `"Mes de inicio"` (`subscription-form-start-period`) | `"Mes de inicio"` muestra `2026-01` |
| 14 | Ingresar `2026-04` en `"Mes de fin (opcional)"` (`subscription-form-end-period`) | En `"Se cargan al guardar"` (`subscription-form-preview-due`) aparecen las 4 filas con fechas `"enero 2026 · 31/01/2026"`, `"febrero 2026 · 28/02/2026"`, `"marzo 2026 · 31/03/2026"` y `"abril 2026 · 30/04/2026"` |
| 15 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada. Se cargaron 4 gastos vencidos."` (`subscription-toast`) y en `"Gastos cargados"` (`subscription-detail-occurrences`) las 4 ocurrencias muestran las fechas `30/04/2026` (`data-period="2026-04"`), `31/03/2026` (`data-period="2026-03"`), `28/02/2026` (`data-period="2026-02"`) y `31/01/2026` (`data-period="2026-01"`) |

**Post-condición:** En `public.subscriptions`, `billing_day = 31` (`I13`); en `public.transactions` existen 4 filas con `(subscription_period, occurred_on)` iguales a `('2026-01-01','2026-01-31')`, `('2026-02-01','2026-02-28')`, `('2026-03-01','2026-03-31')` y `('2026-04-01','2026-04-30')` (`R4`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-079 — Suscripción con día de cobro `29` en febrero de año no bisiesto (`2026-02`) genera la ocurrencia con fecha `28/02/2026`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-54 · CA-2, CA-4 · FR-16 · R4 · ADR-017 |
| Invariante | I11, I13, I14 |
| Técnica · Tipo | Análisis de valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y los meses `2026-02` y `2026-03` están en el pasado dentro de `[-24 meses, +12 meses]`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-079-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Hosting 29"`. D 4: Monto `"6000"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"29"`. D 8: Mes de inicio `"2026-02"`. D 9: Mes de fin `"2026-03"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-079-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-079-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en `"Nueva"` (`subscriptions-new`) | Se abre `/subscriptions/new` |
| 8 | Escribir `Hosting 29` en `"Nombre"` (`subscription-form-name`) | El campo muestra `Hosting 29` |
| 9 | Escribir `6000` en `"Monto"` (`subscription-form-amount`) | El campo muestra `6000` |
| 10 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 11 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 12 | Escribir `29` en `"Día de cobro"` (`subscription-form-billing-day`) | El campo muestra `29` |
| 13 | Ingresar `2026-02` en `"Mes de inicio"` (`subscription-form-start-period`) | `"Mes de inicio"` muestra `2026-02` |
| 14 | Ingresar `2026-03` en `"Mes de fin (opcional)"` (`subscription-form-end-period`) | En `"Se cargan al guardar"` (`subscription-form-preview-due`) aparecen `"febrero 2026 · 28/02/2026"` y `"marzo 2026 · 29/03/2026"` |
| 15 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada. Se cargaron 2 gastos vencidos."` (`subscription-toast`) y en `"Gastos cargados"` (`subscription-detail-occurrences`) aparecen `29/03/2026` (`data-period="2026-03"`) y `28/02/2026` (`data-period="2026-02"`) |

**Post-condición:** En `public.transactions` existen 2 filas con `(subscription_period, occurred_on)` iguales a `('2026-02-01','2026-02-28')` y `('2026-03-01','2026-03-29')` (`I13`, `R4`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-080 — Suscripción con día de cobro `30` en febrero de año no bisiesto (`2026-02`) genera la ocurrencia con fecha `28/02/2026`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-54 · CA-3, CA-4 · FR-16 · R4 · ADR-017 |
| Invariante | I11, I13, I14 |
| Técnica · Tipo | Análisis de valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y los meses `2026-02` y `2026-03` están en el pasado dentro de `[-24 meses, +12 meses]`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-080-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Hosting 30"`. D 4: Monto `"6000"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"30"`. D 8: Mes de inicio `"2026-02"`. D 9: Mes de fin `"2026-03"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-080-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-080-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en `"Nueva"` (`subscriptions-new`) | Se abre `/subscriptions/new` |
| 8 | Escribir `Hosting 30` en `"Nombre"` (`subscription-form-name`) | El campo muestra `Hosting 30` |
| 9 | Escribir `6000` en `"Monto"` (`subscription-form-amount`) | El campo muestra `6000` |
| 10 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 11 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 12 | Escribir `30` en `"Día de cobro"` (`subscription-form-billing-day`) | El campo muestra `30` |
| 13 | Ingresar `2026-02` en `"Mes de inicio"` (`subscription-form-start-period`) | `"Mes de inicio"` muestra `2026-02` |
| 14 | Ingresar `2026-03` en `"Mes de fin (opcional)"` (`subscription-form-end-period`) | En `"Se cargan al guardar"` (`subscription-form-preview-due`) aparecen `"febrero 2026 · 28/02/2026"` y `"marzo 2026 · 30/03/2026"` |
| 15 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada. Se cargaron 2 gastos vencidos."` (`subscription-toast`) y en `"Gastos cargados"` (`subscription-detail-occurrences`) aparecen `30/03/2026` (`data-period="2026-03"`) y `28/02/2026` (`data-period="2026-02"`) |

**Post-condición:** En `public.transactions` existen 2 filas con `(subscription_period, occurred_on)` iguales a `('2026-02-01','2026-02-28')` y `('2026-03-01','2026-03-30')` (`I13`, `R4`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-081 — Suscripción con día de cobro `<DIA_MAÑANA>` no genera la ocurrencia del mes corriente

| Campo | Contenido |
|---|---|
| Historia · criterio | US-55 · CA-1 · US-53 · CA-13 · FR-16 · R5 · ADR-021 |
| Invariante | I11, I17 |
| Técnica · Tipo | Análisis de valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27` (de modo que `<DIA_MAÑANA> = <DIA_HOY> + 1 <= 28`). S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-081-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Mañana TV"`. D 4: Monto `"5000"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"<DIA_MAÑANA>"` (ej. `"7"` si `<HOY> = 06/10/2026`). D 8: Mes de inicio `"<MES_ANTERIOR>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-081-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-081-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en `"Nueva"` (`subscriptions-new`) | Se abre `/subscriptions/new` |
| 8 | Escribir `Mañana TV` en `"Nombre"` (`subscription-form-name`) | El campo muestra `Mañana TV` |
| 9 | Escribir `5000` en `"Monto"` (`subscription-form-amount`) | El campo muestra `5000` |
| 10 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 11 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 12 | Escribir `<DIA_MAÑANA>` en `"Día de cobro"` (`subscription-form-billing-day`) | El campo muestra `<DIA_MAÑANA>` |
| 13 | Ingresar `<MES_ANTERIOR>` en `"Mes de inicio"` (`subscription-form-start-period`) | En `subscription-form-preview-due` aparece únicamente `<MES_ANTERIOR>` y `subscription-form-preview-summary` muestra `"Al guardar se carga 1 gasto de $5.000,00."` |
| 14 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada. Se cargó 1 gasto vencido."` (`subscription-toast`), `"Próximo cobro"` (`subscription-detail-next-charge`) muestra la fecha de mañana en `<MES_ACTUAL>` y en `"Gastos cargados"` (`subscription-detail-occurrences`) figura únicamente `<MES_ANTERIOR>` (1 fila) |

**Post-condición:** En `public.transactions` existe 1 sola fila para `"Mañana TV"` (`subscription_period = '<MES_ANTERIOR>-01'`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-082 — Suscripción con día de cobro igual a `<DIA_HOY>` genera la ocurrencia del mes corriente

| Campo | Contenido |
|---|---|
| Historia · criterio | US-55 · CA-2 · US-53 · CA-13 · FR-16 · R5 · ADR-021 |
| Invariante | I11, I17 |
| Técnica · Tipo | Análisis de valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-082-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Hoy TV"`. D 4: Monto `"5000"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"<DIA_HOY>"` (ej. `"6"` si `<HOY> = 06/10/2026`). D 8: Mes de inicio `"<MES_ANTERIOR>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-082-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-082-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en `"Nueva"` (`subscriptions-new`) | Se abre `/subscriptions/new` |
| 8 | Escribir `Hoy TV` en `"Nombre"` (`subscription-form-name`) | El campo muestra `Hoy TV` |
| 9 | Escribir `5000` en `"Monto"` (`subscription-form-amount`) | El campo muestra `5000` |
| 10 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 11 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 12 | Escribir `<DIA_HOY>` en `"Día de cobro"` (`subscription-form-billing-day`) | El campo muestra `<DIA_HOY>` |
| 13 | Ingresar `<MES_ANTERIOR>` en `"Mes de inicio"` (`subscription-form-start-period`) | En `subscription-form-preview-due` aparecen `<MES_ANTERIOR>` y `<MES_ACTUAL>` y `subscription-form-preview-summary` muestra `"Al guardar se cargan 2 gastos de $5.000,00 (total $10.000,00)."` |
| 14 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada. Se cargaron 2 gastos vencidos."` (`subscription-toast`) y en `"Gastos cargados"` (`subscription-detail-occurrences`) aparecen `<MES_ACTUAL>` (con fecha `<HOY>`) y `<MES_ANTERIOR>` |

**Post-condición:** En `public.transactions` existen 2 filas para `"Hoy TV"` (`subscription_period` en `{<MES_ANTERIOR>-01, <MES_ACTUAL>-01}`, esta última con `occurred_on = '<HOY_ISO>'`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-083 — Suscripción con día de cobro `<DIA_AYER>` genera la ocurrencia del mes corriente con fecha de ayer

| Campo | Contenido |
|---|---|
| Historia · criterio | US-55 · CA-3 · US-53 · CA-13 · FR-16 · R5 · ADR-021 |
| Invariante | I11, I17 |
| Técnica · Tipo | Análisis de valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> >= 2` (de modo que `<DIA_AYER> = <DIA_HOY> - 1 >= 1`). S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-083-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Ayer TV"`. D 4: Monto `"5000"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"<DIA_AYER>"` (ej. `"5"` si `<HOY> = 06/10/2026`). D 8: Mes de inicio `"<MES_ANTERIOR>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-083-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-083-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en `"Nueva"` (`subscriptions-new`) | Se abre `/subscriptions/new` |
| 8 | Escribir `Ayer TV` en `"Nombre"` (`subscription-form-name`) | El campo muestra `Ayer TV` |
| 9 | Escribir `5000` en `"Monto"` (`subscription-form-amount`) | El campo muestra `5000` |
| 10 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 11 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 12 | Escribir `<DIA_AYER>` en `"Día de cobro"` (`subscription-form-billing-day`) | El campo muestra `<DIA_AYER>` |
| 13 | Ingresar `<MES_ANTERIOR>` en `"Mes de inicio"` (`subscription-form-start-period`) | En `subscription-form-preview-due` aparecen `<MES_ANTERIOR>` y `<MES_ACTUAL>` y `subscription-form-preview-summary` muestra `"Al guardar se cargan 2 gastos de $5.000,00 (total $10.000,00)."` |
| 14 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada. Se cargaron 2 gastos vencidos."` (`subscription-toast`) y en `"Gastos cargados"` (`subscription-detail-occurrences`) aparece la fila de `<MES_ACTUAL>` con fecha día `<DIA_AYER>` (ej. `"05/10/2026"`) junto a la de `<MES_ANTERIOR>` |

**Post-condición:** En `public.transactions` existen 2 filas para `"Ayer TV"` (`subscription_period` en `{<MES_ANTERIOR>-01, <MES_ACTUAL>-01}`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-084 — Períodos anteriores al corriente se generan siempre aunque el día de cobro (`28`) sea posterior a `<DIA_HOY>`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-55 · CA-4 · FR-16 · R5 · ADR-021 |
| Invariante | I11, I17 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-084-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Mensual 28"`. D 4: Monto `"5000"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"28"`. D 8: Mes de inicio `"<MES_HACE_2>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-084-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-084-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en `"Nueva"` (`subscriptions-new`) | Se abre `/subscriptions/new` |
| 8 | Escribir `Mensual 28` en `"Nombre"` (`subscription-form-name`) | El campo muestra `Mensual 28` |
| 9 | Escribir `5000` en `"Monto"` (`subscription-form-amount`) | El campo muestra `5000` |
| 10 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 11 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 12 | Escribir `28` en `"Día de cobro"` (`subscription-form-billing-day`) | El campo muestra `28` |
| 13 | Ingresar `<MES_HACE_2>` en `"Mes de inicio"` (`subscription-form-start-period`) | En `subscription-form-preview-due` aparecen `<MES_HACE_2>` y `<MES_ANTERIOR>` y `subscription-form-preview-summary` muestra `"Al guardar se cargan 2 gastos de $5.000,00 (total $10.000,00)."` |
| 14 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada. Se cargaron 2 gastos vencidos."` (`subscription-toast`) y en `"Gastos cargados"` (`subscription-detail-occurrences`) aparecen las 2 filas (`28/<MES_ANTERIOR>` y `28/<MES_HACE_2>`), sin haber creado `<MES_ACTUAL>` |

**Post-condición:** En `public.transactions` existen exactamente 2 filas para `"Mensual 28"` (`subscription_period` en `{<MES_HACE_2>-01, <MES_ANTERIOR>-01}`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-085 — Pausar suscripción activa con día de cobro `28` (`> <DIA_HOY>`) muestra advertencia de este mes y pasa a `"Pausada desde <HOY>"` con piso en `<MES_SIGUIENTE>`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-56 · CA-1, CA-2, CA-3, CA-5, CA-11 · FR-17 · R3, R8 · ADR-030 |
| Invariante | I12, I15 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción ejecutando con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_start_period":"<MES_ANTERIOR>-01","p_end_period":null,"p_description":null}` (`"generated": 1`, ocurrencia de `<MES_ANTERIOR>` creada), guardando `subscription_id` como `<SUB_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-085-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Suscripción `"Netflix"` activa con día `28` y 1 ocurrencia en `<MES_ANTERIOR>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-085-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-085-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en la fila `"Netflix"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) | Se abre `/subscriptions/<SUB_ID>` |
| 8 | Hacer click en el botón `"Pausar"` (`subscription-detail-pause`) | Se abre el diálogo `pause-subscription-dialog` con el título `"¿Pausar Netflix?"`, el texto `"Mientras esté pausada no se cargan gastos."` seguido de `"Este mes tampoco se cobra si todavía no llegó el día 28, aunque la reanudes antes."` y los botones `"Cancelar"` (`pause-subscription-dialog-cancel`) y `"Pausar"` (`pause-subscription-dialog-confirm`) |
| 9 | Hacer click en el botón `"Pausar"` (`pause-subscription-dialog-confirm`) | Se cierra el diálogo, aparece el aviso `"Suscripción pausada"` (`subscription-toast`), el estado (`subscription-detail-status`) cambia a `"Pausada desde <HOY>"` (con `data-status="paused"`), `"Próximo cobro"` (`subscription-detail-next-charge`) muestra `"—"`, `"Pausar"` se reemplaza por `"Reanudar"` (`subscription-detail-resume`) y `"Gastos cargados"` conserva intacta la ocurrencia de `<MES_ANTERIOR>` por `"$5.000,00"` |
| 10 | Hacer click en el botón atrás (`subscription-detail-back`) | Navega a `/subscriptions`; `"Netflix"` aparece bajo el grupo `"Pausadas"` (`subscriptions-item` con `data-status="paused"`) |

**Post-condición:** En `public.subscriptions`, `status = 'paused'`, `paused_at IS NOT NULL` y `generate_from_period = '<MES_SIGUIENTE>-01'` (`I12`, `I15`, `R8`); la transacción de `<MES_ANTERIOR>-01` no cambió. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-086 — Pausar suscripción activa cuyo cobro del mes corriente ya fue generado (`<DIA_AYER>`) no muestra la oración `"Este mes tampoco se cobra..."`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-56 · CA-11, CA-1 · FR-17 · R8 · ADR-030 |
| Invariante | I12, I15 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> >= 2` (de modo que `<DIA_AYER> = <DIA_HOY> - 1 >= 1`). S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción ejecutando con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":<DIA_AYER>,"p_start_period":"<MES_ACTUAL>-01","p_end_period":null,"p_description":null}` (`"generated": 1`, `<MES_ACTUAL>` ya generado), guardando `subscription_id` como `<SUB_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-086-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Suscripción `"Netflix"` con día `<DIA_AYER>` y ocurrencia de `<MES_ACTUAL>` ya generada.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-086-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-086-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en la fila `"Netflix"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) | Se abre `/subscriptions/<SUB_ID>` |
| 8 | Hacer click en el botón `"Pausar"` (`subscription-detail-pause`) | Se abre el diálogo `pause-subscription-dialog` con el texto `"Mientras esté pausada no se cargan gastos."` y **sin** la oración `"Este mes tampoco se cobra..."` |
| 9 | Hacer click en el botón `"Pausar"` (`pause-subscription-dialog-confirm`) | Se cierra el diálogo, muestra `"Suscripción pausada"` (`subscription-toast`) y el estado (`subscription-detail-status`) cambia a `"Pausada desde <HOY>"` |

**Post-condición:** En `public.subscriptions`, `status = 'paused'`, `paused_at IS NOT NULL` y `generate_from_period = '<MES_SIGUIENTE>-01'` (`I12`, `I15`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-087 — Tocar `"Cancelar"` en el diálogo de pausa cierra el diálogo y mantiene la suscripción `"Activa"`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-56 · CA-6 · FR-17 |
| Invariante | I15 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción ejecutando con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_start_period":"<MES_SIGUIENTE>-01","p_end_period":null,"p_description":null}`, guardando `subscription_id` como `<SUB_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-087-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Suscripción `"Netflix"` activa.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-087-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-087-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en la fila `"Netflix"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) | Se abre `/subscriptions/<SUB_ID>` |
| 8 | Hacer click en el botón `"Pausar"` (`subscription-detail-pause`) | Se abre el diálogo `pause-subscription-dialog` |
| 9 | Hacer click en el botón `"Cancelar"` (`pause-subscription-dialog-cancel`) | El diálogo se cierra y el estado (`subscription-detail-status`) sigue siendo `"Activa"` (`data-status="active"`) |

**Post-condición:** En `public.subscriptions`, `<SUB_ID>` conserva `status = 'active'` y `paused_at IS NULL`. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-088 — `pause_subscription` por API ejecuta primero la puesta al día y genera los meses vencidos pendientes antes de pausar

| Campo | Contenido |
|---|---|
| Historia · criterio | US-56 · CA-4 · FR-17 · R1, R8 · ADR-030 |
| Invariante | I11, I12, I14, I15, I17 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción en `USD` desde `<MES_HACE_2>` sin tipos de cambio aún (`POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix USD","p_amount":"10.00","p_currency":"USD","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_start_period":"<MES_HACE_2>-01","p_end_period":null,"p_description":null}`, `"generated": 0`), guardando `subscription_id` como `<SUB_ID>`. S 5: se cargaron los tipos de cambio de `<MES_HACE_2>` y `<MES_ANTERIOR>` ejecutando con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/upsert_fx_rate` con `{"p_period":"<MES_HACE_2>-01","p_ars_per_usd":"1200.00"}` y `{"p_period":"<MES_ANTERIOR>-01","p_ars_per_usd":"1200.00"}`.

**Datos de prueba:** D 1: Email `qa+cp-sus-088-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Endpoint `POST <SUPABASE_URL>/rest/v1/rpc/pause_subscription` con body `{"p_subscription_id":"<SUB_ID>"}`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/pause_subscription` con body `{"p_subscription_id":"<SUB_ID>"}` | Respuesta HTTP `200 OK` con body `{"generated_before": 2}` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/transactions?subscription_id=eq.<SUB_ID>&select=subscription_period&order=subscription_period.asc` | Respuesta HTTP `200 OK` con 2 filas (`"subscription_period": "<MES_HACE_2>-01"` y `"subscription_period": "<MES_ANTERIOR>-01"`) |
| 3 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?id=eq.<SUB_ID>&select=status,paused_at,generate_from_period` | Respuesta HTTP `200 OK` con `"status": "paused"`, `"paused_at"` no nulo y `"generate_from_period": "<MES_SIGUIENTE>-01"` |

**Post-condición:** Los 2 períodos vencidos quedaron generados antes de pasar a `paused` (`I12`, `I15`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-089 — Pausar suscripción en USD con mes bloqueado por falta de tipo de cambio muestra `pause-subscription-dialog-blocked-warning` y quita el bloqueo al confirmar

| Campo | Contenido |
|---|---|
| Historia · criterio | US-56 · CA-10 · US-62 · CA-5 · FR-17 · R6, R8 · ADR-030 |
| Invariante | I12, I15 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2` (sin tipos de cambio cargados). S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción en `USD` desde `<MES_ANTERIOR>` con día `28`: `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"ChatGPT Plus","p_amount":"20.00","p_currency":"USD","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_start_period":"<MES_ANTERIOR>-01","p_end_period":null,"p_description":null}` (`"generated": 0`), guardando `subscription_id` como `<SUB_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-089-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Suscripción `"ChatGPT Plus"` (`USD 20,00`) con `<MES_ANTERIOR>` bloqueado por falta de tipo de cambio.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-089-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-089-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions`; en la fila `"ChatGPT Plus"` (`subscriptions-item`) se muestra la marca `"Falta tipo de cambio"` (`subscriptions-item-blocked`) |
| 7 | Hacer click en la fila `"ChatGPT Plus"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) | Se abre `/subscriptions/<SUB_ID>`; se muestra el aviso `subscription-detail-blocked` |
| 8 | Hacer click en el botón `"Pausar"` (`subscription-detail-pause`) | Se abre el diálogo `pause-subscription-dialog` mostrando `pause-subscription-dialog-blocked-warning` con el texto `"<Mes anterior> no se cargó por falta de tipo de cambio. Si la pausás, ese mes no se va a cargar."` (ej. `"Septiembre 2026 no se cargó por falta de tipo de cambio. Si la pausás, ese mes no se va a cargar."`) |
| 9 | Hacer click en el botón `"Pausar"` (`pause-subscription-dialog-confirm`) | El diálogo se cierra, muestra `"Suscripción pausada"` (`subscription-toast`), el estado (`subscription-detail-status`) cambia a `"Pausada desde <HOY>"`, desaparece el aviso `subscription-detail-blocked` y en `"Gastos cargados"` se lee `"Todavía no se cargó ningún gasto."` (`subscription-detail-occurrences-empty`) |

**Post-condición:** En `public.subscriptions`, `status = 'paused'` y `generate_from_period = '<MES_SIGUIENTE>-01'` (`I12`, `I15`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-090 — Cargar en Ajustes el tipo de cambio de un mes descartado al pausar y luego reanudar la suscripción no genera retroactivamente ese mes

| Campo | Contenido |
|---|---|
| Historia · criterio | US-56 · CA-10 · US-57 · CA-2 · FR-17 · R6, R8 · ADR-030 |
| Invariante | I12, I15, I17 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción en `USD` desde `<MES_ANTERIOR>` sin tipo de cambio (`POST /rest/v1/rpc/create_subscription` con `"p_name":"ChatGPT Plus"`, `"p_amount":"20.00"`, `"p_currency":"USD"`, `"p_billing_day":28`, `"p_start_period":"<MES_ANTERIOR>-01"`, `"generated": 0`) y se la pausó con `POST <SUPABASE_URL>/rest/v1/rpc/pause_subscription` (`{"p_subscription_id":"<SUB_ID>"}`), quedando `generate_from_period = '<MES_SIGUIENTE>-01'`.

**Datos de prueba:** D 1: Email `qa+cp-sus-090-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Mes de tipo de cambio `"<MES_ANTERIOR>"`. D 4: ARS por USD `"1200"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-090-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-090-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Ajustes"` (`register-nav-settings`) | Se abre `/settings` |
| 7 | Ingresar `<MES_ANTERIOR>` en `"Mes"` (`settings-fx-period`) | El campo muestra `<MES_ANTERIOR>` |
| 8 | Escribir `1200` en `"ARS por USD"` (`settings-fx-rate`) | El campo muestra `1200` |
| 9 | Hacer click en `"Guardar tipo de cambio"` (`settings-fx-submit`) | Se guarda el tipo de cambio de `<MES_ANTERIOR>` y no aparece `app-catchup-generated` |
| 10 | Hacer click en `"Suscripciones"` (`settings-nav-subscriptions`) | Se abre `/subscriptions` |
| 11 | Hacer click en la fila `"ChatGPT Plus"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) | Se abre `/subscriptions/<SUB_ID>` |
| 12 | Hacer click en el botón `"Reanudar"` (`subscription-detail-resume`) | Se abre el diálogo `resume-subscription-dialog` con el título `"¿Reanudar ChatGPT Plus?"` y el texto `"No se cargan los meses en los que estuvo pausada. Próximo cobro: 28/<MES_SIGUIENTE>."` |
| 13 | Hacer click en el botón `"Reanudar"` (`resume-subscription-dialog-confirm`) | El diálogo se cierra, muestra `"Suscripción reanudada"` (`subscription-toast`), el estado (`subscription-detail-status`) cambia a `"Activa"` y `"Gastos cargados"` sigue mostrando `"Todavía no se cargó ningún gasto. El primero se carga el 28/<MES_SIGUIENTE>."` (`subscription-detail-occurrences-empty`) |

**Post-condición:** En `public.transactions` existen 0 filas para `<SUB_ID>` y en `public.subscriptions` `generate_from_period = '<MES_SIGUIENTE>-01'` (`I12`, `I17`, `R8`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-091 — Rechazar en API `pause_subscription` sobre una suscripción que ya está en estado `paused`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-56 · CA-7 · FR-17 · C6 · ADR-030 |
| Invariante | I15 |
| Técnica · Tipo | Transición de estados · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 3: se creó y pausó una suscripción `<SUB_ID>` ejecutando con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` (`"p_name":"Netflix"`, `"p_amount":"5000.00"`, `"p_currency":"ARS"`, `"p_billing_day":28`, `"p_start_period":"<MES_SIGUIENTE>-01"`) y luego `POST <SUPABASE_URL>/rest/v1/rpc/pause_subscription` con body `{"p_subscription_id":"<SUB_ID>"}`.

**Datos de prueba:** D 1: Email `qa+cp-sus-091-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_subscription_id = "<SUB_ID>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/pause_subscription` con body `{"p_subscription_id":"<SUB_ID>"}` sobre la suscripción ya pausada | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "La suscripción ya está pausada"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?id=eq.<SUB_ID>&select=status` | Respuesta HTTP `200 OK` con `[{"status":"paused"}]` |

**Post-condición:** La suscripción `<SUB_ID>` permanece en `status = 'paused'`. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-092 — Rechazar en API `pause_subscription` sobre una suscripción en estado `cancelled`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-56 · CA-7 · US-58 · CA-6 · FR-17 · C6 · ADR-030 |
| Invariante | I15 |
| Técnica · Tipo | Transición de estados · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 3: se creó y canceló una suscripción `<SUB_ID>` ejecutando con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` y luego `POST <SUPABASE_URL>/rest/v1/rpc/cancel_subscription` con body `{"p_subscription_id":"<SUB_ID>"}`.

**Datos de prueba:** D 1: Email `qa+cp-sus-092-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_subscription_id = "<SUB_ID>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/pause_subscription` con body `{"p_subscription_id":"<SUB_ID>"}` sobre la suscripción cancelada | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "Una suscripción cancelada no se puede modificar"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?id=eq.<SUB_ID>&select=status,cancelled_at` | Respuesta HTTP `200 OK` con `"status": "cancelled"` y `"cancelled_at"` no nulo |

**Post-condición:** La suscripción `<SUB_ID>` permanece en `status = 'cancelled'`. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-093 — Rechazar en API un `PATCH` directo de `status` sobre `/rest/v1/subscriptions` con la sesión del usuario

| Campo | Contenido |
|---|---|
| Historia · criterio | US-56 · CA-8 · US-58 · CA-6 · FR-17 · C5, C7 · ADR-030 |
| Invariante | I15 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 3: se creó una suscripción `<SUB_ID>` con `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription`.

**Datos de prueba:** D 1: Email `qa+cp-sus-093-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `id = "<SUB_ID>"`, body `{"status":"paused"}`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `PATCH <SUPABASE_URL>/rest/v1/subscriptions?id=eq.<SUB_ID>` con body `{"status":"paused"}` | Respuesta HTTP `403 Forbidden` con `"code": "42501"` (`permission denied for table subscriptions`) |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?id=eq.<SUB_ID>&select=status,paused_at` | Respuesta HTTP `200 OK` con `[{"status":"active","paused_at":null}]` |

**Post-condición:** La suscripción `<SUB_ID>` permanece en `status = 'active'`. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-094 — Rechazar en API `pause_subscription` usando la sesión de otro usuario (`404 P0002`)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-56 · CA-9 · FR-17 · C7 · ADR-030 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: con PR-05 se crearon Usuario A (`D 1`, `<ACCESS_TOKEN_A>`) y Usuario B (`D 2`, `<ACCESS_TOKEN_B>`, `<ACCOUNT_ID_B>`, `<CATEGORY_ID_B>`). S 2: con PR-04 usando `<ACCESS_TOKEN_B>` se creó una suscripción `<SUB_ID_B>` (`POST /rest/v1/rpc/create_subscription`).

**Datos de prueba:** D 1: Email A `qa+cp-sus-094-001@example.com` / Contraseña `Clave123!`. D 2: Email B `qa+cp-sus-094-002@example.com` / Contraseña `Clave123!`. D 3: `p_subscription_id = "<SUB_ID_B>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 usando `<ACCESS_TOKEN_A>` `POST <SUPABASE_URL>/rest/v1/rpc/pause_subscription` con body `{"p_subscription_id":"<SUB_ID_B>"}` | Respuesta HTTP `404 Not Found` con `"code": "P0002"` y `"message": "Suscripción no encontrada"` |
| 2 | Ejecutar con PR-08 usando `<ACCESS_TOKEN_B>` `GET <SUPABASE_URL>/rest/v1/subscriptions?id=eq.<SUB_ID_B>&select=status,paused_at` | Respuesta HTTP `200 OK` con `[{"status":"active","paused_at":null}]` |

**Post-condición:** La suscripción `<SUB_ID_B>` de Usuario B permanece activa. Los usuarios A y B quedan como datos de prueba (emails únicos, sin limpieza).

---

### CP-SUS-095 — Rechazar en API `pause_subscription` sin sesión autenticada (rol `anon`)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-56 · CA-9 · FR-17 · C7 · ADR-030 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: se obtuvo `<ANON_KEY>` con PR-04 (paso 1).

**Datos de prueba:** D 1: Header `Authorization: Bearer <ANON_KEY>`. D 2: Body `{"p_subscription_id":"00000000-0000-0000-0000-000000000001"}`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/pause_subscription` con headers `apikey: <ANON_KEY>` y `Authorization: Bearer <ANON_KEY>` y body `{"p_subscription_id":"00000000-0000-0000-0000-000000000001"}` | Respuesta HTTP `403 Forbidden` con `"code": "42501"` (`permission denied for function pause_subscription`) |

**Post-condición:** Ninguna suscripción es modificada. No requiere usuario.

---

### CP-SUS-096 — Reanudar suscripción pausada abre `resume-subscription-dialog`, pasa a `"Activa"`, limpia `paused_at`, conserva `generate_from_period = '<MES_SIGUIENTE>-01'` y no genera el mes actual

| Campo | Contenido |
|---|---|
| Historia · criterio | US-57 · CA-1, CA-2, CA-4, CA-5 · US-56 · CA-3 · FR-17 · R8 · ADR-030 |
| Invariante | I12, I15, I17 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción con 1 ocurrencia en `<MES_ANTERIOR>` y el mes corriente aún no cobrado (`POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_start_period":"<MES_ANTERIOR>-01","p_end_period":null,"p_description":null}`, `"generated": 1`) y luego se la pausó con `POST <SUPABASE_URL>/rest/v1/rpc/pause_subscription` (`{"p_subscription_id":"<SUB_ID>"}`), lo que dejó `status = 'paused'` y `generate_from_period = '<MES_SIGUIENTE>-01'`.

**Datos de prueba:** D 1: Email `qa+cp-sus-096-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Suscripción `"Netflix"` pausada con `generate_from_period = '<MES_SIGUIENTE>-01'` y 1 ocurrencia en `<MES_ANTERIOR>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-096-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-096-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en la fila `"Netflix"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) | Se abre `/subscriptions/<SUB_ID>`; `"Gastos cargados"` muestra 1 sola fila (`<MES_ANTERIOR>`) |
| 8 | Hacer click en el botón `"Reanudar"` (`subscription-detail-resume`) | Se abre el diálogo `resume-subscription-dialog` con el título `"¿Reanudar Netflix?"`, el texto `"No se cargan los meses en los que estuvo pausada."` seguido de `"Próximo cobro: 28/<MES_SIGUIENTE>."` y los botones `"Cancelar"` (`resume-subscription-dialog-cancel`) y `"Reanudar"` (`resume-subscription-dialog-confirm`) |
| 9 | Hacer click en el botón `"Reanudar"` (`resume-subscription-dialog-confirm`) | El diálogo se cierra, muestra el aviso `"Suscripción reanudada"` (`subscription-toast`), el estado (`subscription-detail-status`) cambia a `"Activa"` (`data-status="active"`), `"Próximo cobro"` (`subscription-detail-next-charge`) muestra `"28/<MES_SIGUIENTE>"` (coincidiendo con el diálogo), `"Reanudar"` se reemplaza por `"Pausar"` (`subscription-detail-pause`) y `"Gastos cargados"` conserva únicamente la ocurrencia de `<MES_ANTERIOR>` |
| 10 | Hacer click en el botón atrás (`subscription-detail-back`) | Navega a `/subscriptions`; `"Netflix"` aparece bajo el grupo `"Activas"` (`subscriptions-item` con `data-status="active"`) |

**Post-condición:** En `public.subscriptions`, `status = 'active'`, `paused_at IS NULL` y `generate_from_period = '<MES_SIGUIENTE>-01'` (`max('<MES_SIGUIENTE>-01', '<MES_ANTERIOR>-01', '<MES_ACTUAL>-01') = '<MES_SIGUIENTE>-01'`, `I12`, `I15`, `R8`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-097 — Reanudar suscripción pausada con `start_period` futuro (`<MES_MAS_3>`) conserva `generate_from_period = '<MES_MAS_3>-01'` y no genera gastos

| Campo | Contenido |
|---|---|
| Historia · criterio | US-57 · CA-3, CA-4, CA-5 · FR-17 · R8 · ADR-030 |
| Invariante | I12, I15, I17 |
| Técnica · Tipo | Análisis de valores límite · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción con `p_start_period: "<MES_MAS_3>-01"` y día `15` (`POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con `"p_name":"Futura Pro"`, `"p_amount":"5000.00"`, `"p_currency":"ARS"`, `"p_billing_day":15`, `"p_start_period":"<MES_MAS_3>-01"`, `"generated": 0`) y luego se la pausó con `POST <SUPABASE_URL>/rest/v1/rpc/pause_subscription` (`{"p_subscription_id":"<SUB_ID>"}`).

**Datos de prueba:** D 1: Email `qa+cp-sus-097-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Suscripción `"Futura Pro"` con `start_period = '<MES_MAS_3>-01'` en estado `"Pausada"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-097-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-097-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en la fila `"Futura Pro"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) | Se abre `/subscriptions/<SUB_ID>` |
| 8 | Hacer click en el botón `"Reanudar"` (`subscription-detail-resume`) | Se abre el diálogo `resume-subscription-dialog` con el texto `"No se cargan los meses en los que estuvo pausada. Próximo cobro: 15/<MES_MAS_3>."` |
| 9 | Hacer click en el botón `"Reanudar"` (`resume-subscription-dialog-confirm`) | El diálogo se cierra, muestra `"Suscripción reanudada"` (`subscription-toast`), el estado (`subscription-detail-status`) cambia a `"Activa"`, `"Próximo cobro"` (`subscription-detail-next-charge`) muestra `"15/<MES_MAS_3>"` y en `"Gastos cargados"` se lee `"Todavía no se cargó ningún gasto. El primero se carga el 15/<MES_MAS_3>."` (`subscription-detail-occurrences-empty`) |

**Post-condición:** En `public.subscriptions`, `status = 'active'`, `paused_at IS NULL` y `generate_from_period = '<MES_MAS_3>-01'` (`max(generate_from_period, start_period, current_period) = '<MES_MAS_3>-01'`, `I12`, `I15`, `R8`); en `public.transactions` existen 0 filas. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-098 — Rechazar en API `resume_subscription` sobre una suscripción que ya está en estado `active`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-57 · CA-6 · FR-17 · C6 · ADR-030 |
| Invariante | I15 |
| Técnica · Tipo | Transición de estados · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 3: se creó una suscripción activa `<SUB_ID>` con `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` (`"p_start_period":"<MES_SIGUIENTE>-01"`).

**Datos de prueba:** D 1: Email `qa+cp-sus-098-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_subscription_id = "<SUB_ID>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/resume_subscription` con body `{"p_subscription_id":"<SUB_ID>"}` sobre la suscripción activa | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "La suscripción no está pausada"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?id=eq.<SUB_ID>&select=status,generate_from_period` | Respuesta HTTP `200 OK` con `[{"status":"active","generate_from_period":"<MES_SIGUIENTE>-01"}]` |

**Post-condición:** La suscripción `<SUB_ID>` conserva su estado y `generate_from_period`. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-099 — Rechazar en API `resume_subscription` sobre una suscripción en estado `cancelled`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-57 · CA-6 · US-58 · CA-6 · FR-17 · C6 · ADR-030 |
| Invariante | I15 |
| Técnica · Tipo | Transición de estados · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 3: se creó y canceló una suscripción `<SUB_ID>` (`POST /rest/v1/rpc/create_subscription` y luego `POST /rest/v1/rpc/cancel_subscription`).

**Datos de prueba:** D 1: Email `qa+cp-sus-099-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_subscription_id = "<SUB_ID>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/resume_subscription` con body `{"p_subscription_id":"<SUB_ID>"}` sobre la suscripción cancelada | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "Una suscripción cancelada no se puede modificar"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?id=eq.<SUB_ID>&select=status,cancelled_at` | Respuesta HTTP `200 OK` con `"status": "cancelled"` y `"cancelled_at"` no nulo |

**Post-condición:** La suscripción `<SUB_ID>` permanece en `status = 'cancelled'`. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-100 — Rechazar en API `resume_subscription` usando la sesión de otro usuario (`404 P0002`)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-57 · CA-7 · FR-17 · C7 · ADR-030 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: con PR-05 se crearon Usuario A (`D 1`, `<ACCESS_TOKEN_A>`) y Usuario B (`D 2`, `<ACCESS_TOKEN_B>`, `<ACCOUNT_ID_B>`, `<CATEGORY_ID_B>`). S 2: con PR-04 usando `<ACCESS_TOKEN_B>` se creó y pausó una suscripción `<SUB_ID_B>`.

**Datos de prueba:** D 1: Email A `qa+cp-sus-100-001@example.com` / Contraseña `Clave123!`. D 2: Email B `qa+cp-sus-100-002@example.com` / Contraseña `Clave123!`. D 3: `p_subscription_id = "<SUB_ID_B>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 usando `<ACCESS_TOKEN_A>` `POST <SUPABASE_URL>/rest/v1/rpc/resume_subscription` con body `{"p_subscription_id":"<SUB_ID_B>"}` | Respuesta HTTP `404 Not Found` con `"code": "P0002"` y `"message": "Suscripción no encontrada"` |
| 2 | Ejecutar con PR-08 usando `<ACCESS_TOKEN_B>` `GET <SUPABASE_URL>/rest/v1/subscriptions?id=eq.<SUB_ID_B>&select=status` | Respuesta HTTP `200 OK` con `[{"status":"paused"}]` |

**Post-condición:** La suscripción `<SUB_ID_B>` de Usuario B permanece pausada. Los usuarios A y B quedan como datos de prueba (emails únicos, sin limpieza).

---

### CP-SUS-101 — Rechazar en API `resume_subscription` sin sesión autenticada (rol `anon`)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-57 · CA-7 · FR-17 · C7 · ADR-030 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: se obtuvo `<ANON_KEY>` con PR-04 (paso 1).

**Datos de prueba:** D 1: Header `Authorization: Bearer <ANON_KEY>`. D 2: Body `{"p_subscription_id":"00000000-0000-0000-0000-000000000001"}`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/resume_subscription` con headers `apikey: <ANON_KEY>` y `Authorization: Bearer <ANON_KEY>` y body `{"p_subscription_id":"00000000-0000-0000-0000-000000000001"}` | Respuesta HTTP `403 Forbidden` con `"code": "42501"` (`permission denied for function resume_subscription`) |

**Post-condición:** Ninguna suscripción es modificada. No requiere usuario.

---

### CP-SUS-102 — Cancelar suscripción activa con 4 gastos cargados mantiene el historial en el Detalle y en el Resumen y oculta los botones de acción

| Campo | Contenido |
|---|---|
| Historia · criterio | US-58 · CA-1, CA-2, CA-3, CA-5, CA-6 · FR-17 · C5, C10 · ADR-030 |
| Invariante | I1, I2, I10, I15 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción con 4 períodos vencidos (`<MES_HACE_4>` a `<MES_ANTERIOR>`): `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_start_period":"<MES_HACE_4>-01","p_end_period":null,"p_description":null}` (`"generated": 4`), guardando `subscription_id` como `<SUB_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-102-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Suscripción `"Netflix"` (`$5.000,00` ARS) con 4 gastos cargados (`<MES_HACE_4>`, `<MES_HACE_3>`, `<MES_HACE_2>` y `<MES_ANTERIOR>`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-102-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-102-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en la fila `"Netflix"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) | Se abre `/subscriptions/<SUB_ID>` |
| 8 | Hacer click en el botón `"Cancelar suscripción"` (`subscription-detail-cancel`) | Se abre el diálogo `cancel-subscription-dialog` con el título `"¿Cancelar Netflix?"`, el texto `"No se van a cargar más gastos. Los 4 gastos ya cargados se mantienen. No se puede deshacer: para volver a registrarla, creá una suscripción nueva."` y los botones `"Volver"` (`cancel-subscription-dialog-cancel`) y `"Cancelar suscripción"` (`cancel-subscription-dialog-confirm`) |
| 9 | Hacer click en el botón `"Cancelar suscripción"` (`cancel-subscription-dialog-confirm`) | El diálogo se cierra, muestra el aviso `"Suscripción cancelada"` (`subscription-toast`), el estado (`subscription-detail-status`) cambia a `"Cancelada el <HOY>"` (`data-status="cancelled"`), `"Próximo cobro"` (`subscription-detail-next-charge`) muestra `"—"`, desaparecen los botones `"Editar"`, `"Pausar"`, `"Reanudar"` y `"Cancelar suscripción"`, y `"Gastos cargados"` (`subscription-detail-occurrences`) conserva las 4 filas |
| 10 | Hacer click en el botón atrás (`subscription-detail-back`) | Navega a `/subscriptions`; `"Netflix"` aparece bajo el grupo `"Canceladas"` (`subscriptions-item` con `data-status="cancelled"`) |
| 11 | Hacer click en `"Resumen"` (`subscriptions-nav-dashboard`) | Se abre `/dashboard` |
| 12 | Seleccionar `<MES_ANTERIOR>` en el selector de período (`dashboard-period-select`) | La tarjeta `"Gastado en <mes corto anterior>"` (`dashboard-total-expenses`, ej. `"Gastado en septiembre"`) muestra `"$5.000,00"` |

**Post-condición:** En `public.subscriptions`, `status = 'cancelled'` y `cancelled_at IS NOT NULL` (`I15`); las 4 filas de `public.transactions` siguen activas (`deleted_at IS NULL`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-103 — Cancelar suscripción desde el estado `"Pausada"` (`paused -> cancelled`) fija `cancelled_at` y la mueve al grupo `"Canceladas"`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-58 · CA-1, CA-5, CA-6 · FR-17 · ADR-030 |
| Invariante | I15 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción con 1 ocurrencia en `<MES_ANTERIOR>` (`POST /rest/v1/rpc/create_subscription` con `"p_start_period":"<MES_ANTERIOR>-01"`, `"p_billing_day":28`, `"generated": 1`) y luego se la pausó con `POST <SUPABASE_URL>/rest/v1/rpc/pause_subscription` (`{"p_subscription_id":"<SUB_ID>"}`).

**Datos de prueba:** D 1: Email `qa+cp-sus-103-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Suscripción `"Netflix"` en estado `"Pausada"` con 1 gasto cargado.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-103-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-103-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en la fila `"Netflix"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) | Se abre `/subscriptions/<SUB_ID>`; el estado (`subscription-detail-status`) muestra `"Pausada desde <HOY>"` |
| 8 | Hacer click en el botón `"Cancelar suscripción"` (`subscription-detail-cancel`) | Se abre el diálogo `cancel-subscription-dialog` con el texto `"No se van a cargar más gastos. El gasto ya cargado se mantiene. No se puede deshacer: para volver a registrarla, creá una suscripción nueva."` |
| 9 | Hacer click en el botón `"Cancelar suscripción"` (`cancel-subscription-dialog-confirm`) | El diálogo se cierra, muestra `"Suscripción cancelada"` (`subscription-toast`), el estado (`subscription-detail-status`) cambia a `"Cancelada el <HOY>"` (`data-status="cancelled"`), `"Próximo cobro"` (`subscription-detail-next-charge`) muestra `"—"` y desaparecen todos los botones de acción |

**Post-condición:** En `public.subscriptions`, `status = 'cancelled'`, `cancelled_at IS NOT NULL` y `paused_at IS NOT NULL` (`I15`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-104 — `cancel_subscription` por API ejecuta primero la puesta al día y genera los meses vencidos pendientes antes de cancelar

| Campo | Contenido |
|---|---|
| Historia · criterio | US-58 · CA-1, CA-4 · FR-17 · R1 · ADR-030 |
| Invariante | I11, I14, I15, I17 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción en `USD` desde `<MES_HACE_2>` sin tipos de cambio aún (`POST /rest/v1/rpc/create_subscription` con `"p_name":"Netflix USD"`, `"p_amount":"10.00"`, `"p_currency":"USD"`, `"p_billing_day":28`, `"p_start_period":"<MES_HACE_2>-01"`, `"generated": 0`), guardando `subscription_id` como `<SUB_ID>`. S 5: se cargaron los tipos de cambio de `<MES_HACE_2>` y `<MES_ANTERIOR>` ejecutando con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/upsert_fx_rate` con `{"p_period":"<MES_HACE_2>-01","p_ars_per_usd":"1200.00"}` y `{"p_period":"<MES_ANTERIOR>-01","p_ars_per_usd":"1200.00"}`.

**Datos de prueba:** D 1: Email `qa+cp-sus-104-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Endpoint `POST <SUPABASE_URL>/rest/v1/rpc/cancel_subscription` con body `{"p_subscription_id":"<SUB_ID>"}`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/cancel_subscription` con body `{"p_subscription_id":"<SUB_ID>"}` | Respuesta HTTP `200 OK` con body `{"generated_before": 2}` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/transactions?subscription_id=eq.<SUB_ID>&select=subscription_period&order=subscription_period.asc` | Respuesta HTTP `200 OK` con 2 filas (`"subscription_period": "<MES_HACE_2>-01"` y `"subscription_period": "<MES_ANTERIOR>-01"`) |
| 3 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?id=eq.<SUB_ID>&select=status,cancelled_at` | Respuesta HTTP `200 OK` con `"status": "cancelled"` y `"cancelled_at"` no nulo |

**Post-condición:** Los 2 períodos vencidos fueron generados antes de cancelar `<SUB_ID>` (`I15`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-105 — Cancelar suscripción en USD bloqueada sin gastos cargados muestra `cancel-subscription-dialog-blocked-warning` y `"Todavía no se cargó ningún gasto."`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-58 · CA-5, CA-10 · US-62 · CA-5 · FR-17 · R6 · ADR-030 |
| Invariante | I15 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2` (sin tipos de cambio cargados). S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción en `USD` desde `<MES_ANTERIOR>` con día `28` (`POST /rest/v1/rpc/create_subscription` con `"p_name":"ChatGPT Plus"`, `"p_amount":"20.00"`, `"p_currency":"USD"`, `"p_billing_day":28`, `"p_start_period":"<MES_ANTERIOR>-01"`, `"generated": 0`), guardando `subscription_id` como `<SUB_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-105-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Suscripción `"ChatGPT Plus"` (`USD 20,00`) con 0 gastos cargados y `<MES_ANTERIOR>` bloqueado.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-105-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-105-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en la fila `"ChatGPT Plus"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) | Se abre `/subscriptions/<SUB_ID>` |
| 8 | Hacer click en el botón `"Cancelar suscripción"` (`subscription-detail-cancel`) | Se abre el diálogo `cancel-subscription-dialog` con el texto `"No se van a cargar más gastos. Todavía no se cargó ningún gasto. No se puede deshacer: para volver a registrarla, creá una suscripción nueva."` y la advertencia `cancel-subscription-dialog-blocked-warning` `"<Mes anterior> no se cargó por falta de tipo de cambio. Si la cancelás, ese mes no se va a cargar."` (ej. `"Septiembre 2026 no se cargó por falta de tipo de cambio. Si la cancelás, ese mes no se va a cargar."`) |
| 9 | Hacer click en el botón `"Cancelar suscripción"` (`cancel-subscription-dialog-confirm`) | El diálogo se cierra, muestra `"Suscripción cancelada"` (`subscription-toast`), el estado (`subscription-detail-status`) cambia a `"Cancelada el <HOY>"` y desaparece el aviso `subscription-detail-blocked` |

**Post-condición:** En `public.subscriptions`, `status = 'cancelled'` y en `public.transactions` existen 0 filas para `<SUB_ID>`. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-106 — Rechazar en API `cancel_subscription` sobre una suscripción que ya está en estado `cancelled`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-58 · CA-8 · FR-17 · C6 · ADR-030 |
| Invariante | I15 |
| Técnica · Tipo | Transición de estados · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 3: se creó y canceló una suscripción `<SUB_ID>` (`POST /rest/v1/rpc/create_subscription` y luego `POST /rest/v1/rpc/cancel_subscription`).

**Datos de prueba:** D 1: Email `qa+cp-sus-106-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_subscription_id = "<SUB_ID>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/cancel_subscription` con body `{"p_subscription_id":"<SUB_ID>"}` sobre la suscripción ya cancelada | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "Una suscripción cancelada no se puede modificar"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?id=eq.<SUB_ID>&select=status` | Respuesta HTTP `200 OK` con `[{"status":"cancelled"}]` |

**Post-condición:** La suscripción `<SUB_ID>` permanece en `status = 'cancelled'`. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-107 — Rechazar en API `cancel_subscription` usando la sesión de otro usuario (`404 P0002`)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-58 · CA-9 · FR-17 · C7 · ADR-030 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: con PR-05 se crearon Usuario A (`D 1`, `<ACCESS_TOKEN_A>`) y Usuario B (`D 2`, `<ACCESS_TOKEN_B>`, `<ACCOUNT_ID_B>`, `<CATEGORY_ID_B>`). S 2: con PR-04 usando `<ACCESS_TOKEN_B>` se creó una suscripción `<SUB_ID_B>`.

**Datos de prueba:** D 1: Email A `qa+cp-sus-107-001@example.com` / Contraseña `Clave123!`. D 2: Email B `qa+cp-sus-107-002@example.com` / Contraseña `Clave123!`. D 3: `p_subscription_id = "<SUB_ID_B>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 usando `<ACCESS_TOKEN_A>` `POST <SUPABASE_URL>/rest/v1/rpc/cancel_subscription` con body `{"p_subscription_id":"<SUB_ID_B>"}` | Respuesta HTTP `404 Not Found` con `"code": "P0002"` y `"message": "Suscripción no encontrada"` |
| 2 | Ejecutar con PR-08 usando `<ACCESS_TOKEN_B>` `GET <SUPABASE_URL>/rest/v1/subscriptions?id=eq.<SUB_ID_B>&select=status` | Respuesta HTTP `200 OK` con `[{"status":"active"}]` |

**Post-condición:** La suscripción `<SUB_ID_B>` de Usuario B permanece activa. Los usuarios A y B quedan como datos de prueba (emails únicos, sin limpieza).

---

### CP-SUS-108 — Rechazar en API `cancel_subscription` sin sesión autenticada (rol `anon`)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-58 · CA-9 · FR-17 · C7 · ADR-030 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: se obtuvo `<ANON_KEY>` con PR-04 (paso 1).

**Datos de prueba:** D 1: Header `Authorization: Bearer <ANON_KEY>`. D 2: Body `{"p_subscription_id":"00000000-0000-0000-0000-000000000001"}`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/cancel_subscription` con headers `apikey: <ANON_KEY>` y `Authorization: Bearer <ANON_KEY>` y body `{"p_subscription_id":"00000000-0000-0000-0000-000000000001"}` | Respuesta HTTP `403 Forbidden` con `"code": "42501"` (`permission denied for function cancel_subscription`) |

**Post-condición:** Ninguna suscripción es modificada. No requiere usuario.
---

### CP-SUS-109 — Editar el monto de una suscripción activa de `$5.000,00` a `$7.000,00` conserva las 4 ocurrencias ya generadas en `$5.000,00` y muestra Moneda y Mes de inicio como solo lectura

| Campo | Contenido |
|---|---|
| Historia · criterio | US-59 · CA-1, CA-5, CA-7 · FR-17 · R7 · C5 · ADR-030, ADR-032 |
| Invariante | I1, I2, I4, I11, I14 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción con 4 períodos vencidos (`<MES_HACE_4>` a `<MES_ANTERIOR>`): `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_start_period":"<MES_HACE_4>-01","p_end_period":null,"p_description":null}` (`"generated": 4`), guardando `subscription_id` como `<SUB_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-109-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Suscripción `"Netflix"` con monto original `"5000.00"` y 4 ocurrencias generadas. D 4: Nuevo monto `"7000"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-109-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-109-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en la fila `"Netflix"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) | Se abre `/subscriptions/<SUB_ID>` |
| 8 | Hacer click en el botón `"Editar"` (`subscription-detail-edit`) | Se abre `/subscriptions/<SUB_ID>/edit` mostrando el aviso fijo `"Los cambios aplican desde el próximo cobro. Los gastos ya cargados no cambian."`, y `"Moneda"` (`subscription-form-currency-readonly`) y `"Mes de inicio"` (`subscription-form-start-period-readonly`) como texto de solo lectura |
| 9 | Reemplazar `5000` por `7000` en `"Monto"` (`subscription-form-amount`) | El campo `"Monto"` muestra `7000` y `"Próximo cobro"` (`subscription-form-next-charge`) muestra `"Próximo cobro: 28/<MES_ACTUAL> por $7.000,00"` |
| 10 | Hacer click en `"Guardar cambios"` (`subscription-form-submit`) | Navega a `/subscriptions/<SUB_ID>`, muestra el aviso `"Cambios guardados"` (`subscription-toast`), en `"Datos"` la fila `"Monto"` muestra `"$7.000,00"` y en `"Gastos cargados"` (`subscription-detail-occurrences`) las 4 filas existentes (`<MES_ANTERIOR>`, `<MES_HACE_2>`, `<MES_HACE_3>` y `<MES_HACE_4>`) siguen mostrando `"$5.000,00"` |

**Post-condición:** En `public.subscriptions`, `amount = 7000.00`; las 4 filas de `public.transactions` y sus filas en `public.ledger_entries` conservan `amount = 5000.00` y `amount_ars = 5000.00` (`I1`, `I2`, `R7`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-110 — `update_subscription` por API genera primero los meses vencidos pendientes con el monto anterior antes de guardar el monto nuevo

| Campo | Contenido |
|---|---|
| Historia · criterio | US-59 · CA-2 · FR-17 · R7 · C5 · ADR-030 |
| Invariante | I1, I2, I4, I5, I11, I14, I17 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción en `USD` desde `<MES_HACE_2>` con monto original `"10.00"` antes de cargar tipos de cambio (`POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix USD","p_amount":"10.00","p_currency":"USD","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_start_period":"<MES_HACE_2>-01","p_end_period":null,"p_description":null}`, `"generated": 0`), guardando `subscription_id` como `<SUB_ID>`. S 5: se cargaron por API los tipos de cambio de `<MES_HACE_2>` y `<MES_ANTERIOR>` ejecutando con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/upsert_fx_rate` con `{"p_period":"<MES_HACE_2>-01","p_ars_per_usd":"1200.00"}` y `{"p_period":"<MES_ANTERIOR>-01","p_ars_per_usd":"1200.00"}`.

**Datos de prueba:** D 1: Email `qa+cp-sus-110-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Monto original `"10.00"` USD. D 4: Monto nuevo `"15.00"` USD en `update_subscription`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/update_subscription` con body `{"p_subscription_id":"<SUB_ID>","p_name":"Netflix USD","p_amount":"15.00","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_end_period":null,"p_description":null}` | Respuesta HTTP `200 OK` con body `{"generated_before": 2, "generated_after": 0}` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/transactions?subscription_id=eq.<SUB_ID>&select=subscription_period,amount_text:amount::text&order=subscription_period.asc` | Respuesta HTTP `200 OK` con 2 filas (`"subscription_period": "<MES_HACE_2>-01"` y `"subscription_period": "<MES_ANTERIOR>-01"`), ambas con `"amount_text": "10.00"` (el monto anterior) |
| 3 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?id=eq.<SUB_ID>&select=amount_text:amount::text` | Respuesta HTTP `200 OK` con `[{"amount_text":"15.00"}]` |

**Post-condición:** Las 2 ocurrencias vencidas fueron generadas con `10.00` USD (`amount_ars = 12000.00`) antes de aplicar el cambio a `15.00` USD (`R7`, `ADR-030`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-111 — Editar la categoría y el medio de pago de una suscripción no modifica las transacciones ya generadas

| Campo | Contenido |
|---|---|
| Historia · criterio | US-59 · CA-3 · FR-17 · R7 · C5 · ADR-030, ADR-032 |
| Invariante | I1, I2, I8, I14 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2` (que incluye las categorías `"Entretenimiento"` y `"Salud"` y las cuentas `"Efectivo"` y `"Cuenta bancaria"`). S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` (`"Efectivo"`) y `<CATEGORY_ID>` (`"Entretenimiento"`). S 4: se creó una suscripción con 1 ocurrencia en `<MES_ANTERIOR>`: `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_start_period":"<MES_ANTERIOR>-01","p_end_period":null,"p_description":null}` (`"generated": 1`), guardando `subscription_id` como `<SUB_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-111-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nueva categoría `"Salud"`. D 4: Nuevo medio de pago `"Cuenta bancaria"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-111-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-111-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en la fila `"Netflix"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) | Se abre `/subscriptions/<SUB_ID>` |
| 8 | Hacer click en `"Editar"` (`subscription-detail-edit`) | Se abre `/subscriptions/<SUB_ID>/edit` |
| 9 | Seleccionar `"Salud"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Salud"` |
| 10 | Seleccionar `"Cuenta bancaria"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Cuenta bancaria"` |
| 11 | Hacer click en `"Guardar cambios"` (`subscription-form-submit`) | Navega a `/subscriptions/<SUB_ID>`, muestra `"Cambios guardados"` (`subscription-toast`) y en `"Datos"` (`subscription-detail-data`) `"Categoría"` muestra `"Salud"` y `"Medio de pago"` muestra `"Cuenta bancaria"` |
| 12 | Hacer click en `"Movimientos"` (`subscription-detail-nav-transactions`) | Se abre `/transactions` |
| 13 | Seleccionar `<MES_ANTERIOR>` en el selector de período (`transactions-period-select`) | La transacción de `<MES_ANTERIOR>` sigue mostrando la categoría `"Entretenimiento"` y el medio de pago `"Efectivo"` |

**Post-condición:** En `public.transactions`, la fila de `<MES_ANTERIOR>-01` conserva `category_id = <CATEGORY_ID>` y `account_id = <ACCOUNT_ID>` (`C5`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-112 — Editar el nombre de `"Netflix"` a `"Netflix 4K"` mantiene la descripción `"Netflix"` en la transacción anterior y muestra `"Netflix 4K"` en la marca de Movimientos

| Campo | Contenido |
|---|---|
| Historia · criterio | US-59 · CA-4 · US-61 · CA-3 · FR-16, FR-17 · C5 · ADR-030 |
| Invariante | I14 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción con 1 ocurrencia en `<MES_ANTERIOR>`: `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_start_period":"<MES_ANTERIOR>-01","p_end_period":null,"p_description":null}` (`"generated": 1`, la transacción quedó con `description = "Netflix"`), guardando `subscription_id` como `<SUB_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-112-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nuevo nombre `"Netflix 4K"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-112-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-112-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en la fila `"Netflix"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) | Se abre `/subscriptions/<SUB_ID>` |
| 8 | Hacer click en `"Editar"` (`subscription-detail-edit`) | Se abre `/subscriptions/<SUB_ID>/edit` |
| 9 | Reemplazar `Netflix` por `Netflix 4K` en `"Nombre"` (`subscription-form-name`) | El campo `"Nombre"` muestra `Netflix 4K` |
| 10 | Hacer click en `"Guardar cambios"` (`subscription-form-submit`) | Navega a `/subscriptions/<SUB_ID>`, muestra `"Cambios guardados"` (`subscription-toast`) y el encabezado (`subscription-detail-name`) muestra `"Netflix 4K"` |
| 11 | Hacer click en `"Movimientos"` (`subscription-detail-nav-transactions`) | Se abre `/transactions` |
| 12 | Seleccionar `<MES_ANTERIOR>` en el selector de período (`transactions-period-select`) | En la fila del movimiento (`transactions-item`), la descripción sigue diciendo `"Netflix"` y la marca de suscripción (`transactions-item-subscription`) muestra el nombre nuevo `"Netflix 4K"` |

**Post-condición:** En `public.subscriptions`, `name = 'Netflix 4K'`; en `public.transactions`, la fila de `<MES_ANTERIOR>-01` conserva `description = 'Netflix'` (`C5`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-113 — Editar el día de cobro de `28` a `1` cuando el mes corriente aún no se había generado crea al guardar la ocurrencia del mes corriente con los datos nuevos

| Campo | Contenido |
|---|---|
| Historia · criterio | US-59 · CA-3, CA-12 · FR-17 · R5, R7 · ADR-030 |
| Invariante | I1, I2, I4, I11, I13, I14, I17 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción en `<MES_ACTUAL>` con día `28` (`> <DIA_HOY>`, por lo que aún tiene 0 ocurrencias): `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_start_period":"<MES_ACTUAL>-01","p_end_period":null,"p_description":null}` (`"generated": 0`), guardando `subscription_id` como `<SUB_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-113-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nuevo monto `"7500"`. D 4: Nuevo día de cobro `"1"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-113-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-113-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en la fila `"Netflix"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) | Se abre `/subscriptions/<SUB_ID>` |
| 8 | Hacer click en `"Editar"` (`subscription-detail-edit`) | Se abre `/subscriptions/<SUB_ID>/edit` |
| 9 | Reemplazar `5000` por `7500` en `"Monto"` (`subscription-form-amount`) | El campo `"Monto"` muestra `7500` |
| 10 | Reemplazar `28` por `1` en `"Día de cobro"` (`subscription-form-billing-day`) | El campo `"Día de cobro"` muestra `1` y `subscription-form-next-charge` muestra `"Al guardar se carga <mes actual> (01/<MES_ACTUAL>) por $7.500,00"` |
| 11 | Hacer click en `"Guardar cambios"` (`subscription-form-submit`) | Navega a `/subscriptions/<SUB_ID>`, muestra el aviso `"Cambios guardados. Se cargó el gasto de <mes actual> con los datos nuevos."` (`subscription-toast`, ej. `"Cambios guardados. Se cargó el gasto de octubre 2026 con los datos nuevos."`) y en `"Gastos cargados"` (`subscription-detail-occurrences`) aparece la ocurrencia de `<MES_ACTUAL>` con fecha `01/<MES_ACTUAL>` y monto `"$7.500,00"` |

**Post-condición:** En `public.transactions` existe 1 fila para `<SUB_ID>` con `subscription_period = '<MES_ACTUAL>-01'`, `occurred_on = '<MES_ACTUAL>-01'` y `amount = 7500.00`. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-114 — Rechazar en API enviar `p_currency` en `update_subscription`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-59 · CA-5 · FR-17 · C6 · ADR-030, ADR-032 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 3: se creó una suscripción en `ARS` `<SUB_ID>` con `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription`.

**Datos de prueba:** D 1: Email `qa+cp-sus-114-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_currency = "USD"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/update_subscription` con body `{"p_subscription_id":"<SUB_ID>","p_name":"Netflix","p_amount":"5000.00","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_end_period":null,"p_description":null,"p_currency":"USD"}` | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "La moneda y el mes de inicio no se pueden cambiar"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?id=eq.<SUB_ID>&select=currency` | Respuesta HTTP `200 OK` con `[{"currency":"ARS"}]` |

**Post-condición:** La suscripción `<SUB_ID>` conserva `currency = 'ARS'`. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-115 — Rechazar en API enviar `p_start_period` en `update_subscription`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-59 · CA-5 · FR-17 · C6 · ADR-030, ADR-032 |
| Invariante | I12 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 3: se creó una suscripción `<SUB_ID>` con `p_start_period: "<MES_ACTUAL>-01"`.

**Datos de prueba:** D 1: Email `qa+cp-sus-115-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_start_period = "<MES_SIGUIENTE>-01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/update_subscription` con body `{"p_subscription_id":"<SUB_ID>","p_name":"Netflix","p_amount":"5000.00","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_end_period":null,"p_description":null,"p_start_period":"<MES_SIGUIENTE>-01"}` | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "La moneda y el mes de inicio no se pueden cambiar"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?id=eq.<SUB_ID>&select=start_period` | Respuesta HTTP `200 OK` con `[{"start_period":"<MES_ACTUAL>-01"}]` |

**Post-condición:** La suscripción `<SUB_ID>` conserva `start_period = '<MES_ACTUAL>-01'`. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-116 — Rechazar en UI editar el Mes de fin de una suscripción activa a un período pasado (`<MES_ANTERIOR>`)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-59 · CA-6 · FR-17 · C6 · ADR-032 |
| Invariante | I12 |
| Técnica · Tipo | Análisis de valores límite · Negativo |
| Canal · Caso par | UI · CP-SUS-117 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción desde `<MES_HACE_2>` sin fin (`POST /rest/v1/rpc/create_subscription` con `"p_start_period":"<MES_HACE_2>-01"`, `"p_end_period":null`), guardando `subscription_id` como `<SUB_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-116-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Mes de fin `"<MES_ANTERIOR>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-116-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-116-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en la fila `"Netflix"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) | Se abre `/subscriptions/<SUB_ID>` |
| 8 | Hacer click en `"Editar"` (`subscription-detail-edit`) | Se abre `/subscriptions/<SUB_ID>/edit` |
| 9 | Ingresar `<MES_ANTERIOR>` en `"Mes de fin (opcional)"` (`subscription-form-end-period`) | `"Mes de fin (opcional)"` muestra `<MES_ANTERIOR>` |
| 10 | Hacer click en `"Guardar cambios"` (`subscription-form-submit`) | La URL sigue siendo `/subscriptions/<SUB_ID>/edit` y debajo de `"Mes de fin (opcional)"` aparece `"El mes de fin no puede ser anterior a <mes actual>"` (ej. `"El mes de fin no puede ser anterior a octubre 2026"`) |

**Post-condición:** En `public.subscriptions`, `<SUB_ID>` conserva `end_period IS NULL`. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-117 — Rechazar en API `update_subscription` con `p_end_period` anterior al período corriente (`<MES_ANTERIOR>-01`)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-59 · CA-6 · FR-17 · C6 · ADR-030, ADR-032 |
| Invariante | I12 |
| Técnica · Tipo | Análisis de valores límite · Negativo |
| Canal · Caso par | API · CP-SUS-116 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 3: se creó una suscripción `<SUB_ID>` desde `<MES_HACE_2>-01` con `p_end_period: null`.

**Datos de prueba:** D 1: Email `qa+cp-sus-117-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_end_period = "<MES_ANTERIOR>-01"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/update_subscription` con body `{"p_subscription_id":"<SUB_ID>","p_name":"Netflix","p_amount":"5000.00","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_end_period":"<MES_ANTERIOR>-01","p_description":null}` | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "El mes de fin no puede ser anterior a <mes actual>"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?id=eq.<SUB_ID>&select=end_period` | Respuesta HTTP `200 OK` con `[{"end_period":null}]` |

**Post-condición:** En `public.subscriptions`, `<SUB_ID>` conserva `end_period IS NULL`. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-118 — Rechazar en UI renombrar una suscripción poniéndole el nombre de otra suscripción activa del mismo usuario

| Campo | Contenido |
|---|---|
| Historia · criterio | US-59 · CA-7 · US-52 · CA-7 · FR-17 · C6 · ADR-032 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · CP-SUS-119 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se crearon dos suscripciones activas con `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription`: `"Spotify"` (`<SUB_SPOTIFY>`) y `"Netflix"` (`<SUB_NETFLIX>`).

**Datos de prueba:** D 1: Email `qa+cp-sus-118-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre duplicado `"Spotify"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-118-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-118-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en la fila `"Netflix"` (`subscriptions-item` con `data-subscription-id="<SUB_NETFLIX>"`) | Se abre `/subscriptions/<SUB_NETFLIX>` |
| 8 | Hacer click en `"Editar"` (`subscription-detail-edit`) | Se abre `/subscriptions/<SUB_NETFLIX>/edit` |
| 9 | Reemplazar `Netflix` por `Spotify` en `"Nombre"` (`subscription-form-name`) | El campo `"Nombre"` muestra `Spotify` |
| 10 | Hacer click en `"Guardar cambios"` (`subscription-form-submit`) | La URL sigue siendo `/subscriptions/<SUB_NETFLIX>/edit` y debajo de `"Nombre"` aparece `"Ya tenés una suscripción con ese nombre"` |

**Post-condición:** En `public.subscriptions`, `<SUB_NETFLIX>` conserva `name = 'Netflix'`. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-119 — Rechazar en API `update_subscription` renombrando una suscripción con el nombre de otra activa del mismo usuario

| Campo | Contenido |
|---|---|
| Historia · criterio | US-59 · CA-7 · US-52 · CA-7 · FR-17 · C6 · ADR-030, ADR-032 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · CP-SUS-118 |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 3: se crearon dos suscripciones activas: `"Spotify"` (`<SUB_SPOTIFY>`) y `"Netflix"` (`<SUB_NETFLIX>`).

**Datos de prueba:** D 1: Email `qa+cp-sus-119-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_name = "Spotify"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/update_subscription` con body `{"p_subscription_id":"<SUB_NETFLIX>","p_name":"Spotify","p_amount":"5000.00","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_end_period":null,"p_description":null}` | Respuesta HTTP `409 Conflict` con `"code": "23505"` y `"message": "Ya tenés una suscripción con ese nombre"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?id=eq.<SUB_NETFLIX>&select=name` | Respuesta HTTP `200 OK` con `[{"name":"Netflix"}]` |

**Post-condición:** En `public.subscriptions`, `<SUB_NETFLIX>` conserva `name = 'Netflix'`. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-120 — Rechazar en UI editar una suscripción cancelada al navegar directo a `/subscriptions/<SUB_ID>/edit`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-59 · CA-8 · US-58 · CA-6 · FR-17 |
| Invariante | I15 |
| Técnica · Tipo | Transición de estados · Negativo |
| Canal · Caso par | UI · CP-SUS-121 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó y canceló una suscripción `<SUB_ID>` (`POST /rest/v1/rpc/create_subscription` y luego `POST /rest/v1/rpc/cancel_subscription`).

**Datos de prueba:** D 1: Email `qa+cp-sus-120-001@example.com`. D 2: Contraseña `Clave123!`. D 3: URL `<APP>/subscriptions/<SUB_ID>/edit`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-120-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-120-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Navegar a `<APP>/subscriptions/<SUB_ID>/edit` | No se muestra el formulario editable; se muestra el texto `"Esta suscripción está cancelada y no se puede editar."` y el enlace `"Volver"` (`subscription-form-cancelled-back`) que apunta a `/subscriptions/<SUB_ID>` |

**Post-condición:** La suscripción `<SUB_ID>` sigue en `status = 'cancelled'`. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-121 — Rechazar en API `update_subscription` sobre una suscripción en estado `cancelled`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-59 · CA-8 · US-58 · CA-6 · FR-17 · C6 · ADR-030 |
| Invariante | I15 |
| Técnica · Tipo | Transición de estados · Negativo |
| Canal · Caso par | API · CP-SUS-120 |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 3: se creó y canceló una suscripción `<SUB_ID>` con monto `"5000.00"`.

**Datos de prueba:** D 1: Email `qa+cp-sus-121-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_amount = "9000.00"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/update_subscription` con body `{"p_subscription_id":"<SUB_ID>","p_name":"Netflix","p_amount":"9000.00","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_end_period":null,"p_description":null}` | Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "Una suscripción cancelada no se puede modificar"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?id=eq.<SUB_ID>&select=status,amount_text:amount::text` | Respuesta HTTP `200 OK` con `[{"status":"cancelled","amount_text":"5000.00"}]` |

**Post-condición:** La suscripción `<SUB_ID>` conserva `status = 'cancelled'` y `amount = 5000.00`. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-122 — Rechazar en API un `PATCH` directo de `amount` sobre `/rest/v1/subscriptions` con la sesión del usuario

| Campo | Contenido |
|---|---|
| Historia · criterio | US-59 · CA-9 · FR-17 · C5, C7 · ADR-030 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 3: se creó una suscripción `<SUB_ID>` con `p_amount: "5000.00"`.

**Datos de prueba:** D 1: Email `qa+cp-sus-122-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Body `{"amount":"9000.00"}`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `PATCH <SUPABASE_URL>/rest/v1/subscriptions?id=eq.<SUB_ID>` con body `{"amount":"9000.00"}` | Respuesta HTTP `403 Forbidden` con `"code": "42501"` (`permission denied for table subscriptions`) |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?id=eq.<SUB_ID>&select=amount_text:amount::text` | Respuesta HTTP `200 OK` con `[{"amount_text":"5000.00"}]` |

**Post-condición:** En `public.subscriptions`, `<SUB_ID>` conserva `amount = 5000.00`. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-123 — Editar el monto de una suscripción cuya categoría actual fue archivada permite guardar conservando `"Entretenimiento (archivada)"`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-59 · CA-10 · FR-17 · ADR-030, ADR-032 |
| Invariante | I4, I8 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>` (`"Entretenimiento"`). S 4: se creó una suscripción `<SUB_ID>` con `p_category_id: "<CATEGORY_ID>"` y `p_amount: "5000.00"`, y luego se archivó `<CATEGORY_ID>` ejecutando con PR-04 `PATCH <SUPABASE_URL>/rest/v1/categories?id=eq.<CATEGORY_ID>` con body `{"archived_at":"2026-01-01T00:00:00Z"}`.

**Datos de prueba:** D 1: Email `qa+cp-sus-123-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nuevo monto `"6500"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-123-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-123-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en la fila `"Netflix"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) | Se abre `/subscriptions/<SUB_ID>` |
| 8 | Hacer click en `"Editar"` (`subscription-detail-edit`) | Se abre `/subscriptions/<SUB_ID>/edit`; `"Categoría"` (`subscription-form-category`) muestra seleccionada `"Entretenimiento (archivada)"` |
| 9 | Reemplazar `5000` por `6500` en `"Monto"` (`subscription-form-amount`) | El campo `"Monto"` muestra `6500` |
| 10 | Hacer click en `"Guardar cambios"` (`subscription-form-submit`) | Navega a `/subscriptions/<SUB_ID>`, muestra `"Cambios guardados"` (`subscription-toast`) y en `"Datos"` la fila `"Monto"` muestra `"$6.500,00"` |

**Post-condición:** En `public.subscriptions`, `<SUB_ID>` tiene `amount = 6500.00` y conserva `category_id = <CATEGORY_ID>`. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-124 — Rechazar en API cambiar `p_category_id` en `update_subscription` a otra categoría archivada distinta de la actual

| Campo | Contenido |
|---|---|
| Historia · criterio | US-59 · CA-10 · FR-17 · C6 · ADR-030, ADR-032 |
| Invariante | I8 |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>`, `<CAT_ENTRETENIMIENTO>` y `<CAT_SALUD>`. S 3: se creó una suscripción `<SUB_ID>` con `p_category_id: "<CAT_ENTRETENIMIENTO>"`. S 4: se archivó `<CAT_SALUD>` ejecutando con PR-04 `PATCH <SUPABASE_URL>/rest/v1/categories?id=eq.<CAT_SALUD>` con body `{"archived_at":"2026-01-01T00:00:00Z"}`.

**Datos de prueba:** D 1: Email `qa+cp-sus-124-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_category_id = "<CAT_SALUD>"` (archivada, distinta de la actual).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/update_subscription` con body `{"p_subscription_id":"<SUB_ID>","p_name":"Netflix","p_amount":"5000.00","p_category_id":"<CAT_SALUD>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_end_period":null,"p_description":null}` | Respuesta HTTP `409 Conflict` con `"code": "23503"` y `"message": "La categoría no está disponible"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?id=eq.<SUB_ID>&select=category_id` | Respuesta HTTP `200 OK` con `[{"category_id":"<CAT_ENTRETENIMIENTO>"}]` |

**Post-condición:** En `public.subscriptions`, `<SUB_ID>` conserva `category_id = <CAT_ENTRETENIMIENTO>`. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-125 — Editar el monto de una suscripción cuyo medio de pago actual fue archivado permite guardar conservando `"Efectivo (archivada)"`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-59 · CA-10 · FR-17 · ADR-030, ADR-032 |
| Invariante | I4 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2` (que tiene las cuentas `"Efectivo"` y `"Cuenta bancaria"`). S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACC_EFECTIVO>` y `<CATEGORY_ID>`. S 4: se creó una suscripción `<SUB_ID>` con `p_account_id: "<ACC_EFECTIVO>"` y `p_amount: "5000.00"`, y luego se archivó `<ACC_EFECTIVO>` ejecutando con PR-04 `PATCH <SUPABASE_URL>/rest/v1/accounts?id=eq.<ACC_EFECTIVO>` con body `{"archived_at":"2026-01-01T00:00:00Z"}` (quedando `"Cuenta bancaria"` activa).

**Datos de prueba:** D 1: Email `qa+cp-sus-125-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nuevo monto `"6500"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-125-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-125-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en la fila `"Netflix"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) | Se abre `/subscriptions/<SUB_ID>` |
| 8 | Hacer click en `"Editar"` (`subscription-detail-edit`) | Se abre `/subscriptions/<SUB_ID>/edit`; `"Medio de pago"` (`subscription-form-account`) muestra seleccionado `"Efectivo (archivada)"` |
| 9 | Reemplazar `5000` por `6500` en `"Monto"` (`subscription-form-amount`) | El campo `"Monto"` muestra `6500` |
| 10 | Hacer click en `"Guardar cambios"` (`subscription-form-submit`) | Navega a `/subscriptions/<SUB_ID>`, muestra `"Cambios guardados"` (`subscription-toast`) y en `"Datos"` la fila `"Monto"` muestra `"$6.500,00"` |

**Post-condición:** En `public.subscriptions`, `<SUB_ID>` tiene `amount = 6500.00` y conserva `account_id = <ACC_EFECTIVO>`. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-126 — Rechazar en API cambiar `p_account_id` en `update_subscription` a otra cuenta archivada distinta de la actual

| Campo | Contenido |
|---|---|
| Historia · criterio | US-59 · CA-10 · FR-17 · C6 · ADR-030, ADR-032 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 2: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<CATEGORY_ID>`, `<ACC_EFECTIVO>` y `<ACC_BANCO>` (`"Cuenta bancaria"`). S 3: se creó una suscripción `<SUB_ID>` con `p_account_id: "<ACC_EFECTIVO>"`. S 4: se archivó `<ACC_BANCO>` ejecutando con PR-04 `PATCH <SUPABASE_URL>/rest/v1/accounts?id=eq.<ACC_BANCO>` con body `{"archived_at":"2026-01-01T00:00:00Z"}`.

**Datos de prueba:** D 1: Email `qa+cp-sus-126-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `p_account_id = "<ACC_BANCO>"` (archivada, distinta de la actual).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/update_subscription` con body `{"p_subscription_id":"<SUB_ID>","p_name":"Netflix","p_amount":"5000.00","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACC_BANCO>","p_billing_day":28,"p_end_period":null,"p_description":null}` | Respuesta HTTP `409 Conflict` con `"code": "23503"` y `"message": "El medio de pago no está disponible"` |
| 2 | Ejecutar con PR-08 `GET <SUPABASE_URL>/rest/v1/subscriptions?id=eq.<SUB_ID>&select=account_id` | Respuesta HTTP `200 OK` con `[{"account_id":"<ACC_EFECTIVO>"}]` |

**Post-condición:** En `public.subscriptions`, `<SUB_ID>` conserva `account_id = <ACC_EFECTIVO>`. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-127 — Editar la descripción de una suscripción terminada (`end_period = <MES_HACE_2>`) sin tocar el Mes de fin permite guardar

| Campo | Contenido |
|---|---|
| Historia · criterio | US-59 · CA-11 · FR-17 · ADR-030, ADR-032 |
| Invariante | I12 |
| Técnica · Tipo | Análisis de valores límite · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción terminada (`<MES_HACE_3>` a `<MES_HACE_2>`): `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Curso","p_amount":"8000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":10,"p_start_period":"<MES_HACE_3>-01","p_end_period":"<MES_HACE_2>-01","p_description":null}` (`"generated": 2`), guardando `subscription_id` como `<SUB_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-127-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nueva descripción `"Curso finalizado"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-127-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-127-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en la fila `"Curso"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) | Se abre `/subscriptions/<SUB_ID>` |
| 8 | Hacer click en `"Editar"` (`subscription-detail-edit`) | Se abre `/subscriptions/<SUB_ID>/edit`; `"Mes de fin (opcional)"` (`subscription-form-end-period`) muestra `<MES_HACE_2>` y `subscription-form-next-charge` muestra `"No hay más cobros: terminó en <mes hace 2>."` |
| 9 | Escribir `Curso finalizado` en `"Descripción (opcional)"` (`subscription-form-description`) | El campo muestra `Curso finalizado` |
| 10 | Hacer click en `"Guardar cambios"` (`subscription-form-submit`) | Navega a `/subscriptions/<SUB_ID>`, muestra `"Cambios guardados"` (`subscription-toast`), en `"Datos"` `"Descripción"` muestra `"Curso finalizado"` y `"Próximo cobro"` (`subscription-detail-next-charge`) muestra `"—"` |

**Post-condición:** En `public.subscriptions`, `<SUB_ID>` conserva `end_period = '<MES_HACE_2>-01'` y actualiza `description = 'Curso finalizado'`. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-128 — Extender una suscripción terminada (`end_period = <MES_HACE_2>`) tocando `"Sin fin"` mueve `generate_from_period` al período corriente sin rellenar `<MES_ANTERIOR>`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-59 · CA-11 · FR-17 · R1, R8 · ADR-030, ADR-032 |
| Invariante | I11, I12, I17 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción terminada (`<MES_HACE_3>` a `<MES_HACE_2>`, día `28`): `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Curso","p_amount":"8000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_start_period":"<MES_HACE_3>-01","p_end_period":"<MES_HACE_2>-01","p_description":null}` (`"generated": 2`), guardando `subscription_id` como `<SUB_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-128-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Botón `"Sin fin"` (`subscription-form-end-period-clear`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-128-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-128-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en la fila `"Curso"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) | Se abre `/subscriptions/<SUB_ID>` |
| 8 | Hacer click en `"Editar"` (`subscription-detail-edit`) | Se abre `/subscriptions/<SUB_ID>/edit`; debajo de `"Mes de fin (opcional)"` se lee `"Terminó en <mes hace 2>. Si la extendés, los meses entre <mes hace 2> y <mes actual> no se cargan."` |
| 9 | Hacer click en el botón `"Sin fin"` (`subscription-form-end-period-clear`) | El campo `"Mes de fin (opcional)"` (`subscription-form-end-period`) queda vacío y `subscription-form-next-charge` muestra `"Próximo cobro: 28/<MES_ACTUAL> por $8.000,00"` |
| 10 | Hacer click en `"Guardar cambios"` (`subscription-form-submit`) | Navega a `/subscriptions/<SUB_ID>`, muestra `"Cambios guardados"` (`subscription-toast`), en `"Datos"` `"Hasta"` muestra `"Sin fin"`, `"Próximo cobro"` (`subscription-detail-next-charge`) muestra `"28/<MES_ACTUAL>"` y en `"Gastos cargados"` (`subscription-detail-occurrences`) siguen existiendo únicamente las 2 ocurrencias originales (`<MES_HACE_2>` y `<MES_HACE_3>`), sin haberse creado `<MES_ANTERIOR>` |

**Post-condición:** En `public.subscriptions`, `<SUB_ID>` tiene `end_period IS NULL` y `generate_from_period = '<MES_ACTUAL>-01'` (`I12`, `I17`, `R8`); en `public.transactions` siguen existiendo solo 2 filas (`<MES_HACE_3>-01` y `<MES_HACE_2>-01`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-129 — Rechazar en API `update_subscription` usando la sesión de otro usuario (`404 P0002`)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-59 · CA-13 · FR-17 · C7 · ADR-030 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: con PR-05 se crearon Usuario A (`D 1`, `<ACCESS_TOKEN_A>`, `<ACCOUNT_ID_A>`, `<CATEGORY_ID_A>`) y Usuario B (`D 2`, `<ACCESS_TOKEN_B>`, `<ACCOUNT_ID_B>`, `<CATEGORY_ID_B>`). S 2: con PR-04 usando `<ACCESS_TOKEN_B>` se creó una suscripción `<SUB_ID_B>` con `"p_name":"Netflix B"` y `"p_amount":"5000.00"`.

**Datos de prueba:** D 1: Email A `qa+cp-sus-129-001@example.com` / Contraseña `Clave123!`. D 2: Email B `qa+cp-sus-129-002@example.com` / Contraseña `Clave123!`. D 3: `p_subscription_id = "<SUB_ID_B>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar con PR-04 usando `<ACCESS_TOKEN_A>` `POST <SUPABASE_URL>/rest/v1/rpc/update_subscription` con body `{"p_subscription_id":"<SUB_ID_B>","p_name":"Robada","p_amount":"9000.00","p_category_id":"<CATEGORY_ID_A>","p_account_id":"<ACCOUNT_ID_A>","p_billing_day":28,"p_end_period":null,"p_description":null}` | Respuesta HTTP `404 Not Found` con `"code": "P0002"` y `"message": "Suscripción no encontrada"` |
| 2 | Ejecutar con PR-08 usando `<ACCESS_TOKEN_B>` `GET <SUPABASE_URL>/rest/v1/subscriptions?id=eq.<SUB_ID_B>&select=name,amount_text:amount::text` | Respuesta HTTP `200 OK` con `[{"name":"Netflix B","amount_text":"5000.00"}]` |

**Post-condición:** La suscripción `<SUB_ID_B>` de Usuario B permanece intacta. Los usuarios A y B quedan como datos de prueba (emails únicos, sin limpieza).

---

### CP-SUS-130 — Rechazar en API `update_subscription` sin sesión autenticada (rol `anon`)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-59 · CA-13 · FR-17 · C7 · ADR-030 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | API · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`supabase/tests/database/`) |

**Pre-requisitos:** S 1: se obtuvo `<ANON_KEY>` con PR-04 (paso 1).

**Datos de prueba:** D 1: Header `Authorization: Bearer <ANON_KEY>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/update_subscription` con headers `apikey: <ANON_KEY>` y `Authorization: Bearer <ANON_KEY>` y body `{"p_subscription_id":"00000000-0000-0000-0000-000000000001","p_name":"Netflix","p_amount":"5000.00","p_category_id":"00000000-0000-0000-0000-000000000002","p_account_id":"00000000-0000-0000-0000-000000000003","p_billing_day":28,"p_end_period":null,"p_description":null}` | Respuesta HTTP `403 Forbidden` con `"code": "42501"` (`permission denied for function update_subscription`) |

**Post-condición:** Ninguna suscripción es modificada. No requiere usuario.

---

### CP-SUS-131 — Eliminar desde Movimientos la ocurrencia de `<MES_ANTERIOR>` muestra `delete-transaction-subscription-note`, figura con `"Eliminado"` en el Detalle y no vuelve a crearse al recargar

| Campo | Contenido |
|---|---|
| Historia · criterio | US-60 · CA-1, CA-3, CA-5 · FR-08 · R2 · C10 · ADR-017 |
| Invariante | I10, I11 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción con 2 ocurrencias (`<MES_HACE_2>` y `<MES_ANTERIOR>`): `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_start_period":"<MES_HACE_2>-01","p_end_period":null,"p_description":null}` (`"generated": 2`), guardando `subscription_id` como `<SUB_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-131-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Ocurrencia de `<MES_ANTERIOR>` de la suscripción `"Netflix"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-131-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-131-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Movimientos"` (`register-nav-transactions`) | Se abre `/transactions` |
| 7 | Seleccionar `<MES_ANTERIOR>` en el selector de período (`transactions-period-select`) | Se muestra la fila del gasto `"Netflix"` por `"$5.000,00"` (`transactions-item`) |
| 8 | Hacer click en el botón de eliminar (`transactions-item-delete`) de la fila `"Netflix"` | Se abre `delete-transaction-dialog` mostrando `delete-transaction-subscription-note` con el texto `"Este gasto lo cargó la suscripción Netflix. Si lo eliminás, no se vuelve a cargar para <mes anterior>."` (ej. `"Este gasto lo cargó la suscripción Netflix. Si lo eliminás, no se vuelve a cargar para septiembre 2026."`) |
| 9 | Hacer click en `"Eliminar"` (`delete-transaction-confirm`) | El diálogo se cierra y la fila desaparece del listado `"Activos"` de `<MES_ANTERIOR>` |
| 10 | Hacer click en `"Suscripciones"` (`transactions-nav-subscriptions`) | Se abre `/subscriptions` |
| 11 | Hacer click en la fila `"Netflix"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) | Se abre `/subscriptions/<SUB_ID>`; en `"Gastos cargados"` (`subscription-detail-occurrences`) la fila `subscription-detail-occurrence` con `data-period="<MES_ANTERIOR>"` tiene `data-deleted="true"` y muestra la marca `"Eliminado"` (`subscription-detail-occurrence-deleted`) |
| 12 | Recargar la página del navegador (`F5`) en `/subscriptions/<SUB_ID>` | La puesta al día corre al recargar sin crear una nueva transacción para `<MES_ANTERIOR>`; no aparece `app-catchup-generated` y la fila `subscription-detail-occurrence` con `data-period="<MES_ANTERIOR>"` sigue con `data-deleted="true"` y `"Eliminado"` |

**Post-condición:** En `public.transactions` sigue existiendo 1 sola fila con `subscription_id = <SUB_ID>` y `subscription_period = '<MES_ANTERIOR>-01'`, con `deleted_at IS NOT NULL` (`I10`, `I11`, `R2`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-132 — Eliminar la ocurrencia de `<MES_ANTERIOR>` de una suscripción deja de sumarla en `"Gastado en <mes corto>"` del Resumen

| Campo | Contenido |
|---|---|
| Historia · criterio | US-60 · CA-2 · FR-08 · C10 · ADR-017 |
| Invariante | I10 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó un gasto manual de `$1.000,00` ARS en `<MES_ANTERIOR>` ejecutando con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con body `{"p_type":"expense","p_amount":"1000.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_installments_count":1,"p_occurred_on":"<MES_ANTERIOR>-05","p_description":"Cine manual"}`. S 5: se creó una suscripción `"Netflix"` de `$5.000,00` ARS con ocurrencia en `<MES_ANTERIOR>` (`POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_start_period":"<MES_ANTERIOR>-01","p_end_period":null,"p_description":null}`, `"generated": 1`).

**Datos de prueba:** D 1: Email `qa+cp-sus-132-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Gasto manual `"Cine manual"` (`$1.000,00`) + ocurrencia `"Netflix"` (`$5.000,00`) en `<MES_ANTERIOR>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-132-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-132-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Resumen"` (`register-nav-dashboard`) | Se abre `/dashboard` |
| 7 | Seleccionar `<MES_ANTERIOR>` en el selector de período (`dashboard-period-select`) | La tarjeta `"Gastado en <mes corto anterior>"` (`dashboard-total-expenses`, ej. `"Gastado en septiembre"`) muestra `"$6.000,00"` |
| 8 | Hacer click en `"Movimientos"` (`dashboard-nav-transactions`) | Se abre `/transactions` |
| 9 | Seleccionar `<MES_ANTERIOR>` en el selector de período (`transactions-period-select`) | Se listan `"Netflix"` (`$5.000,00`) y `"Cine manual"` (`$1.000,00`) |
| 10 | Hacer click en el botón de eliminar (`transactions-item-delete`) de la fila `"Netflix"` | Se abre `delete-transaction-dialog` |
| 11 | Hacer click en `"Eliminar"` (`delete-transaction-confirm`) | La fila `"Netflix"` desaparece de `"Activos"` |
| 12 | Hacer click en `"Resumen"` (`transactions-nav-dashboard`) | Se abre `/dashboard` |
| 13 | Seleccionar `<MES_ANTERIOR>` en el selector de período (`dashboard-period-select`) | La tarjeta `"Gastado en <mes corto anterior>"` (`dashboard-total-expenses`) muestra `"$1.000,00"` (la ocurrencia eliminada de `$5.000,00` dejó de sumar) |

**Post-condición:** En `public.transactions`, la ocurrencia de `"Netflix"` tiene `deleted_at IS NOT NULL` y no aporta a los KPI (`I10`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-133 — Restaurar desde el filtro `"Eliminados"` de Movimientos la ocurrencia borrada vuelve a sumarla en el Resumen, quita la marca `"Eliminado"` en el Detalle y no duplica el mes

| Campo | Contenido |
|---|---|
| Historia · criterio | US-60 · CA-4 · FR-08 · R2 · C10 · ADR-017 |
| Invariante | I10, I11 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción `"Netflix"` de `$5.000,00` ARS con ocurrencia en `<MES_ANTERIOR>` (`POST /rest/v1/rpc/create_subscription` con `"p_start_period":"<MES_ANTERIOR>-01"`, `"p_billing_day":28`, `"generated": 1`), se obtuvo el `id` de la transacción con PR-08 (`GET <SUPABASE_URL>/rest/v1/transactions?subscription_id=eq.<SUB_ID>&select=id`) como `<TX_ID>`, y se la eliminó con PR-04 ejecutando `POST <SUPABASE_URL>/rest/v1/rpc/delete_transaction` con body `{"p_transaction_id":"<TX_ID>"}` (HTTP `204`).

**Datos de prueba:** D 1: Email `qa+cp-sus-133-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Ocurrencia `<TX_ID>` de `<MES_ANTERIOR>` en estado eliminado (`deleted_at IS NOT NULL`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-133-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-133-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Movimientos"` (`register-nav-transactions`) | Se abre `/transactions` |
| 7 | Seleccionar `<MES_ANTERIOR>` en el selector de período (`transactions-period-select`) | No aparece `"Netflix"` en el filtro `"Activos"` |
| 8 | Hacer click en el filtro `"Eliminados"` (`transactions-filter-deleted`) | Se muestra la fila de `"Netflix"` por `"$5.000,00"` |
| 9 | Hacer click en el botón `"Restaurar"` (`transactions-item-restore`) de la fila `"Netflix"` | La fila desaparece de `"Eliminados"` y vuelve a `"Activos"` |
| 10 | Hacer click en `"Resumen"` (`transactions-nav-dashboard`) | Se abre `/dashboard` |
| 11 | Seleccionar `<MES_ANTERIOR>` en el selector de período (`dashboard-period-select`) | La tarjeta `"Gastado en <mes corto anterior>"` (`dashboard-total-expenses`) muestra `"$5.000,00"` |
| 12 | Hacer click en `"Suscripciones"` (`dashboard-nav-subscriptions`) | Se abre `/subscriptions` |
| 13 | Hacer click en la fila `"Netflix"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) | En `/subscriptions/<SUB_ID>`, la sección `"Gastos cargados"` (`subscription-detail-occurrences`) muestra 1 sola fila `subscription-detail-occurrence` con `data-period="<MES_ANTERIOR>"`, `data-deleted="false"` y sin la marca `"Eliminado"` (`subscription-detail-occurrence-deleted`) |

**Post-condición:** En `public.transactions` existe 1 sola fila para `(<SUB_ID>, '<MES_ANTERIOR>-01')` con `deleted_at IS NULL` (`I10`, `I11`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-134 — Mostrar la marca de suscripción en Movimientos y en `"Últimos movimientos"` del Resumen (y no en un gasto manual) y navegar al Detalle al tocarla

| Campo | Contenido |
|---|---|
| Historia · criterio | US-61 · CA-1, CA-2 · FR-16 · ADR-017 |
| Invariante | I11, I14 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó un gasto manual en `<MES_ANTERIOR>` ejecutando con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con body `{"p_type":"expense","p_amount":"1500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_installments_count":1,"p_occurred_on":"<MES_ANTERIOR>-10","p_description":"Kiosco"}`. S 5: se creó una suscripción `"Netflix"` con 1 ocurrencia en `<MES_ANTERIOR>` (`POST /rest/v1/rpc/create_subscription` con `"p_start_period":"<MES_ANTERIOR>-01"`, `"p_billing_day":28`, `"generated": 1`), guardando `subscription_id` como `<SUB_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-134-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Gasto de suscripción `"Netflix"` (`subscription_id = <SUB_ID>`) y gasto manual `"Kiosco"` (`subscription_id = null`) en `<MES_ANTERIOR>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-134-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-134-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Resumen"` (`register-nav-dashboard`) | Se abre `/dashboard` |
| 7 | Seleccionar `<MES_ANTERIOR>` en el selector de período (`dashboard-period-select`) | En `"Últimos movimientos"`, la fila de `"Netflix"` muestra la marca `dashboard-transaction-item-subscription` con el nombre `"Netflix"` y la fila de `"Kiosco"` no tiene `dashboard-transaction-item-subscription` |
| 8 | Hacer click en `"Movimientos"` (`dashboard-nav-transactions`) | Se abre `/transactions` |
| 9 | Seleccionar `<MES_ANTERIOR>` en el selector de período (`transactions-period-select`) | La fila de `"Netflix"` muestra la marca `transactions-item-subscription` con el nombre `"Netflix"` y la fila de `"Kiosco"` no tiene `transactions-item-subscription` |
| 10 | Hacer click en la marca `transactions-item-subscription` (`"Netflix"`) | Navega a `/subscriptions/<SUB_ID>` mostrando el Detalle de `"Netflix"` |

**Post-condición:** No se modifican filas. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-135 — La ocurrencia generada de una suscripción suma en `"Gastado en <mes corto>"` y resta en `"Balance"` del Resumen de V1

| Campo | Contenido |
|---|---|
| Historia · criterio | US-61 · CA-1 · US-53 · CA-1 · FR-16 · R7 · ADR-017 |
| Invariante | I1, I1', I2, I14 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción `"Netflix"` de `$5.000,00` ARS con ocurrencia en `<MES_ANTERIOR>` (`POST /rest/v1/rpc/create_subscription` con `"p_start_period":"<MES_ANTERIOR>-01"`, `"p_billing_day":28`, `"generated": 1`).

**Datos de prueba:** D 1: Email `qa+cp-sus-135-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Ocurrencia de `"Netflix"` en `<MES_ANTERIOR>` por `$5.000,00` ARS.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-135-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-135-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Resumen"` (`register-nav-dashboard`) | Se abre `/dashboard` |
| 7 | Seleccionar `<MES_ANTERIOR>` en el selector de período (`dashboard-period-select`) | En `/dashboard`, la tarjeta `"Gastado en <mes corto anterior>"` (`dashboard-total-expenses`) muestra `"$5.000,00"` y la tarjeta `"Balance"` (`dashboard-total-balance`) muestra `"-$5.000,00"` |

**Post-condición:** En `public.ledger_entries`, la ocurrencia tiene su fila de imputación (`installment_number = 1`, `period = '<MES_ANTERIOR>-01'`, `amount = 5000.00`, `amount_ars = 5000.00`) que alimenta el Resumen (`I1`, `I1'`, `I2`, `I14`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-136 — Listar en `"Gastos cargados"` del Detalle las ocurrencias de la suscripción ordenadas por período descendente

| Campo | Contenido |
|---|---|
| Historia · criterio | US-61 · CA-5 · FR-16 · ADR-017 |
| Invariante | I11, I14 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción con 3 ocurrencias (`<MES_HACE_3>`, `<MES_HACE_2>` y `<MES_ANTERIOR>`): `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_start_period":"<MES_HACE_3>-01","p_end_period":null,"p_description":null}` (`"generated": 3`), guardando `subscription_id` como `<SUB_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-136-001@example.com`. D 2: Contraseña `Clave123!`. D 3: 3 ocurrencias generadas (`<MES_HACE_3>`, `<MES_HACE_2>` y `<MES_ANTERIOR>`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-136-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-136-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en la fila `"Netflix"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) | En `/subscriptions/<SUB_ID>`, la sección `"Gastos cargados"` (`subscription-detail-occurrences`) lista exactamente 3 filas `subscription-detail-occurrence` en orden descendente de `data-period`: primero `data-period="<MES_ANTERIOR>"`, segundo `data-period="<MES_HACE_2>"` y tercero `data-period="<MES_HACE_3>"`, cada una con fecha `28/<MM>/<AAAA>` y monto `"$5.000,00"` |

**Post-condición:** No se modifican filas. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-137 — Mostrar la marca de suscripción en Movimientos aunque la suscripción esté en estado `paused`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-61 · CA-4 · FR-16, FR-17 · ADR-017 |
| Invariante | I14, I15 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción `"Netflix"` con 1 ocurrencia en `<MES_ANTERIOR>` (`POST /rest/v1/rpc/create_subscription` con `"p_start_period":"<MES_ANTERIOR>-01"`, `"p_billing_day":28`, `"generated": 1`) y luego se la pausó con `POST <SUPABASE_URL>/rest/v1/rpc/pause_subscription` (`{"p_subscription_id":"<SUB_ID>"}`).

**Datos de prueba:** D 1: Email `qa+cp-sus-137-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Suscripción `"Netflix"` en estado `paused` con ocurrencia en `<MES_ANTERIOR>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-137-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-137-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Movimientos"` (`register-nav-transactions`) | Se abre `/transactions` |
| 7 | Seleccionar `<MES_ANTERIOR>` en el selector de período (`transactions-period-select`) | La fila del gasto muestra la marca `transactions-item-subscription` con el nombre `"Netflix"` |

**Post-condición:** No se modifican filas. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-138 — Mostrar la marca de suscripción en Movimientos aunque la suscripción esté en estado `cancelled`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-61 · CA-4 · US-58 · CA-2 · FR-16, FR-17 · ADR-017 |
| Invariante | I14, I15 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción `"Netflix"` con 1 ocurrencia en `<MES_ANTERIOR>` (`POST /rest/v1/rpc/create_subscription` con `"p_start_period":"<MES_ANTERIOR>-01"`, `"p_billing_day":28`, `"generated": 1`) y luego se la canceló con `POST <SUPABASE_URL>/rest/v1/rpc/cancel_subscription` (`{"p_subscription_id":"<SUB_ID>"}`).

**Datos de prueba:** D 1: Email `qa+cp-sus-138-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Suscripción `"Netflix"` en estado `cancelled` con ocurrencia en `<MES_ANTERIOR>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-138-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-138-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Movimientos"` (`register-nav-transactions`) | Se abre `/transactions` |
| 7 | Seleccionar `<MES_ANTERIOR>` en el selector de período (`transactions-period-select`) | La fila del gasto muestra la marca `transactions-item-subscription` con el nombre `"Netflix"` |

**Post-condición:** No se modifican filas. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-139 — Suscripción activa en USD con tipo de cambio en `<MES_HACE_2>` y sin tipo de cambio en `<MES_ANTERIOR>` genera solo `<MES_HACE_2>`, muestra `"Falta tipo de cambio"` y el botón `"Cargar tipo de cambio"` navega a `/settings?period=<MES_ANTERIOR>`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-62 · CA-1, CA-2, CA-7 · FR-15 · R6 · C5 · ADR-002, ADR-031 |
| Invariante | I5, I11, I14 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se cargó únicamente el tipo de cambio de `<MES_HACE_2>-01` (`"1200.00"`) dejando `<MES_ANTERIOR>` sin tipo de cambio: se ejecutó con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/upsert_fx_rate` con body `{"p_period":"<MES_HACE_2>-01","p_ars_per_usd":"1200.00"}`. S 5: se creó una suscripción en `USD` desde `<MES_HACE_2>` con día `28`: `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"ChatGPT Plus","p_amount":"20.00","p_currency":"USD","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_start_period":"<MES_HACE_2>-01","p_end_period":null,"p_description":null}` (`"generated": 1`), guardando `subscription_id` como `<SUB_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-139-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Suscripción `"ChatGPT Plus"` (`USD 20,00`), `<MES_HACE_2>` con `fx_rate = 1200.00` y `<MES_ANTERIOR>` sin `fx_rate`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-139-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-139-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions`; en la fila `"ChatGPT Plus"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) se muestra la marca `"Falta tipo de cambio"` (`subscriptions-item-blocked`) |
| 7 | Hacer click en la fila `"ChatGPT Plus"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) | Se abre `/subscriptions/<SUB_ID>`; se muestra el aviso `subscription-detail-blocked` con el texto `"Falta el tipo de cambio de <mes anterior>. Ese mes no se cargó; se carga en cuanto lo cargues."` y el botón `"Cargar tipo de cambio"` (`subscription-detail-blocked-fx`), y en `"Gastos cargados"` (`subscription-detail-occurrences`) figura únicamente la ocurrencia de `<MES_HACE_2>` |
| 8 | Hacer click en el botón `"Cargar tipo de cambio"` (`subscription-detail-blocked-fx`) | Navega a `/settings?period=<MES_ANTERIOR>` con el campo `"Mes"` (`settings-fx-period`) preseleccionado en `<MES_ANTERIOR>` |

**Post-condición:** En `public.transactions` existe 1 sola fila para `<SUB_ID>` (`subscription_period = '<MES_HACE_2>-01'`, `fx_rate = 1200.00`, `I5`, `R6`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-140 — Guardar en Ajustes el tipo de cambio faltante de `<MES_ANTERIOR>` dispara la puesta al día sin recargar, muestra `"Se cargó 1 gasto de suscripciones"` y quita el bloqueo

| Campo | Contenido |
|---|---|
| Historia · criterio | US-62 · CA-3 · US-53 · CA-1 · FR-15, FR-16 · R6 · C5 · ADR-002, ADR-031 |
| Invariante | I1, I1', I2, I5, I11, I14 |
| Técnica · Tipo | Transición de estados · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2` (sin tipos de cambio). S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción en `USD` desde `<MES_ANTERIOR>` con día `28`: `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"ChatGPT Plus","p_amount":"20.00","p_currency":"USD","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_start_period":"<MES_ANTERIOR>-01","p_end_period":null,"p_description":null}` (`"generated": 0`), guardando `subscription_id` como `<SUB_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-140-001@example.com`. D 2: Contraseña `Clave123!`. D 3: ARS por USD `"1250"` para `<MES_ANTERIOR>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-140-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-140-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en la fila `"ChatGPT Plus"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) | Se abre `/subscriptions/<SUB_ID>` |
| 8 | Hacer click en `"Cargar tipo de cambio"` (`subscription-detail-blocked-fx`) | Navega a `/settings?period=<MES_ANTERIOR>` con `"Mes"` (`settings-fx-period`) en `<MES_ANTERIOR>` |
| 9 | Escribir `1250` en `"ARS por USD"` (`settings-fx-rate`) | El campo muestra `1250` |
| 10 | Hacer click en `"Guardar tipo de cambio"` (`settings-fx-submit`) | Sin recargar el navegador, se guarda el tipo de cambio, corre la puesta al día y se muestra el aviso `app-catchup-generated` con el texto `"Se cargó 1 gasto de suscripciones"` |
| 11 | Hacer click en `"Suscripciones"` (`settings-nav-subscriptions`) | Se abre `/subscriptions`; la fila `"ChatGPT Plus"` ya no muestra `subscriptions-item-blocked` |
| 12 | Hacer click en la fila `"ChatGPT Plus"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) | En `/subscriptions/<SUB_ID>`, ya no existe `subscription-detail-blocked` y en `"Gastos cargados"` (`subscription-detail-occurrences`) figura la ocurrencia de `<MES_ANTERIOR>` (`data-period="<MES_ANTERIOR>"`) |

**Post-condición:** En `public.transactions` existe 1 fila para `<SUB_ID>` con `subscription_period = '<MES_ANTERIOR>-01'`, `amount = 20.00`, `currency = 'USD'`, `fx_rate = 1250.00`, `amount_ars = 25000.00` y 1 fila en `public.ledger_entries` con `amount = 20.00` y `amount_ars = 25000.00` (`I1`, `I1'`, `I2`, `I5`, `I11`, `I14`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-141 — Con 3 meses bloqueados por falta de tipo de cambio, el aviso los lista con comas y `"y"` y el botón `"Cargar tipo de cambio"` apunta al mes más viejo

| Campo | Contenido |
|---|---|
| Historia · criterio | US-62 · CA-7, CA-8 · FR-15 · R6 · ADR-031 |
| Invariante | I5 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2` (sin tipos de cambio). S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción en `USD` desde `<MES_HACE_3>` con día `28`: `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"ChatGPT Plus","p_amount":"20.00","p_currency":"USD","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_start_period":"<MES_HACE_3>-01","p_end_period":null,"p_description":null}` (`"generated": 0`), guardando `subscription_id` como `<SUB_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-141-001@example.com`. D 2: Contraseña `Clave123!`. D 3: 3 períodos bloqueados: `<MES_HACE_3>`, `<MES_HACE_2>` y `<MES_ANTERIOR>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-141-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-141-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en la fila `"ChatGPT Plus"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) | En `/subscriptions/<SUB_ID>`, el aviso `subscription-detail-blocked` muestra el texto `"Falta el tipo de cambio de <mes hace 3>, <mes hace 2> y <mes anterior>. Esos meses no se cargaron; se cargan en cuanto los cargues."` (ej. `"Falta el tipo de cambio de julio 2026, agosto 2026 y septiembre 2026. Esos meses no se cargaron; se cargan en cuanto los cargues."`) |
| 8 | Hacer click en `"Cargar tipo de cambio"` (`subscription-detail-blocked-fx`) | Navega a `/settings?period=<MES_HACE_3>` (el mes más viejo que falta) |

**Post-condición:** No se modifican filas. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-142 — Suscripción activa en USD sin tipo de cambio del mes corriente antes del día de cobro (`28 > <DIA_HOY>`) no se muestra bloqueada

| Campo | Contenido |
|---|---|
| Historia · criterio | US-62 · CA-4, CA-6 · FR-15 · R5, R6 · ADR-031 |
| Invariante | I5 |
| Técnica · Tipo | Análisis de valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2` (sin tipos de cambio). S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción en `USD` desde `<MES_ACTUAL>` con día `28`: `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"ChatGPT Plus","p_amount":"20.00","p_currency":"USD","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_start_period":"<MES_ACTUAL>-01","p_end_period":null,"p_description":null}` (`"generated": 0`), guardando `subscription_id` como `<SUB_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-142-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Suscripción `"ChatGPT Plus"` (`USD 20,00`, inicio `<MES_ACTUAL>`, día `28 > <DIA_HOY>`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-142-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-142-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions`; la fila `"ChatGPT Plus"` (`subscriptions-item`) **no** muestra la marca `subscriptions-item-blocked` |
| 7 | Hacer click en la fila `"ChatGPT Plus"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) | En `/subscriptions/<SUB_ID>`, **no** existe el aviso `subscription-detail-blocked` |

**Post-condición:** No se modifican filas. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-143 — Con dos suscripciones activas en ARS (`$5.000,00` y `$2.500,00`), el total mensual comprometido muestra `"$7.500,00"` y `"2 suscripciones activas este mes"`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-63 · CA-1 · FR-16 · C1, C2 · ADR-033 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se crearon 2 suscripciones activas en `ARS` vigentes en `<MES_ACTUAL>` con `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription`: `"Netflix"` por `"5000.00"` ARS (`"p_start_period":"<MES_ACTUAL>-01"`, `"p_billing_day":10`) y `"Spotify"` por `"2500.00"` ARS (`"p_start_period":"<MES_ACTUAL>-01"`, `"p_billing_day":25`).

**Datos de prueba:** D 1: Email `qa+cp-sus-143-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `"Netflix"` (`$5.000,00`) + `"Spotify"` (`$2.500,00`) = `"$7.500,00"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-143-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-143-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | En `/subscriptions`, la tarjeta `subscriptions-committed` muestra el rótulo `"Comprometido en <mes actual>"`, el total `"$7.500,00"` (`subscriptions-committed-total`), el conteo `"2 suscripciones activas este mes"` (`subscriptions-committed-count`) y no muestra `subscriptions-committed-usd-pending` |

**Post-condición:** No se modifican filas. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-144 — Suscripción activa en `USD 10,00` con tipo de cambio del período corriente `1.250,00` suma `"$12.500,00"` al total mensual comprometido

| Campo | Contenido |
|---|---|
| Historia · criterio | US-63 · CA-3 · FR-16 · C1, C2 · ADR-013, ADR-033 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se cargó el tipo de cambio de `<MES_ACTUAL>-01` igual a `"1250.00"` ejecutando con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/upsert_fx_rate` con body `{"p_period":"<MES_ACTUAL>-01","p_ars_per_usd":"1250.00"}`. S 5: se creó una suscripción activa en `USD` por `"10.00"` (`"p_name":"iCloud"`, `"p_start_period":"<MES_ACTUAL>-01"`, `"p_billing_day":28`).

**Datos de prueba:** D 1: Email `qa+cp-sus-144-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `"iCloud"` (`USD 10,00` × `1.250,00` = `"$12.500,00"`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-144-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-144-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | En `/subscriptions`, `subscriptions-committed-total` muestra `"$12.500,00"`, `subscriptions-committed-count` muestra `"1 suscripción activa este mes"` y no existe `subscriptions-committed-usd-pending` |

**Post-condición:** No se modifican filas. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-145 — Con una sola suscripción activa en `USD 10,00` y sin tipo de cambio del período corriente, el total comprometido muestra `"$0,00"`, `"1 suscripción activa este mes"` y `"+ USD 10,00 sin tipo de cambio de <mes actual>"`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-63 · CA-4, CA-7 · FR-16 · C1, C2 · ADR-033 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2` (sin tipo de cambio para `<MES_ACTUAL>`). S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción activa en `USD` por `"10.00"` (`"p_name":"iCloud"`, `"p_start_period":"<MES_ACTUAL>-01"`, `"p_billing_day":28`).

**Datos de prueba:** D 1: Email `qa+cp-sus-145-001@example.com`. D 2: Contraseña `Clave123!`. D 3: `"iCloud"` (`USD 10,00`) sin `fx_rate` en `<MES_ACTUAL>`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-145-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-145-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | En `/subscriptions`, `subscriptions-committed-total` muestra `"$0,00"`, `subscriptions-committed-count` muestra `"1 suscripción activa este mes"` y `subscriptions-committed-usd-pending` muestra `"+ USD 10,00 sin tipo de cambio de <mes actual>"` (ej. `"+ USD 10,00 sin tipo de cambio de octubre 2026"`) |

**Post-condición:** No se modifican filas. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-146 — Editar el monto de una suscripción de `$5.000,00` a `$8.000,00` actualiza el total mensual comprometido a `"$8.000,00"` aunque la ocurrencia del mes corriente ya se haya generado por `$5.000,00`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-63 · CA-5 · FR-16 · C2 · ADR-033 |
| Invariante | I1, I2 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción `"Netflix"` con inicio en `<MES_ACTUAL>` y día `1` (de modo que la ocurrencia del mes corriente ya se generó por `$5.000,00`): `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":1,"p_start_period":"<MES_ACTUAL>-01","p_end_period":null,"p_description":null}` (`"generated": 1`), guardando `subscription_id` como `<SUB_ID>`.

**Datos de prueba:** D 1: Email `qa+cp-sus-146-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Monto original `"5000"` · Nuevo monto `"8000"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-146-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-146-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | En `/subscriptions`, `subscriptions-committed-total` muestra `"$5.000,00"` |
| 7 | Hacer click en la fila `"Netflix"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) | Se abre `/subscriptions/<SUB_ID>` |
| 8 | Hacer click en `"Editar"` (`subscription-detail-edit`) | Se abre `/subscriptions/<SUB_ID>/edit` |
| 9 | Reemplazar `5000` por `8000` en `"Monto"` (`subscription-form-amount`) | El campo `"Monto"` muestra `8000` |
| 10 | Hacer click en `"Guardar cambios"` (`subscription-form-submit`) | Navega a `/subscriptions/<SUB_ID>`; la ocurrencia de `<MES_ACTUAL>` en `"Gastos cargados"` sigue mostrando `"$5.000,00"` |
| 11 | Hacer click en el botón atrás (`subscription-detail-back`) | En `/subscriptions`, `subscriptions-committed-total` muestra `"$8.000,00"` |

**Post-condición:** En `public.subscriptions`, `amount = 8000.00`; en `public.transactions`, la fila de `<MES_ACTUAL>-01` conserva `amount = 5000.00`. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-147 — El Resumen (`/dashboard`) no suma suscripciones cuya ocurrencia del mes corriente aún no fue generada y muestra el estado vacío del período

| Campo | Contenido |
|---|---|
| Historia · criterio | US-63 · CA-6 · FR-16 · ADR-033 |
| Invariante | I1, I14 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción `"Netflix"` de `$5.000,00` ARS con inicio en `<MES_ACTUAL>` y día `28` (`> <DIA_HOY>`, por lo que genera 0 transacciones): `POST <SUPABASE_URL>/rest/v1/rpc/create_subscription` con body `{"p_name":"Netflix","p_amount":"5000.00","p_currency":"ARS","p_category_id":"<CATEGORY_ID>","p_account_id":"<ACCOUNT_ID>","p_billing_day":28,"p_start_period":"<MES_ACTUAL>-01","p_end_period":null,"p_description":null}` (`"generated": 0`).

**Datos de prueba:** D 1: Email `qa+cp-sus-147-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Suscripción `"Netflix"` (`$5.000,00` ARS, día `28`, 0 transacciones generadas en `<MES_ACTUAL>`).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-147-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-147-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | En `/subscriptions`, `subscriptions-committed-total` muestra `"$5.000,00"` y `subscriptions-committed-count` muestra `"1 suscripción activa este mes"` |
| 7 | Hacer click en `"Resumen"` (`subscriptions-nav-dashboard`) | En `/dashboard` (período `<MES_ACTUAL>`), ningún KPI suma la suscripción sin transacción: se muestra el estado vacío `dashboard-empty` con el texto `"No tenés movimientos registrados en <mes corto actual>."` (`dashboard-empty-message`, ej. `"No tenés movimientos registrados en octubre."`) y el botón `"Registrar un gasto"` (`dashboard-empty-register`) |

**Post-condición:** En `public.transactions` existen 0 filas para el usuario. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-148 — Una suscripción activa con `end_period` igual al período corriente (`<MES_ACTUAL>`) sí suma al total mensual comprometido

| Campo | Contenido |
|---|---|
| Historia · criterio | US-63 · CA-8 · FR-16 · ADR-033 |
| Invariante | — |
| Técnica · Tipo | Análisis de valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción activa con `"p_start_period":"<MES_ANTERIOR>-01"`, `"p_end_period":"<MES_ACTUAL>-01"` y `"p_amount":"6000.00"` ARS (`POST /rest/v1/rpc/create_subscription`).

**Datos de prueba:** D 1: Email `qa+cp-sus-148-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Suscripción `"Curso"` (`$6.000,00` ARS) con `end_period = '<MES_ACTUAL>-01'`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-148-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-148-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | En `/subscriptions`, `subscriptions-committed-total` muestra `"$6.000,00"` y `subscriptions-committed-count` muestra `"1 suscripción activa este mes"` |

**Post-condición:** No se modifican filas. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-149 — Una suscripción en estado `paused` no suma al total mensual comprometido (`"$0,00"` y `"No tenés suscripciones activas este mes"`)

| Campo | Contenido |
|---|---|
| Historia · criterio | US-63 · CA-2 · FR-16 · ADR-033 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción `"Netflix"` por `"5000.00"` ARS y se la pausó con `POST <SUPABASE_URL>/rest/v1/rpc/pause_subscription`.

**Datos de prueba:** D 1: Email `qa+cp-sus-149-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Única suscripción `"Netflix"` en estado `paused`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-149-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-149-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | En `/subscriptions`, `subscriptions-committed-total` muestra `"$0,00"` y `subscriptions-committed-count` muestra `"No tenés suscripciones activas este mes"` |

**Post-condición:** No se modifican filas. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-150 — Una suscripción en estado `cancelled` no suma al total mensual comprometido

| Campo | Contenido |
|---|---|
| Historia · criterio | US-63 · CA-2 · FR-16 · ADR-033 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción `"Netflix"` por `"5000.00"` ARS y se la canceló con `POST <SUPABASE_URL>/rest/v1/rpc/cancel_subscription`.

**Datos de prueba:** D 1: Email `qa+cp-sus-150-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Única suscripción `"Netflix"` en estado `cancelled`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-150-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-150-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | En `/subscriptions`, `subscriptions-committed-total` muestra `"$0,00"` y `subscriptions-committed-count` muestra `"No tenés suscripciones activas este mes"` |

**Post-condición:** No se modifican filas. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-151 — Una suscripción activa con `start_period` en el mes siguiente (`<MES_SIGUIENTE>`) no suma al total mensual comprometido del mes corriente

| Campo | Contenido |
|---|---|
| Historia · criterio | US-63 · CA-2 · FR-16 · ADR-033 |
| Invariante | — |
| Técnica · Tipo | Análisis de valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción activa con `"p_start_period":"<MES_SIGUIENTE>-01"` por `"5000.00"` ARS (`POST /rest/v1/rpc/create_subscription`).

**Datos de prueba:** D 1: Email `qa+cp-sus-151-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Suscripción `"Futura"` (`$5.000,00` ARS) con `start_period = '<MES_SIGUIENTE>-01'`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-151-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-151-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | En `/subscriptions`, `subscriptions-committed-total` muestra `"$0,00"` y `subscriptions-committed-count` muestra `"No tenés suscripciones activas este mes"` |

**Post-condición:** No se modifican filas. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-152 — Una suscripción activa ya terminada (`end_period = <MES_ANTERIOR>`) no suma al total mensual comprometido del mes corriente

| Campo | Contenido |
|---|---|
| Historia · criterio | US-63 · CA-2, CA-8 · FR-16 · ADR-033 |
| Invariante | — |
| Técnica · Tipo | Análisis de valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>`, `<ACCESS_TOKEN>`, `<ACCOUNT_ID>` y `<CATEGORY_ID>`. S 4: se creó una suscripción activa con `"p_start_period":"<MES_HACE_2>-01"` y `"p_end_period":"<MES_ANTERIOR>-01"` por `"5000.00"` ARS (`POST /rest/v1/rpc/create_subscription`).

**Datos de prueba:** D 1: Email `qa+cp-sus-152-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Suscripción `"Terminada"` (`$5.000,00` ARS) con `end_period = '<MES_ANTERIOR>-01'`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-152-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-152-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | En `/subscriptions`, `subscriptions-committed-total` muestra `"$0,00"` y `subscriptions-committed-count` muestra `"No tenés suscripciones activas este mes"` |

**Post-condición:** No se modifican filas. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-153 — Vista previa en `/subscriptions/new` con `$5.000,00` ARS, día `28` (`> <DIA_HOY>`), desde `<MES_HACE_2>` y sin fin muestra 2 meses en `"Se cargan al guardar"`, 3 en `"Próximos cobros"`, resumen de `"$10.000,00"` y al guardar crea exactamente esas 2 transacciones

| Campo | Contenido |
|---|---|
| Historia · criterio | US-75 · CA-1, CA-7 · US-52 · CA-2 · FR-16 · R1, R4, R5 · ADR-017, ADR-031, ADR-032 |
| Invariante | I11, I14, I17 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · Sí · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-153-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Nombre `"Netflix"`. D 4: Monto `"5000"`. D 5: Categoría `"Entretenimiento"`. D 6: Medio de pago `"Efectivo"`. D 7: Día de cobro `"28"`. D 8: Mes de inicio `"<MES_HACE_2>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-153-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-153-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en `"Nueva"` (`subscriptions-new`) | Se abre `/subscriptions/new` |
| 8 | Escribir `Netflix` en `"Nombre"` (`subscription-form-name`) | El campo muestra `Netflix` |
| 9 | Escribir `5000` en `"Monto"` (`subscription-form-amount`) | El campo muestra `5000` |
| 10 | Seleccionar `"Entretenimiento"` en `"Categoría"` (`subscription-form-category`) | `"Categoría"` muestra `"Entretenimiento"` |
| 11 | Seleccionar `"Efectivo"` en `"Medio de pago"` (`subscription-form-account`) | `"Medio de pago"` muestra `"Efectivo"` |
| 12 | Escribir `28` en `"Día de cobro"` (`subscription-form-billing-day`) | El campo muestra `28` |
| 13 | Ingresar `<MES_HACE_2>` en `"Mes de inicio"` (`subscription-form-start-period`) | En la sección `"Calendario"` (`subscription-form-preview`): `"Se cargan al guardar"` (`subscription-form-preview-due`) muestra 2 filas `subscription-form-preview-due-item` (`"<mes hace 2> · 28/<MES_HACE_2>"` y `"<mes anterior> · 28/<MES_ANTERIOR>"`), `"Próximos cobros"` (`subscription-form-preview-upcoming`) muestra 3 filas `subscription-form-preview-upcoming-item` (`<MES_ACTUAL>`, `<MES_SIGUIENTE>` y `<MES_MAS_2>`) y el resumen (`subscription-form-preview-summary`) dice `"Al guardar se cargan 2 gastos de $5.000,00 (total $10.000,00)."` |
| 14 | Hacer click en `"Guardar suscripción"` (`subscription-form-submit`) | Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada. Se cargaron 2 gastos vencidos."` (`subscription-toast`) y en `"Gastos cargados"` (`subscription-detail-occurrences`) aparecen exactamente las mismas 2 fechas y períodos (`<MES_ANTERIOR>` y `<MES_HACE_2>`) que mostró `"Se cargan al guardar"` |

**Post-condición:** En `public.transactions` existen exactamente 2 filas (`<MES_HACE_2>-01` y `<MES_ANTERIOR>-01`) por `5000.00` ARS (`US-75 · CA-7`). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-154 — Vista previa en `/subscriptions/new` con día de cobro igual a `<DIA_HOY>` incluye el período corriente en `"Se cargan al guardar"`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-75 · CA-2 · FR-16 · R5 · ADR-031 |
| Invariante | — |
| Técnica · Tipo | Análisis de valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-154-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Monto `"5000"`. D 4: Día de cobro `"<DIA_HOY>"`. D 5: Mes de inicio `"<MES_HACE_2>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-154-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-154-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en `"Nueva"` (`subscriptions-new`) | Se abre `/subscriptions/new` |
| 8 | Escribir `5000` en `"Monto"` (`subscription-form-amount`) | El campo muestra `5000` |
| 9 | Escribir `<DIA_HOY>` en `"Día de cobro"` (`subscription-form-billing-day`) | El campo muestra `<DIA_HOY>` |
| 10 | Ingresar `<MES_HACE_2>` en `"Mes de inicio"` (`subscription-form-start-period`) | En `"Se cargan al guardar"` (`subscription-form-preview-due`) aparecen 3 filas (`<MES_HACE_2>`, `<MES_ANTERIOR>` y `<MES_ACTUAL>` con fecha `<HOY>`), `"Próximos cobros"` (`subscription-form-preview-upcoming`) empieza en `<MES_SIGUIENTE>` y el resumen (`subscription-form-preview-summary`) dice `"Al guardar se cargan 3 gastos de $5.000,00 (total $15.000,00)."` |

**Post-condición:** No se crean filas (no se envió el formulario). El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-155 — Vista previa en `/subscriptions/new` con Mes de inicio futuro (`<MES_MAS_3>`) muestra `"Al guardar no se carga ningún gasto."` y `"Próximos cobros"` desde `<MES_MAS_3>`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-75 · CA-3 · FR-16 · R1 · ADR-032 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-155-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Monto `"5000"`. D 4: Día de cobro `"15"`. D 5: Mes de inicio `"<MES_MAS_3>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-155-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-155-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en `"Nueva"` (`subscriptions-new`) | Se abre `/subscriptions/new` |
| 8 | Escribir `5000` en `"Monto"` (`subscription-form-amount`) | El campo muestra `5000` |
| 9 | Escribir `15` en `"Día de cobro"` (`subscription-form-billing-day`) | El campo muestra `15` |
| 10 | Ingresar `<MES_MAS_3>` en `"Mes de inicio"` (`subscription-form-start-period`) | En `subscription-form-preview`, el resumen (`subscription-form-preview-summary`) dice `"Al guardar no se carga ningún gasto."` y `"Próximos cobros"` (`subscription-form-preview-upcoming`) muestra 3 cobros empezando en `"<mes mas 3> · 15/<MES_MAS_3>"` |

**Post-condición:** No se crean filas. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-156 — Vista previa en `/subscriptions/new` con rango cerrado en el pasado (`2026-03` a `2026-05`) y día `31` muestra `31/03/2026`, `30/04/2026`, `31/05/2026` y `"No hay más cobros: termina en mayo 2026."`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-75 · CA-4, CA-5 · US-54 · CA-5 · FR-16 · R1, R4 · ADR-032 |
| Invariante | — |
| Técnica · Tipo | Análisis de valores límite · Límite |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y los meses `2026-03` a `2026-05` están en el pasado dentro de `[-24 meses, +12 meses]`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-156-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Monto `"8000"`. D 4: Día de cobro `"31"`. D 5: Mes de inicio `"2026-03"`. D 6: Mes de fin `"2026-05"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-156-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-156-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en `"Nueva"` (`subscriptions-new`) | Se abre `/subscriptions/new` |
| 8 | Escribir `8000` en `"Monto"` (`subscription-form-amount`) | El campo muestra `8000` |
| 9 | Escribir `31` en `"Día de cobro"` (`subscription-form-billing-day`) | El campo muestra `31` |
| 10 | Ingresar `2026-03` en `"Mes de inicio"` (`subscription-form-start-period`) | `"Mes de inicio"` muestra `2026-03` |
| 11 | Ingresar `2026-05` en `"Mes de fin (opcional)"` (`subscription-form-end-period`) | En `subscription-form-preview`, `"Se cargan al guardar"` (`subscription-form-preview-due`) muestra las 3 filas `"marzo 2026 · 31/03/2026"`, `"abril 2026 · 30/04/2026"` y `"mayo 2026 · 31/05/2026"`, el resumen (`subscription-form-preview-summary`) dice `"Al guardar se cargan 3 gastos de $8.000,00 (total $24.000,00)."` y `"Próximos cobros"` (`subscription-form-preview-upcoming`) muestra `"No hay más cobros: termina en mayo 2026."` |

**Post-condición:** No se crean filas. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-157 — Vista previa en `/subscriptions/new` en USD con tipo de cambio en `<MES_HACE_2>` y sin tipo de cambio en `<MES_ANTERIOR>` marca `<MES_ANTERIOR>` con `data-blocked="true"` y no lo cuenta en el resumen

| Campo | Contenido |
|---|---|
| Historia · criterio | US-75 · CA-6 · FR-16 · R6 · ADR-031 |
| Invariante | I5 |
| Técnica · Tipo | Partición de equivalencia · Positivo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Alta · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>` y `<DIA_HOY> <= 27`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`. S 3: con PR-04 (pasos 1 y 2) se obtuvieron `<ANON_KEY>` y `<ACCESS_TOKEN>`. S 4: se cargó únicamente el tipo de cambio de `<MES_HACE_2>-01` (`"1200.00"`) dejando `<MES_ANTERIOR>` sin tipo de cambio: se ejecutó con PR-04 `POST <SUPABASE_URL>/rest/v1/rpc/upsert_fx_rate` con body `{"p_period":"<MES_HACE_2>-01","p_ars_per_usd":"1200.00"}`.

**Datos de prueba:** D 1: Email `qa+cp-sus-157-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Moneda `"USD"` · Monto `"20"` · Día de cobro `"28"` · Mes de inicio `"<MES_HACE_2>"`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-157-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-157-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en `"Nueva"` (`subscriptions-new`) | Se abre `/subscriptions/new` |
| 8 | Hacer click en el botón `"USD"` (`subscription-form-currency-usd`) | La moneda queda seleccionada en `"USD"` |
| 9 | Escribir `20` en `"Monto"` (`subscription-form-amount`) | El campo muestra `20` |
| 10 | Escribir `28` en `"Día de cobro"` (`subscription-form-billing-day`) | El campo muestra `28` |
| 11 | Ingresar `<MES_HACE_2>` en `"Mes de inicio"` (`subscription-form-start-period`) | En `"Se cargan al guardar"` (`subscription-form-preview-due`), la fila `subscription-form-preview-due-item` con `data-period="<MES_HACE_2>"` tiene `data-blocked="false"`, la fila con `data-period="<MES_ANTERIOR>"` tiene `data-blocked="true"` y muestra `"Sin tipo de cambio: se carga cuando lo cargues"`, y el resumen (`subscription-form-preview-summary`) dice `"Al guardar se carga 1 gasto de USD 20,00."` |

**Post-condición:** No se crean filas. El usuario queda como dato de prueba (email único, sin limpieza).

---

### CP-SUS-158 — Vista previa en `/subscriptions/new` con el campo `"Monto"` vacío muestra `subscription-form-preview-empty`

| Campo | Contenido |
|---|---|
| Historia · criterio | US-75 · CA-8 · FR-16 |
| Invariante | — |
| Técnica · Tipo | Partición de equivalencia · Negativo |
| Canal · Caso par | UI · — |
| Prioridad · Camino feliz · Automatizable | Media · No · Sí (`e2e/`) |

**Pre-requisitos:** S 1: la aplicación está corriendo en `<APP>`. S 2: existe un usuario creado con PR-01 usando `D 1` y `D 2`.

**Datos de prueba:** D 1: Email `qa+cp-sus-158-001@example.com`. D 2: Contraseña `Clave123!`. D 3: Formulario `/subscriptions/new` recién abierto con `"Monto"` vacío.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito del navegador | Se abre una ventana sin sesión activa |
| 2 | Navegar a `<APP>` | Redirige a `/login?next=%2Fregister` |
| 3 | Escribir `qa+cp-sus-158-001@example.com` en `"Email"` (`login-email`) | El campo muestra `qa+cp-sus-158-001@example.com` |
| 4 | Escribir `Clave123!` en `"Contraseña"` (`login-password`) | El campo muestra 9 caracteres ocultos |
| 5 | Hacer click en `"Entrar"` (`login-submit`) | Se abre Registrar (`/register`) |
| 6 | Hacer click en `"Suscripciones"` (`register-nav-subscriptions`) | Se abre `/subscriptions` |
| 7 | Hacer click en `"Nueva"` (`subscriptions-new`) | En `/subscriptions/new`, la sección `"Calendario"` (`subscription-form-preview`) muestra `subscription-form-preview-empty` con el texto `"Completá el monto, el día de cobro y el mes de inicio para ver el calendario."` y no muestra `subscription-form-preview-due` ni `subscription-form-preview-upcoming` |

**Post-condición:** No se crean filas. El usuario queda como dato de prueba (email único, sin limpieza).

---

## (c) Historias o criterios de aceptación sin caso manual (huecos)

Cada código `H-SUS-01` a `H-SUS-06` referenciado en la tabla de trazabilidad `(a)` corresponde a un escenario o condición de borde que requiere interceptar la red, simular concurrencia en el mismo milisegundo, correr una prueba de carga o fijar el reloj del servidor/navegador fuera de la fecha actual (`ADR-028` y `docs/07-plan-de-testing.md` §5):

| ID de hueco | Historias y criterios afectados | Por qué no es ejecutable a mano de forma determinística | Dónde se cubre en pruebas automatizadas |
|---|---|---|---|
| **H-SUS-01** | `US-52 · CA-11, CA-14, CA-16` · `US-53 · CA-4, CA-11` | Requiere provocar un corte de red selectivo durante el envío de `create_subscription`, una respuesta que se pierda en tránsito después de insertar en la base (`CA-16`), la caída de `run-subscription-catchup` al entrar (`US-53 · CA-4`), los estados transitorios `*-loading` / `*-load-error` o una latencia artificial $> 8\text{ s}$ (`US-53 · CA-11`, `ADR-031`) sin tumbar la sesión de autenticación. | `e2e/` (Playwright con `page.route` para abortar o demorar llamadas RPC/REST). |
| **H-SUS-02** | `US-53 · CA-1` (con avance de meses desde una suscripción ARS ya creada) · `US-56 · CA-3` (esperar del día 1 al día 30 del mismo mes) · `US-57 · CA-2, CA-5` (pausar en un mes, dejar correr 3 meses calendario y reanudar cuando el mes corriente ya venció para que `generated_after = 1`) | Las 6 RPC públicas (`create_subscription`, `run_subscription_catchup`, `pause_subscription`, `resume_subscription`, `cancel_subscription`, `update_subscription`) usan siempre `public.argentina_today()` del servidor (`ADR-021`, `ADR-030`) y no reciben un parámetro de fecha. Por lo tanto, no se puede adelantar el reloj varios meses entre dos pasos manuales; la función interna `public.catch_up_subscriptions(p_user_id, p_today, p_subscription_id)` tiene `EXECUTE` revocado para `anon` y `authenticated`. | `supabase/tests/database/` (pgTAP invocando `public.catch_up_subscriptions` con `p_today` explícito) y `tests/domain/` (`computeDueOccurrences`). |
| **H-SUS-03** | `US-53 · CA-3` (`ADR-017`) | Lanzar dos ejecuciones de `run_subscription_catchup` exactamente en paralelo en el mismo milisegundo para ejercitar la contención de bloqueo de fila (`for no key update`) y el `ON CONFLICT DO NOTHING` no es reproducible a mano. El par manual (`CP-SUS-072`) verifica dos llamadas consecutivas; la carrera simultánea queda para automatización. | `supabase/tests/database/` y `e2e/` (`Promise.all` con dos llamadas simultáneas). |
| **H-SUS-04** | `US-53 · CA-5` | Prueba no funcional de performance: requiere precargar 50 suscripciones activas con 24 meses de atraso (1.250 transacciones generadas en una sola puesta al día) y medir con cronómetro de precisión que finalice en $< 5\text{ s}$ desde que se resuelve la sesión. | `e2e/` / suite de performance automatizada contra `supabase start`. |
| **H-SUS-05** | `US-54 · CA-2, CA-3, CA-6` (febrero bisiesto `2028-02` → día `29`) · `US-55 · CA-6` (ejecutado el propio día 30 como `<HOY>`) | El alta de suscripciones valida que `start_period` esté entre `-24` y `+12` meses respecto del período corriente (`ADR-032`). Ejecutando en octubre de 2026, el rango permitido es `2024-10` a `2027-10`, dentro del cual ningún mes de febrero es bisiesto (`2024-02` y `2028-02` caen fuera de la ventana). En `CP-SUS-078` a `CP-SUS-080` se verifica febrero no bisiesto (`2026-02` → `28/02/2026`) y abril (`2026-04` → `30/04/2026`). | `tests/domain/` (`computeDueOccurrences` con `2028-02`) y `supabase/tests/database/` (`catch_up_subscriptions` con `p_today = '2028-03-01'`). |
| **H-SUS-06** | `US-55 · CA-5` · `US-75 · CA-9` (`ADR-021`, `ADR-031`) | Requiere ejecutar exactamente entre las `21:00` y las `23:59` hora de Argentina (`00:00` a `02:59` UTC del día siguiente) con el dispositivo configurado en UTC para comprobar que el cliente (`todayInArgentina()`) y el servidor (`argentina_today()`) no adelantan el día de cobro. | `tests/domain/` y `e2e/` con reloj simulado en el navegador (`page.clock`). |

---

## (d) Ambigüedades para el PO

No se detectaron contradicciones ni ambigüedades sin oráculo entre [`entrega-2/historias/suscripciones.md`](../historias/suscripciones.md), [`docs/06-suscripciones.md`](../../docs/06-suscripciones.md), [`docs/04-data-model.md`](../../docs/04-data-model.md) y las migraciones de `supabase/migrations/`: todos los mensajes de validación, códigos SQLSTATE (`23514`, `23505`, `23503`, `P0002`, `42501`), estructuras JSON de retorno de las 6 RPC públicas y `data-testid` están especificados de forma unívoca.
