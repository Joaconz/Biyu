# Casos de prueba V3 — Configuración inicial al crear la cuenta (US-68)

**Historia:** US-68 ([#159](https://github.com/Joaconz/Biyu/issues/159)) · ADR-025 · DEF-022, DEF-023 y DEF-028 · US-01, US-43 · C7.
**Oráculo:** una cuenta nueva ve la configuración inicial (`/setup`: motivo, categorías, cuentas y primer gasto), puede saltearla entera o completarla, y queda adentro de la app (`/register`). El estado vive en `user_setup`: después de completarlo, volver a iniciar sesión no muestra el setup. Un error al leer o guardar ese estado nunca bloquea el acceso, y una cuenta anterior a US-68 (sin fila en `user_setup`) entra directo a la app.
**Convenciones:** PR-01 crea el usuario (`docs/12-procedimientos-de-prueba.md`), pero acá se omite el paso de saltear el setup: es lo que se prueba. Para los casos de falla: DevTools → Network → bloquear las llamadas a `/rest/v1/user_setup`. Montos ficticios (C14).
**Automatización:** `e2e/setup.spec.ts`. Corre también contra el deploy (`SMOKE_URL`), así detecta una migración sin aplicar en la base hosteada.

| ID | Título | Criterio | Técnica | Tipo | Canal | Prioridad | Automatizable |
|---|---|---|---|---|---|---|---|
| CP-ACC-013 | Una cuenta nueva ve el setup, lo saltea y queda adentro de la app aunque recargue | ADR-025 | Casos de uso | Positivo | UI | Alta | Sí |
| CP-ACC-014 | Completar el setup con el primer gasto lleva a la app y al volver a iniciar sesión no reaparece | ADR-025 | Transición de estados | Positivo | UI | Alta | Sí |
| CP-ACC-015 | Si guardar o leer el estado del setup falla, igual se entra a la app | DEF-022 | Adivinación de errores | Negativo | UI | Alta | Sí |
| CP-ACC-016 | Una cuenta anterior a US-68, sin fila de setup, entra directo a la app | DEF-022 | Particiones | Límite | UI | Media | Sí |

## CP-ACC-013 — Saltear todo
**Pre-requisitos:** correo nuevo `setup-013@biyu.test`, sin cuenta previa.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Crear la cuenta en `/signup`. | Se abre `/setup`. |
| 2 | Saltear el motivo, las categorías, las cuentas y el primer gasto. | Llega a `/register` con el formulario visible. |
| 3 | Recargar la página. | Sigue en la app, sin volver a `/setup`. |

## CP-ACC-014 — Completar y volver a entrar
**Pre-requisitos:** correo nuevo `setup-014@biyu.test`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Crear la cuenta y completar el setup hasta cargar el primer gasto. | Llega a la app. |
| 2 | Cerrar sesión y volver a iniciar sesión. | Entra a la app y no ve `/setup`. |

## CP-ACC-015 — Falla de `user_setup`
**Pre-requisitos:** correo nuevo `setup-015@biyu.test`; bloqueadas las llamadas a `/rest/v1/user_setup`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Crear la cuenta, saltear todo y dejar que falle el guardado. | Igual llega a la app. |
| 2 | Cerrar sesión, iniciar de nuevo (con la lectura bloqueada). | Entra a la app: un error al leer el estado no bloquea el acceso. |

## CP-ACC-016 — Cuenta anterior a US-68
**Pre-requisitos:** una cuenta creada antes de US-68, sin fila en `user_setup` (se borra la fila por SQL en una base local).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Iniciar sesión. | Entra directo a `/register`; no queda atrapada en `/setup`. |
