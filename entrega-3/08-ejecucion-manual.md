# Entrega 3 · Ejecución manual de los casos de prueba (V3) y de la regresión de V1 y V2

Planilla: [`08-ejecucion-manual.xlsx`](08-ejecucion-manual.xlsx) (índice con el resultado manual y el automatizado de cada caso, y un resumen por módulo). Se genera con `python entrega-3/fuentes/generar_ejecucion_manual.py` a partir de [`04-ejecucion.md`](04-ejecucion.md). La ejecución automatizada está en [`04-ejecucion.md`](04-ejecucion.md) y [`05-reporte-ejecucion-automatizada.md`](05-reporte-ejecucion-automatizada.md); el resumen final, en [`07-reporte-final.md`](07-reporte-final.md).

## Condiciones de la ejecución

- **Fechas:** 2026-11-14, 2026-11-15 y 2026-11-16.
- **Entorno:** deploy de Vercel (https://biyu-rust.vercel.app), a mano, en el navegador.
- **Quién ejecutó:** el equipo, a mano. Es la ejecución manual que pide la Entrega 3 para los casos de V3, la regresión de V1 y V2 y el testeo de confirmación de los defectos.
- **Alcance:** los 361 casos: los 184 casos nuevos de V3 (`entrega-3/casos/`) y los 177 de regresión ([`03-seleccion-regresion.md`](03-seleccion-regresion.md)). Los casos que confirman los defectos de V2 (DEF-030 a DEF-037) y el DEF-023 de V1 están dentro de ese conjunto.
- **Criterio:** PASSED si el resultado obtenido coincide con el esperado del caso; FAILED si no coincide (se abre un defecto `DEF-0nn`); BLOCKED si no se puede ejecutar.
- **Versión probada:** la que estaba desplegada en Vercel esos días. Durante ese período se mergearon a `main` los PR [#422](https://github.com/Joaconz/Biyu/pull/422) a [#428](https://github.com/Joaconz/Biyu/pull/428), y **no se anotó el commit exacto desplegado en cada pasada**; el dato no se puede reconstruir desde el repositorio.
- **Qué registra esta planilla:** el resultado por caso **informado por el equipo**. El repositorio no guarda los pasos ejecutados, las capturas ni quién ejecutó cada caso, así que no hay evidencia por caso más allá de este informe. Es la misma situación del repaso manual de la Entrega 2 (casos «informados como ok»).
- **Cómo se compara con la suite automatizada:** la columna «Resultado automatizado» sale de `04-ejecucion.md` (corrida de 290 tests de Playwright, 1131 de Vitest y pgTAP sobre `main` en `40ab30e`). Un caso coincide si manual y automatizado dan el mismo estado.

## Resultado

| Conjunto | Casos | PASSED | FAILED | BLOCKED | % PASSED |
|---|---|---|---|---|---|
| Casos nuevos de V3 | 184 | 184 | 0 | 0 | 100,0 % |
| Regresión de V1 y V2 | 177 | 177 | 0 | 0 | 100,0 % |
| **Total** | 361 | 361 | 0 | 0 | 100,0 % |

**Manual y automatizado coinciden en 361 de 361 casos.** No hay ningún caso FAILED ni BLOCKED en la ejecución manual, por lo que no se abrió ningún defecto nuevo.

### Por módulo

| Módulo | Casos nuevos de V3 | Regresión | Total | PASSED | FAILED | BLOCKED |
|---|---|---|---|---|---|---|
| ACC | 4 | 9 | 13 | 13 | 0 | 0 |
| CAT | 0 | 3 | 3 | 3 | 0 | 0 |
| CFG | 26 | 6 | 32 | 32 | 0 | 0 |
| CUO | 0 | 10 | 10 | 10 | 0 | 0 |
| DAS | 21 | 3 | 24 | 24 | 0 | 0 |
| DEU | 37 | 47 | 84 | 84 | 0 | 0 |
| EXP | 0 | 27 | 27 | 27 | 0 | 0 |
| IMP | 17 | 15 | 32 | 32 | 0 | 0 |
| MON | 0 | 5 | 5 | 5 | 0 | 0 |
| NAV | 16 | 15 | 31 | 31 | 0 | 0 |
| REG | 41 | 6 | 47 | 47 | 0 | 0 |
| SUS | 22 | 31 | 53 | 53 | 0 | 0 |

## Casos que no están en PASSED

Ninguno: los 361 casos dieron PASSED en la ejecución manual.

## Testeo de confirmación de los defectos

Los casos que reproducen cada defecto corregido se ejecutaron a mano dentro de los 361 y dieron PASSED. El detalle de qué se confirma y con qué arreglo está en la sección «Confirmación de defectos» de [`04-ejecucion.md`](04-ejecucion.md); el resultado manual de cada caso, en la tabla de abajo.

| Defecto | Caso | Resultado manual |
|---|---|---|
| DEF-030 | CP-EXP-027 | **PASSED** |
| DEF-031 | CP-EXP-028 | **PASSED** |
| DEF-032 | CP-EXP-029 | **PASSED** |
| DEF-033 | CP-IMP-024 | **PASSED** |
| DEF-034 | CP-SUS-032 | **PASSED** |
| DEF-035 | CP-SUS-022 | **PASSED** |
| DEF-036 | CP-SUS-048 | **PASSED** |
| DEF-037 | CP-DEU-024 | **PASSED** |
| DEF-037 | CP-DEU-025 | **PASSED** |

DEF-023 (V1, intermitente) no tiene un caso propio: lo cubren los casos del alta y la configuración inicial (CP-ACC-013 a 016), que están entre los casos nuevos de V3 y dieron PASSED.

## Resultado por caso

| ID | Origen | Prioridad | Título | Manual | Automatizado | ¿Coincide? |
|---|---|---|---|---|---|---|
| CP-SUS-062 | V3 | Alta | Una suscripción activa que todavía no cobró aparece como por cobrar con su total y su cuenta de cobros | **PASSED** | PASSED | Sí |
| CP-SUS-063 | V3 | Alta | Las pausadas y las canceladas no cuentan como por cobrar | **PASSED** | PASSED | Sí |
| CP-SUS-064 | V3 | Media | Una suscripción en US$ sin tipo de cambio del mes se informa aparte y no entra al total | **PASSED** | PASSED | Sí |
| CP-SUS-065 | V3 | Media | Si no se pueden leer las suscripciones, el Resumen se ve igual y sin la tarjeta | **PASSED** | PASSED | Sí |
| CP-SUS-066 | V3 | Alta | En el mes en curso solo cuenta lo que su día de cobro todavía no llegó, y un mes pasado no tiene nada | **PASSED** | PASSED | Sí |
| CP-SUS-067 | V3 | Media | La X cierra la franja y no vuelve al cambiar de pantalla ni al recargar | **PASSED** | PASSED | Sí |
| CP-SUS-068 | V3 | Media | «Reintentar» llama de nuevo y, si anda, la franja desaparece | **PASSED** | PASSED | Sí |
| CP-ACC-013 | V3 | Alta | Una cuenta nueva ve el setup, lo saltea y queda adentro de la app aunque recargue | **PASSED** | PASSED | Sí |
| CP-ACC-014 | V3 | Alta | Completar el setup con el primer gasto lleva a la app y al volver a iniciar sesión no reaparece | **PASSED** | PASSED | Sí |
| CP-ACC-015 | V3 | Alta | Si guardar o leer el estado del setup falla, igual se entra a la app | **PASSED** | PASSED | Sí |
| CP-ACC-016 | V3 | Media | Una cuenta anterior a US-68, sin fila de setup, entra directo a la app | **PASSED** | PASSED | Sí |
| CP-IMP-042 | V3 | Media | La plantilla y la hoja «Instrucciones» traen «Cuotas pendientes» | **PASSED** | PASSED | Sí |
| CP-IMP-043 | V3 | Alta | Una compra de 6 cuotas con 3 pendientes se imputa desde este mes y se ve en Movimientos | **PASSED** | PASSED | Sí |
| CP-IMP-044 | V3 | Alta | Con resto, con todas pendientes y sin la columna | **PASSED** | PASSED | Sí |
| CP-IMP-045 | V3 | Alta | «Cuotas pendientes» solo va en una compra en cuotas y entre 1 y N | **PASSED** | PASSED | Sí |
| CP-IMP-046 | V3 | Alta | Con esa fecha todavía no puede haber tantas cuotas pagadas | **PASSED** | PASSED | Sí |
| CP-IMP-047 | V3 | Media | Un error anterior de la fila oculta los de «Cuotas pendientes» | **PASSED** | PASSED | Sí |
| CP-IMP-048 | V3 | Alta | En US$, con y sin resto en pesos | **PASSED** | PASSED | Sí |
| CP-IMP-049 | V3 | Media | La cuota de este mes entra en «Cuotas de meses anteriores» del Resumen | **PASSED** | PASSED | Sí |
| CP-IMP-050 | V3 | Media | El diálogo de borrado muestra las imputaciones guardadas, no un calendario recalculado | **PASSED** | PASSED | Sí |
| CP-IMP-051 | V3 | Alta | create_transaction rechaza cuotas pagadas inválidas | **PASSED** | PASSED | Sí |
| CP-IMP-052 | V3 | Media | import_transactions rechaza solo la fila inválida; anon no puede | **PASSED** | PASSED | Sí |
| CP-IMP-053 | V3 | Media | La guía nace cerrada, no está en el paso 3 y se deshabilita al importar | **PASSED** | PASSED | Sí |
| CP-IMP-054 | V3 | Alta | Al abrirla muestra el título, el texto, los seis pasos, la tabla de ejemplo y el pie exactos | **PASSED** | PASSED | Sí |
| CP-IMP-055 | V3 | Alta | Se cierra por cuatro vías, el foco vuelve y Tab no sale del diálogo | **PASSED** | PASSED | Sí |
| CP-IMP-056 | V3 | Media | «Descargar plantilla» del diálogo baja el mismo archivo que el del paso 1 | **PASSED** | PASSED | Sí |
| CP-IMP-057 | V3 | Media | Se puede ignorar y abrirla no cambia el archivo, el resumen, el filtro ni la URL | **PASSED** | PASSED | Sí |
| CP-IMP-058 | V3 | Media | En 390 px entra con 16 px de margen y la tabla scrollea por dentro | **PASSED** | PASSED | Sí |
| CP-DEU-085 | V3 | Alta | Agregar y quitar personas: foco, «Quitar» y renumeración | **PASSED** | PASSED | Sí |
| CP-DEU-086 | V3 | Alta | Gasto de $120.000 con Sofía y Juan: una transacción, dos deudas, una sola llamada | **PASSED** | PASSED | Sí |
| CP-DEU-087 | V3 | Alta | «Dividir en partes iguales»: con resto, sin resto y en US$ | **PASSED** | PASSED | Sí |
| CP-DEU-088 | V3 | Alta | La suma contra el gasto: justo, un centavo de más y tope por fila | **PASSED** | PASSED | Sí |
| CP-DEU-089 | V3 | Media | Tope de 10 personas | **PASSED** | PASSED | Sí |
| CP-DEU-090 | V3 | Alta | Persona repetida o vacía deshabilita «Guardar gasto» | **PASSED** | PASSED | Sí |
| CP-DEU-091 | V3 | Alta | Etiquetas «Compartido con…», aviso de éxito y diálogo de borrado con varias personas | **PASSED** | PASSED | Sí |
| CP-DEU-092 | V3 | Alta | Deudas: una fila por persona, orden alfabético, y eliminar/restaurar el gasto | **PASSED** | PASSED | Sí |
| CP-DEU-093 | V3 | Alta | La RPC rechaza pedidos inválidos y no deja filas | **PASSED** | PASSED | Sí |
| CP-DEU-094 | V3 | Alta | Con una sola persona rige lo de US-34 y US-41, con el pedido nuevo | **PASSED** | PASSED | Sí |
| CP-DEU-095 | V3 | Media | Cambiar la moneda, el tipo o el monto en el paso 1 con filas cargadas | **PASSED** | PASSED | Sí |
| CP-DAS-012 | V3 | Alta | «Me deben» suma al gasto neto y muestra la línea de deudas sueltas | **PASSED** | PASSED | Sí |
| CP-DAS-013 | V3 | Alta | «Debo» resta del gasto neto | **PASSED** | PASSED | Sí |
| CP-DAS-014 | V3 | Alta | Saldar la deuda del mismo mes deja el número en −ingresos y la línea en $0,00 | **PASSED** | PASSED | Sí |
| CP-DAS-015 | V3 | Alta | Una deuda de H−1 saldada hoy mueve H−1 y H, cada uno en su mes | **PASSED** | PASSED | Sí |
| CP-DAS-016 | V3 | Media | Reabrir quita el evento de H y deja H−1 igual | **PASSED** | PASSED | Sí |
| CP-DAS-017 | V3 | Alta | En US$ el evento usa el tipo de cambio congelado | **PASSED** | PASSED | Sí |
| CP-DAS-018 | V3 | Alta | Un gasto compartido no mueve las deudas sueltas y la deuda suelta no cambia Gastado ni Ingresos | **PASSED** | PASSED | Sí |
| CP-DAS-019 | V3 | Alta | Un mes con solo la deuda muestra el Resumen, no el estado vacío; la línea solo existe con eventos | **PASSED** | PASSED | Sí |
| CP-DAS-020 | V3 | Media | El mes viene de la URL; el borde de mes se calcula en hora de Argentina; si falla la lectura no hay números | **PASSED** | PASSED | Sí |
| CP-REG-017 | V3 | Alta | «Editar» en las filas activas, no en las eliminadas, con los campos precargados y la vuelta al mismo período | **PASSED** | PASSED | Sí |
| CP-REG-018 | V3 | Media | Tipo, moneda y tipo de cambio son texto y la RPC no los recibe | **PASSED** | PASSED | Sí |
| CP-REG-019 | V3 | Alta | Cambiar el monto de un gasto de este mes se guarda sin diálogo | **PASSED** | PASSED | Sí |
| CP-REG-020 | V3 | Alta | El resto de una compra en cuotas se reparte con la regla de C3, y la vista previa lo anticipa | **PASSED** | PASSED | Sí |
| CP-REG-021 | V3 | Alta | Pasar de 6 cuotas a 3 deja exactamente 3 imputaciones numeradas de 1 a 3 | **PASSED** | PASSED | Sí |
| CP-REG-022 | V3 | Alta | Mover la fecha a un mes cerrado abre el aviso de meses cerrados | **PASSED** | PASSED | Sí |
| CP-REG-023 | V3 | Alta | Cambiar el monto en un mes cerrado: «Cancelar» no guarda y «Guardar igual» sí | **PASSED** | PASSED | Sí |
| CP-REG-024 | V3 | Alta | Categoría sola y monto con categoría en meses cerrados | **PASSED** | PASSED | Sí |
| CP-REG-025 | V3 | Media | Cambiar la cuenta en un mes cerrado | **PASSED** | PASSED | Sí |
| CP-REG-026 | V3 | Alta | La nota, mover la fecha dentro del mes o cambiar solo una cuota futura no abren el aviso | **PASSED** | PASSED | Sí |
| CP-REG-027 | V3 | Alta | En USD el tipo de cambio sigue congelado y el aviso va en pesos | **PASSED** | PASSED | Sí |
| CP-REG-028 | V3 | Alta | Un ingreso no muestra categoría ni cuotas; por la API, con cuotas se rechaza | **PASSED** | PASSED | Sí |
| CP-REG-029 | V3 | Alta | Pasar una compra en cuotas a efectivo reinicia las cuotas y lo avisa; la RPC lo rechaza (I6) | **PASSED** | PASSED | Sí |
| CP-REG-030 | V3 | Alta | Validaciones de la pantalla con los mensajes de Registrar | **PASSED** | PASSED | Sí |
| CP-REG-031 | V3 | Alta | Las mismas validaciones directo contra la RPC, con atomicidad | **PASSED** | PASSED | Sí |
| CP-REG-032 | V3 | Media | Una categoría o cuenta archivada se ve, se puede guardar sin tocar y no se ofrece otra | **PASSED** | PASSED | Sí |
| CP-REG-033 | V3 | Alta | Eliminado, de una suscripción y compartido muestran su aviso; la RPC responde el mensaje exacto | **PASSED** | PASSED | Sí |
| CP-REG-034 | V3 | Media | «Guardar cambios» sigue los cambios y salir con cambios pide confirmar | **PASSED** | PASSED | Sí |
| CP-REG-035 | V3 | Media | Si falla guardar se muestra el error, se conserva lo escrito y reintentar guarda | **PASSED** | PASSED | Sí |
| CP-REG-036 | V3 | Media | Editar dos veces, o dos a la vez, deja una sola versión consistente | **PASSED** | PASSED | Sí |
| CP-REG-037 | V3 | Alta | Otro usuario y anon no pueden editar ni ver el movimiento; no hay update directo | **PASSED** | PASSED | Sí |
| CP-REG-038 | V3 | Media | El eliminado no suma y el editado sí, en su mes | **PASSED** | PASSED | Sí |
| CP-REG-039 | V3 | Media | Sin scroll horizontal a 390 px, foco atrapado y devuelto, botón de al menos 44 px | **PASSED** | PASSED | Sí |
| CP-REG-040 | V3 | Media | La función de aviso con today fijo | **PASSED** | PASSED | Sí |
| CP-REG-041 | V3 | Alta | Una fila activa no ofrece «Eliminar definitivamente» y la RPC la rechaza | **PASSED** | PASSED | Sí |
| CP-REG-042 | V3 | Alta | Eliminar y después eliminar definitivamente una compra en cuotas | **PASSED** | PASSED | Sí |
| CP-REG-043 | V3 | Alta | Un gasto compartido se borra con su deuda vinculada | **PASSED** | PASSED | Sí |
| CP-REG-044 | V3 | Alta | El movimiento de una suscripción no se borra definitivamente | **PASSED** | PASSED | Sí |
| CP-REG-045 | V3 | Alta | Otro usuario y anon no pueden borrarlo (C7) | **PASSED** | PASSED | Sí |
| CP-REG-046 | V3 | Media | Cancelar la confirmación no borra nada | **PASSED** | PASSED | Sí |
| CP-DEU-078 | V3 | Alta | Editar una deuda suelta desde el listado y volver con los mismos filtros | **PASSED** | PASSED | Sí |
| CP-DEU-079 | V3 | Alta | En US$ el tipo de cambio sigue congelado y la moneda es texto | **PASSED** | PASSED | Sí |
| CP-DEU-080 | V3 | Alta | La deuda de un gasto edita persona, monto y nota con el tope del gasto | **PASSED** | PASSED | Sí |
| CP-DEU-081 | V3 | Alta | Validaciones de la pantalla y de la RPC | **PASSED** | PASSED | Sí |
| CP-DEU-082 | V3 | Alta | Una deuda saldada no se edita; vuelta a pendiente se edita | **PASSED** | PASSED | Sí |
| CP-DEU-083 | V3 | Media | Si falla guardar se conserva lo escrito y reintentar guarda | **PASSED** | PASSED | Sí |
| CP-DEU-084 | V3 | Alta | Otro usuario y anon no pueden editar la deuda ajena; la de un gasto eliminado no se edita | **PASSED** | PASSED | Sí |
| CP-DEU-062 | V3 | Alta | Eliminar una deuda suelta «Me deben» de $20.000,00: confirmación, listado y totales | **PASSED** | PASSED | Sí |
| CP-DEU-063 | V3 | Media | Cancelar la confirmación no borra | **PASSED** | PASSED | Sí |
| CP-DEU-064 | V3 | Alta | Una deuda saldada no ofrece «Eliminar» hasta volver a pendiente | **PASSED** | PASSED | Sí |
| CP-DEU-065 | V3 | Alta | La RPC rechaza una deuda saldada (23514, HTTP 400) | **PASSED** | PASSED | Sí |
| CP-DEU-066 | V3 | Alta | Borrar la deuda de un gasto compartido deja el gasto como gasto normal | **PASSED** | PASSED | Sí |
| CP-DEU-067 | V3 | Alta | La deuda de otro usuario responde 404 y no se borra; anon recibe 42501 | **PASSED** | PASSED | Sí |
| CP-DEU-068 | V3 | Media | Si la baja falla por la red el diálogo sigue abierto y permite reintentar | **PASSED** | PASSED | Sí |
| CP-SUS-049 | V3 | Alta | Eliminar una activa con gastos generados: confirmación, listado y movimientos sueltos | **PASSED** | PASSED | Sí |
| CP-SUS-050 | V3 | Media | «Volver» en la confirmación no borra | **PASSED** | PASSED | Sí |
| CP-SUS-051 | V3 | Media | Una cancelada solo ofrece «Eliminar definitivamente» | **PASSED** | PASSED | Sí |
| CP-SUS-052 | V3 | Media | Una pausada se borra; el diálogo avisa que deja de generar | **PASSED** | PASSED | Sí |
| CP-SUS-053 | V3 | Alta | Tras borrar, la puesta al día no genera nada de esa suscripción ni toca los movimientos sueltos | **PASSED** | PASSED | Sí |
| CP-SUS-054 | V3 | Media | La baja lógica de uno de los gastos sigue después de borrar la suscripción | **PASSED** | PASSED | Sí |
| CP-SUS-055 | V3 | Alta | La suscripción de otro usuario responde 404 y no se borra; anon recibe 401 42501 | **PASSED** | PASSED | Sí |
| CP-CFG-016 | V3 | Alta | Borrar una categoría activa sin uso y volver a usar el nombre | **PASSED** | PASSED | Sí |
| CP-CFG-017 | V3 | Media | Borrar una categoría archivada sin uso | **PASSED** | PASSED | Sí |
| CP-CFG-018 | V3 | Alta | Con un movimiento activo la categoría no se borra y el mensaje dice cuántos | **PASSED** | PASSED | Sí |
| CP-CFG-019 | V3 | Alta | La misma regla directo contra la RPC (23514, HTTP 400) | **PASSED** | PASSED | Sí |
| CP-CFG-020 | V3 | Alta | Un movimiento dado de baja o una suscripción también cuentan como uso | **PASSED** | PASSED | Sí |
| CP-CFG-021 | V3 | Alta | La categoría de otro usuario responde «no encontrada» (HTTP 404) y no se borra | **PASSED** | PASSED | Sí |
| CP-CFG-022 | V3 | Media | Cancelar la confirmación no borra | **PASSED** | PASSED | Sí |
| CP-CFG-023 | V3 | Alta | Archivar y reactivar una cuenta: desaparece y vuelve de Registrar | **PASSED** | PASSED | Sí |
| CP-CFG-024 | V3 | Alta | Con una cuenta activa del mismo nombre no se reactiva y lo avisa | **PASSED** | PASSED | Sí |
| CP-CFG-025 | V3 | Media | Los movimientos de la cuenta no cambian al archivarla y reactivarla | **PASSED** | PASSED | Sí |
| CP-CFG-026 | V3 | Alta | Otro usuario y anon no pueden reactivar la cuenta ajena | **PASSED** | PASSED | Sí |
| CP-DEU-073 | V3 | Alta | «Juan», «juan» y «Juán» quedan en un grupo plegable; una persona con una sola deuda, en una fila | **PASSED** | PASSED | Sí |
| CP-DEU-074 | V3 | Alta | El neto de un grupo con ARS y US$ muestra las dos monedas, sin convertir | **PASSED** | PASSED | Sí |
| CP-DEU-075 | V3 | Alta | Con «Saldadas» el grupo solo cuenta las saldadas; con «Pendientes» una sola ya no es grupo | **PASSED** | PASSED | Sí |
| CP-DEU-076 | V3 | Media | Los totales y el estado vacío no cambian, y se salda desde un grupo | **PASSED** | PASSED | Sí |
| CP-DEU-077 | V3 | Alta | La clave de persona ignora mayúsculas, tildes y espacios; no junta personas distintas | **PASSED** | PASSED | Sí |
| CP-NAV-026 | V3 | Alta | A 390 px la barra tiene cinco destinos en orden y el encabezado no tiene engranaje | **PASSED** | PASSED | Sí |
| CP-NAV-027 | V3 | Media | El indicador se desliza bajo el ítem activo y una ruta inexistente no muestra la barra | **PASSED** | PASSED | Sí |
| CP-NAV-028 | V3 | Alta | Movimientos se abre desde el Resumen y la barra sigue marcando Resumen | **PASSED** | PASSED | Sí |
| CP-NAV-029 | V3 | Alta | A 1023 px hay píldora y a 1024 px barra lateral con Ajustes al pie, sin data-testid repetidos | **PASSED** | PASSED | Sí |
| CP-NAV-030 | V3 | Media | Un toque en el aire alrededor de la píldora no navega ni activa nada de atrás | **PASSED** | PASSED | Sí |
| CP-NAV-031 | V3 | Media | En una ruta hija de Ajustes la barra marca Ajustes | **PASSED** | PASSED | Sí |
| CP-NAV-032 | V3 | Media | El orden de tabulación de la barra coincide con el orden visual | **PASSED** | PASSED | Sí |
| CP-CFG-027 | V3 | Alta | Las tarjetas de Ajustes están en el orden indicado y «Cerrar sesión» es la última, aparte | **PASSED** | PASSED | Sí |
| CP-CFG-028 | V3 | Alta | «Categorías» abre su pantalla, la barra sigue marcando Ajustes y se vuelve con atrás | **PASSED** | PASSED | Sí |
| CP-CFG-029 | V3 | Media | Todo elemento interactivo de Ajustes tiene un data-testid propio y sin repetir | **PASSED** | PASSED | Sí |
| CP-CFG-030 | V3 | Media | «Volver a hacer la configuración inicial» abre /setup | **PASSED** | PASSED | Sí |
| CP-REG-047 | V3 | Alta | El diálogo de un movimiento dice «¿Eliminar movimiento?» y muestra su detalle | **PASSED** | PASSED | Sí |
| CP-REG-048 | V3 | Alta | Una compra en cuotas con deuda vinculada muestra las cuotas y la deuda en el detalle | **PASSED** | PASSED | Sí |
| CP-REG-049 | V3 | Media | El botón de confirmar tiene estilo de peligro, está separado de «Cancelar» y «Cancelar» no borra, en los cuatro diálogos | **PASSED** | PASSED | Sí |
| CP-SUS-160 | V3 | Media | El alta muestra «US$», «Cuenta» y chips en lugar de selects | **PASSED** | PASSED | Sí |
| CP-SUS-161 | V3 | Media | La edición muestra «US$» y los chips con lo elegido | **PASSED** | PASSED | Sí |
| CP-SUS-162 | V3 | Baja | La lista ofrece «Nueva suscripción» y el detalle dice «Cuenta» | **PASSED** | PASSED | Sí |
| CP-NAV-038 | V3 | Media | «Ver todos» del Resumen y «Activos»/«Eliminados» miden al menos 44 px | **PASSED** | PASSED | Sí |
| CP-NAV-039 | V3 | Media | En Deudas, los filtros, «Nueva deuda», «Marcar saldada» y «Editar» miden al menos 44 px | **PASSED** | PASSED | Sí |
| CP-NAV-040 | V3 | Media | En Ajustes, el selector de tema y los interruptores miden al menos 44 px de alto | **PASSED** | PASSED | Sí |
| CP-NAV-041 | V3 | Media | Los controles contiguos están separados al menos 8 px y no hay scroll horizontal | **PASSED** | PASSED | Sí |
| CP-NAV-033 | V3 | Media | El Resumen, Movimientos, Deudas y Suscripciones muestran un esqueleto y después el contenido | **PASSED** | PASSED | Sí |
| CP-NAV-034 | V3 | Media | Cambiar de mes o de filtro no dispara transición | **PASSED** | PASSED | Sí |
| CP-NAV-035 | V3 | Media | Cambiar de pestaña funde y entrar a un detalle o volver desplaza y funde | **PASSED** | PASSED | Sí |
| CP-NAV-036 | V3 | Media | Con movimiento reducido no hay desplazamiento ni pulso, solo fundido | **PASSED** | PASSED | Sí |
| CP-NAV-037 | V3 | Baja | El «atrás» del navegador no usa la dirección de la navegación anterior | **PASSED** | PASSED | Sí |
| CP-REG-050 | V3 | Media | Las ocho categorías sembradas se leen completas, sin cortar palabras | **PASSED** | PASSED | Sí |
| CP-REG-051 | V3 | Media | Un nombre largo ocupa como máximo dos líneas | **PASSED** | PASSED | Sí |
| CP-REG-052 | V3 | Media | Los chips de cuenta miden al menos 48 px de alto | **PASSED** | PASSED | Sí |
| CP-REG-053 | V3 | Alta | El monto se muestra con separador de miles y coma decimal mientras se escribe | **PASSED** | PASSED | Sí |
| CP-REG-054 | V3 | Media | Pegar un valor con punto decimal, una coma sola y letras | **PASSED** | PASSED | Sí |
| CP-REG-055 | V3 | Media | Editar en el medio no manda el cursor al final; borrar un punto borra el dígito vecino | **PASSED** | PASSED | Sí |
| CP-REG-056 | V3 | Alta | El gasto se guarda con el valor escrito (12.500,5 → 12500.50) | **PASSED** | PASSED | Sí |
| CP-REG-057 | V3 | Media | Nueva deuda y Nueva suscripción muestran el mismo formato | **PASSED** | PASSED | Sí |
| CP-DEU-096 | V3 | Alta | Al escribir en «Persona» sugiere las personas que coinciden, sin distinguir mayúsculas ni tildes | **PASSED** | PASSED | Sí |
| CP-DEU-097 | V3 | Alta | Elegir una sugerencia completa el campo, no marca error y guarda en la misma persona | **PASSED** | PASSED | Sí |
| CP-DEU-098 | V3 | Alta | Sin coincidencias o con el campo vacío no sugiere nada | **PASSED** | PASSED | Sí |
| CP-DEU-099 | V3 | Media | Con el teclado: flechas recorren, Enter elige sin enviar y Escape cierra | **PASSED** | PASSED | Sí |
| CP-DEU-100 | V3 | Media | En el gasto compartido de Registrar también sugiere | **PASSED** | PASSED | Sí |
| CP-DEU-101 | V3 | Media | Nueva deuda tiene «‹ Deudas» en el encabezado y vuelve a la lista | **PASSED** | PASSED | Sí |
| CP-DEU-102 | V3 | Alta | suggestPeople: normaliza, ordena, no repite, limita y no sugiere lo ya escrito | **PASSED** | PASSED | Sí |
| CP-DAS-027 | V3 | Alta | El predeterminado es «Solo gastos»: el número es lo gastado y las cuatro opciones están apagadas | **PASSED** | PASSED | Sí |
| CP-DAS-028 | V3 | Alta | Cada opción mueve el número al instante, con su signo, y la elección queda guardada | **PASSED** | PASSED | Sí |
| CP-DAS-029 | V3 | Media | «Solo gastos» apaga todas las opciones de un toque | **PASSED** | PASSED | Sí |
| CP-DAS-030 | V3 | Alta | El desglose suma exactamente el número y «Fuera del número» muestra lo que moverían las opciones apagadas | **PASSED** | PASSED | Sí |
| CP-DAS-031 | V3 | Media | El ícono de la esquina abre la misma hoja y, en la compu, el popover nace de la pill y Escape devuelve el foco | **PASSED** | PASSED | Sí |
| CP-DAS-032 | V3 | Media | El rótulo cambia a «Gastado neto» con una opción y el número negativo lleva el signo menos | **PASSED** | PASSED | Sí |
| CP-CFG-040 | V3 | Alta | En Ajustes cada interruptor cambia solo el número del Resumen y la elección sobrevive al recargar | **PASSED** | PASSED | Sí |
| CP-CFG-041 | V3 | Alta | La preferencia es de cada usuario: otro usuario no la ve ni la modifica | **PASSED** | PASSED | Sí |
| CP-CFG-031 | V3 | Alta | Elegir «Oscuro» cambia el tema al instante y queda al recargar | **PASSED** | PASSED | Sí |
| CP-CFG-032 | V3 | Media | «Automático» sigue al tema del sistema | **PASSED** | PASSED | Sí |
| CP-CFG-033 | V3 | Media | La elección no se guarda en la base y otro dispositivo conserva la suya | **PASSED** | PASSED | Sí |
| CP-CFG-034 | V3 | Media | En los dos temas el texto cumple contraste y la tarjeta protagonista conserva su degradado | **PASSED** | PASSED | Sí |
| CP-DAS-021 | V3 | Media | Un monto con centavos se lee igual en pantalla, con lector y en los tests | **PASSED** | PASSED | Sí |
| CP-DAS-022 | V3 | Alta | La dona tiene una porción por categoría con monto y porcentaje y el total compacto en el hueco | **PASSED** | PASSED | Sí |
| CP-DAS-023 | V3 | Media | «Gastado vs ingresos» muestra 6 meses con dos columnas por mes en una sola escala | **PASSED** | PASSED | Sí |
| CP-DAS-024 | V3 | Alta | «Ritmo del mes» termina en el total de lo gastado y se corta en hoy | **PASSED** | PASSED | Sí |
| CP-DAS-025 | V3 | Alta | «Cuotas que vienen» suma solo imputaciones de gastos no eliminados ya existentes | **PASSED** | PASSED | Sí |
| CP-DAS-026 | V3 | Media | Si falla la lectura de las tendencias, el resto del Resumen sigue visible | **PASSED** | PASSED | Sí |
| CP-SUS-057 | V3 | Alta | Lo cobrado más lo que falta es el total de la tarjeta | **PASSED** | PASSED | Sí |
| CP-SUS-058 | V3 | Alta | Un día de cobro anterior a hoy figura como cobrado y uno posterior, como falta | **PASSED** | PASSED | Sí |
| CP-SUS-059 | V3 | Media | «Por categoría» ordena de mayor a menor y los porcentajes salen del total en pesos | **PASSED** | PASSED | Sí |
| CP-SUS-060 | V3 | Alta | Una suscripción en US$ sin tipo de cambio del mes se avisa y no entra a la barra | **PASSED** | PASSED | Sí |
| CP-SUS-061 | V3 | Media | Sin suscripciones activas en el mes no se dibuja ninguno de los dos gráficos | **PASSED** | PASSED | Sí |
| CP-CFG-035 | V3 | Alta | Crear una categoría con nombre, ícono y color la muestra en la lista con esa baldosa | **PASSED** | PASSED | Sí |
| CP-CFG-036 | V3 | Media | Editar una categoría sembrada preselecciona su ícono y al guardar queda escrito | **PASSED** | PASSED | Sí |
| CP-CFG-037 | V3 | Alta | Archivar, reactivar y eliminar desde la hoja, con confirmación al eliminar | **PASSED** | PASSED | Sí |
| CP-CFG-038 | V3 | Alta | Postgres rechaza una clave de ícono con mayúsculas o de más de 40 caracteres | **PASSED** | PASSED | Sí |
| CP-CFG-039 | V3 | Alta | Otro usuario no ve ni modifica las categorías ajenas | **PASSED** | PASSED | Sí |
| CP-ACC-001 | Regresión V1 | Alta | Sin sesión, la app redirige al login | **PASSED** | PASSED | Sí |
| CP-ACC-002 | Regresión V1 | Alta | Una ruta privada abierta sin sesión conserva el destino | **PASSED** | PASSED | Sí |
| CP-ACC-003 | Regresión V1 | Alta | Crear una cuenta con email y contraseña válidos | **PASSED** | PASSED | Sí |
| CP-ACC-004 | Regresión V1 | Alta | Contraseñas que no cumplen los criterios se rechazan | **PASSED** | PASSED | Sí |
| CP-ACC-005 | Regresión V1 | Alta | No se puede crear una cuenta con un email ya registrado | **PASSED** | PASSED | Sí |
| CP-ACC-008 | Regresión V1 | Alta | Una cuenta nueva tiene el catálogo inicial sembrado | **PASSED** | PASSED | Sí |
| CP-ACC-009 | Regresión V1 | Alta | Cerrar sesión y no poder volver con "atrás" | **PASSED** | PASSED | Sí |
| CP-ACC-011 | Regresión V1 | Alta | Aislamiento entre usuarios en todas las tablas (par de autorización) | **PASSED** | PASSED | Sí |
| CP-ACC-012 | Regresión V1 | Alta | Contraseña y confirmación distintas bloquean el alta | **PASSED** | PASSED | Sí |
| CP-CFG-001 | Regresión V1 | Alta | Crear una categoría con nombre y color | **PASSED** | PASSED | Sí |
| CP-CFG-004 | Regresión V1 | Alta | Archivar una categoría con historia | **PASSED** | PASSED | Sí |
| CP-CFG-006 | Regresión V1 | Alta | Crear una cuenta de tarjeta de crédito | **PASSED** | PASSED | Sí |
| CP-CFG-008 | Regresión V1 | Alta | La siembra concurrente no duplica el catálogo | **PASSED** | PASSED | Sí |
| CP-CFG-009 | Regresión V1 | Alta | Cargar y actualizar el tipo de cambio de referencia del mes | **PASSED** | PASSED | Sí |
| CP-CFG-011 | Regresión V1 | Alta | Después de crear la cuenta aparece la configuración inicial | **PASSED** | PASSED | Sí |
| CP-REG-001 | Regresión V1 | Alta | El registro es la pantalla de inicio | **PASSED** | PASSED | Sí |
| CP-REG-010 | Regresión V1 | Alta | Monto vacío, cero o negativo no se guarda | **PASSED** | PASSED | Sí |
| CP-REG-012 | Regresión V1 | Alta | Eliminar una transacción la saca del total del mes | **PASSED** | PASSED | Sí |
| CP-REG-013 | Regresión V1 | Alta | Eliminar una compra con cuotas en meses cerrados avisa y es retroactivo | **PASSED** | PASSED | Sí |
| CP-REG-014 | Regresión V1 | Alta | Otro usuario no puede leer ni borrar una transacción ajena | **PASSED** | PASSED | Sí |
| CP-REG-015 | Regresión V1 | Alta | No se puede escribir en transactions salteando la RPC | **PASSED** | PASSED | Sí |
| CP-CUO-001 | Regresión V1 | Alta | Compra en 12 cuotas genera 12 imputaciones consecutivas | **PASSED** | PASSED | Sí |
| CP-CUO-002 | Regresión V1 | Alta | Previsualización del impacto mensual antes de guardar | **PASSED** | PASSED | Sí |
| CP-CUO-003 | Regresión V1 | Alta | Cambiar a una cuenta que no es crédito resetea las cuotas | **PASSED** | PASSED | Sí |
| CP-CUO-004 | Regresión V1 | Alta | División exacta: 12 cuotas iguales | **PASSED** | PASSED | Sí |
| CP-CUO-005 | Regresión V1 | Alta | El resto lo absorbe la última cuota | **PASSED** | PASSED | Sí |
| CP-CUO-006 | Regresión V1 | Alta | Cantidad de cuotas: 0, 1, 2, 12 y 13 | **PASSED** | PASSED | Sí |
| CP-CUO-009 | Regresión V1 | Alta | Borrar una compra en cuotas saca todas sus cuotas | **PASSED** | PASSED | Sí |
| CP-CUO-011 | Regresión V1 | Alta | Otro usuario no ve las cuotas de una compra ajena | **PASSED** | PASSED | Sí |
| CP-CUO-012 | Regresión V1 | Alta | Un ingreso no admite cuotas aunque la cuenta sea crédito | **PASSED** | PASSED | Sí |
| CP-CUO-013 | Regresión V1 | Alta | Un fallo a mitad de create_transaction no deja datos parciales | **PASSED** | PASSED | Sí |
| CP-MON-001 | Regresión V1 | Alta | Gasto en USD con el tipo de cambio sugerido | **PASSED** | PASSED | Sí |
| CP-MON-002 | Regresión V1 | Alta | Tabla de decisión de moneda y tipo de cambio (6 filas) | **PASSED** | PASSED | Sí |
| CP-MON-004 | Regresión V1 | Alta | Cambiar la referencia no altera lo ya guardado | **PASSED** | PASSED | Sí |
| CP-MON-005 | Regresión V1 | Alta | El total del mes en pesos incluye lo gastado en dólares | **PASSED** | PASSED | Sí |
| CP-MON-007 | Regresión V1 | Alta | Otro usuario no lee ni modifica el tipo de cambio ajeno | **PASSED** | PASSED | Sí |
| CP-DAS-001 | Regresión V1 | Alta | El Resumen abre en el mes actual con su total | **PASSED** | PASSED | Sí |
| CP-DAS-002 | Regresión V1 | Alta | El mes elegido vive en la URL | **PASSED** | PASSED | Sí |
| CP-DAS-011 | Regresión V1 | Alta | El Resumen de un usuario nunca muestra datos de otro | **PASSED** | PASSED | Sí |
| CP-DEU-001 | Regresión V2 | Alta | El interruptor «Gasto compartido» se enciende y se apaga, y el gasto se guarda sin deuda | **PASSED** | PASSED | Sí |
| CP-DEU-002 | Regresión V2 | Alta | Gasto compartido de $120.000,00 en 12 cuotas: se guarda el gasto y la deuda vinculada de Sofía | **PASSED** | PASSED | Sí |
| CP-DEU-003 | Regresión V2 | Alta | Gasto compartido en dólares (US$100 a tipo de cambio 1250): avisa en dólares y congela el tipo de cambio | **PASSED** | PASSED | Sí |
| CP-DEU-005 | Regresión V2 | Alta | No se puede compartir un gasto si falta cuánto te deben | **PASSED** | PASSED | Sí |
| CP-DEU-006 | Regresión V2 | Alta | No se puede compartir un gasto si falta con quién | **PASSED** | PASSED | Sí |
| CP-DEU-007 | Regresión V2 | Alta | Un ingreso no se puede compartir | **PASSED** | PASSED | Sí |
| CP-DEU-008 | Regresión V2 | Alta | El nombre hecho solo de espacios no cuenta como nombre | **PASSED** | PASSED | Sí |
| CP-DEU-010 | Regresión V2 | Alta | No se puede deber 0 pesos | **PASSED** | PASSED | Sí |
| CP-DEU-011 | Regresión V2 | Alta | Una deuda igual al gasto se acepta: «Tu parte» queda en $0,00 | **PASSED** | PASSED | Sí |
| CP-DEU-012 | Regresión V2 | Alta | Una deuda un centavo mayor que el gasto no se puede guardar | **PASSED** | PASSED | Sí |
| CP-DEU-013 | Regresión V2 | Alta | Por API, una deuda mayor que el gasto se rechaza y no se guarda nada | **PASSED** | PASSED | Sí |
| CP-DEU-015 | Regresión V2 | Alta | Eliminar el gasto vinculado oculta la deuda de /debts, deja de sumarla en "Te deben" y en el neto del Resumen, y conserva intacta su fila en debts | **PASSED** | PASSED | Sí |
| CP-DEU-016 | Regresión V2 | Alta | Al restaurar desde Movimientos → Eliminados un gasto cuya deuda vinculada estaba saldada, la deuda vuelve a /debts con estado saldada y la misma fecha settled_at | **PASSED** | PASSED | Sí |
| CP-DEU-017 | Regresión V2 | Alta | Estado inicial de /debts/new y guardado de una deuda "Me deben" en ARS por $20.000,00 crea una fila pendiente con transaction_id = null en una sola llamada a create_debt | **PASSED** | PASSED | Sí |
| CP-DEU-018 | Regresión V2 | Alta | Guardar una deuda suelta con dirección "Debo" en ARS crea direction = "i_owe" y en la lista muestra "Le debés" | **PASSED** | PASSED | Sí |
| CP-DEU-019 | Regresión V2 | Alta | En /debts/new, elegir "US$" con TC de referencia de 1250 precompleta "1.250,00", muestra "≈ $50.000,00" para US$40 y guarda fx_rate = 1250.0000 y amount_ars = 50000.00 | **PASSED** | PASSED | Sí |
| CP-DEU-022 | Regresión V2 | Alta | En /debts/new, un "Monto" igual a 0 muestra "El monto debe ser mayor a cero" | **PASSED** | PASSED | Sí |
| CP-DEU-024 | Regresión V2 | Alta | En /debts/new con US$, Monto = 0,01 y TC = 0,5 se acepta (redondeo half-up a $0,01) y guarda amount_ars = "0.01" | **PASSED** | PASSED | Sí |
| CP-DEU-025 | Regresión V2 | Alta | En «Nueva deuda» con US$, un tipo de cambio de 0 muestra «El tipo de cambio debe ser mayor a cero» | **PASSED** | PASSED | Sí |
| CP-DEU-026 | Regresión V2 | Alta | En /debts/new, una fecha posterior a hoy (<MAÑANA>) muestra "La fecha no puede ser futura" y deshabilita "Guardar deuda" | **PASSED** | PASSED | Sí |
| CP-DEU-027 | Regresión V2 | Alta | Directo contra create_debt, p_person = "" se rechaza con "Ingresá el nombre de la persona" | **PASSED** | PASSED | Sí |
| CP-DEU-029 | Regresión V2 | Alta | Directo contra create_debt, p_amount = 0 se rechaza con "I4: el monto debe ser mayor a cero" | **PASSED** | PASSED | Sí |
| CP-DEU-031 | Regresión V2 | Alta | Directo contra create_debt, p_currency = "USD" con p_fx_rate = null se rechaza con "I5: fx_rate es obligatorio si y solo si la moneda es USD" | **PASSED** | PASSED | Sí |
| CP-DEU-033 | Regresión V2 | Alta | Directo contra create_debt, p_incurred_on = "<MAÑANA>" se rechaza con "La fecha no puede ser posterior a hoy" | **PASSED** | PASSED | Sí |
| CP-DEU-034 | Regresión V2 | Alta | Directo contra create_debt con el rol anon (sin Authorization) responde 42501 (permission denied) | **PASSED** | PASSED | Sí |
| CP-DEU-035 | Regresión V2 | Alta | Un POST /rest/v1/debts directo con sesión autenticada responde 42501 (permission denied) y no crea filas | **PASSED** | PASSED | Sí |
| CP-DEU-036 | Regresión V2 | Alta | La tarjeta de totales suma las deudas pendientes en pesos (incluyendo USD al TC congelado), excluye las saldadas y no cambia al cambiar el filtro de estado | **PASSED** | PASSED | Sí |
| CP-DEU-037 | Regresión V2 | Alta | Cuando "Debés" supera a "Te deben", el neto muestra "En contra $5.000,00" | **PASSED** | PASSED | Sí |
| CP-DEU-038 | Regresión V2 | Alta | Cambiar el TC de referencia del mes a 1400 no modifica "Te deben" de una deuda en USD ya creada a TC 1250 (C5) | **PASSED** | PASSED | Sí |
| CP-DEU-039 | Regresión V2 | Alta | /debts sin parámetros muestra "Pendientes" seleccionado y solo pendientes; tocar "Saldadas" y "Todas" actualiza ?status= y filtra la lista | **PASSED** | PASSED | Sí |
| CP-DEU-043 | Regresión V2 | Alta | Otro usuario no ve las deudas de alguien más | **PASSED** | PASSED | Sí |
| CP-DEU-044 | Regresión V2 | Alta | Por API, otro usuario no recibe las deudas de alguien más | **PASSED** | PASSED | Sí |
| CP-DEU-045 | Regresión V2 | Alta | Por API, sin sesión no se pueden leer las deudas | **PASSED** | PASSED | Sí |
| CP-DEU-046 | Regresión V2 | Alta | Marcar una deuda como saldada desde «Pendientes» | **PASSED** | PASSED | Sí |
| CP-DEU-047 | Regresión V2 | Alta | «Deshacer» devuelve la deuda a pendiente | **PASSED** | PASSED | Sí |
| CP-DEU-049 | Regresión V2 | Alta | Por API, saldar una deuda ya saldada se rechaza | **PASSED** | PASSED | Sí |
| CP-DEU-050 | Regresión V2 | Alta | Por API, un usuario no puede saldar la deuda de otro | **PASSED** | PASSED | Sí |
| CP-DEU-051 | Regresión V2 | Alta | Por API, no se puede modificar una deuda directamente | **PASSED** | PASSED | Sí |
| CP-DEU-052 | Regresión V2 | Alta | «Volver a pendiente» desde «Saldadas» | **PASSED** | PASSED | Sí |
| CP-DEU-054 | Regresión V2 | Alta | Filtro por dirección: «Todas», «Te deben» y «Debés» | **PASSED** | PASSED | Sí |
| CP-DEU-055 | Regresión V2 | Alta | Gasto compartido con varias personas: agregar, quitar y guardar | **PASSED** | PASSED | Sí |
| CP-DEU-056 | Regresión V2 | Alta | Se puede compartir con hasta 10 personas | **PASSED** | PASSED | Sí |
| CP-DEU-057 | Regresión V2 | Alta | Por API, deudas que suman más que el gasto se rechazan | **PASSED** | PASSED | Sí |
| CP-DEU-058 | Regresión V2 | Alta | Resumen: gasto bruto y neto de reembolsos | **PASSED** | PASSED | Sí |
| CP-DEU-059 | Regresión V2 | Alta | Resumen: el neto no cambia al saldar la deuda | **PASSED** | PASSED | Sí |
| CP-DEU-060 | Regresión V2 | Alta | Resumen: una deuda suelta «Me deben» no cambia el neto | **PASSED** | PASSED | Sí |
| CP-DEU-061 | Regresión V2 | Alta | Resumen: el neto en dólares no cambia si cambia el tipo de cambio | **PASSED** | PASSED | Sí |
| CP-NAV-010 | Regresión V2 | Alta | Tocar «Registrar» estando en Registrar no pierde lo cargado | **PASSED** | PASSED | Sí |
| CP-NAV-012 | Regresión V2 | Alta | Sin internet el gasto no se pierde y aparece «Reintentar» | **PASSED** | PASSED | Sí |
| CP-NAV-013 | Regresión V2 | Alta | Reintentar al volver internet guarda una sola vez | **PASSED** | PASSED | Sí |
| CP-NAV-014 | Regresión V2 | Alta | Con internet muy lenta, a los 15 segundos avisa que falló | **PASSED** | PASSED | Sí |
| CP-NAV-015 | Regresión V2 | Alta | Reintentar no duplica un gasto que ya se había guardado | **PASSED** | PASSED | Sí |
| CP-NAV-016 | Regresión V2 | Alta | La misma clave dos veces seguidas devuelve el mismo gasto | **PASSED** | PASSED | Sí |
| CP-NAV-017 | Regresión V2 | Alta | Dos pedidos simultáneos con la misma clave crean un solo gasto | **PASSED** | PASSED | Sí |
| CP-NAV-018 | Regresión V2 | Alta | La misma clave en dos usuarios distintos no se pisa | **PASSED** | PASSED | Sí |
| CP-NAV-019 | Regresión V2 | Alta | Si se archiva la categoría antes de guardar, el gasto se rechaza con aviso | **PASSED** | PASSED | Sí |
| CP-NAV-020 | Regresión V2 | Alta | La API rechaza un gasto con una categoría archivada | **PASSED** | PASSED | Sí |
| CP-NAV-021 | Regresión V2 | Alta | Al volver a Registrar aparece el gasto pendiente | **PASSED** | PASSED | Sí |
| CP-NAV-022 | Regresión V2 | Alta | Recuperar un gasto que en realidad ya estaba guardado | **PASSED** | PASSED | Sí |
| CP-NAV-023 | Regresión V2 | Alta | Descartar borra el pendiente, incluso al recargar | **PASSED** | PASSED | Sí |
| CP-NAV-024 | Regresión V2 | Alta | Cerrar sesión borra los pendientes | **PASSED** | PASSED | Sí |
| CP-NAV-025 | Regresión V2 | Alta | Tocar dos veces «Guardar» guarda una sola vez | **PASSED** | PASSED | Sí |
| CP-EXP-002 | Regresión V2 | Alta | El mes siguiente está bloqueado | **PASSED** | PASSED | Sí |
| CP-EXP-003 | Regresión V2 | Alta | El alcance mensual propone el nombre 2026-09 | **PASSED** | PASSED | Sí |
| CP-EXP-004 | Regresión V2 | Alta | El primer día del mes se incluye | **PASSED** | PASSED | Sí |
| CP-EXP-005 | Regresión V2 | Alta | El día posterior al mes se excluye | **PASSED** | PASSED | Sí |
| CP-EXP-006 | Regresión V2 | Alta | El 1 de enero se incluye en el año | **PASSED** | PASSED | Sí |
| CP-EXP-007 | Regresión V2 | Alta | El día posterior al año se excluye | **PASSED** | PASSED | Sí |
| CP-EXP-008 | Regresión V2 | Alta | Una transacción eliminada queda fuera | **PASSED** | PASSED | Sí |
| CP-EXP-009 | Regresión V2 | Alta | El archivo comienza con BOM UTF-8 | **PASSED** | PASSED | Sí |
| CP-EXP-010 | Regresión V2 | Alta | El encabezado tiene doce columnas exactas | **PASSED** | PASSED | Sí |
| CP-EXP-011 | Regresión V2 | Alta | Doce cuotas salen en una sola fila por el total | **PASSED** | PASSED | Sí |
| CP-EXP-012 | Regresión V2 | Alta | ARS se escribe con dos decimales exactos | **PASSED** | PASSED | Sí |
| CP-EXP-013 | Regresión V2 | Alta | USD conserva cuatro decimales de TC | **PASSED** | PASSED | Sí |
| CP-EXP-014 | Regresión V2 | Alta | Una coma obliga a entrecomillar la descripción | **PASSED** | PASSED | Sí |
| CP-EXP-015 | Regresión V2 | Alta | Las comillas internas se duplican | **PASSED** | PASSED | Sí |
| CP-EXP-016 | Regresión V2 | Alta | Descripción con igual se neutraliza | **PASSED** | PASSED | Sí |
| CP-EXP-017 | Regresión V2 | Alta | Una categoría que empieza con igual se neutraliza | **PASSED** | PASSED | Sí |
| CP-EXP-018 | Regresión V2 | Alta | 1.500 transacciones se exportan sin faltantes | **PASSED** | PASSED | Sí |
| CP-EXP-019 | Regresión V2 | Alta | El CSV de A no contiene movimientos de B | **PASSED** | PASSED | Sí |
| CP-EXP-020 | Regresión V2 | Alta | La API con token de A devuelve cero filas de B | **PASSED** | PASSED | Sí |
| CP-EXP-023 | Regresión V2 | Alta | Un doble click inicia una sola descarga | **PASSED** | PASSED | Sí |
| CP-EXP-025 | Regresión V2 | Alta | Offline muestra el error exacto | **PASSED** | PASSED | Sí |
| CP-EXP-026 | Regresión V2 | Alta | El reintento después de Offline descarga completo | **PASSED** | PASSED | Sí |
| CP-EXP-027 | Regresión V2 | Baja | Tocar fuera cierra sin descargar | **PASSED** | PASSED | Sí |
| CP-EXP-028 | Regresión V2 | Media | Atrás cierra la hoja inicial | **PASSED** | PASSED | Sí |
| CP-EXP-029 | Regresión V2 | Alta | Atrás durante Exportando cancela la descarga | **PASSED** | PASSED | Sí |
| CP-EXP-030 | Regresión V2 | Alta | Una alta concurrente impide descargar un año incompleto | **PASSED** | PASSED | Sí |
| CP-EXP-031 | Regresión V2 | Alta | HTTP 500 muestra Error y no descarga | **PASSED** | PASSED | Sí |
| CP-IMP-014 | Regresión V2 | Alta | F8: monto cero | **PASSED** | PASSED | Sí |
| CP-IMP-024 | Regresión V2 | Media | Nombres, tipo y moneda aceptan espacios y mayúsculas | **PASSED** | PASSED | Sí |
| CP-IMP-027 | Regresión V2 | Alta | El resumen del archivo de ejemplo suma solo las siete filas listas | **PASSED** | PASSED | Sí |
| CP-IMP-030 | Regresión V2 | Alta | Confirmar importa solo las filas listas con todos sus campos | **PASSED** | PASSED | Sí |
| CP-IMP-031 | Regresión V2 | Alta | La compra de 240.000 en seis cuotas crea seis imputaciones exactas | **PASSED** | PASSED | Sí |
| CP-IMP-032 | Regresión V2 | Alta | Un rechazo tardío de categoría no impide las otras filas | **PASSED** | PASSED | Sí |
| CP-IMP-033 | Regresión V2 | Alta | Quinientas filas de doce cuotas terminan en menos de diez segundos | **PASSED** | PASSED | Sí |
| CP-IMP-034 | Regresión V2 | Alta | La RPC procesa una válida y rechaza tres inválidas | **PASSED** | PASSED | Sí |
| CP-IMP-035 | Regresión V2 | Alta | La RPC rechaza un lote de 501 elementos | **PASSED** | PASSED | Sí |
| CP-IMP-036 | Regresión V2 | Alta | El rol anon no puede ejecutar import_transactions | **PASSED** | PASSED | Sí |
| CP-IMP-037 | Regresión V2 | Alta | Otro usuario no ve transacciones ni imports ajenos | **PASSED** | PASSED | Sí |
| CP-IMP-038 | Regresión V2 | Alta | Reintento tras respuesta perdida reconoce lo guardado | **PASSED** | PASSED | Sí |
| CP-IMP-039 | Regresión V2 | Alta | Dos llamadas API con el mismo import_id son idempotentes | **PASSED** | PASSED | Sí |
| CP-IMP-040 | Regresión V2 | Alta | Sin respuesta conserva Revisión | **PASSED** | PASSED | Sí |
| CP-IMP-041 | Regresión V2 | Alta | Sesión vencida ofrece volver a entrar | **PASSED** | PASSED | Sí |
| CP-SUS-001 | Regresión V2 | Alta | Dar de alta una suscripción en ARS desde hace 2 meses con día de cobro 10 genera los 2 gastos vencidos al guardar | **PASSED** | PASSED | Sí |
| CP-SUS-006 | Regresión V2 | Alta | Rechazar en UI el alta de suscripción con Nombre igual al de otra activa sin distinguir mayúsculas ni espacios (" netflix ") | **PASSED** | PASSED | Sí |
| CP-SUS-007 | Regresión V2 | Alta | Rechazar en API create_subscription con Nombre igual al de otra activa (" netflix ") | **PASSED** | PASSED | Sí |
| CP-SUS-008 | Regresión V2 | Alta | Rechazar en UI el alta de suscripción con Monto igual a "0" | **PASSED** | PASSED | Sí |
| CP-SUS-009 | Regresión V2 | Alta | Rechazar en API create_subscription con p_amount = "0.00" | **PASSED** | PASSED | Sí |
| CP-SUS-017 | Regresión V2 | Alta | Rechazar en API create_subscription usando p_category_id de otro usuario | **PASSED** | PASSED | Sí |
| CP-SUS-018 | Regresión V2 | Alta | Rechazar en API un INSERT directo sobre /rest/v1/subscriptions con la sesión del usuario | **PASSED** | PASSED | Sí |
| CP-SUS-020 | Regresión V2 | Alta | Rechazar en UI ver el detalle de una suscripción de otro usuario mostrando subscription-detail-not-found | **PASSED** | PASSED | Sí |
| CP-SUS-021 | Regresión V2 | Alta | Rechazar en API leer una suscripción de otro usuario (GET /rest/v1/subscriptions devuelve []) | **PASSED** | PASSED | Sí |
| CP-SUS-022 | Regresión V2 | Alta | Rechazar en API create_subscription sin sesión autenticada (rol anon) | **PASSED** | PASSED | Sí |
| CP-SUS-024 | Regresión V2 | Alta | Puesta al día automática al entrar a la app genera 2 períodos vencidos pendientes y muestra el aviso app-catchup-generated | **PASSED** | PASSED | Sí |
| CP-SUS-025 | Regresión V2 | Alta | Dos llamadas consecutivas por API a run_subscription_catchup responden 200 OK sin error y dejan exactamente 1 transacción por período | **PASSED** | PASSED | Sí |
| CP-SUS-026 | Regresión V2 | Alta | Suscripción en estado paused no genera ocurrencias al ejecutar run_subscription_catchup | **PASSED** | PASSED | Sí |
| CP-SUS-027 | Regresión V2 | Alta | Suscripción con día de cobro 31 entre 2026-01 y 2026-04 genera ocurrencias con fechas 31/01/2026, 28/02/2026, 31/03/2026 y 30/04/2026 | **PASSED** | PASSED | Sí |
| CP-SUS-028 | Regresión V2 | Alta | Suscripción con día de cobro <DIA_MAÑANA> no genera la ocurrencia del mes corriente | **PASSED** | PASSED | Sí |
| CP-SUS-029 | Regresión V2 | Alta | Suscripción con día de cobro igual a <DIA_HOY> genera la ocurrencia del mes corriente | **PASSED** | PASSED | Sí |
| CP-SUS-030 | Regresión V2 | Alta | Pausar suscripción activa con día de cobro 28 (> <DIA_HOY>) muestra advertencia de este mes y pasa a "Pausada desde <HOY>" con piso en <MES_SIGUIENTE> | **PASSED** | PASSED | Sí |
| CP-SUS-031 | Regresión V2 | Alta | pause_subscription por API ejecuta primero la puesta al día y genera los meses vencidos pendientes antes de pausar | **PASSED** | PASSED | Sí |
| CP-SUS-032 | Regresión V2 | Alta | Rechazar en API pause_subscription usando la sesión de otro usuario (404 P0002) | **PASSED** | PASSED | Sí |
| CP-SUS-033 | Regresión V2 | Alta | Reanudar suscripción pausada abre resume-subscription-dialog, pasa a "Activa", limpia paused_at, conserva generate_from_period = '<MES_SIGUIENTE>-01' y no genera el mes actual | **PASSED** | PASSED | Sí |
| CP-SUS-034 | Regresión V2 | Alta | Cancelar suscripción activa con 4 gastos cargados mantiene el historial en el Detalle y en el Resumen y oculta los botones de acción | **PASSED** | PASSED | Sí |
| CP-SUS-035 | Regresión V2 | Alta | Editar el monto de una suscripción activa de $5.000,00 a $7.000,00 conserva las 4 ocurrencias ya generadas en $5.000,00 y muestra Moneda y Mes de inicio como solo lectura | **PASSED** | PASSED | Sí |
| CP-SUS-037 | Regresión V2 | Alta | Rechazar en UI renombrar una suscripción poniéndole el nombre de otra suscripción activa del mismo usuario | **PASSED** | PASSED | Sí |
| CP-SUS-040 | Regresión V2 | Alta | Eliminar desde Movimientos la ocurrencia de <MES_ANTERIOR> muestra delete-transaction-subscription-note, figura con "Eliminado" en el Detalle y no vuelve a crearse al recargar | **PASSED** | PASSED | Sí |
| CP-SUS-041 | Regresión V2 | Alta | Mostrar la marca de suscripción en Movimientos y en "Últimos movimientos" del Resumen (y no en un gasto manual) y navegar al Detalle al tocarla | **PASSED** | PASSED | Sí |
| CP-SUS-042 | Regresión V2 | Alta | La ocurrencia generada de una suscripción suma en "Gastado en <mes corto>" y resta en "Balance" del Resumen de V1 | **PASSED** | PASSED | Sí |
| CP-SUS-043 | Regresión V2 | Alta | Suscripción activa en USD con tipo de cambio en <MES_HACE_2> y sin tipo de cambio en <MES_ANTERIOR> genera solo <MES_HACE_2>, muestra "Falta tipo de cambio" y el botón "Cargar tipo de cambio" navega a /settings?period=<MES_ANTERIOR> | **PASSED** | PASSED | Sí |
| CP-SUS-044 | Regresión V2 | Alta | Con dos suscripciones activas en ARS ($5.000,00 y $2.500,00), el total mensual comprometido muestra "$7.500,00" y "2 suscripciones activas este mes" | **PASSED** | PASSED | Sí |
| CP-SUS-045 | Regresión V2 | Alta | Suscripción activa en USD 10,00 con tipo de cambio del período corriente 1.250,00 suma "$12.500,00" al total mensual comprometido | **PASSED** | PASSED | Sí |
| CP-SUS-047 | Regresión V2 | Alta | Vista previa en /subscriptions/new con $5.000,00 ARS, día 28 (> <DIA_HOY>), desde <MES_HACE_2> y sin fin muestra 2 meses en "Se cargan al guardar", 3 en "Próximos cobros", resumen de "$10.000,00" y al guardar crea exactamente esas 2 transacciones | **PASSED** | PASSED | Sí |
| CP-SUS-048 | Regresión V2 | Alta | Vista previa en /subscriptions/new en USD con tipo de cambio en <MES_HACE_2> y sin tipo de cambio en <MES_ANTERIOR> marca <MES_ANTERIOR> con data-blocked="true" y no lo cuenta en el resumen | **PASSED** | PASSED | Sí |
| CP-CAT-001 | Regresión V2 | Alta | La torta muestra una porción por categoría, con su monto y su porcentaje | **PASSED** | PASSED | Sí |
| CP-CAT-002 | Regresión V2 | Alta | Los ingresos y los gastos eliminados no entran en la torta | **PASSED** | PASSED | Sí |
| CP-CAT-004 | Regresión V2 | Alta | Tocar una categoría del Resumen abre su detalle del mes | **PASSED** | PASSED | Sí |
