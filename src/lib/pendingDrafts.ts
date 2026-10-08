import { parsePendingDrafts, pendingDraftsStorageKey, type PendingDraft } from '@/domain/pendingDrafts'

/**
 * Los movimientos pendientes en este dispositivo (US-70, ADR-034), uno por usuario. Si el navegador no
 * deja leer o escribir (almacenamiento lleno o bloqueado), no hay pendientes y no se avisa nada: el
 * aviso de error y "Reintentar" funcionan igual.
 */
export function loadPendingDrafts(userId: string): PendingDraft[] {
  try {
    return parsePendingDrafts(localStorage.getItem(pendingDraftsStorageKey(userId)))
  } catch {
    return []
  }
}

export function savePendingDrafts(userId: string, list: readonly PendingDraft[]): void {
  try {
    const key = pendingDraftsStorageKey(userId)
    if (list.length === 0) localStorage.removeItem(key)
    else localStorage.setItem(key, JSON.stringify(list))
  } catch {
    // Sin almacenamiento no hay pendientes (ADR-034).
  }
}

/** Lee, aplica un cambio y vuelve a escribir: otra pestaña pudo haber sumado un pendiente. */
export function updatePendingDrafts(userId: string, change: (list: PendingDraft[]) => PendingDraft[]): PendingDraft[] {
  const next = change(loadPendingDrafts(userId))
  savePendingDrafts(userId, next)
  return next
}

/** Al cerrar sesión se borran todos los del usuario (US-64): quien cierra sesión deja el dispositivo. */
export function clearPendingDrafts(userId: string): void {
  savePendingDrafts(userId, [])
}
