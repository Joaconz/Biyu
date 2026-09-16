# ADR-007 — Supabase se usa como Postgres hosteado, no como backend

**Estado:** superada por [ADR-016](016-api-python-separada-del-frontend.md), que a su vez fue revertida por [ADR-019](019-vuelta-a-supabase.md) · **Fecha:** 2026-08

> El proyecto dejó Supabase (ADR-016) y después volvió (ADR-019). Con la vuelta, **el riesgo
> que nombra este documento** —que Supabase empuja a desparramar lógica de negocio en
> componentes, con RLS como única autorización— vuelve a ser relevante y se acepta
> explícitamente en ADR-019 a cambio de tiempo de equipo. Lo que **no** vuelve tal cual es la
> restricción #2 de la "Decisión" de acá: ADR-019 no usa un query builder tipado (Drizzle):
> usa el Supabase Client SDK directo, así que RLS deja de ser "defensa en profundidad" y pasa
> a ser la autorización real — ver ADR-019 y el ADR-008 actualizado.

## Contexto

La alternativa evaluada era construir un backend propio (Node con Express/Fastify, o Python con FastAPI) contra un Postgres administrado por separado, en lugar de usar Supabase.

La pregunta parece ser "¿backend propio o BaaS?", pero está mal planteada: Next.js con Server Actions **ya es** una capa de servidor con validación, autorización, transaccionalidad y acceso a datos. Un backend separado no agrega capa de servidor — agrega un segundo despliegue, CORS y autenticación propia.

Lo que realmente se decide es más chico: quién hostea Postgres y quién resuelve la autenticación.

## Alternativas descartadas

**Backend Node separado.** Dos a tres semanas de plomería (auth, sesiones, hash de contraseñas, segundo pipeline de despliegue) a cambio de cero decisiones de diseño interesantes. Implementar autenticación a mano en 2026 no demuestra criterio: demuestra superficie de error, y en un repositorio público esa superficie es visible.

**Backend Python (FastAPI o Django).** Sale del stack fuerte del autor sin ganar nada. Python paga cuando el diferencial del proyecto es procesamiento de datos o modelos; acá el diferencial es modelado de dominio.

**Spring Boot.** Ya existe un proyecto anterior en el portfolio con backend Java/Spring Boot en capas. Repetir esa demostración tiene retorno cero. Lo que este proyecto puede mostrar y aquel no es modelado de reglas de negocio difíciles —prorrateo exacto, snapshot de tipo de cambio, reembolsos vinculados—, y esa lógica vive en `src/domain/`, indiferente a dónde esté alojado Postgres.

## El riesgo real de Supabase

No es el vendor lock. Es que empuja hacia un patrón donde el navegador consulta la base directamente y la lógica de negocio termina desparramada en componentes, con RLS haciendo de única autorización. Ese patrón es lo que le da mala fama a "proyecto hecho con Supabase", y con razón: no hay arquitectura para mostrar.

## Decisión

Supabase se usa como **Postgres administrado más proveedor de autenticación**, con tres restricciones que evitan el patrón anterior:

1. **El navegador nunca consulta datos.** El cliente de Supabase en el browser se usa exclusivamente para la sesión. Toda lectura y escritura de datos pasa por Server Actions y queries de servidor.
2. **El acceso a datos usa un query builder tipado** (Drizzle o Kysely) detrás de un seam de repositorio, con migraciones en código y SQL revisable. La base es Postgres, no un cliente propietario.
3. **RLS es defensa en profundidad, no la autorización.** La autorización real vive en la capa de servidor y está testeada. RLS es la red de contención por si algo se escapa.

## Consecuencias

- Migrar a un backend propio, si alguna vez tiene sentido, significa mover `src/server/` y el schema. `src/domain/` no se entera. Es la restricción C1 hecha cierta en la práctica y no solo declarada.
- El proyecto llega a estar usable en semanas en vez de meses, sin sacrificar nada que un evaluador vaya a mirar.
- Costo: una dependencia más (el query builder) y algo de fricción respecto de usar el SDK de Supabase directo. Es el precio de que el acceso a datos sea reemplazable.
- **Cuándo esta decisión sería incorrecta:** si el objetivo fuera aplicar a puestos de backend puro en empresas que filtran currículums por "diseñó e implementó una API". No es el caso de este proyecto.
