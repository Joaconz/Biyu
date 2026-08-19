# Roadmap

_Tres versiones, según el corte que pide la consigna del Proyecto Integrador de Testing de
Aplicaciones. Cada versión termina en algo desplegado, usable **y con sus casos de prueba
diseñados y ejecutados**._

> **Reemplaza al roadmap de seis slices.** El corte anterior organizaba la construcción por
> capas de dominio (dominio → registro → dashboard → deudas → configuración → cierre). Este
> organiza por lo que se evalúa: V1 núcleo testeable, V2 MVP usable con regresión, V3
> automatización. El contenido no se perdió, se repartió distinto.

---

## Regla de corte

**Ninguna versión se amplía si la anterior no tiene sus casos de prueba diseñados,
ejecutados y sus defectos reportados.** Es la regla que protege lo que se califica: el
trabajo de calidad, no la aplicación. Si hay que elegir entre una feature más y un catálogo
de pruebas completo, gana el catálogo.

---

## V1 — Núcleo funcional mínimo, ya testeable

### Alcance

| Bloque | Qué entra |
|---|---|
| Acceso | Alta de cuenta, login, sesión persistente, aislamiento por usuario |
| Configuración mínima | Categorías y medios de pago, con set inicial sembrado por usuario nuevo |
| Registro | Monto, moneda ARS/USD, tipo gasto/ingreso, categoría en chips, cuenta, fecha, descripción |
| Cuotas | 1 a 12, solo sobre tarjeta de crédito, con previsualización del impacto mensual |
| Monedas | Tipo de cambio por transacción, congelado. Tipo de cambio de referencia por período |
| Dashboard | Total gastado, ingresos, balance, cuotas heredadas, barras por categoría, desglose por cuenta, últimas transacciones, días con registro, estado vacío |
| Baja | Soft delete con aviso de que altera meses cerrados |

### Fuera de V1, a propósito

Deudas, suscripciones, export CSV, edición de transacciones. **Deudas sale de V1 aunque
esté especificado y sea tentador**: V2 necesita funcionalidad nueva sobre la cual ejercitar
regresión, y las deudas son el mejor candidato porque tocan el dashboard sin reescribirlo.

### Terminado cuando

- Se puede cargar un gasto en cuotas desde el celular en la URL de producción en menos de diez segundos.
- El total del mes coincide a mano con la suma de lo cargado, incluyendo un caso con USD y uno con cuotas.
- Existe el catálogo de casos de prueba de V1 (felices, negativos, valores límite) y está ejecutado, con su reporte.
- Los defectos encontrados están reportados con pasos de reproducción.

### Foco de testing

Cálculo de cuotas (prorrateo exacto, con resto, 1 cuota, 12 cuotas, cruce de año), conversión de moneda, validaciones de alta, reglas dependientes de estado (cuotas solo en crédito), autorización cruzada y soft delete retroactivo.

---

## V2 — Evolución a MVP usable

### Cambios funcionales

- **Suscripciones**: alta, puesta al día idempotente, pausa, reanudación, cancelación, edición de monto, total mensual comprometido. Ver `06-suscripciones.md`.
- **Deudas**: gasto compartido que genera una deuda vinculada en la misma operación, alta de deuda suelta, listado filtrable, totales por dirección, marcar saldada y revertir, KPI de neto de reembolsos en el dashboard.
- **Export CSV** de todas las transacciones (C9).

### Cambios de interfaz

Más que estilo, y **sin repetir lo que V1 ya trajo** — la previsualización del impacto de cuotas y el estado vacío del dashboard son alcance de V1, no cambios de V2:

- Navegación mobile-first entre registro, dashboard, deudas y suscripciones, con la barra inferior que aparece recién cuando hay más de una sección.
- Retroalimentación explícita de guardado y de error, con opción de reintentar **conservando lo cargado**: hoy un fallo de red vacía el formulario.
- Vista previa del calendario de una suscripción antes de darla de alta: qué meses va a generar y desde cuándo.
- Confirmación destructiva con consecuencias explícitas al borrar una transacción en cuotas ("esto cambia los totales de 4 meses ya cerrados").

### Cambios no funcionales

- **Rendimiento**: el dashboard responde en menos de un segundo con dos años de datos y quinientas transacciones cargadas. Se mide con un set de datos sintéticos, no con datos reales (C14).
- **Usabilidad y accesibilidad**: el formulario de registro es operable solo con teclado, los campos tienen etiqueta asociada y los mensajes de error son leídos por lector de pantalla.
- **Robustez**: la puesta al día de suscripciones no puede duplicar ocurrencias ante pedidos concurrentes.

### Terminado cuando

- Todo lo anterior está desplegado y usable desde el celular.
- El catálogo de V1 volvió a ejecutarse completo como **suite de regresión**, con su reporte.
- Los defectos de V1 están **confirmados** (re-testeados) y cerrados o justificados.
- Existe y está ejecutado el catálogo nuevo de V2.

### Foco de testing

Los casos nuevos de suscripciones y deudas —que son los más ricos en bordes: día 31 en febrero, reanudación sin relleno, ocurrencia borrada que no vuelve, deuda igual al gasto vs. un centavo más— **más regresión completa de V1 y confirmación de defectos**.

---

## V3 — Automatización

El foco es automatizar un subconjunto representativo de los casos de V1 y V2. No es una versión de features.

### Qué se automatiza

| Nivel | Alcance | Criterio de selección |
|---|---|---|
| Unitario (dominio) | Cuotas, conversión, resúmenes mensuales, ocurrencias de suscripción | Todo. Es barato, rápido y cubre las invariantes |
| API | Casos negativos, validaciones de servidor, atomicidad, autorización cruzada | Todos los casos negativos de V1 y V2, porque son los que una persona deja de ejecutar cuando se cansa |
| Componente | Formulario de registro: cuotas condicionales, previsualización, botón deshabilitado | El puñado que cubre la lógica condicional visible |
| End-to-end | Login → gasto en cuotas → dashboard · Alta de suscripción → puesta al día → dashboard | Solo los dos flujos críticos. Son caros de mantener |

### Infraestructura

Ejecución en GitHub Actions ante cada push y cada pull request, con Postgres como *service container*. Reporte de ejecución publicado como artefacto de la corrida. Un cambio que rompe una invariante no llega a la rama principal.

### Mejora funcional menor

**Edición de una transacción existente.** Se elige a propósito y no por conveniencia: al cambiar el monto o la cantidad de cuotas hay que borrar y regenerar todas las imputaciones (ADR-009), y ese es el camino por el cual la invariante central del sistema se rompe en silencio. Es decir: es la feature más pequeña que produce el mejor material de regresión posible. La alternativa que se descartó —filtros y búsqueda en el listado— es más segura de construir y casi no genera casos interesantes.

### Terminado cuando

- La suite automatizada corre en CI y falla el build cuando debe.
- Existe el reporte de ejecución automatizada y se puede comparar contra el manual.
- Está escrito el análisis de los defectos encontrados a lo largo del proyecto y el post-mortem de las actividades.
- Un tercero puede clonar el repo, levantar el schema desde cero y correr la suite completa.

---

## V3+ — no diseñado

Listadas para saber que existen, no para construirlas. Cualquiera necesita su propio spec antes de escribir código.

| Feature | Nota |
|---|---|
| Importación de resúmenes de tarjeta en PDF | ADR-005 |
| Ciclo de cierre de tarjeta | Día de cierre por cuenta, desplazamiento de la primera imputación |
| Suscripciones anuales o de frecuencia libre | Obliga a decidir si una anual se imputa entera o se prorratea en doce |
| Tipo de cambio automático desde una API | Dólar MEP o blue, cargando el valor de referencia del período |
| Pagos parciales de deudas | Historial de pagos por deuda |
| Aplicación instalable (PWA) | Ícono en la pantalla de inicio |
| Presupuestos por categoría, patrimonio neto, inversiones | Cambian el propósito del sistema: pasa de informar a controlar |
