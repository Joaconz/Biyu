# Entrega 2 · Historias de usuario · Export CSV (V2)

Épica [#19](https://github.com/Joaconz/Biyu/issues/19) · Milestone V2 · Nivel 1 del alcance
(`entrega-2/README.md`). Formato de `entrega-1/01-historias-de-usuario.md`: cada criterio `CA-k` se
cita desde los casos como `US-47 · CA-k`. Las decisiones de formato y alcance que no se deducen
del spec están en [ADR-029](../../docs/adr/029-formato-y-alcance-del-export-csv.md).

---

#### US-47: Exportar mis transacciones de un mes o de un año a CSV · [#201](https://github.com/Joaconz/Biyu/issues/201) · Pendiente

- **Objetivo:** Como usuario, quiero exportar a CSV mis transacciones de un mes o de un año, para
  tener mis datos afuera de la app.

- **Pantallas y campos:**
  - Pantalla **Movimientos** (`/transactions?period=AAAA-MM`). En el encabezado, junto al selector
    de mes, se agrega el botón **"Exportar"**, con ícono de descarga. La pantalla no cambia en lo
    demás. Composición según ADR-023: sin sombras, hoja de papel con filetes y el toast de la app.
  - El período a exportar es el mes que muestra el selector de mes de la pantalla
    (`transactions-period`, atributo `data-period`), que sale del `?period` de la URL (C11). Sin
    `?period`, o con uno inválido (ej.: `?period=2026-13`), la pantalla ya usa el mes actual y el
    export también. No hay un selector de período aparte.
  - **Ojo: Movimientos y el export no listan lo mismo.** Movimientos muestra las imputaciones del
    mes, incluidas las cuotas de compras anteriores. El export lista las transacciones con
    **fecha** en el período. Un mes que solo tiene cuotas de compras de meses anteriores muestra
    filas en Movimientos y da un export vacío.
  - **El período se fija al abrir la hoja.** Si mientras la hoja está abierta cambia la URL (Atrás o
    Adelante del navegador, o se sale de la pantalla), la hoja se cierra. Si estaba exportando, la
    exportación se cancela y no se descarga nada.
  - Tocar "Exportar" abre la hoja **"Exportar movimientos"**, con:
    - Dos opciones excluyentes (radio), y la primera viene elegida:
      - **"Solo <mes año>"**, por ejemplo "Solo septiembre 2026": el mes del `?period`.
      - **"Todo <año>"**, por ejemplo "Todo 2026": el año calendario completo de ese mes, de enero a
        diciembre.
    - El texto fijo "Se exportan los movimientos activos con fecha en ese período. Las cuotas de
      compras anteriores no se incluyen."
    - El botón **"Descargar CSV"** y el botón **"Cancelar"**. "Cancelar", Escape o tocar fuera de la
      hoja la cierran sin exportar.
  - **Solo el mes actual o meses pasados.** Si el `?period` es posterior al mes actual (Movimientos
    permite navegar a meses futuros, FR-21), el botón "Exportar" está deshabilitado. Debajo del
    encabezado se ve: "Solo podés exportar el mes actual o meses anteriores." El mes actual se
    calcula igual que en el resto de la app: `currentPeriod(today)` (`src/domain/period.ts`), con
    la fecha y la zona horaria del dispositivo, evaluado al mostrar la pantalla. Si el mes cambia
    con la pantalla abierta, el botón se actualiza recién al recargarla o al cambiar de mes.
  - El filtro "Activos / Eliminados" de la pantalla no cambia lo que se exporta: siempre se
    exportan solo las activas.

- **Qué se exporta:**
  - Las transacciones **activas** (`deleted_at` nulo) del usuario con sesión iniciada cuya `fecha`
    (`occurred_on`) cae en el período elegido: el mes completo, o del 1 de enero al 31 de diciembre
    del año. Nada de otros usuarios (RLS, C7).
  - **Las eliminadas no se exportan**, igual que no cuentan en ningún total de la app (C10, I10). Si
    una transacción eliminada se restauró desde "Eliminados", vuelve a estar activa y se exporta.
  - **Una fila por transacción**, nunca una por cuota. Una compra de $120.000 en 12 cuotas del 15
    de agosto sale una sola vez, en el export de agosto (o del año), con `monto = 120000.00` y
    `cuotas = 12`. **No** aparece en el export de septiembre aunque tenga una cuota imputada a
    septiembre (glosario: Transacción vs. Imputación).
  - Las transacciones de una cuenta **eliminada** (ADR-026) ya no existen y no salen. Las de una
    categoría o cuenta **archivada** sí salen, con el nombre de la categoría o la cuenta.
  - Los nombres de categoría y cuenta son los **actuales**: si una categoría se renombró, sus
    transacciones salen con el nombre nuevo. Si una categoría archivada y una activa tienen el
    mismo nombre, en el archivo no se distinguen. Se acepta así: el `id` de la transacción sigue
    siendo único.
  - No se exportan deudas, suscripciones, categorías, cuentas ni tipos de cambio de referencia.

- **Formato del archivo** (ADR-029):

  | Aspecto | Valor exacto |
  |---|---|
  | Nombre | Mes: `biyu-movimientos-AAAA-MM.csv` (ej.: `biyu-movimientos-2026-09.csv`). Año: `biyu-movimientos-AAAA.csv` (ej.: `biyu-movimientos-2026.csv`) |
  | Codificación | UTF-8 **con BOM** (los primeros 3 bytes son `EF BB BF`) |
  | Separador | Coma `,` |
  | Fin de línea | CRLF (`\r\n`) al final de cada fila, incluida la última |
  | Encabezado | Una fila, exactamente: `fecha,tipo,monto,moneda,tipo_de_cambio,monto_ars,categoria,cuenta,cuotas,primer_periodo,descripcion,id` |
  | Comillas | Un campo va entre comillas dobles solo si contiene `,`, `"`, CR o LF. Las comillas internas se duplican (`"` → `""`). Ningún otro campo lleva comillas |
  | Orden de las filas | `fecha` (`occurred_on`) ascendente; si empatan, `created_at` ascendente; si también empatan, `id` ascendente (orden de texto del UUID en minúsculas) |
  | Cantidad de filas | 1 de encabezado y 1 por transacción. Sin filas en blanco ni de totales |

  Columnas, en este orden:

  | # | Columna | Origen | Formato | Ejemplo |
  |---|---|---|---|---|
  | 1 | `fecha` | `occurred_on` | `AAAA-MM-DD` | `2026-08-15` |
  | 2 | `tipo` | `type` | `gasto` o `ingreso` | `gasto` |
  | 3 | `monto` | `amount` | String decimal con `.` y exactamente 2 decimales, sin separador de miles, sin símbolo y sin signo (C2) | `120000.00` |
  | 4 | `moneda` | `currency` | `ARS` o `USD` | `USD` |
  | 5 | `tipo_de_cambio` | `fx_rate` | String decimal con `.` y exactamente 4 decimales. **Vacío** si la moneda es ARS | `1250.5000` |
  | 6 | `monto_ars` | `amount_ars` | Igual que `monto`. Es el valor congelado en la transacción (C5) y no se recalcula al exportar | `375150.00` |
  | 7 | `categoria` | `categories.name` | Texto. **Vacío** si la transacción no tiene categoría (ingreso sin categoría) | `Supermercado` |
  | 8 | `cuenta` | `accounts.name` | Texto | `Visa BBVA` |
  | 9 | `cuotas` | `installments_count` | Entero de 1 a 12, sin decimales | `3` |
  | 10 | `primer_periodo` | `first_period` | `AAAA-MM`: los primeros 7 caracteres de `first_period` (que se guarda como el día 1 del mes, `2026-08-01`). No se recalcula desde `fecha` | `2026-08` |
  | 11 | `descripcion` | `description` | Texto tal cual se guardó. **Vacío** si no tiene | `Heladera, 3 cuotas` |
  | 12 | `id` | `id` | UUID de la transacción, en minúsculas | 36 caracteres |

  - **Montos (C2, ADR-013):** `monto`, `monto_ars` y `tipo_de_cambio` se leen de la base como texto
    (`amount::text`, `amount_ars::text`, `fx_rate::text`) y se escriben sin convertirlos a `number`.
    Sin ese cast, PostgREST devuelve `numeric` como número JSON y `1500.00` llega como `1500`
    (`src/lib/fxRates.ts`). Si un valor leído no cumple `^\d+\.\d{2}$` (montos) o `^\d+\.\d{4}$` (tipo
    de cambio), la exportación pasa al estado Error. `1234.5` y `1500` no son válidos: van
    `1234.50` y `1500.00`. Los gastos no llevan signo negativo; el sentido lo da `tipo` (glosario:
    Tipo).
  - **Neutralización de fórmulas:** si `categoria`, `cuenta` o `descripcion` empiezan con `=`, `+`,
    `-`, `@`, tabulación (`\t`) o retorno de carro (`\r`), se les agrega un apóstrofo `'` adelante.
    **Primero se neutraliza y después se entrecomilla**. Ejemplos de valor guardado → bytes en el
    archivo:
    - `=1+1` → `'=1+1`
    - `-5, promo` → `"'-5, promo"` (lleva apóstrofo por el `-` y comillas por la coma)
    - `\tcafé` → `'\tcafé` (sin comillas: la tabulación no obliga a entrecomillar)
    - `\rnota` → `"'\rnota"` (el CR obliga a entrecomillar)

    No se agrega, quita ni recorta ningún otro carácter. Los espacios al principio y al final se
    conservan.

  Ejemplo con montos ficticios: export "Solo agosto 2026", sin el BOM y con los UUID acortados.

  ```text
  fecha,tipo,monto,moneda,tipo_de_cambio,monto_ars,categoria,cuenta,cuotas,primer_periodo,descripcion,id
  2026-08-01,ingreso,850000.00,ARS,,850000.00,,Caja de ahorro,1,2026-08,Sueldo agosto,0b6e…
  2026-08-15,gasto,300.00,USD,1250.5000,375150.00,Hogar,Visa BBVA,3,2026-08,"Heladera, 3 cuotas",3f1c…
  2026-08-20,gasto,4500.00,ARS,,4500.00,Salidas,Efectivo,1,2026-08,"Pizza ""a la piedra""",9a42…
  2026-08-28,gasto,12000.00,ARS,,12000.00,Supermercado,Débito Galicia,1,2026-08,"'-5, promo",c7d8…
  ```

- **Completitud:** Supabase devuelve como máximo 1.000 filas por lectura, y un año puede tener
  más, así que la exportación lee en varias páginas. Al empezar obtiene el total de transacciones
  que corresponden al período. Si al terminar la cantidad de filas leídas no es igual a ese total
  (por ejemplo, porque mientras exportaba se cargó o se eliminó una transacción en otra pestaña),
  pasa al estado Error y no descarga nada. Nunca se descarga un archivo con filas de menos ni
  repetidas.

- **Estados:**

  | Estado | Cuándo | Qué se ve |
  |---|---|---|
  | Inicial | Al abrir la hoja | "Solo <mes año>" elegido; "Descargar CSV" y "Cancelar" habilitados |
  | Exportando | Desde que se toca "Descargar CSV" hasta que la app dispara la descarga o pasa a Vacío o Error | "Descargar CSV" queda deshabilitado, con `aria-busy="true"` y el texto "Exportando…". Las opciones y "Cancelar" también quedan deshabilitados, y la hoja no se cierra con Escape ni tocando fuera. Un segundo toque no inicia otra exportación |
  | Éxito | Hay al menos una transacción activa en el período y se leyeron todas | La app dispara la descarga, la hoja se cierra y aparece el aviso "Exportamos N movimientos". N es la cantidad de filas de datos del archivo, con punto de miles desde 1.000 (`1.500`). Si N es 1, dice "Exportamos 1 movimiento" |
  | Vacío | No hay ninguna transacción activa en el período elegido | **No** se descarga ningún archivo. La hoja sigue abierta y debajo de las opciones dice "No tenés movimientos con fecha en <mes año>." o "No tenés movimientos con fecha en <año>.", según la opción elegida. Las opciones, "Descargar CSV", "Cancelar", Escape y tocar fuera vuelven a funcionar |
  | Error | Falla cualquiera de las lecturas (sin conexión o error del servidor), un monto no cumple el formato o el total no coincide (ver "Completitud") | **No** se descarga ningún archivo, ni uno parcial. La hoja sigue abierta y debajo de las opciones, con `role="alert"`, dice "No pudimos exportar tus movimientos. Probá de nuevo." Las opciones, "Descargar CSV", "Cancelar", Escape y tocar fuera vuelven a funcionar; "Descargar CSV" sirve para reintentar |

  El mensaje de vacío o de error desaparece al cambiar de opción o al volver a tocar "Descargar
  CSV". Al cerrar y reabrir la hoja, vuelve al estado Inicial.

  **Nombre que se verifica:** el que propone la app (atributo `download` del enlace, o el que
  muestra el diálogo de Safari). Si en la carpeta ya existe un archivo con ese nombre y el navegador
  le agrega un sufijo (`biyu-movimientos-2026-09 (1).csv`), el sufijo no cuenta.

  **Qué es "descargar" en cada navegador** (NFR-04): en Chrome o Edge de escritorio y en Chrome de
  Android, el archivo queda en la carpeta de descargas con el nombre indicado en la fila "Nombre"
  del formato. En Safari de iOS, Safari pregunta si se quiere descargar el archivo, que queda en
  Archivos > Descargas con el mismo nombre.

- **`data-testid`:**

  | Elemento | `data-testid` |
  |---|---|
  | Botón "Exportar" del encabezado | `transactions-export` |
  | Aviso "Solo podés exportar el mes actual o meses anteriores." | `transactions-export-future` |
  | Hoja "Exportar movimientos" | `transactions-export-dialog` |
  | Opción "Solo <mes año>" | `transactions-export-scope-month` |
  | Opción "Todo <año>" | `transactions-export-scope-year` |
  | Botón "Descargar CSV" (también en estado "Exportando…") | `transactions-export-submit` |
  | Botón "Cancelar" | `transactions-export-cancel` |
  | Mensaje de vacío | `transactions-export-empty` |
  | Mensaje de error | `transactions-export-error` |
  | Aviso de éxito (toast) | `transactions-export-success` |

- **Criterios de aceptación:**

  _La verificación del contenido se hace sobre el archivo abierto como texto o en un visor
  hexadecimal, no sobre cómo lo muestra una planilla._

  - CA-1: En `/transactions` hay un botón "Exportar" (`transactions-export`) en el encabezado.
    Tocarlo abre la hoja "Exportar movimientos" (`transactions-export-dialog`) con "Solo <mes año>"
    elegido, donde <mes año> es el mes que muestra el selector (ej.: con `?period=2026-09`, "Solo
    septiembre 2026" y "Todo 2026"). Sin `?period` en la URL, las opciones son las del mes actual.
  - CA-2: Con el `?period` posterior al mes actual, el botón "Exportar" está deshabilitado y se ve
    "Solo podés exportar el mes actual o meses anteriores." (`transactions-export-future`). Con el
    mes actual o uno anterior, está habilitado y ese aviso no se ve.
  - CA-3: Con "Solo <mes año>" y al menos una transacción activa en ese mes, "Descargar CSV"
    descarga un archivo cuyo nombre propuesto es `biyu-movimientos-AAAA-MM.csv`, con el `AAAA-MM`
    del mes elegido.
  - CA-4: Con "Todo <año>" y al menos una transacción activa en ese año, "Descargar CSV" descarga
    un archivo cuyo nombre propuesto es `biyu-movimientos-AAAA.csv`, con el año del mes elegido.
  - CA-5: El export de un mes contiene exactamente las transacciones activas con `fecha` entre el
    día 1 y el último día de ese mes, incluidos los dos extremos (ej.: `2026-09-01` y `2026-09-30`
    sí; `2026-08-31` y `2026-10-01` no). El de un año, exactamente las de `AAAA-01-01` a
    `AAAA-12-31`, incluidos los dos extremos.
  - CA-6: Una transacción eliminada no aparece en el archivo. Si después se restaura, aparece en el
    siguiente export de su período.
  - CA-7: El filtro "Activos / Eliminados" de la pantalla no cambia el archivo: exportar el mismo
    período desde "Eliminados" y desde "Activos" da dos archivos con el mismo contenido, byte a
    byte.
  - CA-8: El archivo empieza con los bytes `EF BB BF`, cada fila termina en CRLF (incluida la
    última) y la primera fila es exactamente
    `fecha,tipo,monto,moneda,tipo_de_cambio,monto_ars,categoria,cuenta,cuotas,primer_periodo,descripcion,id`.
  - CA-9: Una transacción en N cuotas (N de 2 a 12) sale en una sola fila, en el export del mes de
    su `fecha`, con `monto` igual al total de la compra, `cuotas = N` y `primer_periodo` igual a
    los primeros 7 caracteres de su `first_period`. No aparece en el export de los meses siguientes
    en los que tiene cuotas.
  - CA-10: `monto` y `monto_ars` tienen exactamente 2 decimales con `.`, sin separador de miles,
    símbolo ni signo: un monto guardado de 1500 sale `1500.00`, no `1.500,00`, `1500` ni
    `-1500.00`. `tipo_de_cambio` tiene exactamente 4 decimales en las transacciones en USD
    (`1250.5000`) y está vacío en las de ARS.
  - CA-11: Para una transacción en USD, `monto_ars` es igual a `transactions.amount_ars` leído como
    texto, y no cambia si después se edita el tipo de cambio de referencia de su mes (C5).
  - CA-12: Una descripción que contiene una coma, comillas dobles o un salto de línea sale entre
    comillas dobles, con las comillas internas duplicadas. Ej.: `Pizza "a la piedra"` sale como
    `"Pizza ""a la piedra"""`. Un lector CSV que cumple RFC 4180 (por ejemplo, Google Sheets con
    Archivo > Importar > Subir y separador "Coma") lee 12 columnas en esa fila.
  - CA-13: Una `categoria`, `cuenta` o `descripcion` que empieza con `=`, `+`, `-`, `@`,
    tabulación o retorno de carro sale con `'` adelante y el resto igual, primero neutralizada y
    después entrecomillada, con los bytes de los cuatro ejemplos de "Neutralización de fórmulas".
  - CA-14: Las filas están ordenadas por `fecha` ascendente, después por `created_at` ascendente y
    después por `id` ascendente.
  - CA-15: Con exactamente 1.000, 1.500 y 2.000 transacciones activas en un mismo año, el export de
    ese año tiene 1.000, 1.500 y 2.000 filas de datos, sin repetidas (todos los `id` son distintos),
    y el aviso dice "Exportamos 1.000 movimientos", "Exportamos 1.500 movimientos" y "Exportamos
    2.000 movimientos".
  - CA-16: El archivo de un usuario no contiene ninguna transacción de otro usuario del mismo
    período (C7).
  - CA-17: Una transacción con una categoría o una cuenta archivadas sale con el nombre actual de
    esa categoría o cuenta. Un ingreso sin categoría sale con `categoria` vacío.
  - CA-18: Mientras exporta, "Descargar CSV" muestra "Exportando…", está deshabilitado y tiene
    `aria-busy="true"`. Las opciones y "Cancelar" están deshabilitados y la hoja no se cierra. Un
    segundo toque durante la exportación no descarga un segundo archivo.
  - CA-19: Al terminar con éxito, la hoja se cierra y aparece el aviso (`transactions-export-success`)
    "Exportamos N movimientos", con N igual a la cantidad de filas de datos del archivo. Con una
    sola transacción dice "Exportamos 1 movimiento".
  - CA-20: Sin transacciones activas en el período elegido (aunque haya eliminadas), "Descargar CSV"
    no descarga ningún archivo y muestra "No tenés movimientos con fecha en septiembre 2026." con
    "Solo septiembre 2026", o "No tenés movimientos con fecha en 2026." con "Todo 2026"
    (`transactions-export-empty`). Después, "Cancelar" cierra la hoja y las opciones se pueden
    cambiar.
  - CA-21: Con un mes que solo tiene cuotas de compras de meses anteriores (ej.: septiembre con la
    cuota 2/3 de una compra del 15 de agosto), Movimientos muestra esa cuota y "Solo septiembre
    2026" da el estado Vacío.
  - CA-22: Sin conexión (DevTools > Network > Offline), "Descargar CSV" no descarga ningún archivo y
    muestra "No pudimos exportar tus movimientos. Probá de nuevo." (`transactions-export-error`,
    `role="alert"`). Con la conexión restablecida, tocar "Descargar CSV" de nuevo descarga el
    archivo completo y el mensaje de error desaparece. Con el error visible, "Cancelar" cierra la
    hoja.
  - CA-23: "Cancelar" (`transactions-export-cancel`), Escape o tocar fuera de la hoja la cierran
    sin descargar nada, y la URL no cambia.
  - CA-24: Con la hoja abierta, el botón Atrás del navegador la cierra. Si estaba en
    "Exportando…", no se descarga ningún archivo.
  - CA-25: Exportar no modifica ningún dato: después de exportar, el Resumen y Movimientos del
    mismo período muestran los mismos valores que antes, y el `?period` de la URL no cambia.

- **Fuera de alcance (V2):**
  - Un rango de fechas libre (FR-22): se exporta un mes o un año calendario completo (ADR-029).
  - Exportar meses futuros, aunque tengan cuotas comprometidas.
  - Exportar transacciones eliminadas.
  - Exportar deudas, suscripciones, categorías o cuentas.
  - Una fila por cuota o un export por imputación del mes.
  - Formato "Excel argentino" (`;` como separador y `,` decimal). Abierto con doble clic en Excel
    con configuración regional de Argentina, el archivo queda en una columna; se importa con
    "Datos > Desde texto/CSV".
  - XLSX.
  - Un tiempo límite o un umbral de rendimiento propio: si una lectura queda colgada, sigue en
    "Exportando…" hasta que el navegador corte el pedido. Los NFR de rendimiento de V2 son otro
    frente.
  - Qué pasa si la sesión termina en medio de la exportación: lo maneja el guard de rutas (US-48).

- **Notas para quien implemente** (no agregan requisitos):
  - Las lecturas van por el SDK bajo RLS, con `deleted_at is null`, el filtro de `occurred_on` del
    período y los montos casteados a `::text`.
  - Conviene paginar con cursor sobre `(occurred_on, created_at, id)` en lugar de `offset`, y pedir
    `count: 'exact'` en la primera página para el control de "Completitud".
  - El armado del texto, el rango de fechas y el nombre del archivo son funciones puras en
    `src/domain/` que reciben las filas, el período y `today` (C1).
  - No hace falta ninguna migración (ADR-029).

- **Mock:** [`entrega-2/mocks/export-csv.html`](../mocks/export-csv.html). Muestra Movimientos
  con el botón nuevo, la hoja en sus estados, el mes futuro y el archivo de ejemplo.

- **Trazabilidad:** FR-22 (con período de mes o año y sin la columna de estado, ADR-029) · C9 · C1 ·
  C2 · C5 · C7 · C10 · C11 · I10 · FR-21 · NFR-04 · ADR-013 · ADR-023 · ADR-026 · ADR-029 · Épica
  [#19](https://github.com/Joaconz/Biyu/issues/19)

- **Casos de prueba:** _los diseña Testing a partir de esta historia._
