# Entrega 3 · Ejecución de casos de prueba (V3) y regresión de V1 y V2

Planilla: [`04-ejecucion.xlsx`](04-ejecucion.xlsx) (índice con el resultado y las pruebas de cada caso, y un resumen por módulo). Se genera con `python entrega-3/fuentes/generar_ejecucion.py` a partir de los resultados de `entrega-3/ejecucion/`.

## Condiciones de la ejecución

- **Fecha:** 2026-11-11, sobre `main` con todos los PR de V3 mergeados (más los tests agregados en esta ejecución).
- **Entorno:** Vite (`http://127.0.0.1:5173`) y Supabase local con todas las migraciones, Chromium emulando un celular de 390 × 844 px, un usuario nuevo por prueba (PR-01). La base de producción tiene las mismas migraciones.
- **Quién ejecutó:** la suite automatizada, corrida con IA (Claude Code) sobre el stack local: Playwright (272 de 272 tests), Vitest (1088 de 1088) y pgTAP. **No hay ejecución manual del equipo en esta planilla.**
- **Criterio:** un caso es PASSED si pasaron todas las pruebas que lo cubren, FAILED si alguna falló y BLOCKED si ninguna prueba lo cubre o no se pudo correr. La columna «Pruebas que lo cubren» de la planilla nombra cada una. Un caso de UI y API puede estar cubierto por Playwright y por pgTAP a la vez.
- **Cobertura parcial:** un test de Playwright puede cubrir varios casos (por ejemplo, un test por criterio de aceptación para varios casos de una historia). Eso es cobertura del comportamiento, no una repetición paso a paso de la tabla del caso.
- **pgTAP:** en local `update_subscription.test.sql` falla 3 de 164 (tests 75 a 77) por usuarios viejos de otras corridas en la base local; en la CI pasa y ningún caso de V3 depende de ese archivo.

## Resultado

| Conjunto | Casos | PASSED | FAILED | BLOCKED | % PASSED |
|---|---|---|---|---|---|
| Casos de V3 | 165 | 165 | 0 | 0 | 100.0 % |
| Regresión de V1 y V2 | 177 | 177 | 0 | 0 | 100.0 % |
| **Total** | 342 | 342 | 0 | 0 | 100.0 % |

### Por módulo

| Módulo | V3 PASSED | V3 FAILED | V3 BLOCKED | Regresión PASSED | Regresión FAILED | Regresión BLOCKED |
|---|---|---|---|---|---|---|
| ACC | 4 | 0 | 0 | 9 | 0 | 0 |
| CAT | 0 | 0 | 0 | 3 | 0 | 0 |
| CFG | 26 | 0 | 0 | 6 | 0 | 0 |
| CUO | 0 | 0 | 0 | 10 | 0 | 0 |
| DAS | 21 | 0 | 0 | 3 | 0 | 0 |
| DEU | 30 | 0 | 0 | 47 | 0 | 0 |
| EXP | 0 | 0 | 0 | 27 | 0 | 0 |
| IMP | 17 | 0 | 0 | 15 | 0 | 0 |
| MON | 0 | 0 | 0 | 5 | 0 | 0 |
| NAV | 12 | 0 | 0 | 15 | 0 | 0 |
| REG | 36 | 0 | 0 | 6 | 0 | 0 |
| SUS | 19 | 0 | 0 | 31 | 0 | 0 |

## Casos que no están en PASSED

Ninguno: todos los casos de V3 y de la regresión están en PASSED.

## Resultado por caso de V3

| ID | Prioridad | Título | Historia | Status | Cubierto por |
|---|---|---|---|---|---|
| CP-SUS-062 | Alta | Una suscripción activa que todavía no cobró aparece como por cobrar con su total y su cuenta de cobros | ADR-045 | **PASSED** | Playwright |
| CP-SUS-063 | Alta | Las pausadas y las canceladas no cuentan como por cobrar | ADR-045 | **PASSED** | Playwright |
| CP-SUS-064 | Media | Una suscripción en US$ sin tipo de cambio del mes se informa aparte y no entra al total | ADR-045 | **PASSED** | Playwright |
| CP-SUS-065 | Media | Si no se pueden leer las suscripciones, el Resumen se ve igual y sin la tarjeta | ADR-045 | **PASSED** | Playwright |
| CP-SUS-066 | Alta | En el mes en curso solo cuenta lo que su día de cobro todavía no llegó, y un mes pasado no tiene nada | ADR-045 | **PASSED** | Vitest |
| CP-SUS-067 | Media | La X cierra la franja y no vuelve al cambiar de pantalla ni al recargar | US-53 | **PASSED** | Playwright |
| CP-SUS-068 | Media | «Reintentar» llama de nuevo y, si anda, la franja desaparece | US-53 | **PASSED** | Playwright |
| CP-ACC-013 | Alta | Una cuenta nueva ve el setup, lo saltea y queda adentro de la app aunque recargue | US-68 | **PASSED** | Playwright |
| CP-ACC-014 | Alta | Completar el setup con el primer gasto lleva a la app y al volver a iniciar sesión no reaparece | US-68 | **PASSED** | Playwright |
| CP-ACC-015 | Alta | Si guardar o leer el estado del setup falla, igual se entra a la app | US-68 | **PASSED** | Playwright |
| CP-ACC-016 | Media | Una cuenta anterior a US-68, sin fila de setup, entra directo a la app | US-68 | **PASSED** | Playwright |
| CP-IMP-042 | Media | La plantilla y la hoja «Instrucciones» traen «Cuotas pendientes» | US-80 | **PASSED** | Vitest |
| CP-IMP-043 | Alta | Una compra de 6 cuotas con 3 pendientes se imputa desde este mes y se ve en Movimientos | US-80 | **PASSED** | Playwright |
| CP-IMP-044 | Alta | Con resto, con todas pendientes y sin la columna | US-80 | **PASSED** | Vitest |
| CP-IMP-045 | Alta | «Cuotas pendientes» solo va en una compra en cuotas y entre 1 y N | US-80 | **PASSED** | Playwright |
| CP-IMP-046 | Alta | Con esa fecha todavía no puede haber tantas cuotas pagadas | US-80 | **PASSED** | Vitest |
| CP-IMP-047 | Media | Un error anterior de la fila oculta los de «Cuotas pendientes» | US-80 | **PASSED** | Vitest |
| CP-IMP-048 | Alta | En US$, con y sin resto en pesos | US-80 | **PASSED** | Vitest |
| CP-IMP-049 | Media | La cuota de este mes entra en «Cuotas de meses anteriores» del Resumen | US-80 | **PASSED** | pgTAP |
| CP-IMP-050 | Media | El diálogo de borrado muestra las imputaciones guardadas, no un calendario recalculado | US-80 | **PASSED** | Vitest |
| CP-IMP-051 | Alta | create_transaction rechaza cuotas pagadas inválidas | US-80 | **PASSED** | pgTAP |
| CP-IMP-052 | Media | import_transactions rechaza solo la fila inválida; anon no puede | US-80 | **PASSED** | pgTAP |
| CP-IMP-053 | Media | La guía nace cerrada, no está en el paso 3 y se deshabilita al importar | US-81 | **PASSED** | Playwright |
| CP-IMP-054 | Alta | Al abrirla muestra el título, el texto, los seis pasos, la tabla de ejemplo y el pie exactos | US-81 | **PASSED** | Playwright |
| CP-IMP-055 | Alta | Se cierra por cuatro vías, el foco vuelve y Tab no sale del diálogo | US-81 | **PASSED** | Playwright |
| CP-IMP-056 | Media | «Descargar plantilla» del diálogo baja el mismo archivo que el del paso 1 | US-81 | **PASSED** | Playwright |
| CP-IMP-057 | Media | Se puede ignorar y abrirla no cambia el archivo, el resumen, el filtro ni la URL | US-81 | **PASSED** | Playwright |
| CP-IMP-058 | Media | En 390 px entra con 16 px de margen y la tabla scrollea por dentro | US-81 | **PASSED** | Playwright |
| CP-DEU-085 | Alta | Agregar y quitar personas: foco, «Quitar» y renumeración | US-82 | **PASSED** | Playwright |
| CP-DEU-086 | Alta | Gasto de $120.000 con Sofía y Juan: una transacción, dos deudas, una sola llamada | US-82 | **PASSED** | Playwright |
| CP-DEU-087 | Alta | «Dividir en partes iguales»: con resto, sin resto y en US$ | US-82 | **PASSED** | Playwright |
| CP-DEU-088 | Alta | La suma contra el gasto: justo, un centavo de más y tope por fila | US-82 | **PASSED** | Playwright |
| CP-DEU-089 | Media | Tope de 10 personas | US-82 | **PASSED** | Playwright |
| CP-DEU-090 | Alta | Persona repetida o vacía deshabilita «Guardar gasto» | US-82 | **PASSED** | Playwright |
| CP-DEU-091 | Alta | Etiquetas «Compartido con…», aviso de éxito y diálogo de borrado con varias personas | US-82 | **PASSED** | Playwright |
| CP-DEU-092 | Alta | Deudas: una fila por persona, orden alfabético, y eliminar/restaurar el gasto | US-82 | **PASSED** | Playwright |
| CP-DEU-093 | Alta | La RPC rechaza pedidos inválidos y no deja filas | US-82 | **PASSED** | pgTAP |
| CP-DEU-094 | Alta | Con una sola persona rige lo de US-34 y US-41, con el pedido nuevo | US-82 | **PASSED** | pgTAP |
| CP-DEU-095 | Media | Cambiar la moneda, el tipo o el monto en el paso 1 con filas cargadas | US-82 | **PASSED** | Playwright |
| CP-DAS-012 | Alta | «Me deben» suma al gasto neto y muestra la línea de deudas sueltas | US-83 | **PASSED** | Playwright |
| CP-DAS-013 | Alta | «Debo» resta del gasto neto | US-83 | **PASSED** | Playwright |
| CP-DAS-014 | Alta | Saldar la deuda del mismo mes deja el número en −ingresos y la línea en $0,00 | US-83 | **PASSED** | Playwright |
| CP-DAS-015 | Alta | Una deuda de H−1 saldada hoy mueve H−1 y H, cada uno en su mes | US-83 | **PASSED** | Vitest |
| CP-DAS-016 | Media | Reabrir quita el evento de H y deja H−1 igual | US-83 | **PASSED** | Vitest |
| CP-DAS-017 | Alta | En US$ el evento usa el tipo de cambio congelado | US-83 | **PASSED** | Vitest |
| CP-DAS-018 | Alta | Un gasto compartido no mueve las deudas sueltas y la deuda suelta no cambia Gastado ni Ingresos | US-83 | **PASSED** | Playwright |
| CP-DAS-019 | Alta | Un mes con solo la deuda muestra el Resumen, no el estado vacío; la línea solo existe con eventos | US-83 | **PASSED** | Playwright |
| CP-DAS-020 | Media | El mes viene de la URL; el borde de mes se calcula en hora de Argentina; si falla la lectura no hay números | US-83 | **PASSED** | Playwright; Vitest |
| CP-REG-017 | Alta | «Editar» en las filas activas, no en las eliminadas, con los campos precargados y la vuelta al mismo período | US-84 | **PASSED** | Playwright |
| CP-REG-018 | Media | Tipo, moneda y tipo de cambio son texto y la RPC no los recibe | US-84 | **PASSED** | Playwright |
| CP-REG-019 | Alta | Cambiar el monto de un gasto de este mes se guarda sin diálogo | US-84 | **PASSED** | Playwright |
| CP-REG-020 | Alta | El resto de una compra en cuotas se reparte con la regla de C3, y la vista previa lo anticipa | US-84 | **PASSED** | Playwright |
| CP-REG-021 | Alta | Pasar de 6 cuotas a 3 deja exactamente 3 imputaciones numeradas de 1 a 3 | US-84 | **PASSED** | Playwright |
| CP-REG-022 | Alta | Mover la fecha a un mes cerrado abre el aviso de meses cerrados | US-84 | **PASSED** | Playwright |
| CP-REG-023 | Alta | Cambiar el monto en un mes cerrado: «Cancelar» no guarda y «Guardar igual» sí | US-84 | **PASSED** | Playwright |
| CP-REG-024 | Alta | Categoría sola y monto con categoría en meses cerrados | US-84 | **PASSED** | Playwright |
| CP-REG-025 | Media | Cambiar la cuenta en un mes cerrado | US-84 | **PASSED** | Playwright |
| CP-REG-026 | Alta | La nota, mover la fecha dentro del mes o cambiar solo una cuota futura no abren el aviso | US-84 | **PASSED** | Playwright |
| CP-REG-027 | Alta | En USD el tipo de cambio sigue congelado y el aviso va en pesos | US-84 | **PASSED** | Playwright |
| CP-REG-028 | Alta | Un ingreso no muestra categoría ni cuotas; por la API, con cuotas se rechaza | US-84 | **PASSED** | Playwright |
| CP-REG-029 | Alta | Pasar una compra en cuotas a efectivo reinicia las cuotas y lo avisa; la RPC lo rechaza (I6) | US-84 | **PASSED** | Playwright |
| CP-REG-030 | Alta | Validaciones de la pantalla con los mensajes de Registrar | US-84 | **PASSED** | Playwright |
| CP-REG-031 | Alta | Las mismas validaciones directo contra la RPC, con atomicidad | US-84 | **PASSED** | Playwright; pgTAP |
| CP-REG-032 | Media | Una categoría o cuenta archivada se ve, se puede guardar sin tocar y no se ofrece otra | US-84 | **PASSED** | Playwright |
| CP-REG-033 | Alta | Eliminado, de una suscripción y compartido muestran su aviso; la RPC responde el mensaje exacto | US-84 | **PASSED** | Playwright; pgTAP |
| CP-REG-034 | Media | «Guardar cambios» sigue los cambios y salir con cambios pide confirmar | US-84 | **PASSED** | Playwright |
| CP-REG-035 | Media | Si falla guardar se muestra el error, se conserva lo escrito y reintentar guarda | US-84 | **PASSED** | Playwright |
| CP-REG-036 | Media | Editar dos veces, o dos a la vez, deja una sola versión consistente | US-84 | **PASSED** | Playwright |
| CP-REG-037 | Alta | Otro usuario y anon no pueden editar ni ver el movimiento; no hay update directo | US-84 | **PASSED** | Playwright; pgTAP |
| CP-REG-038 | Media | El eliminado no suma y el editado sí, en su mes | US-84 | **PASSED** | Playwright |
| CP-REG-039 | Media | Sin scroll horizontal a 390 px, foco atrapado y devuelto, botón de al menos 44 px | US-84 | **PASSED** | Playwright |
| CP-REG-040 | Media | La función de aviso con today fijo | US-84 | **PASSED** | Vitest |
| CP-REG-041 | Alta | Una fila activa no ofrece «Eliminar definitivamente» y la RPC la rechaza | US-85 | **PASSED** | Playwright; pgTAP |
| CP-REG-042 | Alta | Eliminar y después eliminar definitivamente una compra en cuotas | US-85 | **PASSED** | Playwright |
| CP-REG-043 | Alta | Un gasto compartido se borra con su deuda vinculada | US-85 | **PASSED** | Playwright |
| CP-REG-044 | Alta | El movimiento de una suscripción no se borra definitivamente | US-85 | **PASSED** | Playwright; pgTAP |
| CP-REG-045 | Alta | Otro usuario y anon no pueden borrarlo (C7) | US-85 | **PASSED** | Playwright; pgTAP |
| CP-REG-046 | Media | Cancelar la confirmación no borra nada | US-85 | **PASSED** | Playwright |
| CP-DEU-078 | Alta | Editar una deuda suelta desde el listado y volver con los mismos filtros | US-86 | **PASSED** | Playwright |
| CP-DEU-079 | Alta | En US$ el tipo de cambio sigue congelado y la moneda es texto | US-86 | **PASSED** | Playwright |
| CP-DEU-080 | Alta | La deuda de un gasto edita persona, monto y nota con el tope del gasto | US-86 | **PASSED** | Playwright |
| CP-DEU-081 | Alta | Validaciones de la pantalla y de la RPC | US-86 | **PASSED** | Playwright |
| CP-DEU-082 | Alta | Una deuda saldada no se edita; vuelta a pendiente se edita | US-86 | **PASSED** | Playwright |
| CP-DEU-083 | Media | Si falla guardar se conserva lo escrito y reintentar guarda | US-86 | **PASSED** | Playwright |
| CP-DEU-084 | Alta | Otro usuario y anon no pueden editar la deuda ajena; la de un gasto eliminado no se edita | US-86 | **PASSED** | Playwright |
| CP-DEU-062 | Alta | Eliminar una deuda suelta «Me deben» de $20.000,00: confirmación, listado y totales | US-87 | **PASSED** | Playwright |
| CP-DEU-063 | Media | Cancelar la confirmación no borra | US-87 | **PASSED** | Playwright |
| CP-DEU-064 | Alta | Una deuda saldada no ofrece «Eliminar» hasta volver a pendiente | US-87 | **PASSED** | Playwright |
| CP-DEU-065 | Alta | La RPC rechaza una deuda saldada (23514, HTTP 400) | US-87 | **PASSED** | pgTAP |
| CP-DEU-066 | Alta | Borrar la deuda de un gasto compartido deja el gasto como gasto normal | US-87 | **PASSED** | pgTAP |
| CP-DEU-067 | Alta | La deuda de otro usuario responde 404 y no se borra; anon recibe 42501 | US-87 | **PASSED** | pgTAP |
| CP-DEU-068 | Media | Si la baja falla por la red el diálogo sigue abierto y permite reintentar | US-87 | **PASSED** | Playwright |
| CP-SUS-049 | Alta | Eliminar una activa con gastos generados: confirmación, listado y movimientos sueltos | US-88 | **PASSED** | Playwright |
| CP-SUS-050 | Media | «Volver» en la confirmación no borra | US-88 | **PASSED** | Playwright |
| CP-SUS-051 | Media | Una cancelada solo ofrece «Eliminar definitivamente» | US-88 | **PASSED** | Playwright |
| CP-SUS-052 | Media | Una pausada se borra; el diálogo avisa que deja de generar | US-88 | **PASSED** | Playwright |
| CP-SUS-053 | Alta | Tras borrar, la puesta al día no genera nada de esa suscripción ni toca los movimientos sueltos | US-88 | **PASSED** | pgTAP |
| CP-SUS-054 | Media | La baja lógica de uno de los gastos sigue después de borrar la suscripción | US-88 | **PASSED** | pgTAP |
| CP-SUS-055 | Alta | La suscripción de otro usuario responde 404 y no se borra; anon recibe 401 42501 | US-88 | **PASSED** | Playwright; pgTAP |
| CP-CFG-016 | Alta | Borrar una categoría activa sin uso y volver a usar el nombre | US-89 | **PASSED** | Playwright |
| CP-CFG-017 | Media | Borrar una categoría archivada sin uso | US-89 | **PASSED** | Playwright |
| CP-CFG-018 | Alta | Con un movimiento activo la categoría no se borra y el mensaje dice cuántos | US-89 | **PASSED** | Playwright |
| CP-CFG-019 | Alta | La misma regla directo contra la RPC (23514, HTTP 400) | US-89 | **PASSED** | pgTAP |
| CP-CFG-020 | Alta | Un movimiento dado de baja o una suscripción también cuentan como uso | US-89 | **PASSED** | pgTAP |
| CP-CFG-021 | Alta | La categoría de otro usuario responde «no encontrada» (HTTP 404) y no se borra | US-89 | **PASSED** | pgTAP |
| CP-CFG-022 | Media | Cancelar la confirmación no borra | US-89 | **PASSED** | Playwright |
| CP-CFG-023 | Alta | Archivar y reactivar una cuenta: desaparece y vuelve de Registrar | US-90 | **PASSED** | Playwright |
| CP-CFG-024 | Alta | Con una cuenta activa del mismo nombre no se reactiva y lo avisa | US-90 | **PASSED** | Playwright |
| CP-CFG-025 | Media | Los movimientos de la cuenta no cambian al archivarla y reactivarla | US-90 | **PASSED** | Playwright |
| CP-CFG-026 | Alta | Otro usuario y anon no pueden reactivar la cuenta ajena | US-90 | **PASSED** | Playwright |
| CP-DEU-073 | Alta | «Juan», «juan» y «Juán» quedan en un grupo plegable; una persona con una sola deuda, en una fila | US-91 | **PASSED** | Playwright |
| CP-DEU-074 | Alta | El neto de un grupo con ARS y US$ muestra las dos monedas, sin convertir | US-91 | **PASSED** | Playwright |
| CP-DEU-075 | Alta | Con «Saldadas» el grupo solo cuenta las saldadas; con «Pendientes» una sola ya no es grupo | US-91 | **PASSED** | Playwright |
| CP-DEU-076 | Media | Los totales y el estado vacío no cambian, y se salda desde un grupo | US-91 | **PASSED** | Playwright |
| CP-DEU-077 | Alta | La clave de persona ignora mayúsculas, tildes y espacios; no junta personas distintas | US-91 | **PASSED** | Playwright |
| CP-NAV-026 | Alta | A 390 px la barra tiene cinco destinos en orden y el encabezado no tiene engranaje | US-92 | **PASSED** | Playwright |
| CP-NAV-027 | Media | El indicador se desliza bajo el ítem activo y una ruta inexistente no muestra la barra | US-92 | **PASSED** | Playwright |
| CP-NAV-028 | Alta | Movimientos se abre desde el Resumen y la barra sigue marcando Resumen | US-92 | **PASSED** | Playwright |
| CP-NAV-029 | Alta | A 1023 px hay píldora y a 1024 px barra lateral con Ajustes al pie, sin data-testid repetidos | US-92 | **PASSED** | Playwright |
| CP-NAV-030 | Media | Un toque en el aire alrededor de la píldora no navega ni activa nada de atrás | US-92 | **PASSED** | Playwright |
| CP-NAV-031 | Media | En una ruta hija de Ajustes la barra marca Ajustes | US-92 | **PASSED** | Playwright |
| CP-NAV-032 | Media | El orden de tabulación de la barra coincide con el orden visual | US-92 | **PASSED** | Playwright |
| CP-CFG-027 | Alta | Las tarjetas de Ajustes están en el orden indicado y «Cerrar sesión» es la última, aparte | US-93 | **PASSED** | Playwright |
| CP-CFG-028 | Alta | «Categorías» abre su pantalla, la barra sigue marcando Ajustes y se vuelve con atrás | US-93 | **PASSED** | Playwright |
| CP-CFG-029 | Media | Todo elemento interactivo de Ajustes tiene un data-testid propio y sin repetir | US-93 | **PASSED** | Playwright |
| CP-CFG-030 | Media | «Volver a hacer la configuración inicial» abre /setup | US-93 | **PASSED** | Playwright |
| CP-REG-047 | Alta | El diálogo de un movimiento dice «¿Eliminar movimiento?» y muestra su detalle | US-94 | **PASSED** | Playwright |
| CP-REG-048 | Alta | Una compra en cuotas con deuda vinculada muestra las cuotas y la deuda en el detalle | US-94 | **PASSED** | Playwright |
| CP-REG-049 | Media | El botón de confirmar tiene estilo de peligro, está separado de «Cancelar» y «Cancelar» no borra, en los cuatro diálogos | US-94 | **PASSED** | Playwright |
| CP-NAV-033 | Media | El Resumen, Movimientos, Deudas y Suscripciones muestran un esqueleto y después el contenido | US-97 | **PASSED** | Playwright |
| CP-NAV-034 | Media | Cambiar de mes o de filtro no dispara transición | US-97 | **PASSED** | Playwright |
| CP-NAV-035 | Media | Cambiar de pestaña funde y entrar a un detalle o volver desplaza y funde | US-97 | **PASSED** | Playwright |
| CP-NAV-036 | Media | Con movimiento reducido no hay desplazamiento ni pulso, solo fundido | US-97 | **PASSED** | Playwright |
| CP-NAV-037 | Baja | El «atrás» del navegador no usa la dirección de la navegación anterior | US-97 | **PASSED** | Playwright |
| CP-REG-050 | Media | Las ocho categorías sembradas se leen completas, sin cortar palabras | US-98 | **PASSED** | Playwright |
| CP-REG-051 | Media | Un nombre largo ocupa como máximo dos líneas | US-98 | **PASSED** | Playwright |
| CP-REG-052 | Media | Los chips de cuenta miden al menos 48 px de alto | US-98 | **PASSED** | Playwright |
| CP-DAS-027 | Alta | El predeterminado es «Solo gastos»: el número es lo gastado y las cuatro opciones están apagadas | US-101 | **PASSED** | Playwright |
| CP-DAS-028 | Alta | Cada opción mueve el número al instante, con su signo, y la elección queda guardada | US-101 | **PASSED** | Playwright; Vitest |
| CP-DAS-029 | Media | «Solo gastos» apaga todas las opciones de un toque | US-101 | **PASSED** | Playwright |
| CP-DAS-030 | Alta | El desglose suma exactamente el número y «Fuera del número» muestra lo que moverían las opciones apagadas | US-101 | **PASSED** | Playwright; Vitest |
| CP-DAS-031 | Media | El ícono de la esquina abre la misma hoja y, en la compu, el popover nace de la pill y Escape devuelve el foco | US-101 | **PASSED** | Playwright |
| CP-DAS-032 | Media | El rótulo cambia a «Gastado neto» con una opción y el número negativo lleva el signo menos | US-101 | **PASSED** | Playwright |
| CP-CFG-040 | Alta | En Ajustes cada interruptor cambia solo el número del Resumen y la elección sobrevive al recargar | US-101 | **PASSED** | Playwright |
| CP-CFG-041 | Alta | La preferencia es de cada usuario: otro usuario no la ve ni la modifica | US-101 | **PASSED** | pgTAP |
| CP-CFG-031 | Alta | Elegir «Oscuro» cambia el tema al instante y queda al recargar | US-102 | **PASSED** | Playwright |
| CP-CFG-032 | Media | «Automático» sigue al tema del sistema | US-102 | **PASSED** | Playwright |
| CP-CFG-033 | Media | La elección no se guarda en la base y otro dispositivo conserva la suya | US-102 | **PASSED** | Playwright |
| CP-CFG-034 | Media | En los dos temas el texto cumple contraste y la tarjeta protagonista conserva su degradado | US-102 | **PASSED** | Playwright |
| CP-DAS-021 | Media | Un monto con centavos se lee igual en pantalla, con lector y en los tests | US-102 | **PASSED** | Playwright |
| CP-DAS-022 | Alta | La dona tiene una porción por categoría con monto y porcentaje y el total compacto en el hueco | US-103 | **PASSED** | Playwright |
| CP-DAS-023 | Media | «Gastado vs ingresos» muestra 6 meses con dos columnas por mes en una sola escala | US-103 | **PASSED** | Playwright |
| CP-DAS-024 | Alta | «Ritmo del mes» termina en el total de lo gastado y se corta en hoy | US-103 | **PASSED** | Playwright |
| CP-DAS-025 | Alta | «Cuotas que vienen» suma solo imputaciones de gastos no eliminados ya existentes | US-103 | **PASSED** | Playwright |
| CP-DAS-026 | Media | Si falla la lectura de las tendencias, el resto del Resumen sigue visible | US-103 | **PASSED** | Playwright |
| CP-SUS-057 | Alta | Lo cobrado más lo que falta es el total de la tarjeta | US-104 | **PASSED** | Playwright |
| CP-SUS-058 | Alta | Un día de cobro anterior a hoy figura como cobrado y uno posterior, como falta | US-104 | **PASSED** | Playwright |
| CP-SUS-059 | Media | «Por categoría» ordena de mayor a menor y los porcentajes salen del total en pesos | US-104 | **PASSED** | Playwright |
| CP-SUS-060 | Alta | Una suscripción en US$ sin tipo de cambio del mes se avisa y no entra a la barra | US-104 | **PASSED** | Playwright |
| CP-SUS-061 | Media | Sin suscripciones activas en el mes no se dibuja ninguno de los dos gráficos | US-104 | **PASSED** | Playwright |
| CP-CFG-035 | Alta | Crear una categoría con nombre, ícono y color la muestra en la lista con esa baldosa | US-105 | **PASSED** | Playwright |
| CP-CFG-036 | Media | Editar una categoría sembrada preselecciona su ícono y al guardar queda escrito | US-105 | **PASSED** | Playwright |
| CP-CFG-037 | Alta | Archivar, reactivar y eliminar desde la hoja, con confirmación al eliminar | US-105 | **PASSED** | Playwright |
| CP-CFG-038 | Alta | Postgres rechaza una clave de ícono con mayúsculas o de más de 40 caracteres | US-105 | **PASSED** | Playwright |
| CP-CFG-039 | Alta | Otro usuario no ve ni modifica las categorías ajenas | US-105 | **PASSED** | Playwright |

## Resultado por caso de la regresión

| ID | Versión | Prioridad | Título | Último resultado | Status en V3 |
|---|---|---|---|---|---|
| CP-ACC-001 | V1 | Alta | Sin sesión, la app redirige al login | PASSED (regresión en V2) | **PASSED** |
| CP-ACC-002 | V1 | Alta | Una ruta privada abierta sin sesión conserva el destino | PASSED (regresión en V2) | **PASSED** |
| CP-ACC-003 | V1 | Alta | Crear una cuenta con email y contraseña válidos | PASSED (regresión en V2) | **PASSED** |
| CP-ACC-004 | V1 | Alta | Contraseñas que no cumplen los criterios se rechazan | PASSED (regresión en V2) | **PASSED** |
| CP-ACC-005 | V1 | Alta | No se puede crear una cuenta con un email ya registrado | PASSED (regresión en V2) | **PASSED** |
| CP-ACC-008 | V1 | Alta | Una cuenta nueva tiene el catálogo inicial sembrado | PASSED (regresión en V2) | **PASSED** |
| CP-ACC-009 | V1 | Alta | Cerrar sesión y no poder volver con "atrás" | PASSED (regresión en V2) | **PASSED** |
| CP-ACC-011 | V1 | Alta | Aislamiento entre usuarios en todas las tablas (par de autorización) | PASSED (regresión en V2) | **PASSED** |
| CP-ACC-012 | V1 | Alta | Contraseña y confirmación distintas bloquean el alta | PASSED (regresión en V2) | **PASSED** |
| CP-CFG-001 | V1 | Alta | Crear una categoría con nombre y color | PASSED (regresión en V2) | **PASSED** |
| CP-CFG-004 | V1 | Alta | Archivar una categoría con historia | PASSED (regresión en V2) | **PASSED** |
| CP-CFG-006 | V1 | Alta | Crear una cuenta de tarjeta de crédito | PASSED (regresión en V2) | **PASSED** |
| CP-CFG-008 | V1 | Alta | La siembra concurrente no duplica el catálogo | PASSED (regresión en V2) | **PASSED** |
| CP-CFG-009 | V1 | Alta | Cargar y actualizar el tipo de cambio de referencia del mes | PASSED (regresión en V2) | **PASSED** |
| CP-CFG-011 | V1 | Alta | Después de crear la cuenta aparece la configuración inicial | PASSED (regresión en V2) | **PASSED** |
| CP-REG-001 | V1 | Alta | El registro es la pantalla de inicio | PASSED (regresión en V2) | **PASSED** |
| CP-REG-010 | V1 | Alta | Monto vacío, cero o negativo no se guarda | PASSED (regresión en V2) | **PASSED** |
| CP-REG-012 | V1 | Alta | Eliminar una transacción la saca del total del mes | PASSED (regresión en V2) | **PASSED** |
| CP-REG-013 | V1 | Alta | Eliminar una compra con cuotas en meses cerrados avisa y es retroactivo | PASSED (regresión en V2) | **PASSED** |
| CP-REG-014 | V1 | Alta | Otro usuario no puede leer ni borrar una transacción ajena | PASSED (regresión en V2) | **PASSED** |
| CP-REG-015 | V1 | Alta | No se puede escribir en transactions salteando la RPC | PASSED (regresión en V2) | **PASSED** |
| CP-CUO-001 | V1 | Alta | Compra en 12 cuotas genera 12 imputaciones consecutivas | PASSED (regresión en V2) | **PASSED** |
| CP-CUO-002 | V1 | Alta | Previsualización del impacto mensual antes de guardar | PASSED (regresión en V2) | **PASSED** |
| CP-CUO-003 | V1 | Alta | Cambiar a una cuenta que no es crédito resetea las cuotas | PASSED (regresión en V2) | **PASSED** |
| CP-CUO-004 | V1 | Alta | División exacta: 12 cuotas iguales | PASSED (regresión en V2) | **PASSED** |
| CP-CUO-005 | V1 | Alta | El resto lo absorbe la última cuota | PASSED (regresión en V2) | **PASSED** |
| CP-CUO-006 | V1 | Alta | Cantidad de cuotas: 0, 1, 2, 12 y 13 | PASSED (regresión en V2) | **PASSED** |
| CP-CUO-009 | V1 | Alta | Borrar una compra en cuotas saca todas sus cuotas | PASSED (regresión en V2) | **PASSED** |
| CP-CUO-011 | V1 | Alta | Otro usuario no ve las cuotas de una compra ajena | PASSED (regresión en V2) | **PASSED** |
| CP-CUO-012 | V1 | Alta | Un ingreso no admite cuotas aunque la cuenta sea crédito | PASSED (regresión en V2) | **PASSED** |
| CP-CUO-013 | V1 | Alta | Un fallo a mitad de create_transaction no deja datos parciales | PASSED (regresión en V2) | **PASSED** |
| CP-MON-001 | V1 | Alta | Gasto en USD con el tipo de cambio sugerido | PASSED (regresión en V2) | **PASSED** |
| CP-MON-002 | V1 | Alta | Tabla de decisión de moneda y tipo de cambio (6 filas) | PASSED (regresión en V2) | **PASSED** |
| CP-MON-004 | V1 | Alta | Cambiar la referencia no altera lo ya guardado | PASSED (regresión en V2) | **PASSED** |
| CP-MON-005 | V1 | Alta | El total del mes en pesos incluye lo gastado en dólares | PASSED (regresión en V2) | **PASSED** |
| CP-MON-007 | V1 | Alta | Otro usuario no lee ni modifica el tipo de cambio ajeno | PASSED (regresión en V2) | **PASSED** |
| CP-DAS-001 | V1 | Alta | El Resumen abre en el mes actual con su total | PASSED (regresión en V2) | **PASSED** |
| CP-DAS-002 | V1 | Alta | El mes elegido vive en la URL | PASSED (regresión en V2) | **PASSED** |
| CP-DAS-011 | V1 | Alta | El Resumen de un usuario nunca muestra datos de otro | PASSED (regresión en V2) | **PASSED** |
| CP-DEU-001 | V2 | Alta | El interruptor «Gasto compartido» se enciende y se apaga, y el gasto se guarda sin deuda | PASSED | **PASSED** |
| CP-DEU-002 | V2 | Alta | Gasto compartido de $120.000,00 en 12 cuotas: se guarda el gasto y la deuda vinculada de Sofía | DUDA | **PASSED** |
| CP-DEU-003 | V2 | Alta | Gasto compartido en dólares (US$100 a tipo de cambio 1250): avisa en dólares y congela el tipo de cambio | PASSED | **PASSED** |
| CP-DEU-005 | V2 | Alta | No se puede compartir un gasto si falta cuánto te deben | PASSED | **PASSED** |
| CP-DEU-006 | V2 | Alta | No se puede compartir un gasto si falta con quién | PASSED | **PASSED** |
| CP-DEU-007 | V2 | Alta | Un ingreso no se puede compartir | PASSED | **PASSED** |
| CP-DEU-008 | V2 | Alta | El nombre hecho solo de espacios no cuenta como nombre | PASSED | **PASSED** |
| CP-DEU-010 | V2 | Alta | No se puede deber 0 pesos | PASSED | **PASSED** |
| CP-DEU-011 | V2 | Alta | Una deuda igual al gasto se acepta: «Tu parte» queda en $0,00 | PASSED | **PASSED** |
| CP-DEU-012 | V2 | Alta | Una deuda un centavo mayor que el gasto no se puede guardar | PASSED | **PASSED** |
| CP-DEU-013 | V2 | Alta | Por API, una deuda mayor que el gasto se rechaza y no se guarda nada | BLOCKED | **PASSED** |
| CP-DEU-015 | V2 | Alta | Eliminar el gasto vinculado oculta la deuda de /debts, deja de sumarla en "Te deben" y en el neto del Resumen, y conserva intacta su fila en debts | PASSED | **PASSED** |
| CP-DEU-016 | V2 | Alta | Al restaurar desde Movimientos → Eliminados un gasto cuya deuda vinculada estaba saldada, la deuda vuelve a /debts con estado saldada y la misma fecha settled_at | PASSED | **PASSED** |
| CP-DEU-017 | V2 | Alta | Estado inicial de /debts/new y guardado de una deuda "Me deben" en ARS por $20.000,00 crea una fila pendiente con transaction_id = null en una sola llamada a create_debt | PASSED | **PASSED** |
| CP-DEU-018 | V2 | Alta | Guardar una deuda suelta con dirección "Debo" en ARS crea direction = "i_owe" y en la lista muestra "Le debés" | no ejecutado | **PASSED** |
| CP-DEU-019 | V2 | Alta | En /debts/new, elegir "US$" con TC de referencia de 1250 precompleta "1.250,00", muestra "≈ $50.000,00" para US$40 y guarda fx_rate = 1250.0000 y amount_ars = 50000.00 | PASSED | **PASSED** |
| CP-DEU-022 | V2 | Alta | En /debts/new, un "Monto" igual a 0 muestra "El monto debe ser mayor a cero" | no ejecutado | **PASSED** |
| CP-DEU-024 | V2 | Alta | En /debts/new con US$, Monto = 0,01 y TC = 0,5 se acepta (redondeo half-up a $0,01) y guarda amount_ars = "0.01" | FAILED · DEF-037 | **PASSED** |
| CP-DEU-025 | V2 | Alta | En «Nueva deuda» con US$, un tipo de cambio de 0 muestra «El tipo de cambio debe ser mayor a cero» | FAILED · DEF-037 | **PASSED** |
| CP-DEU-026 | V2 | Alta | En /debts/new, una fecha posterior a hoy (<MAÑANA>) muestra "La fecha no puede ser futura" y deshabilita "Guardar deuda" | PASSED | **PASSED** |
| CP-DEU-027 | V2 | Alta | Directo contra create_debt, p_person = "" se rechaza con "Ingresá el nombre de la persona" | PASSED | **PASSED** |
| CP-DEU-029 | V2 | Alta | Directo contra create_debt, p_amount = 0 se rechaza con "I4: el monto debe ser mayor a cero" | PASSED | **PASSED** |
| CP-DEU-031 | V2 | Alta | Directo contra create_debt, p_currency = "USD" con p_fx_rate = null se rechaza con "I5: fx_rate es obligatorio si y solo si la moneda es USD" | PASSED | **PASSED** |
| CP-DEU-033 | V2 | Alta | Directo contra create_debt, p_incurred_on = "<MAÑANA>" se rechaza con "La fecha no puede ser posterior a hoy" | PASSED | **PASSED** |
| CP-DEU-034 | V2 | Alta | Directo contra create_debt con el rol anon (sin Authorization) responde 42501 (permission denied) | PASSED | **PASSED** |
| CP-DEU-035 | V2 | Alta | Un POST /rest/v1/debts directo con sesión autenticada responde 42501 (permission denied) y no crea filas | PASSED | **PASSED** |
| CP-DEU-036 | V2 | Alta | La tarjeta de totales suma las deudas pendientes en pesos (incluyendo USD al TC congelado), excluye las saldadas y no cambia al cambiar el filtro de estado | no ejecutado | **PASSED** |
| CP-DEU-037 | V2 | Alta | Cuando "Debés" supera a "Te deben", el neto muestra "En contra $5.000,00" | no ejecutado | **PASSED** |
| CP-DEU-038 | V2 | Alta | Cambiar el TC de referencia del mes a 1400 no modifica "Te deben" de una deuda en USD ya creada a TC 1250 (C5) | no ejecutado | **PASSED** |
| CP-DEU-039 | V2 | Alta | /debts sin parámetros muestra "Pendientes" seleccionado y solo pendientes; tocar "Saldadas" y "Todas" actualiza ?status= y filtra la lista | no ejecutado | **PASSED** |
| CP-DEU-043 | V2 | Alta | Otro usuario no ve las deudas de alguien más | PASSED | **PASSED** |
| CP-DEU-044 | V2 | Alta | Por API, otro usuario no recibe las deudas de alguien más | PASSED | **PASSED** |
| CP-DEU-045 | V2 | Alta | Por API, sin sesión no se pueden leer las deudas | PASSED | **PASSED** |
| CP-DEU-046 | V2 | Alta | Marcar una deuda como saldada desde «Pendientes» | PASSED | **PASSED** |
| CP-DEU-047 | V2 | Alta | «Deshacer» devuelve la deuda a pendiente | PASSED | **PASSED** |
| CP-DEU-049 | V2 | Alta | Por API, saldar una deuda ya saldada se rechaza | PASSED | **PASSED** |
| CP-DEU-050 | V2 | Alta | Por API, un usuario no puede saldar la deuda de otro | PASSED | **PASSED** |
| CP-DEU-051 | V2 | Alta | Por API, no se puede modificar una deuda directamente | PASSED | **PASSED** |
| CP-DEU-052 | V2 | Alta | «Volver a pendiente» desde «Saldadas» | PASSED | **PASSED** |
| CP-DEU-054 | V2 | Alta | Filtro por dirección: «Todas», «Te deben» y «Debés» | PASSED | **PASSED** |
| CP-DEU-055 | V2 | Alta | Gasto compartido con varias personas: agregar, quitar y guardar | BLOCKED | **PASSED** |
| CP-DEU-056 | V2 | Alta | Se puede compartir con hasta 10 personas | BLOCKED | **PASSED** |
| CP-DEU-057 | V2 | Alta | Por API, deudas que suman más que el gasto se rechazan | BLOCKED | **PASSED** |
| CP-DEU-058 | V2 | Alta | Resumen: gasto bruto y neto de reembolsos | PASSED | **PASSED** |
| CP-DEU-059 | V2 | Alta | Resumen: el neto no cambia al saldar la deuda | PASSED | **PASSED** |
| CP-DEU-060 | V2 | Alta | Resumen: una deuda suelta «Me deben» no cambia el neto | PASSED | **PASSED** |
| CP-DEU-061 | V2 | Alta | Resumen: el neto en dólares no cambia si cambia el tipo de cambio | PASSED | **PASSED** |
| CP-NAV-010 | V2 | Alta | Tocar «Registrar» estando en Registrar no pierde lo cargado | PASSED | **PASSED** |
| CP-NAV-012 | V2 | Alta | Sin internet el gasto no se pierde y aparece «Reintentar» | PASSED | **PASSED** |
| CP-NAV-013 | V2 | Alta | Reintentar al volver internet guarda una sola vez | PASSED | **PASSED** |
| CP-NAV-014 | V2 | Alta | Con internet muy lenta, a los 15 segundos avisa que falló | PASSED | **PASSED** |
| CP-NAV-015 | V2 | Alta | Reintentar no duplica un gasto que ya se había guardado | PASSED | **PASSED** |
| CP-NAV-016 | V2 | Alta | La misma clave dos veces seguidas devuelve el mismo gasto | PASSED | **PASSED** |
| CP-NAV-017 | V2 | Alta | Dos pedidos simultáneos con la misma clave crean un solo gasto | PASSED | **PASSED** |
| CP-NAV-018 | V2 | Alta | La misma clave en dos usuarios distintos no se pisa | PASSED | **PASSED** |
| CP-NAV-019 | V2 | Alta | Si se archiva la categoría antes de guardar, el gasto se rechaza con aviso | PASSED | **PASSED** |
| CP-NAV-020 | V2 | Alta | La API rechaza un gasto con una categoría archivada | PASSED | **PASSED** |
| CP-NAV-021 | V2 | Alta | Al volver a Registrar aparece el gasto pendiente | PASSED | **PASSED** |
| CP-NAV-022 | V2 | Alta | Recuperar un gasto que en realidad ya estaba guardado | PASSED | **PASSED** |
| CP-NAV-023 | V2 | Alta | Descartar borra el pendiente, incluso al recargar | PASSED | **PASSED** |
| CP-NAV-024 | V2 | Alta | Cerrar sesión borra los pendientes | PASSED | **PASSED** |
| CP-NAV-025 | V2 | Alta | Tocar dos veces «Guardar» guarda una sola vez | PASSED | **PASSED** |
| CP-EXP-002 | V2 | Alta | El mes siguiente está bloqueado | PASSED | **PASSED** |
| CP-EXP-003 | V2 | Alta | El alcance mensual propone el nombre 2026-09 | PASSED | **PASSED** |
| CP-EXP-004 | V2 | Alta | El primer día del mes se incluye | PASSED | **PASSED** |
| CP-EXP-005 | V2 | Alta | El día posterior al mes se excluye | PASSED | **PASSED** |
| CP-EXP-006 | V2 | Alta | El 1 de enero se incluye en el año | PASSED | **PASSED** |
| CP-EXP-007 | V2 | Alta | El día posterior al año se excluye | PASSED | **PASSED** |
| CP-EXP-008 | V2 | Alta | Una transacción eliminada queda fuera | PASSED | **PASSED** |
| CP-EXP-009 | V2 | Alta | El archivo comienza con BOM UTF-8 | PASSED | **PASSED** |
| CP-EXP-010 | V2 | Alta | El encabezado tiene doce columnas exactas | PASSED | **PASSED** |
| CP-EXP-011 | V2 | Alta | Doce cuotas salen en una sola fila por el total | PASSED | **PASSED** |
| CP-EXP-012 | V2 | Alta | ARS se escribe con dos decimales exactos | PASSED | **PASSED** |
| CP-EXP-013 | V2 | Alta | USD conserva cuatro decimales de TC | PASSED | **PASSED** |
| CP-EXP-014 | V2 | Alta | Una coma obliga a entrecomillar la descripción | PASSED | **PASSED** |
| CP-EXP-015 | V2 | Alta | Las comillas internas se duplican | PASSED | **PASSED** |
| CP-EXP-016 | V2 | Alta | Descripción con igual se neutraliza | PASSED | **PASSED** |
| CP-EXP-017 | V2 | Alta | Una categoría que empieza con igual se neutraliza | PASSED | **PASSED** |
| CP-EXP-018 | V2 | Alta | 1.500 transacciones se exportan sin faltantes | PASSED | **PASSED** |
| CP-EXP-019 | V2 | Alta | El CSV de A no contiene movimientos de B | PASSED | **PASSED** |
| CP-EXP-020 | V2 | Alta | La API con token de A devuelve cero filas de B | PASSED | **PASSED** |
| CP-EXP-023 | V2 | Alta | Un doble click inicia una sola descarga | PASSED | **PASSED** |
| CP-EXP-025 | V2 | Alta | Offline muestra el error exacto | PASSED | **PASSED** |
| CP-EXP-026 | V2 | Alta | El reintento después de Offline descarga completo | PASSED | **PASSED** |
| CP-EXP-027 | V2 | Baja | Tocar fuera cierra sin descargar | FAILED · DEF-030 | **PASSED** |
| CP-EXP-028 | V2 | Media | Atrás cierra la hoja inicial | FAILED · DEF-031 | **PASSED** |
| CP-EXP-029 | V2 | Alta | Atrás durante Exportando cancela la descarga | FAILED · DEF-032 | **PASSED** |
| CP-EXP-030 | V2 | Alta | Una alta concurrente impide descargar un año incompleto | PASSED | **PASSED** |
| CP-EXP-031 | V2 | Alta | HTTP 500 muestra Error y no descarga | PASSED | **PASSED** |
| CP-IMP-014 | V2 | Alta | F8: monto cero | PASSED | **PASSED** |
| CP-IMP-024 | V2 | Media | Nombres, tipo y moneda aceptan espacios y mayúsculas | FAILED · DEF-033 | **PASSED** |
| CP-IMP-027 | V2 | Alta | El resumen del archivo de ejemplo suma solo las siete filas listas | PASSED | **PASSED** |
| CP-IMP-030 | V2 | Alta | Confirmar importa solo las filas listas con todos sus campos | PASSED | **PASSED** |
| CP-IMP-031 | V2 | Alta | La compra de 240.000 en seis cuotas crea seis imputaciones exactas | PASSED | **PASSED** |
| CP-IMP-032 | V2 | Alta | Un rechazo tardío de categoría no impide las otras filas | PASSED | **PASSED** |
| CP-IMP-033 | V2 | Alta | Quinientas filas de doce cuotas terminan en menos de diez segundos | PASSED | **PASSED** |
| CP-IMP-034 | V2 | Alta | La RPC procesa una válida y rechaza tres inválidas | PASSED | **PASSED** |
| CP-IMP-035 | V2 | Alta | La RPC rechaza un lote de 501 elementos | PASSED | **PASSED** |
| CP-IMP-036 | V2 | Alta | El rol anon no puede ejecutar import_transactions | PASSED | **PASSED** |
| CP-IMP-037 | V2 | Alta | Otro usuario no ve transacciones ni imports ajenos | PASSED | **PASSED** |
| CP-IMP-038 | V2 | Alta | Reintento tras respuesta perdida reconoce lo guardado | PASSED | **PASSED** |
| CP-IMP-039 | V2 | Alta | Dos llamadas API con el mismo import_id son idempotentes | PASSED | **PASSED** |
| CP-IMP-040 | V2 | Alta | Sin respuesta conserva Revisión | PASSED | **PASSED** |
| CP-IMP-041 | V2 | Alta | Sesión vencida ofrece volver a entrar | PASSED | **PASSED** |
| CP-SUS-001 | V2 | Alta | Dar de alta una suscripción en ARS desde hace 2 meses con día de cobro 10 genera los 2 gastos vencidos al guardar | PASSED | **PASSED** |
| CP-SUS-006 | V2 | Alta | Rechazar en UI el alta de suscripción con Nombre igual al de otra activa sin distinguir mayúsculas ni espacios (" netflix ") | PASSED | **PASSED** |
| CP-SUS-007 | V2 | Alta | Rechazar en API create_subscription con Nombre igual al de otra activa (" netflix ") | PASSED | **PASSED** |
| CP-SUS-008 | V2 | Alta | Rechazar en UI el alta de suscripción con Monto igual a "0" | PASSED | **PASSED** |
| CP-SUS-009 | V2 | Alta | Rechazar en API create_subscription con p_amount = "0.00" | PASSED | **PASSED** |
| CP-SUS-017 | V2 | Alta | Rechazar en API create_subscription usando p_category_id de otro usuario | PASSED | **PASSED** |
| CP-SUS-018 | V2 | Alta | Rechazar en API un INSERT directo sobre /rest/v1/subscriptions con la sesión del usuario | PASSED | **PASSED** |
| CP-SUS-020 | V2 | Alta | Rechazar en UI ver el detalle de una suscripción de otro usuario mostrando subscription-detail-not-found | PASSED | **PASSED** |
| CP-SUS-021 | V2 | Alta | Rechazar en API leer una suscripción de otro usuario (GET /rest/v1/subscriptions devuelve []) | PASSED | **PASSED** |
| CP-SUS-022 | V2 | Alta | Rechazar en API create_subscription sin sesión autenticada (rol anon) | FAILED · DEF-035 | **PASSED** |
| CP-SUS-024 | V2 | Alta | Puesta al día automática al entrar a la app genera 2 períodos vencidos pendientes y muestra el aviso app-catchup-generated | PASSED | **PASSED** |
| CP-SUS-025 | V2 | Alta | Dos llamadas consecutivas por API a run_subscription_catchup responden 200 OK sin error y dejan exactamente 1 transacción por período | PASSED | **PASSED** |
| CP-SUS-026 | V2 | Alta | Suscripción en estado paused no genera ocurrencias al ejecutar run_subscription_catchup | PASSED | **PASSED** |
| CP-SUS-027 | V2 | Alta | Suscripción con día de cobro 31 entre 2026-01 y 2026-04 genera ocurrencias con fechas 31/01/2026, 28/02/2026, 31/03/2026 y 30/04/2026 | PASSED | **PASSED** |
| CP-SUS-028 | V2 | Alta | Suscripción con día de cobro <DIA_MAÑANA> no genera la ocurrencia del mes corriente | PASSED | **PASSED** |
| CP-SUS-029 | V2 | Alta | Suscripción con día de cobro igual a <DIA_HOY> genera la ocurrencia del mes corriente | PASSED | **PASSED** |
| CP-SUS-030 | V2 | Alta | Pausar suscripción activa con día de cobro 28 (> <DIA_HOY>) muestra advertencia de este mes y pasa a "Pausada desde <HOY>" con piso en <MES_SIGUIENTE> | PASSED | **PASSED** |
| CP-SUS-031 | V2 | Alta | pause_subscription por API ejecuta primero la puesta al día y genera los meses vencidos pendientes antes de pausar | PASSED | **PASSED** |
| CP-SUS-032 | V2 | Alta | Rechazar en API pause_subscription usando la sesión de otro usuario (404 P0002) | FAILED · DEF-034 | **PASSED** |
| CP-SUS-033 | V2 | Alta | Reanudar suscripción pausada abre resume-subscription-dialog, pasa a "Activa", limpia paused_at, conserva generate_from_period = '<MES_SIGUIENTE>-01' y no genera el mes actual | PASSED | **PASSED** |
| CP-SUS-034 | V2 | Alta | Cancelar suscripción activa con 4 gastos cargados mantiene el historial en el Detalle y en el Resumen y oculta los botones de acción | PASSED | **PASSED** |
| CP-SUS-035 | V2 | Alta | Editar el monto de una suscripción activa de $5.000,00 a $7.000,00 conserva las 4 ocurrencias ya generadas en $5.000,00 y muestra Moneda y Mes de inicio como solo lectura | PASSED | **PASSED** |
| CP-SUS-037 | V2 | Alta | Rechazar en UI renombrar una suscripción poniéndole el nombre de otra suscripción activa del mismo usuario | PASSED | **PASSED** |
| CP-SUS-040 | V2 | Alta | Eliminar desde Movimientos la ocurrencia de <MES_ANTERIOR> muestra delete-transaction-subscription-note, figura con "Eliminado" en el Detalle y no vuelve a crearse al recargar | PASSED | **PASSED** |
| CP-SUS-041 | V2 | Alta | Mostrar la marca de suscripción en Movimientos y en "Últimos movimientos" del Resumen (y no en un gasto manual) y navegar al Detalle al tocarla | PASSED | **PASSED** |
| CP-SUS-042 | V2 | Alta | La ocurrencia generada de una suscripción suma en "Gastado en <mes corto>" y resta en "Balance" del Resumen de V1 | PASSED | **PASSED** |
| CP-SUS-043 | V2 | Alta | Suscripción activa en USD con tipo de cambio en <MES_HACE_2> y sin tipo de cambio en <MES_ANTERIOR> genera solo <MES_HACE_2>, muestra "Falta tipo de cambio" y el botón "Cargar tipo de cambio" navega a /settings?period=<MES_ANTERIOR> | PASSED | **PASSED** |
| CP-SUS-044 | V2 | Alta | Con dos suscripciones activas en ARS ($5.000,00 y $2.500,00), el total mensual comprometido muestra "$7.500,00" y "2 suscripciones activas este mes" | PASSED | **PASSED** |
| CP-SUS-045 | V2 | Alta | Suscripción activa en USD 10,00 con tipo de cambio del período corriente 1.250,00 suma "$12.500,00" al total mensual comprometido | PASSED | **PASSED** |
| CP-SUS-047 | V2 | Alta | Vista previa en /subscriptions/new con $5.000,00 ARS, día 28 (> <DIA_HOY>), desde <MES_HACE_2> y sin fin muestra 2 meses en "Se cargan al guardar", 3 en "Próximos cobros", resumen de "$10.000,00" y al guardar crea exactamente esas 2 transacciones | PASSED | **PASSED** |
| CP-SUS-048 | V2 | Alta | Vista previa en /subscriptions/new en USD con tipo de cambio en <MES_HACE_2> y sin tipo de cambio en <MES_ANTERIOR> marca <MES_ANTERIOR> con data-blocked="true" y no lo cuenta en el resumen | FAILED · DEF-036 | **PASSED** |
| CP-CAT-001 | V2 | Alta | La torta muestra una porción por categoría, con su monto y su porcentaje | PASSED | **PASSED** |
| CP-CAT-002 | V2 | Alta | Los ingresos y los gastos eliminados no entran en la torta | PASSED | **PASSED** |
| CP-CAT-004 | V2 | Alta | Tocar una categoría del Resumen abre su detalle del mes | PASSED | **PASSED** |
