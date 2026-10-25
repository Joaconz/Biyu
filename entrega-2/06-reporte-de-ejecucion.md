# Entrega 2 · Reporte de ejecución de casos de prueba (V2) · Deudas y Navegación

Planilla: `06-reporte-de-ejecucion.xlsx` (mismo formato que la Entrega 1: ID, prioridad, título, historia, camino feliz, status y defectos, más el resumen, el gráfico y los criterios de salida). Formato del contenido: `docs/07-plan-de-testing.md` §6.

| Dato | Valor |
|---|---|
| Versión probada | Ejecución manual: deploy de Vercel (https://biyu-rust.vercel.app). Ejecución de Claude Code: main en f096e22 (local, con todas las migraciones hasta 20261012000000). |
| Entorno | Manual: Google Chrome contra el deploy. Claude Code: Vite local (127.0.0.1:5173) + Supabase local; Chromium (Playwright 1.63) y navegador integrado; pedidos directos a la API con el token del usuario de prueba. |
| Fecha | 2026-10-25 |
| Ejecutó | Santiago (a mano: Deudas 018 a 028 y 40 casos de Navegación) y Claude Code, supervisado por Santiago (el resto). |
| Datos | Usuarios qa+<id del caso>-001@example.com y montos ficticios, uno por caso; en local se pueden borrar con «supabase db reset». |

## 1. Planificados, ejecutados, pasados, fallados y bloqueados

| Métrica | Casos | % |
|---|---|---|
| Planificados | 190 | 100 % |
| Ejecutados (PASSED + FAILED + DUDA) | 146 | 77 % de avance |
| PASSED | 143 | 98 % de los ejecutados |
| FAILED | 1 | 1 % de los ejecutados |
| DUDA (pasa, con dudas) | 2 | 1 % de los ejecutados |
| BLOCKED | 43 | — |
| No ejecutados | 1 | — |

- **FAILED:** CP-NAV-084 (DEF-029): la baja responde 204 sin cuerpo y el caso espera 200 con `null`; parece un error del caso.
- **BLOCKED:** 43 casos que dependen de funciones todavía no implementadas: CP-DEU-029 y CP-DEU-128 a 142B (US-82, issue #270), y CP-DEU-151 a 157 y 159 (US-83, issue #271).
- **DUDA:** CP-DEU-145 (la preparación pide 12 cuotas con una cuenta «Efectivo», que la app rechaza; parece un error del caso) y CP-DEU-158 (se cumple, pero también se cumpliría sin US-83).
- **No ejecutado:** CP-NAV-060: requiere un Pixel 7 con TalkBack.

## 2. Cobertura por módulo, prioridad, tipo, técnica y canal

| Módulo | Casos | PASSED | FAILED | DUDA | BLOCKED | No ejecutados |
|---|---|---|---|---|---|---|
| DEU-A · Gasto compartido: validaciones de create_transaction (US-34, 018 a 029) | 13 | 12 | 0 | 0 | 1 | 0 |
| DEU-B · Listado, filtro por estado y acceso (US-37 y US-38, 100 a 108C) | 12 | 12 | 0 | 0 | 0 | 0 |
| DEU-C · Saldar, volver a pendiente y filtro por dirección (US-39, US-40 y US-79, 109 a 127C) | 28 | 28 | 0 | 0 | 0 | 0 |
| DEU-D · Compartir con varias personas (US-82, 128 a 142B) | 33 | 0 | 0 | 0 | 33 | 0 |
| DEU-E · Neto de reembolsos en el Resumen (US-30, 143 a 150) | 9 | 8 | 0 | 1 | 0 | 0 |
| DEU-F · Deudas sueltas en el balance del mes (US-83, 151 a 159) | 10 | 0 | 0 | 1 | 9 | 0 |
| NAV-69 · Barra de navegación (US-69) | 49 | 49 | 0 | 0 | 0 | 0 |
| NAV-70 · Aviso de guardado y reintento (US-70) | 36 | 34 | 1 | 0 | 0 | 1 |

| Prioridad | Casos | PASSED | FAILED | DUDA | BLOCKED | No ejecutados |
|---|---|---|---|---|---|---|
| Alta | 96 | 67 | 1 | 2 | 26 | 0 |
| Media | 83 | 66 | 0 | 0 | 16 | 1 |
| Baja | 11 | 10 | 0 | 0 | 1 | 0 |

| Tipo | Casos | PASSED | FAILED | DUDA | BLOCKED | No ejecutados |
|---|---|---|---|---|---|---|
| Positivo | 97 | 73 | 1 | 0 | 22 | 1 |
| Negativo | 49 | 37 | 0 | 1 | 11 | 0 |
| Límite | 44 | 33 | 0 | 1 | 10 | 0 |

| Técnica | Casos | PASSED | FAILED | DUDA | BLOCKED | No ejecutados |
|---|---|---|---|---|---|---|
| Partición de equivalencia | 40 | 29 | 0 | 1 | 10 | 0 |
| Tabla de decisión | 8 | 8 | 0 | 0 | 0 | 0 |
| Valores límite | 49 | 34 | 0 | 1 | 14 | 0 |
| Adivinación de errores | 18 | 17 | 0 | 0 | 1 | 0 |
| Caso de uso | 28 | 19 | 0 | 0 | 8 | 1 |
| Transición de estados | 47 | 36 | 1 | 0 | 10 | 0 |

| Canal | Casos | PASSED | FAILED | DUDA | BLOCKED | No ejecutados |
|---|---|---|---|---|---|---|
| API | 43 | 34 | 1 | 0 | 8 | 0 |
| UI | 147 | 109 | 0 | 2 | 35 | 1 |

## 3. Defectos por severidad

| Severidad | Abiertos | IDs |
|---|---|---|
| Crítica | 0 | — |
| Alta | 0 | — |
| Media | 0 | — |
| Baja | 1 | DEF-029 |
| **Total abiertos** | **1** | DEF-029 |

Detalle en `05-reportes-de-defectos`.

## 4. Criterios de salida (docs/07-plan-de-testing.md §6)

| Criterio | Estado | Detalle |
|---|---|---|
| 1. Cero defectos de severidad Crítica abiertos | Cumplido | No hay defectos críticos (el único defecto, DEF-029, es de severidad Baja). |
| 2. Cero defectos de severidad Alta abiertos, o justificados por el PO | Cumplido | No hay defectos de severidad Alta. |
| 3. Todos los casos de prioridad Alta ejecutados | No cumplido | 70 de 96 casos de prioridad Alta ejecutados. No ejecutados: 26, todos BLOCKED porque dependen de funciones todavía no implementadas (US-82, issue #270, y US-83, issue #271): 029, 128, 129, 131, 132, 133, 134, 136, 136C, 136D, 136E, 137, 139, 140, 141, 142, 142A, 142B, 151, 152, 153, 154, 155, 156, 157, 159. |
| 4. Toda invariante del alcance con al menos un caso ejecutado | Parcial | Con casos ejecutados: I1, I10, I18, I2, I3, I4, I7, I9. Solo con casos sin ejecutar: I5. Este reporte cubre Deudas (018 a 029 y 100 a 159) y Navegación; las demás invariantes de V2 (suscripciones, importar, etc.) están en otros casos. |
| 5. Regresión de V1 ejecutada y defectos corregidos confirmados | No evaluado | Fuera del alcance de este reporte: la selección de regresión (03) y la confirmación de los defectos de V1 se informan aparte. |

**Conclusión:** con este alcance (Deudas 018–029 y 100–159, y Navegación) se cumplen los criterios 1 y 2 (no hay defectos críticos ni altos). El criterio 3 **no se cumple**: los casos de prioridad Alta bloqueados por US-82 y US-83 no se pueden ejecutar hasta que esas funciones existan. El 4 se cumple solo en parte porque el alcance es parcial, y el 5 (regresión de V1) se informa aparte.

## 5. Desvíos respecto de lo planificado

1. Alcance parcial de V2. Este reporte cubre CP-DEU-018 a 029 y CP-DEU-100 a 159 (Deudas) y CP-NAV-001 a 085 (Navegación): 190 casos. Los otros casos de Deudas (CP-DEU-001 a 017, 030 a 099) y los de Suscripciones, Export, Importar y Dashboard no están incluidos.
2. Tres formas de ejecutar. 40 casos de Navegación y los 12 de Deudas (018 a 028) los ejecutó Santiago a mano en el deploy de Vercel, con Chrome. Los otros 44 de Navegación, CP-DEU-029 y los 92 de Deudas del 100 en adelante los ejecutó Claude Code en el entorno local (Playwright, navegador integrado y pedidos directos a la API). La propiedad cruzada del plan (07-plan-de-testing §1) no se aplicó.
3. Deudas 018–028 se verificaron en la pantalla, no por API. Los casos están escritos como llamadas directas a create_transaction con varias personas (US-82), que todavía no existe (issue #270). Se ejecutó la prueba equivalente en Registrar («Gasto compartido») de cada caso gemelo; el resultado esperado de la pantalla es el mensaje de error y el botón «Guardar gasto» deshabilitado.
4. Funciones todavía no implementadas. US-82 (compartir con varias personas, issue #270) y US-83 (deudas sueltas en el balance del mes, issue #271) no existen en la app: quedan BLOCKED CP-DEU-029, los 33 casos CP-DEU-128 a 142B y los 9 casos CP-DEU-151 a 157 y 159 (43 en total). Se comprobó la ausencia de cada función (botones, respuesta de la API y Resumen) y no se les abrió defecto: dependen de historias pendientes.
5. CP-DEU-145 y CP-DEU-158 con dudas. En el 145 la preparación del caso pide 12 cuotas con la cuenta «Efectivo» y la app solo permite cuotas con tarjeta de crédito (se ejecutó con «Tarjeta de crédito»: el resultado es el esperado): parece un error del caso. El 158 se cumple, pero también se cumpliría sin US-83.
6. Preparación por API. En los casos CP-DEU-100 a 159 las deudas, gastos y tipos de cambio de la preparación se cargaron por API (create_debt, create_transaction, settle_debt, delete_transaction, upsert_fx_rate), como en los casos originales con PR-04; el formulario «Nueva deuda» no se ejercitó en esos casos.
7. CP-NAV-060 sin ejecutar: necesita un Pixel 7 con Android 15 y TalkBack en español.
8. CP-NAV-084 FAILED por una diferencia entre el caso y la implementación (204 sin cuerpo en vez de 200 con null). Parece un error del caso. No se corrigió nada: hay que decidir si cambia el caso o la función (DEF-029).
9. Adaptaciones de DevTools en las ejecuciones de Claude Code: el corte de red y el perfil de 20 s se aplicaron con el protocolo de Chrome (el mismo mecanismo de Network); en 013 a 017 se ocultó la barra de desplazamiento clásica del navegador integrado para imitar un celular. CP-NAV-041 usó una barrera en Node en lugar del script de PowerShell. CP-NAV-059 verifica la variante mensual equivalente (H-NAV-02).
10. Evidencia: no se adjuntaron capturas al repositorio; lo observado queda en «Resultado obtenido» de cada caso (04-ejecucion).

## 6. Datos de prueba

Usuarios `qa+<id del caso>-001@example.com` con contraseña `Clave123!` y montos ficticios (C14), uno por caso. En el entorno local se borran con `supabase db reset`; en el deploy de Vercel quedan las cuentas de prueba creadas por la ejecución manual.
