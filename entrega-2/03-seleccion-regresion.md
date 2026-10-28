# Entrega 2 · Selección de casos de regresión (V1 sobre V2)

Planilla: `03-seleccion-regresion.xlsx` (una hoja con los 74 casos de V1 y la decisión, y otra con los defectos de V1 a confirmar). Criterio: [ADR-027](../docs/adr/027-regresion-por-seleccion-de-riesgo.md).

La consigna pide **seleccionar** los casos de V1 que se ejecutan sobre V2 para comprobar que lo que ya funcionaba sigue funcionando. Esta selección es por riesgo: cada caso figura como incluido o excluido, con su motivo.

## 1. Criterio

Entra a la regresión un caso de V1 si cumple **alguna** de estas reglas:

| Regla | Qué incluye | Por qué |
|---|---|---|
| 1 | Todos los casos de prioridad **Alta** | Son los que cubren lo que no puede romperse. |
| 2 | Los casos de prioridad **Alta o Media** de los módulos que V2 toca: Registro, Cuotas, Resumen y Monedas, y los de Ajustes que V2 usa (cuentas y tipo de cambio de referencia: CP-CFG-006, 007, 009 y 010) | V2 modifica esas pantallas o escribe en las mismas tablas (el Resumen lee lo que crea cualquier transacción, incluidas las de suscripciones y deudas). |
| 3 | Los casos ligados a un defecto de V1 **corregido y sin confirmar** | Sirven de testeo de confirmación. |
| 4 | Los casos que **fallaron** en V1 | Hay que verificar que se arreglaron. |

Se excluyen los casos de prioridad Media o Baja de módulos que V2 no toca (Acceso y Configuración) y los de prioridad Baja de los módulos que sí toca, salvo que los incluya otra regla (por ejemplo, que confirmen un defecto). Conservan el resultado de su última ejecución. Si aparece un defecto en un módulo excluido, se amplía la selección y se registra acá.

## 2. Resumen

- **Casos de V1:** 74. **Incluidos en la regresión:** 58. **Excluidos:** 16.
- Resultado de V1 de los incluidos: 56 PASSED y 2 FAILED (CP-ACC-004 y CP-CFG-004).

| Módulo | Casos | Incluidos | Excluidos |
|---|---|---|---|
| Acceso | 12 | 9 | 3 |
| Configuración | 15 | 9 | 6 |
| Registro | 16 | 13 | 3 |
| Cuotas | 13 | 12 | 1 |
| Monedas | 7 | 6 | 1 |
| Resumen | 11 | 9 | 2 |
| **Total** | **74** | **58** | **16** |

| Prioridad | Casos | Incluidos | Excluidos |
|---|---|---|---|
| Alta | 39 | 39 | 0 |
| Media | 26 | 19 | 7 |
| Baja | 9 | 0 | 9 |
| **Total** | **74** | **58** | **16** |

## 3. Casos incluidos (58)

| ID | Prioridad | Título | Resultado en V1 | Reglas | Motivo |
|---|---|---|---|---|---|
| CP-ACC-001 | Alta | Sin sesión, la app redirige al login | PASSED | 1 | prioridad Alta |
| CP-ACC-002 | Alta | Una ruta privada abierta sin sesión conserva el destino | PASSED · DEF-008 | 1, 3 | prioridad Alta; confirma DEF-008 (corregido, falta confirmación) |
| CP-ACC-003 | Alta | Crear una cuenta con email y contraseña válidos | PASSED | 1 | prioridad Alta |
| CP-ACC-004 | Alta | Contraseñas que no cumplen los criterios se rechazan | FAILED · DEF-005 | 1, 3, 4 | prioridad Alta; confirma DEF-005 (corregido, falta confirmación); falló en V1 |
| CP-ACC-005 | Alta | No se puede crear una cuenta con un email ya registrado | PASSED | 1 | prioridad Alta |
| CP-ACC-008 | Alta | Una cuenta nueva tiene el catálogo inicial sembrado | PASSED | 1 | prioridad Alta |
| CP-ACC-009 | Alta | Cerrar sesión y no poder volver con "atrás" | PASSED | 1 | prioridad Alta |
| CP-ACC-011 | Alta | Aislamiento entre usuarios en todas las tablas (par de autorización) | PASSED | 1 | prioridad Alta |
| CP-ACC-012 | Alta | Contraseña y confirmación distintas bloquean el alta | PASSED | 1 | prioridad Alta |
| CP-CFG-001 | Alta | Crear una categoría con nombre y color | PASSED | 1 | prioridad Alta |
| CP-CFG-003 | Media | No se permiten dos categorías activas con el mismo nombre | PASSED | 3 | confirma DEF-019 y DEF-025 (corregido, falta confirmación) |
| CP-CFG-004 | Alta | Archivar una categoría con historia | FAILED · DEF-006 | 1, 3, 4 | prioridad Alta; confirma DEF-006 (corregido, falta confirmación); falló en V1 |
| CP-CFG-006 | Alta | Crear una cuenta de tarjeta de crédito | PASSED | 1, 2, 3 | prioridad Alta; V2 lo usa: cuentas de Ajustes (las usan suscripciones y registro); confirma DEF-011 (corregido, falta confirmación) |
| CP-CFG-007 | Media | No se permiten dos cuentas activas con el mismo nombre | PASSED | 2 | V2 lo usa: cuentas de Ajustes (las usan suscripciones y registro) |
| CP-CFG-008 | Alta | La siembra concurrente no duplica el catálogo | PASSED | 1 | prioridad Alta |
| CP-CFG-009 | Alta | Cargar y actualizar el tipo de cambio de referencia del mes | PASSED | 1, 2 | prioridad Alta; V2 lo usa: tipo de cambio de referencia (lo usan suscripciones y deudas en USD) |
| CP-CFG-010 | Media | Tipo de cambio de referencia en cero o negativo | PASSED | 2, 3 | V2 lo usa: tipo de cambio de referencia (lo usan suscripciones y deudas en USD); confirma DEF-018 (corregido, falta confirmación) |
| CP-CFG-011 | Alta | Después de crear la cuenta aparece la configuración inicial | PASSED (ejecución 2) · DEF-017 | 1 | prioridad Alta |
| CP-REG-001 | Alta | El registro es la pantalla de inicio | PASSED | 1, 2 | prioridad Alta; módulo que V2 toca: Registro (V2 suma gasto compartido, aviso de guardado y confirmación de borrado) |
| CP-REG-002 | Media | La fecha viene precargada con hoy | PASSED | 2 | módulo que V2 toca: Registro (V2 suma gasto compartido, aviso de guardado y confirmación de borrado) |
| CP-REG-004 | Media | Elegir la categoría tocando un chip | PASSED | 2 | módulo que V2 toca: Registro (V2 suma gasto compartido, aviso de guardado y confirmación de borrado) |
| CP-REG-005 | Media | Una categoría archivada no se ofrece ni se acepta por API | PASSED | 2 | módulo que V2 toca: Registro (V2 suma gasto compartido, aviso de guardado y confirmación de borrado) |
| CP-REG-008 | Media | Fecha de ayer sí, fecha de mañana no | PASSED | 2 | módulo que V2 toca: Registro (V2 suma gasto compartido, aviso de guardado y confirmación de borrado) |
| CP-REG-009 | Media | Confirmación y formulario limpio después de guardar | PASSED | 2 | módulo que V2 toca: Registro (V2 suma gasto compartido, aviso de guardado y confirmación de borrado) |
| CP-REG-010 | Alta | Monto vacío, cero o negativo no se guarda | PASSED | 1, 2, 3 | prioridad Alta; módulo que V2 toca: Registro (V2 suma gasto compartido, aviso de guardado y confirmación de borrado); confirma DEF-012 (corregido, falta confirmación) |
| CP-REG-011 | Media | Monto con tres decimales | PASSED | 2, 3 | módulo que V2 toca: Registro (V2 suma gasto compartido, aviso de guardado y confirmación de borrado); confirma DEF-013 (corregido, falta confirmación) |
| CP-REG-012 | Alta | Eliminar una transacción la saca del total del mes | PASSED · DEF-007 | 1, 2, 3 | prioridad Alta; módulo que V2 toca: Registro (V2 suma gasto compartido, aviso de guardado y confirmación de borrado); confirma DEF-007 (corregido, falta confirmación) |
| CP-REG-013 | Alta | Eliminar una compra con cuotas en meses cerrados avisa y es retroactivo | PASSED | 1, 2 | prioridad Alta; módulo que V2 toca: Registro (V2 suma gasto compartido, aviso de guardado y confirmación de borrado) |
| CP-REG-014 | Alta | Otro usuario no puede leer ni borrar una transacción ajena | PASSED | 1, 2 | prioridad Alta; módulo que V2 toca: Registro (V2 suma gasto compartido, aviso de guardado y confirmación de borrado) |
| CP-REG-015 | Alta | No se puede escribir en transactions salteando la RPC | PASSED | 1, 2 | prioridad Alta; módulo que V2 toca: Registro (V2 suma gasto compartido, aviso de guardado y confirmación de borrado) |
| CP-REG-016 | Media | El monto toma el foco con teclado numérico | PASSED | 2 | módulo que V2 toca: Registro (V2 suma gasto compartido, aviso de guardado y confirmación de borrado) |
| CP-CUO-001 | Alta | Compra en 12 cuotas genera 12 imputaciones consecutivas | PASSED | 1, 2 | prioridad Alta; módulo que V2 toca: Cuotas (V2 suma la compra en cuotas empezada y la confirmación destructiva) |
| CP-CUO-002 | Alta | Previsualización del impacto mensual antes de guardar | PASSED | 1, 2 | prioridad Alta; módulo que V2 toca: Cuotas (V2 suma la compra en cuotas empezada y la confirmación destructiva) |
| CP-CUO-003 | Alta | Cambiar a una cuenta que no es crédito resetea las cuotas | PASSED | 1, 2, 3 | prioridad Alta; módulo que V2 toca: Cuotas (V2 suma la compra en cuotas empezada y la confirmación destructiva); confirma DEF-009 (corregido, falta confirmación) |
| CP-CUO-004 | Alta | División exacta: 12 cuotas iguales | PASSED | 1, 2 | prioridad Alta; módulo que V2 toca: Cuotas (V2 suma la compra en cuotas empezada y la confirmación destructiva) |
| CP-CUO-005 | Alta | El resto lo absorbe la última cuota | PASSED | 1, 2 | prioridad Alta; módulo que V2 toca: Cuotas (V2 suma la compra en cuotas empezada y la confirmación destructiva) |
| CP-CUO-006 | Alta | Cantidad de cuotas: 0, 1, 2, 12 y 13 | PASSED | 1, 2 | prioridad Alta; módulo que V2 toca: Cuotas (V2 suma la compra en cuotas empezada y la confirmación destructiva) |
| CP-CUO-007 | Media | El Resumen separa las cuotas de meses anteriores | PASSED | 2 | módulo que V2 toca: Cuotas (V2 suma la compra en cuotas empezada y la confirmación destructiva) |
| CP-CUO-009 | Alta | Borrar una compra en cuotas saca todas sus cuotas | PASSED | 1, 2 | prioridad Alta; módulo que V2 toca: Cuotas (V2 suma la compra en cuotas empezada y la confirmación destructiva) |
| CP-CUO-010 | Media | En USD, la suma en pesos de las cuotas es exacta | PASSED | 2 | módulo que V2 toca: Cuotas (V2 suma la compra en cuotas empezada y la confirmación destructiva) |
| CP-CUO-011 | Alta | Otro usuario no ve las cuotas de una compra ajena | PASSED | 1, 2 | prioridad Alta; módulo que V2 toca: Cuotas (V2 suma la compra en cuotas empezada y la confirmación destructiva) |
| CP-CUO-012 | Alta | Un ingreso no admite cuotas aunque la cuenta sea crédito | PASSED | 1, 2 | prioridad Alta; módulo que V2 toca: Cuotas (V2 suma la compra en cuotas empezada y la confirmación destructiva) |
| CP-CUO-013 | Alta | Un fallo a mitad de create_transaction no deja datos parciales | PASSED | 1, 2 | prioridad Alta; módulo que V2 toca: Cuotas (V2 suma la compra en cuotas empezada y la confirmación destructiva) |
| CP-MON-001 | Alta | Gasto en USD con el tipo de cambio sugerido | PASSED | 1, 2 | prioridad Alta; módulo que V2 toca: Monedas (las suscripciones y las deudas en USD usan el tipo de cambio) |
| CP-MON-002 | Alta | Tabla de decisión de moneda y tipo de cambio (6 filas) | PASSED | 1, 2 | prioridad Alta; módulo que V2 toca: Monedas (las suscripciones y las deudas en USD usan el tipo de cambio) |
| CP-MON-003 | Media | Pisar el tipo de cambio sugerido | PASSED · DEF-020 | 2, 3 | módulo que V2 toca: Monedas (las suscripciones y las deudas en USD usan el tipo de cambio); confirma DEF-020 (corregido, falta confirmación) |
| CP-MON-004 | Alta | Cambiar la referencia no altera lo ya guardado | PASSED | 1, 2 | prioridad Alta; módulo que V2 toca: Monedas (las suscripciones y las deudas en USD usan el tipo de cambio) |
| CP-MON-005 | Alta | El total del mes en pesos incluye lo gastado en dólares | PASSED | 1, 2 | prioridad Alta; módulo que V2 toca: Monedas (las suscripciones y las deudas en USD usan el tipo de cambio) |
| CP-MON-007 | Alta | Otro usuario no lee ni modifica el tipo de cambio ajeno | PASSED | 1, 2 | prioridad Alta; módulo que V2 toca: Monedas (las suscripciones y las deudas en USD usan el tipo de cambio) |
| CP-DAS-001 | Alta | El Resumen abre en el mes actual con su total | PASSED | 1, 2 | prioridad Alta; módulo que V2 toca: Resumen (V2 suma el neto de reembolsos, la torta y el detalle de categoría) |
| CP-DAS-002 | Alta | El mes elegido vive en la URL | PASSED | 1, 2 | prioridad Alta; módulo que V2 toca: Resumen (V2 suma el neto de reembolsos, la torta y el detalle de categoría) |
| CP-DAS-003 | Media | Período inválido o ausente cae al mes actual | PASSED | 2, 3 | módulo que V2 toca: Resumen (V2 suma el neto de reembolsos, la torta y el detalle de categoría); confirma DEF-014 (corregido, falta confirmación) |
| CP-DAS-004 | Media | Gasto por categoría en barras | PASSED | 2 | módulo que V2 toca: Resumen (V2 suma el neto de reembolsos, la torta y el detalle de categoría) |
| CP-DAS-005 | Media | Gasto por cuenta | PASSED | 2 | módulo que V2 toca: Resumen (V2 suma el neto de reembolsos, la torta y el detalle de categoría) |
| CP-DAS-006 | Media | Ingresos y balance positivo | PASSED | 2 | módulo que V2 toca: Resumen (V2 suma el neto de reembolsos, la torta y el detalle de categoría) |
| CP-DAS-008 | Media | Últimos 10 movimientos con acceso a la lista completa | PASSED | 2 | módulo que V2 toca: Resumen (V2 suma el neto de reembolsos, la torta y el detalle de categoría) |
| CP-DAS-010 | Media | Mes sin datos: estado vacío con acceso al registro | PASSED | 2 | módulo que V2 toca: Resumen (V2 suma el neto de reembolsos, la torta y el detalle de categoría) |
| CP-DAS-011 | Alta | El Resumen de un usuario nunca muestra datos de otro | PASSED | 1, 2 | prioridad Alta; módulo que V2 toca: Resumen (V2 suma el neto de reembolsos, la torta y el detalle de categoría) |

## 4. Casos excluidos (16)

| ID | Prioridad | Título | Resultado en V1 | Motivo |
|---|---|---|---|---|
| CP-ACC-006 | Media | Credenciales inválidas en el login, sin arrastrar el error al signup | PASSED | prioridad Media en el módulo Acceso, que V2 no toca; conserva el resultado de la ejecución de V1 |
| CP-ACC-007 | Media | Alta sin sesión (confirmación de email activa) no entra a la app | PASSED | prioridad Media en el módulo Acceso, que V2 no toca; conserva el resultado de la ejecución de V1 |
| CP-ACC-010 | Media | La sesión persiste al recargar y al reabrir el navegador | PASSED | prioridad Media en el módulo Acceso, que V2 no toca; conserva el resultado de la ejecución de V1 |
| CP-CFG-002 | Media | Renombrar una categoría y cambiarle el color | PASSED | prioridad Media en el módulo Configuración, que V2 no toca; conserva el resultado de la ejecución de V1 |
| CP-CFG-005 | Baja | Reusar el nombre de una categoría archivada | PASSED | prioridad Baja en el módulo Configuración, que V2 no toca; conserva el resultado de la ejecución de V1 |
| CP-CFG-012 | Media | Saltear todo el setup deja la siembra de siempre | PASSED (ejecución 2) · DEF-017 | prioridad Media en el módulo Configuración, que V2 no toca; conserva el resultado de la ejecución de V1 |
| CP-CFG-013 | Media | Destildar una categoría en el setup la archiva | PASSED (ejecución 2) · DEF-017 | prioridad Media en el módulo Configuración, que V2 no toca; conserva el resultado de la ejecución de V1 |
| CP-CFG-014 | Media | La cuenta elegida como predeterminada viene preseleccionada | PASSED (ejecución 2) · DEF-017 | prioridad Media en el módulo Configuración, que V2 no toca; conserva el resultado de la ejecución de V1 |
| CP-CFG-015 | Baja | El setup no reaparece y se puede reabrir desde Ajustes | PASSED (ejecución 2) · DEF-017 | prioridad Baja en el módulo Configuración, que V2 no toca; conserva el resultado de la ejecución de V1 |
| CP-REG-003 | Baja | Tipo "gasto" y moneda ARS por defecto | PASSED | prioridad Baja en el módulo Registro, que V2 toca: ninguna otra regla la incluye (no es Alta, no confirma un defecto y no falló en V1); conserva el resultado de la ejecución de V1 |
| CP-REG-006 | Baja | La cuenta viene precargada con la última usada | PASSED | prioridad Baja en el módulo Registro, que V2 toca: ninguna otra regla la incluye (no es Alta, no confirma un defecto y no falló en V1); conserva el resultado de la ejecución de V1 |
| CP-REG-007 | Baja | Guardar sin nota | PASSED | prioridad Baja en el módulo Registro, que V2 toca: ninguna otra regla la incluye (no es Alta, no confirma un defecto y no falló en V1); conserva el resultado de la ejecución de V1 |
| CP-CUO-008 | Baja | El listado muestra el número de cuota | PASSED | prioridad Baja en el módulo Cuotas, que V2 toca: ninguna otra regla la incluye (no es Alta, no confirma un defecto y no falló en V1); conserva el resultado de la ejecución de V1 |
| CP-MON-006 | Baja | El gasto en dólares se ve por separado | PASSED | prioridad Baja en el módulo Monedas, que V2 toca: ninguna otra regla la incluye (no es Alta, no confirma un defecto y no falló en V1); conserva el resultado de la ejecución de V1 |
| CP-DAS-007 | Baja | Balance negativo con signo explícito | PASSED | prioridad Baja en el módulo Resumen, que V2 toca: ninguna otra regla la incluye (no es Alta, no confirma un defecto y no falló en V1); conserva el resultado de la ejecución de V1 |
| CP-DAS-009 | Baja | Una cuota heredada no cuenta como día con registro | PASSED | prioridad Baja en el módulo Resumen, que V2 toca: ninguna otra regla la incluye (no es Alta, no confirma un defecto y no falló en V1); conserva el resultado de la ejecución de V1 |

## 5. Defectos de V1 a confirmar en V2 (22)

Testeo de confirmación, ejecutado el **2026-10-28**: cada defecto de V1 "corregido, falta confirmación" se verificó sobre V2 repitiendo los pasos de su reporte (`entrega-1/04-reportes-de-defectos.md`). Resultado: **21 confirmados corregidos y 1 no concluyente** (DEF-023, un defecto intermitente, que el equipo decidió cerrar igual: se reabre si reaparece). Se ejecutó con Playwright contra la aplicación y Supabase locales, no a mano (ver `06-reporte-de-ejecucion`, apartado de desvíos).

| Defecto | Título | Severidad | Estado en V1 | Se confirma con | Resultado en V2 | Evidencia |
|---|---|---|---|---|---|---|
| DEF-005 | El servidor acepta contraseñas que no cumplen FR-01/US-67 | Media | Corregido · falta confirmación | CP-ACC-004 | **Confirmado** | Contra Supabase Auth local: crear una cuenta con «abc1234» y con «abcdefgh» responde HTTP 422 (weak_password) en las dos. |
| DEF-006 | Transacción de una categoría archivada no muestra marca de archivada en /transactions | Baja | Corregido · falta confirmación | CP-CFG-004 | **Confirmado** | El movimiento muestra: «Entretenimiento archivada Efectivo -$8.000,00» |
| DEF-007 | Una transacción eliminada desaparece del historial en vez de quedar marcada como eliminada | Media | Corregido · falta confirmación | CP-REG-012 | **Confirmado** | Activos tras eliminar: 0. En «Eliminados» se ve «Martes 20 de octubre Indumentaria eliminada Efectivo -$50.000,00» con botón «Restaurar» |
| DEF-008 | Tras iniciar sesión se ignora el destino original (next) y siempre entra a /register | Media | Corregido · falta confirmación | CP-ACC-002 | **Confirmado** | Sin sesión redirige a /login?next=%2Fdashboard%3Fperiod%3D2026-06; después de entrar termina en /dashboard?period=2026-06 |
| DEF-009 | Cambiar el tipo de una cuenta a no-crédito deja compras en cuotas existentes violando I6 | Media | Corregido en #183 · falta confirmación | CP-CUO-003 | **Confirmado** | Con una compra en 3 cuotas, cambiar la cuenta «Tarjeta de crédito» a efectivo por API responde HTTP 400 (I6: la cuenta tiene compras en cuotas, no puede dejar de ser tarjeta de crédito) y la cuenta sigue siendo tarjeta de crédito. |
| DEF-010 | Archivar todas las categorías hace que se resiembren las 8 por defecto | Media | Corregido · falta confirmación | Repetir los pasos del reporte (sin caso propio) | **Confirmado** | Tras archivar las 8 y abrir Registrar (dos veces): 0 categorías activas, 8 en total |
| DEF-011 | No se pueden editar ni archivar cuentas (medios de pago) desde la UI | Media | Corregido · falta confirmación | CP-CFG-006 | **Confirmado** | La lista de cuentas tiene 5 botones «Editar» y 5 «Archivar» (una por cuenta) |
| DEF-012 | Un monto extremo pasa la validación del cliente y termina en un error técnico en inglés | Baja | Corregido · falta confirmación | CP-REG-010 | **Confirmado** | Con 1.000.000.000.000 «Siguiente» queda deshabilitado y aparece el aviso «El monto máximo es $999.999.999.999,99». |
| DEF-013 | Con un monto USD muy chico, Guardar se deshabilita sin ningún mensaje visible | Baja | Corregido · falta confirmación | CP-REG-011 | **Confirmado** | Con US$0,01 a tipo de cambio 0,01 «Siguiente» queda deshabilitado y se ve «En pesos daría menos de $0,01.». |
| DEF-014 | El período 0000-01 en el dashboard muestra un error de base de datos crudo | Baja | Corregido · falta confirmación | CP-DAS-003 | **Confirmado** | Con ?period=0000-01 no hay error; la dirección pasa a /dashboard?period=2026-10 y el mes es Octubre 2026 |
| DEF-015 | Los botones de la paleta de color en /settings no tienen data-testid | Baja | Corregido · falta confirmación | Repetir los pasos del reporte (sin caso propio) | **Confirmado** | 10 botones de color con data-testid; 8 botones «Editar» con identificador distinto en cada fila |
| DEF-016 | No se puede crear ninguna deuda vinculada, ni siquiera una válida (falta SECURITY DEFINER) | Media | Corregido en #183 · falta confirmación | Repetir los pasos del reporte (sin caso propio) | **Confirmado** | Gasto de $1.000 con deuda de $400: HTTP 200 (se crea). Con deuda de $1.500: HTTP 400 I7: la deuda no puede superar el monto del gasto |
| DEF-018 | El registro acepta un tipo de cambio con más de 4 decimales y la base lo redondea sin avisar | Baja | Corregido · falta confirmación | CP-CFG-010 | **Confirmado** | Con tipo de cambio 1250,55555 «Siguiente» queda deshabilitado y se ve «Usá hasta 4 decimales». |
| DEF-019 | Se pueden tener dos categorías activas que solo difieren en mayúsculas ("Salud" y "salud") | Baja | Corregido en #183 · falta confirmación | CP-CFG-003 | **Confirmado** | Crear «salud» con «Salud» activa: «Ya existe una categoría activa con ese nombre»; en la lista queda una sola |
| DEF-020 | El tipo de cambio sugerido se muestra con el formato de la base ("1250.0000") | Baja | Corregido · falta confirmación | CP-MON-003 | **Confirmado** | El tipo de cambio sugerido se muestra como «1.250,00» |
| DEF-021 | Los montos grandes se salen de sus casilleros en el Resumen (celular) | Media | Corregido · falta confirmación | Repetir los pasos del reporte (sin caso propio) | **Confirmado** | En Chromium a 390 px de ancho, los montos entran en su casillero ($2.165.003.118,50, $81.818.491.500,00 y $79.653.488.381,50) y no hay scroll horizontal. No se probó en un iPhone con Safari. |
| DEF-023 | Después de crear la cuenta, a veces la pantalla queda en blanco en /register | Alta | Corregido · falta confirmación | Repetir los pasos del reporte (sin caso propio) | **No concluyente** (cerrado por decisión del equipo) | Chromium: 8 de 8 altas llegan a la configuración inicial; WebKit: 8 de 8 altas llegan a la configuración inicial. El defecto era intermitente (2 de 12 en producción con WebKit, 1 de ~80 en local): 16 altas sin fallas no alcanzan para descartarlo |
| DEF-024 | Los diálogos de confirmación no toman el foco del teclado | Media | Corregido · falta confirmación | Repetir los pasos del reporte (sin caso propio) | **Confirmado** | El foco entra al diálogo (true), 6 Tab seguidos no salen de él (true), Escape lo cierra (true) y el foco queda en «settings-accounts-delete» |
| DEF-025 | El error al editar una cuenta o una categoría aparece fuera de la pantalla | Baja | Corregido · falta confirmación | CP-CFG-003 | **Confirmado** | El aviso «Esta cuenta tiene compras en cuotas: tiene que seguir siendo tarjeta de crédito» aparece junto a la fila que se edita (a 100 px; pantalla de 812 px) |
| DEF-026 | Sin categorías activas, el registro y el setup quedan sin salida | Baja | Corregido · falta confirmación | Repetir los pasos del reporte (sin caso propio) | **Confirmado** | Con las 8 categorías archivadas, Registrar dice «No tenés categorías activas. Creá una o reactivá una archivada en Ajustes.» con enlace a Ajustes, y Ajustes muestra «Archivadas» con un botón para reactivar cada una (8). No se revisó el paso «Tus categorías» de la configuración inicial. |
| DEF-027 | Al llegar al límite de altas, el mensaje dice "Probá de nuevo" | Baja | Corregido · falta confirmación | Repetir los pasos del reporte (sin caso propio) | **Confirmado** | Con un 429 simulado la pantalla dice: «Demasiados intentos. Esperá unos minutos antes de volver a intentar» |
| DEF-028 | Una cuenta nueva puede quedar sin cuentas (medios de pago) si la siembra tarda | Media | Corregido · falta confirmación | Repetir los pasos del reporte (sin caso propio) | **Confirmado** | Con la siembra demorada (cuentas 4 s, categorías 1,5 s) Registrar muestra 5 cuentas |

Los defectos de V1 que ya figuraban como cerrados (DEF-001, 002, 003, 004, 017 y 022) no se repitieron.

## 6. Cambios a la selección

Ninguno todavía. Si un defecto aparece en un módulo excluido, se agrega acá el caso que se suma y el motivo.
