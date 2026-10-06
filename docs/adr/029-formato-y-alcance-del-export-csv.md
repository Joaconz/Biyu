# ADR-029 — Formato y alcance del export CSV

**Estado:** aceptada · **Fecha:** 2026-10
**Relacionada:** ADR-001 · C1, C2, C3, C5, C7, C9, C10, C11 · I4, I10 · FR-21, FR-22 · NFR-04 · US-47 ·
ADR-013, ADR-023, ADR-026

## Contexto

C9 pide que los datos sean exportables sin la aplicación, y US-47 lo baja a una historia. FR-22
(`pre-entrega.md`) pide la exportación "en un rango de fechas", con una columna de estado "activa o
eliminada". Ninguno fija qué rango, si entran las eliminadas, el separador, la codificación, el
formato de los montos ni si una compra en cuotas sale como una fila o una por cuota. Dejar eso
abierto hace que la historia no se pueda probar con pass/fail.

Hay además dos condiciones técnicas:

- **PostgREST corta en 1000 filas** (`max_rows = 1000` en `supabase/config.toml`). Se asume que el
  proyecto hosteado tiene el mismo valor, pero desde el repo no se puede comprobar. Un `select` sin
  paginar devuelve un archivo incompleto sin avisar.
- **Excel con configuración regional de Argentina** usa `;` como separador de lista y `,` como
  separador decimal. Abre un CSV separado por comas con todo en la columna A. Y si recibe
  `1234.50` con `;` como separador, puede leer el punto como separador de miles y convertirlo en
  `123450` sin avisar.

## Decisión

**Período: un mes o un año calendario, el actual o uno pasado.** El export sale de Movimientos y
toma el mes del `?period` de la URL (C11): se exporta ese mes o el año calendario completo que lo
contiene. No hay fechas libres ni un selector de período aparte. Los meses posteriores al actual,
a los que Movimientos permite navegar (FR-21), no se exportan. Se filtra por `occurred_on`, la
fecha del evento, y no por el período de las imputaciones. Acotar a un mes o a un año mantiene
chico el volumen de cada archivo y deja un único nombre de archivo correcto por período.

**Solo transacciones activas.** Las eliminadas (`deleted_at` no nulo) no se exportan, igual que no
cuentan en ningún total de la app (C10, I10). El archivo representa las transacciones vigentes con fecha
en el período, sin las que el usuario descartó. Por eso se quita la columna de estado que pedía FR-22: en el archivo
siempre diría `activa`.

**Granularidad.** Una fila por **transacción** (el evento), nunca por imputación. Las cuotas se
exportan como dos columnas: `cuotas` (cantidad) y `primer_periodo`. Una compra en cuotas sale en el
export del mes de su fecha y no en los de los meses en que tiene cuotas. Las imputaciones se pueden
reconstruir con la regla de C3. Exportarlas duplicaría cada compra en cuotas en el export de un año,
y sumar la columna `monto` daría N veces el total.

**Formato.** RFC 4180 canónico, pensado para que lo lea cualquier programa y no solo Excel:

- Separador `,` y fin de línea CRLF, con una fila de encabezado. Se encierra entre comillas dobles
  el campo que contenga `,`, `"`, CR o LF, y se duplican las comillas internas.
- UTF-8 **con BOM**, para que Excel muestre bien "ñ" y los acentos.
- Montos como string decimal con `.`, sin separador de miles ni símbolo, con exactamente 2
  decimales (`numeric(14,2)`). El tipo de cambio va con 4 (`numeric(14,4)`). Sin cast, PostgREST
  devuelve `numeric` como número JSON (`1500.00` llega como `1500`). Por eso el `select` pide
  `amount::text`, `amount_ars::text` y `fx_rate::text`, como `src/lib/fxRates.ts`, y esos strings
  se copian sin pasar por `number` (C2, ADR-013). Si un valor no cumple `^\d+\.\d{2}$` (o
  `\.\d{4}` en el tipo de cambio), la exportación se cancela.
- Fechas ISO `AAAA-MM-DD`; período `AAAA-MM` (los primeros 7 caracteres de `first_period`).
- Encabezados en español y sin acentos (`fecha`, `tipo_de_cambio`…). El archivo es para el
  usuario, no es código, y sin acentos ningún programa los lee mal.
- Nombre `biyu-movimientos-AAAA-MM.csv` o `biyu-movimientos-AAAA.csv`, según el período. No
  depende del día ni de la zona horaria del navegador.
- **Neutralización de fórmulas.** Si un campo de texto libre (`categoria`, `cuenta`, `descripcion`)
  empieza con `=`, `+`, `-`, `@`, tabulación o CR, se le agrega un apóstrofo `'` adelante, para que
  una planilla no lo ejecute como fórmula (CSV injection, OWASP). Primero se neutraliza y después
  se entrecomilla. Es el único caso en que el archivo no copia el dato tal cual.

**Dónde se arma.** En el navegador, sin RPC ni Edge Function nueva. Se leen `transactions` con
`categories(name)` y `accounts(name)` por el SDK, bajo RLS (C7), con `deleted_at is null` y el rango
de `occurred_on` del período. Se ordenan por `occurred_on`, `created_at` e `id`, en páginas de hasta
1000 filas. Se pagina con cursor sobre esa terna y no con `offset`, para que una escritura
concurrente no repita ni saltee filas. El armado del texto, el rango de fechas y el nombre son
funciones puras en `src/domain/` que reciben las filas, el período y `today` (C1).

**Completitud.** Un año puede pasar las 1000 filas. La lectura no puede darse por terminada al
llegar una página incompleta. Si el proyecto hosteado tuviera un `max_rows` menor que el tamaño
pedido, la primera página ya parecería la última y el archivo saldría truncado sin aviso, que es
justo lo que C9 quiere evitar. Por eso la primera lectura pide `count: 'exact'`. Al terminar, si la
cantidad de filas leídas no coincide con ese conteo, la exportación falla y no descarga nada. Lo
mismo si falla cualquier página. Es preferible un error con reintento a un archivo incompleto que
parece completo.

## Alternativas descartadas

- **Todo el historial en un solo archivo.** Es lo que dice US-47 en `02-behavior-spec.md` y lo más
  simple de usar. Pero el volumen no tiene techo, y el archivo deja de corresponder a algo que el
  usuario ve en pantalla. Con mes o año, cada archivo corresponde a un período que el usuario elige
  explícitamente, y el historial completo se arma bajando un archivo por año.
- **Rango de fechas libre, como dice FR-22.** Suma dos campos con validaciones propias ("desde"
  posterior a "hasta", fechas futuras, rango vacío) y un selector de período distinto del que ya
  tiene la app en la URL. Mes y año cubren el uso real (cerrar el mes, armar el año para impuestos)
  con el período que ya existe.
- **Exportar también las eliminadas, con una columna de estado (FR-22).** Conserva todo, pero el
  archivo mezcla datos que la app ya no cuenta en ningún total (I10), y quien lo suma en una
  planilla tiene que acordarse de filtrarlos.
  Las eliminadas siguen visibles en Movimientos > "Eliminados".
- **Formato "Excel argentino" (`;` como separador y `,` decimal).** Se abre con doble clic en Excel
  con configuración regional de Argentina, pero rompe a cualquier programa que espere RFC 4180, y
  `1234,50` no es el formato de C2. Mezclar los dos (`;` como separador y `.` decimal) es peor:
  Excel puede leer el punto como separador de miles y multiplicar montos por 100 sin avisar. Un
  número mal leído en silencio es peor que una planilla que se ve mal y se corrige importando con
  "Datos > Desde texto/CSV".
- **Una fila por imputación.** Sirve para ver el impacto mes a mes, pero el total de la columna
  deja de ser el total de lo cargado y no es el evento que registró el usuario. Si hace falta, es
  otro archivo.
- **Edge Function o RPC que devuelva el CSV.** Ahorra la paginación en el cliente, pero suma una
  pieza de servidor con su propio despliegue, y la autorización ya la resuelve RLS en el `select`.
- **No neutralizar fórmulas.** El archivo sería una copia exacta, pero una descripción como
  `=HYPERLINK(...)` se ejecutaría al abrir el archivo en una planilla.

## Consecuencias

- US-47 se puede verificar abriendo el archivo como texto: columnas, orden, comillas, BOM, montos y
  nombre tienen un único valor correcto.
- Para tener todo el historial hay que bajar un archivo por año.
- Una compra en cuotas solo aparece en el export del mes de su fecha. El export de un mes **no**
  coincide con las filas de Movimientos ni con el "total gastado" del Resumen de ese mes, porque
  los dos muestran imputaciones (ADR-001) y el export lista eventos. Un mes que solo tiene cuotas
  de compras anteriores da un export vacío. La hoja de exportación lo avisa: "Las cuotas de compras
  anteriores no se incluyen".
- Quien abra el archivo con doble clic en Excel con configuración regional de Argentina ve todo en
  una columna. Hay que importarlo indicando coma y punto decimal. Google Sheets y LibreOffice lo
  abren bien. Es un costo de usabilidad aceptado a cambio de no leer mal un monto.
- FR-22 queda cubierto con dos ajustes: el rango es un mes o un año calendario, y no hay columna de
  estado porque solo se exportan activas. Sus columnas se amplían con `tipo`, `cuotas`,
  `primer_periodo`, `descripcion` e `id`. Su "medio de pago" es la columna `cuenta` (glosario:
  Cuenta). Se refleja en `docs/08-trazabilidad.md`.
- La neutralización de fórmulas cambia el texto exportado de los campos que empiezan con `=`, `+`,
  `-`, `@`, tabulación o CR. Los montos y las fechas no la necesitan, porque nunca empiezan así (I4:
  montos siempre positivos).
- No toca el schema, ni RLS, ni `create_transaction`. Lee con los permisos de `select` que ya
  existen (C7) y no agrega tablas ni migraciones.
