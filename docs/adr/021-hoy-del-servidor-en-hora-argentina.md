# ADR-021 — "Hoy" del servidor es el día calendario de Argentina

**Estado:** aceptada · **Fecha:** 2026-09
**Relacionada:** ADR-020 · FR-06 · C1, C6

## Contexto

FR-06 pide que la fecha de una transacción no sea posterior a hoy. US-09 pide además que una fecha pasada
sea válida, y su criterio de aceptación ([#32](https://github.com/Joaconz/Biyu/issues/32)) exige que la
fecha futura se rechace en cliente y en servidor. El cliente ya lo validaba (`validateTransactionDraft`, con `today` de `src/lib/clock.ts`, C1),
pero `create_transaction` aceptaba cualquier `occurred_on`: una llamada directa a la RPC podía guardar un
gasto del mes que viene y adelantar su imputación (C6).

Para comparar, Postgres necesita su propio "hoy", y el reloj del cliente no sirve porque el cliente lo
puede mandar mal. El problema es la zona horaria. La sesión de Supabase corre en UTC, así que entre las
21:00 y las 23:59 de Argentina `current_date` ya es el día siguiente. En esas tres horas el servidor
aceptaría una fecha de mañana que el cliente bloquea.

## Decisión

`create_transaction` rechaza `p_occurred_on > (now() at time zone 'America/Argentina/Buenos_Aires')::date`
con `check_violation` (23514) y el mensaje `FR-06: la fecha no puede ser posterior a hoy`
(migración `20260928120000_create_transaction_no_future_date.sql`).

- La zona queda fija en la función, no en el rol ni en la base. Biyu es una app para Argentina (ARS/USD) y
  así la regla es explícita y no depende de una configuración que alguien pueda cambiar.
- `now()` es el inicio de la transacción, así que el chequeo es estable dentro de la llamada.
- Las cuotas futuras no se ven afectadas: `occurred_on` es el día de la compra y las cuotas son
  imputaciones. La excepción de FR-06 ("salvo cuota o suscripción futura ya comprometida") no pasa por
  esta fecha. Las suscripciones (V3) crean la transacción recién cuando el mes se cumple (FR-16).

## Alternativas descartadas

- **`current_date` (UTC).** No fija ninguna zona, pero durante tres horas por día acepta el día siguiente.
  El cliente lo bloquea, pero C6 pide que la regla real viva en Postgres y la probamos contra la RPC.
- **Recibir `today` del cliente como parámetro.** Aplica C1 al pie de la letra, pero el servidor
  terminaría validando contra un dato que controla quien llama. Es lo mismo que no validar.
- **Una zona horaria por usuario (columna en un perfil).** Es lo correcto si hubiera usuarios fuera de
  Argentina. Hoy no hay tabla de perfil ni ese caso de uso.

## Consecuencias

- El caso negativo de FR-06 se prueba por la UI y directo contra la RPC
  (`supabase/tests/database/occurred_on.test.sql`), como pide C6.
- Un usuario con el navegador en otra zona adelantada respecto de Argentina (por ejemplo, Europa pasada la
  medianoche de allá) puede ver que el cliente acepta "hoy" y el servidor lo rechaza, con el error de la
  RPC en el toast. Si aparece ese caso, se resuelve con la alternativa de zona por usuario.
- Los tests de base no pueden usar fechas fijas posteriores al día en que corren. Las fechas relativas a hoy
  se calculan con la misma expresión.
