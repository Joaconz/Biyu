# Pendientes

Borrador de cambios y mejoras que surgen al revisar la app y todavía no tienen historia ni defecto
abierto. Cuando una idea está clara, se pasa a un issue del [Project Biyu](https://github.com/users/Joaconz/projects/3)
y se borra de acá. Los pendientes puramente visuales están en `docs/design/pendientes-ui.md`.

## Categorías

- **Elegir el ícono de cada categoría.** Hoy las categorías no permiten elegir su ícono.

## Gastos y deudas

- **Modificar gastos.** Hoy no se puede editar un gasto ya registrado.
- **Modificar deudas.** Hoy no se puede editar una deuda ya registrada.

## Personas y deudas

- **Crear personas para deudas y asignarlas.** Las deudas deberían poder vincularse a una persona
  creada en la app, en lugar de solo un texto libre.

## Balance y resúmenes

- **Personalizar el balance para que cuente deudas y suscripciones.** Hay que definir qué entra en el
  balance por defecto y cómo se elige qué cuenta (a definir antes de pasarlo a issue).
- **Suscripciones y deudas deben impactar en resúmenes posteriores, no solo en el actual.** Hoy su efecto
  queda en el período en que se ven; tienen que proyectarse a los meses siguientes. Revisar contra
  ADR-017 y ADR-033 antes de decidir cómo se calcula.

Los últimos pasaron a issues el 2026-10-08:
[#268](https://github.com/Joaconz/Biyu/issues/268) (cuotas en el Excel),
[#269](https://github.com/Joaconz/Biyu/issues/269) (guía de importación),
[#270](https://github.com/Joaconz/Biyu/issues/270) (gasto compartido con varias personas) y
[#271](https://github.com/Joaconz/Biyu/issues/271) (deudas sueltas en el Resumen).
