import { describe, expect, it } from 'vitest'
import { emptyDraftInput, type DraftInput } from '@/domain/draft'
import { Decimal } from '@/domain/money'
import {
  alreadySavedToast,
  lastRequestId,
  parsePendingDrafts,
  pendingDraftLabel,
  pendingDraftsStorageKey,
  pendingDraftsTitle,
  recordNetworkFailure,
  recoveryOutcome,
  removePendingDraft,
  restorableValues,
  type PendingDraft,
} from '@/domain/pendingDrafts'
import {
  afterDraftChange,
  failAttempt,
  newSaveAttempt,
  recoveredAttempt,
  requestIdFor,
  sameDraftValues,
  savedDraftDescription,
  savedTransactionDescription,
  startAttempt,
  submitLabel,
} from '@/domain/saveAttempt'
import { classifySaveError } from '@/domain/saveFailure'

// US-70, ADR-034. Montos y nombres ficticios (C14).
const TODAY = '2026-10-06'

const comida: DraftInput = {
  ...emptyDraftInput(TODAY, { accountId: 'visa', accountType: 'credit_card' }),
  amount: '12500',
  categoryId: 'comida',
}

describe('classifySaveError: rechazo o error de red', () => {
  it.each(['22003', '22023', '22P02', '23514', '23503'])('%s (clase 22 o 23) es un rechazo', (code) => {
    expect(classifySaveError({ code, status: 400 })).toEqual({ kind: 'rejected', sessionExpired: false })
  })

  it('42501 y HTTP 401 (PGRST301) son un rechazo por sesión vencida', () => {
    expect(classifySaveError({ code: '42501', status: 403 })).toEqual({ kind: 'rejected', sessionExpired: true })
    expect(classifySaveError({ code: 'PGRST301', status: 401 })).toEqual({ kind: 'rejected', sessionExpired: true })
    expect(classifySaveError({ code: '', status: 401 })).toEqual({ kind: 'rejected', sessionExpired: true })
  })

  it('sin respuesta (sin conexión o 15 s sin respuesta) es error de red', () => {
    expect(classifySaveError({ code: '', status: 0, message: 'TypeError: Failed to fetch' })).toEqual({ kind: 'network' })
    expect(classifySaveError({ code: '', status: 0, message: 'AbortError: signal is aborted' })).toEqual({ kind: 'network' })
    expect(classifySaveError(new TypeError('Failed to fetch'))).toEqual({ kind: 'network' })
    expect(classifySaveError(null)).toEqual({ kind: 'network' })
  })

  it.each([
    ['5xx', { code: '', status: 503 }],
    ['404', { code: 'PGRST202', status: 404 }],
    ['408', { code: '', status: 408 }],
    ['429', { code: '', status: 429 }],
    ['40001', { code: '40001', status: 500 }],
    ['57014', { code: '57014', status: 500 }],
  ])('%s es error de red: se puede reintentar', (_, error) => {
    expect(classifySaveError(error)).toEqual({ kind: 'network' })
  })
})

describe('sameDraftValues: volver al mismo valor no es un cambio', () => {
  it('compara montos ya parseados y la nota sin espacios alrededor', () => {
    expect(sameDraftValues(comida, { ...comida, amount: '12.500,00' })).toBe(true)
    expect(sameDraftValues({ ...comida, description: 'Almuerzo' }, { ...comida, description: ' Almuerzo ' })).toBe(true)
  })

  it('cualquier campo distinto es un cambio', () => {
    expect(sameDraftValues(comida, { ...comida, amount: '12600' })).toBe(false)
    expect(sameDraftValues(comida, { ...comida, categoryId: 'super' })).toBe(false)
    expect(sameDraftValues(comida, { ...comida, installmentsCount: 3 })).toBe(false)
    expect(sameDraftValues(comida, { ...comida, occurredOn: '2026-10-05' })).toBe(false)
    expect(sameDraftValues(comida, { ...comida, description: 'Otra' })).toBe(false)
  })

  it('compara la deuda de un gasto compartido', () => {
    const shared = { ...comida, shared: true, sharedPerson: 'Sofía', sharedAmount: '6000' }
    expect(sameDraftValues(shared, { ...shared, sharedPerson: ' Sofía ', sharedAmount: '6.000' })).toBe(true)
    expect(sameDraftValues(shared, { ...shared, sharedAmount: '5000' })).toBe(false)
    expect(sameDraftValues(shared, comida)).toBe(false)
  })
})

describe('clave de idempotencia del intento (ADR-034)', () => {
  const failedOnce = failAttempt(startAttempt(newSaveAttempt('d1'), 'k1', comida), { kind: 'network' })

  it('el primer Guardar usa una clave nueva', () => {
    expect(requestIdFor(newSaveAttempt('d1'), comida, 'k1')).toBe('k1')
  })

  it('tras un error de red, con los mismos valores, reintenta con la misma clave y el botón dice "Reintentar" (CA-3, CA-5)', () => {
    expect(requestIdFor(failedOnce, { ...comida, amount: '12.500' }, 'k2')).toBe('k1')
    expect(submitLabel(failedOnce, comida, false)).toBe('Reintentar')
    expect(submitLabel(failedOnce, comida, true)).toBe('Guardando…')
  })

  it('cambiar un valor saca el aviso y vuelve a "Guardar gasto", aunque después se vuelva al valor de antes (CA-6)', () => {
    const changed = afterDraftChange(failedOnce, { ...comida, amount: '12600' })
    expect(changed.failure).toBeNull()
    expect(submitLabel(changed, { ...comida, amount: '12600' }, false)).toBe('Guardar gasto')
    const back = afterDraftChange(changed, comida)
    expect(back.failure).toBeNull()
    expect(submitLabel(back, comida, false)).toBe('Guardar gasto')
    expect(requestIdFor(back, comida, 'k2')).toBe('k2')
    expect(back.draftId).toBe('d1')
  })

  it('tocar de nuevo el mismo valor no saca el aviso', () => {
    expect(afterDraftChange(failedOnce, { ...comida })).toBe(failedOnce)
  })

  it('un rechazo no se reintenta: el aviso queda y el próximo Guardar usa otra clave (CA-16)', () => {
    const rejected = failAttempt(startAttempt(newSaveAttempt('d1'), 'k1', comida), { kind: 'rejected', sessionExpired: false })
    expect(rejected.failure).toEqual({ kind: 'rejected', sessionExpired: false })
    expect(submitLabel(rejected, comida, false)).toBe('Guardar gasto')
    expect(requestIdFor(rejected, comida, 'k2')).toBe('k2')
    expect(afterDraftChange(rejected, { ...comida, categoryId: 'super' }).failure).toBeNull()
  })

  it('un ingreso dice "Guardar ingreso"', () => {
    expect(submitLabel(newSaveAttempt('d1'), { ...comida, type: 'income' }, false)).toBe('Guardar ingreso')
  })

  it('el borrador recuperado guarda con la última clave mientras no cambie (CA-19); si cambia, con otra (CA-25)', () => {
    const recovered = recoveredAttempt('d1', 'k2', comida)
    expect(submitLabel(recovered, comida, false)).toBe('Guardar gasto')
    expect(requestIdFor(recovered, comida, 'k3')).toBe('k2')
    const sinCategoria = { ...comida, categoryId: null }
    expect(requestIdFor(recovered, sinCategoria, 'k3')).toBe('k3')
  })
})

describe('descripción del toast de éxito (CA-1, CA-2)', () => {
  it('monto, cuotas si hay más de una, categoría y cuenta', () => {
    const base = { currency: 'ARS' as const, accountName: 'Visa BBVA' }
    expect(
      savedTransactionDescription({ ...base, amount: new Decimal('12500'), installmentsCount: 1, categoryName: 'Comida' }),
    ).toBe('$12.500,00 · Comida · Visa BBVA')
    expect(
      savedTransactionDescription({ ...base, amount: new Decimal('120000'), installmentsCount: 12, categoryName: 'Tecnología' }),
    ).toBe('$120.000,00 en 12 cuotas · Tecnología · Visa BBVA')
    expect(
      savedTransactionDescription({
        amount: new Decimal('50'),
        currency: 'USD',
        installmentsCount: 1,
        categoryName: 'Viajes',
        accountName: 'Efectivo',
      }),
    ).toBe('US$50,00 · Viajes · Efectivo')
    expect(
      savedTransactionDescription({ ...base, amount: new Decimal('300000'), installmentsCount: 1, categoryName: null, accountName: 'Banco' }),
    ).toBe('$300.000,00 · Banco')
  })

  it('un gasto compartido suma la línea de US-34 al final', () => {
    const shared = { ...comida, amount: '120000', shared: true, sharedPerson: 'Sofía', sharedAmount: '60000' }
    expect(savedDraftDescription(shared, { categoryName: 'Comida', accountName: 'Visa BBVA' })).toBe(
      '$120.000,00 · Comida · Visa BBVA · Sofía te debe $60.000,00',
    )
  })
})

describe('movimientos pendientes (NFR-09, ADR-034)', () => {
  const failure = (id: string, values: DraftInput, requestId: string) => ({
    id,
    values,
    requestId,
    categoryName: 'Comida',
    accountName: 'Visa BBVA',
  })

  it('la entrada del dispositivo lleva el user_id', () => {
    expect(pendingDraftsStorageKey('u-1')).toBe('biyu:pending-drafts:u-1')
  })

  it('un fallo de red agrega el borrador con su clave', () => {
    const list = recordNetworkFailure([], failure('d1', comida, 'k1'))
    expect(list).toEqual([{ id: 'd1', values: comida, requestIds: ['k1'], categoryName: 'Comida', accountName: 'Visa BBVA' }])
  })

  it('el mismo borrador editado que vuelve a fallar actualiza su pendiente con una clave más (CA-6c)', () => {
    const edited = { ...comida, amount: '12600' }
    const list = recordNetworkFailure(recordNetworkFailure([], failure('d1', comida, 'k1')), failure('d1', edited, 'k2'))
    expect(list).toHaveLength(1)
    expect(list[0].values.amount).toBe('12600')
    expect(list[0].requestIds).toEqual(['k1', 'k2'])
    expect(lastRequestId(list[0])).toBe('k2')
  })

  it('reintentar con la misma clave no la repite', () => {
    const list = recordNetworkFailure(recordNetworkFailure([], failure('d1', comida, 'k1')), failure('d1', comida, 'k1'))
    expect(list[0].requestIds).toEqual(['k1'])
  })

  it('dos borradores distintos son dos pendientes, el más reciente primero, y uno no pisa al otro (CA-18)', () => {
    const kiosco = { ...comida, amount: '3400' }
    const list = recordNetworkFailure(recordNetworkFailure([], failure('d1', comida, 'k1')), failure('d2', kiosco, 'k2'))
    expect(list.map((p) => p.id)).toEqual(['d2', 'd1'])
    expect(removePendingDraft(list, 'd2').map((p) => p.id)).toEqual(['d1'])
  })

  it('título y filas del aviso', () => {
    expect(pendingDraftsTitle(1)).toBe('Tenés 1 movimiento sin guardar')
    expect(pendingDraftsTitle(2)).toBe('Tenés 2 movimientos sin guardar')
    const [gasto] = recordNetworkFailure([], failure('d1', comida, 'k1'))
    expect(pendingDraftLabel(gasto)).toBe('Gasto · $12.500,00 · Comida · 06/10/2026')
    const ingreso: PendingDraft = {
      ...gasto,
      values: { ...comida, type: 'income', amount: '300000', categoryId: null, occurredOn: '2026-10-01' },
      categoryName: null,
    }
    expect(pendingDraftLabel(ingreso)).toBe('Ingreso · $300.000,00 · 01/10/2026')
  })

  it('"Recuperar": activa → ya guardado; solo eliminada → guardado y eliminado; ninguna → no se guardó', () => {
    expect(recoveryOutcome([{ deletedAt: null }])).toBe('saved')
    expect(recoveryOutcome([{ deletedAt: '2026-10-06T12:00:00Z' }, { deletedAt: null }])).toBe('saved')
    expect(recoveryOutcome([{ deletedAt: '2026-10-06T12:00:00Z' }])).toBe('saved-and-deleted')
    expect(recoveryOutcome([])).toBe('not-saved')
  })

  it('textos del toast de "ya estaba guardado" (CA-20, CA-21)', () => {
    expect(alreadySavedToast('saved', '$12.500,00 · Comida · Visa BBVA')).toEqual({
      title: 'Ese movimiento ya estaba guardado',
      description: '$12.500,00 · Comida · Visa BBVA',
    })
    expect(alreadySavedToast('saved-and-deleted', 'x')).toEqual({
      title: 'Ese movimiento ya estaba guardado y después se eliminó',
      description: 'Está en Movimientos, en Eliminados.',
    })
  })

  it('el borrador recuperado conserva fecha y tipo de cambio; una cuenta o categoría archivada queda vacía (CA-19, CA-25)', () => {
    const usd = { ...comida, currency: 'USD' as const, fxRate: '1.350,00', occurredOn: '2026-09-30' }
    const active = { categoryIds: new Set(['comida']), accountIds: new Set(['visa']) }
    expect(restorableValues(usd, active)).toEqual(usd)
    const archived = restorableValues(usd, { categoryIds: new Set(), accountIds: new Set() })
    expect(archived).toMatchObject({ categoryId: null, accountId: null, accountType: null, occurredOn: '2026-09-30', fxRate: '1.350,00' })
  })

  it('lee lo guardado en el dispositivo e ignora lo que no tiene la forma esperada', () => {
    const list = recordNetworkFailure([], failure('d1', comida, 'k1'))
    expect(parsePendingDrafts(JSON.stringify(list))).toEqual(list)
    expect(parsePendingDrafts(null)).toEqual([])
    expect(parsePendingDrafts('no es json')).toEqual([])
    expect(parsePendingDrafts('{"id":"d1"}')).toEqual([])
    expect(parsePendingDrafts(JSON.stringify([{ ...list[0], requestIds: [] }, { id: 'x' }, list[0]]))).toEqual(list)
  })
})
