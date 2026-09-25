# Matriz de trazabilidad

_Une cada requerimiento de la pre-entrega (FR/NFR) con las historias de usuario, los issues del
tablero y los casos de prueba. Es el índice que permite argumentar cobertura: un requerimiento sin
historia, una historia sin issue o un issue sin casos es un hueco visible._

## Cómo se lee

- **Fuente de cada columna.** FR y NFR: `pre-entrega.md` §3 y §4. Historias: `02-behavior-spec.md`
  (1 a 51, 64 y 65) y `06-suscripciones.md` (52 a 63). Invariantes I*: `04-data-model.md`.
  Constraints C*: `03-architecture-spec.md`. Issues: [tablero Biyu](https://github.com/users/Joaconz/projects/3).
- **Precedencia.** La pre-entrega es la foto entregada el 2026-09-02 y no se reescribe. Donde
  difiere de la spec, manda la spec (`02-behavior-spec.md`, `06-suscripciones.md`,
  `roadmap.md`, revisados el 2026-09-16). La columna "Estado" deja escrita cada diferencia.
- **Casos.** La columna "Casos" se completa con los IDs `CP-<módulo>-<nnn>` a medida que se
  diseñan (`/new-test-case`, [#74](https://github.com/Joaconz/Biyu/issues/74)). Una historia no pasa a "Hecho" sin casos ejecutados.
- **Alcance de los issues.** Solo V1 tiene una historia por issue. V2 y V3 tienen su épica; las
  historias se abren como sub-issues al planificar cada sprint, para no escribir pasos contra una
  UI que todavía no existe.

## Requerimientos funcionales

| FR | Versión | Historias | Issue | Estado |
|---|---|---|---|---|
| FR-01 | V1 | US-50, US-51 | [#9](https://github.com/Joaconz/Biyu/issues/9) | Se mantiene |
| FR-02 | V1 | US-48 | [#9](https://github.com/Joaconz/Biyu/issues/9), [#71](https://github.com/Joaconz/Biyu/issues/71) | Se mantiene. Se prueba con el par pgTAP por tabla (C7) |
| FR-03 | V1 | US-49, US-64 | [#9](https://github.com/Joaconz/Biyu/issues/9) | Se mantiene. US-64 se agregó porque cerrar sesión no tenía historia. Plazo de inactividad a confirmar al implementar (sugerido: 30 días) |
| FR-04 | V1 | US-43 | [#10](https://github.com/Joaconz/Biyu/issues/10) | Se mantiene (ADR-014) |
| FR-05 | V1 | US-42, US-44, US-45 | [#10](https://github.com/Joaconz/Biyu/issues/10) | Se mantiene |
| FR-06 | V1 | US-01 a US-11 | [#11](https://github.com/Joaconz/Biyu/issues/11) | Se mantiene |
| FR-07 | V3 | — | [#23](https://github.com/Joaconz/Biyu/issues/23) | **Ajustado**: la pre-entrega lo ponía en V2; `roadmap.md` lo mueve a V3 como la mejora que genera más regresión (ADR-009) |
| FR-08 | V1 | US-18, US-65 | [#15](https://github.com/Joaconz/Biyu/issues/15), [#12](https://github.com/Joaconz/Biyu/issues/12) | Se mantiene. US-65 se agregó porque la baja de una transacción suelta no tenía historia |
| FR-09 | V1 | US-12, US-13, US-14 | [#12](https://github.com/Joaconz/Biyu/issues/12) | **Ajustado**: de 1 a 12 cuotas, no de 2 a 24 (`roadmap.md` §V1; valores límite 0, 1, 2, 12, 13 en `07-plan-de-testing.md` §3). El tope vive en `transactions_installments_max` y en `create_transaction` ([#70](https://github.com/Joaconz/Biyu/issues/70), ADR-020) |
| FR-10 | V1 | US-15 | [#12](https://github.com/Joaconz/Biyu/issues/12) | Confirmado: la última cuota absorbe el resto (C3, ADR-013) |
| FR-11 | V1 | US-15 | [#12](https://github.com/Joaconz/Biyu/issues/12) | Se mantiene. Se garantiza en `create_transaction` y se verifica con la vista de integridad (I1, I1'): no se puede expresar como check de tabla |
| FR-12 | V1 | US-19 a US-22, US-46 | [#13](https://github.com/Joaconz/Biyu/issues/13), [#10](https://github.com/Joaconz/Biyu/issues/10) | **Ajustado**: tipo de cambio de referencia cargado a mano por período, con override por transacción; sin API externa (`02-behavior-spec.md` §Out of Scope) |
| FR-12.1 | V1 | US-20, US-21 | [#13](https://github.com/Joaconz/Biyu/issues/13) | Absorbido por FR-12: la carga manual es el camino normal, no el de respaldo |
| FR-13 | — | — | — | **Fuera de alcance**: el ciclo de cierre de la tarjeta se ignora (`02-behavior-spec.md` supuesto 2; `roadmap.md` §V3+) |
| FR-14 | — | — | — | **Fuera de alcance**, por la misma razón que FR-13 |
| FR-15 | V2 | US-52 | [#17](https://github.com/Joaconz/Biyu/issues/17) | Se mantiene, solo mensual |
| FR-16 | V2 | US-53, US-55 | [#17](https://github.com/Joaconz/Biyu/issues/17) | **Ajustado**: los períodos futuros **no** anticipan suscripciones (`02-behavior-spec.md` supuesto 9; `06-suscripciones.md` R1 y R5) |
| FR-17 | V2 | US-56, US-57, US-58 | [#17](https://github.com/Joaconz/Biyu/issues/17) | Se mantiene |
| FR-18 | V2 | US-34 a US-36, US-41 | [#18](https://github.com/Joaconz/Biyu/issues/18) | Se mantiene |
| FR-19 | V2 | US-30 | [#18](https://github.com/Joaconz/Biyu/issues/18) | **Ajustado**: el número principal del dashboard es el bruto y el neto de reembolsos es un KPI secundario (`02-behavior-spec.md` supuesto 4) |
| FR-20 | V1 | US-16, US-23 a US-25, US-27 a US-29, US-31 a US-33 | [#14](https://github.com/Joaconz/Biyu/issues/14) | **Parcial**: el desglose por categoría y por cuenta entra en V1 (la pre-entrega lo ponía en V2). Los gráficos de torta y de evolución quedan en decisión: [#78](https://github.com/Joaconz/Biyu/issues/78) |
| FR-21 | V1 | US-26 | [#14](https://github.com/Joaconz/Biyu/issues/14) | Se mantiene, sin anticipar suscripciones (ver FR-16) |
| FR-22 | V2 | US-47 | [#19](https://github.com/Joaconz/Biyu/issues/19) | Se mantiene |

## Requerimientos no funcionales

La versión sale de `pre-entrega.md` §5. Todos pasan por el checklist de calidad de redacción
([#73](https://github.com/Joaconz/Biyu/issues/73), `/speckit-checklist` sobre `specs/nfr/`), que decide si cada uno tiene umbral medible y
en qué versión se prueba. Hasta entonces, esta tabla es la propuesta.

| NFR | Atributo | Versión | Issue | Estado |
|---|---|---|---|---|
| NFR-01 a NFR-03 | Rendimiento | V2 | [#20](https://github.com/Joaconz/Biyu/issues/20) | A revisar en [#73](https://github.com/Joaconz/Biyu/issues/73). `roadmap.md` §V2 fija además "< 1 s con 500 transacciones sintéticas" |
| NFR-04, NFR-05 | Compatibilidad | V2 | [#20](https://github.com/Joaconz/Biyu/issues/20) | A revisar en [#73](https://github.com/Joaconz/Biyu/issues/73) |
| NFR-06 a NFR-08 | Usabilidad y accesibilidad | V2 | [#20](https://github.com/Joaconz/Biyu/issues/20) | A revisar en [#73](https://github.com/Joaconz/Biyu/issues/73) |
| NFR-09, NFR-10 | Confiabilidad | V2 | [#20](https://github.com/Joaconz/Biyu/issues/20) | A revisar en [#73](https://github.com/Joaconz/Biyu/issues/73) |
| NFR-11 | Confiabilidad | — | — | **No aplica**: sin API de cotización no hay falla que tolerar (ver FR-12) |
| NFR-12 | Seguridad | V1 | [#72](https://github.com/Joaconz/Biyu/issues/72) | HTTPS lo da Vercel; se verifica en la prueba de humo |
| NFR-13 | Seguridad | V1 | [#71](https://github.com/Joaconz/Biyu/issues/71), [#61](https://github.com/Joaconz/Biyu/issues/61) | Par pgTAP por tabla (C7) |
| NFR-14 | Seguridad | V1 | [#63](https://github.com/Joaconz/Biyu/issues/63) | Delegado en Supabase Auth |
| NFR-15 a NFR-18 | PWA | En decisión | [#77](https://github.com/Joaconz/Biyu/issues/77) | La pre-entrega los pone en V2; `02-behavior-spec.md` deja la PWA para V3+ |
| NFR-19, NFR-20 | Mantenibilidad | V3 | [#22](https://github.com/Joaconz/Biyu/issues/22) | Se mantiene |

## V1: historias y tareas por épica

Milestone **V1**. Las prioridades son las del tablero: P0 bloquea el cierre de V1, P1 entra en V1,
P2 entra si alcanza el sprint.

### Fundación técnica · [#8](https://github.com/Joaconz/Biyu/issues/8)

| Tarea | Issue | Prioridad |
|---|---|---|
| Rutas y período en la URL | [#67](https://github.com/Joaconz/Biyu/issues/67) | P0 |
| Base de UI: Tailwind, shadcn/ui y data-testid | [#68](https://github.com/Joaconz/Biyu/issues/68) | P0 |
| Dominio puro con decimal.js | [#69](https://github.com/Joaconz/Biyu/issues/69) | P0 |
| RPC create_transaction atómica | [#70](https://github.com/Joaconz/Biyu/issues/70) | P0 |
| Arnés pgTAP y par de autorización por tabla | [#71](https://github.com/Joaconz/Biyu/issues/71) | P0 |
| Deploy en Vercel con prueba de humo | [#72](https://github.com/Joaconz/Biyu/issues/72) | P1 |

### Acceso · [#9](https://github.com/Joaconz/Biyu/issues/9)

| Historia | Issue | Trazabilidad | Prioridad | Casos |
|---|---|---|---|---|
| US-48 · La app pide login | [#61](https://github.com/Joaconz/Biyu/issues/61) | FR-02 · C7 · NFR-13 | P0 | — |
| US-49 · Sesión persistente en el celular | [#62](https://github.com/Joaconz/Biyu/issues/62) | FR-03 | P1 | — |
| US-50 · Crear cuenta con email y contraseña | [#63](https://github.com/Joaconz/Biyu/issues/63) | FR-01 · ADR-011 | P0 | — |
| US-51 · Entrar directo tras registrarse | [#64](https://github.com/Joaconz/Biyu/issues/64) | FR-01 · ADR-011 | P1 | — |
| US-64 · Cerrar sesión | [#65](https://github.com/Joaconz/Biyu/issues/65) | FR-03 | P1 | — |

### Configuración mínima · [#10](https://github.com/Joaconz/Biyu/issues/10)

| Historia | Issue | Trazabilidad | Prioridad | Casos |
|---|---|---|---|---|
| US-42 · Crear, renombrar y elegir color de categorías | [#56](https://github.com/Joaconz/Biyu/issues/56) | FR-05 | P1 | — |
| US-43 · Set inicial de categorías y cuentas | [#57](https://github.com/Joaconz/Biyu/issues/57) | FR-04 · ADR-014 | P0 | — |
| US-44 · Archivar una categoría sin perder historia | [#58](https://github.com/Joaconz/Biyu/issues/58) | FR-05 | P1 | — |
| US-45 · Crear cuentas indicando su tipo | [#59](https://github.com/Joaconz/Biyu/issues/59) | FR-05 · I6 | P0 | — |
| US-46 · Cargar el TC de referencia de cada mes | [#60](https://github.com/Joaconz/Biyu/issues/60) | FR-12 | P1 | — |

### Registro de transacciones · [#11](https://github.com/Joaconz/Biyu/issues/11)

| Historia | Issue | Trazabilidad | Prioridad | Casos |
|---|---|---|---|---|
| US-01 · El registro es la pantalla de inicio | [#24](https://github.com/Joaconz/Biyu/issues/24) | FR-06 | P0 | — |
| US-02 · El monto recibe el foco y abre el teclado numérico | [#25](https://github.com/Joaconz/Biyu/issues/25) | FR-06 · NFR-07 | P1 | — |
| US-03 · La fecha viene precargada con hoy | [#26](https://github.com/Joaconz/Biyu/issues/26) | FR-06 · C1 | P1 | — |
| US-04 · El tipo viene precargado en gasto | [#27](https://github.com/Joaconz/Biyu/issues/27) | FR-06 | P2 | — |
| US-05 · La moneda viene precargada en ARS | [#28](https://github.com/Joaconz/Biyu/issues/28) | FR-06 | P2 | — |
| US-06 · Categoría por chips en una grilla visible | [#29](https://github.com/Joaconz/Biyu/issues/29) | FR-06 · I8 | P1 | — |
| US-07 · La cuenta viene precargada con la última usada | [#30](https://github.com/Joaconz/Biyu/issues/30) | FR-06 | P2 | — |
| US-08 · Guardar sin descripción | [#31](https://github.com/Joaconz/Biyu/issues/31) | FR-06 | P2 | — |
| US-09 · Registrar un gasto con fecha pasada | [#32](https://github.com/Joaconz/Biyu/issues/32) | FR-06 | P1 | — |
| US-10 · Confirmación breve y formulario vacío tras guardar | [#33](https://github.com/Joaconz/Biyu/issues/33) | FR-06 | P1 | — |
| US-11 · No se puede guardar monto cero o negativo | [#34](https://github.com/Joaconz/Biyu/issues/34) | FR-06 · I4 · C6 | P0 | — |

### Cuotas · [#12](https://github.com/Joaconz/Biyu/issues/12)

| Historia | Issue | Trazabilidad | Prioridad | Casos |
|---|---|---|---|---|
| US-12 · Indicar cantidad de cuotas con tarjeta de crédito | [#35](https://github.com/Joaconz/Biyu/issues/35) | FR-09 · I2 · I3 | P0 | — |
| US-13 · Previsualizar impacto mensual antes de guardar | [#36](https://github.com/Joaconz/Biyu/issues/36) | FR-09 | P0 | — |
| US-14 · El selector de cuotas solo aparece con tarjeta de crédito | [#37](https://github.com/Joaconz/Biyu/issues/37) | I6 | P0 | — |
| US-15 · El reparto de cuotas no pierde ni inventa centavos | [#38](https://github.com/Joaconz/Biyu/issues/38) | FR-10 · FR-11 · I1 · I1' · C3 · ADR-013 | P0 | — |
| US-16 · Ver cuotas de meses anteriores en el dashboard | [#39](https://github.com/Joaconz/Biyu/issues/39) | FR-20 | P1 | — |
| US-17 · Ver número de cuota en el listado (3/12) | [#40](https://github.com/Joaconz/Biyu/issues/40) | FR-20 | P2 | — |
| US-18 · Borrar una compra en cuotas saca todas sus cuotas | [#41](https://github.com/Joaconz/Biyu/issues/41) | FR-08 · I10 | P0 | — |

### Monedas · [#13](https://github.com/Joaconz/Biyu/issues/13)

| Historia | Issue | Trazabilidad | Prioridad | Casos |
|---|---|---|---|---|
| US-19 · Registrar un gasto en USD sin convertir a mano | [#42](https://github.com/Joaconz/Biyu/issues/42) | FR-12 · I5 | P0 | — |
| US-20 · Sugerir el tipo de cambio de referencia del mes | [#43](https://github.com/Joaconz/Biyu/issues/43) | FR-12 | P1 | — |
| US-21 · Pisar el tipo de cambio sugerido en una transacción | [#44](https://github.com/Joaconz/Biyu/issues/44) | FR-12 | P1 | — |
| US-22 · Cambiar el TC de referencia no altera meses cargados | [#45](https://github.com/Joaconz/Biyu/issues/45) | C5 · ADR-002 | P0 | — |
| US-23 · Total del mes en ARS incluye USD convertido | [#46](https://github.com/Joaconz/Biyu/issues/46) | FR-20 · I1' | P1 | — |
| US-24 · Ver por separado el gasto en USD nativo | [#47](https://github.com/Joaconz/Biyu/issues/47) | FR-20 | P2 | — |

### Dashboard mensual · [#14](https://github.com/Joaconz/Biyu/issues/14)

| Historia | Issue | Trazabilidad | Prioridad | Casos |
|---|---|---|---|---|
| US-25 · Total gastado del mes actual al entrar | [#48](https://github.com/Joaconz/Biyu/issues/48) | FR-20 · I10 | P0 | — |
| US-26 · Cambiar de mes con un selector | [#49](https://github.com/Joaconz/Biyu/issues/49) | FR-21 · C11 | P0 | — |
| US-27 · Gasto por categoría en barras | [#50](https://github.com/Joaconz/Biyu/issues/50) | FR-20 | P1 | — |
| US-28 · Gasto por cuenta | [#51](https://github.com/Joaconz/Biyu/issues/51) | FR-20 | P1 | — |
| US-29 · Ingresos y balance del mes | [#52](https://github.com/Joaconz/Biyu/issues/52) | FR-20 | P1 | — |
| US-31 · Últimas transacciones con acceso a la lista completa | [#53](https://github.com/Joaconz/Biyu/issues/53) | FR-20 | P1 | — |
| US-32 · Días del mes con al menos un registro | [#54](https://github.com/Joaconz/Biyu/issues/54) | FR-20 | P2 | — |
| US-33 · Estado vacío con acceso al registro | [#55](https://github.com/Joaconz/Biyu/issues/55) | FR-20 | P1 | — |

| Tarea | Issue | Prioridad |
|---|---|---|
| Decisión: gráficos del dashboard (FR-20) | [#78](https://github.com/Joaconz/Biyu/issues/78) | P2 |

### Baja lógica · [#15](https://github.com/Joaconz/Biyu/issues/15)

| Historia | Issue | Trazabilidad | Prioridad | Casos |
|---|---|---|---|---|
| US-65 · Eliminar una transacción con aviso si toca meses cerrados | [#66](https://github.com/Joaconz/Biyu/issues/66) | FR-08 · C10 · I10 | P0 | — |

### Calidad V1: catálogo, ejecución y reporte · [#16](https://github.com/Joaconz/Biyu/issues/16)

| Tarea | Issue | Prioridad |
|---|---|---|
| Checklist de calidad de los NFR | [#73](https://github.com/Joaconz/Biyu/issues/73) | P0 |
| Diseñar el catálogo de casos de V1 | [#74](https://github.com/Joaconz/Biyu/issues/74) | P0 |
| Ejecutar el catálogo de V1 y reportar | [#75](https://github.com/Joaconz/Biyu/issues/75) | P0 |
| Reportar defectos de V1 | [#76](https://github.com/Joaconz/Biyu/issues/76) | P0 |

## V2 y V3: épicas

| Épica | Issue | Milestone | Contenido |
|---|---|---|---|
| Suscripciones | [#17](https://github.com/Joaconz/Biyu/issues/17) | V2 | US-52 a US-63 · FR-15 a FR-17 · I11 a I17 · R1 a R8 |
| Deudas y gastos compartidos | [#18](https://github.com/Joaconz/Biyu/issues/18) | V2 | US-30, US-34 a US-41 · FR-18, FR-19 · I7, I9 |
| Export CSV | [#19](https://github.com/Joaconz/Biyu/issues/19) | V2 | US-47 · FR-22 · C9 |
| Interfaz y no funcionales de V2 | [#20](https://github.com/Joaconz/Biyu/issues/20) | V2 | `roadmap.md` §V2 · NFR-01 a NFR-10 |
| Calidad V2 | [#21](https://github.com/Joaconz/Biyu/issues/21) | V2 | Regresión de V1, confirmación de defectos, catálogo de V2 |
| Automatización | [#22](https://github.com/Joaconz/Biyu/issues/22) | V3 | `roadmap.md` §V3 · NFR-19, NFR-20 |
| Edición de transacciones | [#23](https://github.com/Joaconz/Biyu/issues/23) | V3 | FR-07 · ADR-009 |

## Huecos conocidos

- Ningún caso de prueba diseñado todavía: la columna "Casos" está vacía hasta [#74](https://github.com/Joaconz/Biyu/issues/74).
- Historias 34 a 41 (deudas) y 52 a 63 (suscripciones) sin issue propio hasta el sprint de V2.
- US-47 (export) sin issue propio: queda en su épica [#19](https://github.com/Joaconz/Biyu/issues/19).
