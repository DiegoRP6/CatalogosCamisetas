"""
Genera un PDF tipo catálogo con TODAS las imágenes en cuadrícula uniforme.
3 imágenes por fila, mismo tamaño, ordenadas por número de producto.
"""

from __future__ import annotations

import os
import re
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    os.system(f'"{sys.executable}" -m pip install Pillow reportlab')
    from PIL import Image

try:
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.units import mm
    from reportlab.lib.utils import ImageReader
    from reportlab.pdfgen import canvas
except ImportError:
    os.system(f'"{sys.executable}" -m pip install reportlab')
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.units import mm
    from reportlab.lib.utils import ImageReader
    from reportlab.pdfgen import canvas


CARPETA = Path(__file__).parent
SALIDA = CARPETA / "catalogo.pdf"
EXTS = {".jpg", ".jpeg", ".png", ".webp"}
COLS = 3
FILAS = 4  # 12 imágenes por página

PATRON = re.compile(
    r"^imgi_(?P<num>\d+)_(?P<size>\w+?)(?:\s*\((?P<var>\d+)\))?$",
    re.IGNORECASE,
)


def recolectar() -> list[Path]:
    """Devuelve solo la imagen principal de cada producto, ordenada por número."""
    principales: dict[int, tuple[int, Path]] = {}
    for p in CARPETA.iterdir():
        if not p.is_file() or p.suffix.lower() not in EXTS:
            continue
        m = PATRON.match(p.stem)
        if not m:
            continue
        num = int(m.group("num"))
        var = int(m.group("var")) if m.group("var") else 0
        if num not in principales or var < principales[num][0]:
            principales[num] = (var, p)
    return [principales[k][1] for k in sorted(principales)]


def cargar_imagen(path: Path):
    try:
        img = Image.open(path)
        img.load()
        if img.mode not in ("RGB", "L"):
            img = img.convert("RGB")
        return ImageReader(img)
    except Exception as e:
        print(f"  ! No se pudo cargar {path.name}: {e}")
        return None


def dibujar_ajustada(c, reader, x, y, w, h):
    iw, ih = reader.getSize()
    if iw == 0 or ih == 0:
        return
    escala = min(w / iw, h / ih)
    nw, nh = iw * escala, ih * escala
    nx = x + (w - nw) / 2
    ny = y + (h - nh) / 2
    c.drawImage(reader, nx, ny, nw, nh, preserveAspectRatio=True, mask="auto")


def generar_pdf(imagenes: list[Path], salida: Path) -> None:
    ancho, alto = A4
    margen = 12 * mm
    c = canvas.Canvas(str(salida), pagesize=A4)
    c.setTitle("CATÁLOGO RETRO")

    # Portada
    c.setFillColorRGB(0, 0, 0)
    c.setFont("Helvetica-Bold", 42)
    c.drawCentredString(ancho / 2, alto / 2 + 10, "CATÁLOGO RETRO")
    c.showPage()

    area_top = alto - margen - 12 * mm
    area_bottom = margen
    area_w = ancho - 2 * margen
    area_h = area_top - area_bottom

    celda_w = area_w / COLS
    celda_h = area_h / FILAS
    pad = 3 * mm

    por_pagina = COLS * FILAS
    total = len(imagenes)
    paginas = (total + por_pagina - 1) // por_pagina

    for i, path in enumerate(imagenes):
        idx_en_pagina = i % por_pagina
        if idx_en_pagina == 0:
            c.setFont("Helvetica-Bold", 18)
            c.setFillColorRGB(0, 0, 0)
            c.drawCentredString(ancho / 2, alto - margen - 4, "CATÁLOGO RETRO")
            c.setStrokeColorRGB(0.7, 0.7, 0.7)
            c.line(margen, area_top + 4, ancho - margen, area_top + 4)

        fila = idx_en_pagina // COLS
        col = idx_en_pagina % COLS
        x = margen + col * celda_w
        y = area_top - (fila + 1) * celda_h

        reader = cargar_imagen(path)
        if reader:
            dibujar_ajustada(
                c, reader, x + pad, y + pad, celda_w - 2 * pad, celda_h - 2 * pad
            )

        if (idx_en_pagina == por_pagina - 1) or (i == total - 1):
            pagina_actual = i // por_pagina + 1
            c.setFont("Helvetica", 8)
            c.setFillColorRGB(0.5, 0.5, 0.5)
            c.drawCentredString(ancho / 2, 6 * mm, f"{pagina_actual} / {paginas}")
            c.setFillColorRGB(0, 0, 0)
            c.showPage()

        if (i + 1) % 12 == 0 or i == total - 1:
            print(f"  {i + 1}/{total}")

    c.save()


def main() -> None:
    print(f"Carpeta: {CARPETA}")
    imagenes = recolectar()
    if not imagenes:
        print("No se encontraron imágenes.")
        return
    print(f"Imágenes a incluir: {len(imagenes)}")
    print(f"Generando PDF: {SALIDA}")
    generar_pdf(imagenes, SALIDA)
    print(f"\n¡Listo! PDF creado: {SALIDA}")


if __name__ == "__main__":
    main()
