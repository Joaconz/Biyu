# Casos de prueba V2 — Navegación e interfaz (NAV)

**Módulo:** US-69 y US-70  
**Alcance:** barra de navegación global, acceso a Movimientos desde Resumen, confirmación de guardado, reintento idempotente y borradores pendientes.  
**Fuentes:** `entrega-2/historias/navegacion.md`, mocks `navegacion-barra.html` y `registrar-guardado.html`, ADR-023, ADR-024, ADR-034, NFR-06, NFR-08, NFR-09, NFR-10, C4, C5, C6, C7, C11, I10 e I18.  
**Fuera de alcance:** US-71 no existe como historia independiente; la confirmación destructiva corresponde a US-65 de V1.

## Convenciones de ejecución

- `<APP>` es la URL base del ambiente entregado. `<SUPABASE_URL>`, `<ANON_KEY>`, `<TOKEN>`, `<user_id>` y los UUID se obtienen con los procedimientos citados en cada caso.
- Cada caso es independiente. PR-01 debe crear exactamente el email indicado y la contraseña `Clave123!`; ningún caso reutiliza otro usuario.
- La fecha fija del dominio para estos casos es `12/10/2026`, salvo que el caso indique `06/10/2026`. No se usa la fecha real de ejecución como oráculo.
- PR-01, PR-02, PR-04 y PR-08 significan exactamente los procedimientos de `docs/12-procedimientos-de-prueba.md`. La preparación termina con la sesión cerrada cuando el caso así lo indica.
- En UI se usa Chrome estable. Para celular, DevTools usa modo adaptable con el alto `812 px`; si el caso no fija ancho, usar `375 px`. Para escritorio, usar el ancho indicado y alto `900 px`.
- Después de cualquier simulación de red, devolver Network a `No throttling`. Cerrar las ventanas de incógnito al finalizar para no conservar estado.
- Antes de ejecutar un caso que usa red, abrir DevTools una vez, dejar seleccionada la pestaña `Network` y cerrarlo. Chrome recuerda ese panel; por eso `Presionar F12` dentro del caso abre directamente `Network`.
- Los comandos de Console son instrumentos del caso, no atajos para ejecutar la conducta funcional. Si Chrome bloquea el pegado, escribir `allow pasting` manualmente y volver a ejecutar el comando literal.
- En llamadas API, los headers son `apikey: <ANON_KEY>`, `Authorization: Bearer <TOKEN>` y `Content-Type: application/json`, además de los que el paso indique.

## Procedimiento local NAV-PREP-01 — Normalizar categorías del módulo

Ejecutar después de PR-01 y PR-02 cuando el caso lo pida:

| # | Acción | Resultado esperado |
|---|---|---|
| 1 | Abrir `<APP>` e iniciar sesión con el usuario del caso. | Se abre Registrar. |
| 2 | Hacer click en el botón con `aria-label="Ajustes"`. | Se abre `/settings`. |
| 3 | Hacer click en el botón con `aria-label="Editar Comida y supermercado"`. | Aparece el campo `Nombre de la categoría` con `Comida y supermercado`. |
| 4 | Seleccionar todo el contenido de `Nombre de la categoría`. | El texto queda seleccionado. |
| 5 | Escribir `Comida`. | El campo muestra exactamente `Comida`. |
| 6 | Hacer click en `Guardar`. | La lista activa muestra `Comida` y ya no muestra `Comida y supermercado`. |
| 7 | Escribir `Tecnología` en `Nueva categoría`. | El campo muestra exactamente `Tecnología`. |
| 8 | Hacer click en `Crear categoría`. | La lista activa muestra `Tecnología`. |
| 9 | Hacer click en `Cerrar sesión`. | Se abre `/login`. |

## Instrumento NAV-CONC-01 — Dos POST liberados por una barrera común

Para CP-NAV-041, reemplazar los marcadores y ejecutar este bloque completo en PowerShell 7. Los dos jobs se crean antes de abrir la barrera; no hay clicks manuales separados.

```powershell
$url = '<SUPABASE_URL>/rest/v1/rpc/create_transaction'
$headers = @{
  apikey = '<ANON_KEY>'
  Authorization = 'Bearer <TOKEN>'
  'Content-Type' = 'application/json'
}
$body = '{"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Comida>","p_account_id":"<uuid Visa BBVA>","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"41000000-0000-4000-8000-000000000041"}'
$gate = [System.Threading.ManualResetEventSlim]::new($false)
$work = {
  param($sharedGate, $requestUrl, $requestHeaders, $requestBody)
  $sharedGate.Wait()
  try {
    $response = Invoke-WebRequest -Method Post -Uri $requestUrl -Headers $requestHeaders -Body $requestBody
    [pscustomobject]@{ Status = [int]$response.StatusCode; Body = $response.Content }
  } catch {
    [pscustomobject]@{ Status = [int]$_.Exception.Response.StatusCode; Body = $_.ErrorDetails.Message }
  }
}
$job1 = Start-ThreadJob -ScriptBlock $work -ArgumentList $gate, $url, $headers, $body
$job2 = Start-ThreadJob -ScriptBlock $work -ArgumentList $gate, $url, $headers, $body
$gate.Set()
$results = Receive-Job -Wait -AutoRemoveJob $job1, $job2
$results | ConvertTo-Json -Compress
```

## Procedimiento local NAV-PREP-02 — Crear por UI un reintento con clave conocida

Ejecutar únicamente para CP-NAV-085, después de PR-01, PR-02 y NAV-PREP-01, con el usuario de ese caso:

| # | Acción | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2a | Escribir `<APP>` en la barra de direcciones. | La barra muestra exactamente `<APP>`. |
| 2b | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 3 | Escribir `qa+cp-nav-085-001@example.com` en `Email`. | El campo muestra exactamente `qa+cp-nav-085-001@example.com`. |
| 4 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 5 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1/3. |
| 6 | Presionar Ctrl+Shift+J. | Se abre DevTools en la pestaña Console. |
| 7 | Ejecutar `window.__navUuid=crypto.randomUUID.bind(crypto);Object.defineProperty(crypto,'randomUUID',{configurable:true,value:()=>"85000000-0000-4000-8000-000000000085"})`. | La consola devuelve `undefined`. |
| 8 | Escribir `12500` en el campo de monto. | El monto muestra `12500` y se habilita `Siguiente`. |
| 9 | Hacer click en `Siguiente`. | Se abre el paso 2/3. |
| 10 | Hacer click en `Comida`. | Se abre el paso 3/3. |
| 11 | Hacer click en `Visa BBVA`. | La cuenta queda marcada. |
| 12 | Hacer click en `Otra` dentro de `Fecha`. | Se habilita el campo de fecha. |
| 13 | Escribir `06/10/2026` en el campo de fecha. | La fecha muestra `06/10/2026`. |
| 14 | Escribir `Almuerzo` en `Nota (opcional)`. | La nota muestra `Almuerzo`. |
| 15 | Hacer click en la pestaña `Network` de DevTools. | DevTools muestra la pestaña `Network`. |
| 16 | Seleccionar `Offline`. | Network muestra `Offline`. |
| 17 | Hacer click en `Guardar gasto`. | Se ve `No se pudo guardar` y `Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.`; el botón dice `Reintentar`. |
| 17a | Hacer click en la pestaña `Console` de DevTools. | DevTools muestra la pestaña `Console`. |
| 17b | Ejecutar `(()=>{const k=Object.keys(localStorage).find(k=>k.startsWith('biyu:pending-drafts:'));return JSON.parse(localStorage.getItem(k))[0].requestIds})()`. | La consola devuelve exactamente `["85000000-0000-4000-8000-000000000085"]`. |
| 17c | Ejecutar `Object.defineProperty(crypto,'randomUUID',{configurable:true,value:window.__navUuid});delete window.__navUuid`. | La consola devuelve `true`; desde este momento la generación de UUID vuelve a ser la real. |
| 17d | Hacer click en la pestaña `Network` de DevTools. | DevTools muestra la pestaña `Network`. |
| 18 | Seleccionar `No throttling`. | Network vuelve Online. |
| 19 | Hacer click en `Reintentar`. | Aparece `Gasto guardado` con `$12.500,00 · Comida · Visa BBVA`; el botón muestra `✓ Guardado` y vuelve al paso 1 vacío. |
| 21 | Ejecutar PR-04 para el mismo usuario. | Se obtienen `<TOKEN>`, `<ANON_KEY>` y `<SUPABASE_URL>` válidos para `qa+cp-nav-085-001@example.com`. |
| 22 | Cerrar la ventana de incógnito. | La sesión de UI queda cerrada; la preparación conserva una sola transacción creada por el reintento. |


## Matriz de cobertura

| Historia · criterio | Casos |
|---|---|
| US-69 · CA-1 | CP-NAV-001 |
| US-69 · CA-2 | CP-NAV-002, CP-NAV-003, CP-NAV-004, CP-NAV-005 |
| US-69 · CA-3 | CP-NAV-006, CP-NAV-007, CP-NAV-008, CP-NAV-009, CP-NAV-010, CP-NAV-011, CP-NAV-012 |
| US-69 · CA-4 | CP-NAV-013, CP-NAV-014 |
| US-69 · CA-5 | CP-NAV-015, CP-NAV-016, CP-NAV-017 |
| US-69 · CA-6 | CP-NAV-018, CP-NAV-019, CP-NAV-020, CP-NAV-021, CP-NAV-063 a CP-NAV-082 |
| US-69 · CA-7 | CP-NAV-022 |
| US-69 · CA-8 | CP-NAV-023 |
| US-69 · CA-9 | CP-NAV-024, CP-NAV-025 |
| US-69 · CA-10 | CP-NAV-026 |
| US-69 · CA-11 | CP-NAV-027 |
| US-69 · CA-12 | CP-NAV-028 |
| US-69 · CA-13 | CP-NAV-029 |
| US-70 · CA-1 | CP-NAV-030 |
| US-70 · CA-2 | CP-NAV-031 |
| US-70 · CA-3 | CP-NAV-032 |
| US-70 · CA-4 | CP-NAV-033 |
| US-70 · CA-5 | CP-NAV-034, CP-NAV-085 |
| US-70 · CA-6 | CP-NAV-035 |
| US-70 · CA-6b | CP-NAV-036 |
| US-70 · CA-6c | CP-NAV-037 |
| US-70 · CA-7 | CP-NAV-038 |
| US-70 · CA-8 | CP-NAV-039 |
| US-70 · CA-9 | CP-NAV-040 |
| US-70 · CA-10 | CP-NAV-041 |
| US-70 · CA-11 | CP-NAV-042 |
| US-70 · CA-12 | CP-NAV-043 |
| US-70 · CA-13 | CP-NAV-044 |
| US-70 · CA-14 | CP-NAV-045 |
| US-70 · CA-15 | CP-NAV-046 |
| US-70 · CA-16 | CP-NAV-047, CP-NAV-048 |
| US-70 · CA-17 | CP-NAV-049, CP-NAV-050 |
| US-70 · CA-18 | CP-NAV-051 |
| US-70 · CA-19 | CP-NAV-052 |
| US-70 · CA-20 | CP-NAV-053, CP-NAV-083 |
| US-70 · CA-21 | CP-NAV-054, CP-NAV-084 |
| US-70 · CA-22 | CP-NAV-055 |
| US-70 · CA-23 | CP-NAV-056 |
| US-70 · CA-24 | CP-NAV-057 |
| US-70 · CA-25 | CP-NAV-058 |
| US-70 · CA-26 | CP-NAV-059 (variante equivalente; fecha exacta bloqueada por H-NAV-02) |
| US-70 · CA-27 | CP-NAV-060 |
| US-70 · CA-28 | CP-NAV-061 |
| US-70 · CA-29 | CP-NAV-062 |

## Casos completos

### CP-NAV-001 — A 375 px la barra muestra cuatro secciones en el orden definido

| Campo | Contenido |
|---|---|
| ID | CP-NAV-001 |
| Trazabilidad | US-69 · CA-1 · ADR-023 |
| Invariante | — |
| Técnica | Casos de uso |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-001-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport indicado en el caso; sin movimientos. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-001-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-001-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8 | Presionar F12. | Se abre DevTools. |
| 9 | Hacer click en `Toggle device toolbar`. | Se activa la emulación adaptable. |
| 10a | Escribir `375` en el campo de ancho. | El campo de ancho muestra exactamente `375`. |
| 10b | Escribir `812` en el campo de alto. | El campo de alto muestra exactamente `812`; el viewport indica `375 × 812`. |
| 11 | Leer la barra inferior de izquierda a derecha. | Muestra exactamente `Registrar`, `Resumen`, `Deudas`, `Suscripciones`; hay cuatro ítems y no aparece `Movimientos`. |

**Post-condición:** Sin datos modificados.

### CP-NAV-002 — Registrar abre /register desde Resumen

| Campo | Contenido |
|---|---|
| ID | CP-NAV-002 |
| Trazabilidad | US-69 · CA-2 |
| Invariante | — |
| Técnica | Casos de uso |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-002-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport indicado en el caso; sin movimientos. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-002-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-002-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 9 | Escribir `<APP>/dashboard`. | La barra muestra exactamente `<APP>/dashboard`. |
| 10 | Presionar Enter. | Se abre Resumen. |
| 11 | Hacer click en `Registrar` en la barra. | La URL termina exactamente en `/register` y se ve el paso 1/3 `¿Cuánto?`. |

**Post-condición:** Sin datos modificados.

### CP-NAV-003 — Resumen abre /dashboard desde Registrar

| Campo | Contenido |
|---|---|
| ID | CP-NAV-003 |
| Trazabilidad | US-69 · CA-2 |
| Invariante | — |
| Técnica | Casos de uso |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-003-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport indicado en el caso; sin movimientos. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-003-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-003-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8 | Hacer click en `Resumen` en la barra. | La URL termina exactamente en `/dashboard` y se ve `Resumen`. |

**Post-condición:** Sin datos modificados.

### CP-NAV-004 — Deudas abre /debts desde Registrar

| Campo | Contenido |
|---|---|
| ID | CP-NAV-004 |
| Trazabilidad | US-69 · CA-2 |
| Invariante | — |
| Técnica | Casos de uso |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-004-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport indicado en el caso; sin movimientos. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-004-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-004-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8 | Hacer click en `Deudas` en la barra. | La URL termina exactamente en `/debts` y se ve `Deudas`. |

**Post-condición:** Sin datos modificados.

### CP-NAV-005 — Suscripciones abre /subscriptions desde Registrar

| Campo | Contenido |
|---|---|
| ID | CP-NAV-005 |
| Trazabilidad | US-69 · CA-2 |
| Invariante | — |
| Técnica | Casos de uso |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-005-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport indicado en el caso; sin movimientos. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-005-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-005-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8 | Hacer click en `Suscripciones` en la barra. | La URL termina exactamente en `/subscriptions` y se ve `Suscripciones`. |

**Post-condición:** Sin datos modificados.

### CP-NAV-006 — Registrar queda activo en /register

| Campo | Contenido |
|---|---|
| ID | CP-NAV-006 |
| Trazabilidad | US-69 · CA-3 · ADR-023 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-006-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport indicado en el caso; sin movimientos. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-006-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-006-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 9 | Escribir `<APP>/register`. | La barra muestra exactamente `<APP>/register`. |
| 10 | Presionar Enter. | Se abre `/register`. |
| 11 | Ejecutar en Console `[...document.querySelectorAll('nav[aria-label="Principal"] a[data-testid^="register-nav-"]')].map(a=>[a.textContent.trim(),a.getAttribute('aria-current')])`. | Devuelve exactamente `[["Registrar","page"],["Resumen",null],["Deudas",null],["Suscripciones",null],["",null]]`; `Registrar` se ve verde, en negrita y con punto dorado. |

**Post-condición:** Sin datos modificados.

### CP-NAV-007 — Resumen queda activo en /dashboard

| Campo | Contenido |
|---|---|
| ID | CP-NAV-007 |
| Trazabilidad | US-69 · CA-3 · ADR-023 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-007-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport indicado en el caso; sin movimientos. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-007-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-007-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 9 | Escribir `<APP>/dashboard?period=2026-08`. | La barra muestra exactamente `<APP>/dashboard?period=2026-08`. |
| 10 | Presionar Enter. | Se abre `/dashboard?period=2026-08`. |
| 11 | Ejecutar en Console `[...document.querySelectorAll('nav[aria-label="Principal"] a[data-testid^="dashboard-nav-"]')].map(a=>[a.textContent.trim(),a.getAttribute('aria-current')])`. | Devuelve exactamente `[["Registrar",null],["Resumen","page"],["Deudas",null],["Suscripciones",null],["",null]]`; `Resumen` se ve verde, en negrita y con punto dorado. |

**Post-condición:** Sin datos modificados.

### CP-NAV-008 — Resumen queda activo en Movimientos activos

| Campo | Contenido |
|---|---|
| ID | CP-NAV-008 |
| Trazabilidad | US-69 · CA-3 · ADR-023 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-008-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport indicado en el caso; sin movimientos. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-008-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-008-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 9 | Escribir `<APP>/transactions?period=2026-08`. | La barra muestra exactamente `<APP>/transactions?period=2026-08`. |
| 10 | Presionar Enter. | Se abre `/transactions?period=2026-08`. |
| 11 | Ejecutar en Console `[...document.querySelectorAll('nav[aria-label="Principal"] a[data-testid^="transactions-nav-"]')].map(a=>[a.textContent.trim(),a.getAttribute('aria-current')])`. | Devuelve exactamente `[["Registrar",null],["Resumen","page"],["Deudas",null],["Suscripciones",null],["",null]]`; `Resumen` se ve verde, en negrita y con punto dorado. |

**Post-condición:** Sin datos modificados.

### CP-NAV-009 — Resumen queda activo en Movimientos eliminados

| Campo | Contenido |
|---|---|
| ID | CP-NAV-009 |
| Trazabilidad | US-69 · CA-3 · ADR-023 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-009-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport indicado en el caso; sin movimientos. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-009-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-009-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 9 | Escribir `<APP>/transactions?period=2026-08&view=deleted`. | La barra muestra exactamente `<APP>/transactions?period=2026-08&view=deleted`. |
| 10 | Presionar Enter. | Se abre `/transactions?period=2026-08&view=deleted`. |
| 11 | Ejecutar en Console `[...document.querySelectorAll('nav[aria-label="Principal"] a[data-testid^="transactions-nav-"]')].map(a=>[a.textContent.trim(),a.getAttribute('aria-current')])`. | Devuelve exactamente `[["Registrar",null],["Resumen","page"],["Deudas",null],["Suscripciones",null],["",null]]`; `Resumen` se ve verde, en negrita y con punto dorado. |

**Post-condición:** Sin datos modificados.

### CP-NAV-010 — Deudas queda activo en /debts

| Campo | Contenido |
|---|---|
| ID | CP-NAV-010 |
| Trazabilidad | US-69 · CA-3 · ADR-023 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-010-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport indicado en el caso; sin movimientos. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-010-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-010-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 9 | Escribir `<APP>/debts`. | La barra muestra exactamente `<APP>/debts`. |
| 10 | Presionar Enter. | Se abre `/debts`. |
| 11 | Ejecutar en Console `[...document.querySelectorAll('nav[aria-label="Principal"] a[data-testid^="debts-nav-"]')].map(a=>[a.textContent.trim(),a.getAttribute('aria-current')])`. | Devuelve exactamente `[["Registrar",null],["Resumen",null],["Deudas","page"],["Suscripciones",null],["",null]]`; `Deudas` se ve verde, en negrita y con punto dorado. |

**Post-condición:** Sin datos modificados.

### CP-NAV-011 — Suscripciones queda activo en /subscriptions

| Campo | Contenido |
|---|---|
| ID | CP-NAV-011 |
| Trazabilidad | US-69 · CA-3 · ADR-023 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-011-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport indicado en el caso; sin movimientos. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-011-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-011-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 9 | Escribir `<APP>/subscriptions`. | La barra muestra exactamente `<APP>/subscriptions`. |
| 10 | Presionar Enter. | Se abre `/subscriptions`. |
| 11 | Ejecutar en Console `[...document.querySelectorAll('nav[aria-label="Principal"] a[data-testid^="subscriptions-nav-"]')].map(a=>[a.textContent.trim(),a.getAttribute('aria-current')])`. | Devuelve exactamente `[["Registrar",null],["Resumen",null],["Deudas",null],["Suscripciones","page"],["",null]]`; `Suscripciones` se ve verde, en negrita y con punto dorado. |

**Post-condición:** Sin datos modificados.

### CP-NAV-012 — Ajustes no marca ninguna de las cuatro secciones

| Campo | Contenido |
|---|---|
| ID | CP-NAV-012 |
| Trazabilidad | US-69 · CA-3 · ADR-023 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-012-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport indicado en el caso; sin movimientos. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-012-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-012-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 9 | Escribir `<APP>/settings`. | La barra muestra exactamente `<APP>/settings`. |
| 10 | Presionar Enter. | Se abre `Ajustes`. |
| 11 | Ejecutar en Console `[...document.querySelectorAll('nav[aria-label="Principal"] a[data-testid^="settings-nav-"]')].map(a=>[a.textContent.trim(),a.getAttribute('aria-current')])`. | Devuelve exactamente `[["Registrar",null],["Resumen",null],["Deudas",null],["Suscripciones",null],["","page"]]`; ningún ítem de sección está activo y el engranaje `Ajustes` está activo. |

**Post-condición:** Sin datos modificados.

### CP-NAV-013 — A 320 px los cuatro rótulos se leen completos

| Campo | Contenido |
|---|---|
| ID | CP-NAV-013 |
| Trazabilidad | US-69 · CA-4 · NFR-08 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-013-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport indicado en el caso; sin movimientos. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-013-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-013-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8 | Presionar F12. | Se abre DevTools. |
| 9 | Hacer click en `Toggle device toolbar`. | Se activa la emulación adaptable. |
| 10a | Escribir `320` en el campo de ancho. | El campo de ancho muestra exactamente `320`. |
| 10b | Escribir `812` en el campo de alto. | El campo de alto muestra exactamente `812`; el viewport indica `320 × 812`. |
| 11 | Leer los cuatro rótulos de la barra inferior. | Se leen completos `Registrar`, `Resumen`, `Deudas` y `Suscripciones`; ninguno tiene `…`, corte ni superposición. |

**Post-condición:** Sin datos modificados.

### CP-NAV-014 — A 320 px cada destino tiene al menos 44 × 44 px

| Campo | Contenido |
|---|---|
| ID | CP-NAV-014 |
| Trazabilidad | US-69 · CA-4 · NFR-08 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-014-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport indicado en el caso; sin movimientos. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-014-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-014-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8 | Presionar F12. | Se abre DevTools. |
| 9 | Hacer click en `Toggle device toolbar`. | Se activa la emulación adaptable. |
| 10a | Escribir `320` en el campo de ancho. | El campo de ancho muestra exactamente `320`. |
| 10b | Escribir `812` en el campo de alto. | El campo de alto muestra exactamente `812`; el viewport indica `320 × 812`. |
| 11 | Ejecutar en Console `[...document.querySelectorAll('nav[aria-label="Principal"] a')].map(a=>{const r=a.getBoundingClientRect();return [r.width>=44,r.height>=44]})`. | La consola devuelve `[[true,true],[true,true],[true,true],[true,true]]`. |

**Post-condición:** Sin datos modificados.

### CP-NAV-015 — A 1023 px se usa barra inferior y engranaje

| Campo | Contenido |
|---|---|
| ID | CP-NAV-015 |
| Trazabilidad | US-69 · CA-5 · ADR-023 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-015-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport indicado en el caso; sin movimientos. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-015-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-015-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8 | Presionar F12. | Se abre DevTools. |
| 9 | Hacer click en `Toggle device toolbar`. | Se activa la emulación adaptable. |
| 10a | Escribir `1023` en el campo de ancho. | El campo de ancho muestra exactamente `1023`. |
| 10b | Escribir `812` en el campo de alto. | El campo de alto muestra exactamente `812`; el viewport indica `1023 × 812`. |
| 11 | Inspeccionar la navegación y el encabezado. | La navegación está fija abajo, no hay barra lateral y se ve el engranaje `Ajustes`. |

**Post-condición:** Sin datos modificados.

### CP-NAV-016 — A 1024 px se usa barra lateral con Ajustes al pie

| Campo | Contenido |
|---|---|
| ID | CP-NAV-016 |
| Trazabilidad | US-69 · CA-5 · ADR-023 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-016-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport indicado en el caso; sin movimientos. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-016-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-016-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8 | Presionar F12. | Se abre DevTools. |
| 9 | Hacer click en `Toggle device toolbar`. | Se activa la emulación adaptable. |
| 10a | Escribir `1024` en el campo de ancho. | El campo de ancho muestra exactamente `1024`. |
| 10b | Escribir `812` en el campo de alto. | El campo de alto muestra exactamente `812`; el viewport indica `1024 × 812`. |
| 11 | Inspeccionar la navegación. | Se ve una barra lateral de 240 px con los cuatro ítems y `Ajustes` al pie; no hay barra inferior ni engranaje. |

**Post-condición:** Sin datos modificados.

### CP-NAV-017 — A 1280 px se mantiene la barra lateral

| Campo | Contenido |
|---|---|
| ID | CP-NAV-017 |
| Trazabilidad | US-69 · CA-5 · ADR-023 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-017-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport indicado en el caso; sin movimientos. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-017-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-017-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8 | Presionar F12. | Se abre DevTools. |
| 9 | Hacer click en `Toggle device toolbar`. | Se activa la emulación adaptable. |
| 10a | Escribir `1280` en el campo de ancho. | El campo de ancho muestra exactamente `1280`. |
| 10b | Escribir `812` en el campo de alto. | El campo de alto muestra exactamente `812`; el viewport indica `1280 × 812`. |
| 11 | Inspeccionar la navegación. | Se ve la barra lateral de 240 px con los cuatro ítems y `Ajustes` al pie; no hay barra inferior. |

**Post-condición:** Sin datos modificados.

### CP-NAV-018 — Los testids de Registrar son únicos a 375 px

| Campo | Contenido |
|---|---|
| ID | CP-NAV-018 |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-018-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport `375 × 812`; ruta `/register`. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-018-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-018-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8 | Presionar F12. | Se abre DevTools. |
| 9 | Hacer click en `Toggle device toolbar`. | Se activa la emulación adaptable. |
| 10a | Escribir `375` en el campo de ancho. | El campo de ancho muestra exactamente `375`. |
| 10b | Escribir `812` en el campo de alto. | El campo de alto muestra exactamente `812`; el viewport indica `375 × 812`. |
| 11 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 12 | Escribir `<APP>/register`. | La barra muestra exactamente `<APP>/register`. |
| 13 | Presionar Enter. | Se abre `/register`. |
| 14 | Ejecutar en Console `["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="register-nav-'+d+'"]').length)`. | La consola devuelve exactamente `[1, 1, 1, 1, 1]`; ningún testid está duplicado. |

**Post-condición:** Sin datos modificados.

### CP-NAV-019 — Los testids de Registrar son únicos a 1023 px

| Campo | Contenido |
|---|---|
| ID | CP-NAV-019 |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-019-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport `1023 × 812`; ruta `/register`. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-019-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-019-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8 | Presionar F12. | Se abre DevTools. |
| 9 | Hacer click en `Toggle device toolbar`. | Se activa la emulación adaptable. |
| 10a | Escribir `1023` en el campo de ancho. | El campo de ancho muestra exactamente `1023`. |
| 10b | Escribir `812` en el campo de alto. | El campo de alto muestra exactamente `812`; el viewport indica `1023 × 812`. |
| 11 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 12 | Escribir `<APP>/register`. | La barra muestra exactamente `<APP>/register`. |
| 13 | Presionar Enter. | Se abre `/register`. |
| 14 | Ejecutar en Console `["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="register-nav-'+d+'"]').length)`. | La consola devuelve exactamente `[1, 1, 1, 1, 1]`; ningún testid está duplicado. |

**Post-condición:** Sin datos modificados.

### CP-NAV-020 — Los testids de Registrar son únicos a 1024 px

| Campo | Contenido |
|---|---|
| ID | CP-NAV-020 |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-020-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport `1024 × 812`; ruta `/register`. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-020-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-020-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8 | Presionar F12. | Se abre DevTools. |
| 9 | Hacer click en `Toggle device toolbar`. | Se activa la emulación adaptable. |
| 10a | Escribir `1024` en el campo de ancho. | El campo de ancho muestra exactamente `1024`. |
| 10b | Escribir `812` en el campo de alto. | El campo de alto muestra exactamente `812`; el viewport indica `1024 × 812`. |
| 11 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 12 | Escribir `<APP>/register`. | La barra muestra exactamente `<APP>/register`. |
| 13 | Presionar Enter. | Se abre `/register`. |
| 14 | Ejecutar en Console `["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="register-nav-'+d+'"]').length)`. | La consola devuelve exactamente `[1, 1, 1, 1, 1]`; ningún testid está duplicado. |

**Post-condición:** Sin datos modificados.

### CP-NAV-021 — Los testids de Registrar son únicos a 1280 px

| Campo | Contenido |
|---|---|
| ID | CP-NAV-021 |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-021-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport `1280 × 812`; ruta `/register`. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-021-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-021-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8 | Presionar F12. | Se abre DevTools. |
| 9 | Hacer click en `Toggle device toolbar`. | Se activa la emulación adaptable. |
| 10a | Escribir `1280` en el campo de ancho. | El campo de ancho muestra exactamente `1280`. |
| 10b | Escribir `812` en el campo de alto. | El campo de alto muestra exactamente `812`; el viewport indica `1280 × 812`. |
| 11 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 12 | Escribir `<APP>/register`. | La barra muestra exactamente `<APP>/register`. |
| 13 | Presionar Enter. | Se abre `/register`. |
| 14 | Ejecutar en Console `["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="register-nav-'+d+'"]').length)`. | La consola devuelve exactamente `[1, 1, 1, 1, 1]`; ningún testid está duplicado. |

**Post-condición:** Sin datos modificados.

### CP-NAV-022 — Ver todos y ‹ Resumen conservan agosto de 2026

| Campo | Contenido |
|---|---|
| ID | CP-NAV-022 |
| Trazabilidad | US-69 · CA-7 · C11 |
| Invariante | — |
| Técnica | Casos de uso |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-022-001@example.com`; PR-07 con monto `1200`, una cuota y fecha `15/08/2026`; cerrar sesión. |
| Datos de prueba | Período `2026-08`; gasto `$1.200,00`. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-022-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-022-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 9 | Escribir `<APP>/dashboard?period=2026-08`. | La barra muestra exactamente `<APP>/dashboard?period=2026-08`. |
| 10 | Presionar Enter. | Se abre Resumen de agosto y se ve el gasto. |
| 11 | Hacer click en `Ver todos`. | La URL queda exactamente `<APP>/transactions?period=2026-08`. |
| 12 | Hacer click en `‹ Resumen`. | La URL queda exactamente `<APP>/dashboard?period=2026-08`. |

**Post-condición:** El gasto permanece.

### CP-NAV-023 — Un Resumen vacío permite llegar a Eliminados del mismo mes

| Campo | Contenido |
|---|---|
| ID | CP-NAV-023 |
| Trazabilidad | US-69 · CA-8 · FR-08 · C11 |
| Invariante | I10 |
| Técnica | Casos de uso |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-023-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Período vacío `2026-08`. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-023-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-023-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 9 | Escribir `<APP>/dashboard?period=2026-08`. | La barra muestra exactamente `<APP>/dashboard?period=2026-08`. |
| 10 | Presionar Enter. | Se ve el estado vacío con `Registrar un gasto` y `Ver movimientos`. |
| 11 | Hacer click en `Ver movimientos`. | La URL queda exactamente `<APP>/transactions?period=2026-08`. |
| 12 | Hacer click en `Eliminados`. | La URL contiene `period=2026-08` y `view=deleted`; se ve Eliminados. |

**Post-condición:** Sin datos modificados.

### CP-NAV-024 — Deudas descarta el período del Resumen

| Campo | Contenido |
|---|---|
| ID | CP-NAV-024 |
| Trazabilidad | US-69 · CA-9 · C11 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-024-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Origen `<APP>/dashboard?period=2026-08`. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-024-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-024-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 9 | Escribir `<APP>/dashboard?period=2026-08`. | La barra muestra exactamente `<APP>/dashboard?period=2026-08`. |
| 10 | Presionar Enter. | Se abre Resumen de agosto. |
| 11 | Hacer click en `Deudas`. | La URL queda exactamente `<APP>/debts`, sin `?period`. |

**Post-condición:** Sin datos modificados.

### CP-NAV-025 — Suscripciones descarta el período del Resumen

| Campo | Contenido |
|---|---|
| ID | CP-NAV-025 |
| Trazabilidad | US-69 · CA-9 · C11 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-025-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Origen `<APP>/dashboard?period=2026-08`. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-025-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-025-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 9 | Escribir `<APP>/dashboard?period=2026-08`. | La barra muestra exactamente `<APP>/dashboard?period=2026-08`. |
| 10 | Presionar Enter. | Se abre Resumen de agosto. |
| 11 | Hacer click en `Suscripciones`. | La URL queda exactamente `<APP>/subscriptions`, sin `?period`. |

**Post-condición:** Sin datos modificados.

### CP-NAV-026 — Resumen desde Movimientos conserva agosto de 2026

| Campo | Contenido |
|---|---|
| ID | CP-NAV-026 |
| Trazabilidad | US-69 · CA-10 · C11 |
| Invariante | — |
| Técnica | Casos de uso |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-026-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Origen `<APP>/transactions?period=2026-08`. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-026-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-026-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 9 | Escribir `<APP>/transactions?period=2026-08`. | La barra muestra exactamente `<APP>/transactions?period=2026-08`. |
| 10 | Presionar Enter. | Se abre Movimientos de agosto. |
| 11 | Hacer click en `Resumen` en la barra. | La URL queda exactamente `<APP>/dashboard?period=2026-08`. |

**Post-condición:** Sin datos modificados.

### CP-NAV-027 — Tocar Registrar en Registrar conserva el paso 3 y el borrador

| Campo | Contenido |
|---|---|
| ID | CP-NAV-027 |
| Trazabilidad | US-69 · CA-11 · ADR-024 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-027-001@example.com`; PR-02; NAV-PREP-01; cerrar sesión. |
| Datos de prueba | Gasto ARS `12500`; Comida; Visa BBVA; fecha `06/10/2026`; nota `Almuerzo`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-027-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-027-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8 | Hacer click en el campo de monto. | El cursor queda en el campo. |
| 9 | Escribir `12500`. | El monto muestra `12500` y se habilita `Siguiente`. |
| 10 | Hacer click en `Siguiente`. | Se abre el paso 2/3 `¿En qué?`. |
| 11 | Hacer click en la categoría `Comida`. | Se abre el paso 3/3 `Revisá y guardá`. |
| 12 | Hacer click en la cuenta `Visa BBVA`. | `Visa BBVA` queda marcada. |
| 13 | Hacer click en `Otra` dentro de `Fecha`. | Se habilita el campo de fecha. |
| 14 | Hacer click en el campo de fecha. | El cursor queda en el campo. |
| 15 | Escribir `06/10/2026`. | El campo muestra `06/10/2026`. |
| 16 | Hacer click en `Nota`. | El cursor queda en `Nota`. |
| 17 | Escribir `Almuerzo`. | El campo muestra `Almuerzo`. |
| 18 | Hacer click en `Registrar` en la barra. | La URL sigue `/register`; continúa el paso 3/3 y permanecen todos los valores. |

**Post-condición:** Nada guardado; borrador solo en memoria.

### CP-NAV-028 — Escribir /transactions abre Movimientos con la barra V2

| Campo | Contenido |
|---|---|
| ID | CP-NAV-028 |
| Trazabilidad | US-69 · CA-12 |
| Invariante | — |
| Técnica | Casos de uso |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-028-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | URL directa desnuda `<APP>/transactions`. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-028-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-028-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 9 | Escribir `<APP>/transactions`. | La barra muestra exactamente `<APP>/transactions`. |
| 10 | Presionar Enter. | Se abre Movimientos con `Registrar`, `Resumen`, `Deudas`, `Suscripciones`; `Resumen` está activo y la barra no muestra `Movimientos`. |

**Post-condición:** Sin datos modificados.

### CP-NAV-029 — El diálogo de borrado explica la nueva ruta de restauración

| Campo | Contenido |
|---|---|
| ID | CP-NAV-029 |
| Trazabilidad | US-69 · CA-13 · US-65 · FR-08 |
| Invariante | I10 |
| Técnica | Casos de uso |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-029-001@example.com`; PR-07 con monto `1200`, una cuota y fecha `01/09/2026`; cerrar sesión. |
| Datos de prueba | Gasto `$1.200,00`; período `2026-09`. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-029-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-029-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 9 | Escribir `<APP>/transactions?period=2026-09`. | La barra muestra exactamente `<APP>/transactions?period=2026-09`. |
| 10 | Presionar Enter. | Se ve la fila de `$1.200,00`. |
| 11 | Hacer click en el tacho de la fila. | Se abre `¿Eliminar transacción?` y dice exactamente `Si te equivocaste, la podés restaurar desde Resumen → Ver todos, en Eliminados.`. |
| 12 | Hacer click en `Cancelar`. | El diálogo se cierra y el gasto permanece. |

**Post-condición:** El gasto permanece activo.

### CP-NAV-030 — Guardar $12.500 muestra la confirmación completa

| Campo | Contenido |
|---|---|
| ID | CP-NAV-030 |
| Trazabilidad | US-70 · CA-1 · US-10 |
| Invariante | — |
| Técnica | Casos de uso |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-030-001@example.com`; PR-02; NAV-PREP-01; cerrar sesión. |
| Datos de prueba | Gasto ARS; monto `12500`; categoría `Comida`; cuenta `Visa BBVA`; una cuota; fecha `06/10/2026`; nota `Almuerzo`. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-nav-030-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-030-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en el monto. | El cursor queda en el campo. |
| 9 | Escribir `12500`. | El monto muestra `12500` y se habilita `Siguiente`. |
| 10 | Hacer click en `Siguiente`. | Se abre el paso 2/3. |
| 11 | Hacer click en `Comida`. | Se abre el paso 3/3. |
| 12 | Hacer click en `Visa BBVA`. | La cuenta queda marcada. |
| 13 | Hacer click en `Otra` dentro de Fecha. | Se habilita la fecha. |
| 14 | Hacer click en el campo de fecha. | El cursor queda en el campo. |
| 15 | Escribir `06/10/2026`. | La fecha muestra `06/10/2026`. |
| 16 | Hacer click en `Nota`. | El cursor queda en Nota. |
| 17 | Escribir `Almuerzo`. | La nota muestra `Almuerzo`. |
| 18 | Hacer click en `Guardar gasto`. | Aparece `Gasto guardado` con `$12.500,00 · Comida · Visa BBVA`; el botón muestra un check y `Guardado`. |
| 19 | Esperar 1 segundo. | Se abre el paso 1/3 vacío; `Visa BBVA` queda como última cuenta. |

**Post-condición:** Una transacción y una imputación.

### CP-NAV-031 — Guardar $120.000 en 12 cuotas describe las cuotas

| Campo | Contenido |
|---|---|
| ID | CP-NAV-031 |
| Trazabilidad | US-70 · CA-2 · US-10 |
| Invariante | I1, I2 |
| Técnica | Casos de uso |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-031-001@example.com`; PR-02; NAV-PREP-01; cerrar sesión. |
| Datos de prueba | Gasto ARS `120000`; Tecnología; Visa BBVA; 12 cuotas; fecha `06/10/2026`; nota `Notebook ficticia`. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-nav-031-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-031-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en el monto. | El cursor queda en el campo. |
| 9 | Escribir `120000`. | El monto muestra `120000` y se habilita `Siguiente`. |
| 10 | Hacer click en `Siguiente`. | Se abre el paso 2/3. |
| 11 | Hacer click en `Tecnología`. | Se abre el paso 3/3. |
| 12 | Hacer click en `Visa BBVA`. | La cuenta queda marcada. |
| 13 | Hacer click en `Otra` dentro de Fecha. | Se habilita la fecha. |
| 14 | Hacer click en el campo de fecha. | El cursor queda en el campo. |
| 15 | Escribir `06/10/2026`. | La fecha muestra `06/10/2026`. |
| 16 | Hacer click en `Nota`. | El cursor queda en Nota. |
| 17 | Escribir `Notebook ficticia`. | La nota muestra `Notebook ficticia`. |
| 18 | Hacer click en `12` dentro de Cuotas. | `12` queda marcado. |
| 19 | Hacer click en `Guardar gasto`. | Aparece `Gasto guardado` con `$120.000,00 en 12 cuotas · Tecnología · Visa BBVA`. |

**Post-condición:** Una transacción y 12 imputaciones.

### CP-NAV-032 — Un fallo offline conserva todos los datos y ofrece Reintentar

| Campo | Contenido |
|---|---|
| ID | CP-NAV-032 |
| Trazabilidad | US-70 · CA-3 · NFR-09 · ADR-034 |
| Invariante | I18 |
| Técnica | Adivinación de errores |
| Tipo | Negativo |
| Canal | UI |
| Caso par | No aplicable: H-NAV-01 |
| Pre-requisitos | PR-01 con `qa+cp-nav-032-001@example.com`; PR-02; NAV-PREP-01; cerrar sesión. |
| Datos de prueba | Gasto ARS; monto `12500`; categoría `Comida`; cuenta `Visa BBVA`; una cuota; fecha `06/10/2026`; nota `Almuerzo`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-nav-032-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-032-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en el monto. | El cursor queda en el campo. |
| 9 | Escribir `12500`. | El monto muestra `12500` y se habilita `Siguiente`. |
| 10 | Hacer click en `Siguiente`. | Se abre el paso 2/3. |
| 11 | Hacer click en `Comida`. | Se abre el paso 3/3. |
| 12 | Hacer click en `Visa BBVA`. | La cuenta queda marcada. |
| 13 | Hacer click en `Otra` dentro de Fecha. | Se habilita la fecha. |
| 14 | Hacer click en el campo de fecha. | El cursor queda en el campo. |
| 15 | Escribir `06/10/2026`. | La fecha muestra `06/10/2026`. |
| 16 | Hacer click en `Nota`. | El cursor queda en Nota. |
| 17 | Escribir `Almuerzo`. | La nota muestra `Almuerzo`. |
| 17a | Presionar F12. | DevTools se abre en `Network` y se ve la lista de solicitudes. |
| 18 | En DevTools Network, seleccionar `Offline`. | Network muestra `Offline`. |
| 19 | Hacer click en `Guardar gasto`. | Se ve `No se pudo guardar` y `Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.`; `data-kind="network"`; el botón dice `Reintentar`; siguen todos los datos exactos. |

**Post-condición:** Dejar Network en No throttling; un pendiente y ninguna transacción.

### CP-NAV-033 — El aviso offline sigue visible después de 30 segundos

| Campo | Contenido |
|---|---|
| ID | CP-NAV-033 |
| Trazabilidad | US-70 · CA-4 · NFR-09 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Negativo |
| Canal | UI |
| Caso par | No aplicable: H-NAV-01 |
| Pre-requisitos | PR-01 con `qa+cp-nav-033-001@example.com`; PR-02; NAV-PREP-01; cerrar sesión. |
| Datos de prueba | Gasto ARS; monto `12500`; categoría `Comida`; cuenta `Visa BBVA`; una cuota; fecha `06/10/2026`; nota `Almuerzo`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-nav-033-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-033-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en el monto. | El cursor queda en el campo. |
| 9 | Escribir `12500`. | El monto muestra `12500` y se habilita `Siguiente`. |
| 10 | Hacer click en `Siguiente`. | Se abre el paso 2/3. |
| 11 | Hacer click en `Comida`. | Se abre el paso 3/3. |
| 12 | Hacer click en `Visa BBVA`. | La cuenta queda marcada. |
| 13 | Hacer click en `Otra` dentro de Fecha. | Se habilita la fecha. |
| 14 | Hacer click en el campo de fecha. | El cursor queda en el campo. |
| 15 | Escribir `06/10/2026`. | La fecha muestra `06/10/2026`. |
| 16 | Hacer click en `Nota`. | El cursor queda en Nota. |
| 17 | Escribir `Almuerzo`. | La nota muestra `Almuerzo`. |
| 17a | Presionar F12. | DevTools se abre en `Network` y se ve la lista de solicitudes. |
| 18 | Seleccionar `Offline`. | Network muestra Offline. |
| 19 | Hacer click en `Guardar gasto`. | Se ve `No se pudo guardar` y `Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.`; el aviso tiene `data-kind="network"` y el botón dice `Reintentar`. |
| 20 | Esperar 30 segundos. | El aviso completo y `Reintentar` siguen visibles. |

**Post-condición:** Dejar Network Online; un pendiente.

### CP-NAV-034 — Reintentar al volver Online guarda una sola transacción

| Campo | Contenido |
|---|---|
| ID | CP-NAV-034 |
| Trazabilidad | US-70 · CA-5 · NFR-10 · ADR-034 |
| Invariante | I18 |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | CP-NAV-085 |
| Pre-requisitos | PR-01 con `qa+cp-nav-034-001@example.com`; PR-02; NAV-PREP-01; cerrar sesión. |
| Datos de prueba | Gasto ARS; monto `12500`; categoría `Comida`; cuenta `Visa BBVA`; una cuota; fecha `06/10/2026`; nota `Almuerzo`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-nav-034-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-034-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en el monto. | El cursor queda en el campo. |
| 9 | Escribir `12500`. | El monto muestra `12500` y se habilita `Siguiente`. |
| 10 | Hacer click en `Siguiente`. | Se abre el paso 2/3. |
| 11 | Hacer click en `Comida`. | Se abre el paso 3/3. |
| 12 | Hacer click en `Visa BBVA`. | La cuenta queda marcada. |
| 13 | Hacer click en `Otra` dentro de Fecha. | Se habilita la fecha. |
| 14 | Hacer click en el campo de fecha. | El cursor queda en el campo. |
| 15 | Escribir `06/10/2026`. | La fecha muestra `06/10/2026`. |
| 16 | Hacer click en `Nota`. | El cursor queda en Nota. |
| 17 | Escribir `Almuerzo`. | La nota muestra `Almuerzo`. |
| 17a | Presionar F12. | DevTools se abre en `Network` y se ve la lista de solicitudes. |
| 18 | Seleccionar `Offline`. | Network muestra Offline. |
| 19 | Hacer click en `Guardar gasto`. | Se ve `No se pudo guardar` y `Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.`; el aviso tiene `data-kind="network"` y el botón dice `Reintentar`. |
| 20 | Seleccionar `No throttling`. | Network vuelve Online. |
| 21 | Hacer click en `Reintentar`. | Aparece `Gasto guardado` con `$12.500,00 · Comida · Visa BBVA`; el botón muestra `✓ Guardado` y vuelve al paso 1 vacío. |
| 22 | Hacer click en la barra de direcciones. | La dirección queda seleccionada. |
| 23 | Escribir `<APP>/transactions?period=2026-10`. | La barra muestra `<APP>/transactions?period=2026-10`. |
| 24 | Presionar Enter. | Movimientos muestra exactamente una fila de `$12.500,00`. |

**Post-condición:** Una transacción y una imputación.

### CP-NAV-035 — Editar el monto después del fallo crea un intento nuevo

| Campo | Contenido |
|---|---|
| ID | CP-NAV-035 |
| Trazabilidad | US-70 · CA-6 · ADR-034 |
| Invariante | I18 |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-035-001@example.com`; PR-02; NAV-PREP-01; cerrar sesión. |
| Datos de prueba | Gasto ARS; monto `12500`; categoría `Comida`; cuenta `Visa BBVA`; una cuota; fecha `06/10/2026`; nota `Almuerzo`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-nav-035-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-035-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en el monto. | El cursor queda en el campo. |
| 9 | Escribir `12500`. | El monto muestra `12500` y se habilita `Siguiente`. |
| 10 | Hacer click en `Siguiente`. | Se abre el paso 2/3. |
| 11 | Hacer click en `Comida`. | Se abre el paso 3/3. |
| 12 | Hacer click en `Visa BBVA`. | La cuenta queda marcada. |
| 13 | Hacer click en `Otra` dentro de Fecha. | Se habilita la fecha. |
| 14 | Hacer click en el campo de fecha. | El cursor queda en el campo. |
| 15 | Escribir `06/10/2026`. | La fecha muestra `06/10/2026`. |
| 16 | Hacer click en `Nota`. | El cursor queda en Nota. |
| 17 | Escribir `Almuerzo`. | La nota muestra `Almuerzo`. |
| 17a | Presionar F12. | DevTools se abre en `Network` y se ve la lista de solicitudes. |
| 18 | Seleccionar `Offline`. | Network muestra Offline. |
| 19 | Hacer click en `Guardar gasto`. | Se ve `No se pudo guardar` y `Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.`; el aviso tiene `data-kind="network"` y el botón dice `Reintentar`. |
| 20 | Hacer click en el chip `$12.500,00`. | Vuelve al paso 1. |
| 21 | Seleccionar `12500` en el monto. | El valor queda seleccionado. |
| 22 | Escribir `12600`. | Desaparece el aviso. |
| 23 | Seleccionar `12600`. | El valor queda seleccionado. |
| 24 | Escribir `12500`. | El aviso no reaparece. |
| 25 | Hacer click en `Siguiente`. | Se abre el paso 2/3 con `Comida` seleccionada. |
| 26 | Hacer click en `Comida`. | Se abre el paso 3/3 y el botón dice `Guardar gasto`, no `Reintentar`. |
| 27 | En DevTools Network, seleccionar `No throttling`. | Network vuelve a `No throttling`. |

**Post-condición:** Network Online; ninguna transacción.

### CP-NAV-036 — Guardar el borrador editado elimina el pendiente anterior

| Campo | Contenido |
|---|---|
| ID | CP-NAV-036 |
| Trazabilidad | US-70 · CA-6b · NFR-09 · NFR-10 |
| Invariante | I18 |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-036-001@example.com`; PR-02; NAV-PREP-01; cerrar sesión. |
| Datos de prueba | Gasto ARS; monto `12500`; categoría `Comida`; cuenta `Visa BBVA`; una cuota; fecha `06/10/2026`; nota `Almuerzo`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-nav-036-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-036-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en el monto. | El cursor queda en el campo. |
| 9 | Escribir `12500`. | El monto muestra `12500` y se habilita `Siguiente`. |
| 10 | Hacer click en `Siguiente`. | Se abre el paso 2/3. |
| 11 | Hacer click en `Comida`. | Se abre el paso 3/3. |
| 12 | Hacer click en `Visa BBVA`. | La cuenta queda marcada. |
| 13 | Hacer click en `Otra` dentro de Fecha. | Se habilita la fecha. |
| 14 | Hacer click en el campo de fecha. | El cursor queda en el campo. |
| 15 | Escribir `06/10/2026`. | La fecha muestra `06/10/2026`. |
| 16 | Hacer click en `Nota`. | El cursor queda en Nota. |
| 17 | Escribir `Almuerzo`. | La nota muestra `Almuerzo`. |
| 17a | Presionar F12. | DevTools se abre en `Network` y se ve la lista de solicitudes. |
| 18 | Seleccionar `Offline`. | Network muestra Offline. |
| 19 | Hacer click en `Guardar gasto`. | Se ve `No se pudo guardar`, `Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.` y `Reintentar`; Local Storage contiene un pendiente de `$12.500,00`. |
| 20 | Hacer click en el chip `$12.500,00`. | Vuelve al paso 1. |
| 21 | Seleccionar `12500`. | El valor queda seleccionado. |
| 22 | Escribir `12600`. | El monto cambia y el aviso desaparece. |
| 23 | Seleccionar `No throttling`. | Network vuelve Online. |
| 24 | Hacer click en `Siguiente`. | Se abre el paso 2/3 con `Comida` seleccionada. |
| 25 | Hacer click en `Comida`. | Se abre el paso 3/3 y el botón dice `Guardar gasto`. |
| 26 | Hacer click en `Guardar gasto`. | Aparece `Gasto guardado` con `$12.600,00 · Comida · Visa BBVA`. |
| 27 | Hacer click en `Resumen`. | Se abre `/dashboard`. |
| 28 | Hacer click en `Registrar`. | Se abre el paso 1/3 y no aparece el aviso de pendientes. |
| 29 | Hacer click en la barra de direcciones. | La dirección queda seleccionada. |
| 30 | Escribir `<APP>/transactions?period=2026-10`. | La barra muestra `<APP>/transactions?period=2026-10`. |
| 31 | Presionar Enter. | Hay exactamente una fila de `$12.600,00`. |

**Post-condición:** Una transacción de 12600; sin pendiente.

### CP-NAV-037 — Dos fallos del mismo borrador dejan una fila con dos claves

| Campo | Contenido |
|---|---|
| ID | CP-NAV-037 |
| Trazabilidad | US-70 · CA-6c · ADR-034 |
| Invariante | I18 |
| Técnica | Adivinación de errores |
| Tipo | Negativo |
| Canal | UI |
| Caso par | No aplicable: H-NAV-01 |
| Pre-requisitos | PR-01 con `qa+cp-nav-037-001@example.com`; PR-02; NAV-PREP-01; cerrar sesión. |
| Datos de prueba | Gasto ARS; monto `12500`; categoría `Comida`; cuenta `Visa BBVA`; una cuota; fecha `06/10/2026`; nota `Almuerzo`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-nav-037-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-037-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en el monto. | El cursor queda en el campo. |
| 9 | Escribir `12500`. | El monto muestra `12500` y se habilita `Siguiente`. |
| 10 | Hacer click en `Siguiente`. | Se abre el paso 2/3. |
| 11 | Hacer click en `Comida`. | Se abre el paso 3/3. |
| 12 | Hacer click en `Visa BBVA`. | La cuenta queda marcada. |
| 13 | Hacer click en `Otra` dentro de Fecha. | Se habilita la fecha. |
| 14 | Hacer click en el campo de fecha. | El cursor queda en el campo. |
| 15 | Escribir `06/10/2026`. | La fecha muestra `06/10/2026`. |
| 16 | Hacer click en `Nota`. | El cursor queda en Nota. |
| 17 | Escribir `Almuerzo`. | La nota muestra `Almuerzo`. |
| 17a | Presionar F12. | DevTools se abre en `Network` y se ve la lista de solicitudes. |
| 18 | Seleccionar `Offline`. | Network muestra Offline. |
| 19 | Hacer click en `Guardar gasto`. | Se ve `No se pudo guardar`, el texto de conexión y `Reintentar`; Local Storage contiene un pendiente de `$12.500,00` con un UUID en `requestIds`. |
| 20 | Hacer click en el chip `$12.500,00`. | Vuelve al monto. |
| 21 | Seleccionar `12500`. | El valor queda seleccionado. |
| 22 | Escribir `12600`. | El aviso desaparece. |
| 23 | Hacer click en `Siguiente`. | Se abre el paso 2/3 con `Comida` seleccionada. |
| 24 | Hacer click en `Comida`. | Se abre el paso 3/3 y el botón dice `Guardar gasto`. |
| 25 | Hacer click en `Guardar gasto`. | Reaparecen `No se pudo guardar`, el texto de conexión y `Reintentar`; el mismo pendiente ahora muestra `amount:"12600"` y dos UUID distintos en `requestIds`. |
| 26 | En DevTools Network, seleccionar `No throttling`. | Network vuelve a `No throttling`. |
| 27 | Hacer click en `Resumen`. | Se abre `/dashboard`. |
| 28 | Hacer click en `Registrar`. | Se abre el paso 1/3; el aviso dice `Tenés 1 movimiento sin guardar` y la fila dice `Gasto · $12.600,00 · Comida · 06/10/2026`. |
| 29 | Ejecutar en Console `JSON.parse(localStorage.getItem('biyu:pending-drafts:<user_id>'))`. | Devuelve una lista de un elemento: `amount:"12600"` y `requestIds` contiene exactamente dos UUID distintos. |

**Post-condición:** Network Online; un pendiente y cero transacciones.

### CP-NAV-038 — A los 15 segundos de espera aparece el error reintentable

| Campo | Contenido |
|---|---|
| ID | CP-NAV-038 |
| Trazabilidad | US-70 · CA-7 · ADR-034 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-038-001@example.com`; PR-02; NAV-PREP-01; en Chrome DevTools crear el perfil Network `NAV-20s` con latencia `20000 ms`, descarga `1000 kb/s`, subida `1000 kb/s` y pérdida `0 %`; cerrar sesión. |
| Datos de prueba | Gasto ARS; monto `12500`; categoría `Comida`; cuenta `Visa BBVA`; una cuota; fecha `06/10/2026`; nota `Almuerzo`; cronómetro con resolución de `0,1 s`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-nav-038-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-038-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en el monto. | El cursor queda en el campo. |
| 9 | Escribir `12500`. | El monto muestra `12500` y se habilita `Siguiente`. |
| 10 | Hacer click en `Siguiente`. | Se abre el paso 2/3. |
| 11 | Hacer click en `Comida`. | Se abre el paso 3/3. |
| 12 | Hacer click en `Visa BBVA`. | La cuenta queda marcada. |
| 13 | Hacer click en `Otra` dentro de Fecha. | Se habilita la fecha. |
| 14 | Hacer click en el campo de fecha. | El cursor queda en el campo. |
| 15 | Escribir `06/10/2026`. | La fecha muestra `06/10/2026`. |
| 16 | Hacer click en `Nota`. | El cursor queda en Nota. |
| 17 | Escribir `Almuerzo`. | La nota muestra `Almuerzo`. |
| 17a | Presionar F12. | DevTools se abre en `Network` y se ve la lista de solicitudes. |
| 18 | En DevTools Network, seleccionar `NAV-20s`. | El selector muestra `NAV-20s`. |
| 19 | Iniciar el cronómetro. | El cronómetro marca `0,0 s` y comienza a avanzar. |
| 20 | Hacer click en `Guardar gasto`. | El botón dice `Guardando…`, queda deshabilitado y el formulario tiene `aria-busy="true"`. |
| 21 | Detener el cronómetro cuando aparezca `No se pudo guardar`. | Marca entre `14,0 s` y `16,0 s`; se ve `Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.`, `data-kind="network"` y el botón `Reintentar`. |
| 22 | En DevTools Network, seleccionar `No throttling`. | El selector muestra `No throttling`. |

**Post-condición:** Network Online; un pendiente.

### CP-NAV-039 — Un reintento con commit previo no duplica

| Campo | Contenido |
|---|---|
| ID | CP-NAV-039 |
| Trazabilidad | US-70 · CA-8 · NFR-10 · ADR-034 |
| Invariante | I18 |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | CP-NAV-040 |
| Pre-requisitos | PR-01 con `qa+cp-nav-039-001@example.com`; PR-02; NAV-PREP-01; PR-04; ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con headers de PR-04 y el body literal de Datos: esperado HTTP 200 y UUID `<ID-1>`; cerrar sesión. |
| Datos de prueba | Gasto; ARS; monto `12500`; categoría `Comida`; cuenta `Visa BBVA`; una cuota; fecha `06/10/2026`; nota `Almuerzo`; UUID fijo `39000000-0000-4000-8000-000000000039`; body de preparación `{"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Comida>","p_account_id":"<uuid Visa BBVA>","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"39000000-0000-4000-8000-000000000039"}`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-nav-039-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-039-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8a | Presionar Ctrl+Shift+J. | Se abre DevTools en la pestaña Console. |
| 8b | Ejecutar `window.__navUuid=crypto.randomUUID.bind(crypto);Object.defineProperty(crypto,'randomUUID',{configurable:true,value:()=>"39000000-0000-4000-8000-000000000039"})`. | La consola devuelve `undefined`. |
| 9 | Hacer click en el monto. | El cursor queda en el campo. |
| 10 | Escribir `12500`. | El monto muestra `12500` y se habilita `Siguiente`. |
| 11 | Hacer click en `Siguiente`. | Se abre el paso 2/3. |
| 12 | Hacer click en `Comida`. | Se abre el paso 3/3. |
| 13 | Hacer click en `Visa BBVA`. | La cuenta queda marcada. |
| 14 | Hacer click en `Otra` dentro de Fecha. | Se habilita la fecha. |
| 15 | Hacer click en el campo de fecha. | El cursor queda en el campo. |
| 16 | Escribir `06/10/2026`. | La fecha muestra `06/10/2026`. |
| 17 | Hacer click en `Nota`. | El cursor queda en Nota. |
| 18 | Escribir `Almuerzo`. | La nota muestra `Almuerzo`. |
| 18a | Hacer click en la pestaña `Network` de DevTools. | DevTools muestra `Network` y se ve la lista de solicitudes. |
| 19 | Seleccionar `Offline`. | Network muestra Offline. |
| 20 | Hacer click en `Guardar gasto`. | Se ve `No se pudo guardar` y `Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.`; el aviso tiene `data-kind="network"` y el botón dice `Reintentar`. |
| 21 | Seleccionar `No throttling`. | Network vuelve Online. |
| 22 | Hacer click en `Reintentar`. | Aparece `Gasto guardado` con `$12.500,00 · Comida · Visa BBVA`; el botón muestra `✓ Guardado`. |
| 23 | Hacer click en la barra de direcciones. | La dirección queda seleccionada. |
| 24 | Escribir `<APP>/transactions?period=2026-10`. | La barra muestra `<APP>/transactions?period=2026-10`. |
| 25 | Presionar Enter. | Hay exactamente una fila de `$12.500,00`. |
| 25a | Hacer click en la pestaña `Console` de DevTools. | DevTools muestra la pestaña `Console`. |
| 26 | Ejecutar `Object.defineProperty(crypto,'randomUUID',{configurable:true,value:window.__navUuid});delete window.__navUuid`. | La consola devuelve `true`. |

**Post-condición:** Una transacción; Network Online.

### CP-NAV-040 — La misma clave secuencial devuelve el mismo id

| Campo | Contenido |
|---|---|
| ID | CP-NAV-040 |
| Trazabilidad | US-70 · CA-9 · NFR-10 · ADR-034 |
| Invariante | I18 |
| Técnica | Casos de uso |
| Tipo | Positivo |
| Canal | API |
| Caso par | CP-NAV-039 |
| Pre-requisitos | PR-01 con `qa+cp-nav-040-001@example.com`; PR-02; NAV-PREP-01; PR-04. |
| Datos de prueba | Request id `40000000-0000-4000-8000-000000000040`; body `{"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Comida>","p_account_id":"<uuid Visa BBVA>","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"40000000-0000-4000-8000-000000000040"}`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con headers de PR-04 y body `{"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Comida>","p_account_id":"<uuid Visa BBVA>","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"40000000-0000-4000-8000-000000000040"}`. | HTTP 200 y UUID `<ID-1>`. |
| 2 | Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con headers de PR-04 y body `{"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Comida>","p_account_id":"<uuid Visa BBVA>","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"40000000-0000-4000-8000-000000000040"}`. | HTTP 200 y exactamente `<ID-1>`. |
| 3 | Ejecutar `GET <SUPABASE_URL>/rest/v1/transactions?select=id,amount_text:amount::text,request_id,deleted_at&request_id=eq.40000000-0000-4000-8000-000000000040` con headers de PR-04. | HTTP 200; exactamente una fila con `id:"<ID-1>"`, `amount_text:"12500.00"`, request_id exacto y `deleted_at:null`. |
| 4 | Ejecutar `GET <SUPABASE_URL>/rest/v1/ledger_entries?select=transaction_id,installment_number,amount_text:amount::text&transaction_id=eq.<ID-1>` con headers de PR-04. | HTTP 200; exactamente una fila con `installment_number:1` y `amount_text:"12500.00"`. |

**Post-condición:** Una transacción.

### CP-NAV-041 — Dos llamadas simultáneas con la misma clave crean una fila

| Campo | Contenido |
|---|---|
| ID | CP-NAV-041 |
| Trazabilidad | US-70 · CA-10 · NFR-10 · ADR-034 |
| Invariante | I18 |
| Técnica | Adivinación de errores |
| Tipo | Positivo |
| Canal | API |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-041-001@example.com`; PR-02; NAV-PREP-01; PR-04. |
| Datos de prueba | PowerShell 7 con `Start-ThreadJob`; URL `<SUPABASE_URL>/rest/v1/rpc/create_transaction`; headers `apikey: <ANON_KEY>`, `Authorization: Bearer <TOKEN>`, `Content-Type: application/json`; body `{"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Comida>","p_account_id":"<uuid Visa BBVA>","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"41000000-0000-4000-8000-000000000041"}`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar el bloque completo `NAV-CONC-01` en PowerShell 7. | El JSON de salida tiene dos objetos con `Status:200` y el mismo UUID en `Body`; ninguno contiene `code:"23505"`. |
| 2 | Ejecutar `GET <SUPABASE_URL>/rest/v1/transactions?select=id,amount_text:amount::text,request_id,deleted_at&request_id=eq.41000000-0000-4000-8000-000000000041` con headers de PR-04. | HTTP 200; exactamente una fila con el UUID devuelto por ambos jobs, `amount_text:"12500.00"`, la clave indicada y `deleted_at:null`. |
| 3 | Ejecutar `GET <SUPABASE_URL>/rest/v1/ledger_entries?select=transaction_id,installment_number,amount_text:amount::text&transaction_id=eq.<UUID devuelto>` con headers de PR-04. | HTTP 200; exactamente una fila con `installment_number:1` y `amount_text:"12500.00"`. |

**Post-condición:** Una transacción.

### CP-NAV-042 — Claves distintas con el mismo contenido crean dos transacciones

| Campo | Contenido |
|---|---|
| ID | CP-NAV-042 |
| Trazabilidad | US-70 · CA-11 · ADR-034 |
| Invariante | I18 |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | API |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-042-001@example.com`; PR-02; NAV-PREP-01; PR-04. |
| Datos de prueba | Bodies iguales salvo request_id: `{"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Comida>","p_account_id":"<uuid Visa BBVA>","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"42000000-0000-4000-8000-000000000042"}` y `{"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Comida>","p_account_id":"<uuid Visa BBVA>","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"42000000-0000-4000-8000-000000000043"}`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con headers de PR-04 y body `{"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Comida>","p_account_id":"<uuid Visa BBVA>","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"42000000-0000-4000-8000-000000000042"}`. | HTTP 200 y UUID `<ID-1>`. |
| 2 | Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con headers de PR-04 y body `{"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Comida>","p_account_id":"<uuid Visa BBVA>","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"42000000-0000-4000-8000-000000000043"}`. | HTTP 200 y UUID `<ID-2>` distinto. |
| 3 | Ejecutar `GET <SUPABASE_URL>/rest/v1/transactions?select=id,amount_text:amount::text,request_id&request_id=in.(42000000-0000-4000-8000-000000000042,42000000-0000-4000-8000-000000000043)&order=request_id` con headers de PR-04. | HTTP 200; devuelve exactamente dos filas, ambas con `amount_text:"12500.00"`, ids distintos y las dos claves indicadas. |
| 4 | Ejecutar `GET <SUPABASE_URL>/rest/v1/ledger_entries?select=transaction_id,installment_number,amount_text:amount::text&transaction_id=in.(<ID-1>,<ID-2>)&order=transaction_id` con headers de PR-04. | HTTP 200; devuelve exactamente dos filas, una por transacción, ambas con `installment_number:1` y `amount_text:"12500.00"`. |

**Post-condición:** Dos transacciones.

### CP-NAV-043 — La misma clave de dos usuarios no colisiona

| Campo | Contenido |
|---|---|
| ID | CP-NAV-043 |
| Trazabilidad | US-70 · CA-12 · C7 · ADR-034 |
| Invariante | I18 |
| Técnica | Adivinación de errores |
| Tipo | Positivo |
| Canal | API |
| Caso par | — |
| Pre-requisitos | Ejecutar PR-01 con `qa+cp-nav-043-001@example.com` (A) y otra vez con `qa+cp-nav-043-002@example.com` (B), en ventanas de incógnito separadas; para cada usuario ejecutar PR-02 y NAV-PREP-01; ejecutar PR-04 para obtener `<TOKEN-A>` y `<TOKEN-B>`. |
| Datos de prueba | Request id `43000000-0000-4000-8000-000000000043`; cada body usa uuid propios. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Con TOKEN-A, Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con headers de PR-04 y body `{"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Comida A>","p_account_id":"<uuid Visa BBVA A>","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"43000000-0000-4000-8000-000000000043"}`. | HTTP 200 y `<ID-A>`. |
| 2 | Con TOKEN-B, Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con headers de PR-04 y body `{"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Comida B>","p_account_id":"<uuid Visa BBVA B>","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"43000000-0000-4000-8000-000000000043"}`. | HTTP 200 y `<ID-B>` distinto. |
| 3 | Ejecutar `GET <SUPABASE_URL>/rest/v1/transactions?select=id,user_id,request_id&request_id=eq.43000000-0000-4000-8000-000000000043` con headers de PR-04 y `<TOKEN-A>`. | HTTP 200; devuelve exactamente una fila con `id:"<ID-A>"` y el `user_id` de A. |
| 4 | Ejecutar el mismo GET con headers de PR-04 y `<TOKEN-B>`. | HTTP 200; devuelve exactamente una fila con `id:"<ID-B>"` y el `user_id` de B; no devuelve `<ID-A>`. |

**Post-condición:** Una transacción por usuario.

### CP-NAV-044 — La misma clave con otro monto conserva el original

| Campo | Contenido |
|---|---|
| ID | CP-NAV-044 |
| Trazabilidad | US-70 · CA-13 · ADR-034 |
| Invariante | I18 |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | API |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-044-001@example.com`; PR-02; NAV-PREP-01; PR-04. |
| Datos de prueba | Primero `{"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Comida>","p_account_id":"<uuid Visa BBVA>","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"44000000-0000-4000-8000-000000000044"}`; segundo `{"p_type":"expense","p_amount":"12600.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Comida>","p_account_id":"<uuid Visa BBVA>","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"44000000-0000-4000-8000-000000000044"}`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con headers de PR-04 y body `{"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Comida>","p_account_id":"<uuid Visa BBVA>","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"44000000-0000-4000-8000-000000000044"}`. | HTTP 200 y `<ID-1>`. |
| 2 | Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con headers de PR-04 y body `{"p_type":"expense","p_amount":"12600.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Comida>","p_account_id":"<uuid Visa BBVA>","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"44000000-0000-4000-8000-000000000044"}`. | HTTP 200 y exactamente `<ID-1>`. |
| 3 | Ejecutar `GET <SUPABASE_URL>/rest/v1/transactions?select=id,amount_text:amount::text,request_id,deleted_at&request_id=eq.44000000-0000-4000-8000-000000000044` con headers de PR-04. | HTTP 200; exactamente una fila con `id:"<ID-1>"`, `amount_text:"12500.00"` y `deleted_at:null`; ninguna fila de `12600.00`. |

**Post-condición:** Una transacción de 12500.

### CP-NAV-045 — La misma clave funciona después de archivar la categoría

| Campo | Contenido |
|---|---|
| ID | CP-NAV-045 |
| Trazabilidad | US-70 · CA-14 · ADR-034 |
| Invariante | I18 |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | API |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-045-001@example.com`; PR-02; NAV-PREP-01; PR-04. |
| Datos de prueba | Body `{"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Comida>","p_account_id":"<uuid Visa BBVA>","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"45000000-0000-4000-8000-000000000045"}`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con headers de PR-04 y body `{"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Comida>","p_account_id":"<uuid Visa BBVA>","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"45000000-0000-4000-8000-000000000045"}`. | HTTP 200 y `<ID-1>`. |
| 2 | Ejecutar `PATCH <SUPABASE_URL>/rest/v1/categories?id=eq.<uuid Comida>` con headers de PR-04, `Prefer: return=minimal` y body `{"archived_at":"2026-10-12T12:00:00Z"}`. | HTTP 204 y cuerpo vacío. |
| 3 | Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con headers de PR-04 y body `{"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Comida>","p_account_id":"<uuid Visa BBVA>","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"45000000-0000-4000-8000-000000000045"}`. | HTTP 200 y exactamente `<ID-1>`; sin error. |
| 4 | Ejecutar `GET <SUPABASE_URL>/rest/v1/transactions?select=id,amount_text:amount::text,request_id,deleted_at&request_id=eq.45000000-0000-4000-8000-000000000045` con headers de PR-04. | HTTP 200; exactamente una fila con `id:"<ID-1>"`, `amount_text:"12500.00"` y la clave indicada. |

**Post-condición:** Una transacción; categoría archivada.

### CP-NAV-046 — Sin request_id cada llamada crea una transacción

| Campo | Contenido |
|---|---|
| ID | CP-NAV-046 |
| Trazabilidad | US-70 · CA-15 · ADR-034 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | API |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-046-001@example.com`; PR-02; NAV-PREP-01; PR-04. |
| Datos de prueba | Body `{"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Comida>","p_account_id":"<uuid Visa BBVA>","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":null}`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con headers de PR-04 y body `{"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Comida>","p_account_id":"<uuid Visa BBVA>","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":null}`. | HTTP 200 y `<ID-1>`. |
| 2 | Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con headers de PR-04 y body `{"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Comida>","p_account_id":"<uuid Visa BBVA>","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":null}`. | HTTP 200 y `<ID-2>` distinto. |
| 3 | Ejecutar `GET <SUPABASE_URL>/rest/v1/transactions?select=id,amount_text:amount::text,request_id&amount=eq.12500.00&order=id` con headers de PR-04. | HTTP 200; exactamente dos filas con ids distintos, `amount_text:"12500.00"` y `request_id:null`. |
| 4 | Ejecutar `GET <SUPABASE_URL>/rest/v1/ledger_entries?select=transaction_id,installment_number,amount_text:amount::text&transaction_id=in.(<ID-1>,<ID-2>)&order=transaction_id` con headers de PR-04. | HTTP 200; exactamente dos filas, una por transacción, con `installment_number:1` y `amount_text:"12500.00"`. |

**Post-condición:** Dos transacciones.

### CP-NAV-047 — Archivar la categoría entre revisión y guardado produce rechazo sin pendiente

| Campo | Contenido |
|---|---|
| ID | CP-NAV-047 |
| Trazabilidad | US-70 · CA-16 · C6 |
| Invariante | — |
| Técnica | Adivinación de errores |
| Tipo | Negativo |
| Canal | UI |
| Caso par | CP-NAV-048 |
| Pre-requisitos | PR-01 con `qa+cp-nav-047-001@example.com`; PR-02; NAV-PREP-01; cerrar sesión. |
| Datos de prueba | Gasto ARS `12500`; categoría `Comida`; cuenta `Visa BBVA`; una cuota; fecha `06/10/2026`; nota `Almuerzo`; dos pestañas del mismo perfil de incógnito. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-047-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-047-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8 | Hacer click en el campo de monto. | El cursor queda en el campo de monto. |
| 9 | Escribir `12500`. | El monto muestra `12500` y se habilita `Siguiente`. |
| 10 | Hacer click en el botón `Siguiente`. | Se abre el paso 2/3 `¿En qué?`. |
| 11 | Hacer click en `Comida`. | Se abre el paso 3/3 `Revisá y guardá` con `Comida` seleccionado. |
| 12 | Hacer click en `Visa BBVA`. | `Visa BBVA` queda seleccionada. |
| 13 | Hacer click en `Otra` dentro de `Fecha`. | Se habilita el campo de fecha. |
| 14 | Hacer click en el campo de fecha. | El cursor queda en el campo de fecha. |
| 15 | Escribir `06/10/2026`. | La fecha muestra `06/10/2026`. |
| 16 | Hacer click en `Nota (opcional)`. | El cursor queda en Nota. |
| 17 | Escribir `Almuerzo`. | La nota muestra `Almuerzo`. |
| 18 | Presionar Ctrl+L. | La URL queda seleccionada. |
| 19 | Escribir `<APP>/settings`. | La barra muestra exactamente `<APP>/settings`. |
| 20 | Presionar Alt+Enter. | Se abre una segunda pestaña en Ajustes y la primera conserva el paso 3. |
| 21 | En la segunda pestaña, hacer click en el botón con `aria-label="Archivar Comida"`. | `Comida` pasa a la lista de categorías archivadas. |
| 22 | Volver a la primera pestaña. | Se ve el paso 3 con monto `$12.500,00`, categoría `Comida` y cuenta `Visa BBVA`. |
| 23 | Hacer click en `Guardar gasto`. | Se ve `No se pudo guardar` y `la categoría no existe, no es tuya o está archivada`; el aviso tiene `data-kind="rejected"` y el botón sigue diciendo `Guardar gasto`. |
| 24 | Ejecutar en Console `localStorage.getItem('biyu:pending-drafts:<user_id>')`. | Devuelve `null` o una lista que no contiene `amount:"12500"`. |

**Post-condición:** Ninguna transacción ni pendiente; `Comida` queda archivada.

### CP-NAV-048 — La API rechaza una categoría archivada con el código de integridad

| Campo | Contenido |
|---|---|
| ID | CP-NAV-048 |
| Trazabilidad | US-70 · CA-16 · C6 |
| Invariante | — |
| Técnica | Adivinación de errores |
| Tipo | Negativo |
| Canal | API |
| Caso par | CP-NAV-047 |
| Pre-requisitos | PR-01 con `qa+cp-nav-048-001@example.com`; PR-02; NAV-PREP-01; PR-04; archivar `Comida` y conservar su UUID. |
| Datos de prueba | POST `<SUPABASE_URL>/rest/v1/rpc/create_transaction`; body `{"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Comida archivada>","p_account_id":"<uuid Visa BBVA>","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"48000000-0000-4000-8000-000000000048"}`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar el POST de Datos con headers `apikey: <ANON_KEY>`, `Authorization: Bearer <TOKEN>` y `Content-Type: application/json`. | HTTP 409; JSON `code:"23503"`, `message:"la categoría no existe, no es tuya o está archivada"`; no devuelve UUID. |
| 2 | Ejecutar `GET <SUPABASE_URL>/rest/v1/transactions?select=id,request_id&request_id=eq.48000000-0000-4000-8000-000000000048` con headers de PR-04. | HTTP 200 y cuerpo exacto `[]`; no hay transacción. |
| 3 | Ejecutar `GET <SUPABASE_URL>/rest/v1/ledger_entries?select=id,transaction_id` con headers de PR-04. | HTTP 200 y cuerpo exacto `[]`; no hay imputaciones. |

**Post-condición:** Ninguna transacción; `Comida` sigue archivada.

### CP-NAV-049 — Volver a Registrar muestra el pendiente con sus acciones

| Campo | Contenido |
|---|---|
| ID | CP-NAV-049 |
| Trazabilidad | US-70 · CA-17 · NFR-09 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-049-001@example.com`; PR-02; NAV-PREP-01; cerrar sesión. |
| Datos de prueba | Gasto ARS `12500`; `Comida`; `Visa BBVA`; fecha `06/10/2026`; nota `Almuerzo`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-049-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-049-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8 | Hacer click en el campo de monto. | El cursor queda en el campo de monto. |
| 9 | Escribir `12500`. | El monto muestra `12500` y se habilita `Siguiente`. |
| 10 | Hacer click en el botón `Siguiente`. | Se abre el paso 2/3 `¿En qué?`. |
| 11 | Hacer click en `Comida`. | Se abre el paso 3/3 `Revisá y guardá` con `Comida` seleccionado. |
| 12 | Hacer click en `Visa BBVA`. | `Visa BBVA` queda seleccionada. |
| 13 | Hacer click en `Otra` dentro de `Fecha`. | Se habilita el campo de fecha. |
| 14 | Hacer click en el campo de fecha. | El cursor queda en el campo de fecha. |
| 15 | Escribir `06/10/2026`. | La fecha muestra `06/10/2026`. |
| 16 | Hacer click en `Nota (opcional)`. | El cursor queda en Nota. |
| 17 | Escribir `Almuerzo`. | La nota muestra `Almuerzo`. |
| 18 | Presionar F12. | DevTools se abre en `Network` y se ve la lista de solicitudes. |
| 19 | En el selector de throttling, elegir `Offline`. | El selector muestra `Offline`. |
| 20 | Hacer click en el botón `Guardar gasto`. | Se ve `No se pudo guardar` y `Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.`; el aviso tiene `data-kind="network"` y el botón dice `Reintentar`. |
| 21 | En el selector de throttling, elegir `No throttling`. | El selector muestra `No throttling`. |
| 22 | Hacer click en `Resumen` en la barra. | Se abre `/dashboard`. |
| 23 | Hacer click en `Registrar` en la barra. | Se abre `/register` en el paso 1/3. |
| 24 | Ejecutar en Console `document.querySelector('[data-testid="register-pending-drafts"]').innerText`. | Devuelve texto que contiene exactamente `Tenés 1 movimiento sin guardar`, `Gasto · $12.500,00 · Comida · 06/10/2026`, `Recuperar` y `Descartar`. |

**Post-condición:** Un pendiente y ninguna transacción; Network en `No throttling`.

### CP-NAV-050 — Recargar Registrar muestra el pendiente

| Campo | Contenido |
|---|---|
| ID | CP-NAV-050 |
| Trazabilidad | US-70 · CA-17 · NFR-09 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-050-001@example.com`; PR-02; NAV-PREP-01; cerrar sesión. |
| Datos de prueba | Gasto ARS `12500`; `Comida`; `Visa BBVA`; fecha `06/10/2026`; nota `Almuerzo`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-050-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-050-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8 | Hacer click en el campo de monto. | El cursor queda en el campo de monto. |
| 9 | Escribir `12500`. | El monto muestra `12500` y se habilita `Siguiente`. |
| 10 | Hacer click en el botón `Siguiente`. | Se abre el paso 2/3 `¿En qué?`. |
| 11 | Hacer click en `Comida`. | Se abre el paso 3/3 `Revisá y guardá` con `Comida` seleccionado. |
| 12 | Hacer click en `Visa BBVA`. | `Visa BBVA` queda seleccionada. |
| 13 | Hacer click en `Otra` dentro de `Fecha`. | Se habilita el campo de fecha. |
| 14 | Hacer click en el campo de fecha. | El cursor queda en el campo de fecha. |
| 15 | Escribir `06/10/2026`. | La fecha muestra `06/10/2026`. |
| 16 | Hacer click en `Nota (opcional)`. | El cursor queda en Nota. |
| 17 | Escribir `Almuerzo`. | La nota muestra `Almuerzo`. |
| 18 | Presionar F12. | DevTools se abre en `Network` y se ve la lista de solicitudes. |
| 19 | En el selector de throttling, elegir `Offline`. | El selector muestra `Offline`. |
| 20 | Hacer click en el botón `Guardar gasto`. | Se ve `No se pudo guardar` y `Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.`; el aviso tiene `data-kind="network"` y el botón dice `Reintentar`. |
| 21 | En el selector de throttling, elegir `No throttling`. | El selector muestra `No throttling`. |
| 22 | Presionar Ctrl+R. | Registrar se recarga y abre en el paso 1/3. |
| 23 | Ejecutar en Console `document.querySelector('[data-testid="register-pending-drafts"]').innerText`. | Devuelve texto que contiene exactamente `Tenés 1 movimiento sin guardar`, `Gasto · $12.500,00 · Comida · 06/10/2026`, `Recuperar` y `Descartar`. |

**Post-condición:** Un pendiente y ninguna transacción; Network en `No throttling`.

### CP-NAV-051 — Dos borradores distintos generan dos pendientes ordenados por recencia

| Campo | Contenido |
|---|---|
| ID | CP-NAV-051 |
| Trazabilidad | US-70 · CA-18 · NFR-09 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-051-001@example.com`; PR-02; NAV-PREP-01; cerrar sesión. |
| Datos de prueba | Borrador 1: ARS `12500`, `Comida`, `Visa BBVA`, `06/10/2026`, nota `Almuerzo`; borrador 2: ARS `3400`, `Comida`, `Visa BBVA`, `05/10/2026`, nota `Café`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-051-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-051-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8 | Hacer click en el campo de monto. | El cursor queda en el campo de monto. |
| 9 | Escribir `12500`. | El monto muestra `12500` y se habilita `Siguiente`. |
| 10 | Hacer click en el botón `Siguiente`. | Se abre el paso 2/3 `¿En qué?`. |
| 11 | Hacer click en `Comida`. | Se abre el paso 3/3 `Revisá y guardá` con `Comida` seleccionado. |
| 12 | Hacer click en `Visa BBVA`. | `Visa BBVA` queda seleccionada. |
| 13 | Hacer click en `Otra` dentro de `Fecha`. | Se habilita el campo de fecha. |
| 14 | Hacer click en el campo de fecha. | El cursor queda en el campo de fecha. |
| 15 | Escribir `06/10/2026`. | La fecha muestra `06/10/2026`. |
| 16 | Hacer click en `Nota (opcional)`. | El cursor queda en Nota. |
| 17 | Escribir `Almuerzo`. | La nota muestra `Almuerzo`. |
| 18 | Presionar F12. | DevTools se abre en `Network` y se ve la lista de solicitudes. |
| 19 | En el selector de throttling, elegir `Offline`. | El selector muestra `Offline`. |
| 20 | Hacer click en el botón `Guardar gasto`. | Se ve `No se pudo guardar` y `Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.`; el aviso tiene `data-kind="network"` y el botón dice `Reintentar`. |
| 21 | En el selector de throttling, elegir `No throttling`. | El selector muestra `No throttling`. |
| 22 | Hacer click en `Resumen`. | Se abre `/dashboard`. |
| 23 | Hacer click en `Registrar`. | Se abre `/register` en el paso 1/3 con un pendiente. |
| 24 | Hacer click en el campo de monto. | El cursor queda en el campo. |
| 25 | Escribir `3400`. | El monto muestra `3400`. |
| 26 | Hacer click en `Siguiente`. | Se abre el paso 2/3. |
| 27 | Hacer click en `Comida`. | Se abre el paso 3/3. |
| 28 | Hacer click en `Visa BBVA`. | `Visa BBVA` queda seleccionada. |
| 29 | Hacer click en `Otra` dentro de `Fecha`. | Se habilita el campo de fecha. |
| 30 | Escribir `05/10/2026` en el campo de fecha. | La fecha muestra `05/10/2026`. |
| 31 | Escribir `Café` en `Nota (opcional)`. | La nota muestra `Café`. |
| 32 | En el selector de throttling, elegir `Offline`. | El selector muestra `Offline`. |
| 33 | Hacer click en `Guardar gasto`. | Aparece el aviso de red y el botón `Reintentar`. |
| 34 | En el selector de throttling, elegir `No throttling`. | El selector muestra `No throttling`. |
| 35 | Hacer click en `Resumen`. | Se abre `/dashboard`. |
| 36 | Hacer click en `Registrar`. | Se abre `/register` en el paso 1/3. |
| 37 | Ejecutar en Console `[...document.querySelectorAll('[data-testid="register-pending-draft"]')].map(row=>row.innerText)`. | Devuelve dos elementos: el primero contiene `Gasto · $3.400,00 · Comida · 05/10/2026`, `Recuperar` y `Descartar`; el segundo contiene `Gasto · $12.500,00 · Comida · 06/10/2026`, `Recuperar` y `Descartar`; el título visible dice `Tenés 2 movimientos sin guardar`. |

**Post-condición:** Dos pendientes, ninguna transacción; Network en `No throttling`.

### CP-NAV-052 — Recuperar un gasto USD conserva fecha y tipo de cambio originales

| Campo | Contenido |
|---|---|
| ID | CP-NAV-052 |
| Trazabilidad | US-70 · CA-19 · C5 · NFR-09 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-052-001@example.com`; PR-02; NAV-PREP-01; cerrar sesión. |
| Datos de prueba | Gasto USD `50`; tipo de cambio `1500`; categoría `Comida`; cuenta `Visa BBVA`; una cuota; fecha `30/09/2026`; nota `Cena ficticia`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-052-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-052-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8 | Hacer click en `US$`. | La moneda seleccionada es `US$`. |
| 9 | Escribir `50` en el campo de monto. | El monto muestra `50`. |
| 10 | Escribir `1500` en `Tipo de cambio (ARS por US$)`. | El tipo de cambio muestra `1500` y se habilita `Siguiente`. |
| 11 | Hacer click en `Siguiente`. | Se abre el paso 2/3 `¿En qué?`. |
| 12 | Hacer click en `Comida`. | Se abre el paso 3/3. |
| 13 | Hacer click en `Visa BBVA`. | `Visa BBVA` queda seleccionada. |
| 14 | Hacer click en `Otra` dentro de `Fecha`. | Se habilita la fecha. |
| 15 | Escribir `30/09/2026` en el campo de fecha. | La fecha muestra `30/09/2026`. |
| 16 | Escribir `Cena ficticia` en `Nota (opcional)`. | La nota muestra `Cena ficticia`. |
| 17 | Presionar F12. | DevTools se abre en `Network` y se ve la lista de solicitudes. |
| 18 | Elegir `Offline` en el selector de throttling. | El selector muestra `Offline`. |
| 19 | Hacer click en `Guardar gasto`. | Se ve el aviso `No se pudo guardar`, el texto `Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.` y el botón `Reintentar`. |
| 20 | Elegir `No throttling` en el selector de throttling. | El selector muestra `No throttling`. |
| 21 | Hacer click en `Resumen`. | Se abre `/dashboard`. |
| 22 | Hacer click en `Registrar`. | Se abre `/register` con `Tenés 1 movimiento sin guardar`. |
| 23 | Hacer click en `Recuperar`. | Se abre el paso 3/3 con monto `US$50,00`, tipo de cambio `1500`, fecha `30/09/2026`, categoría `Comida`, cuenta `Visa BBVA` y nota `Cena ficticia`; el botón dice `Guardar gasto`. |
| 24 | Hacer click en `Guardar gasto`. | Se ve `Gasto guardado` con `US$50,00 · Comida · Visa BBVA` y el formulario vuelve al paso 1. |
| 25 | Hacer click en `Resumen`. | Se abre el Resumen. |
| 26 | Hacer click en `Registrar`. | Se abre el paso 1 sin `register-pending-drafts`. |

**Post-condición:** Una transacción USD del 30/09/2026; ningún pendiente.

### CP-NAV-053 — Recuperar detecta una transacción activa que ya se había guardado

| Campo | Contenido |
|---|---|
| ID | CP-NAV-053 |
| Trazabilidad | US-70 · CA-20 · I18 · C6 |
| Invariante | I18 |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | CP-NAV-083 |
| Pre-requisitos | PR-01 con `qa+cp-nav-053-001@example.com`; PR-02; NAV-PREP-01; PR-04; ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con headers de PR-04 y el body API literal de Datos: esperado HTTP 200 y UUID `<ID-1>`; cerrar sesión. |
| Datos de prueba | Gasto; ARS; monto `12500`; categoría `Comida`; cuenta `Visa BBVA`; una cuota; fecha `06/10/2026`; nota `Almuerzo`; UUID fijo `53000000-0000-4000-8000-000000000053`; body API `{"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Comida>","p_account_id":"<uuid Visa BBVA>","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"53000000-0000-4000-8000-000000000053"}`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-053-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-053-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8a | Presionar Ctrl+Shift+J. | Se abre DevTools en la pestaña Console. |
| 8b | Ejecutar `window.__navUuid=crypto.randomUUID.bind(crypto);Object.defineProperty(crypto,'randomUUID',{configurable:true,value:()=>"53000000-0000-4000-8000-000000000053"})`. | La consola devuelve `undefined`. |
| 9 | Hacer click en el campo de monto. | El cursor queda en el campo de monto. |
| 10 | Escribir `12500`. | El monto muestra `12500` y se habilita `Siguiente`. |
| 11 | Hacer click en `Siguiente`. | Se abre el paso 2/3 `¿En qué?`. |
| 12 | Hacer click en `Comida`. | Se abre el paso 3/3 `Revisá y guardá`. |
| 13 | Hacer click en `Visa BBVA`. | `Visa BBVA` queda seleccionada. |
| 14 | Hacer click en `Otra` dentro de `Fecha`. | Se habilita el campo de fecha. |
| 15 | Escribir `06/10/2026` en el campo de fecha. | La fecha muestra `06/10/2026`. |
| 16 | Escribir `Almuerzo` en `Nota (opcional)`. | La nota muestra `Almuerzo`. |
| 17 | Hacer click en la pestaña `Network` de DevTools. | DevTools muestra `Network` y se ve la lista de solicitudes. |
| 18 | Elegir `Offline` en el selector de throttling. | El selector muestra `Offline`. |
| 19 | Hacer click en `Guardar gasto`. | Se ve el aviso `No se pudo guardar`, el texto `Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.` y el botón `Reintentar`. |
| 20 | Elegir `No throttling` en Network. | El selector muestra `No throttling`. |
| 21 | Hacer click en `Resumen`. | Se abre `/dashboard`. |
| 22 | Hacer click en `Registrar`. | Se abre el paso 1 con una fila pendiente. |
| 23 | Hacer click en `Recuperar`. | Aparece el toast `Ese movimiento ya estaba guardado` con `$12.500,00 · Comida · Visa BBVA`; la fila desaparece y el formulario permanece vacío en el paso 1. |
| 23a | Hacer click en la pestaña `Console` de DevTools. | DevTools muestra la pestaña `Console`. |
| 24 | Ejecutar `Object.defineProperty(crypto,'randomUUID',{configurable:true,value:window.__navUuid});delete window.__navUuid`. | La consola devuelve `true`. |

**Post-condición:** Una transacción activa; ningún pendiente; función UUID restaurada.

### CP-NAV-054 — Recuperar detecta una transacción ya guardada y después eliminada

| Campo | Contenido |
|---|---|
| ID | CP-NAV-054 |
| Trazabilidad | US-70 · CA-21 · I10 · I18 |
| Invariante | I10 · I18 |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | CP-NAV-084 |
| Pre-requisitos | PR-01 con `qa+cp-nav-054-001@example.com`; PR-02; NAV-PREP-01; PR-04; ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con headers de PR-04 y el body API literal de Datos: esperado HTTP 200 y UUID `<ID-1>`; cerrar sesión. |
| Datos de prueba | Gasto; ARS; monto `12500`; categoría `Comida`; cuenta `Visa BBVA`; una cuota; fecha `06/10/2026`; nota `Almuerzo`; UUID fijo `54000000-0000-4000-8000-000000000054`; body API `{"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Comida>","p_account_id":"<uuid Visa BBVA>","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"54000000-0000-4000-8000-000000000054"}`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-054-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-054-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8a | Presionar Ctrl+Shift+J. | Se abre DevTools en la pestaña Console. |
| 8b | Ejecutar `window.__navUuid=crypto.randomUUID.bind(crypto);Object.defineProperty(crypto,'randomUUID',{configurable:true,value:()=>"54000000-0000-4000-8000-000000000054"})`. | La consola devuelve `undefined`. |
| 9 | Hacer click en el campo de monto. | El cursor queda en el campo de monto. |
| 10 | Escribir `12500`. | El monto muestra `12500` y se habilita `Siguiente`. |
| 11 | Hacer click en `Siguiente`. | Se abre el paso 2/3 `¿En qué?`. |
| 12 | Hacer click en `Comida`. | Se abre el paso 3/3 `Revisá y guardá`. |
| 13 | Hacer click en `Visa BBVA`. | `Visa BBVA` queda seleccionada. |
| 14 | Hacer click en `Otra` dentro de `Fecha`. | Se habilita el campo de fecha. |
| 15 | Escribir `06/10/2026` en el campo de fecha. | La fecha muestra `06/10/2026`. |
| 16 | Escribir `Almuerzo` en `Nota (opcional)`. | La nota muestra `Almuerzo`. |
| 17 | Hacer click en la pestaña `Network` de DevTools. | DevTools muestra `Network` y se ve la lista de solicitudes. |
| 18 | Elegir `Offline` en el selector de throttling. | El selector muestra `Offline`. |
| 19 | Hacer click en `Guardar gasto`. | Se ve el aviso `No se pudo guardar`, el texto `Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.` y el botón `Reintentar`. |
| 20 | Elegir `No throttling` en Network. | El selector muestra `No throttling`. |
| 21 | Hacer click en la barra de direcciones. | La URL queda seleccionada. |
| 22 | Escribir `<APP>/transactions?period=2026-10`. | La barra muestra exactamente `<APP>/transactions?period=2026-10`. |
| 23 | Presionar Enter. | Movimientos muestra una fila `Almuerzo` de `$12.500,00`. |
| 24 | Hacer click en el botón `Eliminar Almuerzo`. | Se abre el diálogo `¿Eliminar transacción?`. |
| 25 | Hacer click en `Eliminar`. | Aparece `Transacción eliminada` y la fila sale de los movimientos activos. |
| 26 | Hacer click en `Registrar`. | Se abre el paso 1 con una fila pendiente. |
| 27 | Hacer click en `Recuperar`. | Aparece `Ese movimiento ya estaba guardado y después se eliminó` con `Está en Movimientos, en Eliminados.`; la fila pendiente desaparece y no se crea otra transacción. |
| 27a | Hacer click en la pestaña `Console` de DevTools. | DevTools muestra la pestaña `Console`. |
| 28 | Ejecutar `Object.defineProperty(crypto,'randomUUID',{configurable:true,value:window.__navUuid});delete window.__navUuid`. | La consola devuelve `true`. |

**Post-condición:** Una transacción eliminada; ningún pendiente; función UUID restaurada.

### CP-NAV-055 — Sin conexión, Recuperar conserva la fila y muestra el error de verificación

| Campo | Contenido |
|---|---|
| ID | CP-NAV-055 |
| Trazabilidad | US-70 · CA-22 · NFR-09 |
| Invariante | — |
| Técnica | Adivinación de errores |
| Tipo | Negativo |
| Canal | UI |
| Caso par | No aplicable: H-NAV-01 |
| Pre-requisitos | PR-01 con `qa+cp-nav-055-001@example.com`; PR-02; NAV-PREP-01; cerrar sesión. |
| Datos de prueba | Gasto; ARS; monto `12500`; categoría `Comida`; cuenta `Visa BBVA`; una cuota; fecha `06/10/2026`; nota `Almuerzo`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-055-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-055-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8 | Hacer click en el campo de monto. | El cursor queda en el campo de monto. |
| 9 | Escribir `12500`. | El monto muestra `12500` y se habilita `Siguiente`. |
| 10 | Hacer click en `Siguiente`. | Se abre el paso 2/3 `¿En qué?`. |
| 11 | Hacer click en `Comida`. | Se abre el paso 3/3 `Revisá y guardá`. |
| 12 | Hacer click en `Visa BBVA`. | `Visa BBVA` queda seleccionada. |
| 13 | Hacer click en `Otra` dentro de `Fecha`. | Se habilita el campo de fecha. |
| 14 | Escribir `06/10/2026` en el campo de fecha. | La fecha muestra `06/10/2026`. |
| 15 | Escribir `Almuerzo` en `Nota (opcional)`. | La nota muestra `Almuerzo`. |
| 16 | Presionar F12. | DevTools se abre en `Network` y se ve la lista de solicitudes. |
| 17 | Elegir `Offline` en el selector de throttling. | El selector muestra `Offline`. |
| 18 | Hacer click en `Guardar gasto`. | Se ve el aviso `No se pudo guardar`, el texto `Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.` y el botón `Reintentar`. |
| 19 | Elegir `No throttling` en Network. | El selector muestra `No throttling`. |
| 20 | Hacer click en `Resumen`. | Se abre `/dashboard`. |
| 21 | Hacer click en `Registrar`. | Se abre el paso 1 con una fila pendiente. |
| 22 | Elegir `Offline` en Network. | El selector muestra `Offline`. |
| 23 | Hacer click en `Recuperar`. | La fila muestra `No pudimos verificar si ya se guardó. Revisá tu conexión y probá de nuevo.`; la misma fila y sus botones siguen visibles. |
| 24 | Elegir `No throttling` en Network. | El selector muestra `No throttling`. |

**Post-condición:** Un pendiente y ninguna transacción; Network en `No throttling`.

### CP-NAV-056 — Descartar elimina el pendiente incluso después de recargar

| Campo | Contenido |
|---|---|
| ID | CP-NAV-056 |
| Trazabilidad | US-70 · CA-23 · NFR-09 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-056-001@example.com`; PR-02; NAV-PREP-01; cerrar sesión. |
| Datos de prueba | Gasto; ARS; monto `12500`; categoría `Comida`; cuenta `Visa BBVA`; una cuota; fecha `06/10/2026`; nota `Almuerzo`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-056-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-056-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en el botón `Entrar`. | Se abre Registrar en el paso 1/3 `¿Cuánto?`. |
| 8 | Hacer click en el campo de monto. | El cursor queda en el campo de monto. |
| 9 | Escribir `12500`. | El monto muestra `12500` y se habilita `Siguiente`. |
| 10 | Hacer click en `Siguiente`. | Se abre el paso 2/3 `¿En qué?`. |
| 11 | Hacer click en `Comida`. | Se abre el paso 3/3 `Revisá y guardá`. |
| 12 | Hacer click en `Visa BBVA`. | `Visa BBVA` queda seleccionada. |
| 13 | Hacer click en `Otra` dentro de `Fecha`. | Se habilita el campo de fecha. |
| 14 | Escribir `06/10/2026` en el campo de fecha. | La fecha muestra `06/10/2026`. |
| 15 | Escribir `Almuerzo` en `Nota (opcional)`. | La nota muestra `Almuerzo`. |
| 16 | Presionar F12. | DevTools se abre en `Network` y se ve la lista de solicitudes. |
| 17 | Elegir `Offline` en el selector de throttling. | El selector muestra `Offline`. |
| 18 | Hacer click en `Guardar gasto`. | Se ve el aviso `No se pudo guardar`, el texto `Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.` y el botón `Reintentar`. |
| 19 | Elegir `No throttling` en Network. | El selector muestra `No throttling`. |
| 20 | Hacer click en `Resumen`. | Se abre `/dashboard`. |
| 21 | Hacer click en `Registrar`. | Se abre el paso 1 con `Tenés 1 movimiento sin guardar`. |
| 22 | Hacer click en `Descartar`. | La fila desaparece y ya no se ve `register-pending-drafts`. |
| 23 | Presionar Ctrl+R. | Registrar se recarga en el paso 1 y el aviso no reaparece. |
| 24 | Ejecutar en Console `localStorage.getItem('biyu:pending-drafts:<user_id>')`. | Devuelve `null` o la cadena exacta `"[]"`. |

**Post-condición:** Ningún pendiente ni transacción.

### CP-NAV-057 — Cerrar sesión borra todos los pendientes del usuario

| Campo | Contenido |
|---|---|
| ID | CP-NAV-057 |
| Trazabilidad | US-70 · CA-24 · NFR-09 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-057-001@example.com`; PR-02; NAV-PREP-01; cerrar sesión. |
| Datos de prueba | Gasto; ARS; monto `12500`; categoría `Comida`; cuenta `Visa BBVA`; una cuota; fecha `06/10/2026`; nota `Almuerzo`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-057-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-057-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Escribir `12500` en el campo de monto. | El monto muestra `12500`. |
| 9 | Hacer click en `Siguiente`. | Se abre el paso 2/3. |
| 10 | Hacer click en `Comida`. | Se abre el paso 3/3. |
| 11 | Hacer click en `Visa BBVA`. | `Visa BBVA` queda seleccionada. |
| 12 | Hacer click en `Otra` dentro de `Fecha`. | Se habilita el campo de fecha. |
| 13 | Escribir `06/10/2026` en el campo de fecha. | La fecha muestra `06/10/2026`. |
| 14 | Escribir `Almuerzo` en `Nota (opcional)`. | La nota muestra `Almuerzo`. |
| 15 | Presionar F12. | DevTools se abre en `Network` y se ve la lista de solicitudes. |
| 16 | Elegir `Offline` en el selector de throttling. | El selector muestra `Offline`. |
| 17 | Hacer click en `Guardar gasto`. | Se ve `No se pudo guardar`, el texto de conexión y el botón `Reintentar`. |
| 18 | Elegir `No throttling` en Network. | El selector muestra `No throttling`. |
| 19 | Hacer click en `Resumen`. | Se abre `/dashboard`. |
| 20 | Hacer click en `Registrar`. | Se abre el paso 1 con una fila pendiente. |
| 21 | Hacer click en el botón con `aria-label="Ajustes"`. | Se abre `/settings`. |
| 22 | Hacer click en `Cerrar sesión`. | Se abre `/login` y se ve `Entrar`. |
| 23 | Ejecutar en Console `localStorage.getItem('biyu:pending-drafts:<user_id>')`. | Devuelve `null`. |
| 24 | Escribir `qa+cp-nav-057-001@example.com` en `Email`. | El campo muestra ese email. |
| 25 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 26 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1; no aparece el aviso de pendientes. |

**Post-condición:** Ningún pendiente ni transacción; sesión iniciada.

### CP-NAV-058 — Recuperar con categoría archivada deja la categoría vacía

| Campo | Contenido |
|---|---|
| ID | CP-NAV-058 |
| Trazabilidad | US-70 · CA-25 · US-11 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-058-001@example.com`; PR-02; NAV-PREP-01; cerrar sesión. |
| Datos de prueba | Gasto; ARS; monto `12500`; categoría original `Comida`; cuenta `Visa BBVA`; una cuota; fecha `06/10/2026`; nota `Almuerzo`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-058-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-058-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Escribir `12500` en el campo de monto. | El monto muestra `12500`. |
| 9 | Hacer click en `Siguiente`. | Se abre el paso 2/3. |
| 10 | Hacer click en `Comida`. | Se abre el paso 3/3. |
| 11 | Hacer click en `Visa BBVA`. | `Visa BBVA` queda seleccionada. |
| 12 | Hacer click en `Otra` dentro de `Fecha`. | Se habilita el campo de fecha. |
| 13 | Escribir `06/10/2026` en el campo de fecha. | La fecha muestra `06/10/2026`. |
| 14 | Escribir `Almuerzo` en `Nota (opcional)`. | La nota muestra `Almuerzo`. |
| 15 | Presionar F12. | DevTools se abre en `Network` y se ve la lista de solicitudes. |
| 16 | Elegir `Offline` en el selector de throttling. | El selector muestra `Offline`. |
| 17 | Hacer click en `Guardar gasto`. | Se ve `No se pudo guardar`, el texto de conexión y el botón `Reintentar`. |
| 18 | Elegir `No throttling` en Network. | El selector muestra `No throttling`. |
| 19 | Hacer click en el botón con `aria-label="Ajustes"`. | Se abre `/settings`. |
| 20 | Hacer click en el botón con `aria-label="Archivar Comida"`. | `Comida` pasa a categorías archivadas. |
| 21 | Hacer click en `Registrar`. | Se abre el paso 1 con una fila pendiente. |
| 22 | Hacer click en `Recuperar`. | Se abre el paso 3/3; el campo categoría está vacío, monto `$12.500,00`, cuenta `Visa BBVA` y fecha `06/10/2026` se conservan; junto al botón aparece `Completá categoría para guardar`; el botón dice `Guardar gasto`. |

**Post-condición:** Un pendiente cargado en el formulario; ninguna transacción; `Comida` archivada.

### CP-NAV-059 — Variante equivalente: un pendiente de septiembre se imputa a septiembre al guardarlo en octubre

| Campo | Contenido |
|---|---|
| ID | CP-NAV-059 |
| Trazabilidad | US-70 · CA-26 · C5 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-059-001@example.com`; PR-02; NAV-PREP-01; cerrar sesión. |
| Datos de prueba | Ejecutar durante octubre de 2026; gasto ARS `12500`; `Comida`; `Visa BBVA`; fecha original `30/09/2026`; nota `Almuerzo`. La fecha exacta de guardado `06/10/2026` queda bloqueada por H-NAV-02. |
| Prioridad | Alta |
| Automatizable | V3 |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-059-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-059-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Escribir `12500` en el campo de monto. | El monto muestra `12500`. |
| 9 | Hacer click en `Siguiente`. | Se abre el paso 2/3. |
| 10 | Hacer click en `Comida`. | Se abre el paso 3/3. |
| 11 | Hacer click en `Visa BBVA`. | `Visa BBVA` queda seleccionada. |
| 12 | Hacer click en `Otra` dentro de `Fecha`. | Se habilita el campo de fecha. |
| 13 | Escribir `30/09/2026` en el campo de fecha. | La fecha muestra `30/09/2026`. |
| 14 | Escribir `Almuerzo` en `Nota (opcional)`. | La nota muestra `Almuerzo`. |
| 15 | Presionar F12. | DevTools se abre en `Network` y se ve la lista de solicitudes. |
| 16 | Elegir `Offline` en el selector de throttling. | El selector muestra `Offline`. |
| 17 | Hacer click en `Guardar gasto`. | Se ve `No se pudo guardar`, el texto de conexión y el botón `Reintentar`. |
| 18 | Elegir `No throttling` en Network. | El selector muestra `No throttling`. |
| 19 | Hacer click en `Resumen`. | La ruta cambia a `/dashboard` con su parámetro `period`; el borrador pendiente no se muestra en esta pantalla. |
| 20 | Hacer click en `Registrar`. | Se abre el paso 1 con una fila fechada `30/09/2026`. |
| 21 | Hacer click en `Recuperar`. | Se abre el paso 3 con fecha `30/09/2026` y botón `Guardar gasto`. |
| 22 | Hacer click en `Guardar gasto`. | Se muestra `Gasto guardado` y vuelve al paso 1. |
| 23 | Hacer click en la barra de direcciones. | La URL queda seleccionada. |
| 24 | Escribir `<APP>/dashboard?period=2026-09`. | La barra muestra exactamente esa URL. |
| 25 | Presionar Enter. | El Resumen de septiembre muestra gastos `$12.500,00` y la transacción `Almuerzo`. |
| 26 | Hacer click en `Mes siguiente`. | La URL queda `/dashboard?period=2026-10`; el Resumen de octubre no incluye `$12.500,00` ni `Almuerzo`. |

**Post-condición:** Una transacción imputada a septiembre; ningún pendiente.

### CP-NAV-060 — TalkBack anuncia el aviso de error sin mover el foco

| Campo | Contenido |
|---|---|
| ID | CP-NAV-060 |
| Trazabilidad | US-70 · CA-27 · NFR-06 |
| Invariante | — |
| Técnica | Casos de uso |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-060-001@example.com`; PR-02; NAV-PREP-01; teléfono Pixel 7 con Android 15, Chrome estable y TalkBack en español, con el indicador visual de foco habilitado; Wi-Fi y datos móviles disponibles; cerrar sesión. |
| Datos de prueba | Gasto; ARS; monto `12500`; categoría `Comida`; cuenta `Visa BBVA`; una cuota; fecha `06/10/2026`; nota `Almuerzo`. |
| Prioridad | Media |
| Automatizable | No |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-060-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-060-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Escribir `12500` en el campo de monto. | El monto muestra `12500`. |
| 9 | Hacer click en `Siguiente`. | Se abre el paso 2/3. |
| 10 | Hacer click en `Comida`. | Se abre el paso 3/3. |
| 11 | Hacer click en `Visa BBVA`. | `Visa BBVA` queda seleccionada. |
| 12 | Hacer click en `Otra` dentro de `Fecha`. | Se habilita el campo de fecha. |
| 13 | Escribir `06/10/2026` en el campo de fecha. | La fecha muestra `06/10/2026`. |
| 14 | Escribir `Almuerzo` en `Nota (opcional)`. | La nota muestra `Almuerzo`. |
| 15 | Activar TalkBack con el atajo de accesibilidad del teléfono. | TalkBack anuncia Chrome y el elemento que tiene el foco de accesibilidad. |
| 16 | Abrir Ajustes rápidos de Android. | Se muestran los controles `Internet` y `Modo avión`. |
| 17 | Activar `Modo avión`. | Android muestra `Modo avión activado` y no hay Wi-Fi ni datos móviles. |
| 18 | Volver a Chrome. | Se conserva el paso 3 con todos los datos; el foco de TalkBack puede llevarse a `Guardar gasto`. |
| 19 | Llevar el foco de TalkBack a `Guardar gasto`. | TalkBack anuncia `Guardar gasto, botón`. |
| 20 | Hacer doble toque para activar `Guardar gasto`. | TalkBack anuncia una sola vez `No se pudo guardar. Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.`; el botón visible pasa a `Reintentar`. |
| 21 | Presionar simultáneamente los botones físicos `Encendido` y `Bajar volumen` para tomar una captura. | Android confirma la captura; la imagen muestra el indicador de foco de TalkBack rodeando el botón `Reintentar`, y no el aviso ni otro elemento. |

**Post-condición:** Desactivar TalkBack y `Modo avión`; un pendiente, ninguna transacción.

### CP-NAV-061 — Doble activación durante Guardando envía una sola RPC

| Campo | Contenido |
|---|---|
| ID | CP-NAV-061 |
| Trazabilidad | US-70 · CA-28 · C4 |
| Invariante | — |
| Técnica | Adivinación de errores |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-061-001@example.com`; PR-02; NAV-PREP-01; cerrar sesión. |
| Datos de prueba | Gasto; ARS; monto `12500`; categoría `Comida`; cuenta `Visa BBVA`; una cuota; fecha `06/10/2026`; nota `Almuerzo`; DevTools Network con `Preserve log` y throttling personalizado de latencia `500 ms`, descarga `10 Mbps`, subida `10 Mbps`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-061-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-061-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Escribir `12500` en el campo de monto. | El monto muestra `12500`. |
| 9 | Hacer click en `Siguiente`. | Se abre el paso 2/3. |
| 10 | Hacer click en `Comida`. | Se abre el paso 3/3. |
| 11 | Hacer click en `Visa BBVA`. | `Visa BBVA` queda seleccionada. |
| 12 | Hacer click en `Otra` dentro de `Fecha`. | Se habilita el campo de fecha. |
| 13 | Escribir `06/10/2026` en el campo de fecha. | La fecha muestra `06/10/2026`. |
| 14 | Escribir `Almuerzo` en `Nota (opcional)`. | La nota muestra `Almuerzo`. |
| 15 | Presionar F12. | DevTools se abre en `Network` y se ve la lista de solicitudes. |
| 16 | Activar `Preserve log`. | La casilla queda marcada. |
| 17 | Elegir el perfil personalizado de latencia `500 ms`. | El selector muestra el perfil de `500 ms`. |
| 18 | Hacer click en `Guardar gasto`. | El botón cambia de inmediato a `Guardando…`, queda deshabilitado y el formulario tiene `aria-busy="true"`. |
| 19 | Hacer click otra vez sobre el botón deshabilitado `Guardando…`. | El control no se activa: sigue deshabilitado y conserva `Guardando…`. |
| 20 | Esperar hasta que aparezca `Gasto guardado`. | La descripción es `$12.500,00 · Comida · Visa BBVA` y el formulario vuelve al paso 1. |
| 21 | Filtrar Network por `create_transaction`. | Hay exactamente un `POST /rest/v1/rpc/create_transaction`; su respuesta es HTTP 200. |

**Post-condición:** Una transacción; dejar Network en `No throttling` y desactivar `Preserve log`.

### CP-NAV-062 — El primer gasto guiado conserva los datos y ofrece Reintentar

| Campo | Contenido |
|---|---|
| ID | CP-NAV-062 |
| Trazabilidad | US-70 · CA-29 · US-68 · NFR-09 |
| Invariante | — |
| Técnica | Casos de uso |
| Tipo | Negativo |
| Canal | UI |
| Caso par | No aplicable: H-NAV-01 |
| Pre-requisitos | PR-01 con `qa+cp-nav-062-001@example.com`; PR-02; NAV-PREP-01; cerrar sesión. |
| Datos de prueba | Gasto ARS `12500`; categoría `Comida`; cuenta `Visa BBVA`; fecha `06/10/2026`; nota `Almuerzo`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-062-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-062-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Hacer click en el botón con `aria-label="Ajustes"`. | Se abre `/settings`. |
| 9 | Hacer click en `Volver a hacer la configuración inicial`. | Se abre `/setup` en el paso 1 de 4. |
| 10 | Hacer click en `Saltear`. | Se abre el paso 2 de 4 con las categorías. |
| 11 | Hacer click en `Saltear`. | Se abre el paso 3 de 4 `Tus cuentas`. |
| 12 | Hacer click en `Saltear`. | Se abre el paso 4 de 4 `Registrá tu primer gasto` y el formulario muestra `¿Cuánto?`. |
| 13 | Escribir `12500` en el campo de monto. | El monto muestra `12500`. |
| 14 | Hacer click en `Siguiente`. | Se abre el paso 2/3. |
| 15 | Hacer click en `Comida`. | Se abre el paso 3/3. |
| 16 | Hacer click en `Visa BBVA`. | `Visa BBVA` queda seleccionada. |
| 17 | Hacer click en `Otra` dentro de `Fecha`. | Se habilita el campo de fecha. |
| 18 | Escribir `06/10/2026` en el campo de fecha. | La fecha muestra `06/10/2026`. |
| 19 | Escribir `Almuerzo` en `Nota (opcional)`. | La nota muestra `Almuerzo`. |
| 20 | Presionar F12. | DevTools se abre en `Network` y se ve la lista de solicitudes. |
| 21 | Elegir `Offline` en el selector de throttling. | El selector muestra `Offline`. |
| 22 | Hacer click en `Guardar gasto`. | Se ve `No se pudo guardar`, el texto de conexión y el botón `Reintentar`. |
| 23 | Leer el formulario del primer gasto guiado. | Permanece en el paso 3/3; conserva monto `$12.500,00`, categoría `Comida`, cuenta `Visa BBVA`, fecha `06/10/2026` y nota `Almuerzo`; el aviso tiene `data-kind="network"` y el botón dice `Reintentar`. |

**Post-condición:** Dejar Network en `No throttling`; un pendiente y ninguna transacción; setup sin finalizar.

### CP-NAV-063 — Los testids de Resumen son únicos a 375 px

| Campo | Contenido |
|---|---|
| ID | CP-NAV-063 |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-063-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport `375 × 812`; ruta `/dashboard?period=2026-08`. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-063-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-063-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Presionar F12. | Se abre DevTools. |
| 9 | Hacer click en `Toggle device toolbar`. | Se activa la emulación adaptable. |
| 10 | Escribir `375` en el campo de ancho. | El ancho del viewport indica exactamente `375`. |
| 11 | Escribir `812` en el campo de alto. | El alto del viewport indica exactamente `812`. |
| 12 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 13 | Escribir `<APP>/dashboard?period=2026-08`. | La barra muestra exactamente `<APP>/dashboard?period=2026-08`. |
| 14 | Presionar Enter. | Se abre `/dashboard?period=2026-08`. |
| 15 | Ejecutar en Console `["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="dashboard-nav-'+d+'"]').length)`. | La consola devuelve exactamente `[1, 1, 1, 1, 1]`; los cinco testids aparecen una vez y ninguno está duplicado. |

**Post-condición:** Sin datos modificados.

### CP-NAV-064 — Los testids de Movimientos son únicos a 375 px

| Campo | Contenido |
|---|---|
| ID | CP-NAV-064 |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-064-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport `375 × 812`; ruta `/transactions?period=2026-08`. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-064-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-064-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Presionar F12. | Se abre DevTools. |
| 9 | Hacer click en `Toggle device toolbar`. | Se activa la emulación adaptable. |
| 10 | Escribir `375` en el campo de ancho. | El ancho del viewport indica exactamente `375`. |
| 11 | Escribir `812` en el campo de alto. | El alto del viewport indica exactamente `812`. |
| 12 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 13 | Escribir `<APP>/transactions?period=2026-08`. | La barra muestra exactamente `<APP>/transactions?period=2026-08`. |
| 14 | Presionar Enter. | Se abre `/transactions?period=2026-08`. |
| 15 | Ejecutar en Console `["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="transactions-nav-'+d+'"]').length)`. | La consola devuelve exactamente `[1, 1, 1, 1, 1]`; los cinco testids aparecen una vez y ninguno está duplicado. |

**Post-condición:** Sin datos modificados.

### CP-NAV-065 — Los testids de Deudas son únicos a 375 px

| Campo | Contenido |
|---|---|
| ID | CP-NAV-065 |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-065-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport `375 × 812`; ruta `/debts`. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-065-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-065-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Presionar F12. | Se abre DevTools. |
| 9 | Hacer click en `Toggle device toolbar`. | Se activa la emulación adaptable. |
| 10 | Escribir `375` en el campo de ancho. | El ancho del viewport indica exactamente `375`. |
| 11 | Escribir `812` en el campo de alto. | El alto del viewport indica exactamente `812`. |
| 12 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 13 | Escribir `<APP>/debts`. | La barra muestra exactamente `<APP>/debts`. |
| 14 | Presionar Enter. | Se abre `/debts`. |
| 15 | Ejecutar en Console `["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="debts-nav-'+d+'"]').length)`. | La consola devuelve exactamente `[1, 1, 1, 1, 1]`; los cinco testids aparecen una vez y ninguno está duplicado. |

**Post-condición:** Sin datos modificados.

### CP-NAV-066 — Los testids de Suscripciones son únicos a 375 px

| Campo | Contenido |
|---|---|
| ID | CP-NAV-066 |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-066-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport `375 × 812`; ruta `/subscriptions`. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-066-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-066-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Presionar F12. | Se abre DevTools. |
| 9 | Hacer click en `Toggle device toolbar`. | Se activa la emulación adaptable. |
| 10 | Escribir `375` en el campo de ancho. | El ancho del viewport indica exactamente `375`. |
| 11 | Escribir `812` en el campo de alto. | El alto del viewport indica exactamente `812`. |
| 12 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 13 | Escribir `<APP>/subscriptions`. | La barra muestra exactamente `<APP>/subscriptions`. |
| 14 | Presionar Enter. | Se abre `/subscriptions`. |
| 15 | Ejecutar en Console `["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="subscriptions-nav-'+d+'"]').length)`. | La consola devuelve exactamente `[1, 1, 1, 1, 1]`; los cinco testids aparecen una vez y ninguno está duplicado. |

**Post-condición:** Sin datos modificados.

### CP-NAV-067 — Los testids de Ajustes son únicos a 375 px

| Campo | Contenido |
|---|---|
| ID | CP-NAV-067 |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-067-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport `375 × 812`; ruta `/settings`. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-067-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-067-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Presionar F12. | Se abre DevTools. |
| 9 | Hacer click en `Toggle device toolbar`. | Se activa la emulación adaptable. |
| 10 | Escribir `375` en el campo de ancho. | El ancho del viewport indica exactamente `375`. |
| 11 | Escribir `812` en el campo de alto. | El alto del viewport indica exactamente `812`. |
| 12 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 13 | Escribir `<APP>/settings`. | La barra muestra exactamente `<APP>/settings`. |
| 14 | Presionar Enter. | Se abre `/settings`. |
| 15 | Ejecutar en Console `["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="settings-nav-'+d+'"]').length)`. | La consola devuelve exactamente `[1, 1, 1, 1, 1]`; los cinco testids aparecen una vez y ninguno está duplicado. |

**Post-condición:** Sin datos modificados.

### CP-NAV-068 — Los testids de Resumen son únicos a 1023 px

| Campo | Contenido |
|---|---|
| ID | CP-NAV-068 |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-068-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport `1023 × 812`; ruta `/dashboard?period=2026-08`. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-068-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-068-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Presionar F12. | Se abre DevTools. |
| 9 | Hacer click en `Toggle device toolbar`. | Se activa la emulación adaptable. |
| 10 | Escribir `1023` en el campo de ancho. | El ancho del viewport indica exactamente `1023`. |
| 11 | Escribir `812` en el campo de alto. | El alto del viewport indica exactamente `812`. |
| 12 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 13 | Escribir `<APP>/dashboard?period=2026-08`. | La barra muestra exactamente `<APP>/dashboard?period=2026-08`. |
| 14 | Presionar Enter. | Se abre `/dashboard?period=2026-08`. |
| 15 | Ejecutar en Console `["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="dashboard-nav-'+d+'"]').length)`. | La consola devuelve exactamente `[1, 1, 1, 1, 1]`; los cinco testids aparecen una vez y ninguno está duplicado. |

**Post-condición:** Sin datos modificados.

### CP-NAV-069 — Los testids de Movimientos son únicos a 1023 px

| Campo | Contenido |
|---|---|
| ID | CP-NAV-069 |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-069-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport `1023 × 812`; ruta `/transactions?period=2026-08`. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-069-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-069-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Presionar F12. | Se abre DevTools. |
| 9 | Hacer click en `Toggle device toolbar`. | Se activa la emulación adaptable. |
| 10 | Escribir `1023` en el campo de ancho. | El ancho del viewport indica exactamente `1023`. |
| 11 | Escribir `812` en el campo de alto. | El alto del viewport indica exactamente `812`. |
| 12 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 13 | Escribir `<APP>/transactions?period=2026-08`. | La barra muestra exactamente `<APP>/transactions?period=2026-08`. |
| 14 | Presionar Enter. | Se abre `/transactions?period=2026-08`. |
| 15 | Ejecutar en Console `["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="transactions-nav-'+d+'"]').length)`. | La consola devuelve exactamente `[1, 1, 1, 1, 1]`; los cinco testids aparecen una vez y ninguno está duplicado. |

**Post-condición:** Sin datos modificados.

### CP-NAV-070 — Los testids de Deudas son únicos a 1023 px

| Campo | Contenido |
|---|---|
| ID | CP-NAV-070 |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-070-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport `1023 × 812`; ruta `/debts`. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-070-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-070-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Presionar F12. | Se abre DevTools. |
| 9 | Hacer click en `Toggle device toolbar`. | Se activa la emulación adaptable. |
| 10 | Escribir `1023` en el campo de ancho. | El ancho del viewport indica exactamente `1023`. |
| 11 | Escribir `812` en el campo de alto. | El alto del viewport indica exactamente `812`. |
| 12 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 13 | Escribir `<APP>/debts`. | La barra muestra exactamente `<APP>/debts`. |
| 14 | Presionar Enter. | Se abre `/debts`. |
| 15 | Ejecutar en Console `["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="debts-nav-'+d+'"]').length)`. | La consola devuelve exactamente `[1, 1, 1, 1, 1]`; los cinco testids aparecen una vez y ninguno está duplicado. |

**Post-condición:** Sin datos modificados.

### CP-NAV-071 — Los testids de Suscripciones son únicos a 1023 px

| Campo | Contenido |
|---|---|
| ID | CP-NAV-071 |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-071-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport `1023 × 812`; ruta `/subscriptions`. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-071-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-071-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Presionar F12. | Se abre DevTools. |
| 9 | Hacer click en `Toggle device toolbar`. | Se activa la emulación adaptable. |
| 10 | Escribir `1023` en el campo de ancho. | El ancho del viewport indica exactamente `1023`. |
| 11 | Escribir `812` en el campo de alto. | El alto del viewport indica exactamente `812`. |
| 12 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 13 | Escribir `<APP>/subscriptions`. | La barra muestra exactamente `<APP>/subscriptions`. |
| 14 | Presionar Enter. | Se abre `/subscriptions`. |
| 15 | Ejecutar en Console `["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="subscriptions-nav-'+d+'"]').length)`. | La consola devuelve exactamente `[1, 1, 1, 1, 1]`; los cinco testids aparecen una vez y ninguno está duplicado. |

**Post-condición:** Sin datos modificados.

### CP-NAV-072 — Los testids de Ajustes son únicos a 1023 px

| Campo | Contenido |
|---|---|
| ID | CP-NAV-072 |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-072-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport `1023 × 812`; ruta `/settings`. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-072-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-072-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Presionar F12. | Se abre DevTools. |
| 9 | Hacer click en `Toggle device toolbar`. | Se activa la emulación adaptable. |
| 10 | Escribir `1023` en el campo de ancho. | El ancho del viewport indica exactamente `1023`. |
| 11 | Escribir `812` en el campo de alto. | El alto del viewport indica exactamente `812`. |
| 12 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 13 | Escribir `<APP>/settings`. | La barra muestra exactamente `<APP>/settings`. |
| 14 | Presionar Enter. | Se abre `/settings`. |
| 15 | Ejecutar en Console `["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="settings-nav-'+d+'"]').length)`. | La consola devuelve exactamente `[1, 1, 1, 1, 1]`; los cinco testids aparecen una vez y ninguno está duplicado. |

**Post-condición:** Sin datos modificados.

### CP-NAV-073 — Los testids de Resumen son únicos a 1024 px

| Campo | Contenido |
|---|---|
| ID | CP-NAV-073 |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-073-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport `1024 × 812`; ruta `/dashboard?period=2026-08`. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-073-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-073-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Presionar F12. | Se abre DevTools. |
| 9 | Hacer click en `Toggle device toolbar`. | Se activa la emulación adaptable. |
| 10 | Escribir `1024` en el campo de ancho. | El ancho del viewport indica exactamente `1024`. |
| 11 | Escribir `812` en el campo de alto. | El alto del viewport indica exactamente `812`. |
| 12 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 13 | Escribir `<APP>/dashboard?period=2026-08`. | La barra muestra exactamente `<APP>/dashboard?period=2026-08`. |
| 14 | Presionar Enter. | Se abre `/dashboard?period=2026-08`. |
| 15 | Ejecutar en Console `["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="dashboard-nav-'+d+'"]').length)`. | La consola devuelve exactamente `[1, 1, 1, 1, 1]`; los cinco testids aparecen una vez y ninguno está duplicado. |

**Post-condición:** Sin datos modificados.

### CP-NAV-074 — Los testids de Movimientos son únicos a 1024 px

| Campo | Contenido |
|---|---|
| ID | CP-NAV-074 |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-074-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport `1024 × 812`; ruta `/transactions?period=2026-08`. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-074-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-074-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Presionar F12. | Se abre DevTools. |
| 9 | Hacer click en `Toggle device toolbar`. | Se activa la emulación adaptable. |
| 10 | Escribir `1024` en el campo de ancho. | El ancho del viewport indica exactamente `1024`. |
| 11 | Escribir `812` en el campo de alto. | El alto del viewport indica exactamente `812`. |
| 12 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 13 | Escribir `<APP>/transactions?period=2026-08`. | La barra muestra exactamente `<APP>/transactions?period=2026-08`. |
| 14 | Presionar Enter. | Se abre `/transactions?period=2026-08`. |
| 15 | Ejecutar en Console `["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="transactions-nav-'+d+'"]').length)`. | La consola devuelve exactamente `[1, 1, 1, 1, 1]`; los cinco testids aparecen una vez y ninguno está duplicado. |

**Post-condición:** Sin datos modificados.

### CP-NAV-075 — Los testids de Deudas son únicos a 1024 px

| Campo | Contenido |
|---|---|
| ID | CP-NAV-075 |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-075-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport `1024 × 812`; ruta `/debts`. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-075-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-075-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Presionar F12. | Se abre DevTools. |
| 9 | Hacer click en `Toggle device toolbar`. | Se activa la emulación adaptable. |
| 10 | Escribir `1024` en el campo de ancho. | El ancho del viewport indica exactamente `1024`. |
| 11 | Escribir `812` en el campo de alto. | El alto del viewport indica exactamente `812`. |
| 12 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 13 | Escribir `<APP>/debts`. | La barra muestra exactamente `<APP>/debts`. |
| 14 | Presionar Enter. | Se abre `/debts`. |
| 15 | Ejecutar en Console `["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="debts-nav-'+d+'"]').length)`. | La consola devuelve exactamente `[1, 1, 1, 1, 1]`; los cinco testids aparecen una vez y ninguno está duplicado. |

**Post-condición:** Sin datos modificados.

### CP-NAV-076 — Los testids de Suscripciones son únicos a 1024 px

| Campo | Contenido |
|---|---|
| ID | CP-NAV-076 |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-076-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport `1024 × 812`; ruta `/subscriptions`. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-076-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-076-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Presionar F12. | Se abre DevTools. |
| 9 | Hacer click en `Toggle device toolbar`. | Se activa la emulación adaptable. |
| 10 | Escribir `1024` en el campo de ancho. | El ancho del viewport indica exactamente `1024`. |
| 11 | Escribir `812` en el campo de alto. | El alto del viewport indica exactamente `812`. |
| 12 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 13 | Escribir `<APP>/subscriptions`. | La barra muestra exactamente `<APP>/subscriptions`. |
| 14 | Presionar Enter. | Se abre `/subscriptions`. |
| 15 | Ejecutar en Console `["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="subscriptions-nav-'+d+'"]').length)`. | La consola devuelve exactamente `[1, 1, 1, 1, 1]`; los cinco testids aparecen una vez y ninguno está duplicado. |

**Post-condición:** Sin datos modificados.

### CP-NAV-077 — Los testids de Ajustes son únicos a 1024 px

| Campo | Contenido |
|---|---|
| ID | CP-NAV-077 |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-077-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport `1024 × 812`; ruta `/settings`. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-077-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-077-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Presionar F12. | Se abre DevTools. |
| 9 | Hacer click en `Toggle device toolbar`. | Se activa la emulación adaptable. |
| 10 | Escribir `1024` en el campo de ancho. | El ancho del viewport indica exactamente `1024`. |
| 11 | Escribir `812` en el campo de alto. | El alto del viewport indica exactamente `812`. |
| 12 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 13 | Escribir `<APP>/settings`. | La barra muestra exactamente `<APP>/settings`. |
| 14 | Presionar Enter. | Se abre `/settings`. |
| 15 | Ejecutar en Console `["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="settings-nav-'+d+'"]').length)`. | La consola devuelve exactamente `[1, 1, 1, 1, 1]`; los cinco testids aparecen una vez y ninguno está duplicado. |

**Post-condición:** Sin datos modificados.

### CP-NAV-078 — Los testids de Resumen son únicos a 1280 px

| Campo | Contenido |
|---|---|
| ID | CP-NAV-078 |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-078-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport `1280 × 812`; ruta `/dashboard?period=2026-08`. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-078-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-078-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Presionar F12. | Se abre DevTools. |
| 9 | Hacer click en `Toggle device toolbar`. | Se activa la emulación adaptable. |
| 10 | Escribir `1280` en el campo de ancho. | El ancho del viewport indica exactamente `1280`. |
| 11 | Escribir `812` en el campo de alto. | El alto del viewport indica exactamente `812`. |
| 12 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 13 | Escribir `<APP>/dashboard?period=2026-08`. | La barra muestra exactamente `<APP>/dashboard?period=2026-08`. |
| 14 | Presionar Enter. | Se abre `/dashboard?period=2026-08`. |
| 15 | Ejecutar en Console `["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="dashboard-nav-'+d+'"]').length)`. | La consola devuelve exactamente `[1, 1, 1, 1, 1]`; los cinco testids aparecen una vez y ninguno está duplicado. |

**Post-condición:** Sin datos modificados.

### CP-NAV-079 — Los testids de Movimientos son únicos a 1280 px

| Campo | Contenido |
|---|---|
| ID | CP-NAV-079 |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-079-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport `1280 × 812`; ruta `/transactions?period=2026-08`. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-079-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-079-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Presionar F12. | Se abre DevTools. |
| 9 | Hacer click en `Toggle device toolbar`. | Se activa la emulación adaptable. |
| 10 | Escribir `1280` en el campo de ancho. | El ancho del viewport indica exactamente `1280`. |
| 11 | Escribir `812` en el campo de alto. | El alto del viewport indica exactamente `812`. |
| 12 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 13 | Escribir `<APP>/transactions?period=2026-08`. | La barra muestra exactamente `<APP>/transactions?period=2026-08`. |
| 14 | Presionar Enter. | Se abre `/transactions?period=2026-08`. |
| 15 | Ejecutar en Console `["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="transactions-nav-'+d+'"]').length)`. | La consola devuelve exactamente `[1, 1, 1, 1, 1]`; los cinco testids aparecen una vez y ninguno está duplicado. |

**Post-condición:** Sin datos modificados.

### CP-NAV-080 — Los testids de Deudas son únicos a 1280 px

| Campo | Contenido |
|---|---|
| ID | CP-NAV-080 |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-080-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport `1280 × 812`; ruta `/debts`. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-080-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-080-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Presionar F12. | Se abre DevTools. |
| 9 | Hacer click en `Toggle device toolbar`. | Se activa la emulación adaptable. |
| 10 | Escribir `1280` en el campo de ancho. | El ancho del viewport indica exactamente `1280`. |
| 11 | Escribir `812` en el campo de alto. | El alto del viewport indica exactamente `812`. |
| 12 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 13 | Escribir `<APP>/debts`. | La barra muestra exactamente `<APP>/debts`. |
| 14 | Presionar Enter. | Se abre `/debts`. |
| 15 | Ejecutar en Console `["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="debts-nav-'+d+'"]').length)`. | La consola devuelve exactamente `[1, 1, 1, 1, 1]`; los cinco testids aparecen una vez y ninguno está duplicado. |

**Post-condición:** Sin datos modificados.

### CP-NAV-081 — Los testids de Suscripciones son únicos a 1280 px

| Campo | Contenido |
|---|---|
| ID | CP-NAV-081 |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-081-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport `1280 × 812`; ruta `/subscriptions`. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-081-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-081-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Presionar F12. | Se abre DevTools. |
| 9 | Hacer click en `Toggle device toolbar`. | Se activa la emulación adaptable. |
| 10 | Escribir `1280` en el campo de ancho. | El ancho del viewport indica exactamente `1280`. |
| 11 | Escribir `812` en el campo de alto. | El alto del viewport indica exactamente `812`. |
| 12 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 13 | Escribir `<APP>/subscriptions`. | La barra muestra exactamente `<APP>/subscriptions`. |
| 14 | Presionar Enter. | Se abre `/subscriptions`. |
| 15 | Ejecutar en Console `["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="subscriptions-nav-'+d+'"]').length)`. | La consola devuelve exactamente `[1, 1, 1, 1, 1]`; los cinco testids aparecen una vez y ninguno está duplicado. |

**Post-condición:** Sin datos modificados.

### CP-NAV-082 — Los testids de Ajustes son únicos a 1280 px

| Campo | Contenido |
|---|---|
| ID | CP-NAV-082 |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-082-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport `1280 × 812`; ruta `/settings`. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-082-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-082-001@example.com`. |
| 6 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 7 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1/3. |
| 8 | Presionar F12. | Se abre DevTools. |
| 9 | Hacer click en `Toggle device toolbar`. | Se activa la emulación adaptable. |
| 10 | Escribir `1280` en el campo de ancho. | El ancho del viewport indica exactamente `1280`. |
| 11 | Escribir `812` en el campo de alto. | El alto del viewport indica exactamente `812`. |
| 12 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 13 | Escribir `<APP>/settings`. | La barra muestra exactamente `<APP>/settings`. |
| 14 | Presionar Enter. | Se abre `/settings`. |
| 15 | Ejecutar en Console `["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="settings-nav-'+d+'"]').length)`. | La consola devuelve exactamente `[1, 1, 1, 1, 1]`; los cinco testids aparecen una vez y ninguno está duplicado. |

**Post-condición:** Sin datos modificados.


### CP-NAV-083 — La API devuelve una sola transacción activa para la clave recuperada

| Campo | Contenido |
|---|---|
| ID | CP-NAV-083 |
| Trazabilidad | US-70 · CA-20 · I18 |
| Invariante | I18 |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | API |
| Caso par | CP-NAV-053 |
| Pre-requisitos | PR-01 con `qa+cp-nav-083-001@example.com`; PR-02; NAV-PREP-01; PR-04. |
| Datos de prueba | Body `{"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Comida>","p_account_id":"<uuid Visa BBVA>","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"83000000-0000-4000-8000-000000000083"}`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con headers de PR-04 y el body de Datos. | HTTP 200 y UUID `<ID-1>`. |
| 2 | Ejecutar `GET <SUPABASE_URL>/rest/v1/transactions?select=id,amount_text:amount::text,request_id,deleted_at&request_id=eq.83000000-0000-4000-8000-000000000083` con headers de PR-04. | HTTP 200; exactamente una fila con `id:"<ID-1>"`, `amount_text:"12500.00"`, la clave indicada y `deleted_at:null`. |
| 3 | Ejecutar `GET <SUPABASE_URL>/rest/v1/ledger_entries?select=transaction_id,installment_number,amount_text:amount::text&transaction_id=eq.<ID-1>` con headers de PR-04. | HTTP 200; exactamente una fila con `transaction_id:"<ID-1>"`, `installment_number:1` y `amount_text:"12500.00"`. |

**Post-condición:** Una transacción activa y una imputación.

### CP-NAV-084 — La API conserva una sola transacción eliminada para la clave recuperada

| Campo | Contenido |
|---|---|
| ID | CP-NAV-084 |
| Trazabilidad | US-70 · CA-21 · I10 · I18 |
| Invariante | I10 · I18 |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | API |
| Caso par | CP-NAV-054 |
| Pre-requisitos | PR-01 con `qa+cp-nav-084-001@example.com`; PR-02; NAV-PREP-01; PR-04. |
| Datos de prueba | Body `{"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Comida>","p_account_id":"<uuid Visa BBVA>","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"84000000-0000-4000-8000-000000000084"}`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con headers de PR-04 y el body de Datos. | HTTP 200 y UUID `<ID-1>`. |
| 2 | Ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/delete_transaction` con headers de PR-04 y body `{"p_transaction_id":"<ID-1>"}`. | HTTP 200 y cuerpo JSON `null`. |
| 3 | Ejecutar `GET <SUPABASE_URL>/rest/v1/transactions?select=id,amount_text:amount::text,request_id,deleted_at&request_id=eq.84000000-0000-4000-8000-000000000084` con headers de PR-04. | HTTP 200; exactamente una fila con `id:"<ID-1>"`, `amount_text:"12500.00"`, la clave indicada y `deleted_at` no nulo. |
| 4 | Ejecutar `GET <SUPABASE_URL>/rest/v1/ledger_entries?select=transaction_id,installment_number,amount_text:amount::text&transaction_id=eq.<ID-1>` con headers de PR-04. | HTTP 200; exactamente una imputación histórica con `transaction_id:"<ID-1>"`, `installment_number:1` y `amount_text:"12500.00"`; I10 la excluye de cálculos porque su transacción tiene `deleted_at` no nulo. |

**Post-condición:** Una transacción eliminada y una imputación histórica excluida de los cálculos.

### CP-NAV-085 — La API confirma la clave del pendiente reintentado por UI

| Campo | Contenido |
|---|---|
| ID | CP-NAV-085 |
| Trazabilidad | US-70 · CA-5 · NFR-10 · ADR-034 |
| Invariante | I18 |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | API |
| Caso par | CP-NAV-034 |
| Pre-requisitos | PR-01 con `qa+cp-nav-085-001@example.com`; PR-02; NAV-PREP-01; ejecutar NAV-PREP-02 completo; conservar `<TOKEN>`, `<ANON_KEY>` y `<SUPABASE_URL>` obtenidos en su paso 21. |
| Datos de prueba | Clave del pendiente UI `85000000-0000-4000-8000-000000000085`; monto `12500.00`; fecha `2026-10-06`; nota `Almuerzo`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar `GET <SUPABASE_URL>/rest/v1/transactions?select=id,amount_text:amount::text,request_id,deleted_at&request_id=eq.85000000-0000-4000-8000-000000000085` con headers de PR-04. | HTTP 200; exactamente una fila con `id:"<ID-1>"`, `amount_text:"12500.00"`, `request_id:"85000000-0000-4000-8000-000000000085"` y `deleted_at:null`. |
| 2 | Ejecutar `GET <SUPABASE_URL>/rest/v1/ledger_entries?select=transaction_id,installment_number,amount_text:amount::text&transaction_id=eq.<ID-1>` con headers de PR-04. | HTTP 200; exactamente una fila con `transaction_id:"<ID-1>"`, `installment_number:1` y `amount_text:"12500.00"`. |

**Post-condición:** Una transacción activa y una imputación; no quedan pendientes en la UI.


## Historias o criterios sin caso

- US-69: sin huecos de cobertura declarativa; CA-1 a CA-13 tienen al menos un caso.
- US-70: CA-1 a CA-25 y CA-27 a CA-29, incluidos CA-6b y CA-6c, tienen al menos un caso ejecutable; CA-26 conserva el hueco exacto H-NAV-02 y una variante equivalente en CP-NAV-059.
- US-71: no es una historia de V2. La conducta está cubierta por US-65 y CP-REG-013 de V1.
- **H-NAV-01 — Sin par API para un fallo de transporte local.** CP-NAV-032, CP-NAV-033, CP-NAV-037, CP-NAV-055 y CP-NAV-062 son negativos de UI provocados al dejar al navegador sin red. No existe una llamada directa a la API que pueda devolver método, status HTTP y `code`: al cortar el transporte no hay respuesta HTTP. La idempotencia de la RPC que protege esos reintentos sí queda cubierta por CP-NAV-039, CP-NAV-040 y CP-NAV-041. El PO debe decidir si acepta esta excepción documentada a la regla general de pares C6.
- **H-NAV-02 — Fecha exacta de recuperación de CA-26 no reproducible.** US-70 · CA-26 exige guardar el pendiente exactamente el `06/10/2026`, pero la aplicación y la RPC no exponen reloj inyectable y esa fecha ya pasó. CP-NAV-059 verifica la partición mensual equivalente al guardar durante octubre de 2026, pero no prueba el día exacto. Se necesita un ambiente con reloj controlable o un harness de V3 para cerrar el criterio literal.
- El bloqueo de `localStorage` y el vencimiento espontáneo de sesión no tienen criterio manual en US-70; la propia historia difiere el primero a un test de componente de V3 y declara que el segundo no se puede provocar manualmente de forma confiable.
- El corte físico de la respuesta después del commit no se puede reproducir de forma determinista solo con Chrome DevTools. CP-NAV-039 usa el equivalente controlado exigido por CA-8: mismo `request_id`, creación directa por API y reintento por UI.

## Impacto en la regresión de V1

US-69 invalida el paso que toca `Movimientos` en la barra. Antes de ejecutar la regresión, cambiar el paso 1 de **CP-REG-013** por:

1. Hacer click en `Resumen`.
2. Hacer click en `Ver todos` dentro de `Últimos movimientos`; si el mes está vacío, hacer click en `Ver movimientos`.

El mismo ajuste de navegación aplica a CP-ACC-009, CP-CFG-004, CP-REG-004, CP-REG-012, CP-CUO-008, CP-CUO-009 y CP-MON-004. Este archivo documenta el impacto; no modifica los casos de V1.

## Ambigüedades para el PO

1. US-70 · CA-7 exige un throttling personalizado de `20.000 ms`, pero no fija la herramienta ni el resto de parámetros del perfil. CP-NAV-038 usa Chrome DevTools, latencia `20.000 ms`, descarga y subida `1000 kb/s`, sin pérdida de paquetes.
2. US-70 · CA-27 requiere VoiceOver o TalkBack. CP-NAV-060 fija un Pixel 7 con Android 15 y TalkBack en español; confirmar si ese dispositivo estará disponible para la ejecución manual.
3. US-69 · CA-4 pide un área táctil mínima de `44 × 44 px` sin aclarar si se mide la caja CSS o el área física. CP-NAV-014 mide `getBoundingClientRect()` en CSS px.
4. Los ejemplos de US-70 usan `Comida` y `Tecnología`, mientras PR-01 crea `Comida y supermercado`. NAV-PREP-01 normaliza los nombres sin inventar datos funcionales.
5. US-70 · CA-26 fija la recuperación y el guardado al `06/10/2026`, pero no define un mecanismo de reloj controlable. CP-NAV-059 usa la variante mensual equivalente; el PO debe decidir si provee un ambiente con reloj inyectable o acepta diferir el literal a V3.

## Resumen cuantitativo

| Dimensión | Cantidad |
|---|---:|
| Total | 85 |
| Positivos | 59 |
| Negativos | 7 |
| Límite | 19 |
| UI | 74 |
| API | 11 |
| Prioridad Alta | 34 |
| Prioridad Media | 51 |
| Prioridad Baja | 0 |
| Automatizable Sí | 83 |
| Automatizable No | 1 |
| Automatizable V3 | 1 |
