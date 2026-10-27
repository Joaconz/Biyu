# Entrega 2 · Reportes de defectos (V2) · Deudas, Navegación y Exportar CSV

Planilla: `05-reportes-de-defectos.xlsx` (hoja «Index» y una hoja por defecto, mismo formato que la Entrega 1). La numeración sigue la de la Entrega 1 (DEF-001 a DEF-028): los defectos de V2 empiezan en **DEF-029**.

| Defect ID | Title | Severity | Status | Test case | User story | GitHub issue |
|---|---|---|---|---|---|---|
| DEF-029 | La baja de un gasto (delete_transaction) responde 204 sin cuerpo y el caso espera 200 con null | Baja | Abierto · se reproduce el 2026-10-25 | CP-NAV-084 | US-70 · Reintento sin duplicar al recuperar un gasto (CA-21) | — (sin issue) |
| DEF-030 | Tocar fuera de la hoja «Exportar movimientos» no la cierra | Media | Abierto · se reproduce el 2026-10-27 | CP-EXP-062 | US-47 · Exportar movimientos a CSV (CA-23) | — (sin issue) |
| DEF-031 | «Atrás» y «Adelante» del navegador cambian la URL pero la hoja de exportar queda abierta | Media | Abierto · se reproduce el 2026-10-27 | CP-EXP-063 y CP-EXP-065 | US-47 · Exportar movimientos a CSV (CA-24 y requisito «todo cambio de URL») | — (sin issue) |
| DEF-032 | «Atrás» durante «Exportando…» no cancela la exportación: el archivo se descarga igual | Media | Abierto · se reproduce el 2026-10-27 | CP-EXP-064 | US-47 · Exportar movimientos a CSV (CA-24) | — (sin issue) |

## DEF-029 — La baja de un gasto (delete_transaction) responde 204 sin cuerpo y el caso espera 200 con null

**Descripción:** Al eliminar un gasto llamando a la función delete_transaction, el sistema responde HTTP 204 sin cuerpo. El caso CP-NAV-084 espera HTTP 200 con el cuerpo null. La baja en sí funciona bien (el gasto queda eliminado y su cuota histórica se conserva); lo que no coincide es la respuesta.

**Pasos para reproducir:**

1. Versión donde ocurre: main en f096e22 (app local contra Supabase local con todas las migraciones aplicadas).
2. Tener un usuario de prueba con la cuenta «Visa BBVA» y la categoría «Comida» (ver los pre-requisitos de CP-NAV-084) y su token de sesión.
3. En Postman, enviar un POST a SUPABASE_URL/rest/v1/rpc/create_transaction con los encabezados apikey, Authorization (Bearer + token) y Content-Type: application/json, y el cuerpo {"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<id de Comida>","p_account_id":"<id de Visa BBVA>","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"84000000-0000-4000-8000-000000000084"}. Anotar el identificador que devuelve (ID-1).
4. Enviar un POST a SUPABASE_URL/rest/v1/rpc/delete_transaction con los mismos encabezados y el cuerpo {"p_transaction_id":"<ID-1>"}.
5. Mirar el código de respuesta y si trae cuerpo.
6. Enviar un GET a SUPABASE_URL/rest/v1/transactions?select=id,request_id,deleted_at&request_id=eq.84000000-0000-4000-8000-000000000084 y comprobar la fila.

**Resultado esperado:** Según el caso CP-NAV-084 (paso 2): HTTP 200 y el cuerpo JSON null.

**Resultado actual:** HTTP 204 (sin contenido) y cuerpo vacío. La fila de la transacción queda con deleted_at con fecha y la cuota histórica se conserva.

**Severidad / incidencia:** Severidad Baja: la baja lógica y la cuota histórica se comportan bien; solo difiere el código de respuesta del contrato que espera el caso, y no afecta a lo que ve el usuario. 100 % (1 de 1 ejecución).

**Historia y criterio afectados:** US-70 · CA-21: «Recuperar un gasto ya guardado y eliminado no crea otro gasto». El criterio funcional se cumple; el caso CP-NAV-084 pide además un código de respuesta que la función no devuelve.

**Navegadores:** No aplica: llamada directa a la API (Postman).

**Entorno:** Local: Vite (http://127.0.0.1:5173) + Supabase local · main f096e22 · migraciones hasta 20261012000000.

**Notas:**

- Defect ID: DEF-029
- Estado: Abierto · se reproduce el 2026-10-25
- Issue de GitHub: sin issue
- Caso de prueba: CP-NAV-084
- Encontrado en: ejecución de CP-NAV-084 (Entrega 2).
- Reportó: Claude Code, supervisado por Santiago
- Causa probable: la función delete_transaction está definida como «returns void» (supabase/migrations/20260927180000_delete_transaction_rpc.sql) y PostgREST responde 204 No Content a las funciones que no devuelven nada. Parece un error del resultado esperado del caso y no de la aplicación.
- Decisión pendiente: corregir el caso (esperar 204) o cambiar la función para que devuelva un valor. Por decisión de Santiago no se corrigió nada.
- Evidencia: respuesta 204 de delete_transaction y consulta de la fila con deleted_at con fecha (ver CP-NAV-084 en 04-ejecucion).

## DEF-030 — Tocar fuera de la hoja «Exportar movimientos» no la cierra

**Descripción:** En la hoja «Exportar movimientos», tocar el fondo oscuro fuera del panel no cierra la hoja. Debería cerrarla sin descargar nada mientras no esté en «Exportando…». Solo cierran la hoja «Cancelar» y Escape.

**Pasos para reproducir:**

1. Versión donde ocurre: repositorio local, rama `main` (app local contra Supabase local con todas las migraciones aplicadas).
2. Entrar con un usuario de prueba y abrir `/transactions?period=2026-09` (con al menos un movimiento ese mes).
3. Tocar «Exportar»: se abre la hoja.
4. Hacer clic sobre el fondo oscuro, por ejemplo en la esquina superior izquierda (5, 5).
5. Mirar si la hoja sigue abierta.

**Resultado esperado:** La hoja se cierra, no se descarga archivo y la URL conserva `?period=2026-09` (CP-EXP-062).

**Resultado actual:** La hoja sigue abierta. `document.elementFromPoint(5,5)` devuelve el `div` de fondo (`fixed inset-0 -z-10`, `aria-hidden="true"`), no el contenedor.

**Severidad / incidencia:** Severidad Media: el usuario puede cerrar la hoja de otras dos formas y no se pierden datos, pero se incumple CA-23 y un gesto habitual no hace nada. 100 % (3 de 3 ejecuciones).

**Historia y criterio afectados:** US-47 · CA-23: ver `entrega-2/casos/exp.md`.

**Navegadores:** Chromium (Playwright 1.63). No se probó en otros.

**Entorno:** Local: Vite (http://127.0.0.1:5173) + Supabase local · migraciones hasta 20261012000000 · reloj del navegador fijado en 09/10/2026.

**Notas:**

- Defect ID: DEF-030
- Estado: Abierto · se reproduce el 2026-10-27
- Issue de GitHub: sin issue
- Caso de prueba: CP-EXP-062 (afecta también la validez de CP-EXP-070)
- Encontrado en: ejecución de CP-EXP-062 (Entrega 2).
- Reportó: Claude Code (IA), supervisado por Santiago
- Causa probable: En `src/components/transactions/ExportTransactionsDialog.tsx` el cierre exige `e.target === e.currentTarget`, pero el `div` de fondo es hijo del contenedor y cubre toda la pantalla: recibe el clic y el destino nunca coincide. Probable; no se corrigió nada.
- Decisión pendiente: abrir issue y corregir. Por decisión de Santiago no se corrigió nada.
- Evidencia: lo observado queda en «Resultado obtenido» de CP-EXP-062 en `ejecucion/exp.md`.

## DEF-031 — «Atrás» y «Adelante» del navegador cambian la URL pero la hoja de exportar queda abierta

**Descripción:** Con la hoja «Exportar movimientos» abierta, usar «Atrás» o «Adelante» del navegador cambia el período de la URL pero la hoja no se cierra. Según CA-24, un cambio de URL o «Atrás» deben cerrarla sin descargar nada.

**Pasos para reproducir:**

1. Versión donde ocurre: repositorio local, rama `main` (app local contra Supabase local con todas las migraciones aplicadas).
2. Entrar con un usuario de prueba y abrir `/transactions?period=2026-08`.
3. Tocar el botón de mes siguiente: la URL pasa a `?period=2026-09`.
4. Tocar «Exportar»: se abre la hoja.
5. Hacer clic en «Atrás» del navegador (para CP-EXP-065: con la hoja abierta en agosto, «Adelante»).
6. Mirar la URL y la hoja.

**Resultado esperado:** La hoja se cierra, la URL pasa a `?period=2026-08` (o `2026-09` con «Adelante») y no se descarga archivo.

**Resultado actual:** La URL cambia al período anterior (o siguiente) y la hoja sigue abierta. Se verificó que el evento `popstate` sí se dispara (3 de 3 repeticiones); la hoja igual no se cierra.

**Severidad / incidencia:** Severidad Media: no se pierden ni se duplican datos, pero la hoja queda sobre otro período y el usuario puede descargar un mes distinto del que ve en la URL. 100 % (3 de 3 ejecuciones).

**Historia y criterio afectados:** US-47 · CA-24 y requisito «todo cambio de URL»: ver `entrega-2/casos/exp.md`.

**Navegadores:** Chromium (Playwright 1.63). No se probó en otros.

**Entorno:** Local: Vite (http://127.0.0.1:5173) + Supabase local · migraciones hasta 20261012000000 · reloj del navegador fijado en 09/10/2026.

**Notas:**

- Defect ID: DEF-031
- Estado: Abierto · se reproduce el 2026-10-27
- Issue de GitHub: sin issue
- Caso de prueba: CP-EXP-063 y CP-EXP-065
- Encontrado en: ejecución de CP-EXP-063 y CP-EXP-065 (Entrega 2).
- Reportó: Claude Code (IA), supervisado por Santiago
- Causa probable: No determinada. En `ExportTransactionsDialog.tsx` hay un efecto que cierra la hoja cuando cambia `location.key` y un oyente de `popstate`; ninguno logra cerrarla. Hipótesis sin confirmar: el efecto que reinicia `initialLocationKeyRef` cuando cambia `location.key` corre antes que el que compara la clave y lo deja siempre igual. No se corrigió nada.
- Decisión pendiente: abrir issue y corregir. Por decisión de Santiago no se corrigió nada.
- Evidencia: lo observado queda en «Resultado obtenido» de CP-EXP-063 y CP-EXP-065 en `ejecucion/exp.md`.

## DEF-032 — «Atrás» durante «Exportando…» no cancela la exportación: el archivo se descarga igual

**Descripción:** Si se usa «Atrás» mientras la hoja está en «Exportando…», la exportación no se cancela: al terminar la lectura se descarga el archivo y aparece el aviso de éxito, aunque el usuario ya salió de ese mes.

**Pasos para reproducir:**

1. Versión donde ocurre: repositorio local, rama `main` (app local contra Supabase local con todas las migraciones aplicadas).
2. Entrar con un usuario de prueba con un movimiento en septiembre 2026 y abrir `/transactions?period=2026-08`.
3. Tocar el mes siguiente (URL `?period=2026-09`) y tocar «Exportar».
4. Demorar las respuestas de `/rest/v1/transactions` unos segundos (en las pruebas: 3 s con Playwright; en DevTools, «1 kbit/s» y latencia 2000 ms).
5. Tocar «Descargar CSV»: aparece «Exportando…».
6. Hacer clic en «Atrás» del navegador y esperar.

**Resultado esperado:** La exportación se cancela: no aparece ningún archivo ni aviso de éxito (CP-EXP-064 paso 22).

**Resultado actual:** Al terminar la lectura se descarga `biyu-movimientos-2026-09.csv` y aparece «Exportamos 1 movimiento» (1 descarga, 1 aviso), con la URL en `?period=2026-08`.

**Severidad / incidencia:** Severidad Media: se descarga un archivo que el usuario ya había abandonado; no afecta datos guardados. 100 % (2 de 2 ejecuciones).

**Historia y criterio afectados:** US-47 · CA-24: ver `entrega-2/casos/exp.md`.

**Navegadores:** Chromium (Playwright 1.63). No se probó en otros.

**Entorno:** Local: Vite (http://127.0.0.1:5173) + Supabase local · migraciones hasta 20261012000000 · reloj del navegador fijado en 09/10/2026.

**Notas:**

- Defect ID: DEF-032
- Estado: Abierto · se reproduce el 2026-10-27
- Issue de GitHub: sin issue
- Caso de prueba: CP-EXP-064
- Encontrado en: ejecución de CP-EXP-064 (Entrega 2).
- Reportó: Claude Code (IA), supervisado por Santiago
- Causa probable: Relacionada con DEF-031: el cierre por «Atrás» no llega a abortar el `AbortController` de la exportación. No se investigó a fondo; no se corrigió nada.
- Decisión pendiente: abrir issue y corregir. Por decisión de Santiago no se corrigió nada.
- Evidencia: lo observado queda en «Resultado obtenido» de CP-EXP-064 en `ejecucion/exp.md`.
