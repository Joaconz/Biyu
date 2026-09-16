# ADR-019 — Vuelta a Supabase: se revierte ADR-016

**Estado:** aceptada
**Supera a:** ADR-016 (API de Python separada del frontend), y por transitividad reactiva el
espíritu de ADR-007 (Supabase como Postgres hosteado) y ADR-018 (JWT propio) queda superado
**Modifica:** ADR-004 (Supabase Auth y RLS vuelven a ser el mecanismo real de autorización, no
solo el punto de partida histórico), ADR-013, ADR-014 y ADR-015 (los criterios siguen
vigentes; la implementación vuelve a moverse — ver el encabezado de cada uno)
**No reinstaura:** ADR-008, ADR-010 y ADR-012, que eran específicos de Drizzle como query
builder. El acceso a datos de esta decisión usa el **Supabase Client SDK** directo, no
Drizzle — ver "Alternativas descartadas"
**Relacionada:** ADR-011 (signup público multi-tenant, sigue vigente sin cambios), ADR-017
(puesta al día de suscripciones)

---

## Contexto

ADR-016 separó el sistema en una API Python (FastAPI) y un frontend Next.js, para que cada
regla de negocio tuviera una superficie de prueba HTTP explícita, independiente del
navegador. Esa decisión se tomó al encuadrar el proyecto como Trabajo Práctico Integrador de
Testing de Aplicaciones, con un equipo de cinco.

Con el equipo ya armado y el cronograma de la materia en curso, el balance costo/beneficio de
esa decisión se revisó:

1. **Dos despliegues, dos lenguajes, autenticación propia.** FastAPI + SQLAlchemy + Alembic
   de un lado, React + Next.js del otro, un esquema de JWT con access y refresh token
   propios (ADR-018) en el medio. Es plomería considerable para un equipo de cinco personas
   con un cronograma de materia, no de una startup.
2. **El objetivo primario es el trabajo de calidad, no la arquitectura.** `00-project-brief.md`
   es explícito: lo que se evalúa es el catálogo de casos, los reportes de defectos y las
   decisiones justificadas. Una API propia es defendible, pero no es gratis, y cada semana
   invertida en plomería de autenticación y despliegue es una semana no invertida en diseñar
   y ejecutar casos de prueba.
3. **Supabase resuelve auth, aislamiento por usuario y una API generada sobre Postgres sin
   escribir ese código.** El riesgo que ADR-007 identificó en su momento —que Supabase
   empuja a desparramar lógica de negocio en componentes, con RLS como única autorización—
   sigue siendo real, y esta decisión lo acepta explícitamente a cambio de tiempo. Row Level
   Security pasa a ser, otra vez, la autorización real y no solo una red de contención: es
   además un mecanismo muy testeable ("el usuario A no puede leer ni modificar filas del
   usuario B" es un caso de prueba negativo concreto — NFR-13 en `pre-entrega.md`).

## Decisión

Volver a un único artefacto desplegable: una PWA de **React (Vite) + Workbox** que habla
directo contra **Supabase** (Postgres + Auth + Row Level Security + Edge Functions). No hay
API propia intermedia.

- **Acceso a datos:** Supabase Client SDK desde el navegador, con la sesión persistida en
  `localStorage`. No hay query builder (Drizzle) ni ORM de servidor: las consultas van contra
  la API REST/GraphQL que Supabase autogenera sobre el schema de Postgres.
- **Autorización:** Row Level Security, con políticas `using (user_id = auth.uid())` en cada
  tabla. Como el cliente de Supabase adjunta el JWT de la sesión en cada request contra
  PostgREST, `auth.uid()` resuelve al usuario real en el camino normal de la aplicación — a
  diferencia de lo que documentó ADR-008 para una conexión directa de Drizzle, acá no hace
  falta ningún truco de `SET LOCAL ROLE` (ver ADR-012): es el camino nativo del SDK.
- **Migraciones:** Supabase CLI (`supabase migration new`, `supabase db push`), versionadas
  en `supabase/migrations/`.
- **Lógica de servidor que no es CRUD simple** (cierre de tarjeta, generación de ocurrencias
  de suscripción): Edge Functions en Deno/TypeScript, invocadas por `pg_cron` o por Scheduled
  Edge Functions según el caso.
- **Validación:** constraints y triggers en Postgres como fuente de verdad, Zod del lado del
  cliente y dentro de las Edge Functions como conveniencia de UX y como borde de tipos.

## Alternativas descartadas

**Seguir con la API Python separada (ADR-016).** Es la opción más defendible desde el punto
de vista de arquitectura pura: domina la separación C1 sin ambigüedad, y deja un contrato
OpenAPI versionado como artefacto de testing. Se descarta para esta etapa del proyecto no
porque esté mal, sino porque el costo de plomería (dos despliegues, CORS, JWT propio) compite
directamente con el tiempo que el equipo necesita para el entregable que la materia evalúa.
Queda registrada como la opción correcta si el objetivo del proyecto fuera, en cambio,
demostrar diseño de una API backend.

**Reinstaurar Supabase con Drizzle como query builder (el diseño original de ADR-007/008/010/012).**
Es el camino más parecido a "deshacer ADR-016 y listo". Se descarta porque el problema
concreto que resolvía —RLS no se ejecutaba en el camino de Drizzle porque la conexión directa
a Postgres no lleva JWT (ADR-008), y hubo que simular la sesión con `SET LOCAL ROLE` +
`set_config` en cada transacción (ADR-012)— desaparece por completo si el acceso a datos va
por el **Supabase Client SDK** en vez de por una conexión directa: el SDK ya manda el JWT de
sesión en cada request contra PostgREST, así que RLS filtra de forma nativa sin ceremonia
adicional. Mantener Drizzle sería cargar con la complejidad que motivó ADR-012 sin ninguna
razón nueva para pagarla.

## Consecuencias

**A favor:**

- Un solo artefacto desplegable, un solo lenguaje de aplicación (TypeScript) más SQL para
  constraints y Edge Functions.
- Auth, RLS y una API generada resuelven en horas lo que ADR-016 estimaba en semanas de
  plomería.
- RLS es, otra vez, autorización real y no solo declarada — y es un caso de prueba negativo
  barato de escribir (NFR-13).
- El equipo se paraleliza igual: frontend contra el schema publicado en
  `supabase/migrations/` y las Edge Functions, sin esperar un backend propio.

**En contra, y hay que decirlo:**

- **Se pierde el contrato OpenAPI versionado como artefacto de testing** (C15 de la versión
  anterior de `03-architecture-spec.md`). El esquema de Postgres y las políticas RLS pasan a
  ser el contrato; el catálogo de casos de prueba tiene que diseñarse contra el schema y las
  Edge Functions, no contra una especificación HTTP generada.
- **La lógica de dominio deja de estar tan limpiamente aislada de la infraestructura.** C1
  (dominio puro sin `fastapi` ni `sqlalchemy`) no tiene un equivalente directo: las reglas
  de negocio no triviales viven en constraints/triggers de Postgres y en Edge Functions de
  Deno, que sí son infraestructura. Se compensa escribiendo esas reglas como funciones SQL
  testeables con pgTAP y funciones de Edge Function testeables con Deno Test/Vitest, en vez
  de aspirar a un módulo de dominio 100% independiente del motor de base.
- **Vuelve el riesgo que ADR-007 nombró en su momento:** la facilidad de Supabase empuja a
  resolver lógica ad hoc en el cliente. Se acota con la misma disciplina que proponía ADR-007
  — el navegador no improvisa reglas de negocio, las reglas no triviales viven en
  constraints, triggers o Edge Functions, nunca solo en un componente de React.
- **Siete ADRs cambian de estado otra vez:** 007, 008, 010, 012, 016, 018 quedan
  superados (008/010/012 no se reinstauran, ver arriba); 004, 013, 014 y 015 quedan
  modificados. Se conservan todos en `adr/` con su encabezado actualizado — el razonamiento
  que contienen sigue siendo lo que hace evaluable este ida y vuelta.
