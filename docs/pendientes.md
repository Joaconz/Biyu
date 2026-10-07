# Pendientes

Cambios y mejoras que surgieron al revisar la app y todavía no tienen historia ni defecto abierto.
Los pendientes puramente visuales están en `docs/design/pendientes-ui.md`.

## 1. Cuotas en el template de importación por Excel (nice to have)

Hoy el template de importación no contempla compras en cuotas. Ampliarlo para poder cargarlas por
esa vía, con dos columnas nuevas:

- **Es cuota:** indica si la fila es una compra en cuotas.
- **Cuotas pendientes:** entero de 1 a 24, o vacío (`null`, "no viene nada") cuando no aplica.

Probablemente se resuelva dentro de algún defecto de la importación. Revisar la validación (C6: la
real va en Postgres) y la RPC de importación por lote (ADR-035); el prorrateo sigue la regla C3
(la última cuota absorbe el resto).

## 2. Guía de importación de gastos con Excel

Armar una guía de cómo importar gastos con Excel. Requisitos:

- Se puede saltear.
- Hay un botón que abre un modal con la guía, para quien no sabe cómo hacerlo.
- Por defecto está cerrada: solo aparece al apretar el botón.

## 3. Gastos compartidos con más de una persona

Hoy un gasto compartido se reparte con una sola persona. Permitir compartirlo con más de una.
Impacta el modelo de deudas y reembolsos (`docs/04-data-model.md`, ADR-036 y ADR-037) y la
propiedad cruzada de que las imputaciones sumen el monto (C3). Probablemente necesite un ADR.

## 4. Deudas a favor o en contra no entran en el resumen ni en el neto

Al registrar una deuda a favor o en contra, no aparece en el resumen ni en el neto de lo que tengo.
Hay que vincularla a esos cálculos. Revisar qué lee el dashboard (imputaciones materializadas,
ADR-001) y cómo se relaciona con `debts` (ADR-036).
