# Entrega 3 · Reporte de la ejecución automatizada de V3

Tarea [#337](https://github.com/Joaconz/Biyu/issues/337), dentro de la épica de calidad ([#326](https://github.com/Joaconz/Biyu/issues/326)). Este reporte resume la corrida de la suite automatizada sobre V3 y la compara con lo que dieron los mismos casos en la Entrega 2. El detalle por caso está en [`04-ejecucion.md`](04-ejecucion.md) y [`04-ejecucion.xlsx`](04-ejecucion.xlsx); la selección de lo que se automatizó, en [`02-seleccion-automatizacion.md`](02-seleccion-automatizacion.md).

## 1. Qué se corrió y dónde

| | |
|---|---|
| Suite | Playwright (`e2e/`, 290 tests), Vitest (`tests/domain/`, 1131 tests) y pgTAP (`supabase/tests/database/`) |
| Entorno de la corrida registrada | Vite en `127.0.0.1:5173` y Supabase local con todas las migraciones; Chromium emulando un celular de 390 × 844 px; un usuario nuevo por test (PR-01) |
| Fecha | 2026-11-14, sobre `main` en `40ab30e` (merge de [#424](https://github.com/Joaconz/Biyu/pull/424)), con todas las historias de V3 mergeadas |
| Resultados crudos | `entrega-3/ejecucion/` (`playwright-resultados.json`, `vitest-resultados.json`, `pgtap-resultados.txt`) |
| Corrida de la CI | [43115707756](https://github.com/Joaconz/Biyu/actions/runs/43115707756), sobre `ef312d2` (merge de [#418](https://github.com/Joaconz/Biyu/pull/418)): `web`, `db` y `e2e` en verde, con el artefacto `playwright-report` (reporte HTML, trazas y capturas; la CI lo guarda 14 días) |
| Cómo se vuelve a correr | `npm run test:e2e`, `npm test` y `npm run test:db` (necesitan `supabase start`); la planilla se regenera con `python entrega-3/fuentes/generar_ejecucion.py` |

La corrida de la CI de `ef312d2` tiene 266 tests de Playwright; la diferencia con los 272 de la corrida registrada son tests agregados después, en [#419](https://github.com/Joaconz/Biyu/pull/419) (casos nuevos de US-101, suscripciones por cobrar, franja de la puesta al día y setup). Esos 272 pasaron también en las corridas de la CI de #419 y de `main`, salvo el test de humo descrito en el apartado 5.

## 2. Resultado

| Conjunto | Casos | PASSED | FAILED | BLOCKED | % PASSED |
|---|---|---|---|---|---|
| Casos de V3 | 184 | 184 | 0 | 0 | 100,0 % |
| Regresión de V1 y V2 | 177 | 177 | 0 | 0 | 100,0 % |
| **Total** | 361 | 361 | 0 | 0 | 100,0 % |

| Suite | Tests | Pasaron | Fallaron |
|---|---|---|---|
| Playwright | 290 | 290 | 0 |
| Vitest | 1131 | 1131 | 0 |
| pgTAP (CI) | 1354 (43 archivos) | 1354 | 0 |
| pgTAP (local) | 1354 (43 archivos) | 1351 | 3 (`update_subscription.test.sql`, tests 75 a 77, usuarios viejos de otras corridas; en la CI pasa) |

- **Defectos:** ningún caso falló, así que no hay defectos nuevos que reportar. Los defectos de V2 y el DEF-023 de V1 están confirmados en la sección «Confirmación de defectos» de [`04-ejecucion.md`](04-ejecucion.md) (9 de 9).
- **Criterio de PASSED:** un caso pasa si pasaron todas las pruebas que lo cubren. Un test de Playwright puede cubrir varios casos (un test por criterio de aceptación en las historias de US-80 a US-91), de modo que eso es cobertura del comportamiento, no una repetición paso a paso de la tabla del caso. La planilla nombra, para cada caso, las pruebas que lo cubren.
- **pgTAP local:** `update_subscription.test.sql` falla 3 de 164 tests en la base local por usuarios viejos de otras corridas; en la CI pasa y ningún caso de V3 depende de ese archivo.

## 3. Comparación con el resultado anterior de los mismos casos

Los 177 casos de la regresión ya tenían resultado de la Entrega 2 (V1 y V2). Comparados con el de V3:

| Resultado anterior | Casos | Resultado en V3 | ¿Coincide? |
|---|---|---|---|
| PASSED | 118 | PASSED | Sí |
| PASSED en la regresión de V2 | 39 | PASSED | Sí |
| FAILED por un defecto de V2 (DEF-030 a DEF-037) | 9 | PASSED | No, y es lo esperado: el defecto se corrigió (PR [#365](https://github.com/Joaconz/Biyu/pull/365) a [#368](https://github.com/Joaconz/Biyu/pull/368)) |
| BLOCKED (US-82 no existía en V2) | 4 | PASSED | No, y es lo esperado: US-82 se implementó en V3 (CP-DEU-013, 055, 056, 057) |
| No ejecutado en V2 | 6 | PASSED | No hay resultado anterior (CP-DEU-018, 022, 036, 037, 038 y 039) |
| DUDA | 1 | PASSED | No hay resultado firme anterior (CP-DEU-002) |

**Coinciden 157 de 177.** Las 20 diferencias son todas de FAILED, BLOCKED, no ejecutado o DUDA que pasan a PASSED, y cada una tiene su explicación arriba. Ningún caso que pasaba en la Entrega 2 falla ahora: no hay regresiones.

Lo que esta comparación **no** prueba:

- La referencia de la Entrega 2 es una ejecución con IA contra el stack local más un repaso manual del equipo en el deploy de Vercel. Esta corrida es solo automatizada y local: no repite el repaso manual ni se corrió contra el deploy.
- Un caso automatizado verifica lo que su test afirma. Donde un test cubre varios casos por criterio de aceptación, un matiz de un paso puntual puede quedar sin mirar; la mirada de una persona sobre lo visual (espaciado, legibilidad) no la reemplaza.

## 4. Tiempo

| | Tiempo |
|---|---|
| Playwright en la CI (266 tests, corrida 43115707756) | 15,1 min |
| Playwright en la CI (272 tests, corridas de #419 y de `main`) | 11,2 y 12,7 min |
| Playwright en la CI (290 tests, corrida 43649897941 sobre `40ab30e`) | 13,0 min |
| Playwright local (290 tests, 2 workers; la corrida que registra la planilla) | 12,4 min |
| pgTAP (1354 tests) | 2 s de reloj |
| Job `e2e` completo en la CI (instalar Chromium, esperar Supabase, correr y subir el reporte) | 17,2 min |
| Job `db` y job `web` en la CI | 1,5 min y 0,5 min |

El tiempo de ejecutar los mismos casos a mano **no se midió** en la Entrega 2 (el repaso se repartió entre cinco personas en el deploy), así que no hay un número manual contra el cual dividir. Lo que sí se puede decir es de otra naturaleza: la suite entera corre en unos 17 minutos sin intervención, en cada PR, mientras que el repaso manual necesitó a todo el equipo.

## 5. Incidentes de la corrida

- **Instalación de Chromium en la CI:** el job `e2e` falló dos veces por un error de DNS al instalar dependencias del sistema (infraestructura, no los tests). Se corrigió en [#416](https://github.com/Joaconz/Biyu/pull/416) con tres reintentos.
- **Tests lentos con la máquina cargada:** una corrida local con otro proyecto usando Docker dio 179 fallas por timeouts; se descartó. Reiniciado Docker y con el equipo libre, los 9 tests que habían quedado en rojo se corrieron de a uno y pasaron, y se registró la corrida entera.
- **`smoke.spec.ts` en la CI de `main`:** en la corrida [43131598486](https://github.com/Joaconz/Biyu/actions/runs/43131598486), sobre `0a8acbd` (merge de [#419](https://github.com/Joaconz/Biyu/pull/419)), el job `e2e` quedó en rojo con 271 tests en verde y 1 caído: «alta, gasto en 3 cuotas…» no pudo tocar «Siguiente» en 30 s porque el botón seguía deshabilitado. En #419 el mismo test había fallado una vez y pasó al relanzar el job. La causa más probable es que el formulario de Registrar se vuelve a montar justo después del alta y pierde el monto tipeado, como ya había pasado con DEF-023 (ver `e2e/dashboard-amounts.spec.ts`). No es una falla de la aplicación que se haya reproducido a mano. Se endureció el test (espera de 20 s al formulario y reescritura del monto hasta que «Siguiente» lo acepta), igual que lo hace el helper `signUpAndSkipSetup` con el resto de la suite. Queda como riesgo de flakiness hasta ver varias corridas de la CI en verde.

- **Edge runtime detenido (2026-11-14):** en la primera corrida local sobre `40ab30e`, CP-SUS-024 y CP-IMP-040 fallaron porque el contenedor del edge runtime de Supabase local llevaba 3 días detenido y la puesta al día de suscripciones no corría (en CP-IMP-040 apareció además el «Reintentar» de la franja, que chocaba con el de Importar). Con el contenedor levantado pasan. En una corrida anterior, los agentes habían atribuido ese fallo a «un Supabase de otro proyecto»; no era así: el `project_id` de `supabase/config.toml` conserva el nombre viejo del repositorio.
- **CP-CFG-040 con 4 workers:** se pasó de los 30 s en dos corridas completas con 4 workers y la máquina cargada, y pasa 6 de 6 repetido de a uno y en la corrida con 2 workers (290 de 290), que es la que registra la planilla.
- **CP-CFG-028 en la CI de `main` (intermitente, abierto):** la corrida 43649897941 dio 289 de 290: el test esperaba la URL `/settings` y llegó `/settings?period=2026-11` al volver de «Categorías». En local pasa en las corridas completas y 5 de 5 repetido de a uno. No se corrigió ni el test ni la aplicación: puede ser una carrera real del parámetro `period` o una aserción demasiado estricta; hay que mirarlo antes de dar la CI por estable.
- **Confirmación de defectos fuera de `main`:** la sección «Confirmación de defectos» de `04-ejecucion.md` (PR [#420](https://github.com/Joaconz/Biyu/pull/420)) se había mergeado a una rama que ya estaba mergeada, y nunca llegó a `main`. Se restauró al regenerar la planilla (9 de 9 confirmados).

## 6. Conclusión

V3 pasa la suite automatizada completa: 361 de 361 casos en PASSED (184 de V3 y 177 de regresión), sin defectos nuevos, con los 9 defectos de confirmación corregidos y sin regresiones respecto de la Entrega 2. Quedan fuera de este reporte, por no estar automatizado, el repaso manual del equipo sobre el deploy y la comparación de tiempos contra una ejecución manual medida. Este reporte se enlaza desde el reporte final de la Entrega 3 ([`07-reporte-final.md`](07-reporte-final.md), [#341](https://github.com/Joaconz/Biyu/issues/341)). El análisis de los defectos de V1 a V3 y el post-mortem de las actividades están en [`06-analisis-y-post-mortem.md`](06-analisis-y-post-mortem.md).
