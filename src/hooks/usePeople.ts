import { useEffect, useState } from 'react'
import { fetchPersonNames } from '@/lib/debts'

/** US-100: las personas de mis deudas, para sugerir al escribir. Si falla, no hay sugerencias: el campo sigue siendo libre. */
export function usePeople(): string[] {
  const [people, setPeople] = useState<string[]>([])
  useEffect(() => {
    let cancelled = false
    fetchPersonNames()
      .then((names) => {
        if (!cancelled) setPeople(names)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])
  return people
}
