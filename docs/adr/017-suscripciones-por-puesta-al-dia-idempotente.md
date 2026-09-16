# ADR-017 — Las suscripciones se generan por puesta al día idempotente

**Estado:** aceptada
**Relacionada:** ADR-001 (imputaciones materializadas), [ADR-019](019-vuelta-a-supabase.md), `06-suscripciones.md`

> **Nota posterior.** Este documento se escribió cuando la puesta al día corría como una
> dependencia de FastAPI, antes de resolver cualquier endpoint. Con [ADR-019](019-vuelta-a-supabase.md)
> no hay servidor de aplicación que la dispare automáticamente: corre como una **Edge
> Function** (`run-subscription-catchup`), invocada explícitamente por el cliente apenas
> resuelve la sesión, antes de renderizar el dashboard. El razonamiento de este ADR —por qué
> es al entrar y no por cron, y por qué la idempotencia depende de la función pura más el
> índice único, no de la disciplina del código— no cambia. Ver `03-architecture-spec.md`,
> Technical Decisions §4.

---

## Contexto

Se agrega el registro de gastos recurrentes mensuales: Netflix, el gimnasio, el hosting. Una
suscripción es una regla que tiene que producir una transacción por mes, sin que el usuario
la cargue a mano.

La pregunta es **cuándo** se materializa cada ocurrencia. Es la única decisión no obvia de la
feature: el resto es un ABM.

## Decisión

**Al entrar el usuario a la app**, antes de resolver cualquier endpoint autenticado, el
servidor ejecuta una puesta al día: genera las transacciones de los períodos vencidos que
todavía no existen, y ninguna más. Sin cron, sin worker, sin estado entre corridas.

La corrección depende de una sola propiedad: **la puesta al día es idempotente**. Se
garantiza en dos capas independientes — la función pura de dominio no propone un período que
ya está generado, y la base tiene un índice único sobre `transactions (subscription_id,
subscription_period)` que haría fallar el insert igual si el dominio se equivocara (I11).

## Alternativas descartadas

**Job programado (cron o worker).** Es lo que haría un producto real: un proceso corre todos
los días y genera lo que vence. Se descartó por tres razones. Suma infraestructura que ni
Render ni Vercel dan gratis de forma cómoda. Es difícil de demostrar en una defensa oral —hay
que esperar a mañana o falsear el reloj—. Y sobre todo, es difícil de testear
determinísticamente: la lógica queda acoplada al momento en que corre el proceso, en vez de
recibir la fecha como parámetro. Con puesta al día, `today` es un argumento de una función
pura y "no abrí la app en tres meses" es un test de una línea.

**Confirmación manual del usuario.** El sistema propone las ocurrencias vencidas y el usuario
acepta o descarta cada una. Es más honesto con la realidad (nadie garantiza que el débito
haya salido) y evita datos inventados. Se descartó porque mete fricción exactamente en el
flujo que el proyecto quiere que sea de diez segundos, y porque contradice el propósito de la
feature: si hay que confirmar mes a mes, es lo mismo que cargarlo a mano. Queda anotada como
una mejora posible: un indicador de "generada automáticamente, no confirmada" sobre las
transacciones de suscripción, sin bloquear nada.

**Cálculo al leer, sin materializar.** El dashboard sumaría las ocurrencias derivándolas de
la suscripción en vez de leerlas de `transactions`. Se descartó por la misma razón que
ADR-001 descartó calcular las imputaciones al leer: la ocurrencia dejaría de ser editable y
borrable individualmente, y el dashboard tendría dos fuentes distintas de gasto que sumar y
mantener consistentes.

## Consecuencias

**A favor:**

- Cero infraestructura nueva más allá de lo que Supabase ya provee. La feature es una función pura más una Edge Function invocada por el cliente (ver nota posterior arriba).
- La lógica es determinística y testeable sin tocar el reloj del sistema.
- Una ocurrencia generada es una transacción como cualquier otra: se edita, se borra, se categoriza y suma en el dashboard sin código especial. **El dashboard no sabe que las suscripciones existen.**
- La idempotencia está garantizada por la base, no por la disciplina del código.

**En contra:**

- **Si el usuario no entra, no se genera nada.** Los meses aparecen recién cuando vuelve. Es aceptable porque el sistema registra el pasado, no notifica ni cobra: no hay ninguna acción que dependa de que la fila exista antes de que alguien la mire.
- La puesta al día agrega latencia al primer pedido de cada sesión. Con cincuenta suscripciones y dos años de atraso hay que verificar que siga siendo tolerable; está anotado como caso de prueba en `06-suscripciones.md`.
- Dos pedidos concurrentes del mismo usuario pueden disparar la puesta al día a la vez. Uno de los dos pierde contra el índice único: el manejo correcto es degradar a "ya estaba generado", no propagar un error 500. También tiene su caso de prueba.
- Un período borrado por el usuario no se regenera nunca, porque el índice único no filtra por `deleted_at`. Es la decisión correcta —borrar es una decisión del usuario— pero significa que no hay forma de "recuperar" una ocurrencia borrada por error salvo cargarla a mano.
