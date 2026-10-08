# Proyecto Biyu – Entrega 2 · Importar gastos desde Excel: US-74, US-76, US-77, US-78, US-80 y US-81 (V2)

**Testing de Aplicaciones · Proyecto Integrador** · Versión del documento: 2026-10-06 · Alcance de
V2, nivel 3 (`entrega-2/README.md`). Mismo formato que `entrega-1/01-historias-de-usuario.md`; estas
historias llevan además el detalle de pantalla, archivo y validaciones que pide la Entrega 2.

Archivo de ejemplo (datos ficticios, C14):
[`entrega-2/mocks/importar-excel-ejemplo.xlsx`](../mocks/importar-excel-ejemplo.xlsx),
cuyo contenido es la tabla de la sección 6 · Decisión de escritura:
[ADR-035](../../docs/adr/035-importacion-por-lote-con-una-rpc.md).

**Vocabulario.** "Movimiento" es el rótulo de la UI (la pantalla Movimientos) para una
**Transacción** del glosario (`docs/01-domain-glossary.md`); cada fila importada crea una transacción
con sus imputaciones.

---

## Las historias

La importación se parte en seis historias que se implementan en este orden, porque cada una usa lo
que dejó la anterior. Las reglas de detalle (pantallas, formato del archivo, mensajes, errores) son
una sola especificación, en las secciones 1 a 9 y 12 de más abajo; cada criterio remite a ella. Las
seis cuelgan de la épica [#203](https://github.com/Joaconz/Biyu/issues/203), que reemplaza a la idea del backlog [#169](https://github.com/Joaconz/Biyu/issues/169).

| Historia | Qué entrega | Depende de |
|---|---|---|
| US-74 · Subir un archivo de Excel | Entrar a la pantalla, bajar la plantilla y que el archivo se acepte o se rechace entero | — |
| US-76 · Revisar las filas antes de importar | Leer cada fila, marcar los errores con su mensaje y resumir lo que se va a importar, sin escribir nada | US-74 |
| US-77 · Importar las filas válidas y ver el resultado | Crear las filas válidas con `create_transaction`, tolerar rechazos y resumir al terminar | US-76 |
| US-78 · Reintentar una importación sin duplicar | Responder a errores de red y de la base, reintentar sin duplicar y no perder el estado al salir | US-77 |
| US-80 · Importar una compra en cuotas ya empezada | Columna "Cuotas pendientes": solo se imputan las cuotas que faltan, desde el mes de hoy (ADR-039) | US-77 |
| US-81 · Guía para armar el archivo de importación | Botón que abre un diálogo con la guía; cerrada por defecto y opcional | US-74, US-80 |

#### US-74: Subir un archivo de Excel · [#204](https://github.com/Joaconz/Biyu/issues/204) · Pendiente

- **Objetivo:** Como usuario que ya anota sus gastos en una planilla de Excel, quiero subir ese archivo
  a la app, para no cargar de a uno en Registrar lo que ya tengo escrito.
- **Pantallas y campos:** botón "Importar desde Excel" en **Registrar**, pantalla **Importar desde
  Excel** (`/import`), paso 1 (secciones 1 y 2), con la plantilla descargable.
- **Criterios de aceptación:**
  - CA-1: En Registrar existe el botón "Importar desde Excel", visible en los tres pasos del registro, y
    lleva a `/import` en el paso 1. Sin sesión, `/import` redirige a `/login?next=/import`.
  - CA-2: "Descargar plantilla" baja `biyu-plantilla-importacion.xlsx` cuya primera hoja tiene en la fila
    1, de A a I, exactamente: Fecha, Tipo, Monto, Moneda, Tipo de cambio, Categoría, Cuenta, Cuotas,
    Nota, y ninguna fila más con datos. Subir esa plantilla sin cambios muestra el mensaje A6. **Modificado
    por US-80 (ADR-039):** la plantilla pasa a tener 10 columnas, de A a J, con "Cuotas pendientes"
    después de "Cuotas".
  - CA-3: Cada regla A1 a A7 de la sección 3 muestra su mensaje exacto, la pantalla queda en el paso 1 y
    no se crea ninguna transacción.
  - CA-4: Un archivo de exactamente 500 filas con datos pasa al paso 2; uno de 501 muestra A7 con
    "501". Un archivo de 1.048.576 bytes pasa la regla A2; uno de 1.048.577 bytes muestra A2.
  - CA-5: Solo se lee la primera hoja: un libro cuya hoja 2 tiene filas válidas y cuya hoja 1 solo tiene
    encabezados muestra A6.
  - CA-6: Los encabezados se reconocen sin distinguir mayúsculas ni tildes, en cualquier orden: un
    archivo con " CATEGORIA ", "monto", "FECHA"… en otro orden se lee igual que la plantilla. Un
    encabezado desconocido ("Comercio") no impide la lectura y aparece en "Se ignoraron las columnas:
    Comercio."
  - CA-7: Un archivo en ARS sin las columnas "Tipo de cambio", "Cuotas" ni "Nota" pasa al paso 2 y sus
    filas válidas quedan "Lista". Un archivo sin "Categoría" pasa al paso 2 y cada gasto muestra F14a.
  - CA-8: Todo elemento interactivo de esta historia lleva el `data-testid` de la sección 12.
- **Trazabilidad:** sección 11 · C11 · C14
- **Casos de prueba:** a diseñar (módulo Importación, `docs/07-plan-de-testing.md` §1)

#### US-76: Revisar las filas antes de importar · [#205](https://github.com/Joaconz/Biyu/issues/205) · Pendiente

- **Objetivo:** Como usuario, quiero ver, antes de importar, qué filas de mi archivo están bien y cuáles
  tienen un error y por qué, para corregir la planilla sin haber guardado nada.
- **Pantallas y campos:** paso 2 de **Importar desde Excel** (sección 1), con el resumen, el filtro y una
  tarjeta por fila; validación de las secciones 2 y 4.
- **Criterios de aceptación:**
  - CA-1: Las filas vacías se saltean, no cuentan en T ni en el límite de 500 y no se renumeran: con el
    archivo de ejemplo, el paso 2 muestra "11 filas leídas · 7 listas para importar · 4 con error" y
    ninguna tarjeta "Fila 12".
  - CA-2: Cada regla F1 a F18 de la sección 4, aplicada a una fila que no tiene ningún otro error, marca
    la fila "Con error" y muestra su mensaje exacto.
  - CA-3: Una fila con errores en varias columnas muestra un mensaje por columna, en el orden de la
    tabla de la sección 4: Fecha "31/02/2026", Monto "0" y Cuenta "Banco X" muestran "Fecha inválida:
    usá DD/MM/AAAA", "El monto debe ser mayor a cero" y "No existe la cuenta «Banco X» o está
    archivada", en ese orden.
  - CA-4: Las reglas dependientes respetan la tabla de dependencias de la sección 4: Moneda "EUR" con
    Tipo de cambio "1450" muestra solo "Moneda inválida: escribí ARS o USD"; Tipo "Gastos" con
    Categoría vacía muestra solo "Tipo inválido: escribí Gasto o Ingreso"; Cuenta "Banco X" con 3 cuotas
    muestra solo el mensaje de la cuenta.
  - CA-5: Categoría y Cuenta se comparan sin distinguir mayúsculas, ignorando espacios al principio y al
    final, y distinguiendo tildes: con el usuario sembrado, "  efectivo " encuentra la cuenta "Efectivo"
    y "Educacion" da F14b. Tipo " gasto " y Moneda "usd" se aceptan. Una categoría o cuenta archivada da
    F14b o F14d aunque el nombre coincida.
  - CA-6: Una fecha de hoy es "Lista" y una de mañana da F3, con "hoy" según la hora de Argentina
    (ADR-021). Una celda de fecha con hora (05/09/2026 18:30) se lee como 05/09/2026. Una celda numérica
    sin formato de fecha (46000) da F2.
  - CA-7: El texto "1.500" en Monto se lee como 1500 (se muestra "$1.500,00"), y "1234.56" como 1234,56.
    Una celda con la fórmula `=0,1*3` se lee como 0,3 (se muestra "$0,30") y queda "Lista"; una con
    `=100/3` da F9.
  - CA-8: En el paso 2, "Vas a importar…" coincide con la suma de la sección 6: con el archivo de
    ejemplo, "Vas a importar 7 movimientos: $324.915,50 en gastos y $850.000,00 en ingresos (en pesos)."
  - CA-9: "Ver solo filas con error" arranca apagado; prendido, con el archivo de ejemplo la lista muestra
    solo las tarjetas de las filas 7, 8, 9 y 10. Con un archivo sin errores está deshabilitado.
  - CA-10: El paso 2 no escribe nada: llegar al paso 2 y tocar "Elegir otro archivo" deja la misma
    cantidad de transacciones que había antes de subir el archivo. Recargar en el paso 2 vuelve al paso 1
    sin archivo.
  - CA-11: Con 0 filas "Lista", "Importar 0 movimientos" está deshabilitado y se ve "No hay filas
    listas para importar". Con 1 fila "Lista", el botón dice "Importar 1 movimiento".
  - CA-12: Todo elemento interactivo de esta historia lleva el `data-testid` de la sección 12.
- **Trazabilidad:** sección 11 · C1 · C2 · C6 · I4 · I5 · I6 · I8 · FR-06
- **Casos de prueba:** a diseñar

#### US-77: Importar las filas válidas y ver el resultado · [#206](https://github.com/Joaconz/Biyu/issues/206) · Pendiente

- **Objetivo:** Como usuario, quiero que al confirmar se creen las filas válidas aunque otras tengan
  error, y ver cuántas entraron y cuáles no, para no perder el trabajo por una fila mala.
- **Pantallas y campos:** botón "Importar N movimientos" del paso 2 y paso 3 **Resultado** (sección 1);
  RPC `import_transactions` (ADR-035) y sus reglas (sección 5).
- **Criterios de aceptación:**
  - CA-1: Al confirmar se crean exactamente las N filas "Lista", ninguna de las M con error, y cada una
    con los datos de su fila: tipo, monto, moneda, tipo de cambio, categoría, cuenta, cuotas, fecha y
    nota (una Nota vacía queda sin descripción).
  - CA-2: Cada fila importada pasa por `create_transaction` (C4): la fila 3 del archivo de ejemplo genera
    6 imputaciones de $40.000,00, de 2026-09 a 2027-02, que suman $240.000,00 (I1, I1', I2, I3).
  - CA-3: Con el archivo de ejemplo y el usuario sembrado, el paso 3 muestra exactamente el resultado de
    la sección 6, y "Ver en Movimientos" lleva a `/transactions?period=2026-09`.
  - CA-4: Si la base rechaza una fila que el paso 2 dio por "Lista", las demás se importan igual y esa
    fila aparece en el resultado con el mensaje de la tabla de la sección 5. Con el archivo de ejemplo y
    el usuario sembrado: archivar "Transporte" después de llegar al paso 2 y antes de confirmar da "Se
    importaron 6 de 11 filas." y la línea "Fila 6: No existe la categoría «Transporte» o está
    archivada".
  - CA-5: Importar no cambia la cuenta que Registrar trae precargada (US-07).
  - CA-6: Con 500 filas "Lista" de 12 cuotas cada una, el paso 3 aparece en menos de 10 segundos desde
    que se toca "Importar 500 movimientos", en el deploy de Vercel contra Supabase hosteado, y muestra
    "Se importaron 500 de 500 filas."
  - CA-7: La base revalida cada fila aunque el cliente no lo haga (C6). Llamando a `import_transactions`
    directo por la API con cuatro filas, una válida y tres inválidas (monto `"0"`, sin `account_id`,
    monto `"abc"`): la válida se crea, las otras tres vuelven con `status: "rejected"` y no dejan
    transacción ni imputaciones.
  - CA-8: La base rechaza el lote entero, sin crear nada, si `p_rows` tiene 0 o 501 elementos.
  - CA-9: Sin sesión (rol `anon`) `import_transactions` da `permission denied` (42501), y otro usuario no
    ve las transacciones importadas ni el registro de la importación (cero filas, C7).
  - CA-10: Todo elemento interactivo de esta historia lleva el `data-testid` de la sección 12.
- **Trazabilidad:** sección 11 · C4 · C6 · C7 · ADR-005 · ADR-035 · I1 · I1' · I2 · I3
- **Casos de prueba:** a diseñar

#### US-78: Reintentar una importación sin duplicar · [#207](https://github.com/Joaconz/Biyu/issues/207) · Pendiente

- **Objetivo:** Como usuario, quiero que si se corta la conexión mientras importo pueda reintentar sin
  que se dupliquen los movimientos, para no tener que revisar a mano qué entró.
- **Pantallas y campos:** botón "Importando…" y "Reintentar", mensajes de error de toda la importación
  (sección 7) y diálogo de salida (sección 8).
- **Criterios de aceptación:**
  - CA-1: La importación es una sola llamada y el botón queda en "Importando…" deshabilitado hasta la
    respuesta: dos toques rápidos sobre "Importar N movimientos" crean N transacciones, no 2N (NFR-10).
  - CA-2: Reintentar no duplica (sección 7, ADR-035): si la primera llamada se guardó, "Reintentar"
    muestra "Esta importación ya se había guardado." y la cantidad de transacciones no cambia; si no se
    guardó, "Reintentar" importa las N filas una sola vez. Por API: llamar dos veces a
    `import_transactions` con el mismo `p_import_id` crea las filas una vez y la segunda respuesta trae
    `already_imported: true`.
  - CA-3: Cada error de toda la importación de la sección 7 muestra su mensaje exacto y no deja ninguna
    transacción creada (salvo el caso sin respuesta, que se resuelve con CA-2).
  - CA-4: Salir con una importación pendiente pide confirmación (sección 8): "Quedarme" deja la pantalla
    como estaba y "Salir igual" navega al destino tocado.
  - CA-5: Todo elemento interactivo de esta historia lleva el `data-testid` de la sección 12.
- **Trazabilidad:** sección 11 · NFR-10 · ADR-035
- **Casos de prueba:** a diseñar

#### US-80: Importar una compra en cuotas ya empezada · [#268](https://github.com/Joaconz/Biyu/issues/268) · Pendiente

- **Objetivo:** Como usuario que empieza a usar Biyu con compras en cuotas a medio pagar, quiero
  importarlas indicando cuántas cuotas me faltan, para ver en cada mes solo lo que todavía tengo que
  pagar.
- **Depende de:** US-77 (la RPC `import_transactions`). Decisión de modelo:
  [ADR-039](../../docs/adr/039-compra-en-cuotas-empezada.md).
- **Notación de los ejemplos.** H es el mes de hoy en Argentina (ADR-021) cuando se ejecuta el caso;
  H−4 es cuatro meses antes, H+1 el mes siguiente. "Una fecha de H−4" es cualquier día de ese mes (una fecha de H, cualquier día hasta hoy). Los
  criterios no dependen del día de hoy, salvo los marcados como prueba de dominio, que fijan "hoy".
- **Pantallas y campos:** plantilla y pasos 2 y 3 de **Importar desde Excel**. Agrega una columna
  opcional a la sección 2, con las mismas reglas de encabezado que las demás (sin distinguir
  mayúsculas ni tildes, en cualquier orden; repetida da A5):

  | Encabezado | Celda obligatoria | Qué va | Formatos aceptados |
  |---|---|---|---|
  | Cuotas pendientes | No. Vacía = la compra se imputa desde el mes de su fecha, como hasta ahora | Cuántas cuotas faltan pagar, contando la del mes de hoy | Entero, celda numérica o texto |

  - Sin la columna, todas las filas se tratan como vacías en "Cuotas pendientes".
  - La columna cuenta para decidir si una fila está vacía (sección 2): una fila con solo "Cuotas
    pendientes" no se saltea y da los errores de las celdas obligatorias.
- **Qué se crea** (ADR-039). Con N = Cuotas, P = Cuotas pendientes y K = N − P (cuotas ya pagadas):
  - El calendario de N cuotas se calcula sobre el **Monto** de la fila, que es el total de la compra,
    con la regla de siempre: cuota base truncada a 2 decimales y la última absorbe el resto (C3).
  - Se guardan solo las últimas P cuotas, numeradas de K + 1 a N, una por mes **desde el mes de
    hoy**. Vale también con P = N (K = 0): ninguna pagada, pero las N cuotas se imputan desde el mes
    de hoy y no desde el mes de la fecha.
  - El monto del movimiento es lo que falta pagar: la suma de esas P cuotas.
  - En USD, el equivalente en pesos del movimiento es lo que falta pagar × tipo de cambio, redondeado
    half-up a 2 decimales (ADR-013). Ese equivalente se reparte entre las P cuotas con la regla de
    siempre: base truncada y la última absorbe el resto (I1').
  - La fecha del movimiento sigue siendo la Fecha de la fila, es decir, la de la compra.
  - Cada fila de `p_rows` de `import_transactions` (ADR-035) lleva la clave `installments_paid` (K)
    solo si la celda "Cuotas pendientes" tiene valor. Si la clave falta o es `null`, la fila es una
    compra normal. Pasa a `create_transaction` como `p_installments_paid`, y la base revalida K (C6).
- **Reglas nuevas de la sección 4**, después de F18, con mensajes exactos:

  | # | Columna | Regla | Mensaje exacto |
  |---|---|---|---|
  | F19 | Cuotas pendientes | No vacía, y Cuotas vacía o igual a 1 | "Las cuotas pendientes solo van en una compra en cuotas" |
  | F20 | Cuotas pendientes | No es un entero entre 1 y Cuotas | "Las cuotas pendientes van de 1 a <N>" |
  | F21 | Cuotas pendientes | K > (año de hoy × 12 + mes de hoy) − (año de la Fecha × 12 + mes de la Fecha) | "Con esa fecha todavía no puede haber <K> cuotas pagadas" ("1 cuota pagada" si K = 1) |

  Dependencias (como la tabla de la sección 4):
  - F19 se evalúa solo si Cuotas no tuvo error.
  - F20 y F21 se evalúan solo si Tipo, Cuenta y Cuotas no tuvieron error y la fila no tiene F15.
  - F21 necesita además que Fecha no tenga error.
  - A lo sumo un mensaje en la columna: el primero de F19, F20 y F21.
- **Paso 2.** La tarjeta de una fila con Cuotas pendientes cambia "<k> cuotas" por "Faltan <P> de <N>
  cuotas (<lo que falta pagar>)", con el monto en la moneda de la fila y el formato de la sección 1.
  Ejemplos: "Faltan 3 de 6 cuotas ($60.000,00)" y "Faltan 2 de 3 cuotas (US$66,67)". Con P = 1 dice
  "Falta 1 de <N> cuotas (…)". Va en `import-row-<n>-pending`. "Vas a importar…" suma, de esa fila,
  el equivalente en pesos de lo que falta pagar, no el Monto escrito.
- **Paso 3.**
  - El monto importado suma lo mismo que el paso 2.
  - **Modifica la sección 1:** "Ver en Movimientos" lleva al mes más reciente entre el mes de la fecha
    de cada fila creada y, si alguna es una compra empezada, el mes de hoy, que es donde empiezan sus
    cuotas.
- **Plantilla y "Instrucciones".**
  - "Descargar plantilla" baja la hoja 1 con los encabezados de A a J: Fecha, Tipo, Monto, Moneda, Tipo
    de cambio, Categoría, Cuenta, Cuotas, Cuotas pendientes, Nota.
  - La hoja "Instrucciones" agrega la fila de "Cuotas pendientes" con el contenido de la tabla de
    arriba (encabezado, si es obligatoria, qué va y formatos).
  - **Modifica US-74 · CA-2.**
- **Criterios de aceptación.** Usuario sembrado: las categorías y cuentas de US-43 sin cambios.
  - CA-1: La plantilla descargada tiene en la fila 1, de A a J, exactamente: Fecha, Tipo, Monto, Moneda,
    Tipo de cambio, Categoría, Cuenta, Cuotas, Cuotas pendientes, Nota. La hoja "Instrucciones" tiene la
    fila de "Cuotas pendientes" con el texto de la tabla de esta historia.
  - CA-2: Una fila con una fecha de H−4 · Gasto · 120000 · ARS · Otros · Tarjeta de crédito · Cuotas 6 ·
    Cuotas pendientes 3 · "Heladera" queda "Lista" con "Faltan 3 de 6 cuotas ($60.000,00)". Al
    importarla se crea una transacción con:
    - `amount = 60000.00`, `installments_count = 6` e `installments_paid = 3`;
    - `occurred_on` = la fecha de la fila y `first_period` = el día 1 de H;
    - 3 imputaciones de $20.000,00, números 4, 5 y 6, en H, H+1 y H+2.
  - CA-3: En Movimientos, esa compra aparece en H como "4/6", en H+1 como "5/6" y en H+2 como "6/6". No
    aparece de H−4 a H−1 ni en H+3. "Ver en Movimientos" del paso 3 lleva a `?period=` de H.
  - CA-4 (resto): una fecha de H−1 · 100000 · ARS · 3 cuotas · pendientes 2 crea la cuota 2/3 de
    $33.333,33 en H y la 3/3 de $33.333,34 en H+1. El monto del movimiento es $66.666,67.
  - CA-5 (P = N): una fecha de H−1 · 120000 · 6 cuotas · pendientes 6 crea las 6 cuotas de $20.000,00,
    de 1/6 en H a 6/6 en H+5. El monto es $120.000,00 y la transacción queda con
    `installments_paid = 0` y `first_period` = H.
  - CA-6: Con Cuotas pendientes vacía, o con un archivo sin esa columna, la fila se importa igual que en
    US-77: una fecha de H−1 · 240000 · 6 cuotas imputa de H−1 a H+4.
  - CA-7 (F19): Cuotas vacía con pendientes 1, y Cuotas 1 con pendientes 1, muestran "Las cuotas
    pendientes solo van en una compra en cuotas".
  - CA-8 (F20): Con Cuotas 6, las pendientes `0`, `-1`, `7`, `2,5` y `dos` muestran "Las cuotas
    pendientes van de 1 a 6". `1` y `6` son válidas.
  - CA-9 (F21, valores límite): Con Cuotas 6 y pendientes 3 (K = 3):
    - una fecha de H−3 queda "Lista";
    - una fecha de H−2 muestra "Con esa fecha todavía no puede haber 3 cuotas pagadas";
    - una fecha de H con Cuotas 6 y pendientes 5 muestra "Con esa fecha todavía no puede haber 1 cuota
      pagada".
  - CA-10 (dependencias): Cuenta "Efectivo" con Cuotas 3 y pendientes 2 muestra solo "Solo los gastos
    con tarjeta de crédito admiten cuotas". Cuotas `13` con pendientes 2 muestra solo "Las cuotas van de
    1 a 12".
  - CA-11 (USD, sin resto): una fecha de H−2 · US$300 · TC 1000 · 3 cuotas · pendientes 1 muestra
    "Falta 1 de 3 cuotas (US$100,00)". Crea una sola imputación, la 3/3, de US$100,00 y $100.000,00 en
    H. La transacción queda con `amount = 100.00` y `amount_ars = 100000.00`.
  - CA-12 (USD, con resto): una fecha de H−1 · US$100 · TC 1000 · 3 cuotas · pendientes 2 muestra
    "Faltan 2 de 3 cuotas (US$66,67)". Crea la 2/3 de US$33,33 y la 3/3 de US$33,34. Las dos imputaciones
    son de $33.335,00 en pesos y suman el `amount_ars` del movimiento, $66.670,00 (I1, I1'). "Vas a
    importar…" suma $66.670,00 por esta fila.
  - CA-13: Un archivo con solo la fila de CA-2 muestra en el paso 2 "Vas a importar 1 movimiento:
    $60.000,00 en gastos y $0,00 en ingresos (en pesos)." En el paso 3 dice "$60.000,00 en gastos y
    $0,00 en ingresos (en pesos)."
  - CA-14: En el Resumen de H, la compra de CA-2 aporta $20.000,00 a "Cuotas de meses anteriores"
    (`dashboard-inherited-installments-amount`), porque su cuota de H es la 4/6.
  - CA-15: El diálogo de borrado (US-65) de una compra empezada muestra los meses y montos de sus
    imputaciones guardadas, no un calendario recalculado desde la fecha. El mismo mes de la
    importación no lista meses cerrados. En la prueba de dominio de ese aviso, con hoy un día de H+1,
    la compra de CA-2 lista solo H, con la cuota 4/6 de $20.000,00.
  - CA-16 (C6, directo contra la API): estos pedidos a `create_transaction` con
    `p_installments_count = 6` responden HTTP 400 y no crean filas:
    - `p_installments_paid` `6` y `-1` → `code = '23514'`, "Las cuotas ya pagadas tienen que ser menos
      que el total de cuotas";
    - con `p_installments_count = 1` y `p_installments_paid = 0` → `23514`, "Las cuotas ya pagadas solo
      van en una compra en cuotas";
    - fecha de hoy con `p_installments_paid = 1` → `23514`, "Con esa fecha todavía no puede haber
      tantas cuotas pagadas";
    - `p_installments_paid` con deudas (`p_shared_…`) → `23514`, "Una compra empezada no se puede
      compartir";
    - `p_installments_paid = 1.5` → `code = '22P02'` (PostgREST rechaza el tipo).

    `p_installments_paid` `null` o ausente crea una compra normal. Por `import_transactions`, una fila
    con `"installments_paid": 6` y 6 cuotas vuelve con `status: "rejected"` y las demás se importan.
    Con el rol `anon`, `42501`.
  - CA-17: `import-row-<n>-pending` está en la tarjeta de toda fila "Lista" con Cuotas pendientes.
- **Trazabilidad:** sección 4 · C3 · C4 · C6 · I1 · I1' · I2 (modificada por ADR-039) · I3 · I6 ·
  ADR-013 · ADR-021 · ADR-035 · ADR-039 · US-65 · US-74 · US-77
- **Casos de prueba:** a diseñar

#### US-81: Guía para armar el archivo de importación · [#269](https://github.com/Joaconz/Biyu/issues/269) · Pendiente

- **Objetivo:** Como usuario que nunca importó un Excel, quiero abrir una guía corta de cómo armar el
  archivo, para no adivinar el formato. Quien ya sabe tiene que poder ignorarla.
- **Depende de:** US-74 (pantalla Importar desde Excel) y US-80 (la guía nombra "Cuotas pendientes").
  Se implementa después de US-80.
- **Pantalla y estructura:** **Importar desde Excel** (`/import`), pasos 1 y 2. Debajo del indicador de
  pasos, el botón secundario **"¿Cómo armo el archivo?"**. No está en el paso 3. Mientras dice
  "Importando…", está deshabilitado.
- **Diálogo "Cómo armar el archivo"** (`role="dialog"`, `aria-modal="true"`). Contenido exacto, de
  arriba hacia abajo:
  - Título: "Cómo armar el archivo".
  - Texto: "Podés usar tu propia planilla o empezar desde la plantilla. Lo que importa es la primera fila
    y que haya un movimiento por fila."
  - Lista numerada de seis pasos:
    1. "En la primera fila van los encabezados. Fecha, Tipo, Monto, Moneda y Cuenta son obligatorios;
       Tipo de cambio, Categoría, Cuotas, Cuotas pendientes y Nota son opcionales."
    2. "Escribí la fecha como DD/MM/AAAA o usá una celda de fecha de Excel. No puede ser posterior a
       hoy."
    3. "En Tipo poné Gasto o Ingreso, y en Moneda, ARS o USD. Si es USD, completá el tipo de cambio de
       esa compra."
    4. "La categoría y la cuenta tienen que existir en Biyu con el mismo nombre. Las mayúsculas no
       importan; las tildes sí. Un gasto necesita categoría."
    5. "Para una compra en cuotas con tarjeta de crédito, poné la cantidad en Cuotas. Si ya pagaste
       algunas, poné en Cuotas pendientes cuántas te faltan, contando la de este mes."
    6. "Antes de importar vas a ver qué filas tienen errores y por qué. Las que están bien se importan
       aunque otras fallen."
  - Tabla "Ejemplo", con los encabezados de la plantilla (US-80 · CA-1) y dos filas:

    | Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Cuotas pendientes | Nota |
    |---|---|---|---|---|---|---|---|---|---|
    | 01/09/2026 | Gasto | 45800 | ARS | | Comida y supermercado | Tarjeta de débito | | | Compra del mes |
    | 10/06/2026 | Gasto | 120000 | ARS | | Otros | Tarjeta de crédito | 6 | 3 | Heladera |

  - Pie: "Hasta 500 filas y 1 MB. Solo se lee la primera hoja."
  - Botones: "Descargar plantilla" (baja el mismo archivo que el botón del paso 1) y "Entendido"
    (cierra). Arriba a la derecha, un botón de cerrar con `aria-label="Cerrar guía"`.
- **Comportamiento:**
  - **Cerrada por defecto.** Entrar a `/import` nunca la abre sola, tampoco la primera vez, y no se
    recuerda si se abrió antes.
  - **Se puede saltear.** No hace falta abrirla para elegir un archivo ni para importar. Nada se
    deshabilita ni avisa por no haberla abierto.
  - Abrirla y cerrarla no cambia el paso, el archivo elegido, el filtro ni la URL, y no escribe nada.
  - Sigue la regla de diálogos de DEF-024; acá el foco inicial va al botón de cerrar. Al abrir, el foco
    va al botón de cerrar; Tab y Shift+Tab no salen del diálogo; Escape lo cierra; tocar fuera del diálogo
    lo cierra; al cerrarse por cualquier vía, el foco vuelve a "¿Cómo armo el archivo?".
  - En el celular (390 px de ancho) ocupa el ancho de la pantalla menos 16 px por lado y su contenido
    scrollea por dentro. La tabla de ejemplo scrollea horizontal dentro de su caja: la página no tiene
    scroll horizontal.
- **`data-testid`:**

  | Elemento | `data-testid` |
  |---|---|
  | Botón "¿Cómo armo el archivo?" | `import-guide-open` |
  | Diálogo | `import-guide-dialog` |
  | Lista de pasos | `import-guide-steps` |
  | Tabla de ejemplo | `import-guide-example` |
  | Botón "Descargar plantilla" del diálogo | `import-guide-template-download` |
  | Botón "Entendido" | `import-guide-done` |
  | Botón de cerrar | `import-guide-close` |

- **Criterios de aceptación:**
  - CA-1: Al entrar a `/import`, `import-guide-dialog` no está en el DOM y se ve "¿Cómo armo el
    archivo?" en el paso 1. Recargar o volver a entrar no lo abre.
  - CA-2: Tocar "¿Cómo armo el archivo?" abre el diálogo con el título, el texto, los seis pasos, la
    tabla de ejemplo y el pie, todos exactos.
  - CA-3: "Entendido", el botón de cerrar, Escape y un toque fuera del diálogo lo cierran. En los
    cuatro casos el foco vuelve a "¿Cómo armo el archivo?".
  - CA-4: Al abrir, el foco está en el botón de cerrar. Con Tab y Shift+Tab repetidos, el foco nunca
    sale del diálogo.
  - CA-5: "Descargar plantilla" del diálogo baja `biyu-plantilla-importacion.xlsx` con las mismas hojas
    y el mismo contenido de celdas que el del paso 1 (US-80 · CA-1).
  - CA-6: Elegir un archivo e importar sin haber abierto nunca la guía funciona igual que en US-77.
  - CA-7: En el paso 2 con un archivo elegido, abrir y cerrar la guía deja el mismo archivo, el mismo
    resumen y el mismo estado del filtro "Ver solo filas con error". La URL no cambia.
  - CA-8: En el paso 3 no está `import-guide-open`. Mientras dice "Importando…", está deshabilitado.
  - CA-9: A 390 × 844, el diálogo entra en la pantalla con 16 px de margen por lado,
    `document.documentElement.scrollWidth` no supera el ancho de la ventana, y la tabla de ejemplo se
    puede recorrer con scroll horizontal dentro de su caja.
  - CA-10: Todos los elementos de la tabla de `data-testid` lo tienen.
- **Trazabilidad:** US-74 · US-80 · ADR-023 · DEF-024
- **Casos de prueba:** a diseñar

## Especificación compartida

Las secciones 1 a 9 y 12 valen para las cuatro historias.

### 1. Dónde se importa y estructura de la pantalla

**Entrada.** En **Registrar** (`/register`), en el encabezado y visible en los tres pasos del
registro, un botón secundario **"Importar desde Excel"** que navega a `/import`. Importar es otra forma
de registrar, y Registrar es la pantalla de inicio (US-01): queda a la vista sin sumar una pestaña a la
barra. El botón no cambia nada del registro manual: el foco sigue arrancando en el monto (US-02). Es
una ruta privada: sin sesión redirige a `/login?next=/import` (US-48).

**Encabezado.** Botón "Registrar" (volver) y el título "Importar desde Excel". Debajo, un indicador de
tres pasos ("1 Archivo · 2 Revisión · 3 Resultado") con el paso actual marcado. El paso vive en el
estado de la pantalla, no en la URL: recargar vuelve al paso 1 sin archivo elegido (el archivo se lee
en el navegador y no se guarda en ningún lado).

**Plurales.** Los textos con un número usan singular cuando el número es 1: "1 fila leída", "1 lista
para importar", "1 con error", "Importar 1 movimiento", "Vas a importar 1 movimiento", "Se importó 1 de
<T> filas." (y "de 1 fila" si T = 1), "1 fila no se importó:". En las tablas de abajo se escribe la
forma plural.

**Paso 1 · Archivo.**

| Elemento | Texto | Comportamiento |
|---|---|---|
| Texto de ayuda | "Subí una planilla .xlsx con un movimiento por fila. La primera fila tiene que tener los encabezados de la plantilla." | — |
| Botón secundario | "Descargar plantilla" | Descarga `biyu-plantilla-importacion.xlsx`, generado en el navegador: hoja 1 "Movimientos" con solo la fila de encabezados de la sección 2, en ese orden; hoja 2 "Instrucciones" con la tabla de columnas de la sección 2 |
| Zona de archivo | "Elegir archivo .xlsx" (botón) y "o arrastralo acá" (desktop) | Abre el selector del sistema filtrado a `.xlsx`. Al elegir un archivo se valida (sección 3) y, si pasa, se va al paso 2 |
| Límites | "Hasta 500 filas y 1 MB. Solo se lee la primera hoja." | — |
| Error de archivo | Uno de los mensajes de la sección 3 | Se muestra debajo de la zona de archivo; la pantalla sigue en el paso 1 |

**Paso 2 · Revisión.** No escribe nada en la base.

| Elemento | Texto | Comportamiento |
|---|---|---|
| Nombre del archivo | "<nombre>.xlsx" | — |
| Resumen de la lectura | "<T> filas leídas · <N> listas para importar · <M> con error" | T = N + M (las filas vacías no cuentan, sección 2) |
| Monto a importar | "Vas a importar <N> movimientos: <$G> en gastos y <$I> en ingresos (en pesos)." | G e I suman el monto en ARS de cada fila lista: el monto si es ARS, y monto × tipo de cambio redondeado half-up a 2 decimales si es USD (ADR-013). Es el monto total de cada transacción, no lo que imputa a un mes. Si G o I es cero, se muestra "$0,00" |
| Columnas ignoradas | "Se ignoraron las columnas: <A>, <B>." | Solo si el archivo tiene encabezados que no son de la sección 2. En el orden del archivo |
| Aviso de duplicados | "Si ya importaste este archivo, los movimientos se van a duplicar." | Siempre visible en este paso |
| Filtro | Interruptor "Ver solo filas con error" | Apagado por defecto. Prendido, la lista muestra solo las M filas con error. Deshabilitado si M = 0 |
| Lista de filas | Una tarjeta por fila con datos, en el orden del archivo | Cada tarjeta: "Fila <n>" (número de fila de Excel), fecha DD/MM/AAAA, tipo, monto con su moneda ("$45.800,00" o "US$12,50"), categoría, cuenta, en USD el tipo de cambio ("TC 1.450,00") y, si hay más de una, "<k> cuotas". Etiqueta de estado "Lista" (verde) o "Con error" (bordó); con error, debajo, cada mensaje de la sección 4 en una línea. Una celda que no se pudo interpretar se muestra con el texto que tenía |
| Botón secundario | "Elegir otro archivo" | Vuelve al paso 1 sin archivo y sin escribir nada |
| Botón principal | "Importar <N> movimientos" | Habilitado si N ≥ 1. Con N = 0 queda deshabilitado y debajo dice "No hay filas listas para importar" |

**Mientras importa.** Al tocar "Importar <N> movimientos" el botón pasa a "Importando…" y queda
deshabilitado junto con "Elegir otro archivo" hasta que llega la respuesta o pasan **30 segundos**
(tiempo de espera del cliente). Se hace **una sola** llamada a la base (ADR-035): no hay barra de
progreso por fila. Salir de la pantalla en este estado pide confirmación (sección 8).

**Paso 3 · Resultado.**

| Elemento | Texto | Comportamiento |
|---|---|---|
| Título | "Se importaron <K> de <T> filas." | K = filas creadas en la base; T = el mismo T del paso 2 |
| Monto importado | "<$G'> en gastos y <$I'> en ingresos (en pesos)." | Igual que en el paso 2, pero solo sobre las K filas creadas |
| Lista de no importadas | "<T−K> filas no se importaron:" y una línea por fila: "Fila <n>: <mensaje>" | Solo si T − K > 0. Incluye las M filas con error del paso 2 y las que rechazó la base (sección 5). Ordenadas por número de fila. Una fila con varios errores muestra los mensajes separados por " · " |
| Botón principal | "Ver en Movimientos" | Navega a `/transactions?period=<AAAA-MM>` (C11), donde AAAA-MM es el mes de la **fecha** (`occurred_on`) más reciente entre las K filas creadas; no el de su última cuota. Si K = 0, no se muestra |
| Botón secundario | "Importar otro archivo" | Vuelve al paso 1 vacío |

### 2. Formato del archivo

| Propiedad | Valor |
|---|---|
| Extensión aceptada | Solo `.xlsx` (Excel 2007 en adelante, o LibreOffice/Google Sheets exportado como .xlsx). No se aceptan `.xls`, `.csv`, `.ods` ni `.numbers` (sección 9) |
| Tamaño máximo | 1 MB (1.048.576 bytes). Un archivo de exactamente 1.048.576 bytes se acepta |
| Hoja que se lee | Solo la **primera hoja** del libro. Las demás se ignoran sin aviso |
| Fila de encabezados | La fila 1 de la primera hoja. Los datos empiezan en la fila 2 |
| Cantidad de filas | Entre 1 y **500** filas con datos. Una fila es "vacía" si todas sus celdas de las columnas de la tabla de abajo están vacías o tienen solo espacios: se saltea y no cuenta para T ni para el límite |
| Número de fila | El número de fila de Excel (la primera fila de datos es la 2). Las filas vacías salteadas conservan su número: no se renumera |
| Fórmulas | Se usa el valor calculado que quedó guardado en el archivo, con la regla de celdas numéricas de abajo |
| Celdas combinadas, formato, colores, comentarios | Se ignoran; se lee el valor de cada celda |
| Texto de las celdas | Toda celda de texto se lee sin los espacios del principio y del final, y normalizada a Unicode NFC (una tilde escrita como carácter aparte cuenta igual que la tilde compuesta) |

**Columnas.** Los encabezados se reconocen sin distinguir mayúsculas ni tildes, e ignorando espacios
al principio y al final ("categoria", " CATEGORÍA " y "Categoría" son la misma columna). Pueden estar
en cualquier orden. Cualquier otro encabezado se ignora y se lista en el paso 2.

- **Encabezados obligatorios** (sin ellos, el archivo se rechaza con A4): Fecha, Tipo, Monto, Moneda,
  Cuenta.
- **Encabezados opcionales**: Tipo de cambio, Categoría, Cuotas, Nota (y Cuotas pendientes desde
  US-80). Si la columna no está, se trata
  como vacía en todas las filas: un archivo solo en ARS no necesita "Tipo de cambio", pero sin
  "Categoría" todo gasto da F14a.

| Encabezado | Celda obligatoria | Qué va | Formatos aceptados |
|---|---|---|---|
| Fecha | Sí | Fecha del movimiento (`occurred_on`) | Celda con formato de fecha de Excel (si tiene hora, se toma solo el día; se respeta el sistema de fechas del libro, 1900 o 1904), o texto `DD/MM/AAAA` con día y mes de 1 o 2 dígitos ("5/9/2026" vale). Una celda numérica **sin** formato de fecha (por ejemplo 46000) no es una fecha: da F2. No hay fecha mínima, igual que en Registrar |
| Tipo | Sí | `Gasto` o `Ingreso` | Texto, sin distinguir mayúsculas |
| Monto | Sí | Monto total del movimiento, siempre positivo (el signo lo da Tipo, I4) | Celda numérica, o texto con el mismo criterio que el monto de Registrar (`tryParseMoney`): "1234,56", "1.234,56", "1234.56"; un punto seguido de grupos de 3 dígitos es separador de miles ("1.500" = 1500). Sin símbolo de moneda ni espacios internos |
| Moneda | Sí | `ARS` o `USD` | Texto, sin distinguir mayúsculas |
| Tipo de cambio | Solo si Moneda = USD | Pesos por dólar de **esa** fila (`fx_rate`, se congela, C5) | Celda numérica o texto con el criterio de Monto, hasta 4 decimales. No se completa con el tipo de cambio de referencia del mes (sección 9) |
| Categoría | Sí si Tipo = Gasto | Nombre de una categoría **activa** del usuario | Se compara sin distinguir mayúsculas; las tildes **sí** cuentan, porque "Educación" y "Educacion" pueden ser dos categorías distintas (índice `lower(name)`, `04-data-model.md`). En un Ingreso es opcional; si viene, tiene que existir |
| Cuenta | Sí | Nombre de una cuenta **activa** del usuario | Mismo criterio que Categoría |
| Cuotas | No (vacía = 1) | Cantidad de cuotas | Entero de 1 a 12, celda numérica o texto |
| Nota | No | Descripción | Texto libre. Vacía = sin descripción (US-08) |

**Celdas numéricas y C2.** Excel guarda los números como binario de punto flotante: una fórmula
`=0,1*3` guarda 0,30000000000000004 aunque muestre "0,3". Por eso una celda numérica (de Monto, Tipo de
cambio o Cuotas) se redondea a **15 dígitos significativos**, la precisión que muestra Excel, se escribe
como texto decimal sin notación exponencial y recién ahí se parsea con `decimal.js`. `=0,1*3` se lee
como 0,3; `=100/3` como 33,3333333333333 y da F9. Ningún monto se opera como `number` y a la base
llega como texto.

### 3. Validación del archivo (rechaza el archivo entero)

Se evalúan en este orden; el primero que falla se muestra y el archivo no pasa al paso 2. No se
escribe nada.

| # | Regla | Mensaje exacto |
|---|---|---|
| A1 | La extensión no es `.xlsx` (sin distinguir mayúsculas) | "Solo se aceptan archivos .xlsx (Excel)." |
| A2 | Pesa más de 1.048.576 bytes | "El archivo pesa más de 1 MB. Dividilo en varios archivos." |
| A3 | No se puede abrir como .xlsx (dañado, protegido con contraseña, o con extensión .xlsx pero otro formato) | "No pudimos leer el archivo. Abrilo en Excel, guardalo como .xlsx y probá de nuevo." |
| A4 | Falta uno o más de los encabezados obligatorios (Fecha, Tipo, Monto, Moneda, Cuenta) en la fila 1 | "Faltan columnas: <C1>, <C2>. La primera fila tiene que tener los encabezados de la plantilla." con las faltantes en ese orden; si falta una sola, "Falta la columna: <C1>. La primera fila tiene que tener los encabezados de la plantilla." |
| A5 | Un encabezado de la sección 2 aparece dos veces | "La columna <C> está repetida. Dejá una sola." |
| A6 | No hay ninguna fila con datos debajo de los encabezados | "El archivo no tiene filas con datos debajo de los encabezados." |
| A7 | Hay más de 500 filas con datos | "El archivo tiene <T> filas con datos y el máximo es 500. Dividilo en varios archivos." |

### 4. Validación fila por fila

Las reglas son las del alta manual (I4–I8, FR-06, DEF-012, DEF-013, DEF-018; `validateTransactionDraft`
en `src/domain/validation.ts`), pero **los mensajes son propios de la importación**, porque nombran la
columna de la planilla y no un campo del formulario: algunos difieren a propósito de los de Registrar
("Fecha inválida: usá DD/MM/AAAA" en lugar de "Fecha inválida"). Al implementarse, la regla se reusa
desde `src/domain/` y se traduce a estos mensajes; no se copia (C1). Esta validación es solo de
experiencia de uso: la base vuelve a validar cada fila al importar (C6, sección 5). "Hoy" es el día
calendario de Argentina (ADR-021), el mismo que usa Registrar.

**Orden y dependencias.** Se evalúan las reglas en el orden de la tabla y se muestra **a lo sumo un
mensaje por columna** (el primero que falla en esa columna). Una regla que depende de otra columna se
evalúa solo si esa columna no tuvo error:

| Regla | Se evalúa solo si no tuvieron error |
|---|---|
| F13a, F13b (tipo de cambio según moneda) | Moneda |
| F14a (categoría obligatoria en un gasto) | Tipo |
| F15 (cuotas solo con tarjeta de crédito) | Tipo, Cuenta y Cuotas |
| F16, F18 (equivalente en pesos) | Monto, Moneda y Tipo de cambio |
| F17 (cuota menor a 0,01) | Monto, Moneda, Tipo de cambio y Cuotas |

Ejemplo: con Moneda "EUR" y Tipo de cambio "1450", la fila muestra solo F12. Una fila es **"Lista"**
si no tiene ningún mensaje.

| # | Columna | Regla | Mensaje exacto |
|---|---|---|---|
| F1 | Fecha | Vacía | "Falta la fecha" |
| F2 | Fecha | No es fecha de Excel ni texto `DD/MM/AAAA`, o es una fecha inexistente (31/02/2026) | "Fecha inválida: usá DD/MM/AAAA" |
| F3 | Fecha | Posterior a hoy | "La fecha no puede ser futura" |
| F4 | Tipo | Vacío | "Falta el tipo" |
| F5 | Tipo | No es Gasto ni Ingreso | "Tipo inválido: escribí Gasto o Ingreso" |
| F6 | Monto | Vacío | "Falta el monto" |
| F7 | Monto | No es un número en los formatos de la sección 2 | "Monto inválido: usá un número, por ejemplo 1234,56" |
| F8 | Monto | Menor o igual a cero (I4) | "El monto debe ser mayor a cero" |
| F9 | Monto | Más de 2 decimales | "El monto admite hasta 2 decimales" |
| F10 | Monto | Mayor a 999.999.999.999,99 (DEF-012) | "El monto máximo es $999.999.999.999,99" |
| F11 | Moneda | Vacía | "Falta la moneda" |
| F12 | Moneda | No es ARS ni USD | "Moneda inválida: escribí ARS o USD" |
| F13a | Tipo de cambio | Moneda USD y celda vacía (I5) | "Falta el tipo de cambio" |
| F13b | Tipo de cambio | Moneda ARS y celda no vacía (I5) | "Una transacción en ARS no lleva tipo de cambio" |
| F13c | Tipo de cambio | Moneda USD y no es un número, o es menor o igual a cero | "Tipo de cambio inválido: usá un número mayor a cero" |
| F13d | Tipo de cambio | Moneda USD y más de 4 decimales (DEF-018) | "Usá hasta 4 decimales en el tipo de cambio" |
| F13e | Tipo de cambio | Moneda USD y mayor a 9.999.999.999,9999 | "El tipo de cambio es demasiado grande" |
| F14a | Categoría | Vacía y Tipo = Gasto (I8) | "Falta la categoría (es obligatoria en un gasto)" |
| F14b | Categoría | No vacía y no coincide con ninguna categoría activa | "No existe la categoría «<valor>» o está archivada" |
| F14c | Cuenta | Vacía | "Falta la cuenta" |
| F14d | Cuenta | No coincide con ninguna cuenta activa | "No existe la cuenta «<valor>» o está archivada" |
| F14e | Cuotas | No es un entero entre 1 y 12 | "Las cuotas van de 1 a 12" |
| F15 | Cuotas | Más de 1 cuota y no es un Gasto con cuenta de tipo Tarjeta de crédito (I6) | "Solo los gastos con tarjeta de crédito admiten cuotas" |
| F16 | Monto | Moneda USD y monto × tipo de cambio supera 999.999.999.999,99 (DEF-012) | "En pesos daría más que el máximo de $999.999.999.999,99" |
| F17 | Cuotas | Más de 1 cuota y la cuota base (monto ÷ cuotas, truncado a 2 decimales) da menos de 0,01, en la moneda o en pesos (I4, ADR-013) | "Con ese monto, cada cuota daría menos de 0,01" |
| F18 | Monto | 1 cuota, USD y el equivalente en pesos da menos de $0,01 (DEF-013) | "En pesos daría menos de $0,01. Revisá el monto o el tipo de cambio" |

`<valor>` es el texto de la celda ya recortado. Nota no tiene reglas. Si F16 y F18 aplicaran a la vez
sobre Monto, se muestra F16 (primera en la tabla dentro de la columna).

### 5. Filas válidas y con error: qué se importa

1. **Se importan solo las filas "Lista".** Las filas con error del paso 2 no se envían a la base y
   aparecen en el resultado como no importadas, con sus mensajes. No hace falta corregirlas para
   importar las demás.
2. **Cada fila es atómica por separado** (C4): se crea con `create_transaction`, que escribe la
   transacción y sus imputaciones juntas o ninguna. Una fila que la base rechaza no deja nada escrito
   y no impide que se creen las otras (ADR-035).
3. **La base revalida cada fila** (C6). Si rechaza una fila que el paso 2 dio por "Lista" (por
   ejemplo, la categoría se archivó en otra pestaña entre la revisión y la importación), la fila
   figura en el resultado como no importada. El mensaje sale del texto de error de
   `create_transaction`, que es contrato (lo fijan sus tests pgTAP):

   | El error de la base empieza con | Mensaje en el resultado |
   |---|---|
   | "la cuenta no existe, no es tuya o está archivada" | "No existe la cuenta «<valor>» o está archivada" |
   | "la categoría no existe, no es tuya o está archivada" | "No existe la categoría «<valor>» o está archivada" |
   | "FR-06: la fecha no puede ser posterior a hoy" | "La fecha no puede ser futura" |
   | Cualquier otro | "La base rechazó esta fila: <mensaje del servidor>" |

   `create_transaction` valida la cuenta antes que la categoría: si las dos están archivadas, la fila
   muestra solo el mensaje de la cuenta.
4. **Lo importado es un movimiento como cualquier otro.** Sale en Movimientos y en el Resumen, imputa
   sus cuotas desde el mes de su fecha (I2, I3; **modificado por US-80:** una compra empezada imputa
   desde el mes de hoy), se puede eliminar de a uno (US-65) y no tiene marca
   de "importado". No cambia la cuenta precargada de Registrar (US-07).
5. **No se detectan duplicados** contra movimientos existentes: importar dos veces el mismo archivo
   crea todo dos veces. Por eso el aviso del paso 2.

### 6. Archivo de ejemplo y resumen esperado

Esta tabla **es** el contenido de la hoja "Movimientos" de `importar-excel-ejemplo.xlsx`; si el
archivo y la tabla difieren, vale la tabla. Fechas como celdas de fecha de Excel, salvo la fila 11,
que tiene fecha y monto como texto. Celdas vacías: "—".

| Fila | Fecha | Tipo | Monto | Moneda | Tipo de cambio | Categoría | Cuenta | Cuotas | Nota | Estado esperado |
|---|---|---|---|---|---|---|---|---|---|---|
| 2 | 01/09/2026 | Gasto | 45800 | ARS | — | Comida y supermercado | Tarjeta de débito | 1 | Compra del mes | Lista |
| 3 | 03/09/2026 | Gasto | 240000 | ARS | — | Indumentaria | Tarjeta de crédito | 6 | Campera | Lista |
| 4 | 05/09/2026 | Gasto | 12,5 | USD | 1450 | Entretenimiento | Tarjeta de crédito | — | Juego online | Lista ($18.125,00) |
| 5 | 08/09/2026 | Ingreso | 850000 | ARS | — | — | Cuenta bancaria | — | Sueldo | Lista |
| 6 | 10/09/2026 | Gasto | 3200 | ARS | — | Transporte | Billetera virtual | — | Carga SUBE | Lista |
| 7 | 12/09/2026 | Gasto | 0 | ARS | — | Salud | Efectivo | — | Farmacia | F8 |
| 8 | 15/09/2026 | Gasto | 30 | USD | — | Otros | Efectivo | — | Regalo | F13a |
| 9 | 18/09/2026 | Gasto | 15000 | ARS | — | Mascotas | Efectivo | — | Veterinaria | F14b |
| 10 | 20/09/2026 | Gasto | 60000 | ARS | — | Educación | Efectivo | 3 | Curso | F15 |
| 11 | "22/09/2026" | Gasto | "9.990,50" | ARS | — | Servicios | Cuenta bancaria | — | Internet | Lista |
| 12 | — | — | — | — | — | — | — | — | — | Vacía, se saltea |
| 13 | 25/09/2026 | Gasto | 7800 | ARS | — | Comida y supermercado | Efectivo | — | Verdulería | Lista |

Gastos de las filas Lista: 45.800 + 240.000 + 18.125 + 3.200 + 9.990,50 + 7.800 = **$324.915,50**.
Ingresos: **$850.000,00**. Con un usuario sembrado (US-43 sin cambios) y hoy posterior al 25/09/2026,
el paso 3 muestra exactamente:

- "Se importaron 7 de 11 filas."
- "$324.915,50 en gastos y $850.000,00 en ingresos (en pesos)."
- "4 filas no se importaron:"
  - "Fila 7: El monto debe ser mayor a cero"
  - "Fila 8: Falta el tipo de cambio"
  - "Fila 9: No existe la categoría «Mascotas» o está archivada"
  - "Fila 10: Solo los gastos con tarjeta de crédito admiten cuotas"

El gasto de la fila 3 ($240.000,00 en 6 cuotas) suma completo en "gastos", aunque en septiembre imputa
$40.000,00. "Ver en Movimientos" lleva a `/transactions?period=2026-09`.

### 7. Errores de toda la importación

Si la llamada falla entera, no hay paso 3: la pantalla sigue en el paso 2 con un mensaje arriba del
botón y el botón principal pasa a **"Reintentar"**, que repite la misma importación con el mismo
identificador (ADR-035).

| Qué pasa | Qué se sabe | Mensaje exacto |
|---|---|---|
| Sin respuesta: sin conexión, corte o 30 s sin respuesta | Puede haberse guardado o no | "No pudimos confirmar la importación. Puede que se haya guardado: tocá Reintentar y te decimos qué pasó." |
| La base responde que la sesión venció (`42501`) | No se guardó nada | "Tu sesión venció y no se importó ninguna fila. Volvé a entrar y subí el archivo de nuevo." (en este caso no hay "Reintentar": el botón lleva a `/login?next=/import`) |
| La base responde que se agotó su tiempo (`57014`) | No se guardó nada | "La importación tardó demasiado y no se importó ninguna fila. Dividí el archivo en partes más chicas." |
| Cualquier otro error con respuesta | No se guardó nada | "No se importó ninguna fila. Probá de nuevo en un rato." |

Al reintentar:

- si la importación no se había guardado, se importa ahora y se ve el paso 3;
- si ya se había guardado, no se crea nada nuevo y se ve el paso 3 con el resultado original y, arriba,
  "Esta importación ya se había guardado.";
- si la primera llamada todavía está corriendo en la base, el reintento espera a que termine y
  responde como en el caso anterior (ADR-035).

### 8. Salir de la pantalla con una importación pendiente

Mientras dice "Importando…" o mientras se ve el mensaje "No pudimos confirmar la importación…", tocar
"Registrar" (volver), un destino de la barra de navegación o "Elegir otro archivo" abre el diálogo **"¿Salir sin
saber si se importó?"** con el texto "Puede que la importación se haya guardado. Si salís, revisá
Movimientos antes de volver a importar este archivo." y los botones **"Quedarme"** (cierra el diálogo)
y **"Salir igual"** (hace lo que se tocó). Recargar o cerrar la pestaña en ese estado muestra el aviso
nativo del navegador de que hay cambios sin guardar. En los demás estados se sale sin preguntar.

### 9. Fuera de alcance

| Fuera | Por qué |
|---|---|
| `.csv`, `.xls`, `.ods` | Un CSV argentino usa `;` o `,` y coma decimal según cómo se exportó: es ambigüedad que hay que especificar y probar aparte. Además el repo no admite `*.csv` (C13, `.gitignore`), así que no habría archivo de ejemplo versionable. Excel, LibreOffice y Google Sheets guardan como .xlsx |
| Re-importar el CSV de US-47 | US-47 exporta CSV, que esta historia no acepta. Las columnas comparten nombres donde coinciden, pero el ida y vuelta no es un criterio |
| Crear categorías o cuentas que no existen | Una fila con un nombre desconocido es un error (F14b, F14d), no un alta implícita. Evita que un error de tipeo cree una categoría nueva |
| Completar el tipo de cambio con el de referencia del mes (US-20) | Un archivo de muchas filas con el tipo de cambio puesto en silencio es difícil de revisar; el paso 2 mostraría montos en pesos que el usuario no escribió |
| Gastos compartidos (deudas) y suscripciones | No hay columna para eso; se cargan desde sus pantallas |
| Detección de duplicados | Necesita una regla de "mismo movimiento" que el dominio no define |
| Editar una fila dentro de la app antes de importar | Se corrige en el archivo y se vuelve a subir |
| Deshacer una importación entera | Cada movimiento importado se elimina de a uno (US-65) |
| Fechas de texto en formato `MM/DD/AAAA` | Un texto "05/09/2026" se lee siempre como 5 de septiembre. Una celda de fecha de Excel no tiene ambigüedad: vale la fecha guardada, cualquiera sea cómo se muestra |

### 10. Criterios de aceptación

Están en cada historia, arriba. "El archivo de ejemplo" es el de la sección 6; "usuario sembrado" es un
usuario con las 8 categorías y 5 cuentas de US-43 sin cambios.

### 11. Trazabilidad

- **Issue:** épica [#203](https://github.com/Joaconz/Biyu/issues/203), que reemplaza a [#169](https://github.com/Joaconz/Biyu/issues/169) (idea del backlog personal). Sin FR propio en la pre-entrega: lleva el alta de FR-06 a una carga por lote.
  Entra a V2 como nivel 3 del alcance de `entrega-2/README.md` y figura en la tabla de épicas de
  `docs/08-trazabilidad.md`; `docs/roadmap.md` todavía no la lista (supuesto 4).
- **Constraints:** C1 (la regla se reusa de `src/domain/`), C2 (montos como texto y `decimal.js`), C4
  (cada fila por `create_transaction`), C6 (la base revalida), C7 (RLS), C11 (enlace a Movimientos con
  `?period`), C14 (ejemplos ficticios; el archivo no se sube ni se guarda).
- **Invariantes:** I1, I1', I2, I3, I4, I5, I6, I8.
- **NFR:** NFR-10 (no duplicar al reintentar).
- **ADR:** ADR-005 (la importación usa el mismo camino de escritura que el registro manual), ADR-013
  (redondeo), ADR-021 (hoy en Argentina), ADR-023 (sistema de diseño), ADR-035 (escritura por
  lote y fallo parcial).
- **Historias relacionadas:** US-47 (exportar a CSV, la operación inversa; sección 9), US-07, US-08,
  US-09, US-11, US-14, US-19 (las validaciones de alta que se repiten por fila), US-65 (eliminar lo
  importado).

### 12. `data-testid`

Prefijo `import-` (`docs/07-plan-de-testing.md` §2). `<n>` es el número de fila de Excel.

| Elemento | `data-testid` |
|---|---|
| Botón "Importar desde Excel" en Registrar | `register-import` |
| Botón "Registrar" (volver) | `import-back` |
| Indicador de pasos | `import-steps` (con `data-step="1"`, `"2"` o `"3"`) |
| Botón "Descargar plantilla" | `import-template-download` |
| Botón "Elegir archivo .xlsx" | `import-file-pick` |
| `<input type="file">` | `import-file-input` |
| Zona para arrastrar | `import-file-dropzone` |
| Error de archivo (A1–A7) | `import-file-error` |
| Nombre del archivo | `import-file-name` |
| Resumen de la lectura | `import-summary` |
| Monto a importar | `import-summary-amounts` |
| Columnas ignoradas | `import-ignored-columns` |
| Aviso de duplicados | `import-duplicates-warning` |
| Interruptor "Ver solo filas con error" | `import-filter-errors` |
| Lista de filas | `import-rows` |
| Tarjeta de una fila | `import-row-<n>` (con `data-status="ready"` o `"error"`) |
| Mensajes de error de una fila | `import-row-<n>-errors` |
| Botón "Elegir otro archivo" | `import-change-file` |
| Botón "Importar N movimientos" / "Importando…" / "Reintentar" / volver a entrar | `import-submit` |
| Texto "No hay filas listas para importar" | `import-submit-hint` |
| Mensaje de error de toda la importación (sección 7) | `import-batch-error` |
| Diálogo "¿Salir sin saber si se importó?" | `import-leave-dialog` |
| Botón "Quedarme" | `import-leave-stay` |
| Botón "Salir igual" | `import-leave-confirm` |
| Título del resultado | `import-result-title` |
| Aviso "Esta importación ya se había guardado." | `import-result-already` |
| Monto importado | `import-result-amounts` |
| Lista de no importadas | `import-result-rejected` |
| Línea de una fila no importada | `import-result-row-<n>` |
| Botón "Ver en Movimientos" | `import-go-transactions` |
| Botón "Importar otro archivo" | `import-again` |

### 13. Supuestos de esta historia

1. La entrada va en Registrar y no en Ajustes ni en una pestaña nueva: es una carga, como el registro
   manual, y una quinta pestaña ocuparía un lugar fijo para algo que se usa poco.
2. El límite de 500 filas y 1 MB es de esta historia, no de la base. Alcanza para un año de gastos de
   una persona. Si al implementar 500 filas de 12 cuotas no entran en una sola llamada, se baja el límite
   (ADR-035), no se parte la llamada.
3. El archivo se lee en el navegador; a la base solo llegan las filas "Lista" ya convertidas. El
   archivo no se guarda en Supabase Storage ni en ningún otro lado (C14).
4. Esta entrega edita `docs/08-trazabilidad.md` (fila de la épica) y no toca `docs/02-behavior-spec.md`,
   `docs/roadmap.md` ni `docs/03-architecture-spec.md`. Al aceptarse hay que sumar las historias a los
   dos primeros y extender C4 y C7 en el tercero con la RPC de ADR-035.
5. US-80 y US-81 se agregaron el 2026-10-08 desde los pendientes de producto
   ([#268](https://github.com/Joaconz/Biyu/issues/268) y [#269](https://github.com/Joaconz/Biyu/issues/269)).
   Las secciones 1 a 12 describen la importación hasta US-78. Lo que agregan US-80 (columna "Cuotas
   pendientes", reglas F19 a F21, plantilla de 10 columnas) y US-81 (la guía) está en cada historia y
   vale desde que se implementa. La idea original pedía además una columna "Es cuota" y hasta 24 cuotas:
   no se agregan, porque "Es cuota" se deduce de Cuotas > 1 y el máximo de 12 es el de la base
   (`transactions_installments_max`, US-12).
