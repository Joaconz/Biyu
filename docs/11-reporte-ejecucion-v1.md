# Reporte de ejecución — V1 (casos de prioridad Alta)

_Formato de `07-plan-de-testing.md` §6. Cubre la primera pasada de ejecución del catálogo
(`10-catalogo-casos-v1.md`), acotada a los 37 casos `Prioridad: Alta` — los que exige el
criterio de salida de V1. Los casos `Media`/`Baja` quedan para una pasada siguiente._

**Ejecutado por:** sesión aislada con la persona `test-adversary` (#75), sin memoria del
diseño del catálogo. **Fecha:** 2026-09-28. **Entornos:** primera corrida contra producción
(`https://biyu-rust.vercel.app`); segunda corrida contra Supabase local, tras encontrarse que
crear cuentas de prueba en producción viola una regla de seguridad de la sesión ejecutora (ver
§Desvíos).

---

## 1. Casos planificados, ejecutados, pasados, fallados y bloqueados

| Métrica | Cantidad | % |
|---|---|---|
| Planificados (Alta) | 37 | 100% |
| Ejecutados | 36 | 97% |
| Pasados | 34 | 92% |
| Fallados (defecto real de la app) | 2 | 5% |
| Bloqueados | 1 | 3% |

- **Fallados:** CP-CFG-004 (DEF-006), CP-ACC-004 variante servidor (DEF-005).
- **Bloqueado:** CP-REG-013 — necesita "hoy = octubre 2026" y ni el cliente (`src/lib/clock.ts`)
  ni `create_transaction` aceptan una fecha inyectada; se ejecutó una variante equivalente con
  un mes ya cerrado en la fecha real (2026-09-28), que dio Pass.
- 5 casos que **pasaron contra su propio oráculo escrito** revelaron, igual, un defecto
  adyacente al explorar más allá de los pasos: CP-ACC-002 (DEF-008), CP-REG-012 (DEF-007),
  CP-CUO-003 (DEF-009). Se cuentan como Pass (el caso tal como está escrito se cumple) con su
  defecto asociado registrado aparte — así lo pide la persona ejecutora: "atacar después de los
  casos escritos".
- CP-ACC-003 se ejecutó ya con la contraseña corregida (ver §Desvíos); no se vuelve a contar
  como Fail.

## 2. Cobertura por módulo

| Módulo | Alta planificados | Pass | Fail | Bloqueado |
|---|---|---|---|---|
| ACC | 8 | 7 | 1 (variante servidor) | 0 |
| CFG | 5 | 4 | 1 | 0 |
| REG | 6 | 5 | 0 | 1 |
| CUO | 10 | 10 | 0 | 0 |
| MON | 5 | 5 | 0 | 0 |
| DAS | 3 | 3 | 0 | 0 |
| **Total** | **37** | **34** | **2** | **1** |

## 3. Cobertura por técnica e invariante (I1–I17, alcance V1)

Invariantes de deudas (I7, I9) y suscripciones (I11–I17) son alcance de V2 (épicas #17/#18) —
no se exigen en el criterio de salida de V1, se dejan fuera de esta tabla y se anotan en
§Invariantes.

| Invariante | ¿Tiene caso Alta? | Resultado |
|---|---|---|
| I1, I1' | Sí (CP-CUO-004, 005, 010, 013) | Pass |
| I2, I3 | Sí (CP-CUO-001) | Pass |
| I4 | Sí (CP-REG-010) | Pass (DEF-004 corregido, ver §5) |
| I5 | Sí (CP-MON-002) | Pass (DEF-004 corregido, ver §5) |
| I6 | Sí (CP-CUO-003, 012) | **Pass del caso escrito, DEF-009 la rompe editando la cuenta después** |
| I8 | No (solo CP-REG-004, Media) | Verificado igual, de paso, por API: Pass |
| I10 | Sí (CP-REG-012, CP-CUO-009) | Pass |

## 4. Trazabilidad: historias sin ningún caso Alta ejecutado

Ninguna historia de V1 quedó sin al menos un caso Alta ejecutado o verificado de paso, **excepto**
las que dependen de invariantes fuera de alcance de V1 (deudas, suscripciones — no tienen
historia propia todavía, ver `08-trazabilidad.md` §Huecos conocidos).

## 5. Defectos abiertos por severidad

| Severidad | Cantidad | IDs |
|---|---|---|
| Crítica | 0 | — (DEF-004 corregido, ver abajo) |
| Media | 9 | DEF-001, DEF-005, DEF-007, DEF-008, DEF-009, DEF-010, DEF-011, DEF-016, (DEF-003 en vías de cierre, ver abajo) |
| Baja | 6 | DEF-002, DEF-006, DEF-012, DEF-013, DEF-014, DEF-015 |
| **Total abiertos** | **15** | — |

**DEF-003** (US-66 ausente en producción) tiene causa raíz identificada (error de merge, no de
la app) y fix ya en PR ([#141](https://github.com/Joaconz/Biyu/pull/141)): pasa a "Cerrado"
recién cuando se mergee, se despliegue y alguien reconfirme `/signup` en producción — nadie
cierra su propio defecto (`07-plan-de-testing.md` §5).

**DEF-004** (NaN como monto, Crítica — el único defecto Crítico de esta ejecución) está corregido:
`create_transaction()` ahora rechaza `p_amount`/`p_fx_rate` en `'NaN'::numeric` explícitamente
(igual que ya hacía `upsert_fx_rate` para `fx_rates`, C6), y los `check` de `transactions`,
`ledger_entries`, `debts` y `subscriptions` se endurecieron a `columna <> 'NaN'::numeric and
columna > 0` para que ningún insert directo (RPC o RLS) pueda colar un `NaN`
(`supabase/migrations/20260929000000_reject_nan_amounts.sql`). Cubierto por pgTAP nuevo
(`create_transaction.test.sql`, `nan_amounts.test.sql`) y reverificado a mano contra Supabase
local: las dos llamadas de la reproducción original ahora devuelven `23514` en vez de un uuid.

Prioridad de cada defecto: pendiente de que el PO la fije (severidad es un hecho técnico,
prioridad es una decisión de negocio — quedó "a definir" en cada issue).

## 6. Defectos de la versión anterior confirmados

No aplica: esta es la primera ejecución de V1, no hay defectos de una versión previa que
confirmar.

## 7. Desvíos respecto de lo planificado y por qué

1. **Cambio de entorno a mitad de la ejecución.** El plan original (#75) pedía ejecutar
   contra producción. La sesión ejecutora se negó, correctamente, a crear cuentas de prueba
   ahí: la regla de seguridad que rige toda sesión de este proyecto (incluida la que coordinó
   la ejecución) reserva la creación de cuentas de prueba a hosts de desarrollo local, nunca a
   producción, sin importar la autorización del usuario. Se ejecutaron contra producción los
   9 casos que no requieren sesión (guard de login, pares de autorización `anon`); el resto se
   re-ejecutó contra Supabase local. Cubre el mismo código (mismo `main`), no el mismo entorno
   de infraestructura — NFR-12 (HTTPS) y el resto de lo específico de producción ya se
   verificaron aparte, en la prueba de humo del deploy (#72).
2. **CP-ACC-003 y CP-ACC-004 se corrigieron durante la ejecución.** Los dos tenían un oráculo
   de contraseña desactualizado desde que se agregó US-67 al spec, después de haberse
   diseñado el catálogo original. Se corrigieron en `10-catalogo-casos-v1.md` antes de
   reportarlos como Fail definitivo.
3. **Todavía no se cumplen los 4 criterios de salida de V1** (`07-plan-de-testing.md` §6):
   - ✅ **Cero defectos Críticos abiertos** — DEF-004 corregido (ver §5).
   - ✅ Cero defectos Altos abiertos (ninguno tiene esa severidad asignada todavía).
   - ❌ **Todos los casos de prioridad Alta ejecutados** — CP-REG-013 sigue Bloqueado.
   - ✅ Toda invariante de alcance V1 tiene al menos un caso ejecutado.

   **V1 no puede cerrarse todavía.** Con DEF-004 corregido queda un solo punto pendiente:
   destrabar CP-REG-013 (con un reloj falso en el navegador/Postgres, o esperando a que la
   fecha real llegue a octubre).

## 8. Datos de prueba generados

Todo en Supabase **local** (`supabase db reset` lo limpia por completo). En producción no
quedó ningún dato de prueba. Detalle completo de cuentas, transacciones y configuración
creadas: ver el hand-off de la sesión ejecutora en el historial de esta conversación — no se
repite acá para no duplicar credenciales de prueba en el repo.
