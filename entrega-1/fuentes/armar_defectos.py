"""Arma fuentes/defectos.json: los 16 defectos cargados en GitHub (#142-#157), con su estado
reconfirmado en la corrida de esta entrega, más los defectos nuevos que encontró esa corrida.

Uso: gh issue list --state all --search "DEF- in:title" --limit 50 --json number,title,body,state > /tmp/defects.json
     python3 entrega-1/fuentes/armar_defectos.py /tmp/defects.json
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RUN = json.loads((ROOT / 'ejecucion' / 'resultados.json').read_text())
RES = {r['id']: r for r in RUN['results']}
RETEST = {r['id']: r for r in RUN['retests']}
NUEVOS = json.loads((ROOT / 'fuentes' / 'defectos-nuevos.json').read_text())
FECHA = RUN['today']
COMMIT = RUN.get('commit') or ''

# Historia afectada de cada defecto existente (sale del caso o del requerimiento citado en el issue).
HISTORIA = {
    'DEF-001': 'US-48 · La app pide login (navegación)', 'DEF-002': 'Transversal (NFR-06, accesibilidad)',
    'DEF-003': 'US-66 · Confirmar contraseña al registrarse', 'DEF-004': 'US-11 · No se puede guardar monto cero o negativo',
    'DEF-005': 'US-67 · Criterios de contraseña (FR-01)', 'DEF-006': 'US-44 · Archivar una categoría sin perder historia',
    'DEF-007': 'US-65 · Eliminar una transacción (FR-08)', 'DEF-008': 'US-48 · La app pide login',
    'DEF-009': 'US-45 · Crear cuentas indicando su tipo (I6)', 'DEF-010': 'US-43 · Set inicial de categorías y cuentas',
    'DEF-011': 'US-45 · Cuentas (FR-05)', 'DEF-012': 'US-11 · Validación del monto',
    'DEF-013': 'US-19 · Registrar un gasto en USD', 'DEF-014': 'US-26 · Cambiar de mes con un selector',
    'DEF-015': 'Transversal (data-testid, plan de testing §2)', 'DEF-016': 'V2 · Deudas (I7), latente en el schema',
}
SEV = {'Crítica': 'Crítica', 'Alta': 'Alta', 'Media': 'Media', 'Baja': 'Baja'}


def clean(s):
    return re.sub(r'`', '', s or '').replace('<br>', ' ').strip()


def split_steps(text):
    """Corta "1) … 2) … 3) …" solo en la numeración correlativa, no en "(14,2)"."""
    out, n, pos = [], 1, 0
    starts = []
    while True:
        m = re.search(rf'(?:^|\s){n}\)\s', text[pos:])
        if not m:
            break
        starts.append(pos + m.end())
        pos += m.end()
        n += 1
    if not starts:
        return [text]
    for i, st in enumerate(starts):
        end = starts[i + 1] if i + 1 < len(starts) else len(text)
        chunk = text[st:end]
        if i + 1 < len(starts):
            chunk = re.sub(rf'\s{i + 2}\)\s$', '', chunk)
        out.append(chunk.strip())
    return out


def estado(def_id, gh_state, retest):
    rep = retest.get('reproduce') if retest else None
    if rep is True:
        return f'Abierto · se reproduce el {FECHA}'
    if rep is False:
        return f'Cerrado · confirmado corregido el {FECHA}' if gh_state == 'CLOSED' else f'Corregido · no se reproduce el {FECHA} (falta cerrar el issue)'
    return 'Abierto · sin re-test'


def main(path):
    issues = json.loads(Path(path).read_text())
    out = []
    for x in sorted(issues, key=lambda x: x['number']):
        m = re.match(r'(DEF-\d+) · (.+)', x['title'])
        if not m:
            continue
        did, titulo = m.group(1), re.sub(r'^\[Crítica\]\s*', '', m.group(2))
        f = {}
        for line in x['body'].split('\n'):
            mm = re.match(r'\|\s*([^|]+?)\s*\|\s*(.+?)\s*\|\s*$', line)
            if mm and mm.group(1) not in ('Campo', '---'):
                f[mm.group(1)] = mm.group(2)
        enc = re.search(r'\*\*Encontrado en:\*\*\s*(.+)', x['body'])
        sev_raw = clean(f.get('Severidad', ''))
        sev = next((v for k, v in SEV.items() if sev_raw.startswith(f'**{k}') or sev_raw.startswith(k)), sev_raw.split(' ')[0])
        rt = RETEST.get(did)
        pasos = split_steps(clean(f.get('Pasos para reproducir', '')))
        caso = clean(f.get('Caso de prueba', '—'))
        out.append({
            'id': did, 'titulo': titulo, 'issue': f'#{x["number"]}', 'severidad': sev,
            'prioridad': 'A definir por el PO' + (f' (sugerida: {re.sub(r'^sugerida\s*', '', clean(f.get("Prioridad")).split("—")[-1].strip())})' if 'sugerida' in f.get('Prioridad', '') else ''),
            'estado': estado(did, x['state'], rt), 'reporter': 'Sesión test-adversary (#75), coordinada por Joaquin Nuñez',
            'encontrado': clean(enc.group(1)) if enc else 'Ejecución de #75', 'caso': caso, 'historia': HISTORIA.get(did, '—'),
            'entorno': clean(f.get('Entorno', '')), 'descripcion': titulo + '.', 'pasos': pasos or [clean(f.get('Pasos para reproducir', ''))],
            'esperado': clean(f.get('Resultado esperado', '')), 'obtenido': clean(f.get('Resultado obtenido', '')),
            'evidencia': clean(f.get('Evidencia', '')) + (f' · Re-test {FECHA} (main {COMMIT}): {rt["obtained"]}' if rt else ''),
            'notas': '',
        })
    out += NUEVOS
    (ROOT / 'fuentes' / 'defectos.json').write_text(json.dumps(out, ensure_ascii=False, indent=2))
    print(len(out), 'defectos')


if __name__ == '__main__':
    main(sys.argv[1])
