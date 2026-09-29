# Proyecto Biyu – Entrega 1 · Reporte de ejecución de casos de prueba (V1)

Planilla: `05-reporte-de-ejecucion.xlsx` (hoja "Reporte de ejecución - Entrega1", mismo formato que el
ejemplo de TaskMaster: ID, prioridad, título, historia, camino feliz, status y defectos). Formato del
contenido: `docs/07-plan-de-testing.md` §6.

| Dato | Valor |
|---|---|
| Versión probada | `main` en el commit `44f1519` (2026-09-28), con los fixes de DEF-004 (#162) y DEF-001 (#163) ya incluidos |
| Entorno | Local: Vite en `http://localhost:5180` + Supabase local. Chromium (Playwright) emulando un celular de 390×844 |
| Fecha | 2026-09-28 (hoy según el reloj de la corrida, hora argentina) |
| Ejecutó | Claude Code con el runner `ejecucion/run.mjs`, supervisado por Joaquin Nuñez. Corrida `mum0bycw`, con 2 casos y 2 re-tests repetidos en la corrida `mum0fi8l` (ver §7) |
| Evidencia | `ejecucion/resultados.json` (resultado obtenido de cada caso) y 57 capturas en `evidencia/` |

## 1. Planificados, ejecutados, pasados, fallados y bloqueados

| Métrica | Casos | % |
|---|---|---|
| Planificados | **74** (68 del catálogo + 6 nuevos de US-66 y US-68) | 100 % |
| Ejecutados | **70** | 95 % de avance |
| PASSED | **67** | 96 % de los ejecutados |
| FAILED | **3** | 4 % de los ejecutados |
| BLOCKED | **4** | 5 % de los planificados |
| No ejecutados | 0 | — |

- **FAILED:** CP-ACC-004 (DEF-005), CP-CFG-004 (DEF-006) y CP-CFG-011 (DEF-017).
- **BLOCKED:** CP-CFG-012 a CP-CFG-015, todos por DEF-017: la configuración inicial de US-68 no existe.
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
| CFG · Configuración | 15 | 9 | 2 | 4 |
| REG · Registro y baja | 16 | 16 | 0 | 0 |
| CUO · Cuotas | 13 | 13 | 0 | 0 |
| MON · Monedas | 7 | 7 | 0 | 0 |
| DAS · Dashboard | 11 | 11 | 0 | 0 |
| **Total** | **74** | **67** | **3** | **4** |

| Prioridad | Casos | PASSED | FAILED | BLOCKED |
|---|---|---|---|---|
| Alta | 39 | 36 | 3 | 0 |
| Media | 26 | 23 | 0 | 3 |
| Baja | 9 | 8 | 0 | 1 |

| Tipo | Casos | PASSED | FAILED | BLOCKED |
|---|---|---|---|---|
| Positivo | 39 | 34 | 2 | 3 |
| Negativo | 19 | 18 | 1 | 0 |
| Límite | 16 | 15 | 0 | 1 |

| Técnica | Casos | PASSED | FAILED | BLOCKED |
|---|---|---|---|---|
| Caso de uso | 37 | 32 | 2 | 3 |
| Adivinación de errores | 21 | 21 | 0 | 0 |
| Tabla de decisión | 7 | 6 | 1 | 0 |
| Valores límite | 8 | 8 | 0 | 0 |
| Transición de estados | 1 | 0 | 0 | 1 |

Camino feliz: 36 casos (33 PASSED, 2 FAILED, 1 BLOCKED). Negativos y de límite: 35 casos, de los cuales
33 PASSED. Todos los negativos se probaron por la UI y también directo contra la API/RPC (C6).

**Pruebas automatizadas existentes, corridas sobre el mismo commit:**

| Suite | Resultado |
|---|---|
| Vitest (`npm test`: dominio y lib) | 13 archivos, **239/239** en verde |
| pgTAP (`npm run test:db`: invariantes, RLS, RPC) | 10 archivos, **158/158** en verde (incluye el `nan_amounts.test.sql` nuevo de DEF-004) |
| Playwright smoke (`npm run test:e2e`) | **No ejecutado**: corre solo contra un deploy (`SMOKE_URL=<url>`). Para correrlo: `SMOKE_URL=https://biyu-rust.vercel.app npm run test:e2e` |

## 3. Trazabilidad: historias sin casos ejecutados

Las 46 historias de V1 tienen al menos un caso diseñado y ejecutado.

- **US-68**: su único caso ejecutable (CP-CFG-011) falló y los otros 4 quedaron bloqueados. La
  historia no está implementada (DEF-017).
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
| Crítica | 0 | — (DEF-004 corregido y confirmado en esta corrida) |
| Alta | 1 | DEF-017 |
| Media | 7 | DEF-005, DEF-007, DEF-008, DEF-009, DEF-010, DEF-011, DEF-016 |
| Baja | 8 | DEF-006, DEF-012, DEF-013, DEF-014, DEF-015, DEF-018, DEF-019, DEF-020 |
| **Total abiertos** | **16** | 12 de la ejecución anterior (#75) + 4 nuevos (DEF-017 a DEF-020) |

## 5. Defectos de la ejecución anterior confirmados

Se volvió a probar cada uno de los 16 defectos de #75 sobre `44f1519`:

| Defecto | Resultado del re-test | Estado |
|---|---|---|
| DEF-001 | Una ruta inexistente muestra "Esta página no existe" con "Volver a Biyu" | Corregido (#163), issue cerrado |
| DEF-002 | `title="Biyu"`, `lang="es-AR"` | Corregido; **falta cerrar el issue** |
| DEF-003 | `/signup` tiene "Confirmar contraseña" (local) | Corregido; falta reconfirmar en producción y cerrar el issue |
| DEF-004 | `create_transaction` con `p_amount='NaN'` → rechazado (23514) | Corregido (#162), issue cerrado |
| DEF-005 a DEF-016 | Los 12 se reproducen igual | Siguen abiertos |

## 6. Criterios de salida de V1

Según `07-plan-de-testing.md` §6:

| Criterio | Estado |
|---|---|
| 1. Cero defectos de severidad Crítica abiertos | ✅ Cumplido (DEF-004 corregido) |
| 2. Cero defectos de severidad Alta abiertos, o justificados por el PO | ❌ DEF-017 (US-68 sin implementar), salvo que el PO lo justifique |
| 3. Todos los casos de prioridad Alta ejecutados | ✅ Cumplido: 39 de 39 (incluido CP-REG-013) |
| 4. Toda invariante de V1 con al menos un caso ejecutado | ✅ Cumplido |

**V1 no puede cerrarse todavía por un solo punto:** DEF-017. Hay dos caminos: implementar US-68, o que el
PO la pase a V2 y deje escrita la justificación. En ese caso se vuelven a correr CP-CFG-011 a 015 cuando exista.

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

## 8. Datos de prueba

Todo en Supabase **local**, con usuarios `e1-*@biyu.test` y montos ficticios. `supabase db reset` los
borra. En producción no se creó nada. El runner no guarda credenciales reales: la contraseña de prueba
está en `ejecucion/lib.mjs` y solo existe en la base local.
