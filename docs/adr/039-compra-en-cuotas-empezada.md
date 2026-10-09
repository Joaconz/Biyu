# ADR-039 — Una compra en cuotas empezada se carga con las cuotas que faltan

**Estado:** propuesta · **Fecha:** 2026-10
**Relacionada:** ADR-001, ADR-013, ADR-020, ADR-021, ADR-040 · Modifica ADR-035 (contrato de `p_rows`), I2 y la
nota de `first_period` de `docs/04-data-model.md`

## Contexto

US-80 ([#268](https://github.com/Joaconz/Biyu/issues/268)) pide importar desde el Excel una compra en
cuotas que empezó antes de usar Biyu: "compré una heladera en 6 cuotas en junio y me faltan 3". Hoy
eso no se puede cargar bien. Con la fecha de la compra, `create_transaction` imputa las 6 cuotas desde
junio (I3) y las 3 ya pagadas caen en meses que el usuario no registró en la app, o que ya registró de
otra forma. Con la fecha de hoy, imputa 6 cuotas desde este mes, el doble de lo que falta pagar.

El modelo actual no tiene dónde guardar "ya pagué K cuotas":

- I2 exige exactamente `installments_count` imputaciones numeradas de 1 a N.
- `first_period` es siempre el mes de `occurred_on`.
- I1 exige que las imputaciones sumen `transactions.amount`.

## Decisión

1. **`transactions` suma la columna `installments_paid int not null default 0`**, con
   `CHECK (installments_paid >= 0 and installments_paid < installments_count)`. Son las cuotas
   pagadas antes de cargar la compra. Toda transacción existente queda con 0 y no cambia.
2. **`create_transaction` suma el parámetro `p_installments_paid int default null`.** PostgREST llama
   por nombre, así que su posición en la firma no importa. Con `null` (o sin el parámetro) la función
   se comporta igual que hoy. Con un valor K (de 0 a N − 1) la transacción es una **compra
   empezada**:
   - Calcula el calendario completo de N cuotas sobre el monto **total** de la compra, con la regla de
     siempre: cuota base truncada a 2 decimales y la última absorbe el resto (C3, ADR-013).
   - Guarda solo las últimas `N − K` cuotas, con `installment_number` de `K + 1` a N.
   - `transactions.amount` pasa a ser la **suma de las cuotas guardadas**: lo que falta pagar. Así I1
     sigue valiendo.
   - `transactions.amount_ars` es una columna generada (`round(amount * fx_rate, 2)`), así que sale de
     ese monto. El `amount_ars` de las imputaciones guardadas se reparte sobre ese total con la regla
     de siempre (base truncada y la última absorbe el resto), igual que hoy se reparte el de una
     compra normal. Así I1' sigue valiendo.
   - `first_period` es el **período de hoy en Argentina** (ADR-021), también con K = 0, y no el mes de
     `occurred_on`. `occurred_on` sigue siendo la fecha real de la compra.
3. **Validación en la RPC** (C6), con `errcode = 'check_violation'`, antes de insertar y en este
   orden:
   - `p_installments_paid` no nulo con `p_installments_count = 1` →
     `'Las cuotas ya pagadas solo van en una compra en cuotas'`. Con un ingreso o una cuenta que no es
     `credit_card` ya lo frena I6.
   - Negativo, o mayor o igual a `p_installments_count` →
     `'Las cuotas ya pagadas tienen que ser menos que el total de cuotas'`.
   - Coherencia con la fecha: K no puede superar la diferencia en meses entre el período de
     `occurred_on` y el período de hoy (una compra de este mes no puede tener cuotas pagadas) →
     `'Con esa fecha todavía no puede haber tantas cuotas pagadas'`. El mensaje es fijo; el número lo
     agrega el cliente en su propio texto (US-80).
   - Con deudas (`p_shared_persons` de ADR-040) → `'Una compra empezada no se puede compartir'`. El
     tope de I7 se mide contra lo que falta pagar, y ninguna pantalla de V2 manda las dos cosas juntas.
4. **Se modifica I2**: una transacción tiene exactamente `installments_count − installments_paid`
   imputaciones, numeradas de `installments_paid + 1` a `installments_count` sin huecos. I3 no
   cambia: los períodos son consecutivos desde `first_period`.
5. **Modifica el contrato de ADR-035:** cada elemento de `p_rows` de `import_transactions` acepta la
   clave `installments_paid`. Si falta o es `null`, la fila es una compra normal.
6. **Alcance.** En V2 solo la importación por Excel manda `p_installments_paid` (US-80). Registrar no
   cambia. Si algún día lo pide, alcanza con un campo en el paso 3: el contrato ya lo admite.

## Alternativas descartadas

- **Guardar el total y las N imputaciones, con las K primeras en meses pasados.** Es lo que pasa hoy
  con la fecha original. Ensucia meses que el usuario no cargó o cargó de otra forma, y cambia sus
  totales.
- **Guardar el monto total y solo las `N − K` imputaciones.** Rompe I1, que lee la vista de integridad
  y varias consultas del dashboard. Toda consulta que suma montos de transacciones tendría una
  excepción.
- **Que el usuario cargue el monto que falta y la cantidad de cuotas que faltan**, como una compra
  nueva de `N − K` cuotas. Es lo más simple, pero Movimientos mostraría "1/3" en vez de "4/6", y si el
  monto que falta no se divide justo, la cuota base no coincide con la del resumen de la tarjeta.
- **Inferir K de la fecha** (las cuotas que ya pasaron). La fecha de la compra no dice cuándo empieza
  a cobrar la tarjeta (cierre y vencimiento), así que el usuario tiene que decir cuántas le faltan.

## Consecuencias

- Migración: columna, `CHECK`, nueva firma de `create_transaction` (`drop function` + `create
  function`, como ADR-036) y `database.types.ts` regenerado (C15). La vista de integridad pasa a
  comparar el conteo con `installments_count − installments_paid`.
- Lo que ya muestra "n/N" sigue funcionando: Movimientos lee `installment_number` e
  `installments_count`, y una compra empezada muestra "4/6".
- "Cuotas de meses anteriores" del Resumen (`installment_number > 1`) cuenta la primera cuota
  pendiente como heredada. Es correcto: la compra empezó en un mes anterior.
- El diálogo de borrado (US-65) hoy recalcula el prorrateo con `generateLedgerEntries` desde el mes de
  la fecha. Para una compra empezada daría meses y montos equivocados. US-80 exige que muestre los
  meses y montos guardados, ya sea leyendo las imputaciones (ADR-001) o pasando K a la función.
- El CSV de US-47 exporta `monto` = lo que faltaba pagar, `cuotas` = N y `primer_periodo` = el mes de
  la importación. Exportar K queda fuera de V2.
- pgTAP nuevo:
  - `null` igual que hoy, y K = 0 con `first_period` en el período de hoy;
  - K = N − 1 (una sola imputación, la N/N);
  - K = N, K negativo y K con una sola cuota, rechazados;
  - compra del mes actual con K = 1, rechazada;
  - compra empezada con deudas, rechazada;
  - montos con resto en ARS y en USD (US$100 a TC 1000, 3 cuotas, K = 1: imputaciones de US$33,33 y
    US$33,34, de $33.335,00 cada una en pesos), con I1 e I1'.
- ADR-043 §8: una compra empezada no se puede editar; quien implemente US-80 o US-84 segundo agrega la
  guarda (`check_violation` "Una compra empezada no se puede editar") y su criterio en US-84.
- Docs a actualizar al implementar: `04-data-model.md` (columna, I2, nota de `first_period`, vista de
  integridad) y `01-domain-glossary.md` ("compra en cuotas empezada").
