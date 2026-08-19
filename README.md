# Guita

Control de gastos personales para el contexto argentino: dos monedas simultáneas, compras en
cuotas y gastos compartidos que después se reembolsan. Ninguna de las tres cosas se modela
bien en la mayoría de las apps de finanzas personales — acá son el punto de partida, no un
agregado.

Trabajo Práctico Integrador de **Testing de Aplicaciones**. El objetivo primario del
repositorio no es la aplicación en sí, sino el trabajo de calidad detrás: requerimientos,
diseño y ejecución de pruebas, y decisiones de arquitectura justificadas. Ver
[`docs/00-project-brief.md`](docs/00-project-brief.md).

## El problema

1. **Dos monedas.** ARS para el día a día, USD para ahorro. Convertir todo al dólar de hoy
   distorsiona el pasado: una compra de USD 100 a $1.250 costó $125.000, y eso no cambia
   porque hoy el dólar valga $1.400.
2. **Cuotas.** Contar una compra de 12 cuotas entera en el mes de la compra hace que ese mes
   parezca catastrófico y los 11 siguientes, baratos.
3. **Gastos compartidos.** Si el reembolso pendiente no se modela, el total del mes miente.

## Decisión de diseño central

Las cuotas se modelan como **imputaciones materializadas**: al crear una transacción se
generan y persisten, en la misma operación atómica, las N filas que reparten su monto entre
los meses correspondientes. El dashboard lee solo esas imputaciones — nunca recalcula el
prorrateo al vuelo. Razonamiento completo y alternativas descartadas en
[ADR-001](docs/adr/001-imputaciones-materializadas.md).

## Estado del proyecto

En etapa de especificación. El dominio, la arquitectura y el plan de pruebas están escritos
y versionados antes que el código (`domain/` puro, sin depender de framework ni de base de
datos — ver restricción C1). Todavía no hay implementación en `api/` ni en `web/`.

## Documentación

| Documento | Contenido |
|---|---|
| [`docs/00-project-brief.md`](docs/00-project-brief.md) | Problema, objetivos, métricas de éxito |
| [`docs/01-domain-glossary.md`](docs/01-domain-glossary.md) | Vocabulario cerrado del dominio |
| [`docs/02-behavior-spec.md`](docs/02-behavior-spec.md) | Qué tiene que hacer el sistema |
| [`docs/03-architecture-spec.md`](docs/03-architecture-spec.md) | Cómo tiene que estar construido, stack y constraints |
| [`docs/04-data-model.md`](docs/04-data-model.md) | Schema, invariantes, aislamiento por usuario |
| [`docs/05-repo-publico.md`](docs/05-repo-publico.md) | Reglas de higiene del repositorio público |
| [`docs/06-suscripciones.md`](docs/06-suscripciones.md) | Spec de dominio de gastos recurrentes |
| [`docs/07-plan-de-testing.md`](docs/07-plan-de-testing.md) | Equipo, técnicas de diseño de casos, defectos |
| [`docs/roadmap.md`](docs/roadmap.md) | V1, V2, V3 y qué queda para después |
| [`docs/pre-entrega.md`](docs/pre-entrega.md) | Documento corto presentado en la materia |
| [`docs/adr/`](docs/adr) | Decisiones de arquitectura, con contexto y alternativas descartadas |

## Stack (planificado)

Next.js + TypeScript en el frontend, Python + FastAPI en el backend, PostgreSQL (Neon) como
base de datos, ambos servicios separados y comunicándose por HTTP. Detalle completo y
justificación de cada elección en
[`docs/03-architecture-spec.md`](docs/03-architecture-spec.md).

## Levantar el proyecto

Todavía no hay código para correr. Esta sección se completa junto con la primera
implementación de `api/` y `web/`, con instrucciones probadas de punta a punta y un
`.env.example` con todas las variables necesarias.

## Licencia

[MIT](LICENSE).
