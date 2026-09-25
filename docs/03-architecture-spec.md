# Architecture Spec

_Cómo tiene que estar construido. Documento separado del spec de comportamiento a propósito: las reglas de acá sobreviven a los cambios de features._

> **Reescrito otra vez.** La versión anterior separaba una API de Python (FastAPI) del
> frontend (ADR-016). Esa decisión se revirtió: el equipo volvió a **Supabase** (Postgres +
> Auth + Row Level Security + Edge Functions) como backend, con un único frontend
> desplegable en React — ver [ADR-019](adr/019-vuelta-a-supabase.md). Las razones (C1, C7,
> C15 sobre todo) cambian de fondo respecto de la versión Python; las que no dependen del
> lenguaje del backend —C2 a C6, C8 a C14— se mantienen.

---

## Forma del sistema

Un único artefacto desplegable y una base de datos gestionada que también hace de backend:

```
   navegador
       │  HTTPS, Supabase Client SDK
       │  (JWT de sesión adjunto automáticamente en cada request)
       ▼
   ┌────────────────────────────────────────────┐
   │  biyu-web                                    │
   │  React (Vite) + PWA (Workbox)                │
   │  (Vercel o Netlify)                          │
   └───────────────────┬──────────────────────────┘
                        │
                        ▼
   ┌────────────────────────────────────────────┐
   │  Supabase                                    │
   │  Postgres · Auth · Row Level Security         │
   │  Edge Functions (Deno/TypeScript)             │
   └────────────────────────────────────────────┘
```

**El navegador habla directo con Supabase.** No hay un servidor de aplicación intermedio: el
Supabase Client SDK arma las consultas contra la API REST/GraphQL que Supabase autogenera
sobre el schema de Postgres, y adjunta el JWT de la sesión activa en cada request. Row Level
Security es lo que filtra por dueño en cada consulta — no hay una capa de aplicación que lo
haga a mano (ver C7).

**Por qué un solo artefacto.** El costo de dos despliegues, CORS y un esquema de
autenticación propio (ADR-016, ADR-018) competía con el tiempo disponible de un equipo de
cinco en el cronograma de la materia. Supabase resuelve auth, aislamiento por usuario y una
API generada sin escribir ese código — el intercambio, aceptado a ojos abiertos en
[ADR-019](adr/019-vuelta-a-supabase.md), es que la lógica de negocio no trivial pasa a vivir
en Postgres (constraints, triggers, funciones) y en Edge Functions, en vez de en un módulo de
dominio 100% independiente de la infraestructura.

---

## Stack

| Decisión | Elección | Razón |
|---|---|---|
| Frontend | React (Vite) + TypeScript + PWA (Workbox) | Mobile-first, un solo despliegue, instalable sin pasar por una tienda de apps |
| Backend / lógica de negocio | Supabase (Postgres + Auth + Row Level Security + Edge Functions) | Auth y aislamiento por usuario resueltos; API autogenerada; Edge Functions en Deno/TypeScript para lo que no es CRUD simple |
| Base de datos | PostgreSQL gestionado (Supabase) | Restricciones reales, `numeric` exacto, transacciones atómicas, RLS nativo. Es una app de plata |
| Acceso a datos | Supabase Client SDK (sesión persistida en `localStorage`) | Sin query builder ni ORM de servidor: las consultas van contra la API que Supabase genera del schema |
| Migraciones | Supabase CLI (`supabase migration new`, `supabase db push`) | Versionadas en `supabase/migrations/`, revisadas a mano antes de commitear |
| Validación | Constraints y triggers en Postgres (fuente de verdad) + Zod en el cliente y en las Edge Functions | El cliente valida para UX; la base es la que no se puede saltear |
| Auth | Supabase Auth (email + contraseña) | Sin código de autenticación propio; hasheo y emisión de sesión resueltos por el proveedor |
| Decimales | `decimal.js` en TypeScript (cliente y Edge Functions) | `numeric(14,2)` en Postgres es la fuente de verdad; `decimal.js` evita el error de punto flotante del lado de la app (ver ADR-013) |
| UI | Tailwind CSS + shadcn/ui | Componentes accesibles sin construirlos desde cero |
| Gráficos | Recharts | Barras por categoría, torta por categoría. Liviano |
| Pruebas | pgTAP (funciones SQL) · Deno Test / Vitest (Edge Functions) · Vitest + Testing Library (componentes) · Playwright (E2E, Chromium/WebKit/Firefox) · Lighthouse CI (rendimiento, accesibilidad, PWA) | Un nivel de prueba por cada lugar donde vive lógica |
| CI | GitHub Actions | Corre la suite en cada push y en cada pull request |
| Deploy | Vercel o Netlify (front) · Supabase (backend, base, auth) | Los tres con plan gratuito |

---

## Constraints

Reglas que la implementación debe respetar. Están escritas como restricciones, no como instrucciones: si el código las viola, está mal aunque funcione.

### C1 — La lógica de negocio no vive suelta en componentes de React
Ninguna regla de prorrateo, conversión de moneda, fecha de vencimiento o generación de ocurrencias se calcula ad hoc dentro de un componente. Vive en uno de dos lugares, nunca en un tercero: **funciones puras de TypeScript** en `src/domain/` (usadas para previsualizar en el cliente antes de guardar, sin depender del Supabase Client) o **Postgres** (constraints, triggers, funciones `plpgsql`) cuando la regla necesita atomicidad multi-fila. Las dos copias de una misma regla (la de `domain/` que previsualiza y la de Postgres que efectivamente escribe) tienen que dar el mismo resultado — es la razón por la que I1/I1' se verifican también con una vista de integridad (ver `04-data-model.md`), no solo con tests de dominio. **Tampoco leen el reloj del cliente para decidir qué existe:** `today` entra como parámetro a toda función de dominio.

### C2 — Los montos nunca se representan como punto flotante
Ni en TypeScript ni en Postgres. `numeric(14,2)` en la base, `decimal.js` en el cliente y en las Edge Functions. El borde de conversión (parseo del input del usuario, serialización a JSON) está aislado en un único módulo. **En las respuestas de la API los montos viajan como los devuelve PostgREST**: como texto en el JSON para columnas `numeric`, nunca parseados a `number` antes de pasar por `decimal.js`.

### C3 — La suma de las imputaciones de una transacción es exactamente igual al monto de la transacción
Es la invariante central del sistema. Se garantiza dentro de la función SQL que escribe la transacción (la última cuota absorbe el resto) y se verifica con pgTAP. Si esta invariante se rompe, todos los KPIs mienten.

### C4 — Crear una transacción es atómico
Transacción, sus N imputaciones y su deuda opcional se escriben todas o ninguna. Como no hay una capa de aplicación con transacciones explícitas, esto se implementa como una **función de Postgres** (`create_transaction`, expuesta como RPC) que hace todo el trabajo dentro de su propia transacción implícita — el cliente llama `supabase.rpc('create_transaction', {...})` una sola vez, nunca con inserts separados a `transactions`, `ledger_entries` y `debts`. Lo mismo vale para la puesta al día de suscripciones.

### C5 — Los datos históricos no se recalculan
El tipo de cambio aplicado se congela al momento de escribir. Editar configuración —o el monto de una suscripción— nunca cambia los totales de un período ya cargado. Cualquier feature futura que quiera recalcular el pasado necesita una decisión explícita y un ADR.

### C6 — Toda validación real vive en Postgres
La validación de cliente (Zod) es exclusivamente de experiencia de uso. Un pedido malicioso o malformado que llegue directo contra la API de Supabase —salteando el cliente— tiene que ser rechazado por constraints, triggers o la función RPC, nunca solo por el frontend. **Corolario operativo:** cada caso negativo del catálogo de pruebas se ejecuta dos veces, una por la interfaz y otra llamando la función RPC o la API REST directo con `curl` o Postman.

### C7 — La autorización vive en Row Level Security, y está testeada
Cada tabla tiene políticas `using (user_id = auth.uid())`. El Supabase Client SDK adjunta el JWT de la sesión en cada request contra PostgREST, así que `auth.uid()` resuelve al usuario real sin código adicional del lado de la aplicación. **Un recurso de otro usuario no aparece en la respuesta** — RLS lo filtra en el `WHERE` implícito de cada consulta, así que pedir por `id` un recurso ajeno da una respuesta vacía, no un error que confirme su existencia.

RLS pasa a ser la autorización real, no una segunda red de contención como en el diseño de la API propia. La compensación por no tener además una capa de aplicación que revalide es un grupo de pruebas de autorización obligatorio —para cada tabla, un caso que pide con la sesión de otro usuario y espera una respuesta vacía— y una revisión de que ninguna política tenga una condición más laxa que `user_id = auth.uid()`. El intercambio está razonado en [ADR-019](adr/019-vuelta-a-supabase.md).

### C8 — Ningún secreto sale del entorno que debería tenerlo
La `anon key` de Supabase es pública por diseño y viaja en el bundle del cliente — no es un secreto, es la credencial que hace que RLS sea la autorización real. La `service_role key` (que **se salta RLS por completo**) nunca viaja al navegador, nunca se commitea, y solo la usan las Edge Functions que corren en el servidor de Supabase y los scripts de administración o de arnés de tests.

### C9 — Los datos son exportables sin la aplicación
Export a CSV. Si el proyecto se abandona, los datos siguen siendo utilizables. Cuándo se construye está en `roadmap.md` (V2); la restricción es que exista.

### C10 — Ningún borrado es físico para las transacciones
Soft delete con `deleted_at`. Los meses cerrados no cambian por un tap equivocado.

### C11 — El estado de la vista vive en la URL
El período seleccionado y los filtros son parámetros de URL (React Router), no estado de cliente. Un mes es enlazable y compartible, y el botón de atrás funciona como se espera.

### C12 — Cada decisión no obvia tiene un ADR
Si al leer el código alguien puede razonablemente preguntar "¿por qué así?", hay un documento que responde.

### C13 — El repositorio es público desde el primer commit
No hay una fase privada donde las reglas sean más laxas. Ningún secreto, ninguna credencial y ningún dato financiero real entran al historial de git en ningún momento. Ver `05-repo-publico.md`.

### C14 — Ningún dato financiero real sale del entorno privado
Semillas, fixtures de test, capturas de pantalla y ejemplos de documentación usan montos ficticios.

### C15 — El schema y las Edge Functions son el contrato, y son un artefacto
No hay un OpenAPI generado: el contrato es el schema de Postgres (tablas, constraints, políticas RLS) versionado en `supabase/migrations/`, más las Edge Functions versionadas en `supabase/functions/`. Un cambio de contrato aparece como diff en el pull request. `supabase gen types typescript` genera los tipos de cliente a partir del schema real, así que un desalineamiento entre el tipo de TypeScript y la base es un error de compilación, no un bug en producción.

---

## Rationale de las restricciones no evidentes

**C1** — Es la restricción que hace que el proyecto sea presentable como trabajo de ingeniería a pesar de no tener un backend propio: sin ella, "usar Supabase" degrada rápido al patrón que ADR-007 advertía, lógica de negocio desparramada en componentes con RLS como única regla. Tener las mismas reglas escritas dos veces (TypeScript para previsualizar, SQL para escribir) es más caro que un único módulo de dominio, pero es el precio de no tener un backend de aplicación donde vivir una sola vez.

**C2** — `{"amount": "33333.33"}` es lo que devuelve PostgREST para una columna `numeric`: como string. Parsearlo a `number` de JavaScript antes de pasar por `decimal.js` reintroduce el error que C2 existe para evitar.

**C3** — En un sistema de dinero, un error de redondeo no es un bug menor: es un sistema que da respuestas equivocadas a la única pregunta que le hacés. Doce cuotas de $8.333,33 suman $99.999,96, no $100.000. Sin una regla explícita de absorción del resto, el error se acumula en silencio.

**C4** — Sin una función de Postgres que agrupe la escritura, el cliente tendría que hacer tres llamadas separadas (`transactions`, `ledger_entries`, `debts`) sin transaccionalidad real entre ellas — cualquier falla de red a mitad de camino deja una transacción sin sus imputaciones. La función RPC es lo que hace que "atómico" sea cierto sin una capa de aplicación que abra y cierre una transacción explícita.

**C5** — Guardar el tipo de cambio en una tabla de configuración por mes y usarlo al leer significa que editarlo reescribe la historia. Un gasto de USD 100 hecho a $1.250 costó $125.000, y eso no cambia porque hoy el dólar valga $1.400.

**C7** — Es la restricción central de esta versión de la arquitectura. RLS deja de ser una red de contención declarada "por las dudas" y pasa a ser lo único que separa los datos de un usuario de los de otro — no hay una capa de aplicación de respaldo. Que el Supabase Client SDK mande el JWT en cada request es lo que hace que esto funcione sin ceremonia adicional (a diferencia del diseño con Drizzle de ADR-008/012, donde había que simular la sesión a mano).

**C13 y C14** — Un tracker de finanzas personales en un repositorio público tiene un riesgo que otros proyectos no tienen: un archivo de semillas con montos reales, o una captura del dashboard en el README, publica cuánto gana y cuánto gasta el autor. El historial de git no se edita: rescribirlo después es reescribir todos los hashes.

**C10** — Con cuotas, borrar una transacción de hace cuatro meses cambia los totales de cuatro meses. El soft delete deja rastro y permite revertir.

---

## Seams de testing

El objetivo es la menor cantidad de seams posible, ubicados lo más alto que se pueda.

| Seam | Qué prueba | Herramienta | Volumen |
|---|---|---|---|
| **Dominio puro** (TypeScript) | Prorrateo, redondeo, conversión, KPIs — la versión de previsualización en el cliente | Vitest, casos parametrizados | El grueso |
| **Base de datos** | Invariantes (I1-I17), atomicidad de las funciones RPC, políticas RLS | pgTAP contra Supabase local | Uno por invariante, más el grupo obligatorio de autorización |
| **Edge Functions** | Cierre de tarjeta, puesta al día de suscripciones: idempotencia, casos de borde de fecha | Deno Test / Vitest | Pocos, elegidos |
| **Componentes** | Comportamiento visible de la UI condicional | Vitest + Testing Library | Un puñado |
| **Flujo completo** | Humo del deploy; en V3 el subconjunto automatizado, en los tres motores de navegador | Playwright (Chromium, WebKit, Firefox) | Uno en V1, se amplía en V3 |

Regla: si algo se puede probar en el dominio o con pgTAP, no se prueba más arriba. Los tests de componentes y E2E existen para lo que ninguno de los dos puede ver — interacción real del navegador, PWA, accesibilidad.

**Grupo obligatorio de autorización.** Por cada tabla (`transactions`, `debts`, `subscriptions`, `categories`, `accounts`, `fx_rates`) hay un caso pgTAP que consulta con la sesión de otro usuario y espera cero filas, y otro que consulta sin sesión (rol `anon`) y espera cero filas. Es el reemplazo explícito de lo que antes hacía una capa de aplicación con checks propios; si falta, C7 no está cubierta.

---

## Estructura de repositorios

Un único repositorio, un único frontend desplegable, un proyecto de Supabase.

```
biyu/
  docs/                    # este spec, ADRs
  src/
    domain/                # C1: funciones puras de TypeScript
      installments.ts      # prorrateo, absorción del resto
      money.ts              # decimal.js, conversión, redondeo
      period.ts              # borde de conversión YYYY-MM ↔ date día 1
      summary.ts               # cálculo de resumen mensual (previsualización)
      subscriptions.ts          # cómputo de ocurrencias pendientes (previsualización)
    components/
    pages/                       # rutas de React Router
    lib/                          # cliente de Supabase, hooks de sesión, formateo
    hooks/
  supabase/
    tests/database/                    # pgTAP (supabase test db) — invariantes, atomicidad, RLS
    migrations/                    # schema, constraints, políticas RLS — versionado (Supabase CLI)
    functions/                      # Edge Functions (Deno/TypeScript)
      close-card-cycle/              # FR-14: cierre de tarjeta
      run-subscription-catchup/       # puesta al día de suscripciones (ADR-017)
  tests/
    domain/                           # Vitest — el grueso
    functions/                          # Deno Test / Vitest — Edge Functions
    components/                          # Testing Library
  e2e/                                   # Playwright — Chromium, WebKit, Firefox
  public/                                 # manifest.json, íconos PWA
  docker-compose.yml                       # Postgres local, si no se usa `supabase start`
  .github/workflows/
```

**Por qué no un monorepo con dos apps.** Al no haber una API propia, no hay un segundo artefacto que versionar por separado: el schema de Supabase vive en el mismo repo que lo consume, y un cambio que toca una tabla y el componente que la lee se revisa en un solo pull request.

---

## Technical Decisions

Decisiones de implementación, no de producto. Se documentan acá y no en un ADR porque no cambian qué hace el sistema.

1. **Las imputaciones se generan dentro de una función de Postgres (`create_transaction`), no en el cliente.** El cliente tiene su propia copia en TypeScript (`domain/installments.ts`) únicamente para previsualizar el impacto mensual antes de guardar (historia 13) — la copia que efectivamente persiste es la de la función SQL, y es la única fuente de verdad. La vista de integridad `ledger_integrity_violations` (igual que en el diseño anterior) expone cualquier transacción cuya suma de imputaciones no cuadre; no debería devolver filas nunca, dado que la función RPC es el único camino de escritura.

2. **`period` es `date` truncada al día 1**, con `CHECK (extract(day from period) = 1)` en cada tabla que la tiene. Habilita comparaciones y `generate_series` nativos para el selector de meses. El formateo a `YYYY-MM` vive en un único módulo, `domain/period.ts`.

3. **Editar una transacción borra y regenera todas sus imputaciones**, dentro de la misma función de Postgres, cuando cambia `amount`, `installments_count`, `first_period`, `currency` o `fx_rate`. Válido mientras no existan ajustes manuales por cuota individual. La edición llega en V2 (ver `roadmap.md`), elegida justamente porque es lo que más fácilmente rompe C3 en silencio y por lo tanto el mejor objetivo de una suite de regresión.

4. **La puesta al día de suscripciones corre como Edge Function** (`run-subscription-catchup`), invocada por el cliente apenas resuelve la sesión, antes de renderizar el dashboard — no hay middleware de servidor que la dispare automáticamente como en el diseño con FastAPI, así que el cliente la llama explícitamente al arrancar. La idempotencia sigue garantizada en dos capas: la función no propone un período ya generado, y el índice único parcial sobre `transactions (subscription_id, subscription_period)` lo impediría igual (I11). Ver ADR-017 y `06-suscripciones.md`.

5. **Tests de integración contra Supabase local** (`supabase start`, Docker), en la máquina de desarrollo y en GitHub Actions. Descartado un proyecto de Supabase remoto compartido: el repositorio es público (C13) y un pull request desde un fork no tiene acceso a los secretos de Actions, así que dejaría sin cobertura de CI a cualquier contribución externa. Cada test de pgTAP corre en una transacción que se revierte al final (ver ADR-015).

6. **El schema se declara en SQL y las migraciones se versionan con Supabase CLI** (`supabase migration new`, `supabase db push` o `supabase db diff` para generarlas a partir de cambios hechos en el panel local), revisadas a mano antes de commitear. Descartado: un ORM con su propio DSL de schema (Drizzle, Prisma) — con Supabase como backend, el schema de Postgres ya es la fuente de verdad que consume el cliente vía `supabase gen types typescript`; una capa de ORM encima sería una segunda representación del mismo schema para sincronizar a mano.

7. **La sesión la maneja el Supabase Client SDK, persistida en `localStorage`.** No hay token propio que emitir ni cookie que configurar (ADR-018 queda revertido): `supabase-js` renueva el access token automáticamente contra Supabase Auth y lo adjunta a cada request. El costo es el mismo de cualquier sesión en `localStorage` — vulnerable a XSS si algún día se introduce una dependencia de cliente no confiable — mitigado con la política de contenido estándar y sin ejecutar HTML de terceros sin sanitizar.
