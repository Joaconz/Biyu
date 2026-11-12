"""Genera entrega-3/04-ejecucion.md y 04-ejecucion.xlsx con el resultado de cada caso de V3 y de la regresión.

Un caso es PASSED si todas las pruebas que lo cubren pasaron en la corrida; FAILED si alguna falló; BLOCKED si
no hay corrida de esa prueba. Las pruebas que cubren cada caso salen de tres lugares:
  1. el ID del caso en el título de un test de Playwright («CP-NAV-011 y 025 · …»);
  2. el cruce por historia y criterio de aceptación (mapear_casos_a_tests.py), para los tests de US-80 a US-91;
  3. la tabla EVIDENCIA_MANUAL de abajo: pgTAP, Vitest y los tests de Playwright que no llevan el ID.

Uso: python entrega-3/fuentes/generar_ejecucion.py   (necesita openpyxl y los JSON de entrega-3/ejecucion/)
"""
import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill

sys.path.insert(0, str(Path(__file__).parent))
import mapear_casos_a_tests as mapa  # noqa: E402
ids_en = mapa.ids_en

RAIZ = Path(__file__).resolve().parents[2]
EJEC = RAIZ / 'entrega-3' / 'ejecucion'
ID = re.compile(r'CP-[A-Z]+-\d{3}')

U = lambda f: ('unit', f)  # noqa: E731
D = lambda f: ('db', f)  # noqa: E731
E = lambda t: ('e2e', t)  # noqa: E731

IP = 'installments-paid.test.ts'
EVIDENCIA_MANUAL = {
    'CP-IMP-042': [U('tests/lib/xlsx.test.ts'), U('tests/domain/import-file.test.ts')],
    'CP-IMP-044': [U(f'tests/domain/{IP}')], 'CP-IMP-046': [U(f'tests/domain/{IP}')],
    'CP-IMP-047': [U(f'tests/domain/{IP}')], 'CP-IMP-048': [U(f'tests/domain/{IP}')],
    'CP-IMP-049': [D('dashboard_inherited_installments.test.sql')],
    'CP-IMP-050': [U(f'tests/domain/{IP}')],
    'CP-IMP-051': [D('installments_paid.test.sql')], 'CP-IMP-052': [D('installments_paid.test.sql')],
    'CP-IMP-057': [E('CP-IMP-057 · abrir y cerrar la guía no cambia el archivo, el resumen, el filtro ni la URL')],
    'CP-DEU-093': [D('shared_expense_many_people.test.sql')],
    'CP-DEU-094': [D('shared_expense_many_people.test.sql'), D('shared_expense.test.sql')],
    'CP-CFG-041': [D('user_preferences.test.sql')],
    'CP-SUS-066': [U('tests/domain/pending-subscription-charges.test.ts')],
    'CP-DEU-095': [E('CP-DEU-095 · cambiar el paso 1 con filas cargadas: otra moneda vacía los montos y pasar a ingreso apaga el interruptor'),
                   E('CP-DEU-095 · bajar el gasto con filas cargadas marca la suma y después el tope por fila, sin ajustar las deudas')],
    'CP-DAS-015': [U('tests/domain/loose-debts-balance.test.ts')], 'CP-DAS-016': [U('tests/domain/loose-debts-balance.test.ts')],
    'CP-DAS-017': [U('tests/domain/loose-debts-balance.test.ts')],
    'CP-DAS-020': [U('tests/domain/loose-debts-balance.test.ts'),
                   E('CP-DAS-020 · el mes viene de la URL y, si falla la lectura de las deudas, no hay números')],
    'CP-REG-040': [U('tests/domain/transaction-edit.test.ts')],
    'CP-REG-044': [E('ADR-044 §2 · el movimiento de una suscripción eliminado no ofrece borrado definitivo y la RPC lo rechaza'),
                   D('purge_transaction.test.sql')],
    'CP-DEU-062': [E('US-87: eliminar una deuda suelta con confirmación; cancelar no borra')],
    'CP-DEU-063': [E('US-87: eliminar una deuda suelta con confirmación; cancelar no borra')],
    'CP-DEU-064': [E('US-87: una deuda saldada no ofrece «Eliminar» hasta volver a pendiente')],
    'CP-DEU-065': [D('delete_debt.test.sql')], 'CP-DEU-066': [D('delete_debt.test.sql')], 'CP-DEU-067': [D('delete_debt.test.sql')],
    'CP-DEU-068': [E('US-87: si la baja falla el diálogo sigue abierto y permite reintentar')],
    'CP-SUS-049': [E('US-88: eliminar una suscripción activa deja sus gastos como movimientos sueltos; volver no borra')],
    'CP-SUS-050': [E('US-88: eliminar una suscripción activa deja sus gastos como movimientos sueltos; volver no borra')],
    'CP-SUS-051': [E('US-88: una cancelada solo ofrece «Eliminar definitivamente» y se puede borrar')],
    'CP-SUS-052': [E('CP-SUS-052 · una pausada se borra y el diálogo avisa que deja de generar')],
    'CP-SUS-053': [D('delete_subscription.test.sql')], 'CP-SUS-054': [D('delete_subscription.test.sql')],
    'CP-SUS-055': [E('US-88: la suscripción de otro usuario responde 404 y no se borra'), D('delete_subscription.test.sql')],
    'CP-CFG-016': [E('US-89: una categoría sin uso se borra con confirmación; una en uso se rechaza')],
    'CP-CFG-017': [E('CP-CFG-017 · una categoría archivada sin uso se borra desde «Archivadas»')],
    'CP-CFG-018': [E('US-89: una categoría sin uso se borra con confirmación; una en uso se rechaza')],
    'CP-CFG-019': [D('delete_category.test.sql')], 'CP-CFG-020': [D('delete_category.test.sql')],
    'CP-CFG-021': [D('delete_category.test.sql')],
    'CP-CFG-022': [E('US-89: una categoría sin uso se borra con confirmación; una en uso se rechaza')],
}
# Casos de UI y API cuyo tramo de API lo cubre pgTAP además de Playwright.
EVIDENCIA_EXTRA = {
    'CP-DAS-028': [U('tests/domain/balance.test.ts')], 'CP-DAS-030': [U('tests/domain/balance.test.ts')],
    'CP-REG-031': [D('update_transaction.test.sql')], 'CP-REG-033': [D('update_transaction.test.sql')],
    'CP-REG-037': [D('update_transaction.test.sql')],
    'CP-REG-041': [D('purge_transaction.test.sql')], 'CP-REG-045': [D('purge_transaction.test.sql')],
}


def cargar_resultados():
    pw = json.loads((EJEC / 'playwright-resultados.json').read_text(encoding='utf-8'))
    e2e = {}
    for sp in pw['suites'][0]['specs']:
        e2e[sp['title']] = (sp['ok'], sp['file'])
    stats = dict(total=len(e2e), pasados=sum(1 for v in e2e.values() if v[0]))
    vt = json.loads((EJEC / 'vitest-resultados.json').read_text(encoding='utf-8'))
    unit = {}
    for f in vt['testResults']:
        rel = Path(f['name']).as_posix().split('/Biyu/')[-1]
        unit[rel] = f['status'] == 'passed'
    db = {}
    for linea in (EJEC / 'pgtap-resultados.txt').read_text(encoding='utf-8').splitlines():
        m = re.match(r'^\S*?([\w]+\.test\.sql) \.+ (.*)$', linea.strip())
        if m:
            db[m.group(1)] = m.group(2).strip() == 'ok'
    return e2e, unit, db, stats, vt


def estado(ev, e2e, unit, db):
    kind, ref = ev
    if kind == 'e2e':
        if ref in e2e:
            return 'PASSED' if e2e[ref][0] else 'FAILED'
        hits = [t for t in e2e if t.startswith(ref[:50])]
        return ('PASSED' if all(e2e[t][0] for t in hits) else 'FAILED') if hits else 'BLOCKED'
    tabla = unit if kind == 'unit' else db
    return 'BLOCKED' if ref not in tabla else ('PASSED' if tabla[ref] else 'FAILED')


def casos_v3():
    filas = {}
    archivos = [*(RAIZ / 'entrega-3' / 'casos').glob('us-*.md'), *(RAIZ / 'entrega-3' / 'casos').glob('adr-*.md')]
    for p in sorted(archivos, key=lambda p: int(re.match(r'(?:us|adr)-(\d+)', p.name).group(1))):
        tipo = re.match(r'(us|adr)-', p.name).group(1).upper()
        us = int(re.match(r'(?:us|adr)-(\d+)', p.name).group(1))
        cab = None
        for linea in p.read_text(encoding='utf-8').splitlines():
            if linea.startswith('| ID |') and cab is None:
                cab = [c.strip() for c in linea.strip('|').split('|')]
                continue
            m = re.match(r'\| (CP-[A-Z]+-\d{3}) \|', linea)
            if m and cab and m.group(1) not in filas:
                celdas = [c.strip() for c in linea.strip().strip('|').split('|')]
                d = dict(zip(cab, celdas))
                filas[m.group(1)] = dict(
                    id=m.group(1), us=f'ADR-{us:03d}' if tipo == 'ADR' else f'US-{us}', titulo=re.sub(r'`', '', d.get('Título', '')),
                    prioridad=d.get('Prioridad', ''), tecnica=d.get('Técnica', ''), tipo=d.get('Tipo', ''), canal=d.get('Canal', ''))
    return filas


def casos_regresion():
    filas = {}
    for linea in (RAIZ / 'entrega-3' / '03-seleccion-regresion.md').read_text(encoding='utf-8').splitlines():
        m = re.match(r'\| (CP-[A-Z]+-\d{3}) \| (V\d) \| (\w+) \| (.*?) \| (.*?) \| ', linea)
        if m:
            filas[m.group(1)] = dict(id=m.group(1), version=m.group(2), prioridad=m.group(3),
                                     titulo=re.sub(r'`', '', m.group(4)), previo=m.group(5))
    return filas


def evidencia_v3(e2e, unit, db):
    por_id = defaultdict(list)
    for t in e2e:
        for i in ids_en(t):
            por_id[i].append(('e2e', t))
    ev = defaultdict(list)
    for i, lst in por_id.items():
        ev[i] += lst
    # cruce por criterio de aceptación
    for us, specs in mapa.SPECS.items():
        try:
            casos = mapa.casos_de(us)
        except StopIteration:
            continue
        tests = [t for s in specs for t in mapa.tests_de(s)]
        for cid, _, crit in casos:
            if cid in ev or cid in EVIDENCIA_MANUAL:
                continue
            ca = mapa.cas_de(crit)
            for _, _, titulo in tests:
                if ca & mapa.cas_de(titulo.split(' · ')[0].split(' – ')[0].split(' — ')[0]):
                    if ('e2e', titulo) not in ev[cid] and titulo in e2e:
                        ev[cid].append(('e2e', titulo))
    for i, lst in EVIDENCIA_MANUAL.items():
        ev[i] = list(lst)
    for i, lst in EVIDENCIA_EXTRA.items():
        ev[i] = ev.get(i, []) + lst
    return ev


# Confirmación de defectos: (defecto, severidad, caso que lo detectó, marca del título del test, arreglo, qué se verifica)
DEFECTOS = [
    ('DEF-030', 'Media', 'CP-EXP-027', 'CP-EXP-027 ·', 'PR #365', 'Tocar fuera de la hoja «Exportar movimientos» la cierra sin descargar'),
    ('DEF-031', 'Media', 'CP-EXP-028', 'CP-EXP-028 ·', 'PR #365', '«Atrás» y «Adelante» cierran la hoja y cambian el período'),
    ('DEF-032', 'Media', 'CP-EXP-029', 'CP-EXP-029 ·', 'PR #365', '«Atrás» durante «Exportando…» cancela la descarga'),
    ('DEF-033', 'Baja', 'CP-IMP-024', 'CP-IMP-024 ·', 'PR #366', 'La tarjeta de la fila muestra los nombres de Biyu (también en `import-rows.test.ts`)'),
    ('DEF-034', 'Baja', 'CP-SUS-032', 'CP-SUS-032 ·', 'PR #368', 'Operar sobre la suscripción de otro usuario responde 404'),
    ('DEF-035', 'Baja', 'CP-SUS-022', 'CP-SUS-022 ·', 'PR #368', 'Sin sesión la API responde 401 con `42501` (el defecto era del caso)'),
    ('DEF-036', 'Baja', 'CP-SUS-048', 'CP-SUS-048 ·', 'PR #368', 'La vista previa marca `data-blocked` en cada mes (el defecto era del caso)'),
    ('DEF-037', 'Media', 'CP-DEU-024 y CP-DEU-025', 'DEF-037', 'PR #367', 'El primer clic en «US$» selecciona la moneda; un tipo de cambio de 0 muestra su error'),
    ('DEF-023', 'Alta', 'sin caso (V1, intermitente)', 'aunque la siembra tarde (DEF-023)', 'PR #198 (V1)', 'Con la siembra demorada, crear la cuenta lleva a `/setup` y nada vuelve a `/register`; los casos CP-ACC-013 a 016 cubren el alta'),
]


def confirmacion_defectos(e2e):
    filas = []
    for d, sev, caso, marca, arreglo, que in DEFECTOS:
        tests = [t for t in e2e if marca in t]
        if not tests:
            est = 'BLOCKED'
        else:
            est = 'PASSED' if all(e2e[t][0] for t in tests) else 'FAILED'
        filas.append((d, sev, caso, arreglo, que, est, len(tests)))
    return filas


def main():
    e2e, unit, db, stats, vt = cargar_resultados()
    v3, reg = casos_v3(), casos_regresion()
    ev = evidencia_v3(e2e, unit, db)

    def resolver(cid):
        pruebas = ev.get(cid, [])
        sts = [estado(p, e2e, unit, db) for p in pruebas]
        if not pruebas:
            return 'BLOCKED', pruebas, 'sin prueba automatizada que lo cubra'
        if 'FAILED' in sts:
            return 'FAILED', pruebas, ''
        if 'BLOCKED' in sts:
            return 'BLOCKED', pruebas, 'una prueba no se corrió'
        return 'PASSED', pruebas, ''

    res_v3 = {c: resolver(c) for c in v3}
    res_reg = {c: resolver(c) for c in reg}

    def etiqueta(p):
        k, r = p
        if k == 'e2e':
            return f'Playwright · {e2e[r][1] if r in e2e else "?"} · {r}'
        return ('Vitest · ' if k == 'unit' else 'pgTAP · ') + r

    def por_modulo(res, meta):
        c = defaultdict(Counter)
        for cid, (st, _, _) in res.items():
            c[cid.split('-')[1]][st] += 1
        return c

    # ------------------------------------------------------------ xlsx
    wb = Workbook()
    ws = wb.active
    ws.title = 'Índice'
    ws.append(['Biyu · Entrega 3 · Ejecución de casos de prueba (V3) y regresión de V1 y V2'])
    ws['A1'].font = Font(bold=True, size=13)
    ws.append(['Test case ID', 'Conjunto', 'Prioridad', 'Título', 'User story / versión', 'Status', 'Pruebas que lo cubren', 'Motivo'])
    for c in ws[2]:
        c.font = Font(bold=True)
    colores = {'PASSED': 'C6EFCE', 'FAILED': 'FFC7CE', 'BLOCKED': 'FFEB9C'}
    for cid, m in v3.items():
        st, pr, motivo = res_v3[cid]
        ws.append([cid, 'V3', m['prioridad'], m['titulo'], m['us'], st, '\n'.join(etiqueta(p) for p in pr), motivo])
    for cid, m in reg.items():
        st, pr, motivo = res_reg[cid]
        ws.append([cid, 'Regresión', m['prioridad'], m['titulo'], m['version'], st, '\n'.join(etiqueta(p) for p in pr), motivo])
    for row in ws.iter_rows(min_row=3):
        row[5].fill = PatternFill('solid', fgColor=colores[row[5].value])
        for c in row:
            c.alignment = Alignment(wrap_text=True, vertical='top')
    for col, w in zip('ABCDEFGH', (13, 11, 10, 70, 14, 10, 90, 30)):
        ws.column_dimensions[col].width = w
    ws.freeze_panes = 'A3'
    ws.auto_filter.ref = f'A2:H{ws.max_row}'

    rs = wb.create_sheet('Resumen')
    rs.append(['Conjunto', 'Casos', 'PASSED', 'FAILED', 'BLOCKED', '% PASSED'])
    for nombre, res in (('V3', res_v3), ('Regresión V1 y V2', res_reg)):
        c = Counter(s for s, _, _ in res.values())
        rs.append([nombre, len(res), c['PASSED'], c['FAILED'], c['BLOCKED'], round(100 * c['PASSED'] / len(res), 1)])
    rs.append([])
    rs.append(['Módulo', 'Conjunto', 'PASSED', 'FAILED', 'BLOCKED'])
    for nombre, res in (('V3', res_v3), ('Regresión', res_reg)):
        for mod, c in sorted(por_modulo(res, None).items()):
            rs.append([mod, nombre, c['PASSED'], c['FAILED'], c['BLOCKED']])
    for c in rs[1]:
        c.font = Font(bold=True)
    rs.column_dimensions['A'].width = 22
    cd = wb.create_sheet('Defectos')
    cd.append(['Defecto', 'Severidad', 'Caso', 'Arreglo', 'Qué se confirma', 'Resultado', 'Tests'])
    for c in cd[1]:
        c.font = Font(bold=True)
    for f in confirmacion_defectos(e2e):
        cd.append(list(f))
        cd.cell(cd.max_row, 6).fill = PatternFill('solid', fgColor=colores[f[5]])
    for col, w in zip('ABCDEFG', (10, 10, 26, 14, 90, 11, 7)):
        cd.column_dimensions[col].width = w
    wb.save(RAIZ / 'entrega-3' / '04-ejecucion.xlsx')

    # ------------------------------------------------------------ md
    def resumen(res):
        c = Counter(s for s, _, _ in res.values())
        return len(res), c['PASSED'], c['FAILED'], c['BLOCKED']

    n3, p3, f3, b3 = resumen(res_v3)
    nr, pr_, fr, br = resumen(res_reg)
    out = []
    out.append('# Entrega 3 · Ejecución de casos de prueba (V3) y regresión de V1 y V2\n')
    out.append('Planilla: [`04-ejecucion.xlsx`](04-ejecucion.xlsx) (índice con el resultado y las pruebas de cada caso, y un resumen por módulo). '
               'Se genera con `python entrega-3/fuentes/generar_ejecucion.py` a partir de los resultados de `entrega-3/ejecucion/`.\n')
    out.append('## Condiciones de la ejecución\n')
    out.append('- **Fecha:** 2026-11-11, sobre `main` con todos los PR de V3 mergeados (más los tests agregados en esta ejecución).')
    out.append('- **Entorno:** Vite (`http://127.0.0.1:5173`) y Supabase local con todas las migraciones, Chromium emulando un celular de 390 × 844 px, un usuario nuevo por prueba (PR-01). La base de producción tiene las mismas migraciones.')
    out.append(f"- **Quién ejecutó:** la suite automatizada, corrida con IA (Claude Code) sobre el stack local: Playwright ({stats['pasados']} de {stats['total']} tests), "
               f"Vitest ({vt['numPassedTests']} de {vt['numTotalTests']}) y pgTAP. **No hay ejecución manual del equipo en esta planilla.**")
    out.append('- **Criterio:** un caso es PASSED si pasaron todas las pruebas que lo cubren, FAILED si alguna falló y BLOCKED si ninguna prueba lo cubre o no se pudo correr. '
               'La columna «Pruebas que lo cubren» de la planilla nombra cada una. Un caso de UI y API puede estar cubierto por Playwright y por pgTAP a la vez.')
    out.append('- **Cobertura parcial:** un test de Playwright puede cubrir varios casos (por ejemplo, un test por criterio de aceptación para varios casos de una historia). Eso es cobertura del comportamiento, no una repetición paso a paso de la tabla del caso.')
    out.append('- **pgTAP:** en local `update_subscription.test.sql` falla 3 de 164 (tests 75 a 77) por usuarios viejos de otras corridas en la base local; en la CI pasa y ningún caso de V3 depende de ese archivo.\n')
    out.append('## Resultado\n')
    out.append('| Conjunto | Casos | PASSED | FAILED | BLOCKED | % PASSED |\n|---|---|---|---|---|---|')
    out.append(f'| Casos de V3 | {n3} | {p3} | {f3} | {b3} | {100 * p3 / n3:.1f} % |')
    out.append(f'| Regresión de V1 y V2 | {nr} | {pr_} | {fr} | {br} | {100 * pr_ / nr:.1f} % |')
    out.append(f'| **Total** | {n3 + nr} | {p3 + pr_} | {f3 + fr} | {b3 + br} | {100 * (p3 + pr_) / (n3 + nr):.1f} % |\n')
    out.append('### Por módulo\n')
    out.append('| Módulo | V3 PASSED | V3 FAILED | V3 BLOCKED | Regresión PASSED | Regresión FAILED | Regresión BLOCKED |\n|---|---|---|---|---|---|---|')
    m3, mr = por_modulo(res_v3, None), por_modulo(res_reg, None)
    for mod in sorted(set(m3) | set(mr)):
        out.append(f"| {mod} | {m3[mod]['PASSED']} | {m3[mod]['FAILED']} | {m3[mod]['BLOCKED']} | {mr[mod]['PASSED']} | {mr[mod]['FAILED']} | {mr[mod]['BLOCKED']} |")
    out.append('')
    no_ok = [(c, res_v3[c]) for c in v3 if res_v3[c][0] != 'PASSED'] + [(c, res_reg[c]) for c in reg if res_reg[c][0] != 'PASSED']
    out.append('## Casos que no están en PASSED\n')
    if no_ok:
        out.append('| ID | Status | Motivo |\n|---|---|---|')
        for c, (st, pr, motivo) in no_ok:
            titulo = (v3.get(c) or reg.get(c))['titulo']
            out.append(f'| {c} | {st} | {motivo or "falló una prueba"}: {titulo} |')
    else:
        out.append('Ninguno: todos los casos de V3 y de la regresión están en PASSED.')
    conf = confirmacion_defectos(e2e)
    out.append('\n## Confirmación de defectos\n')
    out.append('Testeo de confirmación: cada defecto de V2 (DEF-030 a DEF-037) y el DEF-023 de V1 (intermitente, sin confirmar en la Entrega 2) se repite con el test que reproduce sus pasos. '
               'Es el mismo caso que lo detectó: antes fallaba y ahora pasa. DEF-035 y DEF-036 eran errores del caso y se corrigieron en el caso. DEF-023 era intermitente: el test demora la siembra a propósito y verifica que nada vuelva a `/register`, que es la causa corregida; no prueba que la pantalla en blanco no pueda reaparecer.\n')
    out.append('| Defecto | Severidad | Caso | Arreglo | Qué se confirma | Resultado | Tests |\n|---|---|---|---|---|---|---|')
    for d, sev, caso, arreglo, que, est, n in conf:
        out.append(f'| {d} | {sev} | {caso} | {arreglo} | {que} | **{est}** | {n} |')
    cc = Counter(c[5] for c in conf)
    out.append(f"\n**{cc['PASSED']} de {len(conf)} confirmados** (corregidos); {cc['FAILED']} siguen fallando y {cc['BLOCKED']} no se pudieron confirmar.")
    out.append('\n## Resultado por caso de V3\n')
    out.append('| ID | Prioridad | Título | Historia | Status | Cubierto por |\n|---|---|---|---|---|---|')
    for cid, m in v3.items():
        st, pr, _ = res_v3[cid]
        cubre = '; '.join(sorted({('Playwright' if k == 'e2e' else 'Vitest' if k == 'unit' else 'pgTAP') for k, _ in pr})) or '—'
        out.append(f"| {cid} | {m['prioridad']} | {m['titulo']} | {m['us']} | **{st}** | {cubre} |")
    out.append('\n## Resultado por caso de la regresión\n')
    out.append('| ID | Versión | Prioridad | Título | Último resultado | Status en V3 |\n|---|---|---|---|---|---|')
    for cid, m in reg.items():
        out.append(f"| {cid} | {m['version']} | {m['prioridad']} | {m['titulo']} | {m['previo']} | **{res_reg[cid][0]}** |")
    (RAIZ / 'entrega-3' / '04-ejecucion.md').write_text('\n'.join(out) + '\n', encoding='utf-8')
    print(f'V3: {n3} casos · PASSED {p3} · FAILED {f3} · BLOCKED {b3}')
    print(f'Regresión: {nr} casos · PASSED {pr_} · FAILED {fr} · BLOCKED {br}')
    for c, (st, pr, motivo) in no_ok:
        print(' ', c, st, motivo)


if __name__ == '__main__':
    main()
