"""Genera entrega-3/Biyu-Planilla-Unica.xlsx: un único Excel con todo el trabajo de testing del proyecto.

Pedido del profesor (devolución de la Entrega 2): «un excel donde los IDs de casos, stories y defectos sean
links a las hojas donde están especificados, así no tienen un montón de planillas».

Hojas: Inicio · Casos (un caso por fila, con su resultado en cada entrega) · Pasos (pre-requisitos, pasos y resultado
esperado) · Historias · Defectos · Resultados (con gráfico) · Cambios de estado. Los IDs de caso, de historia y de
defecto son hipervínculos internos a la hoja donde está su especificación, y de vuelta.

Fuentes (ya generadas): las planillas de entrega-1/, entrega-2/ y entrega-3/, los reportes de defectos en markdown,
los issues de GitHub (historias y estado de los defectos) y docs/adr/.

Uso (desde la raíz del repo, con `gh` autenticado):  python entrega-3/fuentes/generar_planilla_unica.py
"""
import json
import re
import subprocess
from collections import Counter, OrderedDict, defaultdict
from pathlib import Path

import openpyxl
from openpyxl import Workbook
from openpyxl.chart import BarChart, Reference
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.hyperlink import Hyperlink

RAIZ = Path(__file__).resolve().parents[2]
SALIDA = RAIZ / 'entrega-3' / 'Biyu-Planilla-Unica.xlsx'
REPO = 'https://github.com/Joaconz/Biyu'

ID_CASO = re.compile(r'CP-[A-Z]{3}-\d{3}')
VERDE, CREMA, GRIS = 'FF1B4D3E', 'FFF1EBE0', 'FFEDEDED'
COLOR_ESTADO = {'PASSED': 'FFC6E0B4', 'FAILED': 'FFF4B6B6', 'BLOCKED': 'FFD9D9D9', 'DUDA': 'FFFFE699'}
LINK = Font(color='FF0563C1', underline='single')
# Defectos que eran errores del caso, no de la app (entrega-3/04-ejecucion.md, «Confirmación de defectos»).
ERRORES_DEL_CASO = {'DEF-035', 'DEF-036'}
FILA_CAB = 4  # las tablas empiezan en la fila 4; la 1 es el título y la 2 la navegación


def limpiar(v):
    return '' if v is None else str(v).replace('\r', '').strip()


# --------------------------------------------------------------------------------------------- casos
def leer_casos():
    """Lee los tres catálogos (V1, V2, V3): índice + una hoja por caso (o por sección con varios casos)."""
    fuentes = [('V1', 'entrega-1/02-especificacion-casos-de-prueba.xlsx'),
               ('V2', 'entrega-2/02-especificacion-casos-v2.xlsx'),
               ('V3', 'entrega-3/01-especificacion-casos-v3.xlsx')]
    casos, secciones = OrderedDict(), []
    for ver, ruta in fuentes:
        wb = openpyxl.load_workbook(RAIZ / ruta)
        ws = wb['Índice']
        cab = [limpiar(c.value) for c in ws[2]]
        for fila in ws.iter_rows(min_row=3, values_only=True):
            d = dict(zip(cab, [limpiar(x) for x in fila]))
            cid = d.get('Test case ID', '')
            if not ID_CASO.fullmatch(cid):
                continue
            assert cid not in casos, cid
            casos[cid] = dict(id=cid, version=ver, modulo=cid.split('-')[1], titulo=d.get('Título', ''),
                              historia=d.get('User story', ''), prioridad=d.get('Prioridad', ''),
                              camino=d.get('Camino feliz', ''), tipo=d.get('Tipo', ''), tecnica=d.get('Técnica', ''),
                              canal=d.get('Canal', ''), seccion=None)
        for nombre in wb.sheetnames[1:]:
            sec = parsear_hoja_caso(wb[nombre], ver)
            if not sec['ids']:
                continue
            sec['nombre'] = nombre
            secciones.append(sec)
            for cid in sec['ids']:
                if cid in casos and casos[cid]['seccion'] is None:
                    casos[cid]['seccion'] = len(secciones) - 1
    return casos, secciones


def parsear_hoja_caso(ws, ver):
    filas = [[limpiar(c.value) for c in r] for r in ws.iter_rows(max_col=6)]
    ids = ID_CASO.findall(filas[0][1]) if filas and len(filas[0]) > 1 else []
    pre, datos, oraculo, convenciones, pasos, en_pasos = '', '', '', '', [], False
    for i, f in enumerate(filas):
        a = f[0] if f else ''
        if a == 'S #' and len(f) > 3 and 'Pre-requisitos' in f[1]:
            # Pre-requisitos (B) y datos de prueba (D, y E en V2: «D 1:» | valor), una fila por ítem hasta el título.
            pres, dats = [], []
            for g in filas[i + 1:]:
                if g[0] in ('Título del CP', 'Historias de Usuario', 'Pasos #'):
                    break
                if g[1]:
                    pres.append(g[1])
                dato = ' '.join(x for x in (g[3], g[4]) if x)
                if dato:
                    dats.append(dato)
            pre, datos = '\n'.join(pres), '\n'.join(dats)
        elif a == 'Pre-requisitos, datos y pasos':
            pre = f[1]
        elif a in ('Oráculo', 'Oraculo'):
            oraculo = f[1]
        elif a == 'Convenciones':
            convenciones = f[1]
        elif not en_pasos and 'esperado' in f[3].lower():
            # Cabecera de una tabla de pasos: «Pasos # | Detalle | Resultado Esperado» (V1, V2) o, en V3,
            # «# | Paso», «ID | Llamada», «ID | Verificación»… con el resultado esperado en D. Puede haber varias.
            en_pasos = True
            continue
        elif en_pasos:
            if not a and not f[1]:
                en_pasos = False
                continue
            # B:C están combinadas en las tres planillas: el resultado esperado está en D (en C solo si D está vacía).
            pasos.append((a, f[1], f[3] or f[2]))
    if not pasos and pre:
        # Caso de V3 escrito en un solo párrafo: el párrafo son los pasos.
        pasos, pre = [('1', pre, 'Lo indica el mismo párrafo.')], ''
    if not pre and convenciones:
        # Secciones de V3 que siguen a la anterior y no repiten los pre-requisitos: valen las convenciones de la ficha.
        pre = f'No repite pre-requisitos: valen las convenciones de la ficha y el caso que cite el paso. {convenciones}'
    return dict(ids=ids, pre=pre, datos=datos, oraculo=oraculo, pasos=pasos)


def leer_resultados(casos):
    """Resultado de cada caso en cada entrega."""
    res = defaultdict(dict)
    wb = openpyxl.load_workbook(RAIZ / 'entrega-1/03-ejecucion-casos-de-prueba.xlsx')
    ws = wb['Índice']
    cab = [limpiar(c.value) for c in ws[2]]
    for fila in ws.iter_rows(min_row=3, values_only=True):
        d = dict(zip(cab, [limpiar(x) for x in fila]))
        if ID_CASO.fullmatch(d.get('Test case ID', '')):
            res[d['Test case ID']]['e1'] = d.get('Status', '')
            res[d['Test case ID']]['def'] = d.get('Defectos', '')
    wb = openpyxl.load_workbook(RAIZ / 'entrega-2/04-ejecucion.xlsx')
    ws = wb['Índice']
    cab = [limpiar(c.value) for c in ws[2]]
    for fila in ws.iter_rows(min_row=3, values_only=True):
        d = dict(zip(cab, [limpiar(x) for x in fila]))
        cid = d.get('Test case ID', '')
        if ID_CASO.fullmatch(cid) and 'e2' not in res[cid]:
            res[cid]['e2'] = d.get('Status', '')
            if d.get('Defectos') and not res[cid].get('def'):
                res[cid]['def'] = d['Defectos']
            res[cid]['regresion_e2'] = d.get('Test regresivo', '')
    wb = openpyxl.load_workbook(RAIZ / 'entrega-3/08-ejecucion-manual.xlsx')
    ws = wb['Índice']
    for fila in ws.iter_rows(min_row=2, values_only=True):
        cid = limpiar(fila[0])
        if ID_CASO.fullmatch(cid):
            res[cid]['e3_man'] = limpiar(fila[5])
            res[cid]['e3_auto'] = limpiar(fila[6])
            res[cid]['origen_e3'] = limpiar(fila[1])
            if limpiar(fila[8]):
                res[cid]['def'] = limpiar(fila[8])
    return res


# ------------------------------------------------------------------------------------------ historias
def leer_issues():
    ruta = RAIZ / 'entrega-3' / 'fuentes' / '.issues.json'
    out = subprocess.run(['gh', 'issue', 'list', '--state', 'all', '--limit', '700', '--json',
                          'number,title,state,body,url,milestone,closedAt,labels'],
                         capture_output=True, text=True, encoding='utf-8', check=True, cwd=RAIZ).stdout
    return json.loads(out)


def leer_historias(issues, casos, defectos):
    h = OrderedDict()
    v3 = titulos_v3()
    for i in issues:
        m = re.match(r'^(US-\d+)\s*[·:\-–]?\s*(.*)', i['title'])
        if m:
            titulo = m.group(2).strip()
            if v3.get(m.group(1)) and (i['milestone'] or {}).get('title') == 'V3':
                titulo = v3[m.group(1)]  # el issue de US-83 y US-101 conserva el título anterior a ADR-053
            h[m.group(1)] = dict(id=m.group(1), titulo=titulo, issue=i['number'], url=i['url'],
                                 estado='Cerrado' if i['state'] == 'CLOSED' else 'Abierto',
                                 version=(i['milestone'] or {}).get('title', ''), cuerpo=limpiar(i['body']), tipo='Historia')
    for p in sorted((RAIZ / 'docs' / 'adr').glob('*.md')):
        m = re.match(r'(\d+)-', p.name)
        if not m:
            continue
        aid = f'ADR-{int(m.group(1)):03d}'
        titulo = limpiar(p.read_text(encoding='utf-8').splitlines()[0]).lstrip('# ').split('—', 1)[-1].strip()
        if aid not in h:
            h[aid] = dict(id=aid, titulo=titulo, issue='', url=f'{REPO}/blob/main/docs/adr/{p.name}', estado='Aceptada',
                          version='', cuerpo='', tipo='Decisión (ADR)')
    # historias que aparecen en casos o defectos y no tienen issue propio
    for tok in {t for c in casos.values() for t in tokens_historia(c['historia'])} | \
               {t for d in defectos.values() for t in tokens_historia(d['historia'])}:
        if tok not in h:
            h[tok] = dict(id=tok, titulo='(sin issue propio)', issue='', url='', estado='', version='', cuerpo='', tipo='Historia')
    return OrderedDict(sorted(h.items(), key=lambda kv: (kv[1]['tipo'] != 'Historia', int(re.search(r'\d+', kv[0]).group()))))


def tokens_historia(texto):
    return re.findall(r'(?:US|ADR)-\d+', texto or '')


# --------------------------------------------------------------------------------------------- defectos
def leer_defectos(issues):
    estado_issue = {}
    for i in issues:
        m = re.match(r'^(DEF-\d+)', i['title'])
        if m:
            estado_issue[m.group(1)] = i
    confirm_v3 = set()
    txt = (RAIZ / 'entrega-3' / '04-ejecucion.md').read_text(encoding='utf-8')
    if '## Confirmación de defectos' in txt:
        sec = txt.split('## Confirmación de defectos', 1)[1].split('\n## ', 1)[0]
        confirm_v3 = set(re.findall(r'\| (DEF-\d+) \|', sec))
    # Testeo de confirmación de los defectos de V1 sobre V2 (entrega-2/04-ejecucion.md): DEF → resultado.
    confirm_e2 = {}
    txt2 = (RAIZ / 'entrega-2' / '04-ejecucion.md').read_text(encoding='utf-8')
    for linea in txt2.splitlines():
        celdas = [c.strip() for c in linea.strip().strip('|').split('|')]
        if len(celdas) == 7 and re.fullmatch(r'DEF-\d+', celdas[0]) and celdas[5].startswith('**'):
            confirm_e2[celdas[0]] = celdas[5].replace('**', '')
    defectos = OrderedDict()
    for ver, ruta in (('V1', 'entrega-1/04-reportes-de-defectos.md'), ('V2', 'entrega-2/05-reportes-de-defectos.md')):
        texto = (RAIZ / ruta).read_text(encoding='utf-8')
        partes = re.split(r'^## (?=DEF-\d+)', texto, flags=re.M)[1:]
        for p in partes:
            titulo_linea, _, resto = p.partition('\n')
            m = re.match(r'(DEF-\d+)\s*[·\-—]\s*(.*)', titulo_linea)
            if not m:
                continue
            did = m.group(1)
            campos = dict(re.findall(r'^\| ([^|]+?) \| (.*?) \|$', resto, flags=re.M))
            pasos = re.search(r'\*\*Pasos para reproducir\*\*\s*\n(.*?)(?=\n\*\*Resultado esperado)', resto, flags=re.S)
            esperado = re.search(r'\*\*Resultado esperado\.\*\*\s*(.*?)(?=\n\n\*\*Resultado obtenido)', resto, flags=re.S)
            obtenido = re.search(r'\*\*Resultado obtenido\.\*\*\s*(.*?)(?=\n\n\*\*|\Z)', resto, flags=re.S)
            iss = estado_issue.get(did)
            defectos[did] = dict(
                id=did, titulo=m.group(2).strip(), version=ver, severidad=limpiar(campos.get('Severidad')),
                caso=limpiar(campos.get('Caso de prueba')), historia=limpiar(campos.get('Historia')),
                encontrado=limpiar(campos.get('Encontrado en')), entorno=limpiar(campos.get('Entorno')),
                estado_reporte=limpiar(campos.get('Estado')), pasos=limpiar(pasos.group(1)) if pasos else '',
                esperado=limpiar(esperado.group(1)) if esperado else '', obtenido=limpiar(obtenido.group(1)) if obtenido else '',
                issue=iss['number'] if iss else '', url=iss['url'] if iss else '',
                estado='Cerrado' if iss and iss['state'] == 'CLOSED' else 'Abierto',
                cerrado=(iss['closedAt'][:10] if iss and iss.get('closedAt') else ''),
                confirmacion=confirmacion(did, limpiar(campos.get('Estado')), confirm_v3, confirm_e2))
    return defectos


def confirmacion(did, estado_reporte, confirm_v3, confirm_e2):
    """Dónde y cómo se confirmó la corrección de cada defecto (testeo de confirmación de cada entrega)."""
    e2 = confirm_e2.get(did, '')
    if did in confirm_v3:
        return 'Confirmado en V3 (Entrega 3)' + (f'; en la Entrega 2 había sido {e2.lower()}' if e2 and e2 != 'Confirmado' else '')
    if e2 == 'Confirmado':
        return 'Confirmado en V2 (Entrega 2)'
    if e2 == 'Confirmado parcial':
        return 'Confirmado en parte en V2 (Entrega 2), con la condición simulada; no se repitió en V3'
    if e2:
        return f'{e2} en V2 (Entrega 2)'
    if 'no se reproduce' in estado_reporte.lower():
        return 'No se reproduce en V1 (re-test de la Entrega 1)'
    if 'confirmado' in estado_reporte.lower() or 're-test' in estado_reporte.lower() or 'verificado' in estado_reporte.lower():
        return 'Confirmado en V1 (re-test de la Entrega 1)'
    return ''


def por_que(cid, e1, e2, e3a, defecto):
    """Explicación de un cambio de estado entre entregas."""
    if defecto:
        arreglo = 'V2 (Entrega 2)' if e2 == 'PASSED' and e1 == 'FAILED' else 'V3 (Entrega 3)'
        if defecto['id'] in ERRORES_DEL_CASO:
            return f"Falló por {defecto['id']} ({defecto['titulo']}). Era un error del caso: se corrigió el caso y pasó en {arreglo}."
        return f"Falló por {defecto['id']} ({defecto['titulo']}). Se corrigió la app y el caso pasó en {arreglo}."
    if e2 == 'BLOCKED':
        return ('En la Entrega 2 no se podía ejecutar: faltaba US-82 (gasto compartido con varias personas, #270). '
                'US-82 se implementó en V3 y el caso pasó.')
    if e2 == 'DUDA':
        return ('En la Entrega 2 se cumplía con una sola persona, porque US-82 no existía, y quedó sin resultado firme. '
                'Con US-82 implementada en V3 el caso pasó tal como está escrito.')
    return ''


def titulos_v3():
    """Títulos de las historias de V3 según 00-historias-de-usuario-v3.md, que sigue a ADR-053 (gasto neto)."""
    texto = (RAIZ / 'entrega-3' / '00-historias-de-usuario-v3.md').read_text(encoding='utf-8')
    return {m.group(1): m.group(2).strip() for m in re.finditer(r'^### (US-\d+) · (.+)$', texto, flags=re.M)
            if '(CA-' not in m.group(2)}


# ------------------------------------------------------------------------------------------- escritura
class Libro:
    def __init__(self):
        self.wb = Workbook()
        self.wb.remove(self.wb.active)
        self.hojas = {}

    def hoja(self, nombre, titulo, anchos):
        ws = self.wb.create_sheet(nombre)
        self.hojas[nombre] = ws
        ws['A1'] = titulo
        ws['A1'].font = Font(bold=True, size=14, color=VERDE)
        for i, w in enumerate(anchos, 1):
            ws.column_dimensions[get_column_letter(i)].width = w
        return ws

    def navegacion(self):
        for nombre, ws in self.hojas.items():
            col = 1
            for destino in ['Inicio', 'Casos', 'Pasos', 'Historias', 'Defectos', 'Resultados', 'Cambios de estado']:
                c = ws.cell(2, col, ('← ' if destino == 'Inicio' else '') + destino)
                if destino == nombre:
                    c.font = Font(bold=True)
                else:
                    enlace(c, destino, 'A1')
                col += 1


def enlace(celda, hoja, ref, texto=None):
    if texto is not None:
        celda.value = texto
    celda.hyperlink = Hyperlink(ref=celda.coordinate, location=f"'{hoja}'!{ref}", display=str(celda.value))
    celda.font = LINK


def enlace_url(celda, url, texto=None):
    if texto is not None:
        celda.value = texto
    if url:
        celda.hyperlink = url
        celda.font = LINK


def cabecera(ws, fila, titulos):
    for i, t in enumerate(titulos, 1):
        c = ws.cell(fila, i, t)
        c.font = Font(bold=True, color='FFFFFFFF')
        c.fill = PatternFill('solid', fgColor=VERDE)
        c.alignment = Alignment(wrap_text=True, vertical='center')
    ws.freeze_panes = ws.cell(fila + 1, 2)


def pintar_estado(c):
    v = str(c.value or '')
    if v in COLOR_ESTADO:
        c.fill = PatternFill('solid', fgColor=COLOR_ESTADO[v])


def ajustar(ws, desde, columnas_largas):
    for fila in ws.iter_rows(min_row=desde):
        for c in fila:
            c.alignment = Alignment(wrap_text=c.column in columnas_largas, vertical='top')


def main():
    casos, secciones = leer_casos()
    res = leer_resultados(casos)
    issues = leer_issues()
    defectos = leer_defectos(issues)
    historias = leer_historias(issues, casos, defectos)
    assert len(casos) == 74 + 212 + 184, len(casos)

    # índices de filas destino
    fila_caso = {cid: FILA_CAB + 1 + i for i, cid in enumerate(casos)}
    fila_hist = {hid: FILA_CAB + 1 + i for i, hid in enumerate(historias)}
    fila_def = {did: FILA_CAB + 1 + i for i, did in enumerate(defectos)}
    casos_de_hist, casos_de_def = defaultdict(list), defaultdict(list)
    for cid, c in casos.items():
        for t in tokens_historia(c['historia']):
            casos_de_hist[t].append(cid)
    defs_de_caso = defaultdict(list)
    for did, d in defectos.items():
        for cid in ID_CASO.findall(d['caso']):
            defs_de_caso[cid].append(did)
            casos_de_def[did].append(cid)
    for cid, r in res.items():  # defectos que figuran en la ejecución y no en el reporte
        for did in re.findall(r'DEF-\d+', r.get('def', '')):
            if did in defectos and did not in defs_de_caso[cid]:
                defs_de_caso[cid].append(did)
                casos_de_def[did].append(cid)
    defs_de_hist = defaultdict(list)
    for did, d in defectos.items():
        for t in tokens_historia(d['historia']):
            defs_de_hist[t].append(did)

    # pasos: una fila por paso, agrupados por sección
    fila_pasos_seccion, fila = {}, FILA_CAB + 1
    for i, s in enumerate(secciones):
        fila_pasos_seccion[i] = fila
        fila += max(1, len(s['pasos']))

    L = Libro()
    # ------------------------------------------------------------------ Inicio
    ini = L.hoja('Inicio', 'Biyu · Planilla única de testing (Entregas 1, 2 y 3)', [34, 18, 70])
    # ------------------------------------------------------------------ Casos
    cs = L.hoja('Casos', 'Casos de prueba (V1, V2 y V3): un caso por fila', [14, 8, 8, 62, 16, 10, 9, 11, 22, 10, 11, 11, 13, 13, 13, 16, 22])
    cab_casos = ['ID del caso', 'Versión', 'Módulo', 'Título', 'Historia', 'Prioridad', 'Camino feliz', 'Tipo', 'Técnica',
                 'En la regresión de V3', 'Entrega 1', 'Entrega 2', 'Entrega 3 manual', 'Entrega 3 automatizada', 'Defecto',
                 'Cambió de estado', 'Otras historias']
    cabecera(cs, FILA_CAB, cab_casos)
    cambios = []
    for cid, c in casos.items():
        r, f = res.get(cid, {}), fila_caso[cid]
        e1, e2, e3a, e3m = r.get('e1', ''), r.get('e2', ''), r.get('e3_auto', ''), r.get('e3_man', '')
        seq = [x for x in (e1, e2, e3a) if x]
        cambio = ''
        if any(a != b for a, b in zip(seq, seq[1:])):
            cambio = ' → '.join(f'E{n}: {v}' for n, v in (('1', e1), ('2', e2), ('3', e3a)) if v)
            cambios.append((cid, c, e1, e2, e3a))
        toks = tokens_historia(c['historia'])
        valores = [cid, c['version'], c['modulo'], c['titulo'], toks[0] if toks else c['historia'], c['prioridad'], c['camino'],
                   c['tipo'], c['tecnica'], 'Sí' if r.get('origen_e3', '').startswith('Regresi') else ('Caso nuevo' if c['version'] == 'V3' else 'No'),
                   e1, e2, e3m, e3a, '', cambio, ', '.join(toks[1:])]
        for col, v in enumerate(valores, 1):
            cs.cell(f, col, v)
        if c['seccion'] is not None:
            enlace(cs.cell(f, 1), 'Pasos', f"A{fila_pasos_seccion[c['seccion']]}")
        if toks and toks[0] in fila_hist:
            enlace(cs.cell(f, 5), 'Historias', f'A{fila_hist[toks[0]]}')
        ds = defs_de_caso.get(cid, [])
        if ds and ds[0] in fila_def:
            enlace(cs.cell(f, 15), 'Defectos', f'A{fila_def[ds[0]]}', ', '.join(ds) if len(ds) == 1 else ds[0])
            if len(ds) > 1:
                cs.cell(f, 17).value = ((cs.cell(f, 17).value + ' · ') if cs.cell(f, 17).value else '') + 'otros defectos: ' + ', '.join(ds[1:])
        for col in (11, 12, 13, 14):
            pintar_estado(cs.cell(f, col))
    cs.auto_filter.ref = f'A{FILA_CAB}:{get_column_letter(len(cab_casos))}{FILA_CAB + len(casos)}'
    ajustar(cs, FILA_CAB + 1, {4})

    # ------------------------------------------------------------------ Pasos
    ps = L.hoja('Pasos', 'Pre-requisitos, pasos y resultado esperado de cada caso', [16, 44, 7, 52, 64, 40])
    cabecera(ps, FILA_CAB, ['Casos que cubre', 'Pre-requisitos y datos', 'Paso', 'Qué hacer', 'Resultado esperado', 'Oráculo'])
    fila = FILA_CAB + 1
    for i, s in enumerate(secciones):
        pasos = s['pasos'] or [('', '', '')]
        for k, (n, hacer, esperado) in enumerate(pasos):
            ps.cell(fila, 3, n); ps.cell(fila, 4, hacer); ps.cell(fila, 5, esperado)
            if k == 0:
                ps.cell(fila, 2, '\n'.join(x for x in (s['pre'], ('Datos: ' + s['datos']) if s['datos'] else '') if x))
                ps.cell(fila, 6, s['oraculo'])
                primero = s['ids'][0]
                ps.cell(fila, 1, ', '.join(s['ids']))
                if primero in fila_caso:
                    enlace(ps.cell(fila, 1), 'Casos', f'A{fila_caso[primero]}')
            fila += 1
    ajustar(ps, FILA_CAB + 1, {2, 4, 5, 6})

    # ------------------------------------------------------------------ Historias
    hs = L.hoja('Historias', 'Historias de usuario y decisiones (ADR)', [10, 56, 15, 10, 12, 9, 14, 11, 90])
    cabecera(hs, FILA_CAB, ['ID', 'Título', 'Tipo', 'Versión', 'Issue / ADR', 'Casos', 'Primer caso', 'Defectos', 'Especificación (cuerpo del issue)'])
    for hid, h in historias.items():
        f = fila_hist[hid]
        hs.cell(f, 1, hid); hs.cell(f, 2, h['titulo']); hs.cell(f, 3, h['tipo']); hs.cell(f, 4, h['version'])
        enlace_url(hs.cell(f, 5), h['url'], f"#{h['issue']}" if h['issue'] else ('ADR' if h['tipo'].startswith('Decisión') else ''))
        cc = casos_de_hist.get(hid, [])
        hs.cell(f, 6, len(cc))
        if cc:
            enlace(hs.cell(f, 7), 'Casos', f'A{fila_caso[cc[0]]}', cc[0])
        dd = defs_de_hist.get(hid, [])
        if dd:
            enlace(hs.cell(f, 8), 'Defectos', f'A{fila_def[dd[0]]}', ', '.join(dd) if len(dd) == 1 else f'{dd[0]} (+{len(dd) - 1})')
        hs.cell(f, 9, h['cuerpo'][:30000])
    hs.auto_filter.ref = f'A{FILA_CAB}:I{FILA_CAB + len(historias)}'
    ajustar(hs, FILA_CAB + 1, {2, 9})

    # ------------------------------------------------------------------ Defectos
    ds_ = L.hoja('Defectos', 'Defectos (V1 y V2): reporte, estado y confirmación', [10, 52, 8, 10, 12, 14, 9, 14, 14, 11, 16, 60, 52, 52, 34])
    cabecera(ds_, FILA_CAB, ['ID', 'Título', 'Versión', 'Severidad', 'Estado actual', 'Cerrado el', 'Issue', 'Caso que lo detectó', 'Historia',
                             'Confirmación', 'Encontrado en', 'Pasos para reproducir', 'Resultado esperado', 'Resultado obtenido', 'Entorno'])
    for did, d in defectos.items():
        f = fila_def[did]
        vals = [did, d['titulo'], d['version'], d['severidad'], d['estado'], d['cerrado'], '', '', '', d['confirmacion'], d['encontrado'],
                d['pasos'], d['esperado'], d['obtenido'], d['entorno']]
        for col, v in enumerate(vals, 1):
            ds_.cell(f, col, v)
        enlace_url(ds_.cell(f, 7), d['url'], f"#{d['issue']}" if d['issue'] else '')
        cc = casos_de_def.get(did, [])
        if cc and cc[0] in fila_caso:
            enlace(ds_.cell(f, 8), 'Casos', f'A{fila_caso[cc[0]]}', ', '.join(cc) if len(cc) == 1 else f'{cc[0]} (+{len(cc) - 1})')
        else:
            ds_.cell(f, 8, d['caso'])
        toks = tokens_historia(d['historia'])
        if toks and toks[0] in fila_hist:
            enlace(ds_.cell(f, 9), 'Historias', f'A{fila_hist[toks[0]]}', toks[0])
        else:
            ds_.cell(f, 9, d['historia'][:60])
    ds_.auto_filter.ref = f'A{FILA_CAB}:O{FILA_CAB + len(defectos)}'
    ajustar(ds_, FILA_CAB + 1, {2, 10, 11, 12, 13, 14, 15})

    # ------------------------------------------------------------------ Resultados
    rs = L.hoja('Resultados', 'Resultados por entrega', [38, 10, 10, 10, 10, 10, 11])
    cabecera(rs, FILA_CAB, ['Ejecución', 'Casos', 'PASSED', 'FAILED', 'DUDA', 'BLOCKED', '% PASSED'])
    corridas = [('Entrega 1 · ejecución 1 (V1)', 74, 67, 3, 0, 4), ('Entrega 1 · ejecución 2 (V1, re-test)', 74, 72, 2, 0, 0),
                ('Entrega 2 · casos de V2', 203, 189, 9, 1, 4), ('Entrega 2 · regresión de V1', 60, 60, 0, 0, 0)]
    c3 = Counter(r.get('e3_auto') for r in res.values() if r.get('e3_auto'))
    m3 = Counter(r.get('e3_man') for r in res.values() if r.get('e3_man'))
    nuevos = [r for cid, r in res.items() if casos[cid]['version'] == 'V3' and r.get('e3_auto')]
    reg3 = [r for cid, r in res.items() if casos[cid]['version'] != 'V3' and r.get('e3_auto')]
    cuenta = lambda rows, k, e: sum(1 for r in rows if r.get(k) == e)
    corridas += [('Entrega 3 · casos nuevos de V3, automatizados', len(nuevos), cuenta(nuevos, 'e3_auto', 'PASSED'), cuenta(nuevos, 'e3_auto', 'FAILED'), 0, cuenta(nuevos, 'e3_auto', 'BLOCKED')),
                 ('Entrega 3 · regresión de V1 y V2, automatizada', len(reg3), cuenta(reg3, 'e3_auto', 'PASSED'), cuenta(reg3, 'e3_auto', 'FAILED'), 0, cuenta(reg3, 'e3_auto', 'BLOCKED')),
                 ('Entrega 3 · ejecución manual (361 casos)', sum(m3.values()), m3.get('PASSED', 0), m3.get('FAILED', 0), 0, m3.get('BLOCKED', 0))]
    for k, (nombre, n, p, f_, d, b) in enumerate(corridas):
        fila = FILA_CAB + 1 + k
        for col, v in enumerate([nombre, n, p, f_, d, b], 1):
            rs.cell(fila, col, v)
        rs.cell(fila, 7, f'=C{fila}/B{fila}').number_format = '0.0%'
    fin = FILA_CAB + len(corridas)
    graf = BarChart()
    graf.type, graf.grouping, graf.overlap = 'bar', 'percentStacked', 100
    graf.title = 'Resultados por ejecución (% de casos)'
    graf.add_data(Reference(rs, min_col=3, max_col=6, min_row=FILA_CAB, max_row=fin), titles_from_data=True)
    graf.set_categories(Reference(rs, min_col=1, min_row=FILA_CAB + 1, max_row=fin))
    for serie, color in zip(graf.series, ('2E7D5B', 'C0392B', 'D4AF37', '8C8C8C')):
        serie.graphicalProperties.solidFill = color
    graf.height, graf.width = 9, 22
    rs.add_chart(graf, f'A{fin + 3}')
    fila = fin + 23
    rs.cell(fila, 1, 'Entrega 3 por módulo (casos nuevos + regresión, ejecución manual)').font = Font(bold=True)
    for col, t in enumerate(['Módulo', 'Casos', 'PASSED', 'FAILED', 'BLOCKED'], 1):
        c = rs.cell(fila + 1, col, t); c.font = Font(bold=True, color='FFFFFFFF'); c.fill = PatternFill('solid', fgColor=VERDE)
    por_mod = defaultdict(Counter)
    for cid, r in res.items():
        if r.get('e3_man'):
            por_mod[casos[cid]['modulo']][r['e3_man']] += 1
    for k, (mod, c) in enumerate(sorted(por_mod.items())):
        for col, v in enumerate([mod, sum(c.values()), c.get('PASSED', 0), c.get('FAILED', 0), c.get('BLOCKED', 0)], 1):
            rs.cell(fila + 2 + k, col, v)

    # ------------------------------------------------------------------ Cambios de estado
    cb = L.hoja('Cambios de estado', 'Casos que cambiaron de estado entre entregas', [14, 8, 62, 12, 12, 14, 12, 60])
    cabecera(cb, FILA_CAB, ['ID del caso', 'Versión', 'Título', 'Entrega 1', 'Entrega 2', 'Entrega 3 (automatizada)', 'Defecto', 'Por qué'])
    motivo = {}
    for did, d in defectos.items():
        for cid in casos_de_def.get(did, []):
            motivo[cid] = did
    for k, (cid, c, e1, e2, e3a) in enumerate(cambios):
        f = FILA_CAB + 1 + k
        for col, v in enumerate([cid, c['version'], c['titulo'], e1, e2, e3a], 1):
            cb.cell(f, col, v)
        enlace(cb.cell(f, 1), 'Casos', f'A{fila_caso[cid]}')
        did = motivo.get(cid)
        if did and did in fila_def:
            enlace(cb.cell(f, 7), 'Defectos', f'A{fila_def[did]}', did)
        cb.cell(f, 8, por_que(cid, e1, e2, e3a, defectos.get(did) if did else None))
        for col in (4, 5, 6):
            pintar_estado(cb.cell(f, col))
    cb.auto_filter.ref = f'A{FILA_CAB}:H{FILA_CAB + len(cambios)}'
    ajustar(cb, FILA_CAB + 1, {3, 8})

    # ------------------------------------------------------------------ Inicio (se completa al final)
    ini['A3'] = 'Todo el trabajo de testing del proyecto en un solo archivo. Los IDs de casos, historias y defectos son links: tocá uno y vas a la hoja donde está especificado; cada hoja tiene un link de vuelta.'
    ini['A3'].alignment = Alignment(wrap_text=True, vertical='top')
    ini.merge_cells('A3:C3'); ini.row_dimensions[3].height = 34
    cabecera(ini, FILA_CAB, ['Hoja', 'Filas', 'Qué tiene'])
    ini.freeze_panes = None
    indice = [('Casos', len(casos), 'Los 470 casos (74 de V1, 212 de V2 y 184 de V3), con prioridad, técnica, tipo y su resultado en cada entrega. El ID lleva a sus pasos; la historia, a su especificación; el defecto, a su reporte.'),
              ('Pasos', sum(max(1, len(s['pasos'])) for s in secciones), 'Pre-requisitos, datos, pasos y resultado esperado de cada caso. El ID de la izquierda vuelve al caso.'),
              ('Historias', len(historias), 'Historias de usuario (US-nn) con su issue y su especificación, y las decisiones de diseño (ADR). Muestra cuántos casos y defectos tiene cada una.'),
              ('Defectos', len(defectos), 'Los 36 defectos de V1 y V2: pasos para reproducir, esperado, obtenido, severidad, estado actual y en qué entrega se confirmó la corrección.'),
              ('Resultados', len(corridas), 'PASSED, FAILED, DUDA y BLOCKED de cada ejecución de las tres entregas, con gráfico y el resumen por módulo de V3.'),
              ('Cambios de estado', len(cambios), 'Los casos que cambiaron de estado entre entregas, con el defecto o el motivo que lo explica.')]
    for k, (hoja, n, que) in enumerate(indice):
        f = FILA_CAB + 1 + k
        enlace(ini.cell(f, 1), hoja, 'A1', hoja)
        ini.cell(f, 2, n); ini.cell(f, 3, que).alignment = Alignment(wrap_text=True, vertical='top')
    f = FILA_CAB + len(indice) + 3
    ini.cell(f, 1, 'Resumen de la Entrega 3').font = Font(bold=True)
    resumen = [('Casos ejecutados', f"{sum(m3.values())} de {sum(m3.values())} en PASSED (manual) y {sum(c3.values())} de {sum(c3.values())} (automatizada)"),
               ('Defectos', f"{len(defectos)}, ninguno abierto; 9 confirmados corregidos en V3"),
               ('Casos que cambiaron de estado', f"{len(cambios)} (ver hoja «Cambios de estado»)"),
               ('Documentos de las entregas', 'entrega-1/, entrega-2/ y entrega-3/ del repositorio (este archivo los resume y los enlaza entre sí)')]
    for k, (a, b) in enumerate(resumen):
        ini.cell(f + 1 + k, 1, a); ini.cell(f + 1 + k, 3, b)
    ini.cell(f + 7, 1, 'Cómo se genera').font = Font(bold=True)
    ini.cell(f + 8, 1, 'python entrega-3/fuentes/generar_planilla_unica.py (lee las planillas, los reportes y los issues de GitHub).')

    L.navegacion()
    L.wb.save(SALIDA)
    print(f'{len(casos)} casos · {len(secciones)} secciones · {len(historias)} historias · {len(defectos)} defectos · {len(cambios)} cambios')


if __name__ == '__main__':
    main()
