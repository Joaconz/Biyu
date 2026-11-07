# ADR-050 — Tendencias y dona en el Resumen

**Estado:** propuesta · **Fecha:** 2026-11 · Modifica parcialmente ADR-038 (alternativa "dona")

## Contexto

El Resumen responde bien "cuánto se gastó este mes" y "en qué" (tarjetas, torta y lista por categoría,
ADR-038), pero no "cómo vengo": no hay forma de ver si el mes va más caro que el anterior, cómo
se compara el gasto con el ingreso a lo largo del tiempo ni cuánto de lo que viene ya está
comprometido por cuotas. Son las preguntas que motivan abrir la app a mitad de mes.

Además, ADR-038 dejó la torta como círculo lleno y descartó la dona con el total en el centro porque
"el total ya está en la tarjeta verde y repetirlo compite con ella".

## Decisión

1. **Tres tarjetas de tendencia, entre las tarjetas de totales y el desglose por categoría:**
   - **Gastado vs ingresos:** los 6 meses que terminan en el período visto, dos columnas por mes sobre una sola escala.
   - **Ritmo del mes:** gasto acumulado por día del mes visto contra el mes anterior, en una sola escala.
   - **Cuotas que vienen:** lo que las compras en cuotas ya cargadas van a imputar en los 6 meses
     siguientes al visto.
2. **La torta pasa a dona** con el total del período en el hueco, en formato compacto ("$510,0 mil"): el monto exacto sigue siendo el de la tarjeta
   "Gastado en", y el hueco no lo repite con todos sus decimales. Los tramos conservan sus `data-testid`, `data-amount`,
   `data-percentage` y ángulos (ADR-038 §5); el filete de 2 px entre tramos y la agrupación en "Resto" no cambian. Sigue sin ser interactiva: la lista es la leyenda y el acceso al detalle (ADR-038 §3).
3. **El ritmo reparte cada imputación en un día del mes** (las imputaciones no tienen día, solo período):
   la primera cuota cae el día de la compra (`occurred_on`, acotado al último día del mes) y las cuotas
   siguientes (número mayor a 1) caen el día 1, porque ya estaban comprometidas al abrir el mes. Así el
   acumulado termina siempre en el mismo total que la tarjeta "Gastado en". En el mes en curso la línea
   se corta en hoy (hora de Argentina, ADR-021) y se compara con el mes anterior **a ese mismo día**; en
   un mes terminado se compara el mes entero. Un mes futuro no tiene línea.
4. **"Cuotas que vienen" es lo comprometido, no una proyección.** Suma solo imputaciones de gastos
   no eliminados que ya existen en `ledger_entries` por delante del período visto. No incluye las suscripciones (nacen mes a mes, ADR-045) ni gastos
   que todavía no se cargaron.
5. **Una sola lectura de datos.** Las tres series salen de una consulta a `ledger_entries` (período de
   hace 5 meses a dentro de 6) con `transactions!inner` y filtro `deleted_at is null` (I10, C10), el monto como texto
   (`amount_ars::text`, C2) y paginada de a 1000 filas, el `max_rows` de PostgREST, con orden estable
   `(period, id)`. Sin migración ni RPC: es lectura de tablas con RLS (C7).
6. **Son datos secundarios (ADR-031, como ADR-045).** Si la consulta falla, las tarjetas no se dibujan y el resto del Resumen sigue. Mientras
   cargan ocupan su lugar con un bloque del alto final. Un gráfico sin nada que mostrar (por ejemplo, sin cuotas por delante) no se dibuja.
7. **Sin librería de gráficos** (ADR-038 §5). Columnas en HTML/CSS y la línea en SVG propio; la lógica en
   `src/domain/dashboardTrends.ts` con `decimal.js` y `today` como parámetro (C1, C2).
8. **Color y lectura.** Gastos en el verde cazador de la tarjeta "Gastado en" (`--primary`), ingresos en ocre
   (`--chart-5`) y el mes anterior en el gris de borde de control (`--input`). El verde y el ocre se validaron con
   el validador de la skill `dataviz`: se distinguen con visión normal (ΔE 28) y con daltonismo (ΔE 24 en el peor caso) y ambos pasan
   el contraste 3:1 con la superficie; el verde cazador queda fuera de la banda de luminosidad de esa herramienta porque es el
   color de marca (ADR-023), así que el color nunca va solo: cada gráfico tiene leyenda y una lectura con los
   montos exactos, y hay una tabla oculta para lectores de pantalla. Cada mes de las columnas es un botón que muestra sus
   montos arriba (el equivalente al tooltip en el celular, sin tapar el gráfico); el ritmo es un deslizador (puntero o flechas) que elige el día.

## Alternativas descartadas

- **Mantener la torta de círculo lleno.** Es lo decidido en ADR-038, pero la dona deja el hueco para el total y
  no cuesta nada: los ángulos siguen saliendo del monto exacto y la lista sigue siendo la lectura precisa. El argumento de ADR-038 contra la
  dona (que el total del centro compite con la tarjeta verde) se resuelve con el formato compacto y el rótulo "Total", sin los decimales.
- **Recharts u otra librería.** Resuelve tooltips y animaciones, pero suma decenas de kB, trae su propio formato de números
  (habría que pisarlo para no usar `number` en los montos, C2) y hace los gráficos más difíciles de verificar por `data-*`. Mismo
  razonamiento que ADR-038.
- **Ritmo con una imputación por día de carga (`created_at`).** Mide cuándo se registró, no cuándo se gastó, y hace que el gráfico
  cambie según el hábito de carga y no según el gasto.
- **Ritmo con las cuotas siguientes en el día de la compra original.** Deja el total del ritmo por debajo de "Gastado en"
  hasta que pase el día de cada cuota, y dos cifras del mismo mes que no coinciden confunden más que lo que aclaran.
- **Una RPC o vista que agregue las series en Postgres.** Evita el tope de 1000 filas, pero agrega una migración
  y su par de tests pgTAP para tres series chicas; la paginación del cliente alcanza hoy.
- **Proyectar el gasto del mes (promedio × días que faltan).** Es una predicción con una regla arbitraria que el usuario no pidió: el ritmo
  muestra el dato y deja la conclusión al lector.

## Consecuencias

- **ADR-038 cambia en un punto.** La torta es ahora una dona; la lista, el filete, la agrupación en "Resto" y los testids no cambian. Se actualizó su encabezado y su alternativa "Dona con el total en el centro".
- **No toca schema, RPC ni RLS.** Lee `ledger_entries` y `transactions`, que ya tienen sus políticas (C7).
- **Costo de lectura.** El Resumen hace una consulta más, de hasta 12 meses de imputaciones, en paralelo con las demás. Con muchos movimientos
  son varias páginas de 1000 filas; si se vuelve lento, el paso siguiente es la agregación en Postgres.
- **Costo de prueba.** Estados nuevos: mes en curso, mes terminado y mes futuro del ritmo; meses de 28, 30 y 31 días (la escala toma el más largo); cuotas
  que cruzan el año; gráficos vacíos; falla de la consulta (el Resumen sigue). La lógica queda cubierta en `tests/domain/dashboard-trends.test.ts`.
- **Trazabilidad.** Faltan la historia y los casos de prueba de estos gráficos en `docs/08-trazabilidad.md`
  (no entra en este cambio).
