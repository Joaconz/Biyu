# Proyecto Biyu – Entrega 1 · Reporte de ejecución de casos de prueba (V1)

Planilla: `05-reporte-de-ejecucion.xlsx` (hoja "Reporte de ejecución - Entrega1", mismo formato que el
ejemplo de TaskMaster: ID, prioridad, título, historia, camino feliz, status y defectos). Formato del
contenido: `docs/07-plan-de-testing.md` §6.

| Dato | Valor |
|---|---|
| Versión probada | Ejecución 1: `main` en el commit `44f1519` (2026-09-28), con los fixes de DEF-004 (#162) y DEF-001 (#163) ya incluidos. Ejecución 2 (re-test de US-68): `main` en `de26493` (2026-09-29), con US-68 (#173) y el fix de DEF-022 (#176) |
| Entorno | Local: Vite en `http://localhost:5180` + Supabase local. Chromium (Playwright) emulando un celular de 390×844 |
| Fecha | Ejecución 1: 2026-09-28. Ejecución 2: 2026-09-29 (hoy según el reloj de cada corrida, hora argentina) |
| Ejecutó | Claude Code con el runner `ejecucion/run.mjs`, supervisado por Joaquin Nuñez. Ejecución 1: corrida `mum0bycw`, con 2 casos y 2 re-tests repetidos en la corrida `mum0fi8l`. Ejecución 2: corrida `mund7icx` (ver §7) |
| Evidencia | `ejecucion/resultados.json` (resultado obtenido de cada caso) y 63 capturas en `evidencia/` (57 de la ejecución 1 y 6 de la ejecución 2) |

## 1. Planificados, ejecutados, pasados, fallados y bloqueados

Status vigente de cada caso: el de su última ejecución. La ejecución 2 re-ejecutó CP-CFG-011 a CP-CFG-015
después de implementar US-68; los otros 69 casos conservan el resultado de la ejecución 1.

| Métrica | Casos | % |
|---|---|---|
| Planificados | **74** (68 del catálogo + 6 nuevos de US-66 y US-68) | 100 % |
| Ejecutados | **74** | 100 % de avance |
| PASSED | **72** | 97 % de los ejecutados |
| FAILED | **2** | 3 % de los ejecutados |
| BLOCKED | **0** | — |
| No ejecutados | 0 | — |

- **FAILED:** CP-ACC-004 (DEF-005) y CP-CFG-004 (DEF-006).
- **Evolución de US-68:** en la ejecución 1, CP-CFG-011 dio FAILED y CP-CFG-012 a CP-CFG-015 quedaron BLOCKED
  por DEF-017 (la configuración inicial no existía). Implementada US-68 (#173), en la ejecución 2 pasan los 5.
- **Solo el catálogo original (68 casos):** 68 ejecutados, 66 PASSED, 2 FAILED. Los 31 casos Media/Baja
  que la corrida anterior (#75) había dejado para después ahora sí se ejecutaron.
- **PASSED con un defecto al lado.** El caso escrito se cumple, pero al explorar alrededor apareció otra
  falla, que se reporta aparte: CP-ACC-002 → DEF-008, CP-REG-012 → DEF-007, CP-MON-003 → DEF-020.
- **CP-REG-013**, bloqueado en #75, ahora se ejecutó y pasó: se fijó "hoy = 2026-10-15" con el reloj
  simulado de Playwright.

## 2. Cobertura por módulo, prioridad, tipo y técnica

| Módulo | Casos | PASSED | FAILED | BLOCKED |
|---|---|---|---|---|
| ACC · Acceso y autorización | 12 | 11 | 1 | 0 |
| CFG · Configuración | 15 | 14 | 1 | 0 |
| REG · Registro y baja | 16 | 16 | 0 | 0 |
| CUO · Cuotas | 13 | 13 | 0 | 0 |
| MON · Monedas | 7 | 7 | 0 | 0 |
| DAS · Dashboard | 11 | 11 | 0 | 0 |
| **Total** | **74** | **72** | **2** | **0** |

| Prioridad | Casos | PASSED | FAILED | BLOCKED |
|---|---|---|---|---|
| Alta | 39 | 37 | 2 | 0 |
| Media | 26 | 26 | 0 | 0 |
| Baja | 9 | 9 | 0 | 0 |

| Tipo | Casos | PASSED | FAILED | BLOCKED |
|---|---|---|---|---|
| Positivo | 39 | 38 | 1 | 0 |
| Negativo | 19 | 18 | 1 | 0 |
| Límite | 16 | 16 | 0 | 0 |

| Técnica | Casos | PASSED | FAILED | BLOCKED |
|---|---|---|---|---|
| Caso de uso | 37 | 36 | 1 | 0 |
| Adivinación de errores | 21 | 21 | 0 | 0 |
| Tabla de decisión | 7 | 6 | 1 | 0 |
| Valores límite | 8 | 8 | 0 | 0 |
| Transición de estados | 1 | 1 | 0 | 0 |

Camino feliz: 36 casos (35 PASSED, 1 FAILED). Negativos y de límite: 35 casos, de los cuales
34 PASSED. Todos los negativos se probaron por la UI y también directo contra la API/RPC (C6).

**Pruebas automatizadas existentes, corridas sobre el commit de la ejecución 1:**

| Suite | Resultado |
|---|---|
| Vitest (`npm test`: dominio y lib) | 13 archivos, **239/239** en verde |
| pgTAP (`npm run test:db`: invariantes, RLS, RPC) | 10 archivos, **158/158** en verde (incluye el `nan_amounts.test.sql` nuevo de DEF-004) |
| Playwright smoke (`npm run test:e2e`) | **No ejecutado** en la ejecución 1: corre solo contra un deploy (`SMOKE_URL=<url>`) |

En el commit de la ejecución 2, la CI da Vitest 246/246 y pgTAP 175/175 (se sumaron los tests de US-68 y de
DEF-022), y los e2e de `e2e/setup.spec.ts` y `e2e/smoke.spec.ts` pasan 28/28 en Chromium y WebKit contra el stack local.

## 3. Trazabilidad: historias sin casos ejecutados

Las 46 historias de V1 tienen al menos un caso diseñado y ejecutado.

- **US-68**: en la ejecución 1 no estaba implementada (DEF-017): CP-CFG-011 falló y los otros 4 casos
  quedaron bloqueados. Implementada en #173, sus 5 casos pasan en la ejecución 2.
- **US-67**: su único caso (CP-ACC-004) falló por la validación del servidor (DEF-005). La parte de
  cliente de la historia funciona.
- El resto de las historias tiene todos sus casos en PASSED.

**Invariantes de V1:** todas tienen al menos un caso ejecutado y en verde (I1, I1', I2, I3, I4, I5, I6,
I8, I10). I6 se cumple al crear transacciones, pero DEF-009 muestra que se puede romper después,
cambiando el tipo de la cuenta. I7, I9 e I11–I17 son de V2 (deudas y suscripciones).

## 4. Defectos por severidad

Detalle completo en `04-reportes-de-defectos`.

| Severidad | Abiertos | IDs |
|---|---|---|
| Crítica | 0 | — (DEF-004 y DEF-022 corregidos y confirmados) |
| Alta | 0 | — (DEF-017 corregido y confirmado en la ejecución 2) |
| Media | 8 | DEF-005, DEF-007, DEF-008, DEF-009, DEF-010, DEF-011, DEF-016, DEF-021 |
| Baja | 8 | DEF-006, DEF-012, DEF-013, DEF-014, DEF-015, DEF-018, DEF-019, DEF-020 |
| **Total abiertos** | **16** | 12 de la ejecución anterior (#75) + 4 nuevos (DEF-018 a DEF-021) |

En total se reportaron 22 defectos: 6 corregidos y confirmados (DEF-001 a DEF-004, DEF-017 y DEF-022) y
16 abiertos, todos de severidad Media o Baja.

## 5. Defectos de la ejecución anterior confirmados

Se volvió a probar cada uno de los 16 defectos de #75 sobre `44f1519`:

| Defecto | Resultado del re-test | Estado |
|---|---|---|
| DEF-001 | Una ruta inexistente muestra "Esta página no existe" con "Volver a Biyu" | Corregido (#163), issue cerrado |
| DEF-002 | `title="Biyu"`, `lang="es-AR"` | Corregido (#161), issue cerrado |
| DEF-003 | `/signup` tiene "Confirmar contraseña" | Corregido (#141), issue cerrado |
| DEF-004 | `create_transaction` con `p_amount='NaN'` → rechazado (23514) | Corregido (#162), issue cerrado |
| DEF-005 a DEF-016 | Los 12 se reproducen igual | Siguen abiertos |

Defectos nuevos de esta entrega ya corregidos:

| Defecto | Confirmación | Estado |
|---|---|---|
| DEF-017 | CP-CFG-011 a CP-CFG-015 pasan en la ejecución 2 (2026-09-29) | Corregido (#173), issue cerrado |
| DEF-022 | Tests de regresión de `e2e/setup.spec.ts` en verde y flujo verificado en producción (2026-09-29) | Corregido (#176), issue cerrado |

## 6. Criterios de salida de V1

Según `07-plan-de-testing.md` §6:

| Criterio | Estado |
|---|---|
| 1. Cero defectos de severidad Crítica abiertos | ✅ Cumplido (DEF-004 y DEF-022 corregidos) |
| 2. Cero defectos de severidad Alta abiertos, o justificados por el PO | ✅ Cumplido (DEF-017 corregido y confirmado en la ejecución 2) |
| 3. Todos los casos de prioridad Alta ejecutados | ✅ Cumplido: 39 de 39 (incluido CP-REG-013) |
| 4. Toda invariante de V1 con al menos un caso ejecutado | ✅ Cumplido |

**V1 está cerrada: se cumplen los cuatro criterios.** En la ejecución 1 faltaba el criterio 2 por DEF-017;
se implementó US-68 (#173) y la ejecución 2 lo confirmó. Los 16 defectos abiertos (Media y Baja) se
corrigen y se vuelven a probar en V2, junto con la regresión completa del catálogo de V1.

## 7. Desvíos respecto de lo planificado

1. **Ejecución asistida por un runner.** El plan prevé ejecución manual por un integrante que no diseñó
   el caso. Acá los pasos los ejecutó Claude Code con Playwright, siguiendo cada caso como lo haría una
   persona, y con una consulta a la base como oráculo. La propiedad cruzada del plan
   (`07-plan-de-testing.md` §1) no se aplicó en esta corrida: conviene que cada integrante revise la
   evidencia de su módulo antes de la entrega.
2. **Entorno local, no producción.** Crear cuentas de prueba en producción está fuera de las reglas de
   la sesión (mismo criterio que en #75). Se probó el mismo código de `main`. Lo específico de
   producción (HTTPS, NFR-12) lo cubre la prueba de humo del deploy.
3. **Re-ejecución de 2 casos y 2 re-tests por errores del runner.** CP-MON-003 había dado FAILED porque
   el runner leía "1250.0000" con el parser de formato argentino. El re-test de DEF-016 omitía la columna
   obligatoria `incurred_on`. Se corrigió el runner y se repitieron CP-MON-002, CP-MON-003, DEF-003 y
   DEF-016 en la corrida `mum0fi8l`. No se cambió el resultado de ningún caso a mano.
4. **Casos ejecutados con un camino distinto al escrito**, sin cambiar el resultado esperado:
   - CP-ACC-009: "Cerrar sesión" ahora está en Ajustes (ADR-023).
   - CP-ACC-007: la falta de sesión se simuló interceptando la respuesta de `/auth/v1/signup`.
   - CP-REG-013: "hoy" se fijó con el reloj simulado del navegador.
5. **Verificación parcial en CP-REG-016.** Que se abra el teclado numérico no se puede observar en un
   navegador emulado. Se verificó la condición que lo produce: foco automático e `inputmode="decimal"`.
   Hay que confirmarlo en un celular real.
6. **Oráculo desactualizado en CP-CUO-002.** El formato de la previsualización cambió con el rediseño
   ("$10.000,00 · de ago 2026 a jul 2027"). El contenido es el esperado: se marcó PASSED y hay que
   actualizar el texto del caso.
7. **Exploración fuera del catálogo.** Además de los casos escritos se atacaron 8 bordes (EXP-01 a
   EXP-08). De ahí salieron DEF-018 y DEF-019. Hubo dos observaciones sin defecto, porque la spec no fija
   un límite: una fecha del año 0001 se acepta y un nombre de categoría de 300 caracteres también. Los
   otros ataques no encontraron fallas: script en el nombre (se escapa), "1e5" (se rechaza), "1.500"
   (se lee como mil quinientos) y doble toque en Guardar (crea una sola transacción).
8. **Ejecución 2 parcial.** Solo se re-ejecutaron los 5 casos de US-68 (corrida `mund7icx`): la regresión
   completa del catálogo queda para V2. Antes, el runner tenía CP-CFG-012 a CP-CFG-015 escritos como
   BLOCKED fijos; se implementaron de verdad. Además, desde US-68 toda cuenta nueva pasa por el setup,
   así que el runner marca como completo el setup de los usuarios que arma como datos de otros casos.

## 8. Datos de prueba

Todo en Supabase **local**, con usuarios `e1-*@biyu.test` y montos ficticios. `supabase db reset` los
borra. En producción no se creó nada. El runner no guarda credenciales reales: la contraseña de prueba
está en `ejecucion/lib.mjs` y solo existe en la base local.
