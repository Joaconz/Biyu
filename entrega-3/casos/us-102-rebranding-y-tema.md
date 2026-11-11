# Casos de prueba V3 — Rebranding esmeralda con tema claro y oscuro (US-102)

**Historia:** [#410](https://github.com/Joaconz/Biyu/issues/410) · ADR-052 · NFR-06.
**Oráculo:** los criterios CA-1 a CA-4 de la historia. Ajustes → Apariencia ofrece Automático, Claro y Oscuro; la elección se guarda en el dispositivo (`localStorage`, clave `biyu-theme`), no en la base, y se aplica antes del primer pintado. Un monto grande muestra los centavos más chicos pero el texto es el mismo.
**Convenciones:** PR-01 crea el usuario (`docs/12-procedimientos-de-prueba.md`). Para «Automático», DevTools → Rendering → «Emulate CSS prefers-color-scheme». Montos ficticios (C14).
**Automatización:** `e2e/ux-ajustes.spec.ts` (CP-CFG-031 a 034), `e2e/ux-resumen.spec.ts` (CP-DAS-021) y `tests/lib/theme.test.ts` (lógica de la preferencia).

| ID | Título | Criterio | Técnica | Tipo | Canal | Prioridad | Automatizable |
|---|---|---|---|---|---|---|---|
| CP-CFG-031 | Elegir «Oscuro» cambia el tema al instante y queda al recargar | CA-1 | Casos de uso | Positivo | UI | Alta | Sí |
| CP-CFG-032 | «Automático» sigue al tema del sistema | CA-1 | Transición de estados | Positivo | UI | Media | Sí |
| CP-CFG-033 | La elección no se guarda en la base y otro dispositivo conserva la suya | CA-2 | Adivinación de errores | Negativo | UI y API | Media | Sí |
| CP-CFG-034 | En los dos temas el texto cumple contraste y la tarjeta protagonista conserva su degradado | CA-3 | Particiones | Positivo | UI | Media | Sí |
| CP-DAS-021 | Un monto con centavos se lee igual en pantalla, con lector y en los tests | CA-4 | Valores límite | Límite | UI | Media | Sí |

## CP-CFG-031 — Oscuro y recarga
**Pre-requisitos:** PR-01 con `tema-031@biyu.test`, configuración inicial salteada; sistema en tema claro.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En `/settings` tocar «Oscuro» en Apariencia. | La app pasa al tema oscuro al instante (fondo verde profundo, texto claro) y `<html>` lleva la clase `dark`. |
| 2 | Recargar la página. | Vuelve en oscuro, sin destello de tema claro. |
| 3 | Consola: `localStorage.getItem('biyu-theme')`. | Devuelve `dark`. |

## CP-CFG-032 — Automático
**Pre-requisitos:** PR-01 con `tema-032@biyu.test`; en Apariencia elegido «Automático».

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Con el sistema en claro, mirar la app. | Tema claro. |
| 2 | Cambiar `prefers-color-scheme` a oscuro. | La app pasa a oscuro sin recargar. |
| 3 | Tocar «Claro». | Pasa a claro y deja de seguir al sistema. |

## CP-CFG-033 — Solo en el dispositivo
**Pre-requisitos:** PR-01 con `tema-033@biyu.test`, configuración inicial salteada, y un segundo navegador (o ventana de incógnito) con la misma sesión.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En el primer navegador elegir «Oscuro» y mirar DevTools → Network. | No sale ninguna escritura (POST ni PATCH) a `/rest/v1/` por el cambio de tema. |
| 2 | Abrir el segundo navegador con la misma cuenta. | Conserva su propio tema, no el del primero. |
| 3 | API con el token del usuario: `GET /rest/v1/user_preferences?select=*`. | La respuesta no tiene ningún campo de tema. |

## CP-CFG-034 — Contraste
**Pre-requisitos:** PR-01 con `tema-034@biyu.test`, un gasto en H.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En claro y en oscuro, en el Resumen, medir el contraste del texto del cuerpo y de los rótulos sobre sus fondos (DevTools → «Contrast ratio»). | Al menos 4,5:1 en texto normal y 3:1 en texto grande. |
| 2 | Mirar la tarjeta protagonista del Resumen en cada tema. | Conserva el degradado esmeralda en los dos temas. |

## CP-DAS-021 — Centavos
**Pre-requisitos:** PR-01 con `tema-021@biyu.test`; un gasto de $436.850,50 en H.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/dashboard?period=<H>`. | El monto principal muestra los centavos más chicos y apagados. |
| 2 | Leer el texto del elemento (`textContent`) y el nombre accesible. | `$436.850,50` en los dos: el formato visual no cambia el texto. |
