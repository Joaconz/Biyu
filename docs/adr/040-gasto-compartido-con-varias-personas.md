# ADR-040 — Un gasto se comparte con hasta 10 personas, cada una con su monto

**Estado:** propuesta · **Fecha:** 2026-10
**Relacionada:** ADR-006, ADR-013, ADR-034, ADR-037 · Modifica ADR-036 (puntos 1, 2, 5 y 6)

## Contexto

ADR-036 resolvió el gasto compartido de US-34 con **una** persona: `create_transaction` recibe
`p_shared_person` y `p_shared_amount`, y su punto 6 dejó fuera de V2 repartir un gasto entre varias
personas. US-82 ([#270](https://github.com/Joaconz/Biyu/issues/270)) lo pide: una cena de $120.000
entre cuatro, donde tres le deben su parte al usuario.

El esquema ya lo admite. `debts.transaction_id` no es único, y el trigger de I7 compara la **suma**
de las deudas vinculadas contra el gasto. Falta decidir el contrato de la RPC, cómo se valida y cómo
se reparte.

## Decisión

1. **`create_transaction` reemplaza `p_shared_person text` y `p_shared_amount numeric` por
   `p_shared_persons text[]` y `p_shared_amounts numeric[]`** (`default null`), en el mismo lugar de
   la firma. Se hace `drop function` + `create function` para que PostgREST no vea dos sobrecargas.
   La posición `i` de cada arreglo es una deuda. Un llamado sin los dos crea el gasto sin deudas,
   igual que hoy.
2. **Validación** (C6), con `errcode = 'check_violation'`, antes del primer `insert` y en este orden
   (el primero que falla es el que se informa):
   1. Un ingreso con deudas → `'Un ingreso no se puede compartir'` (igual que ADR-036).
   2. Uno solo de los dos arreglos nulo, o largos distintos →
      `'Un gasto compartido necesita una persona y un monto por cada deuda'`. Los dos nulos: sin deudas.
   3. Arreglos vacíos → `'Un gasto compartido necesita al menos una persona'`.
   4. Más de 10 elementos → `'Un gasto se comparte con hasta 10 personas'`.
   5. Cada persona y cada monto, en el orden de los arreglos, con las reglas de ADR-036 §5 y sus mismos
      mensajes (recorte, vacía, más de 60 caracteres, monto `<= 0`, más de 2 decimales, menos de $0,01
      en pesos).
   6. Dos personas iguales después del recorte, sin distinguir mayúsculas →
      `'Cada persona puede aparecer una sola vez'`.
   7. Tope en la moneda del gasto. Con una persona, el mensaje de siempre:
      `'I7: la deuda no puede superar el monto del gasto'`. Con dos o más, si la suma supera el gasto:
      `'I7: la suma de las deudas no puede superar el monto del gasto'`. Igual al gasto se acepta.
   8. Tope en pesos, solo en USD: la suma de `round(monto_i × fx_rate, 2)` no puede superar el
      `amount_ars` del gasto. Por el redondeo de cada deuda, una suma igual en dólares puede pasarse
      por centavos en pesos, y el trigger de I7 la rechazaría con un mensaje crudo →
      `'I7: en pesos, la suma de las deudas supera el gasto por redondeo'`.

   Los parámetros se pasan por nombre (PostgREST), así que la posición en la firma no importa. Junto con
   ADR-034 (`p_request_id`) y ADR-039 (`p_installments_paid`), la firma final es la de la última
   migración que se aplique, y cada una la reemplaza entera con `drop function` + `create function`.
3. **El servidor deriva lo mismo que en ADR-036 §4** para cada deuda: dirección, estado, moneda,
   `fx_rate`, `incurred_on` y `transaction_id`. Las deudas se crean en el orden de los arreglos, en la
   misma transacción que el gasto (C4): todas o ninguna.
4. **El reparto lo decide el usuario.** Cada persona tiene su monto. "Dividir en partes iguales" es
   una ayuda del formulario, no una regla de la base. Divide el gasto entre las personas **y el
   usuario** (n + 1 partes): a cada persona le toca la parte truncada a 2 decimales, y el usuario
   absorbe el resto, como la última cuota en C3. La función vive en `src/domain/` (C1).
5. **Orden en pantalla.** Donde se listan varias personas de un mismo gasto (etiqueta de
   Movimientos, diálogo de borrado, aviso de guardado), se ordenan alfabéticamente sin distinguir
   mayúsculas ni tildes, y a igual nombre así comparado ("Sofía" y "Sofia"), por el texto tal cual. El
   orden de creación no es observable: todas comparten `created_at`. Por lo mismo, la pantalla Deudas
   (US-38) desempata las deudas con igual fecha y `created_at` por persona, con la misma regla, y
   después por `id`.
6. **US-70 (ADR-034):** la clave de idempotencia cubre el gasto y todas sus deudas, y el borrador
   pendiente guarda la lista entera.

## Alternativas descartadas

- **Mantener los parámetros escalares y sumar arreglos para "las demás personas".** Hay dos formas de
  mandar a la primera persona y cada validación se duplica.
- **Un parámetro `p_shared jsonb`** (`[{"person": "Sofía", "amount": 40000}]`). ADR-036 ya lo descartó:
  el tipo de cada campo pasa a validarse a mano y los casos negativos por API son más difíciles de
  escribir. Dos arreglos se escriben igual de fácil en un `curl`.
- **Solo partes iguales.** No sirve cuando cada uno consumió distinto, que es el caso más común en una
  cena.
- **Una deuda por persona en llamadas separadas.** Rompe C4: si falla la tercera, quedan dos deudas y
  un gasto que dice "compartido" a medias.

## Consecuencias

- Cambia el contrato de la RPC (C15). Los criterios por API de US-34 (CA-8) y US-41 (CA-5) pasan a
  escribirse con los arreglos: un elemento en cada uno. Los mensajes del servidor no cambian para una
  persona. Los tests pgTAP de esas historias se migran en el mismo PR.
- `import_transactions` (ADR-035) no manda deudas: no le afecta, siempre que llame a
  `create_transaction` con parámetros nombrados.
- Las pantallas que muestran una deuda por fila (Deudas, US-37 a US-40, US-79) no cambian: cada
  persona es una deuda más. El neto de reembolsos (US-30, ADR-037 §6) ya suma todas las deudas
  vinculadas del gasto.
- pgTAP nuevo: dos y diez personas; once rechazadas; largos distintos; arreglos vacíos; persona
  repetida con otra mayúscula; suma igual al gasto aceptada y con un centavo más rechazada; en USD,
  US$3,00 a TC 1000,005 con tres deudas de US$1,00 rechazada por el tope en pesos; una persona
  inválida en el medio no deja ninguna fila (C4); un ingreso con 11 personas informa el primer error
  del orden.
- Docs a actualizar al implementar: `04-data-model.md` (I7 ya habla de la suma; se aclara que un
  gasto puede tener hasta 10 deudas vinculadas) y la nota de ADR-036 §6, que queda reemplazada por
  este ADR.
