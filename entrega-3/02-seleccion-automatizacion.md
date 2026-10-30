# Entrega 3 · Selección de los casos a automatizar

Qué casos se automatizan en V3 y por qué. Issue [#335](https://github.com/Joaconz/Biyu/issues/335), épica [#22](https://github.com/Joaconz/Biyu/issues/22). Fecha de la selección: 2026-10-30.

## Qué se automatiza

Decisión del equipo (2026-10-30): **todos los casos de V3 y todos los casos de regresión de V1 y V2**.

| Conjunto | Casos | Fuente |
|---|---|---|
| Casos de V3 | Todos los que salgan de [#338](https://github.com/Joaconz/Biyu/issues/338) (historias del milestone V3 y casos de confirmación de DEF-030 a DEF-037) | `entrega-3/casos/` (a escribir) |
| Regresión de V1 y V2 | 177: 39 de V1 y 138 de V2 | [`03-seleccion-regresion.md`](03-seleccion-regresion.md) |

## Por qué

- **Regresión de V1 y V2.** El PDF de la Entrega 3 pide automatizar casos de V1 y V2 para asegurar que lo que ya existe siga funcionando. Se automatizan exactamente los de la regresión (prioridad Alta y los que fallaron por un defecto en V2): son los que tienen que pasar en cada cambio, y automatizarlos permite correrlos en cada PR y no solo una vez al final.
- **Casos de V3.** V3 cambia partes delicadas: borrar definitivamente, editar movimientos (regenera imputaciones, ADR-009) y editar deudas. Una vez escritos, sus casos se vuelven la regresión de lo que venga después. Automatizarlos desde el principio evita que queden solo como ejecución manual.
- **Casos que quedan solo manuales:** los Media y Baja de V1 y V2 que no fallaron. Conservan su último resultado y entran a la automatización si se suman a la regresión.

## Revisión de los casos marcados como no automatizables

El catálogo de V1 marca «Automatizable: No» en dos casos que entran a la regresión. Se automatizan igual:

| Caso | Por qué se marcó No | Cómo se automatiza |
|---|---|---|
| CP-CFG-008 · la siembra en paralelo no duplica | Hacían falta dos pestañas a la vez | Dos páginas de Playwright con el mismo usuario que cargan `/register` al mismo tiempo, y una consulta a la API que cuenta categorías y cuentas |
| CP-CUO-002 · la previsualización de cuotas | Era una verificación visual | Leer el texto de la previsualización por `data-testid` |

Todos los casos de V2 ya están marcados como automatizables en `entrega-2/casos/`, y en Suscripciones cada uno dice si va en `e2e/` o en pgTAP (`supabase/tests/database/`).

## Cómo se automatiza

| Tipo de caso | Herramienta | Notas |
|---|---|---|
| Por la pantalla | Playwright (`e2e/`) | Solo con `data-testid`. Un usuario nuevo por test (PR-01). Reloj fijado con `page.clock` y hora de Argentina cuando el caso depende de la fecha |
| Por la API (negativos, autorización cruzada, rol `anon`) | Playwright `request` contra PostgREST | Con el token del usuario de prueba (PR-04), como se ejecutaron en V2 |
| Por la base (invariantes, concurrencia) | pgTAP (`supabase/tests/database/`) | Los que ya indican pgTAP en su caso |

- El título de cada test empieza con el ID del caso (`CP-DEU-012 · …`), así el reporte se cruza con el catálogo.
- Los pasos y el resultado esperado salen del caso escrito. Si el caso está mal o es ambiguo, se corrige el caso y se anota, como se hizo con CP-DEU-001, 003 y 011 en la Entrega 2.
- La suite corre contra Vite y Supabase local, en la CI en cada PR ([#334](https://github.com/Joaconz/Biyu/issues/334)), y publica el reporte como artefacto ([#337](https://github.com/Joaconz/Biyu/issues/337)).

## Orden sugerido

1. Infraestructura local y CI (#334).
2. Regresión por módulo, empezando por los de más riesgo con V3: Deudas, Cuotas, Registro, Resumen y Suscripciones; después Exportar, Importar, Navegación, Acceso y Configuración.
3. Casos de V3, a medida que cada historia se implementa (el test entra en el mismo PR que la historia).
