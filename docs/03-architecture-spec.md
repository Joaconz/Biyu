# Architecture Spec

_Cómo tiene que estar construido. Documento separado del spec de comportamiento a propósito: las reglas de acá sobreviven a los cambios de features._

> **Reescrito.** La versión anterior asumía Next.js full-stack sobre Supabase con Drizzle.
> El proyecto pasó a **API de Python separada del frontend** (ADR-016). Los ADRs 007, 008,
> 010 y 012 quedaron **superados** por esa decisión, y los 013, 014 y 015 **modificados**;
> los siete siguen en `adr/` con su encabezado actualizado, porque el razonamiento que
> contienen es lo que justifica el cambio.

---

## Forma del sistema

Dos artefactos desplegables y una base de datos:

```
   navegador
       │  HTTPS, JSON, Bearer token
       ▼
   ┌──────────────────┐        ┌──────────────────┐        ┌────────────┐
   │  biyu-web        │───────▶│  biyu-api        │───────▶│ PostgreSQL │
   │  Next.js + React │        │  FastAPI         │        │  (Neon)    │
   │  (Vercel)        │        │  (Render)        │        └────────────┘
   └──────────────────┘        └──────────────────┘
```

**El navegador nunca habla con la base.** Toda lectura y escritura pasa por la API, que
resuelve el usuario desde el token y filtra por dueño en cada consulta.

**Por qué separadas.** La razón principal no es de arquitectura, es de testeabilidad: con una
API HTTP explícita se pueden diseñar y ejecutar casos de prueba de reglas de negocio sin
levantar un navegador, y casos de interfaz sin levantar una base. En V3 eso es lo que hace
que automatizar sea barato. El costo — dos despliegues, CORS, un token cruzando el borde —
está aceptado a ojos abiertos en ADR-016.

---

## Stack

| Decisión | Elección | Razón |
|---|---|---|
| Frontend | Next.js (App Router) + React + TypeScript | Mobile-first, un solo despliegue del lado del cliente, enrutado y estado en la URL resueltos (C11) |
| Backend | Python 3.12 + FastAPI | API REST con contrato OpenAPI generado; el contrato es insumo directo del diseño de casos de prueba |
| Base de datos | PostgreSQL gestionado (Neon) | Restricciones reales, `numeric` exacto, transacciones atómicas. Es una app de plata (ADR-016) |
| Acceso a datos | SQLAlchemy 2.0 (estilo declarativo) + Alembic | Migraciones versionadas en el repo, revisadas a mano antes de commitear |
| Validación | Pydantic v2 en el servidor, Zod en el cliente | Un esquema por operación de cada lado. El del servidor manda (C6) |
| Auth | JWT propio emitido por la API | Sin proveedor externo; el hasheo va con `argon2`. Ver ADR-018 |
| Decimales | `decimal.Decimal` (biblioteca estándar) | Sin dependencia externa: es la simplificación más grande que trajo el cambio de lenguaje |
| UI | Tailwind CSS + shadcn/ui | Componentes accesibles sin construirlos desde cero |
| Gráficos | Recharts | Barras por categoría. Liviano |
| Pruebas | pytest + httpx (dominio y API) · Vitest + Testing Library (componentes) · Playwright, binding de Python (E2E) | Un solo lenguaje para dominio, API y E2E |
| CI | GitHub Actions | Corre la suite en cada push y en cada pull request |
| Deploy | Vercel (web) · Render (api) · Neon (base) | Los tres con plan gratuito, los tres en la lista de la consigna |

---

## Constraints

Reglas que la implementación debe respetar. Están escritas como restricciones, no como instrucciones: si el código las viola, está mal aunque funcione.

### C1 — La lógica de negocio no puede depender del framework ni de la base de datos
Ningún módulo bajo `domain/` importa `fastapi`, `sqlalchemy`, `httpx` ni nada de infraestructura. Las funciones de dominio reciben datos planos y devuelven datos planos. **Tampoco leen el reloj:** `date.today()` no aparece en `domain/`; la fecha entra como parámetro.

### C2 — Los montos nunca se representan como punto flotante
Ni en Python ni en Postgres. `numeric(14,2)` en la base, `decimal.Decimal` en el código, y el tipo de SQLAlchemy configurado con `asdecimal=True`. El borde de conversión (parseo del input del usuario, serialización a JSON) está aislado en un único módulo. **En JSON los montos viajan como string, nunca como número**: `JSON.parse` de JavaScript los convertiría a `double` y la invariante se rompería en el viaje.

### C3 — La suma de las imputaciones de una transacción es exactamente igual al monto de la transacción
Es la invariante central del sistema. Se garantiza en el dominio (la última cuota absorbe el resto) y se verifica en tests. Si esta invariante se rompe, todos los KPIs mienten.

### C4 — Crear una transacción es atómico
Transacción, sus N imputaciones y su deuda opcional se escriben todas o ninguna, en una sola transacción de base. No puede existir una transacción sin imputaciones en ningún estado intermedio observable. Lo mismo vale para cada ocurrencia de una puesta al día de suscripciones.

### C5 — Los datos históricos no se recalculan
El tipo de cambio aplicado se congela al momento de escribir. Editar configuración —o el monto de una suscripción— nunca cambia los totales de un período ya cargado. Cualquier feature futura que quiera recalcular el pasado necesita una decisión explícita y un ADR.

### C6 — Toda validación existe en el servidor
La validación de cliente es exclusivamente de experiencia de uso. Un pedido malicioso o malformado que llegue directo a la API debe ser rechazado con las mismas reglas. **Corolario operativo:** cada caso negativo del catálogo de pruebas se ejecuta dos veces, una por la interfaz y otra por la API cruda.

### C7 — La autorización vive en la capa de aplicación, y está testeada
Cada endpoint resuelve el `user_id` desde el token y lo aplica en el `WHERE`. El `user_id` **nunca** se lee del cuerpo del pedido. Un recurso que existe pero es de otro usuario devuelve **404, no 403**: un 403 confirmaría su existencia.

Al soltar Supabase se perdió RLS como segunda red de contención. La compensación es un grupo de pruebas de autorización obligatorio —para cada recurso, un caso que pide con el token de otro usuario— y una revisión de que ninguna consulta parta de un identificador del cliente sin filtro de dueño. El intercambio está razonado en ADR-016.

### C8 — Ningún secreto vive en la base de datos ni viaja al cliente
Claves y cadenas de conexión van en variables de entorno del servidor. El frontend solo conoce la URL pública de la API.

### C9 — Los datos son exportables sin la aplicación
Export a CSV. Si el proyecto se abandona, los datos siguen siendo utilizables. Cuándo se construye está en `roadmap.md` (V2); la restricción es que exista.

### C10 — Ningún borrado es físico para las transacciones
Soft delete con `deleted_at`. Los meses cerrados no cambian por un tap equivocado.

### C11 — El estado de la vista vive en la URL
El período seleccionado y los filtros son parámetros de URL, no estado de cliente. Un mes es enlazable y compartible, y el botón de atrás funciona como se espera.

### C12 — Cada decisión no obvia tiene un ADR
Si al leer el código alguien puede razonablemente preguntar "¿por qué así?", hay un documento que responde.

### C13 — El repositorio es público desde el primer commit
No hay una fase privada donde las reglas sean más laxas. Ningún secreto, ninguna credencial y ningún dato financiero real entran al historial de git en ningún momento. Ver `05-repo-publico.md`.

### C14 — Ningún dato financiero real sale del entorno privado
Semillas, fixtures de test, capturas de pantalla y ejemplos de documentación usan montos ficticios.

### C15 — La API es el contrato, y el contrato es un artefacto
El esquema OpenAPI que genera FastAPI se exporta a `docs/openapi.json` y se versiona. Un cambio de contrato aparece como diff en el pull request. Es lo que permite que el equipo de pruebas diseñe casos sin leer el código del backend, y lo que hace evidente una ruptura de compatibilidad.

---

## Rationale de las restricciones no evidentes

**C1** — Es lo que hace que el proyecto sea presentable como trabajo de ingeniería. La lógica de cuotas, de conversión y de generación de suscripciones es lo único genuinamente difícil del sistema; si vive dentro de un endpoint o de un componente de React, no se puede testear en serio ni explicar por separado. La cláusula del reloj es lo que permite escribir "no abrí la app en tres meses" como un test de una línea.

**C2, cláusula del JSON** — Es el error que un sistema de plata con API separada comete y no nota: `{"amount": 33333.33}` sobrevive el `json.dumps` de Python y muere en el `JSON.parse` del navegador, donde pasa a ser un `double`. Sumar doce de esos en el cliente da un número que no cierra contra el total del servidor. Mandar `"33333.33"` como string lo elimina de raíz.

**C3** — En un sistema de dinero, un error de redondeo no es un bug menor: es un sistema que da respuestas equivocadas a la única pregunta que le hacés. Doce cuotas de $8.333,33 suman $99.999,96, no $100.000. Sin una regla explícita de absorción del resto, el error se acumula en silencio.

**C5** — Guardar el tipo de cambio en una tabla de configuración por mes y usarlo al leer significa que editarlo reescribe la historia. Un gasto de USD 100 hecho a $1.250 costó $125.000, y eso no cambia porque hoy el dólar valga $1.400.

**C7** — La regla del 404 no es paranoia: es la diferencia entre una API que filtra la existencia de recursos ajenos y una que no. Y es un caso de prueba concreto, no una postura.

**C13 y C14** — Un tracker de finanzas personales en un repositorio público tiene un riesgo que otros proyectos no tienen: un archivo de semillas con montos reales, o una captura del dashboard en el README, publica cuánto gana y cuánto gasta el autor. El historial de git no se edita: rescribirlo después es reescribir todos los hashes.

**C10** — Con cuotas, borrar una transacción de hace cuatro meses cambia los totales de cuatro meses. El soft delete deja rastro y permite revertir.

---

## Seams de testing

El objetivo es la menor cantidad de seams posible, ubicados lo más alto que se pueda.

| Seam | Qué prueba | Herramienta | Volumen |
|---|---|---|---|
| **Dominio puro** (principal) | Prorrateo, redondeo, conversión, KPIs, ocurrencias de suscripción | pytest, casos parametrizados | El grueso |
| **API** | Atomicidad, validación de servidor, autorización cruzada, efectos en base | pytest + httpx + Postgres en Docker | Pocos, elegidos |
| **Componentes** | Comportamiento visible de la UI condicional | Vitest + Testing Library | Un puñado |
| **Flujo completo** | Humo del deploy; en V3 el subconjunto automatizado | Playwright (Python) | Uno en V1, se amplía en V3 |

Regla: si algo se puede probar en el dominio, no se prueba más arriba. Los tests de la API existen para lo que el dominio no puede ver — transaccionalidad, autorización, restricciones de la base.

**Grupo obligatorio de autorización.** Por cada recurso (`transactions`, `debts`, `subscriptions`, `categories`, `accounts`, `fx_rates`) hay un caso que lo pide con el token de otro usuario y espera 404, y otro que lo pide sin token y espera 401. Es el reemplazo explícito de lo que antes hacía RLS; si falta, C7 no está cubierta.

---

## Estructura de repositorios

Un monorepo, dos aplicaciones. Un solo repositorio mantiene el spec, los ADRs y el contrato de la API en el mismo historial que el código de ambos lados.

```
biyu/
  docs/                  # este spec, ADRs, openapi.json
  api/
    src/biyu/
      domain/            # C1: cero dependencias de infraestructura
        installments.py  # generate_ledger_entries
        money.py         # Decimal, conversión, redondeo
        period.py        # borde de conversión YYYY-MM ↔ date día 1
        summary.py       # compute_monthly_summary
        subscriptions.py # compute_due_occurrences
        rules.py         # reglas de negocio puras (I6, I7, I12-I17)
      api/               # routers de FastAPI: validan, llaman al dominio, persisten
      db/                # modelos SQLAlchemy, sesión, migraciones Alembic
      auth/              # emisión y verificación de JWT, hasheo
      seed/              # siembra idempotente del set inicial por usuario
    tests/
      domain/            # el grueso
      api/               # integración contra Postgres en Docker
      test_architecture.py   # falla si domain/ importa infraestructura (M2)
  web/
    app/                 # rutas Next.js
    components/
    lib/                 # cliente de la API, esquemas Zod, formateo
    tests/
  e2e/                   # Playwright — V1: humo; V3: subconjunto automatizado
  docker-compose.yml     # Postgres local para tests de integración
  .github/workflows/
```

**Por qué monorepo y no dos repos.** Un cambio que toca el contrato toca los dos lados; con dos repos eso son dos pull requests que pueden mergearse desordenados y romper el ambiente. Con uno, el diff del contrato, del backend y del frontend se revisan juntos. El costo es un CI con dos jobs, que es trivial.

---

## Technical Decisions

Decisiones de implementación, no de producto. Se documentan acá y no en un ADR porque no cambian qué hace el sistema.

1. **Las imputaciones se generan en Python, no en un trigger de Postgres.** Favorece C1: testeable sin base de datos. Un `CHECK` no puede comparar `sum(ledger_entries.amount)` contra `transactions.amount` porque no cruza tablas, así que la garantía en la base no es una restricción sino una **vista de integridad**, `ledger_integrity_violations`, que expone las transacciones cuya suma no cuadra. Sirve de aserción en los tests de integración y de herramienta de inspección manual.

2. **`period` es `date` truncada al día 1**, con `CHECK (extract(day from period) = 1)` en cada tabla que la tiene. Habilita comparaciones y `generate_series` nativos para el selector de meses. El formateo a `YYYY-MM` vive en un único módulo, `domain/period.py` — es el borde de conversión, igual que `money.py` lo es para los montos.

3. **Editar una transacción borra y regenera todas sus imputaciones**, en la misma transacción de base, cuando cambia `amount`, `installments_count`, `first_period`, `currency` o `fx_rate`. Válido mientras no existan ajustes manuales por cuota individual. Ver ADR-009. La edición llega en V3 como mejora funcional menor, elegida justamente porque es lo que más fácilmente rompe C3 en silencio y por lo tanto el mejor objetivo de una suite de regresión.

4. **La puesta al día de suscripciones corre en una dependencia de FastAPI**, antes de resolver cualquier endpoint autenticado de lectura o de edición. No hay worker ni scheduler. Ver ADR-017 y `06-suscripciones.md`.

5. **Tests de integración contra Postgres en Docker** (`docker compose up -d db`), en la máquina de desarrollo y en GitHub Actions como *service container*. Descartado un Postgres remoto compartido: el repositorio es público (C13) y un pull request desde un fork no tiene acceso a los secretos de Actions, así que dejaría sin cobertura de CI a cualquier contribución externa. Cada test corre en una transacción que se revierte al final.

6. **El schema se declara en SQLAlchemy y las migraciones se generan con Alembic** (`alembic revision --autogenerate`), revisadas a mano antes de commitear. Descartado: crear tablas con `create_all` — no deja migración versionada y hace que el schema de producción no sea reproducible desde el repo.

7. **El token va en `Authorization: Bearer`, no en una cookie.** Con frontend y API en dominios distintos, una cookie exige `SameSite=None; Secure` y arrastra el problema de CSRF. Un header no lo tiene. El costo es que el token vive en memoria del cliente y se pierde al recargar; se compensa con un refresh token de vida larga en cookie `HttpOnly` del dominio de la API. Ver ADR-018.
