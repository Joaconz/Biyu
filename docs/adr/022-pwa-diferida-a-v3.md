# ADR-022 — PWA (NFR-15 a NFR-18) diferida a V3+, no V2

**Estado:** aceptada · **Fecha:** 2026-09-28

## Contexto

`docs/pre-entrega.md` §5 ponía la instalabilidad como PWA (NFR-15 a NFR-18: manifest, prompt de
instalación, actualización del service worker, no depender de `localStorage`/IndexedDB para nada
crítico) en V2. `docs/02-behavior-spec.md` §Out of Scope la deja para V3+, con la razón "una vez
que exista uso real". `CLAUDE.md` la listaba en el stack planificado sin fijar versión. La
revisión de calidad de NFR de [#73](https://github.com/Joaconz/Biyu/issues/73)
(`specs/nfr/checklists/version-placement.md`, CHK008) marcó la inconsistencia y pidió cerrarla acá.

## Decisión

**PWA queda en V3+.** Rige `02-behavior-spec.md`: por la regla de precedencia ya escrita en
`08-trazabilidad.md` ("donde difiere de la spec, manda la spec"), la pre-entrega es la foto del
2026-09-02 y no se reescribe, pero no gana cuando hay una decisión posterior explícita en sentido
contrario.

NFR-15 a NFR-18 no entran en el roadmap de V2 (`roadmap.md` §V2, que ya no las menciona) ni se
prueban hasta V3+.

## Por qué

- V2 ya tiene su propio foco (suscripciones, deudas, export CSV) y agregar manifest + service
  worker + prompt de instalación es una inversión de infraestructura, no una historia de usuario:
  no hay ningún caso de prueba de negocio que dependa de que la app sea instalable.
- La razón que da el behavior spec — "una vez que exista uso real" — es coherente con el
  principio general del proyecto (`02-behavior-spec.md` §Further Notes): no agregar ninguna
  feature de V2 hasta que exista un mes calendario completo con datos reales cargados. Invertir en
  PWA antes de eso es exactamente el patrón de acumulación de alcance que mató a los dos intentos
  anteriores de este sistema.

## Consecuencias

- `docs/08-trazabilidad.md` pasa NFR-15 a NFR-18 de "En decisión" a "V3+".
- Cierra [#77](https://github.com/Joaconz/Biyu/issues/77).
- Si más adelante se decide adelantarla, hace falta un ADR nuevo que reabra esto — no alcanza con
  cambiar la fecha en el roadmap.
