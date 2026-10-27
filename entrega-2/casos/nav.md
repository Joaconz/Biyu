# Casos de prueba V2 — Navegación e interfaz (NAV)

> **Recorte y renumeración del 2026-10-27.** Los IDs son consecutivos desde 001; la tabla de equivalencia con los IDs anteriores está en [`equivalencia-ids.md`](../equivalencia-ids.md). El catálogo de Navegación pasó de 85 a 25 casos: se quitaron los 23 casos de testids únicos por pantalla y ancho, los estados activos uno por uno y las variantes de reintento que repetían la misma regla. Los criterios que quedaron sin caso figuran como «sin caso» en la matriz de cobertura.

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

Para CP-NAV-017, reemplazar los marcadores y ejecutar este bloque completo en PowerShell 7. Los dos jobs se crean antes de abrir la barrera; no hay clicks manuales separados.

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

## Matriz de cobertura

| Historia · criterio | Casos |
|---|---|
| US-69 · CA-1 | CP-NAV-001 |
| US-69 · CA-2 | CP-NAV-002 |
| US-69 · CA-3 | CP-NAV-003, CP-NAV-004 |
| US-69 · CA-4 | — (sin caso tras el recorte del 2026-10-27) |
| US-69 · CA-5 | CP-NAV-005, CP-NAV-006 |
| US-69 · CA-6 | CP-NAV-007 |
| US-69 · CA-7 | CP-NAV-008 |
| US-69 · CA-8 | — (sin caso tras el recorte del 2026-10-27) |
| US-69 · CA-9 | CP-NAV-009 |
| US-69 · CA-10 | — (sin caso tras el recorte del 2026-10-27) |
| US-69 · CA-11 | CP-NAV-010 |
| US-69 · CA-12 | — (sin caso tras el recorte del 2026-10-27) |
| US-69 · CA-13 | — (sin caso tras el recorte del 2026-10-27) |
| US-70 · CA-1 | CP-NAV-011 |
| US-70 · CA-2 | — (sin caso tras el recorte del 2026-10-27) |
| US-70 · CA-3 | CP-NAV-012 |
| US-70 · CA-4 | — (sin caso tras el recorte del 2026-10-27) |
| US-70 · CA-5 | CP-NAV-013 |
| US-70 · CA-6 | — (sin caso tras el recorte del 2026-10-27) |
| US-70 · CA-6b | — (sin caso tras el recorte del 2026-10-27) |
| US-70 · CA-6c | — (sin caso tras el recorte del 2026-10-27) |
| US-70 · CA-7 | CP-NAV-014 |
| US-70 · CA-8 | CP-NAV-015 |
| US-70 · CA-9 | CP-NAV-016 |
| US-70 · CA-10 | CP-NAV-017 |
| US-70 · CA-11 | — (sin caso tras el recorte del 2026-10-27) |
| US-70 · CA-12 | CP-NAV-018 |
| US-70 · CA-13 | — (sin caso tras el recorte del 2026-10-27) |
| US-70 · CA-14 | — (sin caso tras el recorte del 2026-10-27) |
| US-70 · CA-15 | — (sin caso tras el recorte del 2026-10-27) |
| US-70 · CA-16 | CP-NAV-019, CP-NAV-020 |
| US-70 · CA-17 | CP-NAV-021 |
| US-70 · CA-18 | — (sin caso tras el recorte del 2026-10-27) |
| US-70 · CA-19 | — (sin caso tras el recorte del 2026-10-27) |
| US-70 · CA-20 | CP-NAV-022 |
| US-70 · CA-21 | — (sin caso tras el recorte del 2026-10-27) |
| US-70 · CA-22 | — (sin caso tras el recorte del 2026-10-27) |
| US-70 · CA-23 | CP-NAV-023 |
| US-70 · CA-24 | CP-NAV-024 |
| US-70 · CA-25 | — (sin caso tras el recorte del 2026-10-27) |
| US-70 · CA-26 | — (sin caso tras el recorte del 2026-10-27) |
| US-70 · CA-27 | — (sin caso tras el recorte del 2026-10-27) |
| US-70 · CA-28 | CP-NAV-025 |
| US-70 · CA-29 | — (sin caso tras el recorte del 2026-10-27) |

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

### CP-NAV-002 — Deudas abre /debts desde Registrar

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
| 8 | Hacer click en `Deudas` en la barra. | La URL termina exactamente en `/debts` y se ve `Deudas`. |

**Post-condición:** Sin datos modificados.

### CP-NAV-003 — Resumen queda activo en /dashboard

| Campo | Contenido |
|---|---|
| ID | CP-NAV-003 |
| Trazabilidad | US-69 · CA-3 · ADR-023 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
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
| 8 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 9 | Escribir `<APP>/dashboard?period=2026-08`. | La barra muestra exactamente `<APP>/dashboard?period=2026-08`. |
| 10 | Presionar Enter. | Se abre `/dashboard?period=2026-08`. |
| 11 | Ejecutar en Console `[...document.querySelectorAll('nav[aria-label="Principal"] a[data-testid^="dashboard-nav-"]')].map(a=>[a.textContent.trim(),a.getAttribute('aria-current')])`. | Devuelve exactamente `[["Registrar",null],["Resumen","page"],["Deudas",null],["Suscripciones",null],["",null]]`; `Resumen` se ve verde, en negrita y con punto dorado. |

**Post-condición:** Sin datos modificados.

### CP-NAV-004 — Ajustes no marca ninguna de las cuatro secciones

| Campo | Contenido |
|---|---|
| ID | CP-NAV-004 |
| Trazabilidad | US-69 · CA-3 · ADR-023 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
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
| 8 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 9 | Escribir `<APP>/settings`. | La barra muestra exactamente `<APP>/settings`. |
| 10 | Presionar Enter. | Se abre `Ajustes`. |
| 11 | Ejecutar en Console `[...document.querySelectorAll('nav[aria-label="Principal"] a[data-testid^="settings-nav-"]')].map(a=>[a.textContent.trim(),a.getAttribute('aria-current')])`. | Devuelve exactamente `[["Registrar",null],["Resumen",null],["Deudas",null],["Suscripciones",null],["","page"]]`; ningún ítem de sección está activo y el engranaje `Ajustes` está activo. |

**Post-condición:** Sin datos modificados.

### CP-NAV-005 — A 1023 px se usa barra inferior y engranaje

| Campo | Contenido |
|---|---|
| ID | CP-NAV-005 |
| Trazabilidad | US-69 · CA-5 · ADR-023 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
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
| 8 | Presionar F12. | Se abre DevTools. |
| 9 | Hacer click en `Toggle device toolbar`. | Se activa la emulación adaptable. |
| 10a | Escribir `1023` en el campo de ancho. | El campo de ancho muestra exactamente `1023`. |
| 10b | Escribir `812` en el campo de alto. | El campo de alto muestra exactamente `812`; el viewport indica `1023 × 812`. |
| 11 | Inspeccionar la navegación y el encabezado. | La navegación está fija abajo, no hay barra lateral y se ve el engranaje `Ajustes`. |

**Post-condición:** Sin datos modificados.

### CP-NAV-006 — A 1024 px se usa barra lateral con Ajustes al pie

| Campo | Contenido |
|---|---|
| ID | CP-NAV-006 |
| Trazabilidad | US-69 · CA-5 · ADR-023 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
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
| 8 | Presionar F12. | Se abre DevTools. |
| 9 | Hacer click en `Toggle device toolbar`. | Se activa la emulación adaptable. |
| 10a | Escribir `1024` en el campo de ancho. | El campo de ancho muestra exactamente `1024`. |
| 10b | Escribir `812` en el campo de alto. | El campo de alto muestra exactamente `812`; el viewport indica `1024 × 812`. |
| 11 | Inspeccionar la navegación. | Se ve una barra lateral de 240 px con los cuatro ítems y `Ajustes` al pie; no hay barra inferior ni engranaje. |

**Post-condición:** Sin datos modificados.

### CP-NAV-007 — Los testids de Registrar son únicos a 375 px

| Campo | Contenido |
|---|---|
| ID | CP-NAV-007 |
| Trazabilidad | US-69 · CA-6 · ADR-023 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-007-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Chrome; viewport `375 × 812`; ruta `/register`. |
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
| 8 | Presionar F12. | Se abre DevTools. |
| 9 | Hacer click en `Toggle device toolbar`. | Se activa la emulación adaptable. |
| 10a | Escribir `375` en el campo de ancho. | El campo de ancho muestra exactamente `375`. |
| 10b | Escribir `812` en el campo de alto. | El campo de alto muestra exactamente `812`; el viewport indica `375 × 812`. |
| 11 | Hacer click en la barra de direcciones. | La dirección actual queda seleccionada. |
| 12 | Escribir `<APP>/register`. | La barra muestra exactamente `<APP>/register`. |
| 13 | Presionar Enter. | Se abre `/register`. |
| 14 | Ejecutar en Console `["register","dashboard","debts","subscriptions","settings"].map(d=>document.querySelectorAll('[data-testid="register-nav-'+d+'"]').length)`. | La consola devuelve exactamente `[1, 1, 1, 1, 1]`; ningún testid está duplicado. |

**Post-condición:** Sin datos modificados.

### CP-NAV-008 — Ver todos y ‹ Resumen conservan agosto de 2026

| Campo | Contenido |
|---|---|
| ID | CP-NAV-008 |
| Trazabilidad | US-69 · CA-7 · C11 |
| Invariante | — |
| Técnica | Casos de uso |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-008-001@example.com`; PR-07 con monto `1200`, una cuota y fecha `15/08/2026`; cerrar sesión. |
| Datos de prueba | Período `2026-08`; gasto `$1.200,00`. |
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
| 9 | Escribir `<APP>/dashboard?period=2026-08`. | La barra muestra exactamente `<APP>/dashboard?period=2026-08`. |
| 10 | Presionar Enter. | Se abre Resumen de agosto y se ve el gasto. |
| 11 | Hacer click en `Ver todos`. | La URL queda exactamente `<APP>/transactions?period=2026-08`. |
| 12 | Hacer click en `‹ Resumen`. | La URL queda exactamente `<APP>/dashboard?period=2026-08`. |

**Post-condición:** El gasto permanece.

### CP-NAV-009 — Deudas descarta el período del Resumen

| Campo | Contenido |
|---|---|
| ID | CP-NAV-009 |
| Trazabilidad | US-69 · CA-9 · C11 |
| Invariante | — |
| Técnica | Particiones de equivalencia |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-009-001@example.com`; cerrar la sesión al terminar la preparación. |
| Datos de prueba | Origen `<APP>/dashboard?period=2026-08`. |
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
| 9 | Escribir `<APP>/dashboard?period=2026-08`. | La barra muestra exactamente `<APP>/dashboard?period=2026-08`. |
| 10 | Presionar Enter. | Se abre Resumen de agosto. |
| 11 | Hacer click en `Deudas`. | La URL queda exactamente `<APP>/debts`, sin `?period`. |

**Post-condición:** Sin datos modificados.

### CP-NAV-010 — Tocar Registrar en Registrar conserva el paso 3 y el borrador

| Campo | Contenido |
|---|---|
| ID | CP-NAV-010 |
| Trazabilidad | US-69 · CA-11 · ADR-024 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-010-001@example.com`; PR-02; NAV-PREP-01; cerrar sesión. |
| Datos de prueba | Gasto ARS `12500`; Comida; Visa BBVA; fecha `06/10/2026`; nota `Almuerzo`. |
| Prioridad | Alta |
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

### CP-NAV-011 — Guardar $12.500 muestra la confirmación completa

| Campo | Contenido |
|---|---|
| ID | CP-NAV-011 |
| Trazabilidad | US-70 · CA-1 · US-10 |
| Invariante | — |
| Técnica | Casos de uso |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-011-001@example.com`; PR-02; NAV-PREP-01; cerrar sesión. |
| Datos de prueba | Gasto ARS; monto `12500`; categoría `Comida`; cuenta `Visa BBVA`; una cuota; fecha `06/10/2026`; nota `Almuerzo`. |
| Prioridad | Media |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-nav-011-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-011-001@example.com`. |
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

### CP-NAV-012 — Un fallo offline conserva todos los datos y ofrece Reintentar

| Campo | Contenido |
|---|---|
| ID | CP-NAV-012 |
| Trazabilidad | US-70 · CA-3 · NFR-09 · ADR-034 |
| Invariante | I18 |
| Técnica | Adivinación de errores |
| Tipo | Negativo |
| Canal | UI |
| Caso par | No aplicable: H-NAV-01 |
| Pre-requisitos | PR-01 con `qa+cp-nav-012-001@example.com`; PR-02; NAV-PREP-01; cerrar sesión. |
| Datos de prueba | Gasto ARS; monto `12500`; categoría `Comida`; cuenta `Visa BBVA`; una cuota; fecha `06/10/2026`; nota `Almuerzo`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-nav-012-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-012-001@example.com`. |
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

### CP-NAV-013 — Reintentar al volver Online guarda una sola transacción

| Campo | Contenido |
|---|---|
| ID | CP-NAV-013 |
| Trazabilidad | US-70 · CA-5 · NFR-10 · ADR-034 |
| Invariante | I18 |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-013-001@example.com`; PR-02; NAV-PREP-01; cerrar sesión. |
| Datos de prueba | Gasto ARS; monto `12500`; categoría `Comida`; cuenta `Visa BBVA`; una cuota; fecha `06/10/2026`; nota `Almuerzo`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-nav-013-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-013-001@example.com`. |
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

### CP-NAV-014 — A los 15 segundos de espera aparece el error reintentable

| Campo | Contenido |
|---|---|
| ID | CP-NAV-014 |
| Trazabilidad | US-70 · CA-7 · ADR-034 |
| Invariante | — |
| Técnica | Valores límite |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-014-001@example.com`; PR-02; NAV-PREP-01; en Chrome DevTools crear el perfil Network `NAV-20s` con latencia `20000 ms`, descarga `1000 kb/s`, subida `1000 kb/s` y pérdida `0 %`; cerrar sesión. |
| Datos de prueba | Gasto ARS; monto `12500`; categoría `Comida`; cuenta `Visa BBVA`; una cuota; fecha `06/10/2026`; nota `Almuerzo`; cronómetro con resolución de `0,1 s`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-nav-014-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-014-001@example.com`. |
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

### CP-NAV-015 — Un reintento con commit previo no duplica

| Campo | Contenido |
|---|---|
| ID | CP-NAV-015 |
| Trazabilidad | US-70 · CA-8 · NFR-10 · ADR-034 |
| Invariante | I18 |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | CP-NAV-016 |
| Pre-requisitos | PR-01 con `qa+cp-nav-015-001@example.com`; PR-02; NAV-PREP-01; PR-04; ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con headers de PR-04 y el body literal de Datos: esperado HTTP 200 y UUID `<ID-1>`; cerrar sesión. |
| Datos de prueba | Gasto; ARS; monto `12500`; categoría `Comida`; cuenta `Visa BBVA`; una cuota; fecha `06/10/2026`; nota `Almuerzo`; UUID fijo `39000000-0000-4000-8000-000000000039`; body de preparación `{"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Comida>","p_account_id":"<uuid Visa BBVA>","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"39000000-0000-4000-8000-000000000039"}`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra. |
| 3 | Escribir `<APP>`. | La barra muestra `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`. |
| 5 | Escribir `qa+cp-nav-015-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-015-001@example.com`. |
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

### CP-NAV-016 — La misma clave secuencial devuelve el mismo id

| Campo | Contenido |
|---|---|
| ID | CP-NAV-016 |
| Trazabilidad | US-70 · CA-9 · NFR-10 · ADR-034 |
| Invariante | I18 |
| Técnica | Casos de uso |
| Tipo | Positivo |
| Canal | API |
| Caso par | CP-NAV-015 |
| Pre-requisitos | PR-01 con `qa+cp-nav-016-001@example.com`; PR-02; NAV-PREP-01; PR-04. |
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

### CP-NAV-017 — Dos llamadas simultáneas con la misma clave crean una fila

| Campo | Contenido |
|---|---|
| ID | CP-NAV-017 |
| Trazabilidad | US-70 · CA-10 · NFR-10 · ADR-034 |
| Invariante | I18 |
| Técnica | Adivinación de errores |
| Tipo | Positivo |
| Canal | API |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-017-001@example.com`; PR-02; NAV-PREP-01; PR-04. |
| Datos de prueba | PowerShell 7 con `Start-ThreadJob`; URL `<SUPABASE_URL>/rest/v1/rpc/create_transaction`; headers `apikey: <ANON_KEY>`, `Authorization: Bearer <TOKEN>`, `Content-Type: application/json`; body `{"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Comida>","p_account_id":"<uuid Visa BBVA>","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"41000000-0000-4000-8000-000000000041"}`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar el bloque completo `NAV-CONC-01` en PowerShell 7. | El JSON de salida tiene dos objetos con `Status:200` y el mismo UUID en `Body`; ninguno contiene `code:"23505"`. |
| 2 | Ejecutar `GET <SUPABASE_URL>/rest/v1/transactions?select=id,amount_text:amount::text,request_id,deleted_at&request_id=eq.41000000-0000-4000-8000-000000000041` con headers de PR-04. | HTTP 200; exactamente una fila con el UUID devuelto por ambos jobs, `amount_text:"12500.00"`, la clave indicada y `deleted_at:null`. |
| 3 | Ejecutar `GET <SUPABASE_URL>/rest/v1/ledger_entries?select=transaction_id,installment_number,amount_text:amount::text&transaction_id=eq.<UUID devuelto>` con headers de PR-04. | HTTP 200; exactamente una fila con `installment_number:1` y `amount_text:"12500.00"`. |

**Post-condición:** Una transacción.

### CP-NAV-018 — La misma clave de dos usuarios no colisiona

| Campo | Contenido |
|---|---|
| ID | CP-NAV-018 |
| Trazabilidad | US-70 · CA-12 · C7 · ADR-034 |
| Invariante | I18 |
| Técnica | Adivinación de errores |
| Tipo | Positivo |
| Canal | API |
| Caso par | — |
| Pre-requisitos | Ejecutar PR-01 con `qa+cp-nav-018-001@example.com` (A) y otra vez con `qa+cp-nav-018-002@example.com` (B), en ventanas de incógnito separadas; para cada usuario ejecutar PR-02 y NAV-PREP-01; ejecutar PR-04 para obtener `<TOKEN-A>` y `<TOKEN-B>`. |
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

### CP-NAV-019 — Archivar la categoría entre revisión y guardado produce rechazo sin pendiente

| Campo | Contenido |
|---|---|
| ID | CP-NAV-019 |
| Trazabilidad | US-70 · CA-16 · C6 |
| Invariante | — |
| Técnica | Adivinación de errores |
| Tipo | Negativo |
| Canal | UI |
| Caso par | CP-NAV-020 |
| Pre-requisitos | PR-01 con `qa+cp-nav-019-001@example.com`; PR-02; NAV-PREP-01; cerrar sesión. |
| Datos de prueba | Gasto ARS `12500`; categoría `Comida`; cuenta `Visa BBVA`; una cuota; fecha `06/10/2026`; nota `Almuerzo`; dos pestañas del mismo perfil de incógnito. |
| Prioridad | Alta |
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

### CP-NAV-020 — La API rechaza una categoría archivada con el código de integridad

| Campo | Contenido |
|---|---|
| ID | CP-NAV-020 |
| Trazabilidad | US-70 · CA-16 · C6 |
| Invariante | — |
| Técnica | Adivinación de errores |
| Tipo | Negativo |
| Canal | API |
| Caso par | CP-NAV-019 |
| Pre-requisitos | PR-01 con `qa+cp-nav-020-001@example.com`; PR-02; NAV-PREP-01; PR-04; archivar `Comida` y conservar su UUID. |
| Datos de prueba | POST `<SUPABASE_URL>/rest/v1/rpc/create_transaction`; body `{"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Comida archivada>","p_account_id":"<uuid Visa BBVA>","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"48000000-0000-4000-8000-000000000048"}`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ejecutar el POST de Datos con headers `apikey: <ANON_KEY>`, `Authorization: Bearer <TOKEN>` y `Content-Type: application/json`. | HTTP 409; JSON `code:"23503"`, `message:"la categoría no existe, no es tuya o está archivada"`; no devuelve UUID. |
| 2 | Ejecutar `GET <SUPABASE_URL>/rest/v1/transactions?select=id,request_id&request_id=eq.48000000-0000-4000-8000-000000000048` con headers de PR-04. | HTTP 200 y cuerpo exacto `[]`; no hay transacción. |
| 3 | Ejecutar `GET <SUPABASE_URL>/rest/v1/ledger_entries?select=id,transaction_id` con headers de PR-04. | HTTP 200 y cuerpo exacto `[]`; no hay imputaciones. |

**Post-condición:** Ninguna transacción; `Comida` sigue archivada.

### CP-NAV-021 — Volver a Registrar muestra el pendiente con sus acciones

| Campo | Contenido |
|---|---|
| ID | CP-NAV-021 |
| Trazabilidad | US-70 · CA-17 · NFR-09 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-021-001@example.com`; PR-02; NAV-PREP-01; cerrar sesión. |
| Datos de prueba | Gasto ARS `12500`; `Comida`; `Visa BBVA`; fecha `06/10/2026`; nota `Almuerzo`. |
| Prioridad | Alta |
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

### CP-NAV-022 — Recuperar detecta una transacción activa que ya se había guardado

| Campo | Contenido |
|---|---|
| ID | CP-NAV-022 |
| Trazabilidad | US-70 · CA-20 · I18 · C6 |
| Invariante | I18 |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-022-001@example.com`; PR-02; NAV-PREP-01; PR-04; ejecutar `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` con headers de PR-04 y el body API literal de Datos: esperado HTTP 200 y UUID `<ID-1>`; cerrar sesión. |
| Datos de prueba | Gasto; ARS; monto `12500`; categoría `Comida`; cuenta `Visa BBVA`; una cuota; fecha `06/10/2026`; nota `Almuerzo`; UUID fijo `53000000-0000-4000-8000-000000000053`; body API `{"p_type":"expense","p_amount":"12500.00","p_currency":"ARS","p_fx_rate":null,"p_category_id":"<uuid Comida>","p_account_id":"<uuid Visa BBVA>","p_installments_count":1,"p_occurred_on":"2026-10-06","p_description":"Almuerzo","p_shared_person":null,"p_shared_amount":null,"p_request_id":"53000000-0000-4000-8000-000000000053"}`. |
| Prioridad | Alta |
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

### CP-NAV-023 — Descartar elimina el pendiente incluso después de recargar

| Campo | Contenido |
|---|---|
| ID | CP-NAV-023 |
| Trazabilidad | US-70 · CA-23 · NFR-09 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-023-001@example.com`; PR-02; NAV-PREP-01; cerrar sesión. |
| Datos de prueba | Gasto; ARS; monto `12500`; categoría `Comida`; cuenta `Visa BBVA`; una cuota; fecha `06/10/2026`; nota `Almuerzo`. |
| Prioridad | Alta |
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

### CP-NAV-024 — Cerrar sesión borra todos los pendientes del usuario

| Campo | Contenido |
|---|---|
| ID | CP-NAV-024 |
| Trazabilidad | US-70 · CA-24 · NFR-09 |
| Invariante | — |
| Técnica | Transición de estados |
| Tipo | Positivo |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-024-001@example.com`; PR-02; NAV-PREP-01; cerrar sesión. |
| Datos de prueba | Gasto; ARS; monto `12500`; categoría `Comida`; cuenta `Visa BBVA`; una cuota; fecha `06/10/2026`; nota `Almuerzo`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-024-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-024-001@example.com`. |
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
| 24 | Escribir `qa+cp-nav-024-001@example.com` en `Email`. | El campo muestra ese email. |
| 25 | Escribir `Clave123!` en `Contraseña`. | El valor queda enmascarado. |
| 26 | Hacer click en `Entrar`. | Se abre Registrar en el paso 1; no aparece el aviso de pendientes. |

**Post-condición:** Ningún pendiente ni transacción; sesión iniciada.

### CP-NAV-025 — Doble activación durante Guardando envía una sola RPC

| Campo | Contenido |
|---|---|
| ID | CP-NAV-025 |
| Trazabilidad | US-70 · CA-28 · C4 |
| Invariante | — |
| Técnica | Adivinación de errores |
| Tipo | Límite |
| Canal | UI |
| Caso par | — |
| Pre-requisitos | PR-01 con `qa+cp-nav-025-001@example.com`; PR-02; NAV-PREP-01; cerrar sesión. |
| Datos de prueba | Gasto; ARS; monto `12500`; categoría `Comida`; cuenta `Visa BBVA`; una cuota; fecha `06/10/2026`; nota `Almuerzo`; DevTools Network con `Preserve log` y throttling personalizado de latencia `500 ms`, descarga `10 Mbps`, subida `10 Mbps`. |
| Prioridad | Alta |
| Automatizable | Sí |

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir una ventana de incógnito de Chrome. | Se abre una ventana sin sesión previa. |
| 2 | Hacer click en la barra de direcciones. | El cursor queda en la barra de direcciones. |
| 3 | Escribir `<APP>`. | La barra muestra exactamente `<APP>`. |
| 4 | Presionar Enter. | Se ve `Entrar`, con los campos `Email` y `Contraseña`. |
| 5 | Escribir `qa+cp-nav-025-001@example.com` en `Email`. | El campo muestra `qa+cp-nav-025-001@example.com`. |
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

## Historias o criterios sin caso

- US-69: tras el recorte del 2026-10-27 (de 85 a 25 casos), los criterios marcados «sin caso» en la matriz de cobertura quedaron sin caso propio.
- US-70: igual que US-69, los criterios marcados «sin caso» en la matriz de cobertura quedaron sin caso propio tras el recorte; CA-26 conserva además el hueco exacto H-NAV-02.
- US-71: no es una historia de V2. La conducta está cubierta por US-65 y CP-REG-013 de V1.
- **H-NAV-01 — Sin par API para un fallo de transporte local.** CP-NAV-012 es un negativo de UI provocado al dejar al navegador sin red. No existe una llamada directa a la API que pueda devolver método, status HTTP y `code`: al cortar el transporte no hay respuesta HTTP. La idempotencia de la RPC que protege esos reintentos sí queda cubierta por CP-NAV-015, CP-NAV-016 y CP-NAV-017. El PO debe decidir si acepta esta excepción documentada a la regla general de pares C6.
- **H-NAV-02 — Fecha exacta de recuperación de CA-26 no reproducible.** US-70 · CA-26 exige guardar el pendiente exactamente el `06/10/2026`, pero la aplicación y la RPC no exponen reloj inyectable y esa fecha ya pasó. La variante mensual equivalente se quitó del catálogo en el recorte, así que el criterio queda sin caso. Se necesita un ambiente con reloj controlable o un harness de V3 para cerrar el criterio literal.
- El bloqueo de `localStorage` y el vencimiento espontáneo de sesión no tienen criterio manual en US-70; la propia historia difiere el primero a un test de componente de V3 y declara que el segundo no se puede provocar manualmente de forma confiable.
- El corte físico de la respuesta después del commit no se puede reproducir de forma determinista solo con Chrome DevTools. CP-NAV-015 usa el equivalente controlado exigido por CA-8: mismo `request_id`, creación directa por API y reintento por UI.

## Impacto en la regresión de V1

US-69 invalida el paso que toca `Movimientos` en la barra. Antes de ejecutar la regresión, cambiar el paso 1 de **CP-REG-013** por:

1. Hacer click en `Resumen`.
2. Hacer click en `Ver todos` dentro de `Últimos movimientos`; si el mes está vacío, hacer click en `Ver movimientos`.

El mismo ajuste de navegación aplica a CP-ACC-009, CP-CFG-004, CP-REG-004, CP-REG-012, CP-CUO-008, CP-CUO-009 y CP-MON-004. Este archivo documenta el impacto; no modifica los casos de V1.

## Ambigüedades para el PO

1. US-70 · CA-7 exige un throttling personalizado de `20.000 ms`, pero no fija la herramienta ni el resto de parámetros del perfil. CP-NAV-014 usa Chrome DevTools, latencia `20.000 ms`, descarga y subida `1000 kb/s`, sin pérdida de paquetes.
2. US-70 · CA-27 requiere VoiceOver o TalkBack. El caso del Pixel 7 con Android 15 y TalkBack en español se quitó del catálogo en el recorte; si se quiere cubrir CA-27, confirmar qué dispositivo estaría disponible para la ejecución manual.
3. US-69 · CA-4 pide un área táctil mínima de `44 × 44 px` sin aclarar si se mide la caja CSS o el área física. El caso que lo medía con `getBoundingClientRect()` en CSS px se quitó del catálogo en el recorte.
4. Los ejemplos de US-70 usan `Comida` y `Tecnología`, mientras PR-01 crea `Comida y supermercado`. NAV-PREP-01 normaliza los nombres sin inventar datos funcionales.
5. US-70 · CA-26 fija la recuperación y el guardado al `06/10/2026`, pero no define un mecanismo de reloj controlable. La variante mensual equivalente se quitó del catálogo en el recorte; el PO debe decidir si provee un ambiente con reloj inyectable o acepta diferir el literal a V3.

## Resumen cuantitativo

| Dimensión | Cantidad |
|---|---:|
| Total | 25 |
| Positivos | 18 |
| Negativos | 3 |
| Límite | 4 |
| UI | 21 |
| API | 4 |
| Prioridad Alta | 15 |
| Prioridad Media | 10 |
| Prioridad Baja | 0 |
| Automatizable Sí | 25 |
| Automatizable No | 0 |
| Automatizable V3 | 0 |
