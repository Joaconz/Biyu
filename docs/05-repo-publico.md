# Repositorio público — reglas de higiene

_El repositorio es público desde el primer commit (restricción C13). No hay una fase privada con reglas más laxas: el historial de git no se edita después sin reescribir todos los hashes._

---

## Por qué esto importa más acá que en otro proyecto

Un tracker de finanzas personales publicado tiene un riesgo que un clon de Twitter no tiene: **los datos de ejemplo son tu sueldo**. Un archivo de semillas con montos reales, una captura del dashboard en el README, o un test escrito con "el alquiler de julio" publican información financiera personal en un lugar del que no se puede sacar.

El segundo riesgo es el habitual, agravado: un `.env` commiteado en el segundo día de un repositorio público es una credencial de base de datos con tus finanzas adentro, indexada por bots que escanean GitHub en minutos.

---

## Antes del primer commit

- [ ] `.gitignore` completo **antes** de `git init`, no después. Como mínimo: `.env*` (con excepción de `.env.example`), `node_modules/`, `dist/`, `.vercel/`, `.netlify/`, `coverage/`, `supabase/.temp/`, `*.log`, `.DS_Store`, cualquier carpeta de dumps o exports locales.
- [ ] `.env.example` con todas las variables presentes y **todos los valores vacíos**. Es documentación, no configuración.
- [ ] Verificar que el correo de los commits sea el que querés que quede público. Si usás el correo privado de GitHub, configuralo ahora: cambiarlo después no reescribe los commits anteriores.
- [ ] Un `LICENSE`. Sin licencia, el código es "todos los derechos reservados" por defecto — legal, pero raro en un repositorio de portfolio.

## Durante todo el proyecto

**Secretos**
- Ninguna clave, token, URL de conexión ni secreto de firma de JWT en el código, ni siquiera comentado, ni siquiera "temporalmente para probar".
- Lo único que el frontend puede conocer son la **URL del proyecto de Supabase y la `anon key`** — pública por diseño, protegida por RLS (C7). La `service_role key`, que se salta RLS, vive solo en variables de entorno de las Edge Functions y del arnés de tests, nunca en el bundle del cliente (C8).
- Habilitar el escaneo de secretos de GitHub y la protección contra envío de secretos. Es un tilde en la configuración del repositorio.

**Datos**
- Las semillas, los fixtures y los tests usan montos ficticios. Nada de "mi alquiler real" como caso de prueba.
- Las capturas del README se toman con datos ficticios. Un dashboard con tus totales reales es una declaración de ingresos publicada.
- Ningún export CSV, dump de base de datos ni PDF de resumen bancario entra al repositorio jamás. Agregar `*.csv` y `*.pdf` al `.gitignore` salvo excepciones explícitas.

**Historial**
- Commits chicos, con mensajes que digan qué cambia y por qué. Es lo primero que mira alguien que abre el repositorio y no tiene tiempo de leer el código.
- Ramas por historia de usuario, integradas con pull request contra `main`. Los pull requests con descripción son evidencia de proceso: es exactamente lo que un evaluador busca y no suele encontrar. Con cinco personas trabajando en paralelo, además, es lo que evita que dos ramas se pisen.
- Nada de commits con mensajes tipo `fix`, `wip` o `asdf` en `main`. Si aparecen durante el trabajo, se limpian antes de integrar.

## Si algo se filtra

No alcanza con borrar el archivo en un commit nuevo: sigue en el historial. El procedimiento es, en este orden:

1. **Rotar la credencial primero.** Asumir que ya está comprometida. Regenerar la `service_role key` o la contraseña de la base desde el panel de Supabase —lo que invalida todas las sesiones activas, y está bien— o la clave del proveedor que sea.
2. Recién después limpiar el historial (`git filter-repo` o similar) y forzar la actualización.
3. Si el repositorio ya era público, dar por perdida la credencial vieja de forma definitiva.

El orden importa: limpiar el historial sin rotar da una falsa sensación de resolución.

## Lo que el repositorio debería mostrar

Alguien que lo abre por primera vez tiene que poder, sin preguntarte nada:

- Entender qué hace el proyecto y por qué existe — README breve.
- Entender la decisión de diseño central (transacción vs. imputación) — README, con un enlace a ADR-001.
- Ver que hay decisiones justificadas — carpeta `docs/adr/`.
- Levantar el proyecto desde cero — instrucciones que funcionen, con `.env.example` y migraciones reproducibles.
- Correr los tests y verlos pasar.
- Encontrar el catálogo de casos de prueba, los reportes de ejecución y los defectos — `docs/07-plan-de-testing.md` y el tablero de issues.

Si alguna de esas seis cosas no se cumple, el repositorio no está cumpliendo el objetivo del proyecto por más que la aplicación funcione.
