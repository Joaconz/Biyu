# Guita — Project Brief

_Documento raíz. Todo lo demás deriva de acá._

> **Cambio de encuadre.** Este documento se escribió como proyecto personal de una persona.
> Guita pasó a ser el Trabajo Práctico Integrador de **Testing de Aplicaciones**, con un
> equipo de cinco. El problema, el dominio y las restricciones no cambiaron; cambió quién lo
> construye y para qué se lo evalúa. Las secciones 3 y 4 están actualizadas.
> El documento corto que se presenta en la materia es `pre-entrega.md`.

---

## 1. El problema

No hay urgencia financiera: hay falta de visibilidad. El sueldo alcanza, el mes cierra bien, pero no existe una respuesta a "¿en qué se fue la plata este mes?".

El contexto argentino agrega tres complicaciones que la mayoría de las apps de finanzas personales no modelan bien:

1. **Dos monedas simultáneas.** ARS para el día a día, USD para ahorro y algunos gastos. El tipo de cambio se mueve, y convertir todo al valor de hoy distorsiona el pasado.
2. **Cuotas.** Una porción grande del consumo se paga en 3, 6 o 12 cuotas sin interés. Contar una compra de 12 cuotas entera en el mes de la compra hace que ese mes parezca catastrófico y los 11 siguientes parezcan baratos.
3. **Gastos compartidos.** Una parte del gasto de la tarjeta se reembolsa después. Si no se modela, el total del mes miente.

## 2. Historial de intentos fallidos

Dos sistemas anteriores fueron construidos y nunca usados:

| Intento | Stack | Por qué murió |
|---|---|---|
| 1 | Google Sheets + Apps Script + iOS Shortcut | Setup de OAuth y Apps Script demasiado frágil; la app de Sheets en mobile es hostil para cargar una fila |
| 2 | Python + openpyxl | Requería estar en la compu; cero fricción de escritura ≠ cero fricción de acceso |

**Patrón común:** complejidad de setup alta, plataforma equivocada para el momento de registro (que ocurre parado, en la calle, con una mano), y features acumuladas antes de validar que el hábito existía.

Este proyecto es el tercer intento. La diferencia no es solo técnica: es que esta vez el objetivo primario **no es el hábito**.

## 3. Objetivos, en orden de prioridad

### Objetivo primario — el trabajo de calidad

Lo que la materia evalúa es el trabajo de producto y calidad: requerimientos, historias de
usuario, diseño y ejecución de pruebas, reportes de defectos y de ejecución, y el análisis
posterior. **No se evalúa cómo el agente de IA construyó la aplicación.** La aplicación es el
sujeto de prueba, no el entregable.

Esto significa, concretamente:

- Cada historia de usuario tiene criterios de aceptación verificables y al menos un caso de prueba ejecutado.
- Cada invariante del dominio tiene un caso que la verifica, con un resultado esperado concreto y no un "debería andar".
- Los defectos se reportan con pasos de reproducción, severidad y prioridad, y se confirman después de corregidos.
- El plan de pruebas y la organización del equipo están escritos antes de ejecutar (`07-plan-de-testing.md`).

### Objetivo secundario — artefacto de ingeniería defendible

El repositorio tiene que sostener escrutinio técnico por sí solo: decisiones justificadas,
dominio testeado y arquitectura explicable. Esto no compite con el objetivo primario, lo
habilita — un dominio puro y testeable es lo que hace que el catálogo de casos pueda anclarse
a invariantes en vez de a impresiones.

- El dominio (cuotas, conversión de moneda, KPIs, ocurrencias de suscripción) vive en módulos puros, independientes de FastAPI y de SQLAlchemy.
- Cada decisión no obvia tiene un ADR con contexto, alternativas descartadas y consecuencias.
- La especificación de comportamiento existe **antes** que el código y se mantiene actualizada.

### Objetivo terciario — uso real

Que alguien del equipo lo use con sus propios gastos. Sigue siendo deseable: un modelo de
dominio que nunca vio datos es más difícil de defender. No bloquea nada.

**Jerarquía explícita:** cuando el alcance de la aplicación y el trabajo de pruebas choquen,
gana el trabajo de pruebas. Eso no autoriza a construir una app trivial —la consigna rechaza
un CRUD sin reglas— autoriza a construir *menos features, mejor probadas*.

## 4. Métricas de éxito

| # | Métrica | Objetivo | Cómo se mide |
|---|---|---|---|
| M1 | Invariantes del dominio con al menos un caso de prueba ejecutado | 100% | Trazabilidad del catálogo contra `04-data-model.md` |
| M2 | Lógica de negocio acoplada a la infraestructura | 0 imports de `fastapi` o `sqlalchemy` dentro de `domain/` | Test de arquitectura automatizado |
| M3 | Decisiones de diseño no obvias sin ADR | 0 | Revisión manual contra la lista de ADRs |
| M4 | Historias de usuario sin ningún caso de prueba ejecutado | 0 al cierre de cada versión | Reporte de ejecución |
| M5 | Defectos de severidad crítica o alta abiertos al cierre de una versión | 0, o justificados y registrados | Criterio de salida (`07-plan-de-testing.md`, §6) |
| M6 | Casos de V1 y V2 automatizados en V3 | Todos los negativos y los dos flujos críticos | Reporte de ejecución de CI |
| M7 | Tiempo desde abrir la app hasta gasto guardado | < 10 s | Medición manual, en un celular real |

M7 es del objetivo terciario y no bloquea. M1–M6 sí: si fallan, el proyecto no cumple su objetivo primario aunque la app funcione perfecto.

## 5. No-objetivos

Esto **no** es un presupuestador, ni un asesor financiero, ni un gestor de inversiones. No calcula patrimonio neto, no sugiere en qué recortar, no proyecta a futuro. Registra lo que pasó y lo muestra ordenado.

Es multi-tenant con registro público (ADR-011): cualquiera con el link crea su cuenta y usa
la app con sus propios datos, aislados por usuario. **No es un producto con onboarding,
planes ni cobro** — es la misma app de un usuario, abierta a que la use más de uno. Eso
incluye a la feature de suscripciones: "suscripción" significa siempre un gasto recurrente
*del usuario*, nunca un plan de pago de Guita.

## 6. Documentos relacionados

- `pre-entrega.md` — el documento corto que se presenta en la materia
- `01-domain-glossary.md` — vocabulario cerrado del dominio
- `02-behavior-spec.md` — qué tiene que hacer el sistema
- `03-architecture-spec.md` — cómo tiene que estar construido
- `04-data-model.md` — schema, invariantes, aislamiento por usuario
- `05-repo-publico.md` — reglas del repositorio público
- `06-suscripciones.md` — spec de dominio de los gastos recurrentes
- `07-plan-de-testing.md` — equipo, técnicas de diseño de casos, defectos y reportes
- `roadmap.md` — V1, V2, V3 y qué queda para después
- `adr/` — decisiones con su razonamiento
