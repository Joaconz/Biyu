"""Genera entrega-3/01-especificacion-casos-v3.xlsx desde entrega-3/casos/us-*.md.

Uso (desde la raíz del repo):  python3 entrega-3/fuentes/generar_casos_v3.py
Necesita openpyxl. Una hoja «Índice» con todos los casos y una hoja por sección de cada archivo
(una sección puede cubrir varios casos: el nombre de la hoja lo dice). El formato de cada hoja
sigue la planilla de la cátedra (ID, prioridad, técnica, trazabilidad, pasos y resultado esperado).
"""
import re
import sys
from collections import OrderedDict
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side

ROOT = Path(__file__).resolve().parent.parent
CASOS = sorted((ROOT / 'casos').glob('us-*.md'), key=lambda p: int(re.match(r'us-(\d+)', p.name).group(1)))
OUT = ROOT / '01-especificacion-casos-v3.xlsx'

LABEL = PatternFill('solid', fgColor='FFFFFFCC')
HEAD = PatternFill('solid', fgColor='FF1B4D3E')
THIN = Side(style='thin', color='FFBFBFBF')
BOX = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)
WRAP = Alignment(wrap_text=True, vertical='top')
BOLD = Font(bold=True)
WHITE = Font(bold=True, color='FFFFFFFF')
ID_RE = re.compile(r'CP-([A-Z]+)-(\d{3})')


def clean(s):
    return re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', s.replace('**', '')).strip()


def cells(line):
    return [c.strip() for c in line.strip().strip('|').split('|')]


def is_separator(line):
    return set(line) <= set('|- :')


def expand(heading):
    """IDs que cubre el título de una sección: 'CP-X-001 a CP-X-003', 'CP-X-064 / 065', 'CP-X-1 y CP-X-2'."""
    found = list(ID_RE.finditer(heading))
    if not found:
        return []
    pre = found[0].group(1)
    nums = [int(m.group(2)) for m in found]
    for n in re.findall(r'(?:/|,| y )\s*(\d{3})\b', heading[found[0].end():]):
        if int(n) not in nums:
            nums.append(int(n))
    if ' a ' in heading and len(nums) >= 2:
        return [f'CP-{pre}-{n:03d}' for n in range(nums[0], nums[1] + 1)]
    return [f'CP-{pre}-{n:03d}' for n in nums]


def parse(path):
    lines = path.read_text(encoding='utf-8').splitlines()
    title = lines[0].lstrip('# ').strip()
    head, sections, cur = [], [], None
    for ln in lines[1:]:
        if ln.startswith('## '):
            cur = {'title': ln[3:].strip(), 'lines': []}
            sections.append(cur)
        elif cur is None:
            head.append(ln)
        else:
            cur['lines'].append(ln)
    meta = {}
    for ln in head:
        m = re.match(r'\*\*([^:*]+):\*\*\s*(.*)', ln)
        if m:
            meta[m.group(1)] = clean(m.group(2))
    rows, hdr = [], None
    for ln in head:
        if ln.startswith('|'):
            if hdr is None:
                hdr = cells(ln)
            elif not is_separator(ln):
                rows.append(dict(zip(hdr, cells(ln))))
    us = re.search(r'\(US-(\d+)\)', title)
    return 'US-' + us.group(1) if us else '', meta, rows, sections


def sheet_name(ids, used):
    pre = ids[0].split('-')[1]
    nums = [i.split('-')[2] for i in ids]
    name = f'{pre}-{nums[0]}' if len(nums) == 1 else f'{pre}-{nums[0]}-{nums[-1]}'
    base, k = name, 2
    while name in used:
        name, k = f'{base}_{k}', k + 1
    used.add(name)
    return name


def put(ws, ref, value, label=False, merge=None):
    c = ws[ref]
    c.value = value
    c.alignment = WRAP
    c.border = BOX
    if label:
        c.fill = LABEL
        c.font = BOLD
    if merge:
        ws.merge_cells(merge)
        for row in ws[merge]:
            for cc in row:
                cc.border = BOX


def uniq(values):
    return list(OrderedDict.fromkeys(v for v in values if v))


def build_case_sheet(wb, name, ids, rows_by_id, us, meta, sec):
    ws = wb.create_sheet(name)
    for col, w in zip('ABCDE', (22, 46, 22, 46, 22)):
        ws.column_dimensions[col].width = w
    info = [rows_by_id[i] for i in ids]
    desc = ' · '.join(f"{i}: {clean(r.get('Título', ''))}" for i, r in zip(ids, info))
    crit = ' / '.join(uniq(r.get('Criterio', '') for r in info))
    put(ws, 'A1', 'Test Case ID', label=True)
    put(ws, 'B1', ', '.join(ids))
    put(ws, 'C1', 'Descripción / Funcionalidad', label=True)
    put(ws, 'D1', desc, merge='D1:E1')
    put(ws, 'A2', 'Creado por', label=True)
    put(ws, 'B2', 'Equipo Biyu (casos de V3, entrega-3/casos/)')
    put(ws, 'C2', 'Versión', label=True)
    put(ws, 'D2', '3', merge='D2:E2')
    put(ws, 'A3', 'Reporte de ejecución 1', label=True, merge='A3:B3')
    put(ws, 'C3', 'Reporte de ejecución 2', label=True)
    put(ws, 'D3', 'Reporte de ejecución 3', label=True, merge='D3:E3')
    put(ws, 'A5', 'Prioridad (Alta, Media, Baja)', label=True)
    put(ws, 'B5', ' / '.join(uniq(r.get('Prioridad', '') for r in info)))
    put(ws, 'C5', 'Camino feliz', label=True)
    put(ws, 'D5', ' / '.join('Sí' if r.get('Tipo') == 'Positivo' else 'No' for r in info), merge='D5:E5')
    put(ws, 'A6', 'Técnica / Tipo', label=True)
    put(ws, 'B6', ' / '.join(uniq(f"{r.get('Técnica', '')} · {r.get('Tipo', '')}" for r in info)))
    put(ws, 'C6', 'Trazabilidad', label=True)
    put(ws, 'D6', f'{us} · {crit}' if crit else us, merge='D6:E6')
    put(ws, 'A8', 'Historia', label=True)
    put(ws, 'B8', meta.get('Historia', ''), merge='B8:E8')
    put(ws, 'A9', 'Oráculo', label=True)
    put(ws, 'B9', meta.get('Oráculo', ''), merge='B9:E9')
    put(ws, 'A10', 'Convenciones', label=True)
    put(ws, 'B10', meta.get('Convenciones', ''), merge='B10:E10')
    for r in (8, 9, 10):
        ws.row_dimensions[r].height = 15 * (1 + len(str(ws[f'B{r}'].value)) // 120)
    put(ws, 'A12', 'Título del CP', label=True)
    put(ws, 'B12', desc, merge='B12:E12')
    put(ws, 'A13', 'Estado Automatización', label=True)
    put(ws, 'B13', ' / '.join(uniq(r.get('Automatizable', '') for r in info)), merge='B13:C13')
    put(ws, 'D13', meta.get('Automatización', ''), merge='D13:E13')
    ws.row_dimensions[13].height = 15 * (1 + len(meta.get('Automatización', '')) // 60)
    prose, tables, cur = [], [], None
    for ln in sec['lines']:
        if ln.startswith('|'):
            if cur is None:
                cur = []
                tables.append(cur)
            if not is_separator(ln):
                cur.append(cells(ln))
        else:
            cur = None
            if ln.strip():
                prose.append(clean(ln))
    row = 15
    if prose:
        text = '\n'.join(prose)
        put(ws, f'A{row}', 'Pre-requisitos, datos y pasos', label=True)
        put(ws, f'B{row}', text, merge=f'B{row}:E{row}')
        ws.row_dimensions[row].height = min(400, 15 * (1 + sum(len(p) // 120 + 1 for p in prose)))
        row += 2
    for t in tables:
        if not t:
            continue
        hdr, body = t[0], t[1:]
        put(ws, f'A{row}', hdr[0], label=True)
        put(ws, f'B{row}', hdr[1] if len(hdr) > 1 else '', label=True, merge=f'B{row}:C{row}')
        put(ws, f'D{row}', ' '.join(hdr[2:]), label=True, merge=f'D{row}:E{row}')
        row += 1
        for r in body:
            r = r + [''] * (3 - len(r))
            put(ws, f'A{row}', clean(r[0]))
            put(ws, f'B{row}', clean(r[1]), merge=f'B{row}:C{row}')
            res = clean(' '.join(r[2:]))
            put(ws, f'D{row}', res, merge=f'D{row}:E{row}')
            ws.row_dimensions[row].height = min(300, 15 * (1 + max(len(r[1]) // 65, len(res) // 65)))
            row += 1
        row += 1
    return ws


def main():
    wb = Workbook()
    idx = wb.active
    idx.title = 'Índice'
    allrows, sheets_for, used = [], {}, {'Índice'}
    for path in CASOS:
        us, meta, rows, sections = parse(path)
        rows_by_id = {r['ID']: r for r in rows}
        for r in rows:
            r['_us'] = us
        allrows.extend(rows)
        for sec in sections:
            ids = [i for i in expand(sec['title']) if i in rows_by_id]
            if not ids:
                continue
            name = sheet_name(ids, used)
            build_case_sheet(wb, name, ids, rows_by_id, us, meta, sec)
            for i in ids:
                sheets_for[i] = name
    ids = [r['ID'] for r in allrows]
    missing = [i for i in ids if i not in sheets_for]
    dup = sorted({i for i in ids if ids.count(i) > 1})
    if missing:
        print('SIN HOJA:', missing)
    if dup:
        print('DUPLICADOS:', dup)
    idx.merge_cells('A1:J1')
    idx['A1'] = 'Biyu · Entrega 3 · Especificación de casos de prueba (V3)'
    idx['A1'].font = Font(bold=True, size=13)
    heads = ['Test case ID', 'Prioridad', 'Título', 'User story', 'Criterio', 'Camino feliz', 'Tipo', 'Técnica',
             'Canal', 'Automatizable']
    for j, h in enumerate(heads, 1):
        c = idx.cell(row=2, column=j, value=h)
        c.fill, c.font, c.border, c.alignment = HEAD, WHITE, BOX, WRAP
    for i, r in enumerate(allrows, 3):
        vals = [r['ID'], r.get('Prioridad', ''), clean(r.get('Título', '')), r['_us'], r.get('Criterio', ''),
                'Sí' if r.get('Tipo') == 'Positivo' else 'No', r.get('Tipo', ''), r.get('Técnica', ''),
                r.get('Canal', ''), r.get('Automatizable', '')]
        for j, v in enumerate(vals, 1):
            c = idx.cell(row=i, column=j, value=v)
            c.border, c.alignment = BOX, WRAP
        if r['ID'] in sheets_for:
            idx.cell(row=i, column=1).hyperlink = f"#'{sheets_for[r['ID']]}'!A1"
    for col, w in zip('ABCDEFGHIJ', (14, 10, 70, 10, 14, 12, 12, 24, 10, 13)):
        idx.column_dimensions[col].width = w
    idx.freeze_panes = 'A3'
    idx.auto_filter.ref = f'A2:J{len(allrows) + 2}'
    wb.save(OUT)
    print(f'{len(allrows)} casos, {len(wb.sheetnames) - 1} hojas -> {OUT.name}')


if __name__ == '__main__':
    sys.exit(main())
