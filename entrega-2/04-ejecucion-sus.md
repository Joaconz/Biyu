# Proyecto Biyu – Entrega 2 · Ejecución de casos de prueba (V2) · Suscripciones (SUS)

Planilla: `04-ejecucion-sus.xlsx` (una hoja por caso con "Reporte de ejecución 1", resultado obtenido, informe previo del equipo y defectos). Casos: [`casos/sus.md`](casos/sus.md) (US-52 a US-63 y US-75). Reporte con métricas: [`06-reporte-de-ejecucion-sus.md`](06-reporte-de-ejecucion-sus.md). Defectos: [`05-reportes-de-defectos-sus.md`](05-reportes-de-defectos-sus.md).

## Condiciones de la ejecución

- **Fecha:** 2026-10-27.
- **Versión probada:** `main` en el commit `1c72d0f` (código local; los commits posteriores solo tocan documentos). No se probó el deploy de Vercel.
- **Entorno:** Local: Vite (http://127.0.0.1:5173) + Supabase local · main 1c72d0f · Chromium (Playwright 1.63), es-AR, America/Argentina/Buenos_Aires, reloj real (27/10/2026) y Edge Functions locales levantadas.
- **Quién ejecutó:** **80 casos los ejecutó Claude Code (IA), supervisado por Santiago** (los que el equipo no había podido probar o había informado con una observación) y **78 casos los ejecutó el equipo**, que los informó como «ok» en un mensaje y no se repitieron. El estado de estos últimos es el que informó el equipo, sin detalle de la ejecución.
- **Cómo se ejecutó:** scripts de Playwright. Cada caso crea su propio usuario (alta por API y entrada por la pantalla de ingreso, con la configuración inicial salteada), prepara los datos por la API y recorre la pantalla como lo haría una persona; los casos de API llaman directo a las funciones con el token del usuario (o con la clave anónima) y consultan las tablas como oráculo.
- **Datos:** usuarios `qa+cp-sus-<nnn>-001@example.com` (con un sufijo de corrida), contraseña `Clave123!` y montos ficticios (C14), en Supabase local. En producción no se creó nada.

## Resultado por caso

| ID | Prioridad | Historia | Status | Ejecutó | Defectos |
|---|---|---|---|---|---|
| CP-SUS-001 | Alta | US-52 | **PASSED** | Equipo | — |
| CP-SUS-002 | Media | US-52 | **PASSED** | Equipo | — |
| CP-SUS-003 | Media | US-52 | **PASSED** | Equipo | — |
| CP-SUS-004 | Media | US-52 | **PASSED** | Equipo | — |
| CP-SUS-005 | Media | US-52 | **PASSED** | Equipo | — |
| CP-SUS-006 | Media | US-52 | **PASSED** | Equipo | — |
| CP-SUS-007 | Media | US-52 | **PASSED** | Equipo | — |
| CP-SUS-008 | Media | US-52 | **PASSED** | Equipo | — |
| CP-SUS-009 | Baja | US-52 | **PASSED** | Equipo | — |
| CP-SUS-010 | Media | US-52 | **PASSED** | Equipo | — |
| CP-SUS-011 | Baja | US-52 | **PASSED** | Equipo | — |
| CP-SUS-012 | Media | US-52 | **PASSED** | Equipo | — |
| CP-SUS-013 | Media | US-52 | **PASSED** | Equipo | — |
| CP-SUS-014 | Media | US-52 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-015 | Media | US-52 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-016 | Alta | US-52 | **PASSED** | Equipo | — |
| CP-SUS-017 | Alta | US-52 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-018 | Alta | US-52 | **PASSED** | Equipo | — |
| CP-SUS-019 | Alta | US-52 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-020 | Alta | US-52 | **PASSED** | Equipo | — |
| CP-SUS-021 | Alta | US-52 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-022 | Alta | US-52 | **PASSED** | Equipo | — |
| CP-SUS-023 | Alta | US-52 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-024 | Alta | US-52 | **PASSED** | Equipo | — |
| CP-SUS-025 | Alta | US-52 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-026 | Media | US-52 | **PASSED** | Equipo | — |
| CP-SUS-027 | Media | US-52 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-028 | Media | US-52 | **PASSED** | Equipo | — |
| CP-SUS-029 | Media | US-52 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-030 | Media | US-52 | **PASSED** | Equipo | — |
| CP-SUS-031 | Media | US-52 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-032 | Media | US-52 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-033 | Media | US-52 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-034 | Media | US-52 | **PASSED** | Equipo | — |
| CP-SUS-035 | Media | US-52 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-036 | Media | US-52 | **PASSED** | Equipo | — |
| CP-SUS-037 | Media | US-52 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-038 | Media | US-52 | **PASSED** | Equipo | — |
| CP-SUS-039 | Media | US-52 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-040 | Media | US-52 | **PASSED** | Equipo | — |
| CP-SUS-041 | Media | US-52 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-042 | Baja | US-52 | **PASSED** | Equipo | — |
| CP-SUS-043 | Media | US-52 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-044 | Media | US-52 | **PASSED** | Equipo | — |
| CP-SUS-045 | Media | US-52 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-046 | Media | US-52 | **PASSED** | Equipo | — |
| CP-SUS-047 | Media | US-52 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-048 | Media | US-52 | **PASSED** | Equipo | — |
| CP-SUS-049 | Media | US-52 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-050 | Media | US-52 | **PASSED** | Equipo | — |
| CP-SUS-051 | Media | US-52 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-052 | Baja | US-52 | **PASSED** | Equipo | — |
| CP-SUS-053 | Baja | US-52 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-054 | Baja | US-52 | **PASSED** | Equipo | — |
| CP-SUS-055 | Baja | US-52 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-056 | Media | US-52 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-057 | Media | US-52 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-058 | Alta | US-52 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-059 | Alta | US-52 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-060 | Alta | US-52 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-061 | Alta | US-52 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-062 | Media | US-52 | **PASSED** | Equipo | — |
| CP-SUS-063 | Alta | US-52 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-064 | Alta | US-52 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-065 | Alta | US-52 | **FAILED** | Claude Code (IA) | DEF-035 |
| CP-SUS-066 | Alta | US-52 | **FAILED** | Claude Code (IA) | DEF-035 |
| CP-SUS-067 | Baja | US-52 | **PASSED** | Equipo | — |
| CP-SUS-068 | Baja | US-52 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-069 | Baja | US-52 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-070 | Alta | US-53 | **PASSED** | Equipo | — |
| CP-SUS-071 | Alta | US-53 | **PASSED** | Equipo | — |
| CP-SUS-072 | Alta | US-53 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-073 | Media | US-53 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-074 | Alta | US-53 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-075 | Alta | US-53 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-076 | Alta | US-53 | **PASSED** | Equipo | — |
| CP-SUS-077 | Alta | US-53 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-078 | Alta | US-54 | **PASSED** | Equipo | — |
| CP-SUS-079 | Media | US-54 | **PASSED** | Equipo | — |
| CP-SUS-080 | Media | US-54 | **PASSED** | Equipo | — |
| CP-SUS-081 | Alta | US-55 | **PASSED** | Equipo | — |
| CP-SUS-082 | Alta | US-55 | **PASSED** | Equipo | — |
| CP-SUS-083 | Alta | US-55 | **PASSED** | Equipo | — |
| CP-SUS-084 | Alta | US-55 | **PASSED** | Equipo | — |
| CP-SUS-085 | Alta | US-56 | **PASSED** | Equipo | — |
| CP-SUS-086 | Media | US-56 | **PASSED** | Equipo | — |
| CP-SUS-087 | Media | US-56 | **PASSED** | Equipo | — |
| CP-SUS-088 | Alta | US-56 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-089 | Alta | US-56 | **PASSED** | Equipo | — |
| CP-SUS-090 | Alta | US-56 | **PASSED** | Equipo | — |
| CP-SUS-091 | Media | US-56 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-092 | Media | US-56 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-093 | Alta | US-56 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-094 | Alta | US-56 | **FAILED** | Claude Code (IA) | DEF-034 |
| CP-SUS-095 | Alta | US-56 | **FAILED** | Claude Code (IA) | DEF-035 |
| CP-SUS-096 | Alta | US-57 | **PASSED** | Equipo | — |
| CP-SUS-097 | Media | US-57 | **PASSED** | Equipo | — |
| CP-SUS-098 | Media | US-57 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-099 | Media | US-57 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-100 | Alta | US-57 | **FAILED** | Claude Code (IA) | DEF-034 |
| CP-SUS-101 | Alta | US-57 | **FAILED** | Claude Code (IA) | DEF-035 |
| CP-SUS-102 | Alta | US-58 | **PASSED** | Equipo | — |
| CP-SUS-103 | Media | US-58 | **PASSED** | Equipo | — |
| CP-SUS-104 | Alta | US-58 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-105 | Media | US-58 | **PASSED** | Equipo | — |
| CP-SUS-106 | Media | US-58 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-107 | Alta | US-58 | **FAILED** | Claude Code (IA) | DEF-034 |
| CP-SUS-108 | Alta | US-58 | **FAILED** | Claude Code (IA) | DEF-035 |
| CP-SUS-109 | Alta | US-59 | **PASSED** | Equipo | — |
| CP-SUS-110 | Alta | US-59 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-111 | Media | US-59 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-112 | Media | US-59 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-113 | Alta | US-59 | **PASSED** | Equipo | — |
| CP-SUS-114 | Media | US-59 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-115 | Media | US-59 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-116 | Media | US-59 | **PASSED** | Equipo | — |
| CP-SUS-117 | Media | US-59 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-118 | Alta | US-59 | **PASSED** | Equipo | — |
| CP-SUS-119 | Alta | US-59 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-120 | Media | US-59 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-121 | Media | US-59 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-122 | Alta | US-59 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-123 | Media | US-59 | **PASSED** | Equipo | — |
| CP-SUS-124 | Media | US-59 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-125 | Media | US-59 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-126 | Media | US-59 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-127 | Media | US-59 | **PASSED** | Equipo | — |
| CP-SUS-128 | Alta | US-59 | **PASSED** | Equipo | — |
| CP-SUS-129 | Alta | US-59 | **FAILED** | Claude Code (IA) | DEF-034 |
| CP-SUS-130 | Alta | US-59 | **FAILED** | Claude Code (IA) | DEF-035 |
| CP-SUS-131 | Alta | US-60 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-132 | Alta | US-60 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-133 | Alta | US-60 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-134 | Alta | US-61 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-135 | Alta | US-61 | **PASSED** | Equipo | — |
| CP-SUS-136 | Media | US-61 | **PASSED** | Equipo | — |
| CP-SUS-137 | Media | US-61 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-138 | Media | US-61 | **PASSED** | Equipo | — |
| CP-SUS-139 | Alta | US-62 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-140 | Alta | US-62 | **PASSED** | Equipo | — |
| CP-SUS-141 | Media | US-62 | **PASSED** | Equipo | — |
| CP-SUS-142 | Media | US-62 | **PASSED** | Equipo | — |
| CP-SUS-143 | Alta | US-63 | **PASSED** | Equipo | — |
| CP-SUS-144 | Alta | US-63 | **PASSED** | Equipo | — |
| CP-SUS-145 | Alta | US-63 | **PASSED** | Equipo | — |
| CP-SUS-146 | Alta | US-63 | **PASSED** | Equipo | — |
| CP-SUS-147 | Alta | US-63 | **PASSED** | Equipo | — |
| CP-SUS-148 | Alta | US-63 | **PASSED** | Equipo | — |
| CP-SUS-149 | Media | US-63 | **PASSED** | Equipo | — |
| CP-SUS-150 | Media | US-63 | **PASSED** | Equipo | — |
| CP-SUS-151 | Media | US-63 | **PASSED** | Equipo | — |
| CP-SUS-152 | Media | US-63 | **PASSED** | Equipo | — |
| CP-SUS-153 | Alta | US-75 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-154 | Alta | US-75 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-155 | Media | US-75 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-156 | Media | US-75 | **PASSED** | Claude Code (IA) | — |
| CP-SUS-157 | Alta | US-75 | **FAILED** | Claude Code (IA) | DEF-036 |
| CP-SUS-158 | Media | US-75 | **PASSED** | Equipo | — |

## Detalle

### CP-SUS-001 — Dar de alta una suscripción en ARS desde hace 2 meses con día de cobro 10 genera los 2 gastos vencidos al guardar · **PASSED**

**Esperado:** Se abre `/subscriptions` con el encabezado `"Suscripciones"` (`subscriptions-title`) Se abre `/subscriptions/new` con el formulario `"Nueva suscripción"` (`subscription-form`), Moneda `"ARS"` seleccionada y `"Mes de inicio"` en `<MES_ACTUAL>` El campo `"Nombre"` toma foco El campo `"Nombre"` muestra `Netflix` El campo `"Monto"` toma foco El campo `"Monto"` muestra `5000` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo `"Día de cobro"` toma foco El campo `"Día de cobro"` muestra `10` `"Mes de inicio"` muestra `<MES_HACE_2>` y `subscription-form-preview-summary` muestra `"Al guardar se cargan 2 gastos de $5.000,00 (total $10.000,00)."` El campo `"Descripción (opcional)"` toma foco El campo muestra `Plan estándar` y el contador inferior indica `13/200` Navega a `/subscriptions/<SUB_ID>`, muestra el aviso `"Suscripción guardada. Se cargaron 2 gastos vencidos."` (`subscription-toast`), el título `"Netflix"` (`subscription-detail-name`), el estado `"Activa"` (`subscription-detail-status` con `data-status="active"`), `"Monto"` `"$5.000,00"`, `"Desde"` `"<mes hace 2>"` (ej. `"agosto 2026"`), `"Hasta"` `"Sin fin"`, `"Próximo cobro"` `"10/<MES_ACTUAL>"` (ej. `"10/10/2026"`), `"Descripción"` `"Plan estándar"` y en `"Gastos cargados"` (`subscription-detail-occurrences`) 2 filas: `<MES_ANTERIOR>` (`10/09/2026`, `"$5.000,00"`) y `<MES_HACE_2>` (`10/08/2026`, `"$5.000,00"`) Navega a `/subscriptions` y bajo el grupo `"Activas"` aparece la fila `"Netflix"` (`subscriptions-item` con `data-status="active"`), monto `"$5.000,00"` y `"Se cobra el día 10"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-002 — Dar de alta una suscripción en ARS desde el mes siguiente no genera gastos al guardar · **PASSED**

**Esperado:** Se abre `/subscriptions` Se abre `/subscriptions/new` El campo `"Nombre"` muestra `Disney+` El campo `"Monto"` muestra `4200` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo `"Día de cobro"` muestra `15` `subscription-form-preview-summary` muestra `"Al guardar no se carga ningún gasto."` Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada"` (`subscription-toast`), `"Próximo cobro"` (`subscription-detail-next-charge`) muestra `"15/<MES_SIGUIENTE>"` (ej. `"15/11/2026"`) y en `"Gastos cargados"` se lee `"Todavía no se cargó ningún gasto. El primero se carga el 15/<MES_SIGUIENTE>."` (`subscription-detail-occurrences-empty`)

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-003 — Dar de alta una suscripción con Monto en el límite inferior válido (`"0,01"`) se acepta · **PASSED**

**Esperado:** Se abre `"Nueva suscripción"` El campo `"Nombre"` muestra `Prueba Centavo` El campo `"Monto"` muestra `0,01` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo `"Día de cobro"` muestra `10` `"Mes de inicio"` muestra `<MES_SIGUIENTE>` Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada"` y en `"Datos"` la fila `"Monto"` muestra `"$0,01"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-004 — Dar de alta una suscripción en ARS con Monto en el límite superior válido (`"999999999999,99"`) se acepta · **PASSED**

**Esperado:** Se abre `"Nueva suscripción"` El campo `"Nombre"` muestra `Tope ARS` El campo `"Monto"` muestra `999999999999,99` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo `"Día de cobro"` muestra `10` `"Mes de inicio"` muestra `<MES_SIGUIENTE>` Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada"` y en `"Datos"` la fila `"Monto"` muestra `"$999.999.999.999,99"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-005 — Dar de alta una suscripción con Día de cobro en el límite inferior `"01"` se guarda como `"1"` · **PASSED**

**Esperado:** Se abre `"Nueva suscripción"` El campo muestra `Spotify` El campo muestra `3500` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo `"Día de cobro"` muestra `01` `"Mes de inicio"` muestra `<MES_SIGUIENTE>` Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada"` y en `"Datos"` la fila `"Día de cobro"` muestra `"1"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-006 — Dar de alta una suscripción con Día de cobro en el límite superior `"31"` se acepta · **PASSED**

**Esperado:** Se abre `"Nueva suscripción"` El campo muestra `YouTube Premium` El campo muestra `3800` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo `"Día de cobro"` muestra `31` `"Mes de inicio"` muestra `<MES_SIGUIENTE>` Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada"` y en `"Datos"` la fila `"Día de cobro"` muestra `"31"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-007 — Dar de alta una suscripción con Mes de inicio en el límite inferior (`-24` meses) y Mes de fin igual al de inicio genera exactamente 1 ocurrencia · **PASSED**

**Esperado:** Se abre `"Nueva suscripción"` El campo muestra `Max` El campo muestra `4500` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo muestra `10` `"Mes de inicio"` muestra `<MES_HACE_24>` `subscription-form-preview-summary` muestra `"Al guardar se carga 1 gasto de $4.500,00."` Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada. Se cargó 1 gasto vencido."`, `"Próximo cobro"` muestra `"—"` y `"Gastos cargados"` contiene exactamente 1 fila para `<MES_HACE_24>` (`10/10/2024`, `"$4.500,00"`)

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-008 — Dar de alta una suscripción con Mes de inicio en el límite superior (`+12` meses) se acepta sin generar gastos · **PASSED**

**Esperado:** Se abre `"Nueva suscripción"` El campo muestra `Prime Video` El campo muestra `3900` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo muestra `10` `subscription-form-preview-summary` muestra `"Al guardar no se carga ningún gasto."` Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada"` y `"Desde"` muestra `"<mes +12>"` (ej. `"octubre 2027"`)

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-009 — Dar de alta una suscripción con Mes de fin en el límite superior válido (`"2099-12"`) se acepta · **PASSED**

**Esperado:** Se abre `"Nueva suscripción"` El campo muestra `Dominio Anual` El campo muestra `5000` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo muestra `10` `"Mes de inicio"` muestra `<MES_SIGUIENTE>` `"Mes de fin (opcional)"` muestra `2099-12` Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada"` y en `"Datos"` la fila `"Hasta"` muestra `"diciembre 2099"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-010 — Dar de alta una suscripción con Nombre de 60 caracteres se acepta y el campo no deja escribir el carácter 61 · **PASSED**

**Esperado:** Se abre `"Nueva suscripción"` El campo `"Nombre"` muestra únicamente los primeros 60 caracteres `SuscripcionMensualDeEntretenimientoFamiliarConPlanCompleto12` (sin la `"X"`) El campo muestra `5000` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo muestra `10` `"Mes de inicio"` muestra `<MES_SIGUIENTE>` Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada"` y el título (`subscription-detail-name`) es `SuscripcionMensualDeEntretenimientoFamiliarConPlanCompleto12`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-011 — Dar de alta una suscripción con espacios en los bordes del Nombre (`"  Netflix  "`) la guarda como `"Netflix"` · **PASSED**

**Esperado:** Se abre `"Nueva suscripción"` El campo muestra `" Netflix "` El campo muestra `5000` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo muestra `10` `"Mes de inicio"` muestra `<MES_SIGUIENTE>` Navega a `/subscriptions/<SUB_ID>` y el encabezado (`subscription-detail-name`) muestra `"Netflix"` sin espacios en los bordes

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-012 — Dar de alta una suscripción con el mismo nombre que una suscripción cancelada se acepta · **PASSED**

**Esperado:** Se abre `"Nueva suscripción"` El campo muestra `Netflix` El campo muestra `6500` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo muestra `15` `"Mes de inicio"` muestra `<MES_SIGUIENTE>` Navega a `/subscriptions/<NEW_SUB_ID>`, muestra `"Suscripción guardada"` y estado `"Activa"` (`data-status="active"`) con `"Monto"` `"$6.500,00"` En `/subscriptions` aparece `"Netflix"` (`$6.500,00`) bajo `"Activas"` y `"Netflix"` (`$4.000,00`) bajo `"Canceladas"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-013 — Rechazar en UI el alta de suscripción con Nombre vacío o solo espacios · **PASSED**

**Esperado:** Se abre `"Nueva suscripción"` El campo muestra tres espacios El campo muestra `5000` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo muestra `10` La URL sigue siendo `/subscriptions/new` y debajo de `"Nombre"` aparece `"Escribí un nombre"` (`role="alert"`)

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-014 — Rechazar en API `create_subscription` con Nombre vacío o solo espacios · **PASSED**

**Esperado:** Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "Escribí un nombre"` Respuesta HTTP `200 OK` con body `[]` (0 filas)

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas)
— Observado en la corrida —
HTTP 400 {"code":"23514","details":null,"hint":null,"message":"Escribí un nombre"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-015 — Rechazar en API `create_subscription` con Nombre de 61 caracteres · **PASSED**

**Esperado:** Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "El nombre admite hasta 60 caracteres"` Respuesta HTTP `200 OK` con body `[]` (0 filas)

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas)
— Observado en la corrida —
HTTP 400 {"code":"23514","details":null,"hint":null,"message":"El nombre admite hasta 60 caracteres"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-016 — Rechazar en UI el alta de suscripción con Nombre igual al de otra activa sin distinguir mayúsculas ni espacios (`" netflix "`) · **PASSED**

**Esperado:** Se abre `"Nueva suscripción"` El campo muestra `" netflix "` El campo muestra `6000` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo muestra `15` `"Mes de inicio"` muestra `<MES_SIGUIENTE>` La URL sigue siendo `/subscriptions/new` y debajo de `"Nombre"` aparece `"Ya tenés una suscripción con ese nombre"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-017 — Rechazar en API `create_subscription` con Nombre igual al de otra activa (`" netflix "`) · **PASSED**

**Esperado:** Respuesta HTTP `409 Conflict` con `"code": "23505"` y `"message": "Ya tenés una suscripción con ese nombre"` Respuesta HTTP `200 OK` con 1 única fila (`[{"name":"Netflix","amount":5000}]`)

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con 1 única fila ([{"name":"Netflix","amount":5000}])
— Observado en la corrida —
HTTP 409 {"code":"23505","details":null,"hint":null,"message":"Ya tenés una suscripción con ese nombre"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-018 — Rechazar en UI el alta de suscripción con Nombre igual al de una suscripción pausada · **PASSED**

**Esperado:** Se abre `"Nueva suscripción"` El campo muestra `Spotify` El campo muestra `4000` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo muestra `10` `"Mes de inicio"` muestra `<MES_SIGUIENTE>` La URL sigue siendo `/subscriptions/new` y debajo de `"Nombre"` aparece `"Ya tenés una suscripción con ese nombre"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-019 — Rechazar en API `create_subscription` con Nombre igual al de una suscripción pausada · **PASSED**

**Esperado:** Respuesta HTTP `409 Conflict` con `"code": "23505"` y `"message": "Ya tenés una suscripción con ese nombre"` Respuesta HTTP `200 OK` con 1 única fila (`[{"name":"Spotify","status":"paused"}]`)

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con 1 única fila ([{"name":"Spotify","status":"paused"}])
— Observado en la corrida —
HTTP 409 {"code":"23505","details":null,"hint":null,"message":"Ya tenés una suscripción con ese nombre"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-020 — Rechazar en UI el alta de suscripción con Monto vacío · **PASSED**

**Esperado:** Se abre `"Nueva suscripción"` El campo muestra `Netflix` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo muestra `10` y `"Monto"` queda vacío La URL sigue siendo `/subscriptions/new` y debajo de `"Monto"` aparece `"El monto debe ser mayor a cero"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-021 — Rechazar en API `create_subscription` con `p_amount = null` · **PASSED**

**Esperado:** Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "El monto debe ser mayor a cero"` Respuesta HTTP `200 OK` con body `[]` (0 filas)

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas)
— Observado en la corrida —
HTTP 400 {"code":"23514","details":null,"hint":null,"message":"El monto debe ser mayor a cero"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-022 — Rechazar en UI el alta de suscripción con Monto igual a `"0"` · **PASSED**

**Esperado:** Se abre `"Nueva suscripción"` El campo muestra `Netflix` El campo muestra `0` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo muestra `10` La URL sigue siendo `/subscriptions/new` y debajo de `"Monto"` aparece `"El monto debe ser mayor a cero"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-023 — Rechazar en API `create_subscription` con `p_amount = "0.00"` · **PASSED**

**Esperado:** Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "El monto debe ser mayor a cero"` Respuesta HTTP `200 OK` con body `[]` (0 filas)

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas)
— Observado en la corrida —
HTTP 400 {"code":"23514","details":null,"hint":null,"message":"El monto debe ser mayor a cero"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-024 — Rechazar en UI el alta de suscripción con Monto negativo (`"-100"`) · **PASSED**

**Esperado:** Se abre `"Nueva suscripción"` El campo muestra `Netflix` El campo muestra `-100` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo muestra `10` La URL sigue siendo `/subscriptions/new` y debajo de `"Monto"` aparece `"El monto debe ser mayor a cero"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-025 — Rechazar en API `create_subscription` con Monto negativo (`p_amount = "-100.00"`) · **PASSED**

**Esperado:** Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "El monto debe ser mayor a cero"` Respuesta HTTP `200 OK` con body `[]` (0 filas)

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas)
— Observado en la corrida —
HTTP 400 {"code":"23514","details":null,"hint":null,"message":"El monto debe ser mayor a cero"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-026 — Rechazar en UI el alta de suscripción con Monto de más de 2 decimales (`"100,123"`) · **PASSED**

**Esperado:** Se abre `"Nueva suscripción"` El campo muestra `Netflix` El campo muestra `100,123` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo muestra `10` La URL sigue siendo `/subscriptions/new` y debajo de `"Monto"` aparece `"El monto admite hasta 2 decimales"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-027 — Rechazar en API `create_subscription` con Monto de más de 2 decimales (`"100.123"`) · **PASSED**

**Esperado:** Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "El monto admite hasta 2 decimales"` Respuesta HTTP `200 OK` con body `[]` (0 filas)

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas)
— Observado en la corrida —
HTTP 400 {"code":"23514","details":null,"hint":null,"message":"El monto admite hasta 2 decimales"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-028 — Rechazar en UI el alta de suscripción en ARS con Monto mayor al máximo (`"1000000000000"`) · **PASSED**

**Esperado:** Se abre `"Nueva suscripción"` con Moneda `"ARS"` seleccionada El campo muestra `Netflix` El campo muestra `1000000000000` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo muestra `10` La URL sigue siendo `/subscriptions/new` y debajo de `"Monto"` aparece `"El monto máximo es $999.999.999.999,99"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-029 — Rechazar en API `create_subscription` en ARS con Monto mayor al máximo (`"1000000000000.00"`) · **PASSED**

**Esperado:** Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "El monto máximo es $999.999.999.999,99"` Respuesta HTTP `200 OK` con body `[]` (0 filas)

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas)
— Observado en la corrida —
HTTP 400 {"code":"23514","details":null,"hint":null,"message":"El monto máximo es $999.999.999.999,99"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-030 — Rechazar en UI el alta de suscripción en USD con Monto mayor al máximo (`"1000000000000"`) · **PASSED**

**Esperado:** Se abre `"Nueva suscripción"` Queda seleccionada la moneda `"USD"` El campo muestra `Netflix USD` El campo muestra `1000000000000` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo muestra `10` La URL sigue siendo `/subscriptions/new` y debajo de `"Monto"` aparece `"El monto máximo es USD 999.999.999.999,99"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-031 — Rechazar en API `create_subscription` en USD con Monto mayor al máximo (`"1000000000000.00"`) · **PASSED**

**Esperado:** Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "El monto máximo es USD 999.999.999.999,99"` Respuesta HTTP `200 OK` con body `[]` (0 filas)

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas)
— Observado en la corrida —
HTTP 400 {"code":"23514","details":null,"hint":null,"message":"El monto máximo es USD 999.999.999.999,99"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-032 — Rechazar en UI el alta de suscripción sin elegir Categoría · **PASSED**

**Esperado:** Se abre `"Nueva suscripción"` El campo muestra `Netflix` El campo muestra `5000` `"Medio de pago"` muestra `"Efectivo"` y `"Categoría"` queda en `"Elegí…"` El campo muestra `10` La URL sigue siendo `/subscriptions/new` y debajo de `"Categoría"` aparece `"Elegí una categoría"`

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: La URL sigue siendo /subscriptions/new y debajo de "Categoría" aparece "Elegí una categoría"
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-033 — Rechazar en API `create_subscription` con `p_category_id = null` · **PASSED**

**Esperado:** Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "Elegí una categoría"` Respuesta HTTP `200 OK` con body `[]` (0 filas)

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas)
— Observado en la corrida —
HTTP 400 {"code":"23514","details":null,"hint":null,"message":"Elegí una categoría"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-034 — Rechazar en UI el alta de suscripción sin elegir Medio de pago · **PASSED**

**Esperado:** Se abre `"Nueva suscripción"` El campo muestra `Netflix` El campo muestra `5000` `"Categoría"` muestra `"Entretenimiento"` y `"Medio de pago"` queda en `"Elegí…"` El campo muestra `10` La URL sigue siendo `/subscriptions/new` y debajo de `"Medio de pago"` aparece `"Elegí un medio de pago"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-035 — Rechazar en API `create_subscription` con `p_account_id = null` · **PASSED**

**Esperado:** Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "Elegí un medio de pago"` Respuesta HTTP `200 OK` con body `[]` (0 filas)

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas)
— Observado en la corrida —
HTTP 400 {"code":"23514","details":null,"hint":null,"message":"Elegí un medio de pago"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-036 — Rechazar en UI el alta de suscripción con Día de cobro vacío · **PASSED**

**Esperado:** Se abre `"Nueva suscripción"` El campo muestra `Netflix` El campo muestra `5000` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` y `"Día de cobro"` queda vacío La URL sigue siendo `/subscriptions/new` y debajo de `"Día de cobro"` aparece `"Indicá el día de cobro"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-037 — Rechazar en API `create_subscription` con `p_billing_day = null` · **PASSED**

**Esperado:** Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "Indicá el día de cobro"` Respuesta HTTP `200 OK` con body `[]` (0 filas)

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas)
— Observado en la corrida —
HTTP 400 {"code":"23514","details":null,"hint":null,"message":"Indicá el día de cobro"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-038 — Rechazar en UI el alta de suscripción con Día de cobro `"0"` · **PASSED**

**Esperado:** Se abre `"Nueva suscripción"` El campo muestra `Netflix` El campo muestra `5000` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo muestra `0` La URL sigue siendo `/subscriptions/new` y debajo de `"Día de cobro"` aparece `"El día de cobro va de 1 a 31"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-039 — Rechazar en API `create_subscription` con `p_billing_day = 0` · **PASSED**

**Esperado:** Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "El día de cobro va de 1 a 31"` Respuesta HTTP `200 OK` con body `[]` (0 filas)

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas)
— Observado en la corrida —
HTTP 400 {"code":"23514","details":null,"hint":null,"message":"El día de cobro va de 1 a 31"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-040 — Rechazar en UI el alta de suscripción con Día de cobro `"32"` · **PASSED**

**Esperado:** Se abre `"Nueva suscripción"` El campo muestra `Netflix` El campo muestra `5000` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo muestra `32` La URL sigue siendo `/subscriptions/new` y debajo de `"Día de cobro"` aparece `"El día de cobro va de 1 a 31"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-041 — Rechazar en API `create_subscription` con `p_billing_day = 32` · **PASSED**

**Esperado:** Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "El día de cobro va de 1 a 31"` Respuesta HTTP `200 OK` con body `[]` (0 filas)

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas)
— Observado en la corrida —
HTTP 400 {"code":"23514","details":null,"hint":null,"message":"El día de cobro va de 1 a 31"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-042 — Bloquear en UI la escritura de letras, coma y signo menos en Día de cobro · **PASSED**

**Esperado:** Se abre `"Nueva suscripción"` El campo toma foco El campo `"Día de cobro"` ignora `-`, `,` y `a` y muestra únicamente `15`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-043 — Rechazar en API `create_subscription` con Día de cobro no entero (`p_billing_day = 1.5`) · **PASSED**

**Esperado:** Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "El día de cobro va de 1 a 31"` Respuesta HTTP `200 OK` con body `[]` (0 filas)

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas)
— Observado en la corrida —
HTTP 400 {"code":"23514","details":null,"hint":null,"message":"El día de cobro va de 1 a 31"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-044 — Rechazar en UI el alta de suscripción con Mes de inicio vacío · **PASSED**

**Esperado:** Se abre `"Nueva suscripción"` El campo muestra `Netflix` El campo muestra `5000` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo muestra `10` `"Mes de inicio"` queda vacío La URL sigue siendo `/subscriptions/new` y debajo de `"Mes de inicio"` aparece `"Elegí el mes de inicio"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-045 — Rechazar en API `create_subscription` con `p_start_period = null` · **PASSED**

**Esperado:** Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "Elegí el mes de inicio"` Respuesta HTTP `200 OK` con body `[]` (0 filas)

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas)
— Observado en la corrida —
HTTP 400 {"code":"23514","details":null,"hint":null,"message":"Elegí el mes de inicio"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-046 — Rechazar en UI el alta de suscripción con Mes de inicio anterior al límite inferior (`-25` meses) · **PASSED**

**Esperado:** Se abre `"Nueva suscripción"` El campo muestra `Netflix` El campo muestra `5000` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo muestra `10` `"Mes de inicio"` muestra `<MES_HACE_25>` La URL sigue siendo `/subscriptions/new` y debajo de `"Mes de inicio"` aparece `"El mes de inicio va de <mes hace 24> a <mes +12>"` (ej. `"El mes de inicio va de octubre 2024 a octubre 2027"`)

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-047 — Rechazar en API `create_subscription` con Mes de inicio anterior al límite inferior (`-25` meses) · **PASSED**

**Esperado:** Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "El mes de inicio va de <mes hace 24> a <mes +12>"` Respuesta HTTP `200 OK` con body `[]` (0 filas)

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas)
— Observado en la corrida —
HTTP 400 {"code":"23514","details":null,"hint":null,"message":"El mes de inicio va de octubre 2024 a octubre 2027"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-048 — Rechazar en UI el alta de suscripción con Mes de inicio posterior al límite superior (`+13` meses) · **PASSED**

**Esperado:** Se abre `"Nueva suscripción"` El campo muestra `Netflix` El campo muestra `5000` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo muestra `10` `"Mes de inicio"` muestra `<MES_MAS_13>` La URL sigue siendo `/subscriptions/new` y debajo de `"Mes de inicio"` aparece `"El mes de inicio va de <mes hace 24> a <mes +12>"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-049 — Rechazar en API `create_subscription` con Mes de inicio posterior al límite superior (`+13` meses) · **PASSED**

**Esperado:** Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "El mes de inicio va de <mes hace 24> a <mes +12>"` Respuesta HTTP `200 OK` con body `[]` (0 filas)

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas)
— Observado en la corrida —
HTTP 400 {"code":"23514","details":null,"hint":null,"message":"El mes de inicio va de octubre 2024 a octubre 2027"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-050 — Rechazar en UI el alta de suscripción con Mes de fin anterior al Mes de inicio · **PASSED**

**Esperado:** Se abre `"Nueva suscripción"` con `"Mes de inicio"` en `<MES_ACTUAL>` El campo muestra `Netflix` El campo muestra `5000` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo muestra `10` `"Mes de fin (opcional)"` muestra `<MES_ANTERIOR>` La URL sigue siendo `/subscriptions/new` y debajo de `"Mes de fin (opcional)"` aparece `"El mes de fin no puede ser anterior al de inicio"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-051 — Rechazar en API `create_subscription` con `p_end_period < p_start_period` · **PASSED**

**Esperado:** Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "El mes de fin no puede ser anterior al de inicio"` Respuesta HTTP `200 OK` con body `[]` (0 filas)

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas)
— Observado en la corrida —
HTTP 400 {"code":"23514","details":null,"hint":null,"message":"El mes de fin no puede ser anterior al de inicio"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-052 — Rechazar en UI el alta de suscripción con Mes de fin posterior a diciembre 2099 (`"2100-01"`) · **PASSED**

**Esperado:** Se abre `"Nueva suscripción"` El campo muestra `Netflix` El campo muestra `5000` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo muestra `10` `"Mes de fin (opcional)"` muestra `2100-01` La URL sigue siendo `/subscriptions/new` y debajo de `"Mes de fin (opcional)"` aparece `"El mes de fin puede ser como máximo diciembre 2099"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-053 — Rechazar en API `create_subscription` con `p_end_period = "2100-01-01"` · **PASSED**

**Esperado:** Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "El mes de fin puede ser como máximo diciembre 2099"` Respuesta HTTP `200 OK` con body `[]` (0 filas)

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas)
— Observado en la corrida —
HTTP 400 {"code":"23514","details":null,"hint":null,"message":"El mes de fin puede ser como máximo diciembre 2099"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-054 — Dar de alta una suscripción con Descripción de 200 caracteres se acepta y la UI recorta el carácter 201 · **PASSED**

**Esperado:** Se abre `"Nueva suscripción"` El campo muestra `Netflix` El campo muestra `5000` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo muestra `10` `"Mes de inicio"` muestra `<MES_SIGUIENTE>` El campo conserva únicamente las 200 letras `"a"` (sin la `"Z"`) y el contador inferior indica `200/200` Navega a `/subscriptions/<SUB_ID>` y muestra `"Suscripción guardada"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-055 — Rechazar en API `create_subscription` con Descripción de 201 caracteres · **PASSED**

**Esperado:** Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "La descripción admite hasta 200 caracteres"` Respuesta HTTP `200 OK` con body `[]` (0 filas)

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas)
— Observado en la corrida —
HTTP 400 {"code":"23514","details":null,"hint":null,"message":"La descripción admite hasta 200 caracteres"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-056 — Rechazar en API `create_subscription` con `p_category_id` propia archivada · **PASSED**

**Esperado:** Respuesta HTTP `409 Conflict` con `"code": "23503"` y `"message": "La categoría no está disponible"` Respuesta HTTP `200 OK` con body `[]` (0 filas)

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas)
— Observado en la corrida —
HTTP 409 {"code":"23503","details":null,"hint":null,"message":"La categoría no está disponible"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-057 — Rechazar en API `create_subscription` con `p_account_id` propia archivada · **PASSED**

**Esperado:** Respuesta HTTP `409 Conflict` con `"code": "23503"` y `"message": "El medio de pago no está disponible"` Respuesta HTTP `200 OK` con body `[]` (0 filas)

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas)
— Observado en la corrida —
HTTP 409 {"code":"23503","details":null,"hint":null,"message":"El medio de pago no está disponible"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-058 — Rechazar en API `create_subscription` usando `p_category_id` de otro usuario · **PASSED**

**Esperado:** Respuesta HTTP `409 Conflict` con `"code": "23503"` y `"message": "La categoría no está disponible"` Respuesta HTTP `200 OK` con body `[]` (0 filas)

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas)
— Observado en la corrida —
HTTP 409 {"code":"23503","details":null,"hint":null,"message":"La categoría no está disponible"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-059 — Rechazar en API `create_subscription` usando `p_account_id` de otro usuario · **PASSED**

**Esperado:** Respuesta HTTP `409 Conflict` con `"code": "23503"` y `"message": "El medio de pago no está disponible"` Respuesta HTTP `200 OK` con body `[]` (0 filas)

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas)
— Observado en la corrida —
HTTP 409 {"code":"23503","details":null,"hint":null,"message":"El medio de pago no está disponible"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-060 — Rechazar en API un `INSERT` directo sobre `/rest/v1/subscriptions` con la sesión del usuario · **PASSED**

**Esperado:** Respuesta HTTP `403 Forbidden` con `"code": "42501"` (`permission denied for table subscriptions`) Respuesta HTTP `200 OK` con body `[]` (0 filas)

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas)
— Observado en la corrida —
HTTP 403 {"code":"42501","details":null,"hint":"Grant the required privileges to the current role with: GRANT INSERT ON public.subscriptions TO authenticated;","message":"permission denied for table subscriptions"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-061 — Rechazar en API un `DELETE` directo sobre `/rest/v1/subscriptions` con la sesión del usuario · **PASSED**

**Esperado:** Respuesta HTTP `403 Forbidden` con `"code": "42501"` (`permission denied for table subscriptions`) Respuesta HTTP `200 OK` con 1 fila (`"id": "<SUB_ID>"`, `"status": "active"`)

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con 1 fila ("id": "<SUB_ID>", "status": "active")
— Observado en la corrida —
HTTP 403 {"code":"42501","details":null,"hint":"Grant the required privileges to the current role with: GRANT DELETE ON public.subscriptions TO authenticated;","message":"permission denied for table subscriptions"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-062 — Dos toques seguidos en `"Guardar suscripción"` deshabilitan el botón y crean una sola suscripción · **PASSED**

**Esperado:** Se abre `/subscriptions` Se abre `/subscriptions/new` El campo muestra `Netflix` El campo muestra `5000` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo muestra `28` `"Mes de inicio"` muestra `<MES_SIGUIENTE>` Tras el primer toque el botón queda deshabilitado (`disabled`) con el texto `"Guardando…"` y al completar navega a `/subscriptions/<SUB_ID>` mostrando el aviso `"Suscripción guardada"` (`subscription-toast`) Navega a `/subscriptions` y bajo `"Activas"` aparece una única fila `"Netflix"` (`subscriptions-item`)

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-063 — Rechazar en UI ver el detalle de una suscripción de otro usuario mostrando `subscription-detail-not-found` · **PASSED**

**Esperado:** Se muestra el estado `subscription-detail-not-found` con el texto `"No encontramos esta suscripción."` y el enlace `"Ver suscripciones"` (`subscription-detail-not-found-back`), sin exponer ningún dato de `"Netflix B"`

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se muestra el estado subscription-detail-not-found con el texto "No encontramos esta suscripción." y el enlace "Ver suscripciones" (subscription-detail-not-found-back), sin exponer ningún dato de "Netflix B"
```

**Informe previo del equipo:** No sabe cómo testearlo: el caso dice directamente que se sume la primera suscripción.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-064 — Rechazar en API leer una suscripción de otro usuario (`GET /rest/v1/subscriptions` devuelve `[]`) · **PASSED**

**Esperado:** Respuesta HTTP `200 OK` con body `[]` (0 filas devueltas por RLS)

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas devueltas por RLS)
— Observado en la corrida —
HTTP 200 []
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-065 — Rechazar en API `create_subscription` sin sesión autenticada (rol `anon`) · **FAILED**

**Esperado:** Respuesta HTTP `403 Forbidden` con `"code": "42501"` (`permission denied for function create_subscription`)

**Obtenido:**

```text
esperado HTTP 403 42501; obtenido HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function create_subscription"} (el código 42501 coincide; cambia el HTTP: la API responde 401 al rol anon)
— Observado en la corrida —
HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function create_subscription"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Defectos:** DEF-035
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-066 — Rechazar en API `GET /rest/v1/subscriptions` sin sesión autenticada (rol `anon`) · **FAILED**

**Esperado:** Respuesta HTTP `403 Forbidden` con `"code": "42501"` (`permission denied for table subscriptions`)

**Obtenido:**

```text
esperado HTTP 403 42501; obtenido HTTP 401 {"code":"42501","details":null,"hint":"Grant the required privileges to the current role with: GRANT SELECT ON public.subscriptions TO anon;","message":"permission denied for table subscriptions"} (el código 42501 coincide; cambia el HTTP: la API responde 401 al rol anon)
— Observado en la corrida —
HTTP 401 {"code":"42501","details":null,"hint":"Grant the required privileges to the current role with: GRANT SELECT ON public.subscriptions TO anon;","message":"permission denied for table subscriptions"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Defectos:** DEF-035
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-067 — Mostrar estado vacío `subscriptions-empty` y ocultar la tarjeta del total comprometido cuando el usuario no tiene suscripciones · **PASSED**

**Esperado:** Se abre `/subscriptions`; se muestra `subscriptions-empty` con el texto `"Todavía no tenés suscripciones. Cargá lo que pagás todos los meses y se registra solo."` y el botón `"Agregar la primera"` (`subscriptions-empty-new`), y no se muestra la tarjeta `subscriptions-committed`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-068 — Mostrar aviso `subscription-form-category-empty` y enlace `"Ir a Ajustes"` cuando el usuario no tiene categorías activas · **PASSED**

**Esperado:** Se abre `/subscriptions` Se abre `/subscriptions/new`; se muestra `subscription-form-category-empty` con el texto `"No tenés categorías activas."` y el enlace `"Ir a Ajustes"` (`subscription-form-category-empty-settings`) que apunta a `/settings`

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se abre /subscriptions/new; se muestra subscription-form-category-empty con el texto "No tenés categorías activas." y el enlace "Ir a Ajustes" (subscription-form-category-empty-settings) que apunta a /settings
— Observado en la corrida —
subscription-form-category-empty: existe; formulario habilitado: true
```

**Informe previo del equipo:** No aparece ningún cartel de esos; solo aparece el formulario para cargar los datos.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-069 — Mostrar aviso `subscription-form-account-empty` y enlace `"Ir a Ajustes"` cuando el usuario no tiene medios de pago activos · **PASSED**

**Esperado:** Se abre `/subscriptions` Se abre `/subscriptions/new`; se muestra `subscription-form-account-empty` con el texto `"No tenés medios de pago activos."` y el enlace `"Ir a Ajustes"` (`subscription-form-account-empty-settings`) que apunta a `/settings`

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se abre /subscriptions/new; se muestra subscription-form-account-empty con el texto "No tenés medios de pago activos." y el enlace "Ir a Ajustes" (subscription-form-account-empty-settings) que apunta a /settings
— Observado en la corrida —
subscription-form-account-empty: existe; formulario habilitado: true
```

**Informe previo del equipo:** Se ve directamente el formulario habilitado en lugar del mensaje de aviso.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-070 — Puesta al día automática al entrar a la app genera 2 períodos vencidos pendientes y muestra el aviso `app-catchup-generated` · **PASSED**

**Esperado:** Se abre `/subscriptions` Se abre `/subscriptions/<SUB_ID>`; en `"Gastos cargados"` (`subscription-detail-occurrences`) aparecen exactamente 2 filas (`subscription-detail-occurrence`): `<MES_ANTERIOR>` (`28/<MES_ANTERIOR>`, `"USD 10,00"`) y `<MES_HACE_2>` (`28/<MES_HACE_2>`, `"USD 10,00"`)

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-071 — Recargar la página y navegar entre pestañas con las suscripciones al día no crea transacciones nuevas ni muestra `app-catchup-generated` · **PASSED**

**Esperado:** Se abre `/subscriptions` sin volver a disparar aviso `app-catchup-generated` La página recarga `/subscriptions` mostrando `"Netflix"` y no aparece `app-catchup-generated` ni `app-catchup-error` Se abre `/subscriptions/<SUB_ID>`; en `"Gastos cargados"` (`subscription-detail-occurrences`) siguen existiendo exactamente 2 filas (`<MES_ANTERIOR>` y `<MES_HACE_2>`, sin duplicados)

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-072 — Dos llamadas consecutivas por API a `run_subscription_catchup` responden `200 OK` sin error y dejan exactamente 1 transacción por período · **PASSED**

**Esperado:** Respuesta HTTP `200 OK` con body `{"generated": 2, "failed": []}` Respuesta HTTP `200 OK` con body `{"generated": 0, "failed": []}` (sin error `23505`) Respuesta HTTP `200 OK` con exactamente 2 filas: `subscription_period = "<MES_HACE_2>-01"` y `subscription_period = "<MES_ANTERIOR>-01"`, ambas con `"amount_text": "10.00"`, `"installments_count": 1` y `"type": "expense"`

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con exactamente 2 filas: subscription_period = "<MES_HACE_2>-01" y subscription_period = "<MES_ANTERIOR>-01", ambas con "amount_text": "10.00", "installments_count": 1 y "type": "expense"
— Observado en la corrida —
HTTP 200 {"failed":[],"generated":2}
HTTP 200 {"failed":[],"generated":0}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-073 — `run_subscription_catchup` sigue generando ocurrencias aunque la categoría y el medio de pago se hayan archivado después del alta · **PASSED**

**Esperado:** Respuesta HTTP `200 OK` con body `{"generated": 1, "failed": []}` Respuesta HTTP `200 OK` con 1 fila (`"subscription_period": "<MES_ANTERIOR>-01"`, `"category_id": "<CATEGORY_ID>"`, `"account_id": "<ACCOUNT_ID>"`, `"amount_text": "10.00"`)

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con 1 fila ("subscription_period": "<MES_ANTERIOR>-01", "category_id": "<CATEGORY_ID>", "account_id": "<ACCOUNT_ID>", "amount_text": "10.00")
— Observado en la corrida —
HTTP 200 {"failed":[],"generated":1}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-074 — Suscripción en estado `paused` no genera ocurrencias al ejecutar `run_subscription_catchup` · **PASSED**

**Esperado:** Respuesta HTTP `200 OK` con body `{"generated": 0, "failed": []}` Respuesta HTTP `200 OK` con body `[]` (0 filas)

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas)
— Observado en la corrida —
HTTP 200 {"failed":[],"generated":0}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-075 — Suscripción en estado `cancelled` no genera ocurrencias al ejecutar `run_subscription_catchup` · **PASSED**

**Esperado:** Respuesta HTTP `200 OK` con body `{"generated": 0, "failed": []}` Respuesta HTTP `200 OK` con body `[]` (0 filas)

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con body [] (0 filas)
— Observado en la corrida —
HTTP 200 {"failed":[],"generated":0}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-076 — Dar de alta una suscripción con rango cerrado en el pasado (`<MES_HACE_4>` a `<MES_HACE_2>`) genera exactamente esos 3 meses y muestra `"Terminó en <mes hace 2>"` · **PASSED**

**Esperado:** Se abre `/subscriptions` Se abre `/subscriptions/new` El campo muestra `Curso trimestral` El campo muestra `8000` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo muestra `10` `"Mes de inicio"` muestra `<MES_HACE_4>` `"Mes de fin (opcional)"` muestra `<MES_HACE_2>` y `subscription-form-preview-summary` muestra `"Al guardar se cargan 3 gastos de $8.000,00 (total $24.000,00)."` Navega a `/subscriptions/<SUB_ID>`, muestra el aviso `"Suscripción guardada. Se cargaron 3 gastos vencidos."` (`subscription-toast`), `"Próximo cobro"` (`subscription-detail-next-charge`) muestra `"—"` y `"Gastos cargados"` (`subscription-detail-occurrences`) lista exactamente 3 filas (`<MES_HACE_2>`, `<MES_HACE_3>` y `<MES_HACE_4>`), sin crear `<MES_ANTERIOR>` ni `<MES_ACTUAL>` Navega a `/subscriptions`; bajo el grupo `"Activas"` la fila `"Curso trimestral"` (`subscriptions-item` con `data-status="active"`) muestra `"Terminó en <mes hace 2>"` (`subscriptions-item-ended`, ej. `"Terminó en agosto 2026"`) en lugar de `"Se cobra el día 10"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-077 — Suscripción en USD cuyo monto en pesos supera `$999.999.999.999,99` queda bloqueada con `"No se pudo cargar"` sin frenar otra suscripción activa ni mostrar `app-catchup-error` · **PASSED**

**Esperado:** Se abre `/subscriptions`; en la fila `"Enterprise USD"` (`subscriptions-item` con `data-subscription-id="<SUB_OVERFLOW_ID>"`) se muestra la marca `"No se pudo cargar"` (`subscriptions-item-blocked`) Se abre `/subscriptions/<SUB_OVERFLOW_ID>`; arriba de los datos se muestra el aviso `subscription-detail-blocked` con el texto `"El gasto de <mes anterior> no se pudo cargar porque en pesos supera $999.999.999.999,99 (o no llega a $0,01). Revisá el monto o el tipo de cambio de ese mes."` y **sin** el botón `"Cargar tipo de cambio"`

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Se abre /subscriptions/<SUB_OVERFLOW_ID>; arriba de los datos se muestra el aviso subscription-detail-blocked con el texto "El gasto de <mes anterior> no se pudo cargar porque en pesos supera $999.999.999.999,99 (o no llega a $0,01). Revisá el monto o el tipo de cambio de ese mes." y **sin** el botón "Cargar tipo de cambio"
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-078 — Suscripción con día de cobro `31` entre `2026-01` y `2026-04` genera ocurrencias con fechas `31/01/2026`, `28/02/2026`, `31/03/2026` y `30/04/2026` · **PASSED**

**Esperado:** Se abre `/subscriptions` Se abre `/subscriptions/new` El campo muestra `Adobe CC` El campo muestra `12000` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo muestra `31` `"Mes de inicio"` muestra `2026-01` En `"Se cargan al guardar"` (`subscription-form-preview-due`) aparecen las 4 filas con fechas `"enero 2026 · 31/01/2026"`, `"febrero 2026 · 28/02/2026"`, `"marzo 2026 · 31/03/2026"` y `"abril 2026 · 30/04/2026"` Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada. Se cargaron 4 gastos vencidos."` (`subscription-toast`) y en `"Gastos cargados"` (`subscription-detail-occurrences`) las 4 ocurrencias muestran las fechas `30/04/2026` (`data-period="2026-04"`), `31/03/2026` (`data-period="2026-03"`), `28/02/2026` (`data-period="2026-02"`) y `31/01/2026` (`data-period="2026-01"`)

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-079 — Suscripción con día de cobro `29` en febrero de año no bisiesto (`2026-02`) genera la ocurrencia con fecha `28/02/2026` · **PASSED**

**Esperado:** Se abre `/subscriptions` Se abre `/subscriptions/new` El campo muestra `Hosting 29` El campo muestra `6000` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo muestra `29` `"Mes de inicio"` muestra `2026-02` En `"Se cargan al guardar"` (`subscription-form-preview-due`) aparecen `"febrero 2026 · 28/02/2026"` y `"marzo 2026 · 29/03/2026"` Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada. Se cargaron 2 gastos vencidos."` (`subscription-toast`) y en `"Gastos cargados"` (`subscription-detail-occurrences`) aparecen `29/03/2026` (`data-period="2026-03"`) y `28/02/2026` (`data-period="2026-02"`)

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-080 — Suscripción con día de cobro `30` en febrero de año no bisiesto (`2026-02`) genera la ocurrencia con fecha `28/02/2026` · **PASSED**

**Esperado:** Se abre `/subscriptions` Se abre `/subscriptions/new` El campo muestra `Hosting 30` El campo muestra `6000` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo muestra `30` `"Mes de inicio"` muestra `2026-02` En `"Se cargan al guardar"` (`subscription-form-preview-due`) aparecen `"febrero 2026 · 28/02/2026"` y `"marzo 2026 · 30/03/2026"` Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada. Se cargaron 2 gastos vencidos."` (`subscription-toast`) y en `"Gastos cargados"` (`subscription-detail-occurrences`) aparecen `30/03/2026` (`data-period="2026-03"`) y `28/02/2026` (`data-period="2026-02"`)

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-081 — Suscripción con día de cobro `<DIA_MAÑANA>` no genera la ocurrencia del mes corriente · **PASSED**

**Esperado:** Se abre `/subscriptions` Se abre `/subscriptions/new` El campo muestra `Mañana TV` El campo muestra `5000` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo muestra `<DIA_MAÑANA>` En `subscription-form-preview-due` aparece únicamente `<MES_ANTERIOR>` y `subscription-form-preview-summary` muestra `"Al guardar se carga 1 gasto de $5.000,00."` Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada. Se cargó 1 gasto vencido."` (`subscription-toast`), `"Próximo cobro"` (`subscription-detail-next-charge`) muestra la fecha de mañana en `<MES_ACTUAL>` y en `"Gastos cargados"` (`subscription-detail-occurrences`) figura únicamente `<MES_ANTERIOR>` (1 fila)

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-082 — Suscripción con día de cobro igual a `<DIA_HOY>` genera la ocurrencia del mes corriente · **PASSED**

**Esperado:** Se abre `/subscriptions` Se abre `/subscriptions/new` El campo muestra `Hoy TV` El campo muestra `5000` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo muestra `<DIA_HOY>` En `subscription-form-preview-due` aparecen `<MES_ANTERIOR>` y `<MES_ACTUAL>` y `subscription-form-preview-summary` muestra `"Al guardar se cargan 2 gastos de $5.000,00 (total $10.000,00)."` Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada. Se cargaron 2 gastos vencidos."` (`subscription-toast`) y en `"Gastos cargados"` (`subscription-detail-occurrences`) aparecen `<MES_ACTUAL>` (con fecha `<HOY>`) y `<MES_ANTERIOR>`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-083 — Suscripción con día de cobro `<DIA_AYER>` genera la ocurrencia del mes corriente con fecha de ayer · **PASSED**

**Esperado:** Se abre `/subscriptions` Se abre `/subscriptions/new` El campo muestra `Ayer TV` El campo muestra `5000` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo muestra `<DIA_AYER>` En `subscription-form-preview-due` aparecen `<MES_ANTERIOR>` y `<MES_ACTUAL>` y `subscription-form-preview-summary` muestra `"Al guardar se cargan 2 gastos de $5.000,00 (total $10.000,00)."` Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada. Se cargaron 2 gastos vencidos."` (`subscription-toast`) y en `"Gastos cargados"` (`subscription-detail-occurrences`) aparece la fila de `<MES_ACTUAL>` con fecha día `<DIA_AYER>` (ej. `"05/10/2026"`) junto a la de `<MES_ANTERIOR>`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-084 — Períodos anteriores al corriente se generan siempre aunque el día de cobro (`28`) sea posterior a `<DIA_HOY>` · **PASSED**

**Esperado:** Se abre `/subscriptions` Se abre `/subscriptions/new` El campo muestra `Mensual 28` El campo muestra `5000` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo muestra `28` En `subscription-form-preview-due` aparecen `<MES_HACE_2>` y `<MES_ANTERIOR>` y `subscription-form-preview-summary` muestra `"Al guardar se cargan 2 gastos de $5.000,00 (total $10.000,00)."` Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada. Se cargaron 2 gastos vencidos."` (`subscription-toast`) y en `"Gastos cargados"` (`subscription-detail-occurrences`) aparecen las 2 filas (`28/<MES_ANTERIOR>` y `28/<MES_HACE_2>`), sin haber creado `<MES_ACTUAL>`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-085 — Pausar suscripción activa con día de cobro `28` (`> <DIA_HOY>`) muestra advertencia de este mes y pasa a `"Pausada desde <HOY>"` con piso en `<MES_SIGUIENTE>` · **PASSED**

**Esperado:** Se abre `/subscriptions` Se abre `/subscriptions/<SUB_ID>` Se abre el diálogo `pause-subscription-dialog` con el título `"¿Pausar Netflix?"`, el texto `"Mientras esté pausada no se cargan gastos."` seguido de `"Este mes tampoco se cobra si todavía no llegó el día 28, aunque la reanudes antes."` y los botones `"Cancelar"` (`pause-subscription-dialog-cancel`) y `"Pausar"` (`pause-subscription-dialog-confirm`) Se cierra el diálogo, aparece el aviso `"Suscripción pausada"` (`subscription-toast`), el estado (`subscription-detail-status`) cambia a `"Pausada desde <HOY>"` (con `data-status="paused"`), `"Próximo cobro"` (`subscription-detail-next-charge`) muestra `"—"`, `"Pausar"` se reemplaza por `"Reanudar"` (`subscription-detail-resume`) y `"Gastos cargados"` conserva intacta la ocurrencia de `<MES_ANTERIOR>` por `"$5.000,00"` Navega a `/subscriptions`; `"Netflix"` aparece bajo el grupo `"Pausadas"` (`subscriptions-item` con `data-status="paused"`)

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-086 — Pausar suscripción activa cuyo cobro del mes corriente ya fue generado (`<DIA_AYER>`) no muestra la oración `"Este mes tampoco se cobra..."` · **PASSED**

**Esperado:** Se abre `/subscriptions` Se abre `/subscriptions/<SUB_ID>` Se abre el diálogo `pause-subscription-dialog` con el texto `"Mientras esté pausada no se cargan gastos."` y **sin** la oración `"Este mes tampoco se cobra..."` Se cierra el diálogo, muestra `"Suscripción pausada"` (`subscription-toast`) y el estado (`subscription-detail-status`) cambia a `"Pausada desde <HOY>"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-087 — Tocar `"Cancelar"` en el diálogo de pausa cierra el diálogo y mantiene la suscripción `"Activa"` · **PASSED**

**Esperado:** Se abre `/subscriptions` Se abre `/subscriptions/<SUB_ID>` Se abre el diálogo `pause-subscription-dialog` El diálogo se cierra y el estado (`subscription-detail-status`) sigue siendo `"Activa"` (`data-status="active"`)

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-088 — `pause_subscription` por API ejecuta primero la puesta al día y genera los meses vencidos pendientes antes de pausar · **PASSED**

**Esperado:** Respuesta HTTP `200 OK` con body `{"generated_before": 2}` Respuesta HTTP `200 OK` con 2 filas (`"subscription_period": "<MES_HACE_2>-01"` y `"subscription_period": "<MES_ANTERIOR>-01"`) Respuesta HTTP `200 OK` con `"status": "paused"`, `"paused_at"` no nulo y `"generate_from_period": "<MES_SIGUIENTE>-01"`

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con "status": "paused", "paused_at" no nulo y "generate_from_period": "<MES_SIGUIENTE>-01"
— Observado en la corrida —
HTTP 200 {"generated_before":2}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-089 — Pausar suscripción en USD con mes bloqueado por falta de tipo de cambio muestra `pause-subscription-dialog-blocked-warning` y quita el bloqueo al confirmar · **PASSED**

**Esperado:** Se abre `/subscriptions`; en la fila `"ChatGPT Plus"` (`subscriptions-item`) se muestra la marca `"Falta tipo de cambio"` (`subscriptions-item-blocked`) Se abre `/subscriptions/<SUB_ID>`; se muestra el aviso `subscription-detail-blocked` Se abre el diálogo `pause-subscription-dialog` mostrando `pause-subscription-dialog-blocked-warning` con el texto `"<Mes anterior> no se cargó por falta de tipo de cambio. Si la pausás, ese mes no se va a cargar."` (ej. `"Septiembre 2026 no se cargó por falta de tipo de cambio. Si la pausás, ese mes no se va a cargar."`) El diálogo se cierra, muestra `"Suscripción pausada"` (`subscription-toast`), el estado (`subscription-detail-status`) cambia a `"Pausada desde <HOY>"`, desaparece el aviso `subscription-detail-blocked` y en `"Gastos cargados"` se lee `"Todavía no se cargó ningún gasto."` (`subscription-detail-occurrences-empty`)

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-090 — Cargar en Ajustes el tipo de cambio de un mes descartado al pausar y luego reanudar la suscripción no genera retroactivamente ese mes · **PASSED**

**Esperado:** Se abre `/settings` El campo muestra `<MES_ANTERIOR>` El campo muestra `1200` Se guarda el tipo de cambio de `<MES_ANTERIOR>` y no aparece `app-catchup-generated` Se abre `/subscriptions` Se abre `/subscriptions/<SUB_ID>` Se abre el diálogo `resume-subscription-dialog` con el título `"¿Reanudar ChatGPT Plus?"` y el texto `"No se cargan los meses en los que estuvo pausada. Próximo cobro: 28/<MES_SIGUIENTE>."` El diálogo se cierra, muestra `"Suscripción reanudada"` (`subscription-toast`), el estado (`subscription-detail-status`) cambia a `"Activa"` y `"Gastos cargados"` sigue mostrando `"Todavía no se cargó ningún gasto. El primero se carga el 28/<MES_SIGUIENTE>."` (`subscription-detail-occurrences-empty`)

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-091 — Rechazar en API `pause_subscription` sobre una suscripción que ya está en estado `paused` · **PASSED**

**Esperado:** Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "La suscripción ya está pausada"` Respuesta HTTP `200 OK` con `[{"status":"paused"}]`

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con [{"status":"paused"}]
— Observado en la corrida —
HTTP 400 {"code":"23514","details":null,"hint":null,"message":"La suscripción ya está pausada"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-092 — Rechazar en API `pause_subscription` sobre una suscripción en estado `cancelled` · **PASSED**

**Esperado:** Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "Una suscripción cancelada no se puede modificar"` Respuesta HTTP `200 OK` con `"status": "cancelled"` y `"cancelled_at"` no nulo

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con "status": "cancelled" y "cancelled_at" no nulo
— Observado en la corrida —
HTTP 400 {"code":"23514","details":null,"hint":null,"message":"Una suscripción cancelada no se puede modificar"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-093 — Rechazar en API un `PATCH` directo de `status` sobre `/rest/v1/subscriptions` con la sesión del usuario · **PASSED**

**Esperado:** Respuesta HTTP `403 Forbidden` con `"code": "42501"` (`permission denied for table subscriptions`) Respuesta HTTP `200 OK` con `[{"status":"active","paused_at":null}]`

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con [{"status":"active","paused_at":null}]
— Observado en la corrida —
HTTP 403 {"code":"42501","details":null,"hint":"Grant the required privileges to the current role with: GRANT UPDATE ON public.subscriptions TO authenticated;","message":"permission denied for table subscriptions"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-094 — Rechazar en API `pause_subscription` usando la sesión de otro usuario (`404 P0002`) · **FAILED**

**Esperado:** Respuesta HTTP `404 Not Found` con `"code": "P0002"` y `"message": "Suscripción no encontrada"` Respuesta HTTP `200 OK` con `[{"status":"active","paused_at":null}]`

**Obtenido:**

```text
esperado HTTP 404 P0002 «Suscripción no encontrada»; obtenido HTTP 500 {"code":"P0002","details":null,"hint":null,"message":"Suscripción no encontrada"}
— Observado en la corrida —
HTTP 500 {"code":"P0002","details":null,"hint":null,"message":"Suscripción no encontrada"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Defectos:** DEF-034
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-095 — Rechazar en API `pause_subscription` sin sesión autenticada (rol `anon`) · **FAILED**

**Esperado:** Respuesta HTTP `403 Forbidden` con `"code": "42501"` (`permission denied for function pause_subscription`)

**Obtenido:**

```text
esperado HTTP 403 42501; obtenido HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function pause_subscription"} (el código 42501 coincide; cambia el HTTP: la API responde 401 al rol anon)
— Observado en la corrida —
HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function pause_subscription"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Defectos:** DEF-035
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-096 — Reanudar suscripción pausada abre `resume-subscription-dialog`, pasa a `"Activa"`, limpia `paused_at`, conserva `generate_from_period = '<MES_SIGUIENTE>-01'` y no genera el mes actual · **PASSED**

**Esperado:** Se abre `/subscriptions` Se abre `/subscriptions/<SUB_ID>`; `"Gastos cargados"` muestra 1 sola fila (`<MES_ANTERIOR>`) Se abre el diálogo `resume-subscription-dialog` con el título `"¿Reanudar Netflix?"`, el texto `"No se cargan los meses en los que estuvo pausada."` seguido de `"Próximo cobro: 28/<MES_SIGUIENTE>."` y los botones `"Cancelar"` (`resume-subscription-dialog-cancel`) y `"Reanudar"` (`resume-subscription-dialog-confirm`) El diálogo se cierra, muestra el aviso `"Suscripción reanudada"` (`subscription-toast`), el estado (`subscription-detail-status`) cambia a `"Activa"` (`data-status="active"`), `"Próximo cobro"` (`subscription-detail-next-charge`) muestra `"28/<MES_SIGUIENTE>"` (coincidiendo con el diálogo), `"Reanudar"` se reemplaza por `"Pausar"` (`subscription-detail-pause`) y `"Gastos cargados"` conserva únicamente la ocurrencia de `<MES_ANTERIOR>` Navega a `/subscriptions`; `"Netflix"` aparece bajo el grupo `"Activas"` (`subscriptions-item` con `data-status="active"`)

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-097 — Reanudar suscripción pausada con `start_period` futuro (`<MES_MAS_3>`) conserva `generate_from_period = '<MES_MAS_3>-01'` y no genera gastos · **PASSED**

**Esperado:** Se abre `/subscriptions` Se abre `/subscriptions/<SUB_ID>` Se abre el diálogo `resume-subscription-dialog` con el texto `"No se cargan los meses en los que estuvo pausada. Próximo cobro: 15/<MES_MAS_3>."` El diálogo se cierra, muestra `"Suscripción reanudada"` (`subscription-toast`), el estado (`subscription-detail-status`) cambia a `"Activa"`, `"Próximo cobro"` (`subscription-detail-next-charge`) muestra `"15/<MES_MAS_3>"` y en `"Gastos cargados"` se lee `"Todavía no se cargó ningún gasto. El primero se carga el 15/<MES_MAS_3>."` (`subscription-detail-occurrences-empty`)

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-098 — Rechazar en API `resume_subscription` sobre una suscripción que ya está en estado `active` · **PASSED**

**Esperado:** Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "La suscripción no está pausada"` Respuesta HTTP `200 OK` con `[{"status":"active","generate_from_period":"<MES_SIGUIENTE>-01"}]`

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con [{"status":"active","generate_from_period":"<MES_SIGUIENTE>-01"}]
— Observado en la corrida —
HTTP 400 {"code":"23514","details":null,"hint":null,"message":"La suscripción no está pausada"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-099 — Rechazar en API `resume_subscription` sobre una suscripción en estado `cancelled` · **PASSED**

**Esperado:** Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "Una suscripción cancelada no se puede modificar"` Respuesta HTTP `200 OK` con `"status": "cancelled"` y `"cancelled_at"` no nulo

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con "status": "cancelled" y "cancelled_at" no nulo
— Observado en la corrida —
HTTP 400 {"code":"23514","details":null,"hint":null,"message":"Una suscripción cancelada no se puede modificar"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-100 — Rechazar en API `resume_subscription` usando la sesión de otro usuario (`404 P0002`) · **FAILED**

**Esperado:** Respuesta HTTP `404 Not Found` con `"code": "P0002"` y `"message": "Suscripción no encontrada"` Respuesta HTTP `200 OK` con `[{"status":"paused"}]`

**Obtenido:**

```text
esperado HTTP 404 P0002 «Suscripción no encontrada»; obtenido HTTP 500 {"code":"P0002","details":null,"hint":null,"message":"Suscripción no encontrada"}
— Observado en la corrida —
HTTP 500 {"code":"P0002","details":null,"hint":null,"message":"Suscripción no encontrada"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Defectos:** DEF-034
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-101 — Rechazar en API `resume_subscription` sin sesión autenticada (rol `anon`) · **FAILED**

**Esperado:** Respuesta HTTP `403 Forbidden` con `"code": "42501"` (`permission denied for function resume_subscription`)

**Obtenido:**

```text
esperado HTTP 403 42501; obtenido HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function resume_subscription"} (el código 42501 coincide; cambia el HTTP: la API responde 401 al rol anon)
— Observado en la corrida —
HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function resume_subscription"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Defectos:** DEF-035
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-102 — Cancelar suscripción activa con 4 gastos cargados mantiene el historial en el Detalle y en el Resumen y oculta los botones de acción · **PASSED**

**Esperado:** Se abre `/subscriptions` Se abre `/subscriptions/<SUB_ID>` Se abre el diálogo `cancel-subscription-dialog` con el título `"¿Cancelar Netflix?"`, el texto `"No se van a cargar más gastos. Los 4 gastos ya cargados se mantienen. No se puede deshacer: para volver a registrarla, creá una suscripción nueva."` y los botones `"Volver"` (`cancel-subscription-dialog-cancel`) y `"Cancelar suscripción"` (`cancel-subscription-dialog-confirm`) El diálogo se cierra, muestra el aviso `"Suscripción cancelada"` (`subscription-toast`), el estado (`subscription-detail-status`) cambia a `"Cancelada el <HOY>"` (`data-status="cancelled"`), `"Próximo cobro"` (`subscription-detail-next-charge`) muestra `"—"`, desaparecen los botones `"Editar"`, `"Pausar"`, `"Reanudar"` y `"Cancelar suscripción"`, y `"Gastos cargados"` (`subscription-detail-occurrences`) conserva las 4 filas Navega a `/subscriptions`; `"Netflix"` aparece bajo el grupo `"Canceladas"` (`subscriptions-item` con `data-status="cancelled"`) Se abre `/dashboard` La tarjeta `"Gastado en <mes corto anterior>"` (`dashboard-total-expenses`, ej. `"Gastado en septiembre"`) muestra `"$5.000,00"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-103 — Cancelar suscripción desde el estado `"Pausada"` (`paused -> cancelled`) fija `cancelled_at` y la mueve al grupo `"Canceladas"` · **PASSED**

**Esperado:** Se abre `/subscriptions` Se abre `/subscriptions/<SUB_ID>`; el estado (`subscription-detail-status`) muestra `"Pausada desde <HOY>"` Se abre el diálogo `cancel-subscription-dialog` con el texto `"No se van a cargar más gastos. El gasto ya cargado se mantiene. No se puede deshacer: para volver a registrarla, creá una suscripción nueva."` El diálogo se cierra, muestra `"Suscripción cancelada"` (`subscription-toast`), el estado (`subscription-detail-status`) cambia a `"Cancelada el <HOY>"` (`data-status="cancelled"`), `"Próximo cobro"` (`subscription-detail-next-charge`) muestra `"—"` y desaparecen todos los botones de acción

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-104 — `cancel_subscription` por API ejecuta primero la puesta al día y genera los meses vencidos pendientes antes de cancelar · **PASSED**

**Esperado:** Respuesta HTTP `200 OK` con body `{"generated_before": 2}` Respuesta HTTP `200 OK` con 2 filas (`"subscription_period": "<MES_HACE_2>-01"` y `"subscription_period": "<MES_ANTERIOR>-01"`) Respuesta HTTP `200 OK` con `"status": "cancelled"` y `"cancelled_at"` no nulo

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con "status": "cancelled" y "cancelled_at" no nulo
— Observado en la corrida —
HTTP 200 {"generated_before":2}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-105 — Cancelar suscripción en USD bloqueada sin gastos cargados muestra `cancel-subscription-dialog-blocked-warning` y `"Todavía no se cargó ningún gasto."` · **PASSED**

**Esperado:** Se abre `/subscriptions` Se abre `/subscriptions/<SUB_ID>` Se abre el diálogo `cancel-subscription-dialog` con el texto `"No se van a cargar más gastos. Todavía no se cargó ningún gasto. No se puede deshacer: para volver a registrarla, creá una suscripción nueva."` y la advertencia `cancel-subscription-dialog-blocked-warning` `"<Mes anterior> no se cargó por falta de tipo de cambio. Si la cancelás, ese mes no se va a cargar."` (ej. `"Septiembre 2026 no se cargó por falta de tipo de cambio. Si la cancelás, ese mes no se va a cargar."`) El diálogo se cierra, muestra `"Suscripción cancelada"` (`subscription-toast`), el estado (`subscription-detail-status`) cambia a `"Cancelada el <HOY>"` y desaparece el aviso `subscription-detail-blocked`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-106 — Rechazar en API `cancel_subscription` sobre una suscripción que ya está en estado `cancelled` · **PASSED**

**Esperado:** Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "Una suscripción cancelada no se puede modificar"` Respuesta HTTP `200 OK` con `[{"status":"cancelled"}]`

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con [{"status":"cancelled"}]
— Observado en la corrida —
HTTP 400 {"code":"23514","details":null,"hint":null,"message":"Una suscripción cancelada no se puede modificar"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-107 — Rechazar en API `cancel_subscription` usando la sesión de otro usuario (`404 P0002`) · **FAILED**

**Esperado:** Respuesta HTTP `404 Not Found` con `"code": "P0002"` y `"message": "Suscripción no encontrada"` Respuesta HTTP `200 OK` con `[{"status":"active"}]`

**Obtenido:**

```text
esperado HTTP 404 P0002 «Suscripción no encontrada»; obtenido HTTP 500 {"code":"P0002","details":null,"hint":null,"message":"Suscripción no encontrada"}
— Observado en la corrida —
HTTP 500 {"code":"P0002","details":null,"hint":null,"message":"Suscripción no encontrada"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Defectos:** DEF-034
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-108 — Rechazar en API `cancel_subscription` sin sesión autenticada (rol `anon`) · **FAILED**

**Esperado:** Respuesta HTTP `403 Forbidden` con `"code": "42501"` (`permission denied for function cancel_subscription`)

**Obtenido:**

```text
esperado HTTP 403 42501; obtenido HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function cancel_subscription"} (el código 42501 coincide; cambia el HTTP: la API responde 401 al rol anon)
— Observado en la corrida —
HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function cancel_subscription"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Defectos:** DEF-035
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-109 — Editar el monto de una suscripción activa de `$5.000,00` a `$7.000,00` conserva las 4 ocurrencias ya generadas en `$5.000,00` y muestra Moneda y Mes de inicio como solo lectura · **PASSED**

**Esperado:** Se abre `/subscriptions` Se abre `/subscriptions/<SUB_ID>` Se abre `/subscriptions/<SUB_ID>/edit` mostrando el aviso fijo `"Los cambios aplican desde el próximo cobro. Los gastos ya cargados no cambian."`, y `"Moneda"` (`subscription-form-currency-readonly`) y `"Mes de inicio"` (`subscription-form-start-period-readonly`) como texto de solo lectura El campo `"Monto"` muestra `7000` y `"Próximo cobro"` (`subscription-form-next-charge`) muestra `"Próximo cobro: 28/<MES_ACTUAL> por $7.000,00"` Navega a `/subscriptions/<SUB_ID>`, muestra el aviso `"Cambios guardados"` (`subscription-toast`), en `"Datos"` la fila `"Monto"` muestra `"$7.000,00"` y en `"Gastos cargados"` (`subscription-detail-occurrences`) las 4 filas existentes (`<MES_ANTERIOR>`, `<MES_HACE_2>`, `<MES_HACE_3>` y `<MES_HACE_4>`) siguen mostrando `"$5.000,00"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-110 — `update_subscription` por API genera primero los meses vencidos pendientes con el monto anterior antes de guardar el monto nuevo · **PASSED**

**Esperado:** Respuesta HTTP `200 OK` con body `{"generated_before": 2, "generated_after": 0}` Respuesta HTTP `200 OK` con 2 filas (`"subscription_period": "<MES_HACE_2>-01"` y `"subscription_period": "<MES_ANTERIOR>-01"`), ambas con `"amount_text": "10.00"` (el monto anterior) Respuesta HTTP `200 OK` con `[{"amount_text":"15.00"}]`

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con [{"amount_text":"15.00"}]
— Observado en la corrida —
HTTP 200 {"generated_after":0,"generated_before":2}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-111 — Editar la categoría y el medio de pago de una suscripción no modifica las transacciones ya generadas · **PASSED**

**Esperado:** Se abre `/subscriptions` Se abre `/subscriptions/<SUB_ID>` Se abre `/subscriptions/<SUB_ID>/edit` `"Categoría"` muestra `"Salud"` `"Medio de pago"` muestra `"Cuenta bancaria"` Navega a `/subscriptions/<SUB_ID>`, muestra `"Cambios guardados"` (`subscription-toast`) y en `"Datos"` (`subscription-detail-data`) `"Categoría"` muestra `"Salud"` y `"Medio de pago"` muestra `"Cuenta bancaria"` Se abre `/transactions` La transacción de `<MES_ANTERIOR>` sigue mostrando la categoría `"Entretenimiento"` y el medio de pago `"Efectivo"`

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: La transacción de <MES_ANTERIOR> sigue mostrando la categoría "Entretenimiento" y el medio de pago "Efectivo"
```

**Informe previo del equipo:** Falta aclarar qué movimientos se encuentran en Resumen.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-112 — Editar el nombre de `"Netflix"` a `"Netflix 4K"` mantiene la descripción `"Netflix"` en la transacción anterior y muestra `"Netflix 4K"` en la marca de Movimientos · **PASSED**

**Esperado:** Se abre `/subscriptions` Se abre `/subscriptions/<SUB_ID>` Se abre `/subscriptions/<SUB_ID>/edit` El campo `"Nombre"` muestra `Netflix 4K` Navega a `/subscriptions/<SUB_ID>`, muestra `"Cambios guardados"` (`subscription-toast`) y el encabezado (`subscription-detail-name`) muestra `"Netflix 4K"` Se abre `/transactions` En la fila del movimiento (`transactions-item`), la descripción sigue diciendo `"Netflix"` y la marca de suscripción (`transactions-item-subscription`) muestra el nombre nuevo `"Netflix 4K"`

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: En la fila del movimiento (transactions-item), la descripción sigue diciendo "Netflix" y la marca de suscripción (transactions-item-subscription) muestra el nombre nuevo "Netflix 4K"
```

**Informe previo del equipo:** Falta aclarar qué movimientos se encuentran en Resumen.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-113 — Editar el día de cobro de `28` a `1` cuando el mes corriente aún no se había generado crea al guardar la ocurrencia del mes corriente con los datos nuevos · **PASSED**

**Esperado:** Se abre `/subscriptions` Se abre `/subscriptions/<SUB_ID>` Se abre `/subscriptions/<SUB_ID>/edit` El campo `"Monto"` muestra `7500` El campo `"Día de cobro"` muestra `1` y `subscription-form-next-charge` muestra `"Al guardar se carga <mes actual> (01/<MES_ACTUAL>) por $7.500,00"` Navega a `/subscriptions/<SUB_ID>`, muestra el aviso `"Cambios guardados. Se cargó el gasto de <mes actual> con los datos nuevos."` (`subscription-toast`, ej. `"Cambios guardados. Se cargó el gasto de octubre 2026 con los datos nuevos."`) y en `"Gastos cargados"` (`subscription-detail-occurrences`) aparece la ocurrencia de `<MES_ACTUAL>` con fecha `01/<MES_ACTUAL>` y monto `"$7.500,00"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-114 — Rechazar en API enviar `p_currency` en `update_subscription` · **PASSED**

**Esperado:** Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "La moneda y el mes de inicio no se pueden cambiar"` Respuesta HTTP `200 OK` con `[{"currency":"ARS"}]`

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con [{"currency":"ARS"}]
— Observado en la corrida —
HTTP 400 {"code":"23514","details":null,"hint":null,"message":"La moneda y el mes de inicio no se pueden cambiar"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-115 — Rechazar en API enviar `p_start_period` en `update_subscription` · **PASSED**

**Esperado:** Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "La moneda y el mes de inicio no se pueden cambiar"` Respuesta HTTP `200 OK` con `[{"start_period":"<MES_ACTUAL>-01"}]`

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con [{"start_period":"<MES_ACTUAL>-01"}]
— Observado en la corrida —
HTTP 400 {"code":"23514","details":null,"hint":null,"message":"La moneda y el mes de inicio no se pueden cambiar"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-116 — Rechazar en UI editar el Mes de fin de una suscripción activa a un período pasado (`<MES_ANTERIOR>`) · **PASSED**

**Esperado:** Se abre `/subscriptions` Se abre `/subscriptions/<SUB_ID>` Se abre `/subscriptions/<SUB_ID>/edit` `"Mes de fin (opcional)"` muestra `<MES_ANTERIOR>` La URL sigue siendo `/subscriptions/<SUB_ID>/edit` y debajo de `"Mes de fin (opcional)"` aparece `"El mes de fin no puede ser anterior a <mes actual>"` (ej. `"El mes de fin no puede ser anterior a octubre 2026"`)

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-117 — Rechazar en API `update_subscription` con `p_end_period` anterior al período corriente (`<MES_ANTERIOR>-01`) · **PASSED**

**Esperado:** Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "El mes de fin no puede ser anterior a <mes actual>"` Respuesta HTTP `200 OK` con `[{"end_period":null}]`

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con [{"end_period":null}]
— Observado en la corrida —
HTTP 400 {"code":"23514","details":null,"hint":null,"message":"El mes de fin no puede ser anterior a octubre 2026"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-118 — Rechazar en UI renombrar una suscripción poniéndole el nombre de otra suscripción activa del mismo usuario · **PASSED**

**Esperado:** Se abre `/subscriptions` Se abre `/subscriptions/<SUB_NETFLIX>` Se abre `/subscriptions/<SUB_NETFLIX>/edit` El campo `"Nombre"` muestra `Spotify` La URL sigue siendo `/subscriptions/<SUB_NETFLIX>/edit` y debajo de `"Nombre"` aparece `"Ya tenés una suscripción con ese nombre"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-119 — Rechazar en API `update_subscription` renombrando una suscripción con el nombre de otra activa del mismo usuario · **PASSED**

**Esperado:** Respuesta HTTP `409 Conflict` con `"code": "23505"` y `"message": "Ya tenés una suscripción con ese nombre"` Respuesta HTTP `200 OK` con `[{"name":"Netflix"}]`

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con [{"name":"Netflix"}]
— Observado en la corrida —
HTTP 409 {"code":"23505","details":null,"hint":null,"message":"Ya tenés una suscripción con ese nombre"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-120 — Rechazar en UI editar una suscripción cancelada al navegar directo a `/subscriptions/<SUB_ID>/edit` · **PASSED**

**Esperado:** No se muestra el formulario editable; se muestra el texto `"Esta suscripción está cancelada y no se puede editar."` y el enlace `"Volver"` (`subscription-form-cancelled-back`) que apunta a `/subscriptions/<SUB_ID>`

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: No se muestra el formulario editable; se muestra el texto "Esta suscripción está cancelada y no se puede editar." y el enlace "Volver" (subscription-form-cancelled-back) que apunta a /subscriptions/<SUB_ID>
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-121 — Rechazar en API `update_subscription` sobre una suscripción en estado `cancelled` · **PASSED**

**Esperado:** Respuesta HTTP `400 Bad Request` con `"code": "23514"` y `"message": "Una suscripción cancelada no se puede modificar"` Respuesta HTTP `200 OK` con `[{"status":"cancelled","amount_text":"5000.00"}]`

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con [{"status":"cancelled","amount_text":"5000.00"}]
— Observado en la corrida —
HTTP 400 {"code":"23514","details":null,"hint":null,"message":"Una suscripción cancelada no se puede modificar"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-122 — Rechazar en API un `PATCH` directo de `amount` sobre `/rest/v1/subscriptions` con la sesión del usuario · **PASSED**

**Esperado:** Respuesta HTTP `403 Forbidden` con `"code": "42501"` (`permission denied for table subscriptions`) Respuesta HTTP `200 OK` con `[{"amount_text":"5000.00"}]`

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con [{"amount_text":"5000.00"}]
— Observado en la corrida —
HTTP 403 {"code":"42501","details":null,"hint":"Grant the required privileges to the current role with: GRANT UPDATE ON public.subscriptions TO authenticated;","message":"permission denied for table subscriptions"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-123 — Editar el monto de una suscripción cuya categoría actual fue archivada permite guardar conservando `"Entretenimiento (archivada)"` · **PASSED**

**Esperado:** Se abre `/subscriptions` Se abre `/subscriptions/<SUB_ID>` Se abre `/subscriptions/<SUB_ID>/edit`; `"Categoría"` (`subscription-form-category`) muestra seleccionada `"Entretenimiento (archivada)"` El campo `"Monto"` muestra `6500` Navega a `/subscriptions/<SUB_ID>`, muestra `"Cambios guardados"` (`subscription-toast`) y en `"Datos"` la fila `"Monto"` muestra `"$6.500,00"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-124 — Rechazar en API cambiar `p_category_id` en `update_subscription` a otra categoría archivada distinta de la actual · **PASSED**

**Esperado:** Respuesta HTTP `409 Conflict` con `"code": "23503"` y `"message": "La categoría no está disponible"` Respuesta HTTP `200 OK` con `[{"category_id":"<CAT_ENTRETENIMIENTO>"}]`

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con [{"category_id":"<CAT_ENTRETENIMIENTO>"}]
— Observado en la corrida —
HTTP 409 {"code":"23503","details":null,"hint":null,"message":"La categoría no está disponible"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-125 — Editar el monto de una suscripción cuyo medio de pago actual fue archivado permite guardar conservando `"Efectivo (archivada)"` · **PASSED**

**Esperado:** Se abre `/subscriptions` Se abre `/subscriptions/<SUB_ID>` Se abre `/subscriptions/<SUB_ID>/edit`; `"Medio de pago"` (`subscription-form-account`) muestra seleccionado `"Efectivo (archivada)"` El campo `"Monto"` muestra `6500` Navega a `/subscriptions/<SUB_ID>`, muestra `"Cambios guardados"` (`subscription-toast`) y en `"Datos"` la fila `"Monto"` muestra `"$6.500,00"`

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Navega a /subscriptions/<SUB_ID>, muestra "Cambios guardados" (subscription-toast) y en "Datos" la fila "Monto" muestra "$6.500,00"
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-126 — Rechazar en API cambiar `p_account_id` en `update_subscription` a otra cuenta archivada distinta de la actual · **PASSED**

**Esperado:** Respuesta HTTP `409 Conflict` con `"code": "23503"` y `"message": "El medio de pago no está disponible"` Respuesta HTTP `200 OK` con `[{"account_id":"<ACC_EFECTIVO>"}]`

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Respuesta HTTP 200 OK con [{"account_id":"<ACC_EFECTIVO>"}]
— Observado en la corrida —
HTTP 409 {"code":"23503","details":null,"hint":null,"message":"El medio de pago no está disponible"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-127 — Editar la descripción de una suscripción terminada (`end_period = <MES_HACE_2>`) sin tocar el Mes de fin permite guardar · **PASSED**

**Esperado:** Se abre `/subscriptions` Se abre `/subscriptions/<SUB_ID>` Se abre `/subscriptions/<SUB_ID>/edit`; `"Mes de fin (opcional)"` (`subscription-form-end-period`) muestra `<MES_HACE_2>` y `subscription-form-next-charge` muestra `"No hay más cobros: terminó en <mes hace 2>."` El campo muestra `Curso finalizado` Navega a `/subscriptions/<SUB_ID>`, muestra `"Cambios guardados"` (`subscription-toast`), en `"Datos"` `"Descripción"` muestra `"Curso finalizado"` y `"Próximo cobro"` (`subscription-detail-next-charge`) muestra `"—"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-128 — Extender una suscripción terminada (`end_period = <MES_HACE_2>`) tocando `"Sin fin"` mueve `generate_from_period` al período corriente sin rellenar `<MES_ANTERIOR>` · **PASSED**

**Esperado:** Se abre `/subscriptions` Se abre `/subscriptions/<SUB_ID>` Se abre `/subscriptions/<SUB_ID>/edit`; debajo de `"Mes de fin (opcional)"` se lee `"Terminó en <mes hace 2>. Si la extendés, los meses entre <mes hace 2> y <mes actual> no se cargan."` El campo `"Mes de fin (opcional)"` (`subscription-form-end-period`) queda vacío y `subscription-form-next-charge` muestra `"Próximo cobro: 28/<MES_ACTUAL> por $8.000,00"` Navega a `/subscriptions/<SUB_ID>`, muestra `"Cambios guardados"` (`subscription-toast`), en `"Datos"` `"Hasta"` muestra `"Sin fin"`, `"Próximo cobro"` (`subscription-detail-next-charge`) muestra `"28/<MES_ACTUAL>"` y en `"Gastos cargados"` (`subscription-detail-occurrences`) siguen existiendo únicamente las 2 ocurrencias originales (`<MES_HACE_2>` y `<MES_HACE_3>`), sin haberse creado `<MES_ANTERIOR>`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-129 — Rechazar en API `update_subscription` usando la sesión de otro usuario (`404 P0002`) · **FAILED**

**Esperado:** Respuesta HTTP `404 Not Found` con `"code": "P0002"` y `"message": "Suscripción no encontrada"` Respuesta HTTP `200 OK` con `[{"name":"Netflix B","amount_text":"5000.00"}]`

**Obtenido:**

```text
esperado HTTP 404 P0002 «Suscripción no encontrada»; obtenido HTTP 500 {"code":"P0002","details":null,"hint":null,"message":"Suscripción no encontrada"}
— Observado en la corrida —
HTTP 500 {"code":"P0002","details":null,"hint":null,"message":"Suscripción no encontrada"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Defectos:** DEF-034
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-130 — Rechazar en API `update_subscription` sin sesión autenticada (rol `anon`) · **FAILED**

**Esperado:** Respuesta HTTP `403 Forbidden` con `"code": "42501"` (`permission denied for function update_subscription`)

**Obtenido:**

```text
esperado HTTP 403 42501; obtenido HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function update_subscription"} (el código 42501 coincide; cambia el HTTP: la API responde 401 al rol anon)
— Observado en la corrida —
HTTP 401 {"code":"42501","details":null,"hint":null,"message":"permission denied for function update_subscription"}
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Defectos:** DEF-035
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-131 — Eliminar desde Movimientos la ocurrencia de `<MES_ANTERIOR>` muestra `delete-transaction-subscription-note`, figura con `"Eliminado"` en el Detalle y no vuelve a crearse al recargar · **PASSED**

**Esperado:** Se abre `/transactions` Se muestra la fila del gasto `"Netflix"` por `"$5.000,00"` (`transactions-item`) Se abre `delete-transaction-dialog` mostrando `delete-transaction-subscription-note` con el texto `"Este gasto lo cargó la suscripción Netflix. Si lo eliminás, no se vuelve a cargar para <mes anterior>."` (ej. `"Este gasto lo cargó la suscripción Netflix. Si lo eliminás, no se vuelve a cargar para septiembre 2026."`) El diálogo se cierra y la fila desaparece del listado `"Activos"` de `<MES_ANTERIOR>` Se abre `/subscriptions` Se abre `/subscriptions/<SUB_ID>`; en `"Gastos cargados"` (`subscription-detail-occurrences`) la fila `subscription-detail-occurrence` con `data-period="<MES_ANTERIOR>"` tiene `data-deleted="true"` y muestra la marca `"Eliminado"` (`subscription-detail-occurrence-deleted`) La puesta al día corre al recargar sin crear una nueva transacción para `<MES_ANTERIOR>`; no aparece `app-catchup-generated` y la fila `subscription-detail-occurrence` con `data-period="<MES_ANTERIOR>"` sigue con `data-deleted="true"` y `"Eliminado"`

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: La puesta al día corre al recargar sin crear una nueva transacción para <MES_ANTERIOR>; no aparece app-catchup-generated y la fila subscription-detail-occurrence con data-period="<MES_ANTERIOR>" sigue con data-deleted="true" y "Eliminado"
```

**Informe previo del equipo:** Falta aclarar qué movimientos se encuentran en Resumen.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-132 — Eliminar la ocurrencia de `<MES_ANTERIOR>` de una suscripción deja de sumarla en `"Gastado en <mes corto>"` del Resumen · **PASSED**

**Esperado:** Se abre `/dashboard` La tarjeta `"Gastado en <mes corto anterior>"` (`dashboard-total-expenses`, ej. `"Gastado en septiembre"`) muestra `"$6.000,00"` Se abre `/transactions` Se listan `"Netflix"` (`$5.000,00`) y `"Cine manual"` (`$1.000,00`) Se abre `delete-transaction-dialog` La fila `"Netflix"` desaparece de `"Activos"` Se abre `/dashboard` La tarjeta `"Gastado en <mes corto anterior>"` (`dashboard-total-expenses`) muestra `"$1.000,00"` (la ocurrencia eliminada de `$5.000,00` dejó de sumar)

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: La tarjeta "Gastado en <mes corto anterior>" (dashboard-total-expenses) muestra "$1.000,00" (la ocurrencia eliminada de $5.000,00 dejó de sumar)
```

**Informe previo del equipo:** Falta aclarar qué movimientos se encuentran en Resumen.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-133 — Restaurar desde el filtro `"Eliminados"` de Movimientos la ocurrencia borrada vuelve a sumarla en el Resumen, quita la marca `"Eliminado"` en el Detalle y no duplica el mes · **PASSED**

**Esperado:** Se abre `/transactions` No aparece `"Netflix"` en el filtro `"Activos"` Se muestra la fila de `"Netflix"` por `"$5.000,00"` La fila desaparece de `"Eliminados"` y vuelve a `"Activos"` Se abre `/dashboard` La tarjeta `"Gastado en <mes corto anterior>"` (`dashboard-total-expenses`) muestra `"$5.000,00"` Se abre `/subscriptions` En `/subscriptions/<SUB_ID>`, la sección `"Gastos cargados"` (`subscription-detail-occurrences`) muestra 1 sola fila `subscription-detail-occurrence` con `data-period="<MES_ANTERIOR>"`, `data-deleted="false"` y sin la marca `"Eliminado"` (`subscription-detail-occurrence-deleted`)

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: En /subscriptions/<SUB_ID>, la sección "Gastos cargados" (subscription-detail-occurrences) muestra 1 sola fila subscription-detail-occurrence con data-period="<MES_ANTERIOR>", data-deleted="false" y sin la marca "Eliminado" (subscription-detail-occurrence-deleted)
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-134 — Mostrar la marca de suscripción en Movimientos y en `"Últimos movimientos"` del Resumen (y no en un gasto manual) y navegar al Detalle al tocarla · **PASSED**

**Esperado:** Se abre `/dashboard` En `"Últimos movimientos"`, la fila de `"Netflix"` muestra la marca `dashboard-transaction-item-subscription` con el nombre `"Netflix"` y la fila de `"Kiosco"` no tiene `dashboard-transaction-item-subscription` Se abre `/transactions` La fila de `"Netflix"` muestra la marca `transactions-item-subscription` con el nombre `"Netflix"` y la fila de `"Kiosco"` no tiene `transactions-item-subscription` Navega a `/subscriptions/<SUB_ID>` mostrando el Detalle de `"Netflix"`

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Navega a /subscriptions/<SUB_ID> mostrando el Detalle de "Netflix"
— Observado en la corrida —
Resumen: marca en Netflix=1, marca en Kiosco=0
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-135 — La ocurrencia generada de una suscripción suma en `"Gastado en <mes corto>"` y resta en `"Balance"` del Resumen de V1 · **PASSED**

**Esperado:** Se abre `/dashboard` En `/dashboard`, la tarjeta `"Gastado en <mes corto anterior>"` (`dashboard-total-expenses`) muestra `"$5.000,00"` y la tarjeta `"Balance"` (`dashboard-total-balance`) muestra `"-$5.000,00"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-136 — Listar en `"Gastos cargados"` del Detalle las ocurrencias de la suscripción ordenadas por período descendente · **PASSED**

**Esperado:** Se abre `/subscriptions` En `/subscriptions/<SUB_ID>`, la sección `"Gastos cargados"` (`subscription-detail-occurrences`) lista exactamente 3 filas `subscription-detail-occurrence` en orden descendente de `data-period`: primero `data-period="<MES_ANTERIOR>"`, segundo `data-period="<MES_HACE_2>"` y tercero `data-period="<MES_HACE_3>"`, cada una con fecha `28/<MM>/<AAAA>` y monto `"$5.000,00"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-137 — Mostrar la marca de suscripción en Movimientos aunque la suscripción esté en estado `paused` · **PASSED**

**Esperado:** Se abre `/transactions` La fila del gasto muestra la marca `transactions-item-subscription` con el nombre `"Netflix"`

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: La fila del gasto muestra la marca transactions-item-subscription con el nombre "Netflix"
```

**Informe previo del equipo:** Falta aclarar qué movimientos se encuentran en Resumen.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-138 — Mostrar la marca de suscripción en Movimientos aunque la suscripción esté en estado `cancelled` · **PASSED**

**Esperado:** Se abre `/transactions` La fila del gasto muestra la marca `transactions-item-subscription` con el nombre `"Netflix"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-139 — Suscripción activa en USD con tipo de cambio en `<MES_HACE_2>` y sin tipo de cambio en `<MES_ANTERIOR>` genera solo `<MES_HACE_2>`, muestra `"Falta tipo de cambio"` y el botón `"Cargar tipo de cambio"` navega a `/settings?period=<MES_ANTERIOR>` · **PASSED**

**Esperado:** Se abre `/subscriptions`; en la fila `"ChatGPT Plus"` (`subscriptions-item` con `data-subscription-id="<SUB_ID>"`) se muestra la marca `"Falta tipo de cambio"` (`subscriptions-item-blocked`) Se abre `/subscriptions/<SUB_ID>`; se muestra el aviso `subscription-detail-blocked` con el texto `"Falta el tipo de cambio de <mes anterior>. Ese mes no se cargó; se carga en cuanto lo cargues."` y el botón `"Cargar tipo de cambio"` (`subscription-detail-blocked-fx`), y en `"Gastos cargados"` (`subscription-detail-occurrences`) figura únicamente la ocurrencia de `<MES_HACE_2>` Navega a `/settings?period=<MES_ANTERIOR>` con el campo `"Mes"` (`settings-fx-period`) preseleccionado en `<MES_ANTERIOR>`

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Navega a /settings?period=<MES_ANTERIOR> con el campo "Mes" (settings-fx-period) preseleccionado en <MES_ANTERIOR>
```

**Informe previo del equipo:** No sabe cómo testearlo.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-140 — Guardar en Ajustes el tipo de cambio faltante de `<MES_ANTERIOR>` dispara la puesta al día sin recargar, muestra `"Se cargó 1 gasto de suscripciones"` y quita el bloqueo · **PASSED**

**Esperado:** Se abre `/subscriptions` Se abre `/subscriptions/<SUB_ID>` Navega a `/settings?period=<MES_ANTERIOR>` con `"Mes"` (`settings-fx-period`) en `<MES_ANTERIOR>` El campo muestra `1250` Sin recargar el navegador, se guarda el tipo de cambio, corre la puesta al día y se muestra el aviso `app-catchup-generated` con el texto `"Se cargó 1 gasto de suscripciones"` Se abre `/subscriptions`; la fila `"ChatGPT Plus"` ya no muestra `subscriptions-item-blocked` En `/subscriptions/<SUB_ID>`, ya no existe `subscription-detail-blocked` y en `"Gastos cargados"` (`subscription-detail-occurrences`) figura la ocurrencia de `<MES_ANTERIOR>` (`data-period="<MES_ANTERIOR>"`)

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-141 — Con 3 meses bloqueados por falta de tipo de cambio, el aviso los lista con comas y `"y"` y el botón `"Cargar tipo de cambio"` apunta al mes más viejo · **PASSED**

**Esperado:** Se abre `/subscriptions` En `/subscriptions/<SUB_ID>`, el aviso `subscription-detail-blocked` muestra el texto `"Falta el tipo de cambio de <mes hace 3>, <mes hace 2> y <mes anterior>. Esos meses no se cargaron; se cargan en cuanto los cargues."` (ej. `"Falta el tipo de cambio de julio 2026, agosto 2026 y septiembre 2026. Esos meses no se cargaron; se cargan en cuanto los cargues."`) Navega a `/settings?period=<MES_HACE_3>` (el mes más viejo que falta)

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-142 — Suscripción activa en USD sin tipo de cambio del mes corriente antes del día de cobro (`28 > <DIA_HOY>`) no se muestra bloqueada · **PASSED**

**Esperado:** Se abre `/subscriptions`; la fila `"ChatGPT Plus"` (`subscriptions-item`) **no** muestra la marca `subscriptions-item-blocked` En `/subscriptions/<SUB_ID>`, **no** existe el aviso `subscription-detail-blocked`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-143 — Con dos suscripciones activas en ARS (`$5.000,00` y `$2.500,00`), el total mensual comprometido muestra `"$7.500,00"` y `"2 suscripciones activas este mes"` · **PASSED**

**Esperado:** En `/subscriptions`, la tarjeta `subscriptions-committed` muestra el rótulo `"Comprometido en <mes actual>"`, el total `"$7.500,00"` (`subscriptions-committed-total`), el conteo `"2 suscripciones activas este mes"` (`subscriptions-committed-count`) y no muestra `subscriptions-committed-usd-pending`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-144 — Suscripción activa en `USD 10,00` con tipo de cambio del período corriente `1.250,00` suma `"$12.500,00"` al total mensual comprometido · **PASSED**

**Esperado:** En `/subscriptions`, `subscriptions-committed-total` muestra `"$12.500,00"`, `subscriptions-committed-count` muestra `"1 suscripción activa este mes"` y no existe `subscriptions-committed-usd-pending`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-145 — Con una sola suscripción activa en `USD 10,00` y sin tipo de cambio del período corriente, el total comprometido muestra `"$0,00"`, `"1 suscripción activa este mes"` y `"+ USD 10,00 sin tipo de cambio de <mes actual>"` · **PASSED**

**Esperado:** En `/subscriptions`, `subscriptions-committed-total` muestra `"$0,00"`, `subscriptions-committed-count` muestra `"1 suscripción activa este mes"` y `subscriptions-committed-usd-pending` muestra `"+ USD 10,00 sin tipo de cambio de <mes actual>"` (ej. `"+ USD 10,00 sin tipo de cambio de octubre 2026"`)

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-146 — Editar el monto de una suscripción de `$5.000,00` a `$8.000,00` actualiza el total mensual comprometido a `"$8.000,00"` aunque la ocurrencia del mes corriente ya se haya generado por `$5.000,00` · **PASSED**

**Esperado:** En `/subscriptions`, `subscriptions-committed-total` muestra `"$5.000,00"` Se abre `/subscriptions/<SUB_ID>` Se abre `/subscriptions/<SUB_ID>/edit` El campo `"Monto"` muestra `8000` Navega a `/subscriptions/<SUB_ID>`; la ocurrencia de `<MES_ACTUAL>` en `"Gastos cargados"` sigue mostrando `"$5.000,00"` En `/subscriptions`, `subscriptions-committed-total` muestra `"$8.000,00"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-147 — El Resumen (`/dashboard`) no suma suscripciones cuya ocurrencia del mes corriente aún no fue generada y muestra el estado vacío del período · **PASSED**

**Esperado:** En `/subscriptions`, `subscriptions-committed-total` muestra `"$5.000,00"` y `subscriptions-committed-count` muestra `"1 suscripción activa este mes"` En `/dashboard` (período `<MES_ACTUAL>`), ningún KPI suma la suscripción sin transacción: se muestra el estado vacío `dashboard-empty` con el texto `"No tenés movimientos registrados en <mes corto actual>."` (`dashboard-empty-message`, ej. `"No tenés movimientos registrados en octubre."`) y el botón `"Registrar un gasto"` (`dashboard-empty-register`)

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-148 — Una suscripción activa con `end_period` igual al período corriente (`<MES_ACTUAL>`) sí suma al total mensual comprometido · **PASSED**

**Esperado:** En `/subscriptions`, `subscriptions-committed-total` muestra `"$6.000,00"` y `subscriptions-committed-count` muestra `"1 suscripción activa este mes"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-149 — Una suscripción en estado `paused` no suma al total mensual comprometido (`"$0,00"` y `"No tenés suscripciones activas este mes"`) · **PASSED**

**Esperado:** En `/subscriptions`, `subscriptions-committed-total` muestra `"$0,00"` y `subscriptions-committed-count` muestra `"No tenés suscripciones activas este mes"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-150 — Una suscripción en estado `cancelled` no suma al total mensual comprometido · **PASSED**

**Esperado:** En `/subscriptions`, `subscriptions-committed-total` muestra `"$0,00"` y `subscriptions-committed-count` muestra `"No tenés suscripciones activas este mes"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-151 — Una suscripción activa con `start_period` en el mes siguiente (`<MES_SIGUIENTE>`) no suma al total mensual comprometido del mes corriente · **PASSED**

**Esperado:** En `/subscriptions`, `subscriptions-committed-total` muestra `"$0,00"` y `subscriptions-committed-count` muestra `"No tenés suscripciones activas este mes"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-152 — Una suscripción activa ya terminada (`end_period = <MES_ANTERIOR>`) no suma al total mensual comprometido del mes corriente · **PASSED**

**Esperado:** En `/subscriptions`, `subscriptions-committed-total` muestra `"$0,00"` y `subscriptions-committed-count` muestra `"No tenés suscripciones activas este mes"`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)

### CP-SUS-153 — Vista previa en `/subscriptions/new` con `$5.000,00` ARS, día `28` (`> <DIA_HOY>`), desde `<MES_HACE_2>` y sin fin muestra 2 meses en `"Se cargan al guardar"`, 3 en `"Próximos cobros"`, resumen de `"$10.000,00"` y al guardar crea exactamente esas 2 transacciones · **PASSED**

**Esperado:** Se abre `/subscriptions` Se abre `/subscriptions/new` El campo muestra `Netflix` El campo muestra `5000` `"Categoría"` muestra `"Entretenimiento"` `"Medio de pago"` muestra `"Efectivo"` El campo muestra `28` En la sección `"Calendario"` (`subscription-form-preview`): `"Se cargan al guardar"` (`subscription-form-preview-due`) muestra 2 filas `subscription-form-preview-due-item` (`"<mes hace 2> · 28/<MES_HACE_2>"` y `"<mes anterior> · 28/<MES_ANTERIOR>"`), `"Próximos cobros"` (`subscription-form-preview-upcoming`) muestra 3 filas `subscription-form-preview-upcoming-item` (`<MES_ACTUAL>`, `<MES_SIGUIENTE>` y `<MES_MAS_2>`) y el resumen (`subscription-form-preview-summary`) dice `"Al guardar se cargan 2 gastos de $5.000,00 (total $10.000,00)."` Navega a `/subscriptions/<SUB_ID>`, muestra `"Suscripción guardada. Se cargaron 2 gastos vencidos."` (`subscription-toast`) y en `"Gastos cargados"` (`subscription-detail-occurrences`) aparecen exactamente las mismas 2 fechas y períodos (`<MES_ANTERIOR>` y `<MES_HACE_2>`) que mostró `"Se cargan al guardar"`

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: Navega a /subscriptions/<SUB_ID>, muestra "Suscripción guardada. Se cargaron 2 gastos vencidos." (subscription-toast) y en "Gastos cargados" (subscription-detail-occurrences) aparecen exactamente las mismas 2 fechas y períodos (<MES_ANTERIOR> y <MES_HACE_2>) que mostró "Se cargan al guardar"
— Observado en la corrida —
Se cargan: agosto 2026 · 28/08/2026 | septiembre 2026 · 28/09/2026; próximos: octubre 2026 · 28/10/2026 | noviembre 2026 · 28/11/2026 | diciembre 2026 · 28/12/2026; resumen: Al guardar se cargan 2 gastos de $5.000,00 (total $10.000,00).
```

**Informe previo del equipo:** No muestra ningún resumen.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-154 — Vista previa en `/subscriptions/new` con día de cobro igual a `<DIA_HOY>` incluye el período corriente en `"Se cargan al guardar"` · **PASSED**

**Esperado:** Se abre `/subscriptions` Se abre `/subscriptions/new` El campo muestra `5000` El campo muestra `<DIA_HOY>` En `"Se cargan al guardar"` (`subscription-form-preview-due`) aparecen 3 filas (`<MES_HACE_2>`, `<MES_ANTERIOR>` y `<MES_ACTUAL>` con fecha `<HOY>`), `"Próximos cobros"` (`subscription-form-preview-upcoming`) empieza en `<MES_SIGUIENTE>` y el resumen (`subscription-form-preview-summary`) dice `"Al guardar se cargan 3 gastos de $5.000,00 (total $15.000,00)."`

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: En "Se cargan al guardar" (subscription-form-preview-due) aparecen 3 filas (<MES_HACE_2>, <MES_ANTERIOR> y <MES_ACTUAL> con fecha <HOY>), "Próximos cobros" (subscription-form-preview-upcoming) empieza en <MES_SIGUIENTE> y el resumen (subscription-form-preview-summary) dice "Al guardar se cargan 3 gastos de $5.000,00 (total $15.000,00)."
— Observado en la corrida —
Se cargan: agosto 2026 · 27/08/2026 | septiembre 2026 · 27/09/2026 | octubre 2026 · 27/10/2026; próximos: noviembre 2026 · 27/11/2026 | diciembre 2026 · 27/12/2026 | enero 2027 · 27/01/2027; resumen: Al guardar se cargan 3 gastos de $5.000,00 (total $15.000,00).
```

**Informe previo del equipo:** No especifica los pasos correctamente.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-155 — Vista previa en `/subscriptions/new` con Mes de inicio futuro (`<MES_MAS_3>`) muestra `"Al guardar no se carga ningún gasto."` y `"Próximos cobros"` desde `<MES_MAS_3>` · **PASSED**

**Esperado:** Se abre `/subscriptions` Se abre `/subscriptions/new` El campo muestra `5000` El campo muestra `15` En `subscription-form-preview`, el resumen (`subscription-form-preview-summary`) dice `"Al guardar no se carga ningún gasto."` y `"Próximos cobros"` (`subscription-form-preview-upcoming`) muestra 3 cobros empezando en `"<mes mas 3> · 15/<MES_MAS_3>"`

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: En subscription-form-preview, el resumen (subscription-form-preview-summary) dice "Al guardar no se carga ningún gasto." y "Próximos cobros" (subscription-form-preview-upcoming) muestra 3 cobros empezando en "<mes mas 3> · 15/<MES_MAS_3>"
— Observado en la corrida —
próximos: enero 2027 · 15/01/2027 | febrero 2027 · 15/02/2027 | marzo 2027 · 15/03/2027; resumen: Al guardar no se carga ningún gasto.
```

**Informe previo del equipo:** No especifica los pasos correctamente.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-156 — Vista previa en `/subscriptions/new` con rango cerrado en el pasado (`2026-03` a `2026-05`) y día `31` muestra `31/03/2026`, `30/04/2026`, `31/05/2026` y `"No hay más cobros: termina en mayo 2026."` · **PASSED**

**Esperado:** Se abre `/subscriptions` Se abre `/subscriptions/new` El campo muestra `8000` El campo muestra `31` `"Mes de inicio"` muestra `2026-03` En `subscription-form-preview`, `"Se cargan al guardar"` (`subscription-form-preview-due`) muestra las 3 filas `"marzo 2026 · 31/03/2026"`, `"abril 2026 · 30/04/2026"` y `"mayo 2026 · 31/05/2026"`, el resumen (`subscription-form-preview-summary`) dice `"Al guardar se cargan 3 gastos de $8.000,00 (total $24.000,00)."` y `"Próximos cobros"` (`subscription-form-preview-upcoming`) muestra `"No hay más cobros: termina en mayo 2026."`

**Obtenido:**

```text
Coincide con el resultado esperado. Se verificó: En subscription-form-preview, "Se cargan al guardar" (subscription-form-preview-due) muestra las 3 filas "marzo 2026 · 31/03/2026", "abril 2026 · 30/04/2026" y "mayo 2026 · 31/05/2026", el resumen (subscription-form-preview-summary) dice "Al guardar se cargan 3 gastos de $8.000,00 (total $24.000,00)." y "Próximos cobros" (subscription-form-preview-upcoming) muestra "No hay más cobros: termina en mayo 2026."
— Observado en la corrida —
Se cargan: marzo 2026 · 31/03/2026 | abril 2026 · 30/04/2026 | mayo 2026 · 31/05/2026; resumen: Al guardar se cargan 3 gastos de $8.000,00 (total $24.000,00).; próximos: Próximos cobros No hay más cobros: termina en mayo 2026.
```

**Informe previo del equipo:** No especifica los pasos correctamente.
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-157 — Vista previa en `/subscriptions/new` en USD con tipo de cambio en `<MES_HACE_2>` y sin tipo de cambio en `<MES_ANTERIOR>` marca `<MES_ANTERIOR>` con `data-blocked="true"` y no lo cuenta en el resumen · **FAILED**

**Esperado:** Se abre `/subscriptions` Se abre `/subscriptions/new` La moneda queda seleccionada en `"USD"` El campo muestra `20` El campo muestra `28` En `"Se cargan al guardar"` (`subscription-form-preview-due`), la fila `subscription-form-preview-due-item` con `data-period="<MES_HACE_2>"` tiene `data-blocked="false"`, la fila con `data-period="<MES_ANTERIOR>"` tiene `data-blocked="true"` y muestra `"Sin tipo de cambio: se carga cuando lo cargues"`, y el resumen (`subscription-form-preview-summary`) dice `"Al guardar se carga 1 gasto de USD 20,00."`

**Obtenido:**

```text
la fila de 2026-08 no tiene data-blocked="false" (el atributo está ausente; solo se escribe cuando la fila está bloqueada)
— Observado en la corrida —
2026-08: data-blocked=null; 2026-09: data-blocked=true; texto «septiembre 2026 · 28/09/2026 Sin tipo de cambio: se carga cuando lo cargues»; resumen: Al guardar se carga 1 gasto de USD 20,00.
```

**Informe previo del equipo:** No especifica los pasos correctamente.
**Defectos:** DEF-036
**Ejecutó:** Claude Code (IA), supervisado por Santiago

### CP-SUS-158 — Vista previa en `/subscriptions/new` con el campo `"Monto"` vacío muestra `subscription-form-preview-empty` · **PASSED**

**Esperado:** Se abre `/subscriptions` En `/subscriptions/new`, la sección `"Calendario"` (`subscription-form-preview`) muestra `subscription-form-preview-empty` con el texto `"Completá el monto, el día de cobro y el mes de inicio para ver el calendario."` y no muestra `subscription-form-preview-due` ni `subscription-form-preview-upcoming`

**Obtenido:**

```text
Informado como «ok» por el equipo en un mensaje de WhatsApp. Sin detalle de la ejecución: no lo ejecutó la IA.
```

**Ejecutó:** Equipo (informado por mensaje)
