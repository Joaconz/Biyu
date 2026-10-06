---
name: new-test-case
description: Diseña casos de prueba de Biyu con el formato de docs/07-plan-de-testing.md (ID CP-<módulo>-<nnn>, técnica, invariante, variante UI y directo a la RPC). Usalo al derivar casos desde un FR, una regla R* o una invariante I*.
disable-model-invocation: true
argument-hint: <FR-xx | I<n> | módulo> [técnica]
---

Diseñá casos de prueba para: $ARGUMENTS

Los casos se derivan **del spec**, no del código: el riesgo declarado en el plan (§8) es que un
agente escriba el código y también las pruebas que lo confirman. Si el argumento apunta a código
en vez de a un FR/R*/I*, pedí la referencia al spec antes de seguir.

## 1. Leé el oráculo

1. `docs/07-plan-de-testing.md` §3 (técnicas) y §4 (formato del caso).
2. La fuente del argumento: el FR o la regla en `docs/02-behavior-spec.md` (o
   `docs/06-suscripciones.md`), la invariante en `docs/04-data-model.md`, la constraint en
   `docs/03-architecture-spec.md`. Vocabulario del `docs/01-domain-glossary.md`.
3. Los casos que ya existan para ese módulo, para no duplicar ni repetir ID.

## 2. Elegí técnicas y derivá

Cada caso declara una técnica de §3: particiones de equivalencia, valores límite, tabla de
decisión, transición de estados, adivinación de errores o casos de uso. Aplicá primero la que
corresponde al tipo de dato:

| Dato | Técnica |
|---|---|
| Monto, cuotas, día de cobro, fechas con rango | Particiones + valores límite (0, 1, máx, máx+1; monto ± 0,01) |
| Moneda × tipo de cambio × cuenta | Tabla de decisión (escribir todas las filas, incluida la inválida) |
| Suscripciones, deudas | Transición de estados, **incluidas las transiciones que no existen** |
| Concurrencia, 29-feb, categoría archivada, `deleted_at` | Adivinación de errores |
| Flujo completo de una historia | Caso de uso |

Un negativo por cada regla que rechaza algo, no solo el camino feliz.

## 3. Formato de salida

Un caso por bloque, con los campos de `docs/07-plan-de-testing.md` §4 en este orden:

| Campo | Contenido |
|---|---|
| ID | `CP-<módulo>-<nnn>`. Módulos: `CUO` cuotas · `MON` monedas y TC · `DAS` dashboard · `SUS` suscripciones · `DEU` deudas · `ACC` acceso y autorización · `REG` registro, validaciones de alta y baja lógica · `CFG` categorías, cuentas y TC de referencia · `EXP` export CSV · `IMP` importación desde Excel · `NAV` navegación, feedback y confirmaciones · `NFR` no funcionales |
| Título | Qué se verifica y con qué dato |
| Historia y criterio | `US-nn · CA-k` y FR / R* |
| Invariante cubierta | `I1 … I17`, o "—" si no aplica |
| Técnica | Una de §3 del plan |
| Tipo | Positivo · Negativo · Límite |
| Canal · Caso par | `UI` o `API`, y el ID del caso hermano si es un negativo |
| Pre-requisitos | Numerados (`S 1`…). Procedimientos por ID (`PR-01`…, `docs/12-procedimientos-de-prueba.md`) |
| Datos de prueba | Numerados, con valores **exactos** y montos ficticios (C14) |
| Pasos | Numerados, **un paso una acción**, ejecutables por alguien que no diseñó el caso |
| Resultado esperado | Uno **por paso**, observable y exacto: "$33.333,34", no "el monto correcto" |
| Post-condición | Cómo queda el sistema y la limpieza |
| Prioridad | Alta · Media · Baja |
| Automatizable | Sí · No · V3 |

Numerá a partir del último `nnn` existente del módulo. Si no hay catálogo todavía, empezá en 001.

## 4. Reglas de calidad (estándar de ADR-028)

- **Atómico.** Una condición o partición y un juego de datos por caso, con un único veredicto.
  Probar 0, 1, 2, 12 y 13 cuotas son cinco casos. Una tabla de decisión de 6 filas son 6 casos.
- **UI y API en casos separados** (C6): todo negativo tiene su caso por la UI y su caso directo
  contra la RPC/API con el cliente saltado, enlazados por "Caso par". Si la UI lo previene, igual se
  prueba que la base lo rechaza.
- **Independiente.** Cada caso arranca con su propio usuario (`PR-01`); ninguno depende de otro.
- **Variante API ejecutable a mano:** método, endpoint, body JSON y respuesta esperada (status HTTP
  más `code` de Postgres). Los headers y el token salen de `PR-04`.
- **Resultado esperado con valores exactos** y montos como string decimal, nunca `number` (C2).
- **Un caso sin oráculo no es un caso.** Si no podés anclarlo a un criterio de aceptación, una I*, una R* o
  un FR, marcalo como hueco del spec y reportalo en vez de inventar el resultado esperado. El oráculo sale
  del spec, **nunca de lo que la app hace hoy**.
- **`today` entra como dato de la precondición** (C1): fijá la fecha, no dependas del reloj.
- Cualquier caso que toque una tabla incluye, en su módulo `ACC`, el par de autorización:
  otra sesión → 0 filas, rol `anon` → `permission denied` 42501 (C7).
- Si el spec es ambiguo o se contradice, no lo resuelvas vos: listalo al final como
  "Ambigüedades" para el Product Owner (o pasalo por el agente `spec-critic`).

## 5. Entrega

Mostrá los casos en Markdown y esperá confirmación. No crees archivos de catálogo ni hagas commit
salvo que se pida. Cerrá con una tabla de trazabilidad corta: FR/I* → IDs de caso, y qué FR/I*
del alcance quedaron sin caso.
