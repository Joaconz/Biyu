"""Propone qué test de Playwright cubre cada caso de V3 que todavía no tiene el ID en el título.

Los tests de las historias US-80 a US-91 se escribieron por criterio de aceptación («US-86 CA-3 · …»).
Cada caso tiene la columna «Criterio». El cruce es: mismo archivo de la historia + algún CA en común.
Imprime la propuesta; con --aplicar antepone los IDs al título del test (solo el texto del título).
"""
import re
import sys
from collections import defaultdict
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
ID = re.compile(r'CP-[A-Z]+-\d{3}')
ABREV = re.compile(r'(CP-([A-Z]+)-(\d{3}))((?:\s*(?:,|y|a)\s*\d{3})*)')


def ids_en(titulo):
    """IDs de un título: «CP-NAV-011 y 025» son CP-NAV-011 y CP-NAV-025; «CP-DEU-001 a 003», el rango."""
    antes = titulo.split(' · ')[0]
    salida = []
    for m in ABREV.finditer(antes):
        pref, primero, resto = m.group(2), int(m.group(3)), m.group(4)
        salida.append(f'CP-{pref}-{primero:03d}')
        anterior = primero
        for sep, num in re.findall(r'(,|y|a)\s*(\d{3})', resto):
            n = int(num)
            rango = range(anterior + 1, n + 1) if sep == 'a' else [n]
            salida += [f'CP-{pref}-{k:03d}' for k in rango]
            anterior = n
    return salida

# historia → archivos de e2e que la prueban
SPECS = {
    80: ['import-started-purchase.spec.ts'],
    81: ['import-guide.spec.ts'],
    82: ['shared-many-people.spec.ts'],
    83: ['dashboard-loose-debts.spec.ts', 'dashboard-balance-options.spec.ts'],
    84: ['transactions-edit.spec.ts'],
    85: ['transactions-purge.spec.ts'],
    86: ['debts-edit.spec.ts'],
    87: ['debts-delete.spec.ts'],
    88: ['subscriptions-delete.spec.ts'],
    89: ['settings.spec.ts'],
    90: ['accounts-unarchive.spec.ts'],
    91: ['debts-grouping.spec.ts'],
}


def cas_de(texto):
    """Números de CA de un texto: «CA-3, CA-4», «CA-8 a CA-11», «CA-1, CA-3 y CA-14»."""
    out = set()
    for m in re.finditer(r'CA-(\d+)(?:\s*a\s*(?:CA-)?(\d+))?', texto):
        a = int(m.group(1))
        b = int(m.group(2)) if m.group(2) else a
        out |= set(range(a, b + 1))
    for m in re.finditer(r'(?:,|y)\s*(\d+)\b', texto):
        pass
    return out


def casos_de(us):
    arch = next(RAIZ.glob(f'entrega-3/casos/us-{us}-*.md'))
    filas = []
    for linea in arch.read_text(encoding='utf-8').splitlines():
        m = re.match(r'\| (CP-[A-Z]+-\d{3}) \| (.*?) \| (.*?) \|', linea)
        if m:
            filas.append((m.group(1), m.group(2), m.group(3)))
    return filas


def tests_de(spec):
    ruta = RAIZ / 'e2e' / spec
    salida = []
    for n, linea in enumerate(ruta.read_text(encoding='utf-8').splitlines(), 1):
        m = re.match(r"\s*test(?:\.\w+)?\((['\"`])(.*?)\1", linea)
        if m:
            salida.append((spec, n, m.group(2)))
    return salida


if __name__ == '__main__':
    sin = []
    for us, specs in SPECS.items():
        try:
            casos = casos_de(us)
        except StopIteration:
            continue
        tests = [t for s in specs for t in tests_de(s)]
        for cid, titulo, crit in casos:
            ca = cas_de(crit)
            hit = [t for t in tests if ca & cas_de(t[2].split(' · ')[0].split(' — ')[0].split(' — ')[0].split(' – ')[0])]
            if not hit:
                sin.append((us, cid, crit, titulo))
            elif '--ver' in sys.argv:
                print(us, cid, crit, '->', [f'{h[0]}:{h[1]}' for h in hit])
    print('sin test por criterio:', len(sin))
    for s in sin:
        print(' ', s)
