"""Genera entrega-3/08-ejecucion-manual.md y 08-ejecucion-manual.xlsx: la ejecución manual del equipo.

El equipo ejecutó a mano los 361 casos (184 nuevos de V3 y 177 de regresión de V1 y V2) en el deploy de
Vercel y informó que todos dieron PASSED, igual que la suite automatizada. El repositorio no guarda los pasos
ejecutados ni capturas por caso: este registro es el resultado informado por el equipo, cruzado con el
resultado automatizado de entrega-3/04-ejecucion.md (que se genera con generar_ejecucion.py).

Uso (desde la raíz del repo): python entrega-3/fuentes/generar_ejecucion_manual.py
Necesita openpyxl y que 04-ejecucion.md esté generado.
"""
import re
from collections import Counter, OrderedDict
from pathlib import Path

from openpyxl import Workbook, load_workbook
from openpyxl.styles import Alignment, Font, PatternFill

RAIZ = Path(__file__).resolve().parents[2]
E3 = RAIZ / 'entrega-3'

FECHAS = '2026-11-14, 2026-11-15 y 2026-11-16'
ENTORNO = 'deploy de Vercel (https://biyu-rust.vercel.app), a mano, en el navegador'
# Resultado manual informado por el equipo para cada caso. Hoy no hay ninguno distinto de PASSED.
MANUAL_POR_DEFECTO = 'PASSED'
MANUAL_EXCEPCIONES = {}  # {'CP-XXX-000': ('FAILED', 'DEF-0nn', 'observación')}


def casos_automatizados():
    """Lee de 04-ejecucion.md los casos de V3 y de la regresión con su resultado automatizado."""
    v3, reg = OrderedDict(), OrderedDict()
    seccion = None
    for linea in (E3 / '04-ejecucion.md').read_text(encoding='utf-8').splitlines():
        if linea.startswith('## '):
            seccion = linea
            continue
        celdas = [c.strip() for c in linea.strip().strip('|').split('|')]
        if not celdas or not re.fullmatch(r'CP-[A-Z]+-\d{3}', celdas[0]):
            continue
        if seccion.startswith('## Resultado por caso de V3') and len(celdas) == 6:
            v3[celdas[0]] = dict(id=celdas[0], origen='V3', prioridad=celdas[1], titulo=celdas[2], historia=celdas[3],
                                 auto=celdas[4].strip('*'))
        elif seccion.startswith('## Resultado por caso de la regresión') and len(celdas) == 6:
            reg[celdas[0]] = dict(id=celdas[0], origen=celdas[1], prioridad=celdas[2], titulo=celdas[3],
                                  historia='', auto=celdas[5].strip('*'))
    return v3, reg


def historias_v1_v2():
    """Historia de cada caso de V1 y V2, del «Índice» de su catálogo (los casos de regresión no la traen)."""
    out = {}
    for ruta in ('entrega-1/02-especificacion-casos-de-prueba.xlsx', 'entrega-2/02-especificacion-casos-v2.xlsx'):
        ws = load_workbook(RAIZ / ruta, read_only=True)['Índice']
        filas = ws.iter_rows(min_row=2, values_only=True)
        cab = [str(c or '').strip() for c in next(filas)]
        i_id, i_us = cab.index('Test case ID'), cab.index('User story')
        for f in filas:
            if f[i_id] and f[i_us]:
                out[str(f[i_id]).strip()] = str(f[i_us]).strip()
    return out


def manual_de(cid):
    if cid in MANUAL_EXCEPCIONES:
        return MANUAL_EXCEPCIONES[cid][0]
    return MANUAL_POR_DEFECTO


def conteo(casos):
    c = Counter(manual_de(x['id']) for x in casos)
    return {e: c.get(e, 0) for e in ('PASSED', 'FAILED', 'BLOCKED')}


def pct(n, total):
    return f'{100 * n / total:.1f} %'.replace('.', ',')


def main():
    v3, reg = casos_automatizados()
    assert len(v3) == 184 and len(reg) == 177, (len(v3), len(reg))
    hist = historias_v1_v2()
    for x in reg.values():
        x['historia'] = hist.get(x['id'], '')
    sin_historia = [x['id'] for x in reg.values() if not x['historia']]
    assert not sin_historia, sin_historia
    todos = list(v3.values()) + list(reg.values())
    coinciden = sum(1 for x in todos if manual_de(x['id']) == x['auto'])
    cv3, creg, ctot = conteo(v3.values()), conteo(reg.values()), conteo(todos)
    modulos = sorted({x['id'].split('-')[1] for x in todos})

    # ------------------------------------------------------------------ xlsx
    verde = PatternFill('solid', fgColor='FFC6E0B4')
    cab = PatternFill('solid', fgColor='FF1B4D3E')
    wb = Workbook()
    ws = wb.active
    ws.title = 'Índice'
    ws.append(['ID', 'Origen', 'Prioridad', 'Título', 'Historia', 'Resultado manual', 'Resultado automatizado',
               '¿Coincide?', 'Defecto', 'Observaciones'])
    for c in ws[1]:
        c.font = Font(bold=True, color='FFFFFFFF')
        c.fill = cab
    for x in todos:
        m = manual_de(x['id'])
        defecto, obs = (MANUAL_EXCEPCIONES[x['id']][1:] if x['id'] in MANUAL_EXCEPCIONES else ('', ''))
        ws.append([x['id'], 'V3 (caso nuevo)' if x['origen'] == 'V3' else f'Regresión de {x["origen"]}', x['prioridad'],
                   x['titulo'], x['historia'], m, x['auto'], 'Sí' if m == x['auto'] else 'No', defecto, obs])
        ws.cell(ws.max_row, 6).fill = verde if m == 'PASSED' else PatternFill('solid', fgColor='FFF4B6B6')
    for col, w in zip('ABCDEFGHIJ', (13, 18, 10, 90, 10, 16, 20, 11, 10, 30)):
        ws.column_dimensions[col].width = w
    ws.freeze_panes = 'A2'
    rs = wb.create_sheet('Resumen')
    rs.append(['Conjunto', 'Casos', 'PASSED', 'FAILED', 'BLOCKED', '% PASSED'])
    for nombre, c in (('Casos nuevos de V3', cv3), ('Regresión de V1 y V2', creg), ('Total', ctot)):
        total = sum(c.values())
        rs.append([nombre, total, c['PASSED'], c['FAILED'], c['BLOCKED'], pct(c['PASSED'], total)])
    rs.append([])
    rs.append(['Módulo', 'Casos', 'PASSED', 'FAILED', 'BLOCKED'])
    for mod in modulos:
        c = conteo([x for x in todos if x['id'].split('-')[1] == mod])
        rs.append([mod, sum(c.values()), c['PASSED'], c['FAILED'], c['BLOCKED']])
    for fila in (1, 6):
        for c in rs[fila]:
            c.font = Font(bold=True)
    rs.column_dimensions['A'].width = 24
    wb.save(E3 / '08-ejecucion-manual.xlsx')

    # -------------------------------------------------------------------- md
    o = ['# Entrega 3 · Ejecución manual de los casos de prueba (V3) y de la regresión de V1 y V2', '',
         'Planilla: [`08-ejecucion-manual.xlsx`](08-ejecucion-manual.xlsx) (índice con el resultado manual y el automatizado '
         'de cada caso, y un resumen por módulo). Se genera con `python entrega-3/fuentes/generar_ejecucion_manual.py` '
         'a partir de [`04-ejecucion.md`](04-ejecucion.md). La ejecución automatizada está en '
         '[`04-ejecucion.md`](04-ejecucion.md) y [`05-reporte-ejecucion-automatizada.md`](05-reporte-ejecucion-automatizada.md); '
         'el resumen final, en [`07-reporte-final.md`](07-reporte-final.md).', '',
         '## Condiciones de la ejecución', '',
         f'- **Fechas:** {FECHAS}.',
         f'- **Entorno:** {ENTORNO}.',
         '- **Quién ejecutó:** el equipo, a mano. Es la ejecución manual que pide la Entrega 3 para los casos de V3, '
         'la regresión de V1 y V2 y el testeo de confirmación de los defectos.',
         '- **Alcance:** los 361 casos: los 184 casos nuevos de V3 (`entrega-3/casos/`) y los 177 de regresión '
         '([`03-seleccion-regresion.md`](03-seleccion-regresion.md)). Los casos que confirman los defectos de V2 '
         '(DEF-030 a DEF-037) y el DEF-023 de V1 están dentro de ese conjunto.',
         '- **Criterio:** PASSED si el resultado obtenido coincide con el esperado del caso; FAILED si no coincide '
         '(se abre un defecto `DEF-0nn`); BLOCKED si no se puede ejecutar.',
         '- **Versión probada:** la que estaba desplegada en Vercel esos días. Durante ese período se mergearon a '
         '`main` los PR [#422](https://github.com/Joaconz/Biyu/pull/422) a [#428](https://github.com/Joaconz/Biyu/pull/428), '
         'y **no se anotó el commit exacto desplegado en cada pasada**; el dato no se puede reconstruir desde el repositorio.',
         '- **Qué registra esta planilla:** el resultado por caso **informado por el equipo**. El repositorio no guarda '
         'los pasos ejecutados, las capturas ni quién ejecutó cada caso, así que no hay evidencia por caso más allá de '
         'este informe. Es la misma situación del repaso manual de la Entrega 2 (casos «informados como ok»).',
         '- **Cómo se compara con la suite automatizada:** la columna «Resultado automatizado» sale de '
         '`04-ejecucion.md` (corrida de 290 tests de Playwright, 1131 de Vitest y pgTAP sobre `main` en `40ab30e`). '
         'Un caso coincide si manual y automatizado dan el mismo estado.', '',
         '## Resultado', '',
         '| Conjunto | Casos | PASSED | FAILED | BLOCKED | % PASSED |', '|---|---|---|---|---|---|']
    for nombre, c in (('Casos nuevos de V3', cv3), ('Regresión de V1 y V2', creg), ('**Total**', ctot)):
        total = sum(c.values())
        o.append(f'| {nombre} | {total} | {c["PASSED"]} | {c["FAILED"]} | {c["BLOCKED"]} | {pct(c["PASSED"], total)} |')
    o += ['', f'**Manual y automatizado coinciden en {coinciden} de {len(todos)} casos.** '
          + ('No hay ningún caso FAILED ni BLOCKED en la ejecución manual, por lo que no se abrió ningún defecto nuevo.'
             if not MANUAL_EXCEPCIONES else f'Hay {len(MANUAL_EXCEPCIONES)} caso(s) con resultado distinto de PASSED (ver abajo).'),
          '', '### Por módulo', '',
          '| Módulo | Casos nuevos de V3 | Regresión | Total | PASSED | FAILED | BLOCKED |', '|---|---|---|---|---|---|---|']
    for mod in modulos:
        a = [x for x in v3.values() if x['id'].split('-')[1] == mod]
        b = [x for x in reg.values() if x['id'].split('-')[1] == mod]
        c = conteo(a + b)
        o.append(f'| {mod} | {len(a)} | {len(b)} | {len(a) + len(b)} | {c["PASSED"]} | {c["FAILED"]} | {c["BLOCKED"]} |')
    o += ['', '## Casos que no están en PASSED', '']
    if MANUAL_EXCEPCIONES:
        o += ['| Caso | Resultado | Defecto | Observación |', '|---|---|---|---|']
        for cid, (est, defecto, obs) in MANUAL_EXCEPCIONES.items():
            o.append(f'| {cid} | {est} | {defecto} | {obs} |')
    else:
        o.append('Ninguno: los 361 casos dieron PASSED en la ejecución manual.')
    o += ['', '## Testeo de confirmación de los defectos', '',
          'Los casos que reproducen cada defecto corregido se ejecutaron a mano dentro de los 361 y dieron PASSED. '
          'El detalle de qué se confirma y con qué arreglo está en la sección «Confirmación de defectos» de '
          '[`04-ejecucion.md`](04-ejecucion.md); el resultado manual de cada caso, en la tabla de abajo.', '',
          '| Defecto | Caso | Resultado manual |', '|---|---|---|']
    confirmacion = [('DEF-030', 'CP-EXP-027'), ('DEF-031', 'CP-EXP-028'), ('DEF-032', 'CP-EXP-029'), ('DEF-033', 'CP-IMP-024'),
                    ('DEF-034', 'CP-SUS-032'), ('DEF-035', 'CP-SUS-022'), ('DEF-036', 'CP-SUS-048'),
                    ('DEF-037', 'CP-DEU-024'), ('DEF-037', 'CP-DEU-025')]
    for d, cid in confirmacion:
        o.append(f'| {d} | {cid} | **{manual_de(cid)}** |')
    o += ['', 'DEF-023 (V1, intermitente) no tiene un caso propio: lo cubren los casos del alta y la configuración inicial '
          '(CP-ACC-013 a 016), que están entre los casos nuevos de V3 y dieron PASSED.', '',
          '## Resultado por caso', '',
          '| ID | Origen | Prioridad | Título | Manual | Automatizado | ¿Coincide? |', '|---|---|---|---|---|---|---|']
    for x in todos:
        m = manual_de(x['id'])
        origen = 'V3' if x['origen'] == 'V3' else f'Regresión {x["origen"]}'
        o.append(f'| {x["id"]} | {origen} | {x["prioridad"]} | {x["titulo"]} | **{m}** | {x["auto"]} | {"Sí" if m == x["auto"] else "No"} |')
    (E3 / '08-ejecucion-manual.md').write_text('\n'.join(o) + '\n', encoding='utf-8')
    print(f'{len(todos)} casos: manual {ctot} · coinciden {coinciden}')


if __name__ == '__main__':
    main()
