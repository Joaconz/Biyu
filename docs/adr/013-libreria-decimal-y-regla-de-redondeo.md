# ADR-013 — Librería decimal y las dos reglas de redondeo del dominio

**Estado:** parcialmente superada por [ADR-016](016-api-python-separada-del-frontend.md) · **Fecha:** 2026-08

> **Las dos reglas de redondeo siguen vigentes sin cambios** —truncar y absorber el resto en
> la última cuota para el prorrateo, half-up para la conversión a ARS— y son el contenido
> valioso de este documento. Lo que quedó obsoleto es la elección de librería decimal para
> TypeScript: en Python los montos usan `decimal.Decimal` de la biblioteca estándar, y el
> módulo de borde que este ADR justificaba se reduce al parseo del input y a serializar los
> montos como string en el JSON (C2).
>
> **Nota posterior.** [ADR-019](019-vuelta-a-supabase.md) volvió a un frontend TypeScript sin
> API propia en Python. La elección de librería decimal de este documento (`decimal.js`)
> vuelve a aplicar del lado del cliente y de las Edge Functions (Deno también corre
> TypeScript); Postgres sigue siendo la fuente de verdad con `numeric(14,2)` y las dos reglas
> de redondeo, ahora aplicadas también en triggers/funciones SQL para las Edge Functions que
> escriben directamente contra la base.

## Contexto

C2 y `03-architecture-spec.md` piden aritmética decimal para los montos, nunca `number`
flotante, sin nombrar todavía una librería. Slice 1 (`generateLedgerEntries`, el módulo de
dinero) es el primer código que necesita una.

Al implementar apareció una segunda pregunta, más importante que la elección de librería:
`generateLedgerEntries` prorratea dos cantidades — la cuota en la moneda original y la cuota
en ARS — y cada una necesita una regla de redondeo distinta. Usar la misma regla para las dos
rompe una invariante.

## Alternativas evaluadas (librería)

**A. `number` flotante.** Descartada por el propio C2: `0.1 + 0.2` no es `0.3`, y eso rompe
la invariante principal del sistema (I1) en silencio.

**B. `big.js`.** Más chica (~4KB gzip) y con API mínima. Pero el modo de redondeo se
configura en `Big.RM`, un global mutable — o hay que pasarlo en cada `.round()` sin poder
apoyarse en un default seguro. En un módulo que necesita dos reglas de redondeo distintas en
el mismo archivo (ver más abajo), un default global es exactamente el tipo de estado
compartido que se quiere evitar.

**C. `bigint` en centavos, sin dependencia.** `numeric(14,2)` como enteros de centavos,
`fx_rate` como enteros de diezmilésimos. Cero dependencias y exacto por construcción — en
algún sentido, más elegante que una librería decimal. Descartada por ahora: contradice
`03-architecture-spec.md`, que pide explícitamente "una librería decimal (no `number`)"; para
adoptarla habría que editar el spec, no solo el código, y ese spec no está a discusión en
este slice.

**D. `decimal.js`.** Elegida. Constructor que valida el string de entrada, modos de redondeo
(`Decimal.ROUND_DOWN`, `Decimal.ROUND_HALF_UP`, ...) explícitos por llamada a través de
`toDecimalPlaces(dp, rounding)`, sin depender de un default global. Tamaño (~12KB gzip) es
irrelevante en Slice 1 porque no corre en el cliente todavía; cuando la previsualización de
cuotas de `/register` (Slice 2) lo traiga al bundle del browser, sigue siendo un costo menor
frente al riesgo de C.

## Decisión

`decimal.js`, pinneada a versión exacta como el resto de `package.json`. Vive detrás de
`src/domain/money.ts`, el único módulo que la importa directamente — el resto del dominio
recibe y devuelve el tipo `Decimal` sin conocer la librería por su nombre, para no repetir en
todo el código la decisión de esta ADR si algún día cambia.

### Las dos reglas de redondeo

`generateLedgerEntries` calcula dos series de cuotas a partir del mismo total, y cada una usa
una regla distinta:

1. **Prorrateo de cuotas — truncar hacia abajo + absorción del resto (C3).** Cada cuota
   `1..N-1` es `total / N` truncado a 2 decimales (`ROUND_DOWN`); la cuota `N` es
   `total − suma(1..N-1)`. Con `ROUND_HALF_UP` en cambio de `ROUND_DOWN`, la última cuota
   puede quedar **menor** que las demás: `$1,00` en 8 cuotas da `0.125` por cuota, que
   redondeado half-up da `0.13`; siete cuotas de `0.13` sumadas son `0.91`, y a la última le
   quedarían `0.09` — menos que las otras siete. Eso contradice "la última absorbe el resto"
   del glosario y del ejemplo trabajado de `04-data-model.md`. Truncar deja siempre algo para
   que la última cuota absorba, nunca de menos.

2. **Conversión a ARS — half-up (`ROUND_HALF_UP`).** Tiene que replicar bit a bit la columna
   generada `round(amount * coalesce(fx_rate, 1), 2)` de `schema.ts` — el `round()` de
   Postgres sobre `numeric` redondea half-away-from-zero, que con montos siempre positivos
   (I4) es exactamente `ROUND_HALF_UP`. Si el dominio usara otra regla acá, la vista
   `ledger_integrity_violations` empezaría a devolver filas: `transactions.amount_ars` (la
   columna generada) y la suma de `ledger_entries.amount_ars` (calculada en el dominio, ver
   I1' en `04-data-model.md`) divergirían en el centavo del punto de empate.

**No es la misma cuenta hecha dos veces.** `amountArs` de cada cuota no es
`convertToArs(cuota.amount, fxRate)` — es el prorrateo (regla 1) del **total ya convertido**
(regla 2). Convertir cuota a cuota y redondear cada una desvía hasta un centavo contra
`transactions.amount_ars`; es justamente el escenario que motiva I1' (ver
`04-data-model.md`, sección I1').

## Consecuencias

- **A favor:** las dos reglas quedan explícitas y testeadas por separado (`prorate` y
  `convertToArs` en `tests/domain/money.test.ts`), en vez de una única función `round()`
  usada con dos intenciones distintas y comentarios para no confundirlas.
- **En contra:** dos primitivas de redondeo en el mismo módulo es más superficie que un
  `round()` genérico. Se acepta porque la alternativa — una sola regla — es la que produce el
  bug de un centavo contra I1' o el de la cuota decreciente contra C3.
- **Deuda anotada, no resuelta acá:** si `03-architecture-spec.md` alguna vez se revisita
  para adoptar la alternativa C (bigint en centavos), esta ADR queda obsoleta y hay que
  reemplazarla, no extenderla.
