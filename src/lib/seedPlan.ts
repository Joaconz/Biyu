// Qué sembrar (US-43, ADR-014). Sin Supabase: se testea en tests/lib/.

interface Named {
  name: string
}

/**
 * Lo que falta sembrar, dado todo lo que el usuario ya tiene. Se siembra solo a quien nunca tuvo
 * una categoría, ni activa ni archivada (DEF-010: archivarlas todas es una decisión del usuario,
 * no una siembra fallida). Las categorías sirven de marca de "ya sembrado" porque nunca se borran
 * físicamente; las cuentas sí (DEF-011, ADR-026), así que no alcanzan. A un usuario sin
 * categorías se le completa lo que falte por nombre, sin distinguir mayúsculas (DEF-019): cubre
 * la carrera entre /signup y /register de ADR-014 sin duplicar.
 */
export function seedPlan<C extends Named, A extends Named>(
  existing: { categories: readonly (Named & { archived: boolean })[]; accounts: readonly Named[] },
  defaults: { categories: readonly C[]; accounts: readonly A[] },
): { categories: C[]; accounts: A[] } {
  if (existing.categories.length > 0) return { categories: [], accounts: [] }
  const missing = <T extends Named>(wanted: readonly T[], have: readonly Named[]) => {
    const names = new Set(have.map((item) => item.name.toLowerCase()))
    return wanted.filter((item) => !names.has(item.name.toLowerCase()))
  }
  return { categories: [...defaults.categories], accounts: missing(defaults.accounts, existing.accounts) }
}
