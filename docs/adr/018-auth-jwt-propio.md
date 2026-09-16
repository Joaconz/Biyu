# ADR-018 — Autenticación con JWT propio emitido por la API

**Estado:** superada por [ADR-019](019-vuelta-a-supabase.md)
**Supera a:** la parte de ADR-004 y ADR-011 que asumía Supabase Auth. El registro público y el modelo multi-tenant de ADR-011 siguen vigentes.
**Relacionada:** ADR-016

> **Revertida junto con ADR-016.** [ADR-019](019-vuelta-a-supabase.md) vuelve a Supabase Auth:
> no hay más API propia que emita JWT, así que este esquema de access/refresh token deja de
> aplicarse. El análisis de por qué un JWT propio pesa contra Supabase Auth queda como
> referencia si la decisión se revisita otra vez.

---

## Contexto

Con la API separada (ADR-016), el frontend ya no tiene un cliente de base de datos ni un
middleware que escriba cookies de sesión. Hay que decidir cómo se autentica un pedido que
sale del navegador en un dominio y llega a la API en otro.

## Decisión

**JWT propio, emitido y verificado por la API.** Contraseñas hasheadas con `argon2`. Dos
tokens:

- **Access token**, de vida corta (15 minutos), que viaja en el header `Authorization: Bearer`. El frontend lo tiene en memoria.
- **Refresh token**, de vida larga (30 días), en una cookie `HttpOnly; Secure; SameSite=None` del dominio **de la API**, que el frontend nunca lee. `SameSite=None` es obligatorio, no una preferencia: web y API están en dominios distintos (Vercel y Render), y una cookie `Lax` sencillamente no se enviaría en el pedido de refresh. El CSRF que eso reabre queda acotado a un solo endpoint —`POST /auth/refresh`— y se mitiga exigiendo también el header `Origin` esperado. Es la única superficie CSRF del sistema, porque ningún otro endpoint se autentica por cookie.

Cada endpoint autenticado resuelve el `user_id` del access token y lo aplica en el `WHERE` de
toda consulta. El `user_id` **nunca** se lee del cuerpo del pedido.

## Alternativas descartadas

**Seguir con Supabase Auth.** Con backend propio habría que validar los JWT de Supabase en
Python contra su JWKS, mantener sincronizada la tabla de usuarios de Supabase con el resto del
schema, y arrastrar una dependencia externa para lo que son unas pocas decenas de líneas. La
razón original para elegirlo —que resolvía RLS y sesión sin escribir código— desapareció junto
con RLS.

**Sesión en cookie del dominio del frontend.** Con frontend y API en dominios distintos, una
cookie que llegue a la API necesita `SameSite=None; Secure`, y eso reabre el problema de CSRF
que hay que mitigar aparte. Un header `Authorization` no lo tiene: el navegador no lo manda
solo. Se paga con el token viviendo en memoria, que es justo lo que el refresh token resuelve.

**Solo un token de vida larga, sin refresh.** Más simple, pero un token robado sirve treinta
días y no hay forma de invalidarlo sin una lista de revocación. La partición en dos acota la
ventana a quince minutos.

## Consecuencias

**A favor:**

- Sin dependencia de un proveedor de auth. La app se despliega en cualquier lado.
- El flujo de autenticación es código propio: se puede testear y se puede explicar. Da casos de prueba concretos —token ausente, token vencido, token de otro usuario, token con firma alterada, refresh vencido— que con un proveedor externo serían pruebas del proveedor.
- El aislamiento entre usuarios queda cubierto por un grupo de pruebas obligatorio (C7), no por una configuración.

**En contra:**

- Es código de seguridad escrito por el equipo. Un error acá es más grave que un error en el dashboard. Se acota usando bibliotecas establecidas (`pyjwt`, `argon2-cffi`) y no inventando nada: sin criptografía propia, sin esquemas de hash propios.
- **Sin recuperación de contraseña**, porque no hay servicio de envío de mail configurado. Se resuelve a mano contra la base mientras tanto. Está declarado como fuera de alcance en `02-behavior-spec.md`.
- El access token se pierde al recargar la página hasta que el refresh lo repone: hay un parpadeo de "cargando sesión" que el frontend tiene que manejar bien, y es un caso de prueba de usabilidad.
- No hay límite de intentos de login. Es un riesgo asumido, del mismo tipo que el CAPTCHA ausente en ADR-011: si aparece abuso real, se agrega.
