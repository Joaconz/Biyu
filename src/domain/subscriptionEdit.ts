// Editar una suscripción (US-59, ADR-032). Puro: sin red ni reloj, `today` por parámetro (C1). Postgres
// repite cada validación en update_subscription con los mismos mensajes (C6); esto es solo UX.
import { Decimal, tryParseMoney } from './money'
import {
  currentPeriod,
  formatDisplayDate,
  formatPeriod,
  formatPeriodLong,
  isPeriodBefore,
  isSamePeriod,
  parsePeriod,
  type Period,
} from './period'
import { chargeOutlook } from './subscriptionOperations'
import {
  codePointLength,
  isEnded,
  MAX_DESCRIPTION_LENGTH,
  MAX_END_PERIOD,
  MAX_NAME_LENGTH,
  subscriptionAmountText,
  type SubscriptionErrors,
  type SubscriptionFormValues,
  type SubscriptionRecord,
} from './subscriptions'
import { MAX_AMOUNT } from './validation'

/** Lo que viaja a update_subscription, ya limpio. La moneda y el mes de inicio no se editan (ADR-032). */
export interface SubscriptionEditDraft {
  name: string
  amount: Decimal
  categoryId: string
  accountId: string
  billingDay: number
  endPeriod: Period | null
  description: string | null
}

export const EDIT_NOTICE_TEXT = 'Los cambios aplican desde el próximo cobro. Los gastos ya cargados no cambian.'
export const ARCHIVED_HINT_TEXT = 'Si la cambiás, no la vas a poder volver a elegir.'
export const CANCELLED_EDIT_TEXT = 'Esta suscripción está cancelada y no se puede editar.'
export const NOT_FOUND_TEXT = 'No encontramos esta suscripción.'
export const PAUSED_NEXT_CHARGE_TEXT = 'Pausada: no hay próximo cobro'

/** Los valores del formulario de edición, precargados con los de la suscripción. */
export function editFormValues(subscription: SubscriptionRecord): SubscriptionFormValues {
  return {
    name: subscription.name,
    // Formato del formulario (coma decimal): lo que se ve es lo que tryParseMoney lee de vuelta.
    amount: new Decimal(subscription.amount).toFixed(2).replace('.', ','),
    currency: subscription.currency,
    categoryId: subscription.categoryId,
    accountId: subscription.accountId,
    billingDay: String(subscription.billingDay),
    startPeriod: formatPeriod(subscription.startPeriod),
    endPeriod: subscription.endPeriod ? formatPeriod(subscription.endPeriod) : '',
    description: subscription.description ?? '',
  }
}

const sameEnd = (a: Period | null, b: Period | null) => (a === null || b === null ? a === b : isSamePeriod(a, b))

/** El mínimo de un mes de fin nuevo: el mayor entre el mes de inicio y el período corriente (ADR-032). */
export function minEndPeriod(subscription: Pick<SubscriptionRecord, 'startPeriod'>, today: Date): Period {
  const current = currentPeriod(today)
  return isPeriodBefore(subscription.startPeriod, current) ? current : subscription.startPeriod
}

/**
 * Mensajes de la tabla de US-52 que valen al editar (CA-7) y el del mes de fin (CA-6). El nombre repetido
 * contra otra suscripción lo resuelve Postgres. El mes de fin solo se valida si cambia: una terminada se
 * puede editar sin tocarlo (CA-11).
 */
export function validateSubscriptionEdit(
  values: SubscriptionFormValues,
  original: SubscriptionRecord,
  today: Date,
): { errors: SubscriptionErrors; draft: SubscriptionEditDraft | null } {
  const errors: SubscriptionErrors = {}

  const name = values.name.trim()
  if (!name) errors.name = 'Escribí un nombre'
  else if (codePointLength(name) > MAX_NAME_LENGTH) errors.name = 'El nombre admite hasta 60 caracteres'

  const amount = tryParseMoney(values.amount)
  if (!amount || !amount.isFinite() || amount.lte(0)) errors.amount = 'El monto debe ser mayor a cero'
  else if (amount.decimalPlaces() > 2) errors.amount = 'El monto admite hasta 2 decimales'
  else if (amount.gt(MAX_AMOUNT)) {
    errors.amount = `El monto máximo es ${subscriptionAmountText(MAX_AMOUNT.toFixed(), original.currency)}`
  }

  if (!values.categoryId) errors.categoryId = 'Elegí una categoría'
  if (!values.accountId) errors.accountId = 'Elegí un medio de pago'

  const billingDay = /^\d+$/.test(values.billingDay) ? Number(values.billingDay) : null
  if (!values.billingDay) errors.billingDay = 'Indicá el día de cobro'
  else if (billingDay === null || billingDay < 1 || billingDay > 31) errors.billingDay = 'El día de cobro va de 1 a 31'

  const end = values.endPeriod ? parsePeriod(values.endPeriod) : null
  if (values.endPeriod && !end) errors.endPeriod = 'Elegí un mes de fin válido o dejalo sin fin'
  else if (end && !sameEnd(end, original.endPeriod)) {
    const min = minEndPeriod(original, today)
    if (isPeriodBefore(end, min)) errors.endPeriod = `El mes de fin no puede ser anterior a ${formatPeriodLong(min)}`
    else if (isPeriodBefore(MAX_END_PERIOD, end)) errors.endPeriod = 'El mes de fin puede ser como máximo diciembre 2099'
  }

  const description = values.description.trim()
  if (codePointLength(description) > MAX_DESCRIPTION_LENGTH) {
    errors.description = 'La descripción admite hasta 200 caracteres'
  }

  if (Object.keys(errors).length > 0 || !amount || billingDay === null) return { errors, draft: null }
  return {
    errors,
    draft: {
      name,
      amount,
      categoryId: values.categoryId,
      accountId: values.accountId,
      billingDay,
      endPeriod: end,
      description: description || null,
    },
  }
}

/**
 * Debajo del mes de fin de una terminada (ADR-032): "Terminó en mayo 2026. Si la extendés, los meses entre
 * mayo 2026 y octubre 2026 no se cargan." null si la suscripción no terminó.
 */
export function endedExtensionHint(subscription: Pick<SubscriptionRecord, 'endPeriod'>, today: Date): string | null {
  if (!subscription.endPeriod || !isEnded(subscription, today)) return null
  const ended = formatPeriodLong(subscription.endPeriod)
  return `Terminó en ${ended}. Si la extendés, los meses entre ${ended} y ${formatPeriodLong(currentPeriod(today))} no se cargan.`
}

/**
 * "Próximo cobro" de la edición (US-59), recalculado con los valores del formulario y el piso que quedaría
 * después de guardar: extender una terminada lo lleva al período corriente (R8, ADR-032). Tres formas:
 * "Próximo cobro: 10/10/2026 por $7.000,00", "Al guardar se carga octubre 2026 (03/10/2026) por $7.000,00"
 * si con esos valores el período corriente queda vencido sin generar, o "No hay más cobros: terminó en
 * mayo 2026.". Pausada: "Pausada: no hay próximo cobro". null si el monto, el día de cobro o el mes de fin
 * del formulario no son válidos todavía.
 */
export function editNextChargeText(
  values: SubscriptionFormValues,
  original: SubscriptionRecord,
  alreadyGenerated: ReadonlySet<string>,
  today: Date,
): string | null {
  if (original.status === 'paused') return PAUSED_NEXT_CHARGE_TEXT
  const { draft } = validateSubscriptionEdit(values, original, today)
  if (!draft) return null

  const current = currentPeriod(today)
  const extends_ = isEnded(original, today) && !sameEnd(draft.endPeriod, original.endPeriod)
  const floor = extends_ && isPeriodBefore(original.generateFromPeriod, current) ? current : original.generateFromPeriod

  const outlook = chargeOutlook({ billingDay: draft.billingDay, endPeriod: draft.endPeriod }, floor, alreadyGenerated, today)
  const money = subscriptionAmountText(draft.amount.toFixed(), original.currency)
  switch (outlook.kind) {
    case 'now':
      return `Al guardar se carga ${formatPeriodLong(outlook.period)} (${formatDisplayDate(outlook.occurredOn)}) por ${money}`
    case 'next':
      return `Próximo cobro: ${formatDisplayDate(outlook.occurredOn)} por ${money}`
    case 'none':
      return outlook.text
  }
}

/** Una opción de las listas de categoría y medio de pago de la edición. */
export interface EditOption {
  id: string
  label: string
  archived: boolean
}

/**
 * Las opciones de una lista de la edición: las activas más, si la actual ya no lo está, la actual
 * seleccionable con "(archivada)" para poder guardar sin cambiarla. Una vez cambiada, no se vuelve a ofrecer
 * (ADR-032): al recargar la pantalla ya no es la actual.
 */
export function editOptions(
  active: ReadonlyArray<{ id: string; name: string }>,
  current: { id: string; name: string },
): EditOption[] {
  const options: EditOption[] = active.map((item) => ({ id: item.id, label: item.name, archived: false }))
  if (!active.some((item) => item.id === current.id)) {
    options.push({ id: current.id, label: `${current.name} (archivada)`, archived: true })
  }
  return options.sort((a, b) => a.label.localeCompare(b.label, 'es', { sensitivity: 'base' }))
}

/**
 * Aviso al guardar (US-59): "Cambios guardados", más "Antes se cargaron N gastos vencidos con los datos
 * anteriores." si `generated_before` > 0 y "Se cargó el gasto de octubre 2026 con los datos nuevos." si
 * `generated_after` > 0 (ADR-030).
 */
export function editSavedNoticeText(generatedBefore: number, generatedAfter: number, today: Date): string {
  const extras: string[] = []
  if (generatedBefore > 0) {
    extras.push(
      generatedBefore === 1
        ? 'Antes se cargó 1 gasto vencido con los datos anteriores.'
        : `Antes se cargaron ${generatedBefore} gastos vencidos con los datos anteriores.`,
    )
  }
  if (generatedAfter > 0) {
    extras.push(`Se cargó el gasto de ${formatPeriodLong(currentPeriod(today))} con los datos nuevos.`)
  }
  return extras.length > 0 ? `Cambios guardados. ${extras.join(' ')}` : 'Cambios guardados'
}
