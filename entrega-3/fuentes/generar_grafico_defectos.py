"""Genera entrega-3/graficos/defectos-por-modulo.svg.

Los datos salen de los reportes de defectos (entrega-1/04 y entrega-2/05) y de los issues
con la etiqueta `bug` (DEF-001 a DEF-037, sin DEF-029, que se retiró). El módulo es el de la
historia afectada; ver entrega-3/06-analisis-y-post-mortem.md §1.2.

Uso: python entrega-3/fuentes/generar_grafico_defectos.py
"""
from pathlib import Path

# módulo: (casos del catálogo, [(DEF, severidad)])
DEFECTOS = {
    "CFG": [(6, "B"), (9, "M"), (10, "M"), (11, "M"), (17, "A"), (19, "B"), (22, "C"), (23, "A"), (25, "B"), (26, "B"), (28, "M")],
    "ACC": [(1, "M"), (3, "M"), (5, "M"), (8, "M"), (27, "B")],
    "REG": [(4, "C"), (7, "M"), (12, "B"), (13, "B")],
    "SUS": [(34, "B"), (35, "B"), (36, "B")],
    "EXP": [(30, "M"), (31, "M"), (32, "M")],
    "Transversal": [(2, "B"), (15, "B"), (24, "M")],
    "DEU": [(16, "M"), (37, "M")],
    "MON": [(18, "B"), (20, "B")],
    "DAS": [(14, "B"), (21, "M")],
    "IMP": [(33, "B")],
    "CUO": [],
    "NAV": [],
}

CASOS = {"CFG": 15, "ACC": 12, "REG": 16, "SUS": 48, "EXP": 31, "Transversal": None, "DEU": 61,
         "MON": 7, "DAS": 11, "IMP": 41, "CUO": 13, "NAV": 25}

SEV = [("C", "Crítica", "#7f1d1d"), ("A", "Alta", "#c2410c"), ("M", "Media", "#d99a1e"), ("B", "Baja", "#6b8fb3")]


def main():
    filas = sorted(DEFECTOS.items(), key=lambda kv: (-len(kv[1]), kv[0]))
    total = sum(len(v) for v in DEFECTOS.values())
    assert total == 36, total
    ancho, alto_fila, margen_izq, margen_sup = 760, 30, 190, 70
    alto = margen_sup + alto_fila * len(filas) + 50
    escala = 38
    o = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {ancho} {alto}" font-family="Arial, Helvetica, sans-serif" role="img" aria-label="Defectos por módulo y severidad">',
         f'<rect width="{ancho}" height="{alto}" fill="#ffffff"/>',
         '<text x="20" y="28" font-size="16" font-weight="bold" fill="#1f2933">Defectos por módulo y severidad (DEF-001 a DEF-037, sin DEF-029)</text>',
         f'<text x="20" y="48" font-size="12" fill="#52606d">{total} defectos con issue en GitHub. Entre paréntesis, los casos del catálogo del módulo.</text>']
    # leyenda
    x = 20
    for _, nombre, color in SEV:
        o.append(f'<rect x="{x}" y="56" width="10" height="10" fill="{color}"/><text x="{x + 14}" y="65" font-size="11" fill="#1f2933">{nombre}</text>')
        x += 80
    for i, (mod, defs) in enumerate(filas):
        y = margen_sup + i * alto_fila
        casos = CASOS[mod]
        etiqueta = f"{mod} ({casos})" if casos else f"{mod} (sin casos propios)"
        o.append(f'<text x="{margen_izq - 10}" y="{y + 18}" font-size="12" text-anchor="end" fill="#1f2933">{etiqueta}</text>')
        x = margen_izq
        for clave, nombre, color in SEV:
            n = sum(1 for _, s in defs if s == clave)
            if n:
                w = n * escala
                o.append(f'<rect x="{x}" y="{y + 4}" width="{w}" height="20" fill="{color}"><title>{mod}: {n} {nombre}</title></rect>')
                o.append(f'<text x="{x + w / 2}" y="{y + 19}" font-size="11" text-anchor="middle" fill="#ffffff">{n}</text>')
                x += w
        o.append(f'<text x="{x + 8}" y="{y + 19}" font-size="12" font-weight="bold" fill="#1f2933">{len(defs)}</text>')
    o.append(f'<text x="20" y="{alto - 14}" font-size="11" fill="#52606d">Fuente: reportes de defectos de las entregas 1 y 2 e issues con la etiqueta bug.</text>')
    o.append("</svg>")
    destino = Path(__file__).resolve().parent.parent / "graficos" / "defectos-por-modulo.svg"
    destino.parent.mkdir(exist_ok=True)
    destino.write_text("\n".join(o), encoding="utf-8")
    print(destino, total)


if __name__ == "__main__":
    main()
