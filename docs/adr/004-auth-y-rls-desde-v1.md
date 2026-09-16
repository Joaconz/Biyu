# ADR-004 — Autenticación real y RLS desde v1

**Estado:** parcialmente superada por [ADR-011](011-signup-publico-multi-tenant.md) · **Fecha:** 2026-08

> La decisión de "un solo usuario, creado a mano" (línea 17 de este documento) quedó
> reemplazada por el registro público — ver ADR-011. El resto de este ADR sigue vigente sin
> cambios: Supabase Auth con email y contraseña, `user_id` en todas las tablas desde el
> día uno, y RLS filtrando por `auth.uid()`. De hecho, es precisamente haber nacido con esa
> columna lo que hizo que abrir el registro no requiriera ninguna migración de datos — el
> "camino a multi-usuario queda abierto sin refactor" de la sección Consecuencias, cumplido.
>
> **Nota posterior.** El proyecto pasó brevemente por una API propia con JWT propio
> (ADR-016, ADR-018), donde este documento quedaba solo parcialmente vigente. [ADR-019](019-vuelta-a-supabase.md)
> volvió a Supabase, así que la decisión de acá —Supabase Auth y RLS filtrando por
> `auth.uid()`— vuelve a ser la autorización real del sistema, no solo un punto de partida
> histórico.

## Contexto

La propuesta original planteaba una app de un solo usuario, sin autenticación, con RLS "permisiva" en Supabase y la estructura lista para multi-usuario más adelante.

## Problema

La aplicación se despliega en una URL pública de Vercel. La `anon key` de Supabase viaja en el bundle del cliente por diseño — es información pública. Sin RLS efectiva, cualquiera que abra la URL y mire el JavaScript puede leer y escribir la base entera.

Además, agregar `user_id` a cinco tablas con datos adentro es una migración incómoda. Nacer con la columna cuesta casi nada.

## Decisión

Supabase Auth con email y contraseña. El usuario se crea a mano desde el panel de Supabase: no hay registro público ni invitaciones. Todas las tablas llevan `user_id` con políticas RLS que filtran por `auth.uid()`. La sesión persiste entre visitas en el celular.

`ledger_entries` lleva `user_id` denormalizado para que la política no tenga que hacer un join por fila.

## Consecuencias

- Una pantalla de login más y un middleware de sesión. Es medio día de trabajo.
- El camino a multi-usuario queda abierto sin refactor de datos.
- La app deja de ser una base de datos abierta en internet, que es lo mínimo exigible para algo que se muestra en un portfolio.
