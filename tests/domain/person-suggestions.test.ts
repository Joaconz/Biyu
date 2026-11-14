import { describe, expect, it } from 'vitest'
import { suggestPeople } from '@/domain/debts'

describe('suggestPeople (US-100)', () => {
  const known = ['Sofía', 'Juan Pérez', 'juan', 'Mariana', 'Ana']

  it('sugiere sin distinguir mayúsculas, tildes ni espacios de más (CA-1)', () => {
    expect(suggestPeople(known, 'SOFIA')).toEqual(['Sofía'])
    expect(suggestPeople(known, '  juán  p')).toEqual(['Juan Pérez'])
  })

  it('las que empiezan con lo escrito van antes que las que lo contienen', () => {
    expect(suggestPeople(known, 'an')).toEqual(['Ana', 'Juan Pérez', 'juan', 'Mariana'])
  })

  it('cada persona sale una vez, con el nombre más reciente (el primero de la lista)', () => {
    expect(suggestPeople(['Juan', 'juan', 'Juán'], 'ju')).toEqual(['Juan'])
  })

  it('sin coincidencias, con el campo vacío o con lo ya escrito tal cual no sugiere (CA-3)', () => {
    expect(suggestPeople(known, 'zzz')).toEqual([])
    expect(suggestPeople(known, '   ')).toEqual([])
    expect(suggestPeople(['Sofía'], 'Sofía')).toEqual([])
  })

  it('respeta el máximo de sugerencias', () => {
    expect(suggestPeople(['Ana1', 'Ana2', 'Ana3', 'Ana4', 'Ana5', 'Ana6', 'Ana7'], 'ana')).toHaveLength(5)
    expect(suggestPeople(['Ana1', 'Ana2', 'Ana3'], 'ana', 2)).toEqual(['Ana1', 'Ana2'])
  })
})
