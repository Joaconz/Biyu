# ADR-052 — Rebranding esmeralda, con tema claro y oscuro

**Estado:** propuesta; lo que dice del Balance (su tarjeta con número e insignia) lo reemplaza [ADR-053](053-un-solo-numero-de-gasto-neto-en-el-resumen.md) · **Fecha:** 2026-11
**Relacionada:** ADR-023 (reemplaza sus puntos «Solo modo claro», «Sin sombras ni degradados», los radios de
8 px y la lista con filetes), ADR-048 (cambia el color de la barra, no su forma), ADR-051 (el desglose del
Balance pasa a la hoja), ADR-055 (reemplaza, en el punto 6, la fila de categoría en Ajustes) · US-25, US-38, US-84, US-101
Balance pasa a la hoja), ADR-053 (la tarjeta de Balance desaparece) · US-25, US-38, US-84, US-101

## Contexto

Las pantallas de lectura seguían el ADR-023: superficies de papel con filetes, radios de 8 px y un solo
tema claro. El Resumen apilaba cuatro montos en dos tarjetas (gastado, ingresos, balance y su desglose),
cada fila de Movimientos tenía su botón de eliminar y las de Deudas apilaban tres acciones bajo el monto.
Un primer pase de «aire» (rama `ux/aire-general`, sin PR) sumó espaciado sin cambiar nada de eso y no se
notó. El pedido fue un rebranding con las apps de finanzas actuales como referencia: un número
protagonista por tarjeta, superficies grandes y redondeadas, poco texto, filas altas y tema oscuro.

## Decisión

1. **Paleta esmeralda en dos temas.** `src/index.css` define los tokens claros en `:root` (fondo crema
   `#f3ecdc`, tarjeta `#fbf8f1`, tinta `#0b2b26`, primario oliva `#1a422f`) y los oscuros en `.dark` (fondo
   `#051f20`, tarjeta `#0b2b26`, texto `#daf1de`, primario `#8eb69b`, la paleta del PR #397). La variante
   `dark:` de Tailwind sigue a la clase (`@custom-variant dark (&:where(.dark, .dark *))`), no al sistema.
2. **El tema lo elige el usuario.** Ajustes → Apariencia ofrece Automático, Claro u Oscuro
   (`settings-theme-*`). Se guarda en `localStorage` (`biyu-theme`). Es una preferencia de este dispositivo,
   no un dato, así que no va a Postgres. Un script en línea en `index.html` pone `.dark` antes del primer
   pintado (sin destello). En «Automático», `matchMedia` sigue al teléfono. `theme-color`, `color-scheme`
   y los toasts siguen al tema resuelto. La lógica es pura (`src/lib/theme.ts`) y está probada en Vitest.
3. **Una tarjeta protagonista por pantalla, esmeralda en los dos temas.** La utilidad `hero` es el único
   degradado de la app: un radial del acento sobre `#0b2b26`, que se apaga con `prefers-contrast: more`.
   La protagonista es lo gastado en el Resumen, el saldo en Deudas, lo comprometido en Suscripciones y el
   total en el detalle de una categoría. En el Resumen lleva además tres accesos redondos (Registrar,
   Movimientos, Importar: `dashboard-action-*`).
4. **Un número por tarjeta.** El Balance muestra solo su número y su insignia. El desglose (ingresos,
   gastos, lo que entra o queda afuera) se mueve a la hoja/popover de ADR-051, debajo del balance en vivo.
   Cuotas anteriores, días con registro y neto de reembolsos van en datos chicos. Los centavos de un monto
   grande se ven más chicos y apagados (`<Amount>`, `splitAmountText`), pero el texto es el mismo
   (`$436.850,50`), así que lectores de pantalla y tests leen igual.
5. **Forma.** Radios de 20–32 px en tarjetas y diálogos, píldoras en botones, campos de 48 px, segmentados
   y filtros. Las listas no llevan filetes: las filas (72 px, ícono en círculo de 44 px) se separan por
   su aire. Sin sombras grises, salvo la de los diálogos.
6. **Filas sin botones.** Tocar una fila de movimiento abre Editar (enlace «estirado», `*-edit`), y
   «Eliminar movimiento» está al pie de esa pantalla (`edit-transaction-delete`), con el diálogo de
   siempre (US-94). La marca de suscripción queda por encima y sigue llevando a su detalle (US-61). En
   «Eliminados» la fila conserva Restaurar y Eliminar definitivamente (US-85). En Deudas las acciones van
   en un renglón al pie de cada tarjeta. En Ajustes, el nombre de la categoría abre su edición (el lápiz
   queda como pista), así entra entero a 360 px. _ADR-055 reemplaza esto último: las categorías pasan a su
   propia pantalla y el renglón entero abre una hoja de edición._
7. **Movimientos es una lista continua.** Una sola tarjeta con el día como rótulo de cada tramo. El mes y el
   filtro Activos/Eliminados van centrados debajo del título, y «‹ Resumen» sube arriba del título grande.
8. **Colores de categoría en oscuro.** La paleta apagada se aclara con 30 % de blanco
   (`darkCategoryColor`). Con eso queda en 4,2:1 o más contra la tarjeta oscura, por encima del 3:1 de
   WCAG 1.4.11 para gráficos. Barras, dona y detalle lo toman de `useResolvedTheme()`.
9. **La barra flotante** de ADR-048 es esmeralda en los dos temas. Su forma, su indicador y sus testids no
   cambian.

### Contrastes (WCAG 2.2)

| Par | Claro | Oscuro |
|---|---|---|
| Texto sobre fondo | 12,9:1 | 14,4:1 |
| Texto sobre tarjeta | 14,3:1 | 12,7:1 |
| Secundario sobre tarjeta | 5,8:1 | 7,1:1 |
| Primario sobre tarjeta | 10,6:1 | 6,7:1 |
| Déficit sobre tarjeta | 7,8:1 | 5,2:1 |
| Aviso sobre su superficie | 4,9:1 | 8,0:1 |
| Borde de control sobre tarjeta (1.4.11) | 3,4:1 | 3,3:1 |
| Foco sobre fondo (1.4.11) | 3,4:1 | 8,2:1 |

En la protagonista, la crema sobre esmeralda da 12,7:1, el rótulo apagado 8,0:1 (4,6:1 sobre el pico del
brillo) y el oro del aviso de suscripciones 7,2:1.

## Alternativas descartadas

- **Solo agregar aire al diseño de ADR-023.** Se probó en `ux/aire-general` y no cambió la experiencia:
  misma estructura, mismos filetes, mismo texto.
- **Tema oscuro fijo.** Las referencias eran oscuras, pero de día y al sol el claro se lee mejor, y el
  sistema ya ofrece la preferencia. Por eso hay selector, con «Automático» por defecto.
- **Guardar el tema en `user_preferences`.** Seguiría al usuario entre dispositivos, pero exige una
  migración, RLS y su par pgTAP (C7) para algo que es de la pantalla, y el primer pintado tendría que
  esperar a la red: habría destello.
- **Menú «⋯» en cada fila para eliminar.** Mantiene la acción a un toque menos, pero vuelve a poner un
  botón en cada fila, y borrar un gasto es raro. Editar ya es el lugar donde se revisa un movimiento.

## Consecuencias

- El Resumen se lee de un vistazo: un número grande, un balance y tres datos chicos. El costo es que el
  desglose del Balance necesita un toque más, en la hoja que ya existía.
- Eliminar un movimiento pasa de un toque a dos (fila → Eliminar). Los casos y los e2e que borraban desde
  la lista ahora entran a Editar: `transactions-history`, `transactions-purge`, `regression-cuo` y
  `shared-many-people`. Los que leían el desglose abren antes la hoja (`e2e/support/dashboard.ts`).
- No hay cambios de schema, RPC ni RLS (C4, C7). Los montos siguen siendo strings y `decimal.js` (C2):
  `splitAmountText` corta el texto ya formateado. Ningún componente lee el reloj (C1).
- Los testids existentes se conservan. Se suman `dashboard-action-*`, `edit-transaction-delete` y
  `settings-theme*`. Se quitan `transactions-item-delete` y `dashboard-transaction-item-delete`.
- Cada color nuevo tiene que pasar por los dos temas. Los pares de la tabla quedan como referencia.
