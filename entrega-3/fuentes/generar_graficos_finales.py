"""Genera los gráficos del reporte final de la Entrega 3 (entrega-3/graficos/).

  - resultados-por-entrega.svg: % de PASSED, FAILED, DUDA y BLOCKED de cada ejecución de las tres entregas.
  - evolucion-entre-entregas.svg: cantidad de casos por estado en la última ejecución de cada entrega.

Los datos de V1 y V2 salen de entrega-1/05-reporte-de-ejecucion.md §1 y entrega-2/04-ejecucion.md (Reporte, §1);
los de V3, de la tabla «Resultado» de entrega-3/04-ejecucion.md, que genera generar_ejecucion.py.

Uso (desde la raíz del repo): python entrega-3/fuentes/generar_graficos_finales.py
"""
import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
SALIDA = RAIZ / 'entrega-3' / 'graficos'

COLOR = {'PASSED': '#2E7D5B', 'FAILED': '#C0392B', 'DUDA': '#D4A017', 'BLOCKED': '#8C8C8C'}
ESTADOS = ['PASSED', 'FAILED', 'DUDA', 'BLOCKED']

# (título, subtítulo, {estado: casos})
V1_EJ1 = ('Entrega 1 · ejecución 1', 'V1, 28/09/2026', {'PASSED': 67, 'FAILED': 3, 'BLOCKED': 4})
V1_EJ2 = ('Entrega 1 · ejecución 2', 'V1, re-test, 29/09/2026', {'PASSED': 72, 'FAILED': 2})
V2_NUEVOS = ('Entrega 2 · casos de V2', 'V2, 25 a 27/10/2026', {'PASSED': 189, 'FAILED': 9, 'DUDA': 1, 'BLOCKED': 4})
V2_REG = ('Entrega 2 · regresión de V1', 'V2, 28/10/2026', {'PASSED': 60})


def resultado_v3():
    """Lee la tabla «Resultado» de 04-ejecucion.md: {conjunto: {estado: casos}}."""
    texto = (RAIZ / 'entrega-3' / '04-ejecucion.md').read_text(encoding='utf-8')
    seccion = texto.split('## Resultado', 1)[1].split('###', 1)[0]
    filas = {}
    for linea in seccion.splitlines():
        celdas = [c.strip().strip('*') for c in linea.strip().strip('|').split('|')]
        if len(celdas) == 6 and celdas[1].isdigit():
            filas[celdas[0]] = {'PASSED': int(celdas[2]), 'FAILED': int(celdas[3]), 'BLOCKED': int(celdas[4])}
    return filas


def pct(n, total):
    return f'{100 * n / total:.1f}'.replace('.', ',')


def grafico_porcentajes(filas, destino):
    ancho, x0, largo = 960, 330, 420
    alto = 96 + 64 * len(filas) + 70
    o = [f"<svg xmlns='http://www.w3.org/2000/svg' width='{ancho}' height='{alto}' viewBox='0 0 {ancho} {alto}' "
         f"font-family='-apple-system, Segoe UI, Helvetica, Arial, sans-serif' role='img' "
         f"aria-label='Resultados por entrega y por ejecución'>",
         f"<rect width='{ancho}' height='{alto}' fill='#FFFFFF'/>",
         "<text x='24' y='36' font-size='22' font-weight='700' fill='#1B1B1B'>Resultados por entrega y por ejecución</text>",
         "<text x='24' y='62' font-size='14' fill='#555'>Porcentaje sobre los casos planificados de cada ejecución</text>"]
    y = 96
    for titulo, sub, d in filas:
        total = sum(d.values())
        o.append(f"<text x='24' y='{y + 15}' font-size='15' font-weight='600' fill='#1B1B1B'>{titulo}</text>")
        o.append(f"<text x='24' y='{y + 33}' font-size='12' fill='#666'>{sub} · {total} casos</text>")
        x = x0
        resto = []
        for e in ESTADOS:
            n = d.get(e, 0)
            if not n:
                continue
            w = largo * n / total
            o.append(f"<rect x='{x:.1f}' y='{y}' width='{w:.1f}' height='34' fill='{COLOR[e]}'/>")
            if w > 90:
                o.append(f"<text x='{x + w / 2:.1f}' y='{y + 22}' font-size='13' font-weight='600' fill='#FFF' "
                         f"text-anchor='middle'>{pct(n, total)} % ({n})</text>")
            else:
                resto.append(f'{e.capitalize()} {n}')
            x += w
        if resto:
            o.append(f"<text x='{x0 + largo + 10}' y='{y + 22}' font-size='12' fill='#444'>{' · '.join(resto)}</text>")
        y += 64
    lx = 24
    for e in ESTADOS:
        o.append(f"<rect x='{lx}' y='{y + 14}' width='14' height='14' fill='{COLOR[e]}'/>")
        o.append(f"<text x='{lx + 20}' y='{y + 26}' font-size='12' fill='#333'>{e}</text>")
        lx += 110
    o.append(f"<text x='24' y='{y + 56}' font-size='11' fill='#666'>Fuentes: entrega-1/05-reporte-de-ejecucion.md §1, "
             f"entrega-2/04-ejecucion.md (Reporte, §1) y entrega-3/04-ejecucion.md. DUDA: pasa, con dudas.</text>")
    o.append('</svg>')
    destino.write_text('\n'.join(o), encoding='utf-8')


def grafico_evolucion(entregas, destino):
    ancho, alto = 760, 420
    base, tope, x0 = 340, 90, 90
    maximo = max(sum(d.values()) for _, d in entregas)
    escala = (base - tope) / maximo
    o = [f"<svg xmlns='http://www.w3.org/2000/svg' width='{ancho}' height='{alto}' viewBox='0 0 {ancho} {alto}' "
         f"font-family='-apple-system, Segoe UI, Helvetica, Arial, sans-serif' role='img' "
         f"aria-label='Casos por estado en cada entrega'>",
         f"<rect width='{ancho}' height='{alto}' fill='#FFFFFF'/>",
         "<text x='24' y='36' font-size='22' font-weight='700' fill='#1B1B1B'>Evolución entre entregas</text>",
         "<text x='24' y='62' font-size='14' fill='#555'>Casos por estado en la última ejecución de cada entrega "
         "(V3 incluye la regresión)</text>",
         f"<line x1='{x0 - 10}' y1='{base}' x2='{ancho - 30}' y2='{base}' stroke='#999'/>"]
    paso = (ancho - x0 - 60) / len(entregas)
    for i, (nombre, d) in enumerate(entregas):
        x = x0 + i * paso + paso / 2 - 45
        y = base
        resto = []
        for e in ESTADOS:
            n = d.get(e, 0)
            if not n:
                continue
            h = n * escala
            y -= h
            o.append(f"<rect x='{x:.1f}' y='{y:.1f}' width='90' height='{h:.1f}' fill='{COLOR[e]}'/>")
            if h > 18:
                o.append(f"<text x='{x + 45:.1f}' y='{y + h / 2 + 5:.1f}' font-size='13' font-weight='600' fill='#FFF' "
                         f"text-anchor='middle'>{n}</text>")
            else:
                resto.append(f'{e.capitalize()} {n}')
        total = sum(d.values())
        o.append(f"<text x='{x + 45:.1f}' y='{y - 8:.1f}' font-size='13' font-weight='700' fill='#1B1B1B' "
                 f"text-anchor='middle'>{total} casos · {pct(d.get('PASSED', 0), total)} % PASSED</text>")
        o.append(f"<text x='{x + 45:.1f}' y='{base + 22}' font-size='13' font-weight='600' fill='#1B1B1B' "
                 f"text-anchor='middle'>{nombre}</text>")
        if resto:
            o.append(f"<text x='{x + 45:.1f}' y='{base + 40}' font-size='11' fill='#444' "
                     f"text-anchor='middle'>{' · '.join(resto)}</text>")
    lx = 24
    for e in ESTADOS:
        o.append(f"<rect x='{lx}' y='{alto - 36}' width='14' height='14' fill='{COLOR[e]}'/>")
        o.append(f"<text x='{lx + 20}' y='{alto - 24}' font-size='12' fill='#333'>{e}</text>")
        lx += 110
    o.append('</svg>')
    destino.write_text('\n'.join(o), encoding='utf-8')


def main():
    v3 = resultado_v3()
    nuevos = v3['Casos de V3']
    regresion = v3['Regresión de V1 y V2']
    total = v3['Total']
    filas = [
        V1_EJ1, V1_EJ2, V2_NUEVOS, V2_REG,
        ('Entrega 3 · casos nuevos de V3', 'V3, 2026-11-14', nuevos),
        ('Entrega 3 · regresión de V1 y V2', 'V3, 2026-11-14', regresion),
        ('Entrega 3 · ejecución manual', 'V3, 14 al 16/11/2026', {'PASSED': 361}),
    ]
    SALIDA.mkdir(exist_ok=True)
    grafico_porcentajes(filas, SALIDA / 'resultados-por-entrega.svg')
    grafico_evolucion([('Entrega 1 (V1)', V1_EJ2[2]), ('Entrega 2 (V2)', V2_NUEVOS[2]), ('Entrega 3 (V3)', total)],
                      SALIDA / 'evolucion-entre-entregas.svg')
    print('gráficos escritos en', SALIDA.relative_to(RAIZ))


if __name__ == '__main__':
    main()
