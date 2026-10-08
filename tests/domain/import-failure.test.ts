import { describe, expect, it } from 'vitest'
import {
  classifyImportFailure,
  importFailureMessage,
  importPending,
  submitActionAfter,
  submitButtonText,
} from '@/domain/importFailure'

describe('errores de toda la importación (§7, US-78 · CA-3)', () => {
  it.each([
    ['sin respuesta (corte, sin conexión, 30 s)', { code: '', message: 'Failed to fetch', status: 0 }, 'no-response'],
    ['un 504 del gateway sin código de Postgres', { code: '', message: 'Gateway Timeout', status: 504 }, 'no-response'],
    ['un error sin forma conocida', new Error('boom'), 'no-response'],
    ['sesión vencida en la RPC (42501)', { code: '42501', status: 403 }, 'session'],
    ['token vencido (PGRST301, 401)', { code: 'PGRST301', status: 401 }, 'session'],
    ['statement_timeout (57014)', { code: '57014', status: 500 }, 'timeout'],
    ['lote inválido (23514)', { code: '23514', status: 400 }, 'other'],
    ['otro error de la base', { code: 'XX000', status: 500 }, 'other'],
    ['PostgREST sin conexión a la base (PGRST001, 503)', { code: 'PGRST001', status: 503 }, 'other'],
  ])('%s', (_, error, failure) => {
    expect(classifyImportFailure(error)).toBe(failure)
  })

  it('mensajes exactos', () => {
    expect(importFailureMessage('no-response')).toBe(
      'No pudimos confirmar la importación. Puede que se haya guardado: tocá Reintentar y te decimos qué pasó.',
    )
    expect(importFailureMessage('session')).toBe(
      'Tu sesión venció y no se importó ninguna fila. Volvé a entrar y subí el archivo de nuevo.',
    )
    expect(importFailureMessage('timeout')).toBe(
      'La importación tardó demasiado y no se importó ninguna fila. Dividí el archivo en partes más chicas.',
    )
    expect(importFailureMessage('other')).toBe('No se importó ninguna fila. Probá de nuevo en un rato.')
  })

  it('el botón pasa a Reintentar, salvo con la sesión vencida', () => {
    expect(submitActionAfter(null)).toBe('import')
    expect(submitActionAfter('no-response')).toBe('retry')
    expect(submitActionAfter('timeout')).toBe('retry')
    expect(submitActionAfter('other')).toBe('retry')
    expect(submitActionAfter('session')).toBe('login')
    expect(submitButtonText('import', true, 'Importar 7 movimientos')).toBe('Importando…')
    expect(submitButtonText('retry', false, 'Importar 7 movimientos')).toBe('Reintentar')
    expect(submitButtonText('import', false, 'Importar 7 movimientos')).toBe('Importar 7 movimientos')
    expect(submitButtonText('login', false, 'Importar 7 movimientos')).toBe('Volver a entrar')
    // Mientras corre la llamada, el botón dice "Importando…" aunque venga de un error.
    expect(submitButtonText('retry', true, 'Importar 7 movimientos')).toBe('Importando…')
  })
})

describe('salir con una importación pendiente (§8, US-78 · CA-4)', () => {
  it('pregunta mientras importa o sin saber si se guardó; no en los demás estados', () => {
    expect(importPending(true, null)).toBe(true)
    expect(importPending(false, 'no-response')).toBe(true)
    expect(importPending(false, null)).toBe(false)
    expect(importPending(false, 'timeout')).toBe(false)
    expect(importPending(false, 'other')).toBe(false)
    expect(importPending(false, 'session')).toBe(false)
  })
})
