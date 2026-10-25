# Entrega 2 · Reporte de ejecución de casos de prueba (V2) · Deudas y Navegación

Planilla: `06-reporte-de-ejecucion.xlsx` (mismo formato que la Entrega 1: ID, prioridad, título, historia, camino feliz, status y defectos, más el resumen, el gráfico y los criterios de salida). Formato del contenido: `docs/07-plan-de-testing.md` §6.

| Dato | Valor |
|---|---|
| Versión probada | Ejecución manual: deploy de Vercel (https://biyu-rust.vercel.app). Ejecución de Claude Code: main en f096e22 (local, con todas las migraciones hasta 20261012000000). |
| Entorno | Manual: Google Chrome contra el deploy. Claude Code: Vite local (127.0.0.1:5173) + Supabase local; Chromium (Playwright 1.63) y navegador integrado. |
| Fecha | 2026-10-25 |
| Ejecutó | Santiago (a mano) y Claude Code, supervisado por Santiago. |
| Datos | Usuarios qa+<id del caso>-001@example.com y montos ficticios, uno por caso; en local se pueden borrar con «supabase db reset». |

## 1. Planificados, ejecutados, pasados, fallados y bloqueados

| Métrica | Casos | % |
|---|---|---|
| Planificados | 98 | 100 % |
| Ejecutados (PASSED + FAILED) | 96 | 98 % de avance |
| PASSED | 95 | 99 % de los ejecutados |
| FAILED | 1 | 1 % de los ejecutados |
| BLOCKED | 1 | — |
| No ejecutados | 1 | — |

- **FAILED:** CP-NAV-084 (DEF-029): la baja responde 204 sin cuerpo y el caso espera 200 con `null`; parece un error del caso.
- **BLOCKED:** CP-DEU-029: la función de varias personas (US-82) no existe todavía; sin sesión sí se rechaza con la función actual (401, código 42501).
- **No ejecutado:** CP-NAV-060: requiere un Pixel 7 con TalkBack.

## 2. Cobertura por módulo, prioridad, tipo, técnica y canal

| Módulo | Casos | PASSED | FAILED | BLOCKED | No ejecutados |
|---|---|---|---|---|---|
| DEU · Deudas y gastos compartidos (US-34) | 13 | 12 | 0 | 1 | 0 |
| NAV-69 · Barra de navegación (US-69) | 49 | 49 | 0 | 0 | 0 |
| NAV-70 · Aviso de guardado y reintento (US-70) | 36 | 34 | 1 | 0 | 1 |

| Prioridad | Casos | PASSED | FAILED | BLOCKED | No ejecutados |
|---|---|---|---|---|---|
| Alta | 43 | 41 | 1 | 1 | 0 |
| Media | 55 | 54 | 0 | 0 | 1 |

| Tipo | Casos | PASSED | FAILED | BLOCKED | No ejecutados |
|---|---|---|---|---|---|
| Positivo | 59 | 57 | 1 | 0 | 1 |
| Negativo | 16 | 15 | 0 | 1 | 0 |
| Límite | 23 | 23 | 0 | 0 | 0 |

| Técnica | Casos | PASSED | FAILED | BLOCKED | No ejecutados |
|---|---|---|---|---|---|
| Partición de equivalencia | 19 | 19 | 0 | 0 | 0 |
| Tabla de decisión | 1 | 1 | 0 | 0 | 0 |
| Valores límite | 34 | 34 | 0 | 0 | 0 |
| Adivinación de errores | 9 | 8 | 0 | 1 | 0 |
| Caso de uso | 15 | 14 | 0 | 0 | 1 |
| Transición de estados | 20 | 19 | 1 | 0 | 0 |

| Canal | Casos | PASSED | FAILED | BLOCKED | No ejecutados |
|---|---|---|---|---|---|
| API | 24 | 22 | 1 | 1 | 0 |
| UI | 74 | 73 | 0 | 0 | 1 |

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
| 3. Todos los casos de prioridad Alta ejecutados | No cumplido | 42 de 43 casos de prioridad Alta ejecutados. Falta: CP-DEU-029. CP-DEU-029 está BLOCKED porque US-82 no está implementada. |
| 4. Toda invariante del alcance con al menos un caso ejecutado | Parcial | Con casos ejecutados: I1, I10, I18, I2, I4, I7. Este reporte cubre solo Deudas 018–029 y Navegación; las demás invariantes de V2 (deudas y suscripciones) están en otros casos. |
| 5. Regresión de V1 ejecutada y defectos corregidos confirmados | No evaluado | Fuera del alcance de este reporte: la selección de regresión (03) y la confirmación de los defectos de V1 se informan aparte. |

**Conclusión:** con este alcance (Deudas 018–029 y Navegación) se cumplen los criterios 1 y 2 (no hay defectos críticos ni altos). El criterio 3 **no se cumple** por CP-DEU-029 (prioridad Alta, BLOCKED hasta que se implemente US-82), el 4 se cumple solo en parte porque el alcance es parcial, y el 5 (regresión de V1) se informa aparte.

## 5. Desvíos respecto de lo planificado

1. Alcance parcial de V2. Este reporte cubre solo los casos CP-DEU-018 a 029 (Deudas) y CP-NAV-001 a 085 (Navegación). Los otros casos de Deudas (CP-DEU-001 a 017 y 030 en adelante) y los de Suscripciones, Export, Importar y Dashboard no están incluidos.
2. Dos formas de ejecutar. 40 casos de Navegación y los 12 de Deudas (018 a 028) los ejecutó Santiago a mano en el deploy de Vercel, con Chrome. Los otros 44 de Navegación los ejecutó Claude Code en el entorno local (Playwright y el navegador integrado), porque el equipo no los había podido probar. La propiedad cruzada del plan (07-plan-de-testing §1) no se aplicó.
3. Deudas 018–028 se verificaron en la pantalla, no por API. Los casos están escritos como llamadas directas a create_transaction con varias personas (US-82), que todavía no existe (issue #270). Se ejecutó la prueba equivalente en Registrar («Gasto compartido») de cada caso gemelo; el resultado esperado de la pantalla es el mensaje de error y el botón «Guardar gasto» deshabilitado.
4. CP-DEU-029 BLOCKED. Como está escrito da 404 «función no encontrada». Con la función actual de una sola persona, sin sesión se responde 401 con el código 42501, o sea que el objetivo de seguridad se cumple, pero el caso no puede darse por ejecutado hasta que exista la función de US-82.
5. CP-NAV-060 sin ejecutar: necesita un Pixel 7 con Android 15 y TalkBack en español.
6. CP-NAV-084 FAILED por una diferencia entre el caso y la implementación (204 sin cuerpo en vez de 200 con null). Parece un error del caso. No se corrigió nada: hay que decidir si cambia el caso o la función (DEF-029).
7. Adaptaciones de DevTools en las ejecuciones de Claude Code: el corte de red y el perfil de 20 s se aplicaron con el protocolo de Chrome (el mismo mecanismo de Network); en 013 a 017 se ocultó la barra de desplazamiento clásica del navegador integrado para imitar un celular. CP-NAV-041 usó una barrera en Node en lugar del script de PowerShell. CP-NAV-059 verifica la variante mensual equivalente (H-NAV-02) y los casos de «aviso al recargar» etc. se ejecutaron tal cual.
8. Evidencia: no se adjuntaron capturas al repositorio; lo observado queda en «Resultado obtenido» de cada caso (04-ejecucion).

## 6. Datos de prueba

Usuarios `qa+<id del caso>-001@example.com` con contraseña `Clave123!` y montos ficticios (C14), uno por caso. En el entorno local se borran con `supabase db reset`; en el deploy de Vercel quedan las cuentas de prueba creadas por la ejecución manual.
