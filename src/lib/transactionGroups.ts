// Agrupado por día de la lista de movimientos. Sin React ni Supabase: se testea en tests/lib/.

export interface DayGroup<T> {
  date: string // YYYY-MM-DD (occurred_on)
  items: T[]
}

/**
 * Agrupa por `occurred_on` conservando el orden que ya trae la consulta (fecha desc, luego
 * created_at desc): no reordena, solo corta donde cambia el día.
 */
export function groupByDay<T extends { occurred_on: string }>(items: readonly T[]): DayGroup<T>[] {
  const groups: DayGroup<T>[] = []
  for (const item of items) {
    const last = groups.at(-1)
    if (last && last.date === item.occurred_on) last.items.push(item)
    else groups.push({ date: item.occurred_on, items: [item] })
  }
  return groups
}
