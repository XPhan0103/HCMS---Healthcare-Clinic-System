import os
import glob
from svglib.svglib import svg2rlg
from reportlab.graphics import renderPM

ux_dir = "Document/03_Design/03_UI/UX"
svg_files = glob.glob(os.path.join(ux_dir, "*.svg"))

for svg in svg_files:
    png = svg.replace(".svg", ".png")
    print(f"Converting {svg} to {png}")
    try:
        drawing = svg2rlg(svg)
        renderPM.drawToFile(drawing, png, fmt='PNG')
    except Exception as e:
        print(f"Error {svg}: {e}")

print("Done converting SVGs.")
