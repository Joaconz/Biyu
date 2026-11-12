"""Cruza el catálogo de V3 y la selección de regresión con los títulos de los tests de Playwright.

Uso: python entrega-3/fuentes/cobertura_ejecucion.py [resultados.json]
Sin el JSON solo cuenta qué casos tienen un test que los nombra; con el JSON de
`playwright test --reporter=json` agrega el estado de cada caso (PASSED / FAILED).
"""
import json
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
ID = re.compile(r'CP-[A-Z]+-\d{3}')
sys.path.insert(0, str(Path(__file__).parent))
from mapear_casos_a_tests import ids_en  # noqa: E402


def ids_de(path):
    return set(ID.findall(path.read_text(encoding='utf-8')))


v3 = set()
for p in [*(RAIZ / 'entrega-3' / 'casos').glob('us-*.md'), *(RAIZ / 'entrega-3' / 'casos').glob('adr-*.md')]:
    texto = p.read_text(encoding='utf-8')
    v3 |= set(re.findall(r'^\| (CP-[A-Z]+-\d{3}) \|', texto, re.M))
regresion = set(re.findall(r'^\| (CP-[A-Z]+-\d{3}) \|', (RAIZ / 'entrega-3' / '03-seleccion-regresion.md').read_text(encoding='utf-8'), re.M))

nombrados = {}
for p in (RAIZ / 'e2e').glob('*.spec.ts'):
    for linea in p.read_text(encoding='utf-8').splitlines():
        if re.match(r"\s*test(\.\w+)?\(", linea):
            for i in ids_en(linea.split("(", 1)[1].lstrip("'\"`")):
                nombrados.setdefault(i, set()).add(p.name)

estado = {}
if len(sys.argv) > 1:
    datos = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))

    def recorrer(suite):
        for s in suite.get('suites', []):
            recorrer(s)
        for spec in suite.get('specs', []):
            ids = ids_en(spec['title'])
            ok = spec.get('ok', False)
            for i in ids:
                previo = estado.get(i)
                nuevo = 'PASSED' if ok else 'FAILED'
                estado[i] = 'FAILED' if previo == 'FAILED' else nuevo

    for s in datos.get('suites', []):
        recorrer(s)

for nombre, conjunto in (('V3', v3), ('Regresión', regresion)):
    auto = {i for i in conjunto if i in nombrados}
    print(f'{nombre}: {len(conjunto)} casos, {len(auto)} con test, {len(conjunto - auto)} sin test')
    if estado:
        print('  PASSED', sum(estado.get(i) == 'PASSED' for i in auto), '· FAILED', sum(estado.get(i) == 'FAILED' for i in auto))
    sin = sorted(conjunto - auto)
    if sin:
        print('  sin test:', ', '.join(sin))
