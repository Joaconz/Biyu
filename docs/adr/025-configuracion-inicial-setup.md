# ADR-025 — Configuración inicial: dónde vive el estado y cómo se ubica en la navegación

**Estado:** aceptada · **Fecha:** 2026-09

## Contexto

US-68 (#159) pide un setup de una sola vez después de crear la cuenta: para qué se usa la app,
categorías, cuentas y primer gasto guiado. El issue deja tres decisiones abiertas y marca
DEF-017 (#165): la historia no estaba implementada. Este ADR las resuelve.

## 1. Dónde se guarda que el setup ya se hizo

**Alternativas:** `localStorage` (sin migración, pero no viaja entre dispositivos ni sobrevive un
"borrar datos del navegador" — el usuario vería el setup de nuevo aunque ya lo hizo); inferirlo de
"0 transacciones y catálogo sin tocar" (no distingue "salteó todo" de "todavía no entró", y una vez
guardado el primer gasto la inferencia ya no puede saber si alguna vez completó el paso 1); una
tabla de preferencias del usuario.

**Decisión:** tabla `user_setup` (una fila por usuario, `user_id` es la primary key), con
`usage_reason` (la respuesta de "para qué la usás", en texto libre acotado a 3 valores) y
`completed_at`. RLS de escritura directa igual que `categories`/`accounts` (C7): no hay invariante
financiera que proteger acá, así que no hace falta una RPC (C4 es solo para `transactions` y
`ledger_entries`).

## 2. Ruta y navegación

**Decisión:** `/setup`, dentro de `RequireAuth` (necesita sesión) pero **fuera de `AppLayout`**
(pantalla completa, sin nav ni header, como `/login`/`/signup`). No se toca el destino de
`AuthForm` después del signup (sigue siendo `/register`, US-01): en cambio, `AppLayout` —el layout
común a todas las rutas privadas— consulta `user_setup` una vez por sesión y redirige a `/setup`
si `completed_at` es null. Así:

- Cualquier entrada a una ruta privada (signup, login, refresh, un link directo a `/dashboard`)
  pasa por el mismo chequeo, sin repetirlo en cada página.
- `/setup` en sí nunca redirige — abrirlo desde Ajustes (CP-CFG-015) funciona igual después de
  completado.
- CP-ACC-003 (aterriza en `/register` después del signup) sigue pasando tal cual: el test no
  distingue "aterrizó en /register" de "aterrizó en /register y de ahí lo mandaron a /setup",
  y de hecho es lo segundo.

## 3. Qué personaliza la respuesta del paso 1

**Decisión:** nada, por ahora. Se guarda (`usage_reason`) para no perderla, pero no cambia textos
ni el orden del Resumen — eso queda fuera de esta implementación porque ninguna historia ni caso
de prueba lo pide todavía (CP-CFG-011 a 015 no lo ejercitan) y el propio US-68 aclara que "no
bloquea ni limita nada". Agregar personalización real es trabajo aparte, sobre esta misma
columna, cuando haya una historia que la pida.

## 4. Cuenta "predeterminada" del paso 3

US-07 ya resuelve esto sin una columna nueva: `fetchLastUsedAccountId()` (`src/lib/catalog.ts`)
usa la última cuenta usada en una transacción y, si no hay ninguna, el valor en
`localStorage`. El paso de cuentas del setup escribe ahí (`setStoredLastAccountId`) al marcar una
cuenta como predeterminada — la misma cuenta que después precarga el primer gasto guiado.

## 5. La siembra incompleta (401 justo después del signup)

El setup no puede asumir que `ensureUserSeeded()` (llamado desde `AuthForm` al crear la cuenta,
ADR-014) ya terminó: es best-effort y no bloquea la navegación. `SetupPage` la vuelve a llamar,
pero solo si la primera lectura de categorías **y** cuentas vuelve completamente vacía — el mismo
guard que ya usa `useCatalog` (`src/hooks/useCatalog.ts`). Sin ese guard, reabrir el setup ya
completado desde Ajustes (CP-CFG-015) resembraría cualquier categoría o cuenta que el usuario
archivó a propósito en el paso 2 o 3: `ensureUserSeeded` decide "falta sembrar" por nombre entre
las *activas*, así que algo archivado vuelve a calificar como faltante.

## 6. Corrección de DEF-022: nadie queda afuera de la app

La primera versión trataba "sin fila" como "setup pendiente" y cualquier error como "no
completado". Resultado: toda cuenta anterior a US-68 (que no tiene fila) tenía que hacer el
setup, y si guardar el setup fallaba (por ejemplo, con la migración sin aplicar en la base
hosteada) el usuario volvía a `/setup` en un bucle, sin mensaje y sin salida.

**Decisión:**

- La fila pendiente (`completed_at` null) la crea la base al registrarse, con un trigger
  `security definer` sobre `auth.users` (`20260930000000_user_setup_pending_on_signup.sql`).
  **Sin fila = cuenta anterior a US-68 = no se le pide el setup.** No hace falta backfill.
- `AppLayout` falla abierto: si leer el estado da error, entra a la app.
- Terminar el setup siempre navega a la app. Si guardar falla, se avisa con un toast y se entra
  igual (una marca en memoria vale por la sesión de la pestaña); el setup vuelve a aparecer la
  próxima vez.
- La regla vive en `src/lib/setupGate.ts`, pura y cubierta por Vitest; los flujos, en
  `e2e/setup.spec.ts`, que corre contra el deploy y detecta también una migración sin aplicar.

## Consecuencias

- Una tabla nueva (`user_setup`), su RLS y su par de tests pgTAP (C7).
- `AppLayout` hace una consulta más por sesión (no por navegación: se cachea en memoria mientras
  dura la sesión). Si falla, se entra a la app (§6).
- El primer gasto guiado reusa `TransactionForm` (ADR-024) tal cual, con un callback `onSaved`
  nuevo (opcional, sin uso en `/register`) para que el setup sepa cuándo cerrar. Sigue siendo una
  sola llamada a `create_transaction` (C4).
- Fuera de alcance, igual que en US-68: presupuestos, metas, límites por categoría, carga de TC.
