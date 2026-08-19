# ADR-016 — API de Python separada del frontend

**Estado:** aceptada
**Supera a:** ADR-007 (Supabase como Postgres hosteado), ADR-008 (Drizzle y acceso por query builder), ADR-010 (conexión directa para Drizzle Kit), ADR-012 (Drizzle bajo RLS)
**Modifica:** ADR-013 (la regla de redondeo sigue; la elección de librería decimal ya no aplica), ADR-014 (la siembra idempotente sigue; su implementación cambia), ADR-015 (el arnés pasa de Supabase local a Postgres en Docker)
**Relacionada:** ADR-018

---

## Contexto

El proyecto pasó a ser el Trabajo Práctico Integrador de **Testing de Aplicaciones**, con un
equipo de cinco personas. Eso cambia dos cosas del encuadre original:

1. **Lo que se evalúa es el trabajo de calidad**, no la aplicación: requerimientos, historias
   de usuario, diseño y ejecución de pruebas, reportes de defectos y de ejecución. La
   arquitectura vale en la medida en que hace ese trabajo posible.
2. **Hay cinco personas trabajando en paralelo**, no una.

La arquitectura anterior era Next.js full-stack sobre Supabase: lecturas por Server
Components, escrituras por Server Actions, acceso con Drizzle, autorización por RLS.

El problema concreto: **una Server Action no es una superficie de prueba.** Es una llamada de
procedimiento remoto con un protocolo interno del framework. No se puede ejercitar con
`httpx`, ni con Postman, ni con un cliente HTTP escrito por alguien que no conoce Next.js.
Toda regla de negocio que se quiera probar por fuera del dominio puro obliga a levantar un
navegador. Para una materia cuyo entregable central es un catálogo de casos ejecutados, eso
es el cuello de botella.

## Decisión

Separar el sistema en dos artefactos: **una API REST en Python con FastAPI** y **un frontend
Next.js + React** que la consume. Postgres gestionado (Neon) por debajo, con SQLAlchemy y
Alembic. La autorización pasa a vivir en la capa de aplicación.

## Alternativas descartadas

**Seguir con Next.js full-stack y exponer Route Handlers en vez de Server Actions.** Resuelve
el problema de la superficie de prueba y es la opción más barata: un solo repo, un solo
despliegue, un solo lenguaje. Se descartó por dos razones, ninguna decisiva sola: el equipo
quería trabajar con Python, y con cinco personas un borde explícito entre frontend y backend
es lo que permite que dos pares avancen sin pisarse. Es la alternativa más seria de las tres
y merece quedar registrada como tal: si el proyecto fuera de una persona, sería la elección
correcta.

**Django + Django REST Framework.** Trae ORM, migraciones, panel de administración y auth ya
resueltos, que es menos código para el agente. Se descartó porque el dominio puro cuesta más
aislarlo: el estilo idiomático de Django pone la lógica en modelos que heredan de la capa de
persistencia, lo que choca de frente con C1, que es la restricción que hace presentable al
proyecto.

**Base documental (MongoDB u otra NoSQL).** Se evaluó y se descartó con claridad. La
invariante central del sistema es que la suma de las imputaciones sea exactamente el monto de
la transacción, y la escritura de transacción + N imputaciones + deuda tiene que ser atómica.
Postgres da eso con `numeric` exacto, restricciones de verificación, claves foráneas, índices
únicos parciales y transacciones. En una base documental las invariantes I2, I4, I5, I8, I9,
I11, I12, I13, I14 y I15 pasan todas a ser código de aplicación: diez lugares nuevos donde
tener un bug, en un sistema que maneja plata. Que la consigna diga que los defectos son
bienvenidos no es una licencia para poner los defectos en el motor de cálculo.

## Consecuencias

**A favor:**

- La API se puede probar sin navegador y la interfaz sin base de datos: cada nivel de prueba tiene su seam.
- FastAPI genera un contrato OpenAPI navegable, que es insumo directo para diseñar casos y se versiona como artefacto (C15).
- `decimal.Decimal` es de la biblioteca estándar de Python: desaparece la dependencia externa y el módulo de borde que ADR-013 necesitaba en TypeScript.
- Un solo lenguaje —Python— cubre dominio, API y end-to-end con Playwright en V3.
- El trabajo se paraleliza entre backend y frontend con un contrato en el medio.

**En contra, y hay que decirlo:**

- **Se pierde RLS como segunda red de contención.** Antes, un bug en la capa de servidor todavía chocaba contra una política de base. Ahora no: si un endpoint se olvida el filtro por dueño, filtra datos. Se compensa con el grupo obligatorio de pruebas de autorización de C7, no con una promesa de cuidado.
- Dos despliegues en vez de uno, CORS que configurar, y un token cruzando el borde (ADR-018).
- El estado del cliente ya no se resuelve con Server Components: hace falta una capa de cliente de API y manejo de carga y error en el frontend.
- Siete ADRs quedan superados (007, 008, 010, 012) o modificados (013, 014, 015). Se conservan en `adr/` con su encabezado actualizado: el razonamiento que contienen es lo que hace evaluable este cambio.
