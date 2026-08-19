# ADR-011 — Registro público de usuarios: la app pasa a ser multi-tenant

**Estado:** aceptada · **Fecha:** 2026-08

## Contexto

ADR-004 decidió "un solo usuario, creado a mano desde el panel de Supabase: no hay
registro público ni invitaciones". Esa decisión estaba bien justificada en su momento —
la app no tenía onboarding, no tenía sentido resolver un problema que no existía.

Se decide ahora agregar `/signup`: cualquiera con el link puede crear su propia cuenta
con email y contraseña.

## Por qué ahora

No hay un motivo de producto nuevo — sigue siendo la misma app, para el mismo caso de uso.
El motivo es que `user_id` en las seis tablas y RLS filtrando por `auth.uid()` ya estaban
desde ADR-004 precisamente para no tener que migrar datos el día que esto pasara. Abrir el
registro es barato ahora mismo; sería una migración incómoda si hubiera esperado a que
existieran filas.

## Decisión

- Ruta `/signup`, separada de `/register` (que en este proyecto es y va a seguir siendo el
  formulario de carga de gastos del Slice 2 — el nombre está tomado por el behavior spec
  desde antes de que existiera este ADR).
- Registro **abierto**: cualquiera con el link crea una cuenta. Sin invitación, sin
  allowlist.
- **Sin confirmación de email.** La cuenta queda activa y con sesión inmediatamente
  después de registrarse.

## Alternativas descartadas

**Código de invitación en variable de entorno.** Un campo más en el formulario, validado
server-side contra un valor fijo en `.env`. Mantiene el registro cerrado a quien vos
decidas sin agregar tablas. Se descarta no porque sea mala idea, sino porque la decisión
explícita fue abrir el registro sin fricción — si en algún momento se necesita cerrar de
nuevo, este es el camino más barato y queda anotado acá para cuando haga falta.

**Allowlist de emails.** Más explícito que el código de invitación (control por persona,
no por posesión de un secreto compartido), pero más rígido: sumar a alguien requiere
redeploy. Mismo descarte que el anterior.

**Confirmación de email obligatoria.** Es lo que cualquier guía de "cómo lanzar un
producto" recomendaría para algo público. Se descarta por una razón concreta, no por
pereza: el proveedor de email integrado de Supabase tiene un límite muy bajo de envíos por
hora, pensado para desarrollo, no para tráfico real. Activarlo de verdad requiere configurar
un proveedor SMTP propio (Resend, Postmark, lo que sea) — otra cuenta, otra clave de API,
otra variable de entorno. Es trabajo real que no está justificado todavía.

El código de `/signup` (`src/app/(auth)/signup/actions.ts`) detecta el caso: si
`supabase.auth.signUp` no devuelve sesión, la Server Action lo nota y muestra un mensaje en
vez de asumir que siempre hay una. Pero eso **no** es lo mismo que "el flujo funciona sin
tocar código" si mañana se activa "Confirm email" desde el panel de Supabase. Detectar la
ausencia de sesión es necesario, no suficiente — faltaría, como mínimo:

- una ruta de callback que canjee el token del link del email (hoy no existe ninguna);
- pasar `options.emailRedirectTo` en la llamada a `signUp`;
- agregar esa ruta a `PUBLIC_PATHS` en `middleware-client.ts` — si no, el proxy de sesión la
  rebota a `/login` antes de que el canje corra;
- `ensureUserSeeded` no se llama en la rama sin sesión (ver ADR-014); el usuario quedaría
  sin categorías ni cuentas hasta que la red de contención de `/register` lo cubra, recién
  después de que logre iniciar sesión.

Queda anotado como el trabajo pendiente para el día que se active, no como algo ya resuelto.

## Consecuencias que se asumen conscientemente

- **Cualquiera puede registrarse con un email que no le pertenece.** Sin confirmación, no
  hay verificación de que quien se registra sea dueño de esa casilla. Es el costo directo
  de la decisión anterior.
- **No hay mitigación de bots.** Un CAPTCHA (hCaptcha, Turnstile) es la respuesta estándar,
  pero agrega una dependencia y una clave de API más que la spec no justifica hoy. Si el
  registro empieza a llenarse de cuentas basura, es la primera cosa a agregar — y en ese
  momento sí está justificado.
- **Crecimiento no acotado sobre el plan gratuito de Supabase.** Cada cuenta nueva consume
  cuota del proyecto (filas, storage de auth, ancho de banda). En un proyecto de portfolio
  con tráfico bajo no es un riesgo real hoy; si el repositorio se vuelve popular, sí lo es.
- **No hay recuperación de contraseña.** Consecuencia de no tener SMTP configurado (mismo
  motivo que la falta de confirmación de email). Si alguien pierde su contraseña, se
  resetea a mano desde el panel de Supabase — hoy es viable porque el volumen de usuarios
  es bajo.
- **El nivel de riesgo de ADR-008 cambió.** Con un solo usuario, un bug de autorización en
  `src/server/` que se saltee el filtro por `user_id` exponía los datos del propio usuario
  — inofensivo. Con registro abierto, el mismo bug expone los datos de **otra persona**.
  Ver ADR-012.

## Fuera de este ADR

Sembrar categorías y cuentas por default al crear una cuenta nueva. Con un usuario único
se sembraba a mano una sola vez; con registro abierto, cada cuenta nueva arranca vacía y la
historia 43 del behavior spec (`docs/02-behavior-spec.md`) deja de ser opcional. Es trabajo
del Slice 2, no de este cambio — se anota acá para que no se pierda.
