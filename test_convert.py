from svglib.svglib import svg2rlg
from reportlab.graphics import renderPM

def convert_svg_to_png(svg_path, png_path):
    drawing = svg2rlg(svg_path)
    renderPM.drawToFile(drawing, png_path, fmt='PNG')

convert_svg_to_png('Document/03_Design/03_UI/UX/parent_dashboard.svg', 'parent_dashboard.png')
print("Conversion successful")
